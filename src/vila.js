// ===== Isekai: a sua vila, que cresce de acampamento a grande cidade =====
// Moradores comem, se vestem e gastam mantimentos todo dia. Construções produzem; tecnologias melhoram tudo.
// Você decide o nome, os impostos, a ração, quem pode morar lá e se moradores podem entrar no seu grupo.
const VILA_TIERS=[['Acampamento','⛺',0,0],['Aldeia','🛖',10,1],['Vila','🏘️',25,3],['Cidade','🏙️',60,6],['Grande cidade','🏰',150,10]]; // nome, ícone, moradores, tecnologias
const VILA_B={ // nome, ícone, custo base, efeito, nível da vila exigido
  casa:['Casas','🏠',60,'+6 vagas de moradores',0],fazenda:['Fazenda','🌾',80,'+8 de comida por dia',0],tecelagem:['Tecelagem','🧵',90,'+3 de roupas por dia',0],
  serraria:['Serraria e oficina','🪚',90,'+3 de mantimentos por dia',0],mercado:['Mercado','🏪',140,'+12 de ouro por dia',1],taverna:['Taverna','🍺',110,'Felicidade e +5 de ouro por dia',1],
  muralha:['Muralha','🧱',130,'+15 de defesa',1],templo:['Templo','⛪',150,'Felicidade e cura',1],escola:['Escola','📚',160,'+3 de pesquisa por dia',1],
  quartel:['Quartel','🛡️',170,'+10 de defesa',2],ferraria:['Ferraria','⚒️',150,'+3 de força de combate e +2 de mantimentos',2],hospital:['Hospital','🏥',200,'Evita pestes',2],
  torre:['Torre de magia','🗼',220,'+8 de mana e +2 de pesquisa, ensina magias',2],guilda:['Filial da guilda','📜',240,'+15 de XP por dia e recrutas',3],
  porto:['Porto de caravanas','⚓',300,'+25 de ouro por dia',3],universidade:['Universidade','🎓',400,'+8 de pesquisa por dia',4]};
const TECH={ // nome, ícone, custo em pesquisa, efeito, pré-requisito
  agricultura:['Agricultura','🌱',20,'+30% de comida',null],tear:['Tear','🧶',25,'+50% de roupas',null],ferramentas:['Ferramentas','🔨',25,'+50% de mantimentos',null],
  escrita:['Escrita','✍️',30,'+1 de pesquisa por dia',null],moeda:['Moeda','🪙',40,'+20% de ouro','escrita'],irrigacao:['Irrigação','💧',50,'+30% de comida','agricultura'],
  metalurgia:['Metalurgia','⚙️',60,'+10 de defesa','ferramentas'],medicina:['Medicina','💊',70,'Menos pestes e mais felicidade','escrita'],engenharia:['Engenharia','📐',90,'+3 vagas por nível de Casas','metalurgia'],
  aqueduto:['Aqueduto','🏛️',110,'Mais felicidade todo dia','engenharia'],comercio:['Rotas de comércio','🐫',110,'+30% de ouro','moeda'],imprensa:['Imprensa','📰',140,'+30% de pesquisa','escrita'],
  saneamento:['Saneamento','🚰',150,'Acaba com as pestes','medicina'],magia:['Magia aplicada','✨',160,'+20% de toda a produção','imprensa'],polvora:['Pólvora alquímica','💥',200,'+25 de defesa','metalurgia'],
  vapor:['Máquina a vapor','🚂',260,'+50% de roupas e mantimentos','engenharia']};
const IMIG=['Aberta a todos','Com seleção','Fechada'], RACAO=['Pouca','Normal','Farta'], IMP=['Baixos','Normais','Altos'];
const vHas=(v,t)=>v.tech.includes(t);
function vilaFix(v){ v.b=Object.assign(Object.fromEntries(Object.keys(VILA_B).map(k=>[k,0])),v.b||{}); v.tech=v.tech||[]; v.rou=v.rou??20; v.man=v.man??20; v.pq=v.pq||0; v.imig=v.imig??0; v.racao=v.racao??1; v.imp=v.imp??1; v.tier=v.tier||0; v.grupo=v.grupo??1; v.hist=v.hist||[]; return v; }
const vilaTier=v=>VILA_TIERS[v.tier];
function vilaCap(v){ return 6+v.b.casa*(6+(vHas(v,'engenharia')?3:0)); }
function vilaDef(v){ return 5+v.b.muralha*15+v.b.quartel*10+(vHas(v,'metalurgia')?10:0)+(vHas(v,'polvora')?25:0)+(v.mil||0)+(v.extraDef||0); }
function vilaWork(v){ const n=Object.values(v.b).reduce((s,x)=>s+x,0); return Math.max(.35,Math.min(1.2,v.pop/Math.max(4,n*2))); }
function vilaProd(v){ const w=vilaWork(v), mg=vHas(v,'magia')?1.2:1;
  return {com:Math.round((2+v.b.fazenda*8*(1+(vHas(v,'agricultura')?.3:0)+(vHas(v,'irrigacao')?.3:0)))*w*mg),
    rou:Math.round(v.b.tecelagem*3*(vHas(v,'tear')?1.5:1)*(vHas(v,'vapor')?1.5:1)*w*mg),
    man:Math.round((v.b.serraria*3+v.b.ferraria*2)*(vHas(v,'ferramentas')?1.5:1)*(vHas(v,'vapor')?1.5:1)*w*mg),
    ouro:Math.round((v.pop*1.5+v.b.mercado*12+v.b.taverna*5+v.b.porto*25)*[.5,1,1.6][v.imp]*(1+(vHas(v,'moeda')?.2:0)+(vHas(v,'comercio')?.3:0))*mg),
    pq:Math.round((1+(vHas(v,'escrita')?1:0)+v.b.escola*3+v.b.torre*2+v.b.universidade*8+Math.floor(v.pop/15))*(vHas(v,'imprensa')?1.3:1))}; }
function vilaUse(v){ return {com:Math.ceil(v.pop*[.7,1,1.3][v.racao]),rou:Math.ceil(v.pop*.15),man:Math.ceil(v.pop*.2)}; }
const vilaRenda=v=>vilaProd(v).ouro;
function vilaFound(nome){ const sc=S.scen; sc.ouro-=250; sc.vila=vilaFix({nome,dia:sc.dia,pop:4,com:40,fel:65,mil:0,b:{casa:1}}); scLog(`Fundei ${nome}! Um acampamento com quatro moradores, uma casa e muitos sonhos.`,'good'); cnt('vila'); }
function vilaNext(v){ for(let i=VILA_TIERS.length-1;i>v.tier;i--){ const t=VILA_TIERS[i]; if(v.pop>=t[2]&&v.tech.length>=t[3]) return i; } return v.tier; }
function vilaDay(sc){ const v=sc.vila; if(!v) return; vilaFix(v); const p=vilaProd(v), u=vilaUse(v);
  v.com+=p.com-u.com; v.rou+=p.rou-u.rou; v.man+=p.man-u.man; sc.ouro+=p.ouro;
  let fel=[2,0,-3][v.imp]+[-3,0,2][v.racao]+(v.b.taverna?1:0)+(v.b.templo?1:0)+(vHas(v,'aqueduto')?2:0)+(vHas(v,'medicina')?1:0)-(v.pop>vilaCap(v)?3:0);
  if(v.com<0){ v.com=0; fel-=8; if(v.pop>1&&R.chance(.5)){ v.pop--; scLog(`Faltou comida em ${v.nome}. Uma família foi embora.`,'bad'); } }
  if(v.rou<0){ v.rou=0; fel-=4; if(R.chance(.2)) scLog(`Os moradores de ${v.nome} andam de roupa remendada e reclamam do frio.`,'warn'); }
  if(v.man<0){ v.man=0; fel-=4; if(R.chance(.2)) scLog(`Faltam ferramentas, lenha e sabão em ${v.nome}.`,'warn'); }
  v.fel=Math.max(0,Math.min(100,v.fel+fel));
  if(v.pq>=0){ v.pqT=(v.pqT||0)+p.pq; if(v.res&&TECH[v.res]&&v.pqT>=TECH[v.res][2]){ v.pqT-=TECH[v.res][2]; v.tech.push(v.res); scLog(`${v.nome} descobriu ${TECH[v.res][1]} ${TECH[v.res][0]}: ${TECH[v.res][3].toLowerCase()}.`,'good'); v.res=null; } }
  const room=v.pop<vilaCap(v)&&v.com>0;
  if(room&&v.fel>=40){ const ch=[.75,.45,.12][v.imig]; if(R.chance(ch)) v.pop+=v.imig===0?rnd(1,3):1; }
  if(v.fel<20&&v.pop>1&&R.chance(.4)){ v.pop--; scLog(`Um morador de ${v.nome} se mudou reclamando de tudo.`,'warn'); }
  if(R.chance(.03-(v.b.hospital?.015:0)-(vHas(v,'medicina')?.008:0))&&!vHas(v,'saneamento')&&v.pop>6){ const n=Math.min(v.pop-2,rnd(1,3)); v.pop-=n; v.fel=Math.max(0,v.fel-12); scLog(`Uma peste passou por ${v.nome}. Perdemos ${n} morador(es).`,'bad'); }
  v.mil=Math.max(0,(v.mil||0)-1); v.extraDef=Math.max(0,(v.extraDef||0)-2);
  if(v.b.torre) scStat('mana',v.b.torre*8); if(v.b.guilda) scStat('xp',v.b.guilda*15); if(v.b.templo) scStat('hl',v.b.templo*2);
  if(R.chance(.07+sc.rota*.012)){ const atk=rnd(10,35)+sc.rota*9+v.tier*8, d=vilaDef(v); const who=R.pick(['Goblins','Bandidos','Lobos gigantes','Orcs','Um ogro bêbado','Cultistas do Rei Demônio']);
    if(d>=atk){ v.fel=Math.min(100,v.fel+5); scLog(`${who} atacaram ${v.nome}. A defesa segurou e os moradores comemoraram.`,'good'); }
    else { const lost=Math.min(v.pop-1,rnd(1,3)); v.pop-=lost; v.com=Math.max(0,v.com-20); v.fel=Math.max(0,v.fel-15); const ks=Object.keys(v.b).filter(k=>v.b[k]>0&&k!=='casa'); if(ks.length&&R.chance(.4)){ const k=R.pick(ks); v.b[k]--; scLog(`${VILA_B[k][0]} foi danificada no ataque.`,'bad'); } scLog(`${who} invadiram ${v.nome}. ${lost?`Perdemos ${lost} morador(es).`:'Saquearam o celeiro.'}`,'bad'); } }
  const nt=vilaNext(v); if(nt>v.tier){ v.tier=nt; v.fel=Math.min(100,v.fel+10); scLog(`${vilaTier(v)[1]} ${v.nome} agora é uma ${vilaTier(v)[0].toLowerCase()}!`,'good'); queue('vila_tier',{}); } }
// ---------- linguagem dos eventos: vcom vrou vman vpq vfel vpop vdef (+n/-n), vtech (descobre algo) ----------
scTok=(o=>function(tok,d,out){ const sc=S.scen; let mm; if(sc&&sc.id==='isekai'&&(mm=tok.match(/^v(com|rou|man|pq|fel|pop|def)([+-]\d+)$/))){ const v=sc.vila; if(v){ vilaFix(v); const n=+mm[2], k=mm[1];
    if(k==='fel') v.fel=Math.max(0,Math.min(100,v.fel+n)); else if(k==='pop') v.pop=Math.max(1,v.pop+n); else if(k==='def') v.mil=Math.max(0,(v.mil||0)+n); else if(k==='pq') v.pqT=Math.max(0,(v.pqT||0)+n); else v[k]=Math.max(0,v[k]+n); } return true; }
  if(sc&&sc.id==='isekai'&&tok==='vtech'){ const v=sc.vila; if(v){ const can=Object.keys(TECH).filter(t=>!vHas(v,t)&&(!TECH[t][4]||vHas(v,TECH[t][4]))); if(can.length){ const t=R.pick(can); v.tech.push(t); out.push(`Descobrimos ${TECH[t][0]}!`); } } return true; }
  return o(tok,d,out); })(scTok);
scChance=(o=>function(key){ const sc=S.scen; if(sc&&sc.id==='isekai'&&sc.vila){ const v=sc.vila; if(key==='vfel') return v.fel; if(key==='vdef') return Math.min(95,vilaDef(v)); if(key==='vtier') return 20+v.tier*18; } return o(key); })(scChance);
scVar=(o=>function(k){ const sc=S.scen; if(sc&&sc.id==='isekai'&&sc.vila){ if(k==='vila') return sc.vila.nome; if(k==='tipo') return vilaTier(vilaFix(sc.vila))[0].toLowerCase(); } return o(k); })(scVar);
EVENTS.vila_tier={scen:'isekai',show:()=>{ const v=S.scen.vila; return {k:'Minha vila',t:`${v.nome} cresceu!`,x:`${v.nome} agora é uma ${vilaTier(v)[0].toLowerCase()}. Os moradores querem comemorar e esperam um discurso seu.`,ch:[['Fazer um discurso emocionado','d'],['Dar um feriado para todos','f'],['Voltar ao trabalho','t']]}; },
  pick:k=>{ const v=S.scen&&S.scen.vila; if(!v) return ''; if(k==='d'){ v.fel=Math.min(100,v.fel+8); return 'Falei de quando éramos quatro em volta de uma fogueira. Metade da vila chorou.'; } if(k==='f'){ v.fel=Math.min(100,v.fel+15); v.com=Math.max(0,v.com-15); return 'Um dia inteiro de festa. Ninguém trabalhou, todo mundo comeu.'; } S.scen.ouro+=50; return 'Mandei todo mundo de volta ao trabalho. O cofre agradeceu; os moradores, nem tanto.'; }};
// ---------- tela da vila ----------
function vilaNamePrompt(title,cb){ const ns=R.shuffle(['Nova Aurora','Pedra Clara','Vale do Sol Duplo','Recanto dos Heróis','Porto Brisa','Colina Dourada','Bosque Sereno','Ninho do Grifo']).slice(0,1)[0];
  modal({t:title,x:'Digite o nome:',html:`<input id="vnome" maxlength="28" value="${esc(ns)}" style="width:100%;margin-top:8px;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font:inherit">`,
    ch:[{l:'Confirmar',fn:()=>{ const el=document.getElementById('vnome'); const n=(el&&el.value||'').trim().replace(/\s+/g,' ').slice(0,28)||ns; cb(n); }},{l:'Cancelar',cls:'alt'}]});
  setTimeout(()=>{ const el=document.getElementById('vnome'); if(el){ el.focus(); el.select(); } },60); }
V.iskVila=()=>{ const sc=S.scen; iskEnsure(sc); const v=sc.vila, it=[];
  if(!v){ it.push({html:'<div class="card"><p>Um nobre falido vende terras férteis perto da estrada. Com 250 moedas e nível 4, dá para fundar sua própria vila. Ela começa como um acampamento e pode virar uma grande cidade, se os moradores tiverem comida, roupas, mantimentos e um bom governante.</p></div>'});
    it.push({ic:'🏘️',l:'Fundar minha vila',s:'250 moedas · nível 4',dis:sc.ouro<250||sc.lvl<4,why:sc.lvl<4?'Preciso chegar ao nível 4.':'Preciso de 250 moedas.',on:()=>vilaNamePrompt('Nome da sua vila',n=>{ vilaFound(n); MQ.unshift({t:'Vila fundada',x:`${n} existe! Construa casas, uma fazenda, uma tecelagem e uma serraria.`}); })});
    return {title:'Minha vila',items:it}; }
  vilaFix(v); const p=vilaProd(v), u=vilaUse(v), tr=vilaTier(v), nx=VILA_TIERS[v.tier+1], sg=n=>(n>=0?'+':'')+n;
  it.push({html:`<div class="card"><p><b>${tr[1]} ${esc(v.nome)}</b> · ${tr[0]}</p>${kv('Moradores',`${v.pop} de ${vilaCap(v)}`)}${bar('Felicidade',Math.round(v.fel))}${kv('🍞 Comida',`${v.com} (${sg(p.com-u.com)}/dia)`)}${kv('👕 Roupas',`${v.rou} (${sg(p.rou-u.rou)}/dia)`)}${kv('🧰 Mantimentos',`${v.man} (${sg(p.man-u.man)}/dia)`)}${kv('💰 Ouro por dia',p.ouro)}${kv('🛡️ Defesa',vilaDef(v))}${kv('🔬 Pesquisa',`${p.pq}/dia`)}${nx?`<p style="color:var(--muted);font-size:12.5px">Para virar ${nx[0].toLowerCase()}: ${nx[2]} moradores e ${nx[3]} tecnologias (tem ${v.tech.length}).</p>`:''}</div>`});
  const once=k=>!!sc.done['v_'+k];
  it.push({sec:'Leis e governo'});
  it.push({ic:'⚖️',l:`Impostos: ${IMP[v.imp].toLowerCase()}`,s:'Mais ouro ou mais felicidade · toque para mudar',on:()=>{ v.imp=(v.imp+1)%3; UI.refresh(); }});
  it.push({ic:'🍲',l:`Ração por morador: ${RACAO[v.racao].toLowerCase()}`,s:'Farta deixa feliz, mas gasta mais comida · toque para mudar',on:()=>{ v.racao=(v.racao+1)%3; UI.refresh(); }});
  it.push({ic:'🚪',l:`Novos moradores: ${IMIG[v.imig].toLowerCase()}`,s:['Cresce rápido, entra qualquer um','Cresce devagar, só gente de confiança','Só crescem as famílias que já moram aqui'][v.imig]+' · toque para mudar',on:()=>{ v.imig=(v.imig+1)%3; UI.refresh(); }});
  it.push({ic:'🧝',l:`Moradores no meu grupo: ${v.grupo?'permitido':'proibido'}`,s:'Se permitido, voluntários da vila podem virar companheiros · toque para mudar',on:()=>{ v.grupo=v.grupo?0:1; UI.refresh(); }});
  it.push({ic:'✏️',l:'Renomear a vila',s:v.nome,on:()=>vilaNamePrompt('Novo nome da vila',n=>{ const o=v.nome; v.nome=n; scLog(`${o} agora se chama ${n}.`); })});
  it.push({sec:'Ações'});
  it.push({ic:'🎉',l:'Fazer um festival',s:'80 moedas · felicidade',dis:once('fest')||sc.ouro<80,why:once('fest')?'Já teve festival hoje.':'Preciso de 80 moedas.',on:()=>scAct(()=>{ sc.done.v_fest=1; sc.ouro-=80; v.fel=Math.min(100,v.fel+18); return R.pick(['Teve dança, torta e um bardo que só sabia três músicas. Todo mundo amou.','Fizemos um torneio de cabo de guerra. O ferreiro ganhou sozinho.','Fogos de artifício mágicos assustaram as galinhas e encantaram as crianças.']); },v.nome)});
  it.push({ic:'🛒',l:'Comprar suprimentos para a vila',s:'60 moedas · +20 comida, +8 roupas, +8 mantimentos',dis:once('comp')||sc.ouro<60,why:once('comp')?'A caravana só vem uma vez por dia.':'Preciso de 60 moedas.',on:()=>scAct(()=>{ sc.done.v_comp=1; sc.ouro-=60; v.com+=20; v.rou+=8; v.man+=8; return 'Uma caravana deixou sacos de grãos, fardos de lã e caixas de ferramentas.'; },v.nome)});
  it.push({ic:'🗡️',l:'Treinar a milícia',s:'40 moedas · defesa por uns dias',dis:once('mil')||sc.ouro<40,why:once('mil')?'Já treinamos hoje.':'Preciso de 40 moedas.',on:()=>scAct(()=>{ sc.done.v_mil=1; sc.ouro-=40; v.mil=(v.mil||0)+12; return 'Ensinei os moradores a segurar uma lança sem furar o próprio pé. Quase todos conseguiram.'; },v.nome)});
  it.push({ic:'🍞',l:'Doar comida da mochila',s:'Até 3 porções',dis:once('com')||!sc.inv.some(x=>itCat(x.id)==='comida'),why:once('com')?'Já doei hoje.':'Não tenho comida.',on:()=>scAct(()=>{ sc.done.v_com=1; let n=0; while(n<3){ const f=takeItem('@comida'); if(!f) break; v.com+=itV(f.id); n++; } v.fel=Math.min(100,v.fel+3); return `Doei ${n} porção(ões) para o celeiro de ${v.nome}.`; },v.nome)});
  it.push({ic:'🗣️',l:'Ouvir os moradores',s:'Felicidade · pode virar um pedido',dis:once('ouvir'),why:'Já ouvi todo mundo hoje.',on:()=>scAct(()=>{ sc.done.v_ouvir=1; v.fel=Math.min(100,v.fel+5); scEvents(1); return R.pick(['Ouvi reclamações sobre galinhas, cercas e um vizinho que canta de madrugada.','Uma criança me pediu para ser cavaleira quando crescer. Prometi treinar.','O ancião da vila me contou lendas sobre o Rei Demônio.']); },v.nome)});
  if(v.grupo) it.push({ic:'🙋',l:'Chamar voluntários para o grupo',s:'Um morador vira companheiro · a vila perde um morador',dis:once('vol')||v.pop<6||crew().length>=6,why:once('vol')?'Já chamei hoje.':v.pop<6?'A vila é pequena demais para ceder gente.':'Meu grupo está cheio.',on:()=>scAct(()=>{ sc.done.v_vol=1; v.pop--; const c=mkCrew(); return `${c.first}, ${c.race}, largou a enxada e pegou uma espada. Agora viaja comigo.`; },v.nome)});
  it.push({sec:`Tecnologia · ${v.tech.length} de ${Object.keys(TECH).length}`});
  if(v.res) it.push({html:`<div class="card">${bar(`Pesquisando ${TECH[v.res][0]}`,Math.min(100,Math.round((v.pqT||0)/TECH[v.res][2]*100)))}</div>`});
  Object.entries(TECH).forEach(([k,[n,ic,c,d,pre]])=>{ const has=vHas(v,k), ok=!pre||vHas(v,pre);
    if(has) return; it.push({ic:ok?ic:'🔒',l:n,s:`${d} · ${c} de pesquisa${pre&&!ok?' · precisa de '+TECH[pre][0]:''}`,r:v.res===k?'🔬':'',dis:!ok||v.res===k,why:!ok?`Primeiro descubra ${TECH[pre][0]}.`:'Já estamos pesquisando isso.',on:()=>{ v.res=k; scLog(`${v.nome} começou a pesquisar ${n}.`); UI.refresh(); }}); });
  if(v.tech.length) it.push({html:`<div class="card"><p style="color:var(--muted);font-size:12.5px">Já descobrimos: ${v.tech.map(t=>TECH[t][1]+' '+TECH[t][0]).join(', ')}.</p></div>`});
  it.push({sec:'Construções'});
  Object.entries(VILA_B).forEach(([k,[n,ic,base,d,tmin]])=>{ const l=v.b[k], c=base*(l+1), max=Math.min(6,v.tier+2), lockT=v.tier<tmin;
    it.push({ic:lockT?'🔒':ic,l:`${n}${l?' · nível '+l:''}`,s:lockT?`Precisa que a vila seja ${VILA_TIERS[tmin][0].toLowerCase()}`:l>=max?`${d} · máximo para ${tr[0].toLowerCase()}`:`${d} · ${l?'melhorar':'construir'}: ${c} moedas e ${5+l*3} mantimentos`,r:l>=max&&!lockT?'★':'',
      dis:lockT||l>=max||sc.ouro<c||v.man<5+l*3||once('b_'+k),why:lockT?`Só quando ${v.nome} virar ${VILA_TIERS[tmin][0].toLowerCase()}.`:l>=max?'A vila precisa crescer para isso subir mais.':once('b_'+k)?'Os construtores precisam de um dia.':`Preciso de ${c} moedas e ${5+l*3} mantimentos.`,
      on:()=>scAct(()=>{ sc.done['v_b_'+k]=1; sc.ouro-=c; v.man-=5+l*3; v.b[k]++; v.fel=Math.min(100,v.fel+3); let t=`${ic} ${n} ${l?'melhorada para o nível '+v.b[k]:'construída'} em ${v.nome}!`; if(k==='torre'){ const s=learnSpell(sc,true); if(s) t+=' '+s; } if(k==='guilda'&&v.grupo&&crew().length<6&&R.chance(.6)){ const c2=mkCrew(); t+=` ${c2.first}, ${c2.race}, se alistou no meu grupo.`; } return t; },n)}); });
  return {title:v.nome,items:it}; };
