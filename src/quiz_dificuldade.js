// ===== Perguntas seguem a dificuldade do jogo: Fácil mostra 2 alternativas e perguntas mais simples; Normal mostra 3; Difícil, todas =====
const difNivel=()=>(S&&S.flags&&S.flags.diff)||'normal';
const QUIZ_MAX_OPS={facil:2,normal:3,dificil:4};
const QUIZ_DESCE={uni:'medio',medio:'fund2',fund2:'fund1'};
// perguntas mais simples nos níveis fácil e normal
function difNivelPergunta(lv){ const d=difNivel(); if(d==='facil'&&QUIZ_DESCE[lv]&&QUIZ[QUIZ_DESCE[lv]]) return QUIZ_DESCE[lv]; if(d==='normal'&&lv==='uni'&&QUIZ.medio&&R.chance(.5)) return 'medio'; return lv; }
for(const id of Object.keys(EVENTS)){ const ev=EVENTS[id]; if(!ev||!ev.prep||!/_q$/.test(id)) continue; const p0=ev.prep;
  ev.prep=function(m){ const d=p0.apply(this,arguments); if(d&&d.lv&&d.lv!=='oab'){ const nl=difNivelPergunta(d.lv); if(nl!==d.lv){ d.lv=nl; d.qi=quizPick(m,nl); } } return d; }; }
escPergunta=(o=>function(m,nivel){ return o.call(this,m,nivel==='oab'?nivel:difNivelPergunta(nivel)); })(escPergunta);
const qiNum=v=>typeof v==='object'?v.qi:v;
// menos alternativas: a certa sempre fica, as erradas são sorteadas
function quizCortar(ch,certa,extra){ const max=QUIZ_MAX_OPS[difNivel()]||4; const resp=ch.filter(c=>!extra.includes(c[1])), outras=ch.filter(c=>extra.includes(c[1])); if(resp.length<=max) return ch;
  const ok=resp.filter(c=>certa(c)), er=R.shuffle(resp.filter(c=>!certa(c))).slice(0,Math.max(0,max-ok.length)); const keep=new Set(ok.concat(er)); return resp.filter(c=>keep.has(c)).concat(outras); }
for(const id of Object.keys(EVENTS)){ const ev=EVENTS[id]; if(!ev||!ev.show) continue;
  if(/_q$/.test(id)){ const s0=ev.show; ev.show=function(d){ const r=s0.apply(this,arguments); if(r&&r.ch&&d&&d.go!==undefined||r&&r.ch&&r.ch.some(c=>/^a\d$/.test(c[1]))){ if(!d._ops||d._opsDif!==difNivel()){ d._opsDif=difNivel(); d._ops=quizCortar(r.ch,c=>c[1]==='a0',['c','go','f','d']).map(c=>c[1]); } r.ch=r.ch.filter(c=>d._ops.includes(c[1])||!/^a\d$/.test(c[1])); } return r; }; }
  if(id==='esc_quiz'||id==='car_quiz'){ const s0=ev.show; ev.show=function(d){ const r=s0.apply(this,arguments); try{ const q=d.q[d.r]; if(!q._dif||q._difN!==difNivel()){ q._difN=difNivel(); q._dif=quizCortar(r.ch,c=>q.ops[+c[1]]===q.c,['auto']).map(c=>c[1]); } r.ch=r.ch.filter(c=>q._dif.includes(c[1])||c[1]==='auto'); }catch(e){} return r; }; } }
function quizDificuldadeSelfTest(){ const s0=S,ns=window.NO_SAVE; window.NO_SAVE=true; const erros=[]; try{
    for(const [dif,max] of [['facil',2],['normal',3],['dificil',4]]){ newLife({country:'BR'}); S.flags.diff=dif; const m=S.me; m.age=16; m.born=S.year-16; startSchool('medio'); S.pending=[];
      escQuiz('provas'); const d=S.pending.find(e=>e.id==='esc_quiz').d; for(let r=0;r<3;r++){ const sh=EVENTS.esc_quiz.show(Object.assign(d,{r})); const resp=sh.ch.filter(c=>c[1]!=='auto'); if(resp.length>max) erros.push(`${dif}: ${resp.length} alternativas`); if(!resp.some(c=>d.q[r].ops[+c[1]]===d.q[r].c)) erros.push(`${dif}: resposta certa sumiu`); }
      const ev=EVENTS.prova_q; if(ev){ const dd=ev.prep(m); if(dd){ dd.go=1; const sh=ev.show(dd); const resp=sh.ch.filter(c=>/^a\d$/.test(c[1])); if(resp.length>max) erros.push(`${dif} prova: ${resp.length}`); if(!resp.some(c=>c[1]==='a0')) erros.push(`${dif} prova sem a certa`); } } }
  }catch(e){ erros.push(e.message); } finally{ S=s0; window.NO_SAVE=ns; } if(erros.length) throw Error('Dificuldade das perguntas · '+erros.slice(0,6).join(' | ')); return {ok:true}; }
