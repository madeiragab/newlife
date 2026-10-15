// ===== Cadeias de eventos: histórias em etapas, em que cada decisão leva à próxima =====
// chain(id, opções, { a:[título, texto|[variações], [escolhas], {when}], b:[...], ... })   a etapa 'a' abre a história
// opções: k (selo do evento), min/max (idade para começar), when(m), w (peso), who (pessoa real: partner, friend, sib, parent,
//         kid, boss, colega, classmate…), npc (alguém novo com nome; date:true = do gênero que o personagem gosta; gn:'F'|'M'),
//         gap:[min,max] (anos entre etapas), rep (pode acontecer de novo na mesma vida), jail (só na prisão)
// escolha: 'Rótulo|efeitos|texto' ou com chance 'Rótulo|?chance efeitos|texto|efeitos se falhar|texto se falhar' (igual ao pack)
//   efeitos extras: >b (próxima etapa) · >b@3 (daqui a 3 anos) · >b@1-4 (entre 1 e 4 anos) · vira:amigo|namoro|inimigo|colegaT
//   (o personagem da história vira uma pessoa da sua lista) · +cad:outra (começa outra história) · sem ">" a história termina
// no texto: {p} nome do personagem da história · {pl} sobrenome · {o2} o/a dele(a) · {ele} ele/ela · e tudo do pack ({n}, {v}, {o}...)
const CHAINS={};
function chain(id,o,steps){ CHAINS[id]={id,o,steps}; Object.entries(steps).forEach(([sid,st])=>cadReg(id,sid,st)); }
const cadEv=(id,sid)=>'cad_'+id+'_'+sid;
const cadState=()=>{ const m=S.me; m.cad=m.cad||{on:{},done:{}}; return m.cad; };
function cadPerson(d){ const p=d.pid&&P(d.pid); if(p){ d.p=p.first; d.pl=p.last; d.o2=p.gender==='F'?'a':'o'; d.ele=p.gender==='F'?'ela':'ele'; d.idade=p.age; } if(d.ele){ const f=d.ele==='ela'; d.Ele=f?'Ela':'Ele'; d.a2=f?'a':''; d.O2=f?'A':'O'; d.irmao=f?'irmã':'irmão'; d.dele=f?'dela':'dele'; } d.padrinho=S.me.gender==='F'?'madrinha':'padrinho'; return p; }
function cadReg(id,sid,st){ const [title,text,choices,so={}]=st;
  EVENTS[cadEv(id,sid)]={title,w:0,cad:id,cd:0,
    when:m=>{ const c=cadState().on[id]; if(!c||c.s!==sid) return false; try{ return !so.when||so.when(m,c.d); }catch(e){ return false; } },
    prep:m=>{ const c=cadState().on[id]; return c?Object.assign({},c.d):null; },
    show:d=>{ const o=CHAINS[id].o; cadPerson(d); return {k:o.k||'História',t:tp(title,d),x:tp(Array.isArray(text)?text[(d.xi||0)%text.length]:text,d),ch:choices.map((c,i)=>[tp(c.split('|')[0],d),String(i)])}; },
    pick:(key,d)=>cadPick(id,sid,choices[+key],d)};
}
// separa os efeitos próprios das cadeias (>etapa, vira:, +cad:) dos efeitos normais do pack
function cadSplit(fx){ const own=[], rest=[]; String(fx||'').trim().split(/\s+/).filter(Boolean).forEach(t=>(/^(>|vira:|\+cad:|emprego:|casar$|noivar$|bebe$|separar$|pbond[+-]\d+$|caso[+-]$|curar$|morder$|fome[+-]\d+$|virar:\w+$)/.test(t)?own:rest).push(t)); return {own,rest:rest.join(' ')}; }
function cadPick(id,sid,choice,dPend){ const st=cadState(), c=st.on[id], m=S.me; const d=c?c.d:dPend;
  const parts=choice.split('|'); let fx1=parts[1]||'', t1=parts[2]||'', fx2=parts[3], t2=parts[4];
  const toks=fx1.trim().split(/\s+/); let chance=null, base='';
  const qi=toks.findIndex(t=>t.startsWith('?'));
  if(qi>=0){ const bm=toks[qi].match(/^\?(bond|will)([+-]\d+)?$/), pp=d.pid&&P(d.pid);   // ?bond = laço com a pessoa da história · ?will = força de vontade
    chance=bm?Math.max(.03,Math.min(.97,((bm[1]==='bond'?(pp?pp.bond:50):(m.will||50))+ +(bm[2]||0))/100)):dslChance(toks[qi]); base=toks.slice(0,qi).join(' '); fx1=toks.slice(qi+1).join(' '); }
  const ok=chance==null||R.chance(chance);
  const b0=cadSplit(base), br=cadSplit(ok?fx1:(fx2||''));
  const out=[]; let next=null, delay=null;
  b0.own.concat(br.own).forEach(t=>{ let mm;
    if(mm=t.match(/^>(\w+)(?:@(\d+)(?:-(\d+))?)?$/)){ next=mm[1]; if(mm[2]!=null) delay=mm[3]!=null?R.int(+mm[2],+mm[3]):+mm[2]; }
    else if(mm=t.match(/^vira:(\w+)$/)){
      let p=d.pid&&P(d.pid); if(!p){ p=meetP(d,mm[1]==='namoro'?'amigo':mm[1],'n'); if(p){ d.pid=p.id; if(mm[1]==='irmao'&&p.age<3) p.last=m.last; } }
      if(p&&p.rel!==mm[1]&&!['mae','pai','irmao','filho','conjuge'].includes(p.rel)){
        if(mm[1]==='namoro'){ const erro=polyNamorar(p); if(erro) out.push(erro); } else { if(polyAmores().includes(p)) polyLimpar(p); p.rel=mm[1]; }
      }
    }
    else if(mm=t.match(/^\+cad:(\w+)$/)){ cadStart(mm[1],true); }
    else if(mm=t.match(/^emprego:(\w+)$/)){ const j=JOBS.find(x=>x.id===mm[1]); if(j&&!(m.job&&m.job.id===j.id)&&m.age>=16){ takeJob({id:j.id,co:companyName(),size:'média',mul:1}); out.push(`Agora sou ${jobTitle(m.job).toLowerCase()}.`); } }
    else if(t==='noivar'||t==='casar'){ const p=d.pid&&P(d.pid); if(p&&p.alive&&['namoro','noivo'].includes(p.rel)&&polyPodeOficializar(p)){ if(t==='noivar'&&p.rel==='namoro'){ p.rel='noivo'; out.push(`Estou noiv${oa()} de ${p.first}!`); } else if(t==='casar'){ p.rel='conjuge'; p.yrs=0; cnt('marriages'); S.flags.movedOut=1; out.push(`Casei com ${p.first}!`); } } }
    else if(t==='separar'){ const pp=partner(); if(pp){ if(pp.rel==='conjuge') divorce(pp,true); else { pp.rel='ex'; m.happy=clamp(m.happy-15); log(`${pp.first} terminou comigo.`,'bad'); } out.push(`${pp.first} foi embora.`); } }
    else if(mm=t.match(/^pbond([+-]\d+)$/)){ const pp=partner(); if(pp) pp.bond=clamp(pp.bond+ +mm[1]); }
    else if(mm=t.match(/^fome([+-]\d+)$/)){ if(m.criatura) m.fomeP=clamp((m.fomeP||0)+ +mm[1]); }
    else if(t==='curar'){ if(m.criatura){ const tp0=m.criatura; m.criatura=null; m.fomeP=0; log(`Deixei de ser ${g(CRIATURA[tp0][0],m.gender).toLowerCase()}.`,'good'); } }
    else if(t==='morder'){ const pp=d.pid&&P(d.pid); if(pp&&m.criatura){ pp.criatura=m.criatura; out.push(`${pp.first} agora também carrega a maldição.`); } }
    else if(mm=t.match(/^virar:(\w+)$/)){ if(typeof virar==='function'&&!m.criatura&&CRIATURA[mm[1]]) out.push(virar(mm[1]).trim()); }
    else if(t==='caso+'){ m.caso={pid:d.pid||null,n:d.p,ini:m.age}; } else if(t==='caso-'){ m.caso=null; }
    else if(t==='bebe'){ const par=partner(); if(m.age>=18&&m.age<=50){ const gd=R.chance(.5)?'M':'F'; const k=mkPerson({rel:'filho',gender:gd,age:0,last:m.last,bond:R.int(85,100),parentId:par?par.id:null,from:par?[m,par]:undefined}); uniqFirst(k); S.people.push(k); cnt('kids'); out.push(`Nasceu ${gd==='F'?'minha filha':'meu filho'} ${k.first}!`); } } });
  if(c){ if(next&&next!=='fim'&&CHAINS[id].steps[next]){ const g=CHAINS[id].o.gap||[1,3]; c.s=next; c.due=m.age+(delay!=null?delay:R.int(g[0],g[1])); c.n=(c.n||0)+1; }
    else { delete st.on[id]; st.done[id]=(st.done[id]||0)+1; cnt('historias'); } }
  const r0=dslApply(b0.rest,d), r1=dslApply(br.rest,d);
  cadPerson(d);
  return [tp(ok?t1:(t2||'Não deu certo.'),d),r0,r1].concat(out).filter(Boolean).join(' '); }
// pode começar esta história agora?
function cadCan(id,m){ const ch=CHAINS[id], o=ch.o, st=cadState(); if(st.on[id]) return false; if(st.done[id]&&!o.rep) return false;
  if(o.min!=null&&m.age<o.min) return false; if(o.max!=null&&m.age>o.max) return false; if(!!o.jail!==!!m.prison) return false;
  try{ if(o.when&&!o.when(m)) return false; if(o.who&&!WHO[o.who]()) return false; }catch(e){ return false; } return true; }
function cadStart(id,force){ const m=S.me, ch=CHAINS[id]; if(!ch) return false; if(!force&&!cadCan(id,m)) return false; if(cadState().on[id]) return false;
  const o=ch.o; let d;
  try{ d=Object.assign(strangers(m,o),{v:amt((o.v||[500,5000])[0],(o.v||[500,5000])[1]),xi:R.int(0,5),city:m.city,lugar:R.pick(TRIPS)}); }catch(e){ return false; }
  d.v2=d.v*4;
  // palavras sorteadas uma vez e mantidas na história inteira
  Object.assign(d,{materia:R.pick(['matemática','física','química','biologia','história','português','geografia']),prod:R.pick(['roupas de brechó','fones de ouvido','cosméticos naturais','camisetas estampadas','plantas','doces caseiros']),
    comida:R.pick(['pastel','hambúrguer artesanal','tapioca','churros','comida japonesa','acarajé']),coisa:R.pick(['um tênis caro','fones novos','um videogame','roupas','um celular usado','ingressos de show'])});
  if(o.who){ const p=WHO[o.who](); if(!p) return false; d.pid=p.id; }
  if(o.age) d.nAge=clamp(m.age+R.int(o.age[0],o.age[1]),1,99);
  if(o.npc){ d.p=d.n; d.pl=d.nl; d.o2=d.nG==='F'?'a':'o'; d.ele=d.nG==='F'?'ela':'ele'; }
  cadPerson(d);
  cadState().on[id]={s:'a',due:force?m.age+R.int(1,2):m.age,d,ini:m.age}; return true; }
// todo ano: as histórias em andamento avançam e, de vez em quando, começa uma nova
function cadYear(){ const m=S.me; if(!m||!m.alive||S.scen||m.age<5) return; const st=cadState(); let n=0;
  const pend=new Set(S.pending.map(e=>e.id));
  for(const [id,c] of Object.entries(st.on).sort((a,b)=>a[1].due-b[1].due)){
    if(!CHAINS[id]){ delete st.on[id]; continue; }
    if(c.d.pid&&!(P(c.d.pid)&&P(c.d.pid).alive)){ delete st.on[id]; st.done[id]=(st.done[id]||0)+1; continue; }   // a pessoa da história morreu ou sumiu
    if(c.due>m.age||n>=2||!!CHAINS[id].o.jail!==!!m.prison) continue;
    if(m.age-c.due>12){ delete st.on[id]; st.done[id]=(st.done[id]||0)+1; continue; }                              // ficou parada tempo demais
    const eid=cadEv(id,c.s), ev=EVENTS[eid]; if(!ev||pend.has(eid)) continue;
    if(!ev.when(m)) continue;
    queue(eid,ev.prep(m)); n++; }
  const ativos=Object.keys(st.on).length;
  if(n<2&&ativos<4&&R.chance(ativos?.45:.7)){ const el=Object.keys(CHAINS).filter(id=>cadCan(id,m));
    if(el.length){ const id=R.wpick(el.map(id=>[id,CHAINS[id].o.w||1])); if(cadStart(id)){ const c=st.on[id], eid=cadEv(id,'a'); if(EVENTS[eid].when(m)) queue(eid,EVENTS[eid].prep(m)); } } } }
yearEvents=(o=>function(){ const r=o.apply(this,arguments); try{ cadYear(); }catch(e){ console.error(e); } return r; })(yearEvents);
// conferência para o teste: toda etapa citada existe e toda etapa é alcançável
function cadAudit(){ const errs=[]; let steps=0;
  for(const [id,ch] of Object.entries(CHAINS)){ const ss=ch.steps, reach=new Set(['a']); if(!ss.a) errs.push(id+': sem etapa a');
    for(const [sid,st] of Object.entries(ss)){ steps++; const ch3=st[2]; if(!Array.isArray(ch3)||!ch3.length) errs.push(`${id}.${sid}: sem escolhas`);
      (ch3||[]).forEach(c=>{ (c.match(/\+cad:(\w+)/g)||[]).forEach(t=>{ if(!CHAINS[t.slice(5)]) errs.push(`${id}.${sid}: história ${t.slice(5)} não existe`); }); (c.match(/(?:^|[\s|])>(\w+)/g)||[]).forEach(t=>{ t=t.replace(/^[\s|]+/,''); const x=t.slice(1); if(x!=='fim'&&!ss[x]) errs.push(`${id}.${sid}: etapa ${x} não existe`); reach.add(x); }); }); }
    Object.keys(ss).forEach(sid=>{ if(!reach.has(sid)) errs.push(`${id}.${sid}: etapa inalcançável`); }); }
  return {errs,steps,chains:Object.keys(CHAINS).length}; }
