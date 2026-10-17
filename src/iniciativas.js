// Iniciativas dos NPCs: um convite ou projeto por ano, sem agir pelo jogador.
function npcAtivos(){return people('amigo','ex_amigo','mae','pai','irmao','filho','adot','namoro','noivo','conjuge').filter(p=>p.age>=10);}
function npcIniciativa(){
 if(!S.me.alive||S.scen||S.me.prison||S.pending.some(e=>['npc_convite','npc_conversa'].includes(e.id)))return;
 const l=npcAtivos().filter(p=>p.npcAno!==S.year&&S.year-(p.vida?.ultimoPedido??-999)>1);if(!l.length)return;
 const peso=p=>{const t=npcPerfil(p),v=npcVida(p),ausencia=S.year-(v.contato??v.inicio);return 1+p.bond/70+t.lealdade/150+(ausencia>3?1:0)+(!p.job&&p.age>=18?1:0);};
 if(!R.chance(.25+Math.min(.2,l.length*.012)))return;
 const p=R.wpick(l.map(p=>[p,peso(p)])),v=npcVida(p);p.npcAno=S.year;v.ultimoPedido=S.year;
 let tipo='convite';if(p.rel==='ex_amigo'&&p.bond>=15)tipo='reconciliar';else if(p.age>=18&&!p.job&&!v.aposentado)tipo='apoio';else if(S.year-(v.contato??v.inicio)>3&&p.bond<65)tipo='distancia';else if(p.age>=18&&p.job&&npcPerfil(p).ambicao>60&&S.me.age>=18&&!S.me.job)tipo='oportunidade';
 queue('npc_conversa',{pid:p.id,tipo,ano:S.year});
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
function npcEmprego(p){const v=npcVida(p),d=R.pick(JOBS.filter(j=>!j.pt&&!j.spc&&(!j.edu||p.age>=23&&p.smarts>=60)));p.job=g(d.l[0],p.gender);v.emprego={id:d.id,nivel:0,desde:S.year};npcMarco(p,'emprego',p.first+' começou a trabalhar como '+p.job.toLowerCase()+'.');}
function npcPodeFormarFamilia(p){return p.alive&&p.age>=18&&!['namoro','noivo','conjuge'].includes(p.rel)&&!p.monarch;}
function npcUnir(p,q){if(!npcPodeFormarFamilia(p)||!npcPodeFormarFamilia(q)||p.id===q.id||npcVida(p).par||npcVida(q).par)return false;npcVida(p).par=q.id;npcVida(q).par=p.id;npcMarco(p,'casamento',p.first+' se casou com '+fullName(q)+'.',{outro:q.id});npcMarco(q,'casamento',q.first+' se casou com '+fullName(p)+'.',{outro:p.id});return true;}
function npcFilho(p,q){if(!npcPodeFormarFamilia(p)||!npcPodeFormarFamilia(q)||p.age<21||q.age<21||p.age>50||q.age>50||Math.min(p.age,q.age)>43||S.people.length>=160)return null;const v=npcVida(p),w=npcVida(q);if(v.par!==q.id||w.par!==p.id||v.filhos.length>=4||w.filhos.length>=4)return null;const rel=['filho','adot'].includes(p.rel)||['filho','adot'].includes(q.rel)?'neto':'conhecido';const k=mkPerson({rel,age:0,last:p.last,country:p.country,parentId:['filho','adot'].includes(q.rel)?q.id:p.id,from:[p,q]});k.parentIds=[p.id,q.id];S.people.push(k);v.filhos.push(k.id);w.filhos.push(k.id);npcMarco(p,'filho',p.first+' e '+q.first+' tiveram '+fullName(k)+'.',{outro:k.id});return k;}
function npcTrajetoria(p){if(!p.alive||!npcAcompanhado(p))return;const v=npcVida(p);if(v.ano===S.year)return;v.ano=S.year;if(p.age<18)return;const t=npcPerfil(p);
 if(p.age>=70&&!v.aposentado){v.aposentado=true;v.ultimoEmprego=p.job;p.job=null;npcMarco(p,'aposentadoria',p.first+' se aposentou.');}
 if(!v.aposentado&&!v.negocio){if(!p.job&&R.chance(npcChanceEmprego(p)))npcEmprego(p);else if(p.job&&R.chance(.025+t.ambicao/3000)){npcEmprego(p);npcMarco(p,'carreira',p.first+' decidiu mudar de carreira.');}}
 npcFinancasAno(p);
 const par=v.par&&(v.par===S.me.id?S.me:P(v.par));if(v.par&&(!par||!par.alive)){v.par=null;if(par?.vida)par.vida.par=null;npcMarco(p,'viuvez',p.first+' perdeu '+(par?.first||'seu par')+'.');}
 if(par?.alive&&npcPodeFormarFamilia(p)&&npcPodeFormarFamilia(par)&&R.chance(.012+(100-t.lealdade)/6000)){v.par=null;npcVida(par).par=null;npcMarco(p,'separacao',p.first+' e '+par.first+' se separaram.');}
 if(npcPodeFormarFamilia(p)&&!v.par&&p.age<75&&S.people.length<120&&R.chance(.055)){const q=mkPerson({rel:'conhecido',age:Math.max(18,p.age+R.int(-5,5)),country:p.country});S.people.push(q);npcUnir(p,q);}
 const q=v.par&&P(v.par);if(q?.alive&&p.id<q.id&&R.chance(.065))npcFilho(p,q);
 if(p.age>=21&&p.age<65&&!['namoro','noivo','conjuge','mae','pai'].includes(p.rel)&&R.chance(mundo(p.country).crescimento<0?.04:.008)){const c=npcDestino(p);if(p.money>=8000){p.money-=5000;p.country=c.id;if(q?.alive)q.country=c.id;npcMarco(p,'emigracao',p.first+' se mudou para '+c.n+'.',{pais:c.id});}}
}
function npcTrajetoriasAno(){if(S.scen||!S.me.alive)return;S._npcResumo=[];for(const p of S.people.slice())npcTrajetoria(p);for(const h of S._npcResumo.slice(0,3))log(h.texto,h.tipo==='separacao'||h.tipo==='viuvez'?'warn':'');delete S._npcResumo;}
yearPeople=(o=>function(){const r=o.apply(this,arguments);npcTrajetoriasAno();return r;})(yearPeople);
V.person=(o=>function(p){const r=o(p);if(r&&npcAcompanhado(p)){const v=npcVida(p),q=v.par&&P(v.par);r.items.push({sec:'Trajetória pessoal'},{l:'Vida em '+countryOf(p.country).n,s:(v.aposentado?'Aposentadoria':p.job||'Sem emprego')+(q?.alive?' · casado com '+fullName(q):'')},...v.historico.slice(-6).reverse().map(h=>({l:String(h.ano),s:h.texto})));}return r;})(V.person);

function npcContato(p){if(p&&p.alive)npcVida(p).contato=S.year;}
function npcDesgaste(p){const v=npcVida(p),t=npcPerfil(p),anos=S.year-(v.contato??v.inicio);if(anos<=2)return 0;return R.chance(t.lealdade>65?.25:.55)?1:0;}
const NPC_ASSUNTOS={convite:['Vamos nos encontrar?', 'quer passar um tempo comigo.'],apoio:['Uma fase difícil', 'está sem trabalho e me procurou para conversar sobre os próximos passos.'],distancia:['Sinto sua falta', 'percebeu que nos afastamos e quer conversar sobre nossa relação.'],reconciliar:['Podemos nos reaproximar?', 'lembrou da nossa amizade e propôs tentar uma reaproximação.'],oportunidade:['Uma indicação profissional', 'soube de uma vaga e se ofereceu para me indicar. A contratação depende dos requisitos.']};
function npcConversaResolver(k,d){const p=P(d.pid);if(!p?.alive)return 'Essa conversa já não é possível.';const v=npcVida(p);if(v.respostaAno===d.ano)return 'Já respondi a essa conversa.';v.respostaAno=d.ano;
 if(k==='adiar'){p.bond=clamp(p.bond-1);return 'Expliquei que preciso de tempo. Não fiz uma promessa.';}
 if(k==='ignorar'){p.bond=clamp(p.bond-4);relMemoria(p,'ausencia');return p.first+' ficou sentindo a distância. Ainda podemos conversar depois.';}
 npcContato(p);p.bond=clamp(p.bond+6);st('happy',3);
 if(d.tipo==='reconciliar'&&p.rel==='ex_amigo'){p.rel='amigo';relMemoria(p,'reconciliacao');return 'Aceitei reconstruir a amizade aos poucos. As lembranças anteriores continuam.';}
 if(d.tipo==='apoio'){relMemoria(p,'apoio');v.apoio={ano:S.year,tipo:'escuta'};return 'Ouvi '+p.first+' e ajudei a pensar em alternativas. O apoio não garante um emprego.';}
 if(d.tipo==='oportunidade'){if(S.me.age<18||S.me.job)return 'Minha situação de trabalho já mudou.';const j=JOBS.find(j=>j.id===v.emprego?.id);if(!j||jobReqs(j).length)return 'A indicação não dispensa formação e experiência. Ainda não atendo aos requisitos.';takeJob({id:j.id,co:companyName(),size:'pequena',mul:1});return 'Aceitei a indicação de '+p.first+' e fui contratado para uma vaga compatível.';}
 return 'Reservei um tempo para '+p.first+'. A iniciativa dessa conversa veio de '+(p.gender==='F'?'ela':'ele')+'.';
}
EVENTS.npc_conversa={show:d=>{const p=P(d.pid),a=NPC_ASSUNTOS[d.tipo]||NPC_ASSUNTOS.convite;return {k:'Pessoas próximas',t:a[0],x:(p?.first||'Uma pessoa próxima')+' '+a[1],ch:[['Ouvir e aceitar a conversa','ouvir'],['Explicar e adiar','adiar'],['Ignorar','ignorar']]};},pick:npcConversaResolver};
interact=(o=>function(p,k){const b=p?.bond,r=o.apply(this,arguments);if(p?.alive&&p.bond>b)npcContato(p);return r;})(interact);
polyNamorar=(o=>function(p){const r=o.apply(this,arguments);if(p&&partners().includes(p)){const v=npcVida(p),q=v.par&&P(v.par);if(q){npcVida(q).par=null;v.par=null;npcMarco(p,'separacao',p.first+' encerrou a união anterior com '+q.first+'.');}npcContato(p);}return r;})(polyNamorar);

// Pequenos negócios usam o mesmo cálculo operacional das empresas do protagonista.
function npcNegocioAno(p){if(!p.alive||p.age<23||!npcAcompanhado(p))return;const v=npcVida(p);if(v.negocioAno===S.year)return;v.negocioAno=S.year;const w=mundo(p.country),t=npcPerfil(p);let b=v.negocio;
 if(!b&&v.apoio&&S.year-v.apoio.ano>=2&&p.money>=40000&&t.ambicao>=55&&w.crescimento>0&&R.chance(.1)){p.money-=35000;b=v.negocio={n:'Negócio de '+p.first,sector:'Lanchonete',country:p.country,capital:25000,caixa:10000,emp:1,inicio:S.year};p.job=null;v.emprego=null;npcMarco(p,'empresa',p.first+' abriu um pequeno negócio após reconstruir suas reservas.');}
 if(!b)return;const precos=Object.fromEntries(['alimentos','servicos','salarios','imoveis','veiculos'].map(k=>[k,mercadoIndice(b.country,k)]));const r=empresaCalcular(b,mundo(b.country),precos,1,0,R.norm(0,.06));b.caixa+=r.lucro;b.resultado={ano:S.year,lucro:Math.round(r.lucro)};
 if(b.caixa<0){const perda=Math.min(b.capital,-b.caixa);b.capital-=perda;b.caixa+=perda;if(b.capital<5000){p.money+=Math.max(0,b.caixa);v.negocio=null;npcMarco(p,'falencia',p.first+' fechou o negócio após perdas.');return;}}
 const retirada=Math.min(Math.max(0,b.caixa-5000),6000);b.caixa-=retirada;p.money+=Math.round(retirada);if(b.caixa>20000&&b.capital<250000){const invest=Math.min(b.caixa*.2,250000-b.capital);b.caixa-=invest;b.capital+=invest;}
 if(v.apoio&&!v.retribuicao&&S.year-v.apoio.ano>=3&&p.bond>40&&b.resultado.lucro>0&&S.me.age>=18&&!S.me.job&&!S.pending.some(e=>e.id==='npc_conversa')){v.retribuicao=S.year;queue('npc_conversa',{pid:p.id,tipo:'retorno',ano:S.year});}
}
NPC_ASSUNTOS.retorno=['Lembrou de quem ajudou', 'lembrou do meu apoio numa fase difícil e ofereceu uma vaga no pequeno negócio que conseguiu abrir.'];
npcConversaResolver=(o=>function(k,d){if(d.tipo!=='retorno')return o(k,d);const p=P(d.pid),v=p&&npcVida(p);if(!p?.alive||!v.negocio)return 'O negócio já não está disponível.';if(v.respostaAno===d.ano)return 'Já respondi a essa oferta.';if(k!=='ouvir')return o(k,{...d,tipo:'convite'});v.respostaAno=d.ano;npcContato(p);if(S.me.age<18||S.me.job||S.me.prison)return 'Minha situação já mudou; não pude aceitar a vaga.';const j=JOBS.find(j=>j.id==='lanch');if(jobReqs(j).length)return 'Ainda não atendo aos requisitos da vaga.';takeJob({id:j.id,co:v.negocio.n,size:'pequena',mul:1});relMemoria(p,'retribuicao');return 'Aceitei trabalhar com '+p.first+'. A oportunidade nasceu de uma ajuda de anos atrás, sem retorno garantido.';})(npcConversaResolver);
EVENTS.npc_conversa.pick=(k,d)=>npcConversaResolver(k,d);
yearPeople=(o=>function(){const r=o.apply(this,arguments);if(!S.scen&&S.me.alive)for(const p of S.people.slice())npcNegocioAno(p);return r;})(yearPeople);

// Decisões cotidianas usam bens e pessoas reais, com uma oportunidade a cada três anos.
function cotidiano(){return S.me.cotidiano||(S.me.cotidiano={notas:[]});}
function cotidianoRegistrar(tipo,texto,extra={}){const c=cotidiano();c.notas.push({ano:S.year,tipo,texto,...extra});c.notas=c.notas.slice(-16);log(texto);}
function cotidianoAno(){const m=S.me;if(!m.alive||S.scen||m.age<18||m.prison)return;const c=cotidiano();if(S.year-(c.ultimo??-999)<3||S.pending.some(e=>e.id==='vida_cotidiana')||!R.chance(.4))return;const op=[];
 const casa=m.assets.find(a=>a.k==='casa'&&a.cond<75);if(casa)op.push({tipo:'reparo',aid:casa.id,custo:Math.max(500,Math.round(casa.value*.006))});
 const filho=kids().find(p=>p.age>=6&&p.age<18&&(p.smarts<50||familiaCriacao(p).pressao>60));if(filho)op.push({tipo:'escola',pid:filho.id});
 const amigo=people('amigo').find(p=>p.age>=18&&S.year-(npcVida(p).inicio??S.year)>=5);if(amigo)op.push({tipo:'amizade',pid:amigo.id});
 if(m.age>=45&&!m.ret)op.push({tipo:'reserva',custo:2000});if(m.job&&m.job.yrs>=5&&m.job.perf>=65)op.push({tipo:'trabalho',emprego:m.job.id,empresa:m.job.co});
 if(op.length){c.ultimo=S.year;queue('vida_cotidiana',{...R.pick(op),ano:S.year});}
}
function cotidianoResolver(k,d){const m=S.me,c=cotidiano();if(c.resposta===d.ano)return 'Já cuidei desse assunto.';const p=d.pid&&P(d.pid),a=d.aid&&m.assets.find(a=>a.id===d.aid);
 if(d.pid&&!p?.alive||d.aid&&!a)return 'A situação mudou; essa decisão não se aplica mais.';
 if(d.tipo==='reparo'){if(k==='agir'){if(!canPay(d.custo))return 'Não tenho dinheiro para esse reparo.';m.money-=d.custo;a.cond=clamp(a.cond+18);cotidianoRegistrar('reparo','Fiz a manutenção de '+a.n+' por '+fmt(d.custo)+'.',{aid:a.id,cond:a.cond});}else{a.cond=clamp(a.cond-2);cotidianoRegistrar('reparo_adiado','Adiei a manutenção de '+a.n+'. O desgaste continua.',{aid:a.id});}}
 if(d.tipo==='escola'){if(p.age>=18||!['filho','adot'].includes(p.rel))return 'Essa fase escolar já terminou.';const f=familiaCriacao(p);if(k==='agir'){f.pressao=clamp(f.pressao-8);f.afeto=clamp(f.afeto+4);f.presenca=S.year;p.bond=clamp(p.bond+4);p.smarts=clamp(p.smarts+1);cotidianoRegistrar('escola','Conversei com '+p.first+' e com a escola para adaptar a rotina de estudos.',{pid:p.id});}else cotidianoRegistrar('escola','Deixei '+p.first+' tentar resolver a dificuldade por enquanto.',{pid:p.id});}
 if(d.tipo==='amizade'){if(p.rel!=='amigo')return 'Nossa relação já mudou.';if(k==='agir'){npcContato(p);p.bond=clamp(p.bond+5);relMemoria(p,'amizade_antiga');st('happy',4);cotidianoRegistrar('amizade','Reencontrei '+p.first+' e lembramos dos anos de amizade.',{pid:p.id});}else cotidianoRegistrar('amizade','Adiei o reencontro com '+p.first+'.',{pid:p.id});}
 if(d.tipo==='reserva'){if(k==='agir'){if(!canPay(d.custo))return 'Ainda não tenho essa reserva disponível.';m.money-=d.custo;m.inv.poup+=d.custo;cotidianoRegistrar('reserva','Separei '+fmt(d.custo)+' na poupança para o futuro. O dinheiro continua no meu patrimônio.');}else cotidianoRegistrar('reserva','Adiei o plano de aumentar minha reserva para a aposentadoria.');}
 if(d.tipo==='trabalho'){if(m.job?.id!==d.emprego||m.job.co!==d.empresa)return 'Já não trabalho nessa empresa.';if(k==='agir'){m.job.perf=clamp(m.job.perf+3);st('happy',3);cotidianoRegistrar('trabalho','Compartilhei minha experiência com a equipe da '+m.job.co+'.');}else cotidianoRegistrar('trabalho','Preferi manter minha rotina profissional.');}
 c.resposta=d.ano;return c.notas.at(-1)?.texto||'Segui minha rotina.';
}
EVENTS.vida_cotidiana={show:d=>{const p=d.pid&&P(d.pid),txt={reparo:['A casa pede cuidado','O desgaste do imóvel trouxe uma decisão de manutenção. O reparo custa '+fmt(d.custo)+'.','Fazer o reparo'],escola:['Uma dificuldade na escola',(p?.first||'Meu filho')+' está com dificuldades e precisa de uma rotina que respeite seus limites.','Conversar com a criança e a escola'],amizade:['Uma amizade de muitos anos',(p?.first||'Uma amizade antiga')+' propôs relembrar os velhos tempos.','Reservar um tempo juntos'],reserva:['Pensando nos próximos anos','Posso separar '+fmt(d.custo)+' para a aposentadoria. É uma transferência para minha poupança, sem rendimento garantido além das regras atuais.','Separar a reserva'],trabalho:['Experiência que conta','Depois de anos de trabalho, a equipe pediu que eu compartilhasse o que aprendi.','Ajudar a equipe']}[d.tipo];return {k:'Vida cotidiana',t:txt[0],x:txt[1],ch:[[txt[2],'agir'],['Deixar para depois','adiar']]};},pick:cotidianoResolver};
yearPeople=(o=>function(){const r=o.apply(this,arguments);cotidianoAno();return r;})(yearPeople);
V.me=(o=>function(){const r=o();if(r&&S.me.cotidiano?.notas.length)r.items.push({sec:'Decisões da vida comum'},...S.me.cotidiano.notas.slice(-6).reverse().map(n=>({l:String(n.ano),s:n.texto})));return r;})(V.me);
