// ===== Eventos com animais, por tipo =====
const petsOf=fn=>()=>R.pick(people('pet').filter(p=>{ const d=petDef(p); return fn(d,p); }));
Object.assign(WHO,{
  dog:petsOf(d=>d.grp==='Cães'), cat:petsOf(d=>d.grp==='Gatos'), bird:petsOf(d=>d.grp==='Aves'), reptile:petsOf(d=>d.grp==='Répteis'),
  exotic:petsOf(d=>d.ex), danger:petsOf(d=>d.dng), farm:petsOf(d=>d.grp==='Fazenda'), small:petsOf(d=>d.grp==='Pequenos'),
  oldpet:petsOf((d,p)=>p.life&&p.age>=p.life-2), monkey:petsOf(d=>/Macaco/.test(d.s)), bigcat:petsOf(d=>/Tigre|Leão/.test(d.s)),
});
pack({k:'Bicho',who:'dog'},[
 ['Passeio no parque','{p} está louc{o2} para passear no parque.',['Levar para correr|bond+6 hl+2 h+3|{p} voltou exaust{o2} e feliz.','Deixar no quintal|bond-3|{p} ficou olhando o portão a tarde toda.']],
 ['Chocolate!','{p} comeu uma barra de chocolate inteira que estava na mesa.',['Correr para o veterinário|$-800 bond+4|Lavagem estomacal. {p} está bem.','Esperar para ver|?50|{p} ficou bem.|petdie|{p} não resistiu.']],
 ['Carteiro','{p} late furiosamente para o carteiro todo dia.',['Contratar um adestrador|$-1200 bond+4|{p} agora só abana o rabo para o carteiro.','Deixar assim|h-1|O carteiro joga as cartas por cima do muro.']],
 ['Concurso de cães','Vai ter um concurso de cães na cidade.',['Inscrever {p}|?45 $1000 f+1 h+8|{p} ganhou o primeiro lugar!|h+2|{p} tentou morder o jurado.','Desistir|h+0|{p} não precisa de troféu.','Pintar o pelo de {p} para ficar diferente|?35 $1000 f+2 h+6|O júri amou o visual!|bond-4 h-3|Fomos desclassificados e {p} ficou irritad{o2}.']],
 ['Cachorro na cama','{p} decidiu que agora dorme na minha cama.',['Deixar|bond+6 h+3|Durmo espremid{o}, mas feliz.','Colocar limites|bond-2|{p} chorou na porta a noite inteira.']],
 ['Fuga pelo portão','O portão ficou aberto e {p} saiu correndo pela rua.',['Correr atrás|?70 bond+4|Peguei {p} no quarteirão de baixo.|h-10|{p} sumiu.','Chamar pelo nome|?55 bond+3|{p} voltou abanando o rabo.|h-10 petgone|{p} não voltou.']],
]);
pack({k:'Bicho',who:'cat'},[
 ['Presente felino','{p} deixou um passarinho morto no meu travesseiro.',['Agradecer o presente|bond+5|É amor, à maneira dos gatos.','Dar bronca|bond-4|{p} me ignorou por três dias.']],
 ['Sofá destruído','{p} transformou o sofá novo em arranhador.',['Comprar um arranhador de verdade|$-300 bond+3|O sofá foi salvo. Mais ou menos.','Aceitar o destino do sofá|h-3|O sofá agora é dele.']],
 ['Sumiu por três dias','{p} sumiu e não volta há três dias.',['Procurar pelo bairro|?65 bond+6|{p} estava preso numa garagem.|h-10|Nunca mais vi {p}.','Esperar|?55 bond+2|{p} voltou como se nada tivesse acontecido.|h-10 petgone|{p} não voltou.']],
 ['Copo na mesa','{p} está olhando fixamente para um copo cheio na beira da mesa.',['Tirar o copo dali|h+1|Desafio evitado.','Pagar para ver|h-1|O copo caiu. {p} nem piscou.']],
]);
pack({k:'Bicho',who:'bird'},[
 ['Papagaio falador','{p} aprendeu uma palavra nova e repete o dia inteiro: "{palavra2}".',['Ensinar outras palavras|bond+5 h+3|Agora {p} canta o hino do meu time.','Achar graça|h+3|As visitas morrem de rir.']],
 ['Janela aberta','A janela ficou aberta e {p} voou para fora.',['Chamar com assovio|?50 bond+5|{p} voltou e pousou no meu ombro!|h-8|{p} foi embora para sempre.','Desistir e comprar outro|k-3 h-4|{p} sumiu de vez.','Espalhar cartazes pelo bairro|?70 $-50 bond+6|Um vizinho devolveu!|h-6|Ninguém viu.']],
]);
pack({k:'Bicho',who:'reptile'},[
 ['Fuga do terrário','{p} escapou do terrário durante a noite.',['Revirar a casa|?70 h+2|Achei {p} dentro do sapato.|h-6|Ainda não achei. A vizinha está desconfiada.','Chamar um especialista|$-500 ?90 bond+3|Achou em dez minutos.|h-4|Nem o especialista achou.','Fingir que nada aconteceu|k-2 h-2|Se a vizinha encontrar, o problema é dela.']],
 ['Troca de pele','{p} está trocando de pele e parece estranh{o2}.',['Aumentar a umidade do terrário|bond+4|A troca foi perfeita.','Puxar a pele velha com a mão|?40 bond+1|Saiu inteira!|bond-6 hl-1|{p} me mordeu.','Deixar acontecer sozinho|h+0|Demorou, mas foi.']],
]);
pack({k:'Perigo',who:'danger',w:1.6},[
 ['Instinto selvagem','{p} ficou agressiv{o2} de repente e avançou em mim.',['Me proteger|?60 hl-5|Escapei com alguns arranhões.|hl-25|Fui ferid{o} gravemente e fui parar no hospital.','Doar para um santuário|petgone k+2|{p} foi morar num santuário de animais.']],
 ['Visita apavorada','Uma visita encontrou {p} solto pela sala e desmaiou.',['Pedir desculpas|h-3|A visita nunca mais voltou.','Rir da situação|k-2 h+2|Virou a história favorita das festas de família.']],
 ['Fiscalização ambiental','Agentes ambientais vieram verificar a documentação de {p}.',['Mostrar a licença|?40|Estava tudo em ordem.|$-v petgone|Multa de {v} e apreensão do animal.','Esconder {p}|?40|Não acharam.|$-v2 petgone|Acharam. Multa pesada de {v2}.'],{v:[5000,30000]}],
]);
pack({k:'Bicho',who:'exotic'},[
 ['Celebridade do bairro','{p} virou atração do bairro. Todo mundo quer tirar foto.',['Cobrar pelas fotos|$v h+3|Ganhei {v} num fim de semana.','Deixar de graça|follow+500 h+4|{p} viralizou nas redes.'],{v:[100,1500]}],
 ['Veterinário especializado','{p} precisa de um veterinário de animais silvestres.',['Pagar o especialista|$-v bond+6|{p} ficou ótim{o2}.','Ir ao veterinário comum|?40|Deu certo.|petdie|{p} não resistiu.'],{v:[1000,8000]}],
]);
pack({k:'Bicho',who:'monkey'},[
 ['Macaco ladrão','{p} roubou o celular do vizinho e subiu no telhado.',['Negociar com uma banana|?70 h+4|Troca feita. Celular devolvido.|$-2000|O celular caiu do telhado. Paguei um novo.','Correr atrás pelo telhado|?40 h+3|Peguei o celular!|hl-8 h-4|Caí e torci o pé.','Deixar o celular com ele|$-2000 h-2|Agora {p} tem um celular melhor que o meu.']],
]);
pack({k:'Perigo',who:'bigcat'},[
 ['Rugido na madrugada','{p} rugiu tão alto que os vizinhos chamaram a polícia.',['Explicar que é um animal de estimação|?30 h-2|A polícia foi embora, assustada.|$-v petgone|O animal foi apreendido e eu fui multad{o}.','Esconder o animal no banheiro|?50 h-2|A polícia não achou nada.|$-v petgone arrest:posse_ilegal_de_animal_silvestre:0:2|Acharam. Fui detid{o}.','Entregar o animal ao zoológico|petgone k+4 h-6|Foi a melhor decisão para todos.'],{v:[20000,80000]}],
]);
pack({k:'Bicho',who:'farm'},[
 ['Produção do sítio','{p} está dando trabalho e alegria no quintal.',['Cuidar com carinho|bond+5 h+4|Que vida boa de interior.','Vender a produção|$500 h+2|Vendi tudo na feira.','Deixar o sítio por conta|bond-5 h-1|Os bichos ficaram largados.']],
 ['Corrida no rodeio','Vai ter uma prova no rodeio da cidade.',['Inscrever {p}|?40 $3000 f+1|{p} ganhou a prova!|h-2|{p} empacou na largada.','Apostar contra {p}|?55 $1500 k-3|Ganhei a aposta. {p} perdeu.|$-500|{p} ganhou e eu perdi a aposta.','Desistir|h+0|{p} merece descansar.'],{when:m=>people('pet').some(p=>/Cavalo/.test(p.species))}],
]);
pack({k:'Bicho',who:'oldpet',w:1.6},[
 ['Velhinh{o2}','{p} está ficando velhinh{o2}, dorme o dia inteiro.',['Dar todo o conforto|bond+8 $-500|Comprei uma caminha ortopédica.','Levar para um check-up|$-400 bond+5|O veterinário disse que {ele} está bem para a idade.']],
 ['Despedida','O veterinário disse que {p} está sofrendo muito.',['Ficar com {p} até o fim|petdie h-12|Segurei {p} no colo até o último momento.','Tentar um tratamento caro|$-v ?30 bond+8|{p} ganhou mais um tempo!|petdie h-12|Não deu.'],{v:[2000,10000]}],
]);
pack({k:'Bicho',who:'small'},[
 ['Rodinha a noite toda','{p} corre na rodinha a noite inteira e não me deixa dormir.',['Mudar a gaiola de lugar|h+2|Silêncio, enfim.','Aceitar|hl-1|Durmo ouvindo nhec-nhec.']],
 ['Fuga pela casa','{p} escapou da gaiola e está escondid{o2} em algum lugar.',['Procurar com petiscos|?75 bond+3|Achei atrás do armário.|h-6|Sumiu de vez.','Desistir de procurar|k-2 h-4|Talvez apareça um dia.','Pôr armadilha com comida|?60 bond+1|Funcionou!|bond-5|Pegou o gato do vizinho.']],
]);
