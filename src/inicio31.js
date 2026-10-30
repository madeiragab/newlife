// ===== 3.1: tela inicial =====
// Ícones desenhados (no lugar dos emojis), estrelinhas piscando no topo, entrada em cascata e, no computador,
// a tela em duas colunas: o topo vira um painel grande à esquerda e as ações ficam à direita.
const INI_ICO={
 nova:`<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="iiN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9F6CA"/><stop offset="1" stop-color="#34D399"/></linearGradient></defs><path d="M24 42V24" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><path d="M24 26C24 16 16 11 8 12c0 9 6 15 16 14Z" fill="url(#iiN)"/><path d="M24 22c0-8 6-13 14-13 0 8-5 14-14 13Z" fill="#fff" opacity=".92"/><ellipse cx="24" cy="42" rx="10" ry="2.6" fill="#fff" opacity=".35"/></svg>`,
 cont:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" stroke-width="3" opacity=".25"/><path d="M24 7a17 17 0 0 1 17 17" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M20 16.5v15l12-7.5Z" fill="currentColor"/></svg>`,
 news:`<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="10" width="26" height="30" rx="5" fill="none" stroke="currentColor" stroke-width="3"/><path d="M14 18h14M14 24h14M14 30h9" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M38 6l1.6 4.4L44 12l-4.4 1.6L38 18l-1.6-4.4L32 12l4.4-1.6Z" fill="#F5B83D"/></svg>`,
};
showStart=(o=>function(tela){ const r=o.apply(this,arguments); try{ const st=document.getElementById('start'), hs=st&&st.querySelector('.home-screen'); if(!hs) return r;
  const ico=(id,k)=>{ const b=document.getElementById(id), h=b&&b.querySelector('.home-icon'); if(h&&!h.querySelector('img')) h.innerHTML=INI_ICO[k]; };
  ico('stNew','nova'); ico('stCont','cont'); ico('stNews','news');
  const hero=hs.querySelector('.hero3'); if(hero&&!hero.querySelector('.hero3-estrelas')){ const e=document.createElement('div'); e.className='hero3-estrelas'; e.setAttribute('aria-hidden','true');
   e.innerHTML=Array.from({length:14},(_,i)=>`<i style="--x:${(i*37+11)%100}%;--y:${(i*53+7)%80}%;--d:${(i%5)*.7}s;--s:${.6+(i%3)*.35}"></i>`).join(''); hero.prepend(e); }
  hs.classList.add('entra31'); }catch(e){} return r; })(showStart);
