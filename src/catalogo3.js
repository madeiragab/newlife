// ===== Catálogo de roupas (200 por gênero), uniformes de todas as profissões e trajes especiais =====
// Cada item é {nome, roupa, acess, cabelo?}; a roupa é recortada pela silhueta, então serve em qualquer tipo de corpo.
(function(){
const rng=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const pk=(r,a)=>a[Math.floor(r()*a.length)];
const P={
 neutro:['#F4F4F2','#1B1B1F','#6C757D','#ADB5BD','#E9E4D8','#3A3A40','#FFFFFF'],
 terra:['#8B5E3C','#C9A27E','#6B705C','#A5A58D','#B5838D','#7F5539','#DDA15E'],
 pastel:['#FFC8DD','#BDE0FE','#CDB4DB','#FFAFCC','#A2D2FF','#D8F3DC','#FDE2E4','#FFF1B5'],
 vivo:['#E63946','#F4A261','#2A9D8F','#264653','#E9C46A','#7B2CBF','#3A86FF','#FB5607','#06D6A0','#EF476F'],
 escuro:['#1B263B','#2B2D42','#3D405B','#22333B','#4A4E69','#5C2A3A','#283618'],
 jeans:['#3B5B8C','#2C4A73','#5B7DB1','#1F3354','#7A9CC6'],
};
const jeans=r=>({tipo:'jeans',cor:pk(r,P.jeans),padrao:'jeans'});
const estampaT=r=>r()<.35?{estampa:pk(r,['circulo','estrela','coracao','raio','logo','faixa']),corEstampa:pk(r,P.vivo.concat(P.neutro))}:{};
const padr=(r,lista,chance=.4)=>r()<chance?{padrao:pk(r,lista),cor2:pk(r,P.neutro.concat(P.pastel))}:{};
const ESTILOS=[
 {n:'Casual',f:(r,F)=>({top:Object.assign({tipo:pk(r,F?['camiseta','camisetaV','blusa','cropped','regata']:['camiseta','camisetaV','polo','regata','longa']),cor:pk(r,P.neutro.concat(P.vivo,P.pastel))},estampaT(r),padr(r,['listras','listrasFinas'],.25)),baixo:r()<.6?jeans(r):{tipo:pk(r,F?['short','saia','calca']:['bermuda','calca','short']),cor:pk(r,P.terra.concat(P.escuro)),forma:'reta',comp:4.4},sapato:{tipo:pk(r,['tenis','tenis','sapatilha','chinelo']),cor:pk(r,P.neutro.concat(P.vivo))}})},
 {n:'Esportivo',f:(r,F)=>({top:Object.assign({tipo:pk(r,F?['topEsporte','regata','camiseta','croppedRegata']:['regata','camiseta','camisaTime']),cor:pk(r,P.vivo.concat(P.neutro))},r()<.3?{estampa:'faixa',corEstampa:pk(r,P.neutro)}:{}),baixo:{tipo:pk(r,F?['legging','short','legging']:['short','jogger','bermuda']),cor:pk(r,P.escuro.concat(P.neutro)),listraLado:r()<.4?pk(r,P.vivo):null},sapato:{tipo:'tenis',cor:pk(r,P.vivo.concat(P.neutro)),meia:r()<.5},acess:r()<.3?['faixaCabelo']:r()<.3?['bone']:[]})},
 {n:'Social',f:(r,F)=>({top:{tipo:pk(r,F?['camisa','blusa','camisa']:['camisa','camisa','camisaCurta']),cor:pk(r,['#FFFFFF','#DCE7F5','#F4E1E1','#E9E4D8','#C9D6DF']),...padr(r,['listrasV','quadriculado'],.25)},baixo:F&&r()<.55?{tipo:'saia',forma:'lapis',comp:5.25,cor:pk(r,P.escuro.concat(['#6C757D']))}:{tipo:'calca',cor:pk(r,P.escuro.concat(['#6C757D','#8B5E3C']))},sapato:{tipo:F?pk(r,['salto','sapatilha']):'social',cor:pk(r,['#1B1B1F','#5A3A22','#3A2A25'])},cinto:!F||r()<.4,gravata:!F&&r()<.5?{cor:pk(r,P.vivo.concat(P.escuro)),padrao:r()<.3?'listras':null,cor2:'#F4F4F2'}:null,acess:r()<.3?['relogio']:[]})},
 {n:'Executivo',f:(r,F)=>{const c=pk(r,P.escuro.concat(['#6C757D','#1B1B1F','#5C5C66'])); return {sob:{tipo:F?pk(r,['blusa','camisa','golaAlta']):'camisa',cor:pk(r,['#FFFFFF','#DCE7F5','#F4F4F2'])},top:{tipo:'blazer',cor:c,...(r()<.2?{padrao:'xadrez',cor2:cla2(c)}:{})},baixo:F&&r()<.6?{tipo:'saia',forma:'lapis',comp:5.2,cor:c}:{tipo:'calca',cor:c},sapato:{tipo:F?'salto':'social',cor:'#1B1B1F'},gravata:F?null:{cor:pk(r,['#9B2335','#1B263B','#2A6F97','#6A4C93','#3A5A40'])},acess:F?['brincoPerola']:['relogio']}; }},
 {n:'Festa',f:(r,F)=>F?{vestido:{cor:pk(r,P.vivo.concat(['#1B1B1F','#C0A062','#5C2A3A'])),alca:pk(r,['alcinha','tomara','regata','curtinha']),forma:pk(r,['lapis','rodada','sereia','reta']),comp:pk(r,[4.6,5.2,7.1]),...padr(r,['paete'],.35)},sapato:{tipo:'salto',cor:pk(r,['#1B1B1F','#C0A062','#E63946'])},acess:[pk(r,['brinco','argola','brincoPerola']),pk(r,['colar','perolas','gargantilha'])],batom:pk(r,['#9E2A3A','#C1121F','#B5838D'])}:{sob:{tipo:'camisa',cor:pk(r,['#FFFFFF','#1B1B1F','#DCE7F5'])},top:{tipo:'blazer',cor:pk(r,['#1B1B1F','#1B263B','#5C2A3A','#F4F4F2','#2B2D42'])},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'social',cor:'#1B1B1F'},borboleta:r()<.5?'#1B1B1F':null,acess:['relogio']}},
 {n:'Praia',f:(r,F)=>({top:F?{tipo:pk(r,['alcinha','croppedRegata','tomara','regata']),cor:pk(r,P.vivo.concat(P.pastel)),...padr(r,['tropical','listras','floral'],.5)}:{tipo:pk(r,['camisaAberta','regata','camiseta']),cor:pk(r,P.vivo.concat(P.pastel)),...padr(r,['tropical','floral','listras'],.6)},baixo:{tipo:F?pk(r,['shortinho','short','saia']):pk(r,['bermuda','short']),cor:pk(r,P.vivo.concat(P.jeans,P.neutro)),forma:'rodada',comp:4.6,...padr(r,['tropical','listras'],.25)},sapato:{tipo:pk(r,['chinelo','sandalia']),cor:pk(r,P.vivo)},acess:[r()<.6?pk(r,['oculosSol','oculosAviador']):null,r()<.5?(F?'chapeuPraia':pk(r,['bucket','bone','chapeuPalha'])):null].filter(Boolean)})},
 {n:'Inverno',f:(r,F)=>({sob:{tipo:pk(r,['sueter','golaAlta','moletom']),cor:pk(r,P.terra.concat(P.escuro,P.neutro)),...padr(r,['trico','listras'],.4)},top:r()<.6?{tipo:pk(r,['jaqueta','sobretudo','jaquetaCouro']),cor:pk(r,P.escuro.concat(P.terra,['#1B1B1F']))}:null,baixo:r()<.5?jeans(r):{tipo:'calca',cor:pk(r,P.escuro.concat(P.terra))},sapato:{tipo:pk(r,['bota','botaNeve','coturno',F?'botaCano':'bota']),cor:pk(r,['#5A3A22','#1B1B1F','#8B5E3C'])},meiaCalca:F&&r()<.2?'#1B1B1F':null,acess:[r()<.5?'gorro':null,r()<.5?'cachecol':null].filter(Boolean),corCachecol:pk(r,P.vivo),padraoCachecol:r()<.4?'listras':null,corChapeu:pk(r,P.vivo.concat(P.escuro))})},
 {n:'Street',f:(r,F)=>({top:Object.assign({tipo:pk(r,['moletom','camiseta','moletomZiper','longa']),cor:pk(r,P.neutro.concat(P.vivo,P.escuro))},estampaT(r),r()<.25?{padrao:'camuflado',cor:'#6B705C',cor2:'#A5A58D',cor3:'#3A3A2A'}:{}),baixo:{tipo:pk(r,['cargo','jogger','jeans']),cor:pk(r,P.escuro.concat(P.terra,P.neutro))},sapato:{tipo:'tenis',cor:pk(r,P.neutro.concat(P.vivo)),sola:pk(r,['#F4F4F2','#1B1B1F'])},acess:[r()<.5?pk(r,['bone','boneTras','gorro']):null,r()<.4?'corrente':null,r()<.3?'fones':null].filter(Boolean),corChapeu:pk(r,P.vivo.concat(P.neutro))})},
 {n:'Rock',f:(r,F)=>({sob:{tipo:pk(r,['camiseta','regata']),cor:pk(r,['#1B1B1F','#3A3A40','#5C2A3A']),estampa:pk(r,['caveira','raio','estrela']),corEstampa:'#E9E4D8'},top:r()<.7?{tipo:'jaquetaCouro'}:null,baixo:F&&r()<.4?{tipo:'saia',forma:'reta',comp:4.4,cor:'#1B1B1F',padrao:r()<.5?'xadrez':null,cor2:'#C1121F'}:{tipo:'jeans',cor:pk(r,['#1B1B1F','#3A3A40','#2C4A73']),padrao:'jeans'},meiaCalca:F&&r()<.5?'#1B1B1F':null,sapato:{tipo:'coturno',cor:'#1B1B1F'},acess:[pk(r,['corrente','gargantilha','argola']),r()<.3?'piercingNariz':null].filter(Boolean),cinto:true})},
 {n:'Gótico',f:(r,F)=>F?{vestido:{cor:pk(r,['#1B1B1F','#2B1B2E','#3A0D1A']),alca:pk(r,['longa','tomara','regata']),forma:pk(r,['gode','sereia','rodada']),comp:pk(r,[5.0,7.1])},sapato:{tipo:pk(r,['coturno','botaCano']),cor:'#1B1B1F'},acess:['gargantilha'],batom:'#4A0E1F',maquiagem:'#2B1B2E'}:{sob:{tipo:'golaAlta',cor:'#1B1B1F'},top:{tipo:'sobretudo',cor:pk(r,['#1B1B1F','#2B1B2E'])},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'coturno',cor:'#1B1B1F'},acess:['crucifixo']}},
 {n:'Boho',f:(r,F)=>F?{top:{tipo:pk(r,['bata','blusa']),cor:pk(r,P.terra.concat(P.pastel,['#F4F4F2'])),...padr(r,['floral','geometrico'],.6)},baixo:{tipo:'saia',forma:'gode',comp:pk(r,[5.2,7.0]),cor:pk(r,P.terra.concat(P.vivo)),...padr(r,['floral'],.3)},sapato:{tipo:'sandalia',cor:'#8B5E3C'},acess:[r()<.4?'coroaFlores':null,'argola',r()<.3?'chapeuPalha':null].filter(Boolean)}:{top:{tipo:pk(r,['bata','camisaAberta']),cor:pk(r,P.terra.concat(['#F4F4F2'])),...padr(r,['geometrico','floral'],.4)},baixo:{tipo:pk(r,['calca','bermuda']),cor:pk(r,P.terra)},sapato:{tipo:'sandalia',cor:'#8B5E3C'},acess:[r()<.4?'fedora':null,'colar'].filter(Boolean)}},
 {n:'Country',f:(r,F)=>({top:{tipo:pk(r,['camisa','camisaCurta']),cor:pk(r,['#C1121F','#2A6F97','#3A5A40','#6A4C93','#8B5E3C']),padrao:'xadrez',cor2:'#F4F4F2'},baixo:F&&r()<.3?{tipo:'saia',forma:'rodada',comp:5.2,cor:pk(r,P.jeans),padrao:'jeans'}:jeans(r),sapato:{tipo:pk(r,['bota','botaCano']),cor:pk(r,['#8B5E3C','#5A3A22'])},cinto:true,acess:r()<.6?['cowboy']:[],corChapeu:pk(r,['#8B5E3C','#C9A27E','#1B1B1F'])})},
 {n:'Romântico',f:(r,F)=>F?{vestido:{cor:pk(r,P.pastel.concat(['#F4F4F2','#E63946'])),alca:pk(r,['curtinha','alcinha','curta']),forma:pk(r,['rodada','gode']),comp:pk(r,[4.8,5.3,5.6]),...padr(r,['floral','bolinhas','coracoes','quadriculado'],.75)},sapato:{tipo:'sapatilha',cor:pk(r,P.pastel.concat(['#F4F4F2']))},acess:[r()<.5?'brincoPerola':'brinco'],cabeloX:'laco'}:{top:{tipo:pk(r,['camisa','polo']),cor:pk(r,P.pastel),...padr(r,['quadriculado','listrasFinas'],.4)},baixo:{tipo:'calca',cor:pk(r,['#E9E4D8','#C9A27E','#1B263B'])},sapato:{tipo:'social',cor:'#8B5E3C'},cinto:true}},
 {n:'Vintage',f:(r,F)=>F?{vestido:{cor:pk(r,['#E63946','#2A6F97','#1B1B1F','#F4A261','#2A9D8F']),alca:'curtinha',forma:'gode',comp:5.4,padrao:pk(r,['bolinhas','quadriculado','liso']),cor2:'#F4F4F2'},cinto:'#1B1B1F',lenco:r()<.5?pk(r,P.vivo):null,sapato:{tipo:'salto',cor:'#1B1B1F'},acess:['perolas','oculosGatinho'].filter(()=>r()<.6),batom:'#C1121F'}:{top:{tipo:'camisa',cor:pk(r,['#F4F4F2','#E9E4D8','#DCE7F5'])},baixo:{tipo:'calca',cor:pk(r,['#6B705C','#7F5539','#3D405B'])},suspensorio:pk(r,['#7F5539','#1B1B1F','#9B2335']),borboleta:r()<.5?pk(r,['#9B2335','#1B263B']):null,sapato:{tipo:'social',cor:'#5A3A22'},acess:[pk(r,['boina','fedora','oculosRedondo'])],corChapeu:pk(r,['#6B705C','#3D405B','#7F5539'])}},
 {n:'Preppy',f:(r,F)=>({sob:{tipo:pk(r,['camisa','polo']),cor:pk(r,['#FFFFFF','#DCE7F5','#F4E1E1'])},top:r()<.6?{tipo:pk(r,['cardigan','sueter']),cor:pk(r,['#1B263B','#9B2335','#3A5A40','#E9E4D8','#F4A261']),...padr(r,['trico'],.4)}:null,baixo:F&&r()<.5?{tipo:'saia',forma:'reta',comp:4.6,cor:pk(r,['#1B263B','#9B2335','#3A5A40']),padrao:'xadrez',cor2:'#E9C46A'}:{tipo:pk(r,['calca','bermuda']),cor:pk(r,['#E9E4D8','#C9A27E','#1B263B'])},sapato:{tipo:pk(r,['social','sapatilha','tenis']),cor:pk(r,['#5A3A22','#1B263B','#F4F4F2']),meia:F&&r()<.5?'#F4F4F2':null,meiaAlta:true}})},
 {n:'Verão',f:(r,F)=>({top:{tipo:pk(r,F?['alcinha','cropped','tomara','blusa']:['camiseta','regata','camisaCurta']),cor:pk(r,P.vivo.concat(P.pastel,['#FFFFFF'])),...padr(r,['listras','floral','bolinhas','tropical'],.45)},baixo:{tipo:F?pk(r,['shortinho','short','saia']):pk(r,['bermuda','short']),forma:'rodada',comp:4.5,cor:pk(r,P.jeans.concat(['#FFFFFF','#E9E4D8'],P.pastel)),padrao:r()<.3?'jeans':null},sapato:{tipo:pk(r,['sandalia','chinelo','tenis']),cor:pk(r,P.neutro.concat(P.vivo))},acess:r()<.4?[pk(r,['oculosSol','oculosGatinho','oculosAviador'])]:[]})},
 {n:'Macacão',f:(r,F)=>F&&r()<.5?{top:{tipo:'macacao',gola:pk(r,['alcinha','v','regata']),manga:'nenhuma',ziper:false,bolsos2:false,cor:pk(r,P.vivo.concat(P.terra,P.escuro)),...padr(r,['floral','listras','bolinhas'],.35)},sapato:{tipo:pk(r,['salto','sandalia','tenis']),cor:pk(r,P.neutro)},cinto:true}:{sob:{tipo:pk(r,['camiseta','longa','listras']),cor:pk(r,P.neutro.concat(P.vivo)),...padr(r,['listras'],.4)},baixo:{tipo:F?'jeans':'calca',cor:pk(r,P.jeans),padrao:'jeans'},jardineira:true,sapato:{tipo:'tenis',cor:pk(r,P.neutro.concat(P.vivo))}}},
 {n:'Pijama',f:(r,F)=>{const c=pk(r,P.pastel.concat(['#1B263B','#9B2335'])), p=pk(r,['listras','bolinhas','estrelas','quadriculado','coracoes','liso']); return {top:{tipo:'pijama',cor:c,padrao:p,cor2:'#FFFFFF'},baixo:{tipo:F&&r()<.4?'short':'calca',cor:c,padrao:p,cor2:'#FFFFFF'},sapato:{tipo:'chinelo',cor:pk(r,P.pastel)}}; }},
];
function cla2(c){ const h=c.replace('#',''); const v=[0,2,4].map(i=>Math.min(255,parseInt(h.slice(i,i+2),16)+60)); return '#'+v.map(x=>x.toString(16).padStart(2,'0')).join(''); }
function gera(sexo,n=200){ const F=sexo==='F', out=[], cont={}; const r=rng(F?777:4242);
 for(let i=0;out.length<n;i++){ const e=ESTILOS[i%ESTILOS.length]; const o=e.f(r,F); if(!o) continue;
  const roupa=Object.assign({},o); const acess=(roupa.acess||[]).slice(); delete roupa.acess;
  const extra={}; for(const k of ['corChapeu','corCachecol','padraoCachecol','batom','maquiagem','cabeloX']) if(roupa[k]!==undefined){ if(roupa[k]!=null) extra[k]=roupa[k]; delete roupa[k]; }
  for(const k of Object.keys(roupa)) if(roupa[k]==null) delete roupa[k];
  cont[e.n]=(cont[e.n]||0)+1; out.push(Object.assign({id:`${F?'f':'m'}${out.length+1}`,nome:`${e.n} ${cont[e.n]}`,estilo:e.n,roupa,acess},extra)); }
 return out; }
window.ROUPAS={M:gera('M'),F:gera('F'),estilos:ESTILOS.map(e=>e.n)};

// ===== uniformes: um por profissão (ids de data.js, cursos.js e formacao.js) + trajes especiais
const U={}, def=(ids,fn)=>ids.split(' ').forEach(i=>U[i]=fn);
const terno=(cor,gr,F)=>({sob:{tipo:F?'blusa':'camisa',cor:'#FFFFFF',gola:F?'v':undefined},top:{tipo:'blazer',cor},baixo:F?{tipo:'saia',forma:'lapis',comp:5.2,cor}:{tipo:'calca',cor},sapato:{tipo:F?'salto':'social',cor:'#1B1B1F'},gravata:F?null:gr});
const jaleco=(F,sob,ac=[])=>({roupa:{sob:sob||{tipo:F?'blusa':'camisa',cor:'#DCE7F5'},sobre:{tipo:'jaleco'},baixo:{tipo:'calca',cor:'#3D405B'},sapato:{tipo:'social',cor:'#1B1B1F'}},acess:ac});
const scrub=(cor,ac=[])=>({roupa:{top:{tipo:'scrub',cor},baixo:{tipo:'calca',cor},sapato:{tipo:'tenis',cor:'#F4F4F2'}},acess:['cracha',...ac]});
const polo=(cor,baixoCor='#1B263B',ac=['cracha'])=>({roupa:{top:{tipo:'polo',cor,estampa:'logo',estampaPeito:true,corEstampa:'#F4F4F2'},baixo:{tipo:'calca',cor:baixoCor},sapato:{tipo:'tenis',cor:'#1B1B1F'}},acess:ac});
def('obra',F=>({roupa:{top:{tipo:'camiseta',cor:'#E9E4D8'},colete:{tipo:'coleteRefletivo'},baixo:{tipo:'jeans',cor:'#3B5B8C',padrao:'jeans'},sapato:{tipo:'bota',cor:'#6B4226'},luvas:'#C9A27E'},acess:['capaceteObra']}));
def('mobra tseg engst',F=>({roupa:{top:{tipo:'camisa',cor:'#DCE7F5'},colete:{tipo:'coleteRefletivo',cor:'#C6E03A'},baixo:{tipo:'calca',cor:'#3D405B'},sapato:{tipo:'bota',cor:'#5A3A22'}},acess:['capaceteObra','prancheta'],corChapeu:'#F4F4F2'}));
def('engr aeng',F=>({roupa:{top:{tipo:'camisa',cor:'#DCE7F5'},baixo:{tipo:'calca',cor:'#3D405B'},sapato:{tipo:'social',cor:'#5A3A22'}},acess:['capaceteObra','prancheta'],corChapeu:'#F4F4F2'}));
def('limp',F=>({roupa:{top:{tipo:'fardaCurta',cor:'#5FA8D3',bolsos2:false},baixo:{tipo:'calca',cor:'#5FA8D3'},sapato:{tipo:'galocha',cor:'#F4F4F2'},luvas:'#F4C430'},acess:['vassoura']}));
def('entr',F=>({roupa:{top:{tipo:'camiseta',cor:'#E63946',estampa:'logo',estampaPeito:true},baixo:{tipo:'bermuda',cor:'#1B1B1F'},sapato:{tipo:'tenis',cor:'#1B1B1F'}},acess:['bone','mochila'],corChapeu:'#E63946',corMochila:'#E63946'}));
def('lanch',F=>({roupa:{top:{tipo:'camiseta',cor:'#F4A261'},avental:{cor:'#9B2335',curto:true},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'tenis',cor:'#1B1B1F'}},acess:['viseira','cracha'],corChapeu:'#F4A261'}));
def('sorv',F=>({roupa:{top:{tipo:'camiseta',cor:'#FFFFFF'},avental:{cor:'#FFC8DD',padrao:'listrasV',cor2:'#FFFFFF'},baixo:{tipo:'calca',cor:'#BDE0FE'},sapato:{tipo:'tenis',cor:'#F4F4F2'}},acess:['bone'],corChapeu:'#FFC8DD'}));
def('garc somm',F=>({roupa:{sob:{tipo:'camisa',cor:'#FFFFFF'},colete:{cor:'#1B1B1F'},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'social',cor:'#1B1B1F'},borboleta:'#1B1B1F',avental:F?null:{cor:'#1B1B1F',curto:true}}}));
def('fren',F=>polo('#1F7A3A','#1B263B',['bone']));
def('repo',F=>polo('#E63946'));
def('caixa',F=>polo('#F4C430','#1B263B'));
def('vend',F=>polo('#3A86FF','#1B1B1F'));
def('apr',F=>polo('#2A9D8F','#1B263B'));
def('tlog',F=>({roupa:{top:{tipo:'polo',cor:'#3D405B'},colete:{tipo:'coleteRefletivo',cor:'#C6E03A'},baixo:{tipo:'calca',cor:'#1B263B'},sapato:{tipo:'bota',cor:'#1B1B1F'}},acess:['cracha','prancheta']}));
def('fabr',F=>({roupa:{top:{tipo:'macacao',cor:'#2C4A73'},sapato:{tipo:'bota',cor:'#1B1B1F'},luvas:'#C9A27E'},acess:['capaceteObra','oculosProtecao'],corChapeu:'#F4F4F2'}));
def('petr',F=>({roupa:{top:{tipo:'macacao',cor:'#FB5607',refletivo:true},sapato:{tipo:'bota',cor:'#1B1B1F'},luvas:'#C9A27E'},acess:['capaceteObra','oculosProtecao'],corChapeu:'#F4F4F2'}));
def('agri tagr',F=>({roupa:{top:{tipo:'camisa',cor:'#3A5A40',padrao:'xadrez',cor2:'#E9E4D8'},baixo:{tipo:'jeans',cor:'#3B5B8C',padrao:'jeans'},sapato:{tipo:'bota',cor:'#6B4226'},cinto:true},acess:['chapeuPalha']}));
def('zoot',F=>({roupa:{top:{tipo:'camisa',cor:'#8B5E3C',padrao:'xadrez',cor2:'#E9E4D8'},baixo:{tipo:'jeans',cor:'#3B5B8C',padrao:'jeans'},sapato:{tipo:'galocha',cor:'#3A5A40'}},acess:['bone'],corChapeu:'#3A5A40'}));
def('pesc',F=>({roupa:{top:{tipo:'camiseta',cor:'#E9E4D8'},colete:{cor:'#6B705C',bolsos2:true},baixo:{tipo:'cargo',cor:'#A5A58D'},sapato:{tipo:'galocha',cor:'#F4C430'}},acess:['bucket'],corChapeu:'#6B705C'}));
def('ambi',F=>({roupa:{top:{tipo:'camisaCurta',cor:'#A5A58D'},colete:{cor:'#3A5A40'},baixo:{tipo:'cargo',cor:'#6B705C'},sapato:{tipo:'bota',cor:'#6B4226'}},acess:['bucket','prancheta'],corChapeu:'#A5A58D'}));
def('arqc',F=>({roupa:{top:{tipo:'camisaCurta',cor:'#C9A27E',bolsos2:true},baixo:{tipo:'cargo',cor:'#7F5539'},sapato:{tipo:'bota',cor:'#6B4226'}},acess:['fedora'],corChapeu:'#A47148'}));
def('seg',F=>({roupa:{top:{tipo:'fardaCurta',cor:'#1B1B1F'},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'coturno',cor:'#1B1B1F'},cinto:true},acess:['cracha','headset']}));
def('port',F=>({roupa:{top:{tipo:'camisa',cor:'#A2D2FF'},baixo:{tipo:'calca',cor:'#1B263B'},sapato:{tipo:'social',cor:'#1B1B1F'},gravata:{cor:'#1B263B'}},acess:['cracha']}));
def('cabe',F=>({roupa:{top:{tipo:'camiseta',cor:'#1B1B1F'},avental:{cor:'#1B1B1F'},baixo:{tipo:'jeans',cor:'#1B1B1F',padrao:'jeans'},sapato:{tipo:'tenis',cor:'#F4F4F2'}}}));
def('app',F=>({roupa:{top:{tipo:'polo',cor:'#1B263B'},baixo:{tipo:'jeans',cor:'#2C4A73',padrao:'jeans'},sapato:{tipo:'tenis',cor:'#1B1B1F'}},acess:['oculosSol']}));
def('cami',F=>({roupa:{top:{tipo:'camisaCurta',cor:'#9B2335',padrao:'xadrez',cor2:'#1B1B1F'},baixo:{tipo:'jeans',cor:'#3B5B8C',padrao:'jeans'},sapato:{tipo:'bota',cor:'#6B4226'},cinto:true},acess:['bone'],corChapeu:'#F4F4F2'}));
def('recep assad aux sec',F=>({roupa:terno('#1B263B',{cor:'#2A6F97'},F),acess:['cracha']}));
def('tele ctrl',F=>({roupa:{top:{tipo:'camisa',cor:'#DCE7F5'},baixo:{tipo:'calca',cor:'#3D405B'},sapato:{tipo:'social',cor:'#1B1B1F'}},acess:['headset','cracha']}));
def('cart',F=>({roupa:{top:{tipo:'camisaCurta',cor:'#F4C430',estampa:'logo',estampaPeito:true,corEstampa:'#1B4E9B'},baixo:{tipo:'bermuda',cor:'#1B4E9B'},sapato:{tipo:'tenis',cor:'#1B1B1F'}},acess:['bone','bolsa'],corChapeu:'#1B4E9B',corBolsa:'#1B4E9B'}));
def('bomb',F=>({roupa:{top:{tipo:'jaqueta',cor:'#B5651D',aberto:false,ziper:true,refletivo:true},baixo:{tipo:'calca',cor:'#B5651D',refletivo:true},sapato:{tipo:'bota',cor:'#1B1B1F'},luvas:'#1B1B1F'},acess:['capaceteBombeiro']}));
def('poli',F=>({roupa:{top:{tipo:'farda',cor:'#1B263B',distintivo:true},baixo:{tipo:'calca',cor:'#1B263B'},sapato:{tipo:'coturno',cor:'#1B1B1F'},cinto:'#1B1B1F'},acess:['quepe']}));
def('peri perju',F=>({roupa:{top:{tipo:'fardaCurta',cor:'#1B1B1F',estampa:'faixa',corEstampa:'#E9C46A'},baixo:{tipo:'cargo',cor:'#1B1B1F'},sapato:{tipo:'coturno',cor:'#1B1B1F'},luvas:'#6A4C93'},acess:['bone','cracha'],corChapeu:'#1B1B1F'}));
def('coz chefc',F=>({roupa:{top:{tipo:'dolma'},avental:{cor:'#F4F4F2'},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'tenis',cor:'#1B1B1F'}},acess:['toucaCozinha']}));
def('chef',F=>({roupa:{top:{tipo:'dolma'},avental:{cor:'#1B1B1F',curto:true},baixo:{tipo:'calca',cor:'#1B1B1F',padrao:'quadriculado',cor2:'#F4F4F2'},sapato:{tipo:'social',cor:'#1B1B1F'}},acess:['toqueChef']}));
def('mecan',F=>({roupa:{top:{tipo:'macacao',cor:'#3D5A80'},sapato:{tipo:'bota',cor:'#1B1B1F'}},acess:['bone'],corChapeu:'#C1121F'}));
def('taer',F=>({roupa:{top:{tipo:'macacao',cor:'#C9A27E',refletivo:true},sapato:{tipo:'bota',cor:'#1B1B1F'}},acess:['fones','oculosProtecao'],corChapeu:'#FB5607'}));
def('elet',F=>({roupa:{top:{tipo:'fardaCurta',cor:'#3A86FF'},baixo:{tipo:'calca',cor:'#1B263B'},sapato:{tipo:'bota',cor:'#1B1B1F'},cinto:'#3A2A20',cintoFerramentas:true,luvas:'#F4C430'},acess:['capaceteObra'],corChapeu:'#3A86FF'}));
def('tenf enfe trad',F=>scrub('#2A6F97',['estetoscopio']));
def('enfu enfob',F=>scrub('#2A9D8F',['estetoscopio']));
def('tti',F=>polo('#22333B','#2C4A73'));
def('este',F=>({roupa:{top:{tipo:'scrub',cor:'#FFC8DD'},baixo:{tipo:'calca',cor:'#F4F4F2'},sapato:{tipo:'tenis',cor:'#F4F4F2'}},acess:['cracha']}));
def('adv tribu dipl audi afisc',F=>({roupa:terno('#22333B',{cor:'#5C2A3A'},F),acess:['relogio','maleta']}));
def('juiz promo',F=>({roupa:{sob:{tipo:'camisa',cor:'#FFFFFF'},sobre:{tipo:'toga',cor:'#1B1B1F'},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'social',cor:'#1B1B1F'},gravata:{cor:'#1B1B1F'}}}));
def('medi neuro psiq derma',F=>jaleco(F,null,['estetoscopio','cracha']));
def('pedia',F=>jaleco(F,{tipo:'scrub',cor:'#FFAFCC',padrao:'estrelas',cor2:'#FFFFFF'},['estetoscopio','cracha']));
def('ciru',F=>({roupa:{top:{tipo:'scrub',cor:'#4C9A8C'},baixo:{tipo:'calca',cor:'#4C9A8C'},sapato:{tipo:'tenis',cor:'#F4F4F2'},luvas:'#BDE0FE'},acess:['toucaCirurgica','mascara']}));
def('dent orto impl',F=>({roupa:{sob:{tipo:'scrub',cor:'#A2D2FF'},sobre:{tipo:'jaleco'},baixo:{tipo:'calca',cor:'#F4F4F2'},sapato:{tipo:'tenis',cor:'#F4F4F2'}},acess:['mascara','toucaCirurgica'],corChapeu:'#A2D2FF'}));
def('farm fari',F=>jaleco(F,{tipo:'camisa',cor:'#F4F4F2'},['cracha']));
def('vete',F=>scrub('#3A5A40',['estetoscopio']));
def('biol quim cien bioq tlab',F=>Object.assign(jaleco(F,{tipo:'camiseta',cor:'#3D405B'},['oculosProtecao']),{}));
def('prog dado ia',F=>({roupa:{top:{tipo:'moletom',cor:'#2B2D42'},baixo:{tipo:'jeans',cor:'#2C4A73',padrao:'jeans'},sapato:{tipo:'tenis',cor:'#F4F4F2'}},acess:['oculos']}));
def('game',F=>({roupa:{top:{tipo:'camiseta',cor:'#7B2CBF',estampa:'raio',corEstampa:'#06D6A0'},baixo:{tipo:'jeans',cor:'#1F3354',padrao:'jeans'},sapato:{tipo:'tenis',cor:'#1B1B1F'}},acess:['fones']}));
def('psic npsi psio',F=>({roupa:{sob:{tipo:F?'blusa':'camisa',cor:'#E9E4D8'},top:{tipo:'cardigan',cor:'#6B705C'},baixo:{tipo:'calca',cor:'#7F5539'},sapato:{tipo:'social',cor:'#5A3A22'}},acess:['oculosRedondo']}));
def('arqu urb',F=>({roupa:{sob:{tipo:'golaAlta',cor:'#1B1B1F'},top:{tipo:'blazer',cor:'#6C757D'},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'social',cor:'#1B1B1F'}},acess:['oculos','prancheta']}));
def('jorn',F=>({roupa:{sob:{tipo:'camiseta',cor:'#F4F4F2'},top:{tipo:'blazer',cor:'#2A6F97'},baixo:{tipo:'jeans',cor:'#1F3354',padrao:'jeans'},sapato:{tipo:'social',cor:'#5A3A22'}},acess:['microfone','cracha']}));
def('impr publ mkt',F=>({roupa:{sob:{tipo:'camiseta',cor:'#F4F4F2'},top:{tipo:'blazer',cor:'#B5838D'},baixo:{tipo:'jeans',cor:'#3B5B8C',padrao:'jeans'},sapato:{tipo:'tenis',cor:'#F4F4F2'}},acess:['cracha']}));
def('apres',F=>({roupa:Object.assign(terno('#7B2CBF',{cor:'#E9C46A'},F),{}),acess:['microfone']}));
def('prof pedg hist pmus',F=>({roupa:{sob:{tipo:'camisa',cor:'#DCE7F5'},top:{tipo:'sueter',cor:'#9B2335',gola:'v',vFundo:1.7},baixo:{tipo:'calca',cor:'#6B705C'},sapato:{tipo:'social',cor:'#5A3A22'}},acess:['oculos','prancheta']}));
def('univ psub fisp astf peco',F=>({roupa:{sob:{tipo:'camisa',cor:'#F4F4F2'},top:{tipo:'blazer',cor:'#7F5539',padrao:'xadrez',cor2:'#A47148'},baixo:{tipo:'calca',cor:'#3D405B'},sapato:{tipo:'social',cor:'#5A3A22'}},acess:['oculosRedondo']}));
def('cont acont econ gproj cext',F=>({roupa:{top:{tipo:'camisa',cor:'#F4F4F2'},baixo:F?{tipo:'saia',forma:'lapis',comp:5.2,cor:'#3D405B'}:{tipo:'calca',cor:'#3D405B'},sapato:{tipo:F?'salto':'social',cor:'#1B1B1F'},gravata:F?null:{cor:'#2A6F97',padrao:'listras',cor2:'#DCE7F5'},cinto:!F},acess:['oculos','cracha']}));
def('fina cfo exec emp ghosp',F=>({roupa:terno('#1B1B1F',{cor:'#9B2335'},F),acess:['relogio','maleta']}));
def('desg tdes ilus rote',F=>({roupa:{top:{tipo:'camiseta',cor:'#1B1B1F'},baixo:{tipo:'jeans',cor:'#1B1B1F',padrao:'jeans'},sapato:{tipo:'tenis',cor:'#F4F4F2'},avental:null},acess:['oculos','gorro'],corChapeu:'#E9C46A'}));
def('ilus',F=>({roupa:{top:{tipo:'camiseta',cor:'#F4F4F2'},avental:{cor:'#E9E4D8',padrao:'bolinhas',cor2:'#3A86FF'},baixo:{tipo:'jeans',cor:'#3B5B8C',padrao:'jeans'},sapato:{tipo:'tenis',cor:'#E63946'}},acess:['boina'],corChapeu:'#1B1B1F'}));
def('cura',F=>({roupa:{sob:{tipo:'golaAlta',cor:'#E9E4D8'},top:{tipo:'blazer',cor:'#3D405B'},baixo:{tipo:'calca',cor:'#3D405B'},sapato:{tipo:'social',cor:'#1B1B1F'}},acess:['oculosRedondo']}));
def('esti prmd',F=>F?{roupa:{vestido:{cor:'#1B1B1F',alca:'longa',forma:'lapis',comp:5.2},sapato:{tipo:'salto',cor:'#1B1B1F'},cinto:'#C0A062'},acess:['oculosSol','argola']}:{roupa:{sob:{tipo:'golaAlta',cor:'#1B1B1F'},top:{tipo:'sobretudo',cor:'#C9A27E'},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'coturno',cor:'#1B1B1F'}},acess:['oculosSol']});
def('pers nutri',F=>({roupa:{top:{tipo:F?'topEsporte':'regata',cor:'#06D6A0'},baixo:{tipo:F?'legging':'short',cor:'#1B1B1F'},sapato:{tipo:'tenis',cor:'#F4F4F2',meia:true}},acess:['apito']}));
def('trei',F=>({roupa:{top:{tipo:'moletomZiper',cor:'#1B4E9B',capuz:false},baixo:{tipo:'jogger',cor:'#1B4E9B',listraLado:'#F4F4F2'},sapato:{tipo:'tenis',cor:'#F4F4F2'}},acess:['apito','bone'],corChapeu:'#1B4E9B'}));
def('pilo',F=>({roupa:{top:{tipo:'camisaCurta',cor:'#FFFFFF'},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'social',cor:'#1B1B1F'},gravata:{cor:'#1B1B1F'},dragonas:'#1B1B1F'},acess:['quepePiloto','oculosAviador']}));
def('aero',F=>({roupa:Object.assign(terno('#1B263B',{cor:'#C1121F'},F),{lenco:F?'#C1121F':null}),acess:F?['brincoPerola']:[],cabelo:F?'coque':undefined}));
def('astr',F=>({roupa:{top:{tipo:'trajeEspacial',estampa:'circulo',estampaPeito:true,corEstampa:'#1B4E9B'},sapato:{tipo:'botaNeve',cor:'#F4F4F2',pelo:'#C9CED6'},luvas:'#F4F4F2',intima:false},acess:['capaceteAstronauta']}));
def('baba',F=>({roupa:{top:{tipo:'camiseta',cor:'#BDE0FE'},avental:{cor:'#FFC8DD',padrao:'bolinhas',cor2:'#FFFFFF',curto:true},baixo:{tipo:'jeans',cor:'#5B7DB1',padrao:'jeans'},sapato:{tipo:'tenis',cor:'#F4F4F2'}}}));
def('pass',F=>({roupa:{top:{tipo:'camiseta',cor:'#2A9D8F'},baixo:{tipo:'bermuda',cor:'#A5A58D'},sapato:{tipo:'tenis',cor:'#F4F4F2',meia:true}},acess:['bone','oculosSol'],corChapeu:'#2A9D8F'}));
def('lava',F=>({roupa:{top:{tipo:'regata',cor:'#3A86FF'},baixo:{tipo:'bermuda',cor:'#1B1B1F'},sapato:{tipo:'galocha',cor:'#1B1B1F'},luvas:'#F4C430'},acess:['bone'],corChapeu:'#3A86FF'}));
def('salv',F=>({roupa:{top:{tipo:F?'croppedRegata':'regata',cor:'#E63946',estampa:'faixa',corEstampa:'#F4F4F2'},baixo:{tipo:'short',cor:'#E63946'},sapato:{tipo:'descalco'}},acess:['apito','viseira','oculosSol'],corChapeu:'#F4C430'}));
def('mon',F=>({roupa:{top:{tipo:'camiseta',cor:'#F4A261',estampa:'estrela',estampaPeito:true,corEstampa:'#F4F4F2'},baixo:{tipo:'bermuda',cor:'#3D405B'},sapato:{tipo:'tenis',cor:'#F4F4F2'}},acess:['cracha','apito']}));
def('orq',F=>({roupa:F?{vestido:{cor:'#1B1B1F',alca:'longa',forma:'reta',comp:7.1},sapato:{tipo:'salto',cor:'#1B1B1F'}}:{sob:{tipo:'camisa',cor:'#FFFFFF'},top:{tipo:'blazer',cor:'#1B1B1F'},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'social',cor:'#1B1B1F'},borboleta:'#1B1B1F'},acess:[]}));
def('prodm',F=>({roupa:{top:{tipo:'camiseta',cor:'#22333B',estampa:'raio',corEstampa:'#E9C46A'},baixo:{tipo:'cargo',cor:'#1B1B1F'},sapato:{tipo:'tenis',cor:'#1B1B1F'}},acess:['fones','corrente']}));
// política e trajes especiais
def('ver dep pref gov',F=>({roupa:terno('#1B263B',{cor:'#1B9E4B'},F),acess:['relogio']}));
def('pres',F=>({roupa:terno('#1B1B1F',{cor:'#1B263B'},F),acess:['faixaPresidencial']}));
def('preso',F=>({roupa:{top:{tipo:'camiseta',cor:'#FB5607'},baixo:{tipo:'calca',cor:'#FB5607'},sapato:{tipo:'chinelo',cor:'#F4F4F2'}}}));
def('rei',F=>({roupa:F?{vestido:{cor:'#7B1E3A',alca:'longa',forma:'gode',comp:7.2,padrao:'paete',cor2:'#C0A062'},capa:{cor:'#9B1B30',forro:'#F4F4F2',comp:7.0},sapato:{tipo:'salto',cor:'#C0A062'}}:{top:{tipo:'farda',cor:'#7B1E3A',duplo:true,botoes:0,bolsos2:false},baixo:{tipo:'calca',cor:'#F4F4F2'},sapato:{tipo:'botaCano',cor:'#1B1B1F'},capa:{cor:'#9B1B30',forro:'#F4F4F2',comp:6.8},dragonas:'#C0A062'},acess:['coroa','medalhas']}));
def('principe',F=>({roupa:F?{vestido:{cor:'#BDE0FE',alca:'curtinha',forma:'gode',comp:7.0,padrao:'paete',cor2:'#FFFFFF'},sapato:{tipo:'sapatilha',cor:'#BDE0FE'}}:{top:{tipo:'farda',cor:'#1B263B',duplo:true,botoes:0,bolsos2:false},baixo:{tipo:'calca',cor:'#F4F4F2'},sapato:{tipo:'botaCano',cor:'#1B1B1F'},dragonas:'#C0A062'},acess:['tiaraJoia','perolas'].slice(0,F?2:0).concat(F?[]:['medalhas'])}));
def('soldado',F=>({roupa:{top:{tipo:'farda',cor:'#6B705C',padrao:'camuflado',cor2:'#A5A58D',cor3:'#3A3A2A'},baixo:{tipo:'cargo',cor:'#6B705C',padrao:'camuflado',cor2:'#A5A58D',cor3:'#3A3A2A'},sapato:{tipo:'coturno',cor:'#1B1B1F'},cinto:'#3A3A2A'},acess:['capaceteMilitar']}));
def('oficial',F=>({roupa:{sob:{tipo:'camisa',cor:'#C9C2A5'},top:{tipo:'blazer',cor:'#4B5320',botoes:3,bolsos2:true},baixo:F?{tipo:'saia',forma:'lapis',comp:5.2,cor:'#4B5320'}:{tipo:'calca',cor:'#4B5320'},sapato:{tipo:'social',cor:'#1B1B1F'},gravata:{cor:'#4B5320'},dragonas:'#4B5320'},acess:['quepeMilitar','medalhas']}));
def('marinha',F=>({roupa:{top:{tipo:'farda',cor:'#FAFAFA',bolsos2:false},baixo:{tipo:'calca',cor:'#FAFAFA'},sapato:{tipo:'social',cor:'#FAFAFA'},dragonas:'#1B263B'},acess:['quepeMarinha','medalhas']}));
def('seita',F=>({roupa:{top:{tipo:'manto',cor:'#3A2E4A'},sapato:{tipo:'sandalia',cor:'#5A3A22'},cinto:'#C0A062'},acess:['capuz','crucifixo'],corCapuz:'#3A2E4A'}));
def('heroi',F=>({roupa:{top:{tipo:'macacao',gola:'alta',ziper:false,bolsos2:false,cor:'#1B4E9B',estampa:'raio',corEstampa:'#E9C46A'},capa:{cor:'#C1121F',comp:6.2},sapato:{tipo:'botaCano',cor:'#C1121F'},cinto:'#E9C46A',luvas:'#C1121F'},acess:[]}));
def('estudante',F=>({roupa:{top:{tipo:'camiseta',cor:'#FFFFFF',estampa:'circulo',estampaPeito:true,corEstampa:'#1B4E9B'},baixo:F?{tipo:'saia',forma:'reta',comp:4.6,cor:'#1B4E9B',padrao:'xadrez',cor2:'#2A9D8F'}:{tipo:'calca',cor:'#1B4E9B'},sapato:{tipo:'tenis',cor:'#1B1B1F',meia:F?'#FFFFFF':null,meiaAlta:true}},acess:['mochila'],corMochila:'#E63946'}));
def('formatura',F=>({roupa:{sob:{tipo:'camisa',cor:'#FFFFFF'},sobre:{tipo:'toga',cor:'#1B1B1F'},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'social',cor:'#1B1B1F'}},acess:['capelo']}));
def('casamento',F=>F?{roupa:{vestido:{cor:'#FFFFFF',alca:'tomara',forma:'gode',comp:7.3,padrao:'paete',cor2:'#F4EFE6'},sapato:{tipo:'salto',cor:'#FFFFFF'}},acess:['veu','tiaraJoia','brincoPerola','perolas']}:{roupa:{sob:{tipo:'camisa',cor:'#FFFFFF'},top:{tipo:'blazer',cor:'#1B1B1F'},baixo:{tipo:'calca',cor:'#1B1B1F'},sapato:{tipo:'social',cor:'#1B1B1F'},borboleta:'#1B1B1F'},acess:['relogio']});
def('futebol',F=>({roupa:{top:{tipo:'camisaTime',cor:'#F7D417',cor2:'#1B9E4B',corManga:'#1B9E4B',corEstampa:'#1B4E9B',numero:10},baixo:{tipo:'short',cor:'#1B4E9B'},sapato:{tipo:'tenis',cor:'#1B1B1F',meia:'#F4F4F2',meiaAlta:true}}}));
def('vampiro',F=>({roupa:F?{vestido:{cor:'#4A0E1F',alca:'longa',forma:'sereia',comp:7.2},capa:{cor:'#111114',forro:'#9B1B30',comp:7.0},sapato:{tipo:'salto',cor:'#1B1B1F'}}:{sob:{tipo:'camisa',cor:'#F4F4F2'},top:{tipo:'blazer',cor:'#111114'},colete:{cor:'#4A0E1F'},baixo:{tipo:'calca',cor:'#111114'},sapato:{tipo:'social',cor:'#111114'},capa:{cor:'#111114',forro:'#9B1B30',comp:7.0},borboleta:'#111114'},acess:F?['gargantilha']:[]}));
const NOMES={vampiro:'Vampiro clássico',preso:'Presidiário',rei:'Realeza',principe:'Príncipe/Princesa',soldado:'Soldado',oficial:'Oficial',marinha:'Marinha',seita:'Seita',heroi:'Herói',estudante:'Estudante',formatura:'Formatura',casamento:'Casamento',futebol:'Jogador',ver:'Vereador',dep:'Deputado',pref:'Prefeito',gov:'Governador',pres:'Presidente'};
// ===== 200+ acessórios: cada um é {id, nome, cat, item:{k, cor}}; os de cabeça se ajustam ao volume e ao tipo de cabelo
const MET={ouro:'#E9C46A',prata:'#C9CED6','rosé':'#E8B4A0'};
const C={preto:'#1B1B1F',branco:'#F4F4F2',vermelho:'#C1121F',azul:'#1B4E9B',verde:'#2A9D8F',rosa:'#FFAFCC',amarelo:'#F4C430',roxo:'#7B2CBF',marrom:'#8B5E3C',bege:'#E9E4D8',laranja:'#FB5607',cinza:'#6C757D','lilás':'#CDB4DB',vinho:'#7B1E3A',caqui:'#A5A58D','azul-claro':'#A2D2FF',ouro:'#E9C46A',prata:'#C9CED6'};
const sel=(...n)=>Object.fromEntries(n.map(x=>[x,C[x]]));
const AL=[], add=(k,nome,cat,cores)=>{ if(!cores) AL.push({id:k,nome,cat,item:{k}}); else for(const [cn,cv] of Object.entries(cores)) AL.push({id:`${k}_${cn}`,nome:`${nome} ${cn}`,cat,item:cv?{k,cor:cv}:{k}}); };
// chapéus
add('bone','Boné','chapéu',sel('preto','vermelho','azul','branco','verde')); add('boneTras','Boné virado','chapéu',sel('preto','amarelo','roxo'));
add('gorro','Gorro','chapéu',sel('preto','vermelho','verde','bege','rosa')); add('chapeuPalha','Chapéu de palha','chapéu',{natural:'#E3C16F',escuro:'#C9A27E'});
add('chapeuPraia','Chapéu de praia','chapéu',sel('bege','branco','rosa')); add('cowboy','Chapéu de cowboy','chapéu',sel('marrom','preto','bege'));
add('cartola','Cartola','chapéu',sel('preto','vinho')); add('boina','Boina','chapéu',sel('vermelho','preto','cinza','verde')); add('fedora','Fedora','chapéu',sel('cinza','marrom','preto'));
add('bucket','Bucket','chapéu',sel('caqui','preto','amarelo','azul-claro')); add('viseira','Viseira','chapéu',sel('branco','rosa','preto'));
add('capaceteObra','Capacete de obra','chapéu',sel('amarelo','branco','laranja','azul')); add('capaceteBombeiro','Capacete de bombeiro','chapéu',sel('vermelho','amarelo'));
for(const [k,n] of [['capaceteMilitar','Capacete militar'],['quepe','Quepe policial'],['quepePiloto','Quepe de piloto'],['quepeMilitar','Quepe militar'],['quepeMarinha','Quepe da marinha'],['toqueChef','Chapéu de chef'],['toucaCozinha','Touca de cozinha'],['coroa','Coroa'],['tiaraJoia','Tiara de joias'],['capelo','Capelo'],['chapeuMarinheiro','Chapéu de marinheiro'],['capaceteAstronauta','Capacete de astronauta']]) add(k,n,'chapéu');
add('toucaCirurgica','Touca cirúrgica','chapéu',sel('verde','azul-claro','rosa'));
// cabelo
add('tiara','Tiara','cabelo',sel('vermelho','preto','rosa','branco','ouro')); add('laco','Laço','cabelo',sel('rosa','vermelho','preto','branco','azul','amarelo'));
add('flor','Flor no cabelo','cabelo',sel('rosa','vermelho','branco','amarelo','lilás')); add('presilha','Presilha','cabelo',sel('ouro','prata','rosa','preto'));
add('piranha','Piranha','cabelo',sel('marrom','preto','rosa','lilás')); add('scrunchie','Scrunchie','cabelo',sel('lilás','preto','rosa','vermelho','bege'));
add('grampos','Grampos','cabelo',sel('preto','ouro','rosa')); add('faixaCabelo','Faixa de cabelo','cabelo',sel('branco','preto','vermelho','rosa','azul'));
add('bandana','Bandana','cabelo',sel('vermelho','azul','preto','verde')); add('coroaFlores','Coroa de flores','cabelo',{colorida:null,rosa:'#FFAFCC'});
add('oculosCabeca','Óculos na cabeça','cabelo',{preto:null,marrom:'rgba(90,58,34,.85)'});
// óculos
add('oculos','Óculos','óculos',{preto:'#2B2B30',tartaruga:'#7F5539',vermelho:'#9B2335',azul:'#1B4E9B'}); add('oculosRedondo','Óculos redondo','óculos',sel('preto','ouro','marrom'));
add('oculosGatinho','Óculos gatinho','óculos',sel('vinho','preto','rosa')); add('oculosAviador','Óculos aviador','óculos',{ouro:null,prata:'#C9CED6'});
add('oculosSol','Óculos escuro','óculos',sel('preto','branco','vermelho')); add('oculosProtecao','Óculos de proteção','óculos');
// orelha
add('brinco','Brinco de pino','orelha',MET); add('argola','Argola','orelha',MET); add('argolaGrande','Argola grande','orelha',MET); add('brincoPerola','Brinco de pérola','orelha');
add('pingente','Brinco pingente','orelha',MET); add('brincoEstrela','Brinco estrela','orelha',MET); add('brincoCoracao','Brinco coração','orelha',MET);
// pescoço
add('colar','Colar com pingente','pescoço',sel('vermelho','azul','verde','roxo')); add('corrente','Corrente','pescoço',{ouro:null,prata:'#C9CED6'}); add('perolas','Colar de pérolas','pescoço');
add('gargantilha','Gargantilha','pescoço',sel('preto','vermelho','branco')); add('crucifixo','Crucifixo','pescoço',{ouro:null,prata:'#C9CED6'}); add('colarContas','Colar de contas','pescoço',sel('verde','azul','vermelho'));
add('pingenteCoracao','Colar de coração','pescoço',{ouro:null,prata:'#C9CED6'}); add('cachecol','Cachecol','pescoço',sel('vermelho','azul','cinza','bege','verde'));
add('estetoscopio','Estetoscópio','pescoço'); add('cracha','Crachá','pescoço'); add('apito','Apito','pescoço',sel('vermelho','preto'));
// rosto
add('piercingNariz','Piercing no nariz','rosto',{prata:null,ouro:'#E9C46A'}); add('septo','Piercing no septo','rosto',{prata:null,ouro:'#E9C46A'});
add('piercingSobrancelha','Piercing na sobrancelha','rosto',{prata:null,preto:'#1B1B1F'}); add('piercingLabio','Piercing no lábio','rosto',{prata:null,ouro:'#E9C46A'});
add('mascara','Máscara','rosto',{azul:'#A8D8EA',branca:'#F4F4F2',preta:'#2B2B30',rosa:'#FFC8DD'});
// mão e pulso
add('relogio','Relógio','mão'); add('pulseira','Pulseira','mão'); add('luvas','Luvas','mão',sel('preto','branco','vermelho','marrom'));
// bolsas e objetos
add('mochila','Mochila','bolsa',sel('preto','vermelho','azul','rosa','verde')); add('bolsa','Bolsa','bolsa',sel('marrom','preto','vermelho','bege','rosa'));
add('maleta','Maleta','bolsa'); add('sacola','Sacola','bolsa',sel('amarelo','branco','rosa'));
for(const [k,n] of [['bengala','Bengala'],['microfone','Microfone'],['prancheta','Prancheta'],['vassoura','Vassoura'],['chave','Chave inglesa'],['copoCafe','Copo de café'],['buque','Buquê']]) add(k,n,'objeto');
add('celular','Celular','objeto',sel('preto','branco','rosa')); add('guardaChuva','Guarda-chuva','objeto',sel('azul','vermelho','preto')); add('livro','Livro','objeto',sel('vinho','azul','verde'));
add('fones','Fones','objeto',sel('preto','branco','rosa','vermelho')); add('headset','Headset','objeto',sel('preto','cinza'));
// costas
add('capa','Capa','costas',sel('vermelho','preto','azul','roxo')); add('veu','Véu','costas'); add('capuz','Capuz','costas',sel('roxo','preto','vermelho'));
window.ACESSORIOS=AL;
window.UNIFORMES=U; window.UNIFORME_NOMES=NOMES;
// monta o personagem com o uniforme da profissão
window.vestirUniforme=(c,id)=>{ const u=U[id]; if(!u) return c; const r=u(c.sexo==='F'); const o=Object.assign({},c,{roupa:r.roupa,acess:(r.acess||[]).concat((c.acess||[]).filter(k=>!(window.CHAPEUS||[]).includes(typeof k==='string'?k:k.k)))}); for(const k of ['corChapeu','corMochila','corBolsa','corCapuz']) if(r[k]) o[k]=r[k]; if(r.cabelo) o.cabelo=r.cabelo; return o; };
window.vestirRoupa=(c,item)=>{ const o=Object.assign({},c,{roupa:item.roupa,acess:item.acess.slice()}); for(const k of ['corChapeu','corCachecol','padraoCachecol','batom','maquiagem']) if(item[k]) o[k]=item[k]; return o; };
})();
