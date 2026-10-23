-- ===== Utilidades: aleatoriedade, números e textos =====
-- Funciona igual no Roblox e no Lune (testes fora do Studio).

local Util = {}

-- Gerador próprio (mulberry32) em vez do Random do Roblox: o mesmo código roda nos testes com Lune
-- e uma semente fixa repete a vida inteira.
local state = 0
-- multiplicação de 32 bits em metades para não perder precisão no double
local function mul(a: number, b: number): number
	local lo = bit32.band(a, 0xFFFF) * b
	local hi = bit32.band(bit32.rshift(a, 16) * b, 0xFFFF)
	return bit32.band(lo + hi * 0x10000, 0xFFFFFFFF)
end
local function nextNumber(): number
	state = bit32.band(state + 0x6D2B79F5, 0xFFFFFFFF)
	local t = state
	t = mul(bit32.bxor(t, bit32.rshift(t, 15)), bit32.bor(t, 1))
	t = bit32.bxor(t, bit32.band(t + mul(bit32.bxor(t, bit32.rshift(t, 7)), bit32.bor(t, 61)), 0xFFFFFFFF))
	return bit32.bxor(t, bit32.rshift(t, 14)) / 4294967296
end
local rng = { NextNumber = function(_) return nextNumber() end }

function Util.seed(n: number)
	state = bit32.band(math.floor(n), 0xFFFFFFFF)
end
Util.seed(math.floor(os.clock() * 1e6) + os.time())

local R = {}
Util.R = R
function R.f(): number
	return rng:NextNumber()
end
function R.int(a: number, b: number): number
	return a + math.floor(rng:NextNumber() * (b - a + 1))
end
function R.pick<T>(arr: { T }): T?
	if #arr == 0 then
		return nil
	end
	return arr[math.floor(rng:NextNumber() * #arr) + 1]
end
function R.chance(p: number): boolean
	return rng:NextNumber() < p
end
function R.norm(m: number, sd: number): number
	local u, v = 0, 0
	while u == 0 do
		u = rng:NextNumber()
	end
	while v == 0 do
		v = rng:NextNumber()
	end
	return m + sd * math.sqrt(-2 * math.log(u)) * math.cos(2 * math.pi * v)
end
-- lista de {valor, peso}
function R.wpick(list)
	local tot = 0
	for _, x in list do
		tot += x[2]
	end
	local r = rng:NextNumber() * tot
	for _, x in list do
		r -= x[2]
		if r < 0 then
			return x[1]
		end
	end
	return list[#list][1]
end
function R.shuffle<T>(a: { T }): { T }
	local b = table.clone(a)
	for i = #b, 2, -1 do
		local j = math.floor(rng:NextNumber() * i) + 1
		b[i], b[j] = b[j], b[i]
	end
	return b
end

function Util.round(v: number): number
	return math.floor(v + 0.5)
end

function Util.clamp(v: number, a: number?, b: number?): number
	return math.max(a or 0, math.min(b or 100, Util.round(v)))
end

-- dinheiro no formato do jogo: $12.345 / -$800
function Util.fmt(n: number): string
	local s = tostring(math.abs(Util.round(n)))
	local out = s:reverse():gsub("(%d%d%d)", "%1."):reverse()
	if out:sub(1, 1) == "." then
		out = out:sub(2)
	end
	return (n < 0 and "-$" or "$") .. out
end

-- "Rei|Rainha" -> conforme o gênero
function Util.g(t: string?, gender: string?): string?
	if not t then
		return t
	end
	local a, b = t:match("^([^|]*)|(.*)$")
	if not a then
		return t
	end
	return (gender == "F" and b ~= "") and b or a
end

function Util.deepCopy(t)
	if type(t) ~= "table" then
		return t
	end
	local c = {}
	for k, v in t do
		c[k] = Util.deepCopy(v)
	end
	return c
end

function Util.split(s: string, sep: string): { string }
	local out = {}
	local start = 1
	while true do
		local i = string.find(s, sep, start, true)
		if not i then
			table.insert(out, string.sub(s, start))
			break
		end
		table.insert(out, string.sub(s, start, i - 1))
		start = i + #sep
	end
	return out
end

function Util.words(s: string?): { string }
	local out = {}
	for w in string.gmatch(s or "", "%S+") do
		table.insert(out, w)
	end
	return out
end

return Util
