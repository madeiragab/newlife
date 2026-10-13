// ===== Lojas: concessionária por modelo, luxo por categoria, animais por grupo e raça =====
function carListings(){
  const m=S.me;
  if(!m.yr.cars){
    m.yr.cars=R.shuffle(CAR_MODELS).slice(0,10).map(c=>{
      const used=c.classic||R.chance(.45); const age=c.classic?S.year-+(c.m.match(/\d{4}/)||[0,1975])[0]:used?R.int(2,14):0;
      const dep=c.classic?1+R.f()*.5:used?Math.max(.25,.85-age*.05):1;
      const v=Math.round(c.v*dep*(.92+R.f()*.16)/100)*100;
      return {model:c,t:c.cat,n:`${c.b} ${c.m}${used&&!c.classic?` ${S.year-age}`:c.classic?'':' 0 km'}`,cor:R.pick(CAR_COLORS),v,cond:c.classic?R.int(55,95):used?R.int(40,90):100,ic:c.ic,cat:c.cat,classic:!!c.classic};
    }).sort((a,b)=>a.v-b.v);
  }
  return m.yr.cars;
}
function adoptPet(kind,sp,breed){
  const m=S.me;
  const s=sp||R.pick(PET_SPECIES.filter(p=>kind==='abrigo'?!p.ex&&p.grp!=='Fazenda'&&p.grp!=='Aquáticos':true));
  const cost=kind==='abrigo'?50:s.cost; if(!canPay(cost)) return 'Não tenho dinheiro para isso.';
  m.money-=cost; const gd=R.chance(.5)?'M':'F';
  const p=mkPerson({rel:'pet',first:R.pick(PET_NAMES.concat(PET_NAMES_EXTRA)),gender:gd,species:s.s,age:kind==='abrigo'?R.int(0,6):0,bond:R.int(60,90)});
  p.life=p.age+R.int(...s.life); p.icon=s.ic; p.breed=breed||(s.br?(kind==='abrigo'&&s.br[0].startsWith('Vira')?s.br[0]:R.pick(s.br)):null);
  S.people.push(p); cnt('pets'); st('happy',8);
  if(s.ex) m.c.exotic=(m.c.exotic||0)+1;
  return `Adotei ${p.first}, ${g(s.s,gd).toLowerCase()}${p.breed?' '+p.breed.toLowerCase():''}${kind==='abrigo'?' do abrigo':''}!`;
}
addPet=function(sp,name){
  const s=PET_SPECIES.find(x=>x.s.startsWith(sp))||PET_SPECIES[0]; const gd=R.chance(.5)?'M':'F';
  const p=mkPerson({rel:'pet',first:name||R.pick(PET_NAMES.concat(PET_NAMES_EXTRA)),gender:gd,species:s.s,age:R.int(0,4),bond:80});
  p.life=p.age+R.int(...s.life); p.icon=s.ic; p.breed=s.br?s.br[0]:null; S.people.push(p); cnt('pets'); return p;
};
const relLabelBase=relLabel;
relLabel=p=>p.rel==='pet'?g(p.species,p.gender)+(p.breed&&!/^Vira/.test(p.breed)?' · '+p.breed:p.breed?' · vira-lata':''):relLabelBase(p);
