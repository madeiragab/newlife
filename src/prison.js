// ===== Prisão: rotina, grupo (facção), brigas, matar, motim e fuga =====
const GANG_NAMES=['Irmandade do Pátio','Comando da Ala B','Os Esquecidos','Família do Corredor','Bonde do Refeitório','Liga da Lavanderia','Os Sem Visita','Tropa da Cela 13'];
const GANG_RANK=['membro','braço direito','líder'];
// detentos com nome, do mesmo gênero (a ala é separada)
function inmates(){ const m=S.me; if(!m.yr.inmates) m.yr.inmates=[]; while(m.yr.inmates.length<4) m.yr.inmates.push((()=>{ const p=stranger({gender:m.gender}); return {n:p.first+' '+R.pick(['"'+R.pick(['Tatu','Marreta','Cicatriz','Pitbull','Baixinho','Professor','Navalha','Tanque','Fantasma','Gordo'])+'"','',''])+'',fight:R.int(25,90),gang:R.chance(.5)?R.pick(GANG_NAMES):null}; })()); return m.yr.inmates; }
const prisonFoe=i=>{ const x=inmates()[i]; return {name:x.n.trim(),power:x.fight,gender:S.me.gender}; };
function prisonDo(k){
  const m=S.me,pr=m.prison; if(!pr) return 'Não estou pres'+oa()+'.';
  if(k==='comportar'){ if(use('pr_comp')>3) return 'Já sou o detento mais exemplar da ala este ano.'; pr.behav=clamp(pr.behav+R.int(7,12)); st('happy',-1);
    return R.pick(['Cumpri todas as regras, ajudei na limpeza e não arrumei confusão.','Fiquei na minha. Os guardas notaram.','Ajudei um guarda a separar uma briga. Ponto para mim.']); }
  if(k==='livro'){ if(use('pr_livro')>3) return 'Já li todos os livros bons da biblioteca este ano.'; st('smarts',R.int(1,4)); pr.behav=clamp(pr.behav+3); cnt('books');
    return `Li ${R.pick(['"Dom Casmurro"','"O Conde de Monte Cristo"','"Crime e Castigo"','"Memórias do Cárcere"','"O Pequeno Príncipe"','"Cem Anos de Solidão"','um livro de direito penal','uma biografia de Mandela','"O Alquimista"'])}.`; }
  if(k==='criarGrupo'){ if(pr.gang) return 'Já faço parte de um grupo.'; if(m.fight<35&&!(m.c.kills>0)) return 'Ninguém me levou a sério. Preciso de mais respeito no pátio (luta 35%+).';
    const n=R.pick(GANG_NAMES); pr.gang={n,rank:2,rep:30,own:1}; pr.behav=clamp(pr.behav-10); cnt('gangs'); log(`Fundei um grupo na prisão: ${n}.`,'warn'); return `Fundei o grupo "${n}". Agora sou o líder.`; }
  if(k==='entrarGrupo'){ if(pr.gang) return 'Já faço parte de um grupo.'; if(use('pr_grupo')>1) return 'Já tentei este ano.'; const n=R.pick(GANG_NAMES);
    if(R.chance(clamp(.35+m.fight/150,.1,.9))){ pr.gang={n,rank:0,rep:10}; pr.behav=clamp(pr.behav-6); log(`Entrei para o grupo ${n} na prisão.`,'warn'); return `Fui aceit${oa()} no grupo "${n}". Agora tenho proteção.`; }
    st('health',-R.int(3,8)); return 'Fizeram um teste comigo no pátio. Não passei e ainda levei uns tapas.'; }
  if(k==='servico'){ const g=pr.gang; if(!g) return 'Não tenho grupo.'; if(use('pr_serv')>2) return 'Já fiz serviço demais este ano.';
    if(R.chance(.75)){ const v=R.int(200,2000); m.money+=v; g.rep=clamp(g.rep+R.int(5,12)); pr.behav=clamp(pr.behav-4); return R.pick([`Passei cigarros e celulares pela ala. Ganhei ${fmt(v)}.`,`Cobrei uma dívida de outro detento para o grupo. Ganhei ${fmt(v)}.`]); }
    pr.left+=1; pr.total+=1; pr.behav=clamp(pr.behav-15); return 'Fui pego com contrabando na revista. Mais um ano de pena.'; }
  if(k==='subir'){ const g=pr.gang; if(!g||g.rank>=2) return 'Não dá para subir mais.'; if(use('pr_subir')>1) return 'Já tentei subir este ano.';
    if(g.rep>=40+g.rank*25&&R.chance(clamp(.35+m.fight/200+g.rep/300,.1,.9))){ g.rank++; log(`Virei ${GANG_RANK[g.rank]} do grupo ${g.n}.`,'warn'); st('happy',6); return `Agora sou ${GANG_RANK[g.rank]} do grupo.`; }
    return `O grupo ainda não me respeita o bastante (respeito ${g.rep}%). Preciso fazer mais pelo grupo.`; }
  if(k==='sairGrupo'){ const g=pr.gang; if(!g) return 'Não tenho grupo.'; pr.gang=null; pr.behav=clamp(pr.behav+8); if(!g.own&&R.chance(.5)){ st('health',-R.int(8,18)); return 'Saí do grupo. Não gostaram nada: me pegaram no banho.'; } return 'Saí do grupo. Quero cumprir minha pena em paz.'; }
  if(k==='motim'){ if(use('pr_motim')>1) return 'Ninguém topa outro motim tão cedo.'; cnt('riots'); const g=pr.gang, lead=g&&g.rank===2;
    if(R.chance(.05)){ die('baleado durante um motim na prisão'); return 'A polícia invadiu o pavilhão atirando.'; }
    if(R.chance(clamp(.22+(lead?.2:g?.08:0)+m.fight/300,.05,.7))){ st('happy',10); m.fame=clamp(m.fame+3); if(g) g.rep=clamp(g.rep+15);
      if(R.chance(.5)){ pr.left+=R.int(2,5); pr.total+=3; log('Fui identificad'+oa()+' como líder do motim. Pena aumentada.','bad'); return 'O motim tomou o pavilhão e conseguimos melhorias, mas me identificaram como um dos líderes. Pena aumentada.'; }
      return 'O motim tomou o pavilhão por dois dias. Conseguimos comida melhor e banho quente, e ninguém me dedurou.'; }
    pr.left+=R.int(3,8); pr.total+=5; pr.behav=clamp(pr.behav-30); st('health',-R.int(10,25)); log('Participei de um motim que deu errado.','bad'); return 'A tropa de choque retomou o pavilhão. Fui para a solitária e ganhei anos a mais de pena.'; }
  if(k.startsWith('matar:')){ const x=inmates()[+k.split(':')[1]]; if(!x) return ''; cnt('kills'); m.karma=clamp(m.karma-35); const g=pr.gang;
    const ok=R.chance(clamp(.35+m.fight/200+(g?g.rank*.1:0)-x.fight/300,.08,.85));
    if(!ok){ st('health',-R.int(10,30)); pr.behav=clamp(pr.behav-25); if(m.health<=0){ die('numa emboscada que deu errado na prisão'); return ''; } m.c.kills=Math.max(0,(m.c.kills||1)-1); return `${x.n.trim()} percebeu a emboscada e revidou. Saí bem machucad${oa()}.`; }
    m.yr.inmates=inmates().filter(y=>y!==x); if(g) g.rep=clamp(g.rep+20);
    if(R.chance(.6)){ const y=R.int(8,20); pr.left+=y; pr.total+=y; pr.behav=clamp(pr.behav-40); log(`Matei ${x.n.trim()} na prisão. Descobriram: mais ${y} anos de pena.`,'bad'); return `Pegaram as imagens da câmera. Mais ${y} anos de pena.`; }
    log(`Matei ${x.n.trim()} na prisão. Ninguém viu nada.`,'bad'); return `${x.n.trim()} foi encontrado morto na cela. Ninguém viu nada.`; }
  return '';
}
// proteção do grupo e risco de guerra entre grupos
function prisonYearGang(){ const m=S.me,pr=m.prison; if(!pr||!pr.gang) return; const g=pr.gang;
  if(R.chance(.15)){ if(R.chance(.5+g.rank*.15)){ g.rep=clamp(g.rep+8); log(`O grupo ${g.n} venceu uma guerra contra outro grupo no pátio.`,'warn'); } else { st('health',-R.int(8,20)); log(`Guerra entre grupos no pátio. O ${g.n} levou a pior e eu também.`,'bad'); } } }
function prisonMenu(){ const m=S.me,pr=m.prison,g=pr&&pr.gang; const row=(l,s,k,ic,tone)=>({ic,l,s,tone,on:()=>act(()=>prisonDo(k),'Prisão')});
  const it=[{sec:'Rotina'},row('Se comportar','Bom comportamento conta para a condicional','comportar','😇'),row('Ler um livro','Inteligência e comportamento','livro','📖'),
    {ic:'🏋️',l:'Malhar no pátio',on:()=>act(()=>prisonAct('malhar'),'Prisão')},{ic:'🧺',l:'Trabalhar (remição de pena)',on:()=>act(()=>prisonAct('trabalho'),'Prisão')},
    {sec:'Grupo'}];
  if(g){ it.push({html:`<div class="card">${kv('Grupo',g.n)}${kv('Cargo',GANG_RANK[g.rank])}${bar('Respeito',g.rep)}</div>`});
    it.push(row('Fazer um serviço para o grupo','Contrabando e cobranças · dá dinheiro e respeito','servico','📦','bad'));
    if(g.rank<2) it.push(row(`Subir a ${GANG_RANK[g.rank+1]}`,'Precisa de respeito e de luta','subir','⬆️'));
    it.push(row('Sair do grupo','Pode ter troco','sairGrupo','🚪','bad')); }
  else { it.push(row('Criar um grupo','Precisa de respeito no pátio (luta 35%+)','criarGrupo','🏴','bad')); it.push(row('Entrar num grupo','Proteção, mas atrapalha o comportamento','entrarGrupo','🤝')); }
  it.push({sec:'Confusão'});
  it.push({ic:'👊',l:'Arrumar briga',s:'Eu escolho os golpes',tone:'bad',on:()=>{ if(use('pr_briga')>3) return msg('Prisão','Os guardas estão de olho em mim.'); const i=R.int(0,inmates().length-1); startFight(prisonFoe(i),'prisao'); }});
  it.push({ic:'🔪',l:'Matar alguém',s:'Escolher um detento',tone:'bad',on:()=>UI.push(()=>({title:'Matar alguém',items:[{html:'<div class="card"><p>Uma emboscada com estilete. Se descobrirem, a pena aumenta muito. Também dá para brigar até o fim e usar golpes letais.</p></div>'}].concat(inmates().map((x,i)=>({ic:'🧍',l:x.n.trim(),s:`Luta ${x.fight}%${x.gang?' · do grupo '+x.gang:''}`,on:()=>UI.push(()=>({title:x.n.trim(),items:[
      {ic:'🔪',l:'Emboscada com estilete',tone:'bad',on:()=>{ UI.close(); act(()=>prisonDo('matar:'+i),'Prisão'); }},
      {ic:'👊',l:'Desafiar para uma briga',tone:'bad',on:()=>{ UI.close(); startFight(prisonFoe(i),'prisao'); }}]}))})))}))});
  it.push(row('Fazer um motim','Pode dar certo, aumentar a pena ou acabar em tiro','motim','🔥','bad'));
  it.push({sec:'Saída'});
  it.push({ic:'⚖️',l:'Entrar com recurso',s:fmt(5000),on:()=>act(()=>prisonAct('apelar'),'Justiça')});
  it.push({ic:'🏃',l:'Tentar fugir',s:'Minijogo: labirinto com guardas',tone:'bad',on:()=>{ if(use('fuga')>1){ msg('Fuga','Os guardas estão de olho em mim. Melhor esperar o ano que vem.'); return; } UI.close(); mgEscape(); }});
  return it; }
