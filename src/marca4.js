// ===== 3.4: ícone, tela de carregamento e tela de atualização novos =====
// Marca nova: um broto com duas folhas em forma de coração nascendo na frente de um sol, num quadrado
// com gradiente turquesa → roxo → rosa. A tela de carregamento faz o broto crescer, o sol pulsar e as
// letras pularem; a de atualização usa o mesmo broto dentro de um anel de progresso.
function marca4SVG(id='m4',anim=false){ const A=anim?' class="m4-anim"':'';
  return `<defs>
   <radialGradient id="${id}sol" cx=".5" cy=".45" r=".55"><stop offset="0" stop-color="#FFF4C2"/><stop offset=".55" stop-color="#FFD25E"/><stop offset="1" stop-color="#FF8A3D"/></radialGradient>
   <linearGradient id="${id}fol" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D9FBE8"/><stop offset=".45" stop-color="#5BE39A"/><stop offset="1" stop-color="#16A34A"/></linearGradient>
   <linearGradient id="${id}fol2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C7F9DD"/><stop offset=".5" stop-color="#3FD487"/><stop offset="1" stop-color="#15803D"/></linearGradient>
  </defs>
  <g${A}>
   <circle class="m4-halo" cx="50" cy="50" r="40" fill="#FFFFFF" opacity=".12"/>
   <circle class="m4-sol" cx="50" cy="52" r="30" fill="url(#${id}sol)"/>
   <g class="m4-raios" stroke="#FFE7A0" stroke-width="2.2" stroke-linecap="round" opacity=".75">${Array.from({length:12},(_,i)=>{ const a=i/12*Math.PI*2, x1=50+Math.cos(a)*35, y1=52+Math.sin(a)*35, x2=50+Math.cos(a)*40, y2=52+Math.sin(a)*40; return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}"/>`; }).join('')}</g>
   <ellipse cx="50" cy="83" rx="22" ry="4.6" fill="#3B1D5E" opacity=".28"/>
   <path class="m4-terra" d="M30 82 Q50 72 70 82 Q50 88 30 82Z" fill="#7A4A2A"/><path d="M34 80.6 Q50 74 66 80.6" fill="none" stroke="#A0683E" stroke-width="1.4" stroke-linecap="round"/>
   <path class="m4-caule" d="M50 80 C50 70 49 62 50 50" fill="none" stroke="#15803D" stroke-width="4.4" stroke-linecap="round"/>
   <g class="m4-folhaE"><path d="M50 52 C44 40 30 36 22 42 C24 54 38 60 50 52Z" fill="url(#${id}fol)" stroke="#0F6B33" stroke-width="1.6" stroke-linejoin="round"/><path d="M48 51 C40 47 32 45 26 44" fill="none" stroke="#0F6B33" stroke-width="1" opacity=".55"/></g>
   <g class="m4-folhaD"><path d="M50 52 C56 40 70 36 78 42 C76 54 62 60 50 52Z" fill="url(#${id}fol2)" stroke="#0F6B33" stroke-width="1.6" stroke-linejoin="round"/><path d="M52 51 C60 47 68 45 74 44" fill="none" stroke="#0F6B33" stroke-width="1" opacity=".55"/></g>
   <path d="M30 44 C33 42 37 42 40 44" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
   <g class="m4-brilhos" fill="#FFFFFF"><path d="M80 18 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z"/><path d="M18 24 l1 2.8 2.8 1 -2.8 1 -1 2.8 -1 -2.8 -2.8 -1 2.8 -1z" opacity=".85"/><path d="M84 70 l.9 2.4 2.4 .9 -2.4 .9 -.9 2.4 -.9 -2.4 -2.4 -.9 2.4 -.9z" opacity=".7"/></g>
  </g>`; }
appIconSVG=function(px=1024){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${px}" height="${px}"><defs><clipPath id="ico4"><rect x="4" y="4" width="112" height="112" rx="28"/></clipPath>
  <linearGradient id="ico4bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0EA5A4"/><stop offset=".5" stop-color="#6D28D9"/><stop offset="1" stop-color="#E0337A"/></linearGradient>
  <radialGradient id="ico4luz" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".35"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs>
  <g clip-path="url(#ico4)"><rect width="120" height="120" fill="url(#ico4bg)"/><rect width="120" height="120" fill="url(#ico4luz)"/>
  <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" stroke-width="1.2" opacity=".18"/><circle cx="60" cy="60" r="56" fill="none" stroke="#fff" stroke-width=".8" opacity=".12"/>
  <g transform="translate(6 4) scale(1.08)">${marca4SVG('ic4')}</g>
  <ellipse cx="60" cy="10" rx="54" ry="16" fill="#fff" opacity=".1"/></g>
  <rect x="4" y="4" width="112" height="112" rx="28" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.5"/></svg>`; };

const M4_CSS=`
@keyframes m4Cresce{0%{stroke-dashoffset:40}100%{stroke-dashoffset:0}}
@keyframes m4Folha{0%{transform:scale(0) rotate(-20deg);opacity:0}70%{transform:scale(1.12) rotate(4deg);opacity:1}100%{transform:scale(1) rotate(0)}}
@keyframes m4Sol{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes m4Raios{to{transform:rotate(360deg)}}
@keyframes m4Brilho{0%,100%{opacity:.2;transform:scale(.6)}50%{opacity:1;transform:scale(1.15)}}
@keyframes m4Balanca{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes m4Fundo{0%{background-position:0% 40%}50%{background-position:100% 60%}100%{background-position:0% 40%}}
@keyframes m4Letra{0%{transform:translateY(24px) scale(.6);opacity:0}60%{transform:translateY(-6px) scale(1.08);opacity:1}100%{transform:none;opacity:1}}
@keyframes m4Sobe{0%{transform:translateY(0) scale(.6);opacity:0}15%{opacity:.9}100%{transform:translateY(-105vh) scale(1.1);opacity:0}}
@keyframes m4Barra{0%{transform:translateX(-100%)}100%{transform:translateX(260%)}}
@keyframes m4Onda{to{transform:translateX(-50%)}}
.m4-anim .m4-caule{stroke-dasharray:40;animation:m4Cresce 1s .15s cubic-bezier(.3,.7,.3,1) both}
.m4-anim .m4-folhaE,.m4-anim .m4-folhaD{transform-origin:50px 52px;animation:m4Folha .8s cubic-bezier(.3,1.5,.5,1) both}
.m4-anim .m4-folhaE{animation-delay:.75s}.m4-anim .m4-folhaD{animation-delay:.9s}
.m4-anim .m4-sol{transform-origin:50px 52px;animation:m4Sol 2.6s ease-in-out infinite}
.m4-anim .m4-raios{transform-origin:50px 52px;animation:m4Raios 18s linear infinite}
.m4-anim .m4-brilhos path{transform-box:fill-box;transform-origin:center;animation:m4Brilho 2.2s ease-in-out infinite}
.m4-anim .m4-brilhos path:nth-child(2){animation-delay:.7s}.m4-anim .m4-brilhos path:nth-child(3){animation-delay:1.4s}
.m4-fundo{background:linear-gradient(125deg,#0EA5A4,#4F46E5,#7C3AED,#DB2777,#0EA5A4);background-size:320% 320%;animation:m4Fundo 9s ease-in-out infinite}
.m4-part{position:absolute;bottom:-20px;border-radius:50%;background:rgba(255,255,255,.75);box-shadow:0 0 10px rgba(255,255,255,.8);pointer-events:none;animation:m4Sobe linear infinite}
.m4-ondas{position:absolute;left:0;right:0;bottom:0;height:90px;overflow:hidden;pointer-events:none;opacity:.35}
.m4-ondas svg{position:absolute;bottom:0;width:200%;height:90px;animation:m4Onda 9s linear infinite}
.m4-ondas svg+svg{animation-duration:14s;opacity:.6;bottom:-8px}
@media (prefers-reduced-motion:reduce){.m4-anim *,.m4-fundo,.m4-part,.m4-ondas svg{animation:none!important}}
#splash.m4{background:none}
#splash.m4.m4-fundo,#nlUpd.m4-fundo{background:linear-gradient(125deg,#0EA5A4,#4F46E5,#7C3AED,#DB2777,#0EA5A4);background-size:320% 320%}
#splash.m4 .sp-in{position:relative;z-index:2;gap:10px}
#splash.m4 #splashArt{width:190px;height:190px;animation:m4Balanca 3.4s ease-in-out infinite;transform-origin:50% 90%}
#splash.m4 #splashArt svg{width:190px;height:190px;animation:none;filter:drop-shadow(0 10px 24px rgba(30,0,60,.35))}
#splash.m4 .sp-logo{font-size:52px;letter-spacing:.5px;display:flex;text-shadow:0 4px 18px rgba(40,0,80,.35)}
#splash.m4 .sp-logo span{display:inline-block;animation:m4Letra .6s cubic-bezier(.3,1.4,.5,1) both}
#splash.m4 .sp-bar{width:220px;height:10px;background:rgba(255,255,255,.22);box-shadow:inset 0 1px 3px rgba(0,0,0,.2)}
#splash.m4 .sp-bar i{width:45%;background:linear-gradient(90deg,transparent,#FFE27A,#FFFFFF,#FFE27A,transparent);animation:m4Barra 1.3s ease-in-out infinite}
#splash.m4 .sp-tip{font-weight:700;color:#fff;opacity:.92;min-height:20px}
`;
function m4Estilo(){ if(document.getElementById('m4css')) return; const s=document.createElement('style'); s.id='m4css'; s.textContent=M4_CSS; document.head.appendChild(s); }
function m4Particulas(el,n=18){ for(let i=0;i<n;i++){ const p=document.createElement('i'), t=4+((i*37)%7); p.className='m4-part'; const s=3+(i*13)%6; p.style.cssText=`left:${(i*53+7)%100}%;width:${s}px;height:${s}px;animation-duration:${t}s;animation-delay:${-((i*1.7)%t)}s`; el.appendChild(p); } }
const M4_ONDAS=`<div class="m4-ondas" aria-hidden="true">${[0,1].map(()=>`<svg viewBox="0 0 1200 90" preserveAspectRatio="none"><path d="M0 50 Q150 10 300 50 T600 50 T900 50 T1200 50 V90 H0Z" fill="#fff"/></svg>`).join('')}</div>`;

// tela de carregamento
(()=>{ const s=document.getElementById('splash'); if(!s) return; m4Estilo(); s.classList.add('m4','m4-fundo');
  const a=document.getElementById('splashArt'); if(a) a.innerHTML=`<svg viewBox="0 0 100 100" aria-hidden="true">${marca4SVG('sp4',true)}</svg>`;
  const lg=s.querySelector('.sp-logo'); if(lg) lg.innerHTML=[...'New'].map((c,i)=>`<span style="animation-delay:${.25+i*.07}s">${c}</span>`).join('')+'<em style="display:flex">'+[...'Life'].map((c,i)=>`<span style="animation-delay:${.46+i*.07}s">${c}</span>`).join('')+'</em>';
  s.insertAdjacentHTML('beforeend',M4_ONDAS); m4Particulas(s);
  const t=s.querySelector('.sp-tip'); if(t) t.textContent='Plantando uma vida nova…'; })();

// tela de atualização: mesmo visual, com o broto dentro do anel de progresso
updOverlay=(o=>function(rv){ const novo=!UPD, u=o.apply(this,arguments); if(!novo||!u||!u.el) return u; try{ m4Estilo(); const el=u.el; el.classList.add('m4-fundo'); el.style.background='';
  const st=document.createElement('style'); st.textContent=`#nlUpd{background:none}#nlUpd .u-wrap{width:230px;height:230px}#nlUpd svg{width:230px;height:230px}
#nlUpd .u-mid{justify-content:flex-end;padding-bottom:30px}#nlUpd .u-brot{position:absolute;left:50%;top:22px;width:130px;height:130px;margin-left:-65px;transform:none}#nlUpd .u-brot svg{width:130px;height:130px;transform:none}
#nlUpd .u-pct{font-size:30px;text-shadow:0 2px 10px rgba(40,0,80,.35)}#nlUpd .u-sub{margin-top:2px}#nlUpd h2{font-size:26px;text-shadow:0 3px 14px rgba(40,0,80,.35)}
#nlUpd .u-mus{background:rgba(255,255,255,.2);backdrop-filter:blur(6px)}#nlUpd .u-dica{background:rgba(255,255,255,.12);border-radius:14px;padding:10px 14px}
#nlUpd .u-note{color:#FFE27A}#nlUpd.ok .u-brot{animation:m4Folha .7s cubic-bezier(.3,1.5,.5,1)}`;
  el.appendChild(st); const w=el.querySelector('.u-wrap'); if(w){ const b=document.createElement('div'); b.className='u-brot'; b.innerHTML=`<svg viewBox="0 0 100 100" aria-hidden="true">${marca4SVG('up4',true)}</svg>`; w.appendChild(b); }
  const g=el.querySelector('#nlUg'); if(g) g.innerHTML='<stop offset="0" stop-color="#FFE27A"/><stop offset=".5" stop-color="#5BE39A"/><stop offset="1" stop-color="#FFFFFF"/>';
  el.insertAdjacentHTML('beforeend',M4_ONDAS); m4Particulas(el,14);
  const h=el.querySelector('h2'); if(h){ h.textContent='Uma versão nova está brotando'; h.style.fontSize='clamp(20px,6.2vw,28px)'; } }catch(e){} return u; })(updOverlay);

// marca nova também no topo da tela inicial
showStart=(o=>function(){ const r=o.apply(this,arguments); try{ const m=document.querySelector('#start .hero3-marca'); if(m&&!m.dataset.m4){ m.dataset.m4=1; m.innerHTML=`<svg viewBox="0 0 100 100" aria-hidden="true">${marca4SVG('hs4',true)}</svg>`; m4Estilo(); } }catch(e){} return r; })(showStart);

// clicar de novo no ícone do menu que está aberto fecha o menu
let m4CliqueNav=false;
document.addEventListener('click',e=>{ m4CliqueNav=!!(e.target.closest&&e.target.closest('#nav button,#menuBtn,#sheetNav [data-tab]')); setTimeout(()=>{ m4CliqueNav=false; },0); },true);
UI.open=(o=>function(v){ const sw=document.getElementById('sheetWrap'); if(m4CliqueNav&&sw&&!sw.hidden&&this.stack[0]===v){ m4CliqueNav=false; return this.close(); } return o.apply(this,arguments); })(UI.open);
