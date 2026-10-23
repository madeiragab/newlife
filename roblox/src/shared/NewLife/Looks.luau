-- ===== Genética e visual das pessoas (porta de randGenes, childOf e ensureLook) =====
-- Aparência coerente com o país; filhos herdam cabelo, olhos, pele e traços dos pais.
-- O visual (cabelo, roupa, óculos, brincos…) é sorteado uma vez e fica guardado na pessoa.

local function dep(path: string)
	if script then
		local node = script.Parent
		for _, part in string.split(path, "/") do
			node = node:WaitForChild(part)
		end
		return require(node)
	end
	return require("./" .. path)
end

local Util = dep("Util")
local FaceParts = dep("Data/FaceParts")
local K = FaceParts.consts
local R = Util.R

local Looks = {}

local HAIR_M = { "curto", "curto", "topete", "lateral", "lateral", "raspado", "cacheado", "black", "dreads", "moicano", "samurai", "longoM" }
local HAIR_F = { "longo", "longo", "rabo", "coque", "tranca", "chanel", "ondulado", "ondulado", "cacheadoF", "chiquinha", "pixie", "franja", "black" }

local function weighted(keys, weights, adjust)
	local list = {}
	for i, k in keys do
		table.insert(list, { k, (weights[i] or 0) * (adjust and adjust(i) or 1) + (i == 1 and 0.01 or 0) })
	end
	return R.wpick(list)
end

function Looks.randGenes(gender: string, cid: string)
	local pop = K.POP[cid] or K.POP.BR
	local idx = {}
	for i = 1, #pop.skin do
		table.insert(idx, i - 1)
	end
	local skin = weighted(idx, pop.skin)
	local dk = skin >= 4
	return {
		hair = weighted(K.HAIR_KEYS, pop.hair, function(i)
			return (dk and i - 1 >= 4) and 0.08 or 1
		end),
		eyes = weighted(K.EYE_KEYS, pop.eyes, function(i)
			local j = i - 1
			return (dk and (j == 3 or j == 4 or j == 6)) and 0.12 or 1
		end),
		h = Util.round(R.norm(gender == "F" and 162 or 175, 7)),
		skin = skin,
		style = R.int(0, 5),
		glasses = R.chance(0.18),
		freckles = R.chance(skin <= 1 and 0.16 or 0.05),
		eyeShape = R.int(0, 3),
	}
end

-- genes de um filho a partir dos pais (a e b são pessoas com .genes)
function Looks.childGenes(a, b, gender: string, cid: string)
	local ga = a.genes or Looks.randGenes(a.gender or "F", cid)
	local gb = b.genes or Looks.randGenes(b.gender or "M", cid)
	local function trait(k)
		local r = R.f()
		if r < 0.04 then
			return Looks.randGenes(gender, cid)[k]
		end
		return r < 0.52 and ga[k] or gb[k]
	end
	return {
		hair = trait("hair"),
		eyes = trait("eyes"),
		h = Util.round(((ga.h or 170) + (gb.h or 170)) / 2 + R.norm(0, 4)),
		skin = math.clamp(Util.round(((ga.skin or 2) + (gb.skin or 2)) / 2 + R.norm(0, 0.6)), 0, #K.SKINS - 1),
		style = R.chance(0.5) and (R.chance(0.5) and (ga.style or 0) or (gb.style or 0)) or R.int(0, 5),
		glasses = R.chance((ga.glasses or gb.glasses) and 0.35 or 0.1),
		freckles = R.chance((ga.freckles or gb.freckles) and 0.4 or 0.06),
		eyeShape = R.chance(0.5) and (ga.eyeShape or 0) or (gb.eyeShape or 0),
	}
end

function Looks.ensure(p)
	if p.look then
		return p.look
	end
	local ge = p.genes
	local M = p.gender == "M"
	local hair = R.pick(M and HAIR_M or HAIR_F)
	if M and R.chance(0.06) then
		hair = "careca"
	end
	local beards = {}
	for i = 2, #K.BEARDS do
		table.insert(beards, K.BEARDS[i])
	end
	p.look = {
		hair = hair,
		top = R.pick(M and K.TOPS_M or K.TOPS_F),
		brow = R.pick(K.BROWS),
		beard = M and R.chance(0.38) and R.pick(beards) or "none",
		glasses = ge and ge.glasses and R.pick({ "redondo", "quadrado", M and "quadrado" or "gatinho" }) or "none",
		hat = "none",
		ear = (not M and R.chance(0.55)) and R.pick({ "ponto", "argola", "perola" }) or ((M and R.chance(0.08)) and "ponto" or "none"),
		pierce = R.chance(0.06) and R.pick({ "nariz", "sobrancelha", "labio" }) or "none",
		makeup = (not M and R.chance(0.35)) and R.pick({ "batom", "rosa", "blush", "delineado" }) or "none",
		shirt = R.pick(K.SHIRTS),
		hatColor = R.pick(K.SHIRTS),
	}
	return p.look
end

-- o que a tela precisa para desenhar o rosto
function Looks.face(p, mood: number?, isMe: boolean?)
	return {
		id = (not isMe) and p.id or nil,
		gender = p.gender,
		age = p.age,
		alive = p.alive,
		genes = p.genes,
		look = p.look,
		mood = mood or p.bond or 60,
	}
end

return Looks
