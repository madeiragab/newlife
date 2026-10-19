// ===== Carreiras com profundidade: minigame de cada área, reputação no setor, advertências, demissão e oportunidades =====
// Cada opção: [texto, atributo testado, nota (2 ótima · 1 boa · 0 neutra · −1 ruim), 'r' = arriscada]
const CAR_FAM={
  braco:{n:'Turno pesado',ic:'🦺',sits:[
    ['O material chegou duas horas atrasado e o prazo acaba hoje.',[['Organizar a equipe em mutirão','sm',2],['Fazer o dobro sozinh{o}','hl',1],['Avisar que não vai dar','',-1]]],
    ['Um colega quer pular uma etapa de segurança para ganhar tempo.',[['Parar tudo e fazer do jeito certo','k',2],['Deixar, mas ficar de olho','',0,'r'],['Ajudar a pular a etapa','',-1,'r']]],
    ['A máquina principal começou a fazer um barulho estranho.',[['Desligar e investigar','sm',2],['Chamar a manutenção','',1],['Continuar e torcer','',-1,'r']]],
    ['Calor de 38 graus e ainda falta metade do serviço.',[['Pausas curtas e muita água','hl',2],['Ir direto, sem parar','hl',1,'r'],['Esticar o almoço na sombra','',-1]]],
    ['O chefe pede um serviço fora da sua função, e urgente.',[['Fazer e pedir que conste na avaliação','sm',2],['Fazer calad{o}','',1],['Recusar','',-1]]]]},
  balcao:{n:'Dia de movimento',ic:'🧾',sits:[
    ['Um cliente furioso exige o gerente por um erro que não foi seu.',[['Ouvir com calma e resolver','lk',2],['Chamar o gerente','',1],['Discutir de volta','',-1]]],
    ['A fila dobrou e um colega faltou.',[['Reorganizar o atendimento','sm',2],['Acelerar no improviso','hl',1],['Reclamar em voz alta','',-1]]],
    ['O troco de um cliente idoso veio a mais.',[['Devolver na hora','k',2],['Avisar o gerente','',1],['Ficar quiet{o}','',-1]]],
    ['O gerente pede para você ficar meia hora além do horário.',[['Ficar e ajudar a fechar','',2],['Ficar, mas anotar a hora extra','sm',1],['Ir embora no horário','',0]]],
    ['Um cliente famoso aparece e todo mundo para para tirar foto.',[['Atender normalmente e com simpatia','lk',2],['Pedir uma selfie rápida','',0],['Largar o posto para ver','',-1]]]]},
  rota:{n:'Dia na rua',ic:'🛵',sits:[
    ['O GPS manda por uma rua alagada.',[['Pegar um desvio que você conhece','sm',2],['Esperar a água baixar','',0],['Arriscar atravessar','',-1,'r']]],
    ['O cliente não está e a entrega é urgente.',[['Ligar e combinar outro lugar','lk',2],['Deixar com um vizinho de confiança','',1],['Largar na portaria sem avisar','',-1]]],
    ['O pneu furou no meio do caminho.',[['Trocar você mesm{o}, rapidinho','fit',2],['Chamar o socorro','',1],['Encerrar o dia','',-1]]],
    ['Um serviço longo e bem pago, mas para um bairro perigoso de madrugada.',[['Aceitar com cuidado','sm',2,'r'],['Aceitar só até a avenida principal','',1],['Recusar','',0]]],
    ['Um motorista fecha você e ainda xinga.',[['Respirar e seguir','k',2],['Buzinar e esquecer','',1],['Tirar satisfação','',-1,'r']]]]},
  escritorio:{n:'Semana de fechamento',ic:'📊',sits:[
    ['Uma planilha com erro seu foi parar na mão do diretor.',[['Assumir e corrigir na hora','k',2],['Culpar o sistema','lk',0],['Fingir que não viu','',-1]]],
    ['O chefe pede que você apresente a reunião no lugar dele.',[['Apresentar com confiança','lk',2],['Ler os slides','sm',1],['Inventar uma desculpa','',-1]]],
    ['Um cliente grande ameaça cancelar o contrato.',[['Ligar e negociar pessoalmente','sm',2],['Mandar um e-mail padrão','',0],['Passar o problema para um colega','',-1]]],
    ['Prazo amanhã e o sistema caiu.',[['Fazer à mão e revisar duas vezes','sm',2],['Avisar o atraso com antecedência','',1],['Esperar o sistema voltar','',-1]]],
    ['Um colega leva o crédito por uma ideia sua na reunião.',[['Complementar a ideia com dados que só você tem','sm',2],['Conversar com ele depois','k',1],['Explodir na frente de todos','',-1]]]]},
  emerg:{n:'Ocorrência',ic:'🚨',sits:[
    ['Fumaça num prédio com gente presa no terceiro andar.',[['Entrar com a equipe, pelo protocolo','fit',2],['Entrar sozinh{o} na frente','fit',1,'r'],['Esperar reforço','',0]]],
    ['Uma pessoa armada e nervosa no meio da rua.',[['Negociar de longe, com calma','lk',2],['Avançar para desarmar','fit',1,'r'],['Gritar ordens','',-1,'r']]],
    ['Seu parceiro pede para você não registrar uma falha dele.',[['Registrar com honestidade','k',2],['Conversar antes e registrar depois','',1],['Esconder a falha','',-1]]],
    ['Uma criança perdida chora no meio da multidão.',[['Acolher e acionar a central','lk',2],['Sair procurando os pais','fit',1],['Mandar esperar ali','',-1]]],
    ['Treinamento físico obrigatório às cinco da manhã.',[['Ir e dar o máximo','fit',2],['Ir e fazer o básico','',0],['Faltar com desculpa','',-1]]]]},
  saude:{n:'Plantão',ic:'🩺',sits:[
    ['Paciente com dor no peito e suor frio diz que é só ansiedade.',[['Pedir eletrocardiograma na hora','sm',2],['Encaminhar para outro colega','',0],['Dar um calmante e observar','',-1,'r']]],
    ['Dois pacientes graves e só um leito.',[['Triagem pelo protocolo','sm',2],['Atender quem chegou primeiro','',0],['Atender o que tem convênio','k',-1]]],
    ['Um colega trocou a dose de um remédio.',[['Corrigir e avisar com discrição','k',2],['Avisar a chefia','',1],['Fingir que não viu','',-1]]],
    ['Plantão de 24 horas e você está caindo de sono.',[['Pedir 20 minutos de descanso','hl',2],['Café e seguir','hl',1],['Cochilar escondid{o}','',-1]]],
    ['A família de um paciente exige um exame que não é necessário.',[['Explicar com paciência por que não','lk',2],['Pedir o exame para evitar briga','',0],['Mandar procurar outro profissional','',-1]]]]},
  lei:{n:'Dia de audiência',ic:'⚖️',sits:[
    ['A testemunha principal muda a versão no meio da audiência.',[['Confrontar com o depoimento anterior','sm',2],['Pedir um recesso','',1],['Seguir o roteiro','',-1]]],
    ['O outro lado oferece um acordo bem abaixo do justo.',[['Contraproposta firme','sm',2],['Levar para o cliente decidir','',1],['Aceitar para acabar logo','',-1]]],
    ['Um documento decisivo chegou fora do prazo.',[['Justificar e pedir a juntada','sm',2],['Tentar mesmo assim','',0],['Esconder o atraso','k',-1,'r']]],
    ['Um jornalista pergunta sobre o caso na saída do fórum.',[['Falar só o necessário','lk',2],['Dar entrevista completa','lk',0,'r'],['Ignorar com grosseria','',-1]]],
    ['Alguém oferece um "presente" para acelerar o processo.',[['Recusar e registrar','k',2],['Recusar em silêncio','',1],['Aceitar','',-1,'r']]]]},
  tec:{n:'Projeto crítico',ic:'💻',sits:[
    ['Um erro grave aparece na véspera da entrega.',[['Rastrear a causa a fundo','sm',2],['Fazer um remendo rápido','',1],['Entregar assim e torcer','',-1,'r']]],
    ['O cliente mudou tudo no meio do projeto.',[['Replanejar e negociar o prazo','sm',2],['Aceitar e virar noites','hl',1],['Recusar a mudança','',-1]]],
    ['Um estagiário pede ajuda, mas você está atolad{o}.',[['Ensinar em dez minutos','lk',2],['Mandar um tutorial','',1],['Ignorar','',-1]]],
    ['Uma ferramenta nova promete fazer metade do trabalho.',[['Testar num projeto pequeno','sm',2],['Adotar em tudo de uma vez','',0,'r'],['Desprezar a novidade','',-1]]],
    ['Você descobre uma falha de segurança grave no sistema da empresa.',[['Reportar com um plano de correção','sm',2],['Reportar e pronto','',1],['Ficar quiet{o}','',-1,'r']]]]},
  midia:{n:'Fechamento ao vivo',ic:'🎙️',sits:[
    ['Uma fonte anônima traz uma denúncia bombástica sem provas.',[['Checar com mais duas fontes','sm',2],['Publicar como suspeita','',0,'r'],['Publicar logo para sair na frente','',-1,'r']]],
    ['O teleprompter travou no meio do ao vivo.',[['Improvisar com naturalidade','lk',2],['Chamar o intervalo','',1],['Ficar em silêncio','',-1]]],
    ['Um patrocinador pede para suavizar uma matéria sobre ele.',[['Recusar com educação','k',2],['Levar ao editor','',1],['Suavizar','',-1]]],
    ['O entrevistado só responde com monossílabos.',[['Puxar um assunto pessoal','lk',2],['Seguir as perguntas','',0],['Encerrar mais cedo','',-1]]],
    ['A matéria de capa caiu uma hora antes do fechamento.',[['Puxar uma pauta guardada e apurar rápido','sm',2],['Esticar outra matéria','',0],['Entrar em pânico','',-1]]]]},
  ensino:{n:'Dia de aula',ic:'🍎',sits:[
    ['A turma não para quieta.',[['Propor uma atividade diferente','sm',2],['Aumentar o tom','',0],['Desistir e liberar','',-1]]],
    ['Uma criança conta, em segredo, que está sofrendo em casa.',[['Acolher e acionar quem pode ajudar','k',2],['Ouvir e guardar','',0],['Mudar de assunto','',-1]]],
    ['Pais reclamam de uma decisão sua.',[['Mostrar os critérios com calma','sm',2],['Ceder para evitar briga','',0],['Discutir','',-1]]],
    ['A coordenação pede um projeto extra para a semana que vem.',[['Abraçar e fazer bem','hl',2],['Fazer o mínimo','',0],['Recusar','',-1]]],
    ['Uma criança se machuca no recreio sob a sua supervisão.',[['Primeiros socorros e avisar a família','sm',2],['Levar para a secretaria','',1],['Esconder o ocorrido','',-1,'r']]]]},
  cozinha:{n:'Serviço da noite',ic:'👨‍🍳',sits:[
    ['Faltou o ingrediente do prato mais pedido.',[['Inventar uma variação na hora','sm',2],['Tirar o prato do cardápio','',1],['Usar um ingrediente vencido','',-1,'r']]],
    ['Um crítico gastronômico sentou na mesa 4.',[['Fazer o prato perfeito, como para qualquer um','sm',2],['Mandar uma entrada de cortesia','lk',1],['Entrar em pânico','',-1]]],
    ['Um cozinheiro queimou a mão no meio do serviço.',[['Socorrer e redistribuir as tarefas','sm',2],['Assumir a estação dele','hl',1],['Mandar continuar','',-1]]],
    ['Cem pedidos em uma hora.',[['Organizar a linha como um maestro','sm',2],['Correr dobrado','hl',1],['Gritar com todo mundo','',-1]]],
    ['Um cliente manda o prato de volta dizendo que está cru.',[['Ir à mesa e refazer na frente dele','lk',2],['Refazer sem discutir','',1],['Mandar de volta igualzinho','',-1]]]]},
  corpo:{n:'Dia de treinos',ic:'🏋️',sits:[
    ['Um aluno quer resultado de verão em um mês.',[['Montar um plano realista','sm',2],['Treino pesadíssimo','fit',1,'r'],['Sugerir anabolizante','k',-1,'r']]],
    ['O aluno mais antigo perdeu a motivação.',[['Mudar o treino e celebrar pequenas metas','lk',2],['Dar uma bronca','',0],['Deixar quieto','',-1]]],
    ['Um aluno faz um exercício com a postura errada.',[['Corrigir na hora, com cuidado','fit',2],['Mostrar depois','',0],['Deixar, ele que se vire','',-1,'r']]],
    ['Uma marca quer que você indique um produto que você não usa.',[['Testar antes de indicar','k',2],['Recusar','',1],['Indicar pelo dinheiro','',-1]]]]},
  diplo:{n:'Rodada de negociação',ic:'🌐',sits:[
    ['A outra delegação ameaça abandonar a mesa.',[['Propor um intervalo e conversar a sós','lk',2],['Ceder num ponto pequeno','sm',1],['Deixar que saiam','',-1]]],
    ['Um jornalista estrangeiro faz uma pergunta capciosa.',[['Responder sem responder, com elegância','sm',2],['Dizer "sem comentários"','',1],['Responder com irritação','',-1]]],
    ['Você recebe uma informação sigilosa por engano.',[['Devolver e reportar','k',2],['Ignorar','',0],['Usar a informação','',-1,'r']]],
    ['Jantar oficial com um prato que você detesta.',[['Comer e elogiar o anfitrião','lk',2],['Comer pouco, discretamente','',1],['Recusar o prato','',-1]]]]},
  voo:{n:'Dia de voo',ic:'✈️',sits:[
    ['Turbulência forte e passageiros em pânico.',[['Manter a calma e seguir o procedimento','sm',2],['Fazer anúncios tranquilizadores','lk',1],['Demonstrar nervosismo','',-1]]],
    ['Um passageiro agressivo se recusa a sentar.',[['Conversar com firmeza e calma','lk',2],['Chamar o comandante','',1],['Bater boca','',-1]]],
    ['Atraso de quatro horas e a tripulação está exausta.',[['Revezar pausas e seguir as regras','sm',2],['Ir no sacrifício','hl',1,'r'],['Reclamar com os passageiros','',-1]]],
    ['Um alerta leve no painel antes da decolagem.',[['Checar com a manutenção, mesmo atrasando','sm',2],['Checar rápido e decolar','',0,'r'],['Ignorar','',-1,'r']]]]},
  moda:{n:'Semana de moda',ic:'👗',sits:[
    ['A roupa principal do desfile rasgou meia hora antes.',[['Costurar e improvisar um ajuste','tal',2],['Trocar por outra peça','',1],['Entrar em pânico','',-1]]],
    ['Uma revista quer um ensaio ousado demais para você.',[['Negociar o limite','lk',2],['Aceitar','',0,'r'],['Recusar e sair','',-1]]],
    ['Uma colega espalha boatos sobre você nos bastidores.',[['Ignorar e brilhar','lk',2],['Conversar com ela','k',1],['Revidar com outro boato','',-1]]],
    ['Dieta absurda exigida pela agência.',[['Seguir com acompanhamento médico','hl',2],['Fingir que segue','',0],['Seguir à risca, sem comer','',-1,'r']]]]},
  palco:{n:'Noite de estreia',ic:'🎭',sits:[
    ['Você esqueceu o texto no meio da cena.',[['Improvisar sem sair do personagem','tal',2],['Olhar para o ponto','',1],['Travar','',-1]]],
    ['A plateia está fria e ninguém reage.',[['Mudar o ritmo e quebrar a quarta parede','tal',2],['Seguir o roteiro','',0],['Reclamar da plateia','',-1]]],
    ['Um diretor famoso está na plateia.',[['Fazer como em qualquer noite','tal',2],['Caprichar além do ensaiado','',1,'r'],['Ficar nervos{o} e travar','',-1]]],
    ['O colega de cena chegou bêbado.',[['Segurar a cena e cobrir as falhas dele','tal',2],['Avisar a produção','',1],['Deixar ele afundar','',-1]]]]},
  musica:{n:'Show ao vivo',ic:'🎤',sits:[
    ['O som do palco falhou no meio da música.',[['Puxar a plateia para cantar junto','tal',2],['Parar e esperar o técnico','',0],['Sair do palco irritad{o}','',-1]]],
    ['A plateia pede uma música antiga que você odeia.',[['Tocar com uma versão nova','tal',2],['Tocar do jeito original','',1],['Recusar','',-1]]],
    ['Um fã sobe no palco.',[['Abraçar e conduzir de volta','lk',2],['Chamar a segurança','',1],['Empurrar o fã','',-1]]],
    ['O repertório está atrasado e o contratante pede para cortar.',[['Montar um final enxuto e forte','sm',2],['Cortar as últimas','',0],['Tocar tudo e estourar o horário','',-1]]]]},
  letras:{n:'Lançamento',ic:'📚',sits:[
    ['O editor quer cortar o seu capítulo favorito.',[['Reescrever e convencer','tal',2],['Aceitar o corte','',1],['Ameaçar trocar de editora','',-1]]],
    ['Bloqueio criativo a um mês do prazo.',[['Escrever todo dia, mesmo ruim','tal',2],['Pedir mais prazo','',0],['Copiar um trecho de outro livro','k',-1,'r']]],
    ['Uma crítica devastadora sai num jornal grande.',[['Responder com elegância','sm',2],['Ignorar','',1],['Atacar o crítico nas redes','',-1]]],
    ['Noite de autógrafos com fila enorme.',[['Conversar um pouco com cada leitor','lk',2],['Assinar rápido','',1],['Ir embora mais cedo','',-1]]]]},
  artes:{n:'Abertura da exposição',ic:'🖼️',sits:[
    ['A obra principal chegou danificada.',[['Transformar o dano em parte da obra','tal',2],['Restaurar às pressas','',1],['Cancelar a exposição','',-1]]],
    ['Um colecionador quer comprar barato.',[['Negociar o valor justo','sm',2],['Vender pelo preço dele','',0],['Ofender o colecionador','',-1]]],
    ['Um crítico pergunta o significado da obra.',[['Explicar com paixão','lk',2],['Dizer que cada um vê uma coisa','',1],['Desconversar mal-humorad{o}','',-1]]],
    ['Uma marca quer usar sua obra numa propaganda.',[['Negociar crédito e cachê','sm',2],['Aceitar qualquer valor','',0],['Recusar sem ouvir','',-1]]]]},
  stream:{n:'Live de domingo',ic:'📺',sits:[
    ['O chat está lotado de trolls.',[['Responder com humor e banir os piores','tal',2],['Ativar o modo só para inscritos','',1],['Brigar com o chat','',-1]]],
    ['A internet caiu no auge da live.',[['Voltar pelo celular e fazer piada','tal',2],['Avisar nas redes','',1],['Sumir sem explicação','',-1]]],
    ['Uma casa de apostas oferece patrocínio.',[['Recusar: o público é jovem','k',2],['Aceitar com aviso','',0],['Aceitar e empurrar para o público','',-1,'r']]],
    ['Um streamer maior chama você para um desafio ao vivo.',[['Aceitar e dar o melhor','tal',2],['Aceitar sem preparo','',1,'r'],['Recusar','',-1]]]]},
  comercio:{n:'Dia de feira',ic:'🛒',sits:[
    ['O rapa está chegando no fim da rua.',[['Guardar tudo rápido e voltar depois','fit',2],['Negociar com o fiscal','lk',1,'r'],['Ficar parad{o}','',-1]]],
    ['Um fornecedor oferece mercadoria barata demais.',[['Desconfiar e verificar a origem','sm',2],['Comprar pouco para testar','',1],['Comprar tudo','',-1,'r']]],
    ['A banca vizinha baixou o preço pela metade.',[['Oferecer um brinde e atender melhor','lk',2],['Baixar também','',0],['Brigar com o vizinho','',-1]]],
    ['Choveu e a feira esvaziou.',[['Vender pela internet','sm',2],['Esperar a chuva passar','',0],['Ir embora','',-1]]]]},
  quartel:{n:'Missão',ic:'🎖️',sits:[
    ['Exercício noturno na mata com a tropa perdida.',[['Usar a bússola e liderar','sm',2],['Esperar o resgate','',0],['Dividir a tropa','',-1,'r']]],
    ['Um superior dá uma ordem claramente errada.',[['Questionar com respeito, pelo canal certo','k',2],['Cumprir','',1],['Desobedecer na frente de todos','',-1]]],
    ['Teste físico de promoção.',[['Treinar o mês inteiro antes','fit',2],['Ir com o que tem','fit',1],['Fingir lesão','',-1]]],
    ['Um recruta está sofrendo trote pesado.',[['Interromper e reportar','k',2],['Conversar com o recruta depois','',1],['Rir junto','',-1]]]]},
  criativo:{n:'Entrega para o cliente',ic:'🎨',sits:[
    ['O cliente pede "algo moderno, mas clássico, chamativo, mas discreto".',[['Fazer perguntas até entender de verdade','sm',2],['Mandar três opções diferentes','tal',1],['Fazer do seu jeito e torcer','',-1]]],
    ['O cliente mudou tudo na véspera da entrega.',[['Negociar o que dá para mudar e o novo prazo','sm',2],['Virar a noite','hl',1],['Entregar a versão antiga','',-1]]],
    ['Você encontra um trabalho seu copiado por outra agência.',[['Reunir provas e levar ao jurídico','sm',2],['Postar a comparação nas redes','',0,'r'],['Deixar para lá','',-1]]],
    ['A ideia que você ama foi reprovada pela chefia.',[['Defender com argumentos e dados','sm',2],['Guardar para outro projeto','tal',1],['Fazer cara feia a semana toda','',-1]]],
    ['Um prêmio do setor abre inscrições.',[['Inscrever o melhor trabalho do ano','tal',2],['Inscrever qualquer coisa','',0],['Achar que não vale a pena','',-1]]]]},
  crime:{n:'Serviço da quadrilha',ic:'🏴',sits:[
    ['A viatura passou duas vezes pela mesma rua.',[['Abortar e voltar outro dia','sm',2],['Seguir com cuidado','',1,'r'],['Seguir como se nada fosse','',-1,'r']]],
    ['Um parceiro novo fala demais no telefone.',[['Trocar de aparelho e cortar o contato','sm',2],['Dar um aviso','',1],['Ignorar','',-1,'r']]],
    ['O dinheiro do serviço veio faltando.',[['Cobrar com calma do responsável','lk',2],['Engolir o prejuízo','',0],['Partir para a violência','',-1,'r']]],
    ['O chefe pede um serviço que pode virar tiroteio.',[['Planejar a rota de fuga antes','sm',2],['Ir no improviso','',0,'r'],['Recusar','',-1]]]]}};
const CAR_JOB_FAM={obra:'braco',fabr:'braco',agri:'braco',pesc:'braco',elet:'braco',mecan:'braco',limp:'balcao',port:'balcao',seg:'emerg',repo:'balcao',emp:'balcao',caixa:'balcao',lanch:'balcao',garc:'balcao',sorv:'balcao',coz:'cozinha',fren:'balcao',lava:'balcao',recep:'balcao',cabe:'balcao',este:'balcao',
  entr:'rota',app:'rota',cami:'rota',cart:'rota',pass:'rota',tele:'escritorio',aux:'escritorio',vend:'escritorio',cont:'escritorio',mkt:'escritorio',exec:'escritorio',fina:'escritorio',
  bomb:'emerg',poli:'emerg',salv:'emerg',tenf:'saude',enfe:'saude',medi:'saude',ciru:'saude',dent:'saude',farm:'saude',vete:'saude',psic:'saude',adv:'lei',juiz:'lei',promo:'lei',
  engr:'tec',arqu:'tec',prog:'tec',tti:'tec',biol:'tec',cien:'tec',astr:'tec',jorn:'midia',apres:'midia',prof:'ensino',univ:'ensino',mon:'ensino',baba:'ensino',apr:'escritorio',chef:'cozinha',pers:'corpo',dipl:'diplo',pilo:'voo',aero:'voo',esti:'moda',
  ator:'palco',comedia:'palco',musico:'musica',dj:'musica',modelo:'moda',escritor:'letras',artista:'artes',streamer:'stream',camelo:'comercio',militar:'quartel',crime:'crime',
  desg:'criativo',ilus:'criativo',tdes:'criativo',publ:'criativo',rote:'criativo',cura:'artes',impr:'midia',pmus:'ensino',pedg:'ensino',psub:'ensino',prodm:'musica',orq:'musica',
  hist:'tec',quim:'tec',fisp:'tec',bioq:'tec',astf:'tec',neuro:'tec',peco:'tec',arqc:'tec',tlab:'tec',zoot:'tec',ambi:'tec',ia:'tec',dado:'tec',game:'tec',sec:'tec',petr:'tec',aeng:'tec',urb:'tec',econ:'tec',gproj:'tec',tagr:'tec',
  peri:'lei',perju:'lei',tribu:'lei',trei:'corpo',nutri:'corpo',psio:'escritorio',cext:'escritorio',audi:'escritorio',assad:'escritorio',acont:'escritorio',tlog:'escritorio',cfo:'escritorio',afisc:'escritorio',
  ctrl:'voo',somm:'cozinha',chefc:'cozinha',prmd:'moda',fari:'saude',orto:'saude',impl:'saude',enfu:'saude',enfob:'saude',npsi:'saude',pedia:'saude',derma:'saude',psiq:'saude',trad:'saude',ghosp:'saude',
  tseg:'braco',mobra:'braco',engst:'braco',taer:'braco'};
const carFam=j=>j&&CAR_FAM[CAR_JOB_FAM[j.spc||j.id]]||null;
const carGen=t=>String(t).replace(/\{o\}/g,oa());
function carAttr(k){ const m=S.me, j=m.job; if(k==='sm') return m.smarts; if(k==='lk') return m.looks; if(k==='hl') return m.health; if(k==='k') return m.karma; if(k==='fit') return m.talent.athletic||30;
  if(k==='tal'){ const sp=j&&j.spc?SPECIAL[j.spc]:null; return sp&&sp.talent?talOf(sp.talent):Math.round((m.smarts+(m.talent.art||30))/2); } return 60; }
function carEnsure(j){ if(!j) return j; j.adv=j.adv||0; if(j.rep==null) j.rep=30; return j; }
// minigame: três situações do dia a dia da área
function carMinigame(){ const m=S.me, j=carEnsure(m.job), F=carFam(j); if(!F) return 'Essa profissão não tem um dia especial.'; if(m.prison) return '';
  if(use('car_mg')>2) return 'Já encarei dias assim demais este ano.'; const ord=R.shuffle(F.sits.map((x,i)=>i)).slice(0,3); queue('car_dia',{o:ord,r:0,pts:0}); return ''; }
EVENTS.car_dia={when:m=>!!carFam(m.job)&&!m.prison,
  prep:m=>({o:R.shuffle(carFam(m.job).sits.map((x,i)=>i)).slice(0,3),r:0,pts:0}),
  show:d=>{ const F=carFam(S.me.job), s=F.sits[d.o[d.r]]; return {k:F.n,t:`${F.ic} ${F.n} · ${d.r+1} de 3`,x:carGen(s[0]),ch:s[1].map((c,i)=>[carGen(c[0]),String(i)])}; },
  pick:(k,d)=>{ const m=S.me, j=carEnsure(m.job), F=carFam(j); if(!F) return ''; const c=F.sits[d.o[d.r]][1][+k]; let n=c[2], t='';
    if(c[1]&&n>0&&!R.chance(.35+carAttr(c[1])/160)){ n--; t=R.pick(['Era a escolha certa, mas não saiu tão bem quanto eu queria.','Fiz o certo, só que meio atrapalhad'+oa()+'.']); }
    if(c[3]==='r'&&R.chance(.3)){ n=-1; t='Deu errado. '+R.pick(['Me machuquei no processo.','Saiu bem caro.','Alguém se prejudicou por minha causa.']); if(R.chance(.5)) st('health',-R.int(3,10)); else m.money-=Math.min(Math.max(0,m.money),R.int(200,2000)); }
    if(!t) t=n>=2?R.pick(['Mandei muito bem.','Exatamente o que precisava ser feito.','Ganhei o respeito de todo mundo ali.']):n===1?R.pick(['Resolvi, sem brilho.','Deu certo.']):n===0?'Nem bem, nem mal.':R.pick(['Pegou mal.','O chefe viu.','Isso vai ter consequência.']);
    const pts=d.pts+n; if(d.r<2){ queue('car_dia',{o:d.o,r:d.r+1,pts}); return t; }
    return t+' '+carFimDia(pts); }};
function carFimDia(pts){ const m=S.me, j=carEnsure(m.job); if(!j) return ''; let t=`Fim do dia: ${pts} de 6 pontos.`;
  j.perf=clamp(j.perf+pts*3-2); j.rep=clamp(j.rep+pts*2-2); cnt('carDias');
  if(j.spc) m.fame=clamp(m.fame+(pts>=5?2:0));
  if(pts>=6){ const b=Math.round(jobSalary(j)*.03); m.money+=b; t+=` Dia perfeito: ${fmt(b)} de bônus.`; if(!j.spc&&R.chance(.6)) queue('car_destaque',{}); }
  else if(pts<=0){ j.adv++; t+=` Levei uma advertência (${j.adv} de 3).`; log(`Advertência no trabalho (${j.adv} de 3).`,'warn'); if(j.adv>=3) queue('car_rh',{}); }
  return t; }
// demissão: três advertências levam à conversa com o RH
EVENTS.car_rh={when:m=>!!m.job&&!m.prison,
  show:()=>{ const j=S.me.job; return {k:'Trabalho',t:'Reunião com o RH',x:`O RH de ${j.co} me chamou. Três advertências, desempenho de ${j.perf}%. A decisão é me desligar, a menos que eu dê um bom motivo.`,ch:[['Pedir uma última chance','chance'],['Negociar um acordo de saída','acordo'],['Ameaçar processar','processo'],['Pedir demissão antes','sai']]}; },
  pick:k=>{ const m=S.me, j=carEnsure(m.job); if(!j) return ''; const dem=m.gender==='F'?'demitida':'demitido';
    if(k==='chance'){ if(R.chance(.25+j.perf/250+(m.karma-50)/300+j.rep/400)){ j.adv=1; j.perf=clamp(j.perf+5); return 'Prometi mudar. Me deram mais uma chance, a última.'; } log(`Fui ${dem} de ${j.co}.`,'bad'); st('happy',-12); endJob(); return `Não adiantou. Fui ${dem}.`; }
    if(k==='acordo'){ const v=Math.round(jobSalary(j)*R.int(15,40)/100); m.money+=v; log(`Saí de ${j.co} num acordo.`,'warn'); endJob(); return `Saí com ${fmt(v)} de acordo e a carteira assinada.`; }
    if(k==='processo'){ if(R.chance(.3)){ j.adv=1; return 'O RH recuou. Fiquei, mas agora todo mundo me olha torto.'; } log(`Fui ${dem} de ${j.co} por justa causa.`,'bad'); endJob(); st('happy',-14); return 'Fui desligad'+oa()+' por justa causa. O processo vai levar anos.'; }
    log(`Pedi demissão de ${j.co} antes de ser ${dem}.`); endJob(); return 'Saí antes de me mandarem embora. Pelo menos foi decisão minha.'; }};
// oportunidade: o trabalho chamou atenção
EVENTS.car_destaque={when:m=>!!m.job&&!m.job.spc&&!m.prison,
  show:()=>({k:'Trabalho',t:'A diretoria notou',x:`O meu trabalho em ${S.me.job.co} chegou aos ouvidos da diretoria. Querem saber o que eu espero da empresa.`,ch:[['Pedir uma promoção agora','promo'],['Pedir aumento','aumento'],['Pedir para liderar um projeto','projeto']]}),
  pick:k=>{ const m=S.me, j=carEnsure(m.job); if(!j) return ''; const d=JOBS.find(x=>x.id===j.id);
    if(k==='promo'){ if(d&&j.lvl<d.l.length-1&&R.chance(.55+j.perf/400)) return promote(j,'pedido'); j.perf=clamp(j.perf+3); return 'Disseram que ainda não há vaga acima, mas que estou no radar.'; }
    if(k==='aumento'){ const p=R.int(6,14); j.mul=(j.mul||1)*(1+p/100); return `Ganhei ${p}% de aumento.`; }
    j.rep=clamp(j.rep+12); j.perf=clamp(j.perf+6); j.good=(j.good||0)+1; return 'Agora lidero um projeto importante. Se der certo, a promoção vem.'; }};
// propostas de outras empresas para quem tem reputação no setor
EVENTS.car_proposta={when:m=>!!m.job&&!m.job.spc&&!m.prison,
  prep:()=>carPropostaDados(),
  show:d=>({k:'Trabalho',t:'Uma proposta',x:`Uma recrutadora de ${d.co}, uma empresa ${d.size}, quer me contratar no mesmo cargo pagando ${d.p}% a mais.`,ch:[['Aceitar e trocar de empresa','aceita'],['Usar a proposta para pedir aumento','barganha'],['Recusar','recusa']]}),
  pick:(k,d)=>{ const m=S.me, j=carEnsure(m.job); if(!j) return '';
    if(k==='aceita'){ const old=j.co; j.co=d.co; j.size=d.size; j.mul=(j.mul||1)*(1+d.p/100); j.lvlYrs=0; j.adv=0; j.perf=Math.max(50,j.perf-5); log(`Troquei ${old} por ${d.co}, ganhando ${d.p}% a mais.`,'good'); st('happy',8); return `Pedi as contas em ${old}. Começo em ${d.co} na segunda.`; }
    if(k==='barganha'){ if(R.chance(.55+j.perf/400)){ const p=Math.round(d.p*.6); j.mul=(j.mul||1)*(1+p/100); return `Meu chefe cobriu parte da proposta: ${p}% de aumento.`; } j.perf=clamp(j.perf-6); return 'Meu chefe disse "então vai". Fiquei, mas o clima azedou.'; }
    j.rep=clamp(j.rep+3); return 'Recusei. Ficou o contato.'; }};
function carPropostaDados(){ return {co:R.pick(['Grupo','Companhia','Rede','Holding'])+' '+R.pick(['Atlas','Horizonte','Meridiano','Vértice','Aurora','Pioneira','Sul-Americana']),size:R.pick(['grande','multinacional']),p:R.int(15,40)}; }
yearWork=(o=>function(){ const m=S.me, j=m.job&&!m.prison?carEnsure(m.job):null; const r=o.apply(this,arguments);
  if(j&&m.job===j){ if(j.adv&&R.chance(.5)) j.adv--; j.rep=clamp(j.rep+(j.perf>=70?2:j.perf<35?-3:0));
    const d=!j.spc&&JOBS.find(x=>x.id===j.id); if(d&&!d.pt&&j.rep>=55&&R.chance((j.rep-45)/250)) queue('car_proposta',carPropostaDados()); }
  return r; })(yearWork);
// tela do emprego: minigame da área, reputação e advertências
V.jobMenu=(o=>function(){ const r=o.apply(this,arguments), m=S.me, j=carEnsure(m.job), F=carFam(j); if(!j||!r||!r.items) return r;
  r.items.splice(1,0,{html:`<div class="card">${bar('Reputação no setor',clamp(j.rep))}${kv('Advertências',`${j.adv} de 3`)}<p style="color:var(--muted);font-size:13px">Reputação alta atrai propostas de outras empresas. Três advertências levam a uma conversa com o RH.</p></div>`});
  if(F){ const i=r.items.findIndex(x=>x.sec==='Ritmo de trabalho'); r.items.splice(i>=0?i:2,0,{sec:'Minigame da profissão'},{ic:F.ic,l:F.n,s:'Três situações difíceis · desempenho, reputação e bônus',on:()=>act(carMinigame,F.n)}); }
  return r; })(V.jobMenu);
// eventos de oportunidade e de risco para quem tem emprego comum
const CJW=f=>m=>!!m.job&&!m.job.spc&&!m.prison&&(()=>{ const d=JOBS.find(x=>x.id===m.job.id); return !!d&&!d.pt&&f(m.job,d,m); })();
pack({k:'Trabalho',w:.8,cd:9,min:18,when:CJW(()=>true)},[
  ['Curso pago pela empresa','A {co} oferece pagar um curso de especialização, mas você teria que ficar mais dois anos.',['Aceitar|sm+3 perf+6|Aprendi muito e voltei com ideias novas.','Recusar|h+0|Não quero me prender.']],
  ['Vaga em outra cidade','A empresa abriu uma vaga de chefia numa filial em outra cidade.',['Me candidatar|?perf promo|Fui escolhid{o}. Malas prontas para a filial.|perf-2|Escolheram outra pessoa.','Ficar onde estou|h+1|Minha vida está aqui.']],
  ['Prova interna','Abriu um processo seletivo interno para uma vaga acima da sua.',['Estudar e fazer a prova|?sm promo|Passei em primeiro lugar.|h-3|Fiquei em segundo. Só tinha uma vaga.','Não fazer|h+0|Não era a hora.']],
  ['Funcionário do mês','Seu nome está entre os indicados a funcionário do mês.',['Fazer campanha discreta com os colegas|?lk perf+4 h+4|Ganhei a plaquinha e um vale-presente.|h-1|Ganhou o queridinho do chefe.','Deixar acontecer|perf+1|Ser indicad{o} já foi bom.']],
  ['Mentor','Um diretor experiente se oferece para ser seu mentor.',['Aceitar|sm+2 perf+5|Aprendi mais em um ano do que em cinco.','Recusar com educação|h+0|Prefiro aprender do meu jeito.']],
  ['Assédio do chefe','Seu chefe faz comentários inapropriados e insiste em encontros fora do trabalho.',['Denunciar ao canal de ética|k+5 ?55 h+3|A empresa afastou o chefe.|perf-8 h-6|Abafaram o caso, e eu virei "problema".','Cortar com firmeza|h-2|Ele parou. Por enquanto.','Mudar de setor|perf-3 h+2|Me livrei, mas recomecei do zero.']],
  ['Greve','Os funcionários da {co} decidiram entrar em greve por salários.',['Aderir|k+3 ?50 raise+8|A greve deu certo: aumento para todos.|perf-6|A greve fracassou e a empresa anotou nomes.','Furar a greve|perf+5 k-4|O chefe gostou. Os colegas, não.']],
  ['Home office','A empresa propõe que você trabalhe de casa três dias por semana.',['Aceitar|h+5 ?60 perf+2|Produzo mais de pijama.|perf-5|Me distraí demais.','Preferir o escritório|perf+2|Gosto do ambiente.']],
]);
pack({k:'Trabalho',w:.7,cd:12,min:18,when:CJW((j,d)=>j.lvl>=d.l.length-1)},[
  ['Teto na empresa','Você chegou ao topo da carreira na {co}. Uma concorrente oferece um cargo de diretoria.',['Aceitar o desafio|$v perf-10 h+6|Recomecei em outra casa, com outro salário e outro peso nas costas.','Ficar e virar referência|perf+5 k+2|Viraram minha história em palestra interna.'],{v:[10000,60000]}],
  ['Formar o sucessor','A diretoria pede que você prepare alguém para o seu lugar.',['Ensinar tudo, de verdade|k+6 perf+3|Meu pupilo é ótimo. E me deve tudo.','Ensinar pela metade|k-4 perf+2|Ainda preciso ser indispensável.']],
]);
