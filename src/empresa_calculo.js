// Cálculo operacional puro: cenário, preços e sorteio entram explicitamente.
function empresaSetor(nome){return /tecnologia|marketing/.test(nome)?'tecnologia':/Lanchonete|Cervejaria/.test(nome)?'alimentos':/Construtora/.test(nome)?'imoveis':/aérea/.test(nome)?'industria':'servicos';}
function empresaCalcular(u,w,precos,comercio=1,bonus=0,variacao=0){
 const setor=empresaSetor(u.sector),s=w.mercados[setor];
 const tipo=setor==='tecnologia'?'servicos':setor==='imoveis'?'imoveis':setor==='industria'?'veiculos':setor;
 const limitar=(v,a,b)=>Math.max(a,Math.min(b,v));
 const receita=Math.max(0,Math.min(u.capital*1.6,u.emp*60000)*precos[tipo]*comercio*limitar(s.demanda/65,.35,1.5)*limitar(1-(s.concorrencia-50)/250,.7,1.2)*limitar(1+bonus+variacao,.65,1.3));
 const salarios=u.emp*24000*precos.salarios;
 const insumos=receita*(setor==='tecnologia'?.18:.32)*(1+(1-w.energia)*.6+(w.comercio?.custoImportacao||0)+(u.exportacao?.04:0));
 const despesas=3000*precos.servicos+u.capital*.025;
 const impostos=Math.max(0,receita-salarios-insumos-despesas)*.18;
 const custos=salarios+insumos+despesas+impostos;
 return {pais:u.country,receita,salarios,insumos,despesas,impostos,custos,lucro:receita-custos};
}
