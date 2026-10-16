// ===== Ações do jogador =====
function arrest(crime,min,max){
  const m=S.me; m.rec.arrests++;
  queue('julgamento',{c:crime,min,max});
}
function trial(k,d){
  const m=S.me; let note='';
  const cost={p:0,c:8000,e:60000,g:0}[k]; if(cost&&!canPay(cost)){ k='p'; note='Não tinha dinheiro para esse advogado, então fiquei com o defensor público. '; } else m.money-=cost;
  const sev=Math.min(1,(d.max||1)/30);
  const pFree={p:.18,c:.38,e:.62,g:0}[k]*(1-.65*sev)+(m.age<18?.1:0)-(m.rec.conv*.06)-(d.evid?.15:0);
  if(R.chance(Math.max(.02,pFree))){ st('happy',10); return note+R.pick(['O juiz me absolveu! Saí livre do tribunal.','Fui absolvid'+oa()+' por falta de provas. Estou livre.','O júri me considerou inocente. Voltei para casa.']); }
  m.rec.conv++;
  let yrs=R.int(d.min,d.max); if(k==='g') yrs=Math.floor(yrs/2); if(m.age<18) yrs=Math.min(yrs,3);
  if(yrs<=0){ const f=R.int(5,40)*100; m.money-=f; return note+`Fui condenad${oa()} a pagar ${fmt(f)} de multa e prestar serviço comunitário.`; }
  m.prison={left:yrs,total:yrs,served:0,behav:50,crime:d.c,juv:m.age<18}; m.c.fugitive=0;
  if(m.job){ log(`Fui ${m.gender==='F'?'demitida':'demitido'} ${m.job.spc?'da carreira de '+jobTitle(m.job).toLowerCase():'da '+m.job.co} por causa da prisão.`,'bad'); }
  if(m.edu.cur&&!m.prison.juv){ log(`Perdi a vaga ${eduOf(m.edu.cur)} por causa da prisão.`,'bad'); m.edu.cur=null; m.edu.club=null; }
  endJob(); m.office=null; S.flags.movedOut=1;
  if(m.c.pres) m.c.prisonAfterPres=1; if(m.royal&&!m.royal.abd){ m.royal.pop=clamp(m.royal.pop-30); }
  for(const prt of partners()){ if(R.chance(.4)){ if(prt.rel==='conjuge') divorce(prt,true); else { prt.rel='ex'; log(`${prt.first} terminou comigo depois da condenação.`,'bad'); } } }
  st('happy',-30);
  return note+`Fui condenad${oa()} a ${yrs} ${yrs>1?'anos':'ano'} de ${m.age<18?'internação numa unidade socioeducativa':'prisão'}.`;
}
function retire(){ const m=S.me; const yrs=m.hist.reduce((s,h)=>s+h.yrs,0)+(m.job?m.job.yrs:0); const last=m.job?jobSalary(m.job):10000; m.ret={pension:Math.max(9000,Math.round(last*.55*Math.min(1,yrs/30)))}; endJob(); st('happy',10); }

// ---------- escola / faculdade ----------
function study(){ const m=S.me,c=m.edu.cur; if(!c) return 'Não estou estudando agora.'; const n=use('study'); if(n>3) return 'Já estudei demais este ano. Minha cabeça não aguenta mais.'; m.c.studyYr=(m.c.studyYr||0)+1; st('smarts',R.int(0,2)); st('happy',-1); return R.pick(['Passei horas na biblioteca.','Fiz todos os exercícios do livro.','Montei um grupo de estudos.','Revisei a matéria até tarde.']); }
function skipClass(){ const m=S.me,c=m.edu.cur; if(!c) return 'Não estou estudando agora.'; use('skip'); st('happy',R.int(2,6)); c.grade=clamp(c.grade-R.int(2,6)); if(R.chance(.25)){ parents().forEach(p=>p.bond=clamp(p.bond-6)); return 'A escola ligou para os meus pais. Fiquei de castigo.'; } return R.pick(['Matei aula e fui ao shopping.','Passei a tarde na praça.','Fui ao fliperama em vez da aula.']); }
function talkTeacher(){ const m=S.me; if(!m.edu.cur) return 'Não estou estudando agora.'; if(use('teacher')>2) return 'O professor já está fugindo de mim.'; m.edu.cur.grade=clamp(m.edu.cur.grade+R.int(0,4)); return R.pick(['O professor me deu dicas para a prova.','Conversamos sobre carreira.','O professor disse que tenho potencial.']); }
function joinClub(c){ const m=S.me; m.edu.club=c.n; m.edu.clubLvl=0; m.edu.clubPerf=50; if(c.st==='smarts') st('smarts',R.int(2,5)); else m.talent[c.st]=clamp(m.talent[c.st]+R.int(4,10)); if(c.hl) st('health',c.hl); st('happy',4); return `Entrei no ${c.n.toLowerCase()}.`; }
function dropOut(){ const m=S.me,c=m.edu.cur; m.edu.cur=null; m.edu.club=null; log(`Larguei os estudos ${eduOf(c)}.`,'warn'); parents().forEach(p=>p.bond=clamp(p.bond-12)); if(c.type==='fund'||c.type==='medio') S.people.filter(p=>p.rel==='colega').forEach(p=>p.alive=false); return `Larguei os estudos ${eduOf(c)}.`; }
// Nota do vestibular (0 a 100, mostrada de 0 a 1000): boletim do ensino médio + inteligência + cursinho + simulados + olimpíadas. Nada de sorte.
// Histórico escolar: cada ano conta, do 1º ano do fundamental ao 3º do médio (fundamental 1 pesa 1, fundamental 2 pesa 1,5, médio pesa 2,5)
const HIST_W={f1:1,f2:1.5,m:2.5};
function schoolAvg(m,t){ const h=(m.edu.hist||[]).filter(x=>!t||x.t===t); if(!h.length) return null; let s=0,w=0; for(const x of h){ const k=t?1:HIST_W[x.t]; s+=x.g*k; w+=k; } return s/w; }
function examScore(m){ m=m||S.me; const g=schoolAvg(m)??m.edu.nota??(m.edu.cur&&m.edu.cur.type==='medio'?m.edu.cur.grade:15+m.smarts*.7);
  return Math.round(clamp(g*.55+m.smarts*.45+Math.min(3,m.c.cursinho||0)*4+Math.min(6,m.c.simBonus||0)+Math.min(4,(m.c.olimp||0)*2))); }
const cutOf=c=>Math.round(40+c.sm*.55), privMin=c=>Math.round(c.sm*.6);
const pts=n=>`${n*10}`;
function enroll(kind,item,mode,pay,disc=0){
  const m=S.me;
  if(m.prison) return `Não dá para me matricular estando pres${oa()}.`;
  if(kind==='uni'&&!hasDeg('medio')) return 'Preciso terminar o ensino médio antes de entrar na faculdade.';
  if(kind==='tec'&&!hasDeg('fund')) return 'Preciso terminar pelo menos o ensino fundamental antes.';
  if(m.edu.cur) return 'Preciso terminar o curso atual primeiro.';
  if(kind==='uni'){
    const pub=mode==='publica', sc=examScore(m), need=pub?cutOf(item):privMin(item);
    if(sc<need){ st('happy',-5); return pub?`Tirei ${pts(sc)} no vestibular. A nota de corte de ${item.n} na pública é ${pts(need)}. Não deu.`:`Tirei ${pts(sc)} no vestibular e a nota mínima de ${item.n} é ${pts(need)}. Não fui ${m.gender==='F'?'aceita':'aceito'}.`; }
    const cost=pub?0:Math.round(item.cost*(1-disc));
    m.edu.cur={type:'uni',id:item.id,n:item.n,len:item.yrs,yr:0,grade:clamp(15+m.smarts*.7),cost,pay:pub||!cost?null:pay,pub,bolsa:disc||0};
    log(`Entrei na faculdade de ${item.n}${pub?' (universidade pública)':disc>=1?' com bolsa integral':disc?' com bolsa de '+Math.round(disc*100)+'%':''}!`,'good'); st('happy',12);
    return `Passei com ${pts(sc)} pontos! Vou estudar ${item.n}${pub?' de graça numa universidade pública':disc>=1?' com bolsa integral':''}.`;
  }
  if(kind==='tec'){ const cost=Math.round(item.cost*(1-disc)); m.edu.cur={type:'tec',id:item.id,n:item.n,len:item.yrs,yr:0,grade:clamp(m.smarts*.7+15),cost,pay:cost?pay:null}; log(`Comecei o curso de ${item.n}.`); return `Matrícula feita em ${item.n}.`; }
  if(kind==='post'){
    if(m.smarts<item.sm-5) return `A seleção de ${item.n} pede mais preparo. Preciso estudar mais antes de tentar.`;
    m.edu.cur={type:'post',id:item.id,n:item.n,len:item.yrs,yr:0,grade:clamp(m.smarts*.8),cost:Math.round(item.cost*(1-disc)),pay:disc>=1?null:pay}; log(`Comecei ${item.n}.`,'good');
    if(item.id==='res'){ m.money+=0; }
    return `Fui ${m.gender==='F'?'aprovada':'aprovado'} para ${item.n}!`;
  }
}
// Formas de pagar o curso: sem sorteio, tudo depende de dinheiro, nota ou talento treinado
function payOptions(cost,ctx){
  const m=S.me,ps=parents(), fam=ps.reduce((s,p)=>s+Math.max(0,p.money),0), sc=examScore(m), uni=ctx&&ctx.kind==='uni';
  // capitão/titular de time (ou solista/destaque na banda, coral, teatro) precisa de menos talento para a bolsa
  const needS=m.c.capSport?55:m.c.titSport?62:70, needA=m.c.capArt?55:m.c.titArt?62:70;
  const sport=m.talent.athletic>=needS&&((m.c.pSport||0)>=3||!!(m.job&&m.job.spc==='atleta'));
  const music=m.talent.musical>=needA&&((m.c.pMusic||0)>=3||!!(m.job&&m.job.spc==='musico')), art=Math.max(m.talent.art||0,m.talent.dance||0)>=needA&&((m.c.pArt||0)>=3||!!m.c.titArt);
  const o=[{k:'pais',ic:'👪',l:'Minha família paga',s:!ps.length?'Não tenho pais para pagar':fam>=cost*2?`A família tem ${fmt(fam)} guardados`:`A família tem ${fmt(fam)}; precisaria de ${fmt(cost*2)}`,ok:ps.length>0&&fam>=cost*2,why:'Minha família não tem dinheiro para isso.'}];
  if(uni){
    o.push({k:'b100',ic:'🎓',l:'Bolsa integral por nota',s:`Precisa de nota 750 · a minha é ${pts(sc)}`,ok:sc>=75,disc:1,why:`Minha nota (${pts(sc)}) não chega a 750.`});
    o.push({k:'b50',ic:'📘',l:'Bolsa de 50% por nota',s:`Precisa de nota 650 · o resto ${fam>=cost?'a família paga':'vira financiamento'}`,ok:sc>=65,disc:.5,pay:fam>=cost?'pais':'loan',why:`Minha nota (${pts(sc)}) não chega a 650.`});
    o.push({k:'besp',ic:'🏅',l:'Bolsa de atleta',s:`Atletismo ${needS}%+ e treinar sempre${m.c.capSport?' (fui capitão do time)':m.c.titSport?' (fui titular do time)':''} · tenho ${m.talent.athletic}%`,ok:sport,disc:1,why:'Preciso de mais talento esportivo e de treinar com frequência (Mente e corpo).'});
    o.push({k:'bart',ic:'🎻',l:'Bolsa de música ou arte',s:`Música ou arte ${needA}%+ e praticar sempre · música ${m.talent.musical}%, arte ${m.talent.art||0}%, dança ${m.talent.dance||0}%`,ok:music||art,disc:1,why:'Preciso de mais talento em música ou arte e de praticar com frequência.'});
  }
  o.push({k:'loan',ic:'🏦',l:'Financiamento estudantil',s:'Pago as parcelas depois de formad'+oa(),ok:true});
  o.push({k:'self',ic:'💵',l:'Pagar do meu bolso',s:`${fmt(cost)}/ano · tenho ${fmt(m.money)}`,ok:m.money>=cost,why:'Não tenho esse dinheiro.'});
  return o;
}

// ---------- trabalho ----------
function openings(){
  const m=S.me;
  if(!m.yr.openings){
    const adult=m.age>=18&&!(m.edu.cur&&(m.edu.cur.type==='fund'||m.edu.cur.type==='medio'));
    const pool=JOBS.filter(j=>adult?!j.pt:j.pt&&(j.min||14)<=m.age);
    const pick=R.shuffle(pool).slice(0,adult?12:6);
    if(adult){ const fit=JOBS.filter(j=>!j.pt&&eduOk(j.edu)&&j.edu); R.shuffle(fit).slice(0,3).forEach(j=>{ if(!pick.includes(j)) pick.push(j); }); }
    m.yr.openings=pick.map(j=>{ const size=j.pt?'pequena':pickSize(); return {id:j.id,co:companyName(),size,mul:(1+R.int(-12,15)/100)*SIZES[size].mul}; });
  }
  return m.yr.openings;
}
function jobReqs(d){
  const m=S.me,miss=[];
  if(!eduOk(d.edu)) miss.push('Formação: '+eduName(d.edu));
  if(d.sm&&m.smarts<d.sm-10) miss.push('Mais inteligência');
  if(d.lk&&m.looks<d.lk-10) miss.push('Mais aparência');
  if(d.hl&&m.health<d.hl) miss.push('Mais saúde');
  if(d.lic&&!m.lic) miss.push('Carteira de motorista');
  if(d.min&&m.age<d.min) miss.push(`Idade mínima ${d.min}`);
  return miss;
}
function hireChance(d){ const m=S.me; return clamp(55+(m.smarts-(d.sm||40))*.6+(m.looks-50)*.2-m.rec.conv*18-(m.add.alcool>60?15:0)+(m.fame/5),5,95)/100; }
function takeJob(o,bonus){
  const m=S.me,d=JOBS.find(x=>x.id===o.id);
  if(m.job&&!d.pt) endJob(); if(m.job&&d.pt) endJob();
  m.job={id:d.id,lvl:0,perf:55,yrs:0,lvlYrs:0,co:o.co,size:o.size||'média',mul:o.mul*(bonus||1)};
  if(d.id==='medi'||d.id==='ciru') m.c.wasDoctor=1;
  for(let i=0,n=R.int(2,4);i<n;i++) S.people.push(mkPerson({rel:'colegaT',age:clamp(m.age+R.int(-10,15),16,70),bond:R.int(25,55)}));
  const boss=mkPerson({rel:'chefe',age:clamp(m.age+R.int(3,25),25,75),bond:R.int(35,60)}); S.people.push(boss);
  log(`Fui ${m.gender==='F'?'contratada':'contratado'} como ${jobTitle(m.job).toLowerCase()} na ${o.co}.`,'good'); st('happy',8);
}
function workHarder(){ const m=S.me; const n=use('work'); if(n>4) return 'Já estou no limite. Mais hora extra e eu desmaio.'; m.c.workYr=(m.c.workYr||0)+1; cnt('work'); m.job.perf=clamp(m.job.perf+R.int(2,6)); st('happy',-R.int(1,3)); st('health',-R.int(0,1)); return R.pick(['Fiquei até tarde no trabalho.','Adiantei os projetos do mês.','Trabalhei no fim de semana.','Fui a primeira pessoa a chegar e a última a sair.']); }
function askRaise(){ const m=S.me,j=m.job; if(use('raise')>1) return 'Já pedi aumento este ano.'; if(R.chance(j.perf/180)){ const p=R.int(4,15); j.mul=(j.mul||1)*(1+p/100); st('happy',6); return `Consegui ${p}% de aumento!`; } j.perf=clamp(j.perf-4); return 'Meu chefe riu e mudou de assunto.'; }
// Atestado médico: de verdade (precisa estar doente) ou comprado. Quem falta demais acaba demitido.
const atestCount=j=>{ const a=(j&&j.atest||[]).filter(y=>S.year-y<=1); const n=a.filter(y=>y===S.year).length; return {n,load:n+(a.length-n)*.5}; };
function sickNote(kind){
  const m=S.me,j=m.job; if(!j) return 'Não tenho emprego.';
  const dem=m.gender==='F'?'demitida':'demitido', sick=m.dis.length>0||m.health<45;
  if(kind==='real'&&!sick){ j.perf=clamp(j.perf-1); return R.pick([`O médico me examinou e disse que estou ótim${oa()}. Nada de atestado.`,'O médico não viu nada de errado e me mandou de volta ao trabalho.']); }
  if(kind==='fake'&&!canPay(300)) return 'Não tenho dinheiro para comprar um atestado.';
  j.atest=(j.atest||[]).filter(y=>S.year-y<=1); j.atest.push(S.year); cnt('atestados');
  const {n,load}=atestCount(j), days=R.int(2,kind==='real'?15:5);
  j.perf=clamp(j.perf-R.int(1,3)-Math.max(0,load-2)*3);
  st('health',kind==='real'?R.int(3,7):1); st('happy',R.int(2,5));
  if(kind==='fake'){ m.money-=300; m.karma=clamp(m.karma-3);
    if(R.chance(.1+load*.06)){ log(`Descobriram que meu atestado era falso. Fui ${dem} da ${j.co} por justa causa.`,'bad'); st('happy',-15); m.karma=clamp(m.karma-5); endJob(); return `O RH ligou para a clínica e a clínica nem existia. Fui ${dem} por justa causa.`; } }
  const risk=load<=2?0:Math.min(.85,(load-2)*(kind==='real'?.12:.22)+(j.perf<40?.15:0));
  if(R.chance(risk)){ log(`Fui ${dem} da ${j.co}: faltas demais com atestado.`,'bad'); st('happy',-14); endJob(); return R.pick([`Entreguei o ${n}º atestado do ano e o RH me chamou. Fui ${dem}.`,`Meu chefe disse que a empresa precisa de alguém que apareça para trabalhar. Fui ${dem}.`]); }
  const warn=load>=3?R.pick(['Meu chefe avisou que é o último atestado que aceita.','O RH me deu uma advertência por excesso de faltas.']):load>=2?R.pick(['Meu chefe torceu o nariz quando entreguei o atestado.','O RH me chamou para conversar sobre as faltas.','Ouvi colegas comentando que eu vivo doente.']):'';
  const t=kind==='real'?R.pick([`O médico me deu ${days} dias de atestado.`,`Peguei ${days} dias de atestado para me recuperar.`]):R.pick([`Comprei um atestado de ${days} dias e fiquei em casa vendo série.`,`Atestado "médico" de ${days} dias na mão. Fui à praia.`]);
  return t+(warn?' '+warn:'');
}
function quitJob(){ const m=S.me; const t=jobTitle(m.job); log(`Pedi demissão (${t.toLowerCase()}).`); endJob(); return 'Pedi demissão.'; }
function specialEntry(id){
  const m=S.me,sp=SPECIAL[id];
  if(m.age<sp.min) return `Preciso ter pelo menos ${sp.min} anos.`;
  if(sp.max&&m.age>sp.max) return 'Já passei da idade para começar nessa carreira.';
  if(sp.hl&&m.health<sp.hl) return 'Minha saúde não é suficiente.';
  if(id==='crime'&&(m.karma>45||m.rec.crimes<2)) return 'Ninguém do crime confia em mim ainda.';
  if(id==='militar'&&m.rec.conv) return 'Não aceitam ficha criminal.';
  const tal=talOf(sp.talent);
  const p=id==='militar'?.85:id==='crime'?.8:id==='camelo'?.9:clamp(tal-15,4,92)/100;
  if(!R.chance(p)){ st('happy',-4); return R.pick(['Não passei no teste.','Disseram que vão ligar. Não ligaram.','Fui reprovad'+oa()+' na seleção.','Não gostaram do meu trabalho.']); }
  if(m.job) endJob();
  const co={ator:'Produtora '+R.pick(['Lumière','Sétima Arte','Ciclorama','Plano Geral']),musico:'Selo independente',atleta:'Clube '+R.pick(['Atlético','Esporte Clube','União','Real']),modelo:'Agência '+R.pick(['Elite','Prisma','Íris']),militar:R.pick(['Exército','Marinha','Aeronáutica']),crime:R.pick(['Comando do Morro','Bonde do Leste','Família Sombra','Os Intocáveis']),
    comedia:'Clube da Comédia '+R.pick(['Riso Solto','Piada Pronta','Gargalhada']),escritor:'Editora '+R.pick(['Papiro','Sabiá','Tinta Fresca','Folha Seca']),artista:'Ateliê próprio',streamer:'Plataforma de lives',dj:'Agência '+R.pick(['Bass Drop','Pulso','Noite Alta']),camelo:'Rua 25 de Março'}[id];
  m.job={spc:id,lvl:0,perf:55,yrs:0,co};
  if(id==='crime'){ m.karma=clamp(m.karma-10); m.c.wasMob=1; }
  log(`Entrei para ${co}: agora sou ${jobTitle(m.job).toLowerCase()}.`,'good'); st('happy',10);
  return `Consegui! Agora sou ${jobTitle(m.job).toLowerCase()}.`;
}
function specialAction(){
  const m=S.me,j=m.job,sp=SPECIAL[j.spc]; if(use('spc')>3) return 'Preciso descansar um pouco.';
  const tal=talOf(sp.talent);
  if(j.spc==='crime'){ if(R.chance(.12)){ arrest('crimes da quadrilha',3,12); return 'O serviço deu errado e a polícia apareceu.'; } if(R.chance(.03)){ die('balead'+oa()+' num confronto'); return 'Não saí vivo desse serviço.'; } const v=Math.round(sp.sal[j.lvl]*R.f()*.3); m.money+=v; j.perf=clamp(j.perf+6); m.karma=clamp(m.karma-3); cnt('crimes'); return `Serviço feito. Ganhei ${fmt(v)}.`; }
  if(j.spc==='militar'){ j.perf=clamp(j.perf+R.int(3,8)); st('health',R.int(1,3)); return 'Treinei pesado no quartel.'; }
  if(m.talent[sp.talent]!=null) m.talent[sp.talent]=clamp(m.talent[sp.talent]+R.int(0,3));
  if(R.chance(tal/160+j.perf/400)){ const bonus=Math.round(sp.sal[j.lvl]*R.f()*.4); m.money+=bonus; j.perf=clamp(j.perf+R.int(6,14)); m.fame=clamp(m.fame+R.int(1,4)); st('happy',6);
    const msg={ator:'Consegui o papel! O filme foi bem nas bilheterias.',musico:'A música entrou nas paradas!',atleta:'Fui o destaque do jogo!',modelo:'O ensaio virou capa de revista!',comedia:'O show esgotou e o especial bombou na internet!',escritor:`"${R.pick(['O Silêncio das Marés','Café com Fantasmas','A Última Feira','Cartas para Ninguém','Doze Invernos','O Ladrão de Domingos'])}" virou sucesso de vendas!`,artista:'A exposição foi elogiada pela crítica e vendi várias obras!',streamer:'A live bateu recorde de audiência!',dj:'O festival inteiro pulou com o meu set!',camelo:'Vendi o estoque inteiro em um fim de semana!'}[j.spc]; return `${msg} Bônus: ${fmt(bonus)}.`; }
  j.perf=clamp(j.perf-R.int(2,6)); st('happy',-3);
  return {ator:'Não passei no teste para o papel.',musico:'A música não pegou.',atleta:'Fui mal na partida e a torcida vaiou.',modelo:'As fotos não agradaram o cliente.',comedia:'Ninguém riu. Silêncio total na plateia.',escritor:'O livro encalhou nas livrarias.',artista:'A exposição ficou vazia.',streamer:'A live caiu no meio e o chat me xingou.',dj:'Errei a mixagem na frente de todo mundo.',camelo:'O rapa levou minha mercadoria.'}[j.spc];
}
function runFor(o,tier){
  const m=S.me,cost=Math.round(o.cost*[0.3,1,3][tier]);
  m.money-=cost;
  const p=clamp((o.base+m.fame/250+m.smarts/600+(m.karma-50)/400+[-.05,.06,.16][tier]-(m.rec.conv?.25:0)-(typeof npcRival==='function'&&npcRival(o.id)?npcRival(o.id).npcPoder.apoio/500:0))*100,2,85)/100;
  if(!R.chance(p)){ st('happy',-10); log(`Perdi a eleição para ${g(o.n,m.gender).toLowerCase()}.`,'bad'); return `Perdi a eleição. Gastei ${fmt(cost)} na campanha.`; }
  if(m.job) endJob(); m.office={id:o.id,yrs:0,appr:R.int(45,65)}; cnt('office_'+o.id); if(o.id==='pres') cnt('pres');
  m.fame=clamp(m.fame+{ver:3,dep:8,pref:10,gov:25,pres:60}[o.id]);
  log(`Fui ${m.gender==='F'?'eleita':'eleito'} ${g(o.n,m.gender).toLowerCase()}!`,'good'); st('happy',20);
  return `Ganhei a eleição! Agora sou ${g(o.n,m.gender).toLowerCase()}.`;
}
function officeAct(k){
  const m=S.me,o=m.office; if(use('office')>3) return 'Já fiz muita coisa este ano.';
  if(k==='lei'){ const good=R.chance(.6); o.appr=clamp(o.appr+(good?R.int(3,10):-R.int(3,8))); return good?`Aprovei ${R.pick(['uma lei de merenda escolar melhor','mais ciclovias','um programa de vacinação','a reforma de praças'])}. A população gostou.`:'Minha lei foi duramente criticada.'; }
  if(k==='discurso'){ o.appr=clamp(o.appr+R.int(-3,6)); m.fame=clamp(m.fame+1); return 'Fiz um discurso inflamado.'; }
  if(k==='imposto'){ o.appr=clamp(o.appr-R.int(5,15)); return 'Aumentei impostos. A população odiou.'; }
  if(k==='desvio'){ const v=Math.round(OFFICES.find(x=>x.id===o.id).sal*R.int(1,8)); m.karma=clamp(m.karma-10); if(R.chance(.25)){ m.office=null; arrest('corrupção passiva',4,15); return 'A Polícia Federal bateu na minha porta às 6h.'; } m.money+=v; return `Desviei ${fmt(v)} de uma obra superfaturada.`; }
  if(k==='renuncia'){ m.office=null; log('Renunciei ao mandato.'); return 'Renunciei.'; }
}

// ---------- bens ----------
function houseListings(){ const m=S.me; if(!m.yr.houses) m.yr.houses=R.shuffle(HOUSES).slice(0,6).map(h=>{ const v=Math.round(h.v*(.7+R.f()*.7)/100)*100; return {t:h.t,n:`${h.t} ${R.pick(HOOD)}`,v,cond:R.int(35,100),q:R.int(1,h.v>1e6?9:4),built:S.year-R.int(0,70)}; }).sort((a,b)=>a.v-b.v); return m.yr.houses; }
function carListings(){ const m=S.me; if(!m.yr.cars) m.yr.cars=R.shuffle(CARS).slice(0,7).map(c=>{ const used=c.t.includes('usad')||R.chance(.4); const v=Math.round(c.v*(used?.55+R.f()*.3:.95+R.f()*.15)/100)*100; return {t:c.t,n:`${c.t} ${R.pick(CAR_COLORS)}${used&&!c.t.includes('usad')?' (seminovo)':''}`,v,cond:used?R.int(40,85):100}; }).sort((a,b)=>a.v-b.v); return m.yr.cars; }
function buy(kind,l,financed){
  const m=S.me;
  if(kind==='casa'&&financed){ const down=Math.round(l.v*.2); if(!canPay(down)) return `Preciso de ${fmt(down)} de entrada.`; if(!m.job&&!m.office&&!m.ret) return 'O banco não financia para quem não tem renda.'; m.money-=down; m.assets.push({id:newId(),k:'casa',n:l.n,value:l.v,cond:l.cond,buy:l.v,loan:l.v-down,pay:Math.round((l.v-down)/25*1.35)}); }
  else { if(!canPay(l.v)) return 'Não tenho dinheiro suficiente.'; m.money-=l.v; m.assets.push({id:newId(),k:kind,n:l.n,value:l.v,cond:l.cond??100,buy:l.v,h:l.h,ic:l.ic,classic:l.classic}); }
  if(kind==='item'&&l.h) st('happy',l.h); else st('happy',kind==='casa'?12:8);
  if(kind==='casa'){ m.yr.houses=m.yr.houses.filter(x=>x!==l); S.flags.movedOut=1; } if(kind==='carro') m.yr.cars=m.yr.cars.filter(x=>x!==l);
  if(l.tal) m.talent[l.tal]=clamp(m.talent[l.tal]+3);
  log(`Comprei: ${l.n.toLowerCase()} por ${fmt(l.v)}.`,'good');
  return `Comprei ${l.n.toLowerCase()}!`;
}
function sellAsset(a){ const m=S.me; if(a.stolen&&R.chance(.12)){ m.assets=m.assets.filter(x=>x!==a); arrest('receptação de produto roubado',0,2); return `O comprador era policial disfarçado. Perdi ${a.n.toLowerCase()} e fui pres${oa()}.`; } const v=Math.round(a.value*(a.stolen?.45:1)*(a.k==='casa'?(.75+a.cond/400):(.5+a.cond/220))); m.money+=v-(a.loan||0); m.assets=m.assets.filter(x=>x!==a); log(`Vendi ${a.n.toLowerCase()} por ${fmt(v)}.`); return `Vendi por ${fmt(v)}${a.loan?` (quitei ${fmt(a.loan)} de financiamento)`:''}.`; }
function fixAsset(a){ const m=S.me; const c=Math.round(a.value*(100-a.cond)/100*(a.k==='casa'?.25:.4)); if(!canPay(c)) return `A reforma custa ${fmt(c)} e eu não tenho.`; m.money-=c; a.cond=100; a.value=Math.round(a.value*1.04); return `${a.k==='casa'?'Reformei':'Consertei'} por ${fmt(c)}.`; }
function invest(k,v){ const m=S.me; if(!['poup','acoes','cripto'].includes(k)||!Number.isFinite(v)) return 'Investimento inválido.'; if(v>0&&!canPay(v)) return 'Não tenho esse dinheiro.'; if(v<0&&m.inv[k]<-v) v=-m.inv[k]; m.money-=v; m.inv[k]+=v; return v>0?`Investi ${fmt(v)}.`:`Resgatei ${fmt(-v)}.`; }

// ---------- mente e corpo ----------
function body(k,extra){
  const m=S.me; const n=use('b_'+k); const tired=n>3;
  const r=x=>tired?Math.round(x/3):x;
  switch(k){
    case 'gym': st('health',r(R.int(1,5))); st('looks',r(R.int(0,3))); st('happy',r(R.int(0,3))); m.talent.athletic=clamp(m.talent.athletic+r(1)); if(R.chance(.03)){ st('health',-8); return 'Exagerei no supino e me machuquei.'; } return R.pick(['Malhei pesado.','Fiz uma aula de spinning.','Treinei perna e mal consegui andar depois.','Corri 5 km na esteira.']);
    case 'lib': st('smarts',r(R.int(1,4))); st('happy',r(R.int(0,2))); return `Li ${R.pick(['um romance policial','uma biografia','um livro de filosofia','uma enciclopédia antiga','um livro de autoajuda duvidoso','um clássico da literatura','um mangá inteiro','um livro de história do Brasil'])}.`;
    case 'med': st('happy',r(R.int(1,5))); st('health',r(R.int(0,2))); m.will=clamp(m.will+r(1)); return R.pick(['Meditei por uma hora.','Fiz um retiro de silêncio de um dia.','Meditei e quase dormi.']);
    case 'walk': st('health',r(R.int(1,3))); st('happy',r(R.int(0,2))); return R.pick(['Caminhei no parque ao entardecer.','Fiz uma trilha na mata.','Corri na orla.']);
    case 'yoga': st('health',r(R.int(1,3))); st('happy',r(R.int(1,3))); st('looks',r(R.int(0,1))); return 'Fiz uma aula de ioga.';
    case 'martial': m.fight=clamp(m.fight+r(R.int(2,6))); st('health',r(R.int(1,3))); return `Treinei ${extra.toLowerCase()}.`;
    case 'music': cnt('pMusic'); m.talent.musical=clamp(m.talent.musical+r(R.int(1,4))); st('happy',r(2)); return `Pratiquei ${(extra||R.pick(['violão','piano','bateria','canto','violino','saxofone','cavaquinho'])).toLowerCase()}.`;
    case 'acting': m.talent.acting=clamp(m.talent.acting+r(R.int(1,4))); st('happy',r(2)); return 'Fiz uma aula de teatro.';
    case 'sport': cnt('pSport'); m.talent.athletic=clamp(m.talent.athletic+r(R.int(1,4))); st('health',r(R.int(1,3))); return `Treinei ${(extra||R.pick(['futebol','basquete','natação','atletismo','vôlei','tênis'])).toLowerCase()}.`;
    case 'art': cnt('pArt'); m.talent.art=clamp((m.talent.art||0)+r(R.int(1,4))); st('happy',r(2)); return `Passei a tarde ${R.pick(['pintando uma tela','desenhando retratos','fazendo esculturas de argila','grafitando um muro autorizado'])}.`;
    case 'write': m.talent.writing=clamp((m.talent.writing||0)+r(R.int(1,4))); st('smarts',r(R.int(0,1))); return `Escrevi ${R.pick(['um conto','poemas','capítulos de um romance','um roteiro','crônicas para um blog'])}.`;
    case 'comedy': m.talent.comedy=clamp((m.talent.comedy||0)+r(R.int(1,4))); st('happy',r(2)); return R.pick(['Fui a uma noite de microfone aberto e arrisquei umas piadas.','Treinei piadas na frente do espelho.','Fiz um curso de improviso.']);
    case 'salon': m.money-=200; st('looks',r(R.int(1,3))); st('happy',r(R.int(1,3))); return 'Fui ao salão e saí outra pessoa.';
    case 'spa': m.money-=800; st('happy',r(R.int(3,8))); st('health',r(1)); return 'Passei o dia num spa.';
    case 'diet': { const d=extra; if(d==='junk'){ st('health',-R.int(2,5)); st('happy',3); return 'Comi só besteira o ano todo.'; } st('health',r(R.int(1,4))); st('looks',r(R.int(0,2))); st('happy',-1); return `Segui a dieta ${d}.`; }
  }
}

// ---------- saúde ----------
function treat(where,dis){
  const m=S.me; const def=DISEASES[dis.id];
  const cost={doc:300,hosp:8000,alt:80,psi:400}[where];
  m.money-=cost;
  let p= where==='doc'?(def.doc||0):where==='hosp'?(def.hosp||def.doc||0)+.05:where==='psi'?(def.psi||0):(def.doc||def.hosp||0)*.15;
  if(where==='alt'&&R.chance(.1)){ st('health',-6); return `O curandeiro me deu um chá estranho. Piorei.`; }
  if(def.ctrl&&where!=='alt'){ dis.ctrl=true; st('health',2); return `${def.n} agora está sob controle com remédios.`; }
  if(def.cure==='none'){ return `Não existe cura para ${dn(def.n)}. Os médicos só aliviaram os sintomas.`; }
  if(R.chance(p)){ m.dis=m.dis.filter(d=>d!==dis); st('happy',8); st('health',R.int(3,8)); return `Fui ${m.gender==='F'?'curada':'curado'} de ${dn(def.n)}!`; }
  return `O tratamento para ${dn(def.n)} não funcionou desta vez.`;
}
function checkup(){ const m=S.me; m.money-=300; if(use('checkup')>2) return 'O médico disse que estou bem e que pare de aparecer.'; st('health',R.int(1,3)); return R.pick(['Fiz exames de rotina. Tudo certo.','O médico mandou eu comer menos sal.','Tirei sangue e quase desmaiei.']); }
function rehab(k){ const m=S.me; m.money-=15000; if(R.chance(.35+m.will/200)){ m.add[k]=0; st('happy',10); st('health',5); return 'A reabilitação funcionou. Estou limpo.'.replace('limpo',m.gender==='F'?'limpa':'limpo'); } m.add[k]=clamp(m.add[k]-25); return 'Recaí depois de alguns meses, mas melhorei.'; }
function therapy(){ const m=S.me; m.money-=400; st('happy',R.int(3,9)); const d=m.dis.find(x=>DISEASES[x.id].cure==='psi'); if(d&&R.chance(DISEASES[d.id].psi)){ m.dis=m.dis.filter(x=>x!==d); return `A terapia me ajudou a superar a ${DISEASES[d.id].n.toLowerCase()}.`; } return R.pick(['Chorei a sessão inteira. Saí mais leve.','Falei sobre minha infância por uma hora.','A terapeuta me fez pensar muito.']); }
function surgery(s,tier){
  const m=S.me,cost=Math.round(s.v*[0.4,1,3][tier]); if(!canPay(cost)) return 'Não tenho dinheiro para essa cirurgia.';
  m.money-=cost; cnt('surg');
  const fail=[.3,.1,.03][tier];
  if(R.chance(fail)){ st('looks',-R.int(5,20)); st('happy',-15); if(R.chance(.08)){ st('health',-R.int(20,40)); return 'Tive complicações graves e quase morri.'; } return `A ${s.n.toLowerCase()} deu errado. Fiquei pior do que antes.`; }
  st('looks',R.int(...s.lk)); st('happy',R.int(3,10));
  return `A ${s.n.toLowerCase()} foi um sucesso!`;
}

// ---------- amor ----------
function candidate(app){
  const m=S.me; const gd=m.pref==='A'?(R.chance(.5)?'M':'F'):m.pref;
  const age=clamp(m.age+R.int(app?-8:-4,app?8:5),m.age<18?Math.max(13,m.age-2):18,99);
  const p=mkPerson({rel:'tmp',gender:gd,age,bond:R.int(55,80)});
  if(age>=18){ const d=R.pick(JOBS.filter(j=>!j.pt)); p.job=R.chance(.85)?g(d.l[R.int(0,d.l.length-1)],gd):null; p.money=R.int(0,age*4000); }
  return p;
}
function askOut(p){
  const erro=polyEntrada(p); if(erro) return {ok:false,t:erro};
  const anteriores=polyAmores();
  const m=S.me; const diff=(m.looks-p.looks)/120+(m.fame/300)+(m.money>200000?.08:0)+(m.age>=18?(m.job?.06:-.06):0);
  if(!R.chance(clamp((.42+diff)*100,5,95)/100)){ st('happy',-3); return {ok:false,t:R.pick([`${p.first} disse que não está procurando nada agora.`,`${p.first} riu e foi embora.`,`${p.first} me deu um número de telefone falso.`,`${p.first} disse que me vê só como amig${oa()}.`])}; }
  const cur=pickPartner();
  p.rel='namoro'; S.people.push(p); cnt('partners'); st('happy',8);
  polyRegistrar(p,anteriores);
  log(`Comecei a namorar ${fullName(p)}.`,'good');
  return {ok:true,t:`${p.first} topou! Estamos namorando.`};
}
// selo na hora: a primeira noite com alguém (só adultos)
function primeiraVez(nm){ const m=S.me; if(!m||m.c.primeira||m.age<18) return; m.c.primeira=1; m.primeira={n:nm,a:m.age}; META.ribbons.primeira=(META.ribbons.primeira||0)+1; log(`🎖️ Minha primeira vez: com ${nm}, aos ${m.age} anos.`,'good'); MQ.push({k:'Selo',t:'🎖️ Minha primeira vez',x:`Com ${nm}, aos ${m.age} anos. Um selo novo na coleção.`}); }
function hookup(){
  const m=S.me; const p=candidate(true); st('happy',R.int(3,8)); cnt('hookups');
  primeiraVez(fullName(p));
  let t=`Fiquei com ${p.first}, ${p.age} anos, que conheci ${R.pick(['numa balada','num bar','num aplicativo','num show','na praia'])}.`;
  if(R.chance(.06)){ const id=R.chance(.25)?'herpes':'ist'; addDisease(id); t+=' Depois descobri que peguei uma infecção.'; }
  for(const pr of partners()) if(R.chance(.3)){ pr.bond=clamp(pr.bond-40); t+=` ${pr.first} descobriu.`; }
  if(R.chance(.03)&&m.age<50&&p.gender!==m.gender&&!S.births.length){ p.rel='ex'; addP(p); S.births.push({with:p.id}); t+=' Meses depois, a notícia: vem um bebê aí.'; }
  return t;
}

// ---------- relações ----------
function interact(p,k,extra){
  const m=S.me; cnt('actions'); const n=(p.yr[k]=(p.yr[k]||0)+1); const tired=n>2;
  const nm=p.first, a=p.gender==='F'?'a':'o';
  switch(k){
    case 'tempo': if(tired) return `${nm} já passou bastante tempo comigo este ano.`; p.bond=clamp(p.bond+R.int(3,12)); st('happy',R.int(1,5)); return p.rel==='pet'?R.pick([`Brinquei com ${nm} no quintal.`,`${nm} e eu tiramos uma soneca juntos no sofá.`,`Joguei a bolinha para ${nm} até cansar.`,`Fiz carinho em ${nm} a tarde toda.`]):`Passei a tarde com ${nm} ${R.pick(['vendo filme','tomando café','jogando videogame','no parque','cozinhando','conversando sobre a vida','num jogo de futebol','no shopping'])}.`;
    case 'conversa': if(tired) return `${nm} não quer conversar agora.`; p.bond=clamp(p.bond+R.int(1,6)); return `Conversei com ${nm} sobre ${R.pick(['política','futebol','a vida dos vizinhos','o futuro','filmes','o clima','memórias de infância','religião','dinheiro','fofocas da família'])}.`+(R.chance(.12)?' Acabou em discussão.':'');
    case 'elogio': p.bond=clamp(p.bond+(tired?0:R.int(2,7))); return R.pick([`Elogiei o estilo de ${nm}.`,`Disse para ${nm} que ${p.gender==='F'?'ela':'ele'} é incrível.`,`Elogiei a comida de ${nm}.`]);
    case 'presente': { const [c,b]=extra; if(!canPay(c)) return 'Não tenho dinheiro para isso.'; m.money-=c; p.bond=clamp(p.bond+b+R.int(-2,4)); cnt('gifts'); const it=R.pick(c<100?['um chocolate','um cartão','uma flor','um chaveiro']:c<1000?['um perfume','um livro','uma camisa','um fone de ouvido']:['um relógio','uma joia','uma viagem de fim de semana','um celular novo']); return `Dei ${it} para ${nm}. ${p.bond>80?`${nm} amou!`:''}`; }
    case 'pedir': { if(tired) return `${nm} disse que já me deu o suficiente este ano.`; const ok=R.chance(p.bond/130)&&p.money>50; if(!ok){ p.bond=clamp(p.bond-3); return `${nm} disse que não.`; } const v=Math.min(p.money,Math.round(R.int(10,m.age<18?200:3000)*(1+p.money/200000))); p.money-=v; m.money+=v; return `${nm} me deu ${fmt(v)}.`; }
    case 'dar': { const v=extra; if(!canPay(v)) return 'Não tenho esse dinheiro.'; m.money-=v; p.money+=v; p.bond=clamp(p.bond+Math.min(20,Math.round(v/500)+3)); cnt('gifts'); return `Dei ${fmt(v)} para ${nm}.`; }
    case 'insulto': p.bond=clamp(p.bond-R.int(8,18)); m.karma=clamp(m.karma-2); return `Chamei ${nm} de ${R.pick(['burr'+a,'fracassad'+a,'chat'+a,'mala sem alça','cara de pastel','ridícul'+a])}. ${R.chance(p.craze/150)?`${nm} me deu um tapa.`:''}`;
    case 'discutir': p.bond=clamp(p.bond-R.int(4,12)); return `Discuti com ${nm} sobre ${R.pick(['dinheiro','política','a louça','o passado','ciúmes','a família'])}. ${R.chance(.5)?'Ganhei a discussão.':'Perdi a discussão.'}`;
    case 'briga': { cnt('fights'); m.karma=clamp(m.karma-3); p.bond=clamp(p.bond-25); if(R.chance(.35+m.fight/160)){ p.health=clamp(p.health-15); if(m.age>=16&&R.chance(.15)) arrest('lesão corporal',0,2); return `Parti pra cima de ${nm} e venci a briga.`; } st('health',-R.int(5,15)); return `Parti pra cima de ${nm} e apanhei.`; }
    case 'abraco': p.bond=clamp(p.bond+(tired?0:R.int(2,6))); return `Dei um abraço apertado em ${nm}.`;
    case 'piada': if(R.chance(.6)){ p.bond=clamp(p.bond+R.int(1,5)); return `${nm} riu muito da minha piada.`; } p.bond=clamp(p.bond-2); return `${nm} não achou graça nenhuma.`;
    case 'pegadinha': if(R.chance(.5)){ p.bond=clamp(p.bond+3); return `${nm} caiu na pegadinha e riu.`; } p.bond=clamp(p.bond-8); return `${nm} ficou furios${a} com a pegadinha.`;
    case 'amizade': if(R.chance(Math.min(.95,.08+frOf(p)/100*.9))){ p.fr=clamp(frOf(p)+8); p.rel='amigo'; p.bond=clamp(p.bond+10); return `Agora ${nm} é ${p.gender==='F'?'minha amiga':'meu amigo'}!`; } p.bond=clamp(p.bond-3); return `${nm} não deu muita bola.`;
    case 'flertar': { const okPref=m.pref==='A'||m.pref===p.gender; if(!okPref) return `Não sinto atração por ${nm}.`; if(R.chance(clamp(p.bond*.5+(m.looks-p.looks)/2+20,5,90)/100)){ const cur=pickPartner(); p.rel='namoro'; p.bond=clamp(p.bond+15); cnt('partners'); if(cur&&!p.polyConvite?.ok){ cnt('cheats'); if(R.chance(.4)) cur.bond=clamp(cur.bond-40); } return `Rolou um clima. ${nm} e eu estamos ficando sério!`; } p.bond=clamp(p.bond-6); return `${nm} me deu um fora.`; }
    case 'pedido': { const [c]=extra; if(!canPay(c)) return 'Não tenho dinheiro para esse anel.'; m.money-=c; if(R.chance(clamp(p.bond+c/1000-30,5,97)/100)){ p.rel='noivo'; p.bond=clamp(p.bond+10); st('happy',15); log(`Fiquei ${m.gender==='F'?'noiva':'noivo'} de ${nm}.`,'good'); return `${nm} disse SIM!`; } p.bond=clamp(p.bond-20); st('happy',-12); return `${nm} disse que não está pront${a}.`; }
    case 'casar': { const outro=people('conjuge').find(x=>x.id!==p.id); if(outro&&!polyPodeOficializar(p)) return `Já sou casad${oa()} com ${outro.first}. Preciso do consentimento de todos antes de casar de novo.`; if(p.rel!=='noivo') return 'Preciso estar noivo dessa pessoa antes da cerimônia.'; const [c,prenup]=extra; if(!canPay(c)) return 'Não tenho dinheiro para essa festa.'; m.money-=c; if(prenup){ S.flags['prenup'+p.id]=1; if(R.chance(.3)){ p.bond=clamp(p.bond-25); return `${nm} se ofendeu com o pacto antenupcial e adiou o casamento.`; } } p.rel='conjuge'; p.yrs=0; cnt('marriages'); st('happy',20); S.flags.movedOut=1; log(`Casei com ${fullName(p)}!`,'good'); return `Casei com ${nm}! ${c>30000?'A festa foi inesquecível.':''}`; }
    case 'terminar': p.rel='ex'; st('happy',-8); log(`Terminei com ${nm}.`); return `Terminei com ${nm}.`;
    case 'divorcio': divorce(p,false); return `Me divorciei de ${nm}.`;
    case 'amor': { if(m.age<18||p.age<18) return 'Isso é coisa de adulto.'; if(tired) return `${nm} e eu já aproveitamos bastante este ano.`; const prot=!!extra; cnt('amor'); p.bond=clamp(p.bond+R.int(5,12)); st('happy',R.int(6,12)); primeiraVez(fullName(p));
      let t=R.pick([`Uma noite só nossa, com ${nm}. Acordei sorrindo.`,`Desligamos o celular e o mundo lá fora. ${nm} riu de mim depois, de um jeito bom.`,`Foi intenso. ${nm} disse que eu sou a melhor parte do dia dele${p.gender==='F'?'a':''}.`.replace('dia delea','dia dela'),`Velas, música e ${nm}. Felicidade em estado puro.`]);
      if(m.gender!==p.gender&&!S.births.length){ const fem=m.gender==='F'?m:p, fa=fem===m?m.age:p.age; const base=clamp((fem===m?m.fert:60)-(fa>35?(fa-35)*5:0),0,90)/100; const ch=prot?base*.03:base*.55;
        if(fa<=50&&R.chance(ch)){ S.births.push({with:p.id}); t+=prot?' Semanas depois, a surpresa: a proteção falhou. Vem um bebê aí!':' Semanas depois, o teste deu positivo. Vem um bebê aí!'; } }
      return t; }
    case 'noite': { if(tired) return `${nm} e eu já tivemos nossas noites este ano.`; p.bond=clamp(p.bond+R.int(5,12)); st('happy',R.int(4,9)); primeiraVez(fullName(p)); if(m.gender!==p.gender&&!S.births.length&&m.age<=50&&p.age<=50&&R.chance(.05)){ S.births.push({with:p.id}); return `Passamos a noite juntos. Semanas depois, a surpresa: vem um bebê aí.`; } return R.pick([`Passamos a noite juntos. Acordei com ${nm} roubando o cobertor.`,`Jantar, vinho e a noite inteira só nossa.`,`Desliguei o celular. A noite foi só de ${nm} e minha.`]); }
    case 'filho': { if(m.age>=18&&p.age>=18) primeiraVez(fullName(p)); if(use('tryKid')>2) return 'Já tentamos bastante este ano.'; const fem=m.gender==='F'?m:p; const fa=fem===m?m.age:p.age; if(m.gender===p.gender) return 'Para termos filhos juntos, precisamos adotar.'; const pr=clamp((fem===m?m.fert:60)-(fa>35?(fa-35)*5:0),0,90)/100*.6; if(S.births.length) return 'Já tem um bebê a caminho!'; if(R.chance(pr)){ S.births.push({with:p.id}); return 'Deu positivo! O bebê nasce no ano que vem.'; } return 'Ainda não foi desta vez.'; }
    case 'viagem': { const c=extra; if(!canPay(c)) return 'Não temos dinheiro para isso.'; m.money-=c; p.bond=clamp(p.bond+R.int(8,18)); st('happy',R.int(6,12)); cnt('trips'); return `Viajei com ${nm} para ${R.pick(TRIPS)}.`; }
    case 'reatar': if(R.chance(p.bond/150+.15)){ p.rel='namoro'; p.bond=clamp(p.bond+20); return `Voltei com ${nm}.`; } return `${nm} disse que não volta nem morto.`.replace('morto',p.gender==='F'?'morta':'morto');
    case 'perdao': if(R.chance(.5)){ p.rel=p.rel==='inimigo'?'amigo':p.rel; p.bond=clamp(p.bond+15); return `Fiz as pazes com ${nm}.`; } return `${nm} não aceitou minhas desculpas.`;
    case 'castigo': p.bond=clamp(p.bond-5); return `Deixei ${nm} de castigo sem celular.`;
    case 'ler': p.bond=clamp(p.bond+R.int(3,8)); return `Li uma história para ${nm} dormir.`;
    case 'passear': p.bond=clamp(p.bond+R.int(3,8)); st('health',1); return R.pick([`Passeei com ${nm}.`,`Levei ${nm} para passear no parque.`,`${nm} e eu demos uma volta no quarteirão.`,`Fomos à praça, ${nm} e eu. ${nm} fez amizade com todo mundo.`]);
    case 'vet': m.money-=150; p.life=(p.life||10)+(R.chance(.3)?1:0); return R.pick([`Levei ${nm} ao veterinário. Tudo certo.`,`Check-up de ${nm} em dia. Saúde de ferro.`,`${nm} tomou vacina e ficou emburrad${p.gender==='F'?'a':'o'} o dia todo.`]);
    case 'doar_pet': p.alive=false; m.karma=clamp(m.karma-3); return `Doei ${nm} para outra família.`;
    case 'visitar': p.bond=clamp(p.bond+R.int(4,10)); st('happy',2); return `Visitei ${nm}. ${R.pick(['Comi bolo de fubá.','Ouvi histórias antigas.','Ganhei um dinheirinho escondido.','Ajudei a consertar a TV.'])}`;
    case 'demitir_chefe': return '';
    case 'puxar': p.bond=clamp(p.bond+R.int(2,8)); if(m.job) m.job.perf=clamp(m.job.perf+R.int(1,4)); return `Puxei o saco de ${nm}.`;
    case 'matar': return murder(p);
  }
}
function murder(p){
  const m=S.me; const nm=fullName(p); m.karma=clamp(m.karma-40); cnt('crimes'); m.rec.crimes++;
  const how=R.pick(['envenenamento','um empurrão da escada','um "acidente" de carro','sufocamento','um "assalto" encenado','remédios trocados']);
  const fam=['mae','pai','conjuge','filho','irmao','avo','adot','neto','namoro','noivo'].includes(p.rel);
  if(!R.chance(.5)){ p.bond=0; if(p.rel!=='pet') p.rel='inimigo'; arrest('tentativa de homicídio',6,20); S.pending[S.pending.length-1].d.evid=1; return `Tentei matar ${nm}, mas ${p.gender==='F'?'ela':'ele'} sobreviveu e chamou a polícia.`; }
  p.alive=false; cnt('kills'); st('happy',-15);
  const caught=Math.min(.95,.55+(m.c.kills-1)*.15+(fam?.2:0)-(m.smarts-50)/400);
  if(R.chance(caught)){ arrest('homicídio',15,40); S.pending[S.pending.length-1].d.evid=1; return `Matei ${nm} por ${how}. ${R.pick(['A perícia achou minhas digitais.','Uma câmera de segurança gravou tudo.','Um vizinho me viu saindo de lá.','Meu álibi não se sustentou.'])}`; }
  m.c.unsolved=(m.c.unsolved||0)+1; m.c.coldCase=nm;
  if(p.money>0&&['mae','pai','avo','conjuge'].includes(p.rel)&&R.chance(.6)){ const v=Math.round(p.money*.5); m.money+=v; return `Matei ${nm} por ${how}. Por enquanto ninguém desconfiou, e herdei ${fmt(v)}. A polícia abriu um inquérito.`; }
  return `Matei ${nm} por ${how}. Por enquanto ninguém desconfiou, mas a polícia abriu um inquérito.`;
}

// ---------- crimes ----------
// o que é roubado vira bem do personagem (vender coisa roubada paga menos e tem risco)
function stolenLoot(c,v,flavor){ const m=S.me, add=(k,n,val,cond)=>{ m.assets.push({id:newId(),k,n,value:Math.max(50,Math.round(val)),buy:0,cond:cond??100,stolen:1}); };
  if(c.id==='loja'){ const n=flavor.replace(/^(um|uma) /,''); add('item',n[0].toUpperCase()+n.slice(1)+' (furtado)',v); return `Saí da loja com ${flavor} escondido na roupa. Agora está nos meus bens.`; }
  if(c.id==='casa'&&R.chance(.6)){ const it=R.pick([['Televisão de 65 polegadas',4000],['Notebook',3500],['Caixa de joias',9000],['Console de videogame',2800],['Coleção de relógios',12000]]); add('item',it[0]+' (roubado)',it[1]*(.6+R.f()*.8)); m.money+=Math.round(v/3); return `Saí da casa com ${it[0].toLowerCase()} e ${fmt(Math.round(v/3))} em dinheiro. Guardei tudo nos meus bens.`; }
  if(c.id==='carro'){ const car=R.pick(CARS.filter(x=>x.v>=9000&&x.v<=300000)); add('carro',car.t+' (roubado)',car.v*(.7+R.f()*.3),R.int(55,95)); return `Fiz ligação direta num ${car.t.toLowerCase()} e saí acelerando. O carro agora é meu, pelo menos até a polícia descobrir.`; }
  if(c.id==='joalheria'){ add('item','Joias roubadas',v); return `Esvaziei as vitrines. As joias, avaliadas em ${fmt(v)}, estão escondidas nos meus bens.`; }
  return null; }
function crime(c){
  const m=S.me; cnt('crimes'); cnt('actions'); m.rec.crimes++; m.karma=clamp(m.karma-c.k);
  const p=c.p+(m.smarts-50)/400+(m.fight/500)+(m.job&&m.job.spc==='crime'?.1:0);
  const flavor={loja:R.pick(['um batom','um fone de ouvido','um chocolate','uma garrafa de vinho','um tênis','uma camiseta']),carteira:R.pick(['de um turista','de um executivo','de uma senhora no ônibus','de um homem distraído no celular']),casa:R.pick(['de um médico','de um casal em viagem','de um vizinho rico','de uma mansão na serra']),carro:R.pick(CARS.slice(3)).t.toLowerCase(),golpe:R.pick(['um falso site de vendas','um perfil falso de namoro','um boleto falso','uma falsa central do banco'])}[c.id]||'';
  if(R.chance(p)){ const v=R.int(...c.cash); st('happy',R.int(1,5));
    const loot=stolenLoot(c,v,flavor); if(loot) return loot; m.money+=v;
    if(c.id==='pichar') return `Pichei ${R.pick(['meu apelido','uma caveira','o nome da minha banda','um coração'])} no muro da escola.`;
    return `${c.n} deu certo${flavor?' ('+flavor+')':''}. Lucro: ${fmt(v)}.`; }
  if(R.chance(.3)&&c.id!=='banco'&&c.id!=='joalheria') return `${c.n} deu errado, mas consegui fugir.`;
  if(m.age<14){ parents().forEach(p=>p.bond=clamp(p.bond-15)); return 'Fui pego e a polícia me levou para casa. Meus pais ficaram furiosos.'; }
  if(c.jail[1]===0){ m.money-=c.fine||500; return `Fui pego. Multa de ${fmt(c.fine||500)}.`; }
  arrest(c.n.toLowerCase(),c.jail[0],c.jail[1]);
  return `A polícia me pegou em flagrante!`;
}

// ---------- prisão ----------
function prisonAct(k){
  const m=S.me,pr=m.prison; if(use('pr_'+k)>3) return 'Já fiz isso demais este ano.';
  if(k==='malhar'){ st('health',R.int(2,5)); m.fight=clamp(m.fight+2); return 'Malhei no pátio com halteres de garrafa pet.'; }
  if(k==='ler'){ st('smarts',R.int(1,4)); pr.behav=clamp(pr.behav+3); return 'Li livros da biblioteca da prisão.'; }
  if(k==='trabalho'){ pr.behav=clamp(pr.behav+6); if(R.chance(.3)&&pr.left>1){ pr.left--; return 'Trabalhei na cozinha e ganhei remição de pena: um ano a menos!'; } return 'Trabalhei na lavanderia.'; }
  if(k==='brigar'){ cnt('fights'); pr.behav=clamp(pr.behav-15); if(R.chance(.4+m.fight/200)){ return 'Ganhei a briga. Agora me respeitam.'; } st('health',-R.int(8,20)); return 'Apanhei feio.'; }
  if(k==='apelar'){ m.money-=5000; if(R.chance(.12)){ m.prison=null; st('happy',25); log('Ganhei o recurso e fui solt'+oa()+'!','good'); return 'O recurso foi aceito! Estou livre!'; } return 'O recurso foi negado.'; }
  if(k==='fugir'){ const p=.08+m.smarts/800+m.health/1200; if(R.chance(p)){ m.prison=null; cnt('escapes'); st('happy',20); log('Fugi da prisão!','good'); return 'Escapei pelo duto de ventilação! Estou livre... por enquanto.'; } pr.left+=R.int(1,3); pr.total+=2; pr.behav=clamp(pr.behav-30); return 'Fui pego tentando fugir. Minha pena aumentou.'; }
}

// ---------- diversão ----------
function nightclub(){
  const m=S.me; cnt('actions'); st('happy',R.int(3,9)); m.add.alcool=clamp(m.add.alcool+R.int(0,8)*(1.3-m.will/100)); m.money-=amt(50,400);
  const r=R.f();
  if(r<.2){ const p=mkPerson({rel:'amigo',age:clamp(m.age+R.int(-5,5),18,90),bond:45}); S.people.push(p); return `Fiz amizade com ${fullName(p)} na pista.`; }
  if(r<.3&&m.age<60) return hookup();
  if(r<.38){ st('health',-5); return 'Bebi demais e passei mal no banheiro.'; }
  if(r<.42){ arrest('briga na balada',0,1); return 'Me envolvi numa briga e a polícia apareceu.'; }
  return R.pick(['Dancei até o sol nascer.','A música estava horrível, mas me diverti.','Fiquei na área VIP de penetra.','Cantei no karaokê e arrasei.']);
}
function lottery(n){ const m=S.me; m.money-=n*5; cnt('bets'); let won=0; for(let i=0;i<n;i++){ const r=R.f(); if(r<.0000008){ won+=R.int(20,150)*1e6; cnt('lotto'); } else if(r<.0002) won+=R.int(10,80)*1000; else if(r<.01) won+=R.pick([50,100,500]); else if(r<.06) won+=10; } m.money+=won; if(won>1e6){ st('happy',40); log(`GANHEI NA LOTERIA: ${fmt(won)}!`,'good'); } return won?`Ganhei ${fmt(won)}!`:'Nenhum número bateu.'; }
function roulette(bet,kind,num){ const m=S.me; if(!canPay(bet)) return 'Não tenho dinheiro para essa aposta.'; m.money-=bet; cnt('bets'); m.add.jogo=clamp(m.add.jogo+R.int(0,4)*(1.3-m.will/100)); const n=R.int(0,36); const red=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n); const color=n===0?'verde':red?'vermelho':'preto'; let win=0; if(kind==='num'&&n===num) win=bet*36; if(kind==='vermelho'&&color==='vermelho'||kind==='preto'&&color==='preto') win=bet*2; if(kind==='par'&&n&&n%2===0||kind==='impar'&&n%2===1) win=bet*2; m.money+=win; return `Deu ${n} (${color}). ${win?`Ganhei ${fmt(win)}!`:`Perdi ${fmt(bet)}.`}`; }
function slots(bet){ const m=S.me; if(!canPay(bet)) return {t:'Não tenho dinheiro para essa aposta.',r:['-','-','-']}; m.money-=bet; cnt('bets'); m.add.jogo=clamp(m.add.jogo+R.int(0,4)*(1.3-m.will/100)); const sy=['7','BAR','$','★','♣','♦','♥']; const w=[[0,1],[1,3],[2,5],[3,6],[4,8],[5,8],[6,8]]; const r=[0,0,0].map(()=>sy[R.wpick(w)]); let win=0; if(r[0]===r[1]&&r[1]===r[2]) win=bet*({'7':100,'BAR':40,'$':20,'★':12}[r[0]]||8); else if(r[0]===r[1]||r[1]===r[2]||r[0]===r[2]) win=Math.round(bet*1.5); m.money+=win; return {t:win?`Ganhei ${fmt(win)}!`:`Perdi ${fmt(bet)}.`,r}; }
function horses(bet,i,field){ const m=S.me; if(!canPay(bet)) return 'Não tenho dinheiro.'; m.money-=bet; cnt('bets'); const win=R.wpick(field.map((h,j)=>[j,1/h.odds])); const h=field[win]; if(win===i){ const v=Math.round(bet*field[i].odds); m.money+=v; return `${h.n} venceu! Ganhei ${fmt(v)}!`; } return `Quem venceu foi ${h.n}. Perdi ${fmt(bet)}.`; }
function travel(dest,cost){
  const m=S.me; if(!canPay(cost)) return 'Não tenho dinheiro para essa viagem.'; m.money-=cost; cnt('trips'); cnt('actions'); st('happy',R.int(6,15));
  const r=R.f();
  if(r<.12) return `Fui para ${dest}, mas a companhia aérea perdeu minha mala.`;
  if(r<.2){ st('health',-6); return `Fui para ${dest} e passei metade da viagem com intoxicação alimentar.`; }
  if(r<.3&&!partners().length&&m.age<70){ const p=candidate(true); p.rel='namoro'; S.people.push(p); cnt('partners'); return `Fui para ${dest} e me apaixonei por ${fullName(p)}! Estamos namorando.`; }
  if(r<.36){ const l=amt(100,2000); m.money-=l; return `Fui para ${dest} e fui roubad${oa()} na rua. Perdi ${fmt(l)}.`; }
  return `Fui para ${dest}. ${R.pick(['Foi a melhor viagem da minha vida.','Comi coisas que nem sei o nome.','Tirei mil fotos.','Voltei com outra visão do mundo.','Choveu todos os dias, mas valeu.','Fiz amizade com um grupo de mochileiros.'])}`;
}
function adoptPet(kind,sp){
  const m=S.me; const s=sp||R.pick(PETS.filter(p=>kind==='abrigo'?!p.ex:true));
  const cost=kind==='abrigo'?50:s.cost; if(!canPay(cost)) return 'Não tenho dinheiro.';
  m.money-=cost; const gd=R.chance(.5)?'M':'F';
  const p=mkPerson({rel:'pet',first:R.pick(PET_NAMES),gender:gd,species:s.s,age:kind==='abrigo'?R.int(0,6):0,bond:R.int(60,90)}); p.life=R.int(...s.life);
  S.people.push(p); cnt('pets'); st('happy',8);
  return `Adotei ${p.first}, ${g(s.s,gd).toLowerCase()}${kind==='abrigo'?' do abrigo':''}!`;
}
function adoptChild(){ const m=S.me; if(!canPay(20000)) return 'Preciso de pelo menos $20.000 para o processo.'; if(m.rec.conv) return 'Minha ficha criminal impediu a adoção.'; m.money-=20000; if(!R.chance(.6)) return 'O processo foi negado desta vez.'; const k=mkPerson({rel:'adot',age:R.int(0,10),last:m.last,bond:R.int(55,80),country:R.pick(COUNTRIES).id}); S.people.push(k); cnt('kids'); st('happy',15); log(`Adotei ${k.first}, de ${k.age} anos.`,'good'); return `Adotei ${k.first}, de ${k.age} anos!`; }
function emigrate(c){ const m=S.me; const cost=5000; if(!canPay(cost)) return 'Não tenho dinheiro para emigrar.'; if(!R.chance(.4+m.smarts/250+(m.money>500000?.3:0)-(m.rec.conv?.3:0))){ m.money-=500; return `Meu pedido de visto para ${c.n} foi negado.`; } m.money-=cost; m.country=c.id; m.city=R.pick(c.cities); cnt('emig'); m.c.countries=(m.c.countries||1)+1; if(m.job) endJob(); S.people.filter(p=>['amigo','colega','colegaT','chefe'].includes(p.rel)).forEach(p=>p.bond=clamp(p.bond-25)); log(`Emigrei para ${m.city}, ${c.n}.`,'good'); st('happy',R.int(-5,15)); return `Me mudei para ${m.city}, ${c.n}!`; }
function driving(){ const m=S.me; m.money-=1500; if(use('lic')>2) return 'A autoescola só deixa três provas por ano.'; if(R.chance(.35+m.smarts/200)){ m.lic=true; st('happy',8); log('Tirei minha carteira de motorista.','good'); return 'Passei na prova de direção!'; } return R.pick(['Reprovei na baliza.','Bati no cone.','Esqueci de dar seta e reprovei.','Deixei o carro morrer três vezes na subida.']); }
function socialPost(kind){
  const m=S.me,s=m.social; if(use('post')>4) return 'Já postei demais este ano. Ninguém aguenta.';
  const base=Math.max(10,Math.round((s.f+50)*R.f()*.15+m.looks*R.f()*2+m.fame*20));
  let d=base;
  if(kind==='polemica'){ if(R.chance(.35)){ d=-Math.round(s.f*R.f()*.3); s.f+=d; m.fame=clamp(m.fame+2); return `Fui ${m.gender==='F'?'cancelada':'cancelado'}! Perdi ${Math.abs(d).toLocaleString('pt-BR')} seguidores.`; } d*=3; }
  if(kind==='selfie') d=Math.round(d*(m.looks/50));
  if(kind==='danca'&&R.chance(.08)) d*=40;
  s.f+=d; if(s.f>100000) m.fame=clamp(m.fame+1);
  return `Postei ${({selfie:'uma selfie',video:'um vídeo engraçado',polemica:'uma opinião polêmica',danca:'uma dancinha',foto:'uma foto da comida'})[kind]} e ganhei ${d.toLocaleString('pt-BR')} seguidores.`;
}
