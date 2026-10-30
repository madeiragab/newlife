// ===== 3.4: a tela de carregamento prepara tudo antes de abrir o jogo =====
// Confere e desenha antes as peças que aparecem no jogo (ícones, bandeiras, bichos, marca, eventos e sons).
// Se faltar alguma, baixa o jogo de novo uma vez (no app, a cópia do site é conferida pelo sha256 antes de abrir).
const PRE4_MIN_EVENTOS=5000;
const pre4Espera=ms=>new Promise(r=>setTimeout(r,ms));
function pre4Img(svg){ return new Promise(ok=>{ try{ const s=/^<svg/.test(svg)?svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">${svg}</svg>`, im=new Image(), t=setTimeout(()=>ok(false),3000);
  im.onload=()=>{ clearTimeout(t); ok(im.width>0||im.naturalWidth>0||true); }; im.onerror=()=>{ clearTimeout(t); ok(false); };
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s.includes('xmlns=')?s:s.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"')); }catch(e){ ok(false); } }); }
// lista do que precisa existir; cada etapa devolve os nomes do que faltou
function pre4Etapas(){ const ic=['JOB_IC','SPC_IC','COURSE_IC','HOUSE_IC','CAR_IC','ITEM_IC','CRIME_IC','SECTOR_IC','OFFICE_IC'];
  return [
    ['Conferindo o jogo',async()=>['render','newLife','UI','V','modal','pump','faceSVG','bichoSVG','appIconSVG','marca4SVG','bxLook','PET_SPECIES','EVENTS'].filter(n=>{ try{ return typeof window[n]==='undefined'&&typeof eval(n)==='undefined'; }catch(e){ return true; } })],
    ['Carregando as letras',async()=>{ try{ await Promise.race([document.fonts&&document.fonts.ready,pre4Espera(2500)]); }catch(e){} return []; }],
    ['Carregando os ícones',async()=>{ const f=[]; ic.forEach(n=>{ let o; try{ o=eval(n); }catch(e){} if(!o||!Object.keys(o).length||Object.values(o).some(v=>!v)) f.push(n); }); return f; }],
    ['Pintando as bandeiras',async(p)=>{ const f=[], l=Object.entries(FLAG_ART||{}); for(let i=0;i<l.length;i++){ if(!l[i][1]||!(await pre4Img(l[i][1]))) f.push('bandeira '+l[i][0]); if(i%8===0) p(i/l.length); } return f; }],
    ['Desenhando os bichos',async(p)=>{ const f=[]; for(let i=0;i<PET_SPECIES.length;i++){ const s=PET_SPECIES[i]; let svg=''; try{ svg=bichoSVG({id:900+i,species:s.s,age:3,gender:'M',first:''},{w:96}); }catch(e){}
        if(!svg||svg.length<200||!(await pre4Img(svg))) f.push('bicho '+s.s); p(i/PET_SPECIES.length); } return f; }],
    ['Preparando a marca',async()=>{ const f=[]; for(const [n,fn] of [['ícone',()=>appIconSVG(128)],['broto',()=>marca4SVG('pre4',false)]]){ let s=''; try{ s=fn(); }catch(e){} if(!s||!(await pre4Img(s))) f.push(n); } return f; }],
    ['Organizando os eventos',async()=>{ const l=Object.entries(EVENTS||{}), f=[]; if(l.length<PRE4_MIN_EVENTOS) f.push('eventos: '+l.length);
        l.forEach(([k,e])=>{ if(!e||(typeof e.show!=='function'&&typeof e.pick!=='function'&&!e.title&&!e.t)) f.push('evento '+k); }); return f.slice(0,20); }],
    ['Afinando os sons',async()=>{ const f=[]; if(typeof NL_TRILHAS==='undefined'||!Object.keys(NL_TRILHAS).length) f.push('trilhas'); return f; }],
  ]; }
async function pre4Rodar(barra,dica){ const et=pre4Etapas(), faltou=[];
  for(let i=0;i<et.length;i++){ const [nome,fn]=et[i]; if(dica) dica.textContent=nome+'…';
    const prog=k=>{ if(barra) barra.style.width=Math.round((i+Math.min(1,k))/et.length*100)+'%'; }; prog(0);
    try{ faltou.push(...(await fn(prog))); }catch(e){ faltou.push(nome+': '+e.message); } prog(1); await pre4Espera(30); }
  return faltou; }
// baixa o jogo de novo: no site, recarrega sem cache; no app, confere o arquivo do site e abre a cópia nova
async function pre4Rebaixar(faltou){ try{ sessionStorage.setItem('nlPre4',String(Date.now())); }catch(e){}
  const u=typeof updOverlay==='function'?updOverlay(''):null; try{ const h=u&&u.el.querySelector('h2'); if(h) h.textContent='Faltaram peças do jogo. Baixando de novo'; const s=u&&u.el.querySelector('.u-sub'); if(s) s.textContent='baixando'; }catch(e){}
  try{ if(typeof save==='function') save(); }catch(e){}
  if(!(typeof nlIsApp==='function'&&nlIsApp())){ try{ if(window.caches) for(const k of await caches.keys()) await caches.delete(k); }catch(e){}
    const url=location.href.split('#')[0].replace(/([?&])nlr=\d+&?/,'$1').replace(/[?&]$/,''); location.replace(url+(url.includes('?')?'&':'?')+'nlr='+Date.now()+location.hash); return true; }
  try{ const info=await (await fetch(NL_SITE+'version.json?t='+Date.now(),{cache:'no-store'})).json();
    const r=await fetch(NL_SITE+'app.html?t='+Date.now(),{cache:'no-store'}), rd=r.body.getReader(), partes=[]; let got=0, total=+info.size||2500000;
    for(;;){ const {done,value}=await rd.read(); if(done) break; partes.push(value); got+=value.length; u&&u.set(Math.min(.97,got/total)); }
    const bytes=new Uint8Array(got); let o=0; partes.forEach(b=>{ bytes.set(b,o); o+=b.length; });
    const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');
    if(got!==+info.size||hash!==info.sha256) throw Error('arquivo diferente do site');
    u&&u.set(1); const html=new TextDecoder().decode(bytes).replace('<script>window.DESKTOP=1<'+'/script>','');
    await pre4Espera(600); document.open(); document.write(html); document.close(); return true;
  }catch(e){ console.error('Pré-carregamento: não deu para baixar de novo',e); u&&u.close('Não deu para baixar o jogo de novo agora. Ele vai tentar outra vez quando você abrir com internet.'); return false; } }
// a tela de carregamento só sai depois de tudo pronto (no máximo uns 12 s)
let pre4Pronto=null;
function pre4Iniciar(){ if(pre4Pronto) return pre4Pronto; const sp=document.getElementById('splash');
  if(!sp||/^#(demo|teste|qualidade|aventura)/.test(location.hash)) return pre4Pronto=Promise.resolve([]);
  const bar=sp.querySelector('.sp-bar'); let fill=null; if(bar){ fill=document.createElement('b'); fill.className='pre4-fill'; bar.appendChild(fill); }
  const tip=sp.querySelector('.sp-tip'), dica=document.createElement('small'); dica.className='pre4-st'; if(tip) tip.after(dica); else if(bar) bar.after(dica);
  return pre4Pronto=Promise.race([pre4Rodar(fill,dica),pre4Espera(12000).then(()=>[])]).then(async faltou=>{
    if(!faltou.length) return faltou; console.warn('Pré-carregamento: faltou',faltou);
    let tentou=0; try{ tentou=+sessionStorage.getItem('nlPre4')||0; }catch(e){}
    if(navigator.onLine!==false&&Date.now()-tentou>10*60000&&await pre4Rebaixar(faltou)) return new Promise(()=>{});
    return faltou; }); }
hideSplash=(o=>function(){ const a=arguments, t=this; pre4Iniciar().then(()=>o.apply(t,a)); })(hideSplash);
(()=>{ const st=document.createElement('style'); st.textContent='#splash .sp-bar{position:relative;overflow:hidden}#splash .pre4-fill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:inherit;background:linear-gradient(90deg,#FFE27A,#FFFFFF);transition:width .25s ease;opacity:.85}#splash .pre4-st{display:block;margin-top:2px;font-size:12px;color:#fff;opacity:.7;letter-spacing:.3px}'; document.head.appendChild(st); })();
window.addEventListener('DOMContentLoaded',()=>pre4Iniciar());
if(document.readyState!=='loading') setTimeout(pre4Iniciar,0);

function preload4SelfTest(){ const f=[]; const et=pre4Etapas(); if(et.length<8) f.push('etapas');
  if(Object.keys(EVENTS).length<PRE4_MIN_EVENTOS) f.push('eventos '+Object.keys(EVENTS).length);
  PET_SPECIES.forEach((s,i)=>{ const v=bichoSVG({id:5+i,species:s.s,age:3,gender:'F',first:''}); if(!v||v.length<200) f.push(s.s); });
  if(f.length) throw Error('Pré-carregamento · '+f.slice(0,5).join(' | ')); return {ok:true}; }
