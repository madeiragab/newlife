-- Testa o movimento, a noite do golpe, os cinco caminhos do regime, refundar o país e a sucessão
local process = require("@lune/process")
local Util = require("../src/shared/NewLife/Util")
local Engine = require("../src/shared/NewLife/Engine")
local Actions = require("../src/shared/NewLife/Actions")
local View = require("../src/shared/NewLife/View")
local Politica = require("../src/shared/NewLife/Politica")
local R = require("../src/shared/NewLife/Util").R

local bad = 0
local function check(c, msg) if not c then bad += 1 print("  " .. msg) end end
local function semMarcador(s, onde) check(not string.find(s or "", "{%w*}"), "marcador sem preencher em " .. onde .. ": " .. tostring(s)) end

local function adulto(seed)
	Util.seed(seed)
	local g = Engine.new()
	g:newLife({})
	g.S.me.age = 30
	g.S.me.money = 50000000
	return g
end
local function eventos(g, escolha)
	local n = 0
	while g:currentEvent() and n < 20 do
		local ev = g:currentEvent()
		semMarcador(ev.title .. ev.text .. table.concat(ev.choices, " "), "evento")
		semMarcador(g:choose(escolha or 1), "resultado")
		n += 1
	end
end
local function run(g, id, arg)
	local msg = Actions.run(g, id, arg)
	semMarcador(msg, id)
	return msg
end

for i, tipo in { "militar", "monarquia", "popular", "teocracia", "transicao" } do
	local g = adulto(100 + i)
	local m = g.S.me
	run(g, "rev_fundar", 2)
	check(m.rev and m.rev.n == Politica.REV_NOMES[2], "fundar o movimento")
	m.rev.apoio, m.rev.mil, m.rev.equip, m.rev.membros = 100, 100, 100, 5000
	local v = View.build(g, { prefs = {}, grave = {} })
	check(v.views.rev and #v.views.rev.items > 5, "tela do movimento")
	run(g, "rev_golpe")
	local etapas = 0
	while g:currentEvent() and g.S.pending[1].id == "golpe_etapa" do
		etapas += 1
		g:choose(2)
	end
	check(etapas == 3, "a noite do golpe tem três decisões (" .. etapas .. ")")
	if not m.office then
		-- o golpe pode falhar mesmo com 95%: força o poder para seguir o teste
		m.office = { dit = 1, yrs = 0, appr = 50 }
		g:queue("golpe_decreto", {})
	end
	check(g.S.pending[1] and g.S.pending[1].id == "golpe_decreto", "primeiro decreto depois do golpe")
	local idx = table.find({ "militar", "monarquia", "popular", "teocracia", "transicao" }, tipo)
	g:choose(idx)
	local r = Politica.regime(m)
	check(r.tipo == tipo, "caminho escolhido: " .. tipo)
	check(View.occupation(g) == Politica.titulo(g), "título no topo")
	v = View.build(g, { prefs = {}, grave = {} })
	check(v.views.regime and v.views.pais_nome and v.views.herdeiro, "telas do regime")
	check(v.views.career.items[2].push == "regime", "Carreira abre o regime")
	-- todas as ações liberadas
	local feitas = 0
	for _, a in Actions.list(g) do
		if m.office and m.office.dit and a.id ~= "reg_exilio" and a.id ~= "reg_anexar" then
			run(g, a.id, a.arg)
			eventos(g, 1)
			feitas += 1
		end
	end
	check(feitas >= 15, "ações do regime (" .. feitas .. ")")
	check(m.c.paisNome ~= nil, "mudou o nome do país")
	-- anos passando
	for _ = 1, 12 do
		if not m.alive then break end
		g:ageUp()
		eventos(g, 2)
	end
end

-- sucessão na monarquia
do
	local g = adulto(7)
	local m = g.S.me
	m.office = { dit = 1, yrs = 0, appr = 50 }
	g:queue("golpe_decreto", {})
	g:choose(2)
	local k = g:mkPerson({ rel = "filho", gender = "F", age = 20 })
	table.insert(g.S.people, k)
	run(g, "reg_herdeiro", k.id)
	check(Politica.regime(m).herdeiro == k.id, "escolher herdeiro")
	g:die("de velhice")
	check(k.trono ~= nil, "a herdeira assumiu o trono")
end

-- exílio e transição eleita não quebram a tela
do
	local g = adulto(8)
	local m = g.S.me
	m.office = { dit = 1, yrs = 0, appr = 50 }
	g:queue("golpe_decreto", {})
	g:choose(1)
	run(g, "reg_exilio")
	check(m.office == nil, "exílio tira do poder")
	check(View.build(g, { prefs = {}, grave = {} }).views.rev ~= nil, "tela depois do exílio")
end

-- salário do golpe: dobro por padrão, e salário alto chama investigação
do
	local g = adulto(9)
	local m = g.S.me
	m.office = { dit = 1, yrs = 0, appr = 50 }
	g:queue("golpe_decreto", {})
	g:choose(1)
	local r = Politica.regime(m)
	check(Politica.risco(r) > 0 and Politica.risco(r) < 0.05, "risco com o dobro do salário")
	run(g, "reg_salario", 20)
	check(r.salMult == 20 and Politica.risco(r) >= 0.5, "salário de 20x aumenta o risco")
	check(View.build(g, { prefs = {}, grave = {} }).views.salario ~= nil, "tela do salário")
	local antes = m.money
	g:ageUp()
	check(m.money - antes > 5000000 or not m.alive or m.office == nil or #g.S.pending > 0, "recebe o salário de 20x")
	g:queue("regime_investigacao", {})
	while g.S.pending[1] and g.S.pending[1].id ~= "regime_investigacao" do table.remove(g.S.pending, 1) end
	semMarcador(g:currentEvent().text, "investigação")
	g:choose(1)
	check(r.salMult == 1, "baixar o salário na investigação")
end

-- anexar escolhendo o país
do
	local g = adulto(10)
	local m = g.S.me
	m.country = "BR"
	m.office = { dit = 1, yrs = 0, appr = 50 }
	g:queue("golpe_decreto", {})
	g:choose(1)
	local r = Politica.regime(m)
	check(Politica.chanceAnexar(g, r, "PT") > Politica.chanceAnexar(g, r, "US"), "Portugal é mais fácil que os EUA")
	local semBomba = Politica.chanceAnexar(g, r, "FR")
	r.nuclear = 1
	check(Politica.chanceAnexar(g, r, "FR") > semBomba + 0.3, "a bomba ajuda contra potência nuclear")
	local v = View.build(g, { prefs = {}, grave = {} }).views.anexar
	check(v and #v.items == 16, "tela com os 14 países")
	semMarcador(run(g, "reg_anexar", "PT"), "anexar")
	check(Actions.run(g, "reg_anexar", "BR") == nil, "não anexa o próprio país")
end

-- assassinato leve: uma vez por ano, com julgamento possível
for seed = 20, 40 do
	local g = adulto(seed)
	local m = g.S.me
	local alvo = g:people("mae", "pai", "irmao")[1]
	if alvo then
		semMarcador(run(g, "assassinar", alvo.id), "assassinar")
		check(Actions.run(g, "assassinar", alvo.id) == nil, "só uma vez por ano")
		eventos(g, (seed % 3) + 1)
		for _ = 1, 3 do
			if not m.alive then break end
			g:ageUp()
			eventos(g, (seed % 3) + 1)
		end
	end
end

-- prisão: condenação, ano na cadeia, atividades, fuga e soltura
do
	local Prisao = require("../src/shared/NewLife/Prisao")
	for seed = 50, 70 do
		local g = adulto(seed)
		local m = g.S.me
		Prisao.prender(g, "assassinato", 3, 6)
		check(m.prison and View.occupation(g):sub(1, 5) == "Deten", "preso vira detento")
		local v = View.build(g, { prefs = {}, grave = {} })
		check(v.views.career.items[1].sec == "Prisão", "Carreira mostra a prisão")
		for _ = 1, 12 do
			if not m.alive or not m.prison then break end
			for _, a in Actions.list(g) do
				check(a.group == "Prisão", "só ações da prisão: " .. a.id)
			end
			local a = R.pick(Actions.list(g))
			if a then run(g, a.id, a.arg) end
			eventos(g, (seed % 2) + 1)
			g:ageUp()
			eventos(g, (seed % 3) + 1)
		end
		check(not m.alive or not m.prison or m.prison.anos > 0, "a pena acaba")
	end
end

if bad > 0 then process.exit(1) end
print("Política ok.")
