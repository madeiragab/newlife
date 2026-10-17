// ===== Histórias paranormais em cadeia para qualquer pessoa (5) =====
chain('escola_assombrada',{k:'Assombração',min:8,max:17,when:m=>!m.prison&&!!m.edu.cur,w:.4,gap:[1,1]},{
 a:['O banheiro do terceiro andar','Todo mundo na escola fala da "Loira do Banheiro". Desafiaram você a ir lá sozinh{o} e chamar o nome dela três vezes.',['Aceitar o desafio|>b|O banheiro estava gelado e a torneira pingava.','Recusar|h-1|Chamaram de medros{o} o resto do ano.']],
 b:['Três vezes','Na terceira vez, a luz apagou e a descarga disparou sozinha.',['Sair correndo|f+1 h+4 >c|Saí gritando. Virei lenda da escola.','Ficar para ver|>d|No espelho, por um segundo, um rosto pálido atrás de mim.']],
 c:['Lenda da escola','Os colegas agora contam a história como se eu tivesse enfrentado um monstro.',['Aumentar a história|f+2 h+4|A cada vez que conto, ela fica maior.','Contar a verdade|k+2|Só deu medo mesmo.']],
 d:['O recado','No espelho embaçado, apareceu escrito: "Me ajuda a achar meu brinco."',['Procurar o brinco|>e|Atrás da pia, um brinco antigo de pérola.','Contar para a diretora|>c|Ela ficou pálida e mandou fechar o banheiro.']],
 e:['A ex-aluna','A diretora reconheceu o brinco: de uma aluna que morreu na escola em 1985.',['Entregar à família da aluna|k+8 h+8|O banheiro do terceiro andar nunca mais ficou gelado.','Guardar o brinco|h-3|Os pesadelos começaram.']],
});
chain('acampamento_lago',{k:'Assombração',min:12,max:40,when:LIVRE,w:.35,gap:[1,1]},{
 a:['O lago','Num acampamento com amigos, alguém contou a lenda da moça que se afogou no lago.',['Rir da história|>b|À meia-noite, ouvimos alguém nadando no lago.','Pedir para mudar de assunto|>b|Ninguém mudou.']],
 b:['Os barulhos','Um dos amigos sumiu da barraca no meio da noite.',['Procurar com lanternas|>c|As pegadas dele iam até a beira do lago.','Esperar amanhecer|h-6 >d|Ninguém dormiu.']],
 c:['O resgate','Achei meu amigo dentro do lago, com a água até o pescoço, sem saber como foi parar lá.',['Puxar para fora|k+6 hl-3 >e|Ele disse que uma moça chamou o nome dele.','Chamar ajuda|>e|Os outros correram para ajudar.']],
 d:['Amanhecer','De manhã, o amigo estava dormindo na beira do lago, encharcado.',['Ir embora na hora|h-3|Nunca mais acampamos ali.','Perguntar o que houve|>e|Ele não lembrava de nada.']],
 e:['Nunca mais','Arrumamos as barracas e fomos embora antes do almoço.',['Contar para o guarda do parque|>f|Ele disse que todo ano alguém tem a mesma história.','Prometer nunca mais voltar|h+2|Pacto feito no carro.']],
 f:['A lenda é verdade','O guarda mostrou um recorte de jornal: a moça se afogou em 1979, procurando o noivo que tinha caído no lago.',['Deixar flores no lago|k+5 h+4|No ano seguinte, ninguém sumiu da barraca.','Ir embora|h+0|Algumas histórias ficam no lago.']],
});
chain('casa_vizinha_vazia',{k:'Assombração',min:10,max:85,when:LIVRE,w:.35,gap:[1,1]},{
 a:['A casa ao lado','A casa ao lado está vazia há anos, mas toda noite a luz da cozinha acende às oito.',['Avisar a imobiliária|>b|Disseram que a energia está cortada.','Espiar pela janela|>c|Uma mesa posta para dois e ninguém sentado.']],
 b:['Sem energia','Mesmo sem energia, a luz acendeu de novo às oito.',['Entrar na casa|>c|A porta dos fundos estava destrancada.','Esquecer|>d@1|Fingir que não é comigo.']],
 c:['O jantar','Na cozinha, uma carta em cima da mesa: "Para quando você voltar."',['Ler a carta|>d|Uma esposa esperando o marido que nunca voltou da guerra.','Deixar onde estava|k+2 >d|Não é minha para ler.']],
 d:['O marido','Descobri que o marido morreu num hospital da cidade vizinha, sem que ela soubesse.',['Levar a notícia ao túmulo dela|k+8 h+6|Naquela noite, a luz da cozinha não acendeu.','Contar aos vizinhos|f+1 h+3|A rua inteira passou a deixar flores na porta.']],
});
