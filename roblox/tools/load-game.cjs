// Carrega o jogo de src/ no Node (sem navegador) e devolve o contexto com os dados prontos.
// Os pack() de eventos são interceptados para guardar o formato original (texto, escolhas e condições).
const fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = path.join(__dirname, '..', '..', 'src');

function stub() {
  const f = function () { return p; };
  const p = new Proxy(f, {
    get: (t, k) => k === Symbol.toPrimitive ? () => '' : k === 'length' ? 0 : p,
    set: () => true, apply: () => p, construct: () => p, has: () => false,
  });
  return p;
}

function buildOrder() {
  const ps = fs.readFileSync(path.join(SRC, '..', 'build.ps1'), 'utf8');
  const m = ps.match(/\$js = \(@\(([^)]*)\)/);
  return m[1].split(',').map(s => s.trim().replace(/^'|'$/g, '')).filter(f => !/^test/.test(f));
}

function loadGame() {
  const packs = [];
  const store = {};
  const ctx = {
    console, Math, JSON, Date, Object, Array, String, Number, Boolean, RegExp, Error, Map, Set, Symbol, Promise, Proxy, Reflect,
    parseInt, parseFloat, isNaN, isFinite, Uint32Array, Intl,
    crypto: { getRandomValues: a => { for (let i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 4294967296); return a; } },
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    document: stub(), navigator: stub(), location: stub(), history: stub(),
    setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {}, requestAnimationFrame: () => 0,
    fetch: () => new Promise(() => {}), addEventListener: () => {}, matchMedia: () => ({ matches: false, addEventListener() {} }),
    NO_SAVE: 1,
  };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  const errors = [];
  for (const f of buildOrder()) {
    let code = fs.readFileSync(path.join(SRC, f), 'utf8');
    // o conversor dos rostos troca isHex por uma versão que aceita cores simbólicas (rostos.cjs)
    if (f === 'faces.js') code = code.replace('const isHex=', 'var isHex=');
    ctx.__file = f;
    try { vm.runInContext(code, ctx, { filename: f }); }
    catch (e) { errors.push(`${f}: ${e.message}`); }
    if (f === 'ev_dsl.js') {
      const orig = vm.runInContext('pack', ctx);
      ctx.__capture = (gr, list, file) => { packs.push({ gr, list, file }); return orig(gr, list); };
      vm.runInContext('pack=(gr,list)=>__capture(gr,list,__file)', ctx);
    }
  }
  return { ctx, packs, errors, run: code => vm.runInContext(code, ctx) };
}

module.exports = { loadGame };
if (require.main === module) {
  const g = loadGame();
  console.log('erros:', g.errors);
  console.log('packs:', g.packs.length, 'eventos:', g.packs.reduce((s, p) => s + p.list.length, 0));
  console.log('EVENTS total:', Object.keys(g.run('EVENTS')).length, 'COUNTRIES:', g.run('COUNTRIES').length);
}
