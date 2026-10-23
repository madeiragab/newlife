-- ===== Sons da versão Roblox =====
-- Os trechos são gerados por roblox/tools/sons.cjs a partir de src/sound.js (mesmas notas do jogo).
-- Os IDs são os áudios enviados ao Roblox (roblox/tools/enviar-sons.cjs). 0 = ainda não enviado: o jogo fica mudo.
return {
	ids = {
		efeitos = 101052003904820,
		musica = 137342508828445,
	},
	-- o MP3 enviado ao Roblox começa com um silêncio do codificador: os trechos andam esse tanto
	atraso = 0.026,
	-- efeito = { início, duração } em segundos dentro de efeitos.ogg
	efeitos = {
		click = { 0.4, 0.085 },
		pop = { 0.885, 0.198 },
		good = { 1.483, 0.509 },
		bad = { 2.392, 0.609 },
		cash = { 3.401, 0.41 },
		promo = { 4.211, 1.148 },
		level = { 5.759, 0.55 },
		siren = { 6.709, 2.009 },
		death = { 9.118, 2.29 },
		bells = { 11.808, 1.818 },
		baby = { 14.026, 0.564 },
		punch = { 14.991, 0.148 },
		miss = { 15.539, 0.194 },
		birthday = { 16.132, 0.85 },
		heart = { 17.383, 0.347 },
		win = { 18.13, 0.599 },
		door = { 19.129, 0.308 },
		hurt = { 19.838, 0.234 },
	},
}
