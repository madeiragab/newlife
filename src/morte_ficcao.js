// ===== Morrer (ou desistir) num mundo fictício: quem reage é o grupo daquele mundo, não a família =====
const MF_FALAS={
  zumbi:[c=>`${c} fez o que tinha que ser feito para você não voltar. Depois chorou sozinh${c.o} no banco de trás.`,c=>`${c} pegou sua arma e prometeu levar o grupo até o fim, por você.`,c=>`${c} riscou seu nome no capô da picape, junto com os outros que ficaram pelo caminho.`,c=>`${c} não disse nada. Só ficou de vigia a noite inteira, olhando para onde você caiu.`,c=>`${c} enterrou você à beira da estrada e marcou o lugar com uma cruz de madeira.`],
  ilha:[c=>`${c} enterrou você na areia, perto das letras de SOS que vocês fizeram juntos.`,c=>`${c} passou a conversar com a bola de vôlei, porque não sobrou mais ninguém para ouvir.`,c=>`${c} prometeu que, se for resgatad${c.o}, vai contar sua história.`,c=>`${c} acendeu a fogueira mais alta que a ilha já viu, em sua homenagem.`],
  isekai:[c=>`${c} acendeu uma pira élfica para você sob os dois sóis.`,c=>`${c} jurou derrotar o Rei Demônio usando a sua espada.`,c=>`${c} cantou uma balada élfica sobre o herói de outro mundo. A taverna inteira chorou.`,c=>`${c} guardou seu cantil e nunca mais bebeu de outro.`,c=>`${c} gravou seu nome na pedra da guilda dos aventureiros.`],
  marte:[c=>`${c} gravou uma mensagem para a sua família na Terra. Levou três tentativas para terminar sem chorar.`,c=>`${c} plantou uma batata em sua memória na estufa.`,c=>`${c} assumiu as suas tarefas na base, em silêncio.`,c=>`${c} deixou seu capacete pendurado na entrada do habitat. Ninguém tem coragem de tirar.`],
};
const MF_FIM={zumbi:'O comboio seguiu viagem sem você.',ilha:'A ilha ficou mais silenciosa.',isekai:'Eldoria perdeu alguém que veio de muito longe.',marte:'A base seguiu, um colono a menos.'};
function mfGuarda(){ const sc=S.scen; if(!sc||sc.id==='heroi'||!S.me) return; S.ultScen={id:sc.id,idade:S.me.age,crew:(sc.crew||[]).filter(c=>!c.bicho).map(c=>({id:c.id,first:c.first,gender:c.gender,age:c.age,genes:c.genes,look:c.look,lv:c.lv,par:c.par,filho:c.filho}))}; }
scCheck=(o=>function(){ const sc=S.scen; if(sc&&sc.v===SC_V&&sc.hl<=0) mfGuarda(); return o.apply(this,arguments); })(scCheck);
die=(o=>function(){ if(S&&S.scen&&S.me&&S.me.alive) mfGuarda(); return o.apply(this,arguments); })(die);
newLife=(o=>function(){ if(S) S.ultScen=null; const r=o.apply(this,arguments); S.ultScen=null; return r; })(newLife);
function mfFala(c,id,used){ const L=MF_FALAS[id]||MF_FALAS.zumbi, nome=Object.assign(new String(c.first),{o:c.gender==='F'?'a':'o'});
  if(c.par) return `${c.first} não saiu do seu lado até o fim. Ninguém conseguiu tirar ${c.gender==='F'?'ela':'ele'} de lá.`;
  if(c.filho) return `${c.first} perguntou quando você vai voltar. Ninguém teve coragem de responder.`;
  let t=''; for(let i=0;i<6;i++){ t=R.pick(L)(nome); if(!used.has(t)) break; } used.add(t); return t; }
function mfRows(info){ const used=new Set(); const cs=info.crew.slice().sort((a,b)=>(b.par?100:b.filho?90:0)+(b.lv||0)-((a.par?100:a.filho?90:0)+(a.lv||0))).slice(0,6);
  return cs.map(c=>{ let f=''; try{ f=faceSVG(Object.assign({id:'mf'+c.id,bond:c.lv||60},c),44); }catch(e){} return `<div style="display:flex;gap:10px;align-items:center;margin:8px 0">${f}<div><p style="margin:0"><b>${esc(c.first)}</b></p><p style="margin:0;font-size:13px">${esc(mfFala(c,info.id,used))}</p></div></div>`; }).join(''); }
// tela da morte: o grupo do mundo fictício
showDeath=(o=>function(){ const r=o.apply(this,arguments); try{ const m=S.me, info=S.ultScen; if(info&&info.idade===m.age){ const el=$('#death .full-in'); const card=el&&el.querySelector('.card');
  const html=`<div class="card"><p><b>${SCEN[info.id]?SCEN[info.id].ic+' ':''}Como o grupo recebeu a notícia</b></p>${info.crew.length?mfRows(info):'<p style="color:var(--muted)">Ninguém do grupo estava lá para ver.</p>'}<p style="color:var(--muted);font-size:13px">${MF_FIM[info.id]||''}</p></div>`;
  if(card) card.insertAdjacentHTML('afterend',html); } }catch(e){ console.error(e); } return r; })(showDeath);
// desistir dentro de um mundo fictício: o grupo reage
giveUpFlow=(o=>function(){ const sc=S.scen, m=S.me; if(!sc||sc.id==='heroi'||!m||!m.alive) return o.apply(this,arguments);
  const info={id:sc.id,crew:(sc.crew||[]).filter(c=>!c.bicho)};
  const html=info.crew.length?`<div style="text-align:left;margin-top:6px">${mfRows(info)}</div>`:'<p style="color:var(--muted)">Não há ninguém do seu lado aqui. Ninguém vai saber o que aconteceu.</p>';
  modal({t:`Antes de ${m.first} desistir…`,x:'É assim que o grupo vai receber a notícia.',html,ch:[{l:'Continuar lutando',fn:()=>{ scStat('san',4); scLog('Pensei em desistir. Olhei para o grupo e continuei.','good'); }},{l:'Desistir mesmo assim',cls:'danger',fn:()=>{ UI.close(); mfGuarda(); S.scen=null; die('desistiu'); save(); render(); showDeath(); }}]}); })(giveUpFlow);
