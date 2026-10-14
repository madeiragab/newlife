// ===== Histórias em cadeia: família =====
chain('filho_pequeno',{k:'Família',min:22,max:60,who:'child',gap:[1,1]},{
 a:['O desenho na parede','{p} desenhou um mural inteiro na parede da sala com canetinha permanente.',['Dar uma bronca|bond-4 >b|{p} chorou e disse que era um presente para mim.','Tirar uma foto e emoldurar a parede|bond+10 h+8 >c|Virou a parede mais bonita da casa.','Comprar um quadro branco para {ele}|$-200 bond+6 >c|Arte tem lugar certo.']],
 b:['O presente','O desenho era nossa família inteira de mãos dadas.',['Pedir desculpas pela bronca|bond+8 k+3 >c|Pintamos juntos uma parede só para {ele}.','Explicar com carinho onde pode desenhar|bond+4 >c|{p} entendeu.']],
 c:['O talento','A professora disse que {p} desenha muito bem para a idade.',['Matricular numa aula de arte|$-1200 bond+6 >d|{p} chega em casa toda feliz.','Deixar desenhar por diversão|bond+3 >d|Sem pressão.']],
 d:['A exposição da escola','Um desenho de {p} foi escolhido para a exposição da escola.',['Ir com a família inteira|h+12 bond+10 >e@3-6|Tirei mil fotos de um desenho de girafa.','Faltar por causa do trabalho|bond-8 h-6 >e@3-6|{p} procurou meu rosto na plateia.']],
 e:['Crescendo','{p} cresceu e ainda desenha.',['Guardar todos os desenhos numa pasta|h+8 bond+5|Um dia vou mostrar para os netos.','Incentivar a seguir com arte|bond+6|Quem sabe vira profissão.']],
});
chain('natal_familia',{k:'Família',min:20,max:85,rep:1,gap:[1,1],when:m=>parents().length>0||kids().length>0},{
 a:['O Natal','Este ano o Natal da família vai ser na minha casa.',['Caprichar na ceia|$-1500 h+6 >b|Peru, farofa e uma mesa enorme.','Fazer um amigo secreto simples|$-300 h+4 >b|Ninguém precisa gastar muito.','Fugir e viajar|$-4000 h+8|Natal na praia, sem drama.']],
 b:['A tia polêmica','Uma tia começou a falar de política na mesa.',['Mudar de assunto com uma piada|?k h+6 >c|Todo mundo riu. Crise evitada.|>d|Ninguém riu.','Entrar na discussão|h-6 >d|A ceia virou debate.']],
 c:['A ceia perfeita','Foi o Natal mais bonito em anos.',['Tirar uma foto de todo mundo|h+10|A foto foi para a parede.','Prometer repetir no ano que vem|h+8|Tradição nova.']],
 d:['A briga','A discussão acabou com uma porta batida.',['Ir atrás para fazer as pazes|k+5 h+3 >c|Voltamos para a sobremesa.','Deixar esfriar|h-6|O peru esfriou também.']],
});
chain('casamento_irmao',{k:'Família',min:18,max:70,who:'sib',gap:[1,1]},{
 a:['O noivado','{p} vai se casar e quer que eu faça parte da cerimônia.',['Aceitar com alegria|bond+10 h+8 >b|Vou entrar na igreja com {p}.','Aceitar, mas achar a pessoa errada para {ele}|bond+2 >c|Guardei a opinião.']],
 b:['A organização','{p} está estressad{o2} com os preparativos.',['Ajudar com tudo|k+5 bond+10 >d|Escolhi flores, testei bolo e briguei com o buffet.','Dar apoio emocional|bond+8 >d|Ouvi {ele} reclamar por horas.']],
 c:['A dúvida','Na véspera do casamento, {p} me perguntou se está fazendo a coisa certa.',['Dizer que deve seguir o coração|bond+8 >d|{p} respirou fundo e foi.','Dizer o que eu penso de verdade|?50 bond+5 >e|{p} cancelou o casamento e me agradeceu meses depois.|bond-15 >d|{p} ficou furios{o2} comigo.']],
 d:['A festa','O casamento foi lindo. Dancei com a família inteira.',['Fazer um brinde aos noivos|h+10 bond+8|Contei uma história da nossa infância.','Dançar até o fim|h+12|Fui a última pessoa a sair da pista.']],
 e:['O casamento cancelado','A família inteira ficou sabendo que fui eu quem fez {p} pensar melhor.',['Assumir|k+3 h-3|Era o certo.','Pedir para {p} não contar|h+1|Tarde demais.']],
});
chain('avos_historias',{k:'Família',min:8,max:30,gap:[1,2],when:m=>people('avo').length>0},{
 a:['Histórias da vó','Minha avó começou a contar histórias de quando era jovem, no interior.',['Pedir para contar mais|h+5 sm+2 >b|Ela fugiu de casa para ir a um baile. Quem diria.','Gravar as histórias no celular|h+4 >b|Um dia vou querer ouvir de novo.']],
 b:['A receita secreta','Ela quer me ensinar a receita do bolo que só ela sabe fazer.',['Aprender passo a passo|h+6 >c|"Uma xícara é a minha xícara, não a sua."','Anotar tudo num caderno|sm+2 >c|Caderno sujo de farinha.']],
 c:['O álbum','Ela mostrou um álbum de fotos que eu nunca tinha visto.',['Escanear todas as fotos|k+3 h+5 >d@2-5|Mandei para a família inteira.','Ouvir a história de cada foto|h+8 >d@2-5|Uma tarde inteira de memórias.']],
 d:['A falta','Minha avó partiu. A receita do bolo ficou comigo.',['Fazer o bolo no aniversário dela|h-4 k+3|Ficou quase igual. Quase.','Ouvir as gravações|h-6|A voz dela ainda está aqui.']],
});
chain('gemeos',{k:'Família',min:22,max:45,who:'partner',when:m=>kids().length===0,gap:[1,1]},{
 a:['O ultrassom','No ultrassom, o médico ficou em silêncio e depois sorriu: "Tem dois aqui".',['Rir de nervoso|h+10 bond+8 >b|Dois berços, dois carrinhos, duas vezes tudo.','Desmaiar|h+8 >b|Acordei com {p} me abanando.']],
 b:['A preparação','Preparar a casa para gêmeos exige um exército.',['Pedir ajuda à família|k+3 >c|Minha mãe se mudou para casa por um mês.','Fazer tudo sozinhos|hl-4 bond+5 >c|Nós dois contra o mundo.']],
 c:['O nascimento','Nasceram dois bebês saudáveis!',['Segurar os dois de uma vez|bebe bebe h+25 bond+15 >d@1|Dois chorando, um coração explodindo.','Chorar mais que os bebês|bebe bebe h+22 >d@1|Ninguém estava preparado para tanta emoção.']],
 d:['O primeiro ano','O primeiro ano com gêmeos foi uma maratona sem linha de chegada.',['Celebrar o primeiro aniversário|$-1500 h+12 bond+8|Dois bolos, porque cada um merece o seu.','Dormir oito horas pela primeira vez|hl+5 h+10|Um milagre.']],
});
chain('mudanca_familia',{k:'Família',min:10,max:16,gap:[1,1],when:m=>parents().length>0},{
 a:['A mudança','Meus pais anunciaram: vamos nos mudar para outra cidade por causa do trabalho.',['Ficar animad{o}|h+4 >b|Cidade nova, vida nova.','Brigar e chorar|h-8 >c|Não quero deixar meus amigos.']],
 b:['A escola nova','Primeiro dia na escola nova. Não conheço ninguém.',['Puxar conversa com alguém|?lk h+8 >d|Fiz amizade no recreio.|h-4 >d|Almocei sozinh{o}.','Ficar quiet{o} observando|>d|Primeiro entender o lugar.']],
 c:['A despedida','Meus amigos fizeram uma despedida surpresa.',['Prometer manter contato|h+4 >b|Choramos todos juntos.','Ficar com raiva dos meus pais|h-6 >b|Fiquei uma semana sem falar com eles.']],
 d:['Adaptação','Seis meses depois, a cidade nova já parece casa.',['Agradecer aos meus pais|h+6|Eles estavam certos, no fim.','Sentir saudade das duas cidades|h+3|Agora tenho dois lugares no coração.']],
});
chain('divorcio_pais_adulto',{k:'Família',min:25,max:60,gap:[1,1],when:m=>parents().length>=2&&parents().every(p=>p.age>=50)},{
 a:['A notícia','Meus pais, depois de trinta anos, vão se divorciar.',['Apoiar a decisão|k+4 >b|Eles merecem ser felizes, mesmo separados.','Tentar convencer a ficarem juntos|>c|Organizei um jantar só para os dois.','Ficar do lado de um deles|h-6 >d|A família rachou.']],
 b:['Vida nova','Minha mãe começou a viajar e meu pai a fazer aula de dança.',['Achar ótimo|h+6|Pais felizes, família tranquila.','Estranhar|h+2|Vai levar um tempo.']],
 c:['O jantar','O jantar romântico que organizei para os dois foi constrangedor.',['Aceitar a separação|k+3 >b|Não dá para forçar.','Insistir mais um pouco|h-4 >b|Não adiantou.']],
 d:['A divisão','Ter que escolher onde passar o Natal virou um pesadelo.',['Passar a manhã com um e a noite com outro|k+3 h+2|Duas ceias, dois perus.','Fazer uma ceia para todos juntos|?k h+10|Conseguimos reunir todo mundo.|h-6|Não deu certo. Briga na sobremesa.']],
});
chain('irmao_novo',{k:'Família',min:5,max:13,npc:1,age:[-30,-30],gap:[1,1],when:m=>parents().length>=2&&people('mae').some(p=>p.age<43)},{
 a:['A novidade','Meus pais contaram que a família vai crescer: vem um bebê aí.',['Ficar feliz|h+6 >b|Vou ensinar tudo que eu sei.','Ficar com ciúmes|h-4 >c|E se gostarem mais do bebê?']],
 b:['O nascimento','{p} chegou. É pequen{o2} e chora o tempo todo.',['Ajudar a cuidar|vira:irmao k+5 h+5 >d|Aprendi a trocar fralda.','Pedir atenção|vira:irmao h-2 >c|Ninguém mais olha para mim.']],
 c:['Ciúmes','Fiz birra na frente das visitas.',['Conversar com meus pais|h+4 >d|Eles me levaram para tomar sorvete, só nós.','Continuar emburrad{o}|h-4 >d|Durou uma semana.']],
 d:['Irmãos','{p} aprendeu a falar meu nome antes de "papai".',['Me derreter|h+10 k+3|Meu coração é de {p} agora.','Ensinar a falar palavrão|h+6 k-2|Meus pais não acharam graça.']],
});
