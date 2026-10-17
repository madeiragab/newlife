// Acontecimentos grandes puxam a história certa, em vez de esperar o sorteio anual das cadeias.
chain('tratamento_cancer',{k:'Saúde',min:18,max:110,when:m=>m.dis.some(d=>d.k!==false&&CANCERS.has(d.id)),gap:[1,1]},{
 a:['A notícia','O médico falou devagar, como quem já disse aquilo muitas vezes. Saí do consultório com um papel na mão e o mundo girando.',['Contar para a família na mesma noite|h-4 >b|Ninguém sabia o que dizer. Só nos abraçamos.','Guardar só para mim por enquanto|h-8 >c|Fingi que estava tudo bem no jantar.']],
 b:['Não estou sozinh{o}','A família se organizou: um leva às consultas, outro faz a comida, outro só fica do lado.',['Aceitar a ajuda|h+8 >d|Aprendi que deixar cuidarem de mim também é coragem.','Insistir em fazer tudo sozinh{o}|h-3 >d|Orgulho pesa mais que a quimioterapia.']],
 c:['O segredo pesa','Esconder o diagnóstico está ficando mais difícil que o tratamento.',['Contar finalmente|h+6 >b|Choraram, brigaram comigo por ter escondido e depois não saíram mais do meu lado.','Procurar um grupo de apoio|$-200 h+6 >d|Gente desconhecida que entende tudo sem eu explicar.']],
 d:['O espelho','O cabelo caiu de vez. Olhei no espelho por muito tempo.',['Raspar o resto e rir disso|h+6|Comprei um lenço colorido e um boné engraçado.','Chorar e seguir|h+2|Cabelo cresce. Eu estou aqui.']],
});
function encadear(id,chance=1){const m=S.me;if(!CHAINS[id]||S.scen||!m.alive||!R.chance(chance)||!cadStart(id))return false;const eid=cadEv(id,'a'),ev=EVENTS[eid];if(ev.when(m)&&!S.pending.some(e=>e.id===eid))queue(eid,ev.prep(m));return true;}
retire=(o=>function(){const r=o.apply(this,arguments);if(S.me.ret)encadear('hobby_velhice',.7);return r;})(retire);
divorce=(o=>function(p){const r=o.apply(this,arguments);encadear('terapia',.3);return r;})(divorce);
NL_GANCHOS_ANO.push(()=>{const m=S.me,e=m.encadeados||(m.encadeados={});
 for(const p of S.people.filter(p=>!p.alive&&p.rel==='conjuge'&&!e['viuvez'+p.id])){e['viuvez'+p.id]=S.year;encadear('viuvez');}
 for(const p of S.people.filter(p=>p.alive&&p.rel==='neto'&&p.age<=1&&!e['neto'+p.id])){e['neto'+p.id]=S.year;encadear('neto',.6);}
 for(const d of m.dis.filter(d=>d.k!==false&&CANCERS.has(d.id)&&!e['cancer'+d.id])){e['cancer'+d.id]=S.year;encadear('tratamento_cancer');}
});
function encadeamentosSelfTest(){const s0=S,meta0=JSON.stringify(META),snaps0=SNAPS,rf=R.f,ns=window.NO_SAVE;let seed=515;R.f=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};const ok=(v,t)=>{if(!v)throw new Error(t);};try{window.NO_SAVE=true;newLife({country:'BR'});const m=S.me;m.age=60;m.born=S.year-60;S.pending=[];
 const c=mkPerson({rel:'conjuge',gender:m.gender==='M'?'F':'M',age:60,bond:80});c.alive=false;S.people.push(c);for(const f of NL_GANCHOS_ANO)f();ok(cadState().on.viuvez&&S.pending.some(x=>x.id===cadEv('viuvez','a')),'viuvez não encadeou');
 const antes=S.pending.length;for(const f of NL_GANCHOS_ANO)f();ok(S.pending.filter(x=>x.id===cadEv('viuvez','a')).length===1&&S.pending.length>=antes,'viuvez repetida');
 ok(encadear('nao_existe')===false,'cadeia inexistente');S.scen={id:'zumbi'};ok(encadear('hobby_velhice')===false,'encadeou em modo fictício');S.scen=null;
 return {viuvez:true};}finally{S=s0;META=JSON.parse(meta0);SNAPS=snaps0;R.f=rf;window.NO_SAVE=ns;}}
