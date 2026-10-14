// ===== Histórias em cadeia: mais encruzilhadas =====
chain('ponte_bairro',{k:'Bairro',min:16,max:80,gap:[1,1]},{
 a:['A ponte quebrada','A ponte que liga o bairro ao centro desabou. Agora a volta leva uma hora a mais.',['Reclamar com a prefeitura|>b|Mandei e-mail, liguei, fui pessoalmente.','Juntar os vizinhos para pressionar|k+4 >c|Grupo de mensagens criado.','Me acostumar|h-4|Mais uma hora de ônibus por dia.']],
 b:['A resposta','A prefeitura prometeu a obra para "o ano que vem".',['Esperar|>d@1|Esperamos.','Procurar a imprensa|?40 f+3 >c|A reportagem saiu no jornal da noite.|>d@1|Ninguém se interessou.']],
 c:['A pressão','Com a reportagem e o abaixo-assinado, a prefeitura marcou a data da obra.',['Acompanhar a obra|k+3 >d|Fiscal voluntário do bairro.','Comemorar e esquecer|h+4 >d|Missão cumprida.']],
 d:['A ponte nova','A ponte nova foi inaugurada.',['Atravessar primeiro|h+10 f+1|Cortaram a fita e eu atravessei de bicicleta.','Ir à festa de inauguração|h+6|Teve banda e pipoca.']],
});
chain('presente_errado',{k:'Família',min:16,max:80,who:'partner',gap:[1,1]},{
 a:['O aniversário','Esqueci completamente o aniversário de {p}.',['Confessar e pedir desculpas|bond-4 k+3 >b|{p} ficou chatead{o2}, mas gostou da honestidade.','Inventar que estava preparando uma surpresa|>c|Agora preciso de uma surpresa.']],
 b:['A compensação','Preciso compensar o esquecimento.',['Fazer um jantar especial|$-400 bond+10 h+6|{p} me perdoou na sobremesa.','Escrever uma carta|bond+12|Palavras valem mais que presentes.']],
 c:['A surpresa às pressas','Tenho poucas horas para organizar uma surpresa.',['Chamar os amigos de {p}|?50 bond+15 h+10|A festa improvisada foi a melhor que {p} já teve.|bond-8|Ninguém pôde ir. Descobriram a mentira.','Comprar o primeiro presente que achar|$-600 ?40 bond+5|Acertei por sorte.|bond-6|Um ferro de passar roupa. Errei feio.']],
});
chain('emprego_sonho',{k:'Carreira',min:20,max:50,gap:[1,1]},{
 a:['A vaga dos sonhos','Abriu uma vaga na empresa onde sempre sonhei trabalhar.',['Me candidatar|>b|Reescrevi o currículo dez vezes.','Achar que não tenho chance|h-3|Nem tentei.']],
 b:['As etapas','O processo seletivo tem cinco etapas: provas, dinâmica e entrevistas.',['Me preparar muito|?sm >c|Passei para a final!|h-6 >e|Fui eliminad{o} na dinâmica.','Ir com naturalidade|?lk >c|Passei!|h-4 >e|Fui eliminad{o}.']],
 c:['A entrevista final','A entrevista final é com o diretor.',['Ser sincer{o} sobre meus defeitos|?k raise+20 h+15 >d|Fui contratad{o}! O diretor gostou da sinceridade.|h-8 >e|Não fui escolhid{o}.','Dizer que meu defeito é ser perfeccionista|?30 raise+15 h+12 >d|Funcionou, por incrível que pareça.|h-8 >e|Ele riu. Não foi um bom sinal.']],
 d:['O sonho realizado','Primeiro dia na empresa dos sonhos.',['Dar o meu melhor|perf+10 h+10|Valeu cada etapa.','Descobrir que não é tão bom assim|h-4|Sonhos de longe são mais bonitos.']],
 e:['Não foi desta vez','Recebi o e-mail de "seguiremos com outros candidatos".',['Pedir feedback|sm+3 >a@2|Anotei tudo para a próxima.','Desistir dessa empresa|h-3|Não era para ser.']],
});
chain('bolsa_valores',{k:'Dinheiro',min:21,max:75,v:[3000,20000],gap:[1,1]},{
 a:['Investir na bolsa','Abri uma conta numa corretora para investir em ações.',['Estudar antes de comprar|sm+4 >b|Li três livros e assisti a vinte vídeos.','Comprar a ação que todo mundo está falando|$-v >c|Comprei no topo, claro.']],
 b:['A carteira','Montei uma carteira com empresas sólidas e paciência.',['Investir todo mês|$-2000 >d|Pouquinho, todo mês.','Comprar e esquecer|$-v >d|Volto a olhar daqui a cinco anos.']],
 c:['A queda','A ação despencou 40% em uma semana.',['Vender no desespero|h-8 >e|Perdi dinheiro de verdade.','Segurar|?50 $+v2 h+10 >d|Ela se recuperou e passou do preço inicial!|h-4 >d|Continua no chão.']],
 d:['Os anos passam','Os juros compostos começaram a fazer efeito.',['Conferir a carteira|?60 $+v2 h+10|Multiplicou! Paciência dá dinheiro.|$+v h+4|Cresceu devagar, mas cresceu.']],
 e:['A lição','Aprendi que bolsa não é cassino.',['Recomeçar com calma|sm+3 >b|Agora com estratégia.','Desistir da bolsa|h+2|Poupança e paz.']],
});
chain('cirurgia_risco',{k:'Saúde',min:30,max:85,gap:[1,1]},{
 a:['O diagnóstico','O médico disse que preciso fazer uma cirurgia no joelho.',['Operar logo|$-8000 >b|Data marcada.','Pedir uma segunda opinião|$-500 >c|Outro médico, outra conversa.','Adiar|hl-4 >d|Vou levando.']],
 b:['A cirurgia','Acordei da anestesia sem saber onde estava.',['Fazer a fisioterapia direitinho|$-2000 hl+10 h+8|Voltei a andar sem dor.','Pular as sessões|hl+2|Melhorou, mas não tanto.']],
 c:['A segunda opinião','O segundo médico sugeriu fisioterapia antes de operar.',['Tentar a fisioterapia|?50 $-2000 hl+8 h+6|Não precisei operar!|>b|Não resolveu. Vou operar.','Operar mesmo assim|$-8000 >b|Melhor resolver de vez.']],
 d:['A dor','A dor piorou com o tempo.',['Operar agora|$-8000 >b|Devia ter feito antes.','Viver com a dor|hl-6 h-6|Bengala aos poucos.']],
});
chain('concurso_culinaria',{k:'Diversão',min:16,max:80,gap:[1,1]},{
 a:['O concurso de bolos','A quermesse do bairro vai ter um concurso de bolos.',['Fazer o bolo da família|?50 h+10 >b|Passei para a final!|h-3|Ficou bom, mas não passou.','Inventar uma receita nova|?40 h+10 >b|Os jurados amaram a criatividade.|h-4|Ficou estranho. Muito estranho.']],
 b:['A final','Na final, enfrento a doceira mais famosa do bairro.',['Caprichar na decoração|?50 f+2 h+15 $+500 >c|Ganhei! Troféu de bolo dourado.|h-2 >c|Perdi por um voto.','Focar no sabor|?55 f+2 h+15 $+500 >c|Venci pelo sabor.|h-2 >c|Ela venceu de novo.']],
 c:['As encomendas','Depois do concurso, os vizinhos começaram a encomendar bolos.',['Vender bolos|$+3000 h+6|Virei a pessoa do bolo do bairro.','Fazer só para a família|h+4|Bolo é amor, não negócio.']],
});
chain('gato_telhado',{k:'Bichos',min:6,max:80,gap:[1,1]},{
 a:['O gato no telhado','Um gato filhote ficou preso no telhado da vizinha, miando sem parar.',['Subir para buscar|?hl k+6 >b|Salvei o gato!|hl-8 >b|Escorreguei, mas salvei o gato.','Chamar os bombeiros|k+3 >b|Os bombeiros vieram e o gato desceu sozinho antes.']],
 b:['O gato sem dono','Ninguém sabe de quem é o gato.',['Adotar|pet h+10 >c|Ele dormiu no meu colo na primeira noite.','Levar para um abrigo|k+3|Logo ele vai achar uma casa.']],
 c:['O gato aventureiro','O gato vive fugindo para o mesmo telhado.',['Colocar uma rede de proteção|$-300 h+4|Agora ele só olha o telhado de longe.','Deixar ser livre|h+3|Ele sempre volta para o jantar.']],
});
chain('reencontro_pai',{k:'Família',min:18,max:60,npc:1,gn:'M',age:[20,35],gap:[1,1],when:m=>!people('pai').length},{
 a:['A mensagem','Recebi uma mensagem de um homem chamado {p}, dizendo que é meu pai biológico.',['Responder|>b|Minhas mãos tremiam.','Ignorar|h-4 >c@2|Não estou pront{o}.','Bloquear|h-2|Algumas portas devem ficar fechadas.']],
 b:['O encontro','Marcamos um café. Ele chegou com uma foto minha de bebê.',['Ouvir a história dele|h+4 >d|Ele contou por que foi embora. Nada justifica, mas algumas coisas explicam.','Dizer tudo o que guardei|h+2 >d|Falei por uma hora. Ele só ouviu.']],
 c:['Arrependimento','Fiquei pensando naquela mensagem por meses.',['Responder agora|>b|Ainda dava tempo.','Deixar no passado|h-3|Talvez nunca seja a hora.']],
 d:['O que fazer','Ele quer fazer parte da minha vida.',['Dar uma chance|vira:amigo h+8 k+5|Devagar, sem pressa, aprendendo a conviver.','Agradecer e seguir sem ele|h+3 k+2|Precisava ouvir. Não preciso de mais.']],
});
chain('mentira_curriculo',{k:'Dilema',min:18,max:50,gap:[1,1]},{
 a:['O currículo','Um amigo sugeriu colocar no currículo um curso que eu não terminei.',['Colocar|k-5 >b|Só um detalhe.','Ser honest{o}|k+3|Prefiro dormir tranquil{o}.']],
 b:['A contratação','Fui contratad{o}. Ninguém conferiu.',['Terminar o curso escondido|$-2000 sm+3 k+3 >c|Agora é verdade.','Torcer para ninguém conferir|>d@1|Sigo trabalhando com aquilo na cabeça.']],
 c:['Verdade atrasada','O curso está terminado. A mentira virou verdade.',['Contar para o chefe|?50 k+5 perf+3|Ele riu e disse que valorizou a honestidade.|perf-5|Ele ficou desconfiado.','Deixar quieto|h+2|Página virada.']],
 d:['A auditoria','A empresa fez uma auditoria nos diplomas.',['Confessar antes|?40 k+4 perf-6|Levei uma advertência, mas fiquei.|fire h-10|Fui demitid{o}.','Esperar|?30 h+2|Pularam o meu nome.|fire h-12 k-4|Descobriram. Demissão por justa causa.']],
});
chain('noite_hospital',{k:'Família',min:20,max:80,who:'kid',gap:[1,1]},{
 a:['A febre','{p} acordou de madrugada com febre muito alta.',['Correr para o pronto-socorro|$-300 bond+6 >b|Dirigi como nunca.','Dar remédio e esperar|?60 bond+3|A febre baixou.|>b|A febre não baixou. Fomos para o hospital.']],
 b:['A noite no hospital','Passei a noite inteira numa cadeira de plástico ao lado de {p}.',['Contar histórias para distrair|bond+12 h+4 >c|{p} dormiu segurando minha mão.','Rezar em silêncio|bond+6 >c|A madrugada mais longa da minha vida.']],
 c:['A alta','De manhã, o médico deu alta: era uma infecção, já controlada.',['Levar {p} para tomar sorvete|bond+10 h+10|O melhor sorvete da vida, depois da pior noite.','Dormir o dia inteiro|hl+3 h+6|Os dois roncando no sofá.']],
});
