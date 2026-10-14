// ===== Comerciantes nos modos fictícios: às vezes aparece alguém vendendo até 4 coisas; muda todo dia =====
// moeda de cada mundo: isekai ouro · zumbi sucata · herói dinheiro de verdade · Marte dados de pesquisa · ilha escambo (comida)
const MERC={
  zumbi:{chance:.4,cur:'zmat',nomes:[['Mascate do carrinho de supermercado','🛒','Um velho empurra um carrinho cheio de tralha e assobia como se o mundo não tivesse acabado.'],
      ['Contrabandista ex-militar','🎖️','Uniforme rasgado, olhar cansado e uma mochila que tilinta.'],['Família de mercadores nômades','🚐','Uma van pintada à mão para no acostamento. Três gerações vendendo o que acharam.'],
      ['Freira que troca remédios','⛪','Ela diz que Deus provê. A sucata ajuda.'],['Garoto do skate','🛹','Não deve ter quinze anos, mas negocia como gente grande.']],
    pool:[['lata',2],['arroz',3],['racao',4],['sardinha',2],['agua',1],['kit',4],['antib',4],['analg',2],['curativo',2],['calm',3],['gas',3],['muni',3],['reparo',4],['pilha',2],['lanterna',3],['radio',4],
      ['faca',2],['machado',5],['pistola',8],['espingarda',11],['colete',9],['roupa',3],['livro',1],['baralho',1],['vacina',14],['molotov',4]]},
  ilha:{chance:.3,cur:'troca',nomes:[['Pescador de passagem','🛶','Um bote encosta na praia. O pescador não fala português, mas entende muito bem de troca.'],
      ['Náufrago do outro lado da ilha','🧔','Barba até o peito. Diz que está aqui há três anos e tem "uns achados".'],['Contrabandista de lancha','🚤','Não quer saber de resgate. Quer saber o que você tem para dar.'],
      ['Velha da canoa','🛶','Ela rema sozinha entre as ilhas e troca coisas há décadas.']],
    pool:[['isqueiro',3],['corda',2],['lona',3],['faca',2],['kit',3],['analg',1],['sinal',3],['aguaf',1],['peixe',1],['livro',1],['baralho',1],['lanterna',2],['arco',3],['antib',2]]},
  isekai:{chance:.45,cur:'ouro',nomes:[['Mercador ambulante','🐫','Um camelo carregado até o pescoço e um mercador que sorri demais.'],
      ['Anão com carroça','🧔','"Ferro bom, preço justo. Mais ou menos justo."'],['Elfa vendedora de poções','🧝‍♀️','Os frascos brilham em cores que você nem sabia que existiam.'],
      ['Goblin do bazar suspeito','👺','Tudo "caiu da carroça". Literalmente.'],['Gato mercador falante','🐈','Usa chapéu, fala em rimas e aceita só moedas de ouro.'],['Bruxa da floresta','🧙‍♀️','Vende coisas úteis e outras que é melhor não perguntar.']],
    pool:[['pocao',30],['mana',30],['paoelf',14],['carne',10],['queijo',9],['maca',12],['hidromel',4],['ervas',8],['espadaelf',150],['cajado',90],['arcoelf',140],['martelo',170],['adaga',110],['runica',380],['cristal',90],['calm',20]]},
  heroi:{chance:.4,cur:'$',nomes:[['Camelô da esquina','🧺','"Tem de tudo, chefia. Até coisa de herói."'],['Inventor de garagem','🔧','Um senhor de jaleco manchado mostra protótipos que talvez funcionem.'],
      ['Vendedor do mercado clandestino','🕶️','Ele te reconhece mesmo de máscara. Mau sinal. Ou bom negócio.'],['Loja de fantasias que fecha amanhã','🎭','Liquidação total. A dona jura que nunca vendeu para um herói de verdade.']],
    pool:[['kit',800],['analg',200],['estim',600],['calm',300],['taser',1500],['bastao',1200],['gadget',6000],['radio',300],['lanterna',150],['livro',60],['binoculo',500]]},
  marte:{chance:.3,cur:'ciencia',nomes:[['Colono da Base Sul','👩‍🚀','Um rover desconhecido estaciona na porta. A Base Sul quer trocar suprimentos por dados.'],
      ['Drone de entrega da Terra','🛸','Um drone pousa com um contêiner e um painel: "Pague em dados de pesquisa".'],['Mineradora de asteroide de passagem','☄️','Uma nave de mineração faz escala. A tripulação quer amostras e dados.']],
    pool:[['liof',3],['pasta',2],['batata',2],['o2',4],['kit',4],['remendo',3],['pecas',3],['analg',2],['calm',3],['livro',1],['baralho',1],['foto',2],['radio',2]]},
};
const mercCur=(cur,n)=>cur==='ouro'?`${n} moedas`:cur==='zmat'?`${n} de sucata`:cur==='$'?fmt(n):cur==='ciencia'?`${n}% de pesquisa`:`${n} de comida`;
function mercHas(sc,cur){ return cur==='ouro'?sc.ouro||0:cur==='zmat'?sc.zmat||0:cur==='$'?S.me.money:cur==='ciencia'?sc.ciencia||0:countCat('comida'); }
function mercPay(sc,cur,n){ if(cur==='ouro') sc.ouro-=n; else if(cur==='zmat') sc.zmat-=n; else if(cur==='$') S.me.money-=n; else if(cur==='ciencia') sc.ciencia-=n; else for(let i=0;i<n;i++) takeItem('@comida'); }
function mercRoll(sc){ const M=MERC[sc.id]; sc.merc=null; if(!M||!R.chance(M.chance)) return;
  const who=R.pick(M.nomes), n=rnd(1,4), lv=sc.id==='isekai'?(sc.rota||0):0;
  const offers=R.shuffle(M.pool.slice()).slice(0,n).filter(([id])=>SCI[id]).map(([id,p])=>{ let v=Math.max(1,Math.round(p*(.8+R.f()*.45)*(1+lv*.08)));
    if(M.cur==='$') v=Math.round(v/50)*50||50; return {id,v,hp:rnd(70,100),sold:0}; });
  if(!offers.length) return;
  sc.merc={n:who[0],ic:who[1],x:who[2],cur:M.cur,dia:sc.dia,offers};
  scLog(`${who[1]} ${who[0]} apareceu oferecendo ${offers.length===1?'uma coisa':offers.length+' coisas'}. Só hoje.`,'good'); }
scNextDay=(o=>function(){ const r=o.apply(this,arguments); const sc=S.scen; if(sc&&sc.v===SC_V&&S.me.alive) mercRoll(sc); return r; })(scNextDay);
function mercBuy(sc,x){ const M=sc.merc; if(!M||x.sold) return 'Já vendido.';
  if(mercHas(sc,M.cur)<x.v) return `Não tenho ${mercCur(M.cur,x.v)}.`;
  if(sc.inv.length>=bagCap()) return 'Não tenho espaço para carregar mais nada.';
  mercPay(sc,M.cur,x.v); addItem(x.id,x.hp,true); x.sold=1; cnt('mercCompras');
  return R.pick([`Fechei negócio: ${itIc(x.id)} ${itN(x.id)} por ${mercCur(M.cur,x.v)}.`,`${M.n} embrulhou ${itN(x.id).toLowerCase()} com cuidado. Paguei ${mercCur(M.cur,x.v)}.`,`Pechinchei, perdi a pechincha e paguei ${mercCur(M.cur,x.v)} mesmo. Mas ${itN(x.id).toLowerCase()} é meu.`]); }
V.scLocal=(o=>()=>{ const r=o(), sc=S.scen; if(!sc||!sc.merc||sc.merc.dia!==sc.dia) return r; const M=sc.merc;
  const add=[{sec:`${M.ic} ${M.n}`},{html:`<div class="card"><p>${esc(M.x)}</p>${kv('Você tem',mercCur(M.cur,mercHas(sc,M.cur)))}<p style="color:var(--muted);font-size:12.5px">Comprar não gasta energia. Amanhã ele já foi embora.</p></div>`}];
  M.offers.forEach(x=>add.push({ic:itIc(x.id),l:itN(x.id),s:x.sold?'Comprado':`Conservação ${x.hp}%`,r:x.sold?'✓':mercCur(M.cur,x.v),dis:!!x.sold||mercHas(sc,M.cur)<x.v,why:x.sold?'Já comprei.':`Preciso de ${mercCur(M.cur,x.v)}.`,
    on:()=>scAct(()=>mercBuy(sc,x),M.n)}));
  r.items.splice(1,0,...add); return r; })(V.scLocal);
