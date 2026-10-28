// ===== Visual 3.0: salão, guarda-roupa, acessórios e corpo =====
// Tudo é montado peça por peça: 57 cortes, qualquer cor de cabelo (inclusive degradê nas pontas),
// 200 roupas por gênero em 18 estilos, 226 acessórios e 4 tipos de corpo.
const V3_PRECO_ESTILO={Executivo:900,Festa:700,Social:500,Inverno:450,Gótico:350,Rock:350,Vintage:350,Romântico:300,Preppy:300,Boho:280,Country:280,Street:260,Esportivo:220,Casual:180,Verão:160,Praia:150,Macacão:200,Pijama:90};
const V3_PRECO_ACESS={'chapéu':120,cabelo:40,'óculos':250,orelha:150,'pescoço':180,rosto:120,'mão':200,bolsa:300,objeto:80,costas:150};
const V3_CORES_CAB=[['Preto','#1A1110'],['Castanho-escuro','#3B2416'],['Castanho','#6E4428'],['Castanho-claro','#A0703F'],['Loiro escuro','#B8893F'],['Loiro','#EAC66B'],['Platinado','#EDE6D3'],['Ruivo','#C2582B'],['Acobreado','#A4441F'],['Vinho','#6A0D2B'],['Vermelho','#D23B34'],['Rosa','#EE7AB1'],['Rosa-chiclete','#FF4FA3'],['Lilás','#B79CED'],['Roxo','#8E58D6'],['Azul','#3E74DC'],['Azul-petróleo','#1F6F78'],['Verde','#3CB36E'],['Verde-limão','#A7D129'],['Laranja','#F28C28'],['Branco','#F2F2F2'],['Cinza-prata','#B8BCC2']];
const v3Look=()=>ensureLook(S.me);
const v3Preview=(over,tam=48,busto)=>busto?`<img class="face face3 bustinho" src="${v3Img(v3Ficha(S.me,over,{recorte:'busto'}),'#E8EAF2')}" width="${tam}" height="${Math.round(tam*1.11)}" alt="">`:faceSVG(S.me,tam,over);
function v3Comprar(cost,fn,titulo){ minorPay(cost,()=>{ const m=S.me; if(cost&&!canPay(cost)) return `Não tenho ${fmt(cost)} para isso.`; m.money-=cost||0; cnt('restyle'); st('happy',R.int(1,4)); return fn(); },titulo||'Visual'); }
V.style=()=>{
  const m=S.me, L=ensureLook(m), it=[];
  it.push({html:`<div class="card estilo3-topo">${figuraSVG(m,{cls:'fig3 grande',lobo:false})}<div><p class="estilo3-n">${esc(m.first)}</p><p class="estilo3-s">Toque numa categoria para experimentar. Cada opção aparece já em você antes de comprar.</p></div></div>`});
  const cat=(min,ic,l,s,view)=>it.push(Object.assign({ic,l,s,on:()=>UI.push(view)},ageGate(min)));
  it.push({sec:'Cabelo'});
  cat(5,'💇','Corte de cabelo',`${Object.keys(CABELOS).length} cortes, curtos, longos, cacheados, presos e tranças`,V.cab3);
  cat(12,'🎨','Cor do cabelo','Qualquer cor, inclusive degradê nas pontas',V.corCab3);
  if(m.gender==='M') cat(16,'🧔','Barbearia','Barbas e bigodes',V.styleBeard);
  it.push({sec:'Roupas'});
  cat(4,'👕','Guarda-roupa',`${ROUPAS[m.gender==='F'?'F':'M'].length} looks em ${ROUPAS.estilos.length} estilos`,V.roupas3);
  if(m.job||m.office||m.biz) it.push({ic:'🦺',l:L.semUni?'Voltar a usar o uniforme de trabalho':'Usar meu próprio look em vez do uniforme',s:L.semUni?'Aparece com a roupa da profissão':'O uniforme fica no trabalho',on:()=>act(()=>{ L.semUni=!L.semUni; return L.semUni?'Agora saio com o meu próprio look.':'Voltei a usar o uniforme de trabalho.'; },'Visual')});
  it.push({sec:'Acessórios'});
  cat(3,'🧢','Acessórios',`${ACESSORIOS.length} itens: chapéus, enfeites de cabelo, óculos, brincos, colares, bolsas…`,V.acess3);
  cat(6,'🕶️','Ótica','Óculos de grau e de sol',()=>({title:'Ótica',items:GLASSES.map(o=>optRow('glasses',o,o.v||0))}));
  cat(10,'💎','Brincos','Ponto, argola, pérola',V.styleOpt('ear',EARRINGS,'Brincos'));
  cat(16,'📍','Piercings','Nariz, sobrancelha, lábio',V.styleOpt('pierce',PIERCINGS,'Piercings'));
  cat(13,'💄','Maquiagem','Batom, delineado',V.styleOpt('makeup',MAKEUPS,'Maquiagem'));
  it.push({sec:'Corpo'});
  cat(14,'🏋️','Tipo de corpo','Magro, médio, gordo ou musculoso',V.corpo3);
  if(m.genes.from) it.push({html:`<div class="card"><p style="color:var(--muted);font-size:13px">Cor natural do cabelo, olhos, pele e formato dos olhos vêm da genética e passam para os filhos. Tintura, corte, roupa e acessórios não passam.</p></div>`});
  return {title:'Visual',items:it};
};
V.cab3=()=>{ const L=v3Look(), F=S.me.gender==='F', fem=new Set(['longo','longoMeio','muitoLongo','franjaLonga','cortina','chanel','chanelFranja','cacheadoChanel','medio','medioMeio','ondulado','onduladoMedio','cacheadoLongo','cacheadoMedio','raboAlto','raboLado','raboFranja','coque','coqueBaixo','coquesDuplos','chiquinhas','trancas','trancaLado','boxBraids','afroPuff','meioPreso','tiara','laco','florCabelo','presilha','tranças','rabo']);
  const curtos=Object.keys(CABELOS).filter(k=>!fem.has(k)), longos=Object.keys(CABELOS).filter(k=>fem.has(k));
  const row=k=>({face:faceSVG(S.me,48,{cab3:k}),l:CABELOS[k].n||k,r:L.cab3===k?'Atual':fmt(k==='careca'?30:120),tone:L.cab3===k?'good':'',on:()=>v3Comprar(L.cab3===k?0:k==='careca'?30:120,()=>{ if(L.cab3===k) return 'Já estou assim.'; L.cab3=k; st('looks',R.int(-2,4)); return `Cortei o cabelo: ${(CABELOS[k].n||k).toLowerCase()}.`; },'Salão')});
  const sec=F?[['Longos e presos',longos],['Curtos',curtos]]:[['Curtos',curtos],['Longos e presos',longos]];
  return {title:'Corte de cabelo',items:sec.flatMap(([t,l])=>[{sec:t}].concat(l.map(row)))}; };
V.corCab3=()=>{ const L=v3Look(), it=[];
  it.push({html:`<div class="card cor3"><label>Cor livre <input type="color" id="corLivre3" value="${L.dye||HAIR_HEX[S.me.genes.hair]||'#4A2E1E'}"></label><label>Pontas (degradê) <input type="color" id="corPontas3" value="${L.pontas||'#EE7AB1'}"></label><div class="btns"><button class="btn" id="corAplicar3">Pintar (${fmt(250)})</button><button class="btn alt" id="pontasAplicar3">Só as pontas (${fmt(200)})</button></div></div>`});
  it.push({ic:'🌱',l:'Voltar à cor natural',r:fmt(150),on:()=>v3Comprar(150,()=>{ L.dye=null; L.pontas=null; return 'Voltei para a minha cor natural.'; },'Salão')});
  if(L.pontas) it.push({ic:'✂️',l:'Cortar as pontas pintadas',r:fmt(60),on:()=>v3Comprar(60,()=>{ L.pontas=null; return 'Cortei as pontas pintadas.'; },'Salão')});
  it.push({sec:'Cores prontas'});
  for(const [n,c] of V3_CORES_CAB) it.push({face:faceSVG(S.me,48,{dye:c}),l:n,r:L.dye===c?'Atual':fmt(250),tone:L.dye===c?'good':'',on:()=>v3Comprar(L.dye===c?0:250,()=>{ if(L.dye===c) return 'Já estou assim.'; L.dye=c; st('looks',R.int(-2,4)); return `Pintei o cabelo: ${n.toLowerCase()}.`; },'Salão')});
  return {title:'Cor do cabelo',items:it,after:b=>{
    const ap=b.querySelector('#corAplicar3'), pp=b.querySelector('#pontasAplicar3');
    if(ap) ap.onclick=()=>{ const c=b.querySelector('#corLivre3').value; v3Comprar(250,()=>{ L.dye=c; return 'Pintei o cabelo numa cor só minha.'; },'Salão'); };
    if(pp) pp.onclick=()=>{ const c=b.querySelector('#corPontas3').value; v3Comprar(200,()=>{ L.pontas=c; return 'Pintei as pontas do cabelo.'; },'Salão'); }; }}; };
V.roupas3=()=>{ const L=v3Look(), sx=S.me.gender==='F'?'F':'M', it=[];
  const atual=L.roupa3; if(atual) it.push({ic:'↩️',l:'Tirar o look escolhido',s:'Volta ao dia a dia',on:()=>act(()=>{ L.roupa3=null; return 'Voltei para as roupas de sempre.'; },'Visual')});
  it.push({ic:'🔁',l:S.me.gender==='F'?'Ver roupas masculinas':'Ver roupas femininas',s:'Tudo serve em qualquer corpo',on:()=>UI.push(V.roupas3outro)});
  for(const e of ROUPAS.estilos){ const l=ROUPAS[sx].filter(r=>r.estilo===e); if(!l.length) continue; it.push({sec:`${e} · ${l.length}`});
   for(const r of l) it.push(v3RoupaRow(r)); }
  return {title:'Guarda-roupa',items:it}; };
V.roupas3outro=()=>{ const sx=S.me.gender==='F'?'M':'F'; return {title:sx==='F'?'Roupas femininas':'Roupas masculinas',items:ROUPAS.estilos.flatMap(e=>{ const l=ROUPAS[sx].filter(r=>r.estilo===e); return l.length?[{sec:e}].concat(l.map(v3RoupaRow)):[]; })}; };
function v3RoupaRow(r){ const L=v3Look(), p=V3_PRECO_ESTILO[r.estilo]||250, eu=L.roupa3===r.id;
  return {face:v3Preview({roupa3:r.id,semUni:true},48,true),l:r.nome,s:r.estilo,r:eu?'Vestindo':fmt(p),tone:eu?'good':'',on:()=>v3Comprar(eu?0:p,()=>{ if(eu) return 'Já estou com essa roupa.'; L.roupa3=r.id; L.semUni=true; return `Comprei roupa nova: ${r.nome.toLowerCase()}.`; },'Guarda-roupa')}; }
V.acess3=()=>{ const L=v3Look(), cats=[...new Set(ACESSORIOS.map(a=>a.cat))], it=[];
  const tenho=(L.acess3||[]); if(tenho.length) it.push({sec:`Usando agora · ${tenho.length}`},...tenho.map(id=>ACESSORIOS.find(a=>a.id===id)).filter(Boolean).map(v3AcessRow));
  for(const c of cats){ const l=ACESSORIOS.filter(a=>a.cat===c); it.push({sec:`${c[0].toUpperCase()+c.slice(1)} · ${l.length}`}); it.push(...l.map(v3AcessRow)); }
  return {title:'Acessórios',items:it}; };
function v3AcessRow(a){ const L=v3Look(), on=(L.acess3||[]).includes(a.id), p=V3_PRECO_ACESS[a.cat]||100, corpo=['mão','bolsa','objeto','costas'].includes(a.cat);
  if(a.item.k==='coroa'&&!(S.me.royal&&!S.me.royal.abd)) return {face:v3Preview({acc:a.id},48,corpo),l:a.nome,s:'Só para a realeza',dis:true,why:'A coroa é só para quem é da realeza.'};
  return {face:v3Preview({acc:a.id},48,corpo),l:a.nome,r:on?'Tirar':fmt(p),tone:on?'good':'',on:()=>{ if(on) return act(()=>{ L.acess3=L.acess3.filter(x=>x!==a.id); return `Tirei: ${a.nome.toLowerCase()}.`; },'Acessórios');
    v3Comprar(p,()=>{ const l=L.acess3||(L.acess3=[]); const mesmo=ACESSORIOS.filter(x=>x.cat===a.cat&&['chapéu','óculos','orelha'].includes(a.cat)).map(x=>x.id); L.acess3=l.filter(x=>!mesmo.includes(x)); if(L.acess3.length>=8) L.acess3.shift(); L.acess3.push(a.id); if(a.cat==='óculos') L.glasses='none'; if(a.cat==='chapéu') L.hat='none'; return `Comprei: ${a.nome.toLowerCase()}.`; },'Acessórios'); }}; }
V.corpo3=()=>{ const L=v3Look(), t=v3Tipo(S.me), N={magro:'Magro',medio:'Médio',gordo:'Gordo',musculoso:'Musculoso'}, D={magro:'Mais leve, com dieta e corrida',medio:'Equilíbrio',gordo:'Comer bem e sem pressa',musculoso:'Muita academia'};
  return {title:'Tipo de corpo',items:[{html:`<div class="card"><p style="color:var(--muted);font-size:13px">Mudar o corpo leva tempo de verdade: o novo físico aparece agora, mas a saúde e a aparência mudam aos poucos.</p></div>`}].concat(Object.keys(N).map(k=>({face:v3Preview({tipo:k},48,true),l:N[k],s:D[k],r:t===k?'Atual':'',tone:t===k?'good':'',dis:k==='musculoso'&&S.me.age<15,why:'Só a partir dos 15 anos.',on:()=>act(()=>{ if(t===k) return 'Já estou assim.'; L.tipo=k; if(k==='musculoso') st('health',3); if(k==='gordo') st('health',-2); if(k==='magro') st('health',1); return k==='musculoso'?'Entrei de cabeça na academia e o corpo mudou.':k==='gordo'?'Relaxei na comida e ganhei uns quilos.':k==='magro'?'Fechei a boca, corri muito e emagreci.':'Achei o meu equilíbrio.'; },'Corpo')})))}; };
