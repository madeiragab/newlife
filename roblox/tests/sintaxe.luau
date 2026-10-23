-- Compila todos os scripts Luau da versão Roblox para pegar erro de sintaxe antes do deploy
-- (inclusive os do cliente e do servidor, que só rodam dentro do Roblox).
local fs = require("@lune/fs")
local luau = require("@lune/luau")
local process = require("@lune/process")

local bad = 0
local n = 0
local function walk(dir)
	for _, name in fs.readDir(dir) do
		local path = dir .. "/" .. name
		if fs.isDir(path) then
			walk(path)
		elseif string.match(name, "%.luau$") then
			n += 1
			local ok, err = pcall(luau.compile, fs.readFile(path))
			if not ok then
				bad += 1
				print(path .. ": " .. tostring(err))
			end
		end
	end
end
walk("src")
print(string.format("%d arquivos Luau, %d com erro", n, bad))
if bad > 0 then
	process.exit(1)
end
