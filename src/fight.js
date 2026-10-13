// ===== Artes marciais com faixas, brigas por turnos e aulas de arte, música e dança =====

// ---------- estilos de luta: uma faixa por ano; a última ensina o golpe especial ----------
const STYLES={
  judo:{n:'Judô',ic:'🥋',belts:['branca','cinza','azul','amarela','laranja','verde','roxa','marrom','preta'],move:{n:'Ippon seoi nage',d:'arremesso por cima do ombro',pow:26,acc:.72,kill:.02}},
  jiu:{n:'Jiu-jítsu',ic:'🥋',belts:['branca','azul','roxa','marrom','preta'],move:{n:'Mata-leão',d:'estrangulamento por trás',pow:34,acc:.65,kill:.14}},
  karate:{n:'Karatê',ic:'🥋',belts:['branca','amarela','vermelha','laranja','verde','roxa','marrom','preta'],move:{n:'Gyaku-zuki',d:'soco reto com giro do quadril',pow:24,acc:.82,kill:.02}},
  muay:{n:'Muay thai',ic:'🥊',belts:['branca','amarela','laranja','verde','azul','marrom','preta'],move:{n:'Joelhada voadora',d:'salto com joelhada no rosto',pow:36,acc:.58,kill:.09}},
  boxe:{n:'Boxe',ic:'🥊',kind:'nível',belts:['iniciante','amador','amador avançado','competidor','profissional'],move:{n:'Cruzado de direita',d:'soco curvo de nocaute',pow:30,acc:.7,kill:.05}},
  tkd:{n:'Taekwondo',ic:'🦵',belts:['branca','amarela','verde','azul','vermelha','preta'],move:{n:'Chute giratório',d:'chute alto com giro completo',pow:30,acc:.62,kill:.05}},
  capoeira:{n:'Capoeira',ic:'🤸',kind:'corda',belts:['crua','amarela','laranja','azul','verde','roxa','marrom','vermelha'],move:{n:'Meia-lua de compasso',d:'giro com o calcanhar na cabeça',pow:28,acc:.64,kill:.04}},
  kungfu:{n:'Kung fu',ic:'🐉',belts:['branca','amarela','laranja','verde','azul','marrom','preta'],move:{n:'Palma do dragão',d:'golpe de palma no peito',pow:25,acc:.78,kill:.02}},
  krav:{n:'Krav maga',ic:'🛡️',belts:['branca','amarela','laranja','verde','azul','marrom','preta'],move:{n:'Golpe na garganta',d:'golpe seco na traqueia',pow:34,acc:.68,kill:.16}},
};
const beltWord=s=>s.kind||'faixa';
const beltName=(s,l)=>`${beltWord(s)} ${s.belts[l]}`;
const lastBelt=s=>s.kind==='nível'?'último nível':`última ${beltWord(s)}`;
function martialOf(id){ const m=S.me; m.martial=m.martial||{}; return m.martial[id]||(m.martial[id]={lvl:0,last:-99}); }
const isMaster=id=>{ const ma=(S.me.martial||{})[id]; return !!ma&&ma.lvl>=STYLES[id].belts.length-1; };
function martialClass(id){
  const m=S.me,s=STYLES[id]; if(use('b_mart_'+id)>4) return 'O professor mandou eu descansar até a semana que vem.';
  martialOf(id); m.fight=clamp(m.fight+R.int(1,4)); st('health',R.int(0,2)); cnt('pSport'); m.money-=100;
  return R.pick([`Treinei ${s.n.toLowerCase()} a tarde inteira.`,`Aula puxada de ${s.n.toLowerCase()}. Saí moíd${oa()}.`,`Treinei golpes novos de ${s.n.toLowerCase()}.`]);
}
function beltExam(id){
  const m=S.me,s=STYLES[id],ma=martialOf(id),max=s.belts.length-1;
  if(ma.lvl>=max) return `Já cheguei na ${beltName(s,max)}.`;
  if(ma.last===S.year) return `Só posso fazer um exame de ${beltWord(s)} por ano.`;
  const tr=m.yr['b_mart_'+id]||0; if(tr<2) return `Preciso treinar ${s.n} pelo menos 2 vezes este ano antes do exame.`;
  if(ma.lvl+1===max&&m.age<16) return `A ${beltName(s,max)} só a partir dos 16 anos.`;
  ma.last=S.year;
  if(R.chance(clamp(.45+(m.fight-ma.lvl*8)/120+tr*.07,.1,.95))){
    ma.lvl++; st('happy',8); cnt('faixas');
    if(ma.lvl===max){ log(`Cheguei na ${beltName(s,max)} de ${s.n}! Aprendi o golpe especial: ${s.move.n}.`,'good'); return `Passei! Agora sou ${beltName(s,max)} de ${s.n} e aprendi o ${s.move.n} (${s.move.d}).`; }
    log(`Passei no exame de ${s.n}: agora sou ${beltName(s,ma.lvl)}.`,'good'); return `Passei! Agora sou ${beltName(s,ma.lvl)} de ${s.n}.`;
  }
  st('happy',-4); return `Reprovei no exame de ${beltWord(s)}. Ano que vem tento de novo.`;
}

// ---------- briga por turnos: eu escolho o golpe ----------
const BASIC_MOVES=[{id:'soco',n:'Soco',d:'direto no rosto',pow:12,acc:.75},{id:'chute',n:'Chute',d:'na perna ou na barriga',pow:15,acc:.65},
  {id:'empurrao',n:'Empurrão',d:'para ganhar espaço',pow:6,acc:.9},{id:'agarrar',n:'Agarrar e derrubar',d:'levar para o chão',pow:11,acc:.68,kill:.01}];
const myMoves=()=>BASIC_MOVES.concat(Object.keys(STYLES).filter(isMaster).map(id=>Object.assign({id,special:1,style:STYLES[id].n},STYLES[id].move)));
let FIGHT=null;
// adv: {p: pessoa} ou {name, power, gender}; ctx: 'pessoa' | 'escola' | 'prisao' | 'rua'
function startFight(adv,ctx){
  const m=S.me,p=adv.p;
  if(p&&p.fight==null){ const a=p.age, base=a<8?8:a<13?18:a<16?30:a<=40?45:a<=55?38:a<=70?26:15;
    p.fight=clamp(Math.round(R.norm(base,14)));
    // alguns adultos treinam luta
    if(a>=16&&a<=55&&R.chance(.16)){ p.style=R.pick(Object.keys(STYLES)); p.fight=clamp(p.fight+R.int(20,35)); } }
  FIGHT={pid:p?p.id:null,name:p?p.first:adv.name,ofight:p?p.fight:adv.power,ostyle:p?p.style:(adv.power>=70&&R.chance(.5)?R.pick(Object.keys(STYLES)):null),me:Math.round(55+m.health*.45),op:Math.round(p?50+p.health*.5:90),lines:[],done:false,ctx:ctx||'rua'};
  cnt('fights'); UI.open(fightView);
}
const hpBar=(l,v,c)=>`<div class="mini"><span style="text-align:left;color:var(--ink)">${esc(l)}</span><div class="bar"><i style="width:${Math.max(0,v)}%;background:${c}"></i></div><span>${Math.max(0,Math.round(v))}</span></div>`;
function fightView(){
  const F=FIGHT,m=S.me; if(!F) return {title:'Briga',items:[]};
  const it=[{html:`<div class="card">${hpBar('Eu',F.me,'var(--good)')}${hpBar(F.name,F.op,'var(--bad)')}${kv('Minha luta',m.fight+'%')}${F.lines.length?'<hr style="border:0;border-top:1px dashed var(--line)">'+F.lines.slice(-4).map(l=>`<p style="margin:3px 0">${esc(l)}</p>`).join(''):`<p>Começou a briga com ${esc(F.name)}. Escolha o golpe.</p>`}</div>`}];
  if(F.done){ it.push({ic:'✔️',l:'Fechar',on:()=>{ UI.close(); FIGHT=null; after(); if(typeof pump==='function') pump(); }}); return {title:'Briga',items:it}; }
  it.push({sec:'Golpes'});
  myMoves().forEach(mv=>it.push({ic:mv.special?'⭐':mv.id==='soco'?'👊':mv.id==='chute'?'🦶':mv.id==='empurrao'?'🫸':'🤼',l:mv.n+(mv.special?` (${mv.style})`:''),s:mv.d+(mv.kill>=.05?' · pode matar':''),tone:mv.kill>=.05?'bad':'',on:()=>{ fightTurn(mv); UI.refresh(); }}));
  it.push({ic:'🏃',l:'Fugir',s:'Sair correndo',on:()=>{ fightTurn(null); UI.refresh(); }});
  return {title:`Briga com ${F.name}`,items:it};
}
function fightTurn(mv){
  const F=FIGHT,m=S.me;
  if(!mv){ if(R.chance(.45+(m.health-50)/200)){ F.lines.push('Saí correndo e escapei.'); return fightEnd('fugiu'); } F.lines.push('Tentei fugir, mas fui alcançad'+oa()+'.'); }
  else {
    const hit=R.chance(clamp(mv.acc-.04+(m.fight-F.ofight)/190,.12,.93));
    if(hit){ const dmg=Math.round(mv.pow*(.5+m.fight/160)*(.8+R.f()*.4)); F.op-=dmg; F.lines.push(`${mv.n}: acertei! (−${dmg})`);
      // golpe letal: pode matar no meio da briga
      if(mv.kill>=.05&&R.chance(mv.kill*(1+m.fight/150))){ F.lines.push(`${F.name} caiu e não se levantou mais.`); return fightEnd('matou'); }
      // era só para apagar... mas às vezes a pessoa bate a cabeça e não acorda
      if(F.op<=0){ if(R.chance(.035+(mv.kill||0)*1.5+(F.op<-15?.03:0))){ F.lines.push(`${F.name} apagou, bateu a cabeça no chão e não acordou mais. Eu não queria matar.`); return fightEnd('acidente'); }
        F.lines.push(`${F.name} apagou. Ficou desacordad${(P(F.pid)||{}).gender==='F'?'a':'o'} no chão.`); return fightEnd('venceu'); } }
    else F.lines.push(`${mv.n}: errei.`);
  }
  // vez do adversário
  if(F.ostyle&&!F.revealed&&R.chance(.5)){ F.revealed=1; const s=STYLES[F.ostyle]; F.lines.push(`Opa: ${F.name} treina ${s.n}!`); }
  if(R.chance(clamp(.6+(F.ofight-m.fight)/180,.25,.9))){ const spec=F.ostyle&&R.chance(.25), d=Math.round((spec?R.int(18,30):R.int(9,18))*(.55+F.ofight/120)); F.me-=d; if(typeof hurtFx==='function') hurtFx(); F.lines.push(spec?`${F.name} acertou um ${STYLES[F.ostyle].move.n} em mim (−${d})!`:`${F.name} me acertou (−${d}).`); }
  else F.lines.push(`${F.name} errou o golpe.`);
  if(F.me<=0){ F.lines.push('Fui ao chão e não consegui levantar.'); return fightEnd('perdeu'); }
}
function fightEnd(r){
  const F=FIGHT,m=S.me,p=F.pid?P(F.pid):null; F.done=true; F.result=r;
  if(r==='venceu'){ st('happy',6); m.fight=clamp(m.fight+2); if(p){ p.bond=clamp(p.bond-20); p.health=clamp(p.health-12); }
    if(F.ctx==='prisao'&&m.prison) m.prison.behav=clamp(m.prison.behav-10);
    if(F.ctx!=='prisao'&&m.age>=16&&R.chance(.12)) arrest('lesão corporal',0,2);
    log(`Briga com ${F.name}: venci.`,'good'); }
  else if(r==='perdeu'){ st('health',-R.int(8,18)); st('happy',-8); if(F.ctx==='prisao'&&m.prison) m.prison.behav=clamp(m.prison.behav-5);
    log(`Briga com ${F.name}: apanhei feio.`,'bad'); if(m.health<=0) die('numa briga'); }
  else if(r==='fugiu'){ st('happy',-2); log(`Fugi de uma briga com ${F.name}.`); }
  else if(r==='matou'||r==='acidente'){
    const acc=r==='acidente';
    cnt('kills'); m.karma=clamp(m.karma-(acc?18:30)); st('happy',acc?-20:-15); if(p){ p.alive=false; p.cause='numa briga'; }
    log(acc?`${F.name} morreu sem querer depois de uma briga comigo. Era só para apagar.`:`${F.name} morreu depois de uma briga comigo.`,'bad');
    if(F.ctx==='prisao'&&m.prison){ const y=acc?R.int(2,6):R.int(6,15); m.prison.left+=y; m.prison.total+=y; log(`Ganhei ${y} anos a mais de pena.`,'bad'); }
    else if(R.chance(acc?.85:.8)) arrest(m.age<18?'ato infracional: homicídio':acc?'homicídio culposo (sem intenção)':'homicídio em briga',acc?1:4,acc?5:16);
    else { m.c.unsolved=(m.c.unsolved||0)+1; m.c.coldCase=F.name; }
  }
}

// ---------- aulas: música, dança, arte, teatro, escrita ----------
const LESSONS=[
  ['Dança','dance','pArt',[['Balé','🩰'],['Hip hop','🕺'],['Samba','💃'],['Forró','💃'],['Dança de salão','👯'],['K-pop','🎤'],['Sapateado','👞'],['Jazz','🎷']]],
  ['Arte','art','pArt',[['Pintura em tela','🎨'],['Desenho','✏️'],['Escultura','🗿'],['Cerâmica','🏺'],['Fotografia','📷'],['Grafite','🖌️']]],
  ['Teatro e humor','acting',null,[['Teatro','🎭'],['Improviso','🎭'],['Stand-up','🎙️',  'comedy'],['Cinema e TV','🎬']]],
  ['Escrita','writing',null,[['Oficina de escrita','✍️'],['Poesia','📜'],['Roteiro','📝']]],
];
const lessonLvl=n=>n<5?'Iniciante':n<15?'Intermediário':n<30?'Avançado':'Profissional';
function takeLesson(group,name,tal,pc){
  const m=S.me; if(use('b_aula_'+name)>4) return 'Já fiz muitas aulas disso este ano.';
  m.lessons=m.lessons||{}; m.lessons[name]=(m.lessons[name]||0)+1; m.money-=120;
  m.talent[tal]=clamp((m.talent[tal]||0)+R.int(1,4)); if(pc) cnt(pc); st('happy',R.int(1,3));
  const n=m.lessons[name], lv=lessonLvl(n), prev=lessonLvl(n-1);
  if(lv!==prev) log(`Subi de nível em ${name.toLowerCase()}: agora sou ${lv.toLowerCase()}.`,'good');
  return `Aula de ${name.toLowerCase()} (${lv.toLowerCase()}).`+(lv!==prev?` Subi para ${lv.toLowerCase()}!`:'');
}
V.lessons=()=>{ const m=S.me, it=[{html:`<div class="card"><p>Cada aula custa ${fmt(120)} e melhora o talento. Quem pratica sempre sobe de nível e conta pontos para bolsa de arte na faculdade.</p>${loadBar()}</div>`},
  {ic:'🎵',l:'Música',s:`Instrumentos · talento musical ${m.talent.musical}%`,on:()=>UI.push(V.music)}];
  for(const [g0,tal,pc,list] of LESSONS){ it.push({sec:`${g0} · ${m.talent[tal]||0}%`});
    list.forEach(([n,ic,t2])=>{ const k=(m.lessons||{})[n]||0; it.push({ic,l:n,s:`${lessonLvl(k)} · ${k} aula(s)`,on:()=>minorPay(120,()=>takeLesson(g0,n,t2||tal,pc),n)}); }); }
  return {title:'Aulas',items:it}; };
V.martial=()=>{ const m=S.me;
  return {title:'Artes marciais',items:[{html:`<div class="card"><p>Treine para liberar o exame de faixa: no máximo uma faixa por ano. Na última faixa você aprende o golpe especial e pode usá-lo em brigas.</p>${kv('Minha luta',m.fight+'%')}${loadBar()}</div>`}]
    .concat(Object.entries(STYLES).map(([id,s])=>{ const ma=(m.martial||{})[id], lvl=ma?ma.lvl:0, max=s.belts.length-1;
      return {ic:s.ic,l:s.n,s:ma?`${beltName(s,lvl)}${lvl>=max?' · golpe: '+s.move.n:''}`:`Golpe no topo (${lastBelt(s)}): ${s.move.n}`,r:lvl>=max?'Mestre':'',tone:lvl>=max?'good':'',on:()=>UI.push(()=>V.martialStyle(id))}; }))}; };
V.martialStyle=id=>{ const m=S.me,s=STYLES[id],ma=martialOf(id),max=s.belts.length-1, tr=m.yr['b_mart_'+id]||0;
  return {title:s.n,items:[{html:`<div class="card">${kv(beltWord(s)[0].toUpperCase()+beltWord(s).slice(1)+' atual',s.belts[ma.lvl])}${kv('Próxima',ma.lvl>=max?'—':s.belts[ma.lvl+1])}${kv('Treinos este ano',String(tr))}${kv('Golpe especial',`${s.move.n} (${s.move.d})${s.move.kill>=.05?' · pode matar':''}`)}<p style="color:var(--muted);font-size:13px">Faixas: ${s.belts.join(' → ')}</p></div>`},
    {ic:'🥋',l:'Ir à aula',s:`${fmt(100)} · luta e saúde sobem`,on:()=>minorPay(100,()=>martialClass(id),s.n)},
    {ic:'🏅',l:`Fazer exame de ${beltWord(s)}`,s:ma.lvl>=max?'Já estou no topo':ma.last===S.year?'Já fiz exame este ano':tr<2?'Preciso treinar 2 vezes este ano antes':'Pode tentar',dis:ma.lvl>=max||ma.last===S.year,why:ma.lvl>=max?'Já cheguei na última.':'Uma por ano.',on:()=>act(()=>beltExam(id),s.n)}]}; };
