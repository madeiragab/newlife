// ===== Voltar de um modo fictício tem preço: quanto mais tempo longe, mais a vida real sente =====
const voltaTempo=d=>d<30?`${d} ${d===1?'dia':'dias'}`:d<365?`${Math.round(d/30)} ${Math.round(d/30)===1?'mês':'meses'}`:`${Math.round(d/365)} ${Math.round(d/365)===1?'ano':'anos'}`;
const VOLTA_ONDE={zumbi:'no apocalipse',ilha:'na ilha',isekai:'em Eldoria',marte:'em Marte'};
function voltaConseq(id,d,win,junto){ junto=junto||[]; const m=S.me, L=[], adult=m.age>=18, onde=VOLTA_ONDE[id]||'longe';
  // trabalho
  if(m.job&&!m.job.hero){ const co=m.job.co||'a empresa'; m.job.perf=clamp(m.job.perf-Math.min(45,Math.round(d*1.3)));
    const fire=d>=180?1:Math.min(.92,Math.max(0,(d-7)/34)+(m.job.perf<25?.15:0));
    if(R.chance(fire)){ let t='meu cargo'; try{ t=jobTitle(m.job)||t; }catch(e){} endJob(); st('happy',-10); cnt('demitidoMundo');
      L.push('💼 '+R.pick([`Fui demitid${oa()} por abandono de emprego. ${voltaTempo(d)} sem aparecer e sem atestado.`,`Quando voltei, meu crachá não abria mais a catraca. ${co} me demitiu.`,`O RH me mandou ${R.int(9,40)} e-mails. O último dizia: "desligamento por justa causa".`,`Alguém já estava sentado na minha mesa. Perdi o cargo de ${t.toLowerCase()}.`]));
      log(`Perdi o emprego por ter passado ${d} dias ${onde}.`,'bad'); }
    else if(d>=4) L.push('💼 '+R.pick([`Meu chefe me deu uma advertência por escrito. Meu desempenho despencou.`,`Inventei uma doença rara para explicar o sumiço. Ninguém acreditou, mas não me demitiram.`,`Voltei ao trabalho com ${R.int(200,900)} e-mails não lidos e uma advertência.`]));
    else L.push('💼 Ninguém no trabalho percebeu que eu tinha sumido. Isso é bom ou ruim?'); }
  // estudos
  if(m.edu.cur){ const cur=m.edu.cur; cur.grade=clamp(cur.grade-Math.min(45,Math.round(d*1.2)));
    if(d>=25&&!['fund','medio'].includes(cur.type)&&R.chance(Math.min(.6,(d-20)/60))){ m.edu.cur=null; st('happy',-8); L.push('🎓 A faculdade cancelou minha matrícula por abandono. Vou ter que começar de novo um dia.'); log('Perdi a vaga na faculdade por abandono.','bad'); }
    else if(d>=10) L.push('🎓 '+R.pick(['Reprovei por falta em quase todas as matérias. Minhas notas foram para o chão.','A diretoria chamou meus responsáveis para explicar as faltas. Minhas notas despencaram.','Perdi todas as provas do bimestre. Vai ser difícil recuperar.']));
    else if(d>=3) L.push('📚 Perdi umas aulas e minhas notas caíram um pouco.'); }
  // cargo político
  if(m.office){ m.office.appr=clamp(m.office.appr-Math.min(40,d)); if(d>=5) L.push(`🏛️ A imprensa descobriu que sumi por ${d} dias. Minha aprovação caiu.`); }
  // relacionamento
  const p=partner();
  if(p&&junto.includes(p.id)) L.push(`❤️ ${p.first} viveu tudo isso comigo. Agora a gente tem uma história que ninguém mais acredita.`);
  else if(p){ const tempo=voltaTempo(d), casado=p.rel==='conjuge';
    p.bond=clamp(p.bond-Math.min(60,Math.round(d*.8)));
    let ch=p.rel==='namoro'?(d-4)/40:p.rel==='noivo'?(d-6)/55:(d-10)/90; if(p.bond<30) ch+=.2; if(d>=365) ch=.95; ch=Math.max(0,Math.min(.97,ch));
    if(d>=4&&R.chance(ch)){ cnt('terminoMundo');
      const txt=d<30?R.pick([`${p.first} terminou comigo por mensagem no terceiro dia sem resposta. Só li agora.`,`${p.first} achou que eu tinha ${R.pick(['fugido com alguém','me cansado','ido embora de vez'])}. Quando voltei, já era ex.`,`Encontrei minhas coisas em caixas na porta. Um bilhete de ${p.first}: "Nem um recado em ${tempo}?"`])
        :d<180?R.pick([`${p.first} esperou um tempo, chorou outro tanto e seguiu a vida. Quando voltei, já estava com outra pessoa.`,`${p.first} se mudou de cidade e trocou de número. Ninguém quis me dar o endereço.`,`Fiquei ${tempo} sumid${oa()}. ${p.first} me olhou como se visse um fantasma e disse: "Agora não dá mais."`])
        :R.pick([`Fiquei ${tempo} sumid${oa()}. ${p.first} achou que eu tinha morrido e ${casado?'casou de novo':'casou com outra pessoa'}. Tem até um bebê.`,`${p.first} guardou luto por mim. Depois refez a vida. Quando bati na porta, quem atendeu foi o novo amor de ${p.first}.`,`Para ${p.first}, eu estava mort${oa()}. Teve velório, teve choro, e depois teve outra pessoa.`]);
      if(casado){ divorce(p,true); L.push('💔 '+txt+' O divórcio saiu por abandono do lar.'); }
      else { p.rel='ex'; st('happy',-15); log(`${p.first} terminou comigo enquanto eu estava ${onde}.`,'bad'); L.push('💔 '+txt); } }
    else if(d>=60){ p.bond=clamp(p.bond+15); L.push('❤️ '+R.pick([`${p.first} esperou ${tempo} sem desistir. Quando me viu, não disse nada: só me abraçou.`,`Todo mundo mandou ${p.first} seguir em frente. ${p.first} não seguiu. Esperou.`])); }
    else if(d>=5) L.push('❤️ '+R.pick([`${p.first} chorou, gritou e depois me abraçou por um tempão.`,`${p.first} me deu um gelo de uma semana. Justo.`,`${p.first} quer saber onde eu estava. Não sei como contar.`])); }
  // família
  const ps=parents();
  if(ps.length&&ps.every(x=>junto.includes(x.id))) L.push('👪 Minha família inteira voltou comigo. Os vizinhos olham para a gente como se fôssemos fantasmas.');
  else if(ps.length&&d>=3){ ps.forEach(x=>x.bond=clamp(x.bond+(R.chance(.5)?5:-5)));
    L.push('👪 '+(m.age<18?R.pick(['Meus pais tinham colado cartazes com a minha foto pela cidade. Fiquei de castigo até não sei quando.','Minha mãe desmaiou quando me viu entrar pela porta. Depois veio o castigo.']):R.pick(['Meus pais tinham feito um boletim de ocorrência de desaparecimento.','Minha mãe acendeu velas na igreja todos os dias em que eu estive fora.','Meu pai envelheceu dez anos nesses dias. Me abraçou sem dizer nada.'])));
    if(d>=15){ m.fame=clamp(m.fame+3); L.push('📺 Meu sumiço tinha aparecido no jornal local.'); }
    if(d>=180) L.push(`⚰️ Fui declarad${oa()} mort${oa()}. Teve até velório com caixão vazio. Desfazer isso no cartório vai dar trabalho.`); }
  // amigos e bichos
  people('amigo').forEach(f=>{ f.bond=clamp(f.bond-Math.min(20,Math.round(d*.3))); });
  const pets=people('pet'); if(pets.length&&d>=12){ const pt=R.pick(pets);
    if(R.chance(Math.min(.5,d/80))&&!ps.length){ pt.alive=false; L.push(`🐾 ${pt.first} fugiu de casa enquanto eu estava fora. Nunca mais apareceu.`); log(`${pt.first} fugiu enquanto eu estava ${onde}.`,'bad'); st('happy',-10); }
    else L.push(`🐾 ${pt.first} ${ps.length?'ficou com a minha família':'foi cuidado por um vizinho'} e quase não me reconheceu.`); }
  // contas
  if(adult&&d>=5){ const v=Math.round(d*R.int(40,110)/10)*10; m.money-=v; L.push(`🧾 Contas atrasadas, multa e juros: ${fmt(v)}.`); }
  // ninguém acredita
  if(win&&R.chance(.6)) L.push('🗣️ '+R.pick(['Tentei contar a verdade. Riram de mim.','Contei tudo para um amigo. Ele me indicou um psicólogo.','Ninguém acredita onde eu estive. Às vezes nem eu.']));
  st('happy',-Math.min(10,Math.floor(d/6)));
  return L; }
scenEnd=(o=>function(win,txt){ const sc=S.scen, id=sc&&sc.id, d=sc?sc.dia:0, junto=(sc&&sc.junto||[]).filter(pid=>sc.crew.some(c=>c.pid===pid)); const r=o.apply(this,arguments);
  if(id&&id!=='heroi'&&!S.scen&&S.me.alive){ const L=voltaConseq(id,d,win,junto); if(junto.length) L.unshift(`🧳 Voltaram comigo: ${junto.map(P).filter(Boolean).map(p=>p.first).join(', ')}.`); if(L.length) MQ.push({k:'Vida real',t:'De volta à vida real',x:`Passei ${voltaTempo(d)} ${VOLTA_ONDE[id]||'longe'}. A vida aqui não parou.\n\n${L.join('\n\n')}`}); }
  return r; })(scenEnd);
