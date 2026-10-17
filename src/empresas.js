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
  pick:(k,d)=>{ const m=S.me, b=m.biz; if(!b) return ''; if(typeof empresaPreparar==='function') empresaPreparar(b);
    // perdas e custos entram no modelo novo: caixa para dinheiro, capital para estrutura; a empresa paga antes do dono
    const sync=()=>{ b.value=Math.max(0,Math.round((b.capital||0)+(b.caixa||0))); b.valorContabil=b.value; };
    const caixaPerde=v=>{ v=Math.max(0,Math.round(v)); const x=Math.min(v,Math.max(0,b.caixa||0)); b.caixa-=x; const y=Math.min(v-x,Math.max(0,b.capital||0)); b.capital-=y; sync(); return x+y; }; /* devolve só a perda que de fato aconteceu: seguro e acordos não passam do que existia */
    const capitalPerde=f=>{ const v=Math.max(0,Math.round(Math.max(0,b.capital||0)*f)); b.capital-=v; sync(); return v; };
    const paga=v=>{ v=Math.round(v); const x=Math.min(v,Math.max(0,b.caixa||0)); b.caixa-=x; let r=v-x; if(r>0&&canPay(r)){ m.money-=r; r=0; } if(r>0) b.caixa-=r; sync(); return v; };
    const recebe=v=>{ b.caixa=(b.caixa||0)+Math.round(v); sync(); };
    const fechar=txt=>{ const sobra=Math.max(0,Math.round((b.caixa||0)+(b.capital||0)*.2)); m.money+=sobra; log(`Fechei a ${b.n}.`,'bad'); m.biz=null; return `${txt} Sobraram ${fmt(sobra)}.`; };
    if(d.t==='roubo'){ const v=caixaPerde(Math.max(2000,(b.caixa||0)*R.f()*.3+(b.capital||0)*.03)); if(!v) return 'Os ladrões entraram, mas não havia nada de valor para levar.';
      if(k==='s'){ if(R.chance(.6)){ recebe(v*.7); return `O seguro cobriu 70% do prejuízo de ${fmt(v)}.`; } return `O seguro achou uma cláusula e não pagou. Prejuízo de ${fmt(v)}.`; }
      if(k==='r'){ const c=Math.round((b.capital||0)*.02)+2000; paga(c); return `Levaram ${fmt(v)}. Câmeras, alarme e vigia noturno custaram mais ${fmt(c)}.`; } return `Prejuízo de ${fmt(v)}.`; }
    if(d.t==='socio'){ const v=caixaPerde(Math.max(0,b.caixa||0)*(R.f()*.4+.2)+Math.max(0,b.capital||0)*.05); if(!v) return 'O sócio tentou desviar dinheiro, mas o caixa estava vazio. Desfiz a sociedade.';
      if(k==='p'){ paga(8000); if(R.chance(.45)){ recebe(v*.6); return `Ganhei o processo e recuperei parte dos ${fmt(v)} desviados.`; } return `O sócio sumiu do país. Perdi ${fmt(v)} e o advogado.`; }
      if(k==='a'){ recebe(v*.3); return `Recuperei um pouco no acordo. O resto dos ${fmt(v)} ficou com ele.`; } return `Perdi ${fmt(v)} e a confiança em sócios.`; }
    if(d.t==='fiscal'){ const v=Math.round((b.value||0)*(R.f()*.05+.02))+3000;
      if(k==='p'){ paga(v); return `A empresa pagou ${fmt(v)} entre impostos e multa.`; }
      if(k==='c'){ paga(4000); if(R.chance(.5)){ paga(v*.5); return `O contador conseguiu reduzir a multa pela metade: ${fmt(Math.round(v*.5))}.`; } paga(v); return `O recurso foi negado. A empresa pagou ${fmt(v)} e o contador.`; }
      m.karma=clamp(m.karma-8); if(R.chance(.55)){ paga(v*.3); return 'O fiscal aceitou e "esqueceu" o assunto.'; } arrest('corrupção ativa',1,4); return 'O fiscal era honesto. Fui pres'+oa()+' por corrupção.'; }
    if(d.t==='processo'){ const v=Math.round(R.int(15000,80000)*((b.emp||1)>20?2:1)); if(k==='a'){ paga(v*.5); return `Acordo de ${fmt(Math.round(v*.5))}, pago pela empresa.`; } if(R.chance(.4)) return 'Ganhei na justiça. Não paguei nada.'; paga(v); return `Perdi o processo: ${fmt(v)}.`; }
    if(d.t==='crise'){ if(k==='d'){ b.emp=Math.max(1,Math.round((b.emp||1)*.6)); paga(Math.round((b.emp||1)*3000)); capitalPerde(.08); m.karma=clamp(m.karma-3); return 'Demiti um monte de gente e paguei as rescisões. A empresa sobreviveu, mas o clima morreu.'; }
      if(k==='i'){ const c=Math.round((b.capital||0)*.12); if((b.caixa||0)+Math.max(0,m.money)<c){ const v=capitalPerde(.25); return `Não havia dinheiro para investir. A crise levou ${fmt(v)} da estrutura.`; } paga(c); b.capital+=Math.round(c*.5); sync(); if(R.chance(.5)){ b.bonus=.15; return 'Investi na crise e saí na frente dos concorrentes.'; } capitalPerde(.15); return 'Investi e a crise engoliu o dinheiro também.'; }
      return `A crise derrubou ${fmt(capitalPerde(R.f()*.25+.08))} da estrutura da empresa.`; }
    if(d.t==='incendio'){ const dano=capitalPerde(R.f()*.3+.3);
      if(k==='r'){ const c=Math.round(dano*.8); if((b.caixa||0)+Math.max(0,m.money)<c) return fechar(`O fogo destruiu ${fmt(dano)} e reconstruir custaria ${fmt(c)}. Não havia dinheiro.`); paga(c); b.capital+=c; sync(); return `O fogo destruiu ${fmt(dano)}. A reconstrução custou ${fmt(c)}.`; }
      return fechar(`O fogo destruiu ${fmt(dano)}.`); }
    if(d.t==='funcionario'){ if(k==='d'){ caixaPerde((b.caixa||0)*.03); return 'Demiti e denunciei. Recuperei parte do estoque.'; } if(R.chance(.5)) return 'Ele nunca mais repetiu. Virou o funcionário mais fiel da empresa.'; return `Ele fez de novo. Prejuízo de ${fmt(caixaPerde((b.caixa||0)*.1+2000))}.`; }
    return ''; }};

function empresasEventosSelfTest(){const s0=S,rf=R.f,ns=window.NO_SAVE;let x=505;R.f=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};const ok=(v,t)=>{if(!v)throw Error('Eventos da empresa · '+t);};try{window.NO_SAVE=true;
 const tipos={roubo:['s','r','e'],socio:['p','a','d'],fiscal:['p','c'],processo:['a','f'],crise:['d','i','e'],incendio:['r','f'],funcionario:['d','s']};
 for(const vazia of [false,true])for(const [t,ks] of Object.entries(tipos))for(const k of ks){newLife({country:'BR'});const m=S.me;m.age=40;m.money=5e6;openBiz(BIZ_SECTORS[0],'Teste');const b=m.biz;ok(b,'empresa não abriu');m.money=vazia?0:500000;if(typeof empresaPreparar==='function')empresaPreparar(b);
  if(vazia){b.caixa=0;b.capital=0;b.value=0;b.valorContabil=0;}const antes=m.money+(b.caixa||0)+(b.capital||0);EVENTS.biz_evento.pick(k,{t});
  const bb=m.biz;if(bb){ok(Number.isFinite(bb.value)&&Math.abs(bb.value-Math.max(0,Math.round((bb.capital||0)+(bb.caixa||0))))<=1,'valor desalinhado em '+t+'/'+k);ok((bb.capital||0)>=0,'capital negativo em '+t+'/'+k);}
  ok(Number.isFinite(m.money),'dinheiro inválido em '+t+'/'+k);
  if(vazia&&t==='roubo'&&k==='s')ok(m.money+(bb?(bb.caixa||0)+(bb.capital||0):0)<=antes,'seguro pagou por perda que não existia');}
 return {ok:true};}finally{S=s0;R.f=rf;window.NO_SAVE=ns;}}
