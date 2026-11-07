// ===== 2.19: combinações entre sistemas =====
// Criatura × faculdade × eleição, luto × estudo/trabalho/mandato, viuvez × novo amor, órfão menor de idade,
// corpo que não envelhece, prisão que tira o mandato com aviso. Tudo usa cx() de conexoes.js, então o
// teste "sistemas conversando" já valida cada ligação nova (condição, telas, escolhas e mudança de situação).

// ---------- corpo da criatura ----------
// vampiro para de envelhecer no dia da mordida; lobisomem envelhece mais devagar (metade do ritmo)
function idadeCorpo(p){ if(!p||!p.criatura||p.criaturaIdade==null) return p?p.age:0; const v=p.age-p.criaturaIdade; return p.criatura==='vampiro'?p.criaturaIdade:Math.round(p.criaturaIdade+v*.5); }
virar=(o=>function(){ const r=o.apply(this,arguments); const m=S.me; if(m.criatura&&m.criaturaIdade==null) m.criaturaIdade=m.age; return r; })(virar);
{ const dr=deathRoll; deathRoll=function(){ const m=S.me; if(!m.criatura||S.scen) return dr.apply(this,arguments); if(m.criaturaIdade==null) m.criaturaIdade=m.age; const a=m.age; m.age=idadeCorpo(m); try{ return dr.apply(this,arguments); }finally{ m.age=a; } }; }
{ const sa=saudeAlvoDe; saudeAlvoDe=function(m){ if(!m||!m.criatura||m.criaturaIdade==null) return sa.apply(this,arguments); const a=m.age; m.age=idadeCorpo(m); try{ return sa.apply(this,arguments); }finally{ m.age=a; } }; }
{ const fs=faceSVG; faceSVG=function(p,size,over){ if(p&&p.criatura&&p.criaturaIdade!=null&&p.rel!=='pet') return fs.call(this,Object.assign({},p,{age:idadeCorpo(p)}),size,over); return fs.apply(this,arguments); }; }
// NPC que virou criatura também guarda a idade da transformação
NL_GANCHOS_ANO.push(()=>{ for(const p of S.people) if(p.alive&&p.criatura&&p.criaturaIdade==null) p.criaturaIdade=p.age;
 });
// NPC criatura: o sorteio de morte do ano usa a idade do corpo, e a idade real volta logo depois
yearPeople=(o=>function(){ const cs=S.people.filter(p=>p.alive&&p.criatura&&p.criaturaIdade!=null&&p.rel!=='pet'); for(const p of cs){ p._idReal=p.age; p.age=idadeCorpo(p); }
  try{ return o.apply(this,arguments); }finally{ for(const p of cs){ if(p._idReal!=null){ p.age=p._idReal+1; delete p._idReal; } } } })(yearPeople);

// ---------- prisão tira o mandato com aviso ----------
trial=(o=>function(k,d){ const m=S.me, of=m.office; const r=o.apply(this,arguments); if(of&&!m.office&&m.prison){ const def=OFFICES.find(x=>x.id===of.id); log(`Perdi o cargo de ${def?g(def.n,m.gender).toLowerCase():'político'} por causa da condenação.`,'bad'); if(m.pol) m.pol.esc=clamp((m.pol.esc||0)+40); } return r; })(trial);

// ---------- órfão menor de idade ----------
const tutorDe=m=>{ const t=m.tutorId!=null&&P(m.tutorId); return t&&t.alive?t:null; };
coverMinor=(o=>function(){ const m=S.me; if(!m||!m.alive||m.age>=18||m.money>=0||parents().length) return o.apply(this,arguments);
  const t=tutorDe(m); if(t&&(t.money||0)>0){ const take=Math.min(-m.money,t.money); t.money-=take; m.money+=take; } if(m.money<0) m.money=0; })(coverMinor);
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m.alive||m.age>=18||parents().length||m.tutorId!=null||m.c.orfaoVisto) return; m.c.orfaoVisto=1;
  const op=S.people.filter(p=>p.alive&&(p.rel==='avo'||p.rel==='padrasto'||(p.rel==='irmao'&&p.age>=21)||(p.rel==='amigo'&&p.age>=30))).sort((a,b)=>(b.rel==='avo')-(a.rel==='avo')||b.bond-a.bond).slice(0,2);
  queue('orfao',{ops:op.map(p=>p.id)}); });
EVENTS.orfao={once:true,show:d=>{ const ops=(d.ops||[]).map(P).filter(p=>p&&p.alive); return {k:'Família',t:'🏠 Quem vai cuidar de mim',x:'Sem meus pais, o juiz precisa decidir com quem vou morar até fazer 18 anos.',ch:ops.map(p=>[`Morar com ${relLabel(p).toLowerCase()} ${p.first}`,'p'+p.id]).concat([['Ir para um abrigo','abrigo'],['Pedir para ficar com a família de um vizinho','viz']])}; },
  pick:k=>{ const m=S.me; if(k==='viz'){ m.tutorId=-1; st('happy',-4); return 'Os vizinhos do lado viraram família de verdade. O juiz aprovou a guarda provisória.'; } if(k==='abrigo'){ m.tutorId=-1; st('happy',-12); return 'O abrigo tem regra para tudo, mas tem cama, comida e outras crianças na mesma situação.'; }
    const p=P(+k.slice(1)); if(!p||!p.alive){ m.tutorId=-1; return 'No fim, fui para um abrigo.'; } m.tutorId=p.id; p.bond=clamp(p.bond+15); st('happy',4); return `${p.first} me recebeu com um quarto arrumado e um abraço longo.`; }};

// ---------- trancar de verdade (mesmo formato de cadeias.js) e voltar sozinho depois ----------
function eduTrancar(m,anos,semCargo){ const c=m.edu.cur; if(!c||['fund','medio'].includes(c.type)) return false; m.edu.trancado=c; m.edu.cur=null; m.edu.club=null; m.edu.voltaAno=S.year+anos; m.edu.voltaSemCargo=semCargo?1:0; return true; }
NL_GANCHOS_ANO.push(()=>{ const m=S.me, e=m.edu; if(!e.trancado||e.cur||e.voltaAno==null||m.prison||S.year<e.voltaAno||(e.voltaSemCargo&&m.office)) return; e.cur=e.trancado; delete e.trancado; delete e.voltaAno; delete e.voltaSemCargo; log(`Destranquei a matrícula ${eduOf(e.cur)} e voltei às aulas.`,'good'); });

// ---------- luto ----------
const LUTO_REL=['conjuge','noivo','namoro','filho','adot','mae','pai','padrasto','irmao'];
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m.alive) return; const novos=S.people.filter(p=>!p.alive&&p.lutoVisto==null&&p.rel!=='pet');
  if(!m.c.lutoInit){ m.c.lutoInit=1; novos.forEach(p=>p.lutoVisto=0); return; }
  for(const p of novos) p.lutoVisto=S.year;
  const perda=novos.filter(p=>LUTO_REL.includes(p.rel)).sort((a,b)=>LUTO_REL.indexOf(a.rel)-LUTO_REL.indexOf(b.rel))[0]; if(!perda||m.prison) return;
  m.c.lutoAno=S.year; m.c.lutoPid=perda.id;
  // o luto pesa no estudo e no trabalho
  if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade-R.int(4,10)); if(m.job&&m.job.perf!=null) m.job.perf=clamp(m.job.perf-R.int(3,8)); if(m.office) m.office.appr=clamp(m.office.appr+R.int(1,4));
  const fila=[]; if(m.edu.cur&&m.age>=15) fila.push('cx_luto_estudo'); if(m.job&&!m.job.hero) fila.push('cx_luto_trabalho'); if(m.office) fila.push('cx_luto_mandato');
  if(fila.length){ const id=R.pick(fila); const d=EVENTS[id].prep(); if(d) queue(id,d); } });
const lutoP=m=>m.c.lutoAno!=null&&S.year-m.c.lutoAno<=1&&P(m.c.lutoPid);
const lutoNome=(m,p)=>p?`${relLabel(p).toLowerCase()} ${p.first}`:'quem eu perdi';
const lutoSetup=(rel)=>m=>{ const p=mkPerson({rel,age:m.age+25,gender:'F'}); p.alive=false; S.people.push(p); m.c.lutoAno=S.year; m.c.lutoPid=p.id; };
cx({id:'luto_estudo',k:'Luto',t:'🕯️ Estudar de luto',p:0,cd:1,when:m=>!!lutoP(m)&&!!m.edu.cur&&m.age>=15,
  x:m=>`Desde que ${lutoNome(m,lutoP(m))} morreu, não consigo ler uma página inteira. ${m.edu.cur.type==='uni'?'As provas da faculdade':'As provas'} começam semana que vem.`,
  setup:m=>{ m.age=20; m.edu.cur={type:'uni',id:'dir',n:'Direito',len:5,yr:1,grade:60,cost:0,pub:true}; lutoSetup('mae')(m); },
  ch:[['Trancar o semestre','trancar',m=>{ if(!eduTrancar(m,1)) return 'Não dava para trancar este curso. Segui do jeito que deu.'; st('happy',4); return 'Tranquei por um ano. A coordenação foi gentil: "volta quando der".'; }],
    ['Pedir prova em segunda chamada','chamada',m=>{ if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade+4); return 'O professor aceitou o atestado de óbito e marcou a prova para o mês seguinte.'; }],
    ['Estudar para não pensar','estudar',m=>{ st('smarts',2); st('happy',-4); if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade+R.int(-2,6)); return 'Passei as noites na biblioteca. Funcionou nas provas, não no resto.'; }]]});
cx({id:'luto_trabalho',k:'Luto',t:'🕯️ Voltar ao trabalho',p:0,cd:1,when:m=>!!lutoP(m)&&!!m.job&&!m.job.hero,
  x:m=>`A licença por ${lutoNome(m,lutoP(m))} acabou. O chefe pergunta se eu já consigo voltar.`,
  setup:m=>{ m.age=40; m.job={id:JOBS.find(j=>!j.pt&&!j.spc).id,lvl:2,perf:60,yrs:3,co:'Empresa Teste'}; lutoSetup('conjuge')(m); },
  ch:[['Pedir mais uns dias','dias',m=>{ if(m.job) m.job.perf=clamp(m.job.perf-3); st('happy',5); return 'Ganhei mais uma semana. Usei para arrumar as coisas de casa.'; }],
    ['Voltar e me afundar no serviço','voltar',m=>{ if(m.job) m.job.perf=clamp(m.job.perf+6); st('happy',-3); return 'Os colegas deixaram um cartão na minha mesa. Trabalhei até tarde todos os dias.'; }],
    ['Procurar terapia pela empresa','terapia',m=>{ st('happy',6); return 'O plano cobria. Uma hora por semana para falar sem ninguém me interromper.'; }]]});
cx({id:'luto_mandato',k:'Luto',t:'🕯️ Luto no cargo',p:0,cd:1,when:m=>!!lutoP(m)&&!!m.office,
  x:m=>`A imprensa noticiou a morte de ${lutoNome(m,lutoP(m))}. A agenda oficial da semana está cheia.`,
  setup:m=>{ m.age=50; m.office={id:'pref',yrs:1,appr:55}; lutoSetup('pai')(m); },
  ch:[['Decretar luto e cancelar a agenda','cancelar',m=>{ cxApr(m,3); st('happy',3); return 'A cidade mandou flores. Até a oposição foi ao velório.'; }],
    ['Manter a agenda','manter',m=>{ cxApr(m,-2); st('happy',-5); return 'Inaugurei uma creche no dia seguinte ao enterro. Alguns acharam força, outros frieza.'; }]]});

// ---------- viuvez e novo amor ----------
const viuvoDe=m=>S.people.find(p=>!p.alive&&p.rel==='conjuge');
cx({id:'viuvo_novo_amor',k:'Amor',t:'🖼️ O retrato na estante',p:.35,cd:8,when:m=>!!viuvoDe(m)&&partners().length>0&&m.age>=20,
  prep:m=>{ const p=partners()[0]; return p?{pid:p.id,mid:viuvoDe(m).id}:null; },
  x:(m,d)=>{ const p=P(d.pid), v=P(d.mid); return `${p?p.first:'Meu par'} parou diante da foto de ${v?v.first:'quem partiu'} na estante e perguntou se eu ainda penso nel${v&&v.gender==='F'?'a':'e'}.`; },
  setup:m=>{ m.age=55; const v=mkPerson({rel:'conjuge',age:55,gender:'F'}); v.alive=false; S.people.push(v); S.people.push(mkPerson({rel:'namoro',age:52,gender:'F',bond:60})); },
  ch:[['Dizer a verdade: sempre vou pensar','verdade',(m,d)=>{ const p=P(d.pid); if(p&&p.alive) p.bond=clamp(p.bond+(R.chance(.7)?8:-6)); return 'Falei que o amor que eu tive não diminui o que eu sinto agora. Ganhei um abraço demorado.'; }],
    ['Guardar a foto numa gaveta','guardar',(m,d)=>{ const p=P(d.pid); if(p&&p.alive) p.bond=clamp(p.bond+3); st('happy',-4); return 'Guardei com cuidado. Às vezes ainda abro a gaveta.'; }],
    ['Levar para conhecer o túmulo','tumulo',(m,d)=>{ const p=P(d.pid); if(p&&p.alive) p.bond=clamp(p.bond+6); st('happy',3); return 'Apresentei os dois, do meu jeito. Saímos de mãos dadas.'; }]]});
cx({id:'viuvo_filhos',k:'Família',t:'👪 Os filhos e o novo amor',p:.4,cd:10,when:m=>!!viuvoDe(m)&&partners().length>0&&kids().some(k=>k.alive&&k.age>=10),
  prep:m=>{ const p=partners()[0], k=kids().find(k=>k.alive&&k.age>=10); return p&&k?{pid:p.id,kid:k.id}:null; },
  x:(m,d)=>{ const p=P(d.pid), k=P(d.kid); return `${k?k.first:'Meu filho'} não aceita bem ${p?p.first:'meu par'}: "Você esqueceu ${(viuvoDe(m)||{}).gender==='M'?'o papai':'a mamãe'}?"`; },
  setup:m=>{ m.age=50; const v=mkPerson({rel:'conjuge',age:50,gender:'M'}); v.alive=false; S.people.push(v); S.people.push(mkPerson({rel:'namoro',age:50,bond:60})); S.people.push(mkPerson({rel:'filho',age:16,bond:70})); },
  ch:[['Conversar com calma','conversar',(m,d)=>{ const k=P(d.kid); if(k&&k.alive) k.bond=clamp(k.bond+(R.chance(.65)?6:-4)); return 'Choramos juntos. Não resolveu tudo, mas abriu uma porta.'; }],
    ['Dar tempo ao tempo','tempo',(m,d)=>{ const k=P(d.kid); if(k&&k.alive) k.bond=clamp(k.bond-2); return 'Combinei de não forçar. Um jantar por mês, sem pressão.'; }],
    ['Terminar o namoro pelos filhos','terminar',(m,d)=>{ const p=P(d.pid), k=P(d.kid); if(p&&partners().includes(p)) amorSai(p,'disse que entendia, mas não dava para ficar'); if(k&&k.alive) k.bond=clamp(k.bond+8); return 'Escolhi a família que já tinha.'; }]]});

// ---------- criatura × faculdade ----------
const eFacul=m=>!!(m.edu.cur&&['uni','tec','post'].includes(m.edu.cur.type));
cx({id:'cri_faculdade',k:'Criatura',t:'🎓 Criatura na faculdade',p:.4,cd:3,when:m=>eCri(m)&&eFacul(m)&&m.age>=16,
  x:m=>m.criatura==='vampiro'?`As aulas de ${m.edu.cur.n} são todas de manhã, num prédio de vidro. A janela da sala dá para o sol nascente.`:`A prova final de ${m.edu.cur.n} caiu justo na noite de lua cheia.`,
  setup:m=>{ m.criatura='lobisomem'; m.criaturaIdade=18; m.age=20; m.edu.cur={type:'uni',id:'med',n:'Medicina',len:6,yr:2,grade:60,cost:0,pub:true}; },
  ch:[[m=>m.criatura==='vampiro'?'Pedir transferência para o noturno':'Pedir para fazer a prova outro dia','mudar',m=>{ if(R.chance(.6)){ return m.criatura==='vampiro'?'Consegui a transferência. A turma da noite trabalha de dia e não faz perguntas.':'O professor aceitou a desculpa da "consulta médica". Fiz a prova na semana seguinte.'; } if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade-6); return 'A coordenação negou. Fiquei com falta.'; }],
    ['Ir assim mesmo e me controlar','ir',m=>{ if(R.chance(m.will/140)){ if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade+4); return 'Segurei até o fim. Ninguém notou, só o suor na testa.'; } cxExp(15); st('happy',-6); return m.criatura==='vampiro'?'A pele começou a fumegar na segunda aula. Saí correndo e virei meme do campus.':'No meio da prova, meus dedos viraram garras e furaram o papel.'; }],
    [m=>m.criatura==='vampiro'?'Hipnotizar o professor':'Estudar o dobro antes e faltar','esp',m=>{ if(m.criatura==='vampiro'){ cxExp(4); if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade+6); return 'O professor me deu nota máxima e não lembra por quê.'; } st('smarts',2); if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade-2); return 'Perdi a prova, mas os trabalhos seguraram a média.'; }]]});
cx({id:'cri_republica',k:'Criatura',t:'🏚️ A república desconfia',p:.3,cd:5,when:m=>eCri(m)&&eFacul(m)&&m.age>=17&&m.age<30,
  x:m=>m.criatura==='vampiro'?'Meus colegas de república notaram que eu nunca como, nunca apareço no café da manhã e tenho uma geladeira trancada.':'Os colegas de república acham estranho que eu suma toda lua cheia e volte com a roupa rasgada.',
  setup:m=>{ m.criatura='vampiro'; m.criaturaIdade=19; m.age=21; m.edu.cur={type:'uni',id:'dir',n:'Direito',len:5,yr:1,grade:55,cost:0,pub:true}; },
  ch:[['Inventar uma história convincente','inventar',m=>{ if(R.chance(.55)) return m.criatura==='vampiro'?'Disse que faço dieta restrita por doença. Agora me respeitam como "a pessoa da dieta".':'Disse que trabalho de madrugada num hospital. Acharam o máximo.'; cxExp(8); return 'Ninguém acreditou. Agora trancam a porta do quarto à noite.'; }],
    ['Contar para o mais próximo','contar',m=>{ const p=people('amigo','colega').find(x=>x.alive&&x.age>=16); if(p){ p.sabeCri=1; p.bond=clamp(p.bond+8); } return 'Contei para quem divide o quarto comigo. Agora alguém tranca a janela por mim na lua cheia.'; }],
    ['Me mudar para um quarto sozinho','mudar',m=>{ const c=Math.min(m.money,R.int(3000,9000)); m.money-=c; return `Gastei ${fmt(c)} num quitinete. Mais caro, mas em paz.`; }]]});

// ---------- criatura × eleição ----------
cx({id:'cri_debate',k:'Criatura',t:'📺 O debate da reeleição',p:.4,cd:4,when:m=>eCri(m)&&!!m.office&&(m.office.yrs||0)>=2,
  x:m=>m.criatura==='vampiro'?'A emissora marcou o debate da reeleição ao meio-dia, num estúdio com claraboia.':'O debate da reeleição foi marcado para a noite de lua cheia, ao vivo, sem intervalo.',
  setup:m=>{ m.criatura='lobisomem'; m.criaturaIdade=25; m.age=45; m.office={id:'pref',yrs:3,appr:55}; },
  ch:[['Pedir para mudar a data','data',m=>{ if(R.chance(.5)){ return 'A emissora aceitou. O rival me acusou de fugir do debate.'; } cxApr(m,-4); return 'Negaram. Mandei um vice no meu lugar e a pesquisa caiu.'; }],
    ['Ir e me controlar','ir',m=>{ if(R.chance(m.will/130)){ cxApr(m,5); return 'Fui firme, olhos fixos na câmera. Disseram que eu parecia "ter fome de vencer".'; } cxApr(m,-10); cxExp(25); return m.criatura==='vampiro'?'Um raio de sol bateu no meu rosto ao vivo. A fumaça virou o assunto do país.':'Rosnei para o rival no terceiro bloco. O vídeo passou de dez milhões de visualizações.'; }],
    ['Usar o que eu sou a meu favor','usar',m=>{ cxExp(10); if(m.criatura==='vampiro'){ cxApr(m,3); return 'Hipnotizei o mediador. As perguntas mais duras sumiram da pauta.'; } cxApr(m,R.chance(.5)?6:-6); return 'Falei de "instinto de proteger a cidade". Metade adorou, metade ficou com medo.'; }]]});
cx({id:'cri_campanha',k:'Criatura',t:'🗳️ Um eleitor diferente',p:.25,cd:6,when:m=>eCri(m)&&!m.office&&m.age>=18&&!!(cri()&&cri().bando),
  x:m=>`${m.criatura==='vampiro'?'O clã':'A alcateia'} quer alguém no poder para proteger os nossos. Acham que eu deveria me candidatar a vereador${m.gender==='F'?'a':''}.`,
  setup:m=>{ m.criatura='vampiro'; m.criaturaIdade=20; m.age=30; cri().bando={n:'Clã Teste',rank:2,rep:40}; },
  ch:[['Aceitar o apoio para uma campanha','aceitar',m=>{ m.c.apoioCri=1; m.fame=clamp(m.fame+4); return 'Prometeram votos, dinheiro e silêncio. Se eu me candidatar, vou ter uma base fiel.'; }],
    ['Recusar: política chama atenção demais','recusar',()=> 'Disse que criatura que aparece na TV não dura muito.']]});
// apoio do bando e do DCE contam na eleição
polChance=(o=>function(d){ const m=S.me; return Math.min(.92,o.apply(this,arguments)+(m.c.apoioCri?.04:0)+(m.c.dce&&d&&d.o==='ver'?.04:0)); })(polChance);

// ---------- faculdade × política ----------
cx({id:'facul_dce',k:'Faculdade',t:'📢 Eleição do diretório acadêmico',p:.3,cd:4,when:m=>!!(m.edu.cur&&m.edu.cur.type==='uni')&&m.age>=17&&!m.office&&!m.c.dce,
  x:m=>`A chapa do diretório acadêmico de ${m.edu.cur.n} quer meu nome como candidat${oa()} a presidente.`,
  setup:m=>{ m.age=20; m.edu.cur={type:'uni',id:'dir',n:'Direito',len:5,yr:2,grade:60,cost:0,pub:true}; },
  ch:[['Topar e fazer campanha','topar',m=>{ if(R.chance(.35+m.smarts/300)){ m.c.dce=1; m.fame=clamp(m.fame+3); if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade-3); return 'Ganhei! Primeira vitória política: microfone, panfleto e assembleia até meia-noite.'; } st('happy',-4); return 'Perdi por pouco votos. Mas aprendi a fazer campanha.'; }],
    [m=>'Ajudar a chapa sem ser candidat'+oa(),'ajudar',m=>{ st('happy',3); return 'Colei cartaz na madrugada. A chapa venceu e me deve uma.'; }],
    ['Focar nas aulas','aulas',m=>{ if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade+3); return 'Política estudantil não é para mim. Por enquanto.'; }]]});
cx({id:'pol_estudando',k:'Política',t:'🎓 Mandato e faculdade',p:.35,cd:4,when:m=>!!m.office&&eFacul(m),
  x:m=>`A oposição descobriu que eu falto às sessões para ir às aulas de ${m.edu.cur.n}.`,
  setup:m=>{ m.age=35; m.office={id:'ver',yrs:1,appr:55}; m.edu.cur={type:'post',id:'mba',n:'MBA',len:2,yr:0,grade:55,cost:0}; },
  ch:[['Estudar à noite e não faltar mais','noite',m=>{ st('happy',-3); if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade-3); cxApr(m,2); return 'Durmo cinco horas por noite, mas não perdi mais nenhuma sessão.'; }],
    ['Defender que estudar faz bem ao cargo','defender',m=>{ cxApr(m,R.chance(.5)?3:-5); return 'Fiz um vídeo sobre educação. Uns aplaudiram, outros me chamaram de folgad'+oa()+'.'; }],
    ['Trancar o curso até o fim do mandato','trancar',m=>{ if(!eduTrancar(m,1,true)) return 'Não deu para trancar.'; cxApr(m,4); return 'Tranquei até o fim do mandato. O diploma pode esperar.'; }]]});

function combinacoesSelfTest(){ const s0=S,ns=window.NO_SAVE; window.NO_SAVE=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); };
  try{ newLife({country:'BR'}); const m=S.me; m.age=30; m.criatura='vampiro'; m.criaturaIdade=30; m.age=130; m.health=90;
    ok(idadeCorpo(m)===30,'vampiro envelheceu'); ok(saudeAlvoDe(m)>=80,'vampiro com saúde de velho');
    m.criatura='lobisomem'; ok(idadeCorpo(m)===80,'lobisomem fora do ritmo');
    newLife({country:'BR'}); const m2=S.me; m2.age=10; for(const p of S.people.filter(p=>['mae','pai'].includes(p.rel))) p.alive=false; S.pending=[]; for(const f of NL_GANCHOS_ANO){ try{ f(); }catch(e){} }
    ok(S.pending.some(e=>e.id==='orfao'),'órfão sem decisão'); m2.money=-500; coverMinor(); ok(m2.money>=0,'órfão com dívida');
    newLife({country:'BR'}); const m3=S.me; m3.age=40; m3.job={id:JOBS.find(j=>!j.pt&&!j.spc).id,lvl:1,perf:60,yrs:2,co:'X'}; for(const f of NL_GANCHOS_ANO){ try{ f(); }catch(e){} } S.pending=[];
    const c=mkPerson({rel:'conjuge',age:40}); c.alive=false; S.people.push(c); for(const f of NL_GANCHOS_ANO){ try{ f(); }catch(e){} } ok(S.pending.some(e=>e.id==='cx_luto_trabalho'),'luto não chegou ao trabalho');
    ok(V.relations().items.some(it=>it.sec==='Saudades'),'cônjuge falecido fora das saudades');
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; }
  if(erros.length) throw Error('Combinações · '+erros.join(' | ')); return {ok:true}; }

// ---------- na prisão, só acontece o que é da prisão ----------
// eventos que já estavam na fila (churrasco, casamento da família, jardim, escola, trabalho…) somem enquanto estou pres{o}
const PRISAO_OK=new Set(['julgamento','recaptura','justica_resposta','guarda','investigacao','zumbi_mordida']);
const prisaoEventoOk=id=>{ const ev=EVENTS[id]; if(!ev) return false; if(ev.jail||PRISAO_OK.has(id)) return true; if(String(id).startsWith('cad_')){ const ch=typeof CHAINS!=='undefined'&&CHAINS[String(id).replace(/^cad_/,'').replace(/_[a-z]$/,'')]; return !!(ch&&ch.o&&ch.o.jail); } return /pris|cela|cadeia|presid|penit|fuga/i.test(id); };
evValid=(o=>function(e){ const ok=o.apply(this,arguments); if(!ok||!e) return ok; const m=S.me; if(!m||!m.prison||S.scen) return ok; return prisaoEventoOk(e.id); })(evValid);
function prisaoEventosSelfTest(){ const s0=S,ns=window.NO_SAVE; window.NO_SAVE=true; const erros=[];
  try{ newLife({country:'BR'}); S.me.age=30; S.me.prison={left:3,total:3,served:0,behav:50,crime:'teste'};
    for(const id of ['churrasco','ferias','conquista_familia','esc_feira','vida_cotidiana','carro_quebrou']) if(EVENTS[id]&&evValid({id,d:{}})) erros.push(id+' dentro da prisão');
    const fora=Object.entries(EVENTS).filter(([id,e])=>!e.jail&&!e.scen&&e.w).map(([id])=>id).filter(id=>prisaoEventoOk(id)); if(fora.length>40) erros.push('filtro deixa passar demais: '+fora.slice(0,8).join(','));
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; }
  if(erros.length) throw Error('Prisão · '+erros.join(' | ')); return {ok:true}; }

// ---------- dentro de uma aventura (zumbi, ilha, isekai, herói, Marte), nada da vida comum que ficou na fila ----------
const VIDA_COMUM=/^(churrasco|ferias|conquista_familia|esc_|car_|vida_cotidiana|carro_quebrou|contas_mes|familia_|rel_|aposentadoria_|brincar|festa_danca|formatura|hobby_torneio|npc_|pedir_pais|reencontro_velho|historia_neto|crise40|amantes|carteira|divida|cad_|cx_|biz_evento|gravidez_teen|beb_saida|copa_|olimp_|fut_|lut_|pol_|reeleicao|seita_|par_descobre|caso_descoberto|poly_)/;
evValid=(o=>function(e){ const ok=o.apply(this,arguments); if(!ok||!e||!S.scen) return ok; const ev=EVENTS[e.id]; if(ev&&ev.scen) return ev.scen===S.scen.id; return !(VIDA_COMUM.test(e.id)||(ev&&ev.raw&&!ev.scen)); })(evValid);
function aventuraEventosSelfTest(){ const s0=S,ns=window.NO_SAVE; window.NO_SAVE=true; const erros=[];
  try{ for(const id of Object.keys(SCEN)){ newLife({country:'BR'}); S.me.age=25; scStart(id); if(S.scen&&S.scen.id==='isekai'&&!S.scen.cls) S.scen.cls=Object.keys(CLASSES)[0]; UI.close();
      for(const v of ['churrasco','ferias','vida_cotidiana','carro_quebrou']) if(EVENTS[v]&&evValid({id:v,d:{}})) erros.push(v+' dentro de '+id);
      const prop=Object.entries(EVENTS).filter(([,e])=>e.scen===id); if(prop.length&&!prop.some(([k])=>{ try{ return evValid({id:k,d:{}}); }catch(e){ return false; } })) erros.push('nenhum evento de '+id+' passou'); }
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; }
  if(erros.length) throw Error('Aventuras · '+erros.join(' | ')); return {ok:true}; }
