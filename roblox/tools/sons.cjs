// ===== Sons da versão Roblox =====
// Uso: node roblox/tools/sons.cjs
// O jogo do navegador sintetiza tudo na hora com Web Audio (src/sound.js). O Roblox só toca arquivos,
// então este script roda o MESMO código de src/sound.js num "Web Audio" mínimo feito aqui e grava:
//   roblox/audio/efeitos.ogg  todos os efeitos em sequência (o jogo toca cada trecho pelo PlaybackRegion)
//   roblox/audio/musica.ogg   a música ambiente num loop sem emenda
// e atualiza os trechos em roblox/src/shared/NewLife/Sons.luau (os IDs do Roblox ficam como estão).
// Precisa do ffmpeg para converter para .ogg.
const fs = require('fs'), path = require('path'), vm = require('vm'), { execFileSync } = require('child_process');

const RATE = 44100;
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'audio');
const LUA = path.join(ROOT, 'src', 'shared', 'NewLife', 'Sons.luau');

// ---------- Web Audio mínimo, processado amostra por amostra ----------
class Param {
  constructor(v) { this.value = v; this.ev = []; }
  setValueAtTime(v, t) { this.ev.push({ k: 'set', v, t }); this.sort(); }
  linearRampToValueAtTime(v, t) { this.ev.push({ k: 'lin', v, t }); this.sort(); }
  exponentialRampToValueAtTime(v, t) { this.ev.push({ k: 'exp', v, t }); this.sort(); }
  setTargetAtTime(v, t, tc) { this.ev.push({ k: 'target', v, t, tc }); this.sort(); }
  cancelScheduledValues(t) { this.ev = this.ev.filter(e => e.t < t); }
  sort() { this.ev.sort((a, b) => a.t - b.t); this.cache = null; }
  at(t) {
    if (!this.ev.length) return this.value;
    let v = this.value, tv = 0, i = 0;
    for (; i < this.ev.length; i++) {
      const e = this.ev[i];
      if (e.t > t) {
        if (e.k === 'lin') return v + (e.v - v) * (t - tv) / (e.t - tv);
        if (e.k === 'exp') return v === 0 || v * e.v <= 0 ? v : v * Math.pow(e.v / v, (t - tv) / (e.t - tv));
        return v;
      }
      if (e.k === 'target') {
        const next = this.ev[i + 1], end = next && next.t <= t ? next.t : t;
        const vv = e.v + (v - e.v) * Math.exp(-(end - e.t) / e.tc);
        if (end === t) return vv;
        v = vv; tv = end; continue;
      }
      v = e.v; tv = e.t;
    }
    return v;
  }
}
class Node {
  constructor(ctx) { this.ctx = ctx; this.ins = []; this.memo = -1; this.val = 0; }
  connect(n) { (n.input || n).ins.push(this); return n; }
  pull(i) { let s = 0; for (const n of this.ins) s += n.out(i); return s; }
  out(i) { if (this.memo !== i) { this.memo = i; this.val = this.calc(i); } return this.val; }
}
class Gain extends Node { constructor(c) { super(c); this.gain = new Param(1); } calc(i) { const x = this.pull(i); return x === 0 ? 0 : x * this.gain.at(i / RATE); } }
class Dest extends Node { calc(i) { return this.pull(i); } }
// atraso: lê o passado, então não puxa a entrada na hora (é isso que deixa o eco realimentado funcionar)
class Delay extends Node {
  constructor(c) { super(c); this.delayTime = new Param(0); this.hist = new Float64Array(0); c.delays.push(this); }
  calc(i) { const d = Math.round(this.delayTime.value * RATE); return i - d >= 0 ? (this.hist[i - d] || 0) : 0; }
  tick(i) { if (this.hist.length <= i) { const h = new Float64Array(Math.max(i + 1, this.hist.length * 2 || RATE)); h.set(this.hist); this.hist = h; } this.hist[i] = this.pull(i); }
}
// filtro biquad (receitas do RBJ, como o Web Audio)
class Biquad extends Node {
  constructor(c) { super(c); this.type = 'lowpass'; this.frequency = new Param(350); this.Q = new Param(1); this.z = [0, 0, 0, 0]; this.k = null; }
  coef() {
    const w = 2 * Math.PI * this.frequency.value / RATE, cs = Math.cos(w), sn = Math.sin(w);
    let b0, b1, b2, a0, a1, a2;
    if (this.type === 'lowpass') {
      const q = Math.pow(10, this.Q.value / 20), al = sn / (2 * q);
      b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = (1 - cs) / 2; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al;
    } else {
      const al = sn / (2 * Math.max(this.Q.value, 1e-4));
      b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al;
    }
    this.k = [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
  }
  calc(i) {
    if (!this.k) this.coef();
    const [b0, b1, b2, a1, a2] = this.k, z = this.z, x = this.pull(i);
    const y = b0 * x + b1 * z[0] + b2 * z[1] - a1 * z[2] - a2 * z[3];
    z[1] = z[0]; z[0] = x; z[3] = z[2]; z[2] = y; return y;
  }
}
// osciladores com correção polyBLEP nas ondas quadrada e dente-de-serra (menos chiado, como no navegador)
const blep = (t, dt) => t < dt ? (t /= dt, t + t - t * t - 1) : t > 1 - dt ? (t = (t - 1) / dt, t * t + t + t + 1) : 0;
class Osc extends Node {
  constructor(c) { super(c); this.type = 'sine'; this.frequency = new Param(440); this.ph = 0; this.t0 = Infinity; this.t1 = Infinity; this.tri = 0; }
  start(t) { this.t0 = t; } stop(t) { this.t1 = t; }
  calc(i) {
    const t = i / RATE; if (t < this.t0 || t >= this.t1) return 0;
    const f = this.frequency.at(t), dt = f / RATE, p = this.ph; this.ph = (p + dt) % 1;
    switch (this.type) {
      case 'square': return (p < .5 ? 1 : -1) + blep(p, dt) - blep((p + .5) % 1, dt);
      case 'sawtooth': return 2 * p - 1 - blep(p, dt);
      case 'triangle': return 1 - 4 * Math.abs(((p + .25) % 1) - .5);
      default: return Math.sin(2 * Math.PI * p);
    }
  }
}
class Src extends Node {
  constructor(c) { super(c); this.buffer = null; this.t0 = Infinity; this.t1 = Infinity; }
  start(t) { this.t0 = t; } stop(t) { this.t1 = t; }
  calc(i) { const t = i / RATE; if (t < this.t0 || t >= this.t1) return 0; const d = this.buffer.data, k = Math.floor((t - this.t0) * RATE); return k < d.length ? d[k] : 0; }
}
class Ctx {
  constructor(rng) { this.sampleRate = RATE; this.currentTime = 0; this.delays = []; this.destination = new Dest(this); this.state = 'running'; this.rng = rng; }
  createGain() { return new Gain(this); } createOscillator() { return new Osc(this); } createBiquadFilter() { return new Biquad(this); }
  createDelay() { return new Delay(this); } createBufferSource() { return new Src(this); }
  createBuffer(ch, len) { const data = new Float32Array(len); return { getChannelData: () => data, data }; }
  resume() {}
  render(seconds) {
    const n = Math.ceil(seconds * RATE), out = new Float64Array(n);
    for (let i = 0; i < n; i++) { out[i] = this.destination.out(i); for (const d of this.delays) d.tick(i); }
    return out;
  }
}

// ---------- roda o código de src/sound.js nesse contexto ----------
function mulberry(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const SRC = fs.readFileSync(path.join(ROOT, '..', 'src', 'sound.js'), 'utf8');
// só as partes sem DOM: o sintetizador, os efeitos, a música e o efeito de dano
const part = (a, b) => { const i = SRC.indexOf(a), j = b ? SRC.indexOf(b, i) : SRC.length; if (i < 0 || j < 0) throw new Error('src/sound.js mudou: não achei ' + a); return SRC.slice(i, j); };
const CODE = [part('const SND='), ''].join('\n')
  .replace(/function sfx\([\s\S]*?\n}\n/, '')
  .replace(/function startMusic\(\)[\s\S]*$/, '')
  + '\n' + part('SFX.hurt=', '\nlet HURT_T');

function machine(seed) {
  const rnd = mulberry(seed);
  const ctx = new Ctx(rnd);
  const sandbox = {
    Math: Object.create(Math), META: {}, R: { pick: a => a[Math.floor(rnd() * a.length)] },
    window: { AudioContext: function () { return ctx; } },
  };
  sandbox.Math.random = rnd;
  vm.createContext(sandbox);
  vm.runInContext(CODE + '\naudio();', sandbox);
  return { ctx, run: c => vm.runInContext(c, sandbox) };
}

// ---------- efeitos ----------
function renderSfx(name) {
  const { ctx, run } = machine(7);
  run(`SFX[${JSON.stringify(name)}](0.01)`);
  const y = ctx.render(3.2);
  // corta o silêncio do fim
  let end = y.length - 1; while (end > 0 && Math.abs(y[end]) < 1e-4) end--;
  return y.subarray(0, Math.min(y.length, end + Math.round(.03 * RATE)));
}

// ---------- música: 16 compassos em loop, com a cauda do fim somada ao começo ----------
function renderMusic() {
  const { ctx, run } = machine(42);
  run(`SND.mus.gain.value=.55;`);
  const BARS = 16, BAR = 4.8, TAIL = 8;
  for (let b = 0; b < BARS; b++) { ctx.currentTime = b * BAR; run('musicBar()'); }
  ctx.currentTime = 0;
  const y = ctx.render(BARS * BAR + TAIL), L = Math.round(BARS * BAR * RATE), loop = new Float64Array(L);
  for (let i = 0; i < y.length; i++) loop[i % L] += y[i];
  return loop;
}

function wav(samples, file, gain) {
  let peak = 0; for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const g = gain ?? (peak > 0 ? .89 / peak : 1);
  const b = Buffer.alloc(44 + samples.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + samples.length * 2, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(RATE, 24); b.writeUInt32LE(RATE * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(s * g * 32767))), 44 + i * 2));
  fs.writeFileSync(file, b);
  return g;
}
function ogg(wavFile, oggFile) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wavFile, '-c:a', 'libvorbis', '-q:a', '5', oggFile]);
  fs.unlinkSync(wavFile);
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const names = machine(1).run('Object.keys(SFX)');
  const GAP = Math.round(.4 * RATE);
  const parts = names.map(n => [n, renderSfx(n)]);
  let total = GAP; for (const [, y] of parts) total += y.length + GAP;
  const all = new Float64Array(total), sprite = {};
  let at = GAP;
  for (const [n, y] of parts) { all.set(y, at); sprite[n] = [+(at / RATE).toFixed(3), +(y.length / RATE).toFixed(3)]; at += y.length + GAP; }
  // todos os efeitos com o mesmo ganho, para manter o volume relativo do jogo
  const wfx = path.join(OUT_DIR, 'efeitos.wav'); wav(all, wfx); ogg(wfx, path.join(OUT_DIR, 'efeitos.ogg'));
  const wm = path.join(OUT_DIR, 'musica.wav'); wav(renderMusic(), wm); ogg(wm, path.join(OUT_DIR, 'musica.ogg'));

  // mantém os IDs já enviados ao Roblox; só os trechos são reescritos
  let ids = { efeitos: 0, musica: 0 };
  if (fs.existsSync(LUA)) {
    const old = fs.readFileSync(LUA, 'utf8');
    for (const k of Object.keys(ids)) { const m = old.match(new RegExp(k + '\\s*=\\s*(\\d+)')); if (m) ids[k] = +m[1]; }
  }
  const lines = Object.entries(sprite).map(([n, [s, d]]) => `\t\t${n} = { ${s}, ${d} },`).join('\n');
  fs.writeFileSync(LUA, `-- ===== Sons da versão Roblox =====
-- Os trechos são gerados por roblox/tools/sons.cjs a partir de src/sound.js (mesmas notas do jogo).
-- Os IDs são os áudios enviados ao Roblox (roblox/tools/enviar-sons.cjs). 0 = ainda não enviado: o jogo fica mudo.
return {
	ids = {
		efeitos = ${ids.efeitos},
		musica = ${ids.musica},
	},
	-- efeito = { início, duração } em segundos dentro de efeitos.ogg
	efeitos = {
${lines}
	},
}
`);
  console.log(`${names.length} efeitos (${(total / RATE).toFixed(1)} s) e música de ${(16 * 4.8).toFixed(1)} s em ${path.relative(process.cwd(), OUT_DIR)}`);
}
main();
