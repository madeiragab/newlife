-- ===== Prisão: pena, vida na cadeia, eventos e fuga =====
-- Versão Roblox de src/prison.js: quem é condenado cumpre a pena em anos. Dentro, as atividades mudam
-- (pátio, biblioteca, cozinha, curso, advogado, condicional), os eventos do ano são da cadeia e a fuga
-- é uma sequência de três decisões. Quem foge vira foragido e pode ser recapturado.

local Util = require(script and script.Parent:WaitForChild("Util") or "./Util")
local R, clamp, fmt = Util.R, Util.clamp, Util.fmt

local Prisao = {}
Prisao.RUN = {}
Prisao.EVENTS = {}
Prisao.TITLE = {
	pr_cozinha = "Prisão", pr_curso = "Prisão", pr_amizade = "Prisão", pr_briga = "Pátio", pr_advogado = "Recurso", pr_condicional = "Liberdade condicional",
}

local function oa(m)
	return m.gender == "F" and "a" or "o"
end
local function anos(n: number): string
	return n .. (n == 1 and " ano" or " anos")
end

-- condena e leva para a cadeia
function Prisao.prender(game, crime: string, min: number, max: number): number
	local m = game.S.me
	local n = R.int(min, max)
	m.prison = { crime = crime, anos = n, total = n, comp = 50, cumpridos = 0 }
	m.trabalho = nil
	m.edu.cur = nil
	m.office = nil
	m.rev = nil
	m.c.foragido = nil
	m.c.presa = (m.c.presa or 0) + 1
	game:st("happy", -25)
	game:log(string.format("⚖️ Fui condenad%s a %s de prisão por %s.", oa(m), anos(n), crime), "bad")
	return n
end

local function soltar(game, como: string)
	local m = game.S.me
	local p = m.prison
	m.prison = nil
	m.c.exDetento = 1
	game:st("happy", 20)
	game:log(como or string.format("🔓 Saí da prisão depois de %s. O mundo lá fora mudou.", anos(p and p.cumpridos or 0)), "big")
end

local function fixP(p)
	p.comp = clamp(p.comp)
	p.anos = math.max(0, p.anos)
end

---------------------------------------------------------------------------
-- atividades na cadeia (Actions.list troca a lista inteira enquanto estiver preso)
---------------------------------------------------------------------------
function Prisao.list(game, add)
	local m = game.S.me
	local p = m.prison
	add("academia", "Malhar no pátio", "Prisão")
	add("ler", "Biblioteca da prisão", "Prisão")
	add("meditar", "Meditar na cela", "Prisão")
	for _, k in { "cozinha", "curso", "amizade", "briga", "advogado" } do
		add("pr_" .. k, k, "Prisão")
	end
	if p.cumpridos >= math.ceil(p.total / 2) then
		add("pr_condicional", "Pedir liberdade condicional", "Prisão")
	end
	add("pr_fugir", "Tentar fugir", "Prisão")
end

local function vez(game, k: string): boolean
	local yr = game.S.me.yr
	yr["pr_" .. k] = (yr["pr_" .. k] or 0) + 1
	return yr["pr_" .. k] <= 1
end

function Prisao.RUN.pr_cozinha(game)
	local m = game.S.me
	if not vez(game, "cozinha") then
		return "Já fiz meu turno na cozinha este ano."
	end
	m.prison.comp += R.int(6, 12)
	m.money += 600
	fixP(m.prison)
	return "Trabalhei na cozinha da prisão. Cada dia trabalhado conta a favor na pena."
end
function Prisao.RUN.pr_curso(game)
	local m = game.S.me
	if not vez(game, "curso") then
		return "O curso deste ano já acabou."
	end
	m.smarts = clamp(m.smarts + R.int(2, 5))
	m.prison.comp += R.int(4, 8)
	fixP(m.prison)
	if R.chance(0.3) and m.prison.anos > 1 then
		m.prison.anos -= 1
		return "Terminei o curso profissionalizante e ganhei um ano de remição da pena."
	end
	return "Fiz o curso profissionalizante da prisão. O diretor anotou na minha ficha."
end
function Prisao.RUN.pr_amizade(game)
	local m = game.S.me
	if not vez(game, "amizade") then
		return "Já conheço todo mundo do pavilhão."
	end
	m.fight = clamp((m.fight or 0) + R.int(2, 5))
	game:st("happy", 4)
	return R.pick({ "Fiz amizade com um detento antigo. Ele me ensinou quem evitar no pátio.", "Joguei dominó com o pessoal da cela ao lado. Aqui dentro, amigo vale ouro." })
end
function Prisao.RUN.pr_briga(game)
	local m = game.S.me
	local p = m.prison
	if not vez(game, "briga") then
		return "Os guardas estão de olho em mim. Melhor ficar quieto este ano."
	end
	if R.chance(0.35 + (m.fight or 0) / 250) then
		m.fight = clamp((m.fight or 0) + R.int(4, 8))
		p.comp -= 10
		fixP(p)
		return "Ganhei a briga no pátio. Agora ninguém mexe comigo, mas o diretor anotou."
	end
	game:st("health", -R.int(8, 18))
	p.comp -= 15
	if R.chance(0.4) then
		p.anos += 1
		p.total += 1
		fixP(p)
		return "Perdi a briga e ainda fui para a solitária. A pena aumentou um ano."
	end
	fixP(p)
	return "Perdi a briga no pátio e passei uns dias na enfermaria."
end
function Prisao.RUN.pr_advogado(game)
	local m = game.S.me
	local p = m.prison
	if not vez(game, "advogado") then
		return "O recurso deste ano já foi julgado."
	end
	local c = 40000
	if m.money < c then
		return "Um bom advogado para recorrer custa " .. fmt(c) .. "."
	end
	m.money -= c
	if R.chance(0.25) then
		local menos = math.min(p.anos, R.int(1, math.max(1, math.floor(p.anos / 2))))
		p.anos -= menos
		if p.anos <= 0 then
			soltar(game, "🔓 O recurso foi aceito e a condenação caiu. Saí pela porta da frente.")
			return "O tribunal anulou a condenação. Estou livre."
		end
		return string.format("O recurso foi aceito em parte: a pena caiu %s.", anos(menos))
	end
	return "O recurso foi negado. O advogado jura que no ano que vem dá certo."
end
function Prisao.RUN.pr_condicional(game)
	local m = game.S.me
	local p = m.prison
	if not vez(game, "condicional") then
		return "A comissão só me ouve uma vez por ano."
	end
	if R.chance(p.comp / 130 + (m.karma - 50) / 300) then
		soltar(game, string.format("🔓 Ganhei a liberdade condicional depois de %s.", anos(p.cumpridos)))
		return "A comissão aprovou a condicional. Vou terminar a pena em liberdade, com tornozeleira."
	end
	return "A comissão negou a condicional. Preciso de uma ficha melhor."
end
function Prisao.RUN.pr_fugir(game)
	if not vez(game, "fugir") then
		return "Os guardas ainda estão de olho em mim depois da última tentativa."
	end
	game:queue("prisao_fuga", { i = 1, b = 0, rel = {} })
	return nil
end

---------------------------------------------------------------------------
-- fuga: três decisões, como a noite do golpe
---------------------------------------------------------------------------
local FUGA = {
	{ t = "🕳️ O plano", x = "Faz meses que eu observo a rotina. Por onde sair?", ch = {
		{ "Cavar um túnel atrás do pôster da cela", function(m) return (m.will or 50) / 400 end, "Cavei com uma colher durante meses, escondendo a terra nos bolsos." },
		{ "Sair escondid{o} no caminhão da lavanderia", function(m) return m.smarts / 500 end, "Me enfiei no meio dos lençóis sujos e prendi a respiração." },
		{ "Pular o muro na troca de turno", function(m) return (m.fight or 0) / 400 end, "Escalei o muro com uma corda feita de lençóis." },
	} },
	{ t = "🔦 O guarda", x = "Um guarda aparece bem na hora errada.", ch = {
		{ "Subornar o guarda (" .. fmt(20000) .. ")", function(m) return m.money >= 20000 and 0.15 or -0.1 end, "O guarda olhou para o outro lado.", function(m) if m.money >= 20000 then m.money -= 20000 end end },
		{ "Ficar parad{o} no escuro", function() return 0.05 end, "Ele passou a dois metros de mim e não viu nada." },
		{ "Correr", function(m) return (m.fight or 0) / 600 end, "Corri como nunca na vida. O apito tocou atrás de mim." },
	} },
	{ t = "🌲 Lá fora", x = "Passei pelo muro. Agora é sumir.", ch = {
		{ "Pegar carona com um caminhoneiro", function() return 0.05 end, "Um caminhoneiro me levou até a outra cidade sem fazer perguntas." },
		{ "Atravessar o rio a nado", function(m) return (m.health - 50) / 400 end, "A correnteza quase me levou, mas cheguei do outro lado." },
		{ "Me esconder no mato por uma semana", function(m) return (m.will or 50) / 600 end, "Comi o que achei e dormi no chão até a busca acabar." },
	} },
}

Prisao.EVENTS.prisao_fuga = {
	k = "Fuga",
	show = function(game, d)
		local m = game.S.me
		local e = FUGA[d.i] or FUGA[1]
		local ch = {}
		for i, c in e.ch do
			ch[i] = string.gsub(c[1], "{o}", oa(m))
		end
		local p = math.clamp(0.25 + d.b, 0.05, 0.85)
		return e.t, string.format("%s\n\nChance agora: %d%%", e.x, Util.round(p * 100)), ch
	end,
	pick = function(game, i, d)
		local m = game.S.me
		local e = FUGA[d.i] or FUGA[1]
		local c = e.ch[i]
		if not m.prison or not c then
			return ""
		end
		d.b += c[2](m)
		if c[4] then
			c[4](m)
		end
		table.insert(d.rel, c[3])
		if d.i < #FUGA then
			game:queue("prisao_fuga", { i = d.i + 1, b = d.b, rel = d.rel })
			return c[3]
		end
		local narrado = table.concat(d.rel, " ")
		if R.chance(math.clamp(0.25 + d.b, 0.05, 0.85)) then
			local p = m.prison
			m.c.foragido = { crime = p.crime, anos = p.anos }
			m.prison = nil
			m.c.fugas = (m.c.fugas or 0) + 1
			m.fame = clamp((m.fame or 0) + 15)
			game:log("🏃 Fugi da prisão. Agora sou foragid" .. oa(m) .. ".", "big")
			return narrado .. "\n\nAmanheci livre, com outro nome e o meu rosto em todos os jornais."
		end
		local p = m.prison
		p.anos += 2
		p.total += 2
		p.comp -= 30
		fixP(p)
		game:st("health", -R.int(5, 15))
		return narrado .. "\n\nOs cães me acharam antes do amanhecer. Mais dois anos de pena e um mês na solitária."
	end,
}

Prisao.EVENTS.prisao_recaptura = {
	k = "Polícia",
	show = function(game)
		return "🚨 Me acharam", "A polícia descobriu onde eu estava escondid" .. oa(game.S.me) .. ". Há viaturas na rua.", { "Me entregar", "Fugir de novo" }
	end,
	pick = function(game, i)
		local m = game.S.me
		local f = m.c.foragido
		if not f then
			return ""
		end
		if i == 2 and R.chance(0.45) then
			return "Escapei pelos fundos e mudei de cidade de novo."
		end
		local resto = type(f) == "table" and f.anos or 3
		local crime = type(f) == "table" and f.crime or "fuga"
		Prisao.prender(game, crime, resto + 1, resto + 3)
		return i == 1 and "Me entreguei. A fuga somou anos à pena." or "Não deu. Me algemaram no meio da rua."
	end,
}

-- eventos do ano na cadeia: { título, texto, escolhas = { texto, efeito(game, p) -> resultado } }
local VIDA = {
	{ "🔥 Rebelião no pavilhão", "Os detentos tomaram o pavilhão e fizeram guardas de reféns.", {
		{ "Participar", function(game, p) local m = game.S.me m.fight = clamp((m.fight or 0) + 5) p.comp -= 20 if R.chance(0.4) then p.anos += 2 p.total += 2 return "A rebelião acabou mal. Os líderes ganharam mais dois anos, e eu estava entre eles." end return "Gritei, quebrei coisas e saí sem ninguém me identificar." end },
		{ "Ficar na cela", function(game, p) p.comp += 5 return "Fiquei deitad" .. oa(game.S.me) .. " na cela até a polícia retomar o pavilhão." end },
		{ "Ajudar um guarda a escapar", function(_, p) p.comp += 20 if R.chance(0.4) and p.anos > 1 then p.anos -= 1 return "O guarda contou ao diretor. Ganhei um ano de redução e alguns inimigos." end return "O guarda agradeceu. O pavilhão inteiro me olha torto agora." end },
	} },
	{ "🛡️ Proteção", "Um grupo do pavilhão oferece proteção em troca de " .. fmt(5000) .. " por ano.", {
		{ "Pagar", function(game) local m = game.S.me m.money -= math.min(math.max(0, m.money), 5000) return "Paguei. Ninguém mais encosta em mim." end },
		{ "Recusar", function(game) if R.chance(0.5) then game:st("health", -R.int(5, 15)) return "Recusei. Na semana seguinte me pegaram no chuveiro." end return "Recusei e encarei. Eles me deixaram em paz." end },
	} },
	{ "👪 Dia de visita", "A família pode me visitar no domingo.", {
		{ "Receber a visita", function(game) game:st("happy", 10) for _, q in game:people("mae", "pai", "conjuge", "filho") do q.bond = clamp(q.bond + 4) end return "Chorei abraçado com quem veio. A semana ficou mais leve." end },
		{ "Pedir para não virem", function(game) game:st("happy", -5) return "Não quis que me vissem aqui. O domingo foi longo." end },
	} },
	{ "📦 Contrabando", "Um colega de cela quer esconder um celular no meu colchão.", {
		{ "Aceitar", function(game, p) local m = game.S.me if R.chance(0.35) then p.comp -= 25 p.anos += 1 p.total += 1 return "Os guardas fizeram revista. Mais um ano de pena." end m.money += 2000 return "Ninguém achou. Ele me pagou pelo favor." end },
		{ "Recusar", function(_, p) p.comp += 5 return "Recusei. Ele achou outro colchão." end },
	} },
	{ "🍽️ Confusão no refeitório", "Um detento derrubou a minha bandeja de propósito.", {
		{ "Revidar", function(game, p) local m = game.S.me if R.chance(0.4 + (m.fight or 0) / 250) then m.fight = clamp((m.fight or 0) + 4) p.comp -= 8 return "Revidei. Ele nunca mais olhou para a minha mesa." end game:st("health", -R.int(5, 12)) p.comp -= 10 return "Revidei e levei a pior." end },
		{ "Engolir o orgulho", function(game, p) p.comp += 3 game:st("happy", -4) return "Peguei outra bandeja e comi calad" .. oa(game.S.me) .. "." end },
	} },
	{ "📚 Remição pela leitura", "A prisão abriu um programa: cada livro resenhado conta dias a menos na pena.", {
		{ "Entrar no programa", function(game, p) local m = game.S.me m.smarts = clamp(m.smarts + 3) p.comp += 6 if R.chance(0.35) and p.anos > 1 then p.anos -= 1 return "Li doze livros no ano. Ganhei um ano a menos." end return "Li e resenhei vários livros. A ficha melhorou." end },
		{ "Não tenho paciência", function() return "Deixei a vaga para outro." end },
	} },
}
for i, e in VIDA do
	Prisao.EVENTS["prisao_vida" .. i] = {
		k = "Prisão",
		show = function()
			local ch = {}
			for j, c in e[3] do
				ch[j] = c[1]
			end
			return e[1], e[2], ch
		end,
		pick = function(game, j)
			local m = game.S.me
			local c = e[3][j]
			if not m.prison or not c then
				return ""
			end
			local t = c[2](game, m.prison)
			fixP(m.prison)
			return t
		end,
	}
end

---------------------------------------------------------------------------
-- todo ano
---------------------------------------------------------------------------
-- devolve true quando cuidou dos eventos do ano (preso não tem os eventos comuns)
function Prisao.year(game): boolean
	local m = game.S.me
	if not m.alive then
		return false
	end
	if m.c.foragido and not m.prison then
		if R.chance(0.12) then
			game:queue("prisao_recaptura", {})
		end
		return false
	end
	local p = m.prison
	if not p then
		return false
	end
	p.cumpridos += 1
	p.anos -= 1
	p.comp += R.int(0, 4)
	fixP(p)
	if p.anos <= 0 then
		soltar(game)
		return false
	end
	if R.chance(0.8) then
		game:queue("prisao_vida" .. R.int(1, #VIDA), {})
	end
	return true
end

---------------------------------------------------------------------------
-- tela: Carreira mostra a prisão no topo
---------------------------------------------------------------------------
function Prisao.views(game, V, actRow, allowed)
	local m = game.S.me
	local p = m.prison
	local career = V.career and V.career.items
	if not career then
		return
	end
	if not p then
		if m.c.foragido then
			table.insert(career, 1, { card = { { p = "🏃 Sou foragid" .. oa(m) .. ". A polícia ainda me procura." } } })
		end
		return
	end
	local it = {
		{ sec = "Prisão" },
		{ card = {
			{ "Crime", p.crime }, { "Pena", anos(p.total) }, { "Já cumpri", anos(p.cumpridos) }, { "Falta", anos(p.anos) },
			{ bar = "Comportamento", v = p.comp },
		} },
		actRow(allowed, "pr_cozinha", nil, { ic = "🍳", l = "Trabalhar na cozinha", s = "Comportamento" }),
		actRow(allowed, "pr_curso", nil, { ic = "📘", l = "Curso profissionalizante", s = "Inteligência · pode reduzir a pena" }),
		actRow(allowed, "pr_amizade", nil, { ic = "🤝", l = "Fazer amizade no pavilhão", s = "Luta e felicidade" }),
		actRow(allowed, "pr_briga", nil, { ic = "👊", l = "Brigar no pátio", s = "Respeito · risco de solitária", tone = "bad" }),
		actRow(allowed, "pr_advogado", nil, { ic = "⚖️", l = "Recorrer com advogado", s = fmt(40000) .. " · pode reduzir a pena" }),
		actRow(allowed, "pr_condicional", nil, { ic = "📝", l = "Pedir liberdade condicional", s = p.cumpridos >= math.ceil(p.total / 2) and "Depende do comportamento" or ("A partir de " .. anos(math.ceil(p.total / 2)) .. " cumpridos") }),
		actRow(allowed, "pr_fugir", nil, { ic = "🏃", l = "Tentar fugir", s = "Três decisões · se der errado, mais pena", tone = "bad",
			confirm = { t = "Tentar fugir?", x = "Se me pegarem, são mais dois anos e a solitária.", yes = "Fugir" } }),
	}
	for i = #it, 1, -1 do
		table.insert(career, 1, it[i])
	end
end

return Prisao
