// ===== Provas com perguntas de verdade: uma questão por prova, uma alternativa certa e três erradas =====
// [matéria, pergunta, certa, errada, errada, errada, (curso na faculdade)]
const QUIZ={
 fund1:[
  ['matemática','Quanto é 7 + 8?','15','14','16','13'],
  ['matemática','Quanto é 6 × 7?','42','36','48','40'],
  ['matemática','Quanto é 100 − 37?','63','73','67','53'],
  ['matemática','Qual é a metade de 50?','25','20','30','15'],
  ['matemática','Quanto é 9 × 9?','81','72','99','89'],
  ['matemática','Quantas unidades tem uma dúzia?','12','10','6','24'],
  ['matemática','Quanto é 45 ÷ 5?','9','8','7','5'],
  ['matemática','Qual número vem depois de 299?','300','290','200','309'],
  ['matemática','Quantos lados tem um triângulo?','3','4','5','6'],
  ['matemática','Quantos minutos tem uma hora?','60','100','30','90'],
  ['português','Qual é o plural de "pão"?','pães','pãos','pãoes','pans'],
  ['português','Qual é o contrário de "alto"?','baixo','grande','largo','forte'],
  ['português','Quantas sílabas tem a palavra "casa"?','2','1','3','4'],
  ['português','Qual palavra está escrita certo?','exceção','excessão','esseção','eceção'],
  ['português','Qual destas palavras é um nome de animal?','gato','correr','bonito','depressa'],
  ['português','Qual letra vem depois do "M" no alfabeto?','N','L','O','P'],
  ['ciências','Qual destes animais é um mamífero?','baleia','tubarão','pinguim','sapo'],
  ['ciências','A água congelada fica em qual estado?','sólido','líquido','gasoso','plasma'],
  ['ciências','Em qual planeta nós vivemos?','Terra','Marte','Vênus','Júpiter'],
  ['ciências','Qual é o maior planeta do sistema solar?','Júpiter','Terra','Saturno','Marte'],
  ['ciências','O que as plantas precisam para fazer seu alimento?','luz do sol','sal','areia','escuridão'],
  ['ciências','Quantas patas tem uma aranha?','8','6','4','10'],
  ['ciências','Qual órgão usamos para respirar?','pulmão','estômago','fígado','rim'],
  ['geografia','Qual é a capital do Brasil?','Brasília','Rio de Janeiro','São Paulo','Salvador'],
  ['geografia','Em qual continente fica o Brasil?','América do Sul','Europa','África','Ásia'],
  ['geografia','De que lado o sol nasce?','leste','oeste','norte','sul'],
  ['história','Em que ano os portugueses chegaram ao Brasil?','1500','1822','1889','1700'],
  ['geografia','Quantos dias tem uma semana?','7','5','10','6'],
  ['geografia','Quantos meses tem um ano?','12','10','11','13'],
  ['ciências','Qual é a estrela mais perto da Terra?','o Sol','a Lua','Marte','a Estrela Dalva'],
 ],
 fund2:[
  ['matemática','Quanto é 2 elevado a 3?','8','6','9','5'],
  ['matemática','Qual é a raiz quadrada de 144?','12','14','11','16'],
  ['matemática','Quanto é 15% de 200?','30','15','20','45'],
  ['matemática','Se 2x + 6 = 14, quanto vale x?','4','3','5','10'],
  ['matemática','Qual é o perímetro de um quadrado de lado 5?','20','25','10','15'],
  ['matemática','Qual é a área de um retângulo de 4 por 6?','24','20','10','26'],
  ['matemática','Qual é o MMC de 4 e 6?','12','24','2','10'],
  ['matemática','Quanto é 3/4 em número decimal?','0,75','0,34','0,5','0,25'],
  ['matemática','Quanto somam os ângulos internos de um triângulo?','180°','90°','360°','270°'],
  ['matemática','Quanto é (−3) × (−4)?','12','−12','7','−7'],
  ['ciências','Qual é a unidade básica dos seres vivos?','célula','átomo','órgão','tecido'],
  ['ciências','Qual órgão bombeia o sangue pelo corpo?','coração','pulmão','fígado','cérebro'],
  ['ciências','Qual gás precisamos respirar para viver?','oxigênio','gás carbônico','hélio','nitrogênio'],
  ['ciências','A fórmula H₂O representa o quê?','água','sal','gás oxigênio','açúcar'],
  ['ciências','Qual força nos mantém presos ao chão?','gravidade','magnetismo','atrito','eletricidade'],
  ['ciências','Na fotossíntese, as plantas liberam qual gás?','oxigênio','gás carbônico','metano','hidrogênio'],
  ['ciências','Qual é o maior órgão do corpo humano?','a pele','o fígado','o intestino','o cérebro'],
  ['história','Em que ano foi a Independência do Brasil?','1822','1500','1889','1888'],
  ['história','Qual lei aboliu a escravidão no Brasil, em 1888?','Lei Áurea','Lei do Ventre Livre','Lei dos Sexagenários','Lei Eusébio de Queirós'],
  ['história','Em que ano foi proclamada a República no Brasil?','1889','1822','1930','1891'],
  ['história','Quem pintou a Mona Lisa?','Leonardo da Vinci','Michelangelo','Van Gogh','Picasso'],
  ['história','Em qual país surgiram os Jogos Olímpicos da Antiguidade?','Grécia','Itália','Egito','China'],
  ['geografia','Qual é o maior oceano do mundo?','Pacífico','Atlântico','Índico','Ártico'],
  ['geografia','Qual é o maior país do mundo em área?','Rússia','China','Brasil','Canadá'],
  ['geografia','Qual é a capital da Argentina?','Buenos Aires','Montevidéu','Santiago','Lima'],
  ['geografia','Qual é o rio com mais água do mundo?','Amazonas','Nilo','Mississippi','São Francisco'],
  ['português','"Correr" é um verbo de qual conjugação?','2ª conjugação','1ª conjugação','3ª conjugação','não é verbo'],
  ['português','Qual é um sinônimo de "feliz"?','contente','triste','cansado','bravo'],
  ['português','Na frase "O menino comeu o bolo", quem é o sujeito?','o menino','o bolo','comeu','não tem sujeito'],
  ['inglês','Como se diz "obrigado" em inglês?','thank you','please','sorry','goodbye'],
 ],
 medio:[
  ['matemática','Quanto é log₁₀ de 1000?','3','10','100','4'],
  ['matemática','Quanto é 2 elevado a 10?','1024','1000','512','2048'],
  ['matemática','Quanto vale o seno de 30°?','1/2','√3/2','1','√2/2'],
  ['matemática','Na fórmula de Bhaskara, Δ é igual a:','b² − 4ac','b² + 4ac','4ac − b²','2b − 4a'],
  ['matemática','Na sequência 2, 5, 8, 11..., qual é o próximo número?','14','13','15','12'],
  ['matemática','Qual é a chance de dar cara ao jogar uma moeda?','1/2','1/3','1/4','1'],
  ['matemática','Se f(x) = 2x + 1, quanto vale f(3)?','7','6','5','9'],
  ['matemática','Quanto somam os ângulos internos de um quadrilátero?','360°','180°','540°','90°'],
  ['física','Velocidade média é igual a:','distância ÷ tempo','tempo ÷ distância','massa × tempo','força × distância'],
  ['física','Qual é a unidade de força no Sistema Internacional?','newton','joule','watt','pascal'],
  ['física','A aceleração da gravidade na Terra é de mais ou menos:','9,8 m/s²','98 m/s²','1 m/s²','3,0 m/s²'],
  ['física','A luz no vácuo viaja a mais ou menos:','300 mil km/s','300 km/s','30 mil km/h','3 mil km/s'],
  ['física','Qual é a unidade de energia no Sistema Internacional?','joule','newton','volt','ampère'],
  ['química','Qual é o símbolo químico do ouro?','Au','Ag','Ou','Fe'],
  ['química','Qual é o símbolo químico do sódio?','Na','So','S','Sd'],
  ['química','Uma solução com pH 7 é:','neutra','ácida','básica','explosiva'],
  ['química','O sal de cozinha (NaCl) tem que tipo de ligação?','iônica','covalente','metálica','de hidrogênio'],
  ['química','Qual gás é o mais abundante no ar?','nitrogênio','oxigênio','gás carbônico','argônio'],
  ['biologia','O DNA tem a forma de:','dupla hélice','triângulo','esfera','fita simples reta'],
  ['biologia','Qual organela produz a maior parte da energia da célula?','mitocôndria','ribossomo','núcleo','vacúolo'],
  ['biologia','Quem propôs a teoria da seleção natural?','Charles Darwin','Isaac Newton','Gregor Mendel','Louis Pasteur'],
  ['biologia','Qual tipo de sangue é chamado de doador universal?','O negativo','AB positivo','A positivo','B negativo'],
  ['biologia','Os seres que fazem fotossíntese são chamados de:','produtores','consumidores','decompositores','parasitas'],
  ['história','Em que ano começou a Revolução Francesa?','1789','1815','1500','1914'],
  ['história','Em que ano começou a Primeira Guerra Mundial?','1914','1939','1918','1889'],
  ['história','Em que ano caiu o Muro de Berlim?','1989','1961','1945','2001'],
  ['história','Quem governou o Brasil no Estado Novo?','Getúlio Vargas','Juscelino Kubitschek','Dom Pedro II','Tancredo Neves'],
  ['literatura','Quem escreveu "Dom Casmurro"?','Machado de Assis','José de Alencar','Carlos Drummond','Clarice Lispector'],
  ['literatura','Quem escreveu "Os Lusíadas"?','Luís de Camões','Fernando Pessoa','Eça de Queirós','Padre Antônio Vieira'],
  ['literatura','Quem escreveu "Grande Sertão: Veredas"?','Guimarães Rosa','Graciliano Ramos','Jorge Amado','Monteiro Lobato'],
  ['geografia','A camada de ozônio protege a Terra de quê?','raios ultravioleta','meteoros','terremotos','chuva ácida'],
  ['geografia','Qual é o clima predominante na Amazônia?','equatorial','semiárido','temperado','polar'],
  ['filosofia','Quem disse "Penso, logo existo"?','René Descartes','Sócrates','Platão','Nietzsche'],
  ['sociologia','Quem escreveu "O Capital"?','Karl Marx','Max Weber','Émile Durkheim','Adam Smith'],
  ['inglês','Qual é o passado do verbo "go" em inglês?','went','goed','gone','going'],
 ],
 uni:[
  ['cálculo','Qual é a derivada de x²?','2x','x','x³/3','2'],
  ['cálculo','Qual é a integral de 2x dx?','x² + C','2x² + C','x + C','2 + C'],
  ['cálculo','Qual é o limite de 1/x quando x vai ao infinito?','0','1','infinito','não existe'],
  ['física','A Lei de Ohm diz que:','V = R · I','V = I / R','P = m · a','E = m · c²'],
  ['estatística','A média de 2, 4 e 9 é:','5','4','6','15'],
  ['lógica','Se todo A é B e todo B é C, então:','todo A é C','todo C é A','nenhum A é C','alguns C não são B'],
  ['metodologia','Copiar um texto sem citar a fonte é:','plágio','paráfrase','resenha','citação direta'],
  ['computação','Qual é a complexidade da busca binária?','O(log n)','O(n)','O(n²)','O(1)','cc'],
  ['computação','O número 10 em binário é:','1010','1100','1001','0110','cc'],
  ['computação','HTML é uma linguagem de:','marcação','programação de sistemas','banco de dados','máquina','cc'],
  ['computação','Qual estrutura segue a regra "primeiro a entrar, primeiro a sair"?','fila','pilha','árvore','grafo','cc'],
  ['anatomia','Qual órgão produz a insulina?','pâncreas','fígado','rim','baço','med odo enf'],
  ['anatomia','Qual é o maior osso do corpo humano?','fêmur','tíbia','úmero','crânio','med enf edf odo'],
  ['anatomia','Quantos ossos tem o corpo de um adulto?','206','180','250','300','med enf edf'],
  ['fisiologia','As hemácias transportam principalmente:','oxigênio','insulina','anticorpos','gordura','med enf'],
  ['odontologia','Quantos dentes tem a dentição permanente completa?','32','20','28','36','odo'],
  ['direito','A Constituição brasileira em vigor é de qual ano?','1988','1946','1967','1824','dir'],
  ['direito','O habeas corpus protege principalmente:','a liberdade de ir e vir','a propriedade','a liberdade de imprensa','o direito ao voto','dir'],
  ['direito','Qual poder tem a função principal de fazer as leis?','Legislativo','Executivo','Judiciário','Ministério Público','dir'],
  ['economia','O PIB mede:','a produção de bens e serviços de um país','a inflação','a dívida pública','o desemprego','eco adm cont'],
  ['economia','Se a demanda sobe e a oferta fica igual, o preço tende a:','subir','cair','ficar igual','zerar','eco adm'],
  ['economia','Quem escreveu "A Riqueza das Nações"?','Adam Smith','John Keynes','Karl Marx','Milton Friedman','eco adm'],
  ['contabilidade','O método das partidas dobradas registra:','débito e crédito','só receitas','só despesas','só o caixa','cont adm'],
  ['contabilidade','Ativo menos passivo é igual a:','patrimônio líquido','receita','lucro bruto','custo fixo','cont adm eco'],
  ['administração','A sigla SWOT analisa forças, fraquezas, oportunidades e:','ameaças','vendas','tarefas','ofertas','adm'],
  ['psicologia','Quem criou a psicanálise?','Sigmund Freud','Carl Rogers','B. F. Skinner','Jean Piaget','psi'],
  ['psicologia','Quem estudou os estágios do desenvolvimento cognitivo das crianças?','Jean Piaget','Sigmund Freud','Pavlov','Maslow','psi ped'],
  ['psicologia','A pirâmide das necessidades é de qual autor?','Abraham Maslow','Carl Jung','Freud','Skinner','psi adm'],
  ['pedagogia','Quem escreveu "Pedagogia do Oprimido"?','Paulo Freire','Anísio Teixeira','Darcy Ribeiro','Maria Montessori','ped'],
  ['engenharia','No teorema de Pitágoras, a² é igual a:','b² + c²','b + c','b² − c²','2bc','eng arq'],
  ['engenharia','Qual é a unidade de potência?','watt','volt','ohm','newton','eng'],
  ['arquitetura','Quem projetou os principais prédios de Brasília?','Oscar Niemeyer','Lina Bo Bardi','Lúcio Costa','Le Corbusier','arq'],
  ['jornalismo','O primeiro parágrafo da notícia, que responde o quê, quem, quando, onde, como e por quê, é o:','lide','editorial','rodapé','olho','jor'],
  ['educação física','Quantos jogadores de cada time ficam em quadra no vôlei?','6','5','7','11','edf'],
  ['enfermagem','A pressão arterial considerada normal em adultos fica perto de:','12 por 8','20 por 15','8 por 4','16 por 12','enf med'],
 ],
 oab:[
  ['direito','A Constituição Federal em vigor é de:','1988','1967','1946','1891'],
  ['direito','O guardião da Constituição é o:','Supremo Tribunal Federal','Senado','Presidente da República','Tribunal de Contas'],
  ['direito','O habeas corpus protege:','a liberdade de locomoção','o direito de herança','a propriedade intelectual','o sigilo bancário'],
  ['direito','A maioridade civil no Brasil começa aos:','18 anos','16 anos','21 anos','14 anos'],
  ['direito','O voto é facultativo para quem tem:','16 e 17 anos','18 a 69 anos','21 a 60 anos','qualquer idade'],
  ['direito','Qual código protege quem compra produtos e serviços?','Código de Defesa do Consumidor','Código Penal','Código Eleitoral','CLT'],
  ['direito','A CLT trata principalmente de:','relações de trabalho','crimes','impostos','trânsito'],
  ['direito','O princípio de que ninguém é culpado antes da condenação definitiva chama-se:','presunção de inocência','legalidade tributária','anterioridade','publicidade'],
 ],
};
const quizLevel=m=>{ const c=m.edu.cur; if(!c) return null; if(c.type==='fund') return c.yr<5?'fund1':'fund2'; if(c.type==='medio') return 'medio'; return 'uni'; };
// sorteia uma pergunta ainda não usada naquele nível (com as do curso na frente, na faculdade)
function quizPick(m,lv){
  const bank=QUIZ[lv], used=m.quizUsed||(m.quizUsed={}), u=used[lv]||(used[lv]=[]);
  let pool=bank.map((q,i)=>i).filter(i=>!u.includes(i));
  if(lv==='uni'&&m.edu.cur){ const mine=pool.filter(i=>bank[i][6]&&bank[i][6].split(' ').includes(m.edu.cur.id)); const gen=pool.filter(i=>!bank[i][6]); pool=mine.length&&R.chance(.65)?mine:gen.length?gen:pool; }
  if(!pool.length){ used[lv]=[]; pool=bank.map((q,i)=>i); }
  const qi=R.pick(pool); used[lv].push(qi); return qi;
}
function quizEv(id,o){
  EVENTS[id]={w:o.w,cd:o.cd??2,onceLife:o.once,
    when:m=>!m.prison&&o.when(m),
    prep:m=>{ const lv=o.lv?o.lv(m):quizLevel(m); if(!lv||!QUIZ[lv]) return null; const qi=quizPick(m,lv); const ord=R.shuffle([0,1,2,3]);
      return {lv,qi,ord,hint:m.smarts>=80?R.int(1,3):0}; },
    show:d=>{ const q=QUIZ[d.lv][d.qi];
      // primeiro passo: ir, faltar ou fingir doença; a pergunta só aparece para quem vai
      if(o.gate&&!d.go){ const m=S.me, kid=m.age<13; return {k:o.k||'Estudos',t:`Prova de ${q[0]} hoje`,x:`Hoje tem prova de ${q[0]}${m.c.studyYr?' e eu estudei':' e eu não estudei nada'}.`,
        ch:[['Ir fazer a prova','go'],[kid?'Não ir para a escola':'Faltar','f'],['Fingir que estou doente','d']]}; }
      const ch=d.ord.map(i=>[q[2+i],'a'+i]);
      if(o.cheat) ch.push(['Colar do colega','c']);
      return {k:o.k||'Estudos',t:o.t(q),x:(d.forced?`Cheguei na sala contrariad${oa()} e sem ter estudado. `:'')+o.x+'\n\n'+q[1]+(d.hint?`\n\n(Pensando bem, tenho certeza de que não é "${q[2+d.hint]}".)`:''),ch}; },
    pick:(k,d)=>{ const m=S.me,q=QUIZ[d.lv][d.qi], c=m.edu.cur, kid=m.age<18&&parents().length;
      // obrigad{o} a ir: a pergunta aparece do mesmo jeito, mas sem preparo
      const forced=(who,txt)=>{ d.go=1; d.forced=1; S.pending.unshift({id,d}); parents().forEach(p=>p.bond=clamp(p.bond-3)); st('happy',-4); return txt; };
      const par=people('mae')[0]||people('pai')[0], pn=par?(par.rel==='mae'?'Minha mãe':'Meu pai'):'';
      if(k==='go'){ d.go=1; S.pending.unshift({id,d}); return ''; }
      if(k==='f'){
        // quanto mais novo, mais fácil ser pego antes de sair de casa
        if(kid&&par&&R.chance(m.age<10?.7:m.age<14?.45:.25)) return forced(par,`${pn} descobriu que eu ia faltar e me levou até a porta da sala. Vou ter que fazer a prova.`);
        cnt('faltas'); if(c){ c.faltas=(c.faltas||0)+1; c.grade=clamp(c.grade-5); } st('happy',3);
        const warn=c&&c.faltas>=2?` Já são ${c.faltas} faltas este ano. Com 3, repito de ano.`:'';
        if(kid&&par&&R.chance(.4)){ parents().forEach(p=>p.bond=clamp(p.bond-6)); st('happy',-6); return 'A escola ligou para casa avisando que eu faltei na prova. Levei uma bronca histórica.'+warn; }
        return R.pick(['Faltei e fiquei com zero na prova.','Matei a prova e fui à lanchonete. Zero no boletim.','Fiquei em casa. A prova vai ficar sem nota.'])+warn; }
      if(k==='d'){
        // cada vez que finjo, fica mais difícil alguém acreditar
        const tries=m.c.fakeSick||0; cnt('fakeSick');
        const ok=R.chance(clamp((m.talent.acting||30)+30-tries*12-(kid&&m.age<10?15:0),8,85)/100);
        if(ok){ st('happy',2); if(c) c.faltas=(c.faltas||0)+(kid?0:1); return kid?R.pick(['Fiz a melhor cara de doente da história. Acreditaram e eu fiquei em casa. Faço a segunda chamada depois.','Tossi tão bem que ganhei sopa na cama. Segunda chamada depois.']):'Inventei uma doença convincente. Vou fazer a segunda chamada.'; }
        m.karma=clamp(m.karma-2);
        if(kid&&par) return forced(par,R.pick([`${pn} colocou o termômetro: 36,5 °C. Fui obrigad${oa()} a ir para a escola e fazer a prova.`,`${pn} disse que doente que come três pães no café não está doente. Fui para a escola.`]));
        if(c) c.grade=clamp(c.grade-6);
        return 'O professor exigiu atestado e eu não tinha. Fiquei com zero.'; }
      if(k==='c'){ if(R.chance(.55)){ if(c) c.grade=clamp(c.grade+3); m.karma=clamp(m.karma-2); return 'Colei e ninguém viu.'; } if(c) c.grade=clamp(c.grade-8); m.karma=clamp(m.karma-3); st('happy',-5); return 'Fui pego colando. Zero na prova.'; }
      if(k==='a0'){ cnt('acertos'); if(d.forced&&c) c.grade=clamp(c.grade-2); return o.right(m,q,c)+(d.forced?' Mesmo sem estudar!':''); }
      cnt('erros'); return o.wrong(m,q,c)+` A resposta certa era "${q[2]}".`; }};
}
// prova da escola ou da faculdade
quizEv('prova_q',{w:3.4,cd:1,cheat:true,gate:true,when:m=>m.age>=6&&!!m.edu.cur&&!!quizLevel(m),t:q=>`Prova de ${q[0]}`,x:'Hoje tem prova, e a questão principal vale a nota:',
  right:(m,q,c)=>{ if(c) c.grade=clamp(c.grade+6); st('happy',4); st('smarts',1); return R.pick(['Acertei! Nota boa no boletim.','Acertei em cheio. Saí da sala sorrindo.','Certinho! O professor me elogiou.']); },
  wrong:(m,q,c)=>{ if(c) c.grade=clamp(c.grade-5); st('happy',-3); return R.pick(['Errei.','Errei e a nota despencou.','Errei feio.']); }});
// prova oral na frente da turma
quizEv('oral_q',{w:1.1,cd:4,when:m=>!!m.edu.cur&&(m.edu.cur.type==='fund'||m.edu.cur.type==='medio')&&m.age>=8,t:()=>'Prova oral',x:'A professora me chamou ao quadro, na frente da turma inteira:',
  right:(m,q,c)=>{ if(c) c.grade=clamp(c.grade+4); st('happy',6); return 'Acertei e a turma aplaudiu.'; },
  wrong:(m,q,c)=>{ if(c) c.grade=clamp(c.grade-2); st('happy',-5); return 'Errei e a turma inteira riu.'; }});
// simulado do vestibular: cada acerto ajuda a nota do vestibular
quizEv('simulado_q',{w:1.7,cd:1,when:m=>m.age>=14&&!!m.edu.cur&&m.edu.cur.type==='medio',lv:()=>'medio',t:()=>'Simulado do vestibular',x:'Simulado na escola. Uma das questões:',
  right:m=>{ m.c.simBonus=Math.min(6,(m.c.simBonus||0)+2); st('happy',3); return 'Acertei! Isso melhora minha nota no vestibular.'; },
  wrong:()=>{ st('happy',-2); return 'Errei. Preciso estudar mais para o vestibular.'; }});
// olimpíada: pergunta mais difícil, medalha conta para a nota e para a bolsa
quizEv('olimp_q',{w:.9,cd:3,when:m=>m.age>=11&&m.age<=18&&m.smarts>=58&&!!m.edu.cur&&['fund','medio'].includes(m.edu.cur.type),lv:()=>'medio',t:()=>'Olimpíada do conhecimento',x:'Cheguei à final da olimpíada. A pergunta decisiva:',
  right:m=>{ cnt('olimp'); st('smarts',2); st('happy',8); const med=R.pick(['ouro','prata','bronze']); log(`Ganhei medalha de ${med} na olimpíada!`,'good'); return `Medalha de ${med}! Isso conta pontos para o vestibular.`; },
  wrong:m=>{ st('smarts',1); return 'Fiquei sem medalha, mas aprendi muito.'; }});
// exame da ordem para quem faz Direito
quizEv('oab_q',{w:2,cd:1,when:m=>!m.oab&&m.age<65&&((m.edu.cur&&m.edu.cur.type==='uni'&&m.edu.cur.id==='dir'&&m.edu.cur.yr>=3)||m.edu.deg.includes('uni:dir')),lv:()=>'oab',k:'Direito',t:()=>'Exame da Ordem',x:'Prova da Ordem dos Advogados. A questão que decide se eu passo:',
  right:m=>{ m.oab=true; st('happy',12); log('Passei no Exame da Ordem! Agora posso advogar.','good'); return 'Passei no Exame da Ordem!'; },
  wrong:()=>{ st('happy',-6); return 'Reprovei no Exame da Ordem. Tento de novo depois.'; }});
// as provas antigas (sem pergunta) saem do sorteio
for(const id of ['prova','simulado','olimpiada']) delete EVENTS[id];
for(const id of Object.keys(EVENTS)) if(['Prova surpresa','Prova oral','Cálculo III','Exame da ordem'].includes(EVENTS[id].title)) delete EVENTS[id];
