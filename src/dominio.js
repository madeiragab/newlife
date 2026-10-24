// ===== 2.14: a seita e o império tomam o mundo =====
// Seita: regra de sucessão escolhida ao fundar (hereditária, escolhida ou conselho), hereges com debate em
// minigame e risco de cisma, caça ao traidor, guerra santa contra rivais e expansão país por país até a fé
// mundial. Chefe de Estado (presidente, regime ou monarca): influência, governo fantoche e invasão até virar
// Rei do Mundo. Quanto mais poder, mais os outros países se unem: sanções, ultimato e guerra de coalizão.

const PAIS_FE={BR:80,MX:78,AR:66,PT:58,AO:76,US:70,CA:42,GB:36,FR:30,DE:34,IT:60,ES:48,JP:22,KR:50,IN:84};
const feDe=id=>PAIS_FE[id]||50;
const nomeNpcD=()=>{ const c=countryOf(S.me.country), gn=R.chance(.5)?'M':'F'; return {n:`${R.pick(c[gn])} ${R.pick(c.L)}`,gn}; };
const irmaoDe=gn=>gn==='F'?'Irmã':'Irmão';
const eleDe=gn=>gn==='F'?'ela':'ele';
const oaDe=gn=>gn==='F'?'a':'o';
const sLiderD=()=>{ const s=seita(); return s&&!s.membro?s3(s):null; };

// ---------- sucessão da seita: decidida na fundação ----------
const SEITA_SUC={hered:['👑','Hereditária','Um filho herda a liderança. A fé vira dinastia: mais devoção, e os herdeiros podem disputar o trono.'],
  escolha:['☝️','Eu escolho o sucessor','Indico em vida qual filho herda. Sem indicação, o grupo escolhe outra pessoa.'],
  conselho:['⚖️','Conselho de anciãos','Um conselho elege o próximo líder. Menos devoção, e o grupo sobrevive sem mim.']};
seitaFundar=(o=>function(){ const ja=!!S.me.seita, r=o.apply(this,arguments), s=seita(); if(!ja&&s&&!s.membro&&!s.suc) queue('seita_regra',{}); return r; })(seitaFundar);
EVENTS.seita_regra={prep:()=>sLiderD()?{}:null,
  show:()=>{ const s=seita(); return {k:'Religião',t:'⚖️ Quem vem depois de mim?',x:`Antes de tudo, preciso escrever a regra mais importante de ${s?s.n:'meu grupo'}: o que acontece quando eu não estiver mais aqui.`,ch:Object.entries(SEITA_SUC).map(([k,v])=>[`${v[0]} ${v[1]}`,k])}; },
  pick:k=>{ const s=sLiderD(); if(!s||!SEITA_SUC[k]) return ''; s.suc=k; if(k==='hered') s.devo+=5; if(k==='conselho') s.devo-=5; seitaFix(s); log(`Regra de sucessão de ${s.n}: ${SEITA_SUC[k][1].toLowerCase()}.`); return SEITA_SUC[k][2]; }};
function seitaEscolherHerdeiro(){ const s=sLiderD(), ks=kids().filter(k=>k.alive); if(!s) return; if(!ks.length) return modal({t:'Sucessão',x:'Ainda não tenho filhos para herdar o grupo.'});
  modal({t:'☝️ Sucessor',x:`Quem herda ${s.n} quando eu me for?`,ch:ks.map(k=>({l:`${fullName(k)} · ${k.age} anos`,fn:()=>{ s.herdeiro=k.id; log(`Nomeei ${k.first} sucessor${k.gender==='F'?'a':''} em ${s.n}.`,'big'); after(); }})).concat([{l:'Cancelar',cls:'alt'}])}); }
// a morte entrega o grupo a outra pessoa (sucessao.js); guardo uma cópia para o herdeiro
die=(o=>function(){ const m=S.me; if(m&&m.alive&&m.seita&&!m.seita.membro) m.c.seitaHer=JSON.parse(JSON.stringify(m.seita)); return o.apply(this,arguments); })(die);
continueAs=(o=>function(k){ const old=S.me, sh=old&&old.c&&old.c.seitaHer, I=old&&old.imperio, rei=old&&old.c&&old.c.reiMundo;
  const res=o.apply(this,arguments), m=S.me; if(res===false||!m||m===old||!m.alive) return res;
  if(sh&&!m.seita&&(sh.suc==='hered'||(sh.suc==='escolha'&&sh.herdeiro===(k&&k.id)))){
    const s=sh; s.membro=0; s.lider=null; s.liderId=null; s.cargo=0; s.herdeiro=null; s.fundador=s.fundador||`${old.first} ${old.last}`; s.geracao=(s.geracao||1)+1; s.anos=0;
    s.devo=clamp(s.devo+(s.suc==='hered'?5:-5)); m.seita=s3(s); m.c.seita=1; if(s.mundo&&Object.values(s.mundo).some(v=>v.nv>=4)) m.c.feMundial=old.c.feMundial;
    log(`🕯️ Herdei a liderança de ${s.n}, ${s.geracao}ª geração da fé.`,'big'); queue('seita_heranca',{}); }
  if(I&&Object.keys(I.p||{}).length&&I.dinastia&&((m.office&&m.office.dit)||(m.royal&&m.royal.reign))){
    m.imperio=JSON.parse(JSON.stringify(I)); m.imperio.anos=0; if(rei) m.c.reiMundo=1; log(`🌍 Herdei o império: ${impDominados()} país(es) sob o meu domínio.`,'big'); }
  return res; })(continueAs);
EVENTS.seita_heranca={prep:()=>sLiderD()?{}:null,
  show:()=>{ const s=seita(), irm=people('irmao').filter(p=>p.alive&&p.age>=16); const i=irm[0];
    const ch=[['Honrar o legado e manter tudo como está','legado'],['Reformar a doutrina do meu jeito','reforma'],['Expurgar a velha guarda','expurgo']]; if(i) ch.push([`Dividir o poder com ${i.first}`,'divide']);
    return {k:'Religião',t:'🕯️ A herança da fé',x:`Os fiéis de ${s?s.n:'o grupo'} esperam o primeiro sermão de quem herdou ${s&&s.fundador?'o lugar de '+s.fundador:'o trono'}.${i?` ${i.first} acha que o lugar devia ser ${i.gender==='F'?'dela':'dele'}.`:''} Como começo?`,ch}; },
  pick:k=>{ const m=S.me, s=sLiderD(); if(!s) return ''; const i=people('irmao').filter(p=>p.alive&&p.age>=16)[0]; let t='';
    if(k==='legado'){ s.devo+=8; t='Repeti as palavras do fundador. Os mais velhos choraram; ninguém duvidou de mim.'; }
    else if(k==='reforma'){ s.devo-=10; s.fama+=8; s.hereges=(s.hereges||0)+1; t='Mudei rituais, cores e o hino. A imprensa gostou. Os antigos, nem um pouco.'; }
    else if(k==='expurgo'){ s.devo+=5; m.karma=clamp(m.karma-8); s.traicao=(s.traicao||0)+1; t='Os conselheiros do meu antecessor foram afastados na mesma noite. O medo também é uma forma de fé.'; }
    else if(k==='divide'&&i){ s.devo+=3; s.coLider=i.first; i.bond=clamp((i.bond||50)+15); t=`${i.first} virou co-líder. Por enquanto, a família está unida.`; }
    if(i&&k!=='divide'&&R.chance(.45)){ t+=' '+seitaCisma(s,`${i.first} ${i.last||''}`.trim(),35,i.gender); i.bond=clamp((i.bond||50)-30); }
    seitaFix(s); return t; }};

// ---------- hereges, debate em minigame e cisma ----------
const HERESIAS=['diz que eu sou só um mensageiro e que a verdadeira revelação é a dele','prega que o caixa do grupo deveria ser dividido entre os fiéis','jura que recebeu uma visão nova que contradiz a minha doutrina','ensina que o grupo não precisa de líder, só de fé','afirma que o fim já começou e que é preciso agir com as próprias mãos','reescreveu os nossos textos sagrados e já tem discípulos próprios'];
const DEBATE_ARG={escritura:'cita trechos dos nossos próprios textos contra mim.',milagre:'exige que eu prove um milagre ali, na frente de todos.',dinheiro:'aponta para o meu carro e pergunta para onde vai o dízimo.',emocao:'chora falando da mãe que morreu esperando a salvação.',logica:'lista, uma por uma, as minhas profecias que não aconteceram.'};
const DEBATE_RESP=[['📜 Citar a passagem que ficou de fora','escritura'],['✨ Fazer um gesto de cura diante de todos','milagre'],['📒 Abrir as contas do caixa ali mesmo','dinheiro'],['🤗 Abraçar e chorar junto','emocao'],['🧠 Explicar que a profecia era simbólica','logica']];
const DEBATE_QUASE={escritura:['logica'],milagre:['emocao'],dinheiro:['logica'],emocao:['milagre','escritura'],logica:['escritura']};
function seitaCisma(s,n,f,gn){ const perde=Math.max(1,Math.round(s.fieis*Math.min(.45,.05+f/250))); s.fieis-=perde; s.devo-=5;
  let t; if(s.rival){ s.rival.forca+=15; t=`${n} saiu levando ${perde.toLocaleString('pt-BR')} fiéis e se juntou a ${s.rival.n}.`; }
  else { s.rival={n:`${R.pick(['Verdadeira','Nova','Remanescente'])} ${s.n}`,lider:`${irmaoDe(gn)} ${n}`,forca:20+Math.round(f/2)}; t=`Cisma: ${n} fundou ${s.rival.n} e levou ${perde.toLocaleString('pt-BR')} fiéis.`; }
  seitaFix(s); s3RivalFix(s); log(t,'bad'); return t; }
EVENTS.seita_heresia={prep:()=>{ if(!sLiderD()) return null; const p=nomeNpcD(); return {n:p.n,gn:p.gn,i:R.int(0,HERESIAS.length-1),f:R.int(15,55)}; },
  show:d=>{ d.i=d.i||0; d.f=d.f||30; d.n=d.n||'Tomé'; return {k:'Heresia',t:'🔥 Um herege no púlpito',x:`${irmaoDe(d.gn)} ${d.n}, um dos pregadores mais queridos, ${HERESIAS[d.i%HERESIAS.length]}. Uns ${d.f}% dos fiéis já repetem o que ${eleDe(d.gn)} diz.`,
    ch:[['Desafiar para um debate diante de todos','debate'],['Excomungar','excom'],['Absorver a ideia na doutrina','absorver'],['Silenciar de vez','silenciar']]}; },
  pick:(k,d)=>{ const m=S.me, s=sLiderD(); if(!s) return ''; const f=d.f||30, n=d.n||'Tomé';
    if(k==='debate'){ queue('seita_debate',{r:0,pts:0,arg:R.pick(Object.keys(DEBATE_ARG)),n,gn:d.gn,f}); return 'Marquei o debate para o culto de domingo. O salão vai lotar.'; }
    if(k==='excom'){ if(R.chance(f/100+.1)) return `Li a excomunhão em voz alta. ${seitaCisma(s,n,f,d.gn)}`; s.devo+=5; seitaFix(s); return `${n} saiu sozinh${oaDe(d.gn)}, de cabeça baixa. Ninguém foi atrás.`; }
    if(k==='absorver'){ s.devo-=5; s.hereges=(s.hereges||0)+1; seitaFix(s); return `Anunciei a "revelação" de ${n} como se fosse minha. Funcionou, mas ${eleDe(d.gn)} sabe a verdade.`; }
    m.karma=clamp(m.karma-15); s.susp+=12; seitaFix(s);
    if(R.chance(.3)) return `${n} sumiu por uma semana e voltou como mártir. ${seitaCisma(s,n,Math.round(f*1.5),d.gn)}`;
    if(R.chance(.15)){ arrest('coação de fiel',1,3); return `${n} foi direto à polícia.`; }
    return `${n} nunca mais pregou. Ninguém pergunta o motivo.`; }};
EVENTS.seita_debate={prep:()=>sLiderD()?{r:0,pts:0,arg:'escritura',n:'Tomé',gn:'M',f:30}:null,
  show:d=>{ const arg=DEBATE_ARG[d.arg]?d.arg:'escritura'; return {k:'Debate',t:`🎙️ Debate · rodada ${(d.r||0)+1} de 3`,x:`${d.r?`Placar até aqui: ${d.pts||0}. `:'Salão lotado, celulares filmando. '}${irmaoDe(d.gn)} ${d.n||'Tomé'} ${DEBATE_ARG[arg]} Como respondo?`,ch:DEBATE_RESP.map(x=>[x[0],x[1]])}; },
  pick:(k,d)=>{ const m=S.me, s=sLiderD(); if(!s) return ''; const arg=DEBATE_ARG[d.arg]?d.arg:'escritura', r=d.r||0, n=d.n||'Tomé';
    let g=k===arg?3:(DEBATE_QUASE[arg]||[]).includes(k)?1:-1; if(g>0&&R.chance(m.smarts/300)) g++;
    const pts=(d.pts||0)+g, reacao=g>=3?'A plateia levantou e aplaudiu.':g>0?'Alguns acenaram com a cabeça.':'Ouvi risadas no fundo do salão.';
    if(r<2){ queue('seita_debate',{...d,r:r+1,pts,arg:R.pick(Object.keys(DEBATE_ARG).filter(x=>x!==arg))}); return reacao; }
    if(pts>=6){ s.devo+=12; s.fama+=5; seitaFix(s); log(`Venci o debate contra ${n}.`,'good'); return `${reacao} Fim: ${pts} pontos. ${n} se ajoelhou e pediu perdão diante de todos.`; }
    if(pts>=2){ s.fieis=Math.round(s.fieis*.98); s.devo+=2; seitaFix(s); return `${reacao} Fim: ${pts} pontos. Empate. ${n} saiu com meia dúzia de seguidores.`; }
    return `${reacao} Fim: ${pts} pontos. Perdi o debate. ${seitaCisma(s,n,(d.f||30)+15,d.gn)}`; }};

// ---------- caça ao traidor ----------
const TRAICOES={caixa:['Sumiu dinheiro do caixa. Alguém do círculo íntimo está roubando.','comprou um carro importado à vista no mês passado'],
  policia:['A polícia sabe coisas que só o círculo íntimo sabe. Alguém está falando.','foi vist{o} saindo de uma delegacia num dia de semana'],
  rival:['O grupo rival copiou o meu sermão antes mesmo de eu pregar.','tem o número do líder rival salvo no celular'],
  imprensa:['Um jornal publicou fotos de dentro do nosso ritual secreto.','usa um broche estranho na túnica, que parece ter uma lente'],
  mundo:['Um governo estrangeiro sabe tudo sobre as nossas missões.','recebe ligações de um número de outro país toda madrugada']};
const PISTAS_FALSAS=['falta aos cultos desde que a mãe adoeceu','discutiu comigo na última reunião','anda cansad{o} e sem brilho nos olhos','reclamou do valor do dízimo','chora sozinh{o} no templo depois do culto','pediu férias pela primeira vez em dez anos','passou a chegar atrasad{o} nos encontros'];
function traidorDano(s,kind){ if(kind==='caixa'){ const v=Math.round(s.caixa*.25); s.caixa-=v; return `Perdemos ${fmt(v)}.`; } if(kind==='policia'){ s.susp+=15; return 'A polícia continua um passo à frente.'; }
  if(kind==='rival'){ if(s.rival) s.rival.forca+=10; s.fieis=Math.round(s.fieis*.97); return 'O rival continua sabendo de tudo.'; } if(kind==='mundo'){ const M=smFix(s); Object.values(M).forEach(v=>{ v.f=Math.round((v.f||0)*.85); }); return 'As missões no exterior sofreram batidas policiais.'; }
  s.fama-=8; s.susp+=10; return 'Mais fotos foram publicadas.'; }
EVENTS.seita_traidor={prep:()=>{ const s=sLiderD(); if(!s) return null; const ks=['caixa','policia','imprensa']; if(s.rival) ks.push('rival'); if(Object.keys(smFix(s)).length) ks.push('mundo');
    const kind=R.pick(ks), falsas=R.shuffle(PISTAS_FALSAS.slice()), cul=R.int(0,2); return {kind,cul,sus:[0,1,2].map(i=>{ const p=nomeNpcD(); return {n:p.n,gn:p.gn,p:i===cul?TRAICOES[kind][1]:falsas[i]}; })}; },
  show:d=>{ const T=TRAICOES[d.kind]||TRAICOES.caixa, sus=d.sus||[]; return {k:'Traição',t:'🐍 Há um traidor entre nós',x:`${T[0]} Só três pessoas tinham acesso. O que eu sei de cada uma:\n${sus.map(x=>`• ${x.n}: ${String(x.p).replace(/\{o\}/g,oaDe(x.gn))}.`).join('\n')}`,
    ch:sus.map((x,i)=>[`Acusar ${x.n}`,'a'+i]).concat([['Fingir que não percebi','x']])}; },
  pick:(k,d)=>{ const m=S.me, s=sLiderD(); if(!s) return ''; const sus=d.sus||[], kind=d.kind||'caixa';
    if(k==='x'){ const t=traidorDano(s,kind); seitaFix(s); return `Fingi que não vi nada. ${t}`; }
    const i=+String(k).slice(1), x=sus[i]; if(!x) return '';
    if(i===d.cul){ queue('seita_traidor_fim',{n:x.n,gn:x.gn,kind}); s.devo+=4; seitaFix(s); return `Era ${x.n}. Quando mostrei a prova, ${eleDe(x.gn)} ficou branc${oaDe(x.gn)}.`; }
    s.devo-=10; m.karma=clamp(m.karma-5); const t=traidorDano(s,kind); seitaFix(s); return `Acusei ${x.n} na frente de todos. Era inocente. ${t}`; }};
EVENTS.seita_traidor_fim={prep:()=>sLiderD()?{n:'Judas',gn:'M',kind:'caixa'}:null,
  show:d=>({k:'Traição',t:`O que fazer com ${d.n||'o traidor'}?`,x:`${d.n||'O traidor'} está de joelhos na minha frente. O círculo íntimo inteiro está olhando.`,ch:[['Perdoar em público','perdoar'],['Expulsar do grupo','expulsar'],['Entregar à polícia','policia'],['Fazer sumir','sumir']]}),
  pick:(k,d)=>{ const m=S.me, s=sLiderD(); if(!s) return ''; const n=d.n||'O traidor';
    if(k==='perdoar'){ s.devo+=8; m.karma=clamp(m.karma+5); s.traicao=(s.traicao||0)+1; seitaFix(s); return 'Perdoei diante de todos. Os fiéis me chamaram de santo. Espero não me arrepender.'; }
    if(k==='expulsar'){ s.devo+=4; s.susp+=3; seitaFix(s); return `${n} saiu pela porta dos fundos com uma mala e nenhum amigo.`; }
    if(k==='policia'){ s.susp+=d.kind==='caixa'?-5:8; s.fama+=2; seitaFix(s); return d.kind==='caixa'?'Denunciei o roubo. Ficamos com cara de vítima, do jeito bom.':'A polícia agradeceu e aproveitou para fazer mais perguntas sobre nós.'; }
    m.karma=clamp(m.karma-20); s.susp+=15; s.devo+=10; seitaFix(s);
    if(R.chance(.12)){ arrest('homicídio',8,20); return `${n} nunca foi encontrad${oaDe(d.gn)}. Já eu, fui.`; }
    return `Ninguém mais viu ${n}. No culto seguinte, o silêncio era absoluto.`; }};

// ---------- guerra santa contra a seita rival ----------
EVENTS.seita_guerra_santa={prep:()=>{ const s=sLiderD(); return s&&s.rival?{}:null; },
  show:()=>{ const s=seita(), r=s&&s.rival; return {k:'Guerra santa',t:'⚔️ Guerra santa',x:`${r?r.n:'O grupo rival'} (força ${r?r.forca:0}) e ${s?s.n:'o meu grupo'} não cabem mais na mesma cidade. Qual é a minha frente de ataque?`,
    ch:[['🕵️ Infiltrar missionários e roubar fiéis','roubar'],[`📺 Campanha na mídia (${fmt(200000)})`,'midia'],['⚖️ Processar por charlatanismo','tribunal'],['🔥 Marcha dos fiéis até o templo deles','marcha'],['🕊️ Tratado: dividir as cidades','paz']]}; },
  pick:k=>{ const m=S.me, s=sLiderD(); if(!s||!s.rival) return ''; const r=s.rival; let t='';
    if(k==='roubar'){ if(R.chance(.45+s.devo/300)){ const g=Math.round(r.forca*R.int(8,20)); r.forca-=20; s.fieis+=g; t=`Meus missionários voltaram com ${g} convertidos do outro lado.`; } else { s.fieis=Math.round(s.fieis*.97); t='Meus missionários é que foram convertidos. Três não voltaram.'; } }
    else if(k==='midia'){ if(!s3Pago(s,200000)) return `A campanha custa ${fmt(200000)}.`; r.forca-=R.int(10,25); s.fama+=5; t=`Reportagens sobre o luxo de ${r.lider} passaram no horário nobre.`; }
    else if(k==='tribunal'){ if(R.chance(.4+(r.forca<40?.2:0))){ r.forca-=30; t=`O juiz fechou o templo principal de ${r.n}.`; } else { s.susp+=8; t='O processo virou contra-processo. Agora somos nós que temos que explicar o caixa.'; } }
    else if(k==='marcha'){ r.forca-=R.int(15,35); s.susp+=20; m.karma=clamp(m.karma-8);
      if(R.chance(.25)){ seitaFix(s); s3RivalFix(s); arrest('incitação à violência',2,6); return 'A marcha virou pancadaria. Teve morte, e a polícia sabia quem tinha convocado.'; } t='Milhares de fiéis cercaram o templo deles cantando. Ninguém de lá teve coragem de sair.'; }
    else { r.paz=S.year; s.devo-=5; t=`Assinei com ${r.lider} um tratado: cada um fica com as suas cidades. Por enquanto.`; }
    if(r.forca<=0){ const g=R.int(50,400); s.fieis+=g; t+=` ${r.n} se desfez, e ${g} fiéis de lá vieram para nós.`; }
    seitaFix(s); s3RivalFix(s); return t; }};

// ---------- expansão mundial da seita ----------
const SM_NIVEIS=[['Nenhuma presença','⬜'],['Missão','🕯️'],['Comunidade','🏘️'],['Igreja nacional','⛪'],['Domínio da fé','👑']];
const SM_ABORD=[['porta','🚪 Missionários de porta em porta'],['estadio','🏟️ Mega-evento num estádio'],['digital','📱 Evangelho digital no idioma local'],['tv','📺 Comprar uma emissora local'],['famoso','🌟 Converter uma celebridade local']];
const SM_PREF={BR:'estadio',MX:'porta',AR:'famoso',PT:'porta',AO:'estadio',US:'tv',CA:'digital',GB:'digital',FR:'famoso',DE:'digital',IT:'porta',ES:'famoso',JP:'digital',KR:'tv',IN:'estadio'};
const SM_DICA={estadio:'o povo adora multidões, shows e eventos de massa',porta:'a fé ainda passa de vizinho para vizinho, dentro das casas',famoso:'todo mundo copia o que as celebridades fazem',tv:'a televisão ainda decide o que o país pensa',digital:'tudo acontece no celular, e ninguém abre a porta para estranhos'};
const SM_QUASE={estadio:['tv'],porta:['famoso'],famoso:['tv','estadio'],tv:['digital'],digital:['famoso']};
const SM_MISSAO=80000;
function smFix(s){ s.mundo=s.mundo||{}; return s.mundo; }
const smNivelF=f=>f>=6000?3:f>=600?2:f>0?1:0;
const smCasa=s=>(s.dom||[]).length>=4;
function smDominados(s){ return Object.entries(smFix(s)).filter(([id,v])=>id!==S.me.country&&v.nv>=4).length+(smCasa(s)?1:0); }
function smFieisMundo(s){ return s.fieis+Object.values(smFix(s)).reduce((a,v)=>a+(v.f||0),0); }
const smPodeExpandir=s=>seitaEstagio(s)>=4;
function smTitulo(s){ const n=smDominados(s), F=S.me.gender==='F'; if(S.me.c.feMundial) return F?'Rainha do Mundo e Profetisa Suprema':'Rei do Mundo e Profeta Supremo';
  if(n>=10) return F?'Senhora da fé mundial':'Senhor da fé mundial'; if(n>=6) return 'Pontífice internacional'; if(n>=3) return F?'Profetisa continental':'Profeta continental'; if(n>=1) return 'Líder da fé nacional';
  return SEITA_ESTAGIOS[seitaEstagio(s)][1]; }
function smChanceDominio(s,id,via){ const v=smFix(s)[id]||{f:0}; let p=.2+Math.min(.3,(v.f||0)/80000)+s.devo/500+feDe(id)/500-forcaDe(id)/400;
  if(via==='golpe') p+=.05-(paisNuclear(id)?.1:0); if(via==='acordo') p+=.1; if(via==='revolucao') p+=Math.min(.15,(v.f||0)/200000); if((v.ban||0)>S.year) p-=.15;
  return Math.max(.05,Math.min(.85,p)); }
function smAcao(id,k){ const m=S.me, s=sLiderD(); if(!s) return ''; const M=smFix(s), c=COUNTRIES.find(x=>x.id===id); if(!c||id===m.country) return '';
  if(!smPodeExpandir(s)) return 'Preciso chegar ao estágio de Movimento (2.000 fiéis) antes de ir para o exterior.';
  if(use('sm_'+id)>1) return `Já mexi com ${c.n} este ano.`; const v=M[id];
  if(k==='missao'){ if(v&&v.nv) return `Já tenho presença ${doPais(c.n)}.`; if(!s3Pago(s,SM_MISSAO)) return `Abrir uma missão no exterior custa ${fmt(SM_MISSAO)}.`; queue('smundo_missao',{p:id}); return ''; }
  if(!v||!v.nv) return `Ainda não tenho presença ${doPais(c.n)}.`;
  if(k==='reforcar'){ const cst=40000*v.nv; if(!s3Pago(s,cst)) return `Mandar mais missionários custa ${fmt(cst)}.`; const g=Math.round(v.f*.3+R.int(100,400)*feDe(id)/50); v.f+=g; v.nv=Math.max(v.nv,smNivelF(v.f)); seitaFix(s); return `Mandei mais missionários. ${g.toLocaleString('pt-BR')} novos fiéis ${doPais(c.n)}.`; }
  if(k==='catedral'){ const cst=500000; if(v.cat) return `Já tenho uma catedral ${doPais(c.n)}.`; if(!s3Pago(s,cst)) return `Uma catedral nacional custa ${fmt(cst)}.`; v.cat=1; v.f=Math.round(v.f*1.25)+500; v.nv=Math.max(v.nv,smNivelF(v.f)); s.fama+=6; seitaFix(s); return `Inaugurei a catedral de ${s.n} na capital ${doPais(c.n)}. Fila de três quarteirões.`; }
  if(k==='dominar'){ if(v.nv>=4) return `${c.n} já segue a minha fé.`; if(v.nv<3) return `Preciso de uma igreja nacional ${doPais(c.n)} (6.000 fiéis lá) antes de tomar o país.`; queue('smundo_dominio',{p:id}); return ''; }
  return ''; }
EVENTS.smundo_missao={prep:()=>{ const s=sLiderD(); if(!s) return null; const id=R.pick(COUNTRIES.filter(c=>c.id!==S.me.country)).id; return {p:id}; },
  show:d=>{ const c=countryOf(d.p), pref=SM_PREF[d.p]||'porta'; return {k:'Missão',t:`🌍 Primeira missão ${doPais(c.n)}`,x:`Os missionários estão de malas prontas. O que dizem os meus informantes ${doPais(c.n)}: ${SM_DICA[pref]}. Por onde começo?`,ch:SM_ABORD.map(x=>[x[1],x[0]])}; },
  pick:(k,d)=>{ const s=sLiderD(); if(!s) return ''; const M=smFix(s), c=countryOf(d.p), pref=SM_PREF[d.p]||'porta'; const ac=k===pref, q=(SM_QUASE[pref]||[]).includes(k);
    const f=Math.round((ac?R.int(250,600):q?R.int(80,200):R.int(10,40))*feDe(d.p)/50); M[d.p]={f,nv:smNivelF(f),ano:S.year}; if(!ac&&!q) s.susp+=4; seitaFix(s);
    log(`🌍 ${s.n} abriu a primeira missão ${doPais(c.n)}.`,'good');
    return ac?`Acertei em cheio: ${f.toLocaleString('pt-BR')} pessoas já frequentam os nossos encontros ${doPais(c.n)}.`:q?`Funcionou mais ou menos. ${f} pessoas se aproximaram.`:`Ninguém deu bola. Só ${f} curiosos apareceram, e a polícia local anotou os nomes.`; }};
EVENTS.smundo_dominio={prep:()=>{ const s=sLiderD(); if(!s) return null; const e=Object.entries(smFix(s)).find(([id,v])=>v.nv===3); return e?{p:e[0]}:null; },
  show:d=>{ const s=seita(), c=countryOf(d.p), cp=v=>Math.round(smChanceDominio(s,d.p,v)*100)+'%'; return {k:'Domínio da fé',t:`👑 Tomar ${c.n}`,x:`${c.n} tem ${((smFix(s)[d.p]||{}).f||0).toLocaleString('pt-BR')} fiéis meus. Chegou a hora de o país inteiro seguir a nossa fé. Como?`,
    ch:[[`🗳️ Eleger um fiel presidente (${cp('eleicao')})`,'eleicao'],[`🎖️ Militares fiéis tomam o poder (${cp('golpe')})`,'golpe'],[`✊ Revolução popular da fé (${cp('revolucao')})`,'revolucao'],[`🤝 Acordo secreto com o governo, ${fmt(3000000)} (${cp('acordo')})`,'acordo'],['Ainda não','nao']]}; },
  pick:(k,d)=>{ const m=S.me, s=sLiderD(); if(!s) return ''; const v=smFix(s)[d.p], c=countryOf(d.p); if(!v||k==='nao') return 'Vou esperar o momento certo.';
    if(k==='acordo'&&!s3Pago(s,3000000)) return `O governo ${doPais(c.n)} quer ${fmt(3000000)}.`;
    if(R.chance(smChanceDominio(s,d.p,k))){ v.nv=4; v.desde=S.year; s.fama+=10; m.fame=clamp(m.fame+8); seitaFix(s); s.ameaca=(s.ameaca||0)+12;
      log(`👑 ${c.n} passou a seguir ${s.n}.`,'big'); if(typeof noticia==='function') noticia(`${c.n} adota a fé de ${s.n}`,`O governo ${doPais(c.n)} agora responde a ${fullName(m)}.`,'mundo','smdom:'+d.p+S.year,d.p,90);
      smChecarMundo(s);
      return {eleicao:`Nosso candidato venceu no primeiro turno. O novo presidente ${doPais(c.n)} jurou sobre o meu livro sagrado.`,golpe:`Os generais fiéis tomaram o palácio de madrugada. ${c.n} agora é uma teocracia.`,revolucao:'Milhões de fiéis nas ruas por semanas. O governo caiu, e o povo me chamou para a sacada.',acordo:'O presidente assinou em segredo. Na segunda-feira, a nossa fé virou religião oficial.'}[k]; }
    if(k==='golpe'){ v.ban=S.year+5; v.f=Math.round(v.f*.5); v.nv=smNivelF(v.f); s.susp+=15; seitaFix(s); return `O golpe fracassou. ${c.n} baniu ${s.n} e prendeu metade dos meus missionários.`; }
    if(k==='revolucao'){ v.f=Math.round(v.f*.6); v.nv=smNivelF(v.f); m.karma=clamp(m.karma-10); seitaFix(s); return 'O exército atirou na multidão. A revolução foi esmagada, e os mártires ficaram na conta da fé.'; }
    v.f=Math.round(v.f*.9); s.fama-=4; seitaFix(s); return k==='acordo'?'O governo pegou o dinheiro e depois negou tudo.':'Perdemos a eleição. A imprensa comemorou.'; }};
function smChecarMundo(s){ if(smDominados(s)>=COUNTRIES.length&&!S.me.c.feMundial&&!s.feMundialFila){ s.feMundialFila=1; queue('seita_fe_mundial',{}); } }
EVENTS.seita_fe_mundial={prep:()=>sLiderD()?{}:null,
  show:()=>{ const s=seita(); return {k:'Fé mundial',t:'🌍 O mundo inteiro reza do meu jeito',x:`Não sobrou um único país fora de ${s?s.n:'minha fé'}. Os chefes de Estado esperam em fila para beijar a minha mão. O que eu sou agora?`,
    ch:[['👑 Coroar-me Rei do Mundo','rei'],['✨ Declarar-me uma divindade viva','deus'],['🕊️ Proclamar uma era de paz e largar o poder terreno','paz']]}; },
  pick:k=>{ const m=S.me, s=sLiderD(); if(!s) return ''; m.c.feMundial=1; m.fame=100; s.feMundialFila=0;
    if(k==='rei'){ m.c.reiMundo=1; log(`👑 Fui coroad${oa()} ${m.gender==='F'?'Rainha':'Rei'} do Mundo.`,'big'); return 'A coroa foi feita com ouro de quinze países. Agora o mundo inteiro tem um só soberano.'; }
    if(k==='deus'){ s.devo=100; m.karma=clamp(m.karma-20); log('✨ Fui declarad'+oa()+' divindade viva por todas as nações.','big'); return 'Templos com o meu rosto em cada capital. Rezam para mim em quinze línguas.'; }
    m.karma=clamp(m.karma+30); s.devo-=10; seitaFix(s); log('🕊️ Proclamei uma era de paz mundial.','big'); return 'Mandei abrir as fronteiras e dissolver os exércitos. Os chefes de Estado acharam que era uma armadilha. Não era.'; }};

// ---------- reação do mundo contra a seita ----------
EVENTS.smundo_sancao={prep:()=>{ const s=sLiderD(); if(!s) return null; const l=COUNTRIES.filter(c=>!((smFix(s)[c.id]||{}).nv>=4)&&c.id!==S.me.country).sort((a,b)=>forcaDe(b.id)-forcaDe(a.id))[0]; return l?{l:l.id}:null; },
  show:d=>{ const s=seita(); return {k:'Mundo',t:'🚫 Sanções contra a fé',x:`${countryOf(d.l).n} liderou um bloco de países que congelou as contas de ${s?s.n:'meu grupo'} no exterior e chamou o grupo de "ameaça à soberania das nações".`,
    ch:[['Aceitar e esperar passar','aceitar'],['Mover o dinheiro por criptomoedas','cripto'],['Pagar lobistas nos parlamentos','lobby'],['Convocar protestos dos fiéis no mundo todo','protesto']]}; },
  pick:(k,d)=>{ const m=S.me, s=sLiderD(); if(!s) return ''; const n=countryOf(d.l).n;
    if(k==='aceitar'){ s.caixa=Math.round(s.caixa*.7); seitaFix(s); return 'Perdemos 30% do caixa. Os fiéis rezaram mais alto.'; }
    if(k==='cripto'){ if(R.chance(.55)){ s.caixa=Math.round(s.caixa*.92); seitaFix(s); return 'O dinheiro atravessou o bloqueio em carteiras anônimas.'; } s.caixa=Math.round(s.caixa*.55); s.susp+=12; seitaFix(s); return 'Rastrearam as carteiras. Perdemos quase metade do caixa.'; }
    if(k==='lobby'){ const c=Math.min(s.caixa,1500000); s.caixa-=c; s.ameaca=Math.max(0,(s.ameaca||0)-10); seitaFix(s); return `Gastei ${fmt(c)} em jantares e "doações". As sanções foram suavizadas.`; }
    s.fama+=6; s.ameaca=(s.ameaca||0)+8; if(R.chance(.3)) queue('smundo_cruzada',{}); seitaFix(s); return `Milhões de fiéis nas ruas de vinte capitais. ${n} recuou um pouco e prometeu revidar.`; }};
EVENTS.smundo_banimento={prep:()=>{ const s=sLiderD(); if(!s) return null; const e=Object.entries(smFix(s)).find(([id,v])=>v.nv>=1&&v.nv<4&&!((v.ban||0)>S.year)); return e?{p:e[0]}:null; },
  show:d=>{ const c=countryOf(d.p), s=seita(); return {k:'Mundo',t:`⛔ ${c.n} bane a fé`,x:`O parlamento ${doPais(c.n)} declarou ${s?s.n:'o meu grupo'} uma organização criminosa. Missionários estão sendo presos no aeroporto.`,
    ch:[['Retirar os missionários','retirar'],['Continuar na clandestinidade','clandestino'],['Processar o país numa corte internacional','corte']]}; },
  pick:(k,d)=>{ const s=sLiderD(); if(!s) return ''; const v=smFix(s)[d.p]; if(!v) return 'Já não tenho ninguém lá.'; v.ban=S.year+4;
    if(k==='retirar'){ v.f=Math.round(v.f*.4); v.nv=smNivelF(v.f); return 'Trouxe todo mundo de volta. Os que ficaram rezam escondidos.'; }
    if(k==='clandestino'){ v.f=Math.round(v.f*.75); v.nv=smNivelF(v.f); s.susp+=6; seitaFix(s); return 'Viramos uma igreja subterrânea. Cultos em porões, senhas na porta.'; }
    if(R.chance(.35)){ v.ban=0; s.fama+=5; seitaFix(s); return 'A corte internacional mandou derrubar o banimento. Vitória histórica.'; } v.f=Math.round(v.f*.6); v.nv=smNivelF(v.f); return 'A corte deu razão ao país. O banimento ficou.'; }};
EVENTS.smundo_cruzada={prep:()=>{ const s=sLiderD(); if(!s||guerraAtual()) return null; const al=Object.entries(smFix(s)).filter(([id,v])=>v.nv>=4).map(([id])=>id); if(!al.length) return null;
    const alvo=R.pick(al), l=COUNTRIES.filter(c=>c.id!==alvo&&!al.includes(c.id)&&c.id!==S.me.country).sort((a,b)=>forcaDe(b.id)-forcaDe(a.id))[0]; return l?{alvo,l:l.id}:null; },
  show:d=>{ const s=seita(); return {k:'Guerra',t:'⚔️ Uma cruzada contra a fé',x:`${countryOf(d.l).n} juntou uma coalizão para "libertar" ${countryOf(d.alvo).n} do governo de ${s?s.n:'minha fé'}. As tropas estão na fronteira.`,
    ch:[['Mandar os fiéis resistirem até o fim','resistir'],['Negociar: abrir mão do governo de lá','ceder'],['Pedir a todos os países fiéis que entrem na guerra','guerra']]}; },
  pick:(k,d)=>{ const s=sLiderD(); if(!s) return ''; const v=smFix(s)[d.alvo]; if(!v) return '';
    if(k==='ceder'){ v.nv=3; s.ameaca=Math.max(0,(s.ameaca||0)-15); s.devo-=6; seitaFix(s); return `Entreguei o governo ${doPais(countryOf(d.alvo).n)}. A fé continua lá, sem o palácio.`; }
    if(guerraAtual()) return 'O mundo já está em guerra. A cruzada ficou para depois.';
    const G=guerraIniciar(d.l,d.alvo,'cruzada'); if(G&&k==='guerra'){ for(const [id,x] of Object.entries(smFix(s))) if(x.nv>=4&&!G.a.includes(id)&&!G.b.includes(id)) G.b.push(id); G.mundial=G.a.length+G.b.length>=6||G.mundial; }
    s.devo+=5; seitaFix(s); return k==='guerra'?'Todos os países fiéis declararam guerra junto. É uma guerra santa mundial.':'Os fiéis cavaram trincheiras rezando. A guerra começou.'; }};

// ---------- império do chefe de Estado ----------
const IMP_NIVEIS=[['Independente','🏳️'],['Influência','🤝'],['Aliado subordinado','🪢'],['Governo fantoche','🎭'],['Anexado','🗺️']];
function chefeEstado(m=S.me){ if(!m||!m.alive||m.prison) return null; const o=m.office; if(o&&o.id==='pres') return o.dit?'reg':'pres'; if(m.royal&&m.royal.reign&&!m.royal.abd) return 'rei'; return null; }
function imp(){ const m=S.me; if(!m.imperio) m.imperio={p:{},ameaca:0,anos:0,dinastia:false,proclamado:false}; return m.imperio; }
const impNv=id=>((S.me.imperio&&S.me.imperio.p)||{})[id]||0;
function impDominados(){ const I=S.me.imperio; return I?Object.values(I.p).filter(v=>v>=3).length:0; }
function impNuclear(){ const r=regime(); return paisNuclear(S.me.country)||!!(r&&r.nuclear); }
function impPoder(){ const m=S.me, r=regime(), I=S.me.imperio||{p:{}}; let p=forcaDe(m.country)+(impNuclear()?20:0)+(r?Math.round((r.leal-50)/3):0);
  for(const [id,v] of Object.entries(I.p)) p+=Math.round(forcaDe(id)*v/8); return p; }
function impAmeaca(){ const I=S.me.imperio; if(!I) return 0; return Math.min(100,Math.round(Object.values(I.p).reduce((a,v)=>a+v*v,0)*1.5+(I.extra||0))); }
function impTitulo(){ const m=S.me, F=m.gender==='F', n=impDominados()+1, cargo=chefeEstado(); if(m.c.reiMundo) return F?'Rainha do Mundo':'Rei do Mundo';
  const I=m.imperio; if(I&&I.proclamado) return F?'Imperatriz':'Imperador'; if(n>=7) return 'Superpotência'; if(n>=4) return 'Hegemonia continental'; if(n>=2) return 'Potência regional';
  return cargo==='rei'?(F?'Rainha':'Rei'):cargo==='reg'?tituloDitador():F?'Presidenta':'Presidente'; }
function impChance(id,k){ const pd=impPoder(), f=forcaDe(id), rel=relPais(S.me.country,id), dit=chefeEstado()==='reg'; let p;
  if(k==='influencia') p=.4+rel/200+(pd-f)/250;
  else if(k==='fantoche') p=.28+(pd-f)/160+(dit?.08:0)-(paisNuclear(id)?.15:0);
  else if(k==='invadir') p=.42+(pd-f)/120-(paisNuclear(id)&&!impNuclear()?.3:0);
  else if(k==='anexar') p=.5+(pd-f)/200;
  else p=1; return Math.max(.05,Math.min(.9,p)); }
function impAcao(id,k){ const m=S.me, cargo=chefeEstado(); if(!cargo) return 'Só um chefe de Estado pode fazer isso.'; const c=COUNTRIES.find(x=>x.id===id); if(!c||id===m.country) return '';
  const I=imp(), nv=impNv(id), o=m.office, r=regime(); if(use('imp_'+id)>1) return `Já tratei de ${c.n} este ano.`;
  const aprov=v=>{ if(o) o.appr=clamp(o.appr+v); if(cargo==='rei'&&m.royal) m.royal.pop=clamp(m.royal.pop+v); };
  if(k==='influencia'){ if(nv>=2) return `${c.n} já está na minha esfera.`; if(R.chance(impChance(id,k))){ I.p[id]=nv+1; relMudar(m.country,id,8); return nv===0?`Acordos comerciais, bolsas de estudo e um empréstimo generoso. ${c.n} agora depende de nós.`:`${c.n} assinou um tratado militar em que as nossas bases ficam no território deles.`; }
    relMudar(m.country,id,-5); return `${c.n} recusou a proposta e pediu explicações à nossa embaixada.`; }
  if(k==='fantoche'){ if(nv<1) return `Preciso ter influência ${doPais(c.n)} antes de trocar o governo deles.`; if(nv>=3) return `${c.n} já obedece a mim.`;
    if(R.chance(impChance(id,k))){ I.p[id]=3; relMudar(m.country,id,20); I.extra=(I.extra||0)+3; log(`🎭 ${c.n} agora tem um governo fantoche meu.`,'big'); return `Financiei a oposição, comprei generais e um "escândalo" derrubou o presidente ${doPais(c.n)}. O novo governo me liga todo dia pedindo instruções.`; }
    relMudar(m.country,id,-40); I.p[id]=Math.max(0,nv-1); I.extra=(I.extra||0)+5; aprov(-10); if(r){ r.pres+=10; regFix(r); }
    return `A operação vazou. ${c.n} expulsou o nosso embaixador e o mundo inteiro está falando disso.`; }
  if(k==='anexar'){ if(nv!==3) return 'Só dá para anexar um país que já tem governo fantoche.'; if(R.chance(impChance(id,k))){ I.p[id]=4; I.extra=(I.extra||0)+4; aprov(4); log(`🗺️ Anexei ${c.n} por plebiscito.`,'big'); return `Plebiscito com ${R.int(71,98)}% de "sim". ${c.n} agora é parte do meu país.`; }
    I.p[id]=2; aprov(-6); return `O povo ${doPais(c.n)} votou "não" e derrubou o governo fantoche.`; }
  if(k==='invadir'){ if(nv>=4) return `${c.n} já é meu.`; if(guerraAtual()) return 'Já existe uma guerra em curso. Uma de cada vez.'; if(use('imp_inv')>1) return 'O exército ainda se recupera da última campanha.';
    if(cargo==='pres'&&!R.chance(clamp(o.appr)/100+.15)){ aprov(-5); return 'O Congresso negou a autorização para a invasão. A oposição já fala em impeachment.'; }
    if(R.chance(impChance(id,k))){ I.p[id]=4; I.extra=(I.extra||0)+10; relMudar(m.country,id,-60); aprov(cargo==='pres'?-4:6); m.fame=clamp(m.fame+10); if(r){ r.pres+=20; r.anexou=(r.anexou||0)+1; regFix(r); }
      log(`🪖 Invadi e conquistei ${c.n}.`,'big'); if(typeof noticia==='function') noticia(`${nomePais(m.country)} invade ${c.n}`,`Em ${R.int(9,60)} dias, as tropas de ${fullName(m)} tomaram a capital.`,'mundo','impinv:'+id+S.year,id,95);
      impChecarMundo(); return `Os tanques entraram de madrugada. Em ${R.int(9,60)} dias, ${c.n} se rendeu.`; }
    guerraIniciar(m.country,id,'invasao'); aprov(-12); return `A invasão travou na fronteira. Agora é guerra aberta com ${c.n}.`; }
  if(k==='libertar'){ if(!nv) return ''; I.p[id]=0; I.extra=Math.max(0,(I.extra||0)-8); relMudar(m.country,id,25); m.karma=clamp(m.karma+8); aprov(2); return `Devolvi a soberania ${doPais(c.n)}. A coalizão contra mim perdeu um argumento.`; }
  return ''; }
function impChecarMundo(){ const m=S.me, I=m.imperio; if(I&&impDominados()>=COUNTRIES.length-1&&!m.c.reiMundo&&!I.coroaFila){ I.coroaFila=1; queue('imp_coroacao',{}); } }
function impProclamar(){ const I=imp(); if(I.proclamado) return 'O império já foi proclamado.'; if(impDominados()<4) return 'Preciso dominar pelo menos 4 países para proclamar um império.'; queue('imp_proclamar',{}); return ''; }
EVENTS.imp_proclamar={prep:()=>chefeEstado()&&impDominados()>=4?{}:null,
  show:()=>({k:'Império',t:'🏛️ Proclamar o império',x:`${impDominados()} países já obedecem a mim. Está na hora de dar um nome a isso. Que tipo de império vai ser?`,
    ch:[['👑 Império hereditário: meus filhos herdam tudo','dinastia'],['🌐 Federação: um governo comum, eleito','federacao'],['Ainda não','nao']]}),
  pick:k=>{ const m=S.me, I=imp(); if(k==='nao') return 'Guardei a coroa na gaveta.'; I.proclamado=true; const nome=`Império ${R.pick(['Unido','Grande','Supremo','das Nações'])} ${doPais(nomePais(m.country))}`.replace(/  +/g,' ');
    if(k==='dinastia'){ I.dinastia=true; I.nome=nome; if(m.office&&!m.office.dit){ m.office.dit=1; const r=regime(); r.n=nome; r.tipo='monarquia'; r.dinastia=m.last; } else { const r=regime(); if(r){ r.tipo='monarquia'; r.dinastia=r.dinastia||m.last; } }
      log(`👑 Proclamei o ${nome}. A coroa passa de pai para filho.`,'big'); return `Coroação na catedral, com chefes de Estado de joelhos. O ${nome} é hereditário: quando eu morrer, um filho meu assume.`; }
    I.federacao=true; I.nome='Federação Mundial'; I.extra=Math.max(0,(I.extra||0)-15); m.karma=clamp(m.karma+5); log('🌐 Proclamei uma federação de nações.','big'); return 'Um parlamento comum, uma moeda comum e eu na presidência. Menos revoltas, nenhuma coroa.'; }};
EVENTS.imp_revolta={prep:()=>{ const I=S.me.imperio; if(!chefeEstado()||!I) return null; const e=Object.entries(I.p).find(([id,v])=>v>=3); return e?{p:e[0]}:null; },
  show:d=>{ const c=countryOf(d.p); return {k:'Império',t:`🔥 Revolta ${doPais(c.n)}`,x:`O povo ${doPais(c.n)} tomou as ruas contra o meu domínio. Queimaram a minha foto na praça principal e cercaram o palácio do governador.`,
    ch:[['Mandar o exército reprimir','reprimir'],['Conceder autonomia','autonomia'],[`Comprar os líderes da revolta (${fmt(2000000)})`,'comprar'],['Deixar o país ir','soltar']]}; },
  pick:(k,d)=>{ const m=S.me, I=imp(), r=regime(), c=countryOf(d.p), nv=impNv(d.p); if(!nv) return 'A revolta perdeu o motivo.';
    if(k==='reprimir'){ m.karma=clamp(m.karma-12); if(R.chance(.55+(r?r.medo/400:0))){ if(r){ r.medo+=6; regFix(r); } return `Tanques nas ruas ${doPais(c.n)}. A revolta acabou em três dias. O silêncio, não.`; } I.p[d.p]=Math.max(0,nv-2); I.extra=(I.extra||0)+5; return `Os soldados se recusaram a atirar. ${c.n} escapou do meu controle.`; }
    if(k==='autonomia'){ I.p[d.p]=nv-1; I.extra=Math.max(0,(I.extra||0)-3); return `${c.n} ganhou parlamento próprio. Continua na minha órbita, mas com mais voz.`; }
    if(k==='comprar'){ if(m.money<2000000){ I.p[d.p]=Math.max(0,nv-1); return 'Não tinha dinheiro para comprar ninguém. A revolta cresceu.'; } m.money-=2000000; if(R.chance(.65)) return 'Os líderes da revolta viraram ministros. O povo se sentiu traído e voltou para casa.'; I.p[d.p]=Math.max(0,nv-1); return 'Pegaram o dinheiro e continuaram a revolta.'; }
    I.p[d.p]=0; m.karma=clamp(m.karma+5); return `${c.n} declarou independência. Não mandei ninguém impedir.`; }};
// coalizão: sanções, ultimato e guerra
const impCoalizao=()=>{ const m=S.me, I=S.me.imperio||{p:{}}; return COUNTRIES.filter(c=>c.id!==m.country&&(I.p[c.id]||0)<2).sort((a,b)=>forcaDe(b.id)-forcaDe(a.id)).map(c=>c.id); };
EVENTS.imp_sancoes={prep:()=>{ if(!chefeEstado()) return null; const co=impCoalizao(); return co.length?{l:co[0],n:co.length}:null; },
  show:d=>({k:'Mundo',t:'🚫 Sanções contra o meu país',x:`${nomePais(d.l)} e mais ${Math.max(0,(d.n||1)-1)} países anunciaram sanções contra ${nomePais(S.me.country)}: bloqueio de bancos, comércio e viagens. "O expansionismo de ${S.me.first} precisa parar."`,
    ch:[['Aceitar e apertar os cintos','aceitar'],['Furar o bloqueio pelo contrabando','contrabando'],['Retaliar com tarifas e cortar o gás','retaliar'],['Devolver um país para acalmar todo mundo','ceder']]}),
  pick:(k,d)=>{ const m=S.me, I=imp(), o=m.office, w=mundo(m.country);
    if(k==='aceitar'){ w.crescimento=(w.crescimento||0)-.02; if(o) o.appr=clamp(o.appr-6); return 'Prateleiras vazias, dólar nas alturas. O povo culpa o estrangeiro, por enquanto.'; }
    if(k==='contrabando'){ m.karma=clamp(m.karma-5); if(R.chance(.6)){ w.crescimento=(w.crescimento||0)-.005; return 'Navios com bandeira falsa e empresas de fachada. As sanções viraram peneira.'; } w.crescimento=(w.crescimento||0)-.03; I.extra=(I.extra||0)+5; return 'O esquema foi descoberto, e as sanções dobraram.'; }
    if(k==='retaliar'){ for(const id of impCoalizao().slice(0,5)) relMudar(m.country,id,-15); if(o) o.appr=clamp(o.appr+5); I.extra=(I.extra||0)+6; if(R.chance(.35)) queue('imp_ultimato',{l:d.l}); return 'Cortei o gás e taxei tudo que vem de lá. O inverno deles vai ser longo.'; }
    const alvo=Object.entries(I.p).filter(([id,v])=>v>=1).sort((a,b)=>forcaDe(a[0])-forcaDe(b[0]))[0]; if(!alvo) return 'Não tinha nada para devolver.'; I.p[alvo[0]]=0; I.extra=Math.max(0,(I.extra||0)-10);
    return `Devolvi a soberania ${doPais(nomePais(alvo[0]))}. As sanções foram suspensas.`; }};
EVENTS.imp_ultimato={prep:()=>{ if(!chefeEstado()) return null; const co=impCoalizao(), I=S.me.imperio; const alvo=I&&Object.entries(I.p).filter(([id,v])=>v>=3).map(([id])=>id)[0]; return co.length&&alvo?{l:co[0],alvo}:null; },
  show:d=>({k:'Guerra',t:'📜 Ultimato da coalizão',x:`${nomePais(d.l||'US')} reuniu uma coalizão: "Devolvam ${nomePais(d.alvo||'PT')} em trinta dias ou é guerra."`,
    ch:[['Devolver o país','ceder'],['Ignorar o ultimato','desafiar'],['Rachar a coalizão com acordos secretos','rachar']].concat(impNuclear()?[['☢️ Ameaçar com armas nucleares','nuclear']]:[])}),
  pick:(k,d)=>{ const m=S.me, I=imp(); if(!d.alvo||!impNv(d.alvo)) return 'O ultimato perdeu o motivo.';
    if(k==='ceder'){ I.p[d.alvo]=0; I.extra=Math.max(0,(I.extra||0)-12); if(m.office) m.office.appr=clamp(m.office.appr-8); return `Devolvi ${nomePais(d.alvo)}. A coalizão comemorou como se tivesse vencido uma guerra.`; }
    if(k==='rachar'){ if(R.chance(.45)){ relMudar(m.country,d.l,10); I.extra=Math.max(0,(I.extra||0)-6); return 'Prometi petróleo para uns e contratos para outros. A coalizão se desfez em uma semana.'; } impGuerraCoalizao(d.l); return 'Ninguém aceitou. Os tanques da coalizão cruzaram a fronteira.'; }
    if(k==='nuclear'){ m.karma=clamp(m.karma-15); if(R.chance(.5)){ I.extra=(I.extra||0)+10; return 'Mostrei os mísseis na TV. A coalizão recuou, mas o mundo nunca mais vai dormir tranquilo.'; } impGuerraCoalizao(d.l); return 'Eles não acreditaram no blefe. É guerra.'; }
    if(m.office) m.office.appr=clamp(m.office.appr+4); impGuerraCoalizao(d.l); return 'Rasguei o ultimato em rede nacional. Trinta dias depois, a coalizão atacou.'; }};
function impGuerraCoalizao(lid){ const m=S.me, I=imp(); if(guerraAtual()) return null; const G=guerraIniciar(lid,m.country,'coalizao'); if(!G) return null;
  const meus=Object.entries(I.p).filter(([id,v])=>v>=2).map(([id])=>id);
  G.a=G.a.filter(id=>!meus.includes(id)); for(const id of meus) if(!G.b.includes(id)) G.b.push(id);
  for(const id of impCoalizao().slice(0,6)) if(!G.a.includes(id)&&!G.b.includes(id)) G.a.push(id);
  G.mundial=G.a.length+G.b.length>=6||G.mundial; log(`⚔️ Guerra de coalizão: ${G.a.map(nomePais).join(', ')} contra o meu império.`,'bad'); return G; }
// o fim da guerra mexe no império e nos países da fé
guerraFim=(o=>function(venc){ const G=S.guerra, m=S.me; const res=o.apply(this,arguments); if(!G||!m) return res; const meu=ladoDe(G,m.country);
  if(G.origem==='coalizao'&&m.imperio){ const I=m.imperio;
    if(meu&&meu!==venc){ for(const id of Object.keys(I.p)) if(I.p[id]>=2&&R.chance(.7)) I.p[id]=Math.max(0,I.p[id]-3); I.extra=Math.round((I.extra||0)/2); log('A coalizão venceu e desmontou boa parte do meu império.','bad'); }
    else if(meu===venc){ const l=G.lider.a; if(l&&l!==m.country) I.p[l]=Math.max(I.p[l]||0,2); m.fame=clamp(m.fame+10); log(`Venci a coalizão. ${nomePais(l)} virou meu aliado subordinado.`,'good'); impChecarMundo(); } }
  if(G.origem==='invasao'&&m.imperio&&meu){ const alvo=G.lider.b; if(meu===venc&&alvo){ m.imperio.p[alvo]=4; log(`${nomePais(alvo)} se rendeu, e anexei o país.`,'good'); impChecarMundo(); } }
  const s=m.seita; if(G.origem==='cruzada'&&s&&!s.membro&&s.mundo){ const alvo=G.lider.b, v=s.mundo[alvo]; if(v){ if(venc==='a'){ v.nv=Math.min(v.nv,2); v.f=Math.round(v.f*.5); log(`A cruzada derrubou o governo da fé ${doPais(nomePais(alvo))}.`,'bad'); } else { s.fama+=10; seitaFix(s); log('A cruzada contra a fé fracassou.','good'); } } }
  return res; })(guerraFim);
EVENTS.imp_coroacao={prep:()=>chefeEstado()?{}:null,
  show:()=>({k:'Império',t:'🌍 O mundo é meu',x:`Não existe mais nenhum país livre do meu domínio. Os antigos presidentes esperam do lado de fora da sala do trono. Como quero ser lembrad${oa()}?`,
    ch:[['👑 Coroar-me Rei do Mundo','rei'],['🌐 Presidente do Governo Mundial, eleito','presidente'],['🕊️ Devolver a liberdade às nações','devolver']]}),
  pick:k=>{ const m=S.me, I=imp(); I.coroaFila=0;
    if(k==='devolver'){ for(const id of Object.keys(I.p)) I.p[id]=Math.min(I.p[id],1); I.extra=0; m.karma=clamp(m.karma+40); m.fame=100; log('🕊️ Tive o mundo nas mãos e devolvi.','big'); return 'Assinei a independência de cada nação, uma por uma. Os livros de história nunca vão saber o que fazer comigo.'; }
    m.c.reiMundo=1; m.fame=100; I.extra=0;
    if(k==='rei'){ I.dinastia=true; I.proclamado=true; I.nome=I.nome||'Império do Mundo'; if(m.office&&!m.office.dit){ m.office.dit=1; } const r=regime(); if(r){ r.tipo='monarquia'; r.dinastia=r.dinastia||m.last; r.n=I.nome; }
      log(`👑 Fui coroad${oa()} ${m.gender==='F'?'Rainha':'Rei'} do Mundo.`,'big'); return 'A coroa tem uma pedra de cada país do planeta. Bilhões de pessoas assistiram ao vivo. Agora o mundo inteiro tem um só soberano, e a coroa é hereditária.'; }
    I.federacao=true; I.nome='Governo Mundial'; log('🌐 Assumi a presidência do Governo Mundial.','big'); return 'Primeira eleição do planeta: venci em todos os continentes. Um só governo, uma só moeda, e eu na cadeira.'; }};
const IMP_MUNDO=[['Separatistas querem tirar um continente inteiro do meu governo.','Mandar o exército mundial','Negociar autonomia'],['A minha própria corte está conspirando para me envenenar.','Expurgar a corte','Fingir que não sei e vigiar'],
  ['Uma pandemia se espalha pelos cinco continentes.','Fechar o planeta inteiro','Deixar a economia girar'],['Um movimento de resistência explode estátuas minhas em várias capitais.','Caçar a resistência','Derrubar eu mesm{o} as estátuas'],
  ['O tesouro mundial está vazio depois de tanta guerra.','Imposto planetário','Vender bens do império']];
EVENTS.imp_mundo_ano={prep:()=>S.me.c.reiMundo&&chefeEstado()?{i:R.int(0,IMP_MUNDO.length-1)}:null,
  show:d=>{ const e=IMP_MUNDO[(d.i||0)%IMP_MUNDO.length]; return {k:'Governo do mundo',t:'🌍 Crise no planeta',x:e[0],ch:[[e[1].replace('{o}',oa()),'duro'],[e[2].replace('{o}',oa()),'mole']]}; },
  pick:(k,d)=>{ const m=S.me, I=imp(), i=(d.i||0)%IMP_MUNDO.length, ids=Object.keys(I.p).filter(id=>I.p[id]>=3), alvo=ids.length?R.pick(ids):null;
    if(k==='duro'){ m.karma=clamp(m.karma-8); if(i===1&&R.chance(.1)){ die('envenenad'+oa()+' pela própria corte'); return 'O expurgo chegou tarde. O vinho já estava envenenado.'; } if(R.chance(.7)) return 'Funcionou. O mundo voltou a obedecer.'; if(alvo){ I.p[alvo]=2; return `Saiu pela culatra: ${nomePais(alvo)} rompeu com o governo mundial.`; } return 'Saiu pela culatra, mas aguentei.'; }
    m.karma=clamp(m.karma+4); if(i===2){ m.health=clamp(m.health-R.int(0,15)); } if(alvo&&R.chance(.35)){ I.p[alvo]=Math.max(2,I.p[alvo]-1); return `Cedi um pouco. ${nomePais(alvo)} ganhou mais autonomia.`; } return 'Cedi um pouco, e o mundo agradeceu.'; }};

// ---------- o ano ----------
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m.alive||m.prison) return; const s=m.seita;
  if(s&&!s.membro){ s3(s); const M=smFix(s), dom=smDominados(s);
    for(const [id,v] of Object.entries(M)){ if(!v.nv) continue; const ban=(v.ban||0)>S.year; const g=Math.round(v.f*(ban?-.08:.1+s.devo/600+(s3Tem(s,'digital')?.04:0))*feDe(id)/60)+(ban?0:R.int(5,40));
      v.f=Math.max(0,v.f+g); if(v.nv<4) v.nv=v.f>0?Math.max(1,smNivelF(v.f)):0; s.caixa+=Math.round(v.f*R.int(2,6)*(v.nv>=4?3:1)); }
    if(s.fieis>=30){ const hc=.06+Math.min(.12,s.fieis/40000)+(s.hereges||0)*.03; if(R.chance(hc)) queue('seita_heresia',EVENTS.seita_heresia.prep());
      const tc=.04+Math.min(.1,s.fieis/60000)+(s.traicao||0)*.03-(s.suc==='conselho'?.02:0)+(s.devo<40?.05:0); if(R.chance(tc)) queue('seita_traidor',EVENTS.seita_traidor.prep()); }
    if(s.rival&&s.rival.forca>=25&&!(s.rival.paz&&S.year-s.rival.paz<5)&&R.chance(.22)) queue('seita_guerra_santa',{});
    s.ameaca=Math.max(0,Math.round((s.ameaca||0)*.9));
    if(dom>=2&&R.chance(Math.min(.45,.08+dom*.04+(s.ameaca||0)/300))){ const o=R.pick(['smundo_sancao','smundo_banimento','smundo_cruzada']); const d=EVENTS[o].prep(); if(d) queue(o,d); }
    smChecarMundo(s); seitaFix(s); }
  const I=m.imperio; if(!I||!Object.keys(I.p).length) return;
  if(!chefeEstado()){ let perdeu=0; for(const id of Object.keys(I.p)) if(I.p[id]>0&&R.chance(.5)){ I.p[id]--; perdeu++; } if(perdeu) log('Fora do poder, vejo o meu antigo império se desfazer.','warn'); return; }
  I.anos++; I.extra=Math.max(0,Math.round((I.extra||0)*.85)); const dom=impDominados();
  if(dom) m.money+=dom*R.int(60000,180000);
  const r=regime(); for(const [id,v] of Object.entries(I.p)) if(v>=3&&R.chance((v===4?.1:.07)*(I.federacao?.5:1)-(r?r.medo/1500:0))){ queue('imp_revolta',{p:id}); break; }
  const am=impAmeaca(); if(am>=25&&R.chance(Math.min(.5,(am-15)/120))){ const d=am>=60&&R.chance(.5)?EVENTS.imp_ultimato.prep():EVENTS.imp_sancoes.prep(); if(d) queue(d.alvo?'imp_ultimato':'imp_sancoes',d); }
  if(m.c.reiMundo&&R.chance(.35)) queue('imp_mundo_ano',{i:R.int(0,IMP_MUNDO.length-1)});
  impChecarMundo(); });

// ---------- telas ----------
let SM_SEL=null, IMP_SEL=null;
V.seitaMundo=()=>{ const s=sLiderD(); if(!s) return {title:'Fé no mundo',items:[]}; const M=smFix(s), dom=smDominados(s);
  const it=[{html:`<div class="card"><p><b>🌍 ${esc(smTitulo(s))}</b></p>${kv('Fiéis no mundo',smFieisMundo(s).toLocaleString('pt-BR'))}${kv('Países dominados',`${dom} de ${COUNTRIES.length}`)}${kv('Meu país',smCasa(s)?'Dominado':`Falta dominar o país (${(s.dom||[]).length} de 4 etapas)`)}${bar('Reação do mundo',clamp(s.ameaca||0))}<p style="color:var(--muted);font-size:13px">Abra missões, junte fiéis em cada país e tome o governo. Quanto mais países, mais os outros se unem contra a fé: sanções, banimentos e cruzadas.</p></div>`},{sec:'Países'}];
  if(!smPodeExpandir(s)) it.push({ic:'🔒',l:'Ainda não',s:'A expansão mundial abre no estágio Movimento (2.000 fiéis).',dis:true,why:'Faltam fiéis.'});
  for(const c of COUNTRIES.filter(x=>x.id!==S.me.country).sort((a,b)=>((M[b.id]||{}).f||0)-((M[a.id]||{}).f||0))){ const v=M[c.id]||{nv:0,f:0}, N=SM_NIVEIS[v.nv||0];
    it.push({ic:N[1],l:c.n,s:`${N[0]}${v.f?` · ${v.f.toLocaleString('pt-BR')} fiéis`:''}${(v.ban||0)>S.year?' · banido':''}`,tone:v.nv>=4?'good':(v.ban||0)>S.year?'bad':'',on:()=>{ SM_SEL=c.id; UI.push(V.smPais); }}); }
  return {title:'Fé no mundo',items:it}; };
V.smPais=()=>{ const s=sLiderD(), id=SM_SEL, c=id&&countryOf(id); if(!s||!c) return {title:'País',items:[]}; const v=smFix(s)[id]||{nv:0,f:0}, A=(k,ic,l,sub,dis)=>({ic,l,s:sub,dis:!!dis,why:dis||'',on:()=>act(()=>smAcao(id,k),l)});
  const it=[{html:`<div class="card"><p><b>${SM_NIVEIS[v.nv||0][1]} ${esc(c.n)}</b></p>${kv('Presença',SM_NIVEIS[v.nv||0][0])}${kv('Fiéis lá',(v.f||0).toLocaleString('pt-BR'))}${kv('Abertura à fé',feDe(id)+'%')}${kv('Força militar',forcaDe(id))}${(v.ban||0)>S.year?kv('Banimento até',v.ban):''}</div>`}];
  if(!v.nv) it.push(A('missao','🕯️','Abrir uma missão',`${fmt(SM_MISSAO)} · minigame da abordagem`,!smPodeExpandir(s)&&'Precisa do estágio Movimento.'));
  else { it.push(A('reforcar','✈️','Mandar mais missionários',`${fmt(40000*v.nv)} · mais fiéis`)); if(!v.cat) it.push(A('catedral','⛪','Construir uma catedral nacional',`${fmt(500000)} · +25% de fiéis`));
    if(v.nv<4) it.push(A('dominar','👑','Tomar o governo do país','Eleição, golpe, revolução ou acordo',v.nv<3&&'Precisa de 6.000 fiéis lá (igreja nacional).')); }
  return {title:c.n,items:it}; };
V.seita=(o=>function(){ const r=o.apply(this,arguments), s=sLiderD(); if(!s||!r||!r.items) return r;
  const add=[{sec:'Poder e sucessão'}];
  add.push({ic:'🌍',l:'Fé no mundo',s:`${smTitulo(s)} · ${smDominados(s)} de ${COUNTRIES.length} países`,on:()=>UI.push(V.seitaMundo)});
  if(!s.suc) add.push({ic:'⚖️',l:'Definir a regra de sucessão',s:'Hereditária, escolhida por mim ou por um conselho',on:()=>act(()=>{ queue('seita_regra',{}); return ''; },'Religião')});
  else add.push({ic:SEITA_SUC[s.suc][0],l:`Sucessão: ${SEITA_SUC[s.suc][1]}`,s:s.suc==='escolha'?(s.herdeiro&&P(s.herdeiro)?`Herdeiro: ${P(s.herdeiro).first} · tocar para trocar`:'Ninguém escolhido · tocar para escolher'):SEITA_SUC[s.suc][2],on:()=>{ if(s.suc==='escolha') seitaEscolherHerdeiro(); }});
  if(s.rival&&s.rival.forca>0) add.push({ic:'⚔️',l:`Guerra santa contra ${s.rival.n}`,s:`Força deles: ${s.rival.forca}`,on:()=>act(()=>{ if(use('s14_guerra')>1) return 'Uma ofensiva por ano. Os fiéis precisam respirar.'; queue('seita_guerra_santa',{}); return ''; },'Guerra santa')});
  const i=r.items.findIndex(x=>x&&x.l==='Dissolver o grupo'); r.items.splice(i>=0?i:r.items.length,0,...add); return r; })(V.seita);
V.imperio=()=>{ const m=S.me, cargo=chefeEstado(); if(!cargo) return {title:'Domínio mundial',items:[{html:'<div class="card"><p>Só um chefe de Estado pode estender o domínio a outros países.</p></div>'}]}; const I=imp(), dom=impDominados(), am=impAmeaca();
  const it=[{html:`<div class="card"><p><b>🌍 ${esc(impTitulo())}${I.nome?' · '+esc(I.nome):''}</b></p>${kv('Poder militar',impPoder())}${kv('Países dominados',`${dom} de ${COUNTRIES.length-1}`)}${kv('Programa nuclear',impNuclear()?'☢️ Tenho':'Não tenho')}${kv('Sucessão',I.dinastia?'Hereditária':'Sem dinastia')}${bar('Medo do mundo',am)}<p style="color:var(--muted);font-size:13px">Influência, governo fantoche, anexação ou invasão. Com mais poder, os outros países se unem contra mim: sanções, ultimato e guerra de coalizão.</p></div>`}];
  if(!I.proclamado) it.push({ic:'🏛️',l:'Proclamar o império',s:dom>=4?'Hereditário ou federação':`Precisa dominar 4 países (tenho ${dom})`,dis:dom<4,why:'Ainda não tenho países suficientes.',on:()=>act(impProclamar,'Império')});
  if(I.dinastia&&regime()&&typeof escolherHerdeiro==='function') it.push({ic:'👑',l:'Escolher o herdeiro',s:'Quem fica com o trono',on:escolherHerdeiro});
  it.push({sec:'Países'});
  for(const c of COUNTRIES.filter(x=>x.id!==m.country).sort((a,b)=>impNv(b.id)-impNv(a.id)||forcaDe(a.id)-forcaDe(b.id))){ const nv=impNv(c.id), N=IMP_NIVEIS[nv];
    it.push({ic:N[1],l:c.n,s:`${N[0]} · força ${forcaDe(c.id)}${paisNuclear(c.id)?' · nuclear':''} · relação ${Math.round(relPais(m.country,c.id))}`,tone:nv>=3?'good':'',on:()=>{ IMP_SEL=c.id; UI.push(V.impPais); }}); }
  return {title:'Domínio mundial',items:it}; };
V.impPais=()=>{ const id=IMP_SEL, c=id&&countryOf(id), m=S.me; if(!c||!chefeEstado()) return {title:'País',items:[]}; const nv=impNv(id), pc=k=>Math.round(impChance(id,k)*100)+'%';
  const A=(k,ic,l,sub,crit)=>({ic,l,s:sub,tone:crit?'bad':'',on:crit?()=>confirmBox(l+'?',crit,'Confirmar',()=>act(()=>impAcao(id,k),'Império')):()=>act(()=>impAcao(id,k),'Império')});
  const it=[{html:`<div class="card"><p><b>${IMP_NIVEIS[nv][1]} ${esc(c.n)}</b></p>${kv('Situação',IMP_NIVEIS[nv][0])}${kv('Força militar deles',forcaDe(id))}${kv('Minha força',impPoder())}${kv('Relação',Math.round(relPais(m.country,id)))}${paisNuclear(id)?kv('Potência nuclear','☢️ Sim'):''}</div>`}];
  if(nv<2) it.push(A('influencia','🤝',nv?'Tratado militar e bases':'Acordos e ajuda econômica',`Chance ${pc('influencia')}`));
  if(nv>=1&&nv<3) it.push(A('fantoche','🎭','Trocar o governo deles por um fantoche',`Chance ${pc('fantoche')} · se vazar, escândalo mundial`,'Se a operação vazar, o mundo inteiro fica contra mim.'));
  if(nv===3) it.push(A('anexar','🗳️','Anexar por plebiscito',`Chance ${pc('anexar')}`));
  if(nv<4) it.push(A('invadir','🪖','Invadir',`Chance ${pc('invadir')}${chefeEstado()==='pres'?' · o Congresso precisa autorizar':''} · se travar, vira guerra`,`Chance de vitória rápida: ${pc('invadir')}. Se travar, começa uma guerra de verdade.`));
  if(nv) it.push(A('libertar','🕊️','Devolver a soberania','Menos medo no mundo · carma'));
  return {title:c.n,items:it}; };
V.career=(o=>function(){ const res=o.apply(this,arguments), m=S.me; if(!res||!res.items||!chefeEstado()) return res;
  const i=res.items.findIndex(x=>x&&(x.sec==='Mandato'||x.sec==='Realeza')); const item={ic:'🌍',l:'Domínio mundial',s:`${impTitulo()} · ${impDominados()} país(es) dominados`,on:()=>UI.push(V.imperio)};
  res.items.splice(i>=0?i+2:res.items.length,0,item); return res; })(V.career);
if(typeof CONQ!=='undefined') CONQ.push({id:'fe_mundial',ic:'🛐',n:'Uma só fé',d:'Levar a sua seita a dominar todos os países.',ok:m=>!!m.c.feMundial},{id:'rei_mundo',ic:'🌍',n:'Rei do mundo',d:'Governar o planeta inteiro.',ok:m=>!!m.c.reiMundo});

// ---------- ataque nuclear: escolher o país e lidar com a resposta ----------
const nkProtetor=id=>COUNTRIES.map(c=>c.id).find(q=>q!==id&&q!==S.me.country&&paisNuclear(q)&&(aliados(q,id)||relPais(q,id)>=70));
function nkChanceResposta(id){ if(paisNuclear(id)) return .8; return nkProtetor(id)?.35:0; }
const nkAprov=v=>{ const m=S.me; if(m.office) m.office.appr=clamp(m.office.appr+v); if(m.royal&&m.royal.reign) m.royal.pop=clamp(m.royal.pop+v); };
function impNuclearUsar(id){ const m=S.me, c=COUNTRIES.find(x=>x.id===id); if(!chefeEstado()||!impNuclear()) return 'Não tenho armas nucleares.'; if(!c||id===m.country) return '';
  if(use('imp_nuke')>1) return 'Já tomei essa decisão este ano.';
  const I=imp(), G=guerraAtual(), meuL=G&&ladoDe(G,m.country), alvoL=G&&ladoDe(G,id);
  m.c.usouBomba=1; m.karma=clamp(m.karma-60); m.fame=100; I.extra=(I.extra||0)+50;
  for(const x of COUNTRIES) if(x.id!==m.country) relMudar(m.country,x.id,x.id===id?-100:-40);
  const w=mundo(id); w.crescimento=(w.crescimento||0)-.1; w.estabilidade=Math.max(0,(w.estabilidade||.7)-.3);
  log(`☢️ Usei uma arma nuclear contra ${c.n}.`,'big'); if(typeof noticia==='function') noticia(`${nomePais(m.country)} usa arma nuclear contra ${c.n}`,'O mundo inteiro condenou o ataque.','mundo','nuke:'+id+S.year,id,99);
  let t;
  if(meuL&&alvoL&&meuL!==alvoL){ guerraFim(meuL); t=`${c.n} se rendeu. A guerra acabou, e o mundo nunca mais vai me olhar do mesmo jeito.`; }
  else { I.p[id]=Math.max(I.p[id]||0,3); t=`${c.n} se rendeu e aceitou um governo indicado por mim. O mundo inteiro condenou o ataque.`; }
  const de=paisNuclear(id)?id:nkProtetor(id);
  if(de&&R.chance(nkChanceResposta(id))) queue('nk_resposta',{de});
  else if(EVENTS.imp_sancoes){ const d=EVENTS.imp_sancoes.prep(); if(d) queue('imp_sancoes',d); }
  return t; }
EVENTS.nk_resposta={prep:()=>chefeEstado()?{de:'US'}:null,
  show:d=>({k:'Guerra',t:'☢️ A resposta',x:`${nomePais(d.de||'US')} respondeu com armas nucleares contra ${nomePais(S.me.country)}. Os generais esperam a minha ordem.`,
    ch:[['Responder com tudo o que temos','tudo'],['Pedir cessar-fogo imediato','cessar'],['Ir para o bunker e esperar','bunker']]}),
  pick:(k,d)=>{ const m=S.me, w=mundo(m.country), I=imp(), de=d.de||'US'; w.crescimento=(w.crescimento||0)-.12; w.estabilidade=Math.max(0,(w.estabilidade||.7)-.3); nkAprov(-20);
    if(k==='tudo'){ if(R.chance(.5)){ die(`na guerra nuclear contra ${nomePais(de)}`); return 'A troca não parou mais. Não sobrou governo para contar a história.'; }
      I.p[de]=Math.max(I.p[de]||0,1); m.health=clamp(m.health-R.int(10,30)); return `${nomePais(de)} pediu trégua primeiro. Os dois países saíram em ruínas.`; }
    if(k==='cessar'){ if(R.chance(.65)){ for(const id of Object.keys(I.p)) I.p[id]=Math.min(I.p[id],2); return 'O cessar-fogo foi aceito, com uma condição: abrir mão de todos os países que eu controlava.'; }
      m.health=clamp(m.health-R.int(10,30)); return 'Ninguém atendeu o telefone. Os ataques continuaram por mais dois dias.'; }
    if(R.chance(.8)){ m.health=clamp(m.health-R.int(5,20)); return 'Passei semanas no bunker. Quando saí, o país era outro.'; }
    die(`na guerra nuclear contra ${nomePais(de)}`); return 'O bunker não aguentou.'; }};
V.nkAlvos=()=>{ const m=S.me; if(!chefeEstado()||!impNuclear()) return {title:'Ataque nuclear',items:[]};
  const it=[{html:'<div class="card"><p>Escolha o país. Se ele tiver armas nucleares, ou um aliado que tenha, pode vir uma resposta. O mundo inteiro vai reagir com sanções e coalizões.</p></div>'},{sec:'Países'}];
  for(const c of COUNTRIES.filter(x=>x.id!==m.country)){ const r=Math.round(nkChanceResposta(c.id)*100);
    it.push({ic:paisNuclear(c.id)?'☢️':'🎯',l:c.n,s:r?`Chance de resposta nuclear: ${r}%`:'Sem resposta nuclear esperada',tone:r>=50?'bad':'',on:()=>confirmBox(`Atacar ${c.n}?`,`Não tem volta. ${r?`Chance de resposta nuclear: ${r}%.`:'O mundo inteiro vai reagir.'}`,'Atacar',()=>act(()=>impNuclearUsar(c.id),'Ataque nuclear'))}); }
  return {title:'Ataque nuclear',items:it}; };
V.imperio=(o=>function(){ const r=o.apply(this,arguments); if(!chefeEstado()||!impNuclear()||!r||!r.items) return r;
  const i=r.items.findIndex(x=>x&&x.sec==='Países'); r.items.splice(i>=0?i:r.items.length,0,{ic:'☢️',l:'Ataque nuclear',s:'Escolher o país · pode haver resposta',tone:'bad',on:()=>UI.push(V.nkAlvos)}); return r; })(V.imperio);
if(typeof CONQ!=='undefined') CONQ.push({id:'usou_bomba',ic:'☢️',n:'Sem volta',d:'Usar uma arma nuclear.',ok:m=>!!m.c.usouBomba});
function nuclearSelfTest(){ const s0=S,ns=window.NO_SAVE,nn=window.NO_NEWS,snaps=SNAPS,meta=JSON.stringify(META); window.NO_SAVE=true; window.NO_NEWS=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); }, BAD=/\{\w+\}|undefined|NaN|\[object/;
  try{ for(const pais of ['US','BR']){ for(const alvo of ['FR','AO','MX']){ newLife({country:pais}); const m=S.me; m.age=50; m.prison=null; m.office={id:'pres',yrs:1,appr:70,dit:pais==='BR'?1:0}; if(pais==='BR') regime().nuclear=1; S.guerra=null; S.pending=[];
      if(alvo==='MX') guerraIniciar(pais,'MX','teste');
      ok(impNuclear(),'sem arma nuclear '+pais); ok(V.imperio().items.some(x=>x.l==='Ataque nuclear'),'tela sem ataque nuclear '+pais); V.nkAlvos().items.forEach(x=>ok(!BAD.test(String(x.l||'')+String(x.s||'')),'tela alvos: '+x.s));
      const r=impNuclearUsar(alvo); ok(!BAD.test(r)&&m.c.usouBomba,'ataque: '+r); if(alvo==='MX') ok(!guerraAtual(),'a guerra não acabou'); else ok(impNv(alvo)>=3,'país não se rendeu');
      const base=JSON.stringify(S); for(const k of ['tudo','cessar','bunker']){ S=JSON.parse(base); const sh=EVENTS.nk_resposta.show({de:'FR'}); ok(!BAD.test(sh.x),'resposta: '+sh.x); const t=EVENTS.nk_resposta.pick(k,{de:'FR'}); ok(!BAD.test(String(t)),'resposta '+k+': '+t); } } }
    newLife({country:'BR'}); S.me.age=50; S.me.office={id:'pres',yrs:1,appr:70}; ok(!V.imperio().items.some(x=>x.l==='Ataque nuclear'),'ataque nuclear sem ter bomba');
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; window.NO_NEWS=nn; SNAPS=snaps; Object.assign(META,JSON.parse(meta)); }
  if(erros.length) throw Error('Nuclear 2.15 · '+erros.slice(0,8).join(' | ')); return {ok:true}; }

// ---------- autoteste ----------
function dominioSelfTest(){ const s0=S,ns=window.NO_SAVE,nn=window.NO_NEWS,snaps=SNAPS,meta=JSON.stringify(META); window.NO_SAVE=true; window.NO_NEWS=true; const erros=[]; const ok=(c,x)=>{ if(!c) erros.push(x); };
  const BAD=/\{\w+\}|undefined|NaN|\[object/;
  const todas=(id,d)=>{ const base=JSON.stringify(S), ev=EVENTS[id]; const sh=ev.show(JSON.parse(JSON.stringify(d))); ok(sh&&!BAD.test(sh.x+sh.t),'show '+id+': '+(sh&&sh.x));
    for(const [l,k] of sh.ch){ ok(!BAD.test(l),'opção '+id+': '+l); S=JSON.parse(base); let r; try{ r=ev.pick(k,JSON.parse(JSON.stringify(d))); }catch(e){ erros.push(id+'/'+k+': '+e.message); } r=typeof r==='object'&&r?r.t:r; ok(!BAD.test(String(r)),id+'/'+k+': '+r); } S=JSON.parse(base); };
  try{
    // seita: fundação, sucessão e herança
    newLife({country:'BR'}); let m=S.me; m.age=30; m.prison=null; m.money=5e6; S.pending=[];
    seitaFundar('igreja','Teste'); ok(S.pending.some(e=>e.id==='seita_regra'),'fundar não pergunta a sucessão'); todas('seita_regra',{}); EVENTS.seita_regra.pick('hered',{});
    let s=seita(); ok(s.suc==='hered','sucessão não gravou'); Object.assign(s,{fieis:5000,devo:70,caixa:5e6,fama:50,dom:['o bairro','a cidade','o estado','o país']});
    V.seita().items.forEach(x=>ok(!BAD.test(String(x.l||'')+String(x.s||'')),'tela seita: '+x.l));
    // hereges, debate, traidor, guerra santa
    todas('seita_heresia',EVENTS.seita_heresia.prep()); todas('seita_debate',{r:0,pts:0,arg:'milagre',n:'Tomé Lima',gn:'M',f:30}); todas('seita_debate',{r:2,pts:6,arg:'dinheiro',n:'Ana',gn:'F',f:40});
    let d={r:0,pts:0,arg:'logica',n:'X',gn:'F',f:20}; for(let i=0;i<3;i++){ S.pending=[]; EVENTS.seita_debate.pick(d.arg,d); if(i<2) d=S.pending.find(e=>e.id==='seita_debate').d; } ok(seita().devo>70,'debate perfeito não subiu a devoção');
    s=seita(); s.rival={n:'Templo Rival',lider:'Mãe Celestina',forca:50};
    todas('seita_traidor',EVENTS.seita_traidor.prep()); todas('seita_traidor_fim',{n:'Judas',gn:'M',kind:'caixa'}); todas('seita_guerra_santa',{}); todas('seita_heranca',{});
    const tr=EVENTS.seita_traidor.prep(); S.pending=[]; EVENTS.seita_traidor.pick('a'+tr.cul,tr); ok(S.pending.some(e=>e.id==='seita_traidor_fim'),'acertar o traidor não leva ao destino dele');
    // mundo
    S.me.yr={}; let r=smAcao('US','missao'); ok(S.pending.some(e=>e.id==='smundo_missao'),'missão não abriu: '+r); todas('smundo_missao',{p:'US'});
    EVENTS.smundo_missao.pick(SM_PREF.US,{p:'US'}); ok(smFix(seita()).US.f>0,'missão sem fiéis');
    for(const id of ['US','MX','AR']) smFix(seita())[id]={f:8000,nv:3}; S.me.yr={};
    for(const k of ['reforcar','catedral','dominar']){ S.pending=[]; r=smAcao('MX',k); ok(!BAD.test(String(r)),'ação mundo '+k+': '+r); }
    todas('smundo_dominio',{p:'AR'}); smFix(seita()).AR.nv=4; smFix(seita()).MX.nv=4;
    todas('smundo_sancao',EVENTS.smundo_sancao.prep()); todas('smundo_banimento',EVENTS.smundo_banimento.prep()); S.guerra=null; todas('smundo_cruzada',EVENTS.smundo_cruzada.prep()); S.guerra=null;
    for(const it of V.seitaMundo().items) ok(!BAD.test(String(it.l||'')+String(it.s||'')+String(it.html||'')),'tela fé no mundo: '+it.l); SM_SEL='MX'; V.smPais();
    for(const c of COUNTRIES) if(c.id!==S.me.country) smFix(seita())[c.id]={f:50000,nv:4}; S.pending=[]; smChecarMundo(seita()); ok(S.pending.some(e=>e.id==='seita_fe_mundial'),'fé mundial não disparou'); todas('seita_fe_mundial',{});
    for(let i=0;i<30;i++){ S.year++; S.pending=[]; for(const f of NL_GANCHOS_ANO){ try{ f(); }catch(e){ erros.push('gancho: '+e.message); break; } } }
    for(const v of Object.values(smFix(seita()))) ok(Number.isFinite(v.f)&&v.f>=0,'fiéis inválidos no exterior');
    // herança hereditária
    newLife({country:'BR'}); m=S.me; m.age=50; m.prison=null; seitaFundar('apoc','Herança'); S.pending=[]; seita().suc='hered'; seita().fieis=900;
    const k=mkPerson({rel:'filho',age:25,bond:80}); S.people.push(k); die('teste de herança'); continueAs(k); ok(S.me.seita&&!S.me.seita.membro&&S.me.seita.n==='Herança','filho não herdou a seita hereditária');
    newLife({country:'BR'}); m=S.me; m.age=50; seitaFundar('apoc','Conselho'); seita().suc='conselho'; const k2=mkPerson({rel:'filho',age:25,bond:80}); S.people.push(k2); die('teste'); continueAs(k2); ok(!S.me.seita||S.me.seita.membro,'conselho deixou o filho herdar');
    // império
    newLife({country:'BR'}); m=S.me; m.age=50; m.prison=null; m.money=1e7; m.office={id:'pres',yrs:1,appr:90}; S.guerra=null;
    for(const it of V.career().items) if(it&&it.l==='Domínio mundial') ok(/país/.test(it.s),'item do domínio sem texto'); ok(V.career().items.some(it=>it&&it.l==='Domínio mundial'),'presidente sem domínio mundial');
    V.imperio().items.forEach(x=>ok(!BAD.test(String(x.l||'')+String(x.s||'')+String(x.html||'')),'tela império: '+x.l));
    for(const k of ['influencia','fantoche','anexar','invadir','libertar']){ for(const id of ['PT','AO','AR']){ m.yr={}; S.guerra=null; r=impAcao(id,k); ok(!BAD.test(String(r)),`império ${k} ${id}: ${r}`); } }
    IMP_SEL='PT'; V.impPais().items.forEach(x=>ok(!BAD.test(String(x.l||'')+String(x.s||'')),'tela país: '+x.l));
    S.guerra=null; imp().p={PT:3,AO:4,AR:3,MX:3,ES:3}; m.yr={}; S.pending=[]; impProclamar(); ok(S.pending.some(e=>e.id==='imp_proclamar'),'proclamar não abriu'); todas('imp_proclamar',{}); m=S.me;
    todas('imp_revolta',{p:'PT'}); todas('imp_sancoes',EVENTS.imp_sancoes.prep()); S.guerra=null; todas('imp_ultimato',{l:'US',alvo:'PT'}); S.guerra=null; m=S.me;
    S.guerra=null; const G=impGuerraCoalizao('US'); ok(G&&G.b.includes('AO')&&!G.a.includes('AO'),'domínios não lutam do meu lado'); guerraFim('a'); ok(impNv('AO')<4||impNv('PT')<3||impNv('AR')<3,'derrota não mexeu no império');
    EVENTS.imp_proclamar.pick('dinastia',{}); ok(S.me.office.dit&&imp().dinastia,'império hereditário não virou regime');
    for(const c of COUNTRIES) if(c.id!==m.country) imp().p[c.id]=4; S.pending=[]; imp().coroaFila=0; impChecarMundo(); ok(S.pending.some(e=>e.id==='imp_coroacao'),'coroação não disparou'); todas('imp_coroacao',{}); EVENTS.imp_coroacao.pick('rei',{}); ok(S.me.c.reiMundo,'não virou rei do mundo');
    todas('imp_mundo_ano',{i:0}); todas('imp_mundo_ano',{i:3}); m=S.me;
    for(let i=0;i<20;i++){ S.year++; S.pending=[]; m.yr={}; for(const f of NL_GANCHOS_ANO){ try{ f(); }catch(e){ erros.push('gancho império: '+e.message); break; } } if(!S.me.alive) break; }
    // dinastia: o filho herda o regime e o império
    newLife({country:'BR'}); m=S.me; m.age=60; m.office={id:'pres',yrs:3,appr:60}; imp().p={PT:4,AO:3,AR:3,MX:3}; EVENTS.imp_proclamar.pick('dinastia',{});
    const k3=mkPerson({rel:'filho',age:30,bond:80}); S.people.push(k3); die('teste da dinastia'); continueAs(k3); ok(S.me.office&&S.me.office.dit&&S.me.imperio&&impDominados()>=3,'herdeiro não recebeu o império');
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); } finally{ S=s0; window.NO_SAVE=ns; window.NO_NEWS=nn; SNAPS=snaps; Object.assign(META,JSON.parse(meta)); }
  if(erros.length) throw Error('Domínio 2.14 · '+erros.slice(0,8).join(' | ')); return {ok:true}; }
