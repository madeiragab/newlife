// Testes: bebida só na idade legal de cada país, saída para beber e volta para casa, festa com dança, brincadeiras e relacionamentos
function socialSelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,erros=[],info={};window.NO_SAVE=true;window.NO_NEWS=true;
  const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=3131; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; };
  let m;
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=EVENTS[id].show(JSON.parse(JSON.stringify(d))); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v));
    sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap); m=S.me; try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); ok(Number.isFinite(S.me.money),id+'#'+k+' dinheiro'); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); m=S.me; };
  const vida=(pais,idade)=>{ newLife({country:pais}); m=S.me; m.age=idade; m.born=S.year-idade; m.prison=null; m.money=50000; S.pending=[]; if(idade>=6&&idade<18) startSchool(idade<15?'fund':'medio'); S.people.push(mkPerson({rel:'amigo',age:idade,bond:60})); return m; };
  try{
    // idade legal por país
    vida('US',19); ok(!podeBeber(),'EUA liberam bebida aos 19'); vida('DE',16); ok(podeBeber(),'Alemanha não libera aos 16'); vida('BR',17); ok(!podeBeber(),'Brasil libera aos 17');
    // nenhum evento mostra bebida para quem está abaixo da idade
    let vistos=0; for(const idade of [6,9,12,15,17]){ vida('BR',idade); for(const [id,ev] of Object.entries(EVENTS)){ if(!ev.w||ev.scen||id.startsWith('cad_')) continue; let pode=false; try{ pode=!ev.when||ev.when(m); }catch(e){} if(!pode||!!ev.jail!==!!m.prison) continue;
      let d,sh; try{ d=ev.prep?ev.prep(m):{}; if(d==null) continue; sh=ev.show(d); }catch(e){ continue; } if(!sh||!sh.ch) continue; vistos++;
      const valido=evValid({id,d}); if(!valido) continue; ok(!ALC_RE.test(String(sh.t)+' '+String(sh.x)),`bebida no texto aos ${idade}: ${id} ${sh.t}`); sh.ch.forEach(c=>ok(!ALC_RE.test(String(c[0]))||ALC_NAO.test(String(c[0])),`bebida na escolha aos ${idade}: ${id} → ${c[0]}`)); } }
    info.eventosVistos=vistos;
    vida('BR',16); const ft=EVENTS.festa_teen; if(ft){ const sh=ft.show(ft.prep(m)); ok(!sh.ch.some(c=>c[1]==='b'),'festa adolescente oferece bebida aos 16'); } vida('BR',19); if(ft){ const sh=ft.show(ft.prep(m)); ok(sh.ch.some(c=>c[1]==='b'),'festa não oferece bebida aos 19'); }
    vida('US',19); ok(/21/.test(nightclub()),'balada liberada antes da idade nos EUA');
    // saída para beber e a volta para casa
    vida('BR',25); m.lic=true; m.assets.push({id:newId(),k:'carro',n:'Carro teste',value:10000,cond:100}); const p=people('amigo')[0];
    ok(bebSair(p)===''&&S.pending[0].id==='beb_saida','saída não começou'); todas('beb_saida',{pid:p.id,e:0});
    for(const ac of ['danca','karaoke','briga']) todas('beb_saida',{pid:p.id,e:1,nivel:2,acont:ac,amigoSobrio:true});
    todas('beb_saida',{pid:p.id,e:2,nivel:3,amigoSobrio:true});
    let presos=0,acid=0,mortes=0; for(let i=0;i<300;i++){ const snap=JSON.stringify(S); const r=bebVoltar('dirigir',3); ok(!BAD.test(r),'volta: '+r); if(S.pending.some(e=>e.id==='julgamento')) presos++; if(/hospital|poste|Atropelei|muro/.test(r)) acid++; if(!S.me.alive) mortes++; S=JSON.parse(snap); m=S.me; }
    info.dirigirBebado={presos,acid,mortes}; ok(presos>10&&acid>20&&mortes<25,'dirigir bêbado sem consequência coerente: '+JSON.stringify(info.dirigirBebado));
    let nada=0; for(let i=0;i<100;i++){ const snap=JSON.stringify(S); const r=bebVoltar('dirigir',0); if(/sem ter bebido/.test(r)) nada++; S=JSON.parse(snap); m=S.me; } ok(nada===100,'dirigir sóbrio deu problema');
    // festa e dança
    for(const idade of [7,15,25]){ vida('BR',idade); S.pending=[]; festaIr(idade<12?'aniversario':'festa'); const d=S.pending[0].d; todas('festa_danca',d); const q=people('amigo')[0]; todas('festa_danca',{e:1,pid:q.id,r:0,ok:0,mus:[0,1,2],kid:idade<12?1:0}); todas('festa_danca',{e:1,pid:q.id,r:2,ok:2,mus:[0,1,2],kid:idade<12?1:0}); }
    vida('BR',16); const crush=mkPerson({rel:'amigo',age:16,bond:60,gender:m.gender==='M'?'F':'M'}); S.people.push(crush); let namorou=0; for(let i=0;i<30;i++){ const snap=JSON.stringify(S); EVENTS.festa_danca.pick('coreo',{e:1,pid:crush.id,r:2,ok:2,mus:[0,1,3]}); if(P(crush.id).rel==='namoro') namorou++; S=JSON.parse(snap); m=S.me; } ok(namorou>0,'dançar bem nunca vira namoro');
    vida('BR',7); for(const [b] of BRINCADEIRAS) todas('brincar',{pid:people('amigo')[0].id,b}); todas('pedir_pais',{});
    // relacionamentos
    vida('BR',30); const amor=mkPerson({rel:'namoro',age:30,bond:40,gender:m.gender==='M'?'F':'M'}); S.people.push(amor); const gs=gostosDe(amor); const b0=amor.bond;
    EVENTS.rel_conversa.pick(gs[0],{pid:amor.id}); const ganhoCerto=amor.bond-b0; const b1=amor.bond; EVENTS.rel_conversa.pick(GOSTOS.find(g=>!gs.includes(g)),{pid:amor.id}); ok(ganhoCerto>amor.bond-b1,'acertar o gosto não ajuda mais'); ok(gostosVistos(amor).includes(gs[0]),'gosto não ficou registrado');
    S.pending=[]; relConversar(amor); todas('rel_conversa',S.pending[0].d); S.pending=[]; relEncontro(amor); todas('rel_encontro',S.pending[0].d); todas('rel_dr',{pid:amor.id});
    for(const q of [amor,people('amigo')[0]]) V.person(q).items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')),'tela da pessoa: '+it.l));
    for(const idade of [5,15,25]){ vida('BR',idade); V.activities().items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')),'atividades '+idade+': '+it.l)); }
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; }
  if(erros.length) throw Error('Social · '+erros.slice(0,8).join(' | ')); return info; }
