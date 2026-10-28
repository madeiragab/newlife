// ===== 3.0.3: poder coerente =====
// Quem domina um país não sofre sanção nem crise diplomática dele, e quem já dominou o mundo não tem mais de
// quem levar sanção. Ditador, monarca reinante e Rei do Mundo não vão a julgamento pelos próprios crimes: o caso
// é abafado, mas cobra em carma, aprovação e (no regime) pressão internacional. Presidente eleito continua
// respondendo à Justiça.

// país sob o meu controle: o meu, os dominados pelo império, ou todos se eu for Rei do Mundo no poder
function nlPaisMeu(id){ const m=S.me; if(!m) return false; if(id===m.country) return true;
  if(m.c&&m.c.reiMundo&&chefeEstado()) return true;
  return !!(m.imperio&&chefeEstado()&&impNv(id)>=3); }
const nlEstrangeiros=()=>COUNTRIES.map(c=>c.id).filter(id=>!nlPaisMeu(id));
// chefe de Estado acima da lei: regime, monarca reinante ou Rei do Mundo
function nlImune(){ const m=S.me, c=chefeEstado(); return !!c&&(c==='reg'||c==='rei'||!!(m.c&&m.c.reiMundo)); }

// sanções e crises só de quem ainda é estrangeiro
const NL_SANCAO=/san[çc][ãa]o|san[çc][õo]es|embargo|bloqueio econ/i;
evValid=(o=>function(e){ if(!o.apply(this,arguments)) return false;
  try{ const m=S.me, ev=EVENTS[e.id]; if(!m||!ev) return true;
    if(e.id==='julgamento'&&nlImune()) return false;
    if(chefeEstado()){
      const d=e.d||{}, alvo=[d.p,d.l,d.alvo].find(x=>typeof x==='string'&&COUNTRIES.some(c=>c.id===x));
      if(alvo&&alvo!==m.country&&nlPaisMeu(alvo)&&/^(pol_|imp_sancoes|imp_ultimato|smundo_|reg_|biz_sancoes)/.test(e.id)) return false;
      if(!nlEstrangeiros().length&&(/sancoes|ultimato|disputa|coalizao/.test(e.id)||NL_SANCAO.test(ev.title||''))) return false; }
  }catch(err){} return true; })(evValid);

// a crise diplomática escolhe um vizinho que ainda não é meu
EVENTS.pol_disputa.prep=(o=>function(m){ const r=o.apply(this,arguments); if(r&&nlPaisMeu(r.p)){ const l=nlEstrangeiros(); if(!l.length) return null; r.p=R.pick(l); } return r; })(EVENTS.pol_disputa.prep);
const _nlQueue=queue; queue=function(id,d){ if(id==='pol_disputa'&&!d) return; return _nlQueue.apply(this,arguments); };

// chefe de Estado acima da lei não é preso: o crime é abafado e cobra de outro jeito
arrest=(o=>function(crime,min,max){ const m=S.me; if(!nlImune()) return o.apply(this,arguments);
  const c=chefeEstado(), r=c==='reg'&&typeof regime==='function'?regime():null;
  m.karma=clamp(m.karma-8); if(m.office) m.office.appr=clamp((m.office.appr||50)-R.int(3,8)); if(m.royal&&m.royal.pop!=null) m.royal.pop=clamp(m.royal.pop-R.int(3,8));
  if(r){ r.pres=(r.pres||0)+5; if(typeof regFix==='function') regFix(r); }
  const quem=m.c&&m.c.reiMundo?(m.gender==='F'?'a Rainha do Mundo':'o Rei do Mundo'):c==='rei'?(m.gender==='F'?'a rainha':'o rei'):(m.gender==='F'?'a ditadora':'o ditador');
  log(`Ninguém teve coragem de prender ${quem} por ${crime}. O caso foi abafado, mas o povo comenta.`,'warn'); })(arrest);

// as sanções anuais do regime só existem se ainda houver países de fora para aplicá-las
function nlTemSancionador(){ return nlEstrangeiros().length>0; }

function poderSelfTest(){ const s0=S,ns=window.NO_SAVE; window.NO_SAVE=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); };
  try{ newLife({country:'BR'}); const m=S.me; m.age=50; m.office={id:'pres',appr:60,dit:true,yrs:2}; m.imperio={p:{},ameaca:80,anos:3};
    ok(chefeEstado()==='reg','teste não virou ditador');
    for(const c of COUNTRIES) if(c.id!==m.country) m.imperio.p[c.id]=4;
    ok(!nlEstrangeiros().length,'ainda sobram estrangeiros com o mundo dominado');
    ok(!evValid({id:'imp_sancoes',d:{l:'US',n:3}}),'sanções de país já dominado');
    const golpe=Object.keys(EVENTS).find(id=>EVENTS[id].title==='Sanções internacionais'); if(golpe) ok(!evValid({id:golpe,d:{}}),'evento de sanções com o mundo dominado');
    ok(EVENTS.pol_disputa.prep(m)===null,'crise diplomática com o mundo dominado');
    S.pending=[]; const presos=m.rec.arrests; arrest('homicídio',10,20);
    ok(!S.pending.some(e=>e.id==='julgamento')&&m.rec.arrests===presos&&!m.prison,'ditador dono do mundo foi a julgamento');
    // um país livre volta a poder sancionar; presidente eleito continua respondendo à Justiça
    m.imperio.p.US=0; ok(evValid({id:'imp_sancoes',d:{l:'US',n:1}})&&nlTemSancionador(),'país livre não pode mais sancionar');
    m.office.dit=false; m.imperio=null; S.pending=[]; arrest('homicídio',10,20); ok(S.pending.some(e=>e.id==='julgamento'),'presidente eleito ficou acima da lei');
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; }
  if(erros.length) throw Error('Poder 3.0.3 · '+erros.join(' | ')); return {ok:true}; }
