// ===== Empregos de cada faculdade: todo curso tem saída própria, e com diploma o salário é bem maior =====
JOBS.push(
 {id:'desg',l:['Designer júnior|Designer júnior','Designer gráfico|Designer gráfica','Designer sênior','Diretor de arte|Diretora de arte'],sal:40000,edu:'uni:art,moda'},
 {id:'cura',l:['Assistente de curadoria','Curador de museu|Curadora de museu','Curador-chefe|Curadora-chefe','Diretor de museu|Diretora de museu'],sal:45000,edu:'uni:art,his'},
 {id:'ilus',l:['Ilustrador júnior|Ilustradora júnior','Ilustrador|Ilustradora','Ilustrador sênior|Ilustradora sênior','Diretor de animação|Diretora de animação'],sal:38000,edu:'uni:art'},
 {id:'pmus',l:['Professor de música|Professora de música','Professor de conservatório|Professora de conservatório','Coordenador musical|Coordenadora musical','Diretor de conservatório|Diretora de conservatório'],sal:34000,edu:'uni:mus'},
 {id:'prodm',l:['Assistente de estúdio','Produtor musical|Produtora musical','Produtor musical sênior|Produtora musical sênior','Dono de gravadora|Dona de gravadora'],sal:50000,edu:'uni:mus'},
 {id:'orq',l:['Músico de orquestra|Musicista de orquestra','Primeiro violino','Spalla','Maestro|Maestrina'],sal:46000,edu:'uni:mus'},
 {id:'hist',l:['Pesquisador de história|Pesquisadora de história','Historiador|Historiadora','Arqueólogo|Arqueóloga','Diretor de arquivo nacional|Diretora de arquivo nacional'],sal:44000,edu:'uni:his'},
 {id:'quim',l:['Químico júnior|Química júnior','Químico industrial|Química industrial','Químico sênior|Química sênior','Diretor de laboratório|Diretora de laboratório'],sal:58000,edu:'uni:qui'},
 {id:'peri',l:['Perito criminal|Perita criminal','Perito sênior|Perita sênior','Chefe da perícia','Diretor do instituto de criminalística|Diretora do instituto de criminalística'],sal:62000,edu:'uni:qui,bio,far'},
 {id:'fisp',l:['Físico pesquisador|Física pesquisadora','Físico sênior|Física sênior','Líder de laboratório','Diretor científico|Diretora científica'],sal:60000,edu:'uni:fis'},
 {id:'pedg',l:['Pedagogo|Pedagoga','Coordenador pedagógico|Coordenadora pedagógica','Vice-diretor de escola|Vice-diretora de escola','Diretor de escola|Diretora de escola'],sal:40000,edu:'uni:ped'},
 {id:'trei',l:['Auxiliar técnico|Auxiliar técnica','Preparador físico|Preparadora física','Treinador|Treinadora','Técnico da seleção|Técnica da seleção'],sal:45000,edu:'uni:edf'},
 {id:'psio',l:['Analista de RH','Psicólogo organizacional|Psicóloga organizacional','Gerente de pessoas','Diretor de RH|Diretora de RH'],sal:52000,edu:'uni:psi,adm'},
 {id:'dado',l:['Analista de dados','Cientista de dados','Cientista de dados sênior','Diretor de dados|Diretora de dados'],sal:78000,edu:'uni:cc,eco,fis'},
 {id:'game',l:['Desenvolvedor de jogos júnior|Desenvolvedora de jogos júnior','Desenvolvedor de jogos|Desenvolvedora de jogos','Game designer sênior','Diretor de estúdio|Diretora de estúdio'],sal:58000,edu:'uni:cc,art'},
 {id:'sec',l:['Analista de segurança','Especialista em segurança','Hacker ético sênior|Hacker ética sênior','Chefe de segurança da informação'],sal:70000,edu:'uni:cc'},
 {id:'petr',l:['Engenheiro de petróleo júnior|Engenheira de petróleo júnior','Engenheiro de petróleo|Engenheira de petróleo','Engenheiro sênior de plataforma|Engenheira sênior de plataforma','Diretor de exploração|Diretora de exploração'],sal:95000,edu:'uni:eng,qui'},
 {id:'impr',l:['Assessor de imprensa|Assessora de imprensa','Coordenador de comunicação|Coordenadora de comunicação','Gerente de comunicação','Diretor de comunicação|Diretora de comunicação'],sal:44000,edu:'uni:jor,rel'},
 {id:'rote',l:['Roteirista júnior','Roteirista','Roteirista-chefe','Showrunner'],sal:42000,edu:'uni:jor,art'},
 {id:'cext',l:['Analista de comércio exterior','Especialista em comércio exterior','Gerente de exportação','Diretor internacional|Diretora internacional'],sal:58000,edu:'uni:rel,eco,adm'},
 {id:'aeng',l:['Engenheiro aeronáutico júnior|Engenheira aeronáutica júnior','Engenheiro aeronáutico|Engenheira aeronáutica','Engenheiro de voo sênior|Engenheira de voo sênior','Diretor de projetos aeroespaciais|Diretora de projetos aeroespaciais'],sal:90000,edu:'uni:aer,eng'},
 {id:'ctrl',l:['Controlador de tráfego aéreo|Controladora de tráfego aéreo','Controlador sênior|Controladora sênior','Supervisor de torre|Supervisora de torre','Chefe do controle aéreo'],sal:70000,edu:'uni:aer',sm:60},
 {id:'somm',l:['Sommelier','Sommelier-chefe','Consultor de vinhos|Consultora de vinhos','Dono de vinícola|Dona de vinícola'],sal:40000,edu:'uni:gas'},
 {id:'prmd',l:['Assistente de produção de moda','Produtor de moda|Produtora de moda','Editor de moda|Editora de moda','Diretor de revista de moda|Diretora de revista de moda'],sal:38000,edu:'uni:moda,jor'},
 {id:'fari',l:['Farmacêutico industrial|Farmacêutica industrial','Pesquisador de medicamentos|Pesquisadora de medicamentos','Gerente de produção farmacêutica','Diretor de laboratório farmacêutico|Diretora de laboratório farmacêutico'],sal:60000,edu:'uni:far'},
 {id:'orto',l:['Ortodontista','Ortodontista sênior','Dono de clínica|Dona de clínica','Rede de clínicas'],sal:95000,edu:'uni:odo'},
 {id:'audi',l:['Auditor júnior|Auditora júnior','Auditor|Auditora','Auditor sênior|Auditora sênior','Sócio de auditoria|Sócia de auditoria'],sal:70000,edu:'uni:cont,eco'},
 {id:'gproj',l:['Analista de projetos','Gerente de projetos','Gerente de portfólio','Diretor de operações|Diretora de operações'],sal:66000,edu:'uni:adm,eng'},
 {id:'zoot',l:['Zootecnista','Veterinário de grandes animais|Veterinária de grandes animais','Consultor rural|Consultora rural','Dono de haras|Dona de haras'],sal:52000,edu:'uni:vet,bio'},
 {id:'ambi',l:['Analista ambiental','Biólogo ambiental|Bióloga ambiental','Consultor ambiental sênior|Consultora ambiental sênior','Diretor de sustentabilidade|Diretora de sustentabilidade'],sal:50000,edu:'uni:bio,qui'},
 {id:'enfu',l:['Enfermeiro de UTI|Enfermeira de UTI','Enfermeiro-chefe|Enfermeira-chefe','Supervisor de enfermagem|Supervisora de enfermagem','Diretor de enfermagem|Diretora de enfermagem'],sal:52000,edu:'uni:enf'},
 {id:'urb',l:['Urbanista júnior','Urbanista','Urbanista sênior','Secretário de urbanismo|Secretária de urbanismo'],sal:56000,edu:'uni:arq'},
 {id:'econ',l:['Economista júnior','Economista','Economista-chefe','Diretor do banco central|Diretora do banco central'],sal:72000,edu:'uni:eco'},
 {id:'publ',l:['Redator publicitário|Redatora publicitária','Diretor de criação|Diretora de criação','Vice-presidente de criação','Dono de agência|Dona de agência'],sal:46000,edu:'uni:jor,adm,art'}
);
// quem tem diploma vê mais vagas da própria área (como no mercado de verdade)
openings=(o=>function(){ const m=S.me, first=!m.yr.openings; const r=o.apply(this,arguments);
  if(first&&m.age>=18&&m.edu.deg.some(d=>d.startsWith('uni:')||d.startsWith('post:'))){ const fit=JOBS.filter(j=>!j.pt&&j.edu&&j.edu!=='medio'&&eduOk(j.edu)&&!m.yr.openings.some(x=>x.id===j.id));
    R.shuffle(fit).slice(0,4).forEach(j=>{ const size=pickSize(); m.yr.openings.push({id:j.id,co:companyName(),size,mul:(1+R.int(-8,18)/100)*SIZES[size].mul}); }); }
  return r||m.yr.openings; })(openings);

// ===== Carteira nova: os pais podem dar um carro, conforme o dinheiro da família =====
function parentCar(){ const m=S.me, ps=parents(); if(!ps.length||S.flags.famBroke) return;
  const cls=S.flags.cls||'media', fam=famMoney(), bond=ps.reduce((s,p)=>s+(p.bond||50),0)/ps.length;
  let ch=({pobre:.05,media:.2,rica:.55,milionaria:.85,realeza:.95}[cls]||.2)+Math.min(.2,fam/2e6); if(bond<35) ch*=.35; if(m.karma<25) ch*=.7;
  if(!R.chance(ch)) return;
  const budget=Math.min(fam*.35,{pobre:30000,media:80000,rica:260000,milionaria:900000,realeza:3e6}[cls]||80000);
  const ok=CAR_MODELS.filter(c=>!c.classic&&['Popular','Sedã','SUV','Picape','Elétrico','Conversível','Esportivo','Superesportivo'].includes(c.cat)), novos=ok.filter(c=>c.v<=budget), usados=ok.filter(c=>c.v*.45<=budget);
  const used=!novos.length; const list=(used?usados:novos).sort((a,b)=>b.v-a.v).slice(0,7); if(!list.length) return;
  const c=R.pick(list), age=used?R.int(4,12):0, v=Math.round(c.v*(used?Math.max(.25,.85-age*.05):1)/100)*100, cor=R.pick(CAR_COLORS);
  let left=v; ps.slice().sort((a,b)=>(b.money||0)-(a.money||0)).forEach(p=>{ const t=Math.min(left,Math.max(0,p.money||0)); p.money-=t; left-=t; });
  const nome=`${c.b} ${c.m}${used?' '+(S.year-age):' 0 km'}`;
  m.assets.push({id:newId(),k:'carro',n:`${nome} ${cor}`,value:v,cond:used?R.int(55,85):100,buy:v,cor,model:nome});
  ps.forEach(p=>p.bond=clamp((p.bond||50)+8)); st('happy',used?12:18); cnt('carroPais');
  const quem=ps.length>1?'Meus pais':ps[0].rel==='mae'?'Minha mãe':'Meu pai';
  const x=used?R.pick([`${quem} juntaram dinheiro escondido por anos. Na garagem, um ${nome} ${cor}, lavado e com cheirinho de pinho. Não é zero, mas é meu.`,`${quem} chegaram com um ${nome} ${cor} usado e um sorriso enorme. "Arranhado, mas é seu."`]).replace(/^(Minha mãe|Meu pai) juntaram/,'$1 juntou').replace(/^(Minha mãe|Meu pai) chegaram/,'$1 chegou')
    :R.pick([`${quem} me esperavam na porta com uma chave amarrada num laço. Lá fora: um ${nome} ${cor}!`,`Achei que era só um jantar de comemoração. Na saída do restaurante, ${quem.toLowerCase()} apontaram para um ${nome} ${cor} com laço vermelho.`]).replace(/^(Minha mãe|Meu pai) me esperavam/,'$1 me esperava').replace(/(minha mãe|meu pai) apontaram/,'$1 apontou');
  log(`Ganhei um ${nome} ${cor} de presente de ${ps.length>1?'meus pais':ps[0].rel==='mae'?'minha mãe':'meu pai'}.`,'good');
  MQ.splice(1,0,{k:'Presente',t:'Um carro de presente!',x:`${x}\n\nValor: ${fmt(v)}.`,top:typeof carSVG==='function'?`<div class="mkcar">${carSVG(c,cor,150)}</div>`:''}); }
