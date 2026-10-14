// ===== Paranormal: sede e fome, frenesi, ataques, herança no sangue e combate =====
// vampiro tem SEDE de sangue; lobisomem tem FOME de carne. A barra sobe todo ano; em 100, a criatura toma o controle.
const fomeNome=m=>m.criatura==='vampiro'?'Sede de sangue':'Fome de carne';
yearMoney=(o=>function(){ const r=o.apply(this,arguments); const m=S.me; try{ if(m.alive&&!S.scen&&m.criatura){
  m.fomeP=clamp((m.fomeP||20)+R.int(22,38)+(m.criatura==='lobisomem'&&R.chance(.4)?10:0));
  if(m.fomeP>=100&&!m.prison&&!S.pending.some(e=>e.id==='frenesi')) queue('frenesi',{});
  else if(m.fomeP>=75&&R.chance(.6)) log(m.criatura==='vampiro'?'A sede está ficando insuportável. Escuto o coração das pessoas na rua.':'A fome está me deixando agressiv'+oa()+'. Rosno sem perceber.','warn'); }
  // herança no sangue: filhos de quem é criatura podem nascer com a maldição
  if(m.alive&&m.criatura) kids().forEach(k=>{ if(k.genPara) return; k.genPara=1; if(k.age<=m.age-(m.criaturaIdade||m.age)&&R.chance(m.criatura==='vampiro'?.5:.6)){ k.criatura=m.criatura; } });
  if(m.alive&&!S.scen) kids().filter(k=>k.criatura&&k.alive).forEach(k=>{ k.fomeP=clamp((k.fomeP||10)+(k.age>=12?R.int(15,30):R.int(3,10)));
    if(k.age>=5&&!k.paraSinal){ k.paraSinal=1; queue('filho_sinal',{pid:k.id}); }
    else if(k.age>=12&&k.fomeP>=100&&!S.pending.some(e=>e.id==='filho_ataque')){ queue('filho_ataque',{pid:k.id}); } });
  }catch(e){ console.error(e); } return r; })(yearMoney);
// quando vira criatura, guarda a idade (para saber quais filhos nasceram depois)
virar=(o=>function(tipo,quem){ const m=S.me, was=m.criatura; const r=o.apply(this,arguments); if(!was&&m.criatura){ m.criaturaIdade=m.age; m.fomeP=30; } return r; })(virar);
function alimentar(modo){ const m=S.me; if(!m.criatura) return ''; if(use('alim_'+modo)>1) return 'Já fiz isso este ano. Chamaria atenção demais.';
  const vamp=m.criatura==='vampiro';
  if(modo==='compra'){ const c=vamp?2500:400; if(!canPay(c)) return `Custa ${fmt(c)}.`; m.money-=c; m.fomeP=clamp(m.fomeP-(vamp?55:35)); return vamp?'Comprei bolsas de sangue de um enfermeiro que não faz perguntas.':'Comprei dez quilos de carne crua no açougue. O açougueiro me olhou estranho.'; }
  if(modo==='animal'){ m.fomeP=clamp(m.fomeP-(vamp?30:55)); st('happy',-2); if(R.chance(.15)){ m.karma=clamp(m.karma-3); return vamp?'Ataquei uma vaca no pasto. O fazendeiro está procurando o "chupa-cabra".':'Ataquei as galinhas de um sítio. Saiu no jornal da cidade.'; } return vamp?'Cacei na mata. Sangue de animal acalma, mas não satisfaz.':'Corri pela floresta a noite toda e cacei um javali.'; }
  if(modo==='pessoa'){ m.fomeP=0; m.karma=clamp(m.karma-12); cnt('ataquesPara'); st('happy',3);
    if(R.chance(.2)){ cnt('kills'); if(R.chance(.35)) arrest('homicídio',8,20); return 'Perdi o controle. A pessoa não sobreviveu. A polícia fala num "animal selvagem".'; }
    if(R.chance(.15)) arrest('lesão corporal grave',1,4); return vamp?'Mordi um estranho num beco e fugi. Ele vai acordar sem lembrar de nada. Eu vou lembrar para sempre.':'Ataquei um homem numa trilha. Ele sobreviveu, assustado, contando de um "cachorro do tamanho de um urso".'; }
  return ''; }
// o frenesi: a criatura toma o controle
EVENTS.frenesi={show:()=>{ const m=S.me, vamp=m.criatura==='vampiro'; return {k:'Maldição',t:vamp?'Frenesi':'A fera solta',x:vamp?'A sede chegou ao limite. Não enxergo mais pessoas, só pescoços.':'A fome chegou ao limite. A fera não pede licença.',ch:[['Lutar contra o instinto','r'],['Atacar alguém na rua','s'],['Correr para longe de todos','f']]}; },
  pick:k=>{ const m=S.me; if(!m.criatura) return '';
    if(k==='r'&&R.chance(m.will/130)){ m.fomeP=85; st('happy',-8); st('health',-6); return 'Me tranquei no banheiro e mordi a própria mão até passar. Venci desta vez.'; }
    if(k==='f'&&R.chance(.55)){ m.fomeP=clamp(m.fomeP-50); return 'Corri até a mata e cacei o que encontrei. Ninguém se feriu.'; }
    if(k==='s') return alimentar('pessoa');
    // perdeu o controle: ataca alguém próximo
    const perto=S.people.filter(p=>p.alive&&p.rel!=='pet'&&p.rel!=='tmp'&&['conjuge','namoro','noivo','filho','mae','pai','irmao','amigo','colegaT'].includes(p.rel));
    if(!perto.length) return alimentar('pessoa');
    const v=R.pick(perto); m.fomeP=0; m.karma=clamp(m.karma-20); cnt('ataquesPara'); v.bond=clamp(v.bond-40);
    if(R.chance(.3)){ v.alive=false; v.cause=m.criatura==='vampiro'?'sem sangue, atacad'+(v.gender==='F'?'a':'o')+' por uma criatura':'atacad'+(v.gender==='F'?'a':'o')+' por uma fera'; cnt('kills'); st('happy',-30); log(`Perdi o controle e ${v.first} morreu nas minhas mãos.`,'bad'); if(R.chance(.4)) arrest('homicídio',10,25); return `Perdi o controle. Quando voltei a mim, ${v.first} estava no chão. Nunca vou me perdoar.`; }
    v.health=clamp(v.health-35); st('happy',-15); log(`Ataquei ${v.first} num momento de frenesi.`,'bad');
    if(v.rel==='conjuge'||v.rel==='namoro'||v.rel==='noivo'){ if(R.chance(.5)){ if(v.rel==='conjuge') divorce(v,true); else v.rel='ex'; return `Ataquei ${v.first}. Sobreviveu, mas foi embora com medo de mim.`; } }
    return `Ataquei ${v.first}. Sobreviveu, e agora me olha com medo.`; }};
// filhos com a maldição
EVENTS.filho_sinal={show:d=>{ const k=P(d.pid), vamp=k.criatura==='vampiro'; return {k:'Maldição',t:vamp?'Dentes afiados':'Olhos amarelos',x:vamp?`${k.first} mordeu um coleguinha na escola e tirou sangue. Os dentes de leite são pontudos demais.`:`${k.first} rosnou para o cachorro da vizinha e o cachorro fugiu. À noite, os olhos brilham amarelos.`,ch:[['Contar a verdade a '+k.first,'v'],['Esconder e torcer para passar','e'],['Procurar a bruxa da cura','c']]}; },
  pick:(key,d)=>{ const k=P(d.pid), m=S.me; if(!k) return '';
    if(key==='v'){ k.bond=clamp(k.bond+8); k.paraCtrl=(k.paraCtrl||0)+30; return `Expliquei tudo para ${k.first}. Prometemos aprender a controlar juntos.`; }
    if(key==='c'){ if(!canPay(20000)) return 'A bruxa cobra $20.000. Não tenho.'; m.money-=20000; if(R.chance(.25)){ k.criatura=null; return `O ritual funcionou. ${k.first} é uma criança comum de novo.`; } return 'O ritual não funcionou. A bruxa ficou com o dinheiro.'; }
    return 'Fingi que era fase. Não era.'; }};
EVENTS.filho_ataque={show:d=>{ const k=P(d.pid); return {k:'Maldição',t:'A fera dentro de casa',x:`${k.first} perdeu o controle durante a noite. Os gritos acordaram a casa inteira.`,ch:[['Enfrentar '+k.first+' para proteger os outros','l'],['Trancar '+k.first+' no porão','t'],['Levar '+k.first+' para a mata','m']]}; },
  pick:(key,d)=>{ const k=P(d.pid), m=S.me; if(!k) return ''; k.fomeP=20;
    const alvo=R.pick(S.people.filter(p=>p.alive&&p!==k&&['conjuge','filho','irmao','mae','pai','amigo'].includes(p.rel)));
    if(key==='l'){ const forca=(m.criatura?40:0)+(m.fight||0); if(R.chance(.3+forca/200)){ k.bond=clamp(k.bond-5); return `Segurei ${k.first} até a fera passar. Ninguém se feriu.`; } st('health',-R.int(15,30)); if(m.health<=0) die('atacad'+oa()+' pelo próprio filho, numa noite de maldição'); return `${k.first} me atacou antes de voltar a si. Os arranhões vão virar cicatriz.`; }
    if(key==='t'){ if(R.chance(.7+(k.paraCtrl||0)/200)) return `Passei a noite ouvindo ${k.first} uivar atrás da porta. De manhã, só pedia desculpas.`; }
    if(key==='m'){ if(R.chance(.6)){ return `Corremos juntos pela mata até a fome de ${k.first} passar. Um animal pagou o preço.`; } }
    if(alvo){ if(R.chance(.25)){ alvo.alive=false; alvo.cause='atacad'+(alvo.gender==='F'?'a':'o')+' por uma criatura dentro de casa'; st('happy',-30); log(`${k.first} perdeu o controle e matou ${alvo.first}.`,'bad'); return `${k.first} escapou e atacou ${alvo.first}. Não deu tempo de salvar.`; }
      alvo.health=clamp(alvo.health-30); alvo.bond=clamp(alvo.bond-10); return `${k.first} escapou e feriu ${alvo.first}. Vai sobreviver, mas a família nunca mais foi a mesma.`; }
    return `${k.first} fugiu e só voltou de manhã, coberto de lama.`; }};
// a barra na tela principal e as opções no menu paranormal
render=(o=>function(){ const r=o.apply(this,arguments); try{ const m=S&&S.me; if(m&&m.criatura&&!S.scen){ const v=m.fomeP||0, el=$('#stats');
  if(el&&!el.querySelector('.st-fome')) el.insertAdjacentHTML('beforeend',`<div class="st st-fome"><span class="se">${m.criatura==='vampiro'?'🩸':'🍖'}</span><b>${fomeNome(m)}</b><div class="bar"><i style="width:${v}%;background:${v>=75?'var(--bad)':'#9C27B0'}"></i></div><span>${v}%</span></div>`); } }catch(e){} return r; })(render);
V.paranormal=(o=>()=>{ const r=o(), m=S.me; if(!m.criatura) return r; const vamp=m.criatura==='vampiro';
  r.items.splice(1,0,{html:`<div class="card">${bar(fomeNome(m),m.fomeP||0)}<p style="color:var(--muted);font-size:13px">Sobe todo ano. Em 100%, a criatura toma o controle e alguém pode se machucar, até da sua família.</p></div>`},{sec:vamp?'Saciar a sede':'Saciar a fome'},
    {ic:vamp?'🩸':'🥩',l:vamp?'Comprar sangue no mercado negro':'Comprar carne crua',s:fmt(vamp?2500:400),on:()=>act(()=>alimentar('compra'),'Alimentar')},
    {ic:'🦌',l:'Caçar animais',s:'Ajuda pouco · ninguém se machuca',on:()=>act(()=>alimentar('animal'),'Caça')},
    {ic:'🌑',l:'Atacar uma pessoa',s:'Sacia tudo · carma, prisão e culpa',tone:'bad',on:()=>act(()=>alimentar('pessoa'),'Ataque')});
  return r; })(V.paranormal);
// combate: a criatura briga diferente
startFight=(o=>function(adv,ctx){ const r=o.apply(this,arguments); const m=S.me; if(m.criatura&&FIGHT){ FIGHT.me+=m.criatura==='lobisomem'?45:30; FIGHT.cri=m.criatura; } return r; })(startFight);
const CRI_MOVES={vampiro:[{id:'mordida',n:'Mordida',d:'presas no pescoço · sacia a sede',pow:24,acc:.72,kill:.06,cri:1},{id:'veloz',n:'Velocidade sobrenatural',d:'golpes rápidos demais para ver',pow:16,acc:.93,cri:1}],
  lobisomem:[{id:'garras',n:'Garras',d:'rasgam qualquer coisa',pow:27,acc:.68,kill:.07,cri:1},{id:'uivo',n:'Uivo',d:'paralisa de medo',pow:8,acc:.97,cri:1}]};
fightView=(o=>function(){ const r=o.apply(this,arguments); const F=FIGHT, m=S.me; if(F&&!F.done&&m.criatura&&r&&r.items){ const i=r.items.findIndex(x=>x.sec==='Golpes');
  if(i>=0) r.items.splice(i+1,0,...CRI_MOVES[m.criatura].map(mv=>({ic:m.criatura==='vampiro'?'🧛':'🐺',l:mv.n+' (criatura)',s:mv.d+(mv.kill>=.05?' · pode matar':''),tone:'bad',on:()=>{ if(mv.id==='mordida') m.fomeP=clamp((m.fomeP||0)-30); if(mv.id==='garras') m.fomeP=clamp((m.fomeP||0)-20); fightTurn(Object.assign({},mv,{pow:mv.pow*(1+(m.fight||0)/200)})); UI.refresh(); }}))); }
  return r; })(fightView);
