// ===== Marca do jogo: caduceu (ícone do app e tela de carregamento) =====
// Desenho próprio: bastão dourado, asas brancas e duas serpentes verdes entrelaçadas, centralizado num quadro 100×100
function caduceusSVG(){
  const wing='M47,25 C38,16 25,11 10,12 C16,16 21,18 25,19.5 C19,20.5 14,22 10,24.5 C18,26.5 24,27 29.5,27 C24.5,29 20.5,31 17,33.5 C28,35 39,33 47,32Z';
  const feather='M14,14.5 C24,16 33,19 43,25 M14,24.8 C25,26 34,27.5 43,28.5';
  const snakeA='M50,86 C37,80 37,71 50,65 C63,59 63,51 50,45 C40,40 40,33.5 45.5,30.5';
  const snakeB='M50,86 C63,80 63,71 50,65 C37,59 37,51 50,45 C60,40 60,33.5 54.5,30.5';
  const snake=(d,c,e)=>`<path d="${d}" fill="none" stroke="${e}" stroke-width="7.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="4.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" stroke-dasharray="1.2 4" opacity=".55"/>`;
  return `<g stroke-linejoin="round">
    <path d="${wing}" fill="#FFFFFF" stroke="#C9D6F2" stroke-width="1.4"/><path d="${feather}" fill="none" stroke="#C9D6F2" stroke-width="1.1"/>
    <g transform="translate(100 0) scale(-1 1)"><path d="${wing}" fill="#FFFFFF" stroke="#C9D6F2" stroke-width="1.4"/><path d="${feather}" fill="none" stroke="#C9D6F2" stroke-width="1.1"/></g>
    <rect x="47.3" y="17" width="5.4" height="74" rx="2.7" fill="#F4C443" stroke="#B88A1E" stroke-width="1.3"/>
    <rect x="48.4" y="20" width="1.4" height="68" rx=".7" fill="#FFE7A0" opacity=".8"/>
    <circle cx="50" cy="14" r="5.6" fill="#F4C443" stroke="#B88A1E" stroke-width="1.3"/><circle cx="48.4" cy="12.4" r="1.6" fill="#FFF3C4"/>
    ${snake(snakeA,'#2FBF71','#13784A')}${snake(snakeB,'#3FD487','#13784A')}
    <ellipse cx="44.6" cy="29.6" rx="3.6" ry="2.7" fill="#2FBF71" stroke="#13784A" stroke-width="1.2" transform="rotate(-20 44.6 29.6)"/>
    <ellipse cx="55.4" cy="29.6" rx="3.6" ry="2.7" fill="#3FD487" stroke="#13784A" stroke-width="1.2" transform="rotate(20 55.4 29.6)"/>
    <circle cx="44" cy="28.8" r=".75" fill="#10251A"/><circle cx="56" cy="28.8" r=".75" fill="#10251A"/>
  </g>`;
}
// Ícone do app (#demo-icone): caduceu num quadrado azul
function appIconSVG(px=1024){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${px}" height="${px}"><defs><clipPath id="ico"><rect x="4" y="4" width="112" height="112" rx="26"/></clipPath>
  <radialGradient id="icobg" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#4C86FF"/><stop offset="1" stop-color="#1F55E0"/></radialGradient></defs>
  <g clip-path="url(#ico)"><rect width="120" height="120" fill="url(#icobg)"/><circle cx="60" cy="60" r="44" fill="#fff" opacity=".12"/>
  <g transform="translate(11 11) scale(.98)">${caduceusSVG()}</g></g>
  <rect x="4" y="4" width="112" height="112" rx="26" fill="none" stroke="#163C9E" stroke-width="3"/></svg>`;
}
// Tela de carregamento: aparece já na abertura e some quando o jogo está pronto (no mínimo ~1,3 s, para dar tempo de ver)
const SPLASH_T0=Date.now();
function hideSplash(){
  const s=document.getElementById('splash'); if(!s) return;
  const fast=/^#(demo|teste|qualidade|aventura)/.test(location.hash);
  setTimeout(()=>{ s.classList.add('out'); setTimeout(()=>s.remove(),fast?0:450); },fast?0:Math.max(0,1300-(Date.now()-SPLASH_T0)));
}
(()=>{ const s=document.getElementById('splashArt'); if(s) s.innerHTML=`<svg viewBox="0 0 100 100" width="150" height="150" aria-hidden="true">${caduceusSVG()}</svg>`; })();
