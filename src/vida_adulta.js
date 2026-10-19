// ===== Vida adulta e velhice: hobbies com níveis, férias, contas do mês, churrasco com os amigos, check-up, crise dos 40,
// lista de desejos, netos, memórias, baile da terceira idade e reencontros. Eventos revisados para cada fase da vida.
// ---------- coerência por fase ----------
const IDADE_EVENTO2={'Bico de fim de semana':[16,75],'Briga no bar':[18,80],'Dieta da moda':[14,85],'Viagem de amigos':[16,88],'Noite de karaokê':[14,90]};
for(const ev of Object.values(EVENTS)){ const f=IDADE_EVENTO2[ev.title]; if(!f) continue; const w0=ev.when; ev.when=m=>m.age>=f[0]&&m.age<=f[1]&&(!w0||w0(m)); }
const PAIS_RE=/(^|[^a-zà-ú])(meus pais|minha mãe|meu pai|aniversário de casamento dos pais)(?![a-zà-ú])/i;
evValid=(o=>function(e){ const ok=o.apply(this,arguments); if(!ok) return false; const ev=EVENTS[e.id], m=S.me; if(!ev||!m||String(e.id).startsWith('cad_')) return ok;
  const ps=parents().filter(p=>p.alive); if(ps.length>=2) return ok; try{ const sh=ev.show(e.d||{}); const txt=String(sh.t||'')+' '+String(sh.x||''); if(!ps.length&&PAIS_RE.test(txt)) return false; if(ps.length<2&&/aniversário de casamento dos pais/i.test(txt)) return false; }catch(err){} return ok; })(evValid);
// ---------- hobbies ----------
const HOBBIES={corrida:['🏃','Corrida','saúde'],culinaria:['🍳','Culinária','família'],jardinagem:['🌻','Jardinagem','felicidade'],fotografia:['📷','Fotografia','artes'],marcenaria:['🪚','Marcenaria','dinheiro'],xadrez:['♟️','Xadrez','inteligência'],pesca:['🎣','Pesca','calma'],tricô:['🧶','Tricô e crochê','presentes'],ciclismo:['🚴','Ciclismo','saúde'],leitura:['📚','Clube do livro','inteligência']};
const HOBBY_NIVEIS=['Iniciante','Amador','Bom','Avançado','Mestre'];
const hobbyNivel=n=>Math.min(4,Math.floor((n||0)/4));
function hobbyPraticar(k){ const m=S.me, H=HOBBIES[k]; if(!H) return ''; if(use('hobby_'+k)>3) return 'Já pratiquei bastante este ano.'; m.hobbies=m.hobbies||{}; const antes=hobbyNivel(m.hobbies[k]); m.hobbies[k]=(m.hobbies[k]||0)+1; const nv=hobbyNivel(m.hobbies[k]);
  st('happy',R.int(2,5)); const fx={corrida:()=>st('health',R.int(1,3)),ciclismo:()=>st('health',R.int(1,3)),culinaria:()=>{ for(const p of people().filter(p=>p.alive&&['conjuge','namoro','filho','adot','neto'].includes(p.rel))) p.bond=clamp(p.bond+1); },jardinagem:()=>st('happy',2),fotografia:()=>m.talent.art=clamp((m.talent.art||0)+1),
    marcenaria:()=>{ if(nv>=2){ const v=R.int(100,400)*nv; m.money+=v; } },xadrez:()=>st('smarts',1),pesca:()=>st('happy',2),tricô:()=>{ const p=R.pick(people().filter(p=>p.alive&&p.rel!=='pet')); if(p) p.bond=clamp(p.bond+3); },leitura:()=>st('smarts',1)}[k]; fx&&fx();
  let t=R.pick({corrida:['Corri 5 km sem parar.','Corrida na chuva. Melhor sensação.'],culinaria:['Fiz uma lasanha que a família devorou.','Testei uma receita nova: aprovada.'],jardinagem:['As tomateiras deram os primeiros frutos.','Plantei mudas novas no jardim.'],fotografia:['Fotografei o pôr do sol do alto do morro.','Uma foto minha recebeu muitas curtidas.'],marcenaria:['Fiz uma prateleira para a sala.','Lixei e envernizei uma mesa antiga.'],xadrez:['Ganhei três partidas seguidas no parque.','Estudei uma abertura nova.'],pesca:['Peguei um peixe enorme. E soltei.','Seis horas sem pegar nada. Paz total.'],tricô:['Terminei um cachecol para presentear.','Aprendi um ponto novo.'],ciclismo:['Pedalei 40 km no fim de semana.','Subi a serra de bicicleta.'],leitura:['Terminei um romance enorme.','O clube do livro discutiu até tarde.']}[k]);
  if(nv>antes){ t+=` Subi para o nível ${HOBBY_NIVEIS[nv].toLowerCase()} em ${H[1].toLowerCase()}.`; log(`Agora sou ${HOBBY_NIVEIS[nv].toLowerCase()} em ${H[1].toLowerCase()}.`,'good'); if(nv===4) queue('hobby_torneio',{k}); }
  if(k==='marcenaria'&&nv>=2) t+=' Vendi uma peça.'; return t; }
EVENTS.hobby_torneio={when:m=>!m.prison,prep:()=>({k:R.pick(Object.keys(HOBBIES))}),show:d=>({k:'Hobby',t:`${HOBBIES[d.k][0]} Competição de ${HOBBIES[d.k][1].toLowerCase()}`,x:`Virei referência em ${HOBBIES[d.k][1].toLowerCase()}. Me chamaram para uma competição regional.`,ch:[['Competir com tudo','vai'],['Ir só para me divertir','leve'],['Recusar','nao']]}),
  pick:(k,d)=>{ const m=S.me; if(k==='nao') return 'Prefiro fazer só por prazer.'; const ganha=R.chance(k==='vai'?.55:.3); if(ganha){ const v=R.int(1000,8000); m.money+=v; st('happy',10); m.fame=clamp(m.fame+2); log(`Venci uma competição de ${HOBBIES[d.k][1].toLowerCase()}.`,'good'); return `Primeiro lugar! Troféu e ${fmt(v)} de prêmio.`; } st('happy',4); return 'Não ganhei, mas fiz amigos que amam a mesma coisa que eu.'; }};
// ---------- férias ----------
const FERIAS=[['praia','🏖️','Praia',1],['montanha','🏔️','Montanha e chalé',1.2],['cidade','🏙️','Cidade grande e museus',1.4],['cruzeiro','🛳️','Cruzeiro',2.5]];
EVENTS.ferias={when:m=>!m.prison,show:d=>{ const m=S.me, base=feriasBase(m);
    if(d.e===1) return {k:'Férias',t:'Com quem?',x:'Vou viajar com quem?',ch:[['Sozinh'+oa(),'so']].concat(partners().length?[['Com o meu par','par']]:[]).concat(kids().filter(k=>k.alive).length?[['Com a família toda','fam']]:[]).concat(people('amigo').length?[['Com amigos','amigos']]:[])};
    return {k:'Férias',t:'Tirar férias',x:'Para onde eu vou?',ch:FERIAS.map(f=>[`${f[1]} ${f[2]} (${fmt(Math.round(base*f[3]))})`,f[0]])}; },
  pick:(k,d)=>{ const m=S.me; if(d.e!==1){ queue('ferias',{e:1,dest:k}); return ''; } const F=FERIAS.find(f=>f[0]===d.dest)||FERIAS[0], custo=Math.round(feriasBase(m)*F[3]*(k==='fam'?2:k==='par'||k==='amigos'?1.6:1));
    if(!canPay(custo)) return `Não tenho ${fmt(custo)} para essa viagem. Fica para o ano que vem.`; m.money-=custo; st('happy',R.int(10,16)); st('health',R.int(1,4)); if(m.yr) m.yr.load=0; cnt('ferias');
    const quem=k==='par'?partners():k==='fam'?people().filter(p=>p.alive&&['conjuge','namoro','filho','adot'].includes(p.rel)):k==='amigos'?people('amigo').slice(0,3):[]; quem.forEach(p=>p.bond=clamp(p.bond+8));
    return R.pick({praia:['Areia, sol e água de coco. Voltei outra pessoa.','Uma semana sem olhar o celular.'],montanha:['Fondue, lareira e trilha de manhã.','O silêncio da montanha me curou.'],cidade:['Andei 20 km por dia entre museus e cafés.','Me perdi numa cidade linda, de propósito.'],cruzeiro:['Sete dias no mar, cada noite num show.','Acordei cada dia num porto diferente.']}[d.dest])+(quem.length?' A viagem nos aproximou.':''); }};
const feriasBase=m=>Math.round(Math.max(1500,Math.min(30000,(m.job?jobSalary(m.job):m.ret?m.ret.pension:20000)*.06)));
// ---------- contas do mês ----------
EVENTS.contas_mes={when:m=>!m.prison&&m.age>=18,show:d=>{ const m=S.me;
    const etapas=[['Chegou a fatura do cartão.',[['Pagar o valor total','total'],['Pagar o mínimo e deixar o resto','minimo'],['Parcelar a fatura','parcela']]],
      ['Sobrou um dinheiro no fim do mês.',[['Guardar numa reserva de emergência','reserva'],['Investir em renda fixa','investe'],['Gastar com um mimo','mimo']]],
      ['Os gastos com assinaturas e delivery estão altos.',[['Cortar o que não uso','corta'],['Manter tudo','mantem'],['Assinar mais um serviço','mais']]]];
    const e=etapas[d.e||0]; return {k:'Dinheiro',t:`💳 Fechar as contas · ${(d.e||0)+1} de 3`,x:e[0],ch:e[1]}; },
  pick:(k,d)=>{ const m=S.me, base=Math.max(500,Math.round((m.job?jobSalary(m.job):m.ret?m.ret.pension:12000)/12)); let pts=d.pts||0, t='';
    const ef={total:[2,'Fatura quitada. Sem juros.'],minimo:[-2,'Os juros do rotativo vão doer.'],parcela:[0,'Parcelei. Juros menores, mas mais um mês preso.'],reserva:[2,'Reserva de emergência crescendo.'],investe:[2,'O dinheiro já está rendendo.'],mimo:[0,'Comprei algo que eu queria há tempos.'],corta:[2,'Cortei três assinaturas que eu nem lembrava.'],mantem:[0,'Mantive tudo como está.'],mais:[-1,'Mais uma assinatura para a coleção.']}[k];
    pts+=ef[0]; t=ef[1]; if(k==='minimo') m.money-=Math.round(base*.15); if(k==='mimo') st('happy',4); if(k==='investe') m.money+=Math.round(base*.03);
    if((d.e||0)<2){ queue('contas_mes',{e:(d.e||0)+1,pts}); return t; }
    const ganho=Math.max(0,pts)*Math.round(base*.08); m.money+=ganho; m.c.contasEmDia=(m.c.contasEmDia||0)+(pts>=4?1:0); st('happy',pts>=4?4:pts<0?-3:1);
    return t+(pts>=4?` Mês fechado no azul: ${fmt(ganho)} a mais no bolso.`:pts>=1?` Mês razoável: sobrou ${fmt(ganho)}.`:' O mês fechou apertado. Mês que vem eu me organizo.'); }};
// ---------- churrasco com os amigos ----------
EVENTS.churrasco={when:m=>!m.prison&&m.age>=16,show:()=>({k:'Amigos',t:'🍖 Encontro com os amigos',x:`Juntei ${people('amigo').filter(p=>p.alive).length||'uns'} amigos em casa. O que vai ter?`,ch:[['Churrasco no quintal','churras'],['Noite de jogos de tabuleiro','jogos'],['Assistir ao jogo juntos','jogo'],['Cada um traz um prato','prato']]}),
  pick:k=>{ const m=S.me, am=people('amigo').filter(p=>p.alive); const custo={churras:300,jogos:60,jogo:120,prato:40}[k]; m.money-=Math.min(Math.max(0,m.money),custo); am.forEach(p=>p.bond=clamp(p.bond+R.int(4,8))); st('happy',R.int(6,10));
    return {churras:'A picanha passou do ponto, ninguém ligou. Rimos até de madrugada.',jogos:'Quase terminamos amizades por causa do Banco Imobiliário. Quase.',jogo:'Gritamos, choramos e comemos pipoca. Que jogo!',prato:'Cada prato melhor que o outro. Virou tradição.'}[k]+(am.length?` ${am.length} amigo${am.length>1?'s':''} mais próximos.`:''); }};
// ---------- crise dos 40 ----------
EVENTS.crise40={when:m=>m.age>=38&&m.age<=55&&!m.prison,show:()=>({k:'Vida',t:'Crise de meia-idade',x:'Acordei e pensei: "É isso? É assim até o fim?" Bateu uma vontade enorme de mudar alguma coisa.',ch:[['Comprar uma moto','moto'],['Fazer uma tatuagem','tattoo'],['Correr uma maratona','maratona'],['Voltar a estudar','estudo'],['Fazer terapia','terapia']]}),
  pick:k=>{ const m=S.me; m.c.crise40=1;
    if(k==='moto'){ const v=25000; if(!canPay(v)) return 'Fui até a loja de motos e voltei a pé. Pelo menos sonhei.'; m.money-=v; m.assets.push({id:newId(),k:'carro',n:'Moto esportiva',value:v,cond:100,buy:v,ic:'🏍️'}); st('happy',10); return 'Comprei uma moto vermelha. O vento na cara resolveu metade da crise.'; }
    if(k==='tattoo'){ st('happy',6); m.looks=clamp(m.looks+1); return 'Tatuei uma frase que eu repetia aos vinte anos. Doeu. Valeu.'; }
    if(k==='maratona'){ st('health',6); st('happy',8); m.talent.athletic=clamp((m.talent.athletic||0)+4); log('Completei uma maratona.','good'); return 'Seis meses de treino e 42 km depois, cruzei a linha de chegada chorando.'; }
    if(k==='estudo'){ st('smarts',4); st('happy',5); return 'Me matriculei num curso noturno. Sou o mais velho da turma, e o mais animado.'; }
    st('happy',6); return 'Na terapia descobri que a crise era cansaço. E que ainda dá tempo de muita coisa.'; }};
// ---------- lista de desejos ----------
const DESEJOS=[['viagem','✈️','Conhecer outro continente',15000,40],['paraquedas','🪂','Saltar de paraquedas',2500,55],['memorias','📖','Escrever as minhas memórias',0,0],['reencontro','🤝','Reencontrar um velho amigo',300,0],['cidade','🏡','Visitar a cidade onde nasci',1500,0],['aprender','🎹','Aprender a tocar um instrumento',800,0],['neto','🎓','Ver um neto se formar',0,0],['mar','🌊','Nadar no mar de novo',500,30],['aurora','🌌','Ver a aurora boreal',20000,40],['festa','🎉','Juntar a família inteira numa festa',3000,0]];
function desejos(m){ m=m||S.me; if(!m.desejos){ m.desejos=R.shuffle(DESEJOS.map(d=>d[0])).slice(0,5).map(id=>({id,ok:0})); } return m.desejos; }
function desejoRealizar(id){ const m=S.me, D=DESEJOS.find(d=>d[0]===id), w=desejos(m).find(x=>x.id===id); if(!D||!w) return ''; if(w.ok) return 'Já realizei esse desejo.';
  if(D[4]&&m.health<D[4]) return `Minha saúde precisa estar em ${D[4]}% para isso. Hoje está em ${m.health}%.`;
  if(id==='neto'){ const n=people('neto').find(p=>p.alive&&p.age>=22); if(!n) return 'Nenhum neto se formou ainda. Vou esperar com paciência.'; }
  if(id==='reencontro'&&!people().some(p=>p.alive&&['amigo','ex','colega','colegaT'].includes(p.rel))) return 'Preciso lembrar de alguém para reencontrar.';
  if(id==='memorias'&&(m.memorias||0)<3) return `Ainda estou escrevendo (${m.memorias||0} de 3 capítulos). Escrevo um por ano.`;
  if(D[3]&&!canPay(D[3])) return `Preciso de ${fmt(D[3])} para isso.`; m.money-=D[3]; w.ok=1; st('happy',15); cnt('desejos');
  const feitos=desejos(m).filter(x=>x.ok).length; log(`Realizei um desejo da lista: ${D[2].toLowerCase()} (${feitos} de 5).`,'good');
  if(id==='festa') people().filter(p=>p.alive&&p.rel!=='pet').forEach(p=>p.bond=clamp(p.bond+4)); if(id==='reencontro'){ const p=R.pick(people().filter(p=>p.alive&&['amigo','ex','colega','colegaT'].includes(p.rel))); if(p) p.bond=clamp(p.bond+20); }
  if(id==='memorias'){ m.fame=clamp(m.fame+3); m.money+=R.int(2000,15000); }
  const txt={viagem:'Pisei em outro continente. Chorei no avião de volta.',paraquedas:'Gritei os primeiros cinco segundos. Depois, só paz.',memorias:'O livro saiu! A família leu de uma vez, e até vendeu na livraria do bairro.',reencontro:'Nos reencontramos depois de décadas. Parecia que tinha sido ontem.',cidade:'Andei pelas ruas da minha infância. A padaria ainda existe.',aprender:'Toquei uma música inteira para a família. Errei duas notas. Ninguém ligou.',neto:'Vi meu neto receber o diploma. Fui quem mais aplaudiu.',mar:'Entrei no mar como quem volta para casa.',aurora:'O céu dançou em verde e roxo. Valeu cada centavo.',festa:'Quatro gerações na mesma mesa. Foto para a eternidade.'}[id];
  return txt+(feitos===5?' Completei a minha lista de desejos inteira!':''); }
// ---------- netos ----------
const HISTORIAS=[['Uma aventura de piratas','aventura'],['A história de quando eu era criança','família'],['Um conto de assombração','terror'],['Uma lenda do folclore','lenda']];
EVENTS.historia_neto={when:m=>!m.prison,prep:m=>{ const n=people('neto').find(p=>p.alive&&p.age<=14); return n?{pid:n.id}:null; },
  show:d=>{ const n=P(d.pid); return {k:'Família',t:'Hora da história',x:`${n.first} subiu no meu colo pedindo uma história.`,ch:HISTORIAS.map(h=>[h[0],h[1]])}; },
  pick:(k,d)=>{ const n=P(d.pid); if(!n) return ''; const gosta={aventura:n.id%4===0,família:n.id%4===1,terror:n.id%4===2,lenda:n.id%4===3}[k]; n.bond=clamp(n.bond+(gosta?10:4)); st('happy',gosta?8:4);
    return gosta?`${n.first} ficou de olhos arregalados até o fim e pediu para contar de novo amanhã.`:`${n.first} dormiu na metade. Missão cumprida, de certa forma.`; }};
function netoAcao(n,k){ const m=S.me; if(use('neto_'+k+n.id)>1) return 'Já fizemos isso este ano.';
  if(k==='historia'){ queue('historia_neto',{pid:n.id}); return ''; }
  if(k==='mesada'){ const v=n.age<12?50:200; if(!canPay(v)) return 'Estou sem dinheiro para mesada.'; m.money-=v; n.bond=clamp(n.bond+5); return `Dei ${fmt(v)} escondido dos pais. Segredo nosso.`; }
  if(k==='receita'){ n.bond=clamp(n.bond+7); st('happy',5); return `Ensinei ${n.first} a fazer o bolo da família. A cozinha virou um campo de batalha de farinha.`; }
  n.bond=clamp(n.bond+6); st('health',1); return `Levei ${n.first} ao parque. ${n.age<10?'Empurrei o balanço até cansar o braço.':'Conversamos o caminho inteiro.'}`; }
// ---------- memórias e reencontros ----------
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m||!m.alive||m.prison||S.scen) return;
  if(m.age>=60&&m.escrevendo&&(m.memorias||0)<3){ m.memorias=(m.memorias||0)+1; log(`Escrevi mais um capítulo das minhas memórias (${m.memorias} de 3).`); }
  if(m.age>=38&&m.age<=55&&!m.c.crise40&&R.chance(.12)) queue('crise40',{});
  if(m.age>=65&&R.chance(.12)) queue('reencontro_velho',{});
  if(m.age>=65) desejos(m); });
EVENTS.reencontro_velho={when:m=>m.age>=60&&!m.prison,show:()=>({k:'Memórias',t:'Um nome do passado',x:`Recebi uma mensagem: é ${R.pick(['um colega da escola','a minha primeira chefe','um amigo de infância','um vizinho da rua onde cresci'])}, que achou meu contato depois de cinquenta anos.`,ch:[['Marcar um café','cafe'],['Trocar mensagens só','msg'],['Deixar o passado no passado','nao']]}),
  pick:k=>{ const m=S.me; if(k==='nao') return 'Algumas portas é melhor deixar fechadas.'; if(k==='msg'){ st('happy',3); return 'Trocamos mensagens a semana inteira, lembrando de tudo.'; }
    const p=mkPerson({rel:'amigo',age:m.age+R.int(-2,2),bond:70}); S.people.push(p); st('happy',8); return `Tomamos um café de três horas. ${p.first} virou amigo de novo, como se nunca tivesse ido embora.`; }};
// ---------- telas ----------
V.vidaAdulta=()=>{ const m=S.me, it=[]; const A=(ic,l,s,fn,extra)=>it.push(Object.assign({ic,l,s,on:()=>act(fn,l)},extra||{}));
  it.push({sec:'Rotina'});
  A('🏖️','Tirar férias','Destino e companhia · descansa de verdade',()=>{ if(use('ferias')>0) return 'Já tirei férias este ano.'; queue('ferias',{e:0}); return ''; });
  if(m.age>=18) A('💳','Fechar as contas do mês','Três decisões rápidas · dinheiro e tranquilidade',()=>{ if(use('contas')>1) return 'Já organizei as contas este ano.'; queue('contas_mes',{e:0,pts:0}); return ''; });
  if(m.age>=16) A('🍖','Juntar os amigos em casa','Churrasco, jogos, futebol',()=>{ if(use('churras')>1) return 'Já fizemos encontros demais este ano.'; queue('churrasco',{}); return ''; });
  A('🩺','Fazer um check-up','Descobre doenças no começo',checkup);
  it.push({sec:'Hobbies'}); m.hobbies=m.hobbies||{};
  for(const [k,H] of Object.entries(HOBBIES)) it.push({ic:H[0],l:H[1],s:`${HOBBY_NIVEIS[hobbyNivel(m.hobbies[k])]}${m.hobbies[k]?` · ${m.hobbies[k]} prática(s)`:''} · ${H[2]}`,r:hobbyNivel(m.hobbies[k])===4?'Mestre':'',on:()=>act(()=>hobbyPraticar(k),H[1])});
  if(m.age>=60){ it.push({sec:'Melhor idade'});
    const ds=desejos(m); it.push({html:`<div class="card"><p><b>Lista de desejos</b> · ${ds.filter(x=>x.ok).length} de 5</p></div>`});
    ds.forEach(w=>{ const D=DESEJOS.find(d=>d[0]===w.id); it.push({ic:w.ok?'✅':D[1],l:D[2],s:w.ok?'Realizado':`${D[3]?fmt(D[3]):'Sem custo'}${D[4]?` · saúde ${D[4]}%+`:''}`,tone:w.ok?'good':'',on:()=>act(()=>desejoRealizar(w.id),'Lista de desejos')}); });
    if(!m.escrevendo) A('✍️','Começar a escrever as memórias','Um capítulo por ano',()=>{ m.escrevendo=1; return 'Comprei um caderno bonito e escrevi a primeira frase: "Tudo começou numa manhã de…"'; });
    A('💃','Baile da terceira idade','Dançar com alguém · minigame de ritmo',()=>{ if(use('baile')>2) return 'Já fui a bailes demais este ano.'; const gente=people().filter(p=>p.alive&&p.rel!=='pet'&&p.age>=55&&!['filho','adot','neto','irmao'].includes(p.rel)).slice(0,3); queue('festa_danca',{e:0,gente:gente.map(p=>p.id),kid:0}); return ''; });
    for(const n of people('neto').filter(p=>p.alive)){ it.push({sec:'Neto: '+n.first}); if(n.age<=14) A('📖','Contar uma história','Acertar o tipo de história que ele ama',()=>netoAcao(n,'historia')); A('💵','Dar uma mesada escondido','',()=>netoAcao(n,'mesada')); A('🎂','Ensinar uma receita de família','',()=>netoAcao(n,'receita')); A('🌳','Levar para passear','',()=>netoAcao(n,'parque')); } }
  return {title:m.age>=60?'Vida e melhor idade':'Vida adulta',items:it}; };
V.activities=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(m.prison||!r||!r.items||m.age<16) return r; const ds=m.age>=60?desejos(m):null;
  r.items.splice(Math.min(2,r.items.length),0,{ic:m.age>=60?'🌅':'🏡',l:m.age>=60?'Vida e melhor idade':'Vida adulta',s:m.age>=60?`Lista de desejos ${ds.filter(x=>x.ok).length}/5 · netos · hobbies · baile`:'Férias, contas, hobbies, amigos, check-up',on:()=>UI.push(V.vidaAdulta)}); return r; })(V.activities);
// eventos da vida adulta e da velhice
pack({k:'Vida',w:1,cd:7,min:28,max:64,when:m=>!m.prison},[
  ['Reunião de condomínio','A reunião de condomínio vai decidir uma obra cara.',['Participar e propor um meio-termo|?sm h+3|Minha proposta foi aprovada. Virei quase síndic{o}.|h-3|Três horas de gritaria.','Não ir|$-v|Aprovaram a obra mais cara. A conta chegou.'],{v:[200,1500]}],
  ['Exaustão','Você percebe que não lembra a última vez que descansou de verdade.',['Tirar um fim de semana só para mim|h+8 hl+2|Dormi, li, cozinhei. Renasci.','Seguir no ritmo|hl-3 h-4|Segui. O corpo vai cobrar.']],
  ['Amigo de longa data','Um amigo de vinte anos liga só para saber como você está.',['Conversar por horas|h+6|Algumas amizades atravessam tudo.','Responder rápido|h+0|Prometi ligar depois.']],
  ['Curso livre','Abriu um curso noturno de algo que você sempre quis aprender.',['Me matricular|$-v sm+2 h+5|Duas noites por semana só para mim.','Deixar para depois|h-1|Um dia.'],{v:[300,1500]}],
  ['Vizinho barulhento','O vizinho de cima faz festa toda sexta até as três da manhã.',['Conversar com educação|?lk h+2|Ele pediu desculpas e baixou o som.|h-3|Ele riu e aumentou.','Reclamar com o síndico|h+1|Multaram o vizinho.']],
]);
pack({k:'Velhice',w:1.1,cd:6,min:65,when:m=>!m.prison},[
  ['Esqueci onde deixei os óculos','Procurei os óculos a manhã inteira. Estavam na minha cabeça.',['Rir de mim mesm{o}|h+4|Rir é o melhor remédio.','Marcar uma consulta para a memória|$-v h+1|O médico disse que é normal da idade.'],{v:[200,600]}],
  ['Celular novo','Os filhos me deram um celular novo cheio de botões.',['Pedir para o neto ensinar|h+4|Agora mando figurinhas no grupo da família.','Guardar na caixa|h-1|O velho ainda funciona.']],
  ['Caminhada no parque','O médico recomendou caminhar todo dia.',['Caminhar com um grupo do bairro|hl+4 h+5|Fiz amigos e perdi dois quilos.','Caminhar sozinh{o}|hl+3|Meia hora de paz por dia.']],
  ['Golpe por telefone','Uma voz diz ser do banco e pede a sua senha para "proteger a conta".',['Desligar e ligar para o banco|h+2|Era golpe. O banco agradeceu.','Passar a senha|$-v h-10|Era golpe. Limparam a minha conta.'],{v:[1000,8000]}],
  ['Coral da igreja','O coral da comunidade precisa de vozes.',['Entrar no coral|h+6|Ensaios toda quinta e uma apresentação no Natal.','Assistir da plateia|h+2|Aplaudi de pé.']],
  ['Saudade','Você encontrou uma caixa de fotos antigas no armário.',['Mostrar para a família|h+5|Cada foto virou uma história no almoço de domingo.','Ver sozinh{o}|h+1|Chorei um pouco. De saudade boa.']],
]);
