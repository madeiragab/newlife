-- ===== Desenhista de SVG em Luau =====
-- Desenha num buffer RGBA o subconjunto de SVG que os rostos (FaceSvg.luau) e os ícones usam:
-- path (M L H V C S Q T Z, maiúsculas e minúsculas), circle, ellipse, rect, g com transform
-- (translate/scale), opacity e clip-path, clipPath, linearGradient e radialGradient, preenchimento e contorno
-- com cantos arredondados. Antisserrilhado por supersampling 4×4 e regra nonzero.
-- Roda igual no Roblox (vai para um EditableImage) e no Lune (testes).

local Svg = {}

local SS = 4 -- subamostras por pixel em cada eixo

---------------------------------------------------------------------------
-- XML mínimo
---------------------------------------------------------------------------
local function parseAttrs(s: string)
	local a = {}
	for k, v in string.gmatch(s, '([%w_:%-]+)%s*=%s*"([^"]*)"') do
		a[k] = v
	end
	return a
end

local function parse(src: string)
	local root = { tag = "#root", attrs = {}, kids = {} }
	local stack = { root }
	local i = 1
	while true do
		local s, e, close, tag, attrs, selfClose = string.find(src, "<(/?)([%w_:]+)(.-)(/?)>", i)
		if not s then
			break
		end
		local top = stack[#stack]
		if tag == "text" and close == "" then
			-- texto (emoji dos bichos) não é desenhado
			local _, e2 = string.find(src, "</text>", e + 1, true)
			i = (e2 or e) + 1
		elseif close == "/" then
			if #stack > 1 then
				table.remove(stack)
			end
			i = e + 1
		else
			local node = { tag = tag, attrs = parseAttrs(attrs), kids = {} }
			table.insert(top.kids, node)
			if selfClose ~= "/" and string.sub(attrs, -1) ~= "/" then
				table.insert(stack, node)
			end
			i = e + 1
		end
	end
	return root
end
Svg.parse = parse

---------------------------------------------------------------------------
-- cores
---------------------------------------------------------------------------
local NAMED = { white = { 1, 1, 1 }, black = { 0, 0, 0 }, red = { 1, 0, 0 }, none = false }
local colorCache = {}
local function parseColor(c: string?)
	if c == nil then
		return nil
	end
	local hit = colorCache[c]
	if hit ~= nil then
		return hit
	end
	local v
	local h = string.match(c, "^#(%x+)$")
	if h and #h == 6 then
		v = { tonumber(string.sub(h, 1, 2), 16) / 255, tonumber(string.sub(h, 3, 4), 16) / 255, tonumber(string.sub(h, 5, 6), 16) / 255 }
	elseif h and #h == 3 then
		v = { tonumber(string.sub(h, 1, 1), 16) / 15, tonumber(string.sub(h, 2, 2), 16) / 15, tonumber(string.sub(h, 3, 3), 16) / 15 }
	elseif NAMED[c] ~= nil then
		v = NAMED[c]
	else
		local hh, ss, ll = string.match(c, "^hsl%(%s*([%d%.]+)[%s,]+([%d%.]+)%%[%s,]+([%d%.]+)%%%s*%)$")
		if hh then
			hh, ss, ll = tonumber(hh) / 360, tonumber(ss) / 100, tonumber(ll) / 100
			local function f(n)
				local k = (n + hh * 12) % 12
				local a = ss * math.min(ll, 1 - ll)
				return ll - a * math.max(-1, math.min(k - 3, 9 - k, 1))
			end
			v = { f(0), f(8), f(4) }
		else
			v = false
		end
	end
	colorCache[c] = v
	return v
end
Svg.parseColor = parseColor

---------------------------------------------------------------------------
-- transformações (só translate e scale: matriz {sx, sy, tx, ty})
---------------------------------------------------------------------------
local function mul(m, n)
	-- m depois de n: x' = m.sx*(n.sx*x+n.tx)+m.tx
	return { m[1] * n[1], m[2] * n[2], m[1] * n[3] + m[3], m[2] * n[4] + m[4] }
end
local function parseTransform(s: string?)
	local m = { 1, 1, 0, 0 }
	if not s then
		return m
	end
	for fn, args in string.gmatch(s, "(%a+)%s*%(([^%)]*)%)") do
		local n = {}
		for x in string.gmatch(args, "[-+]?%d*%.?%d+") do
			table.insert(n, tonumber(x))
		end
		local t
		if fn == "translate" then
			t = { 1, 1, n[1] or 0, n[2] or 0 }
		elseif fn == "scale" then
			t = { n[1] or 1, n[2] or n[1] or 1, 0, 0 }
		else
			t = { 1, 1, 0, 0 }
		end
		m = mul(m, t)
	end
	return m
end

---------------------------------------------------------------------------
-- geometria: tudo vira polígonos (listas {x1,y1,x2,y2,...})
---------------------------------------------------------------------------
local function numbers(s: string)
	local out = {}
	for x in string.gmatch(s, "[-+]?%d*%.?%d+") do
		local v = tonumber(x)
		if v then
			table.insert(out, v)
		end
	end
	return out
end

local function bezSteps(len: number): number
	return math.clamp(math.ceil(len / 1.2), 4, 28)
end

-- d -> lista de subcaminhos {pts = {...}, closed = bool}, em coordenadas do usuário
local function pathPolys(d: string)
	local subs = {}
	local cur = nil
	local x, y, sx, sy = 0, 0, 0, 0
	local lcx, lcy, lqx, lqy = nil, nil, nil, nil
	local function start(nx, ny)
		cur = { pts = { nx, ny }, closed = false }
		table.insert(subs, cur)
		sx, sy = nx, ny
	end
	local function lineTo(nx, ny)
		if not cur then
			start(x, y)
		end
		table.insert(cur.pts, nx)
		table.insert(cur.pts, ny)
	end
	for cmd, args in string.gmatch(d, "([MmLlHhVvCcSsQqTtZzAa])([^MmLlHhVvCcSsQqTtZzAa]*)") do
		local n = numbers(args)
		local rel = cmd == string.lower(cmd)
		local C = string.upper(cmd)
		local i = 1
		if C == "Z" then
			if cur then
				cur.closed = true
				x, y = sx, sy
				cur = nil
			end
			lcx, lqx = nil, nil
		end
		while i <= #n or (C == "Z" and false) do
			local ox, oy = rel and x or 0, rel and y or 0
			if C == "M" then
				x, y = n[i] + ox, n[i + 1] + oy
				start(x, y)
				i += 2
				C = "L" -- pares seguintes viram linhas
				lcx, lqx = nil, nil
			elseif C == "L" then
				x, y = n[i] + ox, n[i + 1] + oy
				lineTo(x, y)
				i += 2
				lcx, lqx = nil, nil
			elseif C == "H" then
				x = n[i] + (rel and x or 0)
				lineTo(x, y)
				i += 1
			elseif C == "V" then
				y = n[i] + (rel and y or 0)
				lineTo(x, y)
				i += 1
			elseif C == "C" or C == "S" then
				local x1, y1, x2, y2, ex, ey
				if C == "C" then
					x1, y1, x2, y2, ex, ey = n[i] + ox, n[i + 1] + oy, n[i + 2] + ox, n[i + 3] + oy, n[i + 4] + ox, n[i + 5] + oy
					i += 6
				else
					x1, y1 = lcx and (2 * x - lcx) or x, lcx and (2 * y - lcy) or y
					x2, y2, ex, ey = n[i] + ox, n[i + 1] + oy, n[i + 2] + ox, n[i + 3] + oy
					i += 4
				end
				if not cur then
					start(x, y)
				end
				local len = math.abs(x1 - x) + math.abs(y1 - y) + math.abs(x2 - x1) + math.abs(y2 - y1) + math.abs(ex - x2) + math.abs(ey - y2)
				local steps = bezSteps(len)
				for k = 1, steps do
					local t = k / steps
					local u = 1 - t
					local a, b, c, e = u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t
					lineTo(a * x + b * x1 + c * x2 + e * ex, a * y + b * y1 + c * y2 + e * ey)
				end
				lcx, lcy = x2, y2
				lqx = nil
				x, y = ex, ey
			elseif C == "Q" or C == "T" then
				local qx, qy, ex, ey
				if C == "Q" then
					qx, qy, ex, ey = n[i] + ox, n[i + 1] + oy, n[i + 2] + ox, n[i + 3] + oy
					i += 4
				else
					qx, qy = lqx and (2 * x - lqx) or x, lqx and (2 * y - lqy) or y
					ex, ey = n[i] + ox, n[i + 1] + oy
					i += 2
				end
				if not cur then
					start(x, y)
				end
				local len = math.abs(qx - x) + math.abs(qy - y) + math.abs(ex - qx) + math.abs(ey - qy)
				local steps = bezSteps(len)
				for k = 1, steps do
					local t = k / steps
					local u = 1 - t
					lineTo(u * u * x + 2 * u * t * qx + t * t * ex, u * u * y + 2 * u * t * qy + t * t * ey)
				end
				lqx, lqy = qx, qy
				lcx = nil
				x, y = ex, ey
			elseif C == "A" then
				-- arco elíptico: converte do formato de ponta para centro (SVG 1.1, apêndice F.6.5)
				local rx, ry, phi, fa, fs = math.abs(n[i]), math.abs(n[i + 1]), math.rad(n[i + 2]), n[i + 3] ~= 0, n[i + 4] ~= 0
				local ex, ey = n[i + 5] + ox, n[i + 6] + oy
				i += 7
				if not cur then
					start(x, y)
				end
				if rx == 0 or ry == 0 or (ex == x and ey == y) then
					lineTo(ex, ey)
				else
					local cp, sp = math.cos(phi), math.sin(phi)
					local dx2, dy2 = (x - ex) / 2, (y - ey) / 2
					local x1p, y1p = cp * dx2 + sp * dy2, -sp * dx2 + cp * dy2
					local lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
					if lam > 1 then
						rx, ry = rx * math.sqrt(lam), ry * math.sqrt(lam)
					end
					local num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
					local den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
					local co = math.sqrt(math.max(0, num / den)) * (fa == fs and -1 or 1)
					local cxp, cyp = co * rx * y1p / ry, -co * ry * x1p / rx
					local cx = cp * cxp - sp * cyp + (x + ex) / 2
					local cy = sp * cxp + cp * cyp + (y + ey) / 2
					local function ang(ux, uy, vx, vy)
						local a = math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
						return a
					end
					local t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
					local dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
					if not fs and dt > 0 then
						dt -= 2 * math.pi
					elseif fs and dt < 0 then
						dt += 2 * math.pi
					end
					local steps = math.clamp(math.ceil(math.abs(dt) * math.max(rx, ry) / 0.8), 4, 48)
					for k = 1, steps do
						local t = t1 + dt * k / steps
						local px, py = rx * math.cos(t), ry * math.sin(t)
						lineTo(cp * px - sp * py + cx, sp * px + cp * py + cy)
					end
				end
				x, y = ex, ey
				lcx, lqx = nil, nil
			else
				break
			end
		end
	end
	return subs
end

local function ellipsePoly(cx, cy, rx, ry, scale)
	local seg = math.clamp(math.ceil(math.max(rx, ry) * scale * 1.6), 12, 72)
	local pts = table.create(seg * 2)
	for k = 0, seg - 1 do
		local a = k / seg * 2 * math.pi
		table.insert(pts, cx + math.cos(a) * rx)
		table.insert(pts, cy + math.sin(a) * ry)
	end
	return { pts = pts, closed = true }
end

local function rectPoly(x, y, w, h, rx, ry, scale)
	if rx <= 0 and ry <= 0 then
		return { pts = { x, y, x + w, y, x + w, y + h, x, y + h }, closed = true }
	end
	rx, ry = math.min(rx, w / 2), math.min(ry, h / 2)
	local pts = {}
	local seg = math.clamp(math.ceil(math.max(rx, ry) * scale), 3, 12)
	local corners = { { x + w - rx, y + ry, -math.pi / 2 }, { x + w - rx, y + h - ry, 0 }, { x + rx, y + h - ry, math.pi / 2 }, { x + rx, y + ry, math.pi } }
	for _, c in corners do
		for k = 0, seg do
			local a = c[3] + k / seg * math.pi / 2
			table.insert(pts, c[1] + math.cos(a) * rx)
			table.insert(pts, c[2] + math.sin(a) * ry)
		end
	end
	return { pts = pts, closed = true }
end

local function shapePolys(node, scale)
	local a = node.attrs
	local t = node.tag
	if t == "path" then
		return pathPolys(a.d or "")
	elseif t == "circle" then
		local r = tonumber(a.r) or 0
		return { ellipsePoly(tonumber(a.cx) or 0, tonumber(a.cy) or 0, r, r, scale) }
	elseif t == "ellipse" then
		return { ellipsePoly(tonumber(a.cx) or 0, tonumber(a.cy) or 0, tonumber(a.rx) or 0, tonumber(a.ry) or 0, scale) }
	elseif t == "rect" then
		local rx = tonumber(a.rx) or tonumber(a.ry) or 0
		local ry = tonumber(a.ry) or rx
		return { rectPoly(tonumber(a.x) or 0, tonumber(a.y) or 0, tonumber(a.width) or 0, tonumber(a.height) or 0, rx, ry, scale) }
	end
	return {}
end

-- aplica a matriz e escala para pixels
local function toDevice(subs, m)
	local out = {}
	for _, s in subs do
		local p = s.pts
		local q = table.create(#p)
		for i = 1, #p, 2 do
			q[i] = p[i] * m[1] + m[3]
			q[i + 1] = p[i + 1] * m[2] + m[4]
		end
		table.insert(out, { pts = q, closed = s.closed })
	end
	return out
end

-- contorno: cada trecho vira um quadrilátero e cada vértice um círculo, todos no mesmo sentido;
-- com a regra nonzero a união sai certa numa passada só
local function ccw(pts)
	local area = 0
	local n = #pts
	for i = 1, n, 2 do
		local j = i + 2 > n and 1 or i + 2
		area += pts[i] * pts[j + 1] - pts[j] * pts[i + 1]
	end
	if area < 0 then
		local r = table.create(n)
		for i = n - 1, 1, -2 do
			table.insert(r, pts[i])
			table.insert(r, pts[i + 1])
		end
		return r
	end
	return pts
end

local function dot(cx, cy, r)
	local seg = math.clamp(math.ceil(r * 3), 8, 24)
	local pts = table.create(seg * 2)
	for k = 0, seg - 1 do
		local a = k / seg * 2 * math.pi
		table.insert(pts, cx + math.cos(a) * r)
		table.insert(pts, cy + math.sin(a) * r)
	end
	return pts
end

local function strokePolys(subs, hw, roundCap: boolean)
	local out = {}
	for _, s in subs do
		local p = s.pts
		local n = #p // 2
		if s.closed and n >= 2 then
			p = table.clone(p)
			table.insert(p, p[1])
			table.insert(p, p[2])
			n += 1
		end
		for k = 1, n - 1 do
			local x1, y1, x2, y2 = p[2 * k - 1], p[2 * k], p[2 * k + 1], p[2 * k + 2]
			local dx, dy = x2 - x1, y2 - y1
			local len = math.sqrt(dx * dx + dy * dy)
			if len > 1e-6 then
				local nx, ny = -dy / len * hw, dx / len * hw
				table.insert(out, { pts = ccw({ x1 + nx, y1 + ny, x2 + nx, y2 + ny, x2 - nx, y2 - ny, x1 - nx, y1 - ny }) })
			end
		end
		for k = 1, n do
			local inner = s.closed or (k > 1 and k < n)
			if (inner and n > 2) or roundCap or n == 1 then
				table.insert(out, { pts = dot(p[2 * k - 1], p[2 * k], hw) })
			end
		end
	end
	return out
end

---------------------------------------------------------------------------
-- rasterização: cobertura 0..1 por pixel, numa caixa
---------------------------------------------------------------------------
local function coverage(polys, W: number, H: number)
	-- arestas e caixa
	local edges = {}
	local minY, maxY, minX, maxX = math.huge, -math.huge, math.huge, -math.huge
	for _, s in polys do
		local p = s.pts
		local n = #p
		if n >= 6 then
			for i = 1, n, 2 do
				local j = i + 2 > n and 1 or i + 2
				local x1, y1, x2, y2 = p[i], p[i + 1], p[j], p[j + 1]
				if y1 ~= y2 then
					local dir = 1
					if y1 > y2 then
						x1, y1, x2, y2 = x2, y2, x1, y1
						dir = -1
					end
					table.insert(edges, { y1, y2, x1, (x2 - x1) / (y2 - y1), dir })
				end
				minY = math.min(minY, y1, y2)
				maxY = math.max(maxY, y1, y2)
				minX = math.min(minX, x1, x2)
				maxX = math.max(maxX, x1, x2)
			end
		end
	end
	if #edges == 0 then
		return nil
	end
	local px0 = math.max(0, math.floor(minX))
	local px1 = math.min(W - 1, math.ceil(maxX))
	local py0 = math.max(0, math.floor(minY))
	local py1 = math.min(H - 1, math.ceil(maxY))
	if px1 < px0 or py1 < py0 then
		return nil
	end
	table.sort(edges, function(a, b)
		return a[1] < b[1]
	end)
	local bw = px1 - px0 + 1
	local cov = table.create(bw * (py1 - py0 + 1), 0)
	local w1 = 1 / (SS * SS)
	local xs = {}
	local first = 1
	for sy = py0 * SS, (py1 + 1) * SS - 1 do
		local y = (sy + 0.5) / SS
		local row = (sy // SS - py0) * bw
		table.clear(xs)
		while first <= #edges and edges[first][2] <= y do
			-- arestas que já acabaram ficam para trás (a lista está ordenada pelo início)
			if edges[first][1] > y then
				break
			end
			first += 1
		end
		for k = first, #edges do
			local e = edges[k]
			if e[1] > y then
				break
			end
			if y < e[2] then
				table.insert(xs, { e[3] + (y - e[1]) * e[4], e[5] })
			end
		end
		if #xs >= 2 then
			table.sort(xs, function(a, b)
				return a[1] < b[1]
			end)
			local wind = 0
			for k = 1, #xs - 1 do
				wind += xs[k][2]
				if wind ~= 0 then
					local xa, xb = xs[k][1], xs[k + 1][1]
					local c0 = math.max(math.ceil(xa * SS - 0.5), px0 * SS)
					local c1 = math.min(math.floor(xb * SS - 0.5), (px1 + 1) * SS - 1)
					for c = c0, c1 do
						local idx = row + (c // SS - px0) + 1
						cov[idx] += w1
					end
				end
			end
		end
	end
	return { cov = cov, x0 = px0, y0 = py0, w = bw, h = py1 - py0 + 1 }
end

---------------------------------------------------------------------------
-- pintura
---------------------------------------------------------------------------
local function newLayer(N: number)
	return { r = table.create(N, 0), g = table.create(N, 0), b = table.create(N, 0), a = table.create(N, 0) }
end

-- pinta a cobertura com uma cor sólida ou degradê, multiplicando pela máscara de recorte
local function paint(layer, W, cv, paintFn, alpha, clip)
	if not cv then
		return
	end
	local cov, x0, y0, w, h = cv.cov, cv.x0, cv.y0, cv.w, cv.h
	local R, Gc, B, A = layer.r, layer.g, layer.b, layer.a
	for j = 0, h - 1 do
		for i = 0, w - 1 do
			local c = cov[j * w + i + 1]
			if c > 0 then
				if c > 1 then
					c = 1
				end
				local idx = (y0 + j) * W + x0 + i + 1
				if clip then
					c *= clip[idx]
				end
				if c > 0 then
					local cr, cg, cb, ca = paintFn(x0 + i + 0.5, y0 + j + 0.5)
					local s = c * alpha * ca
					local inv = 1 - s
					R[idx] = cr * s + R[idx] * inv
					Gc[idx] = cg * s + Gc[idx] * inv
					B[idx] = cb * s + B[idx] * inv
					A[idx] = s + A[idx] * inv
				end
			end
		end
	end
end

local function bbox(polys)
	local x0, y0, x1, y1 = math.huge, math.huge, -math.huge, -math.huge
	for _, s in polys do
		local p = s.pts
		for i = 1, #p, 2 do
			x0 = math.min(x0, p[i])
			x1 = math.max(x1, p[i])
			y0 = math.min(y0, p[i + 1])
			y1 = math.max(y1, p[i + 1])
		end
	end
	return x0, y0, x1, y1
end

local function stopsOf(node)
	local stops = {}
	for _, k in node.kids do
		if k.tag == "stop" then
			local off = k.attrs.offset or "0"
			local o = tonumber((string.gsub(off, "%%", ""))) or 0
			if string.find(off, "%%") then
				o /= 100
			end
			local c = parseColor(k.attrs["stop-color"]) or { 0, 0, 0 }
			table.insert(stops, { o, c[1], c[2], c[3], tonumber(k.attrs["stop-opacity"]) or 1 })
		end
	end
	return stops
end

local function sampleStops(stops, t)
	if t <= stops[1][1] then
		local s = stops[1]
		return s[2], s[3], s[4], s[5]
	end
	for k = 2, #stops do
		local b = stops[k]
		if t <= b[1] then
			local a = stops[k - 1]
			local f = (b[1] - a[1]) > 0 and (t - a[1]) / (b[1] - a[1]) or 0
			return a[2] + (b[2] - a[2]) * f, a[3] + (b[3] - a[3]) * f, a[4] + (b[4] - a[4]) * f, a[5] + (b[5] - a[5]) * f
		end
	end
	local s = stops[#stops]
	return s[2], s[3], s[4], s[5]
end

local function pct(v: string?, def: number): number
	if not v then
		return def
	end
	local n = tonumber((string.gsub(v, "%%", ""))) or def
	if string.find(v, "%%") then
		n /= 100
	end
	return n
end

-- "url(#id)" ou cor -> função de pintura (ou nil = não pinta)
local function paintFor(ctx, value: string?, polys)
	if not value or value == "none" then
		return nil
	end
	local ref = string.match(value, "^url%(#([^%)]+)%)$")
	if ref then
		local g = ctx.defs[ref]
		if not g then
			return nil
		end
		local stops = stopsOf(g)
		if #stops == 0 then
			return nil
		end
		local bx0, by0, bx1, by1 = bbox(polys)
		local bw, bh = math.max(bx1 - bx0, 1e-6), math.max(by1 - by0, 1e-6)
		if g.tag == "linearGradient" then
			local x1, y1, x2, y2 = pct(g.attrs.x1, 0), pct(g.attrs.y1, 0), pct(g.attrs.x2, 1), pct(g.attrs.y2, 0)
			local dx, dy = x2 - x1, y2 - y1
			local dd = dx * dx + dy * dy
			return function(px, py)
				local u, v = (px - bx0) / bw, (py - by0) / bh
				local t = dd > 0 and ((u - x1) * dx + (v - y1) * dy) / dd or 0
				return sampleStops(stops, t)
			end
		else
			local cx, cy, r = pct(g.attrs.cx, 0.5), pct(g.attrs.cy, 0.5), pct(g.attrs.r, 0.5)
			return function(px, py)
				local u, v = (px - bx0) / bw - cx, (py - by0) / bh - cy
				return sampleStops(stops, math.sqrt(u * u + v * v) / r)
			end
		end
	end
	local c = parseColor(value)
	if not c then
		return nil
	end
	local r, g, b = c[1], c[2], c[3]
	return function()
		return r, g, b, 1
	end
end

---------------------------------------------------------------------------
-- percorre a árvore
---------------------------------------------------------------------------
local INHERIT = { "fill", "stroke", "stroke-width", "stroke-linecap", "fill-opacity", "stroke-opacity" }

local renderNode

-- máscara de recorte (0..1 por pixel) de um clipPath, na transformação de quem o usa
local function clipMask(ctx, id, m, parentClip)
	local cp = ctx.defs[id]
	if not cp then
		return parentClip
	end
	local polys = {}
	for _, k in cp.kids do
		local km = mul(m, parseTransform(k.attrs.transform))
		for _, p in toDevice(shapePolys(k, km[1]), km) do
			table.insert(polys, p)
		end
	end
	local N = ctx.W * ctx.H
	local mask = table.create(N, 0)
	local cv = coverage(polys, ctx.W, ctx.H)
	if cv then
		for j = 0, cv.h - 1 do
			for i = 0, cv.w - 1 do
				local idx = (cv.y0 + j) * ctx.W + cv.x0 + i + 1
				local c = math.min(1, cv.cov[j * cv.w + i + 1])
				mask[idx] = parentClip and c * parentClip[idx] or c
			end
		end
	end
	return mask
end

local function drawShape(ctx, node, style, m, layer, clip)
	local a = node.attrs
	local scale = (m[1] + m[2]) / 2
	local polys = toDevice(shapePolys(node, math.abs(scale)), m)
	if #polys == 0 then
		return
	end
	local op = tonumber(a.opacity) or 1
	local fill = paintFor(ctx, style.fill, polys)
	if fill then
		paint(layer, ctx.W, coverage(polys, ctx.W, ctx.H), fill, op * (tonumber(style["fill-opacity"]) or 1), clip)
	end
	local stroke = paintFor(ctx, style.stroke, polys)
	local sw = tonumber(style["stroke-width"]) or 1
	if stroke and sw > 0 then
		local hw = sw * math.abs(scale) / 2
		local sp = strokePolys(polys, hw, style["stroke-linecap"] == "round")
		paint(layer, ctx.W, coverage(sp, ctx.W, ctx.H), stroke, op * (tonumber(style["stroke-opacity"]) or 1), clip)
	end
end

function renderNode(ctx, node, style, m, layer, clip)
	local a = node.attrs
	local t = node.tag
	if t == "defs" or t == "clipPath" or t == "linearGradient" or t == "radialGradient" or t == "stop" then
		return
	end
	local st = style
	local has = false
	for _, k in INHERIT do
		if a[k] ~= nil then
			has = true
			break
		end
	end
	if has then
		st = table.clone(style)
		for _, k in INHERIT do
			if a[k] ~= nil then
				st[k] = a[k]
			end
		end
	end
	local mm = a.transform and mul(m, parseTransform(a.transform)) or m
	local cl = clip
	local cref = a["clip-path"] and string.match(a["clip-path"], "url%(#([^%)]+)%)")
	if cref then
		cl = clipMask(ctx, cref, mm, clip)
	end
	if t == "g" or t == "svg" or t == "#root" then
		local op = tonumber(a.opacity) or 1
		if op < 1 then
			-- grupo com transparência: desenha numa camada à parte e junta no fim
			local N = ctx.W * ctx.H
			local sub = newLayer(N)
			for _, k in node.kids do
				renderNode(ctx, k, st, mm, sub, cl)
			end
			for i = 1, N do
				local sa = sub.a[i] * op
				if sa > 0 then
					local inv = 1 - sa
					layer.r[i] = sub.r[i] * op + layer.r[i] * inv
					layer.g[i] = sub.g[i] * op + layer.g[i] * inv
					layer.b[i] = sub.b[i] * op + layer.b[i] * inv
					layer.a[i] = sa + layer.a[i] * inv
				end
			end
		else
			for _, k in node.kids do
				renderNode(ctx, k, st, mm, layer, cl)
			end
		end
	else
		drawShape(ctx, node, st, mm, layer, cl)
	end
end

local function collectDefs(node, defs)
	if node.attrs.id then
		defs[node.attrs.id] = node
	end
	for _, k in node.kids do
		collectDefs(k, defs)
	end
end

-- desenha o SVG em w×h pixels (h = w se omitido); devolve um buffer RGBA (4 bytes por pixel, sem pré-multiplicar)
function Svg.render(src: string, w: number, h: number?)
	local H = h or w
	local root = parse(src)
	local svg = root.kids[1]
	local vb = svg and svg.attrs.viewBox and numbers(svg.attrs.viewBox) or { 0, 0, 100, 100 }
	local defs = {}
	collectDefs(root, defs)
	local ctx = { W = w, H = H, defs = defs }
	local N = w * H
	local layer = newLayer(N)
	local sx, sy = w / (vb[3] or 100), H / (vb[4] or 100)
	local m = { sx, sy, -vb[1] * sx, -vb[2] * sy }
	renderNode(ctx, svg or root, { fill = "#000000" }, m, layer, nil)
	local buf = buffer.create(N * 4)
	for i = 1, N do
		local al = layer.a[i]
		local o = (i - 1) * 4
		if al > 0 then
			buffer.writeu8(buf, o, math.clamp(math.floor(layer.r[i] / al * 255 + 0.5), 0, 255))
			buffer.writeu8(buf, o + 1, math.clamp(math.floor(layer.g[i] / al * 255 + 0.5), 0, 255))
			buffer.writeu8(buf, o + 2, math.clamp(math.floor(layer.b[i] / al * 255 + 0.5), 0, 255))
			buffer.writeu8(buf, o + 3, math.clamp(math.floor(al * 255 + 0.5), 0, 255))
		end
	end
	return buf
end

return Svg
