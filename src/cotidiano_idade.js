// Envelhecer muda as escolhas da rotina, sem impor doença ou novas cobranças.
function cotidianoIdadeEstado(){const c=cotidiano();c.notas||=[];c.maturidade||={};return c.maturidade;}
function cotidianoIdadeDisponivel(){const m=S.me;return !!(m.alive&&m.age>=18&&!m.prison&&!S.scen);}
function cotidianoIdadeCasa(a){return !!(a&&a===residenciaAtual());}
function cotidianoIdadeIdoso(p){return !!(p?.alive&&p.age>=65&&parents().concat(kids(),partners()).includes(p));}
const COTIDIANO_IDADE_TIPOS=['rotina_aposentada','casa_acessivel','apoio_idoso','vizinhanca'];
cotidianoCandidatos=(o=>function(){const op=o.apply(this,arguments);if(!cotidianoIdadeDisponivel())return op;const m=S.me,c=cotidiano(),e=cotidianoIdadeEstado();
 const add=(d,peso)=>{const chave=d.tipo+':'+(d.pid??d.aid??'pessoal'),u=c.selecoes?.[chave];op.push({...d,chave,peso:peso*(u==null?1.3:Math.min(1.5,.35+(S.year-u)/12))});};
 if(m.ret&&m.age>=50&&(!e.rotina||S.year-e.rotina.ano>=9))add({tipo:'rotina_aposentada'},3+(e.rotina?0:2));
 if(m.age>=60)for(const a of m.assets.filter(cotidianoIdadeCasa))if(!a.acessibilidade)add({tipo:'casa_acessivel',aid:a.id,custo:Math.max(300,Math.round(Math.max(0,a.value||0)*.004))},2+(m.age>=75?2:0));
 for(const p of parents().concat(kids(),partners()).filter(cotidianoIdadeIdoso)){const v=npcVida(p);if(S.year-(v.redeApoio?.ano??-999)>=6)add({tipo:'apoio_idoso',pid:p.id},2+Math.min(4,(S.year-(v.contato??v.inicio))/4)+(p.money<0?2:0));}
 const casa=m.assets.find(cotidianoIdadeCasa);if(casa)for(const p of people().filter(p=>p.age>=18&&mesmaCidade(p)&&['amigo','conhecido'].includes(p.rel))){const v=npcVida(p);if(S.year-(v.vizinhanca?.ano??-999)>=8)add({tipo:'vizinhanca',pid:p.id,aid:casa.id},1+Math.min(3,(S.year-(v.contato??v.inicio))/6));}
 return op;
})(cotidianoCandidatos);

function cotidianoIdadeValido(d){if(!cotidianoIdadeDisponivel())return false;const m=S.me,p=d.pid&&P(d.pid),a=d.aid&&m.assets.find(x=>x.id===d.aid);
 if(d.tipo==='rotina_aposentada')return !!(m.ret&&m.age>=50);
 if(d.tipo==='casa_acessivel')return m.age>=60&&cotidianoIdadeCasa(a)&&!a.acessibilidade;
 if(d.tipo==='apoio_idoso')return cotidianoIdadeIdoso(p);
 if(d.tipo==='vizinhanca')return !!(cotidianoIdadeCasa(a)&&p?.alive&&p.age>=18&&mesmaCidade(p)&&['amigo','conhecido'].includes(p.rel));
 return false;
}
cotidianoResolver=(o=>function(k,d){if(!COTIDIANO_IDADE_TIPOS.includes(d.tipo))return o.apply(this,arguments);const c=cotidiano();if(c.resposta===d.ano)return 'Já cuidei desse assunto.';if(d.ano!==S.year||!cotidianoIdadeValido(d))return 'Minha situação mudou; essa decisão já não se aplica.';
 if(!['agir','adiar','aprender'].includes(k)||k==='aprender'&&d.tipo!=='rotina_aposentada')return 'Essa escolha não está disponível.';
 const m=S.me,e=cotidianoIdadeEstado(),p=d.pid&&P(d.pid),a=d.aid&&m.assets.find(x=>x.id===d.aid);
 if(k==='adiar'){c.resposta=d.ano;cotidianoRegistrar(d.tipo,'Preferi adiar essa mudança de rotina. Nenhum gasto foi realizado.',{pid:d.pid,aid:d.aid});return c.notas.at(-1).texto;}
 if(d.tipo==='casa_acessivel'){const custo=Math.max(300,Math.round(Math.max(0,a.value||0)*.004));if(!canPay(custo))return 'Não tenho '+fmt(custo)+' para adaptar esse imóvel. Posso decidir novamente quando houver saldo.';m.money-=custo;a.acessibilidade={ano:S.year,custo,pais:m.country};cotidianoRegistrar(d.tipo,'Adaptei '+a.n+' por '+fmt(custo)+', com melhor iluminação e circulação. A casa seguirá adaptada para quem a herdar.',{aid:a.id,custo});}
 if(d.tipo==='rotina_aposentada'){e.rotina={ano:S.year,tipo:k==='aprender'?'aprendizado':'encontros',ultimo:S.year};st('happy',2);cotidianoRegistrar(d.tipo,k==='aprender'?'Reservei tempo da aposentadoria para aprender e manter meus interesses. A rotina traz bem-estar a cada três anos, sem aumentar minha inteligência automaticamente.':'Organizei encontros e atividades leves na aposentadoria. A rotina traz bem-estar a cada três anos, sem mensalidade ou cobrança automática.');}
 if(d.tipo==='apoio_idoso'){npcContato(p);p.bond=clamp(p.bond+4);relMemoria(p,'apoio');npcVida(p).redeApoio={ano:S.year,responsavel:m.id,ultimo:S.year};cotidianoRegistrar(d.tipo,'Conversei com '+p.first+' sobre companhia e apoio na velhice. Combinamos manter contato, sem assumir despesas ou decidir pela pessoa.',{pid:p.id});}
 if(d.tipo==='vizinhanca'){npcContato(p);if(p.rel==='conhecido')p.rel='amigo';p.bond=clamp(p.bond+3);npcVida(p).vizinhanca={ano:S.year,pais:m.country,cidade:m.city,aid:a.id,com:m.id};relMemoria(p,'amizade_antiga');st('happy',2);cotidianoRegistrar(d.tipo,'Convidei '+p.first+' para uma convivência mais próxima da minha casa. A relação depende de continuarmos na mesma cidade e mantermos contato.',{pid:p.id,aid:a.id});}
 c.resposta=d.ano;return c.notas.at(-1).texto;
})(cotidianoResolver);
EVENTS.vida_cotidiana.show=(o=>function(d){if(!COTIDIANO_IDADE_TIPOS.includes(d.tipo))return o(d);const p=d.pid&&P(d.pid),a=d.aid&&S.me.assets.find(x=>x.id===d.aid),txt={rotina_aposentada:['Meu tempo depois da aposentadoria','Posso construir uma rotina com encontros ou aprendizado, respeitando meu ritmo. Não há custo nem obrigação de trabalhar.','Reservar tempo para encontros'],casa_acessivel:['Uma casa para os próximos anos','Posso melhorar a iluminação e a circulação de '+(a?.n||'meu imóvel')+' por '+fmt(a?Math.max(300,Math.round(Math.max(0,a.value||0)*.004)):d.custo)+'. A adaptação fica registrada no imóvel e traz +1 de felicidade a cada três anos enquanto esta for minha residência atual. Não evita doenças nem garante longevidade.','Adaptar a casa'],apoio_idoso:['Presença na velhice',(p?.first||'Uma pessoa da família')+' pode participar de um plano de companhia e contato. Ajuda não significa controlar suas decisões ou assumir suas dívidas.','Combinar uma rede de apoio'],vizinhanca:['Laços perto de casa','Posso convidar '+(p?.first||'essa pessoa')+' para uma convivência mais próxima. Não há transferência de dinheiro.','Fortalecer essa amizade']}[d.tipo];return {k:'Vida cotidiana',t:txt[0],x:txt[1],ch:cotidianoIdadeValido(d)?[[txt[2],'agir'],...(d.tipo==='rotina_aposentada'?[[ 'Reservar tempo para aprender','aprender']]:[]),['Deixar para depois','adiar']]:[['A situação mudou','adiar']]};})(EVENTS.vida_cotidiana.show);
EVENTS.vida_cotidiana.pick=(k,d)=>cotidianoResolver(k,d);

function cotidianoIdadeAno(){if(!cotidianoIdadeDisponivel())return;const m=S.me,e=cotidianoIdadeEstado();if(e.ano===S.year)return;e.ano=S.year;
 if(m.ret&&e.rotina&&S.year-e.rotina.ultimo>=3){e.rotina.ultimo=S.year;st('happy',1);cotidianoRegistrar('rotina_aposentada','Minha rotina de '+(e.rotina.tipo==='aprendizado'?'aprendizado':'encontros')+' continuou trazendo satisfação na aposentadoria.');}
 if(m.age>=60&&m.assets.some(a=>cotidianoIdadeCasa(a)&&a.acessibilidade)&&S.year-(e.conforto??-999)>=3){e.conforto=S.year;st('happy',1);}
 for(const p of people()){const v=p.vida;if(!v)continue;const r=v.redeApoio;if(r?.responsavel===m.id&&cotidianoIdadeIdoso(p)&&S.year-r.ultimo>=3){r.ultimo=S.year;npcContato(p);p.bond=clamp(p.bond+1);}}
}
yearPeople=(o=>function(){const r=o.apply(this,arguments);cotidianoIdadeAno();return r;})(yearPeople);
V.me=(o=>function(){const r=o.apply(this,arguments),e=S.me.cotidiano?.maturidade;if(r&&e?.rotina&&S.me.ret)r.items.push({l:'Rotina da aposentadoria',s:(e.rotina.tipo==='aprendizado'?'Aprendizado':'Encontros')+' · +1 de felicidade a cada três anos · sem custo'});return r;})(V.me);
V.asset=(o=>function(a){const r=o.apply(this,arguments);if(r&&a.acessibilidade)r.items.push({l:'Adaptação para acessibilidade',s:'Realizada em '+a.acessibilidade.ano+' por '+fmt(a.acessibilidade.custo)+' · acompanha o imóvel nas heranças'});return r;})(V.asset);

function cotidianoIdadeSelfTest(){const before=S,meta=JSON.stringify(META),snaps=SNAPS,random=R.f,noSave=window.NO_SAVE;window.NO_SAVE=true;let seed=173;R.f=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};const ok=(v,t)=>{if(!v)throw Error(t);};try{
 newLife({country:'BR'});S.me.age=70;S.me.money=10000;S.me.ret={pension:9000};S.me.happy=50;const a={id:newId(),k:'casa',n:'Casa de teste',value:100000,cond:80,country:'BR',city:S.me.city};S.me.assets=[a];S.me.localizacaoV=1;S.me.residenciaId=a.id;
 const d={tipo:'casa_acessivel',aid:a.id,ano:S.year};S.me.money=0;cotidianoResolver('agir',d);ok(!a.acessibilidade&&cotidiano().resposta!==d.ano,'adaptação sem pagamento consumiu tentativa');S.me.money=10000;cotidianoResolver('agir',d);ok(S.me.money===9600&&a.acessibilidade,'custo da adaptação');cotidianoResolver('agir',d);ok(S.me.money===9600,'adaptação duplicada');
 S.year++;cotidianoResolver('aprender',{tipo:'rotina_aposentada',ano:S.year});const inteligencia=S.me.smarts,saude=S.me.health;cotidianoIdadeAno();const felicidade=S.me.happy;S.year+=3;cotidianoIdadeAno();ok(S.me.happy>felicidade&&S.me.smarts===inteligencia&&S.me.health===saude,'rotina não persiste ou mudou saúde/inteligência');const feliz=S.me.happy;cotidianoIdadeAno();ok(S.me.happy===feliz,'efeito anual duplicado');
 const p=mkPerson({rel:'conhecido',age:50,country:'BR'});S.people.push(p);S.year++;cotidianoResolver('agir',{tipo:'vizinhanca',aid:a.id,pid:p.id,ano:S.year});ok(p.rel==='amigo'&&p.vida.vizinhanca.aid===a.id,'vizinhança sem vínculo real');p.country='PT';ok(!cotidianoIdadeValido({tipo:'vizinhanca',aid:a.id,pid:p.id}),'vizinho emigrado elegível');
 const mae=parents()[0];mae.age=80;mae.alive=true;S.year++;cotidianoResolver('agir',{tipo:'apoio_idoso',pid:mae.id,ano:S.year});ok(mae.vida.redeApoio?.responsavel===S.me.id,'apoio sem registro');mae.alive=false;ok(!cotidianoIdadeValido({tipo:'apoio_idoso',pid:mae.id}),'apoio a falecido');
 S=JSON.parse(JSON.stringify(S));fixSave(S);ok(S.me.assets[0].acessibilidade.custo===400&&S.me.cotidiano.maturidade.rotina.tipo==='aprendizado','save perdeu rotina');S.me.assets[0].country='PT';ok(!cotidianoIdadeCasa(S.me.assets[0]),'casa em outro país elegível');S.me.age=17;ok(!cotidianoIdadeValido({tipo:'rotina_aposentada'}),'menor em evento adulto');S.me.age=70;S.me.assets=[];ok(!cotidianoIdadeValido(d),'casa vendida elegível');return {aposentadoria:true,acessibilidade:true,apoio:true,vizinhanca:true,save:true};
 }finally{S=before;META=JSON.parse(meta);SNAPS=snaps;R.f=random;window.NO_SAVE=noSave;}}
