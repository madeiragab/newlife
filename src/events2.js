// ===== Formato compacto de evento =====
// ev(id,{k,t,x,ch:[[rótulo,efeito],...], min,max,w,cd,when,jail,once,prep,v:[min,max]})
// efeito: texto | {t:'texto'|[variantes], h,hl,sm,lk,k,f,$, add:{}, tal:{}, bond, dis, c, fn:(m,d)=>texto, p:chance|fn, y:{...}, n:{...}}
const tp=(s,d)=>s==null?'':fill(String(s).replace(/\{(\w+)\}/g,(m0,k)=>k==='o'?oa():k==='a'?(S.me.gender==='F'?'a':''):k==='v'?fmt(d.v):k==='v2'?fmt(d.v2)
  :k==='on'||k==='on2'?(d[k==='on'?'nG':'n2G']==='F'?'a':'o'):k==='eln'||k==='eln2'?(d[k==='eln'?'nG':'n2G']==='F'?'ela':'ele'):d[k]!=null?d[k]:m0));
// Desconhecidos dos eventos: {n} e {n2} têm nome, sobrenome e gênero coerentes ({on}/{on2} = o|a, {eln} = ele|ela).
// date: gênero conforme a preferência do personagem · same: mesmo gênero do personagem (ex.: cela da prisão)
const loveGender=m=>m.pref==='A'?(R.chance(.5)?'M':'F'):(m.pref||(m.gender==='M'?'F':'M'));
function strangers(m,o){
  const gd=o&&o.date?loveGender(m):o&&o.same?m.gender:o&&o.gn?o.gn:null;
  const a=stranger(gd?{gender:gd}:{}), b=stranger(o&&o.same?{gender:m.gender}:{});
  const kid=m.age<18, nAge=clamp(m.age+(kid?R.int(-1,1):R.int(-7,7)),Math.max(1,kid?m.age-2:18),99);
  return {n:a.first,nl:a.last,nG:a.gender,nAge,n2:b.first,n2l:b.last,n2G:b.gender};
}
// Transforma o desconhecido do evento em uma pessoa de verdade na lista de relações (uma vez só por evento).
function meetP(d,rel='amigo',key='n',o={}){
  const m=S.me; if(d['met_'+key]&&P(d['met_'+key])) return P(d['met_'+key]);
  if(!d[key]) return null; if(rel==='namoro'&&partner()) rel='amigo';
  const kid=m.age<18, age=o.age??(key==='n'&&d.nAge?d.nAge:null)??clamp(m.age+(kid?R.int(-1,1):R.int(-7,7)),Math.max(1,kid?m.age-2:18),99);
  const p=mkPerson(Object.assign({rel,first:d[key],last:d[key+'l'],gender:d[key+'G'],age,bond:R.int(55,75)},o));
  if(key==='n'&&d.nFace){ p.genes=d.nFace.genes; p.look=d.nFace.look; }
  S.people.push(p); d['met_'+key]=p.id; if(!d.pid) d.pid=p.id;
  if(rel==='namoro'){ p.bond=Math.max(p.bond,70); cnt('partners'); }
  return p;
}
// Rosto do desconhecido mostrado no evento (o mesmo que ele terá se virar amigo)
function strangerFace(d){
  if(!d||!d.n||!d.nG) return null;
  if(!d.nFace){ const t={id:hashS(d.n+(d.nl||'')),gender:d.nG,age:d.nAge||30,genes:randGenes(d.nG)}; ensureLook(t); d.nFace={genes:t.genes,look:t.look}; }
  return {id:hashS(d.n+(d.nl||'')),gender:d.nG,age:d.nAge||30,bond:70,genes:d.nFace.genes,look:d.nFace.look};
}
function fx(e,d){
  if(e==null) return '';
  if(typeof e==='string') return tp(e,d);
  const m=S.me;
  if(e.h) st('happy',e.h); if(e.hl) st('health',e.hl); if(e.sm) st('smarts',e.sm); if(e.lk) st('looks',e.lk);
  if(e.k) m.karma=clamp(m.karma+e.k); if(e.f) m.fame=clamp(m.fame+e.f);
  if(e.$!=null){ const v=e.$==='v'?d.v:e.$==='-v'?-d.v:e.$==='v2'?d.v2:e.$==='-v2'?-d.v2:e.$; m.money+=v; }
  if(e.add) for(const a in e.add) m.add[a]=clamp(m.add[a]+e.add[a]*(1.3-m.will/100));
  if(e.tal) for(const a in e.tal) m.talent[a]=clamp((m.talent[a]||0)+e.tal[a]);
  if(e.bond&&d.pid){ const p=P(d.pid); if(p) p.bond=clamp(p.bond+e.bond); }
  if(e.dis) addDisease(e.dis);
  if(e.c) cnt(e.c);
  if(e.meet) meetP(d,e.meet,e.meetKey||'n');
  const extra=e.fn?tp(e.fn(m,d)||'',d):'';
  const t=Array.isArray(e.t)?R.pick(e.t):e.t;
  let branch=''; if(e.p!=null){ const p=typeof e.p==='function'?e.p(S.me,d):e.p; branch=fx(R.chance(p)?e.y:e.n,d); }
  return [t?tp(t,d):'',extra,branch].filter(Boolean).join(' ');
}
function ev(id,o){
  EVENTS[id]={w:o.w??1.3,cd:o.cd??10,jail:o.jail,onceLife:o.once,
    when:m=>(o.min==null||m.age>=o.min)&&(o.max==null||m.age<=o.max)&&(!o.when||o.when(m)),
    prep:m=>{ const extra=o.prep?o.prep(m):{}; if(extra===null) return null; const v=o.v||[50,500];
      return Object.assign(strangers(m,o),{v:amt(v[0],v[1]),v2:amt(v[0]*3,v[1]*3),xi:R.int(0,(Array.isArray(o.x)?o.x.length:1)-1)},extra); },
    show:d=>({k:o.k,t:tp(o.t,d),x:tp(Array.isArray(o.x)?o.x[d.xi]:o.x,d),ch:o.ch.filter(c=>!c[2]||c[2](S.me,d)).map(c=>[tp(c[0],d),String(o.ch.indexOf(c))])}),
    pick:(key,d)=>fx(o.ch[+key][1],d)};
}
const withP=(...rels)=>m=>{ const ps=people(...rels); if(!ps.length) return null; const p=R.pick(ps); return {pid:p.id,n:p.first,nl:p.last,nG:p.gender}; };
let addPet=(sp,name)=>{ const s=PETS.find(x=>x.s.startsWith(sp))||PETS[0]; const gd=R.chance(.5)?'M':'F'; const p=mkPerson({rel:'pet',first:name||R.pick(PET_NAMES),gender:gd,species:s.s,age:R.int(0,4),bond:80}); p.life=p.age+R.int(...s.life); S.people.push(p); cnt('pets'); return p; };

// ---------- infância ----------
ev('aniv_festa',{k:'Família',min:4,max:11,cd:4,t:'Meu aniversário',x:['Meus pais perguntaram que festa eu quero.','Vou fazer {idade} anos e posso escolher o tema da festa.'],prep:m=>({idade:m.age+1}),ch:[
 ['Tema de super-heróis',{h:6,t:['A festa foi incrível. Até o palhaço chorou de emoção.','Ganhei {toy} e comi brigadeiro até passar mal.']}],
 ['Tema de dinossauros',{h:6,t:'Um primo chorou de medo do dinossauro inflável. Melhor festa.'}],
 ['Festa do pijama com os amigos',{h:5,t:'Ficamos acordados até as 3h contando histórias de terror.'}],
 ['Não quero festa',{h:-2,t:'Passei o dia vendo desenho. Ninguém entendeu.'}]]});
ev('dente_fada',{k:'Infância',min:5,max:9,once:1,t:'O dente caiu!',x:'Meu dente de leite caiu. Coloquei embaixo do travesseiro.',v:[2,50],ch:[
 ['Esperar a fada do dente',{p:.85,y:{$:'v',h:4,t:'A fada do dente deixou {v} debaixo do travesseiro!'},n:{h:-3,t:'A fada esqueceu de passar. Fiquei arrasad{o}.'}}],
 ['Ficar acordad{o} para ver a fada',{t:'Peguei meu pai no flagra colocando o dinheiro. A magia acabou.',h:-2,$:'v'}]]});
ev('excursao',{k:'Escola',min:6,max:14,cd:4,when:m=>m.edu.cur,t:'Excursão da escola',x:['A turma vai ao {lugar}.','Excursão marcada para o {lugar}. Precisa da autorização assinada.'],prep:()=>({lugar:R.pick(['museu de ciências','zoológico','planetário','museu histórico','aquário','sítio da escola'])}),ch:[
 ['Ir na excursão',{h:5,sm:1,t:['Foi demais. Vomitei no ônibus, mas foi demais.','Me perdi do grupo por 20 minutos e virei lenda na escola.','Aprendi um monte e comprei um chaveiro inútil.']}],
 ['Fingir que estou doente',{h:-2,t:'Fiquei em casa e todo mundo voltou falando da excursão.'}]]});
ev('bike',{k:'Infância',min:4,max:9,once:1,t:'Sem rodinhas',x:'Hoje vou tentar andar de bicicleta sem as rodinhas.',ch:[
 ['Tentar com coragem',{p:.65,y:{h:6,tal:{athletic:2},t:'Consegui de primeira! Andei a rua inteira.'},n:{hl:-3,t:'Caí e ralei os dois joelhos. Amanhã tento de novo.'}}],
 ['Pedir para alguém segurar',{h:3,t:'Meu pai segurou o banco e soltou sem eu perceber. Consegui!'}]]});
ev('amigo_imag',{k:'Infância',min:3,max:7,once:1,t:'Amigo imaginário',x:'Inventei um amigo imaginário chamado {n}.',ch:[
 ['Apresentar {n} para a família',{h:3,t:'Agora a família guarda um lugar para {n} na mesa.'}],
 ['Manter {n} em segredo',{h:2,t:'{n} e eu temos várias aventuras secretas.'}]]});
ev('pipa',{k:'Rua',min:6,max:14,cd:6,t:'Pipa enroscada',x:'Minha pipa enroscou nos fios do poste.',ch:[
 ['Subir no muro para pegar',{p:.6,y:{h:3,t:'Peguei a pipa de volta.'},n:{hl:-8,t:'Caí do muro e torci o pé.'}}],
 ['Pedir ajuda a um adulto',{t:'Um vizinho tirou com um cabo de vassoura.'}],
 ['Deixar lá',{h:-2,t:'A pipa ficou lá por meses, me olhando.'}]]});
ev('controle_tv',{k:'Família',min:4,max:12,cd:6,t:'Controle quebrado',x:'Sem querer, quebrei o controle da TV.',ch:[
 ['Contar a verdade',{k:3,t:'Fiquei de castigo, mas meus pais gostaram da sinceridade.'}],
 ['Culpar o cachorro',{p:.5,y:{t:'Colou. O cachorro está de castigo.'},n:{k:-2,t:'Ninguém acreditou. Castigo dobrado.'}}],
 ['Esconder o controle',{k:-2,t:'Meu pai virou a casa do avesso procurando.'}]]});
ev('hamster_turma',{k:'Escola',min:6,max:10,once:1,when:m=>m.edu.cur,t:'O hamster da turma',x:'É minha vez de levar o hamster da turma para casa no fim de semana.',ch:[
 ['Cuidar direitinho',{k:3,h:3,t:'O hamster voltou mais gordo e feliz.'}],
 ['Deixar ele passear pela casa',{p:.6,y:{h:4,t:'Ele explorou a casa toda e voltou para a gaiola sozinho.'},n:{h:-5,t:'Ele sumiu atrás da geladeira. Tive que explicar para a turma.'}}]]});
ev('piolho',{k:'Escola',min:4,max:11,cd:5,t:'Piolho!',x:'A escola mandou um bilhete: surto de piolho. E eu peguei.',ch:[
 ['Passar o pente fino',{h:-2,t:'Uma semana de pente fino e xampu fedido.'}],
 ['Raspar a cabeça',{h:-1,fn:m=>{ ensureLook(m).hair='raspado'; return 'Raspei tudo. Pelo menos agora tá fresquinho.'; }}]]});
ev('teatro_escola',{k:'Escola',min:5,max:12,cd:4,when:m=>m.edu.cur,t:'Peça da escola',x:['Vou participar da peça de fim de ano.','A professora está distribuindo os papéis da peça.'],ch:[
 ['Pedir o papel principal',{p:m=>m.talent.acting/100+.2,y:{tal:{acting:4},h:6,t:'Fui o destaque da peça. Os pais aplaudiram de pé.'},n:{h:-3,t:'Fiquei com o papel de árvore. Sem falas.'}}],
 ['Ficar nos bastidores',{tal:{art:2},t:'Pintei o cenário inteiro.'}]]});
ev('desenho',{k:'Talento',min:5,max:13,cd:5,t:'Concurso de desenho',x:'A prefeitura abriu um concurso de desenho para crianças.',v:[50,500],ch:[
 ['Participar',{p:m=>(m.talent.art||0)/130+.05,y:{$:'v',h:8,tal:{art:4},t:'Ganhei o concurso e {v} de prêmio!'},n:{tal:{art:2},t:'Não ganhei, mas meu desenho ficou exposto na prefeitura.'}}],
 ['Não participar',{t:'Fica para o ano que vem.'}]]});
ev('soletrando',{k:'Escola',min:7,max:13,cd:5,when:m=>m.edu.cur,t:'Campeonato de soletrar',x:'Fui escolhid{o} para o campeonato de soletrar da escola.',ch:[
 ['Treinar muito',{p:m=>m.smarts/110,y:{sm:3,h:6,t:'Soletrei "{palavra}" e venci!'},n:{sm:1,t:'Errei "{palavra}" na final.'}}],
 ['Ir sem treinar',{p:m=>m.smarts/180,y:{h:5,t:'Venci sem nem estudar.'},n:{h:-2,t:'Caí na primeira rodada.'}}]],prep:()=>({palavra:R.pick(['paralelepípedo','otorrinolaringologista','exceção','ascensão','idiossincrasia','pneumonia'])})});
ev('bola_vizinho',{k:'Rua',min:5,max:13,cd:5,t:'A bola caiu no vizinho',x:'Nossa bola caiu no quintal do vizinho mais bravo da rua.',ch:[
 ['Pular o muro',{p:.55,y:{h:4,t:'Peguei a bola e saí correndo. Missão cumprida.'},n:{h:-4,t:'O cachorro dele me perseguiu até o portão.'}}],
 ['Tocar a campainha',{p:.5,y:{k:2,t:'Ele devolveu, resmungando.'},n:{h:-2,t:'Ele furou a bola na nossa frente.'}}],
 ['Desistir da bola',{t:'Perdemos mais uma bola para o vizinho.'}]]});
ev('primo',{k:'Família',min:5,max:13,cd:6,t:'Visita do primo',x:'Meu primo {n} vai passar as férias aqui em casa.',gn:'M',ch:[
 ['Brincar junto o tempo todo',{h:5,t:'Viramos melhores amigos por um mês.'}],
 ['Pregar uma peça nele',{h:3,k:-1,t:'Coloquei sal no suco dele. Ele jurou vingança.'}],
 ['Me trancar no quarto',{h:-2,t:'Ele mexeu em todos os meus brinquedos.'}]]});
ev('estranho_doce',{k:'Rua',min:4,max:10,once:1,t:'Desconhecido na saída',x:'Um homem que eu não conheço ofereceu doces na saída da escola.',ch:[
 ['Recusar e avisar a professora',{k:3,sm:1,t:'A escola chamou a polícia. Meus pais ficaram orgulhosos.'}],
 ['Aceitar o doce',{h:-4,t:'Minha mãe chegou na hora, me puxou pelo braço e tivemos uma conversa séria.'}]]});
ev('boletim',{k:'Escola',min:7,max:16,cd:3,when:m=>m.edu.cur&&m.edu.cur.grade<55,t:'Boletim vermelho',x:'Meu boletim veio cheio de notas vermelhas.',ch:[
 ['Mostrar para os meus pais',{k:2,t:'Levei bronca, mas eles me ajudaram a estudar.',fn:m=>{ m.edu.cur.grade=clamp(m.edu.cur.grade+4); }}],
 ['Esconder o boletim',{p:.4,y:{t:'Ninguém descobriu. Por enquanto.'},n:{k:-2,t:'A escola ligou. Castigo de um mês sem videogame.'}}],
 ['Falsificar a assinatura',{k:-4,p:.5,y:{t:'Ninguém percebeu a assinatura tremida.'},n:{t:'A coordenadora percebeu. Fui suspens{o}.'}}]]});
ev('festa_pijama',{k:'Social',min:7,max:14,cd:4,t:'Festa do pijama',x:'{n} me chamou para uma festa do pijama.',ch:[
 ['Ir',{h:6,meet:'amigo',t:['Contamos histórias de terror e ninguém dormiu.','Fizemos guerra de travesseiros até quebrar um abajur.']}],
 ['Não ir',{h:-2,t:'Fiquei em casa ouvindo falar da festa por semanas.'}]]});
ev('youtuber_mirim',{k:'Internet',min:8,max:13,once:1,t:'Youtuber mirim',x:'Decidi que vou ser youtuber.',ch:[
 ['Gravar vídeos de jogos',{p:.15,y:{f:4,h:8,t:'Um vídeo meu passou de 100 mil visualizações!',fn:m=>{ if(!m.social) m.social={f:0,u:'@'+m.first.toLowerCase()+R.int(10,99)}; m.social.f+=R.int(5000,50000); }},n:{h:-2,t:'Meus vídeos têm 12 visualizações. Todas da minha avó.'}}],
 ['Desistir antes de começar',{t:'Ser youtuber parece dar muito trabalho.'}]]});
ev('arvore',{k:'Rua',min:6,max:13,cd:6,t:'A mangueira mais alta',x:'Os amigos me desafiaram a subir no galho mais alto da mangueira.',ch:[
 ['Subir até o topo',{p:.7,y:{h:6,tal:{athletic:2},t:'Cheguei ao topo e virei lenda do bairro.'},n:{hl:-12,t:'O galho quebrou. Quebrei o braço.'}}],
 ['Recusar o desafio',{h:-2,t:'Me chamaram de medros{o} a semana toda.'}]]});
ev('escoteiros',{k:'Social',min:7,max:13,once:1,t:'Escoteiros',x:'Abriu um grupo de escoteiros no bairro.',ch:[
 ['Entrar no grupo',{k:3,hl:3,tal:{athletic:3},t:'Aprendi a fazer fogueira, nós e a montar barraca.'}],
 ['Não entrar',{t:'Prefiro dormir no sábado de manhã.'}]]});
ev('natacao',{k:'Infância',min:4,max:10,once:1,t:'Aula de natação',x:'Primeira aula de natação. A piscina parece enorme.',ch:[
 ['Pular de uma vez',{p:.7,y:{tal:{athletic:3},h:4,t:'Boiei de primeira! O professor ficou impressionado.'},n:{h:-3,t:'Engoli metade da piscina.'}}],
 ['Ficar agarrad{o} na borda',{t:'Passei a aula inteira na borda. Semana que vem eu tento.'}]]});
ev('sorvete',{k:'Rua',min:3,max:12,cd:4,t:'O sorveteiro',x:'O carrinho de sorvete passou e eu não tenho dinheiro.',ch:[
 ['Pedir para a minha mãe',{p:.6,y:{h:3,t:'Ganhei um picolé de {fruta}.'},n:{h:-2,t:'"Sorvete antes do almoço? Nem pensar."'}}],
 ['Fazer cara de pidão para o sorveteiro',{p:.3,y:{h:5,t:'Ele me deu um picolé de graça!'},n:{t:'Não funcionou.'}}]],prep:()=>({fruta:R.pick(['morango','limão','coco','uva','abacaxi','chocolate'])})});
ev('medo_escuro',{k:'Infância',min:3,max:8,once:1,t:'Monstro no armário',x:'Tenho certeza de que tem um monstro no meu armário.',ch:[
 ['Dormir com a luz acesa',{t:'A luz acesa espantou o monstro. Por enquanto.'}],
 ['Enfrentar o monstro',{h:4,t:'Abri o armário com coragem. Só tinha roupa suja.'}],
 ['Dormir na cama dos meus pais',{t:'Meu pai acordou com um pé meu na cara.'}]]});
ev('briga_irmao',{k:'Família',min:4,max:17,cd:4,prep:withP('irmao'),t:'Briga com {n}',x:['{n} pegou minhas coisas sem pedir.','{n} contou um segredo meu para a família toda.','{n} e eu brigamos pelo controle da TV.'],ch:[
 ['Fazer as pazes',{bond:6,k:2,t:'Nos abraçamos e tudo ficou bem.'}],
 ['Dar o troco',{bond:-8,h:2,t:'Escondi o carregador do celular de {n}. Guerra declarada.'}],
 ['Chamar os pais',{bond:-3,t:'Os dois ficaram de castigo.'}]]});

// ---------- adolescência ----------
ev('primeiro_beijo',{k:'Coração',min:12,max:17,once:1,t:'Primeiro beijo?',x:'Na festa, {n} chegou perto e o clima ficou estranho.',date:1,ch:[
 ['Beijar',{p:.7,y:{h:10,meet:'amigo',t:'Meu primeiro beijo! Foi meio desajeitado, mas foi.'},n:{h:-6,t:'Batemos os dentes. Vergonha eterna.'}}],
 ['Sair correndo',{h:-3,t:'Fugi para o banheiro. Ninguém entendeu.'}]]});
ev('espinha',{k:'Estilo',min:12,max:18,cd:4,t:'A espinha',x:'Apareceu uma espinha gigante bem no dia da foto da turma.',ch:[
 ['Espremer',{lk:-2,t:'Ficou pior. Saí na foto com um vulcão no nariz.'}],
 ['Esconder com maquiagem',{t:'Ninguém percebeu na foto.'}],
 ['Faltar no dia da foto',{t:'No álbum da turma tem um quadrado cinza no meu lugar.'}]]});
ev('celular_conf',{k:'Escola',min:11,max:18,cd:5,when:m=>m.edu.cur,t:'Celular confiscado',x:'O professor pegou meu celular durante a aula.',ch:[
 ['Aceitar e pedir desculpas',{k:1,t:'Recebi o celular no fim do dia.'}],
 ['Discutir com o professor',{p:.3,y:{t:'Ele devolveu só para eu parar de falar.'},n:{t:'Fui parar na diretoria e meus pais foram chamados.'}}],
 ['Pegar de volta escondido',{k:-2,p:.5,y:{h:3,t:'Peguei da mesa dele no intervalo. Ninguém viu.'},n:{t:'Peguei, mas a câmera do corredor gravou. Suspensão.'}}]]});
ev('simulado',{k:'Estudos',min:15,max:18,cd:2,when:m=>m.edu.cur&&m.edu.cur.type==='medio',t:'Simulado do vestibular',x:'Hoje tem simulado do vestibular.',ch:[
 ['Fazer com calma',{fn:m=>{ const n=clamp(m.smarts+R.int(-20,15)); m.c.simulado=n; return n>75?`Fiquei entre os primeiros da escola, com ${n} pontos.`:n>50?`Tirei ${n} pontos. Dá para melhorar.`:`Tirei ${n} pontos. Preciso estudar mais.`; }}],
 ['Chutar tudo e ir embora cedo',{h:2,t:'Chutei "C" em tudo. Acertei 20%.'}]]});
ev('fugir_noite',{k:'Tentação',min:14,max:17,cd:3,t:'Sair escondid{o}',x:'Meus amigos vão a um show hoje à noite e meus pais não deixaram.',ch:[
 ['Pular a janela e ir',{h:6,p:.55,y:{t:'Voltei antes do sol nascer. Ninguém percebeu.'},n:{t:'Minha mãe estava me esperando na sala com a luz apagada.',fn:m=>{ parents().forEach(p=>p.bond=clamp(p.bond-10)); }}}],
 ['Obedecer',{h:-3,t:'Fiquei em casa vendo os stories de todo mundo.'}]]});
ev('bico_padaria',{k:'Trabalho',min:14,max:17,cd:6,when:m=>!m.job,t:'Bico na padaria',x:'O dono da padaria da esquina me ofereceu um bico de fim de semana.',v:[200,1200],ch:[
 ['Aceitar',{$:'v',h:2,t:'Ganhei {v} e aprendi a fazer pão francês.'}],
 ['Recusar',{t:'Final de semana é sagrado.'}]]});
ev('bullying_net',{k:'Internet',min:12,max:19,cd:5,t:'Ataque na internet',x:'Postaram uma montagem minha no grupo da escola.',ch:[
 ['Denunciar à coordenação',{k:2,p:.6,y:{t:'Quem fez foi suspenso.'},n:{h:-5,t:'A escola não fez nada.'}}],
 ['Responder com outra montagem',{k:-2,h:2,t:'Virou uma guerra de memes que durou o semestre.'}],
 ['Ignorar',{h:-6,t:'Doeu, mas passou.'}]]});
ev('show_fav',{k:'Música',min:13,max:25,cd:4,t:'Show da banda favorita',x:'A banda que eu mais amo vai tocar na cidade. O ingresso custa {v}.',v:[150,900],ch:[
 ['Comprar o ingresso',{$:'-v',h:10,t:['Foi o melhor dia da minha vida.','Peguei a palheta do guitarrista!','Chorei na música favorita.']}],
 ['Tentar entrar de penetra',{k:-2,p:.25,y:{h:12,t:'Entrei pelos fundos com a equipe de som!'},n:{h:-4,t:'O segurança me pegou na grade.'}}],
 ['Não ir',{h:-5,t:'Assisti trechos pelos stories dos outros.'}]]});
ev('dirigir_pai',{k:'Família',min:14,max:17,once:1,when:m=>parents().length,t:'Primeira vez no volante',x:'Me deixaram dirigir o carro da família no estacionamento vazio.',ch:[
 ['Ir devagar',{h:4,t:'Dirigi direitinho. Já me sinto adult{o}.'}],
 ['Acelerar para impressionar',{p:.5,y:{h:6,t:'Fiz um cavalo de pau perfeito.'},n:{$:-2000,t:'Bati no único poste do estacionamento. Conserto: $2.000.'}}]]});
ev('desafio_viral',{k:'Internet',min:12,max:25,cd:5,t:'Desafio viral',x:['Todo mundo está fazendo o desafio do {des}.','Um desafio perigoso está bombando: o do {des}.'],prep:()=>({des:R.pick(['balde de gelo','pulo do telhado na piscina','chiclete com pimenta','apagão (prender a respiração)','skate na ladeira'])}),ch:[
 ['Fazer o desafio',{p:.6,y:{h:5,f:1,t:'Meu vídeo do desafio rodou o grupo da escola.'},n:{hl:-12,t:'Deu errado e fui parar no pronto-socorro.'}}],
 ['Não fazer',{sm:1,t:'Não preciso disso para ser legal.'}]]});
ev('cola_venda',{k:'Ética',min:13,max:24,cd:5,when:m=>m.edu.cur,t:'Respostas à venda',x:'Um grupo está vendendo as respostas da prova final por {v}.',v:[30,200],ch:[
 ['Comprar',{$:'-v',k:-3,p:.7,y:{t:'Fui muito bem na prova.',fn:m=>{ m.edu.cur.grade=clamp(m.edu.cur.grade+10); }},n:{t:'As respostas eram falsas. Perdi o dinheiro e fui mal.'}}],
 ['Recusar',{k:1,t:'Estudei na raça mesmo.'}],
 ['Denunciar',{k:4,t:'A prova foi trocada e o grupo foi expulso.'}]]});
ev('diario',{k:'Família',min:10,max:17,once:1,prep:withP('irmao'),t:'Meu diário',x:'{n} leu meu diário e contou tudo.',ch:[
 ['Brigar feio',{bond:-15,t:'A casa tremeu.'}],
 ['Ler o celular de {n} de vingança',{bond:-6,k:-1,t:'Descobri coisas que eu preferia não saber.'}],
 ['Deixar para lá',{h:-4,t:'Escondi o diário num lugar novo.'}]]});
ev('baile_formatura',{k:'Escola',min:17,max:18,once:1,when:m=>m.edu.cur&&m.edu.cur.type==='medio',t:'Baile de formatura',x:'O baile de formatura está chegando.',date:1,ch:[
 ['Convidar {n} para ser meu par',{p:.6,y:{h:10,meet:'amigo',t:'{n} aceitou! Dançamos a noite toda.'},n:{h:-6,t:'{n} já tinha par. Fui com os amigos.'}}],
 ['Ir com os amigos',{h:6,t:'Dançamos até os pés doerem.'}],
 ['Não ir',{h:-3,t:'Fiquei em casa. Não me arrependo. Muito.'}]]});
ev('intercambio',{k:'Oportunidade',min:15,max:22,once:1,when:m=>m.smarts>=55&&(famMoney()>40000||m.money>40000),t:'Intercâmbio',x:'Surgiu uma vaga de intercâmbio de seis meses em {lugar}.',prep:()=>({lugar:R.pick(['Toronto','Dublin','Sydney','Barcelona','Tóquio','Berlim','Nova Zelândia'])}),ch:[
 ['Ir',{$:-30000,sm:5,h:12,c:'trips',t:'Voltei falando outra língua e cheio de histórias.'}],
 ['Ficar',{t:'Fica para a próxima.'}]]});
ev('vegetariano',{k:'Estilo',min:13,max:40,once:1,t:'Carne ou não?',x:'Vi um documentário sobre a indústria da carne e fiquei pensando.',ch:[
 ['Virar vegetarian{o}',{hl:2,k:2,t:'Já faz meses sem carne. Me sinto bem.'}],
 ['Continuar como antes',{t:'O churrasco de domingo continua.'}]]});
ev('jogo_online',{k:'Internet',min:11,max:30,cd:5,t:'Só mais uma partida',x:'Estou jogando {jogo} até de madrugada todo dia.',prep:()=>({jogo:R.pick(['um jogo de tiro online','um RPG coreano','um jogo de construir cidades','um battle royale','um jogo de cartas online'])}),ch:[
 ['Continuar jogando',{sm:-1,h:4,hl:-1,t:'Cheguei no ranking mais alto. Minhas olheiras também.'}],
 ['Desinstalar o jogo',{sm:1,h:-2,t:'Desinstalei. Reinstalei dois dias depois. Desinstalei de novo.'}]]});
ev('maquiagem1',{k:'Estilo',min:12,max:16,once:1,t:'Primeira vez',x:'Hoje resolvi {coisa} pela primeira vez sozinh{o}.',prep:m=>({coisa:m.gender==='F'?'me maquiar':'fazer a barba'}),ch:[
 ['Caprichar',{p:.5,y:{lk:2,h:3,t:'Ficou ótimo!'},n:{lk:-1,t:'Ficou um desastre. Todo mundo riu.'}}],
 ['Pedir ajuda',{lk:1,t:'Com ajuda ficou bem melhor.'}]]});
ev('grafite',{k:'Arte',min:13,max:30,cd:6,t:'Muro em branco',x:'Tem um muro enorme em branco perto de casa.',ch:[
 ['Grafitar sem pedir',{tal:{art:3},p:.7,y:{h:5,t:'Ficou lindo. Os vizinhos até gostaram.'},n:{t:'A polícia me pegou com a lata na mão.',fn:m=>{ if(m.age>=18) arrest('pichação',0,1); }}}],
 ['Pedir autorização ao dono',{p:.6,y:{tal:{art:5},h:6,k:2,t:'Ele deixou! Pintei um mural que virou ponto turístico do bairro.'},n:{t:'Ele disse que não.'}}]]});
ev('banda_garagem',{k:'Música',min:13,max:22,cd:8,t:'Banda de garagem',x:'Uns amigos querem montar uma banda na garagem de {n}.',ch:[
 ['Entrar na banda',{tal:{musical:4},h:5,meet:'amigo',t:['Nosso primeiro ensaio foi barulhento e glorioso.','Fizemos um show no aniversário de um primo. Três pessoas aplaudiram.']}],
 ['Não entrar',{t:'Música não é minha praia.'}]]});
ev('olimpiada',{k:'Estudos',min:11,max:18,cd:3,when:m=>m.edu.cur&&m.smarts>=60,t:'Olimpíada de matemática',x:'Fui convidad{o} para a olimpíada de matemática.',ch:[
 ['Participar',{p:m=>(m.smarts-40)/70,y:{sm:3,h:8,t:'Ganhei medalha de {med}!'},n:{sm:1,t:'Não ganhei medalha, mas aprendi muito.'}}],
 ['Recusar',{t:'Matemática no sábado? Não.'}]],prep:()=>({med:R.pick(['ouro','prata','bronze'])})});
ev('fofoca',{k:'Escola',min:11,max:19,cd:4,t:'Fofoca',x:'Espalharam que {fofoca}.',prep:m=>({fofoca:R.pick(['eu gosto do '+(people('colega')[0]||{first:'professor'}).first,'eu colei na prova','eu durmo com luz acesa','eu fui reprovad'+oa()+' duas vezes'])}),ch:[
 ['Desmentir',{p:.5,y:{t:'Todo mundo acreditou em mim.'},n:{h:-4,t:'Quanto mais eu negava, mais acreditavam.'}}],
 ['Rir junto',{h:2,t:'Levar na brincadeira fez a fofoca morrer.'}],
 ['Descobrir quem espalhou',{k:-1,t:'Descobri quem foi. Agora somos inimigos.'}]]});
ev('quinze_anos',{k:'Família',min:15,max:15,once:1,t:'Quinze anos',x:'Meus pais querem comemorar meus 15 anos.',ch:[
 ['Festão com valsa',{h:10,$:-15000,t:'Dancei a valsa, chorei e comi muito bem-casado.'}],
 ['Viagem em vez de festa',{h:8,$:-10000,c:'trips',t:'Fui conhecer {lugar} com a família.'}],
 ['Nada de festa',{t:'Só um bolo em casa. Do jeito que eu queria.'}]],prep:()=>({lugar:R.pick(['a Disney','Buenos Aires','o Nordeste','Gramado','Portugal'])})});
ev('trabalho_grupo',{k:'Escola',min:11,max:24,cd:3,when:m=>m.edu.cur,t:'Trabalho em grupo',x:'Ninguém do meu grupo está fazendo nada no trabalho.',ch:[
 ['Fazer tudo sozinh{o}',{sm:2,h:-4,t:'Tirei 10. O grupo todo tirou 10. Injusto.',fn:m=>{ m.edu.cur.grade=clamp(m.edu.cur.grade+3); }}],
 ['Contar para o professor',{k:1,t:'O professor deu notas separadas. Justiça.'}],
 ['Fazer corpo mole também',{t:'Tiramos 4. Todo mundo.',fn:m=>{ m.edu.cur.grade=clamp(m.edu.cur.grade-4); }}]]});
ev('briga_intervalo',{k:'Escola',min:11,max:17,cd:3,when:m=>m.edu.cur,t:'Briga no intervalo',x:'Começou uma briga no pátio na hora do intervalo.',ch:[
 ['Separar a briga',{k:3,p:.7,y:{t:'Consegui acalmar todo mundo.'},n:{hl:-5,t:'Levei um soco perdido.'}}],
 ['Filmar',{f:1,k:-1,t:'Meu vídeo rodou a cidade toda.'}],
 ['Entrar na briga',{p:.5,y:{h:3,t:'Saí por cima.'},n:{hl:-8,t:'Fui suspens{o} e ainda apanhei.'}}]]});
ev('bolsa_cursinho',{k:'Estudos',min:16,max:18,once:1,when:m=>m.smarts>=70,t:'Bolsa no cursinho',x:'Ganhei uma bolsa integral num cursinho pré-vestibular.',ch:[
 ['Aceitar',{sm:3,c:'cursinho',t:'Estou estudando como nunca.'}],
 ['Recusar',{t:'Vou estudar por conta própria.'}]]});
ev('vestibular_ansiedade',{k:'Estudos',min:17,max:18,once:1,t:'Véspera do vestibular',x:'Amanhã é o vestibular e eu não consigo dormir.',ch:[
 ['Revisar tudo de novo',{sm:1,hl:-2,t:'Dormi duas horas. Mas revisei.'}],
 ['Tomar um chá e dormir',{h:3,t:'Acordei descansad{o} e confiante.'}],
 ['Ir para uma festa esquecer',{h:4,add:{alcool:5},t:'Fiz a prova com ressaca.'}]]});
