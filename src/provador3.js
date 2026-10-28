// ===== 3.0.2: provador =====
// Tela cheia para montar o visual de uma vez: abas no topo (Corpo, Cabelo, Roupas, Acessórios), categorias à
// esquerda, eu de corpo inteiro no meio mudando na hora e as opções à direita. Nada é cobrado enquanto experimento;
// o ✔ mostra o total e paga tudo junto (com a ajuda dos pais, se eu for menor, como nas outras lojas).

const PV3_ABAS=[['corpo','Corpo','🧍'],['cabelo','Cabelo','💇'],['roupas','Roupas','👕'],['acess','Acessórios','🧢']];
let PV3=null; // {aba,cat,over,sexo}

function pv3Cats(){ const m=S.me, a=m.age, F=m.gender==='F', sx=PV3.sexo;
  const C={corpo:[['tipo','Tipo de corpo',14]],
   cabelo:[['curtos','Curtos',5],['longos','Longos e presos',5],['cor','Cor',12]].concat(F?[]:[['barba','Barba',16]]).concat([['maquiagem','Maquiagem',13]]),
   roupas:ROUPAS.estilos.filter(e=>ROUPAS[sx].some(r=>r.estilo===e)).map(e=>['r:'+e,e,4]),
   acess:[...new Set(ACESSORIOS.map(x=>x.cat))].map(c=>['a:'+c,c[0].toUpperCase()+c.slice(1),3])};
  return C[PV3.aba].map(([id,l,min])=>({id,l,dis:a<min,min})); }

// itens da categoria: {k:chave no look, v:valor, n:nome, p:preço, over:prévia}
function pv3Itens(){ const cat=PV3.cat||'', it=[];
  const femCab=new Set(['longo','longoMeio','muitoLongo','franjaLonga','cortina','chanel','chanelFranja','cacheadoChanel','medio','medioMeio','ondulado','onduladoMedio','cacheadoLongo','cacheadoMedio','raboAlto','raboLado','raboFranja','coque','coqueBaixo','coquesDuplos','chiquinhas','trancas','trancaLado','boxBraids','afroPuff','meioPreso']);
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
function pv3Usando(i){ const L=Object.assign({},v3Look(),pv3Look());
  if(i.k==='acess3') return (L.acess3||[]).includes(i.v);
  if(i.k==='tipo') return v3Tipo(Object.assign({},S.me,{look:L}))===i.v;
  return (L[i.k]??null)===i.v; }
function pv3Escolher(i){ const L=v3Look(), o=PV3.over;
  if(i.k==='acess3'){ const l=(o.acess3||L.acess3||[]).slice(), on=l.includes(i.v);
    const a=ACESSORIOS.find(x=>x.id===i.v), unico=['chapéu','óculos','orelha'].includes(a.cat);
    let n=on?l.filter(x=>x!==i.v):l.filter(x=>!(unico&&ACESSORIOS.find(y=>y.id===x)?.cat===a.cat)).concat(i.v);
    if(n.length>8) n=n.slice(-8); o.acess3=n; }
  else if((L[i.k]??null)===i.v&&i.k!=='tipo') delete o[i.k];
  else o[i.k]=i.v; }

// o que muda e quanto custa
function pv3Conta(){ const L=v3Look(), o=PV3.over, l=[];
  for(const k of ['tipo','cab3','dye','beard','makeup','roupa3']) if(k in o&&(L[k]??null)!==o[k]){
    const p=k==='tipo'?0:k==='cab3'?(o[k]==='careca'?30:120):k==='dye'?(o[k]?250:150):k==='beard'?60:k==='makeup'?(MAKEUPS.find(x=>x.id===o[k])?.v||0):(V3_PRECO_ESTILO[(ROUPAS.F.concat(ROUPAS.M).find(r=>r.id===o[k])||{}).estilo]||250);
    l.push({k,p}); }
  if(o.acess3){ const antes=L.acess3||[]; for(const id of o.acess3.filter(x=>!antes.includes(x))){ const a=ACESSORIOS.find(x=>x.id===id); l.push({k:'acess3',id,p:V3_PRECO_ACESS[a.cat]||100}); }
    if(antes.some(x=>!o.acess3.includes(x))) l.push({k:'tira',p:0}); }
  return {l,total:l.reduce((s,x)=>s+x.p,0)}; }

function pv3Aplicar(){ const L=v3Look(), o=PV3.over, c=pv3Conta();
  for(const k of ['tipo','cab3','dye','beard','makeup','roupa3']) if(k in o) L[k]=o[k];
  if(o.dye===null) L.pontas=null;
  if(o.roupa3) L.semUni=true;
  if(o.acess3){ L.acess3=o.acess3.slice(); const cats=o.acess3.map(id=>ACESSORIOS.find(a=>a.id===id)?.cat); if(cats.includes('óculos')) L.glasses='none'; if(cats.includes('chapéu')) L.hat='none'; }
  if(o.tipo==='musculoso') st('health',3); if(o.tipo==='gordo') st('health',-2); if(o.tipo==='magro') st('health',1);
  if('cab3' in o||'dye' in o) st('looks',R.int(-2,4));
  const n=c.l.length; return n===1?'Saí do provador com o visual novo.':`Saí do provador com ${n} mudanças no visual.`; }

function pv3Abrir(aba){ if(!S||!S.me||!S.me.alive) return; ensureLook(S.me);
  PV3={aba:aba||'roupas',cat:null,over:{},sexo:S.me.gender==='F'?'F':'M'};
  let w=document.getElementById('provador3'); if(!w){ w=document.createElement('div'); w.id='provador3'; document.body.appendChild(w); }
  w.hidden=false; pv3Draw(); }
function pv3Fechar(){ const w=document.getElementById('provador3'); if(w){ w.hidden=true; w.innerHTML=''; } PV3=null; render(); }

function pv3Draw(){ const w=document.getElementById('provador3'); if(!w||!PV3) return; const m=S.me;
  const cats=pv3Cats(); if(!PV3.cat||!cats.some(c=>c.id===PV3.cat)) PV3.cat=(cats.find(c=>!c.dis)||cats[0]||{}).id;
  const itens=pv3Itens(), conta=pv3Conta(), look=pv3Look(), cat=cats.find(c=>c.id===PV3.cat);
  const busto=PV3.aba==='cabelo';
  const thumb=i=>{ const ov=Object.assign({},look,i.k==='acess3'?{acc:i.v}:i.k==='tipo'?{tipo:i.v}:{[i.k]:i.v},i.k==='roupa3'?{semUni:true}:{});
    if(i.cor) return `<span class="pv3-cor" style="background:${i.cor}"></span>`;
    return `<img src="${v3Img(v3Ficha(m,ov,{recorte:i.k==='roupa3'||i.k==='tipo'||['mão','bolsa','objeto','costas'].includes((ACESSORIOS.find(a=>a.id===i.v)||{}).cat)?'busto':'retrato'}),'#EEF0F6')}" alt="">`; };
  w.innerHTML=`<div class="pv3">
   <header class="pv3-topo"><button class="pv3-x" data-a="sair" aria-label="Sair sem comprar">✕</button>
    <nav class="pv3-abas">${PV3_ABAS.map(([id,l,ic])=>`<button data-aba="${id}" class="${PV3.aba===id?'on':''}"><span>${ic}</span>${l}</button>`).join('')}</nav>
    <button class="pv3-ok" data-a="ok" ${conta.l.length?'':'disabled'}><span>✔</span>${conta.l.length?(conta.total?fmt(conta.total):'Pronto'):'Pronto'}</button></header>
   <div class="pv3-meio">
    <aside class="pv3-cats">${cats.map(c=>`<button data-cat="${esc(c.id)}" class="${c.id===PV3.cat?'on':''}" ${c.dis?`disabled title="A partir dos ${c.min} anos"`:''}>${esc(c.l)}${c.dis?` <small>${c.min}+</small>`:''}</button>`).join('')}</aside>
    <section class="pv3-palco"><div class="pv3-espelho" aria-hidden="true"></div><div class="pv3-cortina" aria-hidden="true"></div>
     ${figuraSVG(m,{cls:'pv3-fig'+(busto?' perto':''),over:look,bg:''})}
     <div class="pv3-chao" aria-hidden="true"></div>
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
    if(a==='desfaz'){ PV3.over={}; return pv3Draw(); }
    if(a==='sexo'){ PV3.sexo=PV3.sexo==='F'?'M':'F'; PV3.cat=null; return pv3Draw(); }
    if(a==='ok'){ const c=pv3Conta(); if(!c.l.length) return pv3Fechar(); const fim=()=>{ const ww=document.getElementById('provador3'); if(ww){ ww.hidden=true; ww.innerHTML=''; } PV3=null; };
      const over=PV3.over; fim(); v3Comprar(c.total,()=>{ PV3={over}; const r=pv3Aplicar(); PV3=null; return r; },'Provador'); } };
  const sel=w.querySelector('.pv3-cats .on'); if(sel) sel.scrollIntoView({block:'nearest',inline:'nearest'}); }

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
  }catch(e){ erros.push('erro: '+e.message); } finally{ PV3=null; S=s0; window.NO_SAVE=ns; }
  if(erros.length) throw Error('Provador 3.0.2 · '+erros.join(' | ')); return {ok:true}; }
