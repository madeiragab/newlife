// ===== Relações com barras, autoescola com placas, passaporte, facção, assassino de aluguel e desbloqueios =====

// ---------- relações: amor (carinho por mim, de qualquer tipo) e amizade (convivência) ----------
const frOf=p=>p.fr??(p.fr=clamp(p.bond+R.int(-20,10)));
interact=(orig=>function(p,k,extra){
  const b=p.bond, f=frOf(p); const r=orig(p,k,extra); const d=p.bond-b;
  const fun=['tempo','conversa','piada','passear','visitar','pegadinha','amizade','viagem'].includes(k), bad=['insulto','discutir','briga','puxar'].includes(k);
  p.fr=clamp(f+d*.6+(fun&&d>=0?R.int(1,5):0)-(bad?R.int(3,9):0));
  return r; })(interact);
const relBars=p=>p.rel==='pet'?[['❤️',p.bond,'#F0567A']]:[['❤️',p.bond,'#F0567A'],['🤝',frOf(p),'#2E86FF']];

// ---------- autoescola: prova de placas (bem óbvia) ----------
const sg=(inner,shape='circle')=>`<svg viewBox="0 0 100 100" width="96" height="96" aria-hidden="true">${inner}</svg>`;
const SIGNS=[
  {svg:sg('<polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#D32F2F" stroke="#fff" stroke-width="4"/><text x="50" y="60" font-size="26" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">PARE</text>'),q:'O que esta placa manda fazer?',a:['Parar o carro completamente','Acelerar para passar logo','Tocar a buzina três vezes','Estacionar e tirar uma soneca']},
  {svg:sg('<polygon points="5,10 95,10 50,92" fill="#fff" stroke="#D32F2F" stroke-width="9" stroke-linejoin="round"/>'),q:'O que significa esta placa?',a:['Dê a preferência','Pista de corrida','Proibido triângulos','Venda de pizza adiante']},
  {svg:sg('<circle cx="50" cy="50" r="44" fill="#fff" stroke="#D32F2F" stroke-width="9"/><text x="50" y="64" font-size="38" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">60</text>'),q:'O que esta placa indica?',a:['Velocidade máxima de 60 km/h','Velocidade mínima de 60 km/h','Faltam 60 metros para o posto','Só para maiores de 60 anos']},
  {svg:sg('<circle cx="50" cy="50" r="44" fill="#1565C0" stroke="#D32F2F" stroke-width="9"/><line x1="20" y1="20" x2="80" y2="80" stroke="#D32F2F" stroke-width="9"/>'),q:'O que significa esta placa?',a:['Proibido estacionar','Estacionamento liberado','Lava-rápido grátis','Pare para fotos']},
  {svg:sg('<circle cx="50" cy="50" r="44" fill="#fff" stroke="#D32F2F" stroke-width="9"/><path d="M68,68 V40 H34 M44,28 L32,40 L44,52" fill="none" stroke="#111" stroke-width="8" stroke-linejoin="round"/><line x1="22" y1="22" x2="78" y2="78" stroke="#D32F2F" stroke-width="8"/>'),q:'O que esta placa proíbe?',a:['Virar à esquerda','Virar à direita','Andar de ré','Ouvir música alta']},
  {svg:sg('<circle cx="50" cy="50" r="44" fill="#1565C0" stroke="#fff" stroke-width="4"/><path d="M25,50 H70 M55,34 L72,50 L55,66" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>'),q:'O que esta placa indica?',a:['Sentido obrigatório à direita','Proibido ir para a direita','Retorne imediatamente','Saída para o aeroporto']},
  {svg:sg('<polygon points="50,4 96,50 50,96 4,50" fill="#FBC02D" stroke="#111" stroke-width="4"/><circle cx="50" cy="30" r="6" fill="#111"/><path d="M50,37 V60 M50,60 L40,76 M50,60 L60,76 M38,46 H62" stroke="#111" stroke-width="6" stroke-linecap="round"/>'),q:'O que esta placa avisa?',a:['Travessia de pedestres','Proibido andar a pé','Academia ao ar livre','Ponto de táxi']},
  {svg:sg('<polygon points="50,4 96,50 50,96 4,50" fill="#FBC02D" stroke="#111" stroke-width="4"/><path d="M38,78 V52 Q38,32 58,32 H62 M54,22 L66,32 L54,42" fill="none" stroke="#111" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>'),q:'O que esta placa avisa?',a:['Curva acentuada à direita','Estrada reta por 10 km','Proibido fazer curva','Montanha-russa adiante']},
  {svg:sg('<polygon points="50,4 96,50 50,96 4,50" fill="#FBC02D" stroke="#111" stroke-width="4"/><path d="M22,62 H36 Q50,40 64,62 H78" fill="none" stroke="#111" stroke-width="8" stroke-linecap="round"/>'),q:'O que esta placa avisa?',a:['Lombada adiante','Ponte levadiça','Rampa para manobras radicais','Estrada de terra macia']},
  {svg:sg('<rect x="34" y="4" width="32" height="92" rx="10" fill="#222"/><circle cx="50" cy="22" r="10" fill="#E53935"/><circle cx="50" cy="50" r="10" fill="#5D4037"/><circle cx="50" cy="78" r="10" fill="#5D4037"/>'),q:'O semáforo está assim. O que fazer?',a:['Parar e esperar o verde','Passar bem rápido','Buzinar até ficar verde','Dar ré']},
  {svg:sg('<rect x="34" y="4" width="32" height="92" rx="10" fill="#222"/><circle cx="50" cy="22" r="10" fill="#5D4037"/><circle cx="50" cy="50" r="10" fill="#FFB300"/><circle cx="50" cy="78" r="10" fill="#5D4037"/>'),q:'O semáforo ficou amarelo. O que fazer?',a:['Reduzir e parar se der com segurança','Acelerar para passar antes do vermelho','Desligar o carro','Fazer uma selfie']},
  {svg:sg('<rect x="34" y="4" width="32" height="92" rx="10" fill="#222"/><circle cx="50" cy="22" r="10" fill="#5D4037"/><circle cx="50" cy="50" r="10" fill="#5D4037"/><circle cx="50" cy="78" r="10" fill="#43A047"/>'),q:'O semáforo está verde. O que fazer?',a:['Seguir com atenção','Parar e esperar ficar vermelho','Dar meia-volta','Buzinar para comemorar']},
  {svg:sg('<circle cx="50" cy="50" r="44" fill="#fff" stroke="#D32F2F" stroke-width="9"/><text x="50" y="64" font-size="38" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">40</text>'),q:'Qual é a velocidade máxima aqui?',a:['40 km/h','140 km/h','Não tem limite','40 metros por hora']},
  {svg:sg('<circle cx="50" cy="50" r="44" fill="#fff" stroke="#D32F2F" stroke-width="9"/><text x="50" y="66" font-size="40" text-anchor="middle">🚲</text><line x1="22" y1="22" x2="78" y2="78" stroke="#D32F2F" stroke-width="8"/>'),q:'O que esta placa proíbe?',a:['Trânsito de bicicletas','Trânsito de carros','Andar a pé','Vender bicicletas']},
  {svg:sg('<circle cx="50" cy="50" r="44" fill="#fff" stroke="#D32F2F" stroke-width="9"/><text x="50" y="66" font-size="40" text-anchor="middle">📯</text><line x1="22" y1="22" x2="78" y2="78" stroke="#D32F2F" stroke-width="8"/>'),q:'O que esta placa proíbe?',a:['Buzinar','Ouvir rádio','Cantar no carro','Tocar trompete na calçada']},
  {svg:sg('<circle cx="50" cy="50" r="44" fill="#fff" stroke="#D32F2F" stroke-width="9"/><path d="M38,72 V42 Q38,28 52,28 Q66,28 66,42 V54 M56,46 L66,58 L76,46" fill="none" stroke="#111" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><line x1="22" y1="22" x2="78" y2="78" stroke="#D32F2F" stroke-width="8"/>'),q:'O que esta placa proíbe?',a:['Fazer retorno','Seguir em frente','Estacionar à direita','Dirigir de dia']},
  {svg:sg('<circle cx="50" cy="50" r="44" fill="#fff" stroke="#D32F2F" stroke-width="9"/><text x="50" y="66" font-size="40" text-anchor="middle">🚚</text><line x1="22" y1="22" x2="78" y2="78" stroke="#D32F2F" stroke-width="8"/>'),q:'O que esta placa proíbe?',a:['Trânsito de caminhões','Trânsito de ônibus escolar','Entregas de pizza','Mudanças aos domingos']},
  {svg:sg('<circle cx="50" cy="50" r="44" fill="#1565C0" stroke="#fff" stroke-width="4"/><path d="M50,78 V28 M34,44 L50,26 L66,44" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>'),q:'O que esta placa indica?',a:['Siga em frente','Proibido seguir em frente','Pare imediatamente','Elevador à frente']},
  {svg:sg('<rect x="6" y="6" width="88" height="88" rx="10" fill="#1565C0" stroke="#fff" stroke-width="4"/><text x="50" y="70" font-size="56" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">E</text>'),q:'O que significa esta placa?',a:['Estacionamento permitido','Escola de samba','Proibido estacionar','Entrada de emergência do shopping']},
  {svg:sg('<rect x="6" y="6" width="88" height="88" rx="10" fill="#1565C0" stroke="#fff" stroke-width="4"/><text x="50" y="70" font-size="56" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">H</text>'),q:'O que esta placa indica?',a:['Hospital próximo','Hotel de luxo','Heliponto para carros','Hamburgueria']},
  {svg:sg('<polygon points="50,4 96,50 50,96 4,50" fill="#FBC02D" stroke="#111" stroke-width="4"/><text x="50" y="64" font-size="36" text-anchor="middle">🚸</text>'),q:'O que esta placa avisa?',a:['Área escolar: cuidado com crianças','Parque de diversões','Proibido crianças','Creche drive-thru']},
  {svg:sg('<polygon points="50,4 96,50 50,96 4,50" fill="#FBC02D" stroke="#111" stroke-width="4"/><text x="50" y="64" font-size="36" text-anchor="middle">🐄</text>'),q:'O que esta placa avisa?',a:['Animais na pista','Fazenda à venda','Leite fresco adiante','Rodeio hoje']},
  {svg:sg('<polygon points="50,4 96,50 50,96 4,50" fill="#FBC02D" stroke="#111" stroke-width="4"/><path d="M38,74 V30 M30,40 L38,28 L46,40 M62,26 V70 M54,60 L62,72 L70,60" fill="none" stroke="#111" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'),q:'O que esta placa avisa?',a:['Pista de mão dupla','Proibido ir e voltar','Elevador de carros','Escada rolante']},
];
function drivingTest(){
  const m=S.me; if(m.lic) return msg('Autoescola','Já tenho carteira de motorista.');
  if(m.age<18) return msg('Autoescola','Só a partir dos 18 anos.');
  if((m.yr.lic||0)>=3) return msg('Autoescola','A autoescola só deixa fazer três provas por ano.');
  if(!canPay(1500)) return msg('Autoescola','Não tenho os $1.500 da autoescola.');
  use('lic'); m.money-=1500; const s=R.pick(SIGNS), ord=R.shuffle([0,1,2,3]);
  modal({top:`<div class="mtop">${s.svg}</div>`,k:'Prova teórica',t:'Autoescola',x:s.q,ch:ord.map(i=>({l:s.a[i],fn:()=>{
    if(i===0){ m.lic=true; st('happy',8); log('Tirei minha carteira de motorista.','good'); MQ.unshift({t:'Autoescola',x:'Acertei a placa e passei no exame de direção! Carteira na mão.'}); if(typeof parentCar==='function') parentCar(); }
    else { st('happy',-3); MQ.unshift({t:'Autoescola',x:`Errei. A resposta certa era "${s.a[0]}". Reprovad${oa()}.`}); }
    after(); }}))});
}

// ---------- passaporte: tirar (pode falhar), falsificar (pode dar cadeia) ----------
function getPassport(){
  const m=S.me; if(m.passport==='ok') return 'Já tenho passaporte.'; if(m.yr.passTry) return 'Já tentei tirar passaporte este ano. Só no ano que vem.';
  if(!canPay(250)) return 'Não tenho os $250 da taxa.'; m.money-=250; m.yr.passTry=1;
  const crime=m.rec.conv>0?.2:m.rec.arrests>0?.5:m.c.fugitive?.05:.75;
  if(R.chance(crime)){ m.passport='ok'; st('happy',4); log('Tirei meu passaporte.','good'); return 'Passaporte aprovado! Posso viajar para fora.'; }
  return m.rec.conv>0||m.c.fugitive?'Pedido negado: apareceu uma pendência com a justiça no meu nome.':R.pick(['Pedido negado: faltou um documento.','O sistema da Polícia Federal caiu e perdi o agendamento. Só ano que vem.','Minha foto foi recusada. Pedido indeferido.']);
}
function fakePassport(){
  const m=S.me; if(m.age<18) return 'Ninguém vende isso para criança.'; if(m.passport) return 'Já tenho um passaporte.'; if(m.yr.passFake) return 'O falsificador sumiu. Tento ano que vem.';
  if(!canPay(3000)) return 'O falsificador cobra $3.000.'; m.money-=3000; m.yr.passFake=1; m.karma=clamp(m.karma-5);
  if(R.chance(.3)){ arrest('falsificação de documento',1,4); return 'Era uma armadilha da polícia. Fui pres'+oa()+' na entrega.'; }
  m.passport='fake'; return 'Peguei um passaporte falso. Parece verdadeiro... quase.';
}
emigrate=(orig=>function(c){
  const m=S.me; if(!m.passport) return 'Preciso de passaporte para emigrar.';
  if(m.passport==='fake'&&R.chance(.3)){ m.passport=null; arrest('uso de documento falso',1,5); return 'A polícia do aeroporto percebeu que meu passaporte era falso.'; }
  return orig(c); })(emigrate);

// ---------- facção: do olheiro ao dono do morro ----------
Object.assign(SPECIAL.crime,{n:'Facção',l:['Olheiro|Olheira','Aviãozinho','Vapor','Soldado','Gerente da boca','Frente da quebrada','Braço direito','Dono do morro|Dona do morro'],
  sal:[6000,12000,25000,45000,90000,180000,400000,1200000],fame:[0,0,0,1,3,6,12,25],min:14,act:'Fazer um corre para a facção'});
const RANK_ACTS=[
  {k:'olho',min:0,ic:'👀',l:'Ficar de olho no movimento',s:'Avisar quando a polícia subir · pouco risco'},
  {k:'trafico',min:1,ic:'💊',l:'Vender na boca (tráfico)',s:'Dinheiro rápido · a polícia fica de olho'},
  {k:'cobrar',min:2,ic:'💰',l:'Cobrar uma dívida',s:'Respeito · pode dar briga'},
  {k:'suborno',min:2,ic:'🤝',l:'Subornar a polícia',s:'Baixa a pressão'},
  {k:'contencao',min:3,ic:'🔫',l:'Fazer a contenção',s:'Proteger a boca · troca de tiro'},
  {k:'x9',min:3,ic:'🐀',l:'Dar fim num X-9',s:'Muito respeito · muito risco'},
  {k:'guerra',min:4,ic:'⚔️',l:'Guerra por território',s:'Tudo ou nada'},
];
const heatOf=j=>j.heat||0;
function faccao(k){
  const m=S.me,j=m.job; if(!j||j.spc!=='crime') return 'Não estou na facção.'; const sp=SPECIAL.crime, sal=sp.sal[j.lvl], dem=oa();
  if(k!=='sair'&&k!=='subir'&&use('fac')>4) return 'O movimento está parado. Melhor esperar.';
  const caught=(base,crime,a,b)=>{ if(R.chance(base+heatOf(j)/400)){ arrest(crime,a,b); j.heat=Math.max(0,heatOf(j)-30); return true; } return false; };
  const hot=n=>{ j.heat=clamp(heatOf(j)+n); };
  if(k==='olho'){ j.perf=clamp(j.perf+R.int(2,5)); hot(2); const v=Math.round(sal*.03); m.money+=v; return `Passei a noite de olho no movimento. Ganhei ${fmt(v)}.`; }
  if(k==='trafico'){ hot(8); if(caught(.05,'tráfico de drogas',3,10)) return 'A polícia deu um bote na boca. Fui pres'+dem+' em flagrante.'; const v=Math.round(sal*(.05+R.f()*.1)); m.money+=v; j.perf=clamp(j.perf+R.int(3,6)); m.karma=clamp(m.karma-3); cnt('crimes'); return `Movimentei a boca. ${fmt(v)} no bolso.`; }
  if(k==='cobrar'){ hot(4); if(R.chance(clamp(.45+m.fight/150,.1,.9))){ const v=Math.round(sal*.08); m.money+=v; j.perf=clamp(j.perf+R.int(4,8)); return `Cobrei a dívida. Pagaram na hora: ${fmt(v)}.`; } st('health',-R.int(5,15)); j.perf=clamp(j.perf-3); return 'O devedor reagiu e eu levei a pior.'; }
  if(k==='suborno'){ const c=Math.round(sal*.12+500); if(!canPay(c)) return `Preciso de ${fmt(c)} para o arrego.`; m.money-=c; if(R.chance(.15)){ arrest('corrupção ativa',2,6); return 'O policial era da corregedoria.'; } j.heat=Math.max(0,heatOf(j)-35); return `Paguei ${fmt(c)} de arrego. A polícia vai olhar para o outro lado.`; }
  if(k==='contencao'){ hot(6); if(R.chance(.03)){ die('balead'+dem+' numa troca de tiros com a polícia'); return 'Não voltei da contenção.'; } if(R.chance(.15)) st('health',-R.int(8,20)); j.perf=clamp(j.perf+R.int(5,9)); m.money+=Math.round(sal*.05); m.karma=clamp(m.karma-4); return R.pick(['Segurei a contenção a noite toda.','Trocamos tiro com a rival, mas a boca ficou de pé.']); }
  if(k==='x9'){ hot(15); cnt('kills'); m.karma=clamp(m.karma-25); if(caught(.12,'homicídio',12,30)) return 'Deu ruim: a polícia achou o corpo e chegou até mim.'; j.perf=clamp(j.perf+R.int(10,16)); return 'O X-9 não vai mais entregar ninguém.'; }
  if(k==='guerra'){ hot(20); cnt('wars'); if(R.chance(clamp(.35+j.lvl*.05+m.fight/300,.1,.8))){ const v=Math.round(sal*.4); m.money+=v; j.perf=clamp(j.perf+20); m.fame=clamp(m.fame+2); log('Tomamos o território da facção rival.','warn'); return `Tomamos o morro da rival! Minha parte: ${fmt(v)}.`; }
    if(R.chance(.25)){ die('numa guerra entre facções'); return 'Não sobrevivi à guerra.'; } st('health',-R.int(15,30)); j.perf=clamp(j.perf-15); return 'Perdemos a guerra. Saí ferid'+dem+' e desmoralizad'+dem+'.'; }
  if(k==='subir'){ if(use('facSobe')>1) return 'Já pedi para subir este ano.'; const max=sp.l.length-1; if(j.lvl>=max) return 'Já sou dono do morro.';
    if((j.lvlYrs||0)<1) return 'Ainda sou novo neste posto. Preciso provar meu valor por pelo menos um ano.';
    if(j.perf>=70&&R.chance(clamp((j.perf-50)/60,.1,.85))){ j.lvl++; j.lvlYrs=0; st('happy',10); m.fame=clamp(m.fame+sp.fame[j.lvl]); log(`Subi na facção: agora sou ${jobTitle(j).toLowerCase()}.`,'warn'); return `O patrão gostou de mim. Agora sou ${jobTitle(j).toLowerCase()}!`; }
    j.perf=clamp(j.perf-5); return `Disseram que eu ainda não tenho respeito suficiente (${j.perf}%).`; }
  if(k==='sair'){ if(R.chance(.08+j.lvl*.03)){ die(`executad${dem} por ex-comparsas`); return 'Quem sai da facção...'; } endJob(); m.karma=clamp(m.karma+5); log('Saí da facção.','warn'); return 'Saí da facção. Vou tentar outra vida.'; }
  return '';
}
// fim de ano na facção: pressão cai, tempo no posto conta
function factionYear(){ const m=S.me,j=m.job; if(!j||j.spc!=='crime') return; j.lvlYrs=(j.lvlYrs||0)+1; j.heat=Math.max(0,heatOf(j)-12);
  if(heatOf(j)>=70&&R.chance(.3)) queue('operacao_morro',{}); }
EVENTS.operacao_morro={show:()=>({k:'Polícia',t:'Operação no morro',x:'A polícia subiu o morro com o caveirão. Estão atrás de mim.',ch:[['Fugir pela mata','f'],['Me esconder na casa de um morador','e'],['Trocar tiro','t'],['Me entregar','r']]}),
  pick:k=>{ const m=S.me,j=m.job; if(k==='r'){ arrest('tráfico de drogas e associação',4,12); return 'Me entreguei.'; }
    if(k==='t'){ if(R.chance(.2)){ die('numa troca de tiros com a polícia'); return ''; } if(R.chance(.5)){ arrest('tráfico, associação e resistência',8,20); return 'Fui cercad'+oa()+' e pres'+oa()+'.'; } if(j) j.perf=clamp(j.perf+10); return 'Segurei a polícia e escapei.'; }
    if(R.chance(k==='f'?.6:.5)){ if(j) j.heat=Math.max(0,(j.heat||0)-20); return k==='f'?'Corri pela mata e escapei.':'O morador me escondeu no forro. Não me acharam.'; }
    arrest('tráfico de drogas e associação',4,12); return 'Me acharam.'; }};
V.faccao=()=>{ const m=S.me,j=m.job; if(!j||j.spc!=='crime') return {title:'Facção',items:[]}; const sp=SPECIAL.crime;
  return {title:'Facção',items:[{html:`<div class="card">${kv('Posto',jobTitle(j))}${kv('Salário do posto',fmt(sp.sal[j.lvl])+'/ano')}${bar('Respeito',j.perf)}${bar('Pressão da polícia',heatOf(j))}${loadBar()}<p style="color:var(--muted);font-size:13px">Postos: ${sp.l.map(t=>g(t,m.gender)).join(' → ')}</p></div>`},{sec:'Corres'}]
    .concat(RANK_ACTS.map(a=>({ic:a.ic,l:a.l,s:a.s,tone:['x9','guerra','contencao','trafico'].includes(a.k)?'bad':'',dis:j.lvl<a.min,why:`Só a partir de ${g(sp.l[a.min],m.gender).toLowerCase()}.`,on:()=>act(()=>faccao(a.k),'Facção')})))
    .concat([{sec:'Carreira'},{ic:'⬆️',l:'Subir de posto',s:'Respeito 70%+ e um ano no posto',on:()=>act(()=>faccao('subir'),'Facção')},{ic:'🚪',l:'Sair da facção',s:'Quem sai pode não sair vivo',tone:'bad',on:()=>confirmBox('Sair da facção?','Pode ter consequências graves.','Sair',()=>act(()=>faccao('sair'),'Facção'))}])}; };

// ---------- assassino de aluguel ----------
const HIT_JOBS=['empresário','político local','agiota','ex-sócio de um cliente','traficante rival','herdeiro rico','juiz aposentado','dono de boate'];
function hitContracts(){ const m=S.me; if(!m.yr.hits) m.yr.hits=[0,1,2].map(()=>{ const p=stranger({}); const sec=R.int(1,5); return {n:p.first+' '+p.last,gd:p.gender,who:R.pick(HIT_JOBS),sec,pay:Math.round(amt(15000,60000)*(1+sec*.6)/100)*100}; }); return m.yr.hits; }
const HIT_METHODS=[{k:'tiro',l:'Tiro de longe',s:'Precisa de mira (luta)',stat:m=>m.fight,base:.35},{k:'veneno',l:'Envenenamento',s:'Precisa de inteligência',stat:m=>m.smarts,base:.3},
  {k:'emboscada',l:'Emboscada corpo a corpo',s:'Precisa de luta',stat:m=>m.fight,base:.4},{k:'acidente',l:'Simular um acidente',s:'Mais difícil, mas quase ninguém desconfia',stat:m=>m.smarts,base:.2,stealth:1}];
function doHit(i,meth){
  const m=S.me,c=hitContracts()[i]; if(!c) return ''; if(use('hit')>2) return 'Já peguei serviço demais este ano. Muito arriscado.';
  const skill=(m.c.hits||0)*4, ok=R.chance(clamp(meth.base+meth.stat(m)/180+skill/100-c.sec*.07,.05,.9));
  m.yr.hits=hitContracts().filter(x=>x!==c);
  if(!ok){ if(R.chance(.5)){ arrest('tentativa de homicídio',6,15); return `O alvo, ${c.n}, escapou e a polícia chegou até mim.`; } m.karma=clamp(m.karma-8); return `${c.n} escapou. O cliente quer o dinheiro de volta.`; }
  cnt('kills'); cnt('hits'); m.karma=clamp(m.karma-25); m.money+=c.pay; m.c.unsolvedHits=(m.c.unsolvedHits||0)+1;
  if(R.chance(meth.stealth?.05:.15)){ arrest('homicídio qualificado',12,30); return `Serviço feito (${fmt(c.pay)}), mas uma câmera me pegou. A polícia bateu na minha porta.`; }
  log(`Fiz um serviço como assassin${oa()} de aluguel. Ganhei ${fmt(c.pay)}.`,'bad'); return `${c.n} não é mais problema do cliente. Recebi ${fmt(c.pay)}.`;
}
V.hitman=()=>{ const m=S.me, ok=m.age>=18&&((m.c.crimes||0)>=3||(m.job&&m.job.spc==='crime')||(m.c.kills||0)>0);
  if(!ok) return {title:'Assassino de aluguel',items:[{html:'<div class="card"><p>Ninguém me passa esse tipo de serviço. Preciso de contatos no crime (ficha com 3 crimes, estar na facção ou já ter matado) e ter 18 anos.</p></div>'}]};
  return {title:'Assassino de aluguel',items:[{html:`<div class="card"><p>Contratos deste ano. Quanto mais segurança o alvo tem, maior o pagamento e o risco. No máximo 2 serviços por ano.</p>${kv('Serviços feitos',String(m.c.hits||0))}</div>`}]
    .concat(hitContracts().map((c,i)=>({ic:'🎯',l:c.n,s:`${c.who} · segurança ${'●'.repeat(c.sec)}${'○'.repeat(5-c.sec)}`,r:fmt(c.pay),on:()=>UI.push(()=>({title:c.n,items:[{html:`<div class="card">${kv('Alvo',c.who)}${kv('Pagamento',fmt(c.pay))}</div>`}].concat(HIT_METHODS.map(me=>({ic:'🗡️',l:me.l,s:me.s,tone:'bad',on:()=>{ UI.close(); act(()=>doHit(i,me),'Serviço'); }})))}))})))}; };

// ---------- desbloqueio do Modo Deus e da Máquina do tempo ----------
const UNLOCK_RIBBONS=10;
const godUnlocked=()=>!!META.unlock||Object.keys(META.ribbons||{}).length>=UNLOCK_RIBBONS;
V.code=()=>({title:'Resgatar código',items:[{html:'<div class="card"><p>Tem um código? Digite aqui:</p><input class="in" id="codeIn" inputmode="numeric" autocomplete="off" placeholder="••••••••"></div>'},
  {ic:'🔓',l:'Confirmar',on:()=>{ const v=(document.getElementById('codeIn')||{}).value||''; if(v.replace(/\D/g,'')==='40028922'){ META.unlock=1; save(); UI.close(); msg('Código aceito','Algo novo apareceu no menu.'); } else msg('Código','Código inválido.'); }}]});
