// ===== Histórias em cadeia: trabalho e carreira =====
const TRAB=m=>!!m.job&&!m.job.hero&&!m.job.pt;
chain('chefe_abusivo',{k:'Trabalho',min:18,max:65,who:'boss',when:TRAB,gap:[1,1]},{
 a:['O chefe','Meu chefe, {p}, me humilhou na frente da equipe inteira por um erro que nem foi meu.',['Engolir calad{o}|h-6 >b|Fui ao banheiro e respirei fundo.','Responder na hora|?k bond-10 >c|A equipe ficou do meu lado.|bond-15 perf-8 >c|Foi pior. Agora estou marcad{o}.','Falar com {ele} depois, em particular|?50 bond+8 >e|{p} pediu desculpas, sem jeito.|bond-5 >b|{Ele} disse que eu estava exagerando.']],
 b:['De novo','{p} continua gritando com todo mundo. A equipe está adoecendo.',['Juntar provas|sm+2 >c|Gravações, e-mails e testemunhas.','Pedir transferência de setor|?50 h+6|Mudei de setor. Paz.|h-4 >d|Negaram a transferência.']],
 c:['O RH','Levei o caso para o RH.',['Apresentar as provas|?55 k+5 h+10 >e|Abriram uma investigação. {p} foi afastad{o2}.|h-8 perf-5 >d|O RH arquivou. Agora {p} sabe.','Desistir no último minuto|h-4 >d|Medo de perder o emprego.']],
 d:['Esgotamento','Acordo com o estômago embrulhado só de pensar no trabalho.',['Pedir demissão|fire h+8 >f|Saí pela porta da frente, com a cabeça erguida.','Procurar terapia e aguentar|$-1600 h+4 >e@1|A terapia me ajudou a colocar limites.','Ignorar os sinais|?40 >e@1|Aguentei.|dis:burnout h-10 >f|Meu corpo parou. Burnout.']],
 e:['A virada','A empresa mudou a gestão. {p} foi substituíd{o2}.',['Me candidatar à vaga|?perf promo h+12|Agora quem coordena a equipe sou eu. Prometi nunca ser como {p}.|h+3|Não fui escolhid{o}, mas o clima melhorou muito.','Só aproveitar a paz|h+8|O escritório até ficou mais silencioso.']],
 f:['Recomeço','Longe daquele ambiente, percebi o tamanho do peso que eu carregava.',['Procurar um lugar melhor|h+6 sm+2|Agora pergunto sobre a cultura da empresa na entrevista.','Tirar um tempo para mim|h+10 $-3000|Viajei, dormi e voltei a sorrir.']],
});
chain('fraude_empresa',{k:'Trabalho',min:22,max:65,when:TRAB,v:[20000,80000],gap:[1,1]},{
 a:['Os números não batem','Revisando uma planilha, percebi que alguém da diretoria está desviando dinheiro da empresa.',['Investigar mais|sm+2 >b|Copiei os arquivos num pen drive.','Fingir que não vi|k-3 >e@2|Melhor não me envolver.']],
 b:['A prova','Achei a prova: contratos falsos assinados por um diretor.',['Denunciar ao conselho|>c|Marquei uma reunião com o presidente do conselho.','Denunciar anonimamente à polícia|k+6 >d|Mandei tudo por um canal de denúncia.','Usar para chantagear o diretor|k-15 ?40 $+v >f|Ele pagou para eu ficar quiet{o}.|arrest:extorsão:1:4|Ele me denunciou primeiro.']],
 c:['A reunião','O presidente do conselho ouviu tudo em silêncio.',['Mostrar as provas|?55 k+8 f+3 promo >g|O diretor foi demitido. Fui promovid{o}!|fire k+5 h-10 >g|O diretor era amigo do presidente. Fui eu que saí.']],
 d:['A operação','A polícia fez uma operação na empresa. Saiu no jornal.',['Depor como testemunha|k+5 f+2 >g|Contei tudo. O diretor foi preso.','Ficar no anonimato|k+3 >g|Ninguém soube que fui eu.']],
 e:['O escândalo','Dois anos depois, o desvio estourou nos jornais. A empresa está quebrando.',['Sair antes de afundar|?50 h+4|Arrumei outro emprego a tempo.|fire h-8|A empresa fechou e fiquei sem nada.','Ficar até o fim|fire h-6 k+2|Apaguei a luz do escritório na última noite.']],
 f:['Dinheiro sujo','O dinheiro da chantagem pesa na consciência.',['Gastar sem pensar|h+6 k-4|Viagem cara para esquecer.','Doar parte para caridade|k+6 $-5000|Tentei limpar a consciência.']],
 g:['Integridade','Ganhei fama de pessoa íntegra no mercado.',['Usar a fama a meu favor|raise+15 h+6|Recebi propostas melhores.','Seguir discret{o}|k+3 h+4|Fiz o certo. Isso basta.']],
});
chain('headhunter',{k:'Carreira',min:23,max:60,when:TRAB,gap:[1,1]},{
 a:['A proposta','Uma recrutadora me ligou: uma concorrente quer me contratar ganhando 30% a mais.',['Aceitar a entrevista|>b|Marquei no horário do almoço, escondid{o}.','Recusar de cara|k+2|Estou feliz onde estou.']],
 b:['A oferta','A concorrente fez a oferta por escrito.',['Usar para pedir aumento onde estou|?perf raise+20 h+8|Meu chefe cobriu a oferta.|perf-6 >c|Meu chefe ficou ofendido.','Aceitar a oferta|raise+30 h+8 >d|Pedi demissão e mudei de empresa.']],
 c:['Clima ruim','Depois que meu chefe soube da proposta, me tratam como traidor{a}.',['Ir para a concorrente|raise+30 >d|Ainda dava tempo.','Ficar e recuperar a confiança|perf+8 k+3|Trabalhei dobrado por meses.']],
 d:['Empresa nova','A empresa nova paga melhor, mas cobra o dobro.',['Mostrar serviço|perf+10 >e@1|Primeiro a chegar, último a sair.','Ir no meu ritmo|h+4 >e@1|Ganhar mais não significa viver para o trabalho.']],
 e:['Valeu a pena?','Um ano depois da troca, faço o balanço.',['Valeu|?perf promo h+8|Fui promovid{o} no primeiro ano.|h+4|Ganho mais e aprendi muito.','Sinto falta da antiga|h-4|Às vezes o dinheiro não compensa.']],
});
chain('romance_trabalho',{k:'Amor',min:20,max:55,who:'colega',when:m=>TRAB(m)&&!partners().length,gap:[1,1]},{
 a:['Olhares no escritório','Comecei a perceber que {p}, do trabalho, sempre aparece na copa quando eu chego.',['Puxar conversa no café|bond+8 >b|Falamos de tudo, menos de trabalho.','Manter o profissionalismo|>e|Trabalho é trabalho.']],
 b:['O happy hour','Fomos ao happy hour da equipe e acabamos conversando sozinhos até o bar fechar.',['Chamar para sair de verdade|?lk vira:namoro h+12 >c|Começamos a namorar, em segredo.|bond-5 >e|{p} disse que não mistura trabalho e amor.','Deixar acontecer naturalmente|bond+6 >c@0|Sem pressa.']],
 c:['Segredo de escritório','Ninguém na empresa sabe do nosso namoro. Ainda.',['Contar para o chefe|?50 h+6 >d|A chefia riu: "Todo mundo já sabia."|perf-6 >d|A empresa não gostou. Tivemos que mudar de setor.','Continuar escondendo|?40 h+4 >d|Sobrevivemos a uma festa de fim de ano inteira sem sermos descobertos.|h-6 >d|Fomos flagrados no estacionamento.']],
 d:['Casal de escritório','Agora somos o casal oficial da empresa.',['Pensar em algo sério|noivar h+10 bond+10|O pedido foi na sala de reuniões. Brega e perfeito.','Manter leve|h+5 bond+5|Um dia de cada vez.']],
 e:['Só colegas','Seguimos colegas. Às vezes fico imaginando.',['Seguir em frente|h+2|Profissionalismo acima de tudo.','Tentar de novo no futuro|>b@2|Quem sabe.']],
});
chain('greve',{k:'Trabalho',min:18,max:65,when:TRAB,gap:[1,1]},{
 a:['A greve','O sindicato convocou greve por reajuste salarial.',['Aderir|k+3 >b|Fui para a porta da empresa com um cartaz.','Furar a greve|perf+6 k-4 >c|Fui trabalhar. Fui xingad{o} na entrada.','Ficar em casa sem tomar partido|h+2 >b|Neutralidade. Ou covardia?']],
 b:['Uma semana parados','A empresa ameaça descontar os dias parados.',['Continuar firme|?50 raise+10 h+8 >d|A empresa cedeu! Reajuste conquistado.|$-2000 h-6 >d|Cortaram o ponto. A greve acabou sem nada.','Voltar ao trabalho|>c|Precisava do dinheiro.']],
 c:['Fura-greve','Os colegas que fizeram greve me olham torto.',['Pedir desculpas|k+3 >d|Alguns entenderam.','Não ligar|h-3 >d|Paguei minhas contas. É o que importa.']],
 d:['Depois da greve','A empresa voltou ao normal, mas as relações mudaram.',['Entrar para o sindicato|k+4 >e@1|Agora sou eu que organizo as assembleias.','Seguir como antes|h+2|Página virada.']],
 e:['Liderança sindical','Os colegas querem que eu seja representante dos trabalhadores.',['Aceitar|f+3 k+5 perf-4|Agora negocio diretamente com a diretoria.','Recusar|h+2|Não tenho perfil para isso.']],
});
chain('erro_grave',{k:'Trabalho',min:20,max:65,when:TRAB,v:[5000,30000],gap:[1,1]},{
 a:['O erro','Cometi um erro grave no trabalho. A empresa perdeu {v} por minha causa.',['Assumir na hora|k+6 perf-8 >b|Fui direto à sala do chefe.','Tentar consertar escondido|?40 >c|Consegui consertar antes de alguém perceber.|perf-15 k-6 >d|Descobriram. E descobriram que eu escondi.']],
 b:['A conversa','Meu chefe ficou em silêncio por um minuto inteiro.',['Propor um plano para recuperar o prejuízo|?sm perf+10 >e|A chefia gostou da atitude.|perf-5 >e|Não convenci.','Pedir desculpas e esperar|perf-3 >e|A espera foi a pior parte.']],
 c:['O segredo','Ninguém soube do erro. Mas eu sei.',['Contar mesmo assim|k+8 perf-3 >e|Me respeitaram ainda mais.','Guardar para sempre|k-3 h-4|Às vezes ainda sonho com aquilo.']],
 d:['Demissão por justa causa?','O RH está avaliando o meu caso.',['Lutar para ficar|?k perf-10 >e|Fiquei, com advertência.|fire h-12|Fui demitid{o}.','Pedir demissão antes|fire h-6|Saí antes de ser mandad{o} embora.']],
 e:['Aprendizado','Aquele erro me ensinou mais do que muitos acertos.',['Criar um processo para ninguém repetir|perf+8 sm+3|Virou um protocolo oficial na empresa.','Seguir em frente|h+3|Errar faz parte.']],
});
chain('estagiario',{k:'Trabalho',min:26,max:60,npc:1,age:[-10,-4],when:TRAB,gap:[1,2]},{
 a:['Gente nova','A empresa contratou {p} como estagiári{o2} e me deixou responsável pelo treinamento.',['Ensinar tudo com paciência|k+5 >b|{p} anota tudo num caderninho.','Delegar o trabalho chato|perf+3 k-2 >c|Afinal, para que serve estagiário?']],
 b:['O talento','{p} é brilhante. Em seis meses já resolve coisas que eu levaria semanas.',['Defender a contratação|k+4 vira:colegaT >d|{p} foi efetivad{o2}!','Ficar com medo de ser superad{o}|h-4 >c|E se {ele} pegar o meu lugar?']],
 c:['O ressentimento','{p} pediu para trocar de mentor.',['Pedir desculpas|k+4 >b|Recomeçamos do jeito certo.','Deixar {ele} ir|h-2|{p} foi para outra equipe.']],
 d:['Os anos passaram','{p} cresceu rápido na empresa. Muito rápido.',['Torcer|k+3 >e@2|Gosto de ver alguém que eu ensinei voar.','Competir|perf+6 >e@2|Ninguém passa por cima de mim.']],
 e:['O novo chefe','{p} foi promovid{o2} e agora é meu chefe.',['Aceitar com elegância|?k h+6 raise+10|{p} lembrou de quem ensinou e me deu um aumento.|h-2|Estranho receber ordens de quem eu ensinei.','Pedir demissão|fire h-4|Não consegui engolir.']],
});
chain('negocio_lado',{k:'Negócios',min:22,max:60,when:TRAB,v:[2000,10000],gap:[1,1]},{
 a:['Renda extra','Comecei a vender {prod} pela internet nas horas vagas.',['Investir {v}|$-v >b|Estoque na sala de casa.','Começar pequeno|$-500 >b|Devagar e sempre.']],
 b:['As vendas','As vendas estão crescendo. Mais do que meu salário em alguns meses.',['Fazer no horário do trabalho|?40 $+v perf-6 >c|Ninguém percebeu.|perf-12 >d|Meu chefe me pegou respondendo cliente.','Separar bem as coisas|$+2000 hl-3 >c|Trabalho de dia, negócio de noite.']],
 c:['A decisão','O negócio pode crescer muito se eu me dedicar só a ele.',['Pedir demissão e empreender|fire ?50 $+v2 h+12 >e|Melhor decisão da minha vida!|$-v h-10 >e|Os primeiros meses foram desesperadores.','Manter os dois|$+3000 >e|Segurança primeiro.']],
 d:['Advertência','Levei uma advertência por cuidar do negócio no expediente.',['Parar com o negócio|h-4|Emprego primeiro.','Sair da empresa|fire >c@0|Hora de apostar.']],
 e:['Patrão de si mesm{o}','O negócio virou minha principal fonte de renda.',['Contratar alguém|$+5000 sm+2 h+6|Primeiro funcionário. Agora sou chefe.','Continuar sozinh{o}|$+3000 hl-3|Faço tudo. Durmo pouco.']],
});
chain('viagem_negocios',{k:'Trabalho',min:23,max:60,when:TRAB,npc:1,gap:[1,1]},{
 a:['Viagem a trabalho','A empresa vai me mandar para uma feira internacional em {lugar}.',['Ir|h+6 >b|Primeira viagem paga pela empresa. Hotel com café da manhã.','Mandar outra pessoa|perf-3|Perdi a chance.']],
 b:['O cliente difícil','Na feira, um cliente enorme está prestes a fechar com a concorrência.',['Apresentar nossa proposta com tudo|?sm perf+12 >c|Fechei o maior contrato do ano!|perf-3 >d|Não deu.','Convidar {p}, o comprador, para jantar|$-800 ?lk perf+10 vira:amigo >c|O jantar selou o negócio.|>d|Foi agradável, mas não fechou.']],
 c:['Herói da empresa','Voltei como herói. O presidente mandou um e-mail para todo mundo me elogiando.',['Pedir um aumento agora|?perf raise+15 h+8|Aumento aprovado na hora.|h+3|Disseram que vão "avaliar".','Curtir o momento|h+8 f+1|Saboreei cada parabéns.']],
 d:['Volta de mãos vazias','Voltei sem o contrato, mas com muitos contatos.',['Seguir os contatos|?40 perf+8|Um dos contatos virou cliente meses depois.|h+1|Nenhum deu em nada.','Aprender com o erro|sm+3|Na próxima feira vou mais preparad{o}.']],
});
chain('demissao_massa',{k:'Trabalho',min:20,max:65,when:TRAB,gap:[1,1]},{
 a:['Rumores','Rumores de que a empresa vai cortar um terço dos funcionários.',['Trabalhar dobrado para mostrar serviço|perf+10 hl-3 >b|Primeir{o} a chegar, últim{o} a sair.','Atualizar o currículo em segredo|sm+1 >c|Melhor prevenir.','Não acreditar|>b|Sempre tem esse boato.']],
 b:['A lista','Saiu a lista dos demitidos.',['Abrir o e-mail|?perf h+8 >d|Meu nome não estava lá. Alívio e culpa ao mesmo tempo.|fire h-12 $+8000 >e|Meu nome estava. Recebi a rescisão.']],
 c:['Entrevistas','Fiz algumas entrevistas em segredo.',['Aceitar uma vaga antes do corte|raise+5 h+6|Mudei de emprego antes da tempestade.','Esperar para ver|>b|Vai que não sou cortad{o}.']],
 d:['Os que ficaram','Fiquei, mas agora faço o trabalho de três pessoas.',['Pedir aumento|?perf raise+12|Conseguiram me dar um pouco.|h-4|Disseram que "não é o momento".','Aguentar|hl-3 perf+6|Pelo menos tenho emprego.']],
 e:['Recomeço forçado','Com a rescisão no bolso, preciso decidir o que fazer.',['Procurar emprego já|sm+2 h+2|Mandei cinquenta currículos.','Tirar um tempo e fazer um curso|sm+5 h+6|Voltei ao mercado mais qualificad{o}.','Abrir um negócio com a rescisão|+cad:food_truck h+5|Hora de ser meu próprio chefe.']],
});
chain('mentor_carreira',{k:'Carreira',min:22,max:40,npc:1,age:[15,30],when:TRAB,gap:[1,2]},{
 a:['Um conselho','{p}, uma pessoa experiente da empresa, me viu apresentando e disse que eu tenho futuro.',['Pedir para {ele} me orientar|>b|{p} aceitou: almoço a cada quinze dias.','Agradecer e seguir|h+2|Elogio guardado.']],
 b:['As lições','{p} me ensinou a negociar, a ouvir e a não aceitar a primeira proposta.',['Colocar tudo em prática|sm+4 perf+6 >c|Comecei a ser notad{o}.','Achar tudo muito teórico|>c|Ouvi, mas não apliquei.']],
 c:['A indicação','{p} me indicou para liderar um projeto importante.',['Aceitar o desafio|?perf promo h+10 >d|O projeto foi um sucesso!|perf-6 >d|Atrasou. Aprendi muito.','Recusar por insegurança|h-4 >d|{p} ficou decepcionad{o2}.']],
 d:['A aposentadoria de {p}','{p} vai se aposentar e me chamou para um último almoço.',['Agradecer de coração|h+6 k+3 vira:amigo|Prometi fazer pelos outros o que {ele} fez por mim.','Pedir um último conselho|sm+3 vira:amigo|"Nunca pare de aprender." Clichê, mas verdadeiro.']],
});
chain('acidente_trabalho',{k:'Trabalho',min:18,max:65,when:TRAB,gap:[1,1]},{
 a:['O acidente','Escorreguei numa área molhada sem sinalização no trabalho e machuquei as costas.',['Ir ao médico da empresa|hl-6 >b|Atestado de uma semana.','Continuar trabalhando|hl-10 perf+3 >c|Tomei um analgésico e voltei para a mesa.']],
 b:['O processo','Um advogado disse que eu tenho direito a indenização.',['Processar a empresa|?50 $+15000 perf-10 >d|Ganhei a causa.|perf-12 >d|Perdi a causa e o clima ficou péssimo.','Deixar para lá|k+2|Não quero confusão.']],
 c:['Piorou','A dor nas costas ficou crônica.',['Fazer fisioterapia|$-2000 hl+6|Melhorei bastante.','Ignorar|hl-8|Agora dói até para dormir.']],
 d:['As mudanças','Depois do meu caso, a empresa colocou sinalização em todo lugar.',['Sentir orgulho|k+4|Pelo menos ninguém mais vai cair ali.','Pedir para sair|fire h+3|Não dava mais para ficar.']],
});
chain('promocao_disputa',{k:'Carreira',min:22,max:60,who:'colega',when:TRAB,gap:[1,1]},{
 a:['A vaga de coordenação','Abriu uma vaga de coordenação. Eu e {p} somos os favoritos.',['Competir limpo|perf+6 >b|Que vença o melhor.','Fazer acordo com {p}|bond+8 >c|Combinamos: quem ganhar ajuda o outro.','Sabotar {p}|k-10 ?50 perf+6 >b|Ninguém soube.|k-6 vira:inimigo >d|{p} descobriu.']],
 b:['A decisão','A diretoria anunciou quem ficou com a vaga.',['Ouvir o anúncio|?perf promo h+12 >e|Fui eu!|h-8 >f|Foi {p}.']],
 c:['O pacto','A diretoria escolheu.',['Ouvir o anúncio|?perf promo h+12 bond+5 >e|Fui eu. Cumpri o pacto e trouxe {p} para perto.|h-4 bond+8 >f|Foi {p}. {Ele} cumpriu o pacto e me deu os melhores projetos.']],
 d:['Inimigos','{p} agora faz de tudo para me prejudicar.',['Pedir desculpas|?k bond+10 k+4|Fizemos as pazes.|h-4|Não aceitou.','Revidar|k-4 perf-4 h-4|Guerra fria no escritório.']],
 e:['Coordenador{a}','Agora coordeno a equipe, incluindo {p}.',['Ser just{o} com {ele}|k+5 bond+6|Viramos uma ótima dupla.','Mostrar quem manda|bond-10 h+2|O poder subiu à cabeça.']],
 f:['A derrota','Ver {p} na cadeira que eu queria dói.',['Dar parabéns de verdade|k+5 bond+8|{p} ficou emocionad{o2}.','Procurar emprego em outro lugar|+cad:headhunter h-2|Talvez minha vez seja em outra empresa.']],
});
