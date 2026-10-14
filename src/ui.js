// ===== Interface =====
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const DOTS=['#5B7BE0','#E0795B','#3FA37A','#B25BE0','#E0B33F','#3FA0B8','#D9577F','#7A8A3F'];
const dotOf=p=>[(p.first||'?')[0]+(p.rel==='pet'?'':(p.last||'')[0]||''),DOTS[p.id%DOTS.length]];
const tone=v=>v>=60?'var(--good)':v>=30?'var(--warn)':'var(--bad)';
const grad=v=>v>=70?'linear-gradient(90deg,#3BB273,#5DD39E)':v>=45?'linear-gradient(90deg,#8CC63F,#C5E063)':v>=25?'linear-gradient(90deg,#F2A93B,#F6C85F)':'linear-gradient(90deg,#E5484D,#F0756E)';
const bar=(l,v)=>`<div class="mini"><b>${esc(l)}</b><div class="bar"><i style="width:${v}%;background:${grad(v)}"></i></div><span>${v}%</span></div>`;
const kv=(k,v)=>`<div class="kv"><span>${esc(k)}</span><b>${esc(v)}</b></div>`;

// ---------- painel deslizante ----------
const UI={
  stack:[],items:[],
  open(v){ this.stack=[v]; this.draw(); },
  push(v){ this.stack.push(v); this.draw(); },
  back(){ this.stack.pop(); this.stack.length?this.draw():this.close(); },
  close(){ this.stack=[]; $('#sheetWrap').hidden=true; },
  refresh(){ if(this.stack.length&&!$('#sheetWrap').hidden) this.draw(); },
  draw(){
    const v=this.stack[this.stack.length-1]; let r;
    try{ r=v(); }catch(e){ showErr(e); return; }
    if(!r){ this.back(); return; }
    this.items=r.items;
    $('#sheetTitle').textContent=r.title;
    $('#sheetBack').style.visibility=this.stack.length>1?'visible':'hidden';
    $('#sheetBody').innerHTML=r.items.map(rowHtml).join('');
    $('#sheetWrap').hidden=false;
    if(r.after) r.after($('#sheetBody'));
  },
};
const ICONS=[
 [/^eu:/i,'🙂'],[/academia|malhar/i,'🏋️'],[/biblioteca|ler |livro|escrever|escrita|literatura/i,'📚'],[/medita|ioga/i,'🧘'],[/caminhada|passear/i,'🚶'],[/artes marciais|karatê|jiu|capoeira|judô|boxe|muay|taekwondo|kung/i,'🥋'],
 [/música|musical|banda|dj/i,'🎵'],[/teatro|atuação/i,'🎭'],[/esport|treino/i,'⚽'],[/pintura|artes plásticas|desenho/i,'🎨'],[/humor|comédia|piada|streaming/i,'😂'],[/salão|cabelo|corte/i,'💇'],
 [/spa/i,'🧖'],[/dieta|besteira/i,'🥗'],[/médico|consulta|hospital/i,'🩺'],[/terapia/i,'🛋️'],[/reabilita/i,'💊'],[/cirurgia/i,'💉'],[/medicina alternativa/i,'🌿'],
 [/procurar alguém|encontro/i,'💘'],[/aplicativo de namoro/i,'📱'],[/ficar com/i,'💋'],[/interesse/i,'🌈'],[/balada/i,'🪩'],[/show/i,'🎤'],[/loteria/i,'🎟️'],[/vinte e um/i,'🃏'],
 [/roleta/i,'🎡'],[/caça-níquel/i,'🎰'],[/corrida de cavalos/i,'🏇'],[/viage|visita oficial/i,'✈️'],[/crime|furtar|carteira|invadir|roubar|golpe|assaltar|pichar|assassinar|sacrificar/i,'🦹'],
 [/bicho|abrigo|criador/i,'🐾'],[/redes sociais|postar|perfil/i,'📲'],[/autoescola/i,'🚗'],[/adotar/i,'🍼'],[/emigrar/i,'🌎'],[/mente e corpo/i,'🧠'],[/saúde/i,'❤️'],[/^amor/i,'💞'],
 [/diversão/i,'🎉'],[/visual|aparência|estilo|maquiagem|óculos|chapéu|barba|brinco|piercing|roupa/i,'💄'],[/estudar|escola|cursinho|supletivo/i,'✏️'],[/professor/i,'🧑‍🏫'],[/matar aula/i,'🛹'],[/clube|time/i,'🏅'],[/turma/i,'👫'],
 [/faculdade|universidade|pós-graduação|curso técnico|largar os estudos/i,'🎓'],[/trabalhar mais|trabalho/i,'💼'],[/aumento/i,'💵'],[/promoção/i,'📈'],[/colegas/i,'👔'],[/aposent/i,'🏖️'],
 [/demissão/i,'🚪'],[/vagas|meio período/i,'📋'],[/carreiras especiais/i,'🌟'],[/política|lei popular|discurs|impostos|desviar|renunciar|feriado|perdão real/i,'🏛️'],[/empresa|marketing|lucros|bolsa/i,'🏢'],
 [/acenar|realeza|caridade|abdicar|títulos|entrevista/i,'👑'],[/imóve|reformar|festa em casa/i,'🏠'],[/veículo|volta|consertar/i,'🚘'],[/loja/i,'🛍️'],[/investimento|investir/i,'📊'],[/vender/i,'🏷️'],
 [/nova vida/i,'🍼'],[/modo deus/i,'⚡'],[/máquina do tempo/i,'⏳'],[/desafios/i,'🏆'],[/dificuldade/i,'🎚️'],[/selos/i,'🎖️'],[/cemitério/i,'🪦'],[/^tema/i,'🌓'],[/como jogar/i,'❓'],
 [/fugir|recurso/i,'🔓'],[/briga/i,'👊'],[/conversar|ligar/i,'💬'],[/elogiar/i,'🌷'],[/abraçar/i,'🤗'],[/presente/i,'🎁'],[/dinheiro/i,'💰'],[/insultar|discutir/i,'😠'],[/flertar|casamento|voltar/i,'💍'],
 [/filho/i,'👶'],[/terminar|divórcio/i,'💔'],[/passar tempo|brincar/i,'⏰'],[/visitar/i,'🏡'],[/castigo/i,'🙅'],[/amigo|pazes/i,'🤝'],[/puxar o saco/i,'🙇'],[/peça/i,'🤡'],[/história/i,'📖'],[/veterinário/i,'🏥'],[/doar/i,'📦'],
];
let iconFor=l=>{ for(const [re,ic] of ICONS) if(re.test(l)) return ic; return null; };
function rowHtml(it,i){
  if(!it) return '';
  if(it.sec) return `<div class="sec">${esc(it.sec)}</div>`;
  if(it.html!=null) return it.html;
  if(it.btns) return `<div class="btns">${it.btns.map((b,j)=>`<button class="btn ${b.cls||''}" data-i="${i}" data-j="${j}" ${b.dis?'disabled':''}>${esc(b.l)}</button>`).join('')}</div>`;
  const tag=it.on||it.why?'button':'div';
  const icon=it.ic!==false&&(it.ic||iconFor(it.l||''));
  const lead=it.face?`<span class="fw">${it.face}</span>`:!it.dot&&icon?`<span class="ic">${icon}</span>`:'';
  return `<${tag} class="row ${it.dis?'dis':''} ${it.tone||''}" data-i="${i}">${lead}${it.dot?`<span class="dot" style="background:${it.dot[1]}">${esc(it.dot[0])}</span>`:''}<span class="tx"><span class="l">${esc(it.l)}</span>${it.s?`<span class="s">${esc(it.s)}</span>`:''}${it.bars?`<span class="rbars">${it.bars.map(([ic,v,c])=>`<span class="rb"><b>${ic}</b><span class="rbt"><i style="width:${v}%;background:${c}"></i></span></span>`).join('')}</span>`:''}</span>${it.r!=null?`<span class="r">${esc(it.r)}</span>`:''}</${tag}>`;
}
function sheetClick(e){
  const el=e.target.closest('[data-i]'); if(!el) return;
  const it=UI.items[+el.dataset.i]; if(!it) return;
  if(el.dataset.j!=null){ const b=it.btns[+el.dataset.j]; if(b&&b.on&&!b.dis) b.on(); return; }
  if(it.dis){ if(it.why) msg('Ainda não',it.why); return; }
  if(it.on) it.on();
}

// ---------- modais ----------
const MQ=[]; let modalOpen=false;
const KICK_EMOJI={'Família':'👨‍👩‍👧','Escola':'🏫','Rua':'🛣️','Sorte':'🍀','Social':'🎉','Tentação':'🚬','Coração':'💌','Estudos':'📝','Talento':'🌟','Oportunidade':'🚀','Música':'🎸','TV':'📺','Ética':'⚖️','Telefone':'📞','Dinheiro':'💵','Perigo':'⚠️','Trânsito':'🚦','Surpresa':'🎁','Vizinhança':'🏘️','Carreira':'💼','Trabalho':'💼','Negócio':'📈','Casa':'🏠','Desastre':'🌪️','Internet':'📱','Bicho':'🐾','Amor':'❤️','Filhos':'🧸','Dever cívico':'🏛️','Saúde':'🩺','Carro':'🔧','Meia-idade':'🏍️','Estilo':'🖋️','Má companhia':'🕶️','Impostos':'🧾','Solidariedade':'🤝','Encontro':'⭐','Festa':'💒','Forças Armadas':'🎖️','Crime':'🚨','Fama':'📸','Prisão':'⛓️','Mudança':'📦','Formatura':'🎓','Política':'🗳️','Justiça':'⚖️','Visual':'💇','Realeza':'👑','Coroa':'👑','Empresa':'🏢','Viagem':'✈️','Balada':'🪩','Roleta':'🎡','Corrida':'🏇','Resultado':'🎟️','Cirurgia':'💉','Adoção':'🍼','Emigração':'🌎','Autoescola':'🚗','Redes sociais':'📲','Fuga':'🔓','Encontro ':'💘','Aplicativo':'📱','Escola ':'🏫','Hospital':'🏥','Consultório':'🩺','Tribunal':'⚖️','Pesquisa':'🔬','Tecnologia':'💻','Loja':'🛒','Obra':'🏗️','Estrada':'🚚','Plantão':'🚓','Escritório':'🗂️','Salão':'💈','Redação':'📰','Céu':'✈️','Embaixada':'🏛️','Cinema':'🎬','Esporte':'🏆','Moda':'👗','Comédia':'🎤','Literatura':'📖','Arte':'🎨','Streaming':'🎮','Comércio':'🛍️','Mistério':'🔮','Concurso':'🏅','Bairro':'🏘️','Polícia':'🚔','Internação':'🏫','Infância':'🧸','Passeio':'🏛️','Faculdade':'🎓','Medicina':'🩻','Direito':'📜','Engenharia':'⚙️','Artes':'🎭','Casamento':'💍','Luto':'🕯️','Vida':'🌱','Velhice':'👴','Vício':'🚫','Cultura':'🎊','Fuga':'🏃','Viagem':'✈️','Arte ':'🎨'};
function modal(o){ MQ.push(o); pump(); }
function msg(t,x){ modal({t,x}); }
function pump(){
  if(modalOpen) return;
  let o=MQ.shift();
  while(!o&&S&&S.me.alive&&S.pending.length&&!evValid(S.pending[0])) S.pending.shift();
  if(!o&&S&&S.me.alive&&S.pending.length){
    const e=S.pending[0],ev=EVENTS[e.id];
    let sh; try{ sh=ev.show(e.d); }catch(err){ S.pending.shift(); showErr(err); return pump(); }
    const who=['pid','p','s','b','k'].map(k=>typeof e.d[k]==='number'?P(e.d[k]):null).find(Boolean);
    const sf=!who&&e.d.n&&String(sh.x).includes(e.d.n)?strangerFace(e.d):null;
    const cf=!who&&!sf&&e.d.cid&&typeof crewFace==='function'?crewFace(e.d.cid):null;
    o={k:sh.k,t:sh.t,x:sh.x,top:who?faceSVG(who,88):sf?faceSVG(sf,88):cf,ch:sh.ch.map(([l,key])=>({l,fn:()=>{
      S.pending.shift(); let res; try{ res=ev.pick(key,e.d); }catch(err){ showErr(err); }
      log(sh.t.replace(/[!?.…]+$/,'')+' → '+l+(res?'. '+res:'.'),'choice'); if(res) MQ.unshift({k:sh.k,t:sh.t,x:res});
    }}))};
  }
  if(!o){ if(S&&!S.me.alive&&$('#death').hidden) showDeath(); return; }
  modalOpen=true;
  const ch=o.ch||[{l:'OK'}];
  const top=o.top||(o.k&&KICK_EMOJI[o.k]?`<div class="mk">${KICK_EMOJI[o.k]}</div>`:'');
  $('#modal').innerHTML=`${top?`<div class="mtop">${top}</div>`:''}${o.k?`<div class="kick">${esc(o.k)}</div>`:''}<h2>${esc(o.t||'')}</h2>${o.x?`<div class="txt">${esc(o.x)}</div>`:''}${o.html||''}<div class="choices">${ch.map((c,i)=>`<button class="btn ${c.cls||(i?'alt':'')}" data-c="${i}">${esc(c.l)}</button>`).join('')}</div>`;
  $('#modalWrap').hidden=false;
  $('#modal').onclick=ev=>{ const b=ev.target.closest('[data-c]'); if(!b) return; const c=ch[+b.dataset.c]; $('#modalWrap').hidden=true; modalOpen=false; if(c.fn) c.fn(); after(); };
  const first=$('#modal').querySelector('button'); if(first) first.focus({preventScroll:true});
}
function after(){ const m=S.me; coverMinor(); if(m.alive&&m.health<=0) die(causeFromHealth()); save(); render(); UI.refresh(); pump(); }
function act(fn,title){
  if(!S.me.alive) return;
  const before=S.log[S.log.length-1].lines.length;
  let r; try{ r=fn(); }catch(e){ showErr(e); return; }
  cnt('actions');
  const lm=S.me.yr&&S.me.yr.loadMsg; if(lm) delete S.me.yr.loadMsg;
  if(r){ const t=typeof r==='string'?r:r.t; if(S.log[S.log.length-1].lines.length===before&&t) log(t); modal({t:title||'',x:t+(lm?'\n\n⚠️ '+lm:'')}); }
  else if(lm) modal({t:'Cansaço',x:'⚠️ '+lm});
  after();
}
function confirmBox(t,x,yes,fn){ modal({t,x,ch:[{l:yes,fn,cls:'danger'},{l:'Cancelar',cls:'alt'}]}); }

// ---------- tela principal ----------
function render(){
  if(!S) return; const m=S.me;
  $('#hName').textContent=`${m.first} ${m.last}`;
  $('#hSub').innerHTML=flagSVG(m.country,16)+' '+esc(`${m.age} ${m.age===1?'ano':'anos'} · ${occupation()} · ${m.city}`);
  const minor=m.age<18&&parents().length; $('#hMoney').textContent=fmt(m.money); $('#hdr .lbl').textContent='Saldo';   // sempre o dinheiro do próprio personagem (a família continua tendo o dela)
  $('#hMoney').style.color=''; $('#hMoney').classList.toggle('neg',m.money<0);
  $('#avatar').innerHTML=faceSVG(m,46);
  
  const html=S.log.map(y=>`<section class="yr ph${y.age<13?0:y.age<18?1:y.age<40?2:y.age<65?3:4}"><h3><span>${y.age} ${y.age===1?'ano':'anos'}</span><span>${y.year}</span></h3>${y.lines.map(l=>typeof l==='string'?`<p>${esc(l)}</p>`:`<p class="${l.c}">${esc(l.t)}</p>`).join('')||'<p class="s" style="color:var(--muted)">Um ano tranquilo.</p>'}</section>`).join('');
  const lg=$('#log'); const atBottom=lg.scrollTop+lg.clientHeight>=lg.scrollHeight-40;
  lg.innerHTML=html; if(atBottom||render.jump){ lg.scrollTop=lg.scrollHeight; render.jump=false; }
  const st=[['😊','Felicidade',m.happy],['❤️','Saúde',m.health],['🧠','Inteligência',m.smarts],['✨','Aparência',m.looks]];
  $('#stats').innerHTML=st.map(([e,l,v])=>`<div class="st"><span class="se">${e}</span><b>${l}</b><div class="bar"><i style="width:${v}%;background:${grad(v)}"></i></div><span>${v}%</span></div>`).join('');
}
function doAge(){ if(!S||!S.me.alive||S.pending.length||MQ.length||modalOpen) return; UI.close(); try{ ageUp(); }catch(e){ showErr(e); } render.jump=true; after(); }

// ---------- views ----------
const V={};
const ageGate=(min,l)=>S.me.age<min?{dis:true,why:`Disponível a partir dos ${min} anos.`,r:`${min}+`}:{};

V.career=()=>{
  const m=S.me,it=[];
  if(m.prison){ it.push({html:`<div class="card"><p><b>Penitenciária ${esc(m.city)}</b></p>${kv('Crime',m.prison.crime)}${kv('Pena restante',m.prison.left+' ano(s)')}${kv('Comportamento',m.prison.behav+'%')}</div>`}); return {title:'Prisão',items:it.concat(prisonItems())}; }
  const c=m.edu.cur;
  if(c){
    it.push({sec:'Estudos'});
    it.push({html:`<div class="card"><p><b>${esc(c.n)}</b></p>${kv('Ano',`${Math.min(c.yr+1,c.len)} de ${c.len}`)}${c.pub?kv('Instituição','Pública'):''}${m.edu.club?kv('Atividade',m.edu.club):''}${bar('Nota',c.grade)}</div>`});
    it.push({l:'Estudar mais',s:'Melhora as notas',on:()=>act(study,'Estudos')});
    if(c.type==='fund'||c.type==='medio'){
      it.push({l:'Conversar com o professor',on:()=>act(talkTeacher,'Escola')});
      it.push({l:'Matar aula',on:()=>act(skipClass,'Escola')});
      it.push(m.edu.club?{ic:'🏅',l:'Meu clube: '+m.edu.club,s:'Treinar, faltar, disputar posição, sair',on:()=>UI.push(V.clubMenu)}:{l:'Entrar em um clube ou time',s:'Teatro, esporte, música, xadrez…',on:()=>UI.push(V.clubs)});
    }
    if(c.type!=='fund'&&(c.type!=='medio'||m.age>=16)) it.push({l:'Largar os estudos',tone:'bad',on:()=>confirmBox('Largar os estudos?',`Vou abandonar ${c.n}.`,'Largar',()=>act(dropOut,'Estudos'))});
  } else if(m.age>=17&&hasDeg('medio')){
    it.push({sec:'Estudos'});
    it.push({l:'Faculdade',s:'Pública ou particular',on:()=>UI.push(V.uniList)});
    it.push({l:'Curso técnico',s:'Rápido e barato',on:()=>UI.push(V.techList)});
    it.push({l:'Pós-graduação',s:'Mestrado, doutorado, MBA, residência',on:()=>UI.push(V.postList)});
    it.push({l:'Cursinho pré-vestibular',s:'Ajuda a passar na universidade pública',r:fmt(4000),on:()=>act(()=>{ if(!canPay(4000)) return 'Não tenho dinheiro para o cursinho.'; S.me.money-=4000; cnt('cursinho'); st('smarts',R.int(2,5)); return 'Fiz um ano de cursinho. Estou mais preparad'+oa()+' para o vestibular.'; },'Cursinho')});
  } else if(m.age>=16&&!hasDeg('medio')&&!c){
    it.push({sec:'Estudos'});
    it.push({l:'Voltar a estudar (supletivo)',s:'Termina o ensino médio',on:()=>act(()=>{ S.me.edu.cur={type:'medio',n:'Ensino Médio (supletivo)',len:2,yr:0,grade:clamp(S.me.smarts*.7)}; return 'Me matriculei no supletivo.'; },'Estudos')});
  }
  if(m.age>=13&&!m.prison) it.push({ic:'🧹',l:'Fazer bicos',s:'Dinheiro rápido: carro, cachorro, brigadeiro…',on:()=>UI.push(V.bicos)});
  if(m.job){
    const j=m.job,d=j.spc?null:JOBS.find(x=>x.id===j.id);
    it.push({sec:'Trabalho'});
    it.push({html:`<div class="card"><p><b>${esc(jobTitle(j))}</b></p>${kv('Onde',j.co)}${kv('Salário',fmt(jobSalary(j))+'/ano')}${kv('Tempo de casa',j.yrs+' ano(s)')}${bar('Desempenho',j.perf)}${loadBar()}</div>`});
    it.push({ic:'💼',l:'Meu emprego',s:'Ritmo de trabalho, hora extra, aumento, atestado, demissão',on:()=>UI.push(V.jobMenu)});
  }
  if(m.office){
    const o=m.office,od=OFFICES.find(x=>x.id===o.id);
    it.push({sec:'Mandato'});
    it.push({html:`<div class="card"><p><b>${esc(g(od.n,m.gender))}</b></p>${kv('Ano de mandato',`${o.yrs+1} de 4`)}${kv('Salário',fmt(od.sal)+'/ano')}${bar('Aprovação',o.appr)}</div>`});
    [['lei','Aprovar uma lei popular'],['discurso','Fazer um discurso'],['imposto','Aumentar impostos'],['desvio','Desviar verba (arriscado)'],['renuncia','Renunciar']].forEach(([k,l])=>it.push({l,tone:k==='desvio'||k==='renuncia'?'bad':'',on:()=>act(()=>officeAct(k),'Política')}));
  }
  if(m.royal&&!m.royal.abd){
    const r=m.royal;
    it.push({sec:'Realeza'});
    it.push({html:`<div class="card"><p><b>${esc(royalTitle())} · ${esc(r.house)}</b></p>${kv('Renda real',fmt(r.reign?5000000:m.age>=18?400000:0)+'/ano')}${bar('Popularidade',r.pop)}</div>`});
    [['acenar','Acenar para o povo'],['caridade','Evento de caridade ($100.000)'],['viagem','Visita oficial ao exterior'],['entrevista','Dar uma entrevista']].forEach(([k,l])=>it.push({l,on:()=>act(()=>royalAct(k),'Realeza')}));
    if(r.reign) [['discurso','Discursar para a nação'],['feriado','Decretar feriado nacional'],['impostos','Aumentar os impostos reais'],['perdao','Conceder perdão real']].forEach(([k,l])=>it.push({l,on:()=>act(()=>royalAct(k),'Coroa')}));
    if(m.age>=16) it.push({l:r.reign?'Abdicar do trono':'Renunciar aos títulos',tone:'bad',on:()=>confirmBox('Tem certeza?','Não dá para voltar atrás.','Confirmar',()=>act(()=>royalAct('abdicar'),'Realeza'))});
  }
  if(m.biz){
    const b=m.biz;
    it.push({sec:'Minha empresa'});
    it.push({html:`<div class="card"><p><b>${esc(b.n)}</b> · ${esc(b.sector)}</p>${kv('Valor de mercado',fmt(b.value))}${kv('Funcionários',b.emp)}${kv('Anos de vida',b.yrs)}${b.pub?kv('Bolsa de valores','Capital aberto'):''}</div>`});
    it.push({l:'Investir na empresa',on:()=>modal({t:'Investir quanto?',ch:[10000,100000,1000000].filter(v=>v<=m.money).map(v=>({l:fmt(v),fn:()=>{ const r=bizAct('invest',v); MQ.unshift({t:b.n,x:r}); }})).concat([{l:'Cancelar',cls:'alt'}])})});
    it.push({l:'Campanha de marketing',s:fmt(Math.max(2000,b.value*.05)),on:()=>act(()=>bizAct('mkt'),b.n)});
    it.push({l:'Retirar lucros',s:'10% do valor',on:()=>act(()=>bizAct('lucro'),b.n)});
    it.push({l:'Abrir capital na bolsa',s:'Empresas acima de $50 milhões',on:()=>act(()=>bizAct('ipo'),b.n)});
    it.push({l:'Vender a empresa',on:()=>confirmBox('Vender?',`Vender a ${b.n}?`,'Vender',()=>act(()=>bizAct('vender'),b.n))});
    it.push({l:'Fechar a empresa',tone:'bad',on:()=>confirmBox('Fechar?','Perco tudo o que está investido.','Fechar',()=>act(()=>bizAct('fechar'),b.n))});
  }
  it.push({sec:'Oportunidades'});
  if(!m.biz) it.push(Object.assign({l:'Abrir uma empresa',s:'Lanchonete, startup, construtora…',on:()=>UI.push(V.bizList)},ageGate(18)));
  it.push(Object.assign({l:m.age<18?'Trabalho de meio período':'Vagas de emprego',s:'Lista renovada todo ano',on:()=>UI.push(V.jobs)},ageGate(13)));
  it.push(Object.assign({l:'Carreiras especiais',s:'Atuação, música, esporte, moda, Forças Armadas…',on:()=>UI.push(V.special)},ageGate(8)));
  it.push(Object.assign({l:'Política',s:'Concorrer a uma eleição',on:()=>UI.push(V.politics)},ageGate(21)));
  if(m.ret) it.push({html:`<div class="card">${kv('Aposentadoria',fmt(m.ret.pension)+'/ano')}</div>`});
  if(m.edu.deg.length||m.hist.length){
    it.push({sec:'Currículo'});
    const degs=m.edu.deg.map(d=>d==='fund'?'Ensino Fundamental':d==='medio'?'Ensino Médio':d.startsWith('uni:')?'Graduação em '+(COURSES.find(c=>c.id===d.slice(4))||{}).n:d.startsWith('tec:')?(TECHS.find(c=>c.id===d.slice(4))||{}).n:(POSTS.find(c=>c.id===d.slice(5))||{}).n);
    it.push({html:`<div class="card">${degs.map(d=>`<p>${esc(d)}</p>`).join('')}${m.hist.slice(-6).map(h=>`<p style="color:var(--muted)">${esc(h.t)} · ${esc(h.co)} · ${h.yrs}a</p>`).join('')}</div>`});
  }
  return {title:'Carreira',items:it};
};
V.bizList=()=>({title:'Abrir empresa',items:[{html:'<div class="card"><p>A empresa cresce ou encolhe todo ano. Setores arriscados podem explodir ou falir. Inteligência ajuda.</p></div>'}].concat(BIZ_SECTORS.map(s=>({l:s.n,s:`Risco ${s.risk>=.35?'alto':s.risk>=.2?'médio':'baixo'}`,r:fmt(s.cost),on:()=>{ const nm=R.pick(BIZ_NAMES); confirmBox('Abrir empresa?',`Abrir "${nm}" (${s.n.toLowerCase()}) por ${fmt(s.cost)}?`,'Abrir',()=>{ UI.close(); act(()=>openBiz(s,nm),'Empresa'); }); }})))});
V.jobMenu=()=>{ const m=S.me,j=m.job; if(!j) return {title:'Emprego',items:[{html:'<div class="card"><p>Não tenho emprego no momento.</p></div>'}]};
  const d=j.spc?null:JOBS.find(x=>x.id===j.id), it=[];
  it.push({html:`<div class="card"><p><b>${esc(jobTitle(j))}</b> · ${esc(j.co)}</p>${bar('Desempenho',j.perf)}${loadBar()}<p style="color:var(--muted);font-size:13px">Desempenho acima de 80% por dois anos (ou acima de 92%) dá promoção. Esforço demais cansa e pode virar burnout.</p></div>`});
  it.push({sec:'Ritmo de trabalho'});
  it.push({ic:'🔥',l:'Trabalhar mais',s:'Mais desempenho · cansa bastante',on:()=>act(workHarder,'Trabalho')});
  if(!j.spc) it.push({ic:'⏰',l:'Fazer hora extra',s:'Dinheiro a mais · cansa muito',on:()=>act(overtime,'Hora extra')});
  it.push({ic:'🙂',l:'Trabalhar normalmente',s:'Sem esforço extra',on:()=>msg('Trabalho','Vou manter o ritmo normal.')});
  it.push({ic:'🛋️',l:'Fazer corpo mole',s:'Descansa, mas o desempenho cai',on:()=>act(slackOff,'Trabalho')});
  if(!j.spc) it.push({ic:'🍎',l:'Puxar o saco do chefe',on:()=>act(suckUp,'Trabalho')});
  it.push({sec:'Carreira'});
  if(!j.spc) it.push({ic:'🪜',l:'Plano de carreira',s:promoNeed(j),on:()=>UI.push(V.careerTree)});
    if(j.spc==='crime') it.push({ic:'🏴',l:'Facção',s:'Corres, postos e pressão da polícia',on:()=>UI.push(V.faccao)});
    else if(j.spc) it.push({l:SPECIAL[j.spc].act,s:'Pode dar muito certo, ou não',on:()=>act(specialAction,SPECIAL[j.spc].n)});
    if(!j.spc){ const ac=atestCount(j); it.push({ic:'🩺',l:'Pedir atestado',s:ac.n?`Este ano: ${ac.n} atestado(s)${ac.load>=2?' · cuidado, pode ser demitid'+oa():''}`:'Folga por motivo de saúde',tone:ac.load>=2?'bad':'',on:()=>UI.push(()=>({title:'Atestado',items:[
      {html:`<div class="card"><p>Atestado dá folga e ajuda a recuperar a saúde, mas faltar demais derruba o desempenho e pode levar à demissão.</p>${kv('Atestados este ano',String(ac.n))}</div>`},
      {ic:'🏥',l:'Ir ao médico',s:S.me.dis.length||S.me.health<45?'Estou doente de verdade':'O médico só dá atestado se eu estiver doente',on:()=>act(()=>sickNote('real'),'Atestado')},
      {ic:'📝',l:'Comprar atestado falso',s:'$300 · se descobrirem, é justa causa',tone:'bad',on:()=>act(()=>sickNote('fake'),'Atestado')}]}))}); }
    it.push({l:'Pedir aumento',on:()=>act(askRaise,'Trabalho')});
    if(!(d&&d.pt)) it.push({l:'Pedir promoção',on:()=>act(askPromo,'Trabalho')});
    if(!j.spc) it.push({l:'Colegas e chefe',on:()=>UI.push(()=>({title:'Trabalho',items:people('chefe','colegaT').map(p=>personRow(p))}))});
    if(m.age>=55&&!j.spc) it.push({l:'Me aposentar',on:()=>confirmBox('Aposentar?','Vou parar de trabalhar e receber aposentadoria.','Aposentar',()=>act(()=>{ retire(); log('Me aposentei.','good'); return `Me aposentei com ${fmt(S.me.ret.pension)}/ano.`; },'Aposentadoria'))});
    it.push({l:'Pedir demissão',tone:'bad',on:()=>confirmBox('Pedir demissão?','Vou sair do emprego.','Sair',()=>act(quitJob,'Trabalho'))});
  return {title:'Meu emprego',items:it}; };
V.clubs=()=>({title:'Clubes e times',items:CLUBS.map(c=>({l:c.n,on:()=>act(()=>joinClub(c),'Escola')}))});
function payFlow(cost,cb,ctx){
  UI.push(()=>({title:'Como vou pagar?',items:[{html:`<div class="card">${kv('Custo anual',fmt(cost))}${ctx&&ctx.kind==='uni'?kv('Minha nota no vestibular',pts(examScore())+' / 1000'):''}</div>`}].concat(payOptions(cost,ctx).map(o=>({ic:o.ic,l:o.l,s:o.s,dis:!o.ok,why:o.why||'Não é possível agora.',on:()=>{
    UI.close(); act(()=>cb(o.disc?(o.disc>=1?null:o.pay):o.k,o.disc||0),o.disc?'Bolsa de estudos':'Matrícula');
  }})))}));
}
V.uniList=()=>{ const sc=examScore();
  return {title:'Faculdade',items:[{html:`<div class="card"><p>Entrar não é sorte. Na <b>pública</b> (grátis) passa quem tem nota acima da nota de corte. Na <b>particular</b> precisa da nota mínima e de um jeito de pagar: família, bolsa por nota, bolsa de atleta, bolsa de música/arte, financiamento ou dinheiro próprio.</p>${kv('Minha nota no vestibular',pts(sc)+' / 1000')}${['f1','f2','m'].map(t=>{ const a=schoolAvg(S.me,t); return a==null?'':kv({f1:'Média no fundamental 1',f2:'Média no fundamental 2',m:'Média no ensino médio'}[t],(a/10).toFixed(1).replace('.',',')); }).join('')}<p class="s" style="color:var(--muted);font-size:12.5px">A nota vem do histórico escolar inteiro, desde o 1º ano do fundamental (o ensino médio pesa mais), mais inteligência, cursinho, simulados e olimpíadas.</p></div>`}].concat(COURSES.map(c=>({l:c.n,s:`Corte na pública ${pts(cutOf(c))} · particular ${fmt(c.cost)}/ano`,r:sc>=cutOf(c)?'Passo na pública':sc>=privMin(c)?'Só particular':'Nota baixa',tone:sc>=cutOf(c)?'good':sc>=privMin(c)?'':'bad',on:()=>UI.push(()=>({title:c.n,items:[
    {html:`<div class="card">${kv('Minha nota',pts(sc))}${kv('Nota de corte na pública',pts(cutOf(c)))}${kv('Nota mínima na particular',pts(privMin(c)))}${kv('Duração',c.yrs+' anos')}</div>`},
    {ic:'🏛️',l:'Universidade pública',s:'Grátis · passa quem tem a nota de corte',dis:sc<cutOf(c),why:`Minha nota (${pts(sc)}) está abaixo do corte (${pts(cutOf(c))}).`,on:()=>{ UI.close(); act(()=>enroll('uni',c,'publica'),'Vestibular'); }},
    {ic:'🏫',l:'Faculdade particular',s:fmt(c.cost)+' por ano',dis:sc<privMin(c),why:`Minha nota (${pts(sc)}) está abaixo da mínima (${pts(privMin(c))}).`,on:()=>payFlow(c.cost,(pay,disc)=>enroll('uni',c,'particular',pay,disc),{kind:'uni'})},
  ]}))})))}; };
V.techList=()=>({title:'Curso técnico',items:TECHS.map(t=>({l:t.n,s:`${t.yrs} ano(s) · ${fmt(t.cost)}/ano`,on:()=>payFlow(t.cost,(pay,disc)=>enroll('tec',t,null,pay,disc))}))});
V.postList=()=>({title:'Pós-graduação',items:POSTS.map(p=>{ const ok=p.req==='uni'?S.me.edu.deg.some(d=>d.startsWith('uni:')):p.req==='mest'?hasDeg('post:mest'):hasDeg('uni:med'); return {l:p.n,s:`${p.yrs} anos · ${p.cost?fmt(p.cost)+'/ano':'remunerada'}`,dis:!ok,why:p.req==='uni:med'?'Precisa de faculdade de Medicina.':p.req==='mest'?'Precisa de mestrado.':'Precisa de uma graduação.',on:()=>p.cost?payFlow(p.cost,pay=>enroll('post',p,null,pay)):(UI.close(),act(()=>enroll('post',p,null,null),p.n))}; })});

const INTERVIEW=[
 ['Por que você quer trabalhar aqui?',['Admiro a empresa e quero crescer junto com vocês.','Preciso pagar as contas.','Minha mãe mandou eu vir.']],
 ['Qual é o seu maior defeito?',['Às vezes sou perfeccionista demais, mas estou trabalhando nisso.','Chego atrasad{o} de vez em quando.','Não tenho defeitos.']],
 ['Onde você se vê em cinco anos?',['Liderando projetos aqui dentro.','Não sei, sinceramente.','Na sua cadeira.']],
 ['Como você lida com pressão?',['Organizo prioridades e mantenho a calma.','Choro no banheiro e volto.','Jogo a culpa em alguém.']],
 ['Conte sobre um conflito que resolveu.',['Mediei uma briga na equipe e entregamos no prazo.','Evito conflitos a todo custo.','Resolvi na base do grito.']],
 ['Qual sua pretensão salarial?',['O valor de mercado para a vaga.','O que vocês puderem pagar.','O dobro do anunciado.']],
 ['Por que deveríamos contratar você?',['Tenho vontade de aprender e entrego resultado.','Porque estou desempregad{o}.','Porque eu sou incrível, óbvio.']],
];
V.jobs=()=>{
  const m=S.me;
  if(m.age<13) return {title:'Vagas',items:[{html:'<div class="card"><p>Ainda sou muito novo para trabalhar.</p></div>'}]};
  const list=openings();
  return {title:m.age<18?'Meio período':'Vagas de emprego',items:[{ic:'📚',l:'Guia de carreiras',s:'Todas as profissões e quem sobe para quem',on:()=>UI.push(V.careerBook)}].concat(list.map(o=>{ const d=JOBS.find(x=>x.id===o.id),miss=jobReqs(d); return {l:g(d.l[0],m.gender),s:`${o.co} (${o.size||'média'}) · ${fmt(d.sal*o.mul)}/ano${d.edu?' · '+eduName(d.edu):''}`,r:miss.length?'Não atendo':'',tone:miss.length?'bad':'',on:()=>{
    if(miss.length) return msg('Requisitos',miss.join('\n'));
    if(m.job&&m.job.id===o.id&&m.job.co===o.co) return msg('Vaga','Eu já trabalho aqui.');
    { const no=workPermission('trabalhar'); if(no) return msg('Pais',no); }
    const q=R.pick(INTERVIEW); const opts=R.shuffle(q[1].map((t,i)=>({t:t.replace('{o}',oa()),i})));
    modal({k:'Entrevista · '+o.co,t:q[0],ch:opts.map(a=>({l:a.t,fn:()=>{
      const p=hireChance(d)+[.15,0,-.3][a.i];
      if(R.chance(p)){ takeJob(o); UI.close(); modal({t:'Contratad'+oa()+'!',x:`Comecei como ${jobTitle(m.job).toLowerCase()} na ${o.co}.`}); }
      else { m.yr.openings=m.yr.openings.filter(x=>x!==o); modal({t:'Não foi dessa vez',x:R.pick(['Eles escolheram outro candidato.','Disseram que vão ligar.','O recrutador bocejou durante a entrevista.'])}); }
    }}))});
  }}; }))};
};
V.special=()=>({title:'Carreiras especiais',items:Object.entries(SPECIAL).map(([id,sp])=>{ const m=S.me; const cur=m.job&&m.job.spc===id; const tl=sp.talent==='looks'?'Aparência':sp.talent==='smarts'?'Inteligência':sp.talent?TALENTS[sp.talent]:null; const tv=sp.talent?talOf(sp.talent):null;
  return {l:sp.n,s:cur?'Minha carreira atual':`${sp.l[0]} → ${g(sp.l[sp.l.length-1],m.gender)}${tl?` · talento em ${tl.toLowerCase()}: ${tv}%`:''}`,dis:cur||m.age<sp.min,why:cur?'Já estou nessa carreira.':`A partir dos ${sp.min} anos.`,
    on:()=>act(()=>specialEntry(id),sp.n)}; })});
V.politics=()=>({title:'Política',items:[{html:'<div class="card"><p>Campanha mais cara aumenta as chances. Fama, carma e inteligência também contam. Ficha criminal atrapalha muito.</p></div>'}].concat(OFFICES.map(o=>{ const m=S.me; const reqOk=!o.req||o.req.split(',').some(r=>m.c['office_'+r]); const ok=m.age>=o.age&&reqOk&&!m.office;
  return {l:g(o.n,m.gender),s:`A partir de ${o.age} anos · salário ${fmt(o.sal)}${o.req?' · exige mandato anterior':''}`,dis:!ok,why:m.office?'Já tenho um mandato.':m.age<o.age?`Preciso ter ${o.age} anos.`:'Preciso de experiência num cargo anterior.',
    on:()=>modal({t:'Campanha para '+g(o.n,m.gender).toLowerCase(),x:'Quanto vou gastar?',ch:[0,1,2].map(t=>({l:`${['Campanha modesta','Campanha normal','Campanha milionária'][t]} (${fmt(o.cost*[0.3,1,3][t])})`,fn:()=>{ const r=runFor(o,t); MQ.unshift({t:'Eleição',x:r}); UI.close(); }})).concat([{l:'Desistir',cls:'alt'}])})}; }))});

function prisonItems(){ return prisonMenu(); }

// ---------- bens ----------
V.assets=()=>{
  const m=S.me,it=[];
  const debts=m.loans.reduce((s,l)=>s+l.bal,0)+m.assets.reduce((s,a)=>s+(a.loan||0),0);
  it.push({html:`<div class="card">${kv('Dinheiro',fmt(m.money))}${kv('Investimentos',fmt(m.inv.poup+m.inv.acoes+m.inv.cripto))}${kv('Dívidas',fmt(debts))}${kv('Patrimônio líquido',fmt(netWorth()))}</div>`});
  if(m.assets.length){ it.push({sec:'Meus bens'}); m.assets.forEach(a=>it.push({ic:assetIc(a),l:a.n,s:`${({casa:'Imóvel',carro:'Veículo',item:'Item'})[a.k]}${a.k!=='item'?' · conservação '+a.cond+'%':''}${a.loan?' · financiado':''}${a.stolen?' · roubado':''}`,r:fmt(a.value),on:()=>UI.push(()=>V.asset(a))})); }
  if(m.loans.length){ it.push({sec:'Empréstimos'}); m.loans.forEach(l=>it.push({l:l.n,s:`Parcela ${fmt(l.pay)}/ano`,r:fmt(l.bal),tone:'bad'})); }
  if(!m.prison){
    it.push({sec:'Comprar'});
    it.push(Object.assign({l:'Imóveis',s:'Casas, apartamentos, mansões',on:()=>UI.push(V.houses)},ageGate(18)));
    it.push(Object.assign({l:'Veículos',s:m.lic?'Carros e motos':'Sem carteira, cuidado com blitz',on:()=>UI.push(V.cars)},ageGate(16)));
    it.push(Object.assign({l:'Loja de luxo e diversão',s:'Do videogame ao jatinho',on:()=>UI.push(V.shop)},ageGate(10)));
    it.push(Object.assign({l:'Investimentos',s:'Poupança, ações, criptomoedas',on:()=>UI.push(V.invest)},ageGate(18)));
  }
  return {title:'Bens',items:it};
};
V.asset=a=>{ if(!S.me.assets.includes(a)) return null; return {title:a.n,items:[
  {html:`<div class="card">${kv('Valor atual',fmt(a.value))}${kv('Preço de compra',fmt(a.buy))}${a.k!=='item'?kv('Conservação',a.cond+'%'):''}${a.loan?kv('Saldo do financiamento',fmt(a.loan)):''}</div>`},
  a.k!=='item'?{l:a.k==='casa'?'Reformar':'Consertar',on:()=>act(()=>fixAsset(a),'Manutenção')}:null,
  a.k==='carro'?{l:'Dar uma volta',on:()=>act(()=>{ st('happy',2); if(!S.me.lic&&R.chance(.15)){ S.me.money-=3000; return 'Fui parad'+oa()+' numa blitz sem carteira. Multa de $3.000.'; } if(R.chance(.04)){ st('health',-R.int(10,30)); a.cond=clamp(a.cond-30); return 'Perdi o controle numa curva e bati.'; } return R.pick(['Dei uma volta pela orla com o som alto.','Fui até a serra ver o pôr do sol.','Passeei pela cidade sem destino.']); },'Passeio')}:null,
  a.k==='casa'?{l:'Dar uma festa em casa',on:()=>act(()=>{ S.me.money-=1500; st('happy',R.int(4,10)); people('amigo').forEach(p=>p.bond=clamp(p.bond+4)); if(R.chance(.15)){ a.cond=clamp(a.cond-10); return 'A festa foi ótima, mas quebraram metade da casa.'; } return 'Dei uma festa e todo mundo adorou.'; },'Festa')}:null,
  {l:'Vender',tone:'bad',on:()=>confirmBox('Vender?',`Vender ${a.n.toLowerCase()}?`,'Vender',()=>{ UI.back(); act(()=>sellAsset(a),'Venda'); })},
].filter(Boolean)}; };
V.houses=()=>({title:'Imóveis à venda',items:houseListings().map(h=>({l:h.n,s:`${h.q} ${h.q>1?'quartos':'quarto'} · construído em ${h.built} · conservação ${h.cond}%`,r:fmt(h.v),on:()=>modal({t:h.n,x:`Preço: ${fmt(h.v)}\nEntrada para financiar: ${fmt(h.v*.2)}`,ch:[{l:'Comprar à vista',fn:()=>{ const r=buy('casa',h,false); log(r); MQ.unshift({t:'Imóvel',x:r}); }},{l:'Financiar em 25 anos',fn:()=>{ const r=buy('casa',h,true); MQ.unshift({t:'Imóvel',x:r}); }},{l:'Voltar',cls:'alt'}]})}))});
V.cars=()=>({title:'Veículos à venda',items:carListings().map(c=>({l:c.n,s:`Conservação ${c.cond}%`,r:fmt(c.v),on:()=>modal({t:c.n,x:`Preço: ${fmt(c.v)}`,ch:[{l:'Comprar',fn:()=>{ const r=buy('carro',c,false); MQ.unshift({t:'Veículo',x:r}); }},{l:'Voltar',cls:'alt'}]})}))});
V.shop=()=>({title:'Loja',items:ITEMS.map(x=>({l:x.t,r:fmt(x.v),on:()=>act(()=>buy('item',{n:x.t,v:x.v,h:x.h,tal:x.tal},false),'Compra')}))});
V.invest=()=>{ const m=S.me; const row=(k,l,s)=>[{html:`<div class="card">${kv(l,fmt(m.inv[k]))}<p style="color:var(--muted);font-size:13px">${s}</p></div>`},{btns:[1000,10000,100000].map(v=>({l:'+'+fmt(v),dis:!canPay(v),on:()=>act(()=>invest(k,v),'Investimento')})).concat([{l:'Resgatar tudo',cls:'alt',dis:!m.inv[k],on:()=>act(()=>invest(k,-m.inv[k]),'Investimento')}])}];
  return {title:'Investimentos',items:[].concat(row('poup','Poupança','Rende 4% ao ano. Seguro.'),row('acoes','Ações','Média de 8% ao ano, mas oscila bastante.'),row('cripto','Criptomoedas','Pode multiplicar ou virar pó.'))}; };

// ---------- relações ----------
function personRow(p){ return {face:faceSVG(p,42),l:fullName(p),s:`${relLabel(p)} · ${p.age} ${p.age===1?'ano':'anos'}`,bars:relBars(p),on:()=>UI.push(()=>V.person(p))}; }
V.relations=()=>{
  const groups=[['Família',['mae','pai','irmao','avo']],['Amor',['namoro','noivo','conjuge']],['Filhos e netos',['filho','adot','neto']],['Amigos',['amigo']],['Desafetos',['inimigo']],['Bichos',['pet']],['Ex',['ex']]];
  const it=[{face:faceSVG(S.me,42),l:'Eu: '+S.me.first+' '+S.me.last,s:'Visual, genética, talentos e vícios',on:()=>UI.push(V.me)}];
  for(const [t,rels] of groups){ const ps=people(...rels); if(ps.length){ it.push({sec:t}); ps.forEach(p=>it.push(personRow(p))); } }
  const dead=S.people.filter(p=>!p.alive&&['mae','pai','irmao','avo','filho','conjuge','adot'].includes(p.rel));
  if(dead.length){ it.push({sec:'Saudades'}); dead.forEach(p=>it.push({face:faceSVG(p,42),l:fullName(p),s:relLabel(p)+' · falecido'.replace('falecido',p.gender==='F'?'falecida':'falecido'),dis:true})); }
  if(!it.length) it.push({html:'<div class="card"><p>Ninguém por aqui.</p></div>'});
  return {title:'Relações',items:it};
};
V.me=()=>{
  const m=S.me,ge=m.genes||randGenes(m.gender);
  const who=n=>{ if(!n) return 'mutação rara'; const p=S.people.find(x=>x.first===n&&['mae','pai'].includes(x.rel)); return p?(p.rel==='mae'?'da mãe':'do pai'):'de '+n; };
  const pct=(l,v)=>bar(l,clamp(v));
  return {title:'Eu',items:[
    {html:`<div class="card"><div class="hero">${faceSVG(m,96)}<div><p><b>${esc(m.first)} ${esc(m.last)}</b></p><p style="color:var(--muted)">${m.age} anos · ${esc(looksLine(m))}</p></div></div>${kv('Nascimento',`${m.born}, ${m.city}`)}${kv('País',countryOf(m.country).n)}${kv('Geração',S.gen)}</div>`},
    {l:'Mudar o visual',s:'Cabelo, barba, óculos, chapéus, brincos, maquiagem',on:()=>UI.push(V.style)},
    {sec:'Genética'},
    {html:`<div class="card">${kv('Cabelo',`${ge.hair} (${who(ge.from.hair)})`)}${kv('Olhos',`${ge.eyes} (${who(ge.from.eyes)})`)}${kv('Altura',`${fmtH(ge.h)} (puxei ${who(ge.from.h)})`)}${kv('Fertilidade',m.fert+'%')}</div>`},
    {sec:'Talentos'},
    {html:`<div class="card">${Object.entries(TALENTS).map(([k,l])=>pct(l,m.talent[k]||0)).join('')}${pct('Luta',m.fight)}${pct('Força de vontade',m.will)}</div>`},
    {sec:'Outros'},
    {html:`<div class="card">${pct('Carma',m.karma)}${pct('Fama',m.fame)}${m.add.alcool?pct('Vício em álcool',m.add.alcool):''}${m.add.cigarro?pct('Vício em cigarro',m.add.cigarro):''}${m.add.jogo?pct('Vício em apostas',m.add.jogo):''}${kv('Carteira de motorista',m.lic?'Sim':'Não')}${kv('Ficha criminal',m.rec.conv?m.rec.conv+' condenação(ões)':'Limpa')}</div>`},
  ]};
};
V.style=()=>{
  const m=S.me; ensureLook(m);
  const it=[{html:`<div class="card" style="display:grid;place-items:center;padding:16px">${faceSVG(m,128)}</div>`}];
  const cat=(min,l,s,view)=>it.push(Object.assign({l,s,on:()=>UI.push(view)},ageGate(min)));
  cat(5,'Corte de cabelo','Masculinos, femininos e unissex',V.styleHair);
  cat(14,'Pintar o cabelo','Cores naturais e tinturas',V.styleDye);
  if(m.gender==='M') cat(16,'Barbearia','Barbas e bigodes',V.styleBeard);
  cat(6,'Ótica','Óculos de grau, 7 modelos de sol e monóculo',()=>({title:'Ótica',items:[['','none'],['De grau','grau'],['De sol','sol'],['Outros','outro']].flatMap(([t,k])=>(t?[{sec:t}]:[]).concat(GLASSES.filter(o=>k==='none'?o.id==='none':o.id!=='none'&&(o.t||'outro')===k).map(o=>optRow('glasses',o,o.v||0))))}));
  it[it.length-1].ic='🕶️';
  cat(4,'Chapéus e tiaras','Boné, gorro, cartola, coroa…',V.styleOpt('hat',HATS,'Chapéus'));
  cat(10,'Brincos','Ponto, argola, pérola',V.styleOpt('ear',EARRINGS,'Brincos'));
  cat(16,'Piercings','Nariz, sobrancelha, lábio',V.styleOpt('pierce',PIERCINGS,'Piercings'));
  cat(13,'Maquiagem','Batom, blush, delineado',V.styleOpt('makeup',MAKEUPS,'Maquiagem'));
  cat(12,'Sobrancelhas','Design de sobrancelha',V.styleOpt('brow',BROWS.map(b=>Object.assign({v:50},b)),'Sobrancelhas'));
  cat(6,'Roupas','Masculinas, femininas e unissex',V.styleTop);
  cat(6,'Cor da roupa','Trocar a cor',V.styleShirt);
  if(m.genes.from) it.push({html:`<div class="card"><p style="color:var(--muted);font-size:13px">Cor natural do cabelo, olhos, pele e formato dos olhos vêm da genética e passam para os filhos. Tintura, corte e acessórios não passam.</p></div>`});
  return {title:'Visual',items:it};
};
const optRow=(k,o,cost,label)=>({face:faceSVG(S.me,48,{[k]:o.id}),l:o.n,r:ensureLook(S.me)[k]===o.id?'Atual':cost?fmt(cost):'Grátis',tone:ensureLook(S.me)[k]===o.id?'good':'',on:()=>minorPay(cost,()=>restyle(k,o.id,cost,label||`Novo visual: ${o.n.toLowerCase()}.`),'Visual')});
V.styleOpt=(k,list,title)=>()=>({title,items:list.map(o=>optRow(k,o,k==='hat'&&o.id==='coroa'&&S.me.royal&&!S.me.royal.abd?0:(o.v||0)))});
V.styleHair=()=>{ const order=S.me.gender==='F'?[['Femininos','F'],['Unissex','U'],['Masculinos','M']]:[['Masculinos','M'],['Unissex','U'],['Femininos','F']];
  return {title:'Corte de cabelo',items:order.flatMap(([t,gg])=>[{sec:t}].concat(HAIRS.filter(h=>h.g===gg).map(h=>optRow('hair',h,h.id==='careca'?30:120,`Cortei o cabelo: ${h.n.toLowerCase()}.`))))}; };
V.styleDye=()=>({title:'Pintar o cabelo',items:DYES.map(d=>optRow('dye',d,d.id?250:150,d.id?`Pintei o cabelo: ${d.n.toLowerCase()}.`:'Voltei para a minha cor natural.'))});
V.styleBeard=()=>({title:'Barbearia',items:BEARDS.map(b=>optRow('beard',b,60,b.id==='none'?'Tirei a barba.':`Agora uso ${b.n.toLowerCase()}.`))});
V.styleTop=()=>{ const order=S.me.gender==='F'?[['Femininas','F'],['Unissex','U'],['Masculinas','M']]:[['Masculinas','M'],['Unissex','U'],['Femininas','F']]; return {title:'Roupas',items:order.flatMap(([t,gg])=>[{sec:t}].concat(TOPS.filter(x=>x.g===gg&&x.id!=='uniforme').map(x=>optRow('top',x,180,`Comprei roupa nova: ${x.n.toLowerCase()}.`))))}; };
V.styleShirt=()=>({title:'Roupa nova',items:SHIRTS.map((c,i)=>optRow('shirt',{id:c,n:['Azul royal','Coral','Verde','Roxa','Mostarda','Azul-marinho','Rosa','Turquesa','Verde-oliva','Cinza','Preta','Branca'][i]},150,'Comprei roupa nova.'))});
V.person=p=>{
  if(!p.alive) return null;
  const m=S.me,a=m.age,rel=p.rel,it=[];
  const fam=['mae','pai','irmao','avo','filho','adot','neto'].includes(rel), love=['namoro','noivo','conjuge'].includes(rel), pet=rel==='pet';
  it.push({html:`<div class="card"><div class="hero">${faceSVG(p,84)}<div><p><b>${esc(fullName(p))}</b></p><p style="color:var(--muted)">${esc(relLabel(p))}</p></div></div>${kv('Idade',p.age+(p.age===1?' ano':' anos'))}${!pet&&p.age>=16?kv('Profissão',p.job||'—'):''}${!pet&&p.genes?`<p style="color:var(--muted);font-size:13px">${esc(looksLine(p))}</p>`:''}${bar(pet?'Carinho':'Amor',p.bond)}${pet?'':bar('Amizade',frOf(p))}${pet?'':bar('Inteligência',p.smarts)+bar('Aparência',p.looks)+bar('Saúde',p.health)}</div>`});
  const A=(k,l,extra,cond=true,s)=>cond&&it.push({l,s,on:()=>act(()=>interact(p,k,extra),fullName(p))});
  if(m.prison){ A('conversa','Ligar do orelhão da prisão',null,!pet); return {title:p.first,items:it}; }
  if(pet){ A('tempo','Brincar'); A('passear','Passear'); A('vet','Levar ao veterinário',null,a>=14,fmt(150)); A('doar_pet','Doar para outra família',null,a>=14); A('matar','Sacrificar',null,a>=18); return {title:p.first,items:it}; }
  A('tempo','Passar tempo junto'); A('conversa','Conversar'); A('elogio','Elogiar'); A('abraco','Abraçar',null,fam||love||rel==='amigo');
  A('piada','Contar uma piada',null,a>=5); A('pegadinha','Pregar uma peça',null,a>=6);
  if(a>=6) it.push({l:'Dar um presente',on:()=>modal({t:'Presente para '+p.first,ch:[[50,4],[400,9],[3000,16]].map(([c,b])=>({l:`${c<100?'Lembrancinha':c<1000?'Presente':'Presentão'} (${fmt(c)})`,fn:()=>{ const r=interact(p,'presente',[c,b]); log(r); MQ.unshift({t:p.first,x:r}); }})).concat([{l:'Cancelar',cls:'alt'}])})});
  A('pedir','Pedir dinheiro',null,['mae','pai','avo','irmao','conjuge','filho'].includes(rel)&&p.age>=16);
  if(a>=16&&m.money>0) it.push({l:'Dar dinheiro',on:()=>modal({t:'Dar dinheiro a '+p.first,ch:[100,1000,10000].filter(v=>v<=m.money).map(v=>({l:fmt(v),fn:()=>{ const r=interact(p,'dar',v); log(r); MQ.unshift({t:p.first,x:r}); }})).concat([{l:'Cancelar',cls:'alt'}])})});
  if(['mae','pai'].includes(rel)&&a<18&&a>=4) it.push({l:'Pedir um bicho de estimação',on:()=>act(()=>{ if(use('askPet')>1) return 'Já pedi este ano. A resposta continua sendo não.'; if(R.chance(p.bond/180)){ const r=adoptPet('abrigo'); return 'Eles deixaram! '+r; } p.bond=clamp(p.bond-2); return `${p.first} disse que não.`; },p.first)});
  A('visitar','Visitar',null,rel==='avo'||(fam&&S.flags.movedOut&&rel!=='filho'&&rel!=='neto'));
  A('ler','Ler uma história',null,['filho','adot','neto','irmao'].includes(rel)&&p.age<10&&a>=12);
  A('castigo','Deixar de castigo',null,['filho','adot'].includes(rel)&&p.age<18);
  A('amizade','Chamar para ser amigo',null,['colega','colegaT','inimigo','ex','equipe'].includes(rel)&&!love);
  A('perdao','Fazer as pazes',null,rel==='inimigo'||p.bond<25);
  A('puxar','Puxar o saco',null,rel==='chefe');
  const canFlirt=!fam&&!love&&a>=13&&Math.abs(p.age-a)<=(a<18?3:15)&&p.age>=(a<18?12:18)&&rel!=='ex'&&rel!=='chefe';
  A('flertar','Flertar',null,canFlirt);
  A('reatar','Tentar voltar',null,rel==='ex');
  if(love){
    if(a>=18&&p.age>=18) it.push({ic:'❤️‍🔥',l:'Fazer amor',s:'Felicidade · sem proteção pode vir um bebê',on:()=>modal({t:`Com ${p.first}`,x:'Como vai ser?',ch:[{l:'Com proteção',fn:()=>{ const r=interact(p,'amor',true); log(r); MQ.unshift({t:p.first,x:r}); }},{l:'Sem proteção',fn:()=>{ const r=interact(p,'amor',false); log(r); MQ.unshift({t:p.first,x:r}); }},{l:'Hoje não',cls:'alt'}]})});
    A('viagem','Viajar juntos',5000,a>=18,fmt(5000));
    if(rel==='namoro'&&a>=16) it.push({l:'Pedir em casamento',on:()=>modal({t:'Qual anel?',ch:[[500,'Anel simples'],[5000,'Anel de ouro'],[40000,'Diamante enorme']].map(([c,l])=>({l:`${l} (${fmt(c)})`,fn:()=>{ const r=interact(p,'pedido',[c]); log(r); MQ.unshift({t:p.first,x:r}); }})).concat([{l:'Cancelar',cls:'alt'}])})});
    if(rel==='noivo') it.push({l:'Marcar o casamento',on:()=>modal({t:'Casamento',x:'Que tipo de cerimônia?',ch:[[800,'Só no cartório'],[25000,'Festa para os íntimos'],[150000,'Festão com 500 convidados']].flatMap(([c,l])=>[{l:`${l} (${fmt(c)})`,fn:()=>{ const r=interact(p,'casar',[c,false]); log(r); MQ.unshift({t:'Casamento',x:r}); }}]).concat([{l:'Com pacto antenupcial (protege meu dinheiro)',fn:()=>{ const r=interact(p,'casar',[800,true]); log(r); MQ.unshift({t:'Casamento',x:r}); }},{l:'Cancelar',cls:'alt'}])})});
    if(rel!=='conjuge') A('terminar','Terminar');
    if(rel==='conjuge') it.push({l:'Pedir o divórcio',tone:'bad',on:()=>confirmBox('Divórcio?',S.flags['prenup'+p.id]?'Temos pacto antenupcial.':'Sem pacto, perco metade do dinheiro.','Divorciar',()=>act(()=>interact(p,'divorcio'),'Divórcio'))});
  }
  A('insulto','Insultar',null,a>=4); A('discutir','Discutir',null,a>=6);
  if(a>=6&&!['filho','adot','neto'].includes(rel)||a>=6&&p.age>=16) it.push({ic:'👊',l:'Partir pra briga',s:'Eu escolho os golpes',tone:'bad',on:()=>startFight({p},'pessoa')});
  if(a>=14) it.push({l:'Assassinar',tone:'bad',on:()=>confirmBox('Tem certeza?',`Tentar matar ${fullName(p)}? Isso pode acabar com a minha vida também.`,'Fazer',()=>act(()=>interact(p,'matar'),'Crime'))});
  return {title:p.first,items:it};
};

// ---------- atividades ----------
V.activities=()=>{
  const m=S.me;
  if(m.prison) return {title:'Atividades',items:prisonItems()};
  const it=[];
  const G=(min,o)=>it.push(Object.assign(o,ageGate(min)));
  G(4,{l:'Visual',s:'Cabelo, barba, óculos, chapéus, maquiagem',on:()=>UI.push(V.style)});
  G(4,{l:'Mente e corpo',s:'Academia, biblioteca, meditação, artes marciais…',on:()=>UI.push(V.mind)});
  G(0,{l:'Saúde',s:m.dis.length?`${m.dis.length} problema(s) de saúde`:'Médico, terapia, cirurgia plástica',tone:m.dis.length?'bad':'',on:()=>UI.push(V.health)});
  G(13,{l:'Amor',s:'Encontros, aplicativos, ficar',on:()=>UI.push(V.love)});
  G(18,{l:'Diversão',s:'Balada, cassino, loteria, corrida de cavalos',on:()=>UI.push(V.fun)});
  G(18,{l:'Viagens',s:'Férias pelo mundo',on:()=>UI.push(V.trips)});
  G(8,{l:'Crimes',s:'Do furto ao assalto a banco',tone:'bad',on:()=>UI.push(V.crimes)});
  G(18,{l:'Bichos de estimação',s:'Abrigo, criador, exóticos',on:()=>UI.push(V.pets)});
  G(13,{l:'Redes sociais',s:m.social?`${m.social.f.toLocaleString('pt-BR')} seguidores`:'Criar perfil',on:()=>UI.push(V.social)});
  if(!m.lic) G(18,{l:'Autoescola',s:'Prova de placas · $1.500',on:()=>drivingTest()});
  G(25,{l:'Adotar uma criança',s:'Processo de $20.000',on:()=>confirmBox('Adoção','Iniciar um processo de adoção por $20.000?','Adotar',()=>act(adoptChild,'Adoção'))});
  G(18,{l:'Emigrar',s:`Hoje moro ${({BR:'no',PT:'em',US:'nos',AR:'na',MX:'no',JP:'no',IT:'na',FR:'na',DE:'na',GB:'no',AO:'em',CA:'no',ES:'na',KR:'na',IN:'na'})[m.country]||'em'} ${countryOf(m.country).n}`,on:()=>UI.push(V.emigrate)});
  return {title:'Atividades',items:it};
};
V.mind=()=>{ const m=S.me,it=[]; const B=(min,k,l,s,extra)=>it.push(Object.assign({l,s,on:()=>act(()=>body(k,extra),l)},ageGate(min)));
  B(12,'gym','Academia','Saúde e aparência'); B(4,'lib','Biblioteca','Inteligência'); B(10,'med','Meditação','Felicidade e força de vontade'); B(6,'walk','Caminhada','Saúde'); B(12,'yoga','Ioga','Saúde e felicidade');
  it.push(Object.assign({ic:'🥋',l:'Artes marciais',s:`Faixas e golpes especiais · luta ${m.fight}%`,on:()=>UI.push(V.martial)},ageGate(5)));
  it.push(Object.assign({ic:'🎨',l:'Aulas de dança, arte, teatro e escrita',s:'Níveis do iniciante ao profissional',on:()=>UI.push(V.lessons)},ageGate(5)));
  it.push(Object.assign({ic:'🎵',l:'Aulas de música',s:`Instrumentos · talento musical: ${m.talent.musical}%`,on:()=>UI.push(V.music)},ageGate(6))); B(6,'acting','Aulas de teatro',`Talento para atuar: ${m.talent.acting}%`); it.push(Object.assign({ic:'⚽',l:'Treino esportivo',s:`Modalidades · atletismo: ${m.talent.athletic}%`,on:()=>UI.push(V.sport)},ageGate(6)));
  B(5,'art','Pintura e desenho',`Artes: ${m.talent.art||0}%`); B(8,'write','Escrever',`Escrita: ${m.talent.writing||0}%`); B(12,'comedy','Treinar humor',`Humor: ${m.talent.comedy||0}%`);
  B(14,'salon','Salão de beleza',fmt(200)); B(18,'spa','Dia de spa',fmt(800));
  it.push(Object.assign({l:'Dieta',on:()=>UI.push(()=>({title:'Dieta',items:['mediterrânea','vegetariana','vegana','low carb','do jejum intermitente','da sopa'].map(d=>({l:'Dieta '+d,on:()=>act(()=>body('diet',d),'Dieta')})).concat([{l:'Comer só besteira',on:()=>act(()=>body('diet','junk'),'Dieta')}])}))},ageGate(14)));
  return {title:'Mente e corpo',items:it}; };
V.health=()=>{ const m=S.me,it=[];
  if(m.dis.length){ it.push({sec:'Meus problemas'}); m.dis.forEach(d=>{ const def=DISEASES[d.id]; it.push({l:def.n,s:`${d.y} ano(s)${d.ctrl?' · controlada':''}${def.cure==='none'?' · sem cura':''}`,tone:'bad',on:()=>UI.push(()=>({title:def.n,items:[
    {l:'Médico',s:fmt(300),on:()=>act(()=>treat('doc',d),def.n)},{l:'Hospital',s:fmt(8000),on:()=>act(()=>treat('hosp',d),def.n)},
    {l:'Terapia',s:fmt(400),dis:def.cure!=='psi',why:'Terapia não resolve isso.',on:()=>act(()=>treat('psi',d),def.n)},{l:'Medicina alternativa',s:fmt(80),on:()=>act(()=>treat('alt',d),def.n)}]}))}); }); }
  it.push({sec:'Cuidados'});
  it.push({l:'Consulta de rotina',s:fmt(300),on:()=>act(checkup,'Médico')});
  it.push(Object.assign({l:'Terapia',s:fmt(400),on:()=>act(therapy,'Terapia')},ageGate(10)));
  Object.entries(m.add).forEach(([k,v])=>{ if(v>=30) it.push({l:'Reabilitação: '+({alcool:'álcool',cigarro:'cigarro',jogo:'jogos de azar'})[k],s:`Vício ${v}% · ${fmt(15000)}`,tone:'bad',on:()=>act(()=>rehab(k),'Reabilitação')}); });
  it.push(Object.assign({l:'Cirurgia plástica',s:'Aparência, com riscos',on:()=>UI.push(V.surgery)},ageGate(18)));
  return {title:'Saúde',items:it}; };
V.surgery=()=>({title:'Cirurgia plástica',items:SURGERIES.filter(s=>!s.min||S.me.age>=s.min).map(s=>({l:s.n,r:fmt(s.v),on:()=>modal({t:s.n,x:'Qual cirurgião?',ch:[0,1,2].map(t=>({l:`${['Clínica barata','Cirurgião bom','Cirurgião das celebridades'][t]} (${fmt(s.v*[0.4,1,3][t])})`,fn:()=>{ const r=surgery(s,t); log(r); MQ.unshift({t:'Cirurgia',x:r}); }})).concat([{l:'Desistir',cls:'alt'}])})}))});
V.love=()=>{ const m=S.me; const it=[
  {l:'Procurar alguém',s:'Conhecer gente nova',on:()=>dateFlow(false)},
  Object.assign({l:'Aplicativo de namoro',s:'Mais opções, mais roubada',on:()=>dateFlow(true)},ageGate(18)),
  Object.assign({l:'Ficar com alguém',s:'Sem compromisso, com riscos',on:()=>act(hookup,'Encontro')},ageGate(18)),
];
  if(m.pref) it.push({html:`<div class="card"><p style="color:var(--muted);font-size:13px">Me interesso por: ${m.pref==='A'?'homens e mulheres':m.pref==='M'?'homens':'mulheres'}</p></div>`},{l:'Mudar meu interesse',on:()=>modal({t:'Me interesso por…',ch:[['F','Mulheres'],['M','Homens'],['A','Homens e mulheres']].map(([k,l])=>({l,fn:()=>{ m.pref=k; }}))})});
  return {title:'Amor',items:it}; };
function dateFlow(app){
  const m=S.me; if(use(app?'app':'date')>5){ msg('Amor','Cansei de procurar por este ano.'); return; }
  const p=candidate(app);
  modal({k:app?'Aplicativo':'Encontro',top:faceSVG(p,96),t:`${fullName(p)}, ${p.age}`,html:`<div style="margin-top:6px"><p style="color:var(--muted);font-size:13px">${esc(looksLine(p))}</p>${p.age>=18?kv('Profissão',p.job||'Desempregad'+(p.gender==='F'?'a':'o')):''}${bar('Aparência',p.looks)}${bar('Inteligência',p.smarts)}</div>`,ch:[
    {l:'Chamar pra sair',fn:()=>{ const r=askOut(p); log(r.t,r.ok?'good':''); MQ.unshift({t:'Encontro',x:r.t}); }},
    {l:'Próxima pessoa',cls:'alt',fn:()=>setTimeout(()=>dateFlow(app),0)},
    {l:'Parar por hoje',cls:'alt'},
  ]});
}
V.fun=()=>({title:'Diversão',items:[
  {l:'Balada',s:'Bebida, música, gente nova',on:()=>act(nightclub,'Balada')},
  {l:'Show',s:fmt(300),on:()=>act(()=>{ S.me.money-=300; st('happy',R.int(4,10)); return `Fui a um show de ${R.pick(FILL.music)}. ${R.pick(['Perdi a voz de tanto cantar.','O som estava ruim, mas valeu.','Peguei a palheta do guitarrista!'])}`; },'Show')},
  {sec:'Apostas'},
  {l:'Loteria',s:'1 bilhete = $5',on:()=>modal({t:'Loteria',ch:[1,10,100].map(n=>({l:`${n} ${n>1?'bilhetes':'bilhete'} (${fmt(n*5)})`,fn:()=>{ const r=lottery(n); MQ.unshift({t:'Resultado',x:r}); }})).concat([{l:'Voltar',cls:'alt'}])})},
  {l:'Cassino: vinte e um',on:()=>UI.push(V.blackjack())},
  {l:'Cassino: roleta',on:()=>UI.push(V.roulette)},
  {l:'Cassino: caça-níquel',on:()=>UI.push(V.slots)},
  {l:'Corrida de cavalos',on:()=>UI.push(V.horses())},
]});
const BETS=[10,100,1000,10000,100000];
V.blackjack=()=>{
  const st={bet:100,deck:[],p:[],d:[],done:true,msg:'Escolha a aposta e dê as cartas.'};
  const card=()=>{ if(!st.deck.length){ for(const s of ['♠','♥','♦','♣']) for(const v of ['A','2','3','4','5','6','7','8','9','10','J','Q','K']) st.deck.push(v+s); st.deck=R.shuffle(st.deck); } return st.deck.pop(); };
  const val=h=>{ let t=0,a=0; for(const c of h){ const v=c.slice(0,-1); t+=v==='A'?11:['J','Q','K'].includes(v)?10:+v; if(v==='A') a++; } while(t>21&&a){ t-=10; a--; } return t; };
  const end=r=>{ const m=S.me; st.done=true; let w=0; if(r==='bj') w=Math.round(st.bet*2.5); if(r==='win') w=st.bet*2; if(r==='push') w=st.bet; m.money+=w; st.msg={bj:`Vinte e um! Ganhei ${fmt(w-st.bet)}.`,win:`Ganhei ${fmt(st.bet)}!`,push:'Empate. A aposta voltou.',lose:`Perdi ${fmt(st.bet)}.`}[r]; save(); render(); };
  const dealer=()=>{ while(val(st.d)<17) st.d.push(card()); const p=val(st.p),d=val(st.d); end(d>21||p>d?'win':p===d?'push':'lose'); };
  const hand=(h,hide)=>`<div class="cards">${h.map((c,i)=>hide&&i===1?'<div class="pc">?</div>':`<div class="pc ${/[♥♦]/.test(c)?'red':''}">${esc(c)}</div>`).join('')}</div>`;
  return ()=>({title:'Vinte e um',items:[
    {html:`<div class="card"><p><b>Banca</b> ${st.done&&st.d.length?'· '+val(st.d):''}</p>${hand(st.d,!st.done)}<p><b>Eu</b> ${st.p.length?'· '+val(st.p):''}</p>${hand(st.p)}<p>${esc(st.msg)}</p></div>`},
    {btns:st.done?BETS.map(b=>({l:fmt(b),cls:b===st.bet?'sun':'alt',dis:!canPay(b),on:()=>{ st.bet=b; UI.refresh(); }})):[]},
    {btns:st.done?[{l:'Dar as cartas',dis:!canPay(st.bet),on:()=>{ S.me.money-=st.bet; cnt('bets'); S.me.add.jogo=clamp(S.me.add.jogo+R.int(0,3)*(1.3-S.me.will/100)); st.p=[card(),card()]; st.d=[card(),card()]; st.done=false; st.msg='Pedir ou parar?'; if(val(st.p)===21) end(val(st.d)===21?'push':'bj'); save(); render(); UI.refresh(); }}]:[
      {l:'Pedir carta',on:()=>{ st.p.push(card()); if(val(st.p)>21) end('lose'); else if(val(st.p)===21) dealer(); UI.refresh(); }},
      {l:'Parar',cls:'alt',on:()=>{ dealer(); UI.refresh(); }},
      {l:'Dobrar',cls:'alt',dis:st.p.length>2||!canPay(st.bet),on:()=>{ S.me.money-=st.bet; st.bet*=2; st.p.push(card()); if(val(st.p)>21) end('lose'); else dealer(); st.bet/=1; UI.refresh(); }},
    ]},
  ]});
};
V.roulette=()=>{ const m=S.me; V.roulette.bet=V.roulette.bet||100; const b=V.roulette.bet;
  return {title:'Roleta',items:[
    {html:`<div class="card">${kv('Aposta',fmt(b))}${kv('Meu dinheiro',fmt(m.money))}</div>`},
    {btns:BETS.map(x=>({l:fmt(x),cls:x===b?'sun':'alt',dis:!canPay(x),on:()=>{ V.roulette.bet=x; UI.refresh(); }}))},
    {sec:'Apostar em'},
    {btns:[['vermelho','Vermelho'],['preto','Preto'],['par','Par'],['impar','Ímpar']].map(([k,l])=>({l,on:()=>act(()=>roulette(b,k),'Roleta')}))},
    {l:'Um número (paga 36x)',on:()=>modal({t:'Escolha um número',ch:R.shuffle([...Array(37).keys()]).slice(0,6).map(n=>({l:'Número '+n,fn:()=>{ const r=roulette(b,'num',n); MQ.unshift({t:'Roleta',x:r}); }}))})},
  ]}; };
V.slots=()=>{ const m=S.me; const b=V.slots.bet=V.slots.bet||10; const r=V.slots.last||{r:['7','7','7'],t:'Puxe a alavanca.'};
  return {title:'Caça-níquel',items:[
    {html:`<div class="card"><div class="reels">${r.r.map(x=>`<div>${esc(x)}</div>`).join('')}</div><p style="text-align:center">${esc(r.t)}</p></div>`},
    {btns:BETS.slice(0,4).map(x=>({l:fmt(x),cls:x===b?'sun':'alt',dis:!canPay(x),on:()=>{ V.slots.bet=x; UI.refresh(); }}))},
    {btns:[{l:'Puxar a alavanca',cls:'sun',dis:!canPay(b),on:()=>{ V.slots.last=slots(b); save(); render(); UI.refresh(); }}]},
  ]}; };
V.horses=()=>{ const names=['Relâmpago','Pé de Pano','Trovão Negro','Dona Flor','Ventania','Pingo de Ouro','Ás de Copas','Sereno','Faísca','Cigano','Estrela d’Alva','Tornado']; const field=R.shuffle(names).slice(0,6).map(n=>({n,odds:+(1.5+R.f()*12).toFixed(1)}));
  return ()=>({title:'Corrida de cavalos',items:field.map((h,i)=>({l:h.n,r:`paga ${h.odds}x`,on:()=>modal({t:'Apostar em '+h.n,ch:BETS.slice(0,4).filter(b=>b<=S.me.money).map(b=>({l:fmt(b),fn:()=>{ const r=horses(b,i,field); MQ.unshift({t:'Corrida',x:r}); }})).concat([{l:'Voltar',cls:'alt'}])})}))}); };
V.trips=()=>{ if(!S.me.yr.trips) S.me.yr.trips=R.shuffle(TRIPS).slice(0,8).map(t=>({t,c:amt(1500,25000)})); return {title:'Viagens',items:S.me.yr.trips.map(x=>({l:x.t,r:fmt(x.c),on:()=>minorPay(x.c,()=>travel(x.t,x.c),'Viagem')}))}; };
V.crimes=()=>({title:'Crimes',items:[{html:'<div class="card"><p>Cada crime pesa no carma. Se for pego, vai a julgamento.</p></div>'},S.me.job&&S.me.job.spc==='crime'?{ic:'🏴',l:'Minha facção',s:jobTitle(S.me.job),on:()=>UI.push(V.faccao)}:Object.assign({ic:'🏴',l:'Entrar para uma facção',s:'Olheiro → … → dono do morro',tone:'bad',on:()=>confirmBox('Entrar para a facção?','Não tem volta fácil.','Entrar',()=>act(()=>specialEntry('crime'),'Facção'))},ageGate(14)),Object.assign({ic:'🎯',l:'Assassino de aluguel',s:'Contratos com pagamento alto',tone:'bad',on:()=>UI.push(V.hitman)},ageGate(18)),{sec:'Crimes avulsos'}].concat(CRIMES.map(c=>Object.assign({l:c.n,s:(c.id==='casa'?'Minijogo · ':c.id==='banco'||c.id==='joalheria'?'Minijogo do cofre · ':'')+(c.jail[1]?`Pena de ${c.jail[0]} a ${c.jail[1]} anos`:'Multa'),tone:'bad',on:()=>{ if(c.id==='casa'){ UI.close(); mgBurglary(); } else if(c.id==='banco'||c.id==='joalheria'){ UI.close(); mgVault(c); } else act(()=>crime(c),'Crime'); }},ageGate(c.min))))});
V.pets=()=>({title:'Bichos de estimação',items:[
  {l:'Abrigo de animais',s:'Adoção quase grátis, bicho surpresa',on:()=>act(()=>adoptPet('abrigo'),'Abrigo')},
  {sec:'Comprar de criador'},
].concat(PETS.map(p=>({l:g(p.s,'M'),s:p.ex?'Exótico':'',r:fmt(p.cost),on:()=>act(()=>adoptPet('criador',p),'Criador')})))});
V.social=()=>{ const m=S.me; if(!m.social) return {title:'Redes sociais',items:[{l:'Criar meu perfil',on:()=>act(()=>{ m.social={f:R.int(5,80),u:'@'+(m.first+m.last).toLowerCase().normalize('NFD').replace(/[^a-z]/g,'')+R.int(1,99)}; return 'Criei meu perfil: '+m.social.u; },'Redes sociais')}]};
  return {title:m.social.u,items:[{html:`<div class="card">${kv('Seguidores',m.social.f.toLocaleString('pt-BR'))}${m.social.f>20000?kv('Publicidade','Rende dinheiro todo ano'):kv('Publicidade','A partir de 20 mil seguidores')}</div>`}].concat([['selfie','Postar uma selfie'],['video','Postar um vídeo engraçado'],['danca','Postar uma dancinha'],['foto','Postar a foto da comida'],['polemica','Dar uma opinião polêmica']].map(([k,l])=>({l,on:()=>act(()=>socialPost(k),'Redes sociais')}))).concat([{l:'Apagar o perfil',tone:'bad',on:()=>confirmBox('Apagar?','Perder todos os seguidores?','Apagar',()=>act(()=>{ m.social=null; return 'Apaguei meu perfil.'; },'Redes sociais'))}])}; };
V.emigrate=()=>({title:'Emigrar',items:[{html:`<div class="card"><p>Custa ${fmt(5000)}. Precisa de passaporte. O visto pode ser negado. Vou perder o emprego atual.</p>${kv('Passaporte',S.me.passport==='ok'?'Tenho':S.me.passport==='fake'?'Falso':'Não tenho')}</div>`},{ic:'🛂',l:'Tirar passaporte',s:'$250 · pode ser negado; com ficha criminal é bem difícil · 1 tentativa por ano',dis:!!S.me.passport,why:'Já tenho passaporte.',on:()=>act(getPassport,'Passaporte')},{ic:'🕵️',l:'Comprar passaporte falso',s:'$3.000 · pode ser armadilha, e no aeroporto podem perceber',tone:'bad',dis:!!S.me.passport||S.me.age<18,why:S.me.age<18?'Só adultos.':'Já tenho passaporte.',on:()=>act(fakePassport,'Passaporte')},{sec:'Países'}].concat(COUNTRIES.filter(c=>c.id!==S.me.country).map(c=>({l:c.n,on:()=>confirmBox('Emigrar?',`Me mudar para ${c.n}?`,'Mudar',()=>act(()=>emigrate(c),'Emigração'))})))});

// ---------- menu, início, morte ----------
V.menu=()=>({title:'Menu',items:[
  {ic:'🏳️',l:'Desistir desta vida',s:'Encerra a vida atual agora',tone:'bad',on:()=>{ if(!S||!S.me.alive) return msg('Desistir','Essa vida já terminou.'); UI.close(); giveUpFlow(); }},
  {l:'Nova vida',on:()=>confirmBox('Nova vida?','A vida atual será perdida.','Começar de novo',()=>{ UI.close(); showStart(); })},
  ...(godUnlocked()?[{l:'Modo Deus',s:'Editar atributos, talentos e genética',on:()=>S.me.alive?UI.push(V.god):msg('Modo Deus','Só funciona com o personagem vivo.')},
  {l:'Máquina do tempo',s:SNAPS.length?`Voltar até ${SNAPS.length} ano(s)`:'Nenhum ano salvo ainda',on:()=>UI.push(V.time)}]:[]),
  ...(S.me&&S.me.alive&&S.me.age>=18&&!S.scen&&!S.me.prison?[{ic:'🌀',l:'Modos fictícios',s:'Zumbis, ilha deserta, isekai, superpoderes, Marte',on:()=>UI.push(V.scenPick)}]:[]),
  {l:'Desafios',s:`${Object.keys(META.ch||{}).length} de ${CHALLENGES.length} concluídos`,on:()=>UI.push(V.challenges)},
  {l:'Dificuldade',r:diff().n,on:()=>{ S.flags.diff={facil:'normal',normal:'dificil',dificil:'facil'}[S.flags.diff||'normal']; save(); UI.refresh(); }},
  {l:'Meus selos',s:`${Object.keys(META.ribbons).length} de ${RIBBONS.length}`,on:()=>UI.push(V.ribbons)},
  {l:'Cemitério',s:`${META.grave.length} vidas vividas`,on:()=>UI.push(V.grave)},
  {ic:'🎟️',l:'Resgatar código',on:()=>UI.push(V.code)},
  {ic:'🎵',l:'Música',r:META.music===false?'Desligada':'Ligada',on:()=>{ META.music=META.music===false; save(); if(META.music!==false){ SND.started=true; startMusic(); } else stopMusic(); UI.refresh(); }},
  {ic:'🔊',l:'Efeitos sonoros',r:META.sfx===false?'Desligados':'Ligados',on:()=>{ META.sfx=META.sfx===false; save(); sfx('pop'); UI.refresh(); }},
  {l:'Tema',r:{auto:'Automático',light:'Claro',dark:'Escuro'}[META.theme||'auto'],on:()=>{ META.theme={auto:'light',light:'dark',dark:'auto'}[META.theme||'auto']; applyTheme(); save(); UI.refresh(); }},
  {ic:'🧹',l:'Zerar selos e cemitério',s:'Apaga o histórico de vidas anteriores',on:()=>confirmBox('Zerar histórico?','Selos, desafios, cemitério e nomes já usados serão apagados. A vida atual continua.','Zerar',()=>{ META.ribbons={}; META.grave=[]; META.ch={}; META.lives=0; META.usedNames=[]; save(); UI.refresh(); msg('Pronto','Histórico zerado.'); })},
  {l:'Como jogar',on:()=>msg('Como jogar','Toque no botão + para envelhecer um ano. Cada ano traz eventos aleatórios e escolhas.\n\nCarreira: escola, faculdade, empregos, carreiras especiais e política.\nBens: dinheiro, imóveis, carros e investimentos.\nRelações: família, amigos, amores e bichos.\nAtividades: saúde, amor, diversão, crimes, viagens e mais.\n\nQuando você morre, ganha um selo de acordo com o jeito que viveu, e pode continuar a história como um dos seus filhos.')},
]});
V.god=()=>{
  const m=S.me;
  const line=(k,l,v)=>[{html:bar(l,clamp(v))},{btns:[-10,-1,1,10].map(d=>({l:(d>0?'+':'')+d,cls:'alt',on:()=>{ godSet(k,d); save(); render(); UI.refresh(); }}))}];
  return {title:'Modo Deus',items:[
    {html:'<div class="card"><p>Mude o que quiser. A genética editada passa para os seus filhos.</p></div>'},
    {sec:'Atributos'},...line('happy','Felicidade',m.happy),...line('health','Saúde',m.health),...line('smarts','Inteligência',m.smarts),...line('looks','Aparência',m.looks),...line('karma','Carma',m.karma),...line('fame','Fama',m.fame),
    {sec:'Talentos'},...Object.entries(TALENTS).flatMap(([k,l])=>line('t.'+k,l,m.talent[k]||0)),...line('fight','Luta',m.fight),...line('will','Força de vontade',m.will),...line('fert','Fertilidade',m.fert),
    {sec:'Genética'},
    {l:'Cabelo',r:m.genes.hair,on:()=>{ godSet('hair'); save(); UI.refresh(); }},
    {l:'Olhos',r:m.genes.eyes,on:()=>{ godSet('eyes'); save(); UI.refresh(); }},
    {html:`<div class="card">${kv('Altura',fmtH(m.genes.h))}</div>`},{btns:[-5,-1,1,5].map(d=>({l:(d>0?'+':'')+d+' cm',cls:'alt',on:()=>{ godSet('h',d); save(); UI.refresh(); }}))},
    {sec:'Outros'},
    {l:'Curar todas as doenças e vícios',on:()=>{ godSet('cure'); save(); render(); msg('Modo Deus','Curad'+oa()+' de tudo.'); }},
    {l:'Mudar meu nome',on:()=>modal({t:'Novo nome',html:'<input class="in" id="godName" style="margin-top:8px" autocomplete="off">',ch:[{l:'Salvar',fn:()=>{ const v=(document.getElementById('godName').value||'').trim(); if(v){ m.first=v.split(' ')[0]; log(`Mudei meu nome para ${m.first}.`); } }},{l:'Cancelar',cls:'alt'}]})},
  ]};
};
V.time=()=>({title:'Máquina do tempo',items:SNAPS.length?[{html:'<div class="card"><p>Volte a um ano anterior. Tudo que aconteceu depois some.</p></div>'}].concat(SNAPS.map((s,i)=>({l:`Voltar para os ${s.age} anos`,s:`Ano de ${s.year}`,on:()=>confirmBox('Voltar no tempo?',`Voltar para os ${s.age} anos?`,'Voltar',()=>{ if(timeTravel(i)){ UI.close(); $('#death').hidden=true; MQ.length=0; render.jump=true; render(); } })})).reverse()):[{html:'<div class="card"><p>Envelheça pelo menos um ano para usar a máquina do tempo.</p></div>'}]});
V.challenges=()=>({title:'Desafios',items:CHALLENGES.map(c=>({l:c.n,s:c.d,r:(META.ch||{})[c.id]?'Concluído':'',tone:(META.ch||{})[c.id]?'good':''}))});
V.ribbons=()=>({title:'Selos',items:RIBBONS.map(r=>({l:r.n,s:r.d,r:META.ribbons[r.id]?'×'+META.ribbons[r.id]:'—',tone:META.ribbons[r.id]?'good':'',dis:!META.ribbons[r.id]}))});
V.grave=()=>({title:'Cemitério',items:META.grave.length?META.grave.map(x=>({l:`${x.n} (${x.a} anos)`,s:`${x.c}${x.job?' · '+x.job:''} · ${(RIBBONS.find(r=>r.id===x.r)||{}).n}${x.gen>1?' · '+x.gen+'ª geração':''}`,r:fmt(x.w)})):[{html:'<div class="card"><p>Ninguém morreu ainda.</p></div>'}]});
function applyTheme(){ const t=META.theme||'auto'; if(t==='auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme',t); }

function showStart(){
  const has=S&&S.me&&S.me.alive;
  const c=COUNTRIES.map(c=>`<option value="${c.id}">${esc(c.n)}</option>`).join('');
  $('#start').innerHTML=`<div class="full-in">
    <div class="st-hero"><div class="st-faces">${[0,1,2,3,4,5].map(i=>{ const gd=i%2?'F':'M'; return `<span style="--i:${i}">${faceSVG({id:i+1,gender:gd,age:[4,22,35,48,70,16][i],bond:R.int(60,95),genes:randGenes(gd)},64)}</span>`; }).join('')}</div><div class="logo">New<em>Life</em></div><p class="tag">Um simulador de vida. Cada ano é um sorteio.</p></div>
    ${has?`<button class="btn sun" id="stCont">Continuar a vida de ${esc(S.me.first)} (${S.me.age} anos)</button>`:''}
    <button class="btn ${has?'alt':'sun'}" id="stRand">Vida completamente aleatória</button>
    <div class="card" style="display:flex;flex-direction:column;gap:10px">
      <b>Vida personalizada</b>
      <div class="grid2"><label class="f">Nome<input class="in" id="fFirst" placeholder="Aleatório" autocomplete="off"></label><label class="f">Sobrenome<input class="in" id="fLast" placeholder="Aleatório" autocomplete="off"></label></div>
      <div class="grid2"><label class="f">Gênero<select class="in" id="fGender"><option value="">Aleatório</option><option value="F">Feminino</option><option value="M">Masculino</option></select></label>
      <label class="f">País<select class="in" id="fCountry"><option value="">Aleatório</option>${c}</select></label></div>
      <label class="f">Dificuldade<select class="in" id="fDiff"><option value="normal">Normal</option><option value="facil">Fácil</option><option value="dificil">Difícil</option></select></label>
      <p style="color:var(--muted);font-size:12.5px;margin:0">A família onde você nasce (rica, pobre ou até da realeza) é sempre sorteada.</p>
      ${godUnlocked()?'<label class="f" style="flex-direction:row;align-items:center;gap:8px;color:var(--ink)"><input type="checkbox" id="fGod"> Abrir o Modo Deus ao nascer</label>':''}
      <button class="btn" id="stCustom">Nascer</button>
    </div>
    <div class="chips"><button class="chip" id="stConq">🏆 Conquistas: ${typeof conqGot==='function'?Object.keys(conqGot()).length:0}/${typeof CONQ!=='undefined'?CONQ.length:0}</button><button class="chip" id="stRib">Selos: ${Object.keys(META.ribbons).length}/${RIBBONS.length}</button><button class="chip" id="stCh">Desafios: ${Object.keys(META.ch||{}).length}/${CHALLENGES.length}</button><button class="chip" id="stGrave">Cemitério: ${META.grave.length}</button></div>
  </div>`;
  $('#start').hidden=false; $('#death').hidden=true;
  const go=(o,god)=>{ newLife(o); $('#start').hidden=true; MQ.length=0; render.jump=true; render(); pump(); if(god) UI.open(V.god); };
  if(has) $('#stCont').onclick=()=>{ $('#start').hidden=true; render(); pump(); };
  $('#stRand').onclick=()=>go({royal:R.chance(.01)});
  $('#stCustom').onclick=()=>{ go({first:$('#fFirst').value.trim()||undefined,last:$('#fLast').value.trim()||undefined,gender:$('#fGender').value||undefined,country:$('#fCountry').value||undefined,royal:R.chance(.01),diff:$('#fDiff').value},($('#fGod')||{}).checked); };
  if($('#stConq')) $('#stConq').onclick=()=>{ UI.open(V.conquistas); };
  $('#stRib').onclick=()=>{ UI.open(V.ribbons); }; $('#stGrave').onclick=()=>{ UI.open(V.grave); }; $('#stCh').onclick=()=>{ UI.open(V.challenges); };
}
function showDeath(){
  const m=S.me,rib=RIBBONS.find(r=>r.id===S.ribbon)||RIBBONS[RIBBONS.length-1];
  const heirs=kids().filter(k=>k.alive);
  const lastJob=m.job?jobTitle(m.job):m.hist.length?m.hist[m.hist.length-1].t:null;
  $('#death').innerHTML=`<div class="full-in">
    <div class="tomb"><div class="rip">${m.c.gaveUp?'FIM DA HISTÓRIA':'DESCANSE EM PAZ'}</div><div style="display:grid;place-items:center;margin:10px 0 4px">${faceSVG(m,96)}</div><h1>${esc(m.first)} ${esc(m.last)}</h1><p>${m.born} – ${S.year}</p><p style="color:var(--muted)">${esc(m.cause)}, aos ${m.age} anos.</p><div class="ribbon">Selo: ${esc(rib.n)}</div><p style="color:var(--muted);font-size:13px;margin-top:6px">${esc(rib.d)}</p></div>
    <div class="card">${kv('Patrimônio',fmt(netWorth()))}${lastJob?kv('Última profissão',lastJob):''}${kv('Filhos',kids().length+S.people.filter(p=>!p.alive&&['filho','adot'].includes(p.rel)).length)}${kv('Casamentos',m.c.marriages||0)}${kv('Crimes',m.rec.crimes)}${kv('Anos de prisão',m.c.prisonYrs||0)}${kv('Viagens',m.c.trips||0)}${kv('Geração',S.gen)}</div>
    ${(S.newCh||[]).length?`<div class="card"><p><b>Desafio concluído!</b></p>${S.newCh.map(n=>`<p>${esc(n)}</p>`).join('')}</div>`:''}
    ${heirs.length?`<b>Continuar como herdeiro</b>${heirs.map(k=>`<button class="row" data-h="${k.id}"><span class="fw">${faceSVG(k,46)}</span><span class="tx"><span class="l">${esc(fullName(k))}</span><span class="s">${esc(relLabel(k))} · ${k.age} anos · ${esc(looksLine(k))}</span></span></button>`).join('')}`:''}
    ${SNAPS.length&&godUnlocked()?`<button class="btn alt" id="dTime">Máquina do tempo</button>`:''}
    <button class="btn sun" id="dNew">Nova vida</button>
  </div>`;
  $('#death').hidden=false;
  $('#death').onclick=e=>{ const h=e.target.closest('[data-h]'); if(h){ continueAs(P(+h.dataset.h)); $('#death').hidden=true; render.jump=true; render(); pump(); } };
  $('#dNew').onclick=()=>showStart();
  if(SNAPS.length&&godUnlocked()) $('#dTime').onclick=()=>UI.open(V.time);
}
function continueAs(k){
  const old=S.me; const inherit=Math.max(0,Math.round(old.money*.85)); const assets=old.assets, inv=old.inv;
  const eldestK=kids().slice().sort((a,b)=>b.age-a.age)[0]===k;
  const other=P(k.parentId);
  const keep=[];
  const oldP=mkPerson({rel:old.gender==='F'?'mae':'pai',gender:old.gender,first:old.first,last:old.last,age:old.age,bond:k.bond}); oldP.alive=false; keep.push(oldP);
  if(other){ other.rel=other.gender==='F'?'mae':'pai'; other.bond=R.int(50,90); keep.push(other); }
  kids().filter(x=>x!==k).forEach(x=>{ x.rel='irmao'; keep.push(x); });
  S.people.filter(p=>p.alive&&p.rel==='neto'&&p.parentId===k.id).forEach(x=>{ x.rel='filho'; keep.push(x); });
  parents().forEach(x=>{ x.rel='avo'; keep.push(x); });
  people('pet').forEach(x=>keep.push(x));
  const c=countryOf(old.country);
  const m={ first:k.first,last:k.last,gender:k.gender,age:k.age,country:old.country,city:old.city,born:S.year-k.age,
    happy:R.int(40,70),health:clamp(Math.max(k.health,60)),smarts:k.smarts,looks:k.looks,karma:R.int(40,70),fame:Math.round(old.fame/3),money:inherit,
    talent:k.talent||randTalent(),will:k.will??R.int(5,100),fert:k.fert??R.int(15,100),fight:R.int(0,40),genes:k.genes||randGenes(k.gender),
    pref:R.chance(.88)?(k.gender==='M'?'F':'M'):R.pick([k.gender,'A']),add:{alcool:0,cigarro:0,jogo:0},dis:[],edu:{deg:[],cur:null,club:null},
    job:null,hist:[],rec:{arrests:0,conv:0,crimes:0},prison:null,lic:k.age>=18&&R.chance(.7),assets,loans:[],inv,social:null,office:null,ret:null,c:{},yr:{},alive:true,cause:null };
  if(k.age>=15) m.edu.deg.push('fund'); if(k.age>=18&&R.chance(.8)) m.edu.deg.push('medio'); if(k.age>=23&&R.chance(.45)) m.edu.deg.push('uni:'+R.pick(COURSES).id);
  const gen=S.gen+1, year=S.year, dif=S.flags.diff;
  m.biz=old.biz||null; m.c.countries=1;
  if(old.royal&&!old.royal.abd){ const eldest=eldestK; m.royal={house:old.royal.house,pop:old.royal.pop,reign:old.royal.reign&&eldest,abd:false}; m.c.royal=1; if(m.royal.reign) m.c.reigned=1; else if(old.royal.reign){ const h=keep.find(x=>x.rel==='irmao'&&x.age>k.age); if(h){ h.monarch=true; h.job=g('Rei|Rainha',h.gender); } } m.fame=Math.max(m.fame,35); }
  S={v:1,nextId:S.nextId,year,people:keep,log:[{age:k.age,year,lines:[]}],pending:[],births:[],me:m,gen,flags:{cls:old.royal?'realeza':inherit>1e6?'rica':'media',movedOut:k.age>=18?1:0,diff:dif}};
  SNAPS=[]; storeSnaps();
  log(`Continuei a história como ${m.first} ${m.last}, ${k.gender==='F'?'filha':'filho'} de ${old.first}.`,'big');
  if(inherit) log(`Herdei ${fmt(inherit)}${assets.length?` e ${assets.length} ${assets.length>1?'bens':'bem'}`:''}.`,'good');
  if(k.age>=6&&k.age<15) startSchool('fund'); else if(k.age>=15&&k.age<18) startSchool('medio');
  if(k.age>=18&&k.job){ const d=JOBS.find(j=>j.l.some(t=>g(t,k.gender)===k.job)); if(d&&!d.pt){ m.job={id:d.id,lvl:Math.max(0,d.l.findIndex(t=>g(t,k.gender)===k.job)),perf:55,yrs:R.int(0,8),co:companyName()}; } }
  save();
}

function showErr(e){ console.error(e); const el=$('#err'); el.hidden=false; el.textContent='Erro: '+(e&&e.message||e)+'\n'+(e&&e.stack||'').split('\n').slice(0,3).join('\n'); setTimeout(()=>el.hidden=true,9000); }
window.addEventListener('error',e=>showErr(e.error||e.message));

// Botão voltar do Android: fecha minijogo/painel; devolve false quando não há nada aberto (aí o app sai)
window.androidBack=()=>{ const w=id=>{ const e=document.getElementById(id); return e&&!e.hidden; }; if(w('gameWrap')||w('modalWrap')) return true; if(w('sheetWrap')){ UI.back(); return true; } return false; };
function startApp(){
  if(/^#(demo|teste|qualidade|aventura)/.test(location.hash)) window.NO_SAVE=true;
  if(!window.DESKTOP){ try{ boot(); }finally{ hideSplash(); } return; }
  let done=false; const go=()=>{ if(done) return; done=true; try{ boot(); }finally{ hideSplash(); } };
  const load=()=>{ try{ window.pywebview.api.load_all().then(all=>{ for(const k in all){ try{ localStorage.setItem(k,all[k]); }catch(e){} } go(); }).catch(go); }catch(e){ go(); } };
  if(window.pywebview&&window.pywebview.api&&window.pywebview.api.load_all) load(); else window.addEventListener('pywebviewready',load);
  setTimeout(go,5000);
}
function boot(){
  META=Object.assign({lives:0,ribbons:{},grave:[],ch:{}},loadKey(META_KEY)||{});
  SNAPS=loadKey(SNAP_KEY)||[];
  applyTheme();
  $('#sheetBody').addEventListener('click',sheetClick);
  $('#sheetBack').onclick=()=>UI.back(); $('#sheetClose').onclick=()=>UI.close();
  $('#sheetWrap').addEventListener('click',e=>{ if(e.target.id==='sheetWrap') UI.close(); });
  $('#menuBtn').onclick=()=>UI.open(V.menu);
  $('#nCareer').onclick=()=>S.me.alive&&UI.open(V.career);
  $('#nAssets').onclick=()=>S.me.alive&&UI.open(V.assets);
  $('#nAge').onclick=doAge;
  $('#nRel').onclick=()=>S.me.alive&&UI.open(V.relations);
  $('#nAct').onclick=()=>S.me.alive&&UI.open(V.activities);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){ if(!$('#sheetWrap').hidden) UI.back(); return; }
    const idle=$('#sheetWrap').hidden&&$('#modalWrap').hidden&&$('#start').hidden&&$('#death').hidden;
    if(idle&&(e.key===' '||e.key==='+')&&!/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)){ e.preventDefault(); doAge(); }
  });
  if(location.hash==='#aventura'){ try{ advDiag(); }catch(e){ const o=document.createElement('pre'); o.id='out'; o.textContent='ERRO '+e.message+' '+e.stack; document.body.appendChild(o); } return; }
  if(location.hash==='#teste'){ selfTest(); return; } if(location.hash.startsWith('#qualidade')){ try{ qualityReport(); }catch(e){ const o=document.createElement('pre'); o.id='out'; o.textContent='ERRO '+e.message+' '+e.stack; document.body.appendChild(o); } return; }
  if(location.hash==='#autoano'){ const sv=loadKey(SAVE_KEY); if(sv&&sv.me) S=fixSave(sv); else newLife({}); for(let i=0;i<3&&S.me.alive;i++){ ageUp(); while(S.pending.length){ const e=S.pending.shift(); if(!evValid(e)) continue; const sh=EVENTS[e.id].show(e.d); const r=EVENTS[e.id].pick(sh.ch[0][1],e.d); log(sh.t+' → '+sh.ch[0][0]+(r?'. '+r:'.'),'choice'); } } save(); render.jump=true; render(); return; }
  if(location.hash.startsWith('#demo')){ const hs=location.hash; newLife({}); setTimeout(()=>{ if(hs.includes('rel')) UI.open(V.relations); if(hs.includes('style')) UI.open(V.style); if(hs.includes('hair')){ UI.open(V.style); UI.push(V.styleHair); } if(hs.includes('act')) UI.open(V.activities); if(hs.includes('person')){ UI.open(V.relations); UI.push(()=>V.person(people('mae')[0]||people()[0])); } if(hs.includes('ev')){ queue('carteira',EVENTS.carteira.prep()); pump(); } if(hs.includes('death')){ die('de teste'); showDeath(); } if(hs.includes('start')) showStart(); if(hs.includes('cars')){ UI.open(V.assets); UI.push(V.cars); } if(hs.includes('pets')){ UI.open(V.activities); UI.push(V.pets); } if(hs.includes('shop')){ UI.open(V.assets); UI.push(V.shop); } if(hs.includes('vis')){ UI.open(V.style); } if(hs.includes('icone')){ document.documentElement.style.background='transparent'; document.body.style.cssText='margin:0;background:transparent'; document.body.innerHTML=appIconSVG(512); return; } if(hs.includes('cenarios')){ S.me.alive=true; S.me.prison=null; UI.open(V.scenPick); }
    else if(/zumbi|isekai|sc-\w+/.test(hs)){ const m=S.me; m.prison=null; while(m.age<20){ m.alive=true; m.health=Math.max(m.health,60); S.pending=[]; ageUp(); } S.pending=[]; m.alive=true; const id=(hs.match(/sc-(\w+)/)||[])[1]||(hs.includes('isekai')?'isekai':'zumbi'); scStart(id); if(id==='isekai'){ UI.close(); S.scen.cls='guerreiro'; } for(let i=0;i<3;i++){ S.pending=[]; scNextDay(); } S.pending=[]; MQ.length=0; render.jump=true; render(); const pane=(hs.match(/-(local|grupo|itens|acoes|vila|magia|ficha|base|oficina|faccoes|procurar|equipe|amor)$/)||[])[1]; if(id==='zumbi'&&pane){ const sc=S.scen; zEnsure(sc); sc.zmat=46; sc.zlv=4; sc.zpts=2; sc.dia=38; sc.rec=38; sc.nextHorde=45; Object.assign(sc.zat,{for:9,mir:7,fur:8,med:6,mec:10,lid:7}); if(['base','acoes','oficina','faccoes','procurar'].includes(pane)){ zFoundBase('Último Refúgio'); const b=sc.zb; b.pop=14; b.moral=72; b.com=36; b.agua=28; Object.assign(b.b,{muro:3,horta:2,poco:2,enfermaria:1,oficina:2,alojamento:3,torre:1,armadilhas:1}); sc.zf.merc.rep=42; sc.zf.corvos.rep=-38; sc.zf.guarda.rep=12; sc.zf.igreja.rep=-6; addItem('corda',90,true); addItem('pilha',90,true); addItem('taco',80,true); } UI.open({base:V.zBase,acoes:V.scActs,oficina:V.zCraft,faccoes:V.zFac,procurar:V.zScav,ficha:V.zMe,local:V.scLocal,grupo:V.scCrew,itens:V.scItems}[pane]); } if(id==='isekai'&&pane&&['vila','magia','ficha'].includes(pane)){ const sc=S.scen; sc.ouro=4200; sc.lvl=9; sc.cls='mago'; iskEnsure(sc); learnSpell(sc,true); learnSpell(sc,true); sc.pts=3; if(pane==='vila'){ vilaFound('Nova Aurora'); const v=sc.vila; v.pop=27; Object.assign(v.b,{casa:4,fazenda:3,tecelagem:2,serraria:2,mercado:1,escola:1,taverna:1,muralha:1}); v.tech=['agricultura','escrita','tear']; v.tier=2; v.res='moeda'; v.pqT=24; v.com=120; v.rou=34; v.man=41; v.fel=78; } } if(id==='heroi'&&pane){ const sc=S.scen; hEnsure(sc); sc.rep=62; sc.reg='nao'; sc.proc=38; m.job={hero:'sentinelas',lvl:1,perf:71,yrs:0,co:HTEAMS.sentinelas.n}; sc.hxp=3; if(!partner()){ const p=candidate(false); p.rel='namoro'; S.people.push(p); } sc.sab[partner().id]=1; mkCrew(); } if(pane==='amor'){ const c=crew().find(x=>romOK(x))||mkCrew({gender:S.me.gender==='F'?'M':'F',age:S.me.age}); c.gender=S.me.gender==='F'?'M':'F'; c.am=74; romStart(c); c.par='noivo'; S.scen.grav={pid:c.id,due:S.scen.dia+4}; UI.open(()=>V.scMember(c)); } if(pane==='equipe') UI.open(V.hTeam); if(pane&&id!=='zumbi'&&!['amor','equipe'].includes(pane)) UI.open({local:V.scLocal,grupo:V.scCrew,itens:V.scItems,acoes:V.scActs,vila:V.iskVila,magia:V.iskMagic,ficha:V.iskMe}[pane]); }
    else if(hs.includes('doencas')){ const L=[['catapora',8,'F'],['marcas',25,'F'],['cancer_mama',40,'F'],['leucemia',12,'M'],['volta',45,'M'],['vitiligo',30,'M'],['conjuntivite',22,'F'],['sarampo',6,'M'],['catarata',72,'F'],['psoriase',35,'M'],['acne',16,'M'],['verruga',50,'F']];
      document.body.innerHTML='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px;background:#fff">'+L.map(([d,a,gd],i)=>{ const q=mkPerson({rel:'tmp',gender:gd,age:a,bond:70}); q.id=i+3; ensureLook(q); q.look.hair=gd==='F'?'longo':'curto'; q.dis=d==='marcas'||d==='volta'?[]:[{id:d,y:0}]; if(d==='marcas') q.genes.pox=1; if(d==='vitiligo') q.genes.vitiligo=1; if(d==='volta') q.hairBack=S.year+2; return '<div style="text-align:center;font:10px sans-serif">'+faceSVG(q,110)+'<br>'+d+'</div>'; }).join('')+'</div>'; }
    else if(hs.includes('faccao')){ const m=S.me; m.prison=null; m.job={spc:'crime',lvl:2,perf:64,yrs:1,lvlYrs:1,co:'Facção',heat:45}; UI.open(V.faccao); }
    else if(hs.includes('placa')){ const m=S.me; m.alive=true; m.cause=null; m.health=Math.max(m.health,60); render(); m.age=Math.max(m.age,18); m.prison=null; m.lic=false; m.money=5000; m.yr.lic=0; drivingTest(); }
    else if(hs.includes('passaporte')){ S.me.prison=null; UI.open(V.emigrate); }
    else if(hs.includes('menuz')){ UI.open(V.menu); }
    else if(hs.includes('briga')){ const m=S.me; m.fight=60; m.martial={jiu:{lvl:4,last:-9},muay:{lvl:6,last:-9}}; const p=people().find(x=>x.rel!=='pet')||people()[0]; startFight({p},'pessoa'); fightTurn(myMoves()[0]); fightTurn(myMoves()[4]); UI.refresh(); }
    else if(hs.includes('lutas')){ S.me.martial={judo:{lvl:3,last:-9},jiu:{lvl:4,last:-9}}; UI.open(V.martial); }
    else if(hs.includes('aulas')){ UI.open(V.lessons); }
    else if(hs.includes('cadeia')){ const m=S.me; m.prison={crime:'roubo',left:6,total:8,served:2,behav:40,gang:{n:'Comando da Ala B',rank:1,rep:55}}; render(); UI.open(V.activities); }
    else if(hs.includes('emprego')){ const m=S.me; m.prison=null; if(!m.job){ const o={id:'adm',co:'Grupo Boreal',mul:1}; if(JOBS.find(x=>x.id==='adm')) takeJob(o); else takeJob(openings()[0]); } m.yr.load=7; UI.open(V.career); UI.push(V.jobMenu); }
    else if(hs.includes('clube')){ const m=S.me; m.age=15; m.prison=null; m.edu.cur={type:'medio',n:'Ensino Médio',len:3,yr:0,grade:66}; joinClub(CLUBS[0]); m.edu.clubLvl=1; m.edu.clubPerf=64; UI.open(V.career); UI.push(V.clubMenu); }
    else if(hs.includes('prova')){ const m=S.me; m.age=11; m.edu.cur={type:'fund',n:'Ensino Fundamental',len:9,yr:5,grade:62}; m.prison=null; S.pending=[]; const d=EVENTS.prova_q.prep(m); if(hs.includes('prova2')) d.go=1; queue('prova_q',d); render(); pump(); } else if(hs.includes('faculdade')){ const m=S.me; m.edu.cur=null; if(!m.edu.deg.includes('medio')) m.edu.deg.push('medio'); m.edu.hist=[{t:'f1',g:72},{t:'f2',g:66},{t:'m',g:70}]; UI.open(V.uniList); UI.push(()=>V.uniList().items.length&&({title:COURSES[1].n,items:[]})); UI.back(); } else if(/trabalho/.test(hs)){ const m=S.me; m.alive=true; m.prison=null; m.age=Math.max(m.age,28); S.pending=[]; MQ.length=0; if(!m.edu.deg.includes('medio')) m.edu.deg.push('medio'); takeJob({id:'poli',co:'Polícia Civil',size:'grande',mul:1}); UI.open(V.jobMenu); UI.push(V.trabalho); }
    else if(/turma|relacoes/.test(hs)){ const m=S.me; m.alive=true; m.prison=null; S.pending=[]; MQ.length=0; if(hs.includes('turma')){ m.age=16; m.edu.cur={type:'medio',n:'Ensino Médio',len:3,yr:1,grade:72,pub:1}; if(!people('colega').length) for(let i=0;i<6;i++) S.people.push(mkPerson({rel:'colega',age:16,bond:R.int(20,70)})); UI.open(V.career); UI.push(V.turma); } else { render(); UI.open(V.relations); } }
    else if(/seita|caso|golpe|paranormal|desistir|equipe/.test(hs)){ const m=S.me; m.prison=null; m.alive=true; if(m.age<26){ m.age=30; } m.money=Math.max(m.money,400000); S.pending=[]; MQ.length=0;
      if(hs.includes('seita')){ seitaFundar('apoc','Filhos da Última Aurora'); const s=m.seita; s.fieis=342; s.devo=81; s.caixa=184000; s.susp=46; s.fama=38; s.templo=2; s.anos=4; UI.open(V.activities); UI.push(V.seita); }
      if(hs.includes('caso')){ if(!m.edu.deg.includes('medio')) m.edu.deg.push('medio'); takeJob({id:'poli',co:'Polícia Civil',size:'grande',mul:1}); const c=novoCaso(); casoPasso(c,'per',0); casoPasso(c,'int',1); casoPasso(c,'cam',0); UI.open(V.activities); UI.push(V.caso(c)); }
      if(hs.includes('golpe')){ revStart('Frente Popular de Libertação'); Object.assign(m.rev,{apoio:58,mil:35,armas:44,susp:41,membros:12800}); UI.open(V.politics); UI.push(V.rev); }
      if(hs.includes('paranormal')){ m.criatura='vampiro'; para().prova=7; para().visitas=9; UI.open(V.activities); UI.push(V.paranormal); }
      if(hs.includes('equipe')){ m.age=16; m.edu.club=CLUBS[0].n; m.edu.clubLvl=1; UI.open(V.clubMenu); const it=V.clubMenu().items.find(x=>x.l==='Membros da equipe'); const ms=grpMembers(clubKey()); if(ms[0]){ ms[0].rel='amigo'; ms[0].bond=80; } it.on(); }
      if(hs.includes('desistir')){ if(!partner()){ const p=candidate(false); p.rel='conjuge'; p.bond=88; S.people.push(p); } if(!kids().length){ S.people.push(mkPerson({rel:'filho',age:7,last:m.last,bond:95})); } render(); giveUpFlow(); } }
    else if(hs.includes('idades')){ document.body.innerHTML=faceAges(); } else if(hs.includes('rostos')){ document.body.innerHTML=faceGallery(hs.includes('grande'),+(hs.match(/p(\d+)/)||[0,0])[1]); } if(hs.includes('garagem')){ document.body.innerHTML='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px;background:#fff\">'+CAR_MODELS.map((c,i)=>'<div style="text-align:center;font:10px sans-serif\">'+carSVG(c,Object.keys(PAINT)[i%10],110)+'<br>'+c.b+' '+c.m+'</div>').join('')+'</div>'; } },50); for(let i=0;i<24&&S.me.alive;i++){ ageUp(); while(S.pending.length){ const e=S.pending.shift(); if(!evValid(e)) continue; const sh=EVENTS[e.id].show(e.d); const r=EVENTS[e.id].pick(sh.ch[sh.ch.length-1][1],e.d); if(r) log(sh.t.replace(/[!?.…]+$/,'')+': '+r); } } render.jump=true; render(); return; }
  const saved=loadKey(SAVE_KEY);
  if(saved&&saved.me&&saved.v===1){ S=fixSave(saved); render.jump=true; render(); if(SAVE_RECOVERED) setTimeout(()=>{ try{ modal({k:'NewLife',t:'Save recuperado',x:'O último salvamento estava danificado. Abri a cópia de segurança anterior: você pode ter perdido só a última ação.'}); }catch(e){} },900); if(S.me.alive){ showStart(); } else showDeath(); }
  else if(!META.lives){ newLife({royal:R.chance(.01)}); render.jump=true; render(); pump(); }
  else showStart();
}
