// ===== 2.10: o golpe vira um regime de verdade =====
// Quem toma o poder pelo golpe não é presidente: governa um regime, com medo, lealdade dos militares,
// pressão internacional, culto à personalidade, revoltas e atentados. Tudo fica em m.office.reg.

function regime(){ const o=S.me.office; if(!o||!o.dit) return null;
  if(!o.reg) o.reg={n:'Regime do '+(S.me.c.golpeMov||'Movimento'),medo:40,leal:55,pres:30,estatuas:0,eleicoes:0,anos:0};
  return o.reg; }
function regFix(r){ ['medo','leal','pres'].forEach(k=>r[k]=clamp(r[k])); return r; }
const tituloDitador=()=>S.me.gender==='F'?'Líder suprema':'Líder supremo';

golpeFim=(o=>function(){ const mov=rev()&&rev().n; const t=o.apply(this,arguments); if(S.me.office&&S.me.office.dit){ S.me.c.golpeMov=mov; regime().n='Regime do '+(mov||'Movimento'); } return t; })(golpeFim);

function regAcao(k){ const m=S.me, o=m.office, r=regime(); if(!r) return ''; if(use('reg_'+k)>2) return 'Já fiz muito disso este ano.';
  const cofre=Math.round(OFFICES.find(x=>x.id==='pres').sal*R.int(20,60));
  switch(k){
    case 'propaganda': o.appr=clamp(o.appr+R.int(4,10)); r.pres+=2; regFix(r); return R.pick(['Meu rosto agora aparece antes de todo programa de TV.','Cartazes com o meu sorriso cobriram as fachadas da capital.','As escolas passaram a cantar um hino em minha homenagem.']);
    case 'estatua': { const c=500000; if(m.money<c) return `Uma estátua de bronze custa ${fmt(c)}.`; m.money-=c; r.estatuas++; m.fame=clamp(m.fame+6); o.appr=clamp(o.appr+R.int(-4,6)); return r.estatuas===1?'Inaugurei uma estátua de dez metros de mim mesm'+oa()+' na praça central.':`Já são ${r.estatuas} estátuas minhas espalhadas pelo país.`; }
    case 'desfile': r.leal+=R.int(5,10); r.medo+=R.int(3,6); r.pres+=3; regFix(r); return 'Tanques, mísseis e soldados marchando em frente ao palanque. Bati continência por três horas.';
    case 'policia': r.medo+=R.int(8,14); o.appr=clamp(o.appr-R.int(3,8)); m.karma=clamp(m.karma-12); r.pres+=4; regFix(r); return R.pick(['A polícia secreta prendeu jornalistas e professores durante a madrugada.','Ninguém mais fala de política nos bares. Nunca se sabe quem está ouvindo.']);
    case 'censura': r.medo+=R.int(5,9); r.pres+=6; o.appr=clamp(o.appr-R.int(0,4)); regFix(r); return 'Fechei os jornais da oposição e bloqueei as redes sociais estrangeiras.';
    case 'eleicao': r.eleicoes++; r.pres+=R.int(8,14); o.appr=clamp(o.appr+R.int(-2,4)); regFix(r); return `Eleição "livre": venci com ${R.int(96,99)},${R.int(1,9)}% dos votos. Os observadores internacionais não foram convidados.`;
    case 'saquear': m.money+=cofre; o.appr=clamp(o.appr-R.int(4,10)); r.leal-=R.int(3,8); m.karma=clamp(m.karma-10); regFix(r); return `Transferi ${fmt(cofre)} do tesouro nacional para uma conta na Suíça.`;
    case 'generais': { const c=Math.min(m.money,800000); if(c<100000) return 'Os generais querem pelo menos $100.000.'; m.money-=c; r.leal+=Math.round(c/40000); regFix(r); return `Distribuí ${fmt(c)} entre os generais. Os quartéis estão felizes.`; }
    case 'nacionalizar': o.appr=clamp(o.appr+R.int(6,12)); r.pres+=R.int(10,16); regFix(r); return 'Nacionalizei as empresas estrangeiras. O povo comemorou; as embaixadas, não.';
    case 'expurgo': r.leal+=R.int(6,12); r.medo+=R.int(6,10); m.karma=clamp(m.karma-15); regFix(r); return 'Afastei metade dos ministros. Os que ficaram juram lealdade eterna.';
  }
  return '';
}
function regExilio(){ const m=S.me, r=regime(); m.office=null; m.c.fugitive=1; m.money=Math.round(m.money*.8); log(`Fugi para o exílio. O ${r?r.n:'regime'} caiu sem mim.`,'warn'); return 'Um avião particular, malas cheias de dinheiro e um país inteiro comemorando a minha partida.'; }

// tela: no lugar do "Mandato" de presidente entra o "Regime"
V.career=(o=>function(){ const res=o.apply(this,arguments), m=S.me, r=regime(); if(!r||!res||!res.items||m.prison) return res;
  const i=res.items.findIndex(x=>x&&x.sec==='Mandato'); if(i<0) return res;
  let j=i+1; while(j<res.items.length&&!(res.items[j]&&res.items[j].sec)) j++;
  const of=m.office, A=(k,ic,l,s,crit)=>({ic,l,s,tone:crit?'bad':'',on:crit?()=>confirmBox(l+'?',crit,'Confirmar',()=>act(()=>regAcao(k),r.n)):()=>act(()=>regAcao(k),r.n)});
  const novos=[{sec:'Regime'},
    {html:`<div class="card"><p><b>🎖️ ${esc(tituloDitador())} de ${esc(countryOf(m.country).n)}</b></p>${kv('Regime',r.n)}${kv('Anos no poder',of.yrs)}${kv('Estátuas minhas',r.estatuas)}${bar('Aprovação do povo',of.appr)}${bar('Medo da população',r.medo)}${bar('Lealdade dos militares',r.leal)}${bar('Pressão internacional',r.pres)}</div>`},
    {sec:'Culto à personalidade'}, A('propaganda','📺','Propaganda estatal','Aprovação'), A('estatua','🗿','Erguer uma estátua minha',`${fmt(500000)} · fama`), A('desfile','🎖️','Desfile militar','Lealdade e medo'),
    {sec:'Mão de ferro'}, A('policia','🕵️','Polícia secreta caça opositores','Muito medo · aprovação cai','Prisões, desaparecimentos e carma no chão.'), A('censura','🚫','Censurar a imprensa','Medo · pressão internacional'),
      A('eleicao','🗳️','Eleição de fachada','Pressão internacional sobe'), A('expurgo','⚖️','Expurgo no governo','Lealdade e medo','Ministros vão sumir. Não tem volta.'),
    {sec:'Dinheiro e poder'}, A('saquear','💰','Saquear o tesouro nacional','Dinheiro · aprovação e lealdade caem','O dinheiro é do país. Se descobrirem, a revolta vem mais rápido.'), A('generais','🎁','Pagar os generais','Lealdade dos militares'), A('nacionalizar','🏭','Nacionalizar empresas estrangeiras','Aprovação · sanções'),
    {ic:'🛫',l:'Fugir para o exílio',s:'Leva parte da fortuna e deixa o poder',tone:'bad',on:()=>confirmBox('Fugir para o exílio?','Não dá para voltar. O regime acaba hoje.','Fugir',()=>act(regExilio,'Exílio'))}];
  res.items.splice(i,j-i,...novos); return res; })(V.career);

// todo ano: sanções, medo que passa, revoltas, golpes internos e atentados
yearMoney=(o=>function(){ const x=o.apply(this,arguments); try{ const m=S.me, r=regime(); if(r&&m.alive&&!m.prison){ r.anos++;
  r.medo-=R.int(2,6); r.leal-=R.int(1,5); regFix(r);
  if(r.pres>=50&&(typeof nlTemSancionador!=="function"||nlTemSancionador())){ const perda=Math.round(Math.max(0,m.money)*r.pres/1000); if(perda>0){ m.money-=perda; log(`Sanções internacionais congelaram ${fmt(perda)} das minhas contas no exterior.`,'bad'); } }
  if(m.office.appr<30&&r.medo<40&&R.chance(.4)) queue('regime_revolta',{});
  else if(r.leal<30&&R.chance(.35)) queue('rev_contragolpe',{});
  else if(R.chance(.08+r.pres/700)) queue('regime_atentado',{}); } }catch(e){} return x; })(yearMoney);

EVENTS.regime_revolta={show:()=>({k:'Revolução',t:'🔥 O povo tomou as ruas',x:`Milhões de pessoas cercam o palácio exigindo o fim do ${regime()?regime().n:'regime'}.`,ch:[['Mandar o exército atirar','a'],['Prometer eleições livres','e'],['Fugir para o exílio','f']]}),
  pick:k=>{ const m=S.me, r=regime(); if(!r) return '';
    if(k==='f') return regExilio();
    if(k==='e'){ m.office.appr=clamp(m.office.appr+20); r.medo-=10; r.pres-=10; regFix(r); return 'Prometi eleições. A multidão voltou para casa, desconfiada.'; }
    if(R.chance(r.leal/100)){ r.medo+=25; r.pres+=25; m.karma=clamp(m.karma-30); regFix(r); return 'O exército obedeceu. O massacre correu o mundo, mas eu continuo no poder.'; }
    m.office=null; if(R.chance(.4)){ die('pelo próprio povo, depois que o exército se recusou a atirar'); return 'Os soldados baixaram as armas. A multidão invadiu o palácio.'; }
    arrest('crimes contra a humanidade',25,50); return 'Os soldados baixaram as armas e me entregaram ao tribunal.'; }};
EVENTS.regime_atentado={show:()=>({k:'Perigo',t:'💥 Atentado contra mim',x:'Uma bomba explodiu perto do carro oficial durante o desfile.',ch:[['Caçar os culpados','c'],['Sumir da vista do povo por um tempo','s']]}),
  pick:k=>{ const m=S.me, r=regime(); if(!r) return '';
    if(R.chance(.12-r.leal/1500)){ m.office=null; die('num atentado a bomba'); return 'Não houve tempo de reagir.'; }
    st('health',-R.int(5,20));
    if(k==='c'){ r.medo+=12; m.karma=clamp(m.karma-8); regFix(r); return 'Sobrevivi com ferimentos. Centenas foram presos na mesma semana.'; }
    r.medo-=5; m.office.appr=clamp(m.office.appr-4); regFix(r); return 'Sobrevivi e passei meses escondid'+oa()+' num bunker.'; }};
