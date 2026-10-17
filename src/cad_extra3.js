// ===== Histórias em cadeia: pequenas grandes decisões =====
chain('carona',{k:'Acaso',min:18,max:75,npc:1,gap:[1,1]},{
 a:['A carona','Na chuva, vi {p} no ponto de ônibus, encharcad{o2}, e ofereci carona.',['Dar a carona|k+4 >b|{p} trabalha no mesmo bairro que eu.','Seguir viagem|h+0|Cada um com seu guarda-chuva.']],
 b:['A carona fixa','Combinamos de dividir a carona todos os dias.',['Dividir a gasolina|$+400 vira:amigo >c|Economia e companhia.','Fazer de graça|k+5 vira:amigo >c|Gosto da conversa.']],
 c:['As conversas','No carro, {p} me contou que está passando por um momento difícil.',['Ouvir e ajudar|k+6 bond+10 >d|Às vezes um ouvido basta.','Ligar o rádio|bond-3 >d|Não sei lidar.']],
 d:['A mudança','{p} vai se mudar de cidade.',['Fazer a última carona até a rodoviária|h+6 bond+8 >e@2|Despedida com música alta.','Desejar sorte|h+3|Boa viagem.']],
 e:['O cartão-postal','Chegou um cartão-postal de {p}: "Obrigad{o2} por todas as caronas. Você me levou longe."',['Responder|h+8 bond+6|Agora trocamos cartas.','Guardar na geladeira|h+6|Preso com um ímã de pizzaria.']],
});
chain('apartamento_vazio',{k:'Mistério',min:16,max:80,gap:[1,1]},{
 a:['O apartamento vazio','O apartamento de cima está vazio há meses, mas toda noite ouço passos.',['Investigar|>b|Subi com uma lanterna.','Chamar o síndico|>c|O síndico ficou pálido.','Colocar fone e dormir|h-2|Problema de amanhã.']],
 b:['A descoberta','A porta estava encostada. Lá dentro, um gato enorme e uma janela aberta.',['Adotar o gato|pet:Gato h+8 >d|Mistério resolvido. Ele pesa oito quilos.','Avisar o abrigo de animais|k+3 >d|Levaram o gato. Os passos acabaram.']],
 c:['A história do prédio','O síndico contou que o antigo morador era um pianista que tocava toda madrugada.',['Ouvir mais|>b|Mas eu quis ver com meus próprios olhos.','Mudar de apartamento|$-3000 h-2|Não pago para ver.']],
 d:['A risada','Contei a história no grupo do prédio. Todo mundo riu do "fantasma de oito quilos".',['Rir junto|h+6|Agora o gato é a mascote do prédio.','Fazer um vídeo|follow+800 h+5|O vídeo do gato fantasma bombou.']],
});
chain('doacao_sangue',{k:'Bondade',min:18,max:65,gap:[1,1]},{
 a:['O banco de sangue','O banco de sangue da cidade está com estoque baixo.',['Doar|?hl k+6 >b|Uma picada e um suco de laranja.|k+3 >b|Fiquei tont{o}, mas doei.','Ficar com medo de agulha|h-2|Quem sabe outro dia.']],
 b:['O doador regular','Comecei a doar a cada três meses.',['Chamar amigos para doar junto|k+6 >c|Virou programa de sábado.','Doar sozinh{o}|k+4 >c|Meu momento de fazer o bem.']],
 c:['A medalha','O banco de sangue me deu uma medalha por vinte doações.',['Postar com orgulho|f+1 h+6 >d|Muita gente perguntou como doar.','Guardar na gaveta|h+4 >d|Não doo por medalha.']],
 d:['O retorno','Um dia, precisei de sangue numa cirurgia. Recebi de doadores que nunca vou conhecer.',['Agradecer em silêncio|h+10 hl+5|O ciclo se fechou.','Doar de novo assim que puder|k+8 hl+3|Agora eu entendo dos dois lados.']],
});
chain('estrangeiro_perdido',{k:'Acaso',min:14,max:80,npc:1,gap:[1,1]},{
 a:['O turista perdido','{p}, turista de outro país, está perdid{o2} no centro, sem falar português.',['Ajudar com mímica|?sm k+5 >b|Levei {p} até o hotel. Ganhei um abraço.|k+3 >b|Nos perdemos juntos, mas chegamos.','Fingir que não vi|k-2|Tenho pressa.']],
 b:['O convite','{p} me convidou para jantar como agradecimento.',['Aceitar|vira:amigo h+8 >c|Conversamos com tradutor do celular e muita risada.','Recusar|h+2|Não precisava.']],
 c:['A visita','Anos depois, {p} me convidou para visitar o país d{ele}.',['Ir|$-6000 h+15 bond+10 >d|{p} me mostrou cada canto da cidade natal.','Agradecer o convite|h+3|Um dia eu vou.']],
 d:['Amigo do outro lado do mundo','Uma amizade que começou com um mapa e um gesto.',['Manter contato para sempre|h+8 bond+8|Mensagem todo aniversário.','Ensinar português para {p}|sm+2 bond+6|"Saudade" foi a primeira palavra.']],
});
chain('maquina_cafe',{k:'Trabalho',min:18,max:65,when:m=>!!m.job,gap:[1,1]},{
 a:['A máquina de café','A máquina de café do escritório quebrou. O clima ficou insuportável.',['Consertar eu mesm{o}|?sm f+1 h+6 >b|Consertei! Virei herói da copa.|h-2 >c|Piorei o estrago.','Fazer uma vaquinha para uma nova|$-50 k+3 >b|Todo mundo contribuiu.']],
 b:['Herói do café','Agora todo mundo me chama quando algo quebra no escritório.',['Aceitar o título|perf+3 h+4 >d|Sou a pessoa da manutenção não oficial.','Explicar que não é meu trabalho|h+2 >d|Voltaram a chamar o técnico.']],
 c:['O desastre','A máquina soltou fumaça. O alarme de incêndio tocou e o prédio foi evacuado.',['Assumir a culpa|k+5 h-4 >d|Viralizou no grupo da empresa.','Ficar quiet{o}|k-3 >d|Nunca descobriram.']],
 d:['A nova máquina','A empresa comprou uma máquina de café profissional.',['Ser {o} primeir{o} a usar|h+6|O melhor café da minha vida corporativa.','Organizar a fila|k+2 h+3|Ordem na copa.']],
});
