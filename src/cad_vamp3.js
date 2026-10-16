// ===== Histórias em cadeia: a vida de vampiro (3) =====
chain('vamp_policia',{k:'Vampiro',min:18,max:200,when:VAMP,npc:1,gn:'M',gap:[1,1]},{
 a:['O detetive','O detetive {p} está investigando corpos encontrados sem sangue. E veio bater na minha porta.',['Responder às perguntas com calma|?sm >b|Ele foi embora sem nada.|>c|Ele percebeu que eu não respiro quando fico parad{o}.','Hipnotizar o detetive|?50 >b|Ele esqueceu por que veio.|>c|Ele piscou e o transe quebrou.']],
 b:['A investigação continua','Os corpos continuam aparecendo. Não sou eu. Tem outro vampiro na cidade.',['Caçar o outro vampiro|>d|Se eu não parar, a culpa vai cair em mim.','Ficar na minha|>c|Não é problema meu.']],
 c:['Suspeit{o}','O detetive me colocou como principal suspeit{o}.',['Ajudar a achar o verdadeiro culpado|>d|Precisei me revelar para {p}.','Fugir|$-5000 h-4|Saí da cidade antes da prisão.']],
 d:['O verdadeiro assassino','Achei o outro vampiro: selvagem, sem controle, matando por prazer.',['Enfrentar|?fight k+10 f+0 >e|Venci. Os ataques pararam.|hl-35 >e|Venci por pouco, muito ferid{o}.','Avisar o detetive|>e|Contei onde ele dorme de dia.']],
 e:['O acordo','O detetive {p} sabe o que eu sou. E sabe que eu salvei a cidade.',['Fazer um acordo de silêncio|vira:amigo k+5|Ele guarda meu segredo. Eu ajudo nos casos estranhos.','Sumir mesmo assim|h+2|Ninguém deve saber.']],
});
chain('vamp_casamento',{k:'Vampiro',min:20,max:200,when:m=>VAMP(m)&&!!partners().length,who:'partner',gap:[1,1]},{
 a:['A cerimônia','{p} quer casar na igreja, de manhã, com sol.',['Propor um casamento à noite|>b|"Casamento à luz de velas é muito mais romântico."','Tentar ir de manhã|hl-20 >c|Fiquei na sombra da porta, queimando.']],
 b:['O casamento noturno','O casamento foi à meia-noite, num jardim cheio de velas.',['Fazer os votos|casar h+15 pbond+10 >d|O casamento mais bonito que os convidados já viram.','Desistir na última hora|pbond-20 h-8|Fugi com medo do que eu sou.']],
 c:['O desmaio','Quase desmaiei de dor na porta da igreja.',['Contar a verdade para {p}|>d|Contei tudo, ali no carro.','Inventar uma alergia|?40 >b|Mudamos para a noite.|pbond-10 >d|{p} ficou desconfiad{o2}.']],
 d:['A lua de mel','A lua de mel foi num lugar onde o inverno tem noites de vinte horas.',['Aproveitar|h+12 pbond+10|Noites sem fim, do jeito que eu gosto.','Contar a verdade antes|?bond pbond+10 h+10|{p} só disse: "Agora entendo tudo."|separar h-12|{p} não soube lidar.']],
});
chain('vamp_colecao',{k:'Vampiro',min:30,max:200,when:VAMP,gap:[2,3]},{
 a:['Colecionador de séculos','Com a eternidade, comecei a juntar objetos que contam a minha história.',['Colecionar arte|$-10000 >b|Quadros de pintores que eu conheci pessoalmente.','Colecionar cartas antigas|>b|Cartas que escrevi para pessoas que já se foram.']],
 b:['O valor','Um avaliador disse que minha coleção vale uma fortuna.',['Vender parte|$+60000 >c|Dinheiro para mais um século.','Guardar tudo|h+4 >c|Cada peça é uma lembrança.']],
 c:['O museu','Um museu quer expor a coleção de um "colecionador anônimo".',['Emprestar|f+4 k+4 >d|As pessoas fazem fila para ver a minha história, sem saber.','Recusar|h+2|É pessoal demais.']],
 d:['O retrato','Na exposição, uma visitante parou diante de um retrato de 1890 e olhou para mim.',['Sair antes que ela fale|h-2|Ela me reconheceu. Tenho certeza.','Sorrir para ela|h+6|Ela sorriu de volta e não disse nada.']],
});
chain('vamp_doacao',{k:'Vampiro',min:18,max:200,when:VAMP,gap:[1,1]},{
 a:['Retribuir','Tirei tanto sangue do mundo que decidi devolver de algum jeito.',['Organizar campanhas de doação de sangue|k+8 >b|Ironia: um vampiro pedindo para as pessoas doarem sangue.','Doar dinheiro para hospitais|$-10000 k+8 >b|Anônimo, todo ano.']],
 b:['A campanha','A campanha de doação bateu recorde na cidade.',['Fazer de novo todo ano|k+6 f+2 >c|Virou tradição.','Parar por aqui|h+3|Já fiz minha parte.']],
 c:['A homenagem','O hospital quer homenagear quem organizou as campanhas.',['Aceitar, à noite|f+3 h+6|Uma cerimônia noturna, a pedido meu.','Recusar|k+3|Não preciso de homenagem.']],
});
chain('vamp_sede_crise',{k:'Vampiro',min:16,max:200,when:m=>VAMP(m)&&(m.fomeP||0)>=60,gap:[1,1]},{
 a:['A sede apertou','A sede está no limite. Preciso resolver antes que eu machuque alguém.',['Ir ao mercado negro|$-3000 fome-50 >c|Um contato no porto vende bolsas de sangue.','Caçar animais|fome-25 >b|Não é suficiente, mas ajuda.','Morder alguém na rua|fome-70 k-10 >d|Num beco, rápido.']],
 b:['Ainda com sede','Os animais não bastaram.',['Voltar à cidade e procurar sangue de verdade|$-3000 fome-40 >c|Mercado negro.','Me trancar até passar|?will h-6 >c|Passei três dias trancad{o}. A sede diminuiu.|fome+20 >d|Não consegui ficar trancad{o}.']],
 c:['Controle','A sede passou. Por enquanto.',['Fazer um estoque|$-5000 fome-20|Geladeira cheia. Paz por um tempo.','Seguir assim|h+2|Um dia de cada vez.']],
 d:['A vítima','A pessoa que eu mordi está no hospital.',['Visitar sem ser visto|k+3 >c|Ela vai sobreviver.','Esquecer|k-4 >c|Não posso me culpar por ser o que sou.']],
});
chain('vamp_noite_eterna',{k:'Vampiro',min:18,max:200,when:VAMP,npc:1,gn:'M',gap:[1,2]},{
 a:['O velho amigo','Encontrei {p}, um amigo da minha vida humana, agora com sessenta anos. Ele me reconheceu na hora.',['Fingir ser filh{o} de mim mesm{o}|?50 >b|"Você é a cara do seu pai!" Colou.|>c|Ele não acreditou nem por um segundo.','Contar a verdade|>c|Ele sentou no meio-fio, sem ar.']],
 b:['O filho fictício','{p} quer saber tudo sobre o "pai" que sumiu.',['Contar histórias verdadeiras como se fossem de outro|h+4 >d|Contei a minha vida em terceira pessoa.','Inventar uma morte para o "pai"|h-3 >d|{p} chorou pelo amigo.']],
 c:['A verdade','{p} ouviu a verdade em silêncio. Depois riu: "Você sempre foi diferente."',['Retomar a amizade|vira:amigo h+10 >d|Conversas de madrugada, como nos velhos tempos.','Pedir segredo e se afastar|h-2 >d|É mais seguro para ele.']],
 d:['A doença','{p} está doente. Os médicos dão poucos meses.',['Oferecer a eternidade|?30 vira:amigo morder h+8|Ele aceitou. Dois velhos amigos para sempre.|h-6 >e|Ele recusou: "Já vivi o que tinha para viver."','Ficar ao lado até o fim|k+8 >e|Visitei toda noite.']],
 e:['Adeus','{p} partiu numa noite de lua cheia, segurando minha mão.',['Guardar a lembrança|h-6 k+4|Mais um adeus, numa vida feita de adeuses.','Escrever sobre ele|tal.writing+4 h-2|Ninguém vai saber que eu estava lá. Mas eu sei.']],
});
chain('vamp_bebe',{k:'Vampiro',min:20,max:200,when:VAMP,gap:[1,1]},{
 a:['Ser pai ou mãe sendo vampiro','Sendo vampiro, ter filhos parece impossível. Mas a vontade não passa.',['Pensar em adoção|>b|Um bebê precisa de alguém. Mesmo que seja alguém da noite.','Desistir da ideia|h-6|A eternidade não combina com fraldas.']],
 b:['A adoção','O processo de adoção exige entrevistas de dia.',['Usar o manto protetor e ir|$-3000 >c|Fui às entrevistas suando sob o manto.','Pedir entrevistas à noite|?k >c|A assistente social aceitou: "Trabalho noturno, entendo."|h-6|Negaram o pedido.']],
 c:['A criança','Uma criança chegou em casa. Pequena, assustada e linda.',['Cuidar de tudo à noite e contratar ajuda de dia|$-8000 bebe h+20|Babá de dia, eu de noite. Funciona.','Contar a verdade quando ela crescer|bebe h+18 >d@8|Por enquanto, sou só o pai ou a mãe que trabalha de noite.']],
 d:['A pergunta','A criança, crescida, perguntou por que eu nunca saio no sol.',['Contar a verdade|h+6 k+3|Ela ficou em silêncio, depois me abraçou: "Você é meu monstro favorito."','Inventar uma doença|h-2|Um dia eu conto.']],
});
