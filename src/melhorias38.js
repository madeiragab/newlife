// 3.8: efeitos da rotina na virada do ano e decisões de compra com custos visíveis.
function rotina38(py){
 const fisica=Math.min(3,(py.b_walk||0)+(py.b_yoga||0)+(py.b_gym||0)+(py.b_sport||0));
 const descanso=Math.min(3,(py.b_med||0)+(py.b_yoga||0)+(py.b_spa||0));
 return {fisica,descanso,saude:Math.min(4,fisica),felicidade:Math.min(4,descanso+Math.min(2,fisica))};
}
endOfYear=(o=>function(py,ld){S.me.rotinaBem={ano:S.year,...rotina38(py)};return o.apply(this,arguments);})(endOfYear);
saudeAlvoDe=(o=>function(m){const r=m.rotinaBem;return Math.min(98,o(m)+(r?.ano===S.year?r.saude*2:0));})(saudeAlvoDe);
yearHealth=(o=>function(){const r=o.apply(this,arguments),m=S.me,b=m.rotinaBem;if(m.alive&&!S.scen&&b?.ano===S.year){bem41Medir('Rotina de exercícios e descanso',()=>{st('health',b.saude);st('happy',b.felicidade);});if(b.saude||b.felicidade)log(`Minha rotina de cuidados ajudou neste ano: saúde +${b.saude}, felicidade +${b.felicidade}.`,'good');}return r;})(yearHealth);
V.me=(o=>function(){const r=o.apply(this,arguments),b=S.me.balancoBem;if(r&&!S.me.resumo41&&b?.itens?.length)r.items.push({html:'<div class="card"><b>Último balanço de saúde e felicidade</b><p>'+b.itens.map(esc).join('<br>')+'</p><p>Atividades físicas e de descanso ajudam neste ano e na próxima virada. Doenças podem exigir tratamento.</p></div>'});return r;})(V.me);

const BUSCA38={q:'',max:0,ordem:'preco',pagina:0,comparar:[],pais:''};
function carros38Filtrar(pais,q='',max=0,ordem='preco'){
 const limpa=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const termos=limpa(q).trim().split(/\s+/).filter(Boolean);
 return v4Disponiveis(pais).map(r=>v4Oferta(r)).filter(o=>termos.every(t=>limpa(o.n).includes(t))&&(!max||o.v<=max)).sort((a,b)=>ordem==='ano'?VEIC4[b.v4].ano-VEIC4[a.v4].ano||a.v-b.v:ordem==='nome'?a.n.localeCompare(b.n):a.v-b.v);
}
function custo38(o){
 const m=S.me,entrada=Math.round(o.v*.2),saldo=Math.round((o.v-entrada)*1.3),parcela=Math.max(1500,Math.round(saldo/5));
 const copia={...m,assets:m.assets.concat({k:'carro',n:o.n,value:o.v,manut:o.manut||1})};
 const soma=l=>l.reduce((s,x)=>s+x[2],0);
 const anual=Math.max(0,soma(gastosAno(copia))-soma(gastosAno(m)));
 const renda=(m.job?jobSalary(m.job):0)+(m.ret?.pension||0)+(m.office?(OFFICES.find(x=>x.id===m.office.id)?.sal||0):0);
 const liquida=Math.round((renda-tax(renda))*diff().$),local=mercadoCusto(),casa=!!residenciaAtual(),emCasa=!S.flags.movedOut&&m.age<26&&!casa&&!people('conjuge').length&&parents().length;
 let basico=emCasa?Math.round((1800+renda*.25)*local):Math.round((casa?4500:9500)*local)+Math.round(renda*.5);
 if(m.edu.cur&&m.edu.cur.type!=='medio'&&m.age<26)basico=Math.min(basico,Math.round(3000*local));
 basico+=kids().filter(k=>k.age<18).length*Math.round(4000*local)+people('pet').reduce((s,p)=>s+(petDef(p)?.ex?1500:500),0);
 if(m.familiaEconomia?.ate>=S.year)basico=Math.round(basico*.9);
 const contas=soma(gastosAno(m))+basico+m.loans.reduce((s,l)=>s+Math.min(l.bal,l.pay),0);
 return {entrada,saldo,parcela,total:entrada+saldo,anual,renda,sobra:liquida-contas-anual-Math.min(saldo,parcela)};
}
function resumo38(o){const c=custo38(o);return `Entrada: ${fmt(c.entrada)}\nParcela: até ${fmt(c.parcela)}/ano por até 5 anos (última limitada ao saldo)\nTotal financiado com entrada e juros: ${fmt(c.total)}\nImpostos, revisão, combustível e seguro contratado: cerca de ${fmt(c.anual)}/ano\nSobra estimada da renda após estas contas, empréstimos e parcelas: ${fmt(c.sobra)}/ano\nInclui estimativas de imposto de renda, custo básico de vida e dependentes; renda variável e imprevistos podem alterar o saldo. Não é aprovação de crédito.`;}
function filtro38(k,v){if(k==='max')v=Math.max(0,Number(v)||0);BUSCA38[k]=v;BUSCA38.pagina=0;UI.draw();}
function compara38(id){if(BUSCA38.comparar.includes(id))BUSCA38.comparar=BUSCA38.comparar.filter(x=>x!==id);else if(BUSCA38.comparar.length<3)BUSCA38.comparar.push(id);else return msg('Comparar','Escolha no máximo três carros. Remova um para adicionar outro.');msg('Comparação',BUSCA38.comparar.length+' carro(s) selecionado(s). Abra Comparar carros na concessionária.');}
function verComparacao38(){const ofertas=BUSCA38.comparar.map(id=>VEIC4[id]).filter(Boolean).map(r=>v4Oferta(r));return {title:'Comparar carros',items:[{html:'<div class="card" style="overflow:auto"><table><thead><tr><th>Carro</th><th>Preço</th><th>Entrada</th><th>Parcela anual</th><th>Custos anuais estimados</th></tr></thead><tbody>'+ofertas.map(o=>{const c=custo38(o);return '<tr><td>'+esc(o.n)+'</td><td>'+fmt(o.v)+'</td><td>'+fmt(c.entrada)+'</td><td>'+fmt(c.parcela)+'</td><td>'+fmt(c.anual)+'</td></tr>';}).join('')+'</tbody></table><p>Estimativas; parcelas finais são limitadas ao saldo. Abra a ficha para detalhes.</p></div>'},...ofertas.map(o=>({l:o.n,on:()=>v4Ficha(o)})),{l:'Limpar comparação',on:()=>{BUSCA38.comparar=[];UI.back();}}]};}
v4Ficha=(o=>function(of){const modal0=modal;modal=function(conf){conf.x=(conf.x||'')+'\n\n'+resumo38(of);conf.ch.splice(conf.ch.length-1,0,{l:BUSCA38.comparar.includes(of.v4)?'Remover da comparação':'Adicionar à comparação',fn:()=>compara38(of.v4)});return modal0(conf);};try{return o.apply(this,arguments);}finally{modal=modal0;}})(v4Ficha);
V.cars=(o=>function(){const r=o.apply(this,arguments),b=BUSCA38;if(b.pais!==S.me.country){Object.assign(b,{pais:S.me.country,pagina:0,comparar:[]});}
 const form={html:`<div class="card"><label>Buscar modelo ou marca <input id="buscaCarro38" value="${esc(b.q)}" oninput="filtro38('q',this.value)" placeholder="Ex.: Corolla"></label><label>Preço máximo <input id="precoCarro38" type="number" min="0" value="${b.max||''}" onchange="filtro38('max',this.value)" placeholder="Sem limite"></label><label>Ordenar <select onchange="filtro38('ordem',this.value)">${[['preco','Menor preço'],['ano','Mais novos'],['nome','Nome']].map(([k,n])=>`<option value="${k}" ${b.ordem===k?'selected':''}>${n}</option>`).join('')}</select></label></div>`};
 const l=carros38Filtrar(S.me.country,b.q,b.max,b.ordem),page=l.slice(b.pagina*30,(b.pagina+1)*30);
 return {title:'Concessionária',items:[form,{l:`Comparar carros (${b.comparar.length}/3)`,on:()=>UI.push(verComparacao38)}, {sec:`Catálogo · ${l.length} resultados`},...page.map(v4Item),...(b.pagina?[{l:'Página anterior',on:()=>{b.pagina--;UI.draw();}}]:[]),...((b.pagina+1)*30<l.length?[{l:'Próxima página',on:()=>{b.pagina++;UI.draw();}}]:[]),...(!l.length?[{html:'<p>Nenhum carro encontrado. Altere a busca ou o preço máximo.</p>'}]:[]),...(!b.q&&!b.max?r.items:[])]};})(V.cars);

function melhorias38SelfTest(){const s0=S,meta=JSON.stringify(META),snaps=SNAPS,rf=R.f,ns=window.NO_SAVE;const ok=(v,t)=>{if(!v)throw Error(t);};try{window.NO_SAVE=true;newLife({country:'BR'});S.me.age=80;S.me.edu.cur=null;S.me.dis=[];S.me.health=50;S.me.happy=40;
 const rotina=rotina38({b_walk:3,b_med:3,b_yoga:100});ok(rotina.saude<=4&&rotina.felicidade<=4,'rotina sem limite');const base=saudeAlvoDe(S.me);S.me.rotinaBem={ano:S.year,...rotina};ok(saudeAlvoDe(S.me)>base,'cuidados não ajudam saúde na velhice');S=JSON.parse(JSON.stringify(S));ok(saudeAlvoDe(S.me)>base,'save perdeu rotina');S.year++;ok(saudeAlvoDe(S.me)===base,'rotina sem renovação virou bônus permanente');
 S.year=2025;S.me.age=30;S.me.born=1995;const l=carros38Filtrar('BR','Corolla',0,'preco');ok(l.length&&l.every(o=>/corolla/i.test(o.n)),'busca de carros');ok(!carros38Filtrar('BR','Corolla',1).length,'filtro de preço');ok(l.every((o,i)=>!i||l[i-1].v<=o.v),'ordenação');const money=S.me.money,assets=S.me.assets.length,c=custo38(l[0]);ok(c.total===c.entrada+c.saldo&&c.anual>=0,'custos inconsistentes');ok(S.me.money===money&&S.me.assets.length===assets,'simulação cobrou dinheiro');
 const m0=modal;let dialog;modal=x=>{dialog=x;};try{v4Ficha(l[0]);ok(dialog.x.includes('Total financiado')&&dialog.ch.some(c=>c.l.includes('comparação')),'ficha sem custos/comparação');}finally{modal=m0;}
 return {rotina:true,save:true,busca:true,custos:true};}finally{S=s0;META=JSON.parse(meta);SNAPS=snaps;R.f=rf;window.NO_SAVE=ns;}}
