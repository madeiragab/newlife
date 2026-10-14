// ===== Diagnóstico da economia (#economia): cada estratégia de vida jogada muitas vezes, para achar caminhos bons demais =====
const ECON_POL={
  sem_estudo:{n:'Sem estudo, trabalha'},
  tecnico:{n:'Curso técnico'},
  faculdade:{n:'Faculdade'},
  pos:{n:'Faculdade + pós'},
  empresa:{n:'Empresa própria'},
  acoes:{n:'Trabalha e investe em ações'},
  cripto:{n:'Trabalha e põe tudo em cripto'},
  crime:{n:'Vive de crime'},
  herdeiro:{n:'Herdeiro que não trabalha'},
};
function econBestJob(){ const m=S.me; m.yr.openings=null; const op=openings();
  const ok=op.map(o=>({o,j:JOBS.find(x=>x.id===o.id)})).filter(x=>x.j&&!x.j.pt&&eduOk(x.j.edu)&&(!x.j.min||m.age>=x.j.min)).sort((a,b)=>b.j.sal*b.o.mul-a.j.sal*a.o.mul);
  if(ok.length&&(!m.job||ok[0].j.sal*ok[0].o.mul>jobSalary(m.job)*1.15)) takeJob(ok[0].o); }
function econYear(pol){ const m=S.me; if(m.prison||m.age<18) return;
  if(pol==='herdeiro'){ if(m.job) endJob(); return; }
  if(pol==='crime'){ if(m.job) endJob(); const c=CRIMES.filter(c=>c.min<=m.age&&['casa','carro','golpe'].includes(c.id)); if(c.length) crime(R.pick(c)); return; }
  const study=pol==='tecnico'||pol==='faculdade'||pol==='pos';
  if(study&&!m.edu.cur){
    if(pol==='tecnico'&&!m.edu.deg.some(d=>d.startsWith('tec:'))) enroll('tec',R.pick(TECHS),null,'loan',0);
    if((pol==='faculdade'||pol==='pos')&&!m.edu.deg.some(d=>d.startsWith('uni:'))&&m.age<30){ const c=R.pick(COURSES); const r=enroll('uni',c,'publica',null,0); if(!m.edu.cur) enroll('uni',c,'privada','loan',0); }
    if(pol==='pos'&&m.edu.deg.some(d=>d.startsWith('uni:'))&&!m.edu.deg.some(d=>d.startsWith('post:'))) enroll('post',R.pick(POSTS.filter(p=>p.req==='uni')),null,'loan',0);
  }
  if(pol==='empresa'){ if(!m.biz&&m.age>=24){ const s=BIZ_SECTORS.filter(s=>s.cost<=m.money).sort((a,b)=>b.cost-a.cost)[0]; if(s) openBiz(s,'Empresa '+m.last); } if(!m.biz) econBestJob(); return; }
  if(!(m.edu.cur&&m.edu.cur.type!=='medio')) econBestJob();
  const sobra=m.money-15000;
  if(pol==='acoes'&&sobra>0) invest('acoes',Math.round(sobra*.6));
  if(pol==='cripto'&&sobra>0) invest('cripto',Math.round(sobra*.8)); }
function econRun(pol,n){ const res=[];
  for(let i=0;i<n;i++){ newLife(pol==='herdeiro'?{cls:'milionaria'}:{cls:'media'}); const m=S.me, row={pol,w45:null,w65:null,alive65:false};
    for(let g=0;g<90&&m.alive;g++){ ageUp(); let k=0; while(S.pending.length&&k++<20){ const e=S.pending.shift(); if(!evValid(e)) continue; try{ const ev=EVENTS[e.id], sh=ev.show(e.d); ev.pick(R.pick(sh.ch)[1],e.d); }catch(err){} }
      MQ.length=0; if(S.scen) S.scen=null; m.prol=null;
      try{ if(m.dis.length){ if(m.dis.some(d=>d.k===false)) checkup(); m.dis.slice().forEach(d=>treat(m.age>=18?'doc':'clinica',d)); } }catch(err){}   // um jogador razoável vai ao médico
      try{ econYear(pol); }catch(err){}
      if(m.alive&&m.health<=0) die(causeFromHealth());
      if(m.age===45&&m.alive) row.w45=netWorth(); if(m.age===65&&m.alive){ row.w65=netWorth(); row.alive65=true; } if(m.age>65) break; }
    res.push(row); }
  return res; }
const econMed=a=>{ a=a.filter(x=>x!=null).sort((x,y)=>x-y); return a.length?a[Math.floor(a.length/2)]:null; };
const econAvg=a=>{ a=a.filter(x=>x!=null); return a.length?Math.round(a.reduce((s,x)=>s+x,0)/a.length):null; };
function econDiag(n=24,pols){ const out=['ESTRATÉGIA | patrimônio mediano aos 45 | aos 65 | média aos 65 | vivos aos 65'];
  for(const p of pols||Object.keys(ECON_POL)){ const r=econRun(p,n);
    out.push(`${ECON_POL[p].n} | ${fmt(econMed(r.map(x=>x.w45))||0)} | ${fmt(econMed(r.map(x=>x.w65))||0)} | ${fmt(econAvg(r.map(x=>x.w65))||0)} | ${Math.round(r.filter(x=>x.alive65).length/r.length*100)}%`); }
  return out.join('\n'); }
