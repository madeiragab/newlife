// ===== Histórias em cadeia: surpresas da vida =====
chain('bilhete_errado',{k:'Acaso',min:16,max:80,npc:1,date:1,gap:[1,1]},{
 a:['A mensagem errada','Recebi uma mensagem de um número desconhecido: "Já cheguei no restaurante, cadê você?" Era para outra pessoa.',['Avisar que é engano|k+2 >b|{p} pediu desculpas e mandou um emoji envergonhado.','Brincar junto|?50 h+6 >b|{p} riu e a conversa continuou.|>b|{p} não achou graça.','Ignorar|h+0|Engano é engano.']],
 b:['A conversa','A conversa com {p} continuou por dias, sobre tudo e nada.',['Marcar um café|?lk h+10 >c|{p} é ainda mais divertid{o2} pessoalmente.|h-2 >d|Faltou química.','Manter só por mensagem|vira:amigo h+4 >d|Amizade de texto.']],
 c:['O destino','Eu e {p} começamos a sair. Tudo por causa de uma mensagem errada.',['Namorar|vira:namoro h+12 >e|A história de como nos conhecemos é a melhor da festa.','Ficar só na amizade|vira:amigo h+6|Uma amizade improvável.']],
 d:['Um ano depois','{p} me mandou mensagem no aniversário da "mensagem errada".',['Comemorar a data|h+6 bond+8|Agora é uma tradição.','Achar fofo e seguir|h+3|Algumas pessoas passam pela nossa vida de um jeito curioso.']],
 e:['A pessoa certa','Às vezes o número errado é o certo.',['Pedir {p} em casamento|noivar h+15 bond+10|Mandei o pedido por mensagem. Do número certo, desta vez.','Contar a história para todo mundo|h+8 bond+5|Ninguém acredita.']],
});
chain('sorteio_carro',{k:'Sorte',min:18,max:80,gap:[1,1]},{
 a:['O sorteio do mercado','O mercado do bairro está sorteando um carro. Cada compra vale um cupom.',['Preencher vários cupons|h+2 >b|Fiz compras desnecessárias só pelos cupons.','Preencher um só|>b|Se for para ganhar, ganha com um.']],
 b:['O resultado','O sorteio foi transmitido ao vivo na frente do mercado.',['Ir assistir|?5 h+25 f+3 >c|Chamaram meu nome! Ganhei o carro!|h-1|Não fui eu. Ganhou a dona da padaria.','Não ir|h+0|Depois vejo o resultado.']],
 c:['O carro novo','Ganhei um carro zero.',['Ficar com o carro|item:carro_do_sorteio:60000 h+10|Chave na mão e um laço vermelho no capô.','Vender e guardar o dinheiro|$+55000 h+8|Investi tudo.']],
});
chain('celebridade_encontro',{k:'Acaso',min:14,max:80,gap:[1,1]},{
 a:['Alguém famoso','Na fila da padaria, reconheci uma celebridade de televisão disfarçada de boné.',['Pedir uma foto|?50 h+8 f+1 >b|Foi super simpática e tirou a foto.|h-3 >b|Fingiu que não ouviu.','Fingir que não reconheci|k+2 >c|Celebridade também merece comprar pão em paz.']],
 b:['A foto','Postei a foto nas redes sociais.',['Contar a história com detalhes|follow+2000 f+1 h+4|A foto rodou o país.','Só postar a foto|follow+300 h+3|Os amigos ficaram com inveja.']],
 c:['A surpresa','A celebridade percebeu que eu reconheci e não incomodei. Agradeceu com um sorriso e me deu um ingresso para a gravação do programa.',['Ir à gravação|h+12 f+1|Apareci de relance na televisão. Minha mãe gravou.','Dar o ingresso para alguém que é fã|k+5 h+6|A fã chorou de emoção.']],
});
chain('animal_perdido',{k:'Bichos',min:10,max:80,npc:1,gap:[1,1]},{
 a:['O cachorro perdido','Achei um cachorro de raça, com coleira, perdido na avenida.',['Levar para casa e procurar o dono|k+5 >b|Coloquei cartazes pelo bairro.','Deixar onde estava|k-4|Alguém deve achar.']],
 b:['O dono','Uma semana depois, {p} ligou chorando: era o cachorro d{ele}.',['Devolver|k+8 h+10 >c|O cachorro pulou no colo de {p} como se não houvesse amanhã.','Pedir a recompensa do cartaz|$+1000 h+6 >c|{p} pagou feliz.']],
 c:['A amizade','{p} me convidou para um almoço de agradecimento.',['Ir|vira:amigo h+6 >d|Descobrimos que temos muito em comum.','Recusar|h+2|Fiz só o que era certo.']],
 d:['O filhote','O cachorro de {p} teve filhotes e um tem meu nome. Ou quase.',['Adotar um filhote|pet h+12|Agora temos cachorros irmãos.','Visitar sempre|h+6 bond+5|Tio postiço de cachorro.']],
});
chain('blackout',{k:'Acaso',min:10,max:85,npc:1,gap:[1,1]},{
 a:['O apagão','Um apagão deixou o bairro inteiro sem luz por três dias.',['Ajudar os vizinhos idosos|k+6 >b|Levei água e velas para quem não podia sair.','Ficar em casa no escuro|h-4 >c|Tédio absoluto.']],
 b:['A vizinha do 7','{p}, do apartamento 7, mora sozinh{o2} e estava com medo do escuro.',['Fazer companhia|vira:amigo k+6 h+6 >c|Jogamos baralho à luz de vela a noite inteira.','Deixar uma lanterna|k+3 >c|Pelo menos {ele} tem luz.']],
 c:['A rua no escuro','Sem luz, os vizinhos saíram para a rua e começaram a conversar.',['Puxar uma roda de violão|h+10 >d|A rua inteira cantou.','Fazer um churrasco antes da carne estragar|h+8 k+3 >d|Churrasco comunitário.']],
 d:['A luz voltou','A luz voltou, mas a rua ficou diferente.',['Organizar uma festa anual|k+5 h+8|"Festa do apagão", todo ano.','Seguir a vida|h+3|Mas agora cumprimento todo mundo.']],
});
chain('heranca_bicho',{k:'Bichos',min:25,max:80,npc:1,age:[30,50],gap:[1,1]},{
 a:['O papagaio','{p}, que mora ao lado há décadas, pediu para eu cuidar do papagaio d{ele} se algo acontecesse.',['Prometer cuidar|k+5 vira:amigo >b@1-4|{p} ficou aliviad{o2}.','Dizer que não gosto de pássaros|h+0|{Ele} entendeu.']],
 b:['A promessa','{p} faleceu. O papagaio veio morar comigo.',['Cumprir a promessa|pet k+6 h-3 >c|O papagaio fala o nome de {p} toda manhã.','Doar para um santuário|k+3 h-2|Ele vai ter companhia.']],
 c:['O papagaio falante','O papagaio sabe cinquenta palavras, a maioria impublicável.',['Ensinar palavras novas|h+8 >d|Agora ele também canta o hino do meu time.','Proibir visitas sensíveis|h+5 >d|Minha mãe não pode ouvir.']],
 d:['Companhia','O papagaio vive muito. Pode ser que viva mais do que eu.',['Deixar no testamento|k+3 h+5|Já escolhi quem vai cuidar dele.','Aproveitar cada dia|h+6|Ele me acorda cantando.']],
});
chain('maratona_series',{k:'Diversão',min:14,max:80,gap:[1,1]},{
 a:['A série nova','Comecei uma série que todo mundo está comentando.',['Ver tudo num fim de semana|h+8 hl-2 >b|Dez episódios, zero banhos.','Ver um por dia|h+5 >b|Saboreando.']],
 b:['O spoiler','Um colega deu spoiler do final da temporada.',['Brigar com ele|h-3 >c|Amizade abalada por uma série.','Fingir que não ouvi|h-2 >c|Ouvi. E doeu.']],
 c:['O fã-clube','Entrei num grupo de fãs da série.',['Escrever teorias|tal.writing+3 follow+500 >d|Uma teoria minha viralizou.','Só ler|h+4 >d|Os fãs são loucos. No bom sentido.']],
 d:['O evento','Vai ter um evento com o elenco da série na cidade.',['Ir fantasiad{o}|$-400 h+12 f+1|Um ator elogiou minha fantasia.','Ir sem fantasia|$-300 h+8|Autógrafo garantido.']],
});
chain('mudanca_vizinho_famoso',{k:'Vizinhança',min:18,max:80,npc:1,gap:[1,1]},{
 a:['O caminhão de mudança','Um caminhão de mudança enorme parou na casa ao lado. Quem se mudou foi {p}, atleta famos{o2}.',['Levar um bolo de boas-vindas|k+4 >b|{p} abriu a porta de chinelo e me agradeceu.','Espiar pela janela|>c|Ninguém viu nada demais.']],
 b:['O vizinho famoso','{p} é a pessoa mais simples da rua.',['Convidar para um churrasco|vira:amigo h+8 >d|{p} trouxe a sobremesa e jogou bola com as crianças.','Respeitar a privacidade|k+4 >d|Bom dia, boa tarde, e só.']],
 c:['Os fãs','Os fãs começaram a fazer plantão na rua.',['Reclamar da bagunça|h-3 >d|A rua virou ponto turístico.','Vender água para os fãs|$+800 h+3 >d|Empreendedorismo de calçada.']],
 d:['A despedida','{p} vai se mudar para o exterior.',['Ir à festa de despedida|h+6|Ganhei uma camisa autografada.','Mandar um cartão|h+3|"Foi bom ter você de vizinho."']],
});
