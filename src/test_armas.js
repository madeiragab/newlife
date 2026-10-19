// Testes: proficiência em luta, leis de armas e drogas por país, abordagens, overdose, exames e doping
function armasDrogasSelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,_ui=UI.open,erros=[],info={};window.NO_SAVE=true;window.NO_NEWS=true;UI.open=()=>{};
  const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=9191; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; };
  let m;
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=EVENTS[id].show(JSON.parse(JSON.stringify(d))); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v));
    sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap); m=S.me; try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); ok(Number.isFinite(S.me.money),id+'#'+k+' dinheiro'); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); m=S.me; };
  const vida=(pais,idade=28)=>{ newLife({country:pais}); m=S.me; m.age=idade; m.born=S.year-idade; m.prison=null; m.money=200000; S.pending=[]; return m; };
  const briga=(n,lv)=>{ let v=0; for(let i=0;i<n;i++){ m.fight=lv; m.health=90; const p=mkPerson({rel:'tmp',age:30}); p.fight=28; p.health=80; p.style=null; S.people.push(p); startFight({p},'pessoa'); FIGHT.ostyle=null; FIGHT.oarma=null;
      let g=0; while(FIGHT&&!FIGHT.done&&g++<80) fightTurn(R.pick(myMoves().filter(mv=>mv.tipo!=='folego'))); if(FIGHT&&['venceu','matou','acidente'].includes(FIGHT.result)) v++; FIGHT=null; S.people=S.people.filter(q=>q!==p); m.alive=true; S.pending=[]; } return v/n; };
  try{
    // proficiência: lutador profissional desarmado passa fácil por uma pessoa comum
    vida('BR'); m.fight=55; m.job={spc:'lutador',lvl:6,perf:70,yrs:5,co:'Liga'}; m.martial={muay:{lvl:6,last:0}}; info.prof=lutaProf(); const pro=briga(150,55);
    m.job=null; m.martial={}; const leigo=briga(150,12); info.lutadorVence=Math.round(pro*100); info.leigoVence=Math.round(leigo*100);
    ok(pro>=.9,`lutador não vence pessoa comum com facilidade (${Math.round(pro*100)}%)`); ok(leigo<pro-.3,'proficiência não faz diferença');
    // leis de armas
    vida('US',25); ok(armaLegal('pistola')&&armaLegal('fuzil'),'EUA sem compra fácil');
    vida('BR',30); ok(!armaLegal('pistola'),'Brasil vende pistola sem licença'); m.licArma={pais:'BR',ano:S.year}; ok(armaLegal('pistola')&&!armaLegal('fuzil'),'licença brasileira errada');
    vida('JP',30); m.licArma={pais:'JP',ano:S.year}; ok(!armaLegal('pistola')&&armaLegal('espingarda'),'Japão com pistola liberada'); ok(armaPorteIlegal({id:'faca',legal:true,pais:'JP'}),'faca na rua liberada no Japão');
    vida('GB',30); ok(armaPorteIlegal({id:'canivete',legal:true,pais:'GB'}),'canivete na rua liberado no Reino Unido');
    vida('BR',30); m.licArma={pais:'PT',ano:S.year}; ok(!armaLegal('pistola'),'licença de outro país valeu');
    for(const p of ['US','BR','JP']){ vida(p,30); for(const id of Object.keys(ARMAS)){ const snap=JSON.stringify(S); for(const via of ['loja','negro']){ S=JSON.parse(snap); m=S.me; const r=armaComprar(id,via); ok(!BAD.test(String(r)),`compra ${id} ${via} ${p}: ${r}`); ok(Number.isFinite(m.money),'dinheiro inválido na compra'); } S=JSON.parse(snap); m=S.me; } }
    vida('BR',30); ok(armaLicencaIniciar()===''&&S.pending[0].id==='arma_licenca','licença não começou'); todas('arma_licenca',{e:0}); todas('arma_licenca',{e:1});
    for(const id of ['faca','pistola']){ vida('GB',30); m.armas=[{id,legal:false,pais:'GB'}]; m.armaUso=id; todas('arma_abordagem',{}); }
    vida('US',30); m.armas=[{id:'pistola',legal:true,pais:'US'}]; m.armaUso='pistola'; m.mira=70; const p=mkPerson({rel:'tmp',age:30}); S.people.push(p); startFight({p},'pessoa');
    ok(myMoves().some(mv=>mv.tipo==='ameaca')&&myMoves().some(mv=>mv.tipo==='tiro'),'arma não aparece na briga'); fightTurn(myMoves().find(mv=>mv.tipo==='tiro')); ok(FIGHT.lines.length>0,'tiro sem efeito'); FIGHT=null; S.pending=[];
    startFight({name:'X',power:50,bout:{rounds:3,por:5}},'ringue'); ok(!myMoves().some(mv=>mv.arma),'arma no ringue'); FIGHT=null;
    // drogas
    ok(leiDroga('maconha','CA')==='legal'&&leiDroga('maconha','JP')==='severa'&&leiDroga('cocaina','PT')==='descrim'&&leiDroga('cocaina','BR')==='ilegal','leis de drogas erradas');
    for(const pais of ['BR','PT','JP','CA','US']){ vida(pais,25); for(const id of Object.keys(DROGAS)){ const snap=JSON.stringify(S); for(let i=0;i<4;i++){ S=JSON.parse(snap); m=S.me; m.yr={}; const r=drogaUsar(id); ok(!BAD.test(String(r)),`droga ${id} ${pais}: ${r}`); ok(Number.isFinite(m.money),'dinheiro inválido com droga'); } S=JSON.parse(snap); m=S.me; } }
    for(const pais of ['CA','BR','IT','JP']){ vida(pais,25); const r=drogaFlagra('cocaina','na rua'); ok(!BAD.test(String(r)),'flagrante: '+r); }
    vida('BR',25); m.drogas={heroina:90}; let mortes=0; for(let i=0;i<200;i++){ const snap=JSON.stringify(S); m.yr={}; drogaUsar('heroina'); if(!S.me.alive) mortes++; S=JSON.parse(snap); m=S.me; } info.overdoseHeroina=mortes; ok(mortes>0&&mortes<60,'overdose fora do esperado: '+mortes);
    const r1=drogaReab(); ok(!BAD.test(r1),'reabilitação: '+r1);
    vida('BR',30); takeJob({id:'poli',co:'Polícia',size:'grande',mul:1}); m.drogas={cocaina:50}; todas('droga_exame',{});
    vida('BR',25); m.job={spc:'atleta',lvl:2,perf:60,yrs:3,co:'Clube',dop:S.year}; todas('doping_teste',{});
    vida('BR',25); m.job=lutEnsure({spc:'lutador',lvl:6,perf:60,yrs:3,co:'Liga'}); m.job.dop=S.year; let anulou=0; for(let i=0;i<60;i++){ const snap=JSON.stringify(S); m.job.luta={n:'X',titulo:1,defesa:1}; lutadorResultado('venceu','nocaute'); if(S.me.job.susp) anulou++; S=JSON.parse(snap); m=S.me; } ok(anulou>10,'antidoping nunca pega o lutador');
    m.job.susp=2; S.pending=[]; const rs=specialAction(); ok(/suspens/.test(rs)&&!S.pending.length,'suspenso marcou luta');
    vida('BR',30); m.armas=[{id:'faca',legal:true,pais:'BR'}]; m.drogas={maconha:50}; for(const v of [V.armas(),V.drogas(),V.activities()]) v.items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')+String(it.html||'')),'tela: '+(it.l||it.html)));
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; UI.open=_ui; FIGHT=null; }
  if(erros.length) throw Error('Armas e drogas · '+erros.slice(0,8).join(' | ')+' '+JSON.stringify(info)); return info; }
