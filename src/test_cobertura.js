// Cobertura explícita: cada escolha de cada evento avulso que fica elegível em vidas variadas é executada,
// e o relatório diz quantas escolhas rodaram e quantas não foram alcançadas.
function coberturaEventosSelfTest(limiteMs=60000){
 const s0=S,meta=JSON.stringify(META),snaps=SNAPS,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,_modal=modal;window.NO_SAVE=true;window.NO_NEWS=true;modal=()=>{};
 const BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/,falhas=[],feitas=new Set(),T0=Date.now();
 const seed=s=>{let x=s>>>0||1;R.f=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};};
 const ids=Object.keys(EVENTS).filter(id=>!id.startsWith('cad_')&&EVENTS[id].w&&!EVENTS[id].scen),spcs=Object.keys(SPECIAL);
 let total=0;const opcoes={};
 const vida=i=>{seed(9000+i);newLife({country:R.pick(COUNTRIES).id,royal:i%23===0});S.scen=null;const m=S.me,age=R.pick([8,13,16,19,24,30,38,46,55,63,72,84]);m.age=age;m.born=S.year-age;
  for(const k of Object.keys(m.talent))m.talent[k]=R.chance(.4)?R.int(60,100):R.int(0,59);m.fame=R.chance(.3)?R.int(35,100):R.int(0,20);m.money=R.pick([300,20000,300000,4e6]);m.karma=R.int(0,100);m.health=R.int(25,100);m.will=R.int(5,100);
  if(age<18)startSchool(age<15?'fund':'medio');else{m.lic=R.chance(.7);if(R.chance(.2)){const k=R.pick(spcs);m.job={spc:k,lvl:R.int(0,SPECIAL[k].l.length-1),perf:R.int(20,90),yrs:R.int(0,10)};}else if(age<70&&R.chance(.8)){takeJob({id:R.pick(JOBS.filter(j=>!j.pt)).id,co:'Teste',size:'média',mul:1});m.job.perf=R.int(10,95);m.job.yrs=R.int(0,15);}
   if(R.chance(.6)){const c=mkPerson({rel:R.pick(['namoro','noivo','conjuge','conjuge']),gender:m.gender==='M'?'F':'M',age,bond:R.int(20,95)});c.yrs=R.int(0,10);S.people.push(c);if(age>=26&&R.chance(.7))S.people.push(mkPerson({rel:'filho',age:R.int(0,Math.min(40,age-20)),bond:R.int(30,95),parentId:c.id}));}
   if(R.chance(.35))try{buy('casa',houseListings()[0],false);}catch(e){}if(R.chance(.3)){const l=typeof carListings==='function'?carListings():null;if(l&&l[0])try{buy('carro',l[0],false);}catch(e){}}
   if(R.chance(.15))try{m.money=Math.max(m.money,300000);openBiz(R.pick(BIZ_SECTORS),'Teste');}catch(e){}if(age>=25&&R.chance(.1)){const o=R.pick(OFFICES);m.office={id:o.id,yrs:R.int(0,4),appr:R.int(10,90)};}
   if(R.chance(.12))m.prison={left:4,total:5,served:1,behav:R.int(20,80),crime:'roubo',juv:false};}
  if(age>=13&&R.chance(.4))m.social={f:R.pick([50,5000,500000]),u:'@teste'};if(R.chance(.5))S.people.push(mkPerson({rel:'amigo',age,bond:R.int(20,90)}));
  if(R.chance(.3))try{addPet(R.pick(['Cachorro','Gato']));}catch(e){}S.pending=[];return JSON.stringify(S);};
 try{
  for(let i=0;i<500&&Date.now()-T0<limiteMs;i++){const snap=vida(i),preso=!!JSON.parse(snap).me.prison;
   for(const id of ids){const ev=EVENTS[id];if(!!ev.jail!==preso)continue;S=JSON.parse(snap);seed(11);let ok=false;try{ok=!ev.when||ev.when(S.me);}catch(e){}if(!ok)continue;
    let d,sh;try{d=ev.prep?ev.prep(S.me):{};if(d==null)continue;sh=ev.show(d);}catch(e){falhas.push(id+': '+e.message);continue;}
    opcoes[id]=Math.max(opcoes[id]||0,(sh.ch||[]).length);
    (sh.ch||[]).forEach((c,ci)=>{const chave=id+'#'+ci;if(feitas.has(chave))return;S=JSON.parse(snap);seed(13+ci);
     try{const d2=ev.prep?ev.prep(S.me):{};const s2=ev.show(d2);const r=ev.pick(s2.ch[ci][1],d2);feitas.add(chave);
      [s2.t,s2.x,s2.ch[ci][0],r].forEach(x=>{if(BAD.test(String(x??'')))falhas.push(chave+' texto: '+String(x).slice(0,90));});
      if(!Number.isFinite(S.me.money))falhas.push(chave+': dinheiro inválido');}catch(e){falhas.push(chave+': '+e.message);}});}}
  total=Object.values(opcoes).reduce((a,b)=>a+b,0);
  if(falhas.length)throw Error('Eventos com problema: '+falhas.slice(0,8).join(' | '));
  const r={eventos:ids.length,eventosAlcancados:Object.keys(opcoes).length,escolhasExecutadas:feitas.size,escolhasNaoExecutadas:Math.max(0,total-feitas.size),eventosNaoAlcancados:ids.length-Object.keys(opcoes).length,tempo:Date.now()-T0};
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
