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
  let cols=people('colega'); if(!cols.length&&c.type!=='fund'&&c.type!=='medio'){ for(let i=0;i<R.int(4,7);i++) S.people.push(mkPerson({rel:'colega',age:clamp(m.age+R.int(-2,6),17,60),bond:R.int(20,55)})); cols=people('colega'); }
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
  ps.forEach(p=>{ p.bond=clamp(p.bond+R.int(2,7)); p.yr.tempo=(p.yr.tempo||0)+1; }); st('happy',R.int(4,9)); cnt('actions');
  const fam=ps.filter(p=>p.rel!=='amigo').length, am=ps.length-fam;
  return `${R.pick(['Fiz um churrasco no quintal','Organizei um almoço de domingo','Juntei todo mundo para um piquenique no parque','Fizemos uma noite de jogos de tabuleiro','Alugamos um sítio para o fim de semana'])} com ${fam?fam+(fam>1?' pessoas da família':' pessoa da família'):''}${fam&&am?' e ':''}${am?am+(am>1?' amigos':' amigo'):''}. ${R.pick(['Rimos até doer a barriga.','Teve briga por causa de política, mas acabou em abraço.','Foi o melhor dia do ano.','Alguém chorou de emoção no brinde.'])}`; }
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
