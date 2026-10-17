// ===== Histórias paranormais em cadeia para qualquer pessoa (2): lendas, OVNIs, maldições e médiuns =====
chain('ovni',{k:'Mistério',min:12,max:85,when:LIVRE,w:.5,gap:[1,1]},{
 a:['Luzes no céu','Três luzes em triângulo pararam em cima da cidade e sumiram de repente.',['Filmar|>b|O vídeo ficou tremido, mas dá para ver.','Achar que é drone|>c@1|Drone não some daquele jeito.']],
 b:['O vídeo viral','O vídeo foi parar no jornal nacional. A aeronáutica disse que era "fenômeno atmosférico".',['Dar entrevistas|f+5 >c|Virei "a pessoa do OVNI".','Ficar quiet{o}|>c|Não quero ser chamad{o} de louc{o}.']],
 c:['Tempo perdido','Voltando para casa, olhei o relógio: tinham passado três horas que eu não lembro.',['Procurar um hipnoterapeuta|$-1000 >d|Ele quis gravar a sessão.','Tentar esquecer|h-4 >e@1|Não consegui esquecer.']],
 d:['A sessão','Sob hipnose, descrevi uma sala branca e figuras altas que me examinavam.',['Acreditar|h-6 sm+2 >e|Ninguém sai igual de uma lembrança dessas.','Achar que foi imaginação|>e|A mente prega peças.']],
 e:['A marca','Apareceu uma marca de três pontinhos em triângulo no meu braço.',['Mostrar para um ufólogo|>f|Ele disse que já viu outras iguais.','Esconder com uma blusa|h-3|Nunca mostrei para ninguém.']],
 f:['O grupo','O ufólogo me apresentou a um grupo de pessoas com a mesma marca.',['Entrar no grupo|h+6 f+2|Pela primeira vez, alguém acreditou em mim.','Ir embora|h+0|Parecia uma seita.']],
});
chain('maldicao_cigana',{k:'Maldição',min:16,max:85,when:LIVRE,w:.4,npc:1,gn:'F',age:[30,50],gap:[1,1]},{
 a:['A velha da feira','Uma senhora na feira, {p}, pegou minha mão e disse que eu carrego "um peso que não é meu".',['Pedir para ela explicar|>b|"Alguém da sua família foi amaldiçoado. E a maldição passou para você."','Rir e ir embora|>c@1|Ela gritou: "Sete anos!"']],
 b:['A maldição','Segundo {p}, a cada ano algo de valor vai ser tirado de mim, até a maldição ser quebrada.',['Pagar para ela quebrar|$-1500 ?40 h+8|Ela queimou ervas e disse que acabou. Acabou mesmo.|>c|Ela sumiu com o dinheiro.','Procurar a origem da maldição|sm+2 >d|Perguntei aos parentes mais velhos.']],
 c:['Azar','Coisas ruins começaram a acontecer: pneu furado, celular roubado, dente quebrado.',['Voltar à feira para procurar {p}|>b|Ela estava lá, como se me esperasse.','Achar que é coincidência|$-800 h-4 >d|Coincidência cara.']],
 d:['A origem','Minha tia-avó contou: meu bisavô enganou uma família pobre e foi amaldiçoado.',['Procurar os descendentes da família|k+6 >e|Achei uma neta deles, vivendo com dificuldade.','Desistir|h-3|O peso continua.']],
 e:['A reparação','Decidi reparar o que meu bisavô fez.',['Ajudar a família com dinheiro|$-5000 k+12 h+10|Senti, literalmente, um peso saindo das costas.','Pedir perdão em nome da família|k+8 h+6|A senhora aceitou. Disse que a mãe dela tinha perdoado antes de morrer.']],
});
chain('medium',{k:'Mistério',min:16,max:85,when:LIVRE,w:.4,npc:1,gn:'F',age:[10,40],gap:[1,1]},{
 a:['A médium','Uma amiga me levou numa médium famosa, {p}, só por curiosidade.',['Fazer uma consulta|$-300 >b|Ela fechou os olhos e começou a falar com a voz diferente.','Ficar na sala de espera|h+0|Fiquei lendo revista velha.']],
 b:['A mensagem','{p} disse coisas que só eu e uma pessoa que já morreu sabíamos.',['Chorar|h+8 >c|Fazia anos que eu queria ouvir aquilo.','Desconfiar|sm+2 >d|Deve ter pesquisado sobre mim.']],
 c:['O recado','{p} disse que essa pessoa quer que eu procure uma caixa escondida na casa antiga da família.',['Procurar a caixa|?50 $+3000 h+12|Achei a caixa com cartas e economias guardadas. Um presente do além.|h-2|Não achei nada. Mas a busca trouxe lembranças boas.','Deixar para lá|h+2|Já recebi o que precisava.']],
 d:['A investigação','Investiguei {p}: nenhuma informação sobre mim estava na internet.',['Voltar para outra consulta|$-300 >c|Desta vez fui sem desconfiança.','Ficar com a dúvida|h+2|Algumas coisas não têm explicação.']],
});
chain('lobisomem_visto',{k:'Paranormal',min:14,max:80,when:m=>!m.prison&&!m.criatura,w:.4,gap:[1,1]},{
 a:['O uivo','Numa noite de lua cheia, um uivo que não era de cachorro ecoou na rua.',['Olhar pela janela|>b|Uma sombra enorme atravessou a rua sobre duas pernas.','Fechar tudo e ir dormir|>e@1|Não dormi.']],
 b:['As pegadas','De manhã, pegadas enormes no quintal e o cachorro do vizinho sumido.',['Seguir as pegadas|>c|Elas iam até o mato atrás do bairro.','Avisar a polícia|>d|O policial riu: "Cachorro grande."']],
 c:['A toca','No mato, ossos, roupas rasgadas e um cheiro de bicho.',['Ir embora antes do anoitecer|>d|Saí correndo.','Esperar escondid{o} para ver|?40 >d|Vi um homem nu acordando no meio dos ossos. Ele não me viu.|>f|A fera me viu primeiro.']],
 d:['Nos jornais','O jornal da cidade fala em "ataques de animal selvagem" no bairro.',['Investigar os ataques|>e|Todos aconteceram em noites de lua cheia.','Mudar de bairro|$-3000 h+2|Prefiro não saber.']],
 e:['A lua cheia','Na lua cheia seguinte, o uivo voltou. Mais perto.',['Comprar balas de prata|$-2000 >g|O armeiro nem perguntou para quê.','Trancar a casa e rezar|h-4|Amanheceu. Sobrevivi.']],
 f:['O ataque','A fera pulou em mim. Senti os dentes no braço.',['Lutar|?fight >g|Consegui escapar com um corte feio.|virar:lobisomem|A mordida foi funda. Na lua seguinte, entendi o que tinha acontecido comigo.','Fingir de mort{o}|?40 >g|A fera foi embora.|virar:lobisomem|A fera mordeu antes de ir.']],
 g:['A caçada','Na noite certa, encontrei a fera de novo.',['Atirar|?fight f+6 k+4|Acertei. Ao amanhecer, era um homem caído no mato.|hl-25|Errei. A fera fugiu e me deixou ferid{o}.','Deixar ir|k+2|Ela também é uma vítima.']],
});
chain('vampiro_visto',{k:'Paranormal',min:16,max:80,when:m=>!m.prison&&!m.criatura,w:.4,npc:1,date:1,gap:[1,1]},{
 a:['Alguém da noite','Conheci {p} numa festa. Pálid{o2}, elegante, só aparece depois do pôr do sol.',['Puxar conversa|>b|{p} conhece tudo de música antiga. Muito antiga.','Achar estranho e ir embora|h+0|Senti um frio na nuca.']],
 b:['Os encontros','Saímos algumas vezes. Nunca de dia. Nunca num restaurante.',['Perguntar o porquê|>c|{p} riu e disse que tem "alergia ao sol".','Notar que {ele} não aparece em fotos|>c|Na foto da festa, só eu estou na mesa.']],
 c:['A verdade','{p} confessou: tem duzentos anos e se alimenta de sangue.',['Fugir|h-6 >e|Corri até em casa sem olhar para trás.','Ficar|vira:namoro >d|O coração não escuta o bom senso.']],
 d:['A proposta','{p} quer me transformar para ficarmos juntos para sempre.',['Aceitar|virar:vampiro h+10|Senti as presas no pescoço e depois nada. Acordei com sede.','Recusar|bond-10 >e|{p} respeitou. Mas ficou triste.']],
 e:['A ausência','{p} desapareceu da cidade. Deixou um bilhete: "Você mereceu uma vida inteira."',['Guardar o bilhete|h+4|Às vezes ainda vejo alguém pálido na multidão e penso n{ele}.','Tentar encontrar {p}|>b@2|Procurei em todas as festas.']],
});
chain('igreja_abandonada',{k:'Assombração',min:14,max:60,when:LIVRE,w:.4,gap:[1,1]},{
 a:['A igreja fechada','A igreja abandonada no fim da rua tem o sino tocando sozinho à meia-noite.',['Entrar para ver|>b|A porta rangeu como em filme de terror.','Gravar o sino do lado de fora|>d|O áudio tem uma voz cantando junto.']],
 b:['O altar','No altar, velas acesas. Ninguém mora aqui há quarenta anos.',['Apagar as velas|>c|Elas se acenderam de novo.','Rezar|k+4 >d|Senti uma paz estranha.','Sair correndo|h-4|Nunca mais passei na frente.']],
 c:['O padre','Uma figura de batina apareceu no corredor e apontou para o porão.',['Ir ao porão|>e|Achei um cofre antigo trancado.','Ir embora|h-3|Não é comigo.']],
 d:['O coral','Moradores antigos dizem que o coral da igreja morreu num incêndio em 1960, durante a missa.',['Fazer uma missa em homenagem|$-500 k+8 h+6|O sino nunca mais tocou sozinho.','Contar para a imprensa|f+3|Virou ponto turístico.']],
 e:['O cofre','No cofre, as doações que o padre escondeu para reconstruir a igreja.',['Entregar à paróquia|k+10 f+3|A igreja foi reformada com aquele dinheiro.','Ficar com o dinheiro|$+15000 k-12|Aquela noite, o sino tocou na minha porta.']],
});
chain('chupacabra',{k:'Mistério',min:12,max:85,when:LIVRE,w:.4,gap:[1,1]},{
 a:['Os bichos mortos','No sítio da família, galinhas e cabras aparecem mortas, sem sangue, com dois furinhos no pescoço.',['Montar uma câmera|>b|Se tem alguma coisa, vai aparecer.','Achar que foi raposa|>c@1|Raposa come. Isso não comeu.']],
 b:['A gravação','A câmera gravou um vulto curvado, com olhos vermelhos e espinhos nas costas.',['Mandar para um programa de TV|f+5 $+1000 >d|Virou "o chupa-cabra do sítio".','Mostrar só para a família|>c|Ninguém dormiu.']],
 c:['A espera','Fiquei de vigia com uma lanterna e uma enxada.',['Encarar o bicho|?fight >d|Ele fugiu ganindo pelo mato.|hl-10 >d|Ele me arranhou e fugiu.','Gritar e acender todas as luzes|>d|O bicho fugiu.']],
 d:['O fim dos ataques','Os ataques pararam. Mas pegadas estranhas ainda aparecem na lama.',['Contar a história para os netos|h+4|A melhor história do sítio.','Convencer a família a vender o sítio|$+5000 h+2|Fiquei com a minha parte. Que o próximo dono se vire.']],
});
chain('lenda_curupira',{k:'Lenda',min:8,max:60,when:LIVRE,w:.4,gap:[1,1]},{
 a:['Perdid{o} na mata','Numa trilha, as pegadas que eu seguia de volta estavam ao contrário, com os calcanhares para frente.',['Seguir as pegadas mesmo assim|>b|Andei em círculos por horas.','Parar e esperar ajuda|>c|Escureceu.']],
 b:['O assobio','Um assobio fino ecoou em volta, de todos os lados.',['Oferecer fumo e cachaça, como dizem as lendas|>d|Deixei no tronco de uma árvore.','Gritar por ajuda|>c|Só o assobio respondeu.']],
 c:['A noite na mata','Passei a noite encolhid{o} entre as raízes.',['Rezar|h-3 >d|De manhã, a trilha apareceu bem na minha frente.','Chorar|h-5 >d|De manhã, um caçador me encontrou.']],
 d:['O guardião','Voltei para casa sabendo que algo na mata me deixou sair.',['Nunca mais caçar ali|k+5 h+4|A mata tem dono.','Contar a história|h+4|Ninguém da cidade grande acreditou. Os mais velhos da roça, sim.']],
});
chain('fantasma_trabalho',{k:'Assombração',min:18,max:70,when:m=>!!m.job&&!m.prison,w:.4,gap:[1,1]},{
 a:['Hora extra','Fazendo hora extra sozinh{o} no escritório, o elevador parou no meu andar. Vazio.',['Ignorar e continuar|>b|O elevador abriu e fechou mais três vezes.','Ir embora|>e@1|O trabalho fica para amanhã.']],
 b:['O colega da noite','Alguém digitava no computador do canto. Não tinha ninguém sentado.',['Olhar a tela|>c|Uma planilha de 1998, com o nome de um funcionário antigo.','Desligar o computador da tomada|>c|Ele continuou ligado.']],
 c:['O funcionário antigo','O porteiro contou: um contador morreu na mesa do canto, numa noite de hora extra.',['Terminar o relatório dele|sm+2 k+5 >d|Achei um erro antigo na planilha e corrigi.','Pedir para mudar de andar|h+2|Nunca mais fico até tarde.']],
 d:['O erro','O erro que eu corrigi mostrou um desvio de dinheiro de vinte anos atrás.',['Levar à diretoria|?50 promo f+2|Fui promovid{o} por descobrir a fraude.|perf-5|Ninguém quis mexer em coisa antiga.','Deixar quieto|h+0|Mas o computador nunca mais ligou sozinho.']],
 e:['De novo','Toda vez que fico até tarde, o elevador para no meu andar.',['Dar boa-noite para o elevador|h+3|Virou um ritual.','Nunca mais fazer hora extra|perf-3 h+3|Meu chefe não entende, mas eu entendo.']],
});
