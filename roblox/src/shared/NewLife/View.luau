-- ===== O que a tela recebe do servidor =====
-- Dados prontos para mostrar, no mesmo formato das telas da web (src/ui.js): cada tela é
-- { title, items }, e cada item é uma seção ({sec}), um cartão ({card}, {hero}) ou uma linha
-- ({l, s, r, ic, face, bars, tone, dis, why, act = {id, arg}, push = tela, op, confirm}).

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
local Looks = dep("Looks")
local Version = dep("Data/Version")
local Icons = dep("Data/Icons")

local fmt, g = Util.fmt, Util.g

local View = {}

local LOG_YEARS = 40
local REL_GROUPS = {
	{ "Família", { "mae", "pai", "irmao", "avo" } },
	{ "Amor", { "namoro", "noivo", "conjuge" } },
	{ "Filhos e netos", { "filho", "adot", "neto" } },
	{ "Amigos", { "amigo" } },
	{ "Desafetos", { "inimigo" } },
	{ "Ex", { "ex" } },
}

local function anos(n: number): string
	return n .. (n == 1 and " ano" or " anos")
end

local function oa(m)
	return m.gender == "F" and "a" or "o"
end

function View.occupation(game): string
	local m = game.S.me
	if m.trabalho then
		return m.trabalho.t
	elseif m.edu.cur then
		return m.edu.cur.type == "uni" and "Universitári" .. oa(m) or "Estudante"
	elseif m.aposentado then
		return "Aposentad" .. oa(m)
	elseif m.age < 2 then
		return "Bebê"
	elseif m.age < 6 then
		return "Criança"
	elseif m.age < 18 then
		return "Estudante"
	end
	return "Desempregad" .. oa(m)
end

-- confiança (segunda barra das relações), como frOf em src/social.js
local function fr(p)
	if p.fr == nil then
		p.fr = Util.clamp(p.bond + Util.R.int(-20, 10))
	end
	return p.fr
end

local function face(p, isMe, game)
	if not p.genes then
		p.genes = Looks.randGenes(p.gender or "M", game.S.me.country)
	end
	Looks.ensure(p)
	return Looks.face(p, isMe and game.S.me.happy or p.bond, isMe)
end

local function ageGate(item, age, min)
	if age < min then
		item.dis = true
		item.why = "Disponível a partir dos " .. min .. " anos."
		item.r = min .. "+"
	end
	return item
end

-- linha de ação: fica ativa só se a ação estiver liberada agora (Actions.list)
local function actRow(allowed, id, arg, row)
	row.act = { id = id, arg = arg }
	if not allowed[id .. "|" .. tostring(arg)] then
		row.dis = true
	end
	return row
end

local function personRow(game, p)
	return {
		face = face(p, false, game),
		l = p.first .. " " .. p.last,
		s = game:relLabel(p) .. " · " .. anos(p.age),
		bars = { { "❤️", p.bond, "#F0567A" }, { "🤝", fr(p), "#2E86FF" } },
		push = "person:" .. p.id,
	}
end

local function views(game, meta)
	local S, m = game.S, game.S.me
	local allowed = {}
	for _, a in Actions.list(game) do
		allowed[a.id .. "|" .. tostring(a.arg)] = true
	end
	local V = {}
	local age = m.age

	-- ---------- carreira ----------
	do
		local it = {}
		local c = m.edu.cur
		if c then
			table.insert(it, { sec = "Estudos" })
			local card = { { "Curso", c.n }, { "Ano", math.min(c.yr + 1, c.len) .. " de " .. c.len } }
			if c.pub then
				table.insert(card, { "Instituição", "Pública" })
			end
			table.insert(card, { bar = "Nota", v = c.grade })
			table.insert(it, { card = card })
			table.insert(it, actRow(allowed, "estudar", nil, { l = "Estudar mais", s = "Melhora as notas" }))
		elseif age >= 17 and table.find(m.edu.deg, "medio") then
			table.insert(it, { sec = "Estudos" })
			table.insert(it, { l = "Faculdade", s = "Universidade pública", push = "uni" })
		end
		table.insert(it, { sec = "Trabalho" })
		if m.trabalho then
			local t = m.trabalho
			table.insert(it, { card = { { "Cargo", t.t }, { "Empresa", t.co }, { "Salário", fmt(t.salary) .. "/ano" }, { "Tempo de casa", anos(t.yrs) } } })
			table.insert(it, actRow(allowed, "demissao", nil, { l = "Pedir demissão", tone = "bad", confirm = { t = "Pedir demissão?", x = "Vou sair do emprego de " .. string.lower(t.t) .. ".", yes = "Pedir demissão" } }))
		elseif m.aposentado then
			table.insert(it, { card = { { "Situação", "Aposentad" .. oa(m) }, { "Aposentadoria", fmt(m.aposentado.pay) .. "/ano" } } })
		else
			table.insert(it, ageGate({ l = "Procurar emprego", s = "Vagas de acordo com a minha formação", push = "jobs" }, age, 18))
		end
		local card = {}
		for _, d in m.edu.deg do
			local id = string.match(d, "^uni:(.+)$")
			if id then
				for _, co in game.COURSES do
					if co.id == id then
						table.insert(card, { "Faculdade de " .. co.n, "Concluída" })
					end
				end
			elseif d == "medio" then
				table.insert(card, { "Ensino médio", "Concluído" })
			elseif d == "fund" then
				table.insert(card, { "Ensino fundamental", "Concluído" })
			end
		end
		if #card > 0 then
			table.insert(it, { sec = "Formação" })
			table.insert(it, { card = card })
		end
		V.career = { title = "Carreira", items = it }
	end
	do
		local it = {}
		for _, c in game.COURSES do
			table.insert(it, actRow(allowed, "faculdade", c.id, { ic = "🎓", l = c.n, s = anos(c.len or 4) .. " · pública" }))
		end
		V.uni = { title = "Faculdade", items = it }
	end
	do
		local it = {}
		for _, j in Actions.JOBS do
			local row = actRow(allowed, "emprego", j.id, { l = g(j.t, m.gender), s = Actions.reqLabel(j.req), r = fmt(j.salary) })
			if row.dis then
				row.why = j.req and ("Preciso de " .. Actions.reqLabel(j.req) .. ".") or "Indisponível agora."
			end
			table.insert(it, row)
		end
		V.jobs = { title = "Vagas de emprego", items = it }
	end

	-- ---------- bens ----------
	do
		local it = { { card = { { "Dinheiro", fmt(m.money) }, { "Patrimônio líquido", fmt(game:netWorth()) } } } }
		table.insert(it, { sec = "Moradia" })
		if S.flags.movedOut then
			local custo = 9000 + (#game:people("namoro", "noivo", "conjuge") > 0 and 3000 or 0) + #game:people("filho", "adot") * 4000
			table.insert(it, { card = { { "Onde moro", "Na minha casa" }, { "Contas do ano", fmt(custo) } } })
		else
			table.insert(it, { card = { { "Onde moro", "Com a minha família" } } })
			table.insert(it, ageGate(actRow(allowed, "sair_casa", nil, { l = "Sair de casa", s = "Morar sozinh" .. oa(m) .. " e pagar as próprias contas", confirm = { t = "Sair de casa?", x = "Vou morar sozinh" .. oa(m) .. ". Daqui em diante, as contas do ano são minhas.", yes = "Sair de casa" } }), age, 18))
		end
		V.assets = { title = "Bens", items = it }
	end

	-- ---------- relações ----------
	do
		local it = { { face = face(m, true, game), l = "Eu: " .. m.first .. " " .. m.last, s = "Visual, genética e talentos", push = "me" } }
		for _, grp in REL_GROUPS do
			local ps = game:people(table.unpack(grp[2]))
			if #ps > 0 then
				table.insert(it, { sec = grp[1] })
				for _, p in ps do
					table.insert(it, personRow(game, p))
				end
			end
		end
		local dead = {}
		for _, p in S.people do
			if not p.alive and table.find({ "mae", "pai", "irmao", "avo", "filho", "conjuge", "adot" }, p.rel) then
				table.insert(dead, p)
			end
		end
		if #dead > 0 then
			table.insert(it, { sec = "Saudades" })
			for _, p in dead do
				table.insert(it, { face = face(p, false, game), l = p.first .. " " .. p.last, s = game:relLabel(p) .. " · falecid" .. (p.gender == "F" and "a" or "o"), dis = true })
			end
		end
		V.relations = { title = "Relações", items = it }
		-- uma tela por pessoa
		for _, p in game:people() do
			if p.rel ~= "colega" and p.rel ~= "ex_amigo" then
				local card = { { bar = "Relação", v = p.bond }, { bar = "Confiança", v = fr(p) } }
				if p.job then
					table.insert(card, { "Profissão", p.job })
				end
				local pi = { { hero = { face = face(p, false, game), title = p.first .. " " .. p.last, sub = game:relLabel(p) .. " · " .. anos(p.age) }, card = card } }
				table.insert(pi, actRow(allowed, "tempo", p.id, { l = "Passar tempo juntos", s = "Melhora a relação" }))
				if p.rel == "namoro" then
					table.insert(pi, actRow(allowed, "noivar", p.id, { ic = "💍", l = "Pedir em noivado" }))
					table.insert(pi, actRow(allowed, "terminar", p.id, { l = "Terminar", tone = "bad", confirm = { t = "Terminar?", x = "Vou terminar com " .. p.first .. ".", yes = "Terminar" } }))
				elseif p.rel == "noivo" then
					table.insert(pi, actRow(allowed, "casar", p.id, { ic = "💒", l = "Casar", s = "A festa custa " .. fmt(15000) }))
					table.insert(pi, actRow(allowed, "terminar", p.id, { l = "Terminar o noivado", tone = "bad", confirm = { t = "Terminar?", x = "Vou terminar o noivado com " .. p.first .. ".", yes = "Terminar" } }))
				elseif p.rel == "conjuge" then
					table.insert(pi, actRow(allowed, "divorciar", p.id, { l = "Pedir o divórcio", tone = "bad", confirm = { t = "Divórcio?", x = "Vou pedir o divórcio de " .. p.first .. ". Metade do dinheiro vai na partilha.", yes = "Pedir o divórcio" } }))
				end
				V["person:" .. p.id] = { title = p.first, items = pi }
			end
		end
		local ge = m.genes or {}
		local others = { { bar = "Carma", v = m.karma }, { bar = "Fama", v = m.fame or 0 } }
		if (m.add.alcool or 0) > 0 then
			table.insert(others, { bar = "Vício em álcool", v = m.add.alcool })
		end
		V.me = {
			title = "Eu",
			items = {
				{ hero = { face = face(m, true, game), title = m.first .. " " .. m.last, sub = anos(m.age) .. " · Cabelo " .. tostring(ge.hair) .. ", olhos " .. tostring(ge.eyes) }, card = { { "Nascimento", m.born .. ", " .. m.city }, { "País", game.countryOf(m.country).n }, { "Geração", tostring(S.gen or 1) } } },
				{ sec = "Talentos" },
				{ card = {
					{ bar = "Atuação", v = m.talent.acting or 0 }, { bar = "Música", v = m.talent.musical or 0 }, { bar = "Esporte", v = m.talent.athletic or 0 },
					{ bar = "Artes", v = m.talent.art or 0 }, { bar = "Dança", v = m.talent.dance or 0 }, { bar = "Escrita", v = m.talent.writing or 0 },
					{ bar = "Humor", v = m.talent.comedy or 0 }, { bar = "Luta", v = m.fight or 0 }, { bar = "Força de vontade", v = m.will or 50 },
				} },
				{ sec = "Outros" },
				{ card = others },
			},
		}
	end

	-- ---------- atividades ----------
	do
		local function body(min, id, l, s)
			return ageGate(actRow(allowed, id, nil, { l = l, s = s }), age, min)
		end
		V.activities = {
			title = "Atividades",
			items = {
				ageGate({ l = "Mente e corpo", s = "Academia, biblioteca, meditação", push = "mind" }, age, 4),
				ageGate({ l = "Amizades", s = "Conhecer gente nova", push = "friends" }, age, 6),
				ageGate({ l = "Amor", s = "Encontros e namoro", push = "love" }, age, 18),
				ageGate(actRow(allowed, "adotar", nil, { l = "Adotar uma criança", s = "Processo de " .. fmt(8000), confirm = { t = "Adoção", x = "Iniciar um processo de adoção por " .. fmt(8000) .. "?", yes = "Adotar" } }), age, 25),
			},
		}
		V.mind = {
			title = "Mente e corpo",
			items = {
				body(12, "academia", "Academia", "Saúde e aparência"),
				body(6, "ler", "Biblioteca", "Inteligência"),
				body(8, "meditar", "Meditação", "Felicidade e força de vontade"),
			},
		}
		V.friends = { title = "Amizades", items = { body(6, "amigos", "Puxar conversa com alguém", "Pode virar amizade") } }
		local love = {}
		if #game:people("namoro", "noivo", "conjuge") > 0 then
			table.insert(love, { card = { { p = "Já estou num relacionamento. Para cuidar dele, abra a pessoa em Relações." } } })
		else
			table.insert(love, body(18, "namorar", "Sair para conhecer alguém", "Encontros e aplicativos"))
		end
		V.love = { title = "Amor", items = love }
	end

	-- ---------- menu ----------
	do
		local prefs = meta and meta.prefs or {}
		V.menu = {
			title = "Menu",
			items = {
				{ ic = "🏳️", l = "Desistir desta vida", s = "Encerra a vida atual agora", tone = "bad", op = "giveup", dis = not m.alive, confirm = { t = "Desistir desta vida?", x = "A vida de " .. m.first .. " termina aqui.", yes = "Desistir" } },
				{ ic = "🏡", l = "Tela inicial", s = "Continuar, criar uma vida ou ver novidades", op = "home" },
				{ l = "Cemitério", s = #((meta and meta.grave) or {}) .. " vidas vividas", push = "grave" },
				{ ic = "🎵", l = "Música", r = prefs.music == false and "Desligada" or "Ligada", op = "music" },
				{ ic = "🔊", l = "Efeitos sonoros", r = prefs.sfx == false and "Desligados" or "Ligados", op = "sfx" },
				{ l = "Tema", r = prefs.theme == "dark" and "Escuro" or "Claro", op = "theme" },
				{ sec = "Extras" },
				meta and meta.passes and meta.passes.deus and { ic = "⚡", l = "Modo Deus", s = "Mude atributos e talentos", push = "god" }
					or { ic = "⚡", l = "Modo Deus", s = "Mude atributos e talentos quando quiser", r = "Comprar", op = "buy", arg = "deus" },
				meta and meta.passes and meta.passes.tempo and { ic = "⏳", l = "Máquina do tempo", s = #(game.snaps or {}) > 0 and ("Voltar até " .. #game.snaps .. " ano(s)") or "Nenhum ano salvo ainda", push = "time" }
					or { ic = "⏳", l = "Máquina do tempo", s = "Volte até 5 anos e refaça suas escolhas", r = "Comprar", op = "buy", arg = "tempo" },
				{ ic = "💖", l = "Apoie o jogo", s = meta and meta.passes and meta.passes.doacao and "Obrigado pelo apoio!" or "Ajude o NewLife a crescer", op = "buy", arg = "doacao" },
				{ l = "Como jogar", op = "help" },
			},
		}
		local gi = {}
		for _, gv in (meta and meta.grave) or {} do
			table.insert(gi, { ic = "🪦", l = gv.name, s = string.format("%s, aos %d anos · %d", gv.cause or "", gv.age or 0, gv.year or 0) })
		end
		if #gi == 0 then
			gi = { { card = { { p = "Ninguém por aqui ainda." } } } }
		end
		V.grave = { title = "Cemitério", items = gi }
		-- modo deus: cada atributo com botões -10 -1 +1 +10
		local god = { { card = { { p = "Mude o que quiser. Vale para esta vida." } } } }
		local function line(key, label, v)
			table.insert(god, { card = { { bar = label, v = v } }, btns = { { l = "-10", key = key, d = -10 }, { l = "-1", key = key, d = -1 }, { l = "+1", key = key, d = 1 }, { l = "+10", key = key, d = 10 } } })
		end
		table.insert(god, { sec = "Atributos" })
		line("happy", "Felicidade", m.happy)
		line("health", "Saúde", m.health)
		line("smarts", "Inteligência", m.smarts)
		line("looks", "Aparência", m.looks)
		line("karma", "Carma", m.karma)
		line("fame", "Fama", m.fame or 0)
		line("will", "Força de vontade", m.will or 50)
		line("fight", "Luta", m.fight or 0)
		table.insert(god, { sec = "Talentos" })
		for _, t in { { "acting", "Atuação" }, { "musical", "Música" }, { "athletic", "Esporte" }, { "art", "Artes" }, { "dance", "Dança" }, { "writing", "Escrita" }, { "comedy", "Humor" } } do
			line("tal." .. t[1], t[2], m.talent[t[1]] or 0)
		end
		table.insert(god, { sec = "Dinheiro" })
		table.insert(god, { card = { { "Dinheiro", fmt(m.money) } }, btns = { { l = "-$10 mil", key = "money", d = -10 }, { l = "+$1 mil", key = "money", d = 1 }, { l = "+$10 mil", key = "money", d = 10 }, { l = "+$100 mil", key = "money", d = 100 } } })
		V.god = { title = "Modo Deus", items = god }
		-- máquina do tempo
		local ti = { { card = { { p = "Volte para um ano anterior e viva tudo de novo a partir dali." } } } }
		for i = #(game.snaps or {}), 1, -1 do
			local sn = game.snaps[i]
			table.insert(ti, { ic = "⏳", l = string.format("Voltar para os %d anos", sn.age), s = tostring(sn.year), op = "time", arg = i, confirm = { t = "Voltar no tempo?", x = string.format("A vida volta para os %d anos. O que aconteceu depois disso some.", sn.age), yes = "Voltar" } })
		end
		if #ti == 1 then
			table.insert(ti, { card = { { p = "Envelheça um ano para a máquina guardar o ponto de volta." } } })
		end
		V.time = { title = "Máquina do tempo", items = ti }
	end
	return V
end

function View.build(game, meta)
	local out = { meta = meta, version = Version.v, changelog = Icons.changelog }
	local S = game.S
	if not S then
		return out
	end
	local m = S.me
	local c = game.countryOf(m.country)
	out.me = {
		name = m.first .. " " .. m.last, first = m.first, gender = m.gender, age = m.age, year = S.year, born = m.born,
		country = c.n, cid = c.id, city = m.city, sub = anos(m.age) .. " · " .. View.occupation(game) .. " · " .. m.city,
		money = Util.fmt(m.money), neg = m.money < 0, alive = m.alive, cause = m.cause,
		stats = { happy = m.happy, health = m.health, smarts = m.smarts, looks = m.looks },
		face = face(m, true, game),
	}
	local ev = game:currentEvent()
	if ev then
		ev.emoji = Icons.kick[ev.k or ""]
	end
	out.event = ev
	out.fx = game:takeFx()
	out.actions = Actions.list(game)
	out.views = views(game, meta)
	if not m.alive then
		local kids = 0
		for _, p in S.people do
			if p.rel == "filho" or p.rel == "adot" then
				kids += 1
			end
		end
		local card = { { "Patrimônio", fmt(game:netWorth()) } }
		if m.trabalho then
			table.insert(card, { "Última profissão", m.trabalho.t })
		end
		table.insert(card, { "Filhos", tostring(kids) })
		table.insert(card, { "Casamentos", tostring(m.c.marriages or 0) })
		table.insert(card, { "Geração", tostring(S.gen or 1) })
		out.death = { rip = m.c.gaveUp and "FIM DA HISTÓRIA" or "DESCANSE EM PAZ", card = card }
	end
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
