// ===== 3.0.4: genética de verdade =====
// Antes cada traço vinha inteiro de um dos pais (ou de uma "mutação" de 4%), e os avós eram sorteados sem relação
// com ninguém. Agora cada pessoa tem dois alelos por traço, um de cada pai:
//  · cabelo: dois alelos de pigmento (0 escuro … 4 claro) e o gene ruivo (MC1R), recessivo. Pais morenos que
//    carregam o gene podem ter um filho ruivo (1 em 4), mas é raro porque poucos carregam.
//  · olhos: castanho (C) domina verde (V), que domina azul (A). Dois pais de olho azul quase sempre têm filho de olho azul.
//  · pele: seis "doses" de melanina, metade de cada pai. O filho fica perto da média dos pais.
//  · sardas: muito mais comuns em quem carrega o gene ruivo.
// As frequências dos alelos saem das tabelas de população de cada país (POP), pela regra de Hardy-Weinberg.

const GEN_PIG=['preto','castanho-escuro','castanho','castanho-claro','loiro'];
function genPop(cid){ return POP[cid]||POP.BR; }
// frequência do alelo ruivo: q² = proporção de ruivos
const genQRuivo=cid=>{ const h=genPop(cid).hair, t=h.reduce((a,b)=>a+b,0)||1; return Math.sqrt((h[5]||0)/t); };
// sorteia um alelo de pigmento com a distribuição de cabelo não-ruivo do país (pele escura puxa para escuro)
function genPigAlelo(cid,dk){ const h=genPop(cid).hair.slice(0,5); return R.wpick(h.map((w,i)=>[i,(w+(i===0?.5:0))*(dk&&i>=3?.05:1)])); }
// olhos: frequências dos grupos castanho / verde / azul viram alelos
function genOlhoAlelo(cid,dk){ const e=genPop(cid).eyes, t=e.reduce((a,b)=>a+b,0)||1;
  const az=(e[4]+e[6])/t*(dk?.1:1), vd=e[3]/t*(dk?.1:1), qA=Math.sqrt(az), qV=Math.max(0,Math.sqrt(az+vd)-qA);
  const r=R.f(); return r<qA?'A':r<qA+qV?'V':'C'; }
function genPeleDoses(s){ const d=[0,0,0,0,0,0]; const idx=R.shuffle([0,1,2,3,4,5]).slice(0,Math.max(0,Math.min(6,s))); idx.forEach(i=>d[i]=1); return d; }

// genótipo novo de alguém sem pais conhecidos
function genFundador(cid,skin){ const dk=skin>=4, q=genQRuivo(cid);
  return {pig:[genPigAlelo(cid,dk),genPigAlelo(cid,dk)],mc1r:[R.chance(dk?q*.15:q),R.chance(dk?q*.15:q)],olho:[genOlhoAlelo(cid,dk),genOlhoAlelo(cid,dk)],pele:genPeleDoses(skin)}; }

// o que aparece por fora
function genFenotipo(dna,ge,id){ const h=(id??0)*2654435761>>>0;
  const ruivo=dna.mc1r[0]&&dna.mc1r[1];
  const pig=Math.round((dna.pig[0]+dna.pig[1])/2+((h%7)-3)/12);
  ge.hair=ruivo?'ruivo':GEN_PIG[Math.max(0,Math.min(4,pig))];
  const o=dna.olho, temC=o.includes('C'), temV=o.includes('V');
  ge.eyes=temC?(pig<=0?(h%3?'castanho-escuros':'pretos'):pig>=3&&!o.every(x=>x==='C')?(h%2?'cor de mel':'castanhos'):(h%4===0?'castanho-escuros':'castanhos')):temV?'verdes':(h%6===0?'acinzentados':'azuis');
  ge.skin=dna.pele.reduce((a,b)=>a+b,0);
  return ge; }

// genótipo que explica uma aparência já existente (saves antigos e escolhas do jogador)
function genDeFenotipo(ge,cid){ const s=ge.skin??2, dna=genFundador(cid,s), i=GEN_PIG.indexOf(ge.hair);
  if(ge.hair==='ruivo') dna.mc1r=[true,true]; else { if(dna.mc1r[0]&&dna.mc1r[1]) dna.mc1r[R.int(0,1)]=false; if(i>=0) dna.pig=[i,i]; }
  const e=ge.eyes; if(['verdes'].includes(e)) dna.olho=[ 'V',R.chance(.5)?'V':'A']; else if(['azuis','acinzentados'].includes(e)) dna.olho=['A','A']; else if(!dna.olho.includes('C')) dna.olho[R.int(0,1)]='C';
  dna.pele=genPeleDoses(s); return dna; }
function genDna(p){ if(!p||!p.genes) return null; if(!p.genes.dna) p.genes.dna=genDeFenotipo(p.genes,p.country||(S&&S.me&&S.me.country)||'BR'); return p.genes.dna; }

// um alelo de cada pai
function genFilho(da,db){ const um=(x)=>x[R.int(0,1)];
  return {pig:[um(da.pig),um(db.pig)],mc1r:[um(da.mc1r),um(db.mc1r)],olho:[um(da.olho),um(db.olho)],pele:da.pele.map((_,i)=>R.chance(.5)?da.pele[i]:db.pele[i])}; }
const genSardas=(dna,skin)=>{ const n=dna.mc1r.filter(Boolean).length; return R.chance(n===2?.75:n===1?.2:skin<=1?.05:.02); };

randGenes=(o=>function(gender,cid){ const g=o.apply(this,arguments); const c=cid||(typeof S!=='undefined'&&S&&S.me?S.me.country:'BR');
  g.dna=genFundador(c,g.skin); genFenotipo(g.dna,g,R.int(0,1e6)); g.freckles=genSardas(g.dna,g.skin); return g; })(randGenes);

childOf=(o=>function(a,b,gender){ const r=o.apply(this,arguments);
  try{ const da=genDna(a), db=genDna(b); if(!da||!db) return r; const g=r.genes; g.dna=genFilho(da,db); genFenotipo(g.dna,g,R.int(0,1e6));
    g.freckles=genSardas(g.dna,g.skin)||((a.genes.freckles||b.genes.freckles)&&R.chance(.25));
    const de=k=>g[k]===a.genes[k]&&g[k]!==b.genes[k]?a.first:g[k]===b.genes[k]&&g[k]!==a.genes[k]?b.first:g[k]===a.genes[k]?(R.chance(.5)?a.first:b.first):null;
    g.from=Object.assign({},g.from,{hair:de('hair'),eyes:de('eyes')}); }catch(e){} return r; })(childOf);

// avós que de fato geraram os pais: em cada casal de avós, um deu o primeiro alelo do pai/mãe e o outro, o segundo
function genFamiliaAvos(){ const mae=people('mae')[0], pai=people('pai')[0], avos=S.people.filter(p=>p.rel==='avo'&&p.genes);
  const lados=[[mae||pai,avos.slice(0,2)],[pai||mae,avos.slice(2,4)]];
  for(const [filho,grupo] of lados){ if(!filho||!filho.genes) continue; const d=genDna(filho), cid=filho.country||'BR', dk=(filho.genes.skin||0)>=4, q=genQRuivo(cid);
    const k={pig:R.int(0,1),mc1r:R.int(0,1),olho:R.int(0,1)};
    grupo.forEach((v,j)=>{ const t=x=>j===0?k[x]:1-k[x]; v.lado=filho===mae?'mae':'pai';
      v.genes.dna={pig:[d.pig[t('pig')],genPigAlelo(cid,dk)],mc1r:[d.mc1r[t('mc1r')],R.chance(dk?q*.15:q)],olho:[d.olho[t('olho')],genOlhoAlelo(cid,dk)],pele:d.pele.map(x=>R.chance(.7)?x:R.int(0,1))};
      genFenotipo(v.genes.dna,v.genes,v.id); v.genes.freckles=genSardas(v.genes.dna,v.genes.skin); }); } }
newLife=(o=>function(){ const r=o.apply(this,arguments); try{ if(S&&S.me&&!S.scen) genFamiliaAvos(); }catch(e){} return r; })(newLife);

// Criar aparência no bebê: a família muda junto para explicar o que eu escolhi
function genRefazerFamilia(){ const m=S.me, mae=people('mae')[0], pai=people('pai')[0]; if(!m||m.age>2) return;
  const d=m.genes.dna=genDeFenotipo(m.genes,m.country); m.genes.from={};
  const ajusta=(p,lado)=>{ if(!p||!p.genes) return; const pd=genDna(p), i=R.int(0,1);
    pd.pig[i]=d.pig[lado]; pd.mc1r[i]=d.mc1r[lado]; pd.olho[i]=d.olho[lado];
    pd.pele=pd.pele.map((x,k)=>R.chance(.5)?d.pele[k]:x);
    if(m.genes.hair==='ruivo') pd.mc1r[i]=true;
    genFenotipo(pd,p.genes,p.id); if(m.genes.freckles&&R.chance(.5)) p.genes.freckles=true; };
  ajusta(mae,0); ajusta(pai,1);
  if(m.genes.freckles&&mae&&!mae.genes.freckles&&!(pai&&pai.genes.freckles)) (pai&&R.chance(.5)?pai:mae).genes.freckles=true;
  if(mae&&pai){ const dh=(m.genes.h-(m.genes.hAntes??m.genes.h))/2; if(dh){ mae.genes.h=Math.round(mae.genes.h+dh); pai.genes.h=Math.round(pai.genes.h+dh); } }
  delete m.genes.hAntes;
  // irmãos nascem de novo dos mesmos pais (mesma idade, nome e laço); avós passam a explicar os pais
  const pm=mae||pai, pp=pai||mae;
  if(pm&&pp) for(const k of people('irmao').filter(k=>!k.meio)){ const g=k.genes; if(!g) continue; g.dna=genFilho(genDna(pm),genDna(pp)); genFenotipo(g.dna,g,k.id); g.freckles=genSardas(g.dna,g.skin); }
  genFamiliaAvos(); }

function geneticaSelfTest(){ const s0=S,ns=window.NO_SAVE; window.NO_SAVE=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); };
  try{ newLife({country:'BR'}); const m=S.me;
    const P2=(g)=>({first:'X',gender:'F',country:'BR',genes:g});
    const casal=(pa,pb)=>{ let n=0, ruivos=0, azuis=0; for(let i=0;i<4000;i++){ const f=childOf(pa,pb,'M').genes; n++; if(f.hair==='ruivo') ruivos++; if(f.eyes==='azuis'||f.eyes==='acinzentados') azuis++; } return {ruivos:ruivos/n,azuis:azuis/n}; };
    // dois pais morenos sem o gene: nunca ruivo; os dois portadores: perto de 1 em 4
    const moreno=()=>{ const g=randGenes('F','BR'); g.dna={pig:[1,1],mc1r:[false,false],olho:['C','C'],pele:[1,1,0,0,0,0]}; genFenotipo(g.dna,g,1); return g; };
    const a=P2(moreno()), b=P2(moreno()); let r=casal(a,b); ok(r.ruivos===0&&r.azuis===0,'pais morenos sem o gene tiveram filho ruivo ou de olho azul: '+JSON.stringify(r));
    a.genes.dna.mc1r=[true,false]; b.genes.dna.mc1r=[false,true]; a.genes.dna.olho=['C','A']; b.genes.dna.olho=['C','A']; r=casal(a,b);
    ok(r.ruivos>.18&&r.ruivos<.32,'portadores do gene ruivo fora de 1 em 4: '+r.ruivos); ok(r.azuis>.18&&r.azuis<.32,'olho azul de pais portadores fora de 1 em 4: '+r.azuis);
    // população: ruivo raro no Brasil, mais comum no Reino Unido, inexistente no Japão
    const pop=c=>{ let n=0; for(let i=0;i<6000;i++) if(randGenes('F',c).hair==='ruivo') n++; return n/6000; };
    const br=pop('BR'), gb=pop('GB'), jp=pop('JP'); ok(br<.06&&gb>br&&jp===0,'frequência de ruivos estranha: BR '+br+' GB '+gb+' JP '+jp);
    // pele do filho perto da média dos pais
    const cl=P2(randGenes('F','BR')), es=P2(randGenes('M','BR')); cl.genes.dna.pele=[0,0,0,0,0,0]; es.genes.dna.pele=[1,1,1,1,1,1]; let soma=0; for(let i=0;i<500;i++) soma+=childOf(cl,es,'F').genes.skin; ok(Math.abs(soma/500-3)<.4,'pele do filho longe da média dos pais: '+soma/500);
    // avós explicam os pais: cada pai tem ao menos um alelo de olho de um avô do seu lado
    const mae=people('mae')[0]; for(const v of S.people.filter(p=>p.rel==='avo'&&p.lado==='mae')) ok(v.genes.dna.olho.some(x=>genDna(mae).olho.includes(x)),'avó/avô sem relação com a mãe');
    // criar aparência no bebê: escolho ruivo de olho azul e os pais passam a carregar os genes
    m.age=0; m.genes.hair='ruivo'; m.genes.eyes='azuis'; genRefazerFamilia(); const pai=people('pai')[0];
    ok(genDna(mae).mc1r.includes(true)&&(!pai||genDna(pai).mc1r.includes(true)),'pais não carregam o gene ruivo do bebê');
    ok(genDna(mae).olho.includes('A')&&(!pai||genDna(pai).olho.includes('A')),'pais não carregam o olho azul do bebê');
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; }
  if(erros.length) throw Error('Genética 3.0.4 · '+erros.join(' | ')); return {ok:true}; }
