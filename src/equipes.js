// ===== Membros das equipes: clube ou time da escola, trabalho, carreira especial, equipe de heróis e grupo religioso =====
// Cada equipe tem gente de verdade (rel 'equipe'): dá para conversar, fazer amizade, namorar ou brigar, como qualquer pessoa.
REL_LABEL.equipe='Colega de equipe';
relLabel=(o=>p=>p&&p.rel==='equipe'&&p.grpRole?`${g(p.grpRole,p.gender)}${p.grpN?' · '+p.grpN:''}`:o(p))(relLabel);
const grpMembers=key=>people('equipe').filter(p=>p.grp===key);
function grpEnsure(key,n,o){ S.flags.gn=S.flags.gn||{}; if(S.flags.gn[key]==null&&n>0) S.flags.gn[key]=n; n=S.flags.gn[key]||0; let have=grpMembers(key); for(let i=have.length;i<n;i++){ const p=mkPerson({rel:'equipe',age:o.age(),bond:R.int(25,55)}); p.grp=key; p.grpN=o.n; p.grpRole=o.role; S.people.push(p); } return grpMembers(key); }
function grpClean(prefix,keep){ people('equipe').filter(p=>p.grp&&p.grp.startsWith(prefix)&&p.grp!==keep).forEach(p=>p.alive=false); }
V.grp=(key,title,o)=>()=>{ const ms=grpEnsure(key,o.size,o); const it=[{html:`<div class="card"><p>${esc(o.intro||'Gente com quem você convive todo dia. Converse, ajude, faça amizade, ou faça inimigos.')}</p>${kv('Membros',ms.length)}${kv('Já são meus amigos',people('amigo').filter(p=>p.grp===key).length)}</div>`},{sec:'Membros da equipe'}];
  ms.sort((a,b)=>b.bond-a.bond).forEach(p=>it.push(personRow(p))); const amigos=people('amigo').filter(p=>p.grp===key);
  if(amigos.length){ it.push({sec:'Viraram amigos'}); amigos.forEach(p=>it.push(personRow(p))); }
  return {title,items:it}; };
// ---------- clube ou time da escola ----------
const clubKey=()=>S.me.edu.club?'club:'+S.me.edu.club:null;
V.clubMenu=(o=>()=>{ const r=o(); const m=S.me, c=clubDef(); if(!c||!r||!r.items) return r; const key=clubKey(); grpClean('club:',key);
  const role=c.st==='athletic'?'Colega de time':c.st==='musical'?'Colega de banda':'Colega de clube';
  const i=r.items.findIndex(x=>x.l==='Sair do clube'); r.items.splice(i>=0?i:r.items.length,0,{ic:'👥',l:'Membros da equipe',s:`${grpEnsure(key,R.int(6,9),{n:c.n,role,age:()=>clamp(m.age+R.int(-1,1),5,30)}).length} pessoas · faça amizade`,on:()=>UI.push(V.grp(key,c.n,{size:0,n:c.n,role,age:()=>m.age,intro:`O pessoal do ${c.n.toLowerCase()}. Treinos, viagens, vitórias e derrotas juntos.`}))});
  return r; })(V.clubMenu);
clubAct=(o=>function(k){ const r=o.apply(this,arguments); if(k==='sair') grpClean('club:',null); return r; })(clubAct);
// ---------- trabalho ----------
const SPC_ROLE={ator:['Colega de elenco','o elenco'],musico:['Colega de banda','a banda'],atleta:['Colega de time','o time'],modelo:['Colega de agência','a agência'],militar:['Colega de pelotão','o pelotão'],crime:['Comparsa','a quadrilha'],comedia:['Colega de palco','o elenco'],escritor:['Colega da editora','a editora'],artista:['Colega de ateliê','o ateliê'],streamer:['Colega de stream','o grupo de streamers'],dj:['Colega de festa','a equipe de som'],camelo:['Colega de banca','a feira']};
V.jobMenu=(o=>()=>{ const r=o(); const m=S.me, j=m.job; if(!j||!r||!r.items) return r;
  const i=r.items.findIndex(x=>x.l==='Colegas e chefe'); if(i>=0) r.items.splice(i,1);
  if(!j.spc&&!j.hero){ trabEnsure(); r.items.splice(Math.min(2,r.items.length),0,{ic:'👥',l:'Membros da equipe',s:`Chefe e ${people('colegaT').length} colegas · faça amizade`,on:()=>UI.push(V.trabalho)}); }
  if(j.spc&&SPC_ROLE[j.spc]){ const key='spc:'+j.spc+':'+j.co, sr=SPC_ROLE[j.spc]; grpClean('spc:',key);
    r.items.splice(Math.max(0,r.items.length-1),0,{ic:'👥',l:'Membros da equipe',s:`Conhecer ${sr[1]}`,on:()=>UI.push(V.grp(key,j.co,{size:R.int(5,8),n:j.co,role:sr[0],age:()=>clamp(m.age+R.int(-8,12),16,80),intro:`O pessoal de ${j.co}.`}))}); }
  return r; })(V.jobMenu);
// ---------- equipe de heróis ----------
V.hTeam=(o=>()=>{ const r=o(); const m=S.me, j=m.job; if(!j||!j.hero||!r||!r.items) return r; const t=HTEAMS[j.hero], key='hero:'+j.hero; grpClean('hero:',key);
  const i=r.items.findIndex(x=>x.l==='Sair da equipe'); r.items.splice(i>=0?i:r.items.length,0,{ic:'👥',l:'Membros da equipe',s:'Os heróis da equipe · faça amizade (ou rivalidade)',on:()=>UI.push(V.grp(key,t.n,{size:R.int(5,8),n:t.n,role:'Herói da equipe|Heroína da equipe',age:()=>R.int(19,55),intro:`Os heróis da ${t.n}. Cada um com um codinome, um poder e um segredo.`}))});
  return r; })(V.hTeam);
// ---------- grupo religioso ----------
V.seita=(o=>()=>{ const r=o(); const m=S.me, s=m.seita; if(!s||!r||!r.items) return r; const key='seita:'+s.n; grpClean('seita:',key); const role=s.membro?'Irmão de fé|Irmã de fé':'Fiel';
  const i=r.items.findIndex(x=>x.sec==='Sair'||x.l==='Dissolver o grupo'); r.items.splice(i>=0?i:r.items.length,0,{ic:'👥',l:s.membro?'Irmãos de fé':'Fiéis mais próximos',s:'Gente de verdade do grupo · faça amizade',on:()=>UI.push(V.grp(key,s.n,{size:R.int(5,8),n:s.n,role,age:()=>R.int(18,75),intro:s.membro?`Quem senta perto de você nos cultos de ${s.n}.`:`Os fiéis mais devotos de ${s.n}. Eles fariam qualquer coisa por você.`}))});
  return r; })(V.seita);
// quem sai da equipe deixa de conviver com os colegas (os amigos continuam)
endJob=(o=>function(){ const j=S.me&&S.me.job; const r=o.apply(this,arguments); if(j&&j.hero) grpClean('hero:',null); if(j&&j.spc) grpClean('spc:',null); return r; })(endJob);
yearMoney=(o=>function(){ const r=o.apply(this,arguments); try{ const m=S.me; if(!m.seita) grpClean('seita:',null); if(!m.edu.club) grpClean('club:',null); people('equipe').forEach(p=>{ if(p.age>=99) p.alive=false; }); }catch(e){} return r; })(yearMoney);
// ---------- turma e professores: aparecem na escola, não nas relações ----------
REL_LABEL.prof='Professor|Professora';
function turmaKey(){ const c=S.me.edu.cur; return c?`esc:${c.n}:${c.yr||0}`:null; }
function turmaEnsure(){ const m=S.me, c=m.edu.cur; if(!c) return {profs:[],cols:[]}; const key=turmaKey();
  people('prof').filter(p=>p.grp!==key).forEach(p=>p.alive=false);
  let profs=people('prof').filter(p=>p.grp===key); const np=c.type==='fund'&&c.yr<5?1:2;
  for(let i=profs.length;i<np;i++){ const p=mkPerson({rel:'prof',age:R.int(26,62),bond:R.int(35,60)}); p.grp=key; p.mat=R.pick(c.type==='uni'?['Cálculo','Teoria Geral','Metodologia','Estatística','Ética']:['Matemática','Português','História','Ciências','Geografia','Inglês','Educação Física','Artes']); S.people.push(p); profs.push(p); }
  /* a turma acompanha o curso inteiro: só os professores mudam a cada ano; quem vira amigo continua na turma e quem sai é substituído um a um */
  const curso=c.type+':'+c.n; people('colega').forEach(p=>{ if(!p.turma) p.turma=curso; });
  people('colega').filter(p=>p.turma!==curso).forEach(p=>p.alive=false); /* turma de um curso antigo não acompanha o novo */
  let cols=people('colega').concat(people('amigo').filter(p=>p.turma===curso&&p.fromTurma));
  if(c.type!=='fund'&&c.type!=='medio'){ S.flags.turmaN=S.flags.turmaN||{}; const alvo=S.flags.turmaN[curso]??(S.flags.turmaN[curso]=Math.max(cols.length,R.int(5,8)));
    for(let i=cols.length;i<alvo;i++){ const p=mkPerson({rel:'colega',age:clamp(m.age+R.int(-2,6),17,60),bond:R.int(20,55)}); p.turma=curso; S.people.push(p); cols.push(p); } }
  return {profs,cols}; }
relLabel=(o=>p=>p&&p.rel==='prof'&&p.mat?`${g('Professor|Professora',p.gender)} de ${p.mat}`:o(p))(relLabel);
V.turma=()=>{ const m=S.me, c=m.edu.cur; if(!c) return {title:'Turma',items:[{html:'<div class="card"><p>Não estou estudando.</p></div>'}]}; const t=turmaEnsure(), it=[];
  it.push({html:`<div class="card"><p><b>${esc(c.n)}</b></p>${kv('Colegas',t.cols.length)}${kv('Amigos que vieram da turma',people('amigo').filter(p=>p.fromTurma).length)}</div>`});
  it.push({sec:t.profs.length>1?'Professores':'Professor'}); t.profs.forEach(p=>it.push(personRow(p)));
  it.push({sec:'Colegas de turma'}); t.cols.sort((a,b)=>b.bond-a.bond).forEach(p=>it.push(personRow(p)));
  if(!t.cols.length) it.push({html:'<div class="card"><p style="color:var(--muted)">Ninguém na turma ainda.</p></div>'});
  return {title:'Turma',items:it}; };
V.career=(o=>()=>{ const r=o(); const m=S.me; if(!r||!r.items||!m.edu.cur||m.prison||(S.scen&&S.scen.v===SC_V)) return r; const i=r.items.findIndex(x=>x.l==='Estudar mais');
  r.items.splice(i>=0?i+1:r.items.length,0,{ic:'👥',l:'Membros da turma',s:'Professores e colegas · faça amizade',on:()=>UI.push(V.turma)}); return r; })(V.career);
// quem vira amigo a partir da turma fica marcado
interact=(o=>function(p,k,extra){ const was=p&&p.rel; const r=o.apply(this,arguments); if(p&&was==='colega'&&p.rel==='amigo') p.fromTurma=1; return r; })(interact);
// ---------- passar um tempo com todos ----------
function tempoTodos(){ const m=S.me; if(use('tempoTodos')>1) return 'Já reuni todo mundo este ano.';
  const ps=people('mae','pai','irmao','avo','namoro','noivo','conjuge','filho','adot','neto','amigo').filter(p=>p.age>=1||p.rel!=='neto'); if(!ps.length) return 'Não tenho família nem amigos por perto.';
  ps.forEach(p=>{ p.bond=clamp(p.bond+R.int(2,7)); p.yr.tempo=(p.yr.tempo||0)+1; }); st('happy',R.int(4,9)); cnt('actions'); cnt('tempoTodos');
  const fam=ps.filter(p=>p.rel!=='amigo').length, am=ps.length-fam;
  return `${R.pick(m.age<4?['Participei de um churrasco organizado pela minha família','Meus responsáveis prepararam um almoço em família','Minha família me levou a um piquenique no parque']:m.age<12?['Fui a um churrasco com meus responsáveis','Participei de um almoço em família','Brinquei num piquenique organizado pelos adultos']:m.age<18?['Ajudei os adultos a preparar um almoço em família','Ajudei meus responsáveis a organizar um piquenique','Participei dos preparativos de uma noite de jogos']:['Fiz um churrasco no quintal','Organizei um almoço de domingo','Juntei todo mundo para um piquenique no parque','Fizemos uma noite de jogos de tabuleiro','Alugamos um sítio para o fim de semana'])} com ${fam?fam+(fam>1?' pessoas da família':' pessoa da família'):''}${fam&&am?' e ':''}${am?am+(am>1?' amigos':' amigo'):''}. ${R.pick(m.age<4?['Recebi carinho e atenção da família.','Brinquei enquanto os adultos conversavam.']:['Rimos até doer a barriga.','Foi o melhor dia do ano.','Guardamos boas lembranças do encontro.'])}`; }
V.relations=(o=>()=>{ const r=o(); if(!r||!r.items||(S.scen&&S.scen.v===SC_V)) return r; if(S.me.prison) return r; r.items.splice(1,0,{ic:'🫂',l:'Passar um tempo com todos',s:'Família e amigos juntos · todo mundo fica mais próximo',on:()=>act(tempoTodos,'Família e amigos')}); return r; })(V.relations);
// ---------- equipe do trabalho: chefe e colegas aparecem no emprego, não nas relações ----------
function trabEnsure(){ const m=S.me, j=m.job; if(!j||j.spc||j.hero) return; S.flags.gn=S.flags.gn||{}; const key='trab:'+j.co+':'+j.id, want=S.flags.gn[key]??(S.flags.gn[key]=R.int(5,8));
  for(let i=people('colegaT').length;i<want;i++) S.people.push(mkPerson({rel:'colegaT',age:clamp(m.age+R.int(-10,15),16,70),bond:R.int(25,55)}));
  if(!people('chefe').length) S.people.push(mkPerson({rel:'chefe',age:clamp(m.age+R.int(3,25),25,75),bond:R.int(35,60)})); }
V.trabalho=()=>{ const m=S.me, j=m.job; if(!j) return {title:'Equipe',items:[{html:'<div class="card"><p>Não tenho emprego.</p></div>'}]}; trabEnsure();
  const it=[{html:`<div class="card"><p><b>${esc(j.co)}</b></p>${kv('Cargo',jobTitle(j))}${kv('Colegas',people('colegaT').length)}${kv('Amigos que vieram do trabalho',people('amigo').filter(p=>p.fromJob).length)}</div>`}];
  const ch=people('chefe'); if(ch.length){ it.push({sec:ch.length>1?'Chefes':'Chefe'}); ch.forEach(p=>it.push(personRow(p))); }
  it.push({sec:'Colegas de equipe'}); people('colegaT').sort((a,b)=>b.bond-a.bond).forEach(p=>it.push(personRow(p)));
  const am=people('amigo').filter(p=>p.fromJob); if(am.length){ it.push({sec:'Viraram amigos'}); am.forEach(p=>it.push(personRow(p))); }
  return {title:'Equipe do trabalho',items:it}; };
interact=(o=>function(p,k,extra){ const was=p&&p.rel; const r=o.apply(this,arguments); if(p&&was==='colegaT'&&p.rel==='amigo') p.fromJob=1; return r; })(interact);

function turmaSelfTest(){const s0=S,rf=R.f,ns=window.NO_SAVE;let x=21;R.f=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};const ok=(v,t)=>{if(!v)throw Error('Turma · '+t);};try{window.NO_SAVE=true;newLife({country:'BR'});const m=S.me;m.age=18;m.born=S.year-18;m.edu.deg=['fund','medio'];m.edu.cur={type:'uni',id:COURSES[0].id,n:COURSES[0].n,len:4,yr:0,grade:70,cost:0};
 const t0=turmaEnsure(),ids=t0.cols.map(p=>p.id),profs=t0.profs.map(p=>p.id);ok(ids.length>=5,'turma pequena');
 // dois colegas viram amigos e um sai: a turma continua quase a mesma
 const [a,b,c]=people('colega');a.rel='amigo';a.fromTurma=1;b.rel='amigo';b.fromTurma=1;c.alive=false;
 m.edu.cur.yr=1;const t1=turmaEnsure();ok(t1.cols.length===ids.length,'tamanho da turma mudou');ok(ids.filter(id=>t1.cols.some(p=>p.id===id)).length===ids.length-1,'turma trocada em vez de completada');ok(!t1.profs.some(p=>profs.includes(p.id)),'professores não mudaram no novo ano');
 // novo curso, turma nova
 m.edu.cur={type:'post',id:POSTS[0].id,n:POSTS[0].n,len:2,yr:0,grade:70,cost:0};const t2=turmaEnsure();ok(!t2.cols.some(p=>ids.includes(p.id)&&p.rel==='colega'),'colegas antigos foram para o novo curso');
 return {ok:true};}finally{S=s0;R.f=rf;window.NO_SAVE=ns;}}
