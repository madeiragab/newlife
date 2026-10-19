// ===== Proficiência em luta, armas (brancas e de fogo) e drogas, cada uma seguindo a lei do país; doping no esporte =====
// ---------- proficiência: treino, faixas e profissão somam; lutador de verdade passa fácil por quem nunca treinou ----------
const LUTA_NIVEIS=[[0,'Leigo|Leiga'],[20,'Briguento|Briguenta'],[40,'Treinado|Treinada'],[60,'Avançado|Avançada'],[80,'Profissional'],[100,'Elite']];
function lutaProf(m){ m=m||S.me; let p=m.fight||0, b=0; for(const [id,ma] of Object.entries(m.martial||{})) if(STYLES[id]) b=Math.max(b,ma.lvl/(STYLES[id].belts.length-1)); p+=b*12;
  const j=m.job; if(j&&j.spc==='lutador') p+=6+j.lvl*3; else if(j&&(j.spc==='militar'||['poli','seg','bomb'].includes(j.id))) p+=8; if(m.criatura) p+=10; return Math.round(Math.min(130,p)); }
const lutaNivel=v=>g(LUTA_NIVEIS.filter(n=>v>=n[0]).pop()[1],S.me.gender);
startFight=(o=>function(adv,ctx){ const r=o.apply(this,arguments); const F=FIGHT; if(!F) return r; F.prof=lutaProf();
  if(!F.bout&&ctx==='rua'&&!adv.p&&R.chance(.18)) F.oarma=R.pick(['faca','canivete','garrafa quebrada']);
  F.int=lutaIntencao(F); lutaLer(F); return r; })(startFight);
fightView=(o=>function(){ const r=o.apply(this,arguments), F=FIGHT; if(F&&r&&r.items&&r.items[0]&&r.items[0].html){ const p=F.prof??lutaProf();
    r.items[0].html=r.items[0].html.replace('<div class="card">',`<div class="card"><p style="font-size:13px;color:var(--muted)">Minha proficiência: <b>${esc(lutaNivel(p))}</b> (${p}) · ${esc(F.name)}: ${esc(lutaNivel(F.ofight))}${F.oarma?` · <b style="color:#E5484D">armad${(P(F.pid)||{}).gender==='F'?'a':'o'} com ${esc(F.oarma)}</b>`:''}${S.me.armaUso&&!F.bout?` · estou com ${esc(ARMAS[S.me.armaUso].n.toLowerCase())}`:''}</p>`); }
  return r; })(fightView);
V.martial=(o=>function(){ const r=o.apply(this,arguments); if(r&&r.items&&r.items[0]&&r.items[0].html){ const p=lutaProf(); r.items[0].html=r.items[0].html.replace(/<\/div>$/,`${kv('Proficiência em luta',`${lutaNivel(p)} (${p})`)}<p style="color:var(--muted);font-size:13px">Treino, faixas e profissão somam na proficiência. Quem é bem mais proficiente lê o adversário, acerta mais e apanha menos.</p></div>`); } return r; })(V.martial);

// ---------- armas ----------
const ARMAS={
  canivete:{n:'Canivete',ic:'🔪',tipo:'branca',preco:150,pow:20,kill:.08},faca:{n:'Faca tática',ic:'🗡️',tipo:'branca',preco:450,pow:26,kill:.12},taco:{n:'Taco de beisebol',ic:'🏏',tipo:'branca',preco:200,pow:24,kill:.05},
  soco:{n:'Soco inglês',ic:'✊',tipo:'branca',preco:120,pow:18,kill:.03,proibido:1},machete:{n:'Facão',ic:'🔪',tipo:'branca',preco:300,pow:30,kill:.15},katana:{n:'Katana de colecionador',ic:'⚔️',tipo:'branca',preco:3500,pow:34,kill:.2},
  revolver:{n:'Revólver .38',ic:'🔫',tipo:'fogo',cat:'curta',preco:4500,pow:55,kill:.3},pistola:{n:'Pistola 9 mm',ic:'🔫',tipo:'fogo',cat:'curta',preco:7500,pow:60,kill:.32},
  espingarda:{n:'Espingarda de caça',ic:'🎯',tipo:'fogo',cat:'longa',preco:9000,pow:70,kill:.4},fuzil:{n:'Fuzil semiautomático',ic:'🎖️',tipo:'fogo',cat:'fuzil',preco:30000,pow:80,kill:.45}};
// fogo: facil (só checagem na loja) · licenca (exames e registro) · restrita (só espingarda, com licença) · branca 0: andar com lâmina na rua é crime
const LEI_ARMAS={US:{fogo:'facil',idade:21,txt:'Nos Estados Unidos basta passar na checagem de antecedentes da loja.',branca:1},
  BR:{fogo:'licenca',idade:25,custo:3500,txt:'No Brasil é preciso registro na Polícia Federal: exame psicológico, prova de tiro e ficha limpa. Andar armado na rua não é permitido.',branca:1},
  PT:{fogo:'licenca',idade:18,custo:1500,txt:'Em Portugal a licença da PSP exige curso, exame e ficha limpa.',branca:1},AR:{fogo:'licenca',idade:21,custo:1200,txt:'Na Argentina é preciso a credencial de usuário legítimo, com exames e curso de tiro.',branca:1},
  MX:{fogo:'licenca',idade:18,custo:2500,txt:'No México só existe uma loja legal, do Exército, e a burocracia é enorme.',branca:1},JP:{fogo:'restrita',idade:20,custo:6000,txt:'No Japão armas curtas são proibidas. Só espingarda de caça, depois de um processo longo. Andar com lâmina na rua é crime.',branca:0},
  IT:{fogo:'licenca',idade:18,custo:1500,txt:'Na Itália a licença exige atestado médico, curso de tiro e ficha limpa.',branca:1},FR:{fogo:'licenca',idade:18,custo:1500,txt:'Na França é preciso licença de tiro esportivo ou de caça, com exame.',branca:1},
  DE:{fogo:'licenca',idade:18,custo:2000,txt:'Na Alemanha a licença exige prova de conhecimento e necessidade comprovada.',branca:1},GB:{fogo:'restrita',idade:18,custo:2000,txt:'No Reino Unido pistolas são proibidas desde 1997. Espingarda só com certificado da polícia. Andar com faca na rua dá prisão.',branca:0},
  AO:{fogo:'licenca',idade:21,custo:1500,txt:'Em Angola o porte depende de licença da polícia, com exames.',branca:1},CA:{fogo:'licenca',idade:18,custo:800,txt:'No Canadá é preciso a licença PAL: curso de segurança e prova.',branca:1},
  ES:{fogo:'licenca',idade:18,custo:1200,txt:'Na Espanha a Guarda Civil emite licença de caça ou de tiro esportivo, com exames.',branca:1},KR:{fogo:'restrita',idade:20,custo:4000,txt:'Na Coreia do Sul quase tudo é proibido; espingardas ficam guardadas na delegacia.',branca:0},
  IN:{fogo:'restrita',idade:21,custo:3000,txt:'Na Índia a licença é rara e demorada, e quase sempre só para armas longas.',branca:1}};
const leiArmas=c=>LEI_ARMAS[c||S.me.country]||LEI_ARMAS.BR;
const armaLicenca=m=>!!m.licArma&&m.licArma.pais===m.country;
// pode comprar na loja, legalmente?
function armaLegal(id,m){ m=m||S.me; const a=ARMAS[id], L=leiArmas(m.country); if(a.tipo==='branca') return !a.proibido||m.country==='US';
  if(m.age<L.idade) return false; if(L.fogo==='facil') return !m.rec.conv; if(a.cat==='fuzil') return false; if(L.fogo==='restrita'&&a.cat!=='longa') return false; return armaLicenca(m); }
// andar com ela na rua é crime?
function armaPorteIlegal(it,m){ m=m||S.me; const a=ARMAS[it.id], L=leiArmas(m.country); if(a.tipo==='branca') return !L.branca||(a.proibido&&m.country!=='US'); if(!it.legal||it.pais!==m.country) return true; return L.fogo!=='facil'; }
const armasDe=m=>(m.armas=m.armas||[]);
function armaComprar(id,via){ const m=S.me, a=ARMAS[id], preco=via==='negro'?Math.round(a.preco*2.5):a.preco; if(m.age<18) return 'Ninguém vende arma para menor de idade.';
  if(via!=='negro'&&!armaLegal(id)) return 'Não posso comprar isso legalmente aqui.'; if(!canPay(preco)) return `Custa ${fmt(preco)}.`;
  if(via==='negro'){ const w=typeof mundo==='function'?mundo(m.country):{policia:50}; if(R.chance(.06+((w.policia||50)-50)/500)){ m.money-=Math.round(preco*.3); arrest('posse ilegal de arma',1,4); return 'O "vendedor" era policial disfarçado. Fui pres'+oa()+' na hora da entrega.'; }
    if(R.chance(.12)){ m.money-=preco; return 'Paguei adiantado e o vendedor sumiu com o dinheiro. Não dá para ir à polícia reclamar.'; } m.karma=clamp(m.karma-4); }
  m.money-=preco; armasDe(m).push({id,legal:via!=='negro',pais:m.country}); cnt('armas'); if(a.tipo==='fogo') m.c.arma=1;
  log(`Comprei ${a.n.toLowerCase()}${via==='negro'?' no mercado negro':''}.`,via==='negro'?'warn':''); return `Comprei ${a.n.toLowerCase()} por ${fmt(preco)}${via==='negro'?', sem nota e sem registro':''}.`; }
function armaEquipar(i){ const m=S.me, it=armasDe(m)[i]; if(!it) return ''; if(m.armaUso===it.id){ m.armaUso=null; return `Guardei ${ARMAS[it.id].n.toLowerCase()} em casa.`; } m.armaUso=it.id;
  return `Agora ando com ${ARMAS[it.id].n.toLowerCase()}.${armaPorteIlegal(it)?' Aqui isso é crime: se a polícia me parar, vou ter problema.':''}`; }
function armaDescartar(i){ const m=S.me, it=armasDe(m)[i]; if(!it) return ''; m.armas.splice(i,1); if(m.armaUso===it.id&&!m.armas.some(x=>x.id===it.id)) m.armaUso=null;
  if(it.legal){ const v=Math.round(ARMAS[it.id].preco*.5); m.money+=v; return `Vendi ${ARMAS[it.id].n.toLowerCase()} por ${fmt(v)}.`; } return `Me livrei de ${ARMAS[it.id].n.toLowerCase()} num rio, de madrugada.`; }
function armaTreinar(){ const m=S.me; if(m.age<18) return 'O estande só aceita maiores de idade.'; if(use('tiro')>3) return 'Já treinei bastante este ano.'; if(!canPay(150)) return 'Uma tarde no estande custa $150.';
  m.money-=150; m.mira=clamp((m.mira||10)+R.int(3,7)); return `Duas caixas de munição no estande. Mira: ${m.mira}%.`; }
function armaLicencaIniciar(){ const m=S.me, L=leiArmas(); if(L.fogo==='facil') return 'Aqui não precisa de licença: a loja só checa os antecedentes.'; if(armaLicenca(m)) return 'Já tenho licença neste país.';
  if(m.age<L.idade) return `A licença só a partir dos ${L.idade} anos.`; if(m.rec.conv) return 'Com condenação na ficha, o pedido é negado na hora.'; if(use('licArma')>1) return 'Já tentei este ano.'; if(!canPay(L.custo)) return `O processo custa ${fmt(L.custo)}.`;
  m.money-=L.custo; queue('arma_licenca',{e:0}); return ''; }
EVENTS.arma_licenca={when:m=>!m.prison,
  show:d=>d.e===1?{k:'Licença de arma',t:'Prova de tiro',x:`Passei no psicológico. Agora são dez disparos a quinze metros, com um instrutor anotando tudo. Minha mira: ${S.me.mira||10}%.`,ch:[['Respirar fundo e atirar devagar','calma'],['Atirar no ritmo do instrutor','ritmo'],['Atirar rápido para acabar logo','rapido']]}
    :{k:'Licença de arma',t:'Exame psicológico',x:'Uma psicóloga do credenciamento me faz perguntas por uma hora: raiva, brigas, família, por que eu quero uma arma.',ch:[['Responder com sinceridade','sincero'],['Dar as respostas "certas"','decorado'],['Desistir do processo','desiste']]},
  pick:(k,d)=>{ const m=S.me;
    if(d.e!==1){ if(k==='desiste') return 'Desisti. O dinheiro do processo não volta.';
      const p=k==='sincero'?.5+m.smarts/300+(m.karma-50)/250-(m.c.kills?.3:0):.45+m.smarts/250; if(!R.chance(clamp(p,.05,.95))) return 'Reprovei no psicológico. Posso tentar de novo no ano que vem.';
      queue('arma_licenca',{e:1}); return 'Aprovad'+oa()+' no psicológico.'; }
    const mira=m.mira||10, p=(k==='calma'?.3:k==='ritmo'?.22:.1)+mira/130; m.mira=clamp(mira+2);
    if(!R.chance(clamp(p,.05,.97))) return `Errei demais. Reprovad${oa()} na prova de tiro.`;
    m.licArma={pais:m.country,ano:S.year}; log(`Tirei a licença de arma em ${countryOf(m.country).n}.`,'good'); return 'Agrupei os tiros no centro do alvo. Licença aprovada.'; }};
// polícia para quem anda armado ilegalmente
EVENTS.arma_abordagem={when:m=>!m.prison&&!!m.armaUso,
  show:()=>{ const a=ARMAS[S.me.armaUso]; return {k:'Polícia',t:'Abordagem policial',x:`Uma viatura me parou na rua para revista. Estou com ${a.n.toLowerCase()} ${a.tipo==='fogo'?'na cintura':'no bolso'}, e aqui isso é crime.`,ch:[['Colaborar e entregar','entrega'],['Tentar correr','corre'],['Oferecer um "café" aos policiais','suborno']]}; },
  pick:k=>{ const m=S.me, id=m.armaUso, a=ARMAS[id]; if(!a) return ''; const tira=()=>{ const i=armasDe(m).findIndex(x=>x.id===id); if(i>=0) m.armas.splice(i,1); m.armaUso=null; };
    if(k==='entrega'){ tira(); if(a.tipo==='branca'){ if(leiArmas().branca){ m.money-=Math.min(Math.max(0,m.money),500); return 'Apreenderam e me multaram.'; } arrest('porte de arma branca',0,2); return 'Apreenderam e me levaram para a delegacia.'; } arrest('porte ilegal de arma de fogo',2,4); return 'Algemad'+oa()+' ali mesmo. Porte ilegal dá cadeia.'; }
    if(k==='corre'){ if(R.chance(.3+(m.talent.athletic||30)/250)){ m.karma=clamp(m.karma-3); return 'Corri por três quarteirões e me escondi num bar. Escapei.'; } tira(); arrest(a.tipo==='fogo'?'porte ilegal de arma e resistência':'porte de arma branca e resistência',a.tipo==='fogo'?2:1,a.tipo==='fogo'?6:3); return 'Me alcançaram. Agora é resistência também.'; }
    m.karma=clamp(m.karma-8); if(R.chance(.4)&&m.money>=2000){ m.money-=2000; return 'Os policiais aceitaram $2.000 e foram embora sem olhar para trás.'; } tira(); arrest('porte ilegal de arma e corrupção ativa',3,8); return 'Tentar subornar foi pior: agora é corrupção também.'; }};
// armas na briga
myMoves=(o=>function(){ const l=o.apply(this,arguments), F=FIGHT, m=S.me; if(!F||F.bout||F.chao||F.ctx==='prisao'||!m.armaUso||!ARMAS[m.armaUso]) return l; const a=ARMAS[m.armaUso];
  if(a.tipo==='fogo') return l.concat([{id:'ameaca',n:'Sacar a arma e ameaçar',d:'quase todo mundo desiste',pow:0,acc:1,tipo:'ameaca',arma:1},{id:'tiro',n:'Atirar',d:'decide a briga · pode matar',pow:a.pow,acc:.5,tipo:'tiro',kill:a.kill,arma:1}]);
  return l.concat([{id:'arma',n:`Golpe com ${a.n.toLowerCase()}`,d:'muito dano · pode matar',pow:a.pow,acc:.75,tipo:'forte',kill:a.kill,arma:1}]); })(myMoves);
LUTA_MATRIZ.tiro={rapido:[1,.4],forte:[1,.6],agarrar:[1,.8],defesa:[1,0],esquiva:[.7,0],folego:[1,0]}; LUTA_CUSTO.tiro=4; LUTA_TIPOS.tiro='🔫 tiro'; LUTA_TIPOS.ameaca='🔫 ameaça';
fightTurn=(o=>function(mv){ const F=FIGHT, m=S.me; if(!F||F.done) return; if(mv&&mv.arma) F.armaUsada=1;
  if(mv&&mv.tipo==='tiro'){ mv=Object.assign({},mv,{acc:clamp(.4+(m.mira||10)/180,.3,.92)}); }
  if(mv&&mv.tipo==='ameaca'){ if(R.chance(F.oarma?.35:.8)){ F.lines.push(`${F.name} viu a arma, levantou as mãos e foi embora.`); F.done=true; F.result='ameacou'; log(`Saquei a arma e ${F.name} desistiu da briga.`,'warn'); m.karma=clamp(m.karma-4); if(R.chance(.15)) arrest('ameaça com arma',0,2); return; }
    F.lines.push(`${F.name} não se intimidou e veio para cima!`); F.int='forte'; mv={n:'Ameaça',pow:0,acc:1,tipo:'folego'}; }
  const me0=F.me; const r=o.call(this,mv);
  // o adversário armado machuca mais e pode matar
  if(F.oarma&&!F.done&&F.me<me0){ const extra=Math.round((me0-F.me)*.6); F.me-=extra; if(F.int&&R.chance(.025)){ F.lines.push(`${F.name} me acertou com ${F.oarma}.`); F.done=true; F.result='perdeu'; die(`esfaquead${oa()} numa briga de rua`); return; } if(F.me<=0&&!F.done){ F.lines.push('Fui ao chão, sangrando.'); fightEnd('perdeu'); } }
  return r; })(fightTurn);
fightEnd=(o=>function(r){ const F=FIGHT, m=S.me; const res=o.apply(this,arguments);
  if(F&&!F.bout&&F.armaUsada&&['venceu','matou','acidente'].includes(r)){ const it=armasDe(m).find(x=>x.id===m.armaUso); if(R.chance(r==='venceu'?.35:.6)){ if(it) m.armas.splice(m.armas.indexOf(it),1); m.armaUso=null; arrest(r==='venceu'?'lesão corporal com arma':'homicídio com arma',r==='venceu'?1:6,r==='venceu'?5:20); } }
  return res; })(fightEnd);
// crimes: estar armado ajuda, mas pesa se der errado
if(typeof chanceCrime==='function') chanceCrime=(o=>function(c){ const r=o.apply(this,arguments), a=S.me.armaUso&&ARMAS[S.me.armaUso]; return a?Math.min(.95,r+(a.tipo==='fogo'?.07:.03)):r; })(chanceCrime);

// ---------- drogas ----------
const DROGAS={maconha:{n:'Maconha',ic:'🌿',preco:60,cls:0,vicio:4,h:[3,8],hl:-1,od:0,bad:.04},cogumelos:{n:'Cogumelos',ic:'🍄',preco:80,cls:1,vicio:1,h:[2,12],hl:0,od:0,bad:.15},
  lsd:{n:'LSD',ic:'🌈',preco:50,cls:1,vicio:1,h:[0,14],hl:0,od:0,bad:.2},ecstasy:{n:'Ecstasy',ic:'💊',preco:70,cls:1,vicio:6,h:[6,11],hl:-3,od:.004,bad:.06},
  cocaina:{n:'Cocaína',ic:'❄️',preco:250,cls:1,vicio:11,h:[6,12],hl:-4,od:.008,bad:.05},crack:{n:'Crack',ic:'🪨',preco:30,cls:1,vicio:24,h:[6,10],hl:-8,od:.01,bad:.08},
  heroina:{n:'Heroína',ic:'💉',preco:200,cls:1,vicio:22,h:[8,14],hl:-7,od:.018,bad:.05},anabol:{n:'Anabolizantes',ic:'💪',preco:400,cls:2,vicio:5,h:[1,3],hl:-3,od:0,bad:0}};
// [maconha, outras drogas] · legal · descrim (multa ou advertência) · ilegal (processo, pena curta) · severa (prisão)
const LEI_DROGAS={BR:['descrim','ilegal'],PT:['descrim','descrim'],US:['legal','ilegal'],AR:['descrim','ilegal'],MX:['descrim','ilegal'],JP:['severa','severa'],IT:['descrim','ilegal'],FR:['ilegal','ilegal'],
  DE:['legal','ilegal'],GB:['ilegal','ilegal'],AO:['ilegal','ilegal'],CA:['legal','ilegal'],ES:['descrim','ilegal'],KR:['severa','severa'],IN:['ilegal','severa']};
const LEI_TXT={legal:'legal para maiores de idade',descrim:'descriminalizado: dá multa ou advertência, não prisão',ilegal:'crime: processo e pena curta',severa:'crime grave: prisão'};
function leiDroga(id,c){ const L=LEI_DROGAS[c||S.me.country]||LEI_DROGAS.BR, d=DROGAS[id]; if(d.cls===0) return L[0]; if(d.cls===2) return L[1]==='severa'?'ilegal':'descrim'; return L[1]; }
const drogasDe=m=>(m.drogas=m.drogas||{});
const drogaVicioMax=m=>Math.max(0,...Object.values(m.drogas||{}));
function drogaFlagra(id,onde){ const m=S.me, lei=leiDroga(id); if(lei==='legal') return ''; m.c.drogaFlagra=(m.c.drogaFlagra||0)+1;
  if(lei==='descrim'){ const v=Math.min(Math.max(0,m.money),R.int(150,800)); m.money-=v; return ` A polícia me pegou ${onde}. Como aqui é descriminalizado, levei ${v?'uma multa de '+fmt(v):'uma advertência'} e fui liberad${oa()}.`; }
  if(lei==='ilegal'){ arrest('porte de drogas',0,2); return ` A polícia me pegou ${onde}. Vou responder a processo por porte de drogas.`; }
  arrest('posse de entorpecentes',1,5); return ` A polícia me pegou ${onde}. Aqui a lei é duríssima: vou para a cadeia.`; }
function drogaUsar(id){ const m=S.me, d=DROGAS[id]; if(m.age<16) return 'Não.'; if(use('droga_'+id)>4) return 'Já usei demais este ano. Meu corpo está pedindo socorro.';
  const lei=leiDroga(id), loja=lei==='legal'&&m.age>=(m.country==='US'?21:18), preco=Math.round(d.preco*(loja?1.2:1)); if(!canPay(preco)) return `Não tenho ${fmt(preco)}.`; m.money-=preco;
  const D=drogasDe(m); D[id]=clamp((D[id]||0)+Math.round(d.vicio*(1.4-(m.will??50)/100)*R.int(70,130)/100)); cnt('drogas'); m.c.drogas=1;
  st('happy',R.int(d.h[0],d.h[1])); if(d.hl) st('health',d.hl+R.int(-1,1)); if(id==='anabol'){ m.looks=clamp(m.looks+R.int(1,3)); m.talent.athletic=clamp((m.talent.athletic||0)+R.int(0,2)); const j=m.job; if(j&&(j.spc==='lutador'||j.spc==='atleta')) j.dop=S.year; }
  let t=loja?`Comprei ${d.n.toLowerCase()} numa loja autorizada e usei em casa.`:`Comprei ${d.n.toLowerCase()} de um traficante e usei.`;
  t+=' '+({maconha:'Ri de tudo e comi um pacote inteiro de biscoito.',cogumelos:'As paredes respiraram por seis horas.',lsd:'Vi o som e ouvi as cores.',ecstasy:'Amei todo mundo da festa até o sol nascer.',cocaina:'Falei sem parar a noite toda. O dia seguinte foi horrível.',crack:'Durou minutos. A vontade de mais, não passa.',heroina:'Um calor no corpo inteiro, e depois nada.',anabol:'Uma injeção na academia. O espelho agradeceu, o fígado não.'})[id];
  if(d.bad&&R.chance(d.bad)){ st('happy',-R.int(8,16)); t+=' Mas a viagem ficou ruim: pânico, suor frio, achei que ia morrer.'; }
  if(d.od&&R.chance(d.od*(1+(D[id]||0)/40))){ if(R.chance(.35)){ log(`Tive uma overdose de ${d.n.toLowerCase()}.`,'bad'); die(`de overdose de ${d.n.toLowerCase()}`); return 'Overdose.'; } st('health',-R.int(25,40)); log(`Overdose de ${d.n.toLowerCase()}: acordei no hospital.`,'bad'); t+=' Overdose: acordei no hospital com uma sonda no braço.'; }
  if(!loja&&lei!=='legal'&&R.chance(.05+(m.c.drogaFlagra?.02:0))) t+=drogaFlagra(id,'comprando');
  return t; }
function drogaReab(){ const m=S.me; if(!drogaVicioMax(m)) return 'Não tenho vício para tratar.'; const c=8000; if(!canPay(c)) return `A clínica custa ${fmt(c)}.`; m.money-=c;
  if(R.chance(.4+(m.will??50)/200)){ for(const k of Object.keys(m.drogas)) m.drogas[k]=Math.max(0,m.drogas[k]-R.int(40,70)); st('happy',6); st('health',5); log('Fiz reabilitação e saí limp'+oa()+'.','good'); return 'Três meses de clínica, grupo e abstinência. Saí limp'+oa()+'.'; }
  for(const k of Object.keys(m.drogas)) m.drogas[k]=Math.max(0,m.drogas[k]-R.int(5,15)); return 'Fugi da clínica na segunda semana.'; }
// todo ano: o vício cobra a conta
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m||!m.alive||S.scen) return; const D=m.drogas||{};
  for(const [id,v] of Object.entries(D)){ const d=DROGAS[id]; if(!d) continue; if(v>40){ st('health',-R.int(1,3)+(d.hl<-5?-2:0)); st('smarts',-1); const gasto=Math.round(d.preco*v/4); m.money-=Math.min(Math.max(0,m.money),gasto); if(d.od&&R.chance(d.od*v/25)){ if(R.chance(.3)){ die(`de overdose de ${d.n.toLowerCase()}`); return; } st('health',-25); log(`Overdose de ${d.n.toLowerCase()}. Sobrevivi por pouco.`,'bad'); } }
    if(v>0&&v<35&&!m.yr['droga_'+id]) D[id]=Math.max(0,v-R.int(3,8)); }
  const j=m.job; if(j&&!j.spc&&['poli','pilo','aero','ctrl','bomb','cami','medi','ciru','juiz','promo','dipl'].includes(j.id)&&(drogaVicioMax(m)>20||Object.keys(DROGAS).some(k=>m.yr['droga_'+k]))&&R.chance(.35)) queue('droga_exame',{});
  if(m.armaUso&&!m.prison){ const it=armasDe(m).find(x=>x.id===m.armaUso); const w=typeof mundo==='function'?mundo(m.country):{policia:50}; if(it&&armaPorteIlegal(it)&&R.chance(.12*(w.policia||50)/50)) queue('arma_abordagem',{}); }
  if(m.licArma&&m.licArma.pais!==m.country&&m.armas&&m.armas.length) m.armas.forEach(x=>{ if(x.pais!==m.country) x.legal=false; });
  const jl=m.job; if(jl&&jl.susp){ jl.susp--; if(!jl.susp) log('Acabou a minha suspensão por doping.','good'); }
  if(jl&&jl.spc==='atleta'&&jl.dop===S.year-1&&R.chance(.3)) queue('doping_teste',{}); });
EVENTS.droga_exame={when:m=>!!m.job&&!m.prison,show:()=>({k:'Trabalho',t:'Exame toxicológico',x:`${S.me.job.co} vai fazer um exame toxicológico surpresa em toda a equipe amanhã.`,ch:[['Fazer o exame e torcer','faz'],['Faltar com atestado','falta'],['Pedir demissão antes','sai']]}),
  pick:k=>{ const m=S.me, j=m.job; if(!j) return ''; const dem=m.gender==='F'?'demitida':'demitido', positivo=drogaVicioMax(m)>20||Object.keys(DROGAS).some(x=>m.yr['droga_'+x]);
    if(k==='faz'){ if(positivo&&R.chance(.8)){ log(`Fui ${dem} de ${j.co}: exame toxicológico positivo.`,'bad'); endJob(); st('happy',-12); return `Deu positivo. Fui ${dem} por justa causa.`; } return 'Deu negativo. Respirei aliviad'+oa()+'.'; }
    if(k==='falta'){ if(R.chance(.5)){ j.perf=clamp(j.perf-8); return 'Escapei desta vez, mas o RH marcou o meu exame para a semana que vem.'; } endJob(); return `O RH não aceitou o atestado. Fui ${dem}.`; }
    endJob(); return 'Pedi demissão antes do exame. Ninguém entendeu nada.'; }};
// ---------- doping no esporte ----------
EVENTS.doping_teste={when:m=>!!m.job&&(m.job.spc==='atleta'||m.job.spc==='lutador'),show:()=>({k:'Antidoping',t:'Exame antidoping',x:'Um fiscal da agência antidoping apareceu sem aviso, com um frasco para coleta de urina.',ch:[['Fazer o exame','faz'],['Tentar trocar a amostra','troca'],['Recusar o exame','recusa']]}),
  pick:k=>{ const m=S.me, j=m.job; if(!j) return ''; const sujo=j.dop>=S.year-1;
    const pune=t=>{ j.susp=2; j.perf=clamp(j.perf-35); m.fame=clamp(m.fame-8); m.karma=clamp(m.karma-6); j.dop=0; if(j.spc==='lutador'&&j.lvl>=6&&j.lvl<=7){ j.lvl=5; j.def=0; } log('Suspensão de dois anos por doping.','bad'); return t+' Suspensão de dois anos.'+(j.spc==='lutador'?' Perdi o cinturão.':''); };
    if(k==='faz') return sujo&&R.chance(.75)?pune('Deu positivo para anabolizantes.'):'Exame limpo.';
    if(k==='troca'){ if(R.chance(.35)) return 'Troquei a amostra no banheiro. Ninguém percebeu.'; return pune('Me pegaram trocando a amostra.'); }
    return pune('Recusar o exame conta como positivo.'); }};
// lutador dopado: mais força no camp, e o antidoping depois da luta
lutConfig=(o=>function(k,d){ const r=o.apply(this,arguments), j=S.me.job; if(r&&j&&j.dop>=S.year-1){ r.dmgB=(r.dmgB||0)+.15; r.estB=(r.estB||0)+15; } return r; })(lutConfig);
lutMarcar=(o=>function(){ const j=S.me.job; if(j&&j.susp) return `Estou suspens${oa()} por doping por mais ${j.susp} ano(s).`; return o.apply(this,arguments); })(lutMarcar);
specialAction=(o=>function(){ const j=S.me.job; if(j&&j.spc==='lutador'&&j.susp) return `Estou suspens${oa()} por doping por mais ${j.susp} ano(s).`; return o.apply(this,arguments); })(specialAction);
lutadorResultado=(o=>function(r,metodo){ const m=S.me, j=m.job, sujo=j&&j.dop>=S.year-1, tit=j&&j.luta&&j.luta.titulo; const res=o.apply(this,arguments);
  if(sujo&&R.chance(tit?.5:.3)){ if(r==='venceu'&&j.rec.v>0){ j.rec.v--; j.rec.e++; } j.susp=2; j.perf=clamp(j.perf-30); m.fame=clamp(m.fame-8); j.dop=0; if(j.lvl>=6&&j.lvl<=7){ j.lvl=5; j.def=0; j.co=lutOrg(j); }
    const t='O antidoping depois da luta deu positivo: resultado anulado e suspensão de dois anos.'; log(t,'bad'); if(FIGHT) FIGHT.lines.push(t); }
  return res; })(lutadorResultado);
V.jobMenu=(o=>function(){ const r=o.apply(this,arguments), m=S.me, j=m.job; if(!j||!r||!r.items||!(j.spc==='lutador'||j.spc==='atleta')) return r;
  r.items.push({sec:'Do lado escuro'},{ic:'💉',l:'Usar anabolizantes neste ciclo',s:j.susp?`Suspens${oa()} por mais ${j.susp} ano(s)`:'Mais força e fôlego · antidoping pode pegar',tone:'bad',on:()=>act(()=>drogaUsar('anabol'),'Doping')}); return r; })(V.jobMenu);
yearWork=(o=>function(){ const m=S.me, j=m.job; const r=o.apply(this,arguments); if(j&&m.job===j&&j.spc==='atleta'&&j.dop===S.year-1) j.perf=clamp(j.perf+10); return r; })(yearWork);

// ---------- telas ----------
V.armas=()=>{ const m=S.me, L=leiArmas(), it=[];
  it.push({html:`<div class="card"><p>${esc(L.txt)}</p>${kv('Licença de arma',L.fogo==='facil'?'Não precisa':armaLicenca(m)?'Tenho':'Não tenho')}${kv('Mira',(m.mira||10)+'%')}${kv('Ando com',m.armaUso?ARMAS[m.armaUso].n:'Nada')}</div>`});
  if(L.fogo!=='facil'&&!armaLicenca(m)) it.push({ic:'📋',l:'Tirar licença de arma',s:`${fmt(L.custo)} · exame psicológico e prova de tiro · a partir dos ${L.idade} anos`,on:()=>act(armaLicencaIniciar,'Licença')});
  it.push({ic:'🎯',l:'Treinar no estande de tiro',s:`${fmt(150)} · mira para a prova e para a vida`,on:()=>act(armaTreinar,'Estande')});
  const minhas=armasDe(m); if(minhas.length){ it.push({sec:'Minhas armas'}); minhas.forEach((x,i)=>{ const a=ARMAS[x.id]; it.push({ic:a.ic,l:a.n,s:`${x.legal?'Registrada':'Sem registro'}${armaPorteIlegal(x)?' · andar com ela aqui é crime':''}`,r:m.armaUso===x.id?'Comigo':'',tone:m.armaUso===x.id?'good':'',on:()=>UI.push(()=>({title:a.n,items:[{ic:'🎒',l:m.armaUso===x.id?'Deixar em casa':'Andar com ela',on:()=>act(()=>armaEquipar(i),a.n)},{ic:x.legal?'💵':'🌊',l:x.legal?'Vender':'Me livrar dela',tone:'bad',on:()=>act(()=>armaDescartar(i),a.n)}]}))}); }); }
  for(const tipo of ['branca','fogo']){ it.push({sec:tipo==='branca'?'Armas brancas':'Armas de fogo'});
    Object.entries(ARMAS).filter(([,a])=>a.tipo===tipo).forEach(([id,a])=>{ const ok=armaLegal(id);
      it.push({ic:a.ic,l:a.n,s:ok?`${fmt(a.preco)} · na loja${tipo==='branca'&&!L.branca?' · andar com ela na rua é crime aqui':''}`:`Proibida para mim aqui · mercado negro: ${fmt(Math.round(a.preco*2.5))}`,tone:ok?'':'bad',on:()=>act(()=>armaComprar(id,ok?'loja':'negro'),a.n)}); }); }
  return {title:'Armas',items:it}; };
V.drogas=()=>{ const m=S.me, it=[], D=drogasDe(m), L=LEI_DROGAS[m.country]||LEI_DROGAS.BR;
  it.push({html:`<div class="card"><p>Em ${esc(countryOf(m.country).n)}: maconha é ${esc(LEI_TXT[L[0]])}; as outras drogas, ${esc(LEI_TXT[L[1]])}.</p><p style="color:var(--muted);font-size:13px">Vício alto tira saúde, inteligência e dinheiro todo ano. Algumas drogas podem causar overdose.</p></div>`});
  const vic=Object.entries(D).filter(([,v])=>v>0); if(vic.length){ it.push({sec:'Meus vícios'}); it.push({html:`<div class="card">${vic.map(([k,v])=>bar(DROGAS[k].n,v)).join('')}</div>`}); it.push({ic:'🏥',l:'Clínica de reabilitação',s:`${fmt(8000)} · força de vontade ajuda`,on:()=>act(drogaReab,'Reabilitação')}); }
  it.push({sec:'Usar'}); Object.entries(DROGAS).forEach(([id,d])=>{ const lei=leiDroga(id); it.push({ic:d.ic,l:d.n,s:`${fmt(d.preco)} · ${lei==='legal'?'legal aqui':lei==='descrim'?'multa se pegarem':lei==='ilegal'?'crime aqui':'crime grave aqui'}${d.od?' · risco de overdose':''}`,tone:lei==='legal'?'':'bad',on:()=>act(()=>drogaUsar(id),d.n)}); });
  return {title:'Drogas',items:it}; };
V.activities=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(m.prison||!r||!r.items) return r; const i=r.items.findIndex(x=>x.l==='Crimes');
  r.items.splice(i>=0?i+1:r.items.length,0,Object.assign({ic:'🔫',l:'Armas',s:`Brancas e de fogo · ${leiArmas().fogo==='facil'?'compra fácil aqui':'licença ou mercado negro'}`,on:()=>UI.push(V.armas)},ageGate(18)),Object.assign({ic:'💊',l:'Drogas',s:drogaVicioMax(m)>40?'Estou viciad'+oa():'Cada país, uma lei',tone:drogaVicioMax(m)>40?'bad':'',on:()=>UI.push(V.drogas)},ageGate(16)));
  return r; })(V.activities);
// ---------- eventos ----------
pack({k:'Perigo',w:1,cd:8,min:18,when:m=>(m.armas||[]).length>0&&!m.prison},[
  ['Assalto na esquina','Um assaltante encosta em você no ponto de ônibus e pede o celular.',['Entregar o celular|$-v h-4|Melhor perder o celular que a vida.','Reagir com a minha arma|k-4 ?45 h+4|Ele viu a arma e saiu correndo.|hl-25 h-10|Ele atirou primeiro. Sobrevivi por pouco.'],{v:[800,2500]}],
  ['Arma em casa','Você acorda de madrugada com um barulho na cozinha.',['Pegar a arma e ir ver|?60 k-2|Era o gato derrubando panela. Meu coração quase parou.|hl-10 h-8|Era um ladrão. Ele fugiu, mas me machucou na confusão.','Ligar para a polícia e trancar a porta|h-2|A polícia chegou em vinte minutos. Não era nada.']],
  ['Clube de tiro','Um clube de tiro esportivo convida você para uma competição amadora.',['Competir|?60 h+6 f+1|Fiquei em terceiro. Medalha na estante.|h-3|Errei o alvo na frente de todo mundo.','Recusar|h+0|Prefiro atirar sem plateia.']],
  ['Vizinho desconfiado','Um vizinho viu você carregando uma arma e chamou o síndico.',['Explicar com calma|?lk h+0|Mostrei que estava guardada e descarregada. Ele se acalmou.|h-4|Agora o prédio inteiro cochicha.','Mandar cuidar da própria vida|k-3 h-2|O clima no elevador ficou insuportável.']],
]);
pack({k:'Vício',w:1.2,cd:6,min:16,when:m=>drogaVicioMax(m)>=30&&!m.prison},[
  ['Fissura','A vontade de usar não deixa você pensar em mais nada.',['Ligar para um amigo e sair de casa|will+3 h-4|Passei a noite andando. Não usei.','Ceder|h+4 hl-4 $-v|Cedi. De novo.'],{v:[100,800]}],
  ['Dívida com o traficante','O traficante cobra {v} que você ficou devendo.',['Pagar|$-v|Paguei. Ele sorriu como quem sabe que eu volto.','Enrolar|?40 h+0|Ele aceitou esperar mais um mês.|hl-15 h-8|Me deram um recado nas costelas.'],{v:[500,5000]}],
  ['Amigo preocupado','Um amigo antigo diz que você não é mais a mesma pessoa.',['Admitir que precisa de ajuda|will+5 h+3|Ele me abraçou e prometeu me levar à clínica.','Brigar com ele|h-6|Perdi mais um amigo.']],
  ['Apagão','Você acordou num lugar que não reconhece, sem lembrar da noite anterior.',['Prometer que foi a última vez|will+2 h-5|Prometi. Para mim mesm{o}.','Rir da situação|hl-3|Rir é mais fácil que pensar.']],
]);
extTok=(o=>function(tok,d,out){ const mm=tok.match(/^will([+-]\d+)$/); if(mm){ S.me.will=clamp((S.me.will??50)+ +mm[1]); return true; } return o(tok,d,out); })(extTok);
