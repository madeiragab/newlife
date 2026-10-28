// ===== Visual 3.0: liga as pessoas do jogo ao desenho de corpo inteiro (corpo3.js + catalogo3.js) =====
// Cada pessoa vira uma ficha de desenho: genética (pele, cabelo, olhos, sardas), idade, sexo, tipo físico,
// corte, roupa, acessórios, emprego (uniforme), prisão, realeza e criatura. Os desenhos ficam em cache como
// imagens, então listas grandes de rostos continuam leves.
const faceSVG0=faceSVG;
const V3_CAB={curto:['curto','social','curto'],topete:['topete','pompadour'],lateral:['social','penteadoTras'],moicano:['moicano','undercut'],samurai:['coqueSamurai','undercutCoque'],careca:['careca'],longoM:['surfista','roqueiro'],raspado:['raspado','militar'],cacheado:['cacheadoCurto','afroCurto'],black:['blackPower','afroCurto'],dreads:['dreadsCurtos','dreadsLongos'],
 longo:['longo','longoMeio','muitoLongo','medio'],rabo:['raboAlto','raboLado','raboFranja'],coque:['coque','coqueBaixo','meioPreso'],tranca:['trancaLado','trancas','boxBraids'],chanel:['chanel','chanelFranja','cacheadoChanel'],ondulado:['ondulado','onduladoMedio'],chiquinha:['chiquinhas','coquesDuplos'],pixie:['joaozinho','emo'],cacheadoF:['cacheadoLongo','cacheadoMedio','afroPuff'],franja:['franjaLonga','cortina']};
const V3_BARBA={rala:'por fazer',cheia:'cheia',cavanhaque:'cavanhaque',bigode:'bigode',bigodao:'lenhador'};
const V3_OCULOS={redondo:{k:'oculosRedondo'},quadrado:{k:'oculos'},gatinho:{k:'oculosGatinho'},escuro:{k:'oculosSol'},aviador:{k:'oculosAviador'},espelhado:{k:'oculosSol',cor:'#7FA7C9'},lennon:{k:'oculosRedondo',cor:'#C9A227'},esportivo:{k:'oculosSol',cor:'#E63946'},gatinhoSol:{k:'oculosGatinho',cor:'#1B1B1F'},coracao:{k:'oculosSol',cor:'#E5383B'},monoculo:{k:'oculosRedondo',cor:'#C9A227'}};
const V3_CHAPEU={bone:'bone',gorro:'gorro',panama:'chapeuPalha',cartola:'cartola',coroa:'coroa',tiara:'tiaraJoia',laco:'laco',bandana:'bandana',capacete:'capaceteObra'};
const V3_BRINCO={ponto:{k:'brinco',cor:'#E9C46A'},argola:{k:'argola',cor:'#E9C46A'},perola:{k:'brincoPerola'}};
const V3_PIER={nariz:'piercingNariz',sobrancelha:'piercingSobrancelha',labio:'piercingLabio'};
const V3_BATOM={batom:'#B5172E',rosa:'#E26D8F',completa:'#A4133C'};
// profissões especiais e cargos que não têm uniforme próprio usam um estilo do catálogo
const V3_ESPECIAL={ator:'Executivo',musico:'Rock',atleta:'futebol',modelo:'Festa',militar:'soldado',crime:'Street',comedia:'Casual',escritor:'Vintage',artista:'Boho',streamer:'Street',dj:'Festa',camelo:'Verão'};
// títulos de emprego das outras pessoas (texto) para o id do uniforme
const V3_TITULO={}; for(const j of JOBS) for(const t of j.l) for(const x of t.split('|')) V3_TITULO[x]=j.id;
// sorteios estáveis por pessoa: usam uma semente aleatória guardada no visual (o id se repete entre vidas, então
// a mãe de toda vida nova saía com a mesma roupa, corte e corpo); a mistura final espalha bem os bits
function v3Semente(p){ const L=ensureLook(p); if(L.sd==null) L.sd=Math.floor(Math.random()*2147483647); return L.sd; }
const v3h=(id,s)=>{ let h=hashS(String(id)+':'+s)^0x9E3779B9; h=Math.imul(h^(h>>>16),0x85EBCA6B); h=Math.imul(h^(h>>>13),0xC2B2AE35); return (h^(h>>>16))>>>0; };
const v3pick=(a,id,s)=>a[v3h(id,s)%a.length];
function v3Tipo(p){ const L=p.look||{}; if(L.tipo) return L.tipo; if(p.age<4) return 'medio'; const h=v3h(v3Semente(p),'tipo')%100; return h<16?'magro':h<30?'gordo':h<40&&p.age>=15&&p.age<60?'musculoso':'medio'; }
const V3_ESTILOS_DIA={crianca:['Casual','Esportivo','Verão','Street'],jovem:['Casual','Esportivo','Street','Rock','Verão','Boho','Preppy','Romântico','Gótico'],adulto:['Casual','Casual','Social','Esportivo','Inverno','Verão','Vintage','Country','Boho','Preppy','Romântico'],idoso:['Casual','Social','Inverno','Vintage','Country']};
function v3RoupaPadrao(p){ const F=p.gender==='F', a=p.age??30, fase=a<13?'crianca':a<26?'jovem':a<62?'adulto':'idoso', sd=v3Semente(p), est=v3pick(V3_ESTILOS_DIA[fase],sd,'est');
  const lista=ROUPAS[F?'F':'M'].filter(r=>r.estilo===est); return lista.length?v3pick(lista,sd,'roupa'):ROUPAS[F?'F':'M'][0]; }
function v3Uniforme(p){ if(p===S?.me){ const m=p; if(m.prison) return 'preso'; if(m.office) return m.office.id; if(m.royal&&!m.royal.abd&&m.royal.reign) return 'rei'; if(m.royal&&!m.royal.abd) return 'principe';
  if(m.job&&m.job.spc) return V3_ESPECIAL[m.job.spc]||null; if(m.job) return m.job.id; if(m.biz) return 'emp'; if(m.age>=6&&m.age<18&&m.edu&&m.edu.cur&&!['uni','post'].includes(m.edu.cur.type)) return 'estudante'; return null; }
  if(p.prison) return 'preso'; return typeof p.job==='string'&&V3_TITULO[p.job]||null; }
// monta a ficha completa de desenho de uma pessoa
function v3Ficha(p,over,o={}){
  const L=Object.assign({},ensureLook(p),over||{}), ge=p.genes||{}, a=p.age??30, F=p.gender==='F', id=v3Semente(p), me=p===S?.me;
  // adulto muda de desenho a cada 2 anos: o rosto quase não muda de um ano pro outro e assim as imagens prontas são reaproveitadas
  const c={sexo:F?'F':'M',idade:a<18?a:a-a%2,tipo:v3Tipo(Object.assign({},p,{look:L}))};
  let pele=SKINS[ge.skin??2]; if(me&&S.scen&&S.scen.inf) pele=mixHex(pele,'#86A86A',.45); c.pele=pele;
  c.olhos=EYE_HEX[ge.eyes]||'#6A4A2A'; if(ge.freckles) c.sardas=true;
  const natural=HAIR_HEX[ge.hair]||'#4A2E1E'; c.corCabelo=L.dye||natural; if(L.dye) c.tinta=true; if(L.pontas) c.corPontas=L.pontas;
  // cabelo: o corte novo escolhido no salão tem prioridade; senão, o corte antigo vira um parecido do catálogo
  let cab=L.cab3||v3pick(V3_CAB[L.hair]||V3_CAB[F?'longo':'curto'],id,'cab');
  if(!F&&!L.cab3&&a>=50&&v3h(id,'calvo')%4===0) cab=a>=62?'calvo':'entradas';
  // boa parte das mulheres mais velhas usa o cabelo mais curto ou preso
  if(F&&!L.cab3&&a>=58&&['longo','longoMeio','muitoLongo','franjaLonga','cortina','boxBraids','cacheadoLongo','ondulado','trancaLado','trancas','chiquinhas','coquesDuplos','raboFranja'].includes(cab)&&v3h(id,'idosa')%10<7) cab=v3pick(['medio','chanel','coqueBaixo','medio','joaozinho','cacheadoMedio'],id,'cabIdosa');
  if(typeof hasCancer==='function'&&hasCancer(p)&&a>=2) cab='careca';
  else if(p.hairBack&&S&&S.year<p.hairBack&&cab!=='careca') cab='raspado';
  if(a<2) cab=a<1?'careca':'curto'; c.cabelo=cab;
  if(!L.dye) c.grisalho=v3h(id,'gris')%17-8; // uns ficam grisalhos antes, outros depois
  if(!F&&a>=16&&L.beard&&L.beard!=='none') c.barba=V3_BARBA[L.beard]||'por fazer';
  if(L.makeup&&L.makeup!=='none'&&a>=12){ if(V3_BATOM[L.makeup]) c.batom=V3_BATOM[L.makeup]; if(L.makeup==='delineado'||L.makeup==='completa') c.maquiagem='#6B4E71'; }
  // roupa: uniforme quando faz sentido, senão o look escolhido, senão um look do dia a dia que combina com a idade
  const ac=[]; let uni=o.uniforme===false?null:(o.uniforme||((me&&!L.semUni||o.trabalho)?v3Uniforme(p):null));
  if(p.prison) uni='preso';
  if(uni&&(UNIFORMES[uni]||ROUPAS.estilos.includes(uni))&&a>=4){
   if(UNIFORMES[uni]) Object.assign(c,vestirUniforme(c,uni)); else { const l=ROUPAS[c.sexo].filter(r=>r.estilo===uni); Object.assign(c,vestirRoupa(c,v3pick(l,id,'esp'))); } }
  else if(a>=2){ const r=L.roupa3&&ROUPAS[c.sexo].find(x=>x.id===L.roupa3)||ROUPAS.F.concat(ROUPAS.M).find(x=>x.id===L.roupa3)||v3RoupaPadrao(p); Object.assign(c,vestirRoupa(c,r)); }
  ac.push(...(c.acess||[]));
  if(L.glasses&&L.glasses!=='none'&&V3_OCULOS[L.glasses]&&!ac.some(x=>/^oculos/.test(x.k||x))) ac.push(V3_OCULOS[L.glasses]);
  else if(ge.glasses&&a>=7&&(!L.glasses||L.glasses==='none')&&L.semOculos!==true&&!ac.some(x=>/^oculos/.test(x.k||x))) ac.push({k:'oculos',cor:'#2B2B30'});
  if(L.hat&&L.hat!=='none'&&V3_CHAPEU[L.hat]) ac.push({k:V3_CHAPEU[L.hat],cor:L.hatColor});
  if(L.ear&&L.ear!=='none'&&V3_BRINCO[L.ear]) ac.push(V3_BRINCO[L.ear]);
  if(L.pierce&&L.pierce!=='none'&&V3_PIER[L.pierce]) ac.push({k:V3_PIER[L.pierce]});
  for(const k of L.acess3||[]){ const it=ACESSORIOS.find(x=>x.id===k); if(it) ac.push(it.item); }
  if(over&&over.acc){ const it=ACESSORIOS.find(x=>x.id===over.acc); if(it&&!(L.acess3||[]).includes(over.acc)) ac.push(it.item); }
  if(m3Royal(p)&&!ac.some(x=>(x.k||x)==='coroa')) ac.push({k:'coroa'});
  c.acess=ac;
  // criaturas
  if(p.criatura){ c.criatura=p.criatura; if(p.criatura==='lobisomem'&&o.lobo) c.forma='lobo'; }
  // humor vira expressão
  const humor=me?p.happy:(p.bond??60); c.expr=o.expr||(humor>=62?'sorriso':humor<28?'triste':'leve');
  if(o.recorte) c.recorte=o.recorte;
  // bebês não usam acessórios
  if(a<3){ c.acess=[]; delete c.batom; delete c.maquiagem; }
  return c;
}
function m3Royal(p){ return p===S?.me&&p.royal&&!p.royal.abd&&p.royal.reign&&!p.prison; }
// cache: a mesma ficha desenhada uma vez vira uma imagem reaproveitada
const V3_CACHE=new Map();
function v3Img(c,bg){
  const key=JSON.stringify(c)+'|'+bg; let u=V3_CACHE.get(key);
  if(!u){ let s=corpoSVG(c); if(bg){ const m=s.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/); if(m) s=s.replace(/(<svg[^>]*>)/,`$1<rect x="${m[1]}" y="${m[2]}" width="${m[3]}" height="${m[4]}" fill="${bg}"/>`); }
   if(!/xmlns=/.test(s)) s=s.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');
   try{ u=URL.createObjectURL(new Blob([s],{type:'image/svg+xml'})); }catch(e){ u='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s); }
   if(V3_CACHE.size>900){ const k0=V3_CACHE.keys().next().value; const u0=V3_CACHE.get(k0); V3_CACHE.delete(k0); if(u0.startsWith('blob:')) setTimeout(()=>URL.revokeObjectURL(u0),4000); }
   V3_CACHE.set(key,u); }
  return u;
}
const V3_FUNDOS=['#CFE0FF','#FFD9CC','#CDEFDF','#EBD6FF','#FFEDB8','#C9EDF4','#FFD3E1','#E2E5EE'];
faceSVG=function(p,size=44,over){
  if(!p||p.rel==='pet'||p.species||!window.corpoSVG) return faceSVG0(p,size,over);
  try{ const c=v3Ficha(p,over,{recorte:'retrato'}), bg=V3_FUNDOS[(p.id??7)%V3_FUNDOS.length];
   const dead=p.alive===false;
   return `<img class="face face3" src="${v3Img(c,bg)}" width="${size}" height="${size}" alt="" draggable="false"${dead?' style="filter:grayscale(1) contrast(.9)"':''}>`; }
  catch(e){ console.error(e); return faceSVG0(p,size,over); }
};
// figura de corpo inteiro (palco do personagem, perfil, eventos)
function figuraSVG(p,o={}){
  try{ const c=v3Ficha(p,o.over,o); return `<img class="${o.cls||'fig3'}" src="${v3Img(c,o.bg||'')}" alt="" draggable="false"${p.alive===false?' style="filter:grayscale(1)"':''}>`; }
  catch(e){ console.error(e); return faceSVG0(p,96); }
}
function bustoSVG(p,o={}){ return figuraSVG(p,Object.assign({recorte:'busto',cls:'busto3'},o)); }
