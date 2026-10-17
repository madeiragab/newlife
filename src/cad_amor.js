// ===== Histórias em cadeia: amor e casamento =====
const SOLTEIR=m=>!partners().length;
chain('app_namoro',{k:'Amor',min:18,max:60,npc:1,date:1,when:SOLTEIR,gap:[1,1]},{
 a:['Deu match','Instalei um aplicativo de namoro. Deu match com {p}, que tem um perfil divertido e fotos com cachorro.',['Mandar uma mensagem engraçada|?lk h+5 >b|{p} respondeu com três emojis rindo.|h-2 >c|Visualizou e não respondeu.','Esperar {ele} falar primeiro|?40 >b|{p} mandou um "oi" tímido.|>c|Ninguém falou nada.']],
 b:['Conversa boa','Faz duas semanas que eu e {p} conversamos todo dia.',['Marcar um encontro|>d|Um café num sábado à tarde.','Pedir uma videochamada antes|?70 >d|Era a pessoa das fotos mesmo.|>e|A câmera "estava quebrada". Estranho.']],
 c:['Desânimo','O aplicativo virou uma sequência de conversas que não dão em nada.',['Apagar o aplicativo|h+3|Vou conhecer gente do jeito antigo.','Insistir mais um pouco|>a@1|Mais uma chance.']],
 d:['O primeiro encontro','{p} chegou na hora, mais bonit{o2} pessoalmente.',['Ser eu mesm{o}|?lk+5 h+10 vira:namoro >f|Ficamos até o café fechar. Começamos a namorar.|h-3 >c|Faltou química.','Tentar impressionar|?35 h+8 vira:namoro >f|Funcionou!|h-5 >c|Falei demais de mim.']],
 e:['O perfil falso','A pessoa das fotos não existia. Era um golpe.',['Denunciar o perfil|k+3 h-4|Bloqueado e denunciado.','Contar para os amigos|h+2|Viramos piada juntos. Melhor que chorar sozinh{o}.']],
 f:['Namoro de aplicativo','O namoro com {p} está ficando sério.',['Conhecer a família d{ele}|?50 bond+10 h+6 >g|A família me adorou.|bond-3 >g|A sogra me olhou de cima a baixo.','Manter só entre nós|bond+4 >g|Sem pressão.']],
 g:['Contar como se conheceram','Num jantar, alguém perguntou como eu e {p} nos conhecemos.',['Contar a verdade: aplicativo|h+5 bond+5|Hoje em dia todo mundo se conhece assim.','Inventar uma história romântica|h+6 bond+6|"Foi numa livraria, numa tarde de chuva..." Combinamos de contar sempre assim.']],
});
chain('pedido',{k:'Amor',min:22,max:55,who:'partnerDating',when:m=>{ const p=pickPartner(p=>p.rel==='namoro'); return !!p&&p.rel==='namoro'; },gap:[1,1]},{
 a:['Pensar no futuro','Faz tempo que eu e {p} estamos juntos. Comecei a pensar em casamento.',['Comprar uma aliança|$-3000 >b|Escondi a caixinha numa meia velha.','Conversar sobre o assunto|>c|Perguntei, de leve, o que {ele} pensa de casamento.','Não é a hora|h+0|Ainda não.']],
 b:['O pedido','Chegou o dia. A aliança está no bolso e o coração na boca.',['Pedir num restaurante|?bond noivar h+15 >d|{p} disse sim chorando!|h-15 bond-10 >e|{p} disse que não está pront{o2}.','Pedir num lugar especial para nós dois|?bond+10 noivar h+15 >d|SIM!|h-12 >e|{p} pediu um tempo para pensar.']],
 c:['A conversa séria','{p} disse que pensa em casar, mas não agora.',['Respeitar o tempo d{ele}|k+3 bond+5 >b@1-2|Esperei. Valeu a pena esperar.','Dar um ultimato|?40 bond-5 >b@0|{p} entendeu o recado.|breakup h-15|Terminamos.']],
 d:['Os preparativos','Noivado anunciado. Agora vem a parte difícil: o casamento.',['Festa grande|$-25000 >f|Duzentos convidados, banda e buffet.','Cerimônia pequena|$-5000 >f|Só quem importa.','Casar no cartório e viajar|$-8000 >f|Assinamos e fugimos para a praia.']],
 e:['O não','O "não" doeu. Mas a gente continua junto.',['Tentar de novo no futuro|bond+3 >b@2|Um dia vai ser sim.','Terminar|breakup h-12|Queríamos coisas diferentes.']],
 f:['O grande dia','O dia do casamento chegou.',['Dizer sim|casar h+20 bond+15 >g@1|Casei com {p}! A festa foi até de manhã.','Fugir do altar|breakup h-20 k-10|Saí correndo. Não me pergunte por quê.']],
 g:['Recém-casados','O primeiro ano de casados tem muita alegria e algumas brigas por causa da toalha molhada.',['Fazer um acordo das tarefas|bond+8 k+3|Tabela na geladeira. Funciona.','Deixar a toalha na cama mesmo|bond-3 h+2|Algumas batalhas não valem a pena.']],
});
chain('sogra',{k:'Família',min:20,max:65,who:'partner',gap:[1,1]},{
 a:['A sogra','A mãe de {p} decidiu passar "uns dias" lá em casa. Já faz três semanas.',['Ser gentil|k+4 >b|Fiz o café do jeito que ela gosta.','Reclamar com {p}|bond-5 >c|{p} ficou entre a cruz e a espada.','Insinuar que é hora de ir|?40 >d|Ela entendeu e foi embora no dia seguinte.|bond-8 >c|Ela ficou ofendida.']],
 b:['Conquista','A sogra elogiou minha comida na frente de toda a família.',['Agradecer|h+6 bond+5 >d|Até {p} se emocionou.','Pedir a receita do bolo dela em troca|h+5 >d|Ela me ensinou o segredo de família.']],
 c:['A briga','A sogra criticou a forma como eu cuido da casa. Explodi.',['Pedir desculpas|k+4 bond+5 >d|Ela também pediu.','Exigir que {p} escolha um lado|bond-12 >e|Pior pedido que eu já fiz.']],
 d:['Paz','Eu e a sogra chegamos a um acordo silencioso de respeito mútuo.',['Convidar para o almoço de domingo|h+4 bond+6|Agora é tradição.','Manter visitas curtas|h+3|Amor de longe.']],
 e:['A crise','{p} ficou do lado da mãe. Dormi no sofá.',['Conversar com calma depois|?k bond+10 >d|Nos entendemos.|bond-10 h-8|A crise durou meses.','Ir para a casa de um amigo|h-6 bond-6 >d@1|Precisava de espaço.']],
});
chain('crise_casamento',{k:'Família',min:28,max:70,who:'spouse',gap:[1,1]},{
 a:['A rotina','Eu e {p} quase não conversamos mais. Cada um no seu celular.',['Propor uma viagem a dois|$-4000 bond+10 h+8 >b|Redescobrimos a gente.','Sugerir terapia de casal|$-1200 >c|{p} aceitou, desconfiad{o2}.','Deixar como está|bond-6 >d|A distância cresceu.']],
 b:['Lua de mel de novo','A viagem nos lembrou por que nos apaixonamos.',['Manter um encontro por semana|bond+10 h+8|Toda sexta é nossa.','Voltar à rotina|bond+2 >d@2|Foi bom enquanto durou.']],
 c:['Na terapia','A terapeuta fez perguntas que nunca tínhamos feito um ao outro.',['Ser sincer{o}|?k bond+12 h+6 >e|Choramos, rimos e nos entendemos.|bond-6 >d|Algumas verdades machucaram.','Ficar na defensiva|bond-4 >d|Não adiantou muito.']],
 d:['A desconfiança','Achei mensagens estranhas no celular de {p}.',['Confrontar|?50 bond-5 >e|Era uma surpresa para o meu aniversário. Fiquei com vergonha.|bond-20 h-15 >f|Era o que eu temia.','Fingir que não vi|h-8 >f|O silêncio ficou mais pesado.']],
 e:['Mais fortes','Passamos pela crise e saímos mais unidos.',['Renovar os votos|$-3000 bond+15 h+12|Festinha no quintal, com os mesmos amigos de antes.','Só seguir juntos|bond+8 h+6|Amor maduro é escolher todo dia.']],
 f:['A decisão','Precisamos decidir o futuro do nosso casamento.',['Tentar mais uma vez|?45 bond+8 >e|Recomeçamos.|breakup h-15|Não teve jeito. Divórcio.','Separar|breakup h-12|Acabou. Com mais tristeza que raiva.']],
});
chain('bebe_planejado',{k:'Família',min:22,max:42,who:'partnerFertile',when:m=>kids().length<3,gap:[1,1]},{
 a:['Um filho?','{p} me perguntou num domingo à tarde: "E se a gente tivesse um filho?"',['Topar|bond+8 >b|Ficamos rindo de nervoso o resto do dia.','Pedir tempo|>c@1|Ainda tenho medo.','Dizer que não quero|bond-8 h-2|Conversa difícil.']],
 b:['Tentando','Faz meses que estamos tentando.',['Continuar tentando com calma|?55 >d|Duas listras no teste!|>e|Ainda nada.','Procurar um médico|$-2000 ?65 >d|O médico ajudou. Positivo!|>e|O médico pediu mais exames.']],
 c:['O medo','Medo de não dar conta, de não ter dinheiro, de errar.',['Conversar com amigos que já são pais|h+4 >b|"Ninguém está pronto." Isso me acalmou.','Desistir da ideia|bond-5|Não é para mim.']],
 d:['Grávidos','Vai nascer um bebê!',['Montar o quarto juntos|$-3000 bond+10 h+10 >f|Pintamos a parede de amarelo.','Fazer chá revelação|$-800 h+8 >f|O balão estourou com confete.']],
 e:['A espera','Os meses passam e o teste continua negativo.',['Tentar tratamento|$-12000 ?50 >d|Funcionou!|h-10 >g|Não funcionou.','Pensar em adoção|>g|Existe mais de um jeito de ser família.']],
 f:['O nascimento','Chegou a hora. Corremos para a maternidade de madrugada.',['Segurar o bebê pela primeira vez|bebe h+25 bond+15|Nada no mundo se compara.','Desmaiar na sala de parto|bebe h+20 bond+10|Acordei com todo mundo rindo de mim. E um bebê lindo.']],
 g:['Adoção','Entramos na fila de adoção.',['Esperar com paciência|h+4 >h@1-3|A fila é longa, mas a gente espera.','Desistir|h-6|Talvez não seja para nós.']],
 h:['A ligação','O telefone tocou: tem uma criança esperando por nós.',['Ir conhecer|adotar h+25 bond+10|Foi amor no primeiro olhar.','Pedir mais um tempo|h-4|Ainda não estávamos prontos.']],
});
chain('amor_antigo',{k:'Amor',min:38,max:75,npc:1,date:1,when:SOLTEIR,gap:[1,2]},{
 a:['Um rosto conhecido','No mercado, reconheci {p}, meu primeiro amor da escola. Faz mais de vinte anos.',['Ir falar com {ele}|>b|{p} me reconheceu na hora.','Me esconder atrás das prateleiras|h-2 >c@1|Coração de adolescente.']],
 b:['Café atrasado em vinte anos','Marcamos um café. {p} se divorciou há pouco tempo.',['Falar do passado|h+8 >d|Rimos das bobagens da escola.','Falar do presente|h+6 >d|A vida nos levou para lugares diferentes.']],
 c:['Arrependimento','Fiquei pensando em {p} a semana inteira.',['Procurar nas redes sociais|>b@0|Mandei uma mensagem.','Deixar para lá|h-3|Passado é passado.']],
 d:['Segunda chance','{p} confessou que sempre pensou em mim.',['Tentar de novo|vira:namoro h+15 >e|Começamos a namorar depois dos quarenta. Melhor do que aos dezesseis.','Ficar só na amizade|vira:amigo h+5|Amigos de uma vida inteira.']],
 e:['Para valer','Desta vez não vamos deixar nada nos separar.',['Morar juntos|bond+12 h+10 >f@1|Juntamos duas casas cheias de lembranças.','Casar|casar h+15 bond+15|Casamos com a turma da escola na festa.']],
 f:['A vida a dois','Envelhecer junto de quem me conhece desde sempre.',['Agradecer ao destino|h+10 bond+8|Algumas histórias só terminam bem depois.','Fazer uma viagem que planejávamos aos dezesseis|$-6000 h+12|Fomos até a praia que prometemos conhecer juntos.']],
});
chain('amizade_rachada',{k:'Amizade',min:18,max:70,who:'friend',v:[2000,15000],gap:[1,1]},{
 a:['O empréstimo','{p}, amizade de anos, pediu {v} emprestados para uma emergência.',['Emprestar|$-v bond+10 >b|"Te devolvo em três meses."','Emprestar só metade|bond-2 >b|O que eu podia.','Negar|bond-12 >e|{p} ficou magoad{o2}.']],
 b:['Os meses passam','Já faz um ano e {p} nunca mais tocou no assunto. Postou fotos de uma viagem.',['Cobrar com jeito|?50 $+v bond+3 >c|{p} pediu desculpas e pagou.|bond-10 >d|{p} ficou ofendid{o2} com a cobrança.','Esquecer o dinheiro|k+4 h-4 >c|Amizade vale mais.']],
 c:['Amizade salva','A amizade sobreviveu ao dinheiro.',['Combinar de nunca mais misturar|h+5 bond+5|Regra sagrada.','Seguir como antes|h+4|Amigos são para essas coisas.']],
 d:['A briga','{p} me chamou de mesquinh{o} por cobrar.',['Desabafar tudo|bond-15 h-6 >e|Falamos coisas que doeram.','Deixar o tempo passar|bond-5 >e|Silêncio.']],
 e:['O afastamento','Eu e {p} paramos de nos falar.',['Mandar uma mensagem de paz|?k bond+15 >f|{p} respondeu na hora: "Eu também sinto falta."|h-4|Visualizou e não respondeu.','Seguir a vida|h-3|Algumas amizades acabam.']],
 f:['Reconciliação','Encontrei {p} num aniversário. Nos abraçamos como se nada tivesse acontecido.',['Rir de tudo|h+10 bond+10|Amizade de verdade sobrevive a tudo.','Conversar a sério|h+8 bond+12|Prometemos nunca mais deixar algo assim nos separar.']],
});
chain('filho_adolescente',{k:'Família',min:30,max:65,who:'teen',gap:[1,1]},{
 a:['A porta fechada','{p} vive trancad{o2} no quarto. Responde tudo com monossílabos.',['Bater na porta para conversar|?bond >b|{p} deixou eu entrar.|bond-3 >c|"Sai do meu quarto."','Respeitar o espaço|bond+2 >c|Fase.','Tirar o celular|bond-10 >d|Guerra declarada.']],
 b:['A conversa','{p} contou que está sofrendo por causa de alguém da escola.',['Ouvir sem julgar|bond+12 k+3 >e|{p} me abraçou no final.','Dar um sermão|bond-5 >c|{p} se arrependeu de ter contado.']],
 c:['As notas','O boletim de {p} chegou cheio de notas vermelhas.',['Contratar um professor particular|$-2000 bond+3 >e|As notas melhoraram.','Colocar de castigo|bond-6 >d|Não melhorou nada.','Perguntar o que está acontecendo|?bond bond+8 >b|Tinha algo por trás.|bond-3 >d|{p} não quis falar.']],
 d:['A fuga','{p} saiu de casa de madrugada e não voltou até de manhã.',['Esperar acordad{o} e conversar|bond+5 >e|Combinamos regras novas, juntos.','Explodir|bond-12 >e|Brigamos feio.']],
 e:['Crescendo','{p} está virando adult{o2}. Às vezes vejo um pouco de mim ali.',['Dizer que tenho orgulho|bond+10 h+8|{p} ficou sem graça, mas sorriu.','Lembrar da minha própria adolescência|h+5|Meus pais também sofreram.']],
});
chain('filho_volta',{k:'Família',min:45,max:80,who:'adultkid',gap:[1,1]},{
 a:['De volta para casa','{p} perdeu o emprego e pediu para voltar a morar comigo por um tempo.',['Aceitar de braços abertos|bond+10 >b|O quarto de infância voltou a ter dono.','Aceitar com regras|bond+4 >b|Contas divididas e louça lavada.','Negar|bond-15 h-4|{p} foi morar com um amigo.']],
 b:['Convivência','Morar com um filho adulto é diferente. Ninguém sabe bem quem manda.',['Tratar como adulto|bond+6 >c|Conversas de igual para igual.','Voltar a tratar como criança|bond-6 >c|"Já sou adult{o2}!"']],
 c:['O emprego novo','{p} arrumou um emprego e vai se mudar de novo.',['Ajudar com a mudança|bond+8 h+5 >d|Carreguei caixas e segurei o choro.','Pedir para ficar mais um pouco|bond+3 >d|A casa ficou tão viva.']],
 d:['Ninho vazio, de novo','A casa ficou silenciosa outra vez.',['Transformar o quarto num escritório|h+4|Finalmente um escritório.','Deixar o quarto do jeito que está|h+2|Vai que {p} volta.']],
});
chain('cuidar_pai',{k:'Família',min:35,max:70,who:'parentOld',gap:[1,1]},{
 a:['O tombo','{p} caiu em casa e ficou horas no chão até alguém chegar.',['Levar para morar comigo|bond+12 h-4 >b|A casa ficou cheia de remédios e histórias antigas.','Contratar uma cuidadora|$-6000 >c|Alguém para ficar com {ele} durante o dia.','Sugerir um lar de idosos|bond-8 >d|{p} chorou.']],
 b:['A rotina de cuidar','Cuidar de {p} cansa, mas também aproxima.',['Ouvir as histórias de {p}|bond+10 h+3 >e|Descobri coisas da família que eu nunca soube.','Dividir com os irmãos|>f|Nem todo mundo ajudou do mesmo jeito.']],
 c:['A cuidadora','A cuidadora é ótima. {p} até voltou a sorrir.',['Visitar todo fim de semana|bond+8 >e|Almoço de domingo garantido.','Ligar todo dia|bond+5 >e|A voz de {p} melhora quando eu ligo.']],
 d:['O lar de idosos','{p} fez amigos no lar. Até arrumou namorad{o2}.',['Visitar sempre|bond+10 h+5 >e|O lugar é mais alegre do que eu imaginava.','Visitar pouco|bond-6 h-4 >e|A culpa pesa.']],
 e:['A despedida','{p} foi embora numa madrugada tranquila.',['Organizar uma despedida bonita|morre h-15 k+3 >g|Lotou a igreja de gente que {ele} ajudou.','Ficar em silêncio|morre h-18 >g|Ainda não caiu a ficha.']],
 f:['A briga dos irmãos','Discutimos sobre quem cuida mais de {p}.',['Fazer uma escala justa|k+4 >e|Funcionou.','Assumir tudo sozinh{o}|hl-5 bond+8 >e|Cansei, mas não me arrependo.']],
 g:['A herança','Chegou a hora de dividir as coisas que {p} deixou.',['Dividir com justiça|$+20000 k+5|Ninguém brigou. {p} ia gostar.','Brigar pela casa|$+40000 k-8 h-8|Ganhei a casa e perdi os irmãos.']],
});
chain('irmao_divida',{k:'Família',min:22,max:70,who:'sib',v:[3000,20000],gap:[1,1]},{
 a:['O pedido','{p} me ligou chorando: precisa de {v} para não perder a casa.',['Ajudar|$-v bond+12 >b|{Ele} disse que eu salvei a vida d{ele}.','Ajudar com metade|bond+3 >b|Ajudei no que pude.','Negar|bond-15 >c|{Ele} desligou na minha cara.']],
 b:['Um ano depois','{p} conseguiu se reerguer.',['Esperar {ele} pagar|?50 $+v bond+5|{Ele} pagou cada centavo.|bond-4|{Ele} nunca mais falou no assunto.','Dizer que foi um presente|k+6 bond+10|Família é família.']],
 c:['A mágoa','{p} perdeu a casa e não fala mais comigo.',['Pedir desculpas|?k bond+10|{Ele} aceitou, devagar.|h-4|Não me perdoou.','Explicar meus motivos|bond+3|{Ele} entendeu, pelo menos em parte.']],
});
chain('segredo_familia',{k:'Família',min:25,max:70,npc:1,gap:[1,2]},{
 a:['O teste de DNA','Fiz um teste de DNA por curiosidade. Apareceu um "parente próximo" que eu não conheço: {p}.',['Mandar mensagem|>b|{p} respondeu no mesmo dia.','Ignorar|h-2 >c@2|Fiquei com aquilo na cabeça.']],
 b:['A revelação','{p} é meio-{irmao} meu. Fruto de um relacionamento antigo de um dos meus pais.',['Conhecer {p} pessoalmente|>d|Temos o mesmo sorriso.','Confrontar meus pais primeiro|>e|A conversa mais difícil da minha vida.']],
 c:['A curiosidade','Abri o resultado do DNA de novo.',['Mandar a mensagem|>b@0|Coragem.','Apagar a conta|h+2|Não quero saber.']],
 d:['Família nova','{p} quer fazer parte da minha vida.',['Abrir as portas|vira:irmao h+10|Ganhei mais família depois de adult{o}.','Manter distância|h-2|Ainda é muito para processar.']],
 e:['Meus pais','Meus pais confirmaram tudo, entre lágrimas.',['Perdoar|k+6 h+3 >d|Eles também erraram, como todo mundo.','Ficar com raiva|h-10 >d|Precisei de um tempo longe.']],
});
