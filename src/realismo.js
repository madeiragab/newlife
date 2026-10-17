// Probabilidades mais próximas da realidade (referências: incidência anual por pessoa no Brasil e no mundo, arredondada).
// Doenças agudas passam sozinhas em semanas; crianças vão ao médico com os pais; apendicite é cirurgia de urgência.
const REAL_DOENCAS={
 dengue:.012,zika:.003,chikungunya:.004,febre_amarela:.00003,malaria:.01,tuberculose:.0004,coqueluche:.003,sarampo:.002,
 apendicite:.0018,rins:.0025,depressao:.006,ansiedade:.008,panico:.003,toc:.002,insonia:.01,enxaqueca:.012,
 cardiaca:.008,hepatite:.003,leucemia:.0004,tumor_cerebral:.0003,pneumonia:.008,anemia:.008,labirintite:.006,gastrite:.012,
};
for(const [id,p] of Object.entries(REAL_DOENCAS))if(DISEASES[id])DISEASES[id].p=p;
for(const id of CANCERS)if(DISEASES[id]&&!REAL_DOENCAS[id])DISEASES[id].p=Math.round(DISEASES[id].p*.7*1e5)/1e5;
if(DISEASES.apendicite)DISEASES.apendicite.max=70;
// chance de a doença aguda passar sozinha em um ano, sem tratamento
const REAL_AGUDAS={otite:.85,amigdalite:.85,sinusite:.6,bronquite:.7,coqueluche:.9,piolho:.5,pneumonia:.55,anemia:.3,verruga:.3,gastrite:.35,intox:1,conjuntivite:1,
 enxaqueca:.25,insonia:.35,labirintite:.5,refluxo:.25,gota:.4,acne:.2,tdah:0,malaria:.3,ist:.1,gonorreia:.1,sifilis:.05,tuberculose:.1};
function realCuidarCrianca(m){if(m.age>=18||!parents().some(p=>p.alive)||S.scen||m.prison||!m.dis.length)return;let foi=false;
 for(const d of m.dis.slice()){const def=DISEASES[d.id];if(!def||d.id==='apendicite')continue;if(d.k===false&&R.chance(.85))d.k=true;
  if(def.ctrl&&!d.ctrl&&R.chance(.75)){d.ctrl=true;foi=true;continue;}
  if(def.cure==='doc'&&R.chance((def.doc||.8)*.95)){m.dis.splice(m.dis.indexOf(d),1);foi=true;}
  else if(def.cure==='hosp'&&!CANCERS.has(d.id)&&R.chance((def.hosp||.8)*.9)){m.dis.splice(m.dis.indexOf(d),1);foi=true;}}
 if(foi)log(R.pick(['Meus pais me levaram ao médico e eu melhorei.','Fui ao posto com minha mãe ou meu pai. O remédio resolveu.','Passei uns dias de cama, com remédio na hora certa, e sarei.']));}
function realApendicite(m){const d=m.dis.find(x=>x.id==='apendicite');if(!d||S.scen)return;m.dis.splice(m.dis.indexOf(d),1);
 const sus=['BR','GB','CA','PT','ES','IT','FR','DE'].includes(m.country),custo=sus?0:Math.min(Math.max(0,m.money),12000);m.money-=custo;
 if(R.chance(.004)){die('de complicações de uma apendicite');return;}st('health',-R.int(3,8));
 log(`Uma dor forte na barriga me levou ao pronto-socorro de madrugada. Era apendicite: cirurgia de urgência${custo?' que custou '+fmt(custo):' pelo sistema público'}.`,'bad');}
yearHealth=(o=>function(){const r=o.apply(this,arguments),m=S.me;if(!m.alive||S.scen)return r;
 for(const d of m.dis.slice()){const ch=REAL_AGUDAS[d.id];if(ch&&d.y>=1&&R.chance(ch))m.dis.splice(m.dis.indexOf(d),1);}
 realApendicite(m);if(m.alive)realCuidarCrianca(m);return r;})(yearHealth);
function realismoSelfTest(){const s0=S,rf=R.f,ns=window.NO_SAVE;let seed=31;R.f=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};const ok=(v,t)=>{if(!v)throw Error(t);};try{window.NO_SAVE=true;newLife({country:'BR'});const m=S.me;m.age=9;m.born=S.year-9;
 m.dis=[{id:'otite',y:1,ctrl:false,k:false},{id:'apendicite',y:0,ctrl:false,k:false}];m.health=90;yearHealth();ok(!m.dis.some(d=>d.id==='apendicite'),'apendicite ficou sem cirurgia');ok(m.alive,'criança morreu na cirurgia simples');
 let restos=0;for(let i=0;i<20;i++){m.dis=[{id:'otite',y:1,ctrl:false,k:false}];yearHealth();if(m.dis.some(d=>d.id==='otite'))restos++;}ok(restos<=6,'otite não passa: '+restos);
 ok(DISEASES.febre_amarela.p<.0001&&DISEASES.tuberculose.p<.001,'chances antigas');return {ok:true};}finally{S=s0;R.f=rf;window.NO_SAVE=ns;}}
// Divórcio como na vida real: cerca de um terço dos casamentos termina. Risco anual pequeno,
// maior nos primeiros anos e quando o laço está fraco; casamentos longos e felizes quase não acabam.
NL_GANCHOS_ANO.push(()=>{const m=S.me;if(m.age<18||m.prison||(typeof polyGrupo==='function'&&polyGrupo()))return;
 for(const p of people('conjuge').filter(p=>p.alive)){const anos=p.yrs||0,ch=.004+(anos<10?.004:0)+Math.max(0,60-p.bond)/1800;
  if(R.chance(ch)){log(`Depois de muita conversa, ${p.first} e eu decidimos nos separar.`,'bad');divorce(p,true);break;}}});
