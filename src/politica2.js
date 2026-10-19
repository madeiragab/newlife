// ===== Carreira política: partidos, campanha com bandeira, debate e reta final, segundo turno, coalizão, projetos de lei,
// orçamento, crises, escândalos, CPI, impeachment, senado, limite de mandatos e vida de ex-presidente =====
OFFICES.splice(OFFICES.findIndex(o=>o.id==='pres'),0,{id:'sen',n:'Senador|Senadora',age:35,cost:1500000,sal:300000,base:.16,req:'dep,gov'});
OFFICES.find(o=>o.id==='pres').req='gov,sen';
const PARTIDOS=[{id:'np',n:'Partido Novo Rumo',ideo:'centro',band:'obras'},{id:'ap',n:'Aliança Progressista',ideo:'esquerda',band:'saude'},{id:'ml',n:'Movimento Liberal',ideo:'liberal',band:'economia'},{id:'po',n:'Partido da Ordem',ideo:'direita',band:'seguranca'},{id:'rv',n:'Rede Verde',ideo:'verde',band:'ambiente'},{id:'ud',n:'União Democrática',ideo:'centro',band:'educacao'}];
const BANDEIRAS={saude:['🏥','Saúde'],educacao:['📚','Educação'],seguranca:['🚓','Segurança'],economia:['💼','Emprego e economia'],ambiente:['🌳','Meio ambiente'],obras:['🏗️','Obras e transporte']};
const polDe=m=>(m.pol=m.pol||{partido:null,coal:30,esc:0,promessa:null});
const partidoDe=m=>PARTIDOS.find(p=>p.id===polDe(m).partido)||null;
// o tema que mais preocupa o país agora, tirado da economia e dos indicadores do mundo
function polTemaQuente(m){ try{ const w=mundo(m.country); if(w.crime>=60) return 'seguranca'; if(w.desemprego>=.09||w.crescimento<0) return 'economia'; if(w.saude<55) return 'saude'; }catch(e){} return R.pick(['educacao','obras','saude']); }
function polFiliar(id){ const m=S.me, p=PARTIDOS.find(x=>x.id===id); if(!p) return ''; const pol=polDe(m); if(pol.partido===id) return 'Já sou filiad'+oa()+' a esse partido.'; const troca=!!pol.partido; pol.partido=id; pol.coal=troca?Math.max(10,pol.coal-15):30;
  log(`Me filiei ao ${p.n}.`,troca?'warn':''); return troca?`Troquei de partido e entrei no ${p.n}. Os antigos colegas me chamam de traidor.`:`Me filiei ao ${p.n}. Ganhei um broche e uma pilha de panfletos.`; }
// eleição: reimplementa a chance com o resultado da campanha, o partido e a coalizão
runFor=function(o,tier,bonus=0){ const m=S.me, cost=Math.round(o.cost*[0.3,1,3][tier]), pol=polDe(m); m.money-=cost;
  const p=clamp((o.base+m.fame/250+m.smarts/600+(m.karma-50)/400+((m.reputacao??60)-60)/400+[-.05,.06,.16][tier]+bonus+(pol.coal-30)/600-pol.esc/400-(m.rec.conv?.25:0)-(typeof npcRival==='function'&&npcRival(o.id)?npcRival(o.id).npcPoder.apoio/500:0))*100,2,88)/100;
  if(!R.chance(p)){ st('happy',-10); log(`Perdi a eleição para ${g(o.n,m.gender).toLowerCase()}.`,'bad'); return `Perdi a eleição. Gastei ${fmt(cost)} na campanha.`; }
  if(m.job) endJob(); const re=m.office&&m.office.id===o.id; m.office={id:o.id,yrs:0,appr:R.int(45,65),mand:re?(m.office.mand||1)+1:1,band:pol.promessa}; cnt('office_'+o.id); if(o.id==='pres') cnt('pres');
  m.fame=clamp(m.fame+{ver:3,dep:8,pref:10,gov:25,sen:20,pres:60}[o.id]); log(`Fui ${m.gender==='F'?'eleita':'eleito'} ${g(o.n,m.gender).toLowerCase()}!`,'good'); st('happy',20);
  return `Ganhei a eleição! Agora sou ${g(o.n,m.gender).toLowerCase()}.`; };
const POL_ATAQUES=[['corrupcao','"Seu partido está envolvido em escândalos. Por que alguém confiaria em você?"'],['experiencia','"Você nunca administrou nada. Vai aprender às custas do povo?"'],['promessa','"Suas promessas são impossíveis. De onde vem o dinheiro?"'],['tema','"O que você vai fazer de concreto sobre {tema}?"']];
const POL_RESPOSTAS=[['dados','Responder com números e fatos'],['proposta','Apresentar uma proposta concreta'],['ataque','Contra-atacar o rival'],['fuga','Mudar de assunto']];
const POL_MELHOR={corrupcao:'dados',experiencia:'proposta',promessa:'dados',tema:'proposta'};
EVENTS.pol_campanha={when:m=>!m.prison,
  prep:m=>({o:'ver',tier:1,e:0,pts:0}),
  show:d=>{ const m=S.me, o=OFFICES.find(x=>x.id===d.o)||OFFICES[0], cargo=g(o.n,m.gender).toLowerCase(), quente=d.quente||polTemaQuente(m);
    if(d.e===1){ const A=POL_ATAQUES[d.atk[d.r]]; return {k:'Eleição',t:`🎤 Debate na TV · pergunta ${d.r+1} de 3`,x:`${d.rival} ataca: ${A[1].replace('{tema}',BANDEIRAS[quente][1].toLowerCase())}`,ch:POL_RESPOSTAS.map(r=>[r[1],r[0]])}; }
    if(d.e===2) return {k:'Eleição',t:'📣 Reta final',x:`Faltam duas semanas. A última pesquisa me dá ${Math.round(polChance(d)*100)}% de chance contra ${d.rival}. Onde eu concentro a campanha?`,ch:[['Comício gigante','comicio'],['Redes sociais','redes'],['Porta a porta nos bairros','porta'],['Espalhar boatos sobre o rival','boato']]};
    if(d.e===3) return {k:'Eleição',t:'🗳️ Segundo turno',x:`Deu empate técnico: segundo turno contra ${d.rival}. Último debate, a pergunta que decide: "${BANDEIRAS[quente][1]}: qual o seu plano para os primeiros cem dias?"`,ch:[['Um plano detalhado, com prazos','plano'],['Uma promessa emocionante','emocao'],['Atacar o histórico do rival','ataque']]};
    return {k:'Eleição',t:`Campanha para ${cargo}`,x:`Pesquisas mostram que o que mais preocupa o eleitor agora é: ${BANDEIRAS[quente][1].toLowerCase()}. Qual vai ser a minha bandeira principal?`,ch:Object.entries(BANDEIRAS).map(([k,b])=>[`${b[0]} ${b[1]}`,k])}; },
  pick:(k,d)=>{ const m=S.me, pol=polDe(m), par=partidoDe(m), quente=d.quente||polTemaQuente(m); let t='';
    if(!d.e){ let pts=0; if(k===quente){ pts+=3; t='Acertei no tema que o eleitor quer ouvir.'; } else t='A bandeira é boa, mas não é o que mais preocupa o eleitor agora.'; if(par&&par.band===k){ pts+=1; t+=' O partido inteiro abraçou a causa.'; }
      pol.promessa=k; const atk=R.shuffle([0,1,2,3]).slice(0,3); queue('pol_campanha',Object.assign({},d,{e:1,r:0,pts,quente,atk,rival:d.rival||polRival()})); return t; }
    if(d.e===1){ const A=POL_ATAQUES[d.atk[d.r]][0]; let g2=k===POL_MELHOR[A]?2:k==='ataque'?0:k==='fuga'?-1:1; if(A==='corrupcao'&&k==='dados'&&pol.esc>40) g2=-1; if(g2>0&&!R.chance(.55+m.smarts/250)) g2--;
      t=g2>=2?R.pick(['A plateia aplaudiu.','O rival ficou sem resposta.']):g2===1?'Respondi bem.':g2===0?'Virou bate-boca. Ninguém ganhou.':'Pareceu que eu fugi da pergunta.';
      const nd=Object.assign({},d,{pts:d.pts+g2}); if(d.r<2){ nd.r=d.r+1; queue('pol_campanha',nd); return t; } nd.e=2; queue('pol_campanha',nd); return t+` Fim do debate.`; }
    if(d.e===2){ let b=0; if(k==='comicio'){ b=m.fame>=40?2:1; t='O comício lotou a praça.'; } else if(k==='redes'){ b=m.age<45?2:1; t='Meus vídeos viralizaram.'; } else if(k==='porta'){ b=m.karma>=55||m.looks>=60?2:1; st('health',-2); t='Bati em milhares de portas. O povo gostou de me ver de perto.'; }
      else { b=3; m.karma=clamp(m.karma-12); if(R.chance(.35)){ pol.esc=clamp(pol.esc+25); b=-2; t='Descobriram de onde vieram os boatos. Virou escândalo.'; } else t='Os boatos pegaram. O rival passou a campanha se defendendo.'; }
      const nd=Object.assign({},d,{pts:d.pts+b}); const c=polChance(nd);
      if(['pref','gov','pres'].includes(d.o)&&Math.abs(c-.5)<.12){ nd.e=3; queue('pol_campanha',nd); return t+' A apuração termina empatada: vai ter segundo turno!'; }
      return t+' '+polApurar(nd,0); }
    let b=k==='plano'?(R.chance(.5+m.smarts/250)?3:1):k==='emocao'?(R.chance(.4+m.looks/300)?3:0):(R.chance(.35)?2:-1); return (b>=2?'Fui muito bem no último debate.':'O último debate foi morno.')+' '+polApurar(d,b*.03); }};
function polRival(){ const p=mkPerson({rel:'tmp',age:R.int(35,65)}); return `${p.first} ${p.last}`; }
function polChance(d){ const m=S.me, o=OFFICES.find(x=>x.id===d.o), pol=polDe(m); return Math.max(.02,Math.min(.88,o.base+m.fame/250+m.smarts/600+(m.karma-50)/400+[-.05,.06,.16][d.tier]+d.pts*.03+(pol.coal-30)/600-pol.esc/400-(m.rec.conv?.25:0))); }
function polApurar(d,extra){ const m=S.me, o=OFFICES.find(x=>x.id===d.o); const r=runFor(o,d.tier,d.pts*.03+(extra||0)); if(d.re&&!/Ganhei/.test(r)){ m.office=null; } return d.re&&/Ganhei/.test(r)?`Reeleit${oa()}! Mais um mandato.`:r; }
function polCampanhaIniciar(o,tier){ const m=S.me; if(!polDe(m).partido) return 'Preciso me filiar a um partido antes de concorrer.'; if(m.c.inelegivel&&m.c.inelegivel>S.year) return `Estou inelegível até ${m.c.inelegivel}.`;
  queue('pol_campanha',{o:o.id,tier,e:0,pts:0,rival:polRival()}); return ''; }
V.politics=(o=>function(){ const r=o.apply(this,arguments), m=S.me, pol=polDe(m), par=partidoDe(m); if(!r||!r.items) return r;
  r.items.forEach(it=>{ const of=OFFICES.find(x=>g(x.n,m.gender)===it.l); if(of&&!it.dis) it.on=()=>modal({t:'Campanha para '+g(of.n,m.gender).toLowerCase(),x:'Quanto vou gastar? Depois vem a bandeira, o debate e a reta final.',ch:[0,1,2].map(t=>({l:`${['Campanha modesta','Campanha normal','Campanha milionária'][t]} (${fmt(of.cost*[0.3,1,3][t])})`,fn:()=>{ const x=polCampanhaIniciar(of,t); if(x) MQ.unshift({t:'Eleição',x}); UI.close(); }})).concat([{l:'Desistir',cls:'alt'}])}); });
  r.items.splice(1,0,{html:`<div class="card">${kv('Partido',par?par.n:'Sem partido')}${par?kv('Ideologia',par.ideo):''}${kv('Tema que mais preocupa o eleitor',BANDEIRAS[polTemaQuente(m)][1])}${pol.esc?bar('Escândalos',clamp(pol.esc)):''}${m.c.inelegivel>S.year?`<p style="color:#E5484D">Inelegível até ${m.c.inelegivel}.</p>`:''}</div>`},{sec:'Partidos'},
    ...PARTIDOS.map(p=>({ic:pol.partido===p.id?'✅':'🏛️',l:p.n,s:`${p.ideo} · bandeira: ${BANDEIRAS[p.band][1].toLowerCase()}`,r:pol.partido===p.id?'Meu partido':'',on:()=>act(()=>polFiliar(p.id),'Partido')})),{sec:'Cargos'});
  if((m.c.pres||0)>0&&!m.office) r.items.push({sec:'Ex-presidente'},{ic:'🎤',l:'Dar uma palestra internacional',s:'Cachê alto',on:()=>act(()=>{ if(use('palestra')>2) return 'Já dei palestras demais este ano.'; const v=R.int(50000,300000); m.money+=v; m.fame=clamp(m.fame+1); return `Palestra em ${R.pick(['Nova York','Londres','Tóquio','Madri'])}. Cachê de ${fmt(v)}.`; },'Palestra')},{ic:'📘',l:'Escrever as memórias do governo',s:'Uma vez',on:()=>act(()=>{ if(m.c.memPres) return 'O livro já saiu.'; m.c.memPres=1; const v=R.int(200000,1500000); m.money+=v; m.fame=clamp(m.fame+4); log('Lancei minhas memórias de presidente.','good'); return `O livro virou best-seller: ${fmt(v)} de direitos autorais.`; },'Memórias')});
  return r; })(V.politics);
EVENTS.reeleicao.pick=(o=>function(k,d){ const m=S.me, of=m.office; if(k!=='r'||!of||of.dit) return o.apply(this,arguments); const od=OFFICES.find(x=>x.id===of.id);
  if(of.id==='pres'&&(of.mand||1)>=2){ m.office=null; log('Terminei meu segundo mandato de presidente. A lei não permite um terceiro seguido.','good'); return 'Dois mandatos é o limite. Passei a faixa com a cabeça erguida.'; }
  if(!polDe(m).partido) polDe(m).partido=R.pick(PARTIDOS).id; queue('pol_campanha',{o:of.id,tier:1,e:0,pts:Math.round((of.appr-50)/10),re:1,rival:polRival()}); return 'Vou para a reeleição. Lá vamos nós de novo.'; })(EVENTS.reeleicao.pick);
EVENTS.reeleicao.show=(o=>function(d){ const r=o.apply(this,arguments), of=S.me.office; if(r&&of&&of.id==='pres'&&(of.mand||1)>=2) r.ch=[['Passar a faixa','r'],['Deixar a política','s']]; return r; })(EVENTS.reeleicao.show);
// ---------- mandato ----------
const POL_PROJETOS={saude:['Programa de médicos nos bairros','Hospital regional novo'],educacao:['Escola em tempo integral','Bolsa para universitários'],seguranca:['Mais policiamento nas ruas','Câmeras em todas as esquinas'],economia:['Redução de impostos para pequenas empresas','Programa de primeiro emprego'],ambiente:['Proibição de sacolas plásticas','Parque estadual protegido'],obras:['Metrô ligando a periferia','Asfalto em todos os bairros']};
EVENTS.pol_projeto={when:m=>!!m.office&&!m.prison,prep:m=>({ops:R.shuffle(Object.keys(POL_PROJETOS)).slice(0,3).map(k=>[k,R.pick(POL_PROJETOS[k])])}),
  show:d=>{ const of=S.me.office; return {k:'Política',t:'📜 Projeto de lei do ano',x:`Qual projeto vou priorizar este ano?${of.band?` Na campanha prometi ${BANDEIRAS[of.band][1].toLowerCase()}.`:''}`,ch:d.ops.map(([k,n],i)=>[`${BANDEIRAS[k][0]} ${n}`,String(i)])}; },
  pick:(k,d)=>{ const m=S.me, of=m.office, pol=polDe(m); if(!of) return ''; const [band,n]=d.ops[+k]; const p=clamp(35+pol.coal/2+(of.id==='ver'||of.id==='dep'||of.id==='sen'?0:10))/100;
    if(!R.chance(p)){ of.appr=clamp(of.appr-3); pol.coal=clamp(pol.coal-3); return `"${n}" foi derrotado na votação. Faltaram votos da base.`; }
    let g2=R.int(4,9); let t=`"${n}" foi aprovado!`; if(band===of.band){ g2+=5; of.promessaFeita=1; t+=' Promessa de campanha cumprida.'; } else if(band===polTemaQuente(m)){ g2+=3; t+=' Era o que o povo mais queria.'; } of.appr=clamp(of.appr+g2); m.fame=clamp(m.fame+1); log(`Aprovei o projeto "${n}".`,'good'); return t; }};
EVENTS.pol_orcamento={when:m=>!!m.office&&['pref','gov','pres'].includes(m.office.id)&&!m.prison,show:()=>({k:'Política',t:'💰 Orçamento do ano',x:'A equipe econômica pede a prioridade do orçamento. Onde vai a maior fatia?',ch:Object.entries(BANDEIRAS).map(([k,b])=>[`${b[0]} ${b[1]}`,k]).concat([['🤝 Emendas para os aliados','emendas']])}),
  pick:k=>{ const m=S.me, of=m.office, pol=polDe(m); if(!of) return ''; if(k==='emendas'){ pol.coal=clamp(pol.coal+12); pol.esc=clamp(pol.esc+6); of.appr=clamp(of.appr-3); return 'Os aliados ficaram felizes. A imprensa, desconfiada.'; }
    const q=polTemaQuente(m); const g2=k===q?R.int(5,9):k===of.band?R.int(3,6):R.int(0,3); of.appr=clamp(of.appr+g2); return k===q?`Coloquei o dinheiro onde o povo mais precisava: ${BANDEIRAS[k][1].toLowerCase()}.`:`Orçamento focado em ${BANDEIRAS[k][1].toLowerCase()}.`; }};
function polCoalizao(k){ const m=S.me, pol=polDe(m), of=m.office; if(!of) return ''; if(use('coal')>1) return 'Já negociei demais com os partidos este ano.';
  if(k==='cargos'){ pol.coal=clamp(pol.coal+20); pol.esc=clamp(pol.esc+8); m.karma=clamp(m.karma-4); return 'Distribuí cargos para os partidos aliados. A base cresceu, e a fila de indicados suspeitos também.'; }
  if(k==='emendas'){ pol.coal=clamp(pol.coal+12); pol.esc=clamp(pol.esc+3); return 'Liberei emendas para as bases dos deputados aliados.'; }
  if(R.chance(.5+m.smarts/250)){ pol.coal=clamp(pol.coal+8); m.karma=clamp(m.karma+3); return 'Conversei sobre ideias, não sobre cargos. Ganhei aliados de verdade.'; } return 'Ouviram com educação e votaram contra mesmo assim.'; }
// ---------- crises, escândalos e impeachment ----------
const POL_CRISES=[['Enchente','Chuvas fortes deixaram milhares de desabrigados.',[['Ir ao local e coordenar o resgate','vai',6],['Liberar verba de emergência','verba',4],['Mandar uma nota à imprensa','nota',-6]]],
  ['Greve geral','Uma greve geral parou o transporte e as escolas.',[['Negociar com os sindicatos','negocia',4],['Endurecer e cortar o ponto','duro',-3],['Esperar a greve esvaziar','espera',-4]]],
  ['Crise econômica','Os preços dispararam e o desemprego subiu.',[['Anunciar um pacote de empregos','pacote',5],['Cortar gastos do governo','corte',1],['Culpar o governo anterior','culpa',-3]]],
  ['Surto de doença','Um surto de virose lotou os hospitais.',[['Montar hospitais de campanha','hospital',6],['Fazer campanha de vacinação','vacina',5],['Minimizar o problema','minimiza',-10]]],
  ['Escândalo de um aliado','Um aliado próximo foi pego recebendo propina.',[['Afastar o aliado na hora','afasta',4],['Defender o aliado','defende',-6],['Ficar em silêncio','silencio',-3]]]];
EVENTS.pol_crise={when:m=>!!m.office&&!m.prison,prep:()=>({i:R.int(0,POL_CRISES.length-1)}),show:d=>{ const C=POL_CRISES[d.i]; return {k:'Crise',t:'🚨 '+C[0],x:C[1],ch:C[2].map(c=>[c[0],c[1]])}; },
  pick:(k,d)=>{ const m=S.me, of=m.office, pol=polDe(m); if(!of) return ''; const c=POL_CRISES[d.i][2].find(x=>x[1]===k); of.appr=clamp(of.appr+c[2]+R.int(-2,2)); if(k==='defende') pol.esc=clamp(pol.esc+12); if(k==='afasta') pol.coal=clamp(pol.coal-6); if(k==='verba'||k==='pacote'){ m.fame=clamp(m.fame+1); }
    return c[2]>=4?'A população aprovou a forma como lidei com a crise.':c[2]>=0?'Resolvi, sem brilho.':'A crise piorou a minha imagem.'; }};
EVENTS.pol_escandalo={when:m=>!!m.office&&!m.prison,show:()=>({k:'Política',t:'📰 CPI',x:'A oposição abriu uma CPI para investigar denúncias contra o meu governo.',ch:[['Colaborar e abrir as contas','colabora'],['Usar a base para barrar a CPI','barra'],['Atacar a imprensa','imprensa']]}),
  pick:k=>{ const m=S.me, of=m.office, pol=polDe(m); if(!of) return '';
    if(k==='colabora'){ if(pol.esc<50||R.chance(.4)){ pol.esc=clamp(pol.esc-20); of.appr=clamp(of.appr+4); return 'A CPI não achou nada grave. Saí mais forte.'; } of.appr=clamp(of.appr-12); pol.esc=clamp(pol.esc+10); return 'Abri as contas, e acharam coisas que eu nem sabia.'; }
    if(k==='barra'){ if(pol.coal>=55){ pol.coal=clamp(pol.coal-15); return 'A base enterrou a CPI. Custou caro em favores.'; } pol.esc=clamp(pol.esc+12); of.appr=clamp(of.appr-6); return 'Tentei barrar e não tive votos. A CPI seguiu, mais raivosa.'; }
    of.appr=clamp(of.appr-5); m.karma=clamp(m.karma-4); return 'Ataquei a imprensa. Meus fiéis vibraram, o resto se afastou.'; }};
EVENTS.pol_impeachment={when:m=>!!m.office&&m.office.id==='pres'&&!m.office.dit&&!m.prison,show:()=>({k:'Política',t:'⚖️ Pedido de impeachment',x:`Com ${S.me.office.appr}% de aprovação e escândalos nas manchetes, a Câmara aceitou um pedido de impeachment.`,ch:[['Negociar votos com os partidos','negocia'],['Ir à TV e falar com a nação','tv'],['Renunciar antes da votação','renuncia']]}),
  pick:k=>{ const m=S.me, of=m.office, pol=polDe(m); if(!of) return '';
    if(k==='renuncia'){ m.office=null; log('Renunciei à presidência antes do impeachment.','bad'); return 'Renunciei. Pelo menos não fiquei inelegível.'; }
    let p=.35+pol.coal/180-pol.esc/300+of.appr/300; if(k==='negocia'){ p+=.12; pol.esc=clamp(pol.esc+8); } else p+=(m.smarts+m.looks)/1200;
    if(R.chance(clamp(p,.05,.9))){ of.appr=clamp(of.appr+5); log('Sobrevivi ao processo de impeachment.','good'); return 'A Câmara rejeitou o impeachment. Sobrevivi.'; }
    m.office=null; m.c.inelegivel=S.year+8; log('Sofri impeachment e fiquei inelegível por oito anos.','bad'); st('happy',-20); return 'Fui afastad'+oa()+' por impeachment. Inelegível por oito anos.'; }};
const POL_PRES=[['Cúpula internacional','Fui convidad{o} para uma cúpula dos líderes mundiais.',[['Ir e fazer um discurso forte|f+5 ?sm h+5|Meu discurso rodou o mundo.|f+1|Ninguém prestou muita atenção.','Mandar o chanceler|h+0|Fiquei cuidando do país.']]],
  ['Escolha do ministro','Preciso escolher o novo ministro da economia.',[['Um técnico respeitado|?sm h+3|O mercado comemorou.|h-2|O técnico brigou com todo mundo.','Um político aliado|h+1|A base ficou feliz.']]],
  ['Visita de Estado','Um chefe de Estado estrangeiro vem visitar o país.',[['Receber com banquete|f+3 h+4|Assinamos acordos comerciais importantes.','Uma recepção simples|h+1|Discreto e eficiente.']]],
  ['Faixa e cadeia nacional','O país pede um pronunciamento em rede nacional.',[['Falar com sinceridade|?lk f+2 h+4|Muitos se emocionaram.|h-3|Virou meme.','Ler o texto da assessoria|h+0|Correto e esquecível.']]]];
pack({k:'Presidência',w:1.3,cd:5,min:35,when:m=>!!m.office&&m.office.id==='pres'&&!m.prison},POL_PRES.map(([t,x,ch])=>[t,x,ch[0]]));
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m||!m.alive||m.prison||S.scen||!m.office) return; const of=m.office, pol=polDe(m);
  if(of.id==='sen'&&of.yrs<8) S.pending=S.pending.filter(e=>e.id!=='reeleicao');
  queue('pol_projeto',EVENTS.pol_projeto.prep(m)); if(['pref','gov','pres'].includes(of.id)) queue('pol_orcamento',{});
  if(R.chance(.35)) queue('pol_crise',{i:R.int(0,POL_CRISES.length-1)}); if(pol.esc>=30&&R.chance(pol.esc/150)) queue('pol_escandalo',{});
  if(of.id==='pres'&&!of.dit&&of.appr<22&&pol.esc>=40&&R.chance(.5)) queue('pol_impeachment',{});
  pol.esc=clamp(pol.esc-3); pol.coal=clamp(pol.coal+(of.appr>=55?2:of.appr<30?-4:0)); });
officeAct=(o=>function(k){ const r=o.apply(this,arguments), pol=polDe(S.me); if(k==='desvio') pol.esc=clamp(pol.esc+15); return r; })(officeAct);
V.career=(o=>function(){ const r=o.apply(this,arguments), m=S.me, of=m.office; if(!of||!r||!r.items||m.prison) return r; const pol=polDe(m), par=partidoDe(m); const i=r.items.findIndex(x=>x.l==='Renunciar'); if(i<0) return r;
  const add=[{html:`<div class="card">${kv('Partido',par?par.n:'Sem partido')}${kv('Mandato',`${of.mand||1}º`)}${of.band?kv('Promessa de campanha',BANDEIRAS[of.band][1]+(of.promessaFeita?' · cumprida':'')):''}${bar('Coalizão no parlamento',clamp(pol.coal))}${bar('Escândalos',clamp(pol.esc))}</div>`},
    {ic:'🤝',l:'Negociar com os partidos',s:'Aumenta a base que vota comigo',on:()=>UI.push(()=>({title:'Coalizão',items:[{ic:'🪑',l:'Oferecer cargos no governo',s:'Base forte · risco de escândalo',tone:'bad',on:()=>act(()=>polCoalizao('cargos'),'Coalizão')},{ic:'💵',l:'Liberar emendas',s:'Base média · pouco risco',on:()=>act(()=>polCoalizao('emendas'),'Coalizão')},{ic:'💬',l:'Conversar sobre ideias',s:'Depende de inteligência · sem risco',on:()=>act(()=>polCoalizao('ideias'),'Coalizão')}]}))}];
  r.items.splice(i,0,...add); return r; })(V.career);
// ---------- teste ----------
function politicaSelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,erros=[];window.NO_SAVE=true;window.NO_NEWS=true; const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=2026; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; }; let m;
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=EVENTS[id].show(JSON.parse(JSON.stringify(d))); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v));
    sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap); m=S.me; try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); ok(Number.isFinite(S.me.money),id+'#'+k+' dinheiro'); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); m=S.me; };
  try{ newLife({country:'BR'}); m=S.me; m.age=40; m.born=S.year-40; m.money=5e7; m.prison=null; m.c.office_ver=1; m.c.office_gov=1; m.c.office_dep=1; m.c.office_sen=1; S.pending=[];
    polAdaptarPais(m); ok(/filiar/.test(polCampanhaIniciar(OFFICES[0],1)),'concorreu sem partido'); polFiliar(PARTIDOS[0].id); ok(polCampanhaIniciar(OFFICES[0],1)===''&&S.pending[0].id==='pol_campanha','campanha não começou');
    const d0=S.pending[0].d; todas('pol_campanha',d0); todas('pol_campanha',Object.assign({},d0,{e:1,r:0,pts:2,quente:'saude',atk:[0,1,2]})); todas('pol_campanha',Object.assign({},d0,{e:1,r:2,pts:2,quente:'saude',atk:[0,1,3]}));
    todas('pol_campanha',Object.assign({},d0,{e:2,pts:3,quente:'saude'})); todas('pol_campanha',Object.assign({},d0,{o:'pres',e:3,pts:3,quente:'saude'}));
    let ganhou=0; for(let i=0;i<40;i++){ const snap=JSON.stringify(S); S.me.office=null; polApurar({o:'pref',tier:2,pts:8},0); if(S.me.office) ganhou++; S=JSON.parse(snap); m=S.me; } let ganhouRuim=0; for(let i=0;i<40;i++){ const snap=JSON.stringify(S); S.me.office=null; polApurar({o:'pref',tier:2,pts:-4},0); if(S.me.office) ganhouRuim++; S=JSON.parse(snap); m=S.me; }
    ok(ganhou>ganhouRuim,`campanha boa não ganha mais (${ganhou} x ${ganhouRuim})`);
    m.office={id:'pres',yrs:3,appr:50,mand:1,band:'saude'}; todas('pol_projeto',EVENTS.pol_projeto.prep(m)); todas('pol_orcamento',{}); for(let i=0;i<POL_CRISES.length;i++) todas('pol_crise',{i}); todas('pol_escandalo',{}); polDe(m).esc=60; m.office.appr=15; todas('pol_impeachment',{});
    for(const k of ['cargos','emendas','ideias']){ m.yr={}; ok(!BAD.test(polCoalizao(k)),'coalizão '+k); }
    m.office={id:'pres',yrs:4,appr:60,mand:2}; S.pending=[]; const r2=EVENTS.reeleicao.pick('r',{}); ok(!m.office&&/limite/.test(r2),'terceiro mandato de presidente permitido');
    m.office={id:'gov',yrs:4,appr:60,mand:1}; S.pending=[]; EVENTS.reeleicao.pick('r',{}); ok(S.pending.some(e=>e.id==='pol_campanha'&&e.d.re),'reeleição sem campanha');
    m.office={id:'sen',yrs:4,appr:60,mand:1}; S.pending=[{id:'reeleicao',d:{}}]; for(const f of NL_GANCHOS_ANO) f(); ok(!S.pending.some(e=>e.id==='reeleicao'),'senador com mandato de 4 anos');
    m.office=null; m.c.pres=1; [V.politics(),V.career()].forEach(v=>v.items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')+String(it.html||'')),'tela: '+(it.l||''))));
    m.office={id:'pres',yrs:1,appr:50,mand:1}; ok(V.career().items.some(it=>it.l==='Negociar com os partidos'),'mandato sem coalizão');
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; }
  if(erros.length) throw Error('Política · '+erros.slice(0,8).join(' | ')); return {ok:true}; }
