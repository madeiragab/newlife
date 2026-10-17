// ===== Saúde: a maioria das doenças só tem nome depois da consulta; antes, você só sente os sintomas =====
// Médico mais barato erra mais e cura menos. Medicina alternativa quase nunca funciona, mas às vezes acontece um milagre.
const VISIVEL=new Set(['acne','calvicie','piolho','verruga','vitiligo']);   // dá para saber o que é só de olhar no espelho
const SINT_GRUPOS=[
  [['gripe','resfriado','covid','sinusite','rinite','amigdalite','bronquite','pneumonia','tuberculose','coqueluche','otite','caxumba','mononucleose'],
    ['Acordei com febre e o corpo todo doendo.','Uma tosse que não passa de jeito nenhum.','Nariz entupido e a garganta arranhando.','Acordei me sentindo mal hoje, com calafrios.','Dor de ouvido e um cansaço estranho.']],
  [['catapora','sarampo','rubeola','dengue','zika','chikungunya','febre_amarela','psoriase'],
    ['Acordei com bolinhas vermelhas pelo corpo.','Manchas vermelhas apareceram na pele, e uma febre alta.','Dor atrás dos olhos e as juntas doendo muito.','A pele começou a coçar e a descascar.']],
  [['intox','gastrite','ulcera','refluxo','apendicite','hepatite','cirrose','cancer_estomago','cancer_colon'],
    ['Uma dor forte na barriga que não vai embora.','Enjoo o dia inteiro e nada para no estômago.','Queimação no peito depois de comer.','Fiquei amarelad{o} e sem fome.']],
  [['enxaqueca','labirintite','tumor_cerebral'],['Uma dor de cabeça que não passa.','Tudo começou a girar do nada.','Luz me incomoda e a cabeça lateja.']],
  [['depressao','ansiedade','panico','toc','tdah','burnout','insonia'],
    ['Não tenho vontade de levantar da cama.','Meu coração dispara do nada, sem motivo.','Não consigo dormir direito há semanas.','Ando esgotad{o}, sem energia para nada.','Não consigo me concentrar em coisa nenhuma.']],
  [['hipertensao','colesterol','diabetes','cardiaca','anemia','hipotireoidismo','apneia'],
    ['Ando cansad{o} sem motivo nenhum.','Sinto sede o tempo todo.','Uma pressão estranha no peito quando subo escada.','Ronco tanto que acordo cansad{o}.','Tontura quando levanto rápido.']],
  [['cancer_pele','cancer_pulmao','cancer_mama','cancer_prostata','leucemia','cancer_tireoide','cancer_ovario','cancer_testiculo','linfoma'],
    ['Encontrei um caroço estranho no corpo.','Perdi peso sem fazer dieta nenhuma.','Um cansaço que não vai embora nunca.','Uma pinta mudou de cor e de tamanho.','Uma tosse com um pouco de sangue.']],
  [['ist','sifilis','gonorreia','herpes','hiv'],['Uma ardência estranha lá embaixo.','Apareceram umas feridinhas que eu não sei explicar.','Ando com febre baixa e ínguas no pescoço.']],
  [['artrite','gota','osteoporose','hernia','rins','lupus'],['Dor nas juntas toda manhã.','Uma dor nas costas que desce pela perna.','Dor forte do lado, perto das costelas.','O dedão do pé inchou e dói muito.']],
  [['catarata','glaucoma','conjuntivite'],['Minha vista está ficando embaçada.','Olho vermelho, ardendo e coçando.','Vejo um halo em volta das luzes.']],
  [['alzheimer','parkinson','esclerose'],['Esqueci o caminho de casa por um minuto.','Minhas mãos começaram a tremer.','Formigamento nas pernas e uma fraqueza estranha.']],
  [['asma'],['Falta o ar quando corro.','Chiado no peito à noite.']],
  [['malaria','anemia'],['Febre que vai e volta, com tremedeira.']],
];
const SINT={}; SINT_GRUPOS.forEach(([ids,txt])=>ids.forEach(id=>{ SINT[id]=(SINT[id]||[]).concat(txt); }));
const sintoma=id=>(R.pick(SINT[id]||['Acordei me sentindo mal hoje.','Alguma coisa não está certa no meu corpo.','Ando me sentindo estranh{o} faz uns dias.'])).replace(/\{o\}/g,oa());
const disNome=d=>d&&d.k===false?null:dn(DISEASES[d.id].n);
// pegar uma doença: só sintomas no diário (menos as que dá para ver no espelho)
addDisease=(o=>function(id){ const m=S.me;
  if(id==='ist') id=R.wpick([['ist',4],['sifilis',2],['gonorreia',3],['herpes',2],['hiv',.4]]);
  if(!DISEASES[id]||m.dis.find(d=>d.id===id)) return;
  if(VISIVEL.has(id)) return o(id);
  if(id==='catapora') m.genes.pox=1; if(id==='vitiligo') m.genes.vitiligo=1;
  const sx=sintoma(id); m.dis.push({id,y:0,ctrl:false,k:false,sx}); log(sx,'bad'); st('happy',-3); })(addDisease);
// descobrir o que é (a qualidade do médico importa)
const TIERS={posto:{n:'Posto de saúde',c:0,ac:.55,cu:.5},clinica:{n:'Clínica popular',c:120,ac:.75,cu:.75},doc:{n:'Médico particular',c:300,ac:.93,cu:1},hosp:{n:'Hospital',c:8000,ac:1,cu:1}};
function diagnose(d,tier){ const m=S.me, def=DISEASES[d.id]; if(d.k!==false) return '';
  const ac=TIERS[tier].ac*(CANCERS.has(d.id)?.85:1);
  if(!R.chance(ac)) return R.pick(['O médico disse que é "virose" e mandou tomar bastante água.','Fizeram uns exames, mas não acharam nada.','O médico mal olhou para mim e passou um remédio para dor.']);
  d.k=true; const n=dn(def.n); log(`O médico descobriu o que eu tenho: ${n}.`,'bad');
  if(CANCERS.has(d.id)&&!m.c.chemo){ m.c.chemo=1; log('Comecei a quimioterapia. Meu cabelo caiu todo.','bad'); }
  return `Diagnóstico: ${n}.`; }
// tratar: médico barato erra o diagnóstico e cura menos
treat=(o=>function(where,dis){ const m=S.me, def=DISEASES[dis.id];
  if(where==='psi') return o(where,dis);
  if(where==='alt') return treatAlt(dis);
  const T=TIERS[where]||TIERS.doc; if(T.c&&!canPay(T.c)) return `Não tenho ${fmt(T.c)} para ${T.n.toLowerCase()}.`; m.money-=T.c;
  if(where==='posto'&&R.chance(.25)) return R.pick(['A fila do posto dobrava o quarteirão. Voltei para casa sem ser atendid'+oa()+'.','Não tinha médico no posto hoje.']);
  const dg=diagnose(dis,where); if(dis.k===false) return dg;
  const nome=dn(def.n);
  if(def.ctrl){ if(R.chance(T.cu)){ dis.ctrl=true; st('health',2); return `${dg} ${nome[0].toUpperCase()+nome.slice(1)} agora está sob controle com remédios.`.trim(); } return `${dg} O remédio que me passaram não fez efeito.`.trim(); }
  if(def.cure==='none') return `${dg} Não existe cura para ${nome}. Os médicos só aliviaram os sintomas.`.trim();
  let p=where==='hosp'?(def.hosp||def.doc||0)+.05:(def.doc||0)*T.cu;
  if(R.chance(p)){ m.dis=m.dis.filter(x=>x!==dis); st('happy',8); st('health',R.int(3,8)); return `${dg} Fui ${m.gender==='F'?'curada':'curado'} de ${nome}!`.trim(); }
  return `${dg} ${where==='posto'||where==='clinica'?'O tratamento barato não resolveu. Talvez um médico melhor resolva.':`O tratamento para ${nome} não funcionou desta vez.`}`.trim(); })(treat);
// medicina alternativa: uma vez por ano para cada problema; pode piorar, quase nunca cura, e às vezes cura até o incurável
function treatAlt(dis){ const m=S.me, def=DISEASES[dis.id]; if(use('alt_'+dis.id)>1) return 'O curandeiro disse que só pode me atender uma vez por ano para isso.';
  if(!canPay(80)) return 'Nem os 80 do curandeiro eu tenho agora.'; m.money-=80; const nome=disNome(dis)||'esse mal-estar';
  if(R.chance(.1)){ st('health',-6); return 'O curandeiro me deu um chá estranho. Piorei.'; }
  if(def.cure==='none'||def.ctrl){ if(R.chance(.008)){ m.dis=m.dis.filter(x=>x!==dis); st('happy',25); st('health',15); cnt('milagre'); log(`Os médicos não sabem explicar: ${nome} sumiu depois de um tratamento alternativo.`,'good'); return `Um milagre! ${nome[0].toUpperCase()+nome.slice(1)} sumiu. Os médicos repetiram os exames três vezes.`; }
    return R.pick(['Garrafada, banho de ervas e reza. Não mudou nada.','Agulhas, cristais e incenso. Relaxei, mas continuo igual.','O curandeiro garantiu que funcionaria. Não funcionou.']); }
  if(R.chance((def.doc||def.hosp||0)*.15)){ m.dis=m.dis.filter(x=>x!==dis); st('happy',8); return `O chá de ervas funcionou: ${nome} passou.`; }
  return 'O chá de ervas não fez efeito.'; }
// consulta de rotina descobre o que estava escondido
checkup=(o=>function(){ const m=S.me, r=o(); const hid=m.dis.filter(d=>d.k===false); if(!hid.length) return r;
  const found=hid.filter(d=>R.chance(CANCERS.has(d.id)?.7:.85)); found.forEach(d=>diagnose(d,'hosp'));
  return found.length?`Os exames de rotina acharam: ${found.map(d=>dn(DISEASES[d.id].n)).join(', ')}.`:r; })(checkup);
// tela de saúde: problemas sem diagnóstico aparecem pelo sintoma
V.health=(o=>()=>{ const r=o(), m=S.me; if(!m.dis.length) return r;
  const i0=r.items.findIndex(x=>x.sec==='Meus problemas'), i1=r.items.findIndex(x=>x.sec==='Cuidados'); if(i0<0||i1<0) return r;
  const it=[{sec:'Meus problemas'}];
  m.dis.forEach(d=>{ const def=DISEASES[d.id], known=d.k!==false, nome=known?def.n:(d.sx||'Algo não vai bem');
    const op=Object.entries(TIERS).map(([k,T])=>({l:T.n,s:longoTrata(k,d)?'Ciclo anual · '+fmt(longoCusto(k,d))+(d.tAno===m.age?' · feito este ano':''):T.c?fmt(T.c):'Grátis'+(k==='posto'?' · fila e menos chance':''),on:()=>act(()=>treat(k,d),known?def.n:'Consulta')}));
    op.push({l:'Terapia',s:fmt(400),dis:!known||def.cure!=='psi',why:known?'Terapia não resolve isso.':'Primeiro preciso saber o que eu tenho.',on:()=>act(()=>treat('psi',d),def.n)});
    op.push({l:'Medicina alternativa',s:fmt(80)+' · uma vez por ano',on:()=>act(()=>treat('alt',d),'Medicina alternativa')});
    it.push({l:nome,s:known?`${d.y} ${d.y===1?'ano':'anos'}${d.ctrl?' · controlada':''}${def.cure==='none'?' · sem cura':''}${d.tA?' · tratamento: ano '+d.tA+' de '+d.tNeed:''}`:'Sem diagnóstico · vá ao médico descobrir o que é',tone:'bad',
      on:()=>UI.push(()=>({title:known?def.n:'O que eu estou sentindo',items:(known?[]:[{html:`<div class="card"><p>${esc(d.sx||'')}</p><p style="color:var(--muted);font-size:13px">Médico melhor acerta mais o diagnóstico. A consulta de rotina também pode descobrir.</p></div>`}]).concat(op)}))}); });
  r.items.splice(i0,i1-i0,...it); return r; })(V.health);
// doenças graves sem tratamento pioram a cada ano (o estrago cresce com o tempo)
yearHealth=(o=>function(){ const r=o.apply(this,arguments); const m=S.me; try{ (m.dis||[]).forEach(d=>{ const def=DISEASES[d.id]; if(!def||d.ctrl||def.cure==='auto') return;
  const grave=def.dmg>=8||CANCERS.has(d.id); if(grave&&d.y>=1){ const x=def.dmg>=15?Math.min(4,d.y):Math.min(10,Math.round(d.y*1.3)); st('health',-x); if(d.y===3&&R.chance(.6)) log(d.k===false?'Aquilo que eu sinto está piorando. Já não dá para ignorar.':`${dn(def.n)[0].toUpperCase()+dn(def.n).slice(1)} está piorando sem tratamento.`,'bad'); } }); }catch(e){ cadFalha(e,'Piora anual das doenças'); } return r; })(yearHealth);
// câncer é bem mais difícil de curar
CANCERS.forEach(id=>{ const d=DISEASES[id]; if(d){ if(d.doc) d.doc=Math.round(d.doc*45)/100; if(d.hosp) d.hosp=Math.round(d.hosp*55)/100; } });
// doenças graves: tratamento de vários anos, um ciclo por ano, com risco de morrer mesmo tratando
const LONGOS=new Set([...CANCERS,'tuberculose','hepatite','tumor_cerebral','cirrose']);
function longoTrata(where,dis){const def=DISEASES[dis.id];return !!def&&LONGOS.has(dis.id)&&!['alt','psi','posto'].includes(where)&&dis.k!==false&&!def.ctrl;}
function longoCusto(where,dis){const cancer=CANCERS.has(dis.id);return where==='hosp'?(cancer?14000:8000):(TIERS[where]||TIERS.doc).c+(cancer?6000:2500);}
treat=(o=>function(where,dis){ const m=S.me, def=DISEASES[dis.id];
  if(!longoTrata(where,dis)) return o.apply(this,arguments);
  if(dis.tAno===m.age) return 'O ciclo de tratamento deste ano já foi feito. Volto no ano que vem.';
  const cancer=CANCERS.has(dis.id), nome=dn(def.n), custo=longoCusto(where,dis);
  if(!canPay(custo)) return `O ciclo de tratamento de ${nome} custa ${fmt(custo)}. Não tenho esse dinheiro agora.`;
  m.money-=custo; let aviso='';
  if(dis.tAno!=null&&m.age-dis.tAno>1&&dis.tA>0){ dis.tA=Math.max(0,dis.tA-1); aviso=' Como parei o tratamento, perdi parte do progresso.'; }
  dis.tAno=m.age; dis.tA=(dis.tA||0)+1; dis.tNeed=dis.tNeed||R.int(2,4)+(cancer?1:0);
  if(R.chance(cancer?(where==='hosp'?.04:.07):.02)){ die(`de complicações no tratamento de ${nome}`); return `O corpo não aguentou o tratamento de ${nome}.`; }
  st('health',R.int(5,12));
  if(dis.tA>=dis.tNeed){ if(R.chance(where==='hosp'?.7:where==='doc'?.5:.3)){ m.dis=m.dis.filter(x=>x!==dis); st('happy',20); log(`Depois de ${dis.tA} anos de tratamento, venci ${nome}.`,'good'); return `Depois de ${dis.tA} anos de tratamento, os exames vieram limpos. Venci ${nome}!`; }
    dis.tNeed++; return `Os exames mostraram que ${nome} ainda não acabou. Mais um ano de tratamento.${aviso}`; }
  return `Ano ${dis.tA} de pelo menos ${dis.tNeed} no tratamento de ${nome}.${cancer?' Quimioterapia, enjoo e cabelo no travesseiro.':''}${aviso}`; })(treat);
