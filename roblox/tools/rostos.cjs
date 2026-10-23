// ===== Peças dos rostos (src/faces.js) para a versão Roblox =====
// Roda cada peça (cabelo, roupa, barba, óculos, chapéu) com cores simbólicas e grava os pedaços de SVG
// em Data/FaceParts.luau. No Roblox, FaceSvg.luau troca os símbolos pelas cores da pessoa e monta o rosto
// com a mesma lógica de faceSVG; Svg.luau desenha o resultado num EditableImage.
//   {{c}} {{s}} {{skin}} {{dark}} {{edge}} {{hg}}   variáveis
//   [[mix A;B;t]]                                   mixHex(A, B, t), resolvido de dentro para fora
const fs = require('fs'), path = require('path');

function extractFaces(g, lval, OUT, HEAD) {
  g.run(`
    var __mixReal = mixHex;
    mixHex = function(a,b,t){ return /^#[0-9a-f]{6}$/i.test(a) && /^#[0-9a-f]{6}$/i.test(b) ? __mixReal(a,b,t) : '[[mix '+a+';'+b+';'+t+']]'; };
    isHex = function(c){ return typeof c==='string' && (/^#[0-9a-f]{6}$/i.test(c) || /^\{\{(c|s|skin|dark)\}\}$/.test(c) || c.startsWith('[[mix ')); };
  `);
  const part = (expr) => { g.run(`EDGE='{{edge}}'`); const s = g.run(expr); return s; };
  const parts = { hair: {}, top: {}, beard: {}, glasses: {}, hat: {} };
  for (const id of g.run('HAIRS.map(h=>h.id)')) {
    parts.hair[id] = {
      front: part(`HAIRS.find(h=>h.id==='${id}').front('{{hg}}','{{s}}')`),
      back: g.run(`!!HAIRS.find(h=>h.id==='${id}').back`) ? part(`HAIRS.find(h=>h.id==='${id}').back('{{hg}}','{{s}}')`) : null,
      g: g.run(`HAIRS.find(h=>h.id==='${id}').g`),
    };
  }
  for (const id of g.run('TOPS.map(h=>h.id)')) parts.top[id] = { d: part(`TOPS.find(h=>h.id==='${id}').d('{{c}}','{{skin}}','{{dark}}')`), g: g.run(`TOPS.find(h=>h.id==='${id}').g`) };
  parts.top.macacao = { d: part(`ONESIE.d('{{c}}')`), g: 'U' };
  for (const id of g.run('BEARDS.map(h=>h.id)')) parts.beard[id] = part(`BEARDS.find(h=>h.id==='${id}').d('{{c}}')`);
  for (const id of g.run('GLASSES.map(h=>h.id)')) parts.glasses[id] = part(`GLASSES.find(h=>h.id==='${id}').d()`);
  for (const id of g.run('HATS.map(h=>h.id)')) parts.hat[id] = { d: part(`HATS.find(h=>h.id==='${id}').d('{{c}}')`), cut: g.run(`HATS.find(h=>h.id==='${id}').cut`) ?? null };
  g.run(`mixHex = __mixReal; EDGE='#4A3428';`);
  const consts = {
    HAIR_HEX: g.run('HAIR_HEX'), EYE_HEX: g.run('EYE_HEX'), SHIRTS: g.run('SHIRTS'), BGS: g.run('BGS'), SKINS: g.run('SKINS'),
    HEAD_M: g.run('HEAD_M'), HEAD_F: g.run('HEAD_F'), HEAD_KID: g.run('HEAD_KID'), HEAD_BABY: g.run('HEAD_BABY'), TORSO: g.run('TORSO'),
    SW: g.run('SW'), BROWS: g.run('BROWS.map(b=>b.id)'), TOPS_M: g.run("TOPS.filter(x=>(x.g==='M'||x.g==='U')&&x.id!=='uniforme').map(x=>x.id)"),
    TOPS_F: g.run("TOPS.filter(x=>(x.g==='F'||x.g==='U')&&x.id!=='uniforme').map(x=>x.id)"), BEARDS: g.run('BEARDS.map(b=>b.id)'),
    POP: g.run('POP'), HAIR_KEYS: g.run('HAIR_KEYS'), EYE_KEYS: g.run('EYE_KEYS'),
  };
  fs.writeFileSync(path.join(OUT, 'FaceParts.luau'), HEAD + 'return ' + lval({ parts, consts }) + '\n');
  return parts;
}
module.exports = { extractFaces };
