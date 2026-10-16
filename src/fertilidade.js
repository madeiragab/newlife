// ===== Ter filhos com ajuda: fertilização in vitro, barriga de aluguel, e as encrencas disso =====
// FIV com implante de embrião: só para quem tem útero (sexo biológico feminino). Barriga de aluguel: qualquer pessoa.
function fertFIV(pid){ if(pid===undefined&&partners().length>1) return 'Escolha com quem planejar o bebê.'; if(pid!=null&&!partners().some(p=>p.id===pid)) return 'Essa pessoa não é mais meu parceiro.'; const m=S.me, c=18000; if(m.age<18) return 'Só depois dos 18.'; if(sexoDe(m)!=='F') return 'Esse tratamento é para quem pode engravidar.';
  if(m.age>50) return 'O médico disse que, na minha idade, o implante não tem chance.'; if(S.births.length||m.barriga) return 'Já tem um bebê a caminho.';
  if(use('fiv')>2) return 'O corpo precisa descansar entre as tentativas. Só no ano que vem.'; if(!canPay(c)) return `Cada tentativa custa ${fmt(c)}.`; m.money-=c; cnt('fiv');
  const ch=clamp((m.fert||60)-(m.age>35?(m.age-35)*4:0),5,75)/100;
  if(R.chance(ch)){ S.births.push({with:pid===undefined?(partners()[0]?.id??null):pid}); st('happy',15); return 'O implante de embrião deu certo. O teste deu positivo! Vem um bebê aí.'; }
  st('happy',-8); return R.pick(['O embrião não pegou. O médico disse para tentar de novo com calma.','Mais uma tentativa sem sucesso. Chorei no carro antes de entrar em casa.']); }
function fertBarriga(pid){ if(pid===undefined&&partners().length>1) return 'Escolha com quem planejar o bebê.'; if(pid!=null&&!partners().some(p=>p.id===pid)) return 'Essa pessoa não é mais meu parceiro.'; const m=S.me, c=70000; if(m.age<21) return 'A clínica só aceita a partir dos 21.'; if(m.age>60) return 'A clínica não aceita mais na minha idade.';
  if(S.births.length||m.barriga) return 'Já tem um bebê a caminho.'; if(!canPay(c)) return `O processo custa ${fmt(c)}.`; m.money-=c; cnt('barriga');
  const st0=stranger({gender:'F'}); const mae=mkPerson({rel:'tmp',gender:'F',first:st0.first,last:st0.last,age:clamp(m.age+R.int(-10,2),22,40)});
  m.barriga={n:mae.first,nl:mae.last,ano:m.age,with:pid===undefined?(partners()[0]?.id??null):pid};
  return `Conheci ${mae.first}, que vai gestar o nosso bebê. Contrato assinado, exames feitos. Agora é esperar.`; }
// no ano seguinte: o bebê nasce, ou a mãe de aluguel tenta fugir (raro)
yearMoney=(o=>function(){ const r=o.apply(this,arguments); const m=S.me; try{ if(m.alive&&m.barriga&&m.age>m.barriga.ano&&!S.scen){
  if(R.chance(.05)&&!m.barriga.fuga){ m.barriga.fuga=1; queue('barriga_fuga',{n:m.barriga.n}); }
  else if(!m.barriga.fuga){ S.births.push({with:m.barriga?.with??null}); log(`${m.barriga.n} deu à luz o nosso bebê. Segurei pela primeira vez no corredor da maternidade.`,'good'); m.barriga=null; } } }catch(e){} return r; })(yearMoney);
EVENTS.barriga_fuga={show:d=>({k:'Família',t:'A mãe de aluguel sumiu',x:`${d.n}, a mãe de aluguel, parou de atender o telefone. A clínica diz que ela se mudou e quer ficar com o bebê.`,ch:[['Entrar na justiça ($15.000 de advogado)','j'],['Ir atrás dela e conversar','c'],['Deixar ela ficar com o bebê','d']]}),
  pick:(k,d)=>{ const m=S.me; const nascer=()=>{ S.births.push({with:m.barriga?.with??null}); m.barriga=null; };
    if(k==='j'){ m.money-=15000; if(R.chance(.8)){ nascer(); st('happy',10); return 'O juiz deu ganho de causa no mesmo mês. O bebê veio para casa.'; } m.barriga=null; st('happy',-25); return 'A justiça demorou demais e o juiz decidiu pelo vínculo com a mãe que gestou. Perdi o bebê.'; }
    if(k==='c'){ if(R.chance(.55)){ nascer(); st('happy',8); return `Encontrei ${d.n} num hotel de beira de estrada, chorando. Ela tinha medo de se arrepender. Conversamos e ela me entregou o bebê.`; } m.barriga=null; st('happy',-20); return `${d.n} fugiu de novo antes que eu chegasse. Nunca mais soube dela.`; }
    m.barriga=null; st('happy',-15); m.karma=clamp(m.karma+8); return `Deixei ${d.n} ficar com o bebê. Doeu como nada na vida.`; }};
// no menu do amor
V.love=(o=>()=>{ const r=o(), m=S.me; if(!r||!r.items||m.age<18||S.scen) return r;
  r.items.push({sec:'Ter filhos com ajuda'},
    Object.assign({ic:'🧫',l:'Implante de embrião (FIV)',s:`${fmt(18000)} por tentativa · para quem pode engravidar`,on:()=>fertEscolher(fertFIV,'Clínica de fertilidade')},sexoDe(m)!=='F'?{dis:true,why:'O implante é para quem tem útero. A barriga de aluguel serve para qualquer pessoa.'}:{}),
    {ic:'🤰',l:'Barriga de aluguel',s:`${fmt(70000)} · o bebê nasce no ano seguinte`,on:()=>fertEscolher(fertBarriga,'Barriga de aluguel')});
  return r; })(V.love);

function fertEscolher(fn,titulo){ const l=partners(); if(l.length<2) return act(()=>fn(l[0]?.id??null),titulo); modal({t:'Com quem planejar o bebê?',ch:[...l.map(p=>({l:p.first,fn:()=>act(()=>fn(p.id),titulo)})),{l:'Sem outro responsável',fn:()=>act(()=>fn(null),titulo)},{l:'Cancelar'}]}); }
