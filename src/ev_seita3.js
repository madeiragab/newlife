// ===== Eventos da seita (parte 3): vida na deep web, segurança, inimigos, rival e os bastidores de quem está perto do líder =====
// ---------- fórum: o grupo ainda é só um apelido e seguidores online ----------
pack({k:'Deep web',w:1.8,cd:5,min:18,when:SL(s=>(s.fieis||0)<5)},[
  ['Tópico fixado','Um moderador gostou do seu post sobre {seita} e fixou no topo do fórum.',['Agradecer e postar mais|online+25 sfama+2|O tópico virou ponto de encontro.','Desconfiar do moderador|susp-2|Melhor não chamar atenção.']],
  ['Banido do fórum','Um moderador baniu o seu apelido por "conteúdo de seita".',['Criar outra conta|?55 online+5|Voltei com outro nome. Os seguidores me reconheceram pelo jeito de escrever.|online-10|Perdi metade dos seguidores na mudança.','Migrar para um fórum menor|online-5 devo+3|Menos gente, mais fé.']],
  ['Hacker oferece proteção','Um hacker oferece apagar seus rastros na rede por {v} em criptomoeda.',['Pagar|$-v susp-10|Agora sou um fantasma na internet.','Recusar|h+0|Confio na minha VPN.'],{v:[500,3000]}],
  ['Live com voz distorcida','Seus seguidores online pedem uma transmissão ao vivo, com voz distorcida e rosto escondido.',['Fazer a live|?sm online+30 devo+4|A voz robótica deu um ar ainda mais misterioso.|online-5|A conexão caiu no meio da revelação.','Mandar só texto|online+5|Continuo anônim{o}.']],
  ['Primeira doação em cripto','Um seguidor anônimo mandou {v} em criptomoeda para {seita}.',['Guardar no caixa|caixa+v|O primeiro dinheiro do grupo.','Devolver|k+4 devo+2|Ninguém entendeu, mas admiraram.'],{v:[200,2500]}],
  ['Símbolo próprio','Os seguidores online querem um símbolo para se reconhecerem na rua.',['Um olho dentro de um triângulo|online+8 susp+2|Clichê, mas pegou.','Inventar um símbolo novo|?sm online+12 devo+3|Três pessoas já tatuaram.|h-2|Parecia o logotipo de uma padaria.']],
  ['Golpista no fórum','Alguém está usando o nome de {seita} para pedir dinheiro aos seus seguidores.',['Denunciar o golpista no fórum|online+6 devo+3|Os seguidores agradeceram o aviso.','Ignorar|online-8|Muita gente achou que o golpe era meu.']],
]);
// ---------- segurança ----------
pack({k:'Religião',w:1.3,cd:7,min:18,when:SL(s=>(s.seg||0)>=1)},[
  ['Segurança pede aumento','O chefe da sua segurança quer {v} a mais por ano.',['Pagar|caixa-v|Segurança contente é segurança atenta.','Negar|?50 h+0|Ele aceitou, resmungando.|seg-1|Ele se demitiu e levou a equipe.'],{v:[3000,15000]}],
  ['Segurança agrediu um fiel','Um segurança bateu num fiel que tentou chegar perto demais de você.',['Demitir o segurança|devo+3 k+3|Os fiéis viram que eu me importo.','Defender a segurança|devo-5 susp+6|O fiel foi à polícia.']],
  ['Carro desconhecido','Seus seguranças notaram o mesmo carro seguindo você há três dias.',['Mudar a rotina|h-3|Dormi cada noite num lugar.','Mandar abordar o carro|?50 inim-1|Era um detetive pago por um ex-fiel. Desistiu na hora.|susp+5|Era a polícia.']],
  ['Treino de evacuação','A equipe de segurança quer treinar a evacuação do templo durante o culto.',['Autorizar|devo-2 caixa-2000|Os fiéis acharam estranho, mas aprenderam as saídas.','Negar|h+0|Culto é culto.']],
  ['Segurança infiltrado','Seu chefe de segurança desconfia que um dos homens dele foi comprado por alguém.',['Mandar investigar|caixa-5000 inim-1|Era verdade. O homem sumiu antes de ser demitido.','Demitir a equipe inteira|seg-1 h+2|Dormi mais tranquil{o}, e mais desprotegid{o}.']],
]);
// ---------- inimigos ----------
pack({k:'Perigo',w:1.4,cd:6,min:18,when:SL(s=>(s.inim||0)>=1)},[
  ['Ameaça anônima','Chegou uma carta sem remetente: "Seus dias estão contados, falso profeta".',['Mostrar para os fiéis|devo+6 susp+2|Ficaram revoltados e passaram a me proteger.','Levar à polícia|susp-2|Registraram a ocorrência.','Contratar segurança|$-8000 seg+1|Dois armários de terno me seguem agora.']],
  ['Pichação no templo','Picharam "assassino" na fachada do templo de {seita}.',['Pintar por cima e seguir|caixa-1000|Pintei. Picharam de novo na semana seguinte.','Fazer vigília na porta|devo+5 inim-1|Os fiéis passaram a noite em oração. O pichador não voltou.']],
  ['Ex-fiel quer conversar','Um ex-fiel que te odeia pede para conversar pessoalmente.',['Aceitar|?50 inim-1 k+4|Choramos os dois. Ele foi embora em paz.|hl-10|Era emboscada. Levei um soco e saí correndo.','Recusar|h+0|Não vou cair nessa.']],
  ['Pesadelos','Você não consegue dormir pensando em quem pode estar querendo te matar.',['Terapia escondida|$-2000 h+6|Ninguém pode saber que o profeta faz terapia.','Mais rituais|devo+4 h-4|Os fiéis me viram com olheiras.']],
  ['Faca no correio','Chegou uma caixa no templo com uma faca enferrujada e uma foto sua, riscada.',['Transformar em sermão|devo+8 sfama+4|"Eles têm medo da verdade." O culto lotou.','Contratar segurança|$-8000 seg+1|Não vou esperar a segunda caixa.','Fingir que não ligou|h-5|Por dentro, eu tremia.']],
]);
// ---------- rival ----------
pack({k:'Religião',w:1.4,cd:6,min:18,when:SL(s=>!!s.rival)},[
  ['Fiéis trocando de lado','Uma família inteira de {seita} foi para {rival}.',['Ir buscar pessoalmente|?lk fieis+4 devo+3|Voltaram, envergonhados.|h-4|Bateram a porta na minha cara.','Deixar ir|devo-2|Quem sai não era fiel de verdade.']],
  ['Debate na TV','Uma TV local quer um debate entre você e o líder de {rival}.',['Aceitar|?sm sfama+8 rival-15|Venci o debate. A audiência explodiu.|sfama-4 rival+10|Fui massacrad{o} ao vivo.','Recusar|rival+5|Disseram que eu fugi.']],
  ['Templo vizinho','{rival} abriu um templo a duas quadras do seu.',['Culto no mesmo horário, com som mais alto|devo+4 susp+3|Guerra de alto-falantes.','Café da manhã grátis no domingo|caixa-3000 fieis+6|Pão com manteiga converte.']],
  ['Espião rival','Você descobriu que um fiel novo é espião de {rival}.',['Expulsar em público|devo+5 inim+1|Saiu escoltado e jurou vingança.','Passar informação falsa por ele|?sm rival-12|Eles caíram direitinho.|h-2|Ele percebeu e sumiu.']],
  ['Acordo de cavalheiros','O líder de {rival} propõe dividir a cidade: cada um prega no seu território.',['Aceitar|rival-5 inim-1|Trégua assinada num guardanapo.','Recusar|rival+5 devo+3|A cidade inteira é minha por direito divino.']],
]);
// ---------- membro perto do líder ----------
pack({k:'Religião',w:1.4,cd:6,min:18,when:SM2(s=>(s.conf||0)>=60)},[
  ['Segredo do líder','{lider} confessou, depois de umas taças de vinho, que já não acredita em nada do que prega.',['Guardar o segredo|conf+10 sxp+3|Agora sou parte do segredo.','Gravar escondido|?50 sprova|Gravei tudo.|conf-30|{lider} viu o celular.']],
  ['A senha do cofre','{lider} te passou a senha do cofre do templo.',['Nunca abrir sem ordem|conf+8|A confiança aumentou.','Pegar um pouco|?60 $+15000 k-8|Ninguém percebeu.|conf-40 srebaixa|Perceberam.']],
  ['Conversa no corredor','Você ouviu dois pastores tramando contra {lider}.',['Contar para {lider}|conf+20 sxp+5|Os dois foram expulsos, e eu herdei o prestígio deles.','Entrar na trama|sconsp|Agora faço parte do complô.','Fingir que não ouviu|h+0|Melhor não me meter.']],
  ['Herdeiro','{lider} diz, em particular, que pensa em você como sucessor.',['Agradecer com humildade|conf+10 fe+5|Vi um brilho de orgulho nos olhos do velho.','Perguntar quando|conf-15|Pergunta errada. O clima esfriou na hora.']],
]);
// ---------- grupo secreto da deep web ----------
pack({k:'Religião',w:1.5,cd:5,min:18,when:SM2(s=>!!s.secreta)},[
  ['Reunião à meia-noite','O grupo secreto se reúne num túnel abandonado, à luz de velas.',['Ir|fe+6 sxp+3 hl-2|Cânticos e um frio que não vinha do túnel.','Faltar|conf-5|Notaram a minha ausência.']],
  ['Envelope lacrado','Pedem que você entregue um envelope lacrado num endereço desconhecido.',['Entregar sem perguntar|sxp+5 conf+5|Uma mão saiu pela fresta da porta e pegou o envelope.','Abrir o envelope|?50 sprova|Fotos, nomes e endereços. Guardei uma cópia.|conf-25|Me viram abrindo.']],
  ['Senha nova','O grupo trocou todas as senhas do canal criptografado, e você não recebeu a nova.',['Perguntar ao líder|?50 conf+5|Foi só um esquecimento.|conf-10|"Ainda estamos avaliando você."','Esperar em silêncio|fe-4|Três dias sem notícia. Pareceram três anos.']],
  ['Teste de lealdade','O líder pede que você corte contato com a sua família por um ano.',['Obedecer|fe+10 conf+15 h-8|Meus pais choraram no telefone. Desliguei.','Recusar|conf-20 sxp-3|"A família é a corrente que te prende."']],
]);
