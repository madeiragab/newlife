// ===== Conquistas: desbloqueadas na hora, guardadas para sempre (entre todas as vidas) =====
// s: secreta (aparece como ??? até desbloquear)
const C_=m=>m.c||{}, nPeople=(...r)=>people(...r).length;
const CONQ=[
  // começo e vida
  {id:'nasceu',ic:'👶',n:'Bem-vindo ao mundo',d:'Começar uma vida.',ok:m=>true},
  {id:'dez',ic:'🔟',n:'Dois dígitos',d:'Fazer 10 anos.',ok:m=>m.age>=10},
  {id:'maior',ic:'🎂',n:'De maior',d:'Fazer 18 anos.',ok:m=>m.age>=18},
  {id:'cinquenta',ic:'🧓',n:'Enta',d:'Fazer 50 anos.',ok:m=>m.age>=50},
  {id:'cem',ic:'💯',n:'Fóssil vivo',d:'Fazer 100 anos.',ok:m=>m.age>=100},
  {id:'speedrun',ic:'⏱️',n:'Speedrun da vida',d:'Morrer antes dos 18.',s:1,ok:(m,f)=>f.dead&&m.age<18},
  {id:'ragequit',ic:'🎮',n:'Rage quit',d:'Desistir de uma vida.',s:1,ok:m=>!!C_(m).gaveUp},
  {id:'vidas10',ic:'♻️',n:'Reencarnação profissional',d:'Viver 10 vidas.',ok:()=>(META.lives||0)>=10},
  // dinheiro
  {id:'mil',ic:'💵',n:'Primeiro milhão',d:'Ter $1 milhão na conta.',ok:m=>m.money>=1e6},
  {id:'bi',ic:'🤑',n:'Tio Patinhas',d:'Ter $1 bilhão na conta.',ok:m=>m.money>=1e9},
  {id:'vermelho',ic:'📉',n:'Nome no SPC',d:'Ficar devendo mais de $100.000.',s:1,ok:m=>m.money<=-100000},
  {id:'loteria',ic:'🎟️',n:'Bilhete premiado',d:'Ganhar na loteria.',ok:m=>(C_(m).lotto||0)>0},
  {id:'apostador',ic:'🎰',n:'A casa sempre ganha',d:'Apostar 50 vezes.',ok:m=>(C_(m).bets||0)>=50},
  {id:'empresa',ic:'🦄',n:'Unicórnio',d:'Ter uma empresa de $100 milhões.',ok:m=>(C_(m).bizMax||0)>=1e8||(m.biz&&m.biz.value>=1e8)},
  // amor e família
  {id:'namoro',ic:'💘',n:'Contatinho',d:'Começar um namoro.',ok:m=>(C_(m).partners||0)>=1},
  {id:'casou',ic:'💍',n:'Sim, aceito',d:'Casar.',ok:m=>(C_(m).marriages||0)>=1},
  {id:'casou3',ic:'🔁',n:'Colecionador de alianças',d:'Casar três vezes.',ok:m=>(C_(m).marriages||0)>=3},
  {id:'ricardao',ic:'🫣',n:'Pego no flagra',d:'Ser descoberto traindo.',s:1,ok:m=>(C_(m).cheats||0)>=1},
  {id:'ex5',ic:'💔',n:'Coração de vidro',d:'Ter cinco ex ao mesmo tempo na lista.',ok:m=>nPeople('ex')>=5},
  {id:'filho',ic:'🍼',n:'Fraldas e olheiras',d:'Ter um filho.',ok:m=>(C_(m).kids||0)>=1},
  {id:'time',ic:'⚽',n:'Time de futebol',d:'Ter 11 filhos.',ok:m=>(C_(m).kids||0)>=11},
  {id:'avo',ic:'👵',n:'Vô coruja',d:'Ter um neto.',ok:m=>nPeople('neto')>=1},
  {id:'viuvo',ic:'🖤',n:'Até que a morte nos separe',d:'Ficar viúvo.',ok:m=>(C_(m).widow||0)>=1},
  {id:'divorcio',ic:'📜',n:'Metade de tudo',d:'Se divorciar.',ok:m=>(C_(m).divorces||0)>=1},
  {id:'amorsemfim',ic:'🔥',n:'Fogo no parquinho',d:'Fazer amor 20 vezes.',s:1,ok:m=>(C_(m).amor||0)>=20},
  {id:'pets',ic:'🦜',n:'Arca de Noé',d:'Ter cinco bichos ao mesmo tempo.',ok:m=>nPeople('pet')>=5},
  {id:'amigos',ic:'🎉',n:'Popular',d:'Ter dez amigos.',ok:m=>nPeople('amigo')>=10},
  {id:'solitario',ic:'🐺',n:'Lobo solitário',d:'Chegar aos 40 sem nenhum amigo.',s:1,ok:m=>m.age>=40&&nPeople('amigo')===0},
  {id:'todos',ic:'🫂',n:'Domingão em família',d:'Passar um tempo com todos.',ok:m=>!!(m.yr&&m.yr.tempoTodos)||(C_(m).tempoTodos||0)>0},
  // corpo e mente
  {id:'genio',ic:'🧠',n:'Cérebro galáctico',d:'Inteligência em 100%.',ok:m=>m.smarts>=100},
  {id:'lindo',ic:'✨',n:'Capa de revista',d:'Aparência em 100%.',ok:m=>m.looks>=100},
  {id:'feio',ic:'🥔',n:'Beleza interior',d:'Aparência abaixo de 5%.',s:1,ok:m=>m.age>=14&&m.looks<=5},
  {id:'feliz',ic:'😁',n:'Good vibes',d:'Felicidade em 100%.',ok:m=>m.happy>=100},
  {id:'triste',ic:'🌧️',n:'Fundo do poço',d:'Felicidade em 0%.',s:1,ok:m=>m.happy<=0},
  {id:'lutador',ic:'🥊',n:'Bruce Lee de bairro',d:'Luta em 95%.',ok:m=>(m.fight||0)>=95},
  {id:'pinguco',ic:'🍺',n:'Pinguço oficial',d:'Vício em álcool acima de 90%.',s:1,ok:m=>(m.add&&m.add.alcool||0)>=90},
  {id:'plastica',ic:'🎭',n:'Mais plástico que boneca',d:'Fazer cinco cirurgias plásticas.',ok:m=>(C_(m).surg||0)>=5},
  {id:'doutor',ic:'🎓',n:'Doutor em tudo',d:'Terminar um doutorado.',ok:m=>(m.edu.deg||[]).includes('post:dout')},
  {id:'repetente',ic:'📚',n:'Repetente com orgulho',d:'Repetir de ano.',s:1,ok:m=>(C_(m).repetiu||0)>=1},
  // trabalho e poder
  {id:'emprego',ic:'💼',n:'Carteira assinada',d:'Arrumar o primeiro emprego.',ok:m=>!!m.job||(m.hist||[]).length>0},
  {id:'nemnem',ic:'🛋️',n:'Nem-nem profissional',d:'Chegar aos 35 sem nunca ter trabalhado.',s:1,ok:m=>m.age>=35&&!m.job&&!(m.hist||[]).length},
  {id:'policial',ic:'🚓',n:'Lei e ordem',d:'Entrar para a polícia.',ok:m=>!!C_(m).cop},
  {id:'sherlock',ic:'🕵️',n:'Elementar',d:'Resolver cinco casos.',ok:m=>(C_(m).casosOk||0)>=5},
  {id:'mordomo',ic:'🤦',n:'Prendi o mordomo errado',d:'Acusar um inocente numa investigação.',s:1,ok:m=>(C_(m).casoErr||0)>=1},
  {id:'presidente',ic:'🏛️',n:'Excelentíssimo',d:'Virar presidente.',ok:m=>(C_(m).pres||0)>=1},
  {id:'ditador',ic:'🪖',n:'Quem manda sou eu',d:'Dar um golpe de Estado e tomar o poder.',s:1,ok:m=>!!C_(m).golpeOk},
  {id:'rei',ic:'👑',n:'Vossa Majestade',d:'Subir ao trono.',ok:m=>!!C_(m).reigned},
  {id:'famoso',ic:'🌟',n:'Celebridade',d:'Fama acima de 90%.',ok:m=>m.fame>=90},
  // crime
  {id:'crime',ic:'🦹',n:'Primeiro delito',d:'Cometer um crime.',ok:m=>(C_(m).crimes||0)>=1},
  {id:'preso',ic:'⛓️',n:'Sol quadrado',d:'Ser preso.',ok:m=>!!m.prison||(m.rec&&m.rec.conv>0)},
  {id:'fuga',ic:'🏃',n:'Fuga de Alcatraz',d:'Fugir da prisão.',ok:m=>(C_(m).escapes||0)>=1},
  {id:'assassino',ic:'🔪',n:'Mãos sujas',d:'Matar alguém.',s:1,ok:m=>(C_(m).kills||0)>=1},
  {id:'serial',ic:'💀',n:'Ficha corrida',d:'Matar dez pessoas.',s:1,ok:m=>(C_(m).kills||0)>=10},
  // seita
  {id:'seita',ic:'🛐',n:'Pastor de si mesmo',d:'Fundar um grupo religioso.',ok:m=>!!m.seita&&!m.seita.membro},
  {id:'profeta',ic:'📿',n:'Profeta do zap',d:'Ter 1.000 fiéis.',ok:m=>!!m.seita&&!m.seita.membro&&m.seita.fieis>=1000},
  {id:'dominio',ic:'🗺️',n:'Teocracia',d:'Dominar o país com o seu grupo.',s:1,ok:m=>!!m.seita&&(m.seita.dom||[]).length>=4},
  {id:'martir',ic:'🔥',n:'Pregou demais',d:'Morrer pelas mãos dos próprios seguidores.',s:1,ok:(m,f)=>f.dead&&/seguidores/.test(m.cause||'')},
  // paranormal
  {id:'fantasma',ic:'👻',n:'Quem você vai chamar?',d:'Juntar 10 provas do sobrenatural.',ok:m=>!!m.para&&(m.para.prova>=10||m.para.visitas>=10)},
  {id:'vampiro',ic:'🧛',n:'Pescoço é a nova picanha',d:'Virar vampiro.',s:1,ok:m=>m.criatura==='vampiro'},
  {id:'lobisomem',ic:'🐺',n:'Auuuuu',d:'Virar lobisomem.',s:1,ok:m=>m.criatura==='lobisomem'},
  // mundos alternativos
  {id:'zumbi',ic:'🧟',n:'The Walking Eu',d:'Sobreviver 30 dias no apocalipse zumbi.',ok:m=>(META.zrec||0)>=30||!!(S.scen&&S.scen.id==='zumbi'&&S.scen.dia>=30)},
  {id:'isekai',ic:'🚚',n:'Caminhão-kun mandou bem',d:'Derrotar o Rei Demônio.',ok:m=>(C_(m).scenWin_isekai||0)>=1},
  {id:'ilha',ic:'🏐',n:'Wilsooon!',d:'Ser resgatado da ilha deserta.',ok:m=>(C_(m).scenWin_ilha||0)>=1},
  {id:'marte',ic:'🥔',n:'Fazendeiro de Marte',d:'Voltar de Marte.',ok:m=>(C_(m).scenWin_marte||0)>=1},
  {id:'heroi',ic:'🦸',n:'Nem todo herói usa capa',d:'Pendurar a capa de super-herói.',ok:m=>(C_(m).scenWin_heroi||0)>=1},
  {id:'casal_mundo',ic:'💞',n:'Amor de outro mundo',d:'Trazer um par de um mundo alternativo para a vida real.',s:1,ok:m=>!!C_(m).parMundo},
  // zoeira pura
  {id:'deus',ic:'⚡',n:'Modo Deus',d:'Usar o Modo Deus.',s:1,ok:m=>(C_(m).god||0)>=1},
  {id:'tempo',ic:'⏳',n:'Marty McFly',d:'Usar a máquina do tempo.',s:1,ok:m=>(C_(m).timeTravel||0)>=1},
  {id:'atestado',ic:'🤒',n:'Atestado de mentirinha',d:'Comprar um atestado falso.',s:1,ok:m=>(C_(m).fakeSick||0)>=1},
  {id:'viajante',ic:'✈️',n:'Milhas infinitas',d:'Viajar 20 vezes.',ok:m=>(C_(m).trips||0)>=20},
  {id:'emigrou',ic:'🌍',n:'Cidadão do mundo',d:'Emigrar três vezes.',ok:m=>(C_(m).emig||0)>=3},
  {id:'velhinho_rico',ic:'🧓💰',n:'Herança disputada',d:'Ter mais de 80 anos e mais de $10 milhões.',ok:m=>m.age>=80&&m.money>=1e7},
  {id:'bebe_feliz',ic:'👼',n:'Bebê mais feliz do mundo',d:'Ter felicidade em 100% antes dos 5 anos.',s:1,ok:m=>m.age<5&&m.happy>=100},
];
const conqGot=()=>META.conq||(META.conq={});
function conqCheck(f={}){ if(!S||!S.me||/teste|aventura|qualidade/.test(location.hash)) return; const m=S.me, got=conqGot(), novas=[];
  for(const c of CONQ){ if(got[c.id]) continue; let ok=false; try{ ok=!!c.ok(m,f); }catch(e){} if(ok){ got[c.id]=Date.now(); novas.push(c); } }
  if(!novas.length) return; try{ save(); }catch(e){}
  try{ sfx('level'); }catch(e){}
  MQ.push({k:'Conquista',t:novas.length>1?`🏆 ${novas.length} conquistas desbloqueadas!`:`🏆 ${novas[0].n}`,html:`<div style="text-align:left;margin-top:6px">${novas.slice(0,6).map(c=>`<p style="margin:6px 0"><span style="font-size:20px">${c.ic}</span> <b>${esc(c.n)}</b><br><span style="color:var(--muted);font-size:13px">${esc(c.d)}</span></p>`).join('')}${novas.length>6?`<p style="font-size:13px">…e mais ${novas.length-6}. Veja em Menu → Conquistas.</p>`:''}<p style="color:var(--muted);font-size:12px;margin-top:8px">${Object.keys(got).length} de ${CONQ.length} conquistas</p></div>`}); }
after=(o=>function(){ try{ conqCheck(); }catch(e){} return o.apply(this,arguments); })(after);
die=(o=>function(){ const r=o.apply(this,arguments); try{ conqCheck({dead:1}); }catch(e){} return r; })(die);
V.conquistas=()=>{ const got=conqGot(), it=[{html:`<div class="card">${bar('Conquistas',Math.round(Object.keys(got).length/CONQ.length*100))}<p style="color:var(--muted);font-size:13px">${Object.keys(got).length} de ${CONQ.length}. Valem para todas as vidas. As secretas aparecem como ??? até você conseguir.</p></div>`}];
  const yes=CONQ.filter(c=>got[c.id]), no=CONQ.filter(c=>!got[c.id]);
  if(yes.length){ it.push({sec:'Desbloqueadas'}); yes.forEach(c=>it.push({ic:c.ic,l:c.n,s:c.d,r:'✓',tone:'good'})); }
  if(no.length){ it.push({sec:'Bloqueadas'}); no.forEach(c=>it.push(c.s?{ic:'❔',l:'???',s:'Conquista secreta',dis:true,why:'Segredo. Continue vivendo (ou morrendo) para descobrir.'}:{ic:c.ic,l:c.n,s:c.d,dis:true,why:c.d})); }
  return {title:'Conquistas',items:it}; };
V.menu=(o=>()=>{ const r=o(); if(r&&r.items){ const i=r.items.findIndex(x=>x.l==='Meus selos'); r.items.splice(i>=0?i+1:r.items.length,0,{ic:'🏆',l:'Conquistas',s:`${Object.keys(conqGot()).length} de ${CONQ.length}`,on:()=>UI.push(V.conquistas)}); } return r; })(V.menu);
// contadores que as conquistas usam
scenEnd=(o=>function(win,txt){ const sc=S.scen; if(sc&&win){ cnt('scenWin_'+sc.id); if(crew().some(c=>c.par)) S.me.c.parMundo=1; } return o.apply(this,arguments); })(scenEnd);
// ---------- selos novos (no fim da vida) ----------
RIBBONS.splice(RIBBONS.findIndex(r=>r.id==='coroado')+1,0,
  {id:'ditador',n:'Ditador',d:'Tomou o poder num golpe de Estado.'},
  {id:'criatura',n:'Filho da noite',d:'Virou vampiro ou lobisomem.'},
  {id:'profeta',n:'Profeta',d:'Liderou um grupo religioso com mais de 1.000 fiéis.'},
  {id:'detetive',n:'Detetive',d:'Resolveu cinco casos ou mais na polícia.'},
  {id:'multiverso',n:'Viajante de mundos',d:'Venceu dois modos fictícios diferentes ou mais.'},
  {id:'galinha',n:'Fogo no rabo',d:'Fez amor mais de 50 vezes na vida.'},
  {id:'lobo',n:'Lobo solitário',d:'Viveu mais de 60 anos sem nenhum amigo.'});
computeRibbon=(o=>function(){ const m=S.me, c=m.c||{}; const wins=['zumbi','ilha','isekai','heroi','marte'].filter(k=>c['scenWin_'+k]).length;
  const tests=[['desistente',!!c.gaveUp],['coroado',!!c.reigned],['ditador',!!c.golpeOk],['criatura',!!c.criatura],['profeta',(c.maxFieis||0)>=1000],['detetive',(c.casosOk||0)>=5],['multiverso',wins>=2],['galinha',(c.amor||0)>50],['lobo',m.age>60&&people('amigo').length===0]];
  for(const [id,ok] of tests) if(ok) return id; return o.apply(this,arguments); })(computeRibbon);
yearMoney=(o=>function(){ const r=o.apply(this,arguments); const s=S.me.seita; if(s&&!s.membro) S.me.c.maxFieis=Math.max(S.me.c.maxFieis||0,s.fieis); return r; })(yearMoney);
if(/demo-conquistas/.test(location.hash)) window.addEventListener('load',()=>setTimeout(()=>{ try{ MQ.length=0; const b=document.querySelector('#modalWrap'); if(b) b.hidden=true; modalOpen=false; UI.open(V.conquistas); }catch(e){} },3500));
if(/demo-conqpop/.test(location.hash)) window.addEventListener('load',()=>setTimeout(()=>{ try{ MQ.length=0; const b=document.querySelector('#modalWrap'); if(b) b.hidden=true; modalOpen=false; META.conq={}; S.me.age=Math.max(S.me.age,19); conqCheck(); pump(); }catch(e){ showErr(e); } },7000));
if(/demo-inicio/.test(location.hash)) window.addEventListener('load',()=>setTimeout(()=>{ try{ MQ.length=0; modalOpen=false; const b=document.querySelector('#modalWrap'); if(b) b.hidden=true; UI.close(); showStart(); }catch(e){ showErr(e); } },7000));
// vitrine para as imagens do README (#demo-vitrine): uma vida bonita, sem mortes nem doenças no topo
if(/demo-vitrine/.test(location.hash)) window.addEventListener('load',()=>setTimeout(()=>{ try{ MQ.length=0; modalOpen=false; const b=document.querySelector('#modalWrap'); if(b) b.hidden=true; UI.close();
  const m=S.me; if(m.gender!=='F'){ m.gender='F'; m.first=pickFirst(countryOf(m.country),'F'); delete m.look; } m.alive=true; m.cause=null; m.age=24; m.health=88; m.happy=82; m.smarts=74; m.looks=69; m.money=48300; m.prison=null; m.edu.cur=null; if(!m.edu.deg.includes('medio')) m.edu.deg.push('medio');
  takeJob({id:'poli',co:'Polícia Civil',size:'grande',mul:1}); const y=S.year; S.log=[
   {age:21,year:y-3,lines:[{t:'Passei no concurso da Polícia Civil!',c:'good'},'Fui a um show de rock e perdi a voz de tanto cantar.','Pescaria com meu pai: pegamos um peixe enorme e soltamos.']},
   {age:22,year:y-2,lines:[{t:'Comecei a namorar Júlia Andrade.',c:'good'},'Adotei um gato de rua. Chama-se Paçoca.',{t:'Primeiro dia na delegacia → Fazer um discurso. Aplaudiram.',c:'choice'},'Aprendi a fazer pão de fermentação natural.']},
   {age:23,year:y-1,lines:[{t:'🎖️ Resolvi o caso do roubo de joias. A delegacia inteira aplaudiu.',c:'good'},'Viajei para a praia com a Júlia.','Minha irmã teve um bebê. Agora sou tia!',{t:'Churrasco no quintal → Chamar todo mundo. Teve até karaokê.',c:'choice'}]},
   {age:24,year:y,lines:[{t:'Fui promovida a cabo.',c:'good'},'Fechei o ano com $48.300 na conta.','Comecei a correr de manhã, e virou minha paixão.',{t:'Pedido no telhado → Aceitar. Estou noiva!',c:'good'}]}];
  render.jump=true; render(); }catch(e){ showErr(e); } },7000));
