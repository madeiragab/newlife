// ===== Teste automático (abre com #teste no endereço) =====
function selfTest(){
  const errs={},lives=[]; let years=0,events=0,actions=0;
  const T=(name,fn)=>{ try{ actions++; const r=fn(); if(S&&S.me&&!isFinite(S.me.money)){ const k='NaN após '+name; errs[k]=(errs[k]||0)+1; S.me.money=0; } return r; }catch(e){ const k=name+': '+e.message; errs[k]=(errs[k]||0)+1; if(errs[k]===1) errs[k+' @']=(e.stack||'').split('\n').slice(1,3).join(' | '); } };
  const views=()=>{
    const all=[V.god,V.time,V.challenges,V.bizList,V.career,V.assets,V.relations,V.activities,V.mind,V.health,V.love,V.fun,V.trips,V.crimes,V.pets,V.social,V.emigrate,V.menu,V.ribbons,V.grave,V.special,V.politics,V.uniList,V.techList,V.postList,V.clubs,V.shop,V.invest,V.houses,V.cars,V.surgery,V.me,V.roulette,V.slots,V.blackjack(),V.horses(),V.jobs];
    all.forEach((v,i)=>T('view'+i,()=>{ const r=v(); if(r) r.items.map(rowHtml).join(''); }));
    S.people.filter(p=>p.alive).forEach(p=>T('person:'+p.rel,()=>{ const r=V.person(p); if(r) r.items.map(rowHtml).join(''); }));
    S.me.assets.forEach(a=>T('asset',()=>{ const r=V.asset(a); if(r) r.items.map(rowHtml).join(''); }));
    T('render',render); T('occupation',occupation);
  };
  const acts=()=>{
    const m=S.me,c=m.edu.cur;
    if(m.prison){ T('prison',()=>prisonAct(R.pick(['malhar','ler','trabalho','apelar','fugir']))); T('prisonDo',()=>prisonDo(R.pick(['comportar','livro','criarGrupo','entrarGrupo','servico','subir','motim','matar:0','sairGrupo'])));
      if(R.chance(.3)) T('prisonFight',()=>{ startFight(prisonFoe(0),'prisao'); let g=0; while(FIGHT&&!FIGHT.done&&g++<40) fightTurn(R.chance(.1)?null:R.pick(myMoves())); UI.close(); FIGHT=null; }); return; }
    if(m.age>=6&&R.chance(.2)){ const id=R.pick(Object.keys(STYLES)); T('martial',()=>{ martialClass(id); martialClass(id); beltExam(id); }); }
    if(m.age>=5&&R.chance(.15)){ const L=R.pick(LESSONS), it=R.pick(L[3]); T('lesson',()=>takeLesson(L[0],it[0],it[2]||L[1],L[2])); }
    if(m.age>=8&&R.chance(.08)){ const ps=people().filter(p=>p.rel!=='pet'); if(ps.length) T('fight',()=>{ startFight({p:R.pick(ps)},'pessoa'); let g=0; while(FIGHT&&!FIGHT.done&&g++<40) fightTurn(R.chance(.08)?null:R.pick(myMoves())); UI.close(); FIGHT=null; }); }
    if(m.age>=13&&R.chance(.2)) T('bico',()=>bico(R.pick(BICOS)));
    if(m.age>=18&&!S.scen&&!m.prison&&R.chance(.03)) T('scenStart',()=>{ startScen(R.pick(Object.keys(SCEN))); if(S.scen&&S.scen.id==='isekai'&&!S.scen.cls) S.scen.cls=R.pick(Object.keys(CLASSES)); UI.close(); });
    if(S.scen) T('scenAct',()=>{ for(let i=0;i<3&&S.scen;i++) scenAct(R.pick(Object.keys(SCEN[S.scen.id].acts))); const r=S.scen&&V.scen(); if(r) r.items.map(rowHtml).join(''); });
    if(m.age>=18&&R.chance(.1)) T('passport',()=>R.chance(.8)?getPassport():fakePassport());
    if(m.job&&m.job.spc==='crime') T('faccao',()=>faccao(R.pick(['olho','trafico','cobrar','suborno','contencao','x9','guerra','subir','olho','trafico'])));
    if(m.age>=18&&(m.c.crimes||0)>=3&&R.chance(.1)) T('hit',()=>{ const c=hitContracts(); if(c.length) doHit(0,R.pick(HIT_METHODS)); });
    if(R.chance(.1)) T('views2',()=>{ [V.faccao,V.hitman,V.code,V.careerBook,V.careerTree,V.lessons,V.martial,V.bicos].forEach(v=>{ const r=v(); if(r) r.items.map(rowHtml).join(''); }); });
    if(m.job&&R.chance(.2)) T('jobMenu',()=>R.pick([overtime,slackOff,suckUp])());
    if(m.edu.club&&R.chance(.4)) T('clubAct',()=>clubAct(R.pick(['treino','treino','falta','posicao'])));
    if(c){ T('study',study); if(c.type==='fund'||c.type==='medio'){ T('teacher',talkTeacher); if(R.chance(.2)) T('skip',skipClass); if(R.chance(.1)) T('club',()=>joinClub(R.pick(CLUBS))); } if(R.chance(.01)) T('drop',dropOut); }
    else if(hasDeg('medio')&&m.age<35&&R.chance(.35)){ const k=R.pick(['uni','tec','post']); if(k==='uni') T('enrollU',()=>enroll('uni',R.pick(COURSES),R.pick(['publica','particular']),R.pick(['pais','loan','self',null]))); if(k==='tec') T('enrollT',()=>enroll('tec',R.pick(TECHS),null,'loan')); if(k==='post') T('enrollP',()=>enroll('post',R.pick(POSTS),null,'self')); }
    if(m.age>=13&&!m.job&&R.chance(.6)) T('job',()=>{ const ok=openings().filter(o=>!jobReqs(JOBS.find(x=>x.id===o.id)).length); if(ok.length) takeJob(R.pick(ok)); });
    if(m.job){ T('work',workHarder); if(R.chance(.3)) T('raise',askRaise); if(m.job&&R.chance(.15)) T('atestado',()=>sickNote(R.pick(['real','fake','real']))); if(m.job&&R.chance(.3)) T('promo',askPromo); if(m.job&&m.job.spc) T('spcAct',specialAction); if(R.chance(.02)&&m.job) T('quit',quitJob); }
    if(R.chance(.06)) T('spcEntry',()=>specialEntry(R.pick(Object.keys(SPECIAL))));
    if(m.age>=21&&R.chance(.04)) T('run',()=>{ const o=R.pick(OFFICES); runFor(o,R.int(0,2)); });
    if(m.office) T('office',()=>officeAct(R.pick(['lei','discurso','imposto','desvio'])));
    T('body',()=>body(R.pick(['gym','lib','med','walk','yoga','music','acting','sport','salon','spa']),'')); if(R.chance(.2)) T('martial',()=>body('martial','Judô')); if(R.chance(.1)) T('diet',()=>body('diet',R.pick(['vegana','junk'])));
    m.dis.forEach(d=>{ if(R.chance(.5)) T('treat',()=>treat(R.pick(['doc','hosp','alt','psi']),d)); });
    if(R.chance(.2)) T('checkup',checkup); if(R.chance(.1)) T('therapy',therapy);
    Object.keys(m.add).forEach(k=>{ if(m.add[k]>40&&R.chance(.3)) T('rehab',()=>rehab(k)); });
    const ps=people(); for(let i=0;i<3&&ps.length;i++){ const p=R.pick(ps); if(!p.alive) continue; const k=R.pick(['tempo','conversa','elogio','pedir','insulto','discutir','abraco','piada','pegadinha','amizade','flertar','reatar','perdao','castigo','ler','passear','vet','visitar','puxar','viagem','filho','terminar']); T('rel:'+k,()=>interact(p,k,k==='viagem'?5000:null)); }
    if(R.chance(.05)&&ps.length) T('gift',()=>interact(R.pick(ps),'presente',[400,9]));
    const pr=partner(); if(pr&&m.age>=18){ if(pr.rel==='namoro'&&R.chance(.25)) T('propose',()=>interact(pr,'pedido',[5000])); if(pr.rel==='noivo'&&R.chance(.5)) T('wed',()=>interact(pr,'casar',[800,R.chance(.3)])); if(pr.rel==='conjuge'&&R.chance(.02)) T('div',()=>interact(pr,'divorcio')); if(R.chance(.4)) T('kid',()=>interact(pr,'filho')); }
    if(m.age>=13&&!pr&&R.chance(.4)) T('date',()=>askOut(candidate(m.age>=18)));
    if(m.age>=18&&R.chance(.05)) T('hookup',hookup);
    if(m.age>=8&&R.chance(.07)) T('crime',()=>crime(R.pick(CRIMES.filter(c=>c.min<=m.age))));
    if(m.age>=14&&R.chance(.004)&&ps.length) T('murder',()=>murder(R.pick(ps)));
    if(m.age>=18){
      if(R.chance(.15)) T('club',nightclub); if(R.chance(.1)) T('lotto',()=>lottery(R.pick([1,10]))); if(R.chance(.1)) T('roul',()=>roulette(100,R.pick(['vermelho','preto','par','impar','num']),7));
      if(R.chance(.1)) T('slots',()=>slots(10)); if(R.chance(.05)) T('horse',()=>horses(100,0,[{n:'A',odds:2},{n:'B',odds:5}]));
      if(R.chance(.1)) T('trip',()=>travel(R.pick(TRIPS),3000)); if(R.chance(.05)) T('pet',()=>adoptPet(R.pick(['abrigo','criador']),R.pick(PETS)));
      if(m.age>=25&&R.chance(.02)) T('adopt',adoptChild); if(R.chance(.01)) T('emig',()=>emigrate(R.pick(COUNTRIES)));
      if(!m.lic&&R.chance(.3)) T('lic',driving);
      if(R.chance(.15)) T('house',()=>{ const h=R.pick(houseListings()); if(h) buy('casa',h,R.chance(.6)); });
      if(R.chance(.15)) T('car',()=>{ const h=R.pick(carListings()); if(h) buy('carro',h,false); });
      if(R.chance(.1)) T('item',()=>{ const x=R.pick(ITEMS); buy('item',{n:x.t,v:x.v,h:x.h,tal:x.tal},false); });
      if(m.assets.length&&R.chance(.08)) T('sell',()=>sellAsset(R.pick(m.assets))); if(m.assets.length&&R.chance(.1)) T('fix',()=>fixAsset(R.pick(m.assets)));
      if(R.chance(.1)) T('inv',()=>invest(R.pick(['poup','acoes','cripto']),R.pick([1000,10000,-5000])));
      if(R.chance(.03)) T('surg',()=>surgery(R.pick(SURGERIES),R.int(0,2)));
    }
    if(m.age>=13){ if(!m.social&&R.chance(.3)) m.social={f:10,u:'@teste'}; if(m.social) T('post',()=>socialPost(R.pick(['selfie','video','polemica','danca','foto']))); }
    if(m.age>=18&&!m.biz&&R.chance(.05)) T('biz',()=>openBiz(R.pick(BIZ_SECTORS),R.pick(BIZ_NAMES)));
    if(m.biz) T('bizAct',()=>bizAct(R.pick(['invest','mkt','lucro','ipo']),10000)); if(m.biz&&R.chance(.03)) T('bizSell',()=>bizAct('vender'));
    if(m.royal&&!m.royal.abd) T('royal',()=>royalAct(R.pick(['acenar','caridade','viagem','entrevista','discurso','feriado','impostos','perdao']))); if(m.royal&&R.chance(.005)) T('abd',()=>royalAct('abdicar'));
    if(R.chance(.05)) T('god',()=>godSet(R.pick(['happy','smarts','t.art','hair','eyes','h','cure']),R.pick([-10,10])));
    if(R.chance(.01)&&SNAPS.length) T('time',()=>timeTravel(R.int(0,SNAPS.length-1)));
    if(m.age>=8&&R.chance(.04)) T('body2',()=>body(R.pick(['art','write','comedy'])));
  };
  const BAD=/\{\w+\}|%\w+%|undefined|NaN|\[object/;
  const chk=(id,arr)=>arr.forEach(x=>{ if(typeof x==='string'&&BAD.test(x)){ const k='texto com lacuna em '+id+': '+x.slice(0,90); errs[k]=(errs[k]||0)+1; } });
  // varredura: cada evento possível em várias idades, uma escolha de cada vez, sem alterar a vida
  const sweep=()=>{ const snap=JSON.stringify(S);
    for(const id of Object.keys(EVENTS)){ const ev=EVENTS[id]; if(!ev.show) continue;
      T('varre:'+id,()=>{ if(!ev.when||!ev.when(S.me)) return; if(!!ev.jail!==!!S.me.prison) return; const d=ev.prep?ev.prep(S.me):{}; if(d==null) return; const sh=ev.show(d); if(!sh||!sh.ch) return; if(sh.ch.length<2){ const k='só 1 escolha: '+id+' ('+sh.t+')'; errs[k]=1; } if(d.n&&d.nG){ const f=faceSVG(strangerFace(d),40); if(!f.includes('<svg')) throw new Error('rosto vazio'); } const c=R.pick(sh.ch); chk(id,[sh.t,sh.x,c[0]]); const r=ev.pick(c[1],d); chk(id,[r]); swept++; });
      S=JSON.parse(snap); } };
  const live=(maxYears)=>{ let guard=0;
    while(S.me.alive&&guard++<maxYears){
      T('ageUp',ageUp); years++;
      let g2=0; while(S.me.alive&&S.pending.length&&g2++<12){ const e=S.pending.shift(); const ev=EVENTS[e.id]; if(!evValid(e)) continue; events++; T('ev:'+e.id,()=>{ const sh=ev.show(e.d); const c=R.pick(sh.ch); const r=ev.pick(c[1],e.d); chk(e.id,[sh.t,sh.x,c[0],r]); }); }
      if(!S.me.alive) break;
      acts(); if(S.me.alive&&S.me.health<=0) die(causeFromHealth());
      if(R.chance(.3)) views();
      if(!isFinite(S.me.money)) { errs['dinheiro NaN']=1; S.me.money=0; }
    }
    views();
  };
  for(let L=0;L<60;L++){
    T('newLife',()=>newLife(L%6===0?{royal:true}:L%5===0?{country:'BR',gender:'F',diff:'dificil'}:L%7===0?{cls:'pobre',diff:'facil'}:{})); live(130);
    lives.push(`${S.me.first} ${S.me.last} · ${S.me.age}a · ${S.me.cause} · ${S.ribbon} · ${fmt(netWorth())} · ${S.me.hist.length?S.me.hist[S.me.hist.length-1].t:S.me.job?jobTitle(S.me.job):'—'} · filhos ${kids().length}`);
    if(kids().length&&L%2===0){ T('continueAs',()=>continueAs(R.pick(kids()))); T('heir',()=>live(130)); lives.push(`  ↳ herdeiro: ${S.me.first} · ${S.me.age}a · ${S.me.cause} · ger ${S.gen} · olhos ${S.me.genes.eyes}`); }
    T('death',showDeath);
  }
  let swept=0;
  for(let L=0;L<14;L++){ T('newLife',()=>newLife({})); for(const age of [3,8,15,22,35,55,80]){ while(S.me.alive&&S.me.age<age){ T('ageUp',ageUp); S.pending=[]; } if(!S.me.alive) break; T('sweepActs',acts); sweep(); } }
  // atestados: pedir sem parar tem que terminar em demissão
  let fired=0; for(let k=0;k<40;k++){ T('atestLife',()=>{ newLife({}); while(S.me.alive&&S.me.age<25){ S.pending=[]; ageUp(); } if(!S.me.alive) return; S.pending=[]; const ok=openings().filter(o=>!jobReqs(JOBS.find(x=>x.id===o.id)).length); if(ok.length) takeJob(R.pick(ok)); if(!S.me.job) return; S.me.money+=5000; for(let i=0;i<8&&S.me.job;i++) sickNote(i%2?'fake':'real'); if(!S.me.job) fired++; }); }
  // regras da prisão: perde emprego e faculdade, não matricula, escola perde o ano; faculdade só com ensino médio
  T('regrasPrisao',()=>{ for(let k=0;k<12;k++){ newLife({}); const m=S.me; m.age=20; m.alive=true; m.prison=null; m.edu.cur=null;
      const r0=enroll('uni',COURSES[0],'particular','self'); if(!hasDeg('medio')&&!/ensino médio/.test(r0)) errs['faculdade sem ensino médio: '+r0]=1;
      if(!hasDeg('medio')) m.edu.deg.push('medio'); m.money=1e6; enroll('uni',COURSES[0],'particular','self'); const o=openings()[0]; if(o) takeJob(o);
      arrest('teste',3,4); let g=0; while(!m.prison&&S.pending.length&&g++<10){ const e=S.pending.shift(); const ev=EVENTS[e.id]; const sh=ev.show(e.d); ev.pick(sh.ch[0][1],e.d); }
      if(!m.prison) continue;
      if(m.job) errs['preso e ainda empregado']=1; if(m.edu.cur) errs['preso e ainda na faculdade']=1;
      const r=enroll('uni',COURSES[1],'publica'); if(!/pres/.test(r)) errs['matriculou preso: '+r]=1;
      // menor internado: perde o ano da escola
      newLife({}); const k2=S.me; k2.age=14; k2.edu.cur={type:'fund',n:'Ensino Fundamental',len:9,yr:7,grade:70}; k2.prison={left:3,total:3,served:0,behav:50,crime:'teste',juv:true}; const y0=k2.edu.cur.yr; S.pending=[]; ageUp(); if(k2.edu.cur&&k2.edu.cur.yr!==y0) errs['internado passou de ano']=1;
    } });
  // equilíbrio das brigas: minha luta x adulto comum
  const fr=[]; T('fightSim',()=>{ newLife({}); const m=S.me; m.age=25; m.alive=true; m.prison=null; m.health=80;
    for(const lv of [5,30,55,80,95]){ let w=0,n=0; for(let i=0;i<300;i++){ m.fight=lv; m.health=80; m.martial=lv>=80?{jiu:{lvl:4,last:0}}:{}; const p=mkPerson({rel:'tmp',age:30}); p.fight=Math.round(clamp(R.norm(45,14))); p.health=80; S.people.push(p);
      startFight({p},'rua'); let g=0; while(FIGHT&&!FIGHT.done&&g++<60) fightTurn(R.pick(myMoves().filter(x=>x.id!=='empurrao'))); if(FIGHT&&['venceu','matou','acidente'].includes(FIGHT.result)) w++; n++; UI.close(); FIGHT=null; S.people=S.people.filter(x=>x!==p); m.alive=true; }
      fr.push(`luta ${lv}%: vence ${Math.round(w/n*100)}%`); } });
  lives.unshift('BRIGAS contra adulto comum (luta ~45%): '+fr.join(' · '));
  lives.unshift(`ATESTADOS: ${fired}/40 demitidos depois de pedir 8 atestados no mesmo ano`);
  T('save',()=>JSON.parse(JSON.stringify(S)));
  const calm=[];
  for(let L=0;L<60;L++){ T('calmLife',()=>newLife({})); let g=0; while(S.me.alive&&g++<130){ T('ageUp',ageUp); while(S.pending.length){ const e=S.pending.shift(); if(!evValid(e)) continue; T('ev',()=>{ const sh=EVENTS[e.id].show(e.d); EVENTS[e.id].pick(sh.ch[sh.ch.length-1][1],e.d); }); } if(S.me.alive&&S.me.age%3===0) T('calmDoc',()=>{ S.me.dis.forEach(d=>treat('hosp',d)); body('walk'); }); if(S.me.alive&&S.me.health<=0) die(causeFromHealth()); } calm.push(S.me.age); }
  lives.unshift(`VIDA CALMA (só envelhecer + médico): média ${(calm.reduce((a,b)=>a+b,0)/calm.length).toFixed(1)} · acima de 70: ${Math.round(calm.filter(a=>a>=70).length/calm.length*100)}% · acima de 90: ${Math.round(calm.filter(a=>a>=90).length/calm.length*100)}%`);
  const ages=lives.filter(l=>!l.startsWith(' ')).map(l=>+(l.match(/· (\d+)a ·/)||[0,0])[1]);
  lives.unshift(`IDADE MÉDIA: ${(ages.reduce((a,b)=>a+b,0)/ages.length).toFixed(1)} · acima de 70: ${Math.round(ages.filter(a=>a>=70).length/ages.length*100)}% · abaixo de 30: ${Math.round(ages.filter(a=>a<30).length/ages.length*100)}%`);
  const o=document.createElement('pre'); o.id='out'; o.style.cssText='position:fixed;inset:0;z-index:999;background:#fff;color:#000;overflow:auto;padding:10px;font-size:11px;white-space:pre-wrap';
  o.textContent=`NOMES: ${Object.entries(NAME_DB).map(([c,d])=>c+' '+d.M.length+'/'+d.F.length+'/'+d.L.length).join(' · ')}\nEVENTOS: ${Object.keys(EVENTS).length} · TESTE: ${lives.length} vidas, ${years} anos, ${events} eventos, ${actions} ações, ${swept} eventos varridos\nERROS: ${Object.keys(errs).filter(k=>!k.endsWith(' @')).length}\n`+Object.entries(errs).map(([k,v])=>k.endsWith(' @')?'    '+v:`${v}x ${k}`).join('\n')+'\n\n'+lives.join('\n');
  document.body.appendChild(o); document.title='TESTE OK';
}

// ===== Relatório de qualidade do texto (#qualidade): repetição, gênero, coerência de idade =====
function qualityReport(){
  const out=[], dupYear={}, lineCount={}, lifeRep={}, evCount={}, evAge={}, gen={}, me={}, errs={};
  const norm=t=>t.replace(/\$-?[\d.,]+/g,'$N').replace(/\d+/g,'N');
  const ADJ='chatead|magoad|surpres|furios|preocupad|irritad|emocionad|decepcionad|ofendid|envergonhad|assustad|animad|apaixonad|orgulhos|cansad|sozinh|contrariad|arrasad|aliviad|nervos|desconfiad|encantad|empolgad|machucad|internad|pres|grávid|casad|separad|divorciad|apavorad|chocad|tímid|famos|obrigad|perdid|sentid|encrencad|demitid|promovid|aprovad|reprovad|sortead|convidad|escolhid|condenad|absolvid|libertad|curad|vacinad|operad|atropelad|assaltad|roubad|mordid|picad|traíd|pedid|noiv|viúv';
  const reMe=new RegExp('\\b(?:Fiquei|Estou|Estava|Sou|Fui|Saí|Continuo|Virei|Acordei|Me senti|Senti-me|Cheguei) (?:muito |tão |bem |meio |um pouco )?('+ADJ+')(o|a)s?\\b','gi');
  const esc=s=>s.replace(/[^\w\sÀ-ÿ'-]/g,'.');
  const NL=+(location.hash.match(/\d+/)||[8])[0];
  for(let L=0;L<NL;L++){
    try{ newLife(L%3===0?{gender:'F'}:L%3===1?{gender:'M'}:{}); }catch(e){ errs['newLife '+e.message]=1; continue; }
    const seen={}; let g=0;
    while(S.me.alive&&g++<115){
      try{ ageUp(); }catch(e){ errs['ageUp '+e.message]=(errs['ageUp '+e.message]||0)+1; }
      let k=0; while(S.me.alive&&S.pending.length&&k++<10){ const e=S.pending.shift(); if(!evValid(e)) continue; const ev=EVENTS[e.id];
        try{ const sh=ev.show(e.d); const c=R.pick(sh.ch); const r=ev.pick(c[1],e.d); log(sh.t.replace(/[!?.…]+$/,'')+' → '+c[0]+(r?'. '+r:'.'),'choice');
          evCount[e.id]=(evCount[e.id]||0)+1; const a=evAge[e.id]||(evAge[e.id]={min:999,max:0,t:sh.t}); a.min=Math.min(a.min,S.me.age); a.max=Math.max(a.max,S.me.age); }
        catch(err){ errs['ev '+e.id+' '+err.message]=(errs['ev '+e.id+' '+err.message]||0)+1; } }
      const m=S.me;
      if(m.age>=16&&!m.job&&!m.edu.cur&&R.chance(.5)) try{ const ok=openings().filter(o=>!jobReqs(JOBS.find(x=>x.id===o.id)).length); if(ok.length) takeJob(R.pick(ok)); }catch(e){}
      if(m.age>=18&&!partner()&&R.chance(.3)) try{ askOut(candidate(true)); }catch(e){}
      for(let i=0;i<2;i++){ const ps=people().filter(p=>p.rel!=='pet'); if(!ps.length||!m.alive) break; const p=R.pick(ps); const k=R.pick(['tempo','conversa','elogio','pedir','insulto','discutir','abraco','piada','pegadinha','amizade','flertar','perdao','passear','visitar','puxar']);
        try{ const r=interact(p,k,null); if(typeof r==='string') log(r); }catch(e){ errs['interact '+k+' '+e.message]=(errs['interact '+k+' '+e.message]||0)+1; } }
      for(const p of people('pet').slice(0,1)) try{ const r=interact(p,R.pick(['tempo','passear','vet'])); if(typeof r==='string') log(r); }catch(e){}
      const pr=partner(); if(pr&&m.age>=20&&R.chance(.2)) try{ if(pr.rel==='namoro') interact(pr,'pedido',[5000]); else if(pr.rel==='noivo') interact(pr,'casar',[800,false]); else interact(pr,'filho'); }catch(e){}
      const y=S.log[S.log.length-1]; const ls=y.lines.map(l=>typeof l==='string'?l:l.t);
      const s=new Set();
      for(const l of ls){ if(s.has(l)) dupYear[l]=(dupYear[l]||0)+1; s.add(l); const n=norm(l.split(' → ')[0]+(l.includes(' → ')?' → …':'')); if(!l.includes(' → ')){ seen[n]=(seen[n]||0)+1; lineCount[n]=(lineCount[n]||0)+1; }
        let mm; reMe.lastIndex=0; while(mm=reMe.exec(l)){ const want=m.gender==='F'?'a':'o'; if(mm[2].toLowerCase()!==want){ const k=l.slice(0,120); me[k]=(me[k]||0)+1; } }
        for(const p of S.people){ if(p.rel==='pet'||!l.includes(p.first)) continue;
          const re=new RegExp(esc(p.first)+' (?:ficou|está|estava|parece|é|foi|anda|continua|virou|saiu) (?:muito |tão |bem |meio )?('+ADJ+')(o|a)s?\\b','g'); let q;
          while(q=re.exec(l)){ const want=p.gender==='F'?'a':'o'; if(q[2]!==want&&!S.people.some(o=>o!==p&&o.first===p.first&&o.gender!==p.gender)){ const k=l.slice(0,120)+' ['+p.gender+']'; gen[k]=(gen[k]||0)+1; } } }
      }
    }
    for(const n in seen) if(seen[n]>=5) lifeRep[n]=Math.max(lifeRep[n]||0,seen[n]);
  }
  const top=(o,n)=>Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,n);
  out.push('ERROS: '+Object.keys(errs).length); top(errs,20).forEach(([k,v])=>out.push(`  ${v}x ${k}`));
  out.push('\nGÊNERO ERRADO (outras pessoas): '+Object.keys(gen).length); top(gen,40).forEach(([k,v])=>out.push(`  ${v}x ${k}`));
  out.push('\nGÊNERO ERRADO (eu): '+Object.keys(me).length); top(me,40).forEach(([k,v])=>out.push(`  ${v}x ${k}`));
  out.push('\nLINHA REPETIDA NO MESMO ANO: '+Object.keys(dupYear).length); top(dupYear,25).forEach(([k,v])=>out.push(`  ${v}x ${k}`));
  out.push('\nREPETIDA 5+ VEZES NUMA VIDA (máx. numa vida):'); top(lifeRep,40).forEach(([k,v])=>out.push(`  ${v}x ${k}`));
  out.push('\nLINHAS MAIS COMUNS (total):'); top(lineCount,30).forEach(([k,v])=>out.push(`  ${v}x ${k}`));
  const evs=Object.keys(EVENTS).filter(id=>EVENTS[id].when); const never=evs.filter(id=>!evCount[id]);
  out.push(`\nEVENTOS: ${evs.length} sorteáveis · apareceram ${evs.length-never.length} · nunca: ${never.length}`);
  out.push('\nEVENTOS MAIS FREQUENTES:'); top(evCount,25).forEach(([k,v])=>out.push(`  ${v}x ${k} (${evAge[k].t}, ${evAge[k].min}-${evAge[k].max} anos)`));
  out.push('\nIDADES: eventos com faixa de idade suspeita (<10 ou >85):'); Object.entries(evAge).filter(([k,a])=>a.min<10&&a.max>30).forEach(([k,a])=>out.push(`  ${k} ${a.t} ${a.min}-${a.max}`));
  const o=document.createElement('pre'); o.id='out'; o.textContent=out.join('\n'); o.style.cssText='position:fixed;inset:0;z-index:999;background:#fff;color:#000;overflow:auto;padding:10px;font-size:11px;white-space:pre-wrap';
  document.body.appendChild(o); document.title='QUALIDADE OK';
}
