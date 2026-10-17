// Jornal da vida: manchetes persistentes sobre o personagem e o país.
function jornal(){return S.jornal||(S.jornal={itens:[],next:1});}
function noticia(titulo,texto,tipo='mundo',chave,pais=S.me.country,importancia=50){const j=jornal();if(chave&&j.itens.some(n=>n.chave===chave))return null;const n={id:j.next++,ano:S.year,pais,titulo,texto,tipo,chave,importancia};j.itens.unshift(n);j.itens=j.itens.slice(0,100);noticiaBarra();return n;}
function noticiasObservar(){if(!S||!S.me||S.scen)return;const m=S.me,mar=m.newsMarcos||(m.newsMarcos={});for(const [lim,t] of [[15,'Uma nova estrela em ascensão'],[40,'Nome em destaque na imprensa nacional'],[75,'Uma celebridade reconhecida em todo o país']])if(m.fame>=lim&&!mar['f'+lim]){mar['f'+lim]=true;noticia(t+': '+m.first,fullName(m)+' ganhou visibilidade com sua trajetória. Sua fama chegou a '+Math.round(m.fame)+'%.','personagem','fama:'+S.gen+':'+lim);}if(m.office&&mar.cargo!==m.office.id){mar.cargo=m.office.id;noticia(fullName(m)+' assume cargo público','O novo mandato de '+g(OFFICES.find(o=>o.id===m.office.id).n,m.gender).toLowerCase()+' começa com '+Math.round(m.office.appr)+'% de aprovação.','politica');}if(!m.office)mar.cargo=null;}
const NOTICIA_PAUSA_MS=20000;
function noticiaAnimar(el){
 cancelAnimationFrame(el._newsFrame);
 el._newsFrame=requestAnimationFrame(()=>{
  const janela=el.querySelector('.news-window'),texto=el.querySelector('.news-label');
  if(el.hidden||!janela||!texto)return;
  const largura=janela.clientWidth,tamanho=texto.scrollWidth;
  if(!largura||!tamanho)return;
  const medidas=largura+':'+tamanho;
  if(el._newsMedidas===medidas&&el._newsAnim)return;
  el._newsMedidas=medidas;el._newsAnim?.cancel();
  const viagem=Math.max(5000,(largura+tamanho)/45*1000),duracao=viagem+NOTICIA_PAUSA_MS;
  el._newsAnim=texto.animate([
   {transform:`translateX(${largura}px)`,offset:0},
   {transform:`translateX(-${tamanho}px)`,offset:viagem/duracao},
   {transform:`translateX(-${tamanho}px)`,offset:1}
  ],{duration:duracao,iterations:Infinity,easing:'linear'});
 });
}
function noticiaBarra(){
 const el=document.getElementById('newsBar');if(!el||!S||!S.me)return;
 el.hidden=!!S.scen;
 if(el.hidden){el._newsAnim?.pause();return;}
 const recentes=jornal().itens.filter(n=>S.year-n.ano<=1);
 const n=(recentes.length?recentes.slice().sort((a,b)=>(b.importancia||50)-(a.importancia||50)||b.id-a.id):jornal().itens)[0];
 const titulo=n?n.titulo:'Notícias de '+countryOf(S.me.country).n+' · abrir jornal',pais=n?.pais||S.me.country,chave=pais+'|'+titulo;
 if(el._newsChave===chave&&el.querySelector('.news-label')){if(el._newsAnim?.playState==='paused')el._newsAnim.play();return;}
 if(el._newsObserver)el._newsObserver.disconnect();
 el._newsAnim?.cancel();el._newsAnim=null;el._newsMedidas=null;el._newsChave=chave;
 el.innerHTML=flagSVG(pais,22)+'<span class="news-window"><span class="news-label">'+esc(titulo)+'</span></span><span class="news-arrow">›</span>';
 el.title=titulo;el.setAttribute('aria-label',titulo+'. Abrir jornal de notícias');el.onclick=()=>UI.open(V.jornal);
 if(typeof ResizeObserver!=='undefined'){
  el._newsObserver=el._newsObserver||new ResizeObserver(()=>noticiaAnimar(el));
  el._newsObserver.observe(el.querySelector('.news-window'));el._newsObserver.observe(el.querySelector('.news-label'));
 }
 noticiaAnimar(el);
}

render=(o=>Object.assign(function(){const r=o.apply(this,arguments);noticiasObservar();noticiaBarra();return r;},o))(render);
arrest=(o=>function(crime){const preso=!!S.me.prison,r=o.apply(this,arguments);if(!preso&&S.me.prison)noticia(fullName(S.me)+' é preso','A prisão está relacionada a '+crime+'. A Justiça acompanha o caso.','justica');return r;})(arrest);
die=(o=>function(c){const vivo=S.me.alive,r=o.apply(this,arguments);if(vivo)noticia('Morre '+fullName(S.me),'Aos '+S.me.age+' anos, termina a trajetória de '+S.me.first+'. Familiares e pessoas próximas se despedem.','personagem');return r;})(die);
continueAs=(o=>function(k){const arquivo=S.jornal,r=o.apply(this,arguments);S.jornal=arquivo;return r;})(continueAs);
V.jornal=()=>({title:'Jornal · personagem e mundo',items:[{html:'<div class="card"><p>Manchetes sobre sua trajetória e o país. Toque em uma notícia para ler.</p></div>'},...jornal().itens.map(n=>({l:n.titulo,s:n.ano+' · '+countryOf(n.pais).n+' · '+(n.tipo==='mundo'?'Mundo':'Sua história'),on:()=>UI.push(()=>({title:'Notícia',items:[{html:'<div class="card">'+flagSVG(n.pais,28)+'<h3>'+esc(n.titulo)+'</h3><p>'+n.ano+' · '+esc(countryOf(n.pais).n)+'</p><p>'+esc(n.texto)+'</p></div>'}]}))})),...(!jornal().itens.length?[{html:'<div class="card">As notícias aparecem conforme sua vida e o mundo avançam.</div>'}]:[])]});
V.menu=(o=>()=>{const r=o();r.items.push({ic:'📰',l:'Jornal do personagem e do mundo',on:()=>UI.push(V.jornal)});return r;})(V.menu);
