// ===== Epidemia zumbi dinâmica: o fim do mundo não tem data marcada =====
// Quatro forças mudam a cada ano: infecção (espalha), governo (contém, mas cansa), abastecimento e segurança (caem com o caos).
// O colapso chega quando a infecção domina ou a segurança acaba: pode ser em dois anos ou em sete. As escolhas ajudam o seu lado.
const EP_CIDADES=['Manila','Lagos','Bucareste','Lima','Jacarta','Karachi','Daca','Kinshasa'];
const epBar=e=>`Infecção ${e.inf}% · Governo ${e.gov}% · Abastecimento ${e.sup}% · Segurança ${e.seg}%`;
function epEvolve(e){ e.anos++;
  const spread=R.int(14,36)*(1.3-e.gov/100)*(e.vac?.45:1)*(e.anos>3?1.25:1);
  e.inf=clamp(Math.round(e.inf+spread));
  e.gov=clamp(e.gov+R.int(-14,5)-(e.inf>60?8:0)+(e.vac?6:0));
  e.sup=clamp(e.sup-Math.round(e.inf*(.25+R.f()*.35)));
  e.seg=clamp(e.seg-Math.round(e.inf*.3*(1-e.local/160))+(e.gov>60?6:0)); }
function epManchete(e){ return e.inf<25?R.pick(['Os casos ainda são poucos, mas os hospitais de três países estão lotados.','A OMS fala em "situação sob controle". Ninguém acredita muito.'])
  :e.inf<55?R.pick(['Primeiros casos confirmados no país. O governo fechou as fronteiras.','Escolas fechadas. Um vídeo de um "morto que levantou" foi apagado das redes em minutos.'])
  :e.inf<80?R.pick(['Bairros inteiros isolados pelo exército. Os mercados racionam arroz e água.','O noticiário parou de mostrar números. Só pede calma.'])
  :R.pick(['As sirenes tocam toda noite. Muitos vizinhos sumiram.','A televisão sai do ar por horas. Quando volta, ninguém sabe o que dizer.']); }
function epStep(pr){ const m=S.me, b=pr.b, adv=()=>{ pr.fase++; };
  const e=pr.ep||(pr.ep={inf:R.int(3,14),gov:R.int(35,85),sup:100,seg:100,anos:0,local:0,vac:0,cidade:R.pick(EP_CIDADES)});
  if(pr.fase>0) epEvolve(e);
  const Q=(t,x,ch)=>MQ.push({k:SCEN.zumbi.n,t:prT(t),x:prT(x)+'\n\n'+epBar(e),ch:ch.filter(Boolean)});
  const colapso=e.inf>=92||e.seg<=15||e.anos>=7;
  if(colapso){ pr.fim=e.gov>=55?'militar':e.sup<=10?'fome':'caos';
    const txt={militar:'O exército não conseguiu mais segurar. Os helicópteros passam levando só quem consegue chegar à zona verde. O resto está por conta própria.',
      fome:'Não sobrou comida em lugar nenhum. A cidade parou de vez, e os mortos agora são mais numerosos que os vivos.',
      caos:'A sirene da cidade tocou às três da manhã e não parou mais. Pela janela, gente correndo. Alguns correndo atrás dos outros. Ninguém está no comando.'}[pr.fim];
    log(`O mundo acabou depois de ${e.anos} ${e.anos===1?'ano':'anos'} de epidemia.`,'bad');
    return Q('O dia em que o mundo acabou',txt,prolCompCh(pr,3,()=>prolGo(),'Fugir')); }
  if(pr.fase===0){ log(`Vi no jornal uma notícia sobre um surto estranho em ${e.cidade}.`,'warn');
    return Q('Notícia de rodapé',`No jornal da noite, uma nota rápida: um surto de "raiva agressiva" num hospital de ${e.cidade}. Pacientes mordendo enfermeiros. O apresentador sorriu e passou para o futebol.`,[
      {l:'Mudar de canal',fn:adv},
      {l:'Pesquisar mais na internet',fn:()=>{ adv(); b.info=1; st('smarts',2); }},
      prolPago(600,{l:'Guardar uns enlatados, por via das dúvidas',fn:()=>{ adv(); b.com=(b.com||0)+3; m.money-=600; }})]); }
  log(epManchete(e),'warn');
  // evento especial: vacina experimental, se o governo ainda tem força
  if(e.gov>=60&&e.inf>=30&&!e.vacT&&R.chance(.5)){ e.vacT=1;
    return Q('A vacina experimental','Um laboratório anunciou uma vacina experimental e procura voluntários para o teste.',[
      {l:'Ser voluntári{o}',fn:()=>{ adv(); if(R.chance(.55)){ b.vacina=1; e.vac=1; log('Participei do teste da vacina. Os resultados animaram os cientistas.','good'); } else { st('health',-8); log('Participei do teste da vacina e passei muito mal.','bad'); } }},
      {l:'Esperar os resultados',fn:()=>{ adv(); if(R.chance(.4)) e.vac=1; }},
      {l:'Desconfiar da vacina',fn:adv}]); }
  if(e.gov<35&&!e.milT&&R.chance(.5)){ e.milT=1;
    return Q('Sem governo','O governo praticamente desapareceu. Grupos armados começaram a "proteger" os bairros em troca de comida.',[
      {l:'Organizar a vizinhança por conta própria',fn:()=>{ adv(); e.local=Math.min(100,e.local+40); b.viz=1; m.karma=clamp(m.karma+5); log('Organizei a vizinhança. Fazemos rondas à noite.','good'); }},
      {l:'Pagar a proteção do grupo armado',fn:()=>{ adv(); m.money-=Math.min(m.money,2000); e.seg=clamp(e.seg+10); m.karma=clamp(m.karma-4); }},
      {l:'Me trancar em casa',fn:()=>{ adv(); st('happy',-6); }}]); }
  if(e.inf<45) return Q('O mundo em alerta',`${epManchete(e)} Ainda dá para se preparar.`,[
      prolPago(1800,{l:'Estocar comida e água',fn:()=>{ adv(); b.com=(b.com||0)+4; b.agua=(b.agua||0)+3; m.money-=1800; }}),
      {l:'Fazer aulas de defesa pessoal',fn:()=>{ adv(); m.fight=clamp((m.fight||0)+8); }},
      {l:'Ajudar no hospital como voluntári{o}',fn:()=>{ adv(); b.med=1; m.karma=clamp(m.karma+5); if(R.chance(.2)) st('health',-6); }},
      {l:'Seguir a vida normal',fn:()=>{ adv(); st('happy',3); }}]);
  if(e.inf<75) return Q('Quarentena',`${epManchete(e)} O governo decretou quarentena.`,[
      {l:'Obedecer a quarentena',fn:()=>{ adv(); st('happy',-4); e.local=Math.min(100,e.local+10); }},
      prolPago(4500,{l:'Comprar uma arma "por precaução"',fn:()=>{ adv(); b.arma=1; m.money-=4500; }}),
      prolPago(3000,{l:'Reforçar portas e janelas de casa',fn:()=>{ adv(); b.forte=1; m.money-=3000; }}),
      {l:'Furar a quarentena para trabalhar',fn:()=>{ adv(); m.money+=2500; if(R.chance(.3)) st('health',-10); }}]);
  return Q('A cidade desmorona',`${epManchete(e)} Os saques começaram.`,[
      {l:'Montar uma patrulha com os vizinhos',fn:()=>{ adv(); e.local=Math.min(100,e.local+30); b.viz=1; }},
      prolPago(1500,{l:'Comprar o que sobrou no mercado',fn:()=>{ adv(); b.com=(b.com||0)+3; m.money-=1500; }}),
      {l:'Saquear uma farmácia',fn:()=>{ adv(); b.med=1; m.karma=clamp(m.karma-8); }},
      {l:'Rezar e esperar',fn:()=>{ adv(); st('happy',2); }}]); }
prolStep=(o=>function(){ const pr=S.me&&S.me.prol; if(pr&&pr.id==='zumbi'&&!S.scen&&S.me.alive) return epStep(pr); return o.apply(this,arguments); })(prolStep);
// o jeito que o mundo acabou muda o começo
prolGo=(o=>function(){ const pr=S.me&&S.me.prol; const r=o.apply(this,arguments); const sc=S.scen; if(!pr||!sc||sc.id!=='zumbi') return r;
  const b=pr.b||{}, add=(id,n)=>{ for(let i=0;i<n;i++) addItem(id,null,true); };
  if(b.med){ add('kit',1); add('antib',1); }
  if(b.forte) sc.zmat=(sc.zmat||0)+8;
  if(b.vacina){ add('vacina',1); }
  if(pr.fim==='militar'){ add('racao',2); mkCrew({role:'ati',lv:80}); scLog('Um soldado desgarrado da zona verde se juntou ao grupo.','good'); }
  if(pr.fim==='fome'){ sc.inv=sc.inv.filter((x,i)=>itCat(x.id)!=='comida'||i%2===0); scStat('fome',20); scLog('Começamos com fome: a comida acabou antes do mundo.','bad'); }
  if(pr.ep) scLog(`A epidemia levou ${pr.ep.anos} ${pr.ep.anos===1?'ano':'anos'} para derrubar tudo.`,'warn');
  return r; })(prolGo);
// na tela dos modos, mostra como está o mundo
V.scenPick=(o=>()=>{ const r=o(), pr=S.me.prol; if(pr&&pr.id==='zumbi'&&pr.ep) r.items.splice(2,0,{html:`<div class="card"><p style="font-size:13px">${esc(epBar(pr.ep))}</p></div>`}); return r; })(V.scenPick);
