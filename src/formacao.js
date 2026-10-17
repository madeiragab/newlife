// ===== Cursos técnicos novos, especialização e empregos que exigem técnico, especialização, mestrado, doutorado, MBA ou residência =====
TECHS.push({id:'t_adm',n:'Técnico em Administração',yrs:1,cost:4000,sm:20},{id:'t_cont',n:'Técnico em Contabilidade',yrs:2,cost:4500,sm:30},
  {id:'t_rad',n:'Técnico em Radiologia',yrs:2,cost:6500,sm:30},{id:'t_seg',n:'Técnico em Segurança do Trabalho',yrs:2,cost:5000,sm:25},
  {id:'t_edi',n:'Técnico em Edificações',yrs:2,cost:5000,sm:25},{id:'t_log',n:'Técnico em Logística',yrs:1,cost:4000,sm:20},
  {id:'t_qui',n:'Técnico em Química',yrs:2,cost:5500,sm:35},{id:'t_agr',n:'Técnico em Agropecuária',yrs:2,cost:4000,sm:20},
  {id:'t_des',n:'Técnico em Design Gráfico',yrs:1,cost:4500,sm:15},{id:'t_aer',n:'Técnico em Manutenção de Aeronaves',yrs:2,cost:8000,sm:35});
POSTS.push({id:'esp',n:'Especialização',yrs:1,cost:9000,sm:45,req:'uni'});
JOBS.push(
 // só técnico
 {id:'chefc',l:['Cozinheiro de restaurante|Cozinheira de restaurante','Sous-chef','Chef de cozinha','Chef dono de restaurante|Chef dona de restaurante'],sal:27000,edu:'tec:t_coz'},
 {id:'assad',l:['Assistente administrativo|Assistente administrativa','Analista administrativo|Analista administrativa','Supervisor administrativo|Supervisora administrativa'],sal:25000,edu:'tec:t_adm'},
 {id:'acont',l:['Assistente contábil','Técnico contábil|Técnica contábil','Supervisor de escritório contábil|Supervisora de escritório contábil'],sal:27000,edu:'tec:t_cont'},
 {id:'trad',l:['Técnico em radiologia|Técnica em radiologia','Técnico de tomografia|Técnica de tomografia','Supervisor de imagem|Supervisora de imagem'],sal:31000,edu:'tec:t_rad'},
 {id:'tseg',l:['Técnico de segurança do trabalho|Técnica de segurança do trabalho','Técnico sênior de segurança|Técnica sênior de segurança','Coordenador de segurança|Coordenadora de segurança'],sal:30000,edu:'tec:t_seg'},
 {id:'mobra',l:['Técnico de obras|Técnica de obras','Mestre de obras','Encarregado geral de obras|Encarregada geral de obras'],sal:29000,edu:'tec:t_edi'},
 {id:'tlog',l:['Assistente de logística','Técnico de logística|Técnica de logística','Supervisor de armazém|Supervisora de armazém'],sal:26000,edu:'tec:t_log'},
 {id:'tlab',l:['Técnico de laboratório|Técnica de laboratório','Técnico químico sênior|Técnica química sênior','Supervisor de controle de qualidade|Supervisora de controle de qualidade'],sal:29000,edu:'tec:t_qui'},
 {id:'tagr',l:['Técnico agrícola|Técnica agrícola','Técnico de campo sênior|Técnica de campo sênior','Gerente de fazenda'],sal:27000,edu:'tec:t_agr'},
 {id:'tdes',l:['Diagramador|Diagramadora','Designer técnico|Designer técnica','Coordenador de produção gráfica|Coordenadora de produção gráfica'],sal:24000,edu:'tec:t_des'},
 {id:'taer',l:['Mecânico de aeronaves|Mecânica de aeronaves','Inspetor de manutenção|Inspetora de manutenção','Chefe de hangar'],sal:38000,edu:'tec:t_aer'},
 // especialização
 {id:'tribu',l:['Advogado tributarista|Advogada tributarista','Tributarista sênior','Sócio tributarista|Sócia tributarista'],sal:95000,edu:'uni:dir+post:esp'},
 {id:'afisc',l:['Auditor fiscal|Auditora fiscal','Auditor fiscal sênior|Auditora fiscal sênior','Delegado da Receita|Delegada da Receita'],sal:110000,edu:'uni:cont,eco,dir+post:esp',sm:60},
 {id:'engst',l:['Engenheiro de segurança do trabalho|Engenheira de segurança do trabalho','Engenheiro de segurança sênior|Engenheira de segurança sênior','Gerente de saúde e segurança'],sal:85000,edu:'uni:eng+post:esp'},
 {id:'npsi',l:['Neuropsicólogo|Neuropsicóloga','Neuropsicólogo sênior|Neuropsicóloga sênior','Dono de clínica de neuropsicologia|Dona de clínica de neuropsicologia'],sal:75000,edu:'uni:psi+post:esp'},
 {id:'enfob',l:['Enfermeiro obstetra|Enfermeira obstetra','Obstetra sênior','Coordenador de maternidade|Coordenadora de maternidade'],sal:68000,edu:'uni:enf+post:esp'},
 {id:'impl',l:['Implantodontista','Implantodontista sênior','Dono de clínica de implantes|Dona de clínica de implantes'],sal:120000,edu:'uni:odo+post:esp'},
 {id:'perju',l:['Perito judicial|Perita judicial','Perito judicial sênior|Perita judicial sênior','Coordenador de perícias|Coordenadora de perícias'],sal:80000,edu:'post:esp',sm:55},
 {id:'nutri',l:['Nutricionista esportivo|Nutricionista esportiva','Nutricionista de clube','Nutricionista da seleção'],sal:55000,edu:'uni:edf,bio,enf,gas+post:esp'},
 // mestrado e doutorado
 {id:'ia',l:['Cientista de IA','Pesquisador de IA sênior|Pesquisadora de IA sênior','Líder de pesquisa em IA','Diretor de IA|Diretora de IA'],sal:130000,edu:'uni:cc,fis,eng+post:mest',sm:70},
 {id:'peco',l:['Pesquisador econômico|Pesquisadora econômica','Economista sênior de pesquisa','Diretor de estudos econômicos|Diretora de estudos econômicos'],sal:95000,edu:'uni:eco+post:mest',sm:65},
 {id:'arqc',l:['Arqueólogo de campo|Arqueóloga de campo','Arqueólogo-chefe de escavação|Arqueóloga-chefe de escavação','Curador de acervo nacional|Curadora de acervo nacional'],sal:62000,edu:'uni:his+post:mest'},
 {id:'bioq',l:['Bioquímico pesquisador|Bioquímica pesquisadora','Bioquímico sênior|Bioquímica sênior','Líder de pesquisa de vacinas'],sal:90000,edu:'uni:qui,bio,far+post:mest',sm:65},
 {id:'psub',l:['Professor universitário substituto|Professora universitária substituta','Professor visitante|Professora visitante','Coordenador de curso|Coordenadora de curso'],sal:58000,edu:'post:mest'},
 {id:'astf',l:['Astrofísico|Astrofísica','Astrofísico sênior|Astrofísica sênior','Diretor de observatório|Diretora de observatório'],sal:125000,edu:'uni:fis+post:dout',sm:80},
 {id:'neuro',l:['Neurocientista','Neurocientista sênior','Diretor de instituto de neurociência|Diretora de instituto de neurociência'],sal:120000,edu:'uni:bio,psi,med+post:dout',sm:78},
 // MBA e residência
 {id:'cfo',l:['Controller','Gerente financeiro|Gerente financeira','Diretor financeiro (CFO)|Diretora financeira (CFO)'],sal:150000,edu:'uni:eco,cont,adm+post:mba',sm:60},
 {id:'ghosp',l:['Gestor hospitalar|Gestora hospitalar','Diretor administrativo de hospital|Diretora administrativa de hospital','Diretor-geral de hospital|Diretora-geral de hospital'],sal:120000,edu:'uni:adm,enf,med+post:mba'},
 {id:'pedia',l:['Pediatra residente','Pediatra','Chefe da pediatria'],sal:160000,edu:'uni:med+post:res'},
 {id:'derma',l:['Dermatologista residente','Dermatologista','Dono de clínica dermatológica|Dona de clínica dermatológica'],sal:200000,edu:'uni:med+post:res'},
 {id:'psiq',l:['Psiquiatra residente','Psiquiatra','Chefe da psiquiatria'],sal:170000,edu:'uni:med+post:res'}
);
// requisitos combinados ("faculdade X + pós"), vários técnicos, e a faculdade da área também vale no lugar do técnico
const TEC_UNI={t_enf:['enf'],t_ti:['cc'],t_adm:['adm'],t_cont:['cont','eco'],t_qui:['qui','far'],t_edi:['eng','arq'],t_des:['art','moda'],t_rad:['med'],t_agr:['vet','bio'],t_log:['adm','eng'],t_seg:['eng'],t_coz:['gas'],t_aer:['aer'],t_mec:['eng'],t_ele:['eng'],t_est:[]};
eduOk=(o=>function(req){ if(!req) return true; const deg=S.me.edu.deg;
  if(req.includes('+')) return req.split('+').every(r=>eduOk(r));
  if(req.startsWith('tec:')) return req.slice(4).split(',').some(x=>deg.includes('tec:'+x)||(TEC_UNI[x]||[]).some(u=>deg.includes('uni:'+u)));
  if(req==='post:esp') return ['esp','mba','mest','dout','res'].some(x=>deg.includes('post:'+x));
  return o(req); })(eduOk);
eduName=(o=>function(req){ if(req&&req.includes('+')) return req.split('+').map(r=>eduName(r)).join(' + ');
  if(req&&req.startsWith('tec:')&&req.includes(',')) return req.slice(4).split(',').map(x=>(TECHS.find(t=>t.id===x)||{}).n).join(' ou ');
  if(req==='post:esp') return 'Especialização (ou MBA, mestrado)'; return o(req); })(eduName);
// quem tem pós vê as vagas que pedem pós; quem tem técnico vê as vagas do técnico
// formação a mais rende mais no salário, como no mercado de verdade (mestrado +10%, doutorado +15%, MBA +8%, especialização +5%)
function eduBonus(j){ if(!j||j.spc||!S||!S.me) return 0; const d=S.me.edu.deg, def=JOBS.find(x=>x.id===j.id); if(!def) return 0; let b=0;
  if(d.includes('post:dout')) b+=.15; else if(d.includes('post:mest')) b+=.10; if(d.includes('post:mba')) b+=.08; if(d.includes('post:esp')) b+=.05;
  if(!def.edu||def.edu==='medio'||def.edu.startsWith('tec:')) b=d.some(x=>x.startsWith('uni:'))?.06:d.some(x=>x.startsWith('tec:'))&&(!def.edu||def.edu==='medio')?.04:0;
  return Math.min(.25,b); }
jobSalary=(o=>function(j){ const v=o.apply(this,arguments); const b=eduBonus(j); return b?Math.round(v*(1+b)):v; })(jobSalary);
