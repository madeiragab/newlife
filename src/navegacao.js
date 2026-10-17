// Preserva as ações e confirmações existentes ao reorganizar os atalhos.
const CONFIG_ITENS=['Música','Efeitos sonoros','Dificuldade','Tema','Meus selos','Cemitério','Zerar selos e cemitério'];
const PAINEIS_PUBLICOS=['O mundo ao redor','Jornal do personagem e do mundo','Investigações e processos','Sucessão e poder'];
const menuCompleto=V.menu;
V.configuracoes=()=>{
 const itens=menuCompleto().items;
 const grupo=(titulo,nomes)=>[{sec:titulo},...nomes.map(n=>itens.find(x=>x.l===n)).filter(Boolean)];
 return {title:'Configurações',items:[
  ...grupo('Som',['Música','Efeitos sonoros']),
  ...grupo('Preferências',['Dificuldade','Tema']),
  ...grupo('Histórico de vidas',['Meus selos','Cemitério','Zerar selos e cemitério'])
 ]};
};
V.menu=()=>{
 const r=menuCompleto();
 r.items=r.items.filter(x=>!CONFIG_ITENS.includes(x.l)&&!PAINEIS_PUBLICOS.includes(x.l));
 const idx=r.items.findIndex(x=>x.l==='Como jogar');
 r.items.splice(idx<0?r.items.length:idx,0,{ic:'⚙️',l:'Configurações',s:'Som, tema, dificuldade, selos e cemitério',on:()=>UI.push(V.configuracoes)});
 return r;
};
V.activities=(o=>()=>{const r=o();r.items.push({sec:'Mundo e notícias'},
 ...(!S.scen?[{ic:'🌎',l:'O mundo ao redor',s:'Países, economia e acontecimentos sociais',on:()=>UI.push(V.mundo)}]:[]),
 {ic:'📰',l:'Jornal do personagem e do mundo',s:'Manchetes, arquivo e repercussão pública',on:()=>UI.push(V.jornal)});return r;})(V.activities);
V.career=(o=>()=>{const r=o();r.items.push({sec:'Vida pública'},
 {ic:'⚖️',l:'Investigações e processos',s:'Casos, bloqueios e decisões da Justiça',on:()=>UI.push(V.justica)},
 {ic:'🏛️',l:'Sucessão e poder',s:'Disputas e lideranças políticas, religiosas e empresariais',on:()=>UI.push(V.sucessao)});return r;})(V.career);
