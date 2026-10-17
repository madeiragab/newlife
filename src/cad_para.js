// ===== Histórias em cadeia: paranormal =====
WHO.kidpara=()=>R.pick(kids().filter(k=>k.alive&&k.criatura&&k.age>=6));
const CRI=t=>m=>m.criatura===t&&!m.prison, CRIA=m=>!!m.criatura&&!m.prison, CACA=m=>!!m.para&&m.para.visitas>=2&&!m.criatura&&!m.prison;
chain('cla_vampiro',{k:'Maldição',min:16,max:120,npc:1,when:CRI('vampiro'),gap:[1,2]},{
 a:['O convite','Um bilhete com selo de cera chegou pela janela: "Os seus irmãos de sangue querem conhecer você. Assinado: {p}."',['Ir ao encontro|>b|Um casarão antigo, velas e gente pálida demais.','Queimar o bilhete|h+0 >f@2|Não quero fazer parte de nada.']],
 b:['O clã','{p} lidera um clã de vampiros que vive escondido há séculos. Querem que eu entre.',['Entrar no clã|vira:amigo >c|Jurei lealdade com uma taça que não era de vinho.','Recusar com educação|vira:inimigo >f|{p} sorriu de um jeito que me deu medo.']],
 c:['As regras','O clã tem três regras: nunca matar no próprio bairro, nunca contar a um humano, nunca trair o clã.',['Seguir as regras|k+2 >d|O clã me ensinou a controlar a sede.','Quebrar uma regra em segredo|k-6 >e|Ninguém vai saber.']],
 d:['A guerra dos clãs','Um clã rival quer tomar a cidade.',['Lutar ao lado de {p}|?fight k-4 bond+15 >g|Vencemos. Ganhei respeito entre os meus.|hl-25 >g|Perdemos. Escapei por pouco.','Negociar a paz|?sm k+5 bond+10 >g|Consegui uma trégua.|>g|A negociação falhou.']],
 e:['A traição descoberta','{p} descobriu que eu quebrei uma regra.',['Pedir perdão|?40 bond-15 >d|Fui perdoad{o}, com uma marca na mão para lembrar.|hl-30 >f|O castigo foi cruel.','Fugir da cidade|$-8000 h-8 >f|Comecei de novo em outro lugar.']],
 f:['Sozinh{o}','Viver como vampiro sem um clã é mais solitário e mais perigoso.',['Seguir sozinh{o}|h-4|Prefiro minha liberdade.','Procurar outro clã|>a@2|Talvez em outra cidade.']],
 g:['Herdeir{o} do clã','{p} me chamou: quer que eu lidere o clã quando {ele} partir.',['Aceitar|h+10 k-2|Agora a noite da cidade responde a mim.','Recusar|h+3|Liderar vampiros não é para mim.']],
});
chain('alcateia',{k:'Maldição',min:14,max:110,npc:1,when:CRI('lobisomem'),gap:[1,1]},{
 a:['Pegadas na lama','Na lua cheia, acordei na mata ao lado de pegadas iguais às minhas. Outra pessoa como eu.',['Seguir as pegadas|>b|Elas levavam até uma cabana.','Ignorar|>e@2|Prefiro não saber.']],
 b:['A alcateia','{p} vive com mais quatro como nós numa fazenda afastada. Me ofereceram um lugar.',['Entrar para a alcateia|vira:amigo h+8 >c|Pela primeira vez, alguém entende o que eu sinto.','Agradecer e voltar para casa|vira:amigo >e|Bom saber que não estou só.']],
 c:['As noites juntos','Correr com a alcateia na lua cheia é mais seguro do que sozinh{o}.',['Aprender a controlar a fera|fight+5 >d|A fome agora obedece mais.','Correr sem limites|fight+3 k-3 >d|Liberdade selvagem.']],
 d:['Os caçadores','Caçadores com balas de prata cercaram a fazenda da alcateia.',['Lutar com a alcateia|?fight k-5 bond+15|Expulsamos os caçadores. Um de nós ficou ferido.|hl-30|Perdemos dois irmãos. Eu sobrevivi por pouco.','Fugir com os mais novos|k+6 bond+8|Salvei os filhotes da alcateia.']],
 e:['A falta','Às vezes, na lua cheia, escuto uivos ao longe e sinto falta de algo que nunca tive.',['Ir procurar {p}|>b@0|Talvez ainda dê.','Seguir sozinh{o}|h-3|A fera é minha e de mais ninguém.']],
});
chain('par_descobre',{k:'Maldição',min:18,max:110,who:'partner',when:CRIA,gap:[1,1]},{
 a:['Você é o quê?','{p} me viu me transformar. Ou me viu sem reflexo no espelho. Agora quer saber a verdade.',['Contar tudo|>b|Falei a noite inteira. {p} não piscou.','Inventar uma desculpa|?30 >e|Colou. Por enquanto.|pbond-15 >b|A desculpa era ridícula.']],
 b:['O medo','{p} ficou em silêncio por três dias.',['Dar espaço|>c|Esperei.','Implorar para ficar|?bond >c|{p} disse que precisa pensar.|separar h-15|{p} foi embora com medo.']],
 c:['A decisão de {p}','{p} voltou para conversar.',['Ouvir|?bond pbond+15 h+12 >d|{p} disse que me ama do jeito que eu sou.|separar h-15|{p} não consegue viver com isso.']],
 d:['O pedido','{p} quer ser transformad{o2} também, para envelhecermos juntos. Ou não envelhecermos.',['Morder {p}|morder k-3 pbond+15 h+8|Agora somos dois. Para sempre.','Recusar|pbond-5 k+3|Não posso tirar d{ele} a vida comum.']],
 e:['Segredo guardado','Guardar o segredo de {p} pesa todo dia.',['Contar finalmente|>b|Chega de mentir.','Continuar escondendo|h-4|Mais um ano de mentiras.']],
});
chain('medico_estranha',{k:'Maldição',min:16,max:110,npc:1,when:CRIA,gap:[1,1]},{
 a:['Exames estranhos','Num exame de rotina, {O2} médic{o2}, {p}, ficou pálid{o2}: "Seu sangue não deveria existir."',['Fugir do consultório|h-3 >b|Nunca mais voltei lá.','Contar a verdade|>c|{p} anotou tudo com as mãos tremendo.']],
 b:['Os homens de terno','Dois homens de terno começaram a me seguir.',['Despistar|?sm >e|Mudei de casa e de nome.|>d|Eles me pegaram.','Confrontar|?fight >e|Eles fugiram e não voltaram.|>d|Eram mais fortes do que pareciam.']],
 c:['A pesquisa','{p} quer estudar meu sangue para achar uma cura.',['Aceitar|vira:amigo >f|Duas coletas por mês, escondidas.','Recusar|>b|Não confio.']],
 d:['O laboratório','Acordei amarrad{o} num laboratório do governo.',['Esperar uma chance de fugir|?fight-10 h-10 >e|Arrebentei as correias na lua cheia e fugi.|hl-25 h-15 >e|Me estudaram por um ano antes de me soltar.']],
 e:['Em fuga','Agora vivo olhando por cima do ombro.',['Seguir em frente|h-3|Cuidado redobrado.','Procurar ajuda paranormal|>a@2|Existe gente que entende disso.']],
 f:['A cura?','Depois de anos de pesquisa, {p} acha que encontrou uma cura.',['Tomar a cura|?45 curar h+20 bond+15|Funcionou. Sinto o sol na pele de novo.|hl-20|Não funcionou e quase me matou.','Recusar|h+2|Já aceitei quem eu sou.']],
});
chain('filho_aprende',{k:'Maldição',min:20,max:110,who:'kidpara',gap:[1,1]},{
 a:['Ensinar a fera','{p} está crescendo com a maldição no sangue. Preciso ensinar a controlar.',['Treinar todos os dias|bond+10 >b|Exercícios de respiração, regras e muita paciência.','Deixar aprender sozinh{o2}|bond-5 >c|Cada um aprende do seu jeito.']],
 b:['O primeiro controle','{p} sentiu a fera subir e conseguiu segurar.',['Comemorar|bond+12 h+10 >d|Pizza à meia-noite para comemorar.','Avisar que vai ficar mais difícil|bond+5 >d|A adolescência vem aí.']],
 c:['O incidente','{p} perdeu o controle na escola. Um colega se machucou.',['Tirar da escola|bond-5 >b|Estudo em casa a partir de agora.','Pagar o hospital do colega e abafar|$-5000 k-4 >b|O segredo continua.']],
 d:['Adult{o2}','{p} virou adult{o2} e sabe se controlar melhor do que eu.',['Dizer que tenho orgulho|bond+15 h+12|Passamos a correr juntos na lua cheia.','Pedir ajuda para controlar a minha fera|bond+10 h+8|Agora é {p} quem me ensina.']],
});
chain('lenda_cura',{k:'Maldição',min:16,max:120,npc:1,age:[30,60],when:CRIA,gap:[1,1]},{
 a:['A lenda','Uma senhora numa feira esotérica falou de uma flor que cura a maldição. Só nasce no alto de uma montanha.',['Ir atrás|$-3000 >b|Peguei um ônibus para o interior.','Achar que é golpe|h+0|Mais uma lenda.']],
 b:['A montanha','A trilha é longa e a lua cheia está chegando.',['Subir mesmo assim|?hl >c|Cheguei ao topo antes da lua.|hl-15 >d|Me transformei no meio da trilha.','Esperar a lua passar|>c|Mais lenta, mais segura.']],
 c:['A flor','No topo, uma flor branca brilha sob a lua.',['Comer a flor|?40 curar h+25|Senti a maldição saindo do corpo como febre. Acabou.|hl-15 h-10|Passei mal por dias. Não funcionou.','Levar para estudar|item:flor_da_lua:5000 >e|Talvez sirva para outra pessoa.']],
 d:['Perdid{o} na mata','Acordei sem roupa, ferid{o}, a quilômetros da trilha.',['Tentar de novo|>b@1|Ano que vem.','Desistir|h-6|A maldição venceu desta vez.']],
 e:['Para outro','Dei a flor para uma criança mordida que eu conheci num hospital.',['Ver se funcionou|k+15 h+15|A criança voltou a brincar no sol.','Seguir viagem|k+10|Fiz o que podia.']],
});
chain('ninho_vampiros',{k:'Paranormal',min:16,max:80,npc:1,when:CACA,gap:[1,1]},{
 a:['Uma pista','Nas minhas investigações, achei o endereço de um prédio onde gente some à noite.',['Ir investigar|>b|Lanterna, câmera e coragem.','Avisar a polícia|>e|Riram de mim no telefone.']],
 b:['O porão','No porão, caixões. E um deles está aberto.',['Fotografar e fugir|?50 >c|Consegui as fotos.|>d|Alguém acordou.','Fechar a tampa e prender com corrente|k+5 >c|Que fique lá dentro.']],
 c:['As provas','As fotos do porão são as melhores provas que já consegui.',['Publicar|?50 f+10 $+15000|Viralizou! Agora todo mundo quer saber onde é.|f+2|Disseram que era montagem.','Guardar|>e|O mundo não está pronto.']],
 d:['A mordida','Uma mão gelada me agarrou pelo pescoço.',['Lutar|?fight >e|Escapei com uma estaca improvisada.|virar:vampiro|Senti as presas. Acordei diferente.','Implorar|?30 >e|{p}, o vampiro, me deixou ir, "por curiosidade".|virar:vampiro|Não adiantou.']],
 e:['Marcad{o}','Desde aquela noite, sinto que alguém me observa.',['Mudar de cidade|$-5000 h+3|Novo endereço, nova paz.','Continuar investigando|>a@2|Agora é pessoal.']],
});
