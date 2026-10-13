// ===== Desenhos de carros (um por modelo, na cor do anúncio) e ícones de animais =====
const PAINT={preto:'#1F2329',branco:'#F2F3F5',prata:'#C3C8D0',vermelho:'#D63A2F',azul:'#2F6FD6','verde-musgo':'#4F6B3A',amarelo:'#F2C230','cinza-grafite':'#4A4F57',vinho:'#7A1F33',laranja:'#F08A24'};
const BODY={
 hatch:{d:'M6 30V22Q7 18 12 17L20 16 27 9H44Q50 9 54 15L58 17Q60 18 60 22V30Z',w:'M22 16 28 11H43L50 16Z',p:36},
 sedan:{d:'M4 30V22Q5 19 10 18L20 17 26 10H42L49 17 58 18Q61 19 61 23V30Z',w:'M22 17 27 12H41L46 17Z',p:34},
 suv:{d:'M5 30V19Q5 15 9 15L14 14 18 7H52Q56 7 57 11L59 15Q60 16 60 20V30Z',w:'M18 14 21 9H51L54 14Z',p:36,rack:1},
 pickup:{d:'M4 30V21Q4 18 8 17L14 16 19 8H34L36 17H60V30Z',w:'M18 16 21 10H33V16Z',p:0,bed:1},
 sport:{d:'M3 30V24Q4 21 10 20L22 18 30 12H44L52 18 60 20Q62 21 62 25V30Z',w:'M26 18 31 14H43L48 18Z',p:37},
 super:{d:'M2 30V26Q3 23 10 22L24 19 32 14H42L54 20 61 22Q63 23 63 27V30Z',w:'M28 19 33 16H41L48 20Z',p:0,spoiler:1},
 limo:{d:'M2 30V23Q3 20 7 19L14 18 18 12H50L54 18 60 19Q62 20 62 24V30Z',w:'M17 18 20 14H51L53 18Z',p:30,p2:41},
 van:{d:'M5 30V12Q5 7 10 7H54Q59 7 59 12L60 30Z',w:'M9 10H22V17H9ZM26 10H39V17H26ZM43 10H55V17H43Z',p:0},
 beetle:{d:'M6 30Q6 20 14 17Q22 8 34 8Q48 8 54 18Q60 20 60 30Z',w:'M22 16Q26 11 34 11Q42 11 46 16Z',p:34},
 conv:{d:'M3 30V22Q4 19 10 18L24 17 28 13 30 17 60 18Q62 19 62 24V30Z',w:'',p:0},
 muscle:{d:'M3 30V21Q3 18 8 18L28 17 33 11H45L52 17 60 18Q62 19 62 23V30Z',w:'M34 17 36 13H44L48 17Z',p:0,stripe:1},
 cyber:{d:'M4 30V20L32 8 60 18V30Z',w:'M14 18 32 11 48 16Z',p:0},
 home:{d:'M3 30V9Q3 5 8 5H50Q58 5 60 14L61 30Z',w:'M48 8H55L58 15H48ZM8 9H18V15H8ZM22 9H32V15H22Z',p:0},
 mini:{d:'M10 30V21Q10 14 18 12L24 10H40Q48 10 52 16L56 18Q58 19 58 23V30Z',w:'M23 16 26 12H39L46 16Z',p:34},
 kei:{d:'M8 30V12Q8 8 12 8H46Q52 8 54 14L57 18Q58 19 58 23V30Z',w:'M12 11H30V17H12ZM33 11H44L50 17H33Z',p:0},
 fastback:{d:'M4 30V22Q5 19 10 18L20 17 27 10H40Q47 10 56 18L60 19Q62 20 62 24V30Z',w:'M23 17 28 12H39L48 17Z',p:34},
 wagon:{d:'M4 30V21Q5 18 10 17L18 16 23 9H56Q59 9 59 13V30Z',w:'M21 15 25 11H55V15Z',p:38,rack:1},
};
const MODEL_BODY={'Mini 1.0':'mini','Kei':'kei',Dot:'mini','Folha':'mini',Prima:'fastback',Imperial:'fastback',Faísca:'fastback',Continente:'fastback','Tigrão':'wagon'};
const bodyOf=c=>c.body||MODEL_BODY[c.m]||(c.cat==='Moto'?'moto':c.cat==='Bicicleta'?'bike':c.cat==='Motorhome'?'home':c.cat==='SUV'?'suv':c.cat==='Picape'?(c.b==='Voltana'?'cyber':'pickup'):c.cat==='Esportivo'?(c.b==='Raptora'?'muscle':'sport'):c.cat==='Superesportivo'?'super':c.cat==='Conversível'?'conv':c.cat==='Sedã'?'sedan':c.cat==='Luxo'?(/Limusine/.test(c.m)?'limo':'sedan'):c.cat==='Clássico'?(/Furgão/.test(c.m)?'van':/Clássico/.test(c.m)?'muscle':'beetle'):c.cat==='Elétrico'?(c.m==='Trovão'?'cyber':'hatch'):/Besouro/.test(c.m)?'beetle':'hatch');
const hashS=s=>{ let h=0; for(const ch of String(s)) h=(h*31+ch.charCodeAt(0))>>>0; return h; };
function carSVG(model,color,w=40){
  const paint=PAINT[color]||color||'#2F6FD6', key=typeof model==='string'?model:`${model.b} ${model.m}`, h=hashS(key);
  const type=typeof model==='string'?'sedan':bodyOf(model);
  const rim=['#D9DDE3','#E6C35A','#2B2B2B','#9AA3AE'][h%4], shade='rgba(0,0,0,.18)', glass='#9DD3F2';
  const wheel=(x,r=5.4)=>`<circle cx="${x}" cy="30" r="${r}" fill="#222"/><circle cx="${x}" cy="30" r="${r*.48}" fill="${rim}"/>${h%3===0?`<path d="M${x-r*.45} 30H${x+r*.45}M${x} ${30-r*.45}V${30+r*.45}" stroke="#222" stroke-width=".8"/>`:''}`;
  let s='';
  if(type==='moto'){ s=`<circle cx="14" cy="29" r="7" fill="none" stroke="#222" stroke-width="2.6"/><circle cx="50" cy="29" r="7" fill="none" stroke="#222" stroke-width="2.6"/><path d="M14 29 26 18H40L50 29" stroke="#555" stroke-width="2" fill="none"/><path d="M24 18Q28 11 38 13L42 18Z" fill="${paint}" stroke="rgba(0,0,0,.35)"/><path d="M33 13 42 12" stroke="#1d1d1d" stroke-width="3" stroke-linecap="round"/><path d="M44 16 48 8 52 8" stroke="#444" stroke-width="1.6" fill="none"/>`; }
  else if(type==='bike'){ s=`<circle cx="14" cy="28" r="8" fill="none" stroke="#333" stroke-width="2"/><circle cx="50" cy="28" r="8" fill="none" stroke="#333" stroke-width="2"/><path d="M14 28 26 16H42L50 28M26 16 32 28 42 16M24 12H30M42 16 44 10H48" stroke="${paint}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>`; }
  else { const b=BODY[type]||BODY.sedan;
    s=`<ellipse cx="32" cy="35" rx="28" ry="2.2" fill="rgba(0,0,0,.15)"/><path d="${b.d}" fill="${paint}" stroke="rgba(0,0,0,.4)" stroke-width="1"/>`;
    if(b.w) s+=`<path d="${b.w}" fill="${glass}" stroke="rgba(0,0,0,.35)" stroke-width=".7"/>`;
    if(b.p) s+=`<path d="M${b.p} 10V18" stroke="${paint}" stroke-width="1.6"/>`; if(b.p2) s+=`<path d="M${b.p2} 12V18" stroke="${paint}" stroke-width="1.6"/>`;
    s+=`<path d="M8 24H58" stroke="${shade}" stroke-width="1"/>`;
    if(b.spoiler||(type==='sport'&&h%2)) s+=`<path d="M52 18 61 16.6V19.2L55 20Z" fill="#222"/>`;
    if(b.stripe||(type==='sport'&&h%3===1)||h%7===0) s+=`<path d="M6 22.5H60" stroke="${color==='branco'?'#2F6FD6':'#fff'}" stroke-width="1.6" opacity=".85"/>`;
    if(b.rack||h%5===0&&type==='hatch') s+=`<path d="M20 6H50" stroke="#333" stroke-width="1.4"/>`;
    if(b.bed) s+=`<path d="M38 19H58" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`;
    if(type==='conv') s+=`<path d="M24 17 28 12" stroke="#333" stroke-width="1.2"/><circle cx="34" cy="13.5" r="2.2" fill="#6B4226"/>`;
    s+=`<circle cx="58.5" cy="21.5" r="1.4" fill="#FFE9A8"/><rect x="3.5" y="22" width="2" height="2.4" rx=".6" fill="#E04B3A"/>`;
    const wx=type==='limo'?[12,52]:type==='super'||type==='sport'?[15,50]:[16,48];
    s+=wheel(wx[0])+wheel(wx[1]);
  }
  return `<svg class="car" viewBox="0 0 64 40" width="${w}" height="${Math.round(w*.62)}" aria-hidden="true">${s}</svg>`;
}
const modelOf=name=>CAR_MODELS.find(c=>name.startsWith(`${c.b} ${c.m}`));

// ---------- animais: emoji por espécie/raça e cor de fundo própria ----------
const BREED_EMOJI={Poodle:'🐩',Labrador:'🦮','Golden retriever':'🦮','Pastor-alemão':'🐕‍🦺','Husky siberiano':'🐺',Pug:'🐶','Shih tzu':'🐶',Chihuahua:'🐶','Bulldog francês':'🐶',Yorkshire:'🐶',Siamês:'🐈',Persa:'🐱','Maine coon':'🦁',Bengal:'🐆','Azul russo':'🐈‍⬛',Frajola:'🐈‍⬛',Sphynx:'🐈',Laranja:'🐈',Angorá:'🐱'};
const SPECIES_EMOJI={'Porquinho-da-índia':'🐁',Chinchila:'🐭',Calopsita:'🐤',Periquito:'🐦',Arara:'🦜',Camaleão:'🦎',Iguana:'🦖','Peixe-palhaço':'🐠','Peixe-beta':'🐟'};
function petIcon(sp,breed,size){
  const base=String(sp.s||sp).split('|')[0];
  const em=(breed&&BREED_EMOJI[breed])||SPECIES_EMOJI[base]||sp.ic||'🐾';
  const hue=hashS(base+(breed||''))%360;
  return `<span class="tile" style="--h:${hue}${size?';font-size:'+size+'px':''}">${em}</span>`;
}
