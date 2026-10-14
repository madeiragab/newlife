// ===== Tela de atualização: anel de progresso com a música do jogo =====
// Dentro dos apps (Android e Windows), se o site tiver uma versão mais nova, esta tela aparece enquanto o
// jogo novo é baixado. O app recarrega sozinho quando termina. Apps mais novos também mandam o progresso
// real do download por window.nlUpd(0..1); nos outros, a própria página acompanha o download.
const NL_SITE='https://madeiragab.github.io/newlife/';
const nlIsApp=()=>!!window.DESKTOP||/^file:\/\/\/android_asset/.test(location.href);
const UPD_DICAS=['Dica: no paranormal, a mordida de vampiro é para sempre.','Dica: a fé dos seguidores cai todo ano. Faça cultos, discursos e livros.','Dica: no herói, ninguém pode saber sua identidade. Nem a sua mãe.','Dica: em Menu → Novidades você vê tudo o que mudou.','Dica: colegas de equipe podem virar amigos, namorados ou inimigos.','Dica: no apocalipse zumbi, barulho atrai hordas.','Dica: no isekai, morrer é morrer de verdade.','Dica: passar um tempo com todos aproxima a família inteira de uma vez.'];
let UPD=null;
function updOverlay(rv){ if(UPD) return UPD; const C=2*Math.PI*52;
  const el=document.createElement('div'); el.id='nlUpd';
  el.innerHTML=`<style>
#nlUpd{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#fff;text-align:center;padding:24px;
  background:radial-gradient(circle at 50% 38%,#4A86FF 0%,#2E6BFF 28%,#22305E 72%);font-family:Nunito,system-ui,sans-serif;animation:uIn .5s ease-out;overflow:hidden}
@keyframes uIn{from{opacity:0}to{opacity:1}}
#nlUpd .u-wrap{position:relative;width:210px;height:210px;animation:uPulse 2.4s ease-in-out infinite}
@keyframes uPulse{0%,100%{filter:drop-shadow(0 0 10px rgba(255,95,162,.45))}50%{filter:drop-shadow(0 0 26px rgba(124,92,255,.75))}}
#nlUpd svg{width:210px;height:210px;transform:rotate(-90deg)}
#nlUpd .u-track{fill:none;stroke:rgba(255,255,255,.14);stroke-width:11}
#nlUpd .u-bar{fill:none;stroke-width:11;stroke-linecap:round;stroke-dasharray:${C};stroke-dashoffset:${C};transition:stroke-dashoffset .35s ease,stroke .4s}
#nlUpd .u-orb{position:absolute;inset:0;animation:uSpin 3.2s linear infinite}
#nlUpd .u-orb i{position:absolute;top:2px;left:50%;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:#fff;box-shadow:0 0 12px #fff,0 0 22px #FFD54A}
@keyframes uSpin{to{transform:rotate(360deg)}}
#nlUpd .u-mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
#nlUpd .u-pct{font-family:Fredoka,Nunito,sans-serif;font-size:46px;font-weight:600;line-height:1}
#nlUpd .u-sub{font-size:12px;opacity:.8;margin-top:4px;letter-spacing:.5px;text-transform:uppercase}
#nlUpd h2{font-family:Fredoka,Nunito,sans-serif;font-size:24px;margin:6px 0 0;font-weight:600}
#nlUpd .u-ver{font-size:13px;opacity:.82;margin:0}
#nlUpd .u-dica{font-size:13px;opacity:.9;min-height:36px;max-width:300px;transition:opacity .4s}
#nlUpd .u-mus{font-size:13px;background:rgba(255,255,255,.14);border:0;color:#fff;border-radius:999px;padding:8px 16px;cursor:pointer;font-family:inherit}
#nlUpd .u-note{position:absolute;bottom:-30px;font-size:22px;opacity:0;animation:uNote 4.5s linear infinite;pointer-events:none}
@keyframes uNote{0%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:.85}100%{transform:translateY(-110vh) rotate(25deg);opacity:0}}
#nlUpd.ok .u-bar{stroke:#3BD18A}#nlUpd.ok .u-orb{display:none}
</style>
<div class="u-wrap"><svg viewBox="0 0 120 120"><defs><linearGradient id="nlUg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD54A"/><stop offset=".5" stop-color="#FF5FA2"/><stop offset="1" stop-color="#7C5CFF"/></linearGradient></defs><circle cx="60" cy="60" r="52" class="u-track"/><circle cx="60" cy="60" r="52" class="u-bar" stroke="url(#nlUg)"/></svg>
<div class="u-orb"><i></i></div><div class="u-mid"><div class="u-pct">0%</div><div class="u-sub">baixando</div></div></div>
<h2>Atualizando o NewLife</h2><p class="u-ver">Versão de ${nlVerTxt(rv)} · seu progresso está salvo</p>
<p class="u-dica">${UPD_DICAS[0]}</p><button class="u-mus">🎵 Tocar a música do jogo</button>`;
  document.body.appendChild(el);
  // notinhas subindo pela tela
  ['♪','♫','♩','♬'].forEach((n,i)=>{ for(let k=0;k<2;k++){ const s=document.createElement('span'); s.className='u-note'; s.textContent=n; s.style.left=(8+((i*2+k)*12)%86)+'%'; s.style.animationDelay=(i*1.1+k*2.3)+'s'; el.appendChild(s); } });
  const bar=el.querySelector('.u-bar'), pct=el.querySelector('.u-pct'), sub=el.querySelector('.u-sub'), dica=el.querySelector('.u-dica'), btn=el.querySelector('.u-mus');
  let di=0; const dt=setInterval(()=>{ dica.style.opacity=0; setTimeout(()=>{ di=(di+1)%UPD_DICAS.length; dica.textContent=UPD_DICAS[di]; dica.style.opacity=.9; },400); },3600);
  const tocar=()=>{ try{ SND.started=true; startMusic(); const c=SND.ctx; if(c&&c.state==='running'&&musOn()) btn.style.display='none'; }catch(e){} };
  btn.onclick=e=>{ e.stopPropagation(); if(META.music===false){ META.music=true; } tocar(); setTimeout(()=>{ if(SND.ctx&&SND.ctx.state==='running') btn.style.display='none'; },300); };
  tocar(); setTimeout(()=>{ if(SND.ctx&&SND.ctx.state==='running'&&musOn()) btn.style.display='none'; },400);
  UPD={el,p:0,native:false,set(p){ p=Math.max(this.p,Math.min(1,p)); this.p=p; bar.style.strokeDashoffset=C*(1-p); pct.textContent=Math.floor(p*100)+'%';
      if(p>=1&&!el.classList.contains('ok')){ el.classList.add('ok'); pct.textContent='✓'; sub.textContent='pronto'; el.querySelector('h2').textContent='Prontinho!'; dica.textContent='Abrindo a versão nova…'; clearInterval(dt); try{ sfx('level'); }catch(e){} } },
    close(msg){ clearInterval(dt); el.style.transition='opacity .5s'; el.style.opacity=0; setTimeout(()=>el.remove(),500); UPD=null; if(msg) setTimeout(()=>{ try{ msg&&modal({k:'NewLife',t:'Atualização',x:msg}); }catch(e){} },600); }};
  return UPD; }
// apps novos mandam o progresso real do download
window.nlUpd=p=>{ const u=UPD||updOverlay(window.nlUpdVer||''); u.native=true; u.set(+p||0); };
async function nlAppUpdateCheck(){ if(!nlIsApp()||/teste|aventura|demo|qualidade/.test(location.hash)) return;
  let info; try{ const r=await fetch(NL_SITE+'version.json?t='+Date.now(),{cache:'no-store'}); info=await r.json(); }catch(e){ return; }
  const rv=String(info&&info.v||''); if(!rv||rv<=NLV()) return;
  window.nlUpdVer=rv; const u=updOverlay(rv);
  // acompanha o download (o app baixa ao mesmo tempo e recarrega sozinho quando terminar)
  try{ const r=await fetch(NL_SITE+'app.html?t='+Date.now(),{cache:'no-store'}); const total=+(info.size||0)||2500000; const rd=r.body.getReader(); let got=0;
    for(;;){ const {done,value}=await rd.read(); if(done) break; got+=value.length; if(!u.native) u.set(Math.min(.97,got/total)); }
    if(!u.native) u.set(1);
  }catch(e){ if(!u.native){ u.close('Não deu para baixar a atualização agora. Ela entra na próxima vez que você abrir o app com internet.'); return; } }
  // se o app não recarregar em 25 s, a versão nova entra na próxima abertura
  setTimeout(()=>{ if(UPD) UPD.close('A versão nova foi baixada e entra na próxima vez que você abrir o app.'); },25000); }
window.addEventListener('load',()=>setTimeout(()=>{ nlAppUpdateCheck().catch(()=>{}); },700));
// demonstração para conferir o visual (#demo-atualizando)
if(/demo-atualizando/.test(location.hash)) window.addEventListener('load',()=>setTimeout(()=>{ const u=updOverlay(NLV()||'2610141200'); let p=0; const t=setInterval(()=>{ p+=.07; u.set(Math.min(.62,p)); if(p>=.62) clearInterval(t); },120); },900));
