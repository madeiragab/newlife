// ===== Romance dentro dos modos fictícios =====
// Qualquer adulto do grupo pode virar par: flerte, encontro, namoro, noivado, casamento e filhos.
// Se a aventura terminar bem, o par e os filhos voltam junto para a vida real.
// No modo de super-herói, além do grupo, vale o romance da vida real (é o mesmo mundo).
const ROM={
  zumbi:{enc:['no telhado de um prédio, vendo o pôr do sol sem nenhuma luz acesa na cidade','num cinema abandonado, com uma lanterna apontada para a tela vazia','na beira do rio, longe dos gemidos','dançando devagar ao som de um rádio a pilha','num supermercado vazio, empurrando um carrinho como se fosse sábado','dividindo a última lata de pêssego em calda','num carrossel parado de um parque abandonado'],
    risco:'Um zumbi apareceu no meio do encontro. Acabamos com ele juntos. Foi estranhamente romântico.',
    casa:'no meio do acampamento, com alianças feitas de arruela e um padre que ninguém sabe se era padre mesmo',
    novo:[c=>`Na estrada, encontrei ${c.first}, que sobrevivia sozinh${oaG(c.gender)} num posto de gasolina. A conversa durou a noite inteira. Agora viaja com a gente.`,c=>`${c.first} estava escondid${oaG(c.gender)} num ônibus escolar. Dividimos um biscoito, e alguma coisa a mais. Juntou-se ao grupo.`],pNovo:.45,
    sem:'Ninguém por perto. Só zumbis, e eles não fazem meu tipo.'},
  ilha:{enc:['na areia, contando estrelas que eu nunca tinha visto','dividindo um coco na beira do mar','tomando banho de cachoeira','em volta da fogueira, contando como era a vida antes do avião','pescando de mãos dadas, sem pegar nada','assistindo às tartarugas chegarem na praia'],
    risco:'Um caranguejo gigante beliscou o pé no meio do beijo. Rimos até doer a barriga.',
    casa:'na praia, com coroas de flores, conchas no lugar das alianças e a bola de vôlei de testemunha',
    novo:[c=>`Um bote salva-vidas chegou à praia. Dentro, ${c.first}, desidratad${oaG(c.gender)} e lind${oaG(c.gender)}. Cuidei de cada queimadura de sol.`],pNovo:.18,
    sem:'Não tem ninguém na ilha. Só eu, os caranguejos e o barulho das ondas.'},
  isekai:{enc:['no festival das lanternas, soltando luzes mágicas no rio','num piquenique sob os dois sóis','na taverna, dividindo uma caneca de hidromel','voando num grifo alugado por cima das nuvens','no lago das fadas, onde a água brilha à noite','dançando no baile da guilda'],
    risco:'Um slime pulou no meio da toalha do piquenique. Derretemos ele com magia e voltamos a nos beijar.',
    casa:'no templo da deusa, com bênção dos elfos, chuva de pétalas mágicas e um anão chorando na primeira fila',
    novo:[c=>`Na taverna, ${c.first}, ${(c.race||'aventureir'+oaG(c.gender)).toLowerCase()}, sentou na minha mesa e pagou uma rodada. Topou entrar para o grupo.`,c=>`Salvei ${c.first} de uma emboscada de goblins. ${c.gender==='F'?'Ela':'Ele'} disse que me deve a vida, e resolveu me seguir.`],pNovo:.55,
    sem:'A taverna estava vazia. Só um bardo bêbado cantando sobre amores perdidos.'},
  marte:{enc:['vendo o pôr do sol azul de Marte pela escotilha','num jantar de batata à luz de LED','numa caminhada de traje pela borda da cratera','assistindo a um filme antigo no módulo de carga','dançando em gravidade baixa, quase voando','olhando a Terra, um pontinho azul no céu'],
    risco:'O alarme de pressão disparou no meio do encontro. Consertamos o vazamento abraçados, de capacete.',
    casa:'no módulo central, no primeiro casamento da história de Marte, transmitido ao vivo para a Terra',
    novo:null,pNovo:0,sem:'Na colônia, todo mundo já se conhece. Não tem gente nova a 225 milhões de quilômetros.'},
  heroi:{enc:['no alto da torre do relógio, vendo a cidade acesa','num jantar num restaurante pequeno, sem máscara','voando (ou correndo) por cima do mar','num cinema, de mãos dadas, com o rádio da polícia no bolso','num terraço, comendo pizza fria'],
    risco:'O alarme de crime tocou no meio do encontro. Voltei com a camisa rasgada, mas voltei.',
    casa:'num terraço, à noite, com os aliados de padrinhos e as máscaras guardadas',
    novo:null,pNovo:0,sem:''},
};
const romOK=c=>{ const m=S.me; if(!c||c.bebe||c.bicho||c.filho) return false; if(m.age<16||c.age<16||(m.age<18)!==(c.age<18)) return false; return !m.pref||m.pref==='A'||c.gender===m.pref; };
const romPar=()=>{ const sc=S.scen; if(!sc||!sc.par) return null; const c=crewById(sc.par); if(!c){ sc.par=null; return null; } return c; };
const romSt=c=>c.par==='casado'?`Casad${oaG(c.gender)} comigo`:c.par==='noivo'?`Noiv${oaG(c.gender)}`:c.par==='namoro'?'Namorando':'';
const romPrefG=()=>{ const m=S.me; return !m.pref||m.pref==='A'?(R.chance(.5)?'F':'M'):m.pref; };
function romAm(c,n){ c.am=Math.max(0,Math.min(100,(c.am||10)+n)); }
function romStart(c){ const sc=S.scen; sc.par=c.id; c.par='namoro'; c.parD=sc.dia; c.ex=0; c.lv=Math.min(100,c.lv+10); romAm(c,10); cnt('partners'); const r=partner(); if(r&&!sc.trai){ sc.trai=r.id; return ` Lá na vida real, ${r.first} nem imagina.`; } return ''; }
function romEnd(c){ const sc=S.scen; if(sc.par===c.id) sc.par=null; if(sc.grav&&sc.grav.pid===c.id) sc.grav=null; c.par=null; c.ex=1; c.am=Math.min(c.am||0,10); c.lv=Math.max(0,c.lv-20); }
const romCanBaby=c=>{ const m=S.me; if(c.gender===m.gender) return false; const mae=m.gender==='F'?m:c; return mae.age>=16&&mae.age<=46; };
function romGrav(c){ const sc=S.scen; if(sc.grav) return 'Já tem um bebê a caminho.'; if(!romCanBaby(c)) return null; if(!R.chance(.4)) return 'Ainda não foi desta vez.'; sc.grav={pid:c.id,due:sc.dia+(sc.id==='heroi'?1:rnd(5,8))};
  return S.me.gender==='F'?'Fiz o teste no escuro, com uma lanterna. Positivo. Vou ter um bebê!':`${c.first} me mostrou o teste com as mãos tremendo. Positivo. Vamos ter um bebê!`; }
function romBaby(pid){ const sc=S.scen, m=S.me, par=crewById(pid); const gd=R.chance(.5)?'F':'M';
  const b=mkCrew({gender:gd,age:1,last:m.last}); b.age=0; b.bebe=1; b.filho=1; b.lv=100; b.arma=null; b.race=gd==='F'?'Minha filha':'Meu filho';
  if(par&&par.genes&&m.genes){ try{ const k=childOf(m,Object.assign({looks:50,smarts:50,health:70},par),gd); if(k&&k.genes) b.genes=k.genes; }catch(e){} }
  if(sc.grav&&sc.grav.pid===pid) sc.grav=null; cnt('kids'); return b; }
// conhecer alguém novo ou reparar em alguém do grupo
function romProcurar(){ const sc=S.scen, rm=ROM[sc.id]||ROM.zumbi; const cs=crew().filter(c=>romOK(c)&&!c.par&&!c.ex);
  if(cs.length&&R.chance(rm.pNovo?.7:1)){ const c=R.pick(cs); romAm(c,rnd(8,14)); return R.pick([`Peguei ${c.first} me olhando de canto de olho. Quando olhei de volta, ${c.gender==='F'?'ela':'ele'} sorriu.`,`Passei a tarde ajudando ${c.first}. Teve um momento em que nossas mãos se encostaram e ninguém tirou.`,`${c.first} guardou o melhor pedaço da comida para mim. Isso, aqui, é quase uma declaração.`]); }
  if(rm.novo&&R.chance(rm.pNovo)){ const m=S.me, c=mkCrew({gender:romPrefG(),age:m.age<18?rnd(16,17):Math.max(18,Math.min(70,m.age+rnd(-6,6)))}); c.am=rnd(25,40); return R.pick(rm.novo)(c); }
  return rm.sem||'Não apareceu ninguém hoje.'; }
// ---------- telas ----------
function romItems(c){ const sc=S.scen, it=[], rm=ROM[sc.id]||ROM.zumbi, once=k=>!!sc.done['r'+c.id+k], other=romPar(); const o=oaG(c.gender), ele=c.gender==='F'?'ela':'ele';
  it.push({sec:'Romance'},{html:`<div class="card">${bar('Paixão',c.am||0)}${c.par?kv('Situação',romSt(c)):c.ex?kv('Situação','Ex'):''}</div>`});
  it.push({ic:'😉',l:'Flertar',s:'Paixão',dis:once('f'),why:'Já flertei hoje. Calma.',on:()=>scAct(()=>{ sc.done['r'+c.id+'f']=1; if(pct(.35+sc.car/250+c.lv/300+(c.am||0)/400)){ romAm(c,rnd(6,12)); scStat('san',3); return R.pick([`${c.first} riu da minha cantada ruim. Riu de verdade.`,`Elogiei ${c.first}. ${ele[0].toUpperCase()+ele.slice(1)} ficou vermelh${o} e mudou de assunto.`,`${c.first} devolveu o flerte na mesma moeda. Alguém do grupo assobiou.`]); } romAm(c,-3); return R.pick([`${c.first} fingiu que não entendeu.`,`Tentei uma cantada. ${c.first} me olhou como se eu tivesse levado uma pancada na cabeça.`,`${c.first} disse que não é hora para isso.`]); },c.first)});
  it.push({ic:'🌹',l:'Chamar para um encontro',s:'1 de energia · paixão e sanidade',dis:once('e')||sc.ap<1||(c.am||0)<20,why:(c.am||0)<20?`${c.first} ainda não me vê desse jeito. Preciso flertar antes.`:once('e')?'Já tivemos um encontro hoje.':'Sem energia hoje.',
    on:()=>scAct(()=>{ if(!spend('r'+c.id+'e',1)) return 'Sem energia.'; romAm(c,rnd(10,18)); c.lv=Math.min(100,c.lv+5); scStat('san',rnd(6,10)); let t=`Fomos ${R.pick(rm.enc)}.`; if(R.chance(.15)){ scHurt(rnd(3,8)); t+=' '+rm.risco; } else t+=' '+R.pick(['Foi o melhor dia desde que tudo começou.','Não falamos do perigo nem uma vez.','Teve beijo. Teve sim.','Fiquei sorrindo à toa o resto do dia.']); return t; },'Encontro')});
  const gift=sc.inv.find(x=>['san','venda'].includes(itCat(x.id)))||sc.inv.find(x=>itCat(x.id)==='comida');
  it.push({ic:'🎁',l:'Dar um presente',s:gift?`Dar ${itN(gift.id).toLowerCase()}`:'Preciso de algum item',dis:!gift||once('g'),why:!gift?'Não tenho nada para dar.':'Já dei um presente hoje.',on:()=>scAct(()=>{ sc.done['r'+c.id+'g']=1; sc.inv=sc.inv.filter(y=>y!==gift); romAm(c,rnd(8,14)); return `Dei ${itN(gift.id).toLowerCase()} para ${c.first}. Num mundo desses, presente vale ouro.`; },c.first)});
  if(!c.par&&!other) it.push({ic:'💞',l:'Pedir em namoro',s:'Precisa de paixão',dis:(c.am||0)<35||once('n'),why:(c.am||0)<35?`Ainda é cedo. A paixão de ${c.first} está baixa.`:'Já pedi hoje.',on:()=>scAct(()=>{ sc.done['r'+c.id+'n']=1; if(pct(.25+(c.am||0)/110)){ const x=romStart(c); scStat('san',10); return `${c.first} disse sim! Estamos namorando.${x}`; } romAm(c,-8); scStat('san',-4); return `${c.first} disse que gosta de mim, mas não quer nada sério agora.`; },c.first)});
  if(c.par==='namoro') it.push({ic:'💍',l:'Pedir em casamento',s:'Precisa de muita paixão',dis:(c.am||0)<65||sc.dia-(c.parD||0)<4||once('p'),why:(c.am||0)<65?'Ainda não estamos tão firmes.':sc.dia-(c.parD||0)<4?'Começamos a namorar há pouco tempo.':'Já pedi hoje.',on:()=>scAct(()=>{ sc.done['r'+c.id+'p']=1; if(pct(.3+(c.am||0)/120)){ c.par='noivo'; romAm(c,8); scStat('san',12); return `Ajoelhei. ${c.first} chorou e disse sim. Estamos noivos!`; } romAm(c,-10); return `${c.first} disse que ainda não está pront${o}.`; },'Pedido')});
  if(c.par==='noivo') it.push({ic:'💒',l:'Casar',s:'Cerimônia com todo o grupo',ap:1,dis:sc.ap<1,why:'Sem energia hoje.',on:()=>scAct(()=>{ if(!spend(null,1)) return 'Sem energia.'; c.par='casado'; romAm(c,15); scStat('san',18); crew().forEach(x=>x.lv=Math.min(100,x.lv+6)); return `Casamos ${rm.casa}. Por um dia inteiro, o mundo lá fora não existiu.`; },'Casamento')});
  if(c.par&&S.me.age>=18&&c.age>=18) it.push({ic:'❤️‍🔥',l:'Fazer amor',s:romCanBaby(c)&&!sc.grav?'Paixão e sanidade · sem proteção pode vir um bebê':'Paixão e sanidade',dis:once('t'),why:'Hoje não.',on:()=>{ const vai=prot=>scAct(()=>{ sc.done['r'+c.id+'t']=1; romAm(c,rnd(6,12)); scStat('san',rnd(5,9)); cnt('amor'); primeiraVez(`${c.first} ${c.last}`);
      let t=R.pick([`Uma noite só nossa, longe de tudo. ${sc.id==='zumbi'?'Nem os gemidos lá fora atrapalharam.':'O mundo podia esperar.'}`,`Acordei com ${c.first} sorrindo para mim.`,`Por algumas horas, só existia ${c.first}.`]);
      if(romCanBaby(c)&&!sc.grav&&R.chance(prot?.03:.35)){ sc.grav={pid:c.id,due:sc.dia+(sc.id==='heroi'?1:rnd(5,8))}; t+=S.me.gender==='F'?' Dias depois, o enjoo: estou grávida!':` Dias depois, ${c.first} me contou: vem um bebê aí!`; }
      return t; },c.first);
    if(!romCanBaby(c)||sc.grav) return vai(true); modal({t:`Com ${c.first}`,x:'Como vai ser?',ch:[{l:'Com proteção',fn:()=>vai(true)},{l:'Sem proteção',fn:()=>vai(false)},{l:'Hoje não',cls:'alt'}]}); }});
  if(c.par&&!romCanBaby(c)&&c.gender===S.me.gender&&!sc.adot) it.push({ic:'🧸',l:'Adotar uma criança órfã',s:'Uma criança perdida no caminho',dis:(c.am||0)<50||sc.id==='marte'||sc.id==='ilha',why:sc.id==='marte'||sc.id==='ilha'?'Não tem crianças aqui.':'Precisamos estar mais firmes antes.',on:()=>scAct(()=>{ sc.adot=1; const k=mkCrew({age:rnd(4,10),last:S.me.last}); k.bebe=1; k.filho=1; k.lv=100; k.arma=null; k.race=k.gender==='F'?'Minha filha':'Meu filho'; cnt('kids'); return `Encontramos ${k.first}, de ${k.age} anos, sozinh${oaG(k.gender)}. Agora tem dois pais${c.gender==='F'?' (duas mães, no caso)':''} e um lugar no grupo.`; },'Adoção')});
  if(c.par) it.push({ic:'💔',l:'Terminar',tone:'bad',on:()=>confirmBox('Terminar?',`${c.first} vai ficar arrasad${o}.`,'Terminar',()=>{ romEnd(c); scStat('san',-6); scLog(`Terminei com ${c.first}.`,'warn'); if(R.chance(.3)) crewLeave(c,`${c.first} juntou as coisas e foi embora.`); UI.back(); after(); })});
  return it; }
V.scMember=(o=>c=>{ const r=o(c); if(!r) return r; if(romOK(c)||c.par) { const i=r.items.findIndex(x=>x.l==='Deixar para trás'); const add=romItems(c); if(i>=0) r.items.splice(i,0,...add); else r.items.push(...add); }
  if(c.filho) r.items.splice(1,0,{html:`<div class="card"><p>${c.gender==='F'?'Minha filha':'Meu filho'}. Se a aventura terminar bem, ${c.gender==='F'?'ela':'ele'} vem comigo para a vida real.</p></div>`});
  return r; })(V.scMember);
V.scCrew=(o=>()=>{ const r=o(); const sc=S.scen; if(!sc) return r; const it=[{sec:'Amor'}], p=romPar(), real=partner();
  if(p) it.push({face:faceSVG(p,40),l:`${p.first} ${p.last}`,s:`${romSt(p)} · paixão ${p.am||0}%`,bars:[['💗',p.am||0,'#E5487D']],on:()=>UI.push(()=>V.scMember(p))});
  else if(sc.id==='heroi'&&real) it.push({face:faceSVG(real,40),l:`${real.first} ${real.last}`,s:`${relLabel(real)}${sc.sab&&sc.sab[real.id]?' · sabe quem eu sou':''}`,bars:[['❤️',real.bond,'#E5487D']],on:()=>UI.push(()=>V.hPessoa(real))});
  else it.push({html:'<div class="card"><p style="color:var(--muted)">Sem ninguém por enquanto.</p></div>'});
  if(sc.grav){ const g=crewById(sc.grav.pid); it.push({ic:'🤰',l:'Bebê a caminho',s:`Nasce em ${Math.max(1,sc.grav.due-sc.dia)} dia(s)${g?' · com '+g.first:''}`,dis:true,why:'Falta pouco.'}); }
  if(sc.id!=='heroi') it.push({ic:'💘',l:'Procurar romance',s:'1 de energia',dis:sc.ap<1||!!sc.done.rprocura,why:sc.done.rprocura?'Já procurei hoje.':'Sem energia hoje.',on:()=>scAct(()=>{ if(!spend('rprocura',1)) return 'Sem energia.'; return romProcurar(); },'Romance')});
  if(real&&sc.id!=='heroi') it.push({face:faceSVG(real,40),l:`${real.first} ${real.last}`,s:`${relLabel(real)} na vida real · a vida real está pausada`,dis:true,why:`${real.first} está lá na vida real, esperando eu voltar.`});
  r.items.splice(Math.min(r.items.length,1),0,...it,{sec:sc.id==='heroi'?'Aliados':'Grupo'}); return r; })(V.scCrew);
// ---------- efeitos diários e eventos ----------
function romDay(sc){ const p=romPar(); if(p){ scStat('san',p.par==='casado'?3:2); romAm(p,p.lv<35?-3:-1); if((p.am||0)<12&&!sc.rfim){ sc.rfim=1; queue('rom_fim',{cid:p.id}); } }
  if(sc.grav&&sc.dia>=sc.grav.due) queue('rom_parto',{cid:sc.grav.pid}); }
scNextDay=(o=>function(){ const r=o.apply(this,arguments); const sc=S.scen; if(sc&&sc.v===SC_V) romDay(sc); return r; })(scNextDay);
crewLeave=(o=>function(c,why,dead){ const sc=S.scen; const was=sc&&sc.par===c.id; const r=o.apply(this,arguments);
  if(sc&&was){ sc.par=null; if(sc.grav&&sc.grav.pid===c.id&&S.me.gender!=='F') sc.grav=null; if(dead){ scStat('san',-25); scLog(`Perdi ${c.first}, o amor que encontrei no meio de tudo isso.`,'bad'); } else { scStat('san',-10); scLog(`${c.first} foi embora. Levou um pedaço de mim.`,'bad'); } }
  else if(sc&&c.filho&&dead){ scStat('san',-35); scLog(`Perdi ${c.gender==='F'?'minha filha':'meu filho'}, ${c.first}. Não existe dor maior.`,'bad'); }
  return r; })(crewLeave);
EVENTS.rom_fim={scen:'*',show:d=>{ const c=crewById(d.cid); return {k:'Amor',t:'A gente precisa conversar',x:`${c?c.first:'Meu par'} diz que sente que eu não estou mais presente. Que a relação esfriou.`,ch:[['Lutar pela relação','l'],['Prometer mudar','p'],['Aceitar o fim','f']]}; },
  pick:(k,d)=>{ const sc=S.scen; if(!sc) return ''; sc.rfim=0; const c=crewById(d.cid); if(!c) return '';
    if(k==='f'){ romEnd(c); scStat('san',-8); return `Terminamos. ${c.first} continua no grupo, mas evita meu olhar.`; }
    if(pct(k==='l'?.35+sc.car/200:.5)){ romAm(c,rnd(20,30)); return k==='l'?'Falei tudo o que sentia. Choramos juntos. Ainda tem amor aqui.':`${c.first} aceitou me dar mais uma chance.`; }
    romEnd(c); scStat('san',-10); return `${c.first} já tinha decidido. Acabou.`; }};
EVENTS.rom_parto={scen:'*',show:d=>{ const c=crewById(d.cid), me=S.me.gender==='F'; return {k:'Amor',t:'Vai nascer!',x:me?'As contrações começaram. Não tem hospital, não tem médico. Tem o grupo, e tem você.':`${c?c.first:'Meu par'} entrou em trabalho de parto. Não tem hospital. Tem a gente.`,ch:[['Fazer o parto com quem estiver por perto','g'],['Usar o kit de primeiros socorros','k'],['Rezar e respirar','r']]}; },
  pick:(k,d)=>{ const sc=S.scen; if(!sc) return ''; const c=crewById(d.cid), me=S.me.gender==='F'; if(k==='k') takeItem('@remedio');
    const risk=k==='k'?.08:k==='g'?(hasRole('med')?.06:.15):.2; let t='';
    if(R.chance(risk)){ if(me) scHurt(rnd(15,30)); else if(c){ c.hp=Math.max(1,c.hp-rnd(20,40)); } t='Foi um parto difícil, com muito sangue e muito medo. ';}
    const b=romBaby(d.cid); scStat('san',20); crew().forEach(x=>x.lv=Math.min(100,x.lv+5));
    return `${t}${b.gender==='F'?'Nasceu uma menina':'Nasceu um menino'}: ${b.first}. ${R.pick(['O grupo inteiro chorou.','Ninguém lembrou do perigo por uma noite.','Um choro forte no meio do silêncio. Esperança tem som.'])}`; }};
// ---------- de volta à vida real ----------
function romBring(list){ const m=S.me, out=[]; const par=list.find(c=>c.par);
  if(par){ const old=partner(); if(old){ if(old.rel==='conjuge'&&typeof divorce==='function') divorce(old,true); else old.rel='ex'; log(`Terminei com ${old.first}. Voltei com outra pessoa no coração.`,'warn'); }
    const p=mkPerson({rel:par.par==='casado'?'conjuge':par.par==='noivo'?'noivo':'namoro',gender:par.gender,age:par.age,first:par.first,last:par.last,bond:Math.max(65,par.am||0)}); if(par.genes) p.genes=par.genes; S.people.push(p);
    if(p.rel==='conjuge'){ cnt('marriages'); S.flags.movedOut=1; } out.push(`${par.first} veio comigo para a vida real.`); }
  list.filter(c=>c.filho).forEach(c=>{ const k=mkPerson({rel:'filho',gender:c.gender,age:c.age,first:c.first,last:m.last,bond:95,parentId:par?null:null}); if(c.genes) k.genes=c.genes; S.people.push(k); out.push(`${c.first}, ${c.gender==='F'?'minha filha':'meu filho'}, também.`); });
  if(out.length) log(out.join(' '),'good'); }
scenEnd=(o=>function(win,txt){ const sc=S.scen; const keep=sc&&win?crew().filter(c=>c.par||c.filho):[]; const r=o.apply(this,arguments); if(keep.length&&S.me.alive&&!S.scen) romBring(keep); return r; })(scenEnd);
// ---------- linguagem dos eventos de romance ----------
// am±n (paixão do {c}) · namorar noivar casar terminar (com o {c}) · grav (tenta engravidar com o {c}) · filho (nasce um bebê do casal)
scTok=(o=>function(tok,d,out){ const sc=S.scen; let mm; if(!sc||sc.v!==SC_V) return o(tok,d,out); const c=d&&d.cid?crewById(d.cid):null;
  if(mm=tok.match(/^am([+-]\d+)$/)){ if(c) romAm(c,+mm[1]); return true; }
  if(tok==='namorar'){ if(c&&romOK(c)&&!romPar()){ out.push(`Estou namorando ${c.first}.`+romStart(c)); } return true; }
  if(tok==='noivar'){ if(c&&c.par==='namoro'){ c.par='noivo'; out.push('Estamos noivos!'); } return true; }
  if(tok==='casar'){ if(c&&(c.par==='noivo'||c.par==='namoro')){ c.par='casado'; scStat('san',15); out.push('Estamos casados!'); } return true; }
  if(tok==='terminar'){ if(c&&c.par){ romEnd(c); out.push(`Terminei com ${c.first}.`); } return true; }
  if(tok==='grav'){ if(c&&c.par){ const r=romGrav(c); if(r&&sc.grav) out.push(S.me.gender==='F'?'Estou grávida!':`${c.first} está grávida!`); } return true; }
  if(tok==='filho'){ const p=c&&c.par?c:romPar(); if(p&&romCanBaby(p)){ const b=romBaby(p.id); out.push(`${b.gender==='F'?'Nasceu nossa filha':'Nasceu nosso filho'}, ${b.first}.`); } return true; }
  return o(tok,d,out); })(scTok);

const RW=f=>m=>!!S.scen&&f(S.scen,m);
const romSol=()=>crew().some(c=>romOK(c)&&!c.par);
