// ===== 2.18: os sistemas conversam entre si =====
// Empresa, facção, polícia, super-herói, criaturas, fama, realeza, militar, lutador e atleta, guerra e investigação
// paranormal passam a se encontrar: cada ligação é um evento que só aparece quando os dois lados existem na vida.
// cx() registra a ligação; o gancho do ano sorteia no máximo duas por ano, cada uma com o próprio intervalo.

const CX={};
const cxLabel=(c,m,d)=>typeof c[0]==='function'?c[0](m,d):c[0];
function cx(o){ CX[o.id]=o; const ev={
    prep:()=>{ const m=S.me; try{ if(!o.when(m)) return null; return o.prep?o.prep(m):{}; }catch(e){ return null; } },
    show:d=>{ const m=S.me; d=d||{}; return {k:o.k,t:o.t,x:typeof o.x==='function'?o.x(m,d):o.x,ch:o.ch.filter(c=>!c[3]||c[3](m,d)).map(c=>[cxLabel(c,m,d),c[1]])}; },
    pick:(k,d)=>{ const c=o.ch.find(x=>x[1]===k); if(!c) return ''; return c[2](S.me,d||{})||''; }};
  if(o.scen){ Object.assign(ev,{scen:o.scen,w:o.w||1.2,cd:o.cd||40,when:m=>{ try{ return !!o.when(m); }catch(e){ return false; } }}); EVENTS['cxh_'+o.id]=ev; }
  else EVENTS['cx_'+o.id]=ev; }
const cxPessoa=(m,rels)=>R.pick(people(...rels).filter(p=>p.alive&&p.age>=16)||[]);
const cxPessoaD=(m,rels)=>{ const p=cxPessoa(m,rels); return p?{pid:p.id}:null; };
const cxP=d=>P(d.pid);
const eFac=m=>!!(m.job&&m.job.spc==='crime');
const ePol=m=>!!(m.job&&m.job.id==='poli');
const eFama=m=>!!(m.job&&['ator','musico','modelo','comedia','escritor','artista','streamer','dj'].includes(m.job.spc))&&m.fame>=25;
const eMil=m=>!!(m.job&&m.job.spc==='militar');
const eLut=m=>!!(m.job&&m.job.spc==='lutador');
const eAtl=m=>!!(m.job&&m.job.spc==='atleta');
const eRei=m=>!!(m.royal&&!m.royal.abd);
const eSeita=m=>!!(m.seita&&!m.seita.membro);
const eCri=m=>!!m.criatura;
const ePara=m=>!!(m.para&&m.para.prof&&m.para.prof.ativa);
const eGuerraAqui=m=>{ const G=typeof guerraAtual==='function'&&guerraAtual(); return !!(G&&ladoDe(G,m.country)); };
const eChefe=m=>typeof chefeEstado==='function'&&!!chefeEstado(m);
const cxBiz=(m,v)=>{ if(m.biz) m.biz.value=Math.max(0,Math.round((m.biz.value||0)*v)); };
const cxApr=(m,v)=>{ if(m.office) m.office.appr=clamp(m.office.appr+v); };
const cxExp=v=>{ if(typeof criExpor==='function') criExpor(v); };
const novoBiz=(m,n,sector,value)=>{ m.biz={n,sector,value,emp:R.int(3,12),yrs:0}; m.c.biz=1; };

// ---------- empresa ----------
cx({id:'biz_lavagem',k:'Empresa',t:'💼 Dinheiro sujo na empresa',p:.3,cd:4,when:m=>!!m.biz&&(eFac(m)||eSeita(m)||!!m.office),
  x:m=>`${eFac(m)?'O patrão da facção':eSeita(m)?`O tesoureiro de ${m.seita.n}`:'Um operador de propinas do governo'} quer passar dinheiro pela ${m.biz.n}: notas frias, clientes que não existem e muito lucro "limpo".`,
  setup:m=>{ novoBiz(m,'Loja Teste','Lanchonete',300000); m.job={spc:'crime',lvl:2,perf:60,yrs:1,co:'Facção'}; },
  ch:[['Lavar o dinheiro','sim',m=>{ const v=R.int(80000,400000); m.money+=Math.round(v*.2); cxBiz(m,1.15); m.karma=clamp(m.karma-8); if(R.chance(.25)){ cxBiz(m,.5); arrest('lavagem de dinheiro',3,10); return 'A Receita cruzou as notas. A empresa foi bloqueada e a polícia chegou cedo.'; } return `Passei ${fmt(v)} pelo caixa. Fiquei com ${fmt(Math.round(v*.2))} de comissão.`; }],
    ['Recusar','nao',m=>{ if(eFac(m)&&R.chance(.35)){ cxBiz(m,.8); st('health',-10); return 'Recusei. Na semana seguinte, a loja amanheceu com a vitrine quebrada e um recado.'; } return 'Recusei com educação. Ninguém insistiu, por enquanto.'; }],
    ['Denunciar à polícia','denunciar',m=>{ m.karma=clamp(m.karma+10); if(eFac(m)){ if(R.chance(.4)){ die('executad'+oa()+' pela facção depois de denunciar'); return 'A facção descobriu quem denunciou.'; } endJob(); return 'Denunciei e saí da facção no mesmo dia. Agora ando olhando para trás.'; } if(eSeita(m)) m.seita.susp=clamp(m.seita.susp+15); cxApr(m,-5); return 'Denunciei. Virei testemunha protegida de um esquema que eu mesmo conhecia bem.'; }]]});
cx({id:'biz_campanha',k:'Empresa',t:'🗳️ A empresa e a campanha',p:.3,cd:4,when:m=>!!m.biz&&m.age>=21,
  x:m=>m.office?`Posso usar a ${m.biz.n} para bancar a minha próxima campanha. Ninguém precisa saber de onde veio o dinheiro.`:`Um candidato a ${R.pick(['prefeito','governador','senador'])} quer uma "doação" da ${m.biz.n}. Em troca, promete contratos.`,
  setup:m=>{ novoBiz(m,'Construtora Teste','Construtora',900000); m.office={id:'dep',yrs:1,appr:50}; },
  ch:[[m=>m.office?'Usar o caixa da empresa na campanha':'Doar e cobrar os contratos depois','caixa',m=>{ cxBiz(m,.85); if(m.office){ cxApr(m,10); if(R.chance(.25)){ cxApr(m,-25); return 'O caixa dois vazou na imprensa. A oposição pediu a minha cassação.'; } return 'Panfletos, carros de som e jingle novo. A aprovação subiu.'; } if(R.chance(.6)){ cxBiz(m,1.4); return 'O candidato ganhou. Os contratos chegaram, sem licitação.'; } return 'O candidato perdeu. O dinheiro também.'; }],
    ['Doar dentro da lei','legal',m=>{ cxBiz(m,.97); m.karma=clamp(m.karma+3); if(m.office) cxApr(m,3); return 'Doação registrada, recibo e tudo. Pouco dinheiro, nenhuma dor de cabeça.'; }],
    ['Ficar fora da política','fora',()=> 'A empresa fica longe de política. Por enquanto.']]});
cx({id:'biz_governo',k:'Empresa',t:'📑 Licitação do governo',p:.25,cd:5,when:m=>!!m.biz&&(!!m.office||eChefe(m)),
  x:m=>`Uma obra pública de ${fmt(R.int(2,30)*1e6)} vai para licitação. Sou eu quem decide, e a ${m.biz.n} está na disputa.`,
  setup:m=>{ novoBiz(m,'Construtora Teste','Construtora',900000); m.office={id:'gov',yrs:1,appr:50}; },
  ch:[['Dar a obra para a minha empresa','minha',m=>{ cxBiz(m,1.6); m.karma=clamp(m.karma-10); if(R.chance(.35)){ cxApr(m,-20); arrest('fraude em licitação',2,8); return 'O Ministério Público achou o meu nome nos dois lados do contrato.'; } return 'A minha empresa venceu com o "melhor preço". A obra está atrasada.'; }],
    ['Me declarar impedido e sair da disputa','limpo',m=>{ m.karma=clamp(m.karma+6); cxApr(m,4); return 'Deixei a licitação correr sem mim. A imprensa elogiou; o meu sócio, não.'; }]]});
cx({id:'biz_guerra',k:'Empresa',t:'🪖 A empresa em tempo de guerra',p:.4,cd:3,when:m=>!!m.biz&&eGuerraAqui(m),
  x:m=>`O país está em guerra. A ${m.biz.n} perdeu clientes, mas o exército está comprando tudo o que aparece.`,
  setup:m=>{ novoBiz(m,'Fábrica Teste','Construtora',900000); S.guerra=null; guerraIniciar(m.country,m.country==='AR'?'BR':'AR','teste'); },
  ch:[['Produzir para o exército','exercito',m=>{ cxBiz(m,1.5); m.money+=R.int(50000,300000); m.karma=clamp(m.karma-5); return 'Fardas, botas e munição saindo pela porta dos fundos. Nunca lucrei tanto.'; }],
    ['Doar para os refugiados','doar',m=>{ cxBiz(m,.85); m.karma=clamp(m.karma+12); m.fame=clamp(m.fame+3); return 'Abri o galpão para as famílias que fugiram da fronteira.'; }],
    ['Fechar até a guerra acabar','fechar',m=>{ cxBiz(m,.6); return 'Demiti quase todo mundo e passei a chave. Espero ter para onde voltar.'; }]]});
cx({id:'biz_sancoes',k:'Empresa',t:'🚫 Sanções e a empresa',p:.4,cd:3,when:m=>!!m.biz&&!!m.imperio&&Object.values(m.imperio.p||{}).some(v=>v>=3),
  x:m=>`Com o meu império crescendo, o mundo fechou portos e bancos para empresas do meu país. A ${m.biz.n} sente primeiro.`,
  setup:m=>{ novoBiz(m,'Exportadora Teste','Construtora',900000); m.office={id:'pres',yrs:1,appr:60}; m.imperio={p:{PT:3},ameaca:0,anos:1,extra:0}; },
  ch:[['Abrir filiais nos países que domino','filiais',m=>{ cxBiz(m,1.3); return 'Filiais em cada país que obedece a mim. Concorrência, ninguém se atreve.'; }],
    ['Registrar a empresa num paraíso fiscal','offshore',m=>{ cxBiz(m,1.05); m.karma=clamp(m.karma-4); return 'Uma caixa postal nas ilhas e um sócio de fachada. As sanções passaram longe.'; }],
    ['Aguentar o prejuízo','aguentar',m=>{ cxBiz(m,.7); return 'Perdi um terço do valor da empresa. Patriotismo custa caro.'; }]]});
cx({id:'biz_seita',k:'Empresa',t:'🛐 A fé e os negócios',p:.3,cd:4,when:m=>!!m.biz&&eSeita(m),
  x:m=>`${m.seita.n} tem ${m.seita.fieis.toLocaleString('pt-BR')} fiéis, e a ${m.biz.n} precisa de clientes e funcionários.`,
  setup:m=>{ novoBiz(m,'Loja Teste','Lanchonete',300000); seitaFundar('igreja','Teste'); m.seita.fieis=3000; },
  ch:[['Pedir aos fiéis que comprem só de nós','comprar',m=>{ cxBiz(m,1.35); m.seita.devo=clamp(m.seita.devo-6); return 'Na saída do culto, fila no caixa. "Comprar aqui também é oração."'; }],
    ['Contratar só fiéis, sem carteira assinada','contratar',m=>{ cxBiz(m,1.2); m.seita.susp=clamp(m.seita.susp+12); m.karma=clamp(m.karma-8); return 'Os fiéis trabalham de graça "pelo ministério". O Ministério do Trabalho já ligou.'; }],
    ['Separar a fé dos negócios','separar',m=>{ m.karma=clamp(m.karma+3); return 'Uma coisa é uma coisa. Os fiéis respeitaram.'; }]]});
cx({id:'fama_marca',k:'Fama',t:'🏷️ A minha própria marca',p:.3,cd:6,when:m=>eFama(m)&&!m.biz&&m.money>=50000,
  x:m=>`Com ${m.fame}% de fama, uma empresa quer lançar uma linha com o meu nome: ${R.pick(['perfume','tênis','maquiagem','energético','roupas'])}.`,
  setup:m=>{ m.job={spc:'musico',lvl:3,perf:60,yrs:3,co:'Gravadora'}; m.fame=60; m.money=200000; m.biz=null; },
  ch:[['Abrir a minha própria empresa','abrir',m=>{ const c=50000; m.money-=c; novoBiz(m,`Marca ${m.first}`,'Loja de roupas',Math.round(c*(1+m.fame/40))); log(`Abri a marca ${m.biz.n}.`,'good'); return `A ${m.biz.n} esgotou o primeiro lote em três horas.`; }],
    ['Só licenciar o nome','licenciar',m=>{ const v=Math.round(m.fame*R.int(2000,6000)); m.money+=v; return `Assinei o contrato e recebi ${fmt(v)}. Nem precisei sair de casa.`; }],
    ['Recusar','nao',()=> 'Prefiro que o meu nome fique no meu trabalho.']]});
cx({id:'cri_negocio',k:'Criatura',t:'🌙 Um negócio da noite',p:.25,cd:6,when:m=>eCri(m)&&!m.biz&&m.money>=40000&&m.age>=18,
  x:m=>m.criatura==='vampiro'?'Quem não pode ver o sol entende de noite. Um ponto comercial abandonado daria uma boate perfeita, ou um "banco de sangue" muito particular.':'Lobisomem entende de mata. Uma pousada no meio do mato seria o esconderijo perfeito nas noites de lua cheia.',
  setup:m=>{ m.criatura='vampiro'; m.money=100000; m.biz=null; },
  ch:[[m=>m.criatura==='vampiro'?'Abrir uma boate que só funciona à noite':'Abrir uma pousada no meio da mata','abrir',m=>{ m.money-=40000; novoBiz(m,m.criatura==='vampiro'?'Boate Eclipse':'Pousada Lua Cheia',m.criatura==='vampiro'?'Lanchonete':'Academia',90000); m.fomeP=clamp((m.fomeP||0)-10); return `Inaugurei a ${m.biz.n}. Ninguém estranha o dono que só aparece depois do pôr do sol.`; }],
    ['Deixar para lá','nao',()=> 'Melhor não chamar atenção com um negócio.']]});

// ---------- facção ----------
cx({id:'fac_politico',k:'Facção',t:'🗳️ A facção quer um político',p:.3,cd:5,when:m=>eFac(m)&&m.job.lvl>=3,
  x:m=>'O patrão quer gente nossa na Câmara: proteção contra operações e verba para as obras do bairro. Alguém tem que ser o candidato, ou o financiador.',
  setup:m=>{ m.job={spc:'crime',lvl:4,perf:60,yrs:3,co:'Facção'}; m.age=30; },
  ch:[['Eu mesmo me candidato a vereador','candidato',m=>{ if(m.age<18) return ''; if(R.chance(.45+m.fame/200)){ endJob(); m.office={id:'ver',yrs:0,appr:55}; m.c.exFac=1; log('Fui eleito vereador com os votos do morro.','big'); return 'Fui eleito com os votos do morro. Na Câmara, todo mundo sabe de onde eu vim, e ninguém fala.'; } return 'Perdi a eleição. A polícia passou a me vigiar ainda mais.'; }],
    ['Financiar a campanha de um aliado','financiar',m=>{ m.money-=Math.min(m.money,80000); m.c.facPolitico=S.year+6; return 'O nosso candidato ganhou. Agora a gente sabe das operações com uma semana de antecedência.'; }],
    ['Ficar longe da política','fora',m=>{ m.job.perf=clamp(m.job.perf-10); return 'O patrão não gostou. "Quem não ajuda, atrapalha."'; }]]});
cx({id:'fac_policial',k:'Facção',t:'👮 Um policial à venda',p:.3,cd:5,when:m=>eFac(m)&&m.job.lvl>=2,
  x:'Um policial do batalhão do bairro mandou recado: por uma mesada, ele avisa das operações e some com ocorrências.',
  setup:m=>{ m.job={spc:'crime',lvl:3,perf:60,yrs:3,co:'Facção'}; },
  ch:[[`Pagar a mesada (${fmt(30000)} por ano)`,'pagar',m=>{ if(m.money<30000) return 'Não tinha o dinheiro. O policial foi oferecer o serviço para a facção rival.'; m.money-=30000; m.c.copProt=S.year+3; return 'Fechado. Na próxima operação, o morro estava vazio quando a polícia chegou.'; }],
    ['Desconfiar e recusar','nao',()=> 'Policial que se vende para um vende para todos.'],
    ['Ameaçar a família dele','ameacar',m=>{ m.karma=clamp(m.karma-12); if(R.chance(.5)){ m.c.copProt=S.year+3; return 'Agora ele trabalha para mim de graça, e com medo.'; } arrest('ameaça a agente público',2,6); return 'Ele gravou a conversa.'; }]]});
arrest=(o=>function(crime){ const m=S.me; if(m&&m.c&&m.c.copProt>=S.year&&R.chance(.5)){ log(`O policial comprado sumiu com a ocorrência de ${crime}.`,'warn'); return; } return o.apply(this,arguments); })(arrest);
cx({id:'fac_seita',k:'Facção',t:'⛪ O templo no território',p:.3,cd:5,when:m=>eSeita(m)&&m.seita.fieis>=200,
  x:m=>`O templo de ${m.seita.n} fica no território de uma facção. O gerente da boca apareceu no culto: quer uma "taxa de proteção".`,
  setup:m=>{ seitaFundar('igreja','Teste'); m.seita.fieis=900; m.seita.caixa=100000; },
  ch:[['Pagar a taxa','pagar',m=>{ m.seita.caixa=Math.max(0,m.seita.caixa-Math.round(m.seita.caixa*.15)); return 'Pagamos. Ninguém mais mexe com os nossos fiéis.'; }],
    ['Converter os traficantes','converter',m=>{ if(R.chance(.35+m.seita.devo/300)){ m.seita.fieis+=R.int(20,80); m.seita.fama=clamp(m.seita.fama+6); return 'O gerente se batizou no domingo. Metade da boca veio junto.'; } m.seita.fieis=Math.round(m.seita.fieis*.9); return 'Riram de mim e fecharam a rua do templo por um mês.'; }],
    ['Denunciar à polícia','denunciar',m=>{ m.seita.susp=clamp(m.seita.susp+5); if(R.chance(.3)){ st('health',-20); return 'A polícia prendeu dois. A facção queimou a porta do templo.'; } return 'A operação limpou a rua. Os fiéis voltaram a vir à noite.'; }]]});
cx({id:'fac_guerra',k:'Facção',t:'📦 Contrabando de guerra',p:.4,cd:3,when:m=>eFac(m)&&eGuerraAqui(m),
  x:'Com a guerra, falta de tudo: remédio, combustível, comida. A facção quer controlar o mercado negro.',
  setup:m=>{ m.job={spc:'crime',lvl:3,perf:60,yrs:3,co:'Facção'}; S.guerra=null; guerraIniciar(m.country,m.country==='AR'?'BR':'AR','teste'); },
  ch:[['Vender tudo pelo triplo','lucro',m=>{ const v=R.int(40000,250000); m.money+=v; m.karma=clamp(m.karma-12); m.job.perf=clamp(m.job.perf+15); return `Remédio pelo triplo do preço. Lucrei ${fmt(v)} e não consigo olhar as filas.`; }],
    ['Distribuir no bairro','distribuir',m=>{ m.karma=clamp(m.karma+12); m.fame=clamp(m.fame+3); m.job.perf=clamp(m.job.perf-10); return 'O morro inteiro comeu naquele inverno. O patrão disse que eu fiquei mole.'; }]]});
cx({id:'luta_arranjada',k:'Lutas',t:'💰 Luta arranjada',p:.3,cd:4,when:m=>eLut(m)||eAtl(m),
  x:m=>`Um homem de terno me procurou no ${eLut(m)?'vestiário':'estacionamento do clube'}: a facção apostou alto contra mim. Se eu ${eLut(m)?'cair no segundo round':'errar um pênalti'}, ganho uma fortuna.`,
  setup:m=>{ m.job={spc:'lutador',lvl:2,perf:60,yrs:2,co:'Evento'}; },
  ch:[['Aceitar e perder de propósito','aceitar',m=>{ const v=R.int(50000,400000); m.money+=v; m.karma=clamp(m.karma-10); m.job.perf=clamp(m.job.perf-15); if(R.chance(.2)){ arrest('manipulação de resultado',1,4); endJob(); return 'A federação analisou as apostas. Fui banido e preso.'; } return `Caí quando tinha que cair. Ganhei ${fmt(v)} e perdi o respeito da torcida.`; }],
    ['Recusar e ganhar mesmo assim','recusar',m=>{ m.job.perf=clamp(m.job.perf+5); if(R.chance(.3)){ st('health',-20); return 'Ganhei. Na saída, me esperavam três caras no estacionamento.'; } return 'Ganhei. O homem de terno sumiu, e o dinheiro da facção também.'; }],
    ['Contar para a federação','contar',m=>{ m.karma=clamp(m.karma+8); m.fame=clamp(m.fame+5); return 'A federação abriu uma investigação. Virei exemplo, e alvo.'; }]]});

// ---------- polícia ----------
cx({id:'pol_parente',k:'Polícia',t:'🚔 O suspeito é da família',p:.3,cd:5,when:m=>ePol(m)&&!!cxPessoa(m,['irmao','filho','primo','tio','pai','mae']),
  prep:m=>cxPessoaD(m,['irmao','filho','primo','tio','pai','mae']),
  x:(m,d)=>{ const p=cxP(d); return `O caso que caiu na minha mesa tem um suspeito: ${p?`${relLabel(p).toLowerCase()} ${fullName(p)}`:'alguém da minha família'}. As provas apontam para ${p&&p.gender==='F'?'ela':'ele'}.`; },
  setup:m=>{ m.job={id:'poli',lvl:3,perf:60,yrs:3,co:'Polícia Civil'}; S.people.push(mkPerson({rel:'irmao',age:30,bond:60})); },
  ch:[['Prender, como qualquer outro','prender',(m,d)=>{ const p=cxP(d); if(p) p.bond=clamp((p.bond||50)-50); m.job.perf=clamp(m.job.perf+15); m.karma=clamp(m.karma+5); return `Algemei ${p?p.first:'meu parente'} na frente da família. No almoço de domingo, ninguém me olha.`; }],
    ['Avisar para fugir','avisar',(m,d)=>{ const p=cxP(d); if(p) p.bond=clamp((p.bond||50)+20); if(R.chance(.3)){ endJob(); arrest('favorecimento pessoal',1,3); return 'A corregedoria grampeou o meu telefone.'; } return `${p?p.first:'Meu parente'} sumiu na véspera da operação. O delegado desconfia de mim.`; }],
    ['Sumir com as provas','sumir',(m,d)=>{ m.karma=clamp(m.karma-10); m.job.perf=clamp(m.job.perf-10); if(R.chance(.25)){ endJob(); return 'O perito tinha uma cópia. Fui expulso da corporação.'; } return 'O caso foi arquivado por falta de provas. Eu sei que não faltaram.'; }]]});
cx({id:'pol_seita',k:'Polícia',t:'🛐 Investigar uma seita',p:.3,cd:5,when:m=>ePol(m),
  x:m=>eSeita(m)?`A delegacia abriu inquérito contra ${m.seita.n}. O meu grupo. E o caso caiu justamente comigo.`:'Denúncias de cárcere privado num sítio de um grupo religioso. O delegado quer que eu me infiltre.',
  setup:m=>{ m.job={id:'poli',lvl:3,perf:60,yrs:3,co:'Polícia Civil'}; },
  ch:[[m=>eSeita(m)?'Arquivar o inquérito':'Me infiltrar como fiel','a',m=>{ if(eSeita(m)){ m.seita.susp=clamp(m.seita.susp-20); m.karma=clamp(m.karma-6); if(R.chance(.25)){ endJob(); return 'A corregedoria descobriu que o investigado era eu mesmo.'; } return 'Arquivei por "falta de materialidade". Ninguém perguntou mais nada.'; }
      if(R.chance(.55)){ m.job.perf=clamp(m.job.perf+20); m.fame=clamp(m.fame+4); return 'Três meses de cultos falsos. No fim, a operação libertou quarenta pessoas.'; } st('happy',-8); return 'O líder me olhou nos olhos e disse: "Eu sei quem você é." Saí de lá sem prova nenhuma.'; }],
    [m=>eSeita(m)?'Passar o caso para um colega':'Invadir o sítio com um mandado','b',m=>{ if(eSeita(m)){ m.seita.susp=clamp(m.seita.susp+10); return 'Passei o caso adiante. Agora é um colega que vai bater na porta do meu templo.'; } m.job.perf=clamp(m.job.perf+(R.chance(.5)?15:-5)); return 'Entramos de madrugada. Achamos documentos, armas e muito dinheiro em espécie.'; }]]});
cx({id:'pol_criatura',k:'Polícia',t:'🐺 Ataques na lua cheia',p:.25,cd:6,when:m=>ePol(m)&&m.age>=18,
  x:m=>eCri(m)?'Corpos com marcas de garras em todas as noites de lua cheia. O delegado quer um culpado. E eu sei que pode ser alguém como eu, ou eu mesmo.':'Corpos com marcas de garras em todas as noites de lua cheia. Os peritos falam em "cão de grande porte". Eu não acredito.',
  setup:m=>{ m.job={id:'poli',lvl:3,perf:60,yrs:3,co:'Polícia Civil'}; m.age=30; },
  ch:[['Montar tocaia na noite de lua cheia','tocaia',m=>{ if(eCri(m)){ m.job.perf=clamp(m.job.perf+10); return 'Achei a fera: outro lobisomem, selvagem. Ninguém mais morreu, e o relatório diz "animal abatido".'; } if(R.chance(.5)){ m.job.perf=clamp(m.job.perf+15); return 'Vi a coisa com os meus próprios olhos. Dei dois tiros e ela fugiu para a mata. Ninguém acreditou no relatório.'; } st('health',-25); if(R.chance(.25)&&typeof virar==='function'){ virar('lobisomem','a fera da tocaia'); return 'A fera me pegou antes que eu pudesse atirar. A mordida queimou como fogo.'; } return 'A fera me derrubou e sumiu. Acordei no hospital.'; }],
    ['Chamar um investigador paranormal','chamar',m=>{ m.job.perf=clamp(m.job.perf+5); return 'Uma investigadora paranormal veio com um baú de prata. Em uma semana, os ataques pararam.'; }],
    ['Fechar o caso como ataque de cão','fechar',()=> 'Caso encerrado: "cão de grande porte, não localizado". Os ataques continuam.']]});
cx({id:'pol_politico',k:'Polícia',t:'🏛️ Operação contra um político',p:.25,cd:6,when:m=>ePol(m)&&m.job.lvl>=2,
  x:()=>`As escutas pegaram o ${R.pick(['prefeito','governador','senador','deputado mais votado do estado'])} recebendo propina. A operação sai amanhã, se eu assinar.`,
  setup:m=>{ m.job={id:'poli',lvl:3,perf:60,yrs:3,co:'Polícia Civil'}; },
  ch:[['Assinar e deflagrar a operação','assinar',m=>{ m.job.perf=clamp(m.job.perf+20); m.fame=clamp(m.fame+8); if(R.chance(.25)){ m.job.perf=clamp(m.job.perf-30); return 'A operação saiu, e eu fui transferido para uma delegacia no interior no mês seguinte.'; } return 'Helicóptero, câmeras e um político algemado no jornal da noite. Virei herói por uma semana.'; }],
    ['Vazar para a imprensa antes','vazar',m=>{ m.fame=clamp(m.fame+4); if(R.chance(.4)){ m.job.perf=clamp(m.job.perf-20); return 'O político fugiu para o exterior na véspera. Sobrou para mim.'; } return 'A matéria saiu junto com a operação. O caso ficou impossível de abafar.'; }],
    ['Aceitar o suborno e engavetar','suborno',m=>{ const v=R.int(100000,1000000); m.money+=v; m.karma=clamp(m.karma-15); if(R.chance(.3)){ endJob(); arrest('corrupção passiva',3,10); return 'O político foi preso mesmo assim, e entregou quem tinha recebido.'; } return `Engavetei. ${fmt(v)} numa conta que não está no meu nome.`; }]]});

// ---------- investigador paranormal ----------
cx({id:'para_seita',k:'Paranormal',t:'🕯️ O caso da seita ocultista',p:.3,cd:5,when:m=>ePara(m),
  x:m=>eSeita(m)?`Um cliente quer que eu investigue "fenômenos" nos rituais de ${m.seita.n}. É a minha seita.`:'Um pai desesperado diz que a filha entrou para uma seita ocultista e que coisas estranhas acontecem nos rituais.',
  setup:m=>{ m.para={prova:0,vistos:{},visitas:3,prof:{ativa:true,rep:30,fe:12,resolvidos:2,ganhos:0,ano:null,ofertas:[],best:{},kit:0,caso:null}}; },
  ch:[[m=>eSeita(m)?'Forjar provas de que os milagres são reais':'Investigar os rituais','a',m=>{ const P0=m.para.prof; if(eSeita(m)){ m.seita.fieis+=R.int(50,300); m.seita.devo=clamp(m.seita.devo+10); P0.rep=clamp(P0.rep-10); return 'Meu laudo "comprovou" o sobrenatural. A seita encheu, e a minha reputação de investigador afundou.'; }
      if(R.chance(.5)){ P0.rep=clamp(P0.rep+12); m.karma=clamp(m.karma+6); return 'Os "fantasmas" eram projetores e fumaça. A filha voltou para casa.'; } P0.rep=clamp(P0.rep+6); st('happy',-6); return 'Os projetores existiam, mas uma das velas acendeu sozinha na minha frente. Não consigo explicar.'; }],
    [m=>eSeita(m)?'Recusar o caso':'Entregar o caso à polícia','b',()=> 'Tem caso que é melhor não pegar.']]});
cx({id:'para_policia',k:'Paranormal',t:'👮 A polícia pede ajuda',p:.3,cd:5,when:m=>ePara(m),
  x:'Um delegado me ligou de madrugada: um crime sem explicação, portas trancadas por dentro e um termômetro marcando vinte graus negativos.',
  setup:m=>{ m.para={prova:0,vistos:{},visitas:3,prof:{ativa:true,rep:30,fe:12,resolvidos:2,ganhos:0,ano:null,ofertas:[],best:{},kit:0,caso:null}}; },
  ch:[['Ajudar a polícia de graça','ajudar',m=>{ m.para.prof.rep=clamp(m.para.prof.rep+10); m.karma=clamp(m.karma+5); return 'Achei a pista que os peritos não viram. O delegado agora me liga sempre.'; }],
    [`Cobrar como consultor (${fmt(15000)})`,'cobrar',m=>{ m.money+=15000; m.para.prof.rep=clamp(m.para.prof.rep+5); return 'Laudo entregue e nota fiscal emitida. Virei consultor oficial.'; }],
    ['Recusar','nao',()=> 'Não trabalho para a polícia.']]});

// ---------- super-herói (dentro do modo) ----------
cx({id:'h_seita',scen:'heroi',k:'Superpoderes',t:'🛐 A seita e a capa',when:m=>eSeita(m),
  x:m=>`Os fiéis de ${m.seita.n} começaram a dizer que o herói mascarado da cidade é um enviado do líder. Eles não sabem que sou eu.`,
  setup:m=>{ seitaFundar('igreja','Teste'); },
  ch:[['Deixar a lenda crescer','lenda',m=>{ m.seita.fieis+=R.int(100,600); m.seita.devo=clamp(m.seita.devo+8); scStat('sec',-6); return 'Cada resgate virou sermão. A seita dobrou, e alguém começou a ligar os pontos.'; }],
    ['Desmentir em público','desmentir',m=>{ scStat('rep',5); m.seita.devo=clamp(m.seita.devo-5); return 'O herói deu entrevista: "Não trabalho para nenhuma igreja." Os fiéis ficaram confusos.'; }]]});
cx({id:'h_criatura',scen:'heroi',k:'Superpoderes',t:'🌙 Herói e criatura',when:m=>eCri(m),
  x:m=>`A ${m.job&&m.job.co?m.job.co:'equipe'} recebeu um alerta: ${m.criatura==='vampiro'?'um vampiro':'um lobisomem'} anda atacando na cidade. Mandaram justamente quem é um deles.`,
  setup:m=>{ m.criatura='lobisomem'; },
  ch:[['Caçar a outra criatura','cacar',()=>{ scStat('rep',10); scStat('san',-6); return 'Encontrei a criatura selvagem. Dois iguais lutando no telhado; só um voltou para casa.'; }],
    ['Contar para a equipe o que eu sou','contar',()=>{ scStat('sec',-15); scStat('rep',R.chance(.5)?8:-8); return 'Contei. Metade da equipe me abraçou; a outra metade pediu a minha transferência.'; }]]});
cx({id:'h_governo',scen:'heroi',k:'Superpoderes',t:'🏛️ O governo e os heróis',when:m=>!!m.office||eGuerraAqui(m),
  x:m=>m.office?'Como político e herói secreto, tenho na mesa o projeto que endurece a Lei de Registro. O meu voto decide.':'O país está em guerra, e o presidente quer convocar todos os heróis registrados para a frente de batalha.',
  setup:m=>{ m.office={id:'dep',yrs:1,appr:50}; },
  ch:[[m=>m.office?'Votar a favor da lei':'Ir para a frente de batalha','a',m=>{ if(m.office){ cxApr(m,6); scStat('rep',-6); return 'A lei passou com o meu voto. Agora eu mesmo tenho prazo para me registrar.'; } scStat('rep',12); if(typeof scHurt==='function') scHurt(R.int(10,20)); return 'Voei por cima das trincheiras. A guerra terminou mais cedo naquela frente.'; }],
    [m=>m.office?'Votar contra':'Me recusar a lutar numa guerra','b',m=>{ if(m.office){ cxApr(m,-4); scStat('rep',6); return 'Votei contra. Os heróis independentes me mandaram flores, sem saber por quê.'; } scStat('rep',-8); return 'Recusei. Os jornais me chamaram de covarde de capa.'; }]]});
cx({id:'h_familia_crime',scen:'heroi',k:'Superpoderes',t:'🚨 O assalto da família',when:m=>!!cxPessoa(m,['irmao','primo','filho']),
  prep:m=>cxPessoaD(m,['irmao','primo','filho']),
  x:(m,d)=>{ const p=cxP(d); return `Interrompi um assalto a banco e, quando arranquei a máscara do bandido, era ${p?p.first:'alguém da minha família'}.`; },
  setup:m=>{ S.people.push(mkPerson({rel:'irmao',age:28,bond:60})); },
  ch:[['Entregar à polícia','entregar',(m,d)=>{ const p=cxP(d); if(p) p.bond=clamp((p.bond||50)-40); scStat('rep',8); return 'Entreguei. A cidade aplaudiu o herói; em casa, ninguém fala comigo.'; }],
    ['Deixar fugir','fugir',(m,d)=>{ const p=cxP(d); if(p) p.bond=clamp((p.bond||50)+15); scStat('rep',-6); scStat('sec',-4); return 'Deixei fugir pela porta dos fundos. Uma câmera filmou o herói olhando para o outro lado.'; }]]});
scenEnd=(o=>function(win){ const sc=S.scen, m=S.me; const r=o.apply(this,arguments); if(sc&&sc.id==='heroi'&&!S.scen&&m){ m.c.exHeroi=1; } return r; })(scenEnd);
cx({id:'exheroi',k:'Superpoderes',t:'🦸 O passado de herói',p:.25,cd:6,when:m=>!!m.c.exHeroi&&m.age>=18,
  x:()=>R.pick(['A polícia descobriu quem era o herói mascarado que salvou a cidade anos atrás. O delegado quer conversar.','Um partido descobriu o meu passado de herói. Querem me lançar candidato.','Um vilão antigo saiu da prisão e mandou uma carta para o meu endereço verdadeiro.']),
  setup:m=>{ m.c.exHeroi=1; },
  ch:[['Assumir o passado em público','assumir',m=>{ m.fame=clamp(m.fame+20); if(R.chance(.4)&&!m.office&&m.age>=21){ m.office={id:'ver',yrs:0,appr:70}; log('Fui eleito vereador por ter sido herói.','big'); return 'A cidade lembrou do herói. Fui eleito vereador com votação recorde.'; } return 'Dei entrevista. Virei celebridade, e alvo.'; }],
    ['Negar tudo','negar',m=>{ if(R.chance(.3)){ st('health',-15); return 'Neguei, mas o vilão sabia onde eu morava.'; } return 'Neguei. Sem os poderes, ninguém acredita que eu já voei.'; }],
    ['Virar consultor da polícia','consultor',m=>{ m.money+=R.int(20000,60000); m.karma=clamp(m.karma+5); return 'Ensino os policiais a pensar como vilões. Paga bem.'; }]]});

// ---------- criaturas ----------
cx({id:'cri_trabalho',k:'Criatura',t:'☀️ O expediente de dia',p:.35,cd:4,when:m=>eCri(m)&&!!m.job&&!m.job.hero&&m.age>=16,
  x:m=>m.criatura==='vampiro'?'O chefe marcou uma reunião às duas da tarde, numa sala com janelões. O sol vai entrar direto em mim.':'A lua cheia cai bem na semana do inventário. O chefe quer todo mundo trabalhando de madrugada.',
  setup:m=>{ m.criatura='vampiro'; m.job={id:'adm',lvl:1,perf:55,yrs:1,co:'Empresa Teste'}; },
  ch:[['Pedir para trabalhar só no turno da noite','noite',m=>{ m.job.perf=clamp(m.job.perf-5); return 'Virei o funcionário da madrugada. Ninguém entende, mas ninguém reclama.'; }],
    ['Inventar uma desculpa e faltar','faltar',m=>{ m.job.perf=clamp(m.job.perf-12); return R.pick(['Falei que era alergia ao sol. O RH pediu atestado.','Faltei. O chefe disse que "isso se repete demais".']); }],
    [m=>m.criatura==='vampiro'?'Hipnotizar o chefe':'Ir trabalhar e torcer','enfrentar',m=>{ if(m.criatura==='vampiro'){ m.job.perf=clamp(m.job.perf+8); cxExp(3); return 'O chefe remarcou a reunião para as nove da noite e achou que a ideia foi dele.'; } if(R.chance(.4)){ cxExp(20); m.job.perf=clamp(m.job.perf-20); return 'Os ossos começaram a estalar no meio do depósito. Saí correndo, mas o segurança viu.'; } return 'Segurei a fera até o amanhecer, suando frio atrás das caixas.'; }]]});
cx({id:'cri_exame',k:'Criatura',t:'🩺 O exame de sangue',p:.35,cd:5,when:m=>eCri(m)&&(eAtl(m)||eLut(m)||eMil(m)||ePol(m)),
  x:m=>`${eAtl(m)||eLut(m)?'O exame antidoping':'O exame médico obrigatório'} voltou com resultados que o laboratório "nunca tinha visto": ${m.criatura==='vampiro'?'nenhuma célula viva no sangue':'níveis de hormônio de um animal selvagem'}.`,
  setup:m=>{ m.criatura='lobisomem'; m.job={spc:'atleta',lvl:2,perf:60,yrs:2,co:'Clube Teste'}; },
  ch:[['Subornar o laboratório','subornar',m=>{ const c=Math.min(m.money,R.int(10000,40000)); m.money-=c; return `Paguei ${fmt(c)}. O resultado virou "amostra contaminada".`; }],
    [m=>m.criatura==='vampiro'?'Hipnotizar o médico':'Pedir para repetir em outro dia','repetir',m=>{ if(m.criatura==='vampiro'&&R.chance(.7)) return 'O médico assinou o laudo sem nem olhar para ele.'; if(R.chance(.5)) return 'Na segunda coleta, longe da lua cheia, deu tudo normal.'; cxExp(20); if(eAtl(m)||eLut(m)){ endJob(); return 'Deu de novo. Fui suspenso por "doping de substância desconhecida".'; } return 'Deu de novo. Agora tem um cientista do governo querendo me estudar.'; }],
    ['Aceitar a suspensão e sumir por um tempo','sumir',m=>{ if(eAtl(m)||eLut(m)) m.job.perf=clamp(m.job.perf-25); return 'Saí de licença "por motivos pessoais". Melhor do que virar cobaia.'; }]]});
cx({id:'cri_seita',k:'Criatura',t:'🛐 Milagre ou maldição',p:.35,cd:4,when:m=>eCri(m)&&eSeita(m),
  x:m=>`Os fiéis de ${m.seita.n} começaram a notar coisas: ${m.criatura==='vampiro'?'eu não envelheço e nunca apareço de dia':'eu sumo em toda lua cheia e volto com arranhões'}.`,
  setup:m=>{ m.criatura='vampiro'; seitaFundar('igreja','Teste'); m.seita.fieis=900; },
  ch:[['Revelar como um milagre','milagre',m=>{ m.seita.devo=clamp(m.seita.devo+20); m.seita.fieis=Math.round(m.seita.fieis*1.3); m.seita.fama=clamp(m.seita.fama+10); cxExp(25); return m.criatura==='vampiro'?'"O profeta venceu a morte." O culto virou peregrinação.':'"O profeta vira a fera sagrada da lua." Os fiéis passaram a uivar no fim do culto.'; }],
    ['Transformar o círculo íntimo','transformar',m=>{ m.seita.devo=clamp(m.seita.devo+10); m.karma=clamp(m.karma-15); cxExp(10); if(typeof cri==='function'&&cri()) cri().bando=cri().bando||{n:m.seita.n,rank:3,rep:60}; return `Mordi os mais fiéis numa noite de ritual. Agora ${m.seita.n} tem um núcleo que nunca vai me trair, e nunca vai morrer.`; }],
    ['Esconder melhor','esconder',m=>{ m.seita.devo=clamp(m.seita.devo-4); return 'Passei a fazer os cultos só à noite e a faltar nas luas cheias com "retiros espirituais".'; }]]});
cx({id:'cri_convite_seita',k:'Criatura',t:'🦇 A seita das criaturas',p:.25,cd:6,when:m=>eCri(m)&&!m.seita&&m.age>=18,
  x:m=>`Um grupo secreto que venera ${m.criatura==='vampiro'?'vampiros':'lobisomens'} descobriu o que eu sou. Querem que eu seja o deus deles.`,
  setup:m=>{ m.criatura='lobisomem'; m.seita=null; m.age=30; },
  ch:[['Aceitar e liderar o grupo','liderar',m=>{ seitaFundar('apoc',m.criatura==='vampiro'?'Filhos da Noite Eterna':'Ordem da Lua Cheia'); if(m.seita){ m.seita.fieis=R.int(20,80); m.seita.devo=90; } cxExp(10); return 'Agora sou o deus vivo de um grupo que se reúne em porões. Eles fariam qualquer coisa por mim.'; }],
    ['Recusar e sumir','recusar',()=> 'Mudei de telefone e de bairro. Gente assim não costuma aceitar "não".']]});
cx({id:'cri_politica',k:'Criatura',t:'🧛 O político que não envelhece',p:.35,cd:5,when:m=>eCri(m)&&!!m.office,
  x:m=>m.criatura==='vampiro'?`Os jornais compararam as minhas fotos de posse de ${S.year-((m.office&&m.office.yrs)||0)-10} com as de hoje: nenhuma ruga. A oposição fala em "pacto com o diabo".`:'Uma foto minha numa noite de lua cheia, com os olhos amarelos, circula nos grupos da oposição.',
  setup:m=>{ m.criatura='vampiro'; m.office={id:'pres',yrs:2,appr:60}; },
  ch:[['Dizer que é genética e boa alimentação','genetica',m=>{ if(R.chance(.6)){ cxApr(m,2); return 'Lancei um livro de dieta. Virou best-seller.'; } cxApr(m,-8); cxExp(10); return 'Ninguém acreditou. Os memes não param.'; }],
    [m=>m.criatura==='vampiro'?'Hipnotizar os jornalistas':'Processar quem espalhou a foto','abafar',m=>{ cxApr(m,-2); if(m.criatura==='vampiro'){ cxExp(-10); return 'Os editores esqueceram a pauta. Um deles pediu demissão sem saber por quê.'; } return 'A Justiça mandou tirar do ar. O efeito Streisand fez o resto.'; }],
    [m=>m.criatura==='vampiro'&&m.office&&m.office.dit?'Me declarar governante eterno':'Fingir que estou envelhecendo','c',m=>{ if(m.criatura==='vampiro'&&m.office&&m.office.dit){ const r=regime(); if(r){ r.vitalicio=1; r.medo=clamp(r.medo+15); } m.c.eterno=1; return 'Mudei a constituição: o governante só sai quando morrer. Eu não morro.'; } return 'Maquiagem de rugas, cabelo pintado de branco. A plástica ao contrário.'; }]]});
cx({id:'cri_realeza',k:'Realeza',t:'👑 A dinastia da noite',p:.35,cd:6,when:m=>eCri(m)&&eRei(m),
  x:m=>`Na ${m.royal.house}, a família desconfia: ${m.criatura==='vampiro'?'o herdeiro do trono nunca envelhece':'o herdeiro some em toda lua cheia'}.`,
  setup:m=>{ m.criatura='vampiro'; m.royal={house:'Casa Teste',pop:60,reign:true,abd:false}; },
  ch:[['Transformar a família real','familia',m=>{ m.karma=clamp(m.karma-8); for(const k of kids().filter(k=>k.alive)) k.criatura=m.criatura; m.royal.pop=clamp(m.royal.pop-5); return 'Uma noite de lua no castelo. Agora a dinastia não acaba nunca.'; }],
    ['Contar só para o conselho real','conselho',m=>{ m.royal.pop=clamp(m.royal.pop+2); return 'O conselho jurou segredo. O mordomo-chefe já sabia há anos.'; }],
    ['Abdicar antes que descubram','abdicar',m=>{ m.royal.abd=true; return 'Abdiquei "por motivos de saúde". Ironia.'; }]]});
cx({id:'cri_guerra',k:'Criatura',t:'🪖 A fera e a guerra',p:.4,cd:3,when:m=>eCri(m)&&eGuerraAqui(m)&&m.age>=18,
  x:m=>`A guerra chegou perto. ${m.criatura==='lobisomem'?'Uma noite de lua cheia, na linha de frente, eu valeria por um batalhão inteiro.':'Na escuridão das trincheiras, ninguém enxerga como eu.'}`,
  setup:m=>{ m.criatura='lobisomem'; m.age=30; S.guerra=null; guerraIniciar(m.country,m.country==='AR'?'BR':'AR','teste'); },
  ch:[['Lutar como criatura','lutar',m=>{ const G=guerraAtual(), l=G&&ladoDe(G,m.country); if(G&&l) G.frente=Math.max(0,Math.min(100,G.frente+(l==='a'?8:-8))); m.fame=clamp(m.fame+5); cxExp(30); return 'Os soldados inimigos contam histórias da coisa que veio da mata. A frente andou.'; }],
    ['Proteger a minha cidade','cidade',m=>{ m.karma=clamp(m.karma+8); cxExp(10); return 'Nenhum saqueador passou da ponte do meu bairro naquele inverno.'; }],
    ['Ficar escondido','esconder',()=> 'Não é a minha guerra. Ou é, mas eu não posso ser visto.']]});
cx({id:'cri_escola',k:'Criatura',t:'🏫 Criatura na escola',p:.4,cd:3,when:m=>eCri(m)&&!!escCur(m)&&m.age<23,
  x:m=>m.criatura==='vampiro'?'A excursão da turma é para a praia, num dia de sol forte.':'A semana de provas cai bem na lua cheia, e a turma vai acampar no sábado.',
  setup:m=>{ m.criatura='lobisomem'; m.age=14; startSchool('fund'); },
  ch:[['Inventar uma desculpa e não ir','faltar',m=>{ st('happy',-4); return 'Fiquei em casa. A turma postou fotos o dia todo.'; }],
    ['Ir e me cuidar','ir',m=>{ if(R.chance(.35)){ cxExp(15); st('happy',-6); return m.criatura==='vampiro'?'Fiquei vermelh'+oa()+' como um camarão em dez minutos. Inventei uma alergia.':'Rosnei para um colega no meio da noite. Ele jurou que viu os meus olhos brilharem.'; } st('happy',6); return 'Deu tudo certo. Ninguém percebeu nada.'; }],
    ['Contar para o melhor amigo','contar',m=>{ const p=people('amigo','colega').find(x=>x.alive); if(p){ p.sabeCri=1; p.bond=clamp((p.bond||50)+10); } return 'Contei. Agora tenho alguém que me cobre nas noites difíceis.'; }]]});
cx({id:'cri_colega_para',k:'Paranormal',t:'🔎 O colega desconfia',p:.35,cd:5,when:m=>eCri(m)&&ePara(m),
  x:'Meu parceiro de investigação paranormal comparou as pistas de um caso com as minhas próprias marcas. Ele está me olhando diferente.',
  setup:m=>{ m.criatura='vampiro'; m.para={prova:0,vistos:{},visitas:3,prof:{ativa:true,rep:30,fe:12,resolvidos:2,ganhos:0,ano:null,ofertas:[],best:{},kit:0,caso:null}}; },
  ch:[['Contar a verdade','contar',m=>{ if(R.chance(.5)){ m.para.prof.rep=clamp(m.para.prof.rep+8); return 'Ele ficou em silêncio, depois riu: "Isso explica como você acha os vampiros tão rápido."'; } cxExp(25); m.para.prof.rep=clamp(m.para.prof.rep-15); return 'Ele saiu da sala e ligou para uma ordem de caçadores.'; }],
    ['Despistar com outro caso','despistar',m=>{ m.para.prof.rep=clamp(m.para.prof.rep-3); return 'Plantei pistas de outra criatura. Ele seguiu o rastro errado.'; }]]});
cx({id:'fama_criatura',k:'Fama',t:'📸 A celebridade que não envelhece',p:.35,cd:5,when:m=>eCri(m)&&eFama(m),
  x:m=>m.criatura==='vampiro'?'Uma revista publicou fotos minhas de quinze anos atrás ao lado das de hoje. Idênticas. "Qual é o segredo?"':'Um paparazzo me fotografou saindo da mata numa noite de lua cheia, de roupa rasgada.',
  setup:m=>{ m.criatura='vampiro'; m.job={spc:'ator',lvl:3,perf:60,yrs:3,co:'Estúdio'}; m.fame=60; },
  ch:[['Vender o "segredo" como produto','vender',m=>{ const v=R.int(80000,400000); m.money+=v; cxExp(8); return `Lancei um creme "da juventude eterna". Faturei ${fmt(v)}.`; }],
    ['Dizer que é tudo montagem','montagem',m=>{ cxExp(-5); return 'Os fãs acreditaram. Os paparazzi, não.'; }],
    ['Sumir dos holofotes por um tempo','sumir',m=>{ m.fame=clamp(m.fame-8); cxExp(-15); return 'Um ano sem aparecer. Quando voltei, ninguém lembrava das fotos.'; }]]});

// ---------- fama, realeza, militar, guerra ----------
cx({id:'fama_politica',k:'Fama',t:'🗳️ Celebridade candidata',p:.3,cd:6,when:m=>eFama(m)&&m.fame>=50&&!m.office&&m.age>=21,
  x:m=>`Um partido quer lançar a minha candidatura. Com ${m.fame}% de fama, eles dizem que eu ganho de qualquer político.`,
  setup:m=>{ m.job={spc:'ator',lvl:3,perf:60,yrs:3,co:'Estúdio'}; m.fame=70; m.age=35; m.office=null; },
  ch:[['Concorrer a deputado','dep',m=>{ if(R.chance(.35+m.fame/200)){ endJob(); m.office={id:'dep',yrs:0,appr:60}; log('Fui eleito deputado com votação recorde.','big'); return 'Votação recorde. No primeiro dia, assinei mais autógrafo do que projeto de lei.'; } m.fame=clamp(m.fame-5); return 'Perdi. Descobri que fama não é voto.'; }],
    ['Apoiar um candidato em troca de um cargo','apoiar',m=>{ m.money+=R.int(20000,80000); return 'Gravei um vídeo de apoio. O candidato ganhou e eu virei "embaixador cultural".'; }],
    ['Recusar','nao',()=> 'Política? Prefiro continuar sendo amad'+oa()+' por todos os lados.']]});
cx({id:'fama_seita',k:'Fama',t:'🛐 A seita quer a celebridade',p:.3,cd:6,when:m=>eFama(m)&&!eSeita(m)&&m.age>=18,
  x:()=>`${R.pick(['Uma igreja que cresce rápido','Um guru famoso','Um movimento espiritual de celebridades'])} me convidou para ser "embaixador da fé". Seguidores, dinheiro e uma mansão para retiros.`,
  setup:m=>{ m.job={spc:'musico',lvl:3,perf:60,yrs:3,co:'Gravadora'}; m.fame=60; m.seita=null; m.age=30; },
  ch:[['Aceitar','aceitar',m=>{ m.money+=R.int(50000,250000); m.fame=clamp(m.fame+4); m.karma=clamp(m.karma-4); return 'Agora apareço nos cultos ao vivo. Metade dos fãs entrou para a igreja; a outra metade parou de me seguir.'; }],
    ['Fundar a minha própria seita','fundar',m=>{ seitaFundar('guru',`Caminho de ${m.first}`); if(m.seita){ m.seita.fieis=Math.round(m.fame*R.int(10,40)); m.seita.fama=clamp(m.fame/2); } return 'Para que ser embaixador se posso ser o profeta? Os fãs viraram fiéis.'; }],
    ['Recusar','nao',()=> 'Fé, cada um tem a sua.']]});
cx({id:'fama_guerra',k:'Fama',t:'🎤 A guerra e o palco',p:.4,cd:3,when:m=>eFama(m)&&eGuerraAqui(m),
  x:'Com o país em guerra, a turnê foi cancelada e os estúdios fecharam. O exército quer que eu me apresente para as tropas.',
  setup:m=>{ m.job={spc:'musico',lvl:3,perf:60,yrs:3,co:'Gravadora'}; m.fame=60; S.guerra=null; guerraIniciar(m.country,m.country==='AR'?'BR':'AR','teste'); },
  ch:[['Fazer a turnê para as tropas','tropas',m=>{ m.fame=clamp(m.fame+8); m.karma=clamp(m.karma+5); if(R.chance(.1)){ st('health',-30); return 'Um bombardeio acertou o acampamento no meio do show.'; } return 'Cantei em cima de um tanque. Os soldados choraram, e eu também.'; }],
    ['Fazer um show pela paz','paz',m=>{ m.fame=clamp(m.fame+4); if(m.office) cxApr(m,-3); return 'Um estádio inteiro pedindo o fim da guerra. O governo me chamou de traidor.'; }],
    ['Esperar a guerra passar no exterior','exterior',m=>{ m.fame=clamp(m.fame-6); return 'Fui para outro país. Os fãs não perdoaram.'; }]]});
cx({id:'real_golpe',k:'Realeza',t:'⚔️ Golpe contra a coroa',p:.2,cd:8,when:m=>eRei(m)&&m.royal.reign&&m.age>=18,
  x:'Generais insatisfeitos e um movimento republicano juntaram forças. O palácio está cercado e o povo está dividido.',
  setup:m=>{ m.royal={house:'Casa Teste',pop:40,reign:true,abd:false}; m.age=40; },
  ch:[['Discursar ao povo da sacada','discursar',m=>{ if(R.chance(.35+m.royal.pop/150)){ m.royal.pop=clamp(m.royal.pop+15); return 'O povo encheu a praça para defender a coroa. Os generais recuaram.'; } m.royal.abd=true; m.c.exilio=1; return 'Vaiaram o discurso. Saí do país no avião da família, sem a coroa.'; }],
    ['Comprar os generais','comprar',m=>{ const c=Math.min(m.money,2000000); m.money-=c; if(R.chance(.55)) return `Distribuí ${fmt(c)} entre os quartéis. O golpe desmanchou em uma noite.`; m.royal.abd=true; return 'Pegaram o dinheiro e deram o golpe mesmo assim.'; }],
    ['Aceitar uma monarquia só simbólica','simbolica',m=>{ m.royal.pop=clamp(m.royal.pop+5); m.karma=clamp(m.karma+5); return 'Assinei a nova constituição: o rei reina, mas não governa. A coroa ficou.'; }]]});
cx({id:'real_seita',k:'Realeza',t:'⛪ A religião do reino',p:.35,cd:6,when:m=>eRei(m)&&eSeita(m),
  x:m=>`Como membro da realeza, posso transformar ${m.seita.n} na religião oficial do reino.`,
  setup:m=>{ m.royal={house:'Casa Teste',pop:60,reign:true,abd:false}; seitaFundar('igreja','Teste'); m.seita.fieis=900; },
  ch:[['Decretar a religião oficial','decretar',m=>{ m.seita.fieis=Math.round(m.seita.fieis*2); m.seita.fama=clamp(m.seita.fama+15); m.royal.pop=clamp(m.royal.pop-8); return 'Decreto assinado. As igrejas antigas protestaram; os templos novos lotaram.'; }],
    ['Só frequentar em público','frequentar',m=>{ m.seita.fieis+=R.int(200,800); return 'Bastou a família real aparecer num culto. A fila virou o quarteirão.'; }],
    ['Manter a fé longe da coroa','longe',()=> 'O reino é de todos; a minha fé é minha.']]});
cx({id:'real_casamento',k:'Realeza',t:'💍 Um casamento real',p:.3,cd:6,when:m=>eRei(m)&&m.age>=20&&!partners().length,
  prep:m=>({de:R.pick(COUNTRIES.filter(c=>c.id!==m.country&&ROYAL_COUNTRIES.includes(c.id)).map(c=>c.id).concat(['ES','JP','GB'].filter(x=>x!==m.country)))}),
  x:(m,d)=>`A família real ${typeof doPais==='function'?doPais(nomePais(d.de||'ES')):'de outro país'} propôs um casamento comigo: uma aliança entre as duas coroas.`,
  setup:m=>{ m.royal={house:'Casa Teste',pop:60,reign:false,abd:false}; m.age=25; },
  ch:[['Aceitar a aliança','aceitar',(m,d)=>{ const p=mkPerson({rel:'conjuge',age:m.age+R.int(-3,3),bond:R.int(30,60),gender:m.pref==='M'?'M':m.pref==='F'?'F':(m.gender==='M'?'F':'M')}); S.people.push(p); if(d.de&&typeof relMudar==='function') relMudar(m.country,d.de,25); m.royal.pop=clamp(m.royal.pop+10); log(`Casei com ${fullName(p)}, da realeza.`,'big'); return `Casamento transmitido para dois países. ${p.first} e eu mal nos conhecemos, mas as coroas estão unidas.`; }],
    ['Recusar e casar por amor','recusar',m=>{ m.royal.pop=clamp(m.royal.pop+3); return 'Recusei. A imprensa amou; a minha mãe, não.'; }]]});
cx({id:'real_guerra',k:'Realeza',t:'🏰 A coroa e a guerra',p:.4,cd:4,when:m=>eRei(m)&&eGuerraAqui(m),
  x:'Bombardeios perto da capital. O governo quer tirar a família real do país.',
  setup:m=>{ m.royal={house:'Casa Teste',pop:50,reign:true,abd:false}; S.guerra=null; guerraIniciar(m.country,m.country==='AR'?'BR':'AR','teste'); },
  ch:[['Ficar no palácio com o povo','ficar',m=>{ m.royal.pop=clamp(m.royal.pop+20); if(R.chance(.1)){ st('health',-30); return 'Uma bomba caiu no jardim do palácio. Fiquei, ferid'+oa()+', e o povo nunca esqueceu.'; } return 'Fiquei. Visitei abrigos e hospitais todos os dias.'; }],
    ['Ir para o exílio','exilio',m=>{ m.royal.pop=clamp(m.royal.pop-15); return 'Fui para um castelo emprestado no exterior. Os jornais chamaram de fuga.'; }],
    ['Vestir a farda e ir para a frente','frente',m=>{ m.royal.pop=clamp(m.royal.pop+25); m.fame=clamp(m.fame+10); st('health',-R.int(0,20)); return 'Um membro da realeza na trincheira. As fotos rodaram o mundo.'; }]]});
cx({id:'mil_golpe',k:'Forças Armadas',t:'🎖️ Os generais conspiram',p:.2,cd:8,when:m=>eMil(m)&&m.job.lvl>=6&&!m.office,
  x:'Numa reunião fechada no quartel-general, os generais anunciam: o governo vai cair. Querem saber de que lado eu estou.',
  setup:m=>{ m.job={spc:'militar',lvl:7,perf:60,yrs:10,co:'Exército'}; m.office=null; },
  ch:[['Liderar o golpe','liderar',m=>{ if(R.chance(.35+m.job.lvl*.03)){ endJob(); m.office={id:'pres',yrs:0,appr:R.int(30,55),dit:1}; m.c.golpeOk=1; cnt('office_pres'); if(typeof regime==='function'){ const r=regime(); r.tipo='militar'; r.leal=clamp(r.leal+20); } m.fame=clamp(m.fame+50); log('🎖️ Liderei o golpe e assumi o poder.','big'); return 'Tanques na praça dos Três Poderes. Ao amanhecer, eu fazia o primeiro pronunciamento em rede nacional.'; }
      arrest('tentativa de golpe de Estado',8,20); return 'Um coronel denunciou o plano na véspera.'; }],
    ['Participar sem aparecer','participar',m=>{ if(R.chance(.5)){ m.job.lvl=Math.min(SPECIAL.militar.l.length-1,m.job.lvl+1); return 'O golpe deu certo. Fui promovido no primeiro decreto.'; } m.job.perf=clamp(m.job.perf-20); return 'O golpe fracassou. Fui afastado "para averiguação".'; }],
    ['Denunciar ao governo','denunciar',m=>{ m.karma=clamp(m.karma+8); m.job.perf=clamp(m.job.perf+15); return 'Os conspiradores foram presos. Recebi uma medalha; os colegas, uma lição.'; }]]});
cx({id:'mil_ordem',k:'Forças Armadas',t:'🔫 A ordem de atirar',p:.3,cd:5,when:m=>eMil(m)&&!!(m.rev||S.mundo&&mundo(m.country).estabilidade<.5||(m.office&&m.office.dit)),
  x:'O povo tomou as ruas contra o governo. O comando mandou a minha tropa dispersar a multidão "por todos os meios".',
  setup:m=>{ m.job={spc:'militar',lvl:3,perf:60,yrs:3,co:'Exército'}; m.rev={n:'Teste'}; },
  ch:[['Cumprir a ordem','cumprir',m=>{ m.karma=clamp(m.karma-20); m.job.perf=clamp(m.job.perf+10); return 'Cumpri. Não durmo direito desde aquele dia.'; }],
    ['Mandar a tropa baixar as armas','baixar',m=>{ m.karma=clamp(m.karma+15); m.fame=clamp(m.fame+10); if(R.chance(.4)){ arrest('insubordinação',1,4); return 'A multidão me carregou nos ombros. O tribunal militar, não.'; } return 'A tropa baixou as armas e a multidão aplaudiu. O governo caiu dias depois.'; }],
    ['Atirar para o alto','alto',m=>{ m.job.perf=clamp(m.job.perf-5); return 'Tiros para o alto, ninguém ferido. Os dois lados me odeiam um pouco.'; }]]});
cx({id:'mil_invasao',k:'Forças Armadas',t:'🗺️ Comandar a invasão',p:.4,cd:3,when:m=>eMil(m)&&m.job.lvl>=4&&eGuerraAqui(m),
  x:'O presidente ordenou a ofensiva. O meu batalhão vai na ponta da lança.',
  setup:m=>{ m.job={spc:'militar',lvl:5,perf:60,yrs:6,co:'Exército'}; S.guerra=null; guerraIniciar(m.country,m.country==='AR'?'BR':'AR','teste'); },
  ch:[['Ataque frontal','frontal',m=>{ const G=guerraAtual(), l=G&&ladoDe(G,m.country); if(R.chance(.5)){ if(G&&l) G.frente=Math.max(0,Math.min(100,G.frente+(l==='a'?12:-12))); m.job.perf=clamp(m.job.perf+15); return 'Rompemos a linha inimiga. Ganhei uma estrela no ombro.'; } st('health',-R.int(15,35)); return 'Caímos numa emboscada. Perdi metade do batalhão.'; }],
    ['Flanquear pela mata','flanco',m=>{ const G=guerraAtual(), l=G&&ladoDe(G,m.country); if(G&&l) G.frente=Math.max(0,Math.min(100,G.frente+(l==='a'?6:-6))); m.job.perf=clamp(m.job.perf+8); return 'Três dias de mata e um ataque pelas costas. Poucas baixas, muito terreno.'; }],
    ['Recusar a ordem suicida','recusar',m=>{ m.karma=clamp(m.karma+6); m.job.perf=clamp(m.job.perf-25); return 'Salvei o batalhão e perdi o comando.'; }]]});
cx({id:'mil_seita',k:'Forças Armadas',t:'🛐 A fé no quartel',p:.3,cd:6,when:m=>eMil(m)&&eSeita(m),
  x:m=>`Metade da minha tropa frequenta ${m.seita.n}. Os soldados me obedecem no quartel e me veneram no templo.`,
  setup:m=>{ m.job={spc:'militar',lvl:5,perf:60,yrs:6,co:'Exército'}; seitaFundar('igreja','Teste'); m.seita.fieis=900; },
  ch:[['Montar uma guarda armada de fiéis','guarda',m=>{ m.seita.seg=Math.max(m.seita.seg||0,2); m.seita.susp=clamp(m.seita.susp+12); return 'Soldados de folga fazem a segurança do templo, armados. Ninguém mais ameaça o grupo.'; }],
    ['Manter a farda longe da fé','longe',m=>{ m.job.perf=clamp(m.job.perf+5); return 'Proibi pregação no quartel. Os soldados respeitaram, de cara feia.'; }]]});
cx({id:'clube_lutador',k:'Lutas',t:'🥊 O olheiro no clube das criaturas',p:.4,cd:4,when:m=>eCri(m)&&!!(m.cri&&m.cri.clube&&m.cri.clube.tier>=1),
  x:'Um empresário de lutas assistiu a uma noite no clube das criaturas. Não sabe o que eu sou, mas quer me levar para o octógono de verdade.',
  setup:m=>{ m.criatura='lobisomem'; m.cri={exp:0,ctrl:20,hip:0,bando:null,clube:{tier:1,v:0,d:0}}; },
  ch:[['Aceitar e virar lutador profissional','aceitar',m=>{ if(m.job&&m.job.spc==='lutador'){ m.job.perf=clamp(m.job.perf+20); return 'Já sou lutador. O empresário me colocou direto no card principal.'; } if(m.job) endJob(); m.job={spc:'lutador',lvl:1,perf:65,yrs:0,co:'Liga Profissional'}; m.fight=clamp(m.fight+5); return 'Assinei. No primeiro evento, o adversário desistiu no primeiro round só de olhar nos meus olhos.'; }],
    ['Recusar: holofote demais','recusar',()=> 'Câmeras em alta definição e exame antidoping? Não, obrigado.']]});
cx({id:'atleta_boicote',k:'Esporte',t:'🏟️ O boicote',p:.5,cd:4,when:m=>(eAtl(m)||eLut(m))&&eGuerraAqui(m),
  x:'Por causa da guerra, o meu país foi excluído da próxima competição internacional.',
  setup:m=>{ m.job={spc:'atleta',lvl:3,perf:60,yrs:4,co:'Clube Teste'}; S.guerra=null; guerraIniciar(m.country,m.country==='AR'?'BR':'AR','teste'); },
  ch:[['Competir sob bandeira neutra','neutra',m=>{ m.fame=clamp(m.fame+4); return 'Competi sem hino e sem bandeira. Quando ganhei, ninguém soube o que tocar.'; }],
    ['Protestar publicamente','protestar',m=>{ m.fame=clamp(m.fame+6); if(m.office) cxApr(m,3); return 'O meu protesto viralizou. A federação internacional prometeu rever o caso.'; }],
    ['Me naturalizar em outro país','naturalizar',m=>{ m.job.perf=clamp(m.job.perf+5); m.fame=clamp(m.fame-3); return 'Troquei de passaporte e de camisa. Em casa, viraram as costas para mim.'; }]]});
cx({id:'guerra_escola',k:'Escola',t:'🏫 A escola na guerra',p:.6,cd:2,when:m=>!!escCur(m)&&eGuerraAqui(m)&&m.age<25,
  x:'Por causa da guerra, as aulas foram suspensas. Algumas escolas viraram abrigo.',
  setup:m=>{ m.age=12; startSchool('fund'); S.guerra=null; guerraIniciar(m.country,m.country==='AR'?'BR':'AR','teste'); },
  ch:[['Estudar sozinho em casa','casa',m=>{ const c=escCur(m); if(c) c.grade=clamp(c.grade-2); st('smarts',1); return 'Livros velhos à luz de vela. Aprendi mais do que esperava.'; }],
    ['Ajudar no abrigo','abrigo',m=>{ const c=escCur(m); if(c) c.grade=clamp(c.grade-5); m.karma=clamp(m.karma+8); return 'Servi sopa e brinquei com as crianças menores. Ninguém me deu nota, mas aprendi muito.'; }],
    ['Assistir às aulas online','online',m=>{ st('happy',-3); return 'Aula pelo celular, com a internet caindo a cada sirene.'; }]]});

// ---------- o ano ----------
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m||!m.alive||m.prison||S.scen) return; m.c.cx=m.c.cx||{}; let n=0;
  for(const id of R.shuffle(Object.keys(CX))){ const o=CX[id]; if(o.scen||n>=2) continue; if(m.c.cx[id]!=null&&S.year-m.c.cx[id]<(o.cd||5)) continue;
    let ok=false; try{ ok=!!o.when(m); }catch(e){} if(!ok||!R.chance(o.p||.25)) continue; const d=EVENTS['cx_'+id].prep(); if(d==null) continue; m.c.cx[id]=S.year; queue('cx_'+id,d); n++; } });

function conexoesSelfTest(){ const s0=S,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META); window.NO_SAVE=true; window.NO_NEWS=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); }, BAD=/\{\w+\}|undefined|NaN|\[object|null/;
  try{ for(const [id,o] of Object.entries(CX)){ newLife({country:'BR'}); let m=S.me; m.age=30; m.prison=null; m.money=1e6; S.guerra=null; if(o.scen) S.scen={id:o.scen,sec:50,rep:50,san:50,pw:50,pista:0,dia:10,ev:{}};
      try{ o.setup(m); }catch(e){ erros.push(id+' setup: '+e.message); continue; } m=S.me;
      let w=false; try{ w=o.when(m); }catch(e){ erros.push(id+' when: '+e.message); } ok(w,id+': condição não ficou verdadeira no teste'); if(!w) continue;
      const ev=EVENTS[(o.scen?'cxh_':'cx_')+id], d=ev.prep(); ok(d!=null,id+': prep vazio'); if(d==null) continue;
      const base=JSON.stringify(S), sh=ev.show(d); ok(sh&&sh.ch.length>=2&&!BAD.test(sh.t+sh.x),id+' show: '+(sh&&sh.x)); ok(!(m.age<18&&sh.ch.length<2),id+': escolhas');
      for(const [l,k] of sh.ch){ ok(!BAD.test(l),id+' opção: '+l); S=JSON.parse(base); let r; try{ r=ev.pick(k,JSON.parse(JSON.stringify(d))); }catch(e){ erros.push(id+'/'+k+': '+e.message); } ok(!BAD.test(String(r)),id+'/'+k+': '+r); } S=JSON.parse(base); }
    // o gancho do ano não passa de duas ligações por ano
    newLife({country:'BR'}); const m=S.me; m.age=35; m.prison=null; m.money=1e6; novoBiz(m,'Teste','Construtora',900000); m.job={spc:'crime',lvl:4,perf:60,yrs:3,co:'Facção'}; seitaFundar('igreja','Teste'); m.seita.fieis=900;
    for(let i=0;i<10;i++){ S.pending=[]; S.year++; for(const f of NL_GANCHOS_ANO){ try{ f(); }catch(e){} } ok(S.pending.filter(e=>String(e.id).startsWith('cx_')).length<=2,'mais de duas ligações num ano'); }
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); } finally{ S=s0; window.NO_SAVE=ns; window.NO_NEWS=nn; Object.assign(META,JSON.parse(meta)); }
  if(erros.length) throw Error('Conexões 2.18 · '+erros.slice(0,10).join(' | ')); return {ok:true}; }
