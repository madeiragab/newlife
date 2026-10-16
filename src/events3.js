// ===== Eventos: vida adulta, velhice, prisão e carreiras =====
const hasJob=m=>m.job&&!m.job.spc;
const single=m=>!partners().length;

// ---------- vida adulta ----------
ev('reporter_rua',{k:'TV',min:16,cd:8,t:'Entrevista na rua',x:'Um repórter me parou na rua para perguntar sobre {tema}.',prep:()=>({tema:R.pick(['o preço da gasolina','o calor','o trânsito','a final do campeonato','a nova lei do celular nas escolas'])}),ch:[
 ['Responder sério',{t:'Apareci no jornal das 7 por três segundos.'}],
 ['Fazer uma piada',{p:.4,y:{f:3,h:5,t:'Virei meme nacional. "{frase}" está em todo lugar.'},n:{t:'A piada não foi ao ar.'}}],
 ['Sair correndo',{t:'Saí correndo e apareci de costas no jornal.'}]],prep2:0});
EVENTS.reporter_rua.prep=(old=>m=>Object.assign(old(m),{frase:R.pick(['Aqui é só sofrimento','Eu só queria um pastel','Ninguém me avisou','É isso aí, meu povo'])}))(EVENTS.reporter_rua.prep);
ev('app_invest',{k:'Dinheiro',min:18,cd:10,when:m=>m.money>2000,t:'Investimento milagroso',x:'Um aplicativo promete 30% de lucro por mês. Um conhecido jura que funciona.',v:[1000,20000],ch:[
 ['Investir {v}',{$:'-v',p:.12,y:{fn:(m,d)=>{ m.money+=d.v*3; return `Saquei a tempo! Recebi ${fmt(d.v*3)}.`; }},n:{h:-10,t:'O aplicativo sumiu da loja. Era pirâmide. Perdi tudo.'}}],
 ['Não investir',{sm:1,t:'Uma semana depois, a polícia fechou o esquema.'}]]});
ev('casamento_ex',{k:'Amor',min:22,cd:15,when:m=>people('ex').length,prep:withP('ex'),t:'Convite inesperado',x:'{n}, meu ex, vai se casar e me convidou para a festa.',ch:[
 ['Ir e ser educad{o}',{h:-2,k:2,t:'Dancei, comi bem e desejei felicidades. Que maturidade.'}],
 ['Ir e fazer barraco',{k:-4,f:1,t:'Fui expuls{o} da festa pelos seguranças.'}],
 ['Não ir',{t:'Mandei um presente pelo correio e fiquei em paz.'}]]});
ev('assombracao',{k:'Casa',min:16,cd:15,t:'Barulhos à noite',x:'Toda noite, às 3h, escuto passos no corredor de casa.',ch:[
 ['Investigar com uma lanterna',{p:.8,y:{t:['Era um gambá morando no forro.','Era o encanamento velho.','Era meu vizinho de cima, sonâmbulo.']},n:{h:-8,t:'Não encontrei nada. Mas os passos continuaram.'}}],
 ['Chamar uma benzedeira',{$:-200,h:3,t:'Depois da benzedura, os barulhos pararam. Coincidência?'}],
 ['Dormir de fone',{t:'Resolvido.'}]]});
ev('ovni',{k:'Mistério',min:10,cd:25,t:'Luzes no céu',x:'Vi luzes estranhas paradas no céu, em cima da cidade.',ch:[
 ['Filmar e postar',{p:.3,y:{f:3,t:'Meu vídeo foi parar num programa de TV sobre óvnis.',fn:m=>{ if(m.social) m.social.f+=R.int(1000,40000); }},n:{t:'Era um balão de festa. A internet riu de mim.'}}],
 ['Contar para todo mundo',{t:'Agora me chamam de "o ufólogo" no trabalho.'}],
 ['Fingir que não vi',{t:'Melhor não me envolver.'}]]});
ev('quiz_tv',{k:'TV',min:16,cd:20,t:'Programa de perguntas',x:'Fui chamad{o} para um programa de perguntas e respostas na TV.',v:[5000,500000],ch:[
 ['Participar',{p:m=>m.smarts/130,y:{$:'v',f:5,h:12,t:'Acertei a pergunta final! Ganhei {v}.'},n:{f:2,t:'Errei a primeira pergunta. Sobre a capital da Austrália.'}}],
 ['Recusar',{t:'Tenho pavor de câmeras.'}]]});
ev('maratona',{k:'Saúde',min:18,max:70,cd:10,t:'Maratona',x:'Minha cidade vai ter uma maratona de 42 km.',ch:[
 ['Correr',{p:m=>m.health/120,y:{h:10,hl:3,tal:{athletic:3},t:'Completei a maratona em {tempo}!'},n:{hl:-6,t:'Desisti no km 18 com câimbra.'}}],
 ['Assistir e torcer',{t:'Distribuí água para os corredores.'}]],prep:()=>({tempo:R.pick(['3h52','4h20','5h05','3h30'])})});
ev('karaoke',{k:'Diversão',min:18,cd:6,t:'Noite de karaokê',x:'A turma foi a um karaokê e todos querem me ver cantar.',ch:[
 ['Cantar {musica}',{p:m=>m.talent.musical/100+.15,y:{h:8,tal:{musical:2},t:'Arrasei! O bar inteiro cantou junto.'},n:{h:-3,t:'Desafinei tanto que pediram outra música.'}}],
 ['Ficar só olhando',{t:'Filmei todo mundo passando vergonha.'}]],prep:()=>({musica:R.pick(['uma balada romântica','um sertanejo','um rock dos anos 80','um pagode','um funk antigo','uma música de novela'])})});
ev('concurso_culinaria',{k:'Concurso',min:16,cd:12,t:'Concurso de culinária',x:'Inscrições abertas para o concurso de {prato} do bairro.',v:[500,5000],prep:()=>({prato:R.pick(['bolo','feijoada','pastel','torta salgada','churrasco','doce de festa junina'])}),ch:[
 ['Participar',{p:.3,y:{$:'v',h:8,t:'Ganhei o primeiro lugar e {v}!'},n:{t:'Meu prato ficou em sexto. A jurada fez careta.'}}],
 ['Só ir provar',{h:3,t:'Comi tanto que passei mal.'}]]});
ev('heranca_pet',{k:'Família',min:18,cd:30,once:1,t:'Uma herança inusitada',x:'Uma tia-avó morreu e me deixou o papagaio dela, que xinga em três idiomas.',ch:[
 ['Ficar com o papagaio',{h:4,fn:()=>{ const p=addPet('Papagaio','Doutor'); return `Agora ${p.first} mora comigo.`; }}],
 ['Doar para um santuário',{t:'O papagaio foi morar com outros papagaios xingadores.'}]]});
ev('apagao',{k:'Bairro',min:12,cd:10,t:'Apagão',x:'Um temporal derrubou a energia do bairro por três dias.',ch:[
 ['Ajudar os vizinhos idosos',{k:4,t:'Levei velas e comida para os vizinhos.'}],
 ['Ligar para a companhia de energia o dia todo',{h:-4,t:'Fiquei 6 horas na espera ouvindo a mesma música.'}],
 ['Aproveitar para descansar',{h:3,t:'Li um livro inteiro à luz de velas.'}]]});
ev('turbulencia',{k:'Viagem',min:16,cd:12,when:m=>(m.c.trips||0)>0,t:'Turbulência',x:'O avião começou a tremer forte no meio do voo.',ch:[
 ['Acalmar o passageiro do lado',{k:3,t:'Segurei a mão de um senhor apavorado. Ficamos amigos.'}],
 ['Rezar baixinho',{t:'Prometi coisas que não vou cumprir.'}],
 ['Entrar em pânico',{h:-5,t:'Gritei. O avião inteiro me olhou.'}]]});
ev('sosia',{k:'Fama',min:16,cd:20,t:'Sósia',x:'As pessoas vivem me confundindo com {famoso}.',prep:()=>({famoso:R.pick(['um ator de novela','uma cantora famosa','um jogador de futebol','um apresentador de TV'])}),ch:[
 ['Aproveitar e tirar fotos',{f:2,$:300,h:4,t:'Ganhei comida de graça em três restaurantes.'}],
 ['Negar sempre',{t:'"Não sou eu", repito pela milésima vez.'}]]});
ev('dna',{k:'Família',min:18,once:1,w:.8,t:'Teste de DNA',x:'Fiz um teste de DNA por curiosidade e descobri que tenho um meio-irmão: {n}.',gn:'M',ch:[
 ['Conhecer {n}',{h:6,fn:(m,d)=>{ const p=meetP(d,'irmao','n',{age:clamp(m.age+R.int(-10,10),1,90),bond:45}); return `Encontrei ${p.first}. Temos o mesmo nariz.`; }}],
 ['Deixar quieto',{t:'Algumas portas é melhor não abrir.'}]]});
ev('cartomante',{k:'Mistério',min:16,cd:15,t:'Cartomante',x:'Uma cartomante na praça leu minha mão e disse que {pred}.',prep:()=>({pred:R.pick(['vou ficar rico','um grande amor vai aparecer','devo tomar cuidado com escadas','alguém próximo esconde um segredo','vou viver até os cem anos'])}),ch:[
 ['Acreditar',{h:3,$:-50,t:'Paguei e saí pensativ{o}.'}],
 ['Rir',{t:'Ela me rogou uma praga em voz baixa.'}]]});
ev('voluntario',{k:'Solidariedade',min:14,cd:6,t:'Voluntariado',x:'{ong} está precisando de voluntários.',prep:()=>({ong:R.pick(['Um abrigo de animais','Uma creche comunitária','Um asilo','Um sopão para moradores de rua','Uma ONG de reflorestamento'])}),ch:[
 ['Ajudar todo fim de semana',{k:6,h:5,t:'Foi o melhor uso do meu tempo este ano.'}],
 ['Doar dinheiro',{$:-200,k:3,c:'gifts',t:'Doei $200.'}],
 ['Não tenho tempo',{t:'Fica para outro ano.'}]]});
ev('protesto',{k:'Rua',min:16,cd:8,t:'Protesto',x:'Tem um protesto na avenida sobre {causa}.',prep:()=>({causa:R.pick(['o aumento da passagem','a educação pública','o meio ambiente','os direitos dos animais','o preço dos aluguéis'])}),ch:[
 ['Participar',{k:2,p:.85,y:{h:4,t:'Gritei, cantei e voltei rouc{o}.'},n:{hl:-5,t:'A polícia jogou gás e eu passei mal.'}}],
 ['Assistir de longe',{t:'Fiquei filmando da calçada.'}],
 ['Reclamar do trânsito',{t:'Cheguei atrasad{o} no compromisso.'}]]});
ev('eleicao_voto',{k:'Política',min:16,cd:4,t:'Dia de eleição',x:'Hoje é dia de votar.',ch:[
 ['Votar no candidato que prometeu {prom}',{t:'Votei. {res}'}],
 ['Anular o voto',{t:'Anulei. Desta vez ninguém me convenceu.'}],
 ['Faltar e justificar depois',{$:-5,t:'Paguei uma multinha.'}]],prep:()=>({prom:R.pick(['metrô até o meu bairro','acabar com os buracos','merenda melhor','mais hospitais']),res:R.pick(['Meu candidato ganhou!','Meu candidato perdeu feio.','Deu segundo turno.'])})});
ev('sindico',{k:'Vizinhança',min:25,cd:12,when:m=>S.flags.movedOut,t:'Assembleia do prédio',x:'O prédio quer que eu seja o novo síndico.',ch:[
 ['Aceitar',{$:3000,h:-5,t:'Agora todo problema do prédio é meu problema.'}],
 ['Recusar',{t:'Me livrei. Por enquanto.'}]]});
ev('vazamento',{k:'Casa',min:18,cd:10,when:m=>S.flags.movedOut,t:'Vazamento',x:'Começou a pingar água do teto. Vem do apartamento de cima.',v:[300,3000],ch:[
 ['Cobrar o vizinho',{p:.6,y:{t:'Ele pagou o conserto.'},n:{$:'-v',t:'Ele disse que não é com ele. Paguei {v}.'}}],
 ['Consertar eu mesm{o}',{$:'-v',t:'Gastei {v} e um fim de semana inteiro.'}]]});
ev('golpe_amor',{k:'Internet',min:18,cd:12,when:single,t:'Amor virtual',x:'Uma pessoa linda que conheci na internet diz estar presa no exterior e precisa de {v}.',v:[1000,15000],ch:[
 ['Mandar o dinheiro',{$:'-v',h:-10,t:'Nunca mais tive notícias. Era golpe.'}],
 ['Pedir uma videochamada',{sm:1,t:'A câmera "sempre estava quebrada". Bloqueei.'}]]});
ev('dia_namorados',{k:'Amor',min:15,cd:3,when:m=>partners().length,prep:m=>{ const p=pickPartner(); return {pid:p.id,n:p.first,nl:p.last,nG:p.gender}; },t:'Dia dos Namorados',x:'Dia dos Namorados chegando. O que fazer com {n}?',ch:[
 ['Jantar caro',{$:-600,bond:10,h:5,t:'Um jantar inesquecível com {n}.'}],
 ['Algo feito à mão',{bond:7,k:1,t:'{n} chorou com o presente.'}],
 ['Esquecer a data',{bond:-12,t:'{n} não fala comigo há três dias.'}]]});
ev('sogra',{k:'Família',min:22,cd:15,when:m=>people('conjuge').length,prep:m=>{ const p=people('conjuge')[0]; return {pid:p.id,n:p.first,nl:p.last,nG:p.gender}; },t:'Hóspede permanente',x:'A mãe de {n} quer passar uma temporada lá em casa.',ch:[
 ['Aceitar de braços abertos',{bond:8,h:-6,t:'Ela reorganizou minha cozinha inteira.'}],
 ['Recusar',{bond:-10,t:'{n} ficou magoad{o2}.'}]]});
EVENTS.sogra.prep=(old=>m=>{ const d=old(m); const p=P(d.pid); d.o2=p&&p.gender==='F'?'a':'o'; return d; })(EVENTS.sogra.prep);
ev('festa_firma',{k:'Trabalho',min:18,cd:4,when:hasJob,t:'Festa da firma',x:'Festa de fim de ano da {co}, com bebida liberada.',prep:m=>({co:m.job.co}),ch:[
 ['Beber tudo que der',{add:{alcool:6},p:.5,y:{h:8,t:'Fui a alma da festa.'},n:{t:'Dancei em cima da mesa. Meu chefe filmou.',fn:m=>{ m.job.perf=clamp(m.job.perf-10); }}}],
 ['Ir com moderação',{h:4,fn:m=>{ m.job.perf=clamp(m.job.perf+2); return 'Fiz contatos importantes.'; }}],
 ['Não ir',{t:'Fiquei em casa. Ninguém sentiu falta.'}]]});
ev('credito_roubado',{k:'Trabalho',min:18,cd:8,when:hasJob,t:'Ideia roubada',x:'{n}, meu colega, apresentou minha ideia ao chefe como se fosse sua.',ch:[
 ['Confrontar na frente de todos',{p:.5,y:{fn:m=>{ m.job.perf=clamp(m.job.perf+8); return 'Provei que a ideia era minha. {n} ficou sem graça.'; }},n:{t:'Pareci invejos{o}. Pegou mal.',fn:m=>{ m.job.perf=clamp(m.job.perf-5); }}}],
 ['Falar com o chefe em particular',{fn:m=>{ m.job.perf=clamp(m.job.perf+4); return 'Meu chefe agradeceu e ficou de olho em {n}.'; }}],
 ['Deixar passar',{h:-5,t:'Engoli em seco.'}]]});
ev('home_office',{k:'Trabalho',min:18,cd:15,when:hasJob,t:'Trabalho remoto',x:'A empresa me ofereceu trabalhar de casa.',ch:[
 ['Aceitar',{h:6,t:'Trabalho de pijama. A vida é boa.'}],
 ['Prefiro o escritório',{fn:m=>{ m.job.perf=clamp(m.job.perf+3); return 'Gosto de separar casa e trabalho.'; }}]]});
ev('burnout',{k:'Saúde',min:20,cd:8,when:m=>m.job&&(m.c.work||0)>8,t:'No limite',x:'Acordei sem conseguir sair da cama. Estou esgotad{o}.',ch:[
 ['Tirar férias',{h:10,hl:4,t:'Duas semanas sem celular me salvaram.'}],
 ['Continuar trabalhando',{hl:-8,h:-8,t:'Continuei. Meu corpo cobrou.'}],
 ['Procurar terapia',{$:-1200,h:8,t:'A terapia está me ajudando a respirar.'}]]});
ev('chefe_novo',{k:'Trabalho',min:18,cd:10,when:hasJob,t:'Chefe novo',x:'Meu novo chefe é um carrasco que grita com todo mundo.',ch:[
 ['Aguentar calad{o}',{h:-6,t:'Mais um dia de gritos.'}],
 ['Reclamar no RH',{p:.5,y:{h:5,t:'Ele foi transferido!'},n:{t:'O RH não fez nada e ele ficou sabendo.',fn:m=>{ m.job.perf=clamp(m.job.perf-8); }}}],
 ['Responder à altura',{p:.3,y:{h:6,t:'Ele me respeita desde então.'},n:{fn:m=>{ endJob(); return `Fui ${m.gender==='F'?'demitida':'demitido'} na hora.`; }}}]]});
ev('greve',{k:'Trabalho',min:18,cd:10,when:hasJob,t:'Greve',x:'Os funcionários da {co} entraram em greve por aumento.',prep:m=>({co:m.job.co}),ch:[
 ['Aderir à greve',{p:.6,y:{fn:m=>{ m.job.mul=(m.job.mul||1)*1.06; return 'A greve deu certo: 6% de aumento para todos.'; }},n:{t:'A greve fracassou e o clima ficou ruim.'}}],
 ['Furar a greve',{k:-3,fn:m=>{ m.job.perf=clamp(m.job.perf+6); return 'O chefe adorou. Os colegas, não.'; }}]]});
ev('sorteio_carro',{k:'Sorte',min:18,cd:10,t:'Sorteio no mercado',x:'O supermercado está sorteando um carro para quem gastar mais de $200.',ch:[
 ['Participar',{$:-200,p:.02,y:{h:25,fn:m=>{ m.assets.push({id:newId(),k:'carro',n:'Hatch novo (prêmio do sorteio)',value:55000,cond:100,buy:0}); return 'GANHEI O CARRO!'; }},n:{t:'Ganhei só as compras do mês.'}}],
 ['Não participar',{t:'Nunca ganho nada mesmo.'}]]});
ev('multa',{k:'Trânsito',min:18,cd:4,when:hasCar,t:'Multa',x:'Chegou uma multa de {v} por {motivo}.',v:[100,1500],prep:()=>({motivo:R.pick(['excesso de velocidade','estacionar em lugar proibido','avançar o sinal','usar o celular dirigindo'])}),ch:[
 ['Pagar',{$:'-v',t:'Paguei, resmungando.'}],
 ['Recorrer',{p:.3,y:{t:'Ganhei o recurso!'},n:{$:'-v',t:'Recurso negado. Paguei com juros.'}}]]});
ev('furto_celular',{k:'Rua',min:12,cd:8,t:'Celular roubado',x:'Um rapaz de bicicleta arrancou o celular da minha mão.',ch:[
 ['Correr atrás',{p:m=>m.health/200,y:{h:6,t:'Alcancei e recuperei o celular!'},n:{$:-1500,hl:-3,t:'Caí e ainda fiquei sem o celular.'}}],
 ['Deixar ir',{$:-1500,h:-4,t:'Comprei outro celular. $1.500.'}]]});
ev('anel_praia',{k:'Sorte',min:10,cd:20,t:'Achado na areia',x:'Achei um anel de ouro na areia da praia.',v:[500,8000],ch:[
 ['Vender',{$:'v',k:-2,t:'Vendi por {v}.'}],
 ['Procurar o dono',{k:5,p:.4,y:{$:'v',t:'Achei o dono, que me deu {v} de recompensa!'},n:{t:'Nunca achei o dono. Deixei na polícia.'}}]]});
ev('reuniao_turma',{k:'Social',min:30,max:55,cd:10,t:'Reencontro da turma',x:'A turma da escola marcou um reencontro de {anos} anos de formatura.',prep:m=>({anos:Math.round((m.age-17)/5)*5||10}),ch:[
 ['Ir',{h:6,t:['Todo mundo ficou careca ou rico. Ou os dois.','Reencontrei meu primeiro amor. Tudo meio estranho.','O valentão da escola virou pastor.']}],
 ['Não ir',{t:'Vi as fotos depois. Envelheceram mais que eu.'}]]});
ev('resgate_animal',{k:'Bicho',min:16,cd:8,t:'Cachorro ferido',x:'Encontrei um cachorro machucado na beira da estrada.',ch:[
 ['Levar ao veterinário e adotar',{$:-800,k:6,h:8,fn:()=>{ const p=addPet('Cachorro'); return `Ele se recuperou e se chama ${p.first}.`; }}],
 ['Levar a uma ONG',{k:4,t:'A ONG achou um lar para ele.'}],
 ['Seguir caminho',{k:-3,t:'Não consegui parar de pensar nele.'}]]});
ev('incendio',{k:'Perigo',min:14,cd:20,t:'Incêndio no prédio',x:'Fogo no apartamento ao lado! Tem uma criança lá dentro.',ch:[
 ['Entrar para salvar a criança',{k:12,p:.75,y:{f:8,h:12,hl:-6,t:'Salvei a criança! Virei herói na TV.'},n:{hl:-30,t:'A fumaça me derrubou. Os bombeiros salvaram nós dois.'}}],
 ['Chamar os bombeiros',{k:2,t:'Os bombeiros chegaram a tempo.'}],
 ['Salvar minhas coisas',{k:-4,t:'Salvei meu notebook. A consciência pesou.'}]]});
ev('viagem_sorteio',{k:'Sorte',min:18,cd:20,t:'Ganhei uma viagem!',x:'Ganhei uma viagem para {lugar} num sorteio da rádio.',prep:()=>({lugar:R.pick(TRIPS)}),ch:[
 ['Ir',{h:12,c:'trips',t:'Foi incrível conhecer {lugar} de graça.'}],
 ['Vender o prêmio',{$:4000,t:'Vendi o pacote por $4.000.'}]]});
ev('publi',{k:'Internet',min:14,cd:4,when:m=>m.social&&m.social.f>=2000,t:'Proposta de publicidade',x:'Uma marca de {prod} quer pagar {v} por um post.',v:[300,20000],prep:()=>({prod:R.pick(['energético','cosméticos','roupa fitness','aposta online','curso de inglês','chá emagrecedor'])}),ch:[
 ['Aceitar',{$:'v',p:.85,y:{t:'Postei e recebi {v}.'},n:{f:-2,t:'Postei, mas descobriram que o produto era fraude. Fui cancelad{o}.'}}],
 ['Recusar',{k:1,t:'Não divulgo o que não uso.'}]]});
ev('tweet_antigo',{k:'Internet',min:16,cd:10,when:m=>m.social&&m.social.f>=500,t:'Post antigo',x:'Acharam um post meu de anos atrás e estão me atacando.',ch:[
 ['Pedir desculpas',{p:.6,y:{t:'Aceitaram as desculpas.'},n:{h:-5,t:'Disseram que foi desculpa de fachada.'}}],
 ['Dobrar a aposta',{f:3,fn:m=>{ m.social.f=Math.round(m.social.f*.8); return 'Perdi 20% dos seguidores, mas ganhei uma legião de fãs radicais.'; }}],
 ['Sumir das redes por um tempo',{h:2,t:'Um mês offline me fez bem.'}]]});
ev('despedida_solteiro',{k:'Festa',min:20,max:50,cd:6,when:m=>people('amigo').length,prep:withP('amigo'),t:'Despedida de solteiro',x:'{n} vai casar e a despedida de solteiro é neste fim de semana.',ch:[
 ['Ir e beber muito',{add:{alcool:6},h:6,bond:6,t:['Acordei numa cidade vizinha sem saber como.','Alguém fez uma tatuagem. Não fui eu. Acho.']}],
 ['Ir de motorista da rodada',{bond:8,k:2,t:'Levei todo mundo para casa em segurança.'}],
 ['Não ir',{bond:-6,t:'{n} ficou chatead{on}.'}]]});
ev('padrinho',{k:'Família',min:20,cd:10,when:m=>people('amigo','irmao').length,prep:withP('amigo','irmao'),t:'Convite para padrinho',x:'{n} teve um bebê e me convidou para ser padrinho.',ch:[
 ['Aceitar com orgulho',{bond:12,k:3,h:5,t:'Agora tenho um afilhado.'}],
 ['Recusar',{bond:-10,t:'{n} não entendeu minha recusa.'}]]});
ev('conta_invadida',{k:'Dinheiro',min:18,cd:12,when:m=>m.money>1000,t:'Conta invadida',x:'Hackers invadiram minha conta e levaram {v}.',v:[500,8000],prep:m=>({v:Math.min(m.money,amt(500,8000))}),ch:[
 ['Ligar para o banco',{$:'-v',p:.55,y:{$:'v',t:'O banco devolveu tudo.'},n:{t:'O banco disse que a culpa foi minha.'}}],
 ['Ir à polícia',{$:'-v',p:.2,y:{$:'v',t:'Prenderam a quadrilha e recuperei o dinheiro.'},n:{t:'Registrei o B.O. Nunca mais vi o dinheiro.'}}]]});
ev('deposito_errado',{k:'Ética',min:18,cd:20,t:'Dinheiro do nada',x:'Um depósito de {v} caiu na minha conta por engano.',v:[2000,50000],ch:[
 ['Devolver',{k:6,t:'Devolvi. O banco me mandou um cartão de agradecimento.'}],
 ['Gastar',{$:'v',k:-5,p:.4,y:{h:6,t:'Ninguém cobrou. Até agora.'},n:{fn:(m,d)=>{ m.money-=Math.round(d.v*1.3); return `O banco descobriu e cobrou tudo com juros: ${fmt(d.v*1.3)}.`; }}}]]});
ev('doar_rim',{k:'Família',min:18,max:65,once:1,w:.6,when:m=>people('mae','pai','irmao','filho').length,prep:withP('mae','pai','irmao','filho'),t:'Um rim',x:'{n} precisa de um transplante de rim, e eu sou compatível.',ch:[
 ['Doar o rim',{hl:-15,k:12,bond:30,t:'A cirurgia deu certo. {n} vai viver graças a mim.'}],
 ['Não doar',{bond:-25,k:-6,t:'{n} entrou na fila de espera.'}]]});
ev('bicho_sonho',{k:'Sorte',min:18,cd:5,t:'Sonho com número',x:'Sonhei com {bicho} a noite toda. Dizem que dá sorte no jogo do bicho.',prep:()=>({bicho:R.pick(['um elefante','uma cobra','um macaco','um cavalo','um leão','uma vaca'])}),ch:[
 ['Apostar $20',{$:-20,c:'bets',p:.06,y:{$:1200,h:8,t:'Deu na cabeça! Ganhei $1.200.'},n:{t:'Deu outro bicho.'}}],
 ['Não apostar',{t:'Sonho é só sonho.'}]]});
ev('estatua_museu',{k:'Passeio',min:10,cd:25,t:'Museu',x:'Esbarrei numa estátua no museu e ela balançou perigosamente.',ch:[
 ['Segurar a estátua',{p:.7,y:{t:'Salvei a estátua. O segurança me aplaudiu.'},n:{$:-5000,t:'Ela caiu. Paguei $5.000 por um nariz de mármore.'}}],
 ['Sair de fininho',{k:-2,t:'Saí andando como se nada tivesse acontecido.'}]]});
ev('mesario',{k:'Dever cívico',min:18,cd:8,t:'Mesário',x:'Fui convocad{o} para ser mesári{o} nas eleições.',ch:[
 ['Trabalhar na eleição',{k:2,$:100,t:'Ganhei lanche, folga e $100.'}],
 ['Faltar',{$:-500,t:'Multa de $500.'}]]});
ev('arvore_carro',{k:'Desastre',min:18,cd:15,when:hasCar,t:'Árvore no carro',x:'Uma tempestade derrubou uma árvore em cima do meu carro.',ch:[
 ['Acionar o seguro',{p:.6,y:{t:'O seguro pagou o conserto.'},n:{$:-6000,t:'O seguro não cobria "atos de Deus". Paguei $6.000.'}}],
 ['Processar a prefeitura',{p:.4,y:{$:8000,t:'Ganhei $8.000 da prefeitura!'},n:{$:-2000,t:'Perdi a causa e paguei as custas.'}}]]});
ev('proposta_exterior',{k:'Carreira',min:22,max:55,cd:20,when:m=>hasJob(m)&&m.job.perf>60,t:'Proposta no exterior',x:'Uma empresa de {lugar} quer me contratar com salário em moeda forte.',prep:m=>{ const c=R.pick(COUNTRIES.filter(x=>x.id!==m.country)); return {cid:c.id,lugar:c.n}; },ch:[
 ['Aceitar e me mudar',{h:8,fn:(m,d)=>{ const c=countryOf(d.cid); m.country=c.id; m.city=R.pick(c.cities); m.c.countries=(m.c.countries||1)+1; cnt('emig'); m.job.co=companyName(); m.job.mul=(m.job.mul||1)*1.35; return `Me mudei para ${m.city}, ${c.n}!`; }}],
 ['Recusar',{t:'Minha vida está aqui.'}]]});
ev('gato_vizinho',{k:'Bicho',min:6,cd:12,t:'Visitante felino',x:'O gato do vizinho entra pela minha janela todo dia.',ch:[
 ['Dar comida',{h:4,t:'Agora ele dorme na minha cama.'}],
 ['Devolver ao vizinho',{k:1,t:'O vizinho prometeu fechar a janela.'}],
 ['Adotar de vez',{p:.4,y:{fn:()=>{ const p=addPet('Gato'); return `O vizinho deixou! ${p.first} é meu.`; }},n:{t:'O vizinho ficou ofendido.'}}]]});
ev('vizinho_novo',{k:'Vizinhança',min:16,cd:10,t:'Vizinho novo',x:'{n} se mudou para a casa ao lado.',ch:[
 ['Levar um bolo de boas-vindas',{k:2,fn:(m,d)=>{ if(R.chance(.5)){ meetP(d,'amigo'); return 'Viramos amigos. {n} cozinha muito bem.'; } return '{n} é simpátic{on}, mas reservad{on}.'; }}],
 ['Ignorar',{t:'Nem sei a cara de {n}.'}]]});
ev('golpe_whats',{k:'Telefone',min:18,cd:8,t:'Mensagem suspeita',x:'Um número desconhecido com a foto de {quem} pede {v} por Pix, "urgente".',v:[300,3000],prep:m=>({quem:(parents()[0]||people('irmao')[0]||{first:'um parente'}).first}),ch:[
 ['Mandar o dinheiro',{$:'-v',t:'Era golpe. {quem} nunca pediu nada.'}],
 ['Ligar para {quem}',{sm:1,t:'Golpe evitado. {quem} estava tranquilamente vendo novela.'}]]});
ev('show_humor',{k:'Diversão',min:16,cd:8,t:'Show de stand-up',x:'Fui a um show de comédia e sentei na primeira fila.',ch:[
 ['Responder ao comediante',{p:m=>(m.talent.comedy||30)/100,y:{tal:{comedy:3},h:6,t:'Fui mais engraçad{o} que o comediante. A plateia aplaudiu.'},n:{h:-4,t:'Ele me destruiu com uma piada. A plateia chorou de rir.'}}],
 ['Ficar quiet{o}',{h:4,t:'Ri até a barriga doer.'}]]});

// ---------- velhice ----------
ev('netos_visita',{k:'Família',min:55,cd:4,when:m=>people('neto').length,prep:withP('neto'),t:'Visita dos netos',x:'{n} veio passar o fim de semana comigo.',ch:[
 ['Contar histórias da minha juventude',{bond:8,h:6,t:'{n} riu das minhas histórias e pediu mais.'}],
 ['Dar um dinheirinho escondido',{$:-100,bond:10,t:'"Não conta para os seus pais", eu disse.'}],
 ['Ensinar uma receita de família',{bond:9,t:'Fizemos bolo juntos. A cozinha virou um campo de batalha.'}]]});
ev('casa_repouso',{k:'Família',min:78,cd:8,when:m=>kids().length,t:'Casa de repouso',x:'Meus filhos sugeriram que eu me mude para uma casa de repouso.',ch:[
 ['Aceitar',{h:-6,hl:5,t:'A comida é sem sal, mas as enfermeiras são uns amores.'}],
 ['Recusar',{h:2,t:'Daqui eu só saio para o cemitério.'}]]});
ev('aula_informatica',{k:'Estudos',min:60,once:1,t:'Aula de informática',x:'O centro comunitário abriu aulas de informática para a terceira idade.',ch:[
 ['Me inscrever',{sm:3,h:5,t:'Agora mando figurinhas no grupo da família todo dia.'}],
 ['Não preciso disso',{t:'Sigo com meu celular de flip.'}]]});
ev('baile_saudade',{k:'Amor',min:60,cd:6,when:single,t:'Baile da saudade',x:'No baile da terceira idade, {n} me tirou para dançar.',date:1,ch:[
 ['Dançar a noite toda',{h:8,p:.4,y:{fn:(m,d)=>{ const p=meetP(d,'namoro','n',{age:clamp(m.age+R.int(-6,6),55,99)}); return `Estou namorando ${p.first}! Nunca é tarde.`; }},n:{t:'Dançamos bolero. Meus joelhos reclamaram.'}}],
 ['Recusar com educação',{t:'Hoje só vim ver a banda.'}]]});
ev('queda_banho',{k:'Saúde',min:65,cd:6,t:'Escorregão',x:'Escorreguei no banheiro.',ch:[
 ['Ir ao hospital',{$:-500,hl:-4,t:'Só um susto e um roxo enorme.'}],
 ['Fingir que não foi nada',{p:.6,y:{t:'Doeu uma semana, mas passou.'},n:{hl:-15,t:'Era uma fratura no quadril.'}}]]});
ev('memorias',{k:'Arte',min:60,once:1,t:'Minhas memórias',x:'Pensei em escrever um livro com as histórias da minha vida.',ch:[
 ['Escrever o livro',{tal:{writing:5},p:m=>(m.talent.writing||20)/150+.05,y:{$:30000,f:5,h:12,t:'O livro virou sucesso entre os leitores!'},n:{h:6,t:'Imprimi 20 cópias para a família. Todos choraram.'}}],
 ['Deixar para lá',{t:'Talvez ano que vem.'}]]});
ev('excursao_idosos',{k:'Viagem',min:60,cd:4,t:'Excursão',x:'O grupo da terceira idade vai fazer uma excursão para {lugar}.',prep:()=>({lugar:R.pick(['Aparecida','Caldas Novas','Gramado','Porto Seguro','Poços de Caldas','Foz do Iguaçu'])}),ch:[
 ['Ir',{$:-1500,h:10,c:'trips',t:'Cantamos no ônibus o caminho inteiro.'}],
 ['Ficar em casa',{t:'Ônibus me enjoa.'}]]});
ev('golpe_consignado',{k:'Telefone',min:62,cd:6,t:'Empréstimo "imperdível"',x:'Um vendedor insiste que eu pegue um empréstimo consignado "sem juros".',v:[2000,15000],ch:[
 ['Assinar',{$:'-v',t:'Os "juros zero" eram de 9% ao mês. Perdi {v}.'}],
 ['Bater o telefone',{sm:1,t:'Ninguém me engana.'}]]});
ev('amigo_infancia',{k:'Família',min:55,cd:6,t:'Notícia triste',x:'Soube que {n}, meu amigo de infância, faleceu.',ch:[
 ['Ir ao velório',{h:-6,k:2,t:'Revi gente que não via há décadas.'}],
 ['Mandar flores',{h:-4,$:-150,t:'Mandei uma coroa de flores.'}]]});
ev('horta',{k:'Saúde',min:50,once:1,t:'Uma horta',x:'Pensei em montar uma horta no quintal.',ch:[
 ['Montar a horta',{hl:4,h:6,t:'Meus tomates são os melhores do bairro.'}],
 ['Comprar tudo na feira',{t:'Feira é mais prático.'}]]});

// ---------- prisão ----------
const jailEv=(id,o)=>ev(id,Object.assign({jail:1,cd:6},o,{when:m=>m.prison&&(!o.when||o.when(m))}));
jailEv('visita',{w:2,t:'Dia de visita',prep:m=>{ const ps=people('mae','pai','conjuge','namoro','filho','irmao','amigo'); if(!ps.length) return null; const p=R.pick(ps); return {pid:p.id,n:p.first,nl:p.last,nG:p.gender}; },k:'Prisão',x:'{n} veio me visitar.',ch:[
 ['Abraçar e conversar',{bond:10,h:8,t:'Chorei quando o horário de visita acabou.'}],
 ['Pedir para trazer {item}',{bond:-2,h:4,t:'{n} trouxe {item} escondido no bolo.'}],
 ['Recusar a visita',{bond:-12,h:-3,t:'Não quis que {n} me visse assim.'}]]});
EVENTS.visita.prep=(old=>m=>{ const d=old(m); if(d) d.item=R.pick(['cigarros','chocolates','um livro','fotos da família']); return d; })(EVENTS.visita.prep);
jailEv('carta',{w:1.5,k:'Prisão',t:'Uma carta',x:'Recebi uma carta de {n}, alguém que eu nem conhecia, querendo me conhecer.',ch:[
 ['Responder',{h:6,meet:'amigo',t:'Começamos a trocar cartas toda semana.'}],
 ['Ignorar',{t:'Joguei fora.'}]]});
jailEv('colega_cela',{w:1.6,k:'Prisão',t:'Nova companhia de cela',x:'Chegou {n} para dividir a cela comigo, condenad{on} por {crime}.',same:1,prep:()=>({crime:R.pick(['estelionato','roubo de carga','contrabando de cigarros','furto de cabos','briga de bar'])}),ch:[
 ['Fazer amizade',{h:4,fn:(m,d)=>{ meetP(d,'amigo','n',{age:clamp(m.age+R.int(-10,10),18,80)}); return '{n} virou meu parceir{on} aqui dentro.'; }}],
 ['Mostrar quem manda',{p:m=>.35+m.fight/150,y:{t:'{n} entendeu o recado.'},n:{hl:-12,t:'{n} era faixa preta. Apanhei.'}}],
 ['Ignorar',{t:'Cada um no seu canto.'}]]});
jailEv('contrabando',{w:1.4,k:'Prisão',t:'Celular no presídio',x:'Um guarda corrupto vende celulares por {v}.',v:[500,2000],when:m=>!m.prison.juv,ch:[
 ['Comprar',{$:'-v',p:.7,y:{h:8,t:'Agora falo com o mundo lá fora toda noite.'},n:{fn:m=>{ m.prison.left+=1; m.prison.total+=1; return 'Fui pego numa revista. Um ano a mais.'; }}}],
 ['Recusar',{fn:m=>{ m.prison.behav=clamp(m.prison.behav+4); return 'Fiquei longe de encrenca.'; }}]]});
jailEv('cozinha',{w:1.3,k:'Prisão',t:'Vaga na cozinha',x:'Abriu uma vaga para trabalhar na cozinha do presídio.',ch:[
 ['Aceitar',{fn:m=>{ m.prison.behav=clamp(m.prison.behav+10); if(R.chance(.4)&&m.prison.left>1){ m.prison.left--; return 'Ganhei remição de pena: um ano a menos!'; } return 'Agora faço o arroz de 600 pessoas.'; }}],
 ['Recusar',{t:'Prefiro ficar na cela.'}]]});
jailEv('supletivo_prisao',{w:1.3,k:'Prisão',t:'Estudar na prisão',x:'O presídio oferece aulas para terminar os estudos.',when:m=>!hasDeg('medio')&&!m.edu.cur,ch:[
 ['Me matricular',{sm:4,fn:m=>{ m.prison.behav=clamp(m.prison.behav+8); if(R.chance(.5)){ if(!hasDeg('fund')) m.edu.deg.push('fund'); m.edu.deg.push('medio'); return 'Terminei o ensino médio dentro da prisão!'; } return 'Estou estudando todos os dias.'; }}],
 ['Não quero',{t:'Estudar para quê?'}]]});
jailEv('comida_podre',{w:1,k:'Prisão',t:'Comida estragada',x:'Serviram comida estragada pela terceira vez na semana.',ch:[
 ['Liderar um protesto',{p:.5,y:{t:'A comida melhorou. Um pouco.'},n:{fn:m=>{ m.prison.behav=clamp(m.prison.behav-15); return 'Me mandaram para a solitária por uma semana.'; }}}],
 ['Comer assim mesmo',{hl:-5,t:'Passei mal a noite inteira.'}],
 ['Trocar por bolacha com outro detento',{t:'Bolacha recheada nunca foi tão gostosa.'}]]});
jailEv('transferencia',{w:.8,k:'Prisão',t:'Transferência',x:'Querem me transferir para um presídio de segurança máxima.',when:m=>!m.prison.juv&&m.prison.behav<40,ch:[
 ['Aceitar sem resistir',{h:-6,t:'O novo lugar é ainda pior.'}],
 ['Contratar um advogado para impedir',{$:-8000,p:.5,y:{t:'O advogado conseguiu barrar a transferência.'},n:{h:-6,t:'Perdi o dinheiro e fui transferid{o}.'}}]]});
jailEv('tatuagem_cadeia',{w:1,k:'Prisão',t:'Tatuador da cela',x:'Um detento faz tatuagens com uma agulha improvisada.',ch:[
 ['Fazer uma tatuagem',{p:.75,y:{h:4,t:'Tatuei {tat}. Ficou surpreendentemente bom.'},n:{dis:'ist',t:'A agulha não era limpa. Peguei uma infecção.'}}],
 ['Recusar',{t:'Nem pensar.'}]],prep:()=>({tat:R.pick(['uma lágrima','o nome da minha mãe','uma teia de aranha','um relógio sem ponteiros'])})});
jailEv('dedo_duro',{w:1,k:'Prisão',t:'Proposta do diretor',x:'O diretor quer que eu conte quem está escondendo armas no pavilhão.',when:m=>!m.prison.juv,ch:[
 ['Contar tudo',{fn:m=>{ m.prison.behav=clamp(m.prison.behav+25); if(R.chance(.4)){ st('health',-25); return 'Descobriram que fui eu. Me esfaquearam no banho.'; } if(m.prison.left>1) m.prison.left--; return 'Ganhei redução de pena. E inimigos.'; }}],
 ['Ficar calad{o}',{t:'Aqui dentro, quem fala morre.'}]]});
jailEv('enfermaria',{w:.9,k:'Prisão',t:'Tosse que não passa',x:'Estou com uma tosse forte há semanas. Vários detentos estão doentes.',ch:[
 ['Pedir para ir à enfermaria',{p:.7,y:{t:'Tomei remédio e melhorei.'},n:{dis:'tuberculose',t:'Era tuberculose.'}}],
 ['Aguentar',{p:.4,y:{t:'Passou sozinha.'},n:{dis:'tuberculose',hl:-6,t:'Piorou muito. Era tuberculose.'}}]]});
jailEv('oficina',{w:1.6,k:'Internação',t:'Oficina',x:'A unidade está oferecendo uma oficina de {of}.',when:m=>m.prison.juv,prep:()=>({of:R.pick(['música','marcenaria','grafite','teatro','informática'])}),ch:[
 ['Participar',{tal:{musical:2,art:2,acting:2},sm:1,fn:m=>{ m.prison.behav=clamp(m.prison.behav+10); return 'Descobri que tenho jeito para a coisa.'; }}],
 ['Ficar no quarto',{t:'Mais um dia olhando para o teto.'}]]});
jailEv('psicologa',{w:1.4,k:'Internação',t:'Psicóloga',x:'A psicóloga da unidade quer conversar comigo.',when:m=>m.prison.juv,ch:[
 ['Me abrir',{h:8,fn:m=>{ m.prison.behav=clamp(m.prison.behav+12); return 'Falei coisas que nunca tinha dito para ninguém.'; }}],
 ['Ficar calad{o}',{t:'Ela anotou alguma coisa no caderno.'}]]});
jailEv('audiencia',{w:1.2,k:'Justiça',t:'Audiência de revisão',x:'Tenho uma audiência para revisar minha pena.',when:m=>m.prison.served>=1,ch:[
 ['Mostrar arrependimento',{fn:m=>{ if(R.chance(m.prison.behav/160)){ m.prison=null; st('happy',20); return 'O juiz me deu uma segunda chance. Estou livre!'; } return 'O juiz manteve a pena, mas anotou meu bom comportamento.'; }}],
 ['Ficar em silêncio',{t:'Pena mantida.'}]]});
jailEv('tunel',{w:.7,cd:12,k:'Prisão',t:'O túnel',x:'Uns detentos estão cavando um túnel e me chamaram para fugir junto.',when:m=>!m.prison.juv,ch:[
 ['Fugir pelo túnel',{p:.3,y:{fn:m=>{ m.prison=null; cnt('escapes'); st('happy',20); return 'Rastejei 80 metros no escuro e saí num terreno baldio. Estou livre!'; }},n:{fn:m=>{ m.prison.left+=2; m.prison.total+=2; m.prison.behav=clamp(m.prison.behav-30); return 'O túnel desabou no meio. Pegaram todo mundo. Mais dois anos.'; }}}],
 ['Dedurar o plano',{fn:m=>{ m.prison.behav=clamp(m.prison.behav+20); return 'O plano foi descoberto. Os outros não sabem que fui eu.'; }}],
 ['Ficar de fora',{t:'Na manhã seguinte, metade da ala tinha sumido.'}]]});

// ---------- fama, realeza, empresa, política, crime ----------
ev('fa_obcecado',{k:'Fama',min:16,cd:12,when:m=>m.fame>=30,t:'Fã obcecado',x:'Um fã começou a me seguir até em casa.',ch:[
 ['Chamar a polícia',{t:'Conseguiram uma medida protetiva.'}],
 ['Contratar segurança',{$:-20000,h:3,t:'Agora ando com um armário de terno.'}],
 ['Conversar com ele',{p:.5,y:{t:'Ele só queria um autógrafo. Ficou tudo bem.'},n:{hl:-10,t:'Ele surtou e me agrediu.'}}]]});
ev('premio',{k:'Fama',min:14,cd:6,when:m=>m.job&&['ator','musico','escritor','artista','comedia','streamer','dj'].includes(m.job.spc)&&m.job.lvl>=1,t:'Indicação a prêmio',x:'Fui indicad{o} a um prêmio importante da minha área.',ch:[
 ['Ir à cerimônia',{p:m=>m.job.perf/150,y:{f:8,h:15,fn:m=>{ m.job.perf=clamp(m.job.perf+10); return 'Ganhei! Fiz um discurso emocionado.'; }},n:{h:-3,t:'Perdi, mas sorri para as câmeras.'}}],
 ['Boicotar o prêmio',{f:4,t:'Meu boicote deu mais assunto que o prêmio.'}]]});
ev('lesao',{k:'Esporte',min:14,cd:6,when:m=>m.job&&m.job.spc==='atleta',t:'Lesão',x:'Senti uma dor forte no joelho durante o treino.',ch:[
 ['Operar e fazer fisioterapia',{$:-30000,hl:4,fn:m=>{ m.job.perf=clamp(m.job.perf-10); return 'Fiquei seis meses fora, mas voltei 100%.'; }}],
 ['Jogar no sacrifício',{p:.4,y:{fn:m=>{ m.job.perf=clamp(m.job.perf+10); return 'Joguei a final machucad'+oa()+' e virei herói da torcida.'; }},n:{hl:-20,fn:m=>{ endJob(); return 'A lesão piorou e encerrou minha carreira.'; }}}]]});
ev('papel_polemico',{k:'Cinema',min:16,cd:8,when:m=>m.job&&m.job.spc==='ator',t:'Papel polêmico',x:'Me ofereceram o papel de um vilão real num filme polêmico.',ch:[
 ['Aceitar',{p:.5,y:{f:10,t:'Fui aclamad{o} pela crítica.'},n:{f:3,h:-6,t:'Recebi ameaças nas redes.'}}],
 ['Recusar',{t:'Prefiro papéis mais leves.'}]]});
ev('casamento_real',{k:'Realeza',min:18,cd:20,when:m=>m.royal&&!m.royal.abd&&people('noivo').length,prep:m=>{ const p=people('noivo')[0]; return {pid:p.id,n:p.first,nl:p.last,nG:p.gender}; },t:'Casamento real',x:'O reino inteiro aguarda meu casamento com {n}.',ch:[
 ['Cerimônia de gala transmitida para o mundo',{h:20,f:10,fn:(m,d)=>{ const p=P(d.pid); if(!polyPodeOficializar(p)) return 'A cerimônia foi adiada: falta o consentimento dos meus parceiros.'; p.rel='conjuge'; p.yrs=0; cnt('marriages'); m.royal.pop=clamp(m.royal.pop+15); return `Casei com ${p.first} diante de 2 bilhões de pessoas.`; }}],
 ['Cerimônia íntima',{h:12,fn:(m,d)=>{ const p=P(d.pid); if(!polyPodeOficializar(p)) return 'A cerimônia foi adiada: falta o consentimento dos meus parceiros.'; p.rel='conjuge'; p.yrs=0; cnt('marriages'); m.royal.pop=clamp(m.royal.pop-5); return `Casei com ${p.first} em segredo. O povo ficou decepcionado.`; }}]]});
ev('tabloide_real',{k:'Realeza',min:14,cd:6,when:m=>m.royal&&!m.royal.abd,t:'Escândalo no palácio',x:'Um tabloide publicou fotos minhas {situacao}.',prep:()=>({situacao:R.pick(['numa festa às 4h da manhã','de biquíni num iate','dormindo numa reunião oficial','comendo cachorro-quente na rua'])}),ch:[
 ['Emitir nota oficial',{fn:m=>{ m.royal.pop=clamp(m.royal.pop-3); return 'A nota acalmou os ânimos.'; }}],
 ['Assumir com bom humor',{fn:m=>{ m.royal.pop=clamp(m.royal.pop+R.int(-5,10)); return 'Metade do reino achou charmoso.'; }}],
 ['Processar o tabloide',{$:-200000,fn:m=>{ m.royal.pop=clamp(m.royal.pop-6); return 'O processo virou notícia por meses.'; }}]]});
ev('processo_trab',{k:'Empresa',min:18,cd:6,when:m=>m.biz,t:'Processo trabalhista',x:'Um ex-funcionário processou a {b} pedindo {v}.',v:[10000,300000],prep:m=>({b:m.biz.n}),ch:[
 ['Fazer acordo',{$:'-v',t:'Paguei {v} e encerrei o caso.'}],
 ['Brigar na justiça',{p:.5,y:{t:'Ganhei a causa!'},n:{fn:(m,d)=>{ m.money-=d.v*2; return `Perdi e paguei ${fmt(d.v*2)}.`; }}}]]});
ev('oferta_compra',{k:'Empresa',min:20,cd:8,when:m=>m.biz&&m.biz.value>100000,t:'Proposta de compra',x:'Um grupo grande quer comprar a {b} por {oferta}.',prep:m=>({b:m.biz.n,ov:Math.round(m.biz.value*(1.2+R.f()*.8)),oferta:fmt(m.biz.value*1.5)}),ch:[
 ['Vender',{fn:(m,d)=>{ m.money+=d.ov; log(`Vendi a ${m.biz.n} por ${fmt(d.ov)}.`,'good'); m.biz=null; st('happy',15); return `Vendi a empresa por ${fmt(d.ov)}!`; }}],
 ['Recusar',{t:'A {b} não está à venda.'}]]});
ev('concorrente',{k:'Empresa',min:20,cd:8,when:m=>m.biz,t:'Concorrência',x:'Um concorrente copiou meu principal produto e está vendendo mais barato.',ch:[
 ['Investir em inovação',{$:-20000,fn:m=>{ m.biz.value=Math.round(m.biz.value*1.15); return 'Lancei algo melhor e retomei os clientes.'; }}],
 ['Processar',{$:-15000,p:.4,y:{fn:m=>{ m.biz.value=Math.round(m.biz.value*1.1); return 'Ganhei! O concorrente teve que parar.'; }},n:{t:'Perdi o processo.'}}],
 ['Baixar meus preços',{fn:m=>{ m.biz.value=Math.round(m.biz.value*.9); return 'Guerra de preços. Todo mundo perdeu.'; }}]]});
ev('debate_tv',{k:'Política',min:21,cd:4,when:m=>m.office,t:'Debate na TV',x:'Hoje tem debate ao vivo contra a oposição.',ch:[
 ['Atacar o adversário',{fn:m=>{ const d=R.int(-8,10); m.office.appr=clamp(m.office.appr+d); return d>0?'Destruí o adversário. Virei meme do bem.':'Pareci agressiv'+oa()+'. Pegou mal.'; }}],
 ['Apresentar propostas',{fn:m=>{ m.office.appr=clamp(m.office.appr+R.int(0,6)); return 'Falei de propostas. Foi chato, mas sério.'; }}],
 ['Faltar ao debate',{fn:m=>{ m.office.appr=clamp(m.office.appr-8); return 'Colocaram uma cadeira vazia com meu nome.'; }}]]});
ev('propina',{k:'Política',min:21,cd:6,when:m=>m.office,t:'Envelope pardo',x:'Uma empreiteira me ofereceu {v} para aprovar uma obra.',v:[100000,2000000],ch:[
 ['Aceitar',{$:'v',k:-10,p:.75,y:{t:'O dinheiro foi para uma conta no exterior.'},n:{fn:m=>{ m.office=null; arrest('corrupção passiva',4,15); return 'Era uma operação da Polícia Federal.'; }}}],
 ['Denunciar',{k:10,fn:m=>{ m.office.appr=clamp(m.office.appr+15); m.fame=clamp(m.fame+5); return 'Denunciei e virei símbolo de honestidade.'; }}],
 ['Recusar em silêncio',{k:3,t:'Devolvi o envelope.'}]]});
ev('delator',{k:'Crime',min:16,cd:8,when:m=>m.job&&m.job.spc==='crime',t:'Traição na quadrilha',x:'Descobri que {n}, meu parceir{on} de crime, quer me delatar à polícia.',ch:[
 ['Dar um sumiço em {n}',{k:-20,c:'kills',p:.6,y:{t:'{n} nunca mais foi visto.'},n:{fn:()=>{ arrest('homicídio e associação criminosa',15,35); return 'Deu errado. A polícia chegou antes.'; }}}],
 ['Subornar {n}',{$:-30000,p:.6,y:{t:'{n} aceitou o dinheiro e ficou quieto.'},n:{fn:()=>{ arrest('associação criminosa',4,12); return '{n} pegou o dinheiro e me delatou mesmo assim.'; }}}],
 ['Fugir da cidade',{fn:m=>{ endJob(); return 'Larguei tudo e fui embora.'; }}]]});
ev('curso_oficial',{k:'Forças Armadas',min:18,cd:8,when:m=>m.job&&m.job.spc==='militar'&&m.job.lvl<5,t:'Curso de oficiais',x:'Abriu seleção para o curso de formação de oficiais.',ch:[
 ['Me inscrever',{p:m=>m.smarts/120,y:{fn:m=>{ m.job.lvl=Math.max(m.job.lvl,4); return `Passei! Agora sou ${jobTitle(m.job).toLowerCase()}.`; }},n:{t:'Reprovei no exame físico.'}}],
 ['Não me inscrever',{t:'Estou bem onde estou.'}]]});
ev('live_hate',{k:'Internet',min:13,cd:6,when:m=>m.job&&m.job.spc==='streamer',t:'Ataque na live',x:'Uma horda de haters invadiu minha live.',ch:[
 ['Responder com humor',{p:m=>(m.talent.comedy||30)/100,y:{f:3,t:'Meu deboche viralizou. Ganhei seguidores.'},n:{h:-5,t:'Perdi a paciência ao vivo.'}}],
 ['Banir todo mundo',{t:'Banimento em massa. Paz restaurada.'}]]});
