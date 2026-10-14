// ===== Mais eventos com membros (parte 5): grupo do apocalipse, grupo do isekai, heróis e mais vida real =====
pack({k:'Grupo',w:1.2,cd:15,scen:'zumbi',when:scWhen('zumbi'),crew:1},[
  ['Turno de vigia','{c} adormeceu no turno de vigia.',['Acordar com calma|clv+6|{c} pediu desculpas e nunca mais dormiu.','Gritar na frente de todos|clv-10 moral-3|{c} ficou humilhad{co}.']],
  ['Música no rádio','{c} achou uma fita cassete da banda favorita.',['Ouvir todos juntos|clv+8 moral+5 h+6|Cantamos baixinho, para não atrair zumbis.','Mandar desligar|clv-4|Barulho atrai mortos.']],
  ['Ferida feia','{c} cortou a mão abrindo uma porta emperrada.',['Costurar com linha de pesca|-it:@remedio chp+15 clv+8|Ficou feio, mas fechou.','Enrolar num pano|chp+5|Vamos ver como fica.']],
  ['Segredo','{c} confessa que fez coisas terríveis para sobreviver antes de te encontrar.',['Perdoar|clv+12 h-2|Todo mundo fez algo de que se arrepende.','Ficar desconfiad{o}|clv-8|{c} percebeu.']],
  ['Habilidade escondida','{c} sabe fazer ligação direta em carros.',['Pedir para ensinar|clv+8 zxp+10|Agora eu também sei.','Usar na próxima saída|veh+|Saímos com um carro novo.']],
  ['Desaparecid{co}','{c} saiu para buscar água e não voltou.',['Ir atrás|?pwr clv+15 h+4|Achei {c} preso num telhado cercado de zumbis.|hl-15 cdie|Cheguei tarde.','Esperar até amanhã|?50 clv+2|{c} voltou com água e uma história.|cbye|{c} nunca voltou.']],
  ['Aniversário perdido','{c} nem sabe mais que dia é e acha que é aniversário dele.',['Fazer uma festinha|-it:@comida clv+12 moral+4|Velas improvisadas num pão velho.','Dizer que não dá|clv-4|{c} ficou triste.']],
  ['Liderança','{c} questiona suas decisões na frente do grupo.',['Explicar o plano com calma|?car clv+8 moral+3|{c} concordou.|clv-6|Continuou discordando.','Impor autoridade|clv-10 moral-2|Silêncio desconfortável.']],
  ['Cachorro perdido','{c} quer adotar um cachorro que seguiu o grupo.',['Deixar|bicho:cachorro clv+8 moral+4|O cachorro late quando zumbis chegam perto.','Afastar o cachorro|clv-6|{c} chorou escondid{co}.']],
  ['Plano de fuga','{c} sugere um atalho perigoso para chegar mais rápido.',['Topar|?50 etapa+1 clv+6|Funcionou!|hl-12|Era uma armadilha de saqueadores.','Recusar|clv-4|Melhor o caminho longo.']],
  ['Diário','Você encontra o diário de {c}. Tem uma página sobre você.',['Ler|h+4 clv-4|Ele escreveu que eu salvei a vida dele.','Devolver sem ler|clv+6 k+3|Privacidade, mesmo no fim do mundo.']],
  ['Saudade da mãe','{c} conta que a mãe virou zumbi na frente dele.',['Abraçar|clv+12 h-4|Choramos juntos.','Mudar de assunto|clv-2|Melhor não lembrar.']],
]);
pack({k:'Grupo',w:1.2,cd:15,scen:'isekai',when:scWhen('isekai'),crew:1},[
  ['Treino de espada','{c} propõe um duelo de treino.',['Aceitar|?pwr xp+20 clv+8|Venci por pouco.|hl-6 clv+6|Perdi, mas aprendi.','Recusar|h+0|Hoje não.']],
  ['Passado sombrio','{c} conta que já foi um ladrão famoso.',['Aceitar o passado|clv+10|{c} prometeu usar as habilidades para o bem.','Ficar de olho|clv-6|{c} percebeu a desconfiança.']],
  ['Feitiço errado','{c} errou um feitiço e transformou a comida em sapos.',['Rir|clv+8 h+6|Sapos saltando pelo acampamento.','Brigar|clv-8 fome+5|Ficamos sem jantar e sem paz.']],
  ['Lar de {c}','{c} quer visitar a vila natal no caminho.',['Ir|clv+12 h+4 ouro+10|A família de {c} nos recebeu como heróis.','Seguir viagem|clv-6|{c} ficou olhando a estrada para trás.']],
  ['Maldição','{c} foi amaldiçoad{co} por uma bruxa.',['Gastar mana para quebrar a maldição|mana-25 clv+12 chp+10|Quebrei a maldição.','Procurar um sacerdote|ouro-30 clv+8|Resolvido.']],
  ['Bebida de anão','{c} desafia você a beber hidromel de anão.',['Aceitar|?hl clv+8 h+8|Venci. Acordei com dor de cabeça.|hl-6 clv+6|Desmaiei na mesa.','Recusar|h+0|Sei os meus limites.']],
  ['Rival amoroso','{c} está apaixonad{co} pela mesma pessoa que você.',['Deixar {c} tentar|clv+8|Amizade acima de tudo.','Competir|clv-8|Clima tenso no grupo.']],
  ['Pesadelo com o Rei Demônio','{c} acorda gritando: sonhou com o Rei Demônio.',['Acalmar|clv+8|Ficamos acordados até o sol nascer.','Dizer que é bobagem|clv-4|{c} ficou com medo sozinh{co}.']],
  ['Ferimento de batalha','{c} levou uma flechada protegendo você.',['Usar a melhor poção|-it:@remedio chp+30 clv+12|{c} vai ficar bem.','Fazer um curativo simples|chp+10 clv+4|Vai cicatrizar.']],
  ['Herança mágica','{c} herdou um amuleto mágico e quer dar para você.',['Aceitar|clv+10 mana+20|O amuleto brilha quando estou em perigo.','Recusar|clv+4|É uma lembrança da família de {c}.']],
]);
pack({k:'Superpoderes',w:1.1,cd:22,scen:'heroi',when:HW(()=>!!hTeam()),who:'heroEq'},[
  ['Base secreta','{p} te mostra a base secreta pessoal.',['Guardar o segredo|bond+12|Agora sou da confiança total.','Pedir para usar também|bond+4 pw+2|Treino com equipamentos novos.']],
  ['Herói e jornalista','{p} namora uma jornalista que está perto de descobrir a equipe.',['Alertar {p}|bond+6 sec+4|{p} terminou o namoro.','Confiar|?50 bond+8|A jornalista guardou o segredo.|sec-15|A matéria saiu.']],
  ['Missão de resgate','{p} foi capturad{o2} por {inimigo}.',['Resgatar sozinh{o}|?pwr bond+15 rep+10|Tirei {p} de lá.|hl-20|Fui capturad{o} também, mas fugimos juntos.','Esperar a equipe|bond+4|Demoramos, mas resgatamos.']],
  ['Herói vaidoso','{p} só pensa em aparecer na TV.',['Brincar com isso|bond+4 h+4|{p} riu de si mesm{o2}.','Criticar|bond-8|{p} ficou ofendid{o2}.']],
  ['Pacto','{p} propõe um pacto: se um cair, o outro cuida da família.',['Aceitar|bond+15 pamigo|Pacto selado com um aperto de mão.','Recusar|bond-4|Não gosto de pensar nisso.']],
  ['Poder novo','{p} descobriu um poder novo e quer testar em você.',['Deixar|?50 bond+8 pw+4|Foi incrível.|hl-8|Doeu.','Recusar|h+0|Melhor não.']],
  ['Herói mentor','{p} se oferece para ser seu mentor.',['Aceitar|pw+6 bond+10|Aprendi técnicas novas.','Recusar|h+0|Prefiro aprender sozinh{o}.']],
]);
pack({k:'Escola',w:1,cd:10,min:6,max:25,when:NP,who:'clube'},[
  ['Viagem internacional','O time foi convidado para um torneio no exterior, e {p} não tem passaporte.',['Ajudar a tirar o passaporte|bond+12|{p} conseguiu a tempo.','Deixar para lá|bond-4|{p} ficou em casa.']],
  ['Recorde','{p} quebrou o recorde da escola.',['Comemorar|bond+8 h+4|Festa no vestiário.','Treinar para quebrar o recorde de {ele}|bond+2 tal.athletic+3|Rivalidade saudável.']],
  ['Lanche pós-treino','{p} sempre leva lanche para todo o time.',['Retribuir|$-30 bond+8|Agora revezamos.','Só agradecer|bond+2|Valeu!']],
  ['Bolsa de estudos','{p} ganhou uma bolsa de atleta numa faculdade.',['Comemorar|bond+10|Prometemos manter contato.','Ficar com inveja|h-6|Por que não eu?'],{min:15}],
  ['Treinador doente','O técnico adoeceu e {p} vai treinar o time.',['Apoiar {p}|bond+10|O time não perdeu nenhum jogo.','Questionar|bond-8|Climão no treino.']],
]);
pack({k:'Trabalho',w:1,cd:10,min:16,when:m=>NP(m)&&!!m.job&&!m.job.spc&&!m.job.hero,who:'colega'},[
  ['Colega promovido','{p} foi promovido e agora é seu superior.',['Parabenizar|bond+8|{p} prometeu não mudar.','Ficar ressentid{o}|bond-10 h-4|Climão.']],
  ['Ideia conjunta','Você e {p} têm uma ideia juntos que pode render um prêmio.',['Apresentar juntos|perf+8 bond+10|Ganhamos o prêmio de inovação.','Apresentar sozinh{o}|perf+8 pinimigo k-6|Ganhei o prêmio e um inimigo.']],
  ['Vaquinha','{p} faz uma vaquinha para um colega doente.',['Contribuir|$-100 bond+8 k+4|Juntamos o suficiente.','Não contribuir|bond-4|Todo mundo viu.']],
  ['Colega some','{p} não aparece há três dias e não responde mensagens.',['Ir até a casa de {ele}|bond+12 k+4|{p} estava doente e sozinh{o2}. Levei comida.','Avisar o RH|bond+2|O RH resolveu.']],
  ['Desabafo no café','{p} te conta que odeia o próprio trabalho.',['Ajudar a pensar em outra carreira|bond+10|{p} saiu para fazer o que ama.','Dizer para aguentar|bond+2|Todos aguentam.']],
]);
pack({k:'Empresa',w:1,cd:10,min:18,when:m=>NP(m)&&!!m.biz,who:'func'},[
  ['Cliente furioso','Um cliente grita com {p}.',['Defender {p}|bond+12 biz-1|O cliente foi embora. A equipe me aplaudiu.','Mandar {p} pedir desculpas|bond-8 biz+1|O cliente ficou.']],
  ['Funcionário estuda à noite','{p} faz faculdade à noite e chega cansado.',['Pagar parte da faculdade|$-3000 bond+15|{p} se formou e virou gerente.','Ignorar|h+0|Problema dele.']],
  ['Dia de folga','{p} pede um dia de folga para o casamento da filha.',['Dar o dia e um presente|$-300 bond+12|{p} me mandou fotos do casamento.','Dar só o dia|bond+6|Justo.']],
  ['Erro grave','{p} cometeu um erro que custou caro à empresa.',['Perdoar|bond+12 biz-2|{p} trabalhou dobrado para compensar.','Descontar do salário|bond-10|Justo, mas frio.']],
  ['Uniforme novo','{p} sugere um uniforme novo para a equipe.',['Aprovar|$-1000 bond+8 biz+1|A equipe ficou mais unida.','Recusar|h+0|Gasto desnecessário.']],
]);
