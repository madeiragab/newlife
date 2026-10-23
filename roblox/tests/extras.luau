-- Testa a máquina do tempo e o modo deus (gamepasses)
local process = require("@lune/process")
local Util = require("../src/shared/NewLife/Util")
local Engine = require("../src/shared/NewLife/Engine")
local View = require("../src/shared/NewLife/View")
Util.seed(9)
local g = Engine.new()
g:newLife({})
for _ = 1, 8 do
	g:ageUp()
	while g:currentEvent() do g:choose(1) end
end
local bad = 0
local function check(c, msg) if not c then bad += 1 print("  " .. msg) end end
check(#g.snaps == 5, "máquina do tempo guarda 5 anos (tem " .. #g.snaps .. ")")
local alvo = g.snaps[2].age
check(g:timeTravel(2), "voltar no tempo funcionou")
check(g.S.me.age == alvo, "voltou para a idade certa")
check(#g.snaps == 1, "pontos depois do escolhido saem")
local h = g.S.me.happy
g:godSet("happy", -10)
check(g.S.me.happy == math.max(0, h - 10), "modo deus mexe na felicidade")
local mny = g.S.me.money
g:godSet("money", 10)
check(g.S.me.money == mny + 10000, "modo deus mexe no dinheiro")
check(not g:godSet("nada", 5), "modo deus recusa chave desconhecida")
local v = View.build(g, { prefs = {}, grave = {}, passes = { deus = true, tempo = true } })
check(v.views.god ~= nil and v.views.time ~= nil, "telas do modo deus e da máquina do tempo")
if bad > 0 then process.exit(1) end
print("Extras ok.")
