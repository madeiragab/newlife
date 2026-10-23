// ===== Conteúdo que fica de fora só na versão Roblox =====
// As regras do Roblox proíbem conteúdo sexual (ainda mais com menores), drogas ilícitas, tabaco,
// apostas, suicídio e assassinato detalhado. O jogo do site e dos apps continua igual:
// estes cortes valem apenas para o que o conversor manda para roblox/.
// Um evento sai inteiro se o título, o texto ou qualquer escolha bater numa destas expressões
// (sem diferenciar maiúsculas nem acentos) ou se usar um dos efeitos proibidos.

const PALAVRAS = [
  // drogas
  'droga', 'maconha', 'baseado', 'cocain', 'crack', 'heroina', 'ecstasy', 'lsd', 'traficante', 'trafico', 'trafica',
  'boca de fumo', 'cheirar', 'chapad', 'metanfetamina', 'anfetamina', 'overdose', 'seringa', 'entorpecente', 'cogumelo',
  'lanca-perfume', 'aviaozinho',
  // tabaco
  'cigarro', 'fumar', 'fumei', 'fumou', 'vape', 'narguil', 'tabaco', 'charuto',
  // sexo e gravidez
  'sexo', 'sexual', 'transar', 'transa ', 'transou', 'transamos', 'motel', 'camisinha', 'preservativo', 'gravid', 'gravida',
  'aborto', 'nude', 'pelad', 'sensual', 'strip', 'prostitu', 'garota de programa', 'garoto de programa', 'amante', 'porno',
  'erotic', 'excitad', 'tesao', 'foi alem', 'ir alem', 'noite juntos', 'dormimos juntos', 'dormir juntos',
  'pegacao', 'cama com', 'lingerie', 'calcinha', 'cueca', 'seios', 'assedi', 'abuso', 'estupr',
  'traicao', 'trair', 'traiu', 'trai ', 'caso extraconjugal', 'pular a cerca', 'casamento aberto', 'swing', 'beijo de lingua',
  // assassinato, armas e violência pesada
  'assassin', 'matar', 'matei', 'mataram', 'matou', 'matador', 'homicid', 'envenen', 'estrangul', 'esfaque', 'degol',
  'decapit', 'cadaver', 'sumir com o corpo', 'tortur', 'atirar', 'atirei', 'atirou', 'tiroteio', 'revolver',
  'pistola', 'fuzil', 'arma de fogo', 'sequestr', 'linchar', 'massacre', 'bomba', 'terroris', 'facada',
  // suicídio e automutilação
  'suicid', 'se matar', 'automutil', 'pulsos', 'tirar a propria vida',
  // apostas
  'cassino', 'aposta', 'apostar', 'apostei', 'roleta', 'caca-niquel', 'caça-níquel', 'bingo', 'loteria', 'jogo do bicho',
  // xingamentos
  'porra', 'caralho', 'merda', ' puta ', 'foder', 'fodeu', 'buceta', 'viado', 'arrombad',
];

// efeitos do formato dos eventos que puxam conteúdo proibido
const EFEITOS = [
  /^kill$/, /^add\.cigarro/, /^add\.jogo/, /^armas[+-]/, /^dis:(hiv|sifilis|gonorreia|herpes|hpv|clamidia|ist)/,
];

const tira = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const PALAVRAS_N = PALAVRAS.map(tira);

function textoProibido(s) {
  const t = ' ' + tira(s) + ' ';
  return PALAVRAS_N.find(p => t.includes(p)) || null;
}

function efeitoProibido(tok) {
  return EFEITOS.some(r => r.test(tok)) ? tok : null;
}

module.exports = { textoProibido, efeitoProibido };
