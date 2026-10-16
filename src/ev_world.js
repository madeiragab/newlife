// ===== Eventos por saúde, dinheiro, país, bichos, realeza, política, empresa e prisão =====
const hasDis=(...ids)=>m=>m.dis.some(d=>ids.includes(d.id));
const inCountry=(...ids)=>m=>ids.includes(m.country);
// ---------- saúde e vícios ----------
pack({k:'Saúde',when:hasDis('diabetes')},[
 ['Doce na festa','Tem um bolo de chocolate maravilhoso na festa e eu sou diabétic{o}.',['Resistir|hl+2 h-3|Comi uma fruta. Que vida.','Comer só um pedaço|?60|Tudo bem.|hl-5|Minha glicose disparou.']],
 ['Medidor de glicose','Esqueci o medidor de glicose em casa durante uma viagem.',['Voltar para buscar|h-2 hl+2|Perdi o passeio, mas fiquei segur{o}.','Seguir sem ele|?50|Passou.|hl-8|Passei mal no meio do caminho.']],
]);
pack({k:'Saúde',when:hasDis('hipertensao','cardiaca')},[
 ['Pressão alta','O médico disse que minha pressão está nas alturas.',['Cortar o sal e caminhar|hl+4 h-2|A pressão baixou.','Ignorar|hl-4|Não sinto nada. Ainda.']],
 ['Estresse no coração','Senti uma pontada no peito depois de uma discussão.',['Ir ao pronto-socorro|$-800 hl+2|Foi só um susto, mas o médico mandou desacelerar.','Esperar passar|?60|Passou.|hl-12|Era um princípio de infarto.']],
]);
pack({k:'Saúde',when:hasDis('depressao','ansiedade')},[
 ['Dia difícil','Hoje não consegui sair da cama.',['Pedir ajuda a alguém próximo|h+6|Uma conversa longa me fez bem.','Ficar sozinh{o}|h-6|O dia foi longo.']],
 ['Crise no ônibus','Tive uma crise de ansiedade no transporte público.',['Respirar fundo e descer|h-2|Passou depois de alguns minutos.','Ligar para o terapeuta|$-200 h+4|Ele me ajudou pelo telefone.']],
 ['Grupo de apoio','Descobri um grupo de apoio no bairro.',['Ir às reuniões|h+8 k+1|Não estou sozinh{o} nisso.','Não ir|h-1|Ainda não estou pront{o}.']],
]);
pack({k:'Saúde',when:hasDis('asma','artrite','osteoporose','enxaqueca','insonia','hernia')},[
 ['Crise forte','Tive uma crise forte da minha doença crônica.',['Ir ao médico|$-500 hl+3|O médico ajustou o tratamento.','Aguentar em casa|hl-5 h-4|Foram três dias horríveis.']],
 ['Tratamento novo','Saiu um tratamento novo, mas é caro: {v}.',['Fazer o tratamento|$-v hl+8 h+5|Minha qualidade de vida melhorou muito.','Continuar com o antigo|h-2|Vou esperar baratear.'],{v:[3000,30000]}],
]);
pack({k:'Saúde',when:hasDis('cancer_pele','cancer_pulmao','cancer_mama','cancer_prostata','leucemia')},[
 ['Quimioterapia','Hoje começa a quimioterapia.',['Encarar com coragem|h+3 hl-4|Meu cabelo caiu, mas meu ânimo não.','Buscar um tratamento alternativo|$-v ?15 hl+10|Para surpresa dos médicos, melhorei.|hl-10|Não funcionou e perdi tempo precioso.'],{v:[2000,20000]}],
 ['Corrente de apoio','Amigos e família fizeram uma corrente de apoio para mim.',['Agradecer a todos|h+10|Nunca me senti tão amad{o}.','Ignorar as mensagens|h-3|Não estava pront{o} para falar.','Aproveitar e pedir doação|$v k-3|Juntei {v}. Alguns acharam oportunismo.']],
 ['Lista de desejos','Fiz uma lista de coisas que quero fazer enquanto posso.',['Fazer uma viagem dos sonhos|$-v h+15 c:trips|Vi o mar de {lugar}. Valeu tudo.','Reunir a família|h+12|Uma tarde que vou guardar para sempre.'],{v:[5000,30000]}],
]);
pack({k:'Vício',when:m=>m.add.alcool>=40},[
 ['Ressaca no trabalho','Cheguei de ressaca ao trabalho pela terceira vez no mês.',['Disfarçar|?40|Ninguém percebeu.|perf-10|Meu chefe percebeu na hora.','Admitir que tenho um problema|h-2 add.alcool-15|Primeiro passo dado.'],{when:m=>m.job}],
 ['Briga de bar','Bebi demais e arrumei confusão no bar.',['Pedir desculpas e ir embora|h-4|Fui embora com vergonha.','Partir para a briga|?fight h+2|Venci a briga, mas perdi a dignidade.|hl-15 arrest:briga_de_bar:0:1|Apanhei e fui pres{o}.']],
 ['Intervenção','Minha família fez uma intervenção sobre a bebida.',['Aceitar ajuda|add.alcool-25 h+4|Vou me tratar.','Ficar na defensiva|h-6|Não preciso de ajuda. Acho.']],
]);
pack({k:'Vício',when:m=>m.add.cigarro>=40},[
 ['Fôlego curto','Fiquei sem fôlego subindo dois lances de escada.',['Tentar parar de fumar|?k add.cigarro-30 hl+3|Já faz um mês sem cigarro!|add.cigarro-5 h-4|Tive uma recaída.','Acender outro cigarro|hl-3|Depois eu paro.']],
 ['Lei antifumo','Proibiram o cigarro em todos os lugares fechados que eu frequento.',['Aproveitar para diminuir|add.cigarro-10|Fumo bem menos agora.','Fumar na chuva|hl-2|Estou sempre resfriad{o}.']],
]);
pack({k:'Vício',when:m=>m.add.jogo>=40},[
 ['Dívida de jogo','Devo {v} para um agiota por causa das apostas.',['Pagar tudo|$-v h-4|Paguei. Não posso mais apostar.','Apostar para recuperar|?20 $v|Recuperei tudo!|$-v2 h-10|Afundei mais ainda.'],{v:[2000,20000]}],
 ['Grupo de jogadores anônimos','Ouvi falar de um grupo de apoio para viciados em jogo.',['Ir às reuniões|add.jogo-25 h+4|Estou limp{o} há dois meses.','Não ir|add.jogo+5|Só mais uma aposta.']],
]);
// ---------- dinheiro ----------
pack({k:'Dinheiro',min:18,when:m=>m.money<5000&&!m.prison},[
 ['Conta atrasada','A conta de luz está atrasada há três meses.',['Pagar com o pouco que tenho|$-400 h-3|Fiquei sem dinheiro para o resto do mês.','Negociar parcelamento|sm+1|Parcelei em seis vezes.']],
 ['Bico de fim de semana','Um vizinho ofereceu um bico de {bico}.',['Aceitar|$v hl-1|Ganhei {v} no fim de semana.','Recusar|h+2|Precisava descansar.'],{v:[200,1500]}],
 ['Cesta básica','A igreja do bairro está distribuindo cestas básicas.',['Pegar uma|h+2|Ajudou muito este mês.','Deixar para quem precisa mais|k+3|Ainda dá para me virar.']],
 ['Vender coisas','Pensei em vender algumas coisas para fechar o mês.',['Vender {coisa} na internet|$v h-2|Consegui {v}.','Inflar o preço e mentir o estado|?50 $v2 k-4|Vendi caro.|k-4 h-3|O comprador me expôs no grupo do bairro.','Doar tudo|k+4 h+3|Liberou espaço e fez bem.'],{v:[100,1500]}],
]);
pack({k:'Dinheiro',min:18,when:m=>netWorth()>=1000000&&!m.prison},[
 ['Pedidos de dinheiro','Desde que fiquei ric{o}, todo parente aparece pedindo dinheiro.',['Ajudar alguns|$-v k+3|Ajudei quem realmente precisava.','Dizer não a todos|k-2 h+2|Perdi alguns parentes. Ganhei paz.'],{v:[10000,80000]}],
 ['Clube exclusivo','Fui convidad{o} para um clube exclusivo de milionários.',['Entrar|$-v f+3 h+5|Faço negócios no campo de golfe agora.','Recusar|h+1|Não é a minha praia.'],{v:[30000,150000]}],
 ['Assessor financeiro','Um assessor me ofereceu um investimento "seguro" em {invest}.',['Investir|$-v ?55 $v2|O investimento rendeu {v2}!|h-6|O fundo quebrou.','Recusar|sm+1|Melhor não arriscar.'],{v:[20000,200000]}],
 ['Segurança particular','Recebi ameaças de sequestro.',['Contratar seguranças|$-v h+3|Agora ando escoltad{o}.','Ignorar|?80|Era só um trote.|h-15 $-v2|Fui sequestrad{o} e paguei resgate.'],{v:[20000,100000]}],
 ['Doação milionária','Uma fundação me pediu uma doação grande para um hospital infantil.',['Doar {v}|$-v k+10 f+3 c:gifts|Uma ala do hospital vai ter meu nome.','Recusar|k-2|Talvez no ano que vem.'],{v:[50000,500000]}],
]);
// ---------- países ----------
pack({k:'Cultura',when:inCountry('BR'),min:5},[
 ['Carnaval','Chegou o Carnaval!',['Cair no bloco|h+10 add.alcool+3|Quatro dias de folia.','Desfilar numa escola de samba|$-v h+12 f+1|A avenida tremeu!','Ir para a praia descansar|h+5|Fugi da muvuca.'],{v:[500,3000],cd:3}],
 ['Final do campeonato','Meu time está na final do campeonato brasileiro.',['Ir ao estádio|$-300 ?50 h+12|CAMPEÃO!|h-8|Perdemos nos pênaltis.','Ver no bar com os amigos|h+6|O bar inteiro gritou.'],{cd:4}],
 ['Festa junina','Vai ter festa junina na rua.',['Ir com roupa caipira|h+6|Comi pamonha, quentão e dancei quadrilha.','Ficar em casa|h-1|Ouvi os fogos de longe.','Beber quentão demais|h+6 add.alcool+4 hl-2|Dancei quadrilha com um poste.'],{cd:3}],
 ['Copa do Mundo','É ano de Copa e o país parou.',['Assistir todos os jogos|h+8|Pintei o rosto de verde e amarelo.','Não ligo para futebol|h+1|Aproveitei as ruas vazias.'],{cd:4}],
]);
pack({k:'Cultura',when:inCountry('PT','ES','IT','FR'),min:5},[
 ['Festa da cidade','A cidade está em festa com {festa}.',['Participar|h+8|Comi, dancei e cantei até tarde.','Ficar em casa|h-1|O barulho não me deixou dormir.','Arrumar briga na festa|?tal.athletic h+2|Saí por cima.|hl-8 h-4|Levei um soco no olho.'],{cd:3}],
 ['Férias de agosto','O país inteiro tira férias em agosto.',['Ir para o litoral|$-v h+8 c:trips|Praia lotada, mas valeu.','Ficar em casa e economizar|$+200 h-2|Vi as fotos dos outros.','Ir e torrar tudo|$-v2 h+12|Valeu cada centavo. Ou não.'],{v:[500,3000],cd:3}],
]);
pack({k:'Cultura',when:inCountry('US','CA','GB'),min:5},[
 ['Dia de Ação de Graças','Toda a família vai se reunir para o jantar.',['Ir|h+6|O peru estava seco, mas a família estava unida.','Inventar uma desculpa|h+1 k-1|Comi pizza sozinh{o}.','Ir e brigar por política na mesa|h-4|O peru ficou em segundo plano.'],{when:inCountry('US','CA'),cd:3}],
 ['Neve','Uma nevasca fechou a cidade inteira.',['Fazer um boneco de neve|h+5|Ficou torto, mas é meu.','Ficar em casa no aquecedor|h+3|Chocolate quente e série.'],{when:inCountry('CA','US'),cd:3}],
 ['Chá das cinco','Fui convidad{o} para um chá da tarde muito formal.',['Ir e seguir a etiqueta|k+1|Segurei a xícara do jeito certo.','Molhar o biscoito no chá|h+3 k-1|Olharam feio.','Recusar|h+0|Prefiro café.'],{when:inCountry('GB'),cd:6}],
]);
pack({k:'Cultura',when:inCountry('JP','KR'),min:5},[
 ['Hanami','As cerejeiras floresceram e todos vão fazer piquenique no parque.',['Ir ao parque|h+8|Um dos dias mais bonitos do ano.','Ficar em casa|h-1|As flores caíram antes de eu ver.','Exagerar no saquê|h+6 add.alcool+4|Dormi debaixo da cerejeira.'],{when:inCountry('JP'),cd:3}],
 ['Karaokê com o chefe','O chefe convidou a equipe para o karaokê depois do expediente.',['Ir e cantar|?tal.musical perf+4 h+4|O chefe me aplaudiu.|perf+1|Desafinei, mas ganhei pontos por ir.','Recusar|perf-3|Pegou mal.'],{when:m=>m.job,cd:4}],
]);
pack({k:'Cultura',when:inCountry('MX','AR','AO','IN'),min:5},[
 ['Festa tradicional','A cidade celebra {festa}.',['Participar|h+8|Uma noite cheia de cor, música e comida.','Ficar em casa|h-1|Vi tudo pelas redes.','Exagerar na bebida|h+5 add.alcool+5|Não lembro de metade da noite.'],{cd:3}],
 ['Clássico do futebol','Hoje tem o maior clássico do país.',['Ir ao estádio|?50 h+10|Vitória épica!|h-6|Derrota amarga.','Ver em casa|h+3|Mais barato e com sofá.','Ir com a torcida organizada|?40 h+12|Fizemos a maior festa!|hl-10 h-6|Teve briga na saída.'],{cd:4,when:inCountry('AR','MX','AO')}],
]);
pack({k:'Cultura',when:inCountry('DE'),min:5},[
 ['Festa da cerveja','Chegou a época da famosa festa da cerveja.',['Ir|h+8 add.alcool+5|Cantei músicas que não conheço.','Não ir|h-1|Fiquei sóbri{o} e entediad{o}.','Entrar no concurso de beber|?40 h+8 f+1 add.alcool+8|Ganhei!|hl-8 add.alcool+8|Passei mal na frente de todo mundo.'],{cd:3}],
]);
// ---------- bichos ----------
pack({k:'Bicho',who:'pet'},[
 ['Travessura','{p} destruiu {objeto}.',['Dar bronca|bond-3|{p} fez cara de culpa.','Rir e tirar foto|bond+3 h+3 follow+50|A foto rendeu muitas curtidas.']],
 ['Truque novo','Quero ensinar um truque para {p}.',['Treinar todo dia|?60 bond+8 h+5|{p} aprendeu a dar a pata!|bond+2|{p} não entendeu nada, mas ganhou petiscos.','Desistir|bond-2|{p} não tem vocação para circo.','Ensinar a roubar comida da mesa|bond+4 h+4 k-1|Agora {p} rouba o pão do vizinho.']],
 ['Fuga','{p} fugiu de casa.',['Procurar pelo bairro todo|?70 bond+8 h+4|Encontrei {p} na casa do vizinho.|h-12|Nunca mais encontrei {p}.','Colocar cartazes|?55 bond+4|Uma senhora devolveu {p}.|h-10|Ninguém ligou.']],
 ['Ciúmes','{p} está com ciúmes de alguém novo na casa.',['Dar mais atenção|bond+6|{p} voltou ao normal.','Ignorar|bond-6|{p} destruiu meu chinelo de vingança.','Dar um petisco|bond+3 $-30|Resolvido com suborno.']],
 ['Concurso','Vai ter um concurso de bichos na praça.',['Inscrever {p}|?40 $500 h+8 f+1|{p} ganhou o primeiro lugar!|h+2|{p} fez xixi no jurado.','Desistir|h+0|{p} é campeão só para mim.','Subornar o jurado com biscoitos|?60 $500 h+6 k-2|{p} ganhou. Ninguém precisa saber.|h-3|O jurado era alérgico a biscoito.']],
]);
EVENTS[Object.keys(EVENTS).filter(k=>/^p\d+$/.test(k)).pop()];
// ---------- realeza ----------
pack({k:'Realeza',when:m=>m.royal&&!m.royal.abd},[
 ['Banquete de Estado','Um rei estrangeiro vem jantar no palácio.',['Ser um anfitrião impecável|pop+5 f+2|O banquete foi elogiado no mundo todo.','Fazer uma piada diplomática|?50 pop+6|Ele riu muito.|pop-8|Ele não riu. Crise diplomática.']],
 ['Etiqueta real','Errei o protocolo e cumprimentei um embaixador do jeito errado.',['Pedir desculpas|pop-1|Ficou tudo bem.','Fingir que foi de propósito|?50 pop+3|Virou moda.|pop-4|Os jornais riram.']],
 ['Plebeu apaixonado','Me apaixonei por alguém comum, sem sangue nobre.',['Assumir o romance|pop+6 h+8|O povo adorou a história de amor.','Esconder|h-6|O palácio não aprovaria.'],{when:m=>m.royal&&!partners().length&&m.age>=18}],
 ['Herança da coroa','Preciso decidir quem herda as joias da família.',['Doar a um museu|pop+8 k+4|O povo aplaudiu o gesto.','Guardar tudo|h+1|Estão no cofre.']],
 ['Visita a hospital','Visitei crianças num hospital público.',['Passar o dia com elas|pop+6 k+5 h+4|Saí de lá transformad{o}.','Mandar um representante|pop-4|O povo reparou na ausência.','Ir só para as fotos|?50 pop+3|A foto ficou ótima.|pop-6|Um jornal mostrou que fiquei só 10 minutos.']],
 ['Manifestação antimonarquia','Grupos pedem o fim da monarquia.',['Dialogar com os manifestantes|?pop pop+8|Ganhei o respeito de muitos.|pop-5|Fui vaiad{o}.','Ignorar|pop-4|Os protestos cresceram.'],{when:m=>m.royal&&m.royal.reign}],
]);
// ---------- política ----------
pack({k:'Política',when:m=>m.office},[
 ['Visita a obra','Fui inaugurar uma obra que ainda não está pronta.',['Inaugurar assim mesmo|appr-3 f+1|Cortei a fita de uma ponte sem asfalto.','Adiar a inauguração|appr+2|Melhor esperar.']],
 ['Escândalo de assessor','Um assessor meu foi pego desviando dinheiro.',['Demitir e denunciar|appr+5 k+3|Agi rápido e saí bem.','Proteger o assessor|appr-8 k-4|A imprensa não perdoou.']],
 ['Enchente na cidade','Uma enchente atingiu vários bairros.',['Ir pessoalmente ajudar|appr+10 k+4|Fui fotografad{o} com lama até o joelho.','Mandar uma nota oficial|appr-6|Disseram que eu sumi.']],
 ['Aliança política','Um partido rival propõe uma aliança.',['Aceitar|?sm appr+4|A aliança fortaleceu meu mandato.|appr-4|Meus eleitores se sentiram traídos.','Recusar|appr+1|Mantive minha coerência.']],
 ['Fake news','Espalharam uma notícia falsa sobre mim.',['Desmentir com provas|?60 appr+5|A verdade venceu.|appr-4|A mentira já tinha rodado.','Processar quem espalhou|$-v appr+2|O processo vai longe.'],{v:[5000,30000]}],
]);
// ---------- empresa ----------
pack({k:'Empresa',when:m=>m.biz},[
 ['Funcionário estrela','{n}, a estrela da minha equipe, recebeu proposta do concorrente.',['Cobrir a proposta|$-v biz+3|{n} ficou.','Deixar ir|biz-3|Perdi um talento.'],{v:[5000,40000]}],
 ['Investidor anjo','Um investidor quer entrar como sócio com {v}.',['Aceitar|$v biz+20|A empresa ganhou fôlego para crescer.','Recusar|h+2|A empresa continua só minha.'],{v:[50000,500000]}],
 ['Fiscalização','A vigilância sanitária e a Receita vieram fiscalizar a {biz}.',['Mostrar tudo em ordem|?60 biz+2|Aprovad{o} sem ressalvas.|$-v biz-5|Multa de {v}.','Oferecer um "cafezinho" ao fiscal|?50 k-6|Ele aceitou e foi embora.|k-6 arrest:corrupção_ativa:1:3|Ele era da corregedoria.','Fechar a loja nesse dia|biz-3|Fingimos que estava fechado para reforma.'],{v:[2000,40000]}],
 ['Expansão','A {biz} pode abrir uma filial em outra cidade.',['Abrir a filial|$-v ?55 biz+30|A filial é um sucesso.|biz-15|A filial deu prejuízo.','Esperar|h+0|Crescer devagar é crescer.'],{v:[20000,200000]}],
 ['Crise econômica','Uma crise econômica derrubou as vendas.',['Cortar custos|biz-5 k-2|Demiti alguns funcionários.','Manter todo mundo|biz-12 k+4|Segurei a equipe no prejuízo.']],
 ['Prêmio de empresa do ano','A {biz} foi indicada a empresa do ano.',['Ir à premiação|?50 biz+8 f+3|Ganhamos!|h+1|Não ganhamos, mas foi uma honra.','Não ir|biz-1|Mandei um estagiário receber.','Comprar votos|$-v ?60 biz+10 k-6|Ganhamos, de certo modo.|biz-8 k-6 f+2|Vazou que compramos o prêmio.']],
]);
// ---------- prisão (adultos e internação) ----------
pack({k:'Prisão',jail:1,cd:7,when:m=>m.prison&&!m.prison.juv},[
 ['Banho de sol','Durante o banho de sol, alguém começou a me encarar.',['Encarar de volta|?fight behav-3|Ele desviou o olhar.|hl-10 behav-5|Virou briga.','Desviar o olhar|h-1|Melhor evitar confusão.']],
 ['Cela lotada','Colocaram mais quatro presos na minha cela.',['Aceitar|h-5 hl-2|Durmo sentad{o} agora.','Reclamar com o diretor|?40 behav+2|Fui transferid{o} para uma cela melhor.|behav-5|Fui para a solitária.']],
 ['Curso profissionalizante','Abriram um curso de {curso2} na prisão.',['Fazer o curso|sm+3 behav+8|Aprendi uma profissão.','Ignorar|h+0|Prefiro dormir.']],
 ['Advogado novo','Um advogado ofereceu revisar meu processo por {v}.',['Contratar|$-v ?25 free|O advogado achou uma falha no processo!|h-4|Não deu em nada.','Recusar|h+0|Não acredito mais em advogado.'],{v:[5000,30000]}],
 ['Culto na prisão','Um grupo religioso começou a visitar a prisão.',['Participar|k+4 h+4 behav+5|Encontrei um pouco de paz.','Ficar na cela|h+0|Não é para mim.']],
 ['Jogo de futebol','Vai ter campeonato de futebol entre as alas.',['Jogar|?tal.athletic h+6|Fiz o gol da vitória!|hl-5|Levei uma entrada criminosa.','Ficar no banco|h-2|Torci de longe.','Dar um carrinho no melhor jogador deles|?50 h+4 behav-4|Funcionou. Ganhamos.|behav-8 hl-3|Fui expuls{o} e perdi pontos de comportamento.']],
]);
pack({k:'Internação',jail:1,cd:6,when:m=>m.prison&&m.prison.juv},[
 ['Saudade de casa','Hoje bateu uma saudade enorme de casa.',['Escrever uma carta para a família|h+4|Escrevi três páginas.','Chorar escondid{o}|h-4|Ninguém pode ver.']],
 ['Briga no alojamento','Dois internos começaram a brigar no alojamento.',['Separar|k+3 behav+5|Os monitores me elogiaram.','Assistir|h+0|Não é problema meu.']],
 ['Aula de reforço','Um voluntário está dando aula de reforço.',['Participar|sm+3 grade+5 behav+4|Minhas notas melhoraram muito.','Matar a aula|behav-4 h+2|Fiquei no pátio jogando conversa fora.','Ir e dormir na carteira|behav-1|Ninguém me acordou.']],
 ['Plano para o futuro','A assistente social perguntou o que eu quero fazer quando sair.',['Fazer um plano sério|h+5 behav+6|Quero {sonho}.','Dar de ombros|h-2|Não sei.']],
]);
// ---------- fugitivo ----------
pack({k:'Fuga',when:m=>m.c.fugitive&&!m.prison},[
 ['Rosto no jornal','Minha foto apareceu no jornal como foragid{o}.',['Mudar o visual|lk-2|Cortei o cabelo e deixei a barba crescer.','Fingir que não é comigo|?60|Ninguém me reconheceu.|h-6|Uma senhora me olhou demais.']],
 ['Documento falso','Um contato vende documentos falsos por {v}.',['Comprar|$-v h+5|Agora tenho uma nova identidade.','Recusar|h-2|Vou me virar sem.'],{v:[2000,15000]}],
 ['Vizinho desconfiado','O vizinho anda me olhando de um jeito estranho.',['Me mudar de novo|$-v h-3|Mais uma cidade nova.','Fazer amizade com ele|?50 h+3|Ele só queria uma xícara de açúcar.|h-6|Ele chamou a polícia.'],{v:[1000,5000]}],
]);
