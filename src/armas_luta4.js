// Armas no assassinato: com arma é quase certo, arma de fogo chama atenção, brigar antes ajuda
fightEnd=(o=>function(r){ const F=FIGHT, m=S.me; const res=o.apply(this,arguments);
  if(F&&F.pid&&r==='venceu'){ m.c.surra={id:F.pid,age:m.age}; } return res; })(fightEnd);
function armaAssassinato(m){ const a=m.armaUso&&ARMAS[m.armaUso]; return a&&armasDe(m).some(x=>x.id===m.armaUso)?a:null; }
murderKill=function(p){
  const m=S.me, a=armaAssassinato(m); m.karma=clamp(m.karma-40); cnt('crimes'); m.rec.crimes++;
  const nm=fullName(p), how=a?(a.tipo==='fogo'?`um tiro de ${a.n.toLowerCase()}`:`golpes de ${a.n.toLowerCase()}`):R.pick(['envenenamento','um empurrão da escada','um "acidente" de carro','sufocamento','um "assalto" encenado','remédios trocados']);
  const fam=['mae','pai','conjuge','filho','irmao','avo','adot','neto','namoro','noivo'].includes(p.rel);
  const surra=m.c.surra&&m.c.surra.id===p.id&&m.age-m.c.surra.age<=1;
  const ch=Math.min(.97,(a?(a.tipo==='fogo'?.93:.8):.5)+(surra?.2:0));
  if(!R.chance(ch)){ p.bond=0; if(p.rel!=='pet') p.rel='inimigo'; arrest('tentativa de homicídio',6,20); S.pending[S.pending.length-1].d.evid=1; return {ok:false,t:`Tentei matar ${nm}, mas ${p.gender==='F'?'ela':'ele'} sobreviveu e chamou a polícia.`}; }
  if(surra) m.c.surra=null;
  p.alive=false; cnt('kills'); st('happy',-15); return {ok:true,nm,how,fam,a};
};
// barulho: tiro chama atenção (silenciador ajuda), arma branca deixa um pouco mais de rastro
murderResolve=(o=>function(p,k,q){ const a=k&&k.a; if(!a) return o.apply(this,arguments);
  const m=S.me, {nm,how,fam}=k, a4=ARMAS4.find(x=>x.n===a.n), sup=!!(a4&&a4.o.sup)||/silenc/i.test(a.n);
  const ext=a.tipo==='fogo'?(sup?.05:.25):.05;
  const caught=Math.min(.97,(.55+ext+(m.c.kills-1)*.15+(fam?.2:0)-(m.smarts-50)/400)*(1-.65*q));
  if(R.chance(caught)){ arrest('homicídio',15,40); S.pending[S.pending.length-1].d.evid=1; return `Matei ${nm} com ${how}. ${a.tipo==='fogo'&&!sup?R.pick(['Os vizinhos ouviram o disparo e chamaram a polícia.','A perícia achou a cápsula da bala.','O barulho do tiro acordou a rua inteira.']):R.pick(['A perícia achou minhas digitais na arma.','Uma câmera de segurança gravou tudo.','Um vizinho me viu saindo de lá.'])}`; }
  m.c.unsolved=(m.c.unsolved||0)+1; m.c.coldCase=nm; m.c.coldQ=q;
  return `Matei ${nm} com ${how}. ${q>=.6?'Não sobrou nenhuma pista.':'Por enquanto ninguém desconfiou, mas a polícia abriu um inquérito.'}`;
})(murderResolve);
