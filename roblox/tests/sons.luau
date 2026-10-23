-- Confere os sons: cada efeito que o motor pede existe em Sons.luau e os trechos cabem no arquivo
local process = require("@lune/process")
local Util = require("../src/shared/NewLife/Util")
local Engine = require("../src/shared/NewLife/Engine")
local View = require("../src/shared/NewLife/View")
local Sons = require("../src/shared/NewLife/Sons")

local bad = 0
local function check(cond, msg)
	if not cond then
		bad += 1
		print("  " .. msg)
	end
end

local fim = 0
for name, r in Sons.efeitos do
	check(r[1] >= 0 and r[2] > 0, "trecho inválido: " .. name)
	fim = math.max(fim, r[1] + r[2])
end

-- frases que precisam do som certo (mesmas regras de soundForLine em src/sound.js)
local casos = {
	{ "Morri de um AVC, aos 80 anos.", "big", "death" },
	{ "Casei com Ana! A festa custou $15.000.", nil, "bells" },
	{ "Nasceu minha irmã Clara!", "good", "baby" },
	{ "Recebi $20.570 de herança.", "good", "cash" },
	{ "Fui promovida a gerente!", "good", "promo" },
	{ "Fui preso por furto.", "bad", "siren" },
	{ "Trabalho na empresa nova.", nil, nil },
	{ "Perdi o emprego.", "bad", "bad" },
}
for _, c in casos do
	check(Engine.soundForLine(c[1], c[2]) == c[3], string.format("som de %q: %s (esperado %s)", c[1], tostring(Engine.soundForLine(c[1], c[2])), tostring(c[3])))
end

local vistos = {}
for seed = 1, 60 do
	Util.seed(seed)
	local g = Engine.new()
	g:newLife()
	while g.S.me.alive do
		g:ageUp()
		while g:currentEvent() do
			g:choose(1)
		end
		for _, n in View.build(g, {}).fx do
			vistos[n] = true
			check(Sons.efeitos[n] ~= nil, "o motor pediu um som que não existe: " .. n)
		end
	end
end
local lista = {}
for n in vistos do
	table.insert(lista, n)
end
table.sort(lista)
print(string.format("%d efeitos (%.1f s); sons que tocaram em 60 vidas: %s", #lista, fim, table.concat(lista, ", ")))
if bad > 0 then
	print(bad .. " problema(s)")
	process.exit(1)
end
print("Sons ok.")
