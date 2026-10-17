// ===== Histórias em cadeia: dinheiro, negócios e encrencas =====
chain('food_truck',{k:'Negócios',min:20,max:60,v:[15000,40000],gap:[1,1]},{
 a:['O food truck','Vi um food truck usado à venda e tive uma ideia: vender {comida} na porta das festas.',['Comprar o food truck|$-v >b|Pintei com as cores que eu sempre quis.','Alugar um por um mês para testar|$-3000 >b|Teste antes de apostar.','Desistir|h-1|Fica o sonho.']],
 b:['A fiscalização','A fiscalização da prefeitura apareceu no primeiro fim de semana.',['Mostrar os papéis em dia|?55 >c|Tudo certo. Pode vender.|$-2000 >c|Faltava um alvará. Multa.','Oferecer um "cafezinho" ao fiscal|k-8 ?50 >c|Ele aceitou.|arrest:corrupção_ativa:0:2|Ele era honesto.']],
 c:['A primeira noite cheia','Uma festa enorme no bairro. Fila na porta do food truck.',['Dar conta da fila sozinh{o}|?hl $+3000 h+10 >d|Vendi tudo em três horas!|hl-6 $+1500 >d|Queimei a mão, mas vendi metade.','Chamar um amigo para ajudar|$+2500 h+8 >d|Dividimos o lucro e as risadas.']],
 d:['O concorrente','Um food truck de hambúrguer estacionou do lado do meu, com preço mais baixo.',['Baixar o preço também|$-1000 >e|Guerra de preços.','Melhorar a qualidade|$-800 sm+2 >f|Ingredientes melhores, clientes fiéis.','Propor uma parceria|?k >f|Combo: o dele mais o meu. Todo mundo ganhou.|>e|Ele riu da minha cara.']],
 e:['Mês ruim','O dinheiro está curto e o caminhão precisa de conserto.',['Vender o food truck|$+10000 h-6|Foi bom enquanto durou.','Aguentar mais um pouco|?40 >f|O movimento voltou!|$-4000 h-6|Afundei mais.']],
 f:['Clientes fiéis','O food truck ficou famoso no bairro. Tem gente que atravessa a cidade para comer.',['Abrir uma loja fixa|$-20000 ?55 $+40000 h+12 f+3 >g|A loja lotou na inauguração.|h-8|A loja não pegou. Voltei para o caminhão.','Comprar um segundo food truck|$-15000 $+25000 h+8 >g|Agora são dois!']],
 g:['Empresári{o}','Hoje tenho funcionários, fornecedores e um contador.',['Pensar em franquia|?sm $+80000 f+5 h+10|Virou franquia em três cidades!|$+10000|Continuo crescendo devagar.','Manter do tamanho que está|h+8|Não preciso de mais. Tenho paz.']],
});
chain('agiota',{k:'Encrenca',min:18,max:65,v:[3000,15000],when:m=>m.money<5000,gap:[1,1]},{
 a:['Dinheiro rápido','Um conhecido apresentou um homem que empresta dinheiro "sem burocracia".',['Pegar {v} emprestados|$+v >b|Juros de 20% ao mês. "Tranquilo", ele disse.','Recusar|k+2|Sei como essas histórias terminam.']],
 b:['O primeiro vencimento','O agiota mandou mensagem lembrando do pagamento. Com uma foto da minha casa.',['Pagar os juros|$-2000 >c|Paguei só os juros. A dívida continua.','Pagar tudo de uma vez|?40 $-v2 k+2|Consegui juntar e quitei. Nunca mais.|>c|Não tenho o dinheiro.']],
 c:['A visita','Dois homens apareceram na minha porta "só para conversar".',['Prometer pagar em uma semana|h-8 >d|Eles sorriram. Não foi um sorriso bom.','Ir à polícia|>e|Contei tudo para um delegado.','Fugir para a casa de parentes|h-10 >d|Me escondi por um mês.']],
 d:['O prazo','O prazo acabou.',['Vender o que tenho para pagar|$-v2 h-6 >f|Fiquei sem carro, sem televisão, mas livre.','Pedir ajuda à família|?50 h-3 >f|Minha família pagou. Vergonha eterna.|hl-20 h-15 >f|Ninguém pôde ajudar. Me pegaram na saída do trabalho.']],
 e:['A operação','A polícia prendeu o agiota numa operação. Minha dívida virou prova num processo.',['Depor contra ele|k+6 h+6 >f|Meu depoimento ajudou a prender a quadrilha.','Ficar quiet{o} com medo|h+2 >f|Pelo menos a dívida sumiu.']],
 f:['Nunca mais','Aprendi da pior forma que dinheiro fácil sai caro.',['Fazer uma reserva de emergência|$+1000 sm+3|Todo mês, um pouquinho guardado.','Contar a história para alguém que precisa ouvir|k+5|Livrei um amigo de cair no mesmo golpe.']],
});
chain('carteira_achada',{k:'Dilema',min:12,max:80,v:[500,5000],gap:[1,1]},{
 a:['A carteira','Achei uma carteira na calçada com {v} em dinheiro e os documentos de alguém.',['Devolver tudo|k+10 >b|Procurei o endereço nos documentos.','Ficar com o dinheiro e devolver os documentos|k-6 $+v >c|Deixei a carteira numa caixa de correio.','Ficar com tudo|k-12 $+v >d|Ninguém vai saber.']],
 b:['O dono','O dono da carteira era um senhor que ia pagar a cirurgia da esposa com aquele dinheiro.',['Recusar recompensa|k+8 h+10 >e|Ele me abraçou chorando.','Aceitar uma recompensa|$+500 h+6 >e|Ele insistiu.']],
 c:['A consciência','Não consigo parar de pensar no dono daquela carteira.',['Procurar e devolver o dinheiro|k+8 $-v >b|Antes tarde do que nunca.','Gastar logo para esquecer|h-4|Não esqueci.']],
 d:['A câmera','Uma câmera de segurança gravou quando eu peguei a carteira.',['Devolver antes que me achem|k+3 $-v >b|Disse que ia devolver. Meio verdade.','Torcer para não me acharem|?50 h-4|Não me acharam.|arrest:furto:0:1 k-5|A polícia bateu na minha porta.']],
 e:['Boa ação','Uma boa ação puxou outra.',['Contar a história nas redes|f+3 h+4|Virou notícia: "Pessoa honesta devolve carteira".','Guardar para mim|k+3 h+5|Não precisa de plateia.']],
});
chain('loteria',{k:'Sorte',min:18,max:85,gap:[1,1]},{
 a:['O bilhete da semana','Comecei a apostar na loteria toda semana, sempre nos mesmos números.',['Apostar pouco|$-100 >b|Só para sonhar.','Apostar muito|$-1000 add.jogo+6 >c|Quanto mais aposta, mais chance. Certo?']],
 b:['Quase','Acertei quatro números. Ganhei um pouquinho.',['Comemorar com uma pizza|$+800 h+6 >d@1-3|Pizza paga pela sorte.','Apostar tudo de novo|$-800 add.jogo+4 >c|Agora vai!']],
 c:['O vício','A aposta virou obrigação. Escondo os recibos da família.',['Parar de vez|?will h+4 >d|Rasguei os bilhetes. Liberdade.|add.jogo+8 $-3000 >e|Não consegui parar.','Diminuir|add.jogo-5 >d|Uma aposta por mês.']],
 d:['Os números de sempre','Continuei jogando os mesmos números por anos, por superstição.',['Conferir o resultado|?3 $+500000 h+30 f+5|ACERTEI TUDO! Fiquei milionári{o}!|h+0|Nada de novo. Mas um dia...','Esquecer de apostar justo hoje|h-4|E se fosse hoje?']],
 e:['Fundo do poço','Perdi um dinheiro que não tinha.',['Procurar ajuda para o vício|$-2000 add.jogo-30 h+6|Grupo de apoio toda quinta. Funciona.','Esconder da família|h-10 add.jogo+5|A mentira pesa.']],
});
chain('piramide',{k:'Dinheiro',min:20,max:75,who:'friend',v:[3000,20000],gap:[1,1]},{
 a:['A oportunidade de ouro','{p} me apresentou uma "oportunidade de negócio": é só colocar dinheiro e chamar mais gente.',['Entrar com {v}|$-v >b|{p} disse que em seis meses eu estaria ric{o}.','Perguntar como o dinheiro é gerado|sm+2 >e|{p} não soube explicar.','Recusar|bond-3|Pirâmide tem nome.']],
 b:['Os primeiros ganhos','Recebi meus primeiros "lucros". Me pediram para chamar amigos.',['Chamar a família|k-6 >c|Minha tia entrou com as economias dela.','Não chamar ninguém|>c|Fico só eu.','Sacar tudo agora|?50 $+v >e|Saí no lucro.|>c|O saque está "bloqueado temporariamente".']],
 c:['O colapso','A empresa sumiu. Milhares de pessoas perderam dinheiro.',['Juntar as vítimas num processo|>d|Somos muitos.','Culpar {p}|bond-20 h-6 >d|{p} também perdeu tudo.']],
 d:['As consequências','Minha família me olha diferente agora.',['Devolver o dinheiro da minha tia|$-v k+8|Demorei dois anos, mas devolvi.','Pedir desculpas|k+3 h-4|Ela me perdoou. Eu ainda não me perdoei.']],
 e:['Escapei','Saí antes do desastre.',['Avisar {p} para sair também|k+5 bond+6|{p} saiu a tempo, graças a mim.','Ficar quiet{o}|k-3|Cada um com suas escolhas.']],
});
chain('testemunha',{k:'Crime',min:16,max:80,gap:[1,1]},{
 a:['O assalto','Vi um assalto violento a uma farmácia. Vi o rosto do assaltante.',['Ligar para a polícia|k+5 >b|Dei a descrição completa.','Ir embora sem dizer nada|k-4 >e@1|Não quero problema.']],
 b:['O reconhecimento','A polícia me chamou para reconhecer o suspeito.',['Reconhecer|k+5 >c|Era ele. Tenho certeza.','Dizer que não tenho certeza|>e|Fiquei com medo.']],
 c:['As ameaças','Recebi um bilhete na caixa de correio: "Esquece o que viu".',['Contar à polícia|>d|Me colocaram no programa de proteção.','Retirar o depoimento|k-6 h-4 >e|Não tenho coragem.']],
 d:['O julgamento','No tribunal, olhei o assaltante nos olhos e contei tudo.',['Depor com firmeza|k+8 f+2 h+6|Ele foi condenado. A farmacêutica me agradeceu.','Tremer, mas depor|k+6 h+3|Fiz o certo, mesmo com medo.']],
 e:['A culpa','Soube que o mesmo assaltante atacou de novo.',['Procurar a polícia agora|k+6 >d|Antes tarde.','Tentar esquecer|h-6 k-2|Não esqueci.']],
});
chain('heranca_tio',{k:'Família',min:22,max:75,v:[50000,300000],gap:[1,1]},{
 a:['O advogado','Um advogado me ligou: um tio-avô que eu mal conhecia me deixou uma herança.',['Ir ao escritório|>b|Achei que era golpe até ver o papel timbrado.','Achar que é golpe e desligar|>c@1|Ele ligou de novo.']],
 b:['O testamento','O testamento me deixa uma casa no interior, cheia de coisas antigas.',['Visitar a casa|>d|A casa tem cheiro de passado.','Vender sem ver|$+v h+8|Dinheiro na conta.']],
 c:['A insistência','O advogado mandou uma carta registrada com o testamento.',['Ler a carta|>b|Era verdade.','Rasgar|h+0|Nunca saberei.']],
 d:['O baú','No sótão, um baú com cartas, fotos e um diário do meu tio-avô.',['Ler o diário|h+6 sm+2 >e|Ele foi um aventureiro. Ninguém da família sabia.','Doar tudo para um museu|$+v k+5 f+2|Vendi a casa e doei o baú. O museu da cidade montou uma exposição.']],
 e:['A revelação','O diário fala de uma coleção de moedas raras escondida na casa.',['Procurar|$+v ?50 $+v2 h+15|Encontrei atrás da parede da lareira! Depois vendi a casa.|h-2|Nada. Vendi a casa com o segredo dentro.','Deixar a lenda em paz|$+v h+4|Vendi a casa para uma família que prometeu cuidar dela. Algumas coisas devem continuar mistério.']],
});
chain('imovel',{k:'Dinheiro',min:25,max:70,v:[40000,120000],gap:[1,2]},{
 a:['A casa em leilão','Um amigo corretor disse que uma casa vai a leilão pela metade do preço.',['Dar um lance|?45 $-v >b|Arrematei!|h-3|Alguém deu um lance maior.','Não arriscar|h+0|Leilão me dá medo.']],
 b:['O problema','A casa tinha moradores que não querem sair.',['Negociar com calma|$-5000 k+4 >c|Ajudei a família a encontrar outro lugar.','Entrar na justiça|$-3000 >c|Um ano de processo.']],
 c:['A reforma','A casa precisa de uma reforma inteira.',['Reformar com profissionais|$-30000 >d|Ficou linda.','Fazer eu mesm{o}|$-10000 hl-5 sm+3 >d|Aprendi a assentar azulejo.']],
 d:['Vender ou alugar?','A casa está pronta.',['Vender|$+v2 h+12|Lucro de verdade!','Alugar|$+2000 >e@2|Renda todo mês.','Morar nela|h+10|Minha casa, do meu jeito.']],
 e:['O inquilino','O inquilino parou de pagar o aluguel.',['Negociar|?50 $+3000|Ele voltou a pagar.|$-2000 h-4|Tive que despejar.','Vender a casa de vez|$+v h+6|Chega de dor de cabeça.']],
});
chain('bico_entrega',{k:'Trabalho',min:18,max:60,when:m=>!m.job,gap:[1,1]},{
 a:['Entregas por aplicativo','Sem emprego, comecei a fazer entregas de bicicleta por aplicativo.',['Trabalhar de manhã à noite|$+3000 hl+2 >b|As pernas doem, mas a conta fecha.','Só nos horários de pico|$+1500 >b|O suficiente para o básico.']],
 b:['A chuva','Uma tempestade no meio de uma entrega de comida.',['Entregar mesmo assim|?hl $+200 k+3 >c|A cliente me deu uma gorjeta enorme.|hl-6 >c|Caí da bicicleta.','Esperar a chuva passar|>c|A comida chegou fria. Avaliação ruim.']],
 c:['Os colegas','Os entregadores do bairro se reúnem numa praça entre uma entrega e outra.',['Me juntar à turma|h+6 >d|Fiz amigos de verdade.','Ficar na minha|h+0 >d|Foco no trabalho.']],
 d:['O protesto','Os entregadores vão parar um dia para pedir melhores taxas.',['Participar|?50 $+500 k+4 >e|O aplicativo aumentou as taxas.|$-200 >e|Nada mudou.','Trabalhar no dia do protesto|$+800 k-3 >e|Ganhei mais naquele dia.']],
 e:['Próximo passo','A bicicleta me trouxe até aqui, mas quero mais.',['Comprar uma moto para entregas|$-6000 $+8000 h+6|Mais rápido, mais dinheiro.','Procurar emprego fixo|sm+2 h+3|Com carteira assinada, de preferência.']],
});
chain('cripto',{k:'Dinheiro',min:18,max:70,v:[2000,15000],gap:[1,1]},{
 a:['A moeda nova','Um colega jura que uma criptomoeda nova vai multiplicar por cem.',['Investir {v}|$-v >b|Comprei. Agora é esperar.','Estudar antes|sm+3 >c|Li tudo sobre blockchain.','Ignorar|h+0|Moeda que não existe não me convence.']],
 b:['A montanha-russa','A moeda subiu 300% em uma semana. Depois caiu 80% em um dia.',['Vender na alta|?40 $+v2 h+12|Vendi no topo! Sorte pura.|>d|Não vendi a tempo.','Segurar|?20 $+v2 h+15|Segurei e explodiu!|>d|Caiu mais.']],
 c:['Diversificar','Coloquei só uma pequena parte do dinheiro em cripto.',['Esperar com calma|?50 $+v h+5|Dobrou em dois anos.|$-1000|Perdi um pouco. Nada grave.']],
 d:['O prejuízo','Perdi quase tudo que coloquei.',['Aprender a lição|sm+3 h-4|Nunca mais invisto o que não posso perder.','Colocar mais para recuperar|$-v ?20 $+v2|Recuperei tudo!|h-10|Perdi mais ainda.']],
});
