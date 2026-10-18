// Copa do Mundo: a cada 4 anos (2026, 2030, 2034…), jogadores de alto nível podem ser convocados.
// Preparação, fase de grupos e mata-mata jogados como uma sequência de decisões; o campeão leva a réplica da taça.
const COPA_SEDES={2026:'Estados Unidos, México e Canadá',2030:'Espanha, Portugal e Marrocos',2034:'Arábia Saudita'};
const COPA_FORCA={BR:88,FR:89,AR:90,GB:87,ES:88,DE:86,PT:86,IT:84,MX:76,US:77,JP:78,KR:75,CA:72,AO:63,IN:56};
const COPA_RIVAIS=[['Holanda',85],['Bélgica',83],['Uruguai',82],['Croácia',83],['Colômbia',81],['Marrocos',80],['Senegal',78],['Suíça',79],['Dinamarca',79],['Equador',76],['Austrália',72],['Nigéria',75],['Polônia',77],['Sérvia',76],['Gana',73],['Irã',72],['Camarões',72],['Chile',75],['Egito',74],['Costa Rica',70],['Arábia Saudita',70],['Tunísia',71],['Paraguai',74],['Áustria',78]];
const COPA_FASES=['1º jogo da fase de grupos','2º jogo da fase de grupos','3º jogo da fase de grupos','Oitavas de final','Quartas de final','Semifinal','Final'];
const COPA_NOMES={BR:'Brasil',FR:'França',AR:'Argentina',GB:'Inglaterra',ES:'Espanha',DE:'Alemanha',PT:'Portugal',IT:'Itália',MX:'México',US:'Estados Unidos',JP:'Japão',KR:'Coreia do Sul',CA:'Canadá',AO:'Angola',IN:'Índia'};
const TORNEIOS={copa:{nome:'Copa do Mundo',fases:COPA_FASES,fim:6,elim:['oitavas','quartas','semifinais'],prox:'oitavas'},olimp:{nome:'Futebol olímpico',fases:['1º jogo do grupo','2º jogo do grupo','3º jogo do grupo','Quartas de final','Semifinal','Final olímpica'],fim:5,elim:['quartas','semifinais'],prox:'quartas'}};
const OLIMP_SEDES={2028:'Los Angeles, Estados Unidos',2032:'Brisbane, Austrália'};
function olimpAno(ano=S.year){return ano>=2028&&(ano-2028)%4===0;}
function olimpSede(ano=S.year){return OLIMP_SEDES[ano]||R.pick(['Paris','Tóquio','Rio de Janeiro','Madri','Berlim','Seul','Cidade do México','Toronto']);}
const torneioDe=c=>TORNEIOS[c.tipo||'copa'];
const torneioLista=(m,c)=>c.tipo==='olimp'?(m.olimps||(m.olimps=[])):(m.copas||(m.copas=[]));
function copaAno(ano=S.year){return ano>=2026&&(ano-2026)%4===0;}
function copaSede(ano=S.year){return COPA_SEDES[ano]||R.pick(['Brasil','Alemanha','Japão e Coreia do Sul','Argentina e Uruguai','Inglaterra','Austrália e Nova Zelândia','Itália','França']);}
function copaSelecao(m=S.me){return COPA_NOMES[m.country]||countryOf(m.country).n;}
function copaRival(d,fase){const usados=d.rivais||[];const pool=COPA_RIVAIS.concat(Object.entries(COPA_FORCA).filter(([id])=>id!==S.me.country).map(([id,f])=>[COPA_NOMES[id],f])).filter(r=>!usados.includes(r[0]));
 const T=torneioDe(d),rel=fase-(T.fim-1);const forte=rel>=0?pool.filter(r=>r[1]>=83):fase>=3?pool.filter(r=>r[1]>=76):pool;const r=R.pick(forte.length?forte:pool);d.rivais=usados.concat(r[0]);return r;}
// convocação no ano de Copa
NL_GANCHOS_ANO.push(()=>{const m=S.me;if(m.copaAtual&&m.copaAtual.ano<S.year){(m.copas||(m.copas=[])).push({ano:m.copaAtual.ano,resultado:'eliminado',gols:m.copaAtual.gols});m.copaAtual=null;}if(!copaAno()||!futEhJogador(m)||!m.job.clube||m.prison||S.scen)return;m.copas||(m.copas=[]);if(m.copas.some(c=>c.ano===S.year))return;
 const r=futRating(m);if(m.age<19||m.age>36||m.job.clube.tier<4||r<74)return;const ch=r>=88?.9:r>=82?.65:.35;
 if(!R.chance(ch)){m.copas.push({ano:S.year,resultado:'fora da lista'});log(`Fiquei fora da lista da seleção para a Copa do Mundo de ${S.year}.`,'warn');return;}
 queue('copa_convocacao',{ano:S.year,sede:copaSede(),forca:COPA_FORCA[m.country]??70});});
NL_GANCHOS_ANO.push(()=>{const m=S.me;if(!olimpAno()||!futEhJogador(m)||!m.job.clube||m.prison||S.scen||m.copaAtual)return;m.olimps||(m.olimps=[]);if(m.olimps.some(c=>c.ano===S.year))return;
 const r=futRating(m),base=m.age<=23&&m.age>=17&&r>=66&&m.job.clube.tier>=2?.6:m.age>23&&m.age<=34&&r>=88?.25:0;if(!base||!R.chance(base))return;
 queue('olimp_convocacao',{ano:S.year,sede:olimpSede(),forca:(COPA_FORCA[m.country]??70)-3});});
EVENTS.olimp_convocacao={show:d=>({k:'Olimpíadas',t:`Convocad${oa()} para as Olimpíadas!`,x:`Fui chamad${oa()} para o futebol olímpico em ${d.sede}, nos Jogos de ${d.ano}. A vila olímpica, os atletas de todos os esportes, o sonho da medalha. Como vou me preparar?`,ch:[['Treinar dobrado','dobrado'],['Seguir o treino da comissão técnica','normal'],['Aproveitar a vila olímpica com calma','calma']]}),
 pick:(k,d)=>{const m=S.me;if(!futEhJogador(m))return 'A convocação perdeu o sentido.';m.olimps||(m.olimps=[]);if(k==='dobrado'&&R.chance(.07)){m.olimps.push({ano:d.ano,resultado:'cortado por lesão'});st('happy',-15);return 'Me machuquei no treino e fui cortad'+oa()+' dos Jogos.';}
  const c={tipo:'olimp',ano:d.ano,sede:d.sede,forca:d.forca,forma:k==='dobrado'?9:k==='normal'?5:2,fase:0,pts:0,gols:0,rivais:[]};if(k==='calma')st('happy',6);m.fame=clamp(m.fame+3);const [rn,rf]=copaRival(c,0);c.rival=rn;c.rforca=rf;m.copaAtual=c;queue('copa_jogo',{ano:d.ano});
  return k==='calma'?'Conheci atletas do mundo inteiro no refeitório da vila. Que lugar!':'Cheguei pront'+oa()+' para a estreia.';}};
EVENTS.copa_convocacao={show:d=>({k:'Copa do Mundo',t:`Convocad${oa()} para a Copa!`,x:`Meu nome está na lista da seleção ${copaSelecao()==='Brasil'?'brasileira':'de '+copaSelecao()} para a Copa do Mundo de ${d.ano}, em ${d.sede}. Faltam semanas para a estreia. Como vou me preparar?`,ch:[['Treinar dobrado todos os dias','dobrado'],['Seguir o treino da comissão técnica','normal'],['Cuidar do corpo: fisioterapia e sono','corpo']]}),
 pick:(k,d)=>{const m=S.me;if(!futEhJogador(m))return 'A convocação perdeu o sentido.';const c={ano:d.ano,sede:d.sede,forca:d.forca,forma:k==='dobrado'?10:k==='normal'?5:2,fase:0,pts:0,gols:0,rivais:[]};
  if(k==='dobrado'&&R.chance(.08)){m.copas.push({ano:d.ano,resultado:'cortado por lesão'});st('happy',-20);st('health',-8);log(`Me machuquei na preparação e fui cortad${oa()} da Copa de ${d.ano}.`,'bad');return 'Senti a coxa no último treino antes da viagem. O médico da seleção balançou a cabeça. Fui cortad'+oa()+'.';}
  if(k==='corpo')st('health',3);m.fame=clamp(m.fame+4);const [rn,rf]=copaRival(c,0);c.rival=rn;c.rforca=rf;m.copaAtual=c;queue('copa_jogo',{ano:d.ano});
  return k==='dobrado'?'Treinei como nunca. Cheguei voando na concentração.':k==='normal'?'Fiz tudo o que a comissão pediu. O grupo está fechado.':'Cheguei descansad'+oa()+' e sem dor nenhuma.';}};
function copaChance(c,k){const m=S.me,eu=Math.max(0,(futRating(m)-70)/8)+c.forma/5;const mod={drible:1.5,coletivo:1,chute:0,marcar:.5}[k]||0;const dif=c.forca+eu+mod-c.rforca;return Math.max(.08,Math.min(.85,.45+dif/40));}
EVENTS.copa_jogo={show:d=>{const c=S.me.copaAtual;if(!c)return {k:'Copa do Mundo',t:'Fim do torneio',x:'O torneio terminou para mim.',ch:[['Seguir','x']]};const T=torneioDe(c);
  return {k:T.nome,t:`${T.fases[c.fase]}: ${copaSelecao()} x ${c.rival}`,x:`${c.fase<3?`Fase de grupos · ${c.pts} ${c.pts===1?'ponto':'pontos'} até aqui.`:'Mata-mata: quem perde volta para casa.'} O estádio está lotado e o país inteiro está assistindo. Como vou jogar?`,
   ch:[['Partir para cima no drible','drible'],['Jogar coletivo e tocar a bola','coletivo'],['Arriscar chutes de longe','chute'],['Ajudar na marcação','marcar']]};},
 pick:(k,d)=>{const m=S.me,c=m.copaAtual;if(!c||!futEhJogador(m))return 'O torneio acabou para mim.';const T=torneioDe(c),F=T.fim,lista=torneioLista(m,c);
  const p=copaChance(c,k),meu=R.chance({drible:.35,coletivo:.2,chute:.25,marcar:.08}[k]||.15)?1:0;c.gols+=meu;let venceu=R.chance(p),empate=!venceu&&R.chance(.28),txt='';
  const placar=v=>{const a=R.int(1,3)+meu*0,b=v?R.int(0,a-1):a+R.int(1,2);return v?`${Math.max(a,meu+1)} a ${b}`:`${a-1} a ${b}`;};
  if(c.fase<3){if(venceu){c.pts+=3;txt=`Vitória sobre ${c.rival}, ${placar(true)}.`;}else if(empate){c.pts+=1;txt=`Empate com ${c.rival}.`;}else txt=`Derrota para ${c.rival}, ${placar(false)}.`;}
  else if(!venceu&&empate){venceu=R.chance(.5+c.forma/100);txt=`Empate no tempo normal contra ${c.rival}. Nos pênaltis, ${venceu?'deu a gente!':'o sonho acabou.'}`;}
  else txt=venceu?`Vitória sobre ${c.rival}, ${placar(true)}.`:`Derrota para ${c.rival}, ${placar(false)}. Eliminados.`;
  if(meu)txt+=R.pick([' Fiz um gol e corri para a bandeirinha de escanteio.',' Marquei e apontei para o céu.',' Meu gol virou meme no país inteiro.']);
  m.fame=clamp(m.fame+(meu?3:1));c.forma=clamp(c.forma-2,0,20);
  const fim=res=>{lista.push({ano:c.ano,resultado:res,gols:c.gols});m.copaAtual=null;return res;};
  if(c.fase===2){if(c.pts>=4||(c.pts===3&&R.chance(.45))){txt+=` Classificados para as ${T.prox} com ${c.pts} pontos!`;}else{fim('eliminado na fase de grupos');st('happy',-12);return txt+` Com ${c.pts} pontos, caímos na fase de grupos.`;}}
  else if(c.fase>=3&&!venceu){const res=c.fase===F?'vice-campeão':'eliminado nas '+T.elim[c.fase-3];fim(res);st('happy',c.fase===F?-10:-15);
   if(c.fase===F){const olimp=c.tipo==='olimp';m.assets.push({id:newId(),k:'item',n:olimp?`Medalha de prata olímpica de ${c.ano}`:`Medalha de prata da Copa do Mundo de ${c.ano}`,value:olimp?120000:250000,buy:0,cond:100});m.fame=clamp(m.fame+(olimp?8:12));log(`Fui vice-campe${m.gender==='F'?'ã':'ão'} ${olimp?'olímpic'+oa():'da Copa do Mundo'} de ${c.ano}.`,'warn');return txt+' Perdemos a final. A medalha de prata pesa no peito, mas um dia vou ter orgulho dela.';}
   return txt;}
  else if(c.fase===F&&venceu&&c.tipo==='olimp'){fim('campeão');cnt('ouroOlimpico');m.fame=clamp(m.fame+20);st('happy',30);m.assets.push({id:newId(),k:'item',n:`Medalha de ouro olímpica de ${c.ano}`,value:400000,buy:0,cond:100});log(`MEDALHA DE OURO NAS OLIMPÍADAS DE ${c.ano}!`,'good');return txt+' MEDALHA DE OURO! Subi no lugar mais alto do pódio e cantei o hino chorando.';}
  else if(c.fase===F&&venceu){fim('campeão');cnt('copa');m.c.campeaoCopa=(m.c.campeaoCopa||0)+1;m.fame=clamp(m.fame+30);st('happy',40);
   m.assets.push({id:newId(),k:'item',n:`Réplica oficial da taça da Copa do Mundo de ${c.ano}`,value:3000000,buy:0,cond:100},{id:newId(),k:'item',n:`Medalha de ouro da Copa do Mundo de ${c.ano}`,value:600000,buy:0,cond:100});
   log(`CAMPEÃO DA COPA DO MUNDO DE ${c.ano}! Ganhei a medalha de ouro e uma réplica oficial da taça.`,'good');
   return txt+` SOMOS CAMPEÕES DO MUNDO! Levantei a taça diante de bilhões de pessoas. Na volta, o desfile parou o país.${c.gols?` Terminei a Copa com ${c.gols} ${c.gols===1?'gol':'gols'}.`:''}`;}
  c.fase++;const [rn,rf]=copaRival(c,c.fase);c.rival=rn;c.rforca=rf;queue('copa_jogo',{ano:c.ano});return txt;}};
// Tela do emprego: histórico de Copas
V.jobMenu=(o=>function(){const r=o.apply(this,arguments),m=S.me;if(!r?.items||!futEhJogador(m))return r;if((m.olimps||[]).length)r.items.push({sec:'Olimpíadas'},...m.olimps.map(c=>({ic:c.resultado==='campeão'?'🥇':c.resultado==='vice-campeão'?'🥈':'⚽',l:'Jogos de '+c.ano,s:c.resultado+(c.gols?` · ${c.gols} ${c.gols===1?'gol':'gols'}`:'')})));if(!(m.copas||[]).length)return r;
 r.items.push({sec:'Copas do Mundo'},...m.copas.map(c=>({ic:c.resultado==='campeão'?'🏆':c.resultado==='vice-campeão'?'🥈':'⚽',l:'Copa de '+c.ano,s:c.resultado+(c.gols?` · ${c.gols} ${c.gols===1?'gol':'gols'}`:'')})));return r;})(V.jobMenu);
function copaSelfTest(){const s0=S,rf=R.f,ns=window.NO_SAVE,forca=COPA_FORCA.BR;let x=2026;R.f=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};const ok=(v,t)=>{if(!v)throw Error('Copa · '+t);};
 try{window.NO_SAVE=true;ok(copaAno(2026)&&copaAno(2030)&&!copaAno(2027),'anos de Copa');
  const jogar=(forte)=>{newLife({country:'BR',year:2030});const m=S.me;m.age=27;m.born=S.year-27;m.talent.athletic=97;m.job={spc:'atleta',lvl:3,perf:95,yrs:6,esporte:'futebol',clube:futNovo('BR',5)};m.job.co=m.job.clube.n;COPA_FORCA.BR=forte?140:20;
   S.pending=[];for(let i=0;i<10&&!S.pending.some(e=>e.id==='copa_convocacao');i++){m.copas=[];for(const g of NL_GANCHOS_ANO)g();}const e=S.pending.find(e=>e.id==='copa_convocacao');ok(e,'craque não foi convocado');
   const sh=EVENTS.copa_convocacao.show(e.d);ok(sh.ch.length===3,'convocação sem escolhas');EVENTS.copa_convocacao.pick('normal',e.d);let n=0;
   while(m.copaAtual&&n++<10){const ev=EVENTS.copa_jogo;ev.show({});ev.pick(R.pick(['drible','coletivo','chute','marcar']),{});}ok(!m.copaAtual&&m.copas.length===1,'Copa não terminou');return m;};
  let camp=null,tent=[];for(let i=0;i<6&&!camp;i++){const m=jogar(true);tent.push(m.copas[0].resultado);if(m.copas[0].resultado==='campeão')camp=m;}ok(camp,'seleção muito forte nunca foi campeã: '+tent.join(', '));const taca=camp.assets.find(a=>/taça/.test(a.n));ok(taca&&taca.value>=1e6,'campeão sem a taça');
  const antes=camp.money;sellAsset(taca);ok(camp.money>antes+1e6,'taça não vendeu por muito dinheiro');
  const fraco=jogar(false);ok(fraco.copas[0].resultado!=='campeão'&&!fraco.assets.some(a=>/taça/.test(a.n)),'seleção fraca ganhou a Copa');
  // futebol olímpico
  newLife({country:'BR',year:2028});const mo=S.me;mo.age=21;mo.born=S.year-21;mo.talent.athletic=90;mo.job={spc:'atleta',lvl:2,perf:90,yrs:3,esporte:'futebol',clube:futNovo('BR',4)};S.pending=[];
  for(let i=0;i<20&&!S.pending.some(e=>e.id==='olimp_convocacao');i++){mo.olimps=[];for(const g of NL_GANCHOS_ANO)g();}const eo=S.pending.find(e=>e.id==='olimp_convocacao');ok(eo,'jovem craque sem convocação olímpica');
  EVENTS.olimp_convocacao.pick('normal',eo.d);let k=0;while(mo.copaAtual&&k++<10){EVENTS.copa_jogo.show({});EVENTS.copa_jogo.pick('coletivo',{});}ok(!mo.copaAtual&&mo.olimps.length===1,'torneio olímpico não terminou');
  return {campeao:true,fraco:fraco.copas[0].resultado,olimpico:mo.olimps[0].resultado};}finally{COPA_FORCA.BR=forca;S=s0;R.f=rf;window.NO_SAVE=ns;}}
