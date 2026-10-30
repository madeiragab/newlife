// ===== 3.1: sons novos =====
// Tudo sintetizado na hora (sem arquivos): uma sala com eco suave deixa os sons mais cheios. Novos: uivo do
// lobisomem, sirene de verdade (subindo e descendo), sino fúnebre com órgão, golpe quando eu mato alguém, harpa
// no romance, caixinha de música quando nasce um filho, brilho no que é bom, acorde menor no que é ruim, cartão
// abrindo, escolha confirmada e um toque bem leve ao passar o mouse nos botões.

// eco: uma resposta de sala gerada com ruído que decai
function sRev(){ const c=audio(); if(!c) return null; if(SND.rev) return SND.rev;
  const len=Math.ceil(c.sampleRate*2.2), b=c.createBuffer(2,len,c.sampleRate);
  for(let ch=0;ch<2;ch++){ const d=b.getChannelData(ch); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2); }
  const conv=c.createConvolver(); conv.buffer=b; const wet=c.createGain(); wet.gain.value=.32; conv.connect(wet); wet.connect(SND.fx);
  const bus=c.createGain(); bus.connect(SND.fx); bus.connect(conv); SND.rev=bus; return bus; }
const sT=(f,t,d,o={})=>sTone(f,t,d,Object.assign({dest:sRev()||undefined},o));
// som com vibrato e curva de volume própria (uivo, sirene)
function sVoz(t0,dur,pts,{type='sawtooth',vol=.06,lp=1800,vib=0,vibHz=5}={}){ const c=SND.ctx, o=c.createOscillator(), g=c.createGain(), f=c.createBiquadFilter();
  o.type=type; f.type='lowpass'; f.frequency.value=lp; pts.forEach(([tt,hz],i)=>i?o.frequency.exponentialRampToValueAtTime(hz,t0+tt):o.frequency.setValueAtTime(hz,t0));
  if(vib){ const l=c.createOscillator(), lg=c.createGain(); l.frequency.value=vibHz; lg.gain.value=vib; l.connect(lg); lg.connect(o.frequency); l.start(t0); l.stop(t0+dur+.1); }
  g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(vol,t0+Math.min(.25,dur*.2)); g.gain.setValueAtTime(vol,t0+dur*.7); g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  o.connect(f); f.connect(g); g.connect(sRev()||SND.fx); o.start(t0); o.stop(t0+dur+.05); }

Object.assign(SFX,{
  // uivo: sobe devagar, segura com vibrato e cai; um segundo lobo responde ao longe
  howl:t=>{ sVoz(t,2.6,[[0,330],[.5,520],[1.6,560],[2.6,300]],{type:'sawtooth',vol:.05,lp:1400,vib:9,vibHz:5.5}); sVoz(t,2.6,[[0,165],[.5,262],[1.6,280],[2.6,150]],{type:'triangle',vol:.05,lp:900,vib:5});
    sVoz(t+1.4,2,[[0,300],[.4,470],[1.3,500],[2,280]],{type:'sawtooth',vol:.018,lp:900,vib:8}); sNoise(t,.5,{vol:.03,freq:600,q:.4}); },
  // sirene: duas notas que deslizam, com o volume chegando e indo embora
  siren:t=>{ for(let i=0;i<3;i++){ const a=t+i*.9; sVoz(a,.9,[[0,620],[.45,1050],[.9,620]],{type:'square',vol:.03*(i===1?1.2:1),lp:2600}); sVoz(a,.9,[[0,628],[.45,1062],[.9,628]],{type:'sawtooth',vol:.018,lp:2000}); } },
  // fúnebre: sino grave tocando três vezes sobre um acorde de órgão em lá menor
  death:t=>{ [0,1.4,2.8].forEach(d=>{ [1,2.4,3,4.2].forEach((h,i)=>sT(N(45)*h,t+d,2.6-i*.4,{vol:.09/(i+1),attack:.004})); });
    [[57,60,64],[55,59,62],[53,57,60],[52,56,59]].forEach((ch,i)=>ch.forEach(n=>{ sT(N(n),t+.2+i*1.1,1.6,{type:'triangle',vol:.035,attack:.25}); sT(N(n-12),t+.2+i*1.1,1.6,{type:'sine',vol:.04,attack:.25}); })); },
  // matei alguém: golpe surdo, estalo e um acorde dissonante que fica no ar
  kill:t=>{ sNoise(t,.18,{vol:.4,freq:160,q:.8,type:'lowpass'}); sTone(90,t,.25,{vol:.25,slide:40}); sNoise(t+.02,.06,{vol:.15,freq:3500,q:3});
    [[50,.0],[51,.04],[57,.08]].forEach(([n,d])=>sT(N(n),t+.15+d,1.6,{type:'sawtooth',vol:.025,attack:.05})); sT(N(38),t+.15,1.8,{vol:.08}); },
  // romance: arpejo de harpa e um acorde macio
  romance:t=>{ [67,71,74,79,83,86].forEach((n,i)=>{ sT(N(n),t+i*.08,1.2,{type:'triangle',vol:.05,attack:.004}); sT(N(n)*2,t+i*.08,.5,{vol:.012}); });
    [67,71,74].forEach(n=>sT(N(n-12),t+.5,1.6,{vol:.035,attack:.3})); },
  // filho: caixinha de música com uma melodia curta e doce
  baby:t=>{ [[79,0],[76,.22],[79,.44],[84,.66],[81,.99],[79,1.21],[76,1.43],[72,1.65]].forEach(([n,d])=>{ sT(N(n),t+d,.9,{vol:.06,attack:.002}); sT(N(n)*3,t+d,.25,{vol:.01,attack:.002}); }); sT(N(60),t,2,{vol:.03,attack:.2}); },
  // bom: brilho subindo; ruim: acorde menor caindo com um baque grave
  good:t=>{ [72,76,79,84].forEach((n,i)=>sT(N(n),t+i*.06,.5,{type:'triangle',vol:.07})); sNoise(t+.18,.35,{vol:.03,freq:7000,q:1.5}); },
  bad:t=>{ sTone(70,t,.3,{vol:.16,slide:45}); [[63,0],[60,.1],[56,.2]].forEach(([n,d])=>sT(N(n),t+d,.7,{type:'sine',vol:.07})); },
  card:t=>{ sNoise(t,.22,{vol:.05,freq:1800,q:.5}); sT(N(84),t+.08,.25,{vol:.025}); },
  choose:t=>{ sTone(880,t,.06,{type:'triangle',vol:.06}); sTone(1320,t+.04,.08,{type:'triangle',vol:.04}); },
  hover:t=>sTone(1800+Math.random()*500,t,.03,{type:'sine',vol:.018,attack:.002}),
});

// frases que pedem som próprio (as do sound.js continuam valendo para o resto)
const NL_SOM_FRASE=[[/\b(matei|assassinei|executei|tirei a vida d)|morreu nas minhas mãos|acabei com a vida/i,'kill'],
 [/lua cheia|uivei|me transformei|virei lobo|instinto do lobo|alcateia/i,'howl'],
 [/\b(beijei|beijo|namorando|pedi .{0,20}em namoro|aceitou namorar|me apaixonei|apaixonad|primeiro encontro|me declarei|noivei|pedido de casamento)/i,'romance']];
const NL_SOM_PRIO={death:6,kill:5,siren:5,howl:4,promo:3,bells:3,baby:3,romance:3,cash:2,bad:1,good:1};
let nlSomFila=null, nlSomTm=0;
soundForLine=(o=>{ const fn=function(t,tone){ for(const [re,s] of NL_SOM_FRASE) if(re.test(t)){ if(!nlSomFila||NL_SOM_PRIO[s]>NL_SOM_PRIO[nlSomFila]) nlSomFila=s; clearTimeout(nlSomTm); nlSomTm=setTimeout(()=>{ if(nlSomFila) sfx(nlSomFila,400); nlSomFila=null; },60); return null; } return o(t,tone); }; return fn; })(soundForLine);

// cartões: som pelo tema (lobisomem uiva, polícia toca sirene) e um "toque" ao escolher
function nlSomCartao(){ const md=document.getElementById('modal'); if(!md||document.getElementById('modalWrap').hidden) return;
  const k=(md.querySelector('.kick')?.textContent||'')+' '+(md.querySelector('h2')?.textContent||'');
  const nm=/Lobisomem|lua cheia/i.test(k)?'howl':/Polícia|Prisão|Julgamento|preso/i.test(k)?'siren':/Amor|Romance|Namoro|Paquera|Casamento/i.test(k)?'romance':/Filho|Bebê|Gravidez|Nascimento/i.test(k)?'baby':'card';
  sfx(nm,nm==='howl'||nm==='siren'?3000:250); }
if(typeof pump==='function') pump=(o=>function(){ const antes=modalOpen; const r=o.apply(this,arguments); try{ if(!antes&&modalOpen&&!/^#(teste|qualidade|demo)/.test(location.hash)) nlSomCartao(); }catch(e){} return r; })(pump);
document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#modal [data-c],.pv3-item,.pv3-ok')) sfx('choose',80); },true);

// passar o mouse: toque leve (só com mouse de verdade, não no celular)
const NL_HOVER='button:not(:disabled),.row,.tile,.btn,.home-action,.pv3-item,.fam3';
let nlHoverEl=null;
if(window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches) document.addEventListener('pointerover',e=>{ const el=e.target.closest&&e.target.closest(NL_HOVER); if(el&&el!==nlHoverEl&&SND.started) sfx('hover',45); nlHoverEl=el; },true);
