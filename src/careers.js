// ===== Banco de carreiras: plano de carreira, porte da empresa, promoções e demissões raras =====

// porte da empresa: muda salário e a velocidade das promoções
const SIZES={pequena:{n:'pequena',mul:.85,need:1},média:{n:'média',mul:1,need:2},grande:{n:'grande',mul:1.15,need:2},multinacional:{n:'multinacional',mul:1.35,need:3}};
const pickSize=()=>R.wpick([['pequena',35],['média',35],['grande',20],['multinacional',10]]);
const levelSalary=(d,l,mul=1)=>Math.round(d.sal*(1+.42*l)*mul);
// áreas do guia de carreiras
function careerArea(d){ if(d.pt) return 'Meio período (13+)'; if(!d.edu) return 'Sem estudo'; if(d.edu==='medio') return 'Ensino médio'; if(d.edu.startsWith('tec')) return 'Curso técnico'; if(d.edu.startsWith('post')) return 'Pós-graduação'; return 'Faculdade'; }
const AREA_ORDER=['Meio período (13+)','Sem estudo','Ensino médio','Curso técnico','Faculdade','Pós-graduação'];

// promoção: aumento com variação aleatória
function promote(j,how){
  const m=S.me; j.lvl++; j.lvlYrs=0; j.good=0; const extra=R.int(0,12); j.mul=(j.mul||1)*(1+extra/100);
  st('happy',how==='pedido'?12:10); cnt('promos');
  const t=`Fui ${m.gender==='F'?'promovida':'promovido'} a ${jobTitle(j).toLowerCase()}${extra>=8?' com um aumento caprichado':''}!`; log(t,'good'); return t;
}
const sizeOf=j=>SIZES[j.size]||SIZES['média'];
// o que falta para a próxima promoção (texto para a tela)
function promoNeed(j){
  const d=JOBS.find(x=>x.id===j.id); if(!d) return ''; const max=d.l.length-1; if(j.lvl>=max) return 'Topo da carreira nesta empresa.'; if(d.pt) return 'Meio período não tem promoção.';
  const need=sizeOf(j).need; return `Desempenho 80%+ por ${need} ano${need>1?'s':''} seguido${need>1?'s':''} (tenho ${j.good||0}) ou 92%+ depois de 1 ano no cargo.`;
}
// fim do ano no emprego comum
function careerYear(j,d){
  j.lvlYrs=(j.lvlYrs||0)+1; j.good=j.perf>=80?(j.good||0)+1:0;
  if(!d.pt&&j.lvl<d.l.length-1&&(j.good>=sizeOf(j).need||(j.perf>=92&&j.lvlYrs>=1))){ promote(j,'mérito'); return; }
  if(R.chance(.5)) j.mul=(j.mul||1)*(1+R.int(1,5)/100);
}
function askPromo(){
  const m=S.me,j=m.job; if(use('promo')>1) return 'Já pedi promoção este ano.';
  if(j.spc){ const max=SPECIAL[j.spc].l.length-1; if(j.lvl>=max) return 'Já estou no topo.'; if(R.chance((j.perf-40)/90)){ j.lvl++; st('happy',12); return `Subi para ${jobTitle(j).toLowerCase()}!`; } return 'Ainda não é a hora.'; }
  const d=JOBS.find(x=>x.id===j.id); if(j.lvl>=d.l.length-1) return 'Já estou no topo da carreira aqui.'; if(d.pt) return 'Meio período não tem plano de carreira.';
  if((j.lvlYrs||0)<1) return 'Acabei de chegar neste cargo. Meu chefe pediu para eu esperar pelo menos um ano.';
  if(j.perf>=60&&R.chance(clamp((j.perf-40)/80-(sizeOf(j).need-2)*.1,.05,.9))) return promote(j,'pedido');
  j.perf=clamp(j.perf-3); return `Meu chefe disse que ainda não estou pront${oa()}. Desempenho atual: ${j.perf}%.`;
}

// ---------- telas ----------
V.careerTree=()=>{ const m=S.me,j=m.job; if(!j||j.spc) return {title:'Plano de carreira',items:[{html:'<div class="card"><p>Sem plano de carreira no momento.</p></div>'}]};
  const d=JOBS.find(x=>x.id===j.id);
  return {title:'Plano de carreira',items:[{html:`<div class="card">${kv('Empresa',`${j.co} (${sizeOf(j).n})`)}${kv('Tempo no cargo',(j.lvlYrs||0)+' ano(s)')}${bar('Desempenho',j.perf)}<p style="color:var(--muted);font-size:13px">${esc(promoNeed(j))}</p></div>`},{sec:'Degraus'}]
    .concat(d.l.map((t,i)=>({ic:i<j.lvl?'✅':i===j.lvl?'📍':'🔒',l:g(t,m.gender),s:`${fmt(levelSalary(d,i,(j.mul||1)/(1+.42*0)))}/ano aprox.`,r:i===j.lvl?'Atual':i===j.lvl+1?'Próximo':'',tone:i===j.lvl?'good':''})))}; };
V.careerBook=()=>{ const m=S.me,it=[{html:'<div class="card"><p>Todas as carreiras e quem sobe para quem. Salário inicial numa empresa média; empresas grandes e multinacionais pagam mais, mas promovem mais devagar.</p></div>'}];
  for(const a of AREA_ORDER){ const js=JOBS.filter(d=>careerArea(d)===a); if(!js.length) continue; it.push({sec:a});
    js.forEach(d=>it.push({l:g(d.l[0],m.gender),s:d.l.map(t=>g(t,m.gender)).join(' → '),r:fmt(d.sal),on:()=>UI.push(()=>({title:g(d.l[0],m.gender),items:[
      {html:`<div class="card">${kv('Formação',d.edu?eduName(d.edu):'Nenhuma')}${d.min?kv('Idade mínima',d.min+' anos'):''}${d.lic?kv('Exige','Carteira de motorista'):''}${d.sm?kv('Inteligência','~'+d.sm+'%'):''}${d.hl?kv('Saúde','~'+d.hl+'%'):''}</div>`},{sec:'Plano de carreira'}]
      .concat(d.l.map((t,i)=>({ic:i===0?'🟢':i===d.l.length-1?'👑':'⬆️',l:g(t,m.gender),r:fmt(levelSalary(d,i))+'/ano'})))}))})); }
  return {title:'Guia de carreiras',items:it}; };

// ---------- eventos raros de demissão (e algumas reviravoltas boas) ----------
pack({k:'Trabalho',w:.32,cd:20,min:18,when:m=>!!m.job&&!m.job.spc&&!m.prison&&!!JOBS.find(x=>x.id===m.job.id)&&!JOBS.find(x=>x.id===m.job.id).pt},[
 ['A empresa faliu','A {co} pediu falência. Todo mundo vai para a rua.',['Pegar minhas coisas e ir embora|fire h-8|Fiquei sem emprego da noite para o dia.','Processar a empresa|?50 fire $v|Ganhei {v} na justiça trabalhista.|fire h-6|O processo vai demorar anos.'],{v:[3000,20000]}],
 ['Corte de pessoal','A {co} vai demitir 30% dos funcionários.',['Trabalhar dobrado para não ser cortad{o}|?perf+10 perf+5|Sobrevivi ao corte.|fire h-6|Mesmo assim fui cortad{o}.','Aceitar a demissão voluntária|fire $v h+2|Saí com {v} de indenização.'],{v:[5000,30000]}],
 ['Fusão','A {co} foi comprada por uma gigante do setor.',['Mostrar serviço para a nova diretoria|?perf promo perf+5|A nova diretoria gostou de mim.|fire|Meu cargo foi extinto na fusão.','Ficar quiet{o} e torcer|?60 h-2|Continuo no emprego.|fire h-6|Meu cargo deixou de existir.']],
 ['Substituíd{o} por um robô?','A empresa comprou um sistema de inteligência artificial que faz boa parte do meu trabalho.',['Aprender a usar o sistema|?sm sm+3 perf+8|Virei a pessoa que comanda o sistema.|fire|Não me adaptei e fui substituíd{o}.','Reclamar com o sindicato|?40 h+2|O sindicato segurou meu emprego.|fire h-5|Não adiantou.']],
 ['O sobrinho do dono','O sobrinho do dono foi contratado para uma vaga igual à minha.',['Ensinar tudo a ele|k+3 ?50 perf+3|Ele virou meu aliado.|fire|Ele aprendeu tudo e eu fui dispensad{o}.','Sabotar o sobrinho|k-6 ?40 perf+6|Ele foi transferido para outra filial.|fire k-2|O dono descobriu. Rua!']],
 ['Chefe novo','Chegou um chefe novo que já começou implicando comigo.',['Puxar o saco|?lk perf+4|Ele foi com a minha cara.|perf-6|Pareceu falso.','Bater de frente|?30 perf+5 h+3|Ganhei o respeito dele.|fire h-5|Fui demitid{o} no mesmo dia.','Procurar outro emprego|h-1|Comecei a mandar currículos.']],
 ['Escândalo na empresa','A {co} apareceu no jornal por um esquema de corrupção.',['Colaborar com a investigação|k+6 ?60 perf+3|Fiquei bem vist{o}.|fire|A empresa fechou as portas.','Destruir documentos a pedido do chefe|k-10 ?50 $v|Ganhei {v} para ficar quiet{o}.|fire arrest:obstrução_de_justiça:1:3|A polícia descobriu.'],{v:[2000,15000]}],
 ['Dormindo no expediente','Cochilei na mesa e o diretor passou bem na hora.',['Fingir que estava meditando|?lk|Colou, por incrível que pareça.|perf-8|Ninguém acreditou.','Pedir desculpas|perf-3|Levei uma advertência.','Dizer que a culpa é do excesso de trabalho|?35 h+2|Ganhei uma folga!|fire|O diretor não gostou nada.']],
 ['Post polêmico','Um post antigo meu viralizou e as pessoas marcaram a {co}.',['Pedir desculpas publicamente|?60 f+1|A poeira baixou.|fire f+2|A empresa me demitiu para limpar a imagem.','Dobrar a aposta|f+4 ?20|Virei herói da internet.|fire f+3|Demitid{o} e cancelad{o}.','Apagar tudo e torcer|?50|Ninguém lembrou mais.|perf-5|O RH me chamou para conversar.']],
 ['Auditoria','A auditoria encontrou um erro grave num relatório meu.',['Assumir o erro|k+3 perf-5 ?70|Fui perdoad{o}.|fire|Foi grave demais.','Culpar um colega|k-6 ?50 perf+2|Colou.|fire k-3|Descobriram a mentira.']],
 ['Filial fechando','A {co} vai fechar a filial daqui e me ofereceu transferência para outra cidade.',['Aceitar a transferência|raise+10 h-4|Mudei de cidade com aumento.','Recusar|fire $v|Fui desligad{o} com {v} de indenização.'],{v:[2000,12000]}],
 ['Proposta da concorrência','Uma empresa concorrente quer me contratar com salário maior.',['Aceitar|raise+25 perf-10|Troquei de empresa ganhando mais.','Usar a proposta para negociar|?perf raise+12|Meu chefe cobriu a proposta.|fire|Meu chefe disse: "então pode ir".','Recusar|k+1|Sou fiel à empresa.']],
]);
