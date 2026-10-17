// ===== Histórias paranormais em cadeia para qualquer pessoa (4): encontros, fenômenos e assombrações de família =====
chain('cidade_fantasma',{k:'Mistério',min:18,max:75,when:LIVRE,w:.35,gap:[1,1]},{
 a:['A cidade do mapa antigo','Num mapa antigo, achei uma cidade que não existe mais nos mapas novos.',['Ir até lá|$-500 >b|Estrada de terra, mato alto e uma placa enferrujada.','Pesquisar antes|sm+2 >b|Ninguém sabe por que ela foi abandonada em 1952.']],
 b:['As ruas vazias','A cidade está intacta: casas mobiliadas, mesas postas, relógios parados às 18h40.',['Entrar numa casa|>c|O jantar ainda estava nos pratos, petrificado.','Fotografar tudo|f+2 >c|As fotos saem com vultos nas janelas.']],
 c:['O sino','Às 18h40, o sino da praça tocou sozinho. As luzes das casas acenderam.',['Ficar para ver|>d|Vultos começaram a andar pelas ruas, como numa tarde normal.','Correr para o carro|h-5 >e|O carro não pegava.']],
 d:['A noite de 1952','Os vultos repetem a última noite da cidade. Uma criança me puxou pela mão até a igreja.',['Seguir a criança|>f|Na igreja, um livro de registros aberto numa página.','Soltar a mão e fugir|h-6 >e|Corri até o carro.']],
 e:['Fuga','O carro finalmente pegou. Pelo retrovisor, a cidade inteira me olhava da praça.',['Nunca mais voltar|h-3|Mas sonho com o sino toda noite.','Voltar de dia para entender|>f@1|Precisava saber.']],
 f:['O registro','O livro conta: uma barragem estourou às 18h40 e a cidade inteira foi soterrada pela lama. Nunca acharam os corpos.',['Contar para o mundo|f+6 k+5|Um documentário foi feito. A cidade ganhou um memorial.','Rezar pelos moradores|k+6 h+5|O sino tocou uma última vez enquanto eu ia embora.']],
});
chain('pacto_encruzilhada',{k:'Maldição',min:16,max:70,when:LIVRE,w:.3,gap:[1,1]},{
 a:['A encruzilhada','Desesperad{o} com a vida, ouvi falar que quem pede algo numa encruzilhada à meia-noite é atendido.',['Ir à encruzilhada|>b|Meia-noite, vela e um vento que não vinha de lugar nenhum.','Achar loucura|h+0|Prefiro resolver do meu jeito.']],
 b:['O homem de terno','Um homem de terno branco apareceu do nada. "O que você quer?"',['Pedir dinheiro|$+50000 k-10 >c|"Feito. Volto daqui a sete anos para cobrar."','Pedir talento|tal.musical+20 f+5 k-10 >c|"Feito. Volto daqui a sete anos."','Desistir e ir embora|>e|Ele riu. O riso me acompanhou até em casa.']],
 c:['Os sete anos','A vida mudou completamente. Mas o prazo se aproxima.',['Procurar um jeito de quebrar o pacto|>d|Falei com um padre, um pai de santo e um rabino.','Aproveitar o tempo que resta|h+10 >d@7|Vivi como se não houvesse amanhã.']],
 d:['A cobrança','Sete anos depois, o homem de terno branco bateu na porta.',['Oferecer outra coisa em troca|?k k+5|Ele aceitou levar o que eu ganhei, e não a mim. Voltei a ser quem eu era.|hl-40 h-20|Ele levou algo que eu não sei nomear. Nunca mais fui {o} mesm{o}.','Enfrentar com fé|?k h+15|Ele desapareceu em fumaça. Acabou.|hl-30|A fé não bastou.']],
 e:['A dúvida','Nunca soube o que teria acontecido se eu tivesse pedido.',['Agradecer por ter ido embora|h+5 k+3|Algumas portas é melhor nunca abrir.','Voltar outro dia|>a@2|A curiosidade venceu.']],
});
chain('praia_noturna',{k:'Mistério',min:14,max:80,when:LIVRE,w:.35,npc:1,gap:[1,1]},{
 a:['A voz do mar','Numa praia deserta, à noite, uma voz cantava vinda das ondas.',['Chegar mais perto|>b|Uma pessoa de cabelo longo, sentada numa pedra no mar.','Ir embora|>e@1|A música ficou na cabeça por dias.']],
 b:['A sereia','{p} me chamou pelo nome. Os olhos brilhavam como escamas.',['Ir até a pedra|?will >c|Parei com a água no peito e voltei. Algo me segurou.|>d|Fui até {ele} sem conseguir parar.','Tapar os ouvidos e correr|h-4 >e|Corri até a estrada.']],
 c:['O presente','{p} sorriu e deixou uma concha na areia antes de mergulhar.',['Guardar a concha|h+6 >f|Encostei no ouvido: a mesma música.','Jogar de volta no mar|k+3|Não quero nada que venha de lá.']],
 d:['Debaixo d\'água','Afundei. Senti mãos me puxando para o fundo.',['Lutar para voltar|?hl hl-10 >f|Acordei na areia, cuspindo água, com uma concha na mão.|hl-35|Um pescador me tirou da água quase sem vida.','Aceitar|hl-50|Acordei num hospital. Ninguém sabe como cheguei na areia.']],
 e:['A lenda','Pescadores antigos contam que quem ouve a música uma vez, ouve para sempre.',['Voltar à praia|>b@1|Precisava ver de novo.','Nunca mais pisar ali|h-2|Mas a música vem nos sonhos.']],
 f:['A concha','A concha brilha nas noites de lua cheia.',['Usar como amuleto|h+4 k+2|Desde então, o mar sempre me trata bem.','Dar para alguém que ama o mar|k+4|Passei o encanto adiante.']],
});
chain('visita_sonho',{k:'Mistério',min:10,max:95,when:m=>!m.prison&&S.people.some(p=>!p.alive&&['mae','pai','avo','conjuge','irmao','filho'].includes(p.rel)),w:.5,gap:[1,1]},{
 a:['Um sonho tão real','Sonhei com alguém da família que já partiu. Parecia tão real que acordei com o cheiro dessa pessoa no quarto.',['Contar para alguém|>b|Minha tia disse que sonhou a mesma coisa.','Guardar o sonho|h+3 >b|Fiquei o dia inteiro com um sorriso bobo.']],
 b:['O segundo sonho','No segundo sonho, essa pessoa me pediu para entregar um recado.',['Perguntar qual|>c|"Diz pra sua mãe que a chave está no pote azul."','Acordar assustad{o}|h-2 >c|Mas o recado ficou na cabeça.']],
 c:['O pote azul','Achei uma chave dentro de um pote azul esquecido no armário.',['Descobrir o que ela abre|>d|Um cofrinho antigo no fundo do guarda-roupa.','Entregar para a família|k+3 >d|Todo mundo chorou.']],
 d:['O cofrinho','Dentro, cartas escritas para cada pessoa da família, para serem lidas "quando eu partir".',['Ler a minha carta|h+15|Chorei por horas. Era tudo o que eu precisava ouvir.','Reunir a família para ler juntos|h+12 k+5|Um último encontro com quem já se foi.']],
});
chain('eclipse',{k:'Mistério',min:10,max:85,when:LIVRE,w:.3,gap:[1,1]},{
 a:['O eclipse','Durante um eclipse total, todos os animais da cidade ficaram em silêncio. E eu ouvi meu nome.',['Responder|>b|A voz disse: "Você foi escolhid{o}."','Fingir que não ouvi|>d@2|O eclipse passou.']],
 b:['O símbolo','Apareceu um símbolo desenhado na minha porta. Ninguém sabe quem fez.',['Pesquisar o símbolo|sm+3 >c|É um símbolo antigo de proteção.','Apagar|>d|Na manhã seguinte, estava lá de novo.']],
 c:['A proteção','Desde o eclipse, escapei de três acidentes por pouco.',['Aceitar a proteção|h+6 >d|Alguém olha por mim.','Ficar com medo|h-3 >d|Proteção de quem?']],
 d:['O próximo eclipse','No eclipse seguinte, a voz voltou: "Obrigado por cuidar do que te demos."',['Perguntar o que foi dado|>e|"Tempo." E silêncio.','Agradecer|h+6|Não precisava entender.']],
 e:['Tempo','Desde então, sinto que tenho mais tempo do que deveria.',['Usar bem esse tempo|h+8 k+5|Cada dia vale mais.','Contar para alguém|f+1|Ninguém acreditou, mas eu sei.']],
});
chain('cachorro_ve',{k:'Assombração',min:8,max:85,when:m=>!m.prison&&people('pet').length>0,w:.4,gap:[1,1]},{
 a:['O latido para o nada','Meu bichinho fica latindo para o canto vazio da sala, toda noite.',['Olhar o canto|>b|Nada. Mas o ar ali é mais frio.','Brigar com ele|>b|Ele não parou.']],
 b:['O rabo abanando','Uma noite, ele parou de latir e começou a abanar o rabo para o mesmo canto.',['Chamar o canto pelo nome de alguém que partiu|>c|O bichinho deitou e ficou olhando, feliz.','Filmar|>c|Na gravação, ele brinca com alguém que não aparece.']],
 c:['A visita','A família acredita que é a visita de alguém querido que já partiu.',['Deixar uma cadeira ali|h+5|A cadeira da visita.','Pedir para o canto descansar em paz|k+3 h+3|O bichinho nunca mais latiu ali.']],
});
chain('radio_antigo',{k:'Mistério',min:12,max:85,when:LIVRE,w:.3,gap:[1,1]},{
 a:['O rádio do avô','Liguei o rádio antigo do meu avô. Entre os chiados, uma transmissão de 1969.',['Ouvir com atenção|>b|Um locutor narrando notícias daquele ano, ao vivo.','Desligar|>d@1|Na manhã seguinte, o rádio estava ligado.']],
 b:['A voz','No meio da transmissão, o locutor disse: "Recado para quem está ouvindo em outro tempo."',['Continuar ouvindo|>c|Ele leu números. Seis números.','Gravar|>c|A gravação só tem chiado.']],
 c:['Os números','Os seis números. Eu não resisti.',['Jogar na loteria|$-10 ?15 $+300000 h+25|ACERTEI. O rádio nunca mais ligou.|h-2|Não ganhei. Mas foi divertido.','Guardar os números num papel|h+2|Às vezes é melhor não saber.']],
 d:['O rádio insiste','O rádio liga sozinho na mesma estação todos os dias.',['Ouvir de novo|>b|Desta vez, prestei atenção.','Vender o rádio|$+800|O comprador o devolveu uma semana depois, sem explicar.']],
});
