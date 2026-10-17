// Iniciativas dos NPCs: um convite ou projeto por ano, sem agir pelo jogador.
function npcAtivos(){return people('amigo','mae','pai','irmao','filho','adot','namoro','noivo','conjuge').filter(p=>p.age>=10);}
function npcIniciativa(){
 if(!S.me.alive||S.scen||S.me.prison||S.pending.some(e=>e.id==='npc_convite'))return;
 const l=npcAtivos().filter(p=>p.npcAno!==S.year);if(!l.length||!R.chance(.3))return;
 const p=R.wpick(l.map(p=>[p,1+npcPerfil(p).ambicao/100]));p.npcAno=S.year;
 if(p.age>=18&&R.chance(.15+npcPerfil(p).ambicao/200)){p.npcProjeto=(npcPerfil(p).ambicao>65?'projeto de trabalho em ':npcPerfil(p).lealdade>65?'grupo comunitário de ':'curso de ')+npcPerfil(p).interesse;p.smarts=clamp(p.smarts+2);log(p.first+' começou um '+p.npcProjeto+' por iniciativa própria.','good');}
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

// A trajetória pertence à pessoa, preservando emprego, país e família no save.
const NPC_PROXIMOS=['amigo','ex_amigo','mae','pai','irmao','filho','adot','neto','avo','namoro','noivo','conjuge','ex'];
function npcAcompanhado(p){return !S.scen&&p.rel!=='pet'&&(NPC_PROXIMOS.includes(p.rel)||!!p.vida);}
function npcVida(p){if(!p.country||!COUNTRIES.some(c=>c.id===p.country))p.country=S.me.country;if(!p.vida){p.vida={historico:[],filhos:[],inicio:S.year,aposentado:p.age>=70};if(['mae','pai'].includes(p.rel)&&!S.flags.divorced){const q=people(p.rel==='mae'?'pai':'mae')[0];if(q)p.vida.par=q.id;}}return p.vida;}
function npcMarco(p,tipo,texto,extra={}){const v=npcVida(p),h={ano:S.year,tipo,texto,...extra};v.historico.push(h);v.historico=v.historico.slice(-24);if(!S._npcResumo)S._npcResumo=[];S._npcResumo.push({pid:p.id,...h});return h;}
function npcEmprego(p){const v=npcVida(p),d=R.pick(JOBS.filter(j=>!j.pt&&!j.spc));p.job=g(d.l[0],p.gender);v.emprego={id:d.id,nivel:0,desde:S.year};npcMarco(p,'emprego',p.first+' começou a trabalhar como '+p.job.toLowerCase()+'.');}
function npcPodeFormarFamilia(p){return p.alive&&p.age>=18&&!['namoro','noivo','conjuge'].includes(p.rel)&&!p.monarch;}
function npcUnir(p,q){if(!npcPodeFormarFamilia(p)||!npcPodeFormarFamilia(q)||p.id===q.id||npcVida(p).par||npcVida(q).par)return false;npcVida(p).par=q.id;npcVida(q).par=p.id;npcMarco(p,'casamento',p.first+' se casou com '+fullName(q)+'.',{outro:q.id});npcMarco(q,'casamento',q.first+' se casou com '+fullName(p)+'.',{outro:p.id});return true;}
function npcFilho(p,q){if(!npcPodeFormarFamilia(p)||!npcPodeFormarFamilia(q)||p.age<21||q.age<21||p.age>50||q.age>50||Math.min(p.age,q.age)>43||S.people.length>=160)return null;const v=npcVida(p),w=npcVida(q);if(v.par!==q.id||w.par!==p.id||v.filhos.length>=4||w.filhos.length>=4)return null;const rel=['filho','adot'].includes(p.rel)||['filho','adot'].includes(q.rel)?'neto':'conhecido';const k=mkPerson({rel,age:0,last:p.last,country:p.country,parentId:['filho','adot'].includes(q.rel)?q.id:p.id,from:[p,q]});k.parentIds=[p.id,q.id];S.people.push(k);v.filhos.push(k.id);w.filhos.push(k.id);npcMarco(p,'filho',p.first+' e '+q.first+' tiveram '+fullName(k)+'.',{outro:k.id});return k;}
function npcTrajetoria(p){if(!p.alive||!npcAcompanhado(p))return;const v=npcVida(p);if(v.ano===S.year)return;v.ano=S.year;if(p.age<18)return;const t=npcPerfil(p);
 if(p.age>=70&&!v.aposentado){v.aposentado=true;v.ultimoEmprego=p.job;p.job=null;npcMarco(p,'aposentadoria',p.first+' se aposentou.');}
 if(!v.aposentado){if(!p.job&&R.chance(.22+t.ambicao/500))npcEmprego(p);else if(p.job&&R.chance(.025+t.ambicao/3000)){npcEmprego(p);npcMarco(p,'carreira',p.first+' decidiu mudar de carreira.');}}
 const inc=v.aposentado?3000:p.job?8000:-1500;p.money=Math.round((Number.isFinite(p.money)?p.money:0)+inc);
 const par=v.par&&P(v.par);if(v.par&&(!par||!par.alive)){v.par=null;if(par?.vida)par.vida.par=null;npcMarco(p,'viuvez',p.first+' perdeu '+(par?.first||'seu par')+'.');}
 if(par?.alive&&npcPodeFormarFamilia(p)&&npcPodeFormarFamilia(par)&&R.chance(.012+(100-t.lealdade)/6000)){v.par=null;npcVida(par).par=null;npcMarco(p,'separacao',p.first+' e '+par.first+' se separaram.');}
 if(npcPodeFormarFamilia(p)&&!v.par&&p.age<75&&S.people.length<120&&R.chance(.055)){const q=mkPerson({rel:'conhecido',age:Math.max(18,p.age+R.int(-5,5)),country:p.country});S.people.push(q);npcUnir(p,q);}
 const q=v.par&&P(v.par);if(q?.alive&&p.id<q.id&&R.chance(.065))npcFilho(p,q);
 if(p.age>=21&&p.age<65&&!['namoro','noivo','conjuge','mae','pai'].includes(p.rel)&&R.chance(.012)){const c=R.pick(COUNTRIES.filter(c=>c.id!==p.country));if(p.money>=8000){p.money-=5000;p.country=c.id;if(q?.alive)q.country=c.id;npcMarco(p,'emigracao',p.first+' se mudou para '+c.n+'.',{pais:c.id});}}
}
function npcTrajetoriasAno(){if(S.scen||!S.me.alive)return;S._npcResumo=[];for(const p of S.people.slice())npcTrajetoria(p);for(const h of S._npcResumo.slice(0,3))log(h.texto,h.tipo==='separacao'||h.tipo==='viuvez'?'warn':'');delete S._npcResumo;}
yearPeople=(o=>function(){const r=o.apply(this,arguments);npcTrajetoriasAno();return r;})(yearPeople);
V.person=(o=>function(p){const r=o(p);if(r&&npcAcompanhado(p)){const v=npcVida(p),q=v.par&&P(v.par);r.items.push({sec:'Trajetória pessoal'},{l:'Vida em '+countryOf(p.country).n,s:(v.aposentado?'Aposentadoria':p.job||'Sem emprego')+(q?.alive?' · casado com '+fullName(q):'')},...v.historico.slice(-6).reverse().map(h=>({l:String(h.ano),s:h.texto})));}return r;})(V.person);
