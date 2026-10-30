// ===== 3.4: loja de bichos a partir dos 5 anos, abrigo com bichos de verdade e nome escolhido =====
// No abrigo aparecem poucos bichos sorteados no ano (sem escolher raça). Quase sempre são comuns, mas cada
// vaga tem 0,4% de chance de ser um bicho raro. Adotando pelo menu, eu escolho o nome.
const ABR_PESO=[['Cachorro|Cadela',34],['Gato|Gata',30],['Coelho|Coelha',8],['Hamster',7],['Porquinho-da-índia',7],['Calopsita',5],['Periquito',5],['Galinha|Galo',2],['Pato|Pata',2]];
const ABR_JEITO=['Dócil','Brincalhão','Tímido','Carinhoso','Agitado','Calmo','Desconfiado no começo','Comilão','Dorminhoco','Curioso'];
function abrigoBichos(){ const m=S.me; m.yr=m.yr||{}; if(m.yr.abr4&&m.yr.abr4.ano===S.year) return m.yr.abr4.l;
  const raros=PET_SPECIES.filter(x=>x.raro), l=[], n=R.int(3,5);
  for(let i=0;i<n;i++){ const raro=R.chance(.004)&&raros.length, sp=raro?R.pick(raros).s:R.wpick(ABR_PESO); const d=PET_SPECIES.find(x=>x.s===sp);
    const br=d&&d.br?(/^Cachorro/.test(sp)?(R.chance(.5)?'Vira-lata caramelo':null):/^Gato/.test(sp)?'Vira-lata':null):null;
    l.push({id:'abr'+S.year+'_'+i+'_'+R.int(0,1e6),sp,br,g:R.chance(.5)?'M':'F',age:R.int(0,8),jeito:R.pick(ABR_JEITO),raro:!!raro}); }
  m.yr.abr4={ano:S.year,l}; return l; }
const abrPrev=a=>({id:a.id,species:a.sp,breed:a.br,gender:a.g,age:a.age,first:''});
function abrNovoPet(a,nome,kind){ const m=S.me, s=PET_SPECIES.find(x=>x.s===a.sp); if(!s) return 'Esse bicho já foi adotado.';
  const p=mkPerson({rel:'pet',first:nome,gender:a.g,species:s.s,age:a.age,bond:R.int(60,90)});
  p.life=p.age+R.int(...s.life); p.icon=s.ic; p.breed=a.br||null; p.bx=bxLook(abrPrev(a)); S.people.push(p); cnt('pets'); st('happy',8);
  if(s.ex||s.raro) m.c.exotic=(m.c.exotic||0)+1;
  return `Adotei ${p.first}, ${g(s.s,a.g).toLowerCase()}${p.breed?' '+p.breed.toLowerCase():''}${kind==='abrigo'?' do abrigo':''}!`; }
function abrNome(prev,ok,titulo='Qual vai ser o nome?'){ const sug=R.pick(PET_NAMES.concat(PET_NAMES_EXTRA));
  modal({t:titulo,top:`<div class="bicho-modal">${bichoSVG(prev,{w:170})}</div>`,html:`<input class="in" id="petNome4" style="margin-top:8px" maxlength="24" placeholder="${esc(sug)}" autocomplete="off">`,
    ch:[{l:'Esse é o nome',fn:()=>{ const el=document.getElementById('petNome4'); const v=((el&&el.value)||'').trim().slice(0,24)||sug; ok(v); }},{l:'Voltar',cls:'alt'}]});
  setTimeout(()=>{ const el=document.getElementById('petNome4'); if(el) el.focus(); },120); }
V.abrigo=()=>{ const l=abrigoBichos(), it=[{html:'<div class="card"><p>Os bichos daqui não têm raça escolhida. A adoção custa só a taxa de $50. A lista muda todo ano.</p></div>'}];
  if(!l.length) it.push({l:'Todos os bichos deste ano já foram adotados',s:'Volte no ano que vem'});
  l.forEach((a,i)=>{ const s=PET_SPECIES.find(x=>x.s===a.sp), nome=g(a.sp,a.g);
    it.push({html:`<div class="card abr4${a.raro?' raro':''}"><span class="abr4-fig">${bichoSVG(abrPrev(a),{w:120})}</span><div><b>${esc(nome)}${a.br?' · '+esc(a.br):''}</b>${a.raro?' <span class="abr4-tag">💎 Raro</span>':''}<p>${a.g==='F'?'Fêmea':'Macho'} · ${a.age===0?'filhote':a.age+(a.age===1?' ano':' anos')} · ${esc(a.jeito)}${s&&s.dng?' · perigoso':''}</p></div></div>`},
      {ic:'🏠',l:'Adotar '+(/a$/.test(nome)?'esta':'este')+' '+nome.toLowerCase(),r:fmt(50),on:()=>abrNome(abrPrev(a),v=>minorPay(50,()=>{ if(!canPay(50)) return 'Não tenho dinheiro para a taxa.'; S.me.money-=50; const r=abrNovoPet(a,v,'abrigo'); const k=l.indexOf(a); if(k>=0) l.splice(k,1); MQ.unshift({t:'Abrigo',x:r}); UI.refresh(); return r; },'Abrigo'))}); });
  return {title:'Abrigo de animais',items:it}; };
// loja: o abrigo abre a lista acima; no criador, o nome é escolhido logo depois da compra
let abrCliqueLoja=0;
document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#sheetBody')) abrCliqueLoja=Date.now(); },true);
V.pets=(o=>function(){ const r=o.apply(this,arguments); try{ const a=r.items.find(x=>x.l==='Abrigo de animais'); if(a){ a.s='Poucos bichos por ano, sem escolher a raça'; a.on=()=>UI.push(V.abrigo); } }catch(e){} return r; })(V.pets);
adoptPet=(o=>function(kind,sp,breed){ const r=o.apply(this,arguments);
  try{ if(kind==='criador'&&Date.now()-abrCliqueLoja<30000&&/^Adotei/.test(r||'')){ abrCliqueLoja=0; const p=people('pet').filter(x=>x.alive).at(-1);
    if(p) setTimeout(()=>abrNome(p,v=>{ const velho=p.first; p.first=v; MQ.unshift({t:'Bicho novo',x:`${velho===v?'':'Mudei o nome para '}${v}. Bem-vind${p.gender==='F'?'a':'o'} à família!`}); pump&&pump(); },'Como vai se chamar?'),350); } }catch(e){}
  return r; })(adoptPet);

// ---------- criador: cada raça tem preço próprio, e bichos mais velhos saem mais baratos ----------
const RACA_PRECO={'Vira-lata caramelo':300,Labrador:2500,'Golden retriever':3000,'Bulldog francês':5000,Poodle:1500,Pug:3000,'Shih tzu':2000,'Husky siberiano':3500,'Pastor-alemão':3000,Dachshund:2000,Chihuahua:2500,'Border collie':3000,Rottweiler:2500,Yorkshire:2000,'Spitz alemão':5500,Beagle:2500,Pitbull:1500,'Dálmata':2500,'São-bernardo':4000,Corgi:6000,
  'Vira-lata':150,'Siamês':1200,Persa:2500,'Maine coon':5000,Sphynx:6000,Ragdoll:4000,Bengal:5000,'Angorá':1500,'Azul russo':3000,'British shorthair':4000,Frajola:150,Laranja:150};
const racaPreco=(sp,b)=>{ const v=b&&RACA_PRECO[b]; if(v) return v; return Math.round(sp.cost*(b?(/^Vira/.test(b)?.2:.8+(b.length%5)/10):1)/10)*10; };
// ofertas de idade: filhote custa o preço cheio; jovem, adulto e idoso vão ficando mais baratos
const CRI_FASES=[['Filhote',0,1],['Jovem',.14,.75],['Adulto',.4,.5],['Idoso',.72,.25]];
function criOfertas(sp,b){ const m=S.me; m.yr=m.yr||{}; const k='cri4_'+sp.s+'_'+(b||''); m.yr.cri4=m.yr.cri4||{}; if(m.yr.cri4[k]&&m.yr.cri4[k].ano===S.year) return m.yr.cri4[k].l;
  const vida=(sp.life[0]+sp.life[1])/2, base=racaPreco(sp,b);
  const l=CRI_FASES.map(([n,f,pr],i)=>({id:'cri'+S.year+'_'+i+'_'+R.int(0,1e6),sp:sp.s,br:b||null,g:R.chance(.5)?'M':'F',age:i?Math.max(1,Math.round(vida*f)):0,fase:n,preco:Math.max(sp.raro?Math.round(base*pr):50,Math.round(base*pr/10)*10)}));
  m.yr.cri4[k]={ano:S.year,l}; return l; }
V.criador4=(sp,b)=>()=>{ const l=criOfertas(sp,b), nome=g(sp.s,'M'), it=[{html:`<div class="card"><p>${esc(nome)}${b?' '+esc(b):''}. Bichos mais velhos custam menos e já vêm com o jeito formado.</p></div>`}];
  l.forEach(a=>{ it.push({html:`<div class="card abr4${sp.raro?' raro':''}"><span class="abr4-fig">${bichoSVG(abrPrev(a),{w:120})}</span><div><b>${a.fase}</b> <span class="abr4-tag">${fmt(a.preco)}</span><p>${a.g==='F'?'Fêmea':'Macho'} · ${a.age===0?'recém-nascid'+(a.g==='F'?'a':'o'):a.age+(a.age===1?' ano':' anos')}</p></div></div>`},
    {ic:'🛒',l:'Comprar '+(a.fase==='Idoso'?'o idoso':a.fase==='Adulto'?'o adulto':a.fase==='Jovem'?'o jovem':'o filhote'),r:fmt(a.preco),on:()=>abrNome(abrPrev(a),v=>minorPay(a.preco,()=>{ if(!canPay(a.preco)) return 'Não tenho dinheiro para isso.'; S.me.money-=a.preco; const r=abrNovoPet(a,v,'criador'); const k=l.indexOf(a); if(k>=0) l.splice(k,1); UI.refresh(); return r; },'Criador'))}); });
  if(!l.length) it.push({l:'Não sobrou nenhum bicho deste criador este ano',s:'Volte no ano que vem'});
  return {title:b||nome,items:it}; };
V.racas4=sp=>()=>({title:g(sp.s,'M'),items:[{html:'<div class="card"><p>Escolha a raça. O vira-lata é o mais barato.</p></div>'}].concat(sp.br.slice().sort((x,y)=>racaPreco(sp,x)-racaPreco(sp,y)).map(b=>({ic:petIcon(sp,b),l:b,s:'filhote '+fmt(racaPreco(sp,b))+' · idoso '+fmt(Math.round(racaPreco(sp,b)*.25)),r:'a partir de '+fmt(Math.round(racaPreco(sp,b)*.25)),on:()=>UI.push(V.criador4(sp,b))})))});
V.pets=(o=>function(){ const r=o.apply(this,arguments); try{ r.items.forEach(x=>{ const sp=PET_SPECIES.find(p=>x.l===g(p.s,'M')); if(!sp) return; x.on=()=>UI.push(sp.br?V.racas4(sp):V.criador4(sp,null)); if(sp.br) x.r='a partir de '+fmt(Math.min(...sp.br.map(b=>Math.round(racaPreco(sp,b)*.25)))); }); }catch(e){} return r; })(V.pets);

function pets4SelfTest(){ const s0=S, erros=[], ok=(c,x)=>{ if(!c) erros.push(x); };
  try{ newLife({country:'BR'}); S.me.age=6; S.me.money=1e6; let raros=0, tot=0;
    for(let y=0;y<400;y++){ S.year++; const l=abrigoBichos(); ok(l.length>=3&&l.length<=5,'abrigo com '+l.length); tot+=l.length; raros+=l.filter(a=>a.raro).length;
      l.forEach(a=>ok(PET_SPECIES.some(x=>x.s===a.sp),'espécie estranha '+a.sp)); }
    ok(raros/tot<.02,'raros demais no abrigo: '+raros+'/'+tot);
    const cao=PET_SPECIES.find(x=>/^Cachorro/.test(x.s)), of=criOfertas(cao,'Labrador'); ok(of.length===4&&of[0].preco>of[3].preco&&of[3].age>of[0].age,'idoso mais barato'); ok(racaPreco(cao,'Vira-lata caramelo')<racaPreco(cao,'Labrador'),'vira-lata mais barato');
    const a=abrigoBichos()[0], r=abrNovoPet(a,'Teste','abrigo'); ok(/Teste/.test(r)&&people('pet').some(p=>p.first==='Teste'&&p.bx),'adoção com nome');
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; }
  if(erros.length) throw Error('Abrigo 3.4 · '+erros.slice(0,5).join(' | ')); return {ok:true}; }
