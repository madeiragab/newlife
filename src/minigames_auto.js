// ===== Minigames opcionais: quem quer avançar rápido pelos anos resolve pelo nível do personagem.
// Configuração "Minigames da rotina": perguntar sempre, ou resolver sozinho o que chega todo ano (provas, vestibular, entrevista).
// Em qualquer minigame de perguntas, a primeira tela também oferece "Resolver pelo meu nível". Jogar de verdade rende mais. =====
const autoMini=()=>!!(typeof META!=='undefined'&&META&&META.autoMini);
// chance de acerto automática: boa, mas abaixo do que um jogador atento consegue
function autoChance(m){ return Math.max(.3,Math.min(.75,.35+m.smarts/250+(m.c.studyYr?.12:0))); }
function autoAcertos(n,m){ let ok=0; for(let i=0;i<n;i++) if(R.chance(autoChance(m))) ok++; return ok; }
function autoResolver(id,d){ const m=S.me;
  if(id==='esc_quiz'){ const n=(d.q||[]).length||3, ok=autoAcertos(n,m); return 'No automático: '+escQuizFim(d.tipo||'provas',ok,n,d); }
  if(id==='car_quiz'){ const ok=autoAcertos(3,m)*2; if(d.modo==='cert') return 'No automático: '+carCertFim(d.cert,ok); if(d.modo==='entrevista') return 'No automático: '+carEntrevistaFim(ok); return 'No automático: '+carFimDia(ok); }
  if(id==='car_dia'){ const pts=autoAcertos(3,m)*2-1; return 'No automático: '+carFimDia(Math.max(0,pts)); }
  if(id==='car_entrevista'){ return 'No automático: '+carEntrevistaFim(autoAcertos(3,m)*2); }
  if(id==='esc_vestibular'){ const ok=autoAcertos(5,m); return 'No automático: '+escQuizFim('vestibular',ok,5,{}); }
  return ''; }
// o que chega sozinho todo ano pode ser resolvido sem parar o jogo
const AUTO_ROTINA=new Set(['esc_quiz','car_entrevista','esc_vestibular']);
queue=(o=>function(id,d){ if(autoMini()&&AUTO_ROTINA.has(id)&&S&&S.me&&S.me.alive&&!(d&&(d.r||d.manual))&&(id!=='esc_quiz'||(d&&d.rotina))){ try{ const r=autoResolver(id,d||{}); if(r){ log(r); return; } }catch(e){} } return o.apply(this,arguments); })(queue);
// "Resolver pelo meu nível" na primeira tela dos minigames de perguntas
for(const id of ['esc_quiz','car_quiz','car_dia']){ const ev=EVENTS[id]; if(!ev) continue; const sh0=ev.show, pk0=ev.pick;
  ev.show=function(d){ const r=sh0.apply(this,arguments); if(r&&r.ch&&d&&!d.r&&!r.ch.some(c=>c[1]==='auto')) r.ch=r.ch.concat([['⚡ Resolver pelo meu nível','auto']]); return r; };
  ev.pick=function(k,d){ if(k==='auto') return autoResolver(id,d||{}); return pk0.apply(this,arguments); }; }
// configuração
V.configuracoes=(o=>function(){ const r=o.apply(this,arguments); if(!r||!r.items) return r; const i=r.items.findIndex(x=>x.sec==='Histórico de vidas');
  r.items.splice(i>=0?i:r.items.length,0,{sec:'Minigames'},{ic:'⚡',l:'Minigames da rotina',s:autoMini()?'Automáticos: provas, vestibular e entrevistas se resolvem pelo nível do personagem':'Perguntar sempre: eu respondo as provas, o vestibular e as entrevistas',
    on:()=>{ META.autoMini=!META.autoMini; try{ saveMeta&&saveMeta(); }catch(e){} try{ save(); }catch(e){} UI.refresh(); }});
  return r; })(V.configuracoes);
function minigamesAutoSelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,meta=JSON.stringify(META),snaps=SNAPS,erros=[];window.NO_SAVE=true; const ok=(c,t)=>{ if(!c) erros.push(t); };
  let x=1212; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; };
  try{ newLife({country:'BR'}); const m=S.me; m.age=10; m.born=S.year-10; startSchool('fund'); m.edu.cur.yr=4; S.pending=[];
    META.autoMini=false; escQuiz('provas'); ok(S.pending.some(e=>e.id==='esc_quiz'),'sem automático a prova não apareceu'); const sh=EVENTS.esc_quiz.show(S.pending[0].d); ok(sh.ch.some(c=>c[1]==='auto'),'sem opção de resolver pelo nível');
    const g0=m.edu.cur.grade, r=EVENTS.esc_quiz.pick('auto',S.pending[0].d); ok(/automático/.test(r)&&m.edu.cur.grade!==g0,'resolver pelo nível não funcionou: '+r); S.pending=[];
    META.autoMini=true; escQuiz('provas',{rotina:1}); ok(!S.pending.some(e=>e.id==='esc_quiz'),'automático ainda parou o jogo com a prova');
    newLife({country:'BR'}); S.me.age=30; S.pending=[]; takeJob({id:'prog',co:'Teste',size:'média',mul:1}); queue('car_entrevista',{}); ok(!S.pending.length,'entrevista não foi resolvida no automático');
    META.autoMini=false; carQuizNovo(); const d=S.pending[0].d; ok(EVENTS.car_quiz.show(d).ch.some(c=>c[1]==='auto'),'desafio sem resolver pelo nível'); ok(!BAD_AUTO.test(EVENTS.car_quiz.pick('auto',d)),'texto do automático');
  }catch(e){ erros.push('erro: '+e.message); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; META=JSON.parse(meta); SNAPS=snaps; }
  if(erros.length) throw Error('Minigames automáticos · '+erros.join(' | ')); return {ok:true}; }
const BAD_AUTO=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
