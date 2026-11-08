// ===== 4.3: descrição dos looks, gestações múltiplas e opções de acessibilidade =====
// ---------- gestações múltiplas: a predisposição fica em genes.gemeos e passa de geração em geração ----------
function partoQtd(m,par){ const mae=m.gender==='F'?m:(par&&par.gender==='F'?par:null); const gene=!!(mae&&mae.genes&&mae.genes.gemeos); let f=gene?4:1; if(mae&&mae.age>=35) f*=1.3;
  const x=R.f(); return x<.0001*f?5:x<.0005*f?4:x<.003*f?3:x<.03*f?2:1; }
const PARTO_NOME={2:'gêmeos',3:'trigêmeos',4:'quadrigêmeos',5:'quíntuplos'};
relLabel=(o=>p=>{ const t=o(p); return p&&p.parto&&['filho','irmao'].includes(p.rel)?`${t} · ${PARTO_NOME[p.parto]}`:t; })(relLabel);
V.me=(o=>function(){ const r=o.apply(this,arguments); if(r&&r.items&&S.me.genes&&S.me.genes.gemeos) r.items.push({ic:false,l:'Gestação múltipla na família',s:'Tenho mais chance de ter gêmeos ou mais, e posso passar isso aos meus filhos'}); return r; })(V.me);

// ---------- descrição em texto das roupas ----------
const ROUPA_NOMES={longa:['camiseta de manga longa','f'],camiseta:['camiseta','f'],camisetaV:['camiseta gola V','f'],camisaCurta:['camisa de manga curta','f'],camisa:['camisa','f'],camisaAberta:['camisa aberta','f'],camisaTime:['camisa de time','f'],blazer:['blazer','m'],golaAlta:['blusa de gola alta','f'],jaquetaCouro:['jaqueta de couro','f'],jaqueta:['jaqueta','f'],sobretudo:['sobretudo','m'],bata:['bata','f'],polo:['camisa polo','f'],regata:['regata','f'],pijama:['pijama','m'],moletom:['moletom','m'],moletomZiper:['moletom com zíper','m'],cardigan:['cardigã','m'],listras:['blusa','f'],sueter:['suéter','m'],blusa:['blusa','f'],croppedRegata:['cropped regata','m'],alcinha:['blusa de alcinha','f'],macacao:['macacão','m'],tomara:['blusa tomara que caia','f'],cropped:['cropped','m'],topEsporte:['top esportivo','m'],
 jeans:['calça jeans','f'],bermuda:['bermuda','f'],calca:['calça','f'],short:['short','m'],jogger:['calça jogger','f'],cargo:['calça cargo','f'],legging:['legging','f'],saia:['saia','f'],shortinho:['shortinho','m'],
 chinelo:['chinelo','m'],tenis:['tênis','m'],social:['sapato social','m'],sandalia:['sandália','f'],coturno:['coturno','m'],botaCano:['bota de cano alto','f'],sapatilha:['sapatilha','f'],botaNeve:['bota de neve','f'],bota:['bota','f'],salto:['salto alto','m']};
const ROUPA_CORES=[['#FFFFFF','branco','branca'],['#F4F4F2','branco','branca'],['#1B1B1F','preto','preta'],['#6C757D','cinza','cinza'],['#ADB5BD','cinza-claro','cinza-claro'],['#E9E4D8','bege','bege'],['#C9A27E','caramelo','caramelo'],['#8B5E3C','marrom','marrom'],['#6B705C','verde-oliva','verde-oliva'],['#E63946','vermelho','vermelha'],['#5C2A3A','vinho','vinho'],['#F4A261','laranja','laranja'],['#FB5607','laranja','laranja'],['#E9C46A','amarelo','amarela'],['#FFF1B5','amarelo-claro','amarelo-claro'],['#C0A062','dourado','dourada'],['#2A9D8F','verde-água','verde-água'],['#06D6A0','verde','verde'],['#283618','verde-escuro','verde-escuro'],['#D8F3DC','verde-claro','verde-claro'],['#3A86FF','azul','azul'],['#1B263B','azul-marinho','azul-marinho'],['#3B5B8C','azul','azul'],['#5B7DB1','azul','azul'],['#7A9CC6','azul-claro','azul-claro'],['#1F3354','azul-escuro','azul-escuro'],['#BDE0FE','azul-claro','azul-claro'],['#7B2CBF','roxo','roxa'],['#CDB4DB','lilás','lilás'],['#FFC8DD','rosa-claro','rosa-claro'],['#EF476F','rosa','rosa']];
function corNome(hex,gen){ if(!/^#[0-9a-f]{6}$/i.test(hex||'')) return ''; const v=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)), a=v(hex); let best=null,bd=1e9; for(const c of ROUPA_CORES){ const b=v(c[0]), d=(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2; if(d<bd){ bd=d; best=c; } } return best[gen==='f'?2:1]; }
const ROUPA_PADRAO={listrasV:['com listras verticais'],xadrez:['xadrez'],tropical:['com estampa tropical'],geometrico:['com estampa geométrica'],quadriculado:['quadriculado','quadriculada'],listras:['listrado','listrada'],estrelas:['com estrelas'],trico:['de tricô'],bolinhas:['de bolinhas'],camuflado:['camuflado','camuflada'],floral:['com flores'],listrasFinas:['com listras finas'],coracoes:['com corações'],paete:['de paetê']};
const ROUPA_ESTAMPA={raio:'raio',faixa:'faixa',estrela:'estrela',caveira:'caveira',logo:'logotipo',coracao:'coração',circulo:'círculo'};
function pecaDesc(o,nome,gen){ const pd=ROUPA_PADRAO[o.padrao], padrao=pd?(gen==='f'&&pd[1]?pd[1]:pd[0]):'';
  return [nome,corNome(o.cor,gen),padrao,o.estampa?`com estampa de ${ROUPA_ESTAMPA[o.estampa]||o.estampa}`:''].filter(Boolean).join(' '); }
function roupaDesc(r){ const q=r&&r.roupa; if(!q) return ''; const l=[];
  if(q.vestido){ const v=q.vestido; l.push(pecaDesc(v,v.comp>=6.5?'vestido longo':v.comp<=4.8?'vestido curto':'vestido','m')); }
  for(const k of ['sob','top','jardineira','baixo','sapato']){ const o=q[k]; if(!o) continue; if(k==='jardineira'){ l.push(pecaDesc(o,'jardineira','f')); continue; } if(o.tipo==='descalco'){ l.push('pés descalços'); continue; } const n=ROUPA_NOMES[o.tipo]; l.push(n?pecaDesc(o,n[0],n[1]):pecaDesc(o,String(o.tipo||'peça'),'f')); }
  if(q.gravata) l.push(['gravata',corNome(q.gravata.cor,'f')].filter(Boolean).join(' ')); if(q.borboleta) l.push('gravata-borboleta'); if(q.lenco) l.push('lenço'); if(q.cinto) l.push('cinto'); if(q.suspensorio) l.push('suspensório'); if(q.meiaCalca) l.push('meia-calça');
  const s=l.length>1?l.slice(0,-1).join(', ')+' e '+l[l.length-1]:(l[0]||''); return s?s[0].toUpperCase()+s.slice(1):''; }
v3RoupaRow=(o=>function(r){ const x=o(r); x.s=`${r.estilo}: ${roupaDesc(r)}`; return x; })(v3RoupaRow);
pv3Itens=(o=>function(){ const it=o.apply(this,arguments), pele=['muito clara','clara','clara média','morena clara','morena','morena escura','negra']; for(const i of it){ if(i.k==='roupa3'){ const r=ROUPAS[PV3.sexo].find(x=>x.id===i.v); if(r) i.desc=roupaDesc(r); } if(i.k==='g:skin') i.desc='Pele '+pele[i.v]; } return it; })(pv3Itens);

// ---------- opções de acessibilidade ----------
const A11Y_TAM=[100,115,130,150];
const a11y=()=>{ if(!META.a11y) META.a11y={}; return META.a11y; };
function a11yAplicar(){ const a=a11y(), c=document.documentElement.classList; document.body.style.zoom=(a.tam||100)===100?'':String(a.tam/100); c.toggle('a11y-contraste',!!a.contraste); c.toggle('a11y-calmo',!!a.calmo); c.toggle('a11y-fonte',!!a.fonte); c.toggle('a11y-botoes',!!a.botoes); }
applyTheme=(o=>function(){ const r=o.apply(this,arguments); a11yAplicar(); return r; })(applyTheme);
(()=>{ const st=document.createElement('style'); st.textContent=`
html.a11y-contraste,html.a11y-contraste[data-theme]{--bg:#000;--surface:#000;--surface2:#111;--ink:#FFF;--muted:#FFF;--line:#FFF;--link:#FFE600;--brand:#FFE600;--brand2:#FFE600;--btn:#FFE600;--good:#5CFF8A;--bad:#FF8A8A;--warn:#FFD24D;--glass:#000;--glass-line:#FFF;--brand-grad:#000}
.a11y-contraste .btn:not(.alt){color:#000!important}.a11y-contraste .row,.a11y-contraste .btn{border:2px solid #FFF!important}
:focus-visible{outline:3px solid var(--link);outline-offset:2px}
.a11y-calmo *,.a11y-calmo *::before,.a11y-calmo *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
.a11y-fonte body,.a11y-fonte button,.a11y-fonte input,.a11y-fonte textarea{font-family:Verdana,Arial,sans-serif!important;letter-spacing:.03em;line-height:1.6}
.a11y-botoes .row,.a11y-botoes .btn{min-height:64px}`; document.head.appendChild(st); })();
// emojis e desenhos não são lidos; o diálogo anuncia título e texto ao abrir
pump=(o=>function(){ const r=o.apply(this,arguments), d=document.getElementById('modal'); if(d&&!document.getElementById('modalWrap').hidden){ const h=d.querySelector('h2'), t=d.querySelector('.txt'); if(h){ h.id='modalTitulo'; d.setAttribute('aria-labelledby','modalTitulo'); } if(t){ t.id='modalTexto'; d.setAttribute('aria-describedby','modalTexto'); } else d.removeAttribute('aria-describedby'); d.querySelectorAll('.mtop').forEach(x=>x.setAttribute('aria-hidden','true')); } return r; })(pump);
function a11yOcultarIcones(raiz){ raiz.querySelectorAll('.ambient-icon,.row .ic,.row .fw').forEach(x=>x.setAttribute('aria-hidden','true')); }
if(window.MutationObserver) new MutationObserver(ms=>{ for(const m of ms) for(const n of m.addedNodes) if(n.nodeType===1) a11yOcultarIcones(n); }).observe(document.documentElement,{childList:true,subtree:true});
function a11ySituacao(){ const m=S.me; return `${fullName(m)}, ${m.age} ${m.age===1?'ano':'anos'}. Felicidade ${Math.round(m.happy)}%, saúde ${Math.round(m.health)}%, inteligência ${Math.round(m.smarts)}%, aparência ${Math.round(m.looks)}%. Dinheiro: ${fmt(m.money)}.${m.job?' Trabalho: '+jobTitle(m.job)+'.':''}${m.prison?' Estou na prisão.':''}`; }
function a11yVisual(){ const m=S.me, L=ensureLook(m), r=L.roupa3&&[...ROUPAS.M,...ROUPAS.F].find(x=>x.id===L.roupa3); return `${looksLine(m)}. ${r?'Estou vestindo: '+roupaDesc(r)+'.':'Estou com as roupas do dia a dia.'}`; }
V.acessibilidade=()=>{ const a=a11y(), sw=(l,s,k)=>({l,s,r:a[k]?'Ligado':'Desligado',on:()=>{ a[k]=!a[k]; a11yAplicar(); save(); UI.refresh(); }});
  const it=[{sec:'Leitura'},{ic:'📏',l:'Tamanho do texto',s:'Aumenta o texto e os botões do jogo',r:(a.tam||100)+'%',on:()=>{ a.tam=A11Y_TAM[(A11Y_TAM.indexOf(a.tam||100)+1)%A11Y_TAM.length]; a11yAplicar(); save(); UI.refresh(); }},
   sw('Fonte de leitura fácil','Letras mais simples e mais espaço entre as linhas','fonte'),sw('Alto contraste','Fundo preto, texto branco e bordas fortes','contraste'),sw('Botões maiores','Mais fáceis de acertar com o dedo','botoes'),
   {sec:'Movimento e toque'},sw('Reduzir animações','Tira movimentos e transições da tela','calmo'),
   {ic:'📳',l:'Vibração',r:META.vibra===false?'Desligada':'Ligada',on:()=>{ META.vibra=META.vibra===false; save(); UI.refresh(); }}];
  const mg=V.configuracoes().items.find(x=>x.l==='Minigames da rotina'); if(mg) it.push({sec:'Jogo'},mg);
  if(S&&S.me) it.push({sec:'Leitor de tela'},{ic:'🗣️',l:'Ler minha situação',s:'Idade, atributos e dinheiro em texto',on:()=>msg('Minha situação',a11ySituacao())},{ic:'👕',l:'Descrever meu visual',s:'Aparência e roupa em texto',on:()=>msg('Meu visual',a11yVisual())});
  return {title:'Acessibilidade',items:it}; };
V.menu=(o=>function(){ const r=o.apply(this,arguments), i=r.items.findIndex(x=>x&&x.l==='Enviar feedback'); r.items.splice(i>=0?i:r.items.length,0,{ic:'♿',l:'Acessibilidade',s:'Texto, contraste, animações e leitor de tela',on:()=>UI.push(V.acessibilidade)}); return r; })(V.menu);

function acessibilidadeSelfTest(){ const erros=[], ok=(c,t)=>{ if(!c) erros.push(t); }, s0=S, rf=R.f, ns=window.NO_SAVE, meta=JSON.stringify(META); window.NO_SAVE=true;
  try{ for(const r of [...ROUPAS.M,...ROUPAS.F]){ const d=roupaDesc(r); ok(d&&!/undefined|null/.test(d),'look sem descrição: '+r.id); for(const k of ['top','sob','baixo','sapato']){ const t=r.roupa[k]&&r.roupa[k].tipo; if(t&&t!=='descalco') ok(ROUPA_NOMES[t],'peça sem nome: '+t); } }
    ok(corNome('#FFFFFF','f')==='branca'&&corNome('#E63946','m')==='vermelho','cor errada');
    newLife({country:'BR'}); const m=S.me; m.gender='F'; m.age=28; m.genes.gemeos=1; const par=mkPerson({rel:'conjuge',gender:'M',age:30}); S.people.push(par);
    for(const [x,n] of [[.00001,5],[.0015,4],[.01,3],[.1,2],[.5,1]]){ R.f=()=>x; ok(partoQtd(m,par)===n,`parto ${x}: ${partoQtd(m,par)} != ${n}`); } R.f=rf;
    let seq=[.01]; const antes=kids().length; R.f=()=>seq.length?seq.shift():rf(); S.births.push({with:par.id}); yearPeople(); R.f=rf; ok(kids().length-antes===3&&kids().filter(k=>k.parto===3).length===3,'trigêmeos não nasceram');
    const pai={first:'A',gender:'M',genes:randGenes('M')}, mae={first:'B',gender:'F',genes:Object.assign(randGenes('F'),{gemeos:1})}; let c=0; for(let i=0;i<400;i++) if(childOf(pai,mae,'F').genes.gemeos) c++; ok(c>120&&c<300,'herança da predisposição: '+c);
    // parentesco: a irmã vira tia, o avô vira bisavô, o sobrinho vira primo
    newLife({country:'BR'}); const o=S.me; o.age=60; const fil=mkPerson({rel:'filho',age:30,last:o.last}), ir=mkPerson({rel:'irmao',age:58}), so=mkPerson({rel:'sobrinho',age:25}), av=mkPerson({rel:'avo',age:90}), ti=mkPerson({rel:'tio',age:80}), pr=mkPerson({rel:'primo',age:55}), am=mkPerson({rel:'amigo',age:60}); S.people.push(fil,ir,so,av,ti,pr,am); const ids=[ir,so,av,ti,pr,am].map(p=>p.id); o.alive=false; continueAs(fil);
    const rel=ids.map(i=>P(i)&&P(i).rel).join(); ok(rel==='tio,primo,bisavo,tioavo,primo2,conhecido','parentesco: '+rel); ok(relLabel(Object.assign({},P(ids[0]),{gender:'F'}))==='Tia','rótulo de tia');
    newLife({country:'BR'}); ok(V.menu().items.some(x=>x.l==='Acessibilidade'),'menu sem acessibilidade'); const v=V.acessibilidade(); ok(v.items.some(x=>x.l==='Alto contraste')&&a11ySituacao().includes('saúde')&&a11yVisual().length>5,'tela de acessibilidade');
  }catch(e){ erros.push(e.message); } finally{ R.f=rf; S=s0; window.NO_SAVE=ns; const mm=JSON.parse(meta); for(const k of Object.keys(META)) if(!(k in mm)) delete META[k]; Object.assign(META,mm); }
  return erros; }
