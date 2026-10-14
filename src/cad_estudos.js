// ===== Histórias em cadeia: escola, vestibular e faculdade =====
const NA_FACUL=m=>!!m.edu.cur&&m.edu.cur.type==='uni';
chain('gremio',{k:'Escola',min:13,max:17,gap:[1,1],when:m=>!!m.edu.cur},{
 a:['Eleição do grêmio','Vai ter eleição para o grêmio estudantil. Ninguém da minha turma quer se candidatar.',['Me candidatar|>b|Montei uma chapa com três amigos.','Ajudar a campanha de outra chapa|k+2 >e|Fiz os cartazes.','Ignorar a política escolar|h+0|Não é comigo.']],
 b:['A campanha','A chapa rival promete festa toda sexta-feira. A minha promete consertar o bebedouro.',['Prometer festa também|?lk+10 >c|Ganhamos com promessas que talvez não dê para cumprir.|>d|Perdemos.','Manter as propostas sérias|?sm >c|A escola surpreendeu e votou na gente!|>d|Perdemos por cinco votos.']],
 c:['Presidente do grêmio','Ganhei! Agora tenho que cumprir as promessas.',['Consertar o bebedouro e organizar uma festa|k+6 f+2 h+8 >e|Os dois! Fiquei popular.','Brigar com a diretoria por mais liberdade|?k f+3 >e|Conquistamos o direito de usar o pátio no intervalo da tarde.|h-4 >e|A diretora quase me suspendeu.']],
 d:['A derrota','Perdi a eleição, mas aprendi a falar em público.',['Fiscalizar a chapa eleita|k+3 sm+2|Virei a oposição mais chata da escola.','Seguir a vida|h+2|Ano que vem tem mais.']],
 e:['Experiência','A experiência do grêmio me fez gostar de liderar.',['Pensar em política no futuro|f+1 sm+2|Quem sabe um dia.','Guardar como uma boa lembrança|h+4|Foi divertido.']],
});
chain('vestibular',{k:'Estudos',min:16,max:19,gap:[1,1],when:m=>!!m.edu.cur&&m.edu.cur.type==='medio'},{
 a:['O ano do vestibular','Último ano da escola. Todo mundo só fala de vestibular.',['Fazer cursinho|$-3000 sm+4 >b|Aula de manhã, de tarde e simulado no sábado.','Estudar sozinh{o} pela internet|sm+3 >b|Disciplina é tudo.','Não estudar|h+4 >c|Vou ver como é.']],
 b:['A pressão','A pressão está me deixando sem dormir.',['Manter o ritmo|sm+3 hl-3 >d|Café e flashcards.','Diminuir um pouco|h+4 sm+1 >d|Saúde mental também conta ponto.','Ter uma crise de choro|h-6 >d|Minha mãe me abraçou e disse que eu ia conseguir.']],
 c:['A realidade','Um simulado mostrou que eu estou muito atrás.',['Correr atrás|sm+4 >d|Três meses de foco total.','Pensar em outro caminho|>e|Talvez um curso técnico.']],
 d:['A prova','O dia da prova chegou.',['Fazer com calma|?sm grade+5 h+15 >f|Saí da prova com a sensação de que fui bem!|h-8 >e|Travei na redação.','Chutar sem medo nas difíceis|?40 h+12 >f|Os chutes foram ótimos.|h-8 >e|Errei todos.']],
 e:['Não foi desta vez','Não passei no vestibular.',['Tentar de novo ano que vem|sm+3 >d@1|Mais um ano.','Fazer um curso técnico|h+3|Outro caminho, também bom.']],
 f:['A lista','A lista dos aprovados saiu.',['Procurar meu nome|h+20 f+1|PASSEI! Raspei a cabeça na frente de casa.','Pedir para alguém olhar por mim|h+18|Meu pai gritou da sala: "PASSOU!"']],
});
chain('republica_estudantil',{k:'Faculdade',min:17,max:30,npc:1,when:NA_FACUL,gap:[1,1]},{
 a:['A república','Vou morar numa república com cinco estudantes que não conheço.',['Ir|h+6 >b|Quarto dividido com {p}, que estuda {materia}.','Morar sozinh{o}|$-4000 h+2|Paz e silêncio caros.']],
 b:['O trote','Os veteranos da república prepararam um trote para os novatos.',['Participar com bom humor|h+6 vira:amigo >c|Fui pintad{o} de azul. Ganhei amigos para a vida.','Recusar|k+3 >c|Respeitaram, mas me olharam torto.']],
 c:['A festa da república','A república vai dar a maior festa do ano.',['Ajudar a organizar|h+10 >d|Trezentas pessoas numa casa para vinte.','Estudar no quarto com fone|grade+5 >d|Prova na segunda.']],
 d:['A conta de luz','A conta de luz veio absurda e ninguém quer pagar.',['Propor uma divisão justa|k+5 >e|Planilha na geladeira.','Pagar tudo para acabar a briga|$-800 >e|Agora sou quem paga as contas da casa.']],
 e:['Família escolhida','No fim da faculdade, a república virou uma família.',['Prometer um reencontro anual|h+10 bond+10|Todo ano, mesma data, mesma bagunça.','Chorar na despedida|h+8|Cinco anos numa casa só.']],
});
chain('tcc',{k:'Faculdade',min:20,max:35,when:NA_FACUL,npc:1,age:[15,35],gap:[1,1]},{
 a:['O orientador','Preciso escolher um orientador para o TCC. {O2} professor{a2} {p} é exigente, mas brilhante.',['Escolher {p}|sm+3 >b|{Ele} me deu uma lista de vinte livros.','Escolher alguém mais tranquilo|h+3 >c|TCC sem drama.']],
 b:['As correções','{p} devolveu meu primeiro capítulo todo riscado de vermelho.',['Reescrever tudo|sm+4 grade+4 >d|Ficou dez vezes melhor.','Discutir as correções|?sm >d|{Ele} admitiu que eu tinha razão em uma.|>d|{Ele} não gostou.']],
 c:['TCC tranquilo','O orientador mal lê o que eu mando.',['Fazer bem feito mesmo assim|sm+3 >d|Faço por mim.','Fazer o mínimo|h+3 >e|Nota sete e liberdade.']],
 d:['A banca','Chegou o dia de apresentar o TCC para a banca.',['Apresentar com confiança|?sm grade+10 h+15 >f|Nota máxima! A banca sugeriu publicar.|h-4 >e|A banca fez perguntas que eu não soube responder.','Ficar nervos{o}|?40 grade+6 h+10 >e|Deu certo.|h-6 >e|Gaguejei. Passei raspando.']],
 e:['Aprovad{o}','O TCC foi aprovado. Acabou a faculdade!',['Comemorar|h+12|Joguei o chapéu de formatura para o alto.','Dormir dois dias seguidos|hl+4 h+8|Merecido.']],
 f:['Mestrado?','{O2} professor{a2} {p} me convidou para fazer mestrado com {ele}.',['Aceitar|sm+5 h+8|Vou seguir na pesquisa.','Recusar para trabalhar|$+2000 h+4|O mercado me chama.']],
});
chain('intercambio_escola',{k:'Estudos',min:15,max:24,npc:1,gap:[1,1],when:m=>!!m.edu.cur},{
 a:['Bolsa de intercâmbio','A escola oferece uma bolsa de intercâmbio de seis meses em {lugar}.',['Me inscrever|?sm >b|Fui selecionad{o}!|h-3|Não passei na seleção.','Não ter coragem|h-2|Seis meses longe é muito.']],
 b:['A família anfitriã','Vou morar com a família de {p}, da minha idade.',['Me esforçar no idioma|sm+5 >c|Os primeiros dias foram mímica pura.','Ficar com os brasileiros|h+5 >c|Saudade de feijão.']],
 c:['Choque cultural','Tudo é diferente: a comida, os horários, o jeito de falar.',['Mergulhar na cultura|sm+4 vira:amigo >d|{p} me mostrou cada canto da cidade.','Sentir falta de casa|h-6 >d|Chorei ligando para minha mãe.']],
 d:['A volta','O intercâmbio acabou. {p} me levou ao aeroporto.',['Prometer visitar|h+6 >e@3-6|Combinamos de nos ver de novo.','Despedida emocionada|h+4|Seis meses que pareceram uma vida.']],
 e:['A visita','Anos depois, {p} veio me visitar.',['Mostrar minha cidade|h+10 bond+10|Agora é a minha vez de receber.','Fazer uma viagem juntos|$-3000 h+12 bond+10|Amizade que atravessa oceanos.']],
});
chain('bolsa_faculdade',{k:'Faculdade',min:17,max:30,when:NA_FACUL,gap:[1,1]},{
 a:['A mensalidade','A mensalidade da faculdade subiu e minha família não consegue pagar.',['Procurar uma bolsa|>b|Preenchi doze formulários.','Trancar a matrícula|h-8 >e|Vou trabalhar e voltar depois.','Arrumar um emprego à noite|$+1500 hl-3 >c|Trabalho de dia, estudo de noite.']],
 b:['A entrevista da bolsa','A entrevista para a bolsa é amanhã.',['Contar minha história com sinceridade|?k+10 $+5000 h+12 >d|Ganhei bolsa integral!|>c|Não consegui. Vou trabalhar à noite.','Exagerar um pouco a situação|?40 $+5000 k-4 >d|Funcionou.|k-4 >c|Perceberam.']],
 c:['Jornada dupla','Trabalhar e estudar está me esgotando.',['Aguentar até o fim|hl-4 grade-3 >d|Durmo no ônibus.','Diminuir as matérias|grade+3 >d|Vou demorar mais para formar, mas com saúde.']],
 d:['Formad{o}','Consegui me formar, com muito esforço.',['Agradecer a quem ajudou|k+5 h+15|Liguei para cada pessoa que me apoiou.','Comemorar sem parar|h+15|Ninguém sabe o que custou.']],
 e:['A volta','Depois de um ano trabalhando, posso voltar à faculdade.',['Voltar|grade+3 h+8 >d|Voltei mais madur{o}.','Não voltar|h-3|O trabalho me engoliu.']],
});
chain('professor_carreira',{k:'Carreira',min:22,max:60,when:m=>!!m.job&&['prof','univ','psub','pedg'].includes(m.job.id),npc:1,age:[-20,-10],gap:[1,1]},{
 a:['O aluno difícil','Na minha turma, {p} não para quiet{o2} e responde a todos os professores.',['Ter paciência|k+4 >b|Puxei uma cadeira para conversar depois da aula.','Mandar para a diretoria|perf+2 >c|Mais um na lista.']],
 b:['O motivo','{p} contou que cuida dos irmãos sozinh{o2} porque a mãe trabalha à noite.',['Ajudar com as tarefas no intervalo|k+8 >d|{p} começou a entregar trabalhos.','Avisar a assistência social|k+5 >d|A família recebeu apoio.']],
 c:['A expulsão','{p} está prestes a ser expuls{o2}.',['Defender {p} na reunião|?k k+6 >b|Ganhei mais uma chance para {ele}.|>e|Não adiantou.','Concordar com a expulsão|k-3 >e|Foi melhor para a turma.']],
 d:['A virada','{p} passou de ano com notas boas.',['Dizer que tenho orgulho|k+5 h+10 >f@5-10|{p} sorriu de um jeito que eu nunca tinha visto.','Ficar emocionad{o} em silêncio|h+8 >f@5-10|Por isso eu dou aula.']],
 e:['O arrependimento','Nunca mais soube de {p}.',['Procurar saber|?40 >d|Achei {p} trabalhando e estudando à noite.|h-4|Ninguém sabia.','Seguir|h-3|Não dá para salvar todo mundo.']],
 f:['O convite','Recebi um convite de formatura: {p} vai se formar em pedagogia e me chamou para ser homenagead{o}.',['Ir à formatura|h+20 k+5|{p} disse no microfone que eu mudei a vida d{ele}.','Mandar uma carta|h+15|Não consegui ir, mas escrevi três páginas.']],
});
