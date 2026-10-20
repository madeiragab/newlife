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
    m.c.infertilCaxumba=0; m.fert=70; for(let i=0;i<30;i++){ m.age=20; m.dis=[{id:'caxumba',y:0,ctrl:false,trat:S.year}]; yearHealth(); } if(m.c.infertilCaxumba) erros.push('caxumba tratada deixou infértil');
  }catch(e){ erros.push(e.message); } finally{ S=s0; window.NO_SAVE=ns; } if(erros.length) throw Error('Ajustes · '+erros.join(' | ')); return {ok:true}; }
// gravidez na adolescência: a notícia muda a vida inteira
interact=(o=>function(p,k){ const n0=S.births.length; const r=o.apply(this,arguments); if(S.births.length>n0&&S.me.age<18) queue('gravidez_teen',{pid:p&&p.id}); return r; })(interact);
EVENTS.gravidez_teen={when:m=>m.age<18&&!m.prison,show:d=>{ const p=P(d.pid); return {k:'Família',t:'Gravidez na adolescência',x:`${S.me.gender==='F'?'Estou grávida':'Vou ser pai'} aos ${S.me.age} anos${p?', com '+p.first:''}. Ainda estou na escola.`,ch:[['Contar para os meus pais','pais'],['Esconder por enquanto','esconde'],['Assumir junto e planejar o futuro','assume']]}; },
  pick:k=>{ const m=S.me, c=m.edu.cur; if(c) c.grade=clamp(c.grade-8); st('happy',-6);
    if(k==='pais'){ const ps=parents(); if(R.chance(.6)){ ps.forEach(p=>p.bond=clamp(p.bond-5)); return 'Choraram, gritaram, e depois me abraçaram. Disseram que vão ajudar.'; } ps.forEach(p=>p.bond=clamp(p.bond-20)); return 'Meus pais ficaram furiosos. A casa virou um silêncio pesado.'; }
    if(k==='esconde'){ parents().forEach(p=>p.bond=clamp(p.bond-10)); return 'Escondi por meses. Quando descobriram, foi pior.'; }
    st('happy',4); return 'Decidimos encarar juntos. Vai ser difícil conciliar escola e bebê, mas não estamos sozinhos.'; }};

function ajustes207SelfTest(){ const s0=S,ns=window.NO_SAVE,nn=window.NO_NEWS; window.NO_SAVE=true; window.NO_NEWS=true; const erros=[]; const ok=(c,x)=>{ if(!c) erros.push(x); };
  try{ newLife({country:'BR'}); const m=S.me; m.age=40; m.prison=null;
    S.guerra=null; ok(guerraIniciar('BR','BR','teste')===null&&!S.guerra,'país em guerra contra si mesmo');
    for(let i=0;i<200;i++){ S.guerra=null; S.year++; const f=NL_GANCHOS_ANO; for(const g of f){ try{ g(); }catch(e){} } if(S.guerra){ ok(S.guerra.lider.a!==S.guerra.lider.b,'guerra espontânea contra si mesmo'); } } S.guerra=null;
    m.money=100; m.assets.push({id:newId(),k:'casa',n:'Casa',value:900000,cond:80}); const pat=netWorth(); const atraso=gastoCobrar(9000,'Contas atrasadas'); ok(m.money>=0&&atraso>0&&m.loans.some(l=>l.n==='Contas atrasadas'),'conta sem saldo não virou dívida');
    m.money=1000; const r=EVENTS.ilegal_chantagem.pick('paga',{v:50000}); ok(m.money>=0&&!/Paguei\./.test(r),'chantagem paga sem dinheiro: '+r);
    const p=mkPerson({rel:'inimigo',age:40,bond:5}); S.people.push(p); p.alive=false; const sh=EVENTS.ilegal_assassino.show({pid:p.id}); ok(/não está mais/.test(sh.x),'alvo morto aceito'); ok(/Não há/.test(EVENTS.ilegal_assassino.pick('fecha',{pid:p.id})),'serviço contra alvo morto');
    m.office={id:'pref',yrs:1,appr:50}; const w=mundo('BR'), s1=w.saude; EVENTS.pol_orcamento.pick('saude'); const dPref=mundo('BR').saude-s1; m.office={id:'pres',yrs:1,appr:50}; const s2=mundo('BR').saude; EVENTS.pol_orcamento.pick('saude'); const dPres=mundo('BR').saude-s2; ok(dPref<dPres,'prefeito mexe no país como presidente');
    S.flags.diff='facil'; m.age=16; startSchool('medio'); S.pending=[]; escQuiz('provas'); const d=S.pending.find(e=>e.id==='esc_quiz').d; EVENTS.esc_quiz.show(d); S.flags.diff='dificil'; const n=EVENTS.esc_quiz.show(d).ch.filter(c=>c[1]!=='auto').length; ok(n>2,'dificuldade nova não refez as alternativas');
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; window.NO_NEWS=nn; }
  if(erros.length) throw Error('Ajustes 2.07 · '+erros.join(' | ')); return {ok:true}; }

// 2.08: a fuga da prisão chegava ao fim sem conseguir mexer nos atributos (a pilha do labirinto se chamava st) e a altura não seguia a idade
function ajustes208SelfTest(){ const s0=S,ns=window.NO_SAVE,nn=window.NO_NEWS,se=showErr,md=modal; window.NO_SAVE=true; window.NO_NEWS=true; const erros=[]; const ok=(c,x)=>{ if(!c) erros.push(x); };
  try{ newLife({country:'BR'}); const m=S.me;
    m.genes.h=195; m.age=6; ok(altura(m)<140&&altura(m)>120,'criança de 6 anos com '+altura(m)+' cm'); m.age=0; ok(altura(m)<65,'bebê com '+altura(m)+' cm'); m.age=30; ok(altura(m)===195,'adulto fora da altura genética');
    let alt=0; for(let a=0;a<=30;a++){ m.age=a; ok(altura(m)>=alt,'encolheu aos '+a); alt=altura(m); } ok(/1,95 m/.test(looksLine(m)),'ficha sem a altura adulta');
    for(let i=0;i<6;i++){ m.age=30; m.alive=true; m.prison={left:5,total:5,behav:50,juv:false}; let falha=null; showErr=e=>{ falha=e; }; modal=()=>{}; mgEscape();
      for(let p=0;p<300&&!$('#mgOk');p++){ const cells=[...$('#game').querySelectorAll('.maze i')], W=13, H=cells.length/W, idx=cells.findIndex(c=>c.textContent==='🏃'), door=cells.findIndex(c=>c.classList.contains('x')); const prev={[idx]:-1}, q=[idx];
        while(q.length){ const c=q.shift(); if(c===door) break; for(const d of [-W,W,-1,1]){ const n=c+d; if(n<0||n>=cells.length||(d===1&&n%W===0)||(d===-1&&c%W===0)||n in prev||cells[n].classList.contains('w')) continue; prev[n]=c; q.push(n); } }
        let c=door; while(prev[c]!==idx&&prev[c]!==undefined&&prev[c]!==-1) c=prev[c]; const dd=c-idx; MG.key(dd===-W?'u':dd===W?'d':dd===-1?'l':'r'); }
      ok($('#mgOk'),'fuga não terminou'); if($('#mgOk')) $('#mgOk').onclick(); ok(!falha,'fuga terminou com erro: '+(falha&&falha.message)); }
  }catch(e){ erros.push('erro: '+e.message); } finally{ showErr=se; modal=md; mgClose(); S=s0; window.NO_SAVE=ns; window.NO_NEWS=nn; }
  if(erros.length) throw Error('Ajustes 2.08 · '+erros.join(' | ')); return {ok:true}; }
