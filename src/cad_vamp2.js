// ===== Histórias em cadeia: a vida de vampiro (2) =====
chain('vamp_banco_sangue',{k:'Vampiro',min:18,max:200,when:VAMP,gap:[1,1]},{
 a:['A vaga perfeita','O banco de sangue do hospital está contratando para o turno da noite.',['Me candidatar|emprego:seg >b|Fui contratad{o} na hora como segurança: ninguém quer o turno da noite.','Achar arriscado demais|h+0|Muita tentação junta.']],
 b:['A geladeira','Centenas de bolsas de sangue, a poucos metros de mim, toda noite.',['Pegar só as vencidas|fome-40 k+2 >c|Ninguém vai sentir falta do que ia para o lixo.','Pegar as boas|fome-60 k-8 >d|Sangue fresco. Perigoso.','Não tocar em nada|?will h+6 >c|Força de vontade de aço.|fome+20 >d|A sede venceu na terceira semana.']],
 c:['O colega','Um colega reparou que eu nunca como no refeitório e nunca vejo o sol.',['Fazer amizade com ele|>e|Ele também trabalha só de noite. E também nunca come.','Evitar o colega|>d|Melhor não chamar atenção.']],
 d:['A auditoria','O hospital abriu uma auditoria: estão faltando bolsas de sangue.',['Culpar um erro no sistema|?sm >f|A auditoria concluiu que foi falha de registro.|fire >f|Me demitiram por justa causa.','Pedir demissão antes|fire >f|Saí antes que me pegassem.']],
 e:['Outro vampiro','O colega também é vampiro! Viramos parceiros de turno.',['Dividir o trabalho e as bolsas vencidas|fome-30 h+8 >f|Finalmente alguém para conversar às três da manhã.','Desconfiar dele|>d|Dois vampiros no mesmo lugar chamam atenção.']],
 f:['Depois do hospital','Aprendi muito sobre sangue e sobre controle naquele emprego.',['Seguir na área da saúde|sm+3|Virei técnic{o} de laboratório noturno.','Mudar de ramo|h+3|Longe de tentação.']],
});
chain('vamp_morcego',{k:'Vampiro',min:16,max:200,when:VAMP,gap:[1,2]},{
 a:['Algo novo','Uma noite, ao pular de um telhado, meu corpo se desfez numa nuvem de morcegos.',['Aprender a controlar|>b|Levei semanas para voltar inteir{o} na primeira tentativa.','Ficar com medo e evitar|h-3 >d@2|Prefiro andar com as pernas.']],
 b:['Voando','Atravessei a cidade inteira voando como morcego.',['Explorar a noite|h+10 >c|Vi a cidade de um jeito que nenhum humano vê.','Usar para vigiar inimigos|sm+2 >c|Informação é poder.']],
 c:['Visto','Um vídeo viral mostra uma nuvem de morcegos virando uma pessoa num telhado.',['Fingir que é montagem|h-2 >d|A internet decidiu que era efeito especial.','Ignorar|f+2 >d|Virei lenda urbana.']],
 d:['Outros dons','Descobri que consigo ouvir pensamentos de quem está muito perto.',['Usar com responsabilidade|k+4 sm+3|Às vezes é melhor não saber o que os outros pensam.','Usar para ganhar dinheiro|$+8000 k-6|Nos negócios, eu sempre sei o que o outro vai oferecer.']],
});
chain('vamp_amor_humano',{k:'Vampiro',min:18,max:200,when:m=>VAMP(m)&&!partners().length,npc:1,date:1,gap:[1,1]},{
 a:['Um coração batendo','Me apaixonei por {p}, um ser humano comum. O coração d{ele} bate rápido quando está perto de mim.',['Me aproximar|vira:namoro >b|Comecei a namorar {p}, só de noite.','Me afastar para {ele} não correr perigo|h-6|Às vezes amar é ir embora.']],
 b:['Os encontros','{p} acha estranho a gente só se ver à noite e eu nunca comer.',['Inventar desculpas|?40 >c|"Trabalho de noite e faço dieta." Colou.|>d|{p} começou a desconfiar.','Contar a verdade|>d|Melhor agora do que depois.']],
 c:['O tempo','{p} está envelhecendo. Eu não.',['Pensar em transformar {p}|>e|Seria o jeito de ficarmos juntos para sempre.','Aceitar que um dia {ele} vai partir|h-6 >f|Cada dia vale mais.']],
 d:['A verdade','{p} ouviu tudo em silêncio.',['Esperar a reação|?bond pbond+10 h+10 >c|"Eu já desconfiava. E não me importo."|separar h-15|{p} foi embora com medo.']],
 e:['A escolha de {p}','Perguntei se {p} quer ser como eu.',['Respeitar a resposta|?50 morder h+15 bond+15|{p} aceitou. Agora a eternidade tem companhia.|h-4 >f|{p} quer viver e morrer como humano.']],
 f:['Uma vida inteira','Fiquei ao lado de {p} até os cabelos brancos.',['Ficar até o fim|h+10 k+8|Segurei a mão de {p} no último dia. Ninguém amou tanto.','Ir embora antes de ver|h-8|Não aguentei.']],
});
chain('vamp_identidade',{k:'Vampiro',min:30,max:200,when:VAMP,gap:[1,1]},{
 a:['Documentos vencidos','Meus documentos dizem que eu tenho sessenta anos. Meu rosto diz vinte e cinco.',['Procurar um falsificador|$-5000 >b|Um velho no porão de uma gráfica.','Viver sem documento|h-4 >d|Sem banco, sem emprego, sem nada.']],
 b:['O falsificador','O falsificador olhou para mim e disse: "Você é o terceiro como você este mês."',['Perguntar dos outros|>c|Ele me deu um endereço.','Pegar os documentos e ir embora|>e|Nova identidade na mão.']],
 c:['A rede','No endereço, uma rede de vampiros que ajuda uns aos outros com documentos, abrigo e sangue.',['Entrar para a rede|h+8 >e|Família de criaturas da noite.','Ficar sozinh{o}|>e|Prefiro não depender de ninguém.']],
 d:['Na sombra','Sem documentos, vivo de bicos e escondid{o}.',['Procurar o falsificador agora|$-5000 >b|Não dá para viver assim.','Continuar assim|h-6|Invisível.']],
 e:['Nova vida, de novo','Com nome novo, comecei mais uma vida.',['Escolher um nome bonito|h+5|Desta vez, escolhi eu mesm{o}.','Usar o nome de um antepassado|h+3|Uma homenagem discreta.']],
});
chain('vamp_tedio',{k:'Vampiro',min:40,max:200,when:VAMP,gap:[1,2]},{
 a:['O peso da eternidade','Já vi tudo, li tudo, provei tudo. A eternidade ficou pesada.',['Procurar um propósito|>b|Deve existir algo que eu ainda não fiz.','Me trancar em casa|h-10 >c|Dias sem abrir as cortinas. Que já ficam fechadas.']],
 b:['Um propósito','Decidi usar a eternidade para algo bom.',['Proteger a cidade à noite|k+8 fight+4 >d|Virei a lenda que assusta assaltantes.','Aprender todas as línguas do mundo|sm+8 >d|Já são onze.','Escrever minhas memórias|tal.writing+8 >d|Séculos de história, em capítulos.']],
 c:['O fundo do poço','A tristeza ficou tão grande que pensei em ver o sol de propósito.',['Pedir ajuda|>b|Liguei para alguém que eu nem sabia que ainda se importava.','Abrir a cortina|?will h-5 >b|Na última hora, fechei.|hl-40 h-10 >b|Queimei feio, mas sobrevivi. E escolhi viver.']],
 d:['Sentido','A eternidade voltou a ter cor.',['Seguir nesse caminho|h+12|Um dia de cada vez, mesmo que sejam infinitos.','Compartilhar com outros vampiros|k+6 h+8|Muitos sentem o mesmo peso.']],
});
chain('vamp_sangue_raro',{k:'Vampiro',min:18,max:200,when:VAMP,npc:1,gap:[1,1]},{
 a:['O cheiro','Senti um cheiro de sangue diferente de tudo. Vinha de {p}, num ônibus.',['Seguir {p}|>b|Desci no mesmo ponto.','Descer no próximo ponto|?will k+4 >e|Fugi da tentação.|>b|Não consegui.']],
 b:['Obsessão','O sangue de {p} não sai da minha cabeça. Sei onde mora, onde trabalha.',['Me aproximar como amig{o}|vira:amigo >c|Conversas, cafés, e a tentação sempre ali.','Contar tudo para um vampiro mais velho|>d|Ele disse: "Sangue assim é raro. E perigoso."']],
 c:['A noite fatal','Uma noite, a sós com {p}, a sede ficou insuportável.',['Morder só um pouco|fome-60 k-6 bond-20 >d|{p} desmaiou. Acordou sem lembrar de nada.','Sair correndo|?will k+8 >e|Corri até amanhecer quase.|fome-60 k-10 >d|Voltei.']],
 d:['O vício','Um gole daquele sangue me deixou viciad{o}. Preciso de mais.',['Procurar uma cura para o vício|$-8000 ?50 h+8|Uma bruxa me deu um chá horrível. Funcionou.|fome+30|Não funcionou.','Mudar de cidade, longe de {p}|$-5000 h-4|A distância é o único remédio.']],
 e:['Livre','Venci a tentação. {p} nunca soube o perigo que correu.',['Me orgulhar|h+8 k+5|O monstro dentro de mim não manda em tudo.','Ficar de olho em {p} de longe|k+3|Protegendo de outros como eu.']],
});
chain('vamp_cacadora',{k:'Vampiro',min:16,max:200,when:VAMP,npc:1,gn:'F',age:[-5,15],gap:[1,1]},{
 a:['A caçadora','Uma caçadora de vampiros, {p}, chegou à cidade. Já destruiu dois conhecidos meus.',['Me esconder|>b|Mudei de endereço três vezes em uma semana.','Ir atrás dela antes|>c|Melhor atacar primeiro.']],
 b:['Encontrad{o}','{p} me encontrou. Estaca na mão.',['Lutar|?fight >d|Desarmei {p} e fugi.|hl-30 >e|A estaca passou a centímetros do coração.','Falar|>f|"Eu nunca matei ninguém." Ela hesitou.']],
 c:['A emboscada','Preparei uma emboscada. Mas ela também.',['Lutar|?fight-10 k-4 >d|Venci. Deixei {p} amarrada e viva.|hl-30 >e|Ela venceu desta vez.']],
 d:['A caçadora derrotada','{p} está desarmada na minha frente.',['Poupar a vida dela|k+10 >f|Ela me olhou com ódio e com dúvida.','Morder|fome-80 k-15 vira:inimigo morder|Agora ela é uma de nós. Ironia cruel.']],
 e:['Ferid{o}','A ferida de estaca demora a fechar.',['Fugir da cidade|$-5000 h-4|Que ela fique com a cidade.','Treinar e voltar|fight+8 >b@1|Da próxima vez, estarei pront{o}.']],
 f:['A trégua','{p} prometeu me deixar em paz se eu não matar ninguém.',['Aceitar a trégua|k+5 vira:amigo|Viramos uma dupla estranha: ela caça vampiros que matam, eu ajudo a encontrá-los.','Desconfiar|>b@2|Caçadora é caçadora.']],
});
chain('vamp_familia_humana',{k:'Vampiro',min:18,max:200,when:m=>VAMP(m)&&parents().length>0,who:'parent',gap:[1,1]},{
 a:['Esconder da família','{p} quer saber por que eu nunca vou aos almoços de domingo.',['Ir aos jantares de domingo|>b|Jantar eu consigo. Fingindo comer.','Inventar trabalho|bond-5 >c|"Plantão de novo, desculpa."']],
 b:['O jantar','No jantar, {p} reparou que eu não comi nada e estou pálid{o} demais.',['Dizer que estou de dieta|?40 >c|Colou.|>d|{p} não acreditou.','Contar a verdade|>d|Não aguento mais mentir para {p}.']],
 c:['A distância','{p} se sente abandonad{o2}.',['Visitar à noite|bond+8 >e|Conversas longas na varanda, sob as estrelas.','Contar a verdade|>d|Melhor que a distância.']],
 d:['A revelação','{p} ouviu tudo.',['Esperar a reação|?bond bond+15 h+10 >e|{p} me abraçou: "Você continua sendo da família." Gelad{o}, mas da família.|bond-20 h-12 >e|{p} pediu um tempo.']],
 e:['A velhice de {p}','{p} está envelhecendo. Eu não.',['Ficar perto até o fim|bond+15 h+6|Segurei a mão de {p} nos últimos dias.','Oferecer a eternidade|?20 morder|{p} aceitou. Agora somos dois.|bond+5|{p} recusou: "Uma vida basta."']],
});
chain('vamp_guerra_lobo',{k:'Vampiro',min:18,max:200,when:VAMP,gap:[1,1]},{
 a:['Território','Uma alcateia de lobisomens chegou à cidade. Vampiros e lobos nunca dividem território.',['Tentar uma trégua|>b|Marquei um encontro num terreno neutro.','Preparar para a guerra|fight+4 >c|Juntei outros vampiros.']],
 b:['O encontro','O líder da alcateia me olhou com desprezo, mas aceitou ouvir.',['Propor dividir a cidade|?k k+6 >d|Rio como fronteira. Eles do lado de lá.|>c|Ele rosnou e foi embora.','Ameaçar|>c|Má ideia.']],
 c:['A guerra','Na lua cheia, os lobos atacaram.',['Lutar|?fight k-4 >d|Expulsamos a alcateia.|hl-35 >e|Perdemos. Fugi ferid{o}.','Fugir com os mais fracos|k+6 >e|Salvei quem pude.']],
 d:['A paz','A cidade foi dividida. Vampiros de um lado, lobos do outro.',['Respeitar a fronteira|h+6 k+3|Paz frágil, mas paz.','Atravessar escondid{o}|?40 h+4|Ninguém viu.|hl-20|Um lobo me pegou.']],
 e:['Recomeçar','A cidade ficou com os lobos.',['Mudar de cidade|$-5000 h-3|Outra cidade, outro território.','Planejar a volta|fight+6 >c@2|Um dia, a noite volta a ser nossa.']],
});
chain('vamp_ensinar',{k:'Vampiro',min:20,max:200,when:VAMP,npc:1,gap:[1,1]},{
 a:['Recém-transformad{o2}','Achei {p} escondid{o2} num porão, apavorad{o2}, transformad{o2} há três dias.',['Ajudar|vira:amigo >b|Levei {p} para minha casa antes do amanhecer.','Deixar|k-6|Cada um com a sua sina.']],
 b:['As primeiras lições','{p} não sabe controlar a sede, nem fugir do sol.',['Ensinar com paciência|k+6 bond+10 >c|Primeira lição: nunca beber até o coração parar.','Ser dur{o} nas lições|bond-5 fight+3 >c|A noite não perdoa erros.']],
 c:['A primeira caça','{p} quer caçar sozinh{o2} pela primeira vez.',['Ir junto|>d|Segui de longe.','Deixar ir|?50 >e|{p} voltou de manhã, satisfeit{o2} e sem ter matado ninguém.|>d|{p} não voltou.']],
 d:['O erro','{p} perdeu o controle e atacou alguém.',['Salvar a vítima|k+8 >e|Levei a vítima para o hospital. {p} chorou de culpa.','Cobrir os rastros|k-6 >e|Ninguém vai saber.']],
 e:['Independente','{p} aprendeu a viver sozinh{o2}.',['Despedir|h+6 k+4|Mais um vampiro que não vai virar monstro.','Continuar por perto|bond+8 h+5|Família da noite.']],
});
chain('vamp_alma',{k:'Vampiro',min:20,max:200,when:VAMP,gap:[2,3]},{
 a:['A dúvida','Será que eu ainda tenho alma?',['Procurar respostas na religião|>b|Fui conversar com um líder religioso, à noite.','Procurar respostas em livros|sm+4 >c|Bibliotecas antigas, à luz de velas.']],
 b:['A conversa','O líder religioso não se assustou. Disse que alma é o que a gente faz com a vida que tem.',['Concordar|k+6 >d|Saí de lá mais leve.','Discordar|>c|Preciso de mais.']],
 c:['O manuscrito','Num manuscrito antigo, a história de um vampiro que conquistou a paz fazendo o bem por cem anos.',['Seguir o exemplo|k+10 >d|Cem anos é pouco para quem tem a eternidade.','Achar lenda|h-2|Mais uma história.']],
 d:['Paz','Descobri que a resposta não importa tanto. Importa quem eu escolho ser.',['Fazer o bem todos os dias|k+12 h+10|Ajudo quem a noite esquece.','Viver em paz comigo|h+12|Sou uma criatura da noite. E sou eu.']],
});
