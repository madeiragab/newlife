// ===== Seita (parte 3): começo na deep web, estágios e doutrinas, sermão ao vivo, segurança, atentados, complôs e rivais =====
const SEITA_ESTAGIOS=[[0,'Fórum','💻','Só um apelido e alguns posts anônimos na deep web.'],[5,'Célula','🕯️','Um punhado de seguidores que se encontra em segredo.'],[30,'Comunidade','🏘️','Um grupo de verdade, com rotina, regras e caixa.'],[200,'Igreja','⛪','Sede, cargos e a imprensa de olho.'],[2000,'Movimento','📡','Milhares de fiéis, influência política e inimigos poderosos.'],[20000,'Império da fé','👑','Uma potência. Todo mundo quer um pedaço, ou a sua cabeça.']];
const seitaEstagio=s=>{ let i=0; SEITA_ESTAGIOS.forEach((e,k)=>{ if((s.fieis||0)>=e[0]) i=k; }); return i; };
const SEITA_DOUTRINAS={
  sigilo:['🤫','Sigilo absoluto','Menos suspeita e menos atentados, mas o grupo cresce mais devagar.'],
  dizimo:['🧺','Dízimo obrigatório','O caixa enche bem mais rápido, e a fé cansa.'],
  profeta:['🌟','Profeta vivo','Fama e fé sobem todo ano. Também o número de gente querendo me matar.'],
  isolamento:['🏚️','Isolamento do mundo','Fé enorme e poucos desertores. A polícia não gosta nada.'],
  obras:['🤲','Obras sociais','Menos suspeita e mais carma, ao custo de parte do caixa.'],
  digital:['📡','Evangelho digital','Seguidores online chegam e se convertem mais rápido.'],
  martirio:['🩸','Culto ao martírio','Cada atentado sobrevivido vale o dobro de fé.']};
const SEITA_SEG=[['Sem segurança',0,0],['Seguranças particulares',15000,6000],['Escolta armada e carro blindado',90000,30000],['Guarda própria',450000,120000]];
const SEITA_NICKS=['lux_aeterna','0mega_','profeta404','sombra_azul','nihil.exe','corvo_branco','anon7','fim_dos_dias','vigia_noturno','eterna.chama','sal_da_terra','olho_que_ve'];
const sGen=t=>String(t).replace(/\{o\}/g,oa());
function s3(s){ if(!s) return s; s.agenda=s.agenda||[];
  if(s.membro){ if(s.conf==null) s.conf=30; return s; }
  s.online=s.online||0; s.seg=s.seg||0; s.inim=s.inim||0; s.dout=s.dout||[]; s.atent=s.atent||0; s.cripto=s.cripto||0;
  if(s.estMax==null) s.estMax=seitaEstagio(s); return s; }
const s3Tem=(s,d)=>!!s&&(s.dout||[]).includes(d);
function s3Agendar(s,anos,id,d){ s3(s).agenda.push({a:S.year+anos,id,d:d||{}}); }
function s3Estagio(){ const s=seita(); if(!s||s.membro) return; s3(s); const e=seitaEstagio(s); if(e>s.estMax){ s.estMax=e; queue('seita_estagio',{e}); } }
function s3Pago(s,c){ const m=S.me; if(s.caixa+m.money<c) return false; const dc=Math.min(s.caixa,c); s.caixa-=dc; m.money-=c-dc; return true; }
// quando o personagem passa a liderar o grupo em que era membro
function s3Assumir(s,txt){ s.membro=0; s.cargo=0; s.lider=null; s.liderId=null; s.suspeito=0; s.prova=0; s.devo=clamp(s.devo-10); s.estMax=null; s3(s); log(txt,'good'); }
const s3Novo=old=>R.pick(SEITA_LIDERES.filter(x=>x!==old));
const s3LiderA=n=>/^(Mãe|Irmã|Bispa)/.test(n||'')?'a':'o';

// ---------- fundar: tudo começa num post anônimo ----------
seitaFundar=(o=>function(tipo,nome){ const ja=!!S.me.seita; const r=o.apply(this,arguments); const s=seita(); if(ja||!s||s.membro) return r;
  s.fieis=0; s.devo=70; s.online=0; s3(s); s.estMax=0;
  log(`Criei um apelido anônimo e abri um tópico sobre ${s.n} num fórum da deep web. É assim que tudo começa.`,'warn');
  return `${s.n} existe, por enquanto, só num post anônimo na deep web. Primeiro divulgo nos fóruns e junto seguidores online, depois marco o primeiro encontro de verdade.`; })(seitaFundar);
// no começo o grupo vive dos seguidores online: não acaba só porque ainda não há fiéis presenciais
seitaFim=(o=>function(why){ const s=seita(); if(why==='Não sobrou ninguém.'&&s&&!s.membro&&((s.online||0)>0||(s.anos||0)<=3)){ s.fieis=0; return ''; } return o.apply(this,arguments); })(seitaFim);
seitaAcao=(o=>function(){ const r=o.apply(this,arguments); s3Estagio(); return r; })(seitaAcao);

// ---------- minigame: divulgar num fórum da deep web ----------
const SEITA_FORUNS=[
  {id:'conspira',n:'Fórum de teorias da conspiração',dica:'gente que adora um segredo e desconfia de tudo',quer:'misterio',risco:.12,pub:[25,70]},
  {id:'chan',n:'Imageboard anônimo',dica:'muito movimento e muito deboche; quem leva a sério é porque espera o fim',quer:'apoc',risco:.3,pub:[40,150]},
  {id:'solidao',n:'Comunidade de gente solitária',dica:'pessoas cansadas que só querem pertencer a algum lugar',quer:'acolher',risco:.05,pub:[10,45]},
  {id:'cripto',n:'Fórum de criptomoedas',dica:'jovens ambiciosos atrás do próximo grande atalho',quer:'riqueza',risco:.15,pub:[15,80]},
  {id:'ocult',n:'Fórum de ocultismo',dica:'buscadores de rituais antigos e conhecimento proibido',quer:'misterio',risco:.1,pub:[15,55]},
  {id:'sobrev',n:'Fórum de sobrevivencialistas',dica:'gente estocando enlatados e esperando o colapso',quer:'apoc',risco:.18,pub:[20,70]},
  {id:'autoaj',n:'Grupo oculto de autoajuda',dica:'quem já tentou de tudo para mudar de vida e ainda não conseguiu',quer:'riqueza',risco:.08,pub:[15,60]},
  {id:'luto',n:'Fórum de luto',dica:'gente que perdeu alguém e procura um sentido',quer:'acolher',risco:.04,pub:[8,35]}];
const SEITA_TONS=[['misterio','Um post enigmático, cheio de símbolos e meias-verdades'],['apoc','Um alerta sobre o fim que se aproxima'],['acolher','Um convite caloroso para quem se sente sozinho'],['riqueza','A promessa de um caminho secreto para a prosperidade']];
const SEITA_TIPO_TOM={apoc:'apoc',natureza:'misterio',guru:'riqueza',igreja:'acolher'};
const sLeader=m=>!!m.seita&&!m.seita.membro;
EVENTS.seita_forum={when:sLeader,
  show:d=>{ const s=seita();
    if(d.e===1){ const f=SEITA_FORUNS.find(x=>x.id===d.f); return {k:'Deep web',t:'Escrever o post',x:`Entrei no ${f.n.toLowerCase()}. Quem frequenta é ${f.dica}. Que tipo de post vou escrever sobre ${s.n}?`,ch:SEITA_TONS.map(([k,l])=>[l,k])}; }
    return {k:'Deep web',t:'Divulgar na deep web',x:'Abro o navegador anônimo, troco de VPN duas vezes e entro com o meu apelido. Hoje dá para postar em um lugar só. Qual?',ch:d.op.map(id=>{ const f=SEITA_FORUNS.find(x=>x.id===id); return [`${f.n}: ${f.dica}`,id]; })}; },
  pick:(k,d)=>{ const m=S.me, s=s3(seita()); if(!s) return '';
    if(d.e!==1){ queue('seita_forum',{e:1,f:k}); return ''; }
    const f=SEITA_FORUNS.find(x=>x.id===d.f); let mult=k===f.quer?1:.3; if(SEITA_TIPO_TOM[s.tipo]===k) mult+=.25;
    mult*=1+((m.talent.writing||0)+m.smarts)/400; if(s3Tem(s,'digital')) mult*=1.3;
    const n=Math.max(0,Math.round(R.int(f.pub[0],f.pub[1])*mult)); s.online+=n; s.posts=(s.posts||0)+1;
    let t=k===f.quer?R.pick([`O post bombou. ${n} pessoas responderam pedindo mais, e alguém já desenhou o nosso símbolo.`,`Acertei o tom em cheio. O tópico ficou no topo a noite toda: ${n} novos seguidores online.`])
      :n?`O post não combinou muito com aquele lugar, mas ${n} curiosos começaram a me seguir.`:'Ninguém respondeu. Um usuário escreveu "kkk" e sumiu.';
    if(R.chance(f.risco*(s.cripto?.5:1))){ const x=R.int(0,2);
      if(x===0){ s.susp+=R.int(6,12); t+=' Depois, alguém postou o meu IP no tópico. Troquei tudo, mas fiquei com medo.'; }
      else if(x===1){ s.online=Math.max(0,s.online-Math.round(n/2)); s.fama+=2; t+=' Uma enxurrada de trolls invadiu o tópico e espantou metade dos novatos.'; }
      else { s.infiltrado=1; t+=' Um usuário novo faz perguntas demais. Pode ser só curiosidade.'; } }
    if(!s.dm&&n>0&&R.chance(.6)) queue('seita_dm',{nick:R.pick(SEITA_NICKS)});
    seitaFix(s); s3Estagio(); return t; }};
EVENTS.seita_dm={when:sLeader,
  show:d=>({k:'Deep web',t:'Mensagem privada',x:`O usuário "${d.nick}" me mandou uma mensagem privada: "Li o seu post três vezes. Acho que eu estava esperando por isso a vida toda. Quero saber mais."`,ch:[['Responder com cuidado e conversar','r'],['Mandar o link do canal secreto','l'],['Ignorar: pode ser armadilha','i']]}),
  pick:(k,d)=>{ const s=s3(seita()); if(!s) return '';
    if(k==='i'){ if(R.chance(.3)){ s.inim++; return `Deixei sem resposta. "${d.nick}" mandou mais dez mensagens, cada uma mais furiosa. A última dizia que sabe onde eu moro.`; } return `Deixei sem resposta. "${d.nick}" desistiu depois de três mensagens.`; }
    s.dm={nick:d.nick,tipo:R.wpick([['fiel',5],['policia',s.infiltrado?3:1],['jornalista',1.5],['louco',1.5]])};
    if(k==='l'){ s.online+=R.int(3,10); return `Mandei o link. "${d.nick}" entrou no canal e chamou mais gente. Diz que vai estar no primeiro encontro.`; }
    return `Conversamos até as quatro da manhã. "${d.nick}" quer me conhecer pessoalmente no primeiro encontro.`; }};

// ---------- encontro secreto: os seguidores online viram fiéis de carne e osso ----------
const SEITA_LOCAIS=[['praca','Uma praça pública, de dia','seguro, mas pouca gente se entrega',.12,0,0],['cafe','Os fundos de uma cafeteria','discreto e barato',.18,.04,300],['galpao','Um galpão abandonado, à luz de velas','clima perfeito, e a polícia ronda',.3,.15,800],['sitio','Um sítio afastado, com fogueira','caro e inesquecível',.4,.08,6000]];
EVENTS.seita_encontro={when:sLeader,
  show:()=>{ const s=seita(); return {k:'Religião',t:'Encontro secreto',x:`${s.online.toLocaleString('pt-BR')} seguidores online sabem que vai haver um encontro de ${s.n}. Onde vai ser?`,ch:SEITA_LOCAIS.map(l=>[`${l[1]} (${l[2]}${l[5]?', '+fmt(l[5]):''})`,l[0]])}; },
  pick:k=>{ const m=S.me, s=s3(seita()); if(!s) return ''; const L=SEITA_LOCAIS.find(l=>l[0]===k);
    if(L[5]&&!s3Pago(s,L[5])) return `Não tenho ${fmt(L[5])} para esse lugar. O encontro ficou para depois.`;
    const taxa=Math.min(.9,L[3]*2*(1+(m.looks+m.smarts)/400)*(s.cripto?1.25:1)*(s3Tem(s,'digital')?1.2:1));
    const vieram=Math.max(1,Math.round(s.online*R.int(30,70)/100)), n=Math.min(vieram,Math.round(vieram*taxa));
    s.online=Math.max(0,s.online-n-Math.round((vieram-n)*.3)); s.fieis+=n; s.devo+=n?R.int(2,6):-3; if(!s.enc){ s.enc=1; m.c.seitaEncontro=1; }
    let t=n?`Vieram ${vieram} pessoas. ${n} saíram de lá decididas a seguir ${s.n}.`:`Vieram ${vieram} pessoas, olharam umas para as outras e foram embora sem se comprometer.`;
    if(R.chance(L[4]+(s.infiltrado?.15:0))){ s.susp+=R.int(8,15); s.infiltrado=0; t+=' Na saída, vi uma viatura parada na esquina e alguém fotografando as placas.'; }
    if(s.dm&&!s.dm.visto){ s.dm.visto=1; queue('seita_dm_revela',{}); }
    seitaFix(s); s3Estagio(); return t; }};
EVENTS.seita_dm_revela={when:m=>sLeader(m)&&!!m.seita.dm,
  show:()=>{ const s=seita(), n=s.dm.nick;
    const T={fiel:[`No meio da roda, reconheço "${n}" pelo jeito de falar. Chora ao me abraçar e diz que largou tudo para estar ali.`,[['Fazer de "'+n+'" meu braço direito','braco'],['Tratar como qualquer fiel','igual']]],
      policia:[`No fim do encontro, "${n}" mostra um distintivo. Era policial disfarçado, e me entrega uma intimação para depor.`,[['Ir depor com advogado ('+fmt(5000)+')','adv'],['Não comparecer','falta'],['Tentar converter o policial','conv']]],
      jornalista:[`"${n}" se apresenta: é jornalista e está escrevendo uma reportagem sobre seitas que nascem na internet.`,[['Dar uma entrevista','ent'],['Pedir que não publique','pede'],['Ameaçar','ame']]],
      louco:[`"${n}" chega com uma faca na mochila. Diz que eu sou a reencarnação de um deus, e que deuses precisam provar que não morrem.`,[['Acalmar com calma e paciência','acalma'],['Chamar a polícia','pol'],['Expulsar do encontro','exp']]]}[s.dm.tipo];
    return {k:'Religião',t:'Quem era "'+n+'"',x:T[0],ch:T[1]}; },
  pick:k=>{ const m=S.me, s=s3(seita()); if(!s) return ''; const n=s.dm.nick; let t='';
    switch(k){
      case 'braco': s.braco=n; s.devo+=8; s.fieis+=1; t=`"${n}" virou meu braço direito. Organiza tudo e não dorme.`; break;
      case 'igual': s.devo+=3; t='Tratei como os outros. Ninguém é especial aqui, só eu.'; break;
      case 'adv': if(s3Pago(s,5000)){ s.susp-=5; t='Depus com advogado e não disse nada de comprometedor.'; } else { s.susp+=6; t='Fui sem advogado e falei demais.'; } break;
      case 'falta': s.susp+=15; t='Não fui. Agora sou "investigado por não colaborar".'; break;
      case 'conv': if(R.chance(.3)){ s.fieis+=1; s.susp-=10; t='Ele voltou na semana seguinte, sem distintivo.'; } else { s.susp+=20; t='Ele anotou tudo o que eu disse para o relatório.'; } break;
      case 'ent': if(R.chance(.45+m.smarts/250)){ s.fama+=10; s.online+=R.int(20,60); t='A reportagem saiu curiosa, quase simpática. Choveram seguidores.'; } else { s.susp+=10; s.fama+=4; t='A reportagem me chamou de "guru de fórum". Doeu.'; } break;
      case 'pede': if(R.chance(.5)){ t='Ela topou esperar. Por enquanto.'; } else { s3Agendar(s,1,'seita_materia',{}); t='Ela sorriu e não prometeu nada.'; } break;
      case 'ame': m.karma=clamp(m.karma-10); s.inim++; s.susp+=8; s3Agendar(s,1,'seita_materia',{}); t='A ameaça virou o primeiro parágrafo da matéria.'; break;
      case 'acalma': if(R.chance(.5+m.smarts/300)){ s.devo+=5; s.fieis+=1; t='Conversei até o sol nascer. Ele entregou a faca e virou o fiel mais devoto do grupo.'; } else { queue('seita_atentado',{met:'faca',atk:'fanatico'}); t='Ele parou de ouvir no meio da frase.'; } break;
      case 'pol': s.susp+=4; s.inim++; t='Levaram o rapaz. Ele gritou meu nome até a viatura dobrar a esquina.'; break;
      case 'exp': s.inim++; s3Agendar(s,R.int(1,2),'seita_atentado',{met:R.pick(['faca','fogo']),atk:'fanatico'}); t='Mandei embora. Ele saiu sem dizer nada, o que foi pior.'; break; }
    seitaFix(s); return t; }};
EVENTS.seita_materia={when:sLeader,show:()=>({k:'Imprensa',t:'A reportagem saiu',x:`Saiu a reportagem sobre ${seita().n}, com prints dos fóruns e fotos do primeiro encontro.`,ch:[['Responder com uma carta aberta','c'],['Usar a polêmica para crescer','u'],['Ficar em silêncio','s']]}),
  pick:k=>{ const m=S.me, s=s3(seita()); if(!s) return '';
    if(k==='c'){ if(R.chance(.5+m.smarts/300)){ s.fama+=6; s.susp-=5; seitaFix(s); return 'A carta foi bem escrita. Muita gente mudou de opinião.'; } s.susp+=5; seitaFix(s); return 'A carta virou meme.'; }
    if(k==='u'){ s.online+=R.int(30,120); s.fama+=8; s.susp+=8; seitaFix(s); return 'Falem mal, mas falem de mim. Os fóruns ferveram.'; }
    s.susp+=4; seitaFix(s); return 'O silêncio pareceu confissão, mas a notícia passou.'; }};

// ---------- estágios e doutrinas ----------
EVENTS.seita_estagio={when:sLeader,
  show:d=>{ const s=s3(seita()), E=SEITA_ESTAGIOS[d.e], livres=Object.keys(SEITA_DOUTRINAS).filter(k=>!s.dout.includes(k));
    if(!d.op) d.op=R.shuffle(livres).slice(0,3);
    const ch=d.op.map(k=>[`${SEITA_DOUTRINAS[k][0]} ${SEITA_DOUTRINAS[k][1]}: ${SEITA_DOUTRINAS[k][2]}`,k]);
    return {k:'Religião',t:`${E[2]} ${s.n} virou ${['','uma célula','uma comunidade','uma igreja','um movimento','um império da fé'][d.e]}`,
      x:`${E[3]} ${ch.length?'Uma nova fase pede uma nova doutrina. Qual vai guiar o grupo daqui em diante?':'Todas as doutrinas já guiam o grupo.'}`,ch:ch.length?ch:[['Seguir em frente','x']]}; },
  pick:(k,d)=>{ const m=S.me, s=s3(seita()); if(!s) return ''; const E=SEITA_ESTAGIOS[d.e]; s.fama+=d.e*2; m.fame=clamp(m.fame+(d.e>=3?d.e:0));
    if(d.e>=3) noticia(`${s.n} se torna ${E[1].toLowerCase()}`,`O grupo liderado por ${fullName(m)} já reúne ${s.fieis.toLocaleString('pt-BR')} fiéis.`,'personagem','seita:'+s.n+':'+d.e);
    log(`${E[2]} ${s.n} chegou ao estágio de ${E[1].toLowerCase()}.`,'good');
    if(!SEITA_DOUTRINAS[k]){ seitaFix(s); return 'O grupo segue as doutrinas que já tem.'; }
    s.dout.push(k); seitaFix(s); return `A partir de hoje, ${SEITA_DOUTRINAS[k][1].toLowerCase()} é lei em ${s.n}.`; }};

// ---------- minigame: sermão ao vivo em três partes ----------
const SEITA_HUMOR={medo:'Os rostos estão tensos. Alguém pergunta, baixinho, se o pior está por vir.',esperanca:'Muita gente chegou cansada, com conta atrasada e olhar perdido.',duvida:'Lá no fundo, alguns cruzam os braços e cochicham entre si.',euforia:'O salão está elétrico: gente batendo palma antes mesmo de eu começar.'};
const SEITA_RETORICA=[['Falar do fim dos tempos e do julgamento','medo'],['Prometer salvação, cura e prosperidade','esperanca'],['Revelar um mistério que só eu conheço','duvida'],['Puxar um cântico e fazer todos dançarem','euforia']];
const SEITA_QUASE={medo:['duvida'],esperanca:['medo','euforia'],duvida:['medo'],euforia:['esperanca']};
EVENTS.seita_sermao={when:m=>!!m.seita&&!m.prison,
  show:d=>{ const s=seita(); return {k:'Sermão',t:`Sermão ao vivo · parte ${d.r+1} de 3`,x:`${d.r===0?(s.membro?'Hoje o púlpito é meu. ':'O salão está cheio. '):`Até aqui: ${d.pts} ponto${Math.abs(d.pts)===1?'':'s'} de reação. `}${SEITA_HUMOR[d.hum]} O que eu faço agora?`,ch:SEITA_RETORICA.map(([l,k])=>[l,k])}; },
  pick:(k,d)=>{ const m=S.me, s=s3(seita()); if(!s) return '';
    let g=k===d.hum?3:SEITA_QUASE[k].includes(d.hum)?1:-1; if(g>0&&R.chance(((m.talent.acting||0)+m.smarts)/400)) g++;
    const pts=d.pts+g, reacao=g>=3?R.pick(['A plateia explodiu.','Vi gente chorando na primeira fila.','O silêncio virou um coro de améns.']):g>0?R.pick(['Funcionou, mais ou menos.','Alguns acenaram com a cabeça.']):R.pick(['Uma tosse no fundo. Outra. Perdi a sala por um minuto.','Alguém riu na hora errada.','Vi gente olhando o celular.']);
    if(d.r<2){ queue('seita_sermao',{r:d.r+1,pts,hum:R.pick(Object.keys(SEITA_HUMOR).filter(x=>x!==d.hum))}); return reacao; }
    let t=`${reacao} Fim do sermão: ${pts} de 12 pontos de reação.`;
    if(s.membro){ s.xp+=Math.max(0,pts); s.conf=clamp(s.conf+pts*2); s.fe=clamp((s.fe||50)+Math.max(0,pts)); if(pts>=10){ s.conf=clamp(s.conf+10); t+=` ${s.lider} me chamou para pregar no culto principal de domingo.`; } else if(pts<=2) t+=' Os pastores mais velhos trocaram olhares.'; }
    else { s.devo+=pts*3-4; const novos=pts>=6?R.int(2,8)+Math.round(s.fieis*pts/300):0; s.fieis+=novos; if(pts>=8) s.fama+=4; st('happy',pts>=6?5:-2);
      if(novos) t+=` ${novos} visitantes pediram para entrar.`; if(pts>=10){ t+=' Foi um transe coletivo. Alguém filmou.'; log(`Fiz o sermão da minha vida em ${s.n}. Transe coletivo.`,'good'); s3Agendar(s,1,'seita_viral',{}); } }
    seitaFix(s); s3Estagio(); return t; }};
EVENTS.seita_viral={when:sLeader,show:()=>({k:'Internet',t:'O sermão viralizou',x:'Um trecho do meu sermão do ano passado, com todo mundo em transe, passou de milhões de visualizações.',ch:[['Aproveitar e fazer uma live','l'],['Pedir para tirarem do ar','t']]}),
  pick:k=>{ const m=S.me, s=s3(seita()); if(!s) return ''; if(k==='l'){ s.online+=R.int(100,600); s.fieis+=R.int(10,50); s.fama+=10; s.susp+=6; m.fame=clamp(m.fame+5); seitaFix(s); s3Estagio(); return 'A live teve mais gente do que qualquer culto que já fiz.'; }
    s.susp-=6; seitaFix(s); return 'Tiraram do ar. Os fiéis guardaram cópias.'; }};

// ---------- atentados contra o personagem ----------
const SEITA_ATK={ex:'um ex-fiel que perdeu tudo para o grupo',pai:'o pai de uma fiel que cortou contato com a família',rival:'um capanga da seita rival',fanatico:'um fanático convencido de que eu sou um falso profeta',politico:'um matador contratado por um político que eu contrariei',traidor:'alguém do meu próprio círculo de confiança',lider:'um homem de confiança do líder'};
const SEITA_MET={
  faca:{t:'Faca no culto',x:'No meio do culto, {a} sai da multidão com uma faca e corre na minha direção.',ch:[['Me jogar no chão e rolar para longe','chao',.55,.06,0],['Enfrentar o agressor no braço','luta',.35,.1,1],['Gritar para os fiéis o segurarem','fieis',.5,.07,0],['Ficar parad{o} e encarar, sem medo','encarar',.3,.12,0]]},
  tiro:{t:'Tiros na saída',x:'Saindo do templo à noite, um carro freia ao meu lado. No banco de trás está {a}, com uma arma.',ch:[['Correr em zigue-zague','corre',.4,.14,1],['Me jogar atrás de um carro','abrigo',.55,.09,0],['Voltar correndo para dentro do templo','volta',.45,.11,0],['Levantar as mãos e tentar conversar','fala',.25,.16,0]]},
  veneno:{t:'O cálice amargo',x:'Na ceia, o cálice que me servem tem um cheiro estranho. Quem serviu foi {a}, que agora evita o meu olhar.',ch:[['Beber assim mesmo, por fé','beber',.15,.3,0],['Fingir que bebe','fingir',.6,.05,0],['Oferecer o cálice a quem serviu','oferece',.55,.04,0],['Derrubar o cálice "sem querer"','derruba',.7,.02,0]]},
  bomba:{t:'Um fio solto',x:'Meu motorista estranha um fio solto embaixo do carro, minutos antes de sairmos. Do outro lado da rua, {a} observa.',ch:[['Mandar todo mundo correr','corre',.7,.04,0],['Chamar a polícia e esperar','policia',.65,.05,0],['Mandar o motorista checar o fio','motorista',.45,.06,0],['Dizer que é bobagem e entrar no carro','entra',.15,.35,0]]},
  fogo:{t:'Incêndio de madrugada',x:'Acordo com fumaça. A casa do grupo está pegando fogo, e as portas foram trancadas por fora. Antes de sumir, {a} riscou um símbolo na parede.',ch:[['Quebrar a janela e pular','janela',.5,.07,1],['Acordar os fiéis primeiro','fieis',.4,.1,0],['Procurar a saída dos fundos','fundos',.45,.09,0],['Rezar e esperar ajuda','rezar',.2,.2,0]]}};
function s3AtkTxt(atk){ const s=seita(); return (SEITA_ATK[atk]||SEITA_ATK.ex).replace('do líder','de '+((s&&s.lider)||'o líder')); }
function s3Atacante(s){ const l=[['ex',3],['pai',2],['fanatico',2]]; if(s.rival) l.push(['rival',4]); if((s.dom||[]).length||s.fieis>=2000) l.push(['politico',2]); if(s.fieis>=200) l.push(['traidor',1.5]); return R.wpick(l); }
function s3RiscoAtentado(s){ if(!s||s.membro||s.fieis<5) return 0; s3(s);
  const p=.006+s.fama/2500+s.susp/2200+s.inim*.025+(s.fieis>=2000?.015:0)+(s.rival?.02:0)+(s3Tem(s,'profeta')?.02:0)+(s3Tem(s,'martirio')?.01:0)-(s3Tem(s,'sigilo')?.01:0)-s.seg*.012;
  return Math.max(.002,Math.min(.25,p)); }
function s3Atentar(s,met,atk){ met=met||R.pick(Object.keys(SEITA_MET)); atk=atk||s3Atacante(s);
  if(!s.membro&&(s.seg>=1||s.info)&&R.chance(.25+s.seg*.15+(s.info?.25:0))) queue('seita_aviso',{met,atk}); else queue('seita_atentado',{met,atk}); }
EVENTS.seita_atentado={when:m=>!!m.seita&&!m.prison,
  show:d=>{ const M=SEITA_MET[d.met]; return {k:'Perigo',t:'Atentado: '+M.t.toLowerCase(),x:sGen(M.x.replace('{a}',s3AtkTxt(d.atk)))+(d.bonus?' A segurança reforçada já está em posição.':''),ch:M.ch.map(c=>[sGen(c[0]),c[1]])}; },
  pick:(k,d)=>{ const m=S.me, s=s3(seita()); if(!s) return ''; const c=SEITA_MET[d.met].ch.find(x=>x[1]===k); const seg=(s.membro?0:s.seg)+(d.bonus?1:0);
    const pOk=c[2]+seg*.1+(c[4]?(m.talent.athletic||30)/250-.12:0)+(m.health-50)/500;
    const pMorte=c[3]*Math.max(.15,1-seg*.22)*(m.health<30?1.5:1);
    const x=R.f(); s.atent=(s.atent||0)+1; m.c.atentados=(m.c.atentados||0)+1;
    if(x<pMorte){ log(`Sofri um atentado: ${s3AtkTxt(d.atk)}.`,'bad'); die(`assassinad${oa()} num atentado contra ${s.membro?'um membro de':'o líder de'} ${s.n}`); return 'Não deu tempo de nada.'; }
    const ileso=x<pMorte+pOk; let t;
    if(ileso) t=R.pick(['Saí sem um arranhão. Os fiéis juram que foi proteção divina.','Escapei por centímetros. Minhas mãos não param de tremer.','Nem eu sei como saí intact'+oa()+' daquilo.']);
    else { const h=R.int(15,45); st('health',-h); st('happy',-8); t=h>30?'Fui parar na UTI. Três dias entre a vida e a morte.':'Saí ferid'+oa()+', com pontos e um susto que não passa.'; }
    log(`Sobrevivi a um atentado: ${s3AtkTxt(d.atk)}.`,ileso?'warn':'bad');
    const preso=R.chance(.35+seg*.15+(['luta','fieis','policia'].includes(k)?.2:0)+(ileso?.1:0));
    queue('seita_atentado_depois',{atk:d.atk,preso:preso?1:0,ferido:ileso?0:1}); seitaFix(s); return t; }};
EVENTS.seita_aviso={when:sLeader,
  show:d=>{ const s=seita(); return {k:'Perigo',t:'Um aviso',x:`${s.info?'Um dos meus informantes':'O chefe da minha segurança'} me procura de madrugada: ${s3AtkTxt(d.atk)} está planejando um atentado contra mim nas próximas semanas.`,ch:[['Cancelar os cultos por um tempo','cancela'],['Reforçar a segurança ('+fmt(10000)+')','reforca'],['Armar uma armadilha','arma'],['Ignorar o aviso','ignora']]}; },
  pick:(k,d)=>{ const s=s3(seita()); if(!s) return '';
    if(k==='cancela'){ s.devo-=8; if(R.chance(.4)) s3Agendar(s,1,'seita_atentado',d); seitaFix(s); return 'Fiquei semanas trancad'+oa()+' em casa. Os fiéis estranharam a ausência. O perigo passou, por enquanto.'; }
    if(k==='reforca'){ if(s3Pago(s,10000)){ queue('seita_atentado',Object.assign({},d,{bonus:1})); return 'Dobrei a segurança. Agora é esperar.'; } queue('seita_atentado',d); return 'Não tinha dinheiro para reforçar nada.'; }
    if(k==='arma'){ if(R.chance(.45+s.seg*.1)){ queue('seita_atentado_depois',{atk:d.atk,preso:1,ferido:0,armadilha:1}); return 'Deixei a porta dos fundos aberta de propósito. Ele entrou direto nos braços dos meus seguranças.'; } queue('seita_atentado',d); return 'Ele não caiu na armadilha. E agora sabe que eu sei.'; }
    queue('seita_atentado',d); return 'Deve ser exagero.'; }};
EVENTS.seita_atentado_depois={when:m=>!!m.seita,
  show:d=>{ const s=seita(), quem=s3AtkTxt(d.atk);
    if(s.membro) return {k:'Perigo',t:'Depois do atentado',x:d.atk==='lider'?`Tenho certeza: quem mandou foi ${s.lider}. ${d.preso?'O agressor foi preso e já começou a falar.':'O agressor fugiu.'}`:`${d.preso?'O agressor foi preso':'O agressor fugiu'}: ${quem}.`,
      ch:[[d.atk==='lider'?`Denunciar ${s.lider} à polícia`:'Deixar com a polícia','den'],['Sair do grupo enquanto ainda estou viv'+oa(),'sai'],['Fingir que nada aconteceu','finge']]};
    return {k:'Perigo',t:'Depois do atentado',x:d.preso?`Os seguranças seguraram ${quem}. Os fiéis querem saber o que eu vou fazer.`:`O agressor fugiu. Era ${quem}. O grupo inteiro está em choque.`,
      ch:d.preso?[['Perdoar em público','perdoa'],['Entregar à polícia','policia'],['Vingança por conta própria','vinga'],['Transformar em sermão sobre perseguição','martir']]
        :[['Reforçar a segurança','seg'],['Investigar por conta própria','inv'],['Transformar em sermão sobre perseguição','martir'],['Sumir por um tempo','some']]}; },
  pick:(k,d)=>{ const m=S.me, s=s3(seita()); if(!s) return '';
    if(s.membro){
      if(k==='den'){ if(d.atk==='lider'&&d.preso&&R.chance(.6)){ const old=s.lider; if(s.cargo>=3&&R.chance(.5)){ s3Assumir(s,`${old} foi pres${s3LiderA(old)} por mandar me matar, e a assembleia me escolheu para liderar ${s.n}.`); return `O agressor confessou. ${old} foi pres${s3LiderA(old)}, e a assembleia me pôs no lugar.`; } s.lider=s3Novo(old); s.suspeito=0; s.conf=50; return `O agressor confessou. ${old} foi pres${s3LiderA(old)}. Agora quem lidera é ${s.lider}.`; }
        s.conf=clamp(s.conf-20); if(d.atk==='lider') s.suspeito=1; return 'Registrei a ocorrência. A investigação não andou, e todo mundo no grupo ficou sabendo.'; }
      if(k==='sai'){ const n=s.n; m.seita=null; st('happy',4); return `Saí de ${n} no mesmo dia. Mudei de número e de bairro.`; }
      s.conf=clamp(s.conf+5); return 'Voltei ao culto no domingo como se nada tivesse acontecido. Ninguém olhou nos meus olhos.'; }
    const mult=s3Tem(s,'martirio')?2:1; let t='';
    switch(k){
      case 'perdoa': m.karma=clamp(m.karma+12); s.devo+=8*mult; s.fama+=6; s3Agendar(s,R.int(2,4),'seita_carta',{atk:d.atk}); t='Abracei o agressor na frente de todos. Metade chorou. A outra metade me acha um santo.'; break;
      case 'policia': s.susp-=5; if(['rival','politico','traidor'].includes(d.atk)) s3Agendar(s,1,'seita_mandante',{atk:d.atk}); t='Entreguei à polícia. Ele vai a julgamento.'; break;
      case 'vinga': m.karma=clamp(m.karma-20); s.susp+=15; s.inim++; if(R.chance(.3)){ arrest('lesão corporal grave',1,4); t='Os meus homens exageraram, e a polícia chegou antes de terminarem.'; } else t='O agressor apareceu num hospital, sem lembrar de nada. Recado dado.'; break;
      case 'martir': s.devo+=R.int(10,20)*mult; s.fieis+=Math.round(s.fieis*.08*mult)+R.int(3,20); s.fama+=8; t=`Subi no púlpito ${d.ferido?'com os pontos ainda à mostra':'no mesmo dia'}: "Querem me calar porque falo a verdade". A fé explodiu.`; break;
      case 'seg': if(s.seg>=3){ t='Já tenho a maior segurança possível. Dobrei as rondas.'; break; } { const nx=SEITA_SEG[s.seg+1]; if(s3Pago(s,nx[1])){ s.seg++; t=`Contratei: ${nx[0].toLowerCase()}.`; } else t=`Não tenho ${fmt(nx[1])} para mais segurança.`; } break;
      case 'inv': s3Agendar(s,1,'seita_mandante',{atk:d.atk}); t='Pus gente de confiança para descobrir quem mandou.'; break;
      case 'some': s.devo-=10; s.susp-=8; s.inim=Math.max(0,s.inim-1); t='Passei meses num sítio sem sinal de celular. O grupo seguiu sem mim, meio perdido.'; break; }
    seitaFix(s); s3Estagio(); return t; }};
EVENTS.seita_mandante={when:sLeader,
  show:d=>{ const s=seita(), r=s.rival;
    const x={rival:r?`Descobri quem mandou: ${r.lider}, líder de ${r.n}.`:'Descobri quem mandou: o líder de um grupo rival que já fechou as portas.',politico:'Descobri quem mandou: um deputado que perdeu votos por minha causa.',traidor:`Descobri quem me traiu: ${s.braco?'"'+s.braco+'", o meu braço direito':'o tesoureiro do grupo'}.`}[d.atk]||'Descobri quem mandou: alguém que eu já tinha esquecido.';
    return {k:'Perigo',t:'O mandante',x,ch:[['Expor na imprensa','expor'],['Mandar o recado de volta','recado'],['Fazer as pazes em segredo','paz']]}; },
  pick:(k,d)=>{ const m=S.me, s=s3(seita()); if(!s) return '';
    if(k==='expor'){ if(s.rival&&d.atk==='rival') s.rival.forca-=25; if(d.atk==='traidor') s.braco=null; s.fama+=8; if(R.chance(.5)) s.inim=Math.max(0,s.inim-1); s3RivalFix(s); seitaFix(s); return 'A notícia saiu em todos os jornais. O mandante virou o vilão da história.'; }
    if(k==='recado'){ m.karma=clamp(m.karma-25); s.susp+=15; if(R.chance(.5)){ if(s.rival&&d.atk==='rival'){ const v=s.rival.n; s.rival=null; s.fieis+=R.int(20,200); seitaFix(s); return `O líder rival sumiu do mapa. ${v} fechou as portas, e os fiéis vieram para mim.`; } s.inim=Math.max(0,s.inim-1); seitaFix(s); return 'O recado foi entendido. Ninguém mais tocou no assunto.'; }
      s.inim+=2; s3Agendar(s,1,'seita_atentado',{met:R.pick(Object.keys(SEITA_MET)),atk:d.atk}); seitaFix(s); return 'O recado voltou com juros. Agora é guerra.'; }
    s.inim=Math.max(0,s.inim-1); if(s.rival&&d.atk==='rival') s.rival.forca-=5; s3RivalFix(s); seitaFix(s); return 'Um jantar discreto, um aperto de mão frio. Trégua.'; }};
EVENTS.seita_carta={when:sLeader,show:d=>({k:'Religião',t:'Uma carta da prisão',x:`Anos depois, ${s3AtkTxt(d.atk)}, o homem que tentou me matar, me escreve da prisão. Diz que pensa em mim todos os dias.`,ch:[['Visitar na prisão','v'],['Ler a carta para os fiéis','l'],['Queimar a carta','q']]}),
  pick:k=>{ const m=S.me, s=s3(seita()); if(!s) return '';
    if(k==='v'){ if(R.chance(.5)){ m.karma=clamp(m.karma+8); s.devo+=5; s.inim=Math.max(0,s.inim-1); seitaFix(s); return 'Ele pediu perdão e quer ser batizado lá dentro. Fundou uma célula do grupo na cadeia.'; } st('happy',-4); return 'Ele passou a visita inteira me encarando em silêncio. Não volto mais.'; }
    if(k==='l'){ s.devo+=6; seitaFix(s); return 'Li em voz alta no culto. "Até quem quis me matar reconhece a verdade."'; }
    return 'Queimei sem abrir a segunda página.'; }};

// ---------- rival ----------
function s3RivalFix(s){ const r=s.rival; if(!r) return; r.forca=Math.round(Math.max(0,Math.min(100,r.forca))); if(r.forca<=0){ log(`${r.n} perdeu força e fechou as portas.`,'good'); s.rival=null; } }
EVENTS.seita_rival_surge={when:m=>sLeader(m)&&!!m.seita.rival,
  show:()=>{ const r=seita().rival; return {k:'Religião',t:'Um rival',x:`${r.n}, liderad${s3LiderA(r.lider)} por ${r.lider}, abriu as portas perto do meu templo e anda dizendo que eu sou uma fraude.`,ch:[['Ignorar','i'],['Desafiar para um debate público','d'],['Propor uma aliança','a'],['Espalhar boatos sobre eles','b']]}; },
  pick:k=>{ const m=S.me, s=s3(seita()); if(!s||!s.rival) return ''; const r=s.rival; let t='';
    if(k==='i'){ r.forca+=5; t='Ignorei. Eles cresceram em silêncio.'; }
    else if(k==='d'){ if(R.chance(.35+m.smarts/250)){ r.forca-=15; s.fama+=6; t=`Destruí ${r.lider} no debate. A plateia mudou de lado.`; } else { r.forca+=10; s.fama-=3; t=`${r.lider} tinha resposta para tudo. Saí humilhad${oa()}.`; } }
    else if(k==='a'){ if(R.chance(.3+s.fieis/(s.fieis+r.forca*20+1)*.3)){ s.fieis+=Math.round(r.forca*R.int(3,10)); t=`${r.lider} aceitou se juntar a mim como bispo. ${r.n} agora é parte de ${s.n}.`; s.rival=null; } else { r.forca+=5; t='Recusaram rindo. Disseram que eu é que devia me juntar a eles.'; } }
    else { m.karma=clamp(m.karma-6); if(R.chance(.55)){ r.forca-=10; t='Os boatos pegaram. Eles perderam gente.'; } else { s.susp+=8; s.inim++; t='Descobriram quem espalhou. Agora o ódio é pessoal.'; } }
    s3RivalFix(s); seitaFix(s); return t; }};
EVENTS.seita_rival_acao={when:m=>sLeader(m)&&!!m.seita.rival,
  show:()=>{ const r=seita().rival; return {k:'Religião',t:'Contra '+r.n,x:`${r.n} tem força ${r.forca} de 100. ${r.lider} continua roubando os meus fiéis. O que eu faço?`,ch:[['Infiltrar um espião ('+fmt(8000)+')','esp'],['Fazer um culto gigante no mesmo dia que o deles ('+fmt(20000)+')','culto'],['Mandar dar um susto em '+r.lider,'susto'],['Propor uma fusão','fusao']]}; },
  pick:k=>{ const m=S.me, s=s3(seita()); if(!s||!s.rival) return ''; const r=s.rival; let t='';
    if(k==='esp'){ if(!s3Pago(s,8000)) return 'Não tenho dinheiro para pagar um espião.'; s3Agendar(s,1,'seita_espiao',{}); t='Um fiel de confiança vai frequentar o culto deles e me contar tudo.'; }
    else if(k==='culto'){ if(!s3Pago(s,20000)) return 'Não tenho dinheiro para um culto desse tamanho.'; const g=R.int(10,40)+Math.round(r.forca/2); s.fieis+=g; r.forca-=8; s.devo+=4; t=`Montei um palco com telão e banda. ${g} fiéis deles vieram para o meu lado.`; }
    else if(k==='susto'){ m.karma=clamp(m.karma-25); s.susp+=20; if(R.chance(.45+s.seg*.05)){ const n=r.n, l=r.lider; s.rival=null; s.fieis+=Math.round(s.fieis*.15)+R.int(10,60); s.inim++; s3Agendar(s,R.int(1,2),'seita_investigacao',{antigo:l,crime:'o atentado contra o líder de '+n}); t=`${l} foi parar no hospital e anunciou que vai "se dedicar à família". ${n} se desfez, e os fiéis vieram para mim.`; }
      else { s.inim+=2; r.forca+=15; s3Agendar(s,1,'seita_atentado',{met:R.pick(Object.keys(SEITA_MET)),atk:'rival'}); t=`O capanga foi pego e entregou meu nome. ${r.lider} jurou vingança em pleno culto.`; } }
    else { if(R.chance(.15+(s.fieis/((r.forca*30)+s.fieis+1))*.5)){ s.fieis+=Math.round(r.forca*R.int(5,15)); t=`${r.lider} aceitou a fusão. ${r.n} agora reza do meu jeito.`; s.rival=null; } else { r.forca+=3; t='A proposta foi recusada, e virou piada no culto deles.'; } }
    s3RivalFix(s); seitaFix(s); s3Estagio(); return t; }};
EVENTS.seita_espiao={when:m=>sLeader(m)&&!!m.seita.rival,show:()=>({k:'Religião',t:'Relatório do espião',x:`O meu espião voltou de ${seita().rival.n} com segredos: dinheiro sem nota, um caso extraconjugal do líder e dívidas.`,ch:[['Chantagear o líder rival','ch'],['Vazar para a imprensa','vz'],['Guardar como trunfo','gd']]}),
  pick:k=>{ const m=S.me, s=s3(seita()); if(!s||!s.rival) return ''; const r=s.rival;
    if(k==='ch'){ m.karma=clamp(m.karma-10); s.caixa+=R.int(20000,90000); r.forca-=20; s3RivalFix(s); seitaFix(s); return 'Ele pagou para eu ficar quieto, e ainda parou de falar mal de mim.'; }
    if(k==='vz'){ r.forca-=35; s.fama+=5; s3RivalFix(s); seitaFix(s); return 'O escândalo explodiu. Os fiéis deles fugiram aos montes.'; }
    s.trunfo=1; return 'Guardei tudo num pendrive escondido. Um dia vai servir.'; }};
EVENTS.seita_investigacao={when:sLeader,show:d=>({k:'Justiça',t:'Investigação reaberta',x:`A polícia reabriu o inquérito sobre ${d.crime||'a morte de '+d.antigo}. Um ex-fiel prestou depoimento e citou o meu nome.`,ch:[['Contratar os melhores advogados ('+fmt(80000)+')','adv'],['Culpar um cúmplice','culpa'],['Confessar','conf']]}),
  pick:(k,d)=>{ const m=S.me, s=s3(seita()); if(!s) return '';
    if(k==='adv'){ if(s3Pago(s,80000)&&R.chance(.7)){ s.susp-=10; seitaFix(s); return 'Os advogados acharam falhas no inquérito. Arquivado.'; } arrest('homicídio qualificado',8,20); seitaFix(s); return 'Nem os advogados deram conta. Fui a julgamento.'; }
    if(k==='culpa'){ m.karma=clamp(m.karma-15); if(R.chance(.55)){ s.devo-=5; seitaFix(s); return 'O cúmplice foi preso no meu lugar. Os fiéis cochicham.'; } arrest('homicídio qualificado',8,20); return 'O cúmplice tinha gravações. Quem foi a julgamento fui eu.'; }
    m.karma=clamp(m.karma+15); arrest('homicídio',6,16); return 'Confessei tudo. Os fiéis não acreditaram, até ouvirem da minha boca.'; }};

// ---------- entrar num grupo: escolher entre grupos reais ou procurar um secreto na deep web ----------
function seitaOfertas(){ const m=S.me; if(!m.yr.sOf){ const l=[], tipos=Object.keys(SEITA_TIPOS);
    for(let i=0;i<3;i++) l.push({n:R.pick(SEITA_NOMES.filter(n=>!l.some(x=>x.n===n))),tipo:R.pick(tipos),lider:R.pick(SEITA_LIDERES),fieis:[R.int(40,300),R.int(300,3000),R.int(3000,30000)][i],susp:R.int(5,45)});
    m.yr.sOf=l; } return m.yr.sOf; }
function seitaEntrarEm(i){ const m=S.me; if(m.seita) return 'Já faço parte de um grupo.';
  const of=i==='dw'?{n:R.pick(SEITA_NOMES),tipo:'apoc',lider:R.pick(SEITA_LIDERES),fieis:R.int(25,250),susp:R.int(40,70),secreta:1}:seitaOfertas()[i]; if(!of) return '';
  m.seita={n:of.n,tipo:of.tipo,membro:1,cargo:0,xp:0,lider:of.lider,fieis:of.fieis,devo:R.int(60,90),caixa:Math.round(of.fieis*R.int(80,400)),susp:of.susp,fama:Math.min(90,Math.round(10+of.fieis/400)),anos:0,templo:Math.max(0,Math.round(Math.log10(of.fieis)-1)),regras:{},dom:[],fe:R.int(50,70),secreta:of.secreta||0,conf:of.secreta?40:30,agenda:[]};
  const s=m.seita; m.c.seita=1; log(`Entrei para ${s.n}${s.secreta?', um grupo secreto que conheci na deep web,':''} liderad${s3LiderA(s.lider)} por ${s.lider}.`,'warn');
  if(s.secreta){ queue('seita_iniciacao',{}); return `Depois de semanas lendo fóruns, recebi um convite criptografado. ${s.lider} quer me ver à meia-noite, para a iniciação.`; }
  return `Entrei para ${s.n}. ${s.lider} me recebeu com um abraço longo demais e um formulário de dízimo.`; }
seitaEntrar=(o=>function(){ const r=o.apply(this,arguments); const s=seita(); if(s&&s.membro) s3(s); return r; })(seitaEntrar);
EVENTS.seita_iniciacao={when:m=>!!m.seita&&!!m.seita.membro,show:()=>({k:'Religião',t:'A iniciação',x:`À meia-noite, num túnel abandonado, ${seita().lider} me espera com velas e uma faca cerimonial. Para entrar de verdade, preciso provar lealdade.`,ch:[['Cortar a palma da mão e jurar com sangue','sangue'],['Entregar o celular e os documentos','docs'],['Passar a noite sozinh'+oa()+' num cemitério','cemit'],['Desistir e ir embora','des']]}),
  pick:k=>{ const m=S.me, s=s3(seita()); if(!s) return '';
    if(k==='sangue'){ st('health',-3); s.fe=clamp(s.fe+15); s.conf=clamp(s.conf+15); s.xp+=3; return 'Doeu. Mas, quando a minha mão tocou a do líder, todos gritaram meu novo nome.'; }
    if(k==='docs'){ s.conf=clamp(s.conf+25); s.xp+=2; s.prova=0; return 'Me devolveram tudo no mês seguinte. Agora eles sabem tudo sobre mim.'; }
    if(k==='cemit'){ if(R.chance(.6)){ s.fe=clamp(s.fe+20); s.xp+=4; return 'Ouvi vozes a noite toda. De manhã, eu era outra pessoa.'; } st('happy',-6); s.conf=clamp(s.conf-5); return 'Saí correndo às três da manhã. Riram de mim, mas me aceitaram.'; }
    const n=s.n; m.seita=null; if(R.chance(.35)) return `Fui embora. No dia seguinte, havia um símbolo de ${n} pintado na minha porta.`; return 'Fui embora sem olhar para trás.'; }};

// ---------- membro: atentado contra o líder, sucessão e complôs ----------
EVENTS.seita_atentado_lider={when:m=>!!m.seita&&!!m.seita.membro&&!m.prison,
  show:d=>{ const s=s3(seita()), l=s.lider, arma={faca:'uma faca',tiro:'um revólver',veneno:'um frasco de ácido'}[d.met]||'uma faca';
    const ch=[[`Me jogar na frente de ${l}`,'escudo'],['Derrubar o agressor','derruba'],[`Puxar ${l} para trás do altar`,'puxa'],['Não fazer nada','nada']]; if(s.cargo>=3) ch.push(['Deixar acontecer, e até ajudar','trai']);
    return {k:'Perigo',t:'Atentado contra '+l,x:`Durante o culto, um homem avança contra ${l} com ${arma}. Estou a três passos do altar.`,ch}; },
  pick:(k,d)=>{ const m=S.me, s=s3(seita()); if(!s||!s.membro) return ''; const l=s.lider; let t='';
    const morre=()=>{ queue('seita_sucessao_membro',{antigo:l,traiu:k==='trai'?1:0}); log(`${l}, líder de ${s.n}, morreu num atentado.`,'bad'); };
    switch(k){
      case 'escudo': { const x=R.f(); if(x<.07){ die(`assassinad${oa()} ao proteger ${l} num atentado`); return 'Me joguei sem pensar.'; }
        if(x<.55){ st('health',-R.int(15,35)); t='Levei o golpe no lugar dele.'; } else t='Me joguei na frente e o golpe passou de raspão.';
        s.conf=clamp(s.conf+35); s.xp+=15; s.fe=clamp(s.fe+10); s.fama+=3; m.fame=clamp(m.fame+3);
        if(s.cargo<SEITA_CARGOS.length-1){ s.cargo++; s.xp=0; t+=` Ainda no hospital, ${l} me nomeou ${sCargo(s).toLowerCase()}.`; } else t+=` ${l} diz que me deve a vida.`; break; }
      case 'derruba': if(R.chance(.35+(m.talent.athletic||30)/200)){ s.conf=clamp(s.conf+25); s.xp+=10; t='Derrubei o homem com um carrinho digno de zagueiro. O templo inteiro aplaudiu.'; } else { st('health',-R.int(10,25)); s.conf=clamp(s.conf+10); t=`Tentei, levei uma cotovelada e ${l} saiu ferid${s3LiderA(l)}. Pelo menos tentei.`; } break;
      case 'puxa': s.conf=clamp(s.conf+15); s.xp+=6; t=`Puxei ${l} para trás do altar. Os seguranças fizeram o resto.`; break;
      case 'nada': if(R.chance(.3)){ morre(); t=`Fiquei congelad${oa()}. ${l} caiu na frente de todos.`; } else { s.conf=clamp(s.conf-10); t=`Os seguranças resolveram. Depois, ${l} perguntou por que eu fiquei parad${oa()}.`; } break;
      case 'trai': m.karma=clamp(m.karma-25); if(R.chance(.55)){ morre(); t=`Segurei a porta "sem querer" para o agressor. ${l} não resistiu.`; } else if(R.chance(.4)){ s.cargo=0; s.xp=0; s.conf=0; s.suspeito=1; s3Agendar(s,1,'seita_atentado',{met:R.pick(Object.keys(SEITA_MET)),atk:'lider'}); t='O agressor foi preso e disse que alguém de dentro ajudou. Todos os olhos se viraram para mim.'; } else t=`${l} sobreviveu. Ninguém percebeu o que eu fiz. Ainda.`; break; }
    seitaFix(s); return t; }};
EVENTS.seita_sucessao_membro={when:m=>!!m.seita&&!!m.seita.membro,
  show:d=>{ const s=seita(); return {k:'Religião',t:'Quem vai liderar?',x:`${d.antigo} morreu. O templo está de luto, e os cargos mais altos já se olham de lado. Quem vai liderar ${s.n}?`,ch:[['Reivindicar a liderança','rei'],['Apoiar o candidato mais forte','apoia'],['Sair do grupo no meio do caos','sai']]}; },
  pick:(k,d)=>{ const m=S.me, s=s3(seita()); if(!s||!s.membro) return '';
    if(k==='rei'){ if(R.chance(.15+s.cargo*.12+s.fe/400+s.conf/300+(d.traiu?.1:0))){ s3Assumir(s,`Assumi a liderança de ${s.n} depois da morte de ${d.antigo}.`); if(d.traiu&&R.chance(.6)) s3Agendar(s,R.int(1,2),'seita_investigacao',{antigo:d.antigo}); return `A assembleia votou, e o meu nome venceu. Agora ${s.n} é meu.`; }
      s.lider=s3Novo(d.antigo); s.cargo=Math.max(0,s.cargo-2); s.xp=0; s.conf=10; s.suspeito=1; return `${s.lider} venceu a votação. E não esquece quem disputou com ${s3LiderA(s.lider)==='a'?'ela':'ele'}.`; }
    if(k==='apoia'){ s.lider=s3Novo(d.antigo); if(s.cargo<SEITA_CARGOS.length-1) s.cargo++; s.conf=60; return `Apoiei ${s.lider}, que venceu e me recompensou com o cargo de ${sCargo(s).toLowerCase()}.`; }
    const n=s.n; m.seita=null; return `Saí de ${n} enquanto todos brigavam pelo trono.`; }};
const SEITA_COMPLO={expor:['Juntar provas e expor os crimes de {l}',.3],veneno:['Envenenar aos poucos o chá de {l}',.45],matador:['Contratar um matador ('+fmt(60000)+')',.55],assembleia:['Virar os pastores contra {l} na assembleia',.2]};
const SEITA_CUMPL={tesoureiro:['O tesoureiro, que sabe onde está o dinheiro',.3,.1],seguranca:['A chefe da segurança, que tem as chaves de tudo',.2,.15],fanatico:['Um fiel que me idolatra',.1,.1],sozinho:['Ninguém: faço tudo sozinh{o}',0,-.1]};
EVENTS.seita_complo={when:m=>!!m.seita&&!!m.seita.membro&&!m.prison,
  show:d=>{ const s=seita(), l=s.lider;
    if(d.e===1) return {k:'Complô',t:'Um cúmplice',x:'Não dá para fazer isso sem ajuda. Ou dá? Quem eu chamo?',ch:Object.entries(SEITA_CUMPL).map(([k,c])=>[sGen(c[0]),k])};
    if(d.e===2) return {k:'Complô',t:'Chegou a hora',x:`Está tudo pronto. Amanhã, ${l} vai descobrir o preço de me subestimar.`,ch:[['Seguir com o plano','vai'],['Desistir na última hora','desiste']]};
    return {k:'Complô',t:'Derrubar '+l,x:`Sou ${sCargo(s).toLowerCase()} de ${s.n}${s.prova?' e tenho uma gravação comprometedora':''}. Como derrubar ${l}?`,ch:Object.entries(SEITA_COMPLO).map(([k,c])=>[c[0].replace('{l}',l),k])}; },
  pick:(k,d)=>{ const m=S.me, s=s3(seita()); if(!s||!s.membro) return '';
    if(!d.e){ if(k==='matador'&&m.money<60000) return `Um matador cobra ${fmt(60000)}, e eu não tenho.`; queue('seita_complo',{e:1,met:k}); return ''; }
    if(d.e===1){ queue('seita_complo',{e:2,met:d.met,cum:k}); return k==='sozinho'?'Ninguém vai saber. Nem que eu queira contar.':'Ele topou. Pelo menos foi o que disse.'; }
    return s3ComploFim(k,d); }};
function s3ComploFim(k,d){ const m=S.me, s=seita(), l=s.lider, C=SEITA_CUMPL[d.cum];
  if(k==='desiste'){ if(d.cum!=='sozinho'&&R.chance(.3)){ s.suspeito=1; s.conf=clamp(s.conf-30); return `Desisti. Mas o cúmplice contou tudo para ${l}, e agora sou vigiad${oa()} dia e noite.`; } return 'Desisti. Queimei os papéis e voltei para o culto como se nada fosse.'; }
  if(R.chance(C[1])){ s.suspeito=1; s.cargo=Math.max(0,s.cargo-2); s.xp=0; s.conf=0; m.karma=clamp(m.karma-10);
    if(R.chance(.5)) queue('seita_atentado',{met:R.pick(Object.keys(SEITA_MET)),atk:'lider'});
    return `O cúmplice me entregou. ${l} me rebaixou na frente de todos e me olhou de um jeito que eu nunca vou esquecer.`; }
  if(d.met==='matador') m.money-=60000;
  const p=SEITA_COMPLO[d.met][1]+C[2]+m.smarts/400+(d.met==='expor'&&s.prova?.35:0)+(d.met==='assembleia'?s.cargo*.06+s.conf/400:0);
  if(R.chance(p)){
    if(d.met==='expor'){ m.karma=clamp(m.karma+10); s3Assumir(s,`Expus os crimes de ${l}, que foi pres${s3LiderA(l)}. Assumi ${s.n}.`); return `As provas foram parar na polícia e no jornal. ${l} foi pres${s3LiderA(l)}, e os fiéis me pediram para assumir.`; }
    if(d.met==='assembleia'){ s3Assumir(s,`Derrubei ${l} numa assembleia e assumi ${s.n}.`); return `Na assembleia, um por um, os pastores levantaram a mão contra ${l}. O trono agora é meu.`; }
    m.karma=clamp(m.karma-30); s3Assumir(s,`${l} morreu de repente, e eu assumi a liderança de ${s.n}.`); if(R.chance(.6)) s3Agendar(s,R.int(1,2),'seita_investigacao',{antigo:l});
    return d.met==='veneno'?`${l} foi definhando por semanas. Os médicos falaram em "causas naturais". No enterro, fui eu quem fez o discurso.`:`${l} sofreu um "assalto" numa rua escura. No enterro, fui eu quem fez o discurso.`; }
  if(d.met==='matador'&&R.chance(.4)){ const n=s.n; arrest('mandante de tentativa de homicídio',4,12); m.seita=null; return `O matador errou, foi preso e entregou meu nome. ${n} me renegou.`; }
  if(d.met==='veneno'){ s.suspeito=1; s.conf=0; if(R.chance(.4)){ const n=s.n; m.seita=null; return `${l} desconfiou do gosto do chá. Fui expuls${oa()} de ${n} no mesmo dia.`; } return `${l} passou mal, mas sobreviveu, e agora prova cada copo antes de beber. E me observa.`; }
  if(d.met==='assembleia'){ s.cargo=0; s.xp=0; s.conf=5; return `Na hora da votação, os pastores me abandonaram. Fui rebaixad${oa()} a fiel.`; }
  s.suspeito=1; s.conf=clamp(s.conf-30); return 'Ninguém acreditou nas provas. Agora sou "o invejoso".'; }

// ---------- ano a ano ----------
seitaAno=(o=>function(){ const r=o.apply(this,arguments); const m=S.me, s=seita(); if(!s||!m.alive||S.scen) return r; s3(s);
  const ag=s.agenda.filter(a=>S.year>=a.a); s.agenda=s.agenda.filter(a=>S.year<a.a); ag.forEach(a=>queue(a.id,a.d));
  if(s.membro){ s.conf=clamp(s.conf+R.int(-4,3)+(s.cargo>=3?1:0));
    if(!m.prison&&R.chance(.05+(s.cargo>=3?.04:0)+(s.fieis>=2000?.02:0))) queue('seita_atentado_lider',{met:R.pick(['faca','tiro','veneno'])});
    if(!m.prison&&(s.prova||s.suspeito)&&R.chance(s.suspeito?.2:.06)) queue('seita_atentado',{met:R.pick(Object.keys(SEITA_MET)),atk:'lider'});
    return r; }
  const conv=Math.round(s.online*(.04+(s.cripto?.04:0)+(s3Tem(s,'digital')?.05:0))); s.fieis+=conv;
  s.online=Math.max(0,Math.round(s.online*.88)-conv+(s3Tem(s,'digital')?R.int(5,30)+Math.round(s.fieis*.02):0));
  if(s3Tem(s,'sigilo')){ s.susp-=3; s.fieis-=Math.round(s.fieis*.02); }
  if(s3Tem(s,'dizimo')){ s.caixa+=Math.round(s.fieis*R.int(10,35)); s.devo-=2; }
  if(s3Tem(s,'profeta')){ s.fama+=2; s.devo+=2; m.fame=clamp(m.fame+1); }
  if(s3Tem(s,'isolamento')){ s.devo+=3; s.susp+=3; }
  if(s3Tem(s,'obras')){ s.susp-=3; s.caixa=Math.round(s.caixa*.9); m.karma=clamp(m.karma+2); }
  if(s3Tem(s,'martirio')) s.devo+=1;
  const up=SEITA_SEG[s.seg][2]; if(up&&!s3Pago(s,up)){ s.seg--; log('Sem dinheiro para pagar a segurança, parte da equipe foi embora.','warn'); }
  if(s.rival){ s.rival.forca+=R.int(-3,6); if(s.rival.forca>40) s.fieis-=Math.round(s.fieis*s.rival.forca/2500); s3RivalFix(s); }
  else if(s.fieis>=200&&R.chance(.18)){ s.rival={n:R.pick(SEITA_NOMES.filter(x=>x!==s.n)),lider:R.pick(SEITA_LIDERES),forca:R.int(20,60)}; queue('seita_rival_surge',{}); }
  seitaFix(s); if(!m.prison&&R.chance(s3RiscoAtentado(s))) s3Atentar(s);
  s3Estagio(); return r; })(seitaAno);

// ---------- ações novas ----------
function seita3Acao(k){ const m=S.me, s=s3(seita()); if(!s) return '';
  switch(k){
    case 'forum': if(use('s3_forum')>3) return 'Já postei demais este ano. Os moderadores estão de olho.'; queue('seita_forum',{e:0,op:R.shuffle(SEITA_FORUNS).slice(0,3).map(f=>f.id)}); return '';
    case 'encontro': if(s.online<3) return 'Ainda não tenho seguidores online suficientes para um encontro.'; if(use('s3_enc')>2) return 'Já fiz encontros demais este ano. Está ficando arriscado.'; queue('seita_encontro',{}); return '';
    case 'canal': if(s.cripto) return 'O canal já existe.'; if(!s3Pago(s,3000)) return `Montar um canal criptografado custa ${fmt(3000)}.`; s.cripto=1; s.online+=R.int(3,12); return 'Montei um canal criptografado só para os seguidores. Rastrear a gente ficou bem mais difícil, e mais gente se sente segura para aparecer.';
    case 'sermao': if(use('s3_serm')>2) return 'Já fiz sermões demais este ano. A garganta não aguenta.'; queue('seita_sermao',{r:0,pts:0,hum:R.pick(Object.keys(SEITA_HUMOR))}); return '';
    case 'seg': { if(s.seg>=3) return 'Já tenho a maior segurança possível.'; const nx=SEITA_SEG[s.seg+1]; if(!s3Pago(s,nx[1])) return `${nx[0]} custa ${fmt(nx[1])}, mais ${fmt(nx[2])} por ano.`; s.seg++; if(s.seg===3) s.susp+=10; seitaFix(s);
      return [,'Contratei dois seguranças particulares. Andam a um passo de mim o tempo todo.','Agora ando de carro blindado, com escolta armada na frente e atrás.','Montei a guarda própria do grupo: fiéis treinados, armados e leais. A polícia anotou.'][s.seg]; }
    case 'info': if(s.info) return 'Já tenho uma rede de informantes.'; if(!s3Pago(s,20000)) return `Uma rede de informantes custa ${fmt(20000)}.`; s.info=1; return 'Paguei porteiros, garçons e fiéis espalhados pela cidade para me contarem tudo o que ouvirem sobre mim.';
    case 'rival': if(!s.rival) return 'Não tenho rival.'; if(use('s3_riv')>1) return 'Uma investida contra o rival por ano.'; queue('seita_rival_acao',{}); return '';
    case 'pregar': if(!s.membro) return ''; if(s.cargo<2) return 'Só diáconos para cima pregam no culto.'; if(use('s3_preg')>2) return 'Já preguei demais este ano.'; queue('seita_sermao',{r:0,pts:0,hum:R.pick(Object.keys(SEITA_HUMOR))}); return '';
    case 'conspirar': if(!s.membro) return ''; if(s.cargo<3) return `Ninguém leva a sério um complô de quem ainda é ${sCargo(s).toLowerCase()}.`; if(use('s3_comp')>1) return 'Um complô por ano. Já é arriscado demais.'; queue('seita_complo',{e:0}); return ''; }
  return ''; }

// ---------- telas ----------
V.seita=(o=>()=>{ const r=o(); const m=S.me, s=seita(); if(!r||!r.items) return r;
  const A=(arr,k,ic,l,sub,tone)=>arr.push({ic,l,s:sub,tone,on:()=>act(()=>seita3Acao(k),l)});
  if(!s){ const i=r.items.findIndex(x=>x.l==='Entrar numa igreja ou seita'); if(i<0) return r;
    const add=seitaOfertas().map((of,k)=>({ic:SEITA_TIPOS[of.tipo][1],l:of.n,s:`${SEITA_TIPOS[of.tipo][0]} · ${of.lider} · ${of.fieis.toLocaleString('pt-BR')} fiéis${of.susp>35?' · fama duvidosa':''}`,on:()=>act(()=>seitaEntrarEm(k),'Religião')}));
    add.push({ic:'🕸️',l:'Procurar um grupo secreto na deep web',s:'Sobe mais rápido, e é bem mais perigoso',tone:'bad',on:()=>act(()=>seitaEntrarEm('dw'),'Religião')});
    r.items.splice(i,1,...add); return r; }
  s3(s);
  if(s.membro){ r.items.splice(1,0,{html:`<div class="card">${bar('Confiança do líder',clamp(s.conf))}${s.secreta?'<p style="color:var(--muted);font-size:13px">Grupo secreto: o que acontece aqui não sai daqui.</p>':''}${s.suspeito?`<p style="color:#E5484D"><b>${esc(s.lider)} desconfia de mim.</b> Posso sofrer um atentado a qualquer momento.</p>`:''}</div>`});
    const add=[{sec:'Púlpito e poder'}];
    A(add,'pregar','🎤','Pregar no culto',s.cargo>=2?'Minigame · sermão em 3 partes':'A partir de diácono');
    if(s.cargo>=3) A(add,'conspirar','🗡️',`Conspirar contra ${s.lider}`,'Expor, envenenar, contratar alguém ou virar a assembleia','bad');
    const i=r.items.findIndex(x=>x.sec==='Sair'); r.items.splice(i>=0?i:r.items.length,0,...add); return r; }
  const e=seitaEstagio(s), E=SEITA_ESTAGIOS[e], nx=SEITA_ESTAGIOS[e+1];
  const card={html:`<div class="card"><p><b>${E[2]} Estágio: ${esc(E[1])}</b></p><p style="color:var(--muted);font-size:13px">${esc(E[3])}</p>${nx?bar(`Rumo a ${nx[1]} (${nx[0].toLocaleString('pt-BR')} fiéis)`,clamp(Math.round(100*(s.fieis-E[0])/(nx[0]-E[0])))):''}${kv('Seguidores online',s.online.toLocaleString('pt-BR'))}${kv('Segurança',SEITA_SEG[s.seg][0])}${kv('Inimigos conhecidos',String(s.inim))}${s.atent?kv('Atentados sofridos',String(s.atent)):''}${s.dout.length?kv('Doutrinas',s.dout.map(d=>SEITA_DOUTRINAS[d][0]+' '+SEITA_DOUTRINAS[d][1]).join(', ')):''}${s.rival?kv('Rival',`${s.rival.n} · força ${s.rival.forca}`):''}</div>`};
  r.items.splice(1,0,card);
  const div=[{sec:'Divulgação'}];
  A(div,'forum','💻','Divulgar num fórum da deep web','Minigame · seguidores online');
  A(div,'encontro','🕯️','Marcar um encontro secreto',s.online>=3?`Transforma seguidores online em fiéis · ${s.online.toLocaleString('pt-BR')} online`:'Precisa de pelo menos 3 seguidores online');
  if(!s.cripto) A(div,'canal','🔐','Criar um canal criptografado',`${fmt(3000)} · converte mais e protege dos curiosos`);
  const iL=r.items.findIndex(x=>x.sec==='Manter a fé'||x.sec==='Liderar'); r.items.splice(iL>=0?iL:2,0,...div);
  const iF=r.items.findIndex(x=>x.sec==='Manter a fé'); const serm=[]; A(serm,'sermao','🎙️','Fazer um sermão ao vivo','Minigame · leia a plateia e escolha o tom'); r.items.splice(iF>=0?iF+1:r.items.length,0,...serm);
  const seg=[{sec:'Segurança e inimigos'}];
  if(s.seg<3){ const n=SEITA_SEG[s.seg+1]; A(seg,'seg','🛡️',n[0],`${fmt(n[1])} · ${fmt(n[2])} por ano · menos risco de atentado`); }
  if(!s.info) A(seg,'info','👂','Montar uma rede de informantes',`${fmt(20000)} · avisos antes dos atentados`);
  seg.push({html:`<div class="card"><p style="font-size:13px">Risco de atentado este ano: <b>${Math.round(s3RiscoAtentado(s)*100)}%</b></p></div>`});
  if(s.rival) A(seg,'rival','⚔️','Agir contra '+s.rival.n,'Espionar, roubar fiéis, intimidar ou propor fusão','bad');
  const iD=r.items.findIndex(x=>x.sec==='Do lado escuro'); r.items.splice(iD>=0?iD:r.items.length,0,...seg);
  return r; })(V.seita);

// ---------- tokens para os eventos ----------
extTok=(o=>function(tok,d,out){ const s=S.me&&S.me.seita; let mm;
  if(mm=tok.match(/^(online|seg|inim|rival|conf)([+-]\d+)$/)){ if(s){ s3(s); const v=+mm[2];
      if(mm[1]==='online'&&!s.membro) s.online=Math.max(0,s.online+v);
      if(mm[1]==='seg'&&!s.membro) s.seg=Math.max(0,Math.min(3,s.seg+v));
      if(mm[1]==='inim'&&!s.membro) s.inim=Math.max(0,s.inim+v);
      if(mm[1]==='rival'&&s.rival){ s.rival.forca+=v; s3RivalFix(s); }
      if(mm[1]==='conf'&&s.membro) s.conf=clamp(s.conf+v); } return true; }
  if(tok==='sprova'){ if(s&&s.membro){ s.prova=1; out.push('Agora tenho uma prova contra o líder.'); } return true; }
  if(tok==='sconsp'){ if(s&&s.membro) queue('seita_complo',{e:0}); return true; }
  return o(tok,d,out); })(extTok);
extVar=(o=>k=>{ const s=S.me&&S.me.seita; if(k==='rival') return s&&s.rival?s.rival.n:'o grupo rival'; return o(k); })(extVar);

function seita3SelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,erros=[];window.NO_SAVE=true;window.NO_NEWS=true;
  const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=7331; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; };
  const roda=(id,d)=>{ const sh=EVENTS[id].show(d); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v)); return sh; };
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=roda(id,JSON.parse(JSON.stringify(d))); sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap);
      try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); ok(Number.isFinite(S.me.money),id+'#'+k+' dinheiro'); const s=S.me.seita; if(s) ok(Number.isFinite(s.fieis)&&Number.isFinite(s.caixa)&&s.caixa>=0,id+'#'+k+' seita inválida'); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); };
  try{
    newLife({country:'BR'}); const m=S.me; m.age=30; m.born=S.year-30; m.money=500000; m.prison=null;
    seitaFundar('apoc','Teste'); let s=seita(); ok(s.fieis===0&&seitaEstagio(s)===0,'seita não começa no fórum');
    seitaAno(); ok(!!seita(),'seita acabou no primeiro ano, ainda no fórum');
    S.pending=[]; seita3Acao('forum'); ok(S.pending[0]&&S.pending[0].id==='seita_forum','fórum não abriu');
    const d0=S.pending[0].d; todas('seita_forum',d0); S.pending=[]; EVENTS.seita_forum.pick(d0.op[0],d0); ok(S.pending[0]&&S.pending[0].d.e===1,'fórum sem segunda etapa');
    const d1=S.pending[0].d; todas('seita_forum',d1); S.pending=[]; const f=SEITA_FORUNS.find(q=>q.id===d1.f), on0=seita().online; EVENTS.seita_forum.pick(f.quer,d1); ok(seita().online>on0,'post no tom certo não trouxe seguidores');
    todas('seita_dm',{nick:'anon7'});
    seita().online=80; todas('seita_encontro',{}); S.pending=[]; EVENTS.seita_encontro.pick('galpao'); ok(seita().fieis>0,'encontro não converteu ninguém');
    for(const tipo of ['fiel','policia','jornalista','louco']){ seita().dm={nick:'anon7',tipo}; todas('seita_dm_revela',{}); }
    todas('seita_materia',{});
    seita().fieis=40; seita().estMax=0; S.pending=[]; s3Estagio(); const pe=S.pending.find(e=>e.id==='seita_estagio'); ok(pe&&pe.d.e===2,'novo estágio sem evento');
    if(pe){ const sh=roda('seita_estagio',pe.d); EVENTS.seita_estagio.pick(sh.ch[0][1],pe.d); ok(seita().dout.length===1,'doutrina não aplicada'); }
    seita().devo=40; let d={r:0,pts:0,hum:'medo'}; for(let i=0;i<3;i++){ S.pending=[]; EVENTS.seita_sermao.pick(d.hum,d); if(i<2) d=S.pending[0].d; } ok(seita().devo>55,'sermão perfeito não subiu a fé');
    todas('seita_sermao',{r:0,pts:0,hum:'duvida'}); todas('seita_sermao',{r:2,pts:6,hum:'euforia'}); todas('seita_viral',{});
    s=seita(); Object.assign(s,{fieis:3000,fama:60,susp:50,caixa:2e6}); s.rival={n:'Templo Rival',lider:'Mãe Celestina',forca:50}; S.pending=[];
    for(const met of Object.keys(SEITA_MET)) for(const atk of Object.keys(SEITA_ATK).filter(a=>a!=='lider')) todas('seita_atentado',{met,atk});
    for(const atk of ['rival','politico','traidor','ex']){ todas('seita_atentado_depois',{atk,preso:1,ferido:0}); todas('seita_atentado_depois',{atk,preso:0,ferido:1}); todas('seita_mandante',{atk}); todas('seita_carta',{atk}); todas('seita_aviso',{met:'faca',atk}); }
    todas('seita_rival_surge',{}); todas('seita_rival_acao',{}); todas('seita_espiao',{}); todas('seita_investigacao',{antigo:'Profeta Josué'});
    const base=JSON.stringify(S), mortes=seg=>{ let n=0; for(let i=0;i<300;i++){ S=JSON.parse(base); seita().seg=seg; EVENTS.seita_atentado.pick('encarar',{met:'faca',atk:'ex'}); if(!S.me.alive) n++; } S=JSON.parse(base); return n; };
    const m0=mortes(0), m3=mortes(3); ok(m3<m0&&m0>0,`segurança não reduz mortes (${m0} sem, ${m3} com)`);
    const r0=s3RiscoAtentado(seita()); seita().seg=3; ok(s3RiscoAtentado(seita())<r0,'segurança não reduz o risco anual'); seita().seg=0;
    s3Agendar(seita(),0,'seita_viral',{}); S.pending=[]; seitaAno(); ok(S.pending.some(e=>e.id==='seita_viral'),'agenda não disparou');
    for(const k of ['canal','seg','info','sermao','encontro','forum','rival']){ S.pending=[]; const r=seita3Acao(k); ok(!BAD.test(String(r)),'ação '+k+': '+r); }
    const v=V.seita(); v.items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')),'tela do líder: '+it.l)); ok(v.items.some(it=>it.l==='Divulgar num fórum da deep web'),'tela sem divulgação');
    // membro
    newLife({country:'BR'}); S.me.age=30; S.me.money=200000; S.me.prison=null; const vf=V.seita(); ok(vf.items.some(it=>it.l==='Procurar um grupo secreto na deep web'),'tela sem grupos para entrar');
    seitaEntrarEm(0); s=seita(); ok(s&&s.membro&&s.conf!=null,'entrar não criou membro');
    s.cargo=5; s.fe=80; s.conf=80; todas('seita_atentado_lider',{met:'faca'}); todas('seita_sucessao_membro',{antigo:'Profeta Josué',traiu:1});
    R.f=()=>0.001; EVENTS.seita_sucessao_membro.pick('rei',{antigo:'X'}); ok(seita()&&!seita().membro,'reivindicar com tudo a favor não deu a liderança'); R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; };
    newLife({country:'BR'}); S.me.age=30; S.me.money=200000; S.me.prison=null; seitaEntrarEm(1); s=seita(); s.cargo=4; s.prova=1; s.conf=70;
    todas('seita_complo',{e:0}); for(const met of Object.keys(SEITA_COMPLO)){ todas('seita_complo',{e:1,met}); for(const cum of Object.keys(SEITA_CUMPL)) todas('seita_complo',{e:2,met,cum}); }
    todas('seita_atentado',{met:'veneno',atk:'lider'}); todas('seita_atentado_depois',{atk:'lider',preso:1,ferido:0}); todas('seita_sermao',{r:2,pts:9,hum:'medo'});
    const vm=V.seita(); ok(vm.items.some(it=>/^Conspirar contra/.test(it.l||'')),'membro alto sem complô');
    newLife({country:'BR'}); S.me.age=30; S.me.prison=null; seitaEntrarEm('dw'); ok(seita()&&seita().secreta,'grupo da deep web não é secreto'); todas('seita_iniciacao',{});
  }catch(e){ erros.push('erro: '+e.message); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; }
  if(erros.length) throw Error('Seita · '+erros.slice(0,8).join(' | ')); return {ok:true}; }
