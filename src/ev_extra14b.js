// ===== Mais eventos de golpe e paranormal =====
pack({k:'Governo',w:1.3,cd:9,min:18,when:DW(()=>true)},[
  ['Pedido de perdão','A família de uma vítima da repressão pede um pedido público de perdão.',['Pedir perdão em rede nacional|appr+8 k+10|Um momento histórico.','Recusar|appr-6 k-6|A ferida continua aberta.']],
  ['Biblioteca nacional','Intelectuais pedem uma grande biblioteca pública.',['Construir|appr+5 k+4 sm+2|A maior do continente.','Recusar|appr-2|Livros não dão votos.']],
  ['Robô de propaganda','Assessores sugerem perfis falsos na internet para defender o governo.',['Aprovar|appr+4 k-8|Milhares de robôs me elogiando.','Recusar|k+4|Prefiro críticas reais.']],
  ['Prisão superlotada','As prisões estão superlotadas, inclusive de presos políticos.',['Anistia para presos políticos|appr+8 k+8|Milhares de famílias reunidas.','Construir mais presídios|appr-4|Mais celas, mesmo problema.']],
]);
pack({k:'Revolução',w:1.3,cd:9,min:18,when:RV(()=>true)},[
  ['Grafite gigante','Artistas pintam seu rosto num prédio de 20 andares.',['Agradecer em segredo|apoio+6 rsusp+6|Virou ponto turístico.','Pedir para apagarem|rsusp-3|Pintaram por cima, mas todo mundo lembra.']],
  ['Rede de apoio','Mães de presos políticos formam uma rede de apoio ao movimento.',['Apoiar|apoio+8 k+4|Elas se tornaram a cara mais forte da causa.','Manter distância|h+0|Não quero que elas corram riscos.']],
  ['Golpe frustrado de outro grupo','Outro grupo tenta um golpe antes do seu e fracassa.',['Hibernar o movimento|rsusp-10|A repressão vai ser pesada.','Aproveitar o caos|apoio+6 rsusp+10|O governo está assustado.']],
  ['Fuga de presos','Dez companheiros fogem de um presídio e pedem abrigo.',['Abrigar|membros+10 rsusp+10|Heróis da causa.','Ajudar a sair do país|$-8000|Seguros, longe daqui.']],
]);
pack({k:'Paranormal',w:1.3,cd:9,min:14,when:PH},[
  ['Elevador fantasma','Um elevador de um prédio comercial para sempre no 13º andar, que não existe.',['Descer no 13º|?40 prova+6|Um corredor antigo, cheio de portas fechadas.|h-10|Só escuridão. Voltei correndo.','Ficar no elevador|prova+2|A porta abriu e fechou sozinha.']],
  ['Mulher do rio','Pescadores falam de uma mulher que canta no rio à meia-noite.',['Ir ouvir|?50 prova+4|Ouvi a canção. Linda e triste.|hl-15|Quase me afoguei seguindo a voz.','Pesquisar a lenda|sm+2 prova+1|Uma lenda de 200 anos.']],
  ['Hospital de bonecas','Um sobrado cheio de bonecas antigas está à venda.',['Visitar à noite|prova+3 h-6|Uma boneca estava em outra posição na saída.','Comprar uma boneca|$-200 prova+1|Ela está na minha estante. Me olhando.']],
  ['Livro em branco','Você compra um livro em branco que amanhece escrito.',['Ler o que está escrito|prova+4 h-4|Descreve coisas que vão acontecer amanhã.','Queimar|h+2|As cinzas formaram uma palavra.']],
  ['Câmera de segurança','Uma loja te manda imagens de algo atravessando a vitrine fechada.',['Analisar quadro a quadro|prova+4|Não é reflexo. Não é truque.','Publicar direto|f+4 prova+1|Milhões de visualizações.']],
]);
pack({k:'Maldição',w:1.2,cd:10,min:14,when:CC},[
  ['Sangue de criatura','Um colecionador quer comprar um frasco do seu sangue.',['Vender|$+20000 hl-4|Nunca mais quero saber o que ele faz com isso.','Recusar|h+0|Meu sangue é meu.']],
  ['Igreja oferece ajuda','Um padre se oferece para rezar pela sua alma.',['Aceitar|?20 cura|Algo mudou dentro de mim.|hl-6|A água benta queimou.','Recusar|h+0|Minha alma é complicada.']],
  ['Memórias de antes','Você esquece cada vez mais como era ser humano.',['Escrever um diário|h+4|Para lembrar quem eu era.','Deixar ir|h-6|O monstro fica mais forte.']],
]);
