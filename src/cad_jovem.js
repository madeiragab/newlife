// ===== Histórias em cadeia: jovem adulto =====
chain('republica',{k:'Moradia',min:18,max:28,npc:1,gap:[1,1]},{
 a:['Dividir apartamento','Achei um anúncio: "{p} procura alguém para dividir apê perto do centro. Aluguel barato."',['Ir morar com {p}|$-2000 >b|Mudei com duas malas e um colchão.','Continuar onde estou|h+0|Melhor não arriscar com desconhecidos.']],
 b:['As regras da casa','{p} colou uma tabela de tarefas na geladeira. Eu nunca lavo a louça no meu dia.',['Cumprir as tarefas|k+3 vira:amigo >c|{p} desenhou uma estrelinha do lado do meu nome.','Deixar a louça acumular|k-3 >d|A pilha virou um ser vivo.']],
 c:['Amizade de apartamento','Eu e {p} viramos amigos de verdade. Noites de pizza, séries e conversas até tarde.',['Fazer uma festa no apê|h+8 >e|Os vizinhos reclamaram. Valeu a pena.','Manter a paz|h+4 >e|Rotina boa. Casa boa.']],
 d:['A briga','{p} explodiu por causa da louça e disse que eu sou um péssimo colega de casa.',['Pedir desculpas e mudar|k+4 >c|Comprei uma esponja nova e um bolo de desculpas.','Brigar de volta|h-6 vira:inimigo >f|Paramos de nos falar dentro do mesmo apartamento.']],
 e:['O aluguel sumiu','{p} sumiu no meio do mês. O dinheiro do aluguel, que estava na conta d{ele}, também.',['Ligar sem parar|?50 >g|{p} atendeu chorando: perdeu o emprego e tinha vergonha de contar.|$-1500 >f|Ninguém atendeu. Tive que pagar tudo sozinh{o}.','Procurar a polícia|$-1500 k+1 >f|Fiz um boletim de ocorrência. Paguei o aluguel do mesmo jeito.']],
 f:['Morar sozinh{o}','Agora o apartamento é só meu. Silencioso demais.',['Gostar da liberdade|h+5|Danço de pijama na sala.','Arrumar outro colega|>b@0|Outro anúncio, outra aposta.']],
 g:['O pacto','{p} prometeu pagar tudo de volta assim que arrumar outro emprego.',['Ajudar {ele} a procurar vaga|k+6 bond+15 >h@1|Revisei o currículo d{ele} três vezes.','Cobrar com firmeza|bond-5 >h@1|Amizade e dinheiro não se misturam.']],
 h:['A dívida paga','{p} arrumou emprego e me devolveu tudo, com juros e um jantar.',['Aceitar o jantar|h+8 $+1800 bond+10|Amizade testada e aprovada.','Recusar os juros|k+5 $+1500 bond+12|"Amigo não cobra juros."']],
});
chain('startup',{k:'Negócios',min:20,max:35,who:'friend',v:[5000,30000],gap:[1,2]},{
 a:['A ideia','{p} apareceu com uma ideia: um aplicativo de {prod} que ninguém fez ainda. Quer que eu seja sóci{o}.',['Entrar no negócio|$-v >b|Investimos as economias. Café, planilhas e madrugadas.','Recusar|bond-3|{p} seguiu sozinh{o2}. Fiquei curios{o} para sempre.']],
 b:['O protótipo','O aplicativo está pronto, mas cheio de bugs.',['Lançar assim mesmo|?40 >c|Os primeiros usuários amaram!|h-6 >d|Os primeiros usuários odiaram. Avaliação de uma estrela.','Esperar ficar perfeito|$-3000 >c|Seis meses de atraso, mas lançamos bem.']],
 c:['O investidor','Um investidor quer colocar dinheiro, mas quer 40% da empresa.',['Aceitar|$+30000 >e|Agora somos uma startup "de verdade".','Negociar|?sm >e|Fechamos com 25%. {p} me chamou de gênio.|>d|O investidor desistiu.','Recusar|>d|Vamos crescer sozinhos.']],
 d:['Caixa vazio','O dinheiro está acabando. Faltam três meses para quebrar.',['Fazer uma última aposta de marketing|$-5000 ?35 >e|Viralizamos! Salvos no último minuto.|h-10 >f|Não funcionou.','Fechar a empresa|h-8 >f|Doeu desligar os servidores.']],
 e:['Crescimento','A empresa cresceu. Agora temos funcionários e uma sala com pufe colorido.',['Continuar crescendo|$+20000 sm+3 >g@2|Trabalho dobrado, sonho dobrado.','Brigar com {p} pelo rumo da empresa|bond-15 >h|Discordamos em tudo.']],
 f:['O fracasso','A startup fechou. Perdi dinheiro, mas aprendi mais que em qualquer faculdade.',['Tentar de novo um dia|sm+4 h-2|Anotei cada erro num caderno.','Voltar para um emprego normal|h+2|Salário fixo no fim do mês. Que delícia.']],
 g:['A proposta de compra','Uma empresa gigante quer comprar nossa startup.',['Vender|$+250000 h+15 f+4|Fiquei ric{o} da noite para o dia!','Não vender|?30 $+100000 f+6|Crescemos e valemos o triplo dois anos depois.|h-10|Recusamos e um concorrente copiou tudo.']],
 h:['A separação','Eu e {p} decidimos que não dá mais para tocar a empresa juntos.',['Comprar a parte d{ele}|$-15000 bond-10 >g@1|A empresa é minha agora.','Vender minha parte|$+25000 bond-5|Saí com dinheiro no bolso e uma amizade arranhada.']],
});
chain('mochilao',{k:'Viagem',min:18,max:30,npc:1,date:1,gap:[1,2]},{
 a:['O mochilão','Juntei dinheiro para um mochilão de um mês por {lugar}.',['Ir|$-6000 h+10 >b@0|Uma mochila, um mapa e nenhum plano.','Gastar o dinheiro com outra coisa|h+2|Fica para outra vida.']],
 b:['Albergue','No albergue, {p}, que também estava viajando sozinh{o2}, me convidou para um passeio.',['Ir junto|h+8 >c|Passamos o dia rindo de tudo.','Seguir meu roteiro|h+3|Viagem é para conhecer lugares, não pessoas. Ou não?']],
 c:['Romance de viagem','Eu e {p} viajamos juntos pelo resto do mês.',['Me apaixonar|h+12 vira:namoro >d|Foi o mês mais bonito da minha vida.','Manter como amizade de viagem|vira:amigo h+6 >e@1|Amizade de mochila.']],
 d:['A despedida no aeroporto','A viagem acabou. {p} mora do outro lado do oceano.',['Tentar namoro a distância|?40 bond+10 >f|Mensagens todos os dias, fuso horário maluco.|h-12 breakup >e@1|Não aguentamos. Terminamos por videochamada.','Terminar com carinho|h-10 breakup >e@1|Tem amores que são de um lugar só.']],
 e:['Saudade da estrada','Às vezes abro as fotos daquela viagem e sinto o cheiro da estrada.',['Planejar outra|$-5000 h+8|Já comprei a passagem.','Guardar a lembrança|h+3|Algumas viagens acontecem uma vez só.']],
 f:['Mudar de país?','{p} me convidou para morar com {ele} no exterior.',['Ir|?45 h+15 bond+15|Mudei de país por amor. Vida nova.|h-10 breakup|Não deu certo lá. Voltei sozinh{o}.','Pedir para {p} vir|?40 h+12 bond+10|{Ele} veio!|h-8 breakup|{Ele} não quis deixar a família.']],
});
chain('divida_cartao',{k:'Dinheiro',min:18,max:40,gap:[1,1]},{
 a:['O cartão de crédito','O banco me ofereceu um cartão de crédito com limite alto.',['Aceitar e usar com cuidado|k+2 >b|Só para emergências. Promessa.','Aceitar e gastar|h+8 $-4000 >c|Celular novo, roupas, jantares.','Recusar|h+0|Melhor não.']],
 b:['A emergência','O carro quebrou, o celular quebrou e o aluguel venceu no mesmo mês.',['Passar no cartão|$-3000 >c|Resolveu o mês. Criou um problema para o próximo.','Pedir ajuda para a família|?50 h-2|Me ajudaram, com sermão incluso.|$-2000 >c|Ninguém podia ajudar. Cartão.']],
 c:['A fatura','A fatura veio com juros que eu nem sabia que existiam.',['Pagar o mínimo|$-500 h-4 >d|Alívio de um mês. Bola de neve.','Pagar tudo com sacrifício|$-4000 h-6 k+3 >f|Fiquei sem dinheiro até o fim do mês, mas livre.']],
 d:['Bola de neve','A dívida dobrou. Ligações de cobrança todos os dias.',['Negociar com o banco|?sm $-3000 >f|Consegui um desconto de 60% para pagar à vista.|$-6000 >e|O banco não quis acordo.','Ignorar as ligações|h-8 >e|Bloqueei o número. Eles têm outros.']],
 e:['Nome sujo','Meu nome foi para a lista de devedores. Não consigo nem fazer crediário.',['Fazer um plano para quitar|$-5000 sm+2 >f@1|Planilha, cortes e paciência.','Arrumar um bico extra|$+2000 hl-3 >f@1|Fim de semana trabalhando.']],
 f:['Livre','Paguei tudo. Cortei o cartão em pedacinhos.',['Comemorar|h+12|A melhor sensação do mundo: não dever nada.','Aprender a investir|sm+4 $+500|Agora o dinheiro trabalha para mim.']],
});
chain('academia',{k:'Saúde',min:16,max:40,gap:[1,1]},{
 a:['Primeiro dia de academia','Fiz a matrícula numa academia. O instrutor me olhou de cima a baixo.',['Seguir o treino certinho|hl+4 lk+2 >b|Saí sem conseguir levantar os braços.','Treinar do meu jeito|?50 hl+2 >b|Fui me virando.|hl-5 >c|Me machuquei no primeiro dia.']],
 b:['Rotina','Faz três meses que vou todo dia. Comecei a ver diferença no espelho.',['Aumentar a carga|?hl lk+4 hl+4 >d|Nunca estive tão em forma.|hl-8 >c|Distendi um músculo.','Manter o ritmo|hl+3 lk+2 >d|Constância é tudo.']],
 c:['A lesão','Uma lesão me tirou da academia por um mês.',['Fazer fisioterapia|$-800 hl+5 >b@1|Voltei mais cuidados{o}.','Desistir da academia|h-4|O sofá me venceu.']],
 d:['A competição','O instrutor me sugeriu competir numa prova de corrida ou de força.',['Competir|?tal.athletic f+2 h+12 tal.athletic+4 >e|Fiquei entre os primeiros!|h-3 >e|Fiquei lá atrás, mas terminei.','Treinar só para mim|hl+3 h+4|Não preciso de medalha.']],
 e:['Estilo de vida','O treino virou parte de quem eu sou.',['Virar personal trainer|?40 emprego:pers h+8|Agora ensino o que aprendi.|h+2|Fica como hobby mesmo.','Seguir treinando|hl+5 lk+3|Corpo e cabeça agradecem.']],
});
chain('padrinho_casamento',{k:'Amizade',min:22,max:40,who:'friend',gap:[1,1]},{
 a:['O convite','{p} vai se casar e me chamou para ser {padrinho}.',['Aceitar|h+8 bond+8 >b|Roupa de gala alugada e um nervosismo enorme.','Recusar|bond-15 h-2|{p} ficou magoad{o2}.']],
 b:['A despedida de solteiro','Fiquei responsável por organizar a despedida de solteir{o2} de {p}.',['Fazer algo tranquilo|bond+5 >c|Churrasco, cerveja e histórias antigas.','Fazer uma festa épica|$-1500 ?50 h+10 bond+8 >c|Foi lendária.|bond-8 >c|Saiu do controle. Teve até polícia.']],
 c:['O discurso','No dia do casamento, chegou a hora do meu discurso no altar.',['Fazer um discurso emocionante|?k bond+10 h+8 f+1|Todo mundo chorou. Até o garçom.|h-4|Contei uma história constrangedora sem querer. Silêncio total.','Improvisar|?40 bond+6 h+6|Arranquei gargalhadas.|h-5|Gaguejei e passei o microfone.']],
});
chain('golpe_internet',{k:'Dinheiro',min:18,max:70,v:[1000,8000],gap:[1,1]},{
 a:['Investimento milagroso','Um anúncio promete dobrar o dinheiro em trinta dias com "inteligência artificial".',['Investir {v}|$-v >b|O site parecia muito profissional.','Desconfiar|sm+2 k+1|Promessa boa demais.']],
 b:['Lucro na tela','Na primeira semana, a tela mostrava um lucro enorme.',['Investir mais|$-v >c|Coloquei mais dinheiro. Os números subiram mais ainda.','Tentar sacar|?20 $+v2 >e|Saquei! E fugi correndo.|>c|O saque ficou "em análise".']],
 c:['O site sumiu','O site saiu do ar. O telefone de suporte não existe mais.',['Ir à polícia|>d|O delegado suspirou: "Mais um."','Expor nas redes|f+2 >d|Muita gente comentou: "Eu também caí".']],
 d:['A investigação','A polícia encontrou o grupo responsável.',['Entrar no processo coletivo|?40 $+v >e@2|Recuperei uma parte do dinheiro anos depois.|h-4|Nunca vi um centavo de volta.','Seguir em frente|h-3|Considerei o prejuízo uma aula cara.']],
 e:['Lição','Agora desconfio de qualquer promessa fácil de dinheiro.',['Alertar a família|k+4|Expliquei o golpe para minha mãe. Ela quase caiu num igual na semana seguinte.','Guardar para mim|sm+2|Lição aprendida.']],
});
chain('vizinho_barulhento',{k:'Vizinhança',min:18,max:70,npc:1,gap:[1,1]},{
 a:['Festa toda noite','O vizinho novo, {p}, faz festa até as três da manhã todo dia.',['Bater na porta para conversar|?k >b|{p} pediu desculpas e baixou o som.|>c|{p} bateu a porta na minha cara.','Chamar a polícia|>c|A polícia veio. A guerra começou.','Comprar protetor de ouvido|h-3|Dormir é um direito. Ou deveria ser.']],
 b:['Trégua','{p} me convidou para a próxima festa, como pedido de desculpas.',['Ir|vira:amigo h+8 >d|Descobri que {p} é a pessoa mais divertida do prédio.','Agradecer e não ir|h+2|Paz é o que importa.']],
 c:['Guerra fria','{p} agora estaciona na minha vaga e deixa o lixo na minha porta.',['Revidar|k-4 h-3 >e|Coloquei o lixo d{ele} de volta. Com bilhete.','Levar para o síndico|>e|Reunião de condomínio marcada.','Tentar conversar de novo|?k+15 >b|{p} cedeu.|h-4 >e|Não adiantou.']],
 d:['Amizade de prédio','{p} cuida das minhas plantas quando viajo e eu dos gatos d{ele}.',['Retribuir com um jantar|h+6 bond+8|Amizade de porta com porta.','Apresentar {p} para meus amigos|h+5|{p} virou parte da turma.']],
 e:['A reunião de condomínio','A reunião virou um tribunal. Metade do prédio contra {p}, metade contra mim.',['Propor um acordo|k+5 >b|Fizemos as pazes na frente de todo mundo.','Insistir na multa|vira:inimigo h+2|{p} foi multad{o2}. Nunca mais me cumprimentou.']],
});
chain('carro_velho',{k:'Bens',min:18,max:40,npc:1,gn:'M',age:[10,30],gap:[1,1]},{
 a:['Um carro velho','Comprei um carro velho por um preço que parecia bom demais.',['Ficar feliz|$-6000 h+8 >b|Meu primeiro carro! Barulhento, mas meu.','Desistir na hora de pagar|h+0|Melhor juntar mais um pouco.']],
 b:['Pifou','O carro morreu no meio da avenida em horário de pico.',['Procurar uma oficina de bairro|>c|Achei a oficina do seu {p}.','Chamar o guincho do seguro|$-500 >d|Guincho, concessionária e um orçamento assustador.']],
 c:['O mecânico honesto','Seu {p} consertou o carro cobrando só a peça.',['Virar cliente fiel|vira:amigo $-300 >e|Desde então, só confio nele.','Pagar e sumir|$-300|Resolvido.']],
 d:['O orçamento','A concessionária quer cobrar metade do valor do carro no conserto.',['Pagar|$-3000 >e|Doeu, mas funcionou.','Vender o carro como está|$+1500 h-4|Adeus, primeiro carro.']],
 e:['O carro de estimação','O carro velho já tem nome, apelido e um adesivo engraçado no vidro.',['Ficar com ele para sempre|h+6|Quando morrer, vai ser enterrado com honras.','Trocar por um mais novo|$-8000 h+6|Chorei na hora de entregar a chave.']],
});
chain('ex_volta',{k:'Amor',min:20,max:50,who:'ex',gap:[1,2]},{
 a:['Uma mensagem','{p}, meu ex-amor, mandou uma mensagem depois de muito tempo: "Tô com saudade."',['Responder|>b|O coração acelerou.','Ignorar|h+2|Passado é passado.','Bloquear|h+3|Fechei a porta de vez.']],
 b:['Um café','{p} quer tomar um café para conversar.',['Ir|?50 h+8 >c|A conversa fluiu como antigamente.|h-4 >d|Lembrei por que terminamos.','Recusar com educação|h+2|Algumas portas devem ficar fechadas.']],
 c:['Segunda chance?','{p} disse que mudou e quer tentar de novo.',['Dar uma segunda chance|?45 vira:namoro h+12 >e@1|Voltamos! Desta vez, com mais maturidade.|h-10 >d|Tentamos por um mês e brigamos pelos mesmos motivos.','Ficar só na amizade|vira:amigo h+4|Amizade com quem já foi amor. Estranho, mas bom.']],
 d:['Fechando o ciclo','Percebi que acabou de verdade. E tudo bem.',['Desejar o melhor para {p}|k+4 h+5|Fiquei em paz.','Chorar uma última vez|h-3|E depois dormi muito bem.']],
 e:['Pedido','{p} quer oficializar de vez.',['Noivar|noivar h+12 bond+10|Desta vez é para valer.','Ir com calma|h+4 bond+3|Sem pressa agora.']],
});
chain('concurso',{k:'Carreira',min:20,max:45,gap:[1,1],when:m=>m.edu.deg.includes('medio')},{
 a:['Concurso público','Abriu um concurso público com salário bom e estabilidade.',['Estudar a sério|$-600 sm+3 >b|Comprei apostilas e montei um cronograma.','Fazer sem estudar|?15 >d|Passei de primeira, por milagre!|h-2|Não passei, claro.']],
 b:['A rotina de concurseir{o}','Seis horas de estudo por dia, além do trabalho.',['Manter o ritmo|sm+4 hl-3 >c|Sonho com questões de múltipla escolha.','Diminuir o ritmo|h+3 >c|Precisava respirar.']],
 c:['O dia da prova','Quatro horas de prova e cem questões.',['Fazer com calma|?sm >d|Fiquei bem colocad{o}!|h-8 >e|Faltaram três pontos.','Chutar as difíceis|?35 >d|Os chutes foram certeiros.|h-8 >e|Errei os chutes.']],
 d:['Aprovad{o}!','Meu nome saiu na lista de aprovados.',['Assumir o cargo|emprego:aux raise+40 h+15|Estabilidade, enfim! Comecei como servidor{a}.','Continuar onde estou|h+4|Foi bom saber que eu consigo.']],
 e:['Reprovad{o}','Não passei desta vez.',['Tentar o próximo|sm+2 >b@1|Desistir não é opção.','Desistir de concurso|h-3|Não era para mim.']],
});
chain('pet_adulto',{k:'Bichos',min:20,max:60,gap:[1,3]},{
 a:['A feira de adoção','Passei por uma feira de adoção de animais no parque.',['Adotar|pet h+10 >b|Um par de olhos me escolheu. Não teve como resistir.','Só fazer carinho|h+3|Saí de coração partido.']],
 b:['Adaptação','O bicho novo destruiu um chinelo, dois cabos e meu coração (de amor).',['Fazer adestramento|$-600 >c|Agora atende pelo nome. Às vezes.','Deixar livre|h+3 >c|Caos feliz.']],
 c:['O susto','O bichinho comeu algo que não devia e passou muito mal.',['Correr para o veterinário|$-1500 h-2 >d|Salvo por pouco.','Esperar melhorar sozinho|?50 h+2 >d|Melhorou.|h-15 >e|Não resistiu. Nunca vou me perdoar.']],
 d:['Companheiro','Anos de companhia. Nas piores fases, era quem me esperava na porta.',['Agradecer com um petisco especial|h+8|Ele não entende de gratidão. Entende de petisco.','Tirar uma foto juntos|h+6|Foto na parede da sala.']],
 e:['Luto','A casa ficou silenciosa demais.',['Adotar outro, com o tempo|pet h+6|Não substitui. Mas ajuda.','Ficar um tempo sozinh{o}|h-4|Cada um no seu tempo.']],
});
chain('intercambio_trabalho',{k:'Viagem',min:19,max:30,npc:1,gap:[1,1]},{
 a:['Trabalhar fora','Uma agência oferece temporadas de trabalho no exterior: hotel, fazenda ou restaurante.',['Ir trabalhar em {lugar}|$-3000 h+8 >b|Mala, inglês travado e coragem.','Não ir|h+0|Fica para depois.']],
 b:['O choque','O trabalho é pesado, o frio é cortante e a saudade aperta.',['Aguentar|$+6000 >c|Lavei pratos o suficiente para uma vida inteira.','Voltar antes|h-6 $-1000|Não era para mim.']],
 c:['Amizade internacional','Fiz amizade com {p}, que veio do outro lado do mundo trabalhar no mesmo lugar.',['Fazer planos juntos|vira:amigo h+8 >d|Viajamos nas folgas.','Manter distância|>d|Foco no trabalho.']],
 d:['A volta','A temporada acabou. Voltei com dinheiro, sotaque e histórias.',['Guardar o dinheiro|$+3000 sm+3|Volta com bagagem de verdade.','Gastar na viagem de volta|h+10|Mais uma aventura antes de voltar.']],
});
chain('tatuagem',{k:'Estilo',min:18,max:40,gap:[1,3]},{
 a:['A primeira tatuagem','Decidi fazer uma tatuagem.',['Algo significativo|$-600 h+6 >b|Uma data importante, no lugar certo.','Algo por impulso|$-400 ?50 h+6 >b|Ficou ótima!|h-6 >c|Ficou horrível.']],
 b:['Gostei','Agora quero outra.',['Fechar o braço|$-3000 lk+2 h+8|Arte na pele.','Parar por aqui|h+2|Uma basta.']],
 c:['O arrependimento','A tatuagem impulsiva ficou feia de verdade.',['Fazer uma cobertura|$-1200 h+6|Agora é um tigre. Ninguém sabe o que tinha embaixo.','Remover a laser|$-3000 hl-2|Doeu mais que fazer.','Assumir com humor|h+4|Virou história para contar.']],
});
