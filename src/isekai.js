// ===== Isekai completo: atributos por nível, grimório de magias e a sua própria vila =====
const ATTRS={for:['Força','💪','Dano corpo a corpo'],mag:['Magia','🔮','Poder e custo das magias'],agi:['Agilidade','🏃','Esquiva e sorte nas masmorras'],vit:['Vitalidade','🛡️','Menos dano recebido']};
const CLS_AT={guerreiro:{for:4,vit:2},mago:{mag:5,agi:1},arqueiro:{agi:4,for:2},clerigo:{mag:3,vit:3},ladino:{agi:5,for:1}};
const CLS_SP={guerreiro:['grito'],mago:['fogo','luz'],arqueiro:['olho'],clerigo:['cura','escudo'],ladino:['sombra']};
// magias: [nome, ícone, mana, nível mínimo, tipo, descrição]
const SPELLS={
  luz:['Luz Guia','💡',10,1,'luz','Explorar com menos risco e mais tesouro hoje'],
  cura:['Cura','💚',15,1,'cura','Recupera vida'],
  fogo:['Bola de Fogo','🔥',20,1,'atq','+força de combate hoje'],
  grito:['Grito de Guerra','📯',15,1,'atq','+força de combate hoje e ânimo do grupo'],
  olho:['Olho de Águia','🦅',15,1,'luz','Acha tesouros e evita emboscadas'],
  sombra:['Passo Sombrio','🌑',15,1,'def','Esquiva: metade do dano hoje'],
  escudo:['Escudo Arcano','🛡️',20,2,'def','Metade do dano recebido hoje'],
  crescer:['Crescimento','🌱',25,4,'vila','Colheita farta na sua vila'],
  raio:['Relâmpago','⚡',30,5,'atq2','Muito mais força de combate hoje'],
  invocar:['Invocar Espírito','👻',35,6,'aliado','Um espírito luta ao seu lado hoje'],
  transmutar:['Transmutação','🪙',45,7,'ouro','Transforma pedra em ouro'],
  teleporte:['Teleporte','🌀',40,8,'tele','Viaja na hora para a próxima região'],
  nevasca:['Nevasca','❄️',45,10,'atq2','Congela exércitos inteiros'],
  muralha:['Muralha de Pedra','🧱',40,9,'vila2','Defesa extra para a vila'],
  meteoro:['Meteoro Arcano','☄️',70,15,'atq3','Poder devastador hoje'],
  ressurreicao:['Ressurreição','✨',90,15,'reviver','Traz de volta um companheiro caído'],
};
const iskAt=sc=>sc.at||(sc.at={for:5,mag:5,agi:5,vit:5});
const vB=(sc,k)=>sc.vila&&sc.vila.b[k]||0;
function iskEnsure(sc){ if(!sc||sc.id!=='isekai') return; iskAt(sc); sc.pts=sc.pts||0; sc.sp=sc.sp||[]; sc.mu=sc.mu||{}; sc.buff=sc.buff||{};
  if(sc.cls&&!sc.clsOk){ sc.clsOk=1; const b=CLS_AT[sc.cls]||{}; for(const k in b) sc.at[k]+=b[k]; (CLS_SP[sc.cls]||[]).forEach(s=>{ if(!sc.sp.includes(s)) sc.sp.push(s); }); } }
const spRank=(sc,id)=>1+Math.min(2,Math.floor((sc.mu[id]||0)/5));
const spCost=(sc,id)=>Math.max(5,Math.round(SPELLS[id][2]*(1-iskAt(sc).mag*.012)));
function learnSpell(sc,quiet){ const can=Object.keys(SPELLS).filter(id=>!sc.sp.includes(id)&&SPELLS[id][3]<=sc.lvl); if(!can.length) return ''; const id=R.pick(can); sc.sp.push(id); const t=`Aprendi a magia ${SPELLS[id][1]} ${SPELLS[id][0]}!`; if(!quiet) scLog(t,'good'); return t; }
function castSpell(id){ const sc=S.scen, sp=SPELLS[id], m=S.me; iskEnsure(sc); const cost=spCost(sc,id), rk=spRank(sc,id), mg=iskAt(sc).mag;
  if(sc.mana<cost) return 'Mana insuficiente.'; scStat('mana',-cost); sc.done['sp_'+id]=1; sc.mu[id]=(sc.mu[id]||0)+1; const up=sc.mu[id]%5===0&&sc.mu[id]<=10?` A magia subiu para o rank ${spRank(sc,id)}!`:'';
  scStat('xp',5+rk*3);
  switch(sp[4]){
    case 'luz': sc.buff.luz=1; return `${sp[1]} Uma luz suave me guia. Hoje vou achar mais coisas e cair em menos armadilhas.`+up;
    case 'cura': { const v=12+mg*2+rk*6; scStat('hl',v); crew().forEach(c=>c.hp=Math.min(100,c.hp+Math.round(v/2))); return `${sp[1]} Luz verde fechou as feridas: +${v} de vida, e o grupo também melhorou.`+up; }
    case 'atq': sc.buff.atq=(sc.buff.atq||0)+8+rk*4+Math.round(mg/3); if(id==='grito') crew().forEach(c=>c.lv=Math.min(100,c.lv+4)); return `${sp[1]} ${sp[0]} pronta. Hoje bato mais forte.`+up;
    case 'atq2': sc.buff.atq=(sc.buff.atq||0)+15+rk*6+Math.round(mg/2); return `${sp[1]} O ar estala de poder. Que venham os monstros.`+up;
    case 'atq3': sc.buff.atq=(sc.buff.atq||0)+30+rk*8+mg; return `${sp[1]} O céu escurece. Ninguém em Eldoria quer me enfrentar hoje.`+up;
    case 'def': sc.buff.def=1; return `${sp[1]} ${sp[0]} ativo: o dano de hoje cai pela metade.`+up;
    case 'aliado': sc.buff.atq=(sc.buff.atq||0)+12+rk*5; return `${sp[1]} Um espírito antigo se curva e caminha ao meu lado até o fim do dia.`+up;
    case 'ouro': { const v=20+mg*4+rk*15; sc.ouro+=v; return `${sp[1]} Pedras viraram ${v} moedas de ouro. Os alquimistas odeiam este truque.`+up; }
    case 'tele': { if(sc.rota>=ISK_ROUTE.length-1) return 'Não há mais para onde ir. Só o castelo.'; sc.rota++; sc.loc=SM().place(sc); return `${sp[1]} Um piscar de olhos e cheguei a ${ISK_ROUTE[sc.rota][0]}.`+up; }
    case 'vila': { if(!sc.vila) return `${sp[1]} Fiz flores brotarem no meio da estrada. Bonito, mas eu precisava de uma vila para isso valer a pena.`; sc.vila.com+=25+rk*10+mg; return `${sp[1]} As plantações da vila cresceram numa noite. +${25+rk*10+mg} de comida.`+up; }
    case 'vila2': { if(!sc.vila) return `${sp[1]} Ergui uma muralha no meio do nada. Os coelhos agradecem.`; sc.vila.extraDef=(sc.vila.extraDef||0)+10+rk*5; return `${sp[1]} Paredes de pedra saíram do chão em volta da vila.`+up; }
    case 'reviver': { const f=(sc.fallen||[]).pop(); if(!f) return `${sp[1]} Não há ninguém para trazer de volta. Que bom.`; f.hp=60; sc.crew.push(f); return `${sp[1]} ${f.first} abriu os olhos de novo. Chorou. Eu também.`+up; }
  } return ''; }
// ---------- integração ----------
SCEN.isekai.maxDays=Infinity;
// em Eldoria não existe acordar: quem morre lá, morre de verdade. A única volta é o portal, depois de derrotar o Rei Demônio
scCheck=(o=>function(){ const sc=S.scen; if(!sc||sc.id!=='isekai') return o();
  if(sc.san<=0){ sc.san=25; scHurt(30); scLog('A mente desabou de exaustão. Desmaiei por um dia inteiro e acordei ferid'+oa()+'.','bad'); }
  if(sc.hl>0) return o();
  const d=SCEN.isekai; scLog('Tudo ficou escuro. Desta vez, não houve luz branca nem deusa. Só silêncio.','bad');
  const days=sc.dia, lv=sc.lvl, cls=sc.cls?clsName(sc.cls).toLowerCase():'aventureir'+oa(); S.scen=null; S.pending=S.pending.filter(e=>!(EVENTS[e.id]&&EVENTS[e.id].scen));
  log(`⚔️ Vivi ${days} dias em Eldoria como ${cls} de nível ${lv}.`,'warn'); die(`em Eldoria, longe do próprio mundo, como ${cls} de nível ${lv}`); UI.close(); })(scCheck);
SCEN.isekai.init=(i0=>m=>Object.assign(i0(m),{at:{for:5,mag:5,agi:5,vit:5},pts:0,sp:[],mu:{},buff:{},vila:null,fallen:[]}))(SCEN.isekai.init);
SCEN.isekai.pow=(sc,m)=>{ const a=iskAt(sc); return 6+sc.lvl*2.2+a.for*1.1+a.agi*.6+myDmg()*.7+sc.arm*5+crew().reduce((s,c)=>s+5+(c.arma?itV(c.arma.id)*.3:0),0)+m.fight*.08+(sc.buff&&sc.buff.atq||0)+vB(sc,'ferraria')*3; };
SCEN.isekai.upkeep=(u0=>sc=>{ iskEnsure(sc); sc.buff={}; u0(sc); vilaDay(sc); scStat('mana',Math.round(iskAt(sc).mag/2)); })(SCEN.isekai.upkeep);
SCEN.isekai.hdr=sc=>[`💰 ${sc.ouro}`,`Nível ${sc.lvl}${sc.pts?' · +'+sc.pts+' pts':''}`];
SCEN.isekai.goal=sc=>sc.hero?[sc.vila?`Vila de ${sc.vila.nome}`:'Herói de Eldoria',sc.vila?`${sc.vila.pop} moradores · felicidade ${sc.vila.fel}%`:'O Rei Demônio caiu. Funde sua vila ou volte para casa.',sc.vila?sc.vila.fel:100]
  :['Castelo do Rei Demônio',`Região ${sc.rota+1} de ${ISK_ROUTE.length} · nível ${sc.lvl}`,Math.round(sc.rota/(ISK_ROUTE.length-1)*100)];
SCEN.isekai.acts.portal={ic:'🌀',l:'Abrir o portal de volta para casa',s:'Só depois de derrotar o Rei Demônio',min:sc=>!!sc.hero,why:'O portal só abre para quem derrotou o Rei Demônio.',ap:0,fn:sc=>{ scenEnd(true,'Atravessei o portal. Eldoria vai sentir minha falta, e eu dela.'); return ''; }};
scHurt=(o=>function(n){ const sc=S.scen; if(sc&&sc.id==='isekai'){ iskEnsure(sc); n=Math.round(n*(1-Math.min(.45,iskAt(sc).vit*.015))*(sc.buff.def?.5:1)); } return o(n); })(scHurt);
lvlUp=(o=>function(){ const sc=S.scen; if(!sc||sc.id!=='isekai') return o(); iskEnsure(sc); const l0=sc.lvl; let t=o(); const g=sc.lvl-l0;
  if(g>0){ sc.pts+=3*g; t+=` Ganhei ${3*g} pontos de atributo.`; for(let l=l0+1;l<=sc.lvl;l++) if(l%3===0){ const s=learnSpell(sc,true); if(s) t+=' '+s; } scLog(t.trim(),'good'); } return t; })(lvlUp);
scTok=(o=>function(tok,d,out){ const sc=S.scen; let mm;
  if(sc&&sc.id==='isekai'&&(mm=tok.match(/^v(fel|pop|com|def)([+-]\d+)$/))){ const v=sc.vila; if(v){ const n=+mm[2]; if(mm[1]==='fel') v.fel=Math.max(0,Math.min(100,v.fel+n)); else if(mm[1]==='pop') v.pop=Math.max(1,v.pop+n); else if(mm[1]==='com') v.com=Math.max(0,v.com+n); else v.mil=Math.max(0,(v.mil||0)+n); } return true; }
  if(sc&&sc.id==='isekai'&&tok==='spell'){ iskEnsure(sc); const t=learnSpell(sc,true); if(t) out.push(t); return true; }
  if(sc&&sc.id==='isekai'&&(mm=tok.match(/^at\.(for|mag|agi|vit)([+-]\d+)$/))){ iskAt(sc)[mm[1]]=Math.max(1,iskAt(sc)[mm[1]]+ +mm[2]); return true; }
  if(sc&&sc.id==='isekai'&&tok==='pts+'){ sc.pts=(sc.pts||0)+2; return true; }
  return o(tok,d,out); })(scTok);
scChance=(o=>function(key){ const sc=S.scen; if(sc&&sc.id==='isekai'&&['for','mag','agi','vit'].includes(key)) return 25+iskAt(sc)[key]*2.5; if(sc&&sc.id==='isekai'&&key==='vfel') return sc.vila?sc.vila.fel:50; if(sc&&sc.id==='isekai'&&key==='vdef') return sc.vila?Math.min(95,vilaDef(sc.vila)):30; return o(key); })(scChance);
crewLeave=(o=>function(c,why,dead){ const sc=S.scen; if(sc&&sc.id==='isekai'&&dead){ sc.fallen=sc.fallen||[]; sc.fallen.push(Object.assign({},c,{arma:null})); } return o(c,why,dead); })(crewLeave);
// ---------- telas ----------
V.iskMe=()=>{ const sc=S.scen, m=S.me; iskEnsure(sc); const a=iskAt(sc), need=sc.lvl*100;
  const it=[{html:`<div class="card" style="display:flex;gap:12px;align-items:center">${faceSVG(m,64)}<div style="flex:1"><p><b>${esc(m.first)}</b> · ${sc.cls?esc(clsName(sc.cls)):'sem classe'} · nível ${sc.lvl}</p>${bar('Experiência',Math.round(sc.xp/need*100))}<p style="color:var(--muted);font-size:12.5px">${sc.xp} de ${need} XP · rank ${'FEDCBAS'[sc.rank||0]} na guilda · força de combate ${scPow()}</p></div></div>`},
    {sec:sc.pts?`Atributos · ${sc.pts} ponto(s) para distribuir`:'Atributos'}];
  Object.entries(ATTRS).forEach(([k,[n,ic,d]])=>it.push({ic,l:`${n}: ${a[k]}`,s:d,r:sc.pts?'＋':'',dis:!sc.pts,why:'Suba de nível para ganhar pontos.',on:()=>{ sc.pts--; a[k]++; UI.refresh(); render(); }}));
  if(sc.cls){ it.push({sec:'Habilidades da classe'}); CLASSES[sc.cls].sk.forEach((s,i)=>it.push({ic:sc.lvl>=(i+1)*5?'⭐':'🔒',l:s,s:sc.lvl>=(i+1)*5?'Aprendida':`Nível ${(i+1)*5}`,dis:sc.lvl<(i+1)*5,why:`Libera no nível ${(i+1)*5}.`})); }
  it.push({sec:'Equipamento'},{ic:'⚔️',l:'Trocar de arma',s:sc.arma?`${itN(sc.arma.id)} (${sc.arma.hp}%)`:'Nenhuma',on:()=>UI.push(V.scMe)});
  return {title:'Ficha do herói',items:it}; };
V.iskMagic=()=>{ const sc=S.scen; iskEnsure(sc); const it=[{html:`<div class="card">${bar('Mana',Math.round(sc.mana))}<p style="color:var(--muted);font-size:12.5px">Magias não gastam energia, só mana. Cada uma pode ser lançada uma vez por dia e sobe de rank com o uso. Novas magias: a cada 3 níveis, na Academia arcana e na Torre de magia da sua vila.</p></div>`},{sec:'Grimório'}];
  sc.sp.forEach(id=>{ const s=SPELLS[id], c=spCost(sc,id), done=!!sc.done['sp_'+id];
    it.push({ic:s[1],l:`${s[0]} ${'I'.repeat(spRank(sc,id))}`,s:`${s[5]} · ${c} de mana`,r:done?'✓':'',dis:done||sc.mana<c,why:done?'Já lancei essa magia hoje.':'Mana insuficiente. Medite, descanse ou tome uma poção de mana.',on:()=>scAct(()=>castSpell(id),s[0])}); });
  const lock=Object.keys(SPELLS).filter(id=>!sc.sp.includes(id)); if(lock.length){ it.push({sec:'Ainda não aprendi'}); lock.forEach(id=>it.push({ic:'🔒',l:SPELLS[id][0],s:`Nível ${SPELLS[id][3]}+ · ${SPELLS[id][5]}`,dis:true,why:'Aprenda subindo de nível, na Academia arcana ou na Torre de magia da vila.'})); }
  return {title:'Magias',items:it}; };
V.scActs=(o=>()=>{ const r=o(), sc=S.scen; if(!sc||sc.id!=='isekai') return r; iskEnsure(sc);
  r.items.splice(1,0,{sec:'Herói'},{ic:'🧝',l:'Ficha do herói',s:`Nível ${sc.lvl}${sc.pts?` · ${sc.pts} ponto(s) para distribuir!`:''}`,tone:sc.pts?'good':'',on:()=>UI.push(V.iskMe)},
    {ic:'📖',l:'Magias',s:`${sc.sp.length} magia(s) · mana ${Math.round(sc.mana)}%`,on:()=>UI.push(V.iskMagic)},
    {ic:'🏘️',l:'Minha vila',s:sc.vila?`${sc.vila.nome} · ${sc.vila.pop} moradores · felicidade ${Math.round(sc.vila.fel)}%`:'Funde sua própria vila (nível 4, 250 moedas)',on:()=>UI.push(V.iskVila)});
  return r; })(V.scActs);
V.scCrew=(o=>()=>{ const r=o(), sc=S.scen; if(sc&&sc.id==='isekai'&&r.items[0]) r.items[0].on=()=>UI.push(V.iskMe); return r; })(V.scCrew);
// ---------- morar numa cidade que já existe (você aparece numa delas, sorteada) ----------
const ISK_TOWNS={aurora:['Vila de Aurora','🏡',0,150,'com','Comida farta: a fome sobe menos'],valmor:['Valmor, a capital','🏰',2,400,'ouro','+15 de ouro por dia (aluguel de quartos)'],
  ferro:['Ferro Fundo, cidade dos anões','⛰️',3,300,'pow','+4 de força de combate (armas anãs)'],aerion:['Aerion, a cidade flutuante','☁️',6,500,'arc','+6 de XP e +6 de mana por dia']};
const TOWN_JOBS={aurora:['ajudei na colheita','cuidei das ovelhas do vizinho','consertei o telhado da padaria'],lumen:['colhi ervas com os druidas','cantei no coral élfico','vigiei as árvores sagradas'],
  valmor:['fiz a ronda com a guarda real','carreguei caixas no porto','ensinei esgrima para nobres mimados'],ferro:['martelei na forja dos anões','escavei um túnel novo','provei cervejas para o mestre cervejeiro'],
  ashar:['escoltei uma caravana até o poço','negociei especiarias','domei um camelo bravo'],aerion:['dei aula na academia flutuante','limpei os cristais que mantêm a cidade no ar','entreguei cartas voando de grifo']};
const townOf=sc=>sc.morada&&ISK_TOWNS[sc.morada];
const atHome=sc=>{ const t=townOf(sc); return !!t&&sc.rota===t[2]; };
SCEN.isekai.init=(i0=>m=>{ const o=i0(m); const k=R.wpick([['aurora',4],['valmor',3],['ferro',2],['aerion',2]]); return Object.assign(o,{nasc:k,morada:k,rota:ISK_TOWNS[k][2],casa:0,trep:{}}); })(SCEN.isekai.init);
SCEN.isekai.start=(s0=>sc=>{ s0(sc); const t=ISK_TOWNS[sc.morada]; if(t) scLog(`Acordei em ${t[0]}. Um casal de velhinhos me deu um quarto até eu me ajeitar.`,'good'); })(SCEN.isekai.start);
SCEN.isekai.pow=(p0=>(sc,m)=>p0(sc,m)+(sc.casa&&!sc.vila&&townOf(sc)&&townOf(sc)[4]==='pow'?4:0))(SCEN.isekai.pow);
SCEN.isekai.upkeep=(u0=>sc=>{ u0(sc); const t=townOf(sc); if(!t||!sc.casa||sc.vila) return;
  ({com:()=>scStat('fome',-5),mana:()=>scStat('mana',10),ouro:()=>{ sc.ouro+=15; },ouro2:()=>{ sc.ouro+=10; },arc:()=>{ scStat('xp',6); scStat('mana',6); },pow:()=>{}})[t[4]](); })(SCEN.isekai.upkeep);
scTok=(o=>function(tok,d,out){ const sc=S.scen; let mm; if(sc&&sc.id==='isekai'&&(mm=tok.match(/^trep([+-]\d+)$/))){ if(townOf(sc)){ sc.trep=sc.trep||{}; sc.trep[sc.morada]=Math.max(0,Math.min(100,(sc.trep[sc.morada]||20)+ +mm[1])); } return true; } return o(tok,d,out); })(scTok);
scVar=(o=>function(k){ const sc=S.scen; if(sc&&sc.id==='isekai'&&k==='cidade') return townOf(sc)?townOf(sc)[0]:'a cidade'; return o(k); })(scVar);
scChance=(o=>function(key){ const sc=S.scen; if(sc&&sc.id==='isekai'&&key==='trep') return sc.trep&&sc.morada?(sc.trep[sc.morada]||20):20; return o(key); })(scChance);
vilaFound=(o=>function(nome){ o(nome); const sc=S.scen; if(sc.casa&&townOf(sc)){ const v=Math.round(townOf(sc)[3]/2); sc.ouro+=v; scLog(`Vendi minha casa em ${townOf(sc)[0]} por ${v} moedas.`); } sc.casa=0; sc.morada='vila'; })(vilaFound);
V.iskLar=()=>{ const sc=S.scen; iskEnsure(sc); if(sc.vila) return V.iskVila(); sc.trep=sc.trep||{}; const t=townOf(sc), it=[];
  if(t){ const rep=sc.trep[sc.morada]||20, here=atHome(sc);
    it.push({html:`<div class="card"><p><b>${t[1]} ${esc(t[0])}</b></p>${kv('Onde moro',sc.casa?'Casa própria':'Quarto emprestado')}${bar('Reputação na cidade',rep)}${kv('Benefício da casa própria',t[5])}${kv('Agora estou',here?'Em casa':'Longe de casa ('+ISK_ROUTE[sc.rota][0]+')')}</div>`});
    it.push({sec:'Vida na cidade'});
    const once=k=>!!sc.done['t_'+k], far='Estou longe de casa. Preciso estar na mesma região.';
    it.push({ic:'💼',l:'Trabalhar na cidade',s:'Ouro e reputação · 1 de energia',dis:!here||once('job')||sc.ap<1,why:!here?far:once('job')?'Já trabalhei hoje.':'Sem energia hoje.',on:()=>scAct(()=>{ sc.done.t_job=1; sc.ap--; const o2=rnd(20,40)+Math.round(rep/3); sc.ouro+=o2; sc.trep[sc.morada]=Math.min(100,rep+4); return `Hoje ${R.pick(TOWN_JOBS[sc.morada])}. Ganhei ${o2} moedas.`; },t[0])});
    it.push({ic:'🤝',l:'Ajudar os moradores',s:'Reputação e carma',dis:!here||once('aj'),why:!here?far:'Já ajudei hoje.',on:()=>scAct(()=>{ sc.done.t_aj=1; sc.trep[sc.morada]=Math.min(100,rep+7); S.me.karma=clamp(S.me.karma+2); return R.pick(['Ajudei uma senhora a carregar abóboras. Ela me deu uma bênção e um pedaço de torta.','Achei o gato do ferreiro em cima do sino da praça.','Consertei a roda da carroça do leiteiro.']); },t[0])});
    it.push({ic:'🛏️',l:sc.casa?'Descansar em casa':'Descansar no quarto emprestado',s:sc.casa?'Vida, mana e ânimo':'Um pouco de vida',dis:!here||once('desc'),why:!here?far:'Já descansei hoje.',on:()=>scAct(()=>{ sc.done.t_desc=1; scStat('hl',sc.casa?25:10); scStat('mana',sc.casa?20:5); scStat('san',sc.casa?8:3); return sc.casa?'Cama própria, lareira acesa e silêncio. Melhor lugar de Eldoria.':'O casal de velhinhos fez sopa. Dormi feito pedra.'; },t[0])});
    if(!sc.casa) it.push({ic:'🏠',l:`Comprar uma casa em ${t[0]}`,s:`${t[3]} moedas · ativa o benefício da cidade`,dis:sc.ouro<t[3]||!here,why:!here?far:`Preciso de ${t[3]} moedas.`,on:()=>scAct(()=>{ sc.ouro-=t[3]; sc.casa=1; sc.trep[sc.morada]=Math.min(100,rep+10); return `Comprei uma casa em ${t[0]}! Porta de madeira, janela redonda e uma vista linda.`; },t[0])}); }
  it.push({sec:'Mudar de cidade'});
  Object.entries(ISK_TOWNS).filter(([k])=>k!==sc.morada).forEach(([k,c])=>{ const here=sc.rota===c[2];
    it.push({ic:c[1],l:c[0],s:`Casa: ${c[3]} moedas · ${c[5]}`,dis:!here||sc.ouro<c[3],why:!here?`Preciso estar em ${ISK_ROUTE[c[2]][0]} para comprar casa lá.`:`Preciso de ${c[3]} moedas.`,
      on:()=>confirmBox('Mudar?',`Comprar uma casa em ${c[0]} e me mudar para lá?${sc.casa?' Vendo a casa atual pela metade do preço.':''}`,'Mudar',()=>scAct(()=>{ if(sc.casa&&townOf(sc)) sc.ouro+=Math.round(townOf(sc)[3]/2); sc.ouro-=c[3]; sc.morada=k; sc.casa=1; return `Me mudei para ${c[0]}. Vida nova em mundo novo, de novo.`; },c[0]))}); });
  it.push({sec:'Minha própria vila'},{ic:'🏘️',l:'Fundar minha vila',s:'250 moedas · nível 4 · vende a casa atual',on:()=>UI.push(V.iskVila)});
  return {title:'Meu lar',items:it}; };
V.scActs=(o=>()=>{ const r=o(), sc=S.scen; if(!sc||sc.id!=='isekai') return r; const row=r.items.find(x=>x&&x.l==='Minha vila');
  if(row){ const t=townOf(sc); row.l='Meu lar'; row.s=sc.vila?`${sc.vila.nome} · ${sc.vila.pop} moradores · felicidade ${Math.round(sc.vila.fel)}%`:t?`${t[0]} · ${sc.casa?'casa própria':'quarto emprestado'}${atHome(sc)?' · estou em casa':''}`:'Escolha onde morar'; row.on=()=>UI.push(V.iskLar); } return r; })(V.scActs);
