// Copa do Mundo e Olimpíadas mexem com o mundo inteiro, mesmo para quem não é atleta:
// resultados no noticiário, humor do país, apostas, crimes, viagens, empregos temporários e tensões entre países.
const OLIMP_MEDALHAS={US:110,GB:60,FR:55,JP:45,IT:40,DE:35,KR:30,CA:25,ES:20,BR:20,IN:7,MX:5,AR:4,PT:4,AO:0};
function torneioCampeao(){const pool=COPA_RIVAIS.concat(Object.entries(COPA_FORCA).map(([id,f])=>[COPA_NOMES[id],f]));return R.wpick(pool.map(([n,f])=>[n,Math.exp((f-80)/3.5)]));}
function torneioPaisResultado(f){const passa=R.chance(Math.max(.15,Math.min(.95,.5+(f-78)/25)));if(!passa)return 'eliminado na fase de grupos';
 const fases=['oitavas','quartas','semifinais','final'];for(const fs of fases){if(!R.chance(Math.max(.1,Math.min(.85,.45+(f-82)/30))))return fs==='final'?'vice-campeão':'eliminado nas '+fs;}return 'campeão';}
function grandesEventosMundo(){const m=S.me;S.torneios||(S.torneios={});
 if(copaAno()&&!S.torneios['copa'+S.year]){const meu=(m.copas||[]).find(c=>c.ano===S.year&&!/fora|cortado/.test(c.resultado));
  const pais=COPA_NOMES[m.country]||countryOf(m.country).n,f=COPA_FORCA[m.country]??65,res=meu?meu.resultado:torneioPaisResultado(f);
  const campeao=res==='campeão'?pais:(()=>{let c=torneioCampeao();while(c===pais)c=torneioCampeao();return c;})();
  S.torneios['copa'+S.year]={campeao,pais,res,sede:copaSede()};
  log(`Copa do Mundo de ${S.year}: ${campeao} é campeã do mundo. ${campeao===pais?'':`A seleção de ${pais} terminou ${res}.`}`,'big');
  if(res==='campeão'){st('happy',8);people().filter(p=>p.alive).forEach(p=>p.bond=clamp(p.bond+1));log('O país parou para comemorar o título. Carreata, fogos e ninguém trabalhou no dia seguinte.','good');}
  else if(/semifinais|vice/.test(res)){st('happy',-3);log('A eliminação doeu no país inteiro. Silêncio nos bares por uma semana.','warn');}}
 if(olimpAno()&&!S.torneios['olimp'+S.year]){const base=OLIMP_MEDALHAS[m.country]??3,med=Math.max(0,Math.round(base*(.8+R.f()*.4))),ouros=Math.round(med*.32);
  const lider=R.wpick([['Estados Unidos',6],['China',5],['Japão',1],['Grã-Bretanha',1]]);S.torneios['olimp'+S.year]={lider,med,ouros,sede:olimpSede()};
  log(`Olimpíadas de ${S.year}: ${lider} lidera o quadro de medalhas. ${countryOf(m.country).n} conquistou ${med} ${med===1?'medalha':'medalhas'}, ${ouros} de ouro.`,'big');
  if(ouros>=10)st('happy',3);}}
NL_GANCHOS_ANO.push(()=>{if(!S.scen)grandesEventosMundo();});
const ANO_COPA=m=>copaAno()&&!S.scen&&!m.prison, ANO_OLIMP=m=>olimpAno()&&!S.scen&&!m.prison;
const SEDE_AQUI=m=>{const t=copaAno()?copaSede():olimpAno()?olimpSede():'';return !!t&&t.includes(countryOf(m.country).n.split(' ')[0])&&!S.scen&&!m.prison;};
pack({k:'Copa do Mundo',w:3,cd:4,min:6,when:ANO_COPA},[
 ['A estreia da seleção','Hoje tem estreia na Copa. A rua inteira está pintada de verde e amarelo, ou das cores do meu país.',['Ver com a família|h+6|Todo mundo gritou junto no gol. Até a vó.','Ver no bar com os amigos|$-80 h+8|O bar tremeu a cada lance.','Nem ligar para futebol|h+0|Aproveitei a cidade vazia.']],
 ['O bolão da Copa','Organizaram um bolão para a Copa. Cada palpite custa pouco, o prêmio é de {v}.',['Entrar no bolão|$-50 ?15 $+v h+8|Acertei o placar da final e levei o bolão!|h-1|Errei quase tudo.','Ficar de fora|h+0|Não sou de bolão.'],{min:12,v:[500,4000]}],
 ['Apostas na Copa','Os sites de aposta estão em toda propaganda durante a Copa. Um amigo jura que tem um palpite certo.',['Apostar {v}|$-v ?38 $+v2 add.jogo+6|Bateu! Por enquanto.|add.jogo+4 h-6|Perdi o dinheiro e fiquei com vontade de recuperar.','Não apostar|k+1|Melhor guardar o dinheiro.'],{min:18,v:[200,3000]}],
 ['Briga no bar','No intervalo do jogo, um torcedor rival começou a provocar todo mundo no bar.',['Revidar|?fight hl-3 h+2|Ele saiu correndo antes da polícia chegar.|hl-10 arrest:briga_generalizada:0:1|A briga virou confusão e acabou na delegacia.','Mudar de bar|k+2|Futebol não vale um olho roxo.'],{min:16}],
 ['Camisas falsificadas','Um conhecido oferece um lote de camisas falsificadas da seleção para revender na porta do estádio.',['Vender as camisas|?60 $+v k-4|Vendi tudo antes do primeiro tempo.|arrest:venda_de_produto_falsificado:0:1 $-500|A fiscalização apreendeu tudo.','Comprar uma para mim|$-60 h+3|Igualzinha. Quase.','Recusar|k+2|Não quero problema.'],{min:16,v:[800,6000]}],
 ['A rua vazia','Durante o jogo da seleção, a rua fica deserta. Um conhecido diz que é a hora perfeita para entrar numa casa vazia.',['Topar o furto|?45 $+v k-12|Ninguém viu nada. Todo mundo estava olhando para a TV.|arrest:furto:1:3 k-12|O vizinho tinha câmera. Fui pres{o} no segundo tempo.','Ver o jogo como todo mundo|h+4|Não troco um gol por uma ficha criminal.'],{min:16,v:[2000,15000]}],
 ['Assaltaram minha casa','Enquanto eu via o jogo na casa de amigos, entraram na minha casa.',['Prestar queixa|$-v h-6|Levaram a TV e o videogame. A polícia disse que foi o terceiro caso da rua.','Ir atrás no bairro|?fight $-200 h+3|Achei a TV num brechó e recuperei.|hl-8 $-v|Levei um soco e não recuperei nada.'],{min:18,v:[1500,8000]}],
 ['O cambista','Um cambista oferece ingresso para o jogo da seleção, bem mais caro que o oficial.',['Comprar o ingresso|$-v ?40 h+12|Era verdadeiro! Vi o jogo do estádio.|h-8|Ingresso falso. Fiquei do lado de fora ouvindo a torcida.','Ver pela TV|h+2|A TV pelo menos tem replay.'],{min:16,v:[400,2500]}],
 ['Viajar para a Copa','Dá para ir até a sede da Copa e ver a seleção de perto.',['Ir para a Copa|$-v2 h+15 c:trips|Cantei o hino no estádio com milhares de pessoas. Inesquecível.','Ficar em casa|h+0|Um dia eu vou.'],{min:18,v:[3000,9000]}],
 ['Folga para o jogo','O jogo da seleção cai em horário de trabalho.',['Pedir para sair mais cedo|?55 h+6|A chefia liberou todo mundo e ainda pagou a pizza.|perf-4|Não liberaram, e eu fiquei vendo escondid{o} no celular.','Trabalhar normalmente|perf+4|Ouvi os gritos dos vizinhos a cada gol.'],{min:18,when:m=>!!m.job}],
 ['A escola parou','A escola colocou um telão no pátio para o jogo da seleção.',['Ver com a turma|h+8|Gritamos tão alto que a diretora riu junto.','Ficar na biblioteca|sm+2|Fui {o} únic{o} na biblioteca vazia.'],{min:6,max:17,when:m=>!!m.edu.cur}],
 ['Clima de guerra','O jogo contra um rival histórico virou assunto de política. Torcidas brigaram nas ruas e os governos trocaram acusações.',['Torcer em paz|h+2|Futebol é só futebol. Ou deveria ser.','Entrar na provocação nas redes|?50 f+2|Meu post viralizou.|k-4 h-4|Recebi ameaças de torcedores do outro país.','Organizar um encontro das duas torcidas|k+8 f+2|Abraços, troca de camisas e uma foto que rodou o mundo.'],{w:.6,min:16}],
 ['Policiamento da Copa','A polícia cancelou as folgas durante a Copa. Turno dobrado nos estádios e nas ruas.',['Encarar o turno dobrado|perf+8 hl-3 $+3000|Cansaço e hora extra no bolso.','Pedir dispensa|perf-6|A corporação não gostou.'],{min:18,when:m=>typeof isCop==='function'&&isCop()}],
]);
pack({k:'Olimpíadas',w:2.5,cd:4,min:6,when:ANO_OLIMP},[
 ['A abertura dos Jogos','A cerimônia de abertura das Olimpíadas está passando ao vivo.',['Ver com a família|h+5|Choramos no desfile da delegação.','Dormir|h+1|Vi os melhores momentos no dia seguinte.']],
 ['Inspiração olímpica','Ver os atletas nas Olimpíadas me deu vontade de começar um esporte.',['Começar a treinar|tal.athletic+4 hl+3|Meu primeiro treino doeu, mas eu voltei no dia seguinte.','Continuar no sofá|h+1|Os atletas fazem parecer fácil.']],
 ['Atleta do bairro','Um atleta que cresceu no meu bairro está disputando as Olimpíadas.',['Organizar a torcida na praça|k+4 h+8|O bairro inteiro gritou o nome dele.','Torcer de casa|h+4|Ele chegou à final!']],
 ['Bolão de medalhas','No trabalho e na escola, todo mundo aposta quantas medalhas o país vai ganhar.',['Entrar no bolão|$-30 ?20 $+v h+6|Acertei o número de medalhas!|h-1|Chutei alto demais.','Ficar de fora|h+0|Só torcer.'],{v:[300,2000]}],
 ['Escândalo de doping','Uma atleta famosa foi pega no exame antidoping e perdeu a medalha.',['Defender a atleta nas redes|?40 f+1|Muita gente concordou.|k-2|Fui atacad{o} nos comentários.','Comentar com os amigos|h+1|Discutimos por horas.']],
 ['Ingressos olímpicos','Sobraram ingressos para uma modalidade que eu nunca vi.',['Comprar e ir|$-v h+10|Descobri um esporte novo para amar.','Deixar para lá|h+0|Fica para a próxima.'],{min:16,v:[150,900]}],
]);
pack({k:'Sede do evento',w:3,cd:4,min:16,when:SEDE_AQUI},[
 ['O país é sede','As obras para o grande evento tomaram a cidade. Uns comemoram, outros protestam contra os gastos.',['Ir ao protesto|k+3 f+1|Milhares de pessoas pedindo hospital padrão estádio.','Comemorar as obras|h+4|A cidade nunca esteve tão bonita.','Ignorar o trânsito|h-3|Duas horas para chegar em casa.']],
 ['Emprego temporário','Estão contratando gente para trabalhar no evento: recepção, segurança e transporte.',['Pegar o bico|$+v hl-2|Trabalhei muito e conheci gente do mundo inteiro.','Recusar|h+0|Prefiro ver de longe.'],{v:[1500,6000]}],
 ['Turistas na cidade','Turistas procuram lugar para ficar e pagam bem.',['Alugar um quarto|$+v h+2|Hospedei uma família estrangeira. Ganhei dinheiro e um convite para visitá-los.','Não alugar|h+0|Minha casa, meu sossego.'],{v:[2000,9000],when:m=>m.assets.some(a=>a.k==='casa')}],
 ['Preços nas alturas','Com o evento, tudo na cidade ficou mais caro: comida, aluguel e transporte.',['Apertar o orçamento|$-v h-3|Arroz e feijão até o fim dos jogos.','Sair da cidade durante o evento|$-v2 h+4|Fugi da muvuca.'],{v:[300,1500]}],
]);
function grandesEventosSelfTest(){const s0=S,rf=R.f,ns=window.NO_SAVE;let x=2026;R.f=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};const ok=(v,t)=>{if(!v)throw Error('Grandes eventos · '+t);};try{window.NO_SAVE=true;
 newLife({country:'BR',year:2030});const m=S.me;m.age=30;m.born=S.year-30;grandesEventosMundo();const t=S.torneios.copa2030;ok(t&&t.campeao&&t.res,'Copa sem resultado no mundo');grandesEventosMundo();ok(Object.keys(S.torneios).length===1,'resultado repetido');
 const ids=Object.keys(EVENTS).filter(id=>EVENTS[id].title&&/Copa|Olimp|Sede/.test(EVENTS[id].cond||''));ok(ids.length>=20,'poucos eventos dos grandes torneios: '+ids.length);
 const deCopa=ids.filter(id=>{try{return EVENTS[id].when(m);}catch(e){return false;}});ok(deCopa.length>=5,'nenhum evento de Copa liberado para quem não é atleta');
 S.year=2028;S.torneios={};grandesEventosMundo();ok(S.torneios.olimp2028&&S.torneios.olimp2028.lider,'Olimpíadas sem quadro de medalhas');ok(ids.some(id=>{try{return EVENTS[id].when(m);}catch(e){return false;}}),'nenhum evento olímpico liberado');
 S.year=2027;ok(!ids.some(id=>{try{return EVENTS[id].when(m);}catch(e){return false;}}),'evento de Copa fora do ano de Copa');
 return {eventos:ids.length};}finally{S=s0;R.f=rf;window.NO_SAVE=ns;}}
