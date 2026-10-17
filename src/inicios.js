// ===== Começos dos modos fictícios: histórias maiores e sorteadas, e cada uma muda o que você tem no começo =====
POWERS.push('controlar a eletricidade','regeneração','teletransporte','controlar plantas','grito sônico','elasticidade','controlar sombras','magnetismo','encolher','visão de raio X');
Object.assign(CODI,{'controlar a eletricidade':['Voltagem','Curto-Circuito','Faísca Azul'],'regeneração':['Imortal','Fênix Cinzenta','Remendo'],'teletransporte':['Salto','Atalho','Piscar'],
  'controlar plantas':['Ipê','Raiz','Hera'],'grito sônico':['Sirene','Trovão','Eco Vermelho'],'elasticidade':['Borracha','Mola','Estica'],'controlar sombras':['Breu','Eclipse','Penumbra'],
  'magnetismo':['Ímã','Polo Norte','Ferrugem'],'encolher':['Formiga','Grão','Miúdo'],'visão de raio X':['Lupa','Olho de Vidro','Raio-X']});
const VIL2=['Doutora Vespertina','O Cobrador','Senhor Fumaça','A Engenheira','Cabeça de Bronze'];
VILOES.push(...VIL2);
// cada começo: título, história, efeitos (itens, grupo, atributos)
const INICIOS={
 zumbi:[
  {k:'hospital',tt:'O plantão que nunca acabou',t:'Você estava no hospital visitando alguém quando o primeiro paciente "morreu" e levantou da maca. Em vinte minutos, os corredores viraram um matadouro. Você se trancou na farmácia com uma enfermeira que não parava de rezar e um segurança com o braço quebrado. Três dias depois, a cidade estava em silêncio. Vocês saíram pela garagem numa ambulância, com a sirene desligada e os bolsos cheios de remédio.',
   fx:sc=>{ sc.veh[1]={k:'ambulancia',hp:rnd(60,85)}; ['kit','antib','analg','calm'].forEach(i=>addItem(i,null,true)); mkCrew({role:'med'}); }},
  {k:'quartel',tt:'O último pelotão',t:'O exército montou uma barreira na avenida e prometeu que estava tudo sob controle. Você estava na fila do abrigo quando a barreira caiu. No meio da correria, um sargento ferido te entregou a pistola dele e disse uma única palavra: "corre". Você correu. No pátio do quartel abandonado, achou um jipe com meio tanque, uma caixa de munição e dois soldados que tinham perdido a fé em tudo, menos em você.',
   fx:sc=>{ sc.veh[1]={k:'jipe',hp:rnd(65,90)}; ['muni','muni','racao','colete'].forEach(i=>addItem(i,null,true)); sc.arma={id:'pistola',hp:rnd(60,85)}; mkCrew({role:'ati'}); }},
  {k:'shopping',tt:'Fechados no shopping',t:'Era sábado e você só tinha ido comprar um tênis. Quando as portas de aço desceram, ninguém entendeu nada. Do lado de fora, as mãos batiam no vidro. Do lado de dentro, quarenta pessoas viraram vinte, depois dez, depois só o seu grupo. Vocês viveram duas semanas de praça de alimentação e loja de brinquedos até a comida acabar. A saída foi pelo estacionamento, numa picape do segurança, com o porta-malas cheio de doce.',
   fx:sc=>{ ['doce','doce','salgadinho','violao','lanterna'].forEach(i=>addItem(i,null,true)); sc.arma={id:'taco',hp:rnd(60,90)}; }},
  {k:'presidio',tt:'As grades abriram sozinhas',t:'Você estava preso por um erro, ou nem tão erro assim. Na noite em que a energia caiu, as celas destravaram e os guardas sumiram. Alguns presos fugiram rindo. Outros não chegaram ao portão. Você saiu com dois companheiros de cela que não confiam em ninguém, um estilete feito de escova de dente e uma regra simples: ninguém fica para trás, mas ninguém manda em você.',
   fx:sc=>{ crew().forEach(c=>c.lv=Math.max(35,c.lv-12)); mkCrew({role:'bat',lv:60}); sc.arma={id:'estilete',hp:90}; addItem('faca',null,true); S.me.fight=clamp(S.me.fight+3); }},
  {k:'casamento',tt:'O casamento que virou pesadelo',t:'Você era convidad{o} num casamento no interior. O padrinho chegou atrasado, pálido, com uma mordida no pescoço. Na hora da valsa, ele mordeu a noiva. A festa virou correria entre mesas de doce e o padre tocando o sino sem parar. Você fugiu na van do bufê com o fotógrafo, a cozinheira e um tio bêbado que, por incrível que pareça, sabia atirar.',
   fx:sc=>{ sc.veh[1]={k:'van',hp:rnd(55,80)}; ['doce','arroz','lata','lata'].forEach(i=>addItem(i,null,true)); mkCrew({role:'coz'}); }},
  {k:'escola',tt:'A escola virou fortaleza',t:'A escola foi o abrigo oficial do bairro por onze dias. Carteiras viraram barricadas, a quadra virou dormitório e a merendeira virou general. No décimo segundo dia, uma janela quebrou durante a madrugada. Você saiu na van escolar com quem conseguiu salvar, alguns livros da biblioteca e um mapa da cidade arrancado da parede da sala de geografia.',
   fx:sc=>{ sc.veh[1]={k:'van',hp:rnd(55,80)}; ['livro','mapa','baralho','miojo'].forEach(i=>addItem(i,null,true)); mkCrew({role:'pro'}); }}],
 ilha:[
  {k:'aviao',tt:'O voo que não chegou',t:'O piloto anunciou turbulência e pediu calma. Depois, só o barulho do metal se partindo. Você acordou boiando, agarrad{o} a uma mala que não era sua, com gosto de sal e querosene na boca. A correnteza te levou até uma praia branca, sem pegadas, sem barulho de carro, sem ninguém. Na mala, roupas de outra pessoa e algumas coisas que talvez salvem sua vida.',
   fx:sc=>{ ['isqueiro','livro'].forEach(i=>addItem(i,null,true)); }},
  {k:'cruzeiro',tt:'O cruzeiro afundou',t:'Era para ser uma semana de bufê livre e show de mágica no navio. Na terceira noite, uma tempestade virou o casco como um brinquedo. Você pulou num bote salva-vidas com outras pessoas de pijama e ninguém sabia remar. Dois dias depois, o bote encalhou numa ilha. O resto do navio, e do mundo, ficou para trás.',
   fx:sc=>{ mkCrew(); mkCrew(); ['biscoito','biscoito','kit','sinal'].forEach(i=>addItem(i,null,true)); }},
  {k:'iate',tt:'A festa no iate',t:'Um amigo rico te chamou para uma festa num iate. Champanhe, música alta e ninguém olhando o radar. O iate bateu num recife de madrugada. Quando o sol nasceu, você estava sozinh{o} numa praia, ainda de roupa de festa, com uma garrafa vazia na mão e a caixa de emergência do barco ao seu lado, meio enterrada na areia.',
   fx:sc=>{ ['kit','faca','shake','corda','sinal'].forEach(i=>addItem(i,null,true)); scStat('san',-8); }},
  {k:'pesca',tt:'A pescaria que deu errado',t:'Você foi pescar em alto mar com um barqueiro que jurava conhecer aquelas águas. O motor morreu, o rádio também, e a correnteza fez o resto. Depois de três dias à deriva, o barco se partiu nas pedras de uma ilha. O barqueiro sobreviveu, resmungando. Ele sabe pescar com qualquer coisa, mas não sabe pedir desculpas.',
   fx:sc=>{ mkCrew({role:'pes'}); ['corda','faca','peixe','peixe'].forEach(i=>addItem(i,null,true)); }},
  {k:'reality',tt:'O reality show acabou de verdade',t:'Você foi selecionad{o} para um reality de sobrevivência: um mês numa ilha, câmeras escondidas e prêmio milionário. Na primeira noite, um furacão arrastou o barco da produção. As câmeras continuam piscando nas árvores, mas ninguém está assistindo. Você tem o kit do programa e um adversário que agora é o seu único colega.',
   fx:sc=>{ mkCrew({role:'esc'}); ['lona','isqueiro','faca','agua'].forEach(i=>addItem(i,null,true)); }}],
 isekai:[
  {k:'caminhao',tt:'O caminhão de sempre',t:'Um caminhão desgovernado, uma luz branca e um silêncio enorme. Quando você abriu os olhos, estava num campo com dois sóis no céu e uma janela azul flutuando na sua frente: "Bem-vind{o} a Eldoria. Status: herói. Nível 1." Uma deusa entediada apareceu por três segundos, disse "boa sorte", e sumiu. Pelo menos ela deixou umas moedas.',
   fx:sc=>{ sc.ouro+=30; }},
  {k:'invocado',tt:'Invocad{o} pelos magos',t:'Você estava no banho quando o chão virou um círculo de luz. Caiu, molhad{o} e de toalha, no meio de um salão cheio de magos de túnica. "O herói da profecia!", gritou o mais velho. Eles te vestiram, te deram uma espada élfica e uma bolsa de ouro, e explicaram que o reino inteiro depende de você. Ninguém perguntou se você queria.',
   fx:sc=>{ sc.arma={id:'espadaelf',hp:90}; sc.ouro+=120; scStat('san',-5); }},
  {k:'metro',tt:'A porta errada do metrô',t:'Você desceu na estação de sempre, mas a porta do vagão abriu para uma floresta. Quando olhou para trás, o trem já tinha sumido. Você chegou em Eldoria com a mochila do trabalho: uma lanterna, um isqueiro e um livro pela metade. Os moradores acham que a lanterna é magia. Você não vai corrigir ninguém.',
   fx:sc=>{ ['lanterna','isqueiro','livro'].forEach(i=>addItem(i,null,true)); sc.ouro+=10; }},
  {k:'renascido',tt:'Renasci como filh{o} de mercador',t:'Você morreu dormindo, sem drama. Acordou num berço de Eldoria, com memórias de outra vida. Cresceu numa família de mercadores ricos, aprendeu a ler mapas antes de andar e a pechinchar antes de falar. Aos dezoito anos, pegou a herança, uma adaga da família e partiu atrás do Rei Demônio. Seus pais acham que é uma fase.',
   fx:sc=>{ sc.ouro+=280; sc.arma={id:'adaga',hp:85}; if(sc.at) sc.at.agi+=2; }},
  {k:'abencoado',tt:'A bênção da deusa',t:'Um raio. Uma luz dourada. Uma deusa de verdade, dessa vez preocupada: "O Rei Demônio está forte demais. Vou te dar um empurrão." Você acordou em Eldoria já sabendo lutar, com o corpo leve e a mana correndo nas veias. A janela de status piscava em dourado: "Abençoad{o}". Os sacerdotes do templo quase desmaiaram quando viram.',
   fx:sc=>{ sc.lvl=3; sc.hl=100; sc.mana=100; if(sc.at){ sc.at.mag+=3; sc.at.vit+=2; } sc.pts=(sc.pts||0)+3; addItem('pocao',null,true); }},
  {k:'gamer',tt:'Game over, game start',t:'Você estava há trinta horas jogando sem parar quando a tela ficou branca. Acordou dentro de um jogo que nunca tinha visto, mas que parecia estranhamente familiar. Você sabe exatamente onde ficam os baús escondidos, ou acha que sabe. Na primeira hora, já tinha achado um cristal de mana atrás de uma cachoeira.',
   fx:sc=>{ addItem('cristal',null,true); addItem('mana',null,true); if(sc.at) sc.at.mag+=2; }}],
 heroi:[
  {k:'raio',tt:'O raio no laboratório',t:'Uma tempestade, um laboratório de física e um raio que entrou pela janela e atravessou você. Os médicos disseram que era impossível sobreviver. Três dias depois, você descobriu que podia {poder}. Ninguém sabe ainda, nem a sua família. Na cidade, {inimigo} começa a aparecer nos jornais, e você sente que um dia vocês vão se encontrar.',
   fx:sc=>{ }},
  {k:'meteorito',tt:'A pedra que caiu do céu',t:'Um meteorito do tamanho de uma bola de gude caiu no seu quintal. Você pegou com a mão. Doeu como fogo e depois parou. Na manhã seguinte, conseguia {poder}, e com uma força que te assustou. O poder veio forte demais e cedo demais. Do outro lado da cidade, {inimigo} também recebeu um pedaço daquela pedra.',
   fx:sc=>{ scStat('pw',15); scStat('san',-8); }},
  {k:'experimento',tt:'Cobaia do governo',t:'Era só um estudo clínico pago: duas semanas num laboratório do governo, comendo bem e assinando papéis. Ninguém leu os papéis. No décimo dia, você acordou capaz de {poder}. Fugiu pela janela do banheiro. O governo sabe quem você é e quer você de volta. A sua identidade secreta já nasce frágil.',
   fx:sc=>{ scStat('pw',8); scStat('sec',-25); addItem('gadget',null,true); }},
  {k:'heranca',tt:'O sótão da avó',t:'Depois do enterro da sua avó, você achou no sótão um traje antigo, remendado e dobrado com cuidado, e uma carta: "Agora é a sua vez". Na mesma noite, aprendeu a {poder}. Sua avó foi heroína por quarenta anos e ninguém da família sabia. Ela deixou um traje, alguns contatos e um inimigo que nunca foi preso: {inimigo}.',
   fx:sc=>{ sc.traje=Math.max(sc.traje||0,1); scStat('rep',10); scStat('pista',15); }},
  {k:'acidente',tt:'O caminhão-tanque',t:'Um caminhão-tanque com uma carga sem rótulo tombou na frente do seu ônibus. Você ajudou a tirar as pessoas antes da explosão e ficou ensopad{o} de um líquido verde. Virou notícia como "cidadão herói". Uma semana depois, descobriu que podia {poder}. A cidade já gosta de você, mas as câmeras também.',
   fx:sc=>{ scStat('rep',20); scStat('sec',-10); S.me.fame=clamp(S.me.fame+5); }},
  {k:'alien',tt:'Não é deste planeta',t:'Seus pais te contaram no seu aniversário, com a voz tremendo: você foi encontrad{o} bebê numa cápsula de metal num milharal. Você sempre achou estranho nunca ter ficado doente. Naquela noite, o poder acordou de vez: você pode {poder}. E, pela primeira vez, sentiu que alguém lá em cima estava procurando por você.',
   fx:sc=>{ scStat('pw',12); sc.hl=100; }}],
 marte:[
  {k:'oficial',tt:'A missão oficial',t:'Você passou seis anos treinando para isso: centrífugas, simuladores, provas e mais provas. Foi escolhid{o} entre milhares. A decolagem foi a coisa mais barulhenta que você já ouviu; o pouso, a mais silenciosa. Agora são você, a equipe e um habitat inflável numa planície vermelha. A nave de resgate chega no sol 30. Até lá, tudo depende de vocês.',
   fx:sc=>{ addItem('remendo',null,true); }},
  {k:'turista',tt:'O pacote turístico mais caro do mundo',t:'Você ganhou num sorteio uma vaga de "turista espacial" numa missão de verdade. A equipe não ficou feliz: você ocupa o lugar de um cientista e não sabe nem fechar o traje sozinh{o}. No primeiro sol, você vomitou dentro do capacete. No segundo, descobriu que a nave de volta só vem em trinta. Vai ter que aprender rápido.',
   fx:sc=>{ crew().forEach(c=>c.lv=Math.max(30,c.lv-15)); ['liof','liof','calm','foto'].forEach(i=>addItem(i,null,true)); }},
  {k:'clandestino',tt:'Clandestin{o} na carga',t:'Você se escondeu num contêiner de carga, com três garrafas de água e muita coragem. Ninguém sabe como você sobreviveu à viagem. Quando abriram o contêiner em Marte, a equipe ficou dividida entre te abraçar e te jogar pela câmara de descompressão. Você come a comida deles e respira o oxigênio deles. Precisa provar que vale a pena.',
   fx:sc=>{ crew().forEach(c=>c.lv=Math.max(25,c.lv-22)); scStat('o2',-15); ['agua','pecas'].forEach(i=>addItem(i,null,true)); }},
  {k:'cientista',tt:'Cientista convidad{o}',t:'Você passou a vida estudando rochas marcianas por fotografia. Quando finalmente te convidaram para ir até lá, você chorou na frente da banca. Trouxe na bagagem um microscópio de mão, cadernos cheios de hipóteses e uma pergunta que te persegue desde criança: houve vida em Marte? Você tem trinta sóis para descobrir.',
   fx:sc=>{ scStat('ciencia',12); S.me.smarts=clamp(S.me.smarts+3); addItem('livro',null,true); }},
  {k:'reality',tt:'O reality de Marte',t:'Era um reality show: "Quem ficar mais tempo em Marte ganha". Bilhões de pessoas assistiam. No sol 3, o sinal com a Terra caiu e o programa saiu do ar. Agora não tem plateia, só uma equipe de desconhecidos que você conheceu num palco com fumaça colorida. O prêmio virou outro: voltar para casa.',
   fx:sc=>{ S.me.fame=clamp(S.me.fame+8); mkCrew({age:rnd(22,35)}); scStat('san',-6); }}],
};
const PODER_FRASE={'superforça':'levantar um carro com uma mão só','invisibilidade':'ficar invisível','telecinese':'mover coisas com a mente','supervelocidade':'correr mais rápido que um carro','regeneração':'se curar de qualquer ferimento','teletransporte':'se teletransportar','grito sônico':'gritar tão alto que o concreto racha','elasticidade':'esticar o corpo como borracha','magnetismo':'controlar metais com a mente','encolher':'encolher até o tamanho de uma formiga','visão de raio X':'enxergar através das paredes'};
const INI_TT=t=>t.replace(/\{o\}/g,oa()).replace(/\{a\}/g,S.me.gender==='F'?'a':'');
scStart=(o=>function(id){ const vs=INICIOS[id], fv=typeof INI_FORCE!=='undefined'&&INI_FORCE&&vs?vs.find(x=>x.k===INI_FORCE):null, v=fv||(vs?R.pick(vs):null); const r=o.apply(this,arguments); const sc=S.scen; if(!v||!sc||sc.id!==id) return r;
  try{ v.fx&&v.fx(sc); }catch(e){ cadFalha(e,'Efeito do início fictício'); }
  sc.inicio=v.k;
  const txt=INI_TT(v.t).replace(/\{poder\}/g,PODER_FRASE[sc.poder]||sc.poder||'').replace(/\{inimigo\}/g,sc.inimigo||'').replace(/\{codinome\}/g,sc.codinome||'');
  if(sc.log[0]&&sc.log[0].lines.length) sc.log[0].lines[0]={t:txt,c:'warn'};
  const inv=sc.inv.map(x=>itIc(x.id)+' '+itN(x.id)), extra=[];
  if(sc.arma) extra.push(`Arma: ${itIc(sc.arma.id)} ${itN(sc.arma.id)}`);
  if(id==='heroi') extra.push(`Poder: ${sc.poder} · domínio ${sc.pw}%`,`Codinome: ${sc.codinome}`,`Arqui-inimigo: ${sc.inimigo}`);
  if(id==='isekai') extra.push(`Ouro: ${sc.ouro} moedas · nível ${sc.lvl}`);
  if(crew().length) extra.push(`Grupo: ${crew().map(c=>c.first).join(', ')}`);
  if(id==='zumbi'&&sc.veh.length) extra.push(`Veículos: ${sc.veh.map(x=>VEH[x.k][1]+' '+VEH[x.k][0]).join(', ')}`);
  MQ.unshift({k:SCEN[id].n,t:INI_TT(v.tt),x:[txt,extra.concat(inv.length?[`Começo com: ${inv.join(', ')}`]:[]).join('\n')].filter(Boolean).join('\n\n')});
  return r; })(scStart);
