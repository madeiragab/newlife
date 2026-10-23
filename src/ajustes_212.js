// ===== 2.12: anexar território escolhendo o país =====
// Antes o alvo era sorteado e a chance ficava escondida. Agora cada país tem força militar, a tela mostra
// a minha força e a chance contra cada um, e o programa nuclear pesa (atacar potência nuclear sem bomba é suicídio).

const FORCA_PAIS={US:95,IN:80,GB:72,FR:72,KR:68,DE:66,JP:62,IT:58,BR:56,ES:52,CA:50,MX:45,AR:40,PT:32,AO:30};
const NUCLEAR_PAIS=['US','IN','GB','FR'];
const forcaDe=id=>FORCA_PAIS[id]||45;
const paisNuclear=id=>NUCLEAR_PAIS.includes(id);
function minhaForca(r){ return forcaDe(S.me.country)+Math.round((r.leal-50)/2)+(r.nuclear?20:0)+(r.tipo==='militar'?10:0)+(r.anexou||0)*3; }
function chanceAnexar(r,id){ let p=.5+(minhaForca(r)-forcaDe(id))/100; if(paisNuclear(id)&&!r.nuclear) p-=.25; return Math.max(.05,Math.min(.9,p)); }
function riscoGuerra(r,id){ return paisNuclear(id)&&!r.nuclear?.45:Math.max(.08,Math.min(.35,.15+(forcaDe(id)-minhaForca(r))/200)); }
function anexar(id){ const m=S.me, o=m.office, r=regime(); if(!r) return ''; const c=COUNTRIES.find(x=>x.id===id); if(!c||id===m.country) return '';
  if(use('anexar')>1) return 'O exército ainda está se recuperando da última campanha. Só no ano que vem.';
  const p=chanceAnexar(r,id); r.pres+=25; regFix(r);
  if(R.chance(p)){ r.anexou=(r.anexou||0)+1; (r.anexados=r.anexados||[]).push(c.n); o.appr=clamp(o.appr+12); m.fame=clamp(m.fame+12); r.leal+=5; regFix(r);
    log(`🗺️ Anexei uma província ${doPais(c.n)}.`,'big'); return `Os tanques cruzaram a fronteira de madrugada. Em ${R.int(3,40)} dias, a província era nossa. ${c.n} jurou vingança.`; }
  if(R.chance(riscoGuerra(r,id))){ m.office=null; die(`na guerra contra ${c.n}`); return paisNuclear(id)&&!r.nuclear?`${c.n} respondeu com tudo o que tinha. O palácio não existe mais.`:`A invasão virou guerra. ${c.n} chegou até a capital.`; }
  o.appr=clamp(o.appr-15); r.leal-=15; regFix(r); return `A invasão fracassou. ${c.n} expulsou nossas tropas e o exército me culpa.`; }
V.anexar=()=>{ const r=regime(); if(!r) return null; const m=S.me;
  const it=[{html:`<div class="card"><p>Escolha o alvo. A chance depende da força militar dos dois países, da lealdade dos militares, do programa nuclear e das anexações anteriores. Se perder, pode virar guerra.</p>${kv('Minha força militar',minhaForca(r))}${kv('Programa nuclear',r.nuclear?'☢️ Tenho':'Não tenho')}${r.anexados&&r.anexados.length?kv('Já anexei',r.anexados.join(', ')):''}</div>`},{sec:'Países'}];
  for(const c of COUNTRIES.filter(x=>x.id!==m.country).sort((a,b)=>chanceAnexar(r,b.id)-chanceAnexar(r,a.id))){ const p=Math.round(chanceAnexar(r,c.id)*100), risco=Math.round(riscoGuerra(r,c.id)*100);
    it.push({ic:paisNuclear(c.id)?'☢️':'🗺️',l:c.n,s:`Força ${forcaDe(c.id)}${paisNuclear(c.id)?' · potência nuclear':''} · se perder, ${risco}% de virar guerra`,r:`${p}%`,tone:p>=60?'good':p<30?'bad':'',
      on:()=>confirmBox(`Invadir ${c.n}?`,`Chance de vencer: ${p}%. Se perder, ${risco}% de chance de a guerra acabar comigo.`,'Invadir',()=>act(()=>anexar(c.id),'Guerra'))}); }
  return {title:'Anexar território',items:it}; };
V.career=(o=>function(){ const res=o.apply(this,arguments), r=regime(); if(!r||!res||!res.items) return res;
  const it=res.items.find(x=>x&&x.l==='Anexar território vizinho'); if(it){ it.s=`Escolher o país · minha força ${minhaForca(r)}`; it.tone=''; it.confirmado=1; it.on=()=>UI.push(V.anexar); }
  return res; })(V.career);
