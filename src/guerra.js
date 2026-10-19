// ===== Guerras: relações entre países, alianças, guerra local que pode virar mundial, territórios conquistados e perdidos,
// capital cercada, presidente exilado, preso ou morto pelo inimigo, e a vida do cidadão comum durante o conflito =====
const BLOCOS={US:'otan',CA:'otan',GB:'otan',FR:'otan',DE:'otan',IT:'otan',ES:'otan',PT:'otan',BR:'sul',AR:'sul',MX:'sul',AO:'africa',JP:'asia',KR:'asia',IN:'asia'};
const POTENCIA={US:100,IN:70,FR:60,GB:60,DE:55,JP:50,KR:50,BR:45,IT:40,ES:35,CA:35,MX:30,AR:25,PT:15,AO:15};
const REGIOES={BR:['Norte','Nordeste','Centro-Oeste','Sul','Sudeste'],US:['Alasca','Costa Oeste','Texas','Meio-Oeste','Costa Leste'],AR:['Patagônia','Cuyo','Norte','Litoral','Pampa'],MX:['Baixa Califórnia','Norte','Iucatã','Bajío','Vale do México'],
  PT:['Algarve','Alentejo','Norte','Centro','Lisboa'],ES:['Andaluzia','Galícia','Catalunha','Valência','Madri'],FR:['Bretanha','Alsácia','Provença','Aquitânia','Île-de-France'],DE:['Baviera','Saxônia','Renânia','Hamburgo','Berlim'],IT:['Sicília','Sardenha','Toscana','Lombardia','Lácio'],
  GB:['Escócia','País de Gales','Irlanda do Norte','Midlands','Grande Londres'],JP:['Hokkaido','Kyushu','Shikoku','Kansai','Kanto'],KR:['Jeju','Gangwon','Gyeongsang','Jeolla','Seul'],IN:['Punjab','Bengala','Kerala','Maharashtra','Délhi'],CA:['Yukon','Colúmbia Britânica','Alberta','Quebec','Ontário'],AO:['Cabinda','Huíla','Benguela','Huambo','Luanda']};
const capitalDe=p=>(REGIOES[p]||['Capital']).slice(-1)[0];
function diplo(){ S.diplo=S.diplo||{}; return S.diplo; }
const parKey=(a,b)=>[a,b].sort().join('-');
function relPais(a,b){ if(a===b) return 100; const D=diplo(), k=parKey(a,b); if(D[k]==null) D[k]=(BLOCOS[a]===BLOCOS[b]?55:12)+((a.charCodeAt(0)*7+b.charCodeAt(1)*3+a.charCodeAt(1))%21)-10; return D[k]; }
function relMudar(a,b,v){ relPais(a,b); const k=parKey(a,b); diplo()[k]=Math.max(-100,Math.min(100,diplo()[k]+v)); }
const aliados=(a,b)=>!!(S.aliancas&&S.aliancas[parKey(a,b)]);
const guerraAtual=()=>S.guerra&&!S.guerra.fim?S.guerra:null;
const ladoDe=(G,p)=>G.a.includes(p)?'a':G.b.includes(p)?'b':null;
const forcaLado=(G,l)=>G[l].reduce((s,p)=>s+(POTENCIA[p]||20)*(1-(G.perdas[p]||0)*.15),0);
const donoRegiao=(G,p,r)=>(S.terr||[]).find(t=>t.de===p&&t.reg===r);
function regioesLivres(p){ return (REGIOES[p]||[]).filter(r=>!(S.terr||[]).some(t=>t.de===p&&t.reg===r)); }
// começa uma guerra: aliados de cada lado entram conforme as relações; com muita gente ou potências dos dois lados, vira mundial
function guerraIniciar(a,b,origem){ if(guerraAtual()) return guerraAtual(); const G={a:[a],b:[b],lider:{a,b},frente:50,anos:0,mundial:false,perdas:{},origem:origem||'',inicio:S.year};
  for(const c of COUNTRIES.map(x=>x.id)){ if(c===a||c===b) continue; const ra=relPais(c,a), rb=relPais(c,b);
    if(aliados(c,a)&&!aliados(c,b)) G.a.push(c); else if(aliados(c,b)&&!aliados(c,a)) G.b.push(c);
    else if(ra>=55&&ra-rb>=25&&R.chance(.5)) G.a.push(c); else if(rb>=55&&rb-ra>=25&&R.chance(.5)) G.b.push(c); }
  const fa=forcaLado(G,'a'), fb=forcaLado(G,'b'); G.mundial=G.a.length+G.b.length>=6||(fa>=140&&fb>=140);
  S.guerra=G; relMudar(a,b,-50); const n=`${G.mundial?'Guerra mundial: ':'Guerra: '}${G.a.map(nomePais).join(', ')} contra ${G.b.map(nomePais).join(', ')}`;
  log(n+'.','bad'); if(typeof noticia==='function') noticia(G.mundial?'Começa uma guerra mundial':`${nomePais(a)} e ${nomePais(b)} em guerra`,n+'.','mundo','guerra:'+S.year+':'+a+b,a,95); return G; }
// um ano de guerra: a frente se move pela força dos lados e pelas ordens; quem avança toma regiões até a capital
function guerraAno(ordem){ const G=guerraAtual(); if(!G) return ''; G.anos++; const fa=forcaLado(G,'a'), fb=forcaLado(G,'b'); const m=S.me, meu=ladoDe(G,m.country);
  let d=R.int(-12,12)+(fa-fb)/12; if(ordem&&meu){ const s=meu==='a'?1:-1; d+=s*(ordem==='ofensiva'?R.int(-6,14):ordem==='defesa'?R.int(0,5):0); }
  G.frente=Math.max(0,Math.min(100,G.frente+d)); const msgs=[];
  const tomar=(venc,perd)=>{ const alvo=G.lider[perd], livres=regioesLivres(alvo); if(!livres.length) return; const reg=livres.length>1?livres[0]:capitalDe(alvo); (S.terr=S.terr||[]).push({de:alvo,reg,dono:G.lider[venc],ano:S.year});
    G.perdas[alvo]=(G.perdas[alvo]||0)+1; msgs.push(`${nomePais(G.lider[venc])} tomou ${reg} (${nomePais(alvo)}).`); if(reg===capitalDe(alvo)) G.capitulou=perd; };
  if(G.frente>=68){ tomar('a','b'); G.frente=56; } else if(G.frente<=32){ tomar('b','a'); G.frente=44; }
  if(G.capitulou){ guerraFim(G.capitulou==='a'?'b':'a'); msgs.push('A capital caiu. A guerra acabou.'); }
  else if(G.anos>=2&&R.chance(.08+G.anos*.04)&&!(meu&&m.office&&m.office.id==='pres')){ guerraFim(G.frente>=50?'a':'b',true); msgs.push('Um armistício encerrou a guerra.'); }
  msgs.forEach(t=>log(t,'warn')); return msgs.join(' '); }
function guerraFim(venc,armisticio){ const G=S.guerra; if(!G) return; G.fim=S.year; G.venc=venc; G.armisticio=!!armisticio; const m=S.me, meu=ladoDe(G,m.country);
  if(typeof noticia==='function') noticia(armisticio?'Armistício encerra a guerra':`${nomePais(G.lider[venc])} vence a guerra`,`Depois de ${G.anos} ano(s) de conflito, ${armisticio?'os lados assinaram um armistício.':'o lado derrotado se rendeu.'}`,'mundo','guerrafim:'+S.year,G.lider.a,95);
  if(meu){ st('happy',meu===venc?10:-10); log(meu===venc?'A guerra acabou, e o meu país saiu vitorioso.':'A guerra acabou com a derrota do meu país.',meu===venc?'good':'bad'); }
  for(const p of G.a) for(const q of G.b) relMudar(p,q,armisticio?10:-10); S.guerra=null; S.guerrasPassadas=(S.guerrasPassadas||0)+1; }
// ---------- o presidente na guerra ----------
EVENTS.pol_ultimato.pick=(o=>function(k,d){ if(k!=='guerra') return o.apply(this,arguments); const m=S.me, of=m.office; if(!of) return ''; of.appr=clamp(of.appr+10); m.c.guerra=1; const G=guerraIniciar(m.country,d.p,'presidente');
  return `Assinei a declaração de guerra contra ${nomePais(d.p)}. ${G.a.length>1?`Do nosso lado: ${G.a.slice(1).map(nomePais).join(', ')}. `:''}${G.b.length>1?`Do lado deles: ${G.b.slice(1).map(nomePais).join(', ')}. `:''}${G.mundial?'O mundo inteiro entrou na guerra.':''}`; })(EVENTS.pol_ultimato.pick);
EVENTS.pol_guerra={when:m=>!!m.office&&m.office.id==='pres'&&!!guerraAtual()&&!!ladoDe(guerraAtual(),m.country)&&!m.prison,
  show:()=>{ const m=S.me, G=guerraAtual(), meu=ladoDe(G,m.country), fr=meu==='a'?G.frente:100-G.frente, ini=G.lider[meu==='a'?'b':'a'];
    const perdidas=(S.terr||[]).filter(t=>t.de===m.country).map(t=>t.reg), tomadas=(S.terr||[]).filter(t=>t.dono===m.country).map(t=>t.reg);
    return {k:'Guerra',t:`⚔️ ${G.mundial?'Guerra mundial':'Guerra contra '+nomePais(ini)} · ano ${G.anos+1}`,x:`A frente está ${fr>=58?'a nosso favor':fr<=42?'contra nós':'equilibrada'} (${Math.round(fr)}%).${tomadas.length?' Conquistamos: '+tomadas.join(', ')+'.':''}${perdidas.length?' Perdemos: '+perdidas.join(', ')+'.':''} O que eu ordeno?`,ch:[['Lançar uma grande ofensiva','ofensiva'],['Defender as posições','defesa'],['Propor um armistício','armisticio'],['Pedir ajuda a outro país','ajuda']]}; },
  pick:k=>{ const m=S.me, of=m.office, G=guerraAtual(); if(!of||!G) return ''; const meu=ladoDe(G,m.country);
    if(k==='armisticio'){ const fr=meu==='a'?G.frente:100-G.frente; if(R.chance(.3+(fr-50)/150+m.smarts/400)){ guerraFim(fr>=50?meu:(meu==='a'?'b':'a'),true); of.appr=clamp(of.appr+(fr>=50?6:-4)); return 'Armistício assinado. Os territórios ficam como estão, e os soldados voltam para casa.'; } }
    if(k==='ajuda'){ const cand=COUNTRIES.map(c=>c.id).filter(c=>!ladoDe(G,c)).sort((x,y)=>relPais(y,m.country)-relPais(x,m.country))[0]; if(cand&&R.chance(Math.max(.05,relPais(cand,m.country)/120))){ G[meu].push(cand); if(G.a.length+G.b.length>=6) G.mundial=true; return `${nomePais(cand)} entrou na guerra do nosso lado.`+(G.mundial?' Agora é uma guerra mundial.':''); } if(cand) relMudar(cand,m.country,-5); return cand?`${nomePais(cand)} recusou entrar na guerra.`:'Não sobrou ninguém para pedir ajuda.'; }
    const perd0=(S.terr||[]).filter(t=>t.de===m.country).length; const t=guerraAno(k); const perd1=(S.terr||[]).filter(t=>t.de===m.country).length; of.appr=clamp(of.appr-(G.anos>2?R.int(2,6):0)-(perd1-perd0)*10+((S.terr||[]).filter(x=>x.dono===m.country&&x.ano===S.year).length)*8);
    if(guerraAtual()){ const fr=meu==='a'?guerraAtual().frente:100-guerraAtual().frente; const capitalCercada=regioesLivres(m.country).length<=1; if(capitalCercada) queue('guerra_capital',{}); }
    if(G.venc&&G.venc!==meu&&S.me.office){ of.appr=clamp(of.appr-20); if(of.appr<30) queue('pol_impeachment',{}); }
    return t||(k==='ofensiva'?'A ofensiva custou caro e não mudou muito a frente.':'Seguramos as posições.'); }};
EVENTS.guerra_capital={when:m=>!m.prison&&!!guerraAtual()&&!!ladoDe(guerraAtual(),m.country),
  show:()=>{ const m=S.me, G=guerraAtual(), ini=nomePais(G.lider[ladoDe(G,m.country)==='a'?'b':'a']), pres=m.office&&m.office.id==='pres';
    return {k:'Guerra',t:'🔥 A capital está cercada',x:`Tropas de ${ini} cercam ${capitalDe(m.country)}. ${pres?'Os generais pedem que eu decida o meu destino e o do governo.':'As sirenes não param.'}`,ch:pres?[['Fugir para o exílio e governar de fora','exilio'],['Resistir no palácio até o fim','resistir'],['Me render para poupar a população','render']]:[['Fugir da cidade','fugir'],['Me esconder no porão','esconder'],['Entrar na resistência','resistencia']]}; },
  pick:k=>{ const m=S.me, G=guerraAtual(); if(!G) return 'A guerra já acabou.'; const ini=G.lider[ladoDe(G,m.country)==='a'?'b':'a'], nIni=nomePais(ini);
    if(k==='exilio'){ m.office=null; m.c.exilio=1; const dest=COUNTRIES.map(c=>c.id).filter(c=>c!==m.country&&c!==ini&&!G.b.includes(c)).sort((a,b)=>relPais(b,m.country)-relPais(a,m.country))[0]; if(dest){ m.country=dest; m.city=R.pick(countryOf(dest).cities); }
      log(`Fugi para o exílio em ${nomePais(m.country)}.`,'bad'); return `Saí de helicóptero ao amanhecer. Governo no exílio, em ${nomePais(m.country)}.`; }
    if(k==='resistir'){ if(R.chance(.35)){ log(`Fui mort${oa()} pelas tropas de ${nIni} no palácio.`,'bad'); die(`pelas tropas de ${nIni}, defendendo o palácio presidencial`); return 'Resisti até o fim.'; }
      if(R.chance(.5)){ m.office=null; arrest(`prisioneir${oa()} de guerra de ${nIni}`,5,20); m.c.presoGuerra=ini; log(`Fui capturad${oa()} pelas tropas de ${nIni}.`,'bad'); return `Os soldados de ${nIni} invadiram o palácio e me levaram algemad${oa()}. Vou ser julgad${oa()} por um tribunal deles.`; }
      G.frente=ladoDe(G,m.country)==='a'?60:40; S.terr=(S.terr||[]).filter(t=>!(t.de===m.country&&t.reg===capitalDe(m.country))); m.fame=clamp(m.fame+10); return 'O contra-ataque funcionou. A capital resistiu e virei símbolo nacional.'; }
    if(k==='render'){ guerraFim(ladoDe(G,m.country)==='a'?'b':'a'); m.office=null; m.c.inelegivel=S.year+20; if(R.chance(.3)){ arrest(`prisioneir${oa()} de guerra de ${nIni}`,2,10); return 'Assinei a rendição. Me levaram como prisioneir'+oa()+' de guerra.'; } return 'Assinei a rendição. O país perdeu territórios, mas a matança parou.'; }
    if(k==='fugir'){ if(R.chance(.7)){ st('happy',-8); return 'Saí num comboio de refugiados. Perdi quase tudo, mas estou viv'+oa()+'.'; } st('health',-R.int(10,25)); return 'O comboio foi atacado no caminho. Escapei ferid'+oa()+'.'; }
    if(k==='esconder'){ if(R.chance(.85)){ st('happy',-6); return 'Passei semanas no porão, racionando comida. Sobrevivi.'; } die(`num bombardeio de ${nIni}`); return 'O prédio desabou.'; }
    if(R.chance(.15)){ die(`lutando na resistência contra ${nIni}`); return 'Caí lutando.'; } if(R.chance(.3)){ arrest(`resistência armada contra ${nIni}`,2,10); return `Fui capturad${oa()} pelas tropas de ${nIni}.`; } m.fame=clamp(m.fame+3); m.karma=clamp(m.karma+6); return 'Sabotei pontes e linhas de trem. A resistência cresce.'; }};
// ---------- a guerra na vida do cidadão comum ----------
EVENTS.guerra_alistamento={when:m=>!m.prison&&m.age>=18&&m.age<=45&&!!guerraAtual()&&!!ladoDe(guerraAtual(),m.country)&&!m.office&&!m.c.alistou,
  show:()=>({k:'Guerra',t:'📜 Convocação',x:`O governo convocou ${S.me.gender==='F'?'voluntárias e convocados':'os homens'} da minha idade para a guerra.`,ch:[['Me alistar','alistar'],['Pedir objeção de consciência e servir no hospital','objecao'],['Fugir do país','fugir']]}),
  pick:k=>{ const m=S.me; m.c.alistou=1;
    if(k==='alistar'){ if(m.job&&m.job.spc!=='militar') endJob(); m.job={spc:'militar',lvl:1,perf:60,yrs:0,co:'Exército',guerra:1}; m.c.veterano=1; log('Me alistei para a guerra.','warn'); return 'Raspei a cabeça, vesti a farda e embarquei para a frente de batalha.'; }
    if(k==='objecao'){ m.karma=clamp(m.karma+4); st('happy',-3); return 'Fui servir num hospital de campanha. Vi coisas que nunca vou esquecer.'; }
    if(R.chance(.6)){ const dest=COUNTRIES.map(c=>c.id).filter(c=>!ladoDe(guerraAtual(),c))[0]; if(dest){ m.country=dest; m.city=R.pick(countryOf(dest).cities); } return dest?`Atravessei a fronteira de madrugada. Agora sou refugiad${oa()} em ${nomePais(dest)}.`:'Não havia para onde fugir.'; }
    arrest('deserção',1,4); return 'Me pegaram na fronteira. Deserção.'; }};
EVENTS.guerra_front={when:m=>!m.prison&&!!guerraAtual()&&!!m.job&&m.job.spc==='militar'&&!!ladoDe(guerraAtual(),m.country),
  show:()=>({k:'Guerra',t:'🎖️ Na frente de batalha',x:'Ordens para avançar sobre uma posição inimiga, sob fogo pesado.',ch:[['Avançar com a tropa','avanca'],['Cobrir os companheiros','cobre'],['Ficar na trincheira','trincheira']]}),
  pick:k=>{ const m=S.me, G=guerraAtual(); const morte={avanca:.05,cobre:.03,trincheira:.015}[k];
    if(R.chance(morte)){ die(`em combate, na guerra contra ${nomePais(G.lider[ladoDe(G,m.country)==='a'?'b':'a'])}`); return 'Não voltei da frente.'; }
    if(R.chance(.2)){ st('health',-R.int(15,35)); return 'Fui ferid'+oa()+' por estilhaços e levad'+oa()+' para o hospital de campanha.'; }
    if(k==='avanca'){ m.job.perf=clamp(m.job.perf+10); if(R.chance(.2)){ m.fame=clamp(m.fame+5); log('Ganhei uma medalha por bravura.','good'); return 'Tomamos a posição. Ganhei uma medalha por bravura.'; } return 'Tomamos a posição, a um preço alto.'; }
    if(k==='cobre') { m.karma=clamp(m.karma+4); return 'Salvei dois companheiros. Eles nunca vão esquecer.'; } m.job.perf=clamp(m.job.perf-5); return 'Fiquei na trincheira. Sobrevivi mais um dia.'; }};
EVENTS.guerra_bombardeio={when:m=>!m.prison&&!!guerraAtual()&&!!ladoDe(guerraAtual(),m.country),
  show:()=>({k:'Guerra',t:'💥 Sirenes',x:'As sirenes de ataque aéreo tocam no meio da noite.',ch:[['Correr para o abrigo','abrigo'],['Ajudar os vizinhos a descer','ajudar'],['Ficar em casa','casa']]}),
  pick:k=>{ const m=S.me, G=guerraAtual(), ini=nomePais(G.lider[ladoDe(G,m.country)==='a'?'b':'a']); const p={abrigo:.003,ajudar:.01,casa:.03}[k];
    if(R.chance(p)){ die(`num bombardeio de ${ini}`); return 'A bomba caiu perto demais.'; } if(k==='ajudar'){ m.karma=clamp(m.karma+5); return 'Carreguei uma idosa escada abaixo. Todos chegaram ao abrigo.'; }
    if(k==='casa'&&R.chance(.25)){ st('health',-R.int(8,20)); return 'Os vidros explodiram. Me cortei inteir'+oa()+'.'; } st('happy',-4); return 'Passamos a noite no abrigo, ouvindo as explosões ao longe.'; }};
EVENTS.guerra_racionamento={when:m=>!m.prison&&!!guerraAtual()&&!!ladoDe(guerraAtual(),m.country),show:()=>({k:'Guerra',t:'🥫 Racionamento',x:'O governo racionou comida, combustível e remédios.',ch:[['Seguir as regras','regras'],['Comprar no mercado paralelo','paralelo'],['Plantar uma horta no quintal','horta']]}),
  pick:k=>{ const m=S.me; if(k==='paralelo'){ m.money-=Math.min(Math.max(0,m.money),R.int(500,3000)); if(R.chance(.15)){ arrest('mercado negro em tempo de guerra',0,2); return 'Fui pego comprando no mercado paralelo.'; } return 'Paguei caro, mas a família comeu bem.'; } if(k==='horta'){ st('health',2); st('happy',2); return 'A horta virou a salvação da rua inteira.'; } st('health',-2); return 'Filas, cupons e fome. Mas estamos todos juntos.'; }};
EVENTS.guerra_ocupacao={when:m=>!m.prison&&(S.terr||[]).some(t=>t.de===m.country&&t.reg!==capitalDe(m.country)),show:()=>{ const t=(S.terr||[]).find(t=>t.de===S.me.country); return {k:'Guerra',t:'🏳️ Região ocupada',x:`${t.reg} está sob ocupação de ${nomePais(t.dono)}. Meus parentes de lá pedem ajuda.`,ch:[['Mandar dinheiro escondido','dinheiro'],['Ajudar a trazer a família para cá','trazer'],['Não me envolver','nada']]}; },
  pick:k=>{ const m=S.me; if(k==='dinheiro'){ m.money-=Math.min(Math.max(0,m.money),1000); m.karma=clamp(m.karma+4); return 'O dinheiro chegou pelas mãos de um contrabandista.'; } if(k==='trazer'){ if(R.chance(.7)){ m.karma=clamp(m.karma+6); return 'A família atravessou a linha de frente numa noite sem lua. Estão comigo.'; } st('happy',-8); return 'Foram barrados na fronteira. Vou tentar de novo.'; } return 'Desliguei o telefone e chorei.'; }};
// guerras também começam sem o personagem no governo
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m||!m.alive||S.scen) return; const G=guerraAtual();
  if(!G){ if(!(m.office&&m.office.id==='pres')&&R.chance(.004)){ const ini=polVizinho(m); if(ini) guerraIniciar(R.chance(.5)?m.country:ini,R.chance(.5)?ini:m.country,'mundo'); } return; }
  const meu=ladoDe(G,m.country), pres=m.office&&m.office.id==='pres'&&meu;
  if(!pres) guerraAno(null);
  if(guerraAtual()&&meu&&!m.prison){ if(pres) queue('pol_guerra',{}); if(R.chance(.35)) queue('guerra_bombardeio',{}); if(R.chance(.3)) queue('guerra_racionamento',{}); if(m.age>=18&&m.age<=45&&!m.office&&!m.c.alistou) queue('guerra_alistamento',{}); if(m.job&&m.job.spc==='militar') queue('guerra_front',{});
    if(regioesLivres(m.country).length<=1) queue('guerra_capital',{}); }
  if((S.terr||[]).some(t=>t.de===m.country)&&R.chance(.25)) queue('guerra_ocupacao',{}); });
// ---------- diplomacia do presidente ----------
function diploAcao(p,k){ const m=S.me, of=m.office; if(!of||of.id!=='pres') return ''; if(use('diplo_'+p)>1) return `Já tratei com ${nomePais(p)} este ano.`;
  if(k==='visita'){ relMudar(m.country,p,12); m.fame=clamp(m.fame+1); return `Visita oficial a ${nomePais(p)}: banquete, fotos e acordos.`; }
  if(k==='comercio'){ relMudar(m.country,p,8); of.appr=clamp(of.appr+2); return `Assinamos um acordo comercial com ${nomePais(p)}.`; }
  if(k==='alianca'){ if(relPais(m.country,p)<60) return `${nomePais(p)} ainda não confia em nós o bastante para uma aliança militar.`; (S.aliancas=S.aliancas||{})[parKey(m.country,p)]=1; log(`Assinei uma aliança militar com ${nomePais(p)}.`,'good'); return `Aliança militar com ${nomePais(p)}: se um for atacado, o outro entra na guerra.`; }
  relMudar(m.country,p,-15); of.appr=clamp(of.appr+R.int(-2,3)); return `Fiz um discurso duro contra ${nomePais(p)}. A relação esfriou.`; }
V.career=(o=>function(){ const r=o.apply(this,arguments), m=S.me, of=m.office; if(!of||of.id!=='pres'||of.dit||!r||!r.items||m.prison) return r; const i=r.items.findIndex(x=>x.sec==='Do lado escuro'); const G=guerraAtual();
  const add=[]; if(G&&ladoDe(G,m.country)){ const meu=ladoDe(G,m.country); add.push({html:`<div class="card" style="border-color:#E5484D"><p><b>⚔️ ${G.mundial?'Guerra mundial':'Em guerra'} · ano ${G.anos+1}</b></p>${kv('Meu lado',G[meu].map(nomePais).join(', '))}${kv('Inimigos',G[meu==='a'?'b':'a'].map(nomePais).join(', '))}${bar('Frente de batalha',Math.round(meu==='a'?G.frente:100-G.frente))}</div>`}); }
  const perd=(S.terr||[]).filter(t=>t.de===m.country), ganh=(S.terr||[]).filter(t=>t.dono===m.country); if(perd.length||ganh.length) add.push({html:`<div class="card">${ganh.length?kv('Territórios conquistados',ganh.map(t=>`${t.reg} (${nomePais(t.de)})`).join(', ')):''}${perd.length?kv('Territórios perdidos',perd.map(t=>`${t.reg} → ${nomePais(t.dono)}`).join(', ')):''}</div>`});
  add.push({ic:'🌐',l:'Relações exteriores',s:'Visitas, acordos, alianças militares',on:()=>UI.push(()=>({title:'Relações exteriores',items:COUNTRIES.filter(c=>c.id!==m.country).map(c=>({ic:aliados(m.country,c.id)?'🤝':'🏳️',l:c.n,s:`Relação ${relPais(m.country,c.id)}${aliados(m.country,c.id)?' · aliado militar':''}`,on:()=>UI.push(()=>({title:c.n,items:[
    {html:`<div class="card">${bar('Relação',clamp(relPais(m.country,c.id)))}</div>`},{ic:'✈️',l:'Visita oficial',on:()=>act(()=>diploAcao(c.id,'visita'),'Diplomacia')},{ic:'📦',l:'Acordo comercial',on:()=>act(()=>diploAcao(c.id,'comercio'),'Diplomacia')},
    {ic:'🛡️',l:'Propor aliança militar',s:'Precisa de relação 60+',on:()=>act(()=>diploAcao(c.id,'alianca'),'Diplomacia')},{ic:'😠',l:'Discurso duro contra eles',tone:'bad',on:()=>act(()=>diploAcao(c.id,'provocar'),'Diplomacia')},
    {ic:'⚔️',l:'Dar um ultimato',tone:'bad',on:()=>act(()=>{ queue('pol_ultimato',{p:c.id}); return ''; },'Guerra')}]}))}))}))});
  r.items.splice(i>=0?i:r.items.length,0,...add); return r; })(V.career);
EVENTS.pol_disputa.pick=(o=>function(k,d){ const r=o.apply(this,arguments); relMudar(S.me.country,d.p,{diplomacia:5,sancoes:-10,tropas:-15,ignora:-3}[k]||0); return r; })(EVENTS.pol_disputa.pick);
function guerraSelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,erros=[], info={};window.NO_SAVE=true;window.NO_NEWS=true; const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=1914; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; }; let m;
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=EVENTS[id].show(JSON.parse(JSON.stringify(d))); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v));
    sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap); m=S.me; try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); ok(Number.isFinite(S.me.money),id+'#'+k+' dinheiro'); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); m=S.me; };
  try{ newLife({country:'BR'}); m=S.me; m.age=50; m.born=S.year-50; m.money=1e6; m.prison=null; polFiliar('np'); m.office={id:'pres',yrs:1,appr:60,mand:1}; S.pending=[];
    // guerra pequena entre dois países sem aliados
    S.diplo={}; for(const c of COUNTRIES) for(const d of COUNTRIES) if(c.id!==d.id){ S.diplo[parKey(c.id,d.id)]=0; } let G=guerraIniciar('BR','AR','teste'); ok(G.a.length===1&&G.b.length===1&&!G.mundial,'guerra pequena virou grande: '+G.a.join()+' x '+G.b.join()); S.guerra=null;
    // com alianças dos dois lados, vira mundial
    S.aliancas={}; for(const p of ['US','GB','FR']) S.aliancas[parKey('BR',p)]=1; for(const p of ['IN','JP','KR','DE']) S.aliancas[parKey('AR',p)]=1; G=guerraIniciar('BR','AR','teste'); ok(G.mundial&&G.a.includes('US')&&G.b.includes('IN'),'alianças não arrastaram o mundo'); info.lados=[G.a.length,G.b.length];
    // territórios: o lado forte toma regiões até a capital e vence
    let anos=0; while(guerraAtual()&&anos++<60) guerraAno(null); ok(!guerraAtual(),'guerra sem fim'); ok((S.terr||[]).length>0,'ninguém ganhou território'); info.territorios=(S.terr||[]).length;
    S.guerra=null; S.terr=[]; S.aliancas={}; S.diplo={}; guerraIniciar('BR','AR','teste');
    todas('pol_guerra',{}); todas('guerra_capital',{}); m.office=null; todas('guerra_capital',{}); todas('guerra_alistamento',{}); m.job={spc:'militar',lvl:1,perf:60,yrs:0,co:'Exército'}; todas('guerra_front',{}); todas('guerra_bombardeio',{}); todas('guerra_racionamento',{});
    S.terr=[{de:'BR',reg:'Sul',dono:'AR',ano:S.year}]; todas('guerra_ocupacao',{});
    // presidente pode ser morto ou preso pelo inimigo
    m.office={id:'pres',yrs:1,appr:60,mand:1}; let morto=0,preso=0; for(let i=0;i<60;i++){ const snap=JSON.stringify(S); EVENTS.guerra_capital.pick('resistir',{}); if(!S.me.alive) morto++; else if(S.pending.some(e=>e.id==='julgamento')) preso++; S=JSON.parse(snap); m=S.me; } ok(morto>0&&preso>0,`resistir nunca mata ou prende (${morto}/${preso})`);
    m.office=null; m.job={spc:'militar',lvl:1,perf:60,yrs:2,co:'Exército'}; todas('espionagem',{p:'AR',alvo:'a embaixada',e:0}); todas('espionagem',{p:'AR',alvo:'a embaixada',e:1}); ok(V.jobMenu().items.some(it=>it.l==='Missão de espionagem'),'militar sem espionagem'); m.office={id:'pres',yrs:1,appr:60,mand:1}; m.job=null;
    for(const k of ['visita','comercio','alianca','provocar']){ m.yr={}; ok(!BAD.test(diploAcao('PT',k)),'diplomacia '+k); }
    V.career().items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')+String(it.html||'')),'tela: '+(it.l||'')));
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; }
  if(erros.length) throw Error('Guerra · '+erros.slice(0,8).join(' | ')); return info; }
// ---------- carreira militar: ir para a frente e missões de espionagem ----------
const ESPI_ALVOS=['a base naval','o ministério da defesa','o centro de pesquisas','a embaixada','o quartel-general'];
EVENTS.espionagem={when:m=>!m.prison&&!!m.job&&m.job.spc==='militar',prep:m=>({p:polVizinho(m),alvo:R.pick(ESPI_ALVOS),e:0}),
  show:d=>d.e===1?{k:'Espionagem',t:'🕵️ Dentro de '+nomePais(d.p),x:`Estou infiltrad${oa()} perto d${d.alvo.startsWith('a ')?'a':'o'} ${d.alvo.slice(2)} de ${nomePais(d.p)}. Um guarda desconfia de mim.`,ch:[['Manter o disfarce e conversar','disfarce'],['Fotografar os documentos e sair rápido','fotos'],['Abortar a missão','aborta']]}
    :{k:'Espionagem',t:'🕵️ Missão secreta',x:`O serviço de inteligência quer alguém dentro d${d.alvo.startsWith('a ')?'a':'o'} ${d.alvo.slice(2)} de ${nomePais(d.p)}.`,ch:[['Entrar com identidade falsa','falsa'],['Recrutar um informante local','informante'],['Recusar a missão','recusa']]},
  pick:(k,d)=>{ const m=S.me, j=m.job, P2=nomePais(d.p); if(!j) return '';
    if(!d.e){ if(k==='recusa'){ j.perf=clamp(j.perf-4); return 'Recusei. O coronel anotou.'; } if(k==='informante'){ if(R.chance(.6)){ j.perf=clamp(j.perf+8); return `O informante entregou planos de ${P2}. Missão cumprida sem eu sair do país.`; } relMudar(m.country,d.p,-10); return 'O informante era agente duplo. A rede caiu.'; } queue('espionagem',Object.assign({},d,{e:1})); return `Embarquei para ${P2} com um passaporte novo.`; }
    if(k==='aborta'){ return 'Saí do país na primeira oportunidade. Sem prêmio, mas viv'+oa()+'.'; }
    const p=k==='disfarce'?.55+m.smarts/250+(m.talent.acting||0)/400:.45+(m.talent.athletic||30)/300; const x=R.f();
    if(x<p){ j.perf=clamp(j.perf+15); m.fame=clamp(m.fame+1); if(R.chance(.3)&&j.lvl<SPECIAL.militar.l.length-1){ j.lvl++; return `Trouxe segredos valiosos de ${P2}. Fui promovid${oa()} em segredo.`; } return `Missão cumprida: documentos secretos de ${P2} na mesa do general.`; }
    relMudar(m.country,d.p,-20); if(x<p+.12){ log(`Fui mort${oa()} em uma missão de espionagem em ${P2}.`,'bad'); die(`em uma missão secreta em ${P2}`); return 'O guarda sacou primeiro.'; }
    if(x<p+.35){ arrest(`espionagem em ${P2}`,5,20); m.c.presoExterior=d.p; return `Fui pres${oa()} pela contrainteligência de ${P2}. Meu país nega me conhecer.`; }
    return 'Fui descobert'+oa()+', mas escapei pela fronteira a pé. A missão fracassou.'; }};
V.jobMenu=(o=>function(){ const r=o.apply(this,arguments), m=S.me, j=m.job; if(!j||j.spc!=='militar'||!r||!r.items) return r; const G=guerraAtual(), emGuerra=G&&ladoDe(G,m.country);
  r.items.push({sec:'Operações'}); if(emGuerra) r.items.push({ic:'⚔️',l:'Ir para a frente de batalha',s:'Combate de verdade · medalhas e risco de morte',tone:'bad',on:()=>act(()=>{ if(use('front')>2) return 'Já estive na frente demais este ano. Ordens de descanso.'; queue('guerra_front',{}); return ''; },'Guerra')});
  r.items.push({ic:'🕵️',l:'Missão de espionagem',s:'Em outro país · pode ser pres'+oa()+' ou mort'+oa(),tone:'bad',on:()=>act(()=>{ if(use('espiao')>1) return 'Uma missão secreta por ano.'; queue('espionagem',EVENTS.espionagem.prep(m)); return ''; },'Espionagem')}); return r; })(V.jobMenu);
