// Testes: luta tática (ler o adversário vence o acaso), carreira de lutador e minigames de todas as profissões
const LUTA_RESPOSTA={rapido:'forte',forte:'esquiva',agarrar:'forte',defesa:'agarrar',esquiva:'rapido',folego:'forte'};
function lutaEscolhaEsperta(){ const F=FIGHT, l=myMoves(); const lido=Object.keys(LUTA_SINAL).find(k=>LUTA_SINAL[k]===F.sinal);
  if(F.chao==='eu') return l.find(x=>x.tipo===(F.op<45?'finalizar':'forte'))||l[0]; if(F.chao==='ele') return l.find(x=>x.tipo==='esquiva')||l[0];
  if(F.est<25) return l.find(x=>x.tipo==='defesa')||l[0]; const t=lido?LUTA_RESPOSTA[lido]:'rapido'; return l.find(x=>x.tipo===t)||l.find(x=>x.tipo==='rapido')||l[0]; }
function lutaSimular(politica,regra,meu,dele,n=200){ let v=0; for(let i=0;i<n;i++){ S.me.fight=meu; S.me.health=90; startFight({name:'Rival',power:dele,regra,bout:{rounds:3,por:5}},'ringue'); FIGHT.ostyle=null;
    let g=0; while(FIGHT&&!FIGHT.done&&g++<200){ if(FIGHT.intervalo){ lutaIntervalo('recup'); continue; } fightTurn(politica==='esperta'?lutaEscolhaEsperta():R.pick(myMoves())); } if(FIGHT&&FIGHT.result==='venceu') v++; FIGHT=null; } return v/n; }
function carreiras2SelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,_ui=UI.open,erros=[],info={};window.NO_SAVE=true;window.NO_NEWS=true;UI.open=()=>{};
  const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=4242; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; };
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=EVENTS[id].show(JSON.parse(JSON.stringify(d))); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v));
    sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap); m=S.me; try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); ok(Number.isFinite(S.me.money),id+'#'+k+' dinheiro'); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); m=S.me; };
  let m;
  try{
    newLife({country:'BR'}); m=S.me; m.age=25; m.born=S.year-25; m.prison=null; m.money=100000;
    // luta: ler o adversário precisa valer mais do que apertar botões
    const esp=lutaSimular('esperta','mma',50,50), ale=lutaSimular('aleatoria','mma',50,50); info.lutaEsperta=Math.round(esp*100); info.lutaAleatoria=Math.round(ale*100);
    ok(esp>ale+.2,`ler o adversário não faz diferença (${Math.round(esp*100)}% x ${Math.round(ale*100)}%)`);
    const forte=lutaSimular('esperta','mma',80,40), fraco=lutaSimular('esperta','mma',30,70); info.forte=Math.round(forte*100); info.fraco=Math.round(fraco*100); ok(forte>.8&&fraco<forte-.4,`habilidade não pesa (${forte} x ${fraco})`);
    startFight({name:'X',power:50,regra:'boxe',bout:{rounds:3,por:5}},'ringue'); ok(!myMoves().some(mv=>mv.tipo==='agarrar'),'boxe com agarrão'); FIGHT=null;
    startFight({name:'X',power:50,regra:'jiu',bout:{rounds:3,por:5}},'ringue'); ok(!myMoves().some(mv=>mv.tipo==='forte'||mv.tipo==='rapido'),'jiu-jítsu com socos'); FIGHT=null;
    // luta no ringue nunca termina em prisão nem em morte
    m.fight=90; m.martial={krav:{lvl:6,last:0}}; S.pending=[];
    for(let i=0;i<40;i++){ startFight({name:'X',power:30,regra:'mma',bout:{rounds:3,por:5}},'ringue'); let g=0; while(FIGHT&&!FIGHT.done&&g++<200){ if(FIGHT.intervalo){ lutaIntervalo('tudo'); continue; } fightTurn(R.pick(myMoves())); }
      ok(FIGHT&&FIGHT.done,'luta de ringue não terminou'); ok(FIGHT&&!['matou','acidente'].includes(FIGHT.result),'morte no ringue'); FIGHT=null; }
    ok(!S.pending.some(e=>e.id==='julgamento'),'luta de ringue virou processo'); m.martial={}; S.pending=[];
    // rua: as consequências antigas continuam
    const p=mkPerson({rel:'amigo',age:25,bond:50}); S.people.push(p); startFight({p},'rua'); ok(myMoves().some(mv=>mv.tipo==='agarrar'),'rua sem agarrar'); let g=0; while(FIGHT&&!FIGHT.done&&g++<80) fightTurn(lutaEscolhaEsperta()); ok(FIGHT&&FIGHT.done,'briga de rua não terminou'); FIGHT=null;
    // carreira de lutador
    m.fight=40; m.talent.athletic=80; m.health=90; m.job=null; let r=''; for(let i=0;i<40&&!lutEh(m);i++) r=specialEntry('lutador'); ok(lutEh(m)&&m.job.lvl===0,'não entrou na carreira de lutador: '+r);
    todas('lut_modalidade',{}); EVENTS.lut_modalidade.pick('mma',{});
    S.pending=[]; m.yr={}; specialAction(); ok(S.pending[0]&&S.pending[0].id==='lut_camp','marcar luta não abriu o camp'); const dc=S.pending[0].d; { const sh=EVENTS.lut_camp.show(dc); ok(sh.ch.length===4&&!BAD.test(sh.x),'camp com texto ruim: '+sh.x); } S.pending=[];
    let j=m.job; let cfg=null; for(let i=0;i<10&&!cfg;i++){ j.lesao=0; cfg=lutConfig('video',dc); } ok(cfg&&cfg.leitura>0&&cfg.bout.rounds===3,'camp sem configuração');
    const vence=()=>{ j.luta={n:'Rival',titulo:j.lvl>=6?1:0,defesa:j.lvl>=6?1:0}; lutadorResultado('venceu','nocaute'); j.lesao=0; m.yr={}; };
    for(let i=0;i<14&&j.lvl<5;i++) vence(); ok(j.lvl===5,'vitórias não levaram a desafiante: '+j.lvl);
    S.pending=[]; vence(); vence(); ok(S.pending.some(e=>e.id==='lut_titulo'),'desafiante sem chance pelo título'); todas('lut_titulo',{}); j=m.job; S.pending=[];
    j.luta={n:'Campeão',titulo:1,defesa:0}; lutadorResultado('venceu','decisão'); ok(j.lvl===6,'vencer a luta pelo título não deu o cinturão');
    vence(); vence(); ok(S.pending.some(e=>e.id==='lut_titulo'&&e.d.mundial),'campeão sem chance pelo mundial'); S.pending=[];
    j.luta={n:'Campeão mundial',titulo:1,mundial:1,defesa:0}; lutadorResultado('venceu','decisão'); ok(j.lvl===7,'título mundial não veio');
    j.luta={n:'Desafiante',titulo:1,defesa:1}; lutadorResultado('perdeu','nocaute'); ok(j.lvl===6,'perder a defesa não tirou o cinturão'); ok(j.rec.d===1,'cartel errado');
    m.age=37; todas('lut_aposentar',{}); m.age=25; j=m.job;
    const vj=V.jobMenu(); ok(vj.items.some(it=>it.l==='Treinar no camp'),'tela do lutador sem treino');
    // minigame de cada profissão
    const semFam=JOBS.filter(d=>!d.pt&&!CAR_JOB_FAM[d.id]).map(d=>d.id).concat(Object.keys(SPECIAL).filter(k=>!['atleta','lutador'].includes(k)&&!CAR_JOB_FAM[k])); ok(!semFam.length,'profissões sem minigame: '+semFam.join(','));
    for(const [fk,F] of Object.entries(CAR_FAM)){ ok(F.sits.length>=4,'família curta: '+fk); const id=Object.keys(CAR_JOB_FAM).find(k=>CAR_JOB_FAM[k]===fk);
      newLife({country:'BR'}); S.me.age=30; S.me.prison=null; if(SPECIAL[id]) S.me.job={spc:id,lvl:1,perf:60,yrs:2,co:'Teste'}; else takeJob({id,co:'Teste',size:'média',mul:1});
      F.sits.forEach((s,i)=>{ for(const rr of [0,2]) todas('car_dia',{o:[i,(i+1)%F.sits.length,(i+2)%F.sits.length],r:rr,pts:rr?3:0}); }); }
    newLife({country:'BR'}); S.me.age=30; S.me.prison=null; takeJob({id:'prog',co:'Teste',size:'média',mul:1}); const jj=carEnsure(S.me.job);
    S.pending=[]; carMinigame(); ok(S.pending[0]&&S.pending[0].id==='car_dia','minigame não abriu'); S.pending=[];
    jj.adv=2; carFimDia(-2); ok(jj.adv===3&&S.pending.some(e=>e.id==='car_rh'),'três advertências não chamaram o RH'); S.pending=[];
    todas('car_rh',{}); todas('car_destaque',{}); todas('car_proposta',{co:'Grupo Atlas',size:'grande',p:25});
    const j2=carEnsure(S.me.job), per=j2.perf; carFimDia(6); ok(j2.perf>per,'dia perfeito não subiu o desempenho');
    const vm=V.jobMenu(); ok(vm.items.some(it=>it.l==='Projeto crítico'),'tela sem minigame da profissão');
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; UI.open=_ui; FIGHT=null; }
  if(erros.length) throw Error('Carreiras · '+erros.slice(0,8).join(' | ')); return info; }
