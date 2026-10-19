// ===== Luta tática: ler o adversário, fôlego, chão e rounds (substitui a briga de golpes aleatórios) =====
// Cada golpe tem um tipo. O adversário escolhe uma intenção e dá sinais; quem luta melhor lê os sinais com mais frequência.
// rápido vence esquiva · forte vence agarrar e rápido · agarrar vence defesa e esquiva · defesa vence forte · esquiva contra-ataca o forte
const LUTA_TIPOS={rapido:'⚡ rápido',forte:'💥 forte',agarrar:'🤼 agarrar',defesa:'🛡️ defesa',esquiva:'↩️ esquiva',folego:'💨 fôlego'};
// [multiplicador do meu dano, multiplicador do dano que eu levo]
const LUTA_MATRIZ={
  rapido:{rapido:[.6,.6],forte:[.6,1],agarrar:[.7,.3],defesa:[.2,0],esquiva:[.8,0],folego:[1,0]},
  forte:{rapido:[1,.6],forte:[1,1],agarrar:[1.3,0],defesa:[.25,0],esquiva:[0,.9],folego:[1.3,0]},
  agarrar:{rapido:[.3,.6],forte:[0,1.3],agarrar:[.4,.4],defesa:[1,0],esquiva:[.9,0],folego:[1,0]},
  defesa:{rapido:[0,.15],forte:[0,.25],agarrar:[0,1],defesa:[0,0],esquiva:[0,0],folego:[0,0]},
  esquiva:{rapido:[0,.8],forte:[1.2,0],agarrar:[0,0],defesa:[0,0],esquiva:[0,0],folego:[.5,0]},
  folego:{rapido:[0,1.2],forte:[0,1.3],agarrar:[0,1.2],defesa:[0,0],esquiva:[0,0],folego:[0,0]}};
const LUTA_CUSTO={rapido:6,forte:16,agarrar:14,defesa:-7,esquiva:9,folego:-30,finalizar:20};
const LUTA_SINAL={rapido:'está leve nas pernas, cutucando com a mão da frente',forte:'recua o ombro e carrega o peso na perna de trás',agarrar:'abaixa o quadril e olha para a minha cintura',defesa:'fecha a guarda e espera',esquiva:'balança a cabeça, esperando eu entrar',folego:'está ofegante, com as mãos baixas'};
const LUTA_REGRAS={rua:{n:'Briga de rua',chao:1,agarra:1,golpes:1},mma:{n:'MMA',chao:1,agarra:1,golpes:1},boxe:{n:'Boxe',chao:0,agarra:0,golpes:1},muay:{n:'Muay thai',chao:0,agarra:0,golpes:1},kick:{n:'Kickboxing',chao:0,agarra:0,golpes:1},jiu:{n:'Jiu-jítsu',chao:1,agarra:1,golpes:0}};
// tipo do golpe especial de cada arte marcial; faixas intermediárias também ajudam no tipo da arte
const LUTA_ESTILO_TIPO={judo:'agarrar',jiu:'agarrar',karate:'rapido',muay:'forte',boxe:'forte',tkd:'forte',capoeira:'esquiva',kungfu:'rapido',krav:'forte'};
function lutaBonus(tipo){ const ma=S.me.martial||{}; let b=0; for(const [id,t] of Object.entries(LUTA_ESTILO_TIPO)) if(t===tipo&&ma[id]&&STYLES[id]) b=Math.max(b,ma[id].lvl/(STYLES[id].belts.length-1)); return b; }
const BASIC_MOVES2=[{id:'soco',n:'Jab',d:'rápido e seguro',pow:10,acc:.85,tipo:'rapido'},{id:'chute',n:'Golpe forte',d:'cruzado ou chute pesado',pow:19,acc:.7,tipo:'forte'},
  {id:'agarrar',n:'Agarrar e derrubar',d:'levar para o chão',pow:12,acc:.72,tipo:'agarrar',kill:.01},{id:'defesa',n:'Fechar a guarda',d:'bloqueia e recupera um pouco de fôlego',pow:0,acc:1,tipo:'defesa'},
  {id:'esquiva',n:'Esquivar e contra-atacar',d:'pune quem vem com força',pow:16,acc:.8,tipo:'esquiva'},{id:'folego',n:'Recuperar o fôlego',d:'muito fôlego, mas fica exposto',pow:0,acc:1,tipo:'folego'}];
myMoves=()=>{ const F=FIGHT, R0=LUTA_REGRAS[(F&&F.regra)||'rua'];
  let l=BASIC_MOVES2.filter(mv=>(mv.tipo!=='agarrar'||R0.agarra)&&(!['rapido','forte'].includes(mv.tipo)||R0.golpes));
  if(F&&F.chao){ l=F.chao==='eu'?[{id:'gnp',n:R0.golpes?'Socar por cima':'Pressionar por cima',d:'dano no chão',pow:17,acc:.78,tipo:'forte'},{id:'fin',n:'Tentar finalizar',d:'estrangulamento ou chave · decide a luta',pow:0,acc:1,tipo:'finalizar'},{id:'levanta',n:'Soltar e levantar',d:'volta a luta em pé',pow:0,acc:1,tipo:'esquiva'},{id:'folego',n:'Segurar e respirar',d:'recupera fôlego por cima',pow:0,acc:1,tipo:'folego'}]
    :[{id:'guarda',n:'Fechar a guarda',d:'se proteger por baixo',pow:0,acc:1,tipo:'defesa'},{id:'raspar',n:'Raspar',d:'inverte a posição se ele atacar',pow:8,acc:.75,tipo:'agarrar'},{id:'levanta',n:'Levantar',d:'escapa se ele não agarrar',pow:0,acc:1,tipo:'esquiva'},{id:'finb',n:'Finalização por baixo',d:'arriscado, mas pode acabar a luta',pow:0,acc:1,tipo:'finalizar'}]; return l; }
  const esp=Object.keys(STYLES).filter(isMaster).map(id=>Object.assign({id,special:1,style:STYLES[id].n,tipo:LUTA_ESTILO_TIPO[id]||'forte'},STYLES[id].move)).filter(mv=>(mv.tipo!=='agarrar'||R0.agarra)&&(!['rapido','forte'].includes(mv.tipo)||R0.golpes));
  return l.concat(esp); };
// adversário: tendências por estilo
function lutaTend(F){ const st=F.ostyle?LUTA_ESTILO_TIPO[F.ostyle]:null, w={rapido:3,forte:3,agarrar:2,defesa:2,esquiva:1.5};
  if(st) w[st]+=3; if(F.otend) Object.assign(w,F.otend); const R0=LUTA_REGRAS[F.regra||'rua']; if(!R0.agarra) w.agarrar=0; if(!R0.golpes){ w.forte=0; w.rapido=.5; w.agarrar+=3; }
  if(F.oest<25){ w.folego=4; w.defesa+=2; w.forte*=.4; } return w; }
function lutaIntencao(F){ if(F.chao) return F.chao==='eu'?R.wpick([['defesa',3],['agarrar',2],['esquiva',2],['folego',F.oest<30?3:.5]]):R.wpick([['forte',F.regra==='jiu'?0:3],['agarrar',3],['defesa',1],['folego',F.oest<30?3:.5]]);
  const ant=F.ultimo&&{rapido:'forte',forte:'esquiva',agarrar:'forte',defesa:'agarrar',esquiva:'rapido',folego:'forte'}[F.ultimo];
  if(ant&&F.repete>=1&&R.chance(Math.min(.7,F.ofight/140))&&lutaTend(F)[ant]>0) return ant;
  return R.wpick(Object.entries(lutaTend(F)).filter(e=>e[1]>0)); }
function lutaLer(F){ const m=S.me, p=clamp(.42+(m.fight-F.ofight)/130+(F.leitura||0)+(F.oest<30?.1:0)-(F.est<20?.15:0),.12,.9);
  if(R.chance(Math.min(.9,p))){ F.sinal=LUTA_SINAL[F.int]; F.sinalCerto=1; }
  else if(R.chance(.45)){ F.sinal=LUTA_SINAL[R.pick(Object.keys(LUTA_SINAL).filter(k=>k!==F.int))]; F.sinalCerto=0; }
  else { F.sinal=''; F.sinalCerto=0; } }
startFight=(o=>function(adv,ctx){ const r=o.apply(this,arguments); const F=FIGHT; if(!F) return r;
  F.est=100; F.oest=100; F.regra=adv.regra||(ctx==='ringue'?'mma':'rua'); F.chao=null; F.otend=adv.tend||null; F.leitura=adv.leitura||0; F.leit0=F.leitura; F.dmgB=adv.dmgB||0; F.estB=adv.estB||0;
  if(adv.bout) F.bout={r:1,rounds:adv.bout.rounds||3,troca:0,por:adv.bout.por||5,pts:[0,0],titulo:!!adv.bout.titulo};
  F.int=lutaIntencao(F); lutaLer(F); if(typeof UI!=='undefined') UI.refresh(); return r; })(startFight);
const estBar=(l,v)=>`<div class="mini"><span style="text-align:left;color:var(--muted)">${esc(l)}</span><div class="bar"><i style="width:${Math.max(0,v)}%;background:#4C9AFF"></i></div><span>${Math.max(0,Math.round(v))}</span></div>`;
fightView=function(){ const F=FIGHT, m=S.me; if(!F) return {title:'Luta',items:[]}; const R0=LUTA_REGRAS[F.regra||'rua'];
  const top=`${hpBar('Eu',F.me,'var(--good)')}${estBar('Meu fôlego',F.est)}${hpBar(F.name,F.op,'var(--bad)')}${estBar('Fôlego dele',F.oest)}${F.bout?kv(`${R0.n} · round ${Math.min(F.bout.r,F.bout.rounds)} de ${F.bout.rounds}`,`troca ${Math.min(F.bout.troca+1,F.bout.por)} de ${F.bout.por}`):''}${F.chao?`<p style="font-size:13px"><b>${F.chao==='eu'?'Estou por cima, no chão.':'Estou por baixo, no chão.'}</b></p>`:''}`;
  const lines=F.lines.length?'<hr style="border:0;border-top:1px dashed var(--line)">'+F.lines.slice(-4).map(l=>`<p style="margin:3px 0">${esc(l)}</p>`).join(''):`<p>${F.bout?'O juiz deu início à luta.':'Começou a briga com '+esc(F.name)+'.'}</p>`;
  const leitura=!F.done&&!F.intervalo?`<p style="margin-top:6px;font-size:13px">👁️ ${F.sinal?esc(F.name)+' '+esc(F.sinal)+'.':'Não consigo ler o que '+esc(F.name)+' vai fazer.'}</p>`:'';
  const it=[{html:`<div class="card">${top}${lines}${leitura}</div>`}];
  if(F.done){ it.push({ic:'✔️',l:'Fechar',on:()=>{ UI.close(); FIGHT=null; after(); if(typeof pump==='function') pump(); }}); return {title:F.bout?'Luta':'Briga',items:it}; }
  if(F.intervalo){ it.push({sec:'Intervalo'}); [['recup','💧','Recuperar o fôlego','Fôlego e um pouco de vida'],['tecnico','🧠','Ouvir o técnico','Leio melhor o adversário no próximo round'],['tudo','🔥','Partir com tudo','Mais dano no próximo round']].forEach(([k,ic,l,s])=>it.push({ic,l,s,on:()=>{ lutaIntervalo(k); UI.refresh(); }})); return {title:'Intervalo',items:it}; }
  it.push({sec:'Golpes'});
  myMoves().forEach(mv=>{ const c=LUTA_CUSTO[mv.tipo]||0; it.push({ic:mv.special?'⭐':(LUTA_TIPOS[mv.tipo]||'⚡').split(' ')[0],l:mv.n+(mv.special?` (${mv.style})`:''),s:`${LUTA_TIPOS[mv.tipo]||'finaliza'} · ${mv.d}${c>0?` · fôlego −${c}`:c<0?` · fôlego +${-c}`:''}${mv.kill>=.05&&!F.bout?' · pode matar':''}`,tone:mv.kill>=.05&&!F.bout?'bad':'',on:()=>{ fightTurn(mv); UI.refresh(); }}); });
  if(!F.bout) it.push({ic:'🏃',l:'Fugir',s:'Sair correndo',on:()=>{ fightTurn(null); UI.refresh(); }});
  return {title:F.bout?`${R0.n}: ${F.name}`:`Briga com ${F.name}`,items:it}; };
function lutaIntervalo(k){ const F=FIGHT; F.intervalo=false; F.est=Math.min(100,F.est+(k==='recup'?45:25)+F.estB); F.oest=Math.min(100,F.oest+30); if(k==='recup') F.me=Math.min(100,F.me+6);
  F.leitura=(F.leit0||0)+(k==='tecnico'?.2:0); F.tudo=k==='tudo'?.2:0;
  F.lines.push(`Round ${F.bout.r}. ${k==='recup'?'Voltei respirando melhor.':k==='tecnico'?'O técnico me mostrou o que ele está fazendo.':'Voltei com sangue nos olhos.'}`); F.int=lutaIntencao(F); lutaLer(F); }
fightTurn=function(mv){ const F=FIGHT, m=S.me; if(!F||F.done) return;
  if(!mv){ if(R.chance(.45+(m.health-50)/200+(F.est-50)/300)){ F.lines.push('Saí correndo e escapei.'); return fightEnd('fugiu'); } F.lines.push('Tentei fugir, mas fui alcançad'+oa()+'.'); mv={n:'Fuga',pow:0,acc:1,tipo:'folego'}; }
  const tipo0=mv.tipo||'forte'; F.repete=F.ultimo===tipo0?(F.repete||0)+1:0; F.ultimo=tipo0;
  const tipo=tipo0, oi=F.int, eu=F.est<20?.6:1, ele=F.oest<20?.6:1, dif=(m.fight-F.ofight)*1.4;
  F.est=clamp(F.est-(LUTA_CUSTO[tipo]||0)); F.oest=clamp(F.oest-(LUTA_CUSTO[oi]||0));
  let dei=0, levei=0, txt='';
  if(tipo==='finalizar'){ const base=(F.chao==='eu'?.18:.06)+(100-F.op)/220+lutaBonus('agarrar')*.25+dif/300+(oi==='folego'?.15:0)-(oi==='defesa'?.08:0)+(F.regra==='jiu'?.05:0);
    if(R.chance(clamp(base*eu,.03,.85))){ F.lines.push(`Encaixei a finalização e ${F.name} bateu!`); return lutaFim('venceu','finalização'); }
    F.lines.push('Tentei finalizar, mas ele escapou.'); if(F.chao==='ele'&&R.chance(.5)){ levei=.8; } else if(R.chance(.35)) F.chao=null; }
  else { const mt=(LUTA_MATRIZ[tipo]||LUTA_MATRIZ.forte)[oi]||[0,0]; dei=mt[0]; levei=mt[1];
    if(F.chao==='ele'&&tipo==='agarrar'&&['forte','rapido'].includes(oi)){ F.chao='eu'; txt='Raspei e fiquei por cima! '; dei=.4; levei=.3; }
    else if(F.chao==='ele'&&tipo==='esquiva'&&oi!=='agarrar'){ F.chao=null; txt='Consegui levantar. '; levei=0; }
    else if(F.chao==='eu'&&tipo==='esquiva'){ F.chao=null; txt='Soltei e voltei em pé. '; }
    else if(F.chao==='eu'&&oi==='agarrar'&&tipo!=='forte'&&R.chance(.5)){ F.chao='ele'; txt='Ele inverteu a posição! '; }
    else if(!F.chao&&tipo==='agarrar'&&dei>=.9&&LUTA_REGRAS[F.regra||'rua'].chao){ F.chao='eu'; txt='Derrubei! '; }
    else if(!F.chao&&oi==='agarrar'&&levei>=1&&LUTA_REGRAS[F.regra||'rua'].chao){ F.chao='ele'; txt='Ele me derrubou! '; }
    if(F.chao==='eu'&&tipo==='forte') dei*=1.3; }
  // acerto e dano: a escolha certa pesa mais do que a sorte
  let dano=0, sofri=0;
  if(dei>0){ const acc=clamp((mv.acc||.75)+dif/220+lutaBonus(tipo)*.1,.2,.97); const pega=R.chance(acc);
    dano=Math.round((mv.pow||12)*dei*(.6+m.fight/200+lutaBonus(tipo)*.2)*(1+F.dmgB+(F.tudo||0))*eu*(pega?1:.3)*(.85+R.f()*.3));
    F.op-=dano; if(F.bout) F.bout.pts[0]+=dano+(txt.startsWith('Derrubei')||txt.startsWith('Raspei')?4:0); }
  if(levei>0){ const acc=clamp(.75-dif/220,.2,.95), pega=R.chance(acc); sofri=Math.round(14*levei*(.55+F.ofight/120)*ele*(pega?1:.3)*(.85+R.f()*.3)*(F.cri?.8:1));
    F.me-=sofri; if(F.bout) F.bout.pts[1]+=sofri; if(sofri>0&&typeof hurtFx==='function') hurtFx(); }
  const nomeOi={rapido:'veio com golpes rápidos',forte:'veio com um golpe pesado',agarrar:'tentou me agarrar',defesa:'se fechou na guarda',esquiva:'tentou esquivar',folego:'parou para respirar'}[oi];
  if(F.ostyle&&!F.revealed&&R.chance(.35)){ F.revealed=1; F.lines.push(`Opa: ${F.name} treina ${STYLES[F.ostyle].n}!`); }
  if(tipo!=='finalizar') F.lines.push(`${txt}${mv.n}: ${dano>0?`acertei (−${dano})`:dei>0?'quase nada':'sem dano'} · ${F.name} ${nomeOi}${sofri>0?` e me acertou (−${sofri})`:''}.`);
  if(dano>0&&mv.kill>=.05&&!F.bout&&R.chance(mv.kill*(1+m.fight/150)*.6)){ F.lines.push(`${F.name} caiu e não se levantou mais.`); return fightEnd('matou'); }
  if(F.op<=0){ if(!F.bout&&R.chance(.03+(mv.kill||0)*1.5+(F.op<-15?.03:0))){ F.lines.push(`${F.name} apagou, bateu a cabeça no chão e não acordou mais. Eu não queria matar.`); return fightEnd('acidente'); }
    F.lines.push(`${F.name} ${F.bout?'foi nocautead'+((P(F.pid)||{}).gender==='F'?'a':'o')+'!':'apagou. Ficou desacordad'+((P(F.pid)||{}).gender==='F'?'a':'o')+' no chão.'}`); return lutaFim('venceu','nocaute'); }
  if(F.me<=0){ F.lines.push(F.bout?'O juiz interrompeu: fui nocautead'+oa()+'.':'Fui ao chão e não consegui levantar.'); return lutaFim('perdeu','nocaute'); }
  if(F.bout){ F.bout.troca++; if(F.bout.troca>=F.bout.por){ F.bout.troca=0; F.chao=null;
      if(F.bout.r>=F.bout.rounds){ const [a,b]=F.bout.pts, d=a-b; if(Math.abs(d)<6&&R.chance(.5)){ F.lines.push(`Fim da luta. Decisão dividida… empate!`); return lutaFim('empate','decisão'); }
        const ganhei=Math.abs(d)<6?R.chance(.5):d>0; F.lines.push(`Fim da luta. Os juízes dão a vitória para ${ganhei?'mim':F.name} (${a} x ${b} em pontos).`); return lutaFim(ganhei?'venceu':'perdeu','decisão'); }
      F.bout.r++; F.intervalo=true; F.lines.push(`Fim do round. Pontos até aqui: ${F.bout.pts[0]} x ${F.bout.pts[1]}.`); return; } }
  F.int=lutaIntencao(F); lutaLer(F); };
function lutaFim(r,metodo){ const F=FIGHT; F.metodo=metodo; return fightEnd(r); }
// no ringue, o resultado vai para a carreira; na rua, as consequências continuam as mesmas
fightEnd=(o=>function(r){ const F=FIGHT; if(F&&F.bout){ F.done=true; F.result=r; if(typeof lutadorResultado==='function') lutadorResultado(r,F.metodo||'decisão'); return; } return o.apply(this,arguments); })(fightEnd);
