-- ===== Servidor do NewLife no Roblox =====
-- Cada jogador tem a própria vida, que roda aqui (o cliente só mostra e pede ações).
-- O save vai para o DataStore: ao entrar, a cada minuto se mudou algo, ao sair e quando o servidor fecha.

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local DataStoreService = game:GetService("DataStoreService")
local RunService = game:GetService("RunService")

local NewLife = ReplicatedStorage:WaitForChild("NewLife")
local Engine = require(NewLife:WaitForChild("Engine"))
local Actions = require(NewLife:WaitForChild("Actions"))
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

local function view(s)
	return View.build(s.game, { lives = s.meta.lives, grave = s.meta.grave, saving = store ~= nil })
end

local OPS = {}
function OPS.state(_s) end
function OPS.new(s, req)
	local gender = req.gender == "M" and "M" or req.gender == "F" and "F" or nil
	local country = type(req.country) == "string" and Engine.countryOf(req.country).id == req.country and req.country or nil
	s.game:newLife({ gender = gender, country = country })
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
function OPS.act(s, req)
	if type(req.id) == "string" then
		Actions.run(s.game, req.id, req.arg)
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
	local ok, err = pcall(OPS[req.op], s, req)
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
