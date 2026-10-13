// ===== Rotina: sobrecarga, menu do emprego, clubes que contam, bicos e compras antes dos 18 =====

// ---------- sobrecarga ----------
// Cada compromisso (escola, emprego, clube, filhos pequenos) já ocupa o ano; cada esforço extra soma.
// Spa, ioga, meditação, caminhada e corpo mole aliviam. Passou do limite: felicidade cai, vem depressão, burnout e até a morte.
const LOAD_W={work:2,extra:3,study:1.5,spc:2,office:2,clubT:2,bico:1.5,royal:1,mkt:1,teacher:.3,post:.2,suck:.5,
  b_gym:1,b_martial:1.2,b_sport:1.2,b_music:1,b_acting:1,b_lib:1,b_art:1,b_write:1,b_comedy:1,
  b_spa:-2.5,b_yoga:-1.5,b_med:-1.5,b_walk:-.8,slack:-2,skip:-1,clubSkip:-1};
function baseLoad(m){
  m=m||S.me; if(!m||m.prison) return 0; let b=0; const c=m.edu.cur;
  if(c) b+=c.type==='uni'||c.type==='post'?3:c.type==='medio'?2.5:c.type==='fund'?(m.age<11?1:2):2;
  if(m.job){ const d=m.job.spc?null:JOBS.find(x=>x.id===m.job.id); b+=d&&d.pt?1.5:3.5; }
  if(m.edu.club) b+=1.2; if(m.office) b+=3; if(m.biz) b+=2; if(m.royal&&m.royal.reign) b+=2;
  b+=Math.min(3,kids().filter(k=>k.age<6).length*1.2);
  return b;
}
const loadNow=m=>{ m=m||S.me; return Math.round((baseLoad(m)+((m.yr&&m.yr.load)||0))*10)/10; };
const LOAD_MAX=16;
const loadLabel=v=>v<6?'Tranquil'+oa():v<9?'Ocupad'+oa():v<13?'Sobrecarregad'+oa():'Esgotad'+oa();
function addLoad(k){
  const w=LOAD_W[k]??(k.startsWith('b_')?1:0); if(!w) return;
  const m=S.me, before=loadNow(m); m.yr.load=Math.max(-6,(m.yr.load||0)+w); const now=loadNow(m);
  if(w>0&&before<9&&now>=9) m.yr.loadMsg=`Estou ficando sobrecarregad${oa()}. Melhor ir com calma.`;
  else if(w>0&&before<13&&now>=13) m.yr.loadMsg='Estou no limite. Se continuar nesse ritmo, vou adoecer.';
}
const loadBar=()=>{ const v=loadNow(); return `<div class="mini" style="grid-template-columns:90px 1fr 118px"><span style="text-align:left;color:var(--ink)">Cansaço</span><div class="bar"><i style="width:${Math.min(100,v/LOAD_MAX*100)}%;background:${v<6?'var(--good)':v<9?'#9BCB3B':v<13?'var(--warn)':'var(--bad)'}"></i></div><span>${loadLabel(v)}</span></div>`; };
// efeito do ano que passou (chamado na virada do ano)
function applyLoad(v){
  const m=S.me; if(!m.alive||m.age<10||m.prison) return;
  m.c.lastLoad=v;
  if(v>=13){ m.c.burn=(m.c.burn||0)+1; st('happy',-R.int(8,14)); st('health',-R.int(2,5));
    log(R.pick([`Fiz coisas demais este ano. Ando exaust${oa()} e sem paciência para nada.`,'Mal dormi o ano inteiro. Meu corpo está cobrando.','Vivi no piloto automático: trabalho, compromisso, cansaço.']),'bad'); }
  else if(v>=9){ st('happy',-R.int(3,7)); if(R.chance(.5)) log(R.pick([`Foi um ano corrido. Termino cansad${oa()}.`,'Quase não tive tempo para mim este ano.']),'warn'); }
  else { m.c.burn=Math.max(0,(m.c.burn||0)-1); if(v<4&&m.age>=18) st('happy',R.int(0,2)); }
  if(m.c.burn>=2&&m.happy<40&&!m.dis.some(d=>d.id==='depressao')) addDisease('depressao');
  if(m.c.burn>=3&&!m.dis.some(d=>d.id==='burnout')) addDisease('burnout');
  if(m.c.burn>=5&&v>=13&&m.dis.some(d=>d.id==='burnout')&&R.chance(.07+(m.c.burn-5)*.06)) die('de exaustão, depois de anos se sobrecarregando');
}

// ---------- menu do emprego ----------
function overtime(){ const m=S.me,j=m.job; if(use('extra')>3) return 'O RH travou minhas horas extras este ano.';
  const v=Math.round(jobSalary(j)*.045*diff().$); m.money+=v; j.perf=clamp(j.perf+R.int(1,3)); st('health',-R.int(0,2)); st('happy',-R.int(1,3));
  return R.pick([`Fiz hora extra a semana toda e ganhei ${fmt(v)}.`,`Virei a noite no serviço. Mais ${fmt(v)} na conta.`,`Trabalhei no feriado. Rendeu ${fmt(v)}.`]); }
function slackOff(){ const m=S.me,j=m.job; use('slack'); j.perf=clamp(j.perf-R.int(3,7)); st('happy',R.int(2,5));
  if(j.perf<20&&R.chance(.35)){ log(`Fui ${m.gender==='F'?'demitida':'demitido'} da ${j.co} por corpo mole.`,'bad'); endJob(); return 'Meu chefe me pegou vendo vídeo no horário e me demitiu.'; }
  return R.pick(['Passei o dia enrolando. Ninguém percebeu.','Fiz o mínimo do mínimo e saí no horário.','Almoço de duas horas. Que delícia.']); }
function suckUp(){ const m=S.me,j=m.job; if(use('suck')>2) return 'Meu chefe já está desconfiado de tanto elogio.'; const boss=people('chefe')[0];
  if(R.chance(.55+(m.looks-50)/200)){ j.perf=clamp(j.perf+R.int(2,6)); if(boss) boss.bond=clamp(boss.bond+8); return R.pick(['Elogiei a apresentação do chefe. Ele adorou.','Levei café para o chefe todo dia. Funcionou.']); }
  if(boss) boss.bond=clamp(boss.bond-5); m.karma=clamp(m.karma-1); return 'Exagerei no puxa-saco e os colegas me zoaram.'; }

// ---------- clubes e times que fazem diferença ----------
const clubDef=()=>CLUBS.find(c=>c.n===S.me.edu.club);
const CLUB_RANK=['reserva','titular','capitão'];
const rankName=(c,l)=>c.st==='athletic'?CLUB_RANK[l]:c.st==='smarts'?['membro','líder de equipe','presidente'][l]:['figurante','destaque','solista'][l];
// posição no clube; capitão/titular de time conta para a bolsa de atleta, de banda/coral/teatro para a de música e arte
function setRank(c,l){ const m=S.me; m.edu.clubLvl=l; const k=c.st==='athletic'?'Sport':c.st==='smarts'?'Smart':'Art'; if(l>=1) m.c['tit'+k]=1; if(l>=2) m.c['cap'+k]=1; }
const clubPerf=()=>S.me.edu.clubPerf??50;
function clubAct(k){
  const m=S.me,c=clubDef(); if(!c){ m.edu.club=null; return 'Não estou em nenhum clube.'; }
  const tal=c.st==='smarts'?m.smarts:(m.talent[c.st]||0);
  if(k==='treino'){ const n=use('clubT'); if(n>3) return 'O técnico mandou eu descansar.'; m.edu.clubPerf=clamp(clubPerf()+R.int(3,7)); if(c.st==='smarts') st('smarts',R.int(1,2)); else m.talent[c.st]=clamp(tal+R.int(1,3));
    if(c.st==='athletic'){ cnt('pSport'); st('health',R.int(0,2)); } if(c.st==='musical') cnt('pMusic');
    return R.pick(c.st==='athletic'?['Treinei pesado depois da aula.','Fiquei treinando sozinh'+oa()+' até escurecer.']:c.st==='smarts'?['Fiquei estudando com a equipe até tarde.','Resolvi todos os desafios da semana.']:['Ensaiei até decorar tudo.','Ensaio extra no fim de semana.']); }
  if(k==='falta'){ use('clubSkip'); m.edu.clubPerf=clamp(clubPerf()-R.int(4,8)); st('happy',R.int(1,3)); if(c.st!=='smarts') m.talent[c.st]=clamp(tal-1); return R.pick(['Faltei ao treino e fiquei em casa.','Inventei uma desculpa e não fui.']); }
  if(k==='posicao'){ if(use('clubPos')>1) return 'Já pedi isso este ano.'; const l=m.edu.clubLvl||0; if(l>=2) return `Já sou ${rankName(c,2)}.`;
    // decide o desempenho no clube (treino, presença) somado ao talento
    if(R.chance(clamp((clubPerf()-45-l*10)/45+(tal-50)/200,.03,.92))){ setRank(c,l+1); m.edu.clubPerf=Math.max(55,clubPerf()-10); st('happy',8); log(`Virei ${rankName(c,l+1)} no ${c.n.toLowerCase()}!`,'good'); return `Agora sou ${rankName(c,l+1)}!`; }
    st('happy',-3); return `O técnico disse que meu desempenho (${clubPerf()}%) ainda não basta. Preciso treinar mais.`; }
  if(k==='sair'){ m.edu.club=null; m.edu.clubLvl=0; return `Saí do ${c.n.toLowerCase()}.`; }
}
// fim do ano no clube: talento, nota, saúde, amigos, campeonatos
function clubYear(py){
  const m=S.me,c=clubDef(); if(!c||!m.edu.cur) return;
  const t=py.clubT||0, skip=py.clubSkip||0, lvl=m.edu.clubLvl||0;
  if(skip>=2&&skip>t){ log(`Fui cortad${oa()} do ${c.n.toLowerCase()} por faltar demais.`,'bad'); m.edu.club=null; m.edu.clubLvl=0; st('happy',-5); return; }
  // desempenho do ano: treino e presença sobem, falta derruba; promoção ou rebaixamento sai daqui
  const tal0=c.st==='smarts'?m.smarts:(m.talent[c.st]||0);
  m.edu.clubPerf=clamp(clubPerf()+t*5-skip*7+(tal0-50)/6+R.int(-6,6));
  if(m.edu.clubPerf>=72&&lvl<2){ setRank(c,lvl+1); m.edu.clubPerf=58; st('happy',8); log(`Pelo meu desempenho, virei ${rankName(c,lvl+1)} no ${c.n.toLowerCase()}!`,'good'); }
  else if(m.edu.clubPerf<25&&lvl>0){ m.edu.clubLvl=lvl-1; m.edu.clubPerf=45; st('happy',-6); log(`Meu desempenho caiu e voltei a ser ${rankName(c,lvl-1)} no ${c.n.toLowerCase()}.`,'bad'); }
  const gain=Math.max(-1,2+t*2-skip*2);
  if(c.st==='smarts'){ st('smarts',Math.max(0,Math.round(gain/2))); m.edu.cur.grade=clamp(m.edu.cur.grade+2); }
  else m.talent[c.st]=clamp((m.talent[c.st]||0)+gain);
  if(c.st==='athletic') cnt('pSport'); if(c.st==='musical') cnt('pMusic'); if(c.hl) st('health',Math.round(c.hl/2)); st('happy',2);
  if(R.chance(.3)){ const f=mkPerson({rel:'amigo',age:clamp(m.age+R.int(-1,1),6,30),bond:R.int(55,75)}); S.people.push(f); log(`Fiz amizade com ${f.first} no ${c.n.toLowerCase()}.`,'good'); }
  if(R.chance(.55)){ const tal=c.st==='smarts'?m.smarts:(m.talent[c.st]||0); const win=R.chance(clamp((tal-30)/80+lvl*.08+t*.05,.05,.85));
    const comp=c.st==='athletic'?'o campeonato intercolegial':c.st==='smarts'?'a competição regional':'o festival da cidade';
    if(win){ st('happy',7); m.fame=clamp(m.fame+1); if(c.st==='smarts') cnt('olimp'); log(`O ${c.n.toLowerCase()} venceu ${comp}!${lvl?` E eu era ${rankName(c,lvl)}.`:''}`,'good'); }
    else log(`O ${c.n.toLowerCase()} perdeu ${comp}.`); }
}
// virada do ano: aplica a sobrecarga e o clube do ano que terminou
function endOfYear(py,ld){ const m=S.me; if(m.c.chemo&&!hasCancer(m)){ m.c.chemo=0; m.hairBack=S.year+2; log('Terminei o tratamento. Meu cabelo está voltando a crescer.','good'); }
  if(typeof scenYear==='function'&&S.scen){ scenYear(); if(!S.me.alive) return; }
  clubYear(py); if(typeof factionYear==='function') factionYear(); applyLoad(ld); }

// ---------- bicos (13+) ----------
const BICOS=[['Lavar carros dos vizinhos','🚗',80,300],['Passear com cachorros','🐕',60,260],['Vender brigadeiro','🍫',50,400],['Cortar grama','🌱',70,260],
  ['Cuidar de crianças','🧸',100,350],['Entregar panfletos','📄',40,150],['Dar aula particular','📚',120,500,65],['Consertar celulares','📱',100,600,60]];
// chance de os pais deixarem: depende do relacionamento com eles
function parentChance(){ const ps=parents(); if(!ps.length) return 1; const b=ps.reduce((s,p)=>s+p.bond,0)/ps.length; return clamp(b*.9+8,5,95)/100; }
const chanceWord=p=>p>=.75?'chance alta':p>=.45?'chance média':'chance baixa';
function workPermission(what){
  const m=S.me; if(m.age>=16||!parents().length||m.yr.workOk) return null;
  if(m.yr.workNo) return `Meus pais já disseram que não quero ${what} este ano.`.replace('não quero','não posso');
  if(R.chance(parentChance())){ m.yr.workOk=1; return null; }
  m.yr.workNo=1; parents().forEach(p=>p.bond=clamp(p.bond-1)); return R.pick([`Pedi para ${what} e meus pais disseram que não: "primeiro os estudos".`,`Meus pais não deixaram eu ${what}.`]);
}
function bico(b){
  const m=S.me; if(m.age<13) return 'Ainda sou muito novo para isso.';
  if(b[4]&&m.smarts<b[4]) return 'Ninguém confia em mim para isso ainda.';
  const no=workPermission('fazer bico'); if(no) return no;
  if(use('bico')>4) return 'Já fiz bico demais este ano. Estou exaust'+oa()+'.';
  const v=R.int(b[2],b[3]); m.money+=v; cnt('bicos'); st('happy',R.int(-1,2));
  return R.pick([`${b[0]}: ganhei ${fmt(v)}.`,`${b[0]} rendeu ${fmt(v)}. Dinheiro suado.`]);
}

// ---------- compras antes dos 18: pedir aos pais ou usar o próprio dinheiro ----------
function askParentsChance(cost){
  const m=S.me,ps=parents(); if(!ps.length) return 0; const fam=famMoney(); if(fam<cost) return 0;
  const b=ps.reduce((s,p)=>s+p.bond,0)/ps.length;
  return clamp(b*.85+15-(cost/Math.max(1,fam))*120-(m.yr.asked||0)*15,3,95)/100;
}
function minorPay(cost,fn,title){
  const m=S.me;
  if(m.age>=18||!parents().length||!cost) return act(fn,title);
  const p=askParentsChance(cost), mine=m.money>=cost;
  const ch=[];
  if(p>0) ch.push({l:`Pedir para os meus pais (${chanceWord(p)})`,fn:()=>{ m.yr.asked=(m.yr.asked||0)+1;
    if(R.chance(p)){ const ps=parents().sort((a,b)=>b.money-a.money); let need=cost; for(const q of ps){ const t=Math.min(need,Math.max(0,q.money)); q.money-=t; need-=t; if(need<=0) break; } m.money+=cost;
      const who=ps[0]; setTimeout(()=>act(()=>{ const r=fn(); return (who?`${who.rel==='mae'?'Minha mãe':'Meu pai'} pagou! `:'Meus pais pagaram! ')+(typeof r==='string'?r:''); },title),30); }
    else { parents().forEach(q=>q.bond=clamp(q.bond-1)); setTimeout(()=>msg(title||'Compra',R.pick(['Meus pais disseram não.','"Você acha que dinheiro dá em árvore?" Foi um não.','Meus pais disseram que não é hora de gastar com isso.'])),30); } }});
  else ch.push({l:'Meus pais não têm como pagar isso',cls:'alt',fn:()=>{}});
  if(mine) ch.push({l:`Usar meu dinheiro (tenho ${fmt(m.money)})`,fn:()=>setTimeout(()=>act(fn,title),30)});
  ch.push({l:'Deixa pra lá',cls:'alt'});
  modal({t:'Quem vai pagar?',x:`Custa ${fmt(cost)}. Eu tenho ${fmt(m.money)} guardado${mine?'':', não dá'}.`,ch});
}

// ---------- telas ----------
V.bicos=()=>({title:'Bicos',items:[{html:`<div class="card"><p>Dinheiro rápido sem carteira assinada. Até os 15 anos, meus pais precisam deixar (depende de como está nosso relacionamento).</p>${loadBar()}</div>`}]
  .concat(BICOS.map(b=>({ic:b[1],l:b[0],s:`${fmt(b[2])} a ${fmt(b[3])}${b[4]?' · precisa de inteligência '+b[4]+'%':''}`,dis:S.me.age<13,why:'A partir dos 13 anos.',on:()=>act(()=>bico(b),'Bico')})))});
V.clubMenu=()=>{ const m=S.me,c=clubDef(); if(!c) return V.clubs();
  const tal=c.st==='smarts'?m.smarts:(m.talent[c.st]||0), lvl=m.edu.clubLvl||0;
  return {title:c.n,items:[{html:`<div class="card">${kv('Posição',rankName(c,lvl))}${bar('Desempenho no clube',clubPerf())}${bar(c.st==='smarts'?'Inteligência':'Talento',tal)}${loadBar()}<p style="color:var(--muted);font-size:13px">Desempenho alto no fim do ano promove (até ${rankName(c,2)}); baixo rebaixa. ${c.st==='athletic'?'Ser titular ou capitão facilita a bolsa de atleta na faculdade.':c.st==='smarts'?'Vitórias em competições contam pontos no vestibular.':'Ser destaque ou solista facilita a bolsa de música e arte.'} Treinar cansa; faltar demais tira você do clube.</p></div>`},
    {ic:'💪',l:c.st==='athletic'?'Treinar mais':'Ensaiar / me dedicar mais',s:'Mais talento e chance de vencer · cansa',on:()=>act(()=>clubAct('treino'),c.n)},
    {ic:'🙂',l:'Só participar normalmente',s:'Sem esforço extra',on:()=>msg(c.n,'Vou seguir no ritmo normal.')},
    {ic:'🛋️',l:'Faltar aos treinos',s:'Descansa, mas pode ser cortad'+oa(),on:()=>act(()=>clubAct('falta'),c.n)},
    {ic:'⭐',l:lvl>=2?`Já sou ${rankName(c,2)}`:`Disputar vaga de ${rankName(c,lvl+1)}`,dis:lvl>=2,why:'Não dá para subir mais.',on:()=>act(()=>clubAct('posicao'),c.n)},
    {ic:'🚪',l:'Sair do clube',tone:'bad',on:()=>act(()=>clubAct('sair'),c.n)}]}; };
