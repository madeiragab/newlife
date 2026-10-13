// ===== Eventos por profissão =====
pack({k:'Hospital',when:jobIn('medi','ciru','enfe','tenf')},[
 ['Plantão de 36 horas','O pronto-socorro está lotado e faltou metade da equipe.',['Ficar até o fim|perf+8 hl-4 h-3|Saí do plantão sem sentir as pernas, mas salvei vidas.','Ir embora no horário|perf-6|Fui para casa. A chefia anotou.']],
 ['Paciente difícil','Um paciente está gritando e se recusa a tomar a medicação.',['Conversar com calma|?k k+3 perf+4|Ele se acalmou e me agradeceu depois.|perf-2|Ele jogou a bandeja em mim.','Chamar a segurança|perf+1|Resolvido em dois minutos.']],
 ['Erro na prescrição','Percebi que um colega prescreveu uma dose errada.',['Corrigir e avisar o colega|k+4 perf+6|Evitei uma tragédia. O colega ficou grato.','Denunciar à direção|k+2 perf+3|O colega foi afastado. O clima ficou tenso.','Fingir que não vi|k-8|O paciente teve uma reação. Não consigo dormir.']],
 ['Cirurgia de emergência','Chegou um acidentado em estado grave e só eu estou disponível.',['Assumir o caso|?sm+5 perf+12 h+8 f+1|O paciente sobreviveu. Virei referência no hospital.|perf-8 h-12|Não consegui salvá-lo.','Esperar o especialista|perf-4|O especialista chegou em 40 minutos.']],
 ['Surto de gripe','Metade da cidade está gripada e o hospital não para.',['Trabalhar dobrado|perf+6 hl-3 dis:gripe|Peguei a gripe também, mas o hospital aguentou.','Manter a rotina|perf+1|Fiz minha parte.']],
 ['Paciente famoso','Um cantor famoso foi internado no meu setor.',['Manter o sigilo|k+3 perf+4|Ele me mandou ingressos para o próximo show.','Vender a informação para um site|$v k-8|Ganhei {v}. Se descobrirem, perco o registro.']],
 ['Plantão de Natal','Me escalaram para o plantão de Natal.',['Aceitar|perf+5 h-4|Comi panetone de máquina com os colegas.','Trocar com um colega|h+3|Paguei a troca com dois plantões de domingo.']],
]);
pack({k:'Consultório',when:jobIn('dent','farm','vete','psic')},[
 ['Cliente que não paga','Um cliente antigo está devendo {v} há meses.',['Cobrar firme|?60 $v|Ele pagou tudo.|h-3|Ele sumiu e falou mal de mim no bairro.','Perdoar a dívida|k+4|Ele chorou e trouxe um bolo.']],
 ['Avaliação na internet','Uma avaliação de 1 estrela injusta apareceu no meu perfil.',['Responder educadamente|perf+3|Outros clientes me defenderam.','Responder com raiva|perf-5 f+1|Virei print em grupo de WhatsApp.']],
 ['Equipamento novo','Um fornecedor oferece um equipamento moderno por {v}.',['Comprar|$-v perf+8|Os clientes adoraram a novidade.','Continuar com o antigo|perf-2|Funciona. Mais ou menos.'],{v:[3000,30000]}],
 ['Caso marcante','Atendi um caso que mexeu muito comigo.',['Levar para casa|h-6|Não consegui parar de pensar nisso.','Conversar com um colega|h+2|Desabafar ajudou.']],
]);
pack({k:'Tribunal',when:jobIn('adv','juiz','promo')},[
 ['Cliente culpado','Meu cliente confessou em particular que é culpado.',['Defender mesmo assim|perf+6 k-2|É meu dever. Ganhei o caso.','Pedir para sair do caso|k+3 perf-3|Não consegui seguir.']],
 ['Caso famoso','Fui chamad{o} para atuar num caso que está em todos os jornais.',['Aceitar|?sm perf+12 f+6|Ganhei e virei referência.|perf-6 f+2|Perdi diante das câmeras.','Recusar|perf-2|Prefiro casos discretos.']],
 ['Proposta de suborno','Alguém me ofereceu {v} para "dar uma ajudinha" num processo.',['Recusar e denunciar|k+8 perf+5|Virei exemplo de integridade.','Aceitar|$v k-12 ?60|Ninguém soube.|arrest:corrupção:2:8|Era uma armadilha da corregedoria.'],{v:[20000,200000]}],
 ['Audiência às 8h','Esqueci uma audiência importante marcada para hoje.',['Correr para o fórum|?55 perf+2|Cheguei suad{o}, mas a tempo.|perf-8|O juiz já tinha encerrado.','Pedir adiamento|perf-3|Consegui adiar, com bronca.']],
 ['Estagiário brilhante','{n}, que estagia comigo, é muito bo{on}. Melhor que eu, talvez.',['Ensinar tudo o que sei|k+3 perf+3 meet:colegaT|{eln} vai longe. E me deve uma.','Esconder o jogo|k-2|Melhor não criar concorrência.']],
]);
pack({k:'Escola',when:jobIn('prof','univ')},[
 ['Aluno problemático','Um aluno está atrapalhando todas as aulas.',['Conversar com ele depois da aula|?k k+4 perf+5|Descobri que ele passa por problemas em casa. Melhorou muito.|perf-2|Ele riu da minha cara.','Mandar para a diretoria|perf+1|Resolveu por uma semana.']],
 ['Greve dos professores','O sindicato convocou greve por reajuste.',['Aderir|?55 raise+8|Conseguimos 8% de reajuste.|h-4|A greve fracassou.','Continuar dando aula|perf+3 k-2|Os colegas me olharam torto.']],
 ['Turma de recuperação','Me deram a turma com as piores notas da escola.',['Encarar o desafio|perf+8 h-3|No fim do ano, a turma passou inteira.','Fazer o mínimo|perf-3|Metade reprovou.']],
 ['Homenagem','Uma turma antiga me escolheu como paraninf{o} da formatura.',['Aceitar e fazer um discurso|h+10 f+1|Chorei no discurso. Eles também.','Agradecer e recusar|h+2|Fiquei com vergonha.']],
 ['Correção de provas','Tenho 200 provas para corrigir até amanhã.',['Varar a madrugada|perf+4 hl-2|Terminei às 5h.','Dar nota por amostragem|perf-4 k-3|Ninguém percebeu. Acho.']],
]);
pack({k:'Pesquisa',when:jobIn('cien','univ','astr')},[
 ['Descoberta','Meus dados mostram algo que ninguém tinha visto antes.',['Publicar logo|?sm perf+12 f+4|O artigo foi parar numa revista internacional.|perf-6|Havia um erro na análise. Vergonha.','Repetir o experimento|perf+5|Confirmado. Publico com segurança.']],
 ['Corte de verbas','O governo cortou a verba do meu laboratório.',['Buscar financiamento privado|?55 perf+5|Uma empresa patrocinou a pesquisa.|h-5|Ninguém se interessou.','Pagar do meu bolso|$-v perf+4|Gastei {v} para não parar a pesquisa.'],{v:[5000,40000]}],
 ['Congresso no exterior','Fui convidad{o} para apresentar meu trabalho num congresso em {lugar}.',['Ir|h+8 perf+5 c:trips|Apresentei e fiz contatos valiosos.','Mandar um vídeo|perf+1|Ninguém prestou muita atenção.'],{v:[0,0]}],
]);
pack({k:'Tecnologia',when:jobIn('prog','tti','engr')},[
 ['Sistema fora do ar','O sistema principal caiu às 3 da manhã. O celular não para de tocar.',['Levantar e resolver|?sm perf+10|Resolvi em uma hora. Herói da empresa.|perf-4|Levei 6 horas e quebrei mais coisa.','Fingir que não ouvi|perf-10|Ouvi muito no dia seguinte.']],
 ['Código de outro','Herdei um código antigo, sem documentação, escrito por alguém que sumiu.',['Reescrever tudo|perf+6 h-4|Ficou lindo. Levou três meses.','Remendar e rezar|perf+1|Funciona. Ninguém sabe como.']],
 ['Proposta de startup','Um amigo quer que eu largue tudo e seja sócio da startup dele.',['Topar|?35 $v2 h+10|A startup foi comprada! Ganhei {v2}.|fire h-8|A startup fechou em um ano e eu fiquei sem emprego.','Recusar|perf+2|Estabilidade em primeiro lugar.'],{v:[20000,200000]}],
 ['Hackathon','A empresa organizou uma maratona de programação de 48 horas.',['Participar|?sm perf+8 $2000|Meu time ganhou! $2.000 de prêmio.|hl-3|Não ganhamos, mas o café era bom.','Não ir|perf-1|Fim de semana é sagrado.']],
 ['Inteligência artificial','A empresa quer substituir parte da equipe por inteligência artificial.',['Aprender a usar a ferramenta|sm+3 perf+6|Virei a pessoa que ensina os outros.','Reclamar|perf-4|Reclamar não adiantou.']],
]);
pack({k:'Loja',when:jobIn('caixa','repo','vend','lanch','garc','fren','sorv','emp','baba')},[
 ['Cliente grosseiro','Um cliente começou a gritar comigo por causa de {coisa}.',['Manter a calma|perf+4 h-2|Ele foi embora resmungando.','Responder à altura|?40 h+4|Ele se calou. A fila aplaudiu.|perf-8|O gerente me deu uma advertência.'],{when:()=>true}],
 ['Black Friday','Hoje é Black Friday e a loja está um caos.',['Trabalhar sem parar|perf+6 hl-2|Vendi como nunca.','Me esconder no estoque|perf-5|Me acharam na terceira hora.']],
 ['Dinheiro faltando','Faltou {v} no caixa no fim do dia.',['Repor do meu bolso|$-v|Paguei do meu bolso para evitar problema.','Avisar o gerente|?60 perf+2|Acharam o erro no sistema.|perf-6|Desconfiaram de mim.'],{v:[20,300]}],
 ['Gorjeta generosa','Um cliente deixou uma gorjeta de {v}.',['Dividir com a equipe|k+3|Todo mundo ficou feliz.','Guardar tudo|$v|Ninguém precisa saber.'],{v:[50,500]}],
 ['Funcionário do mês','O gerente está escolhendo o funcionário do mês.',['Puxar o saco|?50 perf+5|Minha foto está na parede!|h-2|Escolheram outra pessoa.','Só fazer meu trabalho|perf+2|Não fui escolhid{o}, mas tudo bem.']],
]);
pack({k:'Obra',when:jobIn('obra','fabr','elet','mecan','agri','pesc','limp','port')},[
 ['Acidente de trabalho','Um colega se machucou porque faltava equipamento de segurança.',['Exigir equipamento ao chefe|k+4 perf-2|O chefe comprou os equipamentos, de cara feia.','Ficar quiet{o}|k-2|Semana que vem pode ser eu.']],
 ['Hora extra','O chefe ofereceu hora extra no fim de semana pagando {v}.',['Aceitar|$v hl-2 perf+3|Mais {v} no bolso.','Recusar|h+3|Fim de semana com a família.'],{v:[200,1200]}],
 ['Calor insuportável','Fez 40 graus e trabalhamos no sol o dia todo.',['Continuar trabalhando|hl-4 perf+3|Terminei o serviço, mas quase desmaiei.','Parar à sombra|perf-2|O encarregado reclamou.']],
 ['Ferramenta sumiu','Sumiu uma ferramenta cara e estão desconfiando de mim.',['Provar inocência|?60 perf+2|A ferramenta estava no caminhão.|perf-6|Descontaram do meu salário.','Ajudar a procurar|perf+1|Encontramos debaixo da lona.']],
 ['Safra ou pescaria recorde','O ano foi muito bom de trabalho.',['Pedir aumento|?50 raise+10|Consegui 10% a mais.|perf-2|O patrão disse que o ano que vem pode ser ruim.','Guardar o bônus|$v|Recebi um bônus de {v}.'],{v:[500,4000]}],
]);
pack({k:'Estrada',when:jobIn('entr','app','cami','cart')},[
 ['Passageiro estranho','{n}, um passageiro, entrou no carro com uma mala que faz barulho.',['Fazer a corrida|?80 $150|Era só um gato. Gorjeta de $150.|h-6|Era um papagaio que xingou a viagem toda.','Cancelar a corrida|perf-2|Melhor não arriscar.'],{when:jobIn('app')}],
 ['Pneu furado','O pneu furou no meio da entrega mais importante do dia.',['Trocar sozinh{o}|?hl perf+3|Troquei em 10 minutos.|hl-3 perf-3|Machuquei a mão e atrasei tudo.','Chamar o guincho|$-200 perf-2|Paguei $200 e atrasei.']],
 ['Assalto na estrada','Fui abordad{o} por ladrões numa estrada deserta.',['Entregar tudo|h-8 $-500|Levaram a carga e meu celular.','Acelerar|?45 h+4|Escapei!|hl-15|Bateram no meu veículo.']],
 ['Avaliação de cinco estrelas','Um cliente me deu nota máxima e um elogio enorme.',['Ficar feliz|h+4 perf+3|O dia ficou melhor.','Pedir aumento na hora|?35 raise+5 h+4|Colou! Ganhei 5% a mais.|perf-3|Meu chefe achou que eu estava me achando.','Postar o elogio em todas as redes|follow+30 h+2|Meus amigos me chamaram de exibid{o}.']],
]);
pack({k:'Plantão',when:jobIn('seg','poli','bomb')},[
 ['Chamado urgente','Chegou um chamado de {ocorrencia}.',['Ir na frente|?hl perf+10 k+3|Resolvi a situação. Ganhei uma medalha.|hl-15|Fui ferid{o} na ocorrência.','Esperar reforço|perf-2|O reforço chegou a tempo.'],{}],
 ['Propina','Um motorista parado na blitz ofereceu {v} para eu "esquecer" a multa.',['Recusar e multar|k+5 perf+4|Segui a lei.','Aceitar|$v k-10 ?70|Ninguém viu.|arrest:corrupção_passiva:1:5|Ele era da corregedoria.'],{when:jobIn('poli'),v:[200,3000]}],
 ['Gatinho na árvore','Uma senhora ligou desesperada: o gato dela subiu no poste.',['Subir para resgatar|h+5 k+3 f+1|Salvei o gato. Saí no jornal do bairro.','Chamar os bombeiros do bairro vizinho|perf-3|O gato desceu sozinho enquanto eu ligava.','Fingir que não vi|k-3 perf-2|Uma senhora me filmou e postou: "bombeiro que ignora gatinho".'],{when:jobIn('bomb')}],
 ['Turno noturno','Me colocaram no turno da madrugada por seis meses.',['Aceitar|perf+4 hl-3|Virei uma criatura da noite.','Reclamar|perf-3|Fiquei assim mesmo.']],
]);
pack({k:'Escritório',when:jobIn('aux','tele','recep','cont','fina','mkt','exec','tti')},[
 ['Reunião que podia ser e-mail','Mais uma reunião de duas horas sem decidir nada.',['Prestar atenção|perf+2 h-2|Anotei tudo. Não serviu de nada.','Responder e-mails escondid{o}|perf+1|Produtividade secreta.','Dormir de olho aberto|?50|Ninguém percebeu.|perf-5|Ronquei.']],
 ['Planilha errada','Descobri um erro de {v} numa planilha que eu enviei para a diretoria.',['Assumir o erro|k+4 perf-2|Corrigi e me elogiaram pela honestidade.','Corrigir em silêncio|?60|Ninguém notou.|perf-8|Notaram, e foi pior.'],{v:[1000,100000]}],
 ['Amigo secreto','Tirei {n} no amigo secreto da firma, a pessoa mais chata do andar.',['Dar um presente bom|$-100 k+2|{n} ficou surpres{on}.','Dar um presente irônico|h+3 perf-1|Metade riu. {n} não.']],
 ['Meta do trimestre','A meta do trimestre parece impossível.',['Virar noites|?perf perf+10 raise+5|Bati a meta e ganhei aumento!|hl-4 perf-3|Não bati e ainda adoeci.','Pedir prazo|perf-2|Me deram mais uma semana.']],
 ['Demissão em massa','Os rumores de corte estão por todo lado.',['Mostrar serviço|perf+6|Fiquei. Por enquanto.','Atualizar o currículo|h-2|Melhor prevenir.']],
]);
pack({k:'Salão',when:jobIn('cabe','este','esti','pers','coz','chef')},[
 ['Cliente exigente','Uma cliente pediu o visual de uma celebridade, com foto e tudo.',['Fazer o melhor possível|?tal.art perf+6 $v|Ficou idêntico! Ela me deu {v} de gorjeta.|perf-5|Ficou parecido com outra celebridade.','Fazer do meu jeito|?40 tal.art+2 perf+4|Ela amou mais do que o pedido!|perf-6 h-3|Ela fez escândalo no salão.','Recusar o serviço|perf-4|Ela foi embora reclamando no Google.'],{v:[50,400]}],
 ['Influenciador','Um influenciador quer meu serviço de graça em troca de divulgação.',['Aceitar|follow+800 perf+3|A divulgação trouxe muitos clientes novos.','Cobrar normal|$v|Ele pagou, resmungando.'],{v:[200,1500]}],
 ['Programa de TV','Um programa de culinária ou beleza me chamou para uma participação.',['Ir|?60 f+4 perf+6|Arrasei na TV.|f+1 h-4|Travei na frente da câmera.','Recusar|h+0|Prefiro meu cantinho.']],
 ['Concorrente abriu do lado','Abriu um concorrente bem do lado, cobrando metade do preço.',['Melhorar o serviço|perf+5 h-2|Meus clientes ficaram comigo.','Baixar os preços|perf+2 raise-5|Ganhei clientes, perdi dinheiro.']],
]);
pack({k:'Redação',when:jobIn('jorn','apres')},[
 ['Furo de reportagem','Recebi uma denúncia anônima sobre um político poderoso.',['Investigar e publicar|?sm perf+12 f+6|A matéria derrubou o político!|perf-6 h-8|Fui processad{o} e recebi ameaças.','Deixar para lá|perf-2|A concorrência publicou primeiro.']],
 ['Ao vivo','O teleprompter quebrou no meio do jornal ao vivo.',['Improvisar|?tal.acting perf+8 f+3|Improvisei tão bem que virei meme positivo.|f+3 h-6|Gaguejei por dois minutos inteiros.','Ler o roteiro do celular|perf-4 f+1|Todo mundo percebeu que eu estava lendo.','Fingir que caiu a conexão|?50 perf-2|Colou.|perf-8 f+2|O vídeo do "erro" virou piada nacional.']],
 ['Notícia falsa','Meu chefe quer publicar uma matéria que eu sei que é falsa.',['Me recusar|k+6 perf-4|Fui transferid{o} para a editoria de horóscopo.','Publicar|k-6 perf+4|A matéria deu audiência. Minha consciência, não.']],
]);
pack({k:'Céu',when:jobIn('pilo','aero')},[
 ['Turbulência severa','Turbulência fortíssima sobre o oceano.',['Manter a calma e tranquilizar todos|perf+8 k+3|Pousamos em segurança. Fomos aplaudidos.','Rezar alto no microfone|perf-6 f+2|Os passageiros ficaram em pânico. Virei meme.','Me trancar na cabine e torcer|perf-4 h-6|Passou, mas a tripulação não me olha mais igual.']],
 ['Passageiro bêbado','Um passageiro bêbado está perturbando o voo todo.',['Contornar com jeito|?k perf+4|Ele dormiu em dez minutos.|hl-3|Ele me deu um empurrão.','Pedir para algemá-lo|perf+2|Os outros passageiros agradeceram.']],
 ['Escala em {lugar}','Tenho 24 horas de folga em {lugar} depois do voo.',['Passear pela cidade|h+8 c:trips|Conheci {lugar} a jato.','Dormir no hotel|hl+3|Precisava do sono.']],
]);
pack({k:'Embaixada',when:jobIn('dipl')},[
 ['Crise diplomática','Um incidente entre os dois países está nos jornais.',['Negociar nos bastidores|?sm perf+12|Evitei uma crise maior.|perf-6|A negociação vazou.','Dar uma declaração dura à imprensa|?35 f+5 perf+6|Fui visto como firme.|perf-12 f+3|Piorei tudo. O ministro ligou furioso.','Tirar férias até passar|perf-10|Voltei e a crise tinha meu nome nela.'],{}],
 ['Jantar de gala','Fui convidad{o} para um jantar com o presidente de outro país.',['Ir e conversar com todo mundo|perf+6 h+4|Fiz contatos valiosos.','Ficar no canto|perf-1|Comi muito bem.']],
]);
pack({k:'Trabalho',min:14,max:18,when:m=>m.job&&!m.job.spc&&JOBS.find(x=>x.id===m.job.id).pt},[
 ['Primeiro salário','Recebi meu primeiro pagamento: {v}.',['Gastar tudo com besteira|h+6|Comprei {coisa}. Valeu cada centavo.','Guardar|sm+1|Abri minha primeira poupança.','Dar uma parte para os meus pais|k+4|Minha mãe chorou.'],{v:[200,800]}],
 ['Escola e trabalho','Está difícil conciliar trabalho e estudos.',['Largar o trabalho|fire h+3|Larguei. A escola agradece.','Continuar|hl-2 grade-4|Estou cansad{o}, mas firme.']],
]);

// ---------- carreiras especiais ----------
pack({k:'Cinema',when:spcIs('ator')},[
 ['Teste para novela','Fui chamad{o} para um teste numa novela das nove.',['Ir ao teste|?tal.acting perf+10 f+6 $v|Passei! Faço um personagem fixo.|h-4|Não passei.','Faltar e ir à praia|h+5 perf-4|O papel foi para outra pessoa.','Ir de ressaca|?20 perf+6 f+3|Por milagre, passei!|perf-5 h-3|Esqueci o texto inteiro.'],{v:[20000,200000]}],
 ['Cena de ação','O diretor quer que eu faça uma cena perigosa sem dublê.',['Fazer|?hl f+3 perf+6|A cena ficou épica.|hl-15|Quebrei a clavícula.','Exigir dublê|perf-2|O diretor ficou irritado.']],
 ['Crítica arrasadora','Um crítico famoso detonou minha atuação.',['Responder nas redes|f+2 perf-3|Virou briga pública.','Usar como motivação|tal.acting+4|Vou provar que ele está errado.']],
 ['Fãs na porta','Uma multidão de fãs está na porta do meu hotel.',['Tirar fotos com todos|f+3 h+4|Duas horas de selfies.','Sair pelos fundos|h+1|Escapei.']],
 ['Comercial','Uma marca quer que eu faça um comercial de {prod} por {v}.',['Aceitar|$v f+1|Rendeu {v}.','Recusar|k+1|Não combina comigo.'],{v:[10000,300000]}],
]);
pack({k:'Música',when:spcIs('musico')},[
 ['Show em bar vazio','Toquei para três pessoas e um garçom.',['Tocar como se fosse um estádio|tal.musical+3 h+3|Os três viraram fãs.','Encurtar o show|h-3|Fui embora mais cedo.']],
 ['Música viralizou','Uma música minha virou trilha de vídeo curto na internet.',['Aproveitar e lançar um clipe|?55 f+8 perf+10 follow+50000|Explodiu!|f+2|O clipe não pegou como a música.','Vender os direitos da música|$v2 f+2|Ganhei {v2}, mas a música não é mais minha.','Ignorar e seguir no meu tempo|f+1|A onda passou.'],{}],
 ['Parceria','Um artista famoso quer gravar comigo.',['Aceitar|f+6 perf+8|A parceria foi um sucesso.','Recusar|k+1|Quero fazer meu próprio caminho.']],
 ['Turnê','A gravadora propôs uma turnê de 40 shows.',['Ir|$v2 f+6 hl-5|A turnê esgotou! Voltei exaust{o}.','Fazer só 10 shows|$v f+2|Equilíbrio.'],{v:[20000,200000]}],
 ['Contrato abusivo','A gravadora quer um contrato de 10 anos com 90% para ela.',['Assinar|f+5 perf+5|Agora sou de uma gravadora grande.','Continuar independente|h+3|Liberdade não tem preço.']],
]);
pack({k:'Esporte',when:spcIs('atleta')},[
 ['Final do campeonato','Hoje é a final do campeonato.',['Dar tudo de mim|?tal.athletic perf+12 f+6|CAMPEÃO!|h-8|Perdemos nos acréscimos.','Cavar um pênalti|?45 perf+8 f+4 k-3|Juiz deu! Fomos campeões.|perf-6 k-4 f+2|Levei amarelo por simulação e viramos vilões.','Poupar energia e jogar seguro|perf-3|Perdemos e a torcida me culpou.']],
 ['Doping','Um preparador ofereceu uma substância "indetectável".',['Recusar|k+5|Prefiro perder limpo.','Usar|?60 perf+15|Joguei como nunca.|f-10 fire|Fui pego no antidoping e suspens{o}.']],
 ['Proposta do exterior','Um clube de {lugar} quer me contratar.',['Ir|$v2 f+6 c:emig|Agora jogo no exterior.','Ficar|k+2|Fiquei pela torcida.'],{v:[100000,2000000]}],
 ['Briga com o técnico','O técnico me deixou no banco sem explicação.',['Treinar em dobro|perf+8|Voltei a ser titular.','Reclamar na imprensa|f+3 perf-8|Fui afastad{o} do grupo.']],
]);
pack({k:'Moda',when:spcIs('modelo')},[
 ['Semana de moda','Fui chamad{o} para desfilar na semana de moda.',['Desfilar|?lk perf+10 f+5|Fui destaque nas revistas.|h-5|Tropecei na passarela.','Fazer a pose mais exagerada possível|?40 f+8 perf+6|Virou a foto da semana!|f+3 h-4|Os críticos me chamaram de caricata.','Faltar por preguiça|perf-8|A agência me deu uma bronca.']],
 ['Dieta extrema','A agência quer que eu emagreça muito em um mês.',['Recusar|k+3 perf-3|Minha saúde vem primeiro.','Fazer a dieta|hl-10 perf+6|Consegui, mas desmaiei duas vezes.']],
 ['Capa de revista','Uma revista grande quer me colocar na capa.',['Aceitar|f+8 perf+8 $v|Minha cara está em todas as bancas.','Exigir o dobro do cachê|?40 $v2 f+6|Pagaram!|f-2|Chamaram outra pessoa para a capa.','Recusar|f-1|Prefiro manter a discrição.'],{v:[20000,150000]}],
]);
pack({k:'Forças Armadas',when:spcIs('militar')},[
 ['Treinamento de selva','Duas semanas de treinamento na selva.',['Encarar|?hl perf+8 tal.athletic+3|Fui o melhor do pelotão.|hl-10|Fui picad{o} por uma cobra.','Fingir lesão para escapar|?40 hl+2|Me mandaram para a enfermaria. Escapei.|perf-10 k-3|O sargento descobriu. Fiquei uma semana limpando latrina.','Desistir no meio|perf-8 h-4|Meu nome ficou marcado no quartel.']],
 ['Ordem questionável','Um superior deu uma ordem que me parece errada.',['Obedecer|perf+3 k-3|Cumpri. Não me sinto bem.','Questionar|?k k+5|Ele reconsiderou.|perf-8|Fui punid{o} por insubordinação.']],
 ['Desfile','Fui escalad{o} para o desfile de 7 de setembro.',['Desfilar com orgulho|h+5 perf+3|Minha família foi assistir.','Fazer careta para a câmera|f+2 perf-4|Saí no jornal. Meu comandante não gostou.','Dar uma desculpa e não ir|perf-3|Ninguém sentiu falta, ou fingiram.']],
 ['Missão humanitária','Minha tropa vai ajudar vítimas de uma enchente.',['Ir|k+8 perf+6 h+4|Salvei famílias inteiras.','Recusar e ficar no quartel|perf-4|Fiquei de plantão vendo o noticiário.','Ir e postar tudo nas redes|k+2 f+3 perf-2|Meus superiores não gostaram da exposição.']],
]);
pack({k:'Crime',when:spcIs('crime')},[
 ['Carregamento','Preciso levar um carregamento suspeito até outra cidade.',['Ir|?60 perf+8 $v|Entregue.|arrest:tráfico:4:15|Fui parad{o} numa blitz.','Mandar outra pessoa|perf-3|O chefe não gostou.'],{v:[5000,40000]}],
 ['Guerra entre quadrilhas','Uma quadrilha rival está tomando nosso território.',['Partir para o confronto|?fight perf+10|Retomamos o território.|hl-30|Levei um tiro.','Negociar uma trégua|?sm perf+5|Trégua acertada.|perf-5|Me acharam frac{o}.']],
 ['Vida dupla','Minha família está desconfiando do meu "trabalho".',['Contar a verdade|k+3 h-5|Minha mãe não fala comigo.','Inventar uma desculpa|k-2|Disse que sou consultor.']],
 ['Sair do crime','Pensei em largar essa vida.',['Largar tudo|fire k+10 h+5|Saí. Agora é recomeçar.','Continuar|k-2|Não tem volta.']],
]);
pack({k:'Comédia',when:spcIs('comedia')},[
 ['Piada polêmica','Uma piada minha está causando revolta na internet.',['Pedir desculpas|f-1 k+2|A poeira baixou.','Fazer outra piada sobre a polêmica|?tal.comedy f+6|O público adorou!|f-6|Cancelamento total.']],
 ['Especial de TV','Uma plataforma quer gravar um especial meu.',['Aceitar|$v f+8 perf+8|O especial bombou.','Pedir aprovação do roteiro inteiro|?50 $v f+6|Ficou do meu jeito.|f-2|A emissora desistiu.','Recusar|f-2|Achei que não combinava comigo.'],{v:[30000,500000]}],
 ['Plateia fria','Ninguém riu das primeiras cinco piadas.',['Improvisar com a plateia|?tal.comedy perf+6|Virou o melhor show do mês.|h-6|Saí do palco ao som de grilos.','Xingar a plateia|?30 f+5 perf+4|Viralizou como o show mais sincero do ano.|perf-8 f+2 h-4|Fui vaiad{o} até sair.','Encerrar mais cedo|perf-5|Saí pela porta dos fundos.']],
]);
pack({k:'Literatura',when:spcIs('escritor')},[
 ['Bloqueio criativo','Faz meses que não consigo escrever uma linha.',['Viajar para buscar inspiração|$-v h+5 tal.writing+3|Escrevi um capítulo inteiro no avião.','Forçar todo dia|tal.writing+2 h-3|Saiu alguma coisa.'],{v:[2000,10000]}],
 ['Adaptação para o cinema','Um estúdio quer transformar meu livro em filme.',['Vender os direitos|$v2 f+8|Ganhei {v2} e vou ver meu livro na telona.','Recusar|k+1|Vão estragar minha história.'],{v:[20000,300000]}],
 ['Acusação de plágio','Um autor desconhecido diz que copiei a obra dele.',['Provar a originalidade|?60 f+2|Provei com meus rascunhos.|f-8 $-v|Fiz um acordo caro.','Atacar o autor nas redes|?30 f+4|O público ficou do meu lado.|f-10 k-5|Pegou muito mal. Perdi leitores.','Ignorar|?50|O caso morreu sozinho.|f-6|O caso cresceu sem minha versão.'],{v:[10000,80000]}],
]);
pack({k:'Arte',when:spcIs('artista')},[
 ['Obra vendida','Um colecionador quer comprar minha obra mais pessoal por {v}.',['Vender|$v f+2|Vendi. Doeu, mas pagou as contas.','Não vender|h+3|Algumas coisas não têm preço.'],{v:[3000,200000]}],
 ['Mural na cidade','A prefeitura quer um mural meu na praça central.',['Aceitar|f+5 tal.art+3 $v|O mural virou ponto turístico.','Pintar algo polêmico|?40 f+8 tal.art+3|Virou debate nacional!|f+2 $-v|A prefeitura apagou e me multou em {v}.','Recusar|tal.art+1|Prefiro trabalhar no ateliê.'],{v:[5000,40000]}],
]);
pack({k:'Streaming',when:spcIs('streamer')},[
 ['Recorde de audiência','Uma live minha bateu recorde de espectadores.',['Comemorar com sorteio|follow+20000 f+3 $-500|O chat foi à loucura.','Pedir doação aos seguidores|$v follow+5000|Choveu Pix: {v}.','Falar mal de outro streamer ao vivo|?45 follow+30000 f+4|Treta boa dá audiência.|follow-8000 f-3|Fui cancelad{o} por uma semana.']],
 ['Patrocínio de aposta','Uma casa de apostas quer me patrocinar por {v}.',['Aceitar|$v k-4|Recebi {v}. Alguns fãs reclamaram.','Recusar|k+3 follow+2000|Meus fãs respeitaram.'],{v:[10000,200000]}],
 ['Esgotamento','Faço lives há 300 dias seguidos.',['Tirar férias|h+8 follow-5000|Perdi seguidores, mas recuperei a saúde.','Continuar|hl-6|Meus olhos ardem.']],
]);
pack({k:'Música',when:spcIs('dj')},[
 ['Festival gigante','Fui chamad{o} para tocar no palco principal de um festival.',['Tocar|?tal.musical f+8 perf+10|Cem mil pessoas pulando!|f+2 h-6|O som falhou no meio do set.','Tocar só as minhas preferidas, ignorando o público|?35 f+6 tal.musical+3|Viraram fãs do meu estilo.|f-3 perf-5|Metade do público foi embora.','Cancelar em cima da hora|f-6 perf-8|O festival me processou.']],
 ['Remix pirata','Alguém está vendendo meu remix sem minha autorização.',['Processar|$-2000 ?60 $v|Ganhei {v} de indenização.|h-3|Perdi tempo e dinheiro.','Deixar pra lá|f+1|Pelo menos estão ouvindo.'],{v:[5000,50000]}],
]);
pack({k:'Comércio',when:spcIs('camelo')},[
 ['Rapa','A fiscalização passou recolhendo mercadoria.',['Correr com a mercadoria|?hl $0|Escapei com tudo!|$-v|Levaram {v} em mercadoria.','Negociar com o fiscal|?40|Ele me deixou em paz.|$-v|Levaram tudo.'],{v:[300,3000]}],
 ['Produto da moda','Um produto virou moda e todo mundo quer comprar.',['Comprar muito estoque|$-v ?60 $v2 perf+6|Vendi tudo em uma semana! Lucro de {v2}.|h-5|A moda passou. Fiquei com o encalhe.','Comprar falsificado e vender como original|$-v ?55 $v2 k-8|Lucrei {v2}, mas a consciência pesa.|k-6 arrest:venda_de_produto_falsificado:0:2|A fiscalização apareceu.','Não arriscar|h-1|A loja do lado lucrou e eu fiquei olhando.'],{v:[1000,8000]}],
]);
