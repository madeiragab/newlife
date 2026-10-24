// ===== Provas: poucas por nível, e às vezes uma surpresa =====
// Antes havia prova todo ano. Agora cada nível tem só uma ou duas provas no curso inteiro (no fundamental, a do
// 5º ano e a final), cada uma feita uma vez só. Nos outros anos, de vez em quando cai uma prova surpresa.
// O exame final da faculdade só aparece para quem não passou direto.

// [ícone, nome, questões, ano do curso em que cai (0 = primeiro), condição]
const ESC_PROVAS={
  fund:[['✏️','Prova do 5º ano',3,c=>4],['🏁','Prova final do fundamental',3,c=>c.len-1]],
  medio:[['🧪','Simulado do ENEM',3,c=>1],['🏁','Prova final do médio',3,c=>c.len-1]],
  tec:[['🔧','Prova prática final',3,c=>c.len-1]],
  uni:[['📘','Prova do meio do curso',3,c=>Math.floor(c.len/2)],['🏁','Exame final',3,c=>c.len-1,'rec']],
  post:[['🎓','Prova de qualificação',3,c=>c.len-1]]};
const ESC_SURPRESA=.12;
function escNivelProva(m){ const c=escCur(m); if(!c) return null; return ESC_PROVAS[c.type]?c.type:'uni'; }
// provas que vencem neste ano; cada uma acontece uma vez só no curso
function escFila(m){ const nv=escNivelProva(m), c=escCur(m); if(!nv) return []; c.pf=c.pf||[];
  const f=ESC_PROVAS[nv].filter(x=>!c.pf.includes(x[1])&&(c.yr||0)>=Math.min(x[3](c),Math.max(0,(c.len||1)-1))).map(x=>({ic:x[0],nome:x[1],n:x[2],cond:x[4]||''}));
  if(!f.length&&R.chance(ESC_SURPRESA)) f.push({ic:'⚡',nome:'Prova surpresa',n:2,surpresa:1}); return f; }
// tira a próxima prova da fila; o exame final só vale para quem ficou abaixo da média
function escProvaProx(fila){ const m=S.me; fila=(fila||[]).slice();
  while(fila.length){ const e=fila.shift(), c=escCur(m); if(!c) return false;
    if(!e.surpresa){ c.pf=c.pf||[]; if(!c.pf.includes(e.nome)) c.pf.push(e.nome); }
    if(e.cond==='rec'&&c.grade>=60){ log(`Passei direto em ${c.n}, sem precisar do exame final.`,'good'); continue; }
    const lv=escNivel(m,'provas'), qs=[]; for(let i=0;i<e.n;i++){ const q=escPergunta(m,lv); qs.push(e.surpresa?q:escAjuda(m,q)); }
    queue('esc_quiz',{tipo:'provas',q:qs,r:0,ok:0,nome:e.nome,ic:e.ic,surpresa:e.surpresa?1:0,fila,rotina:1}); return true; }
  return false; }
escQuiz=(o=>function(tipo,extra){ if(tipo==='provas'&&extra&&extra.rotina&&!extra.nome){ const f=escFila(S.me); if(f.length) escProvaProx(f); return ''; } return o.apply(this,arguments); })(escQuiz);
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
  const faz=()=>{ let n=0, g=0; const nomes=[]; while(S.pending.some(e=>e.id==='esc_quiz')&&g++<40){ const i=S.pending.findIndex(e=>e.id==='esc_quiz'), d=S.pending.splice(i,1)[0].d;
      if(!d.r){ n++; nomes.push(d.nome); } const sh=EVENTS.esc_quiz.show(d); ok(sh&&!BAD.test(sh.t+sh.x),'tela da prova: '+(sh&&sh.t)); const q=d.q[d.r]; const r=EVENTS.esc_quiz.pick(String(q.ops.indexOf(q.c)),d); ok(!BAD.test(String(r)),'resultado: '+r); } return nomes; };
  try{ META.autoMini=false;
    for(const [tipo,idade,len] of [['fund',6,9],['medio',15,3],['uni',18,5]]){ newLife({country:'BR'}); const m=S.me; m.age=idade; m.prison=null;
      if(tipo==='uni') m.edu.cur={type:'uni',id:'dir',n:'Direito',len,yr:0,grade:40}; else startSchool(tipo);
      const todas=[]; let surpresas=0; for(let y=0;y<len;y++){ m.edu.cur.yr=y; S.pending=[]; escQuiz('provas',{rotina:1}); const n=faz(); n.forEach(x=>{ if(x==='Prova surpresa') surpresas++; else todas.push(x); }); }
      const esperadas=ESC_PROVAS[tipo].filter(x=>x[4]!=='rec').map(x=>x[1]); for(const n of esperadas) ok(todas.includes(n),`${tipo} sem ${n}: ${todas.join(', ')}`);
      ok(todas.length<=ESC_PROVAS[tipo].length,`${tipo}: provas demais no curso (${todas.length}): ${todas.join(', ')}`); ok(new Set(todas).size===todas.length,`${tipo}: prova repetida: ${todas.join(', ')}`);
      ok(surpresas<=Math.ceil(len/2),`${tipo}: surpresas demais (${surpresas})`); }
    newLife({country:'BR'}); let m=S.me; m.age=20; m.edu.cur={type:'uni',id:'dir',n:'Direito',len:5,yr:1,grade:95}; S.pending=[]; escProvaProx([{ic:'🏁',nome:'Exame final',n:3,cond:'rec'}]); ok(!S.pending.length,'exame final para quem passou direto');
    m.edu.cur.grade=30; escProvaProx([{ic:'🏁',nome:'Exame final',n:3,cond:'rec'}]); ok(S.pending.length===1,'sem exame final para quem precisa');
    let sur=0; m.edu.cur.yr=0; m.edu.cur.pf=['Prova do meio do curso','Exame final']; for(let i=0;i<300;i++) if(escFila(m).some(x=>x.surpresa)) sur++; ok(sur>10&&sur<90,'prova surpresa com frequência estranha: '+sur);
    newLife({country:'BR'}); m=S.me; m.age=16; startSchool('medio'); m.edu.cur.yr=1; S.pending=[]; META.autoMini=true; const antes=m.c.provasFeitas||0; escQuiz('provas',{rotina:1}); META.autoMini=false;
    ok((S.me.c.provasFeitas||0)-antes>=1,'automático não fez a prova');
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; Object.assign(META,JSON.parse(meta)); }
  if(erros.length) throw Error('Provas · '+erros.slice(0,8).join(' | ')); return {ok:true}; }
