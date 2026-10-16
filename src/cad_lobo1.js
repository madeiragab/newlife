// ===== Histórias em cadeia: a vida de lobisomem (1) =====
const LOBO=CRI('lobisomem');
chain('lobo_trabalho',{k:'Lobisomem',min:16,max:120,when:m=>LOBO(m)&&!!m.job,gap:[1,1]},{
 a:['Lua cheia na reunião','A reunião mais importante do ano foi marcada justo para a noite de lua cheia.',['Pedir para remarcar|?50 >b|Remarcaram para a semana seguinte.|perf-5 >c|O chefe negou.','Ir e torcer|>c|Talvez dê tempo de sair antes.']],
 b:['Escapou','Consegui fugir da lua cheia desta vez.',['Montar um calendário lunar no trabalho|sm+2 >e|Nunca mais marco nada em lua cheia.','Contar a verdade para um colega de confiança|>d|Alguém para me cobrir.']],
 c:['A transformação','No meio da reunião, senti os ossos estalando.',['Correr para o banheiro|?hl perf-8 >d|Me tranquei no banheiro e pulei pela janela.|perf-20 >f|Saí uivando pelo corredor.','Segurar até o fim|?will perf+10 hl-10 >e|Segurei. Ninguém percebeu, só o suor.|perf-20 >f|Não deu.']],
 d:['O colega','Um colega me viu saindo pela janela com os olhos amarelos.',['Pedir segredo|?k vira:amigo >e|Ele prometeu. E cumpriu.|>f|Ele contou para o escritório inteiro.','Dizer que foi um mal-estar|?40 >e|Ele acreditou.|>f|Ele não acreditou.']],
 e:['Rotina','Aprendi a organizar a vida em ciclos de vinte e oito dias.',['Trabalhar de casa na lua cheia|h+6|O chefe acha que é "home office mensal".','Pedir folga fixa na lua cheia|h+4 perf-2|"Assunto de família."']],
 f:['O vídeo','Alguém filmou. O vídeo de "funcionário vira bicho" está circulando.',['Dizer que era uma pegadinha|?50 f+2|Virou meme. Ninguém acreditou que era real.|fire h-10|Fui demitid{o} por "comportamento inadequado".','Pedir demissão|fire h-4|Saí antes do escândalo crescer.']],
});
chain('lobo_fazendeiro',{k:'Lobisomem',min:16,max:120,when:LOBO,npc:1,gn:'M',age:[10,30],gap:[1,1]},{
 a:['O gado','Na lua cheia, ataquei o gado de um sítio. O fazendeiro, seu {p}, perdeu cinco bezerros.',['Pagar o prejuízo anonimamente|$-6000 k+8 >b|Deixei um envelope na porteira.','Fingir que não foi eu|k-4 >c|Foi a fera, não eu.']],
 b:['O envelope','Seu {p} achou o envelope e ficou desconfiado. Quem pagaria por bezerros que não matou?',['Ficar quiet{o}|>d|Ele começou a vigiar a porteira toda noite.','Aparecer e conversar|>e|Bati na porta dele numa tarde de chuva.']],
 c:['A caçada','Seu {p} chamou os vizinhos para caçar "o lobo".',['Ficar longe do sítio|fome+15 >d|Na lua seguinte, me acorrentei em casa.','Voltar ao sítio|?fight >d|Escapei dos caçadores.|hl-25 >d|Levei chumbo nas costas.']],
 d:['A armadilha','Na lua seguinte, caí numa armadilha de urso no pasto.',['Arrancar a pata da armadilha|hl-20 >f|Fugi mancando. A pata vai sarar. A dor, não sei.','Esperar o amanhecer|>e|Seu {p} me achou, humano, com o pé preso.']],
 e:['O segredo do fazendeiro','Seu {p} me olhou por muito tempo e disse: "Meu avô também era assim."',['Contar tudo|vira:amigo h+8 >g|Ele me ofereceu o celeiro para as noites de lua cheia.','Fugir|>f|Corri sem olhar para trás.']],
 f:['Ferid{o}','A ferida da armadilha não fecha direito.',['Procurar um curandeiro|$-1500 hl+10|Ervas e paciência.','Deixar sarar sozinha|hl-5|Lobisomem sara rápido. Mais ou menos.']],
 g:['O celeiro','Agora, toda lua cheia, durmo no celeiro do seu {p}. Ninguém mais perde gado.',['Ajudar no sítio durante o mês|k+6 h+6|Virei parte da família da fazenda.','Pagar aluguel do celeiro|$-500 h+4|Acordo justo.']],
});
chain('lobo_alcateia_lider',{k:'Lobisomem',min:18,max:120,when:LOBO,npc:1,gap:[1,1]},{
 a:['O desafio','{p}, o líder da alcateia da região, está velho. Alguém precisa assumir.',['Me candidatar à liderança|>b|Na tradição, o desafio é na lua cheia.','Apoiar outro candidato|>e|Prefiro não liderar.']],
 b:['O duelo','Na lua cheia, o duelo pela liderança: eu contra o mais forte da alcateia.',['Lutar com tudo|?fight fight+5 f+0 >c|Venci. A alcateia baixou a cabeça para mim.|hl-30 >d|Perdi. Saí sangrando.','Desistir no meio|h-6 >e|Melhor perder o posto que a vida.']],
 c:['Líder da alcateia','Agora sou responsável por oito lobisomens e suas famílias.',['Liderar com justiça|k+8 >f|Regras claras: ninguém mata humano.','Liderar com medo|k-6 fight+3 >f|Ninguém ousa me desobedecer.']],
 d:['Derrotad{o}','O novo líder me deixou ficar na alcateia, mas abaixo de todos.',['Aceitar|h-4 >e|Paciência.','Sair da alcateia|h-6|Lobo solitário.']],
 e:['O novo líder','O novo líder começou a quebrar as regras antigas e atacar humanos.',['Desafiar de novo|>b@1|Não posso deixar isso continuar.','Avisar os caçadores|k+4 >f|Traição à alcateia, para salvar humanos.']],
 f:['A alcateia','A alcateia sobrevive e se fortalece.',['Fazer uma reunião na lua cheia|h+8|Correr junto com a família.','Treinar os jovens|fight+3 k+3|Os filhotes aprendem rápido.']],
});
chain('lobo_par',{k:'Lobisomem',min:18,max:120,when:m=>LOBO(m)&&!!partners().length,who:'partner',gap:[1,1]},{
 a:['A noite em que viu','{p} acordou no meio da noite de lua cheia e me viu me transformando no quintal.',['Correr para a floresta|>b|Não queria que {ele} me visse daquele jeito.','Ficar e deixar {ele} ver|>c|Os olhos d{ele} encontraram os meus.']],
 b:['A manhã seguinte','Voltei de manhã, cobert{o} de lama. {p} estava na cozinha, esperando.',['Contar tudo|>c|Sentei e contei desde a mordida.','Negar|?30 pbond-10|{p} fingiu acreditar.|pbond-20 >d|{p} disse: "Eu vi."']],
 c:['A reação','{p} ficou em silêncio por muito tempo.',['Esperar|?bond pbond+15 h+10 >e|{p} me abraçou: "A gente dá um jeito."|>d|{p} pediu um tempo.']],
 d:['O tempo','{p} foi para a casa de parentes.',['Esperar|?bond pbond+10 >e|{p} voltou depois de um mês.|separar h-15|{p} não voltou.','Ir buscar|?40 pbond+10 >e|{p} voltou comigo.|separar h-12|Não adiantou.']],
 e:['Juntos na lua cheia','Agora {p} prepara o porão nas noites de lua cheia e fica do lado de fora da porta, conversando.',['Agradecer|pbond+12 h+12|Ninguém nunca me amou desse jeito.','Pedir para {ele} ser mordid{o2} também|?30 morder pbond+10|{p} aceitou. Agora corremos juntos.|pbond-5|{p} disse que prefere ficar humano.']],
});
chain('lobo_prata',{k:'Lobisomem',min:16,max:120,when:LOBO,gap:[1,1]},{
 a:['A aliança de prata','Num casamento, peguei uma colher de prata. Minha mão queimou na frente de todos.',['Disfarçar dizendo que estava quente|?50 >b|Ninguém percebeu.|>c|Uma senhora ficou me olhando fixamente.','Sair da festa|h-3 >b|Melhor sair.']],
 b:['Prata em todo lugar','Comecei a perceber prata em todo lugar: brincos, talheres, maçanetas.',['Trocar tudo de casa|$-2000 >d|Nada de prata a menos de dez metros.','Usar luvas sempre|h-2 >d|"Problema de pele."']],
 c:['A senhora','A senhora do casamento me procurou depois: "Eu sei o que você é. Meu marido também era."',['Conversar com ela|vira:amigo >e|Ela me ensinou truques que só uma viúva de lobisomem sabe.','Fugir|>d|Ninguém deve saber.']],
 d:['A alergia','Uma joia de prata escondida numa roupa nova me deixou de cama.',['Ir ao médico|$-500 hl+5|"Alergia rara a metais", disse o médico.','Curar em casa|hl-8|Lobisomem se vira sozinho.']],
 e:['Os conselhos','A senhora me ensinou: chá de acônito acalma a fera, mas é veneno para humanos.',['Usar o chá|fome-30 h+4|Funciona. Com moderação.','Guardar a receita|sm+2|Para emergências.']],
});
chain('lobo_filhote',{k:'Lobisomem',min:20,max:120,when:LOBO,npc:1,age:[-30,-15],gap:[1,1]},{
 a:['O filhote perdido','Na lua cheia, encontrei um lobinho perdido na mata: uma criança lobisomem.',['Proteger até amanhecer|k+6 >b|De manhã, era um menino ou menina de dez anos, chorando.','Ignorar|k-6|Não é minha responsabilidade.']],
 b:['A criança','{p} não sabe de onde veio nem quem a mordeu. Não tem família.',['Levar para casa|vira:amigo k+8 >c|Agora tenho uma criança lobisomem em casa.','Levar para a alcateia mais próxima|k+4 >e|Eles cuidam dos seus.']],
 c:['Ensinar','{p} precisa aprender a controlar a fera antes da próxima lua.',['Ensinar com paciência|bond+12 >d|Corrente, porão e muita conversa.','Deixar livre na mata|bond-5 >e|A natureza ensina.']],
 d:['A adoção','Os papéis da adoção chegaram. {p} agora é oficialmente da família.',['Comemorar|h+15 bond+10|Primeira lua cheia em família.','Contar para os outros da família|h+8|Nem todos entenderam. Mas aceitaram.']],
 e:['O reencontro','Anos depois, {p}, já crescid{o2}, me procurou para agradecer.',['Abraçar|h+10 k+5|Uma vida salva numa noite de lua.','Perguntar como está|h+6|Lidera uma alcateia no sul. Eu ensinei bem.']],
});
