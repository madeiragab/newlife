// Gerações sem roteiro: ninguém controla quando o personagem morre nem se o herdeiro sobrevive.
// As escolhas dos eventos são sorteadas; a vida segue com ageUp() real até a terceira geração.
function geracoesNaturaisSelfTest(){
 const anterior=S,meta=JSON.stringify(META),snaps=SNAPS,nomes=USED_NAMES,rand=R.f,noSave=window.NO_SAVE,noNews=window.NO_NEWS,rows=[];
 window.NO_SAVE=true;window.NO_NEWS=true;let seed=0,contexto='';const ok=(v,t)=>{if(!v)throw Error('Gerações naturais '+contexto+' · '+t);};
 const inicio=Date.now();
 try{
  for(const semente of [30101,30102,30103,30104,30105,30106,30107,30108,30109,30110]){
   if(rows.some(r=>r.geracoes>=3)&&rows.length>=2||Date.now()-inicio>90000)break;
   seed=semente;R.f=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};USED_NAMES=new Set();META.usedNames=[];
   newLife({country:'BR',year:1990});S.scen=null;let anos=0,herancas=0,eventos=0;const linha={semente,geracoes:1,anos:0,eventos:0,motivo:''};
   while(anos++<320){
    contexto='seed '+semente+' geração '+S.gen+' idade '+S.me.age;
    S.pending=[];ageUp();
    let guard=0;while(S.pending.length&&guard++<30){const e=S.pending.shift();if(!evValid(e))continue;const ev=EVENTS[e.id],sh=ev.show(e.d);if(!sh?.ch?.length)continue;ev.pick((R.chance(.75)?sh.ch.at(-1):R.pick(sh.ch))[1],e.d);eventos++;}
    if(S.scen){S.scen=null;S.me.prol=null;}
    const m=S.me;npcAuditar(S);ok(Number.isFinite(m.money)&&Number.isFinite(m.age),'dinheiro ou idade inválidos');
    if(!m.alive){const k=kids().filter(p=>p.alive).sort((a,b)=>b.age-a.age)[0];if(!k){linha.motivo='sem herdeiro aos '+m.age+' ('+m.cause+')';break;}const total=m.money;ok(continueAs(k)!==false,'sucessão recusada');herancas++;ok(S.me.alive&&S.me.id===k.id,'herdeiro não assumiu');ok(Number.isFinite(S.me.money),'herança inválida de '+total);linha.geracoes=S.gen;if(S.gen>=3&&S.me.age>=18){linha.motivo='terceira geração adulta';break;}continue;}
    if(m.prison){prisonDo('comportar');continue;}
    if(m.dis.length){if(m.dis.some(d=>d.k===false))checkup();m.dis.slice().forEach(d=>treat(m.age>=18?'doc':'clinica',d));}
    if(m.age>=18){
     if(!m.job&&!m.edu.cur&&!m.ret){const j=openings().find(o=>!jobReqs(JOBS.find(j=>j.id===o.id)).length);if(j)takeJob(j);}
     if(m.job&&m.age>=63&&R.chance(.5))retire();
     if(m.age<46){if(!partners().length&&R.chance(.6))askOut(candidate(false));const p=partners()[0];if(p){interact(p,'tempo');if(p.rel==='namoro'&&canPay(500))interact(p,'pedido',[500]);else if(p.rel==='noivo'&&canPay(800))interact(p,'casar',[800,false]);else if(p.rel==='conjuge'&&kids().length<3)interact(p,'filho');}}
    }
    if(anos%25===0){const uma=JSON.stringify(S);S=JSON.parse(uma);fixSave(S);const duas=JSON.stringify(S);fixSave(S);ok(JSON.stringify(S)===duas,'migração repetida alterou o save');}
   }
   linha.anos=anos;linha.eventos=eventos;linha.herancas=herancas;rows.push(linha);
  }
  ok(rows.some(r=>r.geracoes>=3),'nenhuma linhagem chegou à terceira geração: '+JSON.stringify(rows));
  return rows;
 }finally{S=anterior;META=JSON.parse(meta);SNAPS=snaps;USED_NAMES=nomes;R.f=rand;window.NO_SAVE=noSave;window.NO_NEWS=noNews;}
}
// Saves reais de versões publicadas: migração idempotente, nada some, e a vida continua por alguns anos.
function migracaoVersoesSelfTest(fixtures){
 const anterior=S,meta=JSON.stringify(META),snaps=SNAPS,rand=R.f,noSave=window.NO_SAVE,noNews=window.NO_NEWS,rows=[];window.NO_SAVE=true;window.NO_NEWS=true;
 let seed=4242;R.f=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 try{for(const f of fixtures){const ok=(v,t)=>{if(!v)throw Error('Save '+f.versao+' · '+t);};
  S=JSON.parse(JSON.stringify(f.save));const dinheiro=S.me.money,ids=S.people.map(p=>p.id),bens=(S.me.assets||[]).length,parceiros=S.people.filter(p=>['namoro','noivo','conjuge'].includes(p.rel)).length;
  fixSave(S);const uma=JSON.stringify(S);fixSave(S);ok(JSON.stringify(S)===uma,'migração não é idempotente');
  ok(S.me.money===dinheiro,'dinheiro mudou na migração');ok(ids.every(id=>P(id)),'pessoa sumiu na migração');ok(S.me.assets.length===bens,'bens sumiram');ok(S.people.filter(p=>['namoro','noivo','conjuge'].includes(p.rel)).length===parceiros,'relacionamentos mudaram');
  npcAuditar(S);[V.relations,V.assets,V.career].forEach(v=>{const r=v();if(r)r.items.map(rowHtml);});
  let anos=0;for(;anos<3&&S.me.alive;anos++){S.pending=[];ageUp();let g=0;while(S.pending.length&&g++<30){const e=S.pending.shift();if(!evValid(e))continue;const ev=EVENTS[e.id],sh=ev.show(e.d);if(sh?.ch?.length)ev.pick(sh.ch.at(-1)[1],e.d);}if(S.scen){S.scen=null;S.me.prol=null;}npcAuditar(S);ok(Number.isFinite(S.me.money),'dinheiro inválido após '+(anos+1)+' anos');}
  if(!S.me.alive){const k=kids().filter(p=>p.alive)[0];if(k)ok(continueAs(k)!==false,'sucessão falhou');}
  rows.push({versao:f.versao,pessoas:ids.length,bens,parceiros,anos});}
  return rows;
 }finally{S=anterior;META=JSON.parse(meta);SNAPS=snaps;R.f=rand;window.NO_SAVE=noSave;window.NO_NEWS=noNews;}
}
