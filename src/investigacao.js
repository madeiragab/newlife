// ===== Profissão paranormal: contratos, exploração, dedução e bestiário =====
const PN_PISTAS={emf:'EMF nível 5',frio:'Temperatura negativa',voz:'Voz no rádio',escrita:'Escrita fantasma',orbe:'Orbes na câmera',uv:'Marcas ultravioletas'};
const PN_FERRAMENTAS={emf:['Medidor EMF','📟'],frio:['Termômetro','🌡️'],voz:['Rádio de espíritos','📻'],escrita:['Caderno ritual','📓'],orbe:['Câmera noturna','📹'],uv:['Lanterna UV','🔦']};
const PN_ENTIDADES=[
 {id:'errante',n:'Espírito errante',ic:'👻',p:['frio','voz','escrita'],rit:'memoria',txt:'Repete os últimos momentos da vida. O nome e um objeto afetivo permitem a despedida.'},
 {id:'poltergeist',n:'Poltergeist',ic:'🪑',p:['emf','escrita','uv'],rit:'selo',txt:'Arremessa objetos e deixa marcas nas portas. Um círculo de contenção prende sua energia.'},
 {id:'sombra',n:'Sombra',ic:'🌑',p:['frio','orbe','uv'],rit:'luz',txt:'Se move nas bordas da visão. Luz consagrada desfaz o esconderijo.'},
 {id:'banshee',n:'Banshee',ic:'🕯️',p:['voz','orbe','uv'],rit:'memoria',txt:'Seu lamento procura alguém perdido. Descobrir a história interrompe o chamado.'},
 {id:'demonio',n:'Demônio',ic:'👹',p:['frio','escrita','uv'],rit:'exorcismo',txt:'Reage com violência à presença humana. Exige exorcismo e proteção antes da invocação.'},
 {id:'revenant',n:'Revenant',ic:'⚰️',p:['emf','frio','orbe'],rit:'selo',txt:'Persegue quem corre pelos corredores. Contenção e esconderijos são essenciais.'},
 {id:'vampiro',n:'Vampiro',ic:'🧛',p:['voz','escrita','uv'],rit:'luz',txt:'Uma criatura de carne e sangue. A luz permite expulsá-la do local, sem curar sua maldição.'},
 {id:'lobisomem',n:'Lobisomem',ic:'🐺',p:['emf','voz','orbe'],rit:'selo',txt:'Rosnados e marcas nas paredes denunciam a fera. Contenha a passagem até amanhecer.'}
];
const PN_RITOS={memoria:'Despedida com objeto afetivo',selo:'Círculo de contenção',luz:'Luz consagrada',exorcismo:'Exorcismo'};
const pn=()=>{ const p=para(); return p.prof||(p.prof={ativa:false,rep:0,fe:12,resolvidos:0,ganhos:0,ano:null,ofertas:[],best:{},kit:0,caso:null}); };
const pnPode=()=>S.me.alive&&S.me.age>=18&&!S.me.prison&&!S.scen;
const pnCargo=p=>p.rep>=80?'Referência nacional':p.rep>=50?'Especialista em assombrações':p.rep>=20?'Investigador conhecido':'Investigador iniciante';
function pnEntrar(){ if(!pnPode()) return 'Preciso ter 18 anos e estar livre, na vida normal.'; pn().ativa=true; return 'Abri minha agenda de investigação paranormal. O equipamento básico é emprestado; cada contrato concluído ajuda a construir meu nome.'; }
function pnOfertas(){ const p=pn(); if(!p.ativa||p.ano===S.year) return p.ofertas; p.ano=S.year;
 const n=2+Math.floor(p.rep/25)+Math.floor(p.fe/50); p.ofertas=Array.from({length:n},(_,i)=>{ const nivel=1+Math.min(2,Math.floor(p.rep/30)), ex=p.rep>=20&&R.chance(.45);
 return {id:S.year+':'+i,cliente:R.pick(['Uma família do bairro','Uma dona de pousada','Um zelador','Uma pessoa da comunidade religiosa','Um comerciante','Uma família que viu minhas entrevistas']),local:R.pick(['Sobrado da estação','Pousada da serra','Capela antiga','Fazenda do lago','Apartamento 13']),nivel,ex,pago:(ex?1200:500)*nivel+R.int(0,4)*100,aceito:false}; }); return p.ofertas; }
function pnAceitar(id){ const p=pn(); if(!pnPode()||!p.ativa) return 'Não posso investigar agora.'; if(p.caso) return 'Preciso terminar o contrato atual.';
 const o=pnOfertas().find(x=>x.id===id); if(!o||o.aceito) return 'Esse pedido não está mais disponível.'; o.aceito=true;
 const e=R.pick(PN_ENTIDADES); p.caso={...o,ent:e.id,quarto:R.int(1,4),pos:0,san:100,bat:100,turno:0,caca:0,pistas:[],testes:{},protecao:false,rito:false,msg:'Cheguei ao local. A van é segura. Procure o cômodo com atividade e cruze as provas no bestiário.'}; return 'Contrato aceito. A investigação pode ser interrompida e retomada, inclusive depois de fechar o jogo.'; }
function pnPasso(){ const c=pn().caso; c.turno++; if(c.pos===0) return;
 c.san=Math.max(0,c.san-(3+c.nivel)); c.bat=Math.max(0,c.bat-Math.max(1,3-pn().kit));
 if(c.caca){ c.caca--; c.san=Math.max(0,c.san-8); st('health',-5); c.msg+=' A entidade me alcançou no corredor. Perdi saúde!'; }
 else if(c.san<65&&R.chance(.12+c.nivel*.05)){ c.caca=2; c.msg+=' As luzes piscaram. Começou uma caçada: esconda-se ou volte para a van!'; }
 if(c.san<=0||S.me.health<=5){ c.msg+=' Precisei abandonar a missão.'; const r=pnFinalizar(null,true); return r; }
}
function pnAcao(tipo,val){ const p=pn(), c=p.caso; if(!c||!pnPode()) return 'Não há investigação disponível.';
 if(tipo==='mover'){ if(!Number.isInteger(val)||val<0||val>4) return ''; c.pos=val; c.msg=val===c.quarto?'Um arrepio atravessou o cômodo. Há atividade aqui.':val===0?'Voltei para a van. Aqui posso avaliar as provas.':'O cômodo está silencioso.'; }
 else if(tipo==='esconder'){ if(!c.pos) return 'Já estou em segurança na van.'; if(c.caca){ c.caca=0; c.san=Math.max(0,c.san-5); c.msg='Apaguei a lanterna e segurei a respiração no armário. Os passos se afastaram.'; save(); return c.msg; } c.msg='Esperei no esconderijo, ouvindo o corredor.'; }
 else if(tipo==='descansar'){ if(c.pos) return 'Só posso trocar pilhas e descansar na van.'; if(c.descanso) return 'Já usei as pilhas e o descanso de emergência deste contrato.'; c.descanso=true; c.bat=100; c.san=Math.min(100,c.san+25); c.msg='Troquei as pilhas e recuperei o fôlego.'; }
 else if(tipo==='proteger'){ if(c.pos!==c.quarto) return 'Preciso achar o cômodo com atividade primeiro.'; if(c.protecao) return 'A proteção já está pronta.'; c.protecao=true; c.msg='Preparei o círculo de proteção antes do ritual.'; }
 else if(tipo==='medir'){ if(!PN_PISTAS[val]) return ''; if(!c.pos) return 'Entre na casa para usar o equipamento.'; if(c.bat<5) return 'Sem bateria. Volte para a van.';
 const key=c.pos+':'+val; if(c.testes[key]) return 'Já registrei a leitura deste equipamento neste cômodo.'; c.testes[key]=true; c.bat-=5;
 const e=PN_ENTIDADES.find(x=>x.id===c.ent); if(c.pos===c.quarto&&e.p.includes(val)){ if(!c.pistas.includes(val)) c.pistas.push(val); c.msg='Prova confirmada: '+PN_PISTAS[val]+'.'; } else c.msg='Nenhum sinal de '+PN_PISTAS[val].toLowerCase()+' neste cômodo.';
 } else if(tipo==='rito'){ if(!PN_RITOS[val]) return ''; if(c.rito) return 'Já tentei o ritual deste contrato.'; if(c.pos!==c.quarto||c.pistas.length<3) return 'Preciso reunir três provas e estar no cômodo da entidade.';
 c.rito=true; const e=PN_ENTIDADES.find(x=>x.id===c.ent); c.expulsa=val===e.rit&&c.protecao&&!c.caca;
 c.msg=c.expulsa?'O ritual funcionou. A presença deixou o local. Volte à van para entregar o relatório.':'O ritual falhou. Era preciso escolher o rito correto, preparar a proteção e esperar a caçada terminar.';
 if(!c.expulsa){ c.san=Math.max(0,c.san-25); st('health',-10); }
 } else return '';
 const fim=pnPasso(); save(); return fim||c.msg;
}
function pnFinalizar(id,abandono=false){ const p=pn(),c=p.caso; if(!c||(!abandono&&!pnPode())) return 'Não há contrato para concluir.'; if(!abandono&&c.pos!==0) return 'Volte para a van antes de entregar o relatório.';
 const certo=!abandono&&id===c.ent&&c.pistas.length===3, completo=certo&&(!c.ex||c.expulsa), valor=completo?c.pago:certo?Math.floor(c.pago*.4):0;
 p.caso=null; S.me.money+=valor; p.ganhos+=valor; p.rep=clamp(p.rep+(completo?7:certo?2:-4)); p.fe=clamp(p.fe+(completo?5:-2));
 if(certo){ p.resolvidos++; p.best[c.ent]=(p.best[c.ent]||0)+1; para().vistos[c.ent]=1; para().prova+=3; S.me.fame=clamp((S.me.fame||0)+(completo?2:1)); }
 const e=PN_ENTIDADES.find(x=>x.id===c.ent), msg=abandono?'Abandonei o contrato. Ninguém pagou, mas voltei com vida.':completo?`Identifiquei ${e.n.toLowerCase()} e concluí o pedido. Recebi ${fmt(valor)}. O cliente vai me recomendar.`:certo?`Identifiquei a entidade, mas faltou expulsá-la. Recebi ${fmt(valor)} pela investigação.`:'O relatório não comprovou a entidade correta. Sem pagamento; minha reputação caiu.';
 log(msg,completo?'good':'warn'); save(); return msg;
}
function pnKit(){ const p=pn(),c=1500*(p.kit+1); if(!pnPode()||!p.ativa||p.kit>=3) return 'Não há melhoria disponível.'; if(!canPay(c)) return `Preciso de ${fmt(c)}.`; S.me.money-=c; p.kit++; return 'Melhorei a autonomia dos equipamentos. A bateria agora dura mais durante as investigações.'; }
V.paraProf=()=>{ const p=pn(),it=[{html:`<div class="card"><p>Clientes que acreditam no sobrenatural procuram ajuda. Junte provas, identifique a entidade e cumpra o pedido para receber.</p>${kv('Carreira',pnCargo(p))}${kv('Reputação',p.rep+'/100')}${kv('Confiança dos clientes',p.fe+'/100')}${kv('Casos identificados',p.resolvidos)}${kv('Recebido',fmt(p.ganhos))}</div>`}];
 if(!pnPode()) return {title:'Investigação profissional',items:[{html:'Disponível a partir dos 18 anos, fora da prisão e dos mundos fictícios.'}]};
 if(!p.ativa) it.push({ic:'👻',l:'Abrir agenda de investigador',s:'Equipamento básico emprestado · sem custo',on:()=>act(pnEntrar,'Nova profissão')});
 else { if(p.caso) it.push({ic:'🔦',l:'Retomar investigação',s:p.caso.local,on:()=>UI.push(V.paraCaso)});
 it.push({sec:'Pedidos deste ano'}); pnOfertas().forEach(o=>it.push({ic:o.ex?'🕯️':'🏚️',l:o.local,s:`${o.cliente} · ${o.ex?'Identificar e expulsar':'Investigar'} · perigo ${o.nivel}/3 · ${fmt(o.pago)}`,dis:o.aceito||!!p.caso,on:()=>act(()=>pnAceitar(o.id),'Contrato')}));
 it.push({ic:'🧰',l:'Melhorar equipamento',s:p.kit>=3?'Nível máximo':`Nível ${p.kit}/3 · ${fmt(1500*(p.kit+1))}`,dis:p.kit>=3,on:()=>act(pnKit,'Equipamento')}); }
 it.push({ic:'📖',l:'Bestiário e diário de provas',on:()=>UI.push(V.paraBest)}); return {title:'Investigação profissional',items:it}; };
V.paraBest=()=>{ const p=pn(); return {title:'Bestiário paranormal',items:[{html:'O guia ajuda na dedução; os registros confirmados são desbloqueados ao entregar relatórios corretos.'},...PN_ENTIDADES.map(e=>({html:`<div class="card"><h3>${e.ic} ${e.n}</h3><p>${e.txt}</p><p>Provas: ${e.p.map(k=>PN_PISTAS[k]).join(' · ')}</p>${kv('Ritual',PN_RITOS[e.rit])}${kv('Casos confirmados',p.best[e.id]||0)}</div>`}))]}; };
V.paraCaso=()=>{ const c=pn().caso; if(!c) return {title:'Contrato encerrado',items:[{html:'O resultado ficou no diário. Novos pedidos aparecem a cada ano.'}]};
 const quartos=['Van','Sala','Cozinha','Quarto','Porão'],it=[{html:`<div class="card"><p>${esc(c.local)} · ${c.ex?'Identificar e expulsar':'Identificar a entidade'}</p>${kv('Local',quartos[c.pos])}${bar('Sanidade',c.san)}${bar('Bateria',c.bat)}<p>${esc(c.msg)}</p><p>${c.caca?'⚠️ Caçada em andamento!':'Explore com cuidado.'}</p><p>Provas: ${c.pistas.map(k=>PN_PISTAS[k]).join(' · ')||'Nenhuma'}</p></div>`},
 {btns:quartos.map((q,i)=>({l:q,dis:c.pos===i,on:()=>act(()=>pnAcao('mover',i),'Exploração')}))},
 {btns:[{l:'Esconder',on:()=>act(()=>pnAcao('esconder'),'Esconderijo')},{l:'Descansar na van',dis:c.pos!==0||c.descanso,on:()=>act(()=>pnAcao('descansar'),'Pausa')}]}, {sec:'Equipamentos'}];
 Object.entries(PN_FERRAMENTAS).forEach(([k,[n,ic]])=>it.push({ic,l:n,s:c.testes[c.pos+':'+k]?'Leitura registrada':'Procurar '+PN_PISTAS[k].toLowerCase(),dis:!c.pos||!!c.testes[c.pos+':'+k],on:()=>act(()=>pnAcao('medir',k),n)}));
 it.push({ic:'📖',l:'Consultar bestiário',on:()=>UI.push(V.paraBest)},{sec:'Ritual opcional — obrigatório nos pedidos de expulsão'}, {l:'Preparar proteção',dis:c.protecao,on:()=>act(()=>pnAcao('proteger'),'Proteção')});
 Object.entries(PN_RITOS).forEach(([k,n])=>it.push({l:n,dis:c.rito||c.pistas.length<3,on:()=>act(()=>pnAcao('rito',k),'Ritual')}));
 it.push({sec:'Entregar relatório na van'}); PN_ENTIDADES.forEach(e=>it.push({ic:e.ic,l:'Identificar: '+e.n,dis:c.pos!==0||c.pistas.length<3,on:()=>confirmBox('Entregar relatório?',`Minha conclusão é: ${e.n}. Um erro compromete o pagamento.`, 'Entregar',()=>act(()=>pnFinalizar(e.id),'Resultado'))}));
 it.push({l:'Abandonar contrato',s:'Sem pagamento',on:()=>confirmBox('Abandonar investigação?','Vou sair sem pagamento e perder reputação.','Abandonar',()=>act(()=>pnFinalizar(null,true),'Contrato'))}); return {title:'Investigação paranormal',items:it}; };
V.paranormal=(o=>()=>{ const r=o(); r.items.unshift({ic:'🔦',l:'Trabalhar com investigação paranormal',s:'Contratos, fama, exorcismos e bestiário',on:()=>UI.push(V.paraProf)}, {ic:'📖',l:'Bestiário',on:()=>UI.push(V.paraBest)}); return r; })(V.paranormal);
V.career=(o=>()=>{ const r=o(); if(pnPode()&&r&&r.items) r.items.push({ic:'👻',l:'Investigador paranormal',s:'Carreira autônoma · pagamento por contrato',on:()=>UI.push(V.paraProf)}); return r; })(V.career);
yearMoney=(o=>function(){ const r=o.apply(this,arguments); if(pnPode()&&S.me.para&&S.me.para.prof&&pn().ativa){ const p=pn(); if(p.caso) pnFinalizar(null,true); pnOfertas(); log(p.rep>=20?'Meu nome circulou entre quem acredita no sobrenatural. Chegaram novos pedidos de investigação e expulsão.':'Chegaram novos pedidos à minha agenda de investigação paranormal.'); } return r; })(yearMoney);

// ===== Enfermidades fictícias exclusivas de criaturas =====
const PN_DOENCAS={
 sangue_cinzento:{n:'Síndrome do sangue cinzento',criatura:'vampiro',dmg:9,hap:3,p:.045,cure:'doc',doc:0,trat:'Transfusão alquímica',c:1800,sx:'O sangue que bebo perdeu o gosto e minhas veias ficaram acinzentadas.'},
 necrose_solar:{n:'Necrose solar',criatura:'vampiro',dmg:12,p:.035,cure:'doc',doc:0,trat:'Bálsamo noturno',c:1200,sx:'As queimaduras de sol não fecham, mesmo depois de noites em repouso.'},
 febre_lunar:{n:'Febre lunar',criatura:'lobisomem',dmg:8,hap:4,p:.05,cure:'doc',doc:0,trat:'Infusão de acônito encantado',c:900,sx:'Tenho febre e meus ossos estalam mesmo longe da lua cheia.'},
 prata_sangue:{n:'Intoxicação argêntea',criatura:'lobisomem',dmg:13,p:.03,cure:'doc',doc:0,trat:'Extração ritual da prata',c:1600,sx:'Uma ferida antiga arde e veios prateados surgiram sob minha pele.'}
};
Object.entries(PN_DOENCAS).forEach(([id,d])=>{ DISEASES[id]=d; SINT[id]=[d.sx]; });
addDisease=(o=>function(id){ const d=PN_DOENCAS[id]; if(d&&(S.scen||S.me.criatura!==d.criatura)) return; return o(id); })(addDisease);
function pnTratar(id){ const m=S.me,d=m.dis.find(x=>x.id===id),def=PN_DOENCAS[id]; if(!d||!def||!m.alive) return 'Não tenho essa doença.';
 if(!canPay(def.c)) return `O tratamento custa ${fmt(def.c)}.`; if(use('pn_trat_'+id)>1) return 'Só posso fazer um tratamento deste tipo por ano.'; m.money-=def.c; d.k=true;
 if(R.chance(.8)){ m.dis=m.dis.filter(x=>x!==d); st('health',10); return `${def.trat}: me curei de ${def.n.toLowerCase()}.`; } return `${def.trat}: a doença foi identificada, mas o tratamento não funcionou desta vez.`; }
treat=(o=>function(where,d){ if(PN_DOENCAS[d.id]) return 'A medicina comum não reconhece essa enfermidade. Procure a clínica sobrenatural no menu Saúde.'; return o(where,d); })(treat);
V.health=(o=>()=>{ const r=o(); if(S.me.criatura) r.items.push({ic:'🧪',l:'Clínica sobrenatural',s:'Doenças de vampiros e lobisomens',on:()=>UI.push(V.paraSaude)}); return r; })(V.health);
V.paraSaude=()=>({title:'Clínica sobrenatural',items:[{html:'Enfermidades da maldição exigem tratamentos próprios. Cada tratamento tem 80% de chance e pode ser tentado uma vez por ano.'},...S.me.dis.filter(d=>PN_DOENCAS[d.id]).map(d=>{ const def=PN_DOENCAS[d.id]; return {ic:'🧪',l:d.k===false?'Investigar sintomas sobrenaturais':def.n,s:`${d.k===false?d.sx:def.trat} · ${fmt(def.c)}`,on:()=>act(()=>pnTratar(d.id),'Clínica sobrenatural')}; }),...(!S.me.dis.some(d=>PN_DOENCAS[d.id])?[{html:'Não há sintomas sobrenaturais para tratar.'}]:[])]});
yearHealth=(o=>function(){ const m=S.me; m.dis=m.dis.filter(d=>!PN_DOENCAS[d.id]||PN_DOENCAS[d.id].criatura===m.criatura); return o.apply(this,arguments); })(yearHealth);
