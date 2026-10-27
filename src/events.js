// ===== Eventos aleatórios (com escolhas) =====
const oa=()=>S.me.gender==='F'?'a':'o';
const stranger=o=>mkPerson(Object.assign({rel:'tmp'},o||{}));
const addP=p=>{ S.people.push(p); return p; };
const amt=(a,b)=>Math.round(R.int(a,b)/10)*10;
const inSchool=m=>m.edu.cur&&(m.edu.cur.type==='fund'||m.edu.cur.type==='medio');
const free=m=>!m.prison;
const hasCar=m=>m.assets.some(a=>a.k==='carro');
const hasHouse=m=>m.assets.some(a=>a.k==='casa');

const EVENTS={
 // ---------- infância ----------
 brinquedo:{w:3,when:m=>m.age>=2&&m.age<=8&&people('irmao').length,prep:()=>({s:R.pick(people('irmao')).id,toy:R.pick(FILL.toy)}),
  show:d=>({k:'Família',t:'Briga por brinquedo',x:`${P(d.s).first} pegou meu ${d.toy} e não quer devolver.`,ch:[['Chorar até devolver','c'],['Morder',"m"],['Deixar pra lá','d'],['Contar pra mãe','t']]}),
  pick:(k,d)=>{ const s=P(d.s); if(k==='c'){ st('happy',-2); return R.chance(.5)?`${s.first} devolveu, revirando os olhos.`:'Chorei uma hora e não adiantou nada.'; } if(k==='m'){ s.bond=clamp(s.bond-15); S.me.karma=clamp(S.me.karma-2); return `Mordi ${s.first}. Fiquei de castigo, mas recuperei o ${d.toy}.`; } if(k==='d'){ s.bond=clamp(s.bond+6); S.me.karma=clamp(S.me.karma+1); return `${s.first} acabou me devolvendo depois.`; } return R.chance(.6)?'Minha mãe resolveu a briga.':'Minha mãe mandou a gente se virar.'; }},
 cachorro_rua:{w:2,when:m=>m.age>=4&&m.age<=15&&free(m),prep:()=>({}),
  show:()=>({k:'Rua',t:'Um cachorro me seguiu',x:'Um vira-lata magrinho me seguiu até em casa, abanando o rabo.',ch:[['Pedir pros meus pais pra ficar','f'],['Dar comida e deixar ir','c'],['Ignorar','i']]}),
  pick:k=>{ if(k==='f'){ if(R.chance(.55)){ const p=addP(mkPerson({rel:'pet',first:R.pick(PET_NAMES),species:'Cachorro|Cadela',age:R.int(1,4),life:R.int(10,16),bond:85})); cnt('pets'); st('happy',10); return `Eles deixaram! Chamei de ${p.first}.`; } st('happy',-5); return 'Meus pais disseram que não. O cachorro foi embora.'; } if(k==='c'){ S.me.karma=clamp(S.me.karma+2); return 'Ele comeu tudo e foi embora feliz.'; } return 'Ele ficou na esquina me olhando.'; }},
 valentao:{w:3,when:m=>m.age>=7&&m.age<=17&&inSchool(m),prep:()=>{ const b=addP(mkPerson({rel:'inimigo',age:S.me.age+R.int(0,2),bond:5})); return {b:b.id}; },
  show:d=>({k:'Escola',t:'Valentão',x:`${fullName(P(d.b))} vive me provocando no recreio. Hoje ${P(d.b).gender==='F'?'ela':'ele'} derrubou meu lanche no chão.`,ch:[['Partir pra cima','f'],['Contar à diretora','t'],['Ignorar','i'],['Tentar fazer amizade','a']]}),
  pick:(k,d)=>{ const b=P(d.b),m=S.me; if(k==='f'){ setTimeout(()=>startFight({p:b},'escola'),80); return `Partimos para a briga no meio do recreio!`; } if(k==='t'){ return R.chance(.6)?`${b.first} levou suspensão.`:'A diretora não fez nada.'; } if(k==='a'){ if(R.chance(.3)){ b.rel='amigo'; b.bond=50; return `Quem diria: ${b.first} virou ${b.gender==='F'?'minha amiga':'meu amigo'}.`; } return `${b.first} riu da minha cara.`; } st('happy',-4); return 'Engoli a raiva.'; }},
 dinheiro_chao:{w:2,when:m=>m.age>=6&&free(m),prep:()=>({v:amt(5,R.chance(.1)?2000:200)}),
  show:d=>({k:'Sorte',t:'Dinheiro no chão',x:`Achei ${fmt(d.v)} na calçada.`,ch:[['Guardar no bolso','g'],['Procurar o dono','e']]}),
  pick:(k,d)=>{ if(k==='g'){ S.me.money+=d.v; S.me.karma=clamp(S.me.karma-1); return `Fiquei com ${fmt(d.v)}.`; } S.me.karma=clamp(S.me.karma+4); if(R.chance(.3)){ S.me.money+=Math.round(d.v/2); return `Achei o dono, que me deu ${fmt(d.v/2)} de recompensa.`; } return 'Não achei o dono, então deixei com o guarda da esquina.'; }},
 pais_brigam:{w:2,when:m=>m.age>=4&&m.age<=16&&paisJuntos(),prep:()=>({}),
  show:()=>({k:'Família',t:'Gritos na sala',x:'Meus pais estão brigando feio por causa de dinheiro.',ch:[['Ir lá pedir pra pararem','p'],['Colocar fone e fingir dormir','f'],['Chorar alto','c']]}),
  pick:k=>{ if(k==='p'){ parents().forEach(p=>p.bond=clamp(p.bond+3)); return R.chance(.6)?'Eles pararam e me abraçaram.':'Me mandaram voltar pro quarto.'; } if(k==='c'){ return 'Eles pararam na hora.'; } st('happy',-3); return 'Dormi ouvindo a briga pelo fone.'; }},
 feira:{w:2,when:m=>m.age>=8&&m.age<=17&&inSchool(m),prep:()=>({}),
  show:()=>({k:'Escola',t:'Feira de ciências',x:'O projeto da feira de ciências vale nota. O que vou apresentar?',ch:[['Vulcão de bicarbonato','v'],['Robô de sucata','r'],['Maquete do sistema solar','s'],['Não fazer nada','n']]}),
  pick:k=>{ const m=S.me,c=m.edu.cur; if(k==='n'){ c.grade=clamp(c.grade-8); return 'Tirei zero no projeto.'; } const p=k==='r'?m.smarts/120:k==='v'?.7:.55; if(R.chance(p)){ c.grade=clamp(c.grade+R.int(5,12)); st('smarts',2); return R.chance(.3)?'Ganhei o primeiro lugar da feira!':'Tirei nota alta.'; } c.grade=clamp(c.grade-3); return R.pick(['O vulcão explodiu na cara da professora.','O projeto quebrou no caminho.','Esqueci a maquete no ônibus.']); }},
 festa_teen:{w:3,when:m=>m.age>=14&&m.age<=19&&free(m),prep:()=>({h:stranger({age:S.me.age}).first}),
  show:d=>({k:'Social',t:'Festa na casa de '+d.h,x:`${d.h} está dando uma festa enquanto os pais viajam.`,ch:[['Ir e beber','b'],['Ir sem beber','s'],['Ficar em casa','c']]}),
  pick:k=>{ const m=S.me; if(k==='c'){ st('happy',-2); return 'Fiquei em casa vendo série.'; } st('happy',R.int(4,10)); if(k==='b'){ m.add.alcool=clamp(m.add.alcool+R.int(4,14)*(1.4-m.will/100)); if(R.chance(.25)&&m.age<18){ parents().forEach(p=>p.bond=clamp(p.bond-12)); return 'Cheguei em casa tropeçando e meus pais me pegaram.'; } if(R.chance(.15)){ st('health',-6); return 'Passei mal e acordei no banheiro.'; } return 'Foi uma noite épica.'; } if(R.chance(.3)){ const f=addP(mkPerson({rel:'amigo',age:m.age,bond:50})); return `Conheci ${f.first} e viramos amigos.`; } return 'Dancei a noite toda.'; }},
 cigarro:{w:2,when:m=>m.age>=13&&m.age<=30&&free(m)&&m.add.cigarro<30,prep:()=>({t:R.pick(['um cigarro','um vape de menta','um charuto','um cigarro de palha'])}),
  show:d=>({k:'Tentação',t:'Quer um trago?',x:`Um conhecido me ofereceu ${d.t}.`,ch:[['Aceitar','a'],['Recusar','r']]}),
  pick:k=>{ const m=S.me; if(k==='a'){ m.add.cigarro=clamp(m.add.cigarro+R.int(10,30)*(1.4-m.will/100)); return R.chance(.5)?'Tossi feito louco.':'Até que gostei. Isso pode ser um problema.'; } return 'Recusei numa boa.'; }},
 crush:{w:3,when:m=>m.age>=12&&m.age<=19&&inSchool(m)&&!partners().length,prep:()=>{ const m=S.me; const gd=m.pref==='A'?(R.chance(.5)?'M':'F'):m.pref; const p=addP(mkPerson({rel:'colega',gender:gd,age:m.age+R.int(-1,1),bond:55})); return {p:p.id}; },
  show:d=>({k:'Coração',t:'Bilhete na mochila',x:`${fullName(P(d.p))}, da minha sala, disse que gosta de mim.`,ch:[['Pedir em namoro','n'],['Recusar com carinho','r'],['Rir da cara','x']]}),
  pick:(k,d)=>{ const p=P(d.p); if(k==='n'){ const erro=polyNamorar(p); if(erro) return erro; p.bond=75; cnt('partners'); st('happy',10); return `Agora ${p.first} e eu estamos namorando.`; } if(k==='x'){ S.me.karma=clamp(S.me.karma-4); p.rel='inimigo'; p.bond=5; return `${p.first} saiu chorando. A escola inteira ficou sabendo.`; } p.bond=40; return `${p.first} entendeu.`; }},
 prova:{w:3,when:m=>m.age>=8&&m.edu.cur&&free(m),prep:()=>({s:R.pick(['matemática','química','história','física','biologia','português','geografia','inglês'])}),
  show:d=>({k:'Estudos',t:'Prova surpresa',x:`Prova surpresa de ${d.s}. Não estudei nada.`,ch:[['Colar do colega','c'],['Fazer do jeito que der','h'],['Entregar em branco','b']]}),
  pick:k=>{ const m=S.me,c=m.edu.cur; if(k==='c'){ if(R.chance(.25)){ c.grade=clamp(c.grade-15); m.karma=clamp(m.karma-2); return 'Fui pego colando e levei zero.'; } c.grade=clamp(c.grade+6); return 'Colei e tirei nota boa. Ninguém viu.'; } if(k==='b'){ c.grade=clamp(c.grade-10); return 'Zero.'; } const ok=R.chance(m.smarts/100); c.grade=clamp(c.grade+(ok?5:-5)); return ok?'Fui bem, por incrível que pareça.':'Fui mal.'; }},
 apelido:{w:1,when:m=>m.age>=7&&m.age<=15&&inSchool(m),prep:()=>({a:R.pick(['Pernalonga','Batatinha','Cabeção','Formiga','Picolé','Girafa','Ratinho','Chiclete','Bolacha','Espeto'])}),
  show:d=>({k:'Escola',t:'Novo apelido',x:`A turma inteira começou a me chamar de "${d.a}".`,ch:[['Aceitar e rir junto','a'],['Ficar furioso','f']]}),
  pick:(k,d)=>{ if(k==='a'){ st('happy',3); return `"${d.a}" pegou de vez, e eu até gostei.`; } st('happy',-5); return 'Quanto mais eu reclamava, mais me chamavam assim.'; }},
 talento:{w:2,onceLife:1,when:m=>m.age>=6&&m.age<=14,prep:()=>{ const m=S.me; const t=Object.keys(TALENTS).sort((a,b)=>(m.talent[b]||0)-(m.talent[a]||0))[R.int(0,1)]; return {t}; },
  show:d=>({k:'Talento',t:'Olha só!',x:`Um professor disse que eu tenho jeito para ${({acting:'atuar',musical:'música',athletic:'esportes',art:'desenho e pintura',dance:'dançar',writing:'escrever',comedy:'fazer os outros rirem'})[d.t]}.`,ch:[['Pedir aos meus pais para fazer aulas','s'],['Não ligar','n']]}),
  pick:(k,d)=>{ if(k==='s'){ S.me.talent[d.t]=clamp((S.me.talent[d.t]||0)+R.int(8,18)); return 'Comecei as aulas e estou evoluindo rápido.'; } return 'Deixei para lá.'; }},
 olheiro:{w:2,onceLife:1,when:m=>m.age>=13&&m.age<=22&&m.talent.athletic>=65&&free(m)&&!(m.job&&m.job.spc),prep:()=>({e:R.pick(['futebol','basquete','vôlei','handebol','tênis','natação','atletismo'])}),
  show:d=>({k:'Oportunidade',t:'Um olheiro me viu jogar',x:`Um olheiro de um time de ${d.e} quer que eu faça um teste.`,ch:[['Fazer o teste','t'],['Recusar','r']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='r') return 'Recusei. Fica para outra vida.'; if(R.chance(m.talent.athletic/120+m.health/400)){ if(m.job) endJob(); m.job={spc:'atleta',lvl:0,perf:60,yrs:0,co:'Time de '+d.e}; st('happy',15); return `Passei! Agora sou atleta da base do time de ${d.e}.`; } return 'Não passei no teste.'; }},
 agencia:{w:2,onceLife:1,when:m=>m.age>=14&&m.age<=28&&m.looks>=78&&free(m)&&!(m.job&&m.job.spc),prep:()=>({}),
  show:()=>({k:'Oportunidade',t:'Agência de modelos',x:'Uma agência de modelos me parou no shopping e me ofereceu um contrato.',ch:[['Assinar','s'],['Recusar','r']]}),
  pick:k=>{ const m=S.me; if(k==='r') return 'Recusei.'; if(m.job) endJob(); m.job={spc:'modelo',lvl:0,perf:60,yrs:0,co:'Agência '+R.pick(['Elite','Prisma','Aurora','Vértice','Íris'])}; st('happy',12); return 'Assinei! Já tenho meu primeiro trabalho.'; }},
 banda:{w:2,when:m=>m.age>=14&&m.age<=40&&m.talent.musical>=60&&free(m)&&!(m.job&&m.job.spc==='musico'),prep:()=>({b:R.pick(['Os Desafinados','Ruído Branco','Tamborim Elétrico','Lua de Lata','Fim de Feira','Café Amargo','Sétima Menor'])}),
  show:d=>({k:'Música',t:'Convite para banda',x:`A banda "${d.b}" precisa de alguém como eu.`,ch:[['Entrar na banda','e'],['Recusar','r']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='r') return 'Recusei o convite.'; m.talent.musical=clamp(m.talent.musical+5); st('happy',8); if(!m.job||m.job.pt){ if(m.job) endJob(); m.job={spc:'musico',lvl:0,perf:55,yrs:0,co:d.b}; return `Agora toco com a ${d.b} em bares da cidade.`; } return 'Entrei na banda como hobby.'; }},
 reality:{w:1,when:m=>m.age>=18&&m.age<=45&&(m.looks>=60||m.fame>=20)&&free(m),prep:()=>({n:R.pick(['Casa de Vidro','Ilha dos Solteiros','Cozinha Sob Pressão','A Fazendinha','Desafio Extremo'])}),
  show:d=>({k:'TV',t:'Convite de reality show',x:`Fui convidad${oa()} para o reality "${d.n}".`,ch:[['Participar','p'],['Recusar','r']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='r') return 'Recusei.'; m.fame=clamp(m.fame+R.int(10,30)); if(m.social) m.social.f+=R.int(20000,400000); if(R.chance(.15)){ const p=R.int(100,1500)*1000; m.money+=p; st('happy',20); return `Ganhei o reality e levei ${fmt(p)}!`; } st('happy',R.chance(.5)?6:-6); return R.pick(['Fui eliminad'+oa()+' na terceira semana.','Virei meme nacional.','Briguei com metade da casa e saí no paredão.']); }},

 // ---------- vida adulta ----------
 carteira:{w:2,when:m=>m.age>=12&&free(m),prep:()=>({v:amt(50,1500),o:stranger().first}),
  show:d=>({k:'Ética',t:'Carteira perdida',x:`Achei a carteira de ${d.o} com ${fmt(d.v)} e documentos.`,ch:[['Devolver tudo','d'],['Pegar o dinheiro e devolver os documentos','p'],['Ficar com tudo','f']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='d'){ m.karma=clamp(m.karma+5); if(R.chance(.35)){ const r=Math.round(d.v*.3); m.money+=r; return `${d.o} me deu ${fmt(r)} de recompensa.`; } return `${d.o} agradeceu muito.`; } m.money+=d.v; m.karma=clamp(m.karma-(k==='p'?3:6)); return `Fiquei com ${fmt(d.v)}.`; }},
 pedinte:{w:2,when:m=>m.age>=14&&free(m),prep:()=>({v:amt(5,80)}),
  show:d=>({k:'Rua',t:'Um pedido',x:`Uma pessoa em situação de rua me pediu ${fmt(d.v)} para comer.`,ch:[['Dar o dinheiro','d'],['Comprar um lanche pra ela','l'],['Ignorar','i'],['Mandar trabalhar','x']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='d'||k==='l'){ m.money-=d.v; m.karma=clamp(m.karma+3); cnt('gifts'); return 'Ela agradeceu com os olhos cheios.'; } if(k==='x'){ m.karma=clamp(m.karma-4); return 'Ela me olhou com desprezo.'; } return 'Segui andando.'; }},
 golpe:{w:2,when:m=>m.age>=18&&free(m),prep:()=>({p:amt(10000,500000),f:amt(200,3000)}),
  show:d=>({k:'Telefone',t:'Você ganhou um prêmio!',x:`Uma voz animada diz que ganhei ${fmt(d.p)} num sorteio. Só preciso pagar uma taxa de ${fmt(d.f)}.`,ch:[['Pagar a taxa','p'],['Desligar','d'],['Enrolar o golpista','e']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='p'){ m.money-=d.f; st('happy',-8); return `Era golpe. Perdi ${fmt(d.f)}.`; } if(k==='e'){ st('happy',4); return 'Enrolei o golpista por 40 minutos. Ele desligou na minha cara.'; } return 'Desliguei.'; }},
 empresta:{w:2,when:m=>m.age>=16&&people('amigo','irmao').length&&free(m),prep:()=>({p:R.pick(people('amigo','irmao')).id,v:amt(200,S.me.age>25?8000:800)}),
  show:d=>({k:'Dinheiro',t:'Pedido de empréstimo',x:`${P(d.p).first} me pediu ${fmt(d.v)} emprestado e jura que devolve.`,ch:[['Emprestar','e'],['Negar','n']]}),
  pick:(k,d)=>{ const p=P(d.p),m=S.me; if(k==='n'){ p.bond=clamp(p.bond-10); return `${p.first} ficou chatead${p.gender==='F'?'a':'o'}.`; } m.money-=d.v; p.bond=clamp(p.bond+10); if(R.chance(.5)){ m.money+=d.v; return `${p.first} devolveu tudo uns meses depois.`; } return `${p.first} nunca mais tocou no assunto.`; }},
 assalto:{w:2,when:m=>m.age>=12&&free(m),prep:()=>({w:R.pick(['uma faca','um canivete','um caco de vidro','uma arma'])}),
  show:d=>({k:'Perigo',t:'Assalto!',x:`Um sujeito com ${d.w} me encurralou e pediu o celular e a carteira.`,ch:[['Reagir','r'],['Entregar tudo','e'],['Sair correndo','c']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='e'){ const l=Math.min(Math.max(0,m.money),amt(50,600)); m.money-=l; st('happy',-6); return `Levaram meu celular e ${fmt(l)}.`; } if(k==='c'){ if(R.chance(m.health/140)) return 'Corri e escapei!'; st('health',-8); return 'Tropecei e ainda levei um soco.'; } if(R.chance(.2+m.fight/150)){ m.fight=clamp(m.fight+4); m.karma=clamp(m.karma+2); return 'Desarmei o assaltante e ele fugiu!'; } st('health',-R.int(15,35)); return 'Reagi e fui ferid'+oa()+'. Passei dias no hospital.'; }},
 acidente:{w:2,when:m=>hasCar(m)&&free(m),prep:()=>({}),
  show:()=>({k:'Trânsito',t:'Batida',x:'Um carro avançou o sinal e bateu no meu.',ch:[['Chamar o seguro','s'],['Discutir com o motorista','d'],['Ir embora','f']]}),
  pick:k=>{ const m=S.me,c=m.assets.find(a=>a.k==='carro'); c.cond=clamp(c.cond-R.int(15,40)); st('health',-R.int(0,12)); if(k==='d'){ if(R.chance(.3)){ st('health',-10); return 'A discussão virou briga.'; } return 'Gritamos um com o outro e nada se resolveu.'; } if(k==='f') return 'Fui embora com o carro amassado.'; return 'O seguro cobriu parte do conserto.'; }},
 heranca:{w:.4,when:m=>m.age>=18,prep:()=>({v:amt(5000,400000),q:R.pick(['tia-avó','tio distante','primo de segundo grau','padrinho que eu mal conhecia'])}),
  show:d=>({k:'Surpresa',t:'Herança inesperada',x:`Um ${d.q} morreu e me deixou ${fmt(d.v)} em testamento.`,ch:[['Aceitar','a'],['Doar metade para caridade','d']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='d'){ m.money+=d.v/2; m.karma=clamp(m.karma+8); cnt('gifts',3); return `Fiquei com ${fmt(d.v/2)} e doei o resto.`; } m.money+=d.v; st('happy',10); return `Recebi ${fmt(d.v)}.`; }},
 raspadinha:{w:1.5,when:m=>m.age>=18&&free(m),prep:()=>({}),
  show:()=>({k:'Sorte',t:'Raspadinha',x:'Achei uma raspadinha intacta no chão do ônibus.',ch:[['Raspar','r'],['Jogar fora','j']]}),
  pick:k=>{ if(k==='j') return 'Joguei fora sem olhar.'; const r=R.f(); if(r<.01){ S.me.money+=50000; return 'Ganhei $50.000!'; } if(r<.15){ const v=R.pick([5,10,20,100,500]); S.me.money+=v; return `Ganhei ${fmt(v)}.`; } return 'Nada. Nem o valor da raspadinha.'; }},
 vizinho:{w:1.5,when:m=>m.age>=18&&S.flags.movedOut&&free(m),prep:()=>({x:R.pick(['toca bateria às 3 da manhã','dá festa todo dia de semana','tem um cachorro que late sem parar','faz obra no domingo cedo'])}),
  show:d=>({k:'Vizinhança',t:'Vizinho barulhento',x:`Meu vizinho ${d.x}.`,ch:[['Reclamar educadamente','e'],['Chamar a polícia','p'],['Fazer mais barulho','b'],['Aguentar calado','a']]}),
  pick:k=>{ if(k==='e') return R.chance(.5)?'Ele pediu desculpas e melhorou.':'Ele bateu a porta na minha cara.'; if(k==='p') return 'A polícia apareceu, e ele me odeia agora.'; if(k==='b'){ st('happy',3); return 'Coloquei funk no último volume. Guerra declarada.'; } st('happy',-5); return 'Não dormi direito o ano todo.'; }},
 headhunter:{w:2,when:m=>m.job&&!m.job.spc&&!JOBS.find(x=>x.id===m.job.id).pt&&free(m),prep:()=>({p:R.int(10,40),c:companyName()}),
  show:d=>({k:'Carreira',t:'Proposta de emprego',x:`A ${d.c} quer me contratar pagando ${d.p}% a mais.`,ch:[['Aceitar','a'],['Usar a proposta para pedir aumento','u'],['Recusar','r']]}),
  pick:(k,d)=>{ const j=S.me.job; if(k==='a'){ endJob(); S.me.job=Object.assign({},j,{co:d.c,mul:(j.mul||1)*(1+d.p/100),yrs:0,perf:55}); return `Mudei para a ${d.c}.`; } if(k==='u'){ if(R.chance(.5)){ j.mul=(j.mul||1)*(1+d.p/200); return 'Meu chefe cobriu parte da proposta.'; } j.perf=clamp(j.perf-10); return 'Meu chefe não gostou nada da chantagem.'; } return 'Recusei e fiquei onde estou.'; }},
 flerte_trab:{w:1.5,when:m=>m.job&&m.age>=18&&free(m),prep:()=>{ const m=S.me; const gd=m.pref==='A'?(R.chance(.5)?'M':'F'):m.pref; const p=addP(mkPerson({rel:'colegaT',gender:gd,age:clamp(m.age+R.int(-6,6),18,90),bond:55})); return {p:p.id}; },
  show:d=>({k:'Trabalho',t:'Clima no escritório',x:`${fullName(P(d.p))}, ${P(d.p).age} anos, colega de trabalho, está claramente flertando comigo.`,ch:[['Corresponder','c'],['Cortar o clima','r']]}),
  pick:(k,d)=>{ const p=P(d.p); if(k==='r') return 'Deixei claro que não rola.'; const cur=pickPartner(); if(cur){ cnt('cheats'); if(R.chance(.35)){ cur.bond=clamp(cur.bond-40); return `${cur.first} descobriu tudo. A casa caiu.`; } st('happy',6); return `Tive um caso escondido com ${p.first}.`; } p.rel='namoro'; p.bond=70; cnt('partners'); st('happy',8); return `Comecei a namorar ${p.first}.`; }},
 socio:{w:1.5,when:m=>m.age>=22&&m.money>5000&&free(m),prep:()=>({v:amt(3000,Math.min(200000,Math.max(5000,S.me.money*.6))),n:R.pick(['uma hamburgueria artesanal','um aplicativo de delivery de pet','uma loja de açaí','uma marca de roupas','uma cervejaria','uma startup de inteligência artificial','um food truck','uma franquia de lavanderia']),f:friendName()||'Um conhecido'}),
  show:d=>({k:'Negócio',t:'Proposta de sociedade',x:`${d.f} quer abrir ${d.n} e me chamou para investir ${fmt(d.v)}.`,ch:[['Investir','i'],['Recusar','r']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='r') return 'Recusei.'; m.money-=d.v; const r=R.f(); if(r<.25){ const g2=Math.round(d.v*R.int(2,6)); m.money+=g2; st('happy',15); return `O negócio bombou! Recebi ${fmt(g2)}.`; } if(r<.55){ const g2=Math.round(d.v*1.2); m.money+=g2; return `Deu um lucro modesto: recebi ${fmt(g2)}.`; } st('happy',-10); return 'O negócio faliu em oito meses. Perdi tudo.'; }},
 casa_assaltada:{w:1,when:m=>hasHouse(m)&&free(m),prep:()=>({v:amt(1000,30000)}),
  show:d=>({k:'Casa',t:'Minha casa foi assaltada',x:`Arrombaram minha casa e levaram uns ${fmt(d.v)} em coisas.`,ch:[['Registrar boletim de ocorrência','b'],['Instalar alarme ($4.000)','a'],['Investigar por conta própria','i']]}),
  pick:(k,d)=>{ const m=S.me; m.money-=Math.round(d.v*.5); st('happy',-8); if(k==='a'){ m.money-=4000; return 'Instalei alarme e câmeras.'; } if(k==='i'){ if(R.chance(.2)){ m.money+=d.v*.5; return 'Achei minhas coisas à venda numa feira e recuperei quase tudo!'; } return 'Não descobri nada.'; } return 'Registrei o B.O. Nunca mais ouvi falar disso.'; }},
 desastre:{w:.6,when:m=>m.age>=6&&free(m),prep:()=>({t:R.pick(['Uma enchente','Um incêndio no quarteirão','Um vendaval','Um deslizamento de terra','Um terremoto'])}),
  show:d=>({k:'Desastre',t:d.t,x:`${d.t} atingiu meu bairro.`,ch:[['Ajudar os vizinhos','a'],['Proteger minhas coisas','p'],['Fugir para longe','f']]}),
  pick:k=>{ const m=S.me; m.assets.filter(a=>a.k==='casa').forEach(a=>a.cond=clamp(a.cond-R.int(10,40))); if(k==='a'){ m.karma=clamp(m.karma+6); if(R.chance(.2)){ st('health',-15); return 'Me machuquei ajudando, mas salvei uma família.'; } return 'Ajudei a tirar gente de casa. Virei herói do bairro.'; } if(k==='f') return 'Fugi a tempo.'; st('health',-R.int(0,10)); return 'Salvei o que deu.'; }},
 viral:{w:2,when:m=>m.social&&free(m),prep:()=>({t:R.pick(['um vídeo meu tropeçando numa escada rolante','uma receita de miojo gourmet','minha opinião sobre abacaxi na pizza','uma dancinha','um vídeo do meu gato','um desabafo sobre o trânsito'])}),
  show:d=>({k:'Internet',t:'Viralizou!',x:`Postei ${d.t} e explodiu na internet.`,ch:[['Aproveitar a fama','a'],['Apagar o post','d']]}),
  pick:k=>{ const m=S.me; if(k==='d') return 'Apaguei. Melhor assim.'; const g2=R.int(5000,250000); m.social.f+=g2; m.fame=clamp(m.fame+R.int(2,10)); return `Ganhei ${g2.toLocaleString('pt-BR')} seguidores.`; }},
 pet_doente:{w:2,when:m=>people('pet').length&&free(m),prep:()=>({p:R.pick(people('pet')).id,v:amt(200,4000)}),
  show:d=>({k:'Bicho',t:`${P(d.p).first} está doente`,x:`${P(d.p).first} parou de comer. O veterinário cobra ${fmt(d.v)}.`,ch:[['Levar ao veterinário','v'],['Esperar melhorar','e']]}),
  pick:(k,d)=>{ const p=P(d.p),m=S.me; if(k==='v'){ m.money-=d.v; if(R.chance(.85)) return `${p.first} se recuperou!`; } else if(R.chance(.6)) return `${p.first} melhorou sozinho.`; if(petRetirar(p,'morto','durante uma doença'))st('happy',-12); return `${p.first} não resistiu.`; }},
 traicao:{w:1,when:m=>partners(p=>p.bond<55).length&&free(m),prep:()=>({p:pickPartner(p=>p.bond<55).id}),
  show:d=>({k:'Amor',t:'Mensagens suspeitas',x:`Vi mensagens no celular de ${P(d.p).first}. Estou sendo traíd${oa()}.`,ch:[['Perdoar','p'],['Terminar na hora','t'],['Fazer um escândalo','e']]}),
  pick:(k,d)=>{ const p=P(d.p); st('happy',-12); if(k==='p'){ p.bond=clamp(p.bond+10); return 'Perdoei. Vamos ver no que dá.'; } if(p.rel==='conjuge'){ divorce(p,false); return `Acabou com ${p.first}.`; } p.rel='ex'; return k==='e'?'Joguei as roupas pela janela. O prédio inteiro assistiu.':`Terminei com ${p.first}.`; }},
 pedido:{w:2,when:m=>m.age>=18&&people('namoro').some(p=>p.yrs>=2&&p.bond>=65)&&free(m),prep:()=>({p:people('namoro').find(p=>p.yrs>=2&&p.bond>=65).id}),
  show:d=>({k:'Amor',t:'Ajoelhou!',x:`${P(d.p).first} se ajoelhou com um anel e me pediu em casamento.`,ch:[['Aceitar','a'],['Recusar','r']]}),
  pick:(k,d)=>{ const p=P(d.p); if(k==='a'){ if(!polyPodeOficializar(p)) return 'Não aceitei: ainda falta o consentimento dos meus outros parceiros.'; p.rel='noivo'; p.bond=clamp(p.bond+15); st('happy',15); return 'Estamos noivos!'; } p.bond=clamp(p.bond-35); return `${p.first} ficou arrasad${p.gender==='F'?'a':'o'}.`; }},
 filho_rebelde:{w:2,when:m=>kids().some(k=>k.age>=12&&k.age<=17)&&free(m),prep:()=>{ const k=R.pick(kids().filter(k=>k.age>=12&&k.age<=17)); return {k:k.id,x:R.pick(['foi pego fumando atrás da escola','pichou o muro da escola','fugiu de casa por uma noite','tirou zero em tudo','foi pego bebendo numa festa','brigou com um colega'])}; },
  show:d=>({k:'Filhos',t:'Problemas em casa',x:`${P(d.k).first} ${d.x}.`,ch:[['Conversar com calma','c'],['Deixar de castigo','p'],['Fingir que não vi','i']]}),
  pick:(k,d)=>{ const c=P(d.k); if(k==='c'){ c.bond=clamp(c.bond+8); return 'Tivemos uma conversa longa e boa.'; } if(k==='p'){ c.bond=clamp(c.bond-8); return `${c.first} bateu a porta do quarto.`; } c.bond=clamp(c.bond-2); return 'Deixei passar.'; }},
 filho_grana:{w:2,when:m=>kids().some(k=>k.age>=18)&&m.money>1000&&free(m),prep:()=>{ const k=R.pick(kids().filter(k=>k.age>=18)); return {k:k.id,v:amt(500,Math.min(80000,Math.max(1000,S.me.money*.1))),x:R.pick(['pagar o aluguel','abrir um negócio','fazer uma viagem','sair das dívidas','dar entrada num carro'])}; },
  show:d=>({k:'Filhos',t:`${P(d.k).first} precisa de ajuda`,x:`${P(d.k).first} me pediu ${fmt(d.v)} para ${d.x}.`,ch:[['Dar o dinheiro','d'],['Negar','n']]}),
  pick:(k,d)=>{ const c=P(d.k); if(k==='d'){ S.me.money-=d.v; c.bond=clamp(c.bond+12); cnt('gifts'); return `${c.first} me abraçou forte.`; } c.bond=clamp(c.bond-12); return `${c.first} ficou magoad${c.gender==='F'?'a':'o'}.`; }},
 pais_doentes:{w:2,when:m=>m.age>=18&&parents().some(p=>p.age>=60)&&free(m),prep:()=>{ const p=R.pick(parents().filter(p=>p.age>=60)); return {p:p.id,v:amt(5000,80000),d:R.pick(['um problema no coração','um câncer','uma infecção grave','uma doença nos rins'])}; },
  show:d=>({k:'Família',t:'Notícia ruim',x:`${relLabel(P(d.p))} está com ${d.d}. O tratamento custa ${fmt(d.v)}.`,ch:[['Pagar o tratamento','p'],['Visitar no hospital','v'],['Não fazer nada','n']]}),
  pick:(k,d)=>{ const p=P(d.p),m=S.me; if(k==='p'){ m.money-=d.v; p.bond=clamp(p.bond+20); m.karma=clamp(m.karma+5); if(R.chance(.75)){ p.health=clamp(p.health+30); return `${p.first} se recuperou!`; } } else if(k==='v'){ p.bond=clamp(p.bond+10); if(R.chance(.5)) return `${p.first} ficou feliz com a visita e melhorou.`; } else { m.karma=clamp(m.karma-5); if(R.chance(.5)) return `${p.first} se recuperou, sem mim.`; } p.alive=false; st('happy',-25); return `${relLabel(p)} ${p.first} morreu no hospital.`; }},
 ex_volta:{w:1.5,when:m=>!partners().length&&people('ex').some(p=>p.age<80)&&free(m),prep:()=>({p:R.pick(people('ex')).id}),
  show:d=>({k:'Amor',t:'Mensagem de madrugada',x:`${P(d.p).first}, meu ex, mandou: "saudade de você..."`,ch:[['Voltar','v'],['Visualizar e não responder','n']]}),
  pick:(k,d)=>{ const p=P(d.p); if(k==='v'){ const erro=polyNamorar(p); if(erro) return erro; p.bond=60; st('happy',6); return `Voltei com ${p.first}.`; } return 'Deixei no vácuo.'; }},
 juri:{w:1,when:m=>m.age>=18&&free(m),prep:()=>({}),
  show:()=>({k:'Dever cívico',t:'Convocação para júri',x:'Fui convocad'+oa()+' para ser jurad'+oa()+' num julgamento.',ch:[['Comparecer','c'],['Faltar','f']]}),
  pick:k=>{ if(k==='c'){ S.me.karma=clamp(S.me.karma+2); return R.pick(['O réu foi condenado.','O réu foi absolvido.','O julgamento durou três semanas.']); } S.me.money-=1500; return 'Levei uma multa de $1.500.'; }},
 sangue:{w:1,when:m=>m.age>=18&&m.age<=65&&free(m),prep:()=>({}),
  show:()=>({k:'Saúde',t:'Campanha de doação',x:'O hemocentro está com estoque baixo.',ch:[['Doar sangue','d'],['Agora não','n']]}),
  pick:k=>{ if(k==='d'){ S.me.karma=clamp(S.me.karma+4); st('health',-1); return R.chance(.2)?'Desmaiei logo depois. Mas valeu a pena.':'Doei sangue e ganhei um suco.'; } return 'Passei reto.'; }},
 testemunha:{w:1,when:m=>m.age>=14&&free(m),prep:()=>({x:R.pick(['um roubo de moto','uma briga de bar acabar mal','um atropelamento com fuga','um assalto a uma farmácia'])}),
  show:d=>({k:'Ética',t:'Testemunha',x:`Vi ${d.x}. A polícia procura testemunhas.`,ch:[['Testemunhar','t'],['Fingir que não vi','f']]}),
  pick:k=>{ if(k==='t'){ S.me.karma=clamp(S.me.karma+5); if(R.chance(.1)){ st('happy',-10); return 'Recebi ameaças depois do depoimento.'; } return 'Meu depoimento ajudou a prender o culpado.'; } S.me.karma=clamp(S.me.karma-2); return 'Fiquei na minha.'; }},
 carro_quebrou:{w:1.5,when:m=>hasCar(m)&&free(m),prep:()=>({v:amt(400,6000)}),
  show:d=>({k:'Carro',t:'O carro morreu',x:`Meu carro quebrou no meio da avenida. O conserto sai ${fmt(d.v)}.`,ch:[['Consertar','c'],['Deixar parado na garagem','d']]}),
  pick:(k,d)=>{ const c=S.me.assets.find(a=>a.k==='carro'); if(k==='c'){ S.me.money-=d.v; c.cond=clamp(c.cond+25); return 'Consertei.'; } c.cond=clamp(c.cond-15); return 'Ficou parado juntando poeira.'; }},
 crise:{w:2,onceLife:1,when:m=>m.age>=40&&m.age<=56&&free(m),prep:()=>({}),
  show:()=>({k:'Meia-idade',t:'Crise dos quarenta',x:'Acordei me perguntando o que fiz da minha vida.',ch:[['Comprar um conversível','c'],['Fazer uma tatuagem enorme','t'],['Largar tudo e viajar','v'],['Fazer terapia','p']]}),
  pick:k=>{ const m=S.me; if(k==='c'){ const v=300000; if(!canPay(v)) return 'Fui à concessionária e voltei de ônibus. Não tinha dinheiro.'; m.money-=v; m.assets.push({id:newId(),k:'carro',n:'Conversível '+R.pick(CAR_COLORS),value:v,cond:100,buy:v}); st('happy',15); return 'Comprei um conversível vermelho... digo, de outra cor. Me sinto com 25.'; } if(k==='t'){ st('happy',6); st('looks',R.int(-5,5)); return `Tatuei ${R.pick(['um leão nas costas','um dragão no braço','o rosto da minha mãe','uma frase em latim que não sei traduzir'])}.`; } if(k==='v'){ m.money-=15000; cnt('trips'); st('happy',18); if(m.job&&R.chance(.5)){ endJob(); return 'Viajei pelo mundo por meses e perdi o emprego. Valeu cada dia.'; } return 'Fiz um mochilão de três meses.'; } st('happy',10); m.money-=3000; return 'A terapia me fez muito bem.'; }},
 tatuagem:{w:1,when:m=>m.age>=16&&m.age<=60&&free(m),prep:()=>({t:R.pick(['o nome de quem eu amo','uma âncora','um dragão','uma frase motivacional','o símbolo do meu time','um infinito','uma caveira mexicana','uma rosa'])}),
  show:d=>({k:'Estilo',t:'Tatuagem?',x:`Estou pensando em tatuar ${d.t}.`,ch:[['Tatuar','t'],['Desistir','d']]}),
  pick:(k,d)=>{ if(k==='d') return 'Desisti.'; S.me.money-=amt(200,1500); st('happy',5); if(R.chance(.15)){ st('looks',-4); return 'O tatuador errou uma letra. Ficou horrível.'; } st('looks',R.int(0,3)); return `Tatuei ${d.t}. Ficou ótimo.`; }},
 convite_crime:{w:1,when:m=>m.age>=15&&(m.karma<45||m.rec.crimes>0)&&free(m),prep:()=>({f:stranger().first,c:R.pick(['assaltar uma loja de eletrônicos','roubar cabos de cobre','dar um golpe num velhinho','furtar uma carga de celulares'])}),
  show:d=>({k:'Má companhia',t:'Proposta indecente',x:`${d.f}, um conhecido, me chamou para ${d.c}.`,ch:[['Topar','t'],['Recusar','r'],['Denunciar à polícia','d']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='r') return 'Recusei.'; if(k==='d'){ m.karma=clamp(m.karma+6); return 'A polícia prendeu o grupo todo. Ninguém sabe que fui eu.'; } m.karma=clamp(m.karma-8); cnt('crimes'); m.rec.crimes++; if(R.chance(.55)){ const v=amt(500,20000); m.money+=v; return `Deu certo. Minha parte: ${fmt(v)}.`; } arrest('participar de um roubo',1,4); return 'Deu tudo errado. A polícia chegou.'; }},
 blitz:{w:1.5,when:m=>hasCar(m)&&m.age>=16&&free(m),prep:()=>({}),
  show:()=>({k:'Trânsito',t:'Blitz',x:'Fui parad'+oa()+' numa blitz.'+(S.me.lic?'':' Detalhe: não tenho carteira de motorista.'),ch:[['Cooperar','c'],['Tentar subornar','s'],['Acelerar e fugir','f']]}),
  pick:k=>{ const m=S.me; if(k==='c'){ if(!m.lic){ m.money-=3000; return 'Multa de $3.000 por dirigir sem carteira.'; } return 'Tudo certo. Fui liberad'+oa()+'.'; } if(k==='s'){ if(R.chance(.5)){ m.money-=500; return 'O policial aceitou. Que vergonha.'; } arrest('tentativa de suborno',0,2); return 'O policial não gostou nada da proposta.'; } if(R.chance(.35)) return 'Fugi! Meu coração quase saiu pela boca.'; arrest('fuga de blitz',0,2); return 'Fui cercad'+oa()+' três quarteirões depois.'; }},
 receita:{w:1,when:m=>netWorth()>250000&&m.age>=25&&free(m),prep:()=>({v:amt(5000,Math.max(10000,netWorth()*.05))}),
  show:d=>({k:'Impostos',t:'Malha fina',x:`A Receita encontrou problemas na minha declaração. A multa é de ${fmt(d.v)}.`,ch:[['Pagar a multa','p'],['Contratar um contador ($3.000)','c'],['Ignorar','i']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='p'){ m.money-=d.v; return 'Paguei.'; } if(k==='c'){ m.money-=3000; if(R.chance(.6)) return 'O contador resolveu tudo sem multa.'; m.money-=d.v/2; return 'O contador só conseguiu reduzir a multa pela metade.'; } if(R.chance(.5)){ arrest('sonegação de impostos',1,5); return 'Virou processo criminal.'; } m.money-=d.v*2; return 'A multa dobrou.'; }},
 vaquinha:{w:1.5,when:m=>m.age>=16&&free(m),prep:()=>({n:stranger({age:R.int(2,12)}).first,v:amt(20,500)}),
  show:d=>({k:'Solidariedade',t:'Vaquinha',x:`Uma vaquinha para a cirurgia de ${d.n}, de ${R.int(2,12)} anos, está circulando.`,ch:[[`Doar ${fmt(d.v)}`,'d'],['Compartilhar','c'],['Ignorar','i']]}),
  pick:(k,d)=>{ if(k==='d'){ S.me.money-=d.v; S.me.karma=clamp(S.me.karma+4); cnt('gifts'); return 'Doei. A meta foi batida dias depois.'; } if(k==='c'){ S.me.karma=clamp(S.me.karma+1); return 'Compartilhei.'; } return 'Passei reto.'; }},
 famoso:{w:1,when:m=>m.age>=10&&free(m),prep:()=>({x:R.pick(['um ator de novela','uma cantora sertaneja','um jogador da seleção','um youtuber gigante','uma apresentadora de TV','um rapper famoso'])}),
  show:d=>({k:'Encontro',t:'Olha quem é!',x:`Encontrei ${d.x} na fila da padaria.`,ch:[['Pedir uma selfie','s'],['Pedir autógrafo','a'],['Fingir que não reconheci','i']]}),
  pick:k=>{ const m=S.me; if(k==='s'){ if(m.social) m.social.f+=R.int(10,800); return R.chance(.7)?'Tiramos uma selfie ótima.':'Fui ignorad'+oa()+' com educação.'; } if(k==='a') return 'Ganhei um autógrafo num guardanapo.'; return 'Me senti superior.'; }},
 casamento_amigo:{w:1.5,when:m=>m.age>=20&&people('amigo').some(p=>p.age>=20)&&free(m),prep:()=>({p:R.pick(people('amigo').filter(p=>p.age>=20)).id}),
  show:d=>({k:'Festa',t:'Convite de casamento',x:`${P(d.p).first} vai se casar e me convidou.`,ch:[['Ir e dar um presente ($300)','i'],['Ir sem presente','s'],['Não ir','n']]}),
  pick:(k,d)=>{ const p=P(d.p); if(k==='i'){ S.me.money-=300; p.bond=clamp(p.bond+12); cnt('gifts'); st('happy',5); return R.chance(.3)?'Peguei o buquê!':'Festa linda.'; } if(k==='s'){ p.bond=clamp(p.bond+3); return 'Fui e comi muito bem.'; } p.bond=clamp(p.bond-15); return `${p.first} ficou chatead${p.gender==='F'?'a':'o'}.`; }},
 gravidez:{w:1.5,when:m=>m.gender==='F'&&m.age>=16&&m.age<=44&&partners(p=>sexoDe(p)!==sexoDe(m)).length&&free(m)&&!S.births.length,prep:()=>({p:pickPartner(p=>sexoDe(p)!==sexoDe(S.me)).id}),
  show:()=>({k:'Família',t:'Teste positivo',x:'Estou grávida!',ch:[['Ter o bebê','t'],['Entregar para adoção ao nascer','a']]}),
  pick:(k,d)=>{ if(k==='t'){ S.births.push({with:d.p}); st('happy',8); return 'O bebê nasce no ano que vem.'; } st('happy',-6); return 'O bebê vai para uma família que espera por ele.'; }},
 missao:{w:3,when:m=>m.job&&m.job.spc==='militar'&&free(m),prep:()=>({l:R.pick(['uma missão de paz no exterior','a fronteira norte','uma operação de resgate após um terremoto','uma missão em zona de conflito'])}),
  show:d=>({k:'Forças Armadas',t:'Convocação',x:`Minha unidade foi enviada para ${d.l}.`,ch:[['Ir para a linha de frente','f'],['Pedir função na retaguarda','r'],['Desertar','d']]}),
  pick:k=>{ const m=S.me,j=m.job; if(k==='d'){ endJob(); arrest('deserção',1,4); return 'Fugi do quartel.'; } if(k==='r'){ j.perf=clamp(j.perf-5); return 'Passei a missão organizando suprimentos.'; } if(R.chance(.04)){ die('em combate'); return 'Não voltei para casa.'; } if(R.chance(.2)){ st('health',-R.int(10,30)); return 'Fui ferid'+oa()+', mas sobrevivi.'; } j.perf=clamp(j.perf+15); m.karma=clamp(m.karma+3); if(R.chance(.3)&&j.lvl<8){ j.lvl++; return `Ganhei uma medalha e fui promovid${oa()} a ${jobTitle(j).toLowerCase()}!`; } return 'Voltei com uma medalha no peito.'; }},
 policia_quadrilha:{w:3,when:m=>m.job&&m.job.spc==='crime'&&free(m),prep:()=>({}),
  show:()=>({k:'Crime',t:'A polícia está de olho',x:'Um contato avisou: a polícia está investigando a quadrilha.',ch:[['Subornar um delegado','s'],['Sumir por um tempo','z'],['Seguir normal','n']]}),
  pick:k=>{ const m=S.me; if(k==='s'){ const v=amt(5000,80000); m.money-=v; if(R.chance(.7)) return `Paguei ${fmt(v)} e o inquérito sumiu.`; arrest('corrupção ativa e associação criminosa',3,10); return 'O delegado era honesto.'; } if(k==='z'){ m.job.perf=clamp(m.job.perf-10); return 'Fiquei escondid'+oa()+' num sítio por meses.'; } if(R.chance(.35)){ arrest('associação criminosa',4,15); return 'Fui pego numa operação.'; } return 'Passou.'; }},
 paparazzi:{w:2,when:m=>m.fame>=35&&free(m),prep:()=>({}),
  show:()=>({k:'Fama',t:'Paparazzi',x:'Um paparazzi me seguiu até o supermercado.',ch:[['Posar e sorrir','p'],['Quebrar a câmera dele','q'],['Fugir','f']]}),
  pick:k=>{ const m=S.me; if(k==='p'){ m.fame=clamp(m.fame+1); return 'Saí lindamente nas revistas.'; } if(k==='q'){ m.money-=amt(5000,30000); m.fame=clamp(m.fame+3); if(R.chance(.2)) arrest('agressão',0,1); return 'O vídeo da confusão viralizou.'; } return 'Fugi pelos fundos.'; }},
 escandalo:{w:1.5,when:m=>m.fame>=45&&free(m),prep:()=>({x:R.pick(['estou namorando escondido um político','sou rude com garçons','fiz plástica no rosto todo','estou falid'+oa(),'colei na escola'])}),
  show:d=>({k:'Fama',t:'Fofoca',x:`Um site de fofoca publicou que ${d.x}.`,ch:[['Desmentir publicamente','d'],['Assumir com bom humor','a'],['Processar o site','p']]}),
  pick:k=>{ const m=S.me; if(k==='a'){ m.fame=clamp(m.fame+2); return 'O público adorou minha sinceridade.'; } if(k==='p'){ m.money-=20000; if(R.chance(.5)){ m.money+=R.int(30,200)*1000; return 'Ganhei o processo e uma bela indenização.'; } return 'Perdi o processo.'; } return R.chance(.6)?'O assunto morreu.':'Ninguém acreditou em mim.'; }},
 rebeliao:{w:1,jail:1,cd:12,when:m=>m.prison&&!m.prison.juv,prep:()=>({}),
  show:()=>({k:'Prisão',t:'Rebelião!',x:'Os detentos tomaram o pavilhão.',ch:[['Participar','p'],['Ficar na cela','c'],['Ajudar os guardas','a']]}),
  pick:k=>{ const pr=S.me.prison; if(k==='p'){ if(R.chance(.1)){ S.me.prison=null; cnt('escapes'); return 'No meio da confusão, fugi!'; } pr.left+=R.int(1,4); pr.total+=2; pr.behav=clamp(pr.behav-25); st('health',-R.int(0,20)); return 'A rebelião foi contida e minha pena aumentou.'; } if(k==='a'){ pr.behav=clamp(pr.behav+20); if(R.chance(.3)) st('health',-15); return 'Os guardas anotaram minha ajuda.'; } return 'Fiquei quiet'+oa()+' na cela.'; }},
 gangue:{w:1.5,jail:1,cd:15,once:1,when:m=>m.prison&&!m.prison.juv,prep:()=>({g:R.pick(['Os do Pavilhão 9','A Irmandade','Os Corvos','Família do Sul'])}),
  show:d=>({k:'Prisão',t:'Recrutamento',x:`A gangue "${d.g}" quer que eu entre para eles.`,ch:[['Entrar','e'],['Recusar','r']]}),
  pick:(k,d)=>{ if(k==='e'){ S.me.karma=clamp(S.me.karma-5); S.me.prison.behav=clamp(S.me.prison.behav-10); return `Agora sou de "${d.g}". Ninguém mexe comigo.`; } if(R.chance(.4)){ st('health',-15); return 'Fui espancad'+oa()+' por recusar.'; } return 'Me deixaram em paz.'; }},
 golpe_idoso:{w:2,when:m=>m.age>=62&&free(m),prep:()=>({v:amt(500,5000)}),
  show:d=>({k:'Telefone',t:'"Oi, vó/vô, sou eu"',x:`Alguém dizendo ser meu neto pede ${fmt(d.v)} urgente por mensagem.`,ch:[['Mandar o dinheiro','m'],['Ligar para conferir','l']]}),
  pick:(k,d)=>{ if(k==='m'){ S.me.money-=d.v; return 'Era golpe.'; } return 'Liguei e meu neto estava jogando videogame. Golpe evitado.'; }},
 aposentar:{w:3,when:m=>m.job&&!m.job.spc&&m.age>=62&&free(m),prep:()=>({}),
  show:()=>({k:'Carreira',t:'Hora de parar?',x:'O RH perguntou se estou pensando em me aposentar.',ch:[['Me aposentar','a'],['Continuar trabalhando','c']]}),
  pick:k=>{ if(k==='a'){ retire(); return 'Me aposentei!'; } return 'Ainda tenho lenha para queimar.'; }},
 mordida:{w:1,when:m=>free(m),prep:()=>({}),
  show:()=>({k:'Rua',t:'Mordida!',x:'Um cachorro escapou de um portão e me mordeu.',ch:[['Processar o dono','p'],['Deixar pra lá','d']]}),
  pick:k=>{ st('health',-R.int(2,8)); if(k==='p'&&S.me.age>=18){ if(R.chance(.5)){ const v=amt(2000,20000); S.me.money+=v; return `Ganhei ${fmt(v)} de indenização.`; } S.me.money-=1500; return 'Perdi o processo e paguei as custas.'; } return 'Tomei vacina e segui a vida.'; }},
 bolao:{w:1,when:m=>m.job&&free(m),prep:()=>({}),
  show:()=>({k:'Trabalho',t:'Bolão da firma',x:'O pessoal do trabalho está fazendo um bolão da loteria acumulada. $50 por cota.',ch:[['Entrar','e'],['Ficar fora','f']]}),
  pick:k=>{ if(k==='f') return R.chance(.01)?'Eles ganharam. Eu não estava no bolão.':'Fiquei de fora.'; S.me.money-=50; if(R.chance(.003)){ const v=R.int(2,15)*1e6; S.me.money+=v; cnt('lotto'); st('happy',40); return `GANHAMOS! Minha parte: ${fmt(v)}!`; } return 'Não deu nada.'; }},
 mudanca:{w:1,when:m=>m.age>=20&&m.age<=60&&free(m),prep:()=>({c:R.pick(countryOf(S.me.country).cities.filter(x=>x!==S.me.city))}),
  show:d=>({k:'Mudança',t:'Mudar de cidade?',x:`Um amigo diz que a vida em ${d.c} é muito melhor.`,ch:[['Me mudar','m'],['Ficar onde estou','f']]}),
  pick:(k,d)=>{ if(k==='f') return 'Fiquei.'; S.me.city=d.c; S.me.money-=5000; st('happy',R.int(-4,10)); if(S.me.job&&R.chance(.6)){ endJob(); return `Me mudei para ${d.c} e larguei o emprego.`; } return `Me mudei para ${d.c}.`; }},
 bebe_noite:{w:2,when:m=>kids().some(k=>k.age<=1)&&free(m),prep:()=>({parentId:R.pick(kids().filter(k=>k.age<=1)).parentId}),
  show:()=>({k:'Filhos',t:'Choro às 3h',x:'O bebê não para de chorar de madrugada.',ch:[['Levantar e cuidar','c'],['Fingir que estou dormindo','d']]}),
  pick:(k,d)=>{ const p=P(d.parentId); if(k==='c'){ st('health',-2); if(p) p.bond=clamp(p.bond+5); return 'Ninei até o sol nascer.'; } if(p){ p.bond=clamp(p.bond-8); return `${p.first} percebeu e ficou furios${p.gender==='F'?'a':'o'}.`; } return 'O bebê dormiu sozinho, uma hora depois.'; }},
};

// eventos que o sistema força
Object.assign(EVENTS,{
 formatura:{show:()=>({k:'Formatura',t:'E agora?',x:'Terminei o ensino médio. Qual o próximo passo?',ch:[['Escolher uma faculdade','u'],['Fazer um curso técnico','t'],['Procurar emprego','j'],['Tirar um ano sabático','s']]}),
  pick:k=>{ if(k==='u') setTimeout(()=>UI.open(V.uniList),50); else if(k==='t') setTimeout(()=>UI.open(V.techList),50); else if(k==='j') setTimeout(()=>UI.open(V.jobs),50); else { st('happy',6); return 'Vou tirar um tempo para pensar na vida.'; } }},
 reeleicao:{show:()=>({k:'Política',t:'Fim do mandato',x:`Meu mandato acabou. Aprovação atual: ${S.me.office.appr}%.`,ch:[['Concorrer à reeleição','r'],['Deixar a política','s']]}),
  pick:k=>{ const m=S.me,o=m.office; if(k==='s'){ m.office=null; return 'Deixei a vida pública.'; } if(R.chance(o.appr/100*.9+m.fame/500)){ o.yrs=0; o.appr=clamp(o.appr+5); return 'Fui reeleit'+oa()+'!'; } m.office=null; return 'Perdi a eleição.'; }},
 divida:{show:()=>({k:'Dinheiro',t:'Nome sujo',x:`Estou devendo ${fmt(-S.me.money)}. Os cobradores não param de ligar.`,ch:[['Negociar a dívida','n'],['Pedir ajuda à família','f'],['Declarar falência','b']]}),
  pick:k=>{ const m=S.me; if(k==='n'){ m.money=Math.round(m.money*.7); return 'Consegui um desconto de 30%.'; } if(k==='f'){ const p=R.pick(parents().concat(people('irmao','filho'))); if(p&&p.money>-m.money&&R.chance(p.bond/120)){ p.money+=m.money; m.money=0; return `${p.first} pagou minhas dívidas.`; } return 'Ninguém pôde me ajudar.'; } m.money=0; m.assets=m.assets.filter(a=>a.k==='item'&&a.value<5000); st('happy',-15); return 'Declarei falência. Perdi meus bens, mas zerei a dívida.'; }},
 investigacao:{show:d=>({k:'Polícia',t:'Caso reaberto',x:`A polícia reabriu a investigação da morte de ${d.n} e me chamou para depor.`,ch:[['Negar tudo','n'],['Ficar em silêncio com um advogado ($20.000)','a'],['Fugir do país','f'],['Confessar','c']]}),
  pick:(k,d)=>{ const m=S.me;
    if(k==='c'){ m.c.unsolved=0; m.karma=clamp(m.karma+5); arrest('homicídio confessado',8,25); return 'Confessei tudo ao delegado.'; }
    if(k==='a'){ if(!canPay(20000)) k='n'; else { m.money-=20000; if(R.chance(.7)) return 'Meu advogado travou a investigação. Por enquanto.'; } }
    if(k==='f'){ const c=R.pick(COUNTRIES.filter(x=>x.id!==m.country)); if(R.chance(.45)){ m.country=c.id; m.city=R.pick(c.cities); m.c.countries=(m.c.countries||1)+1; if(m.job) endJob(); return `Fugi para ${m.city}, ${c.n}, com documentos falsos.`; } m.c.unsolved=0; arrest('homicídio e tentativa de fuga',18,40); S.pending[S.pending.length-1].d.evid=1; return 'Fui pego no aeroporto.'; }
    if(R.chance(.35+(m.smarts-50)/200)) return 'Meu depoimento convenceu. Me liberaram.';
    m.c.unsolved=0; arrest('homicídio',15,40); S.pending[S.pending.length-1].d.evid=1; return 'Contradições no meu depoimento me entregaram.'; }},
 recaptura:{show:()=>({k:'Polícia',t:'Encontrad'+oa()+'!',x:'A polícia descobriu onde estou escondid'+oa()+'. Há viaturas na porta.',ch:[['Me entregar','e'],['Fugir de novo','f'],['Tentar subornar ($30.000)','s']]}),
  pick:k=>{ const m=S.me; if(k==='s'&&canPay(30000)){ m.money-=30000; if(R.chance(.5)) return 'O policial aceitou e disse que nunca me viu.'; } if(k==='f'&&R.chance(.4+m.health/400)) return 'Pulei o muro dos fundos e escapei mais uma vez.'; m.c.fugitive=0; arrest('fuga e crimes anteriores',k==='e'?2:4,k==='e'?6:12); return k==='e'?'Me entreguei sem resistir.':'Fui cercad'+oa()+' e algemad'+oa()+'.'; }},
 familia_falida:{show:()=>({k:'Família',t:'Falência em casa',x:'O dinheiro da família acabou. Meus pais estão afundados em dívidas, e parte delas são gastos meus.',ch:[['Pedir desculpas','d'],['Arrumar um bico para ajudar','b'],['Fingir que não é comigo','i']]}),
  pick:k=>{ const m=S.me; S.flags.cls='pobre'; st('happy',-12); parents().forEach(p=>p.bond=clamp(p.bond-(k==='i'?20:8)));
    if(k==='b'&&m.age>=12){ const v=R.int(500,3000); parents()[0]&&(parents()[0].money+=v); m.karma=clamp(m.karma+4); parents().forEach(p=>p.bond=clamp(p.bond+12)); return `Arrumei um bico e dei ${fmt(v)} para ajudar em casa.`; }
    if(k==='d'){ parents().forEach(p=>p.bond=clamp(p.bond+6)); return 'Meus pais me abraçaram. Vamos sair dessa juntos.'; }
    return 'O clima em casa ficou pesadíssimo.'; }},
 julgamento:{show:d=>({k:'Justiça',t:`Pres${oa()}!`,x:`Fui pres${oa()} por ${d.c}. Preciso de um advogado.`,ch:[['Defensor público (grátis)','p'],['Advogado comum ($8.000)','c'],['Advogado de elite ($60.000)','e'],['Me declarar culpad'+oa(),'g']]}),
  pick:(k,d)=>trial(k,d)},
});

// um evento na fila só aparece se ainda fizer sentido (ex.: o carro não foi vendido, a pessoa ainda está viva)
function evValid(e){
  const ev=EVENTS[e.id]; if(!ev) return false;
  try{ if(ev.when&&!ev.when(S.me)) return false; }catch(err){ return false; }
  for(const k of ['p','s','b','k','pid']){ if(typeof e.d[k]==='number'){ const p=P(e.d[k]); if(!p||!p.alive) return false; } }
  return true;
}
function companyName(){ return R.pick(['Grupo','Rede','Companhia','Indústrias','Sistemas','Holding','Comercial','Lab'])+' '+R.pick(['Horizonte','Atlântico','Vértice','Ipê','Boreal','Cerrado','Nova Era','Tucano','Prisma','Pampa','Aurora','Jatobá','Quasar','Maré Alta','Pedra Azul']); }

function yearEvents(){
  const m=S.me;
  if(m.age===1) log(`Falei minha primeira palavra: "${R.pick(['mamã','papá','água','não','bola','au-au','tchau','neném'])}".`);
  if(m.age===2&&R.chance(.6)) log('Dei meus primeiros passos sozinh'+oa()+'.');
  if(m.age>=3&&!S.scen&&R.chance(m.prison?.4:.6)) log(fluffLine(m));
  m.ev=m.ev||{}; m.evN=m.evN||{};
  // eventos de prisão só acontecem na prisão; os outros, só em liberdade. Cada evento tem um intervalo mínimo para se repetir
  let elig=Object.entries(EVENTS).filter(([id,e])=>e.w&&(m.prison?e.jail:!e.jail)&&(S.scen&&!m.prison?e.scen===S.scen.id:!e.scen)&&!(e.onceLife&&m.c['ev_'+id])&&!(m.ev[id]!=null&&m.age-m.ev[id]<(e.cd||8))&&(()=>{ try{ return !e.when||e.when(m); }catch(err){ return false; } })());
  let n=m.age<3?0:m.prison?(R.chance(.55)?1:0):(R.chance(.85)?1:0)+(R.chance(.4)?1:0);
  while(n-->0&&elig.length){
    const id=R.wpick(elig.map(([id,e])=>[id,e.w/(1+.9*(m.evN[id]||0))]));
    elig=elig.filter(([x])=>x!==id);
    const ev=EVENTS[id]; let d; try{ d=ev.prep?ev.prep(m):{}; }catch(err){ d=null; } if(d===null||d===undefined) continue;
    queue(id,d); m.ev[id]=m.age; m.evN[id]=(m.evN[id]||0)+1; if(ev.onceLife) m.c['ev_'+id]=1;
  }
}
// frases do dia a dia montadas por combinação, para quase nunca repetir
function fluffLine(m){
  if(m.prison) return R.pick(['Contei os azulejos da cela de novo.','Escrevi uma carta que nunca enviei.','Joguei baralho com o colega de cela.','A comida da prisão piorou.','Fiz flexões até não sentir os braços.','Ouvi a chuva pela janelinha da cela a noite inteira.','Aprendi a jogar xadrez com um detento mais velho.','Assisti ao jogo na TV do pavilhão.','Troquei cigarros por um sabonete melhor.','Sonhei que estava na praia.']);
  const pools=m.age<13?FLUFF_KID:m.age<18?FLUFF_TEEN:m.age<65?FLUFF_ADULT:FLUFF_OLD;
  if(R.chance(.45)) return fill(R.pick(pools));
  const who=m.age<13?['com a família','com meus primos','com a turma da rua','sozinh'+oa()]:['com amigos','sozinh'+oa(),'com a família','com '+(friendName()||'um vizinho')];
  const kid=[`Passei o domingo ${R.pick(['no parque','na casa da avó','no clube','na pracinha','no sítio de um tio'])} ${R.pick(who)}.`,`Ganhei ${R.pick(['um gibi','um álbum de figurinhas','uma pipa','um kit de pintura','um carrinho','uma boneca','um quebra-cabeça'])} ${R.pick(['de aniversário','de um tio','na quermesse','de presente surpresa'])}.`,`Aprendi ${R.pick(['a contar até mil','o nome de todos os planetas','a fazer origami','a jogar dama','a dar estrela','a desenhar um cavalo'])}.`,`Fui ${R.pick(['ao circo','ao cinema pela primeira vez','a uma festa junina','a um aniversário com pula-pula','ao aquário'])} ${R.pick(who)}.`];
  const teen=[`Passei ${R.pick(['as férias','o fim de semana','o feriado'])} ${R.pick(['jogando online','vendo vídeos','na casa de '+(friendName()||'um amigo'),'na praia','sem sair do quarto'])}.`,`Entrei numa fase de ${R.pick(FILL.music)} e mudei ${R.pick(['o jeito de vestir','o cabelo','o papel de parede do celular'])}.`,`Fiquei obcecad${oa()} por ${R.pick(['astronomia','skate','xadrez','cubo mágico','culinária','história antiga','animes','maquiagem artística'])}.`];
  const adult=[`${R.pick(['Fui','Levei minha família','Fui sozinh'+oa()])} ${R.pick(['a um festival de','a uma feira de','a um museu de','a uma exposição de'])} ${R.pick(['comida japonesa','dinossauros','arte moderna','carros antigos','quadrinhos','vinhos','tecnologia','orquídeas','fotografia','cerveja artesanal'])}.`,`Comecei a ${R.pick(['aprender espanhol','fazer cerâmica','correr de manhã','tocar ukulele','fazer trilhas','cozinhar comida tailandesa','jogar beach tennis'])}, ${R.pick(['e estou gostando','mas larguei em um mês','e virou minha paixão','só para impressionar alguém'])}.`,`Troquei ${R.pick(['de celular','de óculos','de sofá','de operadora de internet','de academia','de cabeleireiro'])} ${R.pick(['e me arrependi','e amei','por pura impaciência','depois de muito pensar'])}.`,`Passei ${R.pick(['o Natal','o Ano-Novo','o Carnaval','a Páscoa'])} ${R.pick(['em casa','na casa de parentes','viajando','trabalhando'])}.`];
  const old=[`Ensinei ${R.pick(['os netos','os vizinhos','um rapaz da rua'])} a ${R.pick(['jogar truco','fazer pão caseiro','plantar hortaliças','consertar uma bicicleta'])}.`,`Fui ${R.pick(['ao bingo da paróquia','a um baile da saudade','a uma excursão para a praia','ao médico só para conversar'])}.`,`Reencontrei ${R.pick(['um colega de escola','uma antiga paixão','um ex-chefe','um vizinho de infância'])} depois de décadas.`];
  return R.pick(m.age<13?kid:m.age<18?teen:m.age<65?adult:old);
}
