-- ===== Peças da interface, com o tema da versão web (src/style.css) =====
-- Cores, fontes (Fredoka e Nunito), degradês, a faixa colorida, botões, barras, linhas e cartões.
-- Medidas em "px de CSS": a tela inteira fica dentro de um UIScale (Ui.client.luau).

local Kit = {}

local function rgb(h: string): Color3
	return Color3.fromHex(h)
end

-- :root e o tema escuro de src/style.css
local LIGHT = {
	bg = rgb("#F2F3F8"), surface = rgb("#FFFFFF"), surface2 = rgb("#E8EAF2"), ink = rgb("#161A2C"), muted = rgb("#5D6482"), line = rgb("#DDE0EA"),
	brand = rgb("#2E6BFF"), brand2 = rgb("#4A80FF"), btn = rgb("#2E6BFF"), sun = rgb("#FFC83D"), sunInk = rgb("#2A1C00"),
	good = rgb("#22A05A"), warn = rgb("#E08A00"), bad = rgb("#E2433A"), link = rgb("#2E6BFF"),
	ph = { rgb("#FF9F1C"), rgb("#22C3A6"), rgb("#2E86FF"), rgb("#9B5DE5"), rgb("#F0567A") },
	brandGrad = { rgb("#2E6BFF"), rgb("#4F86FF"), rgb("#6C5CE7") },
	dark = false,
}
local DARK = {
	bg = rgb("#000000"), surface = rgb("#111113"), surface2 = rgb("#1E1E23"), ink = rgb("#F2F2F6"), muted = rgb("#9C9CA8"), line = rgb("#26262C"),
	brand = rgb("#000000"), brand2 = rgb("#1E1E23"), btn = rgb("#2E6BFF"), sun = rgb("#FFC83D"), sunInk = rgb("#231700"),
	good = rgb("#3DD27E"), warn = rgb("#FFB02E"), bad = rgb("#FF5A54"), link = rgb("#7EA6FF"),
	ph = { rgb("#E08A12"), rgb("#16A88F"), rgb("#2A6FE0"), rgb("#8148CC"), rgb("#D8446A") },
	brandGrad = { rgb("#0B0B10"), rgb("#101016"), rgb("#15151C") },
	dark = true,
}
Kit.C = LIGHT
function Kit.setTheme(name: string)
	Kit.C = name == "dark" and DARK or LIGHT
end

Kit.STRIPE = { rgb("#F0567A"), rgb("#FF9F1C"), rgb("#FFD23F"), rgb("#22C3A6"), rgb("#2E86FF"), rgb("#9B5DE5") }
Kit.SUN = { rgb("#FFE27A"), rgb("#FFC83D"), rgb("#FF9F1C") }

Kit.F = {
	display = Font.new("rbxasset://fonts/families/FredokaOne.json", Enum.FontWeight.Regular),
	body = Font.new("rbxasset://fonts/families/Nunito.json", Enum.FontWeight.Regular),
	semi = Font.new("rbxasset://fonts/families/Nunito.json", Enum.FontWeight.SemiBold),
	bold = Font.new("rbxasset://fonts/families/Nunito.json", Enum.FontWeight.Bold),
	heavy = Font.new("rbxasset://fonts/families/Nunito.json", Enum.FontWeight.ExtraBold),
}

---------------------------------------------------------------------------
-- básicos
---------------------------------------------------------------------------
function Kit.new(class: string, props, children)
	local o = Instance.new(class)
	local parent
	for k, v in props or {} do
		if k == "Parent" then
			parent = v
		else
			o[k] = v
		end
	end
	for _, ch in children or {} do
		ch.Parent = o
	end
	if parent then
		o.Parent = parent
	end
	return o
end
local new = Kit.new

function Kit.corner(r)
	return new("UICorner", { CornerRadius = typeof(r) == "UDim" and r or UDim.new(0, r or 12) })
end
function Kit.pad(t, r, b, l)
	r = r or t
	b = b or t
	l = l or r
	return new("UIPadding", { PaddingTop = UDim.new(0, t), PaddingRight = UDim.new(0, r), PaddingBottom = UDim.new(0, b), PaddingLeft = UDim.new(0, l) })
end
function Kit.vlist(gap, align)
	return new("UIListLayout", { Padding = UDim.new(0, gap or 0), SortOrder = Enum.SortOrder.LayoutOrder, HorizontalAlignment = align or Enum.HorizontalAlignment.Left })
end
function Kit.hlist(gap, valign)
	return new("UIListLayout", { Padding = UDim.new(0, gap or 0), FillDirection = Enum.FillDirection.Horizontal, SortOrder = Enum.SortOrder.LayoutOrder, VerticalAlignment = valign or Enum.VerticalAlignment.Center })
end
function Kit.grow()
	return new("UIFlexItem", { FlexMode = Enum.UIFlexMode.Fill })
end
function Kit.stroke(color: Color3, thick: number?, transp: number?)
	return new("UIStroke", { Color = color, Thickness = thick or 1, Transparency = transp or 0, ApplyStrokeMode = Enum.ApplyStrokeMode.Border })
end
function Kit.max(w: number?, h: number?)
	return new("UISizeConstraint", { MaxSize = Vector2.new(w or math.huge, h or math.huge) })
end

-- degradê: cores em sequência; rot = ângulo do CSS (135deg = ↘)
function Kit.grad(colors: { Color3 }, cssDeg: number?, transp)
	local kp = {}
	for i, c in colors do
		table.insert(kp, ColorSequenceKeypoint.new((i - 1) / math.max(1, #colors - 1), c))
	end
	local g = new("UIGradient", { Color = ColorSequence.new(kp), Rotation = (cssDeg or 90) - 90 })
	if transp then
		g.Transparency = transp
	end
	return g
end

-- a faixa de seis cores (--stripe)
function Kit.stripe(height: number, props)
	local kp = {}
	local n = #Kit.STRIPE
	for i, c in Kit.STRIPE do
		local a, b = (i - 1) / n, i / n
		table.insert(kp, ColorSequenceKeypoint.new(a == 0 and 0 or a + 0.0001, c))
		table.insert(kp, ColorSequenceKeypoint.new(b == 1 and 1 or b, c))
	end
	local f = new("Frame", { Name = "Stripe", BorderSizePixel = 0, BackgroundColor3 = Color3.new(1, 1, 1), Size = UDim2.new(1, 0, 0, height) }, {
		new("UIGradient", { Color = ColorSequence.new(kp) }),
	})
	for k, v in props or {} do
		f[k] = v
	end
	return f
end

function Kit.text(text: string, props)
	local p = {
		BackgroundTransparency = 1, Text = text, FontFace = Kit.F.body, TextSize = 15, TextColor3 = Kit.C.ink, TextWrapped = true,
		TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Top, AutomaticSize = Enum.AutomaticSize.Y, Size = UDim2.new(1, 0, 0, 0),
		LineHeight = 1.15,
	}
	for k, v in props or {} do
		p[k] = v
	end
	return new("TextLabel", p)
end

-- sombra suave por baixo (box-shadow aproximado com uma camada escura transparente)
function Kit.shadow(parent: GuiObject, radius: number, offset: number?, transp: number?)
	local s = new("Frame", {
		Name = "Shadow", BackgroundColor3 = Color3.fromRGB(20, 28, 60), BackgroundTransparency = transp or 0.9, BorderSizePixel = 0,
		Size = UDim2.new(1, 2, 1, 2), Position = UDim2.fromOffset(-1, offset or 2), ZIndex = parent.ZIndex - 1,
	}, { Kit.corner(radius + 1) })
	s.Parent = parent.Parent
	return s
end

---------------------------------------------------------------------------
-- botões (.btn, .btn.alt, .btn.sun, .btn.danger)
---------------------------------------------------------------------------
Kit.busy = false
Kit.onClick = nil -- som de clique (Ui.client.luau)

function Kit.press(b: GuiButton, fn)
	b.Activated:Connect(function()
		if Kit.busy then
			return
		end
		if Kit.onClick then
			Kit.onClick()
		end
		fn()
	end)
	local sc = b:FindFirstChildOfClass("UIScale") or new("UIScale", { Parent = b })
	b.MouseButton1Down:Connect(function()
		sc.Scale = 0.97
	end)
	b.MouseButton1Up:Connect(function()
		sc.Scale = 1
	end)
	b.MouseLeave:Connect(function()
		sc.Scale = 1
	end)
	return b
end

-- o UIGradient do Roblox pinta o texto junto com o fundo; por isso o degradê fica num quadro
-- de fundo e o texto num rótulo por cima
local TEXT_PROPS = { Text = true, TextSize = true, FontFace = true, TextColor3 = true }
function Kit.button(label: string, kind: string?, fn, props)
	local C = Kit.C
	local b = new("TextButton", {
		Text = "", AutoButtonColor = false, BorderSizePixel = 0, BackgroundTransparency = 1,
		Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y,
	})
	local bg = new("Frame", { Name = "Bg", BorderSizePixel = 0, BackgroundColor3 = Color3.new(1, 1, 1), Size = UDim2.fromScale(1, 1), Parent = b }, { Kit.corner(14) })
	local tx = new("TextLabel", {
		Name = "Label", BackgroundTransparency = 1, Text = label, FontFace = Kit.F.bold, TextSize = 15, TextWrapped = true, TextColor3 = Color3.new(1, 1, 1),
		Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = b,
	}, { Kit.pad(13, 16) })
	if kind == "alt" then
		bg.BackgroundColor3 = C.surface2
		tx.TextColor3 = C.ink
		Kit.stroke(C.line).Parent = bg
	elseif kind == "sun" then
		tx.TextColor3 = C.sunInk
		Kit.grad(Kit.SUN, 145).Parent = bg
	elseif kind == "danger" then
		Kit.grad({ rgb("#E2433A"), rgb("#FF6B5E") }, 135).Parent = bg
	else
		Kit.grad({ rgb("#2E6BFF"), rgb("#5B8CFF") }, 135).Parent = bg
	end
	for k, v in props or {} do
		if TEXT_PROPS[k] then
			tx[k] = v
		else
			b[k] = v
		end
	end
	if fn then
		Kit.press(b, fn)
	end
	return b
end

-- botão quadrado do topo (.icon-btn)
function Kit.iconButton(content: string, onDark: boolean, fn)
	local C = Kit.C
	local b = new("TextButton", {
		Text = content, FontFace = Kit.F.heavy, TextSize = 18, AutoButtonColor = false, BorderSizePixel = 0, Size = UDim2.fromOffset(38, 38),
		BackgroundColor3 = onDark and Color3.new(1, 1, 1) or C.surface2, BackgroundTransparency = onDark and 0.84 or 0,
		TextColor3 = onDark and Color3.new(1, 1, 1) or C.ink,
	}, { Kit.corner(10) })
	if fn then
		Kit.press(b, fn)
	end
	return b
end

---------------------------------------------------------------------------
-- barras
---------------------------------------------------------------------------
-- cor da barra pelo valor (grad em src/ui.js)
function Kit.barColors(v: number)
	if v >= 70 then
		return { rgb("#3BB273"), rgb("#5DD39E") }
	elseif v >= 45 then
		return { rgb("#8CC63F"), rgb("#C5E063") }
	elseif v >= 25 then
		return { rgb("#F2A93B"), rgb("#F6C85F") }
	end
	return { rgb("#E5484D"), rgb("#F0756E") }
end

function Kit.bar(v: number, height: number, colors)
	local C = Kit.C
	local track = new("Frame", { Name = "Bar", BackgroundColor3 = C.surface2, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, height), ClipsDescendants = true }, { Kit.corner(UDim.new(1, 0)) })
	local fill = new("Frame", { Name = "Fill", BackgroundColor3 = Color3.new(1, 1, 1), BorderSizePixel = 0, Size = UDim2.new(math.clamp(v / 100, 0, 1), 0, 1, 0), Parent = track }, { Kit.corner(UDim.new(1, 0)) })
	if typeof(colors) == "Color3" then
		fill.BackgroundColor3 = colors
	else
		Kit.grad(colors or Kit.barColors(v), 90).Parent = fill
	end
	return track
end

-- linha "rótulo  barra  %" (.mini em src/style.css)
function Kit.miniBar(label: string, v: number)
	local C = Kit.C
	return new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 26) }, {
		Kit.text(label, { FontFace = Kit.F.bold, TextSize = 13, Size = UDim2.new(0, 120, 1, 0), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, TextTruncate = Enum.TextTruncate.AtEnd }),
		(function()
			local b = Kit.bar(v, 11)
			b.AnchorPoint = Vector2.new(0, 0.5)
			b.Position = UDim2.new(0, 126, 0.5, 0)
			b.Size = UDim2.new(1, -126 - 44, 0, 11)
			return b
		end)(),
		Kit.text(math.round(v) .. "%", { TextSize = 12, TextColor3 = C.muted, TextXAlignment = Enum.TextXAlignment.Right, Size = UDim2.new(0, 40, 1, 0), Position = UDim2.new(1, -40, 0, 0), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center }),
	})
end

---------------------------------------------------------------------------
-- cartão (.card com .kv) e seção (.sec)
---------------------------------------------------------------------------
function Kit.card(children)
	local C = Kit.C
	local f = new("Frame", { BackgroundColor3 = C.surface, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y }, {
		Kit.corner(14), Kit.stroke(C.line), Kit.pad(14, 16), Kit.vlist(0),
	})
	for i, ch in children or {} do
		ch.LayoutOrder = i
		ch.Parent = f
	end
	return f
end

function Kit.kv(k: string, v: string, last: boolean?)
	local C = Kit.C
	local row = new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 30) }, {
		Kit.text(k, { TextSize = 14, Size = UDim2.new(0.55, 0, 1, 0), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, TextTruncate = Enum.TextTruncate.AtEnd }),
		Kit.text(v, { TextSize = 14, FontFace = Kit.F.bold, TextXAlignment = Enum.TextXAlignment.Right, Size = UDim2.new(0.45, 0, 1, 0), Position = UDim2.new(0.55, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center, TextTruncate = Enum.TextTruncate.AtEnd }),
	})
	if not last then
		new("Frame", { BackgroundColor3 = C.line, BorderSizePixel = 0, Size = UDim2.new(1, 0, 0, 1), Position = UDim2.new(0, 0, 1, -1), Parent = row })
	end
	return row
end

function Kit.sec(text: string)
	local C = Kit.C
	return new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 30) }, {
		new("Frame", { BackgroundColor3 = C.brand.R + C.brand.G + C.brand.B < 0.1 and C.link or C.brand, BorderSizePixel = 0, Size = UDim2.fromOffset(4, 14), Position = UDim2.new(0, 4, 1, -17) }, { Kit.corner(4) }),
		Kit.text(string.upper(text), { FontFace = Kit.F.heavy, TextSize = 12, TextColor3 = C.brand.R + C.brand.G + C.brand.B < 0.1 and C.link or C.brand, Position = UDim2.new(0, 16, 1, -18), Size = UDim2.new(1, -16, 0, 16), AutomaticSize = Enum.AutomaticSize.None }),
	})
end

-- linha clicável (.row): ícone/rosto, título, subtítulo, valor à direita, barras de relação
function Kit.row(item, onClick, faceFn)
	local C = Kit.C
	local b = new("TextButton", {
		Text = "", AutoButtonColor = false, BorderSizePixel = 0, BackgroundColor3 = C.surface, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y,
	}, { Kit.corner(14), Kit.stroke(C.line), Kit.pad(12, 14) })
	local inner = new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = b }, {
		new("UIListLayout", { FillDirection = Enum.FillDirection.Horizontal, Padding = UDim.new(0, 12), VerticalAlignment = Enum.VerticalAlignment.Center, SortOrder = Enum.SortOrder.LayoutOrder }),
	})
	new("UISizeConstraint", { MinSize = Vector2.new(0, 32), Parent = inner })
	if item.face and faceFn then
		local f = faceFn(item.face, 42)
		f.LayoutOrder = 1
		f.Parent = inner
	elseif item.ic then
		new("TextLabel", {
			LayoutOrder = 1, Text = item.ic, TextSize = 21, BackgroundColor3 = C.surface2, Size = UDim2.fromOffset(40, 40), FontFace = Kit.F.body, TextColor3 = C.ink, Parent = inner,
		}, { Kit.corner(13) })
	end
	local tx = new("Frame", { LayoutOrder = 2, BackgroundTransparency = 1, Size = UDim2.new(0, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, Parent = inner }, { Kit.vlist(1), Kit.grow() })
	local tone = item.tone == "bad" and C.bad or item.tone == "good" and C.good or C.ink
	Kit.text(item.l or "", { FontFace = Kit.F.bold, TextSize = 15, TextColor3 = tone, LayoutOrder = 1, Parent = tx })
	local sub = item.dis and item.why or item.s
	if sub then
		Kit.text(sub, { TextSize = 12.5, TextColor3 = C.muted, LayoutOrder = 2, Parent = tx })
	end
	if item.bars then
		local bars = new("Frame", { LayoutOrder = 3, BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 18), Parent = tx }, {
			new("UIListLayout", { FillDirection = Enum.FillDirection.Horizontal, Padding = UDim.new(0, 10), VerticalAlignment = Enum.VerticalAlignment.Center, HorizontalFlex = Enum.UIFlexAlignment.Fill }),
		})
		for _, bar in item.bars do
			local cell = new("Frame", { BackgroundTransparency = 1, Size = UDim2.new(0.5, -5, 1, 0), Parent = bars }, {
				Kit.text(bar[1], { TextSize = 11, Size = UDim2.fromOffset(16, 18), AutomaticSize = Enum.AutomaticSize.None, TextYAlignment = Enum.TextYAlignment.Center }),
			})
			local t = Kit.bar(bar[2], 7, Color3.fromHex(bar[3]))
			t.AnchorPoint = Vector2.new(0, 0.5)
			t.Position = UDim2.new(0, 18, 0.5, 0)
			t.Size = UDim2.new(1, -18, 0, 7)
			t.Parent = cell
		end
	end
	if item.r then
		Kit.text(item.r, { LayoutOrder = 3, FontFace = Kit.F.bold, TextSize = 13, TextColor3 = item.tone == "good" and C.good or C.muted, TextXAlignment = Enum.TextXAlignment.Right, Size = UDim2.new(0, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.XY, TextWrapped = false, Parent = inner })
	end
	if item.push or item.act or item.op then
		Kit.text("›", { LayoutOrder = 4, FontFace = Kit.F.heavy, TextSize = 18, TextColor3 = C.muted, Size = UDim2.fromOffset(8, 20), AutomaticSize = Enum.AutomaticSize.None, Parent = inner })
	end
	if item.dis then
		b.BackgroundTransparency = 0.45
		for _, d in b:GetDescendants() do
			if d:IsA("TextLabel") then
				d.TextTransparency = 0.45
			end
		end
	end
	if onClick and not item.dis then
		Kit.press(b, onClick)
	end
	return b
end

return Kit
