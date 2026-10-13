// ===== Modos fictícios (18+): aventuras contadas em dias, fora da vida normal =====
// Enquanto a aventura dura, a vida real fica pausada: a tela vira a da aventura (local, grupo, mochila, ações e "próximo dia").
// Cada dia tem 3 pontos de energia; cada ação e cada ponto de interesse só podem ser feitos uma vez por dia.
// Perder (saúde ou sanidade a zero) não mata de verdade: você acorda e a vida continua. Vencer dá recompensas.
const SC_V=2;
const rnd=(a,b)=>R.int(a,b);
const pct=p=>R.chance(Math.max(.04,Math.min(.96,p)));
const oaG=g=>g==='F'?'a':'o';
const CLASSES={guerreiro:{n:'Guerreir',ic:'🗡️',sk:['Golpe Duplo','Fúria Berserker','Lâmina do Trovão']},mago:{n:'Mag',ic:'🔮',sk:['Bola de Fogo','Nevasca','Meteoro Arcano']},
  arqueiro:{n:'Arqueir',ic:'🏹',sk:['Tiro Certeiro','Chuva de Flechas','Flecha Celestial']},clerigo:{n:'Clérig',ic:'✨',sk:['Cura Menor','Escudo Sagrado','Ressurreição']},
  ladino:{n:'Ladin',ic:'🗝️',sk:['Furtividade','Golpe nas Sombras','Roubo de Alma']}};
const clsName=(c,g)=>CLASSES[c].n+(g?oaG(g):oa());
const POWERS=['voar','superforça','invisibilidade','telecinese','supervelocidade','controlar o gelo','controlar o fogo','ler mentes'];
const CODI={'voar':['Falcão','Cometa','Andorinha'],'superforça':['Titã','Colosso','Bigorna'],'invisibilidade':['Fantasma','Névoa','Sussurro'],'telecinese':['Maestro','Gravidade','Mente Viva'],
  'supervelocidade':['Relâmpago','Faísca','Corisco'],'controlar o gelo':['Geada','Inverno','Cristal'],'controlar o fogo':['Brasa','Fênix','Labareda'],'ler mentes':['Oráculo','Eco','Sexto Sentido']};
const VILOES=['Doutor Caos','Madame Sombra','Barão do Ferro','O Colecionador','Vespa Negra','Professor Ruína','Rainha Cinza','Mestre das Marionetes'];
const FANT_F=['Lyra','Mirela','Elandra','Brisa','Fenna','Talia','Selene','Aria','Nimue','Isolde','Kira','Yara','Elowen','Sariel'];
const FANT_M=['Borin','Sylas','Thorne','Kael','Gorak','Orin','Aldric','Ronan','Fael','Drako','Eamon','Tobias','Varek','Lucan'];
const FANT_L=['da Floresta','Martelo-de-Ferro','Vento-Norte','das Sombras','Coração-de-Leão','Folha-Prateada','Pedra-Funda','do Lago','Asa-Rubra','Olho-de-Falcão'];
const RACES={F:['elfa','anã','meio-orc','fada','humana','mulher-gato','dríade'],M:['elfo','anão','meio-orc','fada','humano','homem-gato','gnomo']};
function fantNames(){ const g=R.chance(.5)?'F':'M', g2=R.chance(.5)?'F':'M'; return {n:R.pick(g==='F'?FANT_F:FANT_M),nl:R.pick(FANT_L),nG:g,n2:R.pick(g2==='F'?FANT_F:FANT_M),n2l:R.pick(FANT_L),n2G:g2}; }

// ---------- itens (cartas com estado de 0 a 100%) ----------
// [nome, ícone, categoria, valor]  categorias: comida agua remedio mana san o2 vacina arma reparo gas sinal venda util
const SCI={
  agua:['Garrafa de água','💧','comida',10],cantil:['Cantil de água','🫗','comida',12],pao:['Pão mofado','🍞','comida',8],lata:['Lata de feijoada','🥫','comida',24],miojo:['Miojo','🍜','comida',14],
  barra:['Barra de cereal','🍫','comida',10],arroz:['Saco de arroz','🍚','comida',32],pessego:['Pêssego em calda','🍑','comida',16],biscoito:['Biscoito recheado','🍪','comida',9],sardinha:['Sardinha em lata','🐟','comida',18],
  racao:['Ração militar','🎖️','comida',38],salgadinho:['Salgadinho','🥨','comida',7],shake:['Shake de proteína','🥤','comida',15],doce:['Doce de leite','🍯','comida',14],
  coco:['Coco','🥥','comida',14],peixe:['Peixe assado','🐠','comida',26],fruta:['Frutas da mata','🍌','comida',15],caranguejo:['Caranguejo','🦀','comida',18],ovo:['Ovos de gaivota','🥚','comida',12],
  aguac:['Água de coco','🥛','agua',20],aguaf:['Água fervida','🫖','agua',30],chuva:['Água da chuva','🌧️','agua',18],
  paoelf:['Pão élfico','🥖','comida',30],carne:['Carne de javali','🍖','comida',24],hidromel:['Hidromel','🍺','comida',8],queijo:['Queijo anão','🧀','comida',18],maca:['Maçã dourada','🍎','comida',20],
  batata:['Batata marciana','🥔','comida',20],liof:['Comida liofilizada','📦','comida',28],pasta:['Pasta nutritiva','🧴','comida',14],o2:['Cilindro de oxigênio','🫧','o2',25],
  kit:['Kit de primeiros socorros','🩹','remedio',30],analg:['Analgésico','💊','remedio',12],antib:['Antibiótico','💉','remedio',22],ervas:['Ervas medicinais','🌿','remedio',14],pocao:['Poção de cura','🧪','remedio',35],
  estim:['Estimulante','⚡','remedio',16],mana:['Poção de mana','🔮','mana',30],calm:['Calmante','😌','san',18],vacina:['Vacina experimental','🧬','vacina',0],
  estilete:['Estilete','✂️','arma',8],faca:['Faca de cozinha','🔪','arma',12],lanca:['Lança de cabo de vassoura','🦯','arma',14],taco:['Taco de beisebol','🏏','arma',16],cutelo:['Cutelo','🪓','arma',18],
  chave:['Chave inglesa','🔧','arma',13],facao:['Facão','🗡️','arma',22],machado:['Machado de incêndio','🪓','arma',26],pistola:['Pistola','🔫','arma',30],besta:['Besta','🏹','arma',28],
  espingarda:['Espingarda','💥','arma',38],rifle:['Rifle de caça','🎯','arma',40],motosserra:['Motosserra','⚙️','arma',42],
  pedra:['Faca de pedra','🪨','arma',8],lancab:['Lança de bambu','🎋','arma',13],arco:['Arco e flechas','🏹','arma',20],
  espada:['Espada de ferro','⚔️','arma',20],espadaelf:['Espada élfica','🗡️','arma',30],cajado:['Cajado de carvalho','🪄','arma',22],arcoelf:['Arco élfico','🏹','arma',28],
  martelo:['Martelo anão','🔨','arma',32],adaga:['Adaga envenenada','🗡️','arma',24],runica:['Lâmina rúnica','✨','arma',40],
  taser:['Taser','⚡','arma',14],bastao:['Bastão retrátil','🦯','arma',18],
  reparo:['Kit de reparo','🧰','reparo',35],gas:['Galão de gasolina','⛽','gas',1],remendo:['Remendo de traje','🧵','reparo',30],pecas:['Peças de reposição','⚙️','pecas',20],
  sinal:['Sinalizador','🎆','sinal',0],cristal:['Cristal de mana','💎','venda',60],couro:['Couro de monstro','🟫','venda',25],gema:['Gema rara','💠','venda',120],
  livro:['Livro de bolso','📕','san',10],baralho:['Baralho','🃏','san',8],foto:['Foto de família','🖼️','san',12],violao:['Violão sem uma corda','🎸','san',14],
  radio:['Rádio de pilha','📻','util',0],lanterna:['Lanterna','🔦','util',0],corda:['Corda','🪢','util',0],lona:['Lona','⛺','util',0],isqueiro:['Isqueiro','🔥','util',0],
  mapa:['Mapa rodoviário','🗺️','util',0],binoculo:['Binóculo','🔭','util',0],semente:['Sementes','🌱','util',0],gadget:['Gadget de herói','🛰️','util',0],
};
const itN=id=>SCI[id][0], itIc=id=>SCI[id][1], itCat=id=>SCI[id][2], itV=id=>SCI[id][3];
const VEH={picape:['Picape velha','🛻',4,18],sedan:['Sedã sem retrovisor','🚗',5,10],van:['Van escolar','🚐',10,20],moto:['Moto de trilha','🏍️',2,3],onibus:['Ônibus de excursão','🚌',20,30],
  ambulancia:['Ambulância','🚑',4,16],viatura:['Viatura da polícia','🚓',5,10],caminhao:['Caminhão-baú','🚚',3,40],kombi:['Kombi 1978','🚐',8,14],jipe:['Jipe do exército','🚙',5,16]};

// ---------- estado ----------
const SC=()=>S.scen, SM=()=>SCEN[S.scen.id];
const crew=()=>S.scen?S.scen.crew:[];
function scStat(k,n){ const sc=S.scen; if(!sc) return; const lim=(SM().cap||{})[k]??100; sc[k]=Math.max(0,Math.min(lim,(sc[k]||0)+n)); if(k==='hl'&&n<=-3&&typeof hurtFx==='function') hurtFx(n); if(k==='xp') lvlUp(); }
function scLog(t,c){ const sc=S.scen; if(!sc.log.length) sc.log.push({d:sc.dia,pl:'',lines:[]}); const d=sc.log[sc.log.length-1]; d.lines.push(c?{t,c}:t); if(sc.log.length>40) sc.log.shift(); }
function mkCrew(o={}){ const sc=S.scen, f=SM().names; let p;
  if(f){ const g=o.gender||(R.chance(.5)?'F':'M'); p=mkPerson({rel:'tmp',gender:g,age:o.age||rnd(18,60),first:o.first||R.pick(g==='F'?FANT_F:FANT_M),last:o.last||R.pick(FANT_L)}); }
  else p=mkPerson({rel:'tmp',gender:o.gender,age:o.age||rnd(16,62),first:o.first,last:o.last});
  const roles=SM().roles; const c={id:++sc.cid,first:p.first,last:p.last,gender:p.gender,age:p.age,genes:p.genes,look:p.look,hp:100,lv:o.lv||rnd(55,75),arma:o.arma||null,role:o.role||R.pick(Object.keys(roles))};
  if(SM().names) c.race=R.pick(RACES[c.gender]);
  sc.crew.push(c); return c; }
const roleName=c=>{ if(c.bebe) return c.age<3?'Bebê':'Criança'; if(c.bicho) return 'Companheiro'; const r=SM().roles[c.role]; if(!r) return ''; if(r[2]===false) return r[0]; if(typeof r[2]==='string') return c.gender==='F'?r[2]:r[0]; return r[0]+oaG(c.gender); };
const hasRole=k=>crew().some(c=>c.role===k);
function addCrewFromEvent(d,key){ if(!d||!d[key]) return null; if(d['crew_'+key]) return null; const c=mkCrew({first:d[key],last:d[key+'l'],gender:d[key+'G'],age:d.nAge}); d['crew_'+key]=c.id; return c; }
function crewLeave(c,why,dead){ const sc=S.scen; sc.crew=sc.crew.filter(x=>x!==c); if(c.arma&&!dead) {} else if(c.arma&&dead&&R.chance(.6)) addItem(c.arma.id,c.arma.hp,true); if(why) scLog(why,dead?'bad':'warn'); }
function crewById(id){ return crew().find(c=>c.id===id); }
// itens
function bagCap(){ const sc=S.scen; if(sc.id==='zumbi') return sc.veh.length?sc.veh.reduce((s,v)=>s+VEH[v.k][3],0):8; return SM().bag||20; }
function seats(){ const sc=S.scen; return sc.veh.reduce((s,v)=>s+VEH[v.k][2],0); }
function addItem(id,hp,quiet){ const sc=S.scen; if(!SCI[id]) return false; if(sc.inv.length>=bagCap()){ if(!quiet) scLog(`${itN(id)} não coube na carga.`,'warn'); return false; } sc.inv.push({id,hp:hp??rnd(60,100)}); return true; }
function takeItem(q){ const sc=S.scen; const i=sc.inv.findIndex(x=>x.id===q||(q[0]==='@'&&itCat(x.id)===q.slice(1))); if(i<0) return null; return sc.inv.splice(i,1)[0]; }
const countCat=cat=>S.scen.inv.filter(x=>itCat(x.id)===cat).length;
function lootText(ids){ const got=[]; ids.forEach(id=>{ if(addItem(id)) got.push(itIc(id)+' '+itN(id)); }); return got.length?' Peguei: '+got.join(', ')+'.':''; }
const myDmg=()=>S.scen.arma?itV(S.scen.arma.id)*(S.scen.arma.hp>0?1:.3):4;
function scPow(){ const sc=S.scen, m=S.me; if(!sc) return 50; if(SM().pow) return Math.round(Math.max(5,Math.min(95,SM().pow(sc,m))));
  const cr=crew().filter(c=>!c.bebe).reduce((s,c)=>s+(c.bicho?8:4)+(c.arma?itV(c.arma.id)*.45:1.5)*(c.hp/100),0);
  return Math.round(Math.max(5,Math.min(95,12+m.fight*.3+myDmg()*.9+cr+(hasRole('ati')?8:0)))); }
function wearWeapon(){ const sc=S.scen; if(sc.arma){ sc.arma.hp-=rnd(4,10); if(sc.arma.hp<=0){ scLog(`Meu ${itN(sc.arma.id).toLowerCase()} quebrou.`,'warn'); sc.arma=null; } } }
function scHurt(n){ scStat('hl',-n); }
// combate genérico contra uma ameaça (0 a 4)
function scFight(thr,what){ const p=scPow(), need=10+thr*17; const ok=pct(.5+(p-need)/90); wearWeapon();
  if(ok){ sc_kill(rnd(1,3)*(thr+1)); return {ok:true,t:''}; }
  const dmg=rnd(6,12)*(1+Math.min(thr,4)*.4); scHurt(Math.round(dmg)); let t=`${what||'A briga'} me deixou ferid${oa()}.`;
  const cs=crew().filter(c=>!c.bebe); if(cs.length&&R.chance(.12+thr*.06)){ const c=R.pick(cs); c.hp-=rnd(20,45); if(c.hp<=0){ crewLeave(c,`${c.first} não sobreviveu.`,true); t+=` Perdemos ${c.first}.`; } else t+=` ${c.first} se machucou.`; }
  if(S.scen.id==='zumbi'&&R.chance(.05+thr*.04)) t+=' '+bite();
  return {ok:false,t}; }
function sc_kill(n){ const sc=S.scen; sc.kills=(sc.kills||0)+n; }

// ---------- os cinco modos ----------
const Z_PLACES=[
  ['Posto de gasolina na beira da estrada','⛽',['bomba','conveniencia','oficina','banheiro']],['Vila do interior','🏘️',['mercearia','igreja','casas','farmacia']],
  ['Supermercado saqueado','🛒',['corredores','deposito','acougue','estacionamento']],['Hospital regional','🏥',['farmacia','uti','ambulancias','refeitorio']],
  ['Escola municipal','🏫',['cantina','biblioteca','quadra','diretoria']],['Delegacia abandonada','🚓',['armario','viaturas','celas']],
  ['Fazenda','🌾',['celeiro','casasede','pomar','galinheiro']],['Shopping center','🏬',['praca','lojas','cinema','estacionamento']],
  ['Base militar','🎖️',['arsenal','hangar','refeitorio','enfermaria']],['Parque de diversões','🎡',['lanchonete','trem','roda']],
  ['Estádio de futebol','🏟️',['vestiario','bar','gramado']],['Engarrafamento na rodovia','🚗',['portamalas','onibusp','caminhaop']],
  ['Cidade litorânea','🏖️',['quiosque','marina','hotel']],['Bairro de condomínios','🏡',['casas','piscina','garagem']],
  ['Centro da cidade','🏙️',['farmacia','lojas','metro','banco']],['Pedágio','🚧',['cabines','portamalas','conveniencia']],
  ['Acampamento militar destruído','⛺',['barracas','arsenal','jipes']],['Cidade fantasma','🌫️',['casas','mercearia','igreja','oficina']],
];
const Z_POI={ // [nome, ícone, itens possíveis, risco extra, especial]
  bomba:['Bombas de combustível','⛽',['gas','gas','gas'],0,'gas'],conveniencia:['Loja de conveniência','🏪',['salgadinho','barra','agua','biscoito','shake','miojo'],0],
  oficina:['Oficina mecânica','🔧',['reparo','chave','gas','reparo'],.05,'veh'],banheiro:['Banheiro dos fundos','🚻',['analg','estilete'],.08],
  mercearia:['Mercearia','🧺',['arroz','lata','sardinha','pao','doce'],.02],igreja:['Igreja','⛪',['agua','pao','livro','foto'],-.05,'surv'],
  casas:['Casas trancadas','🏚️',['lata','faca','foto','baralho','analg','cantil'],.04,'surv'],farmacia:['Farmácia','💊',['analg','antib','kit','calm','estim'],.08],
  corredores:['Corredores','🛒',['lata','miojo','biscoito','agua','arroz','pessego'],.06],deposito:['Depósito','📦',['arroz','lata','lata','agua','sardinha'],.1],
  acougue:['Açougue','🥩',['cutelo','faca'],.08],estacionamento:['Estacionamento','🅿️',['gas','reparo'],.05,'veh'],
  uti:['UTI','🛏️',['kit','antib','vacina','calm'],.18],ambulancias:['Ambulâncias','🚑',['kit','analg'],.06,'veh'],refeitorio:['Refeitório','🍽️',['arroz','lata','pessego','agua'],.05],
  cantina:['Cantina','🥪',['biscoito','salgadinho','doce','agua'],.04],biblioteca:['Biblioteca','📚',['livro','mapa'],-.04],quadra:['Quadra','🏀',['taco','agua'],.06,'surv'],diretoria:['Diretoria','🗄️',['radio','lanterna','doce'],.03],
  armario:['Armário de armas','🗄️',['pistola','bastao','taser','espingarda'],.1],viaturas:['Viaturas','🚓',['gas','radio'],.05,'veh'],celas:['Celas','🔒',['estilete'],.12,'surv'],
  celeiro:['Celeiro','🛖',['facao','corda','gas'],.05],casasede:['Casa da fazenda','🏠',['doce','arroz','rifle','foto'],.05,'surv'],pomar:['Pomar','🍊',['pessego','fruta'],.02],galinheiro:['Galinheiro','🐔',['ovo','ovo'],.03],
  praca:['Praça de alimentação','🍔',['salgadinho','agua','shake'],.12],lojas:['Lojas','🛍️',['lanterna','isqueiro','taco','baralho','violao'],.08],cinema:['Cinema','🎬',['doce','salgadinho'],.14,'surv'],
  arsenal:['Arsenal','💥',['espingarda','pistola','rifle','racao'],.15],hangar:['Hangar','✈️',['gas','reparo'],.1,'veh'],enfermaria:['Enfermaria','🏥',['kit','antib','vacina'],.08],
  lanchonete:['Lanchonete','🌭',['salgadinho','doce','agua'],.05],trem:['Trem fantasma','👻',['lanterna','estilete'],.16],roda:['Roda-gigante','🎡',['binoculo'],.04],
  vestiario:['Vestiário','🚿',['shake','analg'],.06],bar:['Bar do estádio','🍺',['salgadinho','agua'],.08],gramado:['Gramado','⚽',['taco'],.2,'surv'],
  portamalas:['Porta-malas dos carros','🧳',['agua','barra','gas','reparo','foto','lanterna'],.07,'veh'],onibusp:['Ônibus parado','🚌',['agua','biscoito','livro'],.1,'veh'],caminhaop:['Caminhão de carga','🚚',['lata','arroz','agua','gas'],.08,'veh'],
  quiosque:['Quiosques da praia','🏝️',['agua','salgadinho','sardinha'],.05],marina:['Marina','⛵',['gas','corda','sinal'],.06],hotel:['Hotel','🏨',['biscoito','kit','calm','baralho'],.1,'surv'],
  piscina:['Área da piscina','🏊',['agua'],.04],garagem:['Garagem','🚙',['gas','reparo','chave'],.05,'veh'],metro:['Estação de metrô','🚇',['lanterna','estilete'],.22,'surv'],banco:['Agência bancária','🏦',['foto'],.1],
  cabines:['Cabines do pedágio','🧾',['agua','radio'],.04],barracas:['Barracas','⛺',['racao','kit','lona'],.08],jipes:['Jipes','🚙',['gas','reparo'],.06,'veh'],
};
const THREAT=['Nenhuma','Baixa','Média','Alta','Horda'];
const ILHA_ZONES={praia:['Praia do naufrágio','🏖️',['areia','marrasa','dunas']],selva:['Selva','🌴',['coqueiral','bananeiras','trilha']],cachoeira:['Cachoeira','💦',['poco','pedras']],
  recife:['Recife de corais','🪸',['corais','poças']],caverna:['Caverna','🕳️',['galeria','morcegos']],pico:['Pico da ilha','⛰️',['topo','ninhos']],
  mangue:['Mangue','🌿',['raizes','lama']],destrocos:['Destroços do avião','✈️',['cabine','bagagem','asa']],lagoa:['Lagoa salgada','🏞️',['margem','juncos']]};
const ILHA_POI={areia:['Faixa de areia','🦀',['caranguejo','coco'],0],marrasa:['Mar raso','🌊',['peixe','caranguejo'],.04],dunas:['Dunas','🏜️',['ovo'],0],coqueiral:['Coqueiral','🥥',['coco','coco','aguac'],.02],
  bananeiras:['Bananeiras','🍌',['fruta','fruta'],.02],trilha:['Trilha na mata','🥾',['ervas','fruta','pedra'],.06],poco:['Poço da cachoeira','💧',['chuva','chuva'],.02],pedras:['Pedras lisas','🪨',['pedra','ervas'],.05],
  corais:['Corais','🪸',['peixe','peixe'],.08],'poças':['Poças de maré','🐙',['caranguejo','peixe'],.03],galeria:['Galeria escura','🕯️',['pedra','chuva'],.08],morcegos:['Ninho de morcegos','🦇',['ervas'],.1],
  topo:['Topo do pico','🏔️',[],.06],ninhos:['Ninhos de gaivota','🥚',['ovo','ovo'],.05],raizes:['Raízes do mangue','🌱',['caranguejo','caranguejo'],.04],lama:['Lamaçal','🟤',['ervas'],.06],
  cabine:['Cabine do piloto','🛩️',['sinal','radio','kit'],.05],bagagem:['Malas espalhadas','🧳',['barra','biscoito','livro','faca','foto','isqueiro','analg'],.03],asa:['Asa partida','🪽',['corda','lona'],.04],
  margem:['Margem da lagoa','🐸',['peixe','fruta'],.04],juncos:['Juncos','🎋',['lancab','corda'],.02]};
const ISK_ROUTE=[['Vila de Aurora','🏡',1,['guilda','taverna','mercado','campos']],['Floresta de Lúmen','🌲',2,['clareira','arvore','ruinas']],['Valmor, a capital','🏰',2,['guilda','taverna','mercado','ferreiro','templo','academia']],
  ['Montanhas de Ferro Fundo','⛰️',3,['mina','forja','caverna']],['Deserto de Ashar','🏜️',4,['oasis','piramide','caravana']],['Pântano das Bruxas','🧙',5,['cabana','lodo','templo']],
  ['Cidade flutuante de Aerion','☁️',6,['academia','mercado','ferreiro','taverna']],['Terras Sombrias','🌑',7,['fortaleza','ruinas','caverna']],['Castelo do Rei Demônio','🏯',9,['portao','salao']]];
const ISK_POI={guilda:['Guilda dos aventureiros','📜',[],0,'guilda'],taverna:['Taverna','🍺',['hidromel','carne'],0,'taverna'],mercado:['Mercado','🛒',[],0,'mercado'],campos:['Campos de slimes','🟢',['couro'],.3,'luta'],
  clareira:['Clareira das fadas','🧚',['mana','ervas','maca'],.2,'luta'],arvore:['Árvore ancestral','🌳',['paoelf','arcoelf'],.15],ruinas:['Ruínas antigas','🏛️',['gema','cristal','runica'],.5,'luta'],
  ferreiro:['Ferreiro','⚒️',[],0,'ferreiro'],templo:['Templo','⛩️',['pocao'],0,'templo'],academia:['Academia arcana','🎓',[],0,'academia'],mina:['Mina abandonada','⛏️',['gema','cristal'],.5,'luta'],
  forja:['Forja dos anões','🔨',['martelo','queijo'],.2],caverna:['Caverna do troll','🧌',['couro','gema'],.6,'luta'],oasis:['Oásis','🌴',['fruta','agua'],.15],piramide:['Pirâmide','🔺',['gema','adaga'],.6,'luta'],
  caravana:['Caravana de mercadores','🐫',[],.05,'mercado'],cabana:['Cabana da bruxa','🏚️',['pocao','mana'],.35,'luta'],lodo:['Lodaçal','🟩',['ervas'],.5,'luta'],fortaleza:['Fortaleza sombria','🏯',['runica','gema'],.7,'luta'],
  portao:['Portão do castelo','🚪',[],.8,'luta'],salao:['Salão do trono','👿',[],0,'rei']};
const HEROI_BAIRROS={centro:['Centro','🏙️'],porto:['Porto','⚓'],industrial:['Zona industrial','🏭'],nobre:['Bairro nobre','🏛️'],metro:['Túneis do metrô','🚇'],comunidade:['Comunidade do morro','🏘️'],aeroporto:['Aeroporto','✈️'],praia:['Orla','🏖️']};
const HEROI_OC=[['Assalto a banco','🏦',3,'crime'],['Incêndio num prédio','🔥',2,'resgate'],['Carro desgovernado','🚗',1,'resgate'],['Gato preso numa antena','🐈',0,'resgate'],['Briga de gangues','👊',2,'crime'],
  ['Pessoa presa num elevador','🛗',1,'resgate'],['Roubo de carga','🚚',2,'crime'],['Sequestro relâmpago','🚐',3,'crime'],['Desabamento','🏚️',3,'resgate'],['Capangas do arqui-inimigo','🦹',3,'pista'],
  ['Pichação suspeita com um símbolo','🖌️',0,'pista'],['Velhinha atravessando a avenida','👵',0,'resgate'],['Enchente na avenida','🌊',2,'resgate'],['Vazamento de gás','💨',2,'resgate'],['Ladrão de bolsa','👜',1,'crime'],
  ['Robô descontrolado','🤖',3,'crime'],['Informante nervoso','🕵️',0,'pista'],['Assalto a joalheria','💎',2,'crime']];
const MARTE_SITES={habitat:['Habitat','🏠',['hab_cozinha','hab_ginasio']],estufa:['Estufa','🌱',['est_plantas','est_agua']],oficina:['Oficina','🛠️',['of_pecas','of_impressora']],
  gerador:['Gerador de oxigênio','🫧',['ger_painel','ger_filtros']],cratera:['Cratera Esperança','🌋',['cr_gelo','cr_rochas'],1],planicie:['Planície de Ferro','🟥',['pl_meteorito','pl_sonda'],1],
  canion:['Cânion Vermelho','🏜️',['cn_caverna','cn_fossil'],2],calota:['Calota polar','🧊',['cl_gelo'],2]};
const MARTE_POI={hab_cozinha:['Cozinha','🍳',['liof','pasta'],0],hab_ginasio:['Ginásio','🏋️',[],0,'treino'],est_plantas:['Canteiros','🥔',['batata','batata'],0],est_agua:['Reciclagem de água','💧',['agua'],0],
  of_pecas:['Estoque de peças','⚙️',['pecas','reparo','remendo'],0],of_impressora:['Impressora 3D','🖨️',['pecas'],0],ger_painel:['Painéis solares','☀️',[],.05,'o2'],ger_filtros:['Filtros','🌀',['o2'],.05],
  cr_gelo:['Depósito de gelo','🧊',['agua','o2'],.12],cr_rochas:['Rochas estranhas','🪨',[],.1,'ciencia'],pl_meteorito:['Meteorito','☄️',['pecas'],.12,'ciencia'],pl_sonda:['Sonda antiga','🛰️',['pecas','remendo','radio'],.1],
  cn_caverna:['Tubo de lava','🕳️',['agua'],.2,'ciencia'],cn_fossil:['Marcas fossilizadas','🦠',[],.15,'vida'],cl_gelo:['Gelo polar','❄️',['agua','agua','o2'],.2]};

const SCEN={
  zumbi:{n:'Pesadelo zumbi',ic:'🧟',d:'Lidere um comboio de sobreviventes até o Porto Seguro. Cada dia é um destino novo: explore, junte suprimentos, cuide do grupo e dos carros. Se a sanidade ou a saúde zerarem, você acorda.',
    intro:'O alarme não tocou. O que tocou foi a sirene da cidade inteira. Em uma semana, o mundo acabou. Agora você lidera um pequeno comboio rumo ao Porto Seguro, uma ilha que, dizem, ainda está livre.',
    day:'Dia',goalN:22,bag:0,tabs:['Local','Comboio','Próximo dia','Grupo','Ações'],tabIc:['📍','🚙','🌅','👥','⚡'],
    stats:[['san','Sanidade','🧠'],['hl','Saúde','❤️'],['fome','Fome','🍗',1],['moral','Moral do grupo','🤝']],
    roles:{mec:['Mecânic','🔧'],med:['Enfermeir','💉'],coz:['Cozinheir','🍳'],ati:['Atirador','🎯','Atiradora'],bat:['Batedor','🔭','Batedora'],pro:['Professor','📖','Professora']},
    hdr:sc=>[`⛽ ${countCat('gas')}`,'Galões de gasolina'],
    init:()=>{ const sc={san:80,hl:90,fome:20,kills:0,etapa:0,inf:0,veh:[{k:'picape',hp:rnd(60,90)},{k:R.pick(['sedan','kombi']),hp:rnd(50,85)}]}; return sc; },
    start:sc=>{ for(let i=0;i<3;i++) mkCrew(); ['lata','lata','agua','agua','pao','biscoito','sardinha','miojo','arroz','gas','gas','gas','gas','gas','kit','reparo','pessego','barra'].forEach(id=>addItem(id,null,true)); sc.arma={id:'cutelo',hp:rnd(30,60)}; crew()[0].arma={id:'lanca',hp:80}; crew()[1].arma={id:'estilete',hp:70}; },
    place:sc=>{ const pl=R.pick(Z_PLACES.filter(p=>p[0]!==(sc.loc&&sc.loc.n))); const thr=Math.min(4,R.wpick([[0,3],[1,4],[2,3],[3,2],[4,1]])+(sc.etapa>15&&R.chance(.3)?1:0));
      const pois=R.shuffle(pl[2].slice()).slice(0,rnd(2,Math.min(4,pl[2].length))).map(k=>({k,done:0}));
      return {n:pl[0],ic:pl[1],thr,pois}; },
    poi:(sc,p)=>zPoi(sc,p),
    goal:sc=>[`Porto Seguro`,`${sc.etapa} de 20 etapas`,Math.round(sc.etapa/20*100)],
    upkeep:sc=>zUpkeep(sc),
    acts:{
      cacar:{ic:'🪓',l:'Caçar os zumbis do lugar',s:'Deixa o local seguro · usa as armas',min:sc=>sc.loc.thr>0,why:'Não tem zumbi por perto.',fn:sc=>{ const f=scFight(sc.loc.thr,'A caçada'); if(f.ok){ sc.loc.thr=Math.max(0,sc.loc.thr-2); scStat('san',3); return `Limpamos a área. A ameaça caiu para ${THREAT[sc.loc.thr].toLowerCase()}.`; } return f.t; }},
      vigia:{ic:'🔦',l:'Organizar a vigia da noite',s:'Menos ataques de madrugada',fn:sc=>{ sc.vig=1; crew().forEach(c=>c.lv=Math.min(100,c.lv+2)); return 'Montei a escala da vigia. Esta noite ninguém dorme desprotegido.'; }},
      fogueira:{ic:'🔥',l:'Fogueira com o grupo',s:'Sanidade e moral',fn:sc=>{ scStat('san',rnd(6,10)); crew().forEach(c=>c.lv=Math.min(100,c.lv+rnd(4,8))); return R.pick(['Alguém puxou um violão desafinado. Por uma hora, ninguém falou de zumbi.','Contamos como era nossa vida antes. Rimos e choramos.','Assamos o que tinha. Pareceu um churrasco de domingo.']); }},
      discurso:{ic:'📣',l:'Fazer um discurso de líder',s:'Depende do carisma',fn:sc=>{ if(pct(sc.car/100+.1)){ crew().forEach(c=>c.lv=Math.min(100,c.lv+rnd(8,14))); scStat('san',4); return 'Falei do Porto Seguro como se já estivéssemos lá. O grupo acreditou.'; } crew().forEach(c=>c.lv=Math.max(0,c.lv-4)); return 'Gaguejei. Alguém riu. Melhor ter ficado quieto.'; }},
      treino:{ic:'🥋',l:'Treinar o grupo para lutar',s:'Todos ficam mais fortes',min:sc=>crew().length>0,why:'Não tenho grupo para treinar.',fn:sc=>{ S.me.fight=clamp(S.me.fight+rnd(1,3)); crew().forEach(c=>{ c.lv=Math.min(100,c.lv+2); }); sc.trn=(sc.trn||0)+1; return 'Treinamos golpes na cabeça em bonecos de pano. Mórbido, mas útil.'; }},
      sinal:{ic:'📻',l:'Tentar o rádio',s:'Pode dar pistas e suprimentos',min:sc=>sc.inv.some(x=>x.id==='radio'),why:'Preciso de um rádio de pilha.',fn:sc=>{ const r=R.f(); if(r<.3){ sc.etapa=Math.min(20,sc.etapa+1); return 'Uma voz passou um atalho pela serra. Ganhamos uma etapa no caminho.'; } if(r<.5){ addItem('racao'); addItem('kit'); return 'Um grupo militar combinou uma entrega. Deixaram uma caixa no viaduto: ração e um kit.'; } if(r<.65){ scStat('san',-6); return 'Alguém do outro lado só ria. Ria e ria. Desliguei.'; } return 'Só chiado. E, no fundo, um gemido que eu prefiro achar que era o vento.'; }},
      descanso:{ic:'😴',l:'Descansar',s:'Saúde e sanidade',ap:1,fn:sc=>{ scStat('hl',rnd(9,15)); scStat('san',rnd(4,7)); return 'Dormi no banco de trás com o cutelo no colo. Melhor que nada.'; }},
    },
    pow:null,
    win:'Sobrevivi ao pesadelo zumbi',lose:'Acordei de um pesadelo zumbi',reward:(m,sc)=>{ m.fight=clamp(m.fight+5); st('happy',8); },
  },
  ilha:{n:'Sobrevivência na ilha',ic:'🏝️',d:'Seu avião caiu no oceano. Explore a ilha, junte comida e água, mantenha o fogo e a cabeça no lugar até o resgate chegar ou a jangada ficar pronta.',
    intro:'O avião caiu no mar. Você nadou até uma praia deserta, agarrado a uma mala que não era sua. Não tem ninguém. Só você, a areia e o barulho das ondas.',
    day:'Dia',bag:18,tabs:['Local','Mochila','Próximo dia','Náufragos','Ações'],tabIc:['📍','🎒','🌅','👥','⚡'],
    stats:[['hl','Saúde','❤️'],['san','Sanidade','🧠'],['fome','Fome','🍗',1],['sede','Sede','💧',1]],
    roles:{pes:['Pescador','🎣','Pescadora'],med:['Médic','🩺'],eng:['Engenheir','📐'],esc:['Escoteir','🧭']},
    hdr:sc=>[`🆘 ${sc.sos}%`,'Sinal de resgate'],
    init:()=>({hl:90,san:75,fome:25,sede:30,abrigo:0,fogo:0,sos:0,jangada:0,zona:'praia'}),
    start:sc=>{ ['barra','agua','biscoito'].forEach(id=>addItem(id,null,true)); },
    place:sc=>{ const z=ILHA_ZONES[sc.zona||'praia']; return {n:z[0],ic:z[1],thr:0,pois:z[2].map(k=>({k,done:0}))}; },
    poi:(sc,p)=>ilhaPoi(sc,p),
    goal:sc=>['Resgate',`Sinal ${sc.sos}% · jangada ${sc.jangada}%`,Math.max(sc.sos,sc.jangada)],
    upkeep:sc=>ilhaUpkeep(sc),
    acts:{
      abrigo:{ic:'🛖',l:'Construir o abrigo',s:'Protege da chuva e do frio',fn:sc=>{ const v=rnd(12,20)+(hasRole('eng')?6:0)+(sc.inv.some(x=>x.id==='lona')?8:0); scStat('abrigo',v); return `Folhas de palmeira, galhos e paciência: abrigo ${sc.abrigo}%.`; }},
      fogo:{ic:'🔥',l:'Acender a fogueira',s:'Cozinha, aquece e sinaliza',min:sc=>!sc.fogo,why:'A fogueira já está acesa.',fn:sc=>{ if(sc.inv.some(x=>x.id==='isqueiro')||pct(.4+S.me.smarts/200)){ sc.fogo=1; scStat('san',8); return 'FOGO! Eu fiz fogo!'; } return 'Esfreguei gravetos por horas. Só ganhei bolhas.'; }},
      sos:{ic:'🆘',l:'Montar sinal de SOS',s:'Pedras e galhos na areia',fn:sc=>{ const v=rnd(6,12); scStat('sos',v); return `Escrevi SOS gigante na areia: sinal ${sc.sos}%.`; }},
      jangada:{ic:'🛶',l:'Construir a jangada',s:'Precisa de corda ou cipó',ap:2,fn:sc=>{ const v=rnd(6,11)+(hasRole('eng')?5:0)+(sc.inv.some(x=>x.id==='corda')?4:0); scStat('jangada',v); return `Amarrei mais troncos: jangada ${sc.jangada}%.`; }},
      zarpar:{ic:'⛵',l:'Zarpar na jangada',s:'Arriscado · leve comida e água',min:sc=>sc.jangada>=100,why:'A jangada ainda não está pronta.',ap:3,fn:sc=>{ const food=countCat('comida')+countCat('agua'); if(pct(.35+food*.05+sc.hl/400)){ scenEnd(true,'Depois de nove dias no mar, um pesqueiro me puxou para bordo. Chorei abraçado a um balde de peixe.'); return ''; } scHurt(rnd(25,40)); sc.jangada=30; return 'Uma onda partiu a jangada ao meio. Voltei nadando, sem nada.'; }},
      ferver:{ic:'🫖',l:'Ferver água',s:'Água limpa, precisa de fogo',min:sc=>!!sc.fogo,why:'Preciso de fogo.',fn:sc=>{ addItem('aguaf'); addItem('aguaf'); return 'Fervi água no casco de um coco. Duas porções de água limpa.'; }},
      descanso:{ic:'😴',l:'Deitar na rede e ver o pôr do sol',s:'Saúde e sanidade',fn:sc=>{ scStat('hl',rnd(4,8)); scStat('san',rnd(6,10)); return 'O céu ficou laranja, depois roxo. Por um instante, foi bonito estar aqui.'; }},
      falar:{ic:'🏐',l:'Conversar com a bola',s:'Ela é ótima ouvinte',min:sc=>!!sc.bola,why:'Não tenho com quem conversar… ainda.',fn:sc=>{ scStat('san',rnd(6,10)); return R.pick(['Contei para a bola sobre minha infância. Ela não julgou.','A bola concordou comigo sobre tudo. Que amiga.','Brigamos. Fiz as pazes com a bola antes de dormir.']); }},
    },
    win:'Fui resgatad{o} da ilha',lose:'Acordei de um sonho na ilha deserta',reward:(m,sc)=>{ m.money+=40000; m.fame=clamp(m.fame+10); st('happy',10); },
  },
  isekai:{n:'Isekai',ic:'⚔️',d:'Um caminhão, uma luz branca, e você acorda em Eldoria. Suba de nível, monte um grupo e atravesse o reino até o Castelo do Rei Demônio. Atenção: em Eldoria não se acorda. Se morrer lá, morre de verdade. A única volta é o portal.',
    intro:'Um caminhão desgovernado. Uma luz branca. Quando você abriu os olhos, estava num campo com dois sóis no céu. Uma janela flutuante apareceu: "Bem-vind{o} a Eldoria".',
    day:'Dia',bag:22,names:true,cap:{xp:1e9},tabs:['Local','Inventário','Próximo dia','Grupo','Ações'],tabIc:['🗺️','🎒','🌅','🧝','✨'],
    stats:[['hl','Vida','❤️'],['mana','Mana','🔮'],['fome','Fome','🍖',1],['san','Ânimo','🌟']],
    roles:{guerreiro:['Guerreir','🗡️'],mago:['Mag','🔮'],arqueiro:['Arqueir','🏹'],clerigo:['Clérig','✨'],ladino:['Ladin','🗝️']},
    hdr:sc=>[`💰 ${sc.ouro}`,`Nível ${sc.lvl}`],
    init:()=>({hl:100,mana:60,fome:20,san:80,lvl:1,xp:0,ouro:40,cls:null,rota:0,arm:0,rank:0}),
    start:sc=>{ ['paoelf','hidromel','pocao'].forEach(id=>addItem(id,null,true)); sc.arma={id:'espada',hp:70}; },
    place:sc=>{ const p=ISK_ROUTE[sc.rota]; return {n:p[0],ic:p[1],thr:p[2],pois:p[3].map(k=>({k,done:0}))}; },
    poi:(sc,p)=>iskPoi(sc,p),
    goal:sc=>['Castelo do Rei Demônio',`Região ${sc.rota+1} de ${ISK_ROUTE.length}`,Math.round(sc.rota/(ISK_ROUTE.length-1)*100)],
    pow:(sc,m)=>8+sc.lvl*3.2+myDmg()*.7+sc.arm*5+crew().reduce((s,c)=>s+5+(c.arma?itV(c.arma.id)*.3:0),0)+m.fight*.1,
    upkeep:sc=>iskUpkeep(sc),
    acts:{
      treinar:{ic:'📖',l:'Treinar habilidade de classe',s:'Experiência',fn:sc=>{ if(!sc.cls){ setTimeout(()=>UI.push(V.scenClass),50); return 'Primeiro preciso escolher uma classe.'; } scStat('mana',-10); scStat('xp',20+sc.lvl*4); return 'Treinei até a mana acabar.'+lvlUp(); }},
      slimes:{ic:'🟢',l:'Caçar monstros nos arredores',s:'XP e moedas',fn:sc=>{ const f=scFight(Math.max(0,ISK_ROUTE[sc.rota][2]-1),'O monstro'); if(f.ok){ const x=15+sc.rota*12, o=rnd(8,20)+sc.rota*6; sc.ouro+=o; scStat('xp',x); if(R.chance(.3)) addItem('couro'); return `Venci ${R.pick(['um bando de slimes','um lobo de duas cabeças','um goblin ladrão','um javali chifrudo','uma aranha gigante'])}: +${x} XP e ${o} moedas.`+lvlUp(); } return f.t; }},
      meditar:{ic:'🧘',l:'Meditar',s:'Recupera mana e ânimo',fn:sc=>{ scStat('mana',rnd(20,35)); scStat('san',rnd(4,8)); return 'Sentei sob os dois sóis e senti a mana voltar.'; }},
      acampar:{ic:'⛺',l:'Acampar e descansar',s:'Vida e ânimo',fn:sc=>{ scStat('hl',rnd(10,18)); scStat('san',5); return 'Fogueira, estrelas desconhecidas e o grupo roncando. Descansei.'; }},
      cozinhar:{ic:'🍲',l:'Cozinhar para o grupo',s:'Ânimo de todos',fn:sc=>{ crew().forEach(c=>c.lv=Math.min(100,c.lv+rnd(4,8))); scStat('san',5); scStat('fome',-10); return R.pick(['Fiz um ensopado de cogumelo que brilhava no escuro. Ninguém morreu.','Ensinei o grupo a fazer pastel. Viraram fãs.','Tentei fazer pizza num forno de anões. Ficou incrível.']); }},
    },
    win:'Derrotei o Rei Demônio em Eldoria',lose:'Acordei no hospital depois do atropelamento',reward:(m,sc)=>{ m.fight=clamp(m.fight+12); st('smarts',6); m.money+=sc.ouro*60; st('happy',10); },
  },
  heroi:{n:'Superpoderes',ic:'🦸',d:'Um raio, um laboratório e um poder novo. Patrulhe a cidade, atenda ocorrências, proteja sua identidade e derrote seu arqui-inimigo.',
    intro:'Um raio atingiu o laboratório onde você estava. Você acordou no hospital e, ao tentar levantar, percebeu que algo em você tinha mudado.',
    day:'Dia',bag:12,cap:{traje:3},tabs:['Bairro','Equipamento','Próximo dia','Aliados','Ações'],tabIc:['🏙️','🧰','🌅','🦸','⚡'],
    stats:[['hl','Vida','❤️'],['san','Sanidade','🧠'],['rep','Reputação','📣'],['sec','Identidade secreta','🎭']],
    roles:{hacker:['Hacker','💻',false],det:['Detetive','🕵️',false],med:['Médic','🩺'],mec:['Inventor','🔧','Inventora'],ex:['Ex-vilão','😈','Ex-vilã']},
    hdr:sc=>[`⚡ ${sc.pw}%`,'Domínio do poder'],
    init:()=>{ const pd=R.pick(POWERS); return {hl:100,san:80,rep:40,sec:80,pw:25,poder:pd,codinome:R.pick(CODI[pd]),inimigo:R.pick(VILOES),pista:0,venc:0,evil:0,traje:0,bairro:'centro',crime:50}; },
    start:sc=>{ addItem('kit',null,true); },
    place:sc=>{ const b=HEROI_BAIRROS[sc.bairro]; const n=rnd(2,4), oc=R.shuffle(HEROI_OC.slice()).slice(0,n); return {n:b[0],ic:b[1],thr:Math.round(sc.crime/30),pois:oc.map(o=>({k:o[0],oc:o,done:0}))}; },
    poi:(sc,p)=>heroiPoi(sc,p),
    goal:sc=>[`Derrotar ${sc.inimigo}`,`${sc.venc} de 3 vitórias · pistas ${sc.pista}%`,Math.round(sc.venc/3*100)],
    pow:(sc,m)=>15+sc.pw*.55+m.fight*.2+sc.traje*6+crew().length*4,
    upkeep:sc=>heroiUpkeep(sc),
    acts:{
      treinar:{ic:'🌀',l:'Treinar o poder',s:'Domínio do poder',fn:sc=>{ const v=rnd(4,8); scStat('pw',v); return `Treinei ${sc.poder} num terreno baldio: +${v}%.`; }},
      limite:{ic:'💢',l:'Testar os limites do poder',s:'Muito domínio · pode dar errado',ap:2,fn:sc=>{ if(pct(.45+sc.pw/250)){ const v=rnd(10,16); scStat('pw',v); return `Fui além do que achava possível: +${v}%.`; } scHurt(rnd(12,22)); scStat('san',-6); return 'O poder saiu do controle. Acordei numa cratera, com o nariz sangrando.'; }},
      investigar:{ic:'🔎',l:`Investigar o arqui-inimigo`,s:'Pistas para o confronto',fn:sc=>{ const v=rnd(10,18)+Math.round(S.me.smarts/12)+(hasRole('det')?8:0)+(hasRole('hacker')?6:0); scStat('pista',v); return `Segui o rastro de ${sc.inimigo}: pistas ${sc.pista}%.`; }},
      confronto:{ic:'💥',l:'Confrontar o arqui-inimigo',s:'Precisa de 60% de pistas',min:sc=>sc.pista>=60,why:'Ainda não sei onde encontrar o arqui-inimigo (60% de pistas).',ap:3,fn:sc=>heroiBoss(sc)},
      disfarce:{ic:'🕶️',l:'Proteger a identidade secreta',s:'Álibis e trocas de roupa',fn:sc=>{ scStat('sec',rnd(10,16)); return R.pick(['Inventei uma consulta no dentista para explicar o sumiço.','Troquei de máscara e mudei o jeito de andar.','Deixei a TV ligada em casa para os vizinhos acharem que eu estava lá.']); }},
      entrevista:{ic:'🎤',l:'Dar entrevista como herói',s:'Reputação · arrisca a identidade',fn:sc=>{ scStat('rep',rnd(8,12)); S.me.fame=clamp(S.me.fame+2); if(R.chance(.35)){ scStat('sec',-12); return 'A entrevista bombou, mas a repórter comentou que minha voz lembra a de alguém…'; } return 'Dei uma entrevista com a voz grossa. A cidade adorou.'; }},
      traje:{ic:'🧵',l:'Melhorar o traje',s:'Mais proteção · $3.000',min:sc=>sc.traje<3,why:'Meu traje já é o melhor possível.',fn:sc=>{ if(S.me.money<3000) return 'Não tenho $3.000 para material decente.'; S.me.money-=3000; sc.traje++; return `Traje novo: ${['','tecido à prova de faca','placas de kevlar','fibra experimental'][sc.traje]}.`; }},
      roubar:{ic:'💰',l:'Usar o poder para roubar',s:'Dinheiro fácil · vira vilão',fn:sc=>{ sc.evil=1; S.me.karma=clamp(S.me.karma-12); const v=rnd(8000,60000); S.me.money+=v; scStat('rep',-15); return `Esvaziei um cofre em segundos: ${fmt(v)}. Ninguém viu. Eu acho.`; }},
      descanso:{ic:'😴',l:'Dormir um dia inteiro',s:'Vida e sanidade',fn:sc=>{ scStat('hl',rnd(10,16)); scStat('san',rnd(6,10)); return 'Desliguei o celular e o rádio da polícia. Dormi catorze horas.'; }},
      aposentar:{ic:'🏁',l:'Pendurar a capa',s:'Encerra a aventura',ap:0,fn:sc=>{ scenEnd(sc.venc>=1,'Pendurei a capa. Os poderes foram sumindo aos poucos, como se nunca tivessem existido.'); return ''; }},
    },
    capWin:sc=>sc.venc>=1,
    win:'Vivi como super-herói',lose:'Meus poderes sumiram',reward:(m,sc)=>{ m.fame=clamp(m.fame+15); m.karma=clamp(m.karma+(sc.evil?-10:10)); st('happy',10); },
  },
  marte:{n:'Colônia em Marte',ic:'🚀',d:'Você está na primeira colônia em Marte. Mantenha o oxigênio, a comida e a sanidade da equipe até a nave de resgate chegar.',
    intro:'A nave pousou no planeta vermelho. Seis colonos, um habitat inflável e muita poeira. Bem-vind{o} a Marte. A nave de resgate chega no sol 30.',
    day:'Sol',bag:20,tabs:['Base','Estoque','Próximo sol','Colonos','Ações'],tabIc:['🛰️','📦','🌅','👩‍🚀','⚡'],
    stats:[['hl','Saúde','❤️'],['san','Sanidade','🧠'],['fome','Fome','🍗',1],['o2','Oxigênio','🫧']],
    roles:{eng:['Engenheir','🔧'],bot:['Botânic','🌱'],med:['Médic','🩺'],geo:['Geólog','🪨'],pil:['Piloto','🛸',false]},
    hdr:sc=>[`🔬 ${sc.ciencia}%`,'Pesquisa'],
    init:()=>({hl:95,san:80,fome:20,o2:80,ciencia:0,rover:0,site:'habitat',energia:70}),
    start:sc=>{ for(let i=0;i<4;i++) mkCrew({age:rnd(28,50)}); ['liof','liof','liof','liof','pasta','pasta','batata','batata','o2','o2','kit','remendo','pecas','pecas'].forEach(id=>addItem(id,null,true)); },
    place:sc=>{ const s=MARTE_SITES[sc.site||'habitat']; return {n:s[0],ic:s[1],thr:s[3]||0,pois:s[2].map(k=>({k,done:0}))}; },
    poi:(sc,p)=>martePoi(sc,p),
    goal:sc=>['Nave de resgate',`Sol ${sc.dia} de 30`,Math.round(Math.min(sc.dia,30)/30*100)],
    upkeep:sc=>marteUpkeep(sc),
    acts:{
      o2fix:{ic:'🫧',l:'Consertar o gerador de oxigênio',s:'Oxigênio · inteligência ajuda',fn:sc=>{ if(pct(.55+S.me.smarts/250+(hasRole('eng')?.15:0))){ const v=rnd(15,25); scStat('o2',v); return `Gerador ronronando de novo: +${v}% de oxigênio.`; } scHurt(8); return 'Levei um choque e o gerador continuou engasgando.'; }},
      plantar:{ic:'🥔',l:'Cuidar da estufa',s:'Batatas para os próximos sóis',fn:sc=>{ const n=hasRole('bot')?4:3; for(let i=0;i<n;i++) addItem('batata',rnd(80,100),true); return `Colhi ${n} batatas marcianas. Adubo: melhor não perguntar.`; }},
      terra:{ic:'📡',l:'Falar com a Terra',s:'Sanidade',fn:sc=>{ scStat('san',rnd(8,12)); return 'Mandei um vídeo para casa. A resposta chegou vinte minutos depois, com todo mundo acenando.'; }},
      festa:{ic:'🎉',l:'Fazer uma festa na base',s:'Moral da equipe',fn:sc=>{ crew().forEach(c=>c.lv=Math.min(100,c.lv+rnd(6,10))); scStat('san',8); scStat('fome',4); return 'Festa com batata frita marciana e música dos anos 80. A equipe precisava disso.'; }},
      rover:{ic:'🚙',l:'Consertar o rover',s:'Libera expedições distantes',min:sc=>!sc.rover,why:'O rover já está funcionando.',ap:2,fn:sc=>{ if(takeItem('pecas')&&pct(.5+S.me.smarts/250+(hasRole('eng')?.15:0))){ sc.rover=1; return 'O rover ligou! Agora dá para ir longe.'; } return 'Faltou peça, ou faltou jeito. O rover continua morto.'; }},
      exerc:{ic:'🏋️',l:'Exercícios contra a gravidade baixa',s:'Saúde',fn:sc=>{ scStat('hl',rnd(6,10)); return 'Duas horas na esteira presa por elásticos. Meus ossos agradecem.'; }},
      estudar:{ic:'🔬',l:'Analisar amostras',s:'Pesquisa',fn:sc=>{ const v=rnd(4,8)+Math.round(S.me.smarts/20)+(hasRole('geo')?4:0); scStat('ciencia',v); return `Microscópio, poeira vermelha e paciência: pesquisa ${sc.ciencia}%.`; }},
    },
    win:'Voltei de Marte',lose:'Acordei: Marte era só um sonho',reward:(m,sc)=>{ m.fame=clamp(m.fame+20); m.money+=20000+sc.ciencia*500; st('smarts',5); st('happy',10); },
  },
};
// ---------- detalhes de cada modo ----------
function zPoi(sc,p){ const d=Z_POI[p.k], thr=sc.loc.thr; let t='';
  const risk=.05+thr*.08+d[3]-(hasRole('bat')?.06:0);
  if(R.chance(risk)){ const f=scFight(thr+(R.chance(.2)?1:0),'Um grupo de zumbis'); if(!f.ok) return `${d[1]} ${d[0]}: zumbis saíram de todos os lados. ${f.t}`; t+='Zumbis apareceram, mas demos conta deles. '; }
  const n=rnd(1,3), got=[]; for(let i=0;i<n;i++) if(R.chance(.8)) got.push(R.pick(d[2])); if(R.chance(.45)) got.push(R.pick(['lata','miojo','biscoito','agua','sardinha','barra']));
  t+=got.length?lootText(got).trim():'Já tinham passado por aqui. Nada de útil.';
  if(d[4]==='veh'&&R.chance(.3)){ const k=R.pick(['sedan','van','moto','viatura','ambulancia','jipe','onibus','caminhao','kombi']); sc.veh.push({k,hp:rnd(30,80)}); t+=` E mais: ${VEH[k][1]} ${VEH[k][0]} com a chave no contato!`; }
  if(d[4]==='surv'&&R.chance(.25)){ const c=mkCrew(); t+=` Encontrei ${c.first}, ${roleName(c).toLowerCase()}, escondid${oaG(c.gender)} lá dentro. Juntou-se ao comboio.`; }
  if(d[4]==='gas'&&R.chance(.4)){ addItem('gas'); t+=' Ainda tinha um restinho nas bombas.'; }
  return `${d[1]} ${d[0]}: ${t}`; }
function zUpkeep(sc){ const m=S.me;
  if(!sc.stay){ // cada carro gasta cerca de um terço de galão por etapa
    sc.gasF=(sc.gasF||0)+sc.veh.length*.35; let need=Math.floor(sc.gasF);
    while(need>countCat('gas')&&sc.veh.length>0){ const v=sc.veh.sort((a,b)=>VEH[a.k][3]-VEH[b.k][3]).shift(); sc.gasF=Math.max(0,sc.gasF-.5); need=Math.floor(sc.gasF); scLog(`Sem combustível para ${VEH[v.k][0].toLowerCase()}. Ficou para trás.`,'warn'); }
    for(let i=0;i<need;i++){ takeItem('gas'); sc.gasF-=1; }
    sc.etapa++; if(!sc.veh.length){ scHurt(5); scStat('fome',6); scLog('Seguimos a pé. Cada quilômetro pesa.','warn'); }
    sc.veh.forEach(v=>v.hp-=rnd(3,9)-(hasRole('mec')?2:0)); const broke=sc.veh.filter(v=>v.hp<=0); if(broke.length){ sc.veh=sc.veh.filter(v=>v.hp>0); broke.forEach(v=>scLog(`${VEH[v.k][0]} quebrou de vez. Tivemos que abandonar.`,'bad')); }
    sc.loc=SM().place(sc); }
  else { sc.loc.pois.forEach(p=>{ if(R.chance(.35)) p.done=0; }); if(R.chance(.4)) sc.loc.thr=Math.min(4,sc.loc.thr+1); }
  sc.stay=0;
  // capacidade: pessoas e carga
  const ppl=crew().length+1, st0=seats(); if(!sc.zb&&sc.veh.length&&ppl>st0) queue('z_lotado',{}); else if(sc.inv.length>bagCap()) queue('z_lotado',{});
  // ataque de madrugada
  if(!sc.zb&&R.chance(.08+sc.loc.thr*.05-(sc.vig?.08:0))){ const f=scFight(sc.loc.thr,'O ataque de madrugada'); scLog(f.ok?'Zumbis atacaram de madrugada. A vigia segurou.':f.t,f.ok?'warn':'bad'); }
  sc.vig=0;
  if(sc.inf){ sc.inf++; if(sc.inf>=5){ scenEnd(false,'A febre da mordida venceu. A última coisa que vi foi o grupo se afastando de mim, devagar.'); return; } scLog('A mordida está queimando.','bad'); }
  if(sc.etapa>=20&&!sc.fim) { sc.fim=1; queue('z_final',{}); } }
function ilhaPoi(sc,p){ const d=ILHA_POI[p.k]; let t='';
  if(R.chance(d[3])){ const r=R.pick(['Pisei num ouriço.','Uma cobra deu o bote na minha perna.','Escorreguei numa pedra lisa.','Um caranguejo enorme não gostou de mim.']); scHurt(rnd(5,12)); t+=r+' '; }
  if(p.k==='topo'){ scStat('sos',rnd(10,18)); return `${d[1]} ${d[0]}: daqui dá para ver o mar inteiro. Fiz uma pilha de galhos para sinalizar: sinal ${sc.sos}%.`; }
  const n=rnd(1,2)+(hasRole('pes')&&/mar|cora|poç/.test(p.k)?1:0), got=[]; for(let i=0;i<n;i++) if(R.chance(.8)) got.push(R.pick(d[2]));
  t+=got.length?lootText(got).trim():'Não achei nada hoje.';
  if(R.chance(.06)&&!sc.bola&&p.k==='bagagem'){ sc.bola=1; t+=' Achei uma bola de vôlei. Desenhei um rosto nela com sangue do dedo. Agora tenho companhia.'; }
  if(R.chance(.05)&&crew().length<4){ const c=mkCrew(); t+=` E… ${c.first}! Outr${oaG(c.gender)} sobrevivente do voo, magr${oaG(c.gender)} e queimad${oaG(c.gender)} de sol. Não estou mais sozinh${oa()}.`; }
  if(R.chance(.08)&&!sc.inv.some(x=>x.id==='semente')&&p.k!=='bagagem') { addItem('semente'); }
  return `${d[1]} ${d[0]}: ${t}`; }
function ilhaUpkeep(sc){ sc.loc=SM().place(sc);
  scStat('sede',12+crew().length*2); scStat('abrigo',-6); if(sc.fogo&&R.chance(.35)){ sc.fogo=0; scLog('A chuva apagou a fogueira.','warn'); }
  if(sc.sede>=100){ scHurt(15); scLog('A sede está me enlouquecendo.','bad'); }
  if(sc.abrigo<20&&R.chance(.4)){ scHurt(6); scStat('san',-4); scLog('Choveu a noite toda e eu não tinha onde me esconder.','warn'); }
  if(R.chance(sc.sos/250+(sc.fogo?.04:0)+sc.dia*.003)){ queue('ilha_navio',{}); } }
function iskPoi(sc,p){ const d=ISK_POI[p.k], tier=ISK_ROUTE[sc.rota][2];
  if(d[4]==='guilda'){ const o=rnd(20,45)*(sc.rank+1)+tier*10, x=20+tier*10; sc.ouro+=o; scStat('xp',x); let t=`Cumpri uma missão da guilda (${R.pick(['escoltar uma caravana','caçar lobos gigantes','entregar uma poção urgente','achar o gato da duquesa','limpar o porão da taverna'])}): ${o} moedas e ${x} XP.`;
    if(sc.lvl>=(sc.rank+1)*3&&sc.rank<6){ sc.rank++; t+=` A guilda me promoveu ao rank ${'FEDCBAS'[sc.rank]}!`; } return t+lvlUp(); }
  if(d[4]==='taverna'){ if(sc.ouro<10) return 'Sem 10 moedas, o taverneiro me mostrou a porta.'; sc.ouro-=10; scStat('hl',15); scStat('san',8); let t='Hidromel, música de bardo e uma cama de palha.';
    if(R.chance(.35)&&crew().length<5){ const c=mkCrew(); t+=` ${c.first}, ${c.race} ${roleName(c).toLowerCase()}, ouviu minhas histórias e quis entrar no grupo!`; } return t; }
  if(d[4]==='mercado'){ const sell=sc.inv.filter(x=>itCat(x.id)==='venda'); let t=''; if(sell.length){ const v=sell.reduce((s,x)=>s+Math.round(itV(x.id)*x.hp/100),0); sc.inv=sc.inv.filter(x=>itCat(x.id)!=='venda'); sc.ouro+=v; t=`Vendi espólios por ${v} moedas. `; }
    if(sc.ouro>=30){ sc.ouro-=30; addItem('pocao'); addItem(R.pick(['paoelf','carne','queijo'])); t+='Comprei uma poção e comida para a estrada.'; } return t||'Olhei tudo e não comprei nada.'; }
  if(d[4]==='ferreiro'){ const c=60+sc.arm*70; if(sc.ouro<c) return `O ferreiro cobra ${c} moedas para melhorar minha armadura.`; sc.ouro-=c; sc.arm++; return `Armadura melhorada: ${['Couro batido','Cota de malha','Armadura de placas','Armadura de mithril','Armadura divina'][Math.min(4,sc.arm-1)]}.`; }
  if(d[4]==='templo'){ scStat('hl',25); scStat('mana',20); S.me.karma=clamp(S.me.karma+2); return 'A sacerdotisa me abençoou. Ferimentos fechando sozinhos.'; }
  if(d[4]==='academia'){ st('smarts',2); scStat('mana',10); scStat('xp',30+tier*8); let t='Assisti a uma aula de runas antigas. Entendi um terço. Já é algo.'; if(sc.ouro>=40&&typeof learnSpell==='function'&&R.chance(.6)){ const l=learnSpell(sc,true); if(l){ sc.ouro-=40; t+=` Paguei 40 moedas por uma aula particular. ${l}`; } } return t; }
  if(d[4]==='rei') return sc.hero?'O trono do Rei Demônio está vazio. Sentei nele por um minuto. Desconfortável.':iskBoss(sc);
  const dodge=sc.buff&&sc.buff.luz&&R.chance(.45); const f=d[4]==='luta'&&!dodge?scFight(Math.max(1,tier+(R.chance(.3)?1:0)-1),R.pick(['O guardião','O monstro','A criatura'])):{ok:true};
  if(!f.ok) return `${d[1]} ${d[0]}: ${f.t}`;
  const x=d[4]==='luta'?25+tier*14:10, o=d[4]==='luta'?rnd(10,30)*tier:rnd(0,10); sc.ouro+=o; scStat('xp',x);
  const got=[]; d[2].forEach(id=>{ if(R.chance(sc.buff&&sc.buff.luz?.8:.5)) got.push(id); });
  return `${d[1]} ${d[0]}: ${dodge?'A luz mostrou um caminho escondido. Passei sem lutar. ':''}${d[4]==='luta'?R.pick(['Derrotei o guardião do lugar.','Venci uma criatura de olhos vermelhos.','Saí vitorios'+oa()+' de uma emboscada.']):'Explorei com calma.'} +${x} XP${o?` e ${o} moedas`:''}.${lootText(got)}`+lvlUp(); }
function iskUpkeep(sc){ if(!sc.cls&&!sc.asked){ sc.asked=1; setTimeout(()=>{ if(S.scen&&!S.scen.cls) UI.open(V.scenClass); },200); }
  if(!sc.stay&&sc.rota<ISK_ROUTE.length-1&&sc.travel){ sc.rota++; scLog(`Seguimos viagem até ${ISK_ROUTE[sc.rota][0]}.`,'good'); }
  sc.travel=0; sc.stay=0; sc.loc=SM().place(sc); scStat('mana',10);
  if(R.chance(.15)){ const f=scFight(Math.max(0,ISK_ROUTE[sc.rota][2]-1),'A emboscada na estrada'); scLog(f.ok?'Bandidos tentaram nos emboscar. Saíram correndo.':f.t,f.ok?'good':'bad'); } }
function iskBoss(sc){ const p=scPow(); if(pct(.25+(p-60)/80)){ queue('isekai_fim',{}); return 'Depois de uma batalha que durou a noite inteira, o Rei Demônio caiu de joelhos. Eldoria está livre!'; }
  scHurt(rnd(30,45)); return 'O Rei Demônio riu e me jogou longe com um gesto. Preciso ficar mais forte.'; }
function heroiPoi(sc,p){ const [n,ic,thr,tipo]=p.oc;
  if(tipo==='pista'){ const v=rnd(12,22)+(hasRole('det')?6:0); scStat('pista',v); if(thr>0){ const f=scFight(thr,'Os capangas'); if(!f.ok) return `${ic} ${n}: ${f.t}`; } return `${ic} ${n}: descobri algo sobre ${sc.inimigo}. Pistas ${sc.pista}%.`; }
  if(tipo==='resgate'){ if(pct(.55+sc.pw/200-thr*.08)){ const r=4+thr*2; scStat('rep',r); S.me.karma=clamp(S.me.karma+2); scStat('sec',-2); S.me.fame=clamp(S.me.fame+1); return `${ic} ${n}: ${R.pick(['Tirei todo mundo a tempo.','Ninguém se feriu. A multidão aplaudiu.','Uma criança me deu um desenho de agradecimento.','Viralizou. Todo mundo filmou.'])} Reputação +${r}.`; }
    scHurt(rnd(6,14)); scStat('rep',-3); return `${ic} ${n}: cheguei tarde demais para ajudar todo mundo. Os jornais não perdoaram.`; }
  const f=scFight(thr,'Os bandidos'); if(f.ok){ const r=5+thr*2; scStat('rep',r); scStat('crime',-6); S.me.fame=clamp(S.me.fame+1); return `${ic} ${n}: ${R.pick(['Entreguei todos amarrados na porta da delegacia.','Parei os bandidos antes que alguém se machucasse.','Os criminosos se renderam só de me ver chegando.'])} Reputação +${r}.`; }
  return `${ic} ${n}: ${f.t}`; }
function heroiBoss(sc){ const p=scPow(); sc.pista=0;
  if(pct(.32+(p-50)/85)){ sc.venc++; scStat('rep',15); S.me.fame=clamp(S.me.fame+5); if(sc.venc>=3){ queue('heroi_final',{}); return `${sc.inimigo} caiu pela terceira vez. Desta vez, não tem para onde fugir.`; } return `Derrotei ${sc.inimigo}! Mas ${R.pick(['fugiu numa nuvem de fumaça','foi resgatad'+'o por capangas','escapou da van da polícia'])}. Vitórias: ${sc.venc} de 3.`; }
  scHurt(rnd(22,35)); scStat('san',-8); return `${sc.inimigo} estava me esperando. Saí carregad${oa()} dos escombros.`; }
function heroiUpkeep(sc){ scStat('sec',-4+sc.traje); scStat('crime',5); scStat('rep',-1); if(sc.sec<=0){ sc.sec=35; scStat('san',-15); scLog('Minha identidade vazou. Tem repórter acampado na minha porta.','bad'); }
  if(sc.crime>=85&&R.chance(.5)){ scStat('rep',-6); scLog('A cidade está um caos. Picharam "CADÊ VOCÊ?" no prédio da prefeitura.','warn'); }
  if(R.chance(.12)){ scHurt(rnd(5,12)); scLog(`${sc.inimigo} atacou a cidade durante a noite. Lutei até o amanhecer.`,'warn'); }
  sc.loc=SM().place(sc); }
function martePoi(sc,p){ const d=MARTE_POI[p.k], far=(MARTE_SITES[sc.site][3]||0); let t='';
  if(far&&R.chance(d[3])){ const r=R.pick(['O traje rasgou num espinho de rocha. Voltei com o alarme apitando.','Uma tempestade de poeira me cegou por horas.','Caí num buraco escondido sob a areia fina.']); scHurt(rnd(8,16)); scStat('o2',-6); t+=r+' '; }
  if(d[4]==='treino'){ scStat('hl',6); return `${d[1]} ${d[0]}: ${t}Treinei e tomei uma ducha de 30 segundos. Luxo.`; }
  if(d[4]==='o2'){ scStat('o2',rnd(8,14)); return `${d[1]} ${d[0]}: ${t}Limpei a poeira dos painéis. A energia subiu e o oxigênio também.`; }
  if(d[4]==='ciencia'){ const v=rnd(8,14)+(hasRole('geo')?5:0); scStat('ciencia',v); return `${d[1]} ${d[0]}: ${t}Amostras incríveis. Pesquisa ${sc.ciencia}%.`; }
  if(d[4]==='vida'){ if(!sc.vida&&R.chance(.35)){ sc.vida=1; scStat('ciencia',25); S.me.fame=clamp(S.me.fame+10); return `${d[1]} ${d[0]}: ${t}SÃO MICRÓBIOS FOSSILIZADOS. Há vida, ou houve, em Marte. A Terra enlouqueceu com a notícia.`; } scStat('ciencia',6); return `${d[1]} ${d[0]}: ${t}Formas estranhas na rocha. Pode ser nada. Pode ser tudo.`; }
  const got=[]; d[2].forEach(id=>{ if(R.chance(.6)) got.push(id); }); return `${d[1]} ${d[0]}: ${t}${got.length?lootText(got).trim():'Nada aproveitável hoje.'}`; }
function marteUpkeep(sc){ const n=crew().length+1; scStat('o2',-(2+n*1.5)+4); scStat('fome',2); sc.site='habitat'; sc.loc=SM().place(sc);
  if(R.chance(.15)){ scStat('o2',-12); scLog('Uma tempestade de areia cobriu os painéis solares.','bad'); }
  if(sc.o2<=0){ scHurt(25); scStat('san',-10); scLog('O oxigênio acabou por horas. Respirei como um peixe fora d\'água.','bad'); }
  crew().forEach(c=>{ if(c.lv<12&&R.chance(.4)) crewLeave(c,`${c.first} se trancou no módulo de carga e não fala mais com ninguém.`); });
  if(sc.dia>=30&&!sc.fim){ sc.fim=1; queue('marte_fim',{}); } }

// ---------- dia a dia ----------
function scStart(id){ const m=S.me, d=SCEN[id];
  S.scen=Object.assign({id,v:SC_V,dia:1,ap:3,done:{},crew:[],inv:[],veh:[],cid:0,arma:null,log:[],car:Math.round((m.looks+m.happy+m.karma)/3),kills:0,ev:{},evN:{}},d.init(m));
  const sc=S.scen; sc.log=[{d:1,pl:'',lines:[]}]; scLog(fill(d.intro.replace(/\{o\}/g,oa())),'warn'); d.start&&d.start(sc); sc.loc=d.place(sc); sc.log[0].pl=sc.loc.n;
  if(id==='isekai') setTimeout(()=>{ if(S.scen&&S.scen.id==='isekai'&&!S.scen.cls) UI.open(V.scenClass); },150);
  S.pending=S.pending.filter(e=>EVENTS[e.id]&&EVENTS[e.id].scen);
  log(`${d.ic} Comecei uma aventura: ${d.n}.`,'warn'); cnt('scen_'+id); scEvents(1); }
function scEvents(n){ const sc=S.scen, m=S.me; if(!sc) return;
  let elig=Object.entries(EVENTS).filter(([id,e])=>e.scen===sc.id&&e.w&&!(sc.ev[id]!=null&&sc.dia-sc.ev[id]<(e.cd||25))&&(()=>{ try{ return !e.when||e.when(m); }catch(err){ return false; } })());
  while(n-->0&&elig.length){ const id=R.wpick(elig.map(([id,e])=>[id,e.w/(1+2*(sc.evN[id]||0))])); elig=elig.filter(([x])=>x!==id);
    const ev=EVENTS[id]; let d; try{ d=ev.prep?ev.prep(m):{}; }catch(err){ d=null; } if(d==null) continue; queue(id,d); sc.ev[id]=sc.dia; sc.evN[id]=(sc.evN[id]||0)+1; } }
function scNextDay(){ const sc=S.scen, d=SM(), m=S.me; if(!sc) return;
  sc.dia++; sc.ap=3; sc.done={}; sc.log.push({d:sc.dia,pl:'',lines:[]});
  const hasF=d.stats.some(x=>x[0]==='fome'); if(hasF) scStat('fome',(sc.id==='marte'?8:10)); scStat('san',sc.id==='heroi'?-1:-2);
  // comida estraga e o grupo come
  sc.inv.forEach(x=>{ if(['comida','agua'].includes(itCat(x.id))) x.hp-=rnd(2,7); }); const bad=sc.inv.filter(x=>x.hp<=0); if(bad.length){ sc.inv=sc.inv.filter(x=>x.hp>0); scLog(`${bad.length===1?itN(bad[0].id)+' estragou':bad.length+' itens estragaram'}. Joguei fora.`,'warn'); }
  if(hasF) crew().slice().forEach(c=>{ if(!R.chance(.4)) return; const f=takeItem('@comida')||(sc.id==='ilha'?takeItem('@agua'):null); if(f){ c.hp=Math.min(100,c.hp+4); } else { c.lv-=7; c.hp-=4; }
    if(c.hp<=0) crewLeave(c,`${c.first} morreu de fome.`,true); else if(c.lv<=8){ crewLeave(c,`${c.first} foi embora no meio da noite${sc.id==='zumbi'&&sc.veh.length>1&&R.chance(.4)?(sc.veh.pop(),', levando um dos carros'):''}.`); } });
  if(sc.fome>=100){ scHurt(12); scLog('Fome de verdade. Minhas mãos tremem.','bad'); }
  if(sc.fome>=75){ const f=takeItem('@comida'); if(f){ scStat('fome',-Math.round(itV(f.id)*f.hp/100)); scLog(`Comi ${itN(f.id).toLowerCase()} antes de desmaiar de fome.`); } }
  if(sc.id==='ilha'&&sc.sede>=75){ const a=takeItem('@agua'); if(a){ scStat('sede',-Math.round(itV(a.id)*a.hp/100)); scLog(`Bebi ${itN(a.id).toLowerCase()}.`); } }
  if((!hasF||sc.fome<60)&&!(sc.sede!=null&&sc.sede>=70)) scStat('hl',sc.id==='isekai'?5:3);
  d.upkeep(sc); if(!S.scen) return;
  sc.log[sc.log.length-1].pl=sc.loc.n; scLog(`${sc.loc.ic} ${sc.loc.n}${sc.id==='zumbi'?` · ameaça zumbi: ${THREAT[sc.loc.thr].toLowerCase()}`:''}`);
  if(sc.dia>=(d.maxDays||60)&&S.scen) { const w=d.capWin?d.capWin(sc):true; scenEnd(w,w?'Os dias viraram semanas, as semanas viraram rotina. Um dia, simplesmente acabou.':'O tempo passou e a missão ficou pela metade. Acordei com a sensação de que faltou alguma coisa.'); return; }
  scEvents(1+(R.chance(.55)?1:0)); }
function scCheck(){ const sc=S.scen; if(!sc||sc.v!==SC_V) return; const d=SM();
  if(sc.winNow){ scenEnd(true,{zumbi:'Chegamos. Acabou.',ilha:'O barco chegou de verdade. Me enrolaram num cobertor e me deram um sanduíche. Acabou.',isekai:'A luz da deusa me envolveu. Acabou.',heroi:'A cidade está em paz. Acabou.',marte:'A nave decolou rumo à Terra. Acabou.'}[sc.id]); return; }
  if(sc.hl<=0) scenEnd(false,{zumbi:'Tudo ficou escuro. Senti dentes, gritos, e então… acordei suando frio na minha cama.',ilha:'Desmaiei na areia quente. Quando abri os olhos, estava no meu quarto, com o ventilador ligado.',isekai:'A luz branca voltou. Acordei no hospital, com tubos no braço e uma enfermeira dizendo que eu tive sorte.',heroi:'Caí do alto de um prédio. Antes de bater no chão, acordei. Os poderes tinham sumido.',marte:'O alarme de despressurização foi a última coisa que ouvi. Acordei na Terra, ofegante.'}[sc.id]);
  else if(sc.san<=0) scenEnd(false,'Minha cabeça não aguentou. Comecei a rir sozinh'+oa()+' e não parei mais. Até acordar.'); }
function scenEnd(win,txt){ const sc=S.scen; if(!sc) return; const d=SCEN[sc.id], m=S.me, days=sc.dia;
  scLog(txt,win?'good':'bad'); S.scen=null; S.pending=S.pending.filter(e=>!(EVENTS[e.id]&&EVENTS[e.id].scen));
  const wl=fill((win?d.win:d.lose).replace(/\{o\}/g,oa()));
  log(`${d.ic} ${wl}: ${days} ${d.day.toLowerCase()}${days>1?'s':''} de aventura.`,win?'good':'warn');
  if(win){ cnt('scenWin'); d.reward(m,sc); } else st('happy',-3);
  MQ.unshift({k:d.n,t:win?'Fim da aventura':'Você acordou',x:`${txt}\n\n${days} ${d.day.toLowerCase()}${days>1?'s':''} · ${sc.kills?sc.kills+' inimigos derrotados · ':''}${sc.crew.length} ${sc.crew.length===1?'pessoa':'pessoas'} no grupo no final.`});
  UI.close(); }
function bite(){ const sc=S.scen; if(!sc||sc.id!=='zumbi') return ''; if(sc.inf) return 'Por pouco não fui mordid'+oa()+' de novo.'; sc.inf=1; queue('zumbi_mordida',{}); return 'Um zumbi me mordeu no braço.'; }
function lvlUp(){ const sc=S.scen; let t=''; while(sc&&sc.id==='isekai'&&sc.xp>=sc.lvl*100){ sc.xp-=sc.lvl*100; sc.lvl++; sc.hl=Math.min(100,sc.hl+15); t=` Subi para o nível ${sc.lvl}!`;
    if(sc.cls&&[5,10,15].includes(sc.lvl)){ const s=CLASSES[sc.cls].sk[sc.lvl/5-1]; t+=` Aprendi ${s}!`; } }
  return t; }
function scUse(x){ const sc=S.scen, c=itCat(x.id), v=Math.round(itV(x.id)*Math.max(.3,x.hp/100));
  const rm=()=>{ sc.inv=sc.inv.filter(y=>y!==x); };
  if(c==='comida'){ rm(); scStat('fome',-Math.round(v*(hasRole('coz')?1.3:1))); scStat('san',1); if(x.hp<30&&R.chance(.3)){ scHurt(6); return `Comi ${itN(x.id).toLowerCase()}. Estava passad${'o'}… meu estômago reclamou.`; } return `Comi ${itN(x.id).toLowerCase()}.`; }
  if(c==='agua'){ rm(); scStat('sede',-v); return `Bebi ${itN(x.id).toLowerCase()}. Vida.`; }
  if(c==='remedio'){ rm(); scStat('hl',Math.round(v*(hasRole('med')?1.4:1))); return `Usei ${itN(x.id).toLowerCase()}.`; }
  if(c==='mana'){ rm(); scStat('mana',v); return 'A mana voltou a correr nas veias.'; }
  if(c==='san'){ x.hp-=35; if(x.hp<=0) rm(); scStat('san',v); return {livro:'Li algumas páginas. Por um tempo, estive em outro lugar.',baralho:'Joguei paciência até a cabeça esvaziar.',foto:'Olhei a foto por muito tempo. Lembrei por que continuo.',violao:'Toquei as músicas que lembrava. Cinco cordas bastaram.',calm:'O calmante bateu. Respirei fundo.'}[x.id]||'Me senti melhor.'; }
  if(c==='o2'){ rm(); scStat('o2',v); return 'Liguei o cilindro na rede da base.'; }
  if(c==='vacina'){ rm(); if(sc.inf){ if(R.chance(.6)){ sc.inf=0; return 'A vacina experimental queimou como fogo, mas a mordida parou de espalhar.'; } return 'Apliquei a vacina. Nada mudou.'; } return 'Tomei a vacina por precaução. Braço dolorido.'; }
  if(c==='sinal'){ rm(); if(sc.id==='ilha'&&R.chance(.12+sc.sos/250)){ queue('ilha_navio',{}); return 'O sinalizador riscou o céu vermelho…'; } return 'O sinalizador subiu e apagou. Ninguém viu.'; }
  return 'Não sei bem o que fazer com isso.'; }
function scAct(fn,title){ if(!S.scen) return; let r; try{ r=fn(); }catch(e){ showErr(e); return; } cnt('actions'); if(r) { scLog(r); modal({t:title||'',x:r}); } after(); }
function spend(k,ap){ const sc=S.scen; if(sc.ap<ap) return false; sc.ap-=ap; if(k) sc.done[k]=1; return true; }
// ---------- telas ----------
const apDots=sc=>'⚡'.repeat(sc.ap)+'○'.repeat(Math.max(0,3-sc.ap));
function scStatusCard(sc){ const d=SM(), g=d.goal(sc); return `<div class="card"><p><b>${d.ic} ${esc(d.n)}</b> · ${d.day} ${sc.dia}</p>${bar(g[0],Math.max(0,Math.min(100,g[2])))}<p style="color:var(--muted);font-size:13px">${esc(g[1])}</p>${kv('Energia do dia',apDots(sc))}</div>`; }
V.scLocal=()=>{ const sc=S.scen, d=SM(), it=[], l=sc.loc;
  it.push({html:`<div class="card"><p><b>${l.ic} ${esc(l.n)}</b></p>${sc.id==='zumbi'?kv('Ameaça zumbi',THREAT[l.thr]):sc.id==='heroi'?kv('Criminalidade',sc.crime+'%'):''}${kv('Energia do dia',apDots(sc))}</div>`});
  it.push({sec:sc.id==='heroi'?'Ocorrências':'Pontos de interesse'});
  l.pois.forEach(p=>{ const def=sc.id==='zumbi'?Z_POI[p.k]:sc.id==='ilha'?ILHA_POI[p.k]:sc.id==='isekai'?ISK_POI[p.k]:sc.id==='marte'?MARTE_POI[p.k]:p.oc; if(!def) return;
    const isRei=sc.id==='isekai'&&def[4]==='rei', ap=isRei?3:1;
    it.push({ic:def[1],l:def[0],s:p.done?'Já fui hoje':isRei?'A batalha final':`${ap} de energia`,dis:!!p.done||sc.ap<ap,why:p.done?'Já explorei esse lugar hoje.':'Sem energia hoje. Passe para o próximo dia.',r:p.done?'✓':'⚡'.repeat(ap),
      on:()=>scAct(()=>{ if(!spend(null,ap)) return 'Sem energia.'; p.done=1; return d.poi(sc,p); },def[0])}); });
  if(sc.id==='zumbi'||sc.id==='isekai'){ it.push({sec:'Viagem'});
    if(sc.id==='zumbi') it.push({ic:sc.stay?'🛑':'🚙',l:sc.stay?'Vamos ficar mais um dia aqui':'Vamos partir amanhã cedo',s:sc.stay?'Toque para partir amanhã':'Toque para atrasar a partida (os pontos de interesse podem reabastecer)',on:()=>{ sc.stay=sc.stay?0:1; UI.refresh(); }});
    else { const nx=ISK_ROUTE[sc.rota+1]; it.push({ic:sc.travel?'🐎':'🏕️',l:nx?(sc.travel?`Partir amanhã para ${nx[0]}`:'Ficar nesta região amanhã'):'Fim da estrada',s:nx?(sc.travel?'Toque para ficar mais um dia':`Toque para partir · perigo de ${nx[0]}: ${'★'.repeat(nx[2])}`):'Daqui só resta o castelo',dis:!nx,why:'Não há para onde ir. Só o castelo.',on:()=>{ sc.travel=sc.travel?0:1; UI.refresh(); }}); } }
  if(sc.id==='ilha'||sc.id==='heroi'||sc.id==='marte'){ it.push({sec:'Ir para'});
    const zones=sc.id==='ilha'?ILHA_ZONES:sc.id==='heroi'?HEROI_BAIRROS:MARTE_SITES, cur=sc.id==='ilha'?sc.zona:sc.id==='heroi'?sc.bairro:sc.site;
    Object.entries(zones).filter(([k])=>k!==cur).forEach(([k,z])=>{ const far=sc.id==='marte'&&(z[3]||0)>0, need=far&&z[3]>1&&!sc.rover;
      it.push({ic:z[1],l:z[0],s:need?'Precisa do rover':far?'Caminhada de traje · 1 de energia':'1 de energia',dis:need||sc.ap<1,why:need?'Esse lugar é longe demais sem o rover.':'Sem energia hoje.',
        on:()=>scAct(()=>{ if(!spend(null,1)) return 'Sem energia.'; if(sc.id==='ilha') sc.zona=k; else if(sc.id==='heroi') sc.bairro=k; else { sc.site=k; if(far) scStat('o2',-5); } sc.loc=d.place(sc); return `Fui para ${z[0].toLowerCase().replace(/^(.)/,c=>c)}.`; },z[0])}); }); }
  return {title:d.tabs[0],items:it}; };
V.scActs=()=>{ const sc=S.scen, d=SM(), it=[{html:scStatusCard(sc)},{sec:'Ações do dia'}];
  Object.entries(d.acts).forEach(([k,a])=>{ const ap=a.ap??1, lock=a.min&&!a.min(sc), done=!!sc.done[k];
    it.push({ic:a.ic,l:a.l,s:a.s,r:done?'✓':ap?'⚡'.repeat(ap):'',dis:lock||done||sc.ap<ap,why:lock?(a.why||'Ainda não dá.'):done?'Já fiz isso hoje. Amanhã de novo.':'Sem energia hoje. Passe para o próximo dia.',
      on:()=>scAct(()=>{ if(!spend(k,ap)) return 'Sem energia.'; return a.fn(sc,S.me)||''; },a.l)}); });
  if(sc.id==='isekai') it.push({ic:'🧙',l:'Minha classe',s:sc.cls?clsName(sc.cls):'Ainda não escolhi',dis:!!sc.cls,why:'Já escolhi minha classe.',on:()=>UI.push(V.scenClass)});
  it.push({sec:'Vida real'},{ic:'🔒',l:'Carreira, bens, relações e atividades',s:'Pausadas enquanto durar a aventura',dis:true,why:'A vida real está pausada. Termine a aventura (ou acorde pelo menu) para voltar.'});
  return {title:d.tabs[4],items:it}; };
V.scCrew=()=>{ const sc=S.scen, d=SM(), m=S.me, it=[];
  it.push({face:faceSVG(m,40),l:`${m.first} (eu)`,s:`${sc.id==='isekai'&&sc.cls?clsName(sc.cls)+' · ':''}Arma: ${sc.arma?itN(sc.arma.id)+' ('+sc.arma.hp+'%)':'nenhuma'} · Força do grupo: ${scPow()}`,on:()=>UI.push(V.scMe)});
  if(!crew().length) it.push({html:`<div class="card"><p style="color:var(--muted)">Ninguém com você por enquanto.</p></div>`});
  crew().forEach(c=>it.push({face:faceSVG(c,40),l:`${c.first} ${c.last}`,s:`${c.race?c.race+' · ':''}${roleName(c)} · ${c.age} anos · ${c.arma?itN(c.arma.id):'sem arma'}`,bars:[['❤️',Math.max(0,c.hp),'#3BB273'],['🤝',Math.max(0,c.lv),'#3FA0B8']],on:()=>UI.push(()=>V.scMember(c))}));
  return {title:d.tabs[3],items:it}; };
V.scMe=()=>{ const sc=S.scen, it=[{sec:'Minha arma'}]; const ws=sc.inv.filter(x=>itCat(x.id)==='arma');
  if(sc.arma) it.push({ic:itIc(sc.arma.id),l:itN(sc.arma.id),s:`Equipada · estado ${sc.arma.hp}% · dano ${itV(sc.arma.id)}`,on:()=>{ if(addItem(sc.arma.id,sc.arma.hp)){ sc.arma=null; UI.refresh(); render(); } }});
  ws.forEach(x=>it.push({ic:itIc(x.id),l:`Equipar: ${itN(x.id)}`,s:`Estado ${x.hp}% · dano ${itV(x.id)}`,on:()=>{ sc.inv=sc.inv.filter(y=>y!==x); if(sc.arma) addItem(sc.arma.id,sc.arma.hp,true); sc.arma=x; UI.refresh(); render(); }}));
  if(!sc.arma&&!ws.length) it.push({html:'<div class="card"><p style="color:var(--muted)">Nenhuma arma na carga.</p></div>'});
  return {title:'Eu',items:it}; };
V.scMember=c=>{ const sc=S.scen; if(!crew().includes(c)) return null; const it=[{html:`<div class="card" style="display:flex;gap:12px;align-items:center">${faceSVG(c,64)}<div><p><b>${esc(c.first+' '+c.last)}</b></p><p style="color:var(--muted);font-size:13px">${esc((c.race?c.race+' · ':'')+roleName(c))}</p>${bar('Saúde',Math.max(0,c.hp))}${bar('Lealdade',Math.max(0,c.lv))}</div></div>`}];
  const once=k=>sc.done['m'+c.id+k];
  it.push({ic:'💬',l:'Conversar',s:'Lealdade',dis:once('c'),why:'Já conversamos hoje.',on:()=>scAct(()=>{ sc.done['m'+c.id+'c']=1; c.lv=Math.min(100,c.lv+rnd(5,10)); scStat('san',2); return R.pick([`${c.first} contou que era ${R.pick(['dentista','tatuador'+(c.gender==='F'?'a':''),'motorista de aplicativo','professor'+(c.gender==='F'?'a':''),'confeiteir'+oaG(c.gender),'influencer de academia'])} antes de tudo isso.`,`${c.first} riu de uma piada minha. Primeira vez em dias.`,`${c.first} disse que confia em mim. Pesou.`]); },c.first)});
  it.push({ic:'🍞',l:'Dar comida',s:'Saúde e lealdade',dis:!sc.inv.some(x=>itCat(x.id)==='comida'),why:'Não tenho comida.',on:()=>scAct(()=>{ const f=takeItem('@comida'); c.hp=Math.min(100,c.hp+10); c.lv=Math.min(100,c.lv+8); return `Dei ${itN(f.id).toLowerCase()} para ${c.first}.`; },c.first)});
  it.push({ic:'🩹',l:'Cuidar dos ferimentos',s:'Usa um remédio',dis:c.hp>=100||!sc.inv.some(x=>itCat(x.id)==='remedio'),why:c.hp>=100?`${c.first} está bem.`:'Não tenho remédio.',on:()=>scAct(()=>{ const r=takeItem('@remedio'); c.hp=Math.min(100,c.hp+itV(r.id)); c.lv=Math.min(100,c.lv+5); return `Cuidei de ${c.first} com ${itN(r.id).toLowerCase()}.`; },c.first)});
  if(!c.bebe&&!c.bicho) sc.inv.filter(x=>itCat(x.id)==='arma').forEach(x=>it.push({ic:itIc(x.id),l:`Entregar ${itN(x.id).toLowerCase()}`,s:`Estado ${x.hp}%`,on:()=>scAct(()=>{ sc.inv=sc.inv.filter(y=>y!==x); if(c.arma) addItem(c.arma.id,c.arma.hp,true); c.arma=x; c.lv=Math.min(100,c.lv+4); return `${c.first} agora carrega ${itN(x.id).toLowerCase()}.`; },c.first)}));
  if(c.arma) it.push({ic:'✋',l:`Pegar a arma de ${c.first}`,s:`${itN(c.arma.id)} · lealdade cai`,on:()=>scAct(()=>{ if(sc.arma) addItem(sc.arma.id,sc.arma.hp,true); sc.arma=c.arma; c.arma=null; c.lv-=15; return `Peguei ${itN(sc.arma.id).toLowerCase()} de ${c.first}. ${c.gender==='F'?'Ela':'Ele'} sorriu sem mostrar os dentes.`; },c.first)});
  it.push({ic:'🚪',l:'Deixar para trás',tone:'bad',on:()=>confirmBox('Deixar para trás?',`${c.first} vai ficar sozinh${oaG(c.gender)}.`,'Deixar',()=>{ crewLeave(c,`Deixei ${c.first} para trás.`); scStat('san',-6); crew().forEach(x=>x.lv-=6); UI.back(); after(); })});
  return {title:c.first,items:it}; };
V.scItems=()=>{ const sc=S.scen, d=SM(), it=[];
  if(sc.id==='zumbi'){ it.push({html:`<div class="card">${kv('Pessoas',`${crew().length+1} de ${seats()||'—'} lugares`)}${kv('Carga',`${sc.inv.length} de ${bagCap()}`)}${kv('Combustível',countCat('gas')+' galão(ões)')}</div>`},{sec:'Veículos'});
    if(!sc.veh.length) it.push({html:'<div class="card"><p style="color:var(--muted)">Sem veículos. Estamos a pé.</p></div>'});
    sc.veh.forEach(v=>it.push({ic:VEH[v.k][1],l:VEH[v.k][0],s:`Estado ${Math.max(0,v.hp)}% · ${VEH[v.k][2]} lugares · carga ${VEH[v.k][3]}`,r:v.hp<100?'🧰':'',dis:v.hp>=100||!sc.inv.some(x=>itCat(x.id)==='reparo'),why:v.hp>=100?'Está inteiro.':'Preciso de um kit de reparo.',
      on:()=>scAct(()=>{ const r=takeItem('@reparo'); v.hp=Math.min(100,v.hp+Math.round(itV(r.id)*(hasRole('mec')?1.6:1))); return `Consertei ${VEH[v.k][0].toLowerCase()}: ${v.hp}%.`; },'Oficina')})); }
  else it.push({html:`<div class="card">${kv('Espaço',`${sc.inv.length} de ${bagCap()}`)}${sc.id==='isekai'?kv('Ouro',sc.ouro+' moedas')+kv('Armadura',['Roupas do outro mundo','Couro batido','Cota de malha','Armadura de placas','Armadura de mithril','Armadura divina'][Math.min(5,sc.arm)]):''}${sc.id==='ilha'?kv('Abrigo',sc.abrigo+'%')+kv('Fogueira',sc.fogo?'Acesa':'Apagada'):''}${sc.id==='heroi'?kv('Poder',sc.poder)+kv('Codinome',sc.codinome)+kv('Traje',['Moletom e máscara de pano','Tecido à prova de faca','Placas de kevlar','Fibra experimental'][sc.traje]):''}${sc.id==='marte'?kv('Rover',sc.rover?'Funcionando':'Quebrado')+kv('Pesquisa',sc.ciencia+'%'):''}</div>`});
  it.push({sec:'Itens'}); if(!sc.inv.length) it.push({html:'<div class="card"><p style="color:var(--muted)">Nada. Nadinha.</p></div>'});
  const order=['comida','agua','remedio','mana','o2','vacina','san','arma','reparo','gas','pecas','sinal','venda','util'];
  sc.inv.slice().sort((a,b)=>order.indexOf(itCat(a.id))-order.indexOf(itCat(b.id))||b.hp-a.hp).forEach(x=>{ const c=itCat(x.id), usable=['comida','agua','remedio','mana','o2','vacina','san','sinal'].includes(c);
    it.push({ic:itIc(x.id),l:itN(x.id),s:`Estado ${x.hp}%${c==='comida'?' · mata a fome':c==='agua'?' · mata a sede':c==='remedio'?' · cura':c==='arma'?' · dano '+itV(x.id):''}`,bars:[['',x.hp,x.hp>=60?'#3BB273':x.hp>=30?'#F2A93B':'#E5484D']],
      on:()=>modal({t:itN(x.id),x:`Estado ${x.hp}%`,ch:[...(usable?[{l:c==='comida'?'Comer':c==='agua'?'Beber':'Usar',fn:()=>{ const r=scUse(x); scLog(r); MQ.unshift({t:itN(x.id),x:r}); }}]:[]),...(c==='arma'?[{l:'Equipar',fn:()=>{ sc.inv=sc.inv.filter(y=>y!==x); if(sc.arma) addItem(sc.arma.id,sc.arma.hp,true); sc.arma=x; }}]:[]),{l:'Descartar',cls:'danger',fn:()=>{ sc.inv=sc.inv.filter(y=>y!==x); }},{l:'Voltar',cls:'alt'}]})}); });
  return {title:d.tabs[1],items:it}; };
V.scenPick=()=>({title:'Modos fictícios',items:[{html:'<div class="card"><p>Uma aventura contada em dias, fora da vida normal. Enquanto durar, a vida real fica pausada e não envelhece. Se der errado, você só acorda, menos no isekai: quem morre em Eldoria morre de verdade. Se der certo, volta com recompensas.</p></div>'}]
  .concat(Object.entries(SCEN).map(([id,d])=>({ic:d.ic,l:d.n,s:fill(d.d.replace(/\{o\}/g,oa())),on:()=>confirmBox(d.n,'Começar a aventura agora?','Começar',()=>{ UI.close(); scStart(id); render.jump=true; after(); })})))});
V.scenClass=()=>({title:'Escolha sua classe',items:Object.entries(CLASSES).map(([k,c])=>({ic:c.ic,l:clsName(k),s:c.sk.join(' · '),on:()=>{ if(S.scen&&S.scen.id==='isekai'){ S.scen.cls=k; scLog(`Escolhi ser ${clsName(k).toLowerCase()} em Eldoria.`,'good'); if(k==='mago') addItem('cajado',90,true); if(k==='arqueiro') addItem('arco',90,true); if(k==='ladino') addItem('adaga',90,true); } UI.close(); after(); }}))});
// ---------- tela principal durante a aventura ----------
let NAV0=null;
function renderScen(){ const sc=S.scen, d=SM(), m=S.me;
  if(!NAV0) NAV0=['#nCareer','#nAssets','#nAge','#nRel','#nAct'].map(s=>$(s).innerHTML);
  ['#nCareer','#nAssets','#nAge','#nRel','#nAct'].forEach((s,i)=>{ $(s).innerHTML=i===2?`<div class="plus">${d.tabIc[i]}</div><span>${d.tabs[i]}</span>`:`<div class="scic">${d.tabIc[i]}</div><span>${d.tabs[i]}</span>`; });
  $('#hName').textContent=`${m.first} ${m.last}`; $('#hSub').textContent=`${d.ic} ${d.n} · ${d.yl?S.year+' · '+m.age+' anos':d.day+' '+sc.dia}`;
  const h=d.hdr(sc); $('#hMoney').textContent=h[0]; $('#hdr .lbl').textContent=h[1]; $('#hMoney').classList.remove('neg');
  $('#avatar').innerHTML=faceSVG(m,46);
  const lg=$('#log'); lg.innerHTML=sc.log.map(y=>`<section class="yr ph2 scy"><h3><span>${d.yl?d.yl(y):d.day+' '+y.d}</span><span>${esc(y.pl||'')}</span></h3>${y.lines.map(l=>typeof l==='string'?`<p>${esc(l)}</p>`:`<p class="${l.c}">${esc(l.t)}</p>`).join('')||'<p style="color:var(--muted)">Um dia tranquilo. Raridade.</p>'}</section>`).join(''); lg.scrollTop=lg.scrollHeight;
  $('#stats').innerHTML=d.stats.map(([k,l,e,inv])=>{ const v=Math.round(sc[k]||0); return `<div class="st"><span class="se">${e}</span><b>${l}</b><div class="bar"><i style="width:${v}%;background:${grad(inv?100-v:v)}"></i></div><span>${v}%</span></div>`; }).join(''); }
function navNormal(){ if(NAV0){ ['#nCareer','#nAssets','#nAge','#nRel','#nAct'].forEach((s,i)=>$(s).innerHTML=NAV0[i]); NAV0=null; } }
function scMoral(sc){ const c=crew(); return c.length?Math.round(c.reduce((s,x)=>s+x.lv,0)/c.length):Math.round(sc.san); }
// ---------- integração ----------
render=(orig=>function(){ if(S&&S.scen&&S.scen.v===SC_V&&S.me.alive){ if(S.scen.id==='zumbi') S.scen.moral=scMoral(S.scen); return renderScen(); } navNormal(); return orig.apply(this,arguments); })(render);
after=(orig=>function(){ if(S&&S.scen) scCheck(); return orig.apply(this,arguments); })(after);
doAge=(orig=>function(){ if(S&&S.scen&&S.scen.v===SC_V){ if(!S.me.alive||S.pending.length||MQ.length||modalOpen) return; UI.close(); try{ scNextDay(); }catch(e){ showErr(e); } after(); return; } return orig.apply(this,arguments); })(doAge);
let AGE0=null; // envelhecimento da vida real (o modo herói passa por ano)
ageUp=(orig=>{ AGE0=orig; return function(){ if(S&&S.scen&&S.scen.v===SC_V) return scNextDay(); if(S&&S.scen) S.scen=null; return orig.apply(this,arguments); }; })(ageUp);
log=(orig=>function(t,tone){ if(S&&S.scen&&S.scen.v===SC_V&&S.scen.log){ if(S.scen.id==='heroi') orig(t,tone); return scLog(t,tone); } return orig(t,tone); })(log);
V.career=(orig=>()=>S.scen&&S.scen.v===SC_V?V.scLocal():orig())(V.career);
V.activities=(orig=>()=>S.scen&&S.scen.v===SC_V?V.scActs():orig())(V.activities);
V.relations=(orig=>()=>S.scen&&S.scen.v===SC_V?V.scCrew():orig())(V.relations);
V.assets=(orig=>()=>S.scen&&S.scen.v===SC_V?V.scItems():orig())(V.assets);
V.menu=(orig=>()=>{ const r=orig(); if(S&&S.scen&&S.scen.v===SC_V&&S.me.alive&&!['isekai','heroi'].includes(S.scen.id)) r.items.unshift({ic:'⏰',l:'Acordar',s:'Encerra a aventura e volta para a vida real',tone:'bad',on:()=>confirmBox('Acordar?','A aventura termina aqui.','Acordar',()=>{ scenEnd(false,'Belisquei o próprio braço com força. Funcionou.'); after(); })}); return r; })(V.menu);
occupation=(orig=>()=>S.scen&&S.scen.v===SC_V?SCEN[S.scen.id].n:orig())(occupation);
function scenYear(){} function startScen(id){ scStart(id); }
// ---------- eventos especiais ----------
EVENTS.zumbi_mordida={scen:'zumbi',show:()=>({k:'Pesadelo zumbi',t:'Fui mordid'+oa()+'!',x:'A mordida está queimando. Você tem poucos dias antes de virar um deles.',ch:[['Esconder do grupo e torcer','e'],['Amputar o braço','a'],['Contar para o grupo','c']]}),
  pick:k=>{ const sc=S.scen; if(!sc) return '';
    if(k==='a'){ if(R.chance(.5+(hasRole('med')?.2:0))){ sc.inf=0; scHurt(35); scStat('san',-10); return 'Cortamos o braço antes de a infecção subir. Sobrevivi, com uma marca para sempre.'; } scHurt(60); return 'O corte não foi rápido o bastante. A febre continua.'; }
    if(k==='c'){ crew().forEach(c=>c.lv+=R.chance(.5)?6:-10); return sc.inv.some(x=>x.id==='vacina')?'O grupo lembrou da vacina experimental na carga.':'Metade do grupo me abraçou. A outra metade dormiu com um olho aberto.'; }
    return 'Escondi a mordida com uma blusa de manga comprida.'; }};
EVENTS.z_lotado={scen:'zumbi',show:()=>{ const sc=S.scen, over=crew().length+1-seats(), cg=sc.inv.length-bagCap(); return {k:'Pesadelo zumbi',t:'Comboio lotado',x:`${over>0?`Faltam ${over} lugar(es) para as pessoas. `:''}${cg>0?`Sobram ${cg} item(ns) de carga. `:''}Alguma coisa vai ter que ficar para trás.`,ch:[['Descartar a carga que sobrar','d'],['Deixar alguém para trás','p'],['Atrasar a partida e tentar consertar um carro','r']]}; },
  pick:k=>{ const sc=S.scen; if(!sc) return ''; let t='';
    if(k==='r'){ sc.stay=1; if((takeItem('@reparo')||hasRole('mec'))&&R.chance(.6)){ const v=Object.keys(VEH).filter(x=>x!=='onibus'); const kk=R.pick(v); sc.veh.push({k:kk,hp:rnd(25,50)}); return `Passamos o dia com graxa até o cotovelo, mas ${VEH[kk][0].toLowerCase()} voltou a funcionar.`; } t='Não deu para consertar nada. '; }
    const over=()=>sc.veh.length&&crew().length+1>seats();
    if(k==='p'||over()){ let n=0; while(over()&&crew().length){ const c=crew().slice().sort((a,b)=>a.lv-b.lv)[0]; crewLeave(c,`${c.first} ficou para trás, na beira da estrada.`); n++; } if(n){ scStat('san',-8); t+=`Deixamos ${n} pessoa(s) para trás. Ninguém se despediu. `; } }
    let cut=0; while(sc.inv.length>bagCap()){ const i=sc.inv.map((x,j)=>[j,itV(x.id)*x.hp]).sort((a,b)=>a[1]-b[1])[0][0]; sc.inv.splice(i,1); cut++; } if(cut) t+=`Descartamos ${cut} item(ns) de carga. Tentei não olhar para trás.`;
    return t||'Ajeitamos tudo. Coube, por pouco.'; }};
EVENTS.z_final={scen:'zumbi',show:()=>({k:'Pesadelo zumbi',t:'O Porto Seguro',x:'A ponte para a ilha está na sua frente. Soldados nas guaritas apontam armas para o comboio. Um megafone pede que vocês parem.',ch:[['Descer de mãos para cima','m'],['Acelerar e furar o bloqueio','f'],['Mandar só você na frente','s']]}),
  pick:k=>{ const sc=S.scen; if(!sc) return '';
    if(k==='f'){ if(R.chance(.35)){ scenEnd(true,'Furamos o bloqueio no susto. Os soldados nos perdoaram quando viram as crianças no banco de trás. Chegamos.'); return ''; } scHurt(45); return 'Tiros no para-brisa. Recuamos com um ferido.'; }
    if(k==='s'){ scenEnd(true,'Atravessei a ponte sozinh'+oa()+'. Convenci o capitão. Uma hora depois, o comboio inteiro entrou. Estamos a salvo.'); return ''; }
    if(sc.inf){ scenEnd(false,'O exame no portão mostrou a mordida. Me levaram para uma sala branca. E eu acordei.'); return ''; }
    scenEnd(true,'Exame de sangue, banho de mangueira e um prato de comida quente. Chegamos ao Porto Seguro.'); return ''; }};
EVENTS.ilha_navio={scen:'ilha',show:()=>({k:'Ilha',t:'Um navio!',x:'Lá no horizonte, um navio. Pequeno, mas de verdade. Você tem segundos para chamar a atenção.',ch:[['Jogar folhas verdes na fogueira','f'],['Pular e gritar na praia','g'],['Nadar até ele','n']]}),
  pick:k=>{ const sc=S.scen; if(!sc) return ''; const p=k==='f'?(sc.fogo?.7:.15):k==='g'?.3:.45;
    if(R.chance(p)){ scenEnd(true,'O navio virou na nossa direção. Um bote desceu. Eu chorei, ri e abracei um marinheiro desconhecido.'); return ''; }
    if(k==='n') scHurt(20); scStat('san',-12); return k==='f'&&!sc.fogo?'A fogueira estava apagada. O navio sumiu.':'O navio sumiu atrás do horizonte. Fiquei olhando o mar até escurecer.'; }};
EVENTS.isekai_fim={scen:'isekai',show:()=>({k:'Eldoria',t:'O Rei Demônio caiu',x:'Uma luz se abre no céu. A deusa diz que você pode voltar para casa, ou ficar em Eldoria como herói.',ch:[['Voltar para casa','c'],['Ficar mais um tempo em Eldoria','f']]}),
  pick:k=>{ const sc=S.scen; if(!sc) return '';
    if(k==='c'){ scenEnd(true,'Acordei no hospital, como se nada tivesse acontecido. Mas trouxe a força de Eldoria comigo, e um saco de moedas de ouro que ninguém sabe explicar.'); return ''; }
    sc.hero=1; return 'Fiquei. Me deram um castelo e um título de nobreza. A volta pode esperar.'; }};
EVENTS.heroi_final={scen:'heroi',show:()=>({k:'Superpoderes',t:'O último confronto',x:`${S.scen?S.scen.inimigo:'O vilão'} está de joelhos, sem poderes, cercado pela polícia. A cidade inteira assiste ao vivo.`,ch:[['Entregar à justiça','j'],['Oferecer uma segunda chance','c'],['Acabar com isso de vez','m']]}),
  pick:k=>{ const sc=S.scen, m=S.me; if(!sc) return '';
    if(k==='m'){ m.karma=clamp(m.karma-25); sc.evil=1; scenEnd(true,'A cidade ficou em silêncio. Ninguém mais me chamou de herói depois daquele dia.'); return ''; }
    if(k==='c'){ m.karma=clamp(m.karma+10); if(R.chance(.5)){ scenEnd(true,'Anos depois, o ex-vilão abriu uma ONG para jovens. Eu fui à inauguração, de máscara.'); return ''; } sc.venc=2; sc.inimigo=R.pick(VILOES.filter(v=>v!==sc.inimigo)); return 'Foi um erro. Fugiu na mesma noite, e trouxe um sócio.'; }
    scenEnd(true,'Algemas, flashes e aplausos. A cidade está segura. Pendurei a capa no dia seguinte.'); return ''; }};
EVENTS.marte_fim={scen:'marte',show:()=>({k:'Marte',t:'A nave de resgate chegou',x:'Depois de 30 sóis, a nave pousou. Há lugar para todos. Mas a colônia, se ninguém ficar, morre.',ch:[['Voltar para a Terra','v'],['Ficar como governador(a) da colônia','f']]}),
  pick:k=>{ const sc=S.scen; if(!sc) return ''; if(k==='v'){ scenEnd(true,'Desfile em carro aberto, entrevista em todos os canais e uma vontade estranha de comer batata.'); return ''; } sc.gov=1; sc.fim=1; return 'Fiquei. A primeira governador'+(S.me.gender==='F'?'a':'')+' de Marte. A próxima nave vem em 30 sóis.'; }};
// ---------- linguagem dos eventos dentro da aventura ----------
// h/hl viram sanidade/saúde da aventura · san fome sede mana rep sec pw o2 pista crime ciencia sos jangada abrigo xp ouro gas (+n/-n)
// moral±n (lealdade de todos) · it:id[*n] · -it:id|@categoria · crew crew2 (entra no grupo) · cbye cdie chp±n clv±n (o {c} do evento)
// rdie (alguém do grupo morre) · veh+[:tipo] veh- vhp±n · bite · kills · stay
function scTok(tok,d,out){ const sc=S.scen; if(!sc||sc.v!==SC_V) return false; let mm;
  if(mm=tok.match(/^(h|hl|san|fome|sede|mana|rep|sec|pw|o2|pista|crime|ciencia|sos|jangada|abrigo|xp|ouro|gas|etapa)([+-]\d+)$/)){ const n=+mm[2], k=mm[1]==='h'?'san':mm[1];
    if(k==='gas'){ for(let i=0;i<Math.abs(n);i++) n>0?addItem('gas',null,true):takeItem('gas'); return true; }
    if(k==='ouro'){ sc.ouro=Math.max(0,(sc.ouro||0)+n); return true; }
    if(k==='etapa'){ sc.etapa=Math.max(0,(sc.etapa||0)+n); return true; }
    scStat(k,n); return true; }
  if(mm=tok.match(/^moral([+-]\d+)$/)){ crew().forEach(c=>c.lv=Math.max(0,Math.min(100,c.lv+ +mm[1]))); return true; }
  if(mm=tok.match(/^sc\.(\w+)([+-]\d+)$/)){ scStat(mm[1],+mm[2]); return true; }
  if(mm=tok.match(/^it:(\w+)(?:\*(\d+))?$/)){ for(let i=0;i<+(mm[2]||1);i++) addItem(mm[1]); return true; }
  if(mm=tok.match(/^-it:(@?\w+)(?:\*(\d+))?$/)){ for(let i=0;i<+(mm[2]||1);i++) takeItem(mm[1]); return true; }
  if(tok==='crew'||tok==='crew2'){ const c=addCrewFromEvent(d,tok==='crew'?'n':'n2'); if(c&&!SM().names) {} return true; }
  if(tok==='cbye'||tok==='cdie'){ const c=crewById(d.cid); if(c) crewLeave(c,'',tok==='cdie'); return true; }
  if(tok==='rdie'){ const cs=crew(); if(cs.length){ const c=R.pick(cs); crewLeave(c,'',true); out.push(`Perdemos ${c.first}.`); } return true; }
  if(mm=tok.match(/^chp([+-]\d+)$/)){ const c=crewById(d.cid); if(c){ c.hp=Math.min(100,c.hp+ +mm[1]); if(c.hp<=0){ crewLeave(c,'',true); out.push(`${c.first} não resistiu.`); } } return true; }
  if(mm=tok.match(/^clv([+-]\d+)$/)){ const c=crewById(d.cid); if(c){ c.lv=Math.max(0,Math.min(100,c.lv+ +mm[1])); if(c.lv<=5){ crewLeave(c,''); out.push(`${c.first} foi embora.`); } } return true; }
  if(mm=tok.match(/^veh\+(?::(\w+))?$/)){ if(sc.id!=='zumbi') return true; const k=mm[1]&&VEH[mm[1]]?mm[1]:R.pick(Object.keys(VEH)); sc.veh.push({k,hp:rnd(35,80)}); out.push(`Ganhamos: ${VEH[k][1]} ${VEH[k][0].toLowerCase()}.`); return true; }
  if(tok==='veh-'){ if(sc.veh.length){ const v=sc.veh.splice(rnd(0,sc.veh.length-1),1)[0]; out.push(`Perdemos ${VEH[v.k][0].toLowerCase()}.`); if(crew().length+1>seats()) queue('z_lotado',{}); } return true; }
  if(mm=tok.match(/^vhp([+-]\d+)$/)){ sc.veh.forEach(v=>v.hp=Math.min(100,v.hp+ +mm[1])); return true; }
  if(tok==='bite'){ out.push(bite()); return true; }
  if(tok==='kills'){ sc_kill(rnd(2,6)); return true; }
  if(tok==='stay'){ sc.stay=1; return true; }
  if(tok==='bebe'||tok==='crianca'){ if(sc.zb){ sc.zb.pop++; out.push(tok==='bebe'?`O bebê agora mora em ${sc.zb.nome}.`:'A criança agora mora na base.'); return true; } if(sc.vila){ sc.vila.pop++; return true; }
    const c=mkCrew({age:tok==='bebe'?1:rnd(6,11)}); c.bebe=1; c.lv=95; c.arma=null; out.push(tok==='bebe'?`O bebê se chama ${c.first}.`:`${c.first}, de ${c.age} anos, agora viaja com a gente.`); return true; }
  if(mm=tok.match(/^bicho:(\w+)$/)){ const c=mkCrew({first:R.pick(['Pena','Trovão','Faísca','Garra','Nuvem','Brasa'])}); c.bicho=mm[1]; c.race=mm[1]; c.lv=90; out.push(`${c.first} agora faz parte do grupo.`); return true; }
  if(tok==='win'){ sc.winNow=1; return true; }
  return false; }
function scVar(k){ const sc=S.scen, m=S.me; if(!sc||sc.v!==SC_V) return null;
  switch(k){ case 'heroi': return m.gender==='F'?'heroína':'herói'; case 'vilao': return m.gender==='F'?'vilã':'vilão';
    case 'local': return sc.loc?sc.loc.n.toLowerCase():''; case 'arma': return sc.arma?itN(sc.arma.id).toLowerCase():'as próprias mãos';
    case 'cls': return sc.cls?clsName(sc.cls).toLowerCase():'aventureir'+oa(); case 'dia': return String(sc.dia);
    case 'carro': return sc.veh&&sc.veh.length?VEH[sc.veh[0].k][0].toLowerCase():'o carro'; case 'eu': return m.first; }
  const v=sc[k]; return typeof v==='string'||typeof v==='number'?String(v):null; }
function scChance(key){ const sc=S.scen; if(!sc||sc.v!==SC_V) return null; if(key==='pwr') return scPow(); if(key==='car') return sc.car; if(key==='moral') return scMoral(sc);
  if(key==='fogo') return sc.fogo?85:8; if(key==='bola') return sc.bola?85:5; if(key==='rover') return sc.rover?80:10;
  if(key==='h') return sc.san; if(key==='hl') return sc.hl; const k=key.startsWith('sc.')?key.slice(3):key; return typeof sc[k]==='number'?sc[k]:null; }
function crewFace(id){ const c=crewById(id); return c?faceSVG(c,88):null; }
// eventos dos modos: aparecem só no modo certo (pacotes em ev_sc_*.js)
const scWhen=id=>m=>!!S.scen&&S.scen.id===id;
const ZW=f=>m=>!!S.scen&&f(S.scen,m);
