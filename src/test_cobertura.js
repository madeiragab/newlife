// Cobertura explícita: cada escolha de cada evento avulso que fica elegível em vidas variadas é executada,
// e o relatório diz quantas escolhas rodaram e quantas não foram alcançadas.
function coberturaEventosSelfTest(limiteMs=60000){
 const s0=S,meta=JSON.stringify(META),snaps=SNAPS,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,_modal=modal;window.NO_SAVE=true;window.NO_NEWS=true;modal=()=>{};
 const BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/,falhas=[],feitas=new Set(),T0=Date.now();
 const seed=s=>{let x=s>>>0||1;R.f=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};};
 const ids=Object.keys(EVENTS).filter(id=>!id.startsWith('cad_')&&EVENTS[id].w&&!EVENTS[id].scen),spcs=Object.keys(SPECIAL);
 let total=0;const opcoes={};
 const vida=i=>{seed(9000+i);newLife({country:R.pick(COUNTRIES).id,royal:i%9===0});S.scen=null;const m=S.me,age=R.pick([3,5,8,13,16,19,21,24,30,38,46,55,63,72,84]);m.age=age;m.born=S.year-age;
  for(const k of Object.keys(m.talent))m.talent[k]=R.chance(.4)?R.int(60,100):R.int(0,59);m.fame=R.chance(.3)?R.int(35,100):R.int(0,20);m.money=R.pick([300,20000,300000,4e6]);m.karma=R.int(0,100);m.health=R.int(25,100);m.will=R.int(5,100);
  if(age<18)startSchool(age<15?'fund':'medio');else{m.lic=R.chance(.7);if(R.chance(.2)){const k=R.pick(spcs);m.job={spc:k,lvl:R.int(0,SPECIAL[k].l.length-1),perf:R.int(20,90),yrs:R.int(0,10)};}else if(age<70&&R.chance(.8)){takeJob({id:R.pick(JOBS.filter(j=>!j.pt)).id,co:'Teste',size:'média',mul:1});m.job.perf=R.int(10,95);m.job.yrs=R.int(0,15);}
   if(R.chance(.6)){const c=mkPerson({rel:R.pick(['namoro','noivo','conjuge','conjuge']),gender:m.gender==='M'?'F':'M',age,bond:R.int(20,95)});c.yrs=R.int(0,10);S.people.push(c);if(age>=26&&R.chance(.7))S.people.push(mkPerson({rel:'filho',age:R.int(0,Math.min(40,age-20)),bond:R.int(30,95),parentId:c.id}));}
   if(R.chance(.35))try{buy('casa',houseListings()[0],false);}catch(e){}if(R.chance(.3)){const l=typeof carListings==='function'?carListings():null;if(l&&l[0])try{buy('carro',l[0],false);}catch(e){}}
   if(R.chance(.15))try{m.money=Math.max(m.money,300000);openBiz(R.pick(BIZ_SECTORS),'Teste');}catch(e){}if(age>=25&&R.chance(.1)){const o=R.pick(OFFICES);m.office={id:o.id,yrs:R.int(0,4),appr:R.int(10,90)};}
   if(R.chance(.12))m.prison={left:4,total:5,served:1,behav:R.int(20,80),crime:'roubo',juv:false};}
  if(age>=13&&R.chance(.4))m.social={f:R.pick([50,5000,500000]),u:'@teste'};if(R.chance(.5))S.people.push(mkPerson({rel:'amigo',age,bond:R.int(20,90)}));
  if(R.chance(.45))try{addPet(R.pick(['Cachorro','Gato','Papagaio','Iguana','Cobra','Hamster','Calopsita','Cavalo','Macaco','Tartaruga']));}catch(e){}
  // estados dos sistemas que liberam famílias inteiras de eventos
  const pega=(o,k,l)=>{o[k]=R.pick(l);};
  try{if(age>=18&&!m.prison){
   if(R.chance(.18)){seitaFundar(R.pick(Object.keys(SEITA_TIPOS)),'Teste');const t=m.seita;if(t){pega(t,'fieis',[5,60,600,6000,60000]);pega(t,'devo',[20,50,80,95]);pega(t,'caixa',[0,20000,500000,5e6]);pega(t,'susp',[0,30,60,90]);pega(t,'fama',[0,20,50,90]);pega(t,'templo',[0,1,3,6]);t.anos=R.int(0,15);}}
   else if(R.chance(.12)){seitaEntrar();const t=m.seita;if(t){t.cargo=R.int(0,4);t.xp=R.int(0,200);pega(t,'devo',[20,60,95]);pega(t,'susp',[5,40,80]);}}
   if(R.chance(.12)){revStart('Teste');const r=m.rev;if(r){pega(r,'apoio',[2,20,50,90]);pega(r,'mil',[0,10,50,90]);pega(r,'armas',[0,10,50,90]);pega(r,'susp',[0,30,70,95]);pega(r,'membros',[5,50,500,5000]);r.anos=R.int(0,8);}}
   else if(R.chance(.1)){m.office={id:'pres',yrs:R.int(0,12),appr:R.int(5,95),dit:1};m.c.golpe=1;}
   else if(R.chance(.06))m.c.golpe=1;
   if(R.chance(.15)){m.para={prova:R.int(0,12),vistos:{},visitas:R.int(1,8)};}
   if(R.chance(.15)){m.criatura=R.pick(['vampiro','lobisomem']);m.fomeP=R.int(0,95);m.criaturaIdade=age-R.int(0,10);}
   if(R.chance(.08)){const k=kids()[0]||partners()[0];if(k)k.criatura=R.pick(['vampiro','lobisomem']);}
   if(R.chance(.12)&&age<=45){m.job=null;takeJob({id:'poli',co:'Polícia Civil',size:'grande',mul:1});m.job.lvl=R.int(0,4);m.job.perf=R.int(20,90);}
   if(R.chance(.1))m.c.fugitive=1;if(R.chance(.15))m.c.trips=R.int(1,6);if(R.chance(.1))m.c.divorces=1;if(R.chance(.1))m.c.widow=1;
   for(const k of ['alcool','cigarro','jogo'])if(R.chance(.12))m.add[k]=R.int(45,90);
   if(R.chance(.2)){const ds=Object.keys(DISEASES).filter(d=>DISEASES[d].p);addDisease(R.pick(ds));}
   if(R.chance(.15)&&age<=45)S.people.push(mkPerson({rel:'filho',age:R.int(0,1),bond:90}));}
  if(m.prison&&R.chance(.3))m.c.golpe=1;
  if(age>=6&&age<18&&R.chance(.5))try{joinClub(R.pick(CLUBS));}catch(e){}
   if(age>=18&&age<=27&&!m.prison&&R.chance(.55)){const tipo=R.pick(['uni','uni','tec','post']);const lista=tipo==='uni'?COURSES:tipo==='tec'?TECHS:POSTS;const c=R.pick(lista);m.edu.cur={type:tipo,id:c.id,n:c.n,len:c.yrs||4,yr:R.int(0,Math.max(0,(c.yrs||4)-1)),grade:R.int(40,90),pub:R.chance(.5),cost:0};if(tipo==='post')m.edu.deg.push('uni:'+R.pick(COURSES).id);}
   if(R.chance(.25))m.edu.deg.push('uni:'+R.pick(COURSES).id);
   if(age>=14&&age<18&&R.chance(.2))m.prison={left:2,total:3,served:1,behav:50,crime:'furto',juv:true};
   if(age>=62&&R.chance(.6)){m.job=null;m.ret={pension:R.int(9000,40000)};}
   if(age>=15&&age<=22&&!m.job&&R.chance(.4)){const pt=JOBS.filter(j=>j.pt);if(pt.length)try{takeJob({id:R.pick(pt).id,co:'Bico',size:'pequena',mul:1});}catch(e){}}
   if(R.chance(.45))S.people.push(mkPerson({rel:'ex',age:Math.max(14,age+R.int(-3,3)),bond:R.int(5,60)}));
   if(age>=50&&R.chance(.6))S.people.push(mkPerson({rel:'neto',age:R.int(0,20),bond:R.int(40,95)}));
   if(R.chance(.5))S.people.push(mkPerson({rel:'irmao',age:Math.max(1,age+R.int(-6,6)),bond:R.int(20,90)}));
   for(const p of parents()){p.age=age+R.int(18,40);if(R.chance(.12))p.alive=false;}
  if(typeof grpAuto==='function')grpAuto();}catch(e){}
  S.pending=[];return JSON.stringify(S);};
 try{
  for(let i=0;i<500&&Date.now()-T0<limiteMs*.6;i++){const snap=vida(i),preso=!!JSON.parse(snap).me.prison;
   for(const id of ids){const ev=EVENTS[id];if(!!ev.jail!==preso)continue;S=JSON.parse(snap);seed(11);let ok=false;try{ok=!ev.when||ev.when(S.me);}catch(e){}if(!ok)continue;
    let d,sh;try{d=ev.prep?ev.prep(S.me):{};if(d==null)continue;sh=ev.show(d);}catch(e){falhas.push(id+': '+e.message);continue;}
    opcoes[id]=Math.max(opcoes[id]||0,(sh.ch||[]).length);
    (sh.ch||[]).forEach((c,ci)=>{const chave=id+'#'+ci;if(feitas.has(chave))return;S=JSON.parse(snap);seed(13+ci);
     try{const d2=ev.prep?ev.prep(S.me):{};const s2=ev.show(d2);const r=ev.pick(s2.ch[ci][1],d2);feitas.add(chave);
      [s2.t,s2.x,s2.ch[ci][0],r].forEach(x=>{if(BAD.test(String(x??'')))falhas.push(chave+' texto: '+String(x).slice(0,90));});
      if(!Number.isFinite(S.me.money))falhas.push(chave+': dinheiro inválido');}catch(e){falhas.push(chave+': '+e.message);}});}}
  // fase 2: para cada evento ainda não alcançado, procurar a combinação certa de profissão, país, curso, seita e casos raros
  const executa=(id,snap)=>{const ev=EVENTS[id];S=JSON.parse(snap);seed(11);let d,sh;try{d=ev.prep?ev.prep(S.me):{};if(d==null)return false;sh=ev.show(d);}catch(e){falhas.push(id+': '+e.message);return true;}
   opcoes[id]=Math.max(opcoes[id]||0,(sh.ch||[]).length);
   (sh.ch||[]).forEach((c,ci)=>{const chave=id+'#'+ci;if(feitas.has(chave))return;S=JSON.parse(snap);seed(13+ci);
    try{const d2=ev.prep?ev.prep(S.me):{};const s2=ev.show(d2);const r=ev.pick(s2.ch[ci][1],d2);feitas.add(chave);[s2.t,s2.x,s2.ch[ci][0],r].forEach(x=>{if(BAD.test(String(x??'')))falhas.push(chave+' texto: '+String(x).slice(0,90));});if(!Number.isFinite(S.me.money))falhas.push(chave+': dinheiro inválido');}catch(e){falhas.push(chave+': '+e.message);}});return true;};
  const base=(age,pais,royal,mod)=>{seed(age*13+(pais||'').length);newLife({country:pais||'BR',royal:!!royal});S.scen=null;const m=S.me;m.age=age;m.born=S.year-age;m.money=2e6;m.fame=60;m.lic=age>=18;m.karma=50;for(const k of Object.keys(m.talent))m.talent[k]=80;
   if(age<15)startSchool(age<6?'fund':'fund');else if(age<18)startSchool('medio');
   if(age>=20){const c=mkPerson({rel:'conjuge',gender:m.gender==='M'?'F':'M',age,bond:60});c.yrs=6;S.people.push(c);if(age>=40)S.people.push(mkPerson({rel:'filho',age:age-22,bond:70,parentId:c.id}),mkPerson({rel:'neto',age:5,bond:80}));if(age>=26)S.people.push(mkPerson({rel:'filho',age:Math.max(1,age-26),bond:70,parentId:c.id}));}
   S.people.push(mkPerson({rel:'amigo',age,bond:60}),mkPerson({rel:'ex',age,bond:30}),mkPerson({rel:'irmao',age:age+2,bond:60}));for(const p of parents())p.age=age+30;
   try{mod(m);}catch(e){}if(typeof grpAuto==='function')try{grpAuto();}catch(e){}S.pending=[];return JSON.stringify(S);};
  const candidatos=[];
  for(const age of [16,25,35,50,68])for(const j of JOBS)candidatos.push([age,null,0,m=>{m.job=null;takeJob({id:j.id,co:'Teste',size:'média',mul:1});m.job.lvl=R.int(0,2);m.job.perf=60;m.job.yrs=4;}]);
  for(const age of [25,40])for(const k of Object.keys(SPECIAL))candidatos.push([age,null,0,m=>{m.job={spc:k,lvl:1,perf:60,yrs:4};}]);
  // ator com cada especialização (eventos próprios de ação, terror, dublagem, ficção científica e novela)
  for(const e of (typeof ESPEC_ATOR!=='undefined'?ESPEC_ATOR:[]))candidatos.push([30,null,0,m=>{m.job={spc:'ator',lvl:1,perf:60,yrs:4,esp:e};}]);
  for(const c of COUNTRIES)for(const age of [12,25,45,70])candidatos.push([age,c.id,0,m=>{if(age>=18){m.job=null;takeJob({id:JOBS.find(j=>!j.pt&&!j.spc&&!jobReqs(j).length).id,co:'Teste',size:'média',mul:1});}}]);
  for(const c of COURSES)for(const yr of [0,2,4])candidatos.push([21,null,0,m=>{m.edu.cur={type:'uni',id:c.id,n:c.n,len:5,yr,grade:70,pub:yr===2,cost:0};}]);
  for(const t of TECHS)candidatos.push([19,null,0,m=>{m.edu.cur={type:'tec',id:t.id,n:t.n,len:t.yrs||2,yr:(t.yrs||2)-1,grade:70,cost:0};}]);
  for(const fieis of [5,60,600,6000,60000])for(const fama of [0,50,95])for(const templo of [0,3,6])for(const caixa of [0,5e6])for(const devo of [20,95])for(const susp of [0,95])
   candidatos.push([40,null,0,m=>{seitaFundar(Object.keys(SEITA_TIPOS)[(fieis+templo)%Object.keys(SEITA_TIPOS).length],'Teste');Object.assign(m.seita,{fieis,fama,templo,caixa,devo,susp,anos:templo*2});}]);
  for(const age of [15,22,35])candidatos.push([age,null,0,m=>{m.ident='trans';m.c.transicao=0;m.c.assumiu=0;}]);
  candidatos.push([30,'GB',1,m=>{if(m.royal){m.royal.reign=true;m.royal.abd=false;}}],[30,'JP',1,m=>{if(m.royal){m.royal.reign=true;}}]);
  for(const sp of ['Tigre','Leão'])candidatos.push([35,null,0,m=>{addPet(sp);}]);
  candidatos.push([45,null,0,m=>{m.job=null;takeJob({id:'poli',co:'Polícia',size:'grande',mul:1});m.job.lvl=2;m.job.perf=60;}]);
  const grade=(l)=>l[Math.floor(R.f()*l.length)];
  for(let k=0;k<60;k++)candidatos.push([R.pick([20,30,45,60]),null,0,m=>{seitaEntrar();if(m.seita)Object.assign(m.seita,{cargo:k%5,xp:(k%7)*40,devo:grade([20,60,95]),susp:grade([5,40,80]),fieis:grade([100,2000,20000]),caixa:grade([0,1e5,1e6]),fama:grade([5,40,80])});}]);
  for(let k=0;k<80;k++)candidatos.push([R.pick([20,30,45]),null,0,m=>{revStart('Teste');if(m.rev)Object.assign(m.rev,{apoio:grade([2,20,50,90]),mil:grade([0,10,50,90]),armas:grade([0,10,50,90]),susp:grade([0,30,70,95]),membros:grade([5,50,500,5000]),anos:k%8});}]);
  for(let k=0;k<60;k++)candidatos.push([R.pick([35,50,65]),null,0,m=>{m.office={id:'pres',yrs:k%12,appr:grade([5,30,60,90]),dit:1};m.c.golpe=1;}]);
  for(let k=0;k<40;k++)candidatos.push([R.pick([25,40,60]),null,0,m=>{m.para={prova:k%13,vistos:{},visitas:1+k%8};}]);
  for(const t of ['vampiro','lobisomem'])for(let k=0;k<30;k++)candidatos.push([R.pick([20,30,45,70]),null,0,m=>{m.criatura=t;m.fomeP=(k*7)%100;m.criaturaIdade=m.age-(k%10);const q=[kids()[0],partners()[0],parents()[0]][k%3];if(q&&k%2)q.criatura=t;}]);
  for(let k=0;k<20;k++)candidatos.push([R.pick([30,45,55,62]),null,0,m=>{m.c.golpe=1;m.office=null;m.rev=null;if(k%2)m.prison={left:5,total:8,served:3,behav:50,crime:'golpe de estado',juv:false};}]);
  for(const lvl of [0,1,2,3,4])candidatos.push([32,null,0,m=>{m.job=null;takeJob({id:'poli',co:'Polícia',size:'grande',mul:1});m.job.lvl=lvl;m.job.perf=60;m.edu.deg.push('uni:'+COURSES[0].id);}]);
  for(let k=0;k<20;k++)candidatos.push([R.pick([15,16,17]),null,0,m=>{m.prison={left:2,total:3,served:1,behav:grade([20,50,80]),crime:'furto',juv:true};}]);
  for(const id of Object.keys(DISEASES))candidatos.push([35,null,0,m=>{m.dis=[{id,y:1,ctrl:false,k:true}];}]);
  candidatos.push([40,null,0,m=>{m.money=5e6;openBiz(BIZ_SECTORS.slice().sort((a,b)=>b.cost-a.cost)[0],'Teste');if(m.biz){m.biz.value=Math.max(m.biz.value,500000);if(m.biz.capital!=null){m.biz.capital=400000;m.biz.caixa=100000;}}}]);
  for(const tipo of ['post','uni'])for(const yr of [0,1,3])candidatos.push([26,null,0,m=>{const c=tipo==='post'?POSTS[0]:COURSES[0];m.edu.cur={type:tipo,id:c.id,n:c.n,len:yr+1,yr,grade:70,pub:true,cost:0};m.edu.deg.push('uni:'+COURSES[0].id);}]);
  candidatos.push([40,null,0,m=>{m.c.divorces=1;S.people.push(mkPerson({rel:'ex',age:40,bond:30}),mkPerson({rel:'filho',age:10,bond:70}));}]);
  for(const sp of [...new Set(PET_SPECIES.map(x=>bxRaiz(x.s)))])candidatos.push([30,null,0,m=>{addPet(sp);}]);
  for(const sp of ['Hamster','Chinchila','Ouriço','Furão','Cachorro','Gato'])candidatos.push([30,null,0,m=>{const p=addPet(sp);if(p&&p.life)p.age=Math.max(0,p.life-1);}]);
  for(const yr of [2030,2028])for(const age of [10,16,25,40])candidatos.push([age,null,0,m=>{S.year=yr;m.born=yr-age;if(age>=18){m.job=null;takeJob({id:age===40?'poli':JOBS.find(j=>!j.pt&&!j.spc&&!jobReqs(j).length).id,co:'Teste',size:'média',mul:1});}if(age<18)m.edu.cur={type:age<15?'fund':'medio',n:'Escola',len:3,yr:1,grade:70};}]);
  for(const [pais,yr] of [['ES',2030],['PT',2030],['US',2028],['US',2026],['MX',2026]])candidatos.push([30,pais,0,m=>{S.year=yr;m.born=yr-30;try{buy('casa',houseListings()[0],false);}catch(e){}}]);
  for(const age of [17,18])candidatos.push([age,null,0,m=>{m.edu.cur={type:'medio',n:'Ensino Médio',len:3,yr:2,grade:70};}]);
  candidatos.push([35,null,0,m=>{m.job=null;takeJob({id:JOBS.find(j=>!j.pt&&!j.spc&&!jobReqs(j).length).id,co:'Teste',size:'média',mul:1});m.c.work=12;}]);
  for(const n of [1,3,6])for(const fieis of [6000,60000])candidatos.push([45,null,0,m=>{seitaFundar(Object.keys(SEITA_TIPOS)[0],'Teste');Object.assign(m.seita,{fieis,fama:80,templo:6,caixa:5e6,devo:80,susp:20,anos:12,dom:(typeof SEITA_DOM!=='undefined'?SEITA_DOM:['o bairro','a cidade','o estado','o país']).slice(0,n).map(x=>typeof x==='string'?x:x.n||x[0])});}]);
  for(let k=0;k<48;k++)candidatos.push([R.pick([25,40]),null,0,m=>{if(k%3===2){seitaEntrarEm(k%2?'dw':0);if(m.seita)Object.assign(m.seita,{cargo:k%5,conf:grade([20,70,95]),fe:60});return;}seitaFundar(Object.keys(SEITA_TIPOS)[k%4],'Teste');Object.assign(m.seita,{fieis:grade([2,300,5000]),online:grade([0,60]),seg:k%4,inim:grade([0,3]),caixa:grade([0,5e5]),devo:60,susp:30});if(k%2)m.seita.rival={n:'Templo Rival',lider:'Profeta Josué',forca:50};}]);
  for(const k of [0,1,2,3])candidatos.push([30,null,0,m=>{m.armas=[{id:k%2?'pistola':'faca',legal:!!(k&2),pais:m.country}];m.armaUso=m.armas[0].id;m.drogas={cocaina:k*25+20,maconha:60};}]);
  for(const lvl of [0,5,7])candidatos.push([26,null,0,m=>{m.job={spc:'lutador',lvl,perf:60,yrs:3,mod:lvl===5?'boxe':'mma'};}]);
  for(const age of [8,12])candidatos.push([age,null,0,m=>{const mae=people('mae')[0];if(!mae||!people('pai').length)return;S.flags.divorced=1;S.flags.guarda='mae';const q=mkPerson({rel:'padrasto',gender:'M',age:mae.age});q.padDe=mae.id;S.people.push(q);npcVida(mae).par=q.id;}]);
  for(const age of [3,4,5,7,10,62,66,75,80,88,95])candidatos.push([age,null,0,m=>{if(age>=62)m.ret={pension:20000};}]);
  for(const [age,pais,royal,mod] of candidatos){if(Date.now()-T0>limiteMs*4)break;const falta=ids.filter(id=>!opcoes[id]);if(!falta.length)break;
   const snap=base(age,pais,royal,mod),me=JSON.parse(snap).me;S=JSON.parse(snap);
   for(const id of falta){const ev=EVENTS[id];if(!!ev.jail!==!!me.prison)continue;S=JSON.parse(snap);let ok=false;try{ok=!ev.when||ev.when(S.me);}catch(e){}if(ok)executa(id,snap);}}
  total=Object.values(opcoes).reduce((a,b)=>a+b,0);
  if(falhas.length)throw Error('Eventos com problema: '+falhas.slice(0,8).join(' | '));
  const naoAlc=ids.filter(id=>!opcoes[id]);if(naoAlc.length)throw Error(naoAlc.length+' eventos nunca ficaram elegíveis: '+naoAlc.slice(0,10).join(', '));
  if(total>feitas.size)throw Error((total-feitas.size)+' escolhas não foram executadas');
  const r={eventos:ids.length,eventosAlcancados:Object.keys(opcoes).length,escolhasExecutadas:feitas.size,escolhasNaoExecutadas:Math.max(0,total-feitas.size),eventosNaoAlcancados:ids.length-Object.keys(opcoes).length,tempo:Date.now()-T0,faltam:ids.filter(id=>!opcoes[id]).map(id=>id+' · '+(EVENTS[id].cond||String(EVENTS[id].when||'').replace(/\s+/g,' ').slice(0,90)))};
  return r;
 }finally{S=s0;META=JSON.parse(meta);SNAPS=snaps;R.f=rf;window.NO_SAVE=ns;window.NO_NEWS=nn;modal=_modal;}
}
// Continuidade sob mudanças extremas: histórias começadas antes precisam reconhecer casamento, divórcio, emigração, cargo e falência.
function continuidadeExtremaSelfTest(){
 const s0=S,meta=JSON.stringify(META),snaps=SNAPS,rf=R.f,ns=window.NO_SAVE;window.NO_SAVE=true;let x=4321;R.f=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};const ok=(v,t)=>{if(!v)throw Error('Continuidade extrema · '+t);};
 try{newLife({country:'BR'});const m=S.me;m.age=32;m.born=S.year-32;m.money=200000;
  takeJob({id:JOBS.find(j=>!j.pt&&!j.spc&&!jobReqs(j).length).id,co:'Antiga',size:'média',mul:1});
  const st=cadState();const iniciar=id=>{ok(cadStart(id,true),'não iniciou '+id);return st.on[id];};
  const app=iniciar('app_namoro');cadPick('app_namoro','a',CHAINS.app_namoro.steps.a[2][0],app.d);
  const horta=iniciar('horta'),chefe=iniciar('chefe_abusivo'),food=iniciar('food_truck');
  // casa com outra pessoa: o romance do aplicativo não pode seguir
  const c=mkPerson({rel:'conjuge',gender:m.gender==='M'?'F':'M',age:32,bond:80});S.people.push(c);
  if(app.d.pid&&P(app.d.pid))ok(!cadContextoValido('app_namoro',app),'romance seguiu depois do casamento com outra pessoa');
  // vira presidente: deixa o emprego antigo e a história do chefe acaba
  endJob();m.office={id:OFFICES.at(-1).id,yrs:0,appr:60};ok(!cadContextoValido('chefe_abusivo',chefe),'história do chefe seguiu sem o emprego');
  // emigra: história do bairro termina
  m.country='PT';m.city=countryOf('PT').cities[0];ok(!cadContextoValido('horta',horta),'história do bairro seguiu em outro país');
  // perde a fortuna: escolha com custo não deixa o dinheiro negativo e a história espera
  m.money=0;const antes=food.s,r=cadPick('food_truck','a',CHAINS.food_truck.steps.a[2][0],food.d);ok(m.money>=0,'história deixou o dinheiro negativo');ok(/não tenho agora/.test(r)&&st.on.food_truck&&st.on.food_truck.s===antes,'história sem dinheiro não esperou');
  // divórcio: histórias do par terminam
  const so=iniciar('sogra');divorce(c,true);ok(!cadContextoValido('sogra',so),'história da sogra seguiu depois do divórcio');
  // um ano inteiro depois de tudo, sem erros e sem histórias inválidas na fila
  S.pending=[];ageUp();for(const e of S.pending)if(String(e.id).startsWith('cad_'))ok(evValid(e),'história inválida chegou à fila: '+e.id);
  return {casamento:true,cargo:true,emigracao:true,falencia:true,divorcio:true};
 }finally{S=s0;META=JSON.parse(meta);SNAPS=snaps;R.f=rf;window.NO_SAVE=ns;}
}
