// ===== Histórias paranormais em cadeia para qualquer pessoa (3): bruxas, duplos, outras vidas e cultos =====
chain('casa_bruxa',{k:'Bruxaria',min:18,max:85,when:LIVRE,w:.4,gap:[1,1]},{
 a:['A herança estranha','Uma tia distante que eu mal conhecia me deixou a casa dela no interior. Os vizinhos dizem que ela era bruxa.',['Ir conhecer a casa|>b|Ervas penduradas, gatos por todo lado e um cheiro de incenso.','Vender sem ver|$+40000 h+2|Dinheiro na conta, mistério para sempre.']],
 b:['O grimório','No porão, um livro de capa de couro com receitas, rezas e feitiços escritos à mão.',['Ler o livro|sm+3 >c|Tem um feitiço para cada problema da vida.','Queimar o livro|>e|O fogo ficou verde.']],
 c:['O primeiro feitiço','Testei um feitiço simples de sorte.',['Fazer certinho|?50 $+2000 h+8 >d|No dia seguinte, achei dinheiro na rua. Muito dinheiro.|h-4 >d|Nada aconteceu. Ou quase: meu cabelo ficou azul por um dia.','Desistir no meio|>d|Senti que algo me observava.']],
 d:['O preço','A última página do grimório avisa: "Todo feitiço cobra um preço. Sempre."',['Parar de usar|k+3 h+3 >f|Guardei o livro num lugar seguro.','Fazer um feitiço maior|?40 $+15000 f+3 >g|Funcionou. Mas o espelho do banheiro rachou sozinho.|hl-15 >g|O feitiço deu errado e passei uma semana de cama.']],
 e:['Os gatos','Os gatos da tia começaram a me seguir pela casa, como se esperassem algo.',['Cuidar dos gatos|pet k+5 h+6 >f|Sete gatos agora são meus.','Doar os gatos|k-2 >f|Na mesma noite, a casa ficou fria.']],
 f:['A vizinha','Uma vizinha idosa bateu na porta pedindo uma "simpatia" que minha tia fazia.',['Ajudar com o que aprendi|k+6 f+2 >h|A vizinha voltou dias depois, curada de uma dor antiga.','Dizer que não sei fazer|h+0|Ela foi embora decepcionada.']],
 g:['A cobrança','O preço veio: perdi algo que eu amava.',['Aceitar e parar de vez|h-10 k+4|Aprendi da pior forma.','Tentar desfazer com outro feitiço|?30 h+8|Consegui desfazer.|hl-20|Piorei tudo.']],
 h:['A nova bruxa da cidade','A cidade começou a me procurar como procuravam minha tia.',['Assumir o papel|f+3 k+5 $+3000|Chás, rezas e conselhos. Virei a nova benzedeira da região.','Vender a casa e ir embora|$+40000|Não é a minha vida.']],
});
chain('duplo',{k:'Mistério',min:16,max:85,when:LIVRE,w:.35,gap:[1,1]},{
 a:['Eu mesm{o}','Uma amiga jurou que me viu no shopping ontem. Eu estava em casa o dia inteiro.',['Rir|>b|Deve ser alguém parecido.','Perguntar detalhes|>b|"Você estava com a mesma roupa que está agora."']],
 b:['De novo','Mais três pessoas disseram ter me visto em lugares onde eu não estive.',['Investigar|>c|Fui aos lugares. Ninguém lembrava de nada.','Ignorar|h-3 >d|Comecei a ficar paranoic{o}.']],
 c:['O encontro','No metrô, vi alguém igual a mim do outro lado da plataforma. Ela sorriu.',['Correr até lá|>d|O trem passou. Do outro lado, ninguém.','Ficar paralisad{o}|h-6 >d|Senti um frio que não passava.']],
 d:['O aviso','Dizem que ver o próprio duplo é um aviso.',['Ir ao médico fazer exames|$-500 ?50 hl+5 >e|Descobri um problema cedo e tratei. O duplo me salvou.|>e|Tudo normal.','Mudar a rotina toda|h+2 >e|Se é aviso, vou ser cuidados{o}.']],
 e:['Nunca mais','O duplo nunca mais apareceu.',['Agradecer|h+4|Se era aviso, funcionou.','Ficar com medo dele voltar|h-2|Às vezes olho duas vezes para o espelho.']],
});
chain('outra_vida',{k:'Mistério',min:5,max:30,when:LIVRE,w:.35,gap:[1,2]},{
 a:['Lembranças estranhas','Desde pequen{o}, lembro de uma casa à beira-mar que nunca visitei e de um nome que não é o meu.',['Contar para os pais|>b|Eles acharam que era imaginação.','Guardar para mim|>c@2|As lembranças continuam.']],
 b:['Os desenhos','Desenhei a casa tantas vezes que meus pais começaram a se preocupar.',['Pesquisar na internet|>c|Achei uma foto de uma casa igual, numa cidade do litoral.','Parar de desenhar|h-2 >c|Mas os sonhos continuam.']],
 c:['A viagem','Fui até a cidade do litoral.',['Procurar a casa|>d|Ela existe. Exatamente como eu lembrava.','Desistir na porta|h-3|Tive medo do que ia descobrir.']],
 d:['A dona da casa','Uma senhora abriu a porta. Eu disse o nome que lembrava, e ela começou a chorar.',['Perguntar quem era|>e|Era o nome do marido dela, que morreu no mar há trinta anos.','Pedir desculpas e ir embora|h-4|Não tive coragem.']],
 e:['Reconhecimento','Contei detalhes da casa que só o marido dela saberia. Ela segurou minhas mãos.',['Visitar sempre|h+12 k+5|Ela virou uma avó para mim.','Nunca mais voltar|h+3|Algumas coisas precisam ficar no passado.']],
});
chain('anjo_guarda',{k:'Mistério',min:6,max:85,when:LIVRE,w:.35,gap:[1,2]},{
 a:['O estranho','Quase fui atropelad{o}. Um desconhecido me puxou pelo braço no último segundo.',['Agradecer|>b|Ele só disse: "Ainda não é a sua hora." E sumiu na multidão.','Ficar em choque|h-3 >b|Quando olhei, ele não estava mais lá.']],
 b:['De novo','Anos depois, num incêndio, a mesma pessoa me guiou até a saída.',['Perguntar quem é|>c|"Alguém que cuida de você há muito tempo."','Seguir sem perguntar|>c|Quando saí, ninguém tinha visto ninguém comigo.']],
 c:['A foto antiga','Numa foto antiga da família, o estranho aparece ao lado do meu avô, em 1950. Igual, sem envelhecer.',['Perguntar à família|>d|Minha avó disse: "Ele também salvou seu avô."','Guardar a foto|h+4 >d|Agora sei que não estou só.']],
 d:['A última vez','Muito tempo depois, ele apareceu mais uma vez. Sorriu e acenou de longe.',['Acenar de volta|h+10|Senti uma paz enorme.','Ir atrás dele|h+4|Ele sumiu de novo. Mas eu sei que volta quando precisar.']],
});
chain('culto_mata',{k:'Mistério',min:16,max:70,when:LIVRE,w:.35,gap:[1,1]},{
 a:['Os encapuzados','Numa noite, vi gente encapuzada entrando na mata com tochas.',['Seguir de longe|>b|Eles formaram um círculo numa clareira.','Chamar a polícia|>e|A polícia não achou nada.','Ir para casa|>f@1|Melhor não me meter.']],
 b:['O ritual','No círculo, cantavam numa língua estranha. No centro, um altar de pedra.',['Fotografar|?50 >c|Consegui fotos claras dos rostos.|>d|O flash disparou.','Ir embora em silêncio|>f|Saí sem fazer barulho.']],
 c:['Os rostos','Reconheci um vereador e o dono da maior loja da cidade nas fotos.',['Levar à imprensa|f+6 >g|A história explodiu.','Usar para chantagem|k-12 $+20000 >d|Eles pagaram. E começaram a me vigiar.']],
 d:['Descobert{o}','Eles me viram. Agora sinto que estou sendo seguid{o}.',['Mudar de cidade|$-6000 h-4|Fugi antes que fosse tarde.','Enfrentar|?k >g|Fui à delegacia com tudo o que sabia.|hl-15|Uma noite, me cercaram na rua.']],
 e:['Nada encontrado','A polícia disse que era só uma festa de fantasia.',['Insistir|>b@1|Na lua seguinte, voltei sozinh{o}.','Desistir|h-2|Mas toda lua cheia eu vejo as tochas.']],
 f:['Os sumiços','O jornal fala de animais sumindo na região. E de um rapaz desaparecido.',['Voltar à mata|>b|Agora é sério.','Avisar a família do rapaz|k+5 >e|Eles foram à polícia comigo.']],
 g:['O fim do culto','A polícia prendeu os membros do culto. O rapaz desaparecido foi encontrado vivo.',['Dar entrevista|f+5 k+8|Virei herói da cidade.','Ficar no anonimato|k+8 h+6|Fiz o que tinha que fazer.']],
});
chain('anel_maldito',{k:'Maldição',min:16,max:85,when:LIVRE,w:.35,gap:[1,1]},{
 a:['O anel','Achei um anel de ouro com uma pedra vermelha num brechó. Coube perfeitamente.',['Comprar|$-200 >b|O vendedor disse: "Ninguém nunca conseguiu tirar esse anel."','Deixar lá|h+0|Mas fiquei pensando nele por dias.']],
 b:['A sorte','Desde que coloquei o anel, tudo dá certo: promoção, dinheiro, amor.',['Aproveitar|$+5000 h+10 >c|Que fase!','Desconfiar|>c|Sorte demais assusta.']],
 c:['O preço','Ao meu redor, as pessoas começaram a ter azar: acidentes, doenças, perdas.',['Tentar tirar o anel|>d|Não sai. Nem com sabão, nem com gelo.','Ignorar|k-6 >d|Não é culpa minha. Ou é?']],
 d:['A dona','Pesquisei: o anel pertenceu a uma condessa que fez um pacto para ter sorte.',['Procurar quem desfaça o pacto|$-3000 ?50 h+8|Uma rezadeira tirou o anel com um fio de linha. Acabou.|>e|Não funcionou.','Aceitar a maldição|k-8 $+10000|Continuo com sorte. Os outros, não.']],
 e:['O sacrifício','A única forma de tirar o anel é abrir mão de toda a sorte que ele trouxe.',['Abrir mão|$-8000 k+10 h+4|O anel caiu do dedo sozinho. Joguei no mar.','Ficar com ele|k-10|O anel é meu. E eu sou dele.']],
});
chain('investigador_podcast',{k:'Paranormal',min:16,max:70,when:m=>!!m.para&&m.para.visitas>=1&&!m.prison,w:.6,npc:1,gap:[1,1]},{
 a:['O podcast','{p}, que tem um podcast sobre mistérios, ouviu falar das minhas investigações e quer me entrevistar.',['Dar a entrevista|f+2 vira:amigo >b|O episódio foi o mais ouvido do mês.','Recusar|h+0|Prefiro trabalhar em silêncio.']],
 b:['A parceria','{p} propôs fazermos um programa juntos, investigando lugares assombrados.',['Topar|>c|Microfones, câmeras e uma van velha.','Recusar|bond-5|{p} achou outro parceiro.']],
 c:['O primeiro episódio','Primeira investigação: um hospital psiquiátrico abandonado.',['Ir de noite|?50 f+5 follow+20000 >d|Captamos uma voz clara pedindo ajuda. Viralizou.|hl-8 >d|Uma porta bateu na minha mão. Mas o episódio ficou ótimo.','Ir de dia|f+2 >d|Menos medo, menos audiência.']],
 d:['O sucesso','O programa virou o maior podcast de mistério do país.',['Assinar com uma plataforma grande|$+40000 f+6 >e|Contrato de três temporadas.','Manter independente|f+3 k+3 >e|Liberdade acima de tudo.']],
 e:['O episódio proibido','Para o final da temporada, {p} quer investigar um lugar onde três investigadores sumiram.',['Ir|?k f+10 $+20000|Voltamos com o maior episódio da história do programa.|hl-25 h-15|Só eu voltei. {p} nunca foi encontrad{o2}.','Recusar|bond-10|{p} foi com outra pessoa. Voltaram, mas nunca mais foram os mesmos.']],
});
chain('sessao_espirita',{k:'Mistério',min:16,max:85,when:m=>!m.prison&&S.people.some(p=>!p.alive&&['mae','pai','avo','irmao','conjuge','filho','amigo'].includes(p.rel)),w:.5,gap:[1,1]},{
 a:['Saudade de quem foi','Uma amiga me convidou para uma sessão espírita. Disse que eu poderia receber notícias de quem já partiu.',['Ir|>b|Uma sala simples, luz baixa e gente de mãos dadas.','Recusar|h+0|Prefiro guardar a saudade do meu jeito.']],
 b:['A mensagem','A médium disse um apelido que só a pessoa que eu perdi usava comigo.',['Pedir mais|>c|"Ela diz que está bem. E que você precisa parar de se culpar."','Ficar em choque|h+4 >c|Ninguém sabia daquele apelido.']],
 c:['O alívio','Saí de lá mais leve do que entrei.',['Voltar outras vezes|h+6 >d|Virou um consolo mensal.','Não voltar nunca mais|h+8|Recebi o que precisava. Uma vez basta.']],
 d:['A dependência','Comecei a ir toda semana. Gasto dinheiro e tempo esperando novas mensagens.',['Parar e viver o luto de verdade|h+6 k+3|A pessoa que eu perdi ia querer que eu vivesse.','Continuar|$-2000 h-3|Não consigo largar.']],
});
