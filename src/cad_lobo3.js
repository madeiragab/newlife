// ===== Histórias em cadeia: a vida de lobisomem (3) =====
chain('lobo_cacadores_familia',{k:'Lobisomem',min:16,max:120,when:LOBO,npc:1,gn:'M',age:[0,25],gap:[1,1]},{
 a:['A família de caçadores','Uma família de caçadores de lobisomens, os {pl}, se mudou para a minha rua.',['Ficar de olho neles|>b|Armas de prata penduradas na parede da sala.','Mudar de rua|$-3000 h-2|Não vou esperar para ver.']],
 b:['O filho','O filho mais novo dos caçadores, {p}, quer ser meu amigo. Não sabe o que eu sou.',['Fazer amizade|vira:amigo >c|Ele é gente boa. Muito diferente do pai.','Manter distância|>d|Amizade com caçador é suicídio.']],
 c:['A descoberta','{p} descobriu a verdade numa lua cheia, me vendo pela janela.',['Pedir para ele não contar|?bond >e|Ele prometeu. E cumpriu.|>d|Ele contou para o pai.','Fugir naquela noite|$-4000 h-4|Antes que o pai dele soubesse.']],
 d:['A caçada','O pai de {p} montou uma caçada na lua cheia.',['Enfrentar|?fight-10 k-4 >f|Desarmei o caçador e fugi.|hl-30 >f|A bala de prata passou de raspão.','Me esconder em outra cidade na lua cheia|$-1000 >e|O pai ficou esperando à toa.']],
 e:['O segredo guardado','{p} guardou meu segredo, mesmo sendo filho de caçador.',['Retribuir a amizade|bond+15 h+8|Quando ele precisou, eu estava lá.','Agradecer e manter distância|h+3|Pelo bem dele.']],
 f:['A trégua','O caçador me encontrou ferid{o} e pensou duas vezes.',['Falar com ele|?k k+6|Ele baixou a arma: "Meu filho diz que você é bom." Trégua.|hl-15|Ele não quis ouvir.','Fugir|h-3|Mais uma vida em fuga.']],
});
chain('lobo_cura',{k:'Lobisomem',min:16,max:120,when:LOBO,npc:1,gn:'F',age:[20,50],gap:[1,1]},{
 a:['A curandeira','Uma curandeira do interior, dona {p}, diz que sabe curar a maldição do lobo.',['Ir até ela|$-500 >b|Uma casa de barro no meio da mata.','Achar que é golpe|>e@2|Mais uma charlatã.']],
 b:['O ritual','Dona {p} disse que o ritual precisa de três luas cheias seguidas, sem eu matar nada.',['Aceitar o desafio|?will fome+20 >c|Três luas acorrentad{o}, sem matar nenhum bicho.|fome+30 >d|Na segunda lua, cacei um javali.','Desistir|h-2|Três luas é demais.']],
 c:['A última lua','Na terceira lua, dona {p} acendeu uma fogueira e cantou a noite inteira.',['Aguentar até o fim|?50 curar h+25|Ao amanhecer, a fera foi embora para sempre.|hl-20 h-6 >d|Não funcionou desta vez.','Pedir para parar|h-4 >d|A dor foi demais.']],
 d:['De novo','Dona {p} disse que posso tentar de novo no ano que vem.',['Voltar ano que vem|>b@1|Desta vez vai.','Aceitar a fera|h+4|Talvez eu não queira deixar de ser quem sou.']],
 e:['A curiosidade','Não paro de pensar na curandeira.',['Ir finalmente|$-500 >b|Pelo menos tentar.','Esquecer|h+0|Já me acostumei com a lua.']],
});
chain('lobo_festa_fantasia',{k:'Lobisomem',min:16,max:60,when:LOBO,gap:[1,1]},{
 a:['Festa à fantasia','Uma festa à fantasia vai acontecer justo na noite de lua cheia.',['Ir fantasiad{o} de lobisomem|>b|Ironia perfeita.','Ficar em casa|h-2|Prefiro não arriscar.']],
 b:['A transformação na festa','À meia-noite, a fantasia ficou real. Ninguém percebeu a diferença.',['Curtir a festa como fera|?will h+15 f+3 >c|Ganhei o concurso de melhor fantasia.|>d|A fome começou a apertar.','Sair antes de perder o controle|k+3 h+4|Saí pelos fundos.']],
 c:['O prêmio','"Melhor fantasia do ano: lobisomem realista." Recebi o prêmio com a voz rouca.',['Aceitar o prêmio|h+10 f+3|A foto da fera com o troféu virou lenda.','Sair correndo antes de alguém tocar no pelo|h+6|Melhor não.']],
 d:['A fome','A fera quer caçar. A festa está cheia de gente.',['Correr para a mata|fome-20 k+3|Cacei um coelho e voltei para casa.','Atacar|fome-80 k-15 arrest:lesão_corporal:1:3|Mordi alguém. A polícia achou que era uma briga de fantasia.']],
});
chain('lobo_filho',{k:'Lobisomem',min:22,max:120,who:'kidpara',when:LOBO,gap:[1,1]},{
 a:['A primeira lua do filho','{p} teve a primeira transformação. Chorou de dor e de medo.',['Ficar com {ele} a noite toda|bond+15 h+4 >b|Corremos juntos pela mata. Eu cuidei d{ele}.','Acorrentar {p} no porão|bond-8 >c|Para segurança de todos.']],
 b:['A matilha da família','Agora somos uma pequena matilha: eu e {p}.',['Ensinar a caçar animais, nunca pessoas|k+5 bond+10 >d|{p} aprende rápido.','Deixar {ele} aprender sozinh{o2}|bond-5 >c|Cada lobo tem seu caminho.']],
 c:['A revolta','{p} acha que eu escondi demais a verdade e está com raiva.',['Conversar|?bond bond+12 >d|Choramos juntos. Agora entendemos um ao outro.|bond-10 >d|{p} saiu batendo a porta.','Dar espaço|>d|O tempo cura.']],
 d:['O futuro','{p} está aprendendo a viver com a fera.',['Ter orgulho|h+10 bond+8|A fera não é maldição quando há amor.','Procurar uma cura para {ele}|$-5000 >e|Talvez {p} mereça uma vida normal.']],
 e:['A escolha d{ele}','Encontrei uma possível cura. {p} precisa decidir.',['Respeitar a escolha|bond+10|{p} escolheu continuar como é. E eu entendi.','Insistir na cura|bond-15|{p} se afastou de mim por um tempo.']],
});
chain('lobo_vizinho_desconfia',{k:'Lobisomem',min:16,max:120,when:LOBO,npc:1,gn:'M',age:[10,40],gap:[1,1]},{
 a:['O vizinho curioso','{p}, o vizinho da frente, anotou que eu sumo sempre na lua cheia.',['Inventar uma viagem mensal|?40 >d|"Visito minha mãe todo mês."|>b|{p} ficou ainda mais curios{o2}.','Ignorar|>b|Ele que pense o que quiser.']],
 b:['A câmera','{p} instalou uma câmera virada para a minha casa.',['Conversar|>c|Bati na porta para tirar a dúvida d{ele}.','Desviar a rota para os fundos|>d|Saio pelo quintal de trás.']],
 c:['A conversa','{p} disse que viu "um cachorro enorme" saindo da minha casa.',['Dizer que é um cachorro que eu cuido|?50 >d|Ele riu: "Lindo bicho." Colou.|>e|"Mas você não tem cachorro."','Contar a verdade|>e|Arrisquei.']],
 d:['Paz','{p} desistiu de investigar.',['Levar um bolo de agradecimento|vira:amigo h+4|Bom vizinho é aquele que não pergunta demais.','Seguir discret{o}|h+2|Melhor assim.']],
 e:['O segredo','{p} ouviu tudo de boca aberta.',['Pedir segredo|?k vira:amigo h+6|Ele guarda até hoje. Às vezes até me avisa quando vem gente.|f+2 h-6|Ele contou para o bairro inteiro.','Mudar de casa|$-5000 h-2|Recomeço.']],
});
chain('lobo_ferido',{k:'Lobisomem',min:16,max:120,when:LOBO,gap:[1,1]},{
 a:['Atropelad{o}','Na forma de lobo, fui atropelad{o} numa estrada. Acordei humano, numa vala.',['Ir para o hospital|>b|Os médicos ficaram intrigados.','Me curar sozinh{o}|hl-15 >c|Lobisomem sara rápido.']],
 b:['Os exames','Os ossos estão se regenerando rápido demais. O médico chamou colegas para ver.',['Fugir do hospital|>c|Saí pela janela de pijama.','Inventar uma doença rara|?sm >c|Disseram que é "condição genética".|>d|O médico ficou de olho em mim.']],
 c:['Recuperação','Em uma semana, estava novinh{o}.',['Agradecer à fera|hl+10 h+6|Às vezes a maldição é uma bênção.','Ficar mais cuidados{o} nas estradas|k+2 h+3|Lua cheia longe de asfalto.']],
 d:['O médico','O médico apareceu na minha casa: "Quero estudar sua regeneração."',['Aceitar|$+5000 >c|Doei sangue para a pesquisa, em segredo.','Recusar|h-2 >c|Não vou virar experimento.']],
});
