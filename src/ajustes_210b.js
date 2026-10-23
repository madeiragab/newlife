// ===== 2.10: depois de tomar o poder — que país construir? =====
// Caminhos: ditadura militar, monarquia hereditária, revolução popular, teocracia ou transição democrática.
// Cada um tem título, ações e riscos próprios; todos podem refundar o país (nome, constituição, julgamento,
// programa nuclear, anexação) e escolher um herdeiro. Fica em m.office.reg (ajustes_210.js).

const CAMINHOS={
  militar:{n:'Junta Militar',tit:['General-presidente','Generala-presidente'],ic:'🎖️'},
  monarquia:{n:'Reino',tit:['Rei','Rainha'],ic:'👑'},
  popular:{n:'República Popular',tit:['Comandante','Comandante'],ic:'✊'},
  teocracia:{n:'República Sagrada',tit:['Guia supremo','Guia suprema'],ic:'⛪'},
  transicao:{n:'Governo de Transição',tit:['Presidente interino','Presidenta interina'],ic:'🗳️'},
};
const tituloDe=r=>{ const c=r&&CAMINHOS[r.tipo]; return c?c.tit[S.me.gender==='F'?1:0]:tituloDitador(); };
const paisNome=()=>S.me.c.paisNome||countryOf(S.me.country).n;
// "de Portugal", "do Brasil", "da Alemanha", "dos Estados Unidos"
const PREP_PAIS={Brasil:'do','Estados Unidos':'dos',México:'do',Japão:'do',Canadá:'do','Reino Unido':'do',Itália:'da',França:'da',Alemanha:'da',Argentina:'da',Espanha:'da',Índia:'da','Coreia do Sul':'da'};
const doPais=n=>(PREP_PAIS[n]||'de')+' '+n;

// o primeiro decreto vira a escolha do caminho
EVENTS.golpe_decreto={show:()=>({k:'Política',t:'🏛️ Que país você vai construir?',x:'O palácio é seu. O país inteiro espera saber o que vem agora.',ch:[
  ['🎖️ Ditadura militar: ordem acima de tudo','militar'],['👑 Coroar-me e fundar uma dinastia','monarquia'],['✊ Revolução popular: terra e pão para o povo','popular'],
  ['⛪ Governar em nome da fé','teocracia'],['🗳️ Transição: eleições livres em dois anos','transicao']]}),
  pick:k=>{ const m=S.me, r=regime(); if(!r) return ''; const c=CAMINHOS[k]||CAMINHOS.militar; r.tipo=k in CAMINHOS?k:'militar';
    r.n=`${c.n} ${doPais(paisNome())}`;
    if(k==='militar'){ r.leal+=15; r.medo+=15; r.pres+=10; }
    if(k==='monarquia'){ r.leal+=5; r.pres+=15; m.fame=clamp(m.fame+15); r.dinastia=m.last; }
    if(k==='popular'){ m.office.appr=clamp(m.office.appr+15); r.pres+=20; r.leal-=5; }
    if(k==='teocracia'){ r.medo+=10; m.office.appr=clamp(m.office.appr+5); r.pres+=15; }
    if(k==='transicao'){ r.medo-=15; r.pres-=20; m.office.appr=clamp(m.office.appr+10); m.karma=clamp(m.karma+15); r.eleicaoEm=S.year+2; }
    regFix(r); log(`${c.ic} Nasceu o ${r.n}. Sou ${tituloDe(r).toLowerCase()}.`,'big');
    return ({militar:'Toque de recolher, generais em todos os ministérios e desfiles toda semana.',monarquia:`Coroação na catedral, manto vermelho e uma coroa feita às pressas. A Casa ${m.last} agora reina.`,
      popular:'Distribuí as terras dos latifúndios e prometi escola e comida para todos. As embaixadas ocidentais fecharam as portas.',
      teocracia:'Os templos tocaram os sinos o dia inteiro. As leis agora vêm dos livros sagrados.',transicao:'Prometi eleições livres em dois anos. O mundo aplaudiu, e os generais ficaram desconfiados.'})[r.tipo]; }};

// título no topo da tela
occupation=(o=>()=>{ const m=S.me, r=m&&m.alive&&!m.prison&&m.office&&m.office.dit&&!S.scen&&m.office.reg; if(r&&r.tipo) return tituloDe(r); return o(); })(occupation);

// ações próprias de cada caminho
const ACOES_CAMINHO={
  militar:[['leimarcial','🪖','Decretar lei marcial','Medo e lealdade','Toque de recolher e soldados nas ruas. O povo não vai gostar.'],['servico','🎽','Serviço militar obrigatório','Lealdade · aprovação cai',null]],
  monarquia:[['baile','💃','Grande baile real','Fama e aprovação',null],['coroa','💎','Encomendar as joias da coroa',`${fmt(2000000)} · fama`,null],['titulos','🏰','Dar títulos de nobreza aos aliados','Lealdade',null]],
  popular:[['reforma','🌾','Reforma agrária','Aprovação · sanções',null],['alfabetizar','📚','Campanha de alfabetização','Aprovação e carma',null],['milicia','🛡️','Milícias populares','Medo e lealdade',null]],
  teocracia:[['leireligiosa','📜','Impor a lei religiosa','Medo · aprovação divide','A partir de hoje, quem desobedecer responde ao tribunal religioso.'],['templo','🛕','Construir um grande templo',`${fmt(1500000)} · aprovação`,null],['peregrinacao','🙏','Liderar uma peregrinação','Fama e aprovação',null]],
  transicao:[['debate','🎙️','Debater com a oposição','Aprovação',null],['imprensa','📰','Liberar a imprensa','Pressão internacional cai',null]],
};
function caminhoAcao(k){ const m=S.me, o=m.office, r=regime(); if(!r) return ''; if(use('cam_'+k)>2) return 'Já fiz muito disso este ano.';
  switch(k){
    case 'leimarcial': r.medo+=R.int(10,15); r.leal+=R.int(4,8); o.appr=clamp(o.appr-R.int(5,10)); regFix(r); return 'Toque de recolher às 20h e tanques em cada esquina. A capital ficou em silêncio.';
    case 'servico': r.leal+=R.int(5,10); o.appr=clamp(o.appr-R.int(2,6)); regFix(r); return 'Todo jovem de 18 anos agora serve dois anos no exército.';
    case 'baile': o.appr=clamp(o.appr+R.int(2,6)); m.fame=clamp(m.fame+5); return 'Lustres de cristal, valsa e a elite inteira beijando a minha mão.';
    case 'coroa': { const c=2000000; if(m.money<c) return `As joias custam ${fmt(c)}.`; m.money-=c; m.fame=clamp(m.fame+10); r.joias=1; return 'Uma coroa de ouro com 400 diamantes. Vai passar de geração em geração.'; }
    case 'titulos': r.leal+=R.int(6,12); regFix(r); return `Nomeei duques, condes e barões. Os generais agora são nobres da minha corte.`;
    case 'reforma': o.appr=clamp(o.appr+R.int(8,14)); r.pres+=R.int(6,10); regFix(r); return 'Dividi os latifúndios entre as famílias do campo. Os fazendeiros fugiram do país.';
    case 'alfabetizar': o.appr=clamp(o.appr+R.int(4,8)); m.karma=clamp(m.karma+8); return 'Professores voluntários foram para cada vilarejo. Um milhão de pessoas aprenderam a ler.';
    case 'milicia': r.medo+=R.int(5,9); r.leal+=R.int(3,6); regFix(r); return 'Armei os comitês de bairro. Agora cada esquina vigia a outra.';
    case 'leireligiosa': r.medo+=R.int(8,12); o.appr=clamp(o.appr+R.int(-8,6)); r.pres+=6; regFix(r); return 'Fechei os bares e as casas de show. As ruas ficaram silenciosas às sextas.';
    case 'templo': { const c=1500000; if(m.money<c) return `O templo custa ${fmt(c)}.`; m.money-=c; o.appr=clamp(o.appr+R.int(6,12)); return 'O maior templo do continente, com o meu nome gravado na pedra fundamental.'; }
    case 'peregrinacao': m.fame=clamp(m.fame+6); o.appr=clamp(o.appr+R.int(3,8)); return 'Caminhei com um milhão de fiéis até o santuário. As imagens rodaram o mundo.';
    case 'debate': o.appr=clamp(o.appr+R.int(-4,10)); return 'Debati ao vivo com os líderes da oposição. Pela primeira vez em anos, o país assistiu a uma discussão de verdade.';
    case 'imprensa': r.pres-=R.int(8,14); r.medo-=R.int(4,8); o.appr=clamp(o.appr+R.int(-3,4)); regFix(r); return 'Reabri os jornais. Os primeiros editoriais me criticaram sem medo.';
  }
  return ''; }

// refundar o país
function refundar(k){ const m=S.me, o=m.office, r=regime(); if(!r) return;
  if(k==='nome') return modal({t:'Novo nome do país',html:'<input class="in" id="novoPais" style="margin-top:8px" maxlength="40" placeholder="República de Nova Esperança" autocomplete="off">',ch:[{l:'Rebatizar',fn:()=>{ const v=((document.getElementById('novoPais')||{}).value||'').trim(); if(!v) return; m.c.paisNome=v; r.n=r.n.replace(/ (de|do|da|dos) .*$/,' '+doPais(v)); log(`O país agora se chama ${v}. Os mapas do mundo inteiro precisaram ser refeitos.`,'big'); m.fame=clamp(m.fame+4); after(); }},{l:'Cancelar',cls:'alt'}]});
  if(k==='constituicao') return modal({t:'📜 Nova constituição',x:'Os juristas do regime esperam a sua decisão sobre o mandato.',ch:[
    {l:'Mandato vitalício',fn:()=>{ r.vitalicio=1; r.leal+=8; r.pres+=12; regFix(r); log('A nova constituição me deu mandato vitalício.','warn'); after(); }},
    {l:'Limite de dez anos',fn:()=>{ r.limite=S.year+10; o.appr=clamp(o.appr+10); r.pres-=10; regFix(r); log('A nova constituição limita o meu governo a dez anos.','good'); after(); }},{l:'Deixar como está',cls:'alt'}]});
  if(k==='julgar') return modal({t:'⚖️ O antigo presidente',x:'Ele está preso no quartel desde a noite do golpe. O que fazer com ele?',ch:[
    {l:'Julgamento público',fn:()=>{ r.julgou=1; o.appr=clamp(o.appr+8); r.pres+=5; regFix(r); log('O antigo presidente foi julgado em rede nacional e condenado.','warn'); after(); }},
    {l:'Mandar para o exílio',fn:()=>{ r.julgou=1; r.pres-=5; regFix(r); log('O antigo presidente embarcou para o exílio. Pode voltar um dia.'); after(); }},
    {l:'Perdoar em nome da paz',fn:()=>{ r.julgou=1; m.karma=clamp(m.karma+10); r.leal-=5; regFix(r); log('Perdoei o antigo presidente. Os generais não gostaram.','good'); after(); }}]});
}
function regGrande(k){ const m=S.me, r=regime(); if(!r) return '';
  if(k==='nuclear'){ const c=5000000; if(m.money<c) return `Um programa nuclear custa ${fmt(c)}.`; if(r.nuclear) return 'O programa nuclear já existe.'; m.money-=c; r.nuclear=1; r.pres+=30; r.leal+=10; regFix(r); m.fame=clamp(m.fame+15); log('☢️ Anunciei o primeiro teste nuclear do país.','big'); return 'Uma explosão no deserto. O mundo inteiro passou a me levar a sério, e a me temer.'; }
  if(k==='anexar'){ const alvo=R.pick(COUNTRIES.filter(c=>c.id!==m.country)).n; r.pres+=25; regFix(r);
    if(R.chance(.25+r.leal/300)){ r.anexou=(r.anexou||0)+1; m.office.appr=clamp(m.office.appr+12); m.fame=clamp(m.fame+12); log(`🗺️ Anexei uma província de ${alvo}.`,'big'); return `Os tanques cruzaram a fronteira de madrugada. A província é nossa, e ${alvo} jurou vingança.`; }
    if(R.chance(.3)){ m.office=null; die('na guerra que começou para anexar território'); return 'A invasão virou guerra. O palácio foi bombardeado.'; }
    m.office.appr=clamp(m.office.appr-15); r.leal-=15; regFix(r); return `A invasão fracassou. ${alvo} expulsou nossas tropas e o exército me culpa.`; }
  return ''; }

// sucessão: escolher herdeiro; na monarquia, o herdeiro assume o trono
function escolherHerdeiro(){ const r=regime(), ks=kids().filter(k=>k.alive); if(!r) return; if(!ks.length) return msg('Sucessão','Ainda não tenho filhos para herdar o poder.');
  modal({t:'👑 Sucessão',x:'Quem herda o poder quando eu me for?',ch:ks.map(k=>({l:`${fullName(k)} · ${k.age} anos`,fn:()=>{ r.herdeiro=k.id; log(`Nomeei ${k.first} como herdeir${k.gender==='F'?'a':'o'} do ${r.n}.`,'big'); after(); }})).concat([{l:'Cancelar',cls:'alt'}])}); }
// a morte limpa o cargo (sucessao.js), então o regime fica guardado para o herdeiro
die=(o=>function(){ const m=S.me, of=m&&m.alive&&m.office; if(of&&of.dit&&of.reg) m.c.trono={appr:of.appr,reg:JSON.parse(JSON.stringify(of.reg))}; return o.apply(this,arguments); })(die);
continueAs=(o=>function(k){ const old=S.me, t=old.c&&old.c.trono, of=t, r=t&&t.reg; const res=o.apply(this,arguments);
  if(res!==false&&r&&(r.tipo==='monarquia'||r.herdeiro===(k&&k.id))&&S.me&&S.me.alive&&!S.me.office){ const reg=JSON.parse(JSON.stringify(r)); reg.anos=0; delete reg.herdeiro;
    S.me.office={id:'pres',yrs:0,appr:clamp(of.appr+R.int(-10,10)),dit:1,reg}; log(r.tipo==='monarquia'?`👑 Fui coroad${S.me.gender==='F'?'a':'o'}. A dinastia ${r.dinastia||old.last} continua.`:`Herdei o comando do ${reg.n}.`,'big'); }
  return res; })(continueAs);

// eleição da transição: concorrer, perder de verdade ou entregar o poder
EVENTS.regime_eleicao={show:()=>({k:'Política',t:'🗳️ Dia da eleição livre',x:'Chegou a eleição prometida. A oposição tem candidato e o mundo está assistindo.',ch:[['Concorrer de verdade','c'],['Entregar o poder sem concorrer','e'],['Cancelar a eleição','x']]}),
  pick:k=>{ const m=S.me, o=m.office, r=regime(); if(!r) return '';
    if(k==='e'){ m.office=null; m.karma=clamp(m.karma+30); m.fame=clamp(m.fame+20); log('Entreguei o poder ao presidente eleito. Os livros de história vão me chamar de pai da democracia.'.replace('pai',m.gender==='F'?'mãe':'pai'),'big'); return 'Passei a faixa e voltei para casa a pé. O povo aplaudiu da calçada.'; }
    if(k==='x'){ r.tipo='militar'; r.n=r.n.replace('Governo de Transição','Junta Militar'); r.pres+=25; o.appr=clamp(o.appr-20); regFix(r); return 'Cancelei a eleição "por motivos de segurança". A transição acabou ali.'; }
    if(R.chance(Math.max(.1,Math.min(.85,o.appr/100)))){ delete o.dit; delete o.reg; o.yrs=0; o.appr=clamp(o.appr+10); m.karma=clamp(m.karma+15); log('Venci uma eleição limpa. Agora sou presidente de verdade.','big'); return 'Ganhei nas urnas. Pela primeira vez, ninguém pode dizer que roubei o cargo.'; }
    m.office=null; m.karma=clamp(m.karma+20); log('Perdi a eleição que eu mesm'+oa()+' convoquei, e aceitei o resultado.','warn'); return 'Perdi. Liguei para o vencedor e reconheci a derrota. O mundo não acreditou.'; }};
yearMoney=(o=>function(){ const x=o.apply(this,arguments); try{ const m=S.me, r=regime(); if(r&&m.alive&&!m.prison){
  if(r.tipo==='transicao'&&r.eleicaoEm&&S.year>=r.eleicaoEm){ delete r.eleicaoEm; queue('regime_eleicao',{}); }
  if(r.limite&&S.year>=r.limite){ delete r.limite; queue('regime_eleicao',{}); }
  if(r.tipo==='monarquia'&&R.chance(.2)) { m.office.appr=clamp(m.office.appr+R.int(-3,4)); } } }catch(e){} return x; })(yearMoney);

// tela: título do caminho, ações próprias, refundar o país e sucessão
V.career=(o=>function(){ const res=o.apply(this,arguments), m=S.me, r=regime(); if(!r||!res||!res.items||m.prison) return res;
  const card=res.items.find(x=>x&&x.html&&x.html.includes('Medo da população')); if(card){ card.html=card.html.replace(/<b>🎖️ [^<]*<\/b>/,`<b>${(CAMINHOS[r.tipo]||CAMINHOS.militar).ic} ${esc(tituloDe(r))} ${esc(doPais(paisNome()))}</b>`); }
  const i=res.items.findIndex(x=>x&&x.sec==='Dinheiro e poder'); if(i<0) return res;
  const A=(f,k,ic,l,s,crit)=>({ic,l,s,tone:crit?'bad':'',on:crit?()=>confirmBox(l+'?',crit,'Confirmar',()=>act(()=>f(k),r.n)):()=>act(()=>f(k),r.n)});
  const extra=[];
  const proprias=ACOES_CAMINHO[r.tipo]||[]; if(proprias.length){ extra.push({sec:(CAMINHOS[r.tipo]||{}).n||'Governo'}); for(const [k,ic,l,s,crit] of proprias) extra.push(A(caminhoAcao,k,ic,l,s,crit)); }
  extra.push({sec:'Refundar o país'},
    {ic:'🏷️',l:'Mudar o nome do país',s:m.c.paisNome?`Hoje: ${m.c.paisNome}`:'Novo nome, nova história',on:()=>refundar('nome')},
    {ic:'📜',l:'Escrever uma nova constituição',s:r.vitalicio?'Mandato vitalício':r.limite?`Governo até ${r.limite}`:'Decidir o mandato',on:()=>refundar('constituicao')});
  if(!r.julgou) extra.push({ic:'⚖️',l:'Decidir o destino do antigo presidente',s:'Julgamento, exílio ou perdão',on:()=>refundar('julgar')});
  extra.push(A(regGrande,'nuclear','☢️','Programa nuclear',`${fmt(5000000)} · o mundo passa a temer`,'O mundo inteiro vai reagir. As sanções vão pesar.'),
    A(regGrande,'anexar','🗺️','Anexar território vizinho','Glória ou guerra','Pode virar guerra e acabar com o regime.'),
    {sec:'Sucessão'},{ic:'👑',l:'Escolher um herdeiro',s:r.herdeiro&&P(r.herdeiro)?`Herdeiro: ${P(r.herdeiro).first}`:r.tipo==='monarquia'?'Na monarquia, um filho herda o trono':'Quem assume quando eu me for',on:escolherHerdeiro});
  res.items.splice(i,0,...extra); return res; })(V.career);
