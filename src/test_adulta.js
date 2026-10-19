// Testes: hobbies, férias, contas, encontro com amigos, check-up, crise dos 40, lista de desejos, netos, memórias e coerência por fase
function adultaSelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,erros=[],info={};window.NO_SAVE=true;window.NO_NEWS=true;
  const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=6262; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; };
  let m;
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=EVENTS[id].show(JSON.parse(JSON.stringify(d))); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v));
    sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap); m=S.me; try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); ok(Number.isFinite(S.me.money),id+'#'+k+' dinheiro'); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); m=S.me; };
  const vida=(idade)=>{ newLife({country:'BR'}); m=S.me; m.age=idade; m.born=S.year-idade; m.prison=null; m.money=100000; S.pending=[]; if(idade<65) takeJob({id:'aux',co:'Teste',size:'média',mul:1}); else m.ret={pension:24000};
    const c=mkPerson({rel:'conjuge',gender:m.gender==='M'?'F':'M',age:idade,bond:50}); S.people.push(c,mkPerson({rel:'filho',age:Math.max(1,idade-28),bond:60,parentId:c.id}),mkPerson({rel:'amigo',age:idade,bond:50})); if(idade>=60) S.people.push(mkPerson({rel:'neto',age:8,bond:60}),mkPerson({rel:'neto',age:23,bond:60})); return m; };
  try{
    // hobbies sobem de nível e o mestre ganha competição
    vida(35); for(let i=0;i<16;i++){ m.yr={}; hobbyPraticar('marcenaria'); } ok(hobbyNivel(m.hobbies.marcenaria)===4,'hobby não chegou a mestre'); ok(S.pending.some(e=>e.id==='hobby_torneio'),'mestre sem competição'); todas('hobby_torneio',{k:'marcenaria'});
    for(const k of Object.keys(HOBBIES)){ m.yr={}; ok(!BAD.test(hobbyPraticar(k)),'hobby '+k); }
    todas('ferias',{e:0}); todas('ferias',{e:1,dest:'cruzeiro'}); todas('contas_mes',{e:0,pts:0}); todas('contas_mes',{e:2,pts:4}); todas('churrasco',{}); todas('crise40',{});
    const din=m.money; S.pending=[]; EVENTS.contas_mes.pick('total',{e:0,pts:0}); let d=S.pending[0].d; S.pending=[]; EVENTS.contas_mes.pick('reserva',d); d=S.pending[0].d; S.pending=[]; EVENTS.contas_mes.pick('corta',d); ok(m.money>din,'contas bem feitas não deram dinheiro');
    // check-up descobre doença escondida
    m.dis=[{id:Object.keys(DISEASES).find(k=>DISEASES[k].chronic)||Object.keys(DISEASES)[0],y:1,ctrl:false,k:false}]; const r1=checkup(); ok(m.dis[0].k&&/acharam|encontraram/.test(r1),'check-up não achou a doença: '+r1+' '+JSON.stringify(m.dis));
    V.vidaAdulta().items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')+String(it.html||'')),'tela adulta: '+(it.l||'')));
    // velhice: lista de desejos, netos e memórias
    vida(70); const ds=desejos(m); ok(ds.length===5,'lista de desejos sem 5 itens'); m.health=90; m.escrevendo=1; m.memorias=3;
    for(const D of DESEJOS){ m.desejos=[{id:D[0],ok:0}]; const r=desejoRealizar(D[0]); ok(!BAD.test(r),'desejo '+D[0]+': '+r); ok(m.desejos[0].ok===1,'desejo não realizado: '+D[0]+' → '+r); }
    m.desejos=[{id:'paraquedas',ok:0}]; m.health=30; ok(/saúde/.test(desejoRealizar('paraquedas'))&&!m.desejos[0].ok,'paraquedas com saúde baixa');
    const neto=people('neto').find(p=>p.age<=14); for(const k of ['mesada','receita','parque']){ m.yr={}; ok(!BAD.test(netoAcao(neto,k)),'neto '+k); } todas('historia_neto',{pid:neto.id}); todas('reencontro_velho',{});
    m.memorias=0; m.escrevendo=1; for(let i=0;i<3;i++){ S.year++; for(const f of NL_GANCHOS_ANO) f(); } ok(m.memorias===3,'memórias não avançaram');
    V.vidaAdulta().items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')+String(it.html||'')),'tela velhice: '+(it.l||''))); ok(V.activities().items.some(it=>it.l==='Vida e melhor idade'),'atividades sem melhor idade');
    // coerência: sem pais vivos, nada de evento sobre os pais
    vida(85); parents().forEach(p=>p.alive=false); let viu=0; for(const [id,ev] of Object.entries(EVENTS)){ if(!ev.w||ev.scen||id.startsWith('cad_')) continue; let pode=false; try{ pode=!ev.when||ev.when(m); }catch(e){} if(!pode||ev.jail) continue; let dd,sh; try{ dd=ev.prep?ev.prep(m):{}; if(dd==null) continue; sh=ev.show(dd); }catch(e){ continue; }
      if(evValid({id,d:dd})&&PAIS_RE.test(String(sh.t)+' '+String(sh.x))) erros.push('evento sobre os pais aos 85 sem pais: '+sh.t); if(ev.title==='Bico de fim de semana') viu++; } ok(!viu,'bico de fim de semana aos 85');
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; }
  if(erros.length) throw Error('Vida adulta · '+erros.slice(0,8).join(' | ')); return info; }
