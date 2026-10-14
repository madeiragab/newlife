// ===== Histórias em cadeia: hábitos, mente e escolhas do dia a dia =====
chain('alcool_social',{k:'Hábitos',min:18,max:70,gap:[1,1]},{
 a:['Só uma cerveja','Comecei a beber depois do trabalho para relaxar. Só uma.',['Manter em uma|h+3 >b@2|Só uma. Por enquanto.','Beber até esquecer o dia|add.alcool+8 h+4 >c|Uma virou quatro.']],
 b:['O controle','Consigo beber pouco e parar quando quero.',['Seguir assim|h+3|Moderação é tudo.','Parar de vez|hl+4 h+2|Não preciso disso.']],
 c:['A ressaca de segunda','Faltei no trabalho na segunda de novo por causa da ressaca.',['Prometer diminuir|?will add.alcool-6 >b|Cumpri a promessa.|add.alcool+6 >d|Não consegui.','Inventar uma desculpa|perf-5 add.alcool+5 >d|Mais uma mentira.']],
 d:['O alerta','Um amigo me chamou para conversar sobre a minha bebida.',['Ouvir|>e|Doeu ouvir, mas ele tinha razão.','Ficar ofendid{o}|add.alcool+6 h-4 >f|Ele que cuide da vida dele.']],
 e:['Pedir ajuda','Decidi procurar um grupo de apoio.',['Ir às reuniões|add.alcool-30 h+10 hl+5 >g@1|Um dia de cada vez.','Tentar parar sozinh{o}|?will add.alcool-20 h+6 >g@1|Consegui.|add.alcool+5 >f|Recaí.']],
 f:['O fundo do poço','Bebi demais e acordei num hospital.',['Aceitar ajuda de verdade|add.alcool-25 h+4 >g@1|Foi o susto que eu precisava.','Achar que foi só azar|hl-10 add.alcool+5|O corpo cobra.']],
 g:['Sobriedade','Faz um ano que não bebo.',['Comemorar com a família|h+15 hl+6|Ganhei a ficha de um ano no grupo.','Ajudar outra pessoa a parar|k+10 h+10|Virei {padrinho} de alguém no grupo.']],
});
chain('celular_vicio',{k:'Hábitos',min:13,max:70,gap:[1,1]},{
 a:['Tempo de tela','O celular disse que passei oito horas por dia na tela na última semana.',['Ignorar o aviso|h-2 >b|Mais um vídeo e eu paro.','Colocar limites no aplicativo|?will h+4 >c|Funcionou!|>b|Ignorei os limites em dois dias.']],
 b:['A madrugada','Fiquei rolando a tela até as quatro da manhã.',['Deixar o celular fora do quarto|?will hl+4 h+4 >c|Dormi oito horas pela primeira vez em meses.|>d|Busquei o celular na sala às duas da manhã.','Seguir assim|hl-4 >d|Olheiras de panda.']],
 c:['Desconectad{o}','Comecei a ler livros antes de dormir.',['Seguir firme|sm+4 h+6|Li doze livros em um ano.','Fazer um detox digital de um mês|h+10 sm+3|Descobri que o mundo continua sem mim.']],
 d:['A ansiedade','Comecei a sentir ansiedade quando fico sem o celular.',['Procurar ajuda|$-800 h+4 >c|Aprendi a desligar aos poucos.','Ignorar|dis:ansiedade h-6|Ficou pior.']],
});
chain('dieta',{k:'Saúde',min:16,max:75,gap:[1,1]},{
 a:['A balança','A balança mostrou um número que me assustou.',['Começar uma dieta da internet|>b|Dieta do {comida}. Prometia milagres.','Procurar um nutricionista|$-500 hl+3 >c|Um plano de verdade.','Ignorar a balança|h-2|Joguei a balança no armário.']],
 b:['A dieta milagrosa','A dieta da internet me deixou com fome e mau humor.',['Insistir|?40 lk+3 >d|Perdi peso, mas ganhei de volta em um mês.|hl-4 >d|Passei mal.','Trocar por um plano de verdade|$-500 >c|Chega de milagre.']],
 c:['O plano','O nutricionista me ensinou a comer de tudo, com equilíbrio.',['Seguir à risca|hl+5 lk+4 h+6 >d|Menos dez quilos em seis meses.','Seguir mais ou menos|hl+2 lk+1 >d|Melhor do que nada.']],
 d:['O espelho','Me olhei no espelho com outros olhos.',['Manter o hábito|hl+4 h+8|Não é dieta. É estilo de vida.','Voltar ao velho hábito|hl-2 h+3|O pão francês me chamou.']],
});
chain('meditacao',{k:'Mente',min:16,max:90,gap:[1,1]},{
 a:['Cinco minutos','Um aplicativo prometeu acalmar minha mente em cinco minutos por dia.',['Tentar|h+3 >b|Pensei na lista de compras o tempo todo.','Achar bobagem|h+0|Não tenho paciência.']],
 b:['Persistência','Depois de um mês, consigo ficar alguns minutos em silêncio.',['Aumentar para vinte minutos|h+6 hl+2 >c|Comecei a dormir melhor.','Parar|h+1|Foi bom enquanto durou.']],
 c:['O retiro','Fui convidad{o} para um retiro de silêncio de três dias.',['Ir|$-1500 h+12 sm+2 >d|Três dias sem falar. Ouvi coisas que nunca tinha ouvido.','Não ir|h+2|Silêncio demais me assusta.']],
 d:['Paz','Situações que me tiravam do sério agora passam devagar.',['Ensinar para a família|k+4 h+6|Meditamos juntos no domingo.','Guardar para mim|h+8|Meu refúgio interno.']],
});
chain('voluntariado_enchente',{k:'Bondade',min:16,max:75,npc:1,gap:[1,1]},{
 a:['A enchente','Uma enchente atingiu os bairros mais pobres da cidade.',['Ir ajudar como voluntári{o}|k+8 hl-3 >b|Carreguei sacos de areia o dia inteiro.','Doar roupas e comida|$-500 k+5 >c|Lotei o porta-malas.','Ver pela televisão|h-3|Mudei de canal.']],
 b:['O resgate','Num barco improvisado, ajudei a resgatar a família de {p}.',['Levar todos para o abrigo|k+10 vira:amigo >c|{p} não soltou minha mão o caminho todo.','Voltar para buscar mais gente|?hl k+12 f+3 >c|Salvamos mais três famílias.|hl-8 >c|Caí na água e quase fui levad{o}.']],
 c:['O abrigo','O abrigo está cheio de gente que perdeu tudo.',['Organizar a distribuição de doações|sm+2 k+6 >d|Planilha, fila e muita paciência.','Brincar com as crianças|k+5 h+6 >d|Fizemos teatro com caixas de papelão.']],
 d:['A reconstrução','Meses depois, as famílias voltaram para casa.',['Ajudar na reconstrução|k+8 h+8|Pintei a casa de {p} com a família inteira.','Visitar o bairro|h+6|O bairro está de pé de novo.']],
});
chain('sindrome_impostor',{k:'Mente',min:22,max:60,when:m=>!!m.job,gap:[1,1]},{
 a:['Fraude?','Fui promovid{o}, mas sinto que a qualquer momento vão descobrir que eu não sei o que estou fazendo.',['Conversar com alguém de confiança|h+4 >b|"Todo mundo se sente assim às vezes."','Trabalhar o dobro para compensar|perf+8 hl-4 >c|Ninguém vai me pegar despreparad{o}.']],
 b:['A conversa','Uma colega mais experiente disse que sente a mesma coisa há vinte anos.',['Aceitar que é normal|h+8 >d|Alívio.','Procurar terapia|$-800 h+6 >d|Fui entender de onde vem isso.']],
 c:['O limite','Trabalhar o dobro me deixou esgotad{o}.',['Diminuir o ritmo|h+4 >d|Meu chefe nem percebeu a diferença.','Continuar|dis:burnout h-10|O corpo parou.']],
 d:['Confiança','Comecei a acreditar que mereço estar onde estou.',['Mentorar alguém novo|k+5 h+6|Disse para a pessoa nova o que eu precisava ouvir.','Pedir um aumento|?perf raise+10 h+6|Pedi e ganhei.|h+2|Não ganhei, mas pedi.']],
});
chain('amizade_online',{k:'Internet',min:14,max:60,npc:1,gap:[1,2]},{
 a:['Parceria de jogo','Jogando online, fiz parceria com {p}, de outro estado.',['Jogar juntos toda noite|vira:amigo h+6 >b|Dupla imbatível.','Jogar só de vez em quando|h+3 >b|Um bom parceiro de partida.']],
 b:['Mais que jogo','As conversas no jogo viraram conversas sobre a vida.',['Contar um segredo|bond+10 h+4 >c|{p} guardou e contou um também.','Manter só no jogo|>c|Cada coisa no seu lugar.']],
 c:['O campeonato','Nos inscrevemos num campeonato online.',['Treinar sério|?sm $+3000 h+12 >d|Fomos campeões!|h-3 >d|Caímos na semifinal.','Jogar por diversão|h+6 >d|Rimos mais do que jogamos.']],
 d:['O encontro','Depois de anos, eu e {p} combinamos de nos encontrar pessoalmente.',['Ir|?60 h+15 bond+10|{p} é exatamente como eu imaginava. Abraço de anos.|h-4|Foi meio estranho ao vivo, mas a amizade continua online.','Desistir de última hora|h-3|Medo de estragar.']],
});
