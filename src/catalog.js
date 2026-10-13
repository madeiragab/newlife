// ===== Catálogo: carros (marcas fictícias), luxo e animais =====
// cat: categoria · v: preço novo · ic: ícone
const CAR_MODELS=[
 // populares
 {b:'Sabiá',m:'Mini 1.0',cat:'Popular',v:42000,ic:'🚗'},{b:'Sabiá',m:'Pica-Pau',cat:'Popular',v:52000,ic:'🚗'},{b:'Toyoshi',m:'Kei',cat:'Popular',v:48000,ic:'🚗'},
 {b:'Volkara',m:'Besouro',cat:'Popular',v:39000,ic:'🚗'},{b:'Novena',m:'City',cat:'Popular',v:58000,ic:'🚗'},{b:'Hanzo',m:'Dot',cat:'Popular',v:46000,ic:'🚗'},
 // sedãs
 {b:'Toyoshi',m:'Aurora',cat:'Sedã',v:115000,ic:'🚘'},{b:'Novena',m:'Prima',cat:'Sedã',v:98000,ic:'🚘'},{b:'Astrex',m:'Executive',cat:'Sedã',v:185000,ic:'🚘'},
 {b:'Mercurio',m:'Prestige',cat:'Sedã',v:620000,ic:'🚘'},{b:'Aurion',m:'Imperial',cat:'Sedã',v:540000,ic:'🚘'},
 // SUVs e picapes
 {b:'Hanzo',m:'Trail',cat:'SUV',v:140000,ic:'🚙'},{b:'Volkara',m:'Tigrão',cat:'SUV',v:180000,ic:'🚙'},{b:'Astrex',m:'Cordilheira',cat:'SUV',v:480000,ic:'🚙'},
 {b:'Rangeira',m:'Sertão 4x4',cat:'Picape',v:230000,ic:'🛻'},{b:'Toyoshi',m:'Montanha',cat:'Picape',v:260000,ic:'🛻'},{b:'Novena',m:'Caatinga',cat:'Picape',v:110000,ic:'🛻'},
 // elétricos
 {b:'Voltana',m:'Faísca',cat:'Elétrico',v:320000,ic:'🔋'},{b:'Voltana',m:'Trovão',cat:'Elétrico',v:520000,ic:'🔋'},{b:'Lumina',m:'Folha',cat:'Elétrico',v:180000,ic:'🔋'},
 // esportivos
 {b:'Corvane',m:'GT',cat:'Esportivo',v:520000,ic:'🏎️'},{b:'Kessler',m:'Turbo R',cat:'Esportivo',v:1100000,ic:'🏎️'},{b:'Raptora',m:'V8 Fúria',cat:'Esportivo',v:480000,ic:'🏎️'},
 {b:'Astrex',m:'Pista RS',cat:'Esportivo',v:760000,ic:'🏎️'},
 // superesportivos
 {b:'Stallio',m:'Fulmine',cat:'Superesportivo',v:3800000,ic:'🏎️'},{b:'Vellano',m:'Toro',cat:'Superesportivo',v:4200000,ic:'🏎️'},{b:'Aurelle',m:'Hyperion',cat:'Superesportivo',v:18000000,ic:'🏎️'},
 {b:'Brixton',m:'Volt GT',cat:'Superesportivo',v:6500000,ic:'🏎️'},
 // clássicos e luxo
 {b:'Volkara',m:'Furgão 1975',cat:'Clássico',v:90000,ic:'🚐',classic:1},{b:'Raptora',m:'Clássico 1967',cat:'Clássico',v:650000,ic:'🚗',classic:1},{b:'Regalia',m:'Fantasma',cat:'Luxo',v:5200000,ic:'🚘'},
 {b:'Windsor',m:'Continente',cat:'Luxo',v:2400000,ic:'🚘'},{b:'Mercurio',m:'Limusine Presidencial',cat:'Luxo',v:2800000,ic:'🚐'},
 // conversíveis
 {b:'Kazuma',m:'Roadster',cat:'Conversível',v:280000,ic:'🚗'},{b:'Mercurio',m:'Riviera Cabrio',cat:'Conversível',v:950000,ic:'🚗'},
 // motos e outros
 {b:'Hanzo',m:'Pop 110',cat:'Moto',v:12000,ic:'🛵'},{b:'Hanzo',m:'Ronin 500',cat:'Moto',v:38000,ic:'🏍️'},{b:'Ironhorse',m:'Estrada Livre',cat:'Moto',v:140000,ic:'🏍️'},
 {b:'Velocci',m:'Pantera',cat:'Moto',v:180000,ic:'🏍️'},{b:'Pedala',m:'Urbana',cat:'Bicicleta',v:4500,ic:'🚲'},{b:'Trailer',m:'Motorhome Família',cat:'Motorhome',v:650000,ic:'🚌'},
];
const LUX_ITEMS=[
 {t:'Videogame de última geração',v:4500,h:3,ic:'🎮',cat:'Eletrônicos'},{t:'Notebook gamer',v:12000,h:3,ic:'💻',cat:'Eletrônicos'},{t:'Celular dobrável',v:14000,h:3,ic:'📱',cat:'Eletrônicos'},
 {t:'TV de 85 polegadas',v:22000,h:3,ic:'📺',cat:'Eletrônicos'},{t:'Drone profissional',v:9000,h:3,ic:'🛸',cat:'Eletrônicos'},
 {t:'Guitarra elétrica',v:6000,h:2,ic:'🎸',cat:'Instrumentos',tal:'musical'},{t:'Violino de luthier',v:35000,h:3,ic:'🎻',cat:'Instrumentos',tal:'musical'},{t:'Bateria completa',v:15000,h:3,ic:'🥁',cat:'Instrumentos',tal:'musical'},
 {t:'Piano de cauda',v:180000,h:4,ic:'🎹',cat:'Instrumentos',tal:'musical'},{t:'Saxofone dourado',v:22000,h:3,ic:'🎷',cat:'Instrumentos',tal:'musical'},
 {t:'Relógio Lumière Chrono',v:45000,h:4,ic:'⌚',cat:'Joias e relógios'},{t:'Relógio Monarca Perpetual',v:320000,h:6,ic:'⌚',cat:'Joias e relógios'},{t:'Anel de diamante',v:28000,h:4,ic:'💍',cat:'Joias e relógios'},
 {t:'Colar de pérolas',v:18000,h:3,ic:'📿',cat:'Joias e relógios'},{t:'Tiara de safiras',v:450000,h:6,ic:'👑',cat:'Joias e relógios'},{t:'Brincos de esmeralda',v:60000,h:4,ic:'💎',cat:'Joias e relógios'},
 {t:'Bolsa de grife',v:32000,h:4,ic:'👜',cat:'Moda'},{t:'Tênis de edição limitada',v:9000,h:3,ic:'👟',cat:'Moda'},{t:'Casaco de alta-costura',v:55000,h:4,ic:'🧥',cat:'Moda'},
 {t:'Quadro de artista famoso',v:900000,h:5,ic:'🖼️',cat:'Arte'},{t:'Escultura de bronze',v:250000,h:4,ic:'🗿',cat:'Arte'},{t:'Vaso da dinastia Ming',v:2500000,h:5,ic:'🏺',cat:'Arte'},
 {t:'Lancha Marisco 30 pés',v:450000,h:8,ic:'🚤',cat:'Veículos de luxo'},{t:'Iate Oceania 80 pés',v:12000000,h:12,ic:'🛥️',cat:'Veículos de luxo'},{t:'Megaiate Poseidon',v:95000000,h:16,ic:'🛳️',cat:'Veículos de luxo'},
 {t:'Helicóptero Colibri',v:6500000,h:10,ic:'🚁',cat:'Veículos de luxo'},{t:'Jatinho Aerion X7',v:38000000,h:14,ic:'🛩️',cat:'Veículos de luxo'},
 {t:'Cavalo puro-sangue',v:400000,h:6,ic:'🐎',cat:'Extravagâncias'},{t:'Ilha particular no Caribe',v:60000000,h:15,ic:'🏝️',cat:'Extravagâncias'},{t:'Viagem ao espaço',v:250000000,h:20,ic:'🚀',cat:'Extravagâncias'},
];
// animais: s = espécie (masc|fem), br = raças, life = expectativa, cost = preço no criador, ex = exótico, dng = perigo, ic = ícone
const PET_SPECIES=[
 {s:'Cachorro|Cadela',ic:'🐕',life:[10,16],cost:1500,grp:'Cães',br:['Vira-lata caramelo','Labrador','Golden retriever','Bulldog francês','Poodle','Pug','Shih tzu','Husky siberiano','Pastor-alemão','Dachshund','Chihuahua','Border collie','Rottweiler','Yorkshire','Spitz alemão','Beagle','Pitbull','Dálmata','São-bernardo','Corgi']},
 {s:'Gato|Gata',ic:'🐈',life:[12,20],cost:1200,grp:'Gatos',br:['Vira-lata','Siamês','Persa','Maine coon','Sphynx','Ragdoll','Bengal','Angorá','Azul russo','British shorthair','Frajola','Laranja']},
 {s:'Coelho|Coelha',ic:'🐇',life:[6,10],cost:150,grp:'Pequenos'},{s:'Hamster',ic:'🐹',life:[2,3],cost:60,grp:'Pequenos'},{s:'Porquinho-da-índia',ic:'🐹',life:[5,8],cost:120,grp:'Pequenos'},
 {s:'Chinchila',ic:'🐭',life:[10,15],cost:900,grp:'Pequenos'},{s:'Ouriço',ic:'🦔',life:[4,6],cost:1800,grp:'Pequenos',ex:1},{s:'Furão',ic:'🦦',life:[6,10],cost:2000,grp:'Pequenos',ex:1},
 {s:'Calopsita',ic:'🐦',life:[15,22],cost:300,grp:'Aves'},{s:'Periquito',ic:'🐦',life:[5,10],cost:80,grp:'Aves'},{s:'Papagaio',ic:'🦜',life:[30,60],cost:4000,grp:'Aves',ex:1},
 {s:'Arara',ic:'🦜',life:[40,60],cost:15000,grp:'Aves',ex:1},{s:'Coruja',ic:'🦉',life:[10,20],cost:8000,grp:'Aves',ex:1},{s:'Pavão|Pavoa',ic:'🦚',life:[15,20],cost:6000,grp:'Aves',ex:1},
 {s:'Flamingo',ic:'🦩',life:[20,30],cost:20000,grp:'Aves',ex:1},{s:'Pinguim',ic:'🐧',life:[15,20],cost:60000,grp:'Aves',ex:1,dng:.05},
 {s:'Peixe-beta',ic:'🐟',life:[2,5],cost:40,grp:'Aquáticos'},{s:'Peixe-palhaço',ic:'🐠',life:[5,8],cost:200,grp:'Aquáticos'},{s:'Polvo',ic:'🐙',life:[1,3],cost:3000,grp:'Aquáticos',ex:1},
 {s:'Tartaruga',ic:'🐢',life:[40,90],cost:800,grp:'Répteis'},{s:'Iguana',ic:'🦎',life:[12,18],cost:1500,grp:'Répteis',ex:1},{s:'Camaleão',ic:'🦎',life:[5,8],cost:2500,grp:'Répteis',ex:1},
 {s:'Cobra',ic:'🐍',life:[15,25],cost:2500,grp:'Répteis',ex:1,dng:.06,br:['Jiboia','Píton','Corn snake','Cobra-rei']},{s:'Jacaré',ic:'🐊',life:[30,50],cost:30000,grp:'Répteis',ex:1,dng:.15},
 {s:'Tarântula',ic:'🕷️',life:[10,20],cost:600,grp:'Exóticos',ex:1,dng:.03},{s:'Escorpião',ic:'🦂',life:[3,6],cost:400,grp:'Exóticos',ex:1,dng:.08},
 {s:'Macaco-prego|Macaca-prego',ic:'🐒',life:[30,40],cost:25000,grp:'Exóticos',ex:1,dng:.06},{s:'Capivara',ic:'🦫',life:[8,12],cost:5000,grp:'Exóticos',ex:1},
 {s:'Raposa',ic:'🦊',life:[10,14],cost:12000,grp:'Exóticos',ex:1,dng:.03},{s:'Lobo|Loba',ic:'🐺',life:[12,16],cost:40000,grp:'Exóticos',ex:1,dng:.1},
 {s:'Tigre|Tigresa',ic:'🐅',life:[15,20],cost:250000,grp:'Exóticos',ex:1,dng:.2},{s:'Leão|Leoa',ic:'🦁',life:[12,16],cost:300000,grp:'Exóticos',ex:1,dng:.22},
 {s:'Lhama',ic:'🦙',life:[15,22],cost:12000,grp:'Fazenda',ex:1},{s:'Cavalo|Égua',ic:'🐴',life:[25,32],cost:15000,grp:'Fazenda'},{s:'Porco|Porca',ic:'🐖',life:[12,18],cost:900,grp:'Fazenda'},
 {s:'Cabra|Bode',ic:'🐐',life:[12,16],cost:700,grp:'Fazenda'},{s:'Galinha|Galo',ic:'🐔',life:[5,10],cost:60,grp:'Fazenda'},{s:'Pato|Pata',ic:'🦆',life:[8,12],cost:100,grp:'Fazenda'},
];
const petDef=p=>PET_SPECIES.find(x=>x.s===p.species)||PET_SPECIES.find(x=>x.s.split('|')[0]===String(p.species).split('|')[0])||{ic:'🐾',life:[8,14]};
const PET_NAMES_EXTRA=['Mingau','Paçoquinha','Nego','Baleia','Sheik','Princesa','Duquesa','Faísca','Trovão','Pirata','Toddy','Nescau','Brisa','Pipoca','Jujuba','Rabito','Fofura','Bartolomeu','Godofredo','Margarida','Docinho','Snoopy','Lua','Sol','Tigrinho','Paçoca','Bóris','Chiquinha','Mel','Tufão','Fiona','Simba','Nala','Kong','Rocky','Bento','Feijão','Café','Canela','Gengibre'];
