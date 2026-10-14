// ===== Versão e aviso de atualização =====
// Os apps (Android e Windows) procuram uma versão nova no site sempre que abrem e trocam o jogo sozinhos.
// Aqui o jogo só mostra a versão e avisa quando acabou de ser atualizado.
const NLV=()=>String(window.NL_VER||'');
const nlVerTxt=v=>{ if(!v||v.length!==10) return 'desenvolvimento'; const d=new Date(Date.UTC(2000+ +v.slice(0,2),+v.slice(2,4)-1,+v.slice(4,6),+v.slice(6,8),+v.slice(8,10))); const z=n=>String(n).padStart(2,'0'); return `${z(d.getDate())}/${z(d.getMonth()+1)}/${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`; };
function nlCheckUpdated(){ const v=NLV(); if(!v) return; let old=null; try{ old=localStorage.getItem('nlVer'); localStorage.setItem('nlVer',v); }catch(e){ return; }
  if(old&&old!==v&&old<v&&typeof modal==='function'&&!/teste|aventura|demo|qualidade/.test(location.hash)) modal({k:'NewLife',t:'Jogo atualizado!',x:`Você está na versão de ${nlVerTxt(v)}. O seu progresso continua salvo.\n\nAs novidades aparecem no menu e nos eventos.`}); }
V.menu=(o=>()=>{ const r=o(); if(r&&r.items) r.items.push({html:`<div class="card"><p style="color:var(--muted);font-size:12px;text-align:center">Versão ${esc(nlVerTxt(NLV()))} · o app procura atualizações sozinho sempre que abre</p></div>`}); return r; })(V.menu);
window.addEventListener('load',()=>setTimeout(()=>{ try{ nlCheckUpdated(); }catch(e){} },1800));
