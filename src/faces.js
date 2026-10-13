// ===== Rostos em vetor, cartoon com sombreado suave: degradê na pele e no cabelo, proporções por idade =====
const HAIR_HEX={preto:'#2A2222','castanho-escuro':'#4A2E1E',castanho:'#6E4428','castanho-claro':'#A0703F',loiro:'#EAC66B',ruivo:'#C2582B',grisalho:'#C4C4C4'};
const DYES=[{id:null,n:'Cor natural'},{id:'#EDE6D3',n:'Platinado'},{id:'#D23B34',n:'Vermelho'},{id:'#EE7AB1',n:'Rosa'},{id:'#8E58D6',n:'Roxo'},{id:'#3E74DC',n:'Azul'},{id:'#3CB36E',n:'Verde'},{id:'#F28C28',n:'Laranja'},{id:'#2A2222',n:'Preto'},{id:'#EAC66B',n:'Loiro'}];
const EYE_HEX={castanhos:'#7A4A28','castanho-escuros':'#4A2C18',pretos:'#2A1C16',verdes:'#3F9A5E',azuis:'#3E86E0','cor de mel':'#C08A2E',acinzentados:'#8796A6'};
const SHIRTS=['#4F6BD8','#E8604F','#3FAF7E','#9B59D0','#F2B43C','#2E3A59','#EE7AB1','#33AFC4','#7E8E40','#C4C8D2','#26262C','#F4F4F4'];
const BGS=['#CFE0FF','#FFD9CC','#CDEFDF','#EBD6FF','#FFEDB8','#C9EDF4','#FFD3E1','#E2E5EE'];
const PET_EMOJI={Cachorro:'🐶',Gato:'🐱',Coelho:'🐰',Hamster:'🐹',Papagaio:'🦜',Tartaruga:'🐢','Peixe-beta':'🐟','Porquinho-da-índia':'🐹',Cavalo:'🐴',Iguana:'🦎',Cobra:'🐍',Calopsita:'🐦',Furão:'🦦',Porco:'🐷',Lhama:'🦙'};

// ---------- traço: borda fina num tom mais escuro da própria cor (nada de contorno preto) ----------
let EDGE='#4A3428'; const SW=1.1, OL='#3A2722';
const isHex=c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c);
const edgeOf=c=>isHex(c)?mixHex(c,'#000000',.42):EDGE;
const ol=(w=SW,c)=>`stroke="${c||EDGE}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P_=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${ol(SW,edgeOf(fill))} ${extra}/>`;
const shine=d=>`<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3.4" stroke-linecap="round"/>`;
const strand=(d,c)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round" opacity=".45"/>`;
// cachos: círculos que se fundem num contorno só
const blob=(c,pts,r)=>{ const e=edgeOf(c); return pts.map(([x,y,rr])=>`<circle cx="${x}" cy="${y}" r="${rr||r}" fill="${c}" stroke="${e}" stroke-width="${SW*2}"/>`).join('')+pts.map(([x,y,rr])=>`<circle cx="${x}" cy="${y}" r="${rr||r}" fill="${c}"/>`).join(''); };
const CAP='M24,48 C21,28 34,15 50,15 C66,15 79,28 76,48 C73,36 62,29 50,29 C38,29 27,36 24,48Z';
const capH=(c,s)=>P_(CAP,c)+strand('M38,19 Q34,24 32,32 M50,16 L50,28 M62,19 Q66,24 68,32',s)+shine('M37,20 Q44,17 52,17.5');
const LONG_BACK='M50,13 C30,13 19,26 20,46 C20,62 17,80 18,99 L35,99 C33,86 35,74 37,64 L63,64 C65,74 67,86 65,99 L82,99 C83,80 80,62 80,46 C81,26 70,13 50,13Z';
const LONG_FRONT='M23.5,57 C20,28 34,14 50,14 C66,14 80,28 76.5,57 C75,42 67,31 55,29 C46,31 34,36 28,46 C26,49 24.6,53 23.5,57Z';
const HAIRS=[
 {id:'curto',n:'Curto clássico',g:'M',front:(c,s)=>P_('M23.5,50 C20,30 31,14 50,14 C69,14 80,30 76.5,50 C75,43 73,38 70,34 C62,36 46,35 36,30 C31,35 27,41 23.5,50Z',c)+strand('M36,30 Q44,26 50,21 M58,33 Q64,28 66,22',s)+shine('M38,19 Q46,15.5 55,16.5')},
 {id:'topete',n:'Topete',g:'M',front:(c,s)=>P_('M23.5,50 C21,32 27,21 36,17 C42,8 60,5 70,12 C79,18 80,34 76.5,50 C75,43 72,37 68,33 C58,35 42,34 32,32 C28,37 25,43 23.5,50Z',c)+strand('M40,30 Q46,20 56,14 M52,32 Q58,22 66,17',s)+shine('M42,12 Q52,7.5 62,9.5')},
 {id:'lateral',n:'Repartido de lado',g:'M',front:(c,s)=>P_('M23.5,51 C20,30 33,15 52,15 C70,15 81,30 76.5,51 C76,43 74,38 71,34 C66,31 62,26 59,20 C54,28 40,33 29,37 C26,41 24.5,46 23.5,51Z',c)+strand('M59,20 Q57,17 55,15.5 M44,30 Q50,26 54,22',s)+shine('M34,22 Q40,17.5 48,16.5')},
 {id:'moicano',n:'Moicano',g:'M',front:(c,s)=>`<path d="M24.5,46 C24,32 35,21 50,21 C65,21 76,32 75.5,46 C72,38 64,33 50,33 C36,33 28,38 24.5,46Z" fill="${c}" opacity=".38"/>`+P_('M44,34 C41,22 44,9 50,3 C56,9 59,22 56,34 Q50,31 44,34Z',c)+strand('M50,8 L50,30',s)},
 {id:'samurai',n:'Coque samurai',g:'M',back:c=>`<circle cx="50" cy="12" r="7.5" fill="${c}" ${ol()}/>`,front:(c,s)=>capH(c,s)+`<rect x="45" y="15.5" width="10" height="3" rx="1.5" fill="#B33" ${ol(1)}/>`},
 {id:'careca',n:'Careca',g:'M',front:()=>''},
 {id:'longoM',n:'Longo solto',g:'M',back:c=>P_('M50,14 C31,14 20,27 21,46 C21,58 20,70 21,80 Q28,84 35,80 C35,72 36,68 37,64 L63,64 C64,68 65,72 65,80 Q72,84 79,80 C80,70 79,58 79,46 C80,27 69,14 50,14Z',c),front:(c,s)=>P_('M23.5,57 C20,28 34,14 50,14 C66,14 80,28 76.5,57 C74,42 66,32 52,29 L50,22 L48,29 C34,32 26,42 23.5,57Z',c)+strand('M30,40 Q34,32 42,28 M70,40 Q66,32 58,28',s)+shine('M36,20 Q42,16.5 48,16')},
 {id:'raspado',n:'Raspado',g:'U',front:c=>`<path d="M24.5,46 C24,30 35,19 50,19 C65,19 76,30 75.5,46 C72,38 64,33 50,33 C36,33 28,38 24.5,46Z" fill="${c}" opacity=".9" stroke="${OL}" stroke-width="1.1" stroke-opacity=".55"/>`},
 {id:'cacheado',n:'Cacheado curto',g:'U',front:c=>blob(c,[[25,46],[25,38],[29,30],[35,23],[43,19],[51,17],[59,19],[66,23],[71,30],[75,38],[75,46],[37,29],[50,26],[63,29]],7)},
 {id:'black',n:'Black power',g:'U',back:c=>`<circle cx="50" cy="37" r="33" fill="${c}" ${ol()}/>`,front:c=>blob(c,[[29,33],[39,28],[50,27],[61,28],[71,33]],6.2)},
 {id:'dreads',n:'Dreads',g:'U',back:c=>[[19,32,56],[26,30,62],[33,32,52],[60,32,52],[67,30,62],[74,32,56]].map(([x,y,h])=>`<rect x="${x}" y="${y}" width="7" height="${h}" rx="3.5" fill="${c}" ${ol(1.4)}/>`).join(''),front:(c,s)=>capH(c,s)},
 {id:'longo',n:'Longo liso',g:'F',back:(c,s)=>P_(LONG_BACK,c)+strand('M26,60 Q24,78 26,94 M74,60 Q76,78 74,94',s),front:(c,s)=>P_(LONG_FRONT,c)+strand('M30,42 Q38,33 50,30',s)+shine('M36,20 Q43,16.5 52,16.5')},
 {id:'rabo',n:'Rabo de cavalo',g:'F',back:(c,s)=>P_('M68,24 C86,22 94,46 88,70 C86,80 80,88 76,86 C80,72 79,52 70,40Z',c)+strand('M78,40 Q84,56 80,76',s)+`<ellipse cx="71" cy="30" rx="3" ry="4.4" fill="#E8604F" ${ol(1.2)}/>`,front:(c,s)=>capH(c,s)},
 {id:'coque',n:'Coque alto',g:'F',back:(c,s)=>`<circle cx="50" cy="11.5" r="10" fill="${c}" ${ol()}/>`+strand('M43,9 Q50,4 57,9 M44,14 Q50,10 56,14',s),front:(c,s)=>capH(c,s)},
 {id:'tranca',n:'Trança lateral',g:'F',back:c=>[0,1,2,3,4,5,6].map(i=>`<ellipse cx="${73+i*1.1}" cy="${46+i*7.4}" rx="${6-i*.25}" ry="5.2" fill="${c}" ${ol(1.4)}/>`).join(''),front:(c,s)=>P_('M24,50 C21,28 34,15 50,15 C66,15 79,28 76,52 C72,38 62,30 52,30 C40,31 30,38 24,50Z',c)+strand('M36,22 Q46,24 60,22',s)+shine('M37,20 Q44,17 52,17.5')},
 {id:'chanel',n:'Chanel',g:'F',back:c=>P_('M19,46 C18,24 33,13 50,13 C67,13 82,24 81,46 L82,72 Q78,78 70,76 L69,62 L31,62 L30,76 Q22,78 18,72Z',c),front:(c,s)=>P_('M23.5,56 C21,28 35,15 50,15 C65,15 79,28 76.5,56 L76,40 Q63,41 50,38 Q37,41 24,40Z',c)+strand('M36,38 L37,30 M44,38.5 L44.5,30 M56,38.5 L55.5,30 M64,38 L63,30',s)+shine('M37,20 Q44,17 52,17.5')},
 {id:'ondulado',n:'Ondulado longo',g:'F',back:(c,s)=>P_('M50,13 C30,13 18,26 20,46 C16,58 22,66 17,76 C14,86 20,95 27,98 L36,98 C34,86 38,74 36,64 L64,64 C62,74 66,86 64,98 L73,98 C80,95 86,86 83,76 C78,66 84,58 80,46 C82,26 70,13 50,13Z',c)+strand('M24,62 Q20,72 25,82 M76,62 Q80,72 75,82',s),front:(c,s)=>P_(LONG_FRONT,c)+strand('M30,42 Q38,33 50,30',s)+shine('M36,20 Q43,16.5 52,16.5')},
 {id:'chiquinha',n:'Maria-chiquinha',g:'F',back:c=>P_('M27,40 C12,40 8,56 12,68 C14,74 18,76 21,72 C18,62 22,50 29,46Z',c)+P_('M73,40 C88,40 92,56 88,68 C86,74 82,76 79,72 C82,62 78,50 71,46Z',c)+`<circle cx="26" cy="42" r="3" fill="#EE7AB1" ${ol(1.1)}/><circle cx="74" cy="42" r="3" fill="#EE7AB1" ${ol(1.1)}/>`,front:(c,s)=>P_(CAP,c)+strand('M50,15.5 L50,29',s)+shine('M37,20 Q42,17 47,16.5')},
 {id:'pixie',n:'Joãozinho com franja',g:'F',front:(c,s)=>P_('M23.5,52 C20,28 35,14 52,14 C69,14 80,28 76.5,50 C75,45 73,41 70,38 C62,40 50,40 40,35 C34,39 28,45 23.5,52Z',c)+strand('M40,35 Q50,30 58,24 M60,38 Q66,32 68,26',s)+shine('M36,21 Q43,16.5 51,16')},
 {id:'cacheadoF',n:'Cacheado longo',g:'F',back:c=>blob(c,[[24,42],[19,54],[19,66],[21,78],[26,90],[76,42],[81,54],[81,66],[79,78],[74,90],[32,22],[50,15],[68,22]],9.5),front:c=>blob(c,[[25,46],[27,36],[33,27],[41,21],[50,19],[59,21],[67,27],[73,36],[75,46]],7.2)},
 {id:'franja',n:'Longo com franja',g:'F',back:(c,s)=>P_(LONG_BACK,c)+strand('M26,60 Q24,78 26,94 M74,60 Q76,78 74,94',s),front:(c,s)=>P_('M23.5,57 C21,28 35,14 50,14 C65,14 79,28 76.5,57 L75,42 C66,40 58,43 50,40 C42,43 34,40 25,42Z',c)+strand('M36,41 L38,31 M50,40 L50,30 M64,41 L62,31',s)+shine('M37,20 Q44,16.5 52,16.5')},
];
// ---------- roupas ----------
const TORSO='M10,104 C11,91 25,85 40,84 Q50,90 60,84 C75,85 89,91 90,104Z';
const tor=c=>P_(TORSO,c);
const TOPS=[
 {id:'camiseta',n:'Camiseta',g:'M',d:c=>tor(c)+`<path d="M40,84.5 Q50,91 60,84.5" fill="none" stroke="${mixHex(c,'#000000',.3)}" stroke-width="2.2"/>`},
 {id:'polo',n:'Camisa polo',g:'M',d:c=>tor(c)+P_('M39,84 L45,93 L50,88.5Z',mixHex(c,'#ffffff',.35))+P_('M61,84 L55,93 L50,88.5Z',mixHex(c,'#ffffff',.35))+`<circle cx="50" cy="94" r="1.1" fill="#fff"/><circle cx="50" cy="99" r="1.1" fill="#fff"/>`},
 {id:'social',n:'Camisa social e gravata',g:'M',d:c=>tor(c)+P_('M39,84 Q50,90 61,84 L56,104 L44,104Z','#F6F6F8')+P_('M48.2,90 L51.8,90 L53.6,101 L50,105 L46.4,101Z','#C22D43')+P_('M47.6,87.6 L52.4,87.6 L51.8,91 L48.2,91Z','#A22336')+`<path d="M39,84 L44,104 M61,84 L56,104" stroke="${mixHex(c,'#000000',.3)}" stroke-width="1.4"/>`},
 {id:'regataM',n:'Regata',g:'M',d:(c,s)=>tor(s)+P_('M28,104 C29,94 33,88 37,86 Q50,97 63,86 C67,88 71,94 72,104Z',c)},
 {id:'blusa',n:'Blusa decotada',g:'F',d:(c,s)=>tor(c)+P_('M38,84.2 Q50,99 62,84.2 Q50,90 38,84.2Z',s)},
 {id:'vestido',n:'Vestido de alcinha',g:'F',d:(c,s)=>tor(s)+P_('M27,104 C29,96 33,91 37,90 Q50,97 63,90 C67,91 71,96 73,104Z',c)+`<path d="M37,90 L39,84.5 M63,90 L61,84.5" stroke="${OL}" stroke-width="2.2" stroke-linecap="round"/>`},
 {id:'decoteV',n:'Blusa com decote V',g:'F',d:(c,s)=>tor(c)+P_('M40.5,84.5 L50,99 L59.5,84.5 Q50,90 40.5,84.5Z',s)},
 {id:'golaalta',n:'Gola alta',g:'F',d:c=>tor(c)+P_('M41,75 L59,75 L60.5,89 Q50,92 39.5,89Z',mixHex(c,'#000000',.12))+`<path d="M42,80 L58,80 M41.5,84 L58.5,84" stroke="${mixHex(c,'#000000',.3)}" stroke-width="1"/>`},
 {id:'moletom',n:'Moletom com capuz',g:'U',d:c=>tor(c)+P_('M33,92 C33,82 41,82 50,88 C59,82 67,82 67,92 C62,88 56,90 50,94 C44,90 38,88 33,92Z',mixHex(c,'#000000',.18))+`<path d="M46,91 L45,101 M54,91 L55,101" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`},
 {id:'uniforme',n:'Uniforme laranja',g:'U',d:()=>tor('#F07B2B')+`<path d="M41,84.5 L50,95 L59,84.5" fill="none" stroke="#B85512" stroke-width="2"/><rect x="64" y="94" width="12" height="5" rx="1" fill="#fff" opacity=".8"/>`},
];
const EYE_SHAPES=['Redondos','Amendoados','Sonolentos','Grandes'];
const BROWS=[{id:'fina',n:'Finas'},{id:'grossa',n:'Grossas'},{id:'arqueada',n:'Arqueadas'}];
const STACHE='M41,64.5 C44.5,61.5 48.5,62 50,63.6 C51.5,62 55.5,61.5 59,64.5 C56,66.2 52.5,65.8 50,65.6 C47.5,65.8 44,66.2 41,64.5Z';
const BEARDS=[
 {id:'none',n:'Sem barba',d:()=>''},
 {id:'rala',n:'Barba por fazer',d:c=>`<path d="M26.5,54 C27,70 38,78.5 50,78.5 C62,78.5 73,70 73.5,54 C70,66 62,71.5 50,71.5 C38,71.5 30,66 26.5,54Z" fill="${c}" opacity=".3"/><path d="${STACHE}" fill="${c}" opacity=".3"/>`},
 {id:'cheia',n:'Barba cheia',d:c=>P_('M24.8,49 C24,70 36,85 50,85 C64,85 76,70 75.2,49 C72,58 68,62.5 62,62.5 C58,61.5 42,61.5 38,62.5 C32,62.5 28,58 24.8,49Z',c)+P_(STACHE,c)},
 {id:'cavanhaque',n:'Cavanhaque',d:c=>P_('M45,71.5 C45,80.5 55,80.5 55,71.5 C53,73.5 47,73.5 45,71.5Z',c)+P_(STACHE,c)},
 {id:'bigode',n:'Bigode',d:c=>P_(STACHE,c)},
 {id:'bigodao',n:'Bigodão',d:c=>P_('M35.5,62 C33.5,69 38,69.5 40.5,67 C44.5,62 48.5,62.5 50,64 C51.5,62.5 55.5,62 59.5,67 C62,69.5 66.5,69 64.5,62 C62.5,67 58,61 50,62.4 C42,61 37.5,67 35.5,62Z',c)},
];
// ---------- acessórios (desenhados na geometria da cabeça) ----------
const LENS='fill="#CFE8FF" fill-opacity=".28"';
const GLASSES=[
 {id:'none',n:'Sem óculos',v:0,d:()=>''},
 {id:'redondo',n:'Óculos redondos',v:300,t:'grau',d:()=>`<g fill="none" stroke="#2B2B30" stroke-width="1.8" stroke-linecap="round"><path d="M34.2,51 L24.5,49.5 M65.8,51 L75.5,49.5 M46.6,51.5 Q50,49 53.4,51.5"/><circle cx="40.5" cy="52.5" r="6.3" ${LENS}/><circle cx="59.5" cy="52.5" r="6.3" ${LENS}/></g>`},
 {id:'quadrado',n:'Óculos quadrados',v:300,t:'grau',d:()=>`<g fill="none" stroke="#2B2B30" stroke-width="2" stroke-linejoin="round"><path d="M33.5,50 L24.5,49 M66.5,50 L75.5,49 M47.5,51 L52.5,51"/><rect x="33.5" y="47" width="14" height="11" rx="2.6" ${LENS}/><rect x="52.5" y="47" width="14" height="11" rx="2.6" ${LENS}/></g>`},
 {id:'gatinho',n:'Óculos gatinho',v:400,t:'grau',d:()=>`<g stroke="#7A2B4A" stroke-width="1.9" stroke-linejoin="round" fill="none"><path d="M33.5,50 L24.5,49 M66.5,50 L75.5,49 M47,51 Q50,49.5 53,51"/><path d="M32,46.5 C37,46.5 45,46.5 47.2,49 C47.2,55 43.5,58 39.5,57.6 C35.5,57.2 33.2,53.5 32,46.5Z" ${LENS}/><path d="M68,46.5 C63,46.5 55,46.5 52.8,49 C52.8,55 56.5,58 60.5,57.6 C64.5,57.2 66.8,53.5 68,46.5Z" ${LENS}/></g>`},
 {id:'escuro',n:'Óculos escuros',v:500,t:'sol',d:()=>`<g stroke="#15151A" stroke-width="2" stroke-linejoin="round"><path d="M33,50 L24.5,48.5 M67,50 L75.5,48.5 M47,50.5 L53,50.5" fill="none"/><path d="M32.5,47 L47.5,47 L47,53 C46.5,57.5 43,59 40,59 C36,59 33,57 32.5,53Z" fill="#1E1E26"/><path d="M52.5,47 L67.5,47 L67,53 C66.5,57 64,59 60,59 C57,59 53.5,57.5 53,53Z" fill="#1E1E26"/></g><path d="M35,49.5 L39,49.5 M55,49.5 L59,49.5" stroke="#fff" stroke-width="1.3" opacity=".55" stroke-linecap="round"/>`},
 {id:'aviador',n:'Óculos de sol aviador',v:650,t:'sol',d:()=>`<g stroke-linejoin="round"><path d="M33,50 L24.5,48.5 M67,50 L75.5,48.5 M47.5,48.4 Q50,46.4 52.5,48.4 M47.2,50.8 Q50,49.8 52.8,50.8" stroke="#B8902E" stroke-width="1.3" fill="none"/><path d="M32.8,47.4 L47.6,47.4 C48.2,53 46.2,59.4 40.4,59.4 C34.8,59.4 32.3,53.6 32.8,47.4Z" fill="#2C2620" stroke="#C9A13B" stroke-width="1.3"/><path d="M52.4,47.4 L67.2,47.4 C67.7,53.6 65.2,59.4 59.6,59.4 C53.8,59.4 51.8,53 52.4,47.4Z" fill="#2C2620" stroke="#C9A13B" stroke-width="1.3"/></g><path d="M34.5,49.6 L39.5,49.6 M54,49.6 L59,49.6" stroke="#fff" stroke-width="1.2" opacity=".5" stroke-linecap="round"/><path d="M33.5,54.5 Q40.5,57 47,53.8 M53,53.8 Q59.5,57 66.5,54.5" stroke="#8C6A3A" stroke-width="2.2" opacity=".35" fill="none"/>`},
 {id:'espelhado',n:'Óculos de sol espelhado',v:700,t:'sol',d:()=>`<g stroke="#15151A" stroke-width="1.9" stroke-linejoin="round"><path d="M33,50 L24.5,48.5 M67,50 L75.5,48.5 M47,50.5 L53,50.5" fill="none"/><path d="M32.5,47 L47.5,47 L47,53 C46.5,57.5 43,59 40,59 C36,59 33,57 32.5,53Z" fill="#3E86E0"/><path d="M52.5,47 L67.5,47 L67,53 C66.5,57 64,59 60,59 C57,59 53.5,57.5 53,53Z" fill="#3E86E0"/></g><path d="M33.4,53.5 L46.6,51 L46.4,54 C45,57 43,58.2 40,58.2 C36.5,58.2 34,56.5 33.4,53.5Z M53.4,51 L66.6,53.5 C66,56.5 63.5,58.2 60,58.2 C57,58.2 55,57 53.6,54Z" fill="#9B5DE5" opacity=".75"/><path d="M35,50.5 L41,49.2 M55,49.2 L61,50.5" stroke="#fff" stroke-width="1.6" opacity=".75" stroke-linecap="round"/>`},
 {id:'lennon',n:'Óculos de sol redondinho',v:450,t:'sol',d:()=>`<g stroke="#B8902E" stroke-width="1.2" fill="none"><path d="M35.3,51.5 L24.5,49.5 M64.7,51.5 L75.5,49.5 M45.7,52 Q50,49 54.3,52"/><circle cx="40.5" cy="52.5" r="5.2" fill="#1E1E26"/><circle cx="59.5" cy="52.5" r="5.2" fill="#1E1E26"/></g><circle cx="38.6" cy="50.7" r="1.2" fill="#fff" opacity=".55"/><circle cx="57.6" cy="50.7" r="1.2" fill="#fff" opacity=".55"/>`},
 {id:'esportivo',n:'Óculos de sol esportivo',v:550,t:'sol',d:()=>`<path d="M31,50 L24.5,48 M69,50 L75.5,48" stroke="#15151A" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30.5,47.5 Q50,43.5 69.5,47.5 L68.5,54.5 Q61,59.5 53.5,55.8 Q50,54.2 46.5,55.8 Q39,59.5 31.5,54.5Z" fill="#F28C28" ${ol(1.8)}/><path d="M31.5,51.5 Q50,47.5 68.5,51.5 L68.5,54.5 Q61,59.5 53.5,55.8 Q50,54.2 46.5,55.8 Q39,59.5 31.5,54.5Z" fill="#D23B34" opacity=".6"/><path d="M35,49 Q43,46.8 50,46.6" stroke="#fff" stroke-width="1.5" opacity=".6" fill="none" stroke-linecap="round"/>`},
 {id:'gatinhoSol',n:'Óculos de sol gatinho',v:600,t:'sol',d:()=>`<g stroke="#15151A" stroke-width="1.9" stroke-linejoin="round"><path d="M33.5,50 L24.5,49 M66.5,50 L75.5,49 M47,51 Q50,49.5 53,51" fill="none"/><path d="M31,45.5 C37,46.5 45,46.5 47.2,49 C47.2,55 43.5,58 39.5,57.6 C35.5,57.2 33,53.5 31,45.5Z" fill="#2A1E24"/><path d="M69,45.5 C63,46.5 55,46.5 52.8,49 C52.8,55 56.5,58 60.5,57.6 C64.5,57.2 67,53.5 69,45.5Z" fill="#2A1E24"/></g><path d="M35,49.5 L40,49.8 M55,49.8 L60,49.5" stroke="#fff" stroke-width="1.2" opacity=".5" stroke-linecap="round"/>`},
 {id:'coracao',n:'Óculos de sol de coração',v:350,t:'sol',d:()=>{ const h=x=>`M${x},50 C${x-1.5},46.5 ${x-7},46.5 ${x-7},50.5 C${x-7},54 ${x-3},56 ${x},58.5 C${x+3},56 ${x+7},54 ${x+7},50.5 C${x+7},46.5 ${x+1.5},46.5 ${x},50Z`; return `<path d="M33.5,50 L24.5,49 M66.5,50 L75.5,49 M47.5,51 L52.5,51" stroke="#E2437A" stroke-width="1.6" fill="none"/><path d="${h(40.5)}" fill="#F05A8C" fill-opacity=".85" stroke="#B82A5E" stroke-width="1.5"/><path d="${h(59.5)}" fill="#F05A8C" fill-opacity=".85" stroke="#B82A5E" stroke-width="1.5"/><circle cx="37.5" cy="49.5" r="1.1" fill="#fff" opacity=".7"/><circle cx="56.5" cy="49.5" r="1.1" fill="#fff" opacity=".7"/>`; }},
 {id:'monoculo',n:'Monóculo',v:1200,d:()=>`<g fill="none" stroke="#B8932F" stroke-width="1.8"><circle cx="59.5" cy="52.5" r="6.8" ${LENS}/><path d="M65,57 C69,68 66,80 61,92" stroke-width="1" stroke-dasharray="1.6 1.2"/></g>`},
];
// cut: altura (y) acima da qual o cabelo some debaixo do chapéu
const HATS=[
 {id:'none',n:'Sem chapéu',v:0,d:()=>''},
 {id:'bone',n:'Boné',v:120,cut:39,d:c=>P_('M23,41 C22,19 35,10 50,10 C65,10 78,19 77,41Z',c)+`<path d="M50,11 L50,37 M36,14 Q33,26 34,38 M64,14 Q67,26 66,38" stroke="${mixHex(c,'#000000',.25)}" stroke-width="1.1" fill="none"/>`+P_('M21,40.5 Q50,33 79,40.5 Q84,47.5 50,47.5 Q16,47.5 21,40.5Z',mixHex(c,'#000000',.2))+`<circle cx="50" cy="11" r="2.2" fill="${c}" ${ol(1)}/>`},
 {id:'gorro',n:'Gorro',v:90,cut:43,d:c=>P_('M22,44 C20,16 34,8 50,8 C66,8 80,16 78,44Z',c)+`<path d="M36,12 L35,38 M50,9 L50,38 M64,12 L65,38" stroke="${mixHex(c,'#000000',.2)}" stroke-width="1.2"/>`+P_('M20.5,37 Q50,30 79.5,37 L79.5,46 Q50,39.5 20.5,46Z',mixHex(c,'#000000',.15))+`<circle cx="50" cy="7" r="6" fill="#F6F6F6" ${ol()}/>`},
 {id:'panama',n:'Chapéu panamá',v:250,cut:31,d:c=>`<ellipse cx="50" cy="33" rx="36" ry="7" fill="#EAD9A6" ${ol()}/>`+P_('M31,33 C30,13 70,13 69,33 Q50,36 31,33Z','#EAD9A6')+P_('M31,26 Q50,28.5 69,26 L69.3,31 Q50,34 30.7,31Z',c)},
 {id:'cartola',n:'Cartola',v:900,cut:30,d:()=>`<ellipse cx="50" cy="31" rx="30" ry="5.5" fill="#22222A" ${ol()}/>`+P_('M34,31 L35.5,2 L64.5,2 L66,31 Q50,34 34,31Z','#22222A')+P_('M34.6,22 L65.4,22 L65.8,28 Q50,30.5 34.2,28Z','#8E1F31')},
 {id:'coroa',n:'Coroa',v:250000,d:()=>P_('M30,25 L28,6 L39,15 L50,2 L61,15 L72,6 L70,25 Q50,21 30,25Z','#F4C443')+`<path d="M31,21 Q50,17.5 69,21" stroke="#C99A20" stroke-width="1.2" fill="none"/><circle cx="50" cy="16" r="2.8" fill="#D33A4F" ${ol(1)}/><circle cx="38.5" cy="19.5" r="2" fill="#3E86E0" ${ol(.9)}/><circle cx="61.5" cy="19.5" r="2" fill="#3FAF7E" ${ol(.9)}/><circle cx="28" cy="6" r="1.8" fill="#F4C443" ${ol(.9)}/><circle cx="50" cy="2" r="1.8" fill="#F4C443" ${ol(.9)}/><circle cx="72" cy="6" r="1.8" fill="#F4C443" ${ol(.9)}/>`},
 {id:'tiara',n:'Tiara',v:3000,d:()=>`<path d="M26,31 Q50,16 74,31" stroke="${OL}" stroke-width="4.6" fill="none" stroke-linecap="round"/><path d="M26,31 Q50,16 74,31" stroke="#E2E5EE" stroke-width="2.6" fill="none" stroke-linecap="round"/>`+P_('M41,22.5 L43,15 L46.5,20 L50,10.5 L53.5,20 L57,15 L59,22.5 Q50,19.5 41,22.5Z','#E2E5EE')+`<circle cx="50" cy="17.5" r="2" fill="#EE7AB1" ${ol(.8)}/>`},
 {id:'laco',n:'Laço',v:40,d:c=>P_('M64,21 C58,12 52,13 53,21 C52,29 58,30 64,21Z',c)+P_('M64,21 C70,12 76,13 75,21 C76,29 70,30 64,21Z',c)+`<circle cx="64" cy="21" r="3" fill="${mixHex(c,'#000000',.15)}" ${ol(1.2)}/>`},
 {id:'bandana',n:'Bandana',v:60,d:c=>P_('M23,31 Q50,20 77,31 L77,39 Q50,29 23,39Z',c)+P_('M76,33 L88,28 L86,39Z',c)+P_('M76,35 L85,44 L79,46Z',mixHex(c,'#000000',.15))+`<circle cx="40" cy="30" r="1" fill="#fff"/><circle cx="50" cy="27.5" r="1" fill="#fff"/><circle cx="60" cy="30" r="1" fill="#fff"/>`},
 {id:'capacete',n:'Capacete de obra',v:150,cut:42,d:()=>P_('M20,42 C19,14 34,7 50,7 C66,7 81,14 80,42Z','#F4B82C')+P_('M45.5,8 L54.5,8 L54.5,40 L45.5,40Z','#E3A21C')+P_('M14,40 Q50,33.5 86,40 L86,45.5 Q50,39.5 14,45.5Z','#E3A21C')},
];
const EARRINGS=[{id:'none',n:'Sem brincos',v:0},{id:'ponto',n:'Brinco de ponto',v:150},{id:'argola',n:'Argolas',v:250},{id:'perola',n:'Pérolas',v:900}];
const PIERCINGS=[{id:'none',n:'Sem piercing',v:0},{id:'nariz',n:'Piercing no nariz',v:200},{id:'sobrancelha',n:'Piercing na sobrancelha',v:200},{id:'labio',n:'Piercing no lábio',v:200}];
const MAKEUPS=[{id:'none',n:'Sem maquiagem',v:0},{id:'batom',n:'Batom vermelho',v:80},{id:'rosa',n:'Batom rosa',v:80},{id:'blush',n:'Blush',v:60},{id:'delineado',n:'Delineado',v:70},{id:'completa',n:'Maquiagem completa',v:200}];

function mixHex(a,b,t){ const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)); const x=p(a),y=p(b); return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join(''); }
function ensureLook(p){
  if(p.look) return p.look;
  const ge=p.genes||(p.genes=randGenes(p.gender));
  if(ge.skin==null){ ge.skin=R.int(0,SKINS.length-1); ge.style=R.int(0,5); }
  if(ge.eyeShape==null) ge.eyeShape=R.int(0,3);
  const M=p.gender==='M';
  const hair=R.pick(M?['curto','curto','topete','lateral','lateral','raspado','cacheado','black','dreads','moicano','samurai','longoM']:['longo','longo','rabo','coque','tranca','chanel','ondulado','ondulado','cacheadoF','chiquinha','pixie','franja','black']);
  p.look={hair:M&&R.chance(.06)?'careca':hair, top:R.pick(TOPS.filter(x=>(x.g===p.gender||x.g==='U')&&x.id!=='uniforme')).id, brow:R.pick(BROWS).id, beard:M&&R.chance(.38)?R.pick(BEARDS.slice(1)).id:'none',
    glasses:ge.glasses?R.pick(['redondo','quadrado',M?'quadrado':'gatinho']):'none', hat:'none', ear:!M&&R.chance(.55)?R.pick(['ponto','argola','perola']):(M&&R.chance(.08)?'ponto':'none'),
    pierce:R.chance(.06)?R.pick(['nariz','sobrancelha','labio']):'none', makeup:!M&&R.chance(.35)?R.pick(['batom','rosa','blush','delineado']):'none', shirt:R.pick(SHIRTS), hatColor:R.pick(SHIRTS), dye:null};
  return p.look;
}
const HEAD='M50,20 C67,20 75.5,32 75.5,48 C75.5,63 67.5,76 50,78 C32.5,76 24.5,63 24.5,48 C24.5,32 33,20 50,20Z';
// rosto masculino: mandíbula quadrada · feminino: maçãs arredondadas e queixo fino
const HEAD_M='M50,20 C67.5,20 76,32 76,48 C76,59 74.8,67.5 68.5,73.2 C63.5,77.6 57,79.2 50,79.2 C43,79.2 36.5,77.6 31.5,73.2 C25.2,67.5 24,59 24,48 C24,32 32.5,20 50,20Z';
const HEAD_F='M50,20.5 C66.5,20.5 75,32 75,47 C75,60 69.5,70.5 60.5,75.4 C56.5,77.4 53.2,78 50,78 C46.8,78 43.5,77.4 39.5,75.4 C30.5,70.5 25,60 25,47 C25,32 33.5,20.5 50,20.5Z';
const HEAD_KID='M50,22 C67,22 77,34 77,50 C77,67 65,77.5 50,77.5 C35,77.5 23,67 23,50 C23,34 33,22 50,22Z';
const HEAD_BABY='M50,26 C67,26 77,38 77,53 C77,69 65,79 50,79 C35,79 23,69 23,53 C23,38 33,26 50,26Z';
// macacão de bebê
const ONESIE={id:'macacao',d:c=>{ const b=mixHex(c,'#ffffff',.55); return tor(b)+`<path d="M40,84.5 Q50,91 60,84.5" fill="none" stroke="${mixHex(b,'#000000',.25)}" stroke-width="2.4"/><circle cx="50" cy="95" r="1.6" fill="#fff" ${ol(.8)}/><circle cx="50" cy="100.5" r="1.6" fill="#fff" ${ol(.8)}/>`; }};
let FACE_UID=0;
function faceSVG(p,size=44,over){
  if(p.rel==='pet'||p.species){ const sp=g(p.species||'','M'); const em=(typeof BREED_EMOJI!=='undefined'&&p.breed&&BREED_EMOJI[p.breed])||(typeof SPECIES_EMOJI!=='undefined'&&SPECIES_EMOJI[sp])||p.icon||(typeof petDef==='function'&&petDef(p).ic)||PET_EMOJI[sp]||'🐾'; return `<svg class="face" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><circle cx="50" cy="50" r="50" fill="hsl(${hashS(sp+(p.breed||''))%360} 70% 86%)"/><text x="50" y="69" font-size="56" text-anchor="middle">${em}</text></svg>`; }
  const L=Object.assign({},ensureLook(p),over||{}), ge=p.genes, age=p.age??30, dead=p.alive===false;
  if(p.prison&&!(over&&over.top)) L.top='uniforme';
  const skin0=SKINS[ge.skin??2], skin=p===S?.me&&S.scen&&S.scen.inf?mixHex(skin0,'#86A86A',.45):skin0, dark=mixHex(skin,'#5A2A18',.38), skinEdge=mixHex(skin,'#3A1A10',.4), neck=mixHex(skin,'#5A2A18',.1);
  // cabelo grisalho aos poucos: começa nas têmporas por volta dos 42 e fica branco depois dos 70
  const hc0=L.dye||HAIR_HEX[ge.hair]||'#4A2E1E'; const gray=L.dye?0:age>=75?.9:age>=65?.72:age>=56?.5:age>=48?.26:age>=42?.1:0;
  let hc=gray?mixHex(hc0,'#E6E6E6',gray):hc0;
  const hs=mixHex(hc,'#000000',.4), hairEdge=mixHex(hc,'#000000',.5);
  const ec=EYE_HEX[ge.eyes]||'#6a4a2a';
  const mood=p===S?.me?p.happy:(p.bond??60);
  const id='f'+(++FACE_UID), uid=p.id||7;
  // fases da vida: proporções bem diferentes
  const baby=age<2, small=age<8, kid=age<13, teen=age>=13&&age<18, adult=!kid&&age>=15, old=age>=65, F=p.gender==='F';
  const tod=age<5, bs=baby?.74:tod?.64:small?.74:kid?.84:teen?.92:1, hsc=baby?1.12:tod?1.12:small?1.07:kid?1.03:teen?1.01:1, hcy=baby?57:tod?56:small?54:kid?52:teen?50.5:50;
  // calvície: parte dos homens perde o cabelo com a idade
  // doenças que aparecem no rosto (só o personagem tem a lista de doenças)
  const DS=new Set((p.dis||[]).map(d=>d.id)), chemo=hasCancer(p), regrow=!chemo&&p.hairBack&&S&&S.year<p.hairBack;
  const H=chemo&&!baby?HAIRS.find(h=>h.id==='careca'):regrow&&!['careca','raspado'].includes(L.hair)?HAIRS.find(h=>h.id==='raspado'):!F&&!baby&&((age>=50&&uid%4===0)||(age>=62&&uid%4===1))?HAIRS.find(h=>h.id==='careca'):HAIRS.find(h=>h.id===L.hair)||HAIRS[0];
  const hat=HATS.find(x=>x.id===L.hat)||HATS[0];
  const head=baby?HEAD_BABY:kid?HEAD_KID:F?HEAD_F:HEAD_M, dy=baby?4:small?2.5:kid?1.5:0;
  const hairClip=hat.cut&&!baby?` clip-path="url(#${id}c)"`:'';
  const sx=small?1:kid?(F?.94:1.03):F?.88:1.08, mAd=!F&&age>=16, fAd=F&&age>=13;
  const SK=`url(#${id}sk)`, HG=`url(#${id}hg)`;
  const body=[], hd=[];
  // ---- corpo (escala por idade) ----
  EDGE=skinEdge;
  if(!baby) body.push(`<path d="M42,64 L42,89 Q50,93 58,89 L58,64Z" fill="${neck}" ${ol(SW,skinEdge)}/><path d="M42,68 Q50,80 58,68 L58,64 L42,64Z" fill="${dark}" opacity=".3"/>`);
  let tid=L.top||(F?'blusa':'camiseta'); if(kid&&['social','vestido','regataM','decoteV','blusa'].includes(tid)) tid=F?'golaalta':'camiseta';
  const top=baby?ONESIE:TOPS.find(x=>x.id===tid)||TOPS[0];
  body.push(top.d(L.shirt,skin,dark));
  body.push(`<path d="${TORSO}" fill="url(#${id}cl)"/>`);
  if(mAd&&age>=18) body.push(`<path d="M49.2,72.5 Q50.9,74.6 49.6,76.8" stroke="${dark}" stroke-width="1" fill="none" opacity=".45" stroke-linecap="round"/>`);
  if(age>=55) body.push(`<path d="M45.5,72 Q47.5,75 45.5,78 M54.5,72 Q52.5,75 54.5,78" stroke="${dark}" stroke-width=".8" fill="none" opacity=".55"/>`);
  // ---- cabeça (inclui cabelo e acessórios) ----
  EDGE=hairEdge;
  if(!baby&&H.back) hd.push(`<g${hairClip}>${H.back(HG,hs)}</g>`);
  EDGE=skinEdge;
  const ex=baby?39.5:40.5, ex2=100-ex;
  hd.push(`<ellipse cx="24.8" cy="${52+dy}" rx="4.4" ry="6.2" fill="${SK}" ${ol()}/><ellipse cx="75.2" cy="${52+dy}" rx="4.4" ry="6.2" fill="${SK}" ${ol()}/><path d="M25.4,${49.5+dy} Q23,${52+dy} 25.4,${55+dy} M74.6,${49.5+dy} Q77,${52+dy} 74.6,${55+dy}" stroke="${dark}" stroke-width="1.1" fill="none" opacity=".5"/>`);
  hd.push(`<path d="${head}" fill="${SK}" ${ol()}/>`);
  hd.push(`<g clip-path="url(#${id}h)">${!baby&&H.id!=='careca'?`<g transform="translate(0 2.4)" opacity=".16">${H.front('#3A1A10','#3A1A10')}</g>`:''}<path d="M24,${66+dy} Q50,${84+dy} 76,${66+dy} L76,90 L24,90Z" fill="${dark}" opacity=".08"/></g>`);
  // bochechas, sardas, espinhas, rugas
  const blushO=baby?.45:kid?.32:L.makeup==='blush'||L.makeup==='completa'?.4:fAd?.22:.08;
  hd.push(`<ellipse cx="33.5" cy="${62+dy}" rx="4.6" ry="2.8" fill="#FF6F86" opacity="${blushO}"/><ellipse cx="66.5" cy="${62+dy}" rx="4.6" ry="2.8" fill="#FF6F86" opacity="${blushO}"/>`);
  if(mAd&&age>=20&&L.beard==='none'&&!chemo&&uid%3!==0) hd.push(`<g clip-path="url(#${id}h)"><path d="M28.5,58 Q31,74 50,79.5 Q69,74 71.5,58 Q68,70 58.5,71.8 Q54,68.6 50,69.2 Q46,68.6 41.5,71.8 Q32,70 28.5,58Z" fill="${mixHex(hc,'#3A3A3A',.3)}" opacity=".16"/></g>`);
  if(mAd) hd.push(`<path d="M30.5,66 Q34,73.5 41,76.6 M69.5,66 Q66,73.5 59,76.6" stroke="${dark}" stroke-width=".9" fill="none" opacity=".22" stroke-linecap="round"/>`);
  // catapora: pintas vermelhas na doença e marquinhas para sempre depois
  const POX=[[33,40],[62,37],[38,58],[64,61],[44,70],[58,46],[30,52],[69,50],[52,33],[47,76]];
  if(DS.has('catapora')) hd.push(POX.map(([x,y])=>`<circle cx="${x}" cy="${y+dy}" r="1.6" fill="#E04A5A" opacity=".85"/><circle cx="${x+.4}" cy="${y+dy-.4}" r=".55" fill="#fff" opacity=".6"/>`).join(''));
  else if(ge.pox) hd.push(POX.slice(0,6).map(([x,y])=>`<circle cx="${x}" cy="${y+dy}" r="1" fill="${dark}" opacity=".45"/>`).join(''));
  if(DS.has('sarampo')||DS.has('rubeola')) hd.push([[30,45],[36,38],[44,33],[56,33],[64,38],[70,45],[32,62],[68,62],[40,67],[60,67],[50,40],[45,58],[55,58]].map(([x,y])=>`<circle cx="${x}" cy="${y+dy}" r="2.1" fill="#E5534B" opacity=".5"/>`).join(''));
  if(DS.has('acne')) hd.push([[36,38],[61,40],[67,62],[33,64],[56,35],[44,64]].map(([x,y])=>`<circle cx="${x}" cy="${y+dy}" r="1.2" fill="#D9606A" opacity=".8"/>`).join(''));
  if(ge.vitiligo||DS.has('vitiligo')) hd.push(`<path d="M30,40 Q36,34 41,40 Q38,47 31,46Z M60,58 Q67,53 71,60 Q67,67 61,64Z M45,70 Q50,67 54,71 Q50,75 46,73Z" fill="#FBEFE6" opacity=".85"/>`);
  if(DS.has('psoriase')) hd.push(`<path d="M28,52 Q31,48 34,52 Q31,56 28,52Z M66,40 Q70,37 73,41 Q70,45 66,40Z" fill="#E7B0A4" stroke="#C98A7C" stroke-width=".6" opacity=".9"/>`);
  if(DS.has('verruga')) hd.push(`<circle cx="57" cy="${58+dy}" r="1.5" fill="${dark}" opacity=".7"/>`);
  if(ge.freckles&&!baby) hd.push([[33,59],[36,60.5],[31,61],[67,59],[64,60.5],[69,61]].map(([x,y])=>`<circle cx="${x}" cy="${y+dy}" r=".8" fill="${dark}" opacity=".65"/>`).join(''));
  if(teen&&uid%3===0) hd.push([[37,38],[61,40],[67,62],[33,64],[56,36]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".95" fill="#D9606A" opacity=".7"/>`).join(''));
  // envelhecimento gradual: linhas aparecem e ficam mais marcadas a cada década
  if(age>=28){ const w=Math.min(1,(age-26)/50), op=a=>(a*(.35+.65*w)).toFixed(2), ln=(d,a,sw=.85)=>`<path d="${d}" stroke="${dark}" stroke-width="${sw}" fill="none" opacity="${op(a)}" stroke-linecap="round"/>`;
    hd.push(ln('M42.8,61 Q40.6,65 42.6,69 M57.2,61 Q59.4,65 57.4,69',age>=40?.5:.28));                                   // linhas do sorriso
    if(age>=36) hd.push(ln('M31.2,51.5 l-2.6,-1.1 M31.2,53.6 l-2.8,.3 M68.8,51.5 l2.6,-1.1 M68.8,53.6 l2.8,.3',.55,.75));  // pés de galinha
    if(age>=40) hd.push(ln('M41,35.5 Q50,34 59,35.5',.5));                                                                  // testa
    if(age>=48) hd.push(ln('M43.5,32 Q50,31 56.5,32 M48,41 L48.6,44 M52,41 L51.4,44',.5,.75));                            // segunda linha da testa e entre as sobrancelhas
    if(age>=56) hd.push(ln('M33.5,69.5 Q36.5,74 41,75.5 M66.5,69.5 Q63.5,74 59,75.5',.55));                                // bochechas caindo
    if(age>=64) hd.push(ln('M42,38.5 Q50,37.2 58,38.5 M46,71.5 Q50,72.6 54,71.5',.45,.7)+[[31,40],[67,43],[36,66],[64,34]].slice(0,age>=72?4:2).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.1" fill="${dark}" opacity=".22"/>`).join('')); // manchas da idade
  }
  // olhos: amendoados e escuros nos adultos, grandes nos pequenos
  const es=kid?3:(ge.eyeShape||0);
  const ge2=kid?1:F?1.1:.92, ey=52+dy, rx=(baby||small?5.3:kid?4.9:teen?4.6:4.4)*(kid?1:F?1.05:1), ry=(baby||small?5:kid?4.3:es===3?3.9:es===1?2.6:teen?3.6:3.3)*ge2, ir=(baby||small?3.8:kid?3.3:es===1?2.3:teen?2.8:2.65)*(kid?1:F?1.05:1);
  const lidC='#2B1D18';
  for(const x of [ex,ex2]){
    const side=x<50?-1:1;
    if(dead){ hd.push(`<path d="M${x-3},${ey-3} l6,6 M${x+3},${ey-3} l-6,6" stroke="${lidC}" stroke-width="1.8" stroke-linecap="round"/>`); continue; }
    if(L.makeup==='completa') hd.push(`<path d="M${x-rx-.5},${ey-.5} Q${x},${ey-ry-4.2} ${x+rx+.5},${ey-.5}Z" fill="#B886D8" opacity=".5"/>`);
    hd.push(`<ellipse cx="${x}" cy="${ey}" rx="${rx}" ry="${ry}" fill="${DS.has('conjuntivite')?'#FFC9C9':'#FBFBFD'}"/>`);
    hd.push(`<g clip-path="url(#${id}e${side>0?'r':'l'})"><circle cx="${x+side*.2}" cy="${ey+.3}" r="${ir}" fill="${ec}"/><circle cx="${x+side*.2}" cy="${ey+.3}" r="${ir}" fill="none" stroke="${mixHex(ec,'#000000',.45)}" stroke-width=".7"/><circle cx="${x+side*.2}" cy="${ey+.3}" r="${ir*.5}" fill="#160E0B"/><circle cx="${x+ir*.38}" cy="${ey-ir*.35}" r="${ir*.3}" fill="#fff"/></g>`);
    if(DS.has('catarata')) hd.push(`<circle cx="${x+side*.2}" cy="${ey+.3}" r="${ir}" fill="#E8EEF2" opacity=".55"/>`);
    if(es===2&&!kid) hd.push(`<path d="M${x-rx-.4},${ey+.3} Q${x},${ey-ry-1.2} ${x+rx+.4},${ey+.3} L${x+rx+.4},${ey-ry-1} L${x-rx-.4},${ey-ry-1}Z" fill="${skin}"/><path d="M${x-rx-.3},${ey+.3} Q${x},${ey-1.8} ${x+rx+.3},${ey+.3}" stroke="${lidC}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
    else hd.push(`<path d="M${x-rx-.2},${ey+.2} Q${x},${ey-ry*1.45} ${x+rx+.2},${ey+.2}" stroke="${lidC}" stroke-width="${F&&!kid?1.9:1.5}" fill="none" stroke-linecap="round"/>`);
    hd.push(`<path d="M${x-rx*.7},${ey+ry*.85} Q${x},${ey+ry*1.2} ${x+rx*.7},${ey+ry*.85}" stroke="${dark}" stroke-width=".7" fill="none" opacity=".35"/>`);
    if(F&&kid&&!baby) hd.push(`<path d="M${x+side*(rx+.1)},${ey-.4} l${side*1.8},-1.4 M${x+side*rx*.7},${ey-ry*.98} l${side*1.2},-1.6" stroke="${lidC}" stroke-width="1.1" stroke-linecap="round"/>`);
    if(F&&!kid) hd.push(`<path d="M${x+side*(rx+.1)},${ey-.4} l${side*2.2},-1.7 M${x+side*rx*.78},${ey-ry*.95} l${side*1.6},-2 M${x+side*rx*.35},${ey-ry*1.2} l${side*.9},-2.1" stroke="${lidC}" stroke-width="1.2" stroke-linecap="round"/>`);
    if(age>=46) hd.push(`<path d="M${x-3.4},${ey+ry+1.3} Q${x},${ey+ry+3.4} ${x+3.4},${ey+ry+1.3}" stroke="${dark}" stroke-width=".8" fill="none" opacity="${age>=65?.5:age>=55?.38:.24}"/>`);
    if(L.makeup==='delineado'||L.makeup==='completa') hd.push(`<path d="M${x-side*rx*.1},${ey-ry*1.05} Q${x+side*rx*.7},${ey-ry*.8} ${x+side*(rx+.3)},${ey-.3} L${x+side*(rx+3.2)},${ey-2.6}" stroke="#141414" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  // sobrancelhas grossas e expressivas
  if(!baby){ const bw=({fina:1.8,grossa:3.3,arqueada:2.5}[L.brow]||2.5)*(kid?(F?.72:.95):F?.72:1.25)*(chemo?.45:1); const ang=mood<30?2.4:0; const bc=age>=68?mixHex(hc,'#7A7A7A',.3):mixHex(hc,'#000000',.38); const by=ey-7.6-(kid?.6:F?.9:-.5);
    hd.push(L.brow==='arqueada'||(F&&!kid)?`<path d="M${ex-5.6},${by+1.6+ang} Q${ex-.5},${by-3.6} ${ex+5.4},${by+.2} M${ex2-5.4},${by+.2} Q${ex2+.5},${by-3.6} ${ex2+5.6},${by+1.6+ang}" stroke="${bc}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`
      :`<path d="M${ex-5.6},${by+1+ang} Q${ex},${by-2.2} ${ex+5.4},${by-ang/2} M${ex2-5.4},${by-ang/2} Q${ex2},${by-2.2} ${ex2+5.6},${by+1+ang}" stroke="${bc}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`); }
  // nariz com sombra
  if(baby||small) hd.push(`<path d="M48.4,${60+dy} Q50,${61.4+dy} 51.6,${60+dy}" stroke="${dark}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".7"/>`);
  else { const nl=kid?.75:F?.82:1.12; hd.push(`<path d="M48.7,${50+dy} Q47.3,${55.5+dy} 47.2,${59+dy}" stroke="${dark}" stroke-width="1.1" fill="none" opacity=".3" stroke-linecap="round"/><path d="M${50-3.3*nl},${59.4+dy} Q${50-1.8*nl},${61.8+dy} 50,${61.3+dy} Q${50+1.8*nl},${61.8+dy} ${50+3.3*nl},${59.4+dy}" stroke="${dark}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".62"/><ellipse cx="50.8" cy="${57.6+dy}" rx="1.4" ry="1.1" fill="#fff" opacity=".22"/>`); }
  if(L.pierce==='nariz'&&adult) hd.push(`<circle cx="53.3" cy="${61}" r="1.4" fill="none" stroke="#B9BFCB" stroke-width="1"/>`);
  if(age>=17&&!F&&!chemo){ EDGE=hairEdge; hd.push((BEARDS.find(b=>b.id===L.beard)||BEARDS[0]).d(age>=52?hc:mixHex(hc,'#000000',.08))); EDGE=skinEdge; }
  // boca: sorriso largo com dentes quando feliz
  const my=66.5+dy, lipN=mixHex(skin,'#A8423F',.5), lipD=mixHex(lipN,'#000000',.35);
  const lipC=L.makeup==='batom'||L.makeup==='completa'?'#C8283F':L.makeup==='rosa'?'#E26A98':null;
  if(fAd&&!lipC&&!dead&&mood<75) hd.push(`<path d="M44.4,${my} Q47.2,${my-2} 50,${my-.8} Q52.8,${my-2} 55.6,${my} Q50,${my+4.4} 44.4,${my}Z" fill="${mixHex(skin,'#C9506A',.42)}" opacity=".8"/>`);
  if(lipC&&adult&&!dead) hd.push(`<path d="M43.6,${my} Q47,${my-2.3} 50,${my-.9} Q53,${my-2.3} 56.4,${my} Q50,${my+5.4} 43.6,${my}Z" fill="${lipC}"/>`);
  if(dead) hd.push(`<path d="M44.5,${my+1} L55.5,${my+1}" stroke="${lipD}" stroke-width="1.6" stroke-linecap="round"/>`);
  else if(baby&&uid%3===0) hd.push(`<ellipse cx="50" cy="${my+1.4}" rx="6.4" ry="4.2" fill="#7FC8F8" ${ol(.9,'#3C86B8')}/><circle cx="50" cy="${my+1.4}" r="2.4" fill="#fff" ${ol(.8,'#3C86B8')}/>`);
  else if(mood>=75&&(baby||small)) hd.push(`<path d="M44.5,${my-.5} Q50,${my+6.5} 55.5,${my-.5} Q50,${my+1} 44.5,${my-.5}Z" fill="#7A2430"/><path d="M47,${my+3.6} Q50,${my+2.4} 53,${my+3.6} Q50,${my+5.2} 47,${my+3.6}Z" fill="#E8707E"/>`);
  else if(mood>=75){ hd.push(`<path d="M41.6,${my-1.2} Q50,${my+9.4} 58.4,${my-1.2} Q50,${my+.4} 41.6,${my-1.2}Z" fill="#5E1A22"/><path d="M43.2,${my-.6} Q50,${my+1.4} 56.8,${my-.6} L56.1,${my+1.7} Q50,${my+3.4} 43.9,${my+1.7}Z" fill="#FFFFFF"/><path d="M46.4,${my+5.6} Q50,${my+4.4} 53.6,${my+5.6} Q50,${my+7.2} 46.4,${my+5.6}Z" fill="#D8606E" opacity=".8"/><path d="M45,${my+7.6} Q50,${my+9.6} 55,${my+7.6}" stroke="${lipN}" stroke-width="1.2" fill="none" opacity=".55" stroke-linecap="round"/>`);
    if(teen&&uid%4===1) hd.push(`<path d="M44,${my+.6} Q50,${my+2.6} 56,${my+.6}" stroke="#9AA4B2" stroke-width=".9" fill="none"/>${[46,48.6,51.4,54].map(x=>`<rect x="${x-.5}" y="${my+.7}" width="1" height="1" fill="#C5CCD6"/>`).join('')}`); }
  else if(mood>=50) hd.push(`<path d="M43.6,${my} Q50,${my+5.4} 56.4,${my}" stroke="${lipD}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M46.6,${my+3.6} Q50,${my+5} 53.4,${my+3.6}" stroke="${lipN}" stroke-width="1.3" fill="none" opacity=".6" stroke-linecap="round"/>`);
  else if(mood>=28) hd.push(`<path d="M44.6,${my+1.2} Q50,${my+2.2} 55.4,${my+1.2}" stroke="${lipD}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M46.6,${my+3.6} Q50,${my+4.6} 53.4,${my+3.6}" stroke="${lipN}" stroke-width="1.2" fill="none" opacity=".5" stroke-linecap="round"/>`);
  else hd.push(`<path d="M44,${my+3.6} Q50,${my-1.2} 56,${my+3.6}" stroke="${lipD}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
  if(L.pierce==='labio'&&adult) hd.push(`<circle cx="54" cy="${my+3.6}" r="1.4" fill="none" stroke="#B9BFCB" stroke-width="1"/>`);
  // acessórios do rosto ficam por baixo do cabelo da frente (as hastes somem atrás do cabelo)
  if(!baby) hd.push((GLASSES.find(x=>x.id===L.glasses)||GLASSES[0]).d());
  // cabelo da frente
  EDGE=hairEdge;
  if(baby) hd.push(`<path d="M47,${27} C45,19 54,17 56,22 C53,21.5 50.5,23.5 50.5,27.5Z" fill="${HG}" ${ol(1)}/>`);
  else if(H.id==='careca'&&age>=45) hd.push(`<path d="M24.6,51 C23,43 25,37.5 30.5,34.5 C29,39 29.5,44 31.5,47.5 C28.5,47.5 26,49 24.6,51Z M75.4,51 C77,43 75,37.5 69.5,34.5 C71,39 70.5,44 68.5,47.5 C71.5,47.5 74,49 75.4,51Z" fill="${HG}" ${ol(1)}/>`);
  else if(H.id==='careca') hd.push(`<path d="M30,30 Q40,23 50,22.5" stroke="#fff" stroke-width="3" opacity=".22" fill="none" stroke-linecap="round"/>`);
  else hd.push(`<g${hairClip}>${H.front(HG,hs)}</g>`);
  if(gray>0&&gray<.7&&!baby&&!['careca','raspado','cacheado','black','cacheadoF','moicano','dreads'].includes(H.id)&&!hat.cut) hd.push(`<path d="M25.6,40 Q25,45 25.8,50 M74.4,40 Q75,45 74.2,50" stroke="#E4E4E4" stroke-width="2.6" stroke-linecap="round" opacity="${gray>.3?.75:.5}"/>`);
  EDGE=skinEdge;
  if(L.pierce==='sobrancelha'&&adult) hd.push(`<circle cx="64.5" cy="41.5" r="1.1" fill="#C9CDD6" ${ol(.6,'#6B7280')}/><circle cx="65.5" cy="45.6" r="1.1" fill="#C9CDD6" ${ol(.6,'#6B7280')}/>`);
  // brincos pendurados no lóbulo
  if(!baby){ const e=L.ear, ly=58+dy;
    for(const x of [22.8,77.2]){
      if(e==='ponto') hd.push(`<circle cx="${x}" cy="${ly}" r="1.6" fill="#EAF2FF" ${ol(.8,'#7A8494')}/>`);
      if(e==='argola') hd.push(`<circle cx="${x}" cy="${ly+3.6}" r="3.6" fill="none" stroke="#9A7420" stroke-width="2.4"/><circle cx="${x}" cy="${ly+3.6}" r="3.6" fill="none" stroke="#F0C04A" stroke-width="1.3"/>`);
      if(e==='perola') hd.push(`<circle cx="${x}" cy="${ly}" r="1" fill="#E8C35A"/><path d="M${x},${ly+.8} L${x},${ly+2.4}" stroke="#E8C35A" stroke-width=".9"/><circle cx="${x}" cy="${ly+4.4}" r="2.4" fill="#FBF6EC" ${ol(.8,'#B8AE98')}/><circle cx="${x-.7}" cy="${ly+3.7}" r=".7" fill="#fff"/>`);
    } }
  hd.push(hat.d(L.hatColor||'#E8604F'));
  EDGE='#4A3428';
  const lens=side=>{ const x=side>0?ex2:ex; return `<clipPath id="${id}e${side>0?'r':'l'}"><ellipse cx="${x}" cy="${ey}" rx="${rx}" ry="${ry}"/></clipPath>`; };
  const defs=`<clipPath id="${id}"><circle cx="50" cy="50" r="50"/></clipPath><clipPath id="${id}h"><path d="${head}"/></clipPath>${lens(-1)}${lens(1)}${hat.cut?`<clipPath id="${id}c"><rect x="0" y="${hat.cut}" width="100" height="100"/></clipPath>`:''}`
    +`<radialGradient id="${id}sk" cx="46%" cy="40%" r="66%"><stop offset="0" stop-color="${mixHex(skin,'#ffffff',.14)}"/><stop offset=".65" stop-color="${skin}"/><stop offset="1" stop-color="${mixHex(skin,'#5A2A18',.2)}"/></radialGradient>`
    +`<linearGradient id="${id}hg" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${mixHex(hc,'#ffffff',.2)}"/><stop offset=".45" stop-color="${hc}"/><stop offset="1" stop-color="${mixHex(hc,'#000000',.25)}"/></linearGradient>`
    +`<linearGradient id="${id}cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>`;
  const bg=BGS[uid%BGS.length];
  return `<svg class="face" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><defs>${defs}</defs><g clip-path="url(#${id})"><rect width="100" height="100" fill="${bg}"/><circle cx="50" cy="44" r="40" fill="#fff" opacity=".22"/>`
    +`<g transform="translate(50 100) scale(${bs*sx} ${bs}) translate(-50 -100)">${body.join('')}</g>`
    +`<g transform="translate(50 ${hcy}) scale(${hsc}) translate(-50 -50)">${hd.join('')}</g>`
    +`${dead?'<rect width="100" height="100" fill="#000" opacity=".14"/>':''}</g></svg>`;
}
// Galeria para conferir o desenho (#demo-rostos)
function faceAges(){
  const ages=[0,3,7,11,15,20,28,38,48,58,68,80];
  return '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px;background:#fff">'+[['M',3],['F',4],['M',8]].flatMap(([gd,uid])=>{ const base=mkPerson({rel:'tmp',gender:gd,age:30}); base.id=uid; ensureLook(base); if(gd==='M') base.look.beard='rala';
    return ages.map(a=>{ const p=Object.assign({},base,{age:a,bond:80}); return `<div style="text-align:center;font:10px sans-serif">${faceSVG(p,110)}<br>${a} anos</div>`; }); }).join('')+'</div>';
}
function faceGallery(big,from=0){ const sz=big?230:110, cols=big?2:4;
  const combos=[
    ['F',0,{}],['M',1,{}],['F',4,{hair:'chiquinha'}],['M',6,{hair:'curto'}],['F',10,{hair:'rabo'}],['M',11,{hair:'cacheado'}],['F',15,{hair:'longo'}],['M',16,{hair:'topete'}],
    ['F',30,{hair:'ondulado',makeup:'batom',ear:'argola'}],['M',35,{hair:'lateral',beard:'rala'}],['F',70,{hair:'coque',glasses:'redondo'}],['M',75,{hair:'careca',beard:'bigode'}],
    ['M',30,{hair:'curto'}],['F',28,{hair:'longo',ear:'argola',makeup:'batom'}],['M',8,{hair:'cacheado'}],['F',9,{hair:'chiquinha'}],
    ['M',40,{hair:'topete',beard:'cheia',glasses:'quadrado'}],['F',35,{hair:'coque',glasses:'gatinho',ear:'perola'}],['M',24,{hair:'lateral',hat:'bone'}],['F',22,{hair:'franja',hat:'gorro'}],
    ['M',70,{hair:'careca',beard:'bigodao',glasses:'redondo'}],['F',72,{hair:'chanel',ear:'perola'}],['M',27,{hair:'dreads',beard:'cavanhaque'}],['F',26,{hair:'cacheadoF',makeup:'completa',pierce:'nariz'}],
    ['M',33,{hair:'black',glasses:'aviador'}],['F',31,{hair:'rabo',makeup:'rosa',ear:'ponto',glasses:'gatinhoSol'}],['M',45,{hair:'samurai',beard:'bigode',hat:'cartola'}],['F',40,{hair:'ondulado',hat:'coroa'}],
    ['M',19,{hair:'moicano',pierce:'sobrancelha',glasses:'esportivo'}],['F',18,{hair:'pixie',pierce:'labio',makeup:'delineado',glasses:'lennon'}],['M',55,{hair:'longoM',hat:'panama',beard:'rala'}],['F',50,{hair:'tranca',hat:'tiara'}],
    ['M',1,{}],['F',1,{}],['M',38,{hair:'raspado',hat:'capacete',beard:'rala'}],['F',30,{hair:'longo',hat:'laco',glasses:'coracao'}],['M',29,{hair:'curto',hat:'bandana',glasses:'espelhado'}],['F',85,{hair:'coque',glasses:'redondo'}],
  ];
  return `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;padding:10px;background:#fff">`+combos.slice(from,from+(big?10:99)).map(([gd,age,lk],i)=>{
    const p=mkPerson({rel:'tmp',gender:gd,age,bond:[90,60,40,20][i%4]}); i+=from; p.id=i+1; p.genes.skin=i%SKINS.length; p.genes.eyeShape=i%4; ensureLook(p); Object.assign(p.look,{hat:'none',glasses:'none',ear:'none',pierce:'none',makeup:'none',beard:'none'},lk);
    return `<div style="text-align:center;font:10px sans-serif">${faceSVG(p,sz)}<br>${age}a ${Object.values(lk).join(' ')}</div>`; }).join('')+'</div>';
}

// ---------- mudar o visual no meio do jogo ----------
function restyle(k,val,cost,label){
  const m=S.me,L=ensureLook(m);
  if(cost&&!canPay(cost)) return `Não tenho ${fmt(cost)} para isso.`;
  if(L[k]===val) return 'Já estou assim.';
  m.money-=cost||0; L[k]=val; cnt('restyle');
  st('happy',R.int(1,4));
  if(k==='hair'||k==='dye'||k==='makeup') st('looks',R.int(-2,4));
  if(k==='hat'&&val==='coroa'&&!m.royal) m.fame=clamp(m.fame+1);
  return label;
}
