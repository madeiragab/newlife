// ===== Histórias em cadeia: vida adulta =====
chain('mudar_carreira',{k:'Carreira',min:28,max:55,when:m=>!!m.job&&!m.job.hero,gap:[1,1]},{
 a:['Insatisfação','Acordo todo dia sem vontade de ir trabalhar. Sinto que escolhi a profissão errada.',['Fazer um teste vocacional|$-300 sm+2 >b|O resultado me surpreendeu.','Conversar com quem já mudou de carreira|>c|Um amigo largou o banco para ser marceneiro.','Aguentar até a aposentadoria|h-6|Faltam só trinta anos.']],
 b:['A descoberta','O teste disse que eu tenho perfil para trabalhar com pessoas e criatividade.',['Fazer um curso na área nova|$-3000 sm+4 >d|Aulas à noite depois do trabalho.','Rir do teste|>c|Teste de internet.']],
 c:['A conversa','Meu amigo disse que o mais difícil foi o primeiro ano ganhando menos.',['Planejar uma reserva antes de mudar|k+3 >d|Seis meses de reserva no banco.','Mudar de qualquer jeito|h+8 >e|A vida é curta.']],
 d:['O primeiro trabalho na área nova','Consegui um trabalho na área nova, ganhando menos.',['Aceitar|fire h+12 >f|Pedi demissão do emprego antigo. Frio na barriga.','Recusar e ficar onde estou|h-4|Ainda não tive coragem.']],
 e:['O salto no escuro','Pedi demissão sem plano.',['Fazer bicos enquanto procuro|fire $+1500 >f|Aperto, mas felicidade.','Me desesperar|fire h-8 >f|O dinheiro acabou rápido.']],
 f:['Um ano depois','Faz um ano que mudei de carreira.',['Valeu a pena|h+15 sm+3|Ganho menos, mas acordo feliz.','Me arrependi|h-6|Às vezes a grama do vizinho é só grama.']],
});
chain('vizinho_misterioso',{k:'Vizinhança',min:16,max:80,npc:1,age:[10,40],gap:[1,1]},{
 a:['O vizinho que ninguém vê','{p}, que mora no apartamento da frente, nunca sai de dia. Só se ouvem barulhos à noite.',['Investigar|>b|Fiquei de olho pelo olho mágico.','Cuidar da minha vida|>e@2|Cada um com sua esquisitice.']],
 b:['Os barulhos','Os barulhos parecem de serra elétrica e martelo.',['Bater na porta|>c|{p} abriu cheio de serragem.','Chamar o síndico|>d|O síndico também ficou curioso.']],
 c:['O segredo','{p} constrói violinos à mão. Trabalha à noite porque é quando a cidade fica em silêncio.',['Pedir para ver|vira:amigo h+8 >f|O apartamento é uma oficina de violinos.','Pedir silêncio|bond-5|{p} passou a usar ferramentas mais silenciosas.']],
 d:['A reunião','O síndico chamou {p} para uma conversa.',['Ir junto para ajudar|k+3 >c|Descobrimos o mistério juntos.','Deixar o síndico resolver|>e|Fiquei sem saber.']],
 e:['A notícia','Vi {p} no jornal: um violino feito por {ele} foi tocado num concerto famoso.',['Bater na porta para parabenizar|vira:amigo h+6 >f|{p} ficou sem jeito e me ofereceu chá.','Ficar impressionad{o} de longe|h+3|Morava do lado de um gênio.']],
 f:['O presente','{p} me deu um violino de presente.',['Aprender a tocar|tal.musical+6 h+10|Os vizinhos agora reclamam de mim.','Pendurar na parede|h+6|A peça mais bonita da casa.']],
});
chain('afilhado',{k:'Família',min:20,max:65,npc:1,age:[-35,-25],gap:[2,3]},{
 a:['O convite','Amigos me convidaram para ser {padrinho} do bebê deles, {p}.',['Aceitar|h+10 vira:amigo >b|Segurei {p} no batizado com o coração na mão.','Recusar com carinho|h-2|Não me sinto preparad{o}.']],
 b:['O aniversário','{p} faz aniversário e só quer um presente: passar o dia comigo.',['Levar ao zoológico|$-200 bond+10 h+8 >c|{p} ficou meia hora olhando a girafa.','Comprar um presente caro|$-800 bond+4 >c|{p} brincou mais com a caixa.']],
 c:['A conversa difícil','Os pais de {p} estão se separando. {p} veio desabafar comigo.',['Ouvir com paciência|bond+12 k+4 >d|"Você sempre me entende."','Dizer que vai ficar tudo bem|bond+6 >d|E torcer para estar certo.']],
 d:['A formatura','{p} se formou e me citou no discurso.',['Chorar na plateia|h+15 bond+10 >e|Ninguém estava preparado para aquilo.','Fazer uma festa surpresa|$-1500 h+12 bond+10 >e|Família, amigos e um bolo enorme.']],
 e:['O pedido','{p} pediu para eu ser {padrinho} do primeiro bebê d{ele}.',['Aceitar|h+15 bond+10|O ciclo continua.','Chorar e aceitar|h+18|Não consegui nem responder direito.']],
});
chain('emprego_exterior',{k:'Carreira',min:24,max:50,when:m=>!!m.job&&!m.job.hero,gap:[1,1]},{
 a:['A proposta internacional','A empresa quer me transferir para a filial em {lugar} por dois anos.',['Aceitar|raise+30 h+8 >b|Fiz as malas com a vida inteira dentro.','Recusar|h-2|Minha vida está aqui.','Negociar levar a família|?perf raise+30 >b|A empresa aceitou pagar tudo.|>a@1|Não aceitaram. Vou pensar mais.']],
 b:['Adaptação','Os primeiros meses são de solidão e frio.',['Fazer amigos locais|h+6 sm+3 >c|Uma colega me apresentou a cidade.','Ficar só com outros estrangeiros|h+4 >c|Bolha de expatriados.']],
 c:['A saudade','Perdi o aniversário da minha mãe e o casamento de um amigo.',['Fazer chamadas de vídeo toda semana|h+3 >d|Tela não abraça, mas ajuda.','Voltar numa folga|$-5000 h+10 >d|Abraço de verdade.']],
 d:['O fim do contrato','Os dois anos acabaram. A empresa quer que eu fique de vez.',['Ficar para sempre|raise+15 h+6|Agora aqui também é casa.','Voltar|h+12 sm+3|Voltei com outra cabeça.']],
});
chain('doacao_medula',{k:'Bondade',min:18,max:55,gap:[1,1]},{
 a:['O cadastro','Uma campanha na empresa pede cadastro de doadores de medula.',['Me cadastrar|k+5 >b@2-6|Uma picadinha no dedo e meu nome no cadastro.','Achar que nunca vão me chamar|h+0|Deixei para lá.']],
 b:['A ligação','Anos depois, o telefone tocou: sou compatível com alguém que precisa de transplante.',['Aceitar doar|k+15 hl-5 >c|O procedimento foi mais tranquilo do que eu imaginava.','Ficar com medo e recusar|k-8 h-6|Me arrependo até hoje.']],
 c:['O sigilo','Não posso saber quem recebeu. Só que é uma criança.',['Torcer em silêncio|h+10 >d@1-2|Rezo por quem eu nem conheço.','Escrever uma carta anônima|h+8 >d@1-2|"Seja forte. Alguém aqui torce por você."']],
 d:['A carta','Depois do prazo de sigilo, recebi uma carta: a criança está curada e quer me conhecer.',['Ir ao encontro|h+25 k+5 f+2|Ela correu e me abraçou. Ninguém na sala segurou o choro.','Responder por carta|h+18|Guardei o desenho que ela mandou na carteira.']],
});
chain('terapia',{k:'Mente',min:16,max:85,npc:1,age:[5,25],gap:[1,1]},{
 a:['Começar terapia','Decidi começar terapia. Marquei a primeira sessão com {p}.',['Ir de coração aberto|$-400 h+4 >b|Falei mais do que pretendia.','Ir desconfiad{o}|$-400 >b|Respondi tudo com "normal".']],
 b:['As primeiras sessões','A terapia mexeu em coisas que eu nem sabia que estavam ali.',['Continuar|$-1600 h+6 >c|Algumas sessões doem. Outras aliviam.','Desistir|h-2|Não era a hora.']],
 c:['O padrão','{p} me mostrou um padrão que eu repito em todos os relacionamentos.',['Trabalhar nisso|$-1600 h+8 k+3 >d|Comecei a perceber quando faço de novo.','Negar|h-3 >d|Saí da sessão irritad{o}.']],
 d:['A alta','Depois de dois anos, {p} disse que estou bem para seguir sozinh{o}.',['Agradecer|h+12 sm+3|Saí mais leve do que entrei.','Continuar mesmo assim|$-1600 h+6|Terapia virou um hábito bom.']],
});
chain('casamento_simples',{k:'Amor',min:22,max:60,who:'partnerEngaged',when:m=>{ const p=pickPartner(p=>p.rel==='noivo'); return !!p&&p.rel==='noivo'; },gap:[1,1]},{
 a:['A data','Eu e {p} estamos noivos há tempo demais. Precisamos marcar a data.',['Marcar para o ano que vem|bond+6 >b|Data no calendário, frio na barriga.','Fugir e casar escondido|casar h+15 bond+10|Casamos só nós dois numa praia ao pôr do sol.']],
 b:['O orçamento','O orçamento da festa ficou três vezes maior do que o planejado.',['Cortar convidados|bond+3 >c|A lista caiu de 300 para 80.','Fazer um empréstimo|$-20000 >c|Vamos pagar por anos.','Simplificar tudo|bond+6 >c|Churrasco no quintal com quem importa.']],
 c:['O casamento','O grande dia chegou.',['Dizer sim|casar h+20 bond+15|Casamos! Dançamos até o sol nascer.','Ter um ataque de riso no altar|casar h+22 bond+12|O padre riu junto.']],
});
