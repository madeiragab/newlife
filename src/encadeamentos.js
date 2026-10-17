// Acontecimentos grandes puxam a história certa, em vez de esperar o sorteio anual das cadeias.
function encadear(id,chance=1){const m=S.me;if(!CHAINS[id]||S.scen||!m.alive||!R.chance(chance)||!cadStart(id))return false;const eid=cadEv(id,'a'),ev=EVENTS[eid];if(ev.when(m)&&!S.pending.some(e=>e.id===eid))queue(eid,ev.prep(m));return true;}
retire=(o=>function(){const r=o.apply(this,arguments);if(S.me.ret)encadear('hobby_velhice',.7);return r;})(retire);
divorce=(o=>function(p){const r=o.apply(this,arguments);encadear('terapia',.3);return r;})(divorce);
NL_GANCHOS_ANO.push(()=>{const m=S.me,e=m.encadeados||(m.encadeados={});
 for(const p of S.people.filter(p=>!p.alive&&p.rel==='conjuge'&&!e['viuvez'+p.id])){e['viuvez'+p.id]=S.year;encadear('viuvez');}
 for(const p of S.people.filter(p=>p.alive&&p.rel==='neto'&&p.age<=1&&!e['neto'+p.id])){e['neto'+p.id]=S.year;encadear('neto',.6);}
 for(const d of m.dis.filter(d=>d.k!==false&&CANCERS.has(d.id)&&!e['cancer'+d.id])){e['cancer'+d.id]=S.year;encadear('cirurgia_risco',.5);}
});
function encadeamentosSelfTest(){const s0=S,meta0=JSON.stringify(META),snaps0=SNAPS,rf=R.f,ns=window.NO_SAVE;let seed=515;R.f=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};const ok=(v,t)=>{if(!v)throw new Error(t);};try{window.NO_SAVE=true;newLife({country:'BR'});const m=S.me;m.age=60;m.born=S.year-60;S.pending=[];
 const c=mkPerson({rel:'conjuge',gender:m.gender==='M'?'F':'M',age:60,bond:80});c.alive=false;S.people.push(c);for(const f of NL_GANCHOS_ANO)f();ok(cadState().on.viuvez&&S.pending.some(x=>x.id===cadEv('viuvez','a')),'viuvez não encadeou');
 const antes=S.pending.length;for(const f of NL_GANCHOS_ANO)f();ok(S.pending.filter(x=>x.id===cadEv('viuvez','a')).length===1&&S.pending.length>=antes,'viuvez repetida');
 ok(encadear('nao_existe')===false,'cadeia inexistente');S.scen={id:'zumbi'};ok(encadear('hobby_velhice')===false,'encadeou em modo fictício');S.scen=null;
 return {viuvez:true};}finally{S=s0;META=JSON.parse(meta0);SNAPS=snaps0;R.f=rf;window.NO_SAVE=ns;}}
