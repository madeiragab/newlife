// ===== Superpoderes: equipes (contam como emprego), Lei de Registro, identidade e família =====
const HTEAMS={
  novatos:{n:'Novatos Unidos',ic:'🧢',rep:10,sal:24000,reg:1,d:'Equipe-escola para heróis iniciantes. Paga pouco e ensina muito.'},
  sentinelas:{n:'Sentinelas do Sul',ic:'🛡️',rep:35,sal:52000,reg:0,d:'Heróis independentes. São contra a Lei de Registro e protegem quem se recusa.'},
  vertice:{n:'Vértice Corp',ic:'🏢',rep:30,sal:150000,reg:1,corp:1,d:'Heróis de empresa: salário alto, logotipo no uniforme e chefe cobrando resultado.'},
  afc:{n:'Agência Federal de Contenção',ic:'🏛️',rep:25,sal:78000,reg:2,d:'O braço do governo. Exige que você entregue sua identidade e caça quem não se registra.'},
  liga:{n:'Liga Guardiã',ic:'🌟',rep:60,sal:110000,reg:1,d:'A equipe mais famosa do país. Entrar é um sonho; sair vira manchete.'},
};
const HRANK=['Herói recruta|Heroína recruta','Herói de equipe|Heroína de equipe','Herói veterano|Heroína veterana','Capitão de equipe|Capitã de equipe','Líder de equipe'];
const HREG={sim:'Registrad{o}',nao:'Procurad{o} pela Lei',prazo:'Prazo correndo'};
const FAM_RELS=['conjuge','noivo','namoro','filho','adot','mae','pai','irmao','avo'];
jobTitle=(o=>function(j){ if(j&&j.hero) return g(HRANK[Math.min(j.lvl,HRANK.length-1)],S.me.gender); return o(j); })(jobTitle);
jobSalary=(o=>function(j){ if(j&&j.hero){ const t=HTEAMS[j.hero]; return Math.round((t?t.sal:30000)*(1+.35*j.lvl)*(j.mul||1)); } return o(j); })(jobSalary);
occupation=(o=>()=>{ const sc=S.scen, j=S.me&&S.me.job; if(sc&&sc.id==='heroi'&&j&&j.hero) return `${jobTitle(j)} · ${j.co}`; return o(); })(occupation);
const hTeam=()=>{ const j=S.me.job; return j&&j.hero?HTEAMS[j.hero]:null; };
function hEnsure(sc){ if(sc.leiD==null) sc.leiD=rnd(3,5); sc.sab=sc.sab||{}; sc.hEx=sc.hEx||{}; if(sc.proc==null) sc.proc=0; return sc; }
const famAll=()=>people(...FAM_RELS).filter(p=>p.rel!=='pet');
const famAlvos=sc=>famAll().filter(p=>!(p.esc&&p.esc>=sc.dia));
function famPick(sc){ const a=famAlvos(sc); if(!a.length) return null; return R.wpick(a.map(p=>[p,['conjuge','noivo','namoro','filho','adot'].includes(p.rel)?3:['mae','pai'].includes(p.rel)?2:1])); }
function famLog(t,c){ scLog(t,c); const y=S.log[S.log.length-1]; if(y) y.lines.push({t,c}); }
function famDie(p,why){ if(!p||!p.alive) return ''; p.alive=false; st('happy',-25); scStat('san',-30); if(p.rel==='conjuge') cnt('widow'); const sc=S.scen; if(sc){ sc.vinga=(sc.vinga||0)+1; scStat('pw',8); }
  famLog(`${relLabel(p)} ${fullName(p)} morreu ${why}, aos ${p.age} anos.`,'bad'); return `${p.first} não sobreviveu.`; }
function famHurt(p,n){ if(!p||!p.alive) return ''; p.health=clamp(p.health-n); p.bond=clamp(p.bond-6); scStat('san',-10); if(p.health<=0) return famDie(p,'depois do ataque'); return `${p.first} foi parar no hospital.`; }
function hRevela(sc,why){ if(sc.rev) return; sc.rev=1; sc.sec=0; scLog(why,'bad'); scStat('san',-12); S.me.fame=clamp(S.me.fame+10); queue('h_revelada',{}); }
function hFire(sc,why){ const m=S.me; if(!m.job||!m.job.hero) return ''; sc.hEx[m.job.hero]=1; const n=m.job.co; endJob(); scLog(`Fui expuls${oa()} da ${n}. ${why||''}`.trim(),'bad'); return `Fui expuls${oa()} da ${n}.`; }
function hJoin(id){ const sc=S.scen, m=S.me, t=HTEAMS[id];
  if(sc.rep<t.rep) return `A ${t.n} só aceita heróis com reputação de ${t.rep}% ou mais.`;
  if(t.reg&&sc.reg==='nao') return `A ${t.n} não aceita quem se recusou a se registrar. Para eles, sou um criminoso.`;
  if(sc.hEx[id]) return `A ${t.n} já me mandou embora uma vez. Não querem nem ouvir meu nome.`;
  if(!pct(.4+sc.rep/180+sc.pw/400)) { scStat('san',-3); return R.pick([`A ${t.n} disse que vai "manter meu currículo em arquivo".`,'Fui reprovad'+oa()+' no teste prático. Derrubei o simulador inteiro.',`O líder da ${t.n} disse que ainda sou muito verde.`]); }
  if(m.job) endJob();
  m.job={hero:id,lvl:0,perf:55,yrs:0,co:t.n}; sc.hxp=0; sc.hPay=sc.dia; scStat('rep',5);
  let x=''; if(t.reg===2&&sc.reg!=='sim'){ sc.reg='sim'; sc.proc=0; x=' Precisei entregar meu nome verdadeiro, endereço e DNA para o governo.'; }
  if(R.chance(.7)){ const c=mkCrew(); x+=` ${c.first} virou ${c.gender==='F'?'minha parceira':'meu parceiro'} de patrulha.`; }
  return `Fui aceit${oa()} na ${t.n}! Agora sou ${jobTitle(m.job).toLowerCase()}, com salário de ${fmt(jobSalary(m.job))} por ano.${x}`; }
// ---------- telas ----------
V.hTeams=()=>{ const sc=S.scen, m=S.me, it=[{html:`<div class="card"><p>Entrar numa equipe conta como emprego: tem salário toda semana, cargo e chefe. ${m.job&&!m.job.hero?`Vou ter que largar o emprego de ${jobTitle(m.job).toLowerCase()}.`:''}</p>${kv('Minha reputação',sc.rep+'%')}${kv('Lei de Registro',sc.reg?fill(HREG[sc.reg]||'—').replace(/\{o\}/g,oa()):'Ainda não existe')}</div>`}];
  Object.entries(HTEAMS).forEach(([id,t])=>{ const cur=m.job&&m.job.hero===id; it.push({ic:t.ic,l:t.n,s:`${t.d} · ${fmt(t.sal)}/ano · reputação ${t.rep}%+${t.reg===0?' · contra o registro':t.reg===2?' · exige registro':''}`,r:cur?'✓':'',dis:cur||sc.ap<1,why:cur?'Já faço parte dessa equipe.':'Sem energia hoje.',
    on:()=>confirmBox(t.n,'Pedir para entrar? Gasta 1 de energia.','Pedir',()=>scAct(()=>{ if(!spend(null,1)) return 'Sem energia.'; return hJoin(id); },t.n))}); });
  return {title:'Equipes de heróis',items:it}; };
V.hTeam=()=>{ const sc=S.scen, m=S.me, j=m.job, t=hTeam(); if(!t) return V.hTeams(); const need=(j.lvl+1)*2;
  const it=[{html:`<div class="card"><p><b>${t.ic} ${esc(t.n)}</b></p>${kv('Cargo',jobTitle(j))}${kv('Salário',fmt(jobSalary(j))+'/ano · pago toda semana')}${bar('Desempenho',j.perf)}${kv('Missões no cargo',`${sc.hxp||0} de ${need}`)}</div>`},{sec:'Trabalho'}];
  it.push({ic:'🚨',l:'Missão da equipe',s:'1 de energia · desempenho e bônus',dis:!!sc.done.hmis||sc.ap<1,why:sc.done.hmis?'Já fiz a missão de hoje.':'Sem energia hoje.',on:()=>scAct(()=>{ if(!spend('hmis',1)) return 'Sem energia.'; const f=scFight(rnd(1,3)+Math.floor(j.lvl/2),'A missão');
    if(f.ok){ j.perf=clamp(j.perf+rnd(6,12)); sc.hxp=(sc.hxp||0)+1; scStat('rep',4); const b=Math.round(jobSalary(j)/12); m.money+=b; return `${R.pick(['Desativamos uma bomba num shopping.','Contivemos um robô gigante na marginal.','Resgatamos um navio encalhado.','Prendemos uma quadrilha inteira de supervilões menores.','Evacuamos um bairro antes de um prédio desabar.'])} Bônus de ${fmt(b)}.`; }
    j.perf=clamp(j.perf-6); return `A missão deu errado. ${f.t}`; },t.n)});
  it.push({ic:'🏋️',l:'Treinar com a equipe',s:'1 de energia · poder e desempenho',dis:!!sc.done.htre||sc.ap<1,why:sc.done.htre?'Já treinei hoje.':'Sem energia hoje.',on:()=>scAct(()=>{ if(!spend('htre',1)) return 'Sem energia.'; scStat('pw',rnd(3,6)); j.perf=clamp(j.perf+3); return R.pick(['Treino na sala de simulação. Quebrei dois robôs de treino.','O capitão me fez repetir o mesmo salto 40 vezes.','Treinei combinações de poder com a equipe.']); },t.n)});
  it.push({ic:'☕',l:'Reunião da equipe',s:'Sanidade e desempenho',dis:!!sc.done.hreu,why:'Já teve reunião hoje.',on:()=>scAct(()=>{ sc.done.hreu=1; j.perf=clamp(j.perf+2); scStat('san',4); return R.pick(['Discutimos estratégia. E quem comeu o iogurte da geladeira.','Reunião de duas horas que podia ser um e-mail.','O líder elogiou meu trabalho na frente de todo mundo.']); },t.n)});
  it.push({ic:'📈',l:'Pedir promoção',s:j.lvl>=HRANK.length-1?'Já estou no topo':`Próximo cargo: ${g(HRANK[j.lvl+1],m.gender)}`,dis:j.lvl>=HRANK.length-1||!!sc.done.hpro,why:j.lvl>=HRANK.length-1?'Não tem cargo acima.':'Já pedi hoje.',on:()=>scAct(()=>{ sc.done.hpro=1; if(j.perf>=70&&(sc.hxp||0)>=need&&pct(.5+j.perf/250)){ j.lvl++; sc.hxp=0; j.perf=clamp(j.perf-5); scStat('rep',6); return `Promovid${oa()}! Agora sou ${jobTitle(j).toLowerCase()}, ganhando ${fmt(jobSalary(j))} por ano.`; } j.perf=clamp(j.perf-4); return (sc.hxp||0)<need?`Disseram que preciso de mais missões no cargo (${sc.hxp||0} de ${need}).`:'Disseram que meu desempenho ainda não é suficiente.'; },t.n)});
  it.push({ic:'💵',l:'Pedir aumento',dis:!!sc.done.haum,why:'Já pedi hoje.',on:()=>scAct(()=>{ sc.done.haum=1; if(j.perf>=60&&pct(.35+j.perf/300)){ j.mul=(j.mul||1)*1.12; return `Aumento de 12%. Agora ganho ${fmt(jobSalary(j))} por ano.`; } j.perf=clamp(j.perf-5); return 'O financeiro riu. Literalmente.'; },t.n)});
  it.push({ic:'🚪',l:'Sair da equipe',tone:'bad',on:()=>confirmBox('Sair da equipe?',`Vou deixar de ser ${jobTitle(j).toLowerCase()} da ${t.n}.`,'Sair',()=>{ const n=t.n; endJob(); scLog(`Saí da ${n}.`,'warn'); UI.back(); after(); })});
  return {title:t.n,items:it}; };
V.hPessoa=p=>{ const sc=S.scen; if(!p||!p.alive) return null; const base=V.person(p)||{items:[]}; const it=[]; const knows=sc.sab&&sc.sab[p.id];
  it.push(base.items[0]||{html:''},{sec:'Vida de herói'});
  it.push({html:`<div class="card">${kv('Sabe quem eu sou?',knows||sc.rev?'Sabe':'Não sabe')}${p.esc&&p.esc>=sc.dia?kv('Proteção',`Escondid${oaG(p.gender)} por mais ${p.esc-sc.dia+1} ano(s)`):''}</div>`});
  if(!knows&&!sc.rev) it.push({ic:'🎭',l:'Contar meu segredo',s:'Pode aproximar, ou vazar',on:()=>scAct(()=>{ sc.sab[p.id]=1; if(R.chance(.35+p.bond/200)){ p.bond=clamp(p.bond+12); scStat('san',6); return R.pick([`${p.first} ficou em silêncio um tempão. Depois me abraçou e disse que sempre desconfiou.`,`${p.first} riu de nervoso, depois chorou, depois pediu para ver o poder. Agora somos cúmplices.`]); }
    p.bond=clamp(p.bond-12); if(R.chance(.4)){ scStat('sec',-20); return `${p.first} surtou e contou para alguém. A notícia está correndo.`; } return `${p.first} disse que precisa de um tempo para digerir isso.`; },p.first)});
  if(sc.rev||(sc.sab&&sc.sab[p.id])) it.push({ic:'🏠',l:'Levar para um esconderijo',s:'$5.000 · protege por 2 anos',dis:p.esc>=sc.dia||!canPay(5000),why:p.esc>=sc.dia?`${p.first} já está escondid${oaG(p.gender)}.`:'Não tenho $5.000.',on:()=>scAct(()=>{ S.me.money-=5000; p.esc=sc.dia+1; p.bond=clamp(p.bond-4); return `Levei ${p.first} para um apartamento seguro do outro lado da cidade. ${R.pick(['Reclamou do sofá, mas está viv'+oaG(p.gender)+'.','Ninguém sabe o endereço. Nem eu anotei.'])}`; },p.first)});
  it.push({sec:'Relação'},...base.items.slice(1)); return {title:p.first,items:it}; };
// Aliados: equipe, vida pessoal e amor da vida real
V.scCrew=(o=>()=>{ const r=o(); const sc=S.scen; if(!sc||sc.id!=='heroi') return r; hEnsure(sc); const m=S.me, t=hTeam(), it=[];
  it.push({sec:'Equipe'}); if(t) it.push({ic:t.ic,l:t.n,s:`${jobTitle(m.job)} · ${fmt(jobSalary(m.job))}/ano`,on:()=>UI.push(V.hTeam)}); else it.push({ic:'🛡️',l:'Entrar para uma equipe',s:'Conta como emprego',on:()=>UI.push(V.hTeams)});
  it.push({sec:'Vida pessoal'}); const fam=famAll().filter(p=>!['namoro','noivo','conjuge'].includes(p.rel)||!partners().includes(p));
  fam.forEach(p=>it.push({face:faceSVG(p,40),l:`${p.first} ${p.last}`,s:`${relLabel(p)}${sc.sab[p.id]||sc.rev?' · sabe quem eu sou':''}${p.esc>=sc.dia?' · escondid'+oaG(p.gender):''}`,bars:[['❤️',p.bond,'#E5487D']],on:()=>UI.push(()=>V.hPessoa(p))}));
  if(!fam.length) it.push({html:'<div class="card"><p style="color:var(--muted)">Sem família por perto.</p></div>'});
  it.push({ic:'👥',l:'Todas as relações',s:'Amigos, colegas, ex',on:()=>UI.push(V.relReal)});
  const love=[]; if(m.age>=16){ love.push({ic:'💘',l:'Procurar alguém',s:'Na vida civil, sem máscara',on:()=>dateFlow(false)}); if(m.age>=18) love.push({ic:'📱',l:'Aplicativo de namoro',s:'Com um nome que não é o de herói',on:()=>dateFlow(true)}); }
  const i=r.items.findIndex(x=>x.sec==='Amor'); r.items.splice(i>=0?i:1,0,...it); const j=r.items.findIndex(x=>x.sec==='Aliados'); r.items.splice(j>=0?j:r.items.length,0,...love); return r; })(V.scCrew);
V.relations=(o=>{ V.relReal=()=>{ const sv=S.scen; S.scen=null; try{ return o(); } finally{ S.scen=sv; } }; return o; })(V.relations);
// Ações: carreira de herói, Lei de Registro e identidade
V.scActs=(o=>()=>{ const r=o(); const sc=S.scen; if(!sc||sc.id!=='heroi') return r; hEnsure(sc); const m=S.me, t=hTeam();
  const it=[{sec:'Carreira e identidade'},t?{ic:t.ic,l:t.n,s:`${jobTitle(m.job)} · desempenho ${m.job.perf}%`,on:()=>UI.push(V.hTeam)}:{ic:'🛡️',l:'Entrar para uma equipe',s:'Conta como emprego',on:()=>UI.push(V.hTeams)}];
  it.push({html:`<div class="card">${kv('Identidade',sc.rev?'Revelada':`Secreta (${sc.sec}%)`)}${kv('Lei de Registro',sc.reg?fill(HREG[sc.reg]).replace(/\{o\}/g,oa()):'Ainda não existe')}${sc.reg==='nao'?bar('Caçada da polícia',sc.proc):''}</div>`});
  const i=r.items.findIndex(x=>x.sec==='Vida real'); r.items.splice(i>=0?i:r.items.length,0,...it); return r; })(V.scActs);
Object.assign(SCEN.heroi.acts,{
  sumir:{ic:'🕳️',l:'Sumir do radar',s:'Diminui a caçada da polícia',min:sc=>sc.reg==='nao',why:'Ninguém está me caçando.',fn:sc=>{ sc.proc=Math.max(0,sc.proc-rnd(12,18)); scStat('crime',4); return R.pick(['Passei o dia num porão, sem usar o poder nem o celular.','Troquei de esconderijo três vezes. A polícia perdeu meu rastro.','Fiquei em casa vendo novela. Herói procurado também descansa.']); }},
  registrar:{ic:'📝',l:'Me registrar na Lei',s:'Acaba a caçada · o governo saberá quem sou',min:sc=>sc.reg==='nao'||sc.reg==='prazo',why:'Não preciso.',fn:sc=>{ const multa=sc.reg==='nao'?10000:0; if(multa&&!canPay(multa)) return 'Preciso de $10.000 para pagar a multa do atraso.'; S.me.money-=multa; sc.reg='sim'; sc.proc=0; if(hTeam()&&HTEAMS[S.me.job.hero].reg===0) return 'Me registrei. '+hFire(sc,'Os Sentinelas me chamaram de traidor.'); return `Entreguei meu nome, endereço e DNA.${multa?' Paguei a multa de '+fmt(multa)+'.':''} A perseguição acabou.`; }},
  fingir:{ic:'⚰️',l:'Fingir a própria morte',s:'Identidade volta a ser secreta · custa caro',ap:3,min:sc=>!!sc.rev,why:'Minha identidade ainda é secreta.',fn:sc=>{ sc.rev=0; sc.sec=70; sc.rep=Math.min(sc.rep,25); const old=sc.codinome; sc.codinome=R.pick(Object.values(CODI).flat().filter(x=>x!==old)); famAll().forEach(p=>{ if(!sc.sab[p.id]) p.bond=clamp(p.bond-15); }); scStat('san',-12); return `Encenei minha morte numa explosão no porto. ${old} morreu. Agora a cidade conhece ${sc.codinome}, que ninguém sabe quem é. A família chorou num enterro de caixão vazio.`; }},
});
SCEN.heroi.acts.disfarce.min=sc=>!sc.rev; SCEN.heroi.acts.disfarce.why='Não adianta mais: todo mundo já sabe quem eu sou.';
// ---------- dia a dia ----------
heroiUpkeep=function(sc){ const m=S.me; hEnsure(sc);
  if(!sc.rev){ scStat('sec',-4+sc.traje+(sc.reg==='sim'?1:0)); if(sc.sec<=0) hRevela(sc,'Minha identidade secreta vazou. Meu rosto está em todos os jornais.'); } else sc.sec=0;
  scStat('crime',5); scStat('rep',-1);
  if(sc.crime>=85&&R.chance(.5)){ scStat('rep',-6); scLog('A cidade está um caos. Picharam "CADÊ VOCÊ?" no prédio da prefeitura.','warn'); }
  if(R.chance(.12)){ scHurt(rnd(5,12)); scLog(`${sc.inimigo} atacou a cidade durante a noite. Lutei até o amanhecer.`,'warn'); }
  // equipe = emprego
  const j=m.job; if(j&&j.hero){ j.perf=clamp(j.perf-4); if(j.perf<=15&&!sc.hDem){ sc.hDem=1; queue('h_demissao',{}); } }
  // Lei de Registro
  if(!sc.reg&&sc.dia>=sc.leiD){ sc.reg='votando'; queue('h_lei',{}); }
  if(sc.reg==='prazo'&&sc.dia>=sc.regAte) queue('h_prazo',{});
  if(sc.reg==='nao'){ sc.proc=Math.min(100,sc.proc+2+Math.round(sc.rep/40)); if(sc.proc>=55&&R.chance((sc.proc-40)/120)&&!sc.cerco){ sc.cerco=1; queue('h_cerco',{}); } }
  if(sc.reg==='sim'&&!sc.rev&&R.chance(sc.fake?.03:.015)){ if(sc.fake){ sc.fake=0; sc.reg='nao'; sc.proc=50; scLog('O governo descobriu que meu registro tinha nome falso. Agora sou procurad'+oa()+'.','bad'); } else hRevela(sc,'Hackers invadiram o banco de dados da Lei de Registro. Minha ficha vazou com nome, foto e endereço.'); }
  if(sc.rgrav&&sc.dia>=sc.rgrav.due) queue('h_nasce',{pid:sc.rgrav.pid});
  // família na mira
  if(sc.rev&&!sc.famEv){ const p=famPick(sc); if(p&&R.chance(.18+(sc.pista>50?.06:0))){ sc.famEv=1; queue('h_familia',{pid:p.id,tp:R.pick(p.age<14?['escola','sequestro','casa']:['sequestro','casa','trabalho','ameaca'])}); } }
  sc.loc=SM().place(sc); };
scenEnd=(o=>function(win,txt){ const sc=S.scen, m=S.me; const r=o.apply(this,arguments); if(sc&&sc.id==='heroi'&&m.job&&m.job.hero&&!S.scen){ const n=m.job.co; endJob(); log(`Deixei a ${n} quando pendurei a capa.`,'warn'); } return r; })(scenEnd);
// ---------- eventos especiais ----------
const relDe=p=>{ const l=relLabel(p).toLowerCase(); const f=['mae','avo','irmao','filho','adot','namoro','noivo','conjuge'].includes(p.rel)&&p.gender==='F'; return (f||p.rel==='mae'?'minha ':'meu ')+l; };
EVENTS.h_lei={scen:'heroi',show:()=>({k:'Superpoderes',t:'Lei de Registro aprovada',x:'O Congresso aprovou a Lei de Registro de Super-Humanos. Todo herói precisa entregar ao governo nome verdadeiro, endereço e DNA. Quem atuar sem registro comete crime e pode ser preso.',ch:[['Registrar minha identidade','s'],['Me recusar (vira crime)','n'],['Registrar com nome falso','f'],['Pensar até o fim do prazo (1 ano)','p']]}),
  pick:k=>{ const sc=S.scen; if(!sc) return ''; hEnsure(sc); const t=hTeam();
    if(k==='p'){ sc.reg='prazo'; sc.regAte=sc.dia+1; return 'Tenho até o ano que vem para decidir. A cidade está dividida.'; }
    if(k==='f'){ if(pct(.35+S.me.smarts/250)){ sc.reg='sim'; sc.fake=1; return 'Registrei um nome inventado, com um endereço de uma lavanderia. Passou. Por enquanto.'; } k='n'; sc.proc=30; }
    if(k==='s'){ sc.reg='sim'; scStat('rep',4); let x='Fui à delegacia de máscara e saí sem ela. Agora o governo sabe quem eu sou.'; if(t&&HTEAMS[S.me.job.hero].reg===0) x+=' '+hFire(sc,'Os Sentinelas me chamaram de traidor.'); return x; }
    sc.reg='nao'; sc.proc=Math.max(sc.proc,25); scStat('rep',R.chance(.5)?6:-6); let x='Recusei. Para metade da cidade virei símbolo de liberdade; para a polícia, virei criminoso.'; if(t&&HTEAMS[S.me.job.hero].reg) x+=' '+hFire(sc,'A equipe segue a lei.'); if(t&&S.me.job==null&&HTEAMS.afc===t) sc.proc+=25; return x; }};
EVENTS.h_prazo={scen:'heroi',show:()=>({k:'Superpoderes',t:'O prazo acabou',x:'O prazo terminou. A partir de agora, quem não tiver registro passa a ser procurado.',ch:[['Registrar agora','s'],['Continuar sem registro','n']]}),
  pick:k=>{ const sc=S.scen; if(!sc) return ''; const t=hTeam(); if(k==='s'){ sc.reg='sim'; let x='Me registrei no último minuto. Fila de três horas, de máscara.'; if(t&&HTEAMS[S.me.job.hero].reg===0) x+=' '+hFire(sc,'Os Sentinelas me chamaram de traidor.'); return x; }
    sc.reg='nao'; sc.proc=Math.max(sc.proc,25); let x='Não fui. A partir de hoje, sou procurad'+oa()+'.'; if(t&&HTEAMS[S.me.job.hero].reg) x+=' '+hFire(sc,'A equipe segue a lei.'); return x; }};
EVENTS.h_cerco={scen:'heroi',show:()=>({k:'Superpoderes',t:'Cercad'+oa()+'!',x:'A Força-Tarefa Anti-Vigilantes cercou o prédio. Helicópteros, atiradores e um megafone: "Você está pres'+oa()+' por atuar sem registro".',ch:[['Lutar para sair','l'],['Fugir pelos telhados','f'],['Me render','r']]}),
  pick:k=>{ const sc=S.scen, m=S.me; if(!sc) return ''; sc.cerco=0;
    if(k==='l'&&pct(scPow()/100)){ sc.proc=Math.min(100,sc.proc+10); scStat('rep',-8); m.karma=clamp(m.karma-4); scHurt(rnd(6,14)); return 'Derrubei uma viatura e saí pelo buraco. Agora sou procurad'+oa()+' e perigos'+oa()+'.'; }
    if(k==='f'&&pct(.35+sc.pw/200)){ sc.proc=Math.max(0,sc.proc-10); return 'Pulei de telhado em telhado até perder os helicópteros.'; }
    if(k!=='r'&&R.chance(.3)){ scHurt(rnd(15,25)); sc.proc=Math.max(0,sc.proc-5); return 'Escapei por um triz, ferid'+oa()+', no meio da fumaça.'; }
    const txt=k==='r'?'Levantei as mãos. Me colocaram algemas especiais que anulam o poder.':'Não deu. Uma rede de energia me derrubou. Acordei algemad'+oa()+'.';
    return txt+' '+hPrisao(sc); }};
EVENTS.h_demissao={scen:'heroi',show:()=>({k:'Superpoderes',t:'Chamad'+oa()+' na sala do chefe',x:`A liderança da ${S.me.job&&S.me.job.co||'equipe'} diz que meu desempenho está péssimo e que estou faltando às missões.`,ch:[['Prometer melhorar','p'],['Pedir demissão antes','d'],['Reclamar do chefe','r']]}),
  pick:k=>{ const sc=S.scen, j=S.me.job; if(!sc||!j||!j.hero) return ''; sc.hDem=0;
    if(k==='p'&&R.chance(.6)){ j.perf=35; return 'Ganhei uma última chance. Melhor não desperdiçar.'; }
    if(k==='d'){ const n=j.co; endJob(); return `Pedi demissão da ${n}. Pelo menos saí com dignidade.`; }
    return hFire(sc,k==='r'?'Reclamar do chefe na frente dele não ajudou.':''); }};
EVENTS.h_revelada={scen:'heroi',show:()=>({k:'Superpoderes',t:'Todo mundo sabe quem eu sou',x:`Meu nome verdadeiro está na TV, ao lado de "${S.scen?S.scen.codinome:'meu codinome'}". Vizinhos na porta, repórteres no muro. E ${S.scen?S.scen.inimigo:'meu arqui-inimigo'} também está assistindo.`,ch:[['Assumir em público','a'],['Negar tudo na TV','n'],['Esconder a família','e']]}),
  pick:k=>{ const sc=S.scen, m=S.me; if(!sc) return '';
    if(k==='a'){ scStat('rep',10); m.fame=clamp(m.fame+10); scStat('san',4); return 'Fiz um pronunciamento sem máscara. Metade da cidade aplaudiu. A outra metade quer meu endereço.'; }
    if(k==='n'){ if(pct(sc.car/120)){ sc.rev=0; sc.sec=25; return 'Apareci na TV ao lado de um "sósia" que contratei. Colou. Por enquanto.'; } scStat('rep',-6); return 'Neguei com a voz tremendo. Ninguém acreditou.'; }
    const fam=famAll(); const custo=Math.max(5000,fam.length*5000); if(!canPay(custo)) return `Não tenho ${fmt(custo)} para esconder todo mundo. Escondi só quem deu.`; m.money-=custo; fam.forEach(p=>{ p.esc=sc.dia+1; p.bond=clamp(p.bond-5); }); return `Gastei ${fmt(custo)} em esconderijos. A família está segura, e furiosa por ter largado tudo.`; }};
EVENTS.h_familia={scen:'heroi',show:d=>{ const sc=S.scen, p=P(d.pid), v=sc?sc.inimigo:'O vilão'; const quem=p?`${relDe(p)}, ${p.first}`:'alguém da família';
    const x={sequestro:`${v} sequestrou ${quem}. Mandou um vídeo: troca pela minha rendição, no porto, à meia-noite.`,casa:`Capangas de ${v} invadiram a casa de ${quem}. Estão lá dentro agora.`,trabalho:`Uma bomba foi plantada no trabalho de ${quem}. O relógio marca dez minutos.`,ameaca:`${v} mandou flores para ${quem}, com um bilhete: "Bonita família, ${S.me.first}".`,escola:`${v} invadiu a escola de ${quem}. As crianças estão trancadas no ginásio.`}[d.tp]||`${v} atacou ${quem}.`;
    const ch=d.tp==='ameaca'?[['Esconder '+(p?p.first:'a família'),'e'],['Ir atrás do vilão primeiro','v'],['Ignorar a ameaça','i']]:[['Ir sozinh'+oa()+' agora','s'],[hTeam()||crew().length?'Chamar a equipe':'Chamar a polícia','t'],['Me entregar no lugar','r']];
    if(d.tp==='sequestro') ch.push(['Pagar um resgate','p']);
    return {k:'Superpoderes',t:'Atacaram minha família',x,ch}; },
  pick:(k,d)=>{ const sc=S.scen, m=S.me; if(!sc) return ''; sc.famEv=0; const p=P(d.pid); if(!p||!p.alive) return '';
    if(d.tp==='ameaca'){ if(k==='e'){ if(canPay(5000)){ m.money-=5000; p.esc=sc.dia+1; return `Levei ${p.first} para longe. As flores foram para o lixo.`; } return 'Sem dinheiro para um esconderijo. Fiquei de vigia na porta a noite toda.'; }
      if(k==='v'){ scStat('pista',15); if(pct(scPow()/110)){ scStat('rep',6); return 'Fui atrás dos capangas que entregaram as flores. Agora sei onde fica um dos esconderijos.'; } scHurt(rnd(10,18)); return 'Era armadilha. Apanhei, mas saí com uma pista.'; }
      if(R.chance(.5)){ sc.famEv=0; return famHurt(p,rnd(25,45))+' Não era só uma ameaça.'; } return 'Nada aconteceu. Ainda.'; }
    if(k==='p'){ const v=rnd(40,120)*1000; if(canPay(v)&&R.chance(.7)){ m.money-=v; p.bond=clamp(p.bond+5); return `Paguei ${fmt(v)}. ${p.first} foi solt${oaG(p.gender)} num ponto de ônibus, assustad${oaG(p.gender)}, mas inteir${oaG(p.gender)}.`; } k='s'; }
    if(k==='r'){ scHurt(rnd(25,40)); scStat('san',-10); scStat('pista',25); p.bond=clamp(p.bond+15); return `Me entreguei. Soltaram ${p.first}. Passei a noite apanhando acorrentad${oa()}, mas vi o covil inteiro. E fugi de madrugada.`; }
    const bonus=k==='t'?(hTeam()?.18:crew().length?.12:sc.reg==='nao'?-.1:.06):0;
    if(pct(scPow()/100+bonus-.05)){ p.bond=clamp(p.bond+15); scStat('rep',8); scStat('pista',10); return k==='t'&&sc.reg==='nao'&&!hTeam()&&!crew().length?`A polícia veio, salvou ${p.first}, e tentou me prender também. Fugi.`:`Cheguei a tempo. ${p.first} está a salvo, tremendo nos meus braços.`; }
    if(R.chance(.4)) return famDie(p,`num ataque de ${sc.inimigo}`)+' Cheguei tarde demais.';
    return famHurt(p,rnd(30,55))+' Cheguei tarde. Por pouco não perco.'; }};
// ---------- linguagem dos eventos ----------
// hteam:id (convite para entrar) · hperf±n · hpromo · hfire · proc±n · reg:sim|nao · rev (identidade revelada) · sab (o {p} passa a saber)
// famhurt famdie esc (no {p}) · hcrew (alguém da equipe vira parceiro)
scTok=(o=>function(tok,d,out){ const sc=S.scen; let mm; if(!sc||sc.id!=='heroi') return o(tok,d,out); hEnsure(sc); const m=S.me, j=m.job&&m.job.hero?m.job:null, p=d&&typeof d.pid==='number'?P(d.pid):null;
  if(mm=tok.match(/^hteam:(\w+)$/)){ const t=HTEAMS[mm[1]]; if(t&&!(j&&j.hero===mm[1])){ if(t.reg&&sc.reg==='nao') out.push(`A ${t.n} descobriu que não tenho registro e retirou o convite.`); else { if(m.job) endJob(); m.job={hero:mm[1],lvl:0,perf:60,yrs:0,co:t.n}; sc.hxp=0; sc.hPay=sc.dia; if(t.reg===2) { sc.reg='sim'; sc.proc=0; } out.push(`Agora sou ${jobTitle(m.job).toLowerCase()} da ${t.n}, com salário de ${fmt(jobSalary(m.job))} por ano.`); } } return true; }
  if(mm=tok.match(/^hperf([+-]\d+)$/)){ if(j) j.perf=clamp(j.perf+ +mm[1]); return true; }
  if(tok==='hpromo'){ if(j&&j.lvl<HRANK.length-1){ j.lvl++; sc.hxp=0; out.push(`Promovid${oa()} a ${jobTitle(j).toLowerCase()}!`); } return true; }
  if(tok==='hfire'){ if(j) out.push(hFire(sc,'')); return true; }
  if(mm=tok.match(/^proc([+-]\d+)$/)){ if(sc.reg==='nao') sc.proc=Math.max(0,Math.min(100,sc.proc+ +mm[1])); return true; }
  if(mm=tok.match(/^reg:(sim|nao)$/)){ sc.reg=mm[1]; if(mm[1]==='sim'){ sc.proc=0; if(j&&HTEAMS[j.hero].reg===0) out.push(hFire(sc,'Os Sentinelas me chamaram de traidor.')); } else { sc.proc=Math.max(sc.proc,25); if(j&&HTEAMS[j.hero].reg) out.push(hFire(sc,'A equipe segue a lei.')); } return true; }
  if(tok==='rev'){ hRevela(sc,'Minha identidade foi revelada.'); return true; }
  if(tok==='sab'){ if(p) sc.sab[p.id]=1; return true; }
  if(tok==='famhurt'){ if(p) out.push(famHurt(p,rnd(25,45))); return true; }
  if(tok==='famdie'){ if(p) out.push(famDie(p,`por causa de ${sc.inimigo}`)); return true; }
  if(tok==='esc'){ if(p) p.esc=sc.dia+1; return true; }
  if(tok==='rnoivo'){ if(p&&p.rel==='namoro'&&polyPodeOficializar(p)){ p.rel='noivo'; p.bond=clamp(p.bond+10); out.push(`Estou noiv${oa()} de ${p.first}!`); } return true; }
  if(tok==='rcasar'){ if(p&&['namoro','noivo'].includes(p.rel)&&polyPodeOficializar(p)){ p.rel='conjuge'; p.yrs=0; cnt('marriages'); S.flags.movedOut=1; out.push(`Casei com ${p.first}!`); } return true; }
  if(tok==='rgrav'){ if(p&&!sc.rgrav&&p.gender!==m.gender&&(m.gender==='F'?m:p).age<=46){ sc.rgrav={pid:p.id,due:sc.dia+1}; out.push(m.gender==='F'?'Estou grávida!':`${p.first} está grávida!`); } return true; }
  if(tok==='hcrew'){ const c=mkCrew(); out.push(`${c.first} agora patrulha comigo.`); return true; }
  return o(tok,d,out); })(scTok);
scChance=(o=>function(key){ const sc=S.scen; if(sc&&sc.id==='heroi'){ const j=S.me.job; if(key==='perf') return j&&j.hero?j.perf:30; if(key==='proc') return sc.proc||0; } return o(key); })(scChance);
scVar=(o=>function(k){ const sc=S.scen; if(sc&&sc.id==='heroi'){ const j=S.me.job; if(k==='equipe') return j&&j.hero?j.co:'a equipe'; if(k==='cargo') return j&&j.hero?jobTitle(j).toLowerCase():'herói'; } return o(k); })(scVar);
const HW=f=>m=>!!S.scen&&S.scen.id==='heroi'&&f(hEnsure(S.scen),m);
EVENTS.h_nasce={scen:'heroi',show:d=>{ const p=P(d.pid); return {k:'Família',t:'Vai nascer!',x:S.me.gender==='F'?'A bolsa estourou no meio de uma patrulha. Tirei a máscara no táxi a caminho da maternidade.':`${p?p.first:'Meu amor'} ligou: a bolsa estourou. Eu estava pendurad${oa()} num helicóptero.`,ch:[['Largar tudo e correr para a maternidade','c'],['Terminar o resgate primeiro','r']]}; },
  pick:(k,d)=>{ const sc=S.scen, m=S.me; if(!sc) return ''; sc.rgrav=null; const par=P(d.pid); const gd=R.chance(.5)?'F':'M';
    const kid=mkPerson({rel:'filho',gender:gd,age:0,last:m.last,bond:R.int(85,100),parentId:par?par.id:null,from:par?[m,par]:undefined}); uniqFirst(kid); S.people.push(kid); cnt('kids'); st('happy',15);
    if(k==='r'){ scStat('rep',6); if(par) par.bond=clamp(par.bond-15); }
    if(par) par.bond=clamp(par.bond+(k==='c'?10:0)); scStat('san',15);
    famLog(`${gd==='F'?'Minha filha':'Meu filho'} ${kid.first} nasceu!`,'good');
    return `${gd==='F'?'Nasceu uma menina':'Nasceu um menino'}: ${kid.first}. ${k==='c'?'Cheguei a tempo de segurar a mão no parto.':'Cheguei dez minutos depois. Ainda ouço essa história até hoje.'}`; }};
ageUp=(o=>function(){ const m=S&&S.me; if(m&&m.job&&m.job.hero&&!(S.scen&&S.scen.id==='heroi')) endJob(); return o.apply(this,arguments); })(ageUp);
// ---------- o modo herói passa por ano e não tem fim: só acaba quando você pendura a capa ----------
Object.assign(SCEN.heroi,{day:'Ano',maxDays:Infinity,yl:y=>y.yr?`${y.yr} · ${y.age} anos`:`Ano ${y.d}`,
  d:'Um raio, um laboratório e um poder novo. A vida segue ano a ano, com família, amor e emprego, agora com uma capa no armário. Entre para uma equipe, proteja sua identidade e enfrente vilões. Não tem fim: só acaba quando você se aposentar.',
  tabs:['Bairro','Equipamento','Próximo ano','Aliados','Ações']});
SCEN.heroi.acts.aposentar.fn=sc=>{ scenEnd(true,'Pendurei a capa. Guardei a máscara numa caixa no fundo do armário e voltei a ser só eu.'); return ''; };
SCEN.heroi.acts.aposentar.s='Volta para a vida normal';
yearWork=(o=>function(){ const m=S.me, j=m.job; if(j&&j.hero){ j.yrs++; m.job=null; try{ return o.apply(this,arguments); } finally{ m.job=j; } } return o.apply(this,arguments); })(yearWork);
function heroYear(){ const sc=S.scen, m=S.me, d=SM(); hEnsure(sc);
  sc.dia++; sc.ap=3; sc.done={}; sc.log.push({d:sc.dia,pl:'',lines:[],age:m.age+1});
  // a vida real anda um ano: idade, família, saúde, dinheiro e salário da equipe
  const ye=yearEvents, pend=S.pending; yearEvents=function(){}; S.pending=[]; try{ if(AGE0) AGE0(); } finally{ yearEvents=ye; S.pending=pend.concat(S.pending); }
  if(!m.alive||!S.scen) return;
  Object.assign(sc.log[sc.log.length-1],{age:m.age,yr:S.year});
  scStat('san',rnd(4,10)); scStat('hl',rnd(25,40));
  crew().forEach(c=>{ c.age++; if(c.bebe&&c.age>=16){ c.bebe=0; c.race=c.race&&/filh/i.test(c.race)?c.race:c.race; c.role=R.pick(Object.keys(d.roles)); } });
  d.upkeep(sc); if(!S.scen) return;
  sc.log[sc.log.length-1].pl=sc.loc.n;
  romDay(sc);
  scEvents(1+(R.chance(.6)?1:0)); }
scNextDay=(o=>function(){ const sc=S.scen; if(sc&&sc.id==='heroi'&&sc.v===SC_V) return heroYear(); return o.apply(this,arguments); })(scNextDay);
// cair em combate não acaba a vida de herói: vai para o hospital (e a saúde de verdade sente)
scCheck=(o=>function(){ const sc=S.scen, m=S.me; if(!sc||sc.id!=='heroi'||sc.winNow) return o.apply(this,arguments);
  if(sc.hl<=0){ sc.hl=45; st('health',-rnd(3,8)); scStat('san',-8); scLog('Apaguei no meio da luta. Acordei na UTI, com tubos no braço e a máscara no bolso de alguém da equipe.','bad'); if(m.health<=0){ S.scen=null; die(`em combate como ${sc.codinome}`); UI.close(); return; } }
  if(sc.san<=0){ sc.san=30; st('happy',-15); scLog('Desabei. Passei semanas sem conseguir vestir o uniforme. Terapia, remédio e muito sono.','bad'); } })(scCheck);
EVENTS.heroi_final={scen:'heroi',show:()=>({k:'Superpoderes',t:'O último confronto',x:`${S.scen?S.scen.inimigo:'O vilão'} está de joelhos, sem poderes, cercado pela polícia. A cidade inteira assiste ao vivo.`,ch:[['Entregar à justiça','j'],['Oferecer uma segunda chance','c'],['Acabar com isso de vez','m'],['Entregar e pendurar a capa','a']]}),
  pick:k=>{ const sc=S.scen, m=S.me; if(!sc) return ''; const old=sc.inimigo; m.fame=clamp(m.fame+8); scStat('rep',15);
    if(k==='a'){ scenEnd(true,`${old} foi para a cadeia de segurança máxima. No dia seguinte, pendurei a capa. A cidade aprendeu a se virar.`); return ''; }
    if(k==='m'){ m.karma=clamp(m.karma-25); sc.evil=1; scStat('rep',-25); }
    if(k==='c') m.karma=clamp(m.karma+10);
    sc.venc=0; sc.pista=0; sc.inimigo=R.pick(VILOES.filter(v=>v!==old));
    const t=k==='m'?'A cidade ficou em silêncio. Muita gente deixou de me chamar de herói.':k==='c'?(R.chance(.5)?`Anos depois, ${old} abriu uma ONG para jovens. Fui à inauguração, de máscara.`:`Foi um erro. ${old} fugiu na mesma noite.`):'Algemas, flashes e aplausos.';
    return `${t} Mas a paz durou pouco: um vilão novo apareceu nos jornais. ${sc.inimigo}.`; }};
// prisão para super-humanos: os anos passam lá dentro, e a vida de herói continua quando sair
function hPrisao(sc){ const m=S.me, n=rnd(1,3); let t=hFire(sc,'');
  for(let i=0;i<n&&m.alive;i++){ sc.dia++; sc.log.push({d:sc.dia,pl:'Prisão de Contenção',lines:[],age:m.age+1,yr:S.year+1}); const ye=yearEvents, pend=S.pending; yearEvents=function(){}; S.pending=[]; try{ if(AGE0) AGE0(); } finally{ yearEvents=ye; S.pending=pend.concat(S.pending); } if(!S.scen||!m.alive) return 'Não saí viv'+oa()+' da Prisão de Contenção.'; scLog('Mais um ano numa cela com algemas que anulam o poder.','bad'); crew().forEach(c=>c.age++); }
  if(!S.scen||!m.alive) return '';
  m.rec.conv++; m.c.prisonYrs=(m.c.prisonYrs||0)+n; sc.reg='sim'; sc.proc=0; sc.rep=Math.max(0,sc.rep-15); scStat('san',-15); famAll().forEach(p=>p.bond=clamp(p.bond-8));
  return `Fui condenad${oa()} a ${n} ano${n>1?'s':''} na Prisão de Contenção para Super-Humanos. Saí registrad${oa()} à força, com o nome na ficha. ${t}`.trim(); }
// morrer de verdade (velhice, doença) encerra o modo junto com a vida
die=(o=>function(){ const r=o.apply(this,arguments); if(S&&S.scen&&S.me&&!S.me.alive) S.scen=null; return r; })(die);
scStart=(o=>function(id){ const r=o.apply(this,arguments); const sc=S.scen; if(sc&&sc.id==='heroi'&&sc.log[0]) Object.assign(sc.log[0],{age:S.me.age,yr:S.year}); return r; })(scStart);
