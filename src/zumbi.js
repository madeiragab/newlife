// ===== Pesadelo zumbi completo: o apocalipse não tem fim, é sobreviver até morrer =====
// Sistemas: atributos do sobrevivente, sede, munição e barulho, estações do ano, hordas que crescem com o tempo,
// expedições, base com construções e moradores, oficina com receitas, facções com reputação, trocas e roubos.
const ZAT={for:['Força','💪','Luta corpo a corpo'],mir:['Pontaria','🎯','Armas de fogo'],fur:['Furtividade','🥷','Saquear sem ser visto'],
  med:['Medicina','🩺','Curar você e o grupo'],mec:['Mecânica','🔧','Construir, consertar e fabricar'],lid:['Liderança','📣','Moral, recrutamento e trocas']};
Object.assign(SCI,{muni:['Munição','🔹','muni',0],tacop:['Taco com pregos','🏏','arma',24],lancaf:['Lança de ferro','🔱','arma',21],molotov:['Coquetel molotov','🔥','bomba',30],
  curativo:['Curativo improvisado','🩹','remedio',15],roupa:['Roupas de frio','🧥','roupa',0],trap:['Armadilha de urso','🪤','trap',0],colete:['Colete à prova de balas','🦺','colete',0],
  sucata:['Sucata','🔩','mat',0],pilha:['Pilhas','🔋','util',0]});
SCI.agua[2]='agua'; SCI.cantil[2]='agua';
const FIREARMS=['pistola','espingarda','rifle'];
const ZSEASON=[['Verão','☀️'],['Outono','🍂'],['Inverno','❄️'],['Primavera','🌸']];
const zSeason=sc=>Math.floor((sc.dia-1)/20)%4;
const ZB={ // nome, ícone, sucata base, efeito, nível máximo
  muro:['Muros e barricadas','🧱',8,'+12 de defesa por nível',5],torre:['Torre de vigia','🗼',10,'Avisa hordas e +5 de defesa',3],armadilhas:['Armadilhas','🪤',6,'Matam zumbis toda noite, +8 de defesa',4],
  horta:['Horta','🥕',8,'+5 de comida por dia',5],poco:['Poço e cisterna','💧',10,'+6 de água por dia',4],cozinha:['Cozinha comunitária','🍳',10,'Comida rende mais e moral sobe',3],
  alojamento:['Alojamentos','🛏️',10,'+5 vagas de moradores',5],deposito:['Depósito','📦',8,'+10 de espaço para itens',4],enfermaria:['Enfermaria','🏥',12,'Cura você, o grupo e os moradores',3],
  oficina:['Oficina','🔧',12,'Libera receitas avançadas',3],garagem:['Garagem','🚗',12,'Carros não estragam parados',2],radio:['Estação de rádio','📻',14,'Atrai sobreviventes e facções',2],
  gerador:['Gerador','⚡',16,'Luz: moral sobe, mas faz barulho',2],laboratorio:['Laboratório','🧪',20,'Pesquisa da cura e vacinas',3]};
const ZFAC={merc:['Mercadores do Viaduto','🛒','Vendem e compram de tudo. Odeiam confusão.',35],corvos:['Os Corvos','🐦‍⬛','Saqueadores. Atacam quem parece fraco.',45],
  guarda:['Guarda Nacional','🎖️','Restos do exército: ordem, quarentena e armas.',60],igreja:['Igreja da Última Hora','⛪','Um culto que vê os mortos como o juízo final.',30]};
const ZTRADE={ // [dar, quantidade, receber, quantidade]
  merc:[['@comida',2,'muni',3],['@remedio',1,'gas',2],['gas',2,'kit',1],['@arma',1,'@comida',3],['sucata',4,'reparo',1],['@comida',3,'roupa',1],['muni',4,'pistola',1],['@agua',2,'lata',2],['@remedio',2,'espingarda',1],['@comida',1,'pilha',2]],
  guarda:[['@remedio',2,'muni',6],['@comida',3,'racao',2],['gas',2,'colete',1],['@remedio',1,'kit',1],['@comida',4,'rifle',1],['sucata',5,'muni',3]],
  igreja:[['@comida',2,'calm',1],['@comida',2,'livro',1],['@agua',2,'ervas',2],['@arma',1,'kit',1],['@comida',3,'vacina',1]],
  corvos:[['@remedio',2,'gas',3],['muni',3,'@comida',3],['@comida',4,'machado',1],['gas',2,'muni',4]]};
const ZEXP={ // nome, ícone, itens, perigo, especial
  mercado:['Supermercado','🛒',['lata','arroz','miojo','biscoito','agua','agua','sardinha','pessego','doce'],2],farmacia:['Farmácia e hospital','💊',['analg','antib','kit','calm','estim','vacina','curativo'],2],
  posto:['Postos de gasolina','⛽',['gas','gas','gas','barra','agua','salgadinho'],1],quartel:['Delegacia e quartel','🎖️',['pistola','espingarda','muni','muni','muni','colete','racao'],3],
  ferragens:['Loja de ferragens','🔨',['sucata','sucata','chave','facao','machado','corda','reparo','pilha'],1],bairro:['Bairro residencial','🏘️',['lata','agua','analg','roupa','faca','foto','livro','sucata'],1,'surv'],
  ferrovelho:['Ferro-velho','🚘',['sucata','sucata','sucata','reparo','gas'],1,'veh'],shopping:['Shopping','🏬',['roupa','roupa','lanterna','baralho','biscoito','doce','violao','pilha'],2,'surv']};
const ZRECIPES=[ // id, nome, ícone, sucata, itens, oficina mínima, resultado
  ['tacop','Taco com pregos','🏏',2,['taco'],0,'it:tacop'],['lancaf','Lança de ferro','🔱',3,[],0,'it:lancaf'],['curativo','Curativo improvisado','🩹',2,[],0,'it:curativo'],
  ['roupa','Roupas de frio','🧥',3,[],0,'it:roupa'],['aguaf','Filtrar água suja','🫗',1,[],0,'it:agua*2'],['trap','Armadilha de urso','🪤',3,[],0,'it:trap'],
  ['arco','Arco e flechas','🏹',3,['corda'],0,'it:arco'],['molotov','Coquetel molotov','🔥',0,['gas','agua'],0,'it:molotov'],['kit','Kit médico','🩹',1,['analg','agua'],0,'it:kit'],
  ['reparo','Kit de reparo','🧰',4,[],1,'it:reparo'],['besta','Besta','🏹',5,['corda'],1,'it:besta'],['armadura','Armadura de pneu e couro','🛡️',6,[],1,'zarm'],
  ['radio','Rádio de pilha','📻',3,['pilha'],1,'it:radio'],['muni','Recarregar munição','🔹',4,[],2,'it:muni*4'],['silenc','Silenciador','🔇',5,[],2,'silenc'],['vacina','Vacina caseira','🧬',6,['antib'],3,'it:vacina']];
// ---------- ajudantes ----------
const zAt=sc=>sc.zat||(sc.zat={for:5,mir:5,fur:5,med:5,mec:5,lid:5});
function zEnsure(sc){ if(!sc||sc.id!=='zumbi') return; zAt(sc); sc.zlv=sc.zlv||1; sc.zxp=sc.zxp||0; sc.zpts=sc.zpts||0; sc.zmat=sc.zmat||0; sc.ruido=sc.ruido||0; sc.zarm=sc.zarm||0;
  if(sc.sede==null) sc.sede=20; if(!sc.zf) sc.zf={merc:{rep:5},corvos:{rep:-15},guarda:{rep:0},igreja:{rep:0}}; if(!sc.nextHorde) sc.nextHorde=sc.dia+rnd(16,24); sc.rec=sc.rec||0; }
function zXP(n){ const sc=S.scen; if(!sc||sc.id!=='zumbi') return ''; zEnsure(sc); sc.zxp+=n; let t=''; while(sc.zxp>=sc.zlv*60){ sc.zxp-=sc.zlv*60; sc.zlv++; sc.zpts+=2; scStat('hl',6); t=` Subi para o nível ${sc.zlv} de sobrevivente (+2 pontos).`; } if(t) scLog(t.trim(),'good'); return t; }
const zIsGun=x=>x&&FIREARMS.includes(x.id);
const zRep=(sc,f)=>sc.zf&&sc.zf[f]?sc.zf[f].rep:0;
const zRepTxt=r=>r>=60?'Aliado':r>=20?'Amigável':r>-20?'Neutro':r>-60?'Hostil':'Inimigo';
function zNoise(n){ const sc=S.scen; sc.ruido=Math.max(0,Math.min(100,(sc.ruido||0)+n)); }
const zBaseLv=(sc,k)=>sc.zb&&sc.zb.b[k]||0;
function zDef(sc){ const b=sc.zb; if(!b) return 0; return 5+b.b.muro*12+b.b.torre*5+b.b.armadilhas*8+b.pop+crew().filter(c=>c.arma).length*3+(sc.vig?10:0)+(b.extra||0); }
function zCap(sc){ return 4+zBaseLv(sc,'alojamento')*5; }
// ---------- integração com o motor ----------
SCEN.zumbi.d='O mundo acabou e não tem volta. Lidere um grupo de sobreviventes, junte recursos, monte uma base, negocie com as facções e aguente o máximo de dias que conseguir. Não há final feliz: só o seu recorde.';
SCEN.zumbi.intro='O alarme não tocou. O que tocou foi a sirene da cidade inteira. Em uma semana, o mundo acabou. Agora você lidera um pequeno grupo. Não existe resgate. Existe o dia de hoje.';
SCEN.zumbi.maxDays=Infinity;
SCEN.zumbi.tabs=['Local','Bens','Próximo dia','Grupo','Ações']; SCEN.zumbi.tabIc=['📍','🎒','🌅','👥','⚡'];
SCEN.zumbi.stats=[['hl','Saúde','❤️'],['san','Sanidade','🧠'],['fome','Fome','🍗',1],['sede','Sede','💧',1],['moral','Moral do grupo','🤝']];
SCEN.zumbi.hdr=sc=>[`${ZSEASON[zSeason(sc)][1]} ${sc.dia}`,`dias · recorde ${Math.max(sc.rec||0,(META.zrec||0))}`];
SCEN.zumbi.goal=sc=>['Sobreviver',`${sc.dia} dias · ${ZSEASON[zSeason(sc)][0]} · nível ${sc.zlv||1}${sc.zb?' · base '+sc.zb.nome:''}`,Math.min(100,Math.round(sc.dia/((META.zrec||30)+1)*100))];
SCEN.zumbi.init=(i0=>m=>Object.assign(i0(m),{sede:20,zat:{for:5,mir:5,fur:5,med:5,mec:5,lid:5},zlv:1,zxp:0,zpts:0,zmat:4,ruido:10,zarm:0,zb:null,nextHorde:20}))(SCEN.zumbi.init);
SCEN.zumbi.start=(s0=>sc=>{ s0(sc); addItem('muni',null,true); addItem('muni',null,true); addItem('agua',null,true); addItem('roupa',null,true); zEnsure(sc); })(SCEN.zumbi.start);
SCEN.zumbi.pow=(sc,m)=>{ zEnsure(sc); const a=zAt(sc), w=sc.arma, ammo=countCat('muni');
  const mine=!w?4:zIsGun(w)?(ammo?itV(w.id)*(1+a.mir/30):5):itV(w.id)*(.7+a.for/35);
  const cr=crew().filter(c=>!c.bebe).reduce((s,c)=>s+(c.bicho?8:4)+(c.arma?(zIsGun(c.arma)&&!ammo?3:itV(c.arma.id)*.45):1.5)*(c.hp/100),0);
  return 8+a.for*.8+m.fight*.15+mine+cr+sc.zarm*5+(hasRole('ati')?6:0)+(sc.zbuff||0); };
SCEN.zumbi.onEnd=(m,sc)=>{ const d=sc.dia; META.zrec=Math.max(META.zrec||0,d); m.fight=clamp(m.fight+Math.min(10,Math.floor(d/8))); st('happy',Math.min(10,Math.floor(d/10))); cnt('zdias',d); };
// a briga gasta munição e faz barulho
scFight=(o=>function(thr,what){ const sc=S.scen; if(sc&&sc.id==='zumbi'){ zEnsure(sc); const gun=zIsGun(sc.arma)&&countCat('muni')>0; if(gun){ takeItem('muni'); zNoise(sc.silenc?3:8); } else zNoise(2);
    const mol=sc.inv.find(x=>itCat(x.id)==='bomba'); if(mol&&thr>=3){ sc.inv=sc.inv.filter(x=>x!==mol); sc.zbuff=(sc.zbuff||0)+30; scLog('Joguei um coquetel molotov no meio deles.','warn'); }
    thr=Math.min(5,thr+Math.floor(sc.dia/30)); const r=o(thr,what); sc.zbuff=0; if(r.ok) zXP(4+thr*2); return r; } return o(thr,what); })(scFight);
scHurt=(o=>function(n){ const sc=S.scen; if(sc&&sc.id==='zumbi') n=Math.round(n*(1-Math.min(.4,(sc.zarm||0)*.08))); return o(n); })(scHurt);
bagCap=(o=>function(){ const sc=S.scen; if(sc&&sc.id==='zumbi'&&sc.zb) return 25+zBaseLv(sc,'deposito')*10+sc.veh.reduce((s,v)=>s+VEH[v.k][3],0); return o(); })(bagCap);
addItem=(o=>function(id,hp,quiet){ const sc=S.scen; if(sc&&sc.id==='zumbi'&&id==='sucata'){ sc.zmat=(sc.zmat||0)+rnd(2,4); return true; } return o(id,hp,quiet); })(addItem);
lootText=(o=>function(ids){ const sc=S.scen; if(sc&&sc.id==='zumbi'){ const n=ids.filter(i=>i==='sucata').length; const t=o(ids.filter(i=>i!=='sucata')); return n?(t?t.replace(/\.$/,'')+`, ${n} punhado(s) de sucata.`:` Peguei ${n} punhado(s) de sucata.`):t; } return o(ids); })(lootText);
scUse=(o=>function(x){ const sc=S.scen, c=itCat(x.id);
  if(c==='agua'&&!SM().stats.some(s=>s[0]==='sede')){ sc.inv=sc.inv.filter(y=>y!==x); scStat('fome',-Math.round(itV(x.id)/2)); scStat('san',1); return `Bebi ${itN(x.id).toLowerCase()}.`; }
  if(c==='roupa'){ return 'Guardei as roupas de frio. No inverno, elas fazem diferença sozinhas.'; }
  if(c==='colete'){ sc.inv=sc.inv.filter(y=>y!==x); sc.zarm=Math.min(4,(sc.zarm||0)+1); return 'Vesti o colete. Proteção extra.'; }
  if(c==='trap'){ sc.inv=sc.inv.filter(y=>y!==x); sc.trapT=1; return 'Armei a armadilha perto do acampamento. Esta noite, ela trabalha por mim.'; }
  if(c==='bomba') return 'Vou guardar para a próxima briga feia. Ele é usado sozinho quando a coisa aperta.';
  return o(x); })(scUse);
scTok=(o=>function(tok,d,out){ const sc=S.scen; let mm; if(!sc||sc.id!=='zumbi') return o(tok,d,out); zEnsure(sc);
  if(mm=tok.match(/^z(com|agua|mat|pop|moral|def)([+-]\d+)$/)){ const n=+mm[2]; if(mm[1]==='mat'){ sc.zmat=Math.max(0,sc.zmat+n); return true; } const b=sc.zb; if(!b) return true;
    if(mm[1]==='moral') b.moral=Math.max(0,Math.min(100,b.moral+n)); else if(mm[1]==='pop') b.pop=Math.max(0,b.pop+n); else if(mm[1]==='def') b.extra=Math.max(0,(b.extra||0)+n); else b[mm[1]]=Math.max(0,b[mm[1]]+n); return true; }
  if(mm=tok.match(/^ruido([+-]\d+)$/)){ zNoise(+mm[1]); return true; }
  if(mm=tok.match(/^zxp\+(\d+)$/)){ const t=zXP(+mm[1]); if(t) out.push(t.trim()); return true; }
  if(mm=tok.match(/^zat\.(for|mir|fur|med|mec|lid)\+(\d+)$/)){ zAt(sc)[mm[1]]+= +mm[2]; return true; }
  if(mm=tok.match(/^f(merc|corvos|guarda|igreja)([+-]\d+)$/)){ const f=sc.zf[mm[1]]; f.rep=Math.max(-100,Math.min(100,f.rep+ +mm[2])); return true; }
  if(tok==='zb-'){ const b=sc.zb; if(b){ const ks=Object.keys(b.b).filter(k=>b.b[k]>0); if(ks.length){ const k=R.pick(ks); b.b[k]--; out.push(`${ZB[k][0]} foi danificad${ZB[k][0].endsWith('s')?'os':'a'}.`); } } return true; }
  if(tok==='zarm+'){ sc.zarm=Math.min(4,sc.zarm+1); return true; }
  return o(tok,d,out); })(scTok);
scChance=(o=>function(key){ const sc=S.scen; if(sc&&sc.id==='zumbi'){ zEnsure(sc); if(ZAT[key]) return 25+zAt(sc)[key]*2.5; if(key==='zmoral') return sc.zb?sc.zb.moral:50; if(key==='zdef') return Math.min(95,zDef(sc)); const f=key.match(/^f(merc|corvos|guarda|igreja)$/); if(f) return 50+zRep(sc,f[1])/2; } return o(key); })(scChance);
scVar=(o=>function(k){ const sc=S.scen; if(sc&&sc.id==='zumbi'){ if(k==='base') return sc.zb?sc.zb.nome:'o acampamento'; if(k==='estacao') return ZSEASON[zSeason(sc)][0].toLowerCase(); } return o(k); })(scVar);
// ---------- o dia a dia ----------
function zFoundBase(nome){ const sc=S.scen, l=sc.loc; const bonus=/Fazenda/.test(l.n)?{horta:1,poco:1}:/militar/.test(l.n)?{muro:2}:/Delegacia/.test(l.n)?{muro:1}:/Hospital/.test(l.n)?{enfermaria:1}:/Shopping|Supermercado/.test(l.n)?{deposito:1}:/Escola/.test(l.n)?{alojamento:1}:{};
  sc.zb={nome,lugar:l.n,ic:l.ic,pop:0,moral:60,com:10,agua:10,racao:1,portas:1,b:Object.assign(Object.fromEntries(Object.keys(ZB).map(k=>[k,0])),bonus),dia:sc.dia}; sc.stay=1;
  scLog(`Montamos a base "${nome}" em ${l.n.toLowerCase()}.`,'good'); cnt('zbase'); }
function zSurroundings(sc){ const keys=Object.keys(Z_POI); const thr=Math.min(4,R.wpick([[0,2],[1,4],[2,3],[3,2],[4,1]])+Math.floor(sc.ruido/45));
  return {n:`Arredores de ${sc.zb.nome}`,ic:'🏚️',thr,pois:R.shuffle(keys).slice(0,3).map(k=>({k,done:0}))}; }
SCEN.zumbi.upkeep=(u0=>sc=>{ zEnsure(sc); const se=zSeason(sc), b=sc.zb;
  if(b) sc.stay=1; u0(sc); if(!S.scen) return; if(b){ sc.loc=zSurroundings(sc); sc.veh.forEach(v=>{ if(zBaseLv(sc,'garagem')) v.hp=Math.min(100,v.hp+2); }); }
  // sede e estação
  scStat('sede',(se===0?14:10)); if(sc.sede>=100){ scHurt(12); scLog('Sede de verdade. A boca racha.','bad'); }
  if(sc.sede>=75){ const a=takeItem('@agua'); if(a){ scStat('sede',-itV(a.id)); scLog(`Bebi ${itN(a.id).toLowerCase()}.`); } else if(b&&b.agua>0){ b.agua--; scStat('sede',-30); } }
  if(b&&sc.fome>=50&&b.com>0){ b.com--; scStat('fome',-30); }
  crew().slice().forEach(c=>{ if(!R.chance(.4)) return; if(!takeItem('@agua')&&!(b&&b.agua>0&&b.agua--)) c.lv-=4; });
  if(se===2&&!sc.inv.some(x=>x.id==='roupa')&&!(b&&b.b.alojamento)){ scHurt(4); scStat('san',-2); if(R.chance(.4)) scLog('O frio do inverno corta até os ossos. Preciso de roupas de frio.','warn'); }
  if(se===0&&R.chance(.15)) scLog('Calor brutal. A água some rápido.','warn');
  if(se===3&&b) b.com+=b.b.horta*2;
  // a base produz e consome
  if(b){ const ppl=b.pop+crew().length, rac=[.6,1,1.3][b.racao];
    b.com+=Math.round(b.b.horta*5*(1+b.b.cozinha*.15)); b.agua+=b.b.poco*6+(R.chance(.25)?rnd(3,8):0); sc.zmat+=Math.floor(b.pop/3);
    b.com-=Math.ceil(b.pop*rac*.6); b.agua-=Math.ceil(b.pop*.6);
    let mo=[-4,0,3][b.racao]+b.b.cozinha+(b.b.gerador?2:0)-(b.pop>zCap(sc)?4:0);
    if(b.com<0){ b.com=0; mo-=10; if(b.pop>0&&R.chance(.5)){ b.pop--; scLog(`Faltou comida em ${b.nome}. Um morador foi embora.`,'bad'); } }
    if(b.agua<0){ b.agua=0; mo-=10; if(b.pop>0&&R.chance(.5)){ b.pop--; scLog(`Faltou água em ${b.nome}. Um morador foi embora.`,'bad'); } }
    b.moral=Math.max(0,Math.min(100,b.moral+mo)); if(b.moral<20&&b.pop>0&&R.chance(.35)){ b.pop--; scLog('Um morador desistiu de nós.','warn'); }
    if(b.portas<2&&b.moral>=45&&b.pop<zCap(sc)&&R.chance([.3,.15][b.portas]+b.b.radio*.08)){ b.pop++; scLog(`Uma pessoa chegou pedindo para morar em ${b.nome}.`); }
    if(sc.fome<60&&sc.sede<70) scStat('hl',3);
    if(b.moral>=50) scStat('san',2+b.b.cozinha); else if(b.moral>=30) scStat('san',1);
    if(b.b.enfermaria){ scStat('hl',b.b.enfermaria*3); crew().forEach(c=>c.hp=Math.min(100,c.hp+b.b.enfermaria*5)); }
    if(b.b.armadilhas) sc_kill(b.b.armadilhas*rnd(0,2)); if(b.b.gerador) zNoise(4*b.b.gerador);
    if(b.b.laboratorio) sc.cure=Math.min(100,(sc.cure||0)+b.b.laboratorio*.5+zAt(sc).med*.05);
    b.extra=Math.max(0,(b.extra||0)-3);
    if(R.chance(.12+sc.ruido/300)&&sc.dia!==sc.nextHorde){ const atk=rnd(5,22)+sc.dia*.4+sc.ruido/5, d=zDef(sc);
      if(d>=atk){ sc_kill(rnd(3,10)); b.moral=Math.min(100,b.moral+3); scLog(`Zumbis bateram nos muros de ${b.nome} de madrugada. Aguentamos.`,'warn'); }
      else { const lost=Math.min(b.pop,rnd(0,2)); b.pop-=lost; scHurt(rnd(5,12)); b.moral=Math.max(0,b.moral-10); if(R.chance(.4)){ const ks=Object.keys(b.b).filter(k=>b.b[k]>0); if(ks.length){ const k=R.pick(ks); b.b[k]--; } } scLog(`Zumbis invadiram parte de ${b.nome}.${lost?` Perdemos ${lost} morador(es).`:''}`,'bad'); } } }
  // a grande horda: cada vez maior
  if(sc.dia===sc.nextHorde-1&&(zBaseLv(sc,'torre')||sc.inv.some(x=>x.id==='radio'))) scLog('A torre avistou: uma grande horda chega amanhã.','bad');
  if(sc.dia>=sc.nextHorde){ sc.nextHorde=sc.dia+rnd(16,24); queue('z_horda',{}); }
  if(sc.trapT){ sc.trapT=0; sc_kill(rnd(1,3)); }
  // facções
  const f=sc.zf; if(zRep(sc,'corvos')<=-30&&R.chance(.08)) queue('z_corvos',{}); Object.values(f).forEach(x=>{ x.rep+=x.rep>0?-.3:x.rep<0?.3:0; });
  if(zRep(sc,'merc')>=60&&R.chance(.15)){ addItem(R.pick(['lata','agua','muni','kit'])); scLog('Os Mercadores mandaram um presente de aliado.','good'); }
  if(zRep(sc,'guarda')>=60&&b) b.extra=(b.extra||0)+10;
  zNoise(-8); sc.rec=Math.max(sc.rec||0,sc.dia); zXP(3); })(SCEN.zumbi.upkeep);
// o Porto Seguro deixa de ser um final: é um lugar para morar
EVENTS.z_final={scen:'zumbi',show:()=>({k:'Pesadelo zumbi',t:'O Porto Seguro',x:'A ponte para a ilha está na sua frente. Lá dentro existe uma comunidade de verdade, com muros, horta e enfermaria. Os soldados aceitam vocês, se aceitarem as regras deles.',ch:[['Entrar e fazer do Porto Seguro a sua base','m'],['Trocar suprimentos e seguir na estrada','t'],['Seguir em frente sem parar','s']]}),
  pick:k=>{ const sc=S.scen; if(!sc) return ''; zEnsure(sc);
    if(k==='m'){ if(sc.zb) return 'Já temos uma base. Mas agora sabemos que o Porto Seguro existe.'; zFoundBase('Porto Seguro'); Object.assign(sc.zb.b,{muro:3,horta:2,poco:2,enfermaria:1,alojamento:3}); sc.zb.pop=12; sc.zb.com=40; sc.zb.agua=40; sc.zf.guarda.rep+=30; return 'O Porto Seguro virou nossa casa. Ainda é o fim do mundo, mas agora com muros.'; }
    if(k==='t'){ addItem('racao'); addItem('kit'); addItem('muni'); sc.zf.guarda.rep+=10; return 'Trocamos o que dava e voltamos para a estrada. Liberdade custa caro.'; }
    return 'Passamos reto. Ninguém do grupo quis explicar por quê.'; }};
EVENTS.z_horda={scen:'zumbi',show:()=>{ const sc=S.scen; return {k:'Pesadelo zumbi',t:'A grande horda',x:`Milhares de mortos andando como uma maré. ${sc&&sc.zb?`Vão passar por ${sc.zb.nome}.`:'Vão passar exatamente por onde vocês estão.'}`,ch:sc&&sc.zb?[['Defender a base','d'],['Fugir com o que der','f'],['Esconder todo mundo em silêncio','s']]:[['Lutar','d'],['Fugir de carro','f'],['Esconder em silêncio','s']]}; },
  pick:k=>{ const sc=S.scen; if(!sc) return ''; zEnsure(sc); const str=40+sc.dia*1.1+sc.ruido/3, b=sc.zb;
    if(k==='d'){ const d=b?zDef(sc)+scPow()/2:scPow(); if(R.chance(Math.max(.08,Math.min(.92,.5+(d-str)/80)))){ sc_kill(rnd(20,60)); zXP(30); if(b) b.moral=Math.min(100,b.moral+15); return 'Foi a noite mais longa da minha vida. Quando o sol nasceu, os mortos estavam empilhados nos muros. Ainda estamos aqui.'; }
      scHurt(rnd(20,35)); if(b){ b.pop=Math.max(0,b.pop-rnd(2,5)); b.moral=Math.max(0,b.moral-20); ['muro','torre','horta'].forEach(x=>{ if(b.b[x]&&R.chance(.6)) b.b[x]--; }); } if(crew().length&&R.chance(.5)){ const c=R.pick(crew()); crewLeave(c,'',true); return `A horda rompeu as defesas. Perdemos ${c.first} e muito mais.`; } return 'A horda rompeu as defesas. Sobrevivemos, mas o preço foi alto.'; }
    if(k==='f'){ if(b&&R.chance(.5)){ const lost=Math.ceil(b.pop/2); b.pop-=lost; b.moral=Math.max(0,b.moral-15); return `Fugimos e voltamos dois dias depois. ${lost} moradores não voltaram.`; } if(!b&&sc.veh.length) return 'Pisamos fundo e deixamos a horda para trás.'; scHurt(rnd(10,20)); return 'Corremos sem olhar para trás. Nem todos os itens vieram junto.'; }
    if(R.chance(.35+zAt(sc).fur*.02-sc.ruido/250)){ zXP(15); return 'Ninguém respirou alto por seis horas. A horda passou ao lado, como um rio. Nem nos viram.'; }
    scHurt(rnd(15,25)); return 'Alguém tossiu. A horda virou na nossa direção.'; }};
EVENTS.z_corvos={scen:'zumbi',show:()=>({k:'Pesadelo zumbi',t:'Os Corvos atacam',x:'Os saqueadores chegaram atirando. Querem tudo o que vocês têm.',ch:[['Revidar','r'],['Entregar parte dos suprimentos','e'],['Negociar uma trégua','n']]}),
  pick:k=>{ const sc=S.scen; if(!sc) return ''; zEnsure(sc);
    if(k==='r'){ const f=scFight(4,'O tiroteio'); if(f.ok){ sc.zf.corvos.rep-=10; addItem('muni'); addItem('gas'); return 'Os Corvos recuaram deixando munição e gasolina para trás.'; } return f.t; }
    if(k==='e'){ for(let i=0;i<3;i++) takeItem('@comida'); takeItem('gas'); sc.zf.corvos.rep+=15; return 'Levaram comida e gasolina. Pelo menos foram embora.'; }
    if(R.chance(.3+zAt(sc).lid*.02)){ sc.zf.corvos.rep+=25; return 'Conversei com o líder deles. Acordo de não agressão, por enquanto.'; } scHurt(12); return 'A conversa acabou num soco na minha cara.'; }};
// ---------- ações ----------
function zScav(kind){ const sc=S.scen; zEnsure(sc); const a=zAt(sc), thr=sc.loc.thr;
  const T={comida:['comida',['lata','miojo','biscoito','sardinha','arroz','pessego','barra']],agua:['água',['agua','agua','cantil']],remedio:['remédios',['analg','curativo','antib','kit']],
    gas:['combustível',['gas','gas']],armas:['armas e munição',['muni','muni','faca','taco','facao','pistola']],mat:['materiais',['sucata','sucata','sucata','corda','pilha']]}[kind];
  if(R.chance(.05+thr*.05-a.fur*.006)){ const f=scFight(thr,'Um bando de zumbis'); if(!f.ok) return `Procurando ${T[0]}, fui cercad${oa()}. ${f.t}`; }
  const n=rnd(1,2)+(a.fur>=12?1:0)+(R.chance(.3)?1:0), got=[]; for(let i=0;i<n;i++) if(R.chance(.7)) got.push(R.pick(T[1])); zNoise(1); zXP(5);
  return got.length?`Procurei ${T[0]} pela vizinhança.`+lootText(got):`Procurei ${T[0]} o dia todo. Já tinham levado tudo.`; }
function zExpedition(k){ const sc=S.scen; zEnsure(sc); const e=ZEXP[k], a=zAt(sc), car=sc.veh.length&&countCat('gas')>0; if(car) takeItem('gas');
  const thr=Math.min(5,e[3]+Math.floor(sc.dia/35)); let t=`${e[1]} Expedição: ${e[0].toLowerCase()}. `;
  if(R.chance(.15+thr*.1-a.fur*.008)){ const f=scFight(thr,'A expedição'); if(!f.ok) return t+f.t; t+='Teve briga, mas voltamos inteiros. '; }
  const n=rnd(3,5)+(car?2:0)+(a.fur>=12?1:0), got=[]; for(let i=0;i<n;i++) got.push(R.pick(e[2]));
  if(e[4]==='surv'&&R.chance(.25)){ if(sc.zb&&R.chance(.6)){ sc.zb.pop++; t+='Uma família escondida veio morar na base. '; } else { const c=mkCrew(); t+=`${c.first} se juntou ao grupo. `; } }
  if(e[4]==='veh'&&R.chance(.25)){ const kk=R.pick(['sedan','van','picape','kombi','jipe']); sc.veh.push({k:kk,hp:rnd(30,70)}); t+=`Consertamos ${VEH[kk][0].toLowerCase()} no ferro-velho! `; }
  zNoise(car?6:2); zXP(12); return t+lootText(got).trim(); }
function zCraft(r){ const sc=S.scen; zEnsure(sc); const [id,n,ic,mat,items,ofc,res]=r; sc.zmat-=mat; items.forEach(i=>takeItem(i)); zXP(6);
  let mm; if(mm=res.match(/^it:(\w+)(?:\*(\d+))?$/)){ for(let i=0;i<+(mm[2]||1);i++) addItem(mm[1],rnd(70,100),true); }
  else if(res==='zarm') sc.zarm=Math.min(4,sc.zarm+1); else if(res==='silenc') sc.silenc=1;
  const bonus=zAt(sc).mec>=15&&R.chance(.3)?' Ficou tão bom que sobrou material.':''; if(bonus) sc.zmat+=Math.ceil(mat/2);
  return `${ic} Fabriquei: ${n.toLowerCase()}.${bonus}`; }
const ZACTS={
  procurar:{ic:'🔎',l:'Procurar recursos',s:'Comida, água, remédios, combustível, armas, materiais',ap:0,menu:true},
  expedicao:{ic:'🗺️',l:'Expedição',s:'Ir longe atrás de muito saque · 2 de energia',ap:0,menu:true},
  oficina:{ic:'🔧',l:'Oficina',s:'Fabricar armas, munição, remédios e armaduras',ap:0,menu:true},
  faccoes:{ic:'📻',l:'Facções e trocas',s:'Mercadores, Corvos, Guarda Nacional, Igreja',ap:0,menu:true},
  base:{ic:'🏚️',l:'Base',s:'Construções, moradores e estoque',ap:0,menu:true},
  ficha:{ic:'🧍',l:'Ficha do sobrevivente',s:'Nível e atributos',ap:0,menu:true},
  cacaranim:{ic:'🦌',l:'Caçar animais',s:'Carne fresca · pontaria ou força',fn:sc=>{ const a=zAt(sc); if(pct(.35+(a.mir+a.for)/80)){ addItem('lata'); addItem('lata'); zXP(6); zNoise(zIsGun(sc.arma)?5:1); return 'Abati um veado. Carne para dois dias, salgada e guardada.'; } return 'Os bichos sentiram meu cheiro antes de eu sentir o deles.'; }},
  pescar:{ic:'🎣',l:'Pescar no rio',s:'Comida silenciosa',fn:sc=>{ if(pct(.45+zAt(sc).fur/60)){ addItem('sardinha'); if(R.chance(.5)) addItem('sardinha'); zXP(4); return 'Peixe de rio, assado na brasa. Silêncio total.'; } return 'Nenhum peixe. Só um tênis velho.'; }},
  chuva:{ic:'🌧️',l:'Coletar e filtrar água',s:'Água limpa',fn:sc=>{ const n=zSeason(sc)===0?1:2; for(let i=0;i<n;i++) addItem('agua',90,true); if(sc.zb) sc.zb.agua+=3; return `Juntei água da chuva e filtrei com carvão e pano: ${n} garrafa(s)${sc.zb?' e mais um pouco para a cisterna':''}.`; }},
  patrulha:{ic:'🚶',l:'Patrulhar a área',s:'Diminui a ameaça e o barulho',fn:sc=>{ const f=scFight(Math.max(0,sc.loc.thr-1),'A patrulha'); if(f.ok){ sc.loc.thr=Math.max(0,sc.loc.thr-1); zNoise(-10); return `Patrulhei os quarteirões em volta. Ameaça agora: ${THREAT[sc.loc.thr].toLowerCase()}.`; } return f.t; }},
  armadilha:{ic:'🪤',l:'Montar armadilhas',s:'Menos ataques esta noite · mecânica',fn:sc=>{ sc.trapT=1; sc.vig=1; zXP(4); if(sc.zb) sc.zb.extra=(sc.zb.extra||0)+5; return 'Arame, latas e estacas. Se algo chegar perto, vamos saber.'; }},
  esconder:{ic:'🍃',l:'Apagar rastros e fazer silêncio',s:'Barulho cai bastante',fn:sc=>{ zNoise(-25); zXP(3); return 'Apagamos o fogo, cobrimos as janelas e falamos só por gestos. O mundo lá fora esqueceu da gente.'; }},
  tratar:{ic:'🩺',l:'Tratar os feridos',s:'Medicina cura o grupo',fn:sc=>{ const a=zAt(sc), v=6+a.med; crew().forEach(c=>c.hp=Math.min(100,c.hp+v)); scStat('hl',Math.round(v/2)); zXP(4); return `Limpei feridas, troquei curativos e costurei o que dava: +${v} de saúde para o grupo.`; }},
  consertar:{ic:'🔧',l:'Consertar os veículos',s:'Mecânica · usa sucata',min:sc=>sc.veh.some(v=>v.hp<100)&&sc.zmat>=2,why:'Nada para consertar, ou falta sucata.',fn:sc=>{ sc.zmat-=2; const v=10+zAt(sc).mec*2; sc.veh.forEach(x=>x.hp=Math.min(100,x.hp+v)); zXP(4); return `Graxa até o cotovelo: +${v}% em todos os carros.`; }},
  ensinar:{ic:'📣',l:'Treinar o grupo',s:'Liderança · lealdade de todos',min:sc=>crew().length>0,why:'Não tenho grupo.',fn:sc=>{ const v=3+Math.round(zAt(sc).lid/3); crew().forEach(c=>c.lv=Math.min(100,c.lv+v)); if(sc.zb) sc.zb.moral=Math.min(100,sc.zb.moral+v); zXP(4); return 'Treinamos rotas de fuga, sinais e tiro. O grupo sai daqui mais unido.'; }},
  ler:{ic:'📖',l:'Ler e escrever no diário',s:'Sanidade',fn:sc=>{ scStat('san',rnd(6,10)); return R.pick(['Escrevi sobre o dia em que tudo começou. Doeu menos do que eu esperava.','Li um livro velho de receitas. Sonhei com lasanha.','Desenhei o mapa da região de memória.']); }},
  pesquisa:{ic:'🧪',l:'Pesquisar a cura',s:'Laboratório na base · medicina',min:sc=>zBaseLv(sc,'laboratorio')>0,why:'Preciso de um laboratório na base.',fn:sc=>{ const v=rnd(3,6)+Math.round(zAt(sc).med/4)+zBaseLv(sc,'laboratorio')*2; sc.cure=Math.min(100,(sc.cure||0)+v); zXP(8); if(sc.cure>=100&&!sc.curaOk){ sc.curaOk=1; addItem('vacina'); addItem('vacina'); return 'CONSEGUIMOS. Uma vacina que funciona! Os mortos continuam lá fora, mas mordida deixou de ser sentença de morte.'; } return `Microscópio, amostras e muita paciência: pesquisa da cura em ${Math.round(sc.cure)}%.`; }},
};
Object.entries(ZACTS).forEach(([k,a])=>{ if(!a.menu) SCEN.zumbi.acts[k]=a; });
// ---------- telas ----------
V.zMe=()=>{ const sc=S.scen, m=S.me; zEnsure(sc); const a=zAt(sc), need=sc.zlv*60;
  const it=[{html:`<div class="card" style="display:flex;gap:12px;align-items:center">${faceSVG(m,64)}<div style="flex:1"><p><b>${esc(m.first)}</b> · sobrevivente nível ${sc.zlv}</p>${bar('Experiência',Math.round(sc.zxp/need*100))}<p style="color:var(--muted);font-size:12.5px">${sc.dia} dias vivo · recorde ${Math.max(sc.rec||0,META.zrec||0)} · ${sc.kills||0} zumbis abatidos · força de combate ${scPow()}</p></div></div>`},
    {sec:sc.zpts?`Atributos · ${sc.zpts} ponto(s) para distribuir`:'Atributos'}];
  Object.entries(ZAT).forEach(([k,[n,ic,d]])=>it.push({ic,l:`${n}: ${a[k]}`,s:d,r:sc.zpts?'＋':'',dis:!sc.zpts,why:'Ganhe experiência sobrevivendo, lutando e saqueando.',on:()=>{ sc.zpts--; a[k]++; UI.refresh(); render(); }}));
  it.push({sec:'Equipamento'},{ic:'⚔️',l:'Trocar de arma',s:sc.arma?`${itN(sc.arma.id)} (${sc.arma.hp}%)${zIsGun(sc.arma)?' · '+countCat('muni')+' de munição':''}`:'Nenhuma',on:()=>UI.push(V.scMe)},
    {ic:'🛡️',l:'Proteção',s:['Nenhuma','Improvisada','Reforçada','Pesada','Blindada'][sc.zarm||0]+(sc.silenc?' · arma com silenciador':''),dis:true,why:'Fabrique armaduras na oficina ou troque por coletes.'});
  return {title:'Ficha do sobrevivente',items:it}; };
V.zScav=()=>{ const sc=S.scen; zEnsure(sc); const it=[{html:`<div class="card"><p style="color:var(--muted);font-size:13px">Perto daqui, 1 de energia cada, uma vez por dia. Furtividade (${zAt(sc).fur}) ajuda a não ser vist${oa()} e a achar mais.</p>${kv('Ameaça agora',THREAT[sc.loc.thr])}</div>`}];
  [['comida','🥫','Procurar comida'],['agua','💧','Procurar água'],['remedio','💊','Procurar remédios'],['gas','⛽','Procurar combustível'],['armas','🔫','Procurar armas e munição'],['mat','🔩','Procurar materiais']].forEach(([k,ic,l])=>{ const done=sc.done['zs_'+k];
    it.push({ic,l,r:done?'✓':'⚡',dis:done||sc.ap<1,why:done?'Já procurei isso hoje.':'Sem energia hoje.',on:()=>scAct(()=>{ sc.ap--; sc.done['zs_'+k]=1; return zScav(k); },l)}); });
  return {title:'Procurar recursos',items:it}; };
V.zExp=()=>{ const sc=S.scen; zEnsure(sc); const done=!!sc.done.zexp, car=sc.veh.length&&countCat('gas')>0;
  const it=[{html:`<div class="card"><p style="color:var(--muted);font-size:13px">Uma expedição por dia, 2 de energia. ${car?'Com carro (gasta 1 galão): mais carga.':'A pé: menos carga.'} Quanto mais dias passam, mais perigoso fica.</p></div>`}];
  Object.entries(ZEXP).forEach(([k,e])=>it.push({ic:e[1],l:e[0],s:`Perigo ${'★'.repeat(Math.min(5,e[3]+Math.floor(sc.dia/35)))}`,r:done?'✓':'⚡⚡',dis:done||sc.ap<2,why:done?'Já fizemos uma expedição hoje.':'Preciso de 2 de energia.',on:()=>scAct(()=>{ sc.ap-=2; sc.done.zexp=1; return zExpedition(k); },e[0])}));
  return {title:'Expedição',items:it}; };
V.zCraft=()=>{ const sc=S.scen; zEnsure(sc); const ofc=zBaseLv(sc,'oficina'), have=id=>sc.inv.some(x=>x.id===id);
  const it=[{html:`<div class="card">${kv('Sucata',sc.zmat)}${kv('Oficina',ofc?'nível '+ofc:'improvisada (sem base)')}<p style="color:var(--muted);font-size:12.5px">Fabricar não gasta energia, mas cada receita só uma vez por dia. Mecânica alta pode sobrar material.</p></div>`},{sec:'Receitas'}];
  ZRECIPES.forEach(r=>{ const [id,n,ic,mat,items,lv]=r, miss=items.filter(i=>!have(i)), lock=ofc<lv, done=sc.done['zc_'+id];
    it.push({ic:lock?'🔒':ic,l:n,s:`${mat} de sucata${items.length?' + '+items.map(itN).join(' + ').toLowerCase():''}${lv?` · oficina ${lv}`:''}`,r:done?'✓':'',dis:lock||done||sc.zmat<mat||miss.length>0,
      why:lock?`Precisa de oficina nível ${lv} na base.`:done?'Já fabriquei isso hoje.':sc.zmat<mat?'Falta sucata.':`Falta: ${miss.map(itN).join(', ').toLowerCase()}.`,on:()=>scAct(()=>{ sc.done['zc_'+id]=1; return zCraft(r); },n)}); });
  return {title:'Oficina',items:it}; };
V.zFac=()=>{ const sc=S.scen; zEnsure(sc); const it=[{html:'<div class="card"><p style="color:var(--muted);font-size:13px">Cada facção lembra do que você fez. Reputação alta abre trocas melhores e alianças; baixa traz ataques.</p></div>'}];
  Object.entries(ZFAC).forEach(([k,f])=>{ const r=Math.round(zRep(sc,k)); it.push({ic:f[1],l:f[0],s:`${zRepTxt(r)} (${r}) · ${f[2]}`,bars:[['🤝',Math.round((r+100)/2),r>=20?'#3BB273':r>-20?'#F2A93B':'#E5484D']],on:()=>UI.push(()=>V.zFacOne(k))}); });
  return {title:'Facções',items:it}; };
V.zFacOne=k=>{ const sc=S.scen, f=ZFAC[k], fr=sc.zf[k], r=fr.rep, a=zAt(sc); const once=x=>!!sc.done['zf_'+k+x], al=fr.ally;
  const it=[{html:`<div class="card"><p><b>${f[1]} ${f[0]}</b></p>${bar('Reputação',Math.round((r+100)/2))}<p style="color:var(--muted);font-size:13px">${zRepTxt(Math.round(r))}${al?' · aliados':''} · ${f[2]}</p></div>`},{sec:'Trocas de hoje'}];
  if(r<=-20) it.push({html:'<div class="card"><p style="color:var(--muted)">Eles não negociam com você.</p></div>'});
  else { const pool=ZTRADE[k], seed=sc.dia; const offers=pool.filter((x,i)=>((i*7+seed*3)%pool.length)<4);
    offers.forEach((o,i)=>{ const [g,gn,t,tn]=o, has=g[0]==='@'?sc.inv.filter(x=>itCat(x.id)===g.slice(1)).length:g==='sucata'?sc.zmat:sc.inv.filter(x=>x.id===g).length, gl=g[0]==='@'?{'@comida':'comida','@remedio':'remédio','@arma':'arma','@agua':'água'}[g]:g==='sucata'?'sucata':itN(g).toLowerCase(), tl=t[0]==='@'?{'@comida':'comida variada'}[t]:itN(t).toLowerCase(), done=once('t'+i);
      it.push({ic:t[0]==='@'?'🥫':itIc(t),l:`Receber ${tn}× ${tl}`,s:`Dar ${gn}× ${gl}${r>=60?' · desconto de aliado':''}`,r:done?'✓':'',dis:done||has<(r>=60?Math.max(1,gn-1):gn),why:done?'Já fizemos essa troca hoje.':`Preciso de ${gn}× ${gl}.`,
        on:()=>scAct(()=>{ sc.done['zf_'+k+'t'+i]=1; const n=r>=60?Math.max(1,gn-1):gn; for(let j=0;j<n;j++){ if(g==='sucata') sc.zmat--; else takeItem(g); } for(let j=0;j<tn;j++) addItem(t==='@comida'?R.pick(['lata','arroz','miojo']):t,rnd(70,100),true); fr.rep=Math.min(100,fr.rep+2); zXP(3); return `Troca feita com ${f[0]}: recebi ${tn}× ${tl}.`; },f[0])}); }); }
  it.push({sec:'Ações'});
  it.push({ic:'🤝',l:'Fazer uma missão para eles',s:'Reputação e recompensa · 1 de energia',dis:r<=-20||once('m')||sc.ap<1,why:r<=-20?'Não confiam em você.':once('m')?'Já fiz uma missão hoje.':'Sem energia.',on:()=>scAct(()=>{ sc.done['zf_'+k+'m']=1; sc.ap--; const fi=scFight(2,'A missão'); if(!fi.ok) return fi.t; fr.rep=Math.min(100,fr.rep+rnd(8,15)); const rew={merc:['muni','gas','kit'],guarda:['muni','muni','racao'],igreja:['calm','kit','agua'],corvos:['gas','muni','facao']}[k]; rew.forEach(x=>addItem(x,null,true)); zXP(15); return `${R.pick(['Escoltei uma carga','Limpei um prédio para eles','Recuperei um rádio perdido','Busquei remédios num hospital'])}. ${f[0]} pagou com ${rew.map(itN).join(', ').toLowerCase()}.`; },f[0])});
  it.push({ic:'🙏',l:'Pedir ajuda',s:'Só com boa reputação',dis:r<40||once('p'),why:r<40?'Ainda não somos tão próximos.':'Já pedi hoje.',on:()=>scAct(()=>{ sc.done['zf_'+k+'p']=1; fr.rep-=5; ['lata','agua','kit'].forEach(x=>addItem(x,null,true)); return `${f[0]} mandou comida, água e um kit. "Não se acostume."`; },f[0])});
  it.push({ic:'🥷',l:'Roubar o acampamento deles',s:`Furtividade ${a.fur} · reputação despenca se descobrirem`,tone:'bad',dis:once('r')||sc.ap<1,why:once('r')?'Já tentei hoje.':'Sem energia.',on:()=>scAct(()=>{ sc.done['zf_'+k+'r']=1; sc.ap--; S.me.karma=clamp(S.me.karma-4);
    if(pct(.3+a.fur/40-f[3]/200)){ const loot=R.shuffle(['muni','muni','gas','kit','lata','arroz','pistola','reparo','antib']).slice(0,rnd(3,5)); fr.rep-=R.chance(.4)?25:5; zXP(10); return `Entrei de madrugada e saí sem ninguém ver.`+lootText(loot); }
    fr.rep-=35; const fi=scFight(3,'Os guardas deles'); return 'Me pegaram no meio do roubo. '+(fi.ok?'Saí na porrada, de mãos vazias.':fi.t); },f[0])});
  it.push({ic:'💥',l:'Atacar o acampamento',s:'Guerra aberta · muito saque se vencer',tone:'bad',dis:once('a')||sc.ap<2,why:once('a')?'Já atacamos hoje.':'Preciso de 2 de energia.',on:()=>confirmBox('Atacar?',`Declarar guerra contra ${f[0]}?`,'Atacar',()=>scAct(()=>{ sc.done['zf_'+k+'a']=1; sc.ap-=2; fr.rep=-80; fr.ally=0;
    if(pct(.2+(scPow()-f[3])/90)){ ['muni','muni','muni','gas','gas','kit','racao','espingarda'].forEach(x=>addItem(x,null,true)); sc.zmat+=10; zXP(30); Object.keys(sc.zf).filter(x=>x!==k).forEach(x=>sc.zf[x].rep+=k==='corvos'?10:-10); return `Tomamos o acampamento de ${f[0]}. Armas, gasolina, comida: tudo nosso.`; }
    scHurt(rnd(20,35)); if(crew().length&&R.chance(.4)){ const c=R.pick(crew()); crewLeave(c,'',true); return `O ataque fracassou. Perdemos ${c.first}.`; } return 'O ataque fracassou. Voltamos sangrando.'; },f[0]))});
  it.push({ic:'🕊️',l:al?'Aliança firmada':'Propor aliança',s:al?'Presentes, ajuda na defesa e trocas com desconto':'Precisa de reputação 60+',dis:al||r<60||once('al'),why:al?'Já somos aliados.':'Reputação baixa demais.',on:()=>scAct(()=>{ sc.done['zf_'+k+'al']=1; if(pct(.4+a.lid/40)){ fr.ally=1; fr.rep=Math.min(100,fr.rep+10); return `${f[0]} aceitou a aliança. Pela primeira vez, alguém lá fora está do nosso lado.`; } return 'Disseram que vão pensar.'; },f[0])});
  return {title:f[0],items:it}; };
V.zBase=()=>{ const sc=S.scen; zEnsure(sc); const b=sc.zb, it=[];
  if(!b){ it.push({html:`<div class="card"><p>Ainda vivemos na estrada. Com uma base, o grupo para de viajar: dá para plantar, juntar água, receber moradores e construir defesas. Mas hordas e saqueadores vão saber onde vocês estão.</p>${kv('Aqui',sc.loc.n)}</div>`});
    it.push({ic:'🏚️',l:'Montar a base aqui',s:'Vira nosso lar fixo · você escolhe o nome',on:()=>vilaNamePromptZ()}); return {title:'Base',items:it}; }
  const once=k=>!!sc.done['zb_'+k], sg=n=>(n>=0?'+':'')+n, ppl=b.pop+crew().length;
  it.push({html:`<div class="card"><p><b>${b.ic} ${esc(b.nome)}</b> · ${esc(b.lugar)}</p>${kv('Moradores',`${b.pop} de ${zCap(sc)} (mais ${crew().length} no grupo)`)}${bar('Moral da base',Math.round(b.moral))}${kv('🥫 Comida',`${b.com} (${sg(b.b.horta*5-Math.ceil(b.pop*[.6,1,1.3][b.racao]*.6))}/dia)`)}${kv('💧 Água',`${b.agua} (${sg(b.b.poco*6-Math.ceil(b.pop*.6))}/dia)`)}${kv('🔩 Sucata',sc.zmat)}${kv('🛡️ Defesa',zDef(sc))}${kv('🔊 Barulho',Math.round(sc.ruido)+'%')}${kv('🧪 Cura',Math.round(sc.cure||0)+'%')}${kv('Próxima grande horda',zBaseLv(sc,'torre')?(sc.nextHorde-sc.dia<=0?'chegando':`em ${sc.nextHorde-sc.dia} dia(s)`):'desconhecida (construa uma torre)')}</div>`});
  it.push({sec:'Regras da base'});
  it.push({ic:'🍲',l:`Ração: ${['pouca','normal','farta'][b.racao]}`,s:'Farta anima, mas gasta mais · toque para mudar',on:()=>{ b.racao=(b.racao+1)%3; UI.refresh(); }});
  it.push({ic:'🚪',l:`Portões: ${['abertos a todos','com seleção','fechados'][b.portas]}`,s:'Quem pode entrar para morar · toque para mudar',on:()=>{ b.portas=(b.portas+1)%3; UI.refresh(); }});
  it.push({ic:'✏️',l:'Renomear a base',s:b.nome,on:()=>vilaNamePromptZ(true)});
  it.push({sec:'Estoque'});
  it.push({ic:'📥',l:'Guardar comida e água da mochila no estoque',s:'Tudo que não for comer agora',dis:!sc.inv.some(x=>['comida','agua'].includes(itCat(x.id))),why:'Nada para guardar.',on:()=>scAct(()=>{ let c=0,w=0; sc.inv.slice().forEach(x=>{ const k=itCat(x.id); if(k==='comida'){ sc.inv=sc.inv.filter(y=>y!==x); b.com+=Math.max(1,Math.round(itV(x.id)/10)); c++; } else if(k==='agua'){ sc.inv=sc.inv.filter(y=>y!==x); b.agua+=2; w++; } }); return `Guardei ${c} comida(s) e ${w} água(s) no estoque de ${b.nome}.`; },b.nome)});
  it.push({ic:'📤',l:'Pegar mantimentos para a estrada',s:'2 comidas e 2 águas do estoque',dis:b.com<4||b.agua<4,why:'Estoque baixo demais.',on:()=>scAct(()=>{ b.com-=4; b.agua-=4; addItem('lata',90,true); addItem('lata',90,true); addItem('agua',90,true); addItem('agua',90,true); return 'Enchi a mochila com o estoque da base.'; },b.nome)});
  it.push({sec:'Construções'});
  Object.entries(ZB).forEach(([k,[n,ic,base,d,max]])=>{ const l=b.b[k], c=base*(l+1), mx=l>=max;
    it.push({ic,l:`${n}${l?' · nível '+l:''}`,s:mx?`${d} · máximo`:`${d} · ${l?'melhorar':'construir'}: ${c} de sucata · 1 de energia`,r:mx?'★':'',dis:mx||sc.zmat<c||once(k)||sc.ap<1,why:mx?'Já está no máximo.':once(k)?'Os construtores precisam de um dia.':sc.ap<1?'Sem energia hoje.':`Preciso de ${c} de sucata.`,
      on:()=>scAct(()=>{ sc.done['zb_'+k]=1; sc.ap--; sc.zmat-=c; b.b[k]++; b.moral=Math.min(100,b.moral+3); zXP(8); zNoise(5); if(k==='garagem'&&b.b[k]===1&&!sc.veh.length){ sc.veh.push({k:'picape',hp:50}); return `${ic} Garagem construída, e ainda sobrou uma picape velha no fundo!`; } return `${ic} ${n} ${l?'melhorad'+(n.endsWith('s')?'os':'a')+' para o nível '+b.b[k]:'construíd'+(n.endsWith('s')?'os':'a')} em ${b.nome}.`; },n)}); });
  it.push({sec:'Estrada'},{ic:'🚙',l:'Abandonar a base e voltar para a estrada',s:'Perde as construções e os moradores',tone:'bad',on:()=>confirmBox('Abandonar?',`Deixar ${b.nome} para trás?`,'Abandonar',()=>{ scLog(`Abandonamos ${b.nome}. Os moradores ficaram para trás.`,'bad'); sc.zb=null; sc.stay=0; scStat('san',-10); UI.back(); after(); })});
  return {title:b.nome,items:it}; };
function vilaNamePromptZ(rename){ const ns=R.pick(['Último Refúgio','Fortaleza do Rio','Abrigo Esperança','Forte Amanhã','Ninho dos Sobreviventes','Morro Seguro','Casa dos Vivos']);
  modal({t:rename?'Novo nome da base':'Nome da base',x:'Digite o nome:',html:`<input id="vnome" maxlength="28" value="${esc(rename&&S.scen.zb?S.scen.zb.nome:ns)}" style="width:100%;margin-top:8px;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font:inherit">`,
    ch:[{l:'Confirmar',fn:()=>{ const el=document.getElementById('vnome'); const n=(el&&el.value||'').trim().replace(/\s+/g,' ').slice(0,28)||ns; if(rename&&S.scen.zb) S.scen.zb.nome=n; else { zFoundBase(n); MQ.unshift({t:'Base montada',x:`${n} é nosso lar agora. Construa muros, uma horta e um poço antes que a próxima horda chegue.`}); } UI.close(); }},{l:'Cancelar',cls:'alt'}]});
  setTimeout(()=>{ const el=document.getElementById('vnome'); if(el){ el.focus(); el.select(); } },60); }
V.scActs=(o=>()=>{ const r=o(), sc=S.scen; if(!sc||sc.id!=='zumbi') return r; zEnsure(sc);
  const b=sc.zb; r.items.splice(1,0,{sec:'Sobrevivência'},
    {ic:'🧍',l:'Ficha do sobrevivente',s:`Nível ${sc.zlv}${sc.zpts?` · ${sc.zpts} ponto(s) para distribuir!`:''}`,tone:sc.zpts?'good':'',on:()=>UI.push(V.zMe)},
    {ic:'🔎',l:'Procurar recursos',s:'Comida, água, remédios, combustível, armas, materiais',on:()=>UI.push(V.zScav)},
    {ic:'🗺️',l:'Expedição',s:sc.done.zexp?'Já fizemos uma hoje':'Ir longe atrás de muito saque · 2 de energia',on:()=>UI.push(V.zExp)},
    {ic:'🔧',l:'Oficina',s:`${sc.zmat} de sucata · fabricar armas, munição e armaduras`,on:()=>UI.push(V.zCraft)},
    {ic:'📻',l:'Facções e trocas',s:Object.entries(ZFAC).map(([k,f])=>f[1]+zRepTxt(Math.round(zRep(sc,k)))).join(' · '),on:()=>UI.push(V.zFac)},
    {ic:'🏚️',l:b?`Base: ${b.nome}`:'Montar uma base',s:b?`${b.pop} moradores · moral ${Math.round(b.moral)}% · defesa ${zDef(sc)}`:'Parar de viajar e construir um lar',on:()=>UI.push(V.zBase)});
  return r; })(V.scActs);
V.scLocal=(o=>()=>{ const r=o(), sc=S.scen; if(!sc||sc.id!=='zumbi') return r; zEnsure(sc);
  r.items.splice(1,0,{html:`<div class="card">${kv('Estação',ZSEASON[zSeason(sc)].join(' '))}${kv('Barulho',Math.round(sc.ruido)+'% '+(sc.ruido>=60?'· atraindo hordas':''))}${kv('Dia',sc.dia+' · recorde '+Math.max(sc.rec||0,META.zrec||0))}</div>`});
  if(sc.zb){ const i=r.items.findIndex(x=>x&&x.sec==='Viagem'); if(i>=0) r.items.splice(i,2,{sec:'Base'},{ic:'🏚️',l:sc.zb.nome,s:'Construções, moradores e estoque',on:()=>UI.push(V.zBase)}); }
  else r.items.push({sec:'Base'},{ic:'🏚️',l:'Montar a base aqui',s:'Parar de viajar e construir um lar',on:()=>UI.push(V.zBase)});
  return r; })(V.scLocal);
V.scItems=(o=>()=>{ const r=o(), sc=S.scen; if(!sc||sc.id!=='zumbi') return r; zEnsure(sc); r.title='Bens';
  r.items.splice(1,0,{html:`<div class="card">${kv('🔹 Munição',countCat('muni'))}${kv('🔩 Sucata',sc.zmat)}${kv('🛡️ Proteção',['nenhuma','improvisada','reforçada','pesada','blindada'][sc.zarm||0])}${sc.zb?kv('🏚️ Estoque da base',`${sc.zb.com} comida · ${sc.zb.agua} água`):''}</div>`}); return r; })(V.scItems);
V.scCrew=(o=>()=>{ const r=o(), sc=S.scen; if(sc&&sc.id==='zumbi'&&r.items[0]){ r.items[0].on=()=>UI.push(V.zMe); if(sc.zb) r.items.push({html:`<div class="card"><p style="color:var(--muted);font-size:13px">Além do grupo, ${sc.zb.pop} morador(es) vivem em ${esc(sc.zb.nome)}.</p></div>`}); } return r; })(V.scCrew);
// no fim do pesadelo, guarda o recorde
scenEnd=(o=>function(win,txt){ const sc=S.scen; if(sc&&sc.id==='zumbi'){ zEnsure(sc); const d=SCEN.zumbi; d.onEnd(S.me,sc); const rec=META.zrec; txt+=`\n\nVocê sobreviveu ${sc.dia} dias. Recorde: ${rec} dias.`; } return o(win,txt); })(scenEnd);
