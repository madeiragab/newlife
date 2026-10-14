// ===== Núcleo: aleatoriedade, estado, nascimento, envelhecer, morte =====
const R = {
  f(){ try{ const a=new Uint32Array(1); crypto.getRandomValues(a); return a[0]/4294967296; }catch(e){ return Math.random(); } },
  int(a,b){ return a+Math.floor(R.f()*(b-a+1)); },
  pick(arr){ return arr[Math.floor(R.f()*arr.length)]; },
  chance(p){ return R.f()<p; },
  norm(m,sd){ let u=0,v=0; while(!u)u=R.f(); while(!v)v=R.f(); return m+sd*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); },
  wpick(list){ const tot=list.reduce((s,x)=>s+x[1],0); let r=R.f()*tot; for(const x of list){ if((r-=x[1])<0) return x[0]; } return list[list.length-1][0]; },
  shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(R.f()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; },
};
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Math.round(v)));
const fmt=n=>(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString('pt-BR');
const g=(t,gender)=>{ if(!t) return t; const p=String(t).split('|'); return gender==='F'&&p[1]?p[1]:p[0]; };
const countryOf=id=>COUNTRIES.find(c=>c.id===id)||COUNTRIES[0];
const fill=s=>s.replace(/\{(\w+)\}/g,(m,k)=>k==='o'&&S&&S.me?oa():k==='sib'?(sibName()||'o cachorro'):k==='friend'?(friendName()||'um vizinho'):FILL[k]?R.pick(FILL[k]):m);

const SAVE_KEY='outravida.save.v1', META_KEY='outravida.meta.v1';
let S=null;
let META={lives:0,ribbons:{},grave:[]};
const DISK={q:{},t:null};
const deskApi=()=>window.pywebview&&window.pywebview.api&&window.pywebview.api.save?window.pywebview.api:null;
function flushDisk(){ const api=deskApi(); DISK.t=null; if(!api) return; const q=DISK.q; DISK.q={}; for(const k in q){ try{ api.save(k,q[k]); }catch(e){} } }
// cada salvamento guarda o anterior em "<chave>.bak": se o save principal estragar, o jogo abre a cópia
let SAVE_RECOVERED=null;
function store(k,v){ if(window.NO_SAVE) return; const s=JSON.stringify(v);
  try{ const old=localStorage.getItem(k); if(old&&old!==s&&(k===SAVE_KEY||k===META_KEY)) localStorage.setItem(k+'.bak',old); }catch(e){}
  try{ localStorage.setItem(k,s); }catch(e){ try{ localStorage.removeItem(k+'.bak'); localStorage.setItem(k,s); }catch(e2){} }   /* sem espaço: o save novo vale mais que a cópia */ if(deskApi()){ DISK.q[k]=s; if(!DISK.t) DISK.t=setTimeout(flushDisk,120); } }
// um save só vale se abrir e tiver o formato certo
function saveOk(k,str){ try{ const o=JSON.parse(str); if(!o||typeof o!=='object') return false; if(k===SAVE_KEY) return !!(o.me&&o.me.first&&Array.isArray(o.people)); return true; }catch(e){ return false; } }
function loadKey(k){ let s=null; try{ s=localStorage.getItem(k); }catch(e){ return null; }
  if(s&&saveOk(k,s)) return JSON.parse(s);
  let b=null; try{ b=localStorage.getItem(k+'.bak'); }catch(e){}
  if(b&&saveOk(k,b)){ if(s) SAVE_RECOVERED=k; return JSON.parse(b); }   // principal estragado: abre o último salvamento bom
  return null; }
function save(){ if(S) store(SAVE_KEY,S); store(META_KEY,META); }

// ---------- genética ----------
// Aparência inicial coerente com o país (tom de pele, cor de cabelo e de olhos); os filhos herdam dos pais.
// pesos: pele do mais claro ao mais escuro · cabelo preto, castanho-escuro, castanho, castanho-claro, loiro, ruivo · olhos castanhos, castanho-escuros, pretos, verdes, azuis, mel, cinza
const POP={
  BR:{skin:[10,16,18,18,16,12,10],hair:[36,30,18,8,6,2],eyes:[48,22,12,6,6,5,1]},
  PT:{skin:[22,32,26,12,5,2,1],hair:[28,30,22,10,7,3],eyes:[44,16,4,12,14,8,2]}, ES:{skin:[22,32,26,12,5,2,1],hair:[28,30,22,10,7,3],eyes:[44,16,4,12,14,8,2]},
  IT:{skin:[22,32,26,12,5,2,1],hair:[28,30,22,10,7,3],eyes:[44,16,4,12,14,8,2]}, FR:{skin:[26,30,20,10,6,5,3],hair:[24,26,22,12,12,4],eyes:[40,14,4,12,18,8,4]},
  AR:{skin:[24,30,24,14,5,2,1],hair:[30,30,20,10,7,3],eyes:[44,18,6,10,12,8,2]}, MX:{skin:[6,14,26,30,16,6,2],hair:[50,30,14,4,2,0],eyes:[50,30,12,2,2,4,0]},
  US:{skin:[26,26,16,10,8,8,6],hair:[25,25,20,10,15,5],eyes:[38,15,6,10,20,6,5]}, CA:{skin:[30,28,14,10,7,6,5],hair:[22,24,20,12,17,5],eyes:[34,14,4,12,24,6,6]},
  GB:{skin:[36,30,12,8,5,5,4],hair:[16,22,22,14,18,8],eyes:[28,10,2,14,34,4,8]}, DE:{skin:[40,34,14,6,3,2,1],hair:[12,20,22,16,24,6],eyes:[24,8,2,14,40,4,8]},
  JP:{skin:[14,36,36,12,2,0,0],hair:[80,18,2,0,0,0],eyes:[8,55,37,0,0,0,0]}, KR:{skin:[16,38,34,10,2,0,0],hair:[80,18,2,0,0,0],eyes:[8,55,37,0,0,0,0]},
  AO:{skin:[0,0,2,6,18,36,38],hair:[92,8,0,0,0,0],eyes:[20,50,30,0,0,0,0]}, IN:{skin:[2,6,16,30,28,14,4],hair:[75,22,3,0,0,0],eyes:[30,50,15,1,0,4,0]},
};
const HAIR_KEYS=['preto','castanho-escuro','castanho','castanho-claro','loiro','ruivo'], EYE_KEYS=['castanhos','castanho-escuros','pretos','verdes','azuis','cor de mel','acinzentados'];
function randGenes(gender,cid){
  const pop=POP[cid||(typeof S!=='undefined'&&S&&S.me?S.me.country:'BR')]||POP.BR;
  const skin=R.wpick(pop.skin.map((w,i)=>[i,w])), dk=skin>=4;
  return { hair:R.wpick(HAIR_KEYS.map((k,i)=>[k,pop.hair[i]*(dk&&i>=4?.08:1)+(i===0?.01:0)])),
    eyes:R.wpick(EYE_KEYS.map((k,i)=>[k,pop.eyes[i]*(dk&&[3,4,6].includes(i)?.12:1)+(i===0?.01:0)])),
    h:Math.round(R.norm(gender==='F'?162:175,7)), skin, style:R.int(0,5), glasses:R.chance(.18), freckles:R.chance(skin<=1?.16:.05), eyeShape:R.int(0,3), from:{} };
}
const SKINS=['#F7D7C1','#EDC0A0','#DCA57E','#C68A5E','#A86E46','#7E4E30','#5A3621'];
function randTalent(){ const t={}; for(const k in TALENTS) t[k]=clamp(R.norm(40,25)); return t; }
const talOf=t=>{ const m=S.me; return t==='looks'?m.looks:t==='smarts'?m.smarts:t?(m.talent[t]??40):60; };
// Mistura os genes de dois pais: média com variação aleatória, e cada traço visível vem de um dos dois (ou é uma mutação rara)
function childOf(a,b,gender){
  const ga=a.genes||(a.genes=randGenes(a.gender)), gb=b.genes||(b.genes=randGenes(b.gender));
  const mix=(x,y,sd)=>clamp((x+y)/2+R.norm(0,sd));
  const ta=a.talent||(a.talent=randTalent()), tb=b.talent||(b.talent=randTalent());
  const trait=k=>{ const r=R.f(); if(r<.04) return [randGenes(gender)[k],null]; return r<.52?[ga[k],a.first]:[gb[k],b.first]; };
  const [hair,fh]=trait('hair'), [eyes,fe]=trait('eyes');
  const adj=p=>p.genes.h+(gender==='M'?(p.gender==='F'?13:0):(p.gender==='M'?-13:0));
  const h=Math.round((adj(a)+adj(b))/2+R.norm(0,4));
  return { looks:mix(a.looks??50,b.looks??50,12), smarts:mix(a.smarts??50,b.smarts??50,12), health:clamp(mix(a.health??70,b.health??70,10)+12),
    talent:Object.fromEntries(Object.keys(TALENTS).map(k=>[k,mix(ta[k]??40,tb[k]??40,15)])),
    will:mix(a.will??50,b.will??50,15), fert:mix(a.fert??60,b.fert??60,15), craze:mix(a.craze??50,b.craze??50,18),
    genes:{hair,eyes,h,from:{hair:fh,eyes:fe,h:Math.abs(adj(a)-h)<Math.abs(adj(b)-h)?a.first:b.first},
      skin:Math.max(0,Math.min(SKINS.length-1,Math.round(((ga.skin??2)+(gb.skin??2))/2+R.norm(0,.6)))),
      style:R.chance(.5)?(R.chance(.5)?ga.style??0:gb.style??0):R.int(0,5), glasses:R.chance((ga.glasses||gb.glasses)?.35:.1), freckles:R.chance((ga.freckles||gb.freckles)?.4:.06), eyeShape:R.chance(.5)?(ga.eyeShape??0):(gb.eyeShape??0)} };
}
const fmtH=h=>(h/100).toFixed(2).replace('.',',')+' m';
const looksLine=x=>x.genes?`Cabelo ${x.genes.hair}, olhos ${x.genes.eyes}, ${fmtH(x.genes.h)}`:'';

// ---------- pessoas ----------
const newId=()=>S.nextId++;
function mkPerson(o){
  const c=countryOf(o.country||(S&&S.me?S.me.country:'BR'));
  const gender=o.gender||(R.chance(.5)?'M':'F');
  const [fn,ln]=o.rel==='tmp'||o.species?[o.first||pickFirst(c,gender),o.last||pickLast(c)]:uniqueName(c,gender,o.first,o.last);
  const p={ id:newId(), first:fn, last:ln, gender, age:o.age??0, rel:o.rel,
    bond:o.bond??R.int(45,90), alive:true, looks:o.looks??clamp(R.norm(55,20)), smarts:o.smarts??clamp(R.norm(55,20)),
    craze:o.craze??R.int(0,100), money:o.money??0, job:o.job||null, health:o.health??R.int(55,100),
    talent:randTalent(), will:R.int(5,100), fert:R.int(15,100), genes:o.species?null:randGenes(gender,c.id),
    species:o.species||null, life:o.life||null, parentId:o.parentId||null, yrs:0, yr:{} };
  if(o.from) Object.assign(p,childOf(o.from[0],o.from[1],gender));
  return p;
}
const people=(...rels)=>S.people.filter(p=>p.alive&&(!rels.length||rels.includes(p.rel)));
const P=id=>S.people.find(p=>p.id===id);
const fullName=p=>p.rel==='pet'?p.first:(p.first+' '+p.last);
const sibName=()=>{ const s=S&&people('irmao')[0]; return s?s.first:null; };
const friendName=()=>{ const s=S&&R.pick(people('amigo','colega','colegaT').concat(people('irmao'))); return s?s.first:null; };
const REL_LABEL={mae:'Mãe',pai:'Pai',irmao:'Irmão|Irmã',avo:'Avô|Avó',filho:'Filho|Filha',neto:'Neto|Neta',amigo:'Amigo|Amiga',
  colega:'Colega de classe',colegaT:'Colega de trabalho',namoro:'Namorado|Namorada',noivo:'Noivo|Noiva',conjuge:'Marido|Esposa',ex:'Ex',
  pet:'',inimigo:'Desafeto',chefe:'Chefe',adot:'Filho adotivo|Filha adotiva'};
let relLabel=p=>p.rel==='pet'?g(p.species,p.gender):g(REL_LABEL[p.rel]||p.rel,p.gender);
const partner=()=>people('namoro','noivo','conjuge')[0]||null;
const kids=()=>people('filho','adot');

// ---------- utilidades do personagem ----------
const ME=()=>S.me;
function log(t,tone){ const y=S.log[S.log.length-1]; y.lines.push(tone?{t,c:tone}:t); }
// nome de doença em minúsculas, mas mantendo siglas (HIV, TOC, hepatite A)
const dn=n=>n.split(' ').map((w,i)=>(w.length>1&&w===w.toUpperCase()&&/[A-Z]/.test(w))||(i>0&&/^[A-Z]$/.test(w))?w:w.toLowerCase()).join(' ');
function st(k,d){ const m=S.me; m[k]=clamp((m[k]||0)+d); if(k==='health'&&d<=-3&&typeof hurtFx==='function') hurtFx(d); }
function use(key){ const m=S.me; m.yr[key]=(m.yr[key]||0)+1; if(typeof addLoad==='function') addLoad(key); return m.yr[key]; }
function cnt(key,n=1){ const c=S.me.c; c[key]=(c[key]||0)+n; return c[key]; }
const hasDeg=d=>S.me.edu.deg.includes(d);
function eduOk(req){
  if(!req) return true;
  const deg=S.me.edu.deg;
  if(req==='medio') return deg.includes('medio');
  const [k,v]=req.split(':');
  if(k==='tec') return deg.includes('tec:'+v)||(v==='t_enf'&&deg.includes('uni:enf'))||(v==='t_ti'&&deg.includes('uni:cc'));
  if(k==='uni') return v? v.split(',').some(x=>deg.includes('uni:'+x)) : deg.some(x=>x.startsWith('uni:'));
  if(k==='post') return deg.includes('post:'+v)||(v==='mest'&&deg.includes('post:dout'));
  return false;
}
function eduName(req){
  if(!req) return 'Nenhuma';
  if(req==='medio') return 'Ensino médio';
  const [k,v]=req.split(':');
  if(k==='tec') return (TECHS.find(t=>t.id===v)||{}).n;
  if(k==='uni') return v? 'Faculdade de '+v.split(',').map(x=>(COURSES.find(c=>c.id===x)||{}).n).join(' ou ') : 'Qualquer faculdade';
  if(k==='post') return (POSTS.find(t=>t.id===v)||{}).n;
  return req;
}
function netWorth(){ const m=S.me; return m.money+m.assets.reduce((s,a)=>s+a.value-(a.loan||0),0)-m.loans.reduce((s,l)=>s+l.bal,0)+(m.inv.poup+m.inv.acoes+m.inv.cripto); }
function tax(x){ if(x<=0) return 0; let t=0; const b=[[25000,0],[60000,.12],[150000,.2],[500000,.27],[Infinity,.33]]; let prev=0; for(const [lim,r] of b){ const part=Math.min(x,lim)-prev; if(part>0) t+=part*r; prev=lim; if(x<=lim) break; } return Math.round(t); }
const parents=()=>people('mae','pai');
// Menores de idade gastam o dinheiro da família
const famMoney=()=>parents().reduce((s,p)=>s+Math.max(0,p.money||0),0);
const canPay=c=>S.me.money>=c;
function coverMinor(){
  const m=S.me; if(!m||!m.alive||m.age>=18||m.money>=0) return;
  let need=-m.money; m.money=0;
  const ps=parents().sort((a,b)=>b.money-a.money); if(!ps.length) return;
  const paid=need;
  for(const p of ps){ const take=Math.min(need,Math.max(0,p.money)); p.money-=take; need-=take; if(need<=0) break; }
  if(need>0) ps[0].money-=need;
  if(paid>=500){ log(`Meus pais pagaram ${fmt(paid)} por mim.`,'warn'); ps.forEach(p=>p.bond=clamp(p.bond-Math.min(15,Math.round(paid/4000)+1))); }
  if(ps.reduce((s,p)=>s+p.money,0)<0&&!S.flags.famBroke){ S.flags.famBroke=1; queue('familia_falida',{}); }
}
// Nomes não se repetem dentro da família
function uniqFirst(p){ const used=new Set([S.me&&S.me.first].concat(S.people.filter(x=>x!==p&&['mae','pai','irmao','filho','adot','avo'].includes(x.rel)).map(x=>x.first))); const c=countryOf(p.country||(S.me?S.me.country:'BR')); for(let i=0;i<12&&used.has(p.first);i++) p.first=pickFirst(c,p.gender); return p; }
function eduOf(cur){ const n=cur.n; if(cur.type==='uni') return 'da faculdade de '+n; if(cur.type==='tec') return 'do curso de '+n; if(/^Resid/.test(n)) return 'da '+n; return 'do '+n.charAt(0).toLowerCase()+n.slice(1); }
const living=()=>!S.me.prison;
function jobTitle(j){ if(!j) return null; if(j.spc) return g(SPECIAL[j.spc].l[j.lvl],S.me.gender); const d=JOBS.find(x=>x.id===j.id); return g(d.l[Math.min(j.lvl,d.l.length-1)],S.me.gender); }
function jobSalary(j){ if(j.spc){ return Math.round(SPECIAL[j.spc].sal[j.lvl]*(j.mul||1)); } const d=JOBS.find(x=>x.id===j.id); return Math.round(d.sal*(1+.42*j.lvl)*(j.mul||1)); }
function occupation(){
  const m=S.me;
  if(!m.alive) return m.cause;
  if(m.prison) return m.prison.juv?(m.gender==='F'?'Internada':'Internado'):(m.gender==='F'?'Detenta':'Detento');
  if(m.office) return g(OFFICES.find(o=>o.id===m.office.id).n,m.gender);
  if(m.royal&&!m.royal.abd&&(!m.job||m.royal.reign)) return royalTitle();
  if(m.biz&&!m.job) return 'Dono'+(m.gender==='F'?'a':'')+' da '+m.biz.n;
  if(m.job) return jobTitle(m.job)+(m.edu.cur?' · estudante':'');
  if(m.edu.cur) return m.edu.cur.n;
  if(m.ret) return m.gender==='F'?'Aposentada':'Aposentado';
  if(m.age<6) return m.age<3?'Bebê':'Criança';
  return m.gender==='F'?'Desempregada':'Desempregado';
}

// ---------- nova vida ----------
function newLife(o={}){
  const royal=!!o.royal;
  let c=o.country?countryOf(o.country):R.pick(COUNTRIES.concat([COUNTRIES[0],COUNTRIES[0],COUNTRIES[0]]));
  if(royal&&!ROYAL_COUNTRIES.includes(c.id)) c=countryOf(R.pick(ROYAL_COUNTRIES));
  S={v:1,nextId:1,year:o.year||(2000+R.int(0,26)),people:[],log:[],pending:[],births:[],me:null,gen:o.gen||1,flags:{diff:o.diff||'normal'}};
  SNAPS=[]; storeSnaps();
  const gender=o.gender||(R.chance(.5)?'M':'F');
  let last=royal?ROYAL_HOUSE[c.id].replace(/^Casa (de )?/,''):(o.last||null);
  const nm=uniqueName(c,gender,o.first,royal?last:o.last); if(!royal&&!o.last) last=nm[1];
  const m=S.me={ first:nm[0], last, gender, age:0, country:c.id, city:royal?c.cities[0]:R.pick(c.cities), born:S.year,
    happy:R.int(70,100), health:R.int(72,100), smarts:clamp(R.norm(55,22)), looks:clamp(R.norm(55,22)), karma:R.int(45,75), fame:0, money:0,
    talent:randTalent(), will:R.int(5,100), fert:R.int(15,100), fight:R.int(0,40),
    pref:o.pref||(R.chance(.88)?(gender==='M'?'F':'M'):R.pick([gender,'A'])),
    add:{alcool:0,cigarro:0,jogo:0}, dis:[], edu:{deg:[],cur:null,club:null}, job:null, hist:[], rec:{arrests:0,conv:0,crimes:0},
    prison:null, lic:false, assets:[], loans:[], inv:{poup:0,acoes:0,cripto:0}, social:null, office:null, ret:null, biz:null, royal:null,
    c:{countries:1}, yr:{}, alive:true, cause:null };
  if(o.stats) Object.assign(m,o.stats);
  const cls=royal?'realeza':o.cls||R.wpick([['pobre',34],['media',44],['rica',18],['milionaria',4]]); S.flags.cls=cls;
  const mAge=R.int(royal?22:17,42), dAge=clamp(mAge+R.int(-3,9),17,60);
  const pickJob=gd=>{ const pool=cls==='pobre'?JOBS.filter(j=>!j.edu&&!j.pt):cls==='media'?JOBS.filter(j=>!j.pt&&(!j.edu||j.edu==='medio'||j.edu.startsWith('tec'))):JOBS.filter(j=>!j.pt&&j.edu&&(j.edu.startsWith('uni')||j.edu.startsWith('post'))); const d=R.pick(pool); return R.chance(cls==='pobre'?.18:.07)?null:g(d.l[R.int(0,d.l.length-1)],gd); };
  const wealth={pobre:[0,6000],media:[5000,60000],rica:[80000,900000],milionaria:[2000000,40000000],realeza:[50000000,400000000]}[cls];
  const mom=uniqFirst(mkPerson({rel:'mae',gender:'F',age:mAge,last:R.chance(.4)||royal?last:R.pick(c.L),money:R.int(...wealth)})); mom.job=royal?null:pickJob('F');
  S.people.push(mom);
  if(royal||!R.chance(.13)){ const dad=uniqFirst(mkPerson({rel:'pai',gender:'M',age:dAge,last,money:R.int(...wealth)})); dad.job=royal?null:pickJob('M'); S.people.push(dad); }
  else S.flags.noDad=true;
  if(royal){ const mon=R.pick(parents()); mon.job=g('Rei|Rainha',mon.gender); mon.monarch=true; parents().filter(p=>p!==mon).forEach(p=>p.job=g('Príncipe consorte|Rainha consorte',p.gender));
    m.royal={house:ROYAL_HOUSE[c.id],pop:R.int(55,80),reign:false,abd:false}; m.fame=30; m.c.royal=1; }
  const bio=people('pai')[0]||mkPerson({rel:'tmp',gender:'M',age:dAge,last});
  if(!o.stats){ const gn=childOf(mom,bio,gender); Object.assign(m,{looks:gn.looks,smarts:gn.smarts,health:gn.health,talent:gn.talent,will:gn.will,fert:gn.fert,genes:gn.genes}); }
  else m.genes=randGenes(gender,c.id);
  for(let i=0,n=R.wpick([[0,30],[1,38],[2,20],[3,9],[4,3]]);i<n;i++){ const a=R.int(1,Math.max(1,mAge-17)); S.people.push(uniqFirst(mkPerson({rel:'irmao',age:a,last,bond:R.int(40,90),from:[mom,bio]}))); }
  for(let i=0,n=R.int(0,4);i<n;i++){ const a=mAge+R.int(18,34); if(a<95) S.people.push(mkPerson({rel:'avo',gender:i%2?'F':'M',age:a,last:R.pick(c.L),money:R.int(...wealth),health:R.int(30,90)})); }
  S.log.push({age:0,year:S.year,lines:[]});
  log(`Nasci ${gender==='F'?'menina':'menino'} em ${m.city}, ${c.n}, no ano de ${S.year}.`,'big');
  log(`Meu nome é ${m.first} ${m.last}.`);
  log(`Minha mãe é ${mom.first} ${mom.last}, ${mom.job?mom.job.toLowerCase():'sem emprego'}, ${mom.age} anos.`);
  const dad=people('pai')[0];
  if(dad) log(`Meu pai é ${dad.first} ${dad.last}, ${dad.job?dad.job.toLowerCase():'sem emprego'}, ${dad.age} anos.`); else log('Não conheci meu pai.');
  const sibs=people('irmao'); if(sibs.length) log(`Tenho ${sibs.length} ${sibs.length>1?'irmãos':'irmão'}: ${sibs.map(s=>s.first).join(', ')}.`);
  const lbl={pobre:'Minha família é pobre.',media:'Minha família é de classe média.',rica:'Minha família é rica.',milionaria:'Nasci numa família milionária.',realeza:royal?`Nasci na ${m.royal.house}. Sou ${g('príncipe|princesa',gender)} de ${c.n}!`:''}[cls];
  log(lbl);
  const fromWho=n=>n===mom.first?'da minha mãe':dad&&n===dad.first?'do meu pai':null;
  const ge=m.genes, fe=fromWho(ge.from.eyes), fh=fromWho(ge.from.hair);
  log(`Tenho olhos ${ge.eyes}${fe?' '+fe:''} e cabelo ${ge.hair}${fh?' '+fh:''}.`);
  if(R.chance(.05)){ log('Nasci prematuro e passei semanas na incubadora.','warn'); st('health',-10); }
  save();
}

// ---------- envelhecer ----------
// ---------- máquina do tempo ----------
const SNAP_KEY='outravida.snaps.v1'; let SNAPS=[];
function storeSnaps(){ try{ localStorage.setItem(SNAP_KEY,JSON.stringify(SNAPS)); }catch(e){ SNAPS=SNAPS.slice(-2); try{ localStorage.setItem(SNAP_KEY,JSON.stringify(SNAPS)); }catch(e2){} } }
function snap(){ SNAPS.push({age:S.me.age,year:S.year,s:JSON.stringify(S)}); if(SNAPS.length>6) SNAPS.shift(); storeSnaps(); }
function timeTravel(i){ const sn=SNAPS[i]; if(!sn) return false; S=JSON.parse(sn.s); if(typeof fixSave==='function') fixSave(S); SNAPS=SNAPS.slice(0,i); storeSnaps(); cnt('timeTravel'); log(`Voltei no tempo para os meus ${S.me.age} anos.`,'warn'); save(); return true; }
const DIFF={facil:{d:.6,$:1.3,n:'Fácil'},normal:{d:1,$:1,n:'Normal'},dificil:{d:1.7,$:.75,n:'Difícil'}};
const diff=()=>DIFF[(S.flags&&S.flags.diff)||'normal'];

function ageUp(){
  const m=S.me; if(!m.alive||S.pending.length) return;
  snap();
  const py=m.yr||{}, ld=typeof loadNow==='function'?loadNow(m):0;
  m.age++; S.year++; m.yr={}; S.people.forEach(p=>p.yr={});
  S.log.push({age:m.age,year:S.year,lines:[]});
  if(S.log.length>140) S.log.splice(0,S.log.length-140);
  if(typeof endOfYear==='function'){ endOfYear(py,ld); if(!m.alive) return; }
  yearStats(); yearPeople(); yearHealth(); yearSchool(); yearWork(); yearMoney(); yearPrison(); yearFame(); yearAssets(); yearRoyal(); yearBiz();
  if(m.health<=0) return die(causeFromHealth());
  if(deathRoll()) return die(causeFromHealth(true));
  yearSummary();
  if(!m.prison&&m.c.fugitive&&R.chance(.18)) queue('recaptura',{});
  if(!m.prison&&m.c.unsolved&&R.chance(Math.min(.45,.08+.1*m.c.unsolved))) queue('investigacao',{n:m.c.coldCase});
  coverMinor();
  if(S.flags.famBroke&&famMoney()>20000&&parents().every(p=>p.money>=0)){ S.flags.famBroke=0; log('Minha família conseguiu sair do buraco financeiro.','good'); }
  yearEvents();
}
function yearStats(){
  const m=S.me,a=m.age;
  if(a<20) m.smarts=clamp(m.smarts+R.int(-1,3)); if(a>=65) st('smarts',-R.int(0,2));
  if(a>=32) st('looks',-(a>60?R.int(1,3):a>45?R.int(0,2):R.int(0,1))); if(a>=13&&a<=18) st('looks',R.int(-2,3));
  if(a>=30) st('health',-(a>80?R.int(1,4):a>65?R.int(0,3):a>45?R.int(0,2):R.int(0,1)));
  if(a<55&&!m.dis.some(d=>DISEASES[d.id].dmg>=8)&&m.add.alcool<40&&m.add.cigarro<40) st('health',R.int(0,a<30?3:2));
  let target=58+(m.money>1e5?6:m.money<0?-12:0)+(partner()?6:0)+(m.job||m.edu.cur||m.ret?4:a>=18?-10:0)-(m.prison?28:0)-(m.dis.length*3)+(m.karma-50)/10;
  m.happy=clamp(m.happy+(target-m.happy)*.2+R.int(-6,6));
  const ad=m.add;
  if(ad.alcool>40){ st('health',-R.int(1,4)); st('smarts',-1); if(ad.alcool>75&&R.chance(.05)&&!m.dis.find(d=>d.id==='cirrose')) addDisease('cirrose'); }
  if(ad.cigarro>40){ st('health',-R.int(1,3)); st('looks',-1); }
  if(ad.jogo>50&&m.money>0){ const loss=Math.round(m.money*R.f()*.15); m.money-=loss; if(loss>500) log(`Perdi ${fmt(loss)} em apostas escondidas.`,'bad'); }
  ['alcool','cigarro','jogo'].forEach(k=>{ if(ad[k]>0&&ad[k]<30) ad[k]=Math.max(0,ad[k]-R.int(2,6)); });
  if(m.karma>50) m.karma=clamp(m.karma-1); else if(m.karma<50) m.karma=clamp(m.karma+1);
}
function yearPeople(){
  const m=S.me;
  // nascimentos pendentes
  for(const b of S.births.splice(0)){
    const par=P(b.with); const twins=R.chance(.03)?2:1;
    const other=par||mkPerson({rel:'tmp',gender:m.gender==='F'?'M':'F',age:m.age});
    for(let i=0;i<twins;i++){ const k=uniqFirst(mkPerson({rel:'filho',age:0,last:m.last,bond:R.int(80,100),parentId:par?par.id:null,from:[m,other]})); S.people.push(k); log(`${k.gender==='F'?'Minha filha':'Meu filho'} ${k.first} nasceu!${twins>1?' (gêmeos!)':''}`,'good'); cnt('kids'); }
    st('happy',12);
  }
  for(const p of S.people.filter(p=>p.alive)){
    p.age++; p.yrs++;
    if(p.rel==='pet'){ if(p.age>=p.life){ p.alive=false; log(`${p.first}, ${g(p.species,p.gender).toLowerCase()}, morreu de velhice.`,'bad'); st('happy',-10); } continue; }
    if(p.age>=40) p.health=clamp(p.health-R.int(0,p.age>70?5:2));
    const dp=deathP(p.age,p.health)*.85+(p.age<40?.0006:0);
    if(R.chance(dp)){ p.alive=false; const why=R.pick(p.age>70?['de causas naturais','dormindo','de infarto','de AVC','de pneumonia','de câncer']:['num acidente de carro','de infarto','de câncer','num acidente de trabalho','de AVC']);
      log(`${relLabel(p)} ${fullName(p)} morreu ${why}, aos ${p.age} anos.`,'bad'); const close=['mae','pai','filho','conjuge','irmao','adot','namoro','noivo'].includes(p.rel); st('happy',close?-25:-8);
      if(['mae','pai','avo'].includes(p.rel)&&p.money>1000&&R.chance(p.rel==='avo'?.35:.6)){ const share=Math.round(p.money*(p.rel==='avo'?R.f()*.3:R.f()*.5+.2)); m.money+=share; log(`Recebi uma herança de ${fmt(share)}.`,'good'); }
      if(p.rel==='conjuge') cnt('widow');
      continue; }
    if(p.age>=18&&!['pet'].includes(p.rel)){ const mult={pobre:.35,media:1,rica:4,milionaria:20,realeza:60}[S.flags.cls]||1; const inc=p.job&&p.age<70?R.int(2000,14000)*(['mae','pai'].includes(p.rel)?mult:1):-R.int(0,2500); p.money=Math.round((p.money||0)*(p.money>0?1.02:1)+inc); }
    const fam=['mae','pai','filho','irmao','avo','neto','adot'].includes(p.rel);
    if(!fam&&p.rel!=='inimigo') p.bond=clamp(p.bond-R.int(0,5)); else p.bond=clamp(p.bond-R.int(-1,3));
    if(['namoro','noivo'].includes(p.rel)&&p.bond<18&&R.chance(.5)){ p.rel='ex'; log(`${p.first} terminou comigo.`,'bad'); st('happy',-15); }
    if(p.rel==='conjuge'&&p.bond<12&&R.chance(.35)){ divorce(p,true); }
    if(p.rel==='amigo'&&p.bond<10&&R.chance(.4)){ p.rel='ex_amigo'; p.alive=true; log(`Perdi contato com ${p.first}.`); }
    if((p.rel==='filho'||p.rel==='adot')&&p.age===18) log(`${p.first} fez 18 anos${R.chance(.5)?' e saiu de casa':''}.`);
    if((p.rel==='filho'||p.rel==='adot')&&p.age>=21&&p.age<=42&&R.chance(.07)){ const n=mkPerson({rel:'neto',age:0,last:p.gender==='M'?p.last:R.pick(countryOf(m.country).L),parentId:p.id,bond:R.int(60,95),from:[p,mkPerson({rel:'tmp',gender:p.gender==='F'?'M':'F',age:p.age})]}); S.people.push(n); log(`${p.first} teve ${n.gender==='F'?'uma filha':'um filho'}, ${n.first}. Agora sou ${m.gender==='F'?'avó':'avô'}!`,'good'); cnt('kids'); }
    if(['filho','adot'].includes(p.rel)&&p.age===R.int(18,26)&&!p.job){ const d=R.pick(JOBS.filter(j=>!j.pt)); p.job=g(d.l[0],p.gender); }
  }
  if(m.age<=13){ const mom=people('mae')[0]; if(mom&&mom.age<=43&&R.chance(.07)){ const s=uniqFirst(mkPerson({rel:'irmao',age:0,last:m.last,bond:R.int(50,80),from:[mom,people('pai')[0]||mkPerson({rel:'tmp',gender:'M',age:mom.age})]})); S.people.push(s); log(`${s.gender==='F'?'Nasceu minha irmã':'Nasceu meu irmão'} ${s.first}.`,'good'); } }
  const mom=people('mae')[0],dad=people('pai')[0];
  if(mom&&dad&&!S.flags.divorced&&R.chance(.015)){ S.flags.divorced=true; log('Meus pais se divorciaram.','bad'); st('happy',m.age<18?-15:-5); }
}
function divorce(p,theyAsked){
  const m=S.me; p.rel='ex'; cnt('divorces');
  const half=m.money>0&&!S.flags['prenup'+p.id]?Math.round(m.money/2):0; m.money-=half;
  log(theyAsked?`${p.first} pediu o divórcio.`:`Me divorciei de ${p.first}.`,'bad'); if(half) log(`Perdi ${fmt(half)} na partilha.`,'bad');
  st('happy',-18);
}
function yearHealth(){
  const m=S.me;
  for(const d of m.dis.slice()){
    const def=DISEASES[d.id]; d.y++;
    let dmg=def.dmg*(def.ctrl&&d.ctrl?.25:1)*(def.chronic?.45:1)*(.6+R.f()*.8);
    st('health',-dmg); if(def.hap) st('happy',-def.hap*(.5+R.f())); if(def.lk) st('looks',-def.lk*R.f()); if(def.sm) st('smarts',-def.sm*R.f());
    if(def.cure==='auto'&&R.chance(.75)){ m.dis.splice(m.dis.indexOf(d),1); if(def.dmg>5||R.chance(.35)) log(d.k===false?R.pick(['Aquele mal-estar passou sozinho.','Melhorei sem nem saber o que eu tinha.']):def.dmg>5?`Me recuperei de ${dn(def.n)}.`:R.pick([`Me recuperei de ${dn(def.n)}.`,'Já estou cem por cento de novo.']),'good'); }
    else if(def.id==='acne'&&m.age>22){ m.dis.splice(m.dis.indexOf(d),1); }
  }
  if(m.prison) return;
  const mult=(1.55-m.health/100)*(m.age>60?1.6:1);
  for(const [id,def] of R.shuffle(Object.entries(DISEASES))){
    if(m.dis.find(d=>d.id===id)) continue;
    if(def.min&&m.age<def.min||def.max&&m.age>def.max||def.g&&def.g!==m.gender) continue;
    if(def.country&&!def.country.split(',').includes(m.country)) continue;
    let p=def.p*mult; if(def.smoke&&m.add.cigarro>40) p*=8;
    if(R.chance(p)){ addDisease(id); break; }
  }
  if(m.age>=3&&R.chance(.012)){ const what=R.pick(['Quebrei o braço','Torci o tornozelo','Quebrei a perna','Desloquei o ombro','Quebrei o nariz']); log(`${what} num acidente.`,'bad'); st('health',-R.int(5,14)); st('happy',-5); }
}
const CANCERS=new Set(['cancer_pele','cancer_pulmao','cancer_mama','cancer_prostata','leucemia','cancer_colon','cancer_estomago','cancer_tireoide','cancer_ovario','cancer_testiculo','linfoma','tumor_cerebral']);
const hasCancer=p=>(p.dis||[]).some(d=>CANCERS.has(d.id));
function addDisease(id){ const m=S.me;
  if(id==='ist') id=R.wpick([['ist',4],['sifilis',2],['gonorreia',3],['herpes',2],['hiv',.4]]);
  if(!DISEASES[id]||m.dis.find(d=>d.id===id)) return;
  if(id==='catapora') m.genes.pox=1; if(id==='vitiligo') m.genes.vitiligo=1;
  if(CANCERS.has(id)&&!m.c.chemo){ m.c.chemo=1; setTimeout(()=>log('Comecei a quimioterapia. Meu cabelo caiu todo.','bad'),0); } m.dis.push({id,y:0,ctrl:false}); const def=DISEASES[id], n=dn(def.n), diag=m.gender==='F'?'diagnosticada':'diagnosticado';
  log(def.cure==='auto'&&def.dmg<=5?R.pick([`Fui ${diag} com ${n}.`,`Fiquei de cama com ${n}.`,`Tive ${n} e perdi uns dias de ${m.job?'trabalho':m.edu.cur?'aula':'sossego'}.`]):`Fui ${diag} com ${n}.`,'bad'); st('happy',-4); }
function yearSchool(){
  const m=S.me,cur=m.edu.cur;
  if(m.age===3&&!m.prison) log('Comecei a frequentar a creche.');
  if(m.age===6&&!m.edu.deg.length&&!cur) startSchool('fund');
  if(!cur) return;
  if(m.prison&&!m.prison.juv){ log(`Fui ${m.gender==='F'?'expulsa':'expulso'} ${eduOf(cur)} por estar ${m.gender==='F'?'presa':'preso'}.`,'bad'); m.edu.cur=null; return; }
  if(m.prison){ log(`Perdi o ano letivo ${eduOf(cur)} por estar internad${oa()}. Vou ter que repetir.`,'bad'); cnt('repetiu'); return; }
  const effort=(m.c.studyYr||0); m.c.studyYr=0;
  const target=18+m.smarts*.7+effort*6+(m.edu.club?3:0)+R.int(-10,10)-(m.add.alcool>40?10:0);
  cur.grade=clamp(cur.grade+(target-cur.grade)*.45);
  if(cur.type==='fund'||cur.type==='medio'){ (m.edu.hist||(m.edu.hist=[])).push({t:cur.type==='medio'?'m':cur.yr<5?'f1':'f2',g:Math.round(cur.grade)}); }
  if(cur.pay&&cur.cost) payTuition(cur);
  // reprovação não é sorte: 3 provas perdidas no ano ou média abaixo de 3,5 = repetir o ano
  const fal=cur.faltas||0, school=cur.type==='fund'||cur.type==='medio'; cur.faltas=0;
  if(school&&(fal>=3||(cur.grade<35&&m.age>=7))&&(cur.rep||0)>=2){ cur.rep=0; log('Passei de ano pelo conselho de classe. Foi por pouco.','warn'); cur.grade=clamp(cur.grade+5); cur.yr++; if(cur.yr>=cur.len) graduate(cur); return; }
  if(school&&(fal>=3||(cur.grade<35&&m.age>=7))) cur.rep=(cur.rep||0)+1; else if(school) cur.rep=0;
  if(fal>=3){ if(school){ log(`Repeti de ano por excesso de faltas (${fal} provas perdidas).`,'bad'); st('happy',-8); cnt('repetiu'); return; } cur.grade=clamp(cur.grade-10); log(`Reprovei em várias matérias por falta (${fal} provas perdidas). Mais um semestre para recuperar.`,'bad'); }
  if(school&&cur.grade<35&&m.age>=7){ log(`Fui ${m.gender==='F'?'reprovada':'reprovado'} com média ${(cur.grade/10).toFixed(1).replace('.',',')} e vou repetir o ano.`,'bad'); st('happy',-8); cnt('repetiu'); cur.grade=clamp(cur.grade+8); return; }
  cur.yr++;
  if(cur.yr>=cur.len){
    if(cur.grade<30&&!school){ cur.yr--; log(`Não passei nas matérias finais de ${cur.n}. Mais um ano.`,'bad'); return; }
    graduate(cur);
  }
}
function startSchool(type){
  const m=S.me;
  if(type==='fund'){ m.edu.cur={type,n:'Ensino Fundamental',len:9,yr:0,grade:clamp(15+m.smarts*.7+R.int(-10,10))}; log('Comecei o ensino fundamental.'); }
  if(type==='medio'){ m.edu.cur={type,n:'Ensino Médio',len:3,yr:0,grade:clamp(15+m.smarts*.7+R.int(-10,10))}; log('Comecei o ensino médio.'); }
  S.people.filter(p=>p.rel==='colega').forEach(p=>p.alive=false);
  for(let i=0,n=R.int(4,7);i<n;i++) S.people.push(mkPerson({rel:'colega',age:m.age+R.int(-1,0),bond:R.int(20,60)}));
}
function graduate(cur){
  const m=S.me; m.edu.cur=null; m.edu.club=null;
  if(cur.type==='fund'){ m.edu.deg.push('fund'); log('Terminei o ensino fundamental.','good'); startSchool('medio'); return; }
  if(cur.type==='medio'){ m.edu.nota=cur.grade; m.edu.deg.push('medio'); log(`Minha nota no vestibular: ${examScore(m)*10} de 1000.`); log(`Me formei no ensino médio com média ${(cur.grade/10).toFixed(1)}.`,'good'); st('happy',8); S.people.filter(p=>p.rel==='colega').forEach(p=>p.alive=false); queue('formatura',{}); return; }
  m.edu.deg.push(cur.type==='tec'?'tec:'+cur.id:cur.type==='uni'?'uni:'+cur.id:'post:'+cur.id);
  log(`Me formei em ${cur.n}!`,'good'); st('happy',12); st('smarts',R.int(2,6));
  if(cur.type==='post'&&cur.id==='res') log('Agora posso trabalhar como cirurgião.','good');
  if(cur.pay==='loan') log(`Saí com uma dívida estudantil de ${fmt((m.loans.find(l=>l.n==='Financiamento estudantil')||{bal:0}).bal)}.`,'warn');
}
function payTuition(cur){
  const m=S.me;
  if(cur.pay==='pais'){ const ps=parents().filter(p=>p.money>=cur.cost); if(ps.length){ R.pick(ps).money-=cur.cost; return; } cur.pay='loan'; log('Meus pais não conseguem mais pagar a faculdade. Fiz um financiamento.','warn'); }
  if(cur.pay==='self'){ m.money-=cur.cost; return; }
  if(cur.pay==='loan'){ let l=m.loans.find(x=>x.n==='Financiamento estudantil'); if(!l){ l={n:'Financiamento estudantil',bal:0,pay:0}; m.loans.push(l); } l.bal+=cur.cost; l.pay=Math.max(2000,Math.round(l.bal/10)); }
}
function yearWork(){
  const m=S.me; const j=m.job;
  if(j&&!m.prison){
    j.yrs++; const sp=j.spc?SPECIAL[j.spc]:null;
    const effort=(m.c.workYr||0); m.c.workYr=0;
    j.perf=clamp(j.perf+(m.smarts*.35+35+effort*7-(m.add.alcool>50?15:0)-j.perf)*.3+R.int(-12,10));
    if(sp){ const tal=talOf(sp.talent); if(R.chance(j.perf/450+tal/600)&&j.lvl<sp.l.length-1){ j.lvl++; log(`Subi na carreira: agora sou ${jobTitle(j).toLowerCase()}!`,'good'); st('happy',10); } m.fame=clamp(Math.max(m.fame,sp.fame[j.lvl]+R.int(-3,3))); if(j.spc==='atleta'&&m.age>34&&R.chance(.35)){ log('Meu corpo não aguenta mais o ritmo profissional. Me aposentei do esporte.','warn'); endJob(); } }
    else careerYear(j,JOBS.find(x=>x.id===j.id));
    if(j.perf<18&&R.chance(.45)){ log(`Fui ${m.gender==='F'?'demitida':'demitido'} de ${j.co} por mau desempenho.`,'bad'); st('happy',-15); endJob(); }
    else if(!sp&&R.chance(.012)){ log(`A ${j.co} fez um corte de pessoal e eu fui ${m.gender==='F'?'demitida':'demitido'}.`,'bad'); st('happy',-12); endJob(); }
  }
  if(m.office&&!m.prison){ const o=m.office; o.yrs++; o.appr=clamp(o.appr+R.int(-8,5)); if(o.yrs>=4) queue('reeleicao',{}); }
}
function endJob(){ const m=S.me; if(m.job){ m.hist.push({t:jobTitle(m.job),co:m.job.co,yrs:m.job.yrs}); } m.job=null; S.people.filter(p=>p.rel==='colegaT'||p.rel==='chefe').forEach(p=>p.alive=false); }
function yearMoney(){
  const m=S.me; let gross=0,net=0;
  if(m.prison) { m.loans.forEach(l=>{ l.bal=Math.round(l.bal*1.04); }); return; }
  if(m.job){ gross+=jobSalary(m.job); }
  if(m.office) gross+=OFFICES.find(o=>o.id===m.office.id).sal;
  if(m.ret) gross+=m.ret.pension;
  net=Math.round((gross-tax(gross))*diff().$); m.money+=net;
  if(m.social&&m.social.f>20000){ const sp=Math.round(m.social.f*R.f()*.08); m.money+=sp; if(sp>2000&&R.chance(.45)) log(R.pick([`Ganhei ${fmt(sp)} com publicidade nas redes.`,`Fechei parceria com uma marca de ${R.pick(['tênis','cosméticos','energético','celular','roupas'])} e ganhei ${fmt(sp)}.`,`Meus posts patrocinados renderam ${fmt(sp)} este ano.`]),'good'); }
  if(m.age<18&&S.flags.cls!=='pobre'&&parents().length&&m.age>=8){ const a={media:300,rica:2000,milionaria:12000,realeza:50000}[S.flags.cls]||0; m.money+=a; }
  if(m.age>=18){
    const ownHome=m.assets.some(a=>a.k==='casa');
    if(!S.flags.movedOut&&(m.age>=26||ownHome||people('conjuge').length||!parents().length)){ S.flags.movedOut=1; if(!ownHome&&parents().length) log('Saí da casa dos meus pais e aluguei um lugar só meu.'); }
    const atHome=!S.flags.movedOut;
    let cost=atHome?1800:(ownHome?4500:9500)+Math.round(gross*.32); /* o padrão de vida sobe junto com o salário */
    cost+=m.assets.filter(a=>a.k==='carro').length*900+people('pet').reduce((s,p)=>s+(typeof petDef==='function'&&petDef(p)&&petDef(p).ex?1500:500),0);
    if(m.edu.cur&&m.edu.cur.type!=='medio'&&m.age<26) cost=Math.min(cost,3000);
    kids().filter(k=>k.age<18).forEach(()=>cost+=4000);
    // morando com os pais e sem dinheiro: eles bancam o básico (sem dívida), mas o relacionamento sofre um pouco
    const ps=parents().filter(p=>p.money>0).sort((a,b)=>b.money-a.money);
    if(atHome&&m.money<cost&&ps.length){ ps[0].money-=cost; ps.forEach(p=>p.bond=clamp(p.bond-1)); if(R.chance(.3)) log(R.pick(['Meus pais bancaram minhas despesas mais um ano.','Meus pais pagaram minhas contas e jogaram na cara no almoço de domingo.'])); cost=0; }
    m.money-=cost; m.c.lastCost=cost;
    if(cost&&R.chance(.25)) log(atHome?`Gastei ${fmt(cost)} com celular, transporte e comida.`:`Gastei ${fmt(cost)} com aluguel, comida e contas este ano.`);
    // sem dinheiro: a dívida cresce com juros e a vida pesa
    if(m.money<0){ const j=Math.round(-m.money*.12); m.money-=j; if(j>300&&R.chance(.4)) log(`Paguei ${fmt(j)} só de juros da dívida.`,'bad'); }
    if(m.money<=0&&!(atHome&&ps.length)){ st('happy',-R.int(2,5)); st('looks',-R.int(0,2)); if(R.chance(.35)) log(R.pick(['Sem dinheiro, até o mercado virou um sufoco.','Contas atrasadas. Ando com vergonha de atender o telefone.','O dinheiro não fecha o mês.']),'warn'); }
  }
  for(const l of m.loans.slice()){ const p=Math.min(l.bal,l.pay); if(m.edu.cur&&l.n==='Financiamento estudantil') continue; m.money-=p; l.bal-=p; if(l.bal<=0){ m.loans.splice(m.loans.indexOf(l),1); log(`Quitei: ${l.n.toLowerCase()}.`,'good'); } }
  const iv=m.inv;
  if(iv.poup) iv.poup=Math.round(iv.poup*1.04);
  if(iv.acoes){ const r=R.norm(.065,.18); iv.acoes=Math.max(0,Math.round(iv.acoes*(1+r))); if(Math.abs(r)>.2) log(`Minhas ações ${r>0?'subiram':'caíram'} ${Math.round(Math.abs(r)*100)}% este ano.`,r>0?'good':'bad'); }
  if(iv.cripto){ const r=R.chance(.45)?R.f()*1.3:-R.f()*.65; /* a maioria perde um pouco, poucos ganham muito */ iv.cripto=Math.max(0,Math.round(iv.cripto*(1+r))); log(`Minhas criptomoedas ${r>0?'valorizaram':'derreteram'} ${Math.round(Math.abs(r)*100)}%.`,r>0?'good':'bad'); }
  if(m.money<-20000&&R.chance(.3)) queue('divida',{});
}
function yearPrison(){
  const m=S.me,pr=m.prison; if(!pr) return;
  pr.left--; pr.served++; cnt('prisonYrs');
  if(pr.left<=0||pr.juv&&m.age>=21){ m.prison=null; log(pr.juv?'Cumpri a medida socioeducativa e saí da internação.':'Cumpri minha pena e saí da prisão.','good'); st('happy',20); return; }
  if(pr.served>=pr.total/2&&pr.behav>=55&&R.chance(.3)){ m.prison=null; log('Ganhei liberdade condicional!','good'); st('happy',20); return; }
  if(R.chance(pr.gang?.04:.12)){ log(R.pick(['Um detento me atacou no refeitório.','Levei uma surra no pátio.','Arrumei briga na fila do banho.']),'bad'); st('health',-R.int(5,15)); }
  if(typeof prisonYearGang==='function') prisonYearGang();
}
function yearFame(){
  const m=S.me;
  if(!m.job||!m.job.spc) m.fame=clamp(m.fame-R.int(0,3));
  m.c.maxFame=Math.max(m.c.maxFame||0,m.fame);
  if(people('conjuge').length) cnt('marriedYrs');
  if(m.social){ const s=m.social; const drift=Math.round(s.f*(R.f()*.1-.04)+m.fame*R.int(0,40)); s.f=Math.max(0,s.f+drift); }
}
function yearAssets(){
  const m=S.me;
  for(const a of m.assets){
    if(a.k==='casa'){ a.value=Math.round(a.value*(1+R.norm(.04,.05))); a.cond=clamp(a.cond-R.int(1,4)); m.money-=Math.round(a.value*.012); }
    else if(a.k==='carro'&&a.classic){ a.value=Math.round(a.value*(1+R.norm(.05,.04))); a.cond=clamp(a.cond-R.int(0,2)); }
    else if(a.k==='carro'){ a.value=Math.round(a.value*R.f()*.08+a.value*.84); a.cond=clamp(a.cond-R.int(3,9)); m.money-=Math.round(a.value*.03); }
    else { a.value=Math.round(a.value*(1+R.norm(.01,.06))); }
    if(a.loan){ const p=Math.min(a.loan,a.pay); a.loan-=p; m.money-=p; if(a.loan<=0){ a.loan=0; log(`Terminei de pagar o financiamento do imóvel: ${a.n.toLowerCase()}.`,'good'); } }
  }
}

// ---------- resumo do ano: linhas sobre escola, trabalho, relações, família e saúde ----------
function yearSummary(){
  const m=S.me,L=[],a=m.age,o=oa();
  const c=m.edu.cur;
  // cada tipo de frase tem um intervalo mínimo em anos, para o resumo não repetir o mesmo assunto todo ano
  const sy=m.sumY||(m.sumY={}); const gap=(k,n)=>{ if(S.year-(sy[k]??-99)<n) return false; sy[k]=S.year; return true; };
  if(c&&c.yr>0&&(c.grade>=85||c.grade<45||gap('nota',2))){ const nota=(c.grade/10).toFixed(1).replace('.',','); const ano=c.type==='fund'?`${c.yr}º ano do fundamental`:c.type==='medio'?`${c.yr}º ano do ensino médio`:`${c.yr}º ano ${eduOf(c)}`;
    L.push(c.grade>=85?R.pick([`Fechei o ${ano} com média ${nota}. Os professores me adoram.`,`Média ${nota} no ${ano}! Meus pais colaram o boletim na geladeira.`,`Fui um dos destaques do ${ano}, com média ${nota}.`])
      :c.grade>=65?R.pick([`Terminei o ${ano} com média ${nota}.`,`Média ${nota} no ${ano}. Nada mal.`,`Passei de ano: média ${nota} no ${ano}.`])
      :c.grade>=45?R.pick([`Passei raspando no ${ano}, com média ${nota}.`,`Média ${nota} no ${ano}. Foi por pouco.`,`Recuperação em duas matérias, mas passei do ${ano} (média ${nota}).`])
      :R.pick([`Minhas notas no ${ano} foram péssimas: média ${nota}.`,`Média ${nota} no ${ano}. Meus pais não gostaram nada.`,`O boletim do ${ano} veio cheio de vermelho: média ${nota}.`])); }
  if(m.job&&!m.prison){ const j=m.job,t=jobTitle(j).toLowerCase(), cg=R.pick(people('colegaT'));
    if(j.perf>=80&&gap('job',2)) L.push(R.pick([`Meu chefe me elogiou na frente de todos. Sou ${t} exemplar.`,`Bati todas as metas como ${t}.`,`Fui escolhid${o} para treinar os novatos na ${j.co}.`,`Ganhei o prêmio de destaque do mês na ${j.co}.`]));
    else if(j.perf>=55&&gap('job',3)) L.push(R.pick([`Mais um ano como ${t} na ${j.co}.`,`O trabalho na ${j.co} seguiu tranquilo.`,`Rotina puxada na ${j.co}, mas dei conta.`,cg?`Almocei quase todo dia com ${cg.first}, da ${j.co}.`:`A ${j.co} mudou de escritório. Agora tem café de graça.`,`Fiz hora extra quase todo mês na ${j.co}.`]));
    else if(j.perf>=30&&j.perf<55&&gap('job',2)) L.push(R.pick([`Meu desempenho na ${j.co} caiu. Preciso me esforçar.`,`Levei uma advertência por atraso na ${j.co}.`,`Meu chefe anda me olhando torto.`]));
    else if(j.perf<30) L.push(`Estou na corda bamba na ${j.co}. Qualquer erro e sou ${m.gender==='F'?'demitida':'demitido'}.`); }
  else if(a>=19&&a<62&&!m.job&&!m.edu.cur&&!m.prison&&!m.office&&!m.biz&&!(m.royal&&!m.royal.abd)&&R.chance(.6)&&gap('semjob',2)) L.push(R.pick(['Passei mais um ano sem emprego.','Mandei currículo para tudo que é lugar.','Fiquei em casa procurando vagas na internet.','Fiz uns bicos para pagar as contas.','Fui a três entrevistas e ninguém me chamou de volta.']));
  const pr=partner();
  if(pr&&R.chance(.6)&&(pr.bond<45?gap('par',2):gap('par',3))){ const yrs=pr.yrs; const lbl=pr.rel==='conjuge'?'casad'+o:pr.rel==='noivo'?'noiv'+o:'namorando';
    L.push(pr.bond>=75?R.pick([`Completei ${yrs} ${yrs===1?'ano':'anos'} ${lbl==='namorando'?'de namoro':'com'} ${pr.first}. Estamos mais apaixonados do que nunca.`,`${pr.first} me fez uma surpresa no meu aniversário.`,`Viajamos, ${pr.first} e eu, só nós dois.`,`${pr.first} ainda me faz rir todos os dias.`])
      :pr.bond>=45?R.pick([`${yrs} ${yrs===1?'ano':'anos'} ${lbl==='namorando'?'de namoro com':'ao lado de'} ${pr.first}. Uma relação estável.`,`${pr.first} e eu caímos na rotina, mas estamos bem.`,`Discutimos por besteira, ${pr.first} e eu, mas passou.`])
      :R.pick([`As coisas com ${pr.first} andam frias. Brigamos quase toda semana.`,`${pr.first} e eu mal conversamos.`,`Dormi no sofá depois de mais uma briga com ${pr.first}.`])); }
  else if(!pr&&a>=22&&a<60&&R.chance(.25)&&gap('solo',3)) L.push(R.pick(['Continuo solteir'+o+'.','Fui a alguns encontros, mas nada sério.','Minha família não para de perguntar quando vou namorar.','Baixei um aplicativo de namoro. Deletei uma semana depois.']));
  for(const k of kids()){
    if(k.age===1) L.push(`${k.first} deu os primeiros passos!`);
    else if(k.age===6) L.push(`${k.first} começou a ir para a escola.`);
    else if(k.age===15&&R.chance(.6)) L.push(`${k.first} está na fase rebelde.`);
    else if(k.age===18&&R.chance(.6)) L.push(`${k.first} terminou o ensino médio.`);
  }
  for(const p of parents()){ if(p.age%10===0) L.push(`${p.rel==='mae'?'Minha mãe':'Meu pai'} fez ${p.age} anos.`); }
  const pet=R.pick(people('pet')); if(pet&&R.chance(.35)) L.push(R.pick([`${pet.first} destruiu ${R.pick(['o sofá','um chinelo','as plantas','o controle remoto'])}.`,`${pet.first} está cada vez mais apegad${pet.gender==='F'?'a':'o'} a mim.`,`${pet.first} fez ${pet.age} ${pet.age===1?'ano':'anos'}.`]));
  const f=R.pick(people('amigo')); if(f&&R.chance(.3)&&S.year-(f.saidY||-99)>=5){ f.saidY=S.year; const ga=f.gender==='F'; L.push(f.bond>=60?R.pick([`${f.first} continua sendo ${ga?'minha melhor amiga':'meu melhor amigo'}.`,`${f.first} e eu nos falamos quase todo dia.`,`Fui ao aniversário de ${f.first}.`,`${f.first} me ajudou num momento difícil.`]):R.pick([`${f.first} e eu nos afastamos um pouco.`,`Faz tempo que não falo com ${f.first}.`,`${f.first} sumiu do grupo de mensagens.`])); }
  if(a>=40&&m.health<45&&R.chance(.6)&&gap('saude',3)) L.push(R.pick(['Ando me sentindo cansad'+o+' o tempo todo.','Minhas costas doem todo dia.','O médico disse que preciso me cuidar mais.','Subir escada virou um desafio.','Meus exames vieram com vários números em vermelho.']));
  if(a>=18&&!m.prison&&R.chance(.35)&&gap('grana',3)){ const w=netWorth(); L.push(w>1e6?`Meu patrimônio passou de ${fmt(w)}.`:w<0?`Estou com dívidas que somam ${fmt(-w)}.`:R.pick([`Fechei o ano com ${fmt(m.money)} na conta.`,`Consegui guardar um pouco: tenho ${fmt(m.money)}.`])); }
  if(m.social&&m.social.f>1000&&R.chance(.4)&&gap('seg',3)) L.push(R.pick([`Já tenho ${m.social.f.toLocaleString('pt-BR')} seguidores.`,`Bati ${m.social.f.toLocaleString('pt-BR')} seguidores!`,`Um vídeo meu viralizou. Agora são ${m.social.f.toLocaleString('pt-BR')} seguidores.`]));
  if(m.prison) L.push(R.pick([`Faltam ${m.prison.left} ${m.prison.left>1?'anos':'ano'} para eu sair.`,'Os dias aqui dentro parecem todos iguais.','Conto os dias para sair daqui.']));
  for(const l of R.shuffle(L).slice(0,4)) log(l);
}

// ---------- realeza e empresa ----------
function yearRoyal(){
  const m=S.me,r=m.royal; if(!r||r.abd) return;
  if(!r.reign){
    const mon=S.people.find(p=>p.monarch);
    if(!mon||!mon.alive){
      if(mon) mon.monarch=false;
      const h=people('irmao').filter(s=>s.age>m.age).sort((a,b)=>b.age-a.age)[0];
      if(h){ h.monarch=true; h.job=g('Rei|Rainha',h.gender); log(`${h.first} foi ${h.gender==='F'?'coroada rainha':'coroado rei'}. Sigo na linha de sucessão.`); }
      else crown();
    }
  }
  if(!m.prison){ const inc=r.reign?5000000:m.age>=18?400000:0; m.money+=Math.round(inc*diff().$); }
  r.pop=clamp(r.pop+R.int(-6,4)+(m.karma-50)/20);
  m.fame=clamp(Math.max(m.fame,r.reign?75:35));
  if(r.reign&&r.pop<12&&R.chance(.35)){ r.reign=false; r.abd=true; m.royal.deposed=1; log('O povo se revoltou e a monarquia foi derrubada. Perdi a coroa.','bad'); st('happy',-30); m.money=Math.round(m.money*.4); }
}
function crown(){ const m=S.me,r=m.royal; r.reign=true; r.pop=clamp(r.pop+10); m.c.reigned=1; if(m.job) endJob(); log(`Fui ${g('coroado rei|coroada rainha',m.gender)} de ${countryOf(m.country).n}!`,'good'); st('happy',25); }
function royalTitle(){ const m=S.me,r=m.royal; if(!r||r.abd) return null; return r.reign?g('Rei|Rainha',m.gender):g('Príncipe|Princesa',m.gender); }
function yearBiz(){
  const m=S.me,b=m.biz; if(!b) return;
  b.yrs++; const sec=BIZ_SECTORS.find(s=>s.n===b.sector)||BIZ_SECTORS[0];
  const r=R.norm(.09+(m.smarts-50)/600+(b.mkt||0),sec.risk); b.mkt=0;
  b.value=Math.max(0,Math.round(b.value*(1+r)));
  b.emp=Math.max(1,Math.round(b.emp*(1+r*.8)+R.int(-1,2)));
  m.c.bizMax=Math.max(m.c.bizMax||0,b.value);
  if(m.prison){ b.value=Math.round(b.value*.8); }
  if(r>0&&!m.prison){ const p=Math.round(b.value*R.f()*.08*diff().$); m.money+=p; if(p>1000) log(`A ${b.n} lucrou e me rendeu ${fmt(p)}.`,'good'); }
  else if(r<-.2) log(`A ${b.n} teve um ano péssimo.`,'bad');
  if(b.value<b.start*.12&&R.chance(.5)){ log(`A ${b.n} faliu.`,'bad'); st('happy',-15); m.biz=null; }
  if(b.value>1e8) m.fame=clamp(Math.max(m.fame,30+Math.log10(b.value)*4));
}

// ---------- morte ----------
function deathP(age,health){ if(age<1) return .002; const base=age<45?.00035:.00028*Math.exp(.09*(age-30)); return Math.min(.9,base*Math.pow(1.6-health/100,2)); }
function deathRoll(){ const m=S.me; let p=deathP(m.age,m.health)*diff().d; for(const d of m.dis){ if(DISEASES[d.id].fatal) p+=.012+d.y*.01; } if(m.prison) p+=.003; return R.chance(p); }
function causeFromHealth(roll){
  const m=S.me; const fatal=m.dis.filter(d=>DISEASES[d.id].fatal);
  if(fatal.length) return 'de '+dn(DISEASES[R.pick(fatal).id].n);
  if(m.add.alcool>70&&R.chance(.4)) return 'de complicações do alcoolismo';
  if(m.age>75) return R.pick(['de causas naturais','dormindo, em paz','de insuficiência cardíaca','de pneumonia','de um AVC']);
  if(m.prison&&R.chance(.4)) return 'numa briga na prisão';
  const o=m.gender==='F'?'a':'o';
  return R.pick(['num acidente de carro','de um infarto fulminante','de um aneurisma',`afogad${o} no mar`,`atingid${o} por um raio`,'num acidente doméstico','de uma infecção grave',`engasgad${o} com um pedaço de carne`,'de uma reação alérgica grave','numa queda de escada']);
}
function die(cause){
  const m=S.me; if(!m.alive) return; m.alive=false; const gave=cause==='desistiu'; if(gave) m.c.gaveUp=1;
  m.cause=gave?'Desistiu desta vida':'Morreu '+cause; S.pending=[];
  log(gave?`Desisti desta vida aos ${m.age} anos. A história termina aqui.`:`Morri ${cause}, aos ${m.age} anos.`,'bad');
  const rib=computeRibbon(); S.ribbon=rib;
  META.lives++; META.ribbons[rib]=(META.ribbons[rib]||0)+1;
  META.grave.unshift({n:m.first+' '+m.last,a:m.age,y:S.year,c:cause,r:rib,w:netWorth(),job:m.hist.length?m.hist[m.hist.length-1].t:(m.job?jobTitle(m.job):null),gen:S.gen});
  META.grave=META.grave.slice(0,60);
  META.ch=META.ch||{}; S.newCh=[];
  const x={cls:S.flags.cls,w:netWorth(),kids:m.c.kids||0,c:m.c,age:m.age};
  for(const ch of CHALLENGES){ try{ if(!META.ch[ch.id]&&ch.ok(x)){ META.ch[ch.id]=1; S.newCh.push(ch.n); } }catch(e){} }
  save();
}
function computeRibbon(){
  const m=S.me,c=m.c,w=netWorth();
  const deg=m.edu.deg; const addicted=Object.values(m.add).filter(v=>v>60).length;
  const tests=[
    ['desistente',!!c.gaveUp],['coroado',!!c.reigned],['assassino',(c.kills||0)>=3],['empresario',(c.bizMax||0)>=1e8],['fugitivo',(c.escapes||0)>=1],['chefao',m.job&&m.job.spc==='crime'&&m.job.lvl>=5],
    ['criminoso',(c.crimes||0)>=12||m.rec.conv>=3],['magnata',w>=5e7],['presidente',(c.pres||0)>0],['famoso',(c.maxFame||m.fame)>=85||m.fame>=85],
    ['rico',w>=2e6],['heroi',m.karma>=96],['genio',m.smarts>=95&&deg.includes('post:dout')],['academico',deg.some(d=>d.startsWith('post:'))],
    ['general',m.job&&m.job.spc==='militar'&&m.job.lvl>=8],['centenario',m.age>=100],['fertil',(c.kids||0)>=8],
    ['familia',people('conjuge').length&&(c.marriedYrs||0)>=25&&kids().length>=2],['viciado',addicted>=2],['plastico',(c.surg||0)>=5],
    ['romantico',(c.partners||0)>=8],['bichos',(c.pets||0)>=6],['viajante',(c.trips||0)>=10],['apostador',(c.bets||0)>=30],
    ['sortudo',(c.lotto||0)>0],['generoso',(c.gifts||0)>=25],['workaholic',(c.work||0)>=50],['nomade',(c.emig||0)>=2],
    ['azarado',m.age<30],['preguica',(c.actions||0)<m.age*.3],
  ];
  for(const [id,ok] of tests) if(ok) return id;
  return 'comum';
}

// ---------- fila de eventos ----------
function queue(id,d){ if(!S.pending.find(e=>e.id===id&&EVENTS[id]&&EVENTS[id].once)) S.pending.push({id,d:d||{}}); }
