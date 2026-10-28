// ===== Marca 3.0: rostinho com um broto (vida nova) dentro de um anel de arco-íris =====
// Usado no ícone do app (#demo-icone), na tela de carregamento e na tela inicial.
const MARCA3_CORES=['#F0567A','#FF9F1C','#FFD23F','#22C3A6','#2E86FF','#9B5DE5'];
function marca3SVG(){
  const anel=MARCA3_CORES.map((c,i)=>`<circle cx="50" cy="52" r="40" fill="none" stroke="${c}" stroke-width="7" pathLength="6" stroke-dasharray="1 5" stroke-dashoffset="${-i}" transform="rotate(-90 50 52)"/>`).join('');
  return `<g stroke-linejoin="round" stroke-linecap="round">
    <circle cx="50" cy="52" r="40" fill="#FFFFFF"/>${anel}
    <path d="M50,30 C50,24 50,20 50,15" stroke="#15803D" stroke-width="3" fill="none"/>
    <path d="M50,21 C44,12 35,13 32,15 C35,22 44,24 50,21Z" fill="#34D399" stroke="#15803D" stroke-width="1.6"/>
    <path d="M50,17 C56,6 67,7 71,9 C67,18 57,21 50,17Z" fill="#4ADE80" stroke="#15803D" stroke-width="1.6"/>
    <circle cx="50" cy="56" r="24" fill="#F5C9A6" stroke="#B9785A" stroke-width="1.8"/>
    <path d="M26.5,54 C25,38 36,29 50,29 C64,29 75.5,38 73.5,53 C68,45 59,40.5 47,42 C38,43 31,47 26.5,54Z" fill="#3B2A4A" stroke="#21172C" stroke-width="1.6"/>
    <ellipse cx="41.5" cy="57.5" rx="2.8" ry="3.6" fill="#1D1838"/><ellipse cx="58.5" cy="57.5" rx="2.8" ry="3.6" fill="#1D1838"/>
    <circle cx="42.4" cy="56.2" r="1" fill="#fff"/><circle cx="59.4" cy="56.2" r="1" fill="#fff"/>
    <circle cx="36" cy="64" r="3.6" fill="#F28B8B" opacity=".55"/><circle cx="64" cy="64" r="3.6" fill="#F28B8B" opacity=".55"/>
    <path d="M43,65.5 Q50,72.5 57,65.5" fill="none" stroke="#7A2E2E" stroke-width="2.6"/>
  </g>`;
}
appIconSVG=function(px=1024){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${px}" height="${px}"><defs><clipPath id="ico"><rect x="4" y="4" width="112" height="112" rx="28"/></clipPath>
  <linearGradient id="icobg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4338CA"/><stop offset=".55" stop-color="#7C3AED"/><stop offset="1" stop-color="#DB2777"/></linearGradient></defs>
  <g clip-path="url(#ico)"><rect width="120" height="120" fill="url(#icobg)"/><circle cx="22" cy="20" r="30" fill="#fff" opacity=".1"/><circle cx="104" cy="108" r="34" fill="#fff" opacity=".08"/>
  <g fill="#FFE27A"><path d="M98,18 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2z"/><path d="M18,98 l1.4,4 4,1.4 -4,1.4 -1.4,4 -1.4,-4 -4,-1.4 4,-1.4z"/></g>
  <g transform="translate(13 11) scale(.94)">${marca3SVG()}</g></g></svg>`;
};
// tela de carregamento nova
(()=>{ const a=document.getElementById('splashArt'); if(a) a.innerHTML=`<svg viewBox="0 0 100 100" width="150" height="150" aria-hidden="true">${marca3SVG()}</svg>`;
  const t=document.querySelector('#splash .sp-tip'); if(!t) return;
  const dicas=['Sorteando uma nova vida…','Escolhendo a sua família…','Arrumando o quarto do bebê…','Embaralhando o destino…','Pintando o cenário…'];
  let i=0; const id=setInterval(()=>{ if(!document.getElementById('splash')) return clearInterval(id); i=(i+1)%dicas.length; t.classList.remove('troca'); t.offsetWidth; t.textContent=dicas[i]; t.classList.add('troca'); },700); })();
