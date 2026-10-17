// ===== Empresa dá trabalho: roubos, sócio que desvia, fiscalização, processos, crises =====
yearBiz=(o=>function(){ const m=S.me, had=!!m.biz; const r=o.apply(this,arguments);
  try{ if(had&&m.biz&&!m.prison&&R.chance(.4)&&!S.pending.some(e=>e.id==='biz_evento')) queue('biz_evento',{t:R.wpick([['roubo',3],['socio',2],['fiscal',3],['processo',2],['crise',2],['incendio',1],['funcionario',2]])}); }catch(e){ cadFalha(e,'Eventos da empresa'); } return r; })(yearBiz);
EVENTS.biz_evento={show:d=>{ const b=S.me.biz; if(!b) return {k:'Empresa',t:'Empresa',x:'',ch:[['OK','x']]}; const T={
    roubo:['Assalto na empresa',`A ${b.n} foi assaltada de madrugada. Levaram equipamentos e o dinheiro do cofre.`,[['Acionar o seguro','s'],['Reforçar a segurança','r'],['Engolir o prejuízo','e']]],
    socio:['O sócio sumiu com o dinheiro',`Descobri que meu sócio desviou dinheiro da ${b.n} por meses.`,[['Processar o sócio','p'],['Fazer um acordo','a'],['Deixar para lá e seguir','d']]],
    fiscal:['A fiscalização',`A Receita apareceu na ${b.n} e achou impostos atrasados.`,[['Pagar tudo com multa','p'],['Contratar um contador para recorrer','c'],['Oferecer um "agrado" ao fiscal','g']]],
    processo:['Processo trabalhista',`Um ex-funcionário entrou na justiça contra a ${b.n}.`,[['Fazer acordo','a'],['Ir até o fim','f']]],
    crise:['Crise no setor',`O setor da ${b.n} entrou em crise. As vendas despencaram.`,[['Demitir gente para sobreviver','d'],['Investir para atravessar a crise','i'],['Esperar passar','e']]],
    incendio:['Incêndio',`Um curto-circuito causou um incêndio na ${b.n}.`,[['Reconstruir','r'],['Fechar as portas','f']]],
    funcionario:['O funcionário desonesto',`Um funcionário de confiança estava vendendo produtos da ${b.n} por fora.`,[['Demitir e denunciar','d'],['Dar uma segunda chance','s']]]}[d.t];
  return {k:'Empresa',t:T[0],x:T[1],ch:T[2]}; },
  pick:(k,d)=>{ const m=S.me, b=m.biz; if(!b) return ''; const perde=f=>{ const v=Math.round(b.value*f); b.value=Math.max(0,b.value-v); return v; };
    if(d.t==='roubo'){ if(k==='s'){ const v=perde(R.f()*.12); if(R.chance(.6)){ m.money+=Math.round(v*.7); return `O seguro cobriu parte do prejuízo de ${fmt(v)}.`; } return `O seguro achou uma cláusula e não pagou. Prejuízo de ${fmt(v)}.`; }
      if(k==='r'){ const c=Math.round(b.value*.05)+2000; if(!canPay(c)) return `Segurança nova custaria ${fmt(c)}. Sem dinheiro, engoli o prejuízo de ${fmt(perde(R.f()*.15))}.`; m.money-=c; perde(R.f()*.08); return `Câmeras, alarme e vigia noturno: ${fmt(c)}.`; } return `Prejuízo de ${fmt(perde(R.f()*.15))}.`; }
    if(d.t==='socio'){ const v=perde(R.f()*.3+.1); if(k==='p'&&canPay(8000)){ m.money-=8000; if(R.chance(.45)){ b.value+=Math.round(v*.6); return `Ganhei o processo e recuperei parte dos ${fmt(v)} desviados.`; } return `O sócio sumiu do país. Perdi ${fmt(v)} e o advogado.`; }
      if(k==='a'){ b.value+=Math.round(v*.3); return `Recuperei um pouco no acordo. O resto dos ${fmt(v)} ficou com ele.`; } return `Perdi ${fmt(v)} e a confiança em sócios.`; }
    if(d.t==='fiscal'){ const v=Math.round(b.value*(R.f()*.08+.02))+3000;
      if(k==='p'){ m.money-=v; return `Paguei ${fmt(v)} entre impostos e multa.`; }
      if(k==='c'){ m.money-=4000; if(R.chance(.5)){ m.money-=Math.round(v*.4); return 'O contador conseguiu reduzir a multa pela metade.'; } m.money-=v; return 'O recurso foi negado. Paguei tudo e o contador.'; }
      m.karma=clamp(m.karma-8); if(R.chance(.55)){ m.money-=Math.round(v*.3); return 'O fiscal aceitou e "esqueceu" o assunto.'; } arrest('corrupção ativa',1,4); return 'O fiscal era honesto. Fui pres'+oa()+' por corrupção.'; }
    if(d.t==='processo'){ const v=Math.round(R.int(15000,80000)*(b.emp>20?2:1)); if(k==='a'){ m.money-=Math.round(v*.5); return `Acordo de ${fmt(Math.round(v*.5))}.`; } if(R.chance(.4)) return 'Ganhei na justiça. Não paguei nada.'; m.money-=v; return `Perdi o processo: ${fmt(v)}.`; }
    if(d.t==='crise'){ if(k==='d'){ b.emp=Math.max(1,Math.round(b.emp*.6)); perde(.1); m.karma=clamp(m.karma-3); return 'Demiti um monte de gente. A empresa sobreviveu, mas o clima morreu.'; }
      if(k==='i'){ const c=Math.round(b.value*.15); if(!canPay(c)){ perde(.3); return 'Não tinha dinheiro para investir. A crise levou 30% da empresa.'; } m.money-=c; if(R.chance(.5)){ b.bonus=.15; return 'Investi na crise e saí na frente dos concorrentes.'; } perde(.2); return 'Investi e a crise engoliu o dinheiro também.'; }
      return `A crise levou ${fmt(perde(R.f()*.3+.1))} do valor da empresa.`; }
    if(d.t==='incendio'){ if(k==='r'){ const c=Math.round(b.value*.25); if(!canPay(c)){ const sobra=Math.round(b.value*.2); m.money+=sobra; log(`Fechei a ${b.n} depois do incêndio.`,'bad'); m.biz=null; return `Reconstruir custaria ${fmt(c)} e eu não tinha. Fechei a empresa e sobraram ${fmt(sobra)}.`; } m.money-=c; perde(.1); return `Reconstruir custou ${fmt(c)}.`; } const sobra=Math.round(b.value*.2); m.money+=sobra; log(`Fechei a ${b.n} depois do incêndio.`,'bad'); m.biz=null; return `Fechei a empresa. Sobraram ${fmt(sobra)}.`; }
    if(d.t==='funcionario'){ if(k==='d'){ perde(.04); return 'Demiti e denunciei. Recuperei parte do estoque.'; } if(R.chance(.5)) return 'Ele nunca mais repetiu. Virou o funcionário mais fiel da empresa.'; return `Ele fez de novo. Prejuízo de ${fmt(perde(.1))}.`; }
    return ''; }};
