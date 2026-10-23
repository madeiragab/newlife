-- ===== Imagens desenhadas na hora (rostos, bandeiras e ícones) =====
-- O SVG vira pixels com Svg.luau e vai para um EditableImage. Cada imagem é desenhada uma vez
-- (cache pela chave) e as novas entram numa fila, poucas por quadro, para a tela não travar.
-- Se o Roblox não liberar o EditableImage, mostra um círculo com a inicial no lugar do rosto.

local AssetService = game:GetService("AssetService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local HttpService = game:GetService("HttpService")

local NewLife = ReplicatedStorage:WaitForChild("NewLife")
local Svg = require(NewLife:WaitForChild("Svg"))
local FaceSvg = require(NewLife:WaitForChild("FaceSvg"))
local Icons = require(NewLife:WaitForChild("Data"):WaitForChild("Icons"))

local Images = {}

local cache = {} -- chave -> EditableImage
local waiting = {} -- chave -> { ImageLabel }
local queue = {}
local editableOk = true
local BUDGET = 0.012 -- segundos de desenho por quadro

local function makeEditable(w: number, h: number, buf)
	local ok, img = pcall(function()
		return AssetService:CreateEditableImage({ Size = Vector2.new(w, h) })
	end)
	if not ok or not img then
		editableOk = false
		return nil
	end
	img:WritePixelsBuffer(Vector2.zero, Vector2.new(w, h), buf)
	return img
end

local function apply(label: ImageLabel, img)
	if label.Parent and img then
		label.ImageContent = Content.fromObject(img)
		label.ImageTransparency = 0
	end
end

task.spawn(function()
	while true do
		local t0 = os.clock()
		while #queue > 0 and os.clock() - t0 < BUDGET do
			local job = table.remove(queue, 1)
			if not cache[job.key] and editableOk then
				local ok, buf = pcall(job.draw)
				if ok and buf then
					cache[job.key] = makeEditable(job.w, job.h, buf)
				else
					warn("[NewLife] não deu para desenhar", job.key, buf)
				end
			end
			for _, l in waiting[job.key] or {} do
				apply(l, cache[job.key])
			end
			waiting[job.key] = nil
		end
		task.wait()
	end
end)

-- pede a imagem; ela aparece no label quando estiver pronta
local function request(label: ImageLabel, key: string, w: number, h: number, draw, front: boolean?)
	if cache[key] then
		apply(label, cache[key])
		return
	end
	label.ImageTransparency = 1
	if waiting[key] then
		table.insert(waiting[key], label)
		return
	end
	waiting[key] = { label }
	local job = { key = key, w = w, h = h, draw = draw }
	if front then
		table.insert(queue, 1, job)
	else
		table.insert(queue, job)
	end
end

local function px(size: number): number
	-- desenha em resolução maior para ficar nítido em telas densas e no layout largo
	return math.clamp(math.ceil(size * 2), 32, 256)
end

-- rosto redondo de uma pessoa (dados de Looks.face no servidor)
function Images.face(face, size: number, parent: Instance?, front: boolean?): Frame
	local holder = Instance.new("Frame")
	holder.Name = "Face"
	holder.BackgroundTransparency = 1
	holder.Size = UDim2.fromOffset(size, size)
	local fallback = Instance.new("TextLabel")
	fallback.Size = UDim2.fromScale(1, 1)
	fallback.BackgroundColor3 = Color3.fromRGB(207, 224, 255)
	fallback.Text = ""
	fallback.TextScaled = true
	fallback.Parent = holder
	local c = Instance.new("UICorner")
	c.CornerRadius = UDim.new(0.5, 0)
	c.Parent = fallback
	local img = Instance.new("ImageLabel")
	img.BackgroundTransparency = 1
	img.Size = UDim2.fromScale(1, 1)
	img.ImageTransparency = 1
	img.ZIndex = 2
	img.Parent = holder
	if parent then
		holder.Parent = parent
	end
	if not face then
		return holder
	end
	local key = "face:" .. size .. ":" .. HttpService:JSONEncode(face)
	local p = px(size)
	request(img, key, p, p, function()
		return Svg.render(FaceSvg.build(face, "f"), p)
	end, front)
	task.defer(function()
		if not editableOk then
			fallback.Text = ""
		end
	end)
	return holder
end

-- bandeira do país (30×20, como flagSVG em src/icons.js)
function Images.flag(cid: string, w: number, parent: Instance?): ImageLabel
	local img = Instance.new("ImageLabel")
	img.BackgroundTransparency = 1
	img.Size = UDim2.fromOffset(w, math.round(w * 2 / 3))
	if parent then
		img.Parent = parent
	end
	local art = Icons.flags[cid] or '<rect width="30" height="20" fill="#999"/>'
	local pw = px(w)
	local ph = math.round(pw * 2 / 3)
	request(img, "flag:" .. cid .. ":" .. pw, pw, ph, function()
		return Svg.render('<svg viewBox="0 0 30 20">' .. art .. "</svg>", pw, ph)
	end, true)
	local c = Instance.new("UICorner")
	c.CornerRadius = UDim.new(0, 2)
	c.Parent = img
	return img
end

-- ícone de traço (os da barra de navegação), desenhado em branco e pintado com ImageColor3
function Images.icon(svgInner: string, size: number, color: Color3, parent: Instance?): ImageLabel
	local img = Instance.new("ImageLabel")
	img.BackgroundTransparency = 1
	img.Size = UDim2.fromOffset(size, size)
	img.ImageColor3 = color
	if parent then
		img.Parent = parent
	end
	local p = px(size)
	request(img, "icon:" .. p .. ":" .. svgInner, p, p, function()
		return Svg.render('<svg viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' .. svgInner .. "</g></svg>", p)
	end, true)
	return img
end

function Images.available(): boolean
	return editableOk
end

return Images
