// ===== Histórias em cadeia: maturidade e velhice =====
chain('meia_idade',{k:'Vida',min:40,max:55,gap:[1,1]},{
 a:['O espelho','Acordei, olhei no espelho e não reconheci a pessoa de cabelo grisalho que me olhava de volta.',['Comprar um conversível|$-60000 h+12 >b|Vermelho. Claro.','Começar a fazer algo novo|>c|Chega de esperar o momento certo.','Aceitar o tempo|k+3 h+3 >d|As rugas contam a minha história.']],
 b:['O conversível','O carro novo chama atenção. Meus filhos morrem de vergonha.',['Fazer uma viagem de estrada|h+10 >d|Cabelo ao vento. O que sobrou dele.','Vender depois de seis meses|$+40000 h-2 >d|A crise passou mais rápido que a garantia.']],
 c:['Algo novo','Decidi aprender algo que sempre quis.',['Aprender a tocar bateria|tal.musical+6 h+8 >d|Os vizinhos me odeiam.','Fazer aulas de dança|tal.dance+6 h+8 >d|Duas aulas por semana. Me sinto com vinte anos.','Voltar a estudar|sm+5 >d|Sala de aula cheia de gente da idade dos meus filhos.']],
 d:['A conclusão','A crise dos quarenta passou. Ficou uma vontade de viver melhor.',['Diminuir o ritmo do trabalho|h+10 perf-5|Mais tempo para o que importa.','Fazer uma lista de sonhos para os próximos anos|h+6 sm+2|Primeiro item: ver a aurora boreal.']],
});
chain('neto',{k:'Família',min:45,max:90,who:'grandkid',gap:[1,2]},{
 a:['Uma geração nova','Segurar {p} pela primeira vez me fez entender tudo de novo.',['Prometer ser a melhor companhia do mundo|h+15 bond+10 >b|Já comprei brinquedo demais.','Chorar escondid{o}|h+12 >b|Lágrimas boas.']],
 b:['Os fins de semana','{p} passa os fins de semana comigo.',['Ensinar o que eu sei|bond+10 h+8 >c|Ensinei a pescar, a fazer bolo e a perder no dominó.','Mimar sem limites|bond+12 h+10 >c|Em casa de avó não tem regra.']],
 c:['A pergunta','{p} me perguntou como era o mundo quando eu era criança.',['Contar histórias da minha vida|bond+10 h+8 >d|{p} ficou de boca aberta com cada aventura.','Mostrar fotos antigas|bond+8 h+6 >d|"Você tinha cabelo?"']],
 d:['Crescendo','{p} cresceu e agora me visita menos.',['Ligar e chamar para um almoço|bond+8 h+6|{p} veio, e trouxe a namorada para me conhecer.','Entender que é assim mesmo|h+2|Também fui assim com meus avós.']],
});
chain('aposentadoria',{k:'Vida',min:58,max:72,when:m=>!!m.job&&!m.job.hero,gap:[1,1]},{
 a:['A conta da aposentadoria','Fiz as contas: posso me aposentar daqui a pouco.',['Planejar a aposentadoria|sm+3 >b|Planilha de despesas e de sonhos.','Não pensar nisso ainda|>b@2|Trabalhar me faz bem.']],
 b:['O último dia','Hoje é meu último dia de trabalho. A equipe preparou uma festa.',['Fazer um discurso|h+12 f+1 fire >c|Agradeci a cada um pelo nome.','Sair sem alarde|h+8 fire >c|Peguei minha caneca e fui embora sorrindo.']],
 c:['As primeiras semanas','Os primeiros dias de aposentadoria são estranhos. Acordo cedo sem motivo.',['Criar uma rotina nova|h+6 hl+3 >d|Caminhada, jornal e café na padaria.','Ficar em casa vendo TV|h-6 >e|Os dias ficaram longos demais.']],
 d:['Um novo propósito','Descobri que a aposentadoria pode ser o começo de algo.',['Fazer trabalho voluntário|k+8 h+8|Ensino jovens a fazer o que eu fazia.','Viajar|$-15000 h+15|Conheci lugares que sempre quis.','Cuidar de um jardim|h+8 hl+3|Plantas não têm pressa. Nem eu.']],
 e:['O vazio','Me sinto inútil sem o trabalho.',['Procurar ajuda|$-1000 h+6 >d|A terapia me ajudou a achar outro sentido.','Arrumar um bico|$+2000 h+4 >d|Voltei a trabalhar meio período. Me sinto útil de novo.']],
});
chain('reencontro_turma',{k:'Amizade',min:40,max:80,npc:1,gap:[1,1]},{
 a:['Trinta anos de formatura','O grupo da turma da escola está organizando um reencontro de trinta anos de formatura.',['Confirmar presença|>b|Fiquei uma semana pensando no que vestir.','Não ir|h-2|Não tenho coragem de ver todo mundo.']],
 b:['O reencontro','Ninguém está igual. Todo mundo está igual.',['Procurar {p}, que era {o2} mais quiet{o2} da turma|>c|{p} virou uma pessoa fascinante.','Contar as minhas conquistas|?50 h+6 >d|Impressionei.|h-3 >d|Ninguém se importou muito.']],
 c:['Conversa longa','Eu e {p} conversamos a noite inteira sobre a vida.',['Manter contato|vira:amigo h+8 >e@1|Amizade nova com cara de antiga.','Deixar a noite ser só uma noite|h+6|Uma noite perfeita.']],
 d:['A falta','Na mesa de homenagens, fotos de colegas que já se foram.',['Fazer um brinde a eles|h+3 k+3 >e@1|Silêncio e taças levantadas.','Sair um pouco para respirar|h-4 >e@1|A vida passa rápido demais.']],
 e:['O grupo de mensagens','Depois do reencontro, o grupo da turma não para de mandar mensagens.',['Participar|h+6|Bom dia com figurinha todo santo dia.','Silenciar o grupo|h+2|Amo todos, mas não às seis da manhã.']],
});
chain('viuvez',{k:'Família',min:45,max:95,when:m=>S.people.some(p=>!p.alive&&p.rel==='conjuge'),gap:[1,1]},{
 a:['A casa vazia','A casa ficou grande demais desde que meu amor se foi.',['Deixar tudo como estava|h-8 >b|O casaco ainda no cabide.','Doar as roupas|h-6 k+3 >c|Cada peça com uma lembrança.']],
 b:['O luto','Os dias são longos. Os amigos ligam cada vez menos.',['Entrar num grupo de apoio|h+6 >c|Gente que entende sem precisar explicar.','Me isolar|h-10 >d|Fechei as cortinas.']],
 c:['Pequenas alegrias','Descobri que é possível rir de novo sem culpa.',['Voltar a sair com amigos|h+8 >e@1|Primeiro jantar fora em um ano.','Começar um hobby|h+6 >e@1|Comecei a pintar.']],
 d:['A visita','Meus filhos apareceram sem avisar, preocupados.',['Deixar eles ajudarem|h+8 >c|Às vezes a gente precisa ser cuidad{o}.','Dizer que estou bem|h-4 >c|Não estava.']],
 e:['Seguir em frente','Seguir em frente não é esquecer. É levar junto.',['Abrir o coração para alguém novo um dia|h+6|Quem sabe.','Viver de boas lembranças|h+5|Foram muitos anos bons.']],
});
chain('golpe_idoso',{k:'Golpe',min:60,max:95,v:[2000,15000],gap:[1,1]},{
 a:['A ligação do banco','Uma voz simpática disse que é do banco e que minha conta foi invadida. Pede os dados para "proteger o dinheiro".',['Passar os dados|$-v >b|Parecia tão real.','Desligar e ligar para o banco|sm+2 k+2 >c|O banco disse que era golpe.','Pedir para um neto verificar|>c|Meu neto riu e bloqueou o número.']],
 b:['O prejuízo','O dinheiro sumiu da conta.',['Ir à delegacia e ao banco|?30 $+v >d|O banco devolveu uma parte.|h-6 >d|Não recuperei nada.','Esconder da família por vergonha|h-10 >d|Fiquei calad{o} por semanas.']],
 c:['Escapei','Por pouco não caí no golpe.',['Avisar os amigos|k+5 >d|Montei um grupo para alertar a vizinhança.','Ficar mais esperto|sm+3|Agora desconfio até do padeiro.']],
 d:['Aprendizado','Hoje ensino outros idosos a reconhecer golpes.',['Dar palestras no centro comunitário|k+8 f+2|Ninguém cai no conto do falso banco perto de mim.','Contar para os netos|k+4|Eles também aprenderam.']],
});
chain('faculdade_tardia',{k:'Estudos',min:45,max:80,gap:[1,1]},{
 a:['Nunca é tarde','Sempre quis fazer faculdade. Agora, com mais de quarenta e cinco, decidi tentar.',['Prestar vestibular|?sm >b|Passei! Vou ser {o} mais velh{o} da turma.|>c|Não passei desta vez.','Desistir da ideia|h-3|Fica para outra vida.']],
 b:['A turma','A turma tem a idade dos meus filhos. No começo me olhavam de um jeito curioso.',['Me enturmar|h+8 sm+3 >d|Virei a pessoa que todo mundo procura para conselhos.','Ficar na minha|sm+4 >d|Sentei na primeira fila e anotei tudo.']],
 c:['Tentar de novo','Faltou pouco no vestibular.',['Fazer cursinho|$-3000 sm+3 >b@1|Desta vez vai.','Fazer um curso livre|sm+3 h+4|Aprender não precisa de diploma.']],
 d:['A formatura','Chegou o dia da minha formatura.',['Subir no palco|sm+5 h+20 f+1|Meus netos gritaram meu nome na plateia.','Fazer o discurso da turma|?sm h+20 f+3|Falei sobre começar de novo. Ninguém segurou o choro.|h+15|Gaguejei, mas me aplaudiram de pé.']],
});
chain('casa_praia',{k:'Sonhos',min:40,max:80,v:[80000,250000],gap:[1,2]},{
 a:['A casa na praia','Sempre sonhei com uma casa na praia. Vi uma à venda.',['Comprar|$-v h+15 >b|Cheiro de maresia todos os dias.','Alugar por temporada|$-3000 h+8|Só um gostinho.']],
 b:['Os fins de semana','A casa virou ponto de encontro da família.',['Receber todo mundo|h+10 k+3 >c|Casa cheia, rede na varanda e peixe frito.','Usar só para descansar|h+8 hl+3 >c|Silêncio e mar.']],
 c:['A manutenção','A maresia está destruindo a casa.',['Reformar|$-15000 >d|Telhado novo, pintura nova.','Vender|$+v h-4|Sonho caro demais.']],
 d:['Para sempre','Decidi passar a velhice ali.',['Mudar de vez|h+15 hl+5|Acordo com o barulho das ondas.','Deixar para os filhos|k+4|Um lugar para a família se reunir quando eu não estiver.']],
});
chain('amigo_doente',{k:'Amizade',min:50,max:90,who:'friend',gap:[1,1]},{
 a:['A notícia','{p}, meu amigo de tantos anos, me contou que está muito doente.',['Ficar ao lado d{ele}|bond+12 h-6 >b|Prometi não deixar {ele} sozinh{o2}.','Ter dificuldade de lidar|h-8 >c|Não sei o que dizer.']],
 b:['Últimos desejos','{p} tem uma lista de coisas que quer fazer.',['Realizar a lista junto|$-5000 h+8 bond+15 >d|Fomos ao estádio, à praia e a um show de rock.','Fazer uma festa surpresa|$-2000 h+10 bond+10 >d|Todos os amigos de uma vida inteira.']],
 c:['O afastamento','Fiquei semanas sem visitar {p}.',['Criar coragem e ir|bond+10 >b|{p} só disse: "Que bom que você veio."','Mandar mensagens|bond+3 >d|Não é o mesmo.']],
 d:['A despedida','{p} se foi.',['Fazer a homenagem no velório|h-12 k+4|Contei como nos conhecemos. Riram e choraram.','Guardar o luto em silêncio|h-15|A saudade é do tamanho da amizade.']],
});
chain('hobby_velhice',{k:'Vida',min:55,max:95,gap:[1,1]},{
 a:['Tempo livre','Com mais tempo livre, quero aprender algo que nunca tive tempo.',['Xadrez na praça|sm+4 >b|Os velhinhos da praça me receberam com desconfiança.','Marcenaria|sm+3 >c|Primeiro projeto: um banquinho torto.','Dança de salão|tal.dance+6 h+8 >d|Dois pra lá, dois pra cá.']],
 b:['O campeonato da praça','Ganhei confiança e me inscrevi no campeonato de xadrez da praça.',['Jogar com estratégia|?sm h+12 f+1|Venci o campeonato da praça! Ganhei um troféu de plástico lindo.','Jogar por diversão|h+8|Perdi todas, ri muito.']],
 c:['Peças de madeira','Os banquinhos agora saem retos. Os vizinhos encomendam.',['Vender as peças|$+3000 h+8|Virei marceneir{o} de bairro.','Dar de presente|k+5 h+8|Toda a família tem um banquinho meu.']],
 d:['O baile','No baile da terceira idade, alguém me tirou para dançar.',['Dançar a noite toda|h+15 hl+3|Esqueci da idade.','Sentar e assistir|h+5|Mas sorri o baile inteiro.']],
});
