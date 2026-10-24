// ===== 2.16: provas de cada nível =====
// Em vez da mesma "Semana de provas" todo ano, cada nível tem as suas provas (provinha, bimestral, simulado,
// P1 e P2, qualificação…), mais de uma por ano, e às vezes cai uma prova surpresa. O exame final da faculdade
// só aparece para quem não passou direto.

const ESC_PROVAS={
  fund1:[['✏️','Provinha do bimestre',2],['🏁','Prova final do ano',3]],
  fund2:[['📝','Prova bimestral',3],['🏁','Prova final',3]],
  medio:[['📝','Prova trimestral',3],['🧪','Simulado do ENEM',4],['🏁','Prova final',3]],
  tec:[['🔧','Prova prática',3],['🏁','Prova final do módulo',3]],
  uni:[['📘','P1',3],['📗','P2',3],['🏁','Exame final',3,'rec']],
  post:[['📑','Seminário de avaliação',2],['🎓','Prova de qualificação',3]]};
function escNivelProva(m){ const c=escCur(m); if(!c) return null; if(c.type==='fund') return c.yr<5?'fund1':'fund2'; return ESC_PROVAS[c.type]?c.type:'uni'; }
function escFila(m){ const nv=escNivelProva(m); if(!nv) return []; const f=ESC_PROVAS[nv].map(x=>({ic:x[0],nome:x[1],n:x[2],cond:x[3]||''}));
  if(R.chance(.2)) f.splice(R.int(0,f.length-1),0,{ic:'⚡',nome:'Prova surpresa',n:2,surpresa:1}); return f; }
// tira a próxima prova da fila; o exame final só vale para quem ficou abaixo da média
function escProvaProx(fila){ const m=S.me; fila=(fila||[]).slice();
  while(fila.length){ const e=fila.shift(), c=escCur(m); if(!c) return false;
    if(e.cond==='rec'&&c.grade>=60){ log(`Passei direto em ${c.n}, sem precisar do exame final.`,'good'); continue; }
    const lv=escNivel(m,'provas'), qs=[]; for(let i=0;i<e.n;i++){ const q=escPergunta(m,lv); qs.push(e.surpresa?q:escAjuda(m,q)); }
    queue('esc_quiz',{tipo:'provas',q:qs,r:0,ok:0,nome:e.nome,ic:e.ic,surpresa:e.surpresa?1:0,fila,rotina:1}); return true; }
  return false; }
escQuiz=(o=>function(tipo,extra){ if(tipo==='provas'&&extra&&extra.rotina&&!extra.nome){ const f=escFila(S.me); if(f.length){ escProvaProx(f); return ''; } } return o.apply(this,arguments); })(escQuiz);
{ const ev=EVENTS.esc_quiz, sh0=ev.show, pk0=ev.pick;
  ev.show=function(d){ const r=sh0.apply(this,arguments); if(r&&d&&d.nome){ r.t=r.t.replace(/^.*? · questão/,`${d.ic||'📝'} ${d.nome} · questão`); if(!d.r&&d.surpresa) r.x='O professor entrou e mandou guardar o material: prova surpresa!\n\n'+r.x; } return r; };
  ev.pick=function(k,d){ const fim=k==='auto'||(d&&d.q&&d.r>=d.q.length-1); const r=pk0.apply(this,arguments); if(fim&&d&&d.fila&&d.fila.length) escProvaProx(d.fila); return r; }; }
autoResolver=(o=>function(id,d){ const r=o.apply(this,arguments); if(id==='esc_quiz'&&d&&d.fila&&d.fila.length) escProvaProx(d.fila); return r; })(autoResolver);
// provas com 2 ou 4 questões usam a mesma régua da prova de 3; a surpresa pesa um pouco mais
escQuizFim=(o=>function(tipo,ok,n,d){ if(tipo!=='provas') return o.apply(this,arguments);
  const k=n===3?ok:Math.round(ok/n*3); let t=o.call(this,tipo,k,3,d).replace(/^Acertei \d+ de \d+\./,`${d&&d.nome?d.nome+': a':'A'}certei ${ok} de ${n}.`);
  if(d&&d.surpresa){ const c=escCur(S.me); if(c){ if(ok===n){ c.grade=clamp(c.grade+3); t+=' O professor elogiou na frente da turma.'; } else if(!ok){ c.grade=clamp(c.grade-3); t+=' Quem não estudou se deu mal.'; } } }
  return t; })(escQuizFim);

function provasSelfTest(){ const s0=S,ns=window.NO_SAVE,meta=JSON.stringify(META); window.NO_SAVE=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); }, BAD=/\{\w+\}|undefined|NaN|\[object/;
  try{ for(const [tipo,idade,yr,nv] of [['fund',8,1,'fund1'],['fund',13,6,'fund2'],['medio',16,0,'medio'],['uni',20,1,'uni']]){
      newLife({country:'BR'}); const m=S.me; m.age=idade; m.prison=null; META.autoMini=false;
      if(tipo==='uni') m.edu.cur={type:'uni',id:'dir',n:'Direito',len:5,yr,grade:40}; else { startSchool(tipo); m.edu.cur.yr=yr; }
      ok(escNivelProva(m)===nv,'nível errado '+nv); S.pending=[]; escQuiz('provas',{rotina:1});
      const nomes=[]; let guarda=0;
      while(S.pending.some(e=>e.id==='esc_quiz')&&guarda++<40){ const i=S.pending.findIndex(e=>e.id==='esc_quiz'), e=S.pending.splice(i,1)[0], d=e.d;
        if(!d.r) nomes.push(d.nome); const sh=EVENTS.esc_quiz.show(d); ok(sh&&!BAD.test(sh.t+sh.x),'tela da prova: '+(sh&&sh.t));
        const q=d.q[d.r]; const r=EVENTS.esc_quiz.pick(String(q.ops.indexOf(q.c)),d); ok(!BAD.test(String(r)),'resultado: '+r); }
      const esperadas=ESC_PROVAS[nv].filter(x=>x[3]!=='rec').map(x=>x[1]); for(const n of esperadas) ok(nomes.includes(n),`${nv} sem ${n}: ${nomes.join(', ')}`);
      ok(new Set(nomes).size>=2,'só uma prova no ano '+nv); }
    // exame final só abaixo da média; surpresa aparece às vezes
    newLife({country:'BR'}); let m=S.me; m.age=20; m.edu.cur={type:'uni',id:'dir',n:'Direito',len:5,yr:1,grade:95}; S.pending=[]; escProvaProx([{ic:'🏁',nome:'Exame final',n:3,cond:'rec'}]); ok(!S.pending.length,'exame final para quem passou direto');
    m.edu.cur.grade=30; escProvaProx([{ic:'🏁',nome:'Exame final',n:3,cond:'rec'}]); ok(S.pending.length===1,'sem exame final para quem precisa');
    let sur=0; for(let i=0;i<200;i++) if(escFila(m).some(x=>x.surpresa)) sur++; ok(sur>10&&sur<90,'prova surpresa com frequência estranha: '+sur);
    // resolução automática segue a fila inteira
    newLife({country:'BR'}); m=S.me; m.age=16; startSchool('medio'); S.pending=[]; META.autoMini=true; const antes=m.c.provasFeitas||0; escQuiz('provas',{rotina:1}); META.autoMini=false;
    ok((S.me.c.provasFeitas||0)-antes>=3,'automático não fez todas as provas: '+((S.me.c.provasFeitas||0)-antes));
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; Object.assign(META,JSON.parse(meta)); }
  if(erros.length) throw Error('Provas 2.16 · '+erros.slice(0,8).join(' | ')); return {ok:true}; }
