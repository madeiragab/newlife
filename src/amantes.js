// ===== Vários amores ao mesmo tempo: casar só com uma pessoa, mas trair com várias, e lidar com o que vem =====
const amores=()=>people('namoro','noivo','conjuge');
const casad=()=>people('conjuge')[0]||null;
// um casamento (e um noivado) por vez
interact=(o=>function(p,k,extra){ const m=S.me;
  if(k==='pedido'){ const c=casad(), n=people('noivo').find(x=>x!==p); if(c&&c!==p) return `Já sou casad${oa()} com ${c.first}. Para casar de novo, preciso me divorciar primeiro.`; if(n) return `Já estou noiv${oa()} de ${n.first}.`; }
  if(k==='casar'){ const c=casad(); if(c&&c!==p) return `Já sou casad${oa()} com ${c.first}. Bigamia é crime.`; }
  return o.apply(this,arguments); })(interact);
// todo ano, quem tem mais de um amor corre risco
yearMoney=(o=>function(){ const r=o.apply(this,arguments); const m=S.me; try{ if(m.alive&&!S.scen&&!m.prison){ const L=amores();
  if(L.length>=2&&!S.pending.some(e=>e.id==='amantes')&&R.chance(Math.min(.75,.28+.12*(L.length-2)))){
    const c=casad(), outros=L.filter(p=>p!==c), tipos=[['chantagem',3],['conta',3],['encontro',2],['ultimato',2]]; if(c) tipos.push(['descobre',3]);
    const t=R.wpick(tipos), quem=t==='descobre'?c:R.pick(outros.length?outros:L);
    queue('amantes',{t,pid:quem.id,v:Math.max(3000,Math.round(Math.max(0,m.money)*R.int(8,20)/100/100)*100)}); } } }catch(e){ console.error(e); } return r; })(yearMoney);
function amorSai(p,why){ if(!p||!p.alive) return; if(p.rel==='conjuge') divorce(p,true); else if(['namoro','noivo'].includes(p.rel)){ p.rel='ex'; p.bond=clamp(p.bond-20); log(`${p.first} terminou comigo${why?': '+why:''}.`,'bad'); } }
function amorContaTudo(dedo){ const m=S.me; const out=[]; amores().filter(p=>p!==dedo).forEach(p=>{ p.bond=clamp(p.bond-40); if(R.chance(.55)){ amorSai(p,'descobriu as outras pessoas'); out.push(`${p.first} foi embora`); } else out.push(`${p.first} ficou, mas não confia mais em mim`); }); st('happy',-15); m.karma=clamp(m.karma-6); cnt('traicoes'); return out.join('; ')+'.'; }
EVENTS.amantes={show:d=>{ const p=P(d.pid), m=S.me, L=amores(); const nomes=L.filter(x=>x!==p).map(x=>x.first).join(' e ');
    const X={chantagem:[`${p.first} descobriu que não é a única pessoa na minha vida. Quer ${fmt(d.v)} para ficar de boca fechada.`,[['Pagar','p'],['Recusar','r'],['Terminar com '+p.first+' antes que conte','t']]],
      conta:[`${p.first} descobriu tudo e ameaça contar para ${nomes||'todo mundo'}.`,[['Implorar para não contar','i'],['Contar eu mesm'+oa()+' antes','e'],['Escolher '+p.first+' e terminar com o resto','s']]],
      encontro:[`Marquei com ${p.first} no mesmo restaurante onde eu já estava com ${nomes||'outra pessoa'}. Os dois me viram ao mesmo tempo.`,[['Inventar que é um primo','m'],['Assumir tudo ali mesmo','a'],['Sair pela porta da cozinha','f']]],
      ultimato:[`${p.first} desconfia que existe mais alguém e deu um ultimato: "Ou só eu, ou ninguém."`,[['Ficar só com '+p.first,'s'],['Prometer e continuar escondendo','m'],['Terminar com '+p.first,'t']]],
      descobre:[`${p.first}, com quem sou casad${oa()}, achou as mensagens com ${nomes||'outra pessoa'}. Sabe de tudo.`,[['Pedir perdão e terminar com o resto','p'],['Negar até o fim','n'],['Pedir o divórcio','d']]]}[d.t];
    return {k:'Amor',t:{chantagem:'Chantagem',conta:'Vai contar tudo',encontro:'O restaurante',ultimato:'O ultimato',descobre:'Descobriu tudo'}[d.t],x:X[0],ch:X[1]}; },
  pick:(k,d)=>{ const p=P(d.pid), m=S.me; if(!p||!p.alive) return ''; const outros=()=>amores().filter(x=>x!==p);
    if(d.t==='chantagem'){ if(k==='p'){ m.money-=d.v; p.bond=clamp(p.bond-10); if(R.chance(.35)) queue('amantes',{t:'chantagem',pid:p.id,v:Math.round(d.v*1.5)}); return `Paguei ${fmt(d.v)}. ${p.first} prometeu silêncio. Prometeu.`; }
      if(k==='t'){ amorSai(p,'cansou de dividir'); if(R.chance(.5)) return 'Terminei, mas antes de sair, '+p.first+' contou para todo mundo: '+amorContaTudo(p); return `Terminei com ${p.first}, que foi embora sem dizer nada a ninguém.`; }
      return `${p.first} cumpriu a ameaça: ${amorContaTudo(p)}`; }
    if(d.t==='conta'){ if(k==='i'){ if(R.chance(.4)){ p.bond=clamp(p.bond-15); return `${p.first} não contou. Desta vez.`; } return `${p.first} contou: ${amorContaTudo(p)}`; }
      if(k==='e'){ const r=amorContaTudo(null); m.karma=clamp(m.karma+4); return 'Contei tudo eu mesm'+oa()+'. '+r; }
      outros().forEach(x=>amorSai(x,'terminei para ficar com outra pessoa')); p.bond=clamp(p.bond+10); return `Escolhi ${p.first}. Os outros relacionamentos acabaram de uma vez.`; }
    if(d.t==='encontro'){ if(k==='m'&&R.chance(.3)) return 'Acreditaram na história do primo. Não sei como.'; if(k==='f'){ p.bond=clamp(p.bond-20); outros().forEach(x=>x.bond=clamp(x.bond-20)); return 'Saí pela cozinha. Os dois ficaram na mesa, se olhando, e entenderam tudo.'; }
      return amorContaTudo(null); }
    if(d.t==='ultimato'){ if(k==='s'){ outros().forEach(x=>amorSai(x,'terminei para ficar com outra pessoa')); p.bond=clamp(p.bond+15); return `Fiquei só com ${p.first}.`; }
      if(k==='t'){ amorSai(p,'deu um ultimato e eu não aceitei'); return `Terminei com ${p.first}.`; }
      if(R.chance(.5)){ p.bond=clamp(p.bond-5); return 'Prometi. Continuo escondendo.'; } amorSai(p,'descobriu que eu menti de novo'); return `${p.first} descobriu a mentira e foi embora.`; }
    if(d.t==='descobre'){ if(k==='d'){ divorce(p,false); return 'Pedi o divórcio antes que pedissem.'; }
      if(k==='p'&&R.chance(p.bond/130)){ outros().forEach(x=>amorSai(x,'terminei para salvar meu casamento')); p.bond=clamp(p.bond-30); return `${p.first} me deu uma última chance. Terminei com todo mundo.`; }
      if(k==='n'&&R.chance(.15)){ p.bond=clamp(p.bond-20); return 'Neguei com uma convicção assustadora. Ficou a dúvida.'; }
      divorce(p,true); return `${p.first} não perdoou. O casamento acabou.`; }
    return ''; }};
