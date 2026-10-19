// ===== Expectativa de vida realista: o corpo se recupera em direção a uma saúde típica da idade, doenças tratadas pesam pouco,
// e quem morre por saúde esgotada morre de algo coerente com a própria história (não de um raio aleatório) =====
const saudeAlvo=a=>a<30?92:a<45?89:a<55?86:a<65?82:a<75?77:a<85?69:a<95?58:46;
function saudeAlvoDe(m){ const graves=m.dis.filter(d=>DISEASES[d.id]&&DISEASES[d.id].fatal&&!d.ctrl).length, cronicas=m.dis.filter(d=>DISEASES[d.id]&&DISEASES[d.id].chronic&&!d.ctrl&&DISEASES[d.id].dmg>=5).length;
  const vicio=(m.add.alcool>40?10:0)+(m.add.cigarro>40?8:0)+Math.min(15,Math.max(0,...Object.values(m.drogas||{}))/5);
  return saudeAlvo(m.age)-graves*14-cronicas*3-vicio-(m.prison?8:0)+((m.hobbies&&(m.hobbies.corrida||m.hobbies.ciclismo))?3:0); }
yearStats=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(!m||!m.alive||S.scen) return r; const alvo=saudeAlvoDe(m); if(m.health<alvo) st('health',Math.max(1,Math.round((alvo-m.health)*.45))); return r; })(yearStats);
// doença crônica tratada e controlada quase não desgasta; sem tratamento, desgasta no ritmo normal
yearHealth=(o=>function(){ const m=S.me; const ctrl=m.dis.filter(d=>d.ctrl&&DISEASES[d.id]&&DISEASES[d.id].chronic); const h0=m.health; const r=o.apply(this,arguments);
  if(ctrl.length&&m.health<h0){ const devolve=Math.min(h0-m.health,ctrl.reduce((s,d)=>s+DISEASES[d.id].dmg*.45*.25*.8,0)); if(devolve>0) st('health',Math.round(devolve)); }
  return r; })(yearHealth);
// tratar uma doença grave, mesmo sem curar, segura a doença: menos desgaste e menos risco de morte no ano seguinte
treat=(o=>function(where,dis){ const r=o.apply(this,arguments); if(dis&&(where==='hosp'||where==='doc')){ dis.trat=S.year; if(dis.id==='cardiaca'&&S.me.dis.includes(dis)) dis.ctrl=true; } return r; })(treat);
const tratado=d=>d.ctrl||(d.trat!=null&&d.trat>=S.year-2);
yearHealth=(o=>function(){ const m=S.me; const tr=m.dis.filter(d=>tratado(d)&&DISEASES[d.id]&&!DISEASES[d.id].chronic); const h0=m.health; const r=o.apply(this,arguments);
  if(tr.length&&m.health<h0){ const devolve=Math.min(h0-m.health,tr.reduce((s,d)=>s+DISEASES[d.id].dmg*.7,0)); if(devolve>0) st('health',Math.round(devolve)); } return r; })(yearHealth);
deathRoll=function(){ const m=S.me; let p=deathP(m.age,m.health)*diff().d;
  for(const d of m.dis){ const def=DISEASES[d.id]; if(!def||!def.fatal) continue; p+=tratado(d)?.003+Math.min(.008,d.y*.0015):Math.min(.035,.006+d.y*.004); }
  if(m.prison) p+=.003; return R.chance(p); };
// cânceres com prognóstico muito bom na vida real: menos frequentes no fim da vida e muito mais tratáveis
for(const [id,f] of Object.entries({cancer_pele:{p:.5,dmg:5,hosp:.9},cancer_tireoide:{dmg:4,hosp:.95},cancer_testiculo:{dmg:6,hosp:.95},cancer_prostata:{dmg:8,hosp:.8}})){ const d=DISEASES[id]; if(!d) continue; if(f.p) d.p*=f.p; if(f.dmg) d.dmg=f.dmg; if(f.hosp) d.hosp=f.hosp; }
// causa coerente quando a saúde se esgota
causeFromHealth=(o=>function(roll){ const m=S.me, o2=m.gender==='F'?'a':'o';
  if(roll){ const fatal=m.dis.filter(d=>DISEASES[d.id]&&DISEASES[d.id].fatal).sort((a,b)=>DISEASES[b.id].dmg*(b.y+1)-DISEASES[a.id].dmg*(a.y+1)); if(fatal.length&&R.chance(.7)) return 'de '+dn(DISEASES[fatal[0].id].n);
    if(m.prison&&R.chance(.4)) return 'numa briga na prisão'; if(m.age>75) return R.pick(['de causas naturais','dormindo, em paz','de insuficiência cardíaca','de pneumonia','de um AVC']);
    if(m.age>=40) return R.pick(['de um infarto fulminante','de um AVC','de um aneurisma','de uma infecção grave','de insuficiência cardíaca','num acidente de carro']);
    return R.pick(['num acidente de carro','de um aneurisma',`afogad${o2} no mar`,'num acidente doméstico','de uma infecção grave','numa queda de escada','de uma reação alérgica grave',R.chance(.1)?`atingid${o2} por um raio`:'num acidente de moto']); } const fatal=m.dis.filter(d=>DISEASES[d.id]&&DISEASES[d.id].fatal); if(fatal.length) return o.apply(this,arguments);
  if(m.add.alcool>70) return 'de complicações do alcoolismo'; const cron=m.dis.filter(d=>DISEASES[d.id]&&DISEASES[d.id].dmg>=3);
  if(cron.length) return 'de complicações de '+dn(DISEASES[R.pick(cron).id].n); if(m.age>70) return R.pick(['de causas naturais','dormindo, em paz','de insuficiência cardíaca','de pneumonia','de um AVC']);
  return R.pick(['de um infarto fulminante','de um AVC','de uma infecção grave','de insuficiência cardíaca']); })(causeFromHealth);
function longevidadeSelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,_m=modal;window.NO_SAVE=true;window.NO_NEWS=true;modal=()=>{};
  let x=8080; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; }; const idades=[]; let raio=0;
  try{ for(let L=0;L<25;L++){ newLife({country:'BR'}); let g=0; while(S.me.alive&&g++<120){ ageUp(); let n=0; while(S.pending.length&&n++<30){ const e=S.pending.shift(); if(!evValid(e)) continue; try{ const sh=EVENTS[e.id].show(e.d); EVENTS[e.id].pick(sh.ch[0][1],e.d); }catch(err){} } MQ.length=0;
      if(S.me.alive&&S.me.age%2===0){ S.me.dis.forEach(d=>{ try{ treat('hosp',d); }catch(e){} }); } if(S.me.alive&&S.me.health<=0) die(causeFromHealth()); }
    idades.push(S.me.age); if(/raio/.test(S.me.cause||'')&&S.me.age>=45) raio++; } }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; modal=_m; }
  const media=idades.reduce((a,b)=>a+b,0)/idades.length, acima70=idades.filter(a=>a>=70).length/idades.length;
  if(media<64||acima70<.45) throw Error(`Longevidade · expectativa de vida baixa demais: média ${media.toFixed(1)}, ${Math.round(acima70*100)}% passam dos 70`);
  if(media>90) throw Error('Longevidade · expectativa de vida alta demais: '+media.toFixed(1));
  return {media:+media.toFixed(1),acima70:Math.round(acima70*100)}; }
