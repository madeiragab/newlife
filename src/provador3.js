// ===== 3.0.2: provador =====
// Tela cheia para montar o visual de uma vez: abas no topo (Corpo, Cabelo, Roupas, Acessórios), categorias à
// esquerda, eu de corpo inteiro no meio mudando na hora e as opções à direita. Nada é cobrado enquanto experimento;
// o ✔ mostra o total e paga tudo junto (com a ajuda dos pais, se eu for menor, como nas outras lojas).

const PV3_ABAS=[['corpo','Corpo','🧍'],['cabelo','Cabelo','💇'],['roupas','Roupas','👕'],['acess','Acessórios','🧢']];
const PV3_ABAS_GEN=[['pele','Pele','🎨'],['olhos','Olhos','👁️'],['cabelo','Cabelo','💇'],['rosto','Rosto','✨'],['corpo','Corpo','🧍']];
let PV3=null; // {aba,cat,over,sexo,modo,gen}
const pv3Abas=()=>PV3.modo==='genes'?PV3_ABAS_GEN:PV3_ABAS;
// pessoa de prova: no modo genética, com os genes escolhidos por cima
const pv3Pessoa=g2=>PV3.modo==='genes'?Object.assign({},S.me,{genes:Object.assign({},S.me.genes,PV3.gen,g2||{})}):S.me;

function pv3Cats(){ const m=S.me, a=m.age, F=m.gender==='F', sx=PV3.sexo;
  if(PV3.modo==='genes') return ({pele:[['pele','Tom de pele']],olhos:[['olhos','Cor dos olhos']],cabelo:[['cabelo','Cor natural do cabelo']],rosto:[['sardas','Sardas'],['oculos','Óculos de grau']],corpo:[['tipo','Biotipo'],['altura','Altura adulta']]})[PV3.aba].map(([id,l])=>({id,l}));
  const C={corpo:[['tipo','Tipo de corpo',14]],
   cabelo:[['curtos','Curtos',5],['longos','Longos e presos',5],['cor','Cor',12]].concat(F?[]:[['barba','Barba',16]]).concat([['maquiagem','Maquiagem',13]]),
   roupas:ROUPAS.estilos.filter(e=>ROUPAS[sx].some(r=>r.estilo===e)).map(e=>['r:'+e,e,4]),
   acess:[...new Set(ACESSORIOS.map(x=>x.cat))].map(c=>['a:'+c,c[0].toUpperCase()+c.slice(1),3])};
  return C[PV3.aba].map(([id,l,min])=>({id,l,dis:a<min,min})); }

// itens da categoria: {k:chave no look, v:valor, n:nome, p:preço, over:prévia}
function pv3Itens(){ const cat=PV3.cat||'', it=[];
  const femCab=new Set(['longo','longoMeio','muitoLongo','franjaLonga','cortina','chanel','chanelFranja','cacheadoChanel','medio','medioMeio','ondulado','onduladoMedio','cacheadoLongo','cacheadoMedio','raboAlto','raboLado','raboFranja','coque','coqueBaixo','coquesDuplos','chiquinhas','trancas','trancaLado','boxBraids','afroPuff','meioPreso']);
  if(PV3.modo==='genes'){
   const up=k=>k[0].toUpperCase()+k.slice(1);
   if(cat==='pele') SKINS.forEach((c,i)=>it.push({k:'g:skin',v:i,n:'Tom '+(i+1),p:0}));
   else if(cat==='olhos') for(const k of Object.keys(EYE_HEX)) it.push({k:'g:eyes',v:k,n:up(k),p:0});
   else if(cat==='cabelo') for(const k of Object.keys(HAIR_HEX).filter(k=>k!=='grisalho')) it.push({k:'g:hair',v:k,n:up(k),p:0});
   else if(cat==='sardas') it.push({k:'g:freckles',v:false,n:'Sem sardas',p:0},{k:'g:freckles',v:true,n:'Com sardas',p:0});
   else if(cat==='oculos') it.push({k:'g:glasses',v:false,n:'Enxergo bem',p:0},{k:'g:glasses',v:true,n:'Preciso de óculos',p:0});
   else if(cat==='tipo') for(const [k,n] of [['magro','Magro'],['medio','Médio'],['gordo','Gordo'],['musculoso','Musculoso']]) it.push({k:'tipo',v:k,n,p:0});
   else if(cat==='altura'){ const F=S.me.gender==='F'; for(let h=F?145:155;h<=(F?190:205);h+=5) it.push({k:'g:h',v:h,n:fmtH(h),p:0,alt:true}); }
   return it; }
  if(cat==='tipo') for(const [k,n] of [['magro','Magro'],['medio','Médio'],['gordo','Gordo'],['musculoso','Musculoso']]) it.push({k:'tipo',v:k,n,p:0,dis:k==='musculoso'&&S.me.age<15});
  else if(cat==='curtos'||cat==='longos') for(const k of Object.keys(CABELOS).filter(k=>femCab.has(k)===(cat==='longos'))) it.push({k:'cab3',v:k,n:CABELOS[k].n||k,p:k==='careca'?30:120});
  else if(cat==='cor'){ it.push({k:'dye',v:null,n:'Cor natural',p:150}); for(const [n,c] of V3_CORES_CAB) it.push({k:'dye',v:c,n,p:250,cor:c}); }
  else if(cat==='barba') for(const b of BEARDS) it.push({k:'beard',v:b.id,n:b.n,p:60});
  else if(cat==='maquiagem') for(const b of MAKEUPS) it.push({k:'makeup',v:b.id,n:b.n,p:b.v||0});
  else if(cat.startsWith('r:')) for(const r of ROUPAS[PV3.sexo].filter(r=>r.estilo===cat.slice(2))) it.push({k:'roupa3',v:r.id,n:r.nome,p:V3_PRECO_ESTILO[r.estilo]||250});
  else if(cat.startsWith('a:')) for(const a of ACESSORIOS.filter(a=>a.cat===cat.slice(2))) it.push({k:'acess3',v:a.id,n:a.nome,p:V3_PRECO_ACESS[a.cat]||100,dis:a.item.k==='coroa'&&!(S.me.royal&&!S.me.royal.abd)});
  return it; }

// o look de prova: o atual com as mudanças por cima
function pv3Look(){ const o=PV3.over, r={};
  for(const k in o) if(k!=='acess3') r[k]=o[k];
  if(o.acess3) r.acess3=o.acess3;
  if(o.roupa3) r.semUni=true; return r; }
function pv3Usando(i){ if(i.k.startsWith('g:')){ const g=pv3Pessoa().genes, k=i.k.slice(2); return k==='h'?Math.abs((g.h||0)-i.v)<2.5:k==='freckles'||k==='glasses'?!!g[k]===i.v:g[k]===i.v; }
  const L=Object.assign({},v3Look(),pv3Look());
  if(i.k==='acess3') return (L.acess3||[]).includes(i.v);
  if(i.k==='tipo') return v3Tipo(Object.assign({},S.me,{look:L}))===i.v;
  return (L[i.k]??null)===i.v; }
function pv3Escolher(i){ const L=v3Look(), o=PV3.over;
  if(i.k.startsWith('g:')){ const k=i.k.slice(2), g=S.me.genes; if(typeof i.v==='boolean'?!!g[k]===i.v:g[k]===i.v) delete PV3.gen[k]; else PV3.gen[k]=i.v; return; }
  if(i.k==='acess3'){ const l=(o.acess3||L.acess3||[]).slice(), on=l.includes(i.v);
    const a=ACESSORIOS.find(x=>x.id===i.v), unico=['chapéu','óculos','orelha'].includes(a.cat);
    let n=on?l.filter(x=>x!==i.v):l.filter(x=>!(unico&&ACESSORIOS.find(y=>y.id===x)?.cat===a.cat)).concat(i.v);
    if(n.length>8) n=n.slice(-8); o.acess3=n; }
  else if((L[i.k]??null)===i.v&&i.k!=='tipo') delete o[i.k];
  else o[i.k]=i.v; }

// o que muda e quanto custa
function pv3Conta(){ const L=v3Look(), o=PV3.over, l=[];
  for(const k in (PV3.gen||{})) l.push({k:'g:'+k,p:0});
  for(const k of ['tipo','cab3','dye','beard','makeup','roupa3']) if(k in o&&(L[k]??null)!==o[k]){
    const p=k==='tipo'?0:k==='cab3'?(o[k]==='careca'?30:120):k==='dye'?(o[k]?250:150):k==='beard'?60:k==='makeup'?(MAKEUPS.find(x=>x.id===o[k])?.v||0):(V3_PRECO_ESTILO[(ROUPAS.F.concat(ROUPAS.M).find(r=>r.id===o[k])||{}).estilo]||250);
    l.push({k,p}); }
  if(o.acess3){ const antes=L.acess3||[]; for(const id of o.acess3.filter(x=>!antes.includes(x))){ const a=ACESSORIOS.find(x=>x.id===id); l.push({k:'acess3',id,p:V3_PRECO_ACESS[a.cat]||100}); }
    if(antes.some(x=>!o.acess3.includes(x))) l.push({k:'tira',p:0}); }
  return {l,total:l.reduce((s,x)=>s+x.p,0)}; }

function pv3Aplicar(){ const L=v3Look(), o=PV3.over, c=pv3Conta();
  if(PV3.modo==='genes'){ S.me.genes.hAntes=S.me.genes.h; Object.assign(S.me.genes,PV3.gen); if(typeof genRefazerFamilia==='function') genRefazerFamilia(); delete S.me.genes.hAntes; if('tipo' in o) L.tipo=o.tipo; if(PV3.gen.glasses===false) L.glasses='none'; return 'Criei a minha aparência do jeito que eu queria.'; }
  for(const k of ['tipo','cab3','dye','beard','makeup','roupa3']) if(k in o) L[k]=o[k];
  if(o.dye===null) L.pontas=null;
  if(o.roupa3) L.semUni=true;
  if(o.acess3){ L.acess3=o.acess3.slice(); const cats=o.acess3.map(id=>ACESSORIOS.find(a=>a.id===id)?.cat); if(cats.includes('óculos')) L.glasses='none'; if(cats.includes('chapéu')) L.hat='none'; }
  if(o.tipo==='musculoso') st('health',3); if(o.tipo==='gordo') st('health',-2); if(o.tipo==='magro') st('health',1);
  if('cab3' in o||'dye' in o) st('looks',R.int(-2,4));
  const n=c.l.length; return n===1?'Saí do provador com o visual novo.':`Saí do provador com ${n} mudanças no visual.`; }

// cenário do provador: parede com lambri, janela com luz, espelho, planta, cortinas, luzinhas e tapete
const PV3_CENA=`<svg class="pv3-cena" viewBox="0 0 800 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
<defs>
 <linearGradient id="pvParede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--pv-p1)"/><stop offset="1" stop-color="var(--pv-p2)"/></linearGradient>
 <radialGradient id="pvLuz" cx=".5" cy=".42" r=".5"><stop offset="0" stop-color="var(--pv-luz)" stop-opacity=".75"/><stop offset="1" stop-color="var(--pv-luz)" stop-opacity="0"/></radialGradient>
 <linearGradient id="pvChao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--pv-c1)"/><stop offset="1" stop-color="var(--pv-c2)"/></linearGradient>
 <linearGradient id="pvCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--pv-ceu1)"/><stop offset="1" stop-color="var(--pv-ceu2)"/></linearGradient>
 <linearGradient id="pvVidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".45" stop-color="#fff" stop-opacity=".12"/><stop offset=".6" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient>
 <linearGradient id="pvOuro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D58A"/><stop offset=".5" stop-color="#C99A3E"/><stop offset="1" stop-color="#E8C46E"/></linearGradient>
 <linearGradient id="pvCortina" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--pv-k2)"/><stop offset=".25" stop-color="var(--pv-k1)"/><stop offset=".5" stop-color="var(--pv-k2)"/><stop offset=".75" stop-color="var(--pv-k1)"/><stop offset="1" stop-color="var(--pv-k2)"/></linearGradient>
 <radialGradient id="pvTapete" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="var(--pv-t1)"/><stop offset=".7" stop-color="var(--pv-t2)"/><stop offset="1" stop-color="var(--pv-t3)"/></radialGradient>
 <linearGradient id="pvRaio" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6D8" stop-opacity=".55"/><stop offset="1" stop-color="#FFF6D8" stop-opacity="0"/></linearGradient>
</defs>
<rect width="800" height="600" fill="url(#pvParede)"/>
<g fill="var(--pv-desenho)" opacity=".5">${Array.from({length:60},(_,i)=>`<circle cx="${(i%10)*84+(Math.floor(i/10)%2?42:0)+10}" cy="${Math.floor(i/10)*64+20}" r="3"/>`).join('')}</g>
<rect y="355" width="800" height="135" fill="var(--pv-lambri)"/>
<g fill="none" stroke="var(--pv-moldura)" stroke-width="3">${[30,190,350,510,670].map(x=>`<rect x="${x}" y="375" width="120" height="95" rx="6"/>`).join('')}</g>
<rect y="350" width="800" height="9" fill="var(--pv-moldura)"/>
<g transform="translate(70 70)"><path d="M0 230V90A75 75 0 0 1 150 90V230Z" fill="url(#pvCeu)"/>
 <circle cx="110" cy="70" r="16" fill="#FFF3C4" opacity=".9"/><path d="M20 180q30-25 60-6t70-10V230H0Z" fill="var(--pv-morro)" opacity=".6"/>
 <path d="M75 15V230M0 120H150" stroke="#fff" stroke-width="6"/><path d="M0 230V90A75 75 0 0 1 150 90V230Z" fill="none" stroke="#fff" stroke-width="10"/>
 <rect x="-14" y="226" width="178" height="12" rx="4" fill="#fff"/></g>
<path d="M90 300L420 600H230L60 300Z" fill="url(#pvRaio)" opacity=".7"/>
<rect width="800" height="600" fill="url(#pvLuz)"/>
<g transform="translate(560 120)"><path d="M0 330V70A60 60 0 0 1 120 70V330Z" fill="url(#pvOuro)"/><path d="M10 322V72A50 50 0 0 1 110 72V322Z" fill="var(--pv-espelho)"/>
 <path d="M10 322V72A50 50 0 0 1 110 72V322Z" fill="url(#pvVidro)"/><path d="M30 120l40-40M30 160l60-60" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5"/>
 <path d="M8 330l-8 28h120l-8-28Z" fill="#B8863A"/></g>
<g transform="translate(700 330)"><path d="M-22 120h44l-6 70h-32Z" fill="#E9E3D8"/><path d="M-22 120h44v10h-44Z" fill="#D2C8B8"/>
 <g fill="var(--pv-folha)">${[[-50,-70,-35],[40,-80,30],[-20,-130,-10],[25,-150,15],[-60,-10,-50],[55,-20,45],[0,-90,0],[-35,-160,-20]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="22" ry="46" transform="rotate(${r} ${x} ${y})"/>`).join('')}</g>
 <g stroke="var(--pv-caule)" stroke-width="3" fill="none"><path d="M0 120Q-10 40-50-70M0 120Q10 30 40-80M0 120Q-5 0-20-130M0 120Q8-20 25-150M0 120Q-20 60-60-10M0 120Q20 50 55-20"/></g></g>
<path d="M0 0H80Q60 200 85 430Q70 520 95 600H0Z" fill="url(#pvCortina)"/><path d="M800 0H720Q740 200 715 430Q730 520 705 600H800Z" fill="url(#pvCortina)"/>
<rect x="0" y="0" width="800" height="16" fill="var(--pv-k2)"/><circle cx="80" cy="420" r="9" fill="url(#pvOuro)"/><circle cx="720" cy="420" r="9" fill="url(#pvOuro)"/>
<path d="M60 30Q230 95 400 40T740 30" fill="none" stroke="var(--pv-fio)" stroke-width="2"/>
${[[110,52],[170,70],[230,78],[290,72],[350,55],[450,50],[510,64],[570,70],[630,58],[690,42]].map(([x,y],i)=>`<g class="pv3-luzinha" style="--i:${i}"><circle cx="${x}" cy="${y+8}" r="13" fill="#FFE8A3" opacity=".35"/><circle cx="${x}" cy="${y+8}" r="6" fill="#FFF1C2"/></g>`).join('')}
<path d="M0 490H800V600H0Z" fill="url(#pvChao)"/>
<g stroke="var(--pv-tabua)" stroke-width="2" opacity=".55">${[515,545,580].map(y=>`<path d="M0 ${y}H800"/>`).join('')}${Array.from({length:9},(_,i)=>`<path d="M${i*95+(i%2?40:0)} ${i%2?515:545}v${i%2?30:35}"/>`).join('')}</g>
<ellipse cx="400" cy="545" rx="210" ry="42" fill="url(#pvTapete)"/>
<ellipse cx="400" cy="545" rx="170" ry="32" fill="none" stroke="var(--pv-t3)" stroke-width="3" stroke-dasharray="8 7" opacity=".7"/>
<ellipse cx="400" cy="545" rx="110" ry="20" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/>
<ellipse cx="400" cy="548" rx="75" ry="12" fill="#000" opacity=".18"/>
</svg>`;
function pv3Abrir(aba,modo){ if(!S||!S.me||!S.me.alive) return; ensureLook(S.me);
  PV3={aba:aba||(modo==='genes'?'pele':'roupas'),cat:null,over:{},gen:{},modo,sexo:S.me.gender==='F'?'F':'M'};
  let w=document.getElementById('provador3'); if(!w){ w=document.createElement('div'); w.id='provador3'; document.body.appendChild(w); }
  w.hidden=false; pv3Draw(); }
function pv3Fechar(){ const w=document.getElementById('provador3'); if(w){ w.hidden=true; w.innerHTML=''; } PV3=null; render(); }

function pv3Draw(){ const w=document.getElementById('provador3'); if(!w||!PV3) return; const m=S.me;
  const cats=pv3Cats(); if(!PV3.cat||!cats.some(c=>c.id===PV3.cat)) PV3.cat=(cats.find(c=>!c.dis)||cats[0]||{}).id;
  const itens=pv3Itens(), conta=pv3Conta(), look=pv3Look(), cat=cats.find(c=>c.id===PV3.cat);
  const busto=PV3.aba==='cabelo'||PV3.aba==='olhos'||PV3.aba==='rosto', pes=pv3Pessoa();
  const thumb=i=>{ if(i.alt) return `<span class="pv3-cor pv3-alt">${(i.v/100).toFixed(2).replace('.',',')}</span>`;
    if(i.k.startsWith('g:')) return `<img src="${v3Img(v3Ficha(pv3Pessoa({[i.k.slice(2)]:i.v}),look,{recorte:'retrato'}),'#EEF0F6')}" alt="">`;
    const ov=Object.assign({},look,i.k==='acess3'?{acc:i.v}:i.k==='tipo'?{tipo:i.v}:{[i.k]:i.v},i.k==='roupa3'?{semUni:true}:{});
    if(i.cor) return `<span class="pv3-cor" style="background:${i.cor}"></span>`;
    return `<img src="${v3Img(v3Ficha(m,ov,{recorte:i.k==='roupa3'||i.k==='tipo'||['mão','bolsa','objeto','costas'].includes((ACESSORIOS.find(a=>a.id===i.v)||{}).cat)?'busto':'retrato'}),'#EEF0F6')}" alt="">`; };
  w.innerHTML=`<div class="pv3">
   <header class="pv3-topo"><button class="pv3-x" data-a="sair" aria-label="Sair sem comprar">✕</button>
    <nav class="pv3-abas">${pv3Abas().map(([id,l,ic])=>`<button data-aba="${id}" class="${PV3.aba===id?'on':''}"><span>${ic}</span>${l}</button>`).join('')}</nav>
    <button class="pv3-ok" data-a="ok" ${conta.l.length?'':'disabled'}><span>✔</span>${PV3.modo==='genes'?'Criar':conta.l.length&&conta.total?fmt(conta.total):'Pronto'}</button></header>
   <div class="pv3-meio">
    <aside class="pv3-cats">${cats.map(c=>`<button data-cat="${esc(c.id)}" class="${c.id===PV3.cat?'on':''}" ${c.dis?`disabled title="A partir dos ${c.min} anos"`:''}>${esc(c.l)}${c.dis?` <small>${c.min}+</small>`:''}</button>`).join('')}</aside>
    <section class="pv3-palco">${PV3_CENA}
     ${busto?`<div class="pv3-retrato"><img src="${v3Img(v3Ficha(pes,look,{recorte:'retrato'}),'')}" alt=""></div>`:figuraSVG(pes,{cls:'pv3-fig',over:look,bg:''})}
     ${conta.l.length?`<button class="pv3-desfaz" data-a="desfaz">↩ Desfazer tudo</button>`:''}</section>
    <section class="pv3-opcoes"><h3>${esc(cat?cat.l:'')} <small>${itens.length}</small></h3>
     ${PV3.aba==='roupas'?`<button class="pv3-sexo" data-a="sexo">${PV3.sexo==='F'?'Ver roupas masculinas':'Ver roupas femininas'}</button>`:''}
     <div class="pv3-grade">${itens.map((i,n)=>{ const on=pv3Usando(i); return `<button class="pv3-item${on?' on':''}" data-i="${n}" ${i.dis?'disabled':''} title="${esc(i.n)}">${thumb(i)}<b>${esc(i.n)}</b><small>${on?'✔':i.p?fmt(i.p):'Grátis'}</small></button>`; }).join('')}</div></section>
   </div></div>`;
  w.onclick=e=>{ const b=e.target.closest('button'); if(!b||b.disabled) return; vibrar(10);
    if(b.dataset.aba){ PV3.aba=b.dataset.aba; PV3.cat=null; return pv3Draw(); }
    if(b.dataset.cat){ PV3.cat=b.dataset.cat; return pv3Draw(); }
    if(b.dataset.i!=null){ pv3Escolher(itens[+b.dataset.i]); return pv3Draw(); }
    const a=b.dataset.a;
    if(a==='sair') return pv3Fechar();
    if(a==='desfaz'){ PV3.over={}; PV3.gen={}; return pv3Draw(); }
    if(a==='sexo'){ PV3.sexo=PV3.sexo==='F'?'M':'F'; PV3.cat=null; return pv3Draw(); }
    if(a==='ok'){ const c=pv3Conta(); if(!c.l.length) return pv3Fechar(); const fim=()=>{ const ww=document.getElementById('provador3'); if(ww){ ww.hidden=true; ww.innerHTML=''; } PV3=null; };
      const est={over:PV3.over,gen:PV3.gen,modo:PV3.modo}; fim();
      if(est.modo==='genes') return act(()=>{ PV3=est; const r=pv3Aplicar(); PV3=null; return r; },'Criar aparência');
      v3Comprar(c.total,()=>{ PV3=est; const r=pv3Aplicar(); PV3=null; return r; },'Provador'); } };
  const sel=w.querySelector('.pv3-cats .on'); if(sel) sel.scrollIntoView({block:'nearest',inline:'nearest'}); }

// Criar aparência: destravada junto com o Modo Deus (menu) e oferecida no nascimento
function pv3CriarAparencia(){ if(!S||!S.me||!S.me.alive||S.scen) return msg('Criar aparência','Só funciona com o personagem vivo, fora dos modos fictícios.'); UI.close&&UI.close(); pv3Abrir('pele','genes'); }
// porta de entrada: no topo do Visual
V.style=(o=>function(){ const r=o.apply(this,arguments); try{ if(S.me.age>=3&&!S.scen) r.items.splice(1,0,{ic:'🪞',l:'Entrar no provador',s:'Corpo, cabelo, roupas e acessórios numa tela só. Experimente à vontade e pague no final.',on:()=>{ UI.close&&UI.close(); pv3Abrir('roupas'); }}); }catch(e){} return r; })(V.style);

function provadorSelfTest(){ const s0=S,ns=window.NO_SAVE; window.NO_SAVE=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); };
  try{ newLife({country:'BR'}); const m=S.me; m.age=25; m.money=100000; ensureLook(m);
    PV3={aba:'roupas',cat:null,over:{},sexo:m.gender==='F'?'F':'M'};
    for(const [aba] of PV3_ABAS){ PV3.aba=aba; for(const c of pv3Cats()){ PV3.cat=c.id; ok(pv3Itens().length>0,'categoria vazia: '+aba+'/'+c.id); } }
    PV3.aba='roupas'; PV3.cat=pv3Cats()[0].id; const roupa=pv3Itens()[0]; pv3Escolher(roupa); ok(pv3Usando(roupa),'roupa não entrou na prova');
    PV3.aba='acess'; PV3.cat=pv3Cats()[0].id; const ac=pv3Itens().find(i=>!i.dis); pv3Escolher(ac); ok(pv3Usando(ac),'acessório não entrou na prova');
    const c=pv3Conta(); ok(c.l.length===2&&c.total===roupa.p+ac.p,'conta errada: '+JSON.stringify(c));
    ok(v3Look().roupa3!==roupa.v,'provar já mudou o visual antes de pagar');
    pv3Aplicar(); const L=v3Look(); ok(L.roupa3===roupa.v&&L.acess3.includes(ac.v),'pagar não aplicou o visual');
    PV3.over={}; pv3Escolher(roupa); ok(!pv3Conta().l.length,'roupa que já uso cobrou de novo');
    // criar aparência: genética muda de graça e só vale depois do ✔
    PV3={aba:'pele',cat:null,over:{},gen:{},modo:'genes',sexo:'F'};
    for(const [aba] of PV3_ABAS_GEN){ PV3.aba=aba; for(const c of pv3Cats()){ PV3.cat=c.id; ok(pv3Itens().length>0,'genética vazia: '+c.id); } }
    PV3.aba='olhos'; PV3.cat='olhos'; const olho=pv3Itens().find(i=>i.v!==m.genes.eyes); pv3Escolher(olho); ok(pv3Usando(olho)&&m.genes.eyes!==olho.v,'olho mudou antes de criar');
    const sard=!m.genes.freckles; pv3Escolher({k:'g:freckles',v:sard});
    ok(pv3Conta().total===0,'criar aparência cobrou'); pv3Aplicar(); ok(m.genes.eyes===olho.v&&!!m.genes.freckles===sard,'genética não foi aplicada');
  }catch(e){ erros.push('erro: '+e.message); } finally{ PV3=null; S=s0; window.NO_SAVE=ns; }
  if(erros.length) throw Error('Provador 3.0.2 · '+erros.join(' | ')); return {ok:true}; }
// bebê: o botão aparece também no perfil, logo depois de nascer
V.me=(o=>function(){ const r=o.apply(this,arguments); try{ if(godUnlocked()&&S.me.age<=2&&!S.scen&&r&&r.items) r.items.splice(1,0,{ic:'🧬',l:'Criar aparência',s:'Escolher pele, olhos, cabelo, sardas, biotipo e altura',on:pv3CriarAparencia}); }catch(e){} return r; })(V.me);
