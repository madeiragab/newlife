// ===== 3.3: bichos desenhados de corpo inteiro =====
// O desenho de frente fica em bichos_frente.js. Cada animal nasce com uma aparência sorteada (cor, padrão da pelagem ou das penas, olhos, tamanho, orelhas,
// cauda e detalhes da espécie/raça). O sorteio sai do id do bicho, então ele é sempre o mesmo desenho.
const BX_G=84; let BX_UID=0;
const bxRng=s=>()=>{ s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
const bxD=(c,t=.3)=>mixHex(c,'#1A1210',t), bxL=(c,t=.3)=>mixHex(c,'#FFFFFF',t);
const bxE=(cx,cy,rx,ry,x='')=>`<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${Math.max(.1,rx).toFixed(1)}" ry="${Math.max(.1,ry).toFixed(1)}"${x}/>`;
const bxC=(cx,cy,r,x='')=>bxE(cx,cy,r,r,x);
const bxP=(d,x='')=>`<path d="${d}"${x}/>`;
const OLHOS3=['#5A3A1E','#B07A2A','#4C9BE0','#5E9E48','#D9A21E','#1E1A18','#8C5A2B','#7A8C99'];

// ---------- espécies ----------
// t: q = quatro patas, a = ave, f = peixe, o = polvo, r = réptil, s = cobra, x = aracnídeo
// cores: [principal, secundária, terceira]; pads: padrões possíveis
const PEL={caramelo:['#C8843E','#F3DDB8','#7A4A22'],preto:['#2E2724','#EFE9E0','#7A4A2A'],branco:['#F4F0E8','#D9CFC0','#B8A890'],marrom:['#6B4226','#E9D2B4','#3A2416'],cinza:['#8A8C90','#EDEDED','#4A4C50'],
 dourado:['#E0A54A','#F7E3B5','#9A6424'],creme:['#E9D5B0','#FFF6E6','#B89A6A'],chocolate:['#5A3420','#C99A6B','#2E1A10'],ruivo:['#B5562A','#F2D2B0','#6A2E14'],areia:['#D7B98A','#F5E8CF','#8E6E44'],
 grafite:['#4A4D55','#C9CCD2','#26282E'],laranja:['#E0802E','#FBE2C4','#9A4A14'],azulado:['#7D8794','#DDE1E6','#4E5560'],mel:['#C99A4E','#F2E0BC','#8A5E26'],ferrugem:['#9A4A26','#E8C6A4','#5A2A14']};
const pel=(...k)=>k.map(x=>PEL[x]);
const BX_SP={
 Cachorro:{t:'q',L:44,H:24,leg:18,lw:6,hr:12,sn:[11,9],ear:['cai','pont','semi','morcego'],tail:['chicote','enrolada','fofa','curta'],cores:pel('caramelo','preto','branco','marrom','cinza','dourado','creme','chocolate','ruivo','areia'),pads:['liso','peito','manchas','malhado','sela','mascara','meias','tricolor']},
 Gato:{t:'q',L:40,H:20,leg:16,lw:5,hr:11,sn:[4,7],ear:['pont'],tail:['fina'],whisk:1,cores:pel('laranja','preto','branco','cinza','creme','marrom','azulado','grafite','areia','mel'),pads:['liso','peito','listras','malhado','pontas','meias','manchas','tricolor']},
 Coelho:{t:'q',L:34,H:24,leg:7,lw:8,hr:11,sn:[4,7],small:1,ear:['longa','caida'],tail:['pompom'],whisk:1,cores:pel('branco','cinza','marrom','creme','preto','caramelo','areia','azulado'),pads:['liso','peito','malhado','pontas','manchas','mascara']},
 Hamster:{t:'q',L:30,H:24,leg:4,lw:6,hr:12,sn:[4,7],small:1,ear:['redonda'],tail:['nenhuma'],whisk:1,cores:pel('dourado','creme','cinza','branco','caramelo','marrom','mel','areia'),pads:['liso','peito','malhado','manchas','listra']},
 'Porquinho-da-índia':{t:'q',L:40,H:24,leg:4,lw:6,hr:12,sn:[6,9],small:1,ear:['redonda'],tail:['nenhuma'],cores:pel('caramelo','branco','preto','creme','marrom','ruivo','areia','chocolate'),pads:['liso','malhado','tricolor','peito','manchas','topete']},
 Chinchila:{t:'q',L:30,H:26,leg:6,lw:6,hr:13,sn:[4,7],small:1,ear:['grande'],tail:['fofa'],whisk:1,fofo:1,cores:pel('cinza','azulado','branco','creme','grafite','preto','areia','marrom'),pads:['liso','peito','pontas','malhado','manchas']},
 Ouriço:{t:'q',L:38,H:20,leg:4,lw:6,hr:10,sn:[9,6],small:1,ear:['redonda'],tail:['nenhuma'],esp:1,cores:pel('areia','creme','marrom','cinza','branco','chocolate','mel','grafite'),pads:['liso','peito','manchas','pontas','listra']},
 Furão:{t:'q',L:56,H:15,leg:10,lw:5,hr:9,sn:[7,6],ear:['redonda'],tail:['fina'],whisk:1,cores:pel('areia','creme','chocolate','branco','grafite','marrom','mel','preto'),pads:['mascara','liso','pontas','peito','meias','sela']},
 Capivara:{t:'q',L:52,H:30,leg:12,lw:8,hr:13,sn:[12,12],ear:['redonda'],tail:['nenhuma'],cores:pel('marrom','mel','ferrugem','areia','chocolate','caramelo','cinza','grafite'),pads:['liso','peito','pontas','manchas','sela']},
 Raposa:{t:'q',L:42,H:19,leg:17,lw:5,hr:11,sn:[12,6],ear:['pont'],tail:['fofa'],cores:pel('laranja','ruivo','cinza','branco','preto','areia','ferrugem','grafite'),pads:['peito','pontas','liso','mascara','sela','meias']},
 Lobo:{t:'q',L:50,H:25,leg:21,lw:6,hr:12,sn:[13,8],ear:['pont'],tail:['fofa'],cores:pel('cinza','grafite','preto','branco','areia','marrom','azulado','creme'),pads:['sela','peito','mascara','liso','pontas','meias']},
 Tigre:{t:'q',L:56,H:26,leg:18,lw:8,hr:13,sn:[7,10],ear:['redonda'],tail:['fina'],whisk:1,cores:[['#E0802E','#FBEFE0','#2A1A12'],['#F2EFE8','#FFFFFF','#2A2A30'],['#E89A3E','#FFF3E0','#3A2410'],['#D9C08A','#FFF6E6','#6A4A2A'],['#C8682A','#F7E0C8','#1E140E'],['#B87A3A','#F2E2CA','#2A1A10'],['#EEA458','#FFF0DC','#4A2A14'],['#DDE2E8','#FFFFFF','#5A6470']],pads:['listras','listras2','listras','tigrado','listras3']},
 Leão:{t:'q',L:56,H:26,leg:18,lw:8,hr:13,sn:[8,10],ear:['redonda'],tail:['leao'],whisk:1,juba:1,cores:[['#D8A85A','#F4DFB2','#7A4A1E'],['#C99448','#EED7A8','#5A3416'],['#E6C084','#FAEBD0','#8A5A2A'],['#B98244','#E8CDA0','#4A2A12'],['#EADCC4','#FFF8EE','#A88A60'],['#CF9E5E','#F5E2BE','#3A2010'],['#D2A066','#F7E4C4','#6A3A18'],['#C4904E','#EED6AE','#2A1A10']],pads:['peito','liso','manchas','peito','liso']},
 Lhama:{t:'q',L:44,H:26,leg:26,lw:6,hr:9,sn:[9,8],ear:['lhama'],tail:['curta'],neck:26,fofo:1,hoof:1,cores:pel('branco','creme','marrom','caramelo','preto','cinza','chocolate','areia'),pads:['liso','malhado','pontas','peito','manchas','sela']},
 Cavalo:{t:'q',L:54,H:27,leg:30,lw:6,hr:9,sn:[17,10],ear:['cavalo'],tail:['crina'],neck:22,crina:1,hoof:1,cores:[['#7A4A2A','#2A1C14','#F2EDE4'],['#2E2724','#1A1412','#F2EDE4'],['#F2EFE8','#C9C2B6','#8A8278'],['#C8843E','#F3E0BE','#6A4022'],['#9A9A9E','#3A3A40','#F0F0F0'],['#B5562A','#5A2A14','#F2EDE4'],['#E9D5B0','#FFF6E6','#B89A6A'],['#5A3420','#1E1410','#F2EDE4']],pads:['liso','meias','malhado','manchas','estrela','pontas']},
 Porco:{t:'q',L:50,H:30,leg:10,lw:7,hr:13,sn:[7,10],ear:['porco'],tail:['enrolada'],porco:1,hoof:1,cores:[['#F4B8B0','#FAD4CE','#C98A82'],['#E8A096','#F6C6BE','#B8746A'],['#3A3030','#F4B8B0','#1E1818'],['#F7D6CF','#FFF0EC','#D4A49C'],['#C9885A','#E8B890','#6A4024'],['#7A5A50','#C49A8E','#3A2A26'],['#F0C8B4','#FFE6DA','#B48A76'],['#E6C2B8','#F4DCD4','#8A6A60']],pads:['liso','malhado','manchas','sela','pontas','peito']},
 Cabra:{t:'q',L:44,H:24,leg:22,lw:5,hr:10,sn:[11,8],ear:['cabra'],tail:['curta'],chifre:1,hoof:1,cores:pel('branco','marrom','preto','caramelo','cinza','creme','chocolate','ferrugem'),pads:['liso','malhado','sela','pontas','peito','manchas']},
 Macaco:{t:'q',L:34,H:26,leg:16,lw:6,hr:12,sn:[5,9],ear:['macaco'],tail:['longa'],macaco:1,cores:[['#6B4A30','#E8C8A0','#3A2616'],['#8A6A4A','#F0D8B4','#4A3420'],['#4A3A30','#D8B894','#2A1E18'],['#A07A52','#F2DCBC','#5A3E26'],['#3A2E28','#E2C2A0','#1E1814'],['#7A6050','#EED4B8','#3E2E24'],['#9A8466','#F4E2C8','#5A4A36'],['#5A4636','#DCC0A0','#2E2218']],pads:['liso','peito','pontas','mascara','manchas']},
 Calopsita:{t:'a',W:20,H:26,leg:8,bico:'curvo',crista:'calop',cauda:'longa',hr:10,cores:[['#B8B8BC','#9A9AA0','#F2D24A'],['#F4EDD8','#E8DFC4','#F6D650'],['#F4F0E6','#E0D8C8','#F7E07A'],['#8E8E94','#6E6E76','#F2C848'],['#C9C2B0','#A89E88','#F2D24A'],['#E8E0C0','#D4C89C','#F7DA5A'],['#9C9C9C','#F4F0E6','#F2D24A'],['#B0A898','#8E8676','#F7E07A']],pads:['liso','asa','pintas','barras','cabeca','peito']},
 Periquito:{t:'a',W:18,H:24,leg:7,bico:'curvo',cauda:'longa',hr:9,cores:[['#7CC44E','#2E2E2E','#F2E24A'],['#5AA8E6','#2E2E2E','#F4F4F4'],['#F2E24A','#8A8A40','#F7F0A0'],['#F4F4F4','#9AB8D0','#F4F4F4'],['#6A8AE0','#2E2E3A','#E6ECF4'],['#9ADA6A','#3A4A2A','#F4EA6A'],['#B0D8F0','#4A6A8A','#FFFFFF'],['#8AC0A0','#2E3E36','#F2E8A0']],pads:['barras','liso','asa','cabeca','pintas','peito']},
 Papagaio:{t:'a',W:22,H:30,leg:8,bico:'curvo',cauda:'curta',hr:11,cores:[['#4CAF50','#2E7D32','#F2D24A'],['#5CB85C','#3A7AD0','#E53935'],['#8BC34A','#558B2F','#FFEB3B'],['#9E9E9E','#616161','#D32F2F'],['#43A047','#1B5E20','#42A5F5'],['#66BB6A','#2E7D32','#FFB300'],['#7CB342','#33691E','#E53935'],['#4DB6AC','#00796B','#FDD835']],pads:['cabeca','asa','liso','peito','barras','pintas']},
 Arara:{t:'a',W:22,H:30,leg:8,bico:'curvo',cauda:'arara',hr:11,cores:[['#E53935','#1E88E5','#FDD835'],['#1E88E5','#FDD835','#0D47A1'],['#43A047','#E53935','#1E88E5'],['#1A237E','#3949AB','#FFEB3B'],['#D32F2F','#43A047','#1E88E5'],['#0288D1','#FFC107','#01579B'],['#C62828','#FFB300','#1565C0'],['#00897B','#1E88E5','#E53935']],pads:['asa','peito','cabeca','barras','liso']},
 Coruja:{t:'a',W:28,H:32,leg:4,bico:'coruja',coruja:1,cauda:'curta',hr:14,cores:[['#8A6A4A','#C9A882','#F2E2C4'],['#F4F0E8','#D8D0C0','#FFFFFF'],['#6E5A48','#A89078','#E8D8C0'],['#B08A5E','#D8BC94','#F6E8D0'],['#9A9A96','#C8C8C2','#F0F0EA'],['#5A4636','#8E7660','#D8C4AA'],['#C49A6A','#E8CCA4','#FFF2DC'],['#7A6A5A','#B0A08A','#EEE2CC']],pads:['pintas','barras','liso','peito','asa'],olhos:['#F2B61E','#F57C00','#1E1A18','#FFD54F']},
 Pavão:{t:'a',W:22,H:28,leg:14,bico:'reto',crista:'pavao',cauda:'leque',hr:9,cores:[['#1565C0','#2E7D32','#26A69A'],['#0D47A1','#33691E','#00ACC1'],['#F4F4F4','#E8E8E8','#FFFFFF'],['#1976D2','#558B2F','#00897B'],['#283593','#1B5E20','#26C6DA'],['#00838F','#2E7D32','#4DD0E1'],['#1E88E5','#689F38','#80CBC4'],['#3949AB','#00695C','#4DB6AC']],pads:['liso','asa','pintas','peito','cabeca']},
 Flamingo:{t:'a',W:24,H:20,leg:34,bico:'flamingo',flamingo:1,cauda:'curta',hr:7,cores:[['#F48FB1','#EC407A','#212121'],['#F8BBD0','#F06292','#212121'],['#FF8A80','#E57373','#212121'],['#FFAB91','#FF7043','#212121'],['#F7C6D0','#E091A6','#212121'],['#EF9A9A','#E53935','#212121'],['#FFCCBC','#FF8A65','#212121'],['#F48FB1','#AD1457','#212121']],pads:['liso','asa','peito','pintas','barras']},
 Pinguim:{t:'a',W:24,H:36,leg:3,bico:'reto',pinguim:1,cauda:'curta',hr:11,cores:[['#22262E','#F4F4F4','#F9A825'],['#1E2A3A','#F4F4F4','#FFB300'],['#2E2E2E','#FFFFFF','#FF7043'],['#36404E','#F0F0F0','#FDD835'],['#262A30','#EAEAEA','#F57C00'],['#3A3A44','#FAFAFA','#FFCA28'],['#1A1E24','#F2F2F2','#E65100'],['#2A3440','#F6F6F6','#FFA000']],pads:['liso','pintas','cabeca','peito','barras']},
 Galinha:{t:'a',W:26,H:24,leg:10,bico:'reto',crista:'galinha',cauda:'galinha',hr:9,cores:[['#F4EEE0','#E2D6BC','#E53935'],['#A0522D','#6A3418','#E53935'],['#2E2E2E','#1A3A2A','#E53935'],['#D2A060','#A07038','#E53935'],['#C8C0B0','#8A8070','#E53935'],['#E8C07A','#C08A40','#E53935'],['#7A4A2A','#3A2414','#E53935'],['#F2E2C0','#C8A87A','#E53935']],pads:['liso','pintas','barras','asa','cabeca','peito']},
 Pato:{t:'a',W:26,H:20,leg:6,bico:'pato',cauda:'pato',hr:9,cores:[['#F4F2EC','#E0DCD0','#F9A825'],['#8A6A4A','#5A4430','#F57C00'],['#2E7D32','#8A6A4A','#F9A825'],['#F2E08A','#E0C860','#F57C00'],['#9A9A96','#6A6A66','#F9A825'],['#5A4636','#2E5E3A','#FFB300'],['#E8E0CC','#B8A88A','#FF8F00'],['#3A3A3A','#F4F4F4','#F9A825']],pads:['liso','cabeca','asa','peito','pintas']},
 'Peixe-beta':{t:'f',L:30,H:16,beta:1,cores:[['#D32F2F','#B71C1C','#FFCDD2'],['#1E88E5','#0D47A1','#BBDEFB'],['#8E24AA','#4A148C','#E1BEE7'],['#F4F4F4','#E0E0E0','#FF8A80'],['#FDD835','#F57F17','#FFF9C4'],['#00897B','#004D40','#B2DFDB'],['#212121','#C62828','#90A4AE'],['#F06292','#AD1457','#F8BBD0'],['#3949AB','#C62828','#E8EAF6'],['#FF7043','#BF360C','#FFE0B2']],pads:['liso','degrade','pintas','marmore','borda','listras']},
 'Peixe-palhaço':{t:'f',L:30,H:18,cores:[['#FF7A1A','#FFFFFF','#1A1A1A'],['#E64A19','#FFFFFF','#1A1A1A'],['#FF9800','#FFFFFF','#3A2A1A'],['#212121','#FFFFFF','#FF6F00'],['#F57C00','#FFFFFF','#F57C00'],['#D84315','#FFF3E0','#1A1A1A'],['#FFB74D','#FFFFFF','#5D4037'],['#BF360C','#FFFFFF','#1A1A1A']],pads:['palhaco','palhaco','palhaco2','palhaco3','palhaco'],},
 Polvo:{t:'o',cores:[['#E57373','#C62828','#FFCDD2'],['#BA68C8','#7B1FA2','#F3E5F5'],['#FF8A65','#D84315','#FFE0B2'],['#F06292','#AD1457','#FCE4EC'],['#A1887F','#5D4037','#EFEBE9'],['#FFB74D','#E65100','#FFF3E0'],['#9575CD','#4527A0','#EDE7F6'],['#FFD54F','#8D6E63','#4FC3F7']],pads:['liso','pintas','aneis','listras','manchas']},
 Tartaruga:{t:'r',tart:1,cores:[['#6D8B3A','#5A3E20','#C8A860'],['#7A9A48','#3E2A16','#D8B870'],['#5A7A3A','#6A4A2A','#E0C080'],['#8A9A5A','#4A3420','#C8B078'],['#4E6A34','#2E2216','#B89A5A'],['#9AA860','#6A5030','#E8D090'],['#6A7A4A','#7A5A36','#D0B47A'],['#587040','#3A2A1A','#A88A50']],pads:['hexa','liso','raios','pintas','hexa']},
 Iguana:{t:'r',L:50,H:12,leg:8,cauda:46,crest:1,papo:1,cores:[['#6BBF4E','#4A8A34','#C8E6A0'],['#8BC34A','#558B2F','#DCEDC8'],['#4CAF50','#2E7D32','#A5D6A7'],['#FF8A50','#D84315','#FFCCBC'],['#9E9E9E','#616161','#E0E0E0'],['#4DB6AC','#00796B','#B2DFDB'],['#C0CA33','#827717','#F0F4C3'],['#7A9A60','#4A6A3A','#C8D8B0']],pads:['faixas','liso','pintas','reticulado','faixas']},
 Camaleão:{t:'r',L:34,H:16,leg:12,cauda:20,camaleao:1,cores:[['#7CB342','#33691E','#FFEB3B'],['#26A69A','#00695C','#FF7043'],['#9CCC65','#558B2F','#E1F5FE'],['#FFB74D','#E65100','#4FC3F7'],['#4FC3F7','#0277BD','#FFEB3B'],['#AED581','#689F38','#F06292'],['#66BB6A','#1B5E20','#FFCA28'],['#BA68C8','#6A1B9A','#AED581']],pads:['faixas','pintas','liso','reticulado','listras']},
 Jacaré:{t:'r',L:62,H:12,leg:7,cauda:40,jacare:1,cores:[['#5A6A3A','#3A4426','#C8C098'],['#4E5A34','#2E3420','#B8B088'],['#6A7046','#3E4428','#D0C8A0'],['#4A5040','#2A2E24','#B0AA90'],['#5E6E44','#3A4A2A','#CCC4A0'],['#3E4A30','#1E2418','#A8A080'],['#707A50','#4A5236','#D8D0A8'],['#E8E4D8','#C8C0B0','#F4F0E6']],pads:['faixas','liso','pintas','reticulado','faixas']},
 Cobra:{t:'s',cores:[['#6A8A3A','#3A4A20','#C8D090'],['#C62828','#1A1A1A','#FDD835'],['#8D6E63','#4E342E','#D7CCC8'],['#F57C00','#BF360C','#FFF3E0'],['#424242','#FDD835','#212121'],['#4CAF50','#1B5E20','#C8E6C9'],['#D7B98A','#7A5A36','#F5E8CF'],['#6D4C41','#D7CCC8','#3E2723'],['#E57373','#F5F5F5','#B71C1C'],['#90A4AE','#37474F','#ECEFF1']],pads:['losangos','aneis','coral','listra','liso','manchas']},
 Tarântula:{t:'x',aranha:1,cores:[['#2A2420','#E65100','#4A3A30'],['#3A2E26','#C8A060','#5A4636'],['#1A1A22','#1E88E5','#2E2E3A'],['#4A3020','#D84315','#6A4A30'],['#2E2E2E','#F4F4F4','#4A4A4A'],['#5A4030','#E0C090','#7A5A44'],['#222222','#8E24AA','#3A3A3A'],['#3A2A20','#FFB300','#5A4030']],pads:['joelhos','liso','listras','manchas','joelhos']},
 Escorpião:{t:'x',escorpiao:1,cores:[['#3A2A1A','#6A4A2A','#C8A060'],['#C8A060','#8A6A3A','#F0D8A0'],['#1A1A1A','#3A3A3A','#5A5A5A'],['#8A4A1E','#5A2A10','#D8A060'],['#5A4A3A','#3A2E24','#A89070'],['#D8B870','#A08040','#F4E4B0'],['#2E2A3A','#1A1824','#6A6488'],['#6A3A1E','#3A1E10','#C88A50']],pads:['liso','listras','manchas','faixas','liso']},
};
BX_SP['Macaco-prego']=BX_SP.Macaco;
const bxRaiz=sp=>String(sp||'').split('|')[0];

// raças: limitam cores e mudam o corpo
const BX_RACA={
 'Vira-lata caramelo':{cores:['caramelo','areia','mel'],pads:['liso','peito','meias']},Labrador:{cores:['preto','dourado','chocolate','creme'],pads:['liso','peito'],ear:'cai',tail:'chicote'},
 'Golden retriever':{cores:['dourado','mel','creme'],pads:['liso','peito'],ear:'cai',tail:'fofa',fofo:1},'Bulldog francês':{cores:['preto','creme','branco','cinza','caramelo'],pads:['liso','peito','malhado','mascara'],ear:'morcego',tail:'curta',L:36,H:24,leg:11,sn:[4,10]},
 Poodle:{cores:['branco','preto','creme','chocolate','cinza','caramelo'],pads:['liso'],ear:'cai',tail:'pompom',fofo:2},Pug:{cores:['creme','areia','preto'],pads:['mascara','liso'],ear:'semi',tail:'enrolada',L:34,H:22,leg:11,sn:[3,10]},
 'Shih tzu':{cores:['branco','dourado','preto','creme','cinza'],pads:['malhado','liso','mascara','peito'],ear:'cai',tail:'enrolada',L:34,H:20,leg:8,sn:[3,8],saia:1},'Husky siberiano':{cores:['cinza','grafite','preto','ruivo','branco','areia'],pads:['peito','mascara'],ear:'pont',tail:'fofa',husky:1},
 'Pastor-alemão':{cores:['caramelo','ruivo','dourado','areia'],pads:['sela'],ear:'pont',tail:'fofa',L:50,leg:20,sn:[13,8]},Dachshund:{cores:['chocolate','ruivo','preto','caramelo'],pads:['liso','tricolor','peito','manchas'],ear:'cai',tail:'chicote',L:52,H:18,leg:8,sn:[12,7]},
 Chihuahua:{cores:['creme','caramelo','preto','chocolate','branco','areia'],pads:['liso','peito','malhado','tricolor'],ear:'morcego',tail:'chicote',L:30,H:17,leg:13,hr:14.5,sn:[4,6],olhoG:1.4},'Border collie':{cores:['preto','chocolate','cinza','ruivo'],pads:['peito','malhado','tricolor'],ear:'semi',tail:'fofa'},
 Rottweiler:{cores:['preto'],pads:['rott'],ear:'semi',tail:'curta',L:52,H:30,leg:19,hr:14.5,sn:[8,12]},Yorkshire:{cores:['grafite','cinza','azulado'],pads:['tricolor'],ear:'pont',tail:'curta',L:30,H:16,leg:8,saia:1},
 'Spitz alemão':{cores:['laranja','creme','branco','preto','dourado'],pads:['liso','peito'],ear:'pont',tail:'enrolada',L:32,H:22,leg:9,sn:[5,6],fofo:2},Beagle:{cores:['caramelo','chocolate'],pads:['tricolor','malhado'],ear:'cai',tail:'chicote'},
 Pitbull:{cores:['cinza','caramelo','branco','preto','chocolate','azulado'],pads:['liso','peito','malhado'],ear:'semi',tail:'chicote',H:26,sn:[9,10]},
 'Vira-lata':{},Siamês:{cores:['creme','branco'],pads:['pontas'],olhos:[2]},Persa:{cores:['branco','cinza','creme','laranja','preto','azulado'],pads:['liso','peito','malhado'],fofo:2,sn:[2,6],tail:'fofa'},
 'Maine coon':{cores:['marrom','cinza','laranja','grafite','areia'],pads:['listras','peito'],fofo:1,L:48,H:23,tail:'fofa'},Sphynx:{cores:[['#E8B8A8','#F4D4C8','#B88878'],['#D8A898','#ECC8BC','#A87868'],['#C8B0A8','#E4D4CE','#8A7068'],['#EEC4B4','#FAE0D6','#C49484']],pads:['liso','manchas'],tail:'fina',sphynx:1},
 Ragdoll:{cores:['creme','branco'],pads:['pontas'],fofo:1,olhos:[2]},Bengal:{cores:['laranja','dourado','areia','mel'],pads:['manchas'],olhos:[3,4]},Angorá:{cores:['branco','creme','cinza'],pads:['liso'],fofo:2,tail:'fofa'},
 'Azul russo':{cores:['azulado'],pads:['liso'],olhos:[3]},'British shorthair':{cores:['azulado','cinza','creme'],pads:['liso','peito'],H:23,hr:13,olhos:[4,1]},Frajola:{cores:['preto'],pads:['malhado','peito','meias']},Laranja:{cores:['laranja','ruivo','creme'],pads:['listras','peito']},
 Jiboia:{cores:[2,6,7],pads:['losangos','manchas']},Píton:{cores:[6,2,0],pads:['manchas','losangos']},'Corn snake':{cores:[3,8],pads:['manchas','losangos']},'Cobra-rei':{cores:[1,4,8],pads:['coral','aneis']},
};

// ---------- sorteio ----------
function bxLook(p){ if(p&&p.bx) return p.bx; const sp=bxRaiz(p&&p.species), def=BX_SP[sp]; if(!def) return null;
  const rd=bxRng(hashS('bx'+(p.id??'')+sp+(p.breed||'')+(p.first||''))), pick=a=>a[Math.floor(rd()*a.length)];
  const rc=(p.breed&&BX_RACA[p.breed])||{};
  let cores=def.cores; if(rc.cores) cores=rc.cores.map(c=>typeof c==='string'?PEL[c]:typeof c==='number'?def.cores[c]:c);
  const cor=pick(cores), pad=pick(rc.pads||def.pads), olhosL=def.olhos||OLHOS3, olho=rc.olhos?OLHOS3[pick(rc.olhos)]:pick(olhosL);
  const tom=(rd()-.5)*.24, c=cor.map(x=>tom>0?bxL(x,tom):bxD(x,-tom));
  // forma do corpo também varia dentro da mesma espécie: cabeça, focinho, olhos, pelo, porte e marcas extras
  const pelo=rc.fofo!=null?rc.fofo:def.fofo!=null?def.fofo:rd()<.3?(rd()<.4?2:1):0, marcas={};
  if(def.t==='q') ['testa','sobr','orelhaE','queixo','rabo','bochecha'].forEach(k=>{ if(rd()<.22) marcas[k]=1; });
  return {c, pad, olho, tam:.88+rd()*.24, gord:.85+rd()*.32, hs:.9+rd()*.2, ms:.8+rd()*.45, es:.85+rd()*.3, earS:.8+rd()*.4, pelo, marcas,
    ear:rc.ear||pick(def.ear||['pont']), tail:rc.tail||pick(def.tail||['curta']), seed:Math.floor(rd()*1e9), rc}; }

// ---------- raros ----------
// cães, gatos e bichos comuns ficam fáceis; o resto é raro: muito caro na loja ou num evento bem raro
const BX_COMUNS=new Set(['Cachorro','Gato','Coelho','Hamster','Porquinho-da-índia','Calopsita','Periquito','Peixe-beta','Galinha','Pato']);
const bxRaro=sp=>!BX_COMUNS.has(bxRaiz(sp&&sp.s||sp));
PET_SPECIES.forEach(x=>{ if(bxRaro(x)){ x.raro=1; x.cost=Math.max(30000,Math.round(x.cost*8/1000)*1000); } });
adoptPet=(o=>function(kind,sp,breed){ if(kind==='abrigo'&&!sp) sp=R.pick(PET_SPECIES.filter(x=>!x.raro&&!x.ex&&x.grp!=='Fazenda'&&x.grp!=='Aquáticos')); return o.call(this,kind,sp,breed); })(adoptPet);
V.pets=(o=>function(){ const r=o.apply(this,arguments); try{ const it=r.items, raros=[], resto=[]; let sec=null;
  for(const x of it){ if(x.sec){ sec=x; continue; } const sp=PET_SPECIES.find(p=>x.l===g(p.s,'M')); if(sp&&sp.raro){ x.s='💎 Raro · '+x.s; raros.push(x); } else { if(sec){ resto.push(sec); sec=null; } resto.push(x); } }
  r.items=resto.concat(raros.length?[{sec:'💎 Raros (só com muito dinheiro)'}].concat(raros):[]); }catch(e){} return r; })(V.pets);
const bxArt=n=>/a$/.test(n)?['uma','a']:['um','o'];
EVENTS.bicho_raro={when:m=>m.alive&&m.age>=10&&!m.prison&&!S.scen,
  show:d=>{ const sp=PET_SPECIES.find(x=>x.s===d.sp)||PET_SPECIES.find(x=>x.raro); d.sp=sp.s; const n=g(sp.s,'M').toLowerCase(), [um,o]=bxArt(n); if(d.cena==null) d.cena=R.int(0,3);
    const x=[`Um circo fechou na cidade e o dono procura um lar para ${o} ${n}. Ele não quer dinheiro, só alguém que cuide direito.`,`Achei ${um} ${n} machucad${o} perto de casa. Ninguém da vizinhança sabe de onde veio.`,`Uma colecionadora de animais raros vai se mudar para o exterior e me ofereceu ${o} ${n} dela.`,`A polícia ambiental resgatou ${um} ${n} de contrabando e procura alguém para cuidar.`][d.cena];
    return {k:'Bicho raro',t:`${um[0].toUpperCase()+um.slice(1)} ${n}!`,x:x+(sp.dng?' É um animal perigoso.':'')+' Uma chance dessas quase nunca aparece.',ch:[['Ficar com ele','sim'],['Deixar para outra pessoa','nao']]}; },
  pick:(k,d)=>{ if(k!=='sim') return 'Preferi não ficar. Talvez nunca mais apareça uma chance assim.'; const p=addPet(bxRaiz(d.sp)); st('happy',10); S.me.c.exotic=(S.me.c.exotic||0)+1; return `Agora ${p.first} mora comigo. Pouca gente no mundo tem um bicho assim.`; }};
ageUp=(o=>function(){ const r=o.apply(this,arguments); try{ const m=S&&S.me; if(m&&m.alive&&m.age>=10&&!m.prison&&!S.scen&&R.chance(.004)) queue('bicho_raro',{sp:R.pick(PET_SPECIES.filter(x=>x.raro)).s}); }catch(e){} return r; })(ageUp);

// ícone redondo (lista de pessoas, cabeçalho) e loja
const faceSVG_bx=faceSVG;
faceSVG=function(p,size=44,over){ if(p&&(p.rel==='pet'||p.species)&&BX_SP[bxRaiz(p.species)]){ if(size>=80){ const big=bichoSVG(p,{w:150}); if(big) return `<div class="bicho-modal">${big}</div>`; } const sv=bichoSVG(p,{w:size*1.5}); if(sv){ const h=hashS(bxRaiz(p.species)+(p.breed||''))%360;
   return `<svg class="face bicho-face" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><circle cx="50" cy="50" r="50" fill="hsl(${h} 60% 88%)"/><svg x="4" y="6" width="92" height="92" viewBox="0 0 100 100">${sv.replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg></svg>`; } }
  return faceSVG_bx.apply(this,arguments); };
const petIcon_bx=petIcon;
petIcon=function(sp,breed,size){ const base=bxRaiz(sp.s||sp); if(!BX_SP[base]) return petIcon_bx.apply(this,arguments);
  const fake={id:'loja'+base+(breed||''),species:base,breed,age:3,gender:'M'}; return `<span class="tile bicho-tile" style="--h:${hashS(base+(breed||''))%360}">${bichoSVG(fake,{w:size?size*1.5:52})}</span>`; };
// ficha do bicho: desenho grande de corpo inteiro
V.person=(o=>function(p){ const r=o.apply(this,arguments); try{ if(r&&r.items&&p&&p.rel==='pet'&&r.items[0]&&r.items[0].html&&BX_SP[bxRaiz(p.species)]){
  r.items[0].html=r.items[0].html.replace(/<div class="hero">[\s\S]*?<div>/,`<div class="hero bicho-hero"><span class="bicho-grande">${bichoSVG(p,{w:180})}</span><div>`)+''; } }catch(e){} return r; })(V.person);

function bichosSelfTest(){ const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); };
  for(const ps of PET_SPECIES){ const sp=bxRaiz(ps.s), def=BX_SP[sp]; ok(def,'espécie sem desenho: '+sp); if(!def) continue;
    const varia=def.cores.length*def.pads.length*(def.olhos||OLHOS3).length*((def.ear||[1]).length)*((def.tail||[1]).length); ok(varia>=40,'poucas variações: '+sp+' '+varia);
    const vistos=new Set(); for(let i=0;i<60;i++){ const s=bichoSVG({id:i,species:ps.s,first:'T'+i,age:3,gender:i%2?'F':'M',breed:ps.br?ps.br[i%ps.br.length]:null}); ok(s&&s.length>300&&!/NaN|undefined/.test(s),'desenho quebrado: '+sp+' '+i); vistos.add(s.replace(/bx\d+/g,'')); }
    ok(vistos.size>=40,'desenhos repetidos: '+sp+' '+vistos.size); }
  ok(PET_SPECIES.filter(x=>x.raro).every(x=>x.cost>=30000),'raro barato'); ok(EVENTS.bicho_raro,'sem evento de bicho raro');
  if(erros.length) throw Error('Bichos 3.3 · '+erros.slice(0,6).join(' | ')); return {ok:true,especies:PET_SPECIES.length}; }
