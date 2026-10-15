// ===== Histórias em cadeia: a vida de lobisomem (2) =====
chain('lobo_controle',{k:'Lobisomem',min:16,max:120,when:LOBO,gap:[1,1]},{
 a:['Dominar a fera','Ouvi dizer que lobisomens antigos conseguem se transformar quando querem, sem lua.',['Treinar|>b|Meditação, respiração e muita dor.','Achar impossível|h-2|A lua manda em mim.']],
 b:['Os primeiros sinais','Depois de meses, consegui fazer as unhas crescerem por vontade própria.',['Continuar treinando|fight+4 >c|Um passo de cada vez.','Exibir para os amigos|f+1 >d|Má ideia.']],
 c:['A transformação voluntária','Numa noite sem lua, me transformei por vontade própria. E voltei.',['Celebrar|fight+8 h+12 >e|Agora a fera obedece a mim.','Ter medo do próprio poder|h-4 >e|E se eu não conseguir voltar?']],
 d:['O susto','Os amigos acharam que era um truque. Um deles não achou.',['Pedir segredo|?k >c|Ele guardou.|>c|Ele espalhou, mas ninguém acreditou nele.','Rir e mudar de assunto|>c|Mágica, claro.']],
 e:['Mestre da fera','Agora a lua cheia não me domina mais. Eu escolho quando.',['Usar para proteger os outros|k+8 fome-20|Às vezes, a fera salva vidas.','Ensinar outros lobisomens|k+6 f+0|A alcateia inteira veio aprender.']],
});
chain('lobo_zoologico',{k:'Lobisomem',min:16,max:120,when:LOBO,gap:[1,1]},{
 a:['Acordei no zoológico','Acordei pelad{o}, dentro da jaula dos lobos do zoológico, com três lobos dormindo em volta de mim.',['Sair escondid{o} antes da abertura|?sm >b|Pulei a cerca com um uniforme roubado do vestiário.|>c|Os tratadores chegaram antes.','Ficar quiet{o} e esperar|>c|Não tinha como sair.']],
 b:['A fuga','Saí do zoológico sem ninguém ver.',['Rir da situação|h+6 >d|A melhor história que eu nunca vou poder contar.','Ficar preocupad{o}|h-3 >d|E se tivesse câmera?']],
 c:['O flagra','Os tratadores me encontraram na jaula, abraçad{o} com um lobo.',['Dizer que sou ativista|?40 f+3 >d|Saí na TV como "ativista que dormiu com os lobos".|arrest:invasão:0:1|A polícia me levou.','Correr|?hl >d|Escapei pela cerca.|arrest:invasão:0:1|Me pegaram no estacionamento.']],
 d:['A câmera','Uma câmera do zoológico gravou um lobo enorme pulando a cerca de madrugada.',['Torcer para ninguém ligar os pontos|h-2|O zoológico disse que foi um lobo "fugido de um circo".','Mudar o caminho das noites de lua cheia|k+3|Nunca mais passo perto do zoológico.']],
});
chain('lobo_policia_suspeito',{k:'Lobisomem',min:18,max:120,when:LOBO,npc:1,gn:'F',age:[0,20],gap:[1,1]},{
 a:['A investigadora','A investigadora {p} está juntando relatos de "ataques de animal" e todos acontecem perto de onde eu moro.',['Me afastar do bairro nas luas cheias|fome+10 >b|Corro para longe, na mata do outro lado da cidade.','Agir normalmente|>c|Não posso mudar minha vida inteira.']],
 b:['Mais longe','Mudei a rota, mas um ataque aconteceu do outro lado da cidade.',['Investigar|>d|Tem outro lobisomem na cidade.','Achar que é coincidência|>c|Não é comigo.']],
 c:['A visita','{p} bateu na minha porta com perguntas e um olhar desconfiado.',['Responder com calma|?sm >b|Ela foi embora sem nada.|>e|Ela reparou nas cicatrizes no meu braço.','Contar a verdade|>e|Arrisquei tudo.']],
 d:['O outro lobisomem','Encontrei o outro: um lobisomem selvagem, que mata por prazer.',['Enfrentar|?fight k+10 >f|Venci. Os ataques pararam.|hl-35 >f|Venci por pouco.','Contar para a investigadora|>e|Ela precisa saber onde procurar.']],
 e:['A aliança','{p} ouviu tudo. Tinha medo, mas também precisava de ajuda.',['Fazer uma aliança|vira:amigo k+5 >d|Ela investiga de dia, eu caço de noite.','Fugir|$-4000 h-4|Melhor sumir.']],
 f:['Caso encerrado','O caso foi encerrado como "ataque de animal selvagem abatido".',['Agradecer a {p}|bond+10 h+8|Ela guarda meu segredo até hoje.','Seguir em frente|h+4|Mais uma lua.']],
});
chain('lobo_esporte',{k:'Lobisomem',min:16,max:60,when:LOBO,gap:[1,1]},{
 a:['Força demais','Desde a mordida, corro mais rápido e sou mais fort{o} do que qualquer atleta.',['Entrar para um time|tal.athletic+10 >b|O técnico ficou de queixo caído.','Esconder a força|h-2|Melhor não chamar atenção.']],
 b:['O campeonato','Fui o destaque do campeonato. Quebrei um recorde regional.',['Continuar competindo|f+5 >c|Patrocinadores começaram a ligar.','Diminuir o ritmo|h+2 >d|Muita atenção.']],
 c:['O exame antidoping','Fui sortead{o} para o antidoping. Meu sangue é... diferente.',['Fazer o exame|?40 f+6 $+20000|O laboratório achou "anomalia genética rara". Liberad{o}.|f+3 h-10|Fui suspens{o} por "substância desconhecida".','Fugir do exame|f-5 h-6|Desclassificad{o} e fim de carreira.']],
 d:['A escolha','Brilhar no esporte ou proteger o segredo?',['Ficar no esporte amador|h+6|Ganho os campeonatos do bairro sem chamar atenção.','Largar o esporte|h-3|A fera não pode virar notícia.']],
});
chain('lobo_floresta',{k:'Lobisomem',min:16,max:120,when:LOBO,gap:[1,1]},{
 a:['A floresta ameaçada','A mata onde corro nas noites de lua cheia vai ser derrubada para virar condomínio.',['Organizar um protesto|>b|Juntei moradores e ambientalistas.','Assustar os trabalhadores na lua cheia|k-3 >c|Uivos a noite toda perto das máquinas.']],
 b:['O protesto','O protesto saiu no jornal, mas a construtora não recuou.',['Pressionar a prefeitura|?k f+3 >d|A prefeitura transformou a mata em reserva.|>c|A prefeitura liberou a obra.','Desistir|h-6|O dinheiro venceu.']],
 c:['A lenda das máquinas','As máquinas aparecem quebradas toda manhã depois da lua cheia. Os operários dizem que tem um bicho enorme na mata.',['Continuar|?50 >d|A construtora desistiu: "terreno amaldiçoado".|arrest:dano_ao_patrimônio:0:2|Uma câmera me pegou humano, voltando da mata.','Parar|h-4|A mata foi derrubada.']],
 d:['A reserva','A mata virou reserva ambiental. A fera tem onde correr.',['Comemorar correndo na lua cheia|h+15 fome-30|Nunca a mata pareceu tão minha.','Virar guarda voluntári{o} da reserva|k+8|Protejo de dia e de noite.']],
});
chain('lobo_vampiros',{k:'Lobisomem',min:18,max:120,when:LOBO,gap:[1,1]},{
 a:['Cheiro de morte','Um clã de vampiros chegou à cidade. O cheiro deles é insuportável para mim.',['Avisar a alcateia|>b|Lobos e vampiros nunca dividiram território.','Ignorar|>c@1|Cada um no seu canto.']],
 b:['A guerra','A alcateia quer guerra.',['Lutar|?fight fight+4 k-4 >d|Expulsamos os vampiros.|hl-35 >e|Perdemos feio.','Propor trégua|?k k+6 >d|O rio virou fronteira.|>e|Os vampiros atacaram primeiro.']],
 c:['O ataque','Um vampiro atacou alguém do meu bairro.',['Caçar o vampiro|?fight k+8 >d|Achei e expulsei.|hl-25 >e|Ele era mais rápido.','Avisar os caçadores|>d|Que eles resolvam.']],
 d:['Paz armada','Lobos e vampiros vivem de lados opostos da cidade.',['Respeitar a fronteira|h+6|Paz frágil.','Fazer amizade com um vampiro|?40 h+8 k+5|Uma amizade improvável: ele cheira mal, eu também, segundo ele.|hl-15|Era uma armadilha.']],
 e:['Recuar','A cidade ficou com os vampiros por enquanto.',['Treinar e voltar|fight+6 >b@2|A lua vai voltar a ser nossa.','Mudar com a alcateia|$-4000 h-4|Outra cidade, outra mata.']],
});
chain('lobo_faro',{k:'Lobisomem',min:16,max:120,when:LOBO,npc:1,age:[-15,10],gap:[1,1]},{
 a:['O faro','Desde a mordida, sinto cheiros a quilômetros. Senti cheiro de medo vindo de uma casa no fim da rua.',['Investigar|>b|O cheiro vinha do porão.','Ignorar|k-3|Não é da minha conta.']],
 b:['A criança','No porão, uma criança desaparecida havia uma semana: {p}.',['Tirar {p} de lá|?fight k+12 f+5 >c|Arrombei a porta e levei {p} para a polícia.|hl-15 k+12 >c|O sequestrador me atacou, mas salvei {p}.','Chamar a polícia|k+10 >c|A polícia chegou em minutos.']],
 c:['Herói','O jornal chamou de "faro inexplicável".',['Dar entrevista|f+6 >d@1|Disse que foi intuição.','Ficar no anonimato|k+5 >d@1|Ninguém pode saber como eu sei.']],
 d:['Os pedidos','Agora a polícia me procura para casos de desaparecidos.',['Ajudar|k+10 f+3|Já encontrei sete pessoas.','Recusar|h+2|É arriscado demais.']],
});
