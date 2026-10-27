// ===== 2.20: família coerente e eventos que cumprem o que dizem =====
// Antes, a separação dos pais era só uma marcação: as brigas na cozinha e o irmão novo continuavam, e o novo par
// do pai ou da mãe entrava como "conhecido" escondido. Agora existe uma fonte só para "meus pais estão juntos",
// a guarda é decidida, madrasta e padrasto aparecem nas Relações e o filho deles vira meio-irmão.
// Também ganham efeito real os textos de mudança de cidade, troca de empresa, carro e casa herdada.

function paisJuntos(){ const mae=people('mae')[0], pai=people('pai')[0]; if(!mae||!pai||S.flags.divorced) return false;
  return !mae.vida||!mae.vida.par||mae.vida.par===pai.id; }
function paisSeparar(){ const mae=people('mae')[0], pai=people('pai')[0]; if(!mae||!pai) return;
  S.flags.divorced=1; if(mae.vida&&mae.vida.par===pai.id) mae.vida.par=null; if(pai.vida&&pai.vida.par===mae.id) pai.vida.par=null;
  if(S.me&&S.me.alive&&S.me.age<18&&!S.flags.guarda&&!S.pending.some(e=>e.id==='guarda_pais')) S.pending.push({id:'guarda_pais',d:{}}); }
const madrastaDe=q=>q.gender==='F'?'madrasta':'padrasto';
const paiOuMae=p=>p.rel==='mae'?'minha mãe':'meu pai';

// sincroniza o que o sistema de pessoas decidiu sozinho com a família que o jogador vê
function familiaSync(){ const m=S.me; if(!m||!m.alive||S.scen) return;
  const mae=people('mae')[0], pai=people('pai')[0];
  if(mae&&pai&&!S.flags.divorced&&mae.vida&&mae.vida.par!==pai.id){ paisSeparar(); log('Meus pais se separaram.','bad'); st('happy',m.age<18?-10:-3); }
  for(const p of [mae,pai].filter(Boolean)){ const q=p.vida&&p.vida.par&&P(p.vida.par);
    if(q&&q.alive&&q.id!==(p===mae?pai:mae)?.id&&q.id!==m.id&&['conhecido'].includes(q.rel)){
      q.rel='padrasto'; q.bond=R.int(30,60); q.padDe=p.id; npcVida(q);
      log(`${p.first} está com ${fullName(q)}. Agora tenho ${q.gender==='F'?'uma madrasta':'um padrasto'}.`,'');
      if(m.age<18) S.pending.push({id:'fam_padrasto_chega',d:{pid:q.id}}); } }
  for(const q of people('padrasto')){ const p=P(q.padDe); if(!p||!p.alive||!p.vida||p.vida.par!==q.id){ q.rel='conhecido'; q.exPadrasto=1; } }
  const ids=[mae,pai].filter(Boolean).map(p=>p.id);
  for(const k of people('irmao')) if(!k.meio&&k.parentIds&&k.parentIds.length===2&&ids.length&&k.parentIds.some(id=>!ids.includes(id))) k.meio=1;
  // guarda: quem não mora comigo vai ficando mais distante
  if(m.age<18&&S.flags.divorced&&(S.flags.guarda==='mae'||S.flags.guarda==='pai')){ const fora=people(S.flags.guarda==='mae'?'pai':'mae')[0], casa=people(S.flags.guarda)[0];
    if(fora) fora.bond=clamp(fora.bond-R.int(0,3)); if(casa) casa.bond=clamp(casa.bond+1); } }
yearPeople=(o=>function(){ const r=o.apply(this,arguments); try{ familiaSync(); }catch(e){} return r; })(yearPeople);
relLabel=(o=>p=>p&&p.rel==='irmao'&&p.meio?g('Meio-irmão|Meia-irmã',p.gender):p&&p.rel==='conhecido'&&p.exPadrasto?g('Ex-padrasto|Ex-madrasta',p.gender):o(p))(relLabel);
if(typeof EV_SEMPRE!=='undefined') EV_SEMPRE.add('guarda_pais');

Object.assign(EVENTS,{
 guarda_pais:{prep:()=>S.flags.divorced&&S.me.age<18&&people('mae').length&&people('pai').length?{}:null,
  show:()=>({k:'Família',t:'Com quem eu vou morar?',x:'Meus pais se separaram. Agora precisam decidir onde eu vou morar.',ch:[['Com minha mãe','mae'],['Com meu pai','pai'],['Uma semana em cada casa','ambos']]}),
  pick:k=>{ S.flags.guarda=k; const a=people('mae')[0], b=people('pai')[0];
    if(k==='ambos'){ st('happy',-2); return 'Duas casas, duas escovas de dente. Dá trabalho, mas tenho os dois.'; }
    const casa=k==='mae'?a:b, fora=k==='mae'?b:a; if(casa) casa.bond=clamp(casa.bond+6); if(fora) fora.bond=clamp(fora.bond-8);
    return `Fui morar com ${k==='mae'?'minha mãe':'meu pai'}. ${fora?fora.first+' vai me ver nos fins de semana.':''}`; }},
 fam_padrasto_chega:{prep:()=>null,
  show:d=>{ const q=P(d.pid); return {k:'Família',t:q.gender==='F'?'A madrasta':'O padrasto',x:`${P(q.padDe)?.first||'Meu pai ou minha mãe'} me apresentou ${fullName(q)}, que agora faz parte da família.`,ch:[['Dar uma chance','c'],['Ficar na minha','n'],['Deixar claro que não gosto','r']]}; },
  pick:(k,d)=>{ const q=P(d.pid); if(!q) return 'A situação já não é a mesma.'; const p=P(q.padDe);
    if(k==='c'){ q.bond=clamp(q.bond+12); st('happy',3); return `${q.first} se esforçou para me agradar. Talvez dê certo.`; }
    if(k==='r'){ q.bond=clamp(q.bond-15); if(p) p.bond=clamp(p.bond-5); st('happy',-2); return 'O clima em casa ficou pesado.'; }
    return 'Cumprimentei e fui para o quarto.'; }},
 fam_dois_lares:{w:2,cd:5,when:m=>m.age>=4&&m.age<=17&&S.flags.divorced&&people('mae').length&&people('pai').length,prep:()=>({}),
  show:()=>{ const fora=S.flags.guarda==='pai'?'mae':S.flags.guarda==='mae'?'pai':R.pick(['mae','pai']), p=people(fora)[0];
    return {k:'Família',t:'Fim de semana na outra casa',x:`É o fim de semana de ficar com ${p.rel==='mae'?'minha mãe':'meu pai'}, ${p.first}.`,ch:[['Aproveitar o tempo juntos','a'],['Pedir para ficar em casa','f']],d:{pid:p.id}}; },
  pick:(k,d)=>{ const p=(d&&P(d.pid))||R.pick(parents()); if(!p) return 'Ficou para outro fim de semana.';
    if(k==='a'){ p.bond=clamp(p.bond+6); st('happy',4); return `Passamos o sábado inteiro juntos. ${p.first} estava com saudade.`; }
    p.bond=clamp(p.bond-5); return `${p.first} ficou chatead${p.gender==='F'?'a':'o'}, mas entendeu.`; }},
 fam_pensao:{w:1,cd:8,when:m=>m.age>=6&&m.age<=17&&S.flags.divorced&&people('mae').length&&people('pai').length,prep:()=>({}),
  show:()=>({k:'Família',t:'A pensão',x:'Ouvi meus pais discutindo no telefone por causa da pensão atrasada.',ch:[['Não tomar partido','n'],['Defender quem cuida de mim','d']]}),
  pick:k=>{ if(k==='d'){ const casa=people(S.flags.guarda==='pai'?'pai':'mae')[0], fora=people(S.flags.guarda==='pai'?'mae':'pai')[0]; if(casa) casa.bond=clamp(casa.bond+4); if(fora) fora.bond=clamp(fora.bond-6); return 'Falei o que pensava. Um ficou grato, o outro magoado.'; }
    st('happy',-2); return 'Coloquei o fone. Não é problema meu, mas dói.'; }},
 fam_padrasto_regras:{w:1.5,cd:6,when:m=>m.age>=6&&m.age<=17&&people('padrasto').length>0,prep:()=>({pid:R.pick(people('padrasto')).id}),
  show:d=>{ const q=P(d.pid); return {k:'Família',t:'Novas regras',x:`${q.first}, ${q.gender==='F'?'minha madrasta':'meu padrasto'}, resolveu impor regras em casa.`,ch:[['Respeitar','r'],['Dizer que não manda em mim','e'],['Conversar com calma','c']]}; },
  pick:(k,d)=>{ const q=P(d.pid); if(!q) return 'A situação já não é a mesma.';
    if(k==='r'){ q.bond=clamp(q.bond+6); return 'Não gostei, mas obedeci. Ganhei pontos.'; }
    if(k==='e'){ q.bond=clamp(q.bond-10); st('happy',-3); return 'Bati a porta do quarto. Ninguém dormiu bem.'; }
    return R.chance(.6)?(q.bond=clamp(q.bond+10),'Combinamos as regras juntos. Funcionou.'):'Tentei, mas não chegamos a um acordo.'; }},
});

// efeitos novos que os textos de evento usam
function nlMudarCidade(manter){ const m=S.me, c=countryOf(m.country), op=c.cities.filter(x=>x!==m.city); if(!op.length) return '';
  const nova=R.pick(op); m.city=nova;
  partners().concat(kids().filter(k=>k.age<18),!S.flags.movedOut?parents().concat(people('irmao').filter(k=>k.age<18)):[]).forEach(q=>{ try{ npcMudarLocal(q,m.country,nova); }catch(e){} });
  let t=`Me mudei para ${nova}.`; if(!manter&&m.job&&!m.job.hero){ endJob(); t+=' Deixei o emprego na cidade antiga.'; } return t; }
extTok=(o=>function(tok,d,out){ const m=S.me; let mm;
  if(tok==='transferir'||tok==='mudarcidade'){ const t=nlMudarCidade(tok==='transferir'); if(t) out.push(t); return true; }
  if(tok==='trocaempresa'){ if(m.job&&!m.job.spc){ const co=companyName(); m.job.co=co; out.push(`Agora trabalho na ${co}.`); } return true; }
  if(tok==='herdarcasa'){ if(!m.assets.some(a=>a.n==='Casa do interior')){ const v=(d&&d.v)||80000; m.assets.push({id:newId(),k:'casa',n:'Casa do interior',value:v,cond:R.int(40,75),buy:0,country:m.country,city:m.city}); out.push('A casa do interior entrou nos meus bens.'); } return true; }
  if(mm=tok.match(/^carro:([\wÀ-ú]+):(\d+)$/)){ m.assets.push({id:newId(),k:'carro',n:mm[1].replace(/_/g,' '),value:+mm[2],cond:100,buy:0,country:m.country,city:m.city}); return true; }
  if(mm=tok.match(/^guarda:(mae|pai|ambos)$/)){ if(S.flags.divorced&&m.age<18){ S.flags.guarda=mm[1]; S.pending=S.pending.filter(e=>e.id!=='guarda_pais'); } return true; }
  return o(tok,d,out); })(extTok);

// texto que diz que algo mudou precisa ter o efeito correspondente
const COERENCIA=[[/mudei de cidade|me mudei para|mudamos de cidade|mudamos para outra cidade/i,/\b(mudarcidade|transferir)\b/,'mudança de cidade'],
 [/mudei de empresa/i,/trocaempresa|empregonovo|emprego:/,'troca de empresa'],
 [/comprei (um|uma) (carro|casa|apartamento|moto)\b/i,/carro:|imovel:|\$-/,'compra'],
 [/vendi a casa/i,/vender:|\$\+/,'venda da casa'],
 [/vão se separar|se divorciaram|meus pais se separaram/i,/paisseparam|separar/,'separação']];
function coerenciaSelfTest(){ const erros=[];
  const ver=(onde,c)=>{ const p=String(c).split('|'); for(const [fx,tx] of [[p[1],p[2]],[String(p[1]||'').split('?')[0]+' '+(p[3]||''),p[4]]]) if(tx) for(const [re,tok,n] of COERENCIA) if(re.test(tx)&&!tok.test(fx||'')) erros.push(`${onde}: ${n} sem efeito ("${tx.slice(0,50)}")`); };
  for(const ch of Object.values(CHAINS)) for(const [sid,st] of Object.entries(ch.steps)) (st[2]||[]).forEach(c=>ver(ch.id+'.'+sid,c));
  for(const [id,e] of Object.entries(EVENTS)) if(e.raw) e.raw.forEach(c=>ver(id,c));
  if(erros.length) throw Error('Coerência 2.20 · '+erros.slice(0,6).join(' | ')); return {ok:true}; }

function familia2SelfTest(){ const s0=S,ns=window.NO_SAVE; window.NO_SAVE=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); };
  try{ newLife({country:'BR'}); const m=S.me; m.age=9; let mae=people('mae')[0], pai=people('pai')[0];
    if(!mae){ mae=mkPerson({rel:'mae',gender:'F',age:35}); S.people.push(mae); } if(!pai){ pai=mkPerson({rel:'pai',gender:'M',age:37}); S.people.push(pai); }
    mae.age=35; pai.age=37; S.flags.divorced=0; npcVida(mae).par=pai.id; npcVida(pai).par=mae.id;
    ok(paisJuntos(),'pais deviam estar juntos'); ok(EVENTS.pais_brigam.when(m),'briga dos pais devia valer com o casal junto');
    // separação feita pelo sistema de pessoas vira separação de verdade
    mae.vida.par=null; pai.vida.par=null; S.pending=[]; familiaSync();
    ok(S.flags.divorced&&!paisJuntos(),'separação do sistema de pessoas não marcou os pais separados');
    ok(S.pending.some(e=>e.id==='guarda_pais'),'guarda não foi decidida'); ok(!EVENTS.pais_brigam.when(m),'briga na sala com os pais separados');
    ok(!CHAINS.briga_pais.o.when(m)&&!CHAINS.irmao_novo.o.when(m),'brigas ou irmão novo com os pais separados');
    EVENTS.guarda_pais.pick('mae'); ok(S.flags.guarda==='mae','guarda não foi gravada');
    // novo par da mãe vira padrasto, e o filho deles, meio-irmão
    const q=mkPerson({rel:'conhecido',gender:'M',age:36}); S.people.push(q); npcUnir(mae,q); S.pending=[]; familiaSync();
    ok(q.rel==='padrasto'&&relLabel(q)==='Padrasto','novo par da mãe não virou padrasto: '+q.rel);
    ok(V.relations().items.some(i=>i.l&&String(i.l).includes(q.first)),'padrasto não aparece nas Relações');
    ok(S.pending.some(e=>e.id==='fam_padrasto_chega'),'apresentação do padrasto não veio');
    const k=npcFilho(mae,q); if(k){ familiaSync(); ok(k.rel==='irmao'&&/Mei[oa]-irm/.test(relLabel(k)),'filho com o padrasto não virou meio-irmão'); }
    // efeitos de texto
    const cid=m.city; m.job=null; takeJob({id:'seg',co:'Firma A',size:'média',mul:1}); const out=[];
    extTok('transferir',{},out); ok(m.city!==cid&&m.job,'transferência não mudou a cidade ou tirou o emprego');
    extTok('trocaempresa',{},out); ok(m.job.co!=='Firma A','troca de empresa manteve o nome');
    extTok('herdarcasa',{v:90000},out); ok(m.assets.some(a=>a.n==='Casa do interior'),'casa herdada não entrou nos bens');
    extTok('carro:Carro_do_ministério:20000',{},out); ok(m.assets.some(a=>a.k==='carro'&&a.n==='Carro do ministério'),'carro não entrou nos bens');
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; }
  if(erros.length) throw Error('Família 2.20 · '+erros.join(' | ')); return {ok:true}; }
