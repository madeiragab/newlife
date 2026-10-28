// ===== 3.4: eventos de bichos por espécie (mais de 300) =====
// Cada pacote só aparece para quem tem aquele tipo de bicho. O cartão mostra o desenho do próprio bicho.
const bxDe=(...sps)=>()=>R.pick(people('pet').filter(p=>p.alive&&sps.includes(bxRaiz(p.species))));
Object.assign(WHO,{b_cao:bxDe('Cachorro'),b_gato:bxDe('Gato'),b_coelho:bxDe('Coelho'),b_roedor:bxDe('Hamster','Porquinho-da-índia','Chinchila'),b_ourico:bxDe('Ouriço'),b_furao:bxDe('Furão'),
 b_avep:bxDe('Calopsita','Periquito'),b_papagaio:bxDe('Papagaio','Arara'),b_coruja:bxDe('Coruja'),b_pavao:bxDe('Pavão'),b_flamingo:bxDe('Flamingo'),b_pinguim:bxDe('Pinguim'),b_galinha:bxDe('Galinha'),b_pato:bxDe('Pato'),
 b_peixe:bxDe('Peixe-beta','Peixe-palhaço'),b_polvo:bxDe('Polvo'),b_tartaruga:bxDe('Tartaruga'),b_lagarto:bxDe('Iguana','Camaleão'),b_jacare:bxDe('Jacaré'),b_cobra:bxDe('Cobra'),b_aracn:bxDe('Tarântula','Escorpião'),
 b_macaco:bxDe('Macaco-prego','Macaco'),b_capivara:bxDe('Capivara'),b_raposa:bxDe('Raposa'),b_lobo:bxDe('Lobo'),b_felino:bxDe('Tigre','Leão'),b_lhama:bxDe('Lhama'),b_cavalo:bxDe('Cavalo'),b_porco:bxDe('Porco'),b_cabra:bxDe('Cabra')});
const bxPack=(who,list,w=.45)=>pack({k:'Bicho',who,w,cd:14},list.map(e=>e[2].length>1?e:[e[0],e[1],e[2].concat(['Deixar para lá|h+0|Segui com o meu dia.'])].concat(e.slice(3))));

bxPack('b_cao',[
 ['Bolinha perdida','{p} jogou a bolinha embaixo do sofá e está chorando na frente dele.',['Deitar no chão e pegar|bond+5 h+2|{p} quase me derrubou de alegria.','Comprar outra bolinha|$-30 bond+2|{p} ganhou uma bolinha nova e esqueceu a antiga.','Ignorar|bond-3|{p} passou a noite olhando para o sofá.']],
 ['Banho de mangueira','Está um calor enorme e {p} não para de ofegar.',['Dar banho de mangueira|bond+5 h+3|{p} saiu correndo e se sacudiu em cima de mim.','Ligar o ventilador|bond+2|{p} deitou na frente dele e dormiu.']],
 ['Sapato destruído','{p} mastigou meu tênis favorito inteirinho.',['Brigar com {ele}|bond-4|{p} se escondeu atrás da cortina, com as orelhas baixas.','Rir e tirar uma foto|h+3 follow+40|A foto fez sucesso na internet.','Comprar brinquedos de morder|$-120 bond+3|Agora {p} morde os brinquedos.']],
 ['Visita ao parque de cães','Abriu um parque só para cachorros perto de casa.',['Levar {p}|bond+6 h+4|{p} fez cinco amigos e voltou imund{o2}.','Ficar em casa|h-1|Fica para a próxima.']],
 ['Ladrão no quintal','De madrugada, {p} começou a latir como nunca.',['Ver o que é|?55 k+3 bond+6|{p} espantou um ladrão que tentava pular o muro!|hl-6|Era só um gato. Tropecei no escuro e me machuquei.','Ficar deitado|?70 h+0|Não era nada.|$-900|Levaram a bicicleta do quintal.']],
 ['Truque novo','Vi um vídeo ensinando cachorros a dar a pata.',['Treinar {p} a semana toda|?60 bond+6 h+4|{p} aprendeu! Agora dá a pata para todo mundo.|bond+2|{p} não aprendeu, mas adorou os petiscos.','Deixar para lá|h+0|{p} já é perfeit{o2} do jeito que é.']],
 ['Pulga!','{p} não para de se coçar.',['Comprar remédio antipulga|$-90 bond+3|As pulgas sumiram em dois dias.','Dar banho com sabão comum|?40 bond+1|Funcionou, por sorte.|bond-3 hl-1|As pulgas se espalharam pelo tapete.']],
 ['Ciúmes do sofá','{p} resolveu que o sofá agora é del{o2}.',['Deixar|h+2 bond+3|Sofá novo, dono novo.','Comprar uma caminha só para {ele}|$-180 bond+4|{p} aceitou a caminha depois de muito drama.']],
 ['Cachorro na chuva','Começou a chover e {p} ficou na rua, latindo para os trovões.',['Buscar {p} na chuva|bond+6 hl-1|Fiquei encharcad{o}, mas {p} parou de tremer no meu colo.','Chamar da janela|bond-2|{p} entrou sozinh{o2}, tremendo.']],
 ['Comida do vizinho','{p} fugiu e comeu o churrasco do vizinho.',['Pagar a carne|$-250 k+2|O vizinho riu e perdoou.','Negar tudo|?50 k-2|Ele acreditou.|k-4|Tinha câmera. Fiquei com fama de mentiros{o}.']],
 ['Aniversário de {p}','Hoje faz mais um ano que {p} chegou em casa.',['Fazer bolo de patê|$-60 bond+6 h+5|{p} comeu o bolo, o prato e quase a mesa.','Dar um brinquedo|$-40 bond+3|Durou dez minutos. Valeu cada centavo.']],
 ['Passeio longo','{p} trouxe a coleira até mim e ficou me encarando.',['Passear por uma hora|bond+5 hl+3|Voltamos cansados e felizes.','Só dar a volta no quarteirão|bond+1|Melhor que nada.','Agora não|bond-3|{p} largou a coleira no chão e suspirou.']],
 ['Cachorro famoso','Um vídeo de {p} uivando junto com uma música viralizou.',['Criar um perfil para {ele}|follow+400 f+2 h+4|Em uma semana, {p} tinha mais seguidores que eu.','Deixar quieto|h+2|Foi divertido ver os comentários.']],
 ['Engoliu uma meia','{p} engoliu uma meia inteira.',['Veterinário na hora|$-1500 bond+4|Tiraram a meia. {p} está ótim{o2}.','Esperar sair sozinha|?55 h+0|Saiu. Não quero falar sobre isso.|$-2500 bond-2|Precisou de cirurgia.']],
 ['Medo de fogos','É noite de Ano-Novo e {p} está apavorad{o2} com os fogos.',['Ficar abraçad{o} com {ele}|bond+7 h-1|Perdi a festa, mas {p} dormiu tranquil{o2} no meu colo.','Deixar sozinh{o2} e ir à festa|bond-5 h+4|Voltei e {p} tinha roído a porta.']],
 ['Cachorro idoso','{p} está andando mais devagar ultimamente.',['Levar ao veterinário|$-400 bond+4|Remédio para as articulações. {p} voltou a correr um pouco.','Fazer uma rampa para o sofá|$-150 bond+5|{p} sobe no sofá como antigamente.']],
 ['Concurso de fantasias','A pet shop vai fazer um concurso de fantasias.',['Vestir {p} de super-herói|?45 $500 h+5 f+1|{p} ganhou o primeiro lugar!|h+2|Não ganhou, mas ficou a coisa mais linda.','Não participar|h+0|{p} não ia gostar mesmo.']],
 ['Cavando o jardim','{p} cavou um buraco enorme no jardim.',['Ver o que tem lá|?20 $800|{p} achou uma caixinha com moedas antigas!|h+1|Era só uma pedra.','Tapar o buraco|bond-1|{p} cavou outro do lado.']],
 ['Briga de cachorros','No passeio, um cachorro grande avançou em {p}.',['Separar os dois|?55 k+2 bond+5|Consegui separar sem ninguém se ferir.|hl-6 bond+3|Levei uma mordida, mas {p} está bem.','Pegar {p} no colo e correr|bond+3 hl-1|Escapamos.']],
 ['Babando no colo','{p} está apoiad{o2} no meu joelho, me olhando com olhos de pidão.',['Dar um pedaço do meu lanche|bond+4 h+2|Mais um aliado conquistado.','Fazer carinho|bond+3 h+3|Ficamos assim por uma hora.']],
 ['Adestrador','Um adestrador ofereceu aulas para {p}.',['Fazer as aulas|$-900 ?65 bond+5|{p} senta, deita e até finge de mort{o2}.|bond+2|{p} aprendeu só a sentar. Já é algo.','Recusar|h+0|Prefiro {ele} do jeito que é.']],
 ['Praia com cachorro','Achei uma praia que aceita cachorros.',['Levar {p}|$-200 bond+7 h+6|{p} correu atrás das ondas a tarde inteira.','Deixar com um vizinho|bond-2 h+2|Foi bom, mas senti falta del{o2}.']],
 ['Comeu o dever de casa','{p} rasgou meus papéis importantes.',['Contar a verdade|?40 k+2|Acreditaram em mim!|h-2|Ninguém acreditou.','Fazer tudo de novo|h-2 sm+1|Pelo menos aprendi de novo.']],
 ['Dormindo na cama','{p} subiu na minha cama e não quer sair.',['Dividir a cama|bond+5 h+2|Acordei com uma pata na cara, mas feliz.','Colocar no chão|bond-2|{p} voltou três vezes.']],
 ['Outro cachorro','Um cachorro abandonado segue a gente toda vez que saímos.',['Dar comida e água|k+4 h+2|O cachorrinho foi embora abanando o rabo.','Levar para o abrigo|k+5 $-50|O abrigo arrumou uma família para ele.','Ignorar|k-1|{p} ficou olhando para trás.']],
 ['Pelos para todo lado','A casa está coberta de pelo de {p}.',['Comprar um aspirador potente|$-700 h+2|Vida nova.','Fazer tosa|$-150 bond-1|{p} ficou com vergonha do corte novo.','Aceitar|h-1|Pelo agora é tempero.']],
 ['Cheirando o carteiro','{p} fez amizade com o carteiro.',['Deixar|h+3|Agora o carteiro traz biscoito todo dia.','Prender no quintal|bond-1|O carteiro sentiu falta.']],
 ['Tosse estranha','{p} está tossindo há dois dias.',['Veterinário|$-350 bond+3 ?85 h+0|Era só uma gripe canina.|$-1200|Precisou de tratamento mais longo.','Esperar|?60 h+0|Passou sozinho.|bond-3 hl-1|Piorou. Tive que ir ao veterinário de qualquer jeito.']],
 ['Caminhada na trilha','Fui convidad{o} para uma trilha que aceita cachorros.',['Levar {p}|bond+6 hl+4|{p} achou cada cheiro novo que nem conseguia escolher.','Ir sozinh{o}|hl+3 bond-2|{p} me cheirou inteiro quando voltei.']],
 ['Cachorro no carro','{p} adora colocar a cabeça para fora da janela do carro.',['Deixar|?85 bond+4 h+2|A língua voando ao vento é a coisa mais feliz do mundo.|$-300 bond-1|Um inseto bateu no olho del{o2}. Veterinário.','Fechar a janela|bond-1|{p} ficou emburrad{o2}.']],
 ['Ração nova','A ração de sempre subiu muito de preço.',['Manter a ração boa|$-400 bond+2|{p} continua forte.','Trocar por uma mais barata|$+0 bond-2|{p} cheirou e fez cara feia.']],
 ['Escapou do portão','O portão ficou aberto e {p} sumiu.',['Procurar pelo bairro|?70 bond+6|Achei {p} na padaria, ganhando pão do padeiro.|h-6|Só encontrei {p} no dia seguinte, assustad{o2}.','Colocar cartazes|$-50 ?80 bond+4|Uma moça trouxe {p} de volta.|h-8|Demorou três dias para {p} voltar.']],
 ['Ensinando a nadar','{p} morre de medo da piscina.',['Ensinar com paciência|?60 bond+6 h+2|Agora {p} pula sozinh{o2}.|bond+2|Desistimos, mas foi divertido.','Deixar longe da água|h+0|Nem todo mundo precisa nadar.']],
 ['Cachorro guia','Uma ONG procura cachorros calmos para visitar asilos.',['Inscrever {p}|k+6 bond+4 h+3|Os idosos amaram {p}. Uma senhora chorou de alegria.','Não|h+0|Talvez outro dia.']],
 ['Ciúmes de visita','Chegou visita e {p} rosnou para ela.',['Pedir desculpas e prender {p}|k+1 bond-1|A visita ficou mais tranquila.','Deixar se conhecerem|?60 h+2|Viraram melhores amigos em meia hora.|hl-1 k-1|{p} mordiscou a mão da visita.']],
 ['Raça misteriosa','Um amigo jura que {p} é de uma raça rara.',['Fazer teste de DNA|$-600 h+3|Resultado: 14 raças diferentes. Um pouco de tudo.','Não importa|bond+2|{p} é {p} e pronto.']],
 ['Roubando comida','{p} roubou o frango da mesa do almoço de domingo.',['Rir|h+3|Ninguém conseguiu brigar com aquela carinha.','Colocar de castigo|bond-3|{p} chorou no corredor.']],
 ['Pata machucada','{p} voltou mancando do passeio.',['Veterinário|$-300 bond+4|Era um espinho. Já tiraram.','Olhar em casa|?50 bond+3|Achei a farpa e tirei com uma pinça.|$-800 bond-2|Infeccionou.']],
 ['Cão de exposição','Um criador viu {p} e disse que {ele} tem porte de campeão.',['Levar a uma exposição|$-800 ?35 $3000 f+2 h+6|{p} foi campeão da categoria!|h-1|Nem passou da primeira fase.','Recusar|h+0|Campeão só lá em casa.']],
 ['Primeira neve','Nevou pela primeira vez em anos na cidade.',['Levar {p} para brincar|bond+6 h+6|{p} pulou na neve como se fosse algodão.','Ficar no quentinho|h+1|Vimos pela janela.']],
 ['Cachorro de guarda','Os vizinhos dizem que {p} late demais à noite.',['Treinar {ele} a parar|$-500 ?60 k+2|Funcionou. Os vizinhos agradeceram.|k-1|Não funcionou. Os vizinhos reclamaram no condomínio.','Ignorar|k-2|Recebi uma multa do condomínio.|']],
 ['Lambeijo','Tive um dia horrível e {p} veio lamber minha cara.',['Abraçar {p}|h+8 bond+5|Não tem remédio melhor.']],
 ['Petisco caseiro','Achei uma receita de petisco caseiro para cães.',['Fazer|$-40 bond+5 h+3|{p} sentou sozinh{o2} na cozinha, esperando.','Comprar pronto|$-60 bond+2|{p} comeu em dois segundos.']],
 ['Cachorro detetive','{p} ficou latindo para a parede do porão.',['Investigar|?30 $1200 h+3|Era um vazamento de gás pequeno. {p} salvou a casa!|h-1|Era um rato.','Ignorar|?80 h+0|Não era nada.|hl-5 $-2000|Era um vazamento. Deu problema.']],
 ['Caiu na piscina','{p} caiu na piscina de um vizinho.',['Pular para salvar|bond+8 k+3 hl-1|Tirei {p} da água. Ficamos encharcados e abraçados.','Gritar por ajuda|bond+3|O vizinho tirou {p} da água.']],
],.45);

bxPack('b_gato',[
 ['Copo na beira da mesa','{p} está empurrando meu copo devagar para fora da mesa, me olhando nos olhos.',['Segurar o copo|bond+1 h+1|{p} desistiu, mas guardou rancor.','Deixar cair|h-2|Água por todo lado. {p} saiu andando satisfeit{o2}.']],
 ['Caixa de papelão','Chegou uma encomenda cara. {p} só quer saber da caixa.',['Dar a caixa para {ele}|bond+5 h+3|{p} morou na caixa por uma semana.','Jogar fora|bond-2|{p} me olhou com desprezo.']],
 ['Presente morto','{p} deixou um passarinho morto na minha cama.',['Agradecer|bond+5 h-1|Na lógica de gato, foi uma honra.','Gritar|bond-3|{p} ficou ofendid{o2}.']],
 ['Gato no teto','{p} subiu no telhado e não consegue descer.',['Subir para buscar|?70 bond+6|Desci com {p} no colo, tremendo.|hl-8|Escorreguei. Os bombeiros tiveram que me ajudar.','Chamar os bombeiros|$-0 h-1 bond+2|Os bombeiros desceram {p} em dois minutos.','Esperar|?80 h+0|{p} desceu sozinh{o2} na hora do jantar.|bond-3|Só desceu de madrugada, morrendo de fome.']],
 ['Arranhador','{p} está destruindo o sofá com as unhas.',['Comprar arranhador|$-180 bond+2|{p} usou o arranhador... e o sofá também.','Cortar as unhas|bond-2|Saí arranhad{o}, mas consegui.','Aceitar|h-2|O sofá agora tem franja.']],
 ['Miado às 4h','{p} começou a miar alto às quatro da manhã.',['Dar comida|bond+3 h-1|Funcionou. Agora acontece todo dia às quatro.','Fingir que dormi|bond-1 h-2|{p} derrubou tudo da estante.']],
 ['Ronronando','{p} subiu no meu peito e começou a ronronar.',['Ficar quietinh{o}|h+6 bond+4|Dizem que o ronronar acalma. É verdade.','Levantar|bond-1|{p} desceu e foi ronronar no sofá.']],
 ['Bola de pelo','{p} está fazendo barulhos estranhos.',['Esperar|?85 h+0|Era uma bola de pelo. Saiu no tapete novo.|$-700|Precisou de veterinário.','Levar ao veterinário|$-250 bond+2|Era só bola de pelo. Ganhei uma pasta especial.']],
 ['Laser','Comprei uma canetinha laser.',['Brincar com {p}|bond+5 h+4|{p} bateu a cara na parede duas vezes e continuou.','Guardar|h+0|Melhor não.']],
 ['Gato na janela','{p} fica horas olhando os pássaros na janela, fazendo um barulho esquisito.',['Instalar tela na janela|$-300 k+1 bond+2|Agora {p} pode olhar sem perigo.','Deixar|?85 h+0|Tudo bem.|bond-4 hl-1|{p} pulou atrás de um pombo. Ficou bem, mas foi um susto.']],
 ['Saco de ração','{p} rasgou o saco de ração e comeu até passar mal.',['Veterinário|$-300 bond+2|Indigestão. Vai ficar bem.','Esconder a ração melhor|h+0|Agora fica num armário com trava.']],
 ['Gato no teclado','{p} deitou no teclado do computador bem na hora do trabalho.',['Trabalhar com {ele} ali|perf-2 bond+4 h+3|Mandei um e-mail com "ggggggggg". Meu chefe entendeu.','Tirar|bond-1|{p} voltou em dez segundos.']],
 ['Banho de gato','{p} pulou numa poça de lama.',['Dar banho|hl-3 bond-4|Uma guerra. Perdi.','Deixar se lamber|h+0|Demorou um dia, mas {p} ficou limp{o2}.']],
 ['Gato de rua','Um gato de rua começou a vir comer com {p}.',['Dar comida também|k+4 $-50|Agora temos visitas todo dia.','Espantar|k-1 bond+1|{p} ficou feliz em ter a comida só para {ele}.']],
 ['Erva-de-gato','Ganhei um saquinho de erva-de-gato.',['Dar para {p}|bond+5 h+5|{p} rolou no chão por meia hora, completamente chapad{o2}.','Guardar|h+0|Para uma ocasião especial.']],
 ['Esconde-esconde','Não acho {p} em lugar nenhum.',['Procurar a casa toda|?80 h+1|{p} estava dentro do armário de roupas, dormindo.|h-6|{p} tinha fugido. Voltou dois dias depois, sujo.','Abrir um sachê|bond+2|{p} apareceu em três segundos, do nada.']],
 ['Ciúme do celular','Toda vez que pego o celular, {p} senta na frente da tela.',['Largar o celular|bond+5 h+3|Uma hora de carinho no lugar de rede social.','Continuar|bond-2|{p} deu uma patada no celular.']],
 ['Gato veterinário','Está na hora da vacina de {p}.',['Levar|$-200 bond-2 hl+0|{p} ficou bravo por um dia, mas está protegid{o2}.','Adiar|?80 h+0|Nada aconteceu.|$-1500|{p} pegou uma doença que a vacina evitaria.']],
 ['Brinquedo caro','Comprei um brinquedo de gato caríssimo.',['Mostrar para {p}|h-1 bond+2|{p} ignorou o brinquedo e brincou com a fita da embalagem.','Devolver na loja|$+80 h+0|Dei a caixa para {p} brincar.']],
 ['Gato no varal','{p} se pendurou nas roupas do varal.',['Rir e filmar|follow+80 h+3|O vídeo fez sucesso.','Tirar de lá|bond-1|As roupas ficaram cheias de pelo.']],
 ['Visita alérgica','Um amigo alérgico a gatos vem me visitar.',['Deixar {p} no quarto|bond-2 k+1|Meu amigo agradeceu.','Avisar e deixar {p} solt{o2}|k-1|Meu amigo espirrou a noite toda.']],
 ['Gato velho','{p} dorme quase o dia inteiro agora.',['Comprar uma caminha aquecida|$-250 bond+5|{p} não sai mais de lá.','Levar para um check-up|$-400 bond+3|Tudo bem, é só a idade.']],
 ['Miau diferente','{p} aprendeu a abrir a porta da geladeira.',['Colocar trava|$-80 h+1|Fim da festa.','Deixar|$-200 h-1|O presunto sumiu de novo.']],
 ['Gato astrólogo','Um vídeo diz que gatos pretos dão azar. Uma vizinha está com medo de {p}.',['Explicar que é bobagem|k+2|A vizinha até fez carinho em {p}.','Assustar a vizinha de brincadeira|k-2 h+2|Ela nunca mais passou perto de casa.']],
 ['Gato na mala','Estou arrumando a mala para viajar e {p} deitou dentro dela.',['Levar {p} junto|$-400 bond+5|Achei um hotel que aceita gatos.','Deixar com alguém|bond-3|{p} me ignorou por três dias quando voltei.']],
 ['Perseguindo o rabo','{p} está perseguindo o próprio rabo há dez minutos.',['Assistir|h+4|Melhor que qualquer filme.','Filmar|follow+50 h+3|O vídeo rodou o grupo da família.']],
 ['Planta tóxica','Ganhei um lírio de presente. É venenoso para gatos.',['Dar a planta para alguém|k+1 bond+1|Melhor não arriscar.','Deixar no alto|?70 h+0|{p} não alcançou.|$-1800 bond-2|{p} comeu uma folha. Corri para o veterinário.']],
 ['Gato diplomata','{p} fez amizade com o cachorro do vizinho.',['Deixar brincarem|h+4 bond+2|Os dois dormem juntos no muro agora.','Separar|h+0|Melhor não arriscar.']],
 ['Coleira com sino','{p} anda caçando passarinhos no quintal.',['Colocar uma coleira com sino|$-30 k+2|Os passarinhos agora ouvem {p} chegando.','Deixar|k-1|Mais um presente na minha cama.']],
 ['Olhar fixo','{p} está olhando fixamente para um canto vazio da sala.',['Olhar também|?10 h-3|Juro que vi uma sombra se mexer.|h+1|Não tinha nada.','Fingir que não vi|h+0|Gatos são estranhos.']],
 ['Fonte de água','{p} só bebe água da torneira.',['Comprar uma fonte de água|$-220 bond+4 hl+1|{p} amou e passou a beber muito mais.','Abrir a torneira toda vez|bond+2 h-1|Virei garçom de gato.']],
 ['Sachê ou ração','Fui ao mercado e posso comprar o sachê que {p} ama.',['Comprar o sachê|$-60 bond+4|{p} ronronou de felicidade.','Só ração|bond-1|{p} cheirou e foi embora.']],
 ['Gato no Instagram','Tirei uma foto de {p} dormindo de barriga para cima.',['Postar|follow+120 h+2|Foi a foto mais curtida do meu perfil.','Guardar só para mim|h+2|Algumas fotos são só nossas.']],
 ['Castração','O veterinário recomendou castrar {p}.',['Castrar|$-600 bond-1 hl+2|{p} ficou mais calm{o2} e saudável.','Não agora|?70 h+0|Tudo certo.|$-300 k-1|{p} fugiu atrás de namorad{o2} e voltou machucad{o2}.']],
 ['Briga de gatos','Ouço briga de gato no quintal. {p} está no meio.',['Separar com um balde de água|bond+2 hl-1|Saí arranhado, mas separei.','Esperar|?60 h+0|{p} venceu e voltou com pose de rei.|$-400 bond-1|{p} voltou com a orelha rasgada.']],
 ['Gato no colo de visita','{p} só sobe no colo de quem não gosta de gatos.',['Rir da situação|h+3|Meu tio alérgico ficou paralisado de medo.','Tirar {p} do colo dele|k+1 bond-1|Meu tio agradeceu aliviado.']],
 ['Gato no Natal','{p} derrubou a árvore de Natal.',['Montar de novo|h-1|Pela terceira vez.','Deixar sem enfeites embaixo|h+1|Acordo feito com {p}.']],
 ['Lambida áspera','{p} resolveu me dar banho de língua.',['Aceitar|bond+5 h+3|Fiquei com o braço todo arranhado e o coração quentinho.','Fugir|bond-1|{p} me olhou ofendid{o2}.']],
 ['Gato filósofo','Toda noite {p} senta na janela e fica olhando a lua.',['Sentar do lado del{o2}|h+4 bond+3|Ficamos em silêncio, olhando a lua juntos.','Ir dormir|h+0|{p} ficou lá até de madrugada.']],
 ['Quarto proibido','Fechei a porta do quarto e {p} está arranhando sem parar.',['Abrir|bond+3|{p} entrou, olhou em volta e saiu.','Deixar fechada|bond-2 h-1|O arranhado durou a noite toda.']],
],.45);

bxPack('b_coelho',[
 ['Fio roído','{p} roeu o fio do carregador do celular.',['Proteger os fios|$-90 h+1|Agora tudo fica dentro de canaletas.','Brigar|bond-2|{p} não entendeu nada.']],
 ['Pulinho de alegria','{p} deu um pulo no ar girando o corpo.',['Comemorar|h+5 bond+3|Coelhos fazem isso quando estão muito felizes.']],
 ['Cenoura demais','Dei muita cenoura para {p}.',['Trocar por feno|hl+1 bond-1|O veterinário diz que feno é o principal.','Continuar|bond+2 ?70 h+0|{p} ficou feliz.|$-300|Deu dor de barriga.']],
 ['Coelho solto','Deixei {p} solto na sala.',['Vigiar|bond+4 h+3|{p} explorou cada canto e deitou do meu lado.','Deixar sozinh{o2}|?50 h+0|Tudo bem.|$-400|Roeu o pé da mesa.']],
 ['Unhas compridas','As unhas de {p} estão enormes.',['Cortar em casa|?60 bond+0|Deu certo.|bond-3|{p} se debateu e fugiu.','Levar ao veterinário|$-80 bond+1|Rapidinho.']],
 ['Companhia','Dizem que coelhos gostam de companhia.',['Adotar outro coelho|$-150 h+4 bond+3|{p} ganhou um melhor amigo.','Passar mais tempo com {ele}|bond+5 h+2|Viramos inseparáveis.']],
 ['Coelho no jardim','{p} fugiu para o jardim e comeu as flores da vizinha.',['Pedir desculpas e comprar flores|$-100 k+2|Ela riu e fez carinho em {p}.','Fingir que não foi|k-2|Ela viu tudo.']],
 ['Calor','Está muito quente e {p} está ofegante.',['Garrafa de água gelada perto del{o2}|bond+4 hl+1|{p} encostou na garrafa e melhorou.','Ligar o ar-condicionado|$-80 bond+3|{p} se esticou todo.']],
 ['Coelho de Páscoa','As crianças do bairro querem conhecer {p} na Páscoa.',['Deixar|k+3 h+3|{p} foi o astro da festa.','Não|h+0|{p} se estressa com barulho.']],
 ['Dentes grandes','Os dentes de {p} cresceram demais.',['Veterinário|$-250 bond+2 hl+2|Lixaram os dentes. Já come normal.','Dar mais coisas para roer|bond+2|Galhos de maçã resolveram.']],
 ['Orelha caída','{p} está com uma orelha mais baixa que a outra hoje.',['Levar ao veterinário|$-200 bond+2|Era só uma posição de relaxamento.','Observar|?80 h+0|Voltou ao normal.|$-500|Era uma otite.']],
 ['Sono de coelho','{p} dormiu de lado, totalmente esticad{o2}.',['Tirar foto|h+3 follow+30|Parece um travesseiro com orelhas.']],
],.45);

bxPack('b_roedor',[
 ['Rodinha de madrugada','{p} correu na rodinha a noite inteira.',['Trocar por uma rodinha silenciosa|$-90 h+2|Silêncio total.','Mudar a gaiola de lugar|h+1|Agora fica na sala.']],
 ['Fuga da gaiola','A gaiola amanheceu aberta e {p} sumiu.',['Procurar com sementes no chão|?70 bond+3|Achei {p} atrás da geladeira.|h-5|{p} apareceu só três dias depois, gordinh{o2}.','Desistir|bond-4 h-3|Que tristeza.']],
 ['Bochechas cheias','{p} guardou comida nas bochechas até ficar redond{o2}.',['Rir|h+4|Parecia uma bolinha de tênis.']],
 ['Labirinto','Montei um labirinto de papelão para {p}.',['Ver {ele} explorar|bond+4 h+3|{p} achou a saída em dois minutos. Gênio.']],
 ['Gaiola maior','{p} parece apertad{o2} na gaiola.',['Comprar uma maior|$-250 bond+5 hl+1|{p} correu de um lado para o outro.','Deixar|bond-1|{p} continua girando na rodinha.']],
 ['Mordida','Peguei {p} de repente e levei uma mordida.',['Ter mais calma da próxima vez|bond+1|Agora deixo {p} vir até minha mão.','Desistir de pegar|bond-2|Ficamos meio distantes.']],
 ['Banho de areia','Li que chinchilas e hamsters tomam banho de areia.',['Comprar areia especial|$-40 bond+4|{p} rolou na areia como se fosse uma festa.']],
 ['Ronquinho','{p} está fazendo um barulhinho de assobio.',['Veterinário|$-180 bond+2|Era um resfriado leve.','Esperar|?70 h+0|Passou sozinho.|$-400|Virou uma infecção.']],
 ['Petisco de fruta','Tenho morango em casa.',['Dar um pedacinho|bond+4|{p} segurou com as patinhas e comeu tudo.','Não dar|h+0|Muito açúcar faz mal.']],
 ['Visita na escola','A professora pediu para levar um bichinho para a aula.',['Levar {p}|?80 k+2 h+4|{p} foi a estrela da aula.|bond-2|{p} se assustou com o barulho.','Não levar|h+0|Melhor deixar em casa.'],{max:14}],
 ['Gaiola suja','A gaiola de {p} está com um cheiro forte.',['Limpar tudo|bond+3 h-1|Uma hora de trabalho e {p} feliz.','Deixar para amanhã|bond-2 hl-1|O cheiro piorou.']],
 ['Pipocando','{p} começou a dar pulinhos no ar sem motivo.',['Ver|h+4|Porquinhos e chinchilas fazem isso de alegria.']],
 ['Assobio de fome','Toda vez que abro a geladeira, {p} assobia.',['Dar um pedaço de alface|bond+4|Virou nosso ritual.']],
 ['Esconderijo','{p} quase não sai da casinha.',['Brincar todo dia um pouquinho|bond+5|Agora {p} vem até a minha mão.','Deixar no canto dele|h+0|Cada um tem seu jeito.']],
 ['Dois amigos','A loja tem um porquinho-da-índia sozinho para doação.',['Adotar para fazer companhia|$-60 h+3|Agora são dois assobiando.','Não|h+0|Um já basta.']],
 ['Comeu fio','{p} roeu o fio do abajur.',['Veterinário por precaução|$-200 bond+2|Nada grave, por sorte.','Proteger os fios|$-60|Agora está tudo seguro.']],
 ['Corrida de bichinhos','Vai ter uma corrida de roedores numa feira de bairro.',['Inscrever {p}|?35 $200 h+5|{p} ganhou a medalha de ouro!|h+2|{p} parou no meio para comer uma semente.','Só assistir|h+2|Foi engraçado.']],
 ['Envelhecendo','{p} está mais quietinh{o2} ultimamente.',['Deixar mais confortável|bond+4|Coloquei mais feno macio na casinha.']],
],.45);

bxPack('b_ourico',[
 ['Bolinha de espinhos','{p} virou uma bola de espinhos quando a visita chegou.',['Pedir para a visita esperar|bond+2|{p} se abriu depois de um tempo.','Pegar no colo mesmo assim|hl-1 bond-2|Meus dedos não esquecem.']],
 ['Unção','{p} lambeu um sabonete e espalhou a espuma pelos espinhos.',['Pesquisar|sm+1 h+2|É um comportamento normal de ouriço. Esquisito e fofo.']],
 ['Noite agitada','{p} correu a noite toda e derrubou o pote de água.',['Comprar um pote pesado|$-40 h+1|Problema resolvido.']],
 ['Banho no ouriço','Os espinhos de {p} estão sujos.',['Dar banho com escova de dentes|bond+3|{p} ficou limpinh{o2} e brilhante.']],
 ['Frio','A casa esfriou muito e {p} está parado demais.',['Comprar um aquecedor|$-200 hl+2 bond+3|{p} voltou a explorar.','Cobrir a gaiola|bond+1|Ajudou um pouco.']],
 ['Ouriço famoso','Um vídeo de {p} comendo uma minhoca viralizou.',['Criar um perfil|follow+300 h+3|{p} tem fãs no Japão.','Deixar quieto|h+1|Foi divertido.']],
]);

bxPack('b_furao',[
 ['Dança da guerra','{p} começou a pular de lado com as costas arqueadas.',['Brincar com {ele}|bond+5 h+4|É a dança de felicidade dos furões.']],
 ['Ladrão de meias','Encontrei um esconderijo de {p} com seis meias e um controle remoto.',['Recuperar tudo|h+2|Inclusive o controle sumido há meses.','Deixar o tesouro del{o2}|bond+3 h+1|Comprei meias novas.']],
 ['Cheiro forte','A casa está com o cheiro de {p}.',['Dar banho|bond-1|Ajudou por dois dias.','Limpar a caminha mais vezes|h+1 bond+1|Funcionou melhor.']],
 ['Fuga pela fresta','{p} entrou num buraco da parede.',['Esperar com petisco|?75 bond+3|{p} saiu em dez minutos.|$-600|Tive que chamar alguém para abrir a parede.']],
 ['Furão e gato','O gato do vizinho entrou e encontrou {p}.',['Separar|bond+2|Os dois ficaram se encarando de longe.','Deixar|?60 h+4|Viraram amigos e brincam juntos.|hl-1|Briga. Ninguém se machucou feio.']],
 ['Brinquedo de túnel','Vi um túnel de tecido para furões.',['Comprar|$-80 bond+5 h+3|{p} não sai mais do túnel.']],
]);

bxPack('b_avep',[
 ['Assobio novo','{p} aprendeu a assobiar o toque do meu celular.',['Achar graça|h+4|Agora atendo o celular dez vezes por dia sem ninguém ligar.']],
 ['Banho de pássaro','{p} está espalhando água para todo lado na banheira de pássaro.',['Deixar|bond+3 h+2|{p} saiu toda arrepiada e feliz.']],
 ['Voo pela casa','Soltei {p} na sala para voar.',['Fechar as janelas antes|bond+5 h+3|Voou, pousou no meu ombro e beliscou minha orelha.','Esquecer a janela aberta|?40 h+0|Por sorte {p} voltou.|bond-10 h-8|{p} voou pela janela e não voltou mais.']],
 ['Crista em pé','A crista de {p} está toda arrepiada.',['Entender o que é|sm+1|Crista em pé quer dizer surpresa ou alegria.']],
 ['Música','Coloquei uma música e {p} começou a balançar a cabeça.',['Dançar junto|h+5 bond+4|Uma festa só nossa.','Filmar|follow+60 h+3|Bombou nas redes.']],
 ['Muda de penas','{p} está perdendo muitas penas.',['Veterinário|$-180 bond+2|Era a muda. Normal.','Dar vitamina|$-50 hl+1|Penas novas cresceram bonitas.']],
 ['Gaiola maior','A gaiola de {p} parece pequena.',['Trocar por um viveiro|$-500 bond+5 hl+1|{p} ganhou espaço para voar.','Deixar|bond-1|Tudo bem.']],
 ['Ciúme do espelho','{p} se apaixonou pelo próprio reflexo no espelhinho.',['Tirar o espelho|bond+2|{p} voltou a prestar atenção em mim.','Deixar|h+2|Amor é amor.']],
 ['Pássaro falante','{p} começou a repetir uma palavra que eu falo muito.',['Ensinar o meu nome|bond+4 h+4|Agora {p} me chama pelo nome.','Ensinar um palavrão|h+3 k-1|Minha avó não achou graça.']],
 ['Ovo na gaiola','{p} botou um ovo.',['Deixar com ela por uns dias|bond+2|Ela cuidou com carinho.','Procurar o veterinário|$-150 hl+1|Recomendaram cálcio extra.']],
 ['Sementes favoritas','{p} só come as sementes de girassol e joga o resto fora.',['Comprar uma mistura melhor|$-60 bond+3 hl+1|Agora come quase tudo.']],
 ['Ombro favorito','{p} só quer ficar no meu ombro.',['Deixar|bond+5 h+3|Fiz tudo hoje com um passarinho no ombro.']],
 ['Gato à espreita','O gato do vizinho fica olhando a gaiola de {p}.',['Mudar a gaiola de lugar|bond+3|{p} voltou a cantar.','Deixar|?70 h+0|O gato desistiu.|bond-4|{p} se assustou e ficou dias sem cantar.']],
 ['Banho de sol','Coloquei a gaiola de {p} no sol da manhã.',['Por meia hora|hl+2 bond+2|{p} cantou como nunca.','A manhã toda|?60 h+0|Tudo bem.|hl-2 bond-2|{p} passou calor.']],
 ['Canto da manhã','{p} canta todo dia às seis da manhã.',['Acordar feliz|h+3|Melhor despertador do mundo.','Cobrir a gaiola de noite|h+1|Agora canta só às oito.']],
]);

bxPack('b_papagaio',[
 ['Palavrão na visita','{p} gritou um palavrão bem na frente da minha avó.',['Pedir desculpas|k+1|Ela riu e disse que já ouviu pior.','Colocar a culpa no vizinho|k-1 h+2|Ninguém acreditou.']],
 ['Papagaio imita o telefone','{p} imita o toque do telefone perfeitamente.',['Rir|h+3|Corri para atender cinco vezes hoje.']],
 ['Bico afiado','{p} destruiu o encosto da cadeira de madeira.',['Comprar brinquedos de roer|$-150 bond+3|Salvei os outros móveis.','Brigar|bond-3|{p} gritou de volta.']],
 ['Papagaio cantor','{p} aprendeu uma música inteira.',['Gravar|follow+200 f+1 h+4|O vídeo viralizou.','Só aproveitar|h+3|Show particular.']],
 ['Ciúmes','{p} morde todo mundo que chega perto de mim.',['Treinar com paciência|$-300 ?60 bond+4|Melhorou bastante.|bond+1|Continua ciumento.','Deixar|h-1|Minhas visitas têm medo del{o2}.']],
 ['Papagaio fugiu','{p} voou para uma árvore alta.',['Chamar pelo nome|?70 bond+6|{p} voltou voando para o meu braço.|h-6|Só voltou no dia seguinte.','Chamar os bombeiros|bond+2|Trouxeram {p} de volta.']],
 ['Arara colorida','Uma criança perguntou se pode tirar foto com {p}.',['Deixar|k+2 h+3|Ela vai lembrar disso para sempre.']],
 ['Documentos','O fiscal ambiental quer ver os papéis de {p}.',['Mostrar a nota da loja|h+0|Tudo certo.','Não tenho os papéis|?50 h+0|Ele aceitou explicar depois.|$-3000|Levei uma multa pesada.']],
 ['Papagaio inteligente','{p} aprendeu a abrir a portinha da gaiola.',['Colocar um cadeado|$-30|Fim das fugas noturnas.','Deixar|?60 h+2|{p} só vai até o sofá.|$-400|Comeu o fio da TV.']],
 ['Ele fala o meu nome','{p} chamou meu nome com a minha voz.',['Responder|bond+5 h+5|Conversamos por meia hora. Ou quase isso.']],
 ['Banho de chuveiro','{p} adora tomar banho no chuveiro comigo.',['Deixar|bond+4 h+3|Abre as asas e grita de felicidade.']],
 ['Muitos anos','O veterinário disse que {p} pode viver mais de 50 anos.',['Planejar o futuro del{o2}|k+2|Já deixei escrito quem cuida del{o2} se algo me acontecer.','Rir|h+2|{p} vai me enterrar.']],
 ['Papagaio no ombro','Fui à padaria com {p} no ombro.',['Deixar {p} falar com todo mundo|h+4 f+1|Virou atração do bairro.']],
 ['Grito de manhã','{p} grita todo dia ao nascer do sol.',['Aceitar|h-1|Faz parte.','Cobrir a gaiola de noite|h+1 bond+1|Melhorou um pouco.']],
]);

bxPack('b_coruja',[
 ['Olhos na noite','{p} fica me encarando de noite, sem piscar.',['Encarar de volta|h+1|{p} venceu.','Apagar a luz|h-1|Os olhos continuaram brilhando no escuro.']],
 ['Cabeça girando','{p} virou a cabeça quase para trás.',['Mostrar para os amigos|h+3 f+1|Todo mundo ficou impressionado.']],
 ['Caçadora','{p} trouxe um rato do quintal.',['Agradecer|bond+3|Controle de pragas grátis.']],
 ['Voo silencioso','{p} passou voando do meu lado sem fazer barulho nenhum.',['Tomar um susto|h-1 h+2|Que bicho incrível.']],
 ['Coruja na escola','A escola pediu uma palestra sobre aves com {p}.',['Ir|k+3 f+1 h+3|As crianças amaram {p}.','Recusar|h+0|{p} não gosta de barulho.']],
]);

bxPack('b_pavao',[
 ['Cauda aberta','{p} abriu a cauda inteira no jardim.',['Tirar foto|follow+150 h+4|Um leque de olhos azuis e verdes.']],
 ['Grito de pavão','{p} gritou tão alto que os vizinhos reclamaram.',['Pedir desculpas|k+1|Expliquei que é normal.','Ignorar|k-2|Abaixo-assinado no condomínio.']],
 ['Pavão no telhado','{p} subiu no telhado do vizinho.',['Buscar|?70 bond+3|Desceu sozinho quando viu a comida.|$-300|Quebrou umas telhas.']],
 ['Penas caídas','{p} perdeu as penas grandes da cauda.',['Guardar as penas|h+2|Viraram enfeite na sala.','Vender|$+400|Artesãos pagam bem.']],
 ['Casamento','Um casal quer {p} nas fotos do casamento.',['Alugar {p}|$+800 h+2|{p} roubou a cena.','Recusar|h+0|{p} não é enfeite.']],
]);

bxPack('b_flamingo',[
 ['Numa perna só','{p} dorme em uma perna só há horas.',['Tentar imitar|h+3|Caí em dez segundos.']],
 ['Rosa desbotado','{p} está ficando menos rosa.',['Mudar a alimentação|$-300 hl+2 bond+2|O rosa voltou. Vem dos camarões.']],
 ['Lago','{p} precisa de um lugar com água para ficar feliz.',['Construir um lago|$-5000 bond+8 h+4|{p} anda de um lado para o outro todo orgulhoso.','Uma piscininha|$-400 bond+3|Melhor que nada.']],
 ['Flamingo na festa','{p} entrou no meio da festa do jardim.',['Deixar|h+5 f+1|Todos tiraram foto com {p}.']],
]);

bxPack('b_pinguim',[
 ['Calor','{p} está sofrendo com o calor.',['Climatizar um quarto|$-4000 hl+4 bond+5|Agora {p} tem um quarto gelado.','Deixar gelo na água|$-100 bond+2|Ajudou um pouco.']],
 ['Peixe fresco','{p} só come peixe fresco.',['Comprar peixe todo dia|$-600 bond+4|{p} está gordinho e feliz.','Peixe congelado|bond-2|{p} reclamou com barulhos estranhos.']],
 ['Andando como pinguim','{p} me segue pela casa inteira.',['Filmar|follow+250 h+4|O vídeo foi parar no jornal.']],
 ['Escorregador','{p} escorregou de barriga no piso molhado.',['Fazer um escorregador de verdade|$-200 bond+5 h+4|{p} desceu cem vezes.']],
 ['Zoológico','Um zoológico quer comprar {p}.',['Vender|$+30000 bond-20 h-4|{p} foi para um lugar com outros pinguins. Senti saudade.','Recusar|bond+3|{p} fica comigo.']],
 ['Pinguim famoso','Saiu uma reportagem sobre o pinguim de estimação do bairro.',['Dar entrevista|f+3 h+3|Fiquei famos{o} por tabela.','Recusar|h+0|Prefiro discrição.']],
]);

bxPack('b_galinha',[
 ['Ovo do dia','{p} botou um ovo grande hoje.',['Fazer um omelete|h+2|O melhor ovo da vida.','Dar para a vizinha|k+2|Ela mandou um bolo de volta.']],
 ['Galinha na cozinha','{p} entrou na cozinha e subiu na mesa.',['Expulsar com carinho|h+1|Voltou depois.','Deixar|h-1|Pena para todo lado.']],
 ['Raposa à noite','Ouço barulho no galinheiro de noite.',['Ver com lanterna|?60 k+2 bond+4|Espantei um gambá.|hl-2|Tropecei no escuro. {p} está bem.','Reforçar o galinheiro|$-300 bond+3|Ninguém mais entra.']],
 ['Galo cantando','Antes do sol nascer, o canto começou.',['Acordar cedo|h-1 sm+1|Pelo menos aproveitei o dia.','Reclamar|h-2|Não adiantou.']],
 ['Ciscando','{p} ciscou a horta inteira.',['Cercar a horta|$-150 h+1|Agora cada um no seu canto.','Deixar|h-1|Adeus, alfaces.']],
 ['Choca','{p} está sentada em cima dos ovos e não sai.',['Deixar chocar|h+4|Nasceram pintinhos!','Tirar os ovos|bond-2|Ela ficou brava.']],
 ['Galinha de colo','{p} gosta de colo como se fosse um gato.',['Fazer carinho|bond+5 h+3|Ela fecha os olhos e cochila.']],
 ['Feira de galinhas','Vai ter um concurso de galinhas bonitas.',['Inscrever {p}|?40 $300 h+4|{p} ganhou uma fita azul!|h+1|Não ganhou, mas ciscou o jurado.']],
]);

bxPack('b_pato',[
 ['Lago do parque','Levei {p} para o lago do parque.',['Deixar nadar|bond+5 h+4|{p} nadou com os outros patos e voltou sozinh{o2}.']],
 ['Quá quá quá','{p} grasna toda vez que eu chego.',['Responder com quá|h+4 bond+3|Uma conversa que só nós entendemos.']],
 ['Piscina de plástico','Comprei uma piscininha para {p}.',['Encher|$-80 bond+5|{p} passa o dia mergulhando.']],
 ['Pato no carro','{p} entrou no carro e não quer sair.',['Dar uma volta com {ele}|h+5 f+1|Os vizinhos filmaram.']],
 ['Perseguido','Um cachorro correu atrás de {p}.',['Proteger|bond+5 k+2|O cachorro fugiu.','Deixar|?70 h+0|{p} voou para longe.|bond-3|{p} perdeu umas penas.']],
 ['Seguindo em fila','{p} me segue pela casa inteira como se eu fosse a mãe.',['Deixar|bond+5 h+3|Somos uma família de dois.']],
]);

bxPack('b_peixe',[
 ['Água turva','A água do aquário de {p} está esverdeada.',['Trocar a água e o filtro|$-120 bond+3 hl+1|{p} voltou a nadar animad{o2}.','Esperar|?50 h+0|Clareou sozinha.|bond-4|{p} ficou doente.']],
 ['Bolhas','{p} fez um ninho de bolhas na superfície.',['Pesquisar|sm+1 h+2|É sinal de peixe feliz.']],
 ['Aquário maior','O aquário de {p} é pequeno.',['Comprar um maior|$-600 bond+5 hl+2|{p} explora as plantas novas.','Deixar|bond-1|Tudo igual.']],
 ['Comida demais','Dei comida demais para {p}.',['Tirar o excesso|bond+1 hl+1|Melhor assim.','Deixar|hl-1|A água ficou suja.']],
 ['Plantinhas','Vi plantas naturais para aquário.',['Comprar|$-80 bond+3|O aquário ficou lindo.']],
 ['Peixe pulando','{p} pulou para fora do aquário.',['Colocar de volta rápido|?80 bond+3|Voltou a nadar como se nada tivesse acontecido.|petdie|Foi tarde demais.','Comprar uma tampa|$-60|Nunca mais.']],
 ['Nadadeira rasgada','A nadadeira de {p} apareceu rasgada.',['Tratar a água|$-60 bond+2|Cresceu de novo.']],
 ['Peixe e o gato','O gato da vizinha fica olhando o aquário.',['Tampar bem|$-60 bond+2|Pode olhar à vontade.']],
 ['Aquário bonito','Montei um castelinho dentro do aquário.',['Ver {p} explorar|h+3|{p} entra e sai do castelo como um rei.']],
 ['Viagem','Vou viajar uma semana. Quem alimenta {p}?',['Comprar um alimentador automático|$-150 bond+1|Deu tudo certo.','Pedir para o vizinho|?80 k+1|Ele cuidou direitinho.|bond-4|Ele exagerou na comida.']],
 ['Peixe reconhece','{p} vem para a frente do vidro sempre que eu chego.',['Dar oi|bond+4 h+3|Juro que ele me reconhece.']],
 ['Luz do aquário','A luz do aquário queimou.',['Trocar|$-90 bond+1|Cores lindas de novo.']],
]);

bxPack('b_polvo',[
 ['Fuga do aquário','{p} abriu a tampa do aquário e passeou pela sala.',['Devolver e colocar trava|$-100 bond+2|{p} ficou estudando a trava.','Admirar|h+3 sm+1|Que bicho inteligente.']],
 ['Mudança de cor','{p} mudou de cor quando cheguei perto.',['Fazer carinho com o dedo|bond+4 h+3|{p} enrolou um tentáculo no meu dedo.']],
 ['Quebra-cabeça','Dei um pote fechado com um camarão dentro.',['Ver {p} abrir|h+4 sm+1|Abriu em trinta segundos.']],
 ['Esguicho','{p} me deu um jato de água na cara.',['Rir|h+3|Acho que ele não gosta de mim. Ou gosta muito.']],
 ['Vida curta','O veterinário lembrou que polvos vivem pouco.',['Aproveitar cada dia|bond+5 h+2|Vou fazer o melhor por {p}.']],
 ['Brinquedos','{p} parece entediado.',['Dar brinquedos de enigma|$-120 bond+4|{p} voltou a explorar.']],
]);

bxPack('b_tartaruga',[
 ['Banho de sol','{p} está parada embaixo da lâmpada há horas.',['Trocar a lâmpada por uma UV|$-150 hl+2 bond+2|O casco ficou mais forte.']],
 ['Fuga lenta','{p} sumiu do quintal.',['Procurar|bond+3|Estava atrás do vaso. Andou dois metros em uma tarde.']],
 ['Casco','O casco de {p} está com uma manchinha.',['Veterinário|$-300 bond+2|Era só sujeira.','Observar|?80 h+0|Saiu.|$-800|Era um fungo.']],
 ['Folha de alface','{p} come a alface com tanta calma que é quase meditação.',['Assistir|h+4|Me acalmou também.']],
 ['Hibernando','{p} está muito parada no inverno.',['Deixar quietinha|bond+2|É o ritmo dela.','Aquecer o terrário|$-100 hl+1|Ficou mais ativa.']],
 ['Corrida de tartarugas','As crianças da rua querem fazer uma corrida de tartarugas.',['Deixar {p} participar|?40 h+5|{p} ganhou! Por um casco.|h+2|{p} parou no meio para comer um trevo.']],
 ['Muitos anos','Encontrei uma foto antiga com {p}. Ela não mudou nada.',['Rir|h+3|Eu envelheci. Ela não.']],
 ['Tartaruga e cachorro','O cachorro do vizinho fica latindo para {p}.',['Proteger|bond+3|Ela nem ligou.']],
]);

bxPack('b_lagarto',[
 ['Mudando de cor','{p} ficou de outra cor do nada.',['Fotografar|h+3|Parece um arco-íris com patas.']],
 ['Troca de pele','{p} está soltando a pele velha.',['Deixar um banho morno|bond+3|A pele saiu inteirinha.','Puxar a pele|bond-3 hl-1|Não se faz isso.']],
 ['Grilos vivos','{p} só come grilos vivos.',['Comprar grilos|$-60 bond+3|Uma caçada na sala.','Tentar ração|bond-2|{p} ignorou.']],
 ['Lâmpada queimada','A lâmpada de calor do terrário queimou.',['Trocar na hora|$-120 bond+3|{p} voltou a ficar ativ{o2}.','Esperar o fim de semana|?60 h+0|Aguentou.|hl-1 bond-3|{p} ficou fraco.']],
 ['Na mão','{p} subiu no meu braço e ficou parad{o2}.',['Deixar|bond+5 h+3|Esquentou no meu ombro.']],
 ['Olhos girando','Os olhos de {p} giram cada um para um lado.',['Mostrar para os amigos|h+3|Ninguém sabia que isso era possível.']],
 ['Terrário maior','{p} cresceu muito.',['Comprar terrário maior|$-800 bond+5 hl+1|Agora tem galho, toca e cachoeira.']],
 ['Fugiu','{p} fugiu do terrário.',['Procurar|?70 bond+3|Estava atrás da geladeira, quentinh{o2}.|h-5|Só apareceu dias depois.']],
]);

bxPack('b_jacare',[
 ['Vizinhos com medo','Os vizinhos descobriram que tenho um jacaré.',['Mostrar a licença|?60 h+0|Eles se acalmaram.|$-5000|Levei multa e tive que reformar o recinto.','Convidar para conhecer {p}|?50 k+2 h+3|Viraram fãs.|k-2|Saíram correndo.']],
 ['Hora da comida','{p} abriu a boca enorme esperando a comida.',['Jogar com a pinça|bond+3|Comeu em uma bocada.','Dar na mão|?50 bond+4|Tudo certo.|hl-15|Ele errou o frango.']],
 ['Piscina','{p} precisa de uma piscina maior.',['Construir|$-12000 bond+6 hl+2|Agora {p} tem um lago de verdade.']],
 ['Fuga','{p} saiu do recinto de madrugada.',['Chamar a polícia ambiental|$-1500 k+2|Encontraram {p} na rua de trás, tomando sol.','Procurar sozinh{o}|?50 bond+3|Achei e levei de volta.|hl-10|Não foi uma boa ideia.']],
 ['Documentário','Uma TV quer filmar {p}.',['Aceitar|$+3000 f+3 h+3|{p} apareceu na TV aberta.','Recusar|h+0|{p} é tímido.']],
 ['Jacaré idoso','{p} está ficando grisalho nas escamas.',['Cuidar com carinho|bond+5|Ainda é o meu dinossauro.']],
]);

bxPack('b_cobra',[
 ['Troca de pele','{p} deixou a pele velha inteirinha no terrário.',['Guardar|h+2|Ficou pendurada no meu quarto.','Jogar fora|h+0|Era um pouco nojento.']],
 ['Rato congelado','Hora de alimentar {p}.',['Descongelar e dar com pinça|bond+2|Comeu em segundos.','Esquecer|bond-3 hl-1|{p} ficou de mau humor.']],
 ['Fugiu','O terrário amanheceu aberto. {p} sumiu.',['Revirar a casa|?70 bond+3|{p} estava enrolada atrás da TV, quentinha.|h-6 k-1|{p} apareceu na casa do vizinho. Ele quase desmaiou.']],
 ['Cobra no pescoço','Um amigo quer tirar foto com {p} no pescoço.',['Deixar|?85 h+3 follow+60|Foto épica.|hl-2|{p} se assustou e mordeu.','Não|h+0|Melhor não.']],
 ['Calor','O aquecedor do terrário quebrou.',['Trocar|$-150 bond+2|{p} voltou ao normal.']],
 ['Mãe com medo','Minha mãe disse que não vem mais me visitar por causa de {p}.',['Prometer trancar o terrário|k+1 h+1|Ela veio. Olhou o terrário de longe.','Dizer que {p} é da família|h-1|Ela não veio.']],
 ['Língua bifurcada','{p} fica com a língua para fora quando chego perto.',['Pesquisar|sm+1|Ela está me cheirando. Fofo, do jeito dela.']],
 ['Cobra na escola','A professora de biologia quer {p} na aula.',['Levar|k+3 f+1|As crianças perderam o medo de cobra.','Não|h+0|Melhor não.']],
 ['Mordida','Fui limpar o terrário e {p} deu o bote.',['Ir ao posto de saúde|$-200 hl-2|Não era venenosa. Só um susto.','Lavar e seguir|hl-3|Doeu por dias.']],
 ['Terrário bonito','Montei um terrário novo com plantas e pedras.',['Ver {p} explorar|bond+4 h+3|Ficou enrolada numa pedra quente o dia todo.']],
]);

bxPack('b_aracn',[
 ['Troca de pele','Encontrei uma "{p}" morta no terrário. Era só a pele velha.',['Respirar aliviad{o}|h+2|{p} está do lado, brilhando de nova.']],
 ['Grilo','{p} está com fome.',['Dar um grilo|bond+2|Uma caçada rápida.']],
 ['Visita apavorada','Uma visita viu {p} e saiu gritando.',['Explicar que é inofensiv{o2}|k+1|Ela não voltou mesmo assim.','Achar graça|h+3 k-1|Clássico.']],
 ['Fuga','{p} sumiu do terrário.',['Revirar o quarto|?70 bond+2|Estava dentro de um sapato.|h-5|Não dormi por três noites.']],
 ['Pelos urticantes','{p} soltou pelos que coçam quando me assustei.',['Lavar as mãos|hl-1|Aprendi a não fazer movimentos bruscos.']],
 ['Brilho no escuro','Li que escorpiões brilham sob luz ultravioleta.',['Testar com uma lanterna UV|$-50 h+4|{p} brilhou azul no escuro. Incrível.']],
 ['Feira de bichos','Uma feira de exóticos quer {p} na exposição.',['Levar|$+300 f+1 h+3|Muita gente perdeu o medo.','Não|h+0|{p} não gosta de multidão.']],
 ['Terrário novo','{p} precisa de um terrário maior.',['Comprar|$-300 bond+3|Agora tem uma toca de verdade.']],
]);

bxPack('b_macaco',[
 ['Macaco ladrão','{p} roubou meus óculos e subiu na estante.',['Trocar por uma banana|bond+2 h+2|Negócio fechado.','Correr atrás|?40 h+1|Peguei de volta.|$-300|Os óculos caíram e quebraram.']],
 ['Imitação','{p} está imitando tudo o que eu faço.',['Brincar de espelho|bond+5 h+5|Uma hora de risada.']],
 ['Bagunça','{p} abriu todos os armários da cozinha.',['Arrumar e colocar travas|$-150 h-1|Casa à prova de macaco.','Rir|h+2|Farinha até no teto.']],
 ['Macaco na vizinhança','{p} fugiu para a casa do vizinho.',['Buscar e pedir desculpas|k+1|O vizinho achou divertido.','Esperar voltar|?60 h+0|Voltou para o jantar.|$-800 k-2|Quebrou umas coisas por lá.']],
 ['Mordida','{p} ficou estressado e mordeu alguém.',['Veterinário comportamental|$-1200 bond+3|Ajudou muito.','Ignorar|k-2|A pessoa ficou furiosa.']],
 ['Fiscalização','O IBAMA quer saber de onde veio {p}.',['Mostrar a documentação|?70 h+0|Tudo certo.|$-6000|Faltava um papel. Multa.']],
 ['Abraço de macaco','{p} pulou no meu colo e me abraçou.',['Abraçar de volta|bond+6 h+5|Melhor abraço do mundo.']],
 ['Macaco no celular','{p} pegou meu celular e tirou cinquenta selfies.',['Postar as melhores|follow+300 h+4|Viralizou.']],
 ['Tédio','{p} parece entediado.',['Esconder frutas pela casa|bond+5 h+3|Uma caça ao tesouro.','Comprar brinquedos|$-200 bond+3|Funcionou.']],
 ['Macaco na TV','{p} aprendeu a ligar a TV sozinho.',['Deixar|h+2|Gosta de desenho animado.']],
]);

bxPack('b_capivara',[
 ['Capivara zen','{p} deixou dois passarinhos sentarem nas costas dela.',['Tirar foto|follow+200 h+5|A foto mais tranquila da internet.']],
 ['Piscina','{p} precisa de água para nadar.',['Construir um laguinho|$-3000 bond+6 hl+2|{p} passa o dia boiando.','Mangueira|bond+2|Quebra o galho.']],
 ['Capim','{p} comeu o gramado inteiro do quintal.',['Plantar mais capim|$-100 h+1|Cortador de grama natural.']],
 ['Vizinhos','Os vizinhos querem conhecer {p}.',['Deixar|k+2 h+4|Fila no portão.']],
 ['Turista','Um turista estrangeiro pagou para tirar foto com {p}.',['Aceitar|$+200 h+2|{p} nem se mexeu.']],
 ['Capivara e cachorro','{p} deixou um cachorro deitar do lado dela.',['Ver|h+4|Ela é amiga de todo mundo.']],
 ['Calor','{p} está com calor.',['Molhar com mangueira|bond+4 h+2|Ela fechou os olhos de felicidade.']],
]);

bxPack('b_raposa',[
 ['Grito de raposa','{p} deu um grito estranho no meio da noite.',['Pesquisar|sm+1 h+1|É assim que raposas conversam.','Reclamar|h-1|Não adiantou.']],
 ['Cavando','{p} cavou um túnel no quintal.',['Deixar|bond+3|Ela adora uma toca.','Tapar|bond-2|Cavou outro.']],
 ['Raposa e galinhas','{p} está olhando as galinhas do vizinho com muito interesse.',['Reforçar a cerca|$-400 k+2|Tudo seguro.','Ignorar|?70 h+0|Nada aconteceu.|$-600 k-3|Paguei as galinhas do vizinho.']],
 ['Brinquedo','{p} brinca de jogar a bolinha para o alto.',['Brincar junto|bond+5 h+4|Parece um gato e um cachorro ao mesmo tempo.']],
 ['Cheiro forte','{p} marcou território dentro de casa.',['Limpar e comprar caixa de areia|$-80 h-1|Aos poucos ela aprende.']],
 ['Raposa famosa','Um vídeo de {p} pulando na neve viralizou.',['Criar perfil|follow+500 f+2|{p} é famosa.']],
]);

bxPack('b_lobo',[
 ['Uivo','{p} uivou para a lua a noite inteira.',['Uivar junto|h+4 bond+5|Os vizinhos não acharam graça. Eu achei.','Fechar a janela|h+0|Ainda ouvi.']],
 ['Vizinhos com medo','Os vizinhos estão com medo de {p}.',['Mostrar que é dócil|?60 k+3|Eles se acalmaram.|k-2|Fizeram uma reclamação formal.','Construir um muro alto|$-4000|Problema resolvido.']],
 ['Matilha','{p} me trata como líder da matilha.',['Aceitar o cargo|bond+5 h+3|Agora sou o alfa da casa.']],
 ['Comida','{p} come muito.',['Comprar carne de qualidade|$-800 bond+4 hl+2|{p} está forte e brilhante.']],
 ['Fuga para a mata','{p} fugiu para a mata perto de casa.',['Procurar|?60 bond+6|{p} voltou quando ouviu minha voz.|h-8|{p} só voltou uma semana depois.']],
 ['Encontro na trilha','Na trilha, {p} ficou parado olhando para o mato.',['Ficar quiet{o}|h+2|Um veado passou correndo.','Puxar a coleira|bond-1|Seguimos em frente.']],
 ['Lobo e criança','Uma criança do bairro quer fazer carinho em {p}.',['Deixar com cuidado|?85 k+3 h+3|{p} deitou e deixou.|hl-1 k-2|{p} se assustou e rosnou.','Não|h+0|Melhor não arriscar.']],
]);

bxPack('b_felino',[
 ['Rugido','{p} rugiu de manhã e o vidro da janela tremeu.',['Admirar|h+3|Ainda me arrepio.']],
 ['Carne demais','{p} come muita carne.',['Pagar a conta|$-2000 bond+3|Um felino forte e feliz.','Diminuir a porção|bond-4|{p} ficou de mau humor.']],
 ['Fiscalização','A polícia ambiental veio ver o recinto de {p}.',['Mostrar tudo em ordem|?60 h+0|Passou na vistoria.|$-15000|Recinto irregular. Multa pesada.']],
 ['Brincadeira bruta','{p} quis brincar e me derrubou.',['Rir|?80 bond+5 h+3|Só um susto.|hl-15|Um arranhão feio. Pronto-socorro.','Ser mais cuidados{o}|bond+1|Brincadeira só com brinquedo.']],
 ['Visita da imprensa','Uma revista quer fotografar {p}.',['Aceitar|$+5000 f+4 h+3|{p} saiu na capa.','Recusar|h+0|Privacidade.']],
 ['Ronronar grosso','{p} encostou a cabeça em mim e ronronou como um motor.',['Fazer carinho|bond+6 h+5|Um gato gigante.']],
 ['Piscina','{p} adora água.',['Construir uma piscina|$-15000 bond+6 hl+2|Os mergulhos dele são lindos.']],
 ['Vizinho apavorado','O vizinho viu {p} pelo portão e chamou a polícia.',['Explicar|?60 h+0|Tudo resolvido.|$-3000 k-2|Deu uma confusão enorme.']],
 ['Santuário','Um santuário de animais quer receber {p}.',['Doar {p} para o santuário|k+8 bond-20|{p} vai viver com outros da espécie. Visito sempre.','Ficar com ele|bond+3|{p} fica em casa.']],
 ['Sono pesado','{p} dormiu dezoito horas seguidas.',['Deixar|h+2|É assim que felinos são.']],
]);

bxPack('b_lhama',[
 ['Cuspe','{p} cuspiu na visita.',['Pedir desculpas|k+1|Ela não vai esquecer.','Rir escondido|h+3 k-1|Ela percebeu.']],
 ['Tosquia','A lã de {p} está enorme.',['Tosquiar e vender a lã|$+400 bond-1|{p} ficou magrinha e com frio.','Deixar|bond+1|Uma bola de lã com pernas.']],
 ['Lhama no passeio','Levei {p} para passear no parque.',['Deixar as crianças fazerem carinho|k+3 h+4|Um sucesso.']],
 ['Lhama de guarda','{p} espantou uma raposa do quintal.',['Agradecer|bond+4 h+2|Lhamas são ótimas guardas.']],
 ['Festa de aniversário','Uma família quer alugar {p} para uma festa infantil.',['Aceitar|$+600 h+2|{p} foi a estrela.','Recusar|h+0|{p} não gosta de barulho.']],
 ['Feno','O feno acabou.',['Comprar|$-200 bond+2|{p} ficou feliz de novo.']],
]);

bxPack('b_cavalo',[
 ['Cavalgada','Está um dia lindo para cavalgar.',['Cavalgar com {p}|bond+6 hl+3 h+4|Uma tarde inteira no campo.','Só escovar|bond+3|{p} adora uma escovação.']],
 ['Ferradura solta','A ferradura de {p} se soltou.',['Chamar o ferrador|$-300 bond+2|Pronto para outra.']],
 ['Cólica','{p} está deitando e levantando o tempo todo.',['Veterinário urgente|$-2500 bond+5|Foi uma cólica. O tratamento rápido salvou {p}.','Esperar|?40 h+0|Passou.|petdie|Era grave. {p} não resistiu.']],
 ['Competição de salto','Vai ter uma competição de salto na hípica.',['Inscrever {p}|$-800 ?40 $4000 f+2 h+6|Primeiro lugar!|hl-3 h-1|Caí no segundo obstáculo.','Só assistir|h+2|Foi bonito.']],
 ['Cavalo assustado','{p} se assustou com um saco plástico e saiu correndo.',['Segurar a rédea|?60 bond+3|Consegui acalmar {p}.|hl-8|Caí feio.','Soltar|bond-1|Fui buscar {p} no pasto.']],
 ['Capim fresco','Achei um pasto bonito perto de casa.',['Levar {p}|bond+5 h+3|{p} rolou na grama.']],
 ['Escovação','A crina de {p} está cheia de nós.',['Escovar com calma|bond+5 h+2|Ficou brilhando.']],
 ['Baia nova','A baia de {p} está velha.',['Reformar|$-3000 bond+4|Agora tem palha nova e janela.']],
 ['Passeio na praia','Uma fazenda oferece cavalgada na praia.',['Ir com {p}|$-400 bond+6 h+6|O pôr do sol mais bonito da minha vida.']],
 ['Cavalo e criança','Meu sobrinho quer andar em {p}.',['Puxar pela rédea devagar|k+3 h+4|Ele vai lembrar disso para sempre.']],
 ['Venda','Um criador ofereceu muito dinheiro por {p}.',['Vender|$+20000 bond-20 h-5|Que saudade.','Recusar|bond+4|{p} não tem preço.']],
 ['Relincho de bom dia','{p} relincha toda vez que me vê.',['Dar uma maçã|bond+4 h+3|Nosso bom dia.']],
]);

bxPack('b_porco',[
 ['Lama','{p} achou uma poça de lama e se jogou.',['Deixar|bond+4 h+3|Porcos usam a lama para se refrescar.','Dar banho depois|bond+2|Limpinh{o2} e feliz.']],
 ['Porco inteligente','{p} aprendeu a abrir a porta da geladeira.',['Colocar trava|$-80|Acabou a festa.','Rir|h+3 $-150|Comeu tudo.']],
 ['Porco na coleira','Levei {p} para passear de coleira.',['Desfilar pelo bairro|h+5 f+1|Todo mundo parou para ver.']],
 ['Chafurdando','{p} destruiu o jardim procurando raízes.',['Fazer um cantinho só del{o2}|$-200 bond+4|O resto do jardim sobreviveu.']],
 ['Ronco','{p} ronca mais alto que o meu pai.',['Rir|h+3|Uma orquestra.']],
 ['Banho de sol','{p} está deitad{o2} de barriga para cima no sol.',['Passar protetor|$-30 bond+3|Porcos se queimam no sol.']],
 ['Porco famoso','O vídeo de {p} fazendo truques viralizou.',['Criar perfil|follow+400 f+2 h+3|{p} tem mais fãs que muita gente.']],
]);

bxPack('b_cabra',[
 ['Em cima do carro','{p} subiu em cima do carro.',['Tirar de lá|h+1|Ficou marca de casco.','Tirar foto|follow+80 h+3|Bode no capô.']],
 ['Comeu a roupa','{p} comeu uma camisa do varal.',['Rir|h+2|Era a camisa velha. Sorte.','Comprar outra|$-80|Era a camisa nova.']],
 ['Berro','{p} berrou tão alto que pareceu gente gritando.',['Ver se está tudo bem|bond+2|Só queria atenção.']],
 ['Ioga com cabra','Uma academia quer {p} numa aula de ioga.',['Aceitar|$+300 h+4 f+1|{p} subiu nas costas de todo mundo.']],
 ['Cerca pulada','{p} pulou a cerca de novo.',['Cerca mais alta|$-500|Por enquanto.','Buscar na casa do vizinho|k-1|De novo.']],
 ['Leite','{p} deu bastante leite esta semana.',['Fazer queijo|h+4 sm+1|O melhor queijo da vida.'],{when:m=>people('pet').some(p=>/Cabra/.test(p.species)&&p.gender==='F')}],
 ['Chifrada','{p} deu uma chifrada de brincadeira.',['Brincar com cuidado|bond+3 hl-1|Ela é forte.']],
]);
