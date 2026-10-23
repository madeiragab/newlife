-- ===== Motor da vida (versão Roblox) =====
-- Porta do núcleo de src/core.js, src/events.js e src/ev_dsl.js: nascer, envelhecer, escola, família,
-- eventos com escolhas e morte. Não depende do Roblox: roda no servidor do jogo e nos testes com Lune.
-- Cada jogador tem o seu Engine.new(); o estado (self.S) é uma tabela simples que vai inteira para o DataStore.

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
local Dsl = dep("Dsl")
local Countries = dep("Data/Countries")
local Names = dep("Data/Names")
local Text = dep("Data/Text")
local Looks = dep("Looks")
local Politica = dep("Politica")
local Crime = dep("Crime")

local R, clamp, fmt, g = Util.R, Util.clamp, Util.fmt, Util.g

local Engine = {}
Engine.__index = Engine
Engine.VERSION = 1

local COUNTRY_BY_ID = {}
for _, c in Countries do
	COUNTRY_BY_ID[c.id] = c
end
local function countryOf(id: string)
	return COUNTRY_BY_ID[id] or Countries[1]
end
Engine.countryOf = countryOf
Engine.COUNTRIES = Countries

local TALENTS = { "acting", "musical", "athletic", "art", "dance", "writing", "comedy" }

local REL_LABEL = {
	mae = "Mãe", pai = "Pai", irmao = "Irmão|Irmã", avo = "Avô|Avó", filho = "Filho|Filha", neto = "Neto|Neta",
	amigo = "Amigo|Amiga", colega = "Colega de classe", namoro = "Namorado|Namorada", noivo = "Noivo|Noiva",
	conjuge = "Marido|Esposa", ex = "Ex", inimigo = "Desafeto", adot = "Filho adotivo|Filha adotiva",
}

---------------------------------------------------------------------------
-- helpers que as condições dos eventos usam (G.*), sempre sobre o jogo atual
---------------------------------------------------------------------------
local current = nil
local G = {}
G.S = nil
function G.T(v): boolean
	return not (v == nil or v == false or v == 0 or v == "" or v ~= v)
end
function G.V(v)
	if v == 0 or v == "" or v == false then
		return nil
	end
	return v
end
function G.includes(arr, x): boolean
	if type(arr) == "string" then
		return string.find(arr, x, 1, true) ~= nil
	end
	if type(arr) ~= "table" then
		return false
	end
	for _, v in arr do
		if v == x then
			return true
		end
	end
	return false
end
function G.some(arr, f): boolean
	for _, v in arr or {} do
		if f(v) then
			return true
		end
	end
	return false
end
function G.every(arr, f): boolean
	for _, v in arr or {} do
		if not f(v) then
			return false
		end
	end
	return true
end
function G.filter(arr, f)
	local out = {}
	for _, v in arr or {} do
		if f(v) then
			table.insert(out, v)
		end
	end
	return out
end
function G.startsWith(s, p): boolean
	return type(s) == "string" and string.sub(s, 1, #p) == p
end
function G.people(...)
	return current:people(...)
end
function G.partners()
	return current:people("namoro", "noivo", "conjuge")
end
function G.kids()
	return current:people("filho", "adot")
end
function G.parents()
	return current:people("mae", "pai")
end
function G.netWorth()
	return current:netWorth()
end
-- condição testada pelo conversor em todas as combinações de país × preso × escola
function G.combo(set)
	return function(m)
		local key = m.country .. "|" .. (m.prison and 1 or 0) .. "|" .. (m.edu.cur and m.edu.cur.type or "-")
		return set[key] == true
	end
end
function G.combo3(cs, prs, eds)
	local cset, pset, eset = {}, {}, {}
	for _, c in cs do
		cset[c] = true
	end
	for _, p in prs do
		pset[p] = true
	end
	for _, e in eds do
		eset[e] = true
	end
	return function(m)
		return cset[m.country] == true
			and pset[m.prison and 1 or 0] == true
			and eset[m.edu.cur and m.edu.cur.type or "-"] == true
	end
end

-- eventos convertidos de src/ (Data/Events*.luau), já sem o conteúdo cortado no Roblox
local EVENTS, EVENT_LIST = {}, {}
for i = 1, dep("Data/EventChunks") do
	for _, e in dep("Data/Events" .. i)(G) do
		EVENTS[e.id] = e
		table.insert(EVENT_LIST, e)
	end
end
Engine.EVENTS = EVENTS
Engine.EVENT_COUNT = #EVENT_LIST

---------------------------------------------------------------------------
-- estado, pessoas e diário
---------------------------------------------------------------------------
function Engine.new()
	local self = setmetatable({}, Engine)
	self.S = nil
	return self
end

function Engine:use()
	current = self
	G.S = self.S
end

function Engine:people(...)
	local rels = { ... }
	local out = {}
	for _, p in self.S.people do
		if p.alive then
			local ok = #rels == 0
			for _, r in rels do
				if p.rel == r then
					ok = true
					break
				end
			end
			if ok then
				table.insert(out, p)
			end
		end
	end
	return out
end

function Engine:P(id)
	if not id then
		return nil
	end
	for _, p in self.S.people do
		if p.id == id then
			return p
		end
	end
	return nil
end

function Engine:netWorth(): number
	local m = self.S.me
	local s = m.money
	for _, a in m.assets do
		s += (a.value or 0) - (a.loan or 0)
	end
	return s
end

-- ---------- sons (porta de soundForLine em src/sound.js) ----------
-- O motor só anota qual som cabe; quem toca é o cliente (Ui.client.luau), com os áudios de Sons.luau.
local SOUND_PRIORITY = { death = 5, siren = 4, promo = 3, bells = 3, baby = 3, cash = 2, bad = 1, good = 1 }
local function has(s: string, list: { string }): boolean
	for _, p in list do
		if string.find(s, p, 1, true) then
			return true
		end
	end
	return false
end
local function soundForLine(t: string, tone: string?): string?
	local l = string.lower(t)
	if string.find(l, "%f[%a]pres[oa]%f[%A]") or has(l, { "algemad", "polícia pegou", "polícia me pegou", "polícia prendeu", "polícia me prendeu", "polícia chegou" }) then
		return "siren"
	end
	if string.sub(t, 1, 6) == "Morri " then
		return "death"
	end
	if has(l, { "promovid", "subi na", "subi para", "subi de", "virei capitão", "virei titular", "virei líder", "virei braço", "passei no exame de", "faixa preta", "agora sou" }) then
		return "promo"
	end
	if has(l, { "casei", "casamento foi", "aliança" }) then
		return "bells"
	end
	if has(l, { "nasceu", "é pai", "é mãe", "sou pai", "sou mãe", "adotei" }) then
		return "baby"
	end
	if tone ~= "bad" and has(l, { "ganhei $", "herança", "recebi $", "prêmio de $", "na conta" }) then
		return "cash"
	end
	if tone == "good" or tone == "bad" then
		return tone
	end
	return nil
end
Engine.soundForLine = soundForLine

-- o que tocar desde a última vez que a tela foi atualizada (não vai para o save)
function Engine:takeFx(): { string }
	local fx = self.fx or {}
	self.fx = {}
	local out = {}
	if fx.line then
		table.insert(out, fx.line)
	end
	if fx.birthday then
		table.insert(out, "birthday")
	end
	if fx.hurt then
		table.insert(out, "hurt")
	end
	return out
end

function Engine:log(t: string, tone: string?)
	local y = self.S.log[#self.S.log]
	table.insert(y.lines, tone and { t = t, c = tone } or { t = t })
	local s = soundForLine(t, tone)
	if s then
		self.fx = self.fx or {}
		local cur = self.fx.line
		if not cur or SOUND_PRIORITY[s] > SOUND_PRIORITY[cur] then
			self.fx.line = s
		end
	end
end

function Engine:st(k: string, d: number)
	local m = self.S.me
	m[k] = clamp((m[k] or 0) + d)
	if k == "health" and d <= -3 then
		self.fx = self.fx or {}
		self.fx.hurt = true
	end
end

function Engine:cnt(key: string, n: number?): number
	local c = self.S.me.c
	c[key] = (c[key] or 0) + (n or 1)
	return c[key]
end

function Engine:oa(): string
	return self.S.me.gender == "F" and "a" or "o"
end

function Engine:relLabel(p): string
	return g(REL_LABEL[p.rel] or p.rel, p.gender)
end

-- ---------- nomes ----------
local function wpickNames(list)
	local tot = 0
	for _, x in list do
		tot += x[2]
	end
	local r = R.f() * tot
	for _, x in list do
		r -= x[2]
		if r < 0 then
			return x[1]
		end
	end
	return list[#list][1]
end
local function pickFirst(cid: string, gender: string): string
	local db = Names.db[cid] or Names.db.BR
	local f = wpickNames(db[gender])
	if R.chance(Names.compound[cid] or 0) then
		local s = wpickNames(db[gender])
		if s ~= f and not string.find(f, " ") then
			f = f .. " " .. s
		end
	end
	return f
end
local function pickLast(cid: string): string
	local db = Names.db[cid] or Names.db.BR
	local l = wpickNames(db.L)
	if R.chance(Names.doubleLast[cid] or 0) then
		local s = wpickNames(db.L)
		if s ~= l and not string.find(l, " ") then
			l = l .. " " .. s
		end
	end
	return l
end
Engine.pickFirst, Engine.pickLast = pickFirst, pickLast

local function randTalent()
	local t = {}
	for _, k in TALENTS do
		t[k] = clamp(R.norm(40, 25))
	end
	return t
end

function Engine:newId(): number
	local id = self.S.nextId
	self.S.nextId += 1
	return id
end

function Engine:mkPerson(o)
	local S = self.S
	local cid = o.country or (S.me and S.me.country) or "BR"
	local gender = o.gender or (R.chance(0.5) and "M" or "F")
	local p = {
		id = self:newId(), rel = o.rel, gender = gender, age = o.age or 30, alive = true,
		first = o.first or pickFirst(cid, gender), last = o.last or pickLast(cid), country = cid,
		bond = o.bond or R.int(40, 80), health = o.health or R.int(50, 100), money = o.money or 0,
		looks = clamp(R.norm(55, 20)), smarts = clamp(R.norm(55, 20)), job = o.job,
	}
	-- rosto: herda dos pais quando eles são conhecidos (o.from), senão segue o país
	p.genes = o.from and Looks.childGenes(o.from[1], o.from[2], gender, cid) or Looks.randGenes(gender, cid)
	Looks.ensure(p)
	return p
end

-- primeiro nome diferente dos parentes próximos
function Engine:uniqFirst(p)
	local used = {}
	if self.S.me then
		used[self.S.me.first] = true
	end
	for _, x in self.S.people do
		if x ~= p and (x.rel == "mae" or x.rel == "pai" or x.rel == "irmao" or x.rel == "filho" or x.rel == "adot" or x.rel == "avo") then
			used[x.first] = true
		end
	end
	for _ = 1, 12 do
		if not used[p.first] then
			break
		end
		p.first = pickFirst(p.country, p.gender)
	end
	return p
end

---------------------------------------------------------------------------
-- nascimento
---------------------------------------------------------------------------
local PARENT_JOBS = {
	pobre = { "Pedreiro|Pedreira", "Diarista", "Vendedor|Vendedora", "Motorista", "Cozinheiro|Cozinheira", "Porteiro|Porteira", "Caixa de supermercado" },
	media = { "Professor|Professora", "Técnico de enfermagem|Técnica de enfermagem", "Auxiliar administrativo|Auxiliar administrativa", "Eletricista", "Policial", "Bancário|Bancária" },
	rica = { "Médico|Médica", "Advogado|Advogada", "Engenheiro|Engenheira", "Empresário|Empresária", "Dentista", "Arquiteto|Arquiteta" },
	milionaria = { "Empresário|Empresária", "Investidor|Investidora", "Diretor executivo|Diretora executiva" },
}
local WEALTH = { pobre = { 0, 6000 }, media = { 5000, 60000 }, rica = { 80000, 900000 }, milionaria = { 2000000, 40000000 } }

function Engine:newLife(o)
	o = o or {}
	local pool = table.clone(Countries)
	table.insert(pool, Countries[1])
	table.insert(pool, Countries[1])
	table.insert(pool, Countries[1])
	local c = o.country and countryOf(o.country) or R.pick(pool)
	self.S = {
		v = Engine.VERSION, nextId = 1, year = o.year or (2000 + R.int(0, 26)), people = {}, log = {}, pending = {},
		me = nil, gen = o.gen or 1, flags = { diff = o.diff or "normal" },
	}
	self:use()
	local S = self.S
	local gender = o.gender or (R.chance(0.5) and "M" or "F")
	local first = o.first or pickFirst(c.id, gender)
	local last = o.last or pickLast(c.id)
	local m = {
		first = first, last = last, gender = gender, age = 0, country = c.id, city = R.pick(c.cities), born = S.year,
		happy = R.int(70, 100), health = R.int(72, 100), smarts = clamp(R.norm(55, 22)), looks = clamp(R.norm(55, 22)),
		karma = R.int(45, 75), fame = 0, money = 0, talent = randTalent(), will = R.int(5, 100), fight = R.int(0, 40),
		add = { alcool = 0 }, dis = {}, edu = { deg = {}, cur = nil }, trabalho = nil, assets = {}, loans = {},
		c = { countries = 1 }, yr = {}, ev = {}, evN = {}, alive = true, cause = nil, prison = nil,
	}
	S.me = m
	local cls = o.cls or R.wpick({ { "pobre", 34 }, { "media", 44 }, { "rica", 18 }, { "milionaria", 4 } })
	S.flags.cls = cls
	local mAge = R.int(20, 42)
	local dAge = clamp(mAge + R.int(-3, 9), 18, 60)
	local wealth = WEALTH[cls]
	local function job(gd)
		if R.chance(cls == "pobre" and 0.18 or 0.07) then
			return nil
		end
		return g(R.pick(PARENT_JOBS[cls]), gd)
	end
	local mom = self:uniqFirst(self:mkPerson({ rel = "mae", gender = "F", age = mAge, last = R.chance(0.4) and last or pickLast(c.id), money = R.int(wealth[1], wealth[2]), bond = R.int(60, 95) }))
	mom.job = job("F")
	table.insert(S.people, mom)
	local dad = nil
	if not R.chance(0.13) then
		dad = self:uniqFirst(self:mkPerson({ rel = "pai", gender = "M", age = dAge, last = last, money = R.int(wealth[1], wealth[2]), bond = R.int(55, 95) }))
		dad.job = job("M")
		table.insert(S.people, dad)
	else
		S.flags.noDad = true
	end
	-- os filhos herdam um pouco dos pais
	local function mix(a, b, sd)
		return clamp((a + b) / 2 + R.norm(0, sd))
	end
	local bio = dad or self:mkPerson({ rel = "tmp", gender = "M", age = dAge })
	m.looks = mix(mom.looks, bio.looks, 12)
	m.smarts = mix(mom.smarts, bio.smarts, 12)
	m.genes = Looks.childGenes(mom, bio, gender, c.id)
	Looks.ensure(m)
	for _ = 1, R.wpick({ { 0, 30 }, { 1, 38 }, { 2, 20 }, { 3, 9 }, { 4, 3 } }) do
		table.insert(S.people, self:uniqFirst(self:mkPerson({ rel = "irmao", age = R.int(1, math.max(1, mAge - 19)), last = last, bond = R.int(40, 90), from = { mom, bio } })))
	end
	for i = 1, R.int(0, 4) do
		local a = mAge + R.int(18, 34)
		if a < 95 then
			table.insert(S.people, self:mkPerson({ rel = "avo", gender = i % 2 == 1 and "M" or "F", age = a, money = R.int(wealth[1], wealth[2]), health = R.int(30, 90), bond = R.int(50, 90) }))
		end
	end
	table.insert(S.log, { age = 0, year = S.year, lines = {} })
	self:log(string.format("Nasci %s em %s, %s, no ano de %d.", gender == "F" and "menina" or "menino", m.city, c.n, S.year), "big")
	self:log(string.format("Meu nome é %s %s.", m.first, m.last))
	self:log(string.format("Minha mãe é %s %s, %s, %d anos.", mom.first, mom.last, mom.job and string.lower(mom.job) or "sem emprego", mom.age))
	if dad then
		self:log(string.format("Meu pai é %s %s, %s, %d anos.", dad.first, dad.last, dad.job and string.lower(dad.job) or "sem emprego", dad.age))
	else
		self:log("Não conheci meu pai.")
	end
	local sibs = self:people("irmao")
	if #sibs > 0 then
		local ns = {}
		for _, s in sibs do
			table.insert(ns, s.first)
		end
		self:log(string.format("Tenho %d %s: %s.", #sibs, #sibs > 1 and "irmãos" or "irmão", table.concat(ns, ", ")))
	end
	self:log(({ pobre = "Minha família é pobre.", media = "Minha família é de classe média.", rica = "Minha família é rica.", milionaria = "Nasci numa família milionária." })[cls])
	if R.chance(0.05) then
		self:log("Nasci prematur" .. self:oa() .. " e passei semanas na incubadora.", "warn")
		self:st("health", -10)
	end
end

---------------------------------------------------------------------------
-- envelhecer
---------------------------------------------------------------------------
-- dificuldade (DIFF em src/core.js): chance de morrer e quanto o trabalho paga
local DIFF = { facil = { d = 0.6, money = 1.3, n = "Fácil" }, normal = { d = 1, money = 1, n = "Normal" }, dificil = { d = 1.7, money = 0.75, n = "Difícil" } }
Engine.DIFF = DIFF
function Engine:diff()
	return DIFF[self.S.flags.diff or "normal"] or DIFF.normal
end

local function deathP(age: number, health: number): number
	if age < 1 then
		return 0.002
	end
	local base = age < 45 and 0.00035 or 0.012 * math.exp(0.09 * (age - 60))
	return math.min(0.9, base * (1.6 - health / 100) ^ 2 / (age < 45 and 1 or 0.81))
end
Engine.deathP = deathP

-- máquina do tempo (SNAPS em src/core.js): guarda como a vida estava antes de cada ano, até 5 anos
local SNAP_MAX = 5
function Engine:snap()
	self.snaps = self.snaps or {}
	table.insert(self.snaps, { age = self.S.me.age, year = self.S.year, s = Util.deepCopy(self.S) })
	while #self.snaps > SNAP_MAX do
		table.remove(self.snaps, 1)
	end
end

function Engine:timeTravel(i: number): boolean
	local sn = self.snaps and self.snaps[i]
	if not sn then
		return false
	end
	self.S = Util.deepCopy(sn.s)
	for k = #self.snaps, i, -1 do
		table.remove(self.snaps, k)
	end
	self:use()
	self:cnt("timeTravel")
	self:log(string.format("Voltei no tempo para os meus %d anos.", self.S.me.age), "warn")
	return true
end

-- modo deus (godSet em src/ui.js): mexe num atributo, talento ou no dinheiro
local GOD_KEYS = { happy = true, health = true, smarts = true, looks = true, karma = true, fame = true, will = true, fight = true }
function Engine:godSet(key: string, d: number): boolean
	local m = self.S.me
	if type(d) ~= "number" or math.abs(d) > 100 then
		return false
	end
	if GOD_KEYS[key] then
		m[key] = clamp((m[key] or 0) + d)
	elseif string.sub(key, 1, 4) == "tal." and m.talent[string.sub(key, 5)] ~= nil then
		local t = string.sub(key, 5)
		m.talent[t] = clamp(m.talent[t] + d)
	elseif key == "money" then
		m.money += d * 1000
	else
		return false
	end
	return true
end

function Engine:ageUp()
	self:use()
	local S, m = self.S, self.S.me
	if not m.alive or #S.pending > 0 then
		return
	end
	self:snap()
	m.age += 1
	S.year += 1
	m.yr = {}
	table.insert(S.log, { age = m.age, year = S.year, lines = {} })
	while #S.log > 140 do
		table.remove(S.log, 1)
	end
	self:yearStats()
	self:yearPeople()
	self:yearSchool()
	self:yearMoney()
	if m.health <= 0 then
		return self:die(self:cause(false))
	end
	if R.chance(deathP(m.age, m.health) * self:diff().d) then
		return self:die(self:cause(true))
	end
	self.fx = self.fx or {}
	self.fx.birthday = true
	self:yearEvents()
end

function Engine:yearStats()
	local m = self.S.me
	local a = m.age
	if a < 20 then
		m.smarts = clamp(m.smarts + R.int(-1, 3))
	end
	if a >= 65 then
		self:st("smarts", -R.int(0, 2))
	end
	if a >= 32 then
		self:st("looks", -(a > 60 and R.int(1, 3) or a > 45 and R.int(0, 2) or R.int(0, 1)))
	end
	if a >= 13 and a <= 18 then
		self:st("looks", R.int(-2, 3))
	end
	if a >= 30 then
		self:st("health", -(a > 80 and R.int(1, 4) or a > 65 and R.int(0, 3) or a > 45 and R.int(0, 2) or R.int(0, 1)))
	end
	if a < 55 and m.add.alcool < 40 then
		self:st("health", R.int(0, a < 30 and 3 or 2))
	end
	local target = 58 + (m.money > 1e5 and 6 or m.money < 0 and -12 or 0) + (#G.partners() > 0 and 6 or 0)
		+ ((m.trabalho or m.edu.cur or m.aposentado) and 4 or (a >= 18 and -10 or 0)) + (m.karma - 50) / 10
	m.happy = clamp(m.happy + (target - m.happy) * 0.2 + R.int(-6, 6))
	if m.add.alcool > 40 then
		self:st("health", -R.int(1, 4))
		self:st("smarts", -1)
	end
	if m.add.alcool > 0 and m.add.alcool < 30 then
		m.add.alcool = math.max(0, m.add.alcool - R.int(2, 6))
	end
	if m.karma > 50 then
		m.karma = clamp(m.karma - 1)
	elseif m.karma < 50 then
		m.karma = clamp(m.karma + 1)
	end
end

local FAMILY = { mae = true, pai = true, filho = true, irmao = true, avo = true, neto = true, adot = true }
local CLOSE = { mae = true, pai = true, filho = true, conjuge = true, irmao = true, adot = true, namoro = true, noivo = true }

function Engine:yearPeople()
	local S, m = self.S, self.S.me
	for _, p in self:people() do
		p.age += 1
		if p.age >= 40 then
			p.health = clamp(p.health - R.int(0, p.age > 70 and 5 or 2))
		end
		local dp = deathP(p.age, p.health) * 0.85 + (p.age < 40 and 0.0006 or 0)
		if R.chance(dp) then
			p.alive = false
			local why = R.pick(p.age > 70 and { "de causas naturais", "dormindo", "de infarto", "de AVC", "de pneumonia", "de câncer" }
				or { "num acidente de carro", "de infarto", "de câncer", "num acidente de trabalho", "de AVC" })
			self:log(string.format("%s %s %s morreu %s, aos %d anos.", self:relLabel(p), p.first, p.last, why, p.age), "bad")
			self:st("happy", CLOSE[p.rel] and -25 or -8)
			if (p.rel == "mae" or p.rel == "pai" or p.rel == "avo") and p.money > 1000 and R.chance(p.rel == "avo" and 0.35 or 0.9) then
				local heirs = 1 + #self:people("irmao")
				local share = Util.round(p.money / heirs * (p.rel == "avo" and 0.5 or 1))
				if share > 0 then
					m.money += share
					self:log("Recebi " .. fmt(share) .. " de herança.", "good")
				end
			end
			if p.rel == "conjuge" then
				self:cnt("widow")
			end
		else
			if p.age >= 18 and p.job and p.age < 70 then
				p.money = Util.round(p.money * (p.money > 0 and 1.01 or 1) + R.int(-1000, 6000))
			end
			if not FAMILY[p.rel] and p.rel ~= "inimigo" then
				p.bond = clamp(p.bond - R.int(0, 5))
			else
				p.bond = clamp(p.bond - R.int(-1, 3))
			end
			if (p.rel == "namoro" or p.rel == "noivo") and p.bond < 18 and R.chance(0.5) then
				p.rel = "ex"
				self:log(p.first .. " terminou comigo.", "bad")
				self:st("happy", -15)
			elseif p.rel == "conjuge" and p.bond < 12 and R.chance(0.35) then
				self:divorce(p, true)
			elseif p.rel == "amigo" and p.bond < 10 and R.chance(0.4) then
				p.rel = "ex_amigo"
				self:log("Perdi contato com " .. p.first .. ".")
			end
			if (p.rel == "filho" or p.rel == "adot") and p.age == 18 then
				self:log(p.first .. " fez 18 anos" .. (R.chance(0.5) and " e saiu de casa" or "") .. ".")
			end
			if (p.rel == "filho" or p.rel == "adot") and p.age >= 25 and p.age <= 42 and R.chance(0.06) then
				local n = self:mkPerson({ rel = "neto", age = 0, bond = R.int(60, 95) })
				table.insert(S.people, n)
				self:log(string.format("%s teve %s: %s!", p.first, n.gender == "F" and "uma filha" or "um filho", n.first), "good")
				self:cnt("grandkids")
			end
		end
	end
	if m.age <= 13 then
		local mom = self:people("mae")[1]
		if mom and mom.age <= 43 and R.chance(0.07) then
			local s = self:uniqFirst(self:mkPerson({ rel = "irmao", age = 0, last = m.last, bond = R.int(50, 80), from = { mom, self:people("pai")[1] or mom } }))
			table.insert(S.people, s)
			self:log(s.gender == "F" and "Nasceu minha irmã " .. s.first .. "!" or "Nasceu meu irmão " .. s.first .. "!", "good")
		end
	end
	local mom, dad = self:people("mae")[1], self:people("pai")[1]
	if mom and dad and not S.flags.divorced and R.chance(0.015) then
		S.flags.divorced = true
		self:log("Meus pais se divorciaram.", "bad")
		self:st("happy", m.age < 18 and -15 or -5)
	end
end

function Engine:divorce(p, theyAsked: boolean)
	local m = self.S.me
	p.rel = "ex"
	self:cnt("divorces")
	local half = m.money > 0 and Util.round(m.money / 2) or 0
	m.money -= half
	self:log(theyAsked and p.first .. " pediu o divórcio." or "Me divorciei de " .. p.first .. ".", "bad")
	if half > 0 then
		self:log("Perdi " .. fmt(half) .. " na partilha.", "bad")
	end
	self:st("happy", -18)
end

-- ---------- escola e faculdade ----------
local COURSES = {
	{ id = "adm", n = "Administração" }, { id = "dir", n = "Direito" }, { id = "med", n = "Medicina", len = 6 },
	{ id = "eng", n = "Engenharia" }, { id = "cc", n = "Ciência da Computação" }, { id = "psi", n = "Psicologia", len = 5 },
	{ id = "enf", n = "Enfermagem" }, { id = "ped", n = "Pedagogia" }, { id = "arq", n = "Arquitetura", len = 5 },
	{ id = "jor", n = "Jornalismo" }, { id = "art", n = "Artes" }, { id = "ef", n = "Educação Física" },
}
Engine.COURSES = COURSES

function Engine:startSchool(kind: string, course)
	local m = self.S.me
	local grade = clamp(15 + m.smarts * 0.7 + R.int(-10, 10))
	if kind == "fund" then
		m.edu.cur = { type = "fund", n = "Ensino Fundamental", len = 9, yr = 0, grade = grade }
		self:log("Comecei o ensino fundamental.")
	elseif kind == "medio" then
		m.edu.cur = { type = "medio", n = "Ensino Médio", len = 3, yr = 0, grade = grade }
		self:log("Comecei o ensino médio.")
	elseif kind == "uni" then
		m.edu.cur = { type = "uni", id = course.id, n = course.n, len = course.len or 4, yr = 0, grade = grade, pub = true }
		self:log("Entrei na faculdade de " .. course.n .. "!", "good")
	end
	for _, p in self:people("colega") do
		p.alive = false
	end
	for _ = 1, R.int(4, 7) do
		table.insert(self.S.people, self:mkPerson({ rel = "colega", age = m.age + R.int(-1, 0), bond = R.int(20, 60) }))
	end
end

function Engine:yearSchool()
	local m = self.S.me
	local cur = m.edu.cur
	if m.age == 3 then
		self:log("Comecei a frequentar a creche.")
	end
	if m.age == 6 and #m.edu.deg == 0 and not cur then
		self:startSchool("fund")
		return
	end
	if not cur then
		return
	end
	local effort = m.c.studyYr or 0
	m.c.studyYr = 0
	local target = 18 + m.smarts * 0.7 + effort * 6 + R.int(-10, 10) - (m.add.alcool > 40 and 10 or 0)
	cur.grade = clamp(cur.grade + (target - cur.grade) * 0.45)
	if cur.grade < 30 and cur.type ~= "uni" and R.chance(0.6) then
		self:log("Repeti de ano. Vou ter que fazer tudo de novo.", "bad")
		self:cnt("repetiu")
		self:st("happy", -8)
		return
	end
	cur.yr += 1
	if cur.yr >= cur.len then
		if cur.type == "fund" then
			table.insert(m.edu.deg, "fund")
			self:log("Terminei o ensino fundamental!", "good")
			self:startSchool("medio")
		elseif cur.type == "medio" then
			table.insert(m.edu.deg, "medio")
			m.edu.cur = nil
			self:log("Me formei no ensino médio!", "good")
			self:st("happy", 8)
		elseif cur.type == "uni" then
			table.insert(m.edu.deg, "uni:" .. cur.id)
			m.edu.cur = nil
			self:log("Me formei em " .. cur.n .. "!", "big")
			self:st("happy", 12)
			self:cnt("degrees")
		end
	end
end

-- ---------- dinheiro, trabalho e aposentadoria ----------
function Engine:yearMoney()
	local S, m = self.S, self.S.me
	local t = m.trabalho
	if t then
		t.yrs += 1
		local pay = Util.round(t.salary * (1 + 0.03 * math.min(t.yrs, 15)) * self:diff().money)
		m.money += pay
		if m.age >= 65 and R.chance(0.5) then
			m.aposentado = { pay = Util.round(pay * 0.6) }
			m.trabalho = nil
			self:log("Me aposentei! Vou receber " .. fmt(m.aposentado.pay) .. " por ano.", "big")
		end
	elseif m.aposentado then
		m.money += m.aposentado.pay
	end
	if m.age >= 18 and S.flags.movedOut then
		local cost = 9000 + (#G.partners() > 0 and 3000 or 0) + #G.kids() * 4000
		m.money -= cost
		if m.money < 0 and not m.c.avisoDivida then
			m.c.avisoDivida = 1
			self:log("As contas do ano passaram do que eu tinha. Estou no vermelho.", "warn")
		elseif m.money >= 0 then
			m.c.avisoDivida = nil
		end
	end
	Politica.year(self)
	Crime.year(self)
end

-- ---------- morte ----------
function Engine:cause(roll: boolean): string
	local m = self.S.me
	local o2 = self:oa()
	if roll then
		if m.age > 75 then
			return R.pick({ "de causas naturais", "dormindo, em paz", "de insuficiência cardíaca", "de pneumonia", "de um AVC" })
		end
		if m.age >= 40 then
			return R.pick({ "de um infarto fulminante", "de um AVC", "de um aneurisma", "de uma infecção grave", "de insuficiência cardíaca", "num acidente de carro" })
		end
		return R.pick({ "num acidente de carro", "de um aneurisma", "afogad" .. o2 .. " no mar", "num acidente doméstico", "de uma infecção grave", "numa queda de escada", "de uma reação alérgica grave" })
	end
	if m.age > 70 then
		return R.pick({ "de causas naturais", "dormindo, em paz", "de insuficiência cardíaca", "de pneumonia", "de um AVC" })
	end
	return R.pick({ "de um infarto fulminante", "de um AVC", "de uma infecção grave", "de insuficiência cardíaca" })
end

-- "Desistir desta vida" no menu
function Engine:giveUp()
	local m = self.S.me
	if not m.alive then
		return
	end
	m.c.gaveUp = 1
	self:log("Decidi que a minha história termina aqui.", "big")
	m.alive = false
	m.cause = "ao encerrar a própria história"
	self.S.pending = {}
end

function Engine:die(cause: string)
	local m = self.S.me
	m.alive = false
	m.cause = cause
	self.S.pending = {}
	self:log(string.format("Morri %s, aos %d anos.", cause, m.age), "big")
	Politica.onDie(self)
end

---------------------------------------------------------------------------
-- eventos
---------------------------------------------------------------------------
local WHO = {
	partner = function(e) return R.pick(G.partners()) end,
	partnerDating = function(e) return R.pick(e:people("namoro")) end,
	partnerEngaged = function(e) return R.pick(e:people("noivo")) end,
	partnerUnhappy = function(e) return R.pick(G.filter(G.partners(), function(p) return p.bond < 55 end)) end,
	spouse = function(e) return R.pick(e:people("conjuge")) end,
	ex = function(e) return R.pick(e:people("ex")) end,
	classmate = function(e) return R.pick(e:people("colega")) end,
	grandkid = function(e) return R.pick(e:people("neto")) end,
	kid = function(e) return R.pick(G.kids()) end,
	baby = function(e) return R.pick(G.filter(G.kids(), function(k) return k.age <= 2 end)) end,
	child = function(e) return R.pick(G.filter(G.kids(), function(k) return k.age >= 3 and k.age <= 12 end)) end,
	teen = function(e) return R.pick(G.filter(G.kids(), function(k) return k.age >= 13 and k.age <= 17 end)) end,
	adultkid = function(e) return R.pick(G.filter(G.kids(), function(k) return k.age >= 18 end)) end,
}

function Engine:eligible(e): boolean
	local m = self.S.me
	if e.min and m.age < e.min or e.max and m.age > e.max then
		return false
	end
	if e.once and m.c["ev_" .. e.id] then
		return false
	end
	if m.ev[e.id] and m.age - m.ev[e.id] < (e.cd or 8) then
		return false
	end
	if e.when then
		for _, w in e.when do
			local ok, res = pcall(w, m)
			if not ok or not G.T(res) then
				return false
			end
		end
	end
	if e.who and not WHO[e.who](self) then
		return false
	end
	return true
end

local function amt(a: number, b: number): number
	return Util.round(R.int(a, b) / 10) * 10
end

function Engine:loveGender(): string
	local m = self.S.me
	return m.gender == "M" and "F" or "M"
end

function Engine:prep(e)
	local m = self.S.me
	local cid = m.country
	local gd = e.date and self:loveGender() or e.same and m.gender or e.gn or (R.chance(0.5) and "M" or "F")
	local gd2 = e.same and m.gender or (R.chance(0.5) and "M" or "F")
	local kid = m.age < 18
	local v = e.v or { 100, 2000 }
	local d = {
		n = pickFirst(cid, gd), nl = pickLast(cid), nG = gd,
		nAge = clamp(m.age + (kid and R.int(-1, 1) or R.int(-7, 7)), math.max(1, kid and m.age - 2 or 18), 99),
		n2 = pickFirst(cid, gd2), n2l = pickLast(cid), n2G = gd2,
		v = amt(v[1], v[2]), v2 = amt(v[1] * 4, v[2] * 4),
		xi = type(e.text) == "table" and R.int(1, #e.text) or 1,
		co = m.trabalho and m.trabalho.co or "empresa", lugar = R.pick(Text.trips),
		coisa = R.pick({ "um tênis caro", "fones novos", "um videogame", "roupas", "um celular usado", "ingressos de show" }),
		prod = R.pick({ "refrigerante", "perfume", "carro", "banco digital", "sabão em pó", "aplicativo de comida" }),
	}
	if e.who then
		local p = WHO[e.who](self)
		if not p then
			return nil
		end
		d.pid, d.p = p.id, p.first
		d.ele = p.gender == "F" and "ela" or "ele"
		d.o2 = p.gender == "F" and "a" or "o"
		d.idade = p.age
	end
	return d
end

-- {marcadores} do texto: os do evento (d) e os sorteados das listas (FILL)
function Engine:fill(s: string): string
	return (string.gsub(s, "{(%w+)}", function(k)
		if k == "o" then
			return self:oa()
		elseif k == "sib" then
			local s1 = self:people("irmao")[1]
			return s1 and s1.first or "o cachorro"
		elseif k == "friend" then
			local pool = self:people("amigo", "colega", "irmao")
			local f = R.pick(pool)
			return f and f.first or "um vizinho"
		elseif Text.fill[k] then
			return R.pick(Text.fill[k])
		end
		return nil
	end))
end

function Engine:tp(s: string?, d): string
	if s == nil then
		return ""
	end
	local out = string.gsub(s, "{(%w+)}", function(k)
		if k == "o" then
			return self:oa()
		elseif k == "a" then
			return self.S.me.gender == "F" and "a" or ""
		elseif k == "v" then
			return fmt(d.v)
		elseif k == "v2" then
			return fmt(d.v2)
		elseif k == "on" or k == "on2" then
			return d[k == "on" and "nG" or "n2G"] == "F" and "a" or "o"
		elseif k == "eln" or k == "eln2" then
			return d[k == "eln" and "nG" or "n2G"] == "F" and "ela" or "ele"
		elseif d[k] ~= nil then
			return tostring(d[k])
		end
		return nil
	end)
	return self:fill(out)
end

function Engine:queue(id: string, d)
	table.insert(self.S.pending, { id = id, d = d or {} })
end

function Engine:yearEvents()
	local m = self.S.me
	if m.age == 1 then
		self:log(string.format('Falei minha primeira palavra: "%s".', R.pick({ "mamã", "papá", "água", "não", "bola", "au-au", "tchau", "neném" })))
	end
	if m.age == 2 and R.chance(0.6) then
		self:log("Dei meus primeiros passos sozinh" .. self:oa() .. ".")
	end
	if m.age >= 3 and R.chance(0.6) then
		local pool = m.age < 13 and Text.fluff.kid or m.age < 18 and Text.fluff.teen or m.age < 65 and Text.fluff.adult or Text.fluff.old
		local line = R.pick(pool)
		if line then
			self:log(self:fill(line))
		end
	end
	local elig = {}
	for _, e in EVENT_LIST do
		if (e.w or 1) > 0 and self:eligible(e) then
			table.insert(elig, e)
		end
	end
	local n = m.age < 3 and 0 or ((R.chance(0.85) and 1 or 0) + (R.chance(0.4) and 1 or 0))
	while n > 0 and #elig > 0 do
		n -= 1
		local weights = {}
		for i, e in elig do
			weights[i] = { i, (e.w or 1.2) / (1 + 0.9 * (m.evN[e.id] or 0)) }
		end
		local idx = R.wpick(weights)
		local e = table.remove(elig, idx)
		local ok, d = pcall(self.prep, self, e)
		if ok and d then
			self:queue(e.id, d)
			m.ev[e.id] = m.age
			m.evN[e.id] = (m.evN[e.id] or 0) + 1
			if e.once then
				m.c["ev_" .. e.id] = 1
			end
		end
	end
end

-- evento da vez, pronto para a tela
function Engine:currentEvent()
	local q = self.S.pending[1]
	if not q then
		return nil
	end
	local pe = Politica.EVENTS[q.id] or Crime.EVENTS[q.id]
	if pe then
		self:use()
		local title, text, choices = pe.show(self, q.d)
		return { k = pe.k, title = title, text = text, choices = choices }
	end
	local e = EVENTS[q.id]
	if not e then
		table.remove(self.S.pending, 1)
		return self:currentEvent()
	end
	self:use()
	local text = type(e.text) == "table" and e.text[q.d.xi or 1] or e.text
	local choices = {}
	for i, c in e.choices do
		choices[i] = self:tp(Util.split(c, "|")[1], q.d)
	end
	return { k = e.k, title = self:tp(e.title, q.d), text = self:tp(text, q.d), choices = choices }
end

function Engine:choose(i: number): string?
	self:use()
	local q = self.S.pending[1]
	if not q then
		return nil
	end
	local pe = Politica.EVENTS[q.id] or Crime.EVENTS[q.id]
	if pe then
		local title = pe.show(self, q.d)
		table.remove(self.S.pending, 1)
		local result = pe.pick(self, i, q.d) or ""
		self:log(title .. ": " .. result)
		return result
	end
	local e = EVENTS[q.id]
	table.remove(self.S.pending, 1)
	if not e or not e.choices[i] then
		return nil
	end
	local result = Dsl.choice(self, e.choices[i], q.d)
	local title = self:tp(e.title, q.d)
	self:log(title .. ": " .. result)
	return result
end

---------------------------------------------------------------------------
-- salvar e carregar
---------------------------------------------------------------------------
function Engine:export()
	return self.S
end

function Engine:import(S)
	if type(S) ~= "table" or type(S.me) ~= "table" or type(S.people) ~= "table" then
		return false
	end
	self.S = S
	S.pending = S.pending or {}
	S.me.ev = S.me.ev or {}
	S.me.evN = S.me.evN or {}
	-- bebida saiu da versão Roblox: zera o vício de saves antigos
	S.me.add = S.me.add or {}
	S.me.add.alcool = 0
	self:use()
	return true
end

Engine.G = G
return Engine
