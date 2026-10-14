// ===== Mais eventos com membros (parte 3): mais escola e trabalho, fiéis, gabinete, funcionários e corte =====
pack({k:'Escola',w:1,cd:9,min:6,max:25,when:NP,who:'clube'},[
  ['Apelido no time','O time inteiro passou a te chamar pelo apelido que {p} inventou.',['Assumir o apelido|bond+8 h+4|Agora todo mundo me chama assim.','Pedir para parar|bond-4|Continuaram, só que escondido.']],
  ['Festa da vitória','{p} faz uma festa em casa para comemorar o título.',['Ir|bond+10 h+8|A melhor festa do ano.','Não ir|bond-4|Vi tudo pelos stories.']],
  ['Colega sem dinheiro','{p} não tem dinheiro para a inscrição do campeonato.',['Pagar por {ele}|$-100 bond+15 pamigo|{p} nunca esqueceu.','Fazer uma vaquinha|bond+8 k+3|O time inteiro ajudou.']],
  ['Disputa de capitão','O técnico vai escolher entre você e {p} para capitão.',['Indicar {p}|bond+12 k+4|{p} me abraçou na frente de todos.','Lutar pela vaga|?50 h+6|Virei capitão.|bond-6|{p} foi escolhid{o2}.']],
  ['Trote','{p} prega uma peça em você: encheu sua mochila de areia.',['Revidar com outra peça|bond+6 h+6|Guerra de pegadinhas.','Contar ao técnico|bond-8|{p} ficou de castigo.']],
  ['Medo de perder','{p} tem crises de ansiedade antes dos jogos.',['Ajudar a respirar|bond+12|{p} jogou o melhor jogo da vida.','Dizer para ser forte|bond-2|Não ajudou muito.']],
  ['Torcida de um só','Nos jogos, só a mãe de {p} grita na arquibancada. E grita muito.',['Fazer amizade com a mãe|bond+8 h+4|Agora ela grita meu nome também.','Rir disso|bond-4|{p} ficou envergonhad{o2}.']],
  ['Colega de outra escola','{p} vai mudar para o time rival.',['Desejar sorte|bond+6 psai|Nos enfrentamos na final. Abraço no fim do jogo.','Chamar de traidor|pinimigo|O clássico ficou pessoal.']],
]);
pack({k:'Escola',w:1,cd:9,min:6,max:30,when:m=>NP(m)&&!!m.edu.cur,who:'classmate'},[
  ['Fofoca da turma','{p} espalhou que você gosta de alguém da sala.',['Rir e negar|h+2 bond-2|Ninguém acreditou na negação.','Confrontar {ele}|bond-8|{p} disse que foi brincadeira.']],
  ['Ajuda na lição','{p} não entende nada de matemática e pede ajuda.',['Explicar|bond+10 sm+2|Ensinar também ensina.','Passar a resposta|bond+4 k-2|{p} copiou tudo.']],
  ['Lanche trocado','{p} propõe trocar o lanche todo dia.',['Topar|bond+6 h+2|Às vezes eu ganho, às vezes perco.','Recusar|h+0|Meu lanche é meu.']],
  ['Viagem de formatura','{p} quer dividir o quarto com você na viagem de formatura.',['Aceitar|bond+12 pamigo|Histórias para a vida inteira.','Recusar|bond-4|Fiquei com outra pessoa.'],{min:14}],
  ['Primeiro emprego','{p} conseguiu o primeiro emprego e está todo orgulhoso.',['Comemorar com {ele}|bond+8|{p} pagou o lanche.','Ficar com inveja|h-4|Por que não eu?'],{min:15}],
  ['Colega briguento','{p} quer brigar com você na saída.',['Conversar antes|?sm bond+4|Era um mal-entendido.|hl-6 pinimigo|Brigamos mesmo.','Não ir à saída|h-2|{p} me chamou de covarde.']],
  ['Grupo de estudos','{p} cria um grupo de estudos para o vestibular.',['Entrar|grade+5 bond+8 sm+2|Passamos todos!','Estudar sozinh{o}|grade+3|Cada um no seu ritmo.'],{min:15}],
  ['Desabafo','{p} conta que os pais estão se divorciando.',['Ouvir com atenção|bond+12|{p} disse que precisava muito disso.','Mudar de assunto|bond-4|{p} se fechou.']],
  ['Show juntos','{p} tem dois ingressos para um show e te convida.',['Ir|bond+10 h+10|Gritamos todas as músicas.','Recusar|bond-2|{p} foi com outra pessoa.'],{min:13}],
  ['Ex da escola','{p} terminou com o namorado e está muito triste.',['Consolar com sorvete|bond+10|Tomamos um litro.','Dizer que é melhor assim|bond+2|Verdade, mas doeu.'],{min:13}],
]);
pack({k:'Escola',w:1,cd:12,min:6,max:30,when:m=>NP(m)&&!!m.edu.cur,who:'prof'},[
  ['Projeto especial','{p} te convida para um projeto de iniciação científica.',['Aceitar|sm+5 bond+10 grade+3|Meu nome num artigo!','Recusar|h+0|Muito trabalho.'],{min:14}],
  ['Professor substituto','{p} está substituindo e a turma faz bagunça.',['Ajudar a controlar a turma|bond+10 k+3|{p} me agradeceu depois.','Bagunçar junto|bond-8 h+4|Divertido, mas maldoso.']],
  ['Pergunta difícil','Você faz uma pergunta que {p} não sabe responder.',['Esperar a resposta na próxima aula|bond+6 sm+2|{p} trouxe uma resposta incrível.','Tirar sarro|bond-12|A turma riu. {p} não.']],
  ['Recuperação','{p} te dá uma chance extra para não reprovar.',['Agarrar a chance|grade+8 bond+8|Passei raspando.','Desperdiçar|grade-4 bond-6|Reprovei na matéria.']],
  ['Professor no shopping','Você encontra {p} no shopping fazendo compras.',['Cumprimentar|bond+6|{p} ficou feliz em ser lembrad{o2}.','Fingir que não viu|h+0|Professor fora da escola é estranho.']],
]);
pack({k:'Trabalho',w:1,cd:9,min:16,when:m=>NP(m)&&!!m.job&&!m.job.spc&&!m.job.hero,who:'colega'},[
  ['Colega some com o grampeador','Seu grampeador sumiu e está na mesa de {p}.',['Pegar de volta sem falar nada|h+2|Guerra silenciosa de material de escritório.','Comprar dois grampeadores|$-20 bond+4|Um de presente para {p}.']],
  ['Dica de investimento','{p} jura que tem uma dica de investimento infalível.',['Investir|?40 $+3000|Deu certo!|$-2000|Perdi dinheiro. {p} também.','Recusar|h+0|Infalível nada é.']],
  ['Colega estagiário','{p} é estagiário e está sobrecarregado.',['Ajudar e ensinar|bond+12 k+4|{p} foi efetivado e disse que foi por minha causa.','Passar mais tarefas|perf+2 bond-8|Ele aprendeu na marra.']],
  ['Reunião chata','Numa reunião de três horas, {p} manda mensagens engraçadas para você.',['Responder|bond+8 h+4|Quase ri alto na frente do diretor.','Ignorar|perf+1|Foco.']],
  ['Carona','{p} mora perto e oferece carona todo dia.',['Aceitar e dividir a gasolina|bond+10 $-50|Viramos amigos no trânsito.','Recusar|h+0|Gosto do meu ônibus.']],
  ['Rivalidade amigável','Você e {p} competem para bater a meta primeiro.',['Competir|perf+6 bond+4|Os dois bateram a meta. Pizza para todos.','Não entrar na disputa|h+0|Tranquilo.']],
  ['Colega em luto','O pai de {p} morreu.',['Ir ao velório|bond+12 k+4|{p} me abraçou e chorou.','Mandar flores|bond+6|{p} agradeceu.']],
  ['Colega demitido','{p} foi demitido de surpresa.',['Ajudar a achar outro emprego|bond+12 pamigo|{p} conseguiu emprego em um mês.','Desejar sorte|psai|{p} recolheu as coisas numa caixa.']],
  ['Planta da mesa','{p} pede para você regar a planta dela nas férias.',['Regar todo dia|bond+8|Voltou viva e maior.','Esquecer|bond-6|Morreu. Comprei outra igual.']],
  ['Viralizou','{p} postou um vídeo da equipe e viralizou.',['Aproveitar a fama|f+2 bond+6|Todo mundo quer conhecer a "equipe do vídeo".','Pedir para apagar|bond-4|Já era tarde.']],
  ['Caso no escritório','Você descobre que {p} tem um caso com alguém casado da empresa.',['Guardar segredo|bond+6|Não é da minha conta.','Contar para alguém|bond-12 k-4|A fofoca chegou em {p}.']],
  ['Equipe de Natal','{p} organiza a decoração de Natal do escritório.',['Ajudar|bond+8 h+4|O escritório ficou lindo.','Achar brega|bond-4|{p} ficou chatead{o2}.']],
]);
pack({k:'Trabalho',w:1,cd:12,min:16,when:m=>NP(m)&&!!m.job&&!m.job.spc&&!m.job.hero,who:'boss'},[
  ['Chefe pede opinião','{p} pede sua opinião sincera sobre um projeto ruim.',['Ser sincer{o}|?50 bond+8 perf+4|{p} agradeceu a honestidade.|bond-6|{p} não gostou de ouvir.','Elogiar|bond+2 k-2|Mais um sim-senhor.']],
  ['Chefe sobrecarregado','{p} está à beira de um colapso de tanto trabalho.',['Oferecer ajuda|bond+10 perf+4|{p} disse que vai lembrar disso.','Ficar na sua|h+0|Cada um com sua cruz.']],
  ['Chefe com favorito','{p} claramente favorece outro colega.',['Trabalhar mais|perf+6|{p} começou a me notar.','Reclamar|bond-8|Piorou.']],
  ['Chefe aposentando','{p} vai se aposentar e quer indicar um substituto.',['Pedir a indicação|?perf promo bond+6|Fui indicad{o}!|bond+2|{p} indicou outra pessoa.','Desejar uma boa aposentadoria|bond+8|Ele me deu o telefone dele.']],
  ['Chefe em público','{p} te dá uma bronca na frente de clientes.',['Engolir e conversar depois|bond+4|{p} pediu desculpas em particular.','Responder na hora|bond-12 perf-6|Clima péssimo.']],
]);
pack({k:'Carreira',w:1,cd:10,min:14,when:m=>NP(m)&&!!m.job&&!!m.job.spc,who:'spcEq'},[
  ['Parceria criativa','{p} quer escrever algo junto com você.',['Topar|perf+6 bond+10|Ficou o melhor trabalho da carreira.','Recusar|h+0|Prefiro trabalhar sozinh{o}.']],
  ['Ego','{p} acha que é a estrela da equipe.',['Deixar {ele} brilhar|bond+6 k+2|Paz no grupo.','Disputar o destaque|perf+4 bond-8|Climão.']],
  ['Escândalo do colega','{p} se envolveu num escândalo e a imprensa pergunta sua opinião.',['Defender|bond+10 f-1|{p} agradeceu.','Se afastar|bond-10 f+1|Melhor não me envolver.']],
  ['Aniversário no trabalho','A equipe faz uma festa surpresa para {p}.',['Fazer um discurso|bond+10 h+4|{p} chorou.','Só cantar parabéns|bond+2|Normal.']],
  ['Colega te copia','{p} copia o seu estilo descaradamente.',['Tratar como elogio|bond+4 k+2|Imitação é homenagem.','Reclamar publicamente|bond-10 f+2|Polêmica nas redes.']],
  ['Viagem internacional','{p} e você são escalados para um trabalho no exterior.',['Ir juntos|bond+10 c:trips h+6|Uma semana inesquecível.','Ir sozinh{o}|c:trips|Trabalho é trabalho.']],
]);
pack({k:'Religião',w:1,cd:9,min:18,when:m=>NP(m)&&!!m.seita,who:'fiel'},[
  ['Fiel generoso','{p} doou o carro para {seita}.',['Agradecer em público|bond+10 caixa+20000|{p} se emocionou.','Recusar o carro|bond+4 k+4|{p} insistiu, mas aceitei só o abraço.']],
  ['Fiel cantor','{p} canta lindamente nos cultos.',['Colocar no coral|bond+8 devo+3|Os cultos ficaram mais bonitos.','Deixar como está|h+0|Nem todos querem holofote.']],
  ['Fiel brigado com a família','{p} brigou com a família por causa de {seita}.',['Ajudar a fazer as pazes|bond+8 k+4 susp-2|A família agradeceu.','Dizer que o grupo é a nova família|bond+6 devo+3 susp+3 k-4|{p} se afastou de todos.']],
  ['Fiel pede milagre','{p} pede um milagre para o filho doente.',['Orar e indicar um hospital|k+6 bond+8|O filho melhorou.','Prometer o milagre|devo+4 k-6|Agora preciso entregar.']],
  ['Fiel jovem','{p} tem 18 anos e quer largar a faculdade para servir {seita}.',['Mandar terminar os estudos|bond+6 k+6|{p} terminou e voltou para ajudar.','Aceitar|devo+4 k-6|Mais um servo em tempo integral.']],
  ['Disputa entre fiéis','{p} brigou com outro fiel por causa de um cargo.',['Mediar|?sm bond+6 devo+2|Paz no grupo.|bond-4|Ninguém ficou satisfeito.','Tomar partido de {p}|bond+10 devo-3|O outro saiu chateado.']],
  ['Testemunho emocionante','{p} conta no culto como {seita} mudou a vida dele.',['Aplaudir de pé|bond+8 devo+5|O templo inteiro chorou.','Pedir para gravar|sfama+3 bond+4|Virou vídeo de divulgação.']],
  ['Fiel some com dinheiro','{p} sumiu com o dinheiro da cantina do grupo.',['Perdoar em público|bond+4 devo+3 k+4|{p} voltou envergonhad{o2} e devolveu tudo.','Denunciar à polícia|psai susp-2|{p} foi preso.']],
  ['Fiel apaixonado','{p} confessa que está apaixonad{o2} por você.',['Corresponder|?55 pnamoro|Romance no grupo.|bond+4|Ficou só na amizade.','Recusar com carinho|bond+2|{p} entendeu.']],
  ['Fiel quer sair','{p} diz que quer sair de {seita}.',['Deixar ir em paz|psai k+6|{p} me abraçou na saída.','Convencer a ficar|?50 bond+6 devo+2|{p} ficou.|psai|{p} foi mesmo assim.']],
]);
pack({k:'Política',w:1,cd:9,min:21,when:m=>NP(m)&&!!m.office,who:'gabinete'},[
  ['Discurso escrito','{p} escreveu um discurso brilhante para você.',['Dar o crédito|bond+10 appr+3|O discurso foi um sucesso.','Fingir que é seu|appr+4 bond-6|{p} ficou magoad{o2}.']],
  ['Assessor ambicioso','{p} quer concorrer ao seu cargo na próxima eleição.',['Apoiar|bond+12 k+4|Formei um sucessor.','Sabotar|pinimigo appr+2|Agora tenho um inimigo dentro de casa.']],
  ['Viagem oficial','{p} organiza uma viagem oficial impecável.',['Elogiar publicamente|bond+8 appr+2|Equipe motivada.','Reclamar dos detalhes|bond-6|Ninguém é perfeito.']],
  ['Assessor doente','{p} precisa de uma cirurgia cara.',['Ajudar a pagar|$-10000 bond+15 k+6|{p} vai lembrar disso para sempre.','Desejar melhoras|bond+2|É o que dá para fazer.']],
  ['Segredo de Estado','{p} viu documentos que não devia.',['Confiar no silêncio|?50 bond+6|{p} guardou o segredo.|appr-8|{p} contou para a imprensa.','Demitir|psai appr-2|Melhor prevenir.']],
  ['Estagiário brilhante','{p}, estagiário do gabinete, sugere um projeto de lei muito bom.',['Apresentar o projeto citando {ele}|appr+6 bond+12|{p} virou assessor efetivo.','Apresentar como ideia sua|appr+6 k-4|Ninguém soube.']],
  ['Briga no gabinete','{p} brigou feio com outro assessor.',['Mediar|bond+4|Resolvido.','Demitir os dois|psai appr+2|Gabinete mais silencioso.']],
  ['Romance escondido','A imprensa fotografa você jantando com {p}.',['Assumir o relacionamento|?50 pnamoro appr-2|O povo achou romântico.|appr-6|Escândalo.','Dizer que foi reunião de trabalho|h-2|Ninguém acreditou.']],
]);
pack({k:'Empresa',w:1,cd:9,min:18,when:m=>NP(m)&&!!m.biz,who:'func'},[
  ['Funcionário antigo','{p} está na empresa desde o primeiro dia.',['Dar uma participação nos lucros|$-8000 bond+15 biz+2|{p} chorou de emoção.','Dar uma placa de homenagem|bond+6|Ficou na parede da recepção.']],
  ['Licença-maternidade','{p} vai ter um bebê e pede licença estendida.',['Conceder|bond+12 k+6|A equipe inteira ficou orgulhosa da empresa.','Negar|bond-12 k-6|{p} pediu demissão.']],
  ['Funcionário atrasado','{p} chega atrasado todo dia.',['Conversar|?50 bond+6|Era problema de transporte. Ajustei o horário.|bond-4|Continuou atrasando.','Demitir|psai|Fora.']],
  ['Inventor da empresa','{p} inventou um produto novo na hora do almoço.',['Lançar com o nome de {ele}|biz+10 bond+12|Sucesso de vendas.','Lançar sem dar crédito|biz+10 bond-12 k-6|{p} foi para a concorrência.']],
  ['Greve','{p} lidera uma greve por melhores salários.',['Negociar|$-6000 bond+8 biz+2|Acordo fechado.','Demitir o líder|psai biz-4 k-6|A greve piorou.']],
  ['Funcionário ferido','{p} se machucou no trabalho.',['Pagar o tratamento|$-4000 bond+12 k+4|{p} voltou mais leal.','Deixar com o plano de saúde|bond-4|{p} ficou chateado.']],
  ['Proposta da concorrência','A concorrência quer contratar {p}.',['Cobrir a oferta|$-5000 bond+10|{p} ficou.','Deixar ir|psai|Boa sorte.']],
  ['Festa de aniversário da empresa','{p} organizou a festa de aniversário da empresa.',['Fazer um discurso agradecendo|bond+10|Equipe unida.','Só aparecer|bond+2|Ok.']],
  ['Funcionário infeliz','{p} parece infeliz há semanas.',['Perguntar o que houve|bond+12 k+3|Era sobrecarga. Contratei ajuda.','Ignorar|bond-6|{p} pediu demissão.']],
  ['Romance no escritório','{p} te convida para um café depois do expediente.',['Ir|?50 pnamoro|Romance no trabalho.|bond+4|Só um café.','Recusar|h+0|Chefe não namora funcionário.']],
]);
pack({k:'Realeza',w:1,cd:10,when:m=>NP(m)&&!!m.royal&&!m.royal.abd,who:'corte'},[
  ['Baile real','{p} te convida para a primeira dança do baile.',['Dançar|bond+10 pop+2|A corte inteira aplaudiu.','Recusar|bond-6|{p} ficou humilhad{o2}.'],{min:14}],
  ['Mordomo leal','{p} sabe todos os segredos do palácio.',['Dar um aumento|$-20000 bond+12|Lealdade garantida.','Ficar desconfiad{o}|bond-6|{p} sentiu a desconfiança.']],
  ['Conspiração','{p} conta que alguém da corte conspira contra você.',['Investigar|?sm pop+4 bond+10|{p} tinha razão.|bond-4|Era intriga.','Ignorar|h-2|Prefiro não saber.']],
  ['Presente real','{p} te dá um presente de família, de 300 anos.',['Aceitar com honra|bond+10 h+4|Uma relíquia.','Recusar|bond-4|{p} ficou ofendid{o2}.']],
  ['Guarda ferido','{p} foi ferido protegendo você de um invasor.',['Visitar no hospital|bond+15 pop+4|A imprensa fotografou. O povo amou.','Mandar flores|bond+4|Gesto real.']],
  ['Bobo da corte','{p} faz uma piada sobre você na frente de diplomatas.',['Rir junto|pop+4 bond+6|Os diplomatas adoraram.','Banir do palácio|psai pop-2|O palácio ficou sem graça.']],
  ['Herdeiro ilegítimo','{p} insinua ser seu meio-irmão.',['Fazer um teste de DNA|?30 bond+10|Era verdade! Um novo membro da família.|pinimigo|Era mentira.','Abafar|h-2|Segredo de família.']],
]);
