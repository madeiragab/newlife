-- ===== Política: movimento clandestino, golpe de Estado e o país depois do golpe =====
-- Porta de src/golpe.js (movimento), src/ajustes_209.js (a noite do golpe), src/ajustes_210.js (regime) e
-- src/ajustes_210b.js (caminhos, refundar o país e sucessão). No Roblox ainda não há prisão nem continuar
-- como herdeiro: quem perde vai para o exílio ou sai por anistia, e a sucessão fica registrada no diário.
-- Os textos evitam as palavras de tools/cortes.cjs.

local Util = require(script and script.Parent:WaitForChild("Util") or "./Util")
local R, clamp, fmt = Util.R, Util.clamp, Util.fmt

local Politica = {}

local function oa(m)
	return m.gender == "F" and "a" or "o"
end

local function used(game, key: string): number
	local yr = game.S.me.yr
	yr[key] = (yr[key] or 0) + 1
	return yr[key]
end

local function fix(t, keys)
	for _, k in keys do
		t[k] = clamp(t[k])
	end
	return t
end

local function paisNome(game): string
	local m = game.S.me
	return m.c.paisNome or game.countryOf(m.country).n
end

-- "de Portugal", "do Brasil", "da Alemanha", "dos Estados Unidos"
local PREP_PAIS = {
	Brasil = "do", ["Estados Unidos"] = "dos", ["México"] = "do", ["Japão"] = "do", ["Canadá"] = "do", ["Reino Unido"] = "do",
	["Itália"] = "da", ["França"] = "da", Alemanha = "da", Argentina = "da", Espanha = "da", ["Índia"] = "da", ["Coreia do Sul"] = "da",
}
local function doPais(n: string): string
	return (PREP_PAIS[n] or "de") .. " " .. n
end

---------------------------------------------------------------------------
-- movimento clandestino
---------------------------------------------------------------------------
Politica.REV_NOMES = { "Frente de Libertação Nacional", "Movimento Aurora", "Aliança do Povo", "Vanguarda Popular", "Movimento Nova Pátria" }

local function revFix(r)
	fix(r, { "apoio", "mil", "equip", "susp" })
	r.membros = math.max(1, Util.round(r.membros))
	return r
end

function Politica.revChance(r): number
	return math.clamp(r.apoio / 250 + r.mil / 160 + r.equip / 300 + (r.membros > 500 and 0.08 or 0) - 0.1, 0.03, 0.9)
end

---------------------------------------------------------------------------
-- regime
---------------------------------------------------------------------------
Politica.CAMINHOS = {
	militar = { n = "Junta Militar", tit = { "General-presidente", "Generala-presidente" }, ic = "🎖️" },
	monarquia = { n = "Reino", tit = { "Rei", "Rainha" }, ic = "👑" },
	popular = { n = "República Popular", tit = { "Comandante", "Comandante" }, ic = "✊" },
	teocracia = { n = "República Sagrada", tit = { "Guia supremo", "Guia suprema" }, ic = "⛪" },
	transicao = { n = "Governo de Transição", tit = { "Presidente interino", "Presidenta interina" }, ic = "🗳️" },
}
local CAMINHOS = Politica.CAMINHOS

local function regime(m)
	local o = m.office
	if not o or not o.dit then
		return nil
	end
	o.reg = o.reg or { n = "Regime do " .. (m.c.golpeMov or "Movimento"), medo = 40, leal = 55, pres = 30, estatuas = 0, eleicoes = 0, anos = 0 }
	return o.reg
end
Politica.regime = regime

local function regFix(r)
	return fix(r, { "medo", "leal", "pres" })
end

-- salário de quem deu o golpe (ajustes_211.js): começa no dobro do de presidente e vai até 20x;
-- quanto maior o salário e os saques, maior a chance de uma investigação internacional
Politica.SAL_PRES = 500000
Politica.SAL_MULTS = { 1, 2, 5, 10, 20 }
local function salMult(r): number
	return r.salMult or 2
end
function Politica.risco(r): number
	return math.min(0.6, (salMult(r) - 1) * 0.03 + (r.saques or 0) * 0.04)
end

-- título no topo da tela (View.occupation)
function Politica.titulo(game): string?
	local m = game.S.me
	local r = m.alive and regime(m)
	if not r then
		return nil
	end
	local c = CAMINHOS[r.tipo]
	if c then
		return c.tit[m.gender == "F" and 2 or 1]
	end
	return m.gender == "F" and "Líder suprema" or "Líder supremo"
end

-- nomes que o país pode ganhar
function Politica.nomesPais(game)
	local m = game.S.me
	local p = game.countryOf(m.country).n
	return { "Nova " .. p, "Grande " .. p, m.last .. "lândia", "Terra de " .. m.first, "Pátria Livre" }
end

local function sairDoPoder(game)
	game.S.me.office = nil
end

local function exilio(game): string
	local m = game.S.me
	local r = regime(m)
	sairDoPoder(game)
	m.c.exilio = 1
	m.money = Util.round(m.money * 0.8)
	game:log(string.format("Fugi para o exílio. O %s caiu sem mim.", r and r.n or "regime"), "warn")
	return "Um avião particular, malas cheias de dinheiro e um país inteiro comemorando a minha partida."
end

---------------------------------------------------------------------------
-- ações (Actions.list e Actions.run usam estas)
---------------------------------------------------------------------------
local RUN = {}
Politica.RUN = RUN
Politica.TITLE = {}

-- movimento
function RUN.rev_fundar(game, i)
	local m = game.S.me
	local nome = Politica.REV_NOMES[i] or Politica.REV_NOMES[1]
	m.rev = { n = nome, apoio = R.int(2, 6), mil = 0, equip = 0, susp = 5, membros = R.int(3, 8), anos = 0 }
	m.c.rev = 1
	game:log(string.format("Fundei em segredo o movimento %s. O objetivo: derrubar o governo.", nome), "warn")
	return string.format("O %s nasceu num porão, com %d pessoas e uma impressora velha.", nome, m.rev.membros)
end

local function revAcao(game, k: string): string
	local m = game.S.me
	local r = m.rev
	if used(game, "rev_" .. k) > 2 then
		return "Já fiz muito disso este ano. Chamar atenção demais é perigoso."
	end
	local t = ""
	if k == "panfleto" then
		r.apoio += R.int(2, 6) + Util.round((m.fame or 0) / 20)
		r.membros += R.int(5, 30)
		r.susp += R.int(3, 7)
		t = string.format("Panfletos na madrugada, pichações nos viadutos. O apoio subiu para %d%%.", clamp(r.apoio))
	elseif k == "protesto" then
		if R.chance(0.25) then
			r.susp += 12
			r.membros = Util.round(r.membros * 0.85)
			game:st("health", -R.int(5, 15))
			t = "A polícia dispersou o protesto com gás. Vários companheiros foram detidos."
		else
			r.apoio += R.int(6, 12)
			r.membros += R.int(30, 200)
			r.susp += 8
			m.fame = clamp((m.fame or 0) + 3)
			t = "Milhares nas ruas gritando o nosso lema. A TV não teve como ignorar."
		end
	elseif k == "hacker" then
		if R.chance(0.5 + m.smarts / 300) then
			r.apoio += R.int(5, 10)
			r.susp += 4
			t = "Invadimos o sinal da TV estatal e passamos nosso manifesto no horário nobre."
		else
			r.susp += 12
			t = "A invasão falhou e deixou rastros."
		end
	elseif k == "equipar" then
		local c = 30000
		if m.money < c then
			return "Equipar o movimento custa " .. fmt(c) .. "."
		end
		m.money -= c
		r.equip += R.int(12, 20)
		r.susp += 6
		m.karma = clamp(m.karma - 4)
		t = "Um contrabandista entregou caixas de equipamento num galpão do porto."
	elseif k == "general" then
		local c = 80000
		if m.money < c then
			return "Convencer um general custa pelo menos " .. fmt(c) .. "."
		end
		m.money -= c
		if R.chance(0.55 + m.smarts / 400) then
			r.mil += R.int(15, 25)
			t = "Um general aceitou o dinheiro e prometeu que os quartéis não vão reagir."
		else
			r.susp += 20
			t = "O general aceitou o dinheiro e me denunciou."
		end
	elseif k == "sumir" then
		r.susp -= R.int(10, 18)
		t = "Mandei o movimento hibernar. Sem reuniões, sem panfletos, sem celulares."
	end
	revFix(r)
	return t
end
for _, k in { "panfleto", "protesto", "hacker", "equipar", "general", "sumir" } do
	RUN["rev_" .. k] = function(game)
		return revAcao(game, k)
	end
end

function RUN.rev_abandonar(game)
	game.S.me.rev = nil
	return "Queimei os papéis e voltei para a vida normal. Torço para ninguém lembrar de mim."
end

-- "Dar o golpe" abre a noite do golpe (três eventos seguidos)
function RUN.rev_golpe(game)
	game:queue("golpe_etapa", { i = 1, b = 0, rel = {} })
	return nil
end

-- regime: culto à personalidade, mão de ferro, dinheiro e poder
local function regAcao(game, k: string): string
	local m = game.S.me
	local o, r = m.office, regime(m)
	if used(game, "reg_" .. k) > 2 then
		return "Já fiz muito disso este ano."
	end
	if k == "propaganda" then
		o.appr = clamp(o.appr + R.int(4, 10))
		r.pres += 2
		regFix(r)
		return R.pick({ "Meu rosto agora aparece antes de todo programa de TV.", "Cartazes com o meu sorriso cobriram as fachadas da capital.", "As escolas passaram a cantar um hino em minha homenagem." })
	elseif k == "estatua" then
		local c = 500000
		if m.money < c then
			return "Uma estátua de bronze custa " .. fmt(c) .. "."
		end
		m.money -= c
		r.estatuas += 1
		m.fame = clamp((m.fame or 0) + 6)
		o.appr = clamp(o.appr + R.int(-4, 6))
		if r.estatuas == 1 then
			return "Inaugurei uma estátua de dez metros de mim mesm" .. oa(m) .. " na praça central."
		end
		return string.format("Já são %d estátuas minhas espalhadas pelo país.", r.estatuas)
	elseif k == "desfile" then
		r.leal += R.int(5, 10)
		r.medo += R.int(3, 6)
		r.pres += 3
		regFix(r)
		return "Tanques, aviões e soldados marchando em frente ao palanque. Bati continência por três horas."
	elseif k == "policia" then
		r.medo += R.int(8, 14)
		o.appr = clamp(o.appr - R.int(3, 8))
		m.karma = clamp(m.karma - 12)
		r.pres += 4
		regFix(r)
		return R.pick({ "A polícia secreta deteve jornalistas e professores durante a madrugada.", "Ninguém mais fala de política nos bares. Nunca se sabe quem está ouvindo." })
	elseif k == "censura" then
		r.medo += R.int(5, 9)
		r.pres += 6
		o.appr = clamp(o.appr - R.int(0, 4))
		regFix(r)
		return "Fechei os jornais da oposição e bloqueei as redes sociais estrangeiras."
	elseif k == "eleicao" then
		r.eleicoes += 1
		r.pres += R.int(8, 14)
		o.appr = clamp(o.appr + R.int(-2, 4))
		regFix(r)
		return string.format('Eleição "livre": venci com %d,%d%% dos votos. Os observadores internacionais não foram convidados.', R.int(96, 99), R.int(1, 9))
	elseif k == "expurgo" then
		r.leal += R.int(6, 12)
		r.medo += R.int(6, 10)
		m.karma = clamp(m.karma - 15)
		regFix(r)
		return "Afastei metade dos ministros. Os que ficaram juram lealdade eterna."
	elseif k == "saquear" then
		local cofre = 400000 * R.int(20, 60)
		m.money += cofre
		o.appr = clamp(o.appr - R.int(4, 10))
		r.leal -= R.int(3, 8)
		m.karma = clamp(m.karma - 10)
		r.saques = (r.saques or 0) + 1
		regFix(r)
		return "Transferi " .. fmt(cofre) .. " do tesouro nacional para uma conta na Suíça."
	elseif k == "generais" then
		local c = math.min(m.money, 800000)
		if c < 100000 then
			return "Os generais querem pelo menos " .. fmt(100000) .. "."
		end
		m.money -= c
		r.leal += Util.round(c / 40000)
		regFix(r)
		return "Distribuí " .. fmt(c) .. " entre os generais. Os quartéis estão felizes."
	elseif k == "nacionalizar" then
		o.appr = clamp(o.appr + R.int(6, 12))
		r.pres += R.int(10, 16)
		regFix(r)
		return "Nacionalizei as empresas estrangeiras. O povo comemorou; as embaixadas, não."
	end
	return ""
end
Politica.REG = { "propaganda", "estatua", "desfile", "policia", "censura", "eleicao", "expurgo", "saquear", "generais", "nacionalizar" }
for _, k in Politica.REG do
	RUN["reg_" .. k] = function(game)
		return regAcao(game, k)
	end
end
RUN.reg_exilio = exilio

-- ações próprias de cada caminho: { id, ícone, nome, resumo, aviso (pede confirmação) }
Politica.ACOES_CAMINHO = {
	militar = {
		{ "leimarcial", "🪖", "Decretar lei marcial", "Medo e lealdade", "Toque de recolher e soldados nas ruas. O povo não vai gostar." },
		{ "servico", "🎽", "Serviço militar obrigatório", "Lealdade · aprovação cai" },
	},
	monarquia = {
		{ "baile", "💃", "Grande baile real", "Fama e aprovação" },
		{ "coroa", "💎", "Encomendar as joias da coroa", fmt(2000000) .. " · fama" },
		{ "titulos", "🏰", "Dar títulos de nobreza aos aliados", "Lealdade" },
	},
	popular = {
		{ "reforma", "🌾", "Reforma agrária", "Aprovação · sanções" },
		{ "alfabetizar", "📚", "Campanha de alfabetização", "Aprovação e carma" },
		{ "milicia", "🛡️", "Milícias populares", "Medo e lealdade" },
	},
	teocracia = {
		{ "leireligiosa", "📜", "Impor a lei religiosa", "Medo · aprovação divide", "A partir de hoje, quem desobedecer responde ao tribunal religioso." },
		{ "templo", "🛕", "Construir um grande templo", fmt(1500000) .. " · aprovação" },
		{ "peregrinacao", "🙏", "Liderar uma peregrinação", "Fama e aprovação" },
	},
	transicao = {
		{ "debate", "🎙️", "Debater com a oposição", "Aprovação" },
		{ "imprensa", "📰", "Liberar a imprensa", "Pressão internacional cai" },
	},
}

local function caminhoAcao(game, k: string): string
	local m = game.S.me
	local o, r = m.office, regime(m)
	if used(game, "cam_" .. k) > 2 then
		return "Já fiz muito disso este ano."
	end
	if k == "leimarcial" then
		r.medo += R.int(10, 15)
		r.leal += R.int(4, 8)
		o.appr = clamp(o.appr - R.int(5, 10))
		regFix(r)
		return "Toque de recolher às 20h e tanques em cada esquina. A capital ficou em silêncio."
	elseif k == "servico" then
		r.leal += R.int(5, 10)
		o.appr = clamp(o.appr - R.int(2, 6))
		regFix(r)
		return "Todo jovem de 18 anos agora serve dois anos no exército."
	elseif k == "baile" then
		o.appr = clamp(o.appr + R.int(2, 6))
		m.fame = clamp((m.fame or 0) + 5)
		return "Lustres de cristal, valsa e a elite inteira beijando a minha mão."
	elseif k == "coroa" then
		local c = 2000000
		if m.money < c then
			return "As joias custam " .. fmt(c) .. "."
		end
		m.money -= c
		m.fame = clamp((m.fame or 0) + 10)
		r.joias = 1
		return "Uma coroa de ouro com 400 pedras preciosas. Vai passar de geração em geração."
	elseif k == "titulos" then
		r.leal += R.int(6, 12)
		regFix(r)
		return "Nomeei duques, condes e barões. Os generais agora são nobres da minha corte."
	elseif k == "reforma" then
		o.appr = clamp(o.appr + R.int(8, 14))
		r.pres += R.int(6, 10)
		regFix(r)
		return "Dividi os latifúndios entre as famílias do campo. Os fazendeiros fugiram do país."
	elseif k == "alfabetizar" then
		o.appr = clamp(o.appr + R.int(4, 8))
		m.karma = clamp(m.karma + 8)
		return "Professores voluntários foram para cada vilarejo. Um milhão de pessoas aprenderam a ler."
	elseif k == "milicia" then
		r.medo += R.int(5, 9)
		r.leal += R.int(3, 6)
		regFix(r)
		return "Organizei comitês armados em cada bairro. Agora cada esquina vigia a outra."
	elseif k == "leireligiosa" then
		r.medo += R.int(8, 12)
		o.appr = clamp(o.appr + R.int(-8, 6))
		r.pres += 6
		regFix(r)
		return "Fechei os bares e as casas de show. As ruas ficaram silenciosas às sextas."
	elseif k == "templo" then
		local c = 1500000
		if m.money < c then
			return "O templo custa " .. fmt(c) .. "."
		end
		m.money -= c
		o.appr = clamp(o.appr + R.int(6, 12))
		return "O maior templo do continente, com o meu nome gravado na pedra fundamental."
	elseif k == "peregrinacao" then
		m.fame = clamp((m.fame or 0) + 6)
		o.appr = clamp(o.appr + R.int(3, 8))
		return "Caminhei com um milhão de fiéis até o santuário. As imagens rodaram o mundo."
	elseif k == "debate" then
		o.appr = clamp(o.appr + R.int(-4, 10))
		return "Debati ao vivo com os líderes da oposição. Pela primeira vez em anos, o país assistiu a uma discussão de verdade."
	elseif k == "imprensa" then
		r.pres -= R.int(8, 14)
		r.medo -= R.int(4, 8)
		o.appr = clamp(o.appr + R.int(-3, 4))
		regFix(r)
		return "Reabri os jornais. Os primeiros editoriais me criticaram sem medo."
	end
	return ""
end
for _, lista in Politica.ACOES_CAMINHO do
	for _, a in lista do
		RUN["cam_" .. a[1]] = function(game)
			return caminhoAcao(game, a[1])
		end
	end
end

-- refundar o país
function RUN.ref_nome(game, i)
	local m = game.S.me
	local r = regime(m)
	local v = Politica.nomesPais(game)[i]
	if not v then
		return nil
	end
	m.c.paisNome = v
	local base = CAMINHOS[r.tipo] and CAMINHOS[r.tipo].n or "Regime"
	r.n = base .. " " .. doPais(v)
	m.fame = clamp((m.fame or 0) + 4)
	return string.format("O país agora se chama %s. Os mapas do mundo inteiro precisaram ser refeitos.", v)
end
function RUN.ref_constituicao(game)
	game:queue("reg_constituicao", {})
	return nil
end
function RUN.ref_julgar(game)
	game:queue("reg_julgar", {})
	return nil
end
function RUN.reg_nuclear(game)
	local m = game.S.me
	local r = regime(m)
	local c = 5000000
	if m.money < c then
		return "Um programa nuclear custa " .. fmt(c) .. "."
	end
	m.money -= c
	r.nuclear = 1
	r.pres += 30
	r.leal += 10
	regFix(r)
	m.fame = clamp((m.fame or 0) + 15)
	game:log("☢️ Anunciei o primeiro teste nuclear do país.", "big")
	return "Um clarão no deserto. O mundo inteiro passou a me levar a sério, e a me temer."
end
function RUN.reg_anexar(game)
	local m = game.S.me
	local o, r = m.office, regime(m)
	local vizinhos = {}
	for _, c in game.COUNTRIES or {} do
		if c.id ~= m.country then
			table.insert(vizinhos, c.n)
		end
	end
	local alvo = R.pick(vizinhos) or "o país vizinho"
	r.pres += 25
	regFix(r)
	if R.chance(0.25 + r.leal / 300) then
		r.anexou = (r.anexou or 0) + 1
		o.appr = clamp(o.appr + 12)
		m.fame = clamp((m.fame or 0) + 12)
		game:log("🗺️ Anexei uma província " .. doPais(alvo) .. ".", "big")
		return string.format("Os tanques cruzaram a fronteira de madrugada. A província é nossa, e %s jurou vingança.", alvo)
	end
	if R.chance(0.3) then
		sairDoPoder(game)
		game:die("na guerra que começou para anexar território")
		return "A invasão virou guerra. O palácio foi atacado pelo ar."
	end
	o.appr = clamp(o.appr - 15)
	r.leal -= 15
	regFix(r)
	return string.format("A invasão fracassou. %s expulsou nossas tropas e o exército me culpa.", alvo)
end
function RUN.reg_salario(game, x)
	local r = regime(game.S.me)
	if not table.find(Politica.SAL_MULTS, x) then
		return nil
	end
	r.salMult = x
	return "Defini meu salário em " .. fmt(Politica.SAL_PRES * x) .. " por ano."
end
function RUN.reg_herdeiro(game, id)
	local m = game.S.me
	local r = regime(m)
	local p = game:P(id)
	if not p then
		return nil
	end
	r.herdeiro = id
	return string.format("Nomeei %s como herdeir%s do %s.", p.first, p.gender == "F" and "a" or "o", r.n)
end

for id, t in {
	rev_fundar = "Revolução", rev_panfleto = "Panfletos", rev_protesto = "Protesto", rev_hacker = "TV estatal", rev_equipar = "Equipamento",
	rev_general = "General", rev_sumir = "Revolução", rev_abandonar = "Revolução", reg_exilio = "Exílio", ref_nome = "Novo nome",
	reg_nuclear = "Programa nuclear", reg_anexar = "Anexação", reg_herdeiro = "Sucessão", reg_salario = "Meu salário",
} do
	Politica.TITLE[id] = t
end

-- o que dá para fazer agora (chamado por Actions.list)
function Politica.list(game, add)
	local m = game.S.me
	if m.age < 18 then
		return
	end
	local r = regime(m)
	if r then
		for _, k in Politica.REG do
			add("reg_" .. k, k, "Regime")
		end
		add("reg_exilio", "Fugir para o exílio", "Regime")
		for _, a in Politica.ACOES_CAMINHO[r.tipo] or {} do
			add("cam_" .. a[1], a[3], "Regime")
		end
		for i in Politica.nomesPais(game) do
			add("ref_nome", "Mudar o nome do país", "Regime", i)
		end
		if not r.const then
			add("ref_constituicao", "Nova constituição", "Regime")
		end
		if not r.julgou then
			add("ref_julgar", "O antigo presidente", "Regime")
		end
		if not r.nuclear then
			add("reg_nuclear", "Programa nuclear", "Regime")
		end
		add("reg_anexar", "Anexar território", "Regime")
		for _, x in Politica.SAL_MULTS do
			add("reg_salario", "Salário", "Regime", x)
		end
		for _, k in game:people("filho", "adot") do
			if k.alive ~= false then
				add("reg_herdeiro", "Herdeiro: " .. k.first, "Regime", k.id)
			end
		end
	elseif m.rev then
		for _, k in { "panfleto", "protesto", "hacker", "equipar", "general", "sumir", "golpe", "abandonar" } do
			add("rev_" .. k, k, "Revolução")
		end
	elseif not m.office then
		for i in Politica.REV_NOMES do
			add("rev_fundar", "Fundar um movimento clandestino", "Revolução", i)
		end
	end
end

---------------------------------------------------------------------------
-- eventos com escolhas montadas aqui (Engine:currentEvent e Engine:choose)
---------------------------------------------------------------------------
local EV = {}
Politica.EVENTS = EV

local function golpeFim(game, bonus: number, relato): string
	local m = game.S.me
	local r = m.rev
	if not r then
		return ""
	end
	local p = math.clamp(Politica.revChance(r) + bonus, 0.03, 0.95)
	m.c.golpe = (m.c.golpe or 0) + 1
	local narrado = table.concat(relato, " ")
	if not R.chance(p) then
		m.rev = nil
		m.karma = clamp(m.karma - 5)
		local n = R.f()
		if n < 0.2 then
			game:die("na noite de um golpe de Estado fracassado")
			return narrado .. "\n\nO golpe fracassou. Os quartéis reagiram antes do amanhecer."
		elseif n < 0.45 and m.money > 10000 then
			m.money = Util.round(m.money * 0.3)
			m.c.exilio = 1
			return narrado .. "\n\nO golpe fracassou. Fugi pela fronteira de madrugada, com o que deu para carregar."
		end
		m.money = Util.round(math.max(0, m.money) * 0.5)
		game:st("happy", -30)
		game:st("health", -10)
		m.c.detido = (m.c.detido or 0) + 1
		return narrado .. "\n\nO golpe fracassou. Passei meses numa cela até uma anistia geral me soltar."
	end
	local pais, mov, antes = paisNome(game), r.n, m.money
	m.trabalho = nil
	m.office = { dit = 1, yrs = 0, appr = R.int(30, 60) }
	m.c.golpeOk = 1
	m.c.golpeMov = mov
	m.fame = clamp((m.fame or 0) + 80)
	m.rev = nil
	game:st("happy", 20)
	m.money = Util.round(m.money * 0.85)
	regime(m)
	game:log(string.format("🔥 GOLPE DE ESTADO: o %s tomou o poder. Agora sou %s %s.", mov, m.gender == "F" and "a líder suprema" or "o líder supremo", doPais(pais)), "big")
	game:log(string.format("O mundo inteiro noticiou. A ONU convocou uma reunião de emergência e a moeda %s despencou%s.", doPais(pais),
		antes > 0 and (": minhas economias perderam " .. fmt(antes - m.money)) or ""), "warn")
	for _, q in game:people("mae", "pai") do
		if q.alive ~= false then
			if R.chance(0.5) then
				q.bond = clamp(q.bond - 25)
				game:log(string.format("%s %s parou de falar comigo depois do golpe.", game:relLabel(q), q.first), "bad")
			else
				q.bond = clamp(q.bond + 10)
				game:log(string.format("%s %s chorou de orgulho na frente da TV.", game:relLabel(q), q.first))
			end
		end
	end
	game:queue("golpe_decreto", {})
	return narrado .. string.format("\n\nÀs 6h da manhã, falei em rede nacional: %s agora é meu. Nas ruas, metade comemorava e metade chorava.", pais)
end

-- a noite do golpe: { título, pergunta, escolhas = { texto, bônus(r, m), relato, efeito? } }
local ETAPAS = {
	{ t = "🌑 Madrugada, 3h da manhã", x = "Os carros estão prontos. Qual é o primeiro alvo?", ch = {
		{ "📺 Tomar a TV estatal", function(r) return r.apoio / 400 end, "Às 4h, a TV estatal tocava o hino do movimento em vez da novela." },
		{ "🏛️ Cercar o palácio", function(r) return r.mil / 300 + r.equip / 400 end, "Os tanques fecharam a esplanada antes do sol nascer." },
		{ "📡 Cortar internet e telefones", function(_, m) return 0.05 + m.smarts / 2000 end, "O país acordou mudo. Ninguém sabia o que estava acontecendo." },
	} },
	{ t = "🚁 O presidente", x = "Ele ainda está no palácio. O que fazer com ele?", ch = {
		{ "Deixar fugir de helicóptero", function() return 0.05 end, "O helicóptero sumiu no horizonte. Menos resistência." },
		{ "Prender o presidente", function(r) return r.equip >= 30 and 0.09 or -0.06 end, "A guarda dele resistiu antes de se render." },
		{ "Obrigar a renunciar ao vivo", function(_, m) return (m.fame or 0) >= 40 and 0.08 or 0.01 end, "Ele leu a carta de renúncia tremendo, em rede nacional." },
	} },
	{ t = "🎖️ Os quartéis", x = "Alguns comandantes ainda não decidiram de que lado estão.", ch = {
		{ "💰 Pagar os comandantes (" .. fmt(100000) .. ")", function(_, m) return m.money >= 100000 and 0.1 or -0.03 end, "Envelopes grossos fizeram os quartéis ficarem em silêncio.",
			function(m) if m.money >= 100000 then m.money -= 100000 end end },
		{ "📢 Discursar para os soldados", function(_, m) return (m.smarts - 50) / 600 + (m.fame or 0) / 800 end, "Falei de pátria e futuro. Alguns bateram continência." },
		{ "⚔️ Enfrentar quem resistir", function() return 0.07 end, "Houve confronto na madrugada. O país não vai esquecer.", function(m) m.karma = clamp(m.karma - 12) end },
	} },
}

EV.golpe_etapa = {
	k = "Golpe de Estado",
	show = function(game, d)
		local e = ETAPAS[d.i] or ETAPAS[1]
		local r = game.S.me.rev
		local p = r and math.clamp(Politica.revChance(r) + d.b, 0.03, 0.95) or 0
		local ch = {}
		for i, c in e.ch do
			ch[i] = c[1]
		end
		return e.t, string.format("%s\n\nChance agora: %d%%", e.x, Util.round(p * 100)), ch
	end,
	pick = function(game, i, d)
		local m = game.S.me
		local r = m.rev
		local e = ETAPAS[d.i] or ETAPAS[1]
		local c = e.ch[i]
		if not r or not c then
			return ""
		end
		d.b += c[2](r, m)
		if c[4] then
			c[4](m)
		end
		table.insert(d.rel, c[3])
		if d.i < #ETAPAS then
			game:queue("golpe_etapa", { i = d.i + 1, b = d.b, rel = d.rel })
			return c[3]
		end
		return golpeFim(game, d.b, d.rel)
	end,
}

local DECRETO = {
	{ "🎖️ Ditadura militar: ordem acima de tudo", "militar" },
	{ "👑 Coroar-me e fundar uma dinastia", "monarquia" },
	{ "✊ Revolução popular: terra e pão para o povo", "popular" },
	{ "⛪ Governar em nome da fé", "teocracia" },
	{ "🗳️ Transição: eleições livres em dois anos", "transicao" },
}
EV.golpe_decreto = {
	k = "Política",
	show = function()
		local ch = {}
		for i, c in DECRETO do
			ch[i] = c[1]
		end
		return "🏛️ Que país você vai construir?", "O palácio é seu. O país inteiro espera saber o que vem agora.", ch
	end,
	pick = function(game, i)
		local m = game.S.me
		local r = regime(m)
		if not r then
			return ""
		end
		local k = (DECRETO[i] or DECRETO[1])[2]
		local c = CAMINHOS[k]
		local o = m.office
		r.tipo = k
		r.n = c.n .. " " .. doPais(paisNome(game))
		if k == "militar" then
			r.leal += 15
			r.medo += 15
			r.pres += 10
		elseif k == "monarquia" then
			r.leal += 5
			r.pres += 15
			m.fame = clamp((m.fame or 0) + 15)
			r.dinastia = m.last
		elseif k == "popular" then
			o.appr = clamp(o.appr + 15)
			r.pres += 20
			r.leal -= 5
		elseif k == "teocracia" then
			r.medo += 10
			o.appr = clamp(o.appr + 5)
			r.pres += 15
		else
			r.medo -= 15
			r.pres -= 20
			o.appr = clamp(o.appr + 10)
			m.karma = clamp(m.karma + 15)
			r.eleicaoEm = game.S.year + 2
		end
		regFix(r)
		game:log(string.format("%s Nasceu o %s. Sou %s.", c.ic, r.n, string.lower(Politica.titulo(game) or "")), "big")
		return ({
			militar = "Toque de recolher, generais em todos os ministérios e desfiles toda semana.",
			monarquia = string.format("Coroação na catedral, manto vermelho e uma coroa feita às pressas. A Casa %s agora reina.", m.last),
			popular = "Distribuí as terras dos latifúndios e prometi escola e comida para todos. As embaixadas ocidentais fecharam as portas.",
			teocracia = "Os templos tocaram os sinos o dia inteiro. As leis agora vêm dos livros sagrados.",
			transicao = "Prometi eleições livres em dois anos. O mundo aplaudiu, e os generais ficaram desconfiados.",
		})[k]
	end,
}

EV.rev_policia = {
	k = "Revolução",
	show = function(game)
		local r = game.S.me.rev
		return "A polícia política bateu na porta", string.format("Agentes à paisana cercaram o esconderijo do %s.", r and r.n or "movimento"),
			{ "Resistir", "Fugir pelos fundos", "Entregar os companheiros" }
	end,
	pick = function(game, i)
		local m = game.S.me
		local r = m.rev
		if not r then
			return ""
		end
		if i == 3 then
			m.rev = nil
			m.karma = clamp(m.karma - 20)
			return "Entreguei todos em troca da minha liberdade. Nunca mais consegui me olhar no espelho."
		end
		if i == 1 and r.equip >= 30 and R.chance(0.5) then
			r.susp = 40
			r.apoio += 8
			revFix(r)
			return "Os agentes recuaram. Viramos lenda nas ruas."
		end
		if i == 2 and R.chance(0.55) then
			r.susp = 35
			r.membros = Util.round(r.membros * 0.7)
			revFix(r)
			return "Escapei pelos telhados. Perdemos alguns companheiros."
		end
		m.rev = nil
		m.money = Util.round(math.max(0, m.money) * 0.6)
		game:st("happy", -20)
		m.c.detido = (m.c.detido or 0) + 1
		return "Não deu. Fui levad" .. oa(m) .. " encapuzad" .. oa(m) .. " e só saí meses depois, sem o movimento."
	end,
}

EV.rev_contragolpe = {
	k = "Política",
	show = function()
		return "Contragolpe!", "Generais insatisfeitos cercaram o palácio. Querem fazer comigo o que eu fiz com o governo anterior.", { "Resistir", "Negociar", "Fugir para o exílio" }
	end,
	pick = function(game, i)
		local m = game.S.me
		local of = m.office
		if not of then
			return ""
		end
		if i == 3 then
			sairDoPoder(game)
			m.money = Util.round(m.money * 0.5)
			m.c.exilio = 1
			return "Fugi num avião particular com metade do tesouro. Vivo exilad" .. oa(m) .. " numa ilha."
		end
		if i == 2 and R.chance(0.5) then
			of.appr = clamp(of.appr + 15)
			m.money -= math.min(math.max(0, m.money), 500000)
			return "Dei cargos e dinheiro aos generais. Ficaram. Por enquanto."
		end
		if i == 1 and R.chance(0.45) then
			of.appr = clamp(of.appr + 10)
			return "A guarda presidencial resistiu. Os generais foram presos."
		end
		sairDoPoder(game)
		if R.chance(0.35) then
			game:die("num contragolpe militar")
			return "O palácio caiu."
		end
		m.money = Util.round(math.max(0, m.money) * 0.2)
		m.c.exilio = 1
		return "O palácio caiu. Me deixaram partir para o exílio só com a roupa do corpo."
	end,
}

EV.regime_revolta = {
	k = "Revolução",
	show = function(game)
		local r = regime(game.S.me)
		return "🔥 O povo tomou as ruas", string.format("Milhões de pessoas cercam o palácio exigindo o fim do %s.", r and r.n or "regime"),
			{ "Mandar o exército dispersar a multidão", "Prometer eleições livres", "Fugir para o exílio" }
	end,
	pick = function(game, i)
		local m = game.S.me
		local r = regime(m)
		if not r then
			return ""
		end
		if i == 3 then
			return exilio(game)
		end
		if i == 2 then
			m.office.appr = clamp(m.office.appr + 20)
			r.medo -= 10
			r.pres -= 10
			regFix(r)
			return "Prometi eleições. A multidão voltou para casa, desconfiada."
		end
		if R.chance(r.leal / 100) then
			r.medo += 25
			r.pres += 25
			m.karma = clamp(m.karma - 30)
			regFix(r)
			return "O exército obedeceu. As imagens da repressão correram o mundo, mas eu continuo no poder."
		end
		sairDoPoder(game)
		if R.chance(0.4) then
			game:die("quando a multidão invadiu o palácio")
			return "Os soldados baixaram as armas. A multidão invadiu o palácio."
		end
		m.money = Util.round(math.max(0, m.money) * 0.1)
		game:st("happy", -30)
		return "Os soldados baixaram as armas. Um tribunal internacional confiscou quase tudo o que eu tinha."
	end,
}

EV.regime_atentado = {
	k = "Perigo",
	show = function()
		return "💥 Atentado contra mim", "Uma explosão atingiu o comboio oficial durante o desfile.", { "Caçar os culpados", "Sumir da vista do povo por um tempo" }
	end,
	pick = function(game, i)
		local m = game.S.me
		local r = regime(m)
		if not r then
			return ""
		end
		if R.chance(0.12 - r.leal / 1500) then
			sairDoPoder(game)
			game:die("num atentado")
			return "Não houve tempo de reagir."
		end
		game:st("health", -R.int(5, 20))
		if i == 1 then
			r.medo += 12
			m.karma = clamp(m.karma - 8)
			regFix(r)
			return "Sobrevivi com ferimentos. Centenas foram detidos na mesma semana."
		end
		r.medo -= 5
		m.office.appr = clamp(m.office.appr - 4)
		regFix(r)
		return "Sobrevivi e passei meses escondid" .. oa(m) .. " num bunker."
	end,
}

EV.regime_eleicao = {
	k = "Política",
	show = function()
		return "🗳️ Dia da eleição livre", "Chegou a eleição prometida. A oposição tem candidato e o mundo está assistindo.", { "Concorrer de verdade", "Entregar o poder sem concorrer", "Cancelar a eleição" }
	end,
	pick = function(game, i)
		local m = game.S.me
		local o, r = m.office, regime(m)
		if not r then
			return ""
		end
		if i == 2 then
			sairDoPoder(game)
			m.karma = clamp(m.karma + 30)
			m.fame = clamp((m.fame or 0) + 20)
			game:log(string.format("Entreguei o poder ao presidente eleito. Os livros de história vão me chamar de %s da democracia.", m.gender == "F" and "mãe" or "pai"), "big")
			return "Passei a faixa e voltei para casa a pé. O povo aplaudiu da calçada."
		end
		if i == 3 then
			r.tipo = "militar"
			r.n = CAMINHOS.militar.n .. " " .. doPais(paisNome(game))
			r.pres += 25
			o.appr = clamp(o.appr - 20)
			regFix(r)
			return 'Cancelei a eleição "por motivos de segurança". A transição acabou ali.'
		end
		if R.chance(math.clamp(o.appr / 100, 0.1, 0.85)) then
			o.eleito = 1
			o.dit = nil
			o.reg = nil
			o.appr = clamp(o.appr + 10)
			m.karma = clamp(m.karma + 15)
			game:log("Venci uma eleição limpa. Agora sou presidente de verdade.", "big")
			return "Ganhei nas urnas. Pela primeira vez, ninguém pode dizer que roubei o cargo."
		end
		sairDoPoder(game)
		m.karma = clamp(m.karma + 20)
		game:log("Perdi a eleição que eu mesm" .. oa(m) .. " convoquei, e aceitei o resultado.", "warn")
		return "Perdi. Liguei para o vencedor e reconheci a derrota. O mundo não acreditou."
	end,
}

EV.regime_investigacao = {
	k = "Política",
	show = function(game)
		local r = regime(game.S.me) or {}
		local f = {}
		if salMult(r) > 2 then
			table.insert(f, "que eu me pago " .. fmt(Politica.SAL_PRES * salMult(r)) .. " por ano")
		end
		if (r.saques or 0) > 0 then
			table.insert(f, string.format("%d saque%s do tesouro", r.saques, r.saques > 1 and "s" or ""))
		end
		return "📰 Investigação internacional", "Jornalistas estrangeiros e um tribunal internacional estão investigando as minhas contas." .. (#f > 0 and (" Descobriram " .. table.concat(f, " e ") .. ".") or ""),
			{ "Baixar o meu salário para o de presidente", "Subornar os investigadores (" .. fmt(2000000) .. ")", "Expulsar os jornalistas do país" }
	end,
	pick = function(game, i)
		local m = game.S.me
		local o, r = m.office, regime(m)
		if not r then
			return ""
		end
		local function congela(): string
			local v = Util.round(math.max(0, m.money) * R.int(20, 40) / 100)
			m.money -= v
			r.pres += 15
			o.appr = clamp(o.appr - 10)
			regFix(r)
			game:log("Um tribunal internacional congelou " .. fmt(v) .. " das minhas contas.", "bad")
			return fmt(v)
		end
		if i == 1 then
			r.salMult = 1
			r.saques = 0
			o.appr = clamp(o.appr + 5)
			r.pres -= 5
			regFix(r)
			return "Cortei o meu salário em rede nacional. A investigação perdeu força."
		elseif i == 2 then
			local c = 2000000
			if m.money < c then
				return "Não tinha dinheiro para o suborno. A investigação saiu e congelaram " .. congela() .. "."
			end
			m.money -= c
			m.karma = clamp(m.karma - 8)
			if R.chance(0.6) then
				r.saques = math.max(0, (r.saques or 0) - 1)
				return "Os investigadores arquivaram o caso. Ninguém sabe por quê."
			end
			return "Um investigador gravou a oferta de suborno. Virou manchete, e congelaram " .. congela() .. "."
		end
		r.medo += 5
		r.pres += 10
		regFix(r)
		if R.chance(0.5) then
			return "Expulsei os jornalistas, mas o relatório saiu mesmo assim. Congelaram " .. congela() .. "."
		end
		return "Expulsei os jornalistas e fechei as fronteiras para a imprensa. Por enquanto, ninguém provou nada."
	end,
}

EV.reg_constituicao = {
	k = "Política",
	show = function()
		return "📜 Nova constituição", "Os juristas do regime esperam a sua decisão sobre o mandato.", { "Mandato vitalício", "Limite de dez anos" }
	end,
	pick = function(game, i)
		local m = game.S.me
		local r = regime(m)
		if not r then
			return ""
		end
		r.const = 1
		if i == 1 then
			r.vitalicio = 1
			r.leal += 8
			r.pres += 12
			regFix(r)
			return "A nova constituição me deu mandato vitalício."
		end
		r.limite = game.S.year + 10
		m.office.appr = clamp(m.office.appr + 10)
		r.pres -= 10
		regFix(r)
		return string.format("A nova constituição limita o meu governo até %d. Depois disso, eleição livre.", r.limite)
	end,
}

EV.reg_julgar = {
	k = "Política",
	show = function()
		return "⚖️ O antigo presidente", "Ele está detido no quartel desde a noite do golpe. O que fazer com ele?", { "Julgamento público", "Mandar para o exílio", "Perdoar em nome da paz" }
	end,
	pick = function(game, i)
		local m = game.S.me
		local r = regime(m)
		if not r then
			return ""
		end
		r.julgou = 1
		if i == 1 then
			m.office.appr = clamp(m.office.appr + 8)
			r.pres += 5
			regFix(r)
			return "O antigo presidente foi julgado em rede nacional e condenado."
		elseif i == 2 then
			r.pres -= 5
			regFix(r)
			return "O antigo presidente embarcou para o exílio. Pode voltar um dia."
		end
		m.karma = clamp(m.karma + 10)
		r.leal -= 5
		regFix(r)
		return "Perdoei o antigo presidente. Os generais não gostaram."
	end,
}

---------------------------------------------------------------------------
-- todo ano (Engine:yearMoney) e na morte (Engine:die)
---------------------------------------------------------------------------
function Politica.year(game)
	local m = game.S.me
	if not m.alive then
		return
	end
	local rv = m.rev
	if rv then
		rv.anos += 1
		rv.susp += R.int(-4, 6)
		rv.apoio += R.int(-3, 2)
		revFix(rv)
		if rv.susp >= 60 and R.chance((rv.susp - 45) / 80) then
			game:queue("rev_policia", {})
		end
	end
	local o = m.office
	if not o then
		return
	end
	o.yrs += 1
	local r = regime(m)
	m.money += Util.round(Politica.SAL_PRES * (r and salMult(r) or 1) * game:diff().money)
	if r and R.chance(Politica.risco(r)) then
		game:queue("regime_investigacao", {})
	end
	if not r then
		-- eleito na transição: um mandato de presidente comum, até perder a aprovação
		o.appr = clamp(o.appr + R.int(-6, 4))
		if o.yrs >= 4 and (o.appr < 40 or R.chance(0.3)) then
			m.office = nil
			game:log("Meu mandato acabou. Passei a faixa e voltei para a vida comum.", "big")
		end
		return
	end
	r.anos += 1
	r.medo -= R.int(2, 6)
	r.leal -= R.int(1, 5)
	regFix(r)
	if r.pres >= 50 then
		local perda = Util.round(math.max(0, m.money) * r.pres / 1000)
		if perda > 0 then
			m.money -= perda
			game:log("Sanções internacionais congelaram " .. fmt(perda) .. " das minhas contas no exterior.", "bad")
		end
	end
	if r.tipo == "transicao" and r.eleicaoEm and game.S.year >= r.eleicaoEm then
		r.eleicaoEm = nil
		game:queue("regime_eleicao", {})
	elseif r.limite and game.S.year >= r.limite then
		r.limite = nil
		game:queue("regime_eleicao", {})
	elseif o.appr < 30 and r.medo < 40 and R.chance(0.4) then
		game:queue("regime_revolta", {})
	elseif r.leal < 30 and R.chance(0.35) then
		game:queue("rev_contragolpe", {})
	elseif R.chance(0.08 + r.pres / 700) then
		game:queue("regime_atentado", {})
	end
end

-- sucessão: o herdeiro escolhido (ou, na monarquia, o filho mais velho) assume
function Politica.onDie(game)
	local m = game.S.me
	local r = m.office and m.office.dit and m.office.reg
	if not r then
		return
	end
	local herdeiro = r.herdeiro and game:P(r.herdeiro)
	if herdeiro and herdeiro.alive == false then
		herdeiro = nil
	end
	if not herdeiro and r.tipo == "monarquia" then
		for _, k in game:people("filho", "adot") do
			if k.alive ~= false and (not herdeiro or k.age > herdeiro.age) then
				herdeiro = k
			end
		end
	end
	if herdeiro then
		herdeiro.trono = r.n
		if r.tipo == "monarquia" then
			game:log(string.format("👑 %s foi coroad%s. A Casa %s continua no trono.", herdeiro.first, herdeiro.gender == "F" and "a" or "o", r.dinastia or m.last), "big")
		else
			game:log(string.format("%s herdou o comando do %s.", herdeiro.first, r.n), "big")
		end
	else
		game:log(string.format("Sem herdeiro, o %s acabou junto comigo.", r.n), "warn")
	end
end

---------------------------------------------------------------------------
-- telas (View.luau): Carreira ganha a política; "rev" e "regime" são as telas próprias
---------------------------------------------------------------------------
local function pct(v: number): string
	return Util.round(v * 100) .. "%"
end

function Politica.views(game, V, actRow, allowed)
	local m = game.S.me
	local r = regime(m)
	local career = V.career and V.career.items
	if career and m.age >= 18 then
		if r then
			local c = CAMINHOS[r.tipo]
			table.insert(career, 1, { sec = "Governo" })
			table.insert(career, 2, { ic = c and c.ic or "🎖️", l = (Politica.titulo(game) or "") .. " " .. doPais(paisNome(game)), s = r.n, push = "regime" })
		elseif m.office then
			table.insert(career, 1, { sec = "Governo" })
			table.insert(career, 2, { card = { { "Cargo", m.gender == "F" and "Presidenta eleita" or "Presidente eleito" }, { "Anos no cargo", tostring(m.office.yrs) }, { bar = "Aprovação", v = m.office.appr } } })
		else
			table.insert(career, { sec = "Por fora das urnas" })
			table.insert(career, { ic = "✊", l = "Derrubar o governo", s = m.rev and m.rev.n or "Movimento clandestino e golpe de Estado", tone = "bad", push = "rev" })
		end
	end

	-- movimento
	local it = {}
	local rv = m.rev
	if not rv then
		table.insert(it, { card = { { p = "Organize um movimento clandestino, conquiste o povo, consiga equipamento e generais, e tome o poder. Se der errado, é cadeia, exílio ou coisa pior." } } })
		table.insert(it, { sec = "Fundar um movimento" })
		for i, n in Politica.REV_NOMES do
			table.insert(it, actRow(allowed, "rev_fundar", i, { ic = "✊", l = n }))
		end
		V.rev = { title = "Revolução", items = it }
	else
		local ch = Politica.revChance(rv)
		table.insert(it, { card = {
			{ p = "✊ " .. rv.n }, { "Membros", tostring(rv.membros) },
			{ bar = "Apoio do povo", v = rv.apoio }, { bar = "Militares do nosso lado", v = rv.mil }, { bar = "Equipamento", v = rv.equip },
			{ bar = "Suspeita da polícia política", v = rv.susp }, { "Chance do golpe hoje", pct(ch) },
		} })
		table.insert(it, { sec = "Preparar" })
		table.insert(it, actRow(allowed, "rev_panfleto", nil, { ic = "📜", l = "Panfletar e pichar", s = "Apoio do povo" }))
		table.insert(it, actRow(allowed, "rev_protesto", nil, { ic = "📢", l = "Convocar um protesto", s = "Muito apoio · risco de repressão" }))
		table.insert(it, actRow(allowed, "rev_hacker", nil, { ic = "💻", l = "Invadir a TV estatal", s = "Apoio · pode deixar rastro" }))
		table.insert(it, actRow(allowed, "rev_equipar", nil, { ic = "📦", l = "Equipar o movimento", s = fmt(30000) .. " · equipamento" }))
		table.insert(it, actRow(allowed, "rev_general", nil, { ic = "🎖️", l = "Subornar um general", s = fmt(80000) .. " · militares" }))
		table.insert(it, actRow(allowed, "rev_sumir", nil, { ic = "🤫", l = "Hibernar o movimento", s = "Diminui a suspeita" }))
		table.insert(it, { sec = "A hora da verdade" })
		table.insert(it, actRow(allowed, "rev_golpe", nil, { ic = "💥", l = "Dar o golpe", s = "Chance de " .. pct(ch) .. " · tudo ou nada", tone = "bad",
			confirm = { t = "Dar o golpe?", x = "Se der errado: cadeia, exílio ou coisa pior. Se der certo, o país nunca mais será o mesmo.", yes = "Começar" } }))
		table.insert(it, actRow(allowed, "rev_abandonar", nil, { ic = "🏳️", l = "Abandonar o movimento", confirm = { t = "Abandonar?", x = "O movimento vai seguir sem você, ou acabar.", yes = "Abandonar" } }))
		V.rev = { title = rv.n, items = it }
	end

	if not r then
		return
	end
	-- regime
	local of = m.office
	local c = CAMINHOS[r.tipo]
	local ri = {}
	local function A(id, ic, l, s, aviso)
		local row = { ic = ic, l = l, s = s }
		if aviso then
			row.tone = "bad"
			row.confirm = { t = l .. "?", x = aviso, yes = "Confirmar" }
		end
		table.insert(ri, actRow(allowed, id, nil, row))
	end
	table.insert(ri, { card = {
		{ p = (c and c.ic or "🎖️") .. " " .. (Politica.titulo(game) or "") .. " " .. doPais(paisNome(game)) },
		{ "Regime", r.n }, { "Anos no poder", tostring(of.yrs) }, { "Estátuas minhas", tostring(r.estatuas) },
		{ "Constituição", r.vitalicio and "Mandato vitalício" or r.limite and ("Governo até " .. r.limite) or r.eleicaoEm and ("Eleição em " .. r.eleicaoEm) or "Sem limite definido" },
		{ bar = "Aprovação do povo", v = of.appr }, { bar = "Medo da população", v = r.medo }, { bar = "Lealdade dos militares", v = r.leal }, { bar = "Pressão internacional", v = r.pres },
	} })
	if c and Politica.ACOES_CAMINHO[r.tipo] then
		table.insert(ri, { sec = c.n })
		for _, a in Politica.ACOES_CAMINHO[r.tipo] do
			A("cam_" .. a[1], a[2], a[3], a[4], a[5])
		end
	end
	table.insert(ri, { sec = "Culto à personalidade" })
	A("reg_propaganda", "📺", "Propaganda estatal", "Aprovação")
	A("reg_estatua", "🗿", "Erguer uma estátua minha", fmt(500000) .. " · fama")
	A("reg_desfile", "🎖️", "Desfile militar", "Lealdade e medo")
	table.insert(ri, { sec = "Mão de ferro" })
	A("reg_policia", "🕵️", "Polícia secreta caça opositores", "Muito medo · aprovação cai", "Prisões, desaparecimentos e carma no chão.")
	A("reg_censura", "🚫", "Censurar a imprensa", "Medo · pressão internacional")
	A("reg_eleicao", "🗳️", "Eleição de fachada", "Pressão internacional sobe")
	A("reg_expurgo", "⚖️", "Expurgo no governo", "Lealdade e medo", "Ministros vão sumir. Não tem volta.")
	table.insert(ri, { sec = "Refundar o país" })
	table.insert(ri, { ic = "🏷️", l = "Mudar o nome do país", s = m.c.paisNome and ("Hoje: " .. m.c.paisNome) or "Novo nome, nova história", push = "pais_nome" })
	if not r.const then
		A("ref_constituicao", "📜", "Escrever uma nova constituição", "Mandato vitalício ou com limite")
	end
	if not r.julgou then
		A("ref_julgar", "⚖️", "Decidir o destino do antigo presidente", "Julgamento, exílio ou perdão")
	end
	if not r.nuclear then
		A("reg_nuclear", "☢️", "Programa nuclear", fmt(5000000) .. " · o mundo passa a temer", "O mundo inteiro vai reagir. As sanções vão pesar.")
	end
	A("reg_anexar", "🗺️", "Anexar território vizinho", "Glória ou guerra", "Pode virar guerra e acabar com o regime.")
	table.insert(ri, { sec = "Dinheiro e poder" })
	table.insert(ri, { ic = "💵", l = "Definir meu salário", s = fmt(Politica.SAL_PRES * salMult(r)) .. "/ano · risco de investigação " .. pct(Politica.risco(r)), push = "salario" })
	A("reg_saquear", "💰", "Saquear o tesouro nacional", "Dinheiro · aprovação e lealdade caem", "O dinheiro é do país. Se descobrirem, a revolta vem mais rápido.")
	A("reg_generais", "🎁", "Pagar os generais", "Lealdade dos militares")
	A("reg_nacionalizar", "🏭", "Nacionalizar empresas estrangeiras", "Aprovação · sanções")
	table.insert(ri, { sec = "Sucessão" })
	local herdeiro = r.herdeiro and game:P(r.herdeiro)
	table.insert(ri, { ic = "👑", l = "Escolher um herdeiro", s = herdeiro and ("Herdeiro: " .. herdeiro.first) or r.tipo == "monarquia" and "Sem escolha, o filho mais velho herda o trono" or "Quem assume quando eu me for", push = "herdeiro" })
	A("reg_exilio", "🛫", "Fugir para o exílio", "Leva parte da fortuna e deixa o poder", "Não dá para voltar. O regime acaba hoje.")
	V.regime = { title = r.n, items = ri }

	local ni = { { card = { { p = "Escolha o novo nome. Os mapas do mundo inteiro vão precisar ser refeitos." } } } }
	for i, n in Politica.nomesPais(game) do
		table.insert(ni, actRow(allowed, "ref_nome", i, { ic = "🏷️", l = n }))
	end
	V.pais_nome = { title = "Novo nome do país", items = ni }

	local si = { { card = { { p = "O salário de presidente é " .. fmt(Politica.SAL_PRES) .. " por ano. Quem tomou o poder decide o próprio. Quanto maior, maior a chance de investigarem as minhas contas." }, { "Chance de investigação hoje", pct(Politica.risco(r)) .. " ao ano" } } } }
	for _, x in Politica.SAL_MULTS do
		table.insert(si, actRow(allowed, "reg_salario", x, { ic = salMult(r) == x and "✅" or "💵", l = fmt(Politica.SAL_PRES * x) .. "/ano", s = x == 1 and "Igual ao presidente" or x == 2 and "O dobro" or (x .. "x o salário de presidente") }))
	end
	V.salario = { title = "Meu salário", items = si }

	local hi = { { card = { { p = "Quem herda o poder quando eu me for?" } } } }
	for _, k in game:people("filho", "adot") do
		if k.alive ~= false then
			table.insert(hi, actRow(allowed, "reg_herdeiro", k.id, { ic = r.herdeiro == k.id and "👑" or "🧒", l = k.first .. " " .. k.last, s = k.age .. " anos" }))
		end
	end
	if #hi == 1 then
		table.insert(hi, { card = { { p = "Ainda não tenho filhos para herdar o poder." } } })
	end
	V.herdeiro = { title = "Sucessão", items = hi }
end

return Politica
