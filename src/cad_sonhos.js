// ===== Histórias em cadeia: sonhos, viagens e paixões =====
chain('restaurante',{k:'Sonhos',min:22,max:65,v:[20000,60000],gap:[1,1]},{
 a:['O curso de culinária','Me inscrevi num curso de culinária só por diversão. O chef disse que eu tenho mão boa.',['Levar a sério|sm+2 >b|Comprei facas que custaram mais que meu sofá.','Cozinhar só para os amigos|h+6 >c|Jantar em casa todo sábado.']],
 b:['O jantar teste','Um amigo sugeriu um jantar pago na minha casa, para desconhecidos.',['Fazer o jantar|?sm $+1500 h+10 >d|Doze pessoas, cinco pratos, zero desastres.|h-6 >c|Queimei o prato principal. Pizza para todos.','Achar arriscado demais|>c|Melhor não.']],
 c:['Cozinha de casa','Os amigos insistem: "Você devia abrir um restaurante."',['Pensar no assunto|>d@1|A ideia não sai da cabeça.','Manter como hobby|h+5|Cozinhar para quem eu amo já basta.']],
 d:['O ponto comercial','Encontrei um ponto pequeno numa rua movimentada.',['Abrir o restaurante|$-v >e|Mesas de madeira e um cardápio escrito à mão.','Começar com delivery|$-5000 >f|Cozinha em casa, pedidos pelo aplicativo.']],
 e:['A inauguração','Dia da inauguração. A fila dobrou a esquina.',['Cozinhar com calma|?sm $+8000 h+15 >g|Todos os pratos saíram perfeitos!|h-6 >h|A cozinha virou um caos.','Cozinhar rápido para dar conta|?40 $+6000 h+10 >g|Deu certo.|h-8 >h|Saiu tudo malpassado.']],
 f:['O delivery','O delivery cresceu tanto que a cozinha de casa ficou pequena.',['Alugar uma cozinha profissional|$-8000 $+15000 >g|Agora sou uma marca.','Manter pequeno|$+3000 h+5|Pequeno e bom.']],
 g:['O crítico','Um crítico de gastronomia apareceu sem avisar.',['Servir o prato da casa|?sm f+8 $+20000 h+15|Cinco estrelas no jornal! Fila todos os dias.|h-4|Três estrelas. Educado, mas frio.','Fazer um prato especial|?40 f+10 $+25000 h+18|Ele chamou de "a melhor surpresa do ano".|h-6|O prato especial não agradou.']],
 h:['Mês difícil','O restaurante está no vermelho há três meses.',['Mudar o cardápio|?50 $+5000 >g|Cardápio novo, clientes novos.|$-6000 h-8|Não adiantou. Fechei as portas.','Fechar e voltar ao delivery|h-6 >f|Recomeço menor.']],
});
chain('aurora_boreal',{k:'Viagem',min:25,max:80,v:[15000,30000],gap:[1,2]},{
 a:['A lista de sonhos','Na minha lista de sonhos, o primeiro item é ver a aurora boreal.',['Começar a juntar dinheiro|k+1 >b|Um cofrinho com o nome "aurora".','Achar que é caro demais|h-2 >c@3|Fica para outro dia.']],
 b:['O dinheiro guardado','Depois de muito tempo, juntei o suficiente.',['Comprar as passagens|$-v h+12 >d|Vou para o norte do mundo!','Usar o dinheiro numa emergência|h-6 >c@2|A vida tinha outros planos.']],
 c:['A vontade volta','Vi uma foto de aurora boreal na internet e lembrei do meu sonho.',['Recomeçar a juntar|>b@1|Desta vez vai.','Desistir de vez|h-3|Algumas coisas ficam só na lista.']],
 d:['O frio','Trinta graus negativos. Três noites de céu nublado.',['Esperar mais uma noite|?50 h+25 >e|O céu ficou verde, depois roxo, depois tudo junto. Chorei congelad{o}.|h-6 >e|Não apareceu. Volto sem ver.','Fazer passeio de trenó com cães|h+12 >e|Pelo menos os cachorros foram incríveis.']],
 e:['A volta','Voltei para casa com fotos e muito frio nos ossos.',['Riscar o item da lista|h+10|Próximo item: mergulhar com tartarugas.','Prometer voltar|h+5|Um dia eu vejo de novo.']],
});
chain('fotografia',{k:'Paixão',min:16,max:80,gap:[1,1]},{
 a:['Uma câmera velha','Comprei uma câmera usada e comecei a fotografar a cidade.',['Fotografar pessoas na rua|tal.art+4 >b|Rostos contam histórias.','Fotografar paisagens|tal.art+3 >b|O céu da minha cidade nunca foi tão bonito.']],
 b:['O concurso','Uma revista abriu um concurso de fotografia.',['Mandar minha melhor foto|?tal.art f+3 $+2000 h+12 >c|Ganhei! Minha foto saiu na capa.|h-3 >c|Não ganhei, mas aprendi.','Não mandar|h-1 >c@1|Insegurança.']],
 c:['Os pedidos','Amigos começaram a pedir para eu fotografar aniversários e casamentos.',['Cobrar pelos trabalhos|$+3000 tal.art+3 >d|Virou renda extra.','Fazer de graça|k+5 h+5 >d|Por amor.']],
 d:['A exposição','Uma galeria quer expor minhas fotos.',['Aceitar|?tal.art f+5 $+5000 h+15|A exposição lotou.|h+4|Pouca gente, mas os que foram amaram.','Recusar|h+0|Fotografo para mim.']],
});
chain('jardim',{k:'Paixão',min:25,max:90,gap:[1,1]},{
 a:['O jardim abandonado','O quintal está cheio de mato. Decidi fazer um jardim.',['Plantar flores|h+6 >b|Rosas, girassóis e uma orquídea teimosa.','Plantar uma horta|hl+3 >b|Alface, tomate e cebolinha.']],
 b:['A praga','Formigas atacaram tudo durante a noite.',['Usar veneno|hl-2 >c|Elas sumiram. As abelhas também.','Usar receita natural|?50 k+3 >c|Funcionou!|h-4 >c|Perdi metade das plantas.']],
 c:['O jardim floresce','Na primavera, o jardim ficou lindo.',['Abrir para os vizinhos visitarem|k+5 h+8 >d|Virei referência do bairro.','Curtir sozinh{o}|h+8 hl+2 >d|Meu refúgio.']],
 d:['O concurso de jardins','O bairro vai fazer um concurso de jardins.',['Participar|?k h+12 f+2|Primeiro lugar! Troféu com uma regadora dourada.|h+3|Segundo lugar. A vizinha roubou.','Não participar|h+2|Jardim não é competição.']],
});
chain('idioma',{k:'Estudos',min:16,max:75,npc:1,gap:[1,1]},{
 a:['Um idioma novo','Decidi aprender um idioma novo.',['Fazer aula online|$-1200 sm+3 >b|Lição diária, sem desculpa.','Aprender com filmes e músicas|sm+2 >b|Legenda primeiro, sem legenda depois.']],
 b:['A parceria de conversação','Num aplicativo, conheci {p}, que quer aprender português e me ensinar o idioma.',['Conversar toda semana|sm+4 vira:amigo >c|A gente ri dos erros um do outro.','Desistir da parceria|>c|Vergonha de falar errado.']],
 c:['A prova de proficiência','Me inscrevi numa prova internacional de proficiência.',['Fazer a prova|?sm sm+4 h+12 >d|Passei com nota alta!|h-4 >d|Faltou pouco. Ano que vem.','Desistir|h-2|Ainda não estou pront{o}.']],
 d:['Fluência','Já consigo assistir filmes sem legenda.',['Viajar para usar o idioma|$-6000 h+12|Pedi um café sem gaguejar. Vitória.','Usar no trabalho|raise+8 sm+2|O idioma me rendeu uma promoção.']],
});
chain('casa_propria',{k:'Sonhos',min:25,max:60,v:[60000,200000],gap:[1,2]},{
 a:['O sonho da casa própria','Cansei de pagar aluguel. Quero uma casa minha.',['Começar a guardar para a entrada|k+2 >b|Planilha e disciplina.','Entrar num consórcio|$-3000 >c|Parcelinha todo mês.']],
 b:['A entrada','Juntei o dinheiro da entrada.',['Financiar uma casa|casa:fin h+3 >d|As chaves na mão. Minha casa!','Comprar à vista o que der|casa:vista >d|Pequeno, mas sem dívida.']],
 c:['A contemplação','O consórcio me sorteou!',['Usar a carta de crédito|casa:fin h+3 >d|Casa nova, com as parcelas do consórcio.','Esperar mais um pouco|>b@1|Ainda não achei a casa certa.']],
 d:['A primeira reforma','A casa precisa de reforma.',['Fazer tudo de uma vez|$-15000 h+6 >e|Pó por todo lado por três meses.','Ir aos poucos|$-5000 h+4 >e|Um cômodo por ano.']],
 e:['O lar','A casa finalmente tem a minha cara.',['Fazer uma festa de inauguração|$-1500 h+12|Churrasco na laje.','Curtir o silêncio|h+10|Minha casa, minhas regras.']],
});
chain('stand_up',{k:'Paixão',min:18,max:60,gap:[1,1]},{
 a:['O microfone aberto','Um bar perto de casa tem noite de microfone aberto para comediantes.',['Me inscrever|?tal.comedy h+10 tal.comedy+4 >b|Fizeram rir até o garçom.|h-8 >b|Silêncio total. Uma tosse no fundo.','Assistir da plateia|h+5 >a@1|Um dia eu subo.']],
 b:['De novo','Voltei na semana seguinte com um texto novo.',['Falar da minha família|?tal.comedy tal.comedy+4 h+8 >c|O público se identificou.|h-4 >c|Minha mãe estava na plateia. Não gostou.','Falar de política|?40 f+2 >c|Plateia dividida, mas rindo.|h-6 >c|Vaias.']],
 c:['O convite','Um comediante famoso me chamou para abrir o show dele.',['Aceitar|?tal.comedy f+6 h+15 $+2000 >d|Quinhentas pessoas rindo. Viciante.|h-6 >d|Travei no meio, mas terminei.','Recusar por medo|h-4|O medo venceu.']],
 d:['Carreira de comediante?','Me chamaram para uma turnê pequena pelo interior.',['Ir|?tal.comedy $+10000 f+5 h+12|Rodei doze cidades. Hotel ruim, risadas boas.|$+2000 h+3|Metade das cidades lotou. A outra metade, nem tanto.','Manter como hobby|h+6|Riso de sexta-feira.']],
});
chain('trilha',{k:'Aventura',min:18,max:70,npc:1,gap:[1,1]},{
 a:['A trilha','Um grupo de trilha da cidade vai subir a serra no fim de semana.',['Ir junto|hl+4 h+6 >b|Bolhas no pé e uma vista de tirar o fôlego.','Ficar em casa|h+0|Prefiro trilha de série.']],
 b:['O grupo','No grupo, {p} sabe tudo de plantas e passarinhos.',['Andar junto de {p}|vira:amigo h+6 sm+2 >c|Aprendi o nome de vinte pássaros.','Andar no meu ritmo|hl+3 >c|Silêncio e mato.']],
 c:['O pico','O grupo vai tentar subir o pico mais alto do estado.',['Encarar|?hl hl+5 h+15 >d|Cheguei no topo! O mundo ficou pequeno.|hl-8 >d|Torci o tornozelo na descida.','Ficar no acampamento|h+4 >d|Fiz o café para todo mundo.']],
 d:['Perdidos','Na volta, o grupo se perdeu na neblina.',['Seguir o rio para baixo|?sm k+5 h+8|Achamos a estrada. Virei herói do grupo.|hl-6 h-4|Passamos a noite no mato, com frio e sem comida.','Esperar o resgate|h-3|O resgate chegou de manhã.']],
});
