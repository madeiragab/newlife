// Testes: desafios de raciocínio de cada área, experiência, especialização, certificações, entrevista e avaliação
function carreiras3SelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,erros=[],info={};window.NO_SAVE=true;window.NO_NEWS=true;
  const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=5150; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; };
  let m;
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=EVENTS[id].show(JSON.parse(JSON.stringify(d))); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v));
    sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap); m=S.me; try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); ok(Number.isFinite(S.me.money),id+'#'+k+' dinheiro'); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); m=S.me; };
  const vida=(job)=>{ newLife({country:'BR'}); m=S.me; m.age=32; m.born=S.year-32; m.prison=null; m.money=300000; S.pending=[]; if(job) takeJob({id:job,co:'Teste',size:'média',mul:1}); return m; };
  try{
    // todas as famílias têm desafio, especialização, certificação e freela
    for(const fk of Object.keys(CAR_FAM)){ ok(CAR_QUIZ[fk]&&QGEN[CAR_QUIZ[fk][0]],'área sem desafio: '+fk); ok(CAR_ESPEC[fk]&&CAR_ESPEC[fk].length===3,'área sem especialização: '+fk); ok(CAR_CERT[fk]&&CAR_CERT[fk].length===2,'área sem certificação: '+fk); ok(CAR_FREELA[fk],'área sem freela: '+fk); ok(CAR_EVS[fk],'área sem eventos: '+fk); }
    // cada gerador sempre tem a resposta certa entre as opções, sem repetição
    for(const [g,f] of Object.entries(QGEN)){ if(g==='tabela') continue; for(let i=0;i<60;i++){ const q=f(); ok(q.ops.includes(q.c),`${g}: resposta fora das opções (${q.t})`); ok(new Set(q.ops).size===q.ops.length&&q.ops.length>=3,`${g}: opções repetidas ou poucas (${q.ops.join('/')})`); ok(!BAD.test(q.t+q.ops.join('')),`${g}: texto ruim ${q.t}`); } }
    const r1=QGEN.troco(); ok(r1.c===fmt(+r1.t.match(/pagou com \$?([\d.]+)/)[1].replace(/\./g,'')-+r1.t.match(/deu \$?([\d.]+)/)[1].replace(/\./g,'')),'troco errado: '+r1.t+' → '+r1.c);
    // desafio do dia: acertar tudo rende mais do que errar tudo
    vida('cont'); const per0=m.job.perf; carQuizNovo(); ok(S.pending[0]&&S.pending[0].id==='car_quiz','desafio não abriu'); let d=S.pending[0].d; for(let i=0;i<3;i++){ S.pending=[]; const q=d.q[d.r]; EVENTS.car_quiz.pick(String(q.ops.indexOf(q.c)),d); if(i<2) d=S.pending[0].d; } const acertou=m.job.perf;
    vida('cont'); carQuizNovo(); d=S.pending[0].d; for(let i=0;i<3;i++){ S.pending=[]; const q=d.q[d.r]; EVENTS.car_quiz.pick(String(q.ops.findIndex(o=>o!==q.c)),d); if(i<2) d=S.pending[0].d; } ok(acertou>m.job.perf&&acertou>per0,'acertar o desafio não ajuda'); ok(m.job.adv>=1,'errar tudo não deu advertência');
    for(const fk of Object.keys(CAR_FAM)){ const id=Object.keys(CAR_JOB_FAM).find(k=>CAR_JOB_FAM[k]===fk); vida(); if(SPECIAL[id]) m.job={spc:id,lvl:1,perf:60,yrs:3,co:'Teste'}; else takeJob({id,co:'Teste',size:'média',mul:1});
      const dd=EVENTS.car_quiz.prep(m); todas('car_quiz',dd); todas('car_quiz',Object.assign({},dd,{r:2,pts:4})); todas('car_espec',{}); ok(!BAD.test(carFreela()),'freela: '+fk); const v=V.jobMenu(); v.items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')+String(it.html||'')),'tela '+fk+': '+(it.l||''))); }
    // experiência na área faz entrar num cargo mais alto
    vida(); m.carExp={tec:5}; takeJob({id:'prog',co:'Teste',size:'média',mul:1}); ok(m.job.lvl===1,'experiência não contou na contratação');
    // certificação: prova aprovada aumenta o salário
    vida('prog'); const sal0=jobSalary(m.job); S.pending=[]; carCertIniciar(0); ok(S.pending[0]&&S.pending[0].d.modo==='cert','certificação não abriu a prova'); ok(/Aprovad/.test(carCertFim(CAR_CERT.tec[0],6)),'certificação não aprovou'); ok(jobSalary(m.job)>sal0,'certificação não aumentou o salário'); ok(/reprovei/.test(carCertFim(CAR_CERT.tec[1],2)),'certificação aprovou com nota baixa');
    // promoção por mérito vira entrevista
    vida('prog'); m.job.perf=95; m.job.lvlYrs=2; S.pending=[]; const lv=m.job.lvl; careerYear(m.job,JOBS.find(q=>q.id==='prog')); ok(m.job.lvl===lv&&S.pending.some(e=>e.id==='car_entrevista'),'promoção não passou pela entrevista'); todas('car_entrevista',{});
    ok(/promovid/.test(carEntrevistaFim(6)),'entrevista perfeita não promoveu'); ok(m.job.lvl===lv+1,'nível não subiu');
    vida('prog'); todas('car_avaliacao',{}); m.job.esp=null; m.job.yrs=4; m.job.lvl=1;
    vida('prog'); m.job.yrs=4; m.job.lvl=1; let viu=0; for(let i=0;i<20;i++){ S.pending=[]; m.yr={}; yearWork(); if(S.pending.some(e=>e.id==='car_espec')) viu++; if(!m.job) break; } ok(viu>0,'especialização nunca é oferecida');
    info.ok=true;
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; }
  if(erros.length) throw Error('Carreiras 3 · '+erros.slice(0,8).join(' | ')); return info; }
