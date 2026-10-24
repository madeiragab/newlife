// Testes: poucas provas por nível (provas.js), recuperação, vestibular, redação, minigames da escola e da faculdade
function escolaSelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,erros=[],info={};window.NO_SAVE=true;window.NO_NEWS=true;
  const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=7070; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; };
  let m;
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=EVENTS[id].show(JSON.parse(JSON.stringify(d))); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v));
    sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap); m=S.me; try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); m=S.me; };
  const crianca=(idade,tipo,yr)=>{ newLife({country:'BR'}); m=S.me; m.age=idade; m.born=S.year-idade; m.prison=null; S.pending=[]; startSchool(tipo); m.edu.cur.yr=yr||0; m.edu.cur.grade=50; return m; };
  const responde=(acertar)=>{ let d=S.pending.find(e=>e.id==='esc_quiz').d; S.pending=[]; for(let i=0;i<d.q.length;i++){ const q=d.q[d.r]; EVENTS.esc_quiz.pick(String(acertar?q.ops.indexOf(q.c):q.ops.findIndex(o=>o!==q.c)),d); if(i<d.q.length-1){ d=S.pending.find(e=>e.id==='esc_quiz').d; S.pending=[]; } } };
  try{
    // as provas têm alternativas com a resposta certa
    crianca(9,'fund',3); S.pending=[]; escQuiz('provas'); ok(S.pending.some(e=>e.id==='esc_quiz'),'simulado sem prova');
    const q0=S.pending.find(e=>e.id==='esc_quiz').d.q; ok(q0.length>=2&&q0.every(q=>q.ops.includes(q.c)),'prova sem a resposta certa');
    S.pending=[]; escQuiz('provas'); responde(true); const g1=m.edu.cur.grade; S.pending=[]; m.edu.cur.grade=50; escQuiz('provas'); responde(false); ok(g1>m.edu.cur.grade,'acertar a prova não ajuda mais do que errar'); ok(m.edu.cur.grade>=45,'errar tudo pune demais: '+m.edu.cur.grade);
    // quem estudou descarta alternativa
    m.c.studyYr=1; S.pending=[]; escQuiz('provas'); ok(S.pending[0].d.q.every(q=>q.ops.length<=3&&q.ops.includes(q.c)),'estudar não eliminou alternativa'); m.c.studyYr=0;
    // recuperação sempre ajuda
    m.edu.cur.grade=30; S.pending=[]; escQuiz('recuperacao'); responde(false); ok(m.edu.cur.grade>30,'recuperação não ajudou');
    for(let i=0;i<200;i++){ for(const lv of ['fund1','fund2','medio']){ const q=escConta(lv); ok(q.ops.includes(q.c)&&new Set(q.ops).size===q.ops.length,'conta com alternativas erradas: '+q.t); } }
    // vestibular soma pontos
    crianca(17,'medio',2); const nota0=examScore(m); S.pending=[]; escQuiz('vestibular'); responde(true); ok(examScore(m)>nota0,'vestibular não somou pontos'); info.vestibular=[nota0,examScore(m)];
    crianca(17,'medio',2); for(const t of Object.keys(ESC_TIPOS)){ S.pending=[]; escQuiz(t); const d=S.pending[0].d; todas('esc_quiz',d); todas('esc_quiz',Object.assign({},d,{r:d.q.length-1,ok:1})); }
    todas('esc_redacao',{i:0,e:0,pts:0}); todas('esc_redacao',{i:1,e:1,pts:3}); todas('esc_feira',{}); todas('esc_grupo',{}); todas('esc_recreio',{}); todas('esc_vestibular',{});
    V.career().items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')+String(it.html||'')),'tela da escola: '+(it.l||'')));
    crianca(8,'fund',1); V.career().items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')),'tela do fundamental: '+(it.l||''))); ok(V.career().items.some(it=>it.l==='Desafio da tabuada'),'criança sem tabuada');
    // faculdade
    newLife({country:'BR'}); m=S.me; m.age=21; m.prison=null; m.edu.deg.push('fund','medio'); const curso=COURSES.find(c=>c.id==='dir')||COURSES[0]; m.edu.cur={type:'uni',id:curso.id,n:curso.n,len:5,yr:4,grade:60,cost:0,pub:true};
    S.pending=[]; for(const f of NL_GANCHOS_ANO) f(); ok(S.pending.some(e=>e.id==='esc_tcc'),'último ano sem TCC'); todas('esc_tcc',{e:0}); m.edu.cur.tcc={tema:'x'}; todas('esc_tcc',{e:1});
    let r=''; for(let i=0;i<8&&!m.edu.cur.estagio;i++){ m.yr={}; r=escEstagio(); } ok(m.edu.cur.estagio,'nunca consegue estágio: '+r); ok(!BAD.test(escIC()),'iniciação científica');
    V.career().items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')),'tela da faculdade: '+(it.l||'')));
    m.edu.cur=null; m.edu.deg.push('uni:'+curso.id); const jd=JOBS.find(j=>j.edu&&j.edu.split(/[ |]/).includes('uni:'+curso.id)); if(jd){ takeJob({id:jd.id,co:'Teste',size:'média',mul:1}); ok(m.job.perf>=68,'estágio não contou no primeiro emprego'); }
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; }
  if(erros.length) throw Error('Escola · '+erros.slice(0,8).join(' | ')); return info; }
