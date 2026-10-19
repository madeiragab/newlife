// ===== Bens antes dos 18 mostram o dinheiro da família · caxumba sem tratamento pode deixar infértil =====
V.assets=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(!r||!r.items||S.scen||m.age>=18||!parents().length) return r;
  r.items.unshift({html:`<div class="card"><p><b>Dinheiro da família</b></p>${kv('Meus pais têm',fmt(famMoney()))}${kv('Meu dinheiro',fmt(m.money))}<p style="color:var(--muted);font-size:13px">Até os 18 anos, as compras grandes saem do dinheiro da família.</p></div>`}); return r; })(V.assets);
// caxumba que passa sozinha, sem ir ao médico, pode inflamar os testículos ou ovários depois da puberdade
yearHealth=(o=>function(){ const m=S.me, cx=(m.dis||[]).find(d=>d.id==='caxumba'); const r=o.apply(this,arguments);
  if(cx&&!cx.trat&&m.age>=11&&!m.c.infertilCaxumba&&R.chance(m.gender==='M'?.25:.05)){ m.c.infertilCaxumba=1; m.fert=Math.min(m.fert??60,8); log('A caxumba sem tratamento deixou sequela: fiquei com a fertilidade muito baixa.','bad'); }
  return r; })(yearHealth);
function ajustes201SelfTest(){ const s0=S,ns=window.NO_SAVE; window.NO_SAVE=true; const erros=[]; try{ newLife({country:'BR'}); const m=S.me; m.age=12; m.born=S.year-12;
    const v=V.assets(); if(!v.items.some(it=>/Dinheiro da família/.test(it.html||''))) erros.push('bens sem dinheiro da família');
    m.gender='M'; let inf=0; for(let i=0;i<60;i++){ m.c.infertilCaxumba=0; m.fert=70; m.dis=[{id:'caxumba',y:0,ctrl:false}]; yearHealth(); if(m.c.infertilCaxumba) inf++; } if(!inf) erros.push('caxumba nunca deixa infértil');
    m.c.infertilCaxumba=0; m.fert=70; m.dis=[{id:'caxumba',y:0,ctrl:false,trat:S.year}]; for(let i=0;i<30;i++) yearHealth(); if(m.c.infertilCaxumba) erros.push('caxumba tratada deixou infértil');
  }catch(e){ erros.push(e.message); } finally{ S=s0; window.NO_SAVE=ns; } if(erros.length) throw Error('Ajustes · '+erros.join(' | ')); return {ok:true}; }
// gravidez na adolescência: a notícia muda a vida inteira
interact=(o=>function(p,k){ const n0=S.births.length; const r=o.apply(this,arguments); if(S.births.length>n0&&S.me.age<18) queue('gravidez_teen',{pid:p&&p.id}); return r; })(interact);
EVENTS.gravidez_teen={when:m=>m.age<18&&!m.prison,show:d=>{ const p=P(d.pid); return {k:'Família',t:'Gravidez na adolescência',x:`${S.me.gender==='F'?'Estou grávida':'Vou ser pai'} aos ${S.me.age} anos${p?', com '+p.first:''}. Ainda estou na escola.`,ch:[['Contar para os meus pais','pais'],['Esconder por enquanto','esconde'],['Assumir junto e planejar o futuro','assume']]}; },
  pick:k=>{ const m=S.me, c=m.edu.cur; if(c) c.grade=clamp(c.grade-8); st('happy',-6);
    if(k==='pais'){ const ps=parents(); if(R.chance(.6)){ ps.forEach(p=>p.bond=clamp(p.bond-5)); return 'Choraram, gritaram, e depois me abraçaram. Disseram que vão ajudar.'; } ps.forEach(p=>p.bond=clamp(p.bond-20)); return 'Meus pais ficaram furiosos. A casa virou um silêncio pesado.'; }
    if(k==='esconde'){ parents().forEach(p=>p.bond=clamp(p.bond-10)); return 'Escondi por meses. Quando descobriram, foi pior.'; }
    st('happy',4); return 'Decidimos encarar juntos. Vai ser difícil conciliar escola e bebê, mas não estamos sozinhos.'; }};
