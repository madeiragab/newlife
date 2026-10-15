// ===== Histórias paranormais em cadeia para qualquer pessoa (1): fantasmas e casas assombradas =====
const LIVRE=m=>!m.prison;
chain('casa_assombrada',{k:'Assombração',min:10,max:85,when:LIVRE,w:.7,gap:[1,1]},{
 a:['Barulhos à noite','Desde que mudamos de casa, ouço passos no corredor às três da manhã. Todo dia, no mesmo horário.',['Levantar para ver|>b|O corredor estava vazio. Mas a porta do sótão estava aberta.','Cobrir a cabeça com o cobertor|h-3 >c|Os passos pararam na porta do meu quarto.','Achar que é o encanamento|>d@1|Encanamento não sobe escada.']],
 b:['O sótão','No sótão, uma caixa de fotos antigas de uma família que morou aqui há cinquenta anos.',['Olhar as fotos|>e|Em todas, uma menina de vestido branco olha direto para a câmera.','Fechar o sótão com cadeado|h-2 >c|Na manhã seguinte, o cadeado estava no chão.']],
 c:['A presença','A temperatura do quarto cai de repente. Sinto alguém sentado na beira da cama.',['Perguntar quem está aí|>e|Uma voz de criança respondeu meu nome.','Chamar um padre|$-300 >f|O padre benzeu a casa inteira.','Sair correndo para a sala|h-5 >d|Dormi no sofá com a luz acesa.']],
 d:['Pior a cada noite','Os objetos agora mudam de lugar. A família inteira está assustada.',['Investigar a história da casa|sm+2 >e|Fui à biblioteca da cidade procurar jornais antigos.','Mudar de casa|$-8000 h+4|Fomos embora. Nunca mais passei naquela rua.']],
 e:['A menina do vestido branco','Os jornais contam: uma menina desapareceu nesta casa em 1974. Nunca foi encontrada.',['Procurar no quintal|>g|Debaixo da velha mangueira, a terra parecia diferente.','Fazer uma oração por ela|k+5 h+4 >f|Naquela noite, ninguém andou no corredor.']],
 f:['Silêncio','A casa ficou em paz por um tempo. Mas às vezes ainda escuto uma risada de criança.',['Aceitar a companhia|h+4|Ela é parte da casa agora.','Deixar um brinquedo no sótão|k+3 h+3|De manhã, o brinquedo estava em outro lugar. Ela gostou.']],
 g:['A descoberta','Achei uma caixinha de metal enterrada com um diário e um laço de cabelo.',['Levar à polícia|f+3 k+6 >h|O caso de 1974 foi reaberto.','Devolver à família da menina|k+8 h+6 >h|Uma senhora de oitenta anos chorou abraçada ao laço: era a irmã dela.']],
 h:['Paz','Depois daquilo, os passos pararam para sempre.',['Sentir que fiz o certo|h+10 k+4|Às vezes a gente ajuda quem já se foi.','Plantar flores na mangueira|h+6|O lugar mais bonito do quintal.']],
});
chain('tabuleiro_ouija',{k:'Assombração',min:12,max:40,when:LIVRE,w:.6,gap:[1,1]},{
 a:['O tabuleiro','Numa festa do pijama, alguém trouxe um tabuleiro Ouija.',['Jogar|>b|Dedos no copo, luz apagada, risadas nervosas.','Recusar e ir dormir|h+1|Ouvi gritos do outro quarto a noite inteira.']],
 b:['Alguém respondeu','O copo se mexeu sozinho e soletrou: "E-S-T-O-U-A-Q-U-I".',['Perguntar o nome|>c|O copo soletrou um nome que ninguém conhecia.','Mandar embora|?50 >e|O copo foi até "ADEUS". Respiramos.|>c|O copo não se mexeu mais. Mas a vela apagou.','Quebrar o tabuleiro|h-3 >d|Todo mundo gritou ao mesmo tempo.']],
 c:['O nome','Pesquisei o nome soletrado. Era de um homem que morreu no prédio há vinte anos.',['Contar para os amigos|>d|Ninguém dormiu direito por uma semana.','Guardar segredo|h-2 >d|Eu sei o que vi.']],
 d:['As coisas estranhas','Desde a festa, objetos caem sozinhos e o celular liga de madrugada.',['Procurar uma benzedeira|$-100 ?60 h+6 >e|Ela rezou, bateu galho de arruda em mim e tudo parou.|>f|Ela disse que é forte demais para ela.','Ignorar|h-5 >f|Não adiantou ignorar.']],
 e:['Lição','Nunca mais toquei num tabuleiro daqueles.',['Contar a história como lenda urbana|h+4|Virou a melhor história de acampamento.','Esquecer|h+2|Algumas portas não se abrem duas vezes.']],
 f:['Ele quer algo','Uma noite, a mesma voz sussurrou no meu ouvido: "Termine o que eu não terminei."',['Descobrir o que ele queria|sm+2 k+5 >e|Ele deixou uma carta de amor sem entregar. Achei e entreguei à viúva.','Mudar de cidade|$-5000 h+2|Ele não veio junto. Eu acho.']],
});
chain('cemiterio_aposta',{k:'Assombração',min:12,max:30,when:LIVRE,w:.5,gap:[1,1]},{
 a:['A aposta','Os amigos apostaram que eu não passo uma noite inteira no cemitério da cidade.',['Aceitar|>b|Levei um saco de dormir e uma lanterna.','Recusar|h-1|Chamaram de medros{o}, mas dormi em paz.']],
 b:['Meia-noite','À meia-noite, vi uma luz azul flutuando entre os túmulos.',['Seguir a luz|>c|Ela parou em cima de um túmulo sem nome.','Fingir que não vi|h-3 >d|Fechei os olhos e contei até mil.']],
 c:['O túmulo sem nome','No túmulo, só uma data e uma frase: "Esperando por quem não voltou."',['Deixar uma flor|k+4 >d|A luz azul apagou devagar.','Tirar uma foto|>e|Na foto, uma mulher aparece ao lado do túmulo.']],
 d:['Amanhecer','Sobrevivi à noite. Os amigos me receberam no portão.',['Cobrar a aposta|$+200 h+6|Ganhei a aposta e uma história.','Contar o que vi|f+1 h+4|Ninguém acreditou. Ainda.']],
 e:['A foto','A foto rodou a internet. Especialistas dizem que não é montagem.',['Investigar a mulher|sm+3 >f|Descobri que ela esperou o noivo voltar da guerra a vida inteira.','Vender a foto para um programa de TV|$+3000 f+4|Fiquei conhecid{o} como quem fotografou um fantasma.']],
 f:['O noivo','Achei o nome do noivo num arquivo militar. Ele está enterrado em outra cidade.',['Levar terra de um túmulo para o outro|k+10 h+10|Juntei os dois, do jeito que deu. A luz azul nunca mais apareceu.','Publicar a história|f+4 k+4|A cidade fez uma homenagem aos dois.']],
});
chain('crianca_fala_sozinha',{k:'Assombração',min:22,max:70,who:'child',w:.6,gap:[1,1]},{
 a:['O amigo invisível','{p} passa horas conversando com um "amigo" que ninguém vê. Diz que ele se chama Tobias.',['Achar normal para a idade|>b|Toda criança tem um amigo imaginário.','Perguntar sobre o Tobias|>c|{p} disse que ele mora no armário e é muito velho.']],
 b:['Coincidências','{p} sabe coisas que não deveria: o nome do meu avô, a cor da casa onde eu cresci.',['Levar a um psicólogo|$-800 >d|O psicólogo ficou intrigado.','Perguntar como {ele} sabe|>c|"O Tobias me contou."']],
 c:['O Tobias','{p} desenhou o Tobias: um menino de roupa antiga, com um chapéu engraçado.',['Procurar fotos antigas da casa|>e|Numa foto de 1920, um menino igualzinho ao desenho.','Pedir para {p} dizer ao Tobias que vá embora|?50 bond-3 >f|{p} chorou, mas o Tobias foi.|>d|"O Tobias não quer ir."']],
 d:['Noites difíceis','{p} acorda chorando: o Tobias está triste.',['Perguntar o que o Tobias quer|>e|"Ele quer que alguém lembre dele."','Chamar alguém para benzer a casa|$-200 >f|A casa ficou mais leve.']],
 e:['Lembrar','Descobri que o Tobias era filho dos primeiros donos da casa. Morreu de gripe aos seis anos.',['Fazer uma pequena homenagem com {p}|bond+10 k+6 >f|Acendemos uma vela e falamos o nome dele em voz alta.','Contar a história para a família|h+4 >f|Agora todo mundo conhece o Tobias.']],
 f:['Despedida','{p} disse que o Tobias foi embora feliz e deixou um abraço.',['Abraçar {p}|bond+8 h+8|Às vezes as crianças veem mais que a gente.','Ficar arrepiad{o}|h+3|Mas sorri.']],
});
chain('estrada_fantasma',{k:'Assombração',min:18,max:85,when:m=>!!m.lic&&!m.prison,w:.6,npc:1,gap:[1,1]},{
 a:['A carona na estrada','Numa estrada escura, uma pessoa de branco pediu carona no acostamento.',['Dar carona|>b|{p} entrou no carro sem dizer nada.','Passar direto|>e@2|Pelo retrovisor, não tinha ninguém no acostamento.']],
 b:['A passageira','{p} pediu para ser deixad{o2} numa casa a dez quilômetros dali. O carro ficou gelado.',['Puxar conversa|>c|{p} só disse: "Faz tanto tempo que eu tento voltar para casa."','Dirigir em silêncio|>c|Não tive coragem de olhar para o lado.']],
 c:['A casa','Parei na frente da casa. Quando olhei para o banco do passageiro, estava vazio.',['Bater na porta|>d|Uma senhora atendeu e ficou pálida quando eu descrevi {p}.','Ir embora acelerando|h-6|Nunca mais peguei aquela estrada à noite.']],
 d:['A senhora','"Essa é {p}, minha filha. Morreu nessa estrada há trinta anos. Você não é o primeiro que a traz."',['Abraçar a senhora|k+6 h+3 >f|Tomamos um café e ela me mostrou fotos.','Sair dali o mais rápido possível|h-4|Arrepio que não passa.']],
 e:['De novo','Dois anos depois, na mesma estrada, a mesma pessoa de branco no acostamento.',['Parar desta vez|>b|Algo me disse para parar.','Acelerar|h-3|Vi no retrovisor: estava no banco de trás.']],
 f:['Em paz','A senhora me ligou meses depois: ninguém mais viu {p} na estrada.',['Sentir que ajudei|h+8 k+4|Algumas viagens terminam depois de trinta anos.','Contar a história|f+2|Virou a lenda da cidade.']],
});
chain('hotel_antigo',{k:'Assombração',min:18,max:85,when:LIVRE,w:.5,gap:[1,1]},{
 a:['O quarto 13','Num hotel antigo do interior, a recepcionista hesitou antes de me dar a chave do quarto 13.',['Pedir outro quarto|>e|"Só tem esse livre", disse, sem me olhar.','Aceitar e rir da superstição|>b|Quarto grande, cheiro de naftalina e um espelho enorme.']],
 b:['O espelho','À noite, no espelho, vi uma mulher penteando o cabelo atrás de mim.',['Virar para trás|>c|Não tinha ninguém. No espelho, ela ainda estava lá.','Cobrir o espelho com a toalha|h-3 >d|A toalha caiu no chão sozinha.']],
 c:['O recado','No espelho embaçado apareceu escrito: "Ele me trancou aqui."',['Procurar a gerência|>d|O gerente mudou de cor.','Investigar o quarto|sm+2 >f|Atrás do armário, uma porta pintada por cima.']],
 d:['A história do hotel','O gerente contou: em 1950, a esposa do dono sumiu. Disseram que fugiu com um viajante.',['Duvidar da versão oficial|>f|Ninguém foge e deixa as joias para trás.','Pedir para trocar de hotel|$-300 h+2|Saí de madrugada.']],
 e:['O hotel lotado','Sem outro quarto, aceitei o 13 com um mau pressentimento.',['Dormir de luz acesa|>b|A luz piscou a noite inteira.','Ir dormir no carro|hl-2 h-2|Dormi mal, mas dormi.']],
 f:['A porta escondida','Atrás da porta pintada, um quartinho e um esqueleto com um vestido de 1950.',['Chamar a polícia|f+5 k+8 >g|Virou notícia nacional.','Fugir do hotel|h-6|Liguei anonimamente para a polícia da estrada.']],
 g:['Justiça tardia','O caso foi resolvido: o dono do hotel matou a esposa. Ela finalmente foi enterrada.',['Ir ao enterro|k+5 h+8|Uma mulher que eu só vi no espelho. Mas fui.','Seguir viagem|h+4|O quarto 13 foi fechado para sempre.']],
});
chain('poltergeist',{k:'Assombração',min:8,max:85,when:LIVRE,w:.5,gap:[1,1]},{
 a:['A louça','Os pratos começaram a cair do armário sozinhos. Um de cada vez.',['Filmar|>b|O vídeo mostra um prato deslizando devagar até cair.','Prender os armários com fita|h-2 >c|Os pratos começaram a cair da mesa.']],
 b:['O vídeo','Postei o vídeo. Metade da internet acha que é montagem, a outra metade quer ir lá em casa.',['Chamar investigadores paranormais|>d|Uma equipe com câmeras e aparelhos chegou em uma semana.','Apagar o vídeo|h+0 >c|Melhor não chamar atenção.']],
 c:['A escalada','Agora são cadeiras arrastadas e portas batendo à noite.',['Chamar investigadores|>d|Não dá mais para ignorar.','Chamar um padre|$-300 ?50 h+6|O exorcismo funcionou.|>d|O padre saiu correndo da casa.']],
 d:['A investigação','Os aparelhos registraram uma voz: "Saiam da minha casa."',['Negociar com o espírito|?k >e|Prometi cuidar da casa como ele cuidava. Os barulhos diminuíram.|hl-6 >f|Uma cadeira voou na minha direção.','Mudar de casa|$-6000 h+4|Ele que fique com a casa.']],
 e:['Convivência','O espírito ficou mais calmo. Às vezes até ajuda: acho as chaves em cima da mesa.',['Agradecer em voz alta|h+6|Convivência pacífica.','Chamar de "vovô"|h+8|Ele parece ter gostado.']],
 f:['Machucad{o}','A cadeira me acertou. Saímos de casa naquela noite.',['Vender a casa|$-4000 h+2|Vendi barato. O comprador desistiu em um mês.','Voltar com reforço espiritual|$-1000 ?50 h+8|Rezamos a casa inteira por três dias e funcionou.|h-6|Não adiantou.']],
});
chain('sonho_premonitorio',{k:'Mistério',min:12,max:85,when:LIVRE,w:.5,gap:[1,1]},{
 a:['O sonho','Sonhei que um ônibus caía de uma ponte. No dia seguinte, vi a mesma ponte no caminho do trabalho.',['Não pegar o ônibus|>b|Peguei um táxi, sentindo-me ridícul{o}.','Pegar o ônibus mesmo assim|>c|Sonho é só sonho.']],
 b:['A notícia','O ônibus que eu ia pegar bateu na mureta da ponte. Ninguém morreu, mas muitos se feriram.',['Contar para alguém|>d|Ninguém acreditou. Nem eu.','Guardar segredo|h-3 >d|Fiquei sem dormir.']],
 c:['A batida','O ônibus bateu na mureta. Me machuquei pouco, mas o sonho não sai da cabeça.',['Começar a anotar os sonhos|hl-5 >d|Um caderno do lado da cama.','Ignorar|hl-5 >d|Coincidência.']],
 d:['Outros sonhos','Os sonhos continuam. Alguns se realizam, outros não.',['Usar para ajudar as pessoas|?50 k+8 f+2 >e|Avisei uma vizinha sobre um vazamento de gás. Era verdade.|h-4 >e|Avisei alguém e era bobagem. Fiquei com fama de louc{o}.','Tentar fazer parar|>f|Remédio para dormir, meditação, chá.']],
 e:['O dom','Comecei a aceitar que talvez eu tenha um dom.',['Fazer as pazes com isso|h+6|Os sonhos ficaram mais calmos.','Procurar quem entenda|>f|Uma senhora me disse que a avó dela também sonhava assim.']],
 f:['Paz','Os sonhos foram ficando raros, como se tivessem cumprido o que precisavam.',['Agradecer|h+5|Fui guiad{o} quando precisei.','Sentir falta|h+2|Às vezes eu queria saber o que vem pela frente.']],
});
chain('espelho_avo',{k:'Assombração',min:10,max:85,when:m=>!m.prison&&people('avo').length===0,w:.5,gap:[1,1]},{
 a:['O espelho da avó','Herdei o espelho antigo da minha avó. À noite, sinto o perfume dela no quarto.',['Pendurar no quarto|>b|O perfume ficou mais forte.','Guardar na garagem|>c@1|O perfume foi junto.']],
 b:['O reflexo','Uma madrugada, o reflexo no espelho sorriu antes de mim.',['Falar com ela|>d|"Vó?" A luz da cabeceira piscou duas vezes.','Cobrir o espelho|h-2 >c|O pano estava no chão de manhã.']],
 c:['Saudade','Sinto falta dela todo dia.',['Contar para o espelho como foi meu dia|h+4 >d|Virou hábito.','Visitar o túmulo dela|h+4 >d|Levei as flores que ela gostava.']],
 d:['O último recado','Um dia, no espelho embaçado do banho, apareceu escrito: "Estou orgulhosa."',['Chorar|h+12|Chorei e ri ao mesmo tempo.','Mostrar para a família|h+8|Minha mãe reconheceu a letra.']],
});
chain('boneca',{k:'Assombração',min:6,max:70,when:LIVRE,w:.4,gap:[1,1]},{
 a:['A boneca da feira','Comprei uma boneca de porcelana antiga numa feira. O vendedor pareceu aliviado.',['Colocar na estante|>b|Ela é bonita. Bonita demais.','Dar de presente|>e|Dei para uma prima colecionadora.']],
 b:['De lugar','Toda manhã a boneca está numa posição diferente.',['Filmar a noite inteira|>c|Às 3h17, a cabeça da boneca virou para a câmera.','Jogar no lixo|>d|De manhã, ela estava de volta na estante.']],
 c:['A gravação','Mostrei a gravação para um especialista em antiguidades. Ele ficou branco.',['Perguntar a história da boneca|>d|Pertenceu a uma menina que morreu num incêndio em 1890.','Vender para um colecionador de objetos assombrados|$+4000 h+4|Ele pagou bem e levou com luvas.']],
 d:['A menina','A boneca não quer ir embora. Precisa de alguma coisa.',['Levar a boneca ao túmulo da menina|k+6 h+6|Deixei ao lado da lápide. Nunca mais voltou.','Queimar a boneca|?50 h+4|Ela queimou rápido. Paz.|h-8|Ela não queimou. Nem chamuscou.']],
 e:['A prima','Minha prima me ligou chorando: a boneca anda pela casa dela.',['Ir buscar a boneca|>d|Fiquei com a responsabilidade de volta.','Dizer que não é problema meu|k-4|Ela nunca mais falou comigo.']],
});
