// ===== Investigar o paranormal: fantasmas, vampiros e lobisomens (e virar um deles, para sempre) =====
const PARA_LUGARES=[
  ['cemiterio','Cemitério à meia-noite','🪦',['fantasma','vampiro','nada'],.25],['casa','Casa abandonada no fim da rua','🏚️',['fantasma','fantasma','nada'],.15],
  ['floresta','Floresta na lua cheia','🌕',['lobisomem','lobisomem','nada'],.35],['castelo','Castelo antigo na serra','🏰',['vampiro','vampiro','fantasma'],.4],
  ['hospital','Hospital psiquiátrico desativado','🏥',['fantasma','fantasma','nada'],.2],['sitio','Sítio com luzes estranhas no céu','🛸',['ovni','nada','nada'],.1],
  ['boate','Boate que só abre depois das 3 da manhã','🦇',['vampiro','nada'],.3],['estrada','Estrada de terra onde somem viajantes','🛣️',['lobisomem','fantasma','nada'],.25]];
const CRIATURA={vampiro:['Vampiro|Vampira','🧛'],lobisomem:['Lobisomem|Mulher-loba','🐺']};
const para=()=>{ const m=S.me; return m.para||(m.para={prova:0,vistos:{},visitas:0}); };
function virar(tipo,quem){ const m=S.me; if(m.criatura) return ''; m.criatura=tipo; m.c.criatura=1; m.criaturaAno=S.year; if(tipo==='lobisomem') m.fight=clamp((m.fight||0)+20); if(tipo==='vampiro'){ st('looks',8); st('health',20); }
  log(`${CRIATURA[tipo][1]} Fui mordid${oa()} ${quem?'por '+quem:''} e virei ${g(CRIATURA[tipo][0],m.gender).toLowerCase()}. Para sempre.`,'bad'); return ` Virei ${g(CRIATURA[tipo][0],m.gender).toLowerCase()}.`; }
function paraVisita(id){ const m=S.me, L=PARA_LUGARES.find(x=>x[0]===id), P=para(); if(use('para')>3) return 'Já me arrisquei demais este ano. Até eu tenho limite.';
  P.visitas++; const o=R.pick(L[3]), risco=L[4]*(m.criatura?.4:1);
  if(o==='nada'||(o!=='fantasma'&&o!=='ovni'&&!R.chance(.55))){ if(R.chance(.35)){ P.prova++; return `${L[2]} ${L[1]}: passei a noite com câmera e gravador. Captei um barulho que ninguém sabe explicar. Provas: ${P.prova}.`; } return `${L[2]} ${L[1]}: frio, mosquito e silêncio. Nada de sobrenatural, só o medo.`; }
  if(o==='fantasma'){ P.vistos.fantasma=1; P.prova+=2; st('happy',-4); if(R.chance(.15)){ st('health',-R.int(5,15)); return `${L[2]} ${L[1]}: uma mulher de branco atravessou a parede e gritou na minha cara. Caí da escada fugindo. Mas filmei! Provas: ${P.prova}.`; } return `${L[2]} ${L[1]}: uma porta bateu sozinha, uma voz chamou meu nome. Filmei tudo. Provas: ${P.prova}.`; }
  if(o==='ovni'){ P.prova+=2; P.vistos.ovni=1; return `${L[2]} ${L[1]}: três luzes pararam em cima do pasto e sumiram em silêncio. As vacas nem ligaram. Provas: ${P.prova}.`; }
  // vampiro ou lobisomem
  P.vistos[o]=1; const nome=o==='vampiro'?R.pick(['um homem pálido de capa','uma mulher elegante de olhos vermelhos','um conde que não aparece no espelho']):R.pick(['uma fera do tamanho de um urso','um homem que se contorcia virando lobo','um vulto peludo de olhos amarelos']);
  const fuga=.45+(m.fight||0)/250+m.health/400-risco;
  if(R.chance(fuga)){ P.prova+=3; m.fame=clamp(m.fame+1); return `${L[2]} ${L[1]}: dei de cara com ${nome}. Corri como nunca na vida, e consegui uma foto borrada. Provas: ${P.prova}.`; }
  if(m.criatura&&m.criatura===o){ P.prova+=2; return `${L[2]} ${L[1]}: ${nome} me farejou, me reconheceu como igual e foi embora.`; }
  if(R.chance(o==='vampiro'?.32:.38)&&!m.criatura){ return `${L[2]} ${L[1]}: ${nome} me alcançou. A mordida queimou como fogo.`+virar(o,nome); }
  if(R.chance(.45)){ die(o==='vampiro'?'com o sangue drenado por um vampiro':'despedaçad'+oa()+' por um lobisomem'); return `${L[2]} ${L[1]}: ${nome} me alcançou.`; }
  st('health',-R.int(20,40)); return `${L[2]} ${L[1]}: ${nome} me jogou contra uma árvore e sumiu. Acordei no hospital, cheio de pontos.`; }
function paraPublicar(){ const m=S.me, P=para(); if(P.prova<5) return 'Ainda não tenho provas suficientes. Preciso de pelo menos 5.'; const n=P.prova; P.prova=0;
  if(R.chance(.25+n/40)){ const v=n*R.int(4000,12000); m.money+=v; m.fame=clamp(m.fame+n); st('happy',12); return `Lancei um documentário com as provas. Virou febre: ${fmt(v)} e entrevistas no mundo todo.`; }
  m.fame=clamp(m.fame+2); st('happy',-8); return 'Publiquei as provas. Me chamaram de farsante na internet. Os memes não param.'; }
function paraCura(){ const m=S.me; if(!m.criatura) return ''; const c=40000; if(m.money<c) return `O ritual de cura custa ${fmt(c)} em ingredientes raros.`; if(use('cura')>1) return 'Só dá para tentar uma vez por ano.'; m.money-=c;
  if(R.chance(.18)){ const t=m.criatura; m.criatura=null; log(`Me curei: deixei de ser ${g(CRIATURA[t][0],m.gender).toLowerCase()}.`,'good'); st('happy',15); return 'O ritual funcionou. Senti o sol na pele sem queimar. Voltei a ser humano.'; }
  st('health',-R.int(5,15)); return R.pick(['O ritual não funcionou. A bruxa ficou com o dinheiro.','Bebi a poção. Vomitei a noite inteira. Continuo o mesmo.']); }
V.paranormal=()=>{ const m=S.me, P=para(), it=[];
  it.push({html:`<div class="card"><p>Investigue lugares assombrados com câmera e lanterna. Fantasmas assustam; vampiros e lobisomens matam, ou mordem, e aí é para sempre.</p>${kv('Provas',P.prova)}${kv('Visitas',P.visitas)}${m.criatura?kv('Eu sou',CRIATURA[m.criatura][1]+' '+g(CRIATURA[m.criatura][0],m.gender)):''}</div>`},{sec:'Lugares'});
  PARA_LUGARES.forEach(L=>it.push({ic:L[2],l:L[1],s:`Perigo ${'☠️'.repeat(Math.max(1,Math.round(L[4]*7)))}`,on:()=>act(()=>paraVisita(L[0]),L[1])}));
  it.push({sec:'Provas'},{ic:'🎬',l:'Publicar as provas',s:'Fama e dinheiro, ou virar piada',on:()=>act(paraPublicar,'Paranormal')});
  if(m.criatura) it.push({sec:'A maldição'},{ic:'🧪',l:'Procurar uma cura',s:`${fmt(40000)} · chance pequena`,on:()=>act(paraCura,'Cura')});
  return {title:'Paranormal',items:it}; };
V.activities=(o=>()=>{ const r=o(); const m=S.me; if(m.prison||!r||!r.items) return r; r.items.push(Object.assign({ic:'👻',l:'Investigar o paranormal',s:m.criatura?`Sou ${g(CRIATURA[m.criatura][0],m.gender).toLowerCase()}`:'Fantasmas, vampiros e lobisomens',on:()=>UI.push(V.paranormal)},ageGate(14))); return r; })(V.activities);
// ---------- a vida de criatura ----------
deathRoll=(o=>function(){ const m=S.me; if(m.criatura==='vampiro') return R.chance(.003); return o.apply(this,arguments); })(deathRoll);
yearMoney=(o=>function(){ const x=o.apply(this,arguments); const m=S.me; try{ if(m.alive&&m.criatura&&!(S.scen)){
    if(m.criatura==='vampiro'){ m.health=Math.max(m.health,70); st('looks',1); if(!m.prison) queue('vamp_sede',{}); }
    if(m.criatura==='lobisomem'){ st('health',2); if(!m.prison) queue('lobo_lua',{}); }
    if(R.chance(.07)) queue('cacador',{}); } }catch(e){} return x; })(yearMoney);
occupation=(o=>()=>{ const r=o(); const m=S.me; return m&&m.alive&&m.criatura&&!S.scen?`${r} · ${CRIATURA[m.criatura][1]}`:r; })(occupation);
const pv=m=>(S.people||[]).filter(p=>p.alive&&p.rel!=='pet'&&p.rel!=='tmp');
EVENTS.vamp_sede={once:1,show:()=>({k:'Maldição',t:'A sede',x:'A sede de sangue voltou. As veias queimam e o coração de qualquer pessoa por perto soa como um tambor.',ch:[['Roubar bolsas de sangue de um hospital','h'],['Caçar animais na mata','a'],['Atacar alguém num beco escuro','p'],['Resistir à sede','r']]}),
  pick:k=>{ const m=S.me;
    if(k==='h'){ if(R.chance(.15)){ arrest('furto em hospital',1,3); return 'O segurança me pegou com a geladeira aberta.'; } cnt('crimes'); return 'Saí do hospital com seis bolsas de sangue numa mochila térmica. O ano está garantido.'; }
    if(k==='a'){ st('happy',-6); st('health',-5); return 'Sangue de capivara. Sobrevivo. Mal.'; }
    if(k==='p'){ m.karma=clamp(m.karma-15); cnt('crimes'); if(R.chance(.3)){ cnt('kills'); if(R.chance(.3)){ arrest('homicídio',12,30); return 'Exagerei. A vítima não acordou. A polícia achou o corpo e me achou depois.'; } return 'Exagerei. A vítima não acordou. Ninguém nunca soube.'; } if(R.chance(.15)){ const p=mkPerson({rel:'amigo',age:R.int(20,50),bond:30}); p.criatura='vampiro'; S.people.push(p); return `Mordi ${p.first} e não consegui parar a tempo de evitar a transformação. Agora tem mais um vampiro na cidade, e ele sabe quem eu sou.`; } return 'Um bêbado num beco. Ele vai acordar com dor de cabeça e duas marquinhas no pescoço.'; }
    st('health',-R.int(20,35)); st('happy',-10); return 'Resisti. Passei semanas tremendo, magr'+oa()+', com os olhos fundos.'; }};
EVENTS.lobo_lua={once:1,show:()=>({k:'Maldição',t:'Lua cheia',x:'É noite de lua cheia. Os ossos já começaram a estalar.',ch:[['Me trancar no porão com correntes','c'],['Correr para a floresta','f'],['Não fazer nada e torcer','n']]}),
  pick:k=>{ const m=S.me;
    if(k==='c'){ st('happy',-4); st('health',-3); return 'Uivei a noite inteira acorrentad'+oa()+'. Os vizinhos acham que tenho um cachorro enorme.'; }
    if(k==='f'){ if(R.chance(.15)){ st('health',-R.int(15,30)); return 'Um caçador me acertou de raspão. Acordei pelad'+oa()+' na lama, sangrando.'; } st('happy',4); return 'Corri a noite inteira entre as árvores. Cacei um javali. Foi a noite mais livre da minha vida.'; }
    const fam=pv().filter(p=>['conjuge','namoro','noivo','filho','irmao','mae','pai','amigo'].includes(p.rel));
    if(fam.length&&R.chance(.35)){ const p=R.pick(fam); if(R.chance(.4)){ p.alive=false; st('happy',-35); m.karma=clamp(m.karma-20); cnt('kills'); log(`${relLabel(p)} ${fullName(p)} morreu atacad${p.gender==='F'?'a':'o'} por uma fera na noite de lua cheia.`,'bad'); return `Acordei com sangue nas mãos. ${p.first} estava no quintal. Nunca vou me perdoar.`; }
      p.criatura='lobisomem'; p.health=clamp(p.health-20); p.bond=clamp(p.bond-25); return `Mordi ${p.first}. Agora são dois lobos na família. ${p.first} me olha diferente.`; }
    if(R.chance(.3)){ m.karma=clamp(m.karma-8); return 'Acordei num galinheiro destruído. O fazendeiro vai procurar uma onça que não existe.'; }
    return 'Acordei pelad'+oa()+' num parque, sem lembrar de nada. Pelo menos não tinha sangue.'; }};
EVENTS.cacador={show:()=>({k:'Maldição',t:'Caçador de monstros',x:`Um caçador de ${S.me.criatura==='vampiro'?'vampiros, com estacas e água benta,':'lobisomens, com balas de prata,'} descobriu quem eu sou e está na minha porta.`,ch:[['Lutar','l'],['Fugir da cidade','f'],['Pedir misericórdia','p']]}),
  pick:k=>{ const m=S.me; if(!m.criatura) return '';
    if(k==='l'){ if(R.chance(.5+(m.fight||0)/300)){ cnt('kills'); m.karma=clamp(m.karma-5); return 'Ele era bom. Eu fui melhor.'; } if(R.chance(.5)){ die(m.criatura==='vampiro'?'com uma estaca no coração':'com uma bala de prata no peito'); return 'O caçador venceu.'; } st('health',-30); return 'Escapei por pouco, muito ferid'+oa()+'.'; }
    if(k==='f'){ m.money=Math.round(m.money*.8); st('happy',-8); return 'Juntei o que deu e me mudei de madrugada. Mais uma cidade, mais um nome.'; }
    if(R.chance(.3)){ return 'Ele viu que eu nunca machuquei ninguém de propósito. Baixou a arma e foi embora.'; } die(m.criatura==='vampiro'?'com uma estaca no coração':'com uma bala de prata no peito'); return 'Ele não teve misericórdia.'; }};
const CW=t=>m=>m.criatura===t&&!m.prison;
pack({k:'Maldição',w:1.3,cd:8,min:14,when:CW('vampiro')},[
  ['Sol da manhã','Você perdeu a hora e o sol nasceu com você na rua.',['Correr para a sombra|?hl hl-8|Cheguei em casa com bolhas no braço.|hl-25|Fiquei com queimaduras feias.','Se enrolar no casaco e andar devagar|hl-12 h-4|Fumaça saindo da manga. Ninguém entendeu nada.']],
  ['Espelho','Uma criança percebe que você não aparece no espelho da loja.',['Dizer que é um truque de mágica|?50 h+4|Ela aplaudiu.|h-4|A mãe dela me olhou com pavor.','Sair correndo|h-2|Mais uma loja onde não posso voltar.']],
  ['Jantar em família','Sua família insiste num jantar com macarronada ao alho.',['Comer mesmo assim|hl-15 h+2|Passei mal a noite toda. Mas comi.','Inventar uma alergia|h-2|Agora sou "a pessoa difícil" da família.']],
  ['Velhos amigos envelhecendo','Um amigo de escola encontra você e não acredita que você não envelheceu nada.',['Dizer que é genética|?50 h+2|Ele quer saber o nome do creme.|h-4|Ele ficou desconfiado.','Contar a verdade|h+4 k+2|Ele riu, achando que era piada.']],
  ['Outro vampiro','Um vampiro centenário convida você para um clã secreto.',['Entrar no clã|$+30000 k-6|Agora tenho aliados, dívidas e regras.','Recusar|h+0|Prefiro viver sozinh{o}.']],
  ['Igreja','Você precisa entrar numa igreja para o casamento de um amigo.',['Entrar|hl-15 h-4|Senti cada passo queimar. Aguentei até o "sim".','Ficar do lado de fora|bond-4|Disse que estava passando mal.']],
  ['Médico desconfiado','Seu médico diz que seu coração bate 4 vezes por minuto.',['Trocar de médico|h-2|O próximo nem vai medir.','Hipnotizar o médico|?50 h+4|Ele esqueceu tudo.|h-6|Ele chamou outros médicos.']],
]);
pack({k:'Maldição',w:1.3,cd:8,min:14,when:CW('lobisomem')},[
  ['Cachorros','Todos os cachorros do bairro latem quando você passa.',['Rosnar de volta|h+4|Eles ficaram quietos na hora.','Mudar de caminho|h-2|Agora faço um desvio enorme para ir ao mercado.']],
  ['Fome de carne','Você está com uma fome absurda de carne crua.',['Ir a uma churrascaria|$-300 h+8|Comi uns três quilos. O garçom pediu uma foto.','Resistir|h-6|Comi salada pensando em bife.']],
  ['Raiva','Alguém fecha você no trânsito e o lobo quer sair.',['Respirar fundo|?will h+2|Contei até dez. Funcionou.|k-6 h-4|Arranquei o retrovisor dele com a mão.','Deixar sair um pouco|k-8 fight+3|O motorista fugiu correndo.']],
  ['Força estranha','Você levanta um carro para tirar uma criança presa embaixo.',['Fazer de novo, sem pensar|k+8 f+3|Viralizou como "herói anônimo".','Disfarçar|k+4|Disse que foi a adrenalina.']],
  ['Pelos','Os pelos crescem rápido demais: você se barbeia três vezes por dia.',['Aceitar o visual|lk-2 h+2|Assumi o estilo lenhador.','Gastar com depilação a laser|$-2000 h+2|Inútil, mas tentei.']],
  ['Alcateia','Uma alcateia de lobisomens convida você para correr na lua cheia.',['Ir|h+8 fight+4|Pela primeira vez, não me senti um monstro sozinho.','Recusar|h-2|Prefiro minha corrente no porão.']],
  ['Prata','Você ganha um anel de prata de presente.',['Usar mesmo assim|hl-10|Queimou o dedo. Disse que era alergia.','Guardar na gaveta|h-2|A pessoa perguntou por que nunca uso.']],
]);
pack({k:'Paranormal',w:1.1,cd:10,min:14,when:m=>!!m.para&&m.para.visitas>=2&&!m.prison},[
  ['Canal de caça-fantasmas','Um canal famoso quer você como convidad{o} numa investigação ao vivo.',['Aceitar|f+4 $+3000|A live bateu recorde. Uma porta bateu sozinha ao vivo.','Recusar|h+0|Prefiro trabalhar sozinh{o}.']],
  ['Médium','Uma médium diz que um espírito está grudado em você.',['Pagar o ritual de limpeza|$-1500 h+4|Me senti mais leve. Ou mais pobre.','Ignorar|h-2|De noite, ouvi passos no corredor.']],
  ['Vizinhos','Os vizinhos acham você louc{o} por passar as noites em cemitérios.',['Explicar o que você faz|?50 h+2|Um vizinho pediu para ir junto.|h-4|Agora acham que sou satanista.','Ignorar|h-2|Não preciso da aprovação deles.']],
  ['Livro antigo','Você acha num sebo um livro de 1700 sobre como identificar vampiros.',['Comprar|$-400 sm+3|Agora sei que eles odeiam contar grãos de arroz.','Deixar lá|h+0|Tenho medo do que vou descobrir.']],
]);
extTok=(o=>function(tok,d,out){ const mm=tok.match(/^fight([+-]\d+)$/); if(mm){ S.me.fight=clamp((S.me.fight||0)+ +mm[1]); return true; } return o(tok,d,out); })(extTok);
extChance=(o=>function(key){ if(key==='will') return S.me.will; return o(key); })(extChance);
