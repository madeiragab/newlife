// ===== Superpoderes (parte 3): equipe como emprego, Lei de Registro, identidade, família e amor =====
const HT=id=>HW(sc=>{ const t=hTeam(); return !!t&&(!id||t===HTEAMS[id]); });
// ---------- convites para equipes ----------
pack({k:'Carreira de herói',w:1.3,cd:40,scen:'heroi',when:HW(()=>true)},[
  ['Olheiro dos Sentinelas','Um herói mascarado deixa um cartão na sua janela: "Os Sentinelas do Sul precisam de gente como você. Sem governo, sem registro."',['Aceitar|hteam:sentinelas crew|Assinei com tinta invisível. {n} será meu parceiro de ronda.','Recusar|h+0|Ainda não.'],{when:HW(sc=>!hTeam()&&sc.rep>=25&&!sc.hEx.sentinelas)}],
  ['Proposta da Vértice Corp','A Vértice Corp oferece um contrato milionário: salário alto, traje novo e o logotipo da empresa no peito.',['Assinar|hteam:vertice sc.traje+1|Agora sou herói de empresa. O traje tem até bolso para o crachá.','Recusar|rep+3|Não sou outdoor.'],{when:HW(sc=>!hTeam()&&sc.rep>=25&&sc.reg!=='nao'&&!sc.hEx.vertice)}],
  ['Convocação da Liga Guardiã','A Liga Guardiã manda um holograma: querem {codinome} na equipe mais famosa do país.',['Aceitar|hteam:liga f+6|Entrei para a Liga! Minha foto já está no mural do quartel-general.','Recusar|rep+4 h+2|Recusei a Liga. Os jornais não acreditaram.'],{when:HW(sc=>!hTeam()&&sc.rep>=55&&sc.reg!=='nao'&&!sc.hEx.liga)}],
  ['Recrutamento do governo','Dois agentes de terno esperam você no estacionamento: a Agência Federal de Contenção quer você. Com uma condição: entregar sua identidade.',['Aceitar|hteam:afc|Assinei. Agora tenho distintivo, salário e um arquivo com meu nome verdadeiro.','Recusar|sec+4|Os agentes anotaram alguma coisa e foram embora.'],{when:HW(sc=>!hTeam()&&sc.reg!=='nao'&&!sc.hEx.afc)}],
]);
// ---------- dia a dia na equipe ----------
pack({k:'Carreira de herói',w:1.2,cd:30,scen:'heroi',when:HT()},[
  ['Primeiro dia','No primeiro dia na {equipe}, o líder te apresenta como "a nova aposta".',['Fazer um discurso|?car hperf+8 rep+4|Aplaudiram.|hperf-4|Gaguejei.','Só acenar|hperf+2|Discreto.']],
  ['Missão em equipe','A {equipe} é chamada para conter um supervilão no centro.',['Seguir o plano do líder|?pwr hperf+10 rep+6|Funcionou como no treino.|hl-10 hperf+2|Funcionou, mas apanhei.','Improvisar sozinh{o}|?sc.pw hperf+4 rep+10|Deu certo, mas o líder ficou irritado.|hperf-12 hl-12|Atrapalhei a equipe inteira.']],
  ['Colega folgado','Um colega da {equipe} vive se aproveitando do seu trabalho nas missões.',['Confrontar|?car hperf+4|Ele parou.|hperf-4|Virou fofoca no quartel.','Reclamar com o líder|hperf+2 k-2|O líder chamou a atenção dele.','Deixar para lá|h-4|Engoli.']],
  ['Avaliação de desempenho','O líder da {equipe} faz a avaliação trimestral.',['Mostrar as estatísticas de resgate|?perf hperf+10 $+3000|Ganhei elogio e um bônus.|hperf-6|Os números não ajudaram.','Pedir um aumento ali mesmo|?perf raise+8 hperf+2|Aumento aprovado!|hperf-8|Pegou mal.']],
  ['Promoção na equipe','O líder da {equipe} quer promover alguém. Você ou um colega.',['Lutar pela vaga|?perf hpromo h+8|A vaga é minha!|h-6|Ficou com o colega.','Indicar o colega|k+6 hperf+4|O colega nunca vai esquecer.']],
  ['Conflito de agenda','A {equipe} marcou um treino obrigatório no mesmo horário do aniversário de alguém da família.',['Ir ao treino|hperf+8 h-6|Treinei. A família guardou um pedaço de bolo.','Ir ao aniversário|hperf-8 h+8|O líder anotou a falta.']],
  ['Uniforme novo','A {equipe} lançou um uniforme novo. É horroroso.',['Usar sem reclamar|hperf+4 h-4|Fiquei parecendo um sofá.','Customizar o seu|?car h+6|Ficou melhor. O líder fingiu não ver.|hperf-6|Levei advertência.']],
  ['Herói veterano','Um veterano da {equipe} se oferece para ser seu mentor.',['Aceitar|pw+6 hperf+6|Aprendi truques que nenhum manual ensina.','Recusar|h+0|Prefiro aprender sozinh{o}.']],
  ['Missão secreta','O líder te escala para uma missão secreta fora do país.',['Ir|?pwr hperf+15 $+8000 pista+10|Voltei sem um arranhão e com um bônus.|hl-18 hperf+4|Voltei com o braço na tipoia.','Recusar|hperf-10|O líder ficou decepcionado.']],
  ['Folga cancelada','Sua folga foi cancelada: crise na cidade.',['Ir trabalhar|hperf+8 h-6|O trabalho de herói não tem feriado.','Faltar|hperf-12 h+6|Fiquei em casa. A cidade sobreviveu sem mim.']],
  ['Erro na missão','Um prédio desabou durante uma missão da {equipe} e culparam você.',['Assumir a culpa|hperf-6 k+6 rep+2|Honestidade conta.','Provar que não foi você|?sm hperf+6|As câmeras me inocentaram.|hperf-12|Não consegui provar.']],
  ['Festa da equipe','A {equipe} faz uma festa no quartel-general.',['Ir e dançar|hperf+4 h+8|Os heróis dançam muito mal.','Ir embora cedo|h+2|Discreto.']],
  ['Herói lesionado','Você se machucou feio e precisa de afastamento médico.',['Tirar licença|hl+20 hperf-6|Voltei inteir{o}.','Trabalhar machucad{o}|hl-10 hperf+8|Heroico. E burro.']],
  ['Quebra de protocolo','Você salvou uma criança ignorando ordens diretas do líder.',['Defender sua decisão|?car hperf+4 k+6|O líder acabou concordando.|hperf-12|Levei uma suspensão.','Pedir desculpas|hperf-2 k+4|A criança está viva. Vale a bronca.']],
  ['Herói do mês','Você foi eleit{o} herói do mês da {equipe}.',['Agradecer|hperf+6 h+10 f+3|Minha foto está na parede do refeitório.','Dividir o prêmio|k+4 hperf+4|Dividi com quem ajudou.']],
  ['Demissão em massa','A {equipe} está cortando gastos e vai demitir heróis.',['Mostrar serviço|?perf hperf+8|Mantive meu lugar.|hfire|Fui cortad{o}.','Pedir demissão antes|hfire h-4|Saí antes de me demitirem.']],
]);
pack({k:'Carreira de herói',w:1.3,cd:30,scen:'heroi',when:HT('vertice')},[
  ['Comercial de cereal','A Vértice Corp quer você num comercial de cereal, voando com uma tigela na mão.',['Gravar|$+15000 rep-4 f+4|O comercial bombou. Ninguém mais me leva a sério.','Recusar|hperf-12|O diretor de marketing anotou meu nome.']],
  ['Ordem estranha','A diretoria da Vértice pede que você "não atenda" um assalto num banco concorrente.',['Obedecer|hperf+10 k-10 rep-6|O banco foi roubado. As ações da Vértice subiram.','Atender mesmo assim|hperf-15 k+8 rep+8|Salvei o banco. A diretoria me chamou na sala.']],
  ['Bônus por curtida','Seu bônus agora depende de curtidas nas redes da empresa.',['Postar fotos heroicas|hperf+8 sec-6 follow+5000|Bombou. Meio exposto, mas bombou.','Ignorar|hperf-6|Metas não batidas.']],
  ['Escândalo corporativo','A Vértice Corp é acusada de criar os próprios vilões para vender proteção.',['Investigar por dentro|?sm pista+20 hfire k+10|Era verdade. Vazei tudo e fui demitid{o}.|hperf-8|Não achei nada.','Ficar quiet{o}|$+20000 k-8|Ganhei um bônus de silêncio.']],
]);
pack({k:'Carreira de herói',w:1.3,cd:30,scen:'heroi',when:HT('afc')},[
  ['Caçar um colega','A Agência manda você prender um herói que não se registrou. É alguém que já salvou sua vida.',['Cumprir a ordem|hperf+12 k-10|Prendi. Ele me olhou o tempo todo.','Deixar escapar|?sm k+8|Ele fugiu. Ninguém desconfiou.|hfire k+8|Descobriram.']],
  ['Arquivo confidencial','Você vê no sistema da Agência o arquivo completo de {inimigo}.',['Copiar|?sm pista+25|Copiei sem deixar rastro.|hperf-15|Fui pego. Advertência grave.','Respeitar o protocolo|hperf+6|Bom agente.']],
  ['Distintivo','Seu distintivo da Agência abre portas, mas metade dos heróis te chama de traíra.',['Usar o distintivo com orgulho|hperf+6 rep-4|A lei é a lei.','Esconder o distintivo|rep+2|Prefiro não arrumar briga.']],
]);
pack({k:'Carreira de herói',w:1.3,cd:30,scen:'heroi',when:HT('sentinelas')},[
  ['Rede de esconderijos','Os Sentinelas mostram uma rede de túneis para heróis sem registro.',['Ajudar a ampliar|hperf+8 proc-10|Agora há mais lugares para se esconder.','Só decorar o mapa|proc-4|Pode ser útil.']],
  ['Resgate de preso','Os Sentinelas planejam tirar um herói da prisão da Agência.',['Participar|?pwr hperf+12 rep+6 proc+15|Ele está livre. E eu, mais procurad{o}.|hl-15 proc+20|Deu errado. Escapei por pouco.','Ficar de fora|hperf-10|Os Sentinelas anotaram.']],
]);
// ---------- Lei de Registro ----------
pack({k:'Lei de Registro',w:1.2,cd:40,scen:'heroi',when:HW(sc=>!sc.reg||sc.reg==='votando'||sc.reg==='prazo')},[
  ['Debate na TV','Um deputado diz na TV que "heróis mascarados são milícias com capa".',['Ligar para o programa disfarçad{o}|?car rep+6|Ganhei o debate.|rep-4|Perdi a linha ao vivo.','Desligar a TV|h-2|Melhor nem ouvir.']],
  ['Protesto','Milhares de pessoas vão às ruas, umas pedindo a lei, outras contra.',['Discursar contra a lei|rep+6 sec-6|Viralizou.','Discursar a favor|rep+4|Metade vaiou.','Proteger a multidão de longe|rep+4 k+4|Ninguém se feriu.']],
  ['Herói registrado','Um herói famoso se registra ao vivo, tirando a máscara. Os pais dele aparecem chorando no fundo.',['Admirar a coragem|h+2|Talvez seja o certo.','Temer pela família dele|h-4|Agora todos sabem onde ele mora.']],
  ['Pesquisa de opinião','Uma pesquisa mostra que 60% da população quer heróis registrados.',['Fazer uma ação de imagem|rep+6|Salvei um ônibus escolar na frente das câmeras.','Ignorar|h+0|Pesquisa não é lei. Ainda.']],
]);
pack({k:'Lei de Registro',w:1.3,cd:30,scen:'heroi',when:HW(sc=>sc.reg==='sim')},[
  ['Convocação obrigatória','Como herói registrado, você é convocad{o} para uma operação do governo.',['Ir|?pwr rep+6 $+4000|Missão cumprida, com nota fiscal.|hl-10|Operação mal planejada.','Faltar|$-5000 rep-6|Recebi uma multa de $5.000.']],
  ['Carta do governo','Chega uma carta com seu nome verdadeiro no envelope, endereçada a {codinome}.',['Queimar a carta|sec+4 h-2|Quem mais viu esse envelope?','Reclamar na ouvidoria|?sm sec+6|Pediram desculpas.|sec-6|Ninguém respondeu.']],
  ['Vazamento na Agência','Rumores dizem que um funcionário da Agência vende fichas de heróis para criminosos.',['Investigar|?sm pista+15 sec+6|Achei o funcionário. Preso.|sec-12|Ele achou a minha ficha primeiro.','Torcer para não ser a sua|h-4|Durmo pior agora.']],
  ['Herói de carteirinha','O governo oferece benefícios a heróis registrados: plano de saúde e aposentadoria.',['Aproveitar|hl+10 h+4|Fiz um check-up completo. De graça.','Desconfiar|h+0|Nada é de graça.']],
]);
pack({k:'Lei de Registro',w:1.4,cd:25,scen:'heroi',when:HW(sc=>sc.reg==='nao')},[
  ['Cartaz de procurado','Seu codinome está num cartaz de PROCURADO na estação de metrô.',['Arrancar os cartazes|proc+4 h+4|Arranquei uns vinte.','Fingir que não é você|sec+2|O cartaz ficou parecido demais.']],
  ['Herói sem registro','Um policial reconhece {codinome} durante um resgate. Ele hesita antes de chamar reforço.',['Pedir que ele finja que não viu|?car proc-4 k+2|Ele baixou o rádio e foi embora.|proc+12|Ele chamou o reforço.','Fugir|proc+6|Fugi antes de ele decidir.']],
  ['Vizinho dedo-duro','Um vizinho acha que sabe quem você é e ameaça ligar para a Agência.',['Convencer de que está enganado|?car proc-2|Ele ficou sem graça.|proc+15 sec-10|Ele ligou.','Ajudar o vizinho em algo|$-2000 k+4|Consertei o carro dele. Ele esqueceu do assunto.']],
  ['Oferta de anistia','O governo oferece anistia a quem se registrar esta semana, sem multa.',['Me registrar|reg:sim h+6|Acabou a perseguição. O governo sabe quem eu sou.','Continuar na resistência|rep+4 proc+4|Não vou entregar minha família de bandeja.']],
  ['Advogada dos heróis','Uma advogada se oferece para defender heróis sem registro de graça.',['Aceitar|proc-10 k+2|Ela conseguiu suspender dois mandados contra mim.','Recusar|h+0|Não confio em ninguém.']],
  ['Hospital sem nome','Você está ferid{o}, mas não pode ir ao hospital sem documento.',['Ir a um médico clandestino|$-3000 hl+20|Me costuraram numa garagem.','Se tratar sozinh{o}|hl+6 h-4|Doeu muito.']],
  ['Caçador de recompensas','Um caçador de recompensas está atrás de você pela recompensa do governo.',['Enfrentar|?pwr proc+6 rep+4|Deixei ele amarrado num poste com um laço.|hl-15|Ele era bom.','Despistar|?sc.pw proc-6|Sumi no metrô.|hl-8|Me alcançou numa escada.']],
  ['Colega preso','Um herói amigo foi preso por não se registrar.',['Planejar o resgate|?pwr proc+15 rep+8 crew|Tirei ele da cadeia. {n} agora anda comigo.|hl-20 proc+20|Não deu. Quase fui pres{o} junto.','Visitar como civil|h-4 sec-4|Ele me pediu para não desistir.']],
  ['Herói da resistência','Um grupo de jovens pinta murais com seu codinome: "Herói não se registra".',['Agradecer em segredo|rep+6 h+6|Deixei um bilhete no mural.','Pedir que parem|rep-2 proc-4|Eles estão se arriscando por mim.']],
  ['Barreira policial','A polícia monta blitz com detectores de poder em toda a cidade.',['Ficar em casa|proc-6 crime+6|A cidade ficou sem herói por um dia.','Passar mesmo assim|?sc.pw proc+2|Passei controlando o poder.|proc+15 hl-6|O detector apitou. Fugi correndo.']],
]);
// ---------- identidade secreta ----------
pack({k:'Identidade secreta',w:1.2,cd:30,scen:'heroi',when:HW(sc=>!sc.rev)},[
  ['Quase pego','Você chega em casa pela janela e dá de cara com alguém da família na sala.',['Inventar que estava fazendo yoga no parapeito|?car sec+4 h+4|Colou. Acho.|sec-12|Ninguém acreditou.','Contar a verdade|sec-6 h+4|Agora tem mais alguém guardando meu segredo.']],
  ['Teoria da conspiração','Um blogueiro publica uma lista de 10 suspeitos de ser {codinome}. Você é o número 3.',['Processar o blog|$-4000 sec+6|Tiraram do ar.','Ignorar|sec-6|Os comentários estão chegando perto.','Fazer um herói "aparecer" enquanto você está em público|?sm sec+15|Um aliado se fantasiou de mim. Perfeito.|sec-10|Deu muito errado.']],
  ['Teste de DNA','A polícia coletou seu sangue numa cena de batalha.',['Invadir o laboratório|?sc.pw sec+10 k-4|Troquei a amostra.|sec-15 proc+10|O alarme disparou.','Rezar|sec-8|Agora é questão de tempo.']],
  ['Voz conhecida','Alguém do trabalho comenta que a voz de {codinome} é "igualzinha à sua".',['Fazer voz fina o resto do dia|sec+2 h-2|Ficou estranho, mas funcionou.','Rir junto|?car sec+4|Todo mundo riu.|sec-6|Ficou um silêncio.']],
  ['Chantagem','Um bandido descobriu quem você é e pede dinheiro para ficar calado.',['Pagar|$-20000 sec+10|Pago agora. Pago para sempre?','Ameaçar|?pwr sec+6 k-4|Ele entendeu o recado.|sec-25|Ele espalhou para todo mundo.','Prender o chantagista|?sm sec+8 rep+4|Achei provas de outros crimes.|sec-20|Ele contou tudo ao delegado.']],
  ['Ferimento difícil de explicar','Você acorda com um olho roxo e tem reunião de trabalho.',['Maquiagem|?40 sec+4|Ficou perfeito.|sec-4|Ficou pior.','Dizer que caiu da escada|sec+0|Clássico.']],
  ['Foto no celular','Uma criança tirou uma foto sua trocando de roupa num beco.',['Pedir com jeitinho para apagar|?car sec+8 k+2|Ela apagou em troca de um autógrafo.|sec-15|Ela postou.','Deixar|sec-12|A foto está borrada. Mas não muito.']],
]);
pack({k:'Identidade secreta',w:1.2,cd:30,scen:'heroi',when:HW(sc=>!sc.rev),who:'parent'},[
  ['{p} desconfia','{p} percebeu que você some sempre que aparece {codinome} na TV.',['Contar a verdade|sab bond+10 h+6|{p} me abraçou e disse que sempre soube que eu era especial.','Negar|bond-4 sec+2|{p} fingiu que acreditou.']],
  ['Almoço de domingo','{p} quer almoço de família todo domingo, sem desculpas.',['Ir|bond+10 h+8 crime+5|Comi lasanha. A cidade se virou.','Faltar por causa de uma missão|bond-8 rep+4|{p} deixou o prato no forno mesmo assim.']],
]);
// ---------- identidade revelada ----------
pack({k:'Identidade revelada',w:1.4,cd:25,scen:'heroi',when:HW(sc=>!!sc.rev)},[
  ['Repórteres na porta','Há repórteres acampados na porta da sua casa há três dias.',['Dar uma entrevista para eles irem embora|rep+4 h-2|Foram embora. Voltaram no dia seguinte.','Sair pela janela|h-2|Vivo como um fugitivo na própria casa.']],
  ['Ameaças nas redes','Você recebe centenas de ameaças contra sua família nas redes sociais.',['Denunciar à polícia|?50 h+2|Prenderam dois.|h-6|Nada aconteceu.','Apagar as contas|h+2 follow-5000|Silêncio. Melhor assim.']],
  ['Fã obsessivo','Um fã sabe seu endereço e aparece todo dia com presentes.',['Conversar com ele|?car k+4 h+2|Ele entendeu e prometeu parar.|h-4|Ele voltou no dia seguinte.','Chamar a polícia|h+0|Agora ele tem medida protetiva.']],
  ['Ataque à casa','Alguém pichou "TRAIDOR" no muro da sua casa e quebrou as janelas.',['Consertar e seguir|$-3000 h-4|Janelas novas. Paciência velha.','Mudar de casa|$-15000 h+4|Endereço novo. Por enquanto, ninguém sabe.']],
  ['Vida normal impossível','Você não consegue mais ir ao mercado sem ser cercad{o} por pessoas pedindo selfie.',['Tirar foto com todo mundo|rep+6 h-4|Duzentas selfies e um pacote de arroz.','Pedir delivery para sempre|h-2|Ficou caro.']],
  ['Vilão no portão','Um capanga de {inimigo} deixa um envelope no seu portão: fotos de toda a sua família.',['Esconder todo mundo|esc h-4|Mandei todos para fora da cidade.','Ir atrás de {inimigo}|?pwr pista+20 rep+4|Achei o capanga e ele falou.|hl-15|Era armadilha.']],
]);
pack({k:'Identidade revelada',w:1.4,cd:25,scen:'heroi',when:HW(sc=>!!sc.rev),who:'parent'},[
  ['{p} perdeu o emprego','{p} foi demitid{o2} porque a empresa "não quer problemas com vilões".',['Ajudar com dinheiro|$-10000 bond+12|Paguei as contas do mês.','Pedir desculpas|bond+4 h-6|Não foi culpa minha, mas é por minha causa.']],
  ['{p} ameaçad{o2}','{p} recebeu um telefonema de alguém que sabia tudo sobre a rotina da família.',['Levar {p} para um esconderijo|esc bond-4|Seguro, mas longe de casa.','Ficar de guarda|?pwr bond+8|Ninguém apareceu.|famhurt|Apareceram. Cheguei tarde.']],
]);
pack({k:'Identidade revelada',w:1.4,cd:25,scen:'heroi',when:HW(sc=>!!sc.rev),who:'child'},[
  ['{p} sofre na escola','{p} sofre perseguição na escola por ser filh{o2} de {codinome}.',['Mudar de escola|$-8000 bond+8|Escola nova, sobrenome novo na lista de chamada.','Conversar com a diretora|?car bond+6|Resolveu.|bond-6|Não adiantou.']],
  ['{p} sequestrad{o2}','Capangas de {inimigo} levaram {p} da porta da escola.',['Ir resgatar agora|?pwr bond+15 rep+8|Trouxe {p} de volta sem um arranhão.|famdie|Cheguei tarde demais.','Chamar todos os aliados|?pwr+10 bond+12|Resgatamos {p} juntos.|famhurt|{p} saiu ferid{o2}.']],
]);
pack({k:'Identidade revelada',w:1.4,cd:25,scen:'heroi',when:HW(sc=>!!sc.rev),who:'sib'},[
  ['{p} usa seu nome','{p} está dando entrevistas pagas sobre "a infância de {codinome}".',['Pedir que pare|?car bond+2|Parou.|bond-10|Brigamos feio.','Deixar|h-4 sec-0|Pelo menos está ganhando dinheiro.']],
  ['{p} atacad{o2}','{p} foi atacad{o2} na saída do trabalho por gente que odeia heróis.',['Ir ao hospital|bond+10 h-4|{p} vai ficar bem. Mas disse que preferia não ser meu irmão hoje.','Caçar os agressores|?pwr rep+6 k-2|Achei todos.|hl-8|Não achei ninguém.']],
]);
// ---------- família (vida real) ----------
pack({k:'Família',w:1.1,cd:35,scen:'heroi',who:'parent',when:HW(()=>true)},[
  ['{p} doente','{p} está internad{o2} e pergunta por você.',['Visitar todos os dias|bond+12 h-4 crime+6|Segurei a mão de {p} toda tarde.','Pagar o melhor hospital|$-15000 bond+8|O melhor tratamento da cidade.']],
  ['Conselho de {p}','{p} diz que tem orgulho de você, mesmo sem saber de tudo.',['Agradecer|bond+8 h+8|Fazia tempo que eu não ouvia isso.','Desabafar|bond+10 h+6 sec-4|Falei demais, mas foi bom.']],
]);
pack({k:'Família',w:1.1,cd:35,scen:'heroi',who:'child',when:HW(()=>true)},[
  ['{p} quer ser herói','{p} amarrou uma toalha nas costas e pulou do sofá gritando "{codinome}!"',['Rir e brincar junto|bond+12 h+10|Voamos pela sala. Bom, eu voei.','Explicar que heróis correm perigo|bond+4 h-2|{p} ficou pensativ{o2}.']],
  ['Apresentação na escola','{p} tem apresentação na escola hoje, no horário da patrulha.',['Ir à apresentação|bond+12 crime+6 h+8|{p} me viu na plateia e acenou no meio da música.','Patrulhar|bond-10 rep+4|{p} procurou meu rosto na plateia.']],
]);
// ---------- amor na vida real ----------
pack({k:'Amor',w:1.3,cd:25,scen:'heroi',who:'partner',when:HW(()=>true)},[
  ['{p} desconfia','{p} acha que suas saídas no meio da noite são traição.',['Contar que é {codinome}|sab ?60 bond+12 h+6|{p} riu, chorou e me beijou. "Era isso? Achei que fosse outra pessoa."|bond-10 sec-10|{p} não acreditou e contou para as amigas que estou louc{o}.','Inventar desculpas|?car bond-2|Colou, por enquanto.|bond-15|{p} jogou minhas roupas pela janela.']],
  ['Jantar de aniversário de namoro','Hoje é aniversário de namoro com {p}, mas {inimigo} está atacando o porto.',['Ficar no jantar|bond+12 crime+8 h+6|A cidade sobreviveu. Nosso amor também.','Sair correndo|bond-12 rep+8|{p} jantou sozinh{o2}. De novo.','Resolver rápido e voltar|?sc.pw bond+8 rep+6|Voltei antes da sobremesa!|bond-8 hl-6|Voltei sujo de fuligem, duas horas depois.']],
  ['{p} em perigo','{p} estava no prédio que {inimigo} explodiu hoje.',['Salvar {p} primeiro|?pwr bond+15 rep-2|Tirei {p} dos escombros. Outros ficaram sem ajuda.|famhurt|Cheguei tarde.','Salvar todo mundo por ordem|?pwr rep+12 bond+6|Salvei todos, inclusive {p}.|famhurt rep+8|Salvei quase todos. {p} se feriu.']],
  ['{p} sabe demais','{p} sabe quem você é e vive pedindo para você usar o poder em casa.',['Usar o poder para lavar a louça|h+6 bond+8|Lavei duzentos pratos em três segundos.','Explicar que não é brinquedo|bond-4|{p} fez bico.'],{when:HW(sc=>{ const p=partner(); return !!p&&!!sc.sab[p.id]; })}],
  ['Pedido de casamento','Você pensa em pedir {p} em casamento, mas teme que vire alvo.',['Pedir mesmo assim|?55 rnoivo h+12|{p} disse sim!|bond-6|{p} disse que precisa pensar.','Esperar a paz|bond-4|Quando {inimigo} cair.'],{when:HW(()=>{ const p=partner(); return !!p&&p.rel==='namoro'; })}],
  ['Casamento de herói','{p} quer casar logo. Você quer, mas a cerimônia vai ser um alvo.',['Casar em segredo|rcasar h+15|Casamos num cartório de bairro, com dois aliados de testemunha.','Casar em grande estilo|$-30000 rcasar h+12 sec-8|Festa linda. A imprensa toda na porta.','Adiar|bond-8|{p} ficou magoad{o2}.'],{when:HW(()=>{ const p=partner(); return !!p&&p.rel==='noivo'; })}],
  ['Filho de herói','{p} quer ter um filho. Você pensa nos vilões.',['Topar|rgrav bond+10|Vamos ter um bebê!','Pedir para esperar|bond-8|{p} entendeu, mas ficou triste.'],{when:HW(sc=>{ const p=partner(); return !!p&&p.gender!==S.me.gender&&!sc.rgrav; })}],
  ['Ciúmes de aliado','{p} está com ciúmes de alguém da sua equipe.',['Apresentar os dois|?car bond+6|Viraram amigos.|bond-8|Foi um desastre.','Dizer que é só trabalho|bond-2|Meio verdade.']],
  ['Encontro sem máscara','Você e {p} conseguem um dia inteiro sem alarmes.',['Piquenique no parque|bond+12 h+10|O dia mais normal e mais feliz em meses.','Passar o dia no sofá|bond+8 h+8|Pizza, filme e celular desligado.']],
  ['{p} quer terminar','{p} diz que não aguenta mais dividir você com a cidade inteira.',['Prometer mais tempo juntos|?car bond+10|{p} me deu mais uma chance.|breakup h-15|Acabou.','Aceitar|breakup h-12|Doeu, mas eu entendo.'],{when:HW(()=>{ const p=partner(); return !!p&&p.bond<45; })}],
  ['Vilã apaixonada','Uma vilã se declarou para {codinome} ao vivo. {p} assistiu.',['Explicar|?car bond+2|{p} riu da situação.|bond-12|{p} não achou graça.','Prender a vilã na frente das câmeras|rep+8 bond+4|Recado dado.']],
  ['Viagem romântica','{p} comprou passagens para um fim de semana na praia.',['Ir|bond+14 h+12 crime+10|Dois dias sem uniforme. A cidade não acabou.','Ir, mas levar o rádio da polícia|bond+4 h+4|{p} jogou o rádio no mar.']],
]);
