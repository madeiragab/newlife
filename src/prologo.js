// ===== Prólogo dos modos fictícios: a aventura chega aos poucos, ano a ano, na vida real =====
// Zumbi: notícias (agora) → escassez (ano seguinte) → o fim (no terceiro ano). Ilha e Marte: convite → viagem.
// Isekai: sonhos → a passagem. Herói: o acidente → os poderes acordam. Dá para levar o par e a família.
let INI_FORCE=null;
const PROL_ILHA={
  aviao:['Passagens para o paraíso','Você ganhou um sorteio de rádio: passagens de avião para um resort numa ilha do Pacífico, tudo pago, para você e quem quiser levar.','O voo decolou na hora. Teve suco de graça, filme ruim e um cochilo. Acordei com o avião tremendo inteiro.',1],
  cruzeiro:['Um cruzeiro de dez dias','Chegou um e-mail com letras douradas: você ganhou um cruzeiro de dez dias pelo Caribe, com cabine para a família.','Os primeiros dias foram de bufê, piscina e show de mágica. Na terceira noite, o céu ficou preto e o navio começou a inclinar.',1],
  iate:['Festa no iate','Um amigo rico de longa data te chamou para uma semana no iate dele. "Pode trazer quem você quiser, tem cabine sobrando."','Champanhe, música alta e ninguém olhando o radar. De madrugada, um estrondo: o casco bateu num recife.',1],
  pesca:['A pescaria da sua vida','Um barqueiro do litoral te ofereceu uma pescaria em alto-mar. "A melhor da sua vida, garanto." O barco é velho, mas cabe a família.','Pegamos dourados no primeiro dia. No segundo, o motor morreu, o rádio também, e a correnteza nos levou.',1],
  reality:['Selecionad{o} para um reality','Você foi selecionad{o} para um reality de sobrevivência: um mês numa ilha, câmeras escondidas e prêmio de um milhão. Só participantes; nada de acompanhantes.','A produção nos deixou na praia com um kit e um sorriso. Na primeira noite, um furacão levou o barco deles embora.',0]};
const PROL_MARTE={
  oficial:['Seleção para Marte','A agência espacial abriu seleção para a primeira colônia em Marte. Você se inscreveu meio de brincadeira e passou em todas as fases. O programa aceita famílias.',2],
  turista:['Turista espacial','Você ganhou um sorteio: uma vaga de turista numa missão de verdade a Marte, com direito a um acompanhante.',1],
  clandestino:['Um jeito de ir escondid{o}','Um técnico do porto espacial cochichou no bar: "Tem espaço num contêiner de carga para Marte. Pelo preço certo, ninguém fica sabendo."',0],
  cientista:['Convite do instituto','Um instituto de pesquisa te convidou para estudar rochas em Marte por um mês. Dá para levar seu par.',1],
  reality:['O reality de Marte','Um reality show quer mandar participantes para Marte e te chamou para a última vaga. Bilhões vão assistir. Só participantes.',0]};
const PROL_ISK={caminhao:'Atravessando a rua, você ouviu a mesma voz dos sonhos. Virou o rosto. Um caminhão desgovernado vinha na sua direção, e tudo ficou branco.',
  invocado:'No banho, o chão do box virou um círculo de luz com as mesmas runas dos sonhos.',metro:'Na estação de sempre, a porta do vagão abriu para uma floresta com dois sóis no céu.',
  renascido:'Você deitou cansad{o}, ouvindo a voz dos sonhos mais alto do que nunca, e não acordou mais neste mundo.',abencoado:'Uma luz dourada encheu o quarto. Uma mulher de olhos de fogo disse: "Chegou a hora."',
  gamer:'Depois de trinta horas jogando, a tela ficou branca e mostrou o castelo dos seus sonhos.'};
const PROL_HEROI={raio:'Uma tempestade, um laboratório de física e um raio que te atravessou. Os médicos chamam de milagre: nem um arranhão.',
  meteorito:'Uma pedrinha caiu do céu no seu quintal. Você pegou com a mão. Queimou como fogo e depois parou. Ficou só uma marca brilhante na palma.',
  experimento:'Você topou um estudo clínico pago num laboratório do governo. Duas semanas, comida boa, papéis que ninguém leu. Te liberaram com um "obrigado" estranho.',
  heranca:'No sótão da sua avó, depois do enterro, você achou um traje antigo e uma carta: "Quando acontecer, não tenha medo".',
  acidente:'Um caminhão-tanque tombou na frente do seu ônibus. Você ajudou a tirar as pessoas antes da explosão e ficou ensopad{o} de um líquido verde.',
  alien:'No seu aniversário, seus pais contaram, tremendo: você foi encontrad{o} bebê numa cápsula de metal num milharal.'};
const PROL_N={zumbi:3,ilha:2,isekai:2,heroi:2,marte:3};
const prT=s=>String(s).replace(/\{o\}/g,oa());
function prolStart(id){ const m=S.me, v=INICIOS[id]?R.pick(INICIOS[id]).k:null;
  m.prol={id,v,fase:0,b:{},junto:[],ano:m.age}; log(`${SCEN[id].ic} Algo começou a mudar na minha vida…`,'warn'); prolStep(); }
function prolCancel(txt){ const m=S.me, id=m.prol&&m.prol.id; m.prol=null; if(txt) log(txt,'warn'); }
// quem pode ir junto
function prolGente(){ const p=partner(), ks=kids().filter(k=>k.alive), ps=parents(), irm=people('irmao');
  return {p,ks,fam:[p].concat(ks).filter(Boolean),todos:[p].concat(ks,ps,irm).filter(Boolean).slice(0,6)}; }
function prolCompCh(pr,max,next,verbo){ const g=prolGente(), ch=[], v=verbo||'Ir';
  ch.push({l:`${v} sozinh${oa()}`,fn:()=>{ pr.junto=[]; next(); }});
  if(max>=1&&g.p) ch.push({l:`${v} com ${g.p.first}`,fn:()=>{ pr.junto=[g.p.id]; next(); }});
  if(max>=2&&g.ks.length) ch.push({l:g.p?`${v} com ${g.p.first} e as crianças`:`${v} com meus filhos`,fn:()=>{ pr.junto=g.fam.slice(0,6).map(x=>x.id); next(); }});
  if(max>=3&&g.todos.length>g.fam.length) ch.push({l:`${v} com a família toda`,fn:()=>{ pr.junto=g.todos.map(x=>x.id); next(); }});
  if(max===1&&!g.p){ const f=people('amigo')[0]; if(f) ch.push({l:`${v} com ${f.first}`,fn:()=>{ pr.junto=[f.id]; next(); }}); }
  return ch; }
const prolAdv=pr=>()=>{ pr.fase++; };
const prolPago=(v,o)=>S.me.money>=v?Object.assign(o,{l:`${o.l} (${fmt(v)})`}):null;
function prolStep(){ const m=S.me, pr=m.prol; if(!pr||S.scen||!m.alive) return; const id=pr.id, f=pr.fase, b=pr.b, adv=prolAdv(pr);
  const Q=(t,x,ch)=>MQ.push({k:SCEN[id].n,t:prT(t),x:prT(x),ch:ch.filter(Boolean)});
  if(id==='zumbi'){
    if(f===0) Q('Notícia de rodapé',`No jornal da noite, uma nota rápida: um surto de "raiva agressiva" num hospital de ${R.pick(['Manila','Lagos','Bucareste','Lima','Jacarta','Karachi'])}. Pacientes mordendo enfermeiros. O apresentador sorriu e passou para o futebol.`,[
      {l:'Mudar de canal',fn:()=>{ adv(); log('Vi no jornal uma notícia estranha sobre um surto de raiva num hospital do outro lado do mundo.','warn'); }},
      {l:'Pesquisar mais na internet',fn:()=>{ adv(); b.info=1; st('smarts',2); log('Passei a noite lendo sobre um surto estranho. Os vídeos sumiam da internet em minutos.','warn'); }},
      prolPago(600,{l:'Guardar uns enlatados, por via das dúvidas',fn:()=>{ adv(); b.com=(b.com||0)+3; m.money-=600; log('Comecei a guardar enlatados no armário. Minha família riu de mim.','warn'); }})]);
    else if(f===1) Q('As prateleiras vazias','Os casos se espalharam por vários países. Fronteiras fechadas, voos cancelados, aulas suspensas. No mercado, as prateleiras estão vazias e o arroz custa o triplo. Na internet, vídeos que ninguém consegue explicar.',[
      prolPago(1800,{l:'Encarar a fila do mercado e estocar',fn:()=>{ adv(); b.com=(b.com||0)+4; b.agua=(b.agua||0)+3; m.money-=1800; log('Passei seis horas numa fila de mercado para comprar comida. Brigaram por papel higiênico.','warn'); }}),
      prolPago(4500,{l:'Comprar uma arma "por precaução"',fn:()=>{ adv(); b.arma=1; m.money-=4500; log('Comprei uma arma e munição. Nunca pensei que faria isso.','warn'); }}),
      {l:'Fazer aulas de defesa pessoal',fn:()=>{ adv(); m.fight=clamp((m.fight||0)+8); log('Entrei numa academia de defesa pessoal. A turma lotou do dia para a noite.','warn'); }},
      {l:'Ajudar os vizinhos idosos',fn:()=>{ adv(); b.viz=1; m.karma=clamp(m.karma+5); log('Fiz compras para os vizinhos idosos do prédio. Eles não esquecem.','good'); }}]);
    else { const go=()=>prolGo(); Q('O dia em que o mundo acabou','A sirene da cidade tocou às três da manhã e não parou mais. Pela janela, gente correndo. Alguns correndo atrás dos outros. O rádio repete a mesma frase: "Permaneçam em casa". Ninguém permanece.',
      prolCompCh(pr,3,go,'Fugir')); }
  }
  else if(id==='ilha'){ const d=PROL_ILHA[pr.v]||PROL_ILHA.aviao;
    if(f===0) Q(d[0],d[1],(d[3]?prolCompCh(pr,3,()=>{ adv(); log('Aceitei um convite de viagem. Vai ser incrível.','good'); st('happy',6); },'Ir'):[{l:'Aceitar',fn:()=>{ adv(); log('Fui selecionad'+oa()+' para um reality de sobrevivência.','good'); }}]).concat([{l:'Recusar o convite',cls:'alt',fn:()=>prolCancel('Recusei um convite de viagem. Algo me disse para ficar.')}]));
    else Q('O dia da viagem',d[2],[{l:'Nadar com tudo o que tenho',fn:()=>prolGo()},{l:'Agarrar o que der antes de pular',fn:()=>{ b.extra=1; prolGo(); }}]);
  }
  else if(id==='marte'){ const d=PROL_MARTE[pr.v]||PROL_MARTE.oficial;
    if(f===0){ const base=d[2]?prolCompCh(pr,d[2],()=>{ adv(); log('Fui aceit'+oa()+' numa missão para Marte.','good'); },'Ir'):[pr.v==='clandestino'&&m.money<8000?null:{l:pr.v==='clandestino'?'Pagar o técnico ($8.000)':'Aceitar',fn:()=>{ if(pr.v==='clandestino') m.money-=8000; adv(); log(pr.v==='clandestino'?'Paguei para entrar escondid'+oa()+' na nave de carga para Marte.':'Aceitei ir para Marte.','warn'); }}];
      Q(d[0],d[1],base.concat([{l:'Desistir',cls:'alt',fn:()=>prolCancel('Desisti de ir para Marte. A Terra é boa o bastante.')}])); }
    else if(f===1) Q(pr.v==='clandestino'?'Preparando o esconderijo':'Um ano de treinamento',pr.v==='clandestino'?'Você passou o ano juntando garrafas de água, comida desidratada e coragem. O contêiner tem o tamanho de um armário.':'Centrífugas, simuladores de gravidade, aulas de botânica e de primeiros socorros. A equipe começa a virar família.',[
      {l:'Treinar sobrevivência',fn:()=>{ adv(); b.hl=1; st('health',4); log('Treinei para sobreviver em Marte.','good'); }},
      {l:'Estudar ciência',fn:()=>{ adv(); b.sci=1; st('smarts',4); log('Estudei geologia marciana o ano inteiro.','good'); }},
      {l:'Fazer amizade com a equipe',fn:()=>{ adv(); b.amigos=1; log('Fiz amizade com a equipe da missão.','good'); }},
      {l:'Desistir na última hora',cls:'alt',fn:()=>prolCancel('Desisti da viagem a Marte antes do lançamento.')}]);
    else Q('O lançamento','Contagem regressiva. Dez, nove, oito… O foguete tremeu como se fosse se desfazer. Depois, o silêncio do espaço e seis meses olhando a Terra virar um pontinho azul.',[{l:'Rumo a Marte',fn:()=>prolGo()}]);
  }
  else if(id==='isekai'){
    if(f===0) Q('Sonhos com dois sóis','Toda noite o mesmo sonho: um campo com dois sóis, um castelo escuro no horizonte e uma voz dizendo o seu nome. Você acorda cansad{o}, como se tivesse andado a noite inteira.',[
      {l:'Anotar os sonhos num caderno',fn:()=>{ adv(); b.mapa=1; log('Comecei a anotar sonhos estranhos com um mundo de dois sóis.','warn'); }},
      {l:'Ignorar e seguir a vida',fn:()=>{ adv(); log('Tive sonhos estranhos o ano inteiro.','warn'); }},
      prolPago(1200,{l:'Procurar um psicólogo',fn:()=>{ adv(); m.money-=1200; b.calma=1; log('Fui a um psicólogo por causa de uns sonhos. Ele também anotou tudo.','warn'); }})]);
    else { const g=prolGente(); const ch=[{l:'Seguir a luz',fn:()=>{ pr.junto=[]; prolGo(); }}];
      if(g.p) ch.push({l:`Segurar a mão de ${g.p.first}`,fn:()=>{ pr.junto=[g.p.id]; prolGo(); }});
      ch.push({l:'Resistir com todas as forças',cls:'alt',fn:()=>{ if(R.chance(.5)) prolCancel('Uma luz quase me levou para outro mundo. Resisti. Os sonhos pararam.'); else { MQ.unshift({t:'Não deu',x:'Você resistiu, mas a luz foi mais forte.'}); prolGo(); } }});
      Q('A passagem',(PROL_ISK[pr.v]||PROL_ISK.caminhao)+' A voz falou de novo, agora bem perto: "Venha."',ch); }
  }
  else if(id==='heroi'){
    if(f===0) Q('Algo aconteceu',PROL_HEROI[pr.v]||PROL_HEROI.raio,[
      prolPago(2000,{l:'Fazer todos os exames',fn:()=>{ adv(); m.money-=2000; log('Fiz uma bateria de exames depois de um acidente estranho. Tudo normal. Normal demais.','warn'); }}),
      {l:'Não contar para ninguém',fn:()=>{ adv(); b.seg=1; log('Guardei segredo sobre um acidente estranho.','warn'); }},
      {l:'Contar para a família',fn:()=>{ adv(); b.fam=1; log('Contei para a família sobre um acidente estranho. Ficaram preocupados.','warn'); }}]);
    else { pr.poder=pr.poder||R.pick(POWERS); Q('Os poderes acordaram',`Primeiro foram coisas pequenas. Depois, numa manhã qualquer, aconteceu de verdade: você conseguiu ${PODER_FRASE[pr.poder]||pr.poder}. O espelho mostra a mesma pessoa, mas nada mais é igual.`,[
      {l:'Usar os poderes para ajudar',fn:()=>prolGo()},
      {l:'Esconder tudo e viver normal',cls:'alt',fn:()=>prolCancel('Escondi um segredo enorme e segui a vida como se nada tivesse acontecido. Com o tempo, ele adormeceu.')}]); }
  }
}
// pessoas da vida real viram membros do grupo, e voltam com você
function crewFromPerson(p){ const c=mkCrew({first:p.first,last:p.last,gender:p.gender,age:p.age,lv:85}); c.genes=p.genes; c.look=p.look; c.pid=p.id;
  if(c.race) c.race=p.gender==='F'?'humana':'humano'; if(p.age<14) c.bebe=1; return c; }
function prolGo(){ const m=S.me, pr=m.prol; if(!pr||S.scen) return; const id=pr.id, b=pr.b;
  if(id==='zumbi'&&m.prison){ pr.v='presidio'; m.prison=null; }
  else if(m.prison){ prolCancel('Perdi a aventura que me esperava: estava pres'+oa()+'.'); return; }
  m.prol=null; INI_FORCE=pr.v; try{ scStart(id); } finally{ INI_FORCE=null; }
  const sc=S.scen; if(!sc) return; render.jump=true;
  const junto=pr.junto.map(P).filter(p=>p&&p.alive); sc.junto=junto.map(p=>p.id); junto.forEach(p=>crewFromPerson(p));
  const add=(id,n)=>{ for(let i=0;i<n;i++) addItem(id,null,true); };
  if(id==='zumbi'){ add('lata',b.com||0); add('agua',b.agua||0); if(b.arma){ add('pistola',1); add('muni',2); } if(b.viz) mkCrew({age:rnd(60,75),lv:90}); }
  if(id==='ilha'&&b.extra){ add(R.pick(['faca','isqueiro','corda']),1); add('biscoito',1); }
  if(id==='marte'){ if(b.hl) scStat('hl',5); if(b.sci) scStat('ciencia',8); if(b.amigos) crew().forEach(c=>c.lv=Math.min(100,c.lv+12)); }
  if(id==='isekai'){ if(b.mapa){ sc.ouro+=40; } if(b.calma) scStat('san',10); }
  if(id==='heroi'&&pr.poder){ sc.poder=pr.poder; sc.codinome=R.pick(CODI[pr.poder]||['Sombra']); if(b.seg) scStat('sec',12); if(b.fam) scStat('san',8); }
  if(junto.length) scLog(`Comigo: ${junto.map(p=>p.first).join(', ')}.`,'good');
  UI.close(); }
// escolher o modo só começa o prólogo
V.scenPick=(o=>()=>{ const r=o(), m=S.me, pr=m.prol;
  r.items.forEach(it=>{ if(!it.on) return; const id=Object.keys(SCEN).find(k=>SCEN[k].n===it.l); if(!id) return;
    it.on=()=>modal({t:`${SCEN[id].ic} ${SCEN[id].n}`,x:prT(`A aventura não começa de uma vez: ela chega aos poucos na sua vida real, ${PROL_N[id]>2?'ao longo dos próximos anos':'a partir deste ano'}. Vão aparecer sinais, convites e escolhas, como ir sozinh{o} ou levar quem você ama.\n\n${SC_VOLTA[id]||''}\n\nQuando chegar a hora, se morrer lá, morre de verdade. Começar?`),
      ch:[{l:'Começar',cls:'danger',fn:()=>{ UI.close(); prolStart(id); }},{l:'Deixar para lá',cls:'alt'}]}); });
  if(pr){ r.items.splice(1,0,{html:`<div class="card"><p><b>${SCEN[pr.id].ic} Já está acontecendo:</b> ${esc(SCEN[pr.id].n)}. O próximo passo chega quando você envelhecer.</p></div>`});
    r.items.forEach(it=>{ if(it.on&&!it.html){ it.dis=true; it.why='Uma aventura já está a caminho na sua vida.'; } }); }
  return r; })(V.scenPick);
ageUp=(o=>function(){ const r=o.apply(this,arguments); const m=S&&S.me; if(m&&m.alive&&m.prol&&!S.scen) prolStep(); return r; })(ageUp);
// quem foi junto morre de verdade se morrer lá
crewLeave=(o=>function(c,why,dead){ const r=o.apply(this,arguments); if(c&&c.pid){ const p=P(c.pid); if(p&&p.alive){ if(dead){ p.alive=false; p.cause='longe de casa, numa aventura que ninguém acredita'; log(`${p.first} morreu ao meu lado, longe de casa.`,'bad'); st('happy',-20); } else log(`${p.first} se separou de mim e encontrou o próprio caminho de volta para casa.`,'warn'); } } return r; })(crewLeave);
