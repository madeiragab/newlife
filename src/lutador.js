// ===== Carreira de lutador: da rinha clandestina ao cinturão mundial, com camp, luta tática por rounds e cartel =====
SPECIAL.lutador={n:'Lutas profissionais',talent:'athletic',l:['Lutador de rinha|Lutadora de rinha','Amador de academia|Amadora de academia','Amador federado|Amadora federada','Profissional estreante','Lutador ranqueado|Lutadora ranqueada','Desafiante ao título','Campeão nacional|Campeã nacional','Campeão mundial|Campeã mundial','Lenda das lutas'],
  sal:[2000,5000,10000,25000,70000,180000,450000,1400000,3500000],fame:[0,1,3,8,18,35,55,75,92],min:16,max:32,act:'Marcar uma luta'};
const LUT_MODS={mma:['MMA','🥊','mma'],boxe:['Boxe','🥊','boxe'],muay:['Muay thai','🦵','muay'],kick:['Kickboxing','🦶','karate'],jiu:['Jiu-jítsu','🥋','jiu']};
const LUT_BOLSA=[400,1500,4000,12000,40000,120000,350000,1000000,2500000];
const LUT_SOBE=[1,2,2,3,3];   // vitórias seguidas para subir de degrau até desafiante
const LUT_TEND={pressao:['vem para cima o tempo todo',{forte:6,rapido:3}],contra:['espera para contra-atacar',{esquiva:5,defesa:3}],quedas:['quer levar a luta para o chão',{agarrar:6}],volume:['joga muitos golpes rápidos',{rapido:7}],tecnico:['é paciente e completo',{rapido:3,forte:3,agarrar:2,defesa:3,esquiva:2}]};
const LUT_APELIDOS=['Tanque','Furacão','Pitbull','Sombra','Martelo','Cobra','Trator','Relâmpago','Muralha','Lobo','Navalha','Touro'];
const lutEh=m=>!!m&&!!m.job&&m.job.spc==='lutador';
function lutEnsure(j){ if(!j) return j; j.mod=j.mod||'mma'; j.rec=j.rec||{v:0,d:0,e:0,ko:0}; j.seq=j.seq||0; j.der=j.der||0; j.def=j.def||0; j.lesao=j.lesao||0; j.ano=j.ano??0; return j; }
function lutOrg(j){ const n=LUT_MODS[j.mod||'mma'][0]; return j.lvl===0?'Rinha clandestina':j.lvl===1?'Academia '+R.pick(['Leões','Guerreiros','Pantera','Dragão']):j.lvl===2?`Federação Estadual de ${n}`:j.lvl<=6?`Liga Nacional de ${n}`:`Circuito Mundial de ${n}`; }
const lutCartel=j=>`${j.rec.v}-${j.rec.d}${j.rec.e?'-'+j.rec.e:''}`;
// entrar na carreira
specialEntry=(o=>function(id){ if(id!=='lutador') return o.apply(this,arguments); const m=S.me, sp=SPECIAL.lutador;
  if(m.age<sp.min) return `Preciso ter pelo menos ${sp.min} anos.`; if(m.age>sp.max) return 'Já passei da idade para começar a lutar.'; if(m.health<40) return 'Minha saúde não aguenta um ringue.';
  if(!R.chance(clamp(.3+(m.fight||0)/150+(m.talent.athletic||0)/300,.1,.95))){ st('happy',-4); return R.pick(['Fiz uma aula experimental e o professor disse que eu ainda não estou pront'+oa()+'.','O dono da rinha olhou para mim e riu.']); }
  if(m.job) endJob(); m.job=lutEnsure({spc:'lutador',lvl:0,perf:55,yrs:0}); m.job.co=lutOrg(m.job); m.c.lutador=1;
  log('Entrei para o mundo das lutas. Primeiro degrau: as rinhas clandestinas.','good'); st('happy',8); queue('lut_modalidade',{});
  return 'Consegui! Vou começar nas rinhas clandestinas e subir luta a luta.'; })(specialEntry);
EVENTS.lut_modalidade={when:lutEh,show:()=>({k:'Lutas',t:'Qual vai ser a minha luta?',x:'Todo lutador tem uma especialidade. Ela define as regras das lutas e o tipo de adversário que vou enfrentar.',ch:Object.entries(LUT_MODS).map(([k,v])=>[`${v[1]} ${v[0]}${k==='boxe'?': só socos, em pé':k==='jiu'?': quedas e finalizações, sem golpes':k==='mma'?': vale tudo, em pé e no chão':': socos e chutes, em pé'}`,k])}),
  pick:k=>{ const j=lutEnsure(S.me.job); if(!lutEh(S.me)) return ''; j.mod=k; j.co=lutOrg(j); return `Escolhi o ${LUT_MODS[k][0]}. Agora é treinar e marcar a primeira luta.`; }};
// adversário compatível com o degrau atual
function lutAdversario(j,titulo){ const m=S.me, p=mkPerson({rel:'tmp',gender:m.gender,age:clamp(m.age+R.int(-5,6),18,40)}); const tk=R.pick(Object.keys(LUT_TEND).filter(t=>j.mod!=='boxe'&&j.mod!=='muay'&&j.mod!=='kick'||t!=='quedas'));
  const v=Math.max(0,Math.round(j.lvl*3+R.int(0,6))); return {n:`${p.first} "${R.pick(LUT_APELIDOS)}" ${p.last}`,curto:p.first,rec:`${v}-${R.int(0,Math.max(1,j.lvl))}`,f:clamp(Math.round(18+j.lvl*9+(titulo?6:0)+R.int(-7,7))),style:j.mod==='mma'?R.pick(['jiu','muay','boxe','judo','krav']):LUT_MODS[j.mod][2],tend:tk}; }
function lutMarcar(){ const m=S.me, j=lutEnsure(m.job); if(j.lesao) return 'Estou lesionad'+oa()+'. O médico proibiu lutas até o ano que vem.'; if(use('lut_luta')>3) return 'Quatro lutas por ano já é o limite do corpo e da comissão.';
  const titulo=j.lvl>=6; queue('lut_camp',{op:lutAdversario(j,titulo),titulo:titulo?1:0}); return ''; }
specialAction=(o=>function(){ return lutEh(S.me)?lutMarcar():o.apply(this,arguments); })(specialAction);
const LUT_CAMP=[['cardio','🏃','Cardio pesado','Mais fôlego durante a luta'],['trocacao','🥊','Trocação e força','Mais dano'],['video','📼','Estudar vídeos do adversário','Leio os sinais dele com mais facilidade'],['leve','🧘','Treino leve','Sem bônus, mas sem risco de lesão']];
EVENTS.lut_camp={when:m=>lutEh(m)&&!m.prison,
  prep:m=>{ const j=lutEnsure(m.job); return {op:lutAdversario(j,j.lvl>=6),titulo:j.lvl>=6?1:0}; },
  show:d=>{ const j=lutEnsure(S.me.job), o=d.op; return {k:'Lutas',t:d.titulo?(j.lvl>=7?'Defesa do cinturão mundial':'Luta pelo cinturão'):'Próxima luta',x:`${d.titulo?'Cinco rounds. ':''}Adversário: ${o.n}, cartel ${o.rec}, ${STYLES[o.style]?STYLES[o.style].n:LUT_MODS[j.mod][0]}. Dizem que ${LUT_TEND[o.tend][0]}. Bolsa: ${fmt(LUT_BOLSA[j.lvl]*(d.titulo?2:1))}, o dobro se eu vencer. Como vou me preparar?`,ch:LUT_CAMP.map(c=>[`${c[1]} ${c[2]}: ${c[3]}`,c[0]])}; },
  pick:(k,d)=>{ const m=S.me; if(!lutEh(m)) return ''; const j=lutEnsure(m.job); const cfg=lutConfig(k,d); if(!cfg) return 'Me machuquei no camp, a uma semana da luta. Luta cancelada e um ano de recuperação.';
    if(!window.NO_SAVE) setTimeout(()=>lutLutar(cfg),80); return k==='video'?`Assisti horas de lutas de ${d.op.curto}. Ele ${LUT_TEND[d.op.tend][0]}.`:'Camp encerrado. Hora de lutar.'; }};
function lutConfig(k,d){ const m=S.me, j=lutEnsure(m.job);
  if(k!=='leve'&&R.chance(.07)){ j.lesao=1; st('health',-R.int(5,12)); j.perf=clamp(j.perf-6); log('Lesão no camp: luta cancelada.','bad'); return null; }
  st('health',-R.int(0,3)); j.luta={n:d.op.n,titulo:d.titulo?1:0,defesa:j.lvl>=6?1:0};
  return {name:d.op.curto,power:d.op.f,style:d.op.style,regra:LUT_MODS[j.mod][2]==='karate'?'kick':j.mod,tend:LUT_TEND[d.op.tend][1],leitura:k==='video'?.22:0,dmgB:k==='trocacao'?.18:0,estB:k==='cardio'?20:0,bout:{rounds:d.titulo?5:3,por:5,titulo:!!d.titulo}}; }
function lutLutar(cfg){ startFight(cfg,'ringue'); if(FIGHT){ FIGHT.ostyle=cfg.style; FIGHT.est=Math.min(100,FIGHT.est+(cfg.estB||0)); FIGHT.me=Math.round(70+S.me.health*.3); FIGHT.op=100; FIGHT.int=lutaIntencao(FIGHT); lutaLer(FIGHT); if(typeof UI!=='undefined') UI.refresh(); } }
// resultado da luta: cartel, bolsa, ranking, cinturões e lesões
function lutadorResultado(r,metodo){ const m=S.me; if(!lutEh(m)) return; const j=lutEnsure(m.job), L=j.luta||{n:'o adversário'}, F=FIGHT; let t='';
  const bolsa=LUT_BOLSA[j.lvl]*(L.titulo?2:1)*(r==='venceu'?2:1); m.money+=bolsa; j.ano=(j.ano||0)+1; cnt('lutas');
  if(r==='venceu'){ j.rec.v++; if(metodo!=='decisão') j.rec.ko++; j.seq++; j.der=0; j.perf=clamp(j.perf+10); m.fame=clamp(m.fame+1+Math.round(j.lvl/2)); m.fight=clamp((m.fight||0)+R.int(1,2)); st('happy',8);
    t=`Venci ${L.n} por ${metodo}. Cartel: ${lutCartel(j)}. Bolsa: ${fmt(bolsa)}.`; }
  else if(r==='perdeu'){ j.rec.d++; j.seq=0; j.der++; j.perf=clamp(j.perf-8); st('happy',-8); t=`Perdi para ${L.n} por ${metodo}. Cartel: ${lutCartel(j)}. Bolsa: ${fmt(bolsa)}.`; }
  else { j.rec.e++; t=`Empate com ${L.n}. Cartel: ${lutCartel(j)}. Bolsa: ${fmt(bolsa)}.`; }
  st('health',-(r==='perdeu'?R.int(6,16):R.int(1,6))); if(R.chance(r==='perdeu'?.18:.08)){ j.lesao=1; t+=' Saí lesionad'+oa()+': fora até o ano que vem.'; }
  const antes=j.lvl;
  if(L.titulo&&r==='venceu'){ if(j.lvl===5){ j.lvl=6; j.def=0; t+=' 🏆 Sou campe'+(m.gender==='F'?'ã':'ão')+' nacional!'; }
    else if(L.mundial){ j.lvl=7; j.def=0; t+=' 🌍 Sou campe'+(m.gender==='F'?'ã':'ão')+' mundial!'; }
    else if(L.defesa){ j.def++; t+=` Defendi o cinturão (${j.def}ª defesa).`; if(j.lvl===6&&j.def>=2) queue('lut_titulo',{mundial:1}); if(j.lvl===7&&j.def>=3&&!j.lenda){ j.lenda=1; j.lvl=8; t+=' Viraram a minha história em documentário: lenda das lutas.'; } } }
  else if(L.titulo&&r==='perdeu'&&L.defesa&&j.lvl>=6&&j.lvl<=7){ j.lvl--; j.def=0; t+=' Perdi o cinturão.'; }
  else if(r==='venceu'&&j.lvl<5&&j.seq>=LUT_SOBE[j.lvl]){ j.lvl++; j.seq=0; }
  else if(r==='venceu'&&j.lvl===5&&j.seq>=2) queue('lut_titulo',{});
  if(r==='perdeu'&&j.der>=2&&j.lvl>=3&&j.lvl<=5){ j.lvl--; j.der=0; t+=' Duas derrotas seguidas: caí no ranking.'; }
  if(j.lvl!==antes){ j.co=lutOrg(j); if(j.lvl>antes){ t+=` Subi para ${jobTitle(j).toLowerCase()} (${j.co}).`; log(`Subi nas lutas: agora sou ${jobTitle(j).toLowerCase()}.`,'good'); } }
  log(t,r==='venceu'?'good':r==='perdeu'?'bad':''); if(F) F.lines.push(t); j.luta=null; }
EVENTS.lut_titulo={when:m=>lutEh(m)&&!m.prison,
  show:d=>({k:'Lutas',t:d.mundial?'Chance ao título mundial':'Chance ao cinturão nacional',x:d.mundial?'O circuito mundial quer o campeão nacional contra o campeão do mundo. Cinco rounds, bolsa de estrela.':'Duas vitórias seguidas como desafiante. A liga oferece a luta pelo cinturão nacional.',ch:[['Aceitar e marcar a luta','s'],['Pedir mais tempo de preparação','n']]}),
  pick:(k,d)=>{ const m=S.me; if(!lutEh(m)) return ''; const j=lutEnsure(m.job); if(k==='n'){ j.seq=Math.max(0,j.seq-1); return 'Pedi mais tempo. A chance pode não voltar tão cedo.'; }
    const op=lutAdversario(j,true); op.f=clamp(op.f+(d.mundial?8:2)); queue('lut_camp',{op,titulo:1,mundial:d.mundial?1:0}); return 'Contrato assinado. Agora é o camp da minha vida.'; }};
// a luta mundial é marcada pelo camp: registrar no contexto
lutConfig=(o=>function(k,d){ const r=o.apply(this,arguments); const j=S.me.job; if(r&&j&&j.luta&&d.mundial){ j.luta.mundial=1; j.luta.defesa=0; } if(r&&j&&j.luta&&d.titulo&&j.lvl===5){ j.luta.defesa=0; } return r; })(lutConfig);
EVENTS.lut_aposentar={when:lutEh,show:()=>{ const j=lutEnsure(S.me.job); return {k:'Lutas',t:'O corpo pede para parar',x:`Tenho ${S.me.age} anos e um cartel de ${lutCartel(j)}. Os médicos recomendam pendurar as luvas.`,ch:[['Me aposentar e abrir uma academia','a'],['Virar comentarista de lutas','c'],['Lutar mais uma temporada','m']]}; },
  pick:k=>{ const m=S.me; if(!lutEh(m)) return ''; const j=lutEnsure(m.job), c=lutCartel(j);
    if(k==='m'){ st('health',-R.int(3,8)); j.perf=clamp(j.perf-5); return 'Mais uma temporada. O corpo reclama, a torcida agradece.'; }
    endJob();
    if(k==='a'){ const v=Math.round(20000+m.fame*1500); m.money+=v; st('happy',6); log(`Me aposentei das lutas (${c}) e abri uma academia com o meu nome.`,'good'); return `Pendurei as luvas com ${c}. A academia abriu com fila na porta e já rendeu ${fmt(v)}.`; }
    m.fame=clamp(m.fame+3); st('happy',4); log(`Me aposentei das lutas (${c}) e virei comentarista.`,'good'); return `Pendurei as luvas com ${c} e agora comento lutas na TV.`; }};
// ano a ano: a carreira de lutador sobe por resultado, não por sorte
yearWork=(o=>function(){ const m=S.me, j=lutEh(m)?lutEnsure(m.job):null, lv=j?j.lvl:null; const r=o.apply(this,arguments);
  if(j&&m.job===j){ j.lvl=lv; j.co=j.co||lutOrg(j); if(j.lesao) j.lesao=0; if(!j.ano&&!m.prison){ j.perf=clamp(j.perf-12); log('Passei o ano sem lutar. O meu nome sumiu do ranking.','warn'); } j.ano=0;
    if(m.age>=35&&R.chance(.15+(m.age-35)*.08)) queue('lut_aposentar',{}); }
  return r; })(yearWork);
// tela do emprego
V.jobMenu=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(!lutEh(m)||!r||!r.items) return r; const j=lutEnsure(m.job), M=LUT_MODS[j.mod];
  r.items.splice(1,0,{html:`<div class="card">${kv('Modalidade',M[1]+' '+M[0])}${kv('Organização',j.co||lutOrg(j))}${kv('Cartel',lutCartel(j)+(j.rec.ko?` · ${j.rec.ko} por nocaute ou finalização`:''))}${kv('Sequência',j.seq?`${j.seq} vitória(s)`:'—')}${j.lvl>=6?kv('Defesas do cinturão',String(j.def)):''}${j.lesao?'<p style="color:#E5484D"><b>Lesionad'+oa()+':</b> sem lutas até o ano que vem.</p>':''}<p style="color:var(--muted);font-size:13px">${j.lvl<5?`Preciso de ${LUT_SOBE[j.lvl]} vitória(s) seguida(s) para subir.`:j.lvl===5?'Duas vitórias seguidas valem uma chance pelo cinturão.':j.lvl===6?'Duas defesas do cinturão valem uma chance pelo título mundial.':'Cada luta é uma defesa do cinturão.'} Luta tática: leia os sinais do adversário, cuide do fôlego e escolha o golpe certo.</p></div>`});
  const i=r.items.findIndex(x=>x.l===SPECIAL.lutador.act); if(i>=0) r.items.splice(i+1,0,{ic:'🏋️',l:'Treinar no camp',s:'Luta e preparo físico sobem · cansa',on:()=>act(()=>{ if(use('lut_treino')>3) return 'O técnico mandou descansar.'; m.fight=clamp((m.fight||0)+R.int(1,3)); m.talent.athletic=clamp((m.talent.athletic||0)+R.int(0,2)); j.perf=clamp(j.perf+R.int(2,5)); st('health',R.int(-2,1)); return R.pick(['Sparring de dez rounds. Saí sem sentir os braços.','Treino de quedas até o tatame ficar molhado.','Corrida na areia às cinco da manhã.']); },'Treino')});
  return r; })(V.jobMenu);
// eventos da carreira
const LUW=f=>m=>lutEh(m)&&!m.prison&&f(lutEnsure(m.job),m);
pack({k:'Lutas',w:1.5,cd:6,min:16,when:LUW(()=>true)},[
  ['Corte de peso','Faltam três dias para a pesagem e você está dois quilos acima do limite.',['Sauna e jejum|hl-8 perf+4|Bati o peso no limite. Fraco, mas bati.','Subir de categoria|perf-2|Lutei contra gente maior e aprendi na marra.','Perder a pesagem e pagar multa|$-v perf-6|Paguei {v} de multa e o público vaiou.'],{v:[500,8000]}],
  ['Proposta para entregar','Um apostador oferece {v} para você perder a próxima luta no segundo round.',['Recusar e denunciar|k+8 f+2|A comissão agradeceu. O apostador sumiu.','Aceitar|$+v k-15 ?70 perf-5|Caí no segundo round, como combinado. Ninguém desconfiou.|perf-30 f-5 fire|A comissão descobriu. Fui banid{o}.'],{v:[20000,200000]}],
  ['Provocação na coletiva','Seu próximo adversário zombou de você na coletiva de imprensa.',['Responder à altura|?lk f+4 perf+3|A coletiva viralizou. Ingressos esgotados.|f+1 h-3|Fiquei sem resposta e virei meme.','Ficar em silêncio e treinar|perf+5|Respondo dentro do ringue.','Partir para cima dele ali mesmo|f+5 $-5000 ?50 perf+2|Separaram a gente. A luta virou a mais esperada do ano.|perf-5|Levei multa e suspensão.']],
  ['Patrocínio','Uma marca de suplementos quer patrocinar você por {v} ao ano.',['Aceitar|$+v|Agora entro no ringue com o logo deles.','Recusar: o suplemento é duvidoso|k+3|Prefiro não arriscar um doping.'],{v:[5000,80000]}],
  ['Suplemento especial','Seu técnico sugere um "suplemento especial" para o próximo camp.',['Recusar|k+4|Limpo, do jeito difícil.','Usar|perf+12 ?65 hl-4|Me senti uma máquina.|perf-35 fire f-8|Pego no antidoping. Suspensão de dois anos.']],
  ['Sparring pesado','Um sparring pesado demais deixou seu joelho estalando.',['Parar e tratar|$-v hl+5 perf-4|Fisioterapia por um mês. Joelho salvo.','Treinar no sacrifício|hl-10 perf+4|Doeu a cada passo, mas não perdi o ritmo.'],{v:[1000,9000]}],
  ['Convite internacional','Um evento no exterior convida você para lutar com bolsa dobrada.',['Aceitar|$+v f+4 ?60 perf+6|Venci longe de casa e saí da arena enrolad{o} na bandeira.|hl-8 perf-4|Perdi para o fuso horário e para o adversário.','Recusar|h+0|Ainda não é a hora.'],{v:[3000,60000]}],
  ['Reality de lutadores','Um reality show de lutadores quer você no elenco.',['Entrar|f+8 perf-3|Fiquei famos{o}, mas perdi meses de treino.','Recusar|perf+3|Foco total.']],
  ['Técnico renomado','Um técnico renomado se oferece para assumir o seu camp por {v}.',['Contratar|$-v perf+10 tal.athletic+3|Ele mudou a minha luta em seis meses.','Ficar com o técnico de sempre|k+2|Lealdade também ganha luta.'],{v:[5000,40000]}],
  ['Fã na porta da academia','Um garoto espera você todo dia na porta da academia, sem dinheiro para pagar as aulas.',['Dar uma bolsa para ele|k+8 h+4|Treina comigo todo dia. Tem o olhar que eu tinha.','Dar um autógrafo e seguir|h+0|Ele guardou o papel como se fosse ouro.']],
]);
pack({k:'Lutas',w:1.3,cd:8,min:16,when:LUW(j=>j.lvl<=1)},[
  ['Rinha no estacionamento','O organizador da rinha quer que você lute duas vezes na mesma noite.',['Lutar as duas|$+v hl-10 perf+6|Ganhei as duas. Cheguei em casa com o rosto inchado e o bolso cheio.','Lutar uma só|perf+2|Uma por noite já basta.'],{v:[300,2000]}],
  ['Batida policial','A polícia chegou no meio da rinha clandestina.',['Correr pelos fundos|?55 h+0|Escapei pulando o muro.|arrest:luta_clandestina:0:1|Fui pego com a luva ainda na mão.','Ficar e se explicar|perf-4|Levei um sermão e fui liberad{o}.']],
  ['Olheiro na plateia','Um olheiro de uma academia de verdade assistiu à sua luta.',['Pedir uma chance|?lk perf+8|Ele me deu o cartão. "Aparece segunda."|h-2|Ele disse que eu ainda sou crua demais.','Fingir indiferença|perf+2|Se ele quiser, ele volta.']],
]);
pack({k:'Lutas',w:1.3,cd:8,min:16,when:LUW(j=>j.lvl>=6)},[
  ['Desafio do rival','O desafiante número um diz que você foge dele.',['Aceitar o desafio na TV|f+5 perf+4|O próximo evento esgotou em três horas.','Ignorar|f-2|Os fãs acharam que eu fugi mesmo.']],
  ['Contrato milionário','Uma organização rival oferece um contrato de {v} para você trocar de casa.',['Aceitar|$+v f+3 perf-3|Troquei de organização. Os fãs se dividiram.','Renovar com a atual|k+3 perf+3|Lealdade com quem me deu a chance.'],{v:[200000,2000000]}],
]);
