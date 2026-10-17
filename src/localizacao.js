// Localização da pessoa, dos empregos e da residência são registros distintos.
function mesmaCidade(p,q=S.me){return !!(p&&q&&p.country===q.country&&p.city&&p.city===q.city);}
function residenciaMigrar(s){const m=s?.me;if(!m||m.localizacaoV)return s;m.localizacaoV=1;
 for(const p of s.people||[])if(!p.city&&p.country===m.country&&(['namoro','noivo','conjuge'].includes(p.rel)||['filho','adot'].includes(p.rel)&&p.age<18)){p.city=m.city;p.localLegado=true;}
 const casas=(m.assets||[]).filter(a=>a.k==='casa'&&(!a.country||a.country===m.country));
 // Só o caso legado inequívoco recebe a localização atual; outros imóveis aguardam identificação.
 if(casas.length===1&&!casas[0].city){Object.assign(casas[0],{country:m.country,city:m.city,localLegado:true});if(!m.residenciaId)m.residenciaId=casas[0].id;}return s;}
function residenciaAtual(){residenciaMigrar(S);return S.me.assets.find(a=>a.id===S.me.residenciaId&&a.k==='casa'&&mesmaCidade(a))||null;}
function residenciaOcupar(a){if(!S.me.alive||S.me.age<18||S.me.prison||S.scen||!S.me.assets.includes(a)||a.k!=='casa'||!mesmaCidade(a))return 'Preciso de uma casa nesta cidade para registrar minha residência.';S.me.residenciaId=a.id;return 'Passei a morar em '+a.n+'. Os benefícios desta residência dependem de eu continuar morando aqui.';}
fixSave=(o=>function(s){return residenciaMigrar(o(s));})(fixSave);
mkPerson=(o=>function(d){const p=o.apply(this,arguments);p.city=d?.city||(p.country===S?.me?.country?S.me.city:R.pick(countryOf(p.country).cities));return p;})(mkPerson);
houseListings=(o=>function(){const m=S.me;if(m.yr.casasCidade!==m.city){m.yr.houses=null;m.yr.casasCidade=m.city;}return o.apply(this,arguments).map(a=>({...a,city:m.city}));})(houseListings);
buy=(o=>function(k,l){if(k==='casa'&&l.city&&l.city!==S.me.city)return 'Essa oferta pertence a outra cidade. Consulte as ofertas atuais.';const ids=new Set(S.me.assets.map(a=>a.id)),r=o.apply(this,arguments);for(const a of S.me.assets)if(k==='casa'&&!ids.has(a.id)){a.city=l.city||S.me.city;if(!residenciaAtual())S.me.residenciaId=a.id;}return r;})(buy);
V.asset=(o=>function(a){const r=o.apply(this,arguments);if(r&&a.k==='casa'){r.items.push({l:'Localização',s:countryOf(a.country||S.me.country).n+' · '+(a.city||'cidade não registrada')},{l:residenciaAtual()===a?'Minha residência atual':'Imóvel possuído',s:residenciaAtual()===a?'Benefícios enquanto eu morar aqui':'Ter a propriedade não significa morar nela'});if(mesmaCidade(a)&&residenciaAtual()!==a)r.items.push({l:'Morar nesta casa',on:()=>act(()=>residenciaOcupar(a),'Residência')});}return r;})(V.asset);
function npcMudarLocal(p,pais,cidade){if(!p?.alive||!countryOf(pais).cities.includes(cidade))return false;const v=npcVida(p),anterior={pais:p.country,cidade:p.city};if(p.country===pais&&p.city===cidade)return true;
 p.country=pais;p.city=cidade;const j=v.emprego,d=JOBS.find(x=>x.id===j?.id)||JOBS.find(x=>x.l.some(t=>g(t,p.gender)===p.job));
 if(p.job){const remoto=!!(d&&['prog','dev','designer','tradutor'].includes(d.id));const transferivel=anterior.pais===pais&&!!d&&/pol|prof|enfer|medic/.test(d.id);
 if(remoto){v.emprego={...j,id:d.id,remoto:true,pais,cidade};npcMarco(p,'trabalho_remoto',p.first+' manteve o trabalho remoto após a mudança.');}
 else if(transferivel){v.emprego={...j,id:d.id,pais,cidade,transferido:S.year};npcMarco(p,'transferencia',p.first+' conseguiu transferência de trabalho para '+cidade+'.');}
 else{v.ultimoEmprego=p.job;p.job=null;v.emprego=null;npcMarco(p,'mudanca_emprego',p.first+' encerrou o emprego local ao se mudar para '+cidade+'.');}}
 npcMarco(p,'mudanca_cidade',p.first+' passou a morar em '+cidade+', '+countryOf(pais).n+'.',{origem:anterior,pais,cidade});return true;}
