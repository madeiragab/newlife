// ===== Sons: tudo sintetizado com Web Audio (sem arquivos), efeitos leves e música ambiente baixinha =====
const SND={ctx:null,master:null,fx:null,mus:null,timer:null,last:{},step:0};
const sndOn=()=>META.sfx!==false, musOn=()=>META.music!==false;
function audio(){
  if(SND.ctx) return SND.ctx;
  const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null;
  const c=new AC(); SND.ctx=c;
  SND.master=c.createGain(); SND.master.gain.value=.9; SND.master.connect(c.destination);
  SND.fx=c.createGain(); SND.fx.gain.value=.55; SND.fx.connect(SND.master);
  // música passa por um filtro passa-baixa e um eco curto para ficar macia
  SND.mus=c.createGain(); SND.mus.gain.value=0; const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1400;
  const dl=c.createDelay(); dl.delayTime.value=.42; const fb=c.createGain(); fb.gain.value=.32; dl.connect(fb); fb.connect(dl);
  SND.mus.connect(lp); lp.connect(SND.master); lp.connect(dl); dl.connect(SND.master);
  return c;
}
// nota simples com envelope
function sTone(f,t0,dur,{type='sine',vol=.2,dest,attack=.008,release,slide}={}){
  const c=SND.ctx; const o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.setValueAtTime(f,t0); if(slide) o.frequency.exponentialRampToValueAtTime(slide,t0+dur);
  g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(vol,t0+attack); g.gain.exponentialRampToValueAtTime(.0001,t0+(release||dur));
  o.connect(g); g.connect(dest||SND.fx); o.start(t0); o.stop(t0+(release||dur)+.05);
}
function sNoise(t0,dur,{vol=.2,freq=1200,q=1,type='bandpass'}={}){
  const c=SND.ctx, b=c.createBuffer(1,Math.ceil(c.sampleRate*dur),c.sampleRate), d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  const s=c.createBufferSource(); s.buffer=b; const f=c.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q; const g=c.createGain();
  g.gain.setValueAtTime(vol,t0); g.gain.exponentialRampToValueAtTime(.0001,t0+dur); s.connect(f); f.connect(g); g.connect(SND.fx); s.start(t0); s.stop(t0+dur+.02);
}
const N=n=>440*Math.pow(2,(n-69)/12);   // nota MIDI -> Hz
const SFX={
  click:t=>sTone(1250,t,.05,{type:'triangle',vol:.07,slide:900}),
  pop:t=>{ sTone(660,t,.09,{vol:.09}); sTone(990,t+.05,.12,{vol:.07}); },
  good:t=>[72,76,79].forEach((n,i)=>sTone(N(n),t+i*.07,.35,{type:'triangle',vol:.1})),
  bad:t=>{ sTone(196,t,.4,{type:'sine',vol:.16,slide:130}); sTone(147,t+.12,.5,{type:'sine',vol:.1,slide:98}); },
  cash:t=>{ sNoise(t,.05,{vol:.12,freq:5000,q:2}); [84,88,91].forEach((n,i)=>sTone(N(n),t+.04+i*.06,.22,{type:'square',vol:.035})); },
  promo:t=>{ [67,72,76,79,84].forEach((n,i)=>sTone(N(n),t+i*.09,i===4?.7:.25,{type:'triangle',vol:.11})); sTone(N(60),t+.36,.8,{vol:.06}); },
  level:t=>[76,79,83,88].forEach((n,i)=>sTone(N(n),t+i*.08,.3,{type:'square',vol:.04})),
  siren:t=>{ for(let i=0;i<4;i++){ sTone(700,t+i*.5,.25,{type:'sawtooth',vol:.045,slide:1100,release:.25}); sTone(1100,t+i*.5+.25,.25,{type:'sawtooth',vol:.045,slide:700,release:.25}); } },
  death:t=>{ [[57,60,64],[55,59,62],[53,57,60]].forEach((ch,i)=>ch.forEach(n=>sTone(N(n),t+i*.55,1.1,{type:'sine',vol:.07,attack:.08}))); },
  bells:t=>[79,76,72,79,84].forEach((n,i)=>{ sTone(N(n),t+i*.22,1,{vol:.1}); sTone(N(n)*2.76,t+i*.22,.5,{vol:.02}); }),
  baby:t=>[84,86,88,91].forEach((n,i)=>sTone(N(n),t+i*.1,.25,{type:'sine',vol:.08})),
  punch:t=>{ sNoise(t,.12,{vol:.35,freq:180,q:.7,type:'lowpass'}); sTone(110,t,.12,{vol:.2,slide:55}); },
  miss:t=>sNoise(t,.18,{vol:.08,freq:2500,q:.6}),
  birthday:t=>[67,67,69,67,72,71].forEach((n,i)=>sTone(N(n),t+i*.13,.18,{type:'triangle',vol:.06})),
  heart:t=>{ sTone(70,t,.12,{vol:.25}); sTone(65,t+.18,.14,{vol:.2}); },
  win:t=>[72,79,84].forEach((n,i)=>sTone(N(n),t+i*.1,.4,{type:'triangle',vol:.11})),
  door:t=>{ sNoise(t,.25,{vol:.15,freq:400,q:.8}); sTone(98,t,.3,{vol:.12}); },
};
function sfx(name,minGap=120){
  if(!sndOn()||/^#(teste|qualidade|demo)/.test(location.hash)) return; const c=audio(); if(!c) return; if(c.state==='suspended') c.resume();
  const now=performance.now(); if(now-(SND.last[name]||0)<minGap) return; SND.last[name]=now;
  try{ SFX[name]&&SFX[name](c.currentTime+.01); }catch(e){}
}
// ---------- música ambiente: acordes lentos e notas soltas de uma escala pentatônica ----------
const PROG=[[48,55,64,71],[45,52,60,67],[41,48,57,64],[43,50,59,65]];   // Cmaj7, Am7, Fmaj7, G7sus
const PENTA=[72,74,76,79,81,84,86,88];
function musicBar(){
  const c=SND.ctx; if(!c||!musOn()) return; const t=c.currentTime+.05, ch=PROG[SND.step%PROG.length]; SND.step++;
  ch.forEach((n,i)=>sTone(N(n),t+i*.05,5.2,{type:i?'sine':'triangle',vol:i?.05:.07,dest:SND.mus,attack:1.4,release:5.2}));
  for(let k=0;k<3;k++) if(Math.random()<.6) sTone(N(R.pick(PENTA)),t+.6+k*1.3+Math.random()*.4,1.8,{type:'sine',vol:.035,dest:SND.mus,attack:.02,release:1.8});
}
function startMusic(){
  const c=audio(); if(!c||!musOn()||SND.timer) return; if(c.state==='suspended') c.resume();
  SND.mus.gain.cancelScheduledValues(c.currentTime); SND.mus.gain.setTargetAtTime(.55,c.currentTime,1.5);
  musicBar(); SND.timer=setInterval(musicBar,4800);
}
function stopMusic(){ if(SND.timer){ clearInterval(SND.timer); SND.timer=null; } if(SND.ctx) SND.mus.gain.setTargetAtTime(0,SND.ctx.currentTime,.4); }
document.addEventListener('visibilitychange',()=>{ if(document.hidden) stopMusic(); else if(SND.started) startMusic(); });
// o navegador só deixa tocar som depois do primeiro toque
document.addEventListener('pointerdown',e=>{
  if(/^#(teste|qualidade)/.test(location.hash)) return;
  if(!SND.started){ SND.started=true; startMusic(); }
  if(e.target.closest&&e.target.closest('button,.row,.btn')) sfx('click',40);
},true);

// ---------- efeitos nos momentos importantes ----------
function soundForLine(t,tone){
  if(/pres[oa]\b|algemad|polícia (me )?(pegou|prendeu|chegou)|Fui pres/i.test(t)) return 'siren';
  if(/^Morri /.test(t)) return 'death';
  if(/promovid|Subi (na|para|de)|Virei (capitão|titular|líder|braço)|Passei no exame de|faixa preta|Agora sou/i.test(t)) return 'promo';
  if(/Casei|casamento foi|aliança/i.test(t)) return 'bells';
  if(/Nasceu|nasceu (meu|minha)|é pai|é mãe|Sou pai|Sou mãe/i.test(t)) return 'baby';
  if(/Ganhei \$|ganhei \$|herança|Recebi \$|prêmio de \$|na conta/i.test(t)&&tone!=='bad') return 'cash';
  if(tone==='good') return 'good'; if(tone==='bad') return 'bad'; return null;
}
// uma linha por vez, com prioridade para os sons mais marcantes
let sndQ=null;
log=(orig=>function(t,tone){ orig(t,tone); const s=soundForLine(String(t),tone); if(s){ const pr={death:5,siren:4,promo:3,bells:3,baby:3,cash:2,bad:1,good:1}; if(!sndQ||pr[s]>pr[sndQ]) sndQ=s; clearTimeout(soundForLine.tm); soundForLine.tm=setTimeout(()=>{ if(sndQ) sfx(sndQ,300); sndQ=null; },60); } })(log);
arrest=(orig=>function(...a){ sfx('siren',2000); return orig(...a); })(arrest);
fightTurn=(orig=>function(mv){ const op=FIGHT&&FIGHT.op, me=FIGHT&&FIGHT.me; const r=orig(mv); if(FIGHT){ if(FIGHT.op<op||FIGHT.me<me) sfx('punch',60); else sfx('miss',60); if(FIGHT.done) setTimeout(()=>sfx(FIGHT&&FIGHT.result==='venceu'?'win':FIGHT&&FIGHT.result==='fugiu'?'door':'bad',200),250); } return r; })(fightTurn);
ageUp=(orig=>function(){ const was=S&&S.me&&S.me.alive; const r=orig(); if(was&&S.me.alive) sfx('birthday',800); return r; })(ageUp);
modal=(orig=>function(o){ if(o&&!/^#(teste|qualidade)/.test(location.hash)) sfx('pop',250); return orig(o); })(modal);

// ---------- dano: tela pisca vermelha, treme e faz som ----------
SFX.hurt=t=>{ sNoise(t,.16,{vol:.25,freq:300,q:.8,type:'lowpass'}); sTone(160,t,.22,{type:'sawtooth',vol:.06,slide:70}); };
let HURT_T=0;
function hurtFx(d){
  if(/^#(teste|qualidade|demo)/.test(location.hash)) return; const now=performance.now(); if(now-HURT_T<700) return; HURT_T=now;
  let o=document.getElementById('hurt'); if(!o){ o=document.createElement('div'); o.id='hurt'; document.body.appendChild(o); }
  o.classList.remove('on'); void o.offsetWidth; o.classList.add('on');
  const app=document.getElementById('app'); if(app){ app.classList.remove('shake'); void app.offsetWidth; app.classList.add('shake'); }
  sfx('hurt',300); if(navigator.vibrate) try{ navigator.vibrate(60); }catch(e){}
}
