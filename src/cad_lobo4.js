// ===== Histórias em cadeia: a vida de lobisomem (4) =====
chain('lobo_selvagem',{k:'Lobisomem',min:16,max:120,when:LOBO,gap:[1,1]},{
 a:['O lobisomem selvagem','Um lobisomem sem controle está matando pessoas na região. Todos vão achar que fui eu.',['Caçar o selvagem|>b|Segui o cheiro de sangue pela mata.','Ficar escondid{o}|>c|Melhor não aparecer.']],
 b:['O encontro','O selvagem é maior que eu, e não tem nada de humano nos olhos.',['Lutar|?fight-10 k+10 f+0 >d|Venci. Ao amanhecer, era um homem sem nome, sem passado.|hl-35 >e|Ele quase me matou.','Tentar acalmar|?k >f|Ele parou. Por um segundo, vi alguém lá dentro.|hl-25 >e|Não adiantou.']],
 c:['O medo da cidade','A cidade inteira está com medo. Montaram grupos de caça.',['Caçar o selvagem antes deles|>b|Não posso deixar inocentes morrerem.','Sair da cidade até passar|$-3000 h-3|Fui para longe.']],
 d:['Paz na mata','Os ataques pararam. A mata voltou a ser segura.',['Enterrar o selvagem com respeito|k+5 h+3|Ele também foi vítima de uma mordida.','Contar aos caçadores que acabou|f+2|Eles nunca souberam quem matou a fera.']],
 e:['Ferid{o} na mata','Fugi ferid{o}. O selvagem ainda está solto.',['Pedir ajuda à alcateia|>b@1|Juntos somos mais fortes.','Me recuperar e tentar de novo|fight+5 >b@1|Desta vez, mais preparad{o}.']],
 f:['O humano lá dentro','Consegui acalmar o selvagem. Ele virou homem e chorou: não sabia o que tinha feito.',['Ajudar ele a se controlar|k+12|Ensinei tudo o que sei. Ele nunca mais matou.','Levar para uma alcateia|k+6|Eles cuidam dos seus.']],
});
chain('lobo_sentidos',{k:'Lobisomem',min:16,max:120,when:LOBO,gap:[1,2]},{
 a:['O mundo mais alto','Desde a mordida, escuto conversas a três quadras e sinto o cheiro de mentira.',['Usar a meu favor|sm+3 >b|Sei quando alguém está mentindo para mim.','Sofrer com o barulho|h-4 >c|A cidade é alta demais.']],
 b:['O detector de mentiras','Num negócio importante, senti o cheiro de mentira do outro lado da mesa.',['Recusar o negócio|$+0 k+3 >d|Depois soube: era um golpe.','Usar para negociar melhor|$+5000 >d|Ganhei a negociação.']],
 c:['O excesso','O barulho da cidade me deixa irritad{o} e com dor de cabeça.',['Mudar para o interior|$-5000 h+8 >d|Silêncio, mato e passarinhos.','Usar protetor de ouvido|h+2 >d|Ajuda um pouco.']],
 d:['Equilíbrio','Aprendi a ligar e desligar os sentidos como um rádio.',['Usar com sabedoria|sm+3 h+5|Um dom, não uma maldição.','Ajudar a polícia a achar pessoas|k+6|Meu faro já salvou gente.']],
});
chain('lobo_casamento_lua',{k:'Lobisomem',min:20,max:120,when:m=>LOBO(m)&&!!partner()&&partner().rel==='noivo',who:'partner',gap:[1,1]},{
 a:['A data do casamento','A data do casamento caiu justo numa noite de lua cheia.',['Mudar a data|pbond-3 >b|"Vamos adiar uma semana, amor?"','Casar de manhã e fugir antes do anoitecer|>c|Corrida contra o sol.']],
 b:['A explicação','{p} quer saber por que mudar a data.',['Contar a verdade|?bond pbond+10 >c|{p} riu e chorou: "Então é por isso que você some todo mês!"|separar h-12|{p} não aguentou a verdade.','Inventar desculpa|>c|A desculpa colou.']],
 c:['O grande dia','O casamento foi lindo. A lua nasceu durante a valsa.',['Correr para a mata antes da transformação|casar h+15 pbond+8|Saí correndo da festa. Os convidados acharam romântico.','Ficar até o fim|casar ?will h+18 pbond+10|Segurei a fera até o último convidado ir embora.|casar h+5 f+3|Me transformei na pista de dança. Disseram que foi a fantasia mais realista que já viram.']],
});
chain('lobo_idade',{k:'Lobisomem',min:50,max:120,when:LOBO,gap:[2,3]},{
 a:['Lobo velho','Com a idade, as transformações doem mais e demoram a passar.',['Procurar um jeito de aliviar|$-1000 >b|Chás, ervas e fisioterapia.','Aguentar|hl-5 >b|A fera não liga para a idade.']],
 b:['O respeito','A alcateia trata os lobos velhos com respeito. Sou consultad{o} para tudo.',['Aconselhar os jovens|k+6 h+6 >c|Experiência vale mais que força.','Preferir ficar sozinh{o}|h-2 >c|Lobo velho gosta de silêncio.']],
 c:['A última corrida','Numa lua cheia, senti que poderia ser minha última corrida pela mata.',['Correr com toda a força|h+15 hl-5|Corri como na primeira vez.','Ficar na varanda vendo a lua|h+8|Ver a lua também é bonito.']],
});
chain('lobo_lua_vermelha',{k:'Lobisomem',min:16,max:120,when:LOBO,gap:[2,3]},{
 a:['A lua de sangue','Um eclipse vai deixar a lua vermelha. Os lobos antigos dizem que, nessa noite, a fera fica três vezes mais forte.',['Me acorrentar com o dobro de correntes|>b|Correntes de navio, no porão.','Ir para longe de tudo|>c|Uma cabana no meio da serra.']],
 b:['As correntes','A fera arrebentou duas correntes. A terceira segurou.',['Agradecer à terceira corrente|h+4 >d|Comprei mais três para a próxima.','Ficar com medo do que a fera é capaz|h-6 >d|Nunca senti tanta força.']],
 c:['A serra','Na serra, a fera correu livre a noite inteira.',['Voltar ao amanhecer|fome-50 h+6 >d|Nunca me senti tão viv{o}.','Encontrar outros lobos na serra|>e|Uma alcateia inteira tinha a mesma ideia.']],
 d:['O dia seguinte','Acordei exaust{o}, mas em paz. Ninguém se machucou.',['Anotar a data da próxima lua de sangue|sm+2|Daqui a três anos. Preparad{o}.','Comemorar|h+6|Sobrevivi à noite mais difícil.']],
 e:['A alcateia da serra','Os lobos da serra me convidaram para correr com eles toda lua de sangue.',['Aceitar|h+10|Uma família que só se encontra quando a lua sangra.','Agradecer e voltar sozinh{o}|h+4|Prefiro minha liberdade.']],
});
chain('lobo_pet',{k:'Lobisomem',min:16,max:120,when:LOBO,who:'pet',gap:[1,1]},{
 a:['O bicho de estimação','{p}, meu bicho de estimação, percebe a fera antes de todo mundo. Na lua cheia, se esconde embaixo da cama.',['Deixar com um vizinho nas luas cheias|k+3 >b|Ele fica seguro longe de mim.','Ficar com ele em casa|>c|Ele sempre foi meu companheiro.']],
 b:['Saudade','O vizinho perguntou por que eu sempre "viajo" na lua cheia.',['Inventar um motivo|h+0 >d|Visita à família.','Contar a verdade|?k >d|O vizinho achou que era piada, mas continuou cuidando.|>d|O vizinho ficou com medo e devolveu o bicho.']],
 c:['A noite','Na lua cheia, a fera olhou para {p}, embaixo da cama.',['Controlar a fera|?will k+5 h+8 >d|A fera deitou do lado dele e dormiu. Ele também.|petdie h-25 >d|A fera venceu. Nunca vou me perdoar.']],
 d:['Companheiros','{p} aprendeu a conviver com a fera. Às vezes até deita do meu lado na lua cheia.',['Fazer carinho|h+8|Ele sabe quem eu sou, por dentro.','Comprar um petisco especial|$-50 h+6|Recompensa merecida.']],
});
chain('lobo_historia',{k:'Lobisomem',min:16,max:120,when:LOBO,gap:[1,2]},{
 a:['De onde veio a maldição','Quero entender de onde veio a maldição do lobo.',['Pesquisar em bibliotecas antigas|sm+4 >b|Livros em latim, contos de aldeias.','Perguntar aos lobos mais velhos|>c|Eles sabem histórias que não estão em livro.']],
 b:['O primeiro lobo','Os livros falam de um caçador amaldiçoado por uma bruxa por ter matado o último lobo de uma floresta.',['Procurar a floresta|>d|Ainda existe, no norte.','Escrever um livro sobre isso|tal.writing+5 f+2|Vendeu como ficção. Ninguém sabe que é verdade.']],
 c:['A lenda contada','O lobo mais velho contou: a primeira mordida foi um ato de amor, para salvar alguém que estava morrendo.',['Ver a maldição com outros olhos|h+8 k+3 >d|Talvez não seja só maldição.','Continuar pesquisando|>b|Quero a história inteira.']],
 d:['A floresta do norte','Na floresta, um túmulo antigo com a marca de uma pata.',['Deixar uma oferenda|k+6 h+8|Senti uma paz que nunca tinha sentido em lua cheia.','Levar um pouco da terra|h+4|Guardo num vidrinho, como amuleto.']],
});
chain('lobo_acampamento',{k:'Lobisomem',min:16,max:60,when:LOBO,gap:[1,1]},{
 a:['O acampamento','Os amigos marcaram um acampamento na serra. Só depois vi que cai na lua cheia.',['Inventar uma desculpa para não ir|h-2 >e|Fiquei em casa ouvindo as histórias depois.','Ir e dar um jeito|>b|Levei correntes escondidas na mochila.']],
 b:['A fogueira','A lua está subindo. Os amigos contam histórias de lobisomem em volta da fogueira.',['Sair "para buscar lenha"|>c|Corri para longe do acampamento.','Ficar mais um pouco|?will h+6 >c|Segurei até a última história.|>d|A transformação começou na frente de todo mundo.']],
 c:['A noite na mata','Passei a noite correndo pela serra, longe de todos.',['Voltar antes do amanhecer|fome-30 h+6 >e|Cheguei de manhã dizendo que me perdi procurando lenha.','Voltar atrasad{o}|>d|Os amigos estavam procurando por mim com lanternas.']],
 d:['Visto','Um dos amigos me viu meio humano, meio lobo, sob a luz da lanterna.',['Pedir segredo|?k h+4 >e|Ele guardou. Hoje é meu melhor amigo.|f+2 h-8|Ele contou para todos. Ninguém acreditou, mas ficou o clima.','Dizer que ele estava sonhando|?40 >e|Ele acreditou: "Bebi demais."|>e|Ele sabe o que viu.']],
 e:['A volta','O acampamento virou uma história que todos contam diferente.',['Rir junto|h+6|A melhor lenda da turma.','Prometer nunca mais acampar em lua cheia|h+2|Lição aprendida.']],
});
chain('lobo_ritual_alcateia',{k:'Lobisomem',min:18,max:120,when:LOBO,npc:1,gn:'F',age:[10,40],gap:[1,1]},{
 a:['O convite da anciã','{p}, a mais velha das alcateias da região, me convidou para o ritual da Primeira Lua do ano.',['Ir|>b|Um círculo de pedras no alto de uma colina.','Recusar|h+0|Não sou de rituais.']],
 b:['O ritual','Todos se transformam ao mesmo tempo e uivam juntos para a lua.',['Uivar com eles|h+12 >c|Nunca me senti tão parte de algo.','Ficar só olhando|h+4 >c|Uma beleza estranha.']],
 c:['A bênção','{p} marcou minha testa com cinzas: "Agora você é da família da lua."',['Aceitar a família|vira:amigo h+10 k+4 >d|Tenho irmãos em todas as alcateias.','Agradecer|h+6|Uma noite para lembrar.']],
 d:['A missão','{p} me pediu para proteger um filhote recém-mordido que está sozinho na cidade.',['Aceitar|k+10 >e|Encontrei o filhote escondido numa obra.','Recusar|bond-10|{p} ficou decepcionada.']],
 e:['O filhote protegido','O filhote cresceu sob a minha proteção e aprendeu a controlar a fera.',['Ter orgulho|h+10 k+5|Mais um que não vai virar monstro.','Devolver para a alcateia|h+6|Ele tem uma família agora.']],
});
chain('lobo_dia_normal',{k:'Lobisomem',min:16,max:120,when:LOBO,gap:[2,3]},{
 a:['Um mês sem lua','Neste mês, não haverá lua cheia, por um capricho do calendário.',['Aproveitar para viver como humano|h+10 >b|Saí, dancei, dormi tranquil{o}.','Ficar ansios{o} esperando a próxima|h-3 >b|A fera fica inquieta.']],
 b:['A falta da fera','Estranho: senti falta da fera.',['Aceitar que ela faz parte de mim|h+8 >c|Somos dois em um.','Procurar uma cura|>c|Talvez eu queira ser só um.']],
 c:['A volta da lua','A lua cheia voltou. A fera também.',['Correr feliz|fome-30 h+10|Voltei para casa.','Aguentar com paciência|h+4|Mais uma lua.']],
});
