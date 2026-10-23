-- ===== Teste da versão Roblox: simula vidas inteiras fora do Studio (Lune) =====
-- Uso: lune run tests/vidas.luau [quantidade]
-- Cada vida usa uma semente fixa, faz escolhas e atividades sorteadas e confere se nada quebra:
-- erros no motor, atributos fora de 0-100, marcadores {x} sem preencher, saves que não voltam do JSON.

local process = require("@lune/process")
local serde = require("@lune/serde")

local Util = require("../src/shared/NewLife/Util")
local Engine = require("../src/shared/NewLife/Engine")
local Actions = require("../src/shared/NewLife/Actions")

local N = tonumber(process.args[1]) or 300
local R = Util.R
local fails = {}
local stats = { anos = 0, eventos = 0, acoes = 0, idades = {}, vistos = {} }

local function fail(seed, msg)
	table.insert(fails, string.format("semente %d: %s", seed, msg))
end

local function checkText(seed, s, where)
	local left = string.match(s, "{%w*}")
	if left then
		fail(seed, string.format("marcador %s sem preencher em %s: %s", left, where, s))
	end
end

local ATTRS = { "happy", "health", "smarts", "looks", "karma", "fame" }

for seed = 1, N do
	Util.seed(seed)
	local game = Engine.new()
	local ok, err = pcall(function()
		game:newLife()
		local years = 0
		while game.S.me.alive do
			years += 1
			if years > 130 then
				fail(seed, "a vida passou de 130 anos")
				break
			end
			-- algumas atividades por ano
			for _ = 1, R.int(0, 3) do
				local list = Actions.list(game)
				local a = R.pick(list)
				if a then
					local msg = Actions.run(game, a.id, a.arg)
					stats.acoes += 1
					if msg then
						checkText(seed, msg, "atividade " .. a.id)
					end
				end
			end
			game:ageUp()
			stats.anos += 1
			while #game.S.pending > 0 do
				local id = game.S.pending[1].id
				local ev = game:currentEvent()
				if not ev then
					break
				end
				stats.vistos[id] = true
				checkText(seed, ev.title .. " " .. ev.text .. " " .. table.concat(ev.choices, " "), "evento " .. id)
				local res = game:choose(R.int(1, #ev.choices))
				stats.eventos += 1
				checkText(seed, res or "", "resultado do evento " .. id)
			end
			for _, k in ATTRS do
				local v = game.S.me[k]
				if type(v) ~= "number" or v < 0 or v > 100 or v ~= v then
					fail(seed, string.format("%s inválido (%s) aos %d anos", k, tostring(v), game.S.me.age))
				end
			end
			if game.S.me.money ~= game.S.me.money then
				fail(seed, "dinheiro virou NaN")
			end
			-- de vez em quando, salva e carrega como o DataStore faria
			if years % 25 == 0 then
				local json = serde.encode("json", game:export())
				local copy = Engine.new()
				if not copy:import(serde.decode("json", json)) then
					fail(seed, "save não voltou do JSON")
				end
				game = copy
			end
		end
		local idade = game.S.me.age
		stats.idades[#stats.idades + 1] = idade
		for _, y in game.S.log do
			for _, l in y.lines do
				checkText(seed, l.t, "diário")
			end
		end
	end)
	if not ok then
		fail(seed, "erro: " .. tostring(err))
	end
end

table.sort(stats.idades)
local soma = 0
for _, a in stats.idades do
	soma += a
end
local vistos = 0
for _ in stats.vistos do
	vistos += 1
end
print(string.format("Vidas: %d · anos simulados: %d · eventos: %d · atividades: %d", N, stats.anos, stats.eventos, stats.acoes))
print(string.format("Idade média ao morrer: %.1f · mediana: %d", soma / math.max(1, #stats.idades), stats.idades[math.max(1, #stats.idades // 2)] or 0))
print(string.format("Eventos diferentes que apareceram: %d de %d", vistos, Engine.EVENT_COUNT))
if #fails > 0 then
	print(string.format("\n%d problema(s):", #fails))
	for i = 1, math.min(40, #fails) do
		print("  " .. fails[i])
	end
	process.exit(1)
end
print("Tudo certo.")
