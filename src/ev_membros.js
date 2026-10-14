// ===== Eventos com os membros das equipes =====
// quem é sorteado para o evento ({p}): colega de time, colega de turma, professor, colega de trabalho, chefe, equipe da carreira, herói da equipe, fiel, gabinete, funcionário, corte
const grpOf=pre=>()=>R.pick(people('equipe').filter(p=>p.grp&&p.grp.startsWith(pre)));
Object.assign(WHO,{clube:grpOf('club:'),spcEq:grpOf('spc:'),heroEq:grpOf('hero:'),fiel:grpOf('seita:'),gabinete:grpOf('office:'),func:grpOf('biz:'),corte:grpOf('corte:'),prof:()=>R.pick(people('prof'))});
// moradores dos mundos paralelos ({mor}, {mo} = o|a)
function scGenteFor(key){ const sc=S.scen; if(!sc) return null; const n=key==='zbase'?(sc.zb?sc.zb.pop:0):key==='vila'?(sc.vila?sc.vila.pop:0):0; if(n<=0) return null; const L=scGente(key,n); return L.length?R.pick(L):null; }
// os grupos se formam sozinhos todo ano (não precisa abrir a tela)
function grpAuto(){ const m=S.me; if(!m||!m.alive) return;
  const c=m.edu.club&&clubDef(); if(c) grpEnsure('club:'+m.edu.club,R.int(6,9),{n:c.n,role:c.st==='athletic'?'Colega de time':c.st==='musical'?'Colega de banda':'Colega de clube',age:()=>clamp(m.age+R.int(-1,1),5,30)});
  if(m.edu.cur) turmaEnsure();
  const j=m.job; if(j&&!j.hero&&!j.spc) trabEnsure();
  if(j&&j.spc&&SPC_ROLE[j.spc]) grpEnsure('spc:'+j.spc+':'+j.co,R.int(5,8),{n:j.co,role:SPC_ROLE[j.spc][0],age:()=>clamp(m.age+R.int(-8,12),16,80)});
  if(j&&j.hero) grpEnsure('hero:'+j.hero,R.int(5,8),{n:HTEAMS[j.hero].n,role:'Herói da equipe|Heroína da equipe',age:()=>R.int(19,55)});
  if(m.seita) grpEnsure('seita:'+m.seita.n,R.int(5,8),{n:m.seita.n,role:m.seita.membro?'Irmão de fé|Irmã de fé':'Fiel',age:()=>R.int(18,75)});
  if(m.office){ const dit=!!m.office.dit; grpEnsure('office:'+m.office.id+(dit?':dit':''),R.int(5,9),{n:dit?'Governo':'Gabinete',role:dit?'Ministro|Ministra':OF_ROLE[m.office.id]||'Assessor|Assessora',roles:dit?DIT_ROLES:null,age:()=>R.int(25,70)}); }
  if(m.biz) grpEnsure('biz:'+m.biz.n,Math.max(3,Math.min(12,m.biz.emp||5)),{n:m.biz.n,role:'Funcionário|Funcionária',roles:['Funcionário|Funcionária','Gerente','Estagiário|Estagiária','Vendedor|Vendedora','Analista','Atendente'],age:()=>R.int(18,65)});
  if(m.royal&&!m.royal.abd) grpEnsure('corte:'+m.royal.house,R.int(6,10),{n:'Corte '+m.royal.house,role:'Membro da corte',roles:ROYAL_ROLES,age:()=>R.int(20,75)}); }
yearMoney=(o=>function(){ const r=o.apply(this,arguments); try{ grpAuto(); }catch(e){} return r; })(yearMoney);
// tokens: pamigo pnamoro pinimigo psai (o {p}) · glv±n gsai gmorre gcrew (o morador {mor})
extTok=(o=>function(tok,d,out){ const m=S.me, p=d&&typeof d.pid==='number'?P(d.pid):null; let mm;
  if(tok==='pamigo'){ if(p&&p.alive&&p.rel!=='amigo'){ if(p.rel==='colega') p.fromTurma=1; if(p.rel==='colegaT') p.fromJob=1; p.rel='amigo'; p.bond=clamp(p.bond+10); out.push(`${p.first} agora é ${p.gender==='F'?'minha amiga':'meu amigo'}.`); } return true; }
  if(tok==='pnamoro'){ if(p&&p.alive&&m.age>=16&&p.age>=16){ if(partner()&&partner()!==p){ p.bond=clamp(p.bond+8); out.push('Mas eu já tenho alguém. Ficou no ar.'); } else { p.rel='namoro'; p.bond=clamp(p.bond+15); cnt('partners'); log(`Comecei a namorar ${fullName(p)}.`,'good'); out.push(`Estou namorando ${p.first}!`); } } return true; }
  if(tok==='pinimigo'){ if(p&&p.alive){ p.rel='inimigo'; p.bond=clamp(p.bond-20); out.push(`${p.first} virou ${p.gender==='F'?'minha inimiga':'meu inimigo'}.`); } return true; }
  if(tok==='psai'){ if(p&&p.alive&&['equipe','colegaT','colega','prof','chefe'].includes(p.rel)){ p.alive=false; out.push(`${p.first} saiu.`); } return true; }
  const sc=S.scen, L=sc&&d&&d.gkey&&sc.pp?sc.pp[d.gkey]:null, gp=L?L.find(x=>x.id===d.gid):null;
  if(mm=tok.match(/^glv([+-]\d+)$/)){ if(gp) gp.lv=Math.max(0,Math.min(100,gp.lv+ +mm[1])); return true; }
  if(tok==='gsai'||tok==='gmorre'){ if(gp){ sc.pp[d.gkey]=L.filter(x=>x!==gp); if(d.gkey==='zbase'&&sc.zb) sc.zb.pop=Math.max(0,sc.zb.pop-1); if(d.gkey==='vila'&&sc.vila) sc.vila.pop=Math.max(0,sc.vila.pop-1); } return true; }
  if(tok==='gcrew'){ if(gp){ const c=mkCrew({first:gp.first,last:gp.last,gender:gp.gender,age:Math.max(16,gp.age)}); c.genes=gp.genes; c.look=gp.look; if(gp.race) c.race=gp.race; sc.pp[d.gkey]=L.filter(x=>x!==gp); if(d.gkey==='zbase'&&sc.zb) sc.zb.pop=Math.max(0,sc.zb.pop-1); if(d.gkey==='vila'&&sc.vila) sc.vila.pop=Math.max(0,sc.vila.pop-1); out.push(`${gp.first} agora anda com o grupo.`); } return true; }
  return o(tok,d,out); })(extTok);
const NP=m=>!m.prison&&!(S.scen&&S.scen.v===SC_V);
// ---------- time ou clube da escola ----------
pack({k:'Escola',w:1.3,cd:6,min:6,max:25,when:NP,who:'clube'},[
  ['Passe decisivo','No jogo de domingo, {p} te dá o passe para o ponto da vitória.',['Agradecer na frente de todos|bond+10|{p} ficou vermelh{o2} de orgulho.','Comemorar sozinh{o}|bond-6|{p} ficou te olhando, sem graça.']],
  ['Ciúme da titularidade','{p} perdeu a vaga de titular para você e está chateado.',['Conversar|?50 bond+8|Viramos parceiros.|bond-4|Continua com raiva.','Ignorar|pinimigo|Agora somos rivais declarados.']],
  ['Carona para o treino','{p} pede carona para o treino todo dia.',['Dar carona|bond+8|Viramos melhores amigos no caminho.','Inventar desculpa|bond-4|{p} pegou o ônibus.']],
  ['Viagem do time','Na viagem do campeonato, você divide o quarto com {p}.',['Conversar até tarde|bond+10 pamigo|Viramos amigos de verdade.','Dormir cedo|h+2|Acordei com {p} roncando.']],
  ['Lesão do colega','{p} se machucou no treino e chora no vestiário.',['Ficar com {ele}|bond+12|{p} nunca vai esquecer.','Voltar a treinar|bond-6|Sobrou mais tempo de quadra para mim.']],
  ['Paixão no time','Você percebe que {p} te olha diferente nos treinos.',['Chamar para sair|?55 pnamoro|{p} disse sim!|h-4|{p} disse que só me vê como colega de time.','Fingir que não percebeu|h+0|Melhor não misturar.'],{min:13}],
  ['Briga no vestiário','{p} te acusa de não passar a bola.',['Pedir desculpas|bond+4|Resolvido.','Discutir|pinimigo h-4|O técnico separou a briga.']],
  ['Aniversário no clube','É aniversário de {p} e o time quer fazer uma surpresa.',['Organizar tudo|bond+12 h+6|{p} chorou de alegria.','Só contribuir com a vaquinha|$-20 bond+4|Simples e eficiente.']],
  ['Colega desistindo','{p} quer sair do time por causa das notas.',['Ajudar a estudar|bond+10 sm+2|{p} ficou no time e passou de ano.','Deixar ir|psai|{p} saiu do time.']],
  ['Vitória histórica','O time ganhou o campeonato. {p} te abraça chorando.',['Abraçar de volta|bond+10 h+10|Melhor dia do ano.','Pular na piscina com o troféu|h+12 bond+4|Tudo molhado, inclusive o troféu.']],
]);
// ---------- turma e professores ----------
pack({k:'Escola',w:1.2,cd:6,min:6,max:30,when:m=>NP(m)&&!!m.edu.cur,who:'classmate'},[
  ['Dupla no trabalho','O professor sorteia {p} como sua dupla no trabalho.',['Dividir o trabalho direito|bond+8 grade+3|Tiramos 10 juntos.','Deixar {ele} fazer tudo|bond-8 grade+1|{p} reclamou com o professor.']],
  ['Cola na prova','{p} pede para colar da sua prova.',['Deixar|bond+8 k-3|{p} passou. Eu fiquei nervos{o}.','Não deixar|bond-6 k+2|{p} ficou de cara amarrada.']],
  ['Lanche dividido','{p} esqueceu o lanche.',['Dividir o seu|bond+10 k+2|{p} lembrou disso por anos.','Comer sozinh{o}|bond-2|O estômago de {p} roncou a aula toda.']],
  ['Apelido maldoso','A turma colocou um apelido em {p}.',['Defender {ele}|bond+12 pamigo k+4|{p} virou meu amigo de verdade.','Rir junto|bond-10 k-4|{p} me olhou magoad{o2}.']],
  ['Festa de aniversário','{p} te convidou para o aniversário.',['Ir|bond+8 h+6|Bolo, música e uma guerra de balões.','Não ir|bond-4|{p} perguntou por que eu não fui.']],
  ['Bilhete','Você encontra um bilhete de {p} dentro do seu caderno.',['Responder|?55 pnamoro h+6|Começamos a namorar pelo recreio.|bond+4|Era só um convite para estudar junto.','Fingir que não viu|bond-2|{p} ficou chatead{o2}.'],{min:13}],
  ['Mudança de cidade','{p} vai mudar de cidade no fim do ano.',['Fazer uma despedida|bond+10 h-2|Trocamos cartas por anos.','Deixar passar|psai|Nunca mais nos falamos.']],
  ['Briga no recreio','{p} empurrou você no recreio.',['Revidar|pinimigo h-2|Os dois foram para a diretoria.','Contar para a professora|bond-4|{p} levou advertência.','Ignorar|k+2|Não vale a pena.']],
]);
pack({k:'Escola',w:1.2,cd:8,min:6,max:30,when:m=>NP(m)&&!!m.edu.cur,who:'prof'},[
  ['Professor exigente','{p} cobra mais de você do que dos outros.',['Se esforçar mais|grade+6 bond+6 sm+2|{p} disse que via potencial em mim.','Reclamar com a coordenação|bond-10|O clima na aula ficou pesado.']],
  ['Aula particular','{p} se oferece para te ajudar depois da aula, de graça.',['Aceitar|grade+8 bond+10|Aprendi o que estava empacado.','Recusar|h+0|Tenho vergonha.']],
  ['Bronca injusta','{p} te deu bronca por algo que você não fez.',['Explicar com calma|?sm bond+6|{p} pediu desculpas na frente de todos.|bond-4|Não acreditou.','Responder mal|bond-12 grade-4|Fui parar na diretoria.']],
  ['Professor favorito','{p} é o melhor professor que você já teve.',['Fazer um cartão de agradecimento|bond+12 h+4|{p} guardou o cartão na gaveta.','Só estudar bastante|grade+4|O melhor agradecimento é aprender.']],
  ['Professor doente','{p} está afastad{o2} por doença.',['Visitar com a turma|bond+10 k+4|{p} chorou de emoção.','Mandar uma mensagem|bond+3|Pouco, mas foi alguma coisa.']],
  ['Carta de recomendação','Você precisa de uma carta de recomendação de {p}.',['Pedir com educação|?50 bond+4 grade+2|{p} escreveu uma carta linda.|bond-2|{p} disse que não me conhece o suficiente.','Não pedir|h+0|Fica para outra vez.'],{min:15}],
]);
// ---------- trabalho ----------
pack({k:'Trabalho',w:1.2,cd:6,min:16,when:m=>NP(m)&&!!m.job&&!m.job.spc&&!m.job.hero,who:'colega'},[
  ['Café da manhã','{p} trouxe café e pão de queijo para a equipe.',['Agradecer e retribuir na semana seguinte|bond+8 h+4|Virou tradição.','Comer e sair|bond-2|Ninguém reparou. {p} reparou.']],
  ['Crédito roubado','{p} apresentou ao chefe uma ideia que era sua.',['Confrontar em particular|?50 bond+2|{p} pediu desculpas e me deu os créditos.|pinimigo|{p} negou tudo.','Contar ao chefe|perf+6 bond-12|O chefe acreditou em mim.','Deixar para lá|h-4|Engoli.']],
  ['Happy hour','{p} chama você para um happy hour depois do expediente.',['Ir|bond+10 h+6 $-80|Rimos até tarde.','Recusar|bond-2|Fica para a próxima.']],
  ['Colega em apuros','{p} errou feio numa planilha e o chefe vai perceber.',['Ajudar a consertar|bond+12 perf-1|{p} disse que me deve essa.','Avisar o chefe|perf+4 pinimigo|Fiz o certo. Perdi um colega.']],
  ['Paquera no escritório','{p} passa o dia mandando mensagens engraçadas para você.',['Chamar para jantar|?55 pnamoro|{p} disse sim!|bond+3|{p} disse que prefere não misturar trabalho e amor.','Manter o profissional|h+0|Melhor assim.'],{min:18}],
  ['Aniversário de colega','É aniversário de {p}.',['Organizar o bolo da equipe|bond+10 perf+1|Todo mundo cantou parabéns na copa.','Assinar só o cartão|bond+2|O cartão estava lotado de assinaturas.']],
  ['Fofoca','{p} anda espalhando fofoca sobre você.',['Conversar direto|?50 bond+4|Era um mal-entendido.|pinimigo|{p} dobrou a fofoca.','Ignorar|h-2|Fofoca morre sozinha. Às vezes.']],
  ['Pedido de demissão','{p} vai pedir demissão e te conta antes de todo mundo.',['Fazer uma despedida|bond+8 pamigo|Continuamos amigos fora do trabalho.','Só desejar sorte|psai|{p} saiu na sexta.']],
  ['Ajuda na mudança','{p} pede ajuda para fazer mudança no fim de semana.',['Ajudar|bond+12 hl-2|Carreguei uma geladeira três andares.','Inventar compromisso|bond-6|{p} desconfiou.']],
  ['Disputa de promoção','Você e {p} disputam a mesma promoção.',['Competir limpo|perf+6 bond-2|Que vença o melhor.','Sabotar|perf+8 k-8 pinimigo|Funcionou. A amizade acabou.']],
]);
pack({k:'Trabalho',w:1.1,cd:8,min:16,when:m=>NP(m)&&!!m.job&&!m.job.spc&&!m.job.hero,who:'boss'},[
  ['Chefe de mau humor','{p} chegou de péssimo humor e grita com todo mundo.',['Levar um café para {ele}|bond+8|{p} sorriu pela primeira vez no dia.','Ficar quiet{o}|h-2|Melhor não chamar atenção.']],
  ['Elogio público','{p} elogia seu trabalho na reunião.',['Agradecer e dividir com a equipe|bond+6 perf+4|Pontos com o chefe e com a equipe.','Só agradecer|perf+3|Bom momento.']],
  ['Chefe pede favor pessoal','{p} pede para você buscar o filho dele na escola.',['Fazer|bond+10 perf+2|Agora sou de confiança.','Recusar|bond-8|Não é minha função.']],
  ['Chefe assediador','{p} faz comentários desconfortáveis sobre você.',['Denunciar ao RH|k+6 psai|{p} foi afastado.','Ignorar|h-8|Cada dia pior.']],
  ['Chefe em crise','{p} desabafa com você que pode ser demitid{o2}.',['Ouvir e apoiar|bond+12|{p} nunca esqueceu.','Contar para os colegas|bond-15 k-6|A fofoca chegou nele.']],
]);
pack({k:'Carreira',w:1.2,cd:7,min:14,when:m=>NP(m)&&!!m.job&&!!m.job.spc,who:'spcEq'},[
  ['Parceria','{p}, da equipe, propõe um projeto juntos.',['Topar|bond+10 perf+5|O projeto foi um sucesso.','Recusar|bond-4|{p} fez com outra pessoa.']],
  ['Rivalidade','{p} quer o seu lugar de destaque.',['Competir de frente|perf+6 pinimigo|Rivais declarados.','Fazer as pazes|?50 bond+10|Ganhei um aliado.|bond-2|Não aceitou.']],
  ['Bastidores','{p} te conta segredos dos bastidores.',['Guardar segredo|bond+10|Confiança total.','Espalhar|bond-15 f+2|Fofoca boa, amizade acabada.']],
  ['Colega em crise','{p} está passando por uma crise e quer largar tudo.',['Ajudar|bond+12 pamigo|{p} ficou. Viramos amigos.','Não se envolver|psai|{p} largou a carreira.']],
  ['Romance nos bastidores','{p} te chama para jantar depois do trabalho.',['Ir|?55 pnamoro|Virou romance.|bond+6|Foi só um jantar.','Recusar|h+0|Foco na carreira.'],{min:18}],
  ['Prêmio dividido','Você ganha um prêmio e {p} ajudou muito.',['Agradecer no discurso|bond+12 f+2|{p} chorou na plateia.','Esquecer de citar|bond-10|{p} nunca esqueceu.']],
]);
// ---------- equipe de heróis (modo herói) ----------
pack({k:'Superpoderes',w:1.4,cd:20,scen:'heroi',when:HW(()=>!!hTeam()),who:'heroEq'},[
  ['Missão em dupla','{p} é escalad{o2} com você numa missão difícil.',['Combinar os poderes|?pwr rep+8 bond+10|Viramos a melhor dupla da equipe.|hl-10 bond+4|Deu errado, mas saímos juntos.','Fazer do seu jeito|rep+4 bond-6|{p} reclamou com o líder.']],
  ['Segredo do colega','{p} te conta sua identidade secreta.',['Contar a sua também|bond+12 pamigo|Agora somos cúmplices.','Só ouvir|bond+6|Guardei o segredo.']],
  ['Herói ferido','{p} foi ferid{o2} gravemente numa missão.',['Visitar no hospital|bond+10 h+2|{p} me pediu para cuidar da família.','Assumir as missões de {ele}|hperf+8 hl-6|Trabalho dobrado.']],
  ['Rival na equipe','{p} acha que você é a estrela demais.',['Dividir os holofotes|bond+8 rep-2|Paz na equipe.','Ignorar|pinimigo|Agora temos um rival dentro de casa.']],
  ['Herói apaixonado','{p} se declara depois de uma missão.',['Corresponder|?55 pnamoro|Casal de heróis!|bond+4|Foi só a adrenalina.','Manter só a amizade|bond+2|Missão primeiro.']],
  ['Traição','Você descobre que {p} passa informações para {inimigo}.',['Denunciar ao líder|hperf+10 psai|{p} foi expuls{o2} da equipe.','Confrontar em particular|?50 bond+4 pista+15|{p} se arrependeu e virou agente duplo.|hl-15|{p} me atacou.']],
  ['Treino a dois','{p} propõe treinarem juntos todo dia.',['Aceitar|pw+5 bond+8|Evoluímos juntos.','Recusar|h+0|Prefiro treinar sozinh{o}.']],
  ['Despedida','{p} vai se aposentar da equipe.',['Fazer uma festa|bond+8 h+6|Choramos todos.','Pedir que fique|?40 bond+6|Ficou mais um ano.|psai|Foi mesmo.']],
]);
// ---------- grupo religioso, gabinete, empresa e corte ----------
pack({k:'Religião',w:1.2,cd:8,min:18,when:m=>NP(m)&&!!m.seita,who:'fiel'},[
  ['Fiel devoto','{p} diz que daria a vida por {seita}.',['Agradecer|bond+8 devo+3|{p} chorou.','Pedir moderação|bond-2 k+2|{p} ficou confus{o2}.']],
  ['Fiel em dúvida','{p} confessa que está perdendo a fé.',['Conversar com carinho|?50 bond+10 devo+2|{p} saiu renovad{o2}.|psai|{p} saiu do grupo.','Repreender|bond-10 devo-2|{p} ficou com medo.']],
  ['Fiel quer cargo','{p} quer um cargo maior no grupo.',['Dar o cargo|bond+10 devo+2|Lealdade garantida.','Negar|bond-8|{p} ficou ressentid{o2}.']],
  ['Romance no grupo','{p} se aproxima demais depois dos encontros.',['Corresponder|?55 pnamoro|Romance abençoado.|bond+4|Ficou só na amizade.','Manter distância|h+0|Melhor assim.']],
  ['Fiel delator','Desconfiam que {p} está passando informações para a polícia.',['Afastar {ele}|psai susp-3|{p} saiu sem fazer escândalo.','Confiar|?50 bond+8|{p} era inocente.|susp+12|{p} era delator mesmo.']],
]);
pack({k:'Política',w:1.2,cd:8,min:21,when:m=>NP(m)&&!!m.office,who:'gabinete'},[
  ['Assessor leal','{p} trabalha até de madrugada para você.',['Dar um aumento|$-5000 bond+12|{p} ficou mais leal ainda.','Só agradecer|bond+4|Agradecimento barato.']],
  ['Assessor corrupto','Você descobre que {p} recebe propina em seu nome.',['Demitir e denunciar|psai appr+6 k+6|Limpei o gabinete.','Abafar|appr-4 k-8|O segredo agora é dos dois.']],
  ['Assessor vaza informação','{p} vazou uma informação para a imprensa.',['Demitir|psai|Fora.','Perdoar|?50 bond+10|Nunca mais vazou.|appr-6|Vazou de novo.']],
  ['Conselho valioso','{p} te dá um conselho que evita um escândalo.',['Seguir o conselho|appr+6 bond+8|Crise evitada.','Ignorar|appr-6|Deu tudo errado.']],
  ['Romance no gabinete','{p} te chama para jantar depois da sessão.',['Ir|?55 pnamoro appr-2|Romance político.|bond+4|Foi só um jantar.','Recusar|h+0|Escândalo à vista.']],
]);
pack({k:'Empresa',w:1.2,cd:8,min:18,when:m=>NP(m)&&!!m.biz,who:'func'},[
  ['Funcionário do mês','{p} bateu todas as metas.',['Dar um bônus|$-3000 bond+12 biz+2|Motivação lá em cima.','Só um elogio|bond+4|Nada como um elogio.']],
  ['Funcionário pede aumento','{p} pede aumento e ameaça ir para a concorrência.',['Dar o aumento|$-4000 bond+10|{p} ficou.','Recusar|?50 bond-4|{p} ficou mesmo assim.|psai biz-2|{p} foi para a concorrência e levou clientes.']],
  ['Funcionário roubando','O caixa não fecha e as câmeras mostram {p}.',['Demitir e denunciar|psai|Justiça feita.','Conversar|?50 bond+6 k+4|{p} estava passando fome. Ajudei e ficou.|$-2000|Roubou de novo.']],
  ['Ideia genial','{p} sugere uma ideia que pode dobrar as vendas.',['Implementar|?55 biz+8 bond+10|Funcionou!|biz-2|Não deu certo.','Ignorar|bond-6|{p} ficou desmotivad{o2}.']],
  ['Festa da empresa','Na festa de fim de ano, {p} exagera na bebida.',['Levar para casa em segurança|bond+12|{p} agradeceu envergonhad{o2} no dia seguinte.','Rir com os outros|bond-8|Foi parar no grupo da empresa.']],
]);
pack({k:'Realeza',w:1.2,cd:8,when:m=>NP(m)&&!!m.royal&&!m.royal.abd,who:'corte'},[
  ['Intriga na corte','{p} está espalhando boatos sobre você no palácio.',['Confrontar|?50 bond+4|Era um mal-entendido.|pinimigo|{p} virou inimigo declarado.','Expulsar do palácio|psai pop-2|A corte ficou com medo.']],
  ['Lealdade','{p} salvou você de uma queda feia na escadaria.',['Recompensar com um título|bond+12 pop+2|A corte inteira viu.','Agradecer|bond+6|Gratidão real.']],
  ['Conselho real','{p} te dá um conselho sobre política do reino.',['Seguir|?sm pop+6 bond+8|Foi um ótimo conselho.|pop-4|Não deu certo.','Ignorar|bond-4|{p} ficou ofendid{o2}.']],
  ['Romance proibido','Você se apaixona por {p}, que não tem sangue nobre.',['Assumir|?50 pnamoro pop+4|O povo adorou a história.|pop-6|A família real ficou furiosa.','Esconder|h-4|Amor secreto.'],{min:16}],
]);
// ---------- mundos paralelos: moradores ----------
pack({k:'Base',w:1.4,cd:10,scen:'zumbi',when:ZW(sc=>!!sc.zb&&sc.zb.pop>0),gente:'zbase'},[
  ['Talento escondido','{mor}, {mprof}, mostra que sabe consertar qualquer coisa.',['Colocar {mor} na oficina|glv+10 zmat+5|A oficina nunca rendeu tanto.','Chamar {mor} para o grupo|?50 gcrew|{mor} aceitou na hora.|glv-4|{mor} prefere ficar na base.']],
  ['Moradora doente','{mor} está com febre alta na enfermaria.',['Usar remédio do estoque|-it:@remedio glv+12|{mor} melhorou.','Esperar|?50 glv+2|A febre passou sozinha.|gmorre zmoral-6|{mor} não resistiu.']],
  ['Briga por comida','{mor} foi pego roubando comida do estoque.',['Perdoar|glv+8 zcom-3 zmoral+2|{mor} chorou de vergonha.','Expulsar da base|gsai zmoral-4|{mor} saiu pela porta e não olhou para trás.']],
  ['História de antes','{mor} conta como era sua vida de {mprof} antes do fim do mundo.',['Ouvir|glv+10 h+4|Rimos e choramos.','Pedir silêncio, precisamos vigiar|glv-4|{mor} ficou magoad{mo}.']],
  ['Voluntário para a ronda','{mor} se oferece para a ronda noturna.',['Aceitar|glv+8 zdef+3|{mor} viu zumbis antes que chegassem perto.','Recusar|h+0|{mor} ainda não está pront{mo}.']],
  ['Mordida escondida','Você vê sangue na manga de {mor}.',['Examinar|?50 glv+4|Era um corte de arame.|gmorre zmoral-8|Era mordida. Tivemos que fazer o pior.','Fingir que não viu|zmoral-2|Fiquei de olho a noite toda.']],
  ['Casal na base','{mor} quer se casar com outro morador.',['Celebrar o casamento|zmoral+8 glv+10|Festa com enlatados e música.','Dizer que não é hora|zmoral-3|O casal ficou triste.']],
  ['Querendo ir embora','{mor} quer partir sozinh{mo} em busca da família.',['Deixar ir com suprimentos|-it:@comida gsai glv+10|{mor} prometeu voltar um dia.','Convencer a ficar|?50 glv+6|{mor} ficou.|gsai|{mor} foi embora de madrugada.']],
]);
pack({k:'Vila',w:1.4,cd:10,scen:'isekai',when:ZW(sc=>!!sc.vila&&sc.vila.pop>0),gente:'vila'},[
  ['Pedido do morador','{mor}, {mprof}, pede um empréstimo para abrir uma oficina na vila.',['Emprestar|ouro-30 glv+12 vcom+5|A oficina prosperou.','Recusar|glv-6|{mor} ficou desanimad{mo}.']],
  ['Herói da vila','{mor} espantou um lobo que atacava as galinhas.',['Dar uma medalha|glv+12 vfel+4|A vila inteira aplaudiu.','Agradecer|glv+6|Um herói simples.']],
  ['Morador aventureiro','{mor} quer largar a vida de {mprof} e ser aventureir{mo}.',['Chamar para o grupo|?55 gcrew|{mor} pegou uma espada e veio.|glv-2|{mor} desistiu na última hora.','Aconselhar a ficar|glv+4|A vila precisa de {mprof}s.']],
  ['Briga de vizinhos','{mor} briga com o vizinho por causa de uma cerca.',['Julgar a favor de {mor}|glv+8 vfel-2|O vizinho ficou de cara feia.','Julgar contra|glv-8 vfel+2|{mor} ficou magoad{mo}.']],
  ['Nascimento','A esposa de {mor} deu à luz gêmeos.',['Mandar um presente|ouro-10 glv+10 vfel+3 vpop+2|A vila fez festa.','Visitar|glv+6 vpop+2|Os bebês choram muito.']],
  ['Morador doente','{mor} pegou a febre do pântano.',['Pagar o curandeiro|ouro-20 glv+12|{mor} se recuperou.','Esperar|?50 glv+2|Melhorou sozinh{mo}.|gmorre vfel-4|{mor} não resistiu.']],
]);
