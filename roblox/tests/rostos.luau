-- Desenha rostos com FaceSvg + Svg e grava RGBA cru (para comparar com o navegador).
-- Uso: lune run tests/rostos.luau <pasta com specs.json e ref.json>
local fs = require("@lune/fs")
local serde = require("@lune/serde")
local process = require("@lune/process")
local Svg = require("../src/shared/NewLife/Svg")
local FaceSvg = require("../src/shared/NewLife/FaceSvg")

local dir = process.args[1]
local specs = serde.decode("json", fs.readFile(dir .. "/specs.json"))
local refs = serde.decode("json", fs.readFile(dir .. "/ref.json"))
local SIZE = 192
local function save(name, list)
	local cols = 4
	local rows = math.ceil(#list / cols)
	local out = buffer.create(SIZE * cols * SIZE * rows * 4)
	for k, b in list do
		local cx, cy = (k - 1) % cols, (k - 1) // cols
		for y = 0, SIZE - 1 do
			buffer.copy(out, ((cy * SIZE + y) * SIZE * cols + cx * SIZE) * 4, b, y * SIZE * 4, SIZE * 4)
		end
	end
	fs.writeFile(dir .. "/" .. name, buffer.tostring(out))
end
local t0 = os.clock()
local mine, theirs = {}, {}
for i, s in specs do
	s.mood = s.mood
	table.insert(mine, Svg.render(FaceSvg.build(s), SIZE))
	table.insert(theirs, Svg.render(refs[i], SIZE))
end
print(string.format("%d rostos em %.2f s (dois desenhos cada)", #specs, os.clock() - t0))
save("lua.rgba", mine)
save("luaref.rgba", theirs)
local t1 = os.clock()
for _ = 1, 5 do
	Svg.render(FaceSvg.build(specs[1]), 96)
end
print(string.format("rosto de 96 px: %.0f ms", (os.clock() - t1) / 5 * 1000))
