// Projeções comparáveis: mesmos países, emprego, capital e choques por semente.
// Sem mortalidade, para separar retorno financeiro de sobrevivência aleatória.
function estrategiasMundoDiagnostico(sementes=[17,91,307]){
 const before=S,meta=JSON.stringify(META),snaps=SNAPS,rand=R.f,noSave=window.NO_SAVE,noNews=window.NO_NEWS;
 let seed=1;const setSeed=n=>seed=n>>>0;R.f=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 window.NO_SAVE=true;window.NO_NEWS=true;
 const ok=(v,t)=>{if(!v)throw Error(t);},rows=[],oportunidades=[];
 try{
  const job=JOBS.find(j=>j.sal>=50000&&j.sal<=80000&&!j.pt)||JOBS.find(j=>!j.pt);
  for(const inicial of sementes){
   setSeed(inicial);newLife({country:'BR',year:2000});macroInicializar();const world=S.mundo;
   const lanes=[];
   for(const [ci,c] of COUNTRIES.entries())for(const pol of ['reserva','acoes','imovel','empresa']){
    setSeed(inicial+ci);newLife({country:c.id,year:2000});S.mundo=world;const m=S.me;
    m.age=30;m.born=S.year-30;m.money=300000;m.edu.cur=null;m.edu.club=null;m.royal=null;S.flags.movedOut=1;
    takeJob({id:job.id,co:'Comparação',size:'média',mul:1});
    if(pol==='empresa')openBiz(BIZ_SECTORS[0],'Comparação');
    lanes.push({s:S,pol,pais:c.id,pontos:{a30:300000},emprestimo:false});
   }
   const baseYear=S.year;let macroSeed=inicial;
   for(let idade=31;idade<=90;idade++){
    S=lanes[0].s;S.year=baseYear+idade-30;setSeed(macroSeed);macroPasso(S.year);macroSeed=seed;
    if(idade%10===0){
     const ranks=COUNTRIES.map(c=>{
      const w=mundo(c.id),u={country:c.id,sector:BIZ_SECTORS[0].n,capital:240000,emp:3};
      const precos=Object.fromEntries(Object.keys(w.indices).map(k=>[k,w.indices[k]/w.cambio]));
      return {pais:c.id,lucro:Math.round(empresaCalcular(u,w,precos).lucro)};
     }).sort((a,b)=>b.lucro-a.lucro);
     oportunidades.push({semente:inicial,idade,ranking:ranks});
    }
    for(const lane of lanes){
     S=lane.s;const m=S.me;m.age=idade;S.year=baseYear+idade-30;m.yr={};S.pending=[];S.log=[{age:idade,year:S.year,lines:[]}];
     let mixed=(inicial*100000+idade)|0;mixed=Math.imul(mixed^(mixed>>>16),0x45d9f3b);mixed=Math.imul(mixed^(mixed>>>16),0x45d9f3b);setSeed(mixed^(mixed>>>16)); // sorteios comparáveis, independentes da ordem dos países
     yearMoney();yearAssets();yearBiz();
     if(lane.pol==='acoes'&&m.money>30000)invest('acoes',Math.floor((m.money-30000)*.5));
     if(lane.pol==='imovel'&&!lane.emprestimo){const offer=houseListings().find(h=>h.v*.2<=m.money-30000);if(offer){const n=m.assets.length;buy('casa',offer,true);lane.emprestimo=m.assets.length>n;}}
     if(lane.pol!=='acoes'&&m.money>30000)invest('poup',Math.floor((m.money-30000)*.5));
     const value=netWorth()+(m.biz?.value||0);ok(Number.isFinite(value),'patrimônio inválido: '+lane.pais+' '+lane.pol);
     if([45,65,90].includes(idade))lane.pontos['a'+idade]=Math.round(value);
    }
   }
   for(const lane of lanes)rows.push({semente:inicial,pais:lane.pais,estrategia:lane.pol,...lane.pontos});
  }
  const lideres=oportunidades.map(o=>({semente:o.semente,idade:o.idade,pais:o.ranking[0].pais}));
  const mudancas=lideres.filter((v,i)=>i>0&&lideres[i-1].semente===v.semente&&lideres[i-1].pais!==v.pais).length;
  const dominantes=['reserva','acoes','imovel','empresa'].filter(pol=>rows.filter(r=>r.estrategia===pol).every(r=>rows.filter(o=>o.semente===r.semente&&o.pais===r.pais).every(o=>r.a90>=o.a90)));
  return {sementes,paises:COUNTRIES.length,projecoes:rows.length,rows,oportunidades,mudancasDeLider: mudancas,dominantes,nota:'Cenários financeiros dos 30 aos 90, com emprego mantido e sem mortalidade; amostra para diagnóstico, não prova de equilíbrio ou playtest humano.'};
 }finally{S=before;META=JSON.parse(meta);SNAPS=snaps;R.f=rand;window.NO_SAVE=noSave;window.NO_NEWS=noNews;}
}
