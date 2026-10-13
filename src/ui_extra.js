// ===== Ícones automáticos por nome e telas de loja =====
const LABEL_IC={};
(()=>{
  const put=(n,ic)=>{ if(n&&ic&&!LABEL_IC[n]) LABEL_IC[n]=ic; };
  COURSES.forEach(c=>put(c.n,COURSE_IC[c.id])); TECHS.forEach(c=>put(c.n,COURSE_IC[c.id])); POSTS.forEach(c=>put(c.n,COURSE_IC[c.id]));
  JOBS.forEach(j=>j.l.forEach(t=>{ put(g(t,'M'),JOB_IC[j.id]); put(g(t,'F'),JOB_IC[j.id]); }));
  Object.entries(SPECIAL).forEach(([id,sp])=>put(sp.n,SPC_IC[id]));
  OFFICES.forEach(o=>{ put(g(o.n,'M'),OFFICE_IC[o.id]); put(g(o.n,'F'),OFFICE_IC[o.id]); });
  CRIMES.forEach(c=>put(c.n,CRIME_IC[c.id])); BIZ_SECTORS.forEach(s=>put(s.n,SECTOR_IC[s.n])); TRIPS.forEach(t=>put(t,TRIP_IC[t]||'✈️'));
  CLUBS.forEach(c=>put(c.n,CLUB_IC[c.n])); SURGERIES.forEach(s=>put(s.n,'💉')); MARTIAL.forEach(x=>put(x,'🥋'));
  Object.values(DISEASES).forEach(d=>put(d.n,disIc(Object.keys(DISEASES).find(k=>DISEASES[k]===d))));
  COUNTRIES.forEach(c=>put(c.n,flagSVG(c.id,28)));
  LUX_ITEMS.forEach(x=>put(x.t,x.ic));
})();
iconFor=(base=>l=>LABEL_IC[l]||base(l))(iconFor);

const CAT_ORDER=['Popular','Sedã','SUV','Picape','Elétrico','Conversível','Esportivo','Superesportivo','Luxo','Clássico','Moto','Bicicleta','Motorhome'];
V.cars=()=>{ const list=carListings(); const it=[{html:`<div class="card"><p>Estoque renovado todo ano. Clássicos valorizam com o tempo; os outros perdem valor.</p></div>`}];
  for(const cat of CAT_ORDER){ const cs=list.filter(c=>c.cat===cat); if(!cs.length) continue; it.push({sec:cat});
    cs.forEach(c=>it.push({ic:carSVG(modelOf(c.n)||c.model,c.cor),l:c.n,s:`${c.cor} · conservação ${c.cond}%${c.classic?' · clássico':''}`,r:fmt(c.v),on:()=>modal({top:`<div class="mkcar">${carSVG(modelOf(c.n)||c.model,c.cor,150)}</div>`,t:c.n,x:`Cor: ${c.cor}\nPreço: ${fmt(c.v)}`,ch:[{l:'Comprar',fn:()=>{ const r=buy('carro',Object.assign({},c,{n:`${c.n} ${c.cor}`,ic:null}),false); const a=S.me.assets[S.me.assets.length-1]; if(a&&a.k==='carro'){ a.cor=c.cor; a.model=c.n; } MQ.unshift({t:'Concessionária',x:r}); }},{l:'Voltar',cls:'alt'}]})})); }
  return {title:'Concessionária',items:it}; };
V.shop=()=>{ const it=[]; const cats=[...new Set(LUX_ITEMS.map(x=>x.cat))];
  for(const cat of cats){ it.push({sec:cat}); LUX_ITEMS.filter(x=>x.cat===cat).forEach(x=>it.push({ic:x.ic,l:x.t,r:fmt(x.v),on:()=>minorPay(x.v,()=>buy('item',{n:x.t,v:x.v,h:x.h,tal:x.tal,ic:x.ic},false),'Compra')})); }
  return {title:'Loja',items:it}; };
V.pets=()=>{ const it=[{ic:'🏠',l:'Abrigo de animais',s:'Adoção quase grátis, bicho surpresa',on:()=>minorPay(50,()=>adoptPet('abrigo'),'Abrigo')}];
  const grps=[...new Set(PET_SPECIES.map(p=>p.grp))];
  for(const gp of grps){ it.push({sec:gp}); PET_SPECIES.filter(p=>p.grp===gp).forEach(p=>it.push({ic:petIcon(p),l:g(p.s,'M'),s:[p.ex?'Exótico':'',p.dng?'Perigoso':'',p.br?`${p.br.length} raças`:'',`vive ${p.life[0]}–${p.life[1]} anos`].filter(Boolean).join(' · '),r:fmt(p.cost),tone:p.dng?'bad':'',
    on:()=>p.br?UI.push(()=>({title:g(p.s,'M'),items:p.br.map(b=>({ic:petIcon(p,b),l:b,r:fmt(Math.round(p.cost*(/^Vira/.test(b)?.2:1)*(.8+(b.length%5)/10))),on:()=>minorPay(Math.round(p.cost*(/^Vira/.test(b)?.2:1)*(.8+(b.length%5)/10)),()=>adoptPet('criador',Object.assign({},p,{cost:Math.round(p.cost*(/^Vira/.test(b)?.2:1)*(.8+(b.length%5)/10))}),b),'Criador')}))})):minorPay(p.cost,()=>adoptPet('criador',p),'Criador')})); }
  return {title:'Bichos de estimação',items:it}; };
V.music=()=>({title:'Aulas de música',items:INSTRUMENTS.map(([n,ic])=>({ic,l:n,s:`Talento musical: ${S.me.talent.musical}%`,on:()=>act(()=>body('music',n),n)}))});
V.sport=()=>({title:'Treino esportivo',items:SPORTS.map(([n,ic])=>({ic,l:n,s:`Atletismo: ${S.me.talent.athletic}%`,on:()=>act(()=>body('sport',n),n)}))});
