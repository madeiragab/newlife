-- Imprime o diário de uma vida (semente opcional), para conferir os textos à mão.
local process = require("@lune/process")
local Util = require("../src/shared/NewLife/Util")
local Engine = require("../src/shared/NewLife/Engine")
local Actions = require("../src/shared/NewLife/Actions")
Util.seed(tonumber(process.args[1]) or 7)
local game = Engine.new()
game:newLife()
while game.S.me.alive do
	local a = Util.R.pick(Actions.list(game))
	if a then Actions.run(game, a.id, a.arg) end
	game:ageUp()
	while game:currentEvent() do
		local ev = game:currentEvent()
		game:choose(Util.R.int(1, #ev.choices))
	end
end
for _, y in game.S.log do
	print(string.format("— %d anos (%d)", y.age, y.year))
	for _, l in y.lines do print("   " .. l.t) end
end
