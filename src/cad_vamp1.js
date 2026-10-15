// ===== Histórias em cadeia: a vida de vampiro (1) =====
const VAMP=CRI('vampiro');
chain('vamp_noite',{k:'Vampiro',min:16,max:200,when:VAMP,gap:[1,1]},{
 a:['Viver de noite','O sol queima a minha pele. Preciso reorganizar a vida inteira para a noite.',['Arrumar um trabalho noturno|>b|Segurança, plantão, padaria de madrugada.','Fingir uma doença de pele|>c|"Fotossensibilidade grave", disse o atestado falso.']],
 b:['O plantão','Trabalhar de madrugada é perfeito: pouca gente, muita escuridão.',['Fazer o melhor trabalho noturno da cidade|perf+10 $+3000 >d|O chefe nunca viu ninguém tão disposto às três da manhã.','Usar o plantão para caçar|fome-30 k-5 >e|Ninguém percebe quem some de madrugada.']],
 c:['A doença inventada','A família acreditou na doença. Mas querem me levar a um especialista.',['Ir ao especialista|?40 >d|Hipnotizei o médico. Ele assinou o laudo que eu quis.|>e|O médico estranhou meu sangue.','Fugir das consultas|h-3 >d|Desculpa atrás de desculpa.']],
 d:['A rotina','A vida noturna encontrou seu ritmo.',['Fazer amigos noturnos|h+6 >f|Taxistas, enfermeiras, padeiros: a cidade que ninguém vê.','Ficar sozinh{o}|h-4 >f|A noite é longa.']],
 e:['Desconfiança','Alguém começou a reparar que eu nunca apareço de dia.',['Inventar um álibi diurno|?sm >d|Mandei fotos antigas de praia. Colou.|>f|O álibi não colou.','Mudar de cidade|$-4000 >d|Recomeço noturno.']],
 f:['Anos depois','Os anos passam e o espelho continua vazio.',['Aceitar a noite|h+6|A lua virou meu sol.','Sentir saudade do sol|h-6|Às vezes vejo o amanhecer pela janela, pelas frestas, e choro.']],
});
chain('vamp_doador',{k:'Vampiro',min:18,max:200,when:VAMP,npc:1,gap:[1,1]},{
 a:['Alguém que entende','{p}, que conheci num bar, percebeu o que eu sou. Não fugiu. Ofereceu o próprio sangue.',['Aceitar|fome-50 vira:amigo >b|Bebi pouco, com cuidado. {p} sorriu.','Recusar|k+3 >e@1|Não quero transformar alguém em refeição.']],
 b:['O acordo','{p} quer ser meu doador fixo. Em troca, quer saber como é a eternidade.',['Contar histórias da noite|bond+10 >c|{p} ouve tudo fascinad{o2}.','Pagar pelo sangue|$-2000 fome-30 >c|Negócio é negócio.']],
 c:['O vício','{p} começou a se viciar na mordida. Pede mais do que deveria dar.',['Diminuir as mordidas|k+5 bond-5 >d|{p} ficou irritad{o2}, mas mais saudável.','Continuar|fome-40 k-5 >f|{p} está cada vez mais pálid{o2}.']],
 d:['O pedido','{p} quer ser transformad{o2}.',['Transformar|morder k-3 bond+15|Agora {p} é como eu. Uma companhia para a eternidade.','Recusar|bond-15 >e|{p} saiu chorando.']],
 e:['A falta','Sem doador, a sede volta a apertar.',['Procurar outro jeito|fome+20 >g|Mercado negro, animais, hospitais.','Voltar a procurar {p}|>b@1|Talvez ainda dê.']],
 f:['O desmaio','{p} desmaiou depois de uma mordida. Precisei levar ao hospital.',['Ficar no hospital até {ele} acordar|k+6 bond+10 >d|Prometi nunca mais exagerar.','Ir embora antes que perguntem|k-8 >e|{p} nunca mais me procurou.']],
 g:['Outras fontes','Aprendi a me virar sem ninguém.',['Comprar sangue no mercado negro|$-3000 fome-40|Caro, mas seguro.','Caçar animais na mata|fome-25 h-2|Funciona. Mais ou menos.']],
});
chain('vamp_ancestral',{k:'Vampiro',min:18,max:200,when:VAMP,npc:1,age:[200,300],gap:[1,1]},{
 a:['O mais velho','Um vampiro de quatrocentos anos, {p}, mandou me chamar. Diz que a cidade é território d{ele}.',['Ir ao encontro|>b|Um porão de mármore, velas e um cheiro de séculos.','Ignorar o chamado|>e|Ninguém ignora {p}.']],
 b:['A oferta','{p} propõe proteção em troca de lealdade e de uma parte de tudo o que eu caçar.',['Aceitar|vira:amigo fome-20 >c|Agora sou súdit{o} de um vampiro ancião.','Recusar|vira:inimigo >e|{p} não gostou nada.']],
 c:['As lições','{p} me ensinou a hipnotizar com o olhar e a me mover sem fazer barulho.',['Aprender tudo|fight+6 sm+3 >d|Aprendi a dominar a noite.','Desconfiar das lições|>d|Por que tanta generosidade?']],
 d:['O preço','{p} pediu que eu elimine um caçador que está chegando perto d{ele}.',['Obedecer|?fight k-8 bond+15 >f|O caçador não vai mais incomodar.|hl-25 >f|O caçador era bom. Escapei por pouco.','Avisar o caçador para fugir|k+8 bond-20 >e|O caçador fugiu. {p} percebeu.']],
 e:['A ira do ancião','{p} declarou guerra a mim. Três vampiros me esperam toda noite.',['Lutar|?fight f+0 >f|Venci os três. {p} me respeita agora, de longe.|hl-30 >g|Fui derrotad{o} e humilhad{o}.','Fugir da cidade|$-6000 h-4|Cidade nova, território livre.']],
 f:['O herdeiro','{p} disse que está cansado da eternidade e quer que eu herde o território.',['Aceitar|f+0 h+10 k-2|A cidade agora é minha à noite.','Recusar|h+3|Liderar a noite não é para mim.']],
 g:['Cicatrizes','A derrota deixou marcas que nem o sangue cura.',['Treinar para a revanche|fight+8 >e@2|Um dia volto.','Viver discretamente|h-2|Sumir é a melhor proteção.']],
});
chain('vamp_espelho',{k:'Vampiro',min:30,max:200,when:VAMP,gap:[2,3]},{
 a:['Sem envelhecer','Meus amigos estão ficando grisalhos. Eu continuo igual ao dia da mordida.',['Usar maquiagem para parecer mais velh{o}|h-2 >b|Pó, rugas pintadas e um pouco de cinza no cabelo.','Dizer que é genética|>c|"Lá em casa ninguém envelhece."']],
 b:['A farsa','A maquiagem funciona de longe. De perto, nem tanto.',['Manter a farsa|>d|Mais um ano de pó nas têmporas.','Contar a verdade para os mais próximos|>e|Escolhi três pessoas de confiança.']],
 c:['As perguntas','Pessoas na rua começaram a perguntar meu segredo de juventude.',['Inventar um creme milagroso|$+5000 f+3 >d|Vendi um creme de farmácia como segredo. Vendeu muito.','Fugir das perguntas|>d|Melhor não chamar atenção.']],
 d:['Hora de partir','Chegou a hora que todo vampiro conhece: sumir antes que percebam.',['Forjar a própria morte|$-10000 >f|Velório com caixão fechado. Assisti de longe.','Mudar de país|$-15000 >f|Nova língua, novo nome.']],
 e:['Os três','Das três pessoas que contei, duas aceitaram. Uma nunca mais falou comigo.',['Ficar perto das que aceitaram|h+8 >d@3|Elas guardam meu segredo como um tesouro.','Ir embora mesmo assim|h-4 >d|Melhor não arriscar.']],
 f:['Nova identidade','Comecei uma vida nova com outro nome.',['Recomeçar do zero|h+4 sm+3|Mais uma vida, entre tantas.','Visitar o próprio túmulo|h-6|Li meu nome na lápide. Estranho.']],
});
chain('vamp_padre',{k:'Vampiro',min:16,max:200,when:VAMP,npc:1,gn:'M',age:[15,35],gap:[1,1]},{
 a:['O padre desconfia','O padre do bairro, {p}, me olhou de um jeito estranho e reparou que eu não entro na igreja.',['Evitar o padre|>b|Mudei o caminho de casa.','Tentar entrar na igreja para disfarçar|hl-15 >c|Senti a pele queimar na porta. Ele viu.']],
 b:['A visita','O padre apareceu na minha porta com um crucifixo no bolso e um sorriso educado.',['Convidar para entrar|>d|Ele entrou devagar, de olho em tudo.','Não abrir a porta|>c|Ele deixou um bilhete: "Posso ajudar."']],
 c:['O confronto','O padre me encurralou num beco com água benta.',['Lutar|?fight k-6 >e|Desarmei o padre e fugi. Não feri.|hl-20 >e|A água benta queimou meu rosto.','Pedir para conversar|>d|Ele baixou a garrafa.']],
 d:['A conversa','O padre disse que não quer me destruir. Quer me salvar.',['Ouvir|k+5 >f|Ele falou de uma cura antiga, guardada num mosteiro.','Rir dele|>e|Ele foi embora triste.']],
 e:['Vigiad{o}','Desde então, o padre me vigia de longe.',['Fazer as pazes|>d|Bati na porta da casa paroquial.','Mudar de bairro|$-3000 h+2|Melhor manter distância de quem tem água benta.']],
 f:['O mosteiro','O padre me levou a um mosteiro nas montanhas. Os monges guardam um ritual de cura.',['Fazer o ritual|?40 curar h+25 k+10|Sete dias de jejum e reza. No oitavo, vi o sol nascer sem queimar.|hl-25 h-10|O ritual falhou. Quase morri de verdade.','Agradecer e recusar|k+3 h+3|Já aceitei quem eu sou. Mas virei amigo do padre.']],
});
chain('vamp_festa',{k:'Vampiro',min:16,max:200,when:VAMP,gap:[1,1]},{
 a:['A festa lotada','Uma festa lotada, música alta, centenas de corações batendo ao meu redor. A sede apertou.',['Sair da festa|k+3 >b|Respirei o ar frio da rua.','Ficar e controlar|?will fome+10 h+4 >c|Dancei a noite inteira sem morder ninguém.|>d|A sede venceu.']],
 b:['O alívio','Longe da festa, a sede diminuiu. Mas os amigos acharam estranho eu sumir.',['Inventar que passei mal|h+0|Todos acreditaram.','Voltar mais tarde|>c|Mais calm{o}.']],
 c:['O controle','Consegui ficar a noite toda sem perder o controle.',['Me sentir orgulhos{o}|h+8|Estou aprendendo a viver com isso.','Ir embora antes de abusar da sorte|h+4|Não preciso provar nada.']],
 d:['A mordida','Mordi alguém num canto escuro da festa. A pessoa desmaiou.',['Chamar ajuda e fugir|fome-50 k-6 >e|A ambulância levou a pessoa. Ela vai ficar bem.','Hipnotizar para esquecer|fome-50 k-4 >e|Ela acordou achando que bebeu demais.']],
 e:['O dia seguinte','Na internet, alguém postou foto de uma "mordida estranha" no pescoço.',['Ficar quiet{o}|h-4|A foto sumiu da internet em uma semana.','Inventar que foi uma brincadeira de fantasia|?40 h+2|Colou.|f+2 h-6|Alguém ligou os pontos.']],
});
chain('vamp_jornalista',{k:'Vampiro',min:18,max:200,when:VAMP,npc:1,gap:[1,1]},{
 a:['A reportagem','{p}, jornalista, está investigando "ataques noturnos" na cidade. Meu nome apareceu numa lista.',['Procurar {p} antes que publique|>b|Marquei um café. À noite, claro.','Ignorar|>c|Talvez não dê em nada.']],
 b:['O café','{p} me olhou nos olhos: "Eu sei o que você é."',['Hipnotizar para esquecer|?50 h+4|{p} acordou sem lembrar da investigação.|>c|{p} usava lentes especiais. Não funcionou.','Contar a verdade|>d|{p} anotou tudo com a mão tremendo.']],
 c:['A matéria','{p} publicou a matéria. Não citou meu nome, mas descreveu meus hábitos.',['Processar o jornal|$-5000 >e|O advogado nem entendeu o processo.','Sumir por um tempo|$-3000 h-3 >e|Fui para o interior.']],
 d:['A exclusiva','{p} quer fazer uma série de reportagens contando a vida de um vampiro, sem revelar quem eu sou.',['Aceitar|f+8 vira:amigo >e|A série virou fenômeno. Ninguém sabe que é real.','Recusar|bond-10 >c|{p} publicou mesmo assim.']],
 e:['Depois','A cidade agora tem uma lenda nova. E eu sou ela.',['Gostar da fama anônima|h+6|Ouço as pessoas falarem de mim no ônibus.','Ficar paranoic{o}|h-6|Todo jornalista agora me parece uma ameaça.']],
});
chain('vamp_sol',{k:'Vampiro',min:18,max:200,when:VAMP,gap:[2,3]},{
 a:['Saudade do sol','Faz anos que não vejo o sol. Sonho com praia, com calor, com sombra de árvore.',['Assistir ao nascer do sol pela TV|h-2 >b|Não é a mesma coisa.','Procurar uma forma de ver o sol|>c|Deve existir um jeito.']],
 b:['A tentação','Uma manhã, fiquei parad{o} na frente da janela fechada, com a mão na cortina.',['Abrir só um pouco|hl-15 h+6 >d|Um raio de sol queimou meu braço. Valeu a pena.','Fechar de vez|h-4|Não hoje.']],
 c:['O tecido','Ouvi falar de um tecido especial que protege vampiros do sol.',['Comprar|$-15000 >d|Um manto preto, pesado, que cobre tudo menos os olhos.','Desconfiar|>b|Golpe, certeza.']],
 d:['Uma tarde','Com o manto, saí ao sol pela primeira vez em anos.',['Ir à praia|?60 h+20 >e|Senti o calor através do tecido. Chorei de felicidade.|hl-20 h+5|O manto rasgou. Corri queimand{o} para a sombra.','Ficar só uns minutos no quintal|h+12 >e|Foi o suficiente.']],
 e:['A lembrança','Aquela tarde de sol virou a melhor lembrança da minha eternidade.',['Guardar o manto para ocasiões especiais|h+5|Uma vez por ano, uma tarde de sol.','Dar o manto para outro vampiro|k+6|Alguém merece sentir o sol também.']],
});
chain('vamp_cria',{k:'Vampiro',min:20,max:200,when:VAMP,npc:1,gap:[1,1]},{
 a:['Morrendo na calçada','Encontrei {p} esfaquead{o2} num beco, morrendo. Só eu posso salvar.',['Transformar {p}|vira:amigo morder k+2 >b|Salvei a vida d{ele}. Do meu jeito.','Chamar a ambulância|k+6 >e|Fiquei até a ambulância chegar.','Ir embora|k-8|Não é problema meu.']],
 b:['O despertar','{p} acordou com sede e medo, sem entender o que aconteceu.',['Ensinar tudo com paciência|bond+15 >c|Ensinei a beber sem matar e a se esconder do sol.','Deixar {ele} se virar|bond-15 >d|{p} saiu sozinh{o2} pela noite.']],
 c:['Família da noite','{p} me chama de mestre. Vivemos como uma família estranha.',['Aceitar o papel|h+10 bond+10 >f|Pela primeira vez, a eternidade não é solitária.','Pedir para {ele} seguir o próprio caminho|bond-5 >f|Todo vampiro precisa aprender sozinho um dia.']],
 d:['Descontrole','{p} atacou pessoas sem controle. A polícia está investigando.',['Encontrar {p} e corrigir|?fight k+4 >c|Segurei {p} até a sede passar e recomecei a ensinar.|hl-15 >g|{p} me atacou.','Entregar {p} a caçadores|k-6 bond-30|Foi a decisão mais difícil da minha vida.']],
 e:['O hospital','{p} sobreviveu. Me procurou depois para agradecer.',['Fazer amizade|vira:amigo h+6|Uma amizade humana. Rara.','Sumir|h+2|Melhor que não saiba nada de mim.']],
 f:['A herança','Décadas depois, {p} transformou outra pessoa. A família cresce.',['Ficar orgulhos{o}|h+8|Minha linhagem continua.','Ficar preocupad{o}|h-2|Quantos vampiros a cidade aguenta?']],
 g:['A briga','Lutar contra quem eu criei deixou feridas em nós dois.',['Fazer as pazes|bond+10 >c|Nós nos perdoamos.','Separar de vez|bond-20|{p} foi embora para sempre.']],
});
chain('vamp_cientista',{k:'Vampiro',min:18,max:200,when:VAMP,npc:1,gn:'F',gap:[1,1]},{
 a:['A pesquisadora','{p}, uma cientista, descobriu meu segredo e quer estudar meu sangue.',['Aceitar participar|vira:amigo >b|Coleta de sangue, exames e muitas perguntas.','Fugir|>e|Não vou virar rato de laboratório.']],
 b:['A descoberta','Meu sangue regenera células humanas em horas. Pode curar doenças.',['Doar sangue para a pesquisa|k+8 >c|Se pode salvar gente, que salve.','Exigir pagamento|$+20000 k-3 >c|Eternidade custa caro.']],
 c:['O remédio','{p} criou um remédio que cura feridas graves usando meu sangue.',['Deixar publicar|f+5 k+8 >d|O mundo ganhou um remédio milagroso.','Pedir sigilo|k+3 >d|Ninguém pode saber de onde vem.']],
 d:['A empresa','Uma grande empresa farmacêutica quer comprar a fórmula. E quer saber a fonte.',['Recusar a venda|k+5 >f|{p} ficou do meu lado.','Aceitar e sumir|$+50000 >e|Peguei a minha parte e desapareci.']],
 e:['Caçad{o}','A empresa contratou gente para me encontrar.',['Fugir do país|$-10000 h-4|Nova vida, longe dos laboratórios.','Enfrentar|?fight >f|Os mercenários desistiram.|hl-25|Me pegaram por um tempo. Fugi na lua cheia.']],
 f:['Parceria','{p} e eu continuamos a pesquisa em segredo, num laboratório escondido.',['Buscar a cura do vampirismo|?30 curar h+20|Funcionou. Voltei a ser humano.|h+4|Ainda não. Mas estamos perto.','Buscar a cura de doenças humanas|k+10 h+6|Já salvamos milhares de vidas.']],
});
