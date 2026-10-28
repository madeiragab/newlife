// ===== Conversor: dados do jogo (src/) -> módulos Luau da versão Roblox =====
// Uso: node roblox/tools/extract.cjs
// Carrega o jogo no Node, pega os eventos no formato compacto (pack), traduz as condições para Luau,
// tira o que é proibido no Roblox (cortes.cjs) e grava em roblox/src/shared/NewLife/Data/.
// Eventos que dependem de sistemas que ainda não existem no Roblox ficam de fora e vão para o relatório.
const fs = require('fs'), path = require('path');
const acorn = require('acorn');
const { loadGame } = require('./load-game.cjs');
const { textoProibido, efeitoProibido } = require('./cortes.cjs');
const { extractFaces } = require('./rostos.cjs');

const OUT = path.join(__dirname, '..', 'src', 'shared', 'NewLife', 'Data');
const REPORT = path.join(__dirname, '..', 'conversao.txt');

// ---------- texto Luau ----------
function lstr(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r')
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, c => '\\' + c.charCodeAt(0)) + '"';
}
const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
function lval(v, ind = '') {
  if (v === null || v === undefined) return 'nil';
  if (typeof v === 'string') return lstr(v);
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : '0';
  if (typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return '{' + v.map(x => lval(x, ind)).join(',') + '}';
  const ks = Object.keys(v).filter(k => v[k] !== undefined && typeof v[k] !== 'function');
  return '{' + ks.map(k => (IDENT.test(k) ? k : '[' + lstr(k) + ']') + '=' + lval(v[k], ind)).join(',') + '}';
}

// ---------- condições: JS -> Luau ----------
// Só um subconjunto de expressões é aceito; qualquer coisa fora disso derruba o evento (vai para o relatório).
const HELPERS = {
  people: 'G.people', partners: 'G.partners', kids: 'G.kids', parents: 'G.parents', netWorth: 'G.netWorth',
};
// partes do personagem que o Roblox ainda não simula: eventos que olham para elas ficam para depois
const NO_FIELD = new Set(['criatura', 'office', 'rev', 'para', 'seita', 'royal', 'biz', 'job', 'social', 'ret', 'lutador', 'heroi', 'faccao']);
const BOOL_OPS = new Set(['===', '!==', '==', '!=', '<', '>', '<=', '>=']);
class Unsupported extends Error {}
function translateFn(fnSrc) {
  let ast;
  try { ast = acorn.parseExpressionAt('(' + fnSrc + ')', 0, { ecmaVersion: 2022 }); }
  catch (e) { throw new Unsupported('sintaxe'); }
  if (ast.type !== 'ArrowFunctionExpression' && ast.type !== 'FunctionExpression') throw new Unsupported('não é função');
  const params = ast.params.map(p => p.name);
  let body = ast.body;
  if (body.type === 'BlockStatement') {
    if (body.body.length === 1 && body.body[0].type === 'ReturnStatement') body = body.body[0].argument;
    else throw new Unsupported('bloco');
  }
  const scope = new Set(params);
  return { params, expr: asBool(body, scope) };
}
function isBool(n) {
  return (n.type === 'BinaryExpression' && BOOL_OPS.has(n.operator)) || (n.type === 'UnaryExpression' && n.operator === '!')
    || (n.type === 'Literal' && typeof n.value === 'boolean');
}
function asBool(n, scope) { const s = tr(n, scope, true); return isBool(n) || n.type === 'LogicalExpression' ? s : 'G.T(' + s + ')'; }
function tr(n, scope, boolCtx) {
  switch (n.type) {
    case 'Literal':
      if (n.regex) throw new Unsupported('regex');
      return n.value === null ? 'nil' : typeof n.value === 'string' ? lstr(n.value) : String(n.value);
    case 'Identifier':
      if (scope.has(n.name)) return n.name;
      if (n.name === 'undefined') return 'nil';
      if (n.name === 'S') return 'G.S';
      if (HELPERS[n.name]) return HELPERS[n.name];
      throw new Unsupported('id:' + n.name);
    case 'MemberExpression': {
      if (n.optional) throw new Unsupported('?.');
      const obj = tr(n.object, scope, false);
      if (n.computed) {
        if (n.property.type === 'Literal' && typeof n.property.value === 'string') return obj + '[' + lstr(n.property.value) + ']';
        throw new Unsupported('índice');
      }
      if (n.property.name === 'length') return '#' + obj;
      if (n.object.type === 'Identifier' && scope.has(n.object.name) && NO_FIELD.has(n.property.name)) throw new Unsupported('sistema:' + n.property.name);
      return obj + '.' + n.property.name;
    }
    case 'CallExpression': {
      const args = n.arguments;
      if (n.callee.type === 'Identifier') {
        if (n.callee.name === 'NP' && args.length === 1) return '(not ' + tr(args[0], scope, false) + '.prison)';
        if (HELPERS[n.callee.name]) return HELPERS[n.callee.name] + '(' + args.map(a => tr(a, scope, false)).join(', ') + ')';
        throw new Unsupported('fn:' + n.callee.name);
      }
      if (n.callee.type === 'MemberExpression' && !n.callee.computed) {
        const meth = n.callee.property.name, obj = tr(n.callee.object, scope, false);
        if (meth === 'includes' && args.length === 1) return 'G.includes(' + obj + ', ' + tr(args[0], scope, false) + ')';
        if ((meth === 'some' || meth === 'every' || meth === 'filter') && args.length === 1 && args[0].type === 'ArrowFunctionExpression') {
          const f = args[0], sc = new Set(scope); f.params.forEach(p => sc.add(p.name));
          const b = f.body.type === 'BlockStatement' ? (() => { throw new Unsupported('bloco'); })() : asBool(f.body, sc);
          return 'G.' + meth + '(' + obj + ', function(' + f.params.map(p => p.name).join(', ') + ') return ' + b + ' end)';
        }
        if (meth === 'startsWith' && args.length === 1) return 'G.startsWith(' + obj + ', ' + tr(args[0], scope, false) + ')';
        throw new Unsupported('método:' + meth);
      }
      throw new Unsupported('chamada');
    }
    case 'UnaryExpression':
      if (n.operator === '!') return '(not ' + asBool(n.argument, scope) + ')';
      if (n.operator === '-') return '(-' + tr(n.argument, scope, false) + ')';
      throw new Unsupported('unário ' + n.operator);
    case 'BinaryExpression': {
      const op = { '===': '==', '==': '==', '!==': '~=', '!=': '~=', '<': '<', '>': '>', '<=': '<=', '>=': '>=', '+': '+', '-': '-', '*': '*', '/': '/', '%': '%' }[n.operator];
      if (!op) throw new Unsupported('op ' + n.operator);
      return '(' + tr(n.left, scope, false) + ' ' + op + ' ' + tr(n.right, scope, false) + ')';
    }
    case 'LogicalExpression':
      if (n.operator === '??') return '(' + tr(n.left, scope, false) + ' or ' + tr(n.right, scope, false) + ')';
      if (boolCtx) return '(' + asBool(n.left, scope) + (n.operator === '&&' ? ' and ' : ' or ') + asBool(n.right, scope) + ')';
      // valor: "x||0" (nil vira 0); "a&&b" vira nil quando a é falso
      if (n.operator === '||') return '(G.V(' + tr(n.left, scope, false) + ') or ' + tr(n.right, scope, false) + ')';
      return '(if ' + asBool(n.left, scope) + ' then ' + tr(n.right, scope, false) + ' else nil)';
    case 'ConditionalExpression':
      return '(if ' + asBool(n.test, scope) + ' then ' + tr(n.consequent, scope, boolCtx) + ' else ' + tr(n.alternate, scope, boolCtx) + ')';
    case 'ArrayExpression':
      return '{' + n.elements.map(e => tr(e, scope, false)).join(', ') + '}';
    default:
      throw new Unsupported(n.type);
  }
}

// ---------- condições com variáveis de fora (ex.: o país do pacote) ----------
// A função é testada em todas as combinações de país × preso × escola; só vale se ela não olhar mais nada.
const EDU_TYPES = [null, 'fund', 'medio', 'tec', 'uni', 'post'];
function probe(fn, countries) {
  const seen = new Set();
  const track = (obj, pre) => new Proxy(obj, {
    get(t, k) {
      if (typeof k === 'symbol') return t[k];
      const p = pre + k; seen.add(p);
      const v = t[k];
      return v && typeof v === 'object' && !Array.isArray(v) ? track(v, p + '.') : v;
    },
  });
  const allowed = new Set(['country', 'prison', 'edu', 'edu.cur', 'edu.cur.type']);
  const keys = [];
  for (const c of countries) for (const pr of [false, true]) for (const et of EDU_TYPES) {
    const m = { country: c, prison: pr ? { juv: false, left: 1 } : null, edu: { cur: et ? { type: et, id: '', grade: 50, yr: 0, len: 3 } : null, deg: [] } };
    let ok;
    try { ok = !!fn(track(m, '')); } catch (e) { return null; }
    for (const s of seen) if (!allowed.has(s)) return null;
    if (ok) keys.push(c + '|' + (pr ? 1 : 0) + '|' + (et || '-'));
  }
  return keys;
}

// tabela verdade compacta: quando ela é um produto (países × preso × escola), vira três listas
function comboLua(keys) {
  const parts = keys.map(k => k.split('|')), dims = [0, 1, 2].map(i => [...new Set(parts.map(p => p[i]))]);
  if (keys.length && dims[0].length * dims[1].length * dims[2].length === keys.length)
    return 'G.combo3(' + lval(dims[0]) + ', ' + lval(dims[1].map(Number)) + ', ' + lval(dims[2]) + ')';
  return 'G.combo(' + lval(Object.fromEntries(keys.map(k => [k, true]))) + ')';
}
function condition(fn, countries) {
  if (!fn) return null;
  const src = String(fn);
  try {
    const { params, expr } = translateFn(src);
    return 'function(' + (params[0] || '_') + ') return ' + expr + ' end';
  } catch (e) {
    if (!(e instanceof Unsupported)) throw e;
    const keys = probe(fn, countries);
    if (keys) return comboLua(keys);
    throw e;
  }
}

// ---------- efeitos aceitos pelo motor Luau (Dsl.luau) ----------
const TOKENS = [
  /^(h|hl|sm|lk|k|f|grade|bond|fight|will)[+-]\d+$/, /^\$[+-]?(\d+|v2|v)$/, /^add\.alcool[+-]\d+$/, /^tal\.\w+[+-]\d+$/,
  /^meet2?(:(amigo|namoro|inimigo|colega))?$/, /^c:\w+$/, /^\?(\d+|sm|lk|hl|h|k|f|fight|grade|will|tal\.\w+)([+-]\d+)?$/,
];
const WHO_OK = new Set(['partner', 'partnerDating', 'partnerEngaged', 'partnerUnhappy', 'spouse', 'ex', 'kid', 'baby', 'child', 'teen', 'adultkid', 'grandkid', 'classmate']);
// marcadores de texto que o motor Luau sabe preencher (Engine.luau: tp e fill)
const PLACEHOLDERS = new Set(['p', 'o', 'o2', 'a', 'ele', 'v', 'v2', 'n', 'nl', 'n2', 'n2l', 'on', 'on2', 'eln', 'eln2', 'lugar', 'coisa', 'prod', 'co', 'idade', 'sib', 'friend']);
let FILL_KEYS = new Set();
const OPT_OK = new Set(['k', 'when', 'min', 'max', 'w', 'cd', 'once', 'who', 'v', 'date', 'same', 'gn', 'id']);

function choiceTokens(c) { const p = c.split('|'); return [p[1], p[3]].flatMap(s => String(s || '').trim().split(/\s+/).filter(Boolean)); }

// ID estável igual ao do jogo (evKey), para um dia dar para comparar saves e relatórios
function evId(o, title, text, used) {
  const t = Array.isArray(text) ? text[0] : text, s = [o.scen || '', o.k || '', o.who || '', o.crew || '', title, String(t || '').slice(0, 80)].join('|');
  let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  let id = 'p_' + (h >>> 0).toString(36), n = 1; while (used.has(id + (n > 1 ? '_' + n : ''))) n++;
  id += n > 1 ? '_' + n : ''; used.add(id); return id;
}

function main() {
  const g = loadGame();
  if (g.errors.length) console.warn('avisos ao carregar o jogo:', g.errors.join('; '));
  const countries = g.run('COUNTRIES.map(c=>c.id)');
  FILL_KEYS = new Set(Object.keys(g.run('FILL')));
  const out = [], why = {}, cortes = {}, cortesEscolha = {}, used = new Set();
  const skip = (map, k) => { map[k] = (map[k] || 0) + 1; };

  for (const pk of g.packs) {
    const gr = pk.gr;
    for (const e of pk.list) {
      const [title, text, choices0, op = {}] = e;
      const o = Object.assign({}, gr, op);
      const id = evId(o, title, text, used);
      if (gr.scen || o.scen) { skip(why, 'modo fictício'); continue; }
      if (o.jail) { skip(why, 'prisão'); continue; }
      const bad = Object.keys(o).find(k => !OPT_OK.has(k)); if (bad) { skip(why, 'opção:' + bad); continue; }
      if (o.who && !WHO_OK.has(o.who)) { skip(why, 'who:' + o.who); continue; }
      // título ou texto proibido derruba o evento; escolha proibida sai sozinha, se sobrarem ao menos duas
      const base = [title].concat(Array.isArray(text) ? text : [text]);
      const proibBase = base.map(textoProibido).find(Boolean);
      if (proibBase) { skip(cortes, proibBase.trim()); continue; }
      const proibCh = c => textoProibido(c) || choiceTokens(c).map(efeitoProibido).find(Boolean);
      const choices = choices0.filter(c => !proibCh(c));
      if (choices.length < choices0.length) {
        const p = proibCh(choices0.find(c => proibCh(c))).trim();
        if (choices.length < Math.min(2, choices0.length)) { skip(cortes, p); continue; }
        skip(cortesEscolha, p);
      }
      const textos = base.concat(choices);
      const ph = textos.join(' ').match(/\{(\w*)\}/g) || [];
      const phBad = ph.map(x => x.slice(1, -1)).find(k => !PLACEHOLDERS.has(k) && !FILL_KEYS.has(k));
      if (phBad !== undefined) { skip(why, 'texto:{' + phBad + '}'); continue; }
      const tokBad = choices.flatMap(choiceTokens).find(t => !TOKENS.some(r => r.test(t)));
      if (tokBad) { skip(why, 'efeito:' + tokBad.replace(/[+-]\d+$/, '').replace(/:.*/, ':')); continue; }
      let conds = [];
      try { for (const w of [gr.when, op.when]) { const c = condition(w, countries); if (c) conds.push(c); } }
      catch (err) { if (!(err instanceof Unsupported)) throw err; skip(why, 'condição:' + err.message); continue; }
      out.push({ id, k: o.k, title, text, choices, min: o.min, max: o.max, w: o.w ?? 1.2, cd: o.cd ?? 12, once: o.once ? true : undefined,
        who: o.who, v: o.v, date: o.date ? true : undefined, same: o.same ? true : undefined, gn: o.gn, conds });
    }
  }

  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (/^Events\d+\.luau$/.test(f)) fs.unlinkSync(path.join(OUT, f));
  const HEAD = '-- Gerado por roblox/tools/extract.cjs a partir de src/. Não edite: rode o conversor de novo.\n';
  // vários módulos menores: o Roblox Studio sofre com scripts gigantes
  const CHUNK = 250, chunks = [];
  for (let i = 0; i < out.length; i += CHUNK) chunks.push(out.slice(i, i + CHUNK));
  chunks.forEach((list, i) => {
    const body = list.map(e => {
      const { conds, ...rest } = e;
      const t = lval(rest);
      return '\t' + t.slice(0, -1) + (conds.length ? ',when={' + conds.join(',') + '}' : '') + '}';
    }).join(',\n');
    fs.writeFileSync(path.join(OUT, `Events${i + 1}.luau`), HEAD + 'return function(G)\n\treturn {\n' + body + '\n\t}\nend\n');
  });
  fs.writeFileSync(path.join(OUT, 'EventChunks.luau'), HEAD + 'return ' + chunks.length + '\n');

  // países, nomes e frases do dia a dia
  const C = g.run('COUNTRIES').map(c => ({ id: c.id, n: c.n, cities: c.cities, L: c.L }));
  fs.writeFileSync(path.join(OUT, 'Countries.luau'), HEAD + 'return ' + lval(C) + '\n');
  const db = g.run('NAME_DB'), names = {};
  for (const id of countries) {
    const d = db[id] || {}, base = C.find(c => c.id === id);
    const pool = k => (d[k] && d[k].length ? d[k] : g.run('COUNTRIES').find(c => c.id === id)[k].map(n => [n, 1]));
    names[id] = { M: pool('M'), F: pool('F'), L: d.L && d.L.length ? d.L : base.L.map(n => [n, 1]) };
  }
  fs.writeFileSync(path.join(OUT, 'Names.luau'), HEAD + 'return ' + lval({ db: names, compound: g.run('COMPOUND'), doubleLast: g.run('DOUBLE_LAST') }) + '\n');
  const limpa = arr => arr.filter(s => !textoProibido(s));
  const FILL = g.run('FILL'), fill = {};
  for (const k in FILL) fill[k] = limpa(FILL[k]);
  const fluff = { kid: limpa(g.run('FLUFF_KID')), teen: limpa(g.run('FLUFF_TEEN')), adult: limpa(g.run('FLUFF_ADULT')), old: limpa(g.run('FLUFF_OLD')) };
  fs.writeFileSync(path.join(OUT, 'Text.luau'), HEAD + 'return ' + lval({ fill, fluff, trips: limpa(g.run('TRIPS')) }) + '\n');

  // rostos: peças de src/faces.js com cores simbólicas
  extractFaces(g, lval, OUT, HEAD);

  // bandeiras (icons.js), emoji de cada tipo de evento e novidades (sem o que é cortado no Roblox)
  const changelog = g.run('CHANGELOG').slice(0, 40).map(c => ({ v: c.v, d: c.d, t: c.t, itens: c.itens.filter(x => !textoProibido(x)) })).filter(c => c.itens.length);
  fs.writeFileSync(path.join(OUT, 'Icons.luau'), HEAD + 'return ' + lval({ flags: g.run('FLAG_ART'), kick: g.run('KICK_EMOJI'), changelog }) + '\n');

  // dicionário de inglês das telas (src/i18n.js)
  fs.writeFileSync(path.join(OUT, 'I18nEN.luau'), HEAD + 'return ' + lval(g.run('EN')) + '\n');

  // versão do jogo (a mesma do CHANGELOG em src/update.js) para mostrar na tela
  const ver = g.run('CHANGELOG[0].v');
  fs.writeFileSync(path.join(OUT, 'Version.luau'), HEAD + 'return ' + lval({ v: ver, built: process.env.NL_BUILD || new Date().toISOString().slice(0, 16).replace('T', ' ') }) + '\n');

  const total = g.packs.reduce((s, p) => s + p.list.length, 0);
  const lines = [
    `Conversão para o Roblox (${new Date().toISOString().slice(0, 10)})`,
    `Eventos no formato compacto: ${total}`,
    `Convertidos: ${out.length}`,
    `Cortados pelas regras do Roblox: ${Object.values(cortes).reduce((a, b) => a + b, 0)}`,
    `Escolhas cortadas (o evento ficou): ${Object.values(cortesEscolha).reduce((a, b) => a + b, 0)}`,
    `Fora por depender de sistemas que o Roblox ainda não tem: ${Object.values(why).reduce((a, b) => a + b, 0)}`,
    '', 'Cortes (palavra ou efeito que derrubou o evento):',
    ...Object.entries(cortes).sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${n}\t${k}`),
    '', 'Escolhas cortadas (palavra ou efeito):',
    ...Object.entries(cortesEscolha).sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${n}	${k}`),
    '', 'Ainda não suportado:',
    ...Object.entries(why).sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${n}\t${k}`),
  ];
  fs.writeFileSync(REPORT, lines.join('\n') + '\n');
  console.log(lines.slice(0, 5).join('\n'));
}
main();
