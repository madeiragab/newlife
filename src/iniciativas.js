// Iniciativas dos NPCs: um convite ou projeto por ano, sem agir pelo jogador.
function npcAtivos(){return people('amigo','mae','pai','irmao','filho','adot','namoro','noivo','conjuge').filter(p=>p.age>=10);}
function npcIniciativa(){
 if(!S.me.alive||S.scen||S.me.prison||S.pending.some(e=>e.id==='npc_convite'))return;
 const l=npcAtivos().filter(p=>p.npcAno!==S.year);if(!l.length||!R.chance(.3))return;
 const p=R.pick(l);p.npcAno=S.year;
 if(p.age>=18&&R.chance(.35)){p.npcProjeto=R.pick(['curso de formação','projeto de trabalho','grupo de voluntariado']);p.smarts=clamp(p.smarts+2);log(p.first+' começou um '+p.npcProjeto+' por iniciativa própria.','good');}
 else queue('npc_convite',{pid:p.id});
}
function npcResponder(p,k){if(!p||!p.alive)return 'Não foi possível combinar o encontro.';
 if(k==='sim'){p.bond=clamp(p.bond+8);p.npcUltimoEncontro=S.year;st('happy',5);return 'Aceitei o convite de '+p.first+'. Passamos um tempo juntos.';}
 if(k==='depois'){p.bond=clamp(p.bond+1);return 'Expliquei que agora não consigo. Podemos combinar outro dia.';}
 p.bond=clamp(p.bond-5);return p.first+' percebeu que ignorei o convite.';
}
EVENTS.npc_convite={when:m=>npcAtivos().length>0,show:d=>({k:'Social',t:'Um convite inesperado',x:(P(d.pid)?.first||'Uma pessoa próxima')+' tomou a iniciativa de me chamar para conversar e passar um tempo junto.',ch:[['Aceitar o convite','sim'],['Explicar e deixar para depois','depois'],['Ignorar','nao']]}),pick:(k,d)=>npcResponder(P(d.pid),k)};
yearPeople=(o=>function(){const r=o.apply(this,arguments);npcIniciativa();return r;})(yearPeople);
V.person=(o=>function(p){const r=o(p);if(r&&p.npcProjeto)r.items.push({l:'Projeto pessoal',s:p.npcProjeto});return r;})(V.person);
