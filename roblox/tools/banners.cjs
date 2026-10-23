// ===== Banners e ícone da experiência no Roblox =====
// Uso: node roblox/tools/banners.cjs
// Monta as artes em HTML com os rostos, as fontes e as cores do próprio jogo (src/faces.js e src/style.css)
// e fotografa com o Edge sem janela. Saem em roblox/marketing/: banner-1..4.png (1920×1080) e icone.png (512×512).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { loadGame } = require('./load-game.cjs');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'marketing');
const FONTS = fs.readFileSync(path.join(ROOT, '..', 'src', 'fonts-inline.css'), 'utf8');
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(p => fs.existsSync(p));

const g = loadGame();
const face = (p, size) => g.run('(p,s)=>faceSVG(p,s)')(Object.assign({ rel: 'amigo', alive: true }, p), size);
// rosto infectado do modo zumbi (o jogo esverdeia a pele do personagem quando S.scen.inf está ligado)
const zombie = (p, size) => g.run('(p,s)=>{ const old=S; S={me:p,scen:{inf:1},year:2030,people:[]}; try{ return faceSVG(p,s); } finally { S=old; } }')(Object.assign({ alive: true, happy: 20 }, p), size);

// pessoas fixas (genes e visual escolhidos à mão) para as artes ficarem sempre iguais
const P = {
  ana: { id: 12, gender: 'F', age: 26, bond: 85, genes: { hair: 'preto', eyes: 'castanhos', skin: 5, eyeShape: 1 }, look: { hair: 'black', top: 'blusa', brow: 'arqueada', beard: 'none', glasses: 'none', hat: 'none', ear: 'argola', pierce: 'none', makeup: 'batom', shirt: '#3FAF7E' } },
  leo: { id: 21, gender: 'M', age: 30, bond: 80, genes: { hair: 'castanho', eyes: 'verdes', skin: 1, eyeShape: 0 }, look: { hair: 'topete', top: 'polo', brow: 'grossa', beard: 'rala', glasses: 'none', hat: 'none', ear: 'none', pierce: 'none', makeup: 'none', shirt: '#4F6BD8' } },
  bia: { id: 14, gender: 'F', age: 7, bond: 90, genes: { hair: 'loiro', eyes: 'azuis', skin: 0, eyeShape: 2, freckles: true }, look: { hair: 'chiquinha', top: 'golaalta', brow: 'fina', beard: 'none', glasses: 'none', hat: 'laco', ear: 'none', pierce: 'none', makeup: 'none', shirt: '#EE7AB1' } },
  vo: { id: 13, gender: 'M', age: 72, bond: 80, genes: { hair: 'castanho', eyes: 'azuis', skin: 2, eyeShape: 0 }, look: { hair: 'lateral', top: 'social', brow: 'grossa', beard: 'cheia', glasses: 'quadrado', hat: 'none', ear: 'none', pierce: 'none', makeup: 'none', shirt: '#2E3A59' } },
  kai: { id: 17, gender: 'M', age: 16, bond: 80, genes: { hair: 'preto', eyes: 'castanho-escuros', skin: 4, eyeShape: 1 }, look: { hair: 'dreads', top: 'moletom', brow: 'grossa', beard: 'none', glasses: 'none', hat: 'none', ear: 'none', pierce: 'none', makeup: 'none', shirt: '#E8604F' } },
  yumi: { id: 19, gender: 'F', age: 34, bond: 85, genes: { hair: 'preto', eyes: 'pretos', skin: 1, eyeShape: 1 }, look: { hair: 'chanel', top: 'decoteV', brow: 'fina', beard: 'none', glasses: 'gatinho', hat: 'none', ear: 'perola', pierce: 'none', makeup: 'rosa', shirt: '#9B59D0' } },
  rafa: { id: 22, gender: 'M', age: 42, bond: 80, genes: { hair: 'ruivo', eyes: 'cor de mel', skin: 3, eyeShape: 2 }, look: { hair: 'curto', top: 'camiseta', brow: 'grossa', beard: 'cavanhaque', glasses: 'aviador', hat: 'bone', ear: 'none', pierce: 'none', makeup: 'none', shirt: '#33AFC4', hatColor: '#F2B43C' } },
  lu: { id: 25, gender: 'F', age: 64, bond: 85, genes: { hair: 'castanho-claro', eyes: 'acinzentados', skin: 2, eyeShape: 3 }, look: { hair: 'coque', top: 'vestido', brow: 'arqueada', beard: 'none', glasses: 'redondo', hat: 'none', ear: 'perola', pierce: 'none', makeup: 'none', shirt: '#F2B43C' } },
  bebe: { id: 30, gender: 'F', age: 1, bond: 90, genes: { hair: 'castanho-escuro', eyes: 'castanhos', skin: 3, eyeShape: 0 }, look: { hair: 'longo', top: 'blusa', brow: 'fina', beard: 'none', glasses: 'none', hat: 'none', ear: 'none', pierce: 'none', makeup: 'none', shirt: '#F2B43C' } },
};
// a mesma pessoa em várias idades (o rosto envelhece de verdade no jogo)
const life = [1, 7, 16, 28, 45, 80].map(age => ({ id: 42, gender: 'M', age, bond: age < 70 ? 88 : 70, genes: { hair: 'castanho-escuro', eyes: 'verdes', skin: 2, eyeShape: 0, freckles: true }, look: { hair: 'lateral', top: age < 18 ? 'camiseta' : 'polo', brow: 'grossa', beard: age >= 28 ? 'rala' : 'none', glasses: age >= 45 ? 'redondo' : 'none', hat: 'none', ear: 'none', pierce: 'none', makeup: 'none', shirt: '#4F6BD8' } }));

const STRIPE = 'linear-gradient(90deg,#F0567A 0 16.66%,#FF9F1C 0 33.33%,#FFD23F 0 50%,#22C3A6 0 66.66%,#2E86FF 0 83.33%,#9B5DE5 0)';
const BASE = `${FONTS}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden}
body{font-family:Nunito,sans-serif;color:#fff;background:linear-gradient(135deg,#2E6BFF 0%,#4F86FF 55%,#6C5CE7 100%);position:relative}
.stripe{position:absolute;left:0;right:0;bottom:0;height:18px;background:${STRIPE}}
.logo{font-family:Fredoka,sans-serif;font-weight:600;line-height:1;text-shadow:0 8px 30px rgba(0,0,0,.22)}
.logo em{font-style:normal;color:#FFD23F}
.face{display:block;border-radius:50%;box-shadow:0 0 0 10px rgba(255,255,255,.95),0 18px 40px rgba(0,0,0,.25)}
.bubble{position:absolute;border-radius:50%;background:rgba(255,255,255,.08)}
.tag{font-size:44px;font-weight:800;opacity:.95}
.pill{display:inline-block;background:#FFD23F;color:#2A1C00;font-family:Fredoka;font-weight:600;border-radius:999px;padding:16px 40px;font-size:46px;box-shadow:0 10px 30px rgba(255,159,28,.45)}
.card{background:#fff;color:#161A2C;border-radius:40px;box-shadow:0 30px 80px rgba(10,14,30,.35);overflow:hidden}
`;
const bubbles = `<div class="bubble" style="width:700px;height:700px;left:-220px;top:-260px"></div><div class="bubble" style="width:520px;height:520px;right:-160px;bottom:-200px"></div><div class="bubble" style="width:260px;height:260px;right:520px;top:-90px"></div>`;
const f = (p, s, extra = '') => `<div style="${extra}">${face(p, s).replace('class="face"', 'class="face"')}</div>`;

const pages = {
  // 1: chamada principal — logo, slogan e uma multidão de rostos
  'banner-1': `<style>${BASE}</style>${bubbles}
    <div style="position:absolute;left:120px;top:190px;width:1000px">
      <div class="logo" style="font-size:250px">New<em>Life</em></div>
      <div class="tag" style="margin-top:34px;font-size:58px">Viva mil vidas.</div>
      <div class="tag" style="margin-top:14px;font-size:34px;font-weight:700;opacity:.88">Nasça, cresça, estude, ame, erre feio… e comece de novo.</div>
      <div style="margin-top:56px"><span class="pill">🎂 JOGUE AGORA</span></div>
    </div>
    <div style="position:absolute;right:90px;top:120px;width:800px;height:840px">
      ${f(P.ana, 300, 'position:absolute;left:250px;top:250px;z-index:5')}
      ${f(P.leo, 210, 'position:absolute;left:30px;top:40px;transform:rotate(-8deg)')}
      ${f(P.vo, 220, 'position:absolute;left:560px;top:20px;transform:rotate(7deg)')}
      ${f(P.bia, 200, 'position:absolute;left:0;top:450px;transform:rotate(-5deg)')}
      ${f(P.kai, 190, 'position:absolute;left:600px;top:420px;transform:rotate(6deg)')}
      ${f(P.yumi, 170, 'position:absolute;left:240px;top:640px;transform:rotate(-3deg)')}
      ${f(P.rafa, 170, 'position:absolute;left:470px;top:650px;transform:rotate(4deg)')}
    </div><div class="stripe"></div>`,
  // 2: a mesma vida do berço à velhice
  'banner-2': `<style>${BASE}</style>${bubbles}
    <div style="position:absolute;left:0;right:0;top:110px;text-align:center">
      <div class="logo" style="font-size:120px">Do berço à <em>velhice</em></div>
      <div class="tag" style="margin-top:22px">Seu personagem cresce, muda de visual e envelhece de verdade.</div>
    </div>
    <div style="position:absolute;left:0;right:0;top:500px;display:flex;justify-content:center;align-items:flex-end;gap:46px">
      ${life.map((p, i) => `<div style="text-align:center">${face(p, 200 + i * 16)}<div style="font-family:Fredoka;font-weight:600;font-size:46px;margin-top:30px">${p.age} ${p.age === 1 ? 'ano' : 'anos'}</div></div>`).join('')}
    </div>
    <div style="position:absolute;left:0;right:0;bottom:90px;text-align:center"><span class="pill">🎂 Um ano a cada toque</span></div><div class="stripe"></div>`,
  // 3: cada escolha muda tudo — um evento do jogo
  'banner-3': `<style>${BASE}</style>${bubbles}
    <div style="position:absolute;left:120px;top:250px;width:760px">
      <div class="logo" style="font-size:120px">Cada escolha <em>muda tudo</em></div>
      <div class="tag" style="margin-top:30px;font-size:40px;line-height:1.35">Centenas de eventos com escolhas: escola, faculdade, amizades, namoro, casamento, emprego e família.</div>
    </div>
    <div class="card" style="position:absolute;right:150px;top:150px;width:820px;border-top:16px solid transparent;background:linear-gradient(#fff,#fff) padding-box,${STRIPE} border-box">
      <div style="padding:56px 60px 60px">
        <div style="display:grid;place-items:center;margin-bottom:22px"><div style="width:150px;height:150px;border-radius:44px;background:#E8EAF2;display:grid;place-items:center;font-size:90px">💌</div></div>
        <span style="display:inline-block;background:#E8EAF2;color:#2E6BFF;border-radius:99px;padding:8px 22px;font-weight:900;font-size:24px;letter-spacing:.08em">CORAÇÃO</span>
        <div style="font-family:Fredoka;font-weight:600;font-size:64px;margin:20px 0 14px">Primeiro encontro</div>
        <div style="font-size:34px;line-height:1.4;color:#161A2C">Ana te chamou para tomar um sorvete depois da aula. O que você faz?</div>
        <div style="display:flex;flex-direction:column;gap:18px;margin-top:36px">
          <div style="background:linear-gradient(135deg,#2E6BFF,#5B8CFF);color:#fff;border-radius:22px;padding:24px;text-align:center;font-weight:800;font-size:34px">Aceitar na hora</div>
          <div style="background:#E8EAF2;border:2px solid #DDE0EA;border-radius:22px;padding:24px;text-align:center;font-weight:800;font-size:34px">Inventar uma desculpa</div>
          <div style="background:#E8EAF2;border:2px solid #DDE0EA;border-radius:22px;padding:24px;text-align:center;font-weight:800;font-size:34px">Levar um amigo junto</div>
        </div>
      </div>
    </div>
    ${f(P.ana, 230, 'position:absolute;right:870px;top:640px;transform:rotate(-6deg)')}<div class="stripe"></div>`,
  // 5: modos fictícios (ainda não estão no Roblox: o banner avisa que chegam em breve)
  'banner-5': `<style>${BASE}
    body{background:linear-gradient(135deg,#1B1F3A 0%,#3A1F5C 55%,#6C2B6F 100%)}
    .mode{width:330px;height:330px;border-radius:44px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;box-shadow:0 24px 60px rgba(0,0,0,.4);font-family:Fredoka;font-weight:600;font-size:40px}
    .mode b{font-size:130px;line-height:1}
  </style>${bubbles}
    <div style="position:absolute;left:0;right:0;top:80px;text-align:center">
      <span style="display:inline-block;background:#F0567A;color:#fff;font-family:Fredoka;font-weight:600;font-size:40px;letter-spacing:.12em;border-radius:999px;padding:12px 34px;box-shadow:0 10px 30px rgba(240,86,122,.5)">EM BREVE</span>
      <div class="logo" style="font-size:120px;margin-top:26px">Modos <em>fictícios</em></div>
      <div class="tag" style="margin-top:16px">Sobreviva a zumbis, fique preso numa ilha, renasça em outro mundo…</div>
    </div>
    <div style="position:absolute;left:0;right:0;top:560px;display:flex;justify-content:center;gap:36px">
      <div class="mode" style="background:linear-gradient(145deg,#4C8A3F,#1F4A2A)">${zombie({ ...P.kai, id: 50, age: 24 }, 190)}<span>Zumbis</span></div>
      <div class="mode" style="background:linear-gradient(145deg,#2EC4B6,#118AB2)"><b>🏝️</b><span>Ilha deserta</span></div>
      <div class="mode" style="background:linear-gradient(145deg,#9B5DE5,#5A189A)"><b>🧙</b><span>Isekai</span></div>
      <div class="mode" style="background:linear-gradient(145deg,#F15BB5,#B5179E)"><b>🦸</b><span>Super-heróis</span></div>
      <div class="mode" style="background:linear-gradient(145deg,#FF7B00,#C1121F)"><b>🚀</b><span>Marte</span></div>
    </div><div class="stripe"></div>`,
  // 4: família e genética
  'banner-4': `<style>${BASE}</style>${bubbles}
    <div style="position:absolute;left:0;right:0;top:100px;text-align:center">
      <div class="logo" style="font-size:120px">Família de <em>verdade</em></div>
      <div class="tag" style="margin-top:22px">Filhos herdam cabelo, olhos, pele e talentos dos pais. Monte sua história por gerações.</div>
    </div>
    <div style="position:absolute;left:0;right:0;top:420px;display:flex;justify-content:center;gap:120px">
      ${f(P.leo, 250)}${f(P.ana, 250)}
    </div>
    <div style="position:absolute;left:880px;top:560px;font-size:120px">❤️</div>
    <div style="position:absolute;left:0;right:0;top:760px;display:flex;justify-content:center;gap:70px">
      ${f({ ...P.bebe, id: 31, genes: { hair: 'preto', eyes: 'verdes', skin: 3, eyeShape: 1 } }, 170)}
      ${f({ ...P.bia, id: 32, genes: { hair: 'castanho', eyes: 'castanhos', skin: 3, eyeShape: 1 }, age: 9, look: { ...P.bia.look, hair: 'rabo', hat: 'none' } }, 170)}
      ${f({ ...P.kai, id: 33, genes: { hair: 'castanho', eyes: 'verdes', skin: 3, eyeShape: 1 }, age: 15, look: { ...P.kai.look, hair: 'topete' } }, 170)}
    </div><div class="stripe"></div>`,
};

const ICON = `<style>${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:512px;height:512px;overflow:hidden}
body{background:linear-gradient(135deg,#2E6BFF 0%,#4F86FF 55%,#6C5CE7 100%);position:relative;font-family:Fredoka}
.stripe{position:absolute;left:0;right:0;bottom:0;height:22px;background:${STRIPE}}
.face{display:block;border-radius:50%;box-shadow:0 0 0 10px #fff,0 14px 30px rgba(0,0,0,.25)}
</style>
<div style="position:absolute;left:-90px;top:-110px;width:330px;height:330px;border-radius:50%;background:rgba(255,255,255,.09)"></div>
<div style="position:absolute;left:96px;top:44px">${face(P.ana, 320)}</div>
<div style="position:absolute;right:26px;top:40px;width:120px;height:120px;border-radius:50%;background:linear-gradient(145deg,#FFE27A,#FFC83D 45%,#FF9F1C);display:grid;place-items:center;font-size:66px;box-shadow:0 0 0 8px #fff,0 10px 24px rgba(255,159,28,.5)">🎂</div>
<div style="position:absolute;left:0;right:0;bottom:44px;text-align:center;font-weight:600;font-size:96px;color:#fff;line-height:1;text-shadow:0 6px 18px rgba(0,0,0,.25)">New<span style="color:#FFD23F">Life</span></div>
<div class="stripe"></div>`;

function shoot(name, html, w, h) {
  const file = path.join(OUT, name + '.html');
  fs.writeFileSync(file, '<!doctype html><meta charset="utf-8">' + html);
  const png = path.join(OUT, name + '.png');
  if (fs.existsSync(png)) fs.unlinkSync(png);
  // perfil próprio por foto: o Edge não reaproveita uma janela aberta e espera terminar
  const prof = fs.mkdtempSync(path.join(require('os').tmpdir(), 'nl-banner-'));
  execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${prof}`,
    `--window-size=${w},${h}`, '--virtual-time-budget=4000', `--screenshot=${png}`, 'file:///' + file.split(path.sep).join('/')], { stdio: 'ignore' });
  const t0 = Date.now();
  while (!fs.existsSync(png) && Date.now() - t0 < 30000) execFileSync(process.execPath, ['-e', 'setTimeout(()=>{},300)']);
  fs.unlinkSync(file);
  try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {} // o Edge às vezes ainda segura a pasta
  console.log(path.relative(process.cwd(), png), fs.existsSync(png) ? 'ok' : 'FALHOU');
}

// imagens dos gamepasses (512×512)
const PASS = (emoji, title, from, to) => `<style>${FONTS}
*{margin:0;padding:0;box-sizing:border-box}html,body{width:512px;height:512px;overflow:hidden}
body{background:linear-gradient(145deg,${from},${to});font-family:Fredoka;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;position:relative}
.stripe{position:absolute;left:0;right:0;bottom:0;height:22px;background:${STRIPE}}</style>
<div style="position:absolute;left:-80px;top:-100px;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,.1)"></div>
<div style="font-size:230px;line-height:1;filter:drop-shadow(0 12px 24px rgba(0,0,0,.3))">${emoji}</div>
<div style="font-weight:600;font-size:60px;text-shadow:0 4px 14px rgba(0,0,0,.3)">${title}</div><div class="stripe"></div>`;
const PASSES = { 'pass-deus': PASS('⚡', 'Modo Deus', '#7B2CBF', '#240046'), 'pass-tempo': PASS('⏳', 'Máquina do tempo', '#2E6BFF', '#6C5CE7'), 'pass-doacao': PASS('💖', 'Apoie o jogo', '#F0567A', '#9B5DE5') };

fs.mkdirSync(OUT, { recursive: true });
for (const [name, html] of Object.entries(pages)) shoot(name, html, 1920, 1080);
shoot('icone', ICON, 512, 512);
for (const [name, html] of Object.entries(PASSES)) shoot(name, html, 512, 512);
