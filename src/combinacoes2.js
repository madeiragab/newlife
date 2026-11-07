// ===== 2.19b: mais vazamentos e mais ligações =====
// ---------- evento que ficou na fila depois que a situação mudou ----------
const SITUACAO={criatura:m=>!!m.criatura,biz:m=>!!m.biz,ret:m=>!!m.ret,job:m=>!!m.job,par:m=>partners().length>0};
const PRECISA=[[/^(cri_|cacador$|vamp_sede$|lobo_lua$|frenesi$)/,'criatura'],[/^biz_evento$/,'biz'],[/^aposentadoria_/,'ret'],[/^(fut_dispensa|lut_aposentar|lut_camp|lut_titulo|car_avaliacao|car_destaque|car_dia|car_espec|car_rh|doping_teste)$/,'job'],[/^(rel_dr|rel_conversa|poly_conflito|caso_descoberto|par_descobre_boate)$/,'par']];
evValid=(o=>function(e){ const ok=o.apply(this,arguments); if(!ok||!e) return ok; const m=S.me; for(const [re,k] of PRECISA) if(re.test(e.id)&&!SITUACAO[k](m)) return false; return ok; })(evValid);

// ---------- mais ligações ----------
const doencaGrave=m=>m.dis.find(d=>DISEASES[d.id]&&DISEASES[d.id].fatal&&d.k!==false);
const jobTeste=()=>({id:JOBS.find(j=>!j.pt&&!j.spc).id,lvl:2,perf:60,yrs:4,co:'Empresa Teste'});
const doencaTeste=m=>{ const id=Object.keys(DISEASES).find(k=>DISEASES[k].fatal); m.dis=[{id,y:1,ctrl:false,k:true}]; };
const uniTeste=()=>({type:'uni',id:'dir',n:'Direito',len:5,yr:2,grade:60,cost:0,pub:true});
cx({id:'doenca_trabalho',k:'Saúde',t:'🏥 O tratamento e o trabalho',p:.4,cd:4,when:m=>!!doencaGrave(m)&&!!m.job&&!m.job.hero,
  x:m=>`O tratamento de ${dn(DISEASES[doencaGrave(m).id].n)} exige sessões três vezes por semana, em horário de expediente.`,
  setup:m=>{ m.age=45; m.job=jobTeste(); doencaTeste(m); },
  ch:[['Pedir licença médica','licenca',m=>{ st('health',4); if(m.job) m.job.perf=clamp(m.job.perf-4); return 'A licença saiu. Ganhei tempo para cuidar de mim.'; }],
    ['Trabalhar e tratar ao mesmo tempo','ambos',m=>{ st('health',-3); st('happy',-4); if(m.job) m.job.perf=clamp(m.job.perf+3); return 'Ia do tratamento direto para a reunião. Os colegas cobriam quando eu não aguentava.'; }],
    ['Pedir para trabalhar de casa','casa',m=>{ if(R.chance(.6)){ st('happy',4); return 'O chefe aceitou na hora. Trabalho do sofá nos dias de sessão.'; } if(m.job) m.job.perf=clamp(m.job.perf-6); return 'O chefe disse que "não é política da empresa".'; }]]});
cx({id:'doenca_estudo',k:'Saúde',t:'🏥 Doente no meio do curso',p:.4,cd:4,when:m=>!!doencaGrave(m)&&!!m.edu.cur&&m.age>=15,
  x:m=>`Com ${dn(DISEASES[doencaGrave(m).id].n)}, falto a uma aula a cada duas.`,
  setup:m=>{ m.age=22; m.edu.cur=uniTeste(); doencaTeste(m); },
  ch:[['Trancar até melhorar','trancar',m=>{ if(!eduTrancar(m,1)) return 'Não dava para trancar. Segui como deu.'; st('health',3); return 'Tranquei por um ano. Primeiro a saúde.'; }],
    ['Pedir regime domiciliar','casa',m=>{ if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade+2); return 'Os professores mandam as matérias por e-mail. Faço as provas em casa.'; }],
    ['Seguir indo às aulas','ir',m=>{ st('health',-3); if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade-3); return 'Fui com remédio no bolso. Não perdi o semestre.'; }]]});
const bebeNovo=m=>kids().find(k=>k.alive&&k.age<=1&&k.rel==='filho');
cx({id:'bebe_estudo',k:'Família',t:'👶 Bebê e faculdade',p:.6,cd:2,when:m=>!!bebeNovo(m)&&eFacul(m),
  x:m=>`${bebeNovo(m).first} chora a noite toda e eu tenho prova de ${m.edu.cur.n} de manhã.`,
  setup:m=>{ m.age=24; m.edu.cur=uniTeste(); S.people.push(mkPerson({rel:'filho',age:0,bond:90})); },
  ch:[['Trancar um semestre','trancar',m=>{ if(!eduTrancar(m,1)) return 'Não deu para trancar.'; st('happy',5); return 'Tranquei. Volto quando o sono voltar.'; }],
    ['Levar o bebê para a aula','levar',m=>{ if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade-2); st('happy',4); const k=bebeNovo(m); if(k) k.bond=clamp(k.bond+4); return 'Virei a atração da turma. O professor segurou o bebê no colo durante a chamada.'; }],
    ['Pedir ajuda da família','familia',m=>{ const a=people('mae','pai','avo')[0]; if(a){ a.bond=clamp(a.bond+5); return `${a.first} ficou com o bebê nas noites de prova.`; } if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade-4); return 'Não tinha quem ajudasse. Estudei com o bebê no colo.'; }]]});
cx({id:'bebe_trabalho',k:'Família',t:'👶 A volta da licença',p:.6,cd:2,when:m=>!!bebeNovo(m)&&!!m.job&&!m.job.hero,
  x:m=>{ const k=bebeNovo(m); return `A licença acabou e ${k.first} ainda é tão pequen${k.gender==='F'?'a':'o'}.`; },
  setup:m=>{ m.age=30; m.job=jobTeste(); S.people.push(mkPerson({rel:'filho',age:0,bond:90})); },
  ch:[['Voltar e pagar uma creche','creche',m=>{ const c=Math.min(Math.max(0,m.money),R.int(6000,15000)); m.money-=c; return `Paguei ${fmt(c)} de creche no ano. Choro na porta toda manhã, dos dois lados.`; }],
    ['Pedir jornada reduzida','reduzir',m=>{ if(m.job) m.job.perf=clamp(m.job.perf-4); st('happy',5); return 'Saio às três. Ganho menos e vejo mais.'; }],
    ['Largar o emprego por um tempo','largar',m=>{ endJob(); st('happy',6); return 'Pedi demissão para ficar em casa. O dinheiro aperta, o coração não.'; }]]});
cx({id:'fama_namoro',k:'Fama',t:'📸 Paparazzi no meu namoro',p:.35,cd:4,when:m=>eFama(m)&&partners().length>0,
  prep:m=>({pid:partners()[0].id}),
  x:(m,d)=>`Fotografaram ${(P(d.pid)||{}).first||'meu par'} e eu saindo de um restaurante. A foto está em todos os sites de fofoca.`,
  setup:m=>{ m.age=30; m.job={spc:'ator',lvl:3,perf:60,yrs:3,co:'Estúdio'}; m.fame=60; S.people.push(mkPerson({rel:'namoro',age:30,bond:60})); },
  ch:[['Assumir o namoro publicamente','assumir',(m,d)=>{ const p=P(d.pid); if(p&&p.alive) p.bond=clamp(p.bond+8); m.fame=clamp(m.fame+3); return 'Postei a foto oficial. Ganhei seguidores e um par feliz.'; }],
    ['Negar tudo','negar',(m,d)=>{ const p=P(d.pid); if(p&&p.alive) p.bond=clamp(p.bond-10); return '"Somos só amigos." Em casa, o clima ficou gelado.'; }],
    ['Processar o site','processar',m=>{ const c=Math.min(Math.max(0,m.money),20000); m.money-=c; return 'O site tirou a foto do ar. A internet já tinha salvado.'; }]]});
const parenteAdulto=m=>people('irmao','neto','filho','sobrinho').filter(p=>p.age>=18);
cx({id:'rico_parentes',k:'Família',t:'💸 Parente pedindo dinheiro',p:.3,cd:5,when:m=>m.money>=1000000&&m.age>=20&&parenteAdulto(m).length>0,
  prep:m=>{ const p=R.pick(parenteAdulto(m)); return p?{pid:p.id}:null; },
  x:(m,d)=>`${(P(d.pid)||{}).first||'Um parente'} soube quanto eu tenho e veio pedir um empréstimo "para abrir um negócio".`,
  setup:m=>{ m.age=50; m.money=3e6; S.people.push(mkPerson({rel:'irmao',age:45,bond:60})); },
  ch:[['Emprestar','emprestar',(m,d)=>{ const p=P(d.pid), v=R.int(20000,100000); m.money-=v; if(p){ p.money=(p.money||0)+v; p.bond=clamp(p.bond+10); } return R.chance(.4)?`Emprestei ${fmt(v)}. O negócio deu certo e já estão me pagando.`:`Emprestei ${fmt(v)}. Nunca mais vi o dinheiro.`; }],
    ['Ajudar a fazer um plano antes','plano',(m,d)=>{ const p=P(d.pid); if(p) p.bond=clamp(p.bond+4); st('smarts',1); return 'Sentamos uma tarde inteira com planilhas. Desistiu da ideia, mas agradeceu.'; }],
    ['Negar','negar',(m,d)=>{ const p=P(d.pid); if(p) p.bond=clamp(p.bond-12); return 'Ficou sem falar comigo no Natal.'; }]]});
