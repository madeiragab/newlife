// Percursos automatizados do nascimento ao fim da vida; não são sessões humanas.
function trajetoriasSelfTest(){
 const before=S,meta=JSON.stringify(META),snaps=SNAPS,rand=R.f,noSave=window.NO_SAVE;let seed=19273;
 R.f=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};window.NO_SAVE=true;
 const ok=(v,t)=>{if(!v)throw Error(t);},result=[];
 try{
  for(const tipo of ['comum','criminosa','empresarial','familia']){
   newLife({country:'BR',year:2000});let passos=0,empresas=0,crimes=0,casamentos=0,filhos=0;
   while(S.me.alive&&passos++<131){
    S.pending=[];ageUp();
    let guard=0;
    while(S.pending.length&&guard++<30){const e=S.pending.shift();if(!evValid(e))continue;const ev=EVENTS[e.id],sh=ev.show(e.d);ev.pick(sh.ch.at(-1)[1],e.d);}
    if(S.scen){S.scen=null;S.me.prol=null;}
    const m=S.me;if(!m.alive)break;
    if(m.prison)prisonDo('comportar');
    else if(m.age>=18){
     if(tipo==='criminosa'){const c=CRIMES.find(c=>c.id==='furto')||CRIMES.find(c=>c.min<=18);crime(c);crimes++;}
     else if(!m.job&&!m.edu.cur){const j=openings().find(o=>!jobReqs(JOBS.find(j=>j.id===o.id)).length);if(j)takeJob(j);}
     if(tipo==='empresarial'&&!m.biz){const sec=BIZ_SECTORS.find(s=>s.cost<m.money-10000);if(sec){openBiz(sec,'Percurso');if(m.biz)empresas++;}}
     if(tipo==='familia'){
      if(!partners().length)askOut(candidate(false));
      const p=partners()[0];if(p){interact(p,'tempo');if(p.rel==='namoro'&&canPay(500))interact(p,'pedido',[500]);else if(p.rel==='noivo'&&canPay(800)){interact(p,'casar',[800,false]);if(p.rel==='conjuge')casamentos++;}else if(p.rel==='conjuge'&&kids().length<3&&m.age<45)interact(p,'filho');}
     }
    }
    if(m.age>=4&&m.age%3===0)body('lib');
    for(const d of m.dis.slice())treat('doc',d);
    if(m.health<=0)die(causeFromHealth());
    filhos=Math.max(filhos,kids().length);
    ok(Number.isFinite(m.money)&&m.assets.every(a=>Number.isFinite(a.value)),'estado financeiro inválido '+tipo);
    if(m.age%10===0){S=JSON.parse(JSON.stringify(S));fixSave(S);[V.career,V.assets,V.relations].forEach(v=>v().items.map(rowHtml));}
   }
   const row={tipo,idade:S.me.age,morreu:!S.me.alive,causa:S.me.cause,empresas,crimes,casamentos,filhos,patrimonio:Math.round(netWorth()+(S.me.biz?.value||0))};
   if(!S.me.alive&&kids().some(k=>k.alive)){const k=kids().find(k=>k.alive),nome=k.first;continueAs(k);ok(S.me.first===nome&&S.me.alive,'sucessão '+tipo);S=JSON.parse(JSON.stringify(S));fixSave(S);row.herdeiro=true;}
   result.push(row);
  }
  return result;
 }finally{S=before;META=JSON.parse(meta);SNAPS=snaps;R.f=rand;window.NO_SAVE=noSave;}
}
