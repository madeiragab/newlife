-- ===== Crime: assassinato no nível de Murder Mystery (sem arma, método ou detalhe) =====
-- A web (src/systems.js, src/ajustes_209.js) tem o minijogo de esconder o corpo; aqui fica só a decisão
-- e as consequências: a pessoa pode escapar e virar inimiga, a polícia pode investigar no mesmo ano ou
-- reabrir o caso depois, e o julgamento termina em absolvição, prisão (Prisao.luau) ou fuga.

local Util = require(script and script.Parent:WaitForChild("Util") or "./Util")
local Prisao = require(script and script.Parent:WaitForChild("Prisao") or "./Prisao")
local R, clamp, fmt = Util.R, Util.clamp, Util.fmt

local Crime = {}
Crime.RUN = {}
Crime.EVENTS = {}
Crime.TITLE = { assassinar = "Crime" }

local function oa(m)
	return m.gender == "F" and "a" or "o"
end

local NAO_ALVO = { colega = true }

function Crime.list(game, add)
	local m = game.S.me
	if m.age < 18 or (m.yr.assassinar or 0) >= 1 then
		return
	end
	for _, p in game:people() do
		if not NAO_ALVO[p.rel] then
			add("assassinar", "Assassinar " .. p.first, "Crime", p.id)
		end
	end
end

function Crime.RUN.assassinar(game, id)
	local m = game.S.me
	local p = game:P(id)
	if not p or not p.alive then
		return nil
	end
	m.yr.assassinar = (m.yr.assassinar or 0) + 1
	m.c.crimes = (m.c.crimes or 0) + 1
	if not R.chance(0.55 + (m.fight or 0) / 400) then
		p.rel = "inimigo"
		p.bond = 0
		m.karma = clamp(m.karma - 15)
		if R.chance(0.4) then
			game:queue("crime_julgamento", { nome = p.first, tentativa = true })
			return string.format("%s percebeu a tempo, escapou e foi direto à polícia.", p.first)
		end
		return string.format("%s percebeu a tempo e escapou. Agora sabe do que eu sou capaz.", p.first)
	end
	local nome, rel = p.first .. " " .. p.last, game:relLabel(p)
	p.alive = false
	m.karma = clamp(m.karma - 40)
	game:st("happy", -10)
	if p.rel == "conjuge" then
		game:cnt("widow")
	end
	game:log(string.format("%s %s morreu, e a culpa foi minha.", rel, nome), "bad")
	if (p.rel == "mae" or p.rel == "pai" or p.rel == "conjuge") and (p.money or 0) > 1000 and R.chance(0.6) then
		local v = Util.round(p.money * 0.5)
		m.money += v
		game:log("Recebi " .. fmt(v) .. " de herança.", "good")
	end
	if R.chance(0.25) then
		game:queue("crime_julgamento", { nome = p.first })
		return string.format("%s não está mais entre nós. Uma testemunha me viu por perto, e a polícia já bateu na porta.", p.first)
	end
	m.c.caso = { nome = p.first, ano = game.S.year }
	return string.format("%s não está mais entre nós. Por enquanto, ninguém desconfiou de mim.", p.first)
end

-- todo ano: o caso pode ser reaberto
function Crime.year(game)
	local m = game.S.me
	local caso = m.c.caso
	if caso and m.alive then
		if game.S.year - caso.ano > 15 then
			m.c.caso = nil
		elseif R.chance(0.15) then
			m.c.caso = nil
			game:queue("crime_julgamento", { nome = caso.nome, reaberto = true })
		end
	end
end

Crime.EVENTS.crime_julgamento = {
	k = "Crime",
	show = function(game, d)
		local x = d.tentativa and string.format("%s me denunciou por tentativa de assassinato. O caso vai a julgamento.", d.nome)
			or d.reaberto and string.format("A polícia reabriu o caso da morte de %s. Encontraram provas novas, e todas apontam para mim.", d.nome)
			or string.format("Fui acusad%s pela morte de %s. O caso vai a julgamento.", oa(game.S.me), d.nome)
		return "⚖️ No banco dos réus", x, { "Contratar o melhor advogado (" .. fmt(80000) .. ")", "Confessar e pedir clemência", "Fugir do país antes do julgamento" }
	end,
	pick = function(game, i, d)
		local m = game.S.me
		local function condena(min: number, max: number): string
			local v = Util.round(math.max(0, m.money) * 0.2)
			m.money -= v
			m.fame = clamp((m.fame or 0) + 10)
			m.c.condenado = (m.c.condenado or 0) + 1
			local n = d.tentativa and Prisao.prender(game, "tentativa de assassinato", math.max(1, min - 4), math.max(2, max - 8))
				or Prisao.prender(game, "assassinato", min, max)
			return string.format(" A pena: %d anos de prisão.%s", n, v > 0 and (" E " .. fmt(v) .. " de indenização à família.") or "")
		end
		if i == 1 then
			if m.money < 80000 then
				return "Não tinha dinheiro para um bom advogado. O defensor público fez o que pôde, e fui condenad" .. oa(m) .. "." .. condena(10, 25)
			end
			m.money -= 80000
			if R.chance(d.tentativa and 0.6 or 0.45) then
				return "O advogado desmontou as provas uma por uma. Fui absolvid" .. oa(m) .. ", mas a cidade inteira me olha torto."
			end
			return "Nem o melhor advogado deu jeito. Fui condenad" .. oa(m) .. "." .. condena(8, 20)
		elseif i == 2 then
			m.karma = clamp(m.karma + 10)
			return "Confessei tudo e pedi perdão à família. A pena foi menor do que podia." .. condena(5, 12)
		end
		m.money = Util.round(math.max(0, m.money) * 0.4)
		m.c.foragido = { crime = d.tentativa and "tentativa de assassinato" or "assassinato", anos = R.int(8, 15) }
		game:st("happy", -15)
		return "Atravessei a fronteira de madrugada com o que coube numa mochila. Agora vivo com um nome falso."
	end,
}

return Crime
