// ===== Polícia: concurso, investigação de crimes (mini-jogo de dedução) =====
const isCop=()=>{ const j=S.me.job; return !!j&&!j.spc&&!j.hero&&j.id==='poli'; };
function policeExam(){ const m=S.me; if(isCop()) return 'Já sou da polícia.'; if(m.age<18||m.age>40) return 'O concurso é para quem tem entre 18 e 40 anos.';
  if(!m.edu.deg.includes('medio')) return 'O concurso exige ensino médio completo.'; if(m.rec.conv) return 'Com ficha criminal, não posso entrar na polícia.';
  if(use('concursoPol')>1) return 'Só tem um concurso por ano.';
  const p=.25+m.smarts/250+m.health/400+(m.fight||0)/400; if(!R.chance(Math.min(.9,p))){ st('happy',-5); return R.pick(['Reprovei na prova escrita.','Passei na prova, mas reprovei no teste físico: não aguentei a barra.','Fiquei na lista de espera e ninguém me chamou.']); }
  takeJob({id:'poli',co:R.pick(['Polícia Civil','Polícia Militar','Polícia Federal']),size:'grande',mul:1}); m.c.cop=1; st('happy',10);
  log(`Passei no concurso e entrei para a ${m.job.co}.`,'good'); return `Aprovad${oa()}! Seis meses de academia de polícia depois, recebi o distintivo da ${m.job.co}.`; }
// ---------- o caso ----------
const CASO_TIPOS=[['Assassinato numa mansão','🔪','foi encontrad{v} morto na biblioteca da mansão'],['Roubo de joias','💎','teve um colar de diamantes roubado do cofre'],['Incêndio criminoso','🔥','teve a loja incendiada durante a madrugada'],
  ['Envenenamento','🧪','foi envenenad{v} num jantar de família'],['Sequestro','🚐','teve o filho sequestrado na saída da escola'],['Golpe milionário','💸','perdeu todas as economias num golpe'],['Atropelamento com fuga','🚗','foi atropelad{v} e o motorista fugiu']];
const CASO_REL=['o sócio','a ex-mulher','o sobrinho','a vizinha','o motorista','a secretária','o irmão mais novo','a melhor amiga','o jardineiro','a filha adotiva','o advogado','a governanta'];
const CASO_MOT=['herança','ciúme','dívida de jogo','vingança antiga','chantagem','seguro de vida','ficar com a empresa','um caso amoroso escondido'];
const CASO_TR=['é canhoto','fuma charuto','calça 42','tem um carro vermelho','usa perfume amadeirado','tem uma tatuagem de cobra','tem um corte recente na mão','manca da perna esquerda','usa botas de couro','tem cabelo comprido'];
function novoCaso(){ const tp=R.pick(CASO_TIPOS), vit=mkPerson({rel:'tmp',age:R.int(30,80)}); const rels=R.shuffle(CASO_REL.slice()).slice(0,4), trs=R.shuffle(CASO_TR.slice());
  const sus=rels.map((r,i)=>{ const g=/^a /.test(r)?'F':'M'; const p=mkPerson({rel:'tmp',gender:g,age:R.int(22,70)}); return {n:p.first+' '+p.last,first:p.first,g,rel:r,mot:R.pick(CASO_MOT),tr:[trs[i*2],trs[i*2+1]],culp:false,ali:R.pick(['estava num jantar com amigos','diz que dormiu cedo','estava viajando a trabalho','diz que estava no cinema, sozinh'+(g==='F'?'a':'o'),'estava na academia','diz que estava em casa vendo novela'])}; });
  const c=R.int(0,3); sus[c].culp=true;
  // um inocente divide uma pista com o culpado, para a perícia não resolver sozinha
  const o=R.pick(sus.filter(x=>!x.culp)); o.tr[1]=sus[c].tr[0];
  return {tp,vit:{n:vit.first+' '+vit.last,g:vit.gender},sus,passos:5,notas:[],achou:{},fim:false}; }
function casoTxt(c){ return `${c.vit.n} ${c.tp[2].replace('{v}',c.vit.g==='F'?'a':'o')}.`; }
function casoPasso(c,k,i){ if(c.passos<=0||c.fim) return; c.passos--; const s=c.sus[i], culp=c.sus.find(x=>x.culp); let t='';
  if(k==='int'){ const firme=s.culp?R.chance(.3):R.chance(.8); c.achou['ali'+i]=firme?'firme':'frágil'; c.achou['tr'+i]=1; t=`Interroguei ${s.first} (${s.rel}). Motivo possível: ${s.mot}. Álibi: ${s.ali}. ${firme?'A história bate com os fatos.':'A história tem buracos: errou horários e ficou nervos'+(s.g==='F'?'a':'o')+'.'} Reparei que ${s.first} ${s.tr[0]} e ${s.tr[1]}.`; }
  else if(k==='per'){ const left=culp.tr.filter(x=>!c.notas.includes(x)); const tr=left.length?R.pick(left):culp.tr[0]; if(!c.notas.includes(tr)) c.notas.push(tr); t=`A perícia achou uma pista: o culpado ${tr}.`; }
  else if(k==='rev'){ if(s.culp&&R.chance(.6)){ c.achou['prova'+i]=1; t=`Revistei a casa de ${s.first} e achei ${R.pick(['a arma escondida no forro','roupas com manchas suspeitas','o colar dentro de uma lata de biscoito','mensagens apagadas recuperadas no computador','um recibo que derruba o álibi'])}.`; } else t=`Revistei a casa de ${s.first}. Nada que ligue ${s.g==='F'?'ela':'ele'} ao crime.`; }
  if(k==='cam'){ const inoc=c.sus.filter(x=>!x.culp&&!c.achou['fora'+c.sus.indexOf(x)]); t=''; if(inoc.length){ const x=R.pick(inoc); c.achou['fora'+c.sus.indexOf(x)]=1; t=`As câmeras mostram ${x.first} longe do local na hora do crime. Está descartad${x.g==='F'?'a':'o'}.`; } else t='As câmeras não mostram nada novo.'; }
  c.log=(c.log||[]).concat(t); return t; }
function casoAcusar(c,i){ const m=S.me, s=c.sus[i], j=m.job; c.fim=true; cnt('casos');
  if(s.culp){ m.c.casosOk=(m.c.casosOk||0)+1; if(j){ j.perf=clamp(j.perf+15); if(R.chance(.3)&&j.lvl<4){ j.lvl++; log(`Promovid${oa()} a ${jobTitle(j).toLowerCase()} depois de resolver um caso.`,'good'); } } m.fame=clamp(m.fame+2); m.karma=clamp(m.karma+3); st('happy',10);
    log(`Resolvi o caso: ${c.tp[0].toLowerCase()} de ${c.vit.n}. ${s.n} foi pres${s.g==='F'?'a':'o'}.`,'good'); return `${s.first} confessou na sala de interrogatório. Caso encerrado. A delegacia inteira aplaudiu.`; }
  m.c.casoErr=(m.c.casoErr||0)+1; if(j) j.perf=clamp(j.perf-18); m.karma=clamp(m.karma-8); st('happy',-10); const real=c.sus.find(x=>x.culp);
  log(`Errei no caso de ${c.vit.n}: ${s.n} foi pres${s.g==='F'?'a':'o'} injustamente.`,'bad');
  if(R.chance(.25)&&j){ return `${s.first} era inocente. Meses depois, ${real.first} foi pego por outro crime e confessou tudo. Fui afastad${oa()} do cargo. `+(endJob(),'Perdi o distintivo.'); }
  return `${s.first} foi pres${s.g==='F'?'a':'o'}. Mas eu tenho uma sensação ruim. ${R.chance(.5)?`Hoje vi ${real.first} sorrindo na rua.`:'O caso não fecha na minha cabeça.'}`; }
V.caso=c=>()=>{ const it=[{html:`<div class="card"><p><b>${c.tp[1]} ${esc(c.tp[0])}</b></p><p>${esc(casoTxt(c))}</p>${kv('Diligências que restam',c.passos)}${c.notas.length?`<p style="font-size:13px"><b>Pistas da perícia:</b> o culpado ${esc(c.notas.join(' e '))}.</p>`:''}${(c.log||[]).slice(-3).map(t=>`<p style="color:var(--muted);font-size:13px">• ${esc(t)}</p>`).join('')}</div>`}];
  if(c.fim) return {title:'Caso encerrado',items:it};
  it.push({sec:'Suspeitos'}); c.sus.forEach((s,i)=>{ const info=[c.achou['ali'+i]?`álibi ${c.achou['ali'+i]}`:'',c.achou['tr'+i]?s.tr.join(', '):'',c.achou['prova'+i]?'PROVA ENCONTRADA':'',c.achou['fora'+i]?'descartad'+(s.g==='F'?'a':'o')+' pelas câmeras':''].filter(Boolean).join(' · ');
    it.push({ic:s.g==='F'?'👩':'👨',l:`${s.n} · ${s.rel}`,s:info||'Ainda não investiguei',on:()=>modal({t:s.n,x:`${s.rel[0].toUpperCase()+s.rel.slice(1)} da vítima.`,ch:[{l:'Interrogar',fn:()=>{ casoPasso(c,'int',i); UI.refresh(); }},{l:'Revistar a casa',fn:()=>{ casoPasso(c,'rev',i); UI.refresh(); }},{l:'Acusar como culpad'+(s.g==='F'?'a':'o'),cls:'danger',fn:()=>{ const r=casoAcusar(c,i); MQ.unshift({t:'Veredito',x:r}); UI.refresh(); }},{l:'Voltar',cls:'alt'}].map(x=>Object.assign(x,{dis:c.passos<=0&&x.l!=='Voltar'&&!x.l.startsWith('Acusar')})).filter(x=>!(x.dis))})}); });
  it.push({sec:'Diligências'},{ic:'🔬',l:'Chamar a perícia',s:'Revela uma pista sobre o culpado',dis:c.passos<=0,why:'Acabaram as diligências. Hora de acusar alguém.',on:()=>{ casoPasso(c,'per',0); UI.refresh(); }},{ic:'📹',l:'Checar câmeras da região',s:'Pode descartar um inocente',dis:c.passos<=0,why:'Acabaram as diligências. Hora de acusar alguém.',on:()=>{ casoPasso(c,'cam',0); UI.refresh(); }});
  return {title:c.tp[0],items:it}; };
function startCaso(){ const m=S.me; if(!isCop()) return msg('Investigação','Só policiais investigam crimes. Que tal prestar o concurso?'); if(use('caso')>2) return msg('Investigação','Já peguei casos demais este ano.'); const c=novoCaso(); UI.push(V.caso(c)); }
V.activities=(o=>()=>{ const r=o(); const m=S.me; if(m.prison||!r||!r.items) return r;
  if(isCop()) r.items.unshift({ic:'🕵️',l:'Investigar um crime',s:'Um caso novo: interrogue, reviste, chame a perícia e acuse',on:()=>startCaso()});

  return r; })(V.activities);
V.jobs=(o=>()=>{const r=o(),m=S.me;
  if(!m.prison&&!isCop()&&m.age>=13)r.items.unshift({sec:'Concursos públicos'},Object.assign({ic:'🚓',l:'Concurso para a polícia',s:'Entre 18 e 40 anos · ensino médio · sem ficha criminal',on:()=>act(policeExam,'Concurso')},m.age>40?{dis:true,why:'O concurso aceita candidatos até os 40 anos.'}:ageGate(18)));
  return r;
})(V.jobs);
// eventos da vida de policial
pack({k:'Polícia',w:1.3,cd:8,min:18,when:m=>isCop()&&!m.prison},[
  ['Propina','Um traficante oferece {v} para você "não ver" uma entrega.',['Recusar e prender|?fight perf+10 k+8|Prendi ele e a carga.|hl-10 perf+4|Ele reagiu. Saí ferid{o}, mas prendi.','Aceitar|$v2 k-15|Ninguém viu. Eu acho.','Denunciar à corregedoria|perf+6 k+6|Ganhei inimigos dentro da corporação.'],{v:[5000,40000]}],
  ['Perseguição','Um carro roubado fura a blitz em alta velocidade.',['Perseguir|?60 perf+10 f+1|Peguei na terceira esquina.|hl-12|Bati a viatura no poste.','Passar o rádio|perf+2|Outra viatura pegou.']],
  ['Colega corrupto','Você descobre que seu parceiro de viatura recebe propina.',['Denunciar|perf+4 k+8|Ele foi afastado. Agora me chamam de X9.','Ficar quiet{o}|k-6|Fingi que não vi.','Pedir uma parte|$+8000 k-15|Agora somos dois.']],
  ['Tiroteio','Uma troca de tiros começa durante uma abordagem.',['Buscar abrigo e revidar|?fight perf+12 kill|Neutralizei o atirador.|hl-25|Fui baleado no ombro.','Recuar e pedir reforço|perf-2|Ninguém se feriu.']],
  ['Caso sem solução','Um caso antigo sem solução volta a assombrar a delegacia.',['Reabrir o caso nas horas vagas|?sm perf+15 f+3|Resolvi! Uma família finalmente teve paz.|h-6|Mais uma madrugada perdida.','Deixar arquivado|h+0|Tem caso novo todo dia.']],
  ['Criança perdida','Uma criança se perdeu num shopping lotado.',['Procurar pessoalmente|perf+6 k+6 h+6|Achei dormindo numa loja de colchões.','Passar pelo sistema de som|perf+2|A mãe apareceu em cinco minutos.']],
  ['Abordagem polêmica','Um vídeo seu numa abordagem viralizou e as pessoas discordam.',['Pedir desculpas|k+4 perf-2|Mais gente me entendeu.','Defender a abordagem|?50 perf+4|O comando me apoiou.|perf-10 f+2|Fui afastad{o} por uma semana.']],
  ['Delegado exige resultados','O delegado quer números: mais prisões neste mês.',['Trabalhar dobrado|perf+10 hl-4|Bati a meta.','Prender qualquer um|perf+6 k-12|Bati a meta do jeito errado.']],
  ['Medalha','Você vai receber uma medalha por bravura.',['Ir à cerimônia|f+3 h+10 perf+4|Minha família assistiu da primeira fila.','Dedicar a medalha ao parceiro que morreu|k+6 h+4|A sala inteira ficou em silêncio.']],
  ['Disfarce','Te escalam para se infiltrar numa quadrilha.',['Aceitar|?sm perf+20 $+5000|Derrubei a quadrilha por dentro.|hl-20|Descobriram quem eu era.','Recusar|perf-4|Mandaram outro.']],
]);
