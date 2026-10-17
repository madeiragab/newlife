// ===== Identidade de gênero e orientação sexual =====
// m.ident: cis | trans | nb (não binárie)   m.sexo: sexo biológico (M/F, decide quem pode engravidar)
// m.orient: hetero | gay | bi | pan | assexual   (m.pref continua sendo de quem a pessoa gosta: M, F ou A)
const ORIENT={hetero:'Heterossexual',gay:'Gay|Lésbica',bi:'Bissexual',pan:'Pansexual',assexual:'Assexual'};

const sexoDe=x=>x&&(x.sexo||x.gender);
function prefDe(gender,orient){ return orient==='gay'?gender:orient==='bi'||orient==='pan'||orient==='assexual'?'A':(gender==='M'?'F':'M'); }
function identTxt(m){ const o=m.orient||'hetero', i=m.ident||'cis'; const id=i==='nb'?'Pessoa não binária':i==='trans'?(m.gender==='F'?'Mulher trans':'Homem trans'):(m.gender==='F'?'Mulher cis':'Homem cis'); return `${id} · ${g(ORIENT[o],m.gender)}`; }
newLife=(o=>function(opt={}){ const r=o.apply(this,arguments); const m=S.me;
  m.orient=opt.orient||R.wpick([['hetero',85],['gay',6],['bi',6],['pan',1.5],['assexual',1.5]]);
  m.ident=opt.ident||R.wpick([['cis',97.5],['trans',1.5],['nb',1]]);
  m.sexo=m.ident==='trans'?(m.gender==='M'?'F':'M'):m.gender;
  if(!opt.pref) m.pref=prefDe(m.gender,m.orient);
  return r; })(newLife);
// gravidez decidida pelo sexo biológico, não pelo gênero
interact=(o=>function(p,k,extra){ if(k!=='amor'&&k!=='filho') return o.apply(this,arguments); const m=S.me, g0=m.gender, pg=p.gender;
  // truque: troca temporariamente o gênero pelo sexo biológico só para a conta da gravidez
  m.gender=sexoDe(m); p.gender=sexoDe(p); let r; try{ r=o.apply(this,arguments); } finally{ m.gender=g0; p.gender=pg; } return r; })(interact);
// tela "Eu": identidade e orientação
V.me=(o=>()=>{ const r=o(), m=S.me; if(r&&r.items&&m.orient){ r.items.splice(1,0,{html:`<div class="card"><p style="font-size:13px">🏳️‍🌈 ${esc(identTxt(m))}</p></div>`}); } return r; })(V.me);
// sair do armário e transição
EVENTS.sair_armario={w:2.5,min:13,max:22,onceLife:1,cd:99,when:m=>m.age>=13&&m.age<=22&&m.orient&&m.orient!=='hetero'&&!m.c.assumiu&&!m.prison&&!S.scen,
  prep:()=>({}),
  show:()=>{ const m=S.me; return {k:'Identidade',t:'Quem eu sou',x:m.orient==='assexual'?'Percebi que não sinto atração sexual por ninguém, e que está tudo bem. Mas ninguém em casa entende isso.':`Tenho certeza: sou ${g(ORIENT[m.orient],m.gender).toLowerCase()}. Guardar isso está pesando.`,ch:[['Contar para a família','f'],['Contar só para os amigos','a'],['Guardar segredo por enquanto','s']]}; },
  pick:k=>{ const m=S.me; if(k==='s'){ st('happy',-4); return 'Guardei para mim. Um dia eu conto.'; } m.c.assumiu=1; cnt('assumiu');
    if(k==='a'){ st('happy',8); people('amigo').forEach(p=>p.bond=clamp(p.bond+R.int(2,8))); return 'Meus amigos me abraçaram. Um deles disse: "A gente já sabia e te ama do mesmo jeito."'; }
    const ps=parents(); if(!ps.length){ st('happy',8); return 'Contei para quem é minha família de verdade. Fui acolhid'+oa()+'.'; }
    let t=[]; ps.forEach(p=>{ const ok=R.chance(clamp(p.bond+10,10,95)/100); if(ok){ p.bond=clamp(p.bond+8); t.push(`${p.first} me abraçou e disse que me ama do jeito que eu sou.`); } else { p.bond=clamp(p.bond-25); t.push(`${p.first} ficou em silêncio e saiu da sala. Vai precisar de tempo.`); } });
    st('happy',t.some(x=>x.includes('abraçou'))?10:-6); return t.join(' '); }};
EVENTS.transicao={w:2.5,min:14,max:40,onceLife:1,cd:99,when:m=>m.age>=14&&m.age<=40&&m.ident==='trans'&&!m.c.transicao&&!m.prison&&!S.scen,
  prep:()=>({}),
  show:()=>{ const m=S.me; return {k:'Identidade',t:'Transição',x:`Sempre soube que sou ${m.gender==='F'?'mulher':'homem'}. Chegou a hora de viver isso por inteiro: nome social, roupas, acompanhamento médico.`,ch:[['Começar a transição com acompanhamento médico','m'],['Começar aos poucos, só com roupas e nome','r'],['Esperar mais um pouco','e']]}; },
  pick:k=>{ const m=S.me; if(k==='e'){ st('happy',-5); return 'Ainda não. Mas um dia.'; } m.c.transicao=1; cnt('transicao');
    if(k==='m'){ if(m.money<3000&&m.age>=18) return 'O acompanhamento custa dinheiro que ainda não tenho. Vou juntar.'; if(m.age>=18) m.money-=3000; st('happy',18); st('looks',R.int(2,8)); }
    else st('happy',12);
    const ps=parents(); const rej=ps.filter(p=>!R.chance(clamp(p.bond+5,10,95)/100)); rej.forEach(p=>p.bond=clamp(p.bond-25)); ps.filter(p=>!rej.includes(p)).forEach(p=>p.bond=clamp(p.bond+6));
    log('Comecei minha transição. Pela primeira vez, o espelho mostra quem eu sou.','good');
    return rej.length?`Algumas pessoas da família não aceitaram (${rej.map(p=>p.first).join(', ')}). Mas eu nunca me senti tão eu.`:'A família me apoiou. Pela primeira vez, me sinto em casa no meu corpo.'; }};
// tela inicial: escolher orientação e identidade na vida personalizada
showStart=(o=>function(){ const r=o.apply(this,arguments); try{ const gsel=document.getElementById('fGender'); if(gsel&&!document.getElementById('fOrient')){
  const row=gsel.closest('.grid2'); row.insertAdjacentHTML('afterend',`<div class="grid2"><label class="f">Orientação<select class="in" id="fOrient"><option value="">Aleatória</option>${Object.entries(ORIENT).map(([k,v])=>`<option value="${k}">${v.replace('|','/')}</option>`).join('')}</select></label>
    <label class="f">Identidade<select class="in" id="fIdent"><option value="">Aleatória</option><option value="cis">Cis</option><option value="trans">Trans</option><option value="nb">Não binárie</option></select></label></div>`);
 } }catch(e){showErr(e);} return r; })(showStart);
