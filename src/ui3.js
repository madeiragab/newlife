// ===== Interface 3.0 =====
// Palco com o personagem de corpo inteiro num cenário que muda com a vida, anéis de atributos animados,
// números que sobem e descem na tela, diário em linha do tempo, eventos em cartões com cor por tema,
// animação de aniversário, entradas suaves nos painéis, vibração no celular e layout de três colunas no PC.
const V3_REDUZ=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const vibrar=p=>{ try{ if(META&&META.vibra===false) return; navigator.vibrate&&navigator.vibrate(p); }catch(e){} };

// ---------- cores por tema dos eventos ----------
const V3_TEMA=[
 [/Família|Filhos|Infância|Adoção|Casa|Vizinhança|Bairro|Mudança/,'#F08A24'],
 [/Amor|Coração|Encontro|Casamento|Balada|Aplicativo/,'#E94B7B'],
 [/Escola|Estudos|Faculdade|Formatura|Concurso|Autoescola|Medicina|Direito|Engenharia|Pesquisa/,'#3B82F6'],
 [/Trabalho|Carreira|Escritório|Empresa|Negócio|Loja|Obra|Plantão|Comércio|Tecnologia|Redação/,'#0EA5A0'],
 [/Dinheiro|Impostos|Sorte|Roleta|Corrida|Resultado/,'#16A34A'],
 [/Crime|Polícia|Prisão|Justiça|Tribunal|Fuga|Perigo|Má companhia|Tentação|Vício/,'#DC2626'],
 [/Saúde|Hospital|Cirurgia|Consultório|Internação|Luto|Velhice/,'#0891B2'],
 [/Fama|Cinema|Música|TV|Moda|Comédia|Arte|Literatura|Streaming|Esporte|Talento|Redes sociais/,'#9333EA'],
 [/Política|Realeza|Coroa|Dever cívico|Embaixada|Forças Armadas|Guerra/,'#B45309'],
 [/Mistério|Paranormal|Vampir|Lobisomem|Seita|Fantasma|Bruxa|Criatura|Maldição/,'#6D28D9'],
 [/Viagem|Emigração|Passeio|Céu|Estrada|Trânsito|Carro/,'#0284C7'],
 [/Bicho|Pet|Animal/,'#65A30D']];
const temaCor=k=>{ for(const [re,c] of V3_TEMA) if(re.test(k||'')) return c; return k?`hsl(${hashS(k)%360} 62% 48%)`:'#5B5BD6'; };

// ---------- cenários ----------
function v3Cena(m){
  if(!m) return 'casa';
  if(!m.alive) return 'cemiterio';
  if(S.scen) return {zumbi:'zumbi',ilha:'ilha',isekai:'fantasia',marte:'marte',heroi:'noite'}[S.scen.id]||'noite';
  if(m.prison) return 'prisao';
  if(m.criatura==='vampiro') return 'noite';
  if(m.criatura==='lobisomem') return 'floresta';
  if(m.royal&&!m.royal.abd) return 'palacio';
  if(m.age<3) return 'bebe';
  if(m.edu&&m.edu.cur&&!m.job) return ['uni','post'].includes(m.edu.cur.type)?'campus':'escola';
  if(m.age<6) return 'quarto';
  if(m.job&&!m.job.spc){ const id=m.job.id;
   if(/^(medi|neuro|psiq|derma|pedia|ciru|dent|orto|impl|enf|tenf|farm|fari|vete|nutri|ghosp|psic|npsi|psio)/.test(id)) return 'hospital';
   if(/^(obra|mobra|poli|bomb|cart|seg|port|cami|pesc|agri|tagr|zoot|ambi|lava|salv|limp|entr|app|peri)/.test(id)) return 'rua';
   if(/^(lanch|sorv|garc|somm|caixa|vend|repo|coz|chef|chefc|bar|recep|baba)/.test(id)) return 'loja';
   return 'escritorio'; }
  if(m.job&&m.job.spc) return {ator:'palco',musico:'palco',comedia:'palco',dj:'palco',atleta:'estadio',modelo:'palco'}[m.job.spc]||'cidade';
  if(m.office) return 'palacio';
  if(m.age>=65||m.ret) return 'parque';
  return m.age<18?'quarto':'cidade';
}
const V3_CENAS={
 bebe:['#FDE2E4','#FAD2E1',`<rect y="150" width="400" height="50" fill="#E9C9B5"/><g fill="#fff" opacity=".6"><circle cx="60" cy="40" r="6"/><circle cx="330" cy="60" r="5"/><circle cx="250" cy="30" r="4"/></g><g transform="translate(300 95)"><rect width="80" height="60" rx="4" fill="#fff" stroke="#E4B7C4" stroke-width="3"/><path d="M8 0v60M24 0v60M40 0v60M56 0v60M72 0v60" stroke="#E4B7C4" stroke-width="3"/></g><g transform="translate(70 18)"><path d="M0 0v20M-20 20h40" stroke="#B6A6CA" stroke-width="2"/><circle cx="-20" cy="34" r="6" fill="#FFD166"/><path d="M0 26l6 10h-12z" fill="#90CDF4"/><circle cx="20" cy="34" r="6" fill="#F28482"/></g>`],
 quarto:['#D7E9FF','#BFDAFF',`<rect y="152" width="400" height="48" fill="#C9A27E"/><rect x="40" y="40" width="70" height="60" rx="4" fill="#9FD3FF" stroke="#fff" stroke-width="5"/><path d="M75 40v60M40 70h70" stroke="#fff" stroke-width="4"/><g transform="translate(290 70)"><rect width="90" height="82" rx="6" fill="#F4A261"/><rect x="6" y="8" width="78" height="14" rx="3" fill="#E76F51"/><rect x="6" y="30" width="78" height="14" rx="3" fill="#2A9D8F"/><rect x="6" y="52" width="78" height="14" rx="3" fill="#E9C46A"/></g><circle cx="200" cy="40" r="14" fill="#FFD166" opacity=".8"/>`],
 escola:['#E6F4EA','#CDE8D4',`<rect y="150" width="400" height="50" fill="#B98B5E"/><rect x="30" y="30" width="170" height="90" rx="6" fill="#2F5D50" stroke="#8B5E34" stroke-width="7"/><path d="M50 60h60M50 78h90M50 96h40" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/><text x="150" y="70" font-size="18" fill="#fff" opacity=".8" font-family="sans-serif">2+2=4</text><g transform="translate(290 50)"><rect width="30" height="100" fill="#5B8DEF"/><rect x="34" width="30" height="100" fill="#5B8DEF"/><rect x="68" width="30" height="100" fill="#EF8354"/><g fill="#fff" opacity=".5"><rect x="20" y="40" width="4" height="12"/><rect x="54" y="40" width="4" height="12"/><rect x="88" y="40" width="4" height="12"/></g></g><circle cx="230" cy="28" r="12" fill="#fff" stroke="#333" stroke-width="2"/><path d="M230 20v8l5 3" stroke="#333" stroke-width="2" fill="none"/>`],
 campus:['#BEE3F8','#E6F4FF',`<rect y="140" width="400" height="60" fill="#8FCB7A"/><rect x="40" y="50" width="150" height="92" fill="#E5D3B3"/><path d="M30 52l85-34 85 34z" fill="#B5838D"/><g fill="#6C7A89"><rect x="58" y="70" width="18" height="24"/><rect x="92" y="70" width="18" height="24"/><rect x="126" y="70" width="18" height="24"/><rect x="160" y="70" width="18" height="24"/></g><rect x="100" y="108" width="30" height="34" fill="#7F5539"/><circle cx="320" cy="90" r="38" fill="#52B788"/><rect x="315" y="110" width="10" height="34" fill="#7F5539"/>`],
 escritorio:['#E3E9F3','#CED8E8',`<rect y="152" width="400" height="48" fill="#9AA5B1"/><g transform="translate(30 20)"><rect width="150" height="110" fill="#9CC9F5"/><g fill="#5C7EA8"><rect x="10" y="50" width="22" height="60"/><rect x="38" y="30" width="26" height="80"/><rect x="70" y="60" width="20" height="50"/><rect x="96" y="20" width="24" height="90"/><rect x="124" y="45" width="20" height="65"/></g><path d="M75 0v110M0 55h150" stroke="#fff" stroke-width="5"/><rect width="150" height="110" fill="none" stroke="#fff" stroke-width="6"/></g><g transform="translate(270 100)"><rect width="110" height="10" fill="#7F5539"/><rect x="8" y="10" width="8" height="42" fill="#7F5539"/><rect x="94" y="10" width="8" height="42" fill="#7F5539"/><rect x="30" y="-36" width="50" height="34" rx="3" fill="#2B2D42"/><rect x="34" y="-32" width="42" height="26" fill="#8ECAE6"/></g><g transform="translate(225 110)"><rect width="16" height="42" fill="#E07A5F"/><circle cx="8" cy="-6" r="14" fill="#52B788"/></g>`],
 hospital:['#E0F7FA','#C8EEF2',`<rect y="152" width="400" height="48" fill="#B2DFDB"/><rect x="0" y="118" width="400" height="6" fill="#80CBC4"/><g transform="translate(40 30)"><rect width="60" height="60" rx="10" fill="#fff"/><path d="M22 12h16v18h18v16H38v18H22V46H4V30h18z" transform="translate(0 -2) scale(.9)" fill="#E63946"/></g><g transform="translate(260 96)"><rect width="120" height="22" rx="6" fill="#fff" stroke="#90A4AE" stroke-width="3"/><rect x="4" y="-12" width="30" height="16" rx="6" fill="#fff" stroke="#90A4AE" stroke-width="3"/><path d="M10 22v34M110 22v34" stroke="#90A4AE" stroke-width="4"/></g><g transform="translate(190 30)"><path d="M0 0v70" stroke="#90A4AE" stroke-width="3"/><rect x="-14" y="6" width="28" height="22" rx="4" fill="#BDE0FE"/></g>`],
 rua:['#AEE2FF','#DDF3FF',`<rect y="150" width="400" height="50" fill="#6C757D"/><path d="M0 172h400" stroke="#FFD166" stroke-width="4" stroke-dasharray="26 18"/><g fill="#ADB5BD"><rect x="20" y="40" width="60" height="110"/><rect x="90" y="70" width="50" height="80"/><rect x="290" y="30" width="70" height="120"/></g><g fill="#fff" opacity=".6"><rect x="30" y="52" width="12" height="14"/><rect x="56" y="52" width="12" height="14"/><rect x="30" y="80" width="12" height="14"/><rect x="56" y="80" width="12" height="14"/><rect x="302" y="44" width="14" height="16"/><rect x="332" y="44" width="14" height="16"/><rect x="302" y="76" width="14" height="16"/><rect x="332" y="76" width="14" height="16"/></g><g transform="translate(230 70)"><rect x="-3" width="6" height="80" fill="#495057"/><rect x="-12" y="-2" width="24" height="42" rx="5" fill="#343A40"/><circle cy="9" r="5" fill="#E63946"/><circle cy="19" r="5" fill="#FFD166" opacity=".5"/><circle cy="29" r="5" fill="#52B788" opacity=".5"/></g>`],
 loja:['#FFF1E6','#FDE2CC',`<rect y="150" width="400" height="50" fill="#D4A373"/><g transform="translate(20 20)"><rect width="200" height="18" fill="#E63946"/><path d="M0 18h200" stroke="#fff" stroke-width="0"/><g fill="#fff"><rect x="20" width="20" height="18"/><rect x="60" width="20" height="18"/><rect x="100" width="20" height="18"/><rect x="140" width="20" height="18"/><rect x="180" width="20" height="18"/></g></g><g transform="translate(30 56)"><rect width="180" height="8" fill="#8D6346"/><rect y="40" width="180" height="8" fill="#8D6346"/><g><circle cx="20" cy="-8" r="8" fill="#F4A261"/><circle cx="44" cy="-8" r="8" fill="#E9C46A"/><circle cx="68" cy="-8" r="8" fill="#E76F51"/><rect x="100" y="-18" width="16" height="18" fill="#2A9D8F"/><rect x="124" y="-18" width="16" height="18" fill="#264653"/><rect x="20" y="22" width="20" height="18" fill="#8ECAE6"/><rect x="50" y="22" width="20" height="18" fill="#FFB703"/><rect x="80" y="22" width="20" height="18" fill="#FB8500"/></g></g><g transform="translate(270 100)"><rect width="110" height="52" rx="4" fill="#BC6C25"/><rect x="60" y="-24" width="36" height="24" rx="3" fill="#343A40"/><rect x="64" y="-20" width="28" height="12" fill="#90E0EF"/></g>`],
 cidade:['#9AD0F5','#E2F1FB',`<rect y="150" width="400" height="50" fill="#A3B18A"/><g fill="#7895B2"><rect x="10" y="70" width="40" height="80"/><rect x="55" y="40" width="34" height="110"/><rect x="95" y="85" width="40" height="65"/><rect x="250" y="55" width="40" height="95"/><rect x="295" y="25" width="36" height="125"/><rect x="336" y="80" width="54" height="70"/></g><g fill="#fff" opacity=".45"><rect x="62" y="50" width="8" height="10"/><rect x="74" y="50" width="8" height="10"/><rect x="62" y="70" width="8" height="10"/><rect x="74" y="70" width="8" height="10"/><rect x="302" y="36" width="8" height="10"/><rect x="316" y="36" width="8" height="10"/><rect x="302" y="56" width="8" height="10"/><rect x="316" y="56" width="8" height="10"/></g><circle cx="190" cy="40" r="18" fill="#FFE066"/><g fill="#fff"><ellipse cx="140" cy="30" rx="22" ry="8"/><ellipse cx="350" cy="16" rx="18" ry="6"/></g>`],
 parque:['#FFD6A5','#FFF1D6',`<circle cx="320" cy="70" r="30" fill="#FFB4A2"/><rect y="140" width="400" height="60" fill="#95D5B2"/><circle cx="60" cy="90" r="42" fill="#52B788"/><circle cx="100" cy="100" r="30" fill="#40916C"/><rect x="66" y="110" width="10" height="36" fill="#7F5539"/><g transform="translate(250 118)"><rect width="110" height="8" rx="3" fill="#9C6644"/><rect y="-20" width="110" height="7" rx="3" fill="#9C6644"/><rect x="8" y="8" width="6" height="22" fill="#6F4518"/><rect x="96" y="8" width="6" height="22" fill="#6F4518"/></g><g fill="#F28482"><circle cx="180" cy="156" r="4"/><circle cx="200" cy="164" r="4"/><circle cx="380" cy="160" r="4"/></g>`],
 noite:['#1B1F3B','#3A3F6B',`<circle cx="320" cy="50" r="26" fill="#F8F4E3"/><circle cx="330" cy="44" r="24" fill="#2A2F55" opacity=".25"/><g fill="#fff"><circle cx="40" cy="30" r="1.6"/><circle cx="90" cy="60" r="1.2"/><circle cx="150" cy="20" r="1.8"/><circle cx="220" cy="50" r="1.2"/><circle cx="260" cy="16" r="1.5"/><circle cx="380" cy="100" r="1.2"/></g><g fill="#12142A"><rect x="0" y="90" width="44" height="110"/><rect x="48" y="60" width="36" height="140"/><rect x="88" y="104" width="50" height="96"/><path d="M250 200V80l20-24 20 24v120z"/><rect x="300" y="100" width="40" height="100"/><rect x="345" y="120" width="55" height="80"/></g><g fill="#FFD166" opacity=".7"><rect x="56" y="74" width="6" height="8"/><rect x="70" y="96" width="6" height="8"/><rect x="310" y="112" width="6" height="8"/><rect x="262" y="100" width="6" height="8"/></g>`],
 floresta:['#14213D','#28406A',`<circle cx="300" cy="56" r="34" fill="#FFF3C4"/><circle cx="300" cy="56" r="46" fill="#FFF3C4" opacity=".15"/><g fill="#0B1A2E"><path d="M20 200l40-120 40 120z"/><path d="M80 200l50-150 50 150z"/><path d="M330 200l35-110 35 110z"/><path d="M220 200l30-90 30 90z"/></g><rect y="176" width="400" height="24" fill="#0A1424"/>`],
 prisao:['#9AA0A6','#B9BEC3',`<rect y="150" width="400" height="50" fill="#6B7075"/><g stroke="#4A4F55" stroke-width="2" opacity=".35"><path d="M0 40h400M0 80h400M0 120h400M40 0v40M120 0v40M200 0v40M280 0v40M360 0v40M80 40v40M160 40v40M240 40v40M320 40v40M40 80v40M120 80v40M200 80v40M280 80v40M360 80v40"/></g><rect x="300" y="30" width="60" height="40" fill="#CFE8FF"/><path d="M310 30v40M322 30v40M334 30v40M346 30v40" stroke="#555" stroke-width="4"/><g transform="translate(30 100)"><rect width="110" height="16" rx="3" fill="#8D99AE"/><rect y="16" width="110" height="34" fill="#5C677D"/></g>`],
 palacio:['#F6E7CB','#EBD3A5',`<rect y="150" width="400" height="50" fill="#C9A66B"/><rect x="170" y="150" width="60" height="50" fill="#B5172E"/><g fill="#FFF8EC" stroke="#D9BF8C" stroke-width="2"><rect x="30" y="30" width="22" height="120"/><rect x="100" y="30" width="22" height="120"/><rect x="278" y="30" width="22" height="120"/><rect x="348" y="30" width="22" height="120"/></g><path d="M0 26h400v8H0z" fill="#D9BF8C"/><g transform="translate(200 60)"><circle r="18" fill="#E9C46A"/><path d="M-12 4l4-14 8 8 8-8 4 14z" fill="#B5172E"/></g>`],
 palco:['#2B2D42','#3F2B56',`<path d="M60 0L0 200h140z" fill="#FFF3B0" opacity=".14"/><path d="M340 0l-80 200h140z" fill="#FFF3B0" opacity=".14"/><rect y="160" width="400" height="40" fill="#5A3E2B"/><rect width="40" height="160" fill="#9D0208"/><rect x="360" width="40" height="160" fill="#9D0208"/><path d="M0 0h400v18c-30 12-60 12-100 0s-70-12-100 0-70 12-100 0-70-12-100 0z" fill="#9D0208"/>`],
 estadio:['#7EC8E3','#C8E9F5',`<rect y="120" width="400" height="80" fill="#4CAF50"/><path d="M0 160h400" stroke="#fff" stroke-width="3"/><circle cx="200" cy="160" r="26" stroke="#fff" stroke-width="3" fill="none"/><rect y="70" width="400" height="50" fill="#5C6B73"/><g fill="#E63946"><circle cx="20" cy="86" r="4"/><circle cx="60" cy="96" r="4"/><circle cx="120" cy="84" r="4"/><circle cx="260" cy="92" r="4"/><circle cx="340" cy="86" r="4"/></g><g fill="#FFD166"><circle cx="40" cy="104" r="4"/><circle cx="90" cy="88" r="4"/><circle cx="180" cy="100" r="4"/><circle cx="300" cy="104" r="4"/><circle cx="380" cy="98" r="4"/></g>`],
 zumbi:['#5B6B3A','#8C8F5A',`<rect y="150" width="400" height="50" fill="#4A4A3A"/><g fill="#2F3324"><path d="M10 150V70h40v20h10v60z"/><path d="M90 150V40h50v40l-10 10v60z"/><path d="M290 150V60h30l10 20h30v70z"/></g><g fill="#A3B18A" opacity=".5"><rect x="100" y="54" width="10" height="12"/><rect x="300" y="74" width="8" height="10"/></g><path d="M200 150l20-30 10 30z" fill="#3D3D2E"/>`],
 ilha:['#7FD3F5','#C9F0FF',`<rect y="120" width="400" height="40" fill="#2EC4B6"/><path d="M0 132c30-6 60 6 90 0s60-6 90 0 60 6 90 0 60-6 130 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/><rect y="156" width="400" height="44" fill="#F4E1B5"/><g transform="translate(320 156)"><path d="M0 0c-4-40 4-70 10-90" stroke="#8D6346" stroke-width="8" fill="none"/><g fill="#2D6A4F"><path d="M10-90c-30-10-50 0-56 10 20-6 40-4 56-10z"/><path d="M10-90c30-10 50 0 56 10-20-6-40-4-56-10z"/><path d="M10-90c-10-24-30-30-40-30 14 8 30 20 40 30z"/></g></g><circle cx="80" cy="44" r="22" fill="#FFE066"/>`],
 fantasia:['#C3B1E1','#F3E8FF',`<rect y="150" width="400" height="50" fill="#8FBC8F"/><g fill="#9D8CBF"><rect x="250" y="60" width="110" height="90"/><rect x="240" y="40" width="26" height="110"/><rect x="344" y="40" width="26" height="110"/><path d="M240 40l13-24 13 24zM344 40l13-24 13 24z" fill="#6A4C93"/><rect x="290" y="100" width="30" height="50" rx="15" fill="#4B3869"/></g><g fill="#FFD6FF"><circle cx="60" cy="40" r="3"/><circle cx="120" cy="70" r="2"/><circle cx="180" cy="30" r="2.5"/></g><path d="M40 150c0-40 30-60 30-60s30 20 30 60z" fill="#6BA368"/>`],
 marte:['#E07A5F','#F2CC8F',`<rect y="150" width="400" height="50" fill="#B5543A"/><path d="M0 150c40-30 80-30 120 0s80-40 140-10 100 10 140 0v10H0z" fill="#C4683E"/><circle cx="330" cy="40" r="10" fill="#FFF3E0"/><g transform="translate(60 100)"><path d="M0 50a40 40 0 0 1 80 0z" fill="#E8EEF2" stroke="#9AA5B1" stroke-width="3"/><rect x="30" y="34" width="20" height="16" fill="#8ECAE6"/></g>`],
 cemiterio:['#5C677D','#8D99AE',`<rect y="150" width="400" height="50" fill="#4F5D4A"/><g fill="#C9CED6"><path d="M60 150v-40a20 20 0 0 1 40 0v40z"/><path d="M300 150v-34a16 16 0 0 1 32 0v34z"/><rect x="200" y="96" width="8" height="54"/><rect x="186" y="110" width="36" height="8"/></g>`],
 casa:['#FFE8D6','#FCD5CE',`<rect y="152" width="400" height="48" fill="#C8A27C"/><rect x="40" y="40" width="80" height="60" rx="4" fill="#BDE0FE" stroke="#fff" stroke-width="5"/><g transform="translate(250 100)"><rect width="130" height="34" rx="12" fill="#6D597A"/><rect y="-22" width="130" height="30" rx="12" fill="#B56576"/><rect x="-8" y="-4" width="20" height="38" rx="8" fill="#6D597A"/><rect x="118" y="-4" width="20" height="38" rx="8" fill="#6D597A"/></g><g transform="translate(190 112)"><rect width="16" height="40" fill="#E07A5F"/><circle cx="8" cy="-8" r="16" fill="#52B788"/></g>`]
};
V3_CENAS.casa[2]=V3_CENAS.casa[2];
function cenaSVG(id){ const c=V3_CENAS[id]||V3_CENAS.cidade; return `<svg class="cena3" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="cg3${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect width="400" height="200" fill="url(#cg3${id})"/>${c[2]}</svg>`; }

// ---------- palco ----------
function v3Lobo(m){ if(m.criatura!=='lobisomem') return false; if((m.fomeP||0)>=80) return true; const y=S.log[S.log.length-1]; return !!y&&y.lines.some(l=>/lua cheia|transform/i.test(typeof l==='string'?l:l.t)); }
function v3Familia(m){ if(S.scen) return []; const ord={conjuge:0,noivo:1,namoro:2,filho:3,adot:3,mae:4,pai:4,irmao:5,avo:6,neto:7,pet:8};
  return S.people.filter(p=>p.alive&&ord[p.rel]!=null).sort((a,b)=>ord[a.rel]-ord[b.rel]||(b.bond||0)-(a.bond||0)).slice(0,7); }
const V3_ANT={vals:null,money:null,age:null,cena:null,figKey:null};
function v3Aneis(){
  const box=$('#aneis'); if(!box) return; const sts=[...$('#stats').querySelectorAll('.st')];
  const dados=sts.map(st=>{ const e=st.querySelector('.se')?.textContent||'', l=st.querySelector('b')?.textContent||'', sp=st.querySelectorAll('span'), v=parseInt(sp[sp.length-1]?.textContent)||0, bg=st.querySelector('.bar i')?.getAttribute('style')||''; const cor=(bg.match(/#[0-9A-Fa-f]{6}/)||[])[0]||(bg.match(/var\(--[a-z]+\)/)||[])[0]; return {e,l,v,cor:cor||'#3BB273'}; });
  const assin=dados.map(d=>d.l).join('|');
  if(box.dataset.assin!==assin){ box.dataset.assin=assin; box.style.gridTemplateColumns=`repeat(${dados.length},minmax(0,1fr))`; box.innerHTML=dados.map((d,i)=>`<div class="anel" data-i="${i}" title="${esc(d.l)}"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" class="an-fundo"/><circle cx="22" cy="22" r="18" class="an-valor" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg><span class="an-e">${d.e}</span><b class="an-v">0</b><small>${esc(d.l)}</small></div>`).join(''); box.offsetWidth; }
  const ant=V3_ANT.vals&&V3_ANT.assin===assin?V3_ANT.vals:null;
  dados.forEach((d,i)=>{ const el=box.children[i]; if(!el) return; const c=el.querySelector('.an-valor'); c.style.strokeDashoffset=String(100-d.v); c.style.stroke=d.cor;
   el.querySelector('.an-v').textContent=d.v; el.classList.toggle('baixo',d.v<25);
   if(ant&&ant[i]!=null&&ant[i]!==d.v) v3Flutua(el,d.v-ant[i],d.e); });
  V3_ANT.vals=dados.map(d=>d.v); V3_ANT.assin=assin;
}
function v3Flutua(el,dv,e){ if(!el||!dv) return; const r=el.getBoundingClientRect(); if(!r.width) return; const f=document.createElement('div'); f.className='flut '+(dv>0?'sobe':'desce'); f.textContent=(dv>0?'+':'')+dv+(e?' '+e:'');
  f.style.left=(r.left+r.width/2)+'px'; f.style.top=(r.top+4)+'px'; document.body.appendChild(f); el.classList.remove('pulsa'); el.offsetWidth; el.classList.add('pulsa'); setTimeout(()=>f.remove(),1500); }
function v3Dinheiro(m){ const el=$('#hMoney'); if(!el) return; const novo=m.money, velho=V3_ANT.money;
  if(velho==null||velho===novo||V3_REDUZ()||S.scen){ V3_ANT.money=novo; return; }
  V3_ANT.money=novo; const t0=performance.now(), dur=650, txt=el.textContent;
  const passo=t=>{ const k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,3); el.textContent=fmt(Math.round(velho+(novo-velho)*e)); if(k<1) requestAnimationFrame(passo); else el.textContent=txt; };
  requestAnimationFrame(passo); el.classList.remove('ganhou','perdeu'); el.offsetWidth; el.classList.add(novo>velho?'ganhou':'perdeu'); }
function v3Palco(){
  const m=S&&S.me, pal=$('#palco'); if(!pal||!m) return;
  const cena=v3Cena(m); if(V3_ANT.cena!==cena){ $('#cena').innerHTML=cenaSVG(cena); V3_ANT.cena=cena; pal.dataset.cena=cena; }
  const lobo=v3Lobo(m), html=bustoSVG(m,{lobo,cls:'fig3'});
  if(V3_ANT.figKey!==html){ const fig=$('#fig'); const trocou=V3_ANT.figKey!=null; fig.innerHTML=html; V3_ANT.figKey=html; if(trocou&&!V3_REDUZ()){ fig.classList.remove('troca'); fig.offsetWidth; fig.classList.add('troca'); } }
  $('#fig').classList.toggle('feliz',m.happy>=70); $('#fig').classList.toggle('triste',m.happy<30); $('#fig').classList.toggle('doente',m.health<30);
  const fam=v3Familia(m), fb=$('#familia3');
  const fk=fam.map(p=>p.id+':'+p.age+':'+(p.bond|0)).join(',');
  if(fb.dataset.k!==fk){ fb.dataset.k=fk; fb.innerHTML=fam.map(p=>`<button class="fam3" data-p="${p.id}" title="${esc(p.first+' · '+relLabel(p))}">${faceSVG(p,34)}</button>`).join(''); }
  v3Aneis();
}

// ---------- render: palco, linha do tempo, dinheiro e animações ----------
render=(orig=>function(){
  const r=orig.apply(this,arguments);
  try{ if(!S||!S.me) return r; const m=S.me;
   v3Palco(); v3Dinheiro(m);
   const lg=$('#log'), secs=lg.querySelectorAll('.yr');
   secs.forEach((s,i)=>{ if(s.dataset.v3) return; s.dataset.v3=1; const y=S.scen?null:S.log[i]; if(y){ s.dataset.age=y.age; s.querySelectorAll('p').forEach(p=>{ if(p.classList.contains('choice')) return; const t=p.textContent; if(/morreu|faleceu|morte/i.test(t)) p.classList.add('luto'); else if(/nasceu|nascimento/i.test(t)) p.classList.add('nasce'); }); } });
   const n=S.scen?(S.scen.log||[]).length:S.log.length, ult=secs[secs.length-1];
   if(ult&&V3_ANT.nLog!=null&&n>V3_ANT.nLog&&!V3_REDUZ()) ult.classList.add('novo');
   if(ult&&V3_ANT.nLog===n&&V3_ANT.nLin!=null){ const ps=ult.querySelectorAll('p'); for(let i=V3_ANT.nLin;i<ps.length;i++) ps[i].classList.add('linNova'); }
   V3_ANT.nLog=n; V3_ANT.nLin=ult?ult.querySelectorAll('p').length:0;
   if(V3_ANT.age!=null&&m.age>V3_ANT.age&&m.alive&&!S.scen) v3Aniversario(m.age);
   V3_ANT.age=m.age;
  }catch(e){ console.error(e); }
  return r; })(render);

function v3Aniversario(age){ vibrar([18,40,18]); if(V3_REDUZ()) return;
  const b=document.createElement('div'); b.className='niver3'; b.innerHTML=`<div class="nv-in"><span class="nv-bolo">${age<1?'👶':age===18?'🎉':age%10===0?'🎊':'🎂'}</span><b>${age} ${age===1?'ano':'anos'}</b></div>`;
  document.body.appendChild(b); const cores=['#F0567A','#FF9F1C','#FFD23F','#22C3A6','#2E86FF','#9B5DE5'];
  for(let i=0;i<26;i++){ const c=document.createElement('i'); c.style.setProperty('--x',(Math.random()*2-1)*46+'vw'); c.style.setProperty('--y',(-20-Math.random()*45)+'vh'); c.style.setProperty('--r',(Math.random()*720-360)+'deg'); c.style.background=cores[i%6]; c.style.animationDelay=(Math.random()*.15)+'s'; b.appendChild(c); }
  setTimeout(()=>b.classList.add('sai'),900); setTimeout(()=>b.remove(),1500); }

// ---------- eventos em cartões ----------
pump=function(){
  if(modalOpen) return;
  let o=MQ.shift(), quem=null;
  while(!o&&S&&S.me.alive&&S.pending.length&&!evValid(S.pending[0])) S.pending.shift();
  if(!o&&S&&S.me.alive&&S.pending.length){
    const e=S.pending[0],ev=EVENTS[e.id];
    let sh; try{ sh=ev.show(e.d); }catch(err){ S.pending.shift(); showErr(err); return pump(); }
    const who=['pid','p','s','b','k'].map(k=>typeof e.d[k]==='number'?P(e.d[k]):null).find(Boolean);
    const sf=!who&&e.d.n&&String(sh.x).includes(e.d.n)?strangerFace(e.d):null;
    const cf=!who&&!sf&&e.d.cid&&typeof crewFace==='function'?crewFace(e.d.cid):null;
    quem=who||sf;
    o={k:sh.k,t:sh.t,x:sh.x,quem,top:cf,ch:sh.ch.map(([l,key])=>({l,fn:()=>{
      S.pending.shift(); let res; try{ res=ev.pick(key,e.d); }catch(err){ showErr(err); }
      log(sh.t.replace(/[!?.…]+$/,'')+' → '+l+(res?'. '+res:'.'),'choice'); if(res) MQ.unshift({k:sh.k,t:sh.t,x:res,res:true});
    }}))};
  }
  if(!o){ if(S&&!S.me.alive&&$('#death').hidden) showDeath(); return; }
  modalOpen=true;
  const ch=o.ch||[{l:'OK'}], cor=temaCor(o.k), emo=o.k&&KICK_EMOJI[o.k];
  const me=S&&S.me, mostraEu=!o.quem&&!o.top&&me&&o.k&&/Lobisomem|Vampir|Visual|Saúde|Formatura|Casamento|Fama|Prisão/.test(o.k+' '+(o.t||''));
  let arte='';
  if(o.top&&!o.quem) arte=`<div class="ev-retrato">${o.top}</div>`;
  else if(o.quem&&o.quem.genes) arte=`<div class="ev-retrato busto">${bustoSVG(o.quem,{expr:o.res?undefined:null})}</div>`;
  else if(o.quem) arte=`<div class="ev-retrato">${faceSVG(o.quem,96)}</div>`;
  else if(mostraEu) arte=`<div class="ev-retrato busto">${bustoSVG(me,{lobo:/Lobisomem|lua cheia/i.test(o.k+' '+o.t+' '+o.x)&&me.criatura==='lobisomem'})}</div>`;
  else if(emo) arte=`<div class="ev-icone"><span>${emo}</span></div>`;
  $('#modal').style.setProperty('--tema',cor);
  $('#modal').className='modal ev3'+(o.res?' res':'')+(arte?'':' semarte');
  $('#modal').innerHTML=`<div class="ev-topo">${arte}${o.k?`<div class="kick">${emo?emo+' ':''}${esc(o.k)}</div>`:''}</div><div class="ev-corpo"><h2>${esc(o.t||'')}</h2>${o.x?`<div class="txt">${esc(o.x)}</div>`:''}${o.html||''}<div class="choices">${ch.map((c,i)=>`<button class="btn ${c.cls||(i?'alt':'')}" data-c="${i}" style="--d:${i}">${esc(c.l)}</button>`).join('')}</div></div>`;
  $('#modalWrap').hidden=false;
  $('#modal').onclick=ev=>{ const b=ev.target.closest('[data-c]'); if(!b) return; const c=ch[+b.dataset.c]; vibrar(12);
    const fecha=()=>{ $('#modalWrap').hidden=true; modalOpen=false; if(c.fn) c.fn(); after(); };
    if(V3_REDUZ()) return fecha(); b.classList.add('escolhido'); $('#modal').classList.add('saindo'); setTimeout(fecha,170); };
  const first=$('#modal').querySelector('button'); if(first) first.focus({preventScroll:true});
};

// ---------- painéis com entrada suave ----------
UI.draw=(o=>function(){ const r=o.apply(this,arguments); try{ const b=$('#sheetBody'); if(!V3_REDUZ()){ b.classList.remove('entra'); b.offsetWidth; b.classList.add('entra'); clearTimeout(UI._entra); UI._entra=setTimeout(()=>b.classList.remove('entra'),700); } }catch(e){} return r; })(UI.draw);

// ---------- pessoa: retrato de corpo inteiro ----------
V.person=(o=>p=>{ const r=o(p); try{ if(r&&r.items&&r.items[0]&&r.items[0].html&&p.genes&&p.rel!=='pet'){ r.items[0].html=r.items[0].html.replace(/<img class="face face3"[^>]*>/,`<span class="pessoa3">${bustoSVG(p,{cls:'fig3 mini',trabalho:true})}</span>`); } }catch(e){} return r; })(V.person);

// ---------- menu do personagem: o único lugar com o corpo inteiro ----------
V.me=(o=>function(){ const r=o.apply(this,arguments); try{ const m=S.me; if(r&&r.items&&r.items[0]&&r.items[0].html) r.items[0].html=r.items[0].html.replace(/<img class="face face3"[^>]*>/,`<span class="eu3">${figuraSVG(m,{cls:'fig3 grande',lobo:v3Lobo(m)})}</span>`); }catch(e){} return r; })(V.me);

// ---------- tela inicial: um elenco de corpo inteiro ----------
startHero=function(){ const gente=[{a:8,g:'F'},{a:24,g:'M'},{a:34,g:'F'},{a:17,g:'M'},{a:68,g:'F'}].map((x,i)=>({id:i*11+5,gender:x.g,age:x.a,bond:90,genes:randGenes(x.g)}));
  const bolhas=[0,1,2,3,4,5,6,7,8].map(i=>`<i style="--i:${i}"></i>`).join('');
  return `<div class="hero3"><div class="hero3-bolhas" aria-hidden="true">${bolhas}</div><div class="hero3-marca"><svg viewBox="0 0 100 100" aria-hidden="true">${marca3SVG()}</svg></div><div class="logo">New<em>Life</em></div><p class="tag">Cada vida, uma nova história.</p><div class="hero3-gente">${gente.map((p,i)=>`<span style="--i:${i}">${faceSVG(p,64)}</span>`).join('')}</div></div>`; };
showStart=(o=>function(t){ const r=o.apply(this,arguments); try{ const c=document.querySelector('#stCont .home-icon'); if(c&&S&&S.me) c.innerHTML=faceSVG(S.me,46); }catch(e){} return r; })(showStart);

// ---------- montagem da tela ----------
(function(){
  const pal=document.getElementById('palco'); if(!pal) return;
  pal.addEventListener('click',e=>{ const f=e.target.closest('.fam3'); if(f){ const p=P(+f.dataset.p); if(p) UI.open(()=>V.person(p)); return; }
   if(e.target.closest('#fig')){ if(S&&S.me&&!S.scen) UI.open(V.me); return; }
   if(e.target.closest('#aneis')){ pal.classList.toggle('compacto'); try{ localStorage.setItem('nl3_compacto',pal.classList.contains('compacto')?'1':'0'); }catch(x){} } });
  try{ if(localStorage.getItem('nl3_compacto')==='1') pal.classList.add('compacto'); }catch(x){}
  document.addEventListener('click',e=>{ const b=e.target.closest('#nav button,.row,.btn,.chip'); if(b) vibrar(8); },true);
})();
