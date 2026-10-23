// ===== Envia os áudios da versão Roblox (roblox/audio/*.ogg) e grava os IDs em Sons.luau =====
// Uso: ROBLOX_API_KEY=... ROBLOX_USER_ID=... node roblox/tools/enviar-sons.cjs [efeitos] [musica]
// Sem argumentos, envia os dois. A chave precisa da permissão "assets" (leitura e escrita) no Creator Hub.
// Só é preciso rodar de novo quando src/sound.js mudar (depois de node roblox/tools/sons.cjs).
const fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..');
const LUA = path.join(ROOT, 'src', 'shared', 'NewLife', 'Sons.luau');
const KEY = process.env.ROBLOX_API_KEY, USER = process.env.ROBLOX_USER_ID;
const FILES = {
  efeitos: { file: 'efeitos.ogg', name: 'NewLife - efeitos sonoros', desc: 'Efeitos sonoros do NewLife.' },
  musica: { file: 'musica.ogg', name: 'NewLife - música ambiente', desc: 'Música ambiente do NewLife.' },
};

async function upload(k) {
  const f = FILES[k];
  const form = new FormData();
  form.append('request', JSON.stringify({
    assetType: 'Audio', displayName: f.name, description: f.desc,
    creationContext: { creator: { userId: String(USER) } },
  }));
  form.append('fileContent', new Blob([fs.readFileSync(path.join(ROOT, 'audio', f.file))], { type: 'audio/ogg' }), f.file);
  let res = await fetch('https://apis.roblox.com/assets/v1/assets', { method: 'POST', headers: { 'x-api-key': KEY }, body: form });
  let op = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${k}: HTTP ${res.status} ${JSON.stringify(op)}`);
  // o envio é assíncrono: a operação diz quando o áudio virou um asset
  for (let i = 0; i < 60 && !op.done; i++) {
    await new Promise(r => setTimeout(r, 2000));
    res = await fetch('https://apis.roblox.com/assets/v1/' + op.path, { headers: { 'x-api-key': KEY } });
    op = await res.json();
  }
  if (!op.done || !op.response || !op.response.assetId) throw new Error(`${k}: o Roblox não terminou o envio (${JSON.stringify(op)})`);
  return op.response.assetId;
}

async function main() {
  if (!KEY || !USER) throw new Error('defina ROBLOX_API_KEY e ROBLOX_USER_ID');
  const which = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(FILES);
  let lua = fs.readFileSync(LUA, 'utf8');
  for (const k of which) {
    if (!FILES[k]) throw new Error('arquivo desconhecido: ' + k);
    const id = await upload(k);
    lua = lua.replace(new RegExp('(' + k + '\\s*=\\s*)\\d+'), '$1' + id);
    fs.writeFileSync(LUA, lua);
    console.log(`${k}: rbxassetid://${id}`);
  }
}
main().catch(e => { console.error(e.message); process.exit(1); });
