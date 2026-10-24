// ===== 2.16: a vida de criatura interage com tudo =====
// Vampiros e lobisomens ganham tela própria (Vida de criatura), alcateia ou clã com cargos, clube de luta das
// criaturas da noite, hipnose e transformação na prisão, no julgamento, nas brigas e com as pessoas, e uma barra
// de exposição: quem é visto vira notícia e passa a ser caçado.

const criVamp=()=>S.me.criatura==='vampiro';
const criNome=()=>g(CRIATURA[S.me.criatura][0],S.me.gender).toLowerCase();
function cri(){ const m=S.me; if(!m.criatura) return null; if(!m.cri) m.cri={exp:0,ctrl:m.criatura==='lobisomem'?10:0,hip:m.criatura==='vampiro'?20:0,bando:null,clube:{tier:0,v:0,d:0}}; return m.cri; }
function criExpor(v,quem){ const c=cri(); if(!c) return ''; c.exp=clamp(c.exp+v); if(v>=15&&quem) log(`${quem} viu o que eu sou.`,'warn'); return ''; }
const BANDO={lobisomem:{n:'alcateia',ranks:['Ômega','Membro','Beta','Alfa'],nomes:['Alcateia da Serra','Presas do Norte','Clã da Lua Vermelha','Uivo Antigo']},
  vampiro:{n:'clã',ranks:['Neófito','Cria','Ancião','Príncipe da noite'],nomes:['Clã Carmesim','Casa Nosferatu','Corte da Meia-Noite','Linhagem de Prata Negra']}};
const bandoDe=()=>BANDO[S.me.criatura];

// ---------- ações da tela ----------
function criAcao(k){ const m=S.me, c=cri(); if(!c) return ''; const vamp=criVamp();
  switch(k){
    case 'lua': { if(vamp) return ''; if(use('cri_lua')>1) return 'A lua cheia já passou este ano.'; m.fomeP=clamp((m.fomeP||0)-25); st('happy',8); c.ctrl=clamp(c.ctrl+3);
      if(R.chance(.25-c.ctrl/600)) { criExpor(R.int(12,25),'Um caçador de javali'); return 'Corri a noite inteira pela mata. Um caçador de javali me viu de longe, e a lanterna dele tremia.'; }
      return R.pick(['Corri a noite inteira pela mata, mais rápido que qualquer carro. Voltei de manhã, sujo de terra e feliz.','Uivei no alto do morro até a cidade inteira acender as luzes. Ninguém subiu para ver.']); }
    case 'controle': { if(use('cri_ctrl')>1) return 'Já treinei até o limite este ano.'; if(vamp){ c.hip=clamp(c.hip+R.int(6,12)); return 'Treinei o olhar no espelho que não me reflete. A hipnose ficou mais forte.'; }
      c.ctrl=clamp(c.ctrl+R.int(6,14)); st('health',-2); return c.ctrl>=60?'Agora consigo trazer a fera quando quero, e mandá-la de volta.':'Meditação, respiração e dor. A fera obedece um pouco mais.'; }
    case 'hip_estranho': { if(!vamp) return ''; if(use('cri_hip1')>1) return 'Já usei a hipnose demais este ano.'; const v=R.int(500,4000)+c.hip*80; m.money+=v; m.karma=clamp(m.karma-4); c.hip=clamp(c.hip+2); criExpor(R.chance(.15)?12:2,R.chance(.15)?'Uma câmera de segurança':'');
      return `Olhei fundo nos olhos de um executivo na saída do banco. Ele sacou ${fmt(v)} e me entregou sorrindo.`; }
    case 'hip_policia': { if(!vamp) return ''; if(use('cri_hip2')>1) return 'Já usei a hipnose demais este ano.'; const ok=R.chance(.55+c.hip/250);
      if(ok){ const era=m.c.fugitive; m.c.fugitive=0; c.exp=clamp(c.exp-25); c.hip=clamp(c.hip+3); return era?'Entrei na delegacia e hipnotizei o delegado. A minha ficha sumiu do sistema, e ninguém lembra por quê.':'Hipnotizei os investigadores que andavam atrás de mim. Esqueceram tudo o que tinham visto.'; }
      criExpor(15); return 'O delegado usava um crucifixo de prata no pescoço. A hipnose escorregou, e ele anotou a minha placa.'; }
    case 'hip_chefe': { if(!vamp) return ''; if(!m.job) return 'Não tenho chefe para hipnotizar.'; if(use('cri_hip3')>1) return 'Já hipnotizei o chefe este ano.'; m.job.perf=clamp((m.job.perf||50)+15); m.karma=clamp(m.karma-3); return 'Uma conversa olho no olho com o chefe. Saí da sala com elogios e a promessa de um aumento.'; }
    case 'bando_entrar': { if(c.bando) return `Já faço parte de ${c.bando.n}.`; queue('cri_iniciacao',{n:R.pick(bandoDe().nomes)}); return ''; }
    case 'bando_cacar': { if(!c.bando) return ''; if(use('cri_bc')>1) return 'Já saímos juntos este ano.'; m.fomeP=clamp((m.fomeP||0)-35); c.bando.rep=clamp(c.bando.rep+8); st('happy',6);
      return vamp?'Uma noite de festa do clã num casarão antigo. Sangue de cálices de cristal e conversas de quatrocentos anos.':'Caçamos juntos na mata, oito lobos em silêncio. Ninguém passou fome.'; }
    case 'bando_territorio': { if(!c.bando) return ''; if(use('cri_bt')>1) return 'O território já foi defendido este ano.'; queue('cri_territorio',{}); return ''; }
    case 'bando_subir': { const b=c.bando; if(!b) return ''; if(b.rank>=3) return `Já sou ${bandoDe().ranks[3]}.`; if(b.rep<30+b.rank*20) return `Preciso de mais respeito em ${b.n} (${b.rep} de ${30+b.rank*20}).`; if(use('cri_bs')>1) return 'Um desafio por ano.';
      if(!vamp){ startFight({name:b.rank>=2?'o Alfa':'um Beta da alcateia',power:45+b.rank*15,gender:R.pick(['M','F'])},'bando'); return ''; }
      queue('cri_intriga',{}); return ''; }
    case 'bando_sair': { if(!c.bando) return ''; const n=c.bando.n; c.bando=null; criExpor(10); return `Saí de ${n}. Uma criatura sozinha chama mais atenção.`; }
    case 'clube': { if(use('cri_clube')>2) return 'Já lutei demais este ano. O corpo sara rápido, mas não tanto.'; const t=CLUBE[c.clube.tier], adv=R.pick(t[3]);
      startFight({name:adv,power:t[1]+R.int(-5,5),gender:R.pick(['M','F'])},'criaturas'); return ''; }
    case 'sumir': { if(m.money<30000) return `Mudar de cidade com documentos novos custa ${fmt(30000)}.`; m.money-=30000; c.exp=clamp(c.exp-45); const cs=countryOf(m.country).cities.filter(x=>x!==m.city); if(cs.length) m.city=R.pick(cs); return `Documentos novos, outro nome na campainha. Recomecei em ${m.city}.`; }
  }
  return ''; }

// ---------- clube de luta das criaturas da noite ----------
const CLUBE=[['Porão do açougue',40,8000,['Grimm, o lobisomem do porto','Irmãos Ghoul','Maria Sombra']],['Arena subterrânea',58,30000,['Lady Carmilla','O Gárgula','Caim, o desmorto']],
  ['Coliseu da Lua',74,120000,['Fenrir, o alfa negro','Nosferatu Júnior','A Bruxa do Pântano']],['Campeonato das Trevas',90,600000,['Vlad Segundo','A Fera de Gévaudan','Lilith, a primeira']]];
fightTurn=(o=>function(mv){ if(mv&&mv.cri&&FIGHT) FIGHT.criUsou=1; return o.apply(this,arguments); })(fightTurn);
fightEnd=(o=>function(r){ const F=FIGHT, m=S.me, c=cri();
  if(F&&F.ctx==='criaturas'&&c){ F.done=true; F.result=r; const t=CLUBE[c.clube.tier], cl=c.clube;
    if(r==='venceu'||r==='matou'||r==='acidente'){ cl.v++; m.money+=t[2]; m.fight=clamp(m.fight+2); st('happy',8); log(`🥊 Venci ${F.name} no ${t[0]} e levei ${fmt(t[2])}.`,'good');
      if(cl.v>=3&&cl.tier<CLUBE.length-1){ cl.tier++; cl.v=0; log(`Subi para o ${CLUBE[cl.tier][0]}.`,'big'); } else if(cl.v>=3&&cl.tier===CLUBE.length-1&&!m.c.campeaoTrevas){ m.c.campeaoTrevas=1; m.fame=clamp(m.fame+5); log('🏆 Virei Campeão das Trevas.','big'); } }
    else if(r==='perdeu'){ cl.d++; st('health',-R.int(10,25)); st('happy',-6); log(`Perdi para ${F.name} no ${t[0]}.`,'bad'); if(m.health<=0) die('no clube de luta das criaturas'); }
    else log(`Fugi da luta contra ${F.name}. No clube, isso pega mal.`);
    return; }
  if(F&&F.ctx==='bando'&&c&&c.bando){ F.done=true; F.result=r; const b=c.bando;
    if(r==='venceu'||r==='matou'||r==='acidente'){ b.rank++; b.rep=clamp(b.rep-10); log(`🐺 Venci o desafio e virei ${bandoDe().ranks[b.rank]} de ${b.n}.`,'big'); }
    else { b.rep=clamp(b.rep-15); st('health',-R.int(8,18)); log(`Perdi o desafio em ${b.n}. Voltei para o meu lugar.`,'bad'); }
    return; }
  const res=o.apply(this,arguments);
  if(F&&F.criUsou&&c&&F.ctx!=='criaturas'){ const testemunha=F.ctx==='prisao'?'O pátio inteiro':R.pick(['Um vizinho com o celular na mão','Gente na calçada','Um motorista parado no sinal']); criExpor(R.int(10,22),testemunha); }
  return res; })(fightEnd);
// na briga: a fera completa (lobisomem) e a hipnose que encerra a luta (vampiro)
if(typeof CRI_MOVES!=='undefined') CRI_MOVES.lobisomem.push({id:'fera',n:'Transformação completa',d:'vira a fera ali mesmo · todo mundo vê',pow:40,acc:.85,kill:.1,cri:1});
fightView=(o=>function(){ const r=o.apply(this,arguments), F=FIGHT, m=S.me, c=cri(); if(F&&!F.done&&c&&criVamp()&&r&&r.items){ const i=r.items.findIndex(x=>x.sec==='Golpes');
    r.items.splice(i>=0?i+1:r.items.length,0,{ic:'🌀',l:'Hipnotizar o adversário (criatura)',s:'olhar fixo · se pegar, ele desiste',tone:'bad',on:()=>{ F.criUsou=1; if(R.chance(.45+c.hip/200)){ F.lines.push(`${F.name} parou, baixou os braços e foi embora como se tivesse esquecido o motivo.`); fightEnd('venceu'); } else F.lines.push(`${F.name} desviou o olhar. A hipnose não pegou.`); UI.refresh(); }}); }
  return r; })(fightView);

// ---------- eventos ----------
EVENTS.cri_iniciacao={prep:()=>cri()?{n:R.pick(bandoDe().nomes)}:null,
  show:d=>{ const vamp=criVamp(); return {k:'Criatura',t:vamp?'🦇 A iniciação do clã':'🐺 A iniciação da alcateia',x:vamp?`O ${d.n} aceitou me receber. Antes, os anciãos querem uma prova.`:`A ${d.n} me farejou na mata. O alfa quer ver do que sou feito.`,
    ch:vamp?[['Beber do cálice dos anciãos','calice'],[`Levar uma oferenda (${fmt(20000)})`,'oferta'],['Provar que controlo a sede','controle']]:[['Caçar sozinho e trazer a presa','caca'],['Aguentar a luta contra o beta','luta'],['Jurar lealdade de joelhos','jura']]}; },
  pick:(k,d)=>{ const m=S.me, c=cri(); if(!c) return ''; const entra=()=>{ c.bando={n:d.n||bandoDe().nomes[0],rank:0,rep:15}; m.c.bando=1; log(`Entrei para ${c.bando.n}.`,'good'); };
    if(k==='oferta'){ if(m.money<20000) return 'Não tinha dinheiro para a oferenda. Os anciãos fecharam a porta.'; m.money-=20000; entra(); return 'Os anciãos aceitaram a oferenda e me deram um anel com o brasão do clã.'; }
    if(k==='controle'){ if((m.fomeP||0)>60){ m.fomeP=clamp(m.fomeP+10); return 'Puseram uma taça de sangue fresco na minha frente. Não aguentei. Fui recusado.'; } entra(); c.bando.rep+=10; return 'Fiquei uma hora olhando para a taça sem tocar. Os anciãos sorriram.'; }
    if(k==='luta'){ if(R.chance(.45+(m.fight||0)/200)){ entra(); c.bando.rep+=10; return 'Derrubei o beta na lama. A alcateia uivou junto.'; } st('health',-15); return 'O beta me jogou longe três vezes. Disseram para eu voltar mais forte.'; }
    if(k==='caca'){ m.fomeP=clamp((m.fomeP||0)-20); entra(); return 'Trouxe um cervo inteiro nas costas. O alfa cheirou e acenou com a cabeça.'; }
    entra(); return vamp2txt(); } };
const vamp2txt=()=>criVamp()?'Bebi do cálice. O gosto era de séculos.':'Jurei lealdade com a mão no chão. Agora tenho uma família de lobos.';
EVENTS.cri_territorio={prep:()=>cri()&&cri().bando?{}:null,
  show:()=>{ const vamp=criVamp(), c=cri(); return {k:'Criatura',t:'⚔️ Disputa de território',x:vamp?`Uma alcateia de lobisomens está entrando no território de ${c&&c.bando?c.bando.n:'meu clã'}.`:`Um clã de vampiros está caçando nas ruas que pertencem a ${c&&c.bando?c.bando.n:'minha alcateia'}.`,
    ch:[['Atacar de surpresa','atacar'],['Propor uma trégua','tregua'],['Deixar a cidade dividida','dividir']]}; },
  pick:k=>{ const m=S.me, c=cri(); if(!c||!c.bando) return ''; const b=c.bando;
    if(k==='atacar'){ criExpor(R.int(5,15)); if(R.chance(.5+(m.fight||0)/300)){ b.rep=clamp(b.rep+15); m.fight=clamp(m.fight+3); return 'Atacamos antes do amanhecer. Eles foram embora da cidade.'; } st('health',-R.int(10,25)); b.rep=clamp(b.rep-5); return 'Eles estavam esperando. Saímos feridos e envergonhados.'; }
    if(k==='tregua'){ if(R.chance(.55)){ b.rep=clamp(b.rep+6); m.karma=clamp(m.karma+4); return 'O rio virou fronteira. Ninguém atravessa sem pedir.'; } return 'Riram da trégua. A guerra vai continuar.'; }
    b.rep=clamp(b.rep-4); return 'Cedemos metade das ruas. Paz, por enquanto.'; }};
EVENTS.cri_intriga={prep:()=>cri()&&cri().bando&&criVamp()?{}:null,
  show:()=>{ const c=cri(), b=c&&c.bando, prox=b?BANDO.vampiro.ranks[Math.min(3,b.rank+1)]:''; return {k:'Criatura',t:'🍷 Intriga no clã',x:`Para virar ${prox}, alguém acima de mim precisa cair. Os vampiros não brigam no braço: brigam nos bastidores.`,
    ch:[['Envenenar o sangue do rival','veneno'],['Juntar provas contra ele no conselho','conselho'],['Seduzir os anciãos','seduzir']]}; },
  pick:k=>{ const m=S.me, c=cri(); if(!c||!c.bando) return ''; const b=c.bando, p={veneno:.5,conselho:.45+m.smarts/300,seduzir:.4+m.looks/300}[k]||.4;
    if(R.chance(p)){ b.rank=Math.min(3,b.rank+1); if(k==='veneno') m.karma=clamp(m.karma-10); log(`🦇 Virei ${BANDO.vampiro.ranks[b.rank]} de ${b.n}.`,'big'); return `Funcionou. Agora sou ${BANDO.vampiro.ranks[b.rank]}.`; }
    b.rep=clamp(b.rep-15); if(k==='veneno'&&R.chance(.3)){ st('health',-30); return 'O rival percebeu e devolveu o veneno na minha taça.'; } return 'O plano vazou. Os anciãos me olham de lado.'; }};
EVENTS.cri_cacada={prep:()=>cri()?{}:null,
  show:()=>{ const c=cri(), vamp=criVamp(); const ch=[['Fugir para outra cidade','fugir'],['Enfrentar os caçadores','lutar']]; if(c&&c.bando) ch.push([`Pedir proteção a ${c.bando.n}`,'bando']); if(vamp) ch.push(['Hipnotizar o líder dos caçadores','hip']); else ch.push(['Me esconder na mata até passar','mata']);
    return {k:'Criatura',t:'🔥 Estão me caçando',x:`Gente demais já viu o que eu sou. Uma ordem de caçadores, com ${vamp?'estacas, alho e água benta':'balas de prata e cães'}, descobriu o meu endereço.`,ch}; },
  pick:k=>{ const m=S.me, c=cri(); if(!c) return '';
    if(k==='fugir'){ const v=Math.min(m.money,R.int(5000,20000)); m.money-=v; c.exp=clamp(c.exp-35); const cs=countryOf(m.country).cities.filter(x=>x!==m.city); if(cs.length) m.city=R.pick(cs); return `Larguei tudo e fui para ${m.city}. Custou ${fmt(v)} e a minha paz.`; }
    if(k==='bando'&&c.bando){ c.exp=clamp(c.exp-25); c.bando.rep=clamp(c.bando.rep-10); return `${c.bando.n} cuidou dos caçadores. Não perguntei como.`; }
    if(k==='hip'){ if(R.chance(.5+c.hip/250)){ c.exp=clamp(c.exp-40); return 'O líder dos caçadores largou a besta, chorou e mandou todo mundo para casa.'; } st('health',-25); return 'Ele usava óculos espelhados. A hipnose não pegou, e a estaca passou a um dedo do coração.'; }
    if(k==='mata'){ c.exp=clamp(c.exp-20); st('happy',-6); m.fomeP=clamp((m.fomeP||0)+15); return 'Três meses na mata, comendo o que achava. Quando voltei, os caçadores tinham ido embora.'; }
    if(R.chance(.5+(m.fight||0)/250)){ c.exp=clamp(c.exp-15); cnt('kills'); m.karma=clamp(m.karma-8); return 'Eles eram cinco. Eu era uma criatura da noite.'; }
    if(R.chance(.4)){ die(criVamp()?'com uma estaca no coração':'com uma bala de prata'); return 'Os caçadores venceram.'; } st('health',-35); return 'Escapei por pouco, sangrando.'; }};
EVENTS.cri_viral={prep:()=>cri()?{}:null,
  show:()=>({k:'Internet',t:'📱 Viralizou',x:`Um vídeo meu ${criVamp()?'sem reflexo no espelho de uma loja':'virando lobo no meio da rua'} passou de dez milhões de visualizações. Comentaristas já falam em "${criNome()} de verdade".`,
    ch:[['Dizer que é efeito especial','fake'],['Assumir publicamente o que eu sou','assumir'],['Sumir da internet por um tempo','sumir']]}),
  pick:k=>{ const m=S.me, c=cri(); if(!c) return '';
    if(k==='fake'){ if(R.chance(.6)){ c.exp=clamp(c.exp-20); return 'Postei um "making of" falso. Metade da internet acreditou.'; } return 'Peritos analisaram o vídeo quadro a quadro. Não era efeito.'; }
    if(k==='assumir'){ m.fame=clamp(m.fame+30); c.exp=100; m.c.criPublico=1; queue('cri_cacada',{}); return 'Dei uma entrevista ao vivo. Virei celebridade, objeto de estudo e alvo, tudo ao mesmo tempo.'; }
    c.exp=clamp(c.exp-10); st('happy',-4); return 'Apaguei as redes. O vídeo continuou rodando sem mim.'; }};
EVENTS.cri_segredo={prep:()=>{ const p=cri()&&people().find(q=>q.alive&&q.rel!=='pet'); return p?{pid:p.id}:null; },
  show:d=>{ const p=P(d.pid); return {k:'Criatura',t:'🤫 O segredo',x:`Contei para ${p?p.first:'essa pessoa'} que sou ${criNome()}. ${p?p.first:'A pessoa'} ficou em silêncio por um minuto inteiro.`,ch:[['Esperar a reação','ok'],['Provar na hora','provar']]}; },
  pick:(k,d)=>{ const p=P(d.pid), c=cri(); if(!p||!c) return ''; p.sabeCri=1; const aceita=R.chance(.3+(p.bond||50)/150+(k==='provar'?-.1:0));
    if(aceita){ p.bond=clamp((p.bond||50)+12); return `${p.first} segurou a minha mão: "Isso não muda nada entre a gente."`; }
    p.bond=clamp((p.bond||50)-30); if(R.chance(.4)){ criExpor(25,p.first); return `${p.first} saiu correndo e contou para meio mundo.`; } return `${p.first} se afastou. Promete não contar, mas não me olha mais nos olhos.`; }};

// ---------- prisão e julgamento ----------
function criFuga(){ const m=S.me, c=cri(); if(!c||!m.prison) return ''; if(use('cri_fuga')>1) return 'Os guardas reforçaram tudo depois da última vez. Só no ano que vem.'; const vamp=criVamp();
  const p=vamp?.5+c.hip/200:.45+c.ctrl/200+(m.fight||0)/400;
  if(R.chance(p)){ const pr=m.prison; m.prison=null; cnt('escapes'); m.c.fugitive=1; st('happy',15); criExpor(vamp?8:R.int(30,45),vamp?'':'O presídio inteiro');
    log(vamp?'🌀 Hipnotizei o guarda e saí pela porta da frente.':'🐺 Virei lobo e arrombei a cela.','big');
    return vamp?`Olhei para o guarda e falei baixinho. Ele abriu a cela, me acompanhou até o portão e voltou para o posto${pr&&pr.juv?'':', sorrindo'}.`:'Os ossos estalaram, as grades entortaram e o muro do pátio não aguentou. Quando os holofotes acenderam, eu já estava na mata.'; }
  const y=R.int(1,3); m.prison.left+=y; m.prison.total+=y; criExpor(vamp?12:25,vamp?'':'Os guardas');
  if(vamp) return `O guarda tinha um terço de prata no bolso. A hipnose falhou, e ganhei mais ${y} ano(s) de pena.`;
  st('health',-R.int(10,25)); return `Os guardas atiraram dardos tranquilizantes antes de eu terminar a transformação. Mais ${y} ano(s) de pena e uma cela reforçada.`; }
function criPresoAlimentar(){ const m=S.me, c=cri(); if(!c||!m.prison) return ''; if(use('cri_pal')>1) return 'Chamaria atenção demais repetir este ano.'; m.fomeP=clamp((m.fomeP||0)-45); m.karma=clamp(m.karma-10);
  if(R.chance(.3)){ const y=R.int(2,5); m.prison.left+=y; m.prison.total+=y; criExpor(15,'Um agente penitenciário'); return `Fui pego no meio do ataque. Mais ${y} anos de pena, e os detentos agora rezam quando eu passo.`; }
  return 'Um detento apareceu pálido na enfermaria de manhã, sem lembrar de nada. A fome passou.'; }
prisonMenu=(o=>function(){ const it=o.apply(this,arguments), m=S.me, c=cri(); if(!c||!it) return it; const vamp=criVamp();
  it.push({sec:vamp?'🧛 A vampira na cela'.replace('vampira',m.gender==='F'?'vampira':'vampiro'):'🐺 A fera na cela'},
    {ic:vamp?'🌀':'🐺',l:vamp?'Hipnotizar o guarda e sair':'Transformar e destruir a cela',s:vamp?`Hipnose ${c.hip}% · se falhar, mais pena`:`Controle da fera ${c.ctrl}% · todo mundo vai ver`,tone:'bad',on:()=>act(criFuga,'Fuga')},
    {ic:'🩸',l:'Me alimentar de um detento',s:`${fomeNome(m)} ${m.fomeP||0}% · risco de mais pena`,tone:'bad',on:()=>act(criPresoAlimentar,'Prisão')});
  return it; })(prisonMenu);
{ const J=EVENTS.julgamento, sh0=J.show, pk0=J.pick;
  J.show=function(d){ const r=sh0.apply(this,arguments); if(cri()&&r&&r.ch&&!S.me.prison) r.ch=r.ch.concat([criVamp()?['🌀 Hipnotizar o juiz','hip']:['🐺 Virar lobo e fugir da delegacia','fera']]); return r; };
  J.pick=function(k,d){ const m=S.me, c=cri();
    if(k==='hip'&&c){ c.hip=clamp(c.hip+2); if(R.chance(.5+c.hip/250)){ st('happy',10); return 'Olhei o juiz nos olhos durante a minha defesa inteira. Ele bateu o martelo: "Absolvid'+oa()+'." O promotor ficou sem entender.'; } criExpor(10); return 'O juiz desviou o olhar no último segundo. '+pk0.call(this,'p',d); }
    if(k==='fera'&&c){ if(R.chance(.45+c.ctrl/200)){ m.c.fugitive=1; cnt('escapes'); criExpor(R.int(30,45),'A delegacia inteira'); return 'A algema estourou junto com a camisa. Saí pela parede da delegacia e sumi na noite. Agora sou procurad'+oa()+', e todo mundo sabe o que eu sou.'; }
      criExpor(25,'Os policiais'); st('health',-15); return 'Os policiais me derrubaram com tranquilizante antes de eu virar. '+pk0.call(this,'p',d); }
    return pk0.apply(this,arguments); }; }

// ---------- pessoas ----------
V.person=(o=>function(p){ const r=o.apply(this,arguments), m=S.me, c=cri(); if(!r||!r.items||!c||!p||!p.alive||p.rel==='pet'||m.prison||S.scen) return r;
  r.items.push({sec:CRIATURA[m.criatura][1]+' Criatura'});
  if(!p.sabeCri) r.items.push({ic:'🤫',l:`Contar que sou ${criNome()}`,s:'Pode aceitar, se afastar ou contar para todo mundo',on:()=>act(()=>{ queue('cri_segredo',{pid:p.id}); return ''; },'Segredo')});
  if(criVamp()) r.items.push({ic:'🌀',l:'Hipnotizar',s:p.sabeCri?'Gostar mais de mim, ou esquecer o meu segredo':'Gostar mais de mim',on:()=>act(()=>{ if(use('cri_hp_'+p.id)>1) return `${p.first} já anda com dor de cabeça. Melhor não repetir este ano.`;
    p.bond=clamp((p.bond||50)+15); m.karma=clamp(m.karma-2); if(p.sabeCri){ p.sabeCri=0; c.exp=clamp(c.exp-10); return `${p.first} piscou devagar e esqueceu o que eu sou. Agora só lembra que gosta muito de mim.`; } return `${p.first} piscou devagar e sorriu. Parece que gosta mais de mim do que ontem, sem saber por quê.`; },'Hipnose')});
  return r; })(V.person);

// ---------- tela ----------
V.criatura=()=>{ const m=S.me, c=cri(); if(!c) return {title:'Vida de criatura',items:[]}; const vamp=criVamp(), B=bandoDe(), A=(k,ic,l,s,tone)=>({ic,l,s,tone,on:()=>act(()=>criAcao(k),l)});
  const it=[{html:`<div class="card"><p><b>${CRIATURA[m.criatura][1]} ${esc(g(CRIATURA[m.criatura][0],m.gender))}</b></p>${bar(fomeNome(m),m.fomeP||0)}${bar('Exposição',c.exp)}${vamp?bar('Poder da hipnose',c.hip):bar('Controle da fera',c.ctrl)}${kv(B.n[0].toUpperCase()+B.n.slice(1),c.bando?`${c.bando.n} · ${B.ranks[c.bando.rank]}`:'Sozinh'+oa())}${kv('Clube de luta',`${CLUBE[c.clube.tier][0]} · ${c.clube.v} vitória(s)`)}<p style="color:var(--muted);font-size:13px">Quanto mais gente vê o que eu sou, maior a exposição. Com exposição alta, viro notícia e os caçadores vêm atrás de mim.</p></div>`}];
  it.push({sec:'A maldição'},{ic:vamp?'🩸':'🥩',l:vamp?'Saciar a sede':'Saciar a fome',s:'Comprar, caçar animais ou atacar alguém',on:()=>UI.push(V.paranormal)});
  if(!vamp) it.push(A('lua','🌕','Correr na mata na lua cheia','Fome cai · felicidade · alguém pode ver'));
  it.push(A('controle',vamp?'👁️':'🧘',vamp?'Treinar a hipnose':'Treinar o controle da fera',vamp?'Hipnose mais forte':'Transformar quando quiser · fugas mais fáceis'));
  if(vamp) it.push({sec:'Hipnose'},A('hip_estranho','💸','Hipnotizar um estranho rico','Dinheiro · carma','bad'),A('hip_policia','👮','Hipnotizar a polícia',m.c.fugitive?'Apagar a minha ficha de procurad'+oa():'Apagar o que viram de mim'),A('hip_chefe','💼','Hipnotizar o chefe',m.job?'Desempenho no trabalho':'Preciso de um emprego'));
  it.push({sec:vamp?'O clã':'A alcateia'});
  if(!c.bando) it.push(A('bando_entrar',vamp?'🦇':'🐺',vamp?'Procurar um clã de vampiros':'Procurar uma alcateia','Iniciação · proteção e cargos'));
  else { const b=c.bando, prox=B.ranks[b.rank+1]; it.push({html:`<div class="card">${kv(B.n[0].toUpperCase()+B.n.slice(1),b.n)}${kv('Cargo',B.ranks[b.rank])}${bar('Respeito',b.rep)}</div>`},
      A('bando_cacar',vamp?'🍷':'🦌',vamp?'Festa noturna do clã':'Caçar com a alcateia','Fome cai · respeito'),A('bando_territorio','⚔️','Defender o território',vamp?'Contra lobisomens':'Contra vampiros'));
    if(prox) it.push(A('bando_subir','⬆️',`Disputar o cargo de ${prox}`,vamp?'Intriga nos bastidores':'Luta contra quem está acima',b.rep<30+b.rank*20?'':'bad'));
    it.push(A('bando_sair','🚪',`Sair d${vamp?'o':'a'} ${B.n}`,'Fico sozinh'+oa(),'bad')); }
  it.push({sec:'Clube de luta das criaturas da noite'},A('clube','🥊',`Lutar no ${CLUBE[c.clube.tier][0]}`,`Prêmio ${fmt(CLUBE[c.clube.tier][2])} · 3 vitórias para subir`,'bad'));
  if(c.exp>=40) it.push({sec:'Exposição'},A('sumir','🧳','Mudar de cidade com documentos novos',`${fmt(30000)} · exposição cai muito`));
  return {title:'Vida de criatura',items:it}; };
V.activities=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(!m.criatura||!r||!r.items||m.prison||S.scen) return r; cri();
  r.items.unshift({ic:CRIATURA[m.criatura][1],l:'Vida de criatura',s:`${g(CRIATURA[m.criatura][0],m.gender)} · ${m.cri.bando?m.cri.bando.n:'sem '+bandoDe().n} · exposição ${m.cri.exp}%`,on:()=>UI.push(V.criatura)}); return r; })(V.activities);
V.paranormal=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(m.criatura&&r&&r.items) r.items.splice(1,0,{ic:CRIATURA[m.criatura][1],l:'Vida de criatura',s:'Alcateia ou clã, hipnose, clube de luta e exposição',on:()=>UI.push(V.criatura)}); return r; })(V.paranormal);

// ---------- o ano ----------
NL_GANCHOS_ANO.push(()=>{ const m=S.me, c=cri(); if(!c||!m.alive) return; c.exp=clamp(c.exp-6); if(c.bando) c.bando.rep=clamp(c.bando.rep+2); if(m.prison) return;
  if(c.exp>=85&&R.chance(.3)) queue('cri_viral',{}); else if(c.exp>=60&&R.chance(.35)) queue('cri_cacada',{}); });

function criaturasSelfTest(){ const s0=S,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),F0=FIGHT; window.NO_SAVE=true; window.NO_NEWS=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); }, BAD=/\{\w+\}|undefined|NaN|\[object/;
  const todas=(id,d)=>{ const base=JSON.stringify(S), ev=EVENTS[id]; const sh=ev.show(JSON.parse(JSON.stringify(d))); ok(sh&&!BAD.test(sh.t+sh.x),'show '+id+': '+(sh&&sh.x));
    for(const [l,k] of sh.ch){ ok(!BAD.test(l),'opção '+id+': '+l); S=JSON.parse(base); let r; try{ r=ev.pick(k,JSON.parse(JSON.stringify(d))); }catch(e){ erros.push(id+'/'+k+': '+e.message); } ok(!BAD.test(String(r)),id+'/'+k+': '+r); } S=JSON.parse(base); };
  const tela=(v,n)=>v.items.forEach(x=>ok(!BAD.test(String(x.l||'')+String(x.s||'')+String(x.html||'')),n+': '+(x.l||x.html)));
  try{ for(const tipo of ['lobisomem','vampiro']){ newLife({country:'BR'}); let m=S.me; m.age=25; m.prison=null; m.money=1e6; virar(tipo,'teste'); m.job=null;
      ok(V.activities().items.some(x=>x.l==='Vida de criatura'),'atividades sem vida de criatura '+tipo); tela(V.criatura(),'tela '+tipo);
      for(const k of ['lua','controle','hip_estranho','hip_policia','hip_chefe','bando_entrar','sumir']){ m=S.me; m.yr={}; S.pending=[]; const r=criAcao(k); ok(!BAD.test(String(r)),`${tipo} ${k}: ${r}`); }
      todas('cri_iniciacao',{n:bandoDe().nomes[0]}); EVENTS.cri_iniciacao.pick(tipo==='vampiro'?'oferta':'caca',{n:bandoDe().nomes[0]}); ok(cri().bando,'iniciação não entrou '+tipo);
      tela(V.criatura(),'tela com bando '+tipo); for(const k of ['bando_cacar','bando_territorio']){ S.me.yr={}; S.pending=[]; ok(!BAD.test(String(criAcao(k))),k); }
      todas('cri_territorio',{}); if(tipo==='vampiro') todas('cri_intriga',{}); todas('cri_cacada',{}); todas('cri_viral',{});
      const p=mkPerson({rel:'amigo',age:25,bond:60}); S.people.push(p); todas('cri_segredo',{pid:p.id}); tela(V.person(p),'pessoa '+tipo);
      // clube de luta e desafio da alcateia
      m=S.me; m.yr={}; const c=cri(); for(let i=0;i<3;i++){ S.me.yr={}; criAcao('clube'); ok(FIGHT&&FIGHT.ctx==='criaturas','clube não abriu luta'); fightEnd('venceu'); } ok(c.clube.tier===1,'clube não subiu de nível '+c.clube.tier);
      if(tipo==='lobisomem'){ c.bando.rep=100; S.me.yr={}; criAcao('bando_subir'); ok(FIGHT&&FIGHT.ctx==='bando','desafio sem luta'); fightEnd('venceu'); ok(c.bando.rank===1,'desafio não subiu o cargo'); }
      // briga comum com poder de criatura expõe
      const e0=c.exp; startFight({name:'Zé',power:30,gender:'M'},'rua'); FIGHT.criUsou=1; fightEnd('venceu'); ok(cri().exp>e0,'usar poder na briga não expôs');
      startFight({name:'Zé',power:30,gender:'M'},'rua'); tela(fightView(),'luta '+tipo);
      // prisão e julgamento
      m=S.me; m.prison={left:5,total:5,behav:50,juv:false}; m.yr={}; ok(prisonMenu().some(x=>/cela|guarda/.test(x.l||'')),'prisão sem opção de criatura'); let saiu=0;
      for(let i=0;i<40;i++){ m.prison=m.prison||{left:5,total:5,behav:50,juv:false}; m.yr={}; const r=criFuga(); ok(!BAD.test(r),'fuga: '+r); if(!m.prison){ saiu++; } } ok(saiu>0,'nunca fugiu '+tipo);
      m.prison={left:5,total:5,behav:50,juv:false}; m.yr={}; ok(!BAD.test(criPresoAlimentar()),'alimentar preso'); m.prison=null;
      const js=EVENTS.julgamento.show({c:'furto',min:1,max:3}); ok(js.ch.some(x=>x[1]===(tipo==='vampiro'?'hip':'fera')),'julgamento sem opção de criatura');
      todas('julgamento',{c:'furto',min:1,max:3});
      cri().exp=90; let fila=0; for(let i=0;i<20;i++){ S.pending=[]; S.year++; for(const f of NL_GANCHOS_ANO){ try{ f(); }catch(e){} } if(S.pending.some(e=>e.id==='cri_cacada'||e.id==='cri_viral')) fila++; cri().exp=90; } ok(fila>0,'exposição alta nunca trouxe caçadores'); }
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); } finally{ S=s0; FIGHT=F0; window.NO_SAVE=ns; window.NO_NEWS=nn; Object.assign(META,JSON.parse(meta)); }
  if(erros.length) throw Error('Criaturas 2.16 · '+erros.slice(0,8).join(' | ')); return {ok:true}; }
