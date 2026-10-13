// ===== Mais eventos coerentes com a situação =====
pack({k:'Infância',min:3,max:7},[
 ['Primeiro dia na creche','Hoje é meu primeiro dia sem os meus pais por perto.',['Chorar até me buscarem|h-4|Chorei três horas seguidas.','Fazer amizade com outra criança|h+5 meet|Conheci {n} na caixa de areia. Agora somos amig{on}s!']],
 ['Desenho na parede','Encontrei canetinhas coloridas e uma parede branca enorme.',['Desenhar um mural|tal.art+3 h+5|Ficou lindo. Meus pais não acharam.','Desenhar no papel|k+1|Que criança comportada.']],
 ['Esconde-esconde','Brincando de esconde-esconde, achei o esconderijo perfeito.',['Ficar escondid{o} até o fim|?60 h+5|Ninguém me achou! Ganhei.|h-3|Dormi dentro do armário e todo mundo se desesperou.','Trapacear e espiar|?60 h+4 k-1|Achei todo mundo rapidinho.|h-3|Me pegaram espiando. Ninguém quis mais brincar.','Ir embora para casa no meio|h+1|Os outros me procuraram até escurecer.']],
 ['Vacina','Dia de tomar vacina no posto.',['Ser corajos{o}|h+2 hl+2|Ganhei um pirulito.','Fazer escândalo|h-2 hl+2|O posto inteiro ouviu.']],
 ['Brinquedo quebrado','Meu brinquedo favorito quebrou.',['Pedir para o meu pai consertar|?60 h+4|Ficou como novo, só um pouco torto.|h-4|Ficou pior.','Fazer um enterro para ele|h-2|Fiz um funeral no quintal.']],
 ['Sonho de profissão','Hoje decidi o que vou ser quando crescer: {prof}.',['Contar para todo mundo|h+3|Todos acharam fofo.','Guardar segredo|h+1|É um sonho só meu.','Dizer que quero ser milionári{o} sem trabalhar|h+3 k-1|Meus pais riram nervosos.']],
 ['Cabana no quintal','Meu primo e eu vamos construir uma cabana no quintal.',['Construir|h+5 tal.art+1|Ficou torta, mas é nossa.','Construir com os móveis da sala|h+6 bond-3|Ficou incrível. Meus pais, nem tanto.','Desistir|h-1|Muito trabalho.']],
]);
pack({k:'Infância',min:8,max:12},[
 ['Álbum de figurinhas','Falta só uma figurinha para completar o álbum da Copa.',['Trocar com os amigos|?40 h+8|Completei o álbum!|h-2|Ninguém tinha.','Comprar mais pacotes|$-50 ?50 h+8|Saiu a figurinha!|h-3|Só vieram repetidas.']],
 ['Mesada','Meus pais propuseram uma mesada em troca de tarefas de casa.',['Aceitar|$+100 k+1|Lavo a louça e ganho meu dinheirinho.','Negociar mais|?50 $+150|Fechamos em um valor melhor.|h-2|Eles disseram "então nada".']],
 ['Clube do livro mirim','A biblioteca da escola abriu um clube de leitura.',['Entrar|sm+3 h+2|Li sete livros este ano.','Não entrar|h+1|Prefiro desenho.','Entrar e fingir que li|k-1 h+2|Contei o final errado e todo mundo descobriu.']],
 ['Truque de mágica','Ganhei um kit de mágica e quero fazer um show.',['Apresentar para a família|?tal.acting h+5 tal.acting+2|Todo mundo ficou impressionado.|h-2|O coelho de pelúcia caiu da manga.','Fazer o truque com o celular do meu pai|?40 h+6|Funcionou!|h-5 bond-4|O celular caiu na privada.','Desistir de apresentar|h-1|Fiquei com vergonha.']],
 ['Bicicleta roubada','Roubaram minha bicicleta na frente da escola.',['Contar aos meus pais|h-4|Ganhei uma nova no Natal.','Procurar pelo bairro|?30 h+6|Achei com um menino da outra rua!|h-4|Nunca mais vi a bicicleta.']],
 ['Primeiro celular','Todos da sala têm celular, menos eu.',['Pedir aos meus pais|?50 h+8|Ganhei um celular usado!|h-4|"Só aos 14 anos."','Juntar dinheiro|sm+1|Comecei a guardar moedas.']],
 ['Acampamento de férias','Meus pais querem me mandar para um acampamento de férias.',['Ir|h+8 tal.athletic+2|Fiz amigos para a vida toda.','Ficar em casa|h-1|Férias no sofá.']],
]);
pack({k:'Adolescência',min:13,max:17},[
 ['Primeiro emprego de verdade','Abriu vaga de jovem aprendiz numa empresa perto de casa.',['Me candidatar|?sm h+6|Passei na seleção!|h-3|Não fui chamad{o}.','Mentir no currículo|?55 h+6 k-3|Passei!|h-4 k-3|A entrevistadora fez perguntas que eu não sabia.','Não me candidatar|h-2|Fica para a próxima.']],
 ['Fase emo','Entrei numa fase de usar só roupa preta.',['Assumir o estilo|h+3 lk-1|Minha avó ficou preocupada.','Voltar ao normal|h+0|Foi só uma fase.']],
 ['Briga com os pais','Briguei feio com meus pais sobre a minha liberdade.',['Pedir desculpas|k+2 h+2|Fizemos as pazes.','Bater a porta do quarto|h-3|Dois dias de silêncio na casa.']],
 ['Viagem com amigos','Os amigos vão passar o feriado numa casa de praia.',['Ir|$-v h+8|Os dias mais divertidos do ano.','Ficar|h-3|Vi tudo pelas fotos.'],{v:[200,800]}],
 ['Influencer adolescente','Um vídeo meu na escola começou a bombar.',['Postar mais vídeos|follow+3000 f+1 grade-2|Já tenho milhares de seguidores.','Apagar a conta|h+2|Não quero essa exposição.']],
 ['Tirar foto 3x4','Preciso tirar foto para o primeiro documento.',['Sorrir|h+1|A foto ficou ótima.','Fazer cara de sério|h+0|Pareço uma pessoa procurada.']],
 ['Coração partido','Levei um fora de quem eu gostava.',['Chorar ouvindo música triste|h-6|Três dias de playlist sofrência.','Sair com os amigos|h+2|Os amigos me animaram.']],
 ['Show de talentos','A escola vai ter um show de talentos.',['Cantar|?tal.musical h+8 f+1|Fui aplaudid{o} de pé!|h-6|Desafinei na nota alta.','Fazer stand-up|?tal.comedy h+8|A escola inteira riu!|h-5|Silêncio total.','Só assistir|h+2|Foi divertido.']],
]);
pack({k:'Vida',min:18,max:35},[
 ['Dividir apartamento','Um amigo quer dividir um apartamento comigo.',['Aceitar|$+2000 h+3|Agora divido o aluguel e as brigas pela louça.','Morar sozinh{o}|h+2|Prefiro minha bagunça.'],{when:m=>S.flags.movedOut}],
 ['Concurso público','Abriu um concurso público com estabilidade e bom salário.',['Estudar e prestar|?sm sm+3 h+8|Passei no concurso!|sm+2 h-4|Não passei, mas aprendi muito.','Desistir antes da prova|h+2|Dormi até tarde no domingo.','Tentar colar com ponto eletrônico|?30 h+8 k-8|Passei.|k-8 arrest:fraude_em_concurso:1:3|A polícia estava esperando na saída.']],
 ['Bolsa no exterior','Vi um edital de mestrado com bolsa no exterior.',['Me candidatar|?sm-20 h+10 sm+4 c:trips|Ganhei a bolsa e passei uma temporada fora.|h-2|Não fui selecionad{o}.','Não me candidatar|h-1|Tive medo de ir.','Inflar o histórico escolar|?45 c:trips h+8 k-6|Funcionou.|k-6 h-6|Descobriram e me baniram do programa.'],{when:m=>m.edu.deg.some(d=>d.startsWith('uni:'))}],
 ['Amigo em apuros','Um amigo antigo me ligou de madrugada pedindo ajuda.',['Ir ajudar|k+4 hl-1|Fiquei com ele no hospital até amanhecer.','Atender e ouvir|k+2|Conversamos até ele se acalmar.']],
 ['Primeiro carro','Pensei em comprar meu primeiro carro.',['Comprar um usado|$-v h+6|Tem 15 anos de uso, mas é meu.','Continuar de ônibus|sm+1|Economizei.'],{when:m=>!hasCar(m)&&m.money>12000,v:[10000,20000]}],
 ['Festa de 30','Estou fazendo 30 anos.',['Festão|$-v h+8|Comemorei como se tivesse 20.','Jantar pequeno|h+4|Só quem importa.'],{min:30,max:30,v:[1000,8000]}],
]);
pack({k:'Vida',min:36,max:60},[
 ['Mudança de carreira','Penso em mudar totalmente de profissão.',['Voltar a estudar|h+4 sm+3|Me matriculei num curso noturno.','Continuar onde estou|h-2|É o que paga as contas.']],
 ['Reencontro com amigo de infância','Encontrei {n}, que foi meu melhor amig{on} de infância, no supermercado.',['Marcar um café|h+6 meet|Rimos como se tivéssemos 10 anos. Voltamos a ser amigos.','Só cumprimentar|h+1|Foi bom ver que está bem.']],
 ['Vizinho barulhento','O vizinho de cima resolveu reformar o apartamento aos domingos.',['Reclamar com o síndico|?50 h+2|A obra mudou de horário.|h-3|Nada mudou.','Conversar com o vizinho|?60 h+3 k+1|Ele pediu desculpas.|h-4|Ele bateu a porta na minha cara.']],
 ['Check-up assustador','O exame de rotina mostrou um resultado estranho.',['Fazer novos exames|$-1000 ?80 h+5|Era um erro do laboratório.|dis:hipertensao|Descobri que tenho pressão alta.','Ignorar e torcer|?60 h+2|Não era nada, aparentemente.|dis:hipertensao h-4|Ignorei e piorou.','Procurar no Google|h-6|Agora tenho certeza de que tenho todas as doenças.']],
 ['Aniversário de 50','Vou fazer 50 anos.',['Festa surpresa organizada pela família|h+10|Chorei quando vi todo mundo.','Viajar sozinh{o}|$-v h+8 c:trips|Me dei uma viagem de presente.'],{min:50,max:50,v:[3000,15000]}],
]);
pack({k:'Velhice',min:66},[
 ['Neto ensinando tecnologia','Meu neto quer me ensinar a fazer chamada de vídeo.',['Aprender|sm+2 h+4|Agora ligo para todo mundo, até de madrugada.','Dizer que no meu tempo era melhor|h+2 bond-2|Fiquei com meu telefone de fio.','Aprender e virar viciad{o} em vídeos|sm+1 h+6|Agora mando corrente no grupo da família.'],{when:m=>people('neto').length}],
 ['Hidroginástica','O médico recomendou hidroginástica.',['Começar|hl+4 h+4|A turma da piscina é animada.','Preferir o sofá|hl-2|O sofá me abraça.']],
 ['Bingo da igreja','Hoje tem bingo na igreja.',['Jogar|?20 $500 h+6|BINGO! Ganhei $500.|h+2|Faltou um número.','Gritar BINGO sem ter|?25 $500 k-4|Ninguém conferiu!|k-4 h-4|O padre conferiu.','Só tomar o café|h+2|O bolo estava ótimo.']],
 ['Fila de banco','Passei duas horas numa fila de banco.',['Reclamar com o gerente|h+1|Me atenderam primeiro da próxima vez.','Puxar conversa com a fila|h+4|Fiz três amizades.']],
 ['Esquecimento','Esqueci onde estacionei o carro.',['Pedir ajuda|h-2|Um rapaz me ajudou a achar.','Voltar de táxi|$-60 h-1|Achei o carro dois dias depois.'],{when:hasCar}],
 ['Viagem de aniversário de 80','A família quer comemorar meus 80 anos com uma viagem.',['Ir|h+12 c:trips|Uma viagem cheia de netos e risadas.','Ficar em casa|h-2|Já estou velh{o} para aeroporto.','Ir e aprontar|h+14 hl-3 c:trips|Fiz rafting aos 80. O médico não gostou.'],{min:80,max:80}],
]);
pack({k:'Amizade',who:'friend',min:10},[
 ['Segredo do amigo','{p} me contou um segredo pesado e pediu sigilo.',['Guardar o segredo|bond+8 k+3|{p} confia em mim mais do que nunca.','Contar para alguém|bond-20 k-4|O segredo vazou e {p} descobriu que fui eu.']],
 ['Aniversário de {p}','O aniversário de {p} é amanhã.',['Organizar uma festa surpresa|$-300 bond+12|{p} chorou de alegria.','Mandar uma mensagem|bond+2|Feliz aniversário!','Esquecer|bond-8|{p} reparou.']],
 ['Viagem de amigos','{p} quer fazer uma viagem só da turma.',['Topar|$-v bond+10 h+8 c:trips|Uma viagem cheia de histórias.','Não ir|bond-4|Fiquei ouvindo as histórias depois.'],{v:[800,4000],min:18}],
 ['Briga com {p}','{p} e eu brigamos por uma bobagem.',['Pedir desculpas primeiro|bond+8 k+2|Amizade salva.','Esperar {ele} pedir|?40 bond+2|{ele} pediu.|bond-10|Ninguém pediu. Esfriamos.']],
 ['{p} precisa de ajuda na mudança','{p} vai se mudar e pediu ajuda para carregar as coisas.',['Ajudar|bond+8 hl-1|Carreguei uma geladeira três andares.','Inventar uma desculpa|bond-6|{p} ficou chatead{o2}.'],{min:16}],
]);
pack({k:'Família',who:'sib',min:16},[
 ['Casamento de {p}','{p} vai se casar e quer que eu seja padrinho.',['Aceitar|bond+10 h+6 $-500|Fiz um discurso que fez todos chorarem.','Recusar|bond-10|{p} ficou muito chatead{o2}.']],
 ['{p} em crise','{p} perdeu o emprego e está mal.',['Ajudar com dinheiro|$-v bond+10|{p} me agradeceu muito.','Ajudar a procurar emprego|bond+6|Mandei currículos junto com {ele}.'],{v:[1000,8000]}],
 ['Herança dos pais','{p} e eu estamos discutindo sobre a herança dos nossos pais.',['Dividir em partes iguais|bond+6 k+3|Família acima de tudo.','Brigar pela minha parte|?50 $v bond-15|Fiquei com mais, mas perdi {p}.|bond-20|Perdi a briga e a relação.'],{when:m=>S.people.some(p=>!p.alive&&['mae','pai'].includes(p.rel)),v:[5000,50000]}],
 ['Sobrinho','{p} teve um bebê. Agora sou ti{o}!',['Visitar com um presente|$-200 bond+8 h+6|O bebê segurou meu dedo.','Mandar só uma mensagem|bond-2|Mandei uma figurinha de parabéns.','Visitar e reclamar do choro|bond-6|Não fui mais convidad{o}.'],{min:20}],
]);
pack({k:'Família',who:'parent',min:5,max:17},[
 ['Dia das mães e dos pais','Hoje é o dia de homenagear {p}.',['Fazer um cartão|bond+8|{p} guardou o cartão na carteira.','Esquecer|bond-4|{p} fingiu que não ligou.']],
 ['Ajudar em casa','{p} pediu ajuda para arrumar a casa no sábado.',['Ajudar|bond+5 k+1|Terminamos rápido e fomos tomar sorvete.','Fingir que estou doente|bond-3|Não colou.']],
 ['Conversa séria','{p} quer ter uma conversa séria comigo sobre o futuro.',['Ouvir com atenção|bond+5 sm+1|{ele} me deu bons conselhos.','Revirar os olhos|bond-5|A conversa acabou mal.']],
]);
pack({k:'Família',who:'parent',min:25},[
 ['Aniversário de casamento dos pais','Meus pais fazem bodas este ano.',['Organizar uma festa|$-v bond+10|Eles dançaram como se tivessem 20 anos.','Mandar flores|$-150 bond+4|Ficaram felizes.'],{v:[2000,10000]}],
 ['{p} doente','{p} está internad{o2} com uma gripe forte.',['Passar a noite no hospital|bond+10 hl-2|{p} segurou minha mão a noite toda.','Ligar todos os dias|bond+4|{ele} melhorou.']],
]);
pack({k:'Internet',min:13,when:m=>m.social},[
 ['Seguidor famoso','Uma pessoa famosa começou a me seguir.',['Mandar mensagem|?30 follow+5000 f+2|A pessoa respondeu! Postou sobre mim.|h-1|Visualizou e não respondeu.','Ignorar|h+0|Fingi que não vi.','Pedir dinheiro emprestado|?10 $5000|Mandou!|follow-200 f-1|Me bloqueou e postou print.'],{}],
 ['Desafio de dança','Um desafio de dança está bombando.',['Gravar o meu|?lk follow+2000|Viralizou!|follow+50|Poucas curtidas.','Não participar|h+0|Dancinha não é comigo.','Gravar uma versão zoando o desafio|?50 follow+4000 f+2|Viralizou mais que o original!|follow-100|Ninguém entendeu a piada.']],
 ['Golpe de perfil falso','Criaram um perfil falso meu pedindo dinheiro para os meus amigos.',['Denunciar o perfil|h-2|Derrubaram o perfil em dois dias.','Responder o golpista e enrolar|h+5|Fiz o golpista perder uma hora. Valeu cada minuto.','Ignorar|h-1|Alguns amigos caíram no golpe.']],
 ['Live com fãs','Fiz uma live para responder perguntas dos seguidores.',['Responder tudo com sinceridade|follow+800 h+4|Foi um papo muito legal.','Inventar polêmica para engajar|?50 follow+5000 f+3|O engajamento explodiu.|follow-3000 f-3|Os fãs perceberam a jogada.','Cancelar a live|follow-200|Os fãs ficaram decepcionados.']],
]);
pack({k:'Viagem',min:18,when:m=>(m.c.trips||0)>=1},[
 ['Passaporte vencido','Descobri que meu passaporte venceu uma semana antes da viagem.',['Pagar a emissão urgente|$-1500 h-2|Deu tempo, por pouco.','Cancelar a viagem|h-8|Perdi as reservas.']],
 ['Mala extraviada','A companhia aérea extraviou minha mala.',['Brigar no balcão|?50 h+2|Acharam em duas horas.|h-5|Só voltou uma semana depois.','Comprar roupas novas|$-800 h+2|Pelo menos renovei o guarda-roupa.']],
 ['Romance de férias','Conheci {n} numa viagem e foi amor à primeira vista.',['Viver o momento|h+10|Foi intenso e lindo.','Trocar contatos|?30 h+8 meet:namoro|Ainda conversamos todos os dias. Estamos namorando!|h-3|{n} sumiu depois que voltei.'],{when:single,date:1}],
]);
pack({k:'Bairro',min:12},[
 ['Festa na rua','Os vizinhos estão organizando uma festa na rua.',['Ajudar a organizar|k+3 h+5|Foi a melhor festa do bairro.','Só aparecer|h+4|Comi muito churrasco.']],
 ['Cachorro perdido','Um cachorro perdido está rondando o bairro com coleira.',['Ligar para o número da coleira|k+5 h+3|O dono chorou de alegria.','Ignorar|k-1|Alguém deve resolver.']],
 ['Assalto no bairro','Assaltaram a padaria da esquina.',['Ajudar o padeiro|k+4|Fiz uma vaquinha para ele recuperar o prejuízo.','Instalar grades em casa|$-1500 h+2|Agora me sinto mais segur{o}.']],
 ['Horta comunitária','Os moradores vão montar uma horta comunitária na praça.',['Participar|hl+2 k+3 h+3|Tomates frescos para todos!','Não participar|h+0|Prefiro comprar na feira.','Pegar os tomates dos outros|h+2 k-4|Ninguém sabe quem foi.']],
]);
pack({k:'Faculdade',when:studying('uni','tec')},[
 ['Professor carismático','Um professor me inspirou muito este semestre.',['Pedir para ser orientad{o} por ele|sm+3 grade+3|Ele aceitou!','Não pedir|h+0|Fico com um orientador qualquer.','Puxar o saco descaradamente|?50 grade+4|Funcionou.|grade-2|Ele percebeu e ficou desconfortável.']],
 ['Prova surpresa','Prova surpresa de uma matéria difícil.',['Fazer com o que sei|?grade grade+3|Fui bem!|grade-5|Fui mal.','Colar do colega|?55 grade+4 k-2|Ninguém viu.|grade-8 behav-2|A professora rasgou minha prova.','Entregar em branco|grade-6 h+2|Pelo menos saí mais cedo.']],
 ['Trancar o curso','Estou pensando em trancar a matrícula por um semestre.',['Continuar|h-2 grade+2|Melhor não parar.','Trancar|h+4|Vou respirar um pouco.']],
 ['Bandejão','O restaurante universitário serviu {comida} pela quinta vez na semana.',['Comer assim mesmo|$+20|Economizei.','Comer fora|$-40 h+2|Mereço.']],
]);
pack({k:'Trabalho',when:m=>m.job&&!m.job.spc},[
 ['Avaliação de desempenho','Hoje é o dia da avaliação anual de desempenho.',['Mostrar meus resultados|?perf raise+6 h+5|Ganhei aumento!|perf-3|O chefe apontou várias falhas.','Exagerar meus feitos|?40 raise+8|Colou! Aumento gordo.|perf-6|Meu chefe conferiu os números.','Culpar um colega pelos erros|?50 perf+3 k-5|O chefe acreditou.|perf-8 k-5|O colega tinha provas. Fiquei mal na fita.']],
 ['Colega novo','Entrou {n} na equipe e está perdid{on}.',['Ajudar a se enturmar|k+3 perf+2 meet|{n} virou minha companhia de almoço. Viramos amigos.','Deixar se virar|k-1|Cada um por si.']],
 ['Vale-refeição','A empresa cortou o vale-refeição.',['Reclamar em grupo|?40 h+3|A empresa voltou atrás.|perf-2|Nada mudou.','Levar marmita|$+400 h-1|Pelo menos economizo.']],
 ['Curso pago pela empresa','A empresa vai pagar um curso de especialização.',['Fazer|sm+3 perf+5|O curso valeu muito.','Recusar|perf-1|Não tenho tempo.']],
 ['Viagem a trabalho','Fui escalad{o} para uma viagem a trabalho em {lugar}.',['Ir|perf+5 h+4 c:trips|Trabalhei e ainda conheci a cidade.','Pedir para outra pessoa ir|perf-3|Fiquei no escritório.']],
 ['Assédio do chefe','Meu chefe tem feito comentários inapropriados.',['Denunciar ao RH|?60 k+4 h+4|O chefe foi afastado.|h-5 perf-5|Abafaram o caso.','Procurar outro emprego|h-2|Comecei a mandar currículos.']],
]);
pack({k:'Aposentadoria',when:m=>m.ret&&!m.job},[
 ['Tédio','A aposentadoria está mais parada do que eu imaginava.',['Fazer trabalho voluntário|k+5 h+6|Me sinto útil de novo.','Aprender algo novo|sm+2 h+4|Comecei aulas de {hobby}.']],
 ['Pensão atrasada','O pagamento da aposentadoria atrasou.',['Ligar para o órgão|h-3|Depois de três horas, resolveram.','Ir lá pessoalmente e fazer escândalo|?50 h+3|Resolveram na hora para eu ir embora.|h-6|Fui escoltad{o} para fora pelo segurança.','Esperar resolver sozinho|h-5|Ainda estou esperando.']],
 ['Clube de pesca','Os aposentados do bairro me convidaram para pescar.',['Ir|h+6|Pesquei um peixe deste tamanho!','Não ir|h+0|Preferi ficar no sofá.','Comprar um peixe na feira e dizer que pesquei|h+6 k-1|O clube inteiro acreditou.']],
]);
pack({k:'Saúde',min:20},[
 ['Dor nas costas','Acordei sem conseguir me mexer de tanta dor nas costas.',['Ir ao médico|$-400 hl+2|Repouso e remédio.','Esperar passar|hl-2|Três dias andando torto.']],
 ['Dieta da moda','Todo mundo está fazendo a dieta do {dieta}.',['Tentar|?50 lk+2 hl+1|Perdi uns quilos!|hl-3|Passei mal no segundo dia.','Ignorar|h+0|Comida é para ser feliz.']],
 ['Insônia','Não consigo dormir há uma semana.',['Desligar o celular cedo|hl+2 h+2|Voltei a dormir bem.','Tomar remédio para dormir|hl-1|Acordei grogue.']],
 ['Dentista','Um dente está doendo muito.',['Ir ao dentista|$-v hl+2|Canal feito. Ufa.','Aguentar|hl-3 h-3|A dor piorou.'],{v:[300,2000]}],
]);
