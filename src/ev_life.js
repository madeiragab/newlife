// ===== Eventos por fase da vida, estudos, amor e família =====
// ---------- ensino fundamental ----------
pack({k:'Escola',when:studying('fund'),max:14},[
 ['Dia das crianças','A escola fez uma gincana no dia das crianças.',['Participar de tudo|h+6 tal.athletic+2|Meu time ganhou a corrida do saco!','Ficar com os amigos no canto|h+3|Comemos pipoca a tarde toda.']],
 ['Lição de casa esquecida','Esqueci a lição de casa pela terceira vez.',['Fazer correndo no recreio|?sm grade+2|Deu tempo!|grade-3|Ficou incompleta.','Dizer que o cachorro comeu|?20|A professora riu e me deu mais um dia.|grade-4|Ela não acreditou.']],
 ['Troca de lanche','Um colega quer trocar o salgadinho dele pela minha maçã.',['Trocar|h+3 hl-1|Negócio fechado.','Não trocar|hl+1|Maçã é vida.']],
 ['Novo aluno','Chegou um aluno novo na turma e ninguém fala com ele.',['Chamar para brincar|k+4 h+3|Agora ele é meu amigo.','Ignorar como todo mundo|k-1|Ele almoçou sozinho a semana toda.']],
 ['Festa junina da escola','Vai ter festa junina e eu preciso dançar quadrilha.',['Dançar animad{o}|h+5|Pisei no pé do meu par, mas foi divertido.','Me esconder atrás da barraca de pescaria|h+1|Ganhei um apito na pescaria.']],
 ['Briga de gangue mirim','Os meninos da outra sala nos desafiaram para um jogo de futebol valendo figurinhas.',['Aceitar o desafio|?tal.athletic h+6|Vencemos!|h-3|Perdemos de goleada.','Chamar um adulto|k+2 h-2|Fui chamad{o} de dedo-duro pelo resto do ano.','Fugir correndo|h-2|Ninguém viu, mas eu sei.']],
 ['Professora favorita','Minha professora favorita vai se mudar de cidade.',['Fazer um cartão de despedida|k+2 h-2|Ela chorou ao ler.','Ficar triste em silêncio|h-4|Vou sentir falta.']],
 ['Feira do livro','A escola fez uma feira do livro.',['Comprar um livro|sm+2 $-30|Li em dois dias.','Só olhar as figuras|sm+1|Gostei das ilustrações.']],
 ['Prova oral','A professora vai me chamar para responder na frente da turma.',['Responder com confiança|?sm grade+3 h+3|Acertei tudo!|h-4|Travei e a turma riu.','Enrolar falando bonito|?lk grade+2|O professor ficou confuso e deu nota.|grade-4|Ele percebeu na hora.','Fingir dor de barriga|?50|Ganhei uma segunda chance.|grade-3|A enfermeira não acreditou.']],
 ['Passeio de bicicleta','Os amigos da rua vão andar de bicicleta até o outro bairro.',['Ir junto|?75 h+6|Foi uma aventura!|hl-5|Caí numa descida.','Ficar em casa|h-1|Fiquei vendo TV.']],
]);
// ---------- ensino médio ----------
pack({k:'Escola',when:studying('medio')},[
 ['Grupo do WhatsApp da turma','O grupo da turma está discutindo quem vai para a festa de sábado.',['Organizar a festa|h+5 f+1|A festa foi um sucesso.','Ficar só lendo|h+1|Vi tudo pelos stories.']],
 ['Professor carrasco','O professor de {materia} reprovou metade da sala.',['Estudar dobrado|grade+5 h-3|Passei com folga.','Organizar uma reclamação|?50 grade+2|A direção revisou as notas.|grade-2|Não deu em nada.']],
 ['Tirar a habilitação','Meus amigos estão economizando para a autoescola.',['Começar a guardar dinheiro|sm+1|Já tenho metade.','Deixar para depois|h+1|Tenho tempo.']],
 ['Escolha da profissão','O teste vocacional disse que eu deveria ser {prof}.',['Levar a sério|sm+1 h+2|Comecei a pesquisar sobre a área.','Rir do resultado|h+2|Esses testes não sabem de nada.']],
 ['Matar aula em grupo','A turma toda combinou de matar a última aula.',['Ir junto|h+5 grade-3|Fomos todos para a lanchonete.','Ficar na aula|grade+2 h-2|Sobrou eu e mais dois na sala.']],
 ['Paixão platônica','Estou apaixonad{o} por alguém da outra turma, mas nunca falei com essa pessoa.',['Mandar uma mensagem|?lk h+8|A pessoa respondeu! Conversamos a noite toda.|h-6|Visualizou e não respondeu.','Continuar admirando de longe|h-2|Um dia eu falo.']],
 ['Semana de provas','Semana de provas finais. O nervoso está a mil.',['Estudar com café|grade+5 hl-2|Fiz todas as provas acordad{o}.','Estudar em grupo|grade+3 h+2|Aprendi mais rindo do que sozinh{o}.']],
 ['Feira de profissões','Uma feira de profissões veio à escola.',['Visitar os estandes|sm+2|Fiquei interessad{o} em {prof}.','Pegar os brindes e ir embora|h+2|Ganhei três canetas e um chaveiro.']],
 ['Viagem de formatura','A turma está organizando uma viagem de formatura.',['Ir|$-v h+10 c:trips|Uma semana inesquecível com a turma.','Não ir|h-4|Vi tudo pelas fotos.'],{min:17,v:[1500,5000]}],
]);
// ---------- faculdade ----------
pack({k:'Faculdade',when:studying('uni')},[
 ['Trote','Os veteranos estão preparando o trote dos calouros.',['Participar na boa|h+4|Fui pintad{o} e pedi dinheiro no semáforo. Rimos muito.','Recusar o trote|k+1|Respeitaram minha decisão.'],{max:22}],
 ['República de estudantes','Uns colegas me chamaram para dividir uma república.',['Me mudar para a república|h+6 sm-1|A geladeira é coletiva e ninguém lava a louça.','Continuar onde moro|h+0|Prefiro meu sossego.']],
 ['Estágio','Abriu um estágio na área de {curso}.',['Me candidatar|?sm $v perf+0 sm+2|Consegui o estágio! Recebo {v} por ano.|h-3|Não fui selecionad{o}.','Focar só nas aulas|grade+3|Minhas notas agradecem.'],{v:[4000,12000]}],
 ['Iniciação científica','Um professor me convidou para a iniciação científica.',['Aceitar|sm+4 grade+3 h-2|Meu primeiro artigo saiu!','Recusar|h+2|Não tenho tempo.']],
 ['Festa da faculdade','Vai ter uma festa enorme no campus.',['Ir|h+6 add.alcool+4|Dancei até o sol nascer.','Estudar|grade+2|Os outros me contaram no dia seguinte.']],
 ['TCC','Chegou a hora do trabalho de conclusão de curso.',['Me dedicar de verdade|grade+6 sm+2 h-3|Tirei nota máxima.','Fazer nas coxas|?50|Passou.|grade-6|Pediram para refazer.'],{when:m=>m.edu.cur.yr>=m.edu.cur.len-1}],
 ['Greve na universidade','A universidade entrou em greve.',['Aproveitar para trabalhar|$v|Fiz bicos e ganhei {v}.','Participar da greve|k+2|Fizemos assembleias diárias.'],{when:m=>m.edu.cur.pub,v:[500,3000]}],
 ['Monitoria','O professor me ofereceu ser monitor da disciplina.',['Aceitar|sm+3 $v|Ensinar me ajudou a aprender mais.','Recusar|h+1|Prefiro meu tempo livre.','Aceitar e passar as respostas da prova|?60 $v k-5|Fiquei popular.|grade-10 k-6|Descobriram. Perdi a monitoria e levei advertência.'],{v:[600,2400]}],
 ['Intercâmbio acadêmico','Abriu edital de intercâmbio de um semestre em {lugar}.',['Me inscrever|?sm h+10 sm+4 c:trips|Passei! Um semestre em {lugar}.|h-3|Não fui selecionad{o}.','Não me inscrever|h-1|Fiquei com a pulga atrás da orelha.','Falsificar a carta de recomendação|?55 c:trips h+8 k-6|Passei, mas com culpa.|grade-10 k-8|Descobriram. Quase fui expuls{o}.']],
 ['Calouros perdidos','Os calouros estão perdidos no campus.',['Ajudar os calouros|k+3 h+2|Ganhei uns amigos novos.','Mandar os calouros para o lugar errado|h+3 k-3|Eles foram parar na sala dos professores.','Cobrar pelo "tour"|$50 k-2|Ganhei $50 dos calouros mais ingênuos.'],{when:m=>m.edu.cur.yr>=2}],
]);
pack({k:'Medicina',when:courseIn('med')},[
 ['Aula de anatomia','Primeira aula de anatomia com cadáveres de verdade.',['Encarar|sm+3|Foi impressionante.','Desmaiar|h-3|Acordei com o professor me abanando.']],
 ['Internato','Estou fazendo plantões no hospital como interno.',['Me dedicar|sm+3 hl-3 grade+4|Aprendi mais em um mês do que em um ano.','Fazer o mínimo|grade-2 h+3|Passei, mas sem brilho.','Dormir no plantão|?50 h+4|Ninguém percebeu.|grade-6|O chefe da equipe me pegou roncando.']],
]);
pack({k:'Direito',when:courseIn('dir')},[
 ['Júri simulado','Vou ser advogad{o} de defesa no júri simulado.',['Fazer um discurso emocionante|?sm grade+5 h+5|Absolvi meu "cliente".|grade-2|Perdi feio.','Improvisar sem preparar|?sm-20 grade+3|Deu certo, de algum jeito.|grade-4 h-3|Gaguejei feio.','Faltar|grade-4|Meu grupo nunca mais falou comigo.']],
 ['Exame da ordem','Estou estudando para o exame da ordem dos advogados.',['Estudar todo dia|sm+3 grade+4|Me sinto preparad{o}.','Estudar só na última semana|?sm-25 grade+2|Deu certo!|grade-3 h-4|Não estou nada preparad{o}.','Comprar o gabarito vazado|?40 grade+6 k-8|Era verdadeiro.|k-6 arrest:fraude_em_exame:0:1|Era golpe e ainda me denunciaram.']],
]);
pack({k:'Engenharia',when:courseIn('eng','cc','fis','qui','aer')},[
 ['Cálculo III','Cálculo III está reprovando 70% da turma.',['Virar a noite estudando|?sm grade+6|Passei!|grade-6 h-5|Vou ter que fazer de novo.','Colar na prova|?50 grade+5 k-4|Passei sem saber nada.|grade-10 k-4|Fui pego. Zero e advertência.','Desistir da matéria|grade-2 h+3|Vou fazer de novo no ano que vem.']],
 ['Projeto de robô','Minha equipe vai competir com um robô.',['Liderar o projeto|?sm sm+3 h+8|Ganhamos a competição!|sm+1|O robô pegou fogo na apresentação.','Deixar o grupo fazer tudo|h+3 grade-2|Ganharam sem mim. Meu nome nem saiu no certificado.','Sabotar o grupo rival|?50 h+5 k-6|Ganhamos.|k-6 grade-6|Descobriram e fomos desclassificados.']],
]);
pack({k:'Artes',when:courseIn('art','mus','moda','arq','gas','jor')},[
 ['Apresentação final','Minha apresentação final vai ser aberta ao público.',['Caprichar|tal.art+3 tal.acting+2 tal.musical+2 grade+5 h+5|Fui aplaudid{o} de pé.','Improvisar sem ensaiar|?40 h+4|Ninguém percebeu.|grade-3 h-4|Foi um desastre.','Não apresentar|grade-5|Tirei zero.']],
 ['Crise de criatividade','Sinto que não sou talentos{o} o suficiente.',['Continuar mesmo assim|h-2 tal.art+2|Persistir é metade do talento.','Pensar em trocar de curso|h-4|Ainda não decidi.']],
]);
pack({k:'Estudos',when:studying('post')},[
 ['Orientador sumido','Meu orientador não responde e-mails há dois meses.',['Ir até a sala dele|?60 grade+3|Ele lembrou que eu existo.|h-4|Ele estava em licença.','Seguir sozinh{o}|sm+3 h-3|Aprendi a me virar.']],
 ['Defesa','Chegou o dia da minha defesa.',['Defender com confiança|?sm grade+8 h+10|Aprovad{o} com louvor!|grade-2 h-6|A banca pediu correções.','Pedir para adiar|h-2|Ganhei mais seis meses de angústia.','Pagar alguém para escrever a tese|$-v ?60 grade+6 k-10|Ninguém percebeu.|k-10 grade-20|O software antiplágio pegou tudo.'],{when:m=>m.edu.cur.yr>=m.edu.cur.len-1}],
]);
// ---------- namoro e casamento ----------
pack({k:'Amor',who:'partner',when:m=>people('namoro').length},[
 ['Primeira viagem juntos','{p} sugeriu uma viagem só nós dois.',['Ir|$-v bond+10 h+8 c:trips|Foi a viagem mais romântica da minha vida.','Dizer que estou sem dinheiro|bond-4|{p} entendeu. Mais ou menos.'],{v:[800,5000]}],
 ['Conhecer os pais','{p} quer que eu conheça a família no domingo.',['Ir com um presente|?k bond+8 h+4|A família me adorou.|bond-3|O pai de {p} me olhou feio o almoço inteiro.','Inventar uma desculpa|bond-8|{p} ficou chatead{o2}.']],
 ['Ciúmes','{p} ficou com ciúmes de uma mensagem no meu celular.',['Mostrar a conversa toda|bond+3 k+2|Era só um colega de trabalho. Tudo resolvido.','Ficar ofendid{o}|bond-8|Passamos a noite sem nos falar.']],
 ['Morar juntos?','{p} perguntou se eu quero morar junto.',['Aceitar|bond+10 h+6|Agora dividimos o mesmo teto. E a mesma conta de luz.','Dizer que é cedo|bond-6|{p} disse que entende.'],{min:18}],
 ['Aniversário de namoro','Fazemos aniversário de namoro esta semana.',['Preparar uma surpresa|$-300 bond+10|{p} chorou de emoção.','Esquecer completamente|bond-12|{p} esperou o dia todo.']],
 ['Crise no namoro','Estamos brigando muito ultimamente.',['Sentar e conversar|?k bond+10|Saímos mais fortes.|bond-6|A conversa virou briga.','Terminar|breakup h-8|Terminamos. Doeu.','Ignorar o problema|bond-5|Varri para debaixo do tapete.']],
 ['Bichinho juntos','{p} quer adotar um bichinho comigo.',['Adotar|bond+6 h+5 pet|Adotamos um filhote!','Ainda não|bond-2|Talvez mais para frente.'],{min:18}],
]);
pack({k:'Amor',who:'partner',when:m=>people('noivo').length},[
 ['Preparativos do casamento','Os preparativos do casamento estão me enlouquecendo.',['Contratar um cerimonialista|$-v h+4|Agora outra pessoa se estressa por mim.','Fazer tudo sozinh{o}|h-6 bond+3|Economizei, mas quase enlouqueci.'],{v:[3000,15000]}],
 ['Pés frios','A data se aproxima e bateu uma dúvida enorme.',['Conversar com {p}|bond+8|A dúvida passou. É com {p} mesmo.','Cancelar o noivado|breakup h-10|Cancelei tudo. A família ficou em choque.']],
 ['Briga com a família de {p}','A família de {p} quer controlar tudo do casamento.',['Ceder|bond+4 h-4|Fica do jeito deles.','Bater o pé|bond-3 h+3|Do nosso jeito!']],
]);
pack({k:'Casamento',who:'spouse',when:m=>people('conjuge').length},[
 ['Rotina','A rotina do casamento está pesando.',['Planejar um encontro como no começo|$-300 bond+10 h+5|Lembramos por que nos apaixonamos.','Deixar como está|bond-4|Mais uma noite de série em silêncio.']],
 ['Tarefas de casa','{p} reclamou que só {ele} faz as tarefas de casa.',['Assumir mais tarefas|bond+8 h-2|A casa nunca esteve tão limpa.','Dizer que não é verdade|bond-8|A discussão durou dois dias.']],
 ['Bodas','Completamos mais um ano de casados.',['Renovar os votos|$-v bond+12 h+6|Uma festa linda.','Jantar a dois|$-200 bond+8|Simples e perfeito.'],{v:[3000,20000]}],
 ['Dinheiro do casal','Discutimos sobre como gastar as economias.',['Investir no futuro|bond+3 sm+1|Ficamos alinhados.','Fazer uma viagem|$-v bond+6 h+6 c:trips|Fomos para {lugar}.'],{v:[3000,15000]}],
 ['Ex aparecendo','Um ex de {p} voltou a mandar mensagens.',['Conversar com {p} com calma|?k bond+5|{p} bloqueou o ex na hora.|bond-5|Virou briga.','Fazer escândalo|bond-10|Exagerei.']],
 ['Projetos diferentes','{p} quer se mudar para outra cidade por causa do trabalho.',['Ir junto|bond+10 h-2|Recomeçamos em outro lugar.','Pedir para {ele} ficar|bond-6|{p} ficou, mas ressentid{o2}.']],
 ['Filhos?','{p} quer ter filhos agora.',['Concordar|bond+8|Vamos tentar!','Pedir mais tempo|bond-5|Ainda não estou pront{o}.'],{when:m=>m.age<45&&!kids().length}],
 ['Caso extraconjugal','Alguém do trabalho está dando em cima de mim descaradamente.',['Cortar na hora|k+3 bond+2|Deixei claro que sou casad{o}.','Ceder|c:cheats ?50 h+5|Ninguém descobriu. Ainda.|bond-40|{p} descobriu.']],
]);
pack({k:'Amor',when:m=>m.age>=20&&m.age<60&&!partner()},[
 ['Amigos casando','Todos os meus amigos estão casando e eu continuo solteir{o}.',['Entrar num aplicativo de namoro|h+2|Baixei. Vamos ver.','Curtir a vida de solteir{o}|h+4|Liberdade total.']],
 ['Encontro às cegas','Uma amiga quer me apresentar a {n}.',['Ir ao encontro|?lk h+6 meet:namoro|Foi ótimo! Começamos a namorar.|h-3|Foi o encontro mais constrangedor da minha vida.','Recusar|h+0|Não gosto de encontros armados.']],
 ['Solidão','Hoje bateu uma solidão forte.',['Ligar para um amigo|h+4|Conversamos por horas.','Sair para dançar|h+5|A noite foi animada.','Ficar em casa|h-4|Comi sorvete vendo filme triste.']],
 ['Paquera na academia','Alguém na academia vive olhando para mim.',['Puxar conversa|?lk h+6|Saímos para tomar um açaí.|h-4|Era miopia. Não estava olhando para mim.','Fingir que não vi|h+0|Continuo malhando.']],
]);
pack({k:'Amor',who:'ex',min:18,when:m=>people('ex').length},[
 ['Encontro com ex','Encontrei {p} no supermercado.',['Cumprimentar educadamente|k+2|Foi estranho, mas civilizado.','Me esconder atrás das prateleiras|h-2|{ele} me viu mesmo assim.']],
 ['Pensão','Estou em briga judicial com {p}.',['Fazer acordo|$-v|Assinamos um acordo de {v}.','Brigar até o fim|?50|Ganhei na justiça.|$-v2|Perdi e paguei {v2}.'],{v:[2000,20000],when:m=>(m.c.divorces||0)>0}],
]);
pack({k:'Luto',when:m=>(m.c.widow||0)>0&&!partner()},[
 ['Saudade','Hoje faria aniversário de casamento.',['Visitar o túmulo|h-4 k+1|Levei flores e conversei um pouco.','Olhar fotos antigas|h-6|Chorei e sorri ao mesmo tempo.']],
 ['Seguir em frente?','Meus amigos dizem que é hora de conhecer alguém novo.',['Tentar|h+3|Aceitei um café com alguém. Foi bom.','Ainda não|h-2|Meu coração não está pronto.']],
]);
// ---------- filhos ----------
pack({k:'Filhos',who:'baby'},[
 ['Noites sem dormir','{p} acorda de duas em duas horas.',['Revezar com o par|hl-2 h-2|Sobrevivemos.','Contratar uma babá noturna|$-v h+3|Dormi uma noite inteira!'],{v:[500,3000]}],
 ['Primeira palavra','{p} está quase falando.',['Treinar "mamã" e "papá"|bond+5 h+6|A primeira palavra foi "{palavra}".','Ensinar um palavrão de brincadeira|h+6 k-2|A primeira palavra foi impublicável. A avó não gostou.','Não forçar nada|h+2|A palavra veio no tempo dela.']],
 ['Vacinas','Dia de vacina para {p}.',['Levar ao posto|bond+2 k+1|Chorou, mas ganhou um adesivo.','Pular a vacina|k-4 bond-2|Fiquei com medo das notícias da internet.','Deixar para depois|k-1|Esqueci de novo.']],
 ['Creche','Preciso decidir a creche de {p}.',['Creche particular|$-v bond+3|Uma creche ótima.','Ficar com os avós|h+2|Os avós adoraram.'],{v:[3000,12000]}],
]);
pack({k:'Filhos',who:'child'},[
 ['Reunião de pais','Fui chamad{o} para a reunião de pais de {p}.',['Ir|bond+5|A professora elogiou {p}.','Faltar|bond-4|{p} ficou chatead{o2}.']],
 ['Apresentação da escola','{p} vai se apresentar na festa da escola.',['Ir e filmar tudo|bond+8 h+5|{p} me procurou na plateia e acenou.','Faltar por causa do trabalho|bond-8|{p} me perguntou por que não fui.']],
 ['Briga na escola','{p} brigou com um colega na escola.',['Conversar com calma|bond+4 k+2|{p} pediu desculpas ao colega.','Defender {p} na frente da diretora|bond+2 k-2|A diretora não gostou nada.']],
 ['Bicho de estimação','{p} quer muito um cachorrinho.',['Adotar um|bond+8 h+5 pet|{p} ficou radiante.','Dizer não|bond-4|Teve choro.']],
 ['Mentira','Peguei {p} mentindo sobre a lição de casa.',['Castigo sem videogame|bond-3 k+1|Aprendeu a lição.','Conversar sobre honestidade|bond+3|{p} prometeu não mentir mais.']],
 ['Festa de aniversário','O aniversário de {p} está chegando.',['Festa grande|$-v bond+8|{p} vai lembrar disso para sempre.','Bolo em casa|bond+3|Simples e feliz.'],{v:[800,6000]}],
 ['Medo de escuro','{p} não consegue dormir sozinh{o2}.',['Ler uma história|bond+6|Dormiu no terceiro capítulo.','Deixar a luz do corredor acesa|bond+2|Funcionou.']],
]);
pack({k:'Filhos',who:'teen'},[
 ['Primeiro namoro','{p} está namorando pela primeira vez.',['Conversar abertamente|bond+5|{p} ficou sem graça, mas agradeceu.','Proibir|bond-10|Agora namora escondid{o2}.']],
 ['Nota baixa','{p} tirou notas péssimas este bimestre.',['Contratar reforço|$-v bond+2|As notas melhoraram.','Tirar o celular|bond-6|As notas melhoraram. A relação, não.'],{v:[500,3000]}],
 ['Festa','{p} quer ir a uma festa que vai até 4h da manhã.',['Deixar com horário|bond+4|Voltou no horário!','Proibir|bond-6|{p} bateu a porta do quarto.','Deixar sem regras|?50 bond+6|Tudo certo.|bond-2 h-6|A polícia trouxe {p} para casa.']],
 ['Vestibular','{p} está em dúvida sobre qual faculdade fazer.',['Apoiar a escolha que {ele} quiser|bond+8|{p} escolheu o próprio caminho.','Pressionar por uma carreira segura|bond-6|{p} vai fazer o que eu mandei. Sem vontade.']],
 ['Carteira de motorista','{p} quer dirigir o carro da família.',['Ensinar|?70 bond+8|{p} já dirige bem.|bond+2 $-1500|Bateu no portão. $1.500.','Pagar autoescola|$-2000 bond+3|Mais caro, mas sem estresse.','Recusar e mandar pegar ônibus|bond-6|{p} ficou chatead{o2}.']],
 ['Mesada','{p} quer aumento de mesada.',['Dar o aumento|$-500 bond+5|Negociador nato.','Propor um trabalho em troca|bond+2 k+1|Agora {p} lava o carro todo sábado.']],
]);
pack({k:'Filhos',who:'adultkid'},[
 ['Visita no domingo','{p} veio almoçar em casa com a família.',['Fazer um almoço caprichado|bond+6 h+5|A casa encheu de novo.','Pedir comida por aplicativo|$-150 h+3|Ninguém reclamou.','Fingir que estou doente|bond-4 h+2|Fiquei vendo TV em paz.']],
 ['Pedido de conselho','{p} me pediu conselho sobre {assunto}.',['Dar um conselho sincero|bond+6 k+1|{p} me agradeceu.','Dizer o que {ele} quer ouvir|bond+2|{p} ficou feliz. Por enquanto.']],
 ['Casamento de {p}','{p} vai se casar!',['Ajudar a pagar a festa|$-v bond+12 h+8|Chorei na cerimônia.','Só comparecer|bond+3 h+5|Que dia lindo.'],{v:[5000,40000]}],
 ['Volta para casa','{p} perdeu o emprego e quer voltar a morar comigo.',['Receber de braços abertos|bond+10 h-2|A casa ficou cheia de novo.','Ajudar com dinheiro, mas sem morar junto|$-v bond+3|Ajudei a pagar o aluguel.'],{v:[2000,10000]}],
]);
pack({k:'Família',who:'grandkid',min:45},[
 ['Neto em casa','{p} vai passar as férias comigo.',['Fazer de tudo para agradar|bond+8 h+6|Estraguei {p} de mimo, como manda o figurino.','Deixar no celular a tarde toda|h+3 bond+1|Foi um sossego.','Ensinar a jogar baralho valendo dinheiro|bond+5 k-2|{p} limpou minha carteira.']],
 ['Desenho para os avós','{p} fez um desenho de nós dois.',['Pendurar na geladeira|bond+6 h+5|É a obra de arte mais bonita da casa.','Dizer que parece um rabisco|bond-8 k-3|{p} chorou.','Guardar numa gaveta|bond-2|Nunca mais vi o desenho.']],
]);
pack({k:'Família',who:'parent',min:18},[
 ['Pais envelhecendo','Percebi que {p} está esquecendo as coisas com frequência.',['Levar ao médico|bond+6 k+2|O médico passou exames.','Fingir que não é nada|bond-2|Deve ser só cansaço.'],{when:m=>parents().some(p=>p.age>=65)}],
 ['Almoço de domingo','{p} me chamou para o almoço de domingo.',['Ir|bond+6 h+4|Comi como se tivesse 10 anos.','Dizer que estou ocupad{o}|bond-5|{p} disse que tudo bem. Não estava tudo bem.']],
 ['Dinheiro emprestado','{p} pediu {v} emprestado.',['Emprestar|$-v bond+8|{p} me agradeceu muito.','Recusar|bond-8|Ficou um clima ruim.'],{v:[500,8000]}],
 ['Palpite na minha vida','{p} adora dar palpite na minha vida.',['Ouvir com paciência|bond+3 h-2|Respirei fundo.','Pedir para parar|bond-4 h+2|Pela primeira vez, {ele} parou.']],
]);
// ---------- fases da vida ----------
pack({k:'Vida',min:18,max:29},[
 ['Primeiro aluguel','Achei um apartamento pequeno só para mim.',['Me mudar|h+6 $-v|Minha casa, minhas regras. Minha conta de luz.','Continuar com os pais|h-1|Economizo mais.'],{when:m=>!S.flags.movedOut&&parents().length,v:[1500,5000]}],
 ['Ano sabático','Pensei em largar tudo e viajar o mundo por um ano.',['Fazer o mochilão|$-v h+12 c:trips|Conheci lugares e pessoas incríveis.','Deixar o sonho para depois|h-2|Um dia eu vou.'],{v:[8000,30000]}],
 ['Festival de música','Três dias de festival de música.',['Ir|$-v h+10 add.alcool+3|Melhor fim de semana do ano.','Assistir pela internet|h+2|Pelo menos não tomei chuva.'],{v:[500,2500]}],
 ['Crise dos 20','Sinto que todo mundo está mais avançado na vida do que eu.',['Fazer um plano|sm+2 h+3|Escrevi metas para os próximos cinco anos.','Desabafar com amigos|h+4|Todo mundo se sente assim.']],
 ['Cartão de crédito','O banco me ofereceu um cartão com limite alto.',['Aceitar e usar com cuidado|sm+1|Mantive as contas em dia.','Aceitar e gastar tudo|$-v h+5|Gastei {v} em coisas que nem lembro.'],{v:[2000,10000]}],
]);
pack({k:'Vida',min:30,max:49},[
 ['Exame de rotina','O médico pediu um check-up completo.',['Fazer todos os exames|$-500 hl+3|Tudo em ordem. Que alívio.','Adiar|hl-1|Ano que vem eu faço.']],
 ['Cabelos brancos','Encontrei os primeiros cabelos brancos.',['Assumir|h+2|Charme.','Pintar|$-200 lk+1|Ninguém precisa saber.']],
 ['Curso novo','Pensei em fazer um curso de algo totalmente diferente.',['Fazer um curso de {hobby}|sm+2 h+5|Descobri um talento escondido.','Deixar para lá|h-1|Falta tempo.'],{}],
 ['Previdência','Um consultor falou que eu preciso pensar na aposentadoria.',['Começar a investir|sm+2 $-v|Comecei a guardar {v} por ano.','Ignorar|h+1|Aposentadoria está longe.'],{v:[1000,6000]}],
 ['Reforma da casa','A casa precisa de uma reforma.',['Reformar|$-v h+5|Ficou linda, mas levou o dobro do tempo.','Adiar|h-2|Vou convivendo com a infiltração.'],{when:hasHouse,v:[5000,40000]}],
]);
pack({k:'Vida',min:50,max:64},[
 ['Corpo reclamando','Meus joelhos estalam quando subo a escada.',['Começar fisioterapia|$-800 hl+4|Estou andando melhor.','Ignorar|hl-2|Faz parte.']],
 ['Ninho vazio','Os filhos saíram de casa e a casa ficou silenciosa.',['Encontrar um hobby novo|h+6|Comecei a {hobby2}.','Transformar o quarto deles em escritório|h+3|Finalmente um escritório.'],{when:m=>kids().length&&kids().every(k=>k.age>=18)}],
 ['Planos para a aposentadoria','Comecei a pensar no que fazer quando me aposentar.',['Comprar uma casa na praia|$-v h+6|Já tenho meu cantinho.','Planejar viagens|h+4|Fiz uma lista de 20 países.'],{v:[50000,200000],when:m=>m.money>200000}],
]);
pack({k:'Velhice',min:65},[
 ['Tecnologia','Meu celular atualizou e eu não acho mais nada.',['Pedir ajuda aos netos|h+3|Me ensinaram. Esqueci no dia seguinte.','Desistir do celular|h-2|Voltei ao telefone fixo.']],
 ['Clube da terceira idade','Me convidaram para o clube de dança da terceira idade.',['Entrar|h+8 hl+2|Danço forró toda quinta.','Recusar|h-1|Não sou de dançar.']],
 ['Remédios','Já tomo seis remédios por dia.',['Organizar uma caixinha|hl+2|Nunca mais esqueci nenhum.','Tomar quando lembrar|hl-3|Esqueci metade.']],
 ['Visita ao médico','O médico disse que preciso parar de comer {comida}.',['Obedecer|hl+3 h-2|Que tristeza.','Comer escondido|hl-2 h+3|A vida é curta.'],{}],
 ['Jogo de cartas','Os vizinhos me chamaram para o carteado de sábado.',['Jogar valendo|?50 $200 h+5|Ganhei $200 dos vizinhos.|$-200|Perdi $200.','Jogar só por diversão|h+5|Rimos a tarde inteira.']],
 ['Histórias antigas','Os mais jovens da família querem ouvir histórias de quando eu era jovem.',['Contar tudo|h+6 k+1|Riram, choraram e gravaram.','Inventar aventuras que nunca aconteceram|h+8 k-1|Agora acham que lutei numa guerra.','Mudar de assunto|h-1|Tem coisa que é melhor esquecer.']],
]);
