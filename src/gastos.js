// ===== Para onde vai o dinheiro: contas fixas por ano conforme a economia do país (casa, carro, mecânico, plano de saúde, seguro),
// gastos legais novos e serviços ilegais (assassino de aluguel, cartel, assalto encomendado, diploma falso), com risco de traição =====
const IPVA={BR:.03,PT:.01,US:.015,AR:.025,MX:.02,JP:.015,IT:.012,FR:.01,DE:.01,GB:.012,AO:.02,CA:.015,ES:.01,KR:.02,IN:.02};
function gastosInflacao(){ try{ return 1+Math.max(0,mundo(S.me.country).inflacao||0); }catch(e){ return 1; } }
function gastosLocal(){ try{ return mercadoCusto(); }catch(e){ return 1; } }
// estimativa das contas do ano, item por item
function gastosAno(m){ m=m||S.me; const loc=gastosLocal(), inf=gastosInflacao(), it=[];
  const casas=m.assets.filter(a=>a.k==='casa'); casas.forEach(c=>it.push(['🏠',`IPTU, condomínio e manutenção · ${c.n}`,Math.round(c.value*.01*inf)]));
  const carros=m.assets.filter(a=>a.k==='carro'); carros.forEach(c=>{ const imposto=Math.round(c.value*(IPVA[m.country]||.015)), rev=Math.round(c.value*.015*inf); it.push(['🚗',`Imposto, revisão e combustível · ${c.n}`,imposto+rev+Math.round(1200*loc)]); if(m.seguroCarro) it.push(['🛡️',`Seguro · ${c.n}`,Math.round(c.value*.03)]); });
  if(m.planoSaude) it.push(['🏥','Plano de saúde',Math.round((1800+Math.max(0,m.age-25)*120)*loc*inf)]);
  return it; }
yearMoney=(o=>function(){ const m=S.me; const r=o.apply(this,arguments); if(!m.alive||S.scen||m.prison||m.age<18) return r;
  const it=gastosAno(m); if(!it.length) return r; const carros=m.assets.filter(a=>a.k==='carro').length; const total=Math.max(0,it.reduce((s,x)=>s+x[2],0)-carros*900);
  m.money-=total; m.c.contasAno=total; if(total>0&&R.chance(.4)) log(`Contas fixas do ano: ${fmt(total)} (${it.map(x=>x[1].split(' · ')[0].toLowerCase()).filter((v,i,a)=>a.indexOf(v)===i).join(', ')}).`);
  for(const c of m.assets.filter(a=>a.k==='carro')){ c.cond=Math.max(0,(c.cond??100)-R.int(3,9)); if(R.chance(.06+(100-c.cond)/300)) queue('carro_quebrou',{id:c.id}); }
  if(m.diplomaFalso&&m.job&&R.chance(.07)) queue('diploma_descoberto',{}); return r; })(yearMoney);
// plano de saúde paga a maior parte dos tratamentos
treat=(o=>function(where,dis){ const m=S.me, d0=m.money; const r=o.apply(this,arguments); if(m.planoSaude&&['doc','hosp'].includes(where)&&m.money<d0){ const v=Math.round((d0-m.money)*.8); m.money+=v; return (r||'')+` O plano de saúde cobriu ${fmt(v)}.`; } return r; })(treat);
// ---------- mecânico ----------
EVENTS.carro_quebrou={when:m=>!m.prison&&m.age>=18,prep:m=>{ const c=m.assets.find(a=>a.k==='carro'); return c?{id:c.id}:null; },
  show:d=>{ const c=S.me.assets.find(a=>a.id===d.id); const v=c?Math.round(c.value*.04*gastosInflacao()):1000; return {k:'Carro',t:'🔧 O carro quebrou',x:`${c?c.n:'O carro'} começou a fazer um barulho horrível e parou no meio da rua.`,ch:[[`Mecânico de confiança (${fmt(v)}${S.me.seguroCarro?', o seguro cobre':''})`,'confianca'],[`Oficina barata do bairro (${fmt(Math.round(v*.35))})`,'barata'],['Tentar consertar eu mesm'+oa(),'eu']]}; },
  pick:(k,d)=>{ const m=S.me, c=m.assets.find(a=>a.id===d.id); if(!c) return 'Já não tenho esse carro.'; const v=Math.round(c.value*.04*gastosInflacao());
    if(k==='confianca'){ if(!m.seguroCarro) m.money-=v; c.cond=Math.min(100,(c.cond??60)+35); return m.seguroCarro?'O seguro pagou tudo. O carro voltou como novo.':`Paguei ${fmt(v)}. Serviço impecável.`; }
    if(k==='barata'){ m.money-=Math.round(v*.35); if(R.chance(.35)){ c.cond=Math.max(0,(c.cond??60)-10); return R.pick(['Cobraram, trocaram uma peça boa por uma usada e o barulho continuou.','Disseram que estava pronto. Quebrou de novo no dia seguinte.']); } c.cond=Math.min(100,(c.cond??60)+20); return 'Barato e resolveu. Dessa vez deu sorte.'; }
    if(R.chance(.3+m.smarts/300)){ m.money-=150; c.cond=Math.min(100,(c.cond??60)+15); return 'Assisti três vídeos, sujei a roupa inteira e consertei. Orgulho.'; } c.cond=Math.max(0,(c.cond??60)-15); m.money-=Math.round(v*.5); return 'Piorei o problema. Acabei no guincho.'; }};
// ---------- gastos legais ----------
function gastoLegal(k){ const m=S.me, loc=gastosLocal();
  if(k==='plano'){ m.planoSaude=!m.planoSaude; return m.planoSaude?'Contratei um plano de saúde. Agora a maior parte dos tratamentos sai por conta dele.':'Cancelei o plano de saúde.'; }
  if(k==='seguro'){ if(!m.assets.some(a=>a.k==='carro')) return 'Não tenho carro para segurar.'; m.seguroCarro=!m.seguroCarro; return m.seguroCarro?'Fiz seguro do carro: roubo, batida e mecânico cobertos.':'Cancelei o seguro do carro.'; }
  if(k==='doacao'){ const v=Math.round(Math.max(500,m.money*.05)); if(!canPay(v)) return 'Não tenho como doar agora.'; m.money-=v; m.karma=clamp(m.karma+Math.min(15,Math.round(v/20000)+3)); if(v>100000) m.fame=clamp(m.fame+2); return `Doei ${fmt(v)} para ${R.pick(['um hospital infantil','um abrigo de animais','uma ONG de educação','vítimas de uma enchente'])}.`; }
  if(k==='festa'){ const v=Math.round(5000*loc); if(!canPay(v)) return `Uma festa de verdade custa ${fmt(v)}.`; m.money-=v; people().filter(p=>p.alive&&p.rel!=='pet').forEach(p=>p.bond=clamp(p.bond+3)); st('happy',8); return `Fiz uma festa de aniversário para ${people().filter(p=>p.alive&&p.rel!=='pet').length} convidados. ${fmt(v)} bem gastos.`; }
  if(k==='luxo'){ const v=Math.round(25000*loc); if(!canPay(v)) return `Um fim de semana de luxo custa ${fmt(v)}.`; m.money-=v; st('happy',10); st('health',2); return R.pick(['Spa cinco estrelas, jantar de chef e suíte com vista.','Aluguei um iate por um fim de semana. Champanhe no pôr do sol.']); }
  return ''; }
// ---------- serviços ilegais ----------
function ilegalPreco(p){ return Math.round((20000+(p.fame||0)*1500+(p.money>1e6?50000:0))*gastosLocal()); }
EVENTS.ilegal_assassino={when:m=>!m.prison&&m.age>=18,prep:m=>{ const p=people().find(q=>q.alive&&q.rel!=='pet'); return p?{pid:p.id}:null; },
  show:d=>{ const p=P(d.pid); return {k:'Submundo',t:'🔪 Assassino de aluguel',x:`Um intermediário num bar escuro diz que resolve "o problema" com ${p.first} por ${fmt(ilegalPreco(p))}, metade adiantada.`,ch:[['Fechar o serviço','fecha'],['Desistir','desiste']]}; },
  pick:(k,d)=>{ const m=S.me, p=P(d.pid); if(!p) return ''; if(k==='desiste') return 'Fui embora. Nunca mais voltei àquele bar.'; const v=ilegalPreco(p); if(!canPay(v)) return `Não tenho ${fmt(v)}.`; m.money-=v; m.karma=clamp(m.karma-40); m.c.mandante=(m.c.mandante||0)+1; const x=R.f();
    if(x<.15) return 'O intermediário sumiu com o dinheiro. Não dá para reclamar na polícia.';
    if(x<.27){ arrest(`mandante de tentativa de homicídio contra ${fullName(p)}`,8,20); return 'O assassino foi preso antes do serviço e entregou o meu nome.'; }
    if(x<.40){ p.rel='inimigo'; p.bond=0; return `O serviço falhou. ${p.first} sobreviveu, e sabe quem mandou.`; }
    p.alive=false; p.cause='assassinad'+(p.gender==='F'?'a':'o')+' por um matador de aluguel'; log(`${fullName(p)} foi assassinad${p.gender==='F'?'a':'o'}.`,'bad'); st('happy',-6);
    if(R.chance(.25)) queue('investigacao',{n:fullName(p)}); if(R.chance(.2)) queue('ilegal_chantagem',{v:Math.round(v*.6)}); return `Dias depois, a notícia: ${p.first} foi encontrad${p.gender==='F'?'a':'o'} mort${p.gender==='F'?'a':'o'}. Ninguém sabe de nada. Por enquanto.`; }};
EVENTS.ilegal_chantagem={when:m=>!m.prison,prep:()=>({v:Math.round(20000*gastosLocal())}),show:d=>({k:'Submundo',t:'📞 Chantagem',x:`O matador que contratei me ligou. Quer mais ${fmt(d.v)}, senão conta tudo para a polícia.`,ch:[['Pagar','paga'],['Recusar','recusa'],['Mandar resolver o matador também','resolve']]}),
  pick:(k,d)=>{ const m=S.me; d.v=d.v||20000; if(k==='paga'){ m.money-=Math.min(Math.max(0,m.money),d.v); if(R.chance(.3)) queue('ilegal_chantagem',{v:Math.round(d.v*1.5)}); return 'Paguei. Ele disse que foi a última vez.'; }
    if(k==='recusa'){ if(R.chance(.5)){ arrest('mandante de homicídio',10,25); return 'Ele cumpriu a ameaça.'; } return 'Ele blefou. Pelo menos por enquanto.'; }
    m.karma=clamp(m.karma-20); if(R.chance(.5)) return 'O problema sumiu. Mas agora são dois.'; arrest('mandante de homicídio',12,30); return 'O segundo matador era policial infiltrado.'; }};
const CARTEL_SERV=[['intimidar','Intimidar uma pessoa que me incomoda',15000],['negocio','Proteção para o meu negócio',30000],['provas','Sumir com provas contra mim',80000],['cobrar','Cobrar um dinheiro que me devem',10000]];
EVENTS.ilegal_cartel={when:m=>!m.prison&&m.age>=18,show:()=>({k:'Submundo',t:'💼 Negócio com o cartel',x:'Um homem de terno, com dois seguranças, ouve o meu pedido sem piscar. "Tudo tem preço. E tudo tem volta."',ch:CARTEL_SERV.map(s=>[`${s[1]} (${fmt(Math.round(s[2]*gastosLocal()))})`,s[0]]).concat([['Desistir','desiste']])}),
  pick:k=>{ const m=S.me; if(k==='desiste') return 'Agradeci e saí devagar.'; const s=CARTEL_SERV.find(x=>x[0]===k), v=Math.round(s[2]*gastosLocal()); if(!canPay(v)) return `Não tenho ${fmt(v)}.`; m.money-=v; m.karma=clamp(m.karma-15); m.c.cartel=(m.c.cartel||0)+1;
    if(R.chance(.15)) return 'Pegaram o dinheiro e nunca fizeram nada. Reclamar com o cartel não é uma opção.'; let t='';
    if(k==='intimidar'){ const p=people('inimigo','ex','chefe').find(q=>q.alive)||people().find(q=>q.alive&&q.rel!=='pet'); if(p){ p.bond=clamp(p.bond+20); p.medo=1; t=`${p.first} recebeu uma "visita". Desde então, me trata com muito respeito.`; } else t='Não havia ninguém para intimidar. Ficaram com o dinheiro.'; }
    else if(k==='negocio'){ if(m.biz){ m.biz.protecao=S.year+3; t='Ninguém mais mexe com o meu negócio. Nem a concorrência.'; } else t='Não tenho negócio para proteger. Ficaram com o dinheiro mesmo assim.'; }
    else if(k==='provas'){ const n=S.pending.length; S.pending=S.pending.filter(e=>e.id!=='julgamento'&&e.id!=='investigacao'); m.c.unsolved=0; t=S.pending.length<n?'Os documentos do processo sumiram do fórum. O caso foi arquivado.':'Sumiram com tudo que podia me comprometer.'; }
    else { const v2=Math.round(v*R.int(2,5)); m.money+=v2; t=`Cobraram com juros: voltaram com ${fmt(v2)}. Não perguntei como.`; }
    if(R.chance(.35)) queue('ilegal_favor',{}); return t; }};
EVENTS.ilegal_favor={when:m=>!m.prison,show:()=>({k:'Submundo',t:'📦 O cartel cobra o favor',x:'Um carro preto parou na minha porta. "Lembra do nosso acordo? Agora é a sua vez."',ch:[['Levar um pacote sem perguntar o que tem','pacote'],['Esconder um homem por uma semana','esconder'],['Recusar','recusa']]}),
  pick:k=>{ const m=S.me; m.karma=clamp(m.karma-8);
    if(k==='pacote'){ if(R.chance(.2)){ arrest('tráfico internacional de drogas',6,15); return 'Blitz no meio do caminho. O pacote era o que eu temia.'; } return 'Entreguei o pacote. Não quero saber o que tinha dentro.'; }
    if(k==='esconder'){ if(R.chance(.15)){ arrest('favorecimento a criminoso',1,4); return 'A polícia achou o homem na minha casa.'; } return 'Uma semana com um estranho armado no quarto de hóspedes. Ele foi embora sem dizer obrigado.'; }
    if(R.chance(.4)){ if(R.chance(.15)){ die('executad'+oa()+' pelo cartel'); return 'Ninguém recusa o cartel.'; } st('health',-R.int(20,40)); return 'Me deram uma surra para eu lembrar quem manda.'; } return 'Recusei. Me deixaram em paz. Por enquanto.'; }};
const ASSALTOS=[['casa','A mansão de um ricaço',8000,[40000,200000],.65],['joalheria','Uma joalheria no shopping',20000,[100000,500000],.5],['carroforte','Um carro-forte',50000,[300000,1500000],.35],['banco','Um banco no centro',120000,[1000000,5000000],.25]];
EVENTS.ilegal_assalto={when:m=>!m.prison&&m.age>=18,show:()=>({k:'Submundo',t:'🧨 Assalto encomendado',x:'Uma quadrilha experiente topa fazer o serviço se eu bancar a operação. Fico com metade.',ch:ASSALTOS.map(a=>[`${a[1]} (operação ${fmt(Math.round(a[2]*gastosLocal()))})`,a[0]]).concat([['Desistir','desiste']])}),
  pick:k=>{ const m=S.me; if(k==='desiste') return 'Melhor não.'; const A=ASSALTOS.find(x=>x[0]===k), custo=Math.round(A[2]*gastosLocal()); if(!canPay(custo)) return `A operação custa ${fmt(custo)}.`; m.money-=custo; m.karma=clamp(m.karma-15); cnt('crimes');
    const x=R.f(); if(x<.2) return 'A quadrilha fez o assalto e sumiu com tudo. Fui passad'+oa()+' para trás.';
    if(x<.2+(1-A[4])*.45){ if(R.chance(.5)){ arrest(`mandante de roubo (${A[1].toLowerCase()})`,4,12); return 'A polícia pegou a quadrilha, e um deles me entregou na delação.'; } return 'O assalto deu errado. A quadrilha foi presa, mas ninguém abriu a boca.'; }
    const v=Math.round(R.int(A[3][0],A[3][1])*gastosLocal()/2); m.money+=v; if(typeof origemEntrada==='function') try{ origemEntrada(v,'ilicita','Assalto encomendado'); }catch(e){} log(`O assalto encomendado deu certo. Minha parte: ${fmt(v)}.`,'warn'); return `Deu certo. Minha metade: ${fmt(v)}, em notas usadas.`; }};
function diplomaFalso(cid){ const m=S.me, c=COURSES.find(x=>x.id===cid); if(!c) return ''; if(m.edu.deg.includes('uni:'+cid)) return 'Já tenho esse diploma.'; const v=Math.round(15000*gastosLocal()); if(!canPay(v)) return `O falsificador cobra ${fmt(v)}.`; m.money-=v; m.karma=clamp(m.karma-10);
  if(R.chance(.15)){ arrest('falsificação de documento público',1,4); return 'O falsificador era policial disfarçado.'; } m.edu.deg.push('uni:'+cid); (m.diplomaFalso=m.diplomaFalso||[]).push(cid); return `Comprei um diploma de ${c.n}, com carimbo e tudo. Agora é rezar para ninguém conferir.`; }
EVENTS.diploma_descoberto={when:m=>!!m.diplomaFalso&&!!m.job&&!m.prison,show:()=>({k:'Trabalho',t:'📜 O diploma',x:'O RH resolveu conferir os diplomas na universidade. O meu não consta em lugar nenhum.',ch:[['Confessar','confessa'],['Insistir que é verdadeiro','insiste'],['Pedir demissão antes','sai']]}),
  pick:k=>{ const m=S.me, cid=(m.diplomaFalso||[])[0]; m.edu.deg=m.edu.deg.filter(d=>d!=='uni:'+cid); m.diplomaFalso=(m.diplomaFalso||[]).slice(1); if(!m.diplomaFalso.length) m.diplomaFalso=null;
    if(k==='sai'){ endJob(); return 'Saí antes que me mandassem embora. O diploma falso foi para o lixo.'; } endJob(); if(k==='insiste'&&R.chance(.6)){ arrest('falsidade ideológica',1,4); return 'Insisti, e a empresa chamou a polícia.'; } return 'Fui demitid'+oa()+' por justa causa. O diploma falso não vale mais nada.'; }};
// ---------- telas ----------
V.gastos=()=>{ const m=S.me, it=gastosAno(m), A=(ic,l,s,fn,extra)=>Object.assign({ic,l,s,on:()=>act(fn,l)},extra||{});
  const total=it.reduce((s,x)=>s+x[2],0);
  return {title:'Gastos e contas',items:[{html:`<div class="card"><p><b>Contas fixas por ano</b></p>${it.length?it.map(x=>kv(x[0]+' '+x[1],fmt(x[2]))).join(''):'<p style="color:var(--muted)">Sem casa ou carro, as contas fixas entram no custo de vida.</p>'}${kv('Custo de vida (aluguel, comida, luz, água, internet)',fmt(m.c.lastCost||0))}${total?kv('Total extra',fmt(total)):''}<p style="color:var(--muted);font-size:13px">Os valores acompanham os preços e a inflação de ${esc(countryOf(m.country).n)}.</p></div>`},
    {sec:'Proteção'},A('🏥',m.planoSaude?'Cancelar o plano de saúde':'Contratar plano de saúde','Cobre 80% dos tratamentos',()=>gastoLegal('plano')),A('🛡️',m.seguroCarro?'Cancelar o seguro do carro':'Fazer seguro do carro','Mecânico e danos cobertos',()=>gastoLegal('seguro')),
    {sec:'Gastar'},A('🎁','Doar para uma causa','5% do que tenho · carma',()=>gastoLegal('doacao')),A('🎉','Dar uma festa de aniversário','Todo mundo mais próximo',()=>gastoLegal('festa')),A('🥂','Fim de semana de luxo','Felicidade e descanso',()=>gastoLegal('luxo'))]}; };
V.ilegais=()=>{ const m=S.me, Q=(id,d)=>()=>{ queue(id,d||{}); return ''; };
  return {title:'Serviços ilegais',items:[{html:'<div class="card"><p>Quem contrata o submundo paga adiantado, e não tem a quem reclamar. Traição, chantagem e delação fazem parte do pacote.</p></div>'},
    {ic:'🔪',l:'Contratar um assassino de aluguel',s:'Escolher o alvo',tone:'bad',on:()=>UI.push(()=>({title:'Quem?',items:people().filter(p=>p.alive&&p.rel!=='pet').map(p=>({l:fullName(p),s:`${p.rel} · ${fmt(ilegalPreco(p))}`,tone:'bad',on:()=>act(Q('ilegal_assassino',{pid:p.id}),'Submundo')}))}))},
    {ic:'💼',l:'Contratar o cartel',s:'Intimidar, proteger, sumir com provas, cobrar',tone:'bad',on:()=>act(Q('ilegal_cartel'),'Submundo')},
    {ic:'🧨',l:'Encomendar um assalto',s:'Casa, joalheria, carro-forte ou banco',tone:'bad',on:()=>act(Q('ilegal_assalto'),'Submundo')},
    {ic:'📜',l:'Comprar um diploma falso',s:'Pode ser descoberto no emprego',tone:'bad',on:()=>UI.push(()=>({title:'Diploma de quê?',items:COURSES.map(c=>({l:c.n,on:()=>act(()=>diplomaFalso(c.id),'Diploma')}))}))}]}; };
V.activities=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(m.prison||!r||!r.items) return r; const i=r.items.findIndex(x=>x.l==='Crimes');
  r.items.splice(i>=0?i+1:r.items.length,0,Object.assign({ic:'💸',l:'Gastos e contas',s:'Contas do ano, plano de saúde, seguro, festas',on:()=>UI.push(V.gastos)},ageGate(18)),Object.assign({ic:'🕶️',l:'Serviços ilegais',s:'Matador, cartel, assalto, diploma falso',tone:'bad',on:()=>UI.push(V.ilegais)},ageGate(18))); return r; })(V.activities);
function gastosSelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,erros=[];window.NO_SAVE=true;window.NO_NEWS=true; const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=4242; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; }; let m;
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=EVENTS[id].show(JSON.parse(JSON.stringify(d))); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v));
    sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap); m=S.me; try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); ok(Number.isFinite(S.me.money),id+'#'+k+' dinheiro'); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); m=S.me; };
  try{ newLife({country:'BR'}); m=S.me; m.age=35; m.born=S.year-35; m.money=5e6; m.prison=null; S.pending=[];
    m.assets.push({id:newId(),k:'carro',n:'Sedã',value:80000,cond:40,buy:80000},{id:newId(),k:'casa',n:'Casa',value:600000,cond:80,buy:600000});
    const it=gastosAno(m); ok(it.length>=2&&it.every(x=>x[2]>0),'contas fixas sem itens'); const d0=m.money; yearMoney(); ok(m.money<d0,'contas fixas não cobradas');
    S.mundo=null; const caro=(()=>{ newLife({country:'US'}); const mm=S.me; mm.age=35; mm.assets.push({id:newId(),k:'carro',n:'Sedã',value:80000,cond:80}); return gastosAno(mm)[0][2]; })(); ok(caro>0,'contas sem valor em outro país');
    newLife({country:'BR'}); m=S.me; m.age=35; m.money=5e6; m.prison=null; const car={id:newId(),k:'carro',n:'Sedã',value:80000,cond:40}; m.assets.push(car); todas('carro_quebrou',{id:car.id});
    for(const k of ['plano','seguro','doacao','festa','luxo']) ok(!BAD.test(gastoLegal(k)),'gasto '+k);
    const alvo=mkPerson({rel:'inimigo',age:40,bond:10}); S.people.push(alvo); todas('ilegal_assassino',{pid:alvo.id}); todas('ilegal_chantagem',{v:10000}); todas('ilegal_cartel',{}); todas('ilegal_favor',{}); todas('ilegal_assalto',{});
    let traido=0,deucerto=0; for(let i=0;i<40;i++){ const snap=JSON.stringify(S), d1=S.me.money; const r=EVENTS.ilegal_assalto.pick('joalheria',{}); if(/passad/.test(r)) traido++; if(S.me.money>d1) deucerto++; S=JSON.parse(snap); m=S.me; } ok(traido>0&&deucerto>0,`assalto sem traição ou sem sucesso (${traido}/${deucerto})`);
    ok(!BAD.test(diplomaFalso(COURSES[0].id)),'diploma falso'); m.diplomaFalso=[COURSES[0].id]; m.edu.deg.push('uni:'+COURSES[0].id); takeJob({id:'aux',co:'X',size:'média',mul:1}); todas('diploma_descoberto',{});
    for(const v of [V.gastos(),V.ilegais()]) v.items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')+String(it.html||'')),'tela: '+(it.l||'')));
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; }
  if(erros.length) throw Error('Gastos · '+erros.slice(0,8).join(' | ')); return {ok:true}; }
