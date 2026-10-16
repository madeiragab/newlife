// Repercussão não é sinônimo de culpa: pessoas reagem à investigação e aos vínculos.
function escandaloReagir(c){if(!c.publico||c.reacoes)return;c.reacoes=[];const m=S.me;m.reputacao=clamp((m.reputacao??60)-12);if(m.social)m.social.f=Math.max(0,Math.round(m.social.f*.9));if(seita()){seita().fieis=Math.round(seita().fieis*.88);seita().devo=clamp(seita().devo-8);}
 const proximos=people('namoro','noivo','conjuge','amigo','mae','pai','irmao','filho','adot');
 for(const p of proximos){if(p.age<18){p.bond=clamp(p.bond-2);continue;}const t=npcPerfil(p);let tipo='afastou-se';
 if(t.lealdade>=70&&p.bond>=60){tipo='pediu uma apuração justa';p.bond=clamp(p.bond+2);}
 else if(t.ambicao>65&&t.lealdade<45){tipo='entregou informações à investigação';if(!c.semRegistro)c.provas=clamp(c.provas+5);p.bond=clamp(p.bond-12);}
 else if(partners().includes(p)&&(p.bond<35||(t.ciume>75&&t.lealdade<40))){tipo='decidiu terminar o relacionamento';relFim(p);}
 else{p.bond=clamp(p.bond-8);relMemoria(p,'conflito');}
 p.publicoReacao={ano:S.year,cid:c.id,tipo};c.reacoes.push({pid:p.id,n:p.first,tipo});}
 if(c.reacoes.length)noticia('Pessoas próximas reagem ao caso de '+m.first,c.reacoes.slice(0,8).map(x=>x.n+' '+x.tipo+'.').join(' '),'repercussao');
}
justicaAbrir=(o=>function(c){const r=o.apply(this,arguments);escandaloReagir(c);return r;})(justicaAbrir);
V.person=(o=>function(p){const r=o(p);if(r&&p.publicoReacao)r.items.push({l:'Reação ao escândalo',s:p.publicoReacao.ano+' · '+p.publicoReacao.tipo});return r;})(V.person);
V.jornal=(o=>()=>{const r=o();r.items.unshift({html:'<div class="card">'+bar('Reputação pública',S.me.reputacao??60)+'<p>Fama mede visibilidade. Reputação mede confiança: um escândalo pode tornar alguém conhecido e menos confiável.</p></div>'});return r;})(V.jornal);
