-- ===== Tela do NewLife no Roblox =====
-- Monta a interface por código (funciona no celular e no PC) e conversa com o servidor pelo NewLifeRemote.
-- Cores e jeitão seguem o app: azul-marinho, cartões claros e botões arredondados.

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local StarterGui = game:GetService("StarterGui")

local player = Players.LocalPlayer
local remote = ReplicatedStorage:WaitForChild("NewLifeRemote")

pcall(function()
	StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false)
	StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.Health, false)
end)

local C = {
	navy = Color3.fromRGB(34, 48, 94),
	navy2 = Color3.fromRGB(48, 66, 124),
	bg = Color3.fromRGB(240, 242, 248),
	card = Color3.fromRGB(255, 255, 255),
	ink = Color3.fromRGB(30, 34, 48),
	muted = Color3.fromRGB(110, 116, 136),
	accent = Color3.fromRGB(255, 176, 59),
	good = Color3.fromRGB(46, 160, 90),
	bad = Color3.fromRGB(214, 69, 65),
	warn = Color3.fromRGB(214, 140, 30),
	white = Color3.new(1, 1, 1),
}
local TONE = { good = C.good, bad = C.bad, warn = C.warn, big = C.navy }
local TITLE = Enum.Font.FredokaOne
local BODY = Enum.Font.BuilderSans
local BODY_BOLD = Enum.Font.BuilderSansBold

---------------------------------------------------------------------------
-- peças de interface
---------------------------------------------------------------------------
local function new(class: string, props, children)
	local o = Instance.new(class)
	for k, v in props or {} do
		if k ~= "Parent" then
			o[k] = v
		end
	end
	for _, ch in children or {} do
		ch.Parent = o
	end
	if props and props.Parent then
		o.Parent = props.Parent
	end
	return o
end
local function corner(r)
	return new("UICorner", { CornerRadius = UDim.new(0, r or 12) })
end
local function pad(px)
	return new("UIPadding", { PaddingTop = UDim.new(0, px), PaddingBottom = UDim.new(0, px), PaddingLeft = UDim.new(0, px), PaddingRight = UDim.new(0, px) })
end
local function list(gap, dir)
	return new("UIListLayout", { Padding = UDim.new(0, gap or 8), FillDirection = dir or Enum.FillDirection.Vertical, SortOrder = Enum.SortOrder.LayoutOrder, HorizontalAlignment = Enum.HorizontalAlignment.Center })
end
local function label(text, props)
	local p = {
		BackgroundTransparency = 1, Text = text, Font = BODY, TextSize = 18, TextColor3 = C.ink, TextWrapped = true,
		TextXAlignment = Enum.TextXAlignment.Left, AutomaticSize = Enum.AutomaticSize.Y, Size = UDim2.new(1, 0, 0, 0), RichText = false,
	}
	for k, v in props or {} do
		p[k] = v
	end
	return new("TextLabel", p)
end
local busy = false
local function button(text, color, onClick, props)
	local b = new("TextButton", {
		Text = text, Font = BODY_BOLD, TextSize = 18, TextColor3 = C.white, BackgroundColor3 = color or C.navy, AutoButtonColor = true,
		Size = UDim2.new(1, 0, 0, 46), TextWrapped = true, AutomaticSize = Enum.AutomaticSize.Y,
	}, { corner(12), new("UIPadding", { PaddingLeft = UDim.new(0, 12), PaddingRight = UDim.new(0, 12), PaddingTop = UDim.new(0, 10), PaddingBottom = UDim.new(0, 10) }) })
	for k, v in props or {} do
		b[k] = v
	end
	b.Activated:Connect(function()
		if not busy then
			onClick()
		end
	end)
	return b
end

---------------------------------------------------------------------------
-- estrutura da tela
---------------------------------------------------------------------------
local gui = new("ScreenGui", { Name = "NewLife", ResetOnSpawn = false, IgnoreGuiInset = true, ZIndexBehavior = Enum.ZIndexBehavior.Sibling, Parent = player:WaitForChild("PlayerGui") })
local root = new("Frame", { BackgroundColor3 = C.bg, Size = UDim2.fromScale(1, 1), Parent = gui })
-- coluna central: no PC fica estreita como no celular
local col = new("Frame", { BackgroundTransparency = 1, AnchorPoint = Vector2.new(0.5, 0), Position = UDim2.new(0.5, 0, 0, 0), Size = UDim2.new(1, 0, 1, 0), Parent = root },
	{ new("UISizeConstraint", { MaxSize = Vector2.new(560, math.huge) }) })

local header = new("Frame", { BackgroundColor3 = C.navy, Size = UDim2.new(1, 0, 0, 150), Parent = col }, { new("UIPadding", { PaddingTop = UDim.new(0, 44), PaddingLeft = UDim.new(0, 16), PaddingRight = UDim.new(0, 16), PaddingBottom = UDim.new(0, 10) }) })
local hName = label("NewLife", { Font = TITLE, TextSize = 24, TextColor3 = C.white, Size = UDim2.new(1, -170, 0, 0), TextTruncate = Enum.TextTruncate.AtEnd, AutomaticSize = Enum.AutomaticSize.None, Parent = header })
hName.Size = UDim2.new(1, -170, 0, 28)
local hInfo = label("", { TextSize = 15, TextColor3 = Color3.fromRGB(200, 208, 235), Position = UDim2.new(0, 0, 0, 30), Size = UDim2.new(1, 0, 0, 20), AutomaticSize = Enum.AutomaticSize.None, TextTruncate = Enum.TextTruncate.AtEnd, Parent = header })
local hMoney = label("", { Font = TITLE, TextSize = 22, TextColor3 = C.accent, TextXAlignment = Enum.TextXAlignment.Right, Size = UDim2.new(0, 160, 0, 0), AnchorPoint = Vector2.new(1, 0), Position = UDim2.new(1, 0, 0, 0), Parent = header })

local statsBox = new("Frame", { BackgroundTransparency = 1, Position = UDim2.new(0, 0, 0, 56), Size = UDim2.new(1, 0, 0, 40), Parent = header }, {
	new("UIGridLayout", { CellSize = UDim2.new(0.25, -6, 0, 40), CellPadding = UDim2.new(0, 6, 0, 0) }),
})
local STATS = { { "happy", "Felicidade", Color3.fromRGB(255, 196, 61) }, { "health", "Saúde", Color3.fromRGB(96, 214, 120) }, { "smarts", "Inteligência", Color3.fromRGB(110, 170, 255) }, { "looks", "Aparência", Color3.fromRGB(255, 128, 170) } }
local statBars = {}
for i, s in STATS do
	local f = new("Frame", { BackgroundTransparency = 1, LayoutOrder = i, Parent = statsBox })
	local t = label(s[2], { TextSize = 13, TextColor3 = Color3.fromRGB(200, 208, 235), Size = UDim2.new(1, 0, 0, 16), AutomaticSize = Enum.AutomaticSize.None, Parent = f })
	local track = new("Frame", { BackgroundColor3 = C.navy2, Position = UDim2.new(0, 0, 0, 20), Size = UDim2.new(1, 0, 0, 10), Parent = f }, { corner(5) })
	local fill = new("Frame", { BackgroundColor3 = s[3], Size = UDim2.new(0.5, 0, 1, 0), Parent = track }, { corner(5) })
	statBars[s[1]] = { fill = fill, label = t, name = s[2] }
end

local diary = new("ScrollingFrame", {
	BackgroundTransparency = 1, Position = UDim2.new(0, 0, 0, 150), Size = UDim2.new(1, 0, 1, -150 - 132), CanvasSize = UDim2.new(),
	AutomaticCanvasSize = Enum.AutomaticSize.Y, ScrollBarThickness = 6, ScrollingDirection = Enum.ScrollingDirection.Y, Parent = col,
}, { pad(12), list(10) })

local footer = new("Frame", { BackgroundColor3 = C.card, AnchorPoint = Vector2.new(0, 1), Position = UDim2.new(0, 0, 1, 0), Size = UDim2.new(1, 0, 0, 132), Parent = col }, {
	new("UIPadding", { PaddingTop = UDim.new(0, 10), PaddingLeft = UDim.new(0, 12), PaddingRight = UDim.new(0, 12), PaddingBottom = UDim.new(0, 18) }),
})

-- camada dos pop-ups (evento, atividades, relações, nova vida)
local overlay = new("Frame", { BackgroundColor3 = Color3.new(0, 0, 0), BackgroundTransparency = 0.45, Size = UDim2.fromScale(1, 1), Visible = false, ZIndex = 10, Parent = gui })
local sheet = new("Frame", { BackgroundColor3 = C.card, AnchorPoint = Vector2.new(0.5, 0.5), Position = UDim2.fromScale(0.5, 0.5), Size = UDim2.new(1, -24, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, ZIndex = 11, Parent = overlay },
	{ corner(18), new("UISizeConstraint", { MaxSize = Vector2.new(520, math.huge) }) })
-- o pop-up cresce com o conteúdo até 82% da altura da tela; dali em diante, rola
local sheetMax = new("UISizeConstraint", { MaxSize = Vector2.new(math.huge, 600) })
local sheetScroll = new("ScrollingFrame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, CanvasSize = UDim2.new(), AutomaticCanvasSize = Enum.AutomaticSize.Y, ScrollBarThickness = 5, ZIndex = 11, Parent = sheet },
	{ pad(16), list(10), sheetMax })

local state = nil
local render

local function clear(frame)
	for _, ch in frame:GetChildren() do
		if ch:IsA("GuiObject") then
			ch:Destroy()
		end
	end
end

local function call(req)
	if busy then
		return
	end
	busy = true
	local ok, res = pcall(function()
		return remote:InvokeServer(req)
	end)
	busy = false
	if ok and type(res) == "table" then
		state = res
		render()
	end
end

local function closeSheet()
	overlay.Visible = false
	clear(sheetScroll)
end

-- abre o pop-up com o conteúdo que fill() colocar em sheetScroll
local function openSheet(fill)
	clear(sheetScroll)
	fill(sheetScroll)
	sheetMax.MaxSize = Vector2.new(math.huge, math.max(200, gui.AbsoluteSize.Y * 0.82))
	sheetScroll.CanvasPosition = Vector2.zero
	overlay.Visible = true
end

local function setZ(obj)
	for _, d in obj:GetDescendants() do
		if d:IsA("GuiObject") then
			d.ZIndex = 12
		end
	end
	if obj:IsA("GuiObject") then
		obj.ZIndex = 12
	end
	return obj
end

---------------------------------------------------------------------------
-- telas
---------------------------------------------------------------------------
local function showEvent(ev)
	openSheet(function(p)
		setZ(label(ev.k or "", { TextSize = 14, TextColor3 = C.muted, Font = BODY_BOLD, LayoutOrder = 1, Parent = p }))
		setZ(label(ev.title, { Font = TITLE, TextSize = 24, LayoutOrder = 2, Parent = p }))
		setZ(label(ev.text, { TextSize = 19, LayoutOrder = 3, Parent = p }))
		for i, ch in ev.choices do
			setZ(button(ch, C.navy, function()
				closeSheet()
				call({ op = "choose", i = i })
			end, { LayoutOrder = 3 + i, Parent = p }))
		end
	end)
end

local function showActions()
	openSheet(function(p)
		setZ(label("Atividades", { Font = TITLE, TextSize = 24, LayoutOrder = 0, Parent = p }))
		local order, lastGroup = 1, nil
		for _, a in state.actions or {} do
			if a.group ~= lastGroup then
				lastGroup = a.group
				order += 1
				setZ(label(a.group, { Font = BODY_BOLD, TextSize = 15, TextColor3 = C.muted, LayoutOrder = order, Parent = p }))
			end
			order += 1
			setZ(button(a.label, C.navy2, function()
				closeSheet()
				call({ op = "act", id = a.id, arg = a.arg })
			end, { LayoutOrder = order, TextSize = 17, Parent = p }))
		end
		order += 1
		setZ(button("Fechar", C.muted, closeSheet, { LayoutOrder = order, Parent = p }))
	end)
end

local function showPeople()
	openSheet(function(p)
		setZ(label("Relações", { Font = TITLE, TextSize = 24, LayoutOrder = 0, Parent = p }))
		for i, pe in state.people or {} do
			local row = new("Frame", { BackgroundColor3 = C.bg, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, LayoutOrder = i, Parent = p }, { corner(10), pad(10), list(4) })
			label(pe.name .. " · " .. pe.age .. " anos", { Font = BODY_BOLD, TextSize = 17, LayoutOrder = 1, Parent = row })
			label(pe.rel .. " · relação " .. pe.bond .. "%", { TextSize = 15, TextColor3 = C.muted, LayoutOrder = 2, Parent = row })
			local track = new("Frame", { BackgroundColor3 = Color3.fromRGB(220, 224, 236), Size = UDim2.new(1, 0, 0, 6), LayoutOrder = 3, Parent = row }, { corner(3) })
			new("Frame", { BackgroundColor3 = pe.bond >= 50 and C.good or C.bad, Size = UDim2.new(pe.bond / 100, 0, 1, 0), Parent = track }, { corner(3) })
			setZ(row)
		end
		setZ(button("Fechar", C.muted, closeSheet, { LayoutOrder = 999, Parent = p }))
	end)
end

local COUNTRIES = { { "", "País aleatório" }, { "BR", "Brasil" }, { "PT", "Portugal" }, { "US", "Estados Unidos" }, { "AR", "Argentina" }, { "MX", "México" }, { "JP", "Japão" }, { "IT", "Itália" }, { "FR", "França" }, { "DE", "Alemanha" }, { "GB", "Reino Unido" }, { "AO", "Angola" }, { "CA", "Canadá" }, { "ES", "Espanha" }, { "KR", "Coreia do Sul" }, { "IN", "Índia" } }

local function showNewLife()
	local choice = { gender = nil, country = "" }
	openSheet(function(p)
		setZ(label("Nova vida", { Font = TITLE, TextSize = 26, LayoutOrder = 0, Parent = p }))
		setZ(label("Escolha como começar, ou deixe tudo no aleatório.", { TextSize = 16, TextColor3 = C.muted, LayoutOrder = 1, Parent = p }))
		local gRow = new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 46), LayoutOrder = 2, Parent = p }, { new("UIGridLayout", { CellSize = UDim2.new(1 / 3, -6, 0, 46), CellPadding = UDim2.new(0, 6, 0, 0) }) })
		local gButtons = {}
		local function paintG()
			for k, b in gButtons do
				b.BackgroundColor3 = (choice.gender or "") == k and C.navy or C.muted
			end
		end
		for _, opt in { { "", "Aleatório" }, { "F", "Menina" }, { "M", "Menino" } } do
			gButtons[opt[1]] = button(opt[2], C.muted, function()
				choice.gender = opt[1] ~= "" and opt[1] or nil
				paintG()
			end, { Parent = gRow, AutomaticSize = Enum.AutomaticSize.None })
		end
		paintG()
		local cBtn
		local idx = 1
		cBtn = button("País: " .. COUNTRIES[1][2], C.navy2, function()
			idx = idx % #COUNTRIES + 1
			choice.country = COUNTRIES[idx][1]
			cBtn.Text = "País: " .. COUNTRIES[idx][2]
		end, { LayoutOrder = 3, Parent = p })
		setZ(gRow)
		setZ(cBtn)
		setZ(button("Começar", C.good, function()
			closeSheet()
			call({ op = "new", gender = choice.gender, country = choice.country ~= "" and choice.country or nil })
		end, { LayoutOrder = 4, Parent = p }))
		if state and state.me and state.me.alive then
			setZ(label("A vida atual vai acabar aqui.", { TextSize = 14, TextColor3 = C.bad, LayoutOrder = 5, Parent = p }))
			setZ(button("Voltar", C.muted, closeSheet, { LayoutOrder = 6, Parent = p }))
		end
	end)
end

---------------------------------------------------------------------------
-- desenho principal
---------------------------------------------------------------------------
local function renderDiary()
	clear(diary)
	local log = state.log or {}
	-- ano mais recente em cima
	for i = #log, 1, -1 do
		local y = log[i]
		local card = new("Frame", { BackgroundColor3 = C.card, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, LayoutOrder = #log - i, Parent = diary }, { corner(14), pad(12), list(4) })
		label(y.age == 0 and ("Nascimento · " .. y.year) or (y.age .. (y.age == 1 and " ano" or " anos") .. " · " .. y.year), { Font = TITLE, TextSize = 18, TextColor3 = C.navy, LayoutOrder = 0, Parent = card })
		for j, l in y.lines do
			label(l.t, { TextSize = 17, TextColor3 = TONE[l.c] or C.ink, Font = (l.c == "big") and BODY_BOLD or BODY, LayoutOrder = j, Parent = card })
		end
	end
end

local function renderFooter()
	clear(footer)
	local me = state.me
	if not me then
		local box = new("Frame", { BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), Parent = footer }, { list(8) })
		button("Nova vida", C.good, showNewLife, { Parent = box })
		return
	end
	if not me.alive then
		local box = new("Frame", { BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), Parent = footer }, { list(8) })
		label("Fim da vida de " .. me.name .. " (" .. me.age .. " anos).", { Font = BODY_BOLD, TextXAlignment = Enum.TextXAlignment.Center, Parent = box })
		button("Viver uma nova vida", C.good, showNewLife, { Parent = box })
		return
	end
	local grid = new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 46), Parent = footer }, {
		new("UIGridLayout", { CellSize = UDim2.new(1 / 3, -6, 0, 46), CellPadding = UDim2.new(0, 6, 0, 0) }),
	})
	button("Atividades", C.navy2, showActions, { Parent = grid, AutomaticSize = Enum.AutomaticSize.None, TextSize = 16 })
	button("Relações", C.navy2, showPeople, { Parent = grid, AutomaticSize = Enum.AutomaticSize.None, TextSize = 16 })
	button("Nova vida", C.muted, showNewLife, { Parent = grid, AutomaticSize = Enum.AutomaticSize.None, TextSize = 16 })
	button("+1 ano", C.accent, function()
		call({ op = "age" })
	end, { Position = UDim2.new(0, 0, 0, 54), Size = UDim2.new(1, 0, 0, 52), AutomaticSize = Enum.AutomaticSize.None, Font = TITLE, TextSize = 24, TextColor3 = C.navy, Parent = footer })
end

function render()
	local me = state.me
	if me then
		hName.Text = me.name
		local info = me.age .. (me.age == 1 and " ano" or " anos") .. " · " .. me.city .. ", " .. me.country
		if me.status then
			info ..= " · " .. me.status
		end
		hInfo.Text = info
		hMoney.Text = me.money
		for k, b in statBars do
			local v = me.stats[k] or 0
			b.fill.Size = UDim2.new(v / 100, 0, 1, 0)
			b.label.Text = b.name .. " " .. v .. "%"
		end
		statsBox.Visible = true
	else
		hName.Text = "NewLife"
		hInfo.Text = "Um simulador de vida em português" .. (state.version and (" · versão " .. state.version) or "") .. "."
		hMoney.Text = ""
		statsBox.Visible = false
	end
	renderDiary()
	renderFooter()
	if state.event then
		showEvent(state.event)
	end
end

state = { log = {} }
render()
call({ op = "state" })
if not (state and state.me) then
	showNewLife()
end
