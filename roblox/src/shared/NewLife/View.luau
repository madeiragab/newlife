-- ===== O que a tela recebe do servidor =====
-- Só dados prontos para mostrar (textos já preenchidos), nunca o estado inteiro.

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
local Actions = dep("Actions")
local Version = dep("Data/Version")

local View = {}

local LOG_YEARS = 40

function View.build(game, meta)
	local out = { meta = meta, version = Version.v }
	local S = game.S
	if not S then
		return out
	end
	local m = S.me
	local c = game.countryOf(m.country)
	local cur = m.edu.cur
	out.me = {
		name = m.first .. " " .. m.last, gender = m.gender, age = m.age, year = S.year, country = c.n, city = m.city,
		money = Util.fmt(m.money), alive = m.alive, cause = m.cause,
		stats = { happy = m.happy, health = m.health, smarts = m.smarts, looks = m.looks },
		status = cur and (cur.n .. " · " .. (cur.yr + 1) .. "º ano") or m.trabalho and (m.trabalho.t .. " · " .. m.trabalho.co)
			or m.aposentado and "Aposentad" .. game:oa() or (m.age >= 18 and "Sem emprego" or nil),
	}
	out.event = game:currentEvent()
	out.actions = Actions.list(game)
	local people = {}
	for _, p in game:people() do
		if p.rel ~= "ex_amigo" and p.rel ~= "colega" then
			table.insert(people, { id = p.id, name = p.first .. " " .. p.last, rel = game:relLabel(p), age = p.age, bond = p.bond })
		end
	end
	out.people = people
	local log = {}
	for i = math.max(1, #S.log - LOG_YEARS + 1), #S.log do
		local y = S.log[i]
		local lines = {}
		for _, l in y.lines do
			table.insert(lines, { t = l.t, c = l.c })
		end
		table.insert(log, { age = y.age, year = y.year, lines = lines })
	end
	out.log = log
	return out
end

return View
