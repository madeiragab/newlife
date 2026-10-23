-- ===== Tela do NewLife no Roblox =====
-- Recria a interface da versão web (src/body.html, src/style.css e src/ui.js): tela inicial, nova vida,
-- diário por ano, atributos, barra de navegação com o bolo, telas em lista, pop-ups dos eventos e lápide.
-- Celular (em pé) e telas estreitas: igual à web. PC e telas largas: diário no meio, atributos e
-- navegação à esquerda e a tela aberta (Relações, Carreira…) fixa à direita.
-- Tudo roda no servidor; aqui só se mostra o estado e se pedem ações pelo NewLifeRemote.

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local StarterGui = game:GetService("StarterGui")
local GuiService = game:GetService("GuiService")
local SoundService = game:GetService("SoundService")
local TweenService = game:GetService("TweenService")

local player = Players.LocalPlayer
local remote = ReplicatedStorage:WaitForChild("NewLifeRemote")
local NewLife = ReplicatedStorage:WaitForChild("NewLife")
local Sons = require(NewLife:WaitForChild("Sons"))
local Looks = require(NewLife:WaitForChild("Looks"))
local Kit = require(script.Parent:WaitForChild("Kit"))
local Images = require(script.Parent:WaitForChild("Images"))

local new, text = Kit.new, Kit.text

pcall(function()
	StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false)
	StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.Health, false)
	StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, false)
end)

---------------------------------------------------------------------------
-- sons (os mesmos do jogo, gerados por roblox/tools/sons.cjs)
---------------------------------------------------------------------------
local prefs = { music = true, sfx = true, theme = "light" }
local fxSounds, music = {}, nil
if Sons.ids.efeitos ~= 0 then
	for name, r in Sons.efeitos do
		fxSounds[name] = new("Sound", { Name = "fx_" .. name, SoundId = "rbxassetid://" .. Sons.ids.efeitos, PlaybackRegionsEnabled = true, PlaybackRegion = NumberRange.new(r[1], r[1] + r[2]), Volume = 0.6, Parent = SoundService })
	end
end
if Sons.ids.musica ~= 0 then
	music = new("Sound", { Name = "musica", SoundId = "rbxassetid://" .. Sons.ids.musica, Looped = true, Volume = 0.3, Parent = SoundService })
end
local lastFx = {}
local function sfx(name: string, minGap: number?)
	local snd = fxSounds[name]
	if not snd or not prefs.sfx then
		return
	end
	local now = os.clock()
	if now - (lastFx[name] or 0) < (minGap or 0.12) then
		return
	end
	lastFx[name] = now
	snd:Play()
end
local function applyMusic()
	if not music then
		return
	end
	if prefs.music then
		if not music.IsPlaying then
			music:Play()
		end
	else
		music:Stop()
	end
end
Kit.onClick = function()
	sfx("click", 0.04)
end

---------------------------------------------------------------------------
-- palco: tudo em "px de CSS" dentro de um UIScale
---------------------------------------------------------------------------
local gui = new("ScreenGui", { Name = "NewLife", ResetOnSpawn = false, IgnoreGuiInset = true, ScreenInsets = Enum.ScreenInsets.None, ZIndexBehavior = Enum.ZIndexBehavior.Sibling, Parent = player:WaitForChild("PlayerGui") })
local bgFrame = new("Frame", { Name = "Fundo", BorderSizePixel = 0, Size = UDim2.fromScale(1, 1), Parent = gui })
local stage = new("Frame", { Name = "Palco", BackgroundTransparency = 1, Parent = gui })

local W, H, SCALE, WIDE, TOP = 390, 844, 1, false, 0
local state = nil
local screen = "splash" -- splash | home | form | game | death
local stack = {} -- telas abertas (folha no celular, painel da direita no PC)
local rightRoot = "relations"
local modalQueue = {}
local modalOpen = false
local formState = { gender = "", country = "", diff = "normal", first = "", last = "" }
local jumpDiary = false -- o diário rola até o ano mais recente no próximo desenho
local render

local function measure()
	local cam = workspace.CurrentCamera
	local vp = cam and cam.ViewportSize or Vector2.new(390, 844)
	WIDE = vp.X >= 1000 and vp.X / vp.Y > 1.15
	-- no Studio dá para ver o layout de celular com workspace:SetAttribute("NewLifeCelular", true)
	if workspace:GetAttribute("NewLifeCelular") then
		WIDE = false
	end
	SCALE = WIDE and math.clamp(vp.Y / 900, 1, 1.7) or 1
	W, H = vp.X / SCALE, vp.Y / SCALE
	TOP = GuiService:GetGuiInset().Y / SCALE
	stage.Size = UDim2.fromOffset(W, H)
end

local function clear(f: Instance)
	for _, ch in f:GetChildren() do
		ch:Destroy()
	end
end

local function faceOf(face, size, front)
	return Images.face(face, size, nil, front)
end

local function setZ(root: GuiObject, z: number)
	root.ZIndex = z
	for _, d in root:GetDescendants() do
		if d:IsA("GuiObject") then
			d.ZIndex = z
		end
	end
end

-- botão quadrado com ícone de traço (menu, voltar, fechar), como os SVG de src/body.html
local function iconBtn(svg: string, onDark: boolean, fn, size: number?)
	local b = Kit.iconButton("", onDark, fn)
	local ic = Images.icon(svg, size or 20, onDark and Color3.new(1, 1, 1) or Kit.C.ink, b)
	ic.AnchorPoint = Vector2.new(0.5, 0.5)
	ic.Position = UDim2.fromScale(0.5, 0.5)
	return b
end
local ICON_BACK = '<path d="M15 5l-7 7 7 7"/>'
local ICON_CLOSE = '<path d="M6 6l12 12M18 6L6 18"/>'

---------------------------------------------------------------------------
-- comunicação com o servidor
---------------------------------------------------------------------------
local function call(req)
	if Kit.busy then
		return
	end
	Kit.busy = true
	local ok, res = pcall(function()
		return remote:InvokeServer(req)
	end)
	Kit.busy = false
	if not ok or type(res) ~= "table" then
		return
	end
	state = res
	if req.op == "age" or req.op == "choose" or req.op == "act" or req.op == "new" then
		jumpDiary = true
	end
	if res.meta and res.meta.prefs then
		prefs = res.meta.prefs
		Kit.setTheme(prefs.theme)
		applyMusic()
	end
	for i, name in res.fx or {} do
		task.delay((i - 1) * 0.18, sfx, name, 0.3)
	end
	if res.msg then
		table.insert(modalQueue, { t = res.msg.t, x = res.msg.x })
	end
	-- telas da pilha que deixaram de existir (pessoa que morreu) saem
	while #stack > 0 and not (res.views and res.views[stack[#stack]]) do
		table.remove(stack)
	end
	render()
end

---------------------------------------------------------------------------
-- pop-ups (.modal): eventos, resultado das atividades, escolhas e confirmações
---------------------------------------------------------------------------
local overlay
local function closeModal()
	modalOpen = false
	if overlay then
		overlay:Destroy()
		overlay = nil
	end
end

local function modal(o)
	closeModal()
	modalOpen = true
	local C = Kit.C
	sfx("pop", 0.25)
	overlay = new("TextButton", { Name = "Modal", Text = "", AutoButtonColor = false, BackgroundColor3 = Color3.fromRGB(10, 14, 30), BackgroundTransparency = 0.5, BorderSizePixel = 0, Size = UDim2.fromScale(1, 1), ZIndex = 50, Parent = stage })
	local box = new("Frame", {
		AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.fromScale(0.5, 0.5), Size = UDim2.new(1, -32, 0, 0), AutomaticSize = Enum.AutomaticSize.Y,
		BackgroundColor3 = C.surface, BorderSizePixel = 0, ClipsDescendants = true, Parent = overlay,
	}, { Kit.corner(22), Kit.max(440, nil), Kit.vlist(0) })
	Kit.stripe(6, { LayoutOrder = 0, Parent = box })
	local body = new("ScrollingFrame", {
		LayoutOrder = 1, BackgroundTransparency = 1, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, CanvasSize = UDim2.new(),
		AutomaticCanvasSize = Enum.AutomaticSize.Y, ScrollBarThickness = 4, Parent = box,
	}, { Kit.pad(18, 18, 18, 18), Kit.vlist(8), Kit.max(nil, H * 0.8) })
	local order = 0
	local function add(inst)
		order += 1
		inst.LayoutOrder = order
		inst.Parent = body
		return inst
	end
	if o.emoji then
		add(new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 78) }, {
			new("TextLabel", { AnchorPoint = Vector2.new(0.5, 0), Position = UDim2.fromScale(0.5, 0), Size = UDim2.fromOffset(72, 72), BackgroundColor3 = C.surface2, Text = o.emoji, TextSize = 40, FontFace = Kit.F.body, TextColor3 = C.ink }, { Kit.corner(22) }),
		}))
	end
	if o.k then
		add(new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 22) }, {
			new("TextLabel", { BackgroundColor3 = C.surface2, Size = UDim2.fromOffset(0, 22), AutomaticSize = Enum.AutomaticSize.X, Text = string.upper(o.k), FontFace = Kit.F.heavy, TextSize = 11, TextColor3 = C.dark and C.link or C.brand }, { Kit.corner(UDim.new(1, 0)), Kit.pad(0, 10) }),
		}))
	end
	if o.t and o.t ~= "" then
		add(text(o.t, { FontFace = Kit.F.display, TextSize = 22 }))
	end
	if o.x and o.x ~= "" then
		add(text(o.x, { TextSize = 15, LineHeight = 1.3 }))
	end
	local wrap = add(new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y }, { Kit.vlist(8), Kit.pad(6, 0, 0, 0) }))
	for i, c in o.ch or { { l = "OK" } } do
		Kit.button(c.l, c.cls or (i > 1 and "alt" or nil), function()
			closeModal()
			if c.fn then
				c.fn()
			end
			render()
		end, { LayoutOrder = i, Parent = wrap })
	end
	setZ(box, 51)
end

local function confirmBox(t, x, yes, fn)
	modal({ t = t, x = x, ch = { { l = yes, cls = "danger", fn = fn }, { l = "Cancelar", cls = "alt" } } })
end

-- próximo pop-up pendente: primeiro o resultado da atividade, depois os eventos do ano
local function pump()
	if modalOpen then
		return
	end
	local m = table.remove(modalQueue, 1)
	if m then
		modal(m)
		return
	end
	local ev = state and state.event
	if ev then
		local ch = {}
		for i, l in ev.choices do
			table.insert(ch, { l = l, cls = i > 1 and "alt" or nil, fn = function()
				call({ op = "choose", i = i })
			end })
		end
		modal({ k = ev.k, emoji = ev.emoji, t = ev.title, x = ev.text, ch = ch })
	end
end

local HELP = "Toque no bolo para envelhecer um ano. Cada ano traz eventos aleatórios e escolhas.\n\nCarreira: escola, faculdade e empregos.\nBens: dinheiro e moradia.\nRelações: família, amigos e amores.\nAtividades: academia, biblioteca, amizades, namoro e adoção."

---------------------------------------------------------------------------
-- telas em lista (V.* da web): cada item vira seção, cartão ou linha
---------------------------------------------------------------------------
local function onItem(it)
	if it.push then
		table.insert(stack, it.push)
		render()
		return
	end
	local function go()
		if it.act then
			call({ op = "act", id = it.act.id, arg = it.act.arg })
		elseif it.op == "giveup" then
			stack = {}
			call({ op = "giveup" })
		elseif it.op == "home" then
			stack = {}
			screen = "home"
			render()
		elseif it.op == "music" then
			call({ op = "prefs", music = not prefs.music })
		elseif it.op == "sfx" then
			call({ op = "prefs", sfx = not prefs.sfx })
		elseif it.op == "theme" then
			call({ op = "prefs", theme = prefs.theme == "dark" and "light" or "dark" })
		elseif it.op == "help" then
			modal({ t = "Como jogar", x = HELP })
		end
	end
	if it.confirm then
		confirmBox(it.confirm.t, it.confirm.x, it.confirm.yes, go)
	else
		go()
	end
end

local function buildItems(parent: Instance, items)
	local C = Kit.C
	for i, it in items do
		local inst
		if it.sec then
			inst = Kit.sec(it.sec)
		elseif it.card or it.hero then
			local kids = {}
			if it.hero then
				local hero = new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y }, { Kit.hlist(14), Kit.pad(0, 0, 8, 0) })
				local f = faceOf(it.hero.face, 96, true)
				f.LayoutOrder = 1
				f.Parent = hero
				local tx = new("Frame", { LayoutOrder = 2, BackgroundTransparency = 1, Size = UDim2.new(0, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = hero }, { Kit.vlist(2), Kit.grow() })
				text(it.hero.title, { FontFace = Kit.F.heavy, TextSize = 16, LayoutOrder = 1, Parent = tx })
				text(it.hero.sub or "", { TextSize = 14, TextColor3 = C.muted, LayoutOrder = 2, Parent = tx })
				table.insert(kids, hero)
			end
			local rows = it.card or {}
			for k, row in rows do
				if row.bar then
					table.insert(kids, Kit.miniBar(row.bar, row.v or 0))
				elseif row.p then
					table.insert(kids, text(row.p, { TextSize = 15 }))
				else
					table.insert(kids, Kit.kv(row[1], row[2], k == #rows))
				end
			end
			inst = Kit.card(kids)
		else
			inst = Kit.row(it, function()
				onItem(it)
			end, function(face, size)
				return faceOf(face, size)
			end)
		end
		inst.LayoutOrder = i
		inst.Parent = parent
	end
end

-- cabeçalho de tela (.sheet-head): voltar, título, fechar e a faixa colorida
local function sheetHead(parent: Instance, title: string, canBack: boolean, onBack, onClose)
	local head = new("Frame", { Name = "Head", BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 58), Parent = parent }, { Kit.pad(8, 14, 12, 14) })
	local row = new("Frame", { BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), Parent = head }, { Kit.hlist(8) })
	if canBack then
		local b = iconBtn(ICON_BACK, false, onBack, 18)
		b.LayoutOrder = 1
		b.Parent = row
	end
	local t = text(title, { FontFace = Kit.F.display, TextSize = 20, LayoutOrder = 2, Size = UDim2.new(0, 0, 0, 38), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, TextTruncate = Enum.TextTruncate.AtEnd, Parent = row })
	Kit.grow().Parent = t
	if onClose then
		local b = iconBtn(ICON_CLOSE, false, onClose, 18)
		b.LayoutOrder = 3
		b.Parent = row
	end
	Kit.stripe(3, { Position = UDim2.new(0, 0, 1, -2), BackgroundTransparency = 0.15, Parent = head })
	return head
end

local function viewBody(parent: Instance, key: string, topOffset: number)
	local C = Kit.C
	local v = state and state.views and state.views[key]
	local scroll = new("ScrollingFrame", {
		Name = "Body:" .. key, BackgroundTransparency = 1, BorderSizePixel = 0, Position = UDim2.fromOffset(0, topOffset), Size = UDim2.new(1, 0, 1, -topOffset),
		CanvasSize = UDim2.new(), AutomaticCanvasSize = Enum.AutomaticSize.Y, ScrollBarThickness = 4, ScrollBarImageColor3 = C.muted, Parent = parent,
	}, { Kit.pad(12, 14, 22, 14), Kit.vlist(9) })
	if v then
		buildItems(scroll, v.items)
	end
	return scroll
end

-- tela aberta por baixo (celular): .sheet sobe do rodapé
local function bottomSheet()
	local C = Kit.C
	local key = stack[#stack]
	local v = state and state.views and state.views[key]
	if not v then
		return
	end
	local ov = new("TextButton", { Name = "Folha", Text = "", AutoButtonColor = false, BackgroundColor3 = Color3.fromRGB(10, 14, 30), BackgroundTransparency = 0.5, BorderSizePixel = 0, Size = UDim2.fromScale(1, 1), ZIndex = 30, Parent = stage })
	Kit.press(ov, function()
		stack = {}
		render()
	end)
	local sh = new("TextButton", {
		Text = "", AutoButtonColor = false, AnchorPoint = Vector2.new(0.5, 1), Position = UDim2.new(0.5, 0, 1, 0), Size = UDim2.new(0, math.min(560, W), 0.88, 0),
		BackgroundColor3 = C.bg, BorderSizePixel = 0, Parent = ov,
	}, { Kit.corner(24) })
	new("Frame", { BackgroundColor3 = C.bg, BorderSizePixel = 0, Position = UDim2.new(0, 0, 1, -24), Size = UDim2.new(1, 0, 0, 24), Parent = sh })
	new("Frame", { AnchorPoint = Vector2.new(0.5, 0), Position = UDim2.new(0.5, 0, 0, 8), Size = UDim2.fromOffset(42, 5), BackgroundColor3 = C.line, BorderSizePixel = 0, Parent = sh }, { Kit.corner(UDim.new(1, 0)) })
	local inner = new("Frame", { BackgroundTransparency = 1, Position = UDim2.fromOffset(0, 13), Size = UDim2.new(1, 0, 1, -13), Parent = sh })
	sheetHead(inner, v.title, #stack > 1, function()
		table.remove(stack)
		render()
	end, function()
		stack = {}
		render()
	end)
	viewBody(inner, key, 58)
	setZ(sh, 31)
end

---------------------------------------------------------------------------
-- tela principal: cabeçalho, diário, atributos e navegação
---------------------------------------------------------------------------
local function phase(age)
	return age < 13 and 1 or age < 18 and 2 or age < 40 and 3 or age < 65 and 4 or 5
end

local function header(parent: Instance, w: number, padX: number)
	local C = Kit.C
	local me = state.me
	local h = TOP + 70
	local hdr = new("Frame", { Name = "Topo", BorderSizePixel = 0, BackgroundColor3 = Color3.new(1, 1, 1), Size = UDim2.fromOffset(w, h + 5), Parent = parent }, {
		Kit.grad(C.brandGrad, 135),
	})
	Kit.stripe(5, { Position = UDim2.new(0, 0, 1, -5), Parent = hdr })
	local row = new("Frame", { BackgroundTransparency = 1, Position = UDim2.fromOffset(padX, TOP + 12), Size = UDim2.new(1, -padX * 2, 0, 50), Parent = hdr }, { Kit.hlist(12) })
	local menu = iconBtn('<path d="M4 7h16M4 12h16M4 17h16"/>', true, function()
		if WIDE then
			rightRoot = "menu"
			stack = {}
		else
			stack = { "menu" }
		end
		render()
	end)
	menu.LayoutOrder = 1
	menu.Parent = row
	local av = new("TextButton", { Text = "", LayoutOrder = 2, BackgroundTransparency = 1, Size = UDim2.fromOffset(46, 46), Parent = row }, {
		new("UIStroke", { Color = Color3.new(1, 1, 1), Thickness = 3, Transparency = 0.45, ApplyStrokeMode = Enum.ApplyStrokeMode.Border }), Kit.corner(UDim.new(1, 0)),
	})
	faceOf(me.face, 46, true).Parent = av
	Kit.press(av, function()
		if WIDE then
			rightRoot = "relations"
			stack = { "me" }
		else
			stack = { "relations", "me" }
		end
		render()
	end)
	local who = new("Frame", { LayoutOrder = 3, BackgroundTransparency = 1, Size = UDim2.new(0, 0, 0, 46), Parent = row }, { Kit.grow() })
	text(me.name, { FontFace = Kit.F.display, TextSize = 20, TextColor3 = Color3.new(1, 1, 1), Size = UDim2.new(1, 0, 0, 24), AutomaticSize = Enum.AutomaticSize.None, TextTruncate = Enum.TextTruncate.AtEnd, Parent = who })
	local sub = new("Frame", { BackgroundTransparency = 1, Position = UDim2.fromOffset(0, 26), Size = UDim2.new(1, 0, 0, 18), Parent = who }, { Kit.hlist(5) })
	Images.flag(me.cid, 16, sub).LayoutOrder = 1
	text(me.sub, { LayoutOrder = 2, TextSize = 12.5, TextColor3 = Color3.new(1, 1, 1), TextTransparency = 0.22, Size = UDim2.new(1, -22, 1, 0), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, TextTruncate = Enum.TextTruncate.AtEnd, Parent = sub })
	local cash = new("Frame", { LayoutOrder = 4, BackgroundTransparency = 1, Size = UDim2.fromOffset(120, 46), Parent = row })
	new("TextLabel", {
		AnchorPoint = Vector2.new(1, 0), Position = UDim2.new(1, 0, 0, 2), Size = UDim2.fromOffset(0, 26), AutomaticSize = Enum.AutomaticSize.X, Text = me.money,
		FontFace = Kit.F.display, TextSize = 19, TextColor3 = Color3.new(1, 1, 1), BackgroundColor3 = C.bad, BackgroundTransparency = me.neg and 0 or 1, Parent = cash,
	}, { Kit.corner(8), Kit.pad(0, me.neg and 7 or 0) })
	text("SALDO", { AnchorPoint = Vector2.new(1, 0), Position = UDim2.new(1, 0, 0, 29), Size = UDim2.fromOffset(120, 14), AutomaticSize = Enum.AutomaticSize.None, TextXAlignment = Enum.TextXAlignment.Right, TextSize = 11, TextColor3 = Color3.new(1, 1, 1), TextTransparency = 0.3, FontFace = Kit.F.bold, Parent = cash })
	setZ(hdr, 3)
	return hdr, h + 5
end

local function diary(parent: Instance, pos: UDim2, size: UDim2, maxW: number?)
	local C = Kit.C
	local log = state.log or {}
	local scroll = new("ScrollingFrame", {
		Name = "Diario", BackgroundTransparency = 1, BorderSizePixel = 0, Position = pos, Size = size, CanvasSize = UDim2.new(),
		AutomaticCanvasSize = Enum.AutomaticSize.Y, ScrollBarThickness = 5, ScrollBarImageColor3 = C.muted, Parent = parent,
	}, { Kit.pad(14, 14, 22, 14), Kit.vlist(14, Enum.HorizontalAlignment.Center) })
	for i, y in log do
		local card = new("Frame", { LayoutOrder = i, BackgroundColor3 = C.surface, BorderSizePixel = 0, ClipsDescendants = true, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = scroll }, {
			Kit.corner(16), Kit.vlist(0),
		})
		if maxW then
			Kit.max(maxW, nil).Parent = card
		end
		if i == #log then
			new("UIStroke", { Color = C.dark and C.link or C.brand, Transparency = 0.78, Thickness = 2, ApplyStrokeMode = Enum.ApplyStrokeMode.Border, Parent = card })
		elseif C.dark then
			Kit.stroke(C.line).Parent = card
		end
		local head = new("Frame", { LayoutOrder = 0, BackgroundColor3 = C.ph[phase(y.age)], BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 30), Parent = card }, { Kit.pad(0, 16) })
		text(y.age == 0 and "Nascimento" or (y.age .. (y.age == 1 and " ano" or " anos")), { FontFace = Kit.F.display, TextSize = 13.5, TextColor3 = Color3.new(1, 1, 1), Size = UDim2.fromScale(0.6, 1), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, Parent = head })
		text(tostring(y.year), { FontFace = Kit.F.display, TextSize = 13.5, TextColor3 = Color3.new(1, 1, 1), Size = UDim2.fromScale(0.4, 1), Position = UDim2.fromScale(0.6, 0), AutomaticSize = Enum.AutomaticSize.None, TextXAlignment = Enum.TextXAlignment.Right, TextYAlignment = Enum.TextYAlignment.Center, Parent = head })
		local body = new("Frame", { LayoutOrder = 1, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = card }, { Kit.pad(8, 16, 10, 16), Kit.vlist(5) })
		if #y.lines == 0 then
			text("Um ano tranquilo.", { TextColor3 = C.muted, Parent = body })
		end
		for j, l in y.lines do
			local color = l.c == "good" and C.good or l.c == "bad" and C.bad or l.c == "warn" and C.warn or l.c == "choice" and C.muted or C.ink
			text(l.t, { LayoutOrder = j, TextSize = 15, LineHeight = 1.25, TextColor3 = color, FontFace = l.c == "big" and Kit.F.bold or Kit.F.body, Parent = body })
		end
	end
	return scroll
end

local STAT_ROWS = { { "😊", "Felicidade", "happy" }, { "❤️", "Saúde", "health" }, { "🧠", "Inteligência", "smarts" }, { "✨", "Aparência", "looks" } }
local function statRow(e, label, v, parent, order)
	local C = Kit.C
	local r = new("Frame", { LayoutOrder = order, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 22), Parent = parent })
	text(e, { TextSize = 15, Size = UDim2.fromOffset(20, 22), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, Parent = r })
	text(label, { FontFace = Kit.F.bold, TextSize = 12.5, Position = UDim2.fromOffset(26, 0), Size = UDim2.fromOffset(84, 22), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, Parent = r })
	local bar = Kit.bar(v, 11)
	bar.AnchorPoint = Vector2.new(0, 0.5)
	bar.Position = UDim2.new(0, 116, 0.5, 0)
	bar.Size = UDim2.new(1, -116 - 42, 0, 11)
	bar.Parent = r
	text(v .. "%", { TextSize = 12, TextColor3 = C.muted, TextXAlignment = Enum.TextXAlignment.Right, Position = UDim2.new(1, -36, 0, 0), Size = UDim2.fromOffset(36, 22), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, Parent = r })
end

local NAV = {
	{ "career", "Carreira", '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>' },
	{ "assets", "Bens", '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>' },
	{ "age" },
	{ "relations", "Relações", '<path d="M12 20s-7-4.4-9-9a4.6 4.6 0 0 1 9-2 4.6 4.6 0 0 1 9 2c-2 4.6-9 9-9 9z"/>' },
	{ "activities", "Atividades", '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/>' },
}
local MENU_ICON = '<path d="M4 7h16M4 12h16M4 17h16"/>'

local function ageUp()
	if not state or not state.me or not state.me.alive or state.event or modalOpen then
		return
	end
	if not WIDE then
		stack = {}
	end
	jumpDiary = true
	call({ op = "age" })
end

-- botão do bolo (.age .plus): círculo amarelo com borda da cor da barra e brilho pulsando
local function cakeButton(size: number, ring: number)
	local C = Kit.C
	local b = new("TextButton", { Text = "", AutoButtonColor = false, BackgroundColor3 = C.surface, Size = UDim2.fromOffset(size + ring * 2, size + ring * 2) }, { Kit.corner(UDim.new(1, 0)) })
	local glow = new("Frame", { Name = "Glow", AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.fromScale(0.5, 0.5), Size = UDim2.fromOffset(size, size), BackgroundColor3 = Color3.fromHex("#FFC83D"), BackgroundTransparency = 0.45, Parent = b }, { Kit.corner(UDim.new(1, 0)) })
	-- o degradê fica no disco e o bolo num rótulo por cima (o UIGradient pintaria o emoji)
	local disc = new("Frame", { Name = "Disc", AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.fromScale(0.5, 0.5), Size = UDim2.fromOffset(size, size), BackgroundColor3 = Color3.new(1, 1, 1), Parent = b }, {
		Kit.corner(UDim.new(1, 0)), Kit.grad(Kit.SUN, 145),
	})
	new("TextLabel", { Name = "Disc", BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), Text = "🎂", TextSize = math.floor(size * 0.47), FontFace = Kit.F.body, TextColor3 = C.sunInk, Parent = disc })
	TweenService:Create(glow, TweenInfo.new(2.6, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, -1), { Size = UDim2.fromOffset(size + 28, size + 28), BackgroundTransparency = 1 }):Play()
	Kit.press(b, ageUp)
	return b
end

local function navBar(parent: Instance, y: number)
	local C = Kit.C
	local nav = new("Frame", { Name = "Nav", BackgroundColor3 = C.surface, BorderSizePixel = 0, Position = UDim2.fromOffset(0, y), Size = UDim2.new(1, 0, 0, 66), Parent = parent })
	new("Frame", { BackgroundColor3 = C.line, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 1), Parent = nav })
	for i, n in NAV do
		local cell = new("Frame", { BackgroundTransparency = 1, Position = UDim2.new((i - 1) / 5, 0, 0, 0), Size = UDim2.new(0.2, 0, 1, 0), Parent = nav })
		if n[1] == "age" then
			local b = cakeButton(56, 5)
			b.AnchorPoint = Vector2.new(0.5, 0)
			b.Position = UDim2.new(0.5, 0, 0, -34)
			b.Parent = cell
			text("Envelhecer", { FontFace = Kit.F.heavy, TextSize = 11.5, TextColor3 = C.ink, TextXAlignment = Enum.TextXAlignment.Center, Position = UDim2.new(0, 0, 1, -24), Size = UDim2.new(1, 0, 0, 16), AutomaticSize = Enum.AutomaticSize.None, Parent = cell })
		else
			local b = new("TextButton", { Text = "", AutoButtonColor = false, BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), Parent = cell })
			local col = stack[1] == n[1] and C.ink or C.muted
			local ic = Images.icon(n[3], 24, col, b)
			ic.AnchorPoint = Vector2.new(0.5, 0)
			ic.Position = UDim2.new(0.5, 0, 0, 12)
			text(n[2], { FontFace = Kit.F.bold, TextSize = 11.5, TextColor3 = col, TextXAlignment = Enum.TextXAlignment.Center, Position = UDim2.new(0, 0, 0, 39), Size = UDim2.new(1, 0, 0, 16), AutomaticSize = Enum.AutomaticSize.None, Parent = b })
			Kit.press(b, function()
				stack = { n[1] }
				render()
			end)
		end
	end
	setZ(nav, 7)
	for _, d in nav:GetDescendants() do
		if d.Name == "Glow" then
			d.ZIndex = 6
		elseif d.Name == "Disc" then
			d.ZIndex = 8
		end
	end
	return nav
end

local function statsPanel(parent: Instance, y: number)
	local me = state.me
	local C = Kit.C
	local panel = new("Frame", { Name = "Atributos", BackgroundColor3 = C.surface, BorderSizePixel = 0, Position = UDim2.fromOffset(0, y), Size = UDim2.new(1, 0, 0, 84), Parent = parent }, { Kit.corner(18) })
	new("Frame", { BackgroundColor3 = C.surface, BorderSizePixel = 0, Position = UDim2.new(0, 0, 1, -18), Size = UDim2.new(1, 0, 0, 18), Parent = panel })
	Kit.stripe(3, { Position = UDim2.fromOffset(18, 0), Size = UDim2.new(1, -36, 0, 3), BackgroundTransparency = 0.1, Parent = panel })
	local grid = new("Frame", { BackgroundTransparency = 1, Position = UDim2.fromOffset(18, 14), Size = UDim2.new(1, -36, 1, -22), Parent = panel }, {
		new("UIGridLayout", { CellSize = UDim2.new(0.5, -10, 0, 24), CellPadding = UDim2.fromOffset(20, 4), SortOrder = Enum.SortOrder.LayoutOrder }),
	})
	for i, s in STAT_ROWS do
		statRow(s[1], s[2], me.stats[s[3]] or 0, grid, i)
	end
	setZ(panel, 5)
	return panel
end

local function gameMobile()
	local C = Kit.C
	local appW = math.min(560, W)
	local app = new("Frame", { Name = "App", BackgroundColor3 = C.bg, BorderSizePixel = 0, Position = UDim2.fromOffset((W - appW) / 2, 0), Size = UDim2.fromOffset(appW, H), Parent = stage })
	local _, hh = header(app, appW, 16)
	local navH, statsH = 66, 84
	diary(app, UDim2.fromOffset(0, hh), UDim2.new(1, 0, 1, -hh - navH - statsH + 6))
	statsPanel(app, H - navH - statsH)
	navBar(app, H - navH)
	if #stack > 0 then
		bottomSheet()
	end
end

-- PC: atributos e navegação à esquerda, diário no meio, tela aberta fixa à direita
local function gameWide()
	local C = Kit.C
	local _, hh = header(stage, W, 28)
	local leftW, rightW = 320, 430
	local bodyH = H - hh
	-- a coluna rola em telas baixas
	local left = new("ScrollingFrame", {
		Name = "Esquerda", BackgroundTransparency = 1, BorderSizePixel = 0, Position = UDim2.fromOffset(20, hh), Size = UDim2.fromOffset(leftW, bodyH), CanvasSize = UDim2.new(),
		AutomaticCanvasSize = Enum.AutomaticSize.Y, ScrollBarThickness = 0, Parent = stage,
	}, { Kit.vlist(14, Enum.HorizontalAlignment.Center), Kit.pad(18, 0, 18, 0) })
	local statsCard = new("Frame", { LayoutOrder = 1, BackgroundColor3 = C.surface, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, ClipsDescendants = true, Parent = left }, { Kit.corner(18), Kit.pad(16, 18, 14, 18), Kit.vlist(8) })
	text("Atributos", { LayoutOrder = 0, FontFace = Kit.F.display, TextSize = 16, Parent = statsCard })
	for i, s in STAT_ROWS do
		statRow(s[1], s[2], state.me.stats[s[3]] or 0, statsCard, i)
	end
	Kit.stripe(3, { LayoutOrder = -1, Parent = statsCard })
	local ageWrap = new("Frame", { LayoutOrder = 2, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 122), Parent = left })
	local cake = cakeButton(76, 6)
	cake.AnchorPoint = Vector2.new(0.5, 0)
	cake.Position = UDim2.new(0.5, 0, 0, 6)
	cake.Parent = ageWrap
	for _, d in cake:GetDescendants() do
		if d.Name == "Disc" then
			d.ZIndex = 3
		end
	end
	text("Envelhecer", { FontFace = Kit.F.heavy, TextSize = 14, TextXAlignment = Enum.TextXAlignment.Center, Position = UDim2.new(0, 0, 0, 100), Size = UDim2.new(1, 0, 0, 18), AutomaticSize = Enum.AutomaticSize.None, Parent = ageWrap })
	local navList = new("Frame", { LayoutOrder = 3, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = left }, { Kit.vlist(8) })
	for order, n in { NAV[1], NAV[2], NAV[4], NAV[5], { "menu", "Menu", MENU_ICON } } do
		local on = rightRoot == n[1]
		local accent = C.dark and C.link or C.brand
		local b = new("TextButton", { LayoutOrder = order, Text = "", AutoButtonColor = false, BackgroundColor3 = on and C.surface or C.bg, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 50), Parent = navList }, {
			Kit.corner(14), Kit.pad(0, 16), Kit.hlist(14),
		})
		if on then
			Kit.stroke(accent, 2, 0.6).Parent = b
		end
		Images.icon(n[3], 24, on and accent or C.muted, b).LayoutOrder = 1
		text(n[2], { LayoutOrder = 2, FontFace = Kit.F.heavy, TextSize = 15, TextColor3 = on and C.ink or C.muted, Size = UDim2.new(0, 200, 1, 0), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, Parent = b })
		Kit.press(b, function()
			rightRoot = n[1]
			stack = {}
			render()
		end)
	end
	local midX = 20 + leftW + 20
	local midW = W - midX - rightW - 40
	diary(stage, UDim2.fromOffset(midX, hh), UDim2.fromOffset(midW, bodyH), 720)
	local key = #stack > 0 and stack[#stack] or rightRoot
	local v = state.views and state.views[key]
	local panel = new("Frame", { Name = "Direita", BackgroundColor3 = C.bg, BorderSizePixel = 0, Position = UDim2.fromOffset(W - rightW - 20, hh + 18), Size = UDim2.fromOffset(rightW, bodyH - 36), ClipsDescendants = true, Parent = stage }, {
		Kit.corner(20), Kit.stroke(C.line),
	})
	if v then
		sheetHead(panel, v.title, #stack > 0, function()
			table.remove(stack)
			render()
		end, nil)
		viewBody(panel, key, 58)
	end
end

---------------------------------------------------------------------------
-- tela inicial (#start), nova vida e lápide
---------------------------------------------------------------------------
local sampleFaces = nil
local function heroFaces()
	if sampleFaces then
		return sampleFaces
	end
	sampleFaces = {}
	local cs = { "BR", "AO", "JP", "US", "IN", "PT" }
	for i = 1, 6 do
		local gd = i % 2 == 0 and "F" or "M"
		local p = { id = 100 + i, gender = gd, age = ({ 9, 27, 16, 42, 70, 33 })[i], alive = true }
		p.genes = Looks.randGenes(gd, cs[i])
		Looks.ensure(p)
		table.insert(sampleFaces, Looks.face(p, 85, false))
	end
	return sampleFaces
end

-- tela cheia rolável com coluna central (.full / .full-in)
local function fullScreen(topPad: number)
	local C = Kit.C
	local cw = math.min(520, W)
	local sc = new("ScrollingFrame", {
		Name = "Inicio", BackgroundColor3 = C.bg, BorderSizePixel = 0, Size = UDim2.fromScale(1, 1), CanvasSize = UDim2.new(), AutomaticCanvasSize = Enum.AutomaticSize.Y,
		ScrollBarThickness = 4, Parent = stage,
	}, { Kit.vlist(0, Enum.HorizontalAlignment.Center) })
	local col = new("Frame", { LayoutOrder = 1, BackgroundTransparency = 1, Size = UDim2.fromOffset(cw, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = sc }, { Kit.vlist(14, Enum.HorizontalAlignment.Center), Kit.pad(topPad, 16, 40, 16) })
	return sc, col, cw
end

local function heroBlock(parent: Instance, w: number)
	local C = Kit.C
	local h = TOP + 212
	-- só os cantos de baixo são arredondados: o fundo sobe 40 px para fora e o recorte esconde os de cima
	local f = new("Frame", { LayoutOrder = 0, BackgroundTransparency = 1, Size = UDim2.fromOffset(w, h), ClipsDescendants = true, Parent = parent })
	local bgc = new("Frame", { BorderSizePixel = 0, BackgroundColor3 = Color3.new(1, 1, 1), Position = UDim2.fromOffset(0, -40), Size = UDim2.new(1, 0, 1, 40), ClipsDescendants = true, Parent = f }, {
		Kit.grad(C.brandGrad, 135), Kit.corner(32),
	})
	Kit.stripe(5, { Position = UDim2.new(0, 0, 1, -5), Parent = bgc })
	local faces = new("Frame", { BackgroundTransparency = 1, AnchorPoint = Vector2.new(0.5, 0), Position = UDim2.new(0.5, 0, 0, TOP + 26), Size = UDim2.fromOffset(5 * 44 + 58, 72), Parent = f })
	local ys, rot = { 6, 0, -4, -4, 0, 6 }, { -8, -4, -2, 2, 4, 8 }
	for i, fd in heroFaces() do
		local z = (i == 3 or i == 4) and 4 or 3
		local ring = new("Frame", {
			Position = UDim2.fromOffset((i - 1) * 44, 6 + ys[i]), Size = UDim2.fromOffset(58, 58), BackgroundColor3 = Color3.new(1, 1, 1), Rotation = rot[i], Parent = faces,
		}, { Kit.corner(UDim.new(1, 0)), new("UIStroke", { Color = Color3.new(1, 1, 1), Thickness = 4, Transparency = 0.1 }) })
		faceOf(fd, 58, true).Parent = ring
		setZ(ring, z)
	end
	new("TextLabel", {
		BackgroundTransparency = 1, AnchorPoint = Vector2.new(0.5, 0), Position = UDim2.new(0.5, 0, 0, TOP + 100), Size = UDim2.new(1, 0, 0, 60), RichText = true,
		Text = 'New<font color="#FFD23F">Life</font>', FontFace = Kit.F.display, TextSize = 54, TextColor3 = Color3.new(1, 1, 1), Parent = f,
	})
	text("Cada vida, uma nova história.", { AnchorPoint = Vector2.new(0.5, 0), Position = UDim2.new(0.5, 0, 0, TOP + 164), TextSize = 15, TextColor3 = Color3.new(1, 1, 1), TextTransparency = 0.12, TextXAlignment = Enum.TextXAlignment.Center, Parent = f })
	return f
end

local function homeAction(parent, order, icon, title, sub, primary, disabled, fn)
	local C = Kit.C
	local b = new("TextButton", {
		LayoutOrder = order, Text = "", AutoButtonColor = false, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 86),
		BackgroundColor3 = primary and C.surface:Lerp(C.btn, 0.05) or C.surface, Parent = parent,
	}, { Kit.corner(18), Kit.pad(0, 15), Kit.hlist(13) })
	Kit.stroke(primary and C.link or C.line, primary and 2 or 1).Parent = b
	new("TextLabel", { LayoutOrder = 1, Size = UDim2.fromOffset(46, 46), Text = icon, TextSize = 24, FontFace = Kit.F.body, TextColor3 = C.ink, BackgroundColor3 = primary and C.surface:Lerp(C.btn, 0.12) or C.surface2, Parent = b }, { Kit.corner(14) })
	local tx = new("Frame", { LayoutOrder = 2, BackgroundTransparency = 1, Size = UDim2.new(0, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = b }, { Kit.vlist(4), Kit.grow() })
	text(title, { FontFace = Kit.F.heavy, TextSize = 18, LayoutOrder = 1, Parent = tx })
	text(sub, { TextSize = 12, TextColor3 = C.muted, LayoutOrder = 2, Parent = tx })
	text("›", { LayoutOrder = 3, FontFace = Kit.F.heavy, TextSize = 18, TextColor3 = C.muted, Size = UDim2.fromOffset(8, 20), AutomaticSize = Enum.AutomaticSize.None, Parent = b })
	if disabled then
		b.BackgroundTransparency = 0.45
		for _, d in b:GetDescendants() do
			if d:IsA("TextLabel") then
				d.TextTransparency = 0.45
			end
		end
	else
		Kit.press(b, fn)
	end
	return b
end

local function homeScreen()
	local C = Kit.C
	local sc, col, cw = fullScreen(0)
	heroBlock(sc, cw)
	local intro = new("Frame", { LayoutOrder = 2, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = col }, { Kit.vlist(6), Kit.pad(18, 4, 4, 4) })
	text("Sua próxima história começa aqui", { FontFace = Kit.F.display, TextSize = 22, LayoutOrder = 1, Parent = intro })
	text("Comece do zero ou volte para a vida que você salvou.", { TextSize = 14, TextColor3 = C.muted, LayoutOrder = 2, Parent = intro })
	local acts = new("Frame", { LayoutOrder = 3, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = col }, { Kit.vlist(12), Kit.pad(14, 0, 0, 0) })
	homeAction(acts, 1, "🌱", "Nova vida", "Escolha seu personagem ou deixe a sorte decidir", true, false, function()
		screen = "form"
		render()
	end)
	local has = state and state.me and state.me.alive
	homeAction(acts, 2, "▶️", "Continuar", has and (state.me.name .. " · " .. state.me.age .. (state.me.age == 1 and " ano" or " anos")) or "Nenhuma vida salva ainda", false, not has, function()
		screen = "game"
		stack = {}
		render()
	end)
	homeAction(acts, 3, "📰", "Novidades", "Atualizações e histórico de todas as versões", false, false, function()
		local it = {}
		for _, c in (state and state.changelog) or {} do
			table.insert(it, { sec = "v" .. c.v .. " · " .. c.d })
			local rows = { { p = c.t } }
			for _, x in c.itens do
				table.insert(rows, { p = "• " .. x })
			end
			table.insert(it, { card = rows })
		end
		state = state or {}
		state.views = state.views or {}
		state.views.news = { title = "Novidades", items = it }
		stack = { "news" }
		render()
	end)
	text("NewLife · v" .. ((state and state.version) or ""), { LayoutOrder = 9, TextSize = 12, TextColor3 = C.muted, TextXAlignment = Enum.TextXAlignment.Center, Parent = col })
	if stack[1] == "news" then
		bottomSheet()
	end
end

local COUNTRY_OPTS = { { "", "Aleatório" }, { "BR", "Brasil" }, { "PT", "Portugal" }, { "US", "Estados Unidos" }, { "AR", "Argentina" }, { "MX", "México" }, { "JP", "Japão" }, { "IT", "Itália" }, { "FR", "França" }, { "DE", "Alemanha" }, { "GB", "Reino Unido" }, { "AO", "Angola" }, { "CA", "Canadá" }, { "ES", "Espanha" }, { "KR", "Coreia do Sul" }, { "IN", "Índia" } }
local GENDER_OPTS = { { "", "Aleatório" }, { "F", "Feminino" }, { "M", "Masculino" } }
local DIFF_OPTS = { { "facil", "Fácil" }, { "normal", "Normal" }, { "dificil", "Difícil" } }

-- campo de escolha (select.in): abre a lista de opções num pop-up
local function selectField(parent, order, label, opts, key)
	local C = Kit.C
	local f = new("Frame", { LayoutOrder = order, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = parent }, { Kit.vlist(6) })
	text(label, { FontFace = Kit.F.bold, TextSize = 13, TextColor3 = C.muted, LayoutOrder = 1, Parent = f })
	local cur = opts[1][2]
	for _, o in opts do
		if o[1] == formState[key] then
			cur = o[2]
		end
	end
	local b = new("TextButton", { LayoutOrder = 2, Text = "", AutoButtonColor = false, BackgroundColor3 = C.surface, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 44), Parent = f }, { Kit.corner(10), Kit.stroke(C.line), Kit.pad(0, 12) })
	text(cur, { FontFace = Kit.F.bold, TextSize = 15, Size = UDim2.new(1, -20, 1, 0), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, Parent = b })
	local chev = Images.icon('<path d="M6 9l6 6 6-6"/>', 18, C.muted, b)
	chev.AnchorPoint = Vector2.new(1, 0.5)
	chev.Position = UDim2.new(1, 0, 0.5, 0)
	Kit.press(b, function()
		local ch = {}
		for _, o in opts do
			table.insert(ch, { l = o[2], cls = o[1] ~= formState[key] and "alt" or nil, fn = function()
				formState[key] = o[1]
			end })
		end
		modal({ t = label, ch = ch })
	end)
	return f
end

local function inputField(parent, order, label, key)
	local C = Kit.C
	local f = new("Frame", { LayoutOrder = order, BackgroundTransparency = 1, Size = UDim2.new(0.5, -6, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = parent }, { Kit.vlist(6) })
	text(label, { FontFace = Kit.F.bold, TextSize = 13, TextColor3 = C.muted, LayoutOrder = 1, Parent = f })
	local box = new("TextBox", {
		LayoutOrder = 2, Text = formState[key], PlaceholderText = "Aleatório", ClearTextOnFocus = false, FontFace = Kit.F.body, TextSize = 15, TextColor3 = C.ink,
		PlaceholderColor3 = C.muted, BackgroundColor3 = C.surface, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 44), TextXAlignment = Enum.TextXAlignment.Left, Parent = f,
	}, { Kit.corner(10), Kit.stroke(C.line), Kit.pad(0, 12) })
	box:GetPropertyChangedSignal("Text"):Connect(function()
		local n = utf8.len(box.Text)
		if n and n > 20 then
			box.Text = string.sub(box.Text, 1, utf8.offset(box.Text, 21) - 1)
		end
		formState[key] = box.Text
	end)
	return f
end

local function formScreen()
	local C = Kit.C
	local _, col = fullScreen(TOP + 22)
	local head = new("Frame", { LayoutOrder = 1, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = col }, { Kit.vlist(5) })
	local back = new("TextButton", { LayoutOrder = 1, Text = "‹ Voltar", FontFace = Kit.F.heavy, TextSize = 14, TextColor3 = C.link, BackgroundTransparency = 1, Size = UDim2.fromOffset(80, 30), TextXAlignment = Enum.TextXAlignment.Left, Parent = head })
	Kit.press(back, function()
		screen = "home"
		render()
	end)
	text("Nova vida", { FontFace = Kit.F.display, TextSize = 28, LayoutOrder = 2, Parent = head })
	text("Escolha como nascer ou deixe tudo por conta da sorte. A família onde você nasce é sempre sorteada.", { TextSize = 13, TextColor3 = C.muted, LayoutOrder = 3, Parent = head })
	local fields = new("Frame", { LayoutOrder = 2, BackgroundColor3 = C.surface, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = col }, {
		Kit.corner(14), Kit.stroke(C.line), Kit.pad(18), Kit.vlist(16),
	})
	local names = new("Frame", { LayoutOrder = 1, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = fields }, { Kit.hlist(12, Enum.VerticalAlignment.Top) })
	inputField(names, 1, "Nome", "first")
	inputField(names, 2, "Sobrenome", "last")
	selectField(fields, 2, "Gênero", GENDER_OPTS, "gender")
	selectField(fields, 3, "País", COUNTRY_OPTS, "country")
	selectField(fields, 4, "Dificuldade", DIFF_OPTS, "diff")
	Kit.button("Nascer", nil, function()
		screen = "game"
		stack = {}
		call({ op = "new", gender = formState.gender ~= "" and formState.gender or nil, country = formState.country ~= "" and formState.country or nil, diff = formState.diff, first = formState.first, last = formState.last })
	end, { LayoutOrder = 5, TextSize = 16, Parent = fields })
	text("ou", { LayoutOrder = 3, TextSize = 12, TextColor3 = C.muted, TextXAlignment = Enum.TextXAlignment.Center, Parent = col })
	Kit.button("Vida completamente aleatória", "sun", function()
		screen = "game"
		stack = {}
		call({ op = "new" })
	end, { LayoutOrder = 4, TextSize = 16, Parent = col })
end

local function deathScreen()
	local C = Kit.C
	local me = state.me
	local d = state.death or {}
	local _, col = fullScreen(TOP + 28)
	local tomb = new("Frame", { LayoutOrder = 1, BackgroundColor3 = C.surface, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = col }, {
		Kit.corner(90), Kit.stroke(C.line), Kit.pad(34, 20, 26, 20), Kit.vlist(4, Enum.HorizontalAlignment.Center),
	})
	text(d.rip or "DESCANSE EM PAZ", { LayoutOrder = 1, FontFace = Kit.F.display, TextSize = 15, TextColor3 = C.muted, TextXAlignment = Enum.TextXAlignment.Center, Parent = tomb })
	local fw = new("Frame", { LayoutOrder = 2, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 112), Parent = tomb })
	local f = faceOf(me.face, 96, true)
	f.AnchorPoint = Vector2.new(0.5, 0.5)
	f.Position = UDim2.fromScale(0.5, 0.5)
	f.Parent = fw
	text(me.name, { LayoutOrder = 3, FontFace = Kit.F.display, TextSize = 28, TextXAlignment = Enum.TextXAlignment.Center, Parent = tomb })
	text(me.born .. " – " .. me.year, { LayoutOrder = 4, TextSize = 15, TextXAlignment = Enum.TextXAlignment.Center, Parent = tomb })
	local cause = me.cause or ""
	text(string.upper(string.sub(cause, 1, 1)) .. string.sub(cause, 2) .. ", aos " .. me.age .. " anos.", { LayoutOrder = 5, TextSize = 15, TextColor3 = C.muted, TextXAlignment = Enum.TextXAlignment.Center, Parent = tomb })
	local kids = {}
	for k, row in d.card or {} do
		table.insert(kids, Kit.kv(row[1], row[2], k == #(d.card or {})))
	end
	local card = Kit.card(kids)
	card.LayoutOrder = 2
	card.Parent = col
	Kit.button("Nova vida", "sun", function()
		screen = "form"
		render()
	end, { LayoutOrder = 3, TextSize = 16, Parent = col })
end

local function splash()
	local C = Kit.C
	local f = new("Frame", { BorderSizePixel = 0, BackgroundColor3 = Color3.new(1, 1, 1), Size = UDim2.fromScale(1, 1), Parent = stage }, { Kit.grad(C.brandGrad, 135) })
	new("TextLabel", { BackgroundTransparency = 1, AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.fromScale(0.5, 0.45), Size = UDim2.new(1, 0, 0, 60), RichText = true, Text = 'New<font color="#FFD23F">Life</font>', FontFace = Kit.F.display, TextSize = 54, TextColor3 = Color3.new(1, 1, 1), Parent = f })
	text("Sorteando uma nova vida…", { AnchorPoint = Vector2.new(0.5, 0), Position = UDim2.fromScale(0.5, 0.53), TextSize = 15, TextColor3 = Color3.new(1, 1, 1), TextTransparency = 0.15, TextXAlignment = Enum.TextXAlignment.Center, Parent = f })
end

---------------------------------------------------------------------------
-- desenho
---------------------------------------------------------------------------
function render()
	measure()
	bgFrame.BackgroundColor3 = Kit.C.bg
	local keep = overlay
	if keep then
		keep.Parent = nil
	end
	-- a tela é refeita a cada mudança; as rolagens voltam para onde estavam
	local scrolls = {}
	for _, d in stage:GetDescendants() do
		if d:IsA("ScrollingFrame") then
			scrolls[d.Name] = d.CanvasPosition
		end
	end
	clear(stage)
	new("UIScale", { Scale = SCALE, Parent = stage })
	if screen == "splash" then
		splash()
	elseif screen == "form" then
		formScreen()
	elseif screen == "home" or not (state and state.me) then
		homeScreen()
	else
		if not state.me.alive and not state.event and #modalQueue == 0 and not modalOpen then
			screen = "death"
		elseif state.me.alive and screen == "death" then
			screen = "game"
		end
		if screen == "death" then
			deathScreen()
		elseif WIDE then
			gameWide()
		else
			gameMobile()
		end
	end
	if keep then
		keep.Parent = stage
	end
	local jump = jumpDiary
	jumpDiary = false
	task.delay(0.05, function()
		for _, d in stage:GetDescendants() do
			if d:IsA("ScrollingFrame") then
				if d.Name == "Diario" and (jump or not scrolls.Diario) then
					-- diário novo ou ano novo: mostra o ano mais recente (o tamanho só fecha depois de alguns quadros)
					local function bottom()
						d.CanvasPosition = Vector2.new(0, math.max(0, d.AbsoluteCanvasSize.Y - d.AbsoluteWindowSize.Y))
					end
					bottom()
					local conn = d:GetPropertyChangedSignal("AbsoluteCanvasSize"):Connect(bottom)
					task.delay(0.6, function()
						conn:Disconnect()
					end)
				elseif scrolls[d.Name] then
					d.CanvasPosition = scrolls[d.Name]
				end
			end
		end
	end)
	if screen == "game" then
		pump()
	end
end

local function watchCamera(cam)
	if cam then
		cam:GetPropertyChangedSignal("ViewportSize"):Connect(function()
			if screen ~= "splash" then
				render()
			end
		end)
	end
end
watchCamera(workspace.CurrentCamera)
workspace:GetAttributeChangedSignal("NewLifeCelular"):Connect(function()
	render()
end)
workspace:GetPropertyChangedSignal("CurrentCamera"):Connect(function()
	watchCamera(workspace.CurrentCamera)
end)

render()
local ok, res = pcall(function()
	return remote:InvokeServer({ op = "state" })
end)
if ok and type(res) == "table" then
	state = res
	if res.meta and res.meta.prefs then
		prefs = res.meta.prefs
		Kit.setTheme(prefs.theme)
		applyMusic()
	end
end
task.wait(0.6)
screen = "home"
render()
