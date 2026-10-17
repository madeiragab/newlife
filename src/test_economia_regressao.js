function economiaCompatSelfTest(fixture){
 const before=S,meta=JSON.stringify(META),snaps=SNAPS,random=R.f,chance=R.chance,norm=R.norm,noSave=window.NO_SAVE;
 const ok=(v,t)=>{if(!v)throw Error(t);};
 window.NO_SAVE=true;
 try{
  ok(fixture?.me?.biz&&fixture.me.assets.some(a=>a.loan),'fixture v1.46 incompleta');
  S=JSON.parse(JSON.stringify(fixture));
  const orig=JSON.parse(JSON.stringify(S.me));
  fixSave(S);
  ok(S.me.money===orig.money,'migração alterou caixa');
  for(const a of S.me.assets){const old=orig.assets.find(x=>x.id===a.id);ok(a.country==='BR'&&a.value===old.value&&a.loan===old.loan&&a.pay===old.pay,'migração de bem/contrato');}
  empresaPreparar(S.me.biz);
  ok(Math.abs(S.me.biz.capital+S.me.biz.caixa-orig.biz.value)<.01,'migração criou ou destruiu capital empresarial');
  const contabilidade=JSON.stringify(S.me.biz);
  empresaPreparar(S.me.biz);ok(contabilidade===JSON.stringify(S.me.biz),'migração empresarial repetida');
  S=JSON.parse(JSON.stringify(S));fixSave(S);
  const house=S.me.assets.find(a=>a.loan),debt=house.loan,pay=house.pay;
  R.chance=()=>true;R.norm=(m)=>m;
  S.me.passport='ok';const caixa=S.me.money;emigrate(countryOf('US'));
  ok(S.me.country==='US'&&S.me.money===caixa-5000-Math.round(caixa*.005),'emigração ou conversão de caixa');
  ok(S.me.assets.every(a=>a.country==='BR')&&S.me.biz.country==='BR','mudança deslocou bens ou sede');
  S.year++;yearAssets();ok(house.loan===debt-Math.min(debt,pay),'contrato antigo ganhou juros retroativos');
  S.me.money=2000000;takeJob({id:JOBS.find(j=>!j.pt).id,co:'Teste',size:'média',mul:1});
  const listing=houseListings()[0];buy('casa',listing,true);
  const financed=S.me.assets.at(-1),rate=financed.loanRate,initial=financed.loan;
  ok(financed.country==='US'&&rate===mundo('US').juros,'novo contrato não registrou mercado e taxa');
  mundo('US').juros=.2;S.year++;yearAssets();
  ok(financed.loan===Math.round(initial*(1+rate))-Math.min(Math.round(initial*(1+rate)),financed.pay),'contrato mudou taxa com o mercado');
  for(let i=0;i<6;i++){S.year++;S.me.yr={};mundoAno();yearBiz();ok(!S.me.biz||Number.isFinite(S.me.biz.value),'empresa antiga inválida após vários anos');}
  const saved=localStorage.getItem(SNAP_KEY);snap();ok(localStorage.getItem(SNAP_KEY)===saved&&SNAPS.length>0,'NO_SAVE gravou snapshots ou removeu a máquina do tempo');
  const world=mundo('BR'),u={country:'BR',sector:'Lanchonete',capital:200000,caixa:40000,emp:3};
  const prices=Object.fromEntries(Object.keys(world.indices).map(k=>[k,world.indices[k]/world.cambio]));
  const original=JSON.stringify({world,u,prices});
  const r=empresaCalcular(u,world,prices);
  ok(JSON.stringify({world,u,prices})===original,'cálculo puro modificou entradas');
  ok(Math.abs(r.receita-r.custos-r.lucro)<1e-6,'resultado não fecha');
  const weak=JSON.parse(JSON.stringify(world)),strong=JSON.parse(JSON.stringify(world));
  weak.mercados.alimentos.demanda=20;strong.mercados.alimentos.demanda=90;
  ok(empresaCalcular(u,strong,prices).lucro>empresaCalcular(u,weak,prices).lucro,'demanda não muda oportunidade');
  return 'Save v1.46: bens, financiamento, emigração, empresa e cálculo operacional íntegros.';
 }finally{S=before;META=JSON.parse(meta);SNAPS=snaps;R.f=random;R.chance=chance;R.norm=norm;window.NO_SAVE=noSave;}
}
