// ===== Vida escolar e faculdade: semana de provas todo ano, recuperação, vestibular, redação, minigames fáceis,
// TCC, estágio e iniciação científica. Tudo de múltipla escolha, com ajuda para quem estudou: o jogo é para ser leve.
const escCur=m=>m.edu&&m.edu.cur;
const escEscola=c=>!!c&&(c.type==='fund'||c.type==='medio');
// perguntas de conta sempre com alternativas
function escConta(nivel){ let t,c;
  if(nivel==='fund1'){ const k=R.int(0,2), a=R.int(2,12), b=R.int(2,12); if(k===0){ t=`Quanto é ${a} + ${b}?`; c=a+b; } else if(k===1){ const x=a+b; t=`Quanto é ${x} − ${b}?`; c=a; } else { t=`Quanto é ${a} × ${Math.min(b,10)}?`; c=a*Math.min(b,10); } }
  else if(nivel==='fund2'){ const k=R.int(0,2); if(k===0){ const v=R.pick([20,40,50,80,100,200]), p=R.pick([10,25,50]); t=`Quanto é ${p}% de ${v}?`; c=v*p/100; } else if(k===1){ const x=R.int(2,9), b=R.int(1,9); t=`Se x + ${b} = ${x+b}, quanto vale x?`; c=x; } else { const a=R.int(2,9); t=`Qual é a área de um quadrado de lado ${a}?`; c=a*a; } }
  else { const k=R.int(0,2); if(k===0){ const x=R.int(2,9), a=R.int(2,5), b=R.int(1,9); t=`Resolva: ${a}x + ${b} = ${a*x+b}`; c=x; } else if(k===1){ const v=R.int(2,9)*100, p=R.pick([10,20,30]); t=`Um tênis de ${v} reais teve ${p}% de desconto. Por quanto sai?`; c=v-v*p/100; } else { const b=R.int(3,9), h=R.int(2,8)*2; t=`Qual é a área de um triângulo de base ${b} e altura ${h}?`; c=b*h/2; } }
  const er=[...new Set([c+1,c-1,c+2,c+10,c*2,c+3].filter(x=>x>=0&&x!==c))]; return {t:'(matemática) '+t,ops:R.shuffle([String(c)].concat(R.shuffle(er).slice(0,3).map(String))),c:String(c)}; }
function escPergunta(m,nivel){ if(nivel!=='uni'&&nivel!=='oab'&&R.chance(.3)) return escConta(nivel);
  const lv=QUIZ[nivel]?nivel:'medio', qi=quizPick(m,lv), q=QUIZ[lv][qi]; return {t:`(${q[0]}) ${q[1]}`,ops:R.shuffle(q.slice(2,6)),c:q[2]}; }
// quem estudou no ano (ou é muito inteligente) elimina uma alternativa errada
function escAjuda(m,q){ const tira=(m.c.studyYr>0?1:0)+(m.smarts>=75?1:0); let ops=q.ops.slice(); for(let i=0;i<tira&&ops.length>2;i++){ const er=ops.filter(o=>o!==q.c); ops.splice(ops.indexOf(R.pick(er)),1); } return Object.assign({},q,{ops,ajuda:tira}); }
function escNivel(m,tipo){ const c=escCur(m); if(tipo==='vestibular') return 'medio'; if(!c) return 'fund1'; if(c.type==='fund') return c.yr<5?'fund1':'fund2'; if(c.type==='medio') return 'medio'; if(tipo==='tabuada') return 'fund1'; return 'uni'; }
const ESC_TIPOS={provas:['📝','Semana de provas',3],recuperacao:['🛟','Prova de recuperação',3],vestibular:['🎓','Vestibular',5],tabuada:['🔢','Desafio da tabuada',3],tcc:['📚','Defesa do TCC',3],seminario:['🎤','Seminário',2]};
function escQuiz(tipo,extra){ const m=S.me, n=ESC_TIPOS[tipo][2], lv=escNivel(m,tipo), qs=[];
  for(let i=0;i<n;i++) qs.push(escAjuda(m,tipo==='tabuada'?escConta(R.chance(.5)?'fund1':'fund2'):escPergunta(m,lv)));
  queue('esc_quiz',Object.assign({tipo,q:qs,r:0,ok:0},extra||{})); return ''; }
EVENTS.esc_quiz={when:m=>!m.prison,
  prep:m=>{ const qs=[0,1,2].map(()=>escPergunta(m,escNivel(m,'provas'))); return {tipo:'provas',q:qs,r:0,ok:0}; },
  show:d=>{ const T=ESC_TIPOS[d.tipo]||ESC_TIPOS.provas, q=d.q[d.r]; return {k:'Estudos',t:`${T[0]} ${T[1]} · questão ${d.r+1} de ${d.q.length}`,x:q.t+(q.ajuda?'\n\n(Como estudei, já consegui descartar alternativa errada.)':''),ch:q.ops.map((o,i)=>[o,String(i)])}; },
  pick:(k,d)=>{ const q=d.q[d.r], certo=q.ops[+k]===q.c, ok=d.ok+(certo?1:0); const t=certo?R.pick(['Certo!','Acertei.','Essa eu sabia!']):`Errei. Era "${q.c}".`;
    if(d.r<d.q.length-1){ queue('esc_quiz',Object.assign({},d,{r:d.r+1,ok})); return t; }
    return t+' '+escQuizFim(d.tipo,ok,d.q.length,d); }};
function escQuizFim(tipo,ok,n,d){ const m=S.me, c=escCur(m); let t=`Acertei ${ok} de ${n}.`; cnt('acertos'); m.c.provasFeitas=(m.c.provasFeitas||0)+1;
  if(tipo==='provas'){ const g=[-2,2,6,10][ok]; if(c){ c.grade=clamp(c.grade+g); (c.provas=c.provas||[]).push(Math.round(ok/n*10)); } st('happy',ok>=2?4:-2); if(ok===3) st('smarts',1); return t+(ok===3?' Nota 10 no boletim!':ok===2?' Nota boa.':ok===1?' Passou raspando.':' Nota baixa, mas dá para recuperar.'); }
  if(tipo==='recuperacao'){ const g=[3,6,11,16][ok]; if(c){ c.grade=clamp(c.grade+g); c.recAno=S.year; } st('happy',3); return t+` A recuperação subiu a minha nota em ${g} pontos.`; }
  if(tipo==='tabuada'){ if(c) c.grade=clamp(c.grade+ok*2); if(ok===3) st('smarts',1); st('happy',ok>=2?3:0); return t+(ok===3?' Ganhei uma estrelinha dourada no caderno.':' A professora gostou do esforço.'); }
  if(tipo==='vestibular'){ m.c.vestBonus=ok*2; m.c.vestFeito=1; log(`Fiz o vestibular e acertei ${ok} de ${n} questões.`,ok>=3?'good':''); st('happy',ok>=3?8:2); return t+` Isso soma ${ok*20} pontos na minha nota do vestibular.`; }
  if(tipo==='tcc'){ const g=[2,5,9,14][ok]; if(c) c.grade=clamp(c.grade+g); if(ok===3){ m.c.louvor=1; log('Defendi o TCC e fui aprovad'+oa()+' com louvor.','good'); return t+' A banca me aprovou com louvor!'; } log('Defendi o TCC e fui aprovad'+oa()+'.','good'); return t+' TCC aprovado.'; }
  if(tipo==='seminario'){ if(c) c.grade=clamp(c.grade+ok*4); const cs=people('colega'); cs.forEach(p=>p.bond=clamp(p.bond+(ok?2:0))); return t+(ok===2?' A turma aplaudiu.':ok===1?' Foi bem.':' Gaguejei um pouco, mas terminei.'); }
  return t; }
examScore=(o=>function(m){ m=m||S.me; return Math.round(clamp(o.apply(this,arguments)+Math.min(10,m.c.vestBonus||0)+Math.min(6,m.c.redacao||0)+Math.min(4,(m.c.feira||0)*2))); })(examScore);
// ---------- minigames da escola ----------
const ESC_REDACAO=[['O impacto das redes sociais na vida dos jovens',['As redes aproximam pessoas, mas o uso sem limite prejudica a saúde mental e exige educação digital.','Redes sociais são muito legais e todo mundo usa.','Eu não gosto de redes sociais.']],
  ['Os desafios da mobilidade nas grandes cidades',['O transporte público de qualidade é a chave para reduzir trânsito, poluição e desigualdade.','O trânsito é chato.','Todo mundo deveria ter carro.']],
  ['A importância da leitura na formação do cidadão',['A leitura amplia o repertório, desenvolve o senso crítico e precisa ser incentivada desde a infância.','Ler é bom.','Livro é caro e chato.']],
  ['O combate ao desperdício de alimentos',['Reduzir o desperdício exige mudanças no varejo, nas casas e no poder público, e combate a fome.','Não se deve jogar comida fora.','A comida é muito cara hoje em dia.']]];
EVENTS.esc_redacao={when:m=>escEscola(escCur(m))&&!m.prison,
  prep:()=>({i:R.int(0,ESC_REDACAO.length-1),e:0,pts:0}),
  show:d=>{ const R0=ESC_REDACAO[d.i]; if(d.e===1) return {k:'Estudos',t:'✍️ Redação · estrutura',x:'Como vou organizar o texto?',ch:[['Introdução, dois argumentos e conclusão com proposta','0'],['Escrever tudo num parágrafo só','1'],['Começar pela conclusão e ver no que dá','2']]};
    return {k:'Estudos',t:'✍️ Redação · tese',x:`Tema: "${R0[0]}". Qual vai ser a minha tese?`,ch:R.shuffle(R0[1].map((t,i)=>[t,String(i)]))}; },
  pick:(k,d)=>{ const m=S.me, c=escCur(m), boa=k==='0'; const pts=d.pts+(boa?3:1);
    if(d.e!==1){ queue('esc_redacao',{i:d.i,e:1,pts}); return boa?'Boa tese: clara e com proposta.':'Dá para escrever, mas a tese ficou fraca.'; }
    const nota=Math.min(10,pts+(m.smarts>=60?2:1)+(m.talent.writing>=50?1:0)); m.c.redacao=Math.max(m.c.redacao||0,Math.round(nota*.6)); if(c) c.grade=clamp(c.grade+Math.round(nota/2));
    return `Nota da redação: ${nota} de 10.${nota>=8?' A professora leu em voz alta para a turma.':''}`; }};
const ESC_FEIRA=[['Vulcão de bicarbonato','fácil, todo mundo faz',.85,1],['Horta que se rega sozinha','médio, bem útil',.65,2],['Robô que separa o lixo','difícil, impressiona',.45,3],['Estudo da água do rio do bairro','médio, ciência de verdade',.6,2]];
EVENTS.esc_feira={when:m=>escEscola(escCur(m))&&m.age>=9&&!m.prison,show:()=>({k:'Escola',t:'🔬 Feira de ciências',x:'A feira de ciências é daqui a um mês. Qual projeto eu faço?',ch:ESC_FEIRA.map((f,i)=>[`${f[0]} (${f[1]})`,String(i)])}),
  pick:k=>{ const m=S.me, c=escCur(m), f=ESC_FEIRA[+k]; const p=Math.min(.95,f[2]+m.smarts/250+(m.c.studyYr?.08:0));
    if(R.chance(p)){ const lugar=f[3]===3&&R.chance(.6)?1:f[3]>=2&&R.chance(.5)?2:3; if(c) c.grade=clamp(c.grade+3+f[3]*2); m.c.feira=(m.c.feira||0)+1; st('happy',6+f[3]); if(lugar===1) log(`Ganhei a feira de ciências com o projeto "${f[0]}".`,'good');
      return lugar===1?'Primeiro lugar! Saiu foto no jornal da escola.':`Fiquei em ${lugar}º lugar. Ganhei um certificado.`; }
    if(c) c.grade=clamp(c.grade+1); st('happy',-1); return 'O projeto deu um probleminha na hora, mas os jurados elogiaram a ideia.'; }};
EVENTS.esc_grupo={when:m=>escEscola(escCur(m))&&m.age>=8&&!m.prison,show:()=>({k:'Escola',t:'👥 Trabalho em grupo',x:'A professora dividiu a turma em grupos. Qual vai ser o meu papel?',ch:[['Liderar e dividir as tarefas','lider'],['Fazer a pesquisa','pesquisa'],['Montar a apresentação','apresenta'],['Deixar os outros fazerem','folga']]}),
  pick:k=>{ const m=S.me, c=escCur(m), cs=people('colega');
    if(k==='folga'){ cs.forEach(p=>p.bond=clamp(p.bond-4)); if(c) c.grade=clamp(c.grade+1); return 'O grupo tirou nota boa, mas ninguém quer mais fazer trabalho comigo.'; }
    const g={lider:5,pesquisa:4,apresenta:4}[k]; if(c) c.grade=clamp(c.grade+g); cs.forEach(p=>p.bond=clamp(p.bond+(k==='lider'?3:2))); if(k==='pesquisa') st('smarts',1); if(k==='apresenta') st('looks',0);
    return {lider:'Organizei tudo e o grupo tirou a maior nota da turma.',pesquisa:'Achei informações que ninguém tinha. O grupo me agradeceu.',apresenta:'Apresentei sem gaguejar. A professora elogiou.'}[k]; }};
EVENTS.esc_recreio={when:m=>escEscola(escCur(m))&&!m.prison,show:()=>({k:'Escola',t:'🔔 Recreio',x:'Bateu o sinal do recreio. O que eu faço?',ch:[['Jogar bola na quadra','bola'],['Conversar com a turma','papo'],['Ir à biblioteca','bib'],['Ficar no meu canto','canto']]}),
  pick:k=>{ const m=S.me, cs=people('colega');
    if(k==='bola'){ st('health',2); st('happy',4); m.talent.athletic=clamp((m.talent.athletic||0)+1); return 'Fiz um gol de bicicleta. Ou quase.'; }
    if(k==='papo'){ cs.forEach(p=>p.bond=clamp(p.bond+3)); st('happy',4); return 'Rimos até a barriga doer.'; }
    if(k==='bib'){ st('smarts',1); return 'Li um capítulo inteiro de um livro de mistério.'; }
    st('happy',1); return 'Fiquei ouvindo música. Às vezes é bom ficar sozinh'+oa()+'.'; }};
// ---------- faculdade ----------
const ESC_TCC_TEMAS=['Um estudo de caso na minha cidade','Uma revisão de tudo que já se escreveu sobre o tema','Uma pesquisa de campo com entrevistas','Um projeto prático, do zero'];
EVENTS.esc_tcc={when:m=>{ const c=escCur(m); return !!c&&c.type==='uni'&&!m.prison; },
  show:d=>d.e===1?{k:'Faculdade',t:'📚 TCC · orientador',x:'Quem vai me orientar?',ch:[['O professor exigente, que cobra muito','exige'],['A professora tranquila, sempre disponível','calma'],['Vou me virar quase sozinh'+oa(),'so']]}
    :{k:'Faculdade',t:'📚 TCC · tema',x:'Último ano da faculdade: hora de escolher o tema do trabalho de conclusão.',ch:ESC_TCC_TEMAS.map((t,i)=>[t,String(i)])},
  pick:(k,d)=>{ const m=S.me, c=escCur(m); if(!c) return '';
    if(d.e!==1){ c.tcc={tema:ESC_TCC_TEMAS[+k]}; queue('esc_tcc',{e:1}); return 'Tema escolhido. Agora preciso de um orientador.'; }
    c.tcc=c.tcc||{}; c.tcc.ori=k; if(k==='exige') st('smarts',2); if(k==='calma') st('happy',3); if(k==='so') st('happy',-2);
    escQuiz('tcc'); return {exige:'Ele devolveu o texto todo riscado três vezes. Ficou ótimo.',calma:'Ela respondeu todas as minhas dúvidas. Escrevi com tranquilidade.',so:'Escrevi madrugada adentro, do meu jeito.'}[k]+' Chegou o dia da defesa.'; }};
function escEstagio(){ const m=S.me, c=escCur(m); if(!c||c.type!=='uni') return ''; if(c.estagio) return 'Já faço estágio.'; if(c.yr<1) return 'Os estágios aceitam a partir do 2º ano.'; if(use('esc_estagio')>1) return 'Já mandei currículos demais este ano.';
  if(R.chance(.55+m.smarts/250+(c.grade-50)/200)){ c.estagio=1; m.c.estagioCurso=c.id; st('happy',6); log(`Consegui um estágio na área de ${c.n}.`,'good'); return 'Fui aprovad'+oa()+' na entrevista! Começo o estágio na segunda: experiência e uma bolsa todo mês.'; }
  st('happy',-2); return 'Não passei desta vez, mas o recrutador disse para eu tentar de novo.'; }
function escIC(){ const m=S.me, c=escCur(m); if(!c||c.type!=='uni') return ''; if(c.ic) return 'Já faço iniciação científica.'; if(use('esc_ic')>1) return 'Já tentei este ano.';
  if(R.chance(.5+m.smarts/200)){ c.ic=1; m.c.ic=1; st('smarts',2); log('Entrei na iniciação científica.','good'); return 'Um professor me aceitou no laboratório. Bolsa, artigo e muito café.'; } return 'Não abriram vagas este semestre. Tento no próximo.'; }
takeJob=(o=>function(oo){ const m=S.me; const r=o.apply(this,arguments); const j=m.job, d=j&&!j.spc&&JOBS.find(x=>x.id===j.id);
  if(d&&m.c.estagioCurso&&d.edu&&d.edu.split(/[ |]/).some(e=>e==='uni:'+m.c.estagioCurso)&&!m.c.estagioUsado){ m.c.estagioUsado=1; j.perf=Math.max(j.perf,68); log('O estágio da faculdade contou: comecei o emprego já sabendo o serviço.','good'); }
  return r; })(takeJob);
// ---------- ano a ano ----------
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m||!m.alive||m.prison||S.scen) return; const c=escCur(m); if(!c) return;
  if(m.age>=7) escQuiz('provas',{rotina:1});
  if(c.type==='medio'&&c.yr>=c.len-1&&!m.c.vestFeito) queue('esc_vestibular',{});
  if(c.type==='uni'&&c.yr>=c.len-1&&!c.tcc) queue('esc_tcc',{e:0});
  if(c.estagio) m.money+=R.int(7000,12000);
  if(c.ic){ m.money+=4000; st('smarts',1); } });
EVENTS.esc_vestibular={when:m=>{ const c=escCur(m); return !!c&&c.type==='medio'&&!m.prison; },show:()=>({k:'Estudos',t:'🎓 Dia do vestibular',x:'Chegou o grande dia: cinco questões que contam pontos para entrar na faculdade. Fiz a minha parte durante o ano.',ch:[['Fazer a prova','vai'],['Ainda não estou pront'+oa()+': faço no ano que vem','nao']]}),
  pick:k=>{ const m=S.me; if(k==='nao'){ return 'Vou me preparar mais e fazer depois.'; } escQuiz('vestibular'); return 'Caneta preta, documento e coragem.'; }};
// ---------- tela de estudos ----------
V.career=(o=>function(){ const r=o.apply(this,arguments), m=S.me, c=escCur(m); if(!c||m.prison||!r||!r.items) return r;
  const i=r.items.findIndex(x=>x.l==='Estudar mais'); if(i<0) return r; const add=[];
  const pr=c.provas||[]; const media=(c.grade/10).toFixed(1).replace('.',','); const risco=escEscola(c)&&c.grade<40;
  add.push({html:`<div class="card">${kv('Média',media)}${pr.length?kv('Provas deste curso',pr.slice(-6).join(' · ')):''}${kv('Situação',risco?'Em risco: faça a recuperação':c.grade>=70?'Indo muito bem':'Tranquil'+oa())}<p style="color:var(--muted);font-size:13px">Estudar durante o ano elimina alternativas erradas nas provas. Todo ano tem semana de provas; com média baixa, dá para fazer recuperação.</p></div>`});
  add.push({sec:'Minigames'});
  const A=(ic,l,s,fn,extra)=>add.push(Object.assign({ic,l,s,on:()=>act(fn,l)},extra||{}));
  A('📝','Fazer um simulado','3 questões · sobe a nota',()=>{ if(use('esc_sim')>2) return 'Já fiz simulados demais este ano.'; return escQuiz('provas'); });
  if(c.grade<55) A('🛟','Prova de recuperação','3 questões · sempre ajuda a nota',()=>{ if(c.recAno===S.year) return 'Já fiz a recuperação este ano.'; return escQuiz('recuperacao'); },{tone:'bad'});
  if(escEscola(c)){
    if(c.type==='fund'&&c.yr<6) A('🔢','Desafio da tabuada','Contas rápidas, com alternativas',()=>{ if(use('esc_tab')>2) return 'Chega de conta por hoje!'; return escQuiz('tabuada'); });
    if(m.age>=12) A('✍️','Treinar redação','Conta pontos no vestibular',()=>{ if(use('esc_red')>1) return 'Já escrevi redações demais este ano.'; queue('esc_redacao',EVENTS.esc_redacao.prep()); return ''; });
    if(m.age>=9) A('🔬','Feira de ciências','Escolha um projeto · medalha conta no vestibular',()=>{ if(use('esc_feira')>0) return 'Só tem uma feira por ano.'; queue('esc_feira',{}); return ''; });
    if(m.age>=8) A('👥','Trabalho em grupo','Nota e amizades',()=>{ if(use('esc_grupo')>1) return 'Já fiz trabalhos em grupo demais.'; queue('esc_grupo',{}); return ''; });
    A('🔔','Recreio','Bola, papo, biblioteca',()=>{ if(use('esc_rec')>2) return 'O recreio acabou.'; queue('esc_recreio',{}); return ''; });
    if(c.type==='medio'&&!m.c.vestFeito) A('🎓','Fazer o vestibular agora','5 questões · soma pontos para a faculdade',()=>{ queue('esc_vestibular',{manual:1}); return ''; });
  } else {
    A('🎤','Apresentar um seminário','2 questões · nota e turma',()=>{ if(use('esc_sem')>1) return 'Já apresentei seminários demais este semestre.'; return escQuiz('seminario'); });
    if(c.type==='uni'){ A('💼','Procurar estágio',c.estagio?'Já faço estágio':'A partir do 2º ano · bolsa e experiência',escEstagio); A('🔬','Iniciação científica',c.ic?'Já faço':'Bolsa e inteligência',escIC); if(c.yr>=c.len-1&&!c.tcc) A('📚','Começar o TCC','Tema, orientador e defesa',()=>{ queue('esc_tcc',{e:0}); return ''; }); }
  }
  r.items.splice(i+1,0,...add); return r; })(V.career);
// ---------- eventos da vida escolar e universitária ----------
pack({k:'Escola',w:1.1,cd:5,max:17,when:m=>escEscola(escCur(m))&&!m.prison},[
  ['Excursão','A turma vai fazer uma excursão ao museu.',['Ir e prestar atenção|sm+2 h+5|Aprendi mais num dia do que num mês de aula.','Ir e bagunçar no ônibus|h+8 grade-2|Melhor viagem da vida. A professora não achou.']],
  ['Professor novo','Chegou um professor novo de matemática, que explica tudo com jogos.',['Participar das aulas|sm+2 grade+4|Matemática virou a minha matéria favorita.','Continuar no fundão|h+1|Fundão é fundão.']],
  ['Bilhete na mochila','Alguém deixou um bilhete fofo na sua mochila, sem assinatura.',['Tentar descobrir quem foi|?lk h+6|Descobri, e foi recíproco.|h-2|Nunca descobri.','Guardar o bilhete|h+3|Guardei no caderno.']],
  ['Gincana','A escola organizou uma gincana entre as turmas.',['Me dedicar à gincana|h+7 grade+1|Minha turma ganhou!','Assistir de longe|h+1|Torci da arquibancada.']],
  ['Celular confiscado','O professor pegou seu celular durante a aula.',['Pedir desculpas|grade+1 h-2|Devolveu no fim da aula.','Discutir|grade-3 h-4|Só devolveu para os meus pais.']],
  ['Festa junina','Vai ter festa junina na escola.',['Dançar a quadrilha|h+6|Fui o par mais animado da festa.','Ficar na barraca de comida|h+4|Comi pamonha até passar mal.']],
]);
pack({k:'Faculdade',w:1.1,cd:5,min:17,when:m=>{ const c=escCur(m); return !!c&&c.type==='uni'&&!m.prison; }},[
  ['Calourada','A atlética organizou a festa dos calouros.',['Ir e conhecer todo mundo|h+8 hl-2|Fiz amigos para a vida toda.','Ficar em casa estudando|grade+3|O veterano me chamou de nerd.']],
  ['Atlética','A atlética do curso precisa de gente para os jogos universitários.',['Entrar no time|h+6 hl+2|Ganhamos o campeonato e a festa durou três dias.','Torcer da arquibancada|h+3|Gritei até ficar rouc{o}.']],
  ['Greve na universidade','Os professores entraram em greve.',['Apoiar e estudar sozinh{o}|sm+2 grade+2|Aproveitei para adiantar matéria.','Aproveitar as férias forçadas|h+6 grade-2|Voltei enferrujad{o}.']],
  ['Professor carrasco','Um professor famoso por reprovar meia turma dá aula este semestre.',['Estudar desde o primeiro dia|sm+2 grade+5|Fui um dos poucos aprovados com nota alta.','Torcer para dar certo|?50 grade+1|Passei raspando.|grade-5|Fiquei para a recuperação.']],
  ['Intercâmbio','Abriu um edital de intercâmbio de seis meses na Europa.',['Me inscrever|?sm h+10 sm+3|Fui aprovad{o}! Seis meses estudando fora.|h-2|Não fui selecionad{o} desta vez.','Ficar|h+0|Agora não.']],
  ['República','Uns colegas chamam você para morar numa república perto da faculdade.',['Topar|h+6 $-v|Bagunça, amizade e louça sempre suja.','Continuar onde estou|h+0|Prefiro meu canto.'],{v:[300,1500]}],
]);
