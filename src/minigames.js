// ===== Minijogos: fuga da prisão, invasão de casa, cofre =====
const MG={on:null,key:null};
function mgOpen(html,keyfn){ $('#game').innerHTML=html; $('#gameWrap').hidden=false; MG.key=keyfn||null; }
function mgClose(){ $('#gameWrap').hidden=true; MG.key=null; $('#game').innerHTML=''; }
document.addEventListener('keydown',e=>{ if(!MG.key||$('#gameWrap').hidden) return; const k={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r',w:'u',s:'d',a:'l',d:'r',W:'u',S:'d',A:'l',D:'r'}[e.key]||e.key; if(MG.key(k)!==false) e.preventDefault(); });
const DIRS={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
const pad=()=>`<div class="pad"><span></span><button class="btn alt" data-mv="u" aria-label="Cima">▲</button><span></span><button class="btn alt" data-mv="l" aria-label="Esquerda">◀</button><button class="btn alt" data-mv="d" aria-label="Baixo">▼</button><button class="btn alt" data-mv="r" aria-label="Direita">▶</button></div>`;
function mgFinish(fn){ mgClose(); let r; try{ r=fn(); }catch(e){ showErr(e); } if(r){ log(r); modal({t:'Resultado',x:r}); } after(); }

// ---------- fuga da prisão: labirinto com guardas ----------
function mgEscape(){
  const m=S.me, CW=6, CH=8, W=CW*2+1, H=CH*2+1;
  const g=[...Array(H)].map(()=>Array(W).fill(1));
  const seen=new Set(), st=[[0,CH-1]]; seen.add('0,'+(CH-1)); g[2*(CH-1)+1][1]=0;
  while(st.length){ const [cx,cy]=st[st.length-1]; const nb=R.shuffle([[1,0],[-1,0],[0,1],[0,-1]]).map(([dx,dy])=>[cx+dx,cy+dy,dx,dy]).filter(([x,y])=>x>=0&&y>=0&&x<CW&&y<CH&&!seen.has(x+','+y));
    if(!nb.length){ st.pop(); continue; } const [nx,ny,dx,dy]=nb[0]; seen.add(nx+','+ny); g[2*cy+1+dy][2*cx+1+dx]=0; g[2*ny+1][2*nx+1]=0; st.push([nx,ny]); }
  for(let i=0;i<14;i++){ const x=R.int(1,W-2),y=R.int(1,H-2); if(g[y][x]===1&&((x%2===0&&y%2===1)||(x%2===1&&y%2===0))) g[y][x]=0; }
  const ex=2*R.int(2,CW-1)+1; g[0][ex]=0;
  const s={px:1,py:H-2,ex,ey:0,over:false,moves:0,msg:'Chegue à porta sem ser visto. Os guardas perseguem quem eles enxergam.'};
  const floor=[]; for(let y=1;y<H-1;y++) for(let x=1;x<W-1;x++) if(!g[y][x]&&Math.abs(x-s.px)+Math.abs(y-s.py)>8) floor.push([x,y]);
  s.guards=R.shuffle(floor).slice(0,m.prison&&m.prison.juv?2:3).map(([x,y])=>({x,y,lx:x,ly:y}));
  const open=(x,y)=>y>=0&&y<H&&x>=0&&x<W&&!g[y][x];
  const sees=(gd)=>{ if(gd.x===s.px){ const [a,b]=[Math.min(gd.y,s.py),Math.max(gd.y,s.py)]; if(b-a>5) return false; for(let y=a;y<=b;y++) if(g[y][gd.x]) return false; return true; } if(gd.y===s.py){ const [a,b]=[Math.min(gd.x,s.px),Math.max(gd.x,s.px)]; if(b-a>5) return false; for(let x=a;x<=b;x++) if(g[gd.y][x]) return false; return true; } return Math.abs(gd.x-s.px)+Math.abs(gd.y-s.py)<=1; };
  const stepToward=(gd)=>{ const q=[[s.px,s.py]],prev={}; prev[s.px+','+s.py]=null; while(q.length){ const [x,y]=q.shift(); if(x===gd.x&&y===gd.y) break; for(const [dx,dy] of Object.values(DIRS)){ const nx=x+dx,ny=y+dy,k=nx+','+ny; if(open(nx,ny)&&!(k in prev)){ prev[k]=[x,y]; q.push([nx,ny]); } } } const p=prev[gd.x+','+gd.y]; if(p){ gd.x=p[0]; gd.y=p[1]; } };
  const wander=(gd)=>{ const opts=Object.values(DIRS).map(([dx,dy])=>[gd.x+dx,gd.y+dy]).filter(([x,y])=>open(x,y)&&y>0&&!(x===gd.lx&&y===gd.ly)); const [nx,ny]=opts.length?R.pick(opts):[gd.lx,gd.ly]; gd.lx=gd.x; gd.ly=gd.y; gd.x=nx; gd.y=ny; };
  const draw=()=>{
    let cells='';
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){ let c=g[y][x]?'w':'f', t=''; if(x===s.ex&&y===s.ey){ c='x'; t='🚪'; } const gd=s.guards.find(q=>q.x===x&&q.y===y); if(gd){ t=gd.chase?'🚨':'👮'; c+=' gd'; } if(x===s.px&&y===s.py) t='🏃'; cells+=`<i class="${c}">${t}</i>`; }
    mgOpen(`<div class="kick">Fuga</div><h2>Fugir da prisão</h2><p class="mgmsg">${esc(s.msg)}</p><div class="maze" style="grid-template-columns:repeat(${W},1fr)">${cells}</div>${s.over?`<div class="choices"><button class="btn sun" id="mgOk">Continuar</button></div>`:pad()+`<div class="choices"><button class="btn alt" id="mgQuit">Desistir da fuga</button></div>`}`,k=>{ if(DIRS[k]) move(k); else return false; });
    $('#game').querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>move(b.dataset.mv));
    if($('#mgQuit')) $('#mgQuit').onclick=()=>mgFinish(()=>'Desisti da fuga e voltei para a cela antes que alguém percebesse.');
    if($('#mgOk')) $('#mgOk').onclick=()=>mgFinish(s.result);
  };
  const end=(win)=>{ s.over=true; s.msg=win?'Você passou pela porta e sumiu na noite!':'Um guarda te agarrou pelo uniforme.';
    s.result=win?()=>{ const pr=m.prison; m.prison=null; cnt('escapes'); m.c.fugitive=1; st('happy',20); return pr&&pr.juv?'Fugi da unidade de internação! Agora sou procurad'+oa()+'.':'Fugi da prisão! Agora sou procurad'+oa()+' pela polícia.'; }
               :()=>{ const pr=m.prison; if(!pr) return ''; pr.left+=R.int(1,3); pr.total+=2; pr.behav=clamp(pr.behav-30); st('health',-R.int(0,10)); return 'Fui pego tentando fugir. Minha pena aumentou e passei semanas na solitária.'; };
    draw(); };
  const move=(k)=>{ if(s.over) return; const [dx,dy]=DIRS[k]; const nx=s.px+dx, ny=s.py+dy; if(!open(nx,ny)) return; s.px=nx; s.py=ny; s.moves++;
    if(s.px===s.ex&&s.py===s.ey) return end(true);
    for(const gd of s.guards){ if(gd.x===s.px&&gd.y===s.py) return end(false); }
    for(const gd of s.guards){ gd.chase=sees(gd)||(gd.chase&&R.chance(.6)); if(gd.chase) stepToward(gd); else wander(gd); if(gd.x===s.px&&gd.y===s.py) return end(false); }
    s.msg=s.guards.some(q=>q.chase)?'Um guarda te viu! Corra!':'Silêncio no corredor...'; draw(); };
  draw();
}

// ---------- invasão de casa: cômodos no escuro ----------
const ROOMS=['Sala','Cozinha','Quarto','Banheiro','Escritório','Closet','Garagem','Lavanderia','Quarto de hóspedes','Despensa','Sala de jantar','Suíte'];
const LOOT=[['Notebook',2500],['Joias',6000],['Relógio',3500],['Dinheiro na gaveta',1500],['Videogame',2200],['Perfume importado',600],['Cofre pequeno',9000],['Bolsa de grife',4000],['Tênis caro',900],['Celular',1800],['Moedas antigas',3000],['Câmera fotográfica',2800],['Bicicleta',1500],['Garrafa de vinho raro',1200]];
function mgBurglary(){
  const m=S.me, N=4, rich=R.pick([.6,1,1,1.6,3]);
  const map=[...Array(N)].map((_,y)=>[...Array(N)].map((_,x)=>{ const r=R.f(); return {n:R.pick(ROOMS),seen:false,looted:false,loot:r<.5?(()=>{ const l=R.pick(LOOT); return {n:l[0],v:Math.round(l[1]*rich*(.6+R.f()*.8))}; })():null,haz:r>=.5&&r<.68?R.pick(['cachorro','alarme','vigia']):null}; }));
  const s={x:R.int(1,2),y:N-1,noise:0,bag:[],over:false,awake:false,msg:'Entrei pela porta dos fundos. Cada passo faz barulho.'};
  s.ox=R.int(0,N-1); s.oy=0; map[s.y][s.x].seen=true; map[s.y][s.x].haz=null; map[s.y][s.x].n='Entrada';
  const total=()=>s.bag.reduce((a,b)=>a+b.v,0);
  const draw=()=>{
    let cells='';
    for(let y=0;y<N;y++) for(let x=0;x<N;x++){ const c=map[y][x], here=x===s.x&&y===s.y, adj=Math.abs(x-s.x)+Math.abs(y-s.y)===1, ow=s.awake&&x===s.ox&&y===s.oy;
      cells+=`<button class="room ${c.seen?'seen':''} ${here?'here':''} ${adj&&!s.over?'adj':''}" data-x="${x}" data-y="${y}" ${adj&&!s.over?'':'disabled'}>${ow?'<b>🧔</b>':here?'<b>🦹</b>':''}<span>${c.seen?esc(c.n):'?'}</span>${c.seen&&c.loot&&!c.looted?'<em>💰</em>':''}</button>`; }
    const nz=Math.min(100,Math.round(s.noise));
    mgOpen(`<div class="kick">Crime</div><h2>Invadir uma casa</h2><p class="mgmsg">${esc(s.msg)}</p><div class="mini"><b>Barulho</b><div class="bar"><i style="width:${nz}%;background:${grad(100-nz)}"></i></div><span>${nz}%</span></div><div class="house">${cells}</div><p class="mgmsg">Na mochila: ${s.bag.length?esc(s.bag.map(b=>b.n).join(', ')):'nada'} · ${fmt(total())}</p>
      <div class="choices">${s.over?`<button class="btn sun" id="mgOk">Continuar</button>`:`${map[s.y][s.x].loot&&!map[s.y][s.x].looted?`<button class="btn sun" id="mgTake">Pegar: ${esc(map[s.y][s.x].loot.n)}</button>`:''}${s.y===N-1?`<button class="btn" id="mgOut">Sair pela porta</button>`:`<button class="btn" id="mgWin">Pular a janela e fugir</button>`}`}</div>`);
    $('#game').querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>go(+b.dataset.x,+b.dataset.y));
    const on=(id,f)=>{ const b=$('#'+id); if(b) b.onclick=f; };
    on('mgTake',take); on('mgOut',()=>leave(true)); on('mgWin',()=>leave(false)); on('mgOk',()=>mgFinish(s.result));
  };
  const caught=(why)=>{ s.over=true; s.msg=why; s.result=()=>{ cnt('crimes'); m.rec.crimes++; m.karma=clamp(m.karma-10); arrest('invasão de domicílio',1,5); return why+' A polícia chegou.'; }; draw(); };
  const noise=(n)=>{ s.noise+=n; if(s.noise>=60&&!s.awake){ s.awake=true; s.msg+=' O morador acordou!'; } if(s.noise>=100) return caught('O barulho chamou a vizinhança inteira.'),true; return false; };
  const ownerStep=()=>{ if(!s.awake) return false; const dx=Math.sign(s.x-s.ox), dy=Math.sign(s.y-s.oy); if(dx&&(!dy||R.chance(.5))) s.ox+=dx; else s.oy+=dy; if(s.ox===s.x&&s.oy===s.y){ caught('O morador me encurralou com um taco de beisebol.'); return true; } return false; };
  const go=(x,y)=>{ if(s.over) return; s.x=x; s.y=y; const c=map[y][x]; const first=!c.seen; c.seen=true; s.msg=`Entrei: ${c.n.toLowerCase()}.`;
    if(noise(R.int(5,11)*(m.fight>50?.8:1))) return;
    if(first&&c.haz==='cachorro'){ s.msg='Um cachorro acordou e começou a latir!'; st('health',-R.int(0,6)); if(noise(35)) return; }
    if(first&&c.haz==='alarme'){ s.msg='Pisei num sensor de alarme!'; if(noise(40)) return; }
    if(first&&c.haz==='vigia'&&R.chance(.5)) return caught('Havia uma câmera com alarme silencioso.');
    if(ownerStep()) return; draw(); };
  const take=()=>{ const c=map[s.y][s.x]; if(!c.loot||c.looted) return; c.looted=true; s.bag.push(c.loot); s.msg=`Peguei: ${c.loot.n.toLowerCase()}.`; if(noise(R.int(4,10))) return; if(ownerStep()) return; draw(); };
  const leave=(door)=>{ const v=total();
    if(!door&&!R.chance(.75)){ st('health',-R.int(8,18)); const half=Math.round(v/2); s.over=true; s.msg='Caí da janela e machuquei a perna, mas fugi.'; s.result=()=>{ m.money+=half; cnt('crimes'); m.rec.crimes++; m.karma=clamp(m.karma-8); return `Fugi mancando com metade do que peguei: ${fmt(half)}.`; }; return draw(); }
    s.over=true; s.msg=v?'Saí sem ninguém ver.':'Saí de mãos vazias.'; s.result=()=>{ m.money+=v; cnt('crimes'); m.rec.crimes++; m.karma=clamp(m.karma-(v?8:2)); st('happy',v?5:0); return v?`Invadi a casa e saí com ${s.bag.map(b=>b.n.toLowerCase()).join(', ')}: ${fmt(v)}.`:'Invadi a casa, mas não levei nada.'; }; draw(); };
  draw();
}

// ---------- cofre: descobrir a senha ----------
function mgVault(c){
  const m=S.me, len=4, tries=c.id==='banco'?7:8;
  const code=R.shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,len);
  const s={cur:[],hist:[],over:false,msg:`Descubra a senha de ${len} dígitos diferentes. ● = dígito certo no lugar certo. ○ = dígito certo no lugar errado.`};
  const draw=()=>{
    const left=tries-s.hist.length, alarm=Math.round(s.hist.length/tries*100);
    mgOpen(`<div class="kick">Crime</div><h2>${esc(c.n)}</h2><p class="mgmsg">${esc(s.msg)}</p><div class="mini"><b>Alarme</b><div class="bar"><i style="width:${alarm}%;background:${grad(100-alarm)}"></i></div><span>${left} tent.</span></div>
      <div class="vault"><div class="code">${[0,1,2,3].map(i=>`<i>${s.cur[i]??'·'}</i>`).join('')}</div>${s.hist.map(h=>`<div class="hist"><span>${h.g.join(' ')}</span><span>${'●'.repeat(h.a)}${'○'.repeat(h.b)}${!h.a&&!h.b?'—':''}</span></div>`).join('')}</div>
      ${s.over?`<div class="choices"><button class="btn sun" id="mgOk">Continuar</button></div>`:`<div class="keys">${[1,2,3,4,5,6,7,8,9,'⌫',0,'✓'].map(k=>`<button class="btn alt" data-k="${k}" ${typeof k==='number'&&s.cur.includes(k)?'disabled':''}>${k}</button>`).join('')}</div><div class="choices"><button class="btn alt" id="mgQuit">Abortar e fugir</button></div>`}`,k=>{ if(/^[0-9]$/.test(k)) press(+k); else if(k==='Backspace') press('⌫'); else if(k==='Enter') press('✓'); else return false; });
    $('#game').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{ const k=b.dataset.k; press(/^[0-9]$/.test(k)?+k:k); });
    const on=(id,f)=>{ const b=$('#'+id); if(b) b.onclick=f; };
    on('mgOk',()=>mgFinish(s.result));
    on('mgQuit',()=>mgFinish(()=>{ cnt('crimes'); m.karma=clamp(m.karma-4); if(R.chance(.35)){ arrest('tentativa de '+c.n.toLowerCase(),c.jail[0],Math.max(c.jail[0],Math.round(c.jail[1]/2))); return 'Abortei, mas as câmeras me pegaram.'; } return 'Abortei o assalto e fugi a tempo.'; }));
  };
  const press=(k)=>{ if(s.over) return;
    if(k==='⌫'){ s.cur.pop(); return draw(); }
    if(k==='✓'){ if(s.cur.length<len) return; const g=s.cur.slice(); const a=g.filter((d,i)=>code[i]===d).length; const b=g.filter((d,i)=>code[i]!==d&&code.includes(d)).length; s.hist.push({g,a,b}); s.cur=[];
      if(a===len){ s.over=true; const v=R.int(...c.cash); s.msg='O cofre abriu!'; s.result=()=>{ m.money+=v; cnt('crimes'); m.rec.crimes++; m.karma=clamp(m.karma-c.k); st('happy',10); if(R.chance(.25)){ arrest(c.n.toLowerCase(),c.jail[0],c.jail[1]); return `Abri o cofre e levei ${fmt(v)}, mas fui identificad${oa()} pelas câmeras dias depois.`; } return `Abri o cofre e fugi com ${fmt(v)}!`; }; }
      else if(s.hist.length>=tries){ s.over=true; s.msg=`O alarme disparou. A senha era ${code.join('')}.`; s.result=()=>{ cnt('crimes'); m.rec.crimes++; m.karma=clamp(m.karma-c.k); arrest(c.n.toLowerCase(),c.jail[0],c.jail[1]); return 'O alarme tocou e a polícia cercou o lugar.'; }; }
      else s.msg=a+b?'Estou chegando perto...':'Nenhum desses números está na senha.';
      return draw(); }
    if(typeof k==='number'&&s.cur.length<len&&!s.cur.includes(k)){ s.cur.push(k); draw(); } };
  draw();
}
