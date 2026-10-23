-- ===== Servidor do NewLife no Roblox =====
-- Cada jogador tem a própria vida, que roda aqui (o cliente só mostra e pede ações).
-- O save vai para o DataStore: ao entrar, a cada minuto se mudou algo, ao sair e quando o servidor fecha.

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local DataStoreService = game:GetService("DataStoreService")
local RunService = game:GetService("RunService")
local TextService = game:GetService("TextService")
local MarketplaceService = game:GetService("MarketplaceService")

-- gamepasses (Creator Hub → Monetização → Passes)
local PASSES = { deus = 2053240650, tempo = 2053552675, doacao = 2054200680 }
local function owns(player: Player, key: string): boolean
	local ok, res = pcall(function()
		return MarketplaceService:UserOwnsGamePassAsync(player.UserId, PASSES[key])
	end)
	return ok and res == true
end
local function checkPasses(player: Player)
	return { deus = owns(player, "deus"), tempo = owns(player, "tempo"), doacao = owns(player, "doacao") }
end

local NewLife = ReplicatedStorage:WaitForChild("NewLife")
local Engine = require(NewLife:WaitForChild("Engine"))
local Actions = require(NewLife:WaitForChild("Actions"))
local Politica = require(NewLife:WaitForChild("Politica"))
local View = require(NewLife:WaitForChild("View"))

local remote = Instance.new("RemoteFunction")
remote.Name = "NewLifeRemote"
remote.Parent = ReplicatedStorage

local store = nil
do
	local ok, res = pcall(function()
		return DataStoreService:GetDataStore("NewLife_v1")
	end)
	if ok then
		store = res
	else
		warn("[NewLife] DataStore indisponível; as vidas não serão salvas.", res)
	end
end

local GRAVE_MAX = 20
local sessions = {} -- [Player] = { game, meta, dirty, loaded, last }

local function key(player: Player): string
	return "p_" .. player.UserId
end

local function load(player: Player)
	local s = { game = Engine.new(), meta = { lives = 0, grave = {} }, dirty = false, loaded = false, last = 0, calls = 0 }
	sessions[player] = s
	task.spawn(function()
		s.passes = checkPasses(player)
	end)
	if store then
		for attempt = 1, 3 do
			local ok, data = pcall(function()
				return store:GetAsync(key(player))
			end)
			if ok then
				if type(data) == "table" then
					s.meta = data.meta or s.meta
					if data.S then
						s.game:import(data.S)
					end
				end
				s.loaded = true
				break
			end
			warn("[NewLife] falha ao carregar o save de " .. player.Name .. " (tentativa " .. attempt .. ")", data)
			task.wait(attempt * 2)
		end
	else
		s.loaded = true
	end
	return s
end

local function save(player: Player)
	local s = sessions[player]
	-- sem carregar direito, salvar apagaria o save antigo
	if not s or not store or not s.loaded or not s.dirty then
		return
	end
	local data = { v = 1, meta = s.meta, S = s.game:export() }
	local ok, err = pcall(function()
		store:SetAsync(key(player), data, { player.UserId })
	end)
	if ok then
		s.dirty = false
	else
		warn("[NewLife] falha ao salvar " .. player.Name, err)
	end
end

local function remember(s)
	local m = s.game.S and s.game.S.me
	if not m or m.alive or m.graved then
		return
	end
	m.graved = true
	table.insert(s.meta.grave, 1, { name = m.first .. " " .. m.last, age = m.age, cause = m.cause, year = s.game.S.year })
	while #s.meta.grave > GRAVE_MAX do
		table.remove(s.meta.grave)
	end
end

local function prefs(s)
	s.meta.prefs = s.meta.prefs or {}
	local p = s.meta.prefs
	return { music = p.music ~= false, sfx = p.sfx ~= false, theme = p.theme == "dark" and "dark" or "light" }
end

local function view(s)
	local v = View.build(s.game, { lives = s.meta.lives, grave = s.meta.grave, saving = store ~= nil, prefs = prefs(s), passes = s.passes or {}, passIds = PASSES })
	v.msg = s.msg
	s.msg = nil
	return v
end

local OPS = {}
function OPS.state(_s) end
-- nome digitado na vida personalizada: só letras, e tem que passar pelo filtro de texto do Roblox
local function cleanName(player: Player, v): string?
	if type(v) ~= "string" then
		return nil
	end
	v = string.gsub(string.gsub(v, "^%s+", ""), "%s+$", "")
	local n = utf8.len(v)
	if v == "" or not n or n > 20 or not string.match(v, "^[%a\128-\255' %-]+$") then
		return nil
	end
	local ok, res = pcall(function()
		local f = TextService:FilterStringAsync(v, player.UserId, Enum.TextFilterContext.PrivateChat)
		return f:GetNonChatStringForUserAsync(player.UserId)
	end)
	if not ok or res ~= v then
		return nil
	end
	return v
end

function OPS.new(s, req, player)
	local gender = req.gender == "M" and "M" or req.gender == "F" and "F" or nil
	local country = type(req.country) == "string" and Engine.countryOf(req.country).id == req.country and req.country or nil
	local diff = (req.diff == "facil" or req.diff == "dificil") and req.diff or "normal"
	s.game:newLife({ gender = gender, country = country, diff = diff, first = cleanName(player, req.first), last = cleanName(player, req.last) })
	s.meta.lives += 1
end
function OPS.age(s)
	s.game:ageUp()
	remember(s)
end
function OPS.choose(s, req)
	if type(req.i) == "number" then
		s.game:choose(math.floor(req.i))
	end
end
-- liga e desliga a música e os efeitos (fica no save)
function OPS.prefs(s, req)
	prefs(s)
	if type(req.music) == "boolean" then
		s.meta.prefs.music = req.music
	end
	if type(req.sfx) == "boolean" then
		s.meta.prefs.sfx = req.sfx
	end
	if req.theme == "dark" or req.theme == "light" then
		s.meta.prefs.theme = req.theme
	end
end
-- confere de novo os passes (depois de uma compra)
function OPS.passes(s, _req, player)
	s.passes = checkPasses(player)
end
function OPS.god(s, req)
	if s.passes and s.passes.deus and type(req.key) == "string" and type(req.d) == "number" then
		s.game:use()
		s.game:godSet(req.key, math.floor(req.d))
	end
end
function OPS.time(s, req)
	if s.passes and s.passes.tempo and type(req.i) == "number" then
		s.game:timeTravel(math.floor(req.i))
	end
end
function OPS.giveup(s)
	s.game:giveUp()
	remember(s)
end
-- títulos dos pop-ups depois de uma atividade (como act(fn, título) em src/ui.js)
local ACT_TITLE = {
	estudar = "Estudos", ler = "Biblioteca", academia = "Academia", meditar = "Meditação", amigos = "Amizades", tempo = "Relações",
	namorar = "Amor", noivar = "Pedido de noivado", casar = "Casamento", terminar = "Fim do namoro", divorciar = "Divórcio",
	sair_casa = "Mudança", adotar = "Adoção", faculdade = "Vestibular", emprego = "Entrevista de emprego", demissao = "Demissão",
}
function OPS.act(s, req)
	if type(req.id) == "string" then
		local msg = Actions.run(s.game, req.id, req.arg)
		if msg then
			s.msg = { t = ACT_TITLE[req.id] or Politica.TITLE[req.id] or (string.match(req.id, "^reg_") or string.match(req.id, "^cam_")) and "Regime" or "", x = msg }
		end
	end
end

remote.OnServerInvoke = function(player: Player, req)
	local s = sessions[player]
	while not s do
		task.wait(0.1)
		s = sessions[player]
		if not player.Parent then
			return nil
		end
	end
	if type(req) ~= "table" or type(req.op) ~= "string" or not OPS[req.op] then
		return view(s)
	end
	-- limite simples contra cliques automáticos
	local now = os.clock()
	if now - s.last > 1 then
		s.last, s.calls = now, 0
	end
	s.calls += 1
	if s.calls > 15 then
		return view(s)
	end
	local ok, err = pcall(OPS[req.op], s, req, player)
	if not ok then
		warn("[NewLife] erro em " .. req.op .. " de " .. player.Name, err)
	end
	if req.op ~= "state" then
		s.dirty = true
	end
	return view(s)
end

Players.PlayerAdded:Connect(load)
for _, p in Players:GetPlayers() do
	task.spawn(load, p)
end
Players.PlayerRemoving:Connect(function(player)
	save(player)
	sessions[player] = nil
end)

task.spawn(function()
	while true do
		task.wait(60)
		for player in sessions do
			task.spawn(save, player)
		end
	end
end)

game:BindToClose(function()
	if RunService:IsStudio() and not store then
		return
	end
	local pending = 0
	for player in sessions do
		pending += 1
		task.spawn(function()
			save(player)
			pending -= 1
		end)
	end
	local t = os.clock()
	while pending > 0 and os.clock() - t < 25 do
		task.wait(0.2)
	end
end)
