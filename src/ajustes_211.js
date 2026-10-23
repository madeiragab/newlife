// ===== 2.11: confirmação também para matar, assaltar e as outras ações que não têm volta =====
// A 2.09 confirmava as ações críticas das telas V.*; as telas abertas lá de dentro (alvos do assassino,
// detentos da prisão) passavam direto. Agora toda tela aberta com UI.push passa pelo mesmo filtro.

CRITICAS.push(
  [/^Emboscada com estilete$/,'Matar este detento?','Se descobrirem, a pena aumenta muito. Não tem volta.'],
  [/^Encomendar um assalto$/,'Encomendar um assalto?','Se a polícia pegar o bando, a corda arrebenta do meu lado.'],
  [/^Assaltar (um banco|uma joalheria)$/,'Assaltar?','Se der errado, são anos de cadeia.'],
  [/^Roubar um carro$/,'Roubar um carro?','Se for pego, vou a julgamento.'],
  [/^Invadir uma casa$/,'Invadir uma casa?','Se for pego, vou a julgamento.'],
  [/^Sacrificar$/,'Sacrificar o animal?','Não tem volta.'],
  [/^Atacar uma pessoa$/,'Atacar uma pessoa?','Carma, prisão e culpa. Não tem volta.'],
  [/^Usar o poder para roubar$/,'Usar o poder para roubar?','Um herói que rouba deixa de ser herói.'],
  [/^Roubar o acampamento deles$/,'Roubar o acampamento?','Eles vão querer vingança.'],
  [/^Atacar o acampamento$/,'Atacar o acampamento?','Pode morrer gente dos dois lados.'],
);
// telas em que todo item é uma decisão sem volta (o nome do item é o nome de uma pessoa)
const CRITICAS_TELA={'Quem?':it=>['Contratar o assassino?',`Encomendar a morte de ${it.l}? Não tem volta.`]};
comConfirmacao=(o=>function(r){ r=o.apply(this,arguments); const f=r&&CRITICAS_TELA[r.title]; if(f&&Array.isArray(r.items)) for(const it of r.items){
  if(!it||!it.on||it.confirmado) continue; const [t,x]=f(it), on=it.on; it.confirmado=1; it.on=()=>confirmBox(t,x,'Confirmar',on); } return r; })(comConfirmacao);
UI.push=(o=>function(v){ return o.call(this,typeof v==='function'?function(){ return comConfirmacao(v.apply(this,arguments)); }:v); })(UI.push);

// ---------- salário de quem deu o golpe ----------
// Começa no dobro do salário de presidente. Dá para subir até 20x, mas quanto maior o salário (e os saques),
// maior a chance de a imprensa estrangeira e o tribunal internacional investigarem as contas.
const SAL_MULTS=[1,2,5,10,20];
const salPres=()=>OFFICES.find(o=>o.id==='pres').sal;
const salMult=r=>r.salMult||2;
function riscoInvestigacao(r){ return Math.min(.6,(salMult(r)-1)*.03+(r.saques||0)*.04); }
regAcao=(o=>function(k){ const r=regime(), t=o.apply(this,arguments); if(r&&k==='saquear'&&/^Transferi/.test(t)) r.saques=(r.saques||0)+1; return t; })(regAcao);
function regSalario(){ const r=regime(); if(!r) return;
  modal({t:'💰 Meu salário',x:`O salário de presidente é ${fmt(salPres())} por ano. Quem tomou o poder decide o próprio. Quanto maior, maior a chance de investigarem as minhas contas.\n\nChance de investigação hoje: ${Math.round(riscoInvestigacao(r)*100)}% ao ano.`,
    ch:SAL_MULTS.map(x=>({l:`${x===salMult(r)?'✓ ':''}${fmt(salPres()*x)}/ano${x===1?' · igual ao presidente':x===2?' · o dobro':` · ${x}x`}`,fn:()=>{ r.salMult=x; log(`Defini meu salário em ${fmt(salPres()*x)} por ano.`,x>=10?'warn':''); after(); }})).concat([{l:'Cancelar',cls:'alt'}])}); }
yearMoney=(o=>function(){ const x=o.apply(this,arguments); try{ const m=S.me, r=regime(); if(r&&m.alive&&!m.prison){
  const extra=Math.round(salPres()*(salMult(r)-1)*diff().$); if(extra>0){ m.money+=extra; if(typeof origemEntrada==='function') origemEntrada(extra,salMult(r)>2?'ilicita':'legitima','Salário de quem tomou o poder'); }
  if(!S.pending.some(e=>e.id==='regime_investigacao')&&R.chance(riscoInvestigacao(r))) queue('regime_investigacao',{}); } }catch(e){} return x; })(yearMoney);
EVENTS.regime_investigacao={show:()=>{ const r=regime(), sal=fmt(salPres()*salMult(r||{}));
    return {k:'Política',t:'📰 Investigação internacional',x:'Jornalistas estrangeiros e um tribunal internacional estão investigando as minhas contas.'+(()=>{ const f=[]; if(r&&salMult(r)>2) f.push(`que eu me pago ${sal} por ano`); if(r&&r.saques) f.push(`${r.saques} saque${r.saques>1?'s':''} do tesouro`); return f.length?` Descobriram ${f.join(' e ')}.`:''; })(),
      ch:[['Baixar o meu salário para o de presidente','b'],[`Subornar os investigadores (${fmt(2000000)})`,'s'],['Expulsar os jornalistas do país','e']]}; },
  pick:k=>{ const m=S.me, o=m.office, r=regime(); if(!r) return '';
    const congela=()=>{ const v=Math.round(Math.max(0,m.money)*R.int(20,40)/100); m.money-=v; r.pres+=15; o.appr=clamp(o.appr-10); regFix(r); log(`Um tribunal internacional congelou ${fmt(v)} das minhas contas.`,'bad'); return v; };
    if(k==='b'){ r.salMult=1; r.saques=0; o.appr=clamp(o.appr+5); r.pres-=5; regFix(r); return 'Cortei o meu salário em rede nacional. A investigação perdeu força.'; }
    if(k==='s'){ const c=2000000; if(m.money<c){ const v=congela(); return `Não tinha dinheiro para o suborno. A investigação saiu e congelaram ${fmt(v)}.`; }
      m.money-=c; m.karma=clamp(m.karma-8); if(R.chance(.6)){ r.saques=Math.max(0,(r.saques||0)-1); return 'Os investigadores arquivaram o caso. Ninguém sabe por quê.'; }
      const v=congela(); return `Um investigador gravou a oferta de suborno. Virou manchete, e congelaram ${fmt(v)}.`; }
    r.medo+=5; r.pres+=10; regFix(r); if(R.chance(.5)){ const v=congela(); return `Expulsei os jornalistas, mas o relatório saiu mesmo assim. Congelaram ${fmt(v)}.`; }
    return 'Expulsei os jornalistas e fechei as fronteiras para a imprensa. Por enquanto, ninguém provou nada.'; }};
V.career=(o=>function(){ const res=o.apply(this,arguments), r=regime(); if(!r||!res||!res.items||S.me.prison) return res;
  const i=res.items.findIndex(x=>x&&x.sec==='Dinheiro e poder'); if(i<0) return res;
  res.items.splice(i+1,0,{ic:'💵',l:'Definir meu salário',s:`${fmt(salPres()*salMult(r))}/ano · risco de investigação ${Math.round(riscoInvestigacao(r)*100)}%`,on:regSalario});
  return res; })(V.career);
