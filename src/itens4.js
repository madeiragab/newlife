// ===== 3.5: catálogo de itens desenhados (primeiros 40) =====
// IDs permanentes (não mudar): o save guarda o id e o desenho sai daqui.
const I4L='#2A2238';
const i4=(b,s='')=>`<svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true" class="item4"><ellipse cx="32" cy="58" rx="22" ry="3" fill="#000" opacity=".12"/><g stroke="${I4L}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${b}</g>${s}</svg>`;
const I4R=(x,y,w,h,c,r=3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
const I4C=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const I4P=(d,c='none')=>`<path d="${d}" fill="${c}"/>`;
const I4E=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
const I4B='<path d="M14 14h10" stroke="#fff" stroke-width="2" opacity=".5" fill="none"/>';
const ITENS4=[
 // eletrônicos e tecnologia
 {id:'el_celular',t:'Celular',cat:'Eletrônicos',v:2500,h:2,dur:4,d:()=>i4(I4R(20,6,24,48,'#3B3550',6)+I4R(23,11,18,36,'#6EC6FF',2)+I4C(32,50,1.6,'#888'),'<path d="M25 14l6 0" stroke="#fff" stroke-width="2" opacity=".6"/>')},
 {id:'el_notebook',t:'Notebook',cat:'Eletrônicos',v:5000,h:2,dur:5,d:()=>i4(I4R(14,12,36,26,'#4A4560',3)+I4R(17,15,30,20,'#7FD3FF',1)+I4P('M8 40h48l-4 8H12Z','#9A96AE'))},
 {id:'el_tv',t:'Smart TV 55"',cat:'Eletrônicos',v:3800,h:2,dur:6,d:()=>i4(I4R(6,10,52,32,'#2E2A3E',3)+I4R(9,13,46,26,'#5B8CFF',1)+I4P('M28 42v8M36 42v8M22 52h20'),I4P('M12 16l10 0','#fff'))},
 {id:'el_console',t:'Videogame',cat:'Eletrônicos',v:3000,h:3,dur:5,d:()=>i4(I4P('M12 26q6-6 20-6t20 6l4 16q2 8-6 8-4 0-8-6H22q-4 6-8 6-8 0-6-8Z','#3B3550')+I4C(42,32,2.4,'#FF5C7A')+I4C(47,28,2.4,'#5BD18B')+I4P('M18 32h8M22 28v8','none'))},
 {id:'el_fone',t:'Fone sem fio',cat:'Eletrônicos',v:900,h:1,dur:3,d:()=>i4(I4P('M14 36q0-24 18-24t18 24','none')+I4R(9,32,10,16,'#FF7AA2',4)+I4R(45,32,10,16,'#FF7AA2',4))},
 // móveis e eletrodomésticos
 {id:'mv_sofa',t:'Sofá retrátil',cat:'Casa',v:4200,h:2,dur:8,d:()=>i4(I4R(8,22,48,20,'#7B6CF6',6)+I4R(4,28,10,20,'#6A5BE0',4)+I4R(50,28,10,20,'#6A5BE0',4)+I4R(12,36,40,12,'#8F82FF',3)+I4P('M14 50v4M50 50v4'))},
 {id:'mv_geladeira',t:'Geladeira duplex',cat:'Casa',v:4500,h:1,dur:10,d:()=>i4(I4R(18,4,28,52,'#E8EEF4',4)+I4P('M18 22h28')+I4P('M40 10v8M40 28v14'))},
 {id:'mv_cama',t:'Cama king',cat:'Casa',v:3500,h:2,dur:10,d:()=>i4(I4R(6,18,52,10,'#A0724E',3)+I4R(8,28,48,16,'#F4F0FF',4)+I4R(12,24,14,8,'#FFFFFF',4)+I4R(38,24,14,8,'#FFFFFF',4)+I4R(8,36,48,8,'#7FB8FF',3)+I4P('M8 44v8M56 44v8'))},
 {id:'mv_cafeteira',t:'Cafeteira expresso',cat:'Casa',v:1800,h:1,dur:6,d:()=>i4(I4R(14,8,30,44,'#C0392B',5)+I4R(18,14,22,8,'#2E2A3E',2)+I4R(24,34,12,12,'#FFFFFF',2)+I4P('M28 26v6'),I4P('M27 30q2-4 0-6','none'))},
 {id:'mv_robo',t:'Aspirador robô',cat:'Casa',v:2200,h:1,dur:5,d:()=>i4(I4E(32,40,24,12,'#4A4560')+I4E(32,36,24,12,'#6B6782')+I4C(32,33,4,'#5BD18B'))},
 // esportes e hobbies
 {id:'es_bike',t:'Bicicleta',cat:'Esportes',v:2500,h:2,dur:6,d:()=>i4(I4C(16,42,10,'none')+I4C(48,42,10,'none')+I4P('M16 42l10-16h14l8 16M26 26l8 16h-18M38 20h6M24 22h6'))},
 {id:'es_prancha',t:'Prancha de surfe',cat:'Esportes',v:1800,h:2,dur:6,d:()=>i4(I4P('M32 4q14 24 0 52q-14-28 0-52Z','#3EC6E0')+I4P('M32 8v44','none'))},
 {id:'es_bola',t:'Bola de futebol',cat:'Esportes',v:200,h:1,dur:2,d:()=>i4(I4C(32,32,20,'#FFFFFF')+I4P('M32 24l7 5-3 8h-8l-3-8Z','#2A2238')+I4P('M32 24v-12M39 29l11-3M36 37l6 9M28 37l-6 9M25 29l-11-3'))},
 {id:'es_esteira',t:'Esteira elétrica',cat:'Esportes',v:4500,h:2,dur:7,d:()=>i4(I4P('M8 48h44l4-6H12Z','#4A4560')+I4P('M48 42l-6-28h8','none')+I4R(40,10,14,6,'#5B8CFF',2))},
 {id:'es_vara',t:'Kit de pesca',cat:'Esportes',v:700,h:1,dur:5,d:()=>i4(I4P('M10 54L50 8','none')+I4P('M50 8q4 20 0 30','none')+I4C(16,46,4,'#FFB020')+I4P('M48 40q2 4 0 6','none'))},
 // instrumentos musicais
 {id:'mu_violao',t:'Violão',cat:'Música',v:1200,h:2,dur:8,tal:'musical',d:()=>i4(I4P('M22 34q-10 4-8 14t14 8q8-2 8-10 6-2 6-8t-8-8q-8-2-12 4Z','#D9944A')+I4C(28,44,4,'#5A3A22')+I4R(34,6,6,28,'#7A5232',2)+I4R(33,2,8,6,'#4A3020',2))},
 {id:'mu_guitarra',t:'Guitarra elétrica',cat:'Música',v:3500,h:2,dur:8,tal:'musical',d:()=>i4(I4P('M16 36q-6 10 2 16t16 0l4-8q6-4 2-10l-10-2q-8-2-14 4Z','#E5484D')+I4R(34,4,5,32,'#2E2A3E',2)+I4R(22,42,10,3,'#FFFFFF',1))},
 {id:'mu_teclado',t:'Teclado musical',cat:'Música',v:2800,h:2,dur:8,tal:'musical',d:()=>i4(I4R(4,22,56,22,'#3B3550',3)+I4R(7,30,50,12,'#FFFFFF',1)+[12,18,24,30,36,42,48].map(x=>I4R(x,30,3,7,'#2A2238',0)).join(''))},
 {id:'mu_bateria',t:'Bateria',cat:'Música',v:6000,h:3,dur:8,tal:'musical',d:()=>i4(I4E(32,44,14,8,'#E5484D')+I4R(18,34,28,10,'#E5484D',2)+I4E(32,34,14,4,'#F4F0FF')+I4E(12,26,8,3,'#FFC93C')+I4E(52,26,8,3,'#FFC93C')+I4P('M12 28v24M52 28v24'))},
 {id:'mu_violino',t:'Violino',cat:'Música',v:4000,h:2,dur:8,tal:'musical',d:()=>i4(I4P('M26 22q-8 4-4 12-4 10 6 16 4 2 8 0 10-6 6-16 4-8-4-12-6-2-12 0Z','#B5652A')+I4R(30,4,4,20,'#2E2A3E',2)+I4P('M14 54L52 12','none'))},
 // luxo, relógios e joias
 {id:'lx_relogio',t:'Relógio de luxo',cat:'Luxo',v:25000,h:4,dur:20,d:()=>i4(I4R(26,4,12,56,'#3B3550',3)+I4C(32,32,13,'#F2C14E')+I4C(32,32,10,'#FFFFFF')+I4P('M32 32v-7M32 32l5 3'))},
 {id:'lx_anel',t:'Anel de diamante',cat:'Luxo',v:15000,h:4,dur:30,d:()=>i4(I4C(32,40,14,'none')+I4P('M24 18l8-10 8 10-8 8Z','#BDEBFF'),'<circle cx="32" cy="40" r="14" fill="none" stroke="#F2C14E" stroke-width="4"/>')},
 {id:'lx_colar',t:'Colar de ouro',cat:'Luxo',v:12000,h:3,dur:30,d:()=>i4(I4P('M12 10q20 44 40 0','none')+I4P('M32 40l6 8-6 8-6-8Z','#E5484D'),'<path d="M12 10q20 44 40 0" fill="none" stroke="#F2C14E" stroke-width="3"/>')},
 {id:'lx_bolsa',t:'Bolsa de grife',cat:'Luxo',v:18000,h:4,dur:12,d:()=>i4(I4P('M22 22q0-14 10-14t10 14','none')+I4P('M10 22h44l-4 32H14Z','#8E3B6E')+I4R(28,30,8,6,'#F2C14E',1))},
 {id:'lx_oculos',t:'Óculos de grife',cat:'Luxo',v:3500,h:2,dur:6,d:()=>i4(I4R(6,24,22,16,'#2E2A3E',8)+I4R(36,24,22,16,'#2E2A3E',8)+I4P('M28 30q4-4 8 0M6 28l-4-4M58 28l4-4'))},
 // arte e colecionáveis
 {id:'ar_quadro',t:'Quadro pintado',cat:'Arte',v:8000,h:3,dur:40,d:()=>i4(I4R(6,10,52,40,'#C8913A',2)+I4R(11,15,42,30,'#9AD4F5',0)+I4P('M11 45l12-14 8 8 8-10 14 16Z','#5BAA62')+I4C(44,22,4,'#FFD23F'))},
 {id:'ar_escultura',t:'Escultura de bronze',cat:'Arte',v:20000,h:3,dur:60,d:()=>i4(I4R(18,46,28,8,'#6B6782',2)+I4P('M26 46q-4-14 2-20-4-8 4-14t8 4q8 4 2 12 6 6 2 18Z','#B07A3C'))},
 {id:'ar_vinil',t:'Coleção de vinis',cat:'Arte',v:2500,h:2,dur:20,d:()=>i4(I4R(6,8,34,34,'#FF8C42',2)+I4C(40,36,18,'#1E1A2A')+I4C(40,36,6,'#E5484D')+I4C(40,36,1,'#fff'))},
 {id:'ar_cartas',t:'Cartas colecionáveis',cat:'Arte',v:1500,h:2,dur:15,d:()=>i4(I4R(10,14,24,34,'#5B8CFF',3)+I4R(22,10,24,34,'#FFD23F',3)+I4R(32,16,24,34,'#E5484D',3)+I4P('M44 26l-4 8h6l-4 8','none'))},
 {id:'ar_miniatura',t:'Miniatura de carro',cat:'Arte',v:900,h:1,dur:15,d:()=>i4(I4P('M8 40l4-10q2-4 8-4h20q6 0 10 6l6 8v6H8Z','#E5484D')+I4C(18,46,5,'#2A2238')+I4C(46,46,5,'#2A2238')+I4R(22,30,16,6,'#9AD4F5',1))},
 // infantil e educação
 {id:'in_ursinho',t:'Ursinho de pelúcia',cat:'Infantil',v:150,h:2,dur:5,d:()=>i4(I4C(20,14,6,'#C68B59')+I4C(44,14,6,'#C68B59')+I4C(32,24,13,'#D9A06E')+I4E(32,46,14,12,'#D9A06E')+I4C(27,22,1.6,'#2A2238')+I4C(37,22,1.6,'#2A2238')+I4E(32,28,4,3,'#F4E1C8'))},
 {id:'in_lego',t:'Blocos de montar',cat:'Infantil',v:400,h:2,dur:10,d:()=>i4(I4R(8,34,24,16,'#E5484D',2)+I4R(32,34,24,16,'#5B8CFF',2)+I4R(20,18,24,16,'#FFD23F',2)+I4R(12,30,6,4,'#E5484D',1)+I4R(24,14,6,4,'#FFD23F',1)+I4R(34,14,6,4,'#FFD23F',1))},
 {id:'in_livros',t:'Coleção de livros',cat:'Infantil',v:350,h:1,dur:20,sm:2,d:()=>i4(I4R(8,14,10,40,'#5B8CFF',1)+I4R(18,10,10,44,'#E5484D',1)+I4R(28,16,10,38,'#5BAA62',1)+I4P('M40 20l8-4 10 36-8 3Z','#FFD23F'))},
 {id:'in_tablet',t:'Tablet infantil',cat:'Infantil',v:900,h:2,dur:4,d:()=>i4(I4R(6,12,52,38,'#FF8C42',8)+I4R(12,17,40,28,'#9AD4F5',2)+I4C(26,30,4,'#FFD23F')+I4P('M36 36l6-8 6 8Z','#5BAA62'))},
 {id:'in_patinete',t:'Patinete',cat:'Infantil',v:450,h:2,dur:5,d:()=>i4(I4P('M14 48h30L42 10','none')+I4P('M36 10h12')+I4C(14,50,5,'#5B8CFF')+I4C(46,50,5,'#5B8CFF'))},
 // ferramentas
 {id:'fe_furadeira',t:'Furadeira',cat:'Ferramentas',v:450,h:1,dur:8,d:()=>i4(I4R(10,16,32,14,'#FFB020',4)+I4P('M42 21h14','none')+I4P('M20 30l-4 20h14l2-20Z','#2E2A3E'))},
 {id:'fe_caixa',t:'Caixa de ferramentas',cat:'Ferramentas',v:600,h:1,dur:15,d:()=>i4(I4P('M24 22v-8h16v8','none')+I4R(6,22,52,30,'#E5484D',3)+I4P('M6 34h52')+I4R(28,30,8,8,'#B0B0C0',1))},
 {id:'fe_serra',t:'Serra circular',cat:'Ferramentas',v:900,h:1,dur:8,d:()=>i4(I4C(26,36,16,'#D7DCE4')+I4C(26,36,4,'#6B6782')+I4R(26,14,30,14,'#1E9E6A',4))},
 {id:'fe_escada',t:'Escada de alumínio',cat:'Ferramentas',v:500,h:1,dur:15,d:()=>i4(I4P('M18 56L26 4M46 56L38 4M22 44h20M24 32h16M25 20h14','none'),'<path d="M18 56L26 4M46 56L38 4" stroke="#B0B6C6" stroke-width="4" fill="none" opacity=".5"/>')},
 {id:'fe_gerador',t:'Gerador',cat:'Ferramentas',v:3500,h:1,dur:12,d:()=>i4(I4R(6,18,52,30,'#FFB020',4)+I4R(12,24,22,18,'#3B3550',2)+I4C(46,33,6,'#E8EEF4')+I4P('M8 48v6M56 48v6')+I4P('M18 28l4 6h-4l4 6','none'))},
];
const ITENS4_CAT={Eletrônicos:'Eletrônicos e tecnologia',Casa:'Móveis e eletrodomésticos',Esportes:'Esportes e hobbies',Música:'Instrumentos musicais',Luxo:'Luxo, relógios e joias',Arte:'Arte e colecionáveis',Infantil:'Infantil e educação',Ferramentas:'Ferramentas e equipamentos'};
const item4=id=>ITENS4.find(x=>x.id===id);
// preço no país onde moro: eletrônicos, luxo e instrumentos seguem o custo de importados; o resto segue o custo de vida local
function i4Preco(x){ let k=1; try{ const pais=S.me.country, imp=['Eletrônicos','Luxo','Música'].includes(x.cat); k=imp?.5+.5*mercadoIndice(pais,'veiculos'):mercadoCusto(); }catch(e){} return Math.max(10,Math.round(x.v*Math.max(.4,Math.min(2.5,k||1))/10)*10); }
// loja: os itens desenhados entram por categoria, antes do catálogo antigo
V.shop=(o=>function(){ const r=o.apply(this,arguments); try{ const it=[];
  for(const [c,n] of Object.entries(ITENS4_CAT)){ it.push({sec:n}); ITENS4.filter(x=>x.cat===c).forEach(x=>{ const pv=i4Preco(x); it.push({ic:x.d(),l:x.t,s:`dura uns ${x.dur} anos`,r:fmt(pv),on:()=>minorPay(pv,()=>{ const s=buy('item',{n:x.t,v:pv,h:x.h,tal:x.tal,ic:x.d()},false); const a=S.me.assets.at(-1); if(a&&a.n===x.t) a.i4=x.id; if(x.sm) st('smarts',x.sm); return s; },'Compra')}); }); }
  r.items=it.concat(r.items); }catch(e){} return r; })(V.shop);
function itens4SelfTest(){ const f=[], ids=new Set();
  ITENS4.forEach(x=>{ if(ids.has(x.id)) f.push('id repetido '+x.id); ids.add(x.id); const s=x.d(); if(!/^<svg/.test(s)||s.length<150) f.push('desenho '+x.id); if(!ITENS4_CAT[x.cat]) f.push('categoria '+x.id); });
  if(ITENS4.length<400) f.push('poucos itens '+ITENS4.length); if(f.length) throw Error('Itens 3.5 · '+f.slice(0,5).join(' | ')); return {ok:true}; }
