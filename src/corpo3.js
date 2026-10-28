// ===== Corpo 3.0: figura humana em camadas =====
// corpoSVG(c) monta, nesta ordem: corpo base (sexo, idade, tipo físico, cor da pele), roupa de baixo, roupas,
// rosto (olhos, sobrancelhas, nariz, boca, rugas), cabelo e acessórios. Proporções em "cabeças", como no desenho
// de figura humana: o bebê tem 4 cabeças de altura, a criança 5,5, o adulto 7,5, e o idoso encolhe um pouco.
(function(){
const hx=h=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16));};
const toHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>{const A=hx(a),B=hx(b);return toHex(A.map((v,i)=>v+(B[i]-v)*t));};
const esc=(c,t)=>mix(c,'#000000',t), cla=(c,t)=>mix(c,'#ffffff',t);
const f=n=>Math.round(n*10)/10;
const lerpTab=(tab,x)=>{for(let i=1;i<tab.length;i++)if(x<=tab[i][0]){const[a,va]=tab[i-1],[b,vb]=tab[i];const t=(x-a)/(b-a);return va+(vb-va)*t;}return tab[tab.length-1][1];};
const suave=(pts,fechar=true)=>{const n=pts.length;let d=`M${f(pts[0][0])},${f(pts[0][1])}`;const lim=fechar?n:n-1;for(let i=0;i<lim;i++){const p0=pts[fechar?(i-1+n)%n:Math.max(0,i-1)],p1=pts[i],p2=pts[(i+1)%n],p3=pts[fechar?(i+2)%n:Math.min(n-1,i+2)];d+=` C${f(p1[0]+(p2[0]-p0[0])/6)},${f(p1[1]+(p2[1]-p0[1])/6)} ${f(p2[0]-(p3[0]-p1[0])/6)},${f(p2[1]-(p3[1]-p1[1])/6)} ${f(p2[0])},${f(p2[1])}`;}return d+(fechar?'Z':'');};
// tabela de larguras (meia largura, em cabeças) por fase: [pescoço, ombro, deltoide, axila, peito, cintura, quadril, coxa, meio da coxa, joelho, panturrilha, tornozelo]
const LARG={bebe:[.3,.72,.78,.66,.7,.74,.72,.66,.58,.46,.46,.3],crianca:[.25,.7,.76,.62,.64,.6,.66,.64,.56,.43,.45,.28],
 M:[.29,.95,1.08,.72,.74,.6,.74,.74,.64,.5,.55,.33],F:[.2,.78,.8,.6,.66,.52,.84,.83,.7,.43,.47,.25]};
const TIPO={magro:[1,.92,.9,.9,.88,.84,.88,.85,.82,.9,.85,.95],medio:[1,1,1,1,1,1,1,1,1,1,1,1],
 gordo:[1.22,1.05,1.08,1.14,1.24,1.6,1.24,1.24,1.2,1.14,1.15,1.1],musculoso:[1.18,1.12,1.16,1.1,1.16,.98,.97,1.1,1.1,1.0,1.12,1.0]};
// na mulher a gordura e o músculo se espalham de outro jeito: cintura cheia sem quadril em asa, ombro só um pouco mais largo
const TIPO_F={gordo:[1.2,1.17,1.24,1.2,1.26,1.55,1.2,1.24,1.26,1.2,1.2,1.12],musculoso:[1.06,1.1,1.15,1.08,1.04,1.08,.97,.96,1.04,1.0,1.08,1.0]};
const PELES=['#FBE3D3','#F3CBB0','#E8B48F','#D69B72','#C1845C','#A26A45','#85532F','#6A3F22','#4E2C17'];
window.PELES=PELES;
const estrela=(x,y,r)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;d+=(i?'L':'M')+f(x+Math.cos(a)*rr)+','+f(y+Math.sin(a)*rr);}return d+'Z';};
const coracao=(x,y,r)=>`M${f(x)},${f(y+r*.8)} C${f(x-r*1.4)},${f(y-r*.1)} ${f(x-r*.5)},${f(y-r*1.1)} ${f(x)},${f(y-r*.35)} C${f(x+r*.5)},${f(y-r*1.1)} ${f(x+r*1.4)},${f(y-r*.1)} ${f(x)},${f(y+r*.8)}Z`;
// peças de cima: gola, manga, comprimento e detalhes padrão (qualquer campo pode ser sobrescrito na roupa)
const PECA={
 camiseta:{gola:'redonda',manga:'curta',comp:'quadril'}, camisetaV:{gola:'v',manga:'curta',comp:'quadril',vFundo:1.6},
 longa:{gola:'redonda',manga:'longa',comp:'quadril'}, regata:{gola:'regata',manga:'nenhuma',comp:'quadril'},
 polo:{gola:'colarinho',manga:'curta',comp:'quadril',botoes:2}, camisa:{gola:'colarinho',manga:'longa',comp:'cintura',botoes:6},
 camisaCurta:{gola:'colarinho',manga:'curta',comp:'quadril',botoes:6}, camisaAberta:{gola:'colarinho',manga:'curta',comp:'quadril',aberto:true,gT:.13,yV:1.35,gB:.07},
 blusa:{gola:'canoa',manga:'3/4',comp:'quadril'}, bata:{gola:'v',manga:'3/4',comp:'longo',vFundo:1.6},
 cropped:{gola:'redonda',manga:'curta',comp:'cropped'}, croppedRegata:{gola:'regata',manga:'nenhuma',comp:'cropped'},
 alcinha:{gola:'alcinha',manga:'nenhuma',comp:'quadril'}, tomara:{gola:'tomara',manga:'nenhuma',comp:'quadril'},
 topEsporte:{gola:'regata',manga:'nenhuma',comp:'top'},
 moletom:{gola:'redonda',manga:'longa',comp:'quadril',capuz:true,bolsoCanguru:true,punho:true,barra:true},
 moletomZiper:{gola:'redonda',manga:'longa',comp:'quadril',capuz:true,ziper:true,punho:true,barra:true},
 sueter:{gola:'redonda',manga:'longa',comp:'quadril',punho:true,barra:true}, golaAlta:{gola:'alta',manga:'longa',comp:'quadril'},
 jaqueta:{gola:'colarinho',manga:'longa',comp:'quadril',aberto:true,gT:.13,yV:1.3,gB:.05,punho:true,barra:true},
 jaquetaCouro:{gola:'colarinho',manga:'longa',comp:'quadril',aberto:true,gT:.2,yV:2.0,gB:.05,lapela:true,cor:'#1B1B1F',punho:true},
 blazer:{gola:'lapela',manga:'longa',comp:'quadril',aberto:true,gT:.28,yV:2.65,gB:.025,lapela:true,botoes:1},
 terno:{gola:'lapela',manga:'longa',comp:'quadril',aberto:true,gT:.28,yV:2.65,gB:.025,lapela:true,botoes:1},
 cardigan:{gola:'v',manga:'longa',comp:'quadril',aberto:true,gT:.22,yV:2.3,gB:.03,botoes:4,punho:true},
 colete:{gola:'colete',manga:'nenhuma',comp:'colete',aberto:true,gT:.24,yV:2.15,gB:0,botoes:3},
 coleteRefletivo:{gola:'colete',manga:'nenhuma',comp:'quadril',aberto:true,gT:.2,yV:1.9,gB:.02,refletivo:true,cor:'#FF7F11'},
 jaleco:{gola:'colarinho',manga:'longa',comp:'joelho',aberto:true,gT:.22,yV:2.3,gB:.06,lapela:true,bolso:true,cor:'#FAFAFA'},
 sobretudo:{gola:'colarinho',manga:'longa',comp:'joelho',aberto:true,gT:.28,yV:2.4,gB:.03,lapela:true,punho:true},
 capaChuva:{gola:'colarinho',manga:'longa',comp:'joelho',ziper:true,cor:'#F4C430'},
 dolma:{gola:'mandarim',manga:'longa',comp:'quadril',duplo:true,cor:'#FAFAFA'},
 scrub:{gola:'v',manga:'curta',comp:'quadril',bolso:true,vFundo:1.6},
 farda:{gola:'colarinho',manga:'longa',comp:'cintura',bolsos2:true,botoes:6}, fardaCurta:{gola:'colarinho',manga:'curta',comp:'cintura',bolsos2:true,botoes:6},
 macacao:{gola:'colarinho',manga:'longa',comp:'macacao',ziper:true,bolsos2:true},
 toga:{gola:'v',manga:'longa',comp:'tornozelo',vFundo:1.5}, manto:{gola:'redonda',manga:'longa',comp:'tornozelo'},
 trajeEspacial:{gola:'alta',manga:'longa',comp:'macacao',ziper:true,bolsos2:true,cor:'#F1F1F1'},
 camisaTime:{gola:'v',manga:'curta',comp:'quadril',estampa:'numero',vFundo:1.45},
 pijama:{gola:'colarinho',manga:'longa',comp:'quadril',botoes:5},
};
// cabelos: frente (linha do cabelo/franja) + trás (comprimento/volume) + extras; tex = textura (ondas, cachos)
const CABELOS={
 careca:{fr:'careca',n:'Careca'}, raspado:{fr:'raspado',n:'Raspado'}, militar:{fr:'militar',n:'Corte militar'},
 curto:{fr:'curto',tr:'nuca',n:'Curto'}, social:{fr:'lateral',tr:'nuca',n:'Social de lado'}, topete:{fr:'topete',tr:'nuca',n:'Topete'},
 pompadour:{fr:'pompadour',tr:'nuca',n:'Pompadour'}, espetado:{fr:'espetado',n:'Espetado'}, moicano:{fr:'moicano',n:'Moicano'},
 undercut:{fr:'undercut',n:'Undercut'}, undercutCoque:{fr:'undercut',x:['coqueSamurai'],n:'Undercut com coque'},
 coqueSamurai:{fr:'puxado',tr:'nuca',x:['coqueSamurai'],n:'Coque samurai'}, entradas:{fr:'entradas',tr:'nuca',n:'Com entradas'},
 calvo:{fr:'calvo',n:'Calvo'}, tigela:{fr:'tigela',tr:'nuca',n:'Tigela'}, penteadoTras:{fr:'puxado',tr:'nuca',n:'Penteado pra trás'},
 cacheadoCurto:{fr:'cachos',tr:'nuca',tex:'cachos',n:'Cacheado curto'}, afroCurto:{fr:'afro',tr:'afroP',n:'Afro curto'},
 blackPower:{fr:'afro',tr:'afroG',n:'Black power'}, nago:{fr:'nago',tr:'nuca',n:'Nagô'},
 dreadsCurtos:{fr:'nago',tr:'dreads',comp:1.45,n:'Dreads curtos'}, dreadsLongos:{fr:'nago',tr:'dreads',comp:2.5,n:'Dreads longos'},
 mullet:{fr:'curto',tr:'mullet',n:'Mullet'}, surfista:{fr:'meio',tr:'chanel',tex:'ondas',n:'Surfista'}, roqueiro:{fr:'meio',tr:'ombro',n:'Roqueiro'},
 emo:{fr:'emo',tr:'chanel',n:'Emo'}, joaozinho:{fr:'franjaLado',tr:'nuca',n:'Joãozinho'},
 longo:{fr:'franjaLado',tr:'longo',n:'Longo liso'}, longoMeio:{fr:'meio',tr:'longo',n:'Longo repartido'}, muitoLongo:{fr:'meio',tr:'muitoLongo',n:'Muito longo'},
 franjaLonga:{fr:'franjaReta',tr:'longo',n:'Longo com franja'}, cortina:{fr:'cortina',tr:'longo',n:'Franja cortina'},
 chanel:{fr:'franjaLado',tr:'chanel',n:'Chanel'}, chanelFranja:{fr:'franjaReta',tr:'chanel',n:'Chanel com franja'}, cacheadoChanel:{fr:'cachos',tr:'chanel',tex:'cachos',n:'Chanel cacheado'},
 medio:{fr:'franjaLado',tr:'ombro',n:'Médio'}, medioMeio:{fr:'meio',tr:'medio',n:'Médio repartido'},
 ondulado:{fr:'franjaLado',tr:'longo',tex:'ondas',n:'Ondulado'}, onduladoMedio:{fr:'meio',tr:'medio',tex:'ondas',n:'Ondulado médio'},
 cacheadoLongo:{fr:'cachos',tr:'longo',tex:'cachos',n:'Cacheado longo'}, cacheadoMedio:{fr:'cachos',tr:'ombro',tex:'cachos',n:'Cacheado médio'},
 raboAlto:{fr:'puxado',x:['raboAlto'],n:'Rabo de cavalo'}, raboLado:{fr:'meio',tr:'nuca',x:['raboBaixo'],n:'Rabo de lado'}, raboFranja:{fr:'franjaReta',x:['raboAlto'],n:'Rabo com franja'},
 coque:{fr:'puxado',x:['coqueAlto'],n:'Coque alto'}, coqueBaixo:{fr:'meio',x:['coqueBaixo'],n:'Coque baixo'}, coquesDuplos:{fr:'meio',x:['coquesDuplos'],n:'Coques duplos'},
 chiquinhas:{fr:'meio',x:['chiquinhas'],n:'Maria-chiquinha'}, trancas:{fr:'meio',x:['trancas2'],n:'Duas tranças'}, trancaLado:{fr:'franjaLado',x:['trancaLado'],n:'Trança lateral'},
 boxBraids:{fr:'nago',tr:'boxBraids',comp:2.7,n:'Box braids'}, afroPuff:{fr:'puxado',tex:'cachos',x:['puff'],n:'Afro puff'},
 meioPreso:{fr:'meio',tr:'longo',x:['coqueSamurai'],n:'Meio preso'}, tiara:{fr:'puxado',tr:'longo',x:['tiara'],n:'Longo com tiara'},
 laco:{fr:'franjaReta',tr:'ombro',x:['laco'],n:'Com laço'}, florCabelo:{fr:'meio',tr:'longo',tex:'ondas',x:['flor'],n:'Ondas com flor'},
 presilha:{fr:'franjaLado',tr:'medio',x:['presilha'],n:'Com presilha'},
 // nomes antigos
 'tranças':{fr:'meio',x:['trancas2']}, afro:{fr:'afro',tr:'afroG'}, rabo:{fr:'puxado',x:['raboAlto']},
};
const CHAPEUS=['bone','boneTras','gorro','chapeuPalha','chapeuPraia','cowboy','cartola','boina','fedora','bucket','capaceteObra','capaceteBombeiro','capaceteMilitar','quepe','quepePiloto','quepeMilitar','quepeMarinha','toqueChef','toucaCozinha','toucaCirurgica','coroa','capelo','chapeuMarinheiro'];
window.CABELOS=CABELOS; window.PECA=PECA; window.CHAPEUS=CHAPEUS;

window.corpoSVG=function(c){
 const id='k'+Math.random().toString(36).slice(2,7);
 const vamp=c.criatura==='vampiro', lobo=c.criatura==='lobisomem'&&(c.forma==='lobo'||c.transformado===true);
 const a=c.idade??30, F=c.sexo==='F', pele=vamp?mix(c.pele||'#E8B48F','#E9E6EC',.5):lobo?(c.corPelo||mix(c.corCabelo||'#4A3A2C','#6B5B4B',.35)):(c.pele||'#E8B48F'), tipo=lobo?'musculoso':(c.tipo||'medio');
 const bebe=a<3, crianca=a<11, velho=a>=65;
 // envelhecimento gradual: rg(de,ate) vai de 0 a 1 entre essas idades; grisalho começa por volta dos 40 (c.grisalho adianta ou atrasa)
 const rg=(de,ate)=>Math.max(0,Math.min(1,(a-de)/(ate-de))), gris=c.tinta?0:Math.pow(Math.max(0,Math.min(1,(a+(c.grisalho||0)-38)/40)),1.3);
 const G=bebe?'bebe':crianca?'crianca':F?'F':'M', fem=G==='F', kid=bebe||crianca;
 const HW={bebe:.47,crianca:.43,F:.36,M:.39}[G];
 const CAB=lobo?null:c.cabelo===undefined?(bebe?'curto':F?(crianca?'rabo':'longo'):'curto'):c.cabelo;
 // cabeças de altura e tamanho da cabeça em px
 const linha=kid||F?mix(esc(pele,.5),pele,.3):esc(pele,.5), sombra=esc(pele,.28), luz=cla(pele,.18);
 const N=lerpTab([[0,4],[3,4.6],[6,5.4],[10,6.1],[14,6.8],[18,7.4],[30,7.5],[65,7.4],[90,7.1]],a);
 const hp=lerpTab([[0,40],[3,42],[6,43],[10,43.5],[14,44],[18,44],[90,44]],a);
 const chao=392, cx=120, topo=chao-N*hp, ls=(N-1)/6.5;
 const Y=u=>u<=1?topo+u*hp:topo+hp+(u-1)*ls*hp;
 // larguras: mistura criança -> adulto do sexo entre 10 e 18 anos, e aplica o tipo físico (mais suave em criança)
 const base=bebe?LARG.bebe:a<10?LARG.crianca:LARG[F?'F':'M'];
 let Lw=base;
 if(a>=10&&a<18){ const t=(a-10)/8; Lw=LARG.crianca.map((v,i)=>v+(LARG[F?'F':'M'][i]-v)*t); }
 if(a<3) Lw=LARG.bebe.map((v,i)=>v+(LARG.crianca[i]-v)*Math.max(0,(a-1)/2));
 const tm=(F&&a>=12&&TIPO_F[tipo])||TIPO[tipo]||TIPO.medio, forca=a<12?.4:1;
 Lw=Lw.map((v,i)=>v*(1+(tm[i]-1)*forca));
 if(velho){ Lw=Lw.slice(); Lw[4]*=.97; Lw[5]*=F?1.1:1.12; }
 if(lobo) Lw=Lw.map((v,i)=>v*(i===0?1.6:i<5?1.12:1.06));
 const [wPes,wOmb,wDel,wAx,wPei,wCin,wQua,wCox,wMco,wJoe,wPan,wTor]=Lw.map(v=>v*hp);
 const X=v=>cx+v;
 // braços soltos ao lado do corpo, levemente afastados, desenhados por cima do tronco
 const brW=(tipo==='gordo'?(F?1.45:1.28):tipo==='musculoso'?(F?1.32:1.2):tipo==='magro'?.85:1)*(bebe?.62:crianca?.95:F?.7:1)*hp;
 const lado=s=>{ // s=-1 esquerda, 1 direita
  const P=(x,y)=>[cx+s*x,y];
  // proporções de desenho de figura (cânone de 7,5 cabeças): ombro 1/3 de cabeça abaixo do queixo, cotovelo na cintura,
  // punho na virilha, ponta dos dedos no meio da coxa
  const ya=F&&a>=12?1.25:1.28, J=[wDel-.24*brW, Y(ya+.17)], th1=(bebe?14:tipo==='gordo'?16:11)*Math.PI/180, th2=(bebe?22:tipo==='gordo'?11:7)*Math.PI/180;
  const d1=[Math.sin(th1),Math.cos(th1)], n1=[Math.cos(th1),-Math.sin(th1)], d2=[Math.sin(th2),Math.cos(th2)], n2=[Math.cos(th2),-Math.sin(th2)];
  const up=1.45*ls*hp, fo=1.2*ls*hp, mao=.75*ls*hp*(bebe?.85:F?.9:1);
  const E=[J[0]+d1[0]*up,J[1]+d1[1]*up], W=[E[0]+d2[0]*fo,E[1]+d2[1]*fo];
  const at=(o,d,n,al,lw)=>[o[0]+d[0]*al+n[0]*lw,o[1]+d[1]*al+n[1]*lw];
  // ----- tronco e pernas (sem os braços)
  const pts=[];
  // ponta do ombro: na mulher é uma curva redonda (um quarto de círculo), no homem o canto do deltoide
  const ombro=kid?[P(wOmb*.8,Y(ya)),P(wOmb*.96,Y(ya+.08)),P(wDel,Y(ya+.26))]:F&&a>=12?[P(wDel-.22*hp,Y(ya)),P(wDel-.07*hp,Y(ya+.06)),P(wDel,Y(ya+.22))]:[P(wOmb-.14*hp,Y(ya)),P(wOmb-.01*hp,Y(ya+.05)),P(wDel,Y(ya+.2))];
  const yT=F||kid?1.2:1.15; // onde o pescoço vira trapézio
  const yN=F||kid?1.06:1.0, nx=Math.min(wPes*.98,HW*hp*(tipo==='gordo'&&a>=12?1.08:1)*.72);
  // mulher: pescoço longo e linha do ombro quase reta; homem: trapézio em diagonal
  if(F&&a>=12) pts.push(P(nx,Y(.86)),P(wPes,Y(1.05)),P(wPes+.06*hp,Y(1.2)),P((wPes+wOmb)/2,Y(1.22)));
  else if(kid) pts.push(P(nx,Y(.86)),P(wPes,Y(1.0)),P(wPes+.08*hp,Y(1.1)));
  else pts.push(...((tipo==='gordo'||tipo==='musculoso')&&!kid?[P(nx,Y(.86)),P(wPes+.03*hp,Y(.99)),P(wPes+.13*hp,Y(1.1)),P(wPes+.28*hp,Y(1.18))]:[P(nx,Y(.86)),P(wPes,Y(1.0)),P(wPes+.015*hp,Y(1.07)),P(wPes+.1*hp,Y(1.14)),P(wPes+.28*hp,Y(1.2))]),P((wPes+.28*hp+wOmb-.14*hp)/2,Y((1.2+ya)/2+.01)));
  pts.push(...ombro,P(wDel*.95,Y(ya+.42)));
  pts.push(P(wAx,Y(1.95)),P(wPei,Y(2.25)));
  if(F&&a>=13) pts.push(P(wPei*.98,Y(2.5)));
  pts.push(P((wPei+wCin)/2,Y(2.62)),P(wCin,Y(2.88)));
  if(tipo==='gordo'&&!F) pts.push(P(wCin*1.1,Y(3.12)),P(wCin*1.04,Y(3.36)));
  else if(tipo==='gordo') pts.push(P(wCin*1.04+(wQua-wCin)*.1,Y(3.12)),P(wCin+(wQua-wCin)*.6,Y(3.3)));
  else if(velho&&!F) pts.push(P(wCin*1.05,Y(3.15)));
  else pts.push(P(wCin+(wQua-wCin)*.55,Y(3.2)));
  pts.push(P(wQua,Y(3.5)),P(wCox,Y(3.9)),P(wMco,Y(4.6)),P(wJoe*(tipo==='musculoso'?(F?1.08:1.14):1.04),Y(tipo==='musculoso'?5.08:5.2)),P(wJoe,Y(5.55)),P(wPan,Y(6.0)),P((wPan+wTor)/2,Y(6.55)),P(wTor,Y(7.0)));
  // pé um pouco virado para fora
  const ti=.11*hp;
  pts.push(P(wTor+.05*hp,Y(7.2)),P(wTor+.1*hp,Y(7.4)),P(wTor+.06*hp,Y(7.5)),P((wTor+ti)/2,Y(7.52)),P(ti-.01*hp,Y(7.47)),P(ti,Y(7.2)));
  const cola=tipo==='gordo'?.0:F?.02:.04;
  pts.push(P(ti+.01*hp,Y(6.95)),P(.07*hp,Y(6.3)),P(.06*hp,Y(5.9)),P((tipo==='gordo'?.05:.09)*hp,Y(5.55)),P((tipo==='musculoso'?.11:tipo==='gordo'?.02:.07)*hp,Y(5.2)),P(cola*hp,Y(4.5)),P(0,Y(4.0)));
  // ----- braço: do ombro, por fora, mão, por dentro, até a axila
  const m=(al,lw)=>P(...at(W,d2,n2,al*mao,lw*mao));
  const bic=tipo==='musculoso'?.25:tipo==='gordo'?.24:.21;
  const fora=[...ombro,P(...at(J,d1,n1,up*.32,.25*brW)),P(...at(J,d1,n1,up*.6,bic*brW)),P(...at(E,d1,n1,0,.165*brW)),P(...at(E,d2,n2,fo*.22,.19*brW)),P(...at(W,d2,n2,-fo*.15,.135*brW)),P(...at(W,d2,n2,0,.12*brW))];
  const maoP=[m(.12,.15),m(.4,.18),m(.7,.16),m(.9,.1),m(1.0,.0),m(.95,-.08),m(.78,-.12),m(.6,-.13),m(.5,-.18),m(.35,-.2),m(.15,-.16)];
  const dentro=[P(...at(W,d2,n2,0,-.12*brW)),P(...at(W,d2,n2,-fo*.15,-.125*brW)),P(...at(E,d2,n2,fo*.3,-.16*brW)),P(...at(E,d1,n1,0,-.15*brW)),P(...at(J,d1,n1,up*.55,-.19*brW)),P(...at(J,d1,n1,up*.25,-.22*brW))];
  const fecho=[P(wOmb-.38*hp,Y(1.5)),P(wOmb-.3*hp,Y(1.38))];
  const braco=fora.concat(maoP,dentro);
  const nDentro=dentro.length;
  const sd=s>0?[d1,n1,d2,n2]:[[-d1[0],d1[1]],[-n1[0],n1[1]],[-d2[0],d2[1]],[-n2[0],n2[1]]];
  const delt=[P(wOmb-.3*hp,Y(1.4)),P(...at(J,d1,n1,up*.2,.02*brW)),P(...at(J,d1,n1,up*.47,.2*brW))];
  return {nDentro,delt,pts,J:P(...J),E:P(...E),W:P(...W),d1:sd[0],n1:sd[1],d2:sd[2],n2:sd[3],up,fo,mao,braco,fecho};
 };
 const Le=lado(-1), Ld=lado(1);
 // ===== guarda-roupa: as peças viram camadas de dentro para fora
 const ACL=(c.acess||[]).map(x=>typeof x==='string'?{k:x}:x), AC=new Set(ACL.map(x=>x.k)), ac=(k,d)=>(ACL.find(x=>x.k===k)||{}).cor||d;
 const RP=Object.assign({},c.roupa||{}), defsX=[], PADS={}, chapeu=ACL.map(x=>x.k).find(k=>CHAPEUS.includes(k));
 if(AC.has('luvas')) RP.luvas=ac('luvas','#1B1B1F'); if(AC.has('capa')&&!RP.capa) RP.capa={cor:ac('capa','#C1121F'),comp:6.3};
 const np=p=>{ if(!p) return null; if(typeof p==='string') p={cor:p}; return Object.assign({},PECA[p.tipo]||PECA.camiseta,p); };
 const baixo=RP.baixo?(typeof RP.baixo==='string'?{tipo:'calca',cor:RP.baixo}:Object.assign({},RP.baixo)):null;
 const camadas=[], saias=[];
 if(RP.sob) camadas.push(np(RP.sob));
 if(RP.vestido){ const v=typeof RP.vestido==='string'?{cor:RP.vestido}:RP.vestido, al=v.alca||'alcinha';
  camadas.push({cor:v.cor,padrao:v.padrao,cor2:v.cor2,cor3:v.cor3,gola:['alcinha','tomara','regata'].includes(al)?al:(v.gola||'redonda'),manga:['curta','longa','3/4','curtinha'].includes(al)?al:'nenhuma',comp:'vestido',vFundo:v.vFundo});
  saias.push({p:v,comp:v.comp||(a<14?4.9:5.3),forma:v.forma||'rodada',y0:2.95}); }
 const top1=np(RP.top);
 if(top1){ if(top1.aberto&&!camadas.length) camadas.push(top1.tipo==='terno'?np({tipo:'camisa',cor:'#FFFFFF',gravata:RP.gravata||c.gravata||'#9B2335'}):np({tipo:'camiseta',cor:top1.dentro||'#F4F4F2'})); camadas.push(top1); }
 if(RP.colete) camadas.push(np(Object.assign({tipo:'colete'},typeof RP.colete==='string'?{cor:RP.colete}:RP.colete)));
 if(RP.sobre){ const so=np(RP.sobre); if(so.aberto&&!camadas.length) camadas.push(np({tipo:'camiseta',cor:'#F4F4F2'})); camadas.push(so); }
 if(baixo&&baixo.tipo==='saia') saias.unshift({p:baixo,comp:baixo.comp||5.0,forma:baixo.forma||'rodada',y0:2.95});
 // na transformação a camisa rasga e some, a calça vira bermuda esfarrapada e os pés ficam descalços
 if(lobo){ camadas.length=0; saias.length=0; if(baixo){ baixo.tipo='bermuda'; baixo.rasgado=true; delete baixo.listraLado; } RP.sapato={tipo:'descalco'}; RP.capa=null; }
 const HS=specCab(), CB=caixaCab();
 // chapéu de aba fica assentado na cabeça: o cabelo acima da aba some (fica dentro da copa), em vez de o chapéu flutuar no topo do volume
 const ABA=['chapeuPalha','chapeuPraia','cowboy','cartola','fedora','bucket'].includes(chapeu), abaClip=g=>ABA&&g?`<clipPath id="ab${id}"><rect x="-2000" y="${f(topo+.13*hp)}" width="4000" height="4000"/></clipPath><g clip-path="url(#ab${id})">${g}</g>`:g;
 let gradCab=null; if(c.corPontas&&HS){ gradCab=`url(#gc${id})`; defsX.push(`<linearGradient id="gc${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(topo+.6*hp)}" x2="0" y2="${f(Y(2.6))}"><stop offset="0" stop-color="${corCab()}"/><stop offset=".4" stop-color="${corCab()}"/><stop offset="1" stop-color="${c.corPontas}"/></linearGradient>`); }
 const contorno=Le.pts.concat(Ld.pts.slice(0,-1).reverse());
 const silh=suave(contorno);
 // braço: preenchimento fechado; contorno só da parte visível (sem a emenda no ombro)
 const bracoD=L=>suave(L.braco.concat(L.fecho));
 // na criança o braço encosta no tronco: a linha de dentro para na axila, sem riscar o peito até o ombro
 const bracoLinha=L=>suave(kid?L.braco.slice(0,-2):L.braco,false);
 const O=[];
 const vb=c.recorte==="busto"?`${f(cx-hp*1.35)} ${f(topo-hp*.75)} ${f(hp*2.7)} ${f(hp*3.0)}`:c.recorte==="retrato"?`${f(cx-hp*1.02)} ${f(topo-hp*.5)} ${f(hp*2.04)} ${f(hp*2.04)}`:c.recorte==="rosto"?`${f(cx-hp*.8)} ${f(topo-hp*.3)} ${f(hp*1.6)} ${f(hp*1.6)}`:"0 0 240 400";
 O.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" class="corpo">`);
 O.push(`<defs><clipPath id="c${id}"><path d="${silh}"/></clipPath><clipPath id="be${id}"><path d="${bracoD(Le)}"/></clipPath><clipPath id="bd${id}"><path d="${bracoD(Ld)}"/></clipPath><filter id="b${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.6"/></filter>`
  +`<radialGradient id="r${id}" cx=".5" cy=".4" r=".65"><stop offset="0" stop-color="${cla(pele,.06)}"/><stop offset=".75" stop-color="${pele}"/><stop offset="1" stop-color="${esc(pele,.05)}"/></radialGradient></defs>`);
 O.push(`<ellipse cx="${cx}" cy="${f(chao+1)}" rx="${f(wQua+16)}" ry="4.5" fill="rgba(0,0,0,.12)"/>`);
 O.push(acessTras(),abaClip(cabeloTras()));
 // ===== tronco e pernas
 O.push(`<path d="${silh}" fill="${pele}"/>`);
 const dentro=[];
 dentro.push(`<path d="${silh}" fill="none" stroke="${sombra}" stroke-width="7" opacity=".32" filter="url(#b${id})"/>`);
 // sombra suave do queixo no pescoço (só no pescoço, curta, para não parecer barba)
 dentro.push(`<ellipse cx="${cx}" cy="${f(Y(1.02))}" rx="${f(wPes*.9)}" ry="${f(.07*hp)}" fill="${sombra}" opacity=".28" filter="url(#b${id})"/>`);
 const ana=(d,op=.5,w=1.1)=>dentro.push(`<path d="${d}" fill="none" stroke="${sombra}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`);
 if(!bebe){ ana(`M${f(X(-.06*hp))},${f(Y(1.3))} Q${f(X(-wOmb*.35))},${f(Y(1.36))} ${f(X(-wOmb*.72))},${f(Y(1.34))} M${f(X(.06*hp))},${f(Y(1.3))} Q${f(X(wOmb*.35))},${f(Y(1.36))} ${f(X(wOmb*.72))},${f(Y(1.34))}`,.4);
  if(!F&&a>=14){ ana(`M${f(X(-wPes*.75))},${f(Y(.98))} L${f(X(-.05*hp))},${f(Y(1.27))} M${f(X(wPes*.75))},${f(Y(.98))} L${f(X(.05*hp))},${f(Y(1.27))}`,.22,1);
   ana(`M${f(X(-wPei*.85))},${f(Y(2.22))} Q${f(X(-wPei*.4))},${f(Y(2.4))} ${f(X(-.03*hp))},${f(Y(2.22))} M${f(X(wPei*.85))},${f(Y(2.22))} Q${f(X(wPei*.4))},${f(Y(2.4))} ${f(X(.03*hp))},${f(Y(2.22))}`,tipo==='musculoso'?.6:.3,1.3); }
  if(tipo==='musculoso'&&a>=16) ana(`M${f(X(0))},${f(Y(2.42))} V${f(Y(3.2))}`,.3,1); }
if(tipo==='musculoso'&&a>=14&&!F) for(const s of [-1,1]) ana(`M${f(X(s*wMco*.55))},${f(Y(4.25))} Q${f(X(s*wJoe*.95))},${f(Y(4.85))} ${f(X(s*wJoe*.62))},${f(Y(5.35))} M${f(X(s*.15*hp))},${f(Y(4.95))} Q${f(X(s*.11*hp))},${f(Y(5.25))} ${f(X(s*.22*hp))},${f(Y(5.42))}`,.3,1);
 if(tipo==='gordo'&&F&&a>=14) ana(`M${f(X(-wPei*.85))},${f(Y(2.56))} Q${f(X(-wPei*.4))},${f(Y(2.68))} ${f(X(-.05*hp))},${f(Y(2.56))} M${f(X(wPei*.85))},${f(Y(2.56))} Q${f(X(wPei*.4))},${f(Y(2.68))} ${f(X(.05*hp))},${f(Y(2.56))}`,.3,1.1);
 if(tipo==='gordo'&&a>=14){ ana(`M${f(X(-wCin*.8))},${f(Y(3.3))} Q${cx},${f(Y(3.62))} ${f(X(wCin*.8))},${f(Y(3.3))}`,.4,1.3);
  if(!F) ana(`M${f(X(-wPei*.8))},${f(Y(2.42))} Q${f(X(-wPei*.4))},${f(Y(2.6))} ${f(X(-.05*hp))},${f(Y(2.45))} M${f(X(wPei*.8))},${f(Y(2.42))} Q${f(X(wPei*.4))},${f(Y(2.6))} ${f(X(.05*hp))},${f(Y(2.45))}`,.35,1.2);
  dentro.push(`<ellipse cx="${cx}" cy="${f(Y(3.0))}" rx="${f(wCin*.75)}" ry="${f(.42*hp)}" fill="none" stroke="${sombra}" stroke-width="5" opacity=".18" filter="url(#b${id})"/>`); }
 if(tipo==='musculoso'&&a>=16){ for(const s of [-1,1]) ana(`M${f(X(s*wPei*.95))},${f(Y(2.0))} Q${f(X(s*wPei*.75))},${f(Y(2.6))} ${f(X(s*wCin*.75))},${f(Y(3.05))}`,.3,1);
  ana(`M${f(X(-.17*hp))},${f(Y(2.6))} Q${cx},${f(Y(2.66))} ${f(X(.17*hp))},${f(Y(2.6))} M${f(X(-.16*hp))},${f(Y(2.85))} Q${cx},${f(Y(2.9))} ${f(X(.16*hp))},${f(Y(2.85))} M${f(X(-.15*hp))},${f(Y(3.1))} Q${cx},${f(Y(3.14))} ${f(X(.15*hp))},${f(Y(3.1))}`,.35,1); }
 dentro.push(`<ellipse cx="${cx}" cy="${f(Y(tipo==='gordo'?3.15:3.1))}" rx="${f(.025*hp)}" ry="${f(.04*hp)}" fill="${sombra}" opacity=".6"/>`);
 for(const s of [-1,1]) ana(`M${f(X(s*(wJoe*.55)))},${f(Y(5.48))} q${f(s*.06*hp)},${f(.08*hp)} 0,${f(.16*hp)}`,.4);
 // sombra que o braço faz no tronco
 for(const L of [Le,Ld]) dentro.push(`<path d="${bracoD(L)}" transform="translate(${f(L===Le?2:-2)},1)" fill="${sombra}" opacity=".25" filter="url(#b${id})"/>`);
 if(lobo) dentro.push(peloCorpo(true));
 dentro.push(roupas());
 O.push(`<g clip-path="url(#c${id})">${dentro.join('')}</g>`);
 O.push(`<path d="${silh}" fill="none" stroke="${linha}" stroke-width="${kid||F?1.15:1.35}" stroke-linejoin="round"/>`);
 O.push(roupasFora());
 // ===== braços por cima
 for(const L of [Le,Ld]){ const cid=L===Le?`be${id}`:`bd${id}`;
  O.push(`<path d="${bracoD(L)}" fill="${pele}"/>`);
  O.push(`<g clip-path="url(#${cid})"><path d="${bracoLinha(L)}" fill="none" stroke="${sombra}" stroke-width="6" opacity="${kid?.16:.35}" filter="url(#b${id})"/>${tipo!=='musculoso'||bebe?'':`<path d="${suave(L.delt,false)}" fill="none" stroke="${sombra}" stroke-width="${tipo==='musculoso'?1.2:1}" opacity="${tipo==='musculoso'?.6:.38}" stroke-linecap="round"/>`}${lobo?peloCorpo(false):''}${tatuagem(L)}${manga(L)}</g>`);
  const nb=L.braco.length-L.nDentro+1;
  O.push(`<path d="${suave(L.braco.slice(0,nb),false)}" fill="none" stroke="${linha}" stroke-width="${kid||F?1.15:1.35}" stroke-linejoin="round" stroke-linecap="round"/>`);
  O.push(`<path d="${suave(L.braco.slice(nb-1,kid?-2:undefined),false)}" fill="none" stroke="${linha}" stroke-width="1" opacity=".55" stroke-linejoin="round" stroke-linecap="round"/>`); } O.push(sobreBracos(),garras(),cabeca());
 O.push(acessorios());
 O.push(`<defs>${defsX.join('')}</defs></svg>`);
 return O.join('');

 // ===== tecidos: cor lisa ou estampa (pattern em coordenadas do desenho, contínua entre tronco, braço e perna)
 function tinta(p){ if(!p) return '#888888'; const cor=p.cor||'#4F86F7', pd=p.padrao; if(!pd||pd==='liso') return cor;
  const k=pd+cor+(p.cor2||'')+(p.cor3||''); if(PADS[k]) return PADS[k];
  const pid=`p${id}x${Object.keys(PADS).length}`, c2=p.cor2||(pd==='jeans'?cla(cor,.2):cla(cor,.6)), c3=p.cor3||esc(cor,.35), s=hp*.2; let w=s,h=s,b='';
  const fundo=(W,H)=>`<rect width="${f(W)}" height="${f(H)}" fill="${cor}"/>`;
  if(pd==='degrade'){ defsX.push(`<linearGradient id="${pid}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(Y(1.2))}" x2="0" y2="${f(Y(5))}"><stop offset="0" stop-color="${cor}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`); return PADS[k]=`url(#${pid})`; }
  switch(pd){
   case 'listras': w=4;h=s*.55; b=fundo(w,h)+`<rect width="${w}" height="${f(h*.45)}" fill="${c2}"/>`; break;
   case 'listrasFinas': w=4;h=s*.3; b=fundo(w,h)+`<rect width="${w}" height="${f(h*.22)}" fill="${c2}"/>`; break;
   case 'listrasV': w=s*.5;h=4; b=fundo(w,h)+`<rect width="${f(w*.4)}" height="${h}" fill="${c2}"/>`; break;
   case 'xadrez': w=h=s*.9; b=fundo(w,h)+`<rect width="${f(w)}" height="${f(h*.35)}" fill="${c2}" opacity=".55"/><rect width="${f(w*.35)}" height="${f(h)}" fill="${c2}" opacity=".55"/><path d="M0,${f(h*.7)} H${f(w)} M${f(w*.7)},0 V${f(h)}" stroke="${c3}" stroke-width=".7" opacity=".7"/>`; break;
   case 'quadriculado': w=h=s*.5; b=fundo(w,h)+`<rect width="${f(w/2)}" height="${f(h/2)}" fill="${c2}"/><rect x="${f(w/2)}" y="${f(h/2)}" width="${f(w/2)}" height="${f(h/2)}" fill="${c2}"/><rect width="${f(w)}" height="${f(h/2)}" fill="${c2}" opacity=".35"/>`; break;
   case 'bolinhas': w=h=s*.6; b=fundo(w,h)+`<circle cx="${f(w*.25)}" cy="${f(h*.25)}" r="${f(s*.08)}" fill="${c2}"/><circle cx="${f(w*.75)}" cy="${f(h*.75)}" r="${f(s*.08)}" fill="${c2}"/>`; break;
   case 'floral': { w=h=s*1.1; const fl=(x,y,r,cc)=>[0,72,144,216,288].map(a=>`<circle cx="${f(x+Math.cos(a*Math.PI/180)*r)}" cy="${f(y+Math.sin(a*Math.PI/180)*r)}" r="${f(r*.75)}" fill="${cc}"/>`).join('')+`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r*.55)}" fill="${p.cor3||'#F4D35E'}"/>`;
    b=fundo(w,h)+`<path d="M${f(w*.45)},${f(h*.55)} q${f(s*.1)},${f(-s*.08)} ${f(s*.2)},0 q${f(-s*.1)},${f(s*.08)} ${f(-s*.2)},0" fill="#5C8A4A" opacity=".8"/>`+fl(w*.25,h*.28,s*.1,c2)+fl(w*.78,h*.8,s*.08,mix(c2,cor,.35)); break; }
   case 'camuflado': w=h=s*2; b=fundo(w,h)+`<path d="${suave([[w*.1,h*.2],[w*.4,h*.1],[w*.5,h*.35],[w*.3,h*.5],[w*.05,h*.4]])}" fill="${c2}"/><path d="${suave([[w*.55,h*.55],[w*.9,h*.5],[w*.95,h*.85],[w*.7,h*.95],[w*.5,h*.8]])}" fill="${c2}"/><path d="${suave([[w*.6,h*.1],[w*.85,h*.15],[w*.8,h*.35],[w*.6,h*.3]])}" fill="${c3}"/><path d="${suave([[w*.15,h*.65],[w*.35,h*.6],[w*.4,h*.85],[w*.2,h*.9]])}" fill="${c3}"/>`; break;
   case 'oncinha': w=h=s*.9; b=fundo(w,h)+[[.25,.3],[.75,.72],[.8,.2]].map(([x,y])=>`<ellipse cx="${f(w*x)}" cy="${f(h*y)}" rx="${f(s*.11)}" ry="${f(s*.08)}" fill="${c2}" stroke="${c3}" stroke-width="${f(s*.04)}" stroke-dasharray="${f(s*.12)} ${f(s*.06)}"/>`).join(''); break;
   case 'estrelas': w=h=s*.8; b=fundo(w,h)+`<path d="${estrela(w*.3,h*.3,s*.1)}" fill="${c2}"/><path d="${estrela(w*.78,h*.75,s*.07)}" fill="${c2}"/>`; break;
   case 'coracoes': w=h=s*.8; b=fundo(w,h)+`<path d="${coracao(w*.3,h*.3,s*.1)}" fill="${c2}"/><path d="${coracao(w*.78,h*.78,s*.08)}" fill="${c2}"/>`; break;
   case 'jeans': w=h=3; b=fundo(w,h)+`<path d="M0,3 L3,0" stroke="${c2}" stroke-width=".5" opacity=".7"/>`; break;
   case 'trico': w=s*.3;h=s*.25; b=fundo(w,h)+`<path d="M0,0 L${f(w/2)},${f(h*.7)} L${f(w)},0" stroke="${c3}" stroke-width=".6" fill="none" opacity=".5"/>`; break;
   case 'geometrico': w=h=s*.9; b=fundo(w,h)+`<path d="M0,${f(h)} L${f(w/2)},0 L${f(w)},${f(h)}Z" fill="${c2}" opacity=".75"/>`; break;
   case 'paete': w=h=s*.25; b=fundo(w,h)+`<circle cx="${f(w/2)}" cy="${f(h/2)}" r="${f(w*.32)}" fill="${c2}" opacity=".55"/>`; break;
   case 'tropical': w=h=s*1.3; b=fundo(w,h)+`<path d="M${f(w*.1)},${f(h*.5)} q${f(w*.25)},${f(-h*.35)} ${f(w*.5)},${f(-h*.1)} q${f(-w*.25)},${f(h*.35)} ${f(-w*.5)},${f(h*.1)}Z" fill="${c2}"/><path d="M${f(w*.55)},${f(h*.95)} q${f(w*.2)},${f(-h*.3)} ${f(w*.4)},${f(-h*.15)} q${f(-w*.2)},${f(h*.3)} ${f(-w*.4)},${f(h*.15)}Z" fill="${c3}"/><circle cx="${f(w*.75)}" cy="${f(h*.3)}" r="${f(s*.1)}" fill="${p.cor3||'#F28482'}"/>`; break;
   default: return cor; }
  defsX.push(`<pattern id="${pid}" patternUnits="userSpaceOnUse" width="${f(w)}" height="${f(h)}">${b}</pattern>`);
  return PADS[k]=`url(#${pid})`; }

 // ===== mangas: pintam o braço do ombro até um corte perpendicular ao braço (camadas de dentro para fora)
 function corte(L,tipo){ return tipo==='longa'?[[L.W[0]-L.d2[0]*2,L.W[1]-L.d2[1]*2],L.d2,L.n2]:tipo==='3/4'?[[L.E[0]+L.d2[0]*L.fo*.4,L.E[1]+L.d2[1]*L.fo*.4],L.d2,L.n2]:tipo==='curtinha'?[[L.J[0]+L.d1[0]*L.up*.25,L.J[1]+L.d1[1]*L.up*.25],L.d1,L.n1]:[[L.J[0]+L.d1[0]*L.up*.45,L.J[1]+L.d1[1]*L.up*.45],L.d1,L.n1]; }
 function tira(C,d,n,j1,j2,fill,extra=''){ const q=(k,j)=>f(C[0]+n[0]*k-d[0]*j)+','+f(C[1]+n[1]*k-d[1]*j); return `<path d="M${q(-60,j1)} L${q(60,j1)} L${q(60,j2)} L${q(-60,j2)}Z" fill="${fill}" ${extra}/>`; }
 function manga(L){ return camadas.map(p=>{ const tp=p.manga; if(!tp||tp==='nenhuma') return '';
  const fill=p.corManga||tinta(p), cor=p.corManga||p.cor||'#4F86F7', [C,d,n]=corte(L,tp), R=[tira(C,d,n,0,200,fill)];
  R.push(`<path d="M${f(C[0]-n[0]*30)},${f(C[1]-n[1]*30)} L${f(C[0]+n[0]*30)},${f(C[1]+n[1]*30)}" stroke="${esc(cor,.3)}" stroke-width="1.3"/>`);
  if(p.punho&&tp==='longa') R.push(tira(C,d,n,0,4.5,esc(cor,.12)));
  if(p.refletivo&&tp==='longa'){ const C2=[L.E[0]+L.d2[0]*L.fo*.45,L.E[1]+L.d2[1]*L.fo*.45]; R.push(tira(C2,L.d2,L.n2,-2.2,2.2,p.refletivo===true?'#F2F2F0':p.refletivo),tira(C2,L.d2,L.n2,-1,1,'#D7DE3A')); }
  if(p.dobra&&tp!=='curtinha') R.push(tira(C,d,n,0,3.5,cla(cor,.12)));
  return R.join(''); }).join('')+luvaPulso(L); }
 function luvaPulso(L){ const R=[], C=L.W, d=L.d2, n=L.n2;
  if(RP.luvas) R.push(tira(C,d,n,-60,3,RP.luvas));
  if(L===Le&&AC.has('relogio')){ R.push(tira(C,d,n,2.5,6,'#3A3A40')); const m=[C[0]-d[0]*4.2,C[1]-d[1]*4.2]; R.push(`<circle cx="${f(m[0])}" cy="${f(m[1])}" r="2.3" fill="#E9E4D8" stroke="#B8A26A" stroke-width=".9"/>`); }
  if(L===Ld&&AC.has('pulseira')) R.push(tira(C,d,n,3,4.6,'#E9C46A'));
  return R.join(''); }
 // tatuagens no braço direito, desenhadas antes da manga (a manga cobre)
 function tatuagem(L){ const t=c.tatuagem; if(!t||L!==Ld||a<16) return ''; const tc='#2E3A4A';
  if(t==='manga') return tira([L.J[0]+L.d1[0]*L.up*.18,L.J[1]+L.d1[1]*L.up*.18],L.d1,L.n1,-L.up*.82,0,tinta({cor:'none',padrao:'floral',cor2:tc,cor3:'#7A2E2E'}),'opacity=".55"')+tira(L.E,L.d2,L.n2,-L.fo*.85,0,tinta({cor:'none',padrao:'floral',cor2:tc,cor3:'#7A2E2E'}),'opacity=".55"');
  const P0=[L.J[0]+L.d1[0]*L.up*.62,L.J[1]+L.d1[1]*L.up*.62], ang=Math.atan2(L.d1[1],L.d1[0])*180/Math.PI-90, u=hp*.07;
  const forma={flor:`<path d="${[0,72,144,216,288].map(a2=>{const r=a2*Math.PI/180;return `M0,0 Q${f(Math.cos(r-.5)*u*1.6)},${f(Math.sin(r-.5)*u*1.6)} ${f(Math.cos(r)*u*1.8)},${f(Math.sin(r)*u*1.8)} Q${f(Math.cos(r+.5)*u*1.6)},${f(Math.sin(r+.5)*u*1.6)} 0,0`;}).join(' ')}" fill="#B23A48" stroke="${tc}" stroke-width=".6"/><circle r="${f(u*.4)}" fill="#F4D35E"/>`,
   ancora:`<path d="M0,${f(-u*1.6)} V${f(u*1.6)} M${f(-u)},${f(-u*.8)} H${f(u)} M${f(-u*1.3)},${f(u*.6)} Q0,${f(u*2.2)} ${f(u*1.3)},${f(u*.6)}" stroke="${tc}" stroke-width="1.1" fill="none"/><circle cy="${f(-u*1.9)}" r="${f(u*.35)}" stroke="${tc}" fill="none" stroke-width=".9"/>`,
   coracao:`<path d="${coracao(0,0,u*1.4)}" fill="#C1121F" stroke="${tc}" stroke-width=".7"/>`,
   estrela:`<path d="${estrela(0,0,u*1.6)}" fill="none" stroke="${tc}" stroke-width="1"/>`,
   tribal:`<path d="M${f(-u*1.4)},${f(-u*1.8)} Q${f(u*.8)},${f(-u)} ${f(-u*.2)},0 Q${f(u*1.4)},${f(u*.6)} ${f(u*.2)},${f(u*2)} M${f(u*1.3)},${f(-u*1.6)} Q${f(-u*.3)},${f(-u*.6)} ${f(u*.5)},${f(u*.4)}" stroke="${tc}" stroke-width="${f(u*.5)}" fill="none" stroke-linecap="round"/>`}[t]||'';
  return `<g transform="translate(${f(P0[0])},${f(P0[1])}) rotate(${f(ang)})" opacity=".8">${forma}</g>`; }

 // ===== roupas: cada peça é uma região; a silhueta recorta, então a roupa segue o corpo
 function roupas(){ const R=[];
  const faixa=(y1,y2,cor,lx=200)=>`<rect x="${f(cx-lx)}" y="${f(y1)}" width="${f(2*lx)}" height="${f(y2-y1)}" fill="${cor}"/>`;
  const larg=y=>y<=Y(2.02)?wAx:y<=Y(2.35)?wAx+(wPei-wAx)*(y-Y(2.02))/(Y(2.35)-Y(2.02)):y<=Y(2.98)?wPei+(wCin-wPei)*(y-Y(2.35))/(Y(2.98)-Y(2.35)):wCin+(wQua-wCin)*Math.min(1,(y-Y(2.98))/(Y(3.5)-Y(2.98)));
  const tronco=(y1,y2,cor)=>{ const ys=[y1,Y(2.02),Y(2.35),Y(2.98),Y(3.5),y2].filter(y=>y>=y1&&y<=y2).sort((p,q)=>p-q); const dd=ys.map(y=>[X(Math.max(larg(y),y>Y(3.5)?wCox:0)+3),y]); return `<path d="M${f(X(-larg(y1)-3))},${f(y1)} H${f(X(larg(y1)+3))} ${dd.map(p=>'L'+f(p[0])+','+f(p[1])).join(' ')} ${dd.slice().reverse().map(p=>'L'+f(2*cx-p[0])+','+f(p[1])).join(' ')} Z" fill="${cor}"/>`; };
  const pernas=(y2,cor,y1=Y(3.3))=>`<rect x="${f(X(-wCox-8))}" y="${f(y1)}" width="${f(2*wCox+16)}" height="${f(y2-y1)}" fill="${cor}"/>`;
  const linha=(y,cor,w)=>`<path d="M${f(cx-(w||wQua+6))},${f(y)} H${f(cx+(w||wQua+6))}" stroke="${esc(cor,.3)}" stroke-width="1.4"/>`;
  // roupa de baixo quando não há roupa por cima
  const under=RP.intima!==false, temBaixo=baixo||camadas.some(p=>p.comp==='macacao');
  if(bebe&&!temBaixo){ R.push(pernas(Y(4.35),'#FFFFFF'),`<path d="M${f(X(-wQua))},${f(Y(4.05))} Q${cx},${f(Y(4.4))} ${f(X(wQua))},${f(Y(4.05))}" stroke="#D8DEE6" stroke-width="1.4" fill="none"/>`); }
  else if(!temBaixo&&under&&F&&a>=11){ const ci=RP.corIntima||'#6C7A89', yc=tipo==='gordo'?3.36:3.22;
   R.push(`<path d="M${f(X(-wQua-8))},${f(Y(yc-.04))} Q${cx},${f(Y(yc+.08))} ${f(X(wQua+8))},${f(Y(yc-.04))} L${f(X(wCox+8))},${f(Y(3.72))} Q${f(X(wCox*.45))},${f(Y(3.8))} ${f(X(.05*hp))},${f(Y(4.1))} L${f(X(-.05*hp))},${f(Y(4.1))} Q${f(X(-wCox*.45))},${f(Y(3.8))} ${f(X(-wCox-8))},${f(Y(3.72))}Z" fill="${ci}"/><path d="M${f(X(-wQua-8))},${f(Y(yc+.03))} Q${cx},${f(Y(yc+.15))} ${f(X(wQua+8))},${f(Y(yc+.03))}" stroke="${esc(ci,.3)}" stroke-width="1.2" fill="none"/>`); }
  else if(!temBaixo&&under) R.push(pernas(Y(F?4.18:4.32),RP.corIntima||(F?'#6C7A89':'#3E4C66')),linha(Y(3.42),RP.corIntima||'#3E4C66'));
  if(!camadas.length&&under&&(F&&a>=11)){ const ci=RP.corIntima||'#6C7A89', w=wPei, yb=a<14?2.45:2.55;
   R.push(`<path d="M${f(X(-w-6))},${f(Y(2.12))} Q${f(X(-w*.5))},${f(Y(1.98))} ${f(X(-.05*hp))},${f(Y(2.26))} L${f(X(.05*hp))},${f(Y(2.26))} Q${f(X(w*.5))},${f(Y(1.98))} ${f(X(w+6))},${f(Y(2.12))} L${f(X(w+6))},${f(Y(yb-.05))} Q${f(X(w*.5))},${f(Y(yb+.08))} ${f(X(.04*hp))},${f(Y(yb-.02))} L${f(X(-.04*hp))},${f(Y(yb-.02))} Q${f(X(-w*.5))},${f(Y(yb+.08))} ${f(X(-w-6))},${f(Y(yb-.05))}Z" fill="${ci}"/>`,
    `<path d="M${f(X(-w*.5))},${f(Y(2.03))} L${f(X(-wPes-.1*hp))},${f(Y(1.25))} M${f(X(w*.5))},${f(Y(2.03))} L${f(X(wPes+.1*hp))},${f(Y(1.25))}" stroke="${ci}" stroke-width="${f(.05*hp)}"/>`,
    `<path d="M${f(X(-w*.85))},${f(Y(yb-.04))} Q${f(X(-w*.5))},${f(Y(2.05))} ${f(X(-.05*hp))},${f(Y(2.3))} M${f(X(w*.85))},${f(Y(yb-.04))} Q${f(X(w*.5))},${f(Y(2.05))} ${f(X(.05*hp))},${f(Y(2.3))}" stroke="${esc(ci,.25)}" stroke-width=".9" fill="none" opacity=".6"/>`); }
  if(!camadas.length&&under&&a>=3&&a<11) R.push(tronco(Y(1.45),Y(3.5),'#F1F3F5'));
  if(RP.meiaCalca) R.push(`<rect x="0" y="${f(Y(3.3))}" width="240" height="${f(chao-Y(3.3))}" fill="${RP.meiaCalca}" opacity=".55"/>`);
  // parte de baixo
  if(baixo&&baixo.tipo!=='saia'){ const tb=baixo.tipo||'calca', fill=tinta(baixo), cor=baixo.cor||'#34495E';
   const fim=Y({short:4.6,shortinho:4.22,bermuda:5.25,capri:6.0,cargo:5.25}[tb]||7.0);
   R.push(pernas(fim,fill,Y(3.0)),linha(Y(3.08),cor));
   if(baixo.jeans||tb==='jeans') R.push(`<path d="M${f(X(-wCox*.6))},${f(Y(3.5))} q${f(.1*hp)},${f(.25*hp)} ${f(.28*hp)},${f(.2*hp)} M${f(X(wCox*.6))},${f(Y(3.5))} q${f(-.1*hp)},${f(.25*hp)} ${f(-.28*hp)},${f(.2*hp)}" stroke="${cla(cor,.4)}" stroke-width="1.1" fill="none" stroke-dasharray="2 1.5"/>`);
   if(tb!=='legging') for(const s of [-1,1]) if(fim>Y(5.5)) R.push(`<path d="M${f(X(s*wMco*.5))},${f(Y(3.7))} L${f(X(s*wJoe*.55))},${f(Y(6.9))}" stroke="${esc(cor,.18)}" stroke-width="1" opacity=".6"/>`);
   if(tb==='jogger') R.push(faixa(Y(6.8),Y(7.0),esc(cor,.15)));
   if(tb==='cargo') for(const s of [-1,1]) R.push(`<rect x="${f(X(s>0?wMco*.45:-wMco*.45-.24*hp))}" y="${f(Y(4.3))}" width="${f(.24*hp)}" height="${f(.3*hp)}" fill="${esc(cor,.08)}" stroke="${esc(cor,.35)}" stroke-width="1" rx="1"/>`);
   if(fim<Y(5.4)&&tb!=='legging'&&!baixo.rasgado) R.push(linha(fim-1,cor,200));
   if(baixo.rasgado){ let d=`M${f(X(-wCox-9))},${f(fim+2)}`; for(let i=0;i<=16;i++){ const x=X(-wCox-9+(2*wCox+18)*i/16); d+=` L${f(x)},${f(fim-(i%2?(.12+.1*((i*7)%3)/2)*hp:0))}`; } R.push(`<path d="${d} L${f(X(wCox+9))},${f(fim+10)} L${f(X(-wCox-9))},${f(fim+10)}Z" fill="${pele}"/>`); }
   if(baixo.refletivo) R.push(faixa(Y(6.1),Y(6.24),'#F2F2F0'),faixa(Y(6.15),Y(6.19),'#D7DE3A'));
   if(baixo.listraLado) for(const s of [-1,1]) R.push(`<path d="M${f(X(s*(wQua+1)))},${f(Y(3.1))} L${f(X(s*(wTor+2)))},${f(fim)}" stroke="${baixo.listraLado}" stroke-width="2.6"/>`); }
  // partes de cima, de dentro para fora; a peça aberta deixa ver a de baixo pela frente
  camadas.forEach((p,i)=>R.push(camada(p,i,tronco,faixa,pernas)));
  if(RP.jardineira&&baixo){ const fill=tinta(baixo), cor=baixo.cor||'#34495E', w=wPei*.55;
   R.push(`<path d="M${f(X(-w))},${f(Y(2.2))} H${f(X(w))} V${f(Y(3.1))} H${f(X(-w))}Z" fill="${fill}" stroke="${esc(cor,.3)}" stroke-width="1"/><path d="M${f(X(-w*.85))},${f(Y(2.2))} L${f(X(-wPes-.12*hp))},${f(Y(1.25))} M${f(X(w*.85))},${f(Y(2.2))} L${f(X(wPes+.12*hp))},${f(Y(1.25))}" stroke="${fill}" stroke-width="${f(.09*hp)}"/><circle cx="${f(X(-w*.8))}" cy="${f(Y(2.28))}" r="1.5" fill="#E9C46A"/><circle cx="${f(X(w*.8))}" cy="${f(Y(2.28))}" r="1.5" fill="#E9C46A"/><rect x="${f(X(-w*.45))}" y="${f(Y(2.4))}" width="${f(w*.9)}" height="${f(.22*hp)}" fill="none" stroke="${esc(cor,.3)}" stroke-width=".9"/>`); }
  if(RP.suspensorio) R.push(`<path d="M${f(X(-wPei*.55))},${f(Y(3.05))} L${f(X(-wPes-.1*hp))},${f(Y(1.25))} M${f(X(wPei*.55))},${f(Y(3.05))} L${f(X(wPes+.1*hp))},${f(Y(1.25))}" stroke="${RP.suspensorio}" stroke-width="${f(.06*hp)}"/>`);
  if(RP.cinto&&baixo&&baixo.tipo!=='saia'||RP.cinto&&RP.vestido){ const cc=RP.cinto===true?'#3A2A20':RP.cinto, yc=RP.vestido?2.92:3.02;
   R.push(faixa(Y(yc),Y(yc+.1),cc),`<rect x="${f(cx-.07*hp)}" y="${f(Y(yc)-.5)}" width="${f(.14*hp)}" height="${f(Y(yc+.1)-Y(yc)+1)}" fill="none" stroke="#D4B04C" stroke-width="1.2" rx="1"/>`);
   if(RP.cintoFerramentas) for(const s of [-1,1]) R.push(`<rect x="${f(X(s>0?wCin*.35:-wCin*.35-.22*hp))}" y="${f(Y(yc+.06))}" width="${f(.22*hp)}" height="${f(.32*hp)}" fill="${esc(cc,.1)}" stroke="${esc(cc,.4)}" stroke-width="1" rx="1.5"/>`); }
  if(AC.has('faixaPresidencial')) R.push(`<path d="M${f(X(-wOmb*.75))},${f(Y(1.3))} L${f(X(-wOmb*.75+.3*hp))},${f(Y(1.3))} L${f(X(wQua))},${f(Y(3.3))} L${f(X(wQua-.3*hp))},${f(Y(3.4))}Z" fill="#1B9E4B"/><path d="M${f(X(-wOmb*.75+.1*hp))},${f(Y(1.3))} L${f(X(-wOmb*.75+.2*hp))},${f(Y(1.3))} L${f(X(wQua-.1*hp))},${f(Y(3.35))} L${f(X(wQua-.2*hp))},${f(Y(3.37))}Z" fill="#F7D417"/>`);
  if(AC.has('medalhas')) [0,1,2].forEach(i=>R.push(`<rect x="${f(X(-wPei*.75+i*.13*hp))}" y="${f(Y(2.0))}" width="${f(.11*hp)}" height="${f(.07*hp)}" fill="${['#C1121F','#2A9D8F','#E9C46A'][i]}" stroke="#333" stroke-width=".4"/>`));
  // meias e calçados (dentro da silhueta: seguem o pé)
  R.push(calcados(faixa));
  return R.join(''); }

 function camada(p,i,tronco,faixa,pernas){ const fill=tinta(p), cor=p.cor||'#4F86F7', g=p.gola||'redonda', R=[], fundo=i>0?tinta(camadas[i-1]):pele;
  const fim=Y({cropped:2.75,top:2.58,cintura:(baixo?3.06:3.55),quadril:3.55,longo:3.95,vestido:3.6,joelho:3.55,tornozelo:3.55,macacao:3.55,colete:3.3}[p.comp]||3.55);
  const semOmbro=g==='regata'||g==='alcinha'||g==='tomara'||g==='colete';
  if(!semOmbro) R.push(faixa(Y(g==='alta'?.93:1.15),Y(1.97),fill));
  R.push(tronco(g==='alcinha'?Y(1.93):g==='tomara'?Y(1.98):Y(1.2),fim,fill));
  if(p.comp==='macacao') R.push(pernas(Y(p.calcaComp||7.0),fill,Y(3.0)));
  if(!p.aberto){ const dec=(w,yv)=>`<path d="M${f(X(-w))},${f(Y(1.2))} Q${cx},${f(Y(yv))} ${f(X(w))},${f(Y(1.2))} V${f(Y(1.05))} H${f(X(-w))}Z" fill="${fundo}"/><path d="M${f(X(-w))},${f(Y(1.2))} Q${cx},${f(Y(yv))} ${f(X(w))},${f(Y(1.2))}" stroke="${esc(cor,.25)}" stroke-width="1.2" fill="none"/>`;
   if(g==='redonda') R.push(dec(wPes*1.3,1.48));
   else if(g==='canoa') R.push(dec(wPes*2.1,1.32));
   else if(g==='colarinho') R.push(dec(wPes*1.25,1.4));
   else if(g==='mandarim') R.push(dec(wPes*1.05,1.24));
   else if(g==='v') R.push(`<path d="M${f(X(-wPes*1.3))},${f(Y(1.05))} V${f(Y(1.2))} L${cx},${f(Y(p.vFundo||1.85))} L${f(X(wPes*1.3))},${f(Y(1.2))} V${f(Y(1.05))}Z" fill="${fundo}"/><path d="M${f(X(-wPes*1.3))},${f(Y(1.2))} L${cx},${f(Y(p.vFundo||1.85))} L${f(X(wPes*1.3))},${f(Y(1.2))}" stroke="${esc(cor,.25)}" stroke-width="1.2" fill="none"/>`);
   else if(g==='regata') R.push(dec(wPes*1.3,1.5),`<path d="M${f(X(-wPes-.1*hp))},${f(Y(1.2))} H${f(X(wPes+.1*hp))} L${f(X(wPei*.7))},${f(Y(2.05))} H${f(X(-wPei*.7))}Z" fill="${fill}"/><path d="M${f(X(-wPes-.1*hp))},${f(Y(1.2))} Q${cx},${f(Y(1.62))} ${f(X(wPes+.1*hp))},${f(Y(1.2))} V${f(Y(1.1))} H${f(X(-wPes-.1*hp))}Z" fill="${fundo}"/>`);
   else if(g==='alta') R.push(`<path d="M${f(X(-wPes*1.2))},${f(Y(1.08))} Q${cx},${f(Y(1.13))} ${f(X(wPes*1.2))},${f(Y(1.08))}" stroke="${esc(cor,.25)}" stroke-width="1.1" fill="none"/>`); }
  if(g==='alcinha') R.push(`<path d="M${f(X(-wPei*.55))},${f(Y(1.97))} L${f(X(-wPes-.12*hp))},${f(Y(1.22))} M${f(X(wPei*.55))},${f(Y(1.97))} L${f(X(wPes+.12*hp))},${f(Y(1.22))}" stroke="${fill}" stroke-width="${f(.045*hp)}"/><path d="M${f(X(-wAx-4))},${f(Y(1.95))} Q${cx},${f(Y(2.02))} ${f(X(wAx+4))},${f(Y(1.95))}" stroke="${esc(cor,.25)}" stroke-width="1.2" fill="none"/>`);
  if(g==='tomara') R.push(`<path d="M${f(X(-wAx-4))},${f(Y(2.0))} H${f(X(wAx+4))}" stroke="${esc(cor,.3)}" stroke-width="1.4"/>`);
  if(!['macacao','joelho','tornozelo'].includes(p.comp)) R.push(`<path d="M${f(X(-wQua-8))},${f(fim)} H${f(X(wQua+8))}" stroke="${esc(cor,.3)}" stroke-width="1.4"/>`);
  if(p.barra) R.push(faixa(fim-.16*hp,fim,esc(cor,.12)));
  // detalhes
  const bx=p.aberto?X(.16*hp):cx;
  if(p.botoes){ const y0=Y(p.gola==='colarinho'?1.55:1.7), y1=Math.min(fim,Y(3.3))-4, n=p.botoes; for(let k=0;k<n;k++) R.push(`<circle cx="${f(bx)}" cy="${f(n===1?Y(2.75):y0+(y1-y0)*k/Math.max(1,n-1))}" r="1.3" fill="${esc(cor,.4)}"/>`);
   if(!p.aberto&&n>2) R.push(`<path d="M${cx},${f(Y(1.42))} V${f(fim)}" stroke="${esc(cor,.2)}" stroke-width="1"/>`); }
  if(p.duplo) for(const s of [-1,1]) for(let k=0;k<4;k++) R.push(`<circle cx="${f(X(s*.13*hp))}" cy="${f(Y(1.6+k*.38))}" r="1.3" fill="${esc(cor,.35)}"/>`);
  if(p.ziper&&!p.aberto) R.push(`<path d="M${cx},${f(Y(1.3))} V${f(fim)}" stroke="${esc(cor,.35)}" stroke-width="1.2"/><rect x="${f(cx-1.2)}" y="${f(Y(1.3))}" width="2.4" height="4" fill="#C9CED6"/>`);
  if(p.bolso) R.push(`<rect x="${f(X(wPei*.2))}" y="${f(Y(1.95))}" width="${f(wPei*.42)}" height="${f(.24*hp)}" fill="none" stroke="${esc(cor,.3)}" stroke-width="1"/>`);
  if(p.bolsos2) for(const s of [-1,1]) R.push(`<rect x="${f(s>0?X(wPei*.18):X(-wPei*.62))}" y="${f(Y(1.9))}" width="${f(wPei*.44)}" height="${f(.28*hp)}" fill="${esc(cor,.05)}" stroke="${esc(cor,.35)}" stroke-width="1"/><path d="M${f(s>0?X(wPei*.18):X(-wPei*.62))},${f(Y(1.98))} h${f(wPei*.44)}" stroke="${esc(cor,.35)}" stroke-width="1"/>`);
  if(p.bolsoCanguru) R.push(`<path d="M${f(X(-wCin*.6))},${f(Y(3.45))} L${f(X(-wCin*.45))},${f(Y(3.0))} H${f(X(wCin*.45))} L${f(X(wCin*.6))},${f(Y(3.45))}" fill="${esc(cor,.06)}" stroke="${esc(cor,.3)}" stroke-width="1"/>`);
  if(p.refletivo){ const rc=p.refletivo===true?'#F2F2F0':p.refletivo; for(const u of [2.5,3.2]) R.push(faixa(Y(u),Y(u+.12),rc),faixa(Y(u+.045),Y(u+.075),'#D7DE3A')); }
  if(p.cruz) R.push(`<path d="M${f(X(wPei*.42))},${f(Y(1.92))} v${f(.24*hp)} M${f(X(wPei*.42)-.12*hp)},${f(Y(2.04))} h${f(.24*hp)}" stroke="${p.cruz===true?'#D62828':p.cruz}" stroke-width="${f(.07*hp)}"/>`);
  if(p.distintivo) R.push(`<path d="${estrela(X(-wPei*.45),Y(2.05),.13*hp)}" fill="#E9C46A" stroke="#9C7A1F" stroke-width=".8"/>`);
  if(p.estampa){ const e=p.estampa, ec=p.corEstampa||cla(cor,.75), ex=p.estampaPeito?X(wPei*.4):cx, ey=Y(p.estampaPeito?2.05:2.45), r=p.estampaPeito?.1*hp:.24*hp;
   R.push({circulo:`<circle cx="${f(ex)}" cy="${f(ey)}" r="${f(r)}" fill="${ec}"/>`,estrela:`<path d="${estrela(ex,ey,r*1.2)}" fill="${ec}"/>`,coracao:`<path d="${coracao(ex,ey,r)}" fill="${ec}"/>`,
    raio:`<path d="M${f(ex+r*.2)},${f(ey-r)} L${f(ex-r*.5)},${f(ey+r*.1)} H${f(ex)} L${f(ex-r*.2)},${f(ey+r)} L${f(ex+r*.5)},${f(ey-r*.1)} H${f(ex)}Z" fill="${ec}"/>`,
    faixa:`<rect x="0" y="${f(ey-r*.35)}" width="240" height="${f(r*.7)}" fill="${ec}"/>`,
    caveira:`<circle cx="${f(ex)}" cy="${f(ey-r*.15)}" r="${f(r*.8)}" fill="${ec}"/><rect x="${f(ex-r*.4)}" y="${f(ey+r*.4)}" width="${f(r*.8)}" height="${f(r*.4)}" fill="${ec}"/><circle cx="${f(ex-r*.32)}" cy="${f(ey-r*.15)}" r="${f(r*.22)}" fill="${cor}"/><circle cx="${f(ex+r*.32)}" cy="${f(ey-r*.15)}" r="${f(r*.22)}" fill="${cor}"/>`,
    numero:`<text x="${f(ex)}" y="${f(ey+r*.6)}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="${f(r*1.9)}" fill="${ec}">${p.numero||10}</text>`,
    logo:`<path d="M${f(ex-r*.9)},${f(ey+r*.3)} Q${f(ex)},${f(ey-r*.9)} ${f(ex+r*.9)},${f(ey-r*.2)}" stroke="${ec}" stroke-width="${f(r*.3)}" fill="none" stroke-linecap="round"/>`}[e]||''); }
  if(p.cracha) R.push(`<rect x="${f(X(-wPei*.62))}" y="${f(Y(2.0))}" width="${f(.2*hp)}" height="${f(.13*hp)}" fill="#fff" stroke="#9AA" stroke-width=".6"/><rect x="${f(X(-wPei*.62))}" y="${f(Y(2.0))}" width="${f(.2*hp)}" height="${f(.035*hp)}" fill="#3A6EA5"/>`);
  let s=R.join('');
  if(p.aberto){ const gT=(p.gT||.14)*hp, gB=(p.gB??.04)*hp, yV=Y(p.yV||1.4), cid=`ab${id}${i}`;
   const poly=k=>`M${f(cx+k*300)},-10 L${f(cx+k*gT)},-10 L${f(cx+k*gT)},${f(Y(1.15))} L${f(cx+k*gB)},${f(yV)} L${f(cx+k*gB)},410 L${f(cx+k*300)},410Z`;
   defsX.push(`<clipPath id="${cid}"><path d="${poly(-1)} ${poly(1)}"/></clipPath>`);
   const borda=k=>`M${f(cx+k*gT)},${f(Y(1.15))} L${f(cx+k*gB)},${f(yV)} L${f(cx+k*gB)},${f(fim)}`;
   s=`<g clip-path="url(#${cid})">${s}${p.lapela?[-1,1].map(k=>`<path d="M${f(cx+k*gT)},${f(Y(1.15))} L${f(cx+k*(gT+.14*hp))},${f(Y(1.55))} L${f(cx+k*(gB+.02*hp))},${f(yV)}Z" fill="${esc(cor,.12)}" stroke="${esc(cor,.4)}" stroke-width="1"/>`).join(''):''}<path d="${borda(-1)} ${borda(1)}" stroke="${esc(cor,.45)}" stroke-width="1.6" fill="none"/></g>`; }
  return s; }

 function calcados(faixa){ const s=RP.sapato, R=[]; if(bebe) return '';
  const meia=s&&s.meia; if(meia) R.push(faixa(Y(s.meiaAlta?5.6:6.55),Y(7.3),meia===true?'#F4F4F2':meia));
  if(!s||s.tipo==='descalco') return R.join('');
  const cor=s.cor||'#3A2A25', tp=s.tipo||'social', fx=k=>X(k*(wTor+.21*hp)/2);
  const ini={bota:6.25,botaCano:5.7,coturno:6.35,galocha:5.95,tenis:7.05,social:7.08,salto:7.22,sapatilha:7.25,sandalia:7.42,chinelo:7.47,botaNeve:6.4}[tp]||7.08;
  R.push(faixa(Y(ini),chao+10,cor));
  if(tp==='tenis') R.push(faixa(Y(7.4),chao+10,s.sola||'#F4F4F2'),...[-1,1].map(k=>`<path d="M${f(fx(k)-.06*hp)},${f(Y(7.14))} h${f(.12*hp)} M${f(fx(k)-.05*hp)},${f(Y(7.22))} h${f(.1*hp)}" stroke="${s.cadarco||'#fff'}" stroke-width="1.1"/>`));
  if(tp==='social'||tp==='sapatilha') R.push(...[-1,1].map(k=>`<ellipse cx="${f(fx(k)+k*.04*hp)}" cy="${f(Y(7.3))}" rx="${f(.07*hp)}" ry="${f(.035*hp)}" fill="#fff" opacity=".3"/>`));
  if(tp==='salto') R.push(...[-1,1].map(k=>`<path d="M${f(fx(k)-.1*hp)},${f(Y(7.22))} Q${f(fx(k))},${f(Y(7.3))} ${f(fx(k)+.1*hp)},${f(Y(7.22))}" stroke="${esc(cor,.35)}" stroke-width="1" fill="none"/>`));
  if(tp==='sandalia'){ R.pop(); R.push(faixa(Y(7.5),chao+10,esc(cor,.15)),faixa(Y(7.15),Y(7.21),cor),faixa(Y(7.32),Y(7.38),cor)); }
  if(tp==='chinelo') R.push(...[-1,1].map(k=>`<path d="M${f(fx(k)-.09*hp)},${f(Y(7.47))} L${f(fx(k))},${f(Y(7.25))} L${f(fx(k)+.09*hp)},${f(Y(7.47))}" stroke="${s.tira||cla(cor,.3)}" stroke-width="1.6" fill="none"/>`));
  if(['bota','botaCano','coturno','galocha','botaNeve'].includes(tp)) R.push(faixa(Y(7.43),chao+10,esc(cor,.35)),`<path d="M0,${f(Y(ini)+1)} H240" stroke="${esc(cor,.35)}" stroke-width="1.4"/>`);
  if(tp==='coturno') R.push(...[-1,1].map(k=>`<path d="${[6.5,6.7,6.9,7.1].map(u=>`M${f(fx(k)-.06*hp)},${f(Y(u))} l${f(.12*hp)},${f(.08*hp)} M${f(fx(k)+.06*hp)},${f(Y(u))} l${f(-.12*hp)},${f(.08*hp)}`).join(' ')}" stroke="#777" stroke-width=".8"/>`));
  if(tp==='galocha') R.push(...[-1,1].map(k=>`<path d="M${f(fx(k)-.05*hp)},${f(Y(6.1))} V${f(Y(7.0))}" stroke="#fff" stroke-width="2" opacity=".35" stroke-linecap="round"/>`));
  if(tp==='botaNeve') R.push(faixa(Y(6.4),Y(6.62),s.pelo||'#EFE6DA'));
  return R.join(''); }

 function saiaDe(sa){ const p=sa.p, fill=tinta(p), cor=p.cor||'#2E4A8B', y0=Y(sa.y0||2.95), y1=Y(sa.comp), w0=wCin+2;
  const k={lapis:1.02,reta:1.16,rodada:1.35,gode:1.6,sereia:1.02}[sa.forma]??1.35, w1=Math.max(wQua+3,wQua*k+(k>1.2?.2*hp*(sa.comp>6?1.6:1):2)), lg=sa.comp>6, wm=sa.forma==='sereia'&&sa.comp>6?wJoe*1.2+2:null;
  const R=[];
  if(wm) R.push(`<path d="M${f(X(-w0))},${f(y0)} Q${f(X(-wQua-4))},${f(Y(3.5))} ${f(X(-wMco-2))},${f(Y(4.7))} L${f(X(-wm))},${f(Y(5.6))} Q${f(X(-wQua*1.5))},${f(y1-.1*hp)} ${f(X(-wQua*1.6))},${f(y1)} Q${cx},${f(y1+.12*hp)} ${f(X(wQua*1.6))},${f(y1)} Q${f(X(wQua*1.5))},${f(y1-.1*hp)} ${f(X(wm))},${f(Y(5.6))} L${f(X(wMco+2))},${f(Y(4.7))} Q${f(X(wQua+4))},${f(Y(3.5))} ${f(X(w0))},${f(y0)}Z" fill="${fill}" stroke="${esc(cor,.4)}" stroke-width="1.4"/>`);
  else R.push(`<path d="M${f(X(-w0))},${f(y0)} Q${f(X(-wQua-4))},${f(Y(3.45))} ${f(X(-(lg&&k<1.2?wQua+3:w1)))},${f(lg&&k<1.2?Y(4.2):y1)} ${lg&&k<1.2?`L${f(X(-w1))},${f(y1)}`:''} Q${cx},${f(y1+.12*hp)} ${f(X(w1))},${f(y1)} ${lg&&k<1.2?`L${f(X(wQua+3))},${f(Y(4.2))}`:''} Q${f(X(wQua+4))},${f(Y(3.45))} ${f(X(w0))},${f(y0)}Z" fill="${fill}" stroke="${esc(cor,.4)}" stroke-width="1.4"/>`);
  if(k>=1.2) R.push(`<path d="M${f(X(-wQua*.4))},${f(Y(3.4))} Q${f(X(-wQua*.5))},${f((Y(3.4)+y1)/2)} ${f(X(-w1*.55))},${f(y1)} M${f(X(wQua*.35))},${f(Y(3.4))} Q${f(X(wQua*.45))},${f((Y(3.4)+y1)/2)} ${f(X(w1*.5))},${f(y1)}" stroke="${esc(cor,.2)}" stroke-width="1.2" fill="none"/>`);
  if(sa.forma==='lapis'&&!lg) R.push(`<path d="M${cx},${f(y1-.35*hp)} V${f(y1)}" stroke="${esc(cor,.35)}" stroke-width="1"/>`);
  return R.join(''); }

 function abaLonga(p){ const fill=tinta(p), cor=p.cor||'#fff', ln=esc(cor,.4), y0=Y(3.3), y1=Y(p.comp==='joelho'?5.5:7.3), w0=wQua+3, w1=wQua*(p.comp==='joelho'?1.12:1.25)+.12*hp;
  if(!p.aberto) return `<path d="M${f(X(-w0))},${f(y0)} L${f(X(-w1))},${f(y1)} Q${cx},${f(y1+.08*hp)} ${f(X(w1))},${f(y1)} L${f(X(w0))},${f(y0)}Z" fill="${fill}" stroke="${ln}" stroke-width="1.4"/><path d="M${f(X(-wQua*.3))},${f(Y(3.6))} L${f(X(-w1*.4))},${f(y1)} M${f(X(wQua*.3))},${f(Y(3.6))} L${f(X(w1*.4))},${f(y1)}" stroke="${esc(cor,.2)}" stroke-width="1.1"/>`;
  const g=(p.gB??.04)*hp; return [-1,1].map(k=>`<path d="M${f(X(k*w0))},${f(y0)} L${f(X(k*w1))},${f(y1)} L${f(X(k*(g+.1*hp)))},${f(y1)} L${f(X(k*g))},${f(y0)}Z" fill="${fill}" stroke="${ln}" stroke-width="1.4"/>${p.bolso?`<rect x="${f(X(k>0?w0*.35:-w0*.35-.26*hp))}" y="${f(Y(3.75))}" width="${f(.26*hp)}" height="${f(.24*hp)}" fill="none" stroke="${ln}" stroke-width="1"/>`:''}`).join(''); }

 function roupasFora(){ const R=[];
  for(const sa of saias) R.push(saiaDe(sa));
  for(const p of camadas) if(p.comp==='joelho'||p.comp==='tornozelo') R.push(abaLonga(p));
  // avental
  if(RP.avental){ const av=typeof RP.avental==='string'?{cor:RP.avental}:RP.avental, ac=av.cor||'#F4F4F2', fill=tinta(av), ln=esc(ac,.35);
   if(av.curto) R.push(`<path d="M${f(X(-wQua*.85))},${f(Y(3.05))} H${f(X(wQua*.85))} L${f(X(wQua*.8))},${f(Y(4.6))} Q${cx},${f(Y(4.68))} ${f(X(-wQua*.8))},${f(Y(4.6))}Z" fill="${fill}" stroke="${ln}" stroke-width="1.2"/>`);
   else R.push(`<path d="M${f(X(-wPei*.55))},${f(Y(1.75))} H${f(X(wPei*.55))} L${f(X(wCin*.85))},${f(Y(2.9))} L${f(X(wQua*.95))},${f(Y(4.9))} Q${cx},${f(Y(5.0))} ${f(X(-wQua*.95))},${f(Y(4.9))} L${f(X(-wCin*.85))},${f(Y(2.9))}Z" fill="${fill}" stroke="${ln}" stroke-width="1.2"/><path d="M${f(X(-wPei*.5))},${f(Y(1.76))} L${f(X(-wPes*.9))},${f(Y(1.08))} M${f(X(wPei*.5))},${f(Y(1.76))} L${f(X(wPes*.9))},${f(Y(1.08))}" stroke="${ac}" stroke-width="2"/><rect x="${f(X(-wCin*.35))}" y="${f(Y(3.4))}" width="${f(wCin*.7)}" height="${f(.3*hp)}" fill="none" stroke="${ln}" stroke-width="1"/>`); }
  // golas e gravatas
  const vis=camadas.filter((p,i)=>!camadas.slice(i+1).some(q=>!q.aberto&&q.gola!=='alcinha'&&q.gola!=='tomara'&&q.gola!=='regata'&&q.gola!=='colete'));
  for(const p of vis){ const cor=p.cor||'#fff', ln=esc(cor,.35);
   if(p.gola==='colarinho'&&!p.aberto) R.push([-1,1].map(k=>`<path d="M${f(X(k*(wPes+1)))},${f(Y(1.0))} L${f(X(k*wPes*1.55))},${f(Y(1.32))} L${f(X(k*.03*hp))},${f(Y(1.44))} L${f(X(k*wPes*.75))},${f(Y(1.12))}Z" fill="${p.corGola||cor}" stroke="${ln}" stroke-width="1"/>`).join(''));
   if(p.gola==='colarinho'&&p.aberto) R.push([-1,1].map(k=>`<path d="M${f(X(k*(wPes+1)))},${f(Y(.98))} L${f(X(k*wPes*1.9))},${f(Y(1.38))} L${f(X(k*(p.gT||.14)*hp))},${f(Y(1.25))}Z" fill="${p.corGola||cor}" stroke="${ln}" stroke-width="1"/>`).join(''));
   if(p.gola==='mandarim') R.push(`<path d="M${f(X(-wPes-1))},${f(Y(1.0))} L${f(X(-wPes-1))},${f(Y(1.16))} Q${cx},${f(Y(1.26))} ${f(X(wPes+1))},${f(Y(1.16))} L${f(X(wPes+1))},${f(Y(1.0))}" fill="none" stroke="${ln}" stroke-width="1.3"/>`);
   if(p.capuz) R.push(`<path d="M${f(X(-.08*hp))},${f(Y(1.4))} v${f(.45*hp)} M${f(X(.08*hp))},${f(Y(1.4))} v${f(.4*hp)}" stroke="${cla(cor,.6)}" stroke-width="1.1"/>`); }
  const gv=RP.gravata||c.gravata||(camadas.find(p=>p.gravata)||{}).gravata;
  if(gv&&camadas.some(p=>p.gola==='colarinho')){ const gp=typeof gv==='string'?{cor:gv}:gv, gc=gp.cor||'#9B2335', gf=tinta(gp);
   R.push(`<path d="M${f(X(-.045*hp))},${f(Y(1.36))} L${f(X(.045*hp))},${f(Y(1.36))} L${f(X(.032*hp))},${f(Y(1.5))} L${f(X(-.032*hp))},${f(Y(1.5))}Z" fill="${gf}" stroke="${esc(gc,.4)}" stroke-width=".9"/><path d="M${f(X(-.03*hp))},${f(Y(1.5))} L${f(X(.03*hp))},${f(Y(1.5))} L${f(X(.06*hp))},${f(Y(2.5))} L${cx},${f(Y(2.62))} L${f(X(-.06*hp))},${f(Y(2.5))}Z" fill="${gf}" stroke="${esc(gc,.4)}" stroke-width=".9"/>`); }
  if(RP.borboleta){ const bc=RP.borboleta; R.push(`<path d="M${cx},${f(Y(1.42))} L${f(X(-.14*hp))},${f(Y(1.34))} L${f(X(-.14*hp))},${f(Y(1.52))}Z M${cx},${f(Y(1.42))} L${f(X(.14*hp))},${f(Y(1.34))} L${f(X(.14*hp))},${f(Y(1.52))}Z" fill="${bc}" stroke="${esc(bc,.4)}" stroke-width=".8"/><circle cx="${cx}" cy="${f(Y(1.42))}" r="1.8" fill="${esc(bc,.15)}"/>`); }
  if(RP.lenco){ const lc=RP.lenco; R.push(`<path d="M${f(X(-wPes-1))},${f(Y(1.05))} Q${cx},${f(Y(1.3))} ${f(X(wPes+1))},${f(Y(1.05))} L${f(X(wPes+2))},${f(Y(1.2))} Q${cx},${f(Y(1.42))} ${f(X(-wPes-2))},${f(Y(1.2))}Z" fill="${lc}"/><path d="M${f(X(.04*hp))},${f(Y(1.32))} l${f(.1*hp)},${f(.28*hp)} l${f(.06*hp)},${f(-.04*hp)}Z" fill="${lc}" stroke="${esc(lc,.3)}" stroke-width=".7"/>`); }
  if(AC.has('cachecol')){ const cc=ac('cachecol',c.corCachecol)||'#C1121F', cf=tinta({cor:cc,padrao:c.padraoCachecol,cor2:'#F4F4F2'}); R.push(`<path d="M${f(X(-wPes-3))},${f(Y(.98))} Q${cx},${f(Y(1.12))} ${f(X(wPes+3))},${f(Y(.98))} L${f(X(wPes+4))},${f(Y(1.28))} Q${cx},${f(Y(1.42))} ${f(X(-wPes-4))},${f(Y(1.28))}Z" fill="${cf}" stroke="${esc(cc,.35)}" stroke-width="1"/><path d="M${f(X(-wPes*.6))},${f(Y(1.3))} L${f(X(-wPes*.9))},${f(Y(2.4))} L${f(X(-wPes*.1))},${f(Y(2.42))} L${f(X(wPes*.1))},${f(Y(1.33))}Z" fill="${cf}" stroke="${esc(cc,.35)}" stroke-width="1"/>`); }
  if(AC.has('cracha')) R.push(`<path d="M${f(X(-wPes-1))},${f(Y(1.12))} L${cx},${f(Y(2.15))} L${f(X(wPes+1))},${f(Y(1.12))}" stroke="#2B5D9E" stroke-width="1.2" fill="none"/><rect x="${f(X(-.1*hp))}" y="${f(Y(2.15))}" width="${f(.2*hp)}" height="${f(.27*hp)}" rx="1" fill="#fff" stroke="#9AA" stroke-width=".7"/><rect x="${f(X(-.1*hp))}" y="${f(Y(2.15))}" width="${f(.2*hp)}" height="${f(.06*hp)}" fill="#2B5D9E"/><circle cx="${cx}" cy="${f(Y(2.3))}" r="1.6" fill="#B8C4D0"/>`);
  if(AC.has('apito')) R.push(`<path d="M${f(X(-wPes-1))},${f(Y(1.12))} L${cx},${f(Y(2.0))} L${f(X(wPes+1))},${f(Y(1.12))}" stroke="${ac('apito',c.corApito)||'#E63946'}" stroke-width="1" fill="none"/><rect x="${f(X(-.06*hp))}" y="${f(Y(2.0))}" width="${f(.14*hp)}" height="${f(.07*hp)}" rx="1.5" fill="#C9CED6" stroke="#777" stroke-width=".6"/>`);
  if(AC.has('estetoscopio')) R.push(`<path d="M${f(X(-wPes-1))},${f(Y(1.08))} Q${f(X(-wPes*1.6))},${f(Y(1.6))} ${f(X(-.3*hp))},${f(Y(2.15))} M${f(X(wPes+1))},${f(Y(1.08))} Q${f(X(wPes*1.6))},${f(Y(1.5))} ${f(X(.24*hp))},${f(Y(2.0))} Q${f(X(.18*hp))},${f(Y(2.2))} ${f(X(.22*hp))},${f(Y(2.3))}" stroke="#2D3142" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="${f(X(.22*hp))}" cy="${f(Y(2.34))}" r="2.6" fill="#C9CED6" stroke="#555" stroke-width=".8"/>`);
  return R.join(''); }

 // por cima dos braços: ombreiras, alças, coisas na mão
 function sobreBracos(){ const R=[];
  if(RP.dragonas) for(const k of [-1,1]) R.push(`<path d="M${f(X(k*(wPes+.12*hp)))},${f(Y(1.2))} L${f(X(k*(wOmb-.05*hp)))},${f(Y(1.27))} L${f(X(k*(wOmb-.06*hp)))},${f(Y(1.36))} L${f(X(k*(wPes+.13*hp)))},${f(Y(1.3))}Z" fill="${RP.dragonas===true?'#1B263B':RP.dragonas}" stroke="#E9C46A" stroke-width="1"/><path d="M${f(X(k*(wOmb-.25*hp)))},${f(Y(1.25))} V${f(Y(1.33))} M${f(X(k*(wOmb-.18*hp)))},${f(Y(1.26))} V${f(Y(1.34))}" stroke="#E9C46A" stroke-width="1.2"/>`);
  if(AC.has('mochila')){ const mc=ac('mochila',c.corMochila)||'#2B2D42'; for(const k of [-1,1]) R.push(`<path d="M${f(X(k*(wPes+.2*hp)))},${f(Y(1.18))} Q${f(X(k*(wAx*.95)))},${f(Y(1.6))} ${f(X(k*wAx*.85))},${f(Y(2.6))}" stroke="${mc}" stroke-width="${f(.08*hp)}" fill="none" stroke-linecap="round"/>`); }
  if(AC.has('bolsa')){ const bc=ac('bolsa',c.corBolsa)||'#8B5E3C', bx=Ld.W[0]+4, by=Y(3.3); R.push(`<path d="M${f(X(-wPes-.15*hp))},${f(Y(1.18))} L${f(bx-.1*hp)},${f(by)}" stroke="${esc(bc,.2)}" stroke-width="1.8"/><rect x="${f(bx-.3*hp)}" y="${f(by)}" width="${f(.42*hp)}" height="${f(.34*hp)}" rx="3" fill="${bc}" stroke="${esc(bc,.4)}" stroke-width="1.1"/><path d="M${f(bx-.3*hp)},${f(by+.12*hp)} h${f(.42*hp)}" stroke="${esc(bc,.4)}" stroke-width="1"/>`); }
  const mao=L=>[L.W[0]+L.d2[0]*L.mao*.55,L.W[1]+L.d2[1]*L.mao*.55];
  if(AC.has('maleta')){ const [mx,my]=mao(Ld), w=.62*hp, h=.46*hp; R.push(`<path d="M${f(mx-.1*hp)},${f(my)} v${f(-.05*hp)} h${f(.2*hp)} v${f(.05*hp)}" stroke="#2B1D14" stroke-width="1.6" fill="none"/><rect x="${f(mx-w/2)}" y="${f(my)}" width="${f(w)}" height="${f(h)}" rx="2" fill="#5A3A22" stroke="#2B1D14" stroke-width="1.2"/><rect x="${f(mx-2)}" y="${f(my+h*.25)}" width="4" height="3" fill="#E9C46A"/>`); }
  if(AC.has('bengala')){ const [mx,my]=mao(Le); R.push(`<path d="M${f(mx+.15*hp)},${f(my-.02*hp)} Q${f(mx)},${f(my-.18*hp)} ${f(mx-.05*hp)},${f(my)} L${f(mx-.12*hp)},${f(chao)}" stroke="#6B4226" stroke-width="2.6" fill="none" stroke-linecap="round"/>`); }
  if(AC.has('microfone')){ const [mx,my]=mao(Ld); R.push(`<path d="M${f(mx)},${f(my+.1*hp)} L${f(mx+.08*hp)},${f(my-.35*hp)}" stroke="#222" stroke-width="2.6" stroke-linecap="round"/><circle cx="${f(mx+.09*hp)}" cy="${f(my-.42*hp)}" r="${f(.09*hp)}" fill="#555" stroke="#222" stroke-width=".8"/>`); }
  if(AC.has('prancheta')){ const [mx,my]=mao(Le), w=.5*hp, h=.66*hp; R.push(`<rect x="${f(mx-w*.6)}" y="${f(my-h*.6)}" width="${f(w)}" height="${f(h)}" rx="1.5" fill="#B5835A" stroke="#6B4226" stroke-width="1"/><rect x="${f(mx-w*.5)}" y="${f(my-h*.5)}" width="${f(w*.8)}" height="${f(h*.85)}" fill="#fff"/><rect x="${f(mx-w*.3)}" y="${f(my-h*.66)}" width="${f(w*.4)}" height="${f(h*.12)}" fill="#999"/>`); }
  if(AC.has('vassoura')){ const [mx,my]=mao(Ld); R.push(`<path d="M${f(mx)},${f(my-1.2*hp)} L${f(mx+.1*hp)},${f(chao-.5*hp)}" stroke="#A47148" stroke-width="2.4"/><path d="M${f(mx-.12*hp)},${f(chao)} L${f(mx+.02*hp)},${f(chao-.55*hp)} L${f(mx+.2*hp)},${f(chao-.55*hp)} L${f(mx+.34*hp)},${f(chao)}Z" fill="#E9C46A" stroke="#9C7A1F" stroke-width="1"/>`); }
  if(AC.has('chave')){ const [mx,my]=mao(Ld); R.push(`<path d="M${f(mx)},${f(my-.1*hp)} L${f(mx+.05*hp)},${f(my+.6*hp)}" stroke="#9AA0A6" stroke-width="3" stroke-linecap="round"/><path d="M${f(mx-.08*hp)},${f(my-.15*hp)} a${f(.1*hp)},${f(.1*hp)} 0 1,1 ${f(.16*hp)},0" stroke="#9AA0A6" stroke-width="2.4" fill="none"/>`); }
  if(AC.has('celular')){ const [mx,my]=mao(Le), cl=ac('celular','#1B1B1F'); R.push(`<rect x="${f(mx-.1*hp)}" y="${f(my-.12*hp)}" width="${f(.2*hp)}" height="${f(.36*hp)}" rx="2" fill="${cl}" stroke="#111" stroke-width=".8"/><rect x="${f(mx-.075*hp)}" y="${f(my-.09*hp)}" width="${f(.15*hp)}" height="${f(.27*hp)}" rx="1" fill="#6FA8DC" opacity=".8"/>`); }
  if(AC.has('guardaChuva')){ const [mx,my]=mao(Ld), gc=ac('guardaChuva','#1B263B'); R.push(`<path d="M${f(mx-.12*hp)},${f(my-.1*hp)} Q${f(mx)},${f(my-.25*hp)} ${f(mx+.02*hp)},${f(my)}" stroke="#5A3A22" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${f(mx+.02*hp)},${f(my)} L${f(mx-.14*hp)},${f(chao-.25*hp)} L${f(mx+.12*hp)},${f(chao-.3*hp)}Z" fill="${gc}" stroke="${esc(gc,.4)}" stroke-width="1"/><path d="M${f(mx-.01*hp)},${f(chao-.27*hp)} L${f(mx)},${f(chao)}" stroke="#555" stroke-width="1.6"/>`); }
  if(AC.has('sacola')){ const [mx,my]=mao(Ld), sc=ac('sacola','#E9C46A'), w=.55*hp, h=.6*hp; R.push(`<path d="M${f(mx-.12*hp)},${f(my+.12*hp)} Q${f(mx)},${f(my-.12*hp)} ${f(mx+.12*hp)},${f(my+.12*hp)}" stroke="${esc(sc,.4)}" stroke-width="1.3" fill="none"/><path d="M${f(mx-w/2)},${f(my+.1*hp)} H${f(mx+w/2)} L${f(mx+w/2-2)},${f(my+.1*hp+h)} H${f(mx-w/2+2)}Z" fill="${sc}" stroke="${esc(sc,.4)}" stroke-width="1.1"/>`); }
  if(AC.has('livro')){ const [mx,my]=mao(Le), lc=ac('livro','#9B2335'); R.push(`<rect x="${f(mx-.22*hp)}" y="${f(my-.2*hp)}" width="${f(.4*hp)}" height="${f(.55*hp)}" rx="1.5" fill="${lc}" stroke="${esc(lc,.4)}" stroke-width="1"/><rect x="${f(mx-.22*hp)}" y="${f(my-.2*hp)}" width="${f(.07*hp)}" height="${f(.55*hp)}" fill="${esc(lc,.25)}"/>`); }
  if(AC.has('copoCafe')){ const [mx,my]=mao(Ld); R.push(`<path d="M${f(mx-.1*hp)},${f(my-.18*hp)} L${f(mx+.1*hp)},${f(my-.18*hp)} L${f(mx+.08*hp)},${f(my+.14*hp)} L${f(mx-.08*hp)},${f(my+.14*hp)}Z" fill="#F4F4F2" stroke="#8B5E3C" stroke-width=".9"/><rect x="${f(mx-.12*hp)}" y="${f(my-.24*hp)}" width="${f(.24*hp)}" height="${f(.07*hp)}" rx="1.5" fill="#5A3A22"/><rect x="${f(mx-.09*hp)}" y="${f(my-.06*hp)}" width="${f(.18*hp)}" height="${f(.1*hp)}" fill="#C9A27E"/>`); }
  if(AC.has('buque')){ const [mx,my]=mao(Ld); let d=`<path d="M${f(mx)},${f(my-.05*hp)} L${f(mx-.04*hp)},${f(my+.4*hp)} M${f(mx)},${f(my-.05*hp)} L${f(mx+.05*hp)},${f(my+.4*hp)}" stroke="#5C8A4A" stroke-width="1.6"/>`; [[0,-.2],[-.15,-.12],[.15,-.12],[-.08,-.32],[.09,-.32]].forEach(([u,v],i)=>{ d+=`<circle cx="${f(mx+u*hp)}" cy="${f(my+v*hp)}" r="${f(.1*hp)}" fill="${[ac('buque','#F28482'),'#FFFFFF','#F6BD60','#CDB4DB','#FFFFFF'][i]}" stroke="rgba(0,0,0,.25)" stroke-width=".6"/>`; }); R.push(d); }
  if(RP.capa){ const cc=typeof RP.capa==='string'?RP.capa:RP.capa.cor; R.push(`<path d="M${f(X(-wOmb+.1*hp))},${f(Y(1.25))} Q${cx},${f(Y(1.5))} ${f(X(wOmb-.1*hp))},${f(Y(1.25))}" stroke="${cc}" stroke-width="2.2" fill="none"/><circle cx="${cx}" cy="${f(Y(1.42))}" r="2.6" fill="#E9C46A" stroke="#9C7A1F" stroke-width=".8"/>`); }
  return R.join(''); }

 // atrás do corpo: capa, véu, mochila, capuz abaixado
 function acessTras(){ const R=[];
  if(RP.capa){ const cp=typeof RP.capa==='string'?{cor:RP.capa}:RP.capa, cc=cp.cor, w0=wOmb-.05*hp, w1=wOmb+.55*hp, y1=Y(cp.comp||6.4);
   R.push(`<path d="M${f(X(-w0))},${f(Y(1.2))} Q${f(X(-w1))},${f(Y(3.5))} ${f(X(-w1))},${f(y1)} Q${f(X(-w1*.5))},${f(y1-.15*hp)} ${cx},${f(y1)} Q${f(X(w1*.5))},${f(y1-.15*hp)} ${f(X(w1))},${f(y1)} Q${f(X(w1))},${f(Y(3.5))} ${f(X(w0))},${f(Y(1.2))}Z" fill="${cc}" stroke="${esc(cc,.4)}" stroke-width="1.4"/>`);
   if(cp.forro) R.push(`<path d="M${f(X(-w1+.06*hp))},${f(y1-2)} Q${f(X(-w1*.5))},${f(y1-.15*hp-2)} ${cx},${f(y1-2)} L${cx},${f(y1-.25*hp)} Q${f(X(-w1*.5))},${f(y1-.4*hp)} ${f(X(-w1+.04*hp))},${f(y1-.25*hp)}Z" fill="${cp.forro}"/>`); }
  if(AC.has('veu')) R.push(`<path d="M${f(cx-HW*hp*1.1)},${f(topo+.1*hp)} Q${f(X(-wOmb-.2*hp))},${f(Y(2.5))} ${f(X(-wOmb-.3*hp))},${f(Y(4.6))} L${f(X(wOmb+.3*hp))},${f(Y(4.6))} Q${f(X(wOmb+.2*hp))},${f(Y(2.5))} ${f(cx+HW*hp*1.1)},${f(topo+.1*hp)}Z" fill="#FFFFFF" opacity=".55" stroke="#E5E5E5" stroke-width="1"/>`);
  if(AC.has('mochila')){ const mc=ac('mochila',c.corMochila)||'#2B2D42'; R.push(`<rect x="${f(X(-wAx-.18*hp))}" y="${f(Y(1.6))}" width="${f(2*wAx+.36*hp)}" height="${f(Y(3.3)-Y(1.6))}" rx="6" fill="${mc}" stroke="${esc(mc,.4)}" stroke-width="1.3"/>`); }
  if(camadas.some(p=>p.capuz)&&!AC.has('capuz')){ const p=camadas.find(q=>q.capuz), cc=p.cor; R.push(`<ellipse cx="${cx}" cy="${f(Y(1.12))}" rx="${f(wPes*2.6)}" ry="${f(.3*hp)}" fill="${tinta(p)}" stroke="${esc(cc,.4)}" stroke-width="1.3"/>`); }
  return R.join(''); }

 // ===== cabeça
 // ===== lobisomem: pelo no corpo, tufos, garras e cabeça de lobo
 function peloCorpo(tronco){ const pid=`pl${id}`; if(!PADS.pelo){ PADS.pelo=1; defsX.push(`<pattern id="${pid}" patternUnits="userSpaceOnUse" width="7" height="9"><path d="M1,0 l1.2,4.5 M4.5,4 l1.2,4.5" stroke="${esc(pele,.35)}" stroke-width=".8" fill="none"/></pattern>`); }
  const R=[`<rect x="0" y="0" width="240" height="400" fill="url(#${pid})" opacity=".55"/>`];
  if(tronco) R.push(`<ellipse cx="${cx}" cy="${f(Y(2.55))}" rx="${f(wPei*.62)}" ry="${f(.85*hp)}" fill="${mix(pele,'#E8D6BC',.35)}" opacity=".55" filter="url(#b${id})"/>`);
  return R.join(''); }
 function tufo(p,dir,sz,cor=pele){ const n=[-dir[1],dir[0]]; let d='';
  for(const k of [-1,0,1]){ const b=[p[0]+n[0]*k*sz*.6,p[1]+n[1]*k*sz*.6], tip=[b[0]+dir[0]*sz*(k?1:1.3)+n[0]*k*sz*.3,b[1]+dir[1]*sz*(k?1:1.3)+n[1]*k*sz*.3];
   d+=`M${f(b[0]-n[0]*sz*.4)},${f(b[1]-n[1]*sz*.4)} L${f(tip[0])},${f(tip[1])} L${f(b[0]+n[0]*sz*.4)},${f(b[1]+n[1]*sz*.4)}Z `; }
  return `<path d="${d}" fill="${cor}" stroke="${esc(pele,.5)}" stroke-width=".8" stroke-linejoin="round"/>`; }
 function garras(){ if(!lobo) return ''; const R=[], cg='#F1EADA';
  for(const L of [Le,Ld]){ const tip=[L.W[0]+L.d2[0]*L.mao*.96,L.W[1]+L.d2[1]*L.mao*.96];
   for(const k of [-.14,-.05,.04,.13]){ const b=[tip[0]+L.n2[0]*k*L.mao,tip[1]+L.n2[1]*k*L.mao];
    R.push(`<path d="M${f(b[0]-L.n2[0]*1.3)},${f(b[1]-L.n2[1]*1.3)} L${f(b[0]+L.d2[0]*5.5)},${f(b[1]+L.d2[1]*5.5)} L${f(b[0]+L.n2[0]*1.3)},${f(b[1]+L.n2[1]*1.3)}Z" fill="${cg}" stroke="#8A7F6A" stroke-width=".5"/>`); }
   // tufos no cotovelo, no antebraço e no ombro
   R.push(tufo([L.E[0]+L.n1[0]*8,L.E[1]+L.n1[1]*8],L.n1,5),tufo([L.E[0]+L.d2[0]*L.fo*.45+L.n2[0]*7,L.E[1]+L.d2[1]*L.fo*.45+L.n2[1]*7],L.n2,4.5),tufo([L.J[0]+L.n1[0]*9,L.J[1]-6],[L.n1[0]*.7,-.7],5)); }
  for(const k of [-1,1]){ const fx=X(k*(wTor+.21*hp)/2);
   R.push(tufo([X(k*(wPan+1)),Y(6.0)],[k,.2],5),tufo([X(k*(wMco+1)),Y(4.6)],[k,.1],4.5));
   for(const u of [-.07,0,.07]) R.push(`<path d="M${f(fx+u*hp-1.3)},${f(Y(7.46))} L${f(fx+u*hp+k*u*6)},${f(Y(7.6))} L${f(fx+u*hp+1.3)},${f(Y(7.46))}Z" fill="${cg}" stroke="#8A7F6A" stroke-width=".5"/>`); }
  return R.join(''); }
 function cabecaLobo(){ const R=[], hw=HW*hp*1.12, t=topo, fur=pele, cl=cla(fur,.35), H=(u,v)=>[cx+u*hw,t+v*hp], P=p=>f(p[0])+','+f(p[1]), ln=esc(fur,.5);
  // juba em volta do pescoço
  const ju=[]; for(let i=0;i<24;i++){ const ang=Math.PI*2*i/24, r=(i%2?1.22:1.58)*hw; ju.push([cx+Math.cos(ang)*r,t+.66*hp+Math.sin(ang)*r*1.05]); }
  R.push(`<path d="M${ju.map(P).join(' L')}Z" fill="${esc(fur,.2)}" stroke="${ln}" stroke-width="1.2" stroke-linejoin="round"/>`);
  for(const s of [-1,1]) R.push(`<path d="M${P(H(s*.32,.2))} L${P(H(s*.92,-.52))} L${P(H(s*1.04,.34))}Z" fill="${fur}" stroke="${ln}" stroke-width="1.2" stroke-linejoin="round"/><path d="M${P(H(s*.5,.16))} L${P(H(s*.88,-.32))} L${P(H(s*.93,.25))}Z" fill="${mix(fur,'#9C6B70',.55)}"/>`);
  // crânio largo, bochechas de pelo em zigue-zague e focinho
  const dir=[H(0,-.04),H(.55,0),H(.9,.18),H(1.02,.44),H(1.24,.58),H(.98,.64),H(1.14,.8),H(.8,.8),H(.5,.88),H(.44,1.06),H(.3,1.2),H(0,1.24)];
  const cab=dir.concat(dir.slice(1,-1).reverse().map(([x,y])=>[2*cx-x,y]));
  R.push(`<path d="M${cab.map(P).join(' L')}Z" fill="${fur}" stroke="${ln}" stroke-width="1.3" stroke-linejoin="round"/>`);
  R.push(`<path d="${suave([H(-.42,.6),H(-.47,.9),H(-.33,1.15),H(0,1.21),H(.33,1.15),H(.47,.9),H(.42,.6),H(0,.52)])}" fill="${cl}"/>`);
  R.push(`<path d="M${P(H(-.12,.5))} Q${P(H(-.14,.7))} ${P(H(-.13,.84))} M${P(H(.12,.5))} Q${P(H(.14,.7))} ${P(H(.13,.84))}" stroke="${esc(fur,.3)}" stroke-width="1" fill="none" opacity=".6"/>`);
  // pelos da testa
  R.push(`<path d="${[-.4,-.15,.15,.4].map(u=>`M${P(H(u,.06))} L${P(H(u*.8,.22))}`).join(' ')}" stroke="${esc(fur,.35)}" stroke-width="1" opacity=".7"/>`);
  // olhos amarelos com pupila em fenda e sobrancelha pesada
  for(const s of [-1,1]){ const I=H(s*.22,.48), O=H(s*.62,.4);
   R.push(`<path d="M${P(I)} Q${P(H(s*.42,.34))} ${P(O)} Q${P(H(s*.44,.54))} ${P(I)}Z" fill="${c.olhosLobo||'#F4C430'}" stroke="#2A1B16" stroke-width="1.1"/><ellipse cx="${f(cx+s*.42*hw)}" cy="${f(t+.45*hp)}" rx="${f(.035*hw)}" ry="${f(.06*hp)}" fill="#111"/><circle cx="${f(cx+s*.42*hw-1)}" cy="${f(t+.42*hp)}" r=".8" fill="#fff"/>`,
    `<path d="M${P(H(s*.16,.38))} L${P(H(s*.68,.27))}" stroke="${esc(fur,.55)}" stroke-width="2.6" stroke-linecap="round"/>`); }
  // nariz, boca e presas
  R.push(`<path d="M${P(H(-.18,.86))} Q${P(H(0,.79))} ${P(H(.18,.86))} Q${P(H(.1,.99))} ${P(H(0,1.0))} Q${P(H(-.1,.99))} ${P(H(-.18,.86))}Z" fill="#1B1416"/><ellipse cx="${f(cx-.04*hw)}" cy="${f(t+.85*hp)}" rx="${f(.06*hw)}" ry="${f(.02*hp)}" fill="#fff" opacity=".35"/>`);
  R.push(`<path d="M${P(H(0,1.0))} L${P(H(0,1.06))} M${P(H(-.32,1.08))} Q${P(H(-.15,1.11))} ${P(H(0,1.06))} Q${P(H(.15,1.11))} ${P(H(.32,1.08))}" stroke="#2A1B16" stroke-width="1.2" fill="none" stroke-linecap="round"/>`);
  for(const s of [-1,1]) R.push(`<path d="M${P(H(s*.24,1.085))} L${P(H(s*.19,1.19))} L${P(H(s*.14,1.08))}Z" fill="#FBF8F2" stroke="#9C9282" stroke-width=".5"/>`);
  return R.join(''); }
 function cabeca(){ if(lobo) return cabecaLobo(); const R=[], hw=HW*hp*(tipo==='gordo'&&a>=12?1.08:1), cy0=topo;
  const P2=(p)=>f(p[0])+','+f(p[1]);
  const FORMA={F:[[0,0],[.78,.05],[1,.3],[.98,.52],[.87,.72],[.6,.9],[.25,.99],[0,1.01]],
   M:[[0,0],[.8,.05],[1,.3],[1,.56],[.95,.78],[.64,.95],[.3,1.0],[0,1.0]],
   crianca:[[0,0],[.82,.06],[1,.34],[1,.6],[.88,.82],[.55,.96],[0,1.0]],
   bebe:[[0,0],[.84,.08],[1,.38],[1,.66],[.83,.88],[.46,.99],[0,1.0]]}[G];
  const meio=FORMA.slice(1,-1);
  const rosto=suave([[cx,cy0]].concat(meio.map(([u,v])=>[cx+u*hw,cy0+v*hp]),[[cx,cy0+FORMA[FORMA.length-1][1]*hp]],meio.slice().reverse().map(([u,v])=>[cx-u*hw,cy0+v*hp])));
  // orelhas (menores na mulher)
  const oe=fem?.1:.14;
  for(const s of [-1,1]) R.push(`<path d="${suave([[cx+s*hw*.92,cy0+.44*hp],[cx+s*hw*(1+oe),cy0+.41*hp],[cx+s*hw*(1+oe*1.2),cy0+.54*hp],[cx+s*hw*1.03,cy0+.67*hp],[cx+s*hw*.92,cy0+.66*hp]])}" fill="${pele}" stroke="${linha}" stroke-width="1.2"/><path d="M${f(cx+s*hw*1.05)},${f(cy0+.47*hp)} q${f(s*2)},${f(.07*hp)} ${f(-s*1)},${f(.13*hp)}" stroke="${sombra}" stroke-width="1" fill="none"/>`);
  R.push(`<path d="${rosto}" fill="url(#r${id})" stroke="${linha}" stroke-width="${fem||kid?1.05:1.3}"/>`);
  R.push(`<path d="M${f(cx-hw*.5)},${f(cy0+.98*hp)} Q${cx},${f(cy0+1.1*hp)} ${f(cx+hw*.5)},${f(cy0+.98*hp)}" stroke="${sombra}" stroke-width="3" opacity="${fem||kid?.2:.35}" fill="none" filter="url(#b${id})"/>`);
  // ===== olhos: a mulher tem olho amendoado com o canto de fora puxado para cima, cílios e delineado
  const ey=cy0+hp*{bebe:.6,crianca:.56,F:.5,M:.49}[G];
  const ew=hw*{bebe:.29,crianca:.28,F:.26,M:.24}[G], eh=ew*{bebe:.66,crianca:.62,F:.56,M:.5}[G], ex=ew*{bebe:2.05,crianca:2.0,F:1.95,M:2.0}[G];
  const iris=vamp?(c.olhosVamp||'#B3001B'):c.criatura==='lobisomem'?(c.olhosLobo||'#D4A017'):(c.olhos||'#5A3A1E'), tinta='#2A1B16';
  const corS=c.corSobrancelha||esc(c.corCabelo||'#3B2416',.1);
  for(const s of [-1,1]){ const x=cx+s*ex, cid=`e${id}${s>0?'d':'e'}`;
   // canto de dentro (I) um pouco mais baixo que o de fora (O); pálpebra de cima mais curva que a de baixo
   const I=[x-s*ew,ey+eh*.12], O=[x+s*ew,ey-eh*(fem?.12:.04)];
   const U1=[x-s*ew*.55,ey-eh*1.3], U2=[x+s*ew*.45,ey-eh*1.3], D1=[x+s*ew*.5,ey+eh*.95], D2=[x-s*ew*.5,ey+eh*.95];
   const cima=`M${P2(I)} C${P2(U1)} ${P2(U2)} ${P2(O)}`, olho=`${cima} C${P2(D1)} ${P2(D2)} ${P2(I)}Z`;
   R.push(`<clipPath id="${cid}"><path d="${olho}"/></clipPath><path d="${olho}" fill="#FAF6F1"/>`);
   const ir=eh*.92, iy=ey-eh*.02;
   R.push(`<g clip-path="url(#${cid})"><circle cx="${f(x)}" cy="${f(iy)}" r="${f(ir)}" fill="${iris}"/><circle cx="${f(x)}" cy="${f(iy+ir*.35)}" r="${f(ir*.6)}" fill="${cla(iris,.25)}" opacity=".45"/><circle cx="${f(x)}" cy="${f(iy)}" r="${f(ir)}" fill="none" stroke="${esc(iris,.5)}" stroke-width=".8"/><circle cx="${f(x)}" cy="${f(iy)}" r="${f(ir*.42)}" fill="#130D0B"/><circle cx="${f(x-s*ir*.1-ir*.3)}" cy="${f(iy-ir*.35)}" r="${f(ir*.24)}" fill="#fff"/><path d="${cima}" fill="none" stroke="${esc(pele,.35)}" stroke-width="${f(eh*.55)}" opacity=".22"/></g>`);
   // linha dos cílios (só a pálpebra de cima) e pálpebra de baixo bem leve
   R.push(`<path d="${cima}" fill="none" stroke="${tinta}" stroke-width="${fem?1.5:kid?1.15:1.05}" stroke-linecap="round"/>`);
   R.push(`<path d="M${f(I[0]+s*ew*.3)},${f(I[1]+eh*.5)} C${f(x-s*ew*.1)},${f(ey+eh*1.05)} ${f(x+s*ew*.5)},${f(ey+eh*.85)} ${f(O[0]-s*ew*.08)},${f(O[1]+eh*.3)}" fill="none" stroke="${sombra}" stroke-width=".7" opacity=".45"/>`);
   if(fem){ const B=t=>{const u=1-t;return [u*u*u*I[0]+3*u*u*t*U1[0]+3*u*t*t*U2[0]+t*t*t*O[0],u*u*u*I[1]+3*u*u*t*U1[1]+3*u*t*t*U2[1]+t*t*t*O[1]];};
    let d=''; for(const [t,l] of [[.62,.35],[.78,.45],[.92,.5],[1,.45]]){ const q=B(t); d+=`M${P2(q)} q${f(s*ew*.08)},${f(-eh*l*.5)} ${f(s*ew*.26*l*2)},${f(-eh*l)} `; }
    R.push(`<path d="${d}" stroke="${tinta}" stroke-width=".8" fill="none" stroke-linecap="round"/>`); }
   // dobra da pálpebra
   if(!bebe) R.push(`<path d="M${f(I[0]+s*ew*.25)},${f(ey-eh*1.15)} C${f(x-s*ew*.3)},${f(ey-eh*(1.75-.3*rg(55,85)))} ${f(x+s*ew*.4)},${f(ey-eh*(1.75-.3*rg(55,85)))} ${f(O[0]-s*ew*.05)},${f(O[1]-eh*.75)}" fill="none" stroke="${sombra}" stroke-width=".8" opacity="${kid?.3:.5}"/>`);
   // pés de galinha (a partir dos 38), bolsas sob os olhos (45) e pálpebra caída (65)
   const pg=rg(36,66), bo=rg(44,78);
   if(pg) R.push(`<path d="M${f(O[0]+s*2)},${f(O[1])} l${f(s*3.5)},-1.8 M${f(O[0]+s*2)},${f(O[1]+2.5)} l${f(s*3.5)},1.8${a>=58?` M${f(O[0]+s*1.6)},${f(O[1]+1.2)} l${f(s*4.2)},0`:''}" stroke="${sombra}" stroke-width=".8" fill="none" opacity="${f(pg*(fem?.65:.75))}"/>`);
   if(bo) R.push(`<path d="M${f(x-ew*.65)},${f(ey+eh*1.55)} Q${f(x)},${f(ey+eh*(2.1+.4*rg(60,85)))} ${f(x+ew*.65)},${f(ey+eh*1.45)}" stroke="${sombra}" stroke-width=".8" fill="none" opacity="${f(bo*(fem?.5:.7))}"/>`);
   if(a>=65) R.push(`<path d="M${f(x-s*ew*.2)},${f(ey-eh*1.25)} Q${f(x+s*ew*.6)},${f(ey-eh*.95)} ${f(O[0]+s*ew*.15)},${f(O[1]-eh*.1)}" stroke="${sombra}" stroke-width="1" fill="none" opacity="${f(rg(65,90)*.6)}"/>`);
   // sobrancelhas: fina e arqueada (mulher), grossa e reta (homem), fininha e clara (criança)
   const cs=mix(fem?mix(corS,pele,.28):kid?mix(corS,pele,.45):mix(corS,pele,.12),'#D6D3CE',gris*.8);
   if(fem){ const by=ey-ew*1.2-2.5; const it=[x-s*ew*.95,by+.6], at=[x+s*ew*.4,by-1.5], tt=[x+s*ew*1.25,by+.9], ab=[x+s*ew*.4,by-.3], ib=[x-s*ew*.95,by+1.7];
    R.push(`<path d="M${P2(ib)} L${P2(it)} Q${f(x-s*ew*.1)},${f(by-1.2)} ${P2(at)} L${P2(tt)} L${P2(ab)} Q${f(x-s*ew*.1)},${f(by+1.6)} ${P2(ib)}Z" fill="${cs}" stroke="${cs}" stroke-width=".5" stroke-linejoin="round"/>`); }
   else if(G==='M'){ const by=ey-ew*1.05-2.5; const it=[x-s*ew*1.05,by+.2], at=[x+s*ew*.4,by-.9], tt=[x+s*ew*1.22,by+.9], ab=[x+s*ew*.4,by+.8], ib=[x-s*ew*1.05,by+2.0];
    R.push(`<path d="M${P2(ib)} L${P2(it)} L${P2(at)} L${P2(tt)} L${P2(ab)}Z" fill="${cs}" stroke="${cs}" stroke-width=".6" stroke-linejoin="round"/>`); }
   else { const by=ey-ew*1.1-1.5; R.push(`<path d="M${f(x-s*ew*.95)},${f(by+1.5)} Q${f(x)},${f(by-2.2)} ${f(x+s*ew*1.1)},${f(by+.8)}" fill="none" stroke="${cs}" stroke-width="${bebe?.9:1.3}" stroke-linecap="round" opacity="${bebe?.5:1}"/>`); } }
  // ===== nariz: no homem com dorso marcado; na mulher e na criança só a pontinha
  const ny=cy0+hp*{bebe:.74,crianca:.72,F:.69,M:.7}[G], nw=ew*{bebe:.6,crianca:.62,F:.72,M:.92}[G];
  if(G==='M'){ R.push(`<path d="M${f(cx-nw*.15)},${f(ey+eh)} Q${f(cx-nw*.35)},${f(ny-hp*.08)} ${f(cx-nw*.55)},${f(ny-hp*.02)}" fill="none" stroke="${sombra}" stroke-width="1.1" opacity=".75"/>`);
   R.push(`<path d="M${f(cx-nw)},${f(ny)} Q${f(cx-nw*.95)},${f(ny-hp*.05)} ${f(cx-nw*.55)},${f(ny-hp*.03)} M${f(cx+nw)},${f(ny)} Q${f(cx+nw*.95)},${f(ny-hp*.05)} ${f(cx+nw*.55)},${f(ny-hp*.03)}" fill="none" stroke="${sombra}" stroke-width="1.2"/>`); }
  else { if(fem) R.push(`<path d="M${f(cx-nw*.3)},${f(ey+eh*1.5)} Q${f(cx-nw*.45)},${f(ny-hp*.07)} ${f(cx-nw*.6)},${f(ny-hp*.025)}" fill="none" stroke="${sombra}" stroke-width=".9" opacity=".35"/>`);
   R.push(`<path d="M${f(cx-nw*.75)},${f(ny-.5)} Q${cx},${f(ny+nw*.6)} ${f(cx+nw*.75)},${f(ny-.5)}" fill="none" stroke="${sombra}" stroke-width="1" opacity=".6"/>`); }
  R.push(`<ellipse cx="${f(cx-nw*.42)}" cy="${f(ny+.3)}" rx="${f(nw*.2)}" ry="${f(nw*.11)}" fill="${esc(pele,.45)}" opacity="${G==='M'?1:.6}"/><ellipse cx="${f(cx+nw*.42)}" cy="${f(ny+.3)}" rx="${f(nw*.2)}" ry="${f(nw*.11)}" fill="${esc(pele,.45)}" opacity="${G==='M'?1:.6}"/><ellipse cx="${cx}" cy="${f(ny-hp*.035)}" rx="${f(nw*.38)}" ry="${f(nw*.28)}" fill="#fff" opacity=".22"/>`);
  // ===== boca: um pouco mais larga que um olho; lábio de baixo mais cheio e mais claro que o de cima
  const my=cy0+hp*{bebe:.85,crianca:.83,F:.815,M:.82}[G], mw=ew*{bebe:.8,crianca:.95,F:1.18,M:1.22}[G], expr=c.expr||'leve';
  const labio=vamp&&!c.batom?mix(pele,'#6A0D1C',.6):c.batom||mix(fem?mix(pele,'#C25B6B',.52):kid?mix(pele,'#CC6670',.38):mix(pele,'#9C5550',.28),pele,rg(55,90)*.4);
  const uh=mw*(fem?.3:kid?.22:.2), lh=mw*(fem?.36:kid?.28:.26);
  const sorri=expr==='sorriso', cv=sorri?mw*.3:expr==='triste'?-mw*.12:mw*.03, ca=sorri?-1.6:expr==='triste'?1.4:0;
  const Lc=[cx-mw,my+ca], Rc=[cx+mw,my+ca], Mm=[cx,my+cv];
  // lábio de cima com o arco do cupido
  R.push(`<path d="M${P2(Lc)} C${f(cx-mw*.6)},${f(my-uh*.6+ca*.4)} ${f(cx-mw*.35)},${f(my-uh*1.1)} ${f(cx-mw*.12)},${f(my-uh*.95)} Q${cx},${f(my-uh*.55)} ${f(cx+mw*.12)},${f(my-uh*.95)} C${f(cx+mw*.35)},${f(my-uh*1.1)} ${f(cx+mw*.6)},${f(my-uh*.6+ca*.4)} ${P2(Rc)} Q${P2(Mm)} ${P2(Lc)}Z" fill="${esc(labio,.1)}"/>`);
  if(sorri&&!bebe&&G!=='M'||sorri&&c.dentes) R.push(`<path d="M${f(cx-mw*.8)},${f(my+ca*.7)} Q${cx},${f(my+cv*1.45)} ${f(cx+mw*.8)},${f(my+ca*.7)} Q${cx},${f(my+cv*.85)} ${f(cx-mw*.8)},${f(my+ca*.7)}Z" fill="#F6F1EA"/>`);
  // lábio de baixo
  const lb=sorri?cv*1.45:cv;
  R.push(`<path d="M${f(Lc[0]+mw*.12)},${f(Lc[1]+.6)} Q${cx},${f(my+lb+lh*2.3)} ${f(Rc[0]-mw*.12)},${f(Rc[1]+.6)} Q${cx},${f(my+lb+.6)} ${f(Lc[0]+mw*.12)},${f(Lc[1]+.6)}Z" fill="${labio}"/>`);
  if(fem||kid) R.push(`<ellipse cx="${f(cx+mw*.08)}" cy="${f(my+lb+lh*.95)}" rx="${f(mw*.28)}" ry="${f(lh*.3)}" fill="#fff" opacity=".22"/>`);
  // linha entre os lábios e cantinhos
  R.push(`<path d="M${P2(Lc)} Q${P2(Mm)} ${P2(Rc)}" fill="none" stroke="${esc(labio,.55)}" stroke-width=".9" stroke-linecap="round"/>`);
  if(sorri&&!bebe) R.push(`<path d="M${f(Lc[0]-1)},${f(Lc[1]-1.2)} q-.6,1.4 .4,2.6 M${f(Rc[0]+1)},${f(Rc[1]-1.2)} q.6,1.4 -.4,2.6" stroke="${sombra}" stroke-width=".7" fill="none" opacity=".6"/>`);
  R.push(`<path d="M${f(cx-mw*.45)},${f(my+lb+lh*2.7)} Q${cx},${f(my+lb+lh*3.1)} ${f(cx+mw*.45)},${f(my+lb+lh*2.7)}" stroke="${sombra}" stroke-width="1.2" fill="none" opacity=".25"/>`);
  if(vamp){ for(const s of [-1,1]) R.push(`<ellipse cx="${f(cx+s*ex)}" cy="${f(ey+eh*1.5)}" rx="${f(ew*.85)}" ry="${f(eh*.55)}" fill="#5B3B6B" opacity=".18" filter="url(#b${id})"/>`);
   for(const s of [-1,1]) R.push(`<path d="M${f(cx+s*mw*.48)},${f(my-.4)} L${f(cx+s*mw*.36)},${f(my+mw*.42)} L${f(cx+s*mw*.26)},${f(my-.4)}Z" fill="#FBF8F2" stroke="#B9AFA2" stroke-width=".5"/>`); }
  // rugas que vão aparecendo com a idade: bigode chinês, testa, marionete, papada e manchas
  { const op=fem?.72:.85, ru=[], li=(d,o,w=1)=>o>0&&ru.push(`<path d="${d}" stroke="${sombra}" stroke-width="${w}" fill="none" opacity="${f(o*op)}"/>`);
   li(`M${f(cx-nw*1.5)},${f(ny+1)} Q${f(cx-mw*1.4)},${f(my-2)} ${f(cx-mw*1.25)},${f(my+mw*.5)} M${f(cx+nw*1.5)},${f(ny+1)} Q${f(cx+mw*1.4)},${f(my-2)} ${f(cx+mw*1.25)},${f(my+mw*.5)}`,rg(38,68));
   li(`M${f(cx-hw*.5)},${f(topo+hp*.22)} q${f(hw*.5)},-3 ${f(hw)},0`,rg(45,70));
   li(`M${f(cx-hw*.4)},${f(topo+hp*.28)} q${f(hw*.4)},-2 ${f(hw*.8)},0`,rg(52,76));
   li(`M${f(cx-hw*.55)},${f(topo+hp*.16)} q${f(hw*.55)},-3 ${f(hw*1.1)},0`,rg(62,85),.8);
   li(`M${f(cx-mw*1.15)},${f(my+mw*.4)} q${f(-mw*.15)},${f(mw*.5)} ${f(-mw*.05)},${f(mw*.95)} M${f(cx+mw*1.15)},${f(my+mw*.4)} q${f(mw*.15)},${f(mw*.5)} ${f(mw*.05)},${f(mw*.95)}`,rg(56,82));
   li(`M${f(cx-hw*.82)},${f(cy0+.82*hp)} Q${f(cx-hw*.7)},${f(cy0+.97*hp)} ${f(cx-hw*.45)},${f(cy0+1.0*hp)} M${f(cx+hw*.82)},${f(cy0+.82*hp)} Q${f(cx+hw*.7)},${f(cy0+.97*hp)} ${f(cx+hw*.45)},${f(cy0+1.0*hp)}`,rg(62,88),1.1);
   li(`M${f(cx-hw*.3)},${f(cy0+1.12*hp)} Q${cx},${f(cy0+1.18*hp)} ${f(cx+hw*.3)},${f(cy0+1.12*hp)}`,rg(64,88),.9);
   if(a>=68) ru.push(`<g fill="${esc(pele,.22)}" opacity="${f(rg(68,90)*.55)}"><circle cx="${f(cx+hw*.55)}" cy="${f(topo+hp*.3)}" r="1.3"/><circle cx="${f(cx-hw*.62)}" cy="${f(ny+hp*.04)}" r="1.1"/><circle cx="${f(cx+hw*.35)}" cy="${f(topo+hp*.18)}" r=".9"/></g>`);
   R.push(ru.join('')); }
  if(tipo==='gordo'&&a>=14) R.push(`<path d="M${f(cx-hw*.42)},${f(cy0+1.03*hp)} Q${cx},${f(cy0+1.13*hp)} ${f(cx+hw*.42)},${f(cy0+1.03*hp)}" stroke="${sombra}" stroke-width="1" fill="none" opacity=".45"/>`);
  // bochechas
  const op={bebe:.3,crianca:.28,F:.22,M:.06}[G]*(1-.6*rg(50,80));
  for(const s of [-1,1]) R.push(`<ellipse cx="${f(cx+s*hw*.56)}" cy="${f(ny-hp*.01)}" rx="${f(hw*.22)}" ry="${f(hw*.13)}" fill="#E56B6F" opacity="${op}" filter="url(#b${id})"/>`);
  // barba
  if(!F&&a>=17&&c.barba){ const cor=mix(esc(c.corCabelo||'#3B2416',.05),'#D9D6D2',Math.min(1,1.2*(c.tinta?Math.pow(rg(38,78),1.3):gris))), bb=c.barba;
   const bigode=`<path d="M${f(cx-mw*1.15)},${f(my+.5)} Q${f(cx-mw*.5)},${f(my-mw*.55)} ${cx},${f(my-mw*.35)} Q${f(cx+mw*.5)},${f(my-mw*.55)} ${f(cx+mw*1.15)},${f(my+.5)} Q${cx},${f(my-mw*.15)} ${f(cx-mw*1.15)},${f(my+.5)}Z" fill="${cor}"/>`;
   if(bb==='por fazer') R.push(`<path d="${suave([[cx-hw*.97,cy0+.6*hp],[cx-hw*.8,cy0+.85*hp],[cx-hw*.35,cy0+.99*hp],[cx,cy0+1.01*hp],[cx+hw*.35,cy0+.99*hp],[cx+hw*.8,cy0+.85*hp],[cx+hw*.97,cy0+.6*hp],[cx+mw*1.3,my-1],[cx,ny+3],[cx-mw*1.3,my-1]])}" fill="${cor}" opacity=".22"/>`);
   else if(bb==='bigode') R.push(bigode);
   else if(bb==='cavanhaque') R.push(bigode,`<path d="${suave([[cx-mw*.95,my+mw*.2],[cx-mw*.7,cy0+.98*hp],[cx,cy0+1.05*hp],[cx+mw*.7,cy0+.98*hp],[cx+mw*.95,my+mw*.2],[cx+mw*.5,my+mw*.5],[cx,my+mw*.62],[cx-mw*.5,my+mw*.5]])}" fill="${cor}" stroke="${esc(cor,.3)}" stroke-width=".8"/>`);
   else { const lq=bb==='lenhador'?1.34:1.14; R.push(`<path d="${suave([[cx-hw*.98,cy0+.55*hp],[cx-hw*.85,cy0+.9*hp],[cx-hw*.4,cy0+(lq-.04)*hp],[cx,cy0+lq*hp],[cx+hw*.4,cy0+(lq-.04)*hp],[cx+hw*.85,cy0+.9*hp],[cx+hw*.98,cy0+.55*hp],[cx+mw*1.2,my+mw*.45],[cx,my+mw*.6],[cx-mw*1.2,my+mw*.45]])}" fill="${cor}" stroke="${esc(cor,.3)}" stroke-width="1"/>`,bigode); } }
  R.push(abaClip(cabeloFrente(hw)).replace(`id="ab${id}"`,`id="ab2${id}"`).replace(`url(#ab${id})`,`url(#ab2${id})`));
  return R.join(''); }

 // ===== cabelo: estilo = frente (franja/linha do cabelo) + trás (comprimento/volume) + extras (coque, rabo, tranças...)
 function corCab(){ const cc=c.corCabelo||'#3B2416'; return gris?mix(cc,'#DEDBD6',gris):cc; }
 function specCab(){ if(!CAB||AC.has('capuz')) return null; const sp=typeof CAB==='object'?CAB:(CABELOS[CAB]||CABELOS.curto);
  const s=Object.assign({fr:'curto',tr:null},sp); s.x=(sp.x||[]).slice();
  if(AC.has('toucaCirurgica')) return {fr:'careca',tr:null,x:[]};
  if(chapeu){ if(['espetado','moicano','pompadour','topete','undercut'].includes(s.fr)) s.fr='curto';
   s.x=s.x.filter(k=>!['coqueAlto','coqueSamurai','coquesDuplos','puff','raboAlto','laco','tiara','flor'].includes(k));
  }
  return s; }
 function ondula(pts,amp,sub,aberto){ const out=[], n=pts.length; let alt=1;
  for(let i=0;i<n;i++){ if(aberto&&i===n-1){ out.push(pts[i]); break; } const p=pts[i], q=pts[(i+1)%n]; out.push(p); const dx=q[0]-p[0], dy=q[1]-p[1], L=Math.hypot(dx,dy)||1;
   for(let k=1;k<=sub;k++){ const t2=k/(sub+1); alt=-alt; out.push([p[0]+dx*t2+dy/L*amp*alt,p[1]+dy*t2-dx/L*amp*alt]); } }
  return out; }
 function tex(pts,s,aberto){ return s.tex==='cachos'?ondula(pts,.07*hp,2,aberto):s.tex==='ondas'?ondula(pts,.045*hp,1,aberto):pts; }
 function caixaCab(){ const hw=HW*hp, t=topo, s=HS, B={top:t-.13*hp,half:1.12*hw,cobreOrelha:false,rabo:null,chiq:null,coque:null};
  if(!s||bebe||['careca','raspado','calvo','militar'].includes(s.fr)&&!s.tr){ B.top=t-.03*hp; B.half=1.02*hw; return B; }
  const lg=['chanel','ombro','medio','longo','muitoLongo'].includes(s.tr);
  B.half=hw*(s.tex==='cachos'?1.38:s.tex==='ondas'?1.2:lg?1.17:1.1);
  const tf={topete:-.24,pompadour:-.42,espetado:-.32,moicano:-.38,undercut:-.28,cachos:-.22,nago:-.08,tigela:-.16,puxado:-.12,raspado:-.03,militar:-.04}[s.fr]; if(tf!=null) B.top=t+tf*hp;
  if(s.tr==='afroG'||s.tr==='afroP'){ const k=s.tr==='afroG'?1.62:1.3; B.top=t+.4*hp-k*1.06*hw*.95; B.half=k*1.06*hw; }
  if(s.tr==='dreads'||s.tr==='boxBraids') B.half=Math.max(B.half,1.2*hw);
  const preso=s.x.some(x=>['raboAlto','coqueAlto','coqueBaixo','coquesDuplos','raboBaixo','chiquinhas','trancas2','trancaLado','puff','coqueSamurai'].includes(x));
  B.cobreOrelha=lg&&!preso&&s.fr!=='puxado';
  if(s.x.includes('raboAlto')) B.rabo=[cx,t-.1*hp];
  if(s.x.includes('raboBaixo')) B.rabo=[cx+hw*1.07,t+.97*hp];
  if(s.x.includes('chiquinhas')) B.chiq=[[cx-hw*1.14,t+.36*hp],[cx+hw*1.14,t+.36*hp]];
  if(s.x.includes('trancas2')) B.chiq=[[cx-hw*1.0-3.5,t+.5*hp+hw*.15*6.6],[cx+hw*1.0+3.5,t+.5*hp+hw*.15*6.6]];
  if(s.x.includes('coqueAlto')) B.coque=[cx,t-.16*hp,hw*.52];
  if(s.x.includes('puff')) B.coque=[cx,t-.3*hp,hw*.8];
  if(s.x.includes('coqueSamurai')) B.coque=[cx+hw*.05,t-.1*hp,hw*.32];
  if(s.x.includes('coquesDuplos')) B.coque=[cx+hw*.72,t-.04*hp,hw*.38];
  return B; }
 function cabeloTras(){ const s=HS; if(!s||bebe) return ''; const t=topo, hw=HW*hp, cor=corCab(), R=[], fillT=gradCab||esc(cor,.15);
  const H=(u,v)=>[cx+u*hw,t+v*hp], capa=(pts,fl=fillT)=>`<path d="${suave(pts)}" fill="${fl}" stroke="${esc(cor,.5)}" stroke-width="1.3"/>`;
  const vol=s.tex==='cachos'?1.22:s.tex==='ondas'?1.06:1;
  const FIM={chanel:t+1.1*hp,ombro:Y(1.4),medio:Y(1.95),longo:Y(2.6),muitoLongo:Y(3.3)};
  if(s.tr==='nuca') R.push(capa(tex([H(-1.08*vol,.25),H(-1.12*vol,.6),H(-.9,.86),H(.9,.86),H(1.12*vol,.6),H(1.08*vol,.25),H(0,-.08)],s)));
  else if(s.tr==='mullet') R.push(capa(tex([H(-1.05,.3),H(-1.12,.8),[cx-wPes*1.5,Y(1.28)],[cx,Y(1.34)],[cx+wPes*1.5,Y(1.28)],H(1.12,.8),H(1.05,.3),H(0,-.08)],s)));
  else if(s.tr==='chanel') R.push(capa(tex([H(-1.05,.25),H(-1.22*vol,.7),H(-1.2*vol,1.1),H(-.6,1.13),H(.6,1.13),H(1.2*vol,1.1),H(1.22*vol,.7),H(1.05,.25),H(0,-.08)],s)));
  else if(FIM[s.tr]){ const fim=FIM[s.tr]; R.push(capa(tex([H(-1.05,.3),H(-1.25*vol,.9),[cx-hw*1.3*vol,(t+hp+fim)/2],[cx-hw*1.1*vol,fim],[cx,fim+.1*hp],[cx+hw*1.1*vol,fim],[cx+hw*1.3*vol,(t+hp+fim)/2],H(1.25*vol,.9),H(1.05,.3),H(0,-.08)],s))); }
  else if(s.tr==='afroP'||s.tr==='afroG'){ const k=s.tr==='afroG'?1.62:1.3; R.push(`<path d="${suave([...Array(18)].map((_,i)=>{const ang=Math.PI*2*i/18;const rr=(i%2?1.0:1.06)*hw*k;return [cx+Math.cos(ang)*rr,t+.4*hp+Math.sin(ang)*rr*.95];}))}" fill="${cor}" stroke="${esc(cor,.5)}" stroke-width="1.3"/>`); }
  else if(s.tr==='dreads'||s.tr==='boxBraids'){ const fim=Y(s.comp||2.3), n=s.tr==='dreads'?11:17, wd=(s.tr==='dreads'?.13:.07)*hp;
   R.push(capa([H(-1.12,.3),H(-1.18,.8),H(1.18,.8),H(1.12,.3),H(0,-.1)],cor));
   let d='', d2=''; for(let i=0;i<n;i++){ const u=-1.2+2.4*i/(n-1), x0=cx+u*hw, y0=t+(.35+Math.abs(u)*.15)*hp, x1=cx+u*hw*1.15+(i%3-1)*2, y1=fim-(i%2)*.15*hp; d+=`M${f(x0)},${f(y0)} Q${f(x0+u*3)},${f((y0+y1)/2)} ${f(x1)},${f(y1)} `; }
   R.push(`<path d="${d}" stroke="${esc(cor,.5)}" stroke-width="${f(wd+2)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="${f(wd)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${esc(cor,.35)}" stroke-width="${f(wd)}" fill="none" stroke-dasharray="1 ${s.tr==='dreads'?4:2.2}" opacity=".7"/>`);
   if(s.corPontas||c.corPontas) R.push(`<path d="${d}" stroke="${s.corPontas||c.corPontas}" stroke-width="${f(wd)}" fill="none" stroke-dasharray="0 ${f(fim-t-.9*hp)} 999" opacity=".9"/>`); }
  for(const x of s.x){
   if(x==='coqueAlto') R.push(`<circle cx="${cx}" cy="${f(t-.16*hp)}" r="${f(hw*.52)}" fill="${cor}" stroke="${esc(cor,.5)}" stroke-width="1.3"/><path d="M${f(cx-hw*.35)},${f(t-.2*hp)} q${f(hw*.35)},${f(-hw*.3)} ${f(hw*.7)},0" stroke="${esc(cor,.3)}" stroke-width=".9" fill="none"/>`);
   if(x==='puff') R.push(capa(ondula([...Array(10)].map((_,i)=>{const ang=Math.PI*2*i/10;return [cx+Math.cos(ang)*hw*.8,t-.3*hp+Math.sin(ang)*hw*.7];}),.06*hp,1),cor));
   if(x==='coqueSamurai') R.push(`<circle cx="${f(cx+hw*.05)}" cy="${f(t-.1*hp)}" r="${f(hw*.32)}" fill="${cor}" stroke="${esc(cor,.5)}" stroke-width="1.3"/>`);
   if(x==='coquesDuplos') for(const k of [-1,1]) R.push(`<circle cx="${f(cx+k*hw*.72)}" cy="${f(t-.04*hp)}" r="${f(hw*.38)}" fill="${cor}" stroke="${esc(cor,.5)}" stroke-width="1.3"/><path d="M${f(cx+k*hw*.5)},${f(t-.1*hp)} q${f(k*hw*.2)},${f(-hw*.25)} ${f(k*hw*.45)},0" stroke="${esc(cor,.3)}" stroke-width=".9" fill="none"/>`);
   if(x==='coqueBaixo') R.push(`<ellipse cx="${cx}" cy="${f(t+.98*hp)}" rx="${f(hw*.62)}" ry="${f(hw*.42)}" fill="${cor}" stroke="${esc(cor,.5)}" stroke-width="1.3"/>`);
   if(x==='raboAlto') R.push(`<circle cx="${cx}" cy="${f(t-.1*hp)}" r="${f(hw*.26)}" fill="${cor}" stroke="${esc(cor,.5)}" stroke-width="1.3"/>`,capa(tex([H(.15,-.2),H(.9,-.15),H(1.4,.3),[cx+hw*1.45,Y(1.4)],[cx+hw*1.25,Y(1.9)],[cx+hw*1.12,Y(1.3)],H(1.05,.5),H(.3,-.02)],s),gradCab||cor)); }
  return R.join(''); }
 function cabeloFrente(hw){ const s=HS, cor=corCab(), t=topo, R=[]; if(!s) return '';
  const H=(u,v)=>[cx+u*hw,t+v*hp], capa=(pts,fl=cor)=>`<path d="${suave(pts)}" fill="${fl}" stroke="${esc(cor,.5)}" stroke-width="1.3"/>`;
  const fios=(n,y0,y1,w)=>{ let d=''; for(let i=0;i<n;i++){ const x=cx-w+2*w*i/(n-1); d+=`M${f(x)},${f(y0+Math.abs(i-(n-1)/2)*1.5)} q${f((x-cx)*.08)},${f((y1-y0)*.5)} ${f((x-cx)*.12)},${f(y1-y0)} `; } return `<path d="${d}" stroke="${esc(cor,.3)}" stroke-width=".9" fill="none" opacity=".7"/>`; };
  const brilho=(v=.08)=>`<path d="M${f(cx-hw*.5)},${f(t+v*hp)} Q${f(cx-hw*.05)},${f(t+(v-.1)*hp)} ${f(cx+hw*.4)},${f(t+(v+.02)*hp)}" stroke="${cla(cor,.45)}" stroke-width="2.4" fill="none" opacity=".5"/>`;
  const linhas=(d)=>`<path d="${d}" stroke="${esc(cor,.3)}" stroke-width=".9" fill="none" opacity=".75"/>`;
  if(bebe){ if(s.fr==='careca') return ''; R.push(`<path d="M${f(cx-hw*.3)},${f(t+.12*hp)} q${f(hw*.2)},${f(-.14*hp)} ${f(hw*.5)},${f(-.02*hp)} M${f(cx-hw*.05)},${f(t+.08*hp)} q${f(hw*.25)},${f(-.12*hp)} ${f(hw*.45)},${f(.02*hp)}" stroke="${cor}" stroke-width="1.6" fill="none"/>`); return R.join(''); }
  const lg=['chanel','ombro','medio','longo','muitoLongo'].includes(s.tr), ba=lg?(s.tr==='chanel'?1.0:1.05):.52, L=lg?1.15:1.08;
  const outer=(alto,lado=ba,l=L)=>[H(-l+.04,lado),H(-l,.15),H(-.55,-alto),H(.2,-(alto+.04)),H(.9,-.02),H(l,.2),H(l-.04,lado)];
  const raspado=op=>`<path d="${suave([H(-1.0,.45),H(-.95,.12),H(0,-.03),H(.95,.12),H(1.0,.45),H(.8,.24),H(0,.17),H(-.8,.24)])}" fill="${cor}" opacity="${op}"/>`;
  const curtoIn=[H(.92,.36),H(.6,.22),H(.1,.25),H(-.4,.2),H(-.85,.3),H(-.95,.42)];
  switch(s.fr){
   case 'careca': break;
   case 'raspado': R.push(raspado(.55)); break;
   case 'militar': R.push(raspado(.8),fios(9,t+.01*hp,t+.12*hp,hw*.7)); break;
   case 'calvo': for(const k of [-1,1]) R.push(capa([[cx+k*hw*1.0,t+.62*hp],[cx+k*hw*1.06,t+.35*hp],[cx+k*hw*.86,t+.18*hp],[cx+k*hw*.86,t+.42*hp],[cx+k*hw*.95,t+.62*hp]])); break;
   case 'curto': case 'topete': R.push(capa(outer(s.fr==='topete'?.2:.09).concat(curtoIn)),fios(7,t+.02*hp,t+.2*hp,hw*.7),brilho()); break;
   case 'pompadour': R.push(capa([H(-1.04,.5),H(-1.08,.12),H(-.75,-.25),H(-.1,-.4),H(.6,-.36),H(1.0,-.05),H(1.08,.2),H(1.04,.5),H(.92,.34),H(.6,.2),H(0,.2),H(-.6,.2),H(-.92,.34)]),linhas([-.6,-.3,0,.3].map(u=>`M${f(cx+u*hw)},${f(t+.18*hp)} Q${f(cx+(u+.1)*hw)},${f(t-.3*hp)} ${f(cx+(u+.45)*hw)},${f(t-.28*hp)}`).join(' ')),brilho(-.2)); break;
   case 'lateral': R.push(capa(outer(.13).concat([H(.92,.38),H(.75,.24),H(.3,.2),H(-.45,.14),H(-.7,.22),H(-.92,.4)])),linhas(`M${f(cx-hw*.45)},${f(t+.13*hp)} Q${f(cx-hw*.5)},${f(t-.02*hp)} ${f(cx-hw*.42)},${f(t-.1*hp)} `+[0,1,2,3].map(i=>`M${f(cx-hw*(.38-i*.03))},${f(t+(.12+i*.02)*hp)} Q${f(cx+hw*.2)},${f(t-.08*hp+i*2)} ${f(cx+hw*(.85-i*.04))},${f(t+(.18+i*.05)*hp)}`).join(' ')),brilho()); break;
   case 'espetado': { const pts=[H(-1.04,.52),H(-1.08,.2)]; for(let i=0;i<=8;i++){ const ang=Math.PI*(1.12+.76*i/8), r=i%2?1.0:1.32; pts.push([cx+Math.cos(ang)*hw*1.08*(i%2?1:1.05),t+.35*hp+Math.sin(ang)*.5*hp*r]); } pts.push(H(1.08,.2),H(1.04,.52)); R.push(capa(pts.concat(curtoIn)),brilho()); break; }
   case 'moicano': R.push(raspado(.35),capa([H(-.22,.22),H(-.26,-.08),H(-.12,-.34),H(.1,-.36),H(.26,-.08),H(.22,.22),H(0,.18)]),linhas(`M${cx},${f(t+.15*hp)} V${f(t-.3*hp)}`)); break;
   case 'undercut': R.push(raspado(.5),capa([H(-.85,.24),H(-.82,-.05),H(-.3,-.24),H(.3,-.26),H(.88,-.08),H(.98,.18),H(.7,.22),H(.2,.19),H(-.4,.25)]),linhas([-.5,-.2,.1].map(u=>`M${f(cx+u*hw)},${f(t+.2*hp)} Q${f(cx+(u+.3)*hw)},${f(t-.15*hp)} ${f(cx+(u+.7)*hw)},${f(t+.05*hp)}`).join(' ')),brilho(-.05)); break;
   case 'entradas': R.push(capa(outer(.06).concat([H(.92,.38),H(.72,.3),H(.5,.12),H(.25,.18),H(0,.24),H(-.25,.18),H(-.5,.12),H(-.72,.3),H(-.92,.38)])),fios(5,t+.0*hp,t+.14*hp,hw*.4)); break;
   case 'tigela': R.push(capa([H(-1.1,.44),H(-1.1,.1),H(-.6,-.14),H(.6,-.14),H(1.1,.1),H(1.1,.44),H(1.0,.36),H(.5,.33),H(-.5,.33),H(-1.0,.36)]),fios(9,t+.0*hp,t+.3*hp,hw*.85),brilho()); break;
   case 'cachos': { R.push(capa(ondula(outer(.14,lg?ba:.55,1.15).concat(lg?[H(.95,ba-.3),H(.85,.32),H(.4,.26),H(-.2,.3),H(-.7,.3),H(-.95,ba-.3)]:[H(.95,.4),H(.6,.26),H(0,.28),H(-.6,.26),H(-.95,.4)]),.06*hp,1)));
    let d=''; for(let i=0;i<22;i++){ const u=-.85+1.7*(i%11)/10, v=(i<11?.0:.15)+Math.abs(u)*.12; d+=`M${f(cx+u*hw)},${f(t+v*hp)} a1.8,1.8 0 1,1 3,0 `; } R.push(`<path d="${d}" stroke="${esc(cor,.35)}" stroke-width=".9" fill="none"/>`); break; }
   case 'afro': R.push(`<path d="${suave([H(-1.05,.42),H(-.9,.16),H(0,.1),H(.9,.16),H(1.05,.42),H(1.3,.1),H(0,-.3),H(-1.3,.1)])}" fill="${cor}"/>`); { let d=''; for(let i=0;i<40;i++){ const ang=Math.PI*(1.05+.9*(i%10)/9), rr=hw*(.9+.55*Math.floor(i/10)/3); d+=`M${f(cx+Math.cos(ang)*rr)},${f(t+.4*hp+Math.sin(ang)*rr*.95)} a2,2 0 1,1 3,0 `; } R.push(`<path d="${d}" stroke="${cla(cor,.15)}" stroke-width=".9" fill="none" opacity=".7"/>`); } break;
   case 'nago': R.push(capa(outer(.05,lg?ba:.46,1.06).concat([H(.9,.34),H(.5,.2),H(0,.17),H(-.5,.2),H(-.9,.34)])),`<path d="${[-.6,-.3,0,.3,.6].map(u=>`M${f(cx+u*hw)},${f(t+(.18+Math.abs(u)*.1)*hp)} Q${f(cx+u*hw*.9)},${f(t-.02*hp)} ${f(cx+u*hw*.55)},${f(t-.1*hp)}`).join(' ')}" stroke="${esc(cor,.5)}" stroke-width="1.3" fill="none" stroke-dasharray="2.2 1" opacity=".75"/>`); break;
   case 'puxado': R.push(capa(outer(.08,lg?ba:.5).concat([H(.95,lg?.7:.45),H(.85,.3),H(.5,.17),H(0,.13),H(-.5,.17),H(-.85,.3),H(-.95,lg?.7:.45)])),linhas([-.6,-.3,0,.3,.6].map(u=>`M${f(cx+u*hw)},${f(t+(.15+Math.abs(u)*.1)*hp)} Q${f(cx+u*hw*.95)},${f(t)} ${f(cx+u*hw*.7)},${f(t-.08*hp)}`).join(' ')),brilho(.02)); break;
   case 'franjaReta': R.push(capa(outer(.1).concat([H(.93,ba-.28),H(.9,.33),H(.4,.35),H(-.4,.35),H(-.9,.33),H(-.93,ba-.28)])),fios(11,t+.02*hp,t+.33*hp,hw*.85),brilho()); break;
   case 'meio': case 'cortina': { const inn=s.fr==='meio'?[H(.93,ba-.25),H(.85,.5),H(.55,.22),H(0,.08),H(-.55,.22),H(-.85,.5),H(-.93,ba-.25)]:[H(.93,ba-.25),H(.88,.55),H(.6,.37),H(.25,.29),H(0,.12),H(-.25,.29),H(-.6,.37),H(-.88,.55),H(-.93,ba-.25)];
    R.push(capa(tex(outer(.1),s,true).concat(inn)),linhas([.2,.45,.7].map(k=>`M${f(cx-1)},${f(t+.06*hp)} Q${f(cx-hw*k*.6)},${f(t+.0*hp)} ${f(cx-hw*(.5+k*.5))},${f(t+(.3+k*.2)*hp)} M${f(cx+1)},${f(t+.06*hp)} Q${f(cx+hw*k*.6)},${f(t+.0*hp)} ${f(cx+hw*(.5+k*.5))},${f(t+(.3+k*.2)*hp)}`).join(' ')),brilho(.04)); break; }
   case 'emo': R.push(capa(outer(.12).concat([H(.97,.85),H(.88,.66),H(.5,.62),H(.1,.46),H(-.3,.26),H(-.55,.12),H(-.85,.3),H(-.93,lg?ba-.25:.42)])),linhas([0,1,2,3].map(i=>`M${f(cx-hw*(.55-i*.05))},${f(t+.1*hp)} Q${f(cx+hw*.1)},${f(t+(.2+i*.06)*hp)} ${f(cx+hw*(.7-i*.1))},${f(t+(.6-i*.05)*hp)}`).join(' ')),brilho()); break;
   default: { // franjaLado (franja de lado, repartida à direita)
    const pr=[cx+hw*.42,t+.1*hp]; R.push(capa(tex([H(-1.1,ba),H(-1.16,.35),H(-.75,-.08),H(.15,-.13),H(.95,0),H(1.16,.38),H(1.1,ba)],s,true).concat([H(.93,lg?.72:.4),H(.9,.38),pr,H(.05,.26),H(-.5,.4),H(-.85,.55),H(-.93,lg?.8:.45)])));
    let d=''; for(let i=0;i<5;i++){ const k=i/4; d+=`M${f(pr[0]-i*1.5)},${f(pr[1]+i*.6)} Q${f(cx-hw*(.1+.3*k))},${f(t+(.02+.08*k)*hp)} ${f(cx-hw*(.6+.35*k))},${f(t+(.3+.25*k)*hp)} `; }
    R.push(linhas(d+`M${f(pr[0]+2)},${f(pr[1])} Q${f(cx+hw*.85)},${f(t+.08*hp)} ${f(cx+hw*.98)},${f(t+.5*hp)}`),brilho()); } }
  // mechas da frente caindo sobre os ombros
  const fimM={medio:Y(1.85),longo:Y(2.4),muitoLongo:Y(3.05)}[s.tr];
  if(fimM&&!s.semMechas){ const v=s.tex==='cachos'?.1*hp:0, yy=k=>Y(1.2)+(fimM-Y(1.2))*k;
   for(const k of [-1,1]){ if(s.x.includes('raboBaixo')) continue; const pts=[[cx+k*hw*.95,t+.6*hp],[cx+k*hw*1.2,t+.7*hp],[cx+k*(wPes+.3*hp+v),yy(.25)],[cx+k*(wPes+.36*hp+v),yy(.65)],[cx+k*(wPes+.26*hp+v*.5),fimM],[cx+k*(wPes+.14*hp),yy(.65)],[cx+k*(wPes+.06*hp),yy(.2)],[cx+k*hw*.9,t+1.0*hp]];
    R.push(capa(tex(pts,s),gradCab||cor),`<path d="M${f(cx+k*hw*1.05)},${f(t+.8*hp)} Q${f(cx+k*(wPes+.28*hp))},${f(yy(.3))} ${f(cx+k*(wPes+.24*hp))},${f(yy(.85))}" stroke="${esc(cor,.3)}" stroke-width=".9" fill="none" opacity=".7"/>`); } }
  if(s.tr==='dreads'||s.tr==='boxBraids'){ const fim=Y(s.comp||2.3), wd=(s.tr==='dreads'?.13:.07)*hp, n=s.tr==='dreads'?3:5; let d='';
   for(const k of [-1,1]) for(let i=0;i<n;i++){ const x0=cx+k*hw*(.7+.3*i/n), y0=t+(.3+.12*i)*hp, x1=cx+k*(wPes+(.1+.32*i/n)*hp), y1=fim-(i%2)*.18*hp; d+=`M${f(x0)},${f(y0)} Q${f(cx+k*hw*1.15)},${f(t+hp)} ${f(x1)},${f(y1)} `; }
   R.push(`<path d="${d}" stroke="${esc(cor,.5)}" stroke-width="${f(wd+2)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${cor}" stroke-width="${f(wd)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${esc(cor,.35)}" stroke-width="${f(wd)}" fill="none" stroke-dasharray="1 ${s.tr==='dreads'?4:2.2}" opacity=".7"/>`); }
  for(const x of s.x){
   if(x==='chiquinhas') for(const k of [-1,1]){ R.push(capa(tex([[cx+k*hw*1.0,t+.28*hp],[cx+k*hw*1.5,t+.32*hp],[cx+k*hw*1.78,t+.9*hp],[cx+k*hw*1.62,t+1.45*hp],[cx+k*hw*1.38,t+.9*hp],[cx+k*hw*1.12,t+.5*hp]],s),gradCab||cor),`<circle cx="${f(cx+k*hw*1.14)}" cy="${f(t+.36*hp)}" r="${f(hw*.1)}" fill="${c.corLaco||'#EF476F'}"/>`); }
   if(x==='trancas2'||x==='trancaLado') for(const k of (x==='trancas2'?[-1,1]:[1])){ const lado=x==='trancaLado', x0=cx+k*hw*1.0, y0=t+.5*hp, n=lado?11:7, st=lado?(Y(2.3)-y0)/11:hw*.15;
    for(let i=0;i<n;i++){ const xx=lado?x0+k*(wPes+.25*hp-hw)*Math.min(1,i/4):x0+k*i*.5, y=y0+i*st, ang=(i%2?28:-28);
     R.push(`<ellipse cx="${f(xx)}" cy="${f(y)}" rx="${f(hw*.15)}" ry="${f(hw*.09)}" transform="rotate(${ang} ${f(xx)} ${f(y)})" fill="${gradCab||cor}" stroke="${esc(cor,.5)}" stroke-width=".9"/>`); }
    const xe=lado?x0+k*(wPes+.25*hp-hw):x0+k*n*.5, ye=y0+n*st-st*.4;
    R.push(`<path d="M${f(xe-hw*.08)},${f(ye)} Q${f(xe)},${f(ye+hw*.4)} ${f(xe+hw*.1)},${f(ye+hw*.05)}" fill="${cor}" stroke="${esc(cor,.5)}" stroke-width=".9"/><rect x="${f(xe-hw*.1)}" y="${f(ye-hw*.06)}" width="${f(hw*.2)}" height="${f(hw*.09)}" rx="1.5" fill="${c.corLaco||'#EF476F'}"/>`); }
   if(x==='raboBaixo'){ const pts=[[cx+hw*.85,t+.75*hp],[cx+hw*1.15,t+.85*hp],[cx+wPes+.3*hp,Y(1.4)],[cx+wPes+.34*hp,Y(1.9)],[cx+wPes+.24*hp,Y(2.3)],[cx+wPes+.14*hp,Y(1.85)],[cx+wPes+.08*hp,Y(1.35)],[cx+hw*.8,t+1.0*hp]]; R.push(capa(tex(pts,s),gradCab||cor),`<rect x="${f(cx+hw*.95)}" y="${f(t+.92*hp)}" width="${f(hw*.28)}" height="${f(hw*.12)}" rx="1.5" transform="rotate(25 ${f(cx+hw*1.05)} ${f(t+.97*hp)})" fill="${c.corLaco||'#2B2D42'}"/>`); }
   if(x==='laco'){ const lc=c.corLaco||'#EF476F', bx=cx+hw*.55, by=t-.02*hp; R.push(`<path d="M${f(bx)},${f(by)} L${f(bx-hw*.38)},${f(by-hw*.25)} L${f(bx-hw*.38)},${f(by+hw*.25)}Z M${f(bx)},${f(by)} L${f(bx+hw*.38)},${f(by-hw*.25)} L${f(bx+hw*.38)},${f(by+hw*.25)}Z" fill="${lc}" stroke="${esc(lc,.35)}" stroke-width="1" stroke-linejoin="round"/><circle cx="${f(bx)}" cy="${f(by)}" r="${f(hw*.1)}" fill="${esc(lc,.15)}"/>`); }
   if(x==='tiara'){ const lc=c.corLaco||'#E63946'; R.push(`<path d="M${f(cx-hw*1.02)},${f(t+.38*hp)} Q${f(cx-hw*.95)},${f(t-.1*hp)} ${cx},${f(t-.12*hp)} Q${f(cx+hw*.95)},${f(t-.1*hp)} ${f(cx+hw*1.02)},${f(t+.38*hp)}" stroke="${lc}" stroke-width="${f(.075*hp)}" fill="none" stroke-linecap="round"/>`); }
   if(x==='flor'){ const fx=cx+hw*.82, fy=t+.12*hp, r=hw*.13; R.push([0,72,144,216,288].map(g=>`<circle cx="${f(fx+Math.cos(g*Math.PI/180)*r)}" cy="${f(fy+Math.sin(g*Math.PI/180)*r)}" r="${f(r*.8)}" fill="${c.corLaco||'#F28482'}"/>`).join('')+`<circle cx="${f(fx)}" cy="${f(fy)}" r="${f(r*.55)}" fill="#F4D35E"/>`); }
   if(x==='presilha') R.push(`<rect x="${f(cx+hw*.45)}" y="${f(t+.14*hp)}" width="${f(hw*.35)}" height="${f(hw*.08)}" rx="1" transform="rotate(-20 ${f(cx+hw*.6)} ${f(t+.16*hp)})" fill="${c.corLaco||'#E9C46A'}"/>`); }
  return R.join(''); }

 // ===== acessórios do rosto e da cabeça (chapéus por cima do cabelo)
 function acessorios(){ const R=[], hw=HW*hp, s=hw*(tipo==='gordo'&&a>=12?1.08:1), t=topo, ey=t+hp*{bebe:.6,crianca:.56,F:.5,M:.49}[G], ew=hw*{bebe:.29,crianca:.28,F:.26,M:.24}[G], ex=ew*1.97;
  const ny=t+hp*{bebe:.74,crianca:.72,F:.69,M:.7}[G], nw=ew*{bebe:.6,crianca:.62,F:.72,M:.92}[G];
  const H=(u,v)=>f(cx+u*s)+','+f(t+v*hp), fz=(d,cor,w=1.3)=>`<path d="${d}" fill="${cor}" stroke="${cor[0]==='#'?esc(cor,.42):'rgba(0,0,0,.4)'}" stroke-width="${w}" stroke-linejoin="round"/>`;
  const el=(v,rx,ry,cor,u=0)=>`<ellipse cx="${f(cx+u*s)}" cy="${f(t+v*hp)}" rx="${f(rx*s)}" ry="${f(ry*hp)}" fill="${cor}" stroke="${esc(cor,.42)}" stroke-width="1.3"/>`;
  const cc=c.corChapeu;
  // sardas: pontinhos de tamanhos diferentes no nariz e no alto das bochechas, num marrom quente e suave
  if(c.sardas) { let d=''; const y0=ey+ew*.62, y1=ny+hp*.012;
   for(let i=0;i<34;i++){ const hr=k=>{ const v=Math.sin(i*12.9898+k*78.233)*43758.5453; return v-Math.floor(v); }, r1=hr(1), r2=hr(2), r3=hr(3);
    const u=(r1*2-1), x=cx+u*ex*1.3, y=y0+(y1-y0)*r2*.85-hp*.02*u*u;
    d+=`<circle cx="${f(x)}" cy="${f(y)}" r="${f(hp*(.005+.006*r3))}" opacity="${f(.35+.35*r3)}"/>`; }
   R.push(`<g fill="${mix(pele,'#8E4A24',.42)}">${d}</g>`); }
  if(c.maquiagem) for(const k of [-1,1]) R.push(`<ellipse cx="${f(cx+k*ex*1.04)}" cy="${f(ey-ew*.62)}" rx="${f(ew*1.05)}" ry="${f(ew*.42)}" fill="${c.maquiagem}" opacity=".3"/>`);
  if(AC.has('piercingNariz')) R.push(`<circle cx="${f(cx+nw*.55)}" cy="${f(ny-.5)}" r="1.1" fill="#D8D8D8" stroke="#888" stroke-width=".4"/>`);
  if(AC.has('mascara')){ const mc=ac('mascara',c.corMascara)||'#A8D8EA'; R.push(`<path d="M${f(cx-1.0*s)},${f(t+.55*hp)} L${f(cx-.84*s)},${f(t+.68*hp)} M${f(cx+1.0*s)},${f(t+.55*hp)} L${f(cx+.84*s)},${f(t+.68*hp)}" stroke="#E8EEF2" stroke-width="1"/>`,fz(`M${H(-.86,.66)} Q${H(0,.58)} ${H(.86,.66)} L${H(.78,.96)} Q${H(0,1.07)} ${H(-.78,.96)}Z`,mc,1),`<path d="M${H(-.75,.76)} Q${H(0,.72)} ${H(.75,.76)} M${H(-.72,.86)} Q${H(0,.84)} ${H(.72,.86)}" stroke="${esc(mc,.2)}" stroke-width=".8" fill="none"/>`); }
  const RH=[];
  for(const k of ACL.map(x=>x.k)){ const alvo=CHAPEUS.includes(k)||['fones','headset','bandana','faixaCabelo'].includes(k)?RH:R, cc=ac(k,c.corChapeu);
   // óculos
   const lente=(fill,forma)=>[-1,1].map(q=>{ const x=cx+q*ex; if(forma==='redondo') return `<circle cx="${f(x)}" cy="${f(ey)}" r="${f(ew*1.3)}" fill="${fill}" stroke="#2B2B30" stroke-width="1.4"/>`;
     if(forma==='gatinho') return `<path d="M${f(x-q*ew*1.3)},${f(ey-ew*.4)} Q${f(x)},${f(ey-ew*.9)} ${f(x+q*ew*1.5)},${f(ey-ew*1.0)} Q${f(x+q*ew*1.3)},${f(ey+ew*.9)} ${f(x)},${f(ey+ew*.8)} Q${f(x-q*ew*1.3)},${f(ey+ew*.6)} ${f(x-q*ew*1.3)},${f(ey-ew*.4)}Z" fill="${fill}" stroke="${ac(k,c.corOculos)||'#7A1E3A'}" stroke-width="1.6"/>`;
     if(forma==='aviador') return `<path d="M${f(x-q*ew*1.25)},${f(ey-ew*.7)} H${f(x+q*ew*1.35)} Q${f(x+q*ew*1.4)},${f(ey+ew*1.3)} ${f(x)},${f(ey+ew*1.1)} Q${f(x-q*ew*1.3)},${f(ey+ew*.6)} ${f(x-q*ew*1.25)},${f(ey-ew*.7)}Z" fill="${fill}" stroke="#B8A26A" stroke-width="1.1"/>`;
     return `<rect x="${f(x-ew*1.25)}" y="${f(ey-ew*.75)}" width="${f(ew*2.5)}" height="${f(ew*1.55)}" rx="${f(ew*.5)}" fill="${fill}" stroke="${ac(k,c.corOculos)||'#2B2B30'}" stroke-width="1.6"/>`; }).join('')
    +`<path d="M${f(cx-ex+ew*1.25)},${f(ey-ew*.3)} Q${cx},${f(ey-ew*.6)} ${f(cx+ex-ew*1.25)},${f(ey-ew*.3)} M${f(cx-ex-ew*1.25)},${f(ey-ew*.4)} L${f(cx-s*.98)},${f(ey-ew*.6)} M${f(cx+ex+ew*1.25)},${f(ey-ew*.4)} L${f(cx+s*.98)},${f(ey-ew*.6)}" stroke="${forma==='aviador'?'#B8A26A':'#2B2B30'}" stroke-width="1.3" fill="none"/>`;
   if(k==='oculos') alvo.push(lente('rgba(220,235,255,.18)'));
   if(k==='oculosSol'||k==='oculos_sol') alvo.push(lente('rgba(20,20,25,.85)'));
   if(k==='oculosRedondo') alvo.push(lente('rgba(220,235,255,.18)','redondo'));
   if(k==='oculosGatinho') alvo.push(lente('rgba(220,235,255,.15)','gatinho'));
   if(k==='oculosAviador') alvo.push(lente('rgba(60,45,30,.7)','aviador'));
   if(k==='oculosProtecao') alvo.push(`<rect x="${f(cx-s*1.0)}" y="${f(ey-ew*1.0)}" width="${f(s*2)}" height="${f(ew*2.1)}" rx="${f(ew*.8)}" fill="rgba(210,235,255,.28)" stroke="#5B6770" stroke-width="2"/><path d="M${f(cx-s*1.0)},${f(ey)} L${f(cx-s*1.08)},${f(ey-ew*.2)} M${f(cx+s*1.0)},${f(ey)} L${f(cx+s*1.08)},${f(ey-ew*.2)}" stroke="#5B6770" stroke-width="2"/>`);
   // orelhas e pescoço
   if(k==='brinco'&&!CB.cobreOrelha) for(const q of [-1,1]) alvo.push(`<circle cx="${f(cx+q*s*1.06)}" cy="${f(t+.72*hp)}" r="2" fill="${ac(k,'#E9C46A')}" stroke="#9C7A1F" stroke-width=".8"/>`);
   if(k==='argola') for(const q of [-1,1]) alvo.push(`<circle cx="${f(cx+q*s*1.07)}" cy="${f(t+.8*hp)}" r="${f(.09*hp)}" fill="none" stroke="${ac(k,'#E9C46A')}" stroke-width="1.3"/>`);
   if(k==='brincoPerola'&&!CB.cobreOrelha) for(const q of [-1,1]) alvo.push(`<circle cx="${f(cx+q*s*1.06)}" cy="${f(t+.74*hp)}" r="2.2" fill="#F8F4EC" stroke="#C9C1B1" stroke-width=".7"/>`);
   if(k==='colar') alvo.push(`<path d="M${f(X(-wPes*1.1))},${f(Y(1.32))} Q${cx},${f(Y(1.75))} ${f(X(wPes*1.1))},${f(Y(1.32))}" stroke="#E9C46A" stroke-width="1.4" fill="none"/><circle cx="${cx}" cy="${f(Y(1.72))}" r="2.6" fill="${ac('colar',c.corPingente)||'#C1121F'}" stroke="#7A0C14" stroke-width=".8"/>`);
   if(k==='corrente') alvo.push(`<path d="M${f(X(-wPes*1.2))},${f(Y(1.25))} Q${cx},${f(Y(1.75))} ${f(X(wPes*1.2))},${f(Y(1.25))}" stroke="#D9B24C" stroke-width="2.4" fill="none" stroke-dasharray="2 1"/>`);
   if(k==='perolas') { let d=''; for(let i=0;i<=12;i++){ const u=i/12, x=X(-wPes*1.15+wPes*2.3*u), y=Y(1.27)+Math.sin(u*Math.PI)*.38*ls*hp; d+=`<circle cx="${f(x)}" cy="${f(y)}" r="1.5"/>`; } alvo.push(`<g fill="#F8F4EC" stroke="#C9C1B1" stroke-width=".5">${d}</g>`); }
   if(k==='gargantilha') alvo.push(`<path d="M${f(X(-wPes*.98))},${f(Y(.98))} Q${cx},${f(Y(1.06))} ${f(X(wPes*.98))},${f(Y(.98))}" stroke="${ac('gargantilha',c.corGargantilha)||'#1B1B1F'}" stroke-width="2.2" fill="none"/>`);
   if(k==='crucifixo') alvo.push(`<path d="M${f(X(-wPes*1.1))},${f(Y(1.3))} Q${cx},${f(Y(1.75))} ${f(X(wPes*1.1))},${f(Y(1.3))}" stroke="#C9A64A" stroke-width="1" fill="none"/><path d="M${cx},${f(Y(1.66))} v${f(.2*hp)} M${f(cx-.06*hp)},${f(Y(1.72))} h${f(.12*hp)}" stroke="#C9A64A" stroke-width="1.6"/>`);
   // chapéus
   if(k==='bone'||k==='boneTras'){ const bc=cc||c.corBone||'#C1121F'; alvo.push(fz(`M${H(-1.08,.32)} Q${H(-1.12,-.2)} ${H(0,-.2)} Q${H(1.12,-.2)} ${H(1.08,.32)} Q${H(0,.22)} ${H(-1.08,.32)}Z`,bc));
    if(k==='bone') alvo.push(fz(`M${H(-1.1,.3)} Q${H(0,.5)} ${H(1.1,.3)} Q${H(0,.36)} ${H(-1.1,.3)}Z`,esc(bc,.2),1.2)); else alvo.push(`<path d="M${H(-.22,.3)} Q${H(0,.12)} ${H(.22,.3)}" fill="${pele}" stroke="${esc(bc,.4)}" stroke-width="1"/>`);
    alvo.push(`<circle cx="${cx}" cy="${f(t-.17*hp)}" r="1.6" fill="${esc(bc,.3)}"/>`); }
   if(k==='gorro'){ const gc=cc||'#2A9D8F'; alvo.push(fz(`M${H(-1.12,.34)} Q${H(-1.2,-.42)} ${H(0,-.42)} Q${H(1.2,-.42)} ${H(1.12,.34)}Z`,gc),fz(`M${H(-1.16,.16)} Q${H(0,.08)} ${H(1.16,.16)} L${H(1.16,.38)} Q${H(0,.3)} ${H(-1.16,.38)}Z`,esc(gc,.12)),`<path d="${[-.8,-.5,-.2,.1,.4,.7].map(u=>`M${H(u,.12)} L${H(u,.33)}`).join(' ')}" stroke="${esc(gc,.35)}" stroke-width=".9"/>`);
    if(c.pompom!==false) alvo.push(`<circle cx="${cx}" cy="${f(t-.45*hp)}" r="${f(s*.24)}" fill="${c.corPompom||cla(gc,.5)}" stroke="${esc(gc,.3)}" stroke-width="1"/>`); }
   if(k==='chapeuPalha'||k==='chapeuPraia'){ const pc=cc||(k==='chapeuPalha'?'#E3C16F':'#F1E3C8'), br=k==='chapeuPraia'?2.5:2.05; alvo.push(el(.2,br,k==='chapeuPraia'?.17:.11,pc),fz(`M${H(-.86,.22)} L${H(-.76,-.32)} Q${H(0,-.46)} ${H(.76,-.32)} L${H(.86,.22)} Q${H(0,.28)} ${H(-.86,.22)}Z`,pc),fz(`M${H(-.84,.08)} Q${H(0,.13)} ${H(.84,.08)} L${H(.86,.2)} Q${H(0,.26)} ${H(-.86,.2)}Z`,c.corFita||(k==='chapeuPalha'?'#8B3A2B':'#2B2D42'),1));
    if(k==='chapeuPalha') alvo.push(`<path d="${[-1.6,-1.2,1.2,1.6].map(u=>`M${H(u,.14)} L${H(u*.92,.27)}`).join(' ')}" stroke="${esc(pc,.3)}" stroke-width=".8"/>`); }
   if(k==='cowboy'){ const pc=cc||'#8B5E3C'; alvo.push(fz(`M${H(-.86,.2)} L${H(-.8,-.38)} Q${H(-.4,-.52)} ${H(0,-.36)} Q${H(.4,-.52)} ${H(.8,-.38)} L${H(.86,.2)}Z`,pc),fz(`M${H(-2.0,-.05)} Q${H(-1.7,.3)} ${H(0,.32)} Q${H(1.7,.3)} ${H(2.0,-.05)} Q${H(1.4,.17)} ${H(0,.17)} Q${H(-1.4,.17)} ${H(-2.0,-.05)}Z`,pc),fz(`M${H(-.84,.05)} Q${H(0,.1)} ${H(.84,.05)} L${H(.85,.15)} Q${H(0,.2)} ${H(-.85,.15)}Z`,'#3A2418',1)); }
   if(k==='cartola'){ const pc=cc||'#1B1B1F'; alvo.push(fz(`M${H(-.78,.2)} L${H(-.86,-1.0)} Q${H(0,-1.08)} ${H(.86,-1.0)} L${H(.78,.2)}Z`,pc),fz(`M${H(-.8,.0)} L${H(.8,.0)} L${H(.79,.14)} L${H(-.79,.14)}Z`,c.corFita||'#9B2335',1),el(.22,1.4,.08,pc)); }
   if(k==='boina'){ const pc=cc||'#9B2335'; alvo.push(`<ellipse cx="${f(cx+.15*s)}" cy="${f(t-.02*hp)}" rx="${f(1.3*s)}" ry="${f(.24*hp)}" transform="rotate(-9 ${f(cx)} ${f(t)})" fill="${pc}" stroke="${esc(pc,.42)}" stroke-width="1.3"/>`,fz(`M${H(-1.05,.2)} Q${H(0,.1)} ${H(1.05,.2)} L${H(1.04,.27)} Q${H(0,.17)} ${H(-1.04,.27)}Z`,esc(pc,.2),1),`<circle cx="${f(cx+.1*s)}" cy="${f(t-.27*hp)}" r="1.5" fill="${esc(pc,.3)}"/>`); if(c.insignia) alvo.push(`<circle cx="${f(cx-.55*s)}" cy="${f(t+.08*hp)}" r="2.6" fill="#E9C46A" stroke="#9C7A1F" stroke-width=".7"/>`); }
   if(k==='fedora'){ const pc=cc||'#4A4E69'; alvo.push(el(.2,1.75,.1,pc),fz(`M${H(-.9,.2)} L${H(-.75,-.32)} Q${H(-.3,-.22)} ${H(0,-.3)} Q${H(.3,-.22)} ${H(.75,-.32)} L${H(.9,.2)}Z`,pc),fz(`M${H(-.87,.04)} L${H(.87,.04)} L${H(.9,.17)} L${H(-.9,.17)}Z`,'#1B1B1F',1)); }
   if(k==='bucket'){ const pc=cc||'#6B705C'; alvo.push(fz(`M${H(-1.0,.16)} Q${H(-1.02,-.34)} ${H(0,-.34)} Q${H(1.02,-.34)} ${H(1.0,.16)}Z`,pc),fz(`M${H(-1.55,.44)} L${H(-1.05,.1)} L${H(1.05,.1)} L${H(1.55,.44)} Q${H(0,.52)} ${H(-1.55,.44)}Z`,esc(pc,.08))); }
   if(k==='viseira'){ const pc=cc||'#F4F4F2'; alvo.push(fz(`M${H(-1.06,.14)} Q${H(0,.02)} ${H(1.06,.14)} L${H(1.06,.28)} Q${H(0,.16)} ${H(-1.06,.28)}Z`,pc,1),fz(`M${H(-1.0,.26)} Q${H(0,.5)} ${H(1.0,.26)} Q${H(0,.32)} ${H(-1.0,.26)}Z`,c.corAba||'#E63946',1)); }
   if(k==='capaceteObra'){ const pc=cc||'#F4C430'; alvo.push(fz(`M${H(-1.16,.3)} Q${H(-1.22,-.42)} ${H(0,-.44)} Q${H(1.22,-.42)} ${H(1.16,.3)}Z`,pc),el(.3,1.32,.06,esc(pc,.08)),`<path d="M${H(-.2,-.4)} Q${H(0,-.46)} ${H(.2,-.4)} L${H(.18,.25)} L${H(-.18,.25)}Z" fill="${cla(pc,.15)}" opacity=".7"/><path d="M${H(-.7,-.2)} Q${H(-.5,-.36)} ${H(-.3,-.38)}" stroke="#fff" stroke-width="2" opacity=".5" fill="none"/>`); }
   if(k==='capaceteBombeiro'){ const pc=cc||'#C1121F'; alvo.push(el(.3,1.6,.1,esc(pc,.1)),fz(`M${H(-1.12,.3)} Q${H(-1.2,-.42)} ${H(0,-.46)} Q${H(1.2,-.42)} ${H(1.12,.3)}Z`,pc),fz(`M${H(-.3,-.02)} L${H(.3,-.02)} L${H(.3,.24)} L${H(0,.3)} L${H(-.3,.24)}Z`,'#E9C46A',1),`<path d="M${H(0,-.46)} L${H(0,-.05)}" stroke="${esc(pc,.35)}" stroke-width="1.4"/>`); }
   if(k==='capaceteMilitar'){ const pc=cc||'#55613A'; alvo.push(fz(`M${H(-1.2,.36)} Q${H(-1.25,-.4)} ${H(0,-.42)} Q${H(1.25,-.4)} ${H(1.2,.36)} Q${H(0,.24)} ${H(-1.2,.36)}Z`,pc),`<path d="M${H(-1.02,.36)} Q${H(-.9,.95)} ${H(0,1.02)} Q${H(.9,.95)} ${H(1.02,.36)}" stroke="#3A3A2A" stroke-width="1" fill="none"/>`); }
   if(k==='quepe'||k==='quepePiloto'||k==='quepeMilitar'||k==='quepeMarinha'){ const top=cc||{quepe:'#1B263B',quepePiloto:'#F4F4F2',quepeMilitar:'#4B5320',quepeMarinha:'#F4F4F2'}[k], band={quepe:'#111827',quepePiloto:'#1B1B1F',quepeMilitar:'#2E3420',quepeMarinha:'#1B263B'}[k];
    alvo.push(fz(`M${H(-1.28,-.28)} Q${H(0,-.5)} ${H(1.28,-.28)} L${H(1.02,.12)} L${H(-1.02,.12)}Z`,top),fz(`M${H(-1.02,.04)} L${H(1.02,.04)} L${H(1.02,.2)} L${H(-1.02,.2)}Z`,band,1),fz(`M${H(-1.0,.2)} Q${H(0,.42)} ${H(1.0,.2)} Q${H(0,.27)} ${H(-1.0,.2)}Z`,'#111111',1));
    alvo.push(k==='quepePiloto'?`<path d="M${H(-.35,-.05)} Q${H(-.15,-.12)} ${H(0,-.06)} Q${H(.15,-.12)} ${H(.35,-.05)}" stroke="#E9C46A" stroke-width="1.6" fill="none"/><circle cx="${cx}" cy="${f(t-.06*hp)}" r="1.8" fill="#E9C46A"/>`:`<path d="${estrela(cx,t-.08*hp,.12*hp)}" fill="#E9C46A" stroke="#9C7A1F" stroke-width=".6"/>`); }
   if(k==='toqueChef'){ const pc='#FAFAFA'; alvo.push(fz(`M${H(-.95,-.1)} Q${H(-1.25,-.55)} ${H(-.75,-.75)} Q${H(-.55,-1.05)} ${H(-.15,-.9)} Q${H(.1,-1.12)} ${H(.45,-.92)} Q${H(.9,-1.0)} ${H(.9,-.6)} Q${H(1.25,-.5)} ${H(.95,-.1)}Z`,pc),fz(`M${H(-.92,-.12)} L${H(.92,-.12)} L${H(.92,.24)} Q${H(0,.3)} ${H(-.92,.24)}Z`,'#F1F1F1',1.2),`<path d="M${H(-.4,-.15)} Q${H(-.45,-.5)} ${H(-.35,-.75)} M${H(.3,-.15)} Q${H(.35,-.5)} ${H(.3,-.8)}" stroke="#D5D5D5" stroke-width="1" fill="none"/>`); }
   if(k==='toucaCozinha'){ const pc=cc||'#FAFAFA'; alvo.push(fz(`M${H(-1.1,.3)} Q${H(-1.22,-.3)} ${H(0,-.34)} Q${H(1.22,-.3)} ${H(1.1,.3)} Q${H(0,.22)} ${H(-1.1,.3)}Z`,pc)); }
   if(k==='toucaCirurgica'){ const pc=cc||'#5FA8A0'; alvo.push(fz(`M${H(-1.12,.38)} Q${H(-1.25,-.32)} ${H(0,-.34)} Q${H(1.25,-.32)} ${H(1.12,.38)} Q${H(0,.26)} ${H(-1.12,.38)}Z`,pc),`<path d="M${H(-.7,.0)} Q${H(-.4,-.1)} ${H(-.1,.02)} M${H(.2,-.05)} Q${H(.5,-.15)} ${H(.8,.05)}" stroke="${esc(pc,.25)}" stroke-width=".9" fill="none"/>`); }
   if(k==='coroa'||k==='tiaraJoia'){ const gc='#E9C46A', h2=k==='coroa'?1:.45; alvo.push(fz(`M${H(-.92,.14)} L${H(-.98,-.38*h2)} L${H(-.7,-.06*h2)} L${H(-.48,-.46*h2)} L${H(-.24,-.06*h2)} L${H(0,-.56*h2)} L${H(.24,-.06*h2)} L${H(.48,-.46*h2)} L${H(.7,-.06*h2)} L${H(.98,-.38*h2)} L${H(.92,.14)}Z`,gc,1.1),`<circle cx="${cx}" cy="${f(t+.04*hp)}" r="2.2" fill="#C1121F"/><circle cx="${f(cx-.5*s)}" cy="${f(t+.06*hp)}" r="1.6" fill="#2A6FDB"/><circle cx="${f(cx+.5*s)}" cy="${f(t+.06*hp)}" r="1.6" fill="#2A9D8F"/>`); }
   if(k==='coroaFloresX') { let d=''; for(let i=0;i<9;i++){ const u=-1+2*i/8, v=.18-Math.cos(u*1.2)*.3; d+=`<circle cx="${f(cx+u*s*1.02)}" cy="${f(t+v*hp)}" r="${f(.09*hp)}" fill="${['#F28482','#F6BD60','#FFFFFF','#CDB4DB'][i%4]}" stroke="#B5838D" stroke-width=".5"/>`; } alvo.push(d); }
   if(k==='capelo'){ const pc='#1B1B1F'; alvo.push(fz(`M${H(-.95,.25)} L${H(-.95,-.08)} L${H(.95,-.08)} L${H(.95,.25)} Q${H(0,.18)} ${H(-.95,.25)}Z`,pc),fz(`M${H(-1.5,-.14)} L${H(0,-.36)} L${H(1.5,-.14)} L${H(0,.06)}Z`,pc),`<path d="M${H(0,-.15)} L${H(1.15,-.05)} L${H(1.2,.45)}" stroke="#E9C46A" stroke-width="1.3" fill="none"/><circle cx="${f(cx+1.2*s)}" cy="${f(t+.48*hp)}" r="2" fill="#E9C46A"/>`); }
   if(k==='bandana'){ const bc=cc||'#C1121F', bf=tinta({cor:bc,padrao:'bolinhas',cor2:'#FFFFFF'}); alvo.push(fz(`M${H(-1.08,.14)} Q${H(0,.02)} ${H(1.08,.14)} L${H(1.08,.32)} Q${H(0,.2)} ${H(-1.08,.32)}Z`,bf,1),fz(`M${H(1.0,.2)} L${H(1.45,.32)} L${H(1.3,.48)}Z M${H(1.0,.24)} L${H(1.35,.6)} L${H(1.15,.62)}Z`,bc,1)); }
   if(k==='faixaCabelo'){ const bc=cc||'#F4F4F2'; alvo.push(fz(`M${H(-1.08,.17)} Q${H(0,.05)} ${H(1.08,.17)} L${H(1.08,.3)} Q${H(0,.18)} ${H(-1.08,.3)}Z`,bc,1)); }
   if(k==='chapeuMarinheiro'){ alvo.push(fz(`M${H(-.95,.22)} Q${H(-1.0,-.3)} ${H(0,-.32)} Q${H(1.0,-.3)} ${H(.95,.22)}Z`,'#FAFAFA'),fz(`M${H(-1.2,.0)} Q${H(0,.12)} ${H(1.2,.0)} L${H(1.0,.24)} Q${H(0,.32)} ${H(-1.0,.24)}Z`,'#F1F1F1',1),`<path d="M${H(-.9,.12)} Q${H(0,.22)} ${H(.9,.12)}" stroke="#1B263B" stroke-width="1.4" fill="none"/>`); }
   if(k==='fones'||k==='headset'){ const fc=cc||'#2B2D42'; alvo.push(`<path d="M${H(-1.12,.45)} Q${H(-1.25,-.38)} ${H(0,-.38)} Q${H(1.25,-.38)} ${H(1.12,.45)}" stroke="${fc}" stroke-width="${k==='fones'?3:2}" fill="none"/>`,...(k==='fones'?[-1,1]:[-1]).map(q=>`<rect x="${f(cx+q*s*1.12-.13*hp)}" y="${f(t+.35*hp)}" width="${f(.26*hp)}" height="${f(.36*hp)}" rx="4" fill="${fc}" stroke="${esc(fc,.4)}" stroke-width="1"/>`));
    if(k==='headset') alvo.push(`<path d="M${f(cx-s*1.12)},${f(t+.62*hp)} Q${f(cx-s*1.0)},${f(t+.86*hp)} ${f(cx-s*.4)},${f(t+.84*hp)}" stroke="${fc}" stroke-width="1.6" fill="none"/><circle cx="${f(cx-s*.38)}" cy="${f(t+.84*hp)}" r="2" fill="${fc}"/>`); }
   if(k==='capuz'){ const hc=cc||ac('capuz',c.corCapuz)||'#3A2E4A'; alvo.push(`<path fill-rule="evenodd" d="${suave([[cx-s*1.45,Y(1.25)],[cx-s*1.5,t+.6*hp],[cx-s*1.2,t-.15*hp],[cx,t-.35*hp],[cx+s*1.2,t-.15*hp],[cx+s*1.5,t+.6*hp],[cx+s*1.45,Y(1.25)],[cx,Y(1.15)]])} M${f(cx)},${f(t+.04*hp)} C${f(cx+s*1.08)},${f(t+.04*hp)} ${f(cx+s*1.1)},${f(t+1.05*hp)} ${f(cx)},${f(t+1.08*hp)} C${f(cx-s*1.1)},${f(t+1.05*hp)} ${f(cx-s*1.08)},${f(t+.04*hp)} ${f(cx)},${f(t+.04*hp)}Z" fill="${hc}" stroke="${esc(hc,.45)}" stroke-width="1.3"/><path d="M${f(cx)},${f(t+.04*hp)} C${f(cx+s*1.08)},${f(t+.04*hp)} ${f(cx+s*1.1)},${f(t+1.05*hp)} ${f(cx)},${f(t+1.08*hp)} C${f(cx-s*1.1)},${f(t+1.05*hp)} ${f(cx-s*1.08)},${f(t+.04*hp)} ${f(cx)},${f(t+.04*hp)}Z" fill="none" stroke="#000" stroke-width="4" opacity=".18" filter="url(#b${id})"/>`); }
   if(k==='capaceteAstronauta') alvo.push(`<ellipse cx="${cx}" cy="${f(Y(1.05))}" rx="${f(s*1.5)}" ry="${f(.14*hp)}" fill="#C9CED6" stroke="#8D949E" stroke-width="1.2"/><circle cx="${cx}" cy="${f(t+.5*hp)}" r="${f(s*1.65)}" fill="rgba(205,228,255,.25)" stroke="#E8ECF1" stroke-width="3.5"/><circle cx="${cx}" cy="${f(t+.5*hp)}" r="${f(s*1.65+1.8)}" fill="none" stroke="#9AA3AE" stroke-width="1"/><path d="M${f(cx-s*1.1)},${f(t-.05*hp)} Q${f(cx-s*.6)},${f(t-.4*hp)} ${f(cx)},${f(t-.42*hp)}" stroke="#fff" stroke-width="2.6" fill="none" opacity=".75" stroke-linecap="round"/>`);
  }
  // chapéus e faixas: se o cabelo tem volume (afro, cachos, topete) o chapéu cresce para caber; chapéu de aba sobe até o topo do cabelo
  if(RH.length){ const ay=t+.3*hp, sxE=Math.max(1,CB.half/(1.12*s)), syE=Math.max(1,(ay-CB.top)/(ay-(t-.13*hp))), n3=v=>v.toFixed(3);
   const env=!chapeu||['bone','boneTras','gorro','boina','capaceteObra','capaceteBombeiro','capaceteMilitar','toucaCozinha','toucaCirurgica'].includes(chapeu);
   const est=!chapeu||['gorro','toucaCozinha','toucaCirurgica'].includes(chapeu), kx=est?1:.72, ky=est?1:.88;
   const tr=env?`translate(${f(cx)},${f(ay)}) scale(${n3(1+(sxE-1)*kx)},${n3(1+(syE-1)*ky)}) translate(${f(-cx)},${f(-ay)})`:`translate(${f(cx)},${f(ay+Math.min(0,CB.top-(t-.13*hp))*(ABA?0:.85))}) scale(${n3(1+(sxE-1)*(ABA?.35:.6))}) translate(${f(-cx)},${f(-ay)})`;
   R.push(`<g transform="${tr}">${RH.join('')}</g>`); }
  // enfeites de cabelo: seguem o contorno do cabelo (elipse da caixa) e vão para o rabo, coque ou chiquinhas quando existem
  const cyE=t+.38*hp, ry=cyE-CB.top, hw2=CB.half*.97, bd=g=>{const r=g*Math.PI/180;return [cx+hw2*Math.cos(r),cyE-ry*.95*Math.sin(r)];};
  const lacoD=(x,y,cor,z=1)=>{ const w=s*.38*z, h=s*.25*z; return `<path d="M${f(x)},${f(y)} L${f(x-w)},${f(y-h)} L${f(x-w)},${f(y+h)}Z M${f(x)},${f(y)} L${f(x+w)},${f(y-h)} L${f(x+w)},${f(y+h)}Z" fill="${cor}" stroke="${esc(cor,.35)}" stroke-width="1" stroke-linejoin="round"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(s*.1*z)}" fill="${esc(cor,.15)}"/>`; };
  const presos=()=>CB.rabo?[CB.rabo]:CB.chiq?CB.chiq:CB.coque?[[CB.coque[0],CB.coque[1]+CB.coque[2]*.85]]:null;
  const flor=(x,y,r,cor)=>[0,72,144,216,288].map(g=>`<circle cx="${f(x+Math.cos(g*Math.PI/180)*r)}" cy="${f(y+Math.sin(g*Math.PI/180)*r)}" r="${f(r*.8)}" fill="${cor}" stroke="${esc(cor,.25)}" stroke-width=".5"/>`).join('')+`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r*.55)}" fill="#F4D35E"/>`;
  for(const it of ACL){ const k=it.k, cor=it.cor;
   if(k==='tiara') R.push(`<path d="M${f(cx-hw2)},${f(cyE)} A${f(hw2)},${f(ry*.93)} 0 0 1 ${f(cx+hw2)},${f(cyE)}" stroke="${cor||'#E63946'}" stroke-width="${f(.075*hp)}" fill="none" stroke-linecap="round"/>`);
   if(k==='coroaFlores') for(let i=0;i<9;i++){ const [x,y]=bd(15+150*i/8); R.push(flor(x,y,.06*hp,cor?[cor,'#FFFFFF',cla(cor,.4)][i%3]:['#F28482','#F6BD60','#FFFFFF','#CDB4DB'][i%4])); }
   if(k==='laco'){ const P=presos(); (P||[bd(55)]).forEach(([x,y])=>R.push(lacoD(x,y-(P&&CB.rabo&&CB.rabo[1]<t?.05*hp:0),cor||'#EF476F',P?.8:1))); }
   if(k==='scrunchie'){ const P=presos(), sc=cor||'#CDB4DB'; if(P) P.forEach(([x,y])=>R.push(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(s*.2)}" ry="${f(s*.13)}" fill="${sc}" stroke="${esc(sc,.3)}" stroke-width="1.6" stroke-dasharray="2 1.2"/>`)); else { const W=Ld.W; R.push(`<circle cx="${f(W[0]-Ld.d2[0]*4)}" cy="${f(W[1]-Ld.d2[1]*4)}" r="${f(.1*hp)}" fill="none" stroke="${sc}" stroke-width="3" stroke-dasharray="2.2 1"/>`); } }
   if(k==='flor'){ const [x,y]=CB.coque?[CB.coque[0]+CB.coque[2]*.8,CB.coque[1]+CB.coque[2]*.4]:bd(28); R.push(flor(x,y,s*.13,cor||'#F28482')); }
   if(k==='presilha'){ const [x,y]=bd(32); R.push(`<rect x="${f(x-s*.22)}" y="${f(y-s*.04)}" width="${f(s*.36)}" height="${f(s*.08)}" rx="1" transform="rotate(-35 ${f(x)} ${f(y)})" fill="${cor||'#E9C46A'}" stroke="${esc(cor||'#E9C46A',.35)}" stroke-width=".6"/>`); }
   if(k==='grampos') for(const g of [150,140]){ const [x,y]=bd(g); R.push(`<path d="M${f(x-s*.16)},${f(y)} L${f(x+s*.16)},${f(y-s*.06)}" stroke="${cor||'#1B1B1F'}" stroke-width="1.3" stroke-linecap="round"/>`); }
   if(k==='piranha'){ const [x,y]=CB.coque?[CB.coque[0],CB.coque[1]+CB.coque[2]*.7]:bd(62), pc=cor||'#B5838D'; R.push(`<g transform="rotate(${CB.coque?0:-25} ${f(x)} ${f(y)})"><rect x="${f(x-s*.3)}" y="${f(y-s*.14)}" width="${f(s*.6)}" height="${f(s*.15)}" rx="3" fill="${pc}" stroke="${esc(pc,.35)}" stroke-width=".8"/><path d="${[-.22,-.08,.06,.2].map(u=>`M${f(x+u*s)},${f(y)} l0,${f(s*.18)}`).join(' ')}" stroke="${pc}" stroke-width="2.2" stroke-linecap="round"/></g>`); }
   if(k==='oculosCabeca'){ const y=CB.top+ry*.32, oc=cor||'rgba(20,20,25,.88)', w=Math.max(1,hw2/(1.1*s)); R.push([-1,1].map(q=>`<ellipse cx="${f(cx+q*ex*w)}" cy="${f(y)}" rx="${f(ew*1.25)}" ry="${f(ew*.62)}" fill="${oc}" stroke="#2B2B30" stroke-width="1.3"/>`).join('')+`<path d="M${f(cx-ex*w+ew*1.2)},${f(y)} Q${cx},${f(y-ew*.3)} ${f(cx+ex*w-ew*1.2)},${f(y)} M${f(cx-ex*w-ew*1.2)},${f(y)} L${f(cx-hw2)},${f(y+ew*.6)} M${f(cx+ex*w+ew*1.2)},${f(y)} L${f(cx+hw2)},${f(y+ew*.6)}" stroke="#2B2B30" stroke-width="1.3" fill="none"/>`); }
   // orelha: pino some com o cabelo cobrindo; os pendentes aparecem por cima
   const ox=q=>cx+q*s*1.06, oy=t+.72*hp, me=cor||'#E9C46A';
   if(k==='argolaGrande') for(const q of [-1,1]) R.push(`<circle cx="${f(ox(q)+q)}" cy="${f(oy+.16*hp)}" r="${f(.16*hp)}" fill="none" stroke="${me}" stroke-width="1.5"/>`);
   if(k==='pingente') for(const q of [-1,1]) R.push(`<path d="M${f(ox(q))},${f(oy)} V${f(oy+.12*hp)}" stroke="${me}" stroke-width=".9"/><path d="M${f(ox(q))},${f(oy+.1*hp)} q${f(.05*hp)},${f(.08*hp)} 0,${f(.14*hp)} q${f(-.05*hp)},${f(-.06*hp)} 0,${f(-.14*hp)}Z" fill="${it.pedra||'#2A9D8F'}" stroke="${me}" stroke-width=".8"/>`);
   if(k==='brincoEstrela'&&!CB.cobreOrelha) for(const q of [-1,1]) R.push(`<path d="${estrela(ox(q),oy,.06*hp)}" fill="${me}" stroke="${esc(me,.35)}" stroke-width=".5"/>`);
   if(k==='brincoEstrela'&&CB.cobreOrelha) for(const q of [-1,1]) R.push(`<path d="M${f(ox(q))},${f(oy)} V${f(oy+.1*hp)}" stroke="${me}" stroke-width=".8"/><path d="${estrela(ox(q),oy+.14*hp,.06*hp)}" fill="${me}"/>`);
   if(k==='brincoCoracao') for(const q of [-1,1]) R.push(`<path d="M${f(ox(q))},${f(oy)} V${f(oy+.08*hp)}" stroke="${esc(me,.2)}" stroke-width=".8"/><path d="${coracao(ox(q),oy+.12*hp,.05*hp)}" fill="${it.pedra||'#E63946'}" stroke="${me}" stroke-width=".6"/>`);
   // pescoço
   const colarD=`M${f(X(-wPes*1.1))},${f(Y(1.3))} Q${cx},${f(Y(1.78))} ${f(X(wPes*1.1))},${f(Y(1.3))}`;
   if(k==='colarContas'){ let d=''; for(let i=0;i<=14;i++){ const u=i/14, x=X(-wPes*1.1+wPes*2.2*u), y=Y(1.3)+4*u*(1-u)*(Y(1.54)-Y(1.3)); d+=`<circle cx="${f(x)}" cy="${f(y)}" r="1.7" fill="${i%3?cor||'#2A9D8F':i%2?'#F4A261':'#E63946'}" stroke="rgba(0,0,0,.3)" stroke-width=".4"/>`; } R.push(d); }
   if(k==='pingenteCoracao') R.push(`<path d="${colarD}" stroke="${me==='#E9C46A'?'#D9B24C':me}" stroke-width="1" fill="none"/><path d="${coracao(cx,Y(1.6),.08*hp)}" fill="${it.pedra||'#E63946'}" stroke="${me}" stroke-width=".8"/>`);
   // rosto
   if(k==='septo') R.push(`<path d="M${f(cx-nw*.2)},${f(ny+1)} a${f(nw*.2)},${f(nw*.2)} 0 0 0 ${f(nw*.4)},0" stroke="${cor||'#C9CED6'}" stroke-width="1.1" fill="none"/>`);
   if(k==='piercingSobrancelha') R.push(`<circle cx="${f(cx+ex+ew*.95)}" cy="${f(ey-ew*1.25)}" r="1" fill="${cor||'#C9CED6'}"/><circle cx="${f(cx+ex+ew*.85)}" cy="${f(ey-ew*1.75)}" r="1" fill="${cor||'#C9CED6'}"/>`);
   if(k==='piercingLabio'){ const my=t+hp*{bebe:.85,crianca:.83,F:.815,M:.82}[G], mw=ew*{bebe:.8,crianca:.95,F:1.18,M:1.22}[G]; R.push(`<path d="M${f(cx+mw*.45)},${f(my+mw*.35)} a${f(mw*.16)},${f(mw*.16)} 0 1 0 ${f(mw*.02)},0" stroke="${cor||'#C9CED6'}" stroke-width="1" fill="none"/>`); }
  }
  return R.join(''); }
};
})();
