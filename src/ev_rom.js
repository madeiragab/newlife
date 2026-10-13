// ===== Eventos de romance nos modos fictícios =====
// crew:'par' = o par do jogador ({c}) · crew:'sol' = alguém solteiro do grupo que pode virar par
const RP=id=>RW(sc=>sc.id===id&&!!romPar()), RS=id=>RW(sc=>sc.id===id&&!romPar()&&romSol()), RR=id=>RW(sc=>sc.id===id&&!!romPar()&&romSol());
// ---------- apocalipse zumbi ----------
pack({k:'Amor',w:1.1,cd:25,scen:'zumbi',when:RS('zumbi'),crew:'sol'},[
  ['Turno de vigia a dois','Você e {c} ficam de vigia a noite inteira, no teto do carro, dividindo um cobertor.',['Conversar até o sol nascer|am+12 h+6|Descobri que {c} tem medo do escuro e ri de piada ruim. Igual a mim.','Ficar em silêncio, ombro com ombro|am+8 h+4|Às vezes o silêncio diz mais.','Dormir no turno|am-4 h-2|{c} cobriu meu turno sozinh{co}. Não reclamou, mas anotou.']],
  ['Curativo','{c} cortou a mão abrindo uma lata e pede ajuda.',['Fazer o curativo com cuidado|am+10 chp+5|Nossos olhos se cruzaram tempo demais para um curativo.','Mandar {celn} se virar|am-6|{c} se virou. E lembrou disso depois.']],
  ['Dança no posto','Um rádio de pilha pega uma música lenta. {c} estende a mão.',['Dançar|am+14 h+8|Dançamos entre as bombas de gasolina. O grupo fingiu que não viu.','Rir e recusar|am-3 h+2|{c} dançou com o vento.']],
  ['Declaração no meio da fuga','Na correria de uma fuga, {c} grita: "Se a gente sair dessa, eu te beijo!"',['Sair dessa e cobrar|?pwr am+15 namorar h+8|Saímos. Cobrei. {c} pagou.|hl-8 am+6|Saímos machucados, mas a promessa ficou no ar.','Fingir que não ouviu|am-2|Ficou um clima esquisito no carro.']],
  ['Ciúme no grupo','Alguém do grupo está dando em cima de {c}, e {c} só olha para você.',['Chamar {c} para conversar|am+10 namorar|"Achei que você nunca ia perceber." Agora estamos juntos.','Deixar rolar|am-8|{c} cansou de esperar.']],
  ['Bilhete no para-brisa','Você acha um bilhete preso no para-brisa: "Você é a melhor coisa do fim do mundo." A letra é de {c}.',['Responder com outro bilhete|am+12 h+6|A troca de bilhetes virou nosso jeito secreto de conversar.','Mostrar para o grupo|am-10 h+2|Todo mundo riu. {c} não.']],
]);
pack({k:'Amor',w:1.3,cd:25,scen:'zumbi',when:RP('zumbi'),crew:'par'},[
  ['Aniversário no fim do mundo','Hoje é aniversário de {c}. Não tem bolo, não tem loja, não tem nada.',['Fazer um bolo de bolacha com leite em pó|-it:@comida am+15 h+8|{c} chorou. Disse que foi o melhor aniversário da vida.','Achar um presente num saque|?sc.san am+12 it:livro|Achei um livro que {c} adorava antes de tudo.|hl-8|Os zumbis acharam primeiro.','Esquecer|am-15 h-4|{c} passou o dia calad{co}.']],
  ['Medo de perder','{c} acorda chorando de um pesadelo em que você era mordid{o}.',['Abraçar até {celn} dormir|am+10 h+4|Ficamos assim até amanhecer.','Prometer que nunca vai acontecer|am+6 h-2|Uma promessa que ninguém pode cumprir.']],
  ['Pedido com anel de lata','{c} aparece com um anel feito de lacre de latinha e se ajoelha no meio da estrada.',['Dizer sim|noivar am+12 h+12|Sim! O grupo bateu palmas e um zumbi gemeu ao longe, como quem aprova.','Dizer que é cedo|am-12 h-4|{c} guardou o anel no bolso. Com cuidado.'],{when:RW(sc=>sc.id==='zumbi'&&!!romPar()&&romPar().par==='namoro')}],
  ['Casamento no acampamento','O grupo quer celebrar o noivado de vocês com um casamento de verdade.',['Casar hoje mesmo|casar am+15 moral+8|Casamos sob uma lona azul, com flores de plástico de um cemitério. Foi perfeito.','Esperar um lugar seguro|am-4|{c} entendeu. Mais ou menos.'],{when:RW(sc=>sc.id==='zumbi'&&!!romPar()&&romPar().par==='noivo')}],
  ['Bebê no apocalipse?','{c} pergunta se você pensa em ter filhos, mesmo agora.',['"Quero. O mundo precisa recomeçar."|am+10 grav|A gente decidiu tentar.','"Num mundo desses? Não."|am-4|{c} entendeu, mas ficou triste.']],
  ['Briga no carro','Você e {c} brigam feio sobre quem deve ficar com a última água.',['Pedir desculpas primeiro|am+8 h+2|Fizemos as pazes dividindo a garrafa.','Bater o pé|am-12 h-4|Dormimos em carros diferentes.']],
  ['{c} foi ferid{co}','{c} se feriu numa saída e está com febre.',['Cuidar a noite inteira|-it:@remedio chp+30 am+12|A febre baixou de madrugada. {c} segurou minha mão o tempo todo.','Sair atrás de remédio sozinh{o}|?pwr chp+25 am+15 it:kit|Voltei com remédio e um corte na testa.|hl-15 chp-10|Voltei de mãos vazias.']],
  ['Ex aparece','Um sobrevivente se aproxima do grupo: é o ex de {c}.',['Deixar entrar no grupo|am-6 crew|{c} ficou desconfortável. {n} também.','Mandar seguir viagem|am+6 h-2|{c} agradeceu com o olhar.']],
  ['Mordida','{c} esconde o braço. Você vê o curativo sujo de sangue. Pode ser mordida.',['Olhar o braço|?60 am+6 h+4|Era só um arranhão de arame. Respirei de novo.|cdie h-20|Era mordida. {c} pediu que fosse eu. Fui eu.','Fingir que não viu|h-6|Fiquei de olho a noite inteira.']],
  ['Lua de mel improvisada','O grupo fica de vigia para vocês terem uma noite sozinhos num hotel abandonado.',['Aceitar|am+15 h+12|Uma suíte presidencial empoeirada, só para nós. Esqueci que o mundo acabou.','Recusar, é perigoso|am-4|Melhor prevenir.'],{when:RW(sc=>sc.id==='zumbi'&&!!romPar()&&romPar().par==='casado')}],
  ['A promessa','{c} pede que, se for mordid{co}, você não hesite.',['Prometer|am+6 h-6|Prometi. Rezo para nunca precisar cumprir.','Dizer que vai achar a cura|am+10 h+2|{c} sorriu. Não acredita, mas gostou de ouvir.']],
  ['Ciúmes','{c} viu você rindo muito com outra pessoa do grupo.',['Explicar que é só amizade|?car am+4|{c} acreditou.|am-10|{c} não acreditou.','Provocar|am-15 h+2|Foi infantil. Eu sei.'],{when:RR('zumbi')}],
  ['Música só nossa','{c} encontra um toca-discos e um vinil que você conhece de cor.',['Dançar na sala vazia|am+12 h+10|Por três minutos e meio, o mundo voltou a ser normal.','Guardar para um dia especial|am+4|O vinil vai na carga, embrulhado num casaco.']],
]);
pack({k:'Amor',w:1.2,cd:30,scen:'zumbi',when:RW(sc=>sc.id==='zumbi'&&!!romPar()),crew:'par'},[
  ['Tem um bebê vindo','{c} desmaia de manhã e acorda enjoad{co}. Ou você, quem sabe.',['Fazer o teste da farmácia saqueada|grav am+8|Agora é esperar.','Achar que é só a comida estragada|h+0|Talvez seja.']],
  ['Partida de baralho','À noite, você e {c} jogam baralho valendo tarefas da base.',['Perder de propósito|am+8 h+6|Lavei a louça feliz.','Ganhar e cobrar|am+2 h+8|{c} lavou a louça resmungando.']],
  ['Saudade de antes','{c} conta como era a vida antes. Você percebe que talvez nunca tivessem se conhecido.',['Dizer que o fim do mundo trouxe uma coisa boa|am+12 h+6|{c} riu e me chamou de brega.','Ficar em silêncio|am+4 h-2|Algumas coisas não têm resposta.']],
]);
// ---------- ilha deserta ----------
pack({k:'Amor',w:1.1,cd:25,scen:'ilha',when:RS('ilha'),crew:'sol'},[
  ['Pôr do sol na pedra','{c} chama você para ver o pôr do sol da pedra mais alta da ilha.',['Ir|am+12 h+8|O céu ficou rosa. Ninguém falou nada por meia hora.','Ficar cuidando do fogo|am-4|Alguém precisava cuidar do fogo.']],
  ['Coco aberto','{c} passou a manhã inteira tentando abrir um coco para você.',['Agradecer com um beijo na bochecha|am+14 h+6|{c} ficou vermelh{co} até as orelhas.','Agradecer com um aperto de mão|am-2 h+2|Educad{o} demais.']],
  ['Banho de cachoeira','Você chega na cachoeira e {c} já está lá.',['Entrar também|am+12 h+8|Rimos, jogamos água, e a mão encostou na mão.','Esperar a sua vez|am+2|Respeitei. {c} pareceu meio decepcionad{co}.']],
  ['Mensagem na garrafa','Você encontra uma garrafa na praia. Dentro, um bilhete de {c}: "Se ninguém nos achar, tudo bem. Você está aqui."',['Responder com outro bilhete|am+14 namorar h+8|Começamos a namorar por correio de garrafa, numa ilha de 2 quilômetros.','Fingir que não achou|am-6|Joguei a garrafa no mar. Me arrependi na hora.']],
]);
pack({k:'Amor',w:1.3,cd:25,scen:'ilha',when:RP('ilha'),crew:'par'},[
  ['Casinha para dois','{c} quer construir uma cabana só de vocês dois, longe do acampamento.',['Construir juntos|abrigo+8 am+12 h+6|Ficou torta, com teto de palha e vista para o mar. Nossa casa.','Ficar no abrigo de todos|am-4|Ainda acho mais seguro.']],
  ['Pedido na areia','Você acorda e encontra escrito na areia, em letras gigantes: "CASA COMIGO?"',['Escrever SIM do lado|noivar am+15 h+12|Se um avião passar agora, vai achar que a ilha é um cartão de dia dos namorados.','Apagar e explicar que é cedo|am-12 h-4|{c} ficou olhando o mar.'],{when:RW(sc=>sc.id==='ilha'&&!!romPar()&&romPar().par==='namoro')}],
  ['Casamento na praia','Os outros náufragos preparam um casamento com tudo o que acharam na praia.',['Casar ao pôr do sol|casar am+15 h+12|Coroa de flores, alianças de concha e caranguejos de convidados.','Esperar o resgate para casar direito|am-4|{c} entendeu.'],{when:RW(sc=>sc.id==='ilha'&&!!romPar()&&romPar().par==='noivo')}],
  ['Tempestade','Uma tempestade derruba o abrigo. Você e {c} passam a noite abraçados numa caverna.',['Contar histórias até a chuva passar|am+12 h+4|A melhor noite de tempestade da minha vida.','Tentar salvar o abrigo|?pwr abrigo+5 am+6|Salvei metade.|hl-10|O vento me derrubou.']],
  ['Pescaria','{c} jura que pesca melhor que você.',['Apostar um beijo|?50 am+10 h+8 it:peixe|Ganhei. Cobrei.|am+12 h+6|Perdi. Paguei com gosto.','Deixar {celn} ganhar|am+6 it:peixe|{c} desconfiou, mas ficou feliz.']],
  ['Saudade de casa','{c} chora de saudade da família.',['Prometer que vão sair daqui juntos|am+10 h+2|"Juntos", repetiu. Gostei de como soou.','Distrair com uma brincadeira|am+6 h+6|Arranquei uma risada no meio do choro.']],
  ['Ciúmes do náufrago novo','{c} fica com ciúmes do jeito que você conversa com outra pessoa da ilha.',['Tranquilizar|?car am+6|Funcionou.|am-8|Não funcionou.','Dizer que é bobagem|am-10|Bobagem para quem?'],{when:RR('ilha')}],
  ['Família na ilha','{c} diz que, se o resgate demorar, quer ter um filho aqui mesmo.',['Topar|grav am+10|Decidimos. A ilha pode ganhar mais um morador.','Esperar o resgate|am-2|É mais seguro esperar.']],
  ['Coração na pedra','{c} talhou um coração com as iniciais de vocês numa pedra da praia.',['Talhar a data embaixo|am+10 h+6|Dia {dia}. Para quem achar a pedra um dia.','Achar fofo|am+6 h+4|Muito fofo.']],
  ['Febre','{c} está com febre alta depois de pisar num coral.',['Cuidar sem dormir|chp+25 am+14 h-4|Passei a noite trocando panos molhados. A febre baixou.','Usar o remédio que sobrou|-it:@remedio chp+35 am+10|O último remédio foi para {c}. Valeu a pena.']],
  ['Briga pela comida','Vocês brigam porque {c} comeu o último peixe sem dividir.',['Perdoar|am+6 h-2|É só um peixe.','Ficar de cara feia o dia todo|am-10 h-4|Ilha pequena demais para ficar de cara feia.']],
  ['Lua de mel na ilha','Vocês passam o dia na praia do outro lado da ilha, só os dois.',['Aproveitar|am+15 h+12|Areia branca, ninguém por perto. Esqueci que estava pres{o} aqui.','Voltar cedo para o acampamento|am-4|O dever chama.'],{when:RW(sc=>sc.id==='ilha'&&!!romPar()&&romPar().par==='casado')}],
]);
// ---------- isekai ----------
pack({k:'Amor',w:1.1,cd:25,scen:'isekai',when:RS('isekai'),crew:'sol'},[
  ['Festival das lanternas','A cidade solta lanternas mágicas no rio, e {c} pergunta se você quer soltar uma junto.',['Soltar a lanterna juntos|am+14 h+8|A lanterna ficou dourada. Dizem que é sinal de amor verdadeiro.','Soltar sozinh{o}|am-2 h+4|A lanterna ficou azul. Ninguém soube explicar.']],
  ['Poção do amor','Um vendedor ambulante oferece uma poção do amor "garantida".',['Comprar e dar para {c}|ouro-20 ?50 am+20|Funcionou? Ou {c} já gostava de mim? Nunca vou saber.|am-10|{c} percebeu o gosto de morango suspeito.','Recusar|k+2|Amor de verdade não vem em frasco.']],
  ['Salvamento heroico','Um ogro agarra {c} no meio da batalha.',['Salvar {c} com tudo|?pwr am+18 xp+20|Arranquei {c} das mãos do ogro. O olhar que recebi valeu mais que o XP.|hl-15 am+8|Salvei, mas apanhei.','Gritar para alguém ajudar|am-4|Alguém ajudou. Não fui eu.']],
  ['Aula de magia','{c} se oferece para te ensinar um feitiço de luz.',['Aceitar|mana+10 am+10|O feitiço saiu em forma de coração. Foi sem querer. Eu juro.','Recusar|am-2|Prefiro aprender sozinh{o}.']],
  ['Baile da guilda','A guilda dá um baile e {c} está sem par.',['Convidar|am+14 namorar h+8|Dançamos a valsa élfica três vezes. No fim, {c} me beijou.','Ir sozinh{o}|am-4 h+4|Dancei com um anão. Também foi divertido.']],
]);
pack({k:'Amor',w:1.3,cd:25,scen:'isekai',when:RP('isekai'),crew:'par'},[
  ['Pedido sob os dois sóis','{c} se ajoelha no alto da colina com um anel de mithril.',['Aceitar|noivar am+15 h+12|Os dois sóis se alinharam. Os elfos dizem que é sorte para sempre.','Pedir mais tempo|am-12|{c} guardou o anel. Com cuidado.'],{when:RW(sc=>sc.id==='isekai'&&!!romPar()&&romPar().par==='namoro')}],
  ['Casamento no templo','A sacerdotisa da deusa se oferece para casar vocês.',['Casar no templo|casar ouro-30 am+15 h+15|Pétalas mágicas caíram do teto. Um anão chorou alto na primeira fila.','Casar só na guilda, simples|casar am+10 h+8|Uma festa de taverna. Hidromel até de manhã.'],{when:RW(sc=>sc.id==='isekai'&&!!romPar()&&romPar().par==='noivo')}],
  ['A família de {c}','{c} quer te apresentar à família, num vilarejo a dois dias de viagem.',['Ir|am+12 h+6 ouro+20|O pai de {c} me testou na queda de braço. Perdi. Ele gostou de mim mesmo assim.','Adiar|am-6|Fica para depois.']],
  ['Ciúmes de outro mundo','{c} pergunta se você tinha alguém no seu mundo de origem.',['Contar a verdade|am+6 h+2|{c} ouviu tudo, segurou minha mão e disse que agora o meu mundo é aqui.','Dizer que não|?car am+4|Acreditou.|am-10|{c} sabe quando eu minto.']],
  ['A volta para casa','{c} pergunta: "Se você achar o portal, vai me deixar aqui?"',['"Vem comigo."|am+15 h+6|{c} chorou e disse que iria até o fim do mundo. De qualquer mundo.','"Não sei."|am-12 h-6|A noite ficou fria de repente.']],
  ['Feitiço de proteção','{c} gasta mana para lançar um escudo sobre você antes de dormir.',['Retribuir com outro feitiço|mana-15 am+12|Dormimos dentro de duas bolhas de luz.','Agradecer|am+6|{c} disse que faria isso todas as noites.']],
  ['Bebê élfico?','{c} fala de ter um filho em Eldoria.',['Querer|grav am+10|A deusa abençoe.','Esperar o fim da guerra|am-2|Depois do Rei Demônio.']],
  ['Ferid{co} em batalha','{c} levou um golpe de machado protegendo você.',['Usar a melhor poção|-it:@remedio chp+35 am+12|A ferida fechou. A cicatriz ficou em forma de lua.','Carregar {c} até o curandeiro|ouro-20 chp+30 am+15|Andei a noite inteira. Valeu cada passo.']],
  ['Taverna romântica','O dono da taverna reservou a mesa da lareira para vocês.',['Aceitar|ouro-10 am+12 h+10|Ensopado, hidromel e um bardo que tocou nossa música.','Sentar com o grupo|am+2 moral+6|Todo mundo junto também é bom.']],
  ['Rival no amor','Um cavaleiro arrogante desafia você a um duelo pelo coração de {c}.',['Aceitar o duelo|?pwr am+15 xp+25|Derrubei o cavaleiro na lama. {c} riu tanto que caiu da cadeira.|hl-15 am+6|Perdi o duelo, mas {c} cuidou das minhas feridas.','Deixar {c} decidir|?car am+12|{c} nem olhou para o cavaleiro.|am-6|{c} achou que eu não liguei.'],{when:RW(sc=>sc.id==='isekai'&&!!romPar())}],
  ['Lua de mel na cidade flutuante','Um nobre oferece uma semana em Aerion para os recém-casados.',['Aceitar|am+15 h+14|Nuvens embaixo dos pés e café da manhã servido por fadas.','Recusar, há monstros para caçar|am-4 xp+10|O dever primeiro.'],{when:RW(sc=>sc.id==='isekai'&&!!romPar()&&romPar().par==='casado')}],
  ['Briga por dinheiro','{c} gastou metade do ouro num chapéu encantado.',['Rir e usar o chapéu também|am+8 h+6|O chapéu canta. Desafinado.','Brigar|am-12 ouro+10|Devolvemos o chapéu. Clima pesado.']],
]);
// ---------- Marte ----------
pack({k:'Amor',w:1.1,cd:25,scen:'marte',when:RS('marte'),crew:'sol'},[
  ['Pôr do sol azul','Em Marte, o pôr do sol é azul. {c} chama você até a escotilha para ver.',['Ver juntos|am+12 h+8|Ficamos de mãos dadas no vidro gelado. Azul. Lindo.','Continuar trabalhando|am-2|O pôr do sol de amanhã é igual.']],
  ['Batata em forma de coração','{c} serve uma batata cortada em forma de coração no jantar.',['Agradecer com um beijo|am+14 namorar h+8|A colônia inteira assobiou pelo rádio interno.','Comer sem comentar|am-6|{c} ficou olhando o prato.']],
  ['Caminhada lunar','{c} propõe uma caminhada de traje até a borda da cratera.',['Ir|o2-4 am+12 h+6|Encostamos os capacetes. Dá para ouvir a voz pelo vidro.','Recusar, desperdício de oxigênio|am-4|{c} foi sozinh{co}.']],
  ['Playlist da Terra','{c} montou uma playlist com músicas que lembram você.',['Ouvir juntos no módulo|am+12 h+8|Dançamos em gravidade baixa. Quase voamos.','Agradecer|am+4|Vou ouvir depois.']],
]);
pack({k:'Amor',w:1.3,cd:25,scen:'marte',when:RP('marte'),crew:'par'},[
  ['Pedido em Marte','{c} imprimiu um anel na impressora 3D e escreveu "CASA COMIGO" com pedras vermelhas.',['Aceitar|noivar am+15 h+12|O primeiro noivado de outro planeta. A Terra vai surtar.','Pedir para esperar a volta|am-10|{c} guardou o anel no bolso do traje.'],{when:RW(sc=>sc.id==='marte'&&!!romPar()&&romPar().par==='namoro')}],
  ['O primeiro casamento de Marte','A Terra quer transmitir o casamento de vocês ao vivo.',['Casar ao vivo|casar am+15 h+12 ciencia+5|Dois bilhões de pessoas viram. Um atraso de vinte minutos no "sim".','Casar só com a equipe|casar am+12 h+10|Íntimo, com bolo de batata.'],{when:RW(sc=>sc.id==='marte'&&!!romPar()&&romPar().par==='noivo')}],
  ['Primeiro bebê marciano','{c} pergunta se vocês teriam coragem de ter o primeiro bebê nascido em Marte.',['Ter coragem|grav am+10|Os médicos da Terra estão em pânico. Nós estamos felizes.','Esperar voltar para a Terra|am-2|É mais sensato.']],
  ['Claustrofobia','{c} tem uma crise no habitat apertado.',['Ficar junto até passar|am+12 h-2 chp+5|Respiramos juntos, contando até dez, umas trinta vezes.','Dar um calmante|-it:calm am+6|Funcionou.']],
  ['Tempestade de poeira','Uma tempestade isola vocês dois no rover por uma noite inteira.',['Aproveitar a noite|o2-6 am+15 h+10|Melhor tempestade da história.','Racionar oxigênio em silêncio|o2-2 am+4|Sobrevivemos. Um pouco tensos.']],
  ['Mensagem para a família','{c} quer gravar um vídeo apresentando você para a família na Terra.',['Gravar|am+10 h+6|A mãe de {c} respondeu vinte minutos depois, chorando de alegria.','Ficar envergonhad{o}|am-2|Gravei só um aceno.']],
  ['Briga na estufa','Vocês discutem sobre quem matou as mudas de batata.',['Assumir a culpa|am+8|Fui eu. Admito.','Culpar {c}|am-12|Fui eu. Não admiti.']],
  ['Saudade da chuva','{c} diz que sente falta de chuva.',['Fazer chover no chuveiro da base|am+12 h+8 o2-2|Gastamos a água da semana. Valeu cada gota.','Prometer uma chuva na Terra|am+6|"Vou cobrar."']],
  ['Acidente no traje','O traje de {c} rasgou lá fora.',['Correr para remendar|-it:remendo chp+10 am+15|Remendei com as mãos tremendo. {c} respirou de novo.','Puxar {c} de volta para a câmara|?pwr am+12|Puxei a tempo.|chp-25 am+6|Puxei, mas {c} ficou mal.']],
  ['Ciúmes do colono novo','{c} acha que você está próxim{o} demais de outra pessoa da colônia.',['Conversar|?car am+6|Resolvido.|am-10|Não resolveu.','Ignorar|am-12|Base pequena demais para ciúmes.'],{when:RR('marte')}],
]);
// ---------- super-heróis: romance com aliados ----------
pack({k:'Amor',w:1,cd:25,scen:'heroi',when:RS('heroi'),crew:'sol'},[
  ['Treino a dois','{c} propõe um treino de combate. Vocês acabam caídos no tatame, rindo.',['Ficar ali mais um pouco|am+12 h+6|Ficamos olhando para o teto e falando bobagem.','Levantar e voltar ao treino|pw+3 am-2|Foco.']],
  ['Máscara caiu','A máscara de {c} cai no meio da patrulha. Você vê o rosto pela primeira vez.',['Dizer que é lind{co}|am+14 h+6|{c} recolocou a máscara rápido. Mas sorriu.','Fingir que não viu|am+4|{c} agradeceu o respeito.']],
  ['Herói e herói','{c} salva você de um prédio caindo e não solta mais a sua mão.',['Beijar no meio da fumaça|am+15 namorar h+8|Os bombeiros aplaudiram. O jornal amanhã vai ter manchete.','Agradecer e voltar ao trabalho|am+4|Tem gente para salvar.']],
]);
pack({k:'Amor',w:1.1,cd:25,scen:'heroi',when:RP('heroi'),crew:'par'},[
  ['Encontro interrompido','No meio do jantar com {c}, o alarme de crime toca para os dois ao mesmo tempo.',['Ir juntos|?pwr am+12 rep+8|Prendemos os bandidos e voltamos para a sobremesa.|hl-8 am+6|Voltamos machucados, mas juntos.','Deixar a cidade se virar uma noite|am+14 crime+8 h+6|Uma noite só nossa.']],
  ['Casal de heróis','A imprensa descobre que {codinome} e {c} estão juntos.',['Assumir em público|am+10 rep+6 sec-6|Viramos o casal mais famoso da cidade.','Negar|am-6 sec+4|{c} ficou chatead{co}.']],
  ['Pedido no telhado','{c} espera você no alto da torre do relógio com um anel.',['Aceitar|noivar am+15 h+12|A cidade inteira brilhava lá embaixo.','Pedir tempo|am-10|O anel voltou para o bolso.'],{when:RW(sc=>sc.id==='heroi'&&!!romPar()&&romPar().par==='namoro')}],
  ['Casamento secreto','Vocês decidem casar com os aliados de testemunha, de madrugada.',['Casar|casar am+15 h+12|Máscaras no bolso, juras sob a lua.','Esperar a paz|am-4|Quando {inimigo} cair.'],{when:RW(sc=>sc.id==='heroi'&&!!romPar()&&romPar().par==='noivo')}],
  ['{inimigo} descobriu','{inimigo} descobriu que você ama {c} e mandou um recado.',['Proteger {c} a noite toda|am+10 h-6|Ninguém apareceu. Desta vez.','Ir atrás de {inimigo}|?pwr pista+15 am+6|Encontrei um dos esconderijos.|hl-15 chp-15|Era armadilha. {c} se feriu me salvando.']],
]);
