// ===== Teste automático (abre com #teste no endereço) =====
function selfTest(){
  const originalRandom=R.f;let seed=20261017;R.f=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
  const errs={},lives=[]; let years=0,events=0,actions=0;
  const T=(name,fn)=>{ window.__T=name; (window.__TR=window.__TR||[]).push(name); if(window.__TR.length>30) window.__TR.shift(); try{ actions++; if(actions%5000===0&&window.nlTestNotify)window.nlTestNotify(JSON.stringify({teste:name,acoes:actions})); const r=fn(); if(S&&S.me&&!isFinite(S.me.money)){ const k='NaN após '+name; errs[k]=(errs[k]||0)+1; S.me.money=0; } return r; }catch(e){ const k=name+': '+e.message; errs[k]=(errs[k]||0)+1; if(errs[k]===1) errs[k+' @']=(e.stack||'').split('\n').slice(1,3).join(' | '); } };
  T('paranormal profissional',()=>{
    const assert=(ok,msg)=>{ if(!ok) throw Error(msg); };
    newLife({}); S.me.age=25; S.me.money=100000; S.me.health=100; S.me.prison=null; S.scen=null;
    pnEntrar(); assert(pn().ativa,'carreira'); const ofertas=pnOfertas(); assert(ofertas===pnOfertas(),'ofertas mudaram no mesmo ano');
    const chance=R.chance; try { R.chance=()=>false;
      for(const e of PN_ENTIDADES){
        pn().ofertas=[{id:'teste',cliente:'Cliente',local:'Casa',nivel:1,ex:true,pago:1000,aceito:false}];pn().ano=S.year;
        pnAceitar('teste'); const c=pn().caso; c.ent=e.id;c.quarto=1; const antes=S.me.money;
        pnAcao('mover',1); for(const k of Object.keys(PN_PISTAS)) pnAcao('medir',k);
        assert(c.pistas.length===3,'três provas '+e.id); const bateria=c.bat;pnAcao('medir',e.p[0]);assert(c.bat===bateria,'repetição consumiu bateria');
        c.caca=2;pnAcao('esconder');assert(!c.caca,'esconderijo');
        pnAcao('proteger');pnAcao('rito',e.rit);assert(c.expulsa,'rito '+e.id);pnAcao('mover',0);
        S=JSON.parse(JSON.stringify(S)); assert(pn().caso.pistas.length===3,'save perdeu pistas');
        pnFinalizar(e.id);assert(S.me.money===antes+1000,'pagamento');pnFinalizar(e.id);assert(S.me.money===antes+1000,'pagamento duplicado');assert(pn().best[e.id]===1,'bestiário');
      }
      pn().ofertas=[{id:'erro',local:'Casa',nivel:1,ex:false,pago:1000}]; pnAceitar('erro');let saldo=S.me.money;pnFinalizar('inexistente');assert(S.me.money===saldo,'erro pagou');
      pn().ofertas=[{id:'fuga',local:'Casa',nivel:1,ex:true,pago:1000}];pnAceitar('fuga');pn().caso.san=1;pnAcao('mover',1);assert(!pn().caso,'sanidade zero não encerrou');
      pn().ofertas=[{id:'parcial',local:'Casa',nivel:1,ex:true,pago:1000}];pnAceitar('parcial');pn().caso.ent='errante';pn().caso.pistas=['frio','voz','escrita'];saldo=S.me.money;pnFinalizar('errante');assert(S.me.money===saldo+400,'pagamento parcial');
      S.me.criatura=null;addDisease('febre_lunar');assert(!S.me.dis.some(d=>d.id==='febre_lunar'),'humano com doença lunar');
      S.me.criatura='vampiro';addDisease('febre_lunar');assert(!S.me.dis.some(d=>d.id==='febre_lunar'),'vampiro com doença lunar');addDisease('sangue_cinzento');assert(S.me.dis.some(d=>d.id==='sangue_cinzento'),'doença vampiro');
      const dinheiro=S.me.money;pnTratar('sangue_cinzento');assert(S.me.money===dinheiro-1800,'custo tratamento');pnTratar('sangue_cinzento');assert(S.me.money===dinheiro-1800,'tratamento repetido');
      S.me.criatura=null;yearHealth();assert(!S.me.dis.some(d=>PN_DOENCAS[d.id]),'doença após cura da maldição');
      S.me.age=12;pn().ativa=false;pnEntrar();assert(!pn().ativa,'menor profissional');S.me.age=25;
      [V.paraProf,V.paraCaso,V.paraBest,V.paraSaude,V.novidades,V.historico(),V.historico(999)].forEach(v=>v().items.map(rowHtml));
      assert(nlNotas().some(x=>x.v==='1.0'&&x.body.includes('Primeira versão')),'changelog sem lançamento inicial');
    } finally { R.chance=chance; }
  });
  T('correções e evolução da vida comum',evolucaoSelfTest);
  T('histórico profissional dos NPCs',carreiraNpcSelfTest);
  T('despesas familiares compartilhadas',familiaFinancasSelfTest);
  T('localização e residência',localizacaoSelfTest);
  T('decisões e memórias familiares',familiaDecisoesSelfTest);
  T('envelhecimento e rotina',cotidianoIdadeSelfTest);
  T('aposentadoria e herança',aposentadoriaSelfTest);
  T('conquistas da família',conquistasFamiliaSelfTest);
  T('peso das memórias',memoriaPesoSelfTest);
  T('acontecimentos que puxam histórias',encadeamentosSelfTest);
  T('probabilidades realistas',realismoSelfTest);
  T('separações e relações plurais',separacoesSelfTest);
  T('carreira no futebol',futebolSelfTest);
  T('Copa do Mundo',copaSelfTest);
  T('Copa e Olimpíadas no mundo',grandesEventosSelfTest);
  T('seita: deep web, sermão, atentados e complôs',seita3SelfTest);
  T('luta tática, lutador e minigames das profissões',carreiras2SelfTest);
  T('proficiência, armas, drogas e doping',armasDrogasSelfTest);
  T('desafios, especializações, certificações e entrevistas',carreiras3SelfTest);
  T('provas, vestibular, minigames da escola e faculdade',escolaSelfTest);
  T('idade para beber, saídas, festas, brincadeiras e relacionamentos',socialSelfTest);
  T('vida adulta, velhice, lista de desejos e netos',adultaSelfTest);
  T('expectativa de vida',longevidadeSelfTest);
  T('eventos coerentes com a idade',idadeCoerenteSelfTest);
  T('minigames automáticos',minigamesAutoSelfTest);
  T('eventos de cada país',paisesSelfTest);
  T('carreira política',politicaSelfTest);
  T('escândalos, economia e guerra',politica3SelfTest);
  T('guerras, alianças e espionagem',guerraSelfTest);
  T('política de cada país',politica4SelfTest);
  T('turma da faculdade',turmaSelfTest);
  T('eventos da empresa no caixa',empresasEventosSelfTest);
  T('continuidade sob mudanças extremas',continuidadeExtremaSelfTest);
  T('cobertura de todas as escolhas',()=>{window.NL_COBERTURA_EVENTOS=coberturaEventosSelfTest(30000);});
  T('três gerações naturais',()=>{window.NL_GERACOES_NATURAIS=geracoesNaturaisSelfTest();});
  if(window.NL_MIG_FIXTURES)T('saves de versões publicadas',()=>{window.NL_MIGRACAO=migracaoVersoesSelfTest(window.NL_MIG_FIXTURES);});
  T('três gerações por estilo',()=>{window.NL_TRES_GERACOES=evolucaoGeracoesSelfTest();});
  T('trajetórias persistentes',continuidadeSelfTest);
  T('NPCs ao longo de décadas',()=>{window.NL_NPC_DECADAS=npcDecadasSelfTest();});
  if(window.NL_CONT_FIXTURES)T('saves reais da 1.59 e 1.60',()=>{window.NL_CONT_COMPAT=continuidadeCompatSelfTest(window.NL_CONT_FIXTURES);});
  T('família e saves',familySelfTest);
  T('sistemas públicos integrados',publicSystemsSelfTest);
  T('economia mundial',()=>mundoDiagnostico(100));
  if(window.NL_SAVE_FIXTURE)T('save econômico da v1.46',()=>economiaCompatSelfTest(window.NL_SAVE_FIXTURE));
  T('idades e animais',idadeAnimaisSelfTest);
  T('aprendizado pela leitura',leituraSelfTest);
  T('percursos completos',()=>{window.NL_PLAYTESTS=trajetoriasSelfTest();});
  T('estratégias entre países',()=>{const r=estrategiasMundoDiagnostico();window.NL_ECON_DIAG=r;});
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
    if(m.age>=18&&!S.scen&&!m.prison&&R.chance(.02)) T('scenStart',()=>{ scStart(R.pick(Object.keys(SCEN))); if(S.scen&&S.scen.id==='isekai'&&!S.scen.cls) S.scen.cls=R.pick(Object.keys(CLASSES)); UI.close(); });
    if(S.scen){ T('scenDay',scenRandomDay); return; }
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
  const scenRandomDay=()=>{ const sc=S.scen; if(!sc) return; const d=SCEN[sc.id];
    for(let i=0;i<4&&S.scen;i++){ const r=R.f();
      if(r<.35){ const p=sc.loc.pois.find(p=>!p.done); if(p&&sc.ap>0){ sc.ap--; p.done=1; d.poi(sc,p); } }
      else if(r<.7){ const ks=Object.keys(d.acts).filter(k=>k!=='aposentar'&&k!=='zarpar'||R.chance(.05)); const k=R.pick(ks), a=d.acts[k]; if(!(a.min&&!a.min(sc))&&!sc.done[k]&&sc.ap>=(a.ap??1)){ sc.ap-=(a.ap??1); sc.done[k]=1; a.fn(sc,S.me); } }
      else if(r<.85&&sc.inv.length){ const x=R.pick(sc.inv); if(['comida','agua','remedio','mana','san','o2','vacina','sinal'].includes(itCat(x.id))) scUse(x); else if(itCat(x.id)==='arma'){ sc.inv=sc.inv.filter(y=>y!==x); if(sc.arma) addItem(sc.arma.id,sc.arma.hp,true); sc.arma=x; } }
      else if(crew().length){ const c=R.pick(crew()); c.lv=Math.min(100,c.lv+5); const w=sc.inv.find(x=>itCat(x.id)==='arma'); if(w&&!c.arma){ sc.inv=sc.inv.filter(y=>y!==w); c.arma=w; } }
      if(S.scen&&sc.fome>60){ const f=sc.inv.find(x=>itCat(x.id)==='comida'); if(f) scUse(f); } if(S.scen&&sc.hl<40){ const f=sc.inv.find(x=>itCat(x.id)==='remedio'); if(f) scUse(f); }
      if(S.scen&&sc.id==='ilha'&&sc.sede>60){ const f=sc.inv.find(x=>itCat(x.id)==='agua'); if(f) scUse(f); }
      if(S.scen&&sc.id==='zumbi'){ zEnsure(sc); if(R.chance(.15)) sc.stay=1; while(sc.zpts>0){ sc.zpts--; sc.zat[R.pick(Object.keys(ZAT))]++; }
        if(R.chance(.3)){ const k=R.pick(['comida','agua','remedio','gas','armas','mat']); if(sc.ap>0&&!sc.done['zs_'+k]){ sc.ap--; sc.done['zs_'+k]=1; zScav(k); } }
        if(R.chance(.2)&&sc.ap>=2&&!sc.done.zexp){ sc.ap-=2; sc.done.zexp=1; zExpedition(R.pick(Object.keys(ZEXP))); }
        const rc=R.pick(ZRECIPES); if(sc.zmat>=rc[3]&&rc[5]<=zBaseLv(sc,'oficina')&&rc[4].every(i=>sc.inv.some(x=>x.id===i))) zCraft(rc);
        if(!sc.zb&&sc.dia>6&&R.chance(.2)) zFoundBase('Teste'); if(sc.zb){ const ks=Object.keys(ZB).filter(k=>sc.zb.b[k]<ZB[k][4]&&sc.zmat>=ZB[k][2]*(sc.zb.b[k]+1)); if(ks.length&&R.chance(.5)){ const k=R.pick(ks); sc.zmat-=ZB[k][2]*(sc.zb.b[k]+1); sc.zb.b[k]++; } sc.zb.racao=R.int(0,2); sc.zb.portas=R.int(0,2); }
        if(R.chance(.15)){ const f=R.pick(Object.keys(ZFAC)); const r=V.zFacOne(f); if(r) r.items.map(rowHtml).join(''); } } if(S.scen&&sc.id==='isekai') sc.travel=sc.lvl>=sc.rota*2+1?1:0;
      if(S.scen&&sc.id==='isekai'){ iskEnsure(sc); while(sc.pts>0){ sc.pts--; sc.at[R.pick(['for','mag','agi','vit'])]++; } const sp=sc.sp.filter(id=>!sc.done['sp_'+id]); if(sp.length&&R.chance(.6)) castSpell(R.pick(sp));
        if(!sc.vila&&sc.lvl>=4&&sc.ouro>=250) vilaFound('Teste'); if(sc.vila&&R.chance(.5)){ const ks=Object.keys(VILA_B).filter(k=>sc.vila.b[k]<5&&sc.ouro>=VILA_B[k][2]*(sc.vila.b[k]+1)); if(ks.length){ const k=R.pick(ks); sc.ouro-=VILA_B[k][2]*(sc.vila.b[k]+1); sc.vila.b[k]++; } } if(sc.vila&&R.chance(.2)){ sc.vila.imp=R.int(0,2); sc.vila.imig=R.int(0,2); sc.vila.racao=R.int(0,2); } if(sc.vila&&!sc.vila.res){ const c=Object.keys(TECH).filter(t=>!vHas(sc.vila,t)&&(!TECH[t][4]||vHas(sc.vila,TECH[t][4]))); if(c.length) sc.vila.res=R.pick(c); }
        if(!sc.vila&&atHome(sc)&&!sc.casa&&sc.ouro>=ISK_TOWNS[sc.morada][3]&&R.chance(.3)){ sc.ouro-=ISK_TOWNS[sc.morada][3]; sc.casa=1; } }
      scCheck(); } };
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
  for(let L=0;L<14;L++){ T('newLife',()=>newLife({})); for(const age of [3,8,15,22,35,55,80]){ S.scen=null; let passos=0; while(S.me.alive&&S.me.age<age&&passos++<130){ T('ageUp',ageUp); S.pending=[]; } if(S.me.alive&&S.me.age<age){ errs['varredura normal não avançou até '+age]=1; break; } if(!S.me.alive) break; T('sweepActs',acts); sweep(); } }
  // atestados: pedir sem parar tem que terminar em demissão
  let fired=0; for(let k=0;k<40;k++){ T('atestLife',()=>{ newLife({}); while(S.me.alive&&S.me.age<25){ S.pending=[]; ageUp(); } if(!S.me.alive) return; S.pending=[]; const ok=openings().filter(o=>!jobReqs(JOBS.find(x=>x.id===o.id)).length); if(ok.length) takeJob(R.pick(ok)); if(!S.me.job) return; S.me.money+=5000; for(let i=0;i<8&&S.me.job;i++) sickNote(i%2?'fake':'real'); if(!S.me.job) fired++; }); }
  // aventuras (modos fictícios): cada modo jogado até o fim várias vezes, e cada evento de aventura varrido
  const adv=[]; for(const id of Object.keys(SCEN)){ let win=0,days=0,n=0;
    for(let k=0;k<8;k++){ T('advLife',()=>{ newLife({}); const m=S.me; while(m.alive&&m.age<22){ S.pending=[]; ageUp(); } m.alive=true; m.prison=null; S.pending=[]; MQ.length=0; scStart(id); if(id==='isekai') S.scen.cls=R.pick(Object.keys(CLASSES)); });
      const before=(S.me.c.scenWin||0); let g=0;
      while(S.scen&&g++<(id==="isekai"?160:id==="heroi"?110:80)){ T('advDay:'+id,()=>{ scNextDay(); }); let e2=0; while(S.scen&&S.pending.length&&e2++<12){ const e=S.pending.shift(); if(!evValid(e)) continue; const ev=EVENTS[e.id]; events++; T('advEv:'+id+':'+e.id,()=>{ const sh=ev.show(e.d); if(sh.ch.length<2) errs['só 1 escolha: '+e.id]=1; const c=R.pick(sh.ch); const r=ev.pick(c[1],e.d); chk(e.id,[sh.t,sh.x,c[0],r]); }); T('advCheck',scCheck); }
        if(S.scen) T('advAct:'+id,scenRandomDay); if(S.scen) T('advCheck',scCheck); if(S.scen) T('advViews:'+id,()=>{ [V.scLocal,V.scActs,V.scCrew,V.scItems,V.scMe].concat(id==='isekai'?[V.iskMe,V.iskMagic,V.iskVila]:id==='zumbi'?[V.zMe,V.zScav,V.zExp,V.zCraft,V.zFac,V.zBase]:[]).forEach(v=>{ const r=v(); if(r) r.items.map(rowHtml).join(''); }); crew().forEach(c=>{ const r=V.scMember(c); if(r) r.items.map(rowHtml).join(''); }); renderScen(); }); }
      if(S.scen){ if(!['zumbi','heroi'].includes(id)) errs['aventura não terminou: '+id]=1; else days+=S.scen.dia; S.scen=null; } n++; days+=(S.log[S.log.length-1].lines.map(l=>typeof l==='string'?l:l.t).join(' ').match(/: (\d+) (dia|sol)/)||[0,0])[1]*1; if((S.me.c.scenWin||0)>before) win++; MQ.length=0; }
    T('advSweep:'+id,()=>{ newLife({}); S.me.age=25; scStart(id); if(id==='isekai'){ S.scen.cls='mago'; iskEnsure(S.scen); S.scen.ouro=3000; S.scen.lvl=6; vilaFound('Teste'); } if(id==='zumbi'){ zEnsure(S.scen); zFoundBase('Teste'); } for(let i=0;i<4;i++){ scNextDay(); } S.pending=[]; const snap=JSON.stringify(S); let nev=0;
      for(const [eid,ev] of Object.entries(EVENTS)){ if(ev.scen!==id||!ev.w) continue; nev++; T('advVarre:'+eid,()=>{ S=JSON.parse(snap); if(ev.when&&!ev.when(S.me)){ S.scen.crew.length||mkCrew(); } const d=ev.prep?ev.prep(S.me):{}; if(d==null) return; const sh=ev.show(d); if(sh.ch.length<2) errs['só 1 escolha: '+eid+' ('+sh.t+')']=1; for(const c of sh.ch){ S=JSON.parse(snap); const r=ev.pick(c[1],d); chk(eid,[sh.t,sh.x,c[0],r]); } swept++; }); }
      S=JSON.parse(snap); S.scen=null; adv.push(`${id}: ${nev} eventos`); });
    adv.push(`${id}: ${win}/${n} vitórias, média ${(days/n).toFixed(1)} dias`); }
  lives.unshift('AVENTURAS: '+adv.join(' · '));
  // vida normal: seita, polícia, golpe de Estado, paranormal e as reações ao desistir
  const sweepNow=tag=>{ const snap=JSON.stringify(S); let n=0; for(const [id,ev] of Object.entries(EVENTS)){ if(ev.scen||!ev.w||!ev.prep) continue; S=JSON.parse(snap); let ok=false; try{ ok=!ev.when||ev.when(S.me); }catch(e){} if(!ok) continue; const d=ev.prep(S.me); if(d==null) continue; n++;
      T('varre'+tag+':'+id,()=>{ const sh=ev.show(d); const c=R.pick(sh.ch); const r=ev.pick(c[1],d); [sh.t,sh.x,c[0],r].forEach(x=>{ if(/\{\w+\}|undefined|NaN/.test(String(x))) errs[`texto com lacuna em ${tag} ${id}: ${x}`]=1; }); }); } S=JSON.parse(snap); return n; };
  T('equipes',()=>{ for(let k=0;k<4;k++){ newLife({}); const m=S.me; m.age=16; m.alive=true; m.prison=null; m.edu.club=R.pick(CLUBS).n; m.edu.clubLvl=0; const r=V.clubMenu(); const it=r.items.find(x=>x.l==='Membros da equipe'); if(!it) { errs['equipe: clube sem membros']=1; continue; } it.on&&0; const v=V.grp(clubKey(),'t',{size:7,n:'t',role:'Colega de time',age:()=>16})(); v.items.map(rowHtml).join(''); const p=grpMembers(clubKey())[0]; if(!p) errs['equipe: ninguém no clube']=1; else { p.bond=95; interact(p,'amizade'); if(p.rel!=='amigo'&&p.bond>90) {} V.person(p).items.map(rowHtml).join(''); }
      m.age=30; if(!m.edu.deg.includes('medio')) m.edu.deg.push('medio'); takeJob({id:'poli',co:'Polícia Civil',size:'grande',mul:1}); { const jm0=V.jobMenu(); jm0.items.map(rowHtml).join(''); if(!jm0.items.some(x=>x.l==='Membros da equipe')) errs['trabalho sem membros']=1; V.trabalho().items.map(rowHtml).join(''); if(people('colegaT').length<5) errs['equipe do trabalho pequena']=1; if(V.relations().items.some(x=>x.sec==='Trabalho')) errs['colegas de trabalho ainda nas relações']=1; } m.job={spc:'atleta',lvl:0,perf:50,yrs:0,co:'Clube Teste'}; const jm=V.jobMenu(); const b=jm.items.find(x=>x.l==='Membros da equipe'); if(!b) errs['equipe: carreira especial sem membros']=1; seitaFundar('igreja','T'); V.seita().items.map(rowHtml).join(''); clubAct('sair'); } });
  T('turma',()=>{ for(let k=0;k<5;k++){ newLife({}); const m=S.me; while(m.alive&&m.age<8){ S.pending=[]; ageUp(); } if(!m.alive||!m.edu.cur) continue; const v=V.turma(); v.items.map(rowHtml).join(''); if(!people('prof').length) errs['turma sem professor']=1; if(V.relations().items.some(x=>x.sec==='Escola')) errs['turma ainda aparece nas relações']=1; const r=tempoTodos(); if(typeof r!=='string') errs['tempo com todos']=1; } });
  T('membros',()=>{ newLife({}); const m=S.me; m.age=40; m.alive=true; m.prison=null; m.money=1e7; m.office={id:'pref',yrs:0,appr:50}; m.biz={n:'Empresa Teste',sector:'Tecnologia',value:1e6,emp:30,yrs:1}; let r=V.career(); ['Equipe do gabinete','Funcionários'].forEach(l=>{ const it=r.items.find(x=>x.l===l); if(!it) errs['sem membros: '+l]=1; });
    V.grp('biz:Empresa Teste','t',{size:8,n:'t',role:'Funcionário|Funcionária',roles:['Gerente','Analista'],age:()=>30})().items.map(rowHtml).join('');
    for(const id of ['zumbi','isekai']){ newLife({}); S.me.age=25; scStart(id); UI.close(); const sc=S.scen; if(id==='zumbi'){ zEnsure(sc); zFoundBase('Teste'); sc.zb.pop=25; const v=V.zBase(); if(!v.items.some(x=>x.l==='Moradores da base')) errs['base sem moradores']=1; const g=V.scGente('zbase','t',()=>sc.zb.pop,'x')(); if(g.items.length<20) errs['poucos moradores']=1; }
      else { iskEnsure(sc); sc.cls='mago'; V.iskLar().items.map(rowHtml).join(''); sc.ouro=3000; sc.lvl=6; vilaFound('T'); sc.vila.pop=15; V.iskVila().items.map(rowHtml).join(''); V.scGente('vila','t',()=>15,'x')().items.map(rowHtml).join(''); } S.scen=null; } });
  T('varreMembros',()=>{ newLife({}); let m=S.me; while(m.alive&&m.age<14){ S.pending=[]; ageUp(); } m.alive=true; m.prison=null; if(!m.edu.cur) m.edu.cur={type:'medio',n:'Ensino Médio',len:3,yr:1,grade:70,pub:1}; m.edu.club=CLUBS[0].n; if(!people('colega').length) for(let i=0;i<5;i++) S.people.push(mkPerson({rel:'colega',age:m.age,bond:40})); grpAuto(); sweepNow('escola');
    m.age=30; m.edu.club=null; m.edu.cur=null; if(!m.edu.deg.includes('medio')) m.edu.deg.push('medio'); takeJob({id:'poli',co:'Polícia Civil',size:'grande',mul:1}); grpAuto(); sweepNow('trab');
    m.job={spc:'atleta',lvl:1,perf:50,yrs:0,co:'Clube Teste'}; m.office={id:'pref',yrs:0,appr:50}; m.biz={n:'Empresa T',sector:'Tecnologia',value:1e6,emp:20,yrs:1}; seitaFundar('igreja','T'); m.royal={house:'Teste',pop:50}; grpAuto(); sweepNow('outros');
    if(!WHO.clube()&&!WHO.func()) errs['membros: grupos não se formaram']=1; });
  T('conquistas',()=>{ for(let k=0;k<6;k++){ newLife({}); const m=S.me; m.age=R.int(1,90); CONQ.forEach(c=>{ try{ c.ok(m,{dead:k%2}); }catch(e){ errs['conquista quebrada: '+c.id+': '+e.message]=1; } }); }
    V.conquistas().items.map(rowHtml).join(''); if(new Set(CONQ.map(c=>c.id)).size!==CONQ.length) errs['conquista com id repetido']=1;
    newLife({}); const m=S.me; m.age=25; const p=mkPerson({rel:'namoro',age:25,gender:m.gender==='F'?'M':'F',bond:70}); S.people.push(p); for(let i=0;i<3;i++){ m.yr={}; p.yr={}; const r=interact(p,'amor',i%2===0); if(typeof r!=='string'||/undefined/.test(r)) errs['fazer amor: '+r]=1; }
    m.age=16; const q=mkPerson({rel:'namoro',age:16,bond:70}); S.people.push(q); interact(q,'amor',false); if(S.births.some(b=>b.with===q.id)) errs['fazer amor liberado para menor']=1; if(V.person(q).items.some(x=>x.l==='Fazer amor')) errs['opção de fazer amor para menor']=1;
    newLife({}); S.me.age=70; m.c.gaveUp=1; computeRibbon(); });
  T('varreNovos',()=>{ const base=()=>{ newLife({}); const m=S.me; m.age=32; m.alive=true; m.prison=null; m.money=5e5; if(!m.edu.deg.includes('medio')) m.edu.deg.push('medio'); return m; };
    let m=base(); seitaFundar('igreja','Teste'); m.seita.fieis=8; m.seita.devo=30; sweepNow('seitaPeq'); m.seita.fieis=900; sweepNow('seitaMed'); m.seita.fieis=6000; m.seita.dom=['o bairro']; m.seita.tipo='apoc'; sweepNow('seitaGde');
    ['natureza','guru','igreja'].forEach(t=>{ m.seita.tipo=t; sweepNow('seita'+t); });
    m=base(); seitaEntrar(); sweepNow('membro'); m.seita.cargo=4; sweepNow('membroAlto');
    m=base(); [0,3,4].forEach(l=>{ takeJob({id:'poli',co:'Polícia Civil',size:'grande',mul:1}); m.job.lvl=l; sweepNow('pol'+l); });
    m=base(); revStart('Frente Teste'); Object.assign(m.rev,{apoio:50,armas:40,membros:3000}); sweepNow('rev');
    m=base(); m.office={id:'pres',yrs:1,appr:70,dit:1}; m.c.golpe=1; sweepNow('dit'); m.office.appr=20; sweepNow('ditFraco');
    m=base(); m.c.golpe=1; sweepNow('exilio'); m.prison={left:5,total:5,behav:50,crime:'golpe'}; sweepNow('presoPol');
    m=base(); m.para={prova:3,vistos:{},visitas:4}; sweepNow('para'); m.criatura='vampiro'; sweepNow('vamp'); m.criatura='lobisomem'; sweepNow('lobo'); });
  T('seita',()=>{ for(let k=0;k<6;k++){ newLife({}); const m=S.me; m.age=30; m.alive=true; m.prison=null; m.money=5e5; seitaFundar(R.pick(Object.keys(SEITA_TIPOS)),'Teste'); if(!m.seita) errs['seita: não fundou']=1;
      for(let y=0;y<8&&m.alive&&m.seita;y++){ ['pregar','culto','dizimo','tv','templo','sacar','ritual','comunidade','profecia','caridade'].forEach(a=>{ if(m.seita&&!m.prison) seitaAcao(a); }); m.yr={}; S.pending=[]; seitaAno(); S.pending.forEach(e=>{ const ev=EVENTS[e.id]; const sh=ev.show(e.d); ev.pick(R.pick(sh.ch)[1],e.d); }); S.pending=[]; if(m.seita) V.seita().items.map(rowHtml).join(''); } } });
  T('policia',()=>{ let ok=0, n=0; for(let k=0;k<30;k++){ newLife({}); const m=S.me; m.age=25; m.alive=true; m.prison=null; m.rec.conv=0; if(!m.edu.deg.includes('medio')) m.edu.deg.push('medio'); m.smarts=90; m.health=90; m.yr={}; policeExam(); if(!isCop()) continue; n++;
      const c=novoCaso(); if(c.sus.filter(x=>x.culp).length!==1) errs['caso sem culpado único']=1; V.caso(c)().items.map(rowHtml).join(''); casoPasso(c,'per',0); casoPasso(c,'cam',0); casoPasso(c,'int',0); casoPasso(c,'rev',1); casoPasso(c,'per',0);
      // dedução: quem tem as pistas da perícia e não foi descartado
      const cand=c.sus.map((s,i)=>[s,i]).filter(([s,i])=>!c.achou['fora'+i]&&c.notas.every(t=>s.tr.includes(t))); const pick=(cand.find(([s,i])=>c.achou['prova'+i])||cand[0]||[null,0])[1]; casoAcusar(c,pick); if(c.sus[pick].culp) ok++; }
    if(n<5) errs['polícia: quase ninguém passa no concurso ('+n+')']=1; if(n&&ok/n<.5) errs['polícia: dedução não funciona ('+ok+'/'+n+')']=1; });
  T('golpe',()=>{ let win=0; for(let k=0;k<20;k++){ newLife({}); const m=S.me; m.age=35; m.alive=true; m.prison=null; m.money=1e6; revStart('Teste'); for(let y=0;y<3&&m.rev;y++){ ['panfleto','protesto','armas','general','hacker'].forEach(a=>{ if(m.rev&&m.alive) revAcao(a); }); m.yr={}; } if(m.rev&&m.alive){ V.rev().items.map(rowHtml).join(''); revGolpe(); if(m.office&&m.office.dit){ win++; if(!/Líder/.test(occupation())) errs['golpe: ocupação errada']=1; } } } if(!win) errs['golpe: nunca dá certo']=1; });
  T('paranormal',()=>{ let vamp=0,lobo=0,mortos=0; for(let k=0;k<40;k++){ newLife({}); const m=S.me; m.age=25; m.alive=true; m.prison=null; for(let i=0;i<20&&m.alive;i++){ m.yr={}; paraVisita(R.pick(PARA_LUGARES)[0]); } if(!m.alive) mortos++; if(m.criatura==='vampiro') vamp++; if(m.criatura==='lobisomem') lobo++;
      if(m.alive&&m.criatura){ const f=faceSVG(m,60); if(!f.includes('<svg')) errs['criatura sem rosto']=1; for(let y=0;y<3&&m.alive;y++){ S.pending=[]; ageUp(); S.pending.slice().forEach(e=>{ const ev=EVENTS[e.id]; if(!evValid(e)) return; const sh=ev.show(e.d); ev.pick(R.pick(sh.ch)[1],e.d); }); S.pending=[]; } } }
    if(!vamp||!lobo) errs['paranormal: ninguém virou criatura ('+vamp+'/'+lobo+')']=1; if(!mortos) errs['paranormal: ninguém morre']=1; });
  T('desistir',()=>{ for(let k=0;k<10;k++){ newLife({}); const m=S.me; m.age=R.int(5,80); S.people.filter(p=>p.alive).forEach(p=>{ const t=giveUpReaction(p); if(!t||/undefined|\{/.test(t)) errs['desistir: reação ruim '+p.rel]=1; }); } });
  // romance nos modos: namoro, parto de verdade e volta para a vida real com o par e o filho
  T('romance',()=>{ for(const id of ['zumbi','ilha','isekai','marte']){ newLife({}); const m=S.me; m.age=25; m.gender='F'; m.pref='M'; m.alive=true; S.pending=[]; scStart(id); if(id==='isekai') S.scen.cls='mago'; UI.close();
      const c=mkCrew({gender:'M',age:27}); c.am=90; romStart(c); if(!romPar()) errs['romance: sem par em '+id]=1; c.par='casado'; let tries=0; while(!S.scen.grav&&tries++<40) romGrav(c); if(!S.scen.grav){ errs['romance: sem gravidez '+id]=1; continue; }
      const n0=crew().length; S.pending=[]; EVENTS.rom_parto.pick('g',{cid:c.id}); if(crew().length!==n0+1||!crew().some(x=>x.filho)) errs['romance: parto não criou bebê '+id]=1;
      const k0=kids().length; scenEnd(true,'teste'); if(!partner()||partner().first!==c.first) errs['romance: par não voltou '+id]=1; if(kids().length!==k0+1) errs['romance: filho não voltou '+id]=1; } });
  // herói: equipe conta como emprego, lei, prisão de contenção, ataque à família e anos passando
  T('heroiVida',()=>{ for(let k=0;k<6;k++){ newLife({}); const m=S.me; m.age=24; m.alive=true; m.prison=null; S.pending=[]; scStart('heroi'); const sc=S.scen; hEnsure(sc); sc.rep=70;
      const a0=m.age; m.job={hero:'liga',lvl:0,perf:60,yrs:0,co:HTEAMS.liga.n}; if(!/Liga/.test(occupation())) errs['herói: equipe não aparece como ocupação']=1; if(jobSalary(m.job)<=0) errs['herói: salário zero']=1;
      const $0=m.money; S.pending=[]; scNextDay(); if(!S.scen) continue; if(m.age!==a0+1) errs['herói: ano não passou']=1; if(m.money<=$0-1&&m.job) errs['herói: salário não caiu']=1;
      EVENTS.h_lei.pick('n'); if(sc.reg!=='nao') errs['herói: recusa não virou crime']=1; if(m.job) errs['herói: equipe que segue a lei não expulsou']=1;
      const y0=m.age; EVENTS.h_cerco.pick('r'); if(!S.scen) errs['herói: prisão encerrou o modo']=1; else if(m.age<=y0||sc.reg!=='sim') errs['herói: prisão de contenção não passou anos']=1;
      if(!m.alive) continue; const fam=famAll()[0]; if(fam){ hRevela(sc,'teste'); S.pending=[]; const d={pid:fam.id,tp:'sequestro'}; const sh=EVENTS.h_familia.show(d); const r=EVENTS.h_familia.pick('s',d); if(typeof r!=='string') errs['herói: ataque à família sem texto']=1; }
      for(let y=0;y<5&&S.scen&&m.alive;y++){ S.pending=[]; scNextDay(); } if(S.scen){ SCEN.heroi.acts.aposentar.fn(S.scen); if(S.scen) errs['herói: aposentar não encerrou']=1; if(m.job&&m.job.hero) errs['herói: emprego de herói ficou depois de aposentar']=1; } } });
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
  // regressão: IDs de eventos estáveis e saves antigos
  const chkReg=(nome,ok)=>{ if(!ok){ const k='regressão: '+nome; errs[k]=(errs[k]||0)+1; } };
  chkReg('IDs sequenciais antigos ainda existem',!Object.keys(EVENTS).some(k=>/^p\d+$/.test(k)));
  { const snap=JSON.stringify(S), real=Object.keys(EVENTS).find(k=>k.startsWith('p_'));
    S.pending=[{id:'p123',d:{}},{id:real,d:{}},{id:'p_naoexiste',d:{}}]; S.me.ev={p5:30,[real]:20}; S.me.c.ev_p9=1;
    fixSave(S); chkReg('fixSave não limpou a fila',S.pending.length===1&&S.pending[0].id===real); chkReg('fixSave não limpou os contadores',!('p5' in S.me.ev)&&(real in S.me.ev)&&!S.me.c.ev_p9);
    S=JSON.parse(snap); }
  // cadeias de eventos: estrutura e cada escolha de cada etapa
  { const au=cadAudit(); au.errs.forEach(e=>{ const k='cadeia: '+e; errs[k]=(errs[k]||0)+1; }); lives.unshift(`HISTÓRIAS EM CADEIA: ${au.chains} histórias, ${au.steps} etapas`);
    const snap=JSON.stringify(S);
    for(const [id,ch] of Object.entries(CHAINS)){ for(const sid of Object.keys(ch.steps)){ const nch=ch.steps[sid][2].length;
      for(let ci=0;ci<nch;ci++){ T('cad:'+id+'.'+sid,()=>{ newLife({}); const m=S.me; m.age=Math.max(ch.o.min||18,Math.min(ch.o.max||40,30)); m.alive=true; m.prison=ch.o.jail?{left:3,total:3,behav:50}:null;
          if(ch.o.who==='partner'||ch.o.who==='spouse'){ const pp=mkPerson({rel:'conjuge',gender:m.gender==='M'?'F':'M',age:m.age}); S.people.push(pp); }
          if(['friend','colega','boss','classmate','kid','child','teen','adultkid','ex','sib','parent','pet','grandkid'].includes(ch.o.who)&&!WHO[ch.o.who]()){ const rel={friend:'amigo',colega:'colegaT',boss:'chefe',classmate:'colega',kid:'filho',child:'filho',teen:'filho',adultkid:'filho',ex:'ex',sib:'irmao',parent:'mae',pet:'pet',grandkid:'neto'}[ch.o.who];
            const ag={child:8,teen:15,adultkid:25,kid:10,grandkid:4}[ch.o.who]; S.people.push(mkPerson({rel,age:ag||m.age,gender:R.chance(.5)?'M':'F'})); }
          if(ch.o.who==='kidpara'&&!WHO.kidpara()){ const kk=mkPerson({rel:'filho',age:12}); kk.criatura='vampiro'; S.people.push(kk); }
          if(ch.o.when&&/criatura/.test(String(ch.o.when))) m.criatura=/lobisomem/.test(String(ch.o.when))?'lobisomem':'vampiro';
          if(!cadStart(id,true)) return; const c=cadState().on[id]; c.s=sid; c.due=m.age; const ev=EVENTS[cadEv(id,sid)]; const d=ev.prep(m); const sh=ev.show(d); const r=ev.pick(String(ci),d);
          [sh.t,sh.x,sh.ch[ci][0],r].forEach(x=>{ if(/\{\w+\}|undefined|NaN/.test(String(x))){ const k=`texto quebrado em cad:${id}.${sid}: ${String(x).slice(0,90)}`; errs[k]=(errs[k]||0)+1; } }); }); } } }
    S=JSON.parse(snap); }
  { const K='nlteste.save'; const ok=JSON.stringify({me:{first:'X'},people:[]}); try{ localStorage.setItem(K,'{"me":{"first":"X"'); localStorage.setItem(K+'.bak',ok); }catch(e){}
    const r=(()=>{ const s0=localStorage.getItem(K); if(s0&&saveOk(SAVE_KEY,s0)) return 'principal'; const b=localStorage.getItem(K+'.bak'); return b&&saveOk(SAVE_KEY,b)?'bak':null; })();
    chkReg('save estragado não cai na cópia',r==='bak'); chkReg('save bom reprovado',saveOk(SAVE_KEY,ok)); try{ localStorage.removeItem(K); localStorage.removeItem(K+'.bak'); }catch(e){} }
  const calm=[];
  for(let L=0;L<60;L++){ T('calmLife',()=>newLife({})); let g=0; while(S.me.alive&&g++<130){ T('ageUp',ageUp); while(S.pending.length){ const e=S.pending.shift(); if(!evValid(e)) continue; T('ev',()=>{ const sh=EVENTS[e.id].show(e.d); EVENTS[e.id].pick(sh.ch[sh.ch.length-1][1],e.d); }); } if(S.me.alive&&S.me.age%3===0) T('calmDoc',()=>{ S.me.dis.forEach(d=>treat('hosp',d)); body('walk'); }); if(S.me.alive&&S.me.health<=0) die(causeFromHealth()); } calm.push(S.me.age); }
  lives.unshift(`VIDA CALMA (só envelhecer + médico): média ${(calm.reduce((a,b)=>a+b,0)/calm.length).toFixed(1)} · acima de 70: ${Math.round(calm.filter(a=>a>=70).length/calm.length*100)}% · acima de 90: ${Math.round(calm.filter(a=>a>=90).length/calm.length*100)}%`);
  const ages=lives.filter(l=>!l.startsWith(' ')).map(l=>+(l.match(/· (\d+)a ·/)||[0,0])[1]);
  lives.unshift(`IDADE MÉDIA: ${(ages.reduce((a,b)=>a+b,0)/ages.length).toFixed(1)} · acima de 70: ${Math.round(ages.filter(a=>a>=70).length/ages.length*100)}% · abaixo de 30: ${Math.round(ages.filter(a=>a<30).length/ages.length*100)}%`);
  const o=document.createElement('pre'); o.id='out'; o.style.cssText='position:fixed;inset:0;z-index:999;background:#fff;color:#000;overflow:auto;padding:10px;font-size:11px;white-space:pre-wrap';
  o.textContent=`SEMENTE: 20261017\nNOMES: ${Object.entries(NAME_DB).map(([c,d])=>c+' '+d.M.length+'/'+d.F.length+'/'+d.L.length).join(' · ')}\nEVENTOS: ${Object.keys(EVENTS).length} · TESTE: ${lives.length} vidas, ${years} anos, ${events} eventos, ${actions} ações, ${swept} eventos varridos\nERROS: ${Object.keys(errs).filter(k=>!k.endsWith(' @')).length}\n`+Object.entries(errs).map(([k,v])=>k.endsWith(' @')?'    '+v:`${v}x ${k}`).join('\n')+'\n\n'+lives.join('\n');
  document.body.appendChild(o); R.f=originalRandom; const nErr=Object.keys(errs).filter(k=>!k.endsWith(' @')).length; o.dataset.erros=nErr; document.title=nErr?'TESTE FALHOU':'TESTE OK'; if(window.nlTestNotify)window.nlTestNotify(JSON.stringify({done:true,errors:nErr,text:o.textContent,economia:window.NL_ECON_DIAG,playtests:window.NL_PLAYTESTS,continuidade:{decadas:window.NL_NPC_DECADAS,compatibilidade:window.NL_CONT_COMPAT,geracoes:window.NL_TRES_GERACOES}}));
}

// ===== Diagnóstico das aventuras (#aventura): um jogador razoável joga cada modo 40 vezes =====
function advDiag(){ const out=[];
  const play=sc=>{ const d=SCEN[sc.id];
    const useCat=(cat,cond)=>{ if(!S.scen||!cond()) return; const x=sc.inv.filter(i=>itCat(i.id)===cat).sort((a,b)=>a.hp-b.hp)[0]; if(x) scUse(x); };
    useCat('comida',()=>sc.fome>55); useCat('agua',()=>sc.sede>55); useCat('remedio',()=>sc.hl<55); useCat('o2',()=>sc.o2<40); useCat('san',()=>sc.san<50); useCat('mana',()=>sc.mana<30);
    if(!S.scen) return;
    const w=sc.inv.filter(i=>itCat(i.id)==='arma').sort((a,b)=>itV(b.id)-itV(a.id))[0]; if(w&&(!sc.arma||itV(w.id)>itV(sc.arma.id))){ sc.inv=sc.inv.filter(i=>i!==w); if(sc.arma) addItem(sc.arma.id,sc.arma.hp,true); sc.arma=w; }
    crew().forEach(c=>{ if(!c.arma){ const w2=sc.inv.find(i=>itCat(i.id)==='arma'); if(w2){ sc.inv=sc.inv.filter(i=>i!==w2); c.arma=w2; } } });
    if(sc.id==='isekai'){ iskEnsure(sc); while(sc.pts>0){ sc.pts--; sc.at[R.pick(['for','for','vit','agi','mag'])]++; } sc.sp.forEach(id=>{ if(!sc.done['sp_'+id]&&sc.mana>=spCost(sc,id)&&['atq','atq2','atq3','def','cura','aliado'].includes(SPELLS[id][4])) castSpell(id); }); sc.travel=sc.lvl>=2+sc.rota*1.5?1:0; }
    if(sc.id==='zumbi'){ zEnsure(sc); while(sc.zpts>0){ sc.zpts--; sc.zat[R.pick(['for','for','fur','med','mec','mir'])]++; }
      const sc2=k=>{ if(sc.ap>0&&!sc.done['zs_'+k]){ sc.ap--; sc.done['zs_'+k]=1; zScav(k); } };
      if(sc.sede>40||countCat('agua')<2) sc2('agua'); if(sc.fome>40||countCat('comida')<3) sc2('comida'); if(sc.hl<60) sc2('remedio'); if(!S.scen) return;
      if(!sc.zb&&sc.dia>=5) zFoundBase('Base');
      if(sc.zb){ const b=sc.zb; ['agua','comida'].forEach(k=>{ if(b[k==='agua'?'agua':'com']<8) sc2(k); }); sc2('mat');
        for(const k of ['horta','poco','muro','alojamento','enfermaria','armadilhas','torre','oficina','cozinha','deposito']){ const c=ZB[k][2]*(b.b[k]+1); if(b.b[k]<ZB[k][4]&&sc.zmat>=c&&sc.ap>0&&!sc.done['zb_'+k]){ sc.ap--; sc.done['zb_'+k]=1; sc.zmat-=c; b.b[k]++; break; } }
        b.racao=b.com<10?0:1; if(sc.ap>=2&&!sc.done.zexp&&sc.hl>60){ sc.ap-=2; sc.done.zexp=1; zExpedition(R.pick(['mercado','ferragens','farmacia','posto','bairro'])); } }
      for(const r of ZRECIPES){ if(sc.done['zc_'+r[0]]) continue; if(sc.zmat>=r[3]+4&&r[5]<=zBaseLv(sc,'oficina')&&r[4].every(i=>sc.inv.some(x=>x.id===i))&&['curativo','roupa','aguaf','armadura','tacop','lancaf','kit','muni'].includes(r[0])){ sc.done['zc_'+r[0]]=1; zCraft(r); } }
      if(!S.scen) return; }
    const pri=(sc.hl<45||sc.san<35)?['descanso','acampar','meditar','fogueira','falar','terra','festa','exerc']:null;
    let g=0; while(S.scen&&sc.ap>0&&g++<8){
      if(pri){ const k=pri.find(k=>d.acts[k]&&!sc.done[k]&&!(d.acts[k].min&&!d.acts[k].min(sc))); if(k){ sc.ap-=d.acts[k].ap??1; sc.done[k]=1; d.acts[k].fn(sc,S.me); continue; } }
      const p=sc.loc.pois.find(p=>!p.done&&!(sc.id==='isekai'&&ISK_POI[p.k]&&ISK_POI[p.k][4]==='rei'&&sc.lvl<12)); if(p&&R.chance(.6)){ sc.ap--; p.done=1; d.poi(sc,p); continue; }
      const ks=Object.keys(d.acts).filter(k=>!['aposentar','roubar','portal'].includes(k)&&!sc.done[k]&&!(d.acts[k].min&&!d.acts[k].min(sc))&&sc.ap>=(d.acts[k].ap??1)); if(!ks.length) break; const k=R.pick(ks); sc.ap-=d.acts[k].ap??1; sc.done[k]=1; d.acts[k].fn(sc,S.me); }
    if(S.scen&&sc.id==='zumbi') sc.stay=countCat('gas')<sc.veh.length&&R.chance(.5)?1:0; };
  for(const id of Object.keys(SCEN)){ let win=0,days=0,hl=0,san=0,other=0; const snaps=[];
    for(let k=0;k<40;k++){ newLife({}); const m=S.me; m.age=25; m.alive=true; m.prison=null; m.fight=40; S.pending=[]; MQ.length=0; scStart(id); if(id==='isekai'){ S.scen.cls=R.pick(Object.keys(CLASSES)); UI.close(); }
      const w0=m.c.scenWin||0; let g=0, last=null;
      while(S.scen&&g++<(id==="isekai"?160:id==="zumbi"?300:id==="heroi"?110:90)){ const sc=S.scen; last={hl:sc.hl,san:sc.san,fome:sc.fome,dia:sc.dia}; play(sc); scCheck(); if(!S.scen) break; scNextDay(); let e=0; while(S.scen&&S.pending.length&&e++<10){ const p=S.pending.shift(); const ev=EVENTS[p.id]; if(!evValid(p)) continue; const sh=ev.show(p.d); ev.pick(R.pick(sh.ch)[1],p.d); scCheck(); } if(S.scen&&sc.dia===8) snaps.push(`hl${Math.round(sc.hl)} san${Math.round(sc.san)} f${Math.round(sc.fome)}${sc.o2!=null?' o2'+Math.round(sc.o2):''}${sc.lvl?' lv'+sc.lvl:''}`); }
      if(id==='heroi'&&!S.scen){ const why=!m.alive?String(m.cause).replace(/\d+/g,'#'):m.prison?'preso':'saiu vivo'; (advDiag.why=advDiag.why||{})[why]=(advDiag.why[why]||0)+1; }
      if(S.scen){ S.scen=null; other++; } days+=last?last.dia:0; if((m.c.scenWin||0)>w0) win++; else if(last&&last.hl<=last.san) hl++; else san++; }
    if(id==='heroi'&&advDiag.why) out.push('herói, fins: '+Object.entries(advDiag.why).sort((a,b)=>b[1]-a[1]).map(([k,v])=>v+'× '+k).join(' · '));
    out.push(`${id}: vitórias ${win}/40 · média ${(days/40).toFixed(1)} dias · derrotas por saúde ${hl}, por sanidade ${san}, sem fim ${other}\n   dia 8: ${snaps.slice(0,6).join(' | ')}`); }
  const o=document.createElement('pre'); o.id='out'; o.textContent=out.join('\n'); o.style.cssText='position:fixed;inset:0;z-index:999;background:#fff;color:#000;overflow:auto;padding:10px;font-size:11px;white-space:pre-wrap'; document.body.appendChild(o); document.title='AVENTURA OK'; }
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

// Regressão curta: consentimento unânime, novas rodadas e persistência.
function polySelfTest(){
  const antigo=S,chance=R.chance,noSave=window.NO_SAVE; window.NO_SAVE=true;
  const ok=(v,t)=>{ if(!v) throw Error(t); };
  try{
    newLife({});S.me.age=30;S.me.money=1000000;S.me.pref='A';S.scen=null;
    let a=mkPerson({rel:'noivo',age:30,bond:90}),b=mkPerson({rel:'amigo',age:29,bond:90});S.people.push(a,b);
    R.chance=()=>true;interact(a,'casar',[800,false]);ok(a.rel==='conjuge','primeiro casamento');
    R.chance=()=>false;polyPropor(a);R.chance=()=>true;polyPropor(a);interact(b,'flertar');ok(b.rel==='amigo','recusa deve impedir namoro e insistência');
    S.year++;polyPropor(a);ok(polyUnanime(),'primeira autorização');
    R.chance=()=>false;interact(b,'flertar');ok(b.rel==='amigo','nova pessoa pode recusar');R.chance=()=>true;interact(b,'flertar');ok(b.rel==='amigo','recusa da nova pessoa deve persistir');
    S.year++;const amorA=a.bond,traicoes=S.me.c.cheats||0;interact(b,'flertar');ok(b.rel==='namoro'&&polyGrupo(),'segundo namoro consentido');ok(a.bond===amorA&&(S.me.c.cheats||0)===traicoes,'acordo não é traição');
    interact(b,'pedido',[500]);interact(b,'casar',[800,false]);ok(people('conjuge').length===2,'segundo casamento');ok(!polyUnanime(),'autorização deve ser consumida');
    const c=candidate(false);c.age=30;ok(!askOut(c).ok,'terceira pessoa sem nova rodada');polyPropor(a);ok(!polyUnanime(),'um sim não basta');
    R.chance=()=>false;polyPropor(b);R.chance=()=>true;ok(!askOut(c).ok,'uma recusa bloqueia terceira pessoa');
    S=JSON.parse(JSON.stringify(S));a=P(a.id);b=P(b.id);ok(polyRodada().votos[b.id]===false,'recusa perdida no save');
    S.year++;polyPropor(b);ok(polyUnanime(),'dois consentimentos');ok(askOut(c).ok&&polyAmores().length===3,'terceiro namoro');
    interact(c,'pedido',[500]);interact(c,'casar',[800,false]);ok(people('conjuge').length===3,'terceiro casamento');
    polyPropor(a);polyPropor(b);ok(!polyUnanime(),'terceiro parceiro também precisa aceitar');polyPropor(c);ok(polyUnanime(),'três consentimentos');
    divorce(b,false);ok(!polyUnanime()&&polyAmores().length===2&&polyGrupo(),'divórcio invalida rodada e preserva acordos restantes');
    ok(polyChance({id:1,bond:80,polyPerfil:{abertura:100,ciume:0}})>polyChance({id:2,bond:80,polyPerfil:{abertura:0,ciume:100}}),'personalidade não influencia');
    V.poly().items.map(rowHtml);V.person(a).items.map(rowHtml);
    return 'PASSOU: recusa, personalidade, save, 2 e 3 casamentos, unanimidade renovada, sem punição de traição e divórcio.';
  }finally{ S=antigo;R.chance=chance;window.NO_SAVE=noSave; }
}
function familySelfTest(){
 const before=S,meta=JSON.stringify(META),snaps=SNAPS,chance=R.chance,noSave=window.NO_SAVE;window.NO_SAVE=true;
 const ok=(v,t)=>{if(!v)throw Error(t)};
 try{polySelfTest();newLife({});S.me.age=30;R.chance=()=>false;
 const a=mkPerson({rel:'conjuge',age:30}),b=mkPerson({rel:'conjuge',age:30});S.people.push(a,b);a.polyCom=[b.id];b.polyCom=[a.id];
 S.births.push({with:b.id});S=JSON.parse(JSON.stringify(S));fixSave(S);yearPeople();let k=kids()[0];ok(k&&k.parentId===b.id,'filiação após salvar');
 relPausar(P(a.id));ok(polyGrupo()&&!polyUnanime(),'pausa preserva acordo');divorce(P(a.id),false);ok(partners().length===1&&P(b.id).rel==='conjuge','divórcio individual');
 S.me.money=100000;S.me.alive=false;k.age=20;continueAs(k);ok(S.me.money===85000,'herança');ok(P(b.id)&&['mae','pai'].includes(P(b.id).rel),'outro responsável na nova geração');
 newLife({});const p=mkPerson({rel:'conjuge',age:30});S.people.push(p);delete p.polyCom;delete p.polyPerfil;delete S.me.polyRodada;S=JSON.parse(JSON.stringify(S));fixSave(S);ok(partners().length===1&&polyGrupo(),'save anterior aos acordos');ok(Number.isFinite(polyPerfil(P(p.id)).ciume),'perfil antigo');
 return 'PASSOU: casamentos, divórcio, filiação, herança e save antigo';
 }finally{S=before;META=JSON.parse(meta);SNAPS=snaps;R.chance=chance;window.NO_SAVE=noSave;}
}
// Regressão curta entre política, religião, crime, poligamia e gerações.
function publicSystemsSelfTest(){const before=S,meta=JSON.stringify(META),snaps=SNAPS,chance=R.chance,noSave=window.NO_SAVE;window.NO_SAVE=true;const ok=(v,t)=>{if(!v)throw Error(t)};try{
 newLife({});S.me.age=45;S.me.money=1e6;S.me.office={id:'pres',yrs:0,appr:70};seitaFundar('igreja','Grupo de regressão');seita().caixa=100000;
 const a=mkPerson({rel:'conjuge',age:35,bond:90}),b=mkPerson({rel:'conjuge',age:36,bond:90});S.people.push(a,b);a.polyCom=[b.id];b.polyCom=[a.id];for(const p of [a,b])p.personalidade={ambicao:20,lealdade:90,ciume:10,interesse:'livros'};
 seitaAcao('sacar');let c=justica().casos[0];ok(c&&c.fonte==='culto','origem do desvio');justicaAbrir(c);ok(S.me.office&&S.me.office.appr<70,'presidente investigado');ok(partners().length===2&&polyGrupo(),'acordos durante escândalo');
 S=JSON.parse(JSON.stringify(S));fixSave(S);c=justica().casos[0];ok(c.retido>0&&seita()&&partners().length===2,'save dos sistemas combinados');
 R.chance=()=>false;c.etapa='julgamento';trial('p',{c:c.crime,min:2,max:2,justicaId:c.id,evid:true});ok(S.me.prison&&!S.me.office,'prisão encerra mandato');ok(c.etapa==='condenado'&&c.retido===0&&c.confiscado>0,'julgamento e ressarcimento');
 const k=mkPerson({rel:'filho',age:20,parentId:b.id,bond:80});S.people.push(k);const saldo=S.me.money;die('de teste de regressão');continueAs(k);ok(!S.me.prison&&!S.me.office,'filho não herda prisão nem mandato');ok(S.me.money===Math.max(0,Math.round(saldo*.85)),'herança sem duplicar bloqueio');ok(P(b.id)&&['mae','pai'].includes(P(b.id).rel),'parentesco após prisão e morte');ok(S.jornal&&S.jornal.itens.length,'histórico público entre gerações');ok(Number.isFinite(S.me.money),'saldo íntegro');
 return 'PASSOU: presidente + culto + crime, dois casamentos, save, prisão, morte e herança';
 }finally{S=before;META=JSON.parse(meta);SNAPS=snaps;R.chance=chance;window.NO_SAVE=noSave;}}
function idadeAnimaisSelfTest(){const before=S,meta=JSON.stringify(META),snaps=SNAPS,noSave=window.NO_SAVE,chance=R.chance;window.NO_SAVE=true;const ok=(v,t)=>{if(!v)throw Error(t)};try{newLife({});const p=parents()[0];for(const a of [0,11]){S.me.age=a;ok(!V.person(p).items.some(x=>x.l==='Falar sobre política'),'política na interface');const antes=JSON.stringify(S);interact(p,'politica');ok(JSON.stringify(S)===antes,'política alterou estado infantil');}S.me.age=12;ok(V.person(p).items.some(x=>x.l==='Falar sobre política'),'política ausente aos 12');interact(p,'politica');for(const a of [0,3,4,11,12,17]){S.me.age=a;S.me.yr={};const texto=tempoTodos();ok(!/Fiz um churrasco|Organizei|Alugamos/.test(texto),'organização incompatível com a idade');}
 const a=addPet('Cachorro','Rex'),b=addPet('Cachorro','Toby');dslApply('petdie',{pid:a.id});ok(!a.alive&&a.morte&&b.alive,'alvo do falecimento');const idade=a.age,h=S.me.happy;dslApply('petdie',{pid:a.id});ok(S.me.happy===h,'falecimento repetido');R.chance=()=>false;yearPeople();ok(a.age===idade,'animal morto envelheceu');const antes=JSON.stringify(a);interact(a,'vet');ok(JSON.stringify(a)===antes,'ação em animal morto');S=JSON.parse(JSON.stringify(S));fixSave(S);ok(!P(a.id).alive&&V.person(P(a.id)),'histórico e save');return 'PASSOU: política 0/11/12, encontros por idade e estado persistente dos animais';
 }finally{S=before;META=JSON.parse(meta);SNAPS=snaps;window.NO_SAVE=noSave;R.chance=chance;}}

function leituraSelfTest(){
 const before=S,meta=JSON.stringify(META),snaps=SNAPS,noSave=window.NO_SAVE;
 window.NO_SAVE=true;const ok=(v,t)=>{if(!v)throw Error(t);},result=[];
 try{
  for(const inicial of [20,50,80,95]){
   newLife({});S.me.smarts=inicial;
   for(let idade=4;idade<=18;idade++){
    S.me.age=idade;S.year++;S.me.yr={};const antes=S.me.smarts;
    for(let i=0;i<6;i++)body('lib',livrosFaixa().titulos[i]);
    ok(S.me.smarts-antes<=2,'mais de dois pontos por ano lendo');
    const load=S.me.yr.load,n=S.me.c.books;body('lib');prisonAct('ler');
    ok(S.me.smarts-antes<=2&&S.me.c.books===n&&S.me.yr.load===load,'limite burlado pela prisão');
    S=JSON.parse(JSON.stringify(S));ok(leituraAno().titulos.length===6,'save perdeu leituras anuais');
   }
   ok(S.me.smarts-inicial<=30,'leitura de infância elevou demais a inteligência');
   if(inicial===50)ok(S.me.smarts<=80,'leitura isolada chegou perto do máximo cedo demais');
   result.push({inicial,aos18:S.me.smarts});
  }
  newLife({});S.me.age=30;S.me.smarts=90;
  for(let i=0;i<6;i++)lerLivro(livrosFaixa().titulos[i]);ok(S.me.smarts===90,'leitura avançada sem esforço acumulado');
  S=JSON.parse(JSON.stringify(S));S.year++;for(let i=0;i<6;i++)lerLivro(livrosFaixa().titulos[i]);
  ok(S.me.smarts===91,'progresso entre anos ou saves não preservado');
  return result;
 }finally{S=before;META=JSON.parse(meta);SNAPS=snaps;window.NO_SAVE=noSave;}
}
