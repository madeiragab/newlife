// ===== Modos fictícios (18+): apocalipse zumbi, ilha deserta, isekai, superpoderes e colônia em Marte =====
// Enquanto um cenário está ativo: sem emprego e sem contas; os eventos do ano são só do cenário; cada cenário tem status, ações e finais.
const CLASSES={guerreiro:{n:'Guerreir',ic:'🗡️',st:'fight',sk:['Golpe Duplo','Fúria Berserker','Lâmina do Trovão']},mago:{n:'Mag',ic:'🔮',st:'smarts',sk:['Bola de Fogo','Nevasca','Meteoro Arcano']},
  arqueiro:{n:'Arqueir',ic:'🏹',st:'athletic',sk:['Tiro Certeiro','Chuva de Flechas','Flecha Celestial']},clerigo:{n:'Clérig',ic:'✨',st:'karma',sk:['Cura Menor','Escudo Sagrado','Ressurreição']},
  ladino:{n:'Ladin',ic:'🗝️',st:'looks',sk:['Furtividade','Golpe nas Sombras','Roubo de Alma']}};
const clsName=c=>CLASSES[c].n+oa();
const POWERS=['voar','superforça','invisibilidade','telecinese','supervelocidade','controlar o gelo','controlar o fogo','ler mentes'];
const FANTASY=['Lyra','Borin','Sylas','Mirela','Thorne','Elandra','Kael','Brisa','Gorak','Fenna','Orin','Talia'];
const RACES=['elfa','anão','meio-orc','fada','humano','homem-gato','dríade','elfo'];
const rnd=(a,b)=>R.int(a,b);
const scS=(k,n,max=100)=>{ const s=S.scen; s[k]=Math.max(0,Math.min(max,(s[k]||0)+n)); };
function scenEnd(win,txt){ const m=S.me; log(txt,win?'good':'bad'); if(win){ cnt('scenWin'); st('happy',20); } S.scen=null; }

const SCEN={
  zumbi:{n:'Apocalipse zumbi',ic:'🧟',d:'Um vírus transforma as pessoas em zumbis. Junte suprimentos, defenda o abrigo e procure a cura. Se for mordid{o}, cuidado.',
    intro:'O noticiário mostrou gente atacando gente nas ruas. Em uma semana, o mundo acabou. Agora é sobreviver.',
    init:()=>({sup:45,def:20,grp:1,cure:0,inf:0}),
    label:sc=>sc.inf?'Mordid'+oa()+'!':'Sobrevivente',
    bars:sc=>[['Suprimentos',sc.sup],['Defesa do abrigo',sc.def],['Progresso da cura',sc.cure]],
    info:sc=>[['Pessoas no grupo',sc.grp]],
    acts:{
      saquear:{ic:'🛒',l:'Saquear um mercado',s:'Suprimentos · risco de mordida',fn:(sc,m)=>{ if(R.chance(.12)) return bite(); if(!R.chance(.7+m.fight/400)){ st('health',-rnd(8,15)); return 'Uma horda me cercou no corredor. Saí ferid'+oa()+' e de mãos vazias.'; } const v=rnd(12,28); scS('sup',v); return `Voltei com a mochila cheia: +${v} de suprimentos.`; }},
      reforcar:{ic:'🧱',l:'Reforçar o abrigo',s:'Mais defesa contra hordas',fn:sc=>{ const v=rnd(10,18); scS('def',v); scS('sup',-4); return `Pregamos tábuas e montamos barricadas: +${v} de defesa.`; }},
      sobrev:{ic:'🔦',l:'Procurar sobreviventes',s:'O grupo cresce · mais bocas para alimentar',fn:(sc,m)=>{ if(R.chance(.06)) return bite(); if(R.chance(.6)){ const p=mkPerson({rel:'amigo',age:rnd(16,60),bond:rnd(50,70)}); S.people.push(p); sc.grp++; return `Encontrei ${p.first} escondid${p.gender==='F'?'a':'o'} num ônibus. Agora faz parte do grupo.`; } return 'Só encontrei silêncio e zumbis.'; }},
      cacar:{ic:'🪓',l:'Caçar zumbis',s:'Usa a luta · deixa a área mais segura',fn:(sc,m)=>{ if(R.chance(.45+m.fight/150)){ m.fight=clamp(m.fight+3); scS('def',5); scS('sup',4); return 'Limpei o quarteirão. Menos zumbis por perto.'; } st('health',-rnd(10,18)); if(R.chance(.1)) return bite(); return 'Eram muitos. Fugi por pouco.'; }},
      cura:{ic:'🧪',l:'Pesquisar a cura no laboratório',s:'Precisa de inteligência 55%+',fn:(sc,m)=>{ if(m.smarts<55) return 'Não entendo nada do que está escrito nesses cadernos.'; if(R.chance(.1)) return bite(); const v=rnd(8,16)+Math.round(m.smarts/12); scS('cure',v); return sc.cure>=100?'CONSEGUI! A cura funciona!':`Avancei na pesquisa: +${v}%.`; }},
      descansar:{ic:'😴',l:'Descansar no abrigo',s:'Recupera saúde e ânimo',fn:()=>{ st('health',rnd(4,8)); st('happy',rnd(3,6)); return 'Dormi uma noite inteira. Raridade.'; }},
    },
    year:(sc,m)=>{
      sc.sup-=12+sc.grp*3; if(sc.sup<0){ sc.sup=0; st('health',-20); st('happy',-12); log('Acabou a comida. Passamos fome.','bad'); }
      if(R.chance(.45)){ const pw=rnd(20,90); if(sc.def>=pw){ sc.def=Math.max(0,sc.def-10); log('Uma horda bateu no portão, mas o abrigo aguentou.','warn'); }
        else { st('health',-rnd(15,30)); sc.def=Math.max(0,sc.def-25); const g=people('amigo')[0]; if(g&&sc.grp>1&&R.chance(.5)){ g.alive=false; g.cause='devorado por zumbis'; sc.grp--; log(`A horda invadiu o abrigo. Perdemos ${g.first}.`,'bad'); } else log('A horda invadiu o abrigo. Por pouco não morri.','bad'); if(R.chance(.2)) bite(); } }
      const fam=people('mae','pai','irmao','avo','conjuge','filho'); if(fam.length&&R.chance(.2)){ const p=R.pick(fam); p.alive=false; p.cause='virou zumbi'; log(`Soube que ${p.first} virou zumbi.`,'bad'); }
      if(sc.inf){ if(sc.cure>=100){ sc.inf=0; log('Tomei a cura a tempo. A mordida cicatrizou.','good'); } else return die(`transformad${oa()} em zumbi`); }
      if(sc.cure>=100){ m.fame=clamp(m.fame+25); return scenEnd(true,'A cura foi distribuída. O mundo começa a se reconstruir, e meu nome está em todos os jornais que voltaram a circular.'); }
      if(sc.yrs>=8) scenEnd(true,'O exército retomou as cidades. O apocalipse acabou. Sobrevivi.');
    }},
  ilha:{n:'Sobrevivência na ilha',ic:'🏝️',d:'Seu avião caiu no meio do oceano. Comida, água, abrigo, fogo e um sinal de resgate decidem se você volta para casa.',
    intro:'O avião caiu no mar. Nadei até uma praia deserta. Não tem ninguém. Só eu, a areia e o barulho das ondas.',
    init:()=>({comida:55,agua:50,abrigo:0,fogo:0,sos:0}),
    label:()=>'Náufrag'+oa(),
    bars:sc=>[['Comida',sc.comida],['Água',sc.agua],['Abrigo',sc.abrigo],['Sinal de resgate',sc.sos]],
    info:sc=>[['Fogueira',sc.fogo?'Acesa':'Apagada']],
    acts:{
      pescar:{ic:'🎣',l:'Pescar',s:'Comida · depende de atletismo',fn:(sc,m)=>{ if(R.chance(.05)){ st('health',-20); return 'Um tubarão apareceu. Saí da água com uma mordida na perna.'; } if(R.chance(.4+(m.talent.athletic||40)/200+(sc.faca?.15:0))){ const v=rnd(10,25); scS('comida',v); return `Peguei peixe: +${v} de comida.`; } return 'Os peixes riram de mim.'; }},
      frutas:{ic:'🥥',l:'Coletar frutas e cocos',fn:sc=>{ if(R.chance(.08)){ st('health',-10); return 'Comi uma fruta que não devia. Passei mal o dia inteiro.'; } const v=rnd(8,15); scS('comida',v); return `Juntei cocos e frutas: +${v} de comida.`; }},
      agua:{ic:'💧',l:'Buscar água doce',fn:sc=>{ const v=rnd(20,35); scS('agua',v); return `Achei uma nascente: +${v} de água.`; }},
      abrigo:{ic:'🛖',l:'Construir abrigo',fn:sc=>{ const v=rnd(15,25); scS('abrigo',v); return `Folhas de palmeira, galhos e paciência: +${v} de abrigo.`; }},
      fogo:{ic:'🔥',l:'Acender uma fogueira',s:'Precisa de jeito (inteligência)',fn:(sc,m)=>{ if(sc.fogo) return 'A fogueira já está acesa.'; if(R.chance(.45+m.smarts/200)){ sc.fogo=1; st('happy',8); return 'FOGO! Eu fiz fogo!'; } return 'Esfreguei gravetos por horas. Só ganhei bolhas.'; }},
      sos:{ic:'🆘',l:'Montar sinal de SOS',s:'Pedras e galhos na areia',fn:sc=>{ const v=rnd(10,20); scS('sos',v); return `Escrevi SOS gigante na areia: +${v} de sinal.`; }},
      explorar:{ic:'🧭',l:'Explorar a ilha',fn:(sc,m)=>{ const r=R.f();
        if(r<.15&&!sc.faca){ sc.faca=1; return 'Achei uma mala do avião com uma faca dentro. Pescar vai ficar mais fácil.'; }
        if(r<.28){ scS('sos',30); return 'Achei um rádio quebrado nos destroços. Consegui fazer funcionar por alguns minutos: +30 de sinal.'; }
        if(r<.4){ scS('abrigo',30); return 'Encontrei uma caverna seca. Abrigo garantido.'; }
        if(r<.5){ const p=mkPerson({rel:'amigo',age:rnd(20,60),bond:65}); S.people.push(p); return `Encontrei outr${p.gender==='F'?'a':'o'} sobrevivente: ${p.first}! Não estou mais sozinh${oa()}.`; }
        if(r<.62){ st('health',-15); return 'Pisei numa cobra. A perna inchou por dias.'; }
        return 'Andei o dia inteiro. Só areia, mato e caranguejo.'; }},
    },
    year:(sc,m)=>{
      sc.comida-=45; sc.agua-=55; sc.abrigo=Math.max(0,sc.abrigo-15); if(R.chance(.5)) sc.fogo=0;
      if(sc.comida<=0){ sc.comida=0; st('health',-25); log('Passei fome de verdade este ano.','bad'); }
      if(sc.agua<=0){ sc.agua=0; st('health',-30); log('A sede quase me matou.','bad'); }
      if(sc.abrigo<20){ st('health',-8); log('Sem abrigo decente, cada chuva era um castigo.','warn'); }
      if(m.health<=0) return die('sozinh'+oa()+' numa ilha deserta');
      if(R.chance(sc.sos/220+(sc.fogo?.08:0)+sc.yrs*.02)||sc.yrs>=10){ m.fame=clamp(m.fame+15); m.money+=50000; scenEnd(true,'Um navio viu meu sinal! Fui resgatad'+oa()+'. Uma editora pagou $50.000 pela minha história.'); }
    }},
  isekai:{n:'Isekai',ic:'⚔️',d:'Um caminhão desgovernado e... você acorda em Eldoria, um mundo de fantasia. Escolha uma classe, suba de nível, monte um grupo e derrote o Rei Demônio.',
    intro:'Um caminhão desgovernado. Uma luz branca. Quando abri os olhos, estava num campo com dois sóis no céu. Uma janela flutuante apareceu: "Bem-vind{o} a Eldoria".',
    init:()=>({lvl:1,xp:0,ouro:50,cls:null,dg:1,party:0,sk:0}),
    label:sc=>sc.hero?`Herói de Eldoria`:sc.cls?`${clsName(sc.cls)} nível ${sc.lvl}`:'Recém-chegad'+oa()+' a Eldoria',
    bars:sc=>[['Experiência',Math.round(sc.xp/(sc.lvl*100)*100)]],
    info:sc=>[['Classe',sc.cls?CLASSES[sc.cls].ic+' '+clsName(sc.cls):'Ainda não escolhi'],['Nível',sc.lvl],['Ouro',sc.ouro+' moedas'],['Andar da masmorra',sc.dg],['Grupo',sc.party+' companheiro(s)']],
    acts:{
      slimes:{ic:'🟢',l:'Caçar slimes',s:'Experiência fácil',fn:sc=>{ const x=rnd(10,25); sc.xp+=x; sc.ouro+=rnd(5,20); return `Derrotei slimes gelatinosos: +${x} XP.`+lvlUp(); }},
      masmorra:{ic:'🏰',l:'Explorar a masmorra',s:'Muito XP e ouro · perigoso',fn:(sc,m)=>{ const pw=sc.lvl*5+(sc.cls?(CLASSES[sc.cls].st==='karma'?m.karma:CLASSES[sc.cls].st==='looks'?m.looks:CLASSES[sc.cls].st==='athletic'?m.talent.athletic:m[CLASSES[sc.cls].st])/4:0)+sc.party*4;
        if(R.chance(clamp(.45+(pw-sc.dg*9)/100,.1,.92))){ const x=rnd(40,80)+sc.dg*5,o=rnd(30,120); sc.xp+=x; sc.ouro+=o; sc.dg++; return `Limpei o ${sc.dg-1}º andar da masmorra: +${x} XP e ${o} moedas.`+lvlUp(); }
        st('health',-rnd(10,25)); return 'Um minotauro me expulsou da masmorra.'; }},
      guilda:{ic:'📜',l:'Missão da guilda',s:'Ouro garantido',fn:sc=>{ const o=rnd(40,100); sc.ouro+=o; sc.xp+=15; return `${R.pick(['Escoltei uma caravana','Cacei lobos gigantes','Entreguei uma poção urgente'])}: ${o} moedas.`+lvlUp(); }},
      treinar:{ic:'📖',l:'Treinar habilidade de classe',fn:sc=>{ if(!sc.cls) return 'Primeiro preciso escolher uma classe.'; sc.xp+=20; return 'Treinei até a mana acabar.'+lvlUp(); }},
      recrutar:{ic:'🧝',l:'Recrutar um companheiro',s:'Custa 50 moedas',fn:sc=>{ if(sc.ouro<50) return 'Ninguém se junta a um aventureiro sem dinheiro.'; sc.ouro-=50; sc.party++; const p=mkPerson({rel:'amigo',first:R.pick(FANTASY),last:R.pick(['da Floresta','Martelo-de-Ferro','Vento-Norte','das Sombras','Coração-de-Leão']),age:rnd(18,300),bond:65}); S.people.push(p); return `${p.first}, ${R.pick(RACES)}, entrou no meu grupo!`; }},
      casa:{ic:'🌀',l:'Abrir o portal de volta para casa',s:'Só para quem derrotou o Rei Demônio',min:sc=>!!sc.hero,fn:sc=>{ scenEnd(true,'Atravessei o portal e voltei para casa. Eldoria vai sentir minha falta.'); return 'Voltei para casa.'; }},
      taverna:{ic:'🍺',l:'Descansar na taverna',s:'10 moedas',fn:sc=>{ sc.ouro=Math.max(0,sc.ouro-10); st('health',15); st('happy',5); return 'Hidromel, música de bardo e uma cama de palha. Recuperei as forças.'; }},
      rei:{ic:'👿',l:'Desafiar o Rei Demônio',s:'Só a partir do nível 20',min:sc=>sc.lvl>=20,fn:(sc,m)=>{
        if(R.chance(clamp(.3+(sc.lvl-20)*.04+sc.party*.05,.15,.9))){ queue('isekai_fim',{}); return 'Depois de uma batalha de três dias, o Rei Demônio caiu. Eldoria está livre!'; }
        st('health',-40); if(m.health<=0){ die(`derrotad${oa()} pelo Rei Demônio`); return ''; } return 'O Rei Demônio era forte demais. Recuei quase morto.'; }},
    },
    year:(sc,m)=>{ if(!sc.cls&&!sc.asked){ sc.asked=1; setTimeout(()=>UI.open(V.scenClass),200); } sc.xp+=10; if(R.chance(.3)){ st('health',-rnd(5,15)); log(R.pick(['Goblins atacaram a vila onde eu estava.','Um troll bloqueou a estrada. Passei com dificuldade.']),'warn'); } lvlUp(); }},
  heroi:{n:'Superpoderes',ic:'🦸',d:'Um acidente estranho te dá um superpoder. Salve pessoas, enfrente vilões e proteja sua identidade secreta. Ou vire vilão.',
    intro:'Um raio atingiu o laboratório onde eu estava. Acordei no hospital e, ao tentar levantar, percebi que algo em mim tinha mudado.',
    init:()=>({poder:R.pick(POWERS),pw:20,sec:80,evil:0,inimigo:R.pick(['Doutor Caos','Madame Sombra','Barão do Ferro','O Colecionador','Vespa Negra'])}),
    label:sc=>sc.evil?(S.me.gender==='F'?'Vilã':'Vilão'):(S.me.gender==='F'?'Heroína':'Herói'),
    bars:sc=>[['Domínio do poder',sc.pw],['Identidade secreta',sc.sec]],
    info:sc=>[['Poder',sc.poder],['Arqui-inimigo',sc.inimigo],['Lado',sc.evil?'Vilão':'Herói']],
    acts:{
      salvar:{ic:'🚒',l:'Salvar pessoas',s:'Fama e carma',fn:(sc,m)=>{ m.fame=clamp(m.fame+3); m.karma=clamp(m.karma+3); scS('sec',-4); if(R.chance(.12)){ st('health',-12); return 'Segurei um prédio desabando. Salvei todos, mas me machuquei.'; } return R.pick(['Tirei uma família de um incêndio.','Parei um ônibus sem freio.','Peguei um gato preso numa antena. Viralizou.']); }},
      vilao:{ic:'💥',l:`Enfrentar o arqui-inimigo`,s:'Depende do domínio do poder e da luta',fn:(sc,m)=>{ if(R.chance(clamp(.35+sc.pw/200+m.fight/300,.1,.9))){ m.fame=clamp(m.fame+10); return `Derrotei ${sc.inimigo}! A cidade comemora.`; } st('health',-rnd(15,25)); return `${sc.inimigo} me deixou no chão desta vez.`; }},
      treinar:{ic:'🌀',l:'Treinar o poder',fn:sc=>{ scS('pw',rnd(5,10)); return `Treinei meu poder de ${sc.poder} no deserto.`; }},
      disfarce:{ic:'🕶️',l:'Proteger a identidade secreta',fn:sc=>{ scS('sec',15); return 'Inventei um álibi perfeito e troquei de máscara.'; }},
      roubar:{ic:'💰',l:'Usar o poder para roubar',s:'Vira vilão · dinheiro fácil',fn:(sc,m)=>{ sc.evil=1; m.karma=clamp(m.karma-15); const v=rnd(10000,100000); m.money+=v; if(R.chance(.2)){ arrest('roubo com uso de superpoderes',5,20); return 'Os outros heróis me pegaram.'; } return `Esvaziei o cofre de um banco em segundos: ${fmt(v)}.`; }},
      aposentar:{ic:'🏁',l:'Aposentar o uniforme',fn:()=>{ scenEnd(true,'Pendurei a capa. Volto a ser uma pessoa comum, mas a cidade nunca vai me esquecer.'); return 'Aposentei o uniforme.'; }},
    },
    year:(sc,m)=>{ sc.sec=Math.max(0,sc.sec-10); if(sc.sec<=0){ sc.sec=40; st('happy',-15); log('Minha identidade secreta vazou. Repórteres acampam na minha porta.','bad'); } if(R.chance(.25)){ st('health',-rnd(5,20)); log(`${sc.inimigo} atacou a cidade. Lutei até o fim do dia.`,'warn'); } }},
  marte:{n:'Colônia em Marte',ic:'🚀',d:'Você foi para a primeira colônia em Marte. Oxigênio, comida e o moral da equipe decidem se você volta para a Terra.',
    intro:'A nave pousou no planeta vermelho. Seis colonos, um habitat inflável e muita poeira. Bem-vind{o} a Marte.',
    init:()=>({o2:70,comida:60,moral:60,col:6}),
    label:()=>'Colon'+oa()+' em Marte',
    bars:sc=>[['Oxigênio',sc.o2],['Comida',sc.comida],['Moral da equipe',sc.moral]],
    info:sc=>[['Colonos',sc.col]],
    acts:{
      batata:{ic:'🥔',l:'Plantar batata na estufa',fn:sc=>{ const v=rnd(15,25); scS('comida',v); return `A colheita rendeu: +${v} de comida.`; }},
      o2:{ic:'🫧',l:'Consertar o gerador de oxigênio',s:'Inteligência ajuda',fn:(sc,m)=>{ if(R.chance(.62+m.smarts/250)){ const v=rnd(18,30); scS('o2',v); return `Gerador consertado: +${v} de oxigênio.`; } st('health',-8); return 'Levei um choque e o gerador continuou engasgando.'; }},
      explorar:{ic:'🛰️',l:'Explorar uma cratera',fn:sc=>{ if(R.chance(.15)){ st('health',-15); return 'O traje rasgou. Voltei correndo com o alarme apitando.'; } if(R.chance(.4)){ scS('o2',15); scS('moral',10); return 'Achei gelo de água! Mais oxigênio para todos.'; } scS('moral',4); return 'Só pedras vermelhas. Mas que vista.'; }},
      terra:{ic:'📡',l:'Falar com a Terra',fn:sc=>{ scS('moral',10); return 'Mandei um vídeo para a família. A resposta chegou 20 minutos depois.'; }},
      festa:{ic:'🎉',l:'Fazer uma festa na base',fn:sc=>{ scS('moral',15); scS('comida',-5); return 'Festa com batata frita marciana. A equipe precisava disso.'; }},
    },
    year:(sc,m)=>{ sc.o2-=30; sc.comida-=35; sc.moral-=10;
      if(R.chance(.35)){ sc.o2-=20; st('health',-10); log('Uma tempestade de areia de meses cobriu os painéis solares.','bad'); }
      if(sc.o2<=0){ sc.o2=0; st('health',-40); log('O oxigênio acabou por horas. Quase não sobrevivi.','bad'); }
      if(sc.comida<=0){ sc.comida=0; st('health',-25); log('A comida acabou.','bad'); }
      if(sc.moral<=20&&R.chance(.5)){ sc.col=Math.max(1,sc.col-1); log('Um colono desistiu e pegou a nave de volta.','warn'); }
      sc.o2=Math.max(0,sc.o2); sc.comida=Math.max(0,sc.comida); sc.moral=Math.max(0,sc.moral);
      if(m.health<=0) return die('em Marte, longe de casa');
      if(sc.yrs>=6){ m.fame=clamp(m.fame+25); scenEnd(true,`Voltei para a Terra como ${S.me.gender==='F'?'heroína':'herói'} espacial. Desfile em carro aberto e tudo.`); }
    }},
};
function bite(){ const sc=S.scen; if(!sc||sc.inf) return 'Quase fui mordid'+oa()+'.'; sc.inf=1; queue('zumbi_mordida',{}); return 'Um zumbi me mordeu no braço.'; }
function lvlUp(){ const sc=S.scen, m=S.me; let t=''; while(sc&&sc.xp>=sc.lvl*100){ sc.xp-=sc.lvl*100; sc.lvl++; st('health',10); t=` Subi para o nível ${sc.lvl}!`;
    if(sc.cls&&[5,10,15].includes(sc.lvl)){ const s=CLASSES[sc.cls].sk[sc.lvl/5-1]; t+=` Aprendi ${s}!`; log(`Aprendi a habilidade ${s}.`,'good'); } }
  if(t) log(t.trim(),'good'); return t; }
EVENTS.zumbi_mordida={show:()=>({k:'Apocalipse',t:'Fui mordid'+oa()+'!',x:'A mordida está queimando. Tenho pouco tempo antes de virar um deles.',ch:[['Esconder do grupo e torcer','e'],['Amputar o braço','a'],['Tomar a vacina experimental','v']]}),
  pick:k=>{ const sc=S.scen, m=S.me; if(!sc) return '';
    if(k==='a'){ if(R.chance(.45)){ sc.inf=0; st('health',-30); st('looks',-10); return 'Cortamos o braço antes de a infecção subir. Sobrevivi, com uma marca para sempre.'; } die('de hemorragia depois de amputar o braço'); return ''; }
    if(k==='v'){ if(R.chance(sc.cure/100)){ sc.inf=0; return 'A vacina experimental funcionou!'; } return 'A vacina não fez efeito.'; }
    return 'Escondi a mordida com uma blusa de manga comprida.'; }};
EVENTS.isekai_fim={show:()=>({k:'Eldoria',t:'O Rei Demônio caiu',x:'Uma luz se abre no céu. A deusa diz que posso voltar para casa, ou ficar em Eldoria como herói.',ch:[['Voltar para casa','c'],['Ficar em Eldoria','f']]}),
  pick:k=>{ const sc=S.scen, m=S.me; if(!sc) return ''; m.fame=clamp(m.fame+20);
    if(k==='c'){ m.fight=clamp(m.fight+20); st('smarts',10); m.money+=sc.ouro*100; scenEnd(true,`Acordei no hospital, como se nada tivesse acontecido. Mas trouxe a força de Eldoria e um saco de ouro que valeu ${fmt(sc.ouro*100)}.`); return 'Voltei para casa.'; }
    sc.hero=1; return 'Fiquei em Eldoria. Me deram um castelo e um título de nobreza.'; }};
// eventos dos cenários (só aparecem no cenário certo)
const scWhen=id=>m=>!!S.scen&&S.scen.id===id;
pack({k:'Apocalipse',w:1.6,cd:3,scen:'zumbi',when:scWhen('zumbi')},[
  ['Saqueadores','Um grupo armado quer nossos suprimentos.',['Entregar parte|sc.sup-15|Levaram o que queriam e foram embora.','Lutar|?fight sc.def+5 h+4|Expulsamos os saqueadores.|hl-15 sc.sup-20|Eles venceram e levaram quase tudo.','Esconder os suprimentos|?50 h+2|Não encontraram nada.|sc.sup-25|Acharam o esconderijo.']],
  ['Alguém mordido','Um membro do grupo apareceu com uma mordida escondida.',['Expulsar do abrigo|k-4 sc.grp-1|Foi difícil, mas era o certo.','Deixar ficar|?40 k+3|Era só um arranhão de arame.|hl-15|Na madrugada, virou zumbi dentro do abrigo.']],
  ['Rádio militar','O rádio pegou uma transmissão do exército falando de uma zona segura.',['Ir até a zona segura|?50 sc.sup+20 sc.def+20 h+8|Era verdade! Ganhamos comida e armas.|hl-20|Era uma armadilha de saqueadores.','Ficar no abrigo|h-2|Melhor não arriscar.']],
  ['Criança perdida','Uma criança sozinha bate na porta do abrigo.',['Acolher|k+6 sc.sup-8 h+6|Agora ela tem um lar.','Mandar embora|k-8 h-6|Não consigo dormir pensando nela.']],
  ['Supermercado intacto','Achamos um supermercado que ninguém saqueou.',['Ir com todo o grupo|?60 sc.sup+35|Banquete!|hl-15|Era um ninho de zumbis.','Mandar só um batedor|sc.sup+12|Trouxe o que deu.']],
]);
pack({k:'Ilha',w:1.6,cd:3,scen:'ilha',when:scWhen('ilha')},[
  ['Tempestade','Uma tempestade tropical chegou de madrugada.',['Segurar o abrigo|?50 h+3|O abrigo aguentou.|sc.abrigo-30 hl-8|O vento levou tudo.','Correr para a caverna|hl-3|Passei a noite encharcad{o}, mas viv{o}.']],
  ['Navio no horizonte','Vi um navio bem longe.',['Gritar e pular|?20 sc.sos+40|Acho que me viram!|h-6|Ninguém viu.','Jogar folhas verdes na fogueira|?50 sc.sos+50|A fumaça subiu alta!|h-4|A fogueira estava apagada.']],
  ['Coco na cabeça','Um coco caiu bem na minha cabeça.',['Comer o coco de vingança|sc.comida+5 hl-3|Doeu, mas estava gostoso.','Ficar bravo com a palmeira|h-1|A palmeira não se importou.']],
  ['Bola amiga','Achei uma bola de vôlei dos destroços e desenhei um rosto nela.',['Conversar com a bola todo dia|h+8|Ela é ótima ouvinte.','Usar como boia|sc.sos+5|Talvez sirva para algo.']],
]);
pack({k:'Eldoria',w:1.6,cd:3,scen:'isekai',when:scWhen('isekai')},[
  ['A princesa sumiu','O rei oferece uma recompensa para quem resgatar a princesa sequestrada por orcs.',['Aceitar a missão|?50 sc.xp+120 sc.ouro+200 f+3|Resgatei a princesa! O reino me aclama.|hl-20|Os orcs eram muitos.','Recusar|h-1|Alguém mais forte vai cuidar disso.']],
  ['Dragão','Um dragão vermelho pousou na colina.',['Enfrentar|?30 sc.xp+300 sc.ouro+500|Matei o dragão!|hl-35|Ele me jogou longe com a cauda.','Negociar|?40 sc.ouro+100|Ele gostou de mim e me deu uma escama de ouro.|sc.ouro-50|Ele cobrou pedágio.','Fugir|h-2|Ninguém julga quem foge de dragão.']],
  ['Habilidade trapaceira','A janela de status piscou: "Nova habilidade única desbloqueada".',['Ler a descrição|sc.xp+150 h+8|É uma habilidade absurdamente forte. Típico.','Ignorar|h+0|Depois eu leio.']],
  ['Mercador suspeito','Um mercador vende uma "espada lendária" por 100 moedas.',['Comprar|?40 sc.ouro-100 sc.xp+100|Era lendária mesmo!|sc.ouro-100|Era de madeira pintada.','Passar|h+0|Já caí em golpe parecido no outro mundo.']],
]);
pack({k:'Heróis',w:1.4,cd:3,scen:'heroi',when:scWhen('heroi')},[
  ['Convite da liga','Uma liga de heróis quer que eu entre para a equipe.',['Aceitar|f+6 sc.pw+10 h+6|Agora tenho uma equipe.','Recusar|h+0|Prefiro agir sozinh{o}.']],
  ['Foto borrada','Um fotógrafo conseguiu uma foto minha sem máscara.',['Comprar a foto|$-5000 sc.sec+20|Comprei a foto e o silêncio.','Deixar sair|sc.sec-30 f+5|Agora todo mundo especula.']],
]);
pack({k:'Marte',w:1.4,cd:3,scen:'marte',when:scWhen('marte')},[
  ['Meteorito','Um pequeno meteorito furou o habitat.',['Remendar correndo|?60 h+4|Remendei a tempo.|sc.o2-25 hl-10|Perdemos muito ar.','Evacuar para o módulo reserva|sc.moral-10|Todos a salvo, mas apertados.']],
  ['Colono doente','Um colono está com febre alta.',['Dar remédio da reserva|sc.moral+8 k+3|Ele melhorou.','Isolar|sc.moral-8|Ele melhorou, mas ficou magoado.']],
]);
// ---------- integração com o resto do jogo ----------
function startScen(id){ const m=S.me, d=SCEN[id]; if(m.job){ log(`Larguei ${m.job.spc?'minha carreira':'o emprego na '+m.job.co}.`); endJob(); } if(m.edu.cur){ m.edu.cur=null; m.edu.club=null; }
  S.scen=Object.assign({id,yrs:0},d.init(m)); log(fill(d.intro.replace(/\{o\}/g,oa())),'warn'); cnt('scen_'+id); if(id==='isekai') setTimeout(()=>UI.open(V.scenClass),150); }
function scenYear(){ const sc=S.scen; if(!sc) return; sc.yrs++; SCEN[sc.id].year(sc,S.me); }
function scenAct(k){ const sc=S.scen; if(!sc) return ''; const a=SCEN[sc.id].acts[k]; if(!a) return ''; if(use('sc_'+k)>3) return 'Já fiz muito isso este ano. Preciso de um descanso.'; return a.fn(sc,S.me)||''; }
V.scenPick=()=>({title:'Modos fictícios',items:[{html:'<div class="card"><p>Mude o rumo desta vida para uma história fora do comum. Enquanto durar, não há emprego nem contas, só o cenário. Ao terminar, a vida normal continua (se você sobreviver).</p></div>'}]
  .concat(Object.entries(SCEN).map(([id,d])=>({ic:d.ic,l:d.n,s:fill(d.d.replace(/\{o\}/g,oa())),on:()=>confirmBox(d.n,'Começar agora? Esta vida nunca mais vai ser a mesma.','Começar',()=>{ UI.close(); startScen(id); after(); })})))});
V.scenClass=()=>({title:'Escolha sua classe',items:Object.entries(CLASSES).map(([k,c])=>({ic:c.ic,l:clsName(k),s:c.sk.join(' · '),on:()=>{ if(S.scen){ S.scen.cls=k; log(`Escolhi ser ${clsName(k).toLowerCase()} em Eldoria.`,'good'); } UI.close(); after(); }}))});
V.scen=()=>{ const sc=S.scen,d=SCEN[sc.id],m=S.me;
  return {title:d.n,items:[{html:`<div class="card"><p><b>${d.ic} ${esc(d.label(sc))}</b> · ano ${sc.yrs+1}</p>${d.bars(sc).map(([l,v])=>bar(l,v)).join('')}${d.info(sc).map(([l,v])=>kv(l,String(v))).join('')}${loadBar()}</div>`},{sec:'Ações'}]
    .concat(Object.entries(d.acts).map(([k,a])=>({ic:a.ic,l:a.l,s:a.s,dis:a.min&&!a.min(sc),why:a.s,on:()=>act(()=>scenAct(k),d.n)})))
    .concat([{sec:'Vida'},{ic:'🧠',l:'Mente e corpo',on:()=>UI.push(V.mind)},{ic:'💗',l:'Saúde',on:()=>UI.push(V.health)}])}; };
V.activities=(orig=>()=>S.scen&&!S.me.prison?V.scen():orig())(V.activities);
V.career=(orig=>()=>S.scen&&!S.me.prison?V.scen():orig())(V.career);
occupation=(orig=>()=>S.scen?SCEN[S.scen.id].label(S.scen):orig())(occupation);
yearMoney=(orig=>function(){ if(S.scen) return; return orig(); })(yearMoney);
