// ===== Histórias em cadeia: justiça, acidentes e escolhas difíceis =====
chain('acidente_carro',{k:'Trânsito',min:18,max:80,when:m=>!!m.lic,npc:1,gap:[1,1]},{
 a:['A batida','Bati o carro num cruzamento. O outro motorista, {p}, saiu furios{o2}.',['Assumir a culpa|k+5 $-3000 >b|Paguei o conserto d{ele}.','Dizer que a culpa foi d{ele}|>c|Começou a discussão no meio da rua.','Chamar a polícia para registrar|>d|Melhor fazer tudo certo.']],
 b:['Gentileza','{p} ficou surpres{o2} com a minha honestidade e me convidou para um café.',['Aceitar|vira:amigo h+6 >g@1|Viramos amigos por causa de uma batida.','Recusar com educação|k+2|Cada um seguiu seu caminho.']],
 c:['A discussão','A briga esquentou. Juntou gente em volta.',['Me acalmar e propor o seguro|k+3 >d|Respiramos e trocamos telefones.','Partir para cima|?fight hl-3 >e|Ganhei a briga e um processo.|hl-10 >e|Perdi a briga e ganhei um processo.']],
 d:['O laudo','A perícia analisou o acidente.',['Esperar o resultado|?50 $+2000 h+6 >f|A culpa foi d{ele}. O seguro d{ele} pagou tudo.|$-4000 >f|A culpa foi minha. Seguro, franquia e dor de cabeça.']],
 e:['O processo','{p} entrou com um processo por agressão.',['Fazer acordo|$-5000 >f|Paguei para encerrar.','Ir até o fim|?40 >f|O juiz arquivou.|$-8000 k-4 >f|Fui condenad{o} a pagar indenização.']],
 f:['Lição de trânsito','Depois daquilo, dirijo com o dobro de atenção.',['Fazer um curso de direção defensiva|$-500 sm+2|Aprendi a prever as besteiras dos outros.','Vender o carro e andar de ônibus|$+15000 h+2|Menos estresse, mais podcast.']],
 g:['Amizade improvável','{p} virou um dos meus melhores amigos. Sempre contamos a história da batida.',['Fazer uma festa de aniversário da batida|h+8 bond+10|Bolo com um carrinho amassado em cima.','Ajudar {p} numa mudança|k+4 bond+8|Amigo de verdade carrega geladeira.']],
});
chain('jurado',{k:'Justiça',min:21,max:70,gap:[1,1]},{
 a:['Convocação','Fui convocad{o} para ser jurad{o} num julgamento de homicídio.',['Ir|>b|Não dá para recusar. E eu nem queria.','Tentar ser dispensad{o}|?40 h+2|Me dispensaram.|>b|Não me dispensaram.']],
 b:['O julgamento','O réu é um jovem acusado de matar um comerciante durante um assalto. As provas são confusas.',['Prestar atenção em cada detalhe|sm+3 >c|Anotei tudo no caderninho.','Formar opinião logo|>c|Ele tem cara de culpado.']],
 c:['A sala secreta','Os jurados estão divididos: seis querem condenar, seis querem absolver.',['Defender que há dúvida|?sm k+5 >d|Convenci os outros a rever as provas.|>e|Fui voto vencido.','Votar com a maioria|>e|Melhor não discutir.']],
 d:['A dúvida','Revendo as provas, encontramos uma contradição no depoimento da principal testemunha.',['Votar pela absolvição|k+8 >f|O júri absolveu o rapaz.','Votar pela condenação mesmo assim|k-3 >e|Fiquei com a consciência pesada.']],
 e:['O veredito','O réu foi condenado.',['Aceitar|h-3|A justiça foi feita. Eu acho.','Ficar com a dúvida para sempre|h-6 >g@3-6|Ainda penso nele.']],
 f:['Inocente','Meses depois, a polícia prendeu o verdadeiro culpado. O rapaz era mesmo inocente.',['Sentir alívio|h+12 k+5|Salvamos uma vida.','Contar para todo mundo|f+2 h+8|Virei defensor{a} do júri popular.']],
 g:['A verdade','Anos depois, li no jornal: o homem que ajudei a condenar foi inocentado por um exame de DNA.',['Procurar a família dele|k+8 h-6|Pedi desculpas pessoalmente.','Carregar o peso|h-12|Nunca mais vou julgar ninguém tão rápido.']],
});
chain('amigo_trafico',{k:'Crime',min:16,max:45,who:'friend',gap:[1,1]},{
 a:['Dinheiro fácil','Meu amigo {p} anda de carro novo e tênis caro. Disse que tem um "trabalho" fácil para mim.',['Perguntar que trabalho é|>b|{p} riu e disse: "Entrega. Não pergunta o que é."','Recusar sem perguntar|bond-5 k+3|Já imagino.']],
 b:['A proposta','É só levar uma mochila de um ponto a outro da cidade.',['Aceitar uma vez|k-10 $+3000 >c|Foi a mochila mais pesada da minha vida.','Recusar e tentar tirar {p} dessa|k+6 >d|{p} disse que eu não entendo.']],
 c:['De novo','{p} quer que eu faça mais entregas.',['Continuar|k-10 $+8000 >e|Dinheiro fácil vicia.','Parar|bond-8 >d|{p} não gostou.']],
 d:['A operação','A polícia fez uma operação grande no bairro.',['Ligar para avisar {p}|k-3 bond+5 >f|{p} conseguiu fugir.','Não me meter|>f|{p} foi pres{o2}.']],
 e:['A batida','A polícia parou o carro durante uma entrega.',['Tentar fugir|?30 h+4 >c|Escapei. Por pouco.|arrest:tráfico_de_drogas:2:6|Me pegaram.','Me entregar|arrest:tráfico_de_drogas:1:4 k+2|Contei tudo. Pena menor.']],
 f:['Visita na prisão','Fui visitar {p} na prisão.',['Prometer ajudar quando {ele} sair|k+6 bond+10 >g@2-4|{Ele} chorou pela primeira vez na minha frente.','Dizer que eu avisei|bond-10|{p} virou o rosto.']],
 g:['A saída','{p} saiu da prisão e não tem para onde ir.',['Ajudar a arrumar um emprego|k+10 bond+15|Hoje {p} trabalha numa marcenaria e manda áudio todo domingo.','Emprestar dinheiro|$-2000 bond+6|Foi o que eu pude.']],
});
chain('policial_corrupto',{k:'Justiça',min:18,max:75,v:[500,3000],gap:[1,1]},{
 a:['A blitz','Fui parad{o} numa blitz. O policial disse que tem um "probleminha" no documento e sugeriu resolver ali mesmo.',['Pagar a propina|$-v k-6 >b|Ele sorriu e me liberou.','Recusar e pedir a multa por escrito|k+5 >c|Ele ficou irritado.','Gravar escondido|sm+2 >d|Celular no bolso, gravando tudo.']],
 b:['De novo','O mesmo policial me parou de novo na semana seguinte.',['Pagar de novo|$-v k-5|Virou pedágio.','Denunciar à corregedoria|>e|Desta vez, não.']],
 c:['A multa','Ele aplicou uma multa por algo que eu nem fiz.',['Recorrer|?55 k+3|O recurso foi aceito!|$-800|Recurso negado. Paguei.','Denunciar|>e|Chega.']],
 d:['A gravação','Tenho a gravação do pedido de propina.',['Levar à corregedoria|>e|Entreguei o pen drive com a mão tremendo.','Postar nas redes|f+6 >e|O vídeo viralizou em uma hora.']],
 e:['A investigação','A corregedoria abriu uma investigação.',['Depor|?50 k+8 f+2 >f|O policial foi afastado.|h-6 >g|O caso foi arquivado.']],
 f:['Mudança','Soube que a blitz daquela avenida mudou de equipe.',['Sentir que fiz a diferença|k+5 h+8|Uma andorinha não faz verão, mas ajuda.','Ficar com medo de represália|h-4|Às vezes ainda olho pelo retrovisor.']],
 g:['Arquivado','O caso foi arquivado. O policial continua na rua.',['Seguir em frente|h-4|Fiz minha parte.','Procurar a imprensa|?40 f+4 >f|Uma reportagem reabriu o caso.|h-3|Ninguém se interessou.']],
});
chain('briga_bar',{k:'Encrenca',min:18,max:60,npc:1,gn:'M',gap:[1,1]},{
 a:['A provocação','Num bar, um sujeito chamado {p} começou a me provocar.',['Ignorar e ir embora|k+3|Não vale a pena.','Responder à altura|>b|O bar inteiro parou para olhar.','Pagar uma bebida para acalmar|$-50 ?50 vira:amigo >e|{p} riu e virou meu parceiro de bar.|>b|Ele jogou a bebida em mim.']],
 b:['A briga','Os dois foram para a rua.',['Brigar|?fight hl-4 >c|Ganhei. Mas ele chamou a polícia.|hl-15 >c|Perdi feio.','Correr|h-3|Fui embora correndo e sem dignidade.']],
 c:['A delegacia','Fomos os dois parar na delegacia.',['Fazer as pazes ali mesmo|k+4 >d|O delegado nos fez apertar as mãos.','Registrar queixa|>d|Agora é processo.']],
 d:['O dia seguinte','Acordei com dor no corpo e na consciência.',['Prometer nunca mais|k+3 add.alcool-5|Bar só com amigos.','Rir da história|h+3|Virou anedota de churrasco.']],
 e:['O parceiro de bar','{p} acabou virando companhia de toda sexta.',['Manter a tradição|h+6 add.alcool+3|Toda sexta, mesma mesa.','Diminuir|hl+2|Só de vez em quando.']],
});
chain('denuncia_vizinho',{k:'Dilema',min:18,max:80,npc:1,age:[-15,25],gap:[1,1]},{
 a:['Barulhos estranhos','Escuto gritos e choro de criança vindos da casa de {p}, aqui do lado.',['Ligar para o Conselho Tutelar|k+6 >b|Fiz a denúncia anônima.','Bater na porta|>c|{p} abriu com cara de poucos amigos.','Não me meter|k-6 >d|Aumentei o volume da TV.']],
 b:['A visita','O Conselho Tutelar visitou a casa.',['Acompanhar o caso|k+5 >e|As crianças foram para a casa da avó.','Ficar de longe|>e|Não sei o que aconteceu depois.']],
 c:['A conversa','{p} disse que está passando por um momento difícil e pediu desculpas pelo barulho.',['Oferecer ajuda|k+6 vira:amigo >e|Indiquei um lugar que ajuda famílias.','Desconfiar e denunciar mesmo assim|k+3 >b|Melhor prevenir.']],
 d:['O silêncio','Os gritos pararam. Nunca soube se isso era bom ou ruim.',['Procurar saber|>c|Toquei a campainha.','Esquecer|h-4|Às vezes ainda penso nisso.']],
 e:['Anos depois','Uma das crianças daquela casa, já crescida, me reconheceu na rua e me agradeceu.',['Abraçar|h+12 k+5|Ela disse que aquele dia mudou tudo.','Ficar sem palavras|h+10|Só sorri.']],
});
chain('processo_trabalhista',{k:'Justiça',min:20,max:70,gap:[1,1],when:m=>m.hist.length>0},{
 a:['Os direitos','Um advogado disse que a empresa onde eu trabalhava me deve horas extras.',['Entrar com a ação|>b|Junte os comprovantes.','Deixar para lá|h+0|Página virada.']],
 b:['A audiência','Na audiência, a empresa trouxe três advogados.',['Contar tudo com calma|?sm >c|O juiz pareceu do meu lado.|>d|A empresa apresentou documentos que eu nem lembrava.','Ficar nervos{o}|?35 >c|Mesmo nervos{o}, fui convincente.|>d|Me enrolei nas datas.']],
 c:['A vitória','Ganhei a causa.',['Receber o dinheiro|$+18000 h+12|Justiça. Tarde, mas justiça.','Doar parte para colegas que também foram prejudicados|$+9000 k+8|Ajudei quem não podia pagar advogado.']],
 d:['O acordo','A empresa ofereceu um acordo.',['Aceitar|$+7000 h+4|Melhor um acordo do que nada.','Recorrer|?40 $+15000 h+8|Ganhei no recurso.|$-2000 h-6|Perdi e ainda paguei custas.']],
});
chain('heroi_acidental',{k:'Coragem',min:16,max:75,npc:1,age:[-30,20],gap:[1,1]},{
 a:['O rio','Uma criança caiu no rio perto de onde eu estava.',['Pular|?hl k+12 f+5 >b|Tirei a criança da água.|hl-12 k+10 >b|Tirei a criança, mas quase me afoguei.','Gritar por ajuda|k+4 >c|Um pescador pulou e salvou a criança.']],
 b:['Herói','Os pais da criança, a família {pl}, vieram me agradecer em casa.',['Aceitar o agradecimento|h+12 >d|A mãe me deu um bolo que fez com as próprias mãos.','Dizer que qualquer um faria o mesmo|k+3 h+10 >d|Mas nem todo mundo fez.']],
 c:['O que eu não fiz','Fiquei pensando se deveria ter pulado.',['Fazer um curso de primeiros socorros|sm+3 k+4 >e@2|Da próxima vez, vou saber o que fazer.','Tentar esquecer|h-4|Fiz o que consegui.']],
 d:['A homenagem','A prefeitura me deu uma medalha de honra ao mérito.',['Ir à cerimônia|f+3 h+10 >e@3-8|Minha mãe guardou o recorte do jornal.','Pedir para não ter cerimônia|k+4 >e@3-8|A medalha chegou pelo correio.']],
 e:['O reencontro','Anos depois, alguém bateu na minha porta: "Lembra da criança do rio? Sou eu."',['Convidar para entrar|h+15 k+5|Conversamos a tarde inteira. Vai estudar para ser bombeiro.','Abraçar ali mesmo|h+15|Não precisei dizer nada.']],
});
