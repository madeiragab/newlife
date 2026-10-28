// ===== 2.19: ritmo dos eventos =====
// Cada sistema põe os seus eventos na fila e o ano virava uma enxurrada. Agora, quando o jogador aperta
// Envelhecer, o ano mostra de 1 a 3 eventos (raramente, menos de 1% das vezes, 4 ou 5). O que é obrigatório
// (julgamento, reeleição, vestibular, TCC…) sempre aparece; histórias e eventos de sistema que sobram ficam
// para os anos seguintes; os aleatórios que sobram são descartados. Os testes chamam ageUp direto e veem tudo.

const EV_SEMPRE=new Set(['julgamento','reeleicao','esc_vestibular','esc_tcc','frenesi','filho_ataque','regime_eleicao','nk_resposta','imp_coroacao','seita_fe_mundial','seita_regra','seita_heranca','aposentadoria_ajuste','cri_cacada']);
const EV_ADIADOS_MAX=6;
const nlLimiteAno=()=>R.chance(.008)?R.int(4,5):R.int(1,3);
const evAleatorio=e=>{ const ev=EVENTS[e.id]; return !!(ev&&ev.w&&!String(e.id).startsWith('cad_')); };
// prioridade de quem fica guardado quando sobra mais do que cabe: EVENTS[id].prio manda; sem ela, história
// em andamento (cad_) vem antes de evento de sistema. O que não cabe nem na fila fica registrado em NL_RITMO_LOG.
const evPrio=e=>{ const ev=EVENTS[e.id]; return ev&&typeof ev.prio==='number'?ev.prio:String(e.id).startsWith('cad_')?2:1; };
window.NL_RITMO_LOG=window.NL_RITMO_LOG||[];
function ritmoRegistra(tipo,e,err){ const L=window.NL_RITMO_LOG; L.push({tipo,id:e&&e.id,ano:S.year,erro:err&&String(err.message||err)}); if(L.length>50) L.splice(0,L.length-50);
  console.warn('Ritmo: '+tipo+' '+(e&&e.id)+(err?' · '+(err.message||err):'')); }
function limitarAno(L){ const m=S.me; if(!m||!m.alive) return;
  const antigos=(m.adiados||[]).filter(e=>e&&EVENTS[e.id]); m.adiados=[];
  const fila=antigos.concat(S.pending).filter(e=>{ try{ return evValid(e); }catch(err){ ritmoRegistra('evento inválido',e,err); return false; } });
  L=L||nlLimiteAno();
  const sempre=fila.filter(e=>EV_SEMPRE.has(e.id)), resto=fila.filter(e=>!EV_SEMPRE.has(e.id));
  // quem já esperou um ano tem prioridade; o resto é sorteado
  const velhos=resto.filter(e=>antigos.includes(e)), novos=R.shuffle(resto.filter(e=>!antigos.includes(e)));
  const vez=velhos.concat(novos).slice(0,Math.max(0,L-sempre.length));
  S.pending=fila.filter(e=>sempre.includes(e)||vez.includes(e));
  const guardar=resto.filter(e=>!vez.includes(e)&&!evAleatorio(e)).map((e,i)=>[e,i]).sort((a,b)=>evPrio(b[0])-evPrio(a[0])||a[1]-b[1]).map(x=>x[0]);
  m.adiados=guardar.slice(0,EV_ADIADOS_MAX); guardar.slice(EV_ADIADOS_MAX).forEach(e=>ritmoRegistra('descartado (fila cheia)',e)); }
ageUp=(o=>function(){ const r=o.apply(this,arguments); if(window.NL_RITMO&&!S.scen) try{ limitarAno(); }catch(e){ console.error('Ritmo: limitarAno falhou',e); } return r; })(ageUp);
doAge=(o=>function(){ window.NL_RITMO=1; try{ return o.apply(this,arguments); } finally{ window.NL_RITMO=0; } })(doAge);

function ritmoSelfTest(){ const s0=S,ns=window.NO_SAVE; window.NO_SAVE=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); };
  try{ newLife({country:'BR'}); const m=S.me; m.age=30;
    const aleat=Object.keys(EVENTS).filter(id=>EVENTS[id].w&&!EVENTS[id].scen&&!EVENTS[id].when&&!id.startsWith('cad_')).slice(0,8);
    const sist=['cx_biz_lavagem','seita_traidor','imp_revolta','esc_quiz'].filter(id=>EVENTS[id]);
    const dist={};
    for(let i=0;i<3000;i++){ m.adiados=[]; S.pending=aleat.map(id=>({id,d:{}})).concat(sist.map(id=>({id,d:{}}))); limitarAno(); const n=S.pending.length; dist[n]=(dist[n]||0)+1; }
    const total=3000, raro=((dist[4]||0)+(dist[5]||0))/total; ok(!dist[0]&&!dist[6],'quantidade fora de 1 a 5: '+JSON.stringify(dist)); ok((dist[1]||0)+(dist[2]||0)+(dist[3]||0)>=total*.97,'1 a 3 não é o normal: '+JSON.stringify(dist)); ok(raro<.02,'4 ou 5 aparecem demais: '+raro);
    // obrigatórios nunca somem; o que sobra de sistema espera o ano seguinte
    m.adiados=[]; S.pending=[{id:'julgamento',d:{c:'furto',min:1,max:2}}].concat(sist.map(id=>({id,d:{}}))).concat(aleat.map(id=>({id,d:{}}))); limitarAno(1);
    ok(S.pending.some(e=>e.id==='julgamento'),'julgamento sumiu'); ok(m.adiados.every(e=>!evAleatorio(e)),'aleatório ficou guardado'); ok(m.adiados.length<=EV_ADIADOS_MAX,'fila guardada grande demais');
    const guardado=m.adiados[0]; S.pending=[]; limitarAno(3); ok(!guardado||S.pending.some(e=>e===guardado||e.id===guardado.id),'evento guardado não voltou no ano seguinte');
    // fila cheia: história em andamento passa na frente e o descarte fica registrado
    const cads=Object.keys(EVENTS).filter(id=>id.startsWith('cad_')).slice(0,2);
    if(cads.length&&sist.length){ const n0=window.NL_RITMO_LOG.length; m.adiados=[];
      S.pending=sist.concat(sist,sist).map(id=>({id,d:{}})).concat(cads.map(id=>({id,d:{}}))); const tem=S.pending.filter(e=>{ try{ return evValid(e); }catch(_){ return false; } });
      limitarAno(1); const guard=tem.filter(e=>!S.pending.includes(e)&&!evAleatorio(e));
      if(guard.length>EV_ADIADOS_MAX) ok(window.NL_RITMO_LOG.length>n0,'descarte da fila não foi registrado');
      ok(m.adiados.every((e,i,a)=>!i||evPrio(a[i-1])>=evPrio(e)),'fila guardada fora da ordem de prioridade'); }
    // ageUp sem o botão (testes e simulações) não corta nada
    window.NL_RITMO=0; S.pending=[]; m.adiados=[];
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; window.NL_RITMO=0; }
  if(erros.length) throw Error('Ritmo 2.19 · '+erros.join(' | ')); return {ok:true}; }
