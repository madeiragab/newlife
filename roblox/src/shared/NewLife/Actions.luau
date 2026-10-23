-- ===== Atividades que o jogador escolhe durante o ano =====
-- Versão enxuta da fase 1 do Roblox: estudo, saúde, amizades, namoro, casamento, emprego, faculdade e adoção.
-- Engine.luau cuida do ano; aqui ficam só as ações. list() diz o que aparece na tela, run() executa.

local Util = require(script and script.Parent:WaitForChild("Util") or "./Util")
local Politica = require(script and script.Parent:WaitForChild("Politica") or "./Politica")
local Crime = require(script and script.Parent:WaitForChild("Crime") or "./Crime")
local Prisao = require(script and script.Parent:WaitForChild("Prisao") or "./Prisao")
local R, clamp, fmt, g = Util.R, Util.clamp, Util.fmt, Util.g

local Actions = {}

-- empregos genéricos até as carreiras de verdade chegarem (fase 2)
local JOBS = {
	{ id = "atend", t = "Atendente|Atendente", salary = 16000 },
	{ id = "vend", t = "Vendedor|Vendedora", salary = 19000 },
	{ id = "garcom", t = "Garçom|Garçonete", salary = 17000 },
	{ id = "aux", t = "Auxiliar administrativo|Auxiliar administrativa", salary = 24000, req = "medio" },
	{ id = "recep", t = "Recepcionista|Recepcionista", salary = 22000, req = "medio" },
	{ id = "tecinf", t = "Técnico de informática|Técnica de informática", salary = 30000, req = "medio" },
	{ id = "prof", t = "Professor|Professora", salary = 42000, req = "uni:ped,art,ef,jor" },
	{ id = "adv", t = "Advogado|Advogada", salary = 70000, req = "uni:dir" },
	{ id = "med", t = "Médico|Médica", salary = 120000, req = "uni:med" },
	{ id = "eng", t = "Engenheiro|Engenheira", salary = 80000, req = "uni:eng" },
	{ id = "dev", t = "Programador|Programadora", salary = 75000, req = "uni:cc" },
	{ id = "psi", t = "Psicólogo|Psicóloga", salary = 50000, req = "uni:psi" },
	{ id = "enf", t = "Enfermeiro|Enfermeira", salary = 45000, req = "uni:enf" },
	{ id = "arq", t = "Arquiteto|Arquiteta", salary = 60000, req = "uni:arq" },
	{ id = "gerente", t = "Gerente administrativo|Gerente administrativa", salary = 65000, req = "uni:adm" },
}
local COMPANIES = { "Grupo Horizonte", "Mercado Bom Preço", "Clínica Vida", "TecNova", "Banco Aurora", "Escola Saber", "Construtora Pilar", "Café Central" }
Actions.JOBS = JOBS

local function hasDeg(m, req: string?): boolean
	if not req then
		return true
	end
	if req == "medio" then
		return table.find(m.edu.deg, "medio") ~= nil
	end
	local list = string.match(req, "^uni:(.*)$")
	for _, id in Util.split(list, ",") do
		if table.find(m.edu.deg, "uni:" .. id) then
			return true
		end
	end
	return false
end

local COURSE_NAME = { adm = "Administração", dir = "Direito", med = "Medicina", eng = "Engenharia", cc = "Ciência da Computação", psi = "Psicologia",
	enf = "Enfermagem", ped = "Pedagogia", arq = "Arquitetura", jor = "Jornalismo", art = "Artes", ef = "Educação Física" }

-- requisito do emprego em texto ("Ensino médio", "Faculdade de Direito"…)
function Actions.reqLabel(req: string?): string
	if not req then
		return "Sem exigência de formação"
	end
	if req == "medio" then
		return "Ensino médio"
	end
	local names = {}
	for _, id in Util.split(string.match(req, "^uni:(.*)$") or "", ",") do
		table.insert(names, COURSE_NAME[id] or id)
	end
	if #names <= 1 then
		return "Faculdade de " .. (names[1] or "")
	end
	return "Faculdade de " .. table.concat(names, ", ", 1, #names - 1) .. " ou " .. names[#names]
end

local function used(game, key: string): number
	local yr = game.S.me.yr
	yr[key] = (yr[key] or 0) + 1
	return yr[key]
end

-- o que dá para fazer agora: { id, label, group, arg? }
function Actions.list(game)
	local S, m = game.S, game.S.me
	local out = {}
	local function add(id, label, group, arg)
		table.insert(out, { id = id, label = label, group = group, arg = arg })
	end
	if not m.alive or #S.pending > 0 then
		return out
	end
	if m.prison then
		Prisao.list(game, add)
		return out
	end
	local a = m.age
	if m.edu.cur then
		add("estudar", "Estudar mais", "Estudos")
	end
	if not m.edu.cur and hasDeg(m, "medio") and a >= 17 then
		for _, c in game.COURSES do
			add("faculdade", "Faculdade de " .. c.n, "Faculdade", c.id)
		end
	end
	if a >= 6 then
		add("ler", "Ler um livro", "Mente e corpo")
	end
	if a >= 12 then
		add("academia", "Ir à academia", "Mente e corpo")
	end
	if a >= 8 then
		add("meditar", "Meditar", "Mente e corpo")
	end
	if a >= 6 then
		add("amigos", "Fazer amizades", "Relações")
	end
	for _, p in game:people() do
		if p.rel ~= "ex_amigo" and p.rel ~= "ex" and p.rel ~= "inimigo" and p.rel ~= "colega" and (a >= 4 or p.rel == "mae" or p.rel == "pai") then
			add("tempo", "Passar tempo com " .. p.first, "Relações", p.id)
		end
	end
	if a >= 18 then
		local parts = game:people("namoro", "noivo", "conjuge")
		if #parts == 0 then
			add("namorar", "Procurar alguém para namorar", "Amor")
		end
		for _, p in game:people("namoro") do
			add("noivar", "Pedir " .. p.first .. " em noivado", "Amor", p.id)
			add("terminar", "Terminar com " .. p.first, "Amor", p.id)
		end
		for _, p in game:people("noivo") do
			add("casar", "Casar com " .. p.first, "Amor", p.id)
			add("terminar", "Terminar com " .. p.first, "Amor", p.id)
		end
		for _, p in game:people("conjuge") do
			add("divorciar", "Pedir o divórcio de " .. p.first, "Amor", p.id)
		end
		if not S.flags.movedOut then
			add("sair_casa", "Sair da casa da família", "Vida")
		end
		if a >= 25 and a <= 55 then
			add("adotar", "Adotar uma criança", "Vida")
		end
		if m.trabalho then
			add("demissao", "Pedir demissão (" .. string.lower(m.trabalho.t) .. ")", "Trabalho")
		elseif a < 70 and not m.office then
			for _, j in JOBS do
				if hasDeg(m, j.req) then
					add("emprego", "Trabalhar como " .. string.lower(g(j.t, m.gender)) .. " (" .. fmt(j.salary) .. "/ano)", "Trabalho", j.id)
				end
			end
		end
	end
	Politica.list(game, add)
	Crime.list(game, add)
	return out
end

local RUN = {}

function RUN.estudar(game)
	local m = game.S.me
	if used(game, "estudar") > 3 then
		return "Já estudei tudo o que dava este ano."
	end
	m.c.studyYr = (m.c.studyYr or 0) + 1
	m.edu.cur.grade = clamp(m.edu.cur.grade + R.int(2, 6))
	game:st("smarts", R.int(0, 2))
	game:st("happy", -R.int(0, 2))
	return R.pick({ "Passei a tarde estudando.", "Fiz todos os exercícios da apostila.", "Montei um resumo caprichado." })
end

function RUN.ler(game)
	if used(game, "ler") > 3 then
		return "Já li demais este ano. Minha cabeça precisa de descanso."
	end
	game:st("smarts", R.int(1, 3))
	game:st("happy", R.int(0, 2))
	return R.pick({ "Li um romance de uma sentada só.", "Terminei um livro de história.", "Li um livro de ficção científica incrível." })
end

function RUN.academia(game)
	if used(game, "academia") > 3 then
		return "Meu corpo pediu descanso. Chega de academia este ano."
	end
	game:st("health", R.int(2, 5))
	game:st("looks", R.int(0, 2))
	game:st("happy", R.int(0, 3))
	return R.pick({ "Treinei pesado e saí renovad" .. game:oa() .. ".", "Fiz uma aula de spinning.", "Corri na esteira e fiz musculação." })
end

function RUN.meditar(game)
	if used(game, "meditar") > 3 then
		return "Já estou zen o bastante por este ano."
	end
	game:st("happy", R.int(2, 6))
	game:st("health", R.int(0, 1))
	return R.pick({ "Meditei por meia hora e fiquei em paz.", "Fiz uma meditação guiada.", "Respirei fundo e esvaziei a mente." })
end

function RUN.amigos(game)
	local m = game.S.me
	if used(game, "amigos") > 2 then
		return "Já conheci gente demais este ano."
	end
	local chance = 0.35 + m.looks / 300 + m.happy / 400
	if not R.chance(chance) then
		game:st("happy", -2)
		return "Tentei puxar conversa, mas não rolou amizade."
	end
	local p = game:mkPerson({ rel = "amigo", age = Util.clamp(m.age + R.int(-2, 2), 4, 99), bond = R.int(50, 75) })
	table.insert(game.S.people, p)
	game:st("happy", 4)
	return "Fiz amizade com " .. p.first .. " " .. p.last .. "."
end

function RUN.tempo(game, id)
	local p = game:P(id)
	if not p or not p.alive then
		return nil
	end
	if (game.S.me.yr["tempo" .. id] or 0) >= 2 then
		return "Já passamos bastante tempo juntos este ano."
	end
	game.S.me.yr["tempo" .. id] = (game.S.me.yr["tempo" .. id] or 0) + 1
	p.bond = clamp(p.bond + R.int(4, 10))
	game:st("happy", R.int(1, 4))
	local what = R.pick({ "Tomei um sorvete", "Assisti a um filme", "Conversei por horas", "Cozinhei", "Dei uma volta no parque", "Joguei videogame" })
	return what .. " com " .. p.first .. "."
end

function RUN.namorar(game)
	local m = game.S.me
	if used(game, "namorar") > 2 then
		return "Cansei de procurar por este ano."
	end
	if not R.chance(0.3 + m.looks / 250) then
		game:st("happy", -3)
		return "Saí algumas vezes, mas não encontrei ninguém especial."
	end
	local p = game:mkPerson({ rel = "namoro", gender = game:loveGender(), age = clamp(m.age + R.int(-5, 5), 18, 99), bond = R.int(65, 85) })
	table.insert(game.S.people, p)
	game:cnt("partners")
	game:st("happy", 10)
	return "Comecei a namorar " .. p.first .. " " .. p.last .. "!"
end

function RUN.noivar(game, id)
	local p = game:P(id)
	if not p or p.rel ~= "namoro" then
		return nil
	end
	if p.bond >= 60 and R.chance(p.bond / 100) then
		p.rel = "noivo"
		p.bond = clamp(p.bond + 10)
		game:st("happy", 12)
		return p.first .. " disse sim! Estamos noivos."
	end
	p.bond = clamp(p.bond - 15)
	game:st("happy", -10)
	return p.first .. " disse que ainda não está pront" .. (p.gender == "F" and "a" or "o") .. "."
end

function RUN.casar(game, id)
	local m = game.S.me
	local p = game:P(id)
	if not p or p.rel ~= "noivo" then
		return nil
	end
	local cost = 15000
	if m.money < cost then
		return "Um casamento custa pelo menos " .. Util.fmt(cost) .. ". Ainda não tenho esse dinheiro."
	end
	m.money -= cost
	p.rel = "conjuge"
	p.bond = clamp(p.bond + 10)
	game:cnt("marriages")
	game:st("happy", 15)
	return "Casei com " .. p.first .. "! A festa custou " .. Util.fmt(cost) .. "."
end

function RUN.terminar(game, id)
	local p = game:P(id)
	if not p or (p.rel ~= "namoro" and p.rel ~= "noivo") then
		return nil
	end
	p.rel = "ex"
	game:st("happy", -8)
	return "Terminei com " .. p.first .. "."
end

function RUN.divorciar(game, id)
	local p = game:P(id)
	if not p or p.rel ~= "conjuge" then
		return nil
	end
	game:divorce(p, false)
	return "Assinei os papéis do divórcio."
end

function RUN.sair_casa(game)
	game.S.flags.movedOut = true
	game:st("happy", 5)
	return "Saí da casa da família. Agora as contas são minhas!"
end

function RUN.adotar(game)
	local m = game.S.me
	local cost = 8000
	if m.money < cost then
		return "O processo de adoção custa " .. Util.fmt(cost) .. ". Ainda não tenho esse dinheiro."
	end
	if used(game, "adotar") > 1 then
		return "Já entrei com um pedido de adoção este ano."
	end
	m.money -= cost
	local k = game:uniqFirst(game:mkPerson({ rel = "adot", age = R.int(0, 8), last = m.last, bond = R.int(70, 95) }))
	table.insert(game.S.people, k)
	game:cnt("kids")
	game:st("happy", 15)
	return string.format("Adotei %s %s, de %d %s!", k.gender == "F" and "a pequena" or "o pequeno", k.first, k.age, k.age == 1 and "ano" or "anos")
end

function RUN.faculdade(game, id)
	local m = game.S.me
	for _, c in game.COURSES do
		if c.id == id then
			if m.smarts < 35 and not R.chance(0.4) then
				game:st("happy", -6)
				return "Não passei no vestibular de " .. c.n .. ". Ano que vem eu tento de novo."
			end
			game:startSchool("uni", c)
			return "Passei no vestibular de " .. c.n .. "!"
		end
	end
	return nil
end

function RUN.emprego(game, id)
	local m = game.S.me
	for _, j in JOBS do
		if j.id == id and hasDeg(m, j.req) then
			if used(game, "emprego") > 3 then
				return "Já mandei currículo demais este ano."
			end
			local chance = 0.45 + m.smarts / 300 + m.looks / 600
			if not R.chance(chance) then
				return "Fiz a entrevista para " .. string.lower(g(j.t, m.gender)) .. ", mas não fui chamad" .. game:oa() .. "."
			end
			m.trabalho = { id = j.id, t = g(j.t, m.gender), salary = j.salary, yrs = 0, co = R.pick(COMPANIES) }
			game:st("happy", 8)
			return "Fui contratad" .. game:oa() .. " como " .. string.lower(m.trabalho.t) .. " na " .. m.trabalho.co .. "!"
		end
	end
	return nil
end

function RUN.demissao(game)
	local m = game.S.me
	if not m.trabalho then
		return nil
	end
	local t = m.trabalho.t
	m.trabalho = nil
	return "Pedi demissão do emprego de " .. string.lower(t) .. "."
end

function Actions.run(game, id: string, arg): string?
	local f = RUN[id] or Politica.RUN[id] or Crime.RUN[id] or Prisao.RUN[id]
	local m = game.S.me
	if not f or not m.alive or #game.S.pending > 0 then
		return nil
	end
	-- só vale o que a lista oferece agora (o cliente não decide sozinho)
	local ok = false
	for _, a in Actions.list(game) do
		if a.id == id and a.arg == arg then
			ok = true
			break
		end
	end
	if not ok then
		return nil
	end
	game:use()
	local msg = f(game, arg)
	if msg then
		game:log(msg)
	end
	return msg
end

return Actions
