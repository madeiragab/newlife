-- ===== Escolhas dos eventos no formato compacto (porta de src/ev_dsl.js) =====
-- escolha: 'Rótulo|efeitos|texto'  ou  'Rótulo|?chance efeitos|texto se der certo|efeitos se der errado|texto se der errado'
-- Só os efeitos que existem no Roblox chegam aqui: o conversor descarta eventos com outros.

local Util = require(script and script.Parent:WaitForChild("Util") or "./Util")
local R, clamp = Util.R, Util.clamp

local Dsl = {}

local STAT = { h = "happy", hl = "health", sm = "smarts", lk = "looks" }

function Dsl.chance(game, tok: string): number
	local key, mod = string.match(tok, "^%?([%a%.]+)([+-]%d+)$")
	if not key then
		key = string.match(tok, "^%?([%w%.]+)$")
		mod = "0"
	end
	if not key then
		return 0.5
	end
	local m = game.S.me
	local v
	if string.match(key, "^%d+$") then
		v = tonumber(key)
	elseif key == "sm" then
		v = m.smarts
	elseif key == "lk" then
		v = m.looks
	elseif key == "hl" then
		v = m.health
	elseif key == "h" then
		v = m.happy
	elseif key == "k" then
		v = m.karma
	elseif key == "f" then
		v = m.fame or 0
	elseif key == "fight" then
		v = m.fight
	elseif key == "will" then
		v = m.will or 50
	elseif key == "grade" then
		v = m.edu.cur and m.edu.cur.grade or 50
	elseif string.sub(key, 1, 4) == "tal." then
		v = m.talent[string.sub(key, 5)] or 30
	else
		v = 50
	end
	return math.max(0.03, math.min(0.97, (v + tonumber(mod)) / 100))
end

-- pessoa nova a partir do desconhecido do evento ({n} ou {n2}), uma vez só por evento
local function meet(game, d, rel: string, key: string)
	local m = game.S.me
	if d["met_" .. key] and game:P(d["met_" .. key]) then
		return
	end
	if not d[key] then
		return
	end
	if rel == "namoro" and (m.age < 18 or #game:people("namoro", "noivo", "conjuge") > 0) then
		rel = "amigo"
	end
	if rel == "colega" and not m.edu.cur then
		rel = "amigo"
	end
	local age = key == "n" and d.nAge or clamp(m.age + R.int(-7, 7), math.max(1, m.age - 2), 99)
	local p = game:mkPerson({ rel = rel, first = d[key], last = d[key .. "l"], gender = d[key .. "G"], age = age, bond = R.int(55, 75) })
	table.insert(game.S.people, p)
	d["met_" .. key] = p.id
	if not d.pid then
		d.pid = p.id
	end
	if rel == "namoro" then
		p.bond = math.max(p.bond, 70)
		game:cnt("partners")
	end
end

function Dsl.apply(game, s: string?, d): string
	local m = game.S.me
	local out = {}
	for _, tok in Util.words(s) do
		local k, n = string.match(tok, "^(%a+)([+-]%d+)$")
		if k then
			n = tonumber(n)
			if STAT[k] then
				game:st(STAT[k], n)
			elseif k == "k" then
				m.karma = clamp(m.karma + n)
			elseif k == "f" then
				m.fame = clamp((m.fame or 0) + n)
			elseif k == "grade" then
				if m.edu.cur then
					m.edu.cur.grade = clamp(m.edu.cur.grade + n)
				end
			elseif k == "bond" then
				local p = game:P(d.pid)
				if p then
					p.bond = clamp(p.bond + n)
				end
			elseif k == "fight" then
				m.fight = clamp(m.fight + n)
			elseif k == "will" then
				m.will = clamp((m.will or 50) + n)
			end
		else
			local sign, val = string.match(tok, "^%$([+-]?)(%w+)$")
			if sign then
				local v = val == "v" and d.v or val == "v2" and d.v2 or tonumber(val) or 0
				m.money += sign == "-" and -v or v
			else
				local kind, key, num = string.match(tok, "^(%a+)%.(%w+)([+-]%d+)$")
				if kind == "add" then
					m.add[key] = clamp((m.add[key] or 0) + tonumber(num) * (1.3 - (m.will or 50) / 100))
				elseif kind == "tal" then
					m.talent[key] = clamp((m.talent[key] or 0) + tonumber(num))
				else
					local two, rel = string.match(tok, "^meet(2?):?(%a*)$")
					if two then
						meet(game, d, rel ~= "" and rel or "amigo", two == "2" and "n2" or "n")
					else
						local c = string.match(tok, "^c:(%w+)$")
						if c then
							game:cnt(c)
						end
					end
				end
			end
		end
	end
	return table.concat(out, " ")
end

function Dsl.choice(game, c: string, d): string
	local parts = Util.split(c, "|")
	local fx1, t1, fx2, t2 = parts[2] or "", parts[3] or "", parts[4], parts[5]
	-- efeitos antes do "?chance" valem sempre (ex.: o custo); os de depois só se der certo
	local toks = Util.words(fx1)
	local chance, base = nil, ""
	for i, t in toks do
		if string.sub(t, 1, 1) == "?" then
			chance = Dsl.chance(game, t)
			base = table.concat(toks, " ", 1, i - 1)
			fx1 = table.concat(toks, " ", i + 1)
			break
		end
	end
	local b = base ~= "" and Dsl.apply(game, base, d) or ""
	local res = {}
	local function add(x)
		if x and x ~= "" then
			table.insert(res, x)
		end
	end
	if chance ~= nil and not R.chance(chance) then
		local x = Dsl.apply(game, fx2 or "", d)
		add(game:tp((t2 and t2 ~= "") and t2 or "Não deu certo.", d))
		add(b)
		add(x)
	else
		local x = Dsl.apply(game, fx1, d)
		add(game:tp(t1, d))
		add(b)
		add(x)
	end
	return table.concat(res, " ")
end

return Dsl
