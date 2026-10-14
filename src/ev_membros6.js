// ===== Mais eventos com membros (parte 6) =====
pack({k:'Escola',w:1,cd:12,min:6,max:30,when:m=>NP(m)&&!!m.edu.cur,who:'prof'},[
  ['Redação premiada','{p} inscreveu sua redação num concurso nacional.',['Agradecer|bond+10 tal.writing+3|Fiquei em segundo lugar no país!','Dizer que não queria|bond-4|{p} retirou a inscrição.']],
  ['Professor rouba sua ideia','{p} usou um trabalho seu numa palestra sem te citar.',['Conversar em particular|?50 bond+4|{p} pediu desculpas e me citou na próxima.|bond-6|{p} negou.','Deixar para lá|h-2|Fiquei com raiva sozinh{o}.']],
  ['Chamada para ajudar','{p} te escolhe como monitor da turma.',['Aceitar|bond+10 grade+2 sm+2|Ensinar é aprender duas vezes.','Recusar|h+0|Muita responsabilidade.']],
  ['Professor e celular','{p} te pega no celular durante a prova.',['Explicar que era emergência|?40 bond+2|Acreditou.|grade-10|Zero na prova.','Aceitar o castigo|grade-6 k+2|Mereci.']],
  ['Último dia','No último dia de aula, {p} se despede da turma emocionad{o2}.',['Dar um abraço|bond+12 h+4|{p} disse que vai lembrar de mim.','Só acenar|bond+2|Tchau, professor.']],
]);
pack({k:'Trabalho',w:1,cd:12,min:16,when:m=>NP(m)&&!!m.job&&!m.job.spc&&!m.job.hero,who:'boss'},[
  ['Chefe confessa','{p} confessa que vai ser demitid{o2} e indicou você para o lugar.',['Agradecer|bond+12 promo|Assumi o cargo.','Recusar|bond+6 k+4|Não quero subir assim.']],
  ['Chefe na sua casa','{p} aparece de surpresa na sua festa de aniversário.',['Receber bem|bond+10 h+4|{p} trouxe um presente caro.','Ficar sem graça|bond+2|Climão.']],
  ['Chefe pede segredo','{p} te conta um segredo da empresa.',['Guardar|bond+12|Confiança total.','Contar para os colegas|bond-15|{p} descobriu quem vazou.']],
]);
pack({k:'Carreira',w:1,cd:12,min:14,when:m=>NP(m)&&!!m.job&&!!m.job.spc,who:'spcEq'},[
  ['Homenagem','{p} te homenageia publicamente numa entrevista.',['Retribuir|bond+12 f+2|Viramos melhores amigos.','Agradecer em particular|bond+6|Discreto.']],
  ['Mentor e aprendiz','{p} pede que você seja mentor dele.',['Aceitar|bond+12 k+4|{p} cresceu muito.','Recusar|h+0|Não tenho tempo.']],
  ['Briga pública','{p} te critica numa entrevista.',['Responder com elegância|f+3 bond+4|Saí por cima.','Responder com raiva|f+2 pinimigo|Treta na imprensa.']],
]);
pack({k:'Religião',w:1,cd:12,min:18,when:m=>NP(m)&&!!m.seita,who:'fiel'},[
  ['Visão do fiel','{p} diz que teve uma visão sobre o futuro de {seita}.',['Ouvir com atenção|bond+8 devo+3|A visão animou o grupo.','Mandar calar|bond-8 devo-2|{p} ficou magoad{o2}.']],
  ['Fiel advogado','{p} é advogado e se oferece para defender o grupo.',['Aceitar|bond+10 susp-6|O grupo ficou mais protegido.','Recusar|h+0|Prefiro não misturar.']],
  ['Fiel artista','{p} pintou um mural lindo no templo.',['Inaugurar com festa|bond+12 devo+4 sfama+2|O mural virou ponto de visita.','Agradecer|bond+4|Bonito.']],
]);
pack({k:'Política',w:1,cd:12,min:21,when:m=>NP(m)&&!!m.office,who:'gabinete'},[
  ['Assessor fiel','{p} recusou uma proposta de suborno para trair você.',['Recompensar|$-5000 bond+15|Lealdade rara.','Agradecer|bond+8|Gratidão eterna.']],
  ['Assessor cansado','{p} trabalhou 80 horas na semana e está exaust{o2}.',['Dar uma semana de folga|bond+12 appr-1|{p} voltou renovad{o2}.','Pedir mais esforço|bond-8 appr+2|{p} pediu demissão no mês seguinte.']],
]);
pack({k:'Realeza',w:1,cd:12,when:m=>NP(m)&&!!m.royal&&!m.royal.abd,who:'corte'},[
  ['Duelo de honra','{p} desafia um nobre estrangeiro para defender sua honra.',['Impedir o duelo|bond+8 pop+2|Diplomacia vence.','Deixar acontecer|?50 bond+12 pop+4|{p} venceu.|pop-4|{p} perdeu e o reino passou vergonha.']],
  ['Segredo da rainha mãe','{p} sabe um segredo antigo da família real.',['Pedir que conte|?50 bond+6 sm+2|Descobri um meio-irmão perdido.|h-4|Era melhor não saber.','Pedir silêncio eterno|bond+8|O segredo morreu com {p}.']],
]);
pack({k:'Base',w:1.2,cd:14,scen:'zumbi',when:ZW(sc=>!!sc.zb&&sc.zb.pop>0),gente:'zbase'},[
  ['Artista da base','{mor} pintou um mural colorido no muro da base.',['Elogiar|glv+10 zmoral+6|O muro mais bonito do apocalipse.','Mandar apagar|glv-8|Cores chamam atenção.']],
  ['Morador some à noite','{mor} sai escondid{mo} toda noite.',['Seguir {moeln}|?50 glv+6|{mor} visitava o túmulo da família.|glv-6|{mor} percebeu e ficou furios{mo}.','Perguntar direto|glv+4|{mor} contou tudo.']],
  ['Morador arruma brigas','{mor} arruma briga com todo mundo.',['Dar uma tarefa pesada|glv-2 zmat+5|Cansado, ficou calmo.','Expulsar|gsai zmoral+2|A paz voltou.']],
  ['Professor da base','{mor} começou a dar aulas para as crianças da base.',['Apoiar com materiais|glv+12 zmoral+5|As crianças aprendem a ler no fim do mundo.','Achar perda de tempo|glv-6|Mas ensinou mesmo assim.']],
]);
pack({k:'Vila',w:1.2,cd:14,scen:'isekai',when:ZW(sc=>!!sc.vila&&sc.vila.pop>0),gente:'vila'},[
  ['Elfo na vila','{mor} é a primeira pessoa de outra raça a morar na vila.',['Receber com festa|glv+10 vfel+4|A vila ficou mais diversa e alegre.','Deixar a vila decidir|vfel-2 glv-2|Houve desconfiança no começo.']],
  ['Inventor','{mor} inventou um moinho mais eficiente.',['Financiar|ouro-40 vcom+8 glv+12|A produção dobrou.','Recusar|glv-4|{mor} construiu sozinh{mo}, devagar.']],
  ['Morador idoso','{mor}, o mais velho da vila, está muito doente.',['Visitar|glv+12 h-2|{mor} contou a história da região.','Mandar remédio|-it:@remedio glv+8|Melhorou um pouco.']],
]);
