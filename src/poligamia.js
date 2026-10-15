// ===== Relações plurais: uma nova pessoa por rodada de consentimento =====
const polyAmores=()=>people('namoro','noivo','conjuge');
const polyChave=()=>polyAmores().map(p=>p.id).sort((a,b)=>a-b).join(',');
function polyPerfil(p){
  // Migração estável dos saves antigos: abrir a tela novamente não sorteia outra personalidade.
  return p.polyPerfil||(p.polyPerfil={abertura:(p.id*37+(p.will||50)*13)%101,ciume:clamp((p.craze||0)*.65+(p.id*19%36))});
}
const polyChance=p=>{ const t=polyPerfil(p); return clamp(10+t.abertura*.75-t.ciume*.55+(p.bond-50)*.3,3,95)/100; };
const polyGrupo=()=>{ const l=polyAmores(); return l.length<2||l.every(p=>l.every(q=>q.id===p.id||(p.polyCom||[]).includes(q.id))); };
const polyRodada=()=>{ const r=S.me.polyRodada; return r&&r.chave===polyChave()?r:null; };
const polyUnanime=()=>{ const l=polyAmores(),r=polyRodada(); return !!(l.length&&r&&l.every(p=>r.votos[p.id]===true)); };
const polyPodeOficializar=p=>polyAmores().includes(p)&&(!polyAmores().some(q=>q.id!==p.id)||polyGrupo());
function polyPropor(p){
  const l=polyAmores(); if(!S.me.alive||S.scen||S.me.age<18||!l.includes(p)||l.some(q=>q.age<18)) return 'Essa conversa só está disponível entre parceiros adultos na vida normal.';
  let r=polyRodada(); if(!r) r=S.me.polyRodada={chave:polyChave(),votos:{},anos:{}};
  if(r.votos[p.id]===true) return `${p.first} já concordou com a entrada de mais uma pessoa nesta rodada.`;
  if(r.anos[p.id]===S.year||p.polyRecusa===S.year) return `${p.first} já recusou esta proposta. Vou respeitar a resposta; só podemos conversar de novo no próximo ano.`;
  r.anos[p.id]=S.year; r.votos[p.id]=R.chance(polyChance(p));
  if(!r.votos[p.id]){ p.polyRecusa=S.year; return `${p.first} não aceitou ter mais uma pessoa na relação. Sem a concordância de todos, não vou começar outro namoro nem casamento.`; }
  if(polyUnanime()){ S.pending=S.pending.filter(e=>e.id!=='amantes'); l.forEach(q=>q.polyCom=l.filter(x=>x!==q).map(x=>x.id)); return `${p.first} aceitou. Todos concordaram: podemos incluir mais uma pessoa, desde que ela também aceite. Depois disso, qualquer nova inclusão exige outra conversa com todos.`; }
  return `${p.first} aceitou a ideia. Ainda preciso conversar com ${l.filter(q=>r.votos[q.id]!==true).map(q=>q.first).join(', ')}. Uma pessoa aceitar não decide pelas outras.`;
}
function polyEntrada(p){
  const l=polyAmores().filter(q=>q.id!==p.id); if(!l.length) return '';
  if(S.me.age<18||p.age<18||l.some(q=>q.age<18)) return 'Relações plurais estão disponíveis apenas entre adultos.';
  if(!polyUnanime()) return 'Antes de começar outro relacionamento, preciso propor a ideia e receber o sim de todos os meus parceiros atuais.';
  const chave=polyChave(),v=p.polyConvite;
  if(v&&v.chave===chave&&v.ano===S.year) return v.ok?'':`${p.first} não quer entrar numa relação com outras pessoas. Vou respeitar essa decisão.`;
  const ok=R.chance(polyChance(p)); p.polyConvite={chave,ano:S.year,ok};
  return ok?'':`${p.first} soube dos meus outros relacionamentos e não aceitou entrar. Ninguém vai ser incluído escondido.`;
}
function polyRegistrar(p,anteriores){
  if(!anteriores.length){ p.polyCom=[]; return; }
  const l=polyAmores(); l.forEach(q=>q.polyCom=l.filter(x=>x.id!==q.id).map(x=>x.id));
  delete S.me.polyRodada;
  log(`${p.first} entrou na relação com o consentimento de ${anteriores.map(q=>q.first).join(', ')}. Para incluir outra pessoa, vamos conversar novamente.`,'good');
}
function polyLimpar(p){ delete S.me.polyRodada; p.polyCom=[]; delete p.polyConvite; polyAmores().forEach(q=>q.polyCom=(q.polyCom||[]).filter(id=>id!==p.id)); }
V.poly=()=>{ const l=polyAmores(),r=polyRodada(); return {title:'Relação com mais pessoas',items:[
  {html:'<div class="card"><p>Cada parceiro decide por si. Todos precisam aceitar a entrada de mais uma pessoa; a pessoa nova também será informada e poderá recusar. Acordos aceitos não contam como traição.</p><p>'+ (polyUnanime()?'Todos concordaram com mais uma pessoa.':'Converse com cada parceiro abaixo.')+'</p><p>Uma recusa impede a inclusão. Não é possível insistir no mesmo ano.</p></div>'},
  ...l.map(p=>{ const t=polyPerfil(p),v=r&&r.votos[p.id];return {ic:'💬',l:'Conversar com '+p.first,s:`${relLabel(p)} · Abertura ${t.abertura}% · Ciúme ${t.ciume}% · ${v===true?'Aceitou':v===false?'Recusou':'Ainda não conversamos'}`,on:()=>act(()=>polyPropor(p),'Proposta')}; }),
  ...(!l.length?[{html:'Primeiro preciso estar em um relacionamento.'}]:[])
]}; };
V.person=(o=>function(p){ const r=o(p); if(r&&r.items&&S.me.age>=18&&p.age>=18&&!S.scen&&polyAmores().includes(p)) r.items.push({ic:'💞',l:'Propor relação com mais pessoas',s:'Conversa e consentimento de todos',on:()=>UI.push(V.poly)}); return r; })(V.person);
V.love=(o=>()=>{ const r=o(); if(S.me.age>=18&&!S.scen&&polyAmores().length) r.items.unshift({ic:'💞',l:'Relação com mais pessoas',s:polyUnanime()?'Todos aceitaram mais uma pessoa':'Conversar com meus parceiros',on:()=>UI.push(V.poly)}); return r; })(V.love);
// Término ou divórcio invalida a rodada, sem desfazer os acordos entre quem ficou.
divorce=(o=>function(p){ const r=o.apply(this,arguments); polyLimpar(p); return r; })(divorce);

// Eventos e histórias usam a mesma autorização que os encontros da interface.
function polyNamorar(p){
  if(polyAmores().includes(p)) return '';
  const erro=polyEntrada(p); if(erro) return erro;
  const antes=polyAmores(); p.rel='namoro'; polyRegistrar(p,antes); return '';
}
