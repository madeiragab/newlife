// ===== Derrubar o governo: movimento, armas, generais e o golpe =====
const rev=()=>S.me.rev||null;
function revFix(r){ ['apoio','mil','armas','susp'].forEach(k=>r[k]=clamp(r[k])); r.membros=Math.max(1,Math.round(r.membros)); return r; }
function revStart(nome){ const m=S.me; m.rev={n:nome,apoio:R.int(2,6),mil:0,armas:0,susp:5,membros:R.int(3,8),anos:0}; m.c.rev=1; log(`Fundei em segredo o movimento ${nome}. O objetivo: derrubar o governo.`,'warn'); return `O ${nome} nasceu num porão, com ${m.rev.membros} pessoas e um mimeógrafo.`; }
function revAcao(k){ const m=S.me, r=rev(); if(!r) return ''; if(use('rev_'+k)>2) return 'Já fiz muito disso este ano. Chamar atenção demais é suicídio.'; let t='';
  switch(k){
    case 'panfleto': { const g=R.int(2,6)+Math.round(m.fame/20); r.apoio+=g; r.membros+=R.int(5,30); r.susp+=R.int(3,7); t=`Panfletos na madrugada, pichações nos viadutos. O apoio subiu para ${clamp(r.apoio)}%.`; break; }
    case 'protesto': { if(R.chance(.25)){ r.susp+=12; r.membros=Math.round(r.membros*.85); st('health',-R.int(5,15)); t='A polícia dispersou o protesto com bombas. Vários companheiros foram presos.'; } else { r.apoio+=R.int(6,12); r.membros+=R.int(30,200); r.susp+=8; m.fame=clamp(m.fame+3); t='Milhares nas ruas gritando o nosso lema. A TV não teve como ignorar.'; } break; }
    case 'armas': { const c=30000; if(m.money<c) return `Um lote de armas custa ${fmt(c)}.`; m.money-=c; r.armas+=R.int(12,20); r.susp+=6; m.karma=clamp(m.karma-4); t='Um contrabandista entregou caixas de fuzis num galpão do porto.'; break; }
    case 'general': { const c=80000; if(m.money<c) return `Comprar um general custa pelo menos ${fmt(c)}.`; m.money-=c; if(R.chance(.55+m.smarts/400)){ r.mil+=R.int(15,25); t='Um general aceitou o dinheiro e prometeu que os quartéis não vão reagir.'; } else { r.susp+=20; t='O general aceitou o dinheiro e me denunciou.'; } break; }
    case 'hacker': { if(R.chance(.5+m.smarts/300)){ r.apoio+=R.int(5,10); r.susp+=4; t='Hackeamos a TV estatal e passamos nosso manifesto no horário nobre.'; } else { r.susp+=12; t='O ataque falhou e deixou rastros.'; } break; }
    case 'sumir': { r.susp-=R.int(10,18); t='Mandei o movimento hibernar. Sem reuniões, sem panfletos, sem celulares.'; break; }
  }
  revFix(r); return t; }
function revChance(r){ return Math.max(.03,Math.min(.9,r.apoio/250+r.mil/160+r.armas/300+(r.membros>500?.08:0)-.1)); }
function revGolpe(){ const m=S.me, r=rev(); if(!r) return ''; const p=revChance(r); m.c.golpe=(m.c.golpe||0)+1;
  if(R.chance(p)){ if(m.job) endJob(); m.office={id:'pres',yrs:0,appr:R.int(30,60),dit:1}; cnt('office_pres'); cnt('pres'); m.fame=clamp(m.fame+70); m.rev=null; st('happy',20);
    log(`Derrubei o governo. Agora sou ${m.gender==='F'?'a líder suprema':'o líder supremo'} do país.`,'good'); return `Tanques nas ruas, o palácio cercado, o presidente fugindo de helicóptero. Às 6 da manhã, falei em rede nacional: o país agora é meu.`; }
  const n=R.f(); m.rev=null; m.karma=clamp(m.karma-5);
  if(n<.2){ die('fuzilad'+oa()+' depois de um golpe de Estado fracassado'); return 'O golpe fracassou. O tribunal militar foi rápido.'; }
  if(n<.35&&m.money>10000){ m.money=Math.round(m.money*.3); m.c.fugitive=1; return 'O golpe fracassou. Fugi pela fronteira de madrugada, com o que deu para carregar.'; }
  arrest('tentativa de golpe de Estado',10,30); return 'O golpe fracassou. Os quartéis não se moveram. A polícia me achou no porão.'; }
// todo ano: a polícia política desconfia, ou esquece
function revAno(){ const m=S.me, r=rev(); if(!r||!m.alive||m.prison) return; r.anos++; r.susp+=R.int(-4,6); r.apoio+=R.int(-3,2); revFix(r);
  if(r.susp>=60&&R.chance((r.susp-45)/80)) queue('rev_policia',{}); }
yearMoney=(o=>function(){ const x=o.apply(this,arguments); try{ revAno(); const of=S.me.office; if(of&&of.dit){ S.pending=S.pending.filter(e=>e.id!=='reeleicao'); if(of.appr<25&&R.chance(.35)) queue('rev_contragolpe',{}); } }catch(e){} return x; })(yearMoney);
occupation=(o=>()=>{ const m=S.me; if(m&&m.alive&&!m.prison&&m.office&&m.office.dit&&!(S.scen)) return m.gender==='F'?'Líder suprema':'Líder supremo'; return o(); })(occupation);
V.rev=()=>{ const m=S.me, r=rev(), it=[];
  if(m.office&&m.office.dit) return {title:'Revolução',items:[{html:'<div class="card"><p>O governo já é meu. Agora é não deixar ninguém fazer comigo o que eu fiz.</p></div>'}]};
  if(!r){ it.push({html:'<div class="card"><p>Organize um movimento clandestino, conquiste o povo, compre armas e generais, e tome o poder. Se der errado, é prisão perpétua, exílio ou fuzilamento.</p></div>'},
    {ic:'✊',l:'Fundar um movimento clandestino',s:'O primeiro passo',on:()=>modal({t:'Nome do movimento',html:'<input class="in" id="revNome" style="margin-top:8px" maxlength="40" placeholder="Frente de Libertação Nacional" autocomplete="off">',ch:[{l:'Fundar',fn:()=>{ const el=document.getElementById('revNome'); const v=((el&&el.value)||'').trim()||'Frente de Libertação Nacional'; MQ.unshift({t:'Revolução',x:revStart(v)}); UI.close(); }},{l:'Cancelar',cls:'alt'}]})});
    return {title:'Revolução',items:it}; }
  it.push({html:`<div class="card"><p><b>✊ ${esc(r.n)}</b></p>${kv('Membros',r.membros.toLocaleString('pt-BR'))}${bar('Apoio do povo',r.apoio)}${bar('Militares do nosso lado',r.mil)}${bar('Armas',r.armas)}${bar('Suspeita da polícia política',r.susp)}${kv('Chance do golpe hoje',Math.round(revChance(r)*100)+'%')}</div>`},{sec:'Preparar'});
  const A=(k,ic,l,s)=>it.push({ic,l,s,on:()=>act(()=>revAcao(k),l)});
  A('panfleto','📜','Panfletar e pichar','Apoio do povo'); A('protesto','📢','Convocar um protesto','Muito apoio · risco de repressão'); A('hacker','💻','Invadir a TV estatal','Apoio · pode deixar rastro');
  A('armas','🔫',`Comprar armas`,`${fmt(30000)} · armas`); A('general','🎖️','Subornar um general',`${fmt(80000)} · militares`); A('sumir','🤫','Hibernar o movimento','Diminui a suspeita');
  it.push({sec:'A hora da verdade'},{ic:'💥',l:'Dar o golpe',s:`Chance de ${Math.round(revChance(r)*100)}% · tudo ou nada`,tone:'bad',on:()=>confirmBox('Dar o golpe?','Se der errado: prisão, exílio ou fuzilamento.','Dar o golpe',()=>act(revGolpe,'Golpe de Estado'))},
    {ic:'🏳️',l:'Abandonar o movimento',on:()=>confirmBox('Abandonar?','O movimento vai seguir sem você, ou acabar.','Abandonar',()=>act(()=>{ m.rev=null; return 'Queimei os papéis e voltei para a vida normal. Torço para ninguém lembrar de mim.'; },'Revolução'))});
  return {title:r.n,items:it}; };
V.politics=(o=>()=>{ const r=o(); if(S.me.age>=18) r.items.push({sec:'Por fora das urnas'},{ic:'✊',l:'Derrubar o governo',s:rev()?rev().n:'Movimento clandestino e golpe de Estado',tone:'bad',on:()=>UI.push(V.rev)}); return r; })(V.politics);
EVENTS.rev_policia={show:()=>({k:'Revolução',t:'A polícia política bateu na porta',x:`Agentes à paisana cercaram o esconderijo do ${rev()?rev().n:'movimento'}.`,ch:[['Resistir com as armas','r'],['Fugir pelos fundos','f'],['Entregar os companheiros','e']]}),
  pick:k=>{ const m=S.me, r=rev(); if(!r) return '';
    if(k==='e'){ m.rev=null; m.karma=clamp(m.karma-20); return 'Entreguei todos em troca da minha liberdade. Nunca mais consegui me olhar no espelho.'; }
    if(k==='r'&&r.armas>=30&&R.chance(.5)){ r.susp=40; r.apoio+=8; cnt('kills'); revFix(r); return 'Houve tiroteio. Os agentes recuaram. Viramos lenda nas ruas.'; }
    if(k==='f'&&R.chance(.55)){ r.susp=35; r.membros=Math.round(r.membros*.7); revFix(r); return 'Escapei pelos telhados. Perdemos alguns companheiros.'; }
    m.rev=null; arrest('conspiração contra o Estado',5,20); return 'Não deu. Fui levad'+oa()+' encapuzad'+oa()+'.'; }};
EVENTS.rev_contragolpe={show:()=>({k:'Política',t:'Contragolpe!',x:'Generais insatisfeitos cercaram o palácio. Querem fazer comigo o que eu fiz com o governo anterior.',ch:[['Resistir','r'],['Negociar','n'],['Fugir para o exílio','f']]}),
  pick:k=>{ const m=S.me, of=m.office; if(!of) return '';
    if(k==='f'){ m.office=null; m.money=Math.round(m.money*.5); m.c.fugitive=1; return 'Fugi num avião particular com metade do tesouro. Vivo exilad'+oa()+' numa ilha.'; }
    if(k==='n'&&R.chance(.5)){ of.appr=clamp(of.appr+15); m.money-=Math.min(m.money,500000); return 'Dei cargos e dinheiro aos generais. Ficaram. Por enquanto.'; }
    if(k==='r'&&R.chance(.45)){ of.appr=clamp(of.appr+10); return 'A guarda presidencial resistiu. Os generais foram presos.'; }
    m.office=null; if(R.chance(.35)){ die('num contragolpe militar'); return 'O palácio caiu.'; } arrest('crimes contra o Estado',15,40); return 'O palácio caiu. Fui pres'+oa()+'.'; }};
const RW2=f=>m=>!!m.rev&&!m.prison&&f(m.rev,m);
pack({k:'Revolução',w:1.4,cd:6,min:18,when:RW2(()=>true)},[
  ['Infiltrado','Desconfiam que um novo membro do movimento é agente do governo.',['Expulsar|rsusp-6|Ele sumiu na mesma noite. Era mesmo.','Dar informação falsa para testar|?sm rsusp-10|Ele caiu na armadilha e entregou tudo errado aos chefes.|rsusp+15|Ele percebeu o teste.']],
  ['Apoio estrangeiro','Um país vizinho oferece dinheiro e armas para o movimento.',['Aceitar|$+60000 armas+15 apoio-5|O povo não gosta de golpe com dinheiro de fora.','Recusar|apoio+5|A revolução tem que ser nossa.']],
  ['Companheiro preso','Um dos fundadores do movimento foi preso e está sendo interrogado.',['Planejar o resgate|?40 apoio+10 rsusp+10|Tiramos ele de lá.|rsusp+20|Fracasso. Agora sabem de mais coisa.','Mudar todos os esconderijos|rsusp-5 membros-5|Perdemos gente, mas ficamos seguros.']],
  ['Herói do povo','Uma foto sua discursando no meio da multidão viralizou.',['Aproveitar|apoio+10 rsusp+10 f+4|Viramos símbolo.','Pedir que apaguem|rsusp-3|Tarde demais para alguns.']],
  ['Racha no movimento','Uma ala quer luta armada; outra quer protestos pacíficos.',['Ficar com a ala armada|armas+10 apoio-6|Mais força, menos simpatia.','Ficar com os pacíficos|apoio+8 armas-5|O povo gostou.','Tentar unir as duas|?sm apoio+4 armas+4|Funcionou por um tempo.|membros-20|Metade foi embora.']],
  ['Família preocupada','Sua família descobriu o que você anda fazendo e implora para você parar.',['Prometer parar|h-4|Menti para eles.','Explicar a causa|?50 h+4|Entenderam, e ficaram com medo.|h-8|Brigamos feio.']],
  ['Greve geral','Os sindicatos oferecem uma greve geral no dia do golpe.',['Aceitar|apoio+12 rsusp+6|O país vai parar quando a gente mandar.','Recusar|h+0|Prefiro surpresa.']],
  ['General arrependido','O general que você subornou quer desistir do acordo.',['Pagar mais|$-40000 mil+5|Ficou.','Ameaçar|?55 mil+5 k-5|Ele ficou, com medo.|mil-15 rsusp+15|Ele correu para o ministro.']],
]);
extTok=(o=>function(tok,d,out){ const r=S.me&&S.me.rev; const mm=tok.match(/^(apoio|mil|armas|rsusp|membros)([+-]\d+)$/); if(mm){ if(r){ r[mm[1]==='rsusp'?'susp':mm[1]]+=+mm[2]; revFix(r); } return true; } return o(tok,d,out); })(extTok);
