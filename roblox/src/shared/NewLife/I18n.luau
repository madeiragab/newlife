-- ===== Idiomas no Roblox =====
-- Mesmo esquema da web (src/i18n.js): o jogo é em português e o cliente troca na tela todo texto que tem
-- tradução. Data/I18nEN.luau vem do dicionário EN da web (tools/extract.cjs); EXTRA tem os textos que só
-- existem nas telas do Roblox.

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

local Base = dep("Data/I18nEN")

local I18n = {}

local EXTRA = {
	["Vagas de emprego"] = "Job openings", ["Procurar emprego"] = "Look for a job", ["Vagas de acordo com a minha formação"] = "Openings that match my education",
	["Pedir demissão"] = "Quit", ["Cargo"] = "Position", ["Empresa"] = "Company", ["Curso"] = "Course", ["Nota"] = "Grade", ["Estudar mais"] = "Study harder",
	["Melhora as notas"] = "Improves grades", ["Universidade pública"] = "Public university", ["Situação"] = "Status",
	["Onde moro"] = "Where I live", ["Com a minha família"] = "With my family", ["Na minha casa"] = "In my own home", ["Contas do ano"] = "Yearly bills",
	["Sair de casa"] = "Move out", ["Adotar uma criança"] = "Adopt a child", ["Academia"] = "Gym", ["Biblioteca"] = "Library", ["Meditação"] = "Meditation",
	["Saúde e aparência"] = "Health and looks", ["Felicidade e força de vontade"] = "Happiness and willpower", ["Puxar conversa com alguém"] = "Start a conversation with someone",
	["Pode virar amizade"] = "Might become a friendship", ["Sair para conhecer alguém"] = "Go out and meet someone", ["Encontros e aplicativos"] = "Dates and apps",
	["Academia, biblioteca, meditação"] = "Gym, library, meditation", ["Conhecer gente nova"] = "Meet new people", ["Encontros e namoro"] = "Dates and dating",
	["Visual, genética e talentos"] = "Looks, genetics and talents", ["Outros"] = "Other", ["Ensino fundamental"] = "Elementary school", ["Ensino médio"] = "High school",
	["Concluído"] = "Completed", ["Concluída"] = "Completed", ["Pública"] = "Public", ["Ninguém por aqui ainda."] = "Nobody here yet.",
	["Mude atributos e talentos"] = "Change stats and talents", ["Mude atributos e talentos quando quiser"] = "Change stats and talents anytime",
	["Volte até 5 anos e refaça suas escolhas"] = "Go back up to 5 years and redo your choices", ["Ajude o NewLife a crescer"] = "Help NewLife grow",
	["Obrigado pelo apoio!"] = "Thanks for the support!", ["Nenhum ano salvo ainda"] = "No saved year yet", ["Atributos"] = "Stats", ["Dinheiro"] = "Money",
	["Português"] = "Português", ["English"] = "English", ["Automático"] = "Automatic", ["Idioma"] = "Language", ["Derrubar o governo"] = "Overthrow the government",
	["Movimento clandestino e golpe de Estado"] = "Underground movement and coup d'état", ["Preparar"] = "Prepare", ["A hora da verdade"] = "The moment of truth",
	["Dar o golpe"] = "Launch the coup", ["Abandonar o movimento"] = "Abandon the movement", ["Escolher um herdeiro"] = "Choose an heir",
	["Fugir para o exílio"] = "Flee into exile", ["Anexar território"] = "Annex territory", ["Programa nuclear"] = "Nuclear program",
	["Definir meu salário"] = "Set my salary", ["Mudar o nome do país"] = "Rename the country", ["Crime"] = "Crime", ["Pena"] = "Sentence", ["Já cumpri"] = "Served",
	["Falta"] = "Remaining", ["Trabalhar na cozinha"] = "Work in the kitchen", ["Curso profissionalizante"] = "Vocational course", ["Fazer amizade no pavilhão"] = "Make friends in the cell block",
	["Brigar no pátio"] = "Fight in the yard", ["Recorrer com advogado"] = "Appeal with a lawyer", ["Pedir liberdade condicional"] = "Request parole", ["Tentar fugir"] = "Try to escape",
	["Comprar"] = "Buy", ["Escolhas"] = "Choices", ["Toque no bolo para envelhecer"] = "Tap the cake to age up",
}

-- padrões com números (Lua patterns)
local PAT = {
	{ "^(%d+) anos$", "%1 years old" }, { "^(%d+) ano$", "%1 year old" }, { "^(%d+) vidas vividas$", "%1 lives lived" },
	{ "^Disponível a partir dos (%d+) anos%.$", "Available from age %1." }, { "^(%d+)%+$", "%1+" },
}

function I18n.tr(s: string, lang: string?): string
	if lang ~= "en" or type(s) ~= "string" or s == "" then
		return s
	end
	local k = string.match(s, "^%s*(.-)%s*$")
	local v = EXTRA[k] or Base[k]
	if not v then
		for _, p in PAT do
			if string.match(k, p[1]) then
				v = string.gsub(k, p[1], p[2])
				break
			end
		end
	end
	if not v then
		return s
	end
	local a, b = string.find(s, k, 1, true)
	return string.sub(s, 1, a - 1) .. v .. string.sub(s, b + 1)
end

return I18n
