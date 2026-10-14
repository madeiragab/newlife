// ===== Histórias em cadeia: comunidade, sonhos e saúde =====
chain('horta',{k:'Bairro',min:16,max:85,npc:1,age:[20,40],gap:[1,1]},{
 a:['O terreno baldio','O terreno baldio da rua virou depósito de lixo. {p}, que mora no fim da rua, quer transformar aquilo numa horta comunitária.',['Ajudar|k+5 >b|Peguei uma enxada pela primeira vez na vida.','Achar que não vai dar certo|>e@1|Vamos ver.']],
 b:['Mutirão','Vinte vizinhos tiraram o lixo do terreno num sábado.',['Plantar tomates|k+3 h+6 >c|Terra, sol e conversa boa.','Organizar o grupo de mensagens|sm+2 vira:amigo >c|Virei a pessoa da planilha da horta.']],
 c:['A primeira colheita','A horta deu alface, tomate e couve para a rua inteira.',['Fazer um almoço coletivo|k+6 h+10 >d|Mesa comprida no meio da rua.','Doar para a creche do bairro|k+8 f+1 >d|As crianças vieram ajudar a colher.']],
 d:['A construtora','Uma construtora comprou o terreno e quer erguer um prédio.',['Organizar um protesto|?k f+3 k+6 h+10|A prefeitura transformou a horta em praça oficial!|h-10|O prédio subiu. Guardamos as sementes.','Negociar com a construtora|?sm k+4 h+6|Eles mantiveram a horta no térreo do prédio.|h-6|Não quiseram nem ouvir.']],
 e:['Deu certo','A horta de {p} deu certo sem mim. Hoje é a coisa mais bonita da rua.',['Pedir para participar|k+4 h+5 >c@0|Nunca é tarde.','Admirar de longe|h+2|Às vezes eu passo por lá só para olhar.']],
});
chain('abrigo',{k:'Bichos',min:14,max:80,gap:[1,1]},{
 a:['O abrigo de animais','O abrigo de animais do bairro está pedindo voluntários.',['Ser voluntári{o} aos sábados|k+5 h+6 >b|Banho em cachorro, limpeza de baia e muito amor.','Doar ração|$-200 k+3|Fiz minha parte.']],
 b:['O cão que ninguém quer','Tem um cachorro velho e cego no abrigo há três anos. Ninguém adota.',['Adotar|pet k+8 h+10 >c|Ele dormiu no meu pé na primeira noite.','Fazer uma campanha para ele|?k f+2 k+5 >c|Uma família adotou depois de ver o vídeo!|h-2 >c|Ninguém adotou ainda.']],
 c:['A crise','O abrigo vai fechar por falta de dinheiro.',['Organizar uma feira beneficente|?k $+0 k+8 f+3 h+10 >d|Arrecadamos o suficiente para um ano!|h-6 >d|Não deu. Os animais foram redistribuídos.','Doar do próprio bolso|$-3000 k+8 >d|Ajudei a pagar o aluguel do mês.']],
 d:['Coordenação','Me convidaram para coordenar os voluntários.',['Aceitar|k+5 h+6|Agora tenho uma equipe de trinta pessoas e duzentos bichos.','Continuar só nos sábados|h+4|É o meu jeito de ajudar.']],
});
chain('maratona',{k:'Saúde',min:18,max:65,gap:[1,1]},{
 a:['Primeiro quilômetro','Comecei a correr no parque. Morri no primeiro quilômetro.',['Insistir todo dia|hl+3 >b|No fim do mês, corri três quilômetros sem parar.','Desistir|h-1|Correr não é para mim.']],
 b:['Os 5 km','Me inscrevi numa corrida de 5 km.',['Correr|?hl hl+3 h+10 >c|Cruzei a linha de chegada sorrindo.|hl-3 >c|Caminhei metade, mas terminei.','Desistir na largada|h-3|Fiquei olhando os outros correrem.']],
 c:['A meia maratona','Um grupo de corrida me convidou para treinar para uma meia maratona.',['Entrar no grupo|hl+4 h+6 >d|Treinos às seis da manhã, com sol nascendo.','Treinar sozinh{o}|hl+3 >d|Fone de ouvido e asfalto.']],
 d:['A lesão','Senti uma dor forte no joelho no meio do treino.',['Parar e tratar|$-1500 >e@1|Fisioterapia por três meses.','Continuar correndo|?40 >e|A dor passou.|hl-12 h-8|Lesão séria. Fim da corrida por um bom tempo.']],
 e:['A maratona','Chegou o dia da maratona: 42 quilômetros.',['Correr no meu ritmo|?hl f+2 h+20 hl+5|Terminei a maratona. Chorei na chegada.|h+5|Parei no quilômetro 30, mas fui mais longe do que imaginava.','Tentar bater um recorde|?hl-15 h+20 f+3|Tempo incrível!|hl-8|Quebrei no meio da prova.']],
});
chain('livro',{k:'Sonhos',min:18,max:80,gap:[1,2]},{
 a:['A história na gaveta','Tenho uma história na cabeça há anos. Decidi escrever um livro.',['Escrever todas as noites|tal.writing+5 >b|Uma página por dia.','Esperar a inspiração|>b@2|Ela demorou.']],
 b:['O manuscrito','O livro está pronto: 300 páginas e muito café.',['Mandar para editoras|>c|Mandei para vinte editoras.','Mostrar para amigos primeiro|?50 h+5 >c|Eles amaram!|h-4 >c|Eles foram educados demais.']],
 c:['As rejeições','Dezoito editoras recusaram. Duas não responderam.',['Reescrever|tal.writing+5 >d|O livro ficou muito melhor.','Publicar de forma independente|$-3000 >e|Eu mesm{o} faço.','Desistir|h-8|Talvez não seja para mim.']],
 d:['O sim','Uma editora pequena aceitou o livro!',['Assinar o contrato|$+3000 h+15 f+3 >f|Vou ser autor{a} publicad{o}!','Esperar uma editora maior|?20 $+15000 f+6 h+15 >f|Uma editora grande aceitou!|h-6|Nenhuma maior apareceu.']],
 e:['Independente','Publiquei por conta própria e divulguei nas redes sociais.',['Vender nas redes|?tal.writing $+5000 f+4 h+10 >f|O livro viralizou!|$+300 h+2|Vendi cinquenta exemplares, quase todos para conhecidos.']],
 f:['O lançamento','Tarde de autógrafos numa livraria.',['Autografar com o coração|h+12 f+2 >g@1-3|Uma leitora disse que meu livro salvou o ano dela.','Ficar nervos{o}|h+6 >g@1-3|Errei o nome de três pessoas na dedicatória.']],
 g:['O segundo livro','Os leitores pedem uma continuação.',['Escrever|?tal.writing $+20000 f+5 h+10|O segundo vendeu mais que o primeiro!|h+4|Não fez tanto sucesso, mas eu fiz o que amo.','Encerrar a história|h+5|Um livro é suficiente.']],
});
chain('exame_alerta',{k:'Saúde',min:30,max:80,gap:[1,1]},{
 a:['O exame alterado','Um exame de rotina mostrou pressão e colesterol altos.',['Mudar a alimentação|hl+3 >b|Menos sal, mais verdura.','Ignorar|hl-3 >c@1|Vida que segue.']],
 b:['A dieta','Mudei os hábitos. Sinto falta do torresmo.',['Manter firme|hl+5 lk+2 >d|Perdi peso e ganhei disposição.','Escorregar no fim de semana|hl+1 >d|Ninguém é de ferro.']],
 c:['O susto','Senti uma pressão no peito subindo uma escada.',['Correr para o hospital|$-2000 hl+4 >b|Foi um aviso. Hora de mudar.','Achar que é cansaço|?40 hl-5 >b@1|Passou. Por enquanto.|dis:cardiaca hl-15|Era o coração.']],
 d:['Os novos exames','Seis meses depois, novos exames.',['Abrir os resultados|?hl hl+6 h+10|Tudo normal! O médico me deu parabéns.|hl+2 h+3|Melhorou, mas ainda tem trabalho.']],
});
chain('associacao',{k:'Bairro',min:22,max:80,gap:[1,1]},{
 a:['A associação de moradores','A associação de moradores do bairro está abandonada. Ninguém quer ser presidente.',['Me candidatar|f+1 >b|Ganhei por falta de concorrente.','Ajudar sem cargo|k+3|Faço o que dá.']],
 b:['A primeira reunião','Na primeira reunião, todo mundo reclamou de tudo ao mesmo tempo.',['Fazer uma lista de prioridades|sm+3 k+3 >c|Iluminação, buracos e a praça.','Prometer resolver tudo|>c|Promessa é dívida.']],
 c:['A prefeitura','Levei as reivindicações à prefeitura.',['Insistir até ser ouvid{o}|?k f+3 k+5 >d|Trocaram as lâmpadas da rua inteira!|h-6 >d|Me fizeram esperar quatro horas para nada.','Fazer barulho na imprensa|?40 f+5 >d|Uma reportagem pressionou e funcionou.|h-4 >d|A reportagem nunca saiu.']],
 d:['Liderança','O bairro começou a me reconhecer como liderança.',['Candidatar-me a vereador{a}|?f f+6 h+10|Fui eleit{o} vereador{a}!|h-6|Não fui eleit{o}, mas tive muitos votos no bairro.','Continuar no bairro|k+5 h+6|Meu lugar é aqui.']],
});
chain('incendio',{k:'Bairro',min:16,max:75,npc:1,gap:[1,2]},{
 a:['Fumaça','Vi fumaça saindo da casa de {p}, vizinh{o2} de duas casas para lá.',['Correr para ajudar|?hl k+10 f+4 >b|Tirei {p} de lá antes do fogo se espalhar.|hl-12 k+8 >b|Tirei {p} de lá, mas me queimei.','Chamar os bombeiros|k+5 >c|Os bombeiros chegaram em dez minutos.']],
 b:['Herói do bairro','O jornal local fez uma matéria sobre mim.',['Dar entrevista|f+3 h+6 vira:amigo >d|{p} chorou ao vivo me agradecendo.','Recusar a fama|k+3 vira:amigo >d|Fiz o que qualquer um faria.']],
 c:['A casa perdida','A casa de {p} ficou destruída.',['Organizar uma vaquinha|k+8 >d|O bairro inteiro ajudou.','Oferecer um quarto por um tempo|k+10 vira:amigo >d|{p} ficou dois meses lá em casa.']],
 d:['Reconstrução','A casa de {p} foi reconstruída com ajuda de todo mundo.',['Ir à festa de reinauguração|h+10 bond+10|{p} fez um discurso agradecendo a rua inteira.','Ajudar a pintar a última parede|k+4 h+6|Deixei minha mão marcada no muro.']],
});
chain('coral_adulto',{k:'Sonhos',min:25,max:85,gap:[1,1]},{
 a:['Aulas de canto','Sempre quis cantar. Me matriculei num coral para adultos.',['Ir sem vergonha|tal.musical+4 h+6 >b|Desafinei e ninguém morreu.','Ficar no fundo, cantando baixinho|tal.musical+2 >b|Um passo de cada vez.']],
 b:['A apresentação','O coral vai se apresentar no teatro da cidade.',['Cantar com tudo|?tal.musical h+12 f+2 >c|O teatro aplaudiu de pé.|h-3 >c|Esqueci uma parte da letra.','Desistir na véspera|h-6|O nervosismo venceu.']],
 c:['O convite','O maestro me convidou para um pequeno solo no concerto de Natal.',['Aceitar|?tal.musical h+15 f+3|Minha voz encheu o teatro.|h-2|Falhei na nota alta. Rimos depois.','Recusar|h+2|O coro já me basta.']],
});
chain('voluntario_hospital',{k:'Bondade',min:16,max:85,npc:1,age:[-10,10],gap:[1,1]},{
 a:['Contador de histórias','Um hospital infantil procura voluntários para ler histórias para as crianças internadas.',['Ir|k+6 h+6 >b|Uma menina riu tanto que a enfermeira veio ver o que era.','Doar livros|$-200 k+3|Mandei uma caixa cheia.']],
 b:['O menino da sala 4','Um menino de oito anos espera minha visita toda semana.',['Levar um livro novo toda semana|k+5 h+6 >c|Ele lê mais rápido que eu.','Ensinar truques de mágica|k+4 h+8 >c|Agora ele faz mágica para as enfermeiras.']],
 c:['A notícia','O menino da sala 4 vai receber alta. Está curado.',['Ir à despedida|h+15 k+5 >d@3-6|Ele me deu um desenho de nós dois.','Mandar um presente|h+10 k+3 >d@3-6|Um livro com dedicatória.']],
 d:['A carta','Anos depois, recebi uma carta: o menino da sala 4 vai fazer faculdade de medicina.',['Responder|h+15 k+4|"Você me mostrou que hospital também tem riso."','Guardar a carta|h+12|Na gaveta das coisas mais importantes.']],
});
chain('mudar_cidade',{k:'Vida',min:22,max:65,gap:[1,1]},{
 a:['Vontade de mudar','Ando cansad{o} da cidade. Trânsito, barulho, pressa.',['Pesquisar cidades menores|>b|Montei uma lista com prós e contras.','Fazer uma viagem para pensar|$-2000 h+6 >b|Voltei com mais dúvidas.','Deixar a ideia de lado|h-2|Talvez um dia.']],
 b:['A decisão','Achei uma cidade pequena perto do mar.',['Mudar|$-8000 h+12 >c|Caminhão de mudança e coração acelerado.','Desistir de última hora|h-4|Medo do desconhecido.']],
 c:['Vida nova','Na cidade nova, todo mundo sabe o nome de todo mundo.',['Me enturmar|h+8 >d|Já sou "a pessoa da casa amarela".','Sentir falta da cidade grande|h-6 >d|Saudade do caos.']],
 d:['Um ano depois','Faz um ano que me mudei.',['Ficar para sempre|h+10 hl+4|Encontrei meu lugar.','Voltar para a cidade grande|$-5000 h+2|Descobri que eu gosto do caos.']],
});
