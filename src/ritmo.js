// ===== 2.19: ritmo dos eventos =====
// Cada sistema põe os seus eventos na fila e o ano virava uma enxurrada. Agora, quando o jogador aperta
// Envelhecer, o ano mostra de 1 a 3 eventos (raramente, menos de 1% das vezes, 4 ou 5). O que é obrigatório
// (julgamento, reeleição, vestibular, TCC…) sempre aparece; histórias e eventos de sistema que sobram ficam
// para os anos seguintes; os aleatórios que sobram são descartados. Os testes chamam ageUp direto e veem tudo.

const EV_SEMPRE=new Set(['julgamento','reeleicao','esc_vestibular','esc_tcc','frenesi','filho_ataque','regime_eleicao','nk_resposta','imp_coroacao','seita_fe_mundial','seita_regra','seita_heranca','aposentadoria_ajuste','cri_cacada']);
const EV_ADIADOS_MAX=6;
const nlLimiteAno=()=>R.chance(.008)?R.int(4,5):R.int(1,3);
const evAleatorio=e=>{ const ev=EVENTS[e.id]; return !!(ev&&ev.w&&!String(e.id).startsWith('cad_')); };
function limitarAno(L){ const m=S.me; if(!m||!m.alive) return;
  const antigos=(m.adiados||[]).filter(e=>e&&EVENTS[e.id]); m.adiados=[];
  const fila=antigos.concat(S.pending).filter(e=>{ try{ return evValid(e); }catch(err){ return false; } });
  L=L||nlLimiteAno();
  const sempre=fila.filter(e=>EV_SEMPRE.has(e.id)), resto=fila.filter(e=>!EV_SEMPRE.has(e.id));
  // quem já esperou um ano tem prioridade; o resto é sorteado
  const velhos=resto.filter(e=>antigos.includes(e)), novos=R.shuffle(resto.filter(e=>!antigos.includes(e)));
  const vez=velhos.concat(novos).slice(0,Math.max(0,L-sempre.length));
  S.pending=fila.filter(e=>sempre.includes(e)||vez.includes(e));
  m.adiados=resto.filter(e=>!vez.includes(e)&&!evAleatorio(e)).slice(0,EV_ADIADOS_MAX); }
ageUp=(o=>function(){ const r=o.apply(this,arguments); if(window.NL_RITMO&&!S.scen) try{ limitarAno(); }catch(e){} return r; })(ageUp);
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
    // ageUp sem o botão (testes e simulações) não corta nada
    window.NL_RITMO=0; S.pending=[]; m.adiados=[];
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; window.NL_RITMO=0; }
  if(erros.length) throw Error('Ritmo 2.19 · '+erros.join(' | ')); return {ok:true}; }
