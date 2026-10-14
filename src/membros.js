// ===== Membros aleatórios em tudo: gabinete, empresa, realeza, equipe de heróis e os moradores dos mundos paralelos =====
const OF_ROLE={ver:'Assessor de gabinete|Assessora de gabinete',dep:'Assessor parlamentar|Assessora parlamentar',pref:'Secretário municipal|Secretária municipal',gov:'Secretário de Estado|Secretária de Estado',pres:'Ministro|Ministra'};
const ROYAL_ROLES=['Conselheiro real|Conselheira real','Cavalheiro da corte|Dama da corte','Mordomo real|Governanta real','Guarda real','Bobo da corte','Tesoureiro real|Tesoureira real'];
const DIT_ROLES=['Ministro|Ministra','General|Generala','Chefe de segurança','Secretário particular|Secretária particular'];
// cada pessoa do grupo ganha uma função sorteada; heróis ganham codinome e poder
grpEnsure=(o=>function(key,n,opt){ const r=o(key,n,opt); r.forEach(p=>{ if(!p.grpRoleFix){ if(opt&&opt.roles) p.grpRole=R.pick(opt.roles); p.grpRoleFix=1; } if(key.startsWith('hero:')&&!p.codinome){ p.codinome=R.pick(Object.values(CODI).flat()); p.poder=R.pick(POWERS); } }); return r; })(grpEnsure);
relLabel=(o=>p=>p&&p.rel==='equipe'&&p.codinome?`${p.codinome} · ${p.poder}`:o(p))(relLabel);
V.career=(o=>()=>{ const r=o(); const m=S.me; if(!r||!r.items||m.prison||(S.scen&&S.scen.v===SC_V)) return r; const it=r.items;
  const at=(sec,item)=>{ const i=it.findIndex(x=>x.sec===sec); if(i>=0) it.splice(i+2,0,item); };
  const j=m.job; if(j&&!j.hero){ const i=it.findIndex(x=>x.l==='Meu emprego'); const sr=j.spc&&SPC_ROLE[j.spc];
    if(i>=0) it.splice(i+1,0,sr?{ic:'👥',l:'Membros da equipe',s:`Conhecer ${sr[1]}`,on:()=>UI.push(V.grp('spc:'+j.spc+':'+j.co,j.co,{size:R.int(5,8),n:j.co,role:sr[0],age:()=>clamp(m.age+R.int(-8,12),16,80),intro:`O pessoal de ${j.co}.`}))}:{ic:'👥',l:'Membros da equipe',s:'Chefe e colegas · faça amizade',on:()=>UI.push(V.trabalho)}); }
  if(m.office){ const dit=!!m.office.dit, key='office:'+m.office.id+(dit?':dit':''); grpClean('office:',key);
    at('Mandato',{ic:'👥',l:dit?'Ministros e generais':'Equipe do gabinete',s:'Quem governa comigo · aliados ou traidores',on:()=>UI.push(V.grp(key,dit?'Governo':'Gabinete',{size:R.int(5,9),n:dit?'Governo':'Gabinete',role:dit?'Ministro|Ministra':OF_ROLE[m.office.id]||'Assessor|Assessora',roles:dit?DIT_ROLES:null,age:()=>R.int(25,70),intro:'A equipe que governa com você. Lealdade aqui vale ouro.'}))}); }
  if(m.royal&&!m.royal.abd){ const key='corte:'+m.royal.house;
    at('Realeza',{ic:'👥',l:'A corte',s:'Conselheiros, damas, guardas e mordomos',on:()=>UI.push(V.grp(key,'A corte',{size:R.int(6,10),n:'Corte '+m.royal.house,role:'Membro da corte',roles:ROYAL_ROLES,age:()=>R.int(20,75),intro:'Quem vive no palácio com você. Uns leais, outros ambiciosos.'}))}); }
  if(m.biz){ const b=m.biz, key='biz:'+b.n; grpClean('biz:',key);
    at('Minha empresa',{ic:'👥',l:'Funcionários',s:`${b.emp} na folha · conheça a equipe`,on:()=>UI.push(V.grp(key,b.n,{size:Math.max(3,Math.min(12,b.emp||5)),n:b.n,role:'Funcionário|Funcionária',roles:['Funcionário|Funcionária','Gerente','Estagiário|Estagiária','Vendedor|Vendedora','Analista','Atendente'],age:()=>R.int(18,65),intro:`Quem faz ${b.n} funcionar todo dia.`}))}); }
  return r; })(V.career);
// equipe de heróis também na aba Aliados
V.scCrew=(o=>()=>{ const r=o(); const sc=S.scen, m=S.me; if(!sc||sc.id!=='heroi'||!r||!r.items) return r; const j=m.job; if(!j||!j.hero) return r; const t=HTEAMS[j.hero], key='hero:'+j.hero;
  const i=r.items.findIndex(x=>x.l===t.n); const opt={n:t.n,role:'Herói da equipe|Heroína da equipe',age:()=>R.int(19,55),intro:`Os heróis da ${t.n}. Cada um com um codinome, um poder e um segredo.`};
  if(i>=0) r.items.splice(i+1,0,{ic:'👥',l:'Membros da equipe',s:`${grpEnsure(key,R.int(5,8),opt).length} heróis · faça amizade (ou rivalidade)`,on:()=>UI.push(V.grp(key,t.n,Object.assign({size:0},opt)))});
  return r; })(V.scCrew);
// ---------- mundos paralelos: moradores aleatórios da base, da vila e da cidade ----------
const ZPROF=['ex-motorista de ônibus','ex-enfermeiro|ex-enfermeira','ex-professor|ex-professora','ex-pedreiro|ex-pedreira','ex-cabeleireiro|ex-cabeleireira','ex-bancário|ex-bancária','ex-cozinheiro|ex-cozinheira','ex-estudante','ex-policial','ex-vendedor|ex-vendedora','ex-mecânico|ex-mecânica','ex-advogado|ex-advogada','ex-jogador de futebol|ex-jogadora de futebol','ex-carteiro|ex-carteira'];
const IPROF=['ferreiro|ferreira','padeiro|padeira','tecelão|tecelã','camponês|camponesa','caçador|caçadora','curandeiro|curandeira','bardo|barda','mercador|mercadora','pescador|pescadora','carpinteiro|carpinteira','aprendiz de mago|aprendiz de maga','guarda da vila'];
function scGente(key,n){ const sc=S.scen; sc.pp=sc.pp||{}; const L=sc.pp[key]=sc.pp[key]||[]; const fant=!!SM().names; n=Math.max(0,Math.min(40,Math.round(n)));
  while(L.length<n){ const gd=R.chance(.5)?'F':'M'; const p=fant?mkPerson({rel:'tmp',gender:gd,age:rnd(14,80),first:R.pick(gd==='F'?FANT_F:FANT_M),last:R.pick(FANT_L)}):mkPerson({rel:'tmp',gender:gd,age:rnd(8,80)});
    L.push({id:'g'+(++sc.cid),first:p.first,last:p.last,gender:gd,age:p.age,genes:p.genes,look:p.look,lv:rnd(20,60),race:fant?R.pick(RACES[gd]):null,prof:g(R.pick(fant?IPROF:ZPROF),gd)}); }
  while(L.length>n) L.splice(rnd(0,L.length-1),1); return L; }
function scGenteModal(key,p){ const sc=S.scen; modal({top:faceSVG(p,88),t:`${p.first} ${p.last}`,x:`${p.race?p.race[0].toUpperCase()+p.race.slice(1)+', ':''}${p.prof}, ${p.age} anos.`,ch:[
  {l:'Conversar',fn:()=>{ p.lv=Math.min(100,p.lv+rnd(5,12)); scStat('san',2); MQ.unshift({t:p.first,x:R.pick([`${p.first} contou como era a vida antes de tudo isso.`,`${p.first} riu de uma piada boba. Fazia tempo que ninguém ria assim.`,`${p.first} me ensinou um truque do tempo de ${p.prof}.`])}); }},
  {l:'Chamar para o grupo',fn:()=>{ if(p.age<16) return MQ.unshift({t:p.first,x:`${p.first} ainda é muito nov${p.gender==='F'?'a':'o'} para isso.`}); if(p.lv<45||!R.chance(p.lv/100)){ p.lv=Math.max(0,p.lv-5); return MQ.unshift({t:p.first,x:`${p.first} prefere ficar onde está, por enquanto.`}); }
    const c=mkCrew({first:p.first,last:p.last,gender:p.gender,age:p.age}); c.genes=p.genes; c.look=p.look; if(p.race) c.race=p.race; sc.pp[key]=sc.pp[key].filter(x=>x!==p);
    if(sc.zb&&key==='zbase') sc.zb.pop=Math.max(0,sc.zb.pop-1); if(sc.vila&&key==='vila') sc.vila.pop=Math.max(0,sc.vila.pop-1);
    MQ.unshift({t:p.first,x:`${p.first} juntou as coisas e agora anda com o grupo.`}); }},
  {l:'Voltar',cls:'alt'}]}); }
V.scGente=(key,title,n,intro)=>()=>{ const sc=S.scen; if(!sc) return null; const L=scGente(key,n()), it=[{html:`<div class="card"><p>${esc(intro)}</p>${kv('Moradores',L.length)}</div>`},{sec:'Moradores'}];
  L.slice().sort((a,b)=>b.lv-a.lv).forEach(p=>it.push({face:faceSVG(p,40),l:`${p.first} ${p.last}`,s:`${p.race?p.race+' · ':''}${p.prof} · ${p.age} anos`,bars:[['🤝',p.lv,'#3FA0B8']],on:()=>scGenteModal(key,p)}));
  if(!L.length) it.push({html:'<div class="card"><p style="color:var(--muted)">Ninguém por aqui ainda.</p></div>'});
  return {title,items:it}; };
V.zBase=(o=>()=>{ const r=o(); const sc=S.scen; if(!sc||!sc.zb||!r||!r.items) return r; r.items.splice(1,0,{ic:'👥',l:'Moradores da base',s:`${sc.zb.pop} pessoas · converse e recrute`,on:()=>UI.push(V.scGente('zbase',sc.zb.nome,()=>sc.zb?sc.zb.pop:0,`Quem vive em ${sc.zb.nome}, cada um com uma história de antes do fim do mundo. Mostrando até 40.`))}); return r; })(V.zBase);
V.iskVila=(o=>()=>{ const r=o(); const sc=S.scen; if(!sc||!sc.vila||!r||!r.items) return r; r.items.splice(1,0,{ic:'👥',l:'Moradores da vila',s:`${sc.vila.pop} moradores · converse e recrute`,on:()=>UI.push(V.scGente('vila',sc.vila.nome,()=>sc.vila?sc.vila.pop:0,`Quem vive em ${sc.vila.nome}. Mostrando até 40 moradores.`))}); return r; })(V.iskVila);
V.iskLar=(o=>()=>{ const r=o(); const sc=S.scen; if(!sc||sc.vila||!r||!r.items) return r; const t=townOf(sc); if(!t) return r; r.items.splice(1,0,{ic:'👥',l:'Gente da cidade',s:'Vizinhos, artesãos e aventureiros',on:()=>UI.push(V.scGente('town:'+sc.morada,t[0],()=>12,`Quem você conhece em ${t[0]}.`))}); return r; })(V.iskLar);
