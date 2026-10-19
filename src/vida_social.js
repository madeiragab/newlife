// ===== Infância e relacionamentos: idade certa para cada coisa (bebida conforme a lei do país), saídas para beber
// com a volta para casa, festas com dança, brincadeiras, conversas pelos gostos de cada pessoa, encontros e DR =====
const IDADE_ALCOOL={BR:18,PT:18,US:21,AR:18,MX:18,JP:20,IT:18,FR:18,DE:16,GB:18,AO:18,CA:19,ES:18,KR:19,IN:21};
const idadeAlcool=m=>IDADE_ALCOOL[(m||S.me).country]||18;
const podeBeber=m=>(m=m||S.me,m.age>=idadeAlcool(m));
const ALC_RE=/(^|[^a-zà-ú])(beb(er|i|endo|eu|emos|ida|idas|ado|ada|edeira)|b[êe]bad[oa]s?|embriag[a-zà-ú]*|cervej[a-zà-ú]*|chop[ep]?|vinhos?|vodka|whisky|uísque|cacha[çc]a|caipirinha|drinks?|ressaca|tequila|álcool|alcool|porre|boteco|happy hour|balada|saquê|soju|hidromel|licor|champanhe|espumante|no bar|um bar)(?![a-zà-ú])/i;
const ALC_NAO=/sem beber|não beber|sem álcool|refrigerante|recusar a bebida|recusar o copo/i;
const ALC_TROCA=[[/no bar/gi,'na casa de um amigo'],[/um bar/gi,'uma lanchonete'],[/\bbeber\b/gi,'tomar refrigerante'],[/\bbebida\b/gi,'refrigerante'],[/\bcervejas?\b/gi,'refrigerante'],[/\bbalada\b/gi,'festa'],[/\bdrinks?\b/gi,'sucos']];
// eventos com bebida no título ou no texto não aparecem para quem está abaixo da idade legal; escolhas com bebida somem
function idadeFiltrar(){ for(const [id,ev] of Object.entries(EVENTS)){ if(ev._idade) continue; ev._idade=1; const sh0=ev.show, w0=ev.when;
    if(w0) ev.when=m=>!(ev._alc&&!podeBeber(m))&&w0(m);
    ev.show=function(d){ const r=sh0.apply(this,arguments); try{ const m=S.me; if(!r||!r.ch||!m||podeBeber(m)) return r;
      if(ALC_RE.test(String(r.t||'')+' '+String(r.x||''))){ ev._alc=1; if(r.ch.length) r.x=String(r.x||''); }
      const sem=r.ch.filter(c=>!ALC_RE.test(String(c[0]))||ALC_NAO.test(String(c[0])));
      if(sem.length>=2&&sem.length<r.ch.length) r.ch=sem; else if(sem.length<r.ch.length) r.ch=r.ch.map(c=>[ALC_TROCA.reduce((s,[a,b])=>s.replace(a,b),String(c[0])),c[1]]);
    }catch(e){} return r; }; } }
evValid=(o=>function(e){ const ok=o.apply(this,arguments); if(!ok) return false; const ev=EVENTS[e.id], m=S.me; if(!ev||!m||podeBeber(m)||String(e.id).startsWith('cad_')) return ok;
  try{ const sh=ev.show(e.d||{}); if(ev._alc) return false; return !!sh; }catch(err){ return ok; } })(evValid);
// cadeias com bebida só começam na idade legal
if(typeof cadCan==='function') cadCan=(o=>function(id,m){ const r=o.apply(this,arguments); if(!r) return false; const ch=CHAINS[id]; if(ch&&!podeBeber(m)){ if(ch._alc==null) ch._alc=ALC_RE.test(JSON.stringify(ch.steps).replace(/taça que não era de vinho|cachaça, como dizem as lendas/g,'')); if(ch._alc) return false; } return r; })(cadCan);
V.fun=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(r&&r.items&&!podeBeber(m)){ const b=r.items.find(x=>x.l==='Balada'); if(b){ b.dis=true; b.why=`Em ${countryOf(m.country).n}, só a partir dos ${idadeAlcool(m)} anos.`; b.r=idadeAlcool(m)+'+'; } } return r; })(V.fun);
nightclub=(o=>function(){ if(!podeBeber()) return `Em ${countryOf(S.me.country).n}, balada só a partir dos ${idadeAlcool()} anos.`; return o.apply(this,arguments); })(nightclub);

// ---------- gostos de cada pessoa ----------
const GOSTOS=['futebol','música','filmes','games','culinária','viagens','livros','animais','moda','tecnologia','natureza','arte'];
const GOSTOS_KID=['desenho animado','dinossauros','carrinhos','bonecas','super-heróis','desenhar','videogame','futebol'];
function gostosDe(p){ const L=p.age<12?GOSTOS_KID:GOSTOS, a=(p.id*7+3)%L.length; let b=(p.id*13+5)%L.length; if(b===a) b=(b+1)%L.length; return [L[a],L[b]]; }
const gostosVistos=p=>(p.gostosV=p.gostosV||[]);
EVENTS.rel_conversa={when:m=>!m.prison,
  prep:m=>{ const p=R.pick(people().filter(q=>q.alive&&q.rel!=='pet'&&q.age>=3)); if(!p) return null; const gs=gostosDe(p), L=p.age<12?GOSTOS_KID:GOSTOS; return {pid:p.id,ops:R.shuffle([gs[0]].concat(R.shuffle(L.filter(x=>!gs.includes(x))).slice(0,3)))}; },
  show:d=>{ const p=P(d.pid); return {k:'Conversa',t:`Conversa com ${p.first}`,x:`Sobre o que eu puxo assunto com ${p.first}?${gostosVistos(p).length?` (Já sei que ${p.gender==='F'?'ela':'ele'} gosta de ${gostosVistos(p).join(' e ')}.)`:''}`,ch:d.ops.map(t=>[t[0].toUpperCase()+t.slice(1),t])}; },
  pick:(k,d)=>{ const p=P(d.pid); if(!p) return ''; const gs=gostosDe(p);
    if(gs.includes(k)){ p.bond=clamp(p.bond+7); if(!gostosVistos(p).includes(k)) p.gostosV.push(k); st('happy',3); return R.pick([`${p.first} se animou na hora e falou por meia hora sobre ${k}.`,`Acertei em cheio: ${p.first} ama ${k}. A conversa rendeu até tarde.`]); }
    p.bond=clamp(p.bond+1); return R.pick([`${p.first} ouviu com educação, mas ${k} não é a praia ${p.gender==='F'?'dela':'dele'}.`,`A conversa sobre ${k} morreu rápido.`]); }};
function relConversar(p){ if(use('conv_'+p.id)>1) return `Já conversamos bastante este ano.`; const gs=gostosDe(p), L=p.age<12||S.me.age<12?GOSTOS_KID:GOSTOS; const ops=R.shuffle([R.pick(gs)].concat(R.shuffle(L.filter(x=>!gs.includes(x))).slice(0,3)));
  queue('rel_conversa',{pid:p.id,ops}); return ''; }
// ---------- encontro romântico ----------
const ENCONTROS=[['Cinema','filmes',60],['Jantar num restaurante','culinária',250],['Show','música',300],['Piquenique no parque','natureza',40],['Museu','arte',50],['Jogo no estádio','futebol',150],['Fliperama','games',80],['Livraria e café','livros',70],['Zoológico','animais',90],['Desfile de moda','moda',200],['Feira de tecnologia','tecnologia',100],['Viagem de fim de semana','viagens',1200]];
EVENTS.rel_encontro={when:m=>!m.prison,
  prep:m=>{ const p=partners().find(q=>q.alive); if(!p) return null; return {pid:p.id,ops:[0,1,2,3]}; },show:d=>{ const p=P(d.pid); return {k:'Coração',t:`Encontro com ${p.first}`,x:`Quero fazer algo especial com ${p.first}.${gostosVistos(p).length?` Sei que ${p.gender==='F'?'ela':'ele'} gosta de ${gostosVistos(p).join(' e ')}.`:''} Para onde vamos?`,ch:d.ops.map(i=>[`${ENCONTROS[i][0]} (${fmt(ENCONTROS[i][2])})`,String(i)])}; },
  pick:(k,d)=>{ const m=S.me, p=P(d.pid); if(!p) return ''; const E=ENCONTROS[+k]; if(!canPay(E[2])) return 'Fiquei sem dinheiro para isso. Ficamos em casa vendo série.'; m.money-=E[2];
    if(gostosDe(p).includes(E[1])){ p.bond=clamp(p.bond+12); st('happy',8); if(!gostosVistos(p).includes(E[1])) p.gostosV.push(E[1]); return `${p.first} amou! ${E[0]} era exatamente o que ${p.gender==='F'?'ela':'ele'} queria. Melhor encontro em muito tempo.`; }
    p.bond=clamp(p.bond+4); st('happy',3); return `Foi legal, mas ${p.first} pareceu meio distraíd${p.gender==='F'?'a':'o'}. ${E[0]} não é bem a cara ${p.gender==='F'?'dela':'dele'}.`; }};
function relEncontro(p){ if(use('enc_'+p.id)>1) return 'Já fizemos programas especiais demais este ano.'; const gs=gostosDe(p); const certo=ENCONTROS.findIndex(e=>gs.includes(e[1])&&e[2]<=Math.max(300,S.me.money)); const outros=R.shuffle(ENCONTROS.map((e,i)=>i).filter(i=>i!==certo&&!gs.includes(ENCONTROS[i][1]))).slice(0,certo>=0?3:4);
  queue('rel_encontro',{pid:p.id,ops:R.shuffle((certo>=0?[certo]:[]).concat(outros))}); return ''; }
// ---------- DR ----------
EVENTS.rel_dr={when:m=>!m.prison,
  prep:m=>{ const p=partners().find(q=>q.alive); return p?{pid:p.id}:null; },show:d=>{ const p=P(d.pid); return {k:'Coração',t:'Precisamos conversar',x:`${p.first} sentou na minha frente com aquela cara: "${R.pick(['Você anda distante.','Sinto que só eu me esforço nessa relação.','A gente não conversa mais.','Você esqueceu o que era importante para mim.'])}"`,ch:[['Ouvir sem interromper','ouvir'],['Pedir desculpas','desculpa'],['Explicar o meu lado com calma','explicar'],['Partir para a briga','briga']]}; },
  pick:(k,d)=>{ const p=P(d.pid); if(!p) return '';
    if(k==='ouvir'){ p.bond=clamp(p.bond+10); return `Só ouvi. No fim, ${p.first} me abraçou: "Obrigad${p.gender==='F'?'a':'o'} por me escutar."`; }
    if(k==='desculpa'){ p.bond=clamp(p.bond+6); return 'Pedi desculpas e prometi prestar mais atenção. O clima melhorou.'; }
    if(k==='explicar'){ if(R.chance(.5+S.me.smarts/300)){ p.bond=clamp(p.bond+8); return 'Conversamos de verdade. Saímos dessa mais unidos.'; } p.bond=clamp(p.bond-2); return 'Tentei explicar, mas soou como desculpa.'; }
    p.bond=clamp(p.bond-10); st('happy',-6); return 'Gritamos um com o outro. Alguém dormiu no sofá.'; }};
// ---------- sair para beber ----------
const BEB_NIVEL=['sóbri','alegre','bêbad','muito bêbad'];
EVENTS.beb_saida={when:m=>!m.prison&&podeBeber(m),
  prep:m=>{ const p=people('amigo').find(q=>q.alive&&q.age>=idadeAlcool(m)); return {pid:p?p.id:null,e:0}; },
  show:d=>{ const p=P(d.pid), nome=p?p.first:'a turma';
    if(d.e===1){ const ev=d.acont; if(ev==='danca') return {k:'Noite',t:'Na pista',x:'Começou a tocar uma música boa e alguém do outro lado do bar está olhando para mim.',ch:[['Chamar para dançar','danca'],['Dançar com '+nome,'amigo'],['Ficar na mesa','mesa']]};
      if(ev==='karaoke') return {k:'Noite',t:'Karaokê',x:`O bar tem karaokê, e ${nome} está me desafiando a cantar.`,ch:[['Cantar uma balada romântica','balada'],['Cantar um rock bem alto','rock'],['Recusar','nao']]};
      return {k:'Noite',t:'Confusão no bar',x:'Um sujeito esbarrou na nossa mesa, derrubou tudo e ainda achou ruim.',ch:[['Deixar pra lá','deixa'],['Pedir desculpas, mesmo sem culpa','desc'],['Tirar satisfação','briga']]}; }
    if(d.e===2){ const m=S.me, carro=m.assets.some(a=>a.k==='carro'); const ch=[['Chamar um carro de aplicativo ('+fmt(40)+')','app'],['Ir a pé','pe']]; if(p&&d.amigoSobrio) ch.unshift([`Pegar carona com ${p.first}, que não bebeu`,'carona']); if(carro&&m.lic) ch.push(['Voltar dirigindo o meu carro','dirigir']); return {k:'Noite',t:'Hora de ir embora',x:`Já é madrugada e eu estou ${BEB_NIVEL[d.nivel]}${oa()}. Como volto para casa?`,ch}; }
    return {k:'Noite',t:'Saída com '+nome,x:`Fomos a um bar${p?' com '+nome:''}. Quanto eu vou beber hoje?`,ch:[['Só um copo','1'],['Algumas, sem exagero','2'],['Encher a cara','3'],['Só refrigerante','0']]}; },
  pick:(k,d)=>{ const m=S.me, p=P(d.pid);
    if(!d.e){ const nivel=+k; m.add.alcool=clamp(m.add.alcool+[0,2,5,10][nivel]*(1.3-(m.will??50)/100)); st('happy',[2,4,6,7][nivel]); m.money-=Math.min(Math.max(0,m.money),[20,40,90,180][nivel]); if(p) p.bond=clamp(p.bond+4); cnt('saidas');
      const amigoSobrio=p&&R.chance(.35); queue('beb_saida',{pid:d.pid,e:1,nivel,acont:R.pick(['danca','karaoke','briga']),amigoSobrio}); return ['Fiquei no refrigerante e me diverti do mesmo jeito.','Um copo para acompanhar a conversa.','Algumas rodadas e muita risada.','Perdi a conta das rodadas.'][nivel]; }
    if(d.e===1){ let t='';
      if(k==='danca'){ if(R.chance(.45+m.looks/250)){ const q=mkPerson({rel:'amigo',age:clamp(m.age+R.int(-4,4),idadeAlcool(m),90),bond:50,gender:R.chance(.5)?'F':'M'}); S.people.push(q); t=`Dançamos três músicas seguidas. ${q.first} me passou o número.`; } else t='Dancei sozinh'+oa()+' quando a pessoa foi embora. Pelo menos me diverti.'; st('happy',4); }
      else if(k==='amigo'){ if(p) p.bond=clamp(p.bond+5); st('happy',4); t='Dançamos como se ninguém estivesse olhando. Todo mundo estava.'; }
      else if(k==='mesa'){ t='Fiquei na mesa conversando. Também é bom.'; }
      else if(k==='balada'||k==='rock'){ if(R.chance(.4+(m.talent.musical||20)/200)){ st('happy',6); m.fame=clamp(m.fame+(R.chance(.1)?2:0)); t=k==='rock'?'O bar inteiro cantou junto. Fui ovacionad'+oa()+'.':'Até o garçom parou para ouvir.'; } else { st('happy',2); t='Desafinei do começo ao fim. Rimos até chorar.'; } }
      else if(k==='nao') t='Fiquei só aplaudindo os outros.';
      else if(k==='deixa'){ t='Deixei pra lá. Noite salva.'; } else if(k==='desc'){ m.karma=clamp(m.karma+2); t='Pedi desculpas e o sujeito, sem graça, pagou uma rodada.'; }
      else { if(d.nivel>=2&&R.chance(.5)){ if(!window.NO_SAVE) setTimeout(()=>startFight({name:'o sujeito do bar',power:R.int(20,45)},'rua'),80); t='Partimos para a briga no meio do bar.'; } else { st('health',-R.int(3,8)); t='Discutimos, e o segurança botou os dois para fora.'; } }
      queue('beb_saida',{pid:d.pid,e:2,nivel:d.nivel,amigoSobrio:d.amigoSobrio}); return t; }
    return bebVoltar(k,d.nivel); }};
function bebVoltar(k,nivel){ const m=S.me, c=countryOf(m.country).n;
  if(k==='app'){ m.money-=Math.min(Math.max(0,m.money),40); return 'Voltei de carro de aplicativo, cochilando no banco de trás. Chegou inteiro.'; }
  if(k==='carona') return 'Voltei de carona, cantando no carro. Amigo de verdade é o que não bebe para levar os outros.';
  if(k==='pe'){ if(nivel>=2&&R.chance(.15)){ m.money-=Math.min(Math.max(0,m.money),R.int(100,800)); return 'No caminho a pé, fui assaltad'+oa()+'. Levaram o celular e a carteira.'; } if(nivel>=3&&R.chance(.15)){ st('health',-R.int(4,10)); return 'Tropecei no meio-fio e ralei o joelho inteiro.'; } return 'Voltei a pé, pensando na vida. Cheguei.'; }
  // dirigir depois de beber
  m.c.dirigiuBebado=(m.c.dirigiuBebado||0)+(nivel>0?1:0); if(nivel===0) return 'Voltei dirigindo tranquil'+oa()+', sem ter bebido nada.';
  if(R.chance([0,.1,.16,.22][nivel])){ const zero=['BR','JP','KR','IN'].includes(m.country);
    if(nivel>=3||(zero&&nivel>=2)){ arrest('embriaguez ao volante',0,3); m.lic=false; return `Blitz no caminho. O bafômetro estourou. Em ${c}, isso é crime: perdi a carteira e fui levad${oa()} para a delegacia.`; }
    const multa=zero?3000:800; m.money-=Math.min(Math.max(0,m.money),multa); if(zero) m.lic=false; return `Blitz no caminho. Multa de ${fmt(multa)}${zero?` e carteira suspensa: em ${c} a tolerância é zero`:''}.`; }
  const acid=[0,.04,.12,.28][nivel]; if(R.chance(acid)){ const x=R.f(); const car=m.assets.find(a=>a.k==='carro'); if(car) car.cond=Math.max(0,(car.cond??100)-R.int(30,70));
    if(x<.08){ log('Morri dirigindo bêbad'+oa()+'.','bad'); die('num acidente, dirigindo bêbad'+oa()); return 'Não cheguei em casa.'; }
    if(x<.25){ cnt('kills'); m.karma=clamp(m.karma-30); st('happy',-25); arrest('homicídio no trânsito por embriaguez',3,8); return 'Atropelei uma pessoa num cruzamento. Ela não sobreviveu. Vou carregar isso para sempre.'; }
    if(x<.55){ st('health',-R.int(25,45)); return 'Bati num poste. Acordei no hospital com o carro destruído.'; }
    st('health',-R.int(5,12)); return 'Raspei o carro num muro. Susto, e um prejuízo enorme.'; }
  return R.pick(['Cheguei em casa sem saber direito como. Tive sorte, e sei disso.','Dirigi devagar, de olho no retrovisor. Cheguei. Não foi uma boa ideia.']); }
function bebSair(p){ const m=S.me; if(!podeBeber(m)) return `Em ${countryOf(m.country).n}, só a partir dos ${idadeAlcool(m)} anos.`; if(p&&p.age<idadeAlcool(m)) return `${p.first} ainda não tem idade para beber.`; if(use('beber')>3) return 'Já saí para beber demais este ano.';
  queue('beb_saida',{pid:p?p.id:null,e:0}); return ''; }
// ---------- festas com dança ----------
const DANCA_MUSICA=[['lenta, romântica','junto'],['animada, todo mundo pulando','pular'],['um forró arrastado','forro'],['um funk com coreografia','coreo']];
const DANCA_PASSOS=[['Dançar bem juntinho, devagar','junto'],['Pular e soltar os braços','pular'],['Dois pra lá, dois pra cá','forro'],['Fazer a coreografia do momento','coreo']];
function festaGente(m){ const l=people().filter(p=>p.alive&&p.rel!=='pet'&&Math.abs(p.age-m.age)<=(m.age<18?3:12)&&p.age>=(m.age<13?3:m.age<18?12:16)&&!['mae','pai','avo','filho','adot','neto'].includes(p.rel)); return R.shuffle(l).slice(0,3); }
EVENTS.festa_danca={when:m=>!m.prison,
  prep:m=>({e:0,gente:festaGente(m).map(p=>p.id),kid:m.age<12?1:0}),
  show:d=>{ const m=S.me;
    if(d.e===1){ const mu=DANCA_MUSICA[d.mus[d.r]]; return {k:'Festa',t:`Dançando · música ${d.r+1} de 3`,x:`Começou a tocar uma música ${mu[0]}. Como eu danço?`,ch:DANCA_PASSOS.map(p=>[p[0],p[1]])}; }
    const gente=(d.gente||[]).map(id=>P(id)).filter(Boolean); const ch=gente.map(p=>[`Chamar ${p.first} para dançar`,'p'+p.id]); ch.push(['Chamar alguém que eu não conheço','novo'],[d.kid?'Brincar com as outras crianças':'Ficar só conversando','nao']);
    return {k:'Festa',t:d.kid?'Festa de aniversário':m.age<18?'Festa da turma':'Festa',x:d.kid?'Bolo, balões e música alta. Começou a dança das crianças!':m.age<18?'A festa está cheia de gente da escola e começou a tocar música.':'A pista está cheia. Com quem eu danço?',ch}; },
  pick:(k,d)=>{ const m=S.me;
    if(!d.e){ if(k==='nao'){ st('happy',3); return d.kid?'Brinquei de pega-pega e comi brigadeiro até passar mal.':'Fiquei conversando. Também é festa.'; }
      let pid=null; if(k==='novo'){ const q=mkPerson({rel:'amigo',age:clamp(m.age+R.int(-2,2),3,90),bond:35,gender:R.chance(.5)?'F':'M'}); S.people.push(q); pid=q.id; } else pid=+k.slice(1);
      queue('festa_danca',{e:1,pid,r:0,ok:0,mus:R.shuffle([0,1,2,3]).slice(0,3),kid:d.kid}); const p=P(pid); return p?`${p.first} aceitou dançar comigo!`:''; }
    const certo=DANCA_MUSICA[d.mus[d.r]][1]===k, ok=d.ok+(certo?1:0); const t=certo?R.pick(['Arrasei nesse passo.','Combinou certinho com a música.']):R.pick(['Pisei no pé de alguém.','Não era bem esse ritmo, mas rimos.']);
    if(d.r<2){ queue('festa_danca',Object.assign({},d,{r:d.r+1,ok})); return t; }
    const p=P(d.pid); if(!p) return t; p.bond=clamp(p.bond+ok*4+2); st('happy',4+ok*2); m.talent.dance=clamp((m.talent.dance||0)+1); let fim=` Dançamos ${ok===3?'perfeitamente':ok>=2?'muito bem':'do nosso jeito'}.`;
    const pode=!d.kid&&m.age>=13&&p.age>=(m.age<18?12:18)&&Math.abs(p.age-m.age)<=(m.age<18?3:12)&&!partners().includes(p)&&!['irmao','primo','tio'].includes(p.rel)&&!partners().length;
    if(pode&&ok>=2&&R.chance(.35+ok*.12+m.looks/400)){ p.rel='namoro'; p.yrs=0; p.bond=clamp(p.bond+10); log(`Comecei a namorar ${fullName(p)} depois de uma dança na festa.`,'good'); fim+=` No fim da noite, ${p.first} me beijou. Estamos namorando!`; }
    else if(partners().includes(p)) fim+=' Como no começo do namoro.';
    return t+fim; }};
function festaIr(kind){ const m=S.me; if(use('festa')>3) return 'Já fui a festas demais este ano.'; if(kind==='balada'&&!podeBeber(m)) return `Balada só a partir dos ${idadeAlcool(m)} anos aqui.`;
  queue('festa_danca',{e:0,gente:festaGente(m).map(p=>p.id),kid:m.age<12?1:0}); return ''; }
// ---------- brincadeiras de criança ----------
const BRINCADEIRAS=[['Esconde-esconde','🙈'],['Pega-pega','🏃'],['Desenhar','🖍️'],['Videogame','🎮'],['Bola no quintal','⚽'],['Montar blocos','🧱']];
EVENTS.brincar={when:m=>m.age>=3&&m.age<=12&&!m.prison,
  prep:m=>{ const p=people().find(q=>q.alive&&q.rel!=='pet'&&q.age>=3&&q.age<=14); return {pid:p?p.id:null,b:R.pick(BRINCADEIRAS)[0]}; },
  show:d=>{ const p=P(d.pid); if(d.b==='Esconde-esconde') return {k:'Brincadeira',t:'🙈 Esconde-esconde',x:`${p?p.first:'Meu amigo'} está contando até dez. Onde eu me escondo?`,ch:[['Atrás da cortina','cortina'],['Dentro do armário','armario'],['Embaixo da cama','cama'],['Atrás da árvore do quintal','arvore']]};
    return {k:'Brincadeira',t:`${(BRINCADEIRAS.find(b=>b[0]===d.b)||['',''])[1]} ${d.b}`,x:`Brincando de ${d.b.toLowerCase()}${p?' com '+p.first:''}. Como eu brinco?`,ch:[['Inventar regras novas','inventa'],['Brincar do jeito de sempre','normal'],['Deixar o outro escolher','deixa']]}; },
  pick:(k,d)=>{ const m=S.me, p=P(d.pid); if(p) p.bond=clamp(p.bond+(k==='deixa'?6:4)); st('happy',R.int(4,8));
    if(d.b==='Esconde-esconde'){ const achou=R.chance({cortina:.7,armario:.4,cama:.5,arvore:.3}[k]); return achou?R.pick(['Meu pé ficou para fora. Fui encontrad'+oa()+' em dez segundos.','Ri alto e me entreguei.']):'Ninguém me achou! Saí correndo e me salvei no pique.'; }
    if(d.b==='Desenhar') m.talent.art=clamp((m.talent.art||0)+1); if(d.b==='Bola no quintal'||d.b==='Pega-pega') st('health',1); if(d.b==='Montar blocos') st('smarts',1);
    return {inventa:'Inventei uma versão nova da brincadeira. Virou a favorita da rua.',normal:'Brincamos até a hora do jantar.',deixa:`Deixei ${p?p.first:'meu amigo'} escolher. Foi a tarde mais divertida da semana.`}[k]; }};
function brincarCom(p,b){ if(use('brincar')>4) return 'Já brinquei muito este ano. Hora de fazer a lição!'; queue('brincar',{pid:p?p.id:null,b:b||R.pick(BRINCADEIRAS)[0]}); return ''; }
EVENTS.pedir_pais={when:m=>m.age>=4&&m.age<=15&&!m.prison&&parents().length>0,
  show:()=>({k:'Família',t:'Pedir aos meus pais',x:'O que eu vou pedir?',ch:[['Um brinquedo novo','brinquedo'],['Um bichinho de estimação','pet'],['Dormir na casa de um amigo','dormir'],['Mais tempo de videogame','video']]}),
  pick:k=>{ const m=S.me, ps=parents(), b=ps.reduce((s,p)=>s+p.bond,0)/Math.max(1,ps.length), sim=R.chance(.35+b/200+(m.age<10?.1:0));
    if(!sim){ return R.pick(['"Vamos ver." Que todo mundo sabe que significa não.','"Quando você tirar notas melhores."','"Dinheiro não dá em árvore."']); }
    if(k==='brinquedo'){ st('happy',8); return 'Ganhei! Brinquei o dia inteiro.'; }
    if(k==='pet'){ try{ const pet=addPet(R.pick(['Cachorro','Gato','Hamster','Calopsita'])); st('happy',10); return pet?`Ganhei um bichinho! ${pet.first||'Ele'} já dorme na minha cama.`:'Ganhei um bichinho!'; }catch(e){ st('happy',6); return 'Disseram que sim!'; } }
    if(k==='dormir'){ const a=people('amigo')[0]; if(a) a.bond=clamp(a.bond+6); st('happy',6); return 'Passei a noite em claro jogando e contando histórias de terror.'; }
    st('happy',4); return 'Ganhei uma hora a mais de videogame. Usei cada minuto.'; }};
// ---------- telas ----------
V.person=(o=>function(p){ const r=o.apply(this,arguments), m=S.me; if(!r||!r.items||!p||!p.alive||p.rel==='pet'||m.prison||S.scen) return r;
  const add=[]; const love=partners().includes(p);
  if(m.age>=3&&p.age>=3) add.push({ic:'💬',l:'Conversar de verdade',s:gostosVistos(p).length?`Gosta de ${gostosVistos(p).join(' e ')}`:'Descobrir do que gosta',on:()=>act(()=>relConversar(p),'Conversa')});
  if(love&&m.age>=13) add.push({ic:'🌹',l:'Encontro especial',s:'Acertar o programa faz toda a diferença',on:()=>act(()=>relEncontro(p),'Encontro')});
  if(m.age>=3&&m.age<=12&&p.age>=3&&p.age<=14) add.push({ic:'🧸',l:'Brincar junto',s:'Esconde-esconde, desenho, bola…',on:()=>UI.push(()=>({title:'Brincar com '+p.first,items:BRINCADEIRAS.map(([b,ic])=>({ic,l:b,on:()=>act(()=>brincarCom(p,b),b)}))}))});
  if(podeBeber(m)&&p.age>=idadeAlcool(m)&&!['filho','adot','neto'].includes(p.rel)) add.push({ic:'🍻',l:'Sair para beber',s:'Bar, música e a volta para casa',on:()=>act(()=>bebSair(p),'Saída')});
  if(m.age>=4&&m.age<=15&&['mae','pai'].includes(p.rel)) add.push({ic:'🙏',l:'Pedir uma coisa',s:'Brinquedo, bichinho, dormir fora…',on:()=>act(()=>{ if(use('pedir')>2) return 'Já pedi coisas demais este ano.'; queue('pedir_pais',{}); return ''; },'Pedido')});
  const i=r.items.findIndex(x=>x.sec); r.items.splice(i>=0?i:1,0,...add); return r; })(V.person);
V.activities=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(m.prison||!r||!r.items) return r; const add=[];
  if(m.age>=3&&m.age<=12) add.push({ic:'🧸',l:'Brincar',s:'Esconde-esconde, pega-pega, desenho, videogame',on:()=>UI.push(()=>({title:'Brincar',items:BRINCADEIRAS.map(([b,ic])=>({ic,l:b,on:()=>act(()=>brincarCom(R.pick(people().filter(q=>q.alive&&q.rel!=='pet'&&q.age<=14&&q.age>=3))||null,b),b)}))}))});
  if(m.age>=4) add.push({ic:'🎉',l:m.age<12?'Festa de aniversário':m.age<18?'Festa da turma':'Festa',s:'Dançar com alguém · minigame de ritmo',on:()=>act(()=>festaIr(m.age<12?'aniversario':'festa'),'Festa')});
  if(podeBeber(m)) add.push({ic:'🍻',l:'Sair para beber',s:'Com a turma · cuidado na volta para casa',on:()=>act(()=>bebSair(R.pick(people('amigo').filter(q=>q.alive&&q.age>=idadeAlcool(m)))||null),'Saída')});
  r.items.splice(Math.min(3,r.items.length),0,...add); return r; })(V.activities);
// todo ano: DR quando o relacionamento esfria
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m||!m.alive||m.prison||S.scen) return; for(const p of partners()) if(p.alive&&p.bond<50&&R.chance(.25)){ queue('rel_dr',{pid:p.id}); break; } });
// idade mínima e máxima coerentes para eventos que apareciam cedo ou tarde demais
const IDADE_EVENTO={'Primeiro dia na creche':[1,4],'Carnaval':[12,null],'Celular apreendido':[10,null],'Celular quebrado':[10,null],'Celular confiscado':[10,null],'Fofoca da turma':[10,null],'Representante de turma':[10,null],'Bilhete na mochila':[11,null],'Formatura':[10,null],'Dia de chuva':[9,null]};
for(const [id,ev] of Object.entries(EVENTS)){ const f=id==='mordida'?[16,null]:IDADE_EVENTO[ev.title]; if(!f) continue; const w0=ev.when; ev.when=m=>(f[0]==null||m.age>=f[0])&&(f[1]==null||m.age<=f[1])&&(!w0||w0(m)); }
idadeFiltrar();
