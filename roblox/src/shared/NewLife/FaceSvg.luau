-- ===== Rostos: porta de faceSVG (src/faces.js) =====
-- Monta o MESMO SVG do jogo do navegador para uma pessoa; Svg.luau desenha o resultado.
-- As peças (cabelos, roupas, barbas, óculos, chapéus) vêm prontas de Data/FaceParts.luau, geradas a
-- partir de src/faces.js por roblox/tools/rostos.cjs. Doenças, criaturas e modos fictícios ainda não
-- existem no Roblox, então esses ramos ficam de fora.

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

local FaceParts = dep("Data/FaceParts")
local P, K = FaceParts.parts, FaceParts.consts

local FaceSvg = {}

local function hexRGB(h: string)
	return tonumber(string.sub(h, 2, 3), 16), tonumber(string.sub(h, 4, 5), 16), tonumber(string.sub(h, 6, 7), 16)
end
local function mixHex(a: string, b: string, t: number): string
	local r1, g1, b1 = hexRGB(a)
	local r2, g2, b2 = hexRGB(b)
	local function m(x, y)
		return math.floor(x + (y - x) * t + 0.5)
	end
	return string.format("#%02x%02x%02x", m(r1, r2), m(g1, g2), m(b1, b2))
end
FaceSvg.mixHex = mixHex

local function isHex(c): boolean
	return type(c) == "string" and string.match(c, "^#%x%x%x%x%x%x$") ~= nil
end

-- troca {{var}} e resolve [[mix A;B;t]] de dentro para fora
local function tpl(s: string?, vars): string
	if not s or s == "" then
		return ""
	end
	s = string.gsub(s, "{{(%w+)}}", function(k)
		return vars[k] or ("{{" .. k .. "}}")
	end)
	while string.find(s, "[[mix ", 1, true) do
		local n
		s, n = string.gsub(s, "%[%[mix (#%x+);(#%x+);([%d%.]+)%]%]", function(a, b, t)
			return mixHex(a, b, tonumber(t))
		end)
		if n == 0 then
			break
		end
	end
	return s
end

local function num(x: number): string
	local s = string.format("%.3f", x)
	s = string.gsub(s, "0+$", "")
	s = string.gsub(s, "%.$", "")
	return s
end

local SW = K.SW or 1.1
local function ol(w: number?, c: string)
	return string.format('stroke="%s" stroke-width="%s" stroke-linejoin="round" stroke-linecap="round"', c, num(w or SW))
end

local BROW_W = { fina = 1.8, grossa = 3.3, arqueada = 2.5 }
local HAIR_ORDER = {}
for id in P.hair do
	table.insert(HAIR_ORDER, id)
end

-- p: { id, gender, age, alive, prison, mood, genes = {hair, eyes, skin, eyeShape, freckles}, look = {...} }
function FaceSvg.build(p, uidPrefix: string?): string
	local L = p.look or {}
	local ge = p.genes or {}
	local age = p.age or 30
	local dead = p.alive == false
	local topId = L.top
	if p.prison then
		topId = "uniforme"
	end
	local skin = K.SKINS[(ge.skin or 2) + 1] or K.SKINS[3]
	local dark = mixHex(skin, "#5A2A18", 0.38)
	local skinEdge = mixHex(skin, "#3A1A10", 0.4)
	local neck = mixHex(skin, "#5A2A18", 0.1)
	local hc0 = L.dye or K.HAIR_HEX[ge.hair or ""] or "#4A2E1E"
	local gray = L.dye and 0 or age >= 75 and 0.9 or age >= 65 and 0.72 or age >= 56 and 0.5 or age >= 48 and 0.26 or age >= 42 and 0.1 or 0
	local hc = gray > 0 and mixHex(hc0, "#E6E6E6", gray) or hc0
	local hs = mixHex(hc, "#000000", 0.4)
	local hairEdge = mixHex(hc, "#000000", 0.5)
	local ec = K.EYE_HEX[ge.eyes or ""] or "#6a4a2a"
	local mood = p.mood or 60
	local id = (uidPrefix or "f") .. tostring(p.id or 7)
	local uid = p.id or 7
	local baby, small, kid = age < 2, age < 8, age < 13
	local teen = age >= 13 and age < 18
	local adult = not kid and age >= 15
	local F = p.gender == "F"
	local tod = age < 5
	local bs = baby and 0.74 or tod and 0.64 or small and 0.74 or kid and 0.84 or teen and 0.92 or 1
	local hsc = baby and 1.12 or tod and 1.12 or small and 1.07 or kid and 1.03 or teen and 1.01 or 1
	local hcy = baby and 57 or tod and 56 or small and 54 or kid and 52 or teen and 50.5 or 50
	local hairId = L.hair or "curto"
	if not F and not baby and ((age >= 50 and uid % 4 == 0) or (age >= 62 and uid % 4 == 1)) then
		hairId = "careca"
	end
	local H = P.hair[hairId] or P.hair.curto
	local hat = P.hat[L.hat or "none"] or P.hat.none
	local head = baby and K.HEAD_BABY or kid and K.HEAD_KID or F and K.HEAD_F or K.HEAD_M
	local dy = baby and 4 or small and 2.5 or kid and 1.5 or 0
	local hairClip = (hat.cut and not baby) and (' clip-path="url(#' .. id .. 'c)"') or ""
	local sx = small and 1 or kid and (F and 0.94 or 1.03) or F and 0.88 or 1.08
	local mAd = not F and age >= 16
	local fAd = F and age >= 13
	local SK = "url(#" .. id .. "sk)"
	local HG = "url(#" .. id .. "hg)"
	local body, hd = {}, {}
	local function B(s)
		table.insert(body, s)
	end
	local function Hh(s)
		table.insert(hd, s)
	end
	-- cabelo da frente/de trás com a cor do degradê; a borda segue a regra edgeOf do jogo
	local function hairTpl(s, fill, strand, edge)
		return tpl(s, { hg = fill, s = strand, edge = isHex(fill) and mixHex(fill, "#000000", 0.42) or edge })
	end

	-- ---- corpo (escala por idade) ----
	if not baby then
		B(string.format('<path d="M42,64 L42,89 Q50,93 58,89 L58,64Z" fill="%s" %s/><path d="M42,68 Q50,80 58,68 L58,64 L42,64Z" fill="%s" opacity=".3"/>', neck, ol(SW, skinEdge), dark))
	end
	local tid = topId or (F and "blusa" or "camiseta")
	if kid and (tid == "social" or tid == "vestido" or tid == "regataM" or tid == "decoteV" or tid == "blusa") then
		tid = F and "golaalta" or "camiseta"
	end
	local top = baby and P.top.macacao or P.top[tid] or P.top.camiseta
	B(tpl(top.d, { c = L.shirt or "#4F6BD8", skin = skin, dark = dark, edge = skinEdge }))
	B('<path d="' .. K.TORSO .. '" fill="url(#' .. id .. 'cl)"/>')
	if mAd and age >= 18 then
		B(string.format('<path d="M49.2,72.5 Q50.9,74.6 49.6,76.8" stroke="%s" stroke-width="1" fill="none" opacity=".45" stroke-linecap="round"/>', dark))
	end
	if age >= 55 then
		B(string.format('<path d="M45.5,72 Q47.5,75 45.5,78 M54.5,72 Q52.5,75 54.5,78" stroke="%s" stroke-width=".8" fill="none" opacity=".55"/>', dark))
	end

	-- ---- cabeça ----
	if not baby and H.back then
		Hh("<g" .. hairClip .. ">" .. hairTpl(H.back, HG, hs, hairEdge) .. "</g>")
	end
	local ex = baby and 39.5 or 40.5
	local ex2 = 100 - ex
	Hh(string.format('<ellipse cx="24.8" cy="%s" rx="4.4" ry="6.2" fill="%s" %s/><ellipse cx="75.2" cy="%s" rx="4.4" ry="6.2" fill="%s" %s/><path d="M25.4,%s Q23,%s 25.4,%s M74.6,%s Q77,%s 74.6,%s" stroke="%s" stroke-width="1.1" fill="none" opacity=".5"/>',
		num(52 + dy), SK, ol(nil, skinEdge), num(52 + dy), SK, ol(nil, skinEdge), num(49.5 + dy), num(52 + dy), num(55 + dy), num(49.5 + dy), num(52 + dy), num(55 + dy), dark))
	Hh('<path d="' .. head .. '" fill="' .. SK .. '" ' .. ol(nil, skinEdge) .. "/>")
	Hh('<g clip-path="url(#' .. id .. 'h)">'
		.. ((not baby and hairId ~= "careca") and ('<g transform="translate(0 2.4)" opacity=".16">' .. hairTpl(H.front, "#3A1A10", "#3A1A10", skinEdge) .. "</g>") or "")
		.. string.format('<path d="M24,%s Q50,%s 76,%s L76,90 L24,90Z" fill="%s" opacity=".08"/></g>', num(66 + dy), num(84 + dy), num(66 + dy), dark))
	-- bochechas, sardas, rugas
	local blushO = baby and 0.45 or kid and 0.32 or (L.makeup == "blush" or L.makeup == "completa") and 0.4 or fAd and 0.22 or 0.08
	Hh(string.format('<ellipse cx="33.5" cy="%s" rx="4.6" ry="2.8" fill="#FF6F86" opacity="%s"/><ellipse cx="66.5" cy="%s" rx="4.6" ry="2.8" fill="#FF6F86" opacity="%s"/>', num(62 + dy), num(blushO), num(62 + dy), num(blushO)))
	if mAd and age >= 20 and (L.beard or "none") == "none" and uid % 3 ~= 0 then
		Hh('<g clip-path="url(#' .. id .. 'h)"><path d="M28.5,58 Q31,74 50,79.5 Q69,74 71.5,58 Q68,70 58.5,71.8 Q54,68.6 50,69.2 Q46,68.6 41.5,71.8 Q32,70 28.5,58Z" fill="' .. mixHex(hc, "#3A3A3A", 0.3) .. '" opacity=".16"/></g>')
	end
	if mAd then
		Hh(string.format('<path d="M30.5,66 Q34,73.5 41,76.6 M69.5,66 Q66,73.5 59,76.6" stroke="%s" stroke-width=".9" fill="none" opacity=".22" stroke-linecap="round"/>', dark))
	end
	if ge.freckles and not baby then
		for _, xy in { { 33, 59 }, { 36, 60.5 }, { 31, 61 }, { 67, 59 }, { 64, 60.5 }, { 69, 61 } } do
			Hh(string.format('<circle cx="%s" cy="%s" r=".8" fill="%s" opacity=".65"/>', num(xy[1]), num(xy[2] + dy), dark))
		end
	end
	if teen and uid % 3 == 0 then
		for _, xy in { { 37, 38 }, { 61, 40 }, { 67, 62 }, { 33, 64 }, { 56, 36 } } do
			Hh(string.format('<circle cx="%s" cy="%s" r=".95" fill="#D9606A" opacity=".7"/>', num(xy[1]), num(xy[2])))
		end
	end
	if age >= 28 then
		local w = math.min(1, (age - 26) / 50)
		local function ln(d, a, sw)
			return string.format('<path d="%s" stroke="%s" stroke-width="%s" fill="none" opacity="%s" stroke-linecap="round"/>', d, dark, num(sw or 0.85), string.format("%.2f", a * (0.35 + 0.65 * w)))
		end
		Hh(ln("M42.8,61 Q40.6,65 42.6,69 M57.2,61 Q59.4,65 57.4,69", age >= 40 and 0.5 or 0.28))
		if age >= 36 then
			Hh(ln("M31.2,51.5 l-2.6,-1.1 M31.2,53.6 l-2.8,.3 M68.8,51.5 l2.6,-1.1 M68.8,53.6 l2.8,.3", 0.55, 0.75))
		end
		if age >= 40 then
			Hh(ln("M41,35.5 Q50,34 59,35.5", 0.5))
		end
		if age >= 48 then
			Hh(ln("M43.5,32 Q50,31 56.5,32 M48,41 L48.6,44 M52,41 L51.4,44", 0.5, 0.75))
		end
		if age >= 56 then
			Hh(ln("M33.5,69.5 Q36.5,74 41,75.5 M66.5,69.5 Q63.5,74 59,75.5", 0.55))
		end
		if age >= 64 then
			local spots = ""
			for i, xy in { { 31, 40 }, { 67, 43 }, { 36, 66 }, { 64, 34 } } do
				if i <= (age >= 72 and 4 or 2) then
					spots ..= string.format('<circle cx="%s" cy="%s" r="1.1" fill="%s" opacity=".22"/>', num(xy[1]), num(xy[2]), dark)
				end
			end
			Hh(ln("M42,38.5 Q50,37.2 58,38.5 M46,71.5 Q50,72.6 54,71.5", 0.45, 0.7) .. spots)
		end
	end
	-- olhos
	local es = kid and 3 or (ge.eyeShape or 0)
	local ge2 = kid and 1 or F and 1.1 or 0.92
	local ey = 52 + dy
	local rx = (((baby or small) and 5.3) or (kid and 4.9) or (teen and 4.6) or 4.4) * (kid and 1 or F and 1.05 or 1)
	local ry = (((baby or small) and 5) or (kid and 4.3) or (es == 3 and 3.9) or (es == 1 and 2.6) or (teen and 3.6) or 3.3) * ge2
	local ir = (((baby or small) and 3.8) or (kid and 3.3) or (es == 1 and 2.3) or (teen and 2.8) or 2.65) * (kid and 1 or F and 1.05 or 1)
	local lidC = "#2B1D18"
	for _, x in { ex, ex2 } do
		local side = x < 50 and -1 or 1
		if dead then
			Hh(string.format('<path d="M%s,%s l6,6 M%s,%s l-6,6" stroke="%s" stroke-width="1.8" stroke-linecap="round"/>', num(x - 3), num(ey - 3), num(x + 3), num(ey - 3), lidC))
		else
			if L.makeup == "completa" then
				Hh(string.format('<path d="M%s,%s Q%s,%s %s,%sZ" fill="#B886D8" opacity=".5"/>', num(x - rx - 0.5), num(ey - 0.5), num(x), num(ey - ry - 4.2), num(x + rx + 0.5), num(ey - 0.5)))
			end
			Hh(string.format('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#FBFBFD"/>', num(x), num(ey), num(rx), num(ry)))
			Hh(string.format('<g clip-path="url(#%se%s)"><circle cx="%s" cy="%s" r="%s" fill="%s"/><circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width=".7"/><circle cx="%s" cy="%s" r="%s" fill="#160E0B"/><circle cx="%s" cy="%s" r="%s" fill="#fff"/></g>',
				id, side > 0 and "r" or "l", num(x + side * 0.2), num(ey + 0.3), num(ir), ec, num(x + side * 0.2), num(ey + 0.3), num(ir), mixHex(ec, "#000000", 0.45),
				num(x + side * 0.2), num(ey + 0.3), num(ir * 0.5), num(x + ir * 0.38), num(ey - ir * 0.35), num(ir * 0.3)))
			if es == 2 and not kid then
				Hh(string.format('<path d="M%s,%s Q%s,%s %s,%s L%s,%s L%s,%sZ" fill="%s"/><path d="M%s,%s Q%s,%s %s,%s" stroke="%s" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
					num(x - rx - 0.4), num(ey + 0.3), num(x), num(ey - ry - 1.2), num(x + rx + 0.4), num(ey + 0.3), num(x + rx + 0.4), num(ey - ry - 1), num(x - rx - 0.4), num(ey - ry - 1), skin,
					num(x - rx - 0.3), num(ey + 0.3), num(x), num(ey - 1.8), num(x + rx + 0.3), num(ey + 0.3), lidC))
			else
				Hh(string.format('<path d="M%s,%s Q%s,%s %s,%s" stroke="%s" stroke-width="%s" fill="none" stroke-linecap="round"/>',
					num(x - rx - 0.2), num(ey + 0.2), num(x), num(ey - ry * 1.45), num(x + rx + 0.2), num(ey + 0.2), lidC, (F and not kid) and "1.9" or "1.5"))
			end
			Hh(string.format('<path d="M%s,%s Q%s,%s %s,%s" stroke="%s" stroke-width=".7" fill="none" opacity=".35"/>', num(x - rx * 0.7), num(ey + ry * 0.85), num(x), num(ey + ry * 1.2), num(x + rx * 0.7), num(ey + ry * 0.85), dark))
			if F and kid and not baby then
				Hh(string.format('<path d="M%s,%s l%s,-1.4 M%s,%s l%s,-1.6" stroke="%s" stroke-width="1.1" stroke-linecap="round"/>', num(x + side * (rx + 0.1)), num(ey - 0.4), num(side * 1.8), num(x + side * rx * 0.7), num(ey - ry * 0.98), num(side * 1.2), lidC))
			end
			if F and not kid then
				Hh(string.format('<path d="M%s,%s l%s,-1.7 M%s,%s l%s,-2 M%s,%s l%s,-2.1" stroke="%s" stroke-width="1.2" stroke-linecap="round"/>',
					num(x + side * (rx + 0.1)), num(ey - 0.4), num(side * 2.2), num(x + side * rx * 0.78), num(ey - ry * 0.95), num(side * 1.6), num(x + side * rx * 0.35), num(ey - ry * 1.2), num(side * 0.9), lidC))
			end
			if age >= 46 then
				Hh(string.format('<path d="M%s,%s Q%s,%s %s,%s" stroke="%s" stroke-width=".8" fill="none" opacity="%s"/>', num(x - 3.4), num(ey + ry + 1.3), num(x), num(ey + ry + 3.4), num(x + 3.4), num(ey + ry + 1.3), dark, age >= 65 and ".5" or age >= 55 and ".38" or ".24"))
			end
			if L.makeup == "delineado" or L.makeup == "completa" then
				Hh(string.format('<path d="M%s,%s Q%s,%s %s,%s L%s,%s" stroke="#141414" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
					num(x - side * rx * 0.1), num(ey - ry * 1.05), num(x + side * rx * 0.7), num(ey - ry * 0.8), num(x + side * (rx + 0.3)), num(ey - 0.3), num(x + side * (rx + 3.2)), num(ey - 2.6)))
			end
		end
	end
	-- sobrancelhas
	if not baby then
		local bw = (BROW_W[L.brow or ""] or 2.5) * (kid and (F and 0.72 or 0.95) or F and 0.72 or 1.25)
		local ang = mood < 30 and 2.4 or 0
		local bc = age >= 68 and mixHex(hc, "#7A7A7A", 0.3) or mixHex(hc, "#000000", 0.38)
		local by = ey - 7.6 - (kid and 0.6 or F and 0.9 or -0.5)
		if L.brow == "arqueada" or (F and not kid) then
			Hh(string.format('<path d="M%s,%s Q%s,%s %s,%s M%s,%s Q%s,%s %s,%s" stroke="%s" stroke-width="%s" fill="none" stroke-linecap="round"/>',
				num(ex - 5.6), num(by + 1.6 + ang), num(ex - 0.5), num(by - 3.6), num(ex + 5.4), num(by + 0.2), num(ex2 - 5.4), num(by + 0.2), num(ex2 + 0.5), num(by - 3.6), num(ex2 + 5.6), num(by + 1.6 + ang), bc, num(bw)))
		else
			Hh(string.format('<path d="M%s,%s Q%s,%s %s,%s M%s,%s Q%s,%s %s,%s" stroke="%s" stroke-width="%s" fill="none" stroke-linecap="round"/>',
				num(ex - 5.6), num(by + 1 + ang), num(ex), num(by - 2.2), num(ex + 5.4), num(by - ang / 2), num(ex2 - 5.4), num(by - ang / 2), num(ex2), num(by - 2.2), num(ex2 + 5.6), num(by + 1 + ang), bc, num(bw)))
		end
	end
	-- nariz
	if baby or small then
		Hh(string.format('<path d="M48.4,%s Q50,%s 51.6,%s" stroke="%s" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".7"/>', num(60 + dy), num(61.4 + dy), num(60 + dy), dark))
	else
		local nl = kid and 0.75 or F and 0.82 or 1.12
		Hh(string.format('<path d="M48.7,%s Q47.3,%s 47.2,%s" stroke="%s" stroke-width="1.1" fill="none" opacity=".3" stroke-linecap="round"/><path d="M%s,%s Q%s,%s 50,%s Q%s,%s %s,%s" stroke="%s" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".62"/><ellipse cx="50.8" cy="%s" rx="1.4" ry="1.1" fill="#fff" opacity=".22"/>',
			num(50 + dy), num(55.5 + dy), num(59 + dy), dark, num(50 - 3.3 * nl), num(59.4 + dy), num(50 - 1.8 * nl), num(61.8 + dy), num(61.3 + dy), num(50 + 1.8 * nl), num(61.8 + dy), num(50 + 3.3 * nl), num(59.4 + dy), dark, num(57.6 + dy)))
	end
	if L.pierce == "nariz" and adult then
		Hh('<circle cx="53.3" cy="61" r="1.4" fill="none" stroke="#B9BFCB" stroke-width="1"/>')
	end
	if age >= 17 and not F then
		local bcol = age >= 52 and hc or mixHex(hc, "#000000", 0.08)
		Hh(tpl(P.beard[L.beard or "none"] or "", { c = bcol, edge = hairEdge }))
	end
	-- boca
	local my = 66.5 + dy
	local lipN = mixHex(skin, "#A8423F", 0.5)
	local lipD = mixHex(lipN, "#000000", 0.35)
	local lipC = (L.makeup == "batom" or L.makeup == "completa") and "#C8283F" or L.makeup == "rosa" and "#E26A98" or nil
	if fAd and not lipC and not dead and mood < 75 then
		Hh(string.format('<path d="M44.4,%s Q47.2,%s 50,%s Q52.8,%s 55.6,%s Q50,%s 44.4,%sZ" fill="%s" opacity=".8"/>', num(my), num(my - 2), num(my - 0.8), num(my - 2), num(my), num(my + 4.4), num(my), mixHex(skin, "#C9506A", 0.42)))
	end
	if lipC and adult and not dead then
		Hh(string.format('<path d="M43.6,%s Q47,%s 50,%s Q53,%s 56.4,%s Q50,%s 43.6,%sZ" fill="%s"/>', num(my), num(my - 2.3), num(my - 0.9), num(my - 2.3), num(my), num(my + 5.4), num(my), lipC))
	end
	if dead then
		Hh(string.format('<path d="M44.5,%s L55.5,%s" stroke="%s" stroke-width="1.6" stroke-linecap="round"/>', num(my + 1), num(my + 1), lipD))
	elseif baby and uid % 3 == 0 then
		Hh(string.format('<ellipse cx="50" cy="%s" rx="6.4" ry="4.2" fill="#7FC8F8" %s/><circle cx="50" cy="%s" r="2.4" fill="#fff" %s/>', num(my + 1.4), ol(0.9, "#3C86B8"), num(my + 1.4), ol(0.8, "#3C86B8")))
	elseif mood >= 75 and (baby or small) then
		Hh(string.format('<path d="M44.5,%s Q50,%s 55.5,%s Q50,%s 44.5,%sZ" fill="#7A2430"/><path d="M47,%s Q50,%s 53,%s Q50,%s 47,%sZ" fill="#E8707E"/>', num(my - 0.5), num(my + 6.5), num(my - 0.5), num(my + 1), num(my - 0.5), num(my + 3.6), num(my + 2.4), num(my + 3.6), num(my + 5.2), num(my + 3.6)))
	elseif mood >= 75 then
		Hh(string.format('<path d="M41.6,%s Q50,%s 58.4,%s Q50,%s 41.6,%sZ" fill="#5E1A22"/><path d="M43.2,%s Q50,%s 56.8,%s L56.1,%s Q50,%s 43.9,%sZ" fill="#FFFFFF"/><path d="M46.4,%s Q50,%s 53.6,%s Q50,%s 46.4,%sZ" fill="#D8606E" opacity=".8"/><path d="M45,%s Q50,%s 55,%s" stroke="%s" stroke-width="1.2" fill="none" opacity=".55" stroke-linecap="round"/>',
			num(my - 1.2), num(my + 9.4), num(my - 1.2), num(my + 0.4), num(my - 1.2), num(my - 0.6), num(my + 1.4), num(my - 0.6), num(my + 1.7), num(my + 3.4), num(my + 1.7),
			num(my + 5.6), num(my + 4.4), num(my + 5.6), num(my + 7.2), num(my + 5.6), num(my + 7.6), num(my + 9.6), num(my + 7.6), lipN))
		if teen and uid % 4 == 1 then
			local s = string.format('<path d="M44,%s Q50,%s 56,%s" stroke="#9AA4B2" stroke-width=".9" fill="none"/>', num(my + 0.6), num(my + 2.6), num(my + 0.6))
			for _, x in { 46, 48.6, 51.4, 54 } do
				s ..= string.format('<rect x="%s" y="%s" width="1" height="1" fill="#C5CCD6"/>', num(x - 0.5), num(my + 0.7))
			end
			Hh(s)
		end
	elseif mood >= 50 then
		Hh(string.format('<path d="M43.6,%s Q50,%s 56.4,%s" stroke="%s" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M46.6,%s Q50,%s 53.4,%s" stroke="%s" stroke-width="1.3" fill="none" opacity=".6" stroke-linecap="round"/>', num(my), num(my + 5.4), num(my), lipD, num(my + 3.6), num(my + 5), num(my + 3.6), lipN))
	elseif mood >= 28 then
		Hh(string.format('<path d="M44.6,%s Q50,%s 55.4,%s" stroke="%s" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M46.6,%s Q50,%s 53.4,%s" stroke="%s" stroke-width="1.2" fill="none" opacity=".5" stroke-linecap="round"/>', num(my + 1.2), num(my + 2.2), num(my + 1.2), lipD, num(my + 3.6), num(my + 4.6), num(my + 3.6), lipN))
	else
		Hh(string.format('<path d="M44,%s Q50,%s 56,%s" stroke="%s" stroke-width="1.6" fill="none" stroke-linecap="round"/>', num(my + 3.6), num(my - 1.2), num(my + 3.6), lipD))
	end
	if L.pierce == "labio" and adult then
		Hh(string.format('<circle cx="54" cy="%s" r="1.4" fill="none" stroke="#B9BFCB" stroke-width="1"/>', num(my + 3.6)))
	end
	if not baby then
		Hh(tpl(P.glasses[L.glasses or "none"] or "", { edge = skinEdge }))
	end
	-- cabelo da frente
	if baby then
		Hh('<path d="M47,27 C45,19 54,17 56,22 C53,21.5 50.5,23.5 50.5,27.5Z" fill="' .. HG .. '" ' .. ol(1, hairEdge) .. "/>")
	elseif hairId == "careca" and age >= 45 then
		Hh('<path d="M24.6,51 C23,43 25,37.5 30.5,34.5 C29,39 29.5,44 31.5,47.5 C28.5,47.5 26,49 24.6,51Z M75.4,51 C77,43 75,37.5 69.5,34.5 C71,39 70.5,44 68.5,47.5 C71.5,47.5 74,49 75.4,51Z" fill="' .. HG .. '" ' .. ol(1, hairEdge) .. "/>")
	elseif hairId == "careca" then
		Hh('<path d="M30,30 Q40,23 50,22.5" stroke="#fff" stroke-width="3" opacity=".22" fill="none" stroke-linecap="round"/>')
	else
		Hh("<g" .. hairClip .. ">" .. hairTpl(H.front, HG, hs, hairEdge) .. "</g>")
	end
	local noTemple = { careca = true, raspado = true, cacheado = true, black = true, cacheadoF = true, moicano = true, dreads = true }
	if gray > 0 and gray < 0.7 and not baby and not noTemple[hairId] and not hat.cut then
		Hh('<path d="M25.6,40 Q25,45 25.8,50 M74.4,40 Q75,45 74.2,50" stroke="#E4E4E4" stroke-width="2.6" stroke-linecap="round" opacity="' .. (gray > 0.3 and ".75" or ".5") .. '"/>')
	end
	if L.pierce == "sobrancelha" and adult then
		Hh('<circle cx="64.5" cy="41.5" r="1.1" fill="#C9CDD6" ' .. ol(0.6, "#6B7280") .. '/><circle cx="65.5" cy="45.6" r="1.1" fill="#C9CDD6" ' .. ol(0.6, "#6B7280") .. "/>")
	end
	if not baby then
		local e, ly = L.ear, 58 + dy
		for _, x in { 22.8, 77.2 } do
			if e == "ponto" then
				Hh(string.format('<circle cx="%s" cy="%s" r="1.6" fill="#EAF2FF" %s/>', num(x), num(ly), ol(0.8, "#7A8494")))
			elseif e == "argola" then
				Hh(string.format('<circle cx="%s" cy="%s" r="3.6" fill="none" stroke="#9A7420" stroke-width="2.4"/><circle cx="%s" cy="%s" r="3.6" fill="none" stroke="#F0C04A" stroke-width="1.3"/>', num(x), num(ly + 3.6), num(x), num(ly + 3.6)))
			elseif e == "perola" then
				Hh(string.format('<circle cx="%s" cy="%s" r="1" fill="#E8C35A"/><path d="M%s,%s L%s,%s" stroke="#E8C35A" stroke-width=".9"/><circle cx="%s" cy="%s" r="2.4" fill="#FBF6EC" %s/><circle cx="%s" cy="%s" r=".7" fill="#fff"/>',
					num(x), num(ly), num(x), num(ly + 0.8), num(x), num(ly + 2.4), num(x), num(ly + 4.4), ol(0.8, "#B8AE98"), num(x - 0.7), num(ly + 3.7)))
			end
		end
	end
	Hh(tpl(hat.d, { c = L.hatColor or "#E8604F", edge = skinEdge }))

	local function lens(side)
		local x = side > 0 and ex2 or ex
		return string.format('<clipPath id="%se%s"><ellipse cx="%s" cy="%s" rx="%s" ry="%s"/></clipPath>', id, side > 0 and "r" or "l", num(x), num(ey), num(rx), num(ry))
	end
	local defs = '<clipPath id="' .. id .. '"><circle cx="50" cy="50" r="50"/></clipPath><clipPath id="' .. id .. 'h"><path d="' .. head .. '"/></clipPath>' .. lens(-1) .. lens(1)
		.. (hat.cut and ('<clipPath id="' .. id .. 'c"><rect x="0" y="' .. num(hat.cut) .. '" width="100" height="100"/></clipPath>') or "")
		.. string.format('<radialGradient id="%ssk" cx="46%%" cy="40%%" r="66%%"><stop offset="0" stop-color="%s"/><stop offset=".65" stop-color="%s"/><stop offset="1" stop-color="%s"/></radialGradient>', id, mixHex(skin, "#ffffff", 0.14), skin, mixHex(skin, "#5A2A18", 0.2))
		.. string.format('<linearGradient id="%shg" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="%s"/><stop offset=".45" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>', id, mixHex(hc, "#ffffff", 0.2), hc, mixHex(hc, "#000000", 0.25))
		.. '<linearGradient id="' .. id .. 'cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>'
	local bg = K.BGS[(uid % #K.BGS) + 1]
	return '<svg class="face" viewBox="0 0 100 100" width="44" height="44"><defs>' .. defs .. '</defs><g clip-path="url(#' .. id .. ')"><rect width="100" height="100" fill="' .. bg .. '"/><circle cx="50" cy="44" r="40" fill="#fff" opacity=".22"/>'
		.. string.format('<g transform="translate(50 100) scale(%s %s) translate(-50 -100)">', num(bs * sx), num(bs)) .. table.concat(body) .. "</g>"
		.. string.format('<g transform="translate(50 %s) scale(%s) translate(-50 -50)">', num(hcy), num(hsc)) .. table.concat(hd) .. "</g>"
		.. (dead and '<rect width="100" height="100" fill="#000" opacity=".14"/>' or "") .. "</g></svg>"
end

return FaceSvg
