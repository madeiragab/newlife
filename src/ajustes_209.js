// ===== 2.09: ícones e confirmação nas ações críticas, golpe de Estado em etapas, esconder o corpo e ator com mais especializações =====

// ---------- ícones próprios (desviar verba e renunciar usavam o mesmo 🏛️) ----------
ICONS.unshift([/desviar/i,'💸'],[/^renunciar/i,'🏳️'],[/propina/i,'🤑'],[/lavar o dinheiro/i,'🧼'],[/acordo com uma facção/i,'🤝'],[/ultimato/i,'📜'],[/frente de batalha/i,'🪖']);

// ---------- confirmação nas ações que não têm volta ou podem acabar com a vida ----------
const CRITICAS=[
  [/^Desviar verba/,'Desviar verba?','Se a Polícia Federal descobrir, perco o cargo e vou preso.'],
  [/^Renunciar$/,'Renunciar ao mandato?','Não dá para voltar atrás: o cargo acaba agora.'],
  [/^Cobrar propina/,'Cobrar propina?','Se vazar, é escândalo, cassação e prisão.'],
  [/^Fazer acordo com uma facção/,'Fazer acordo com uma facção?','Depois de entrar, sair custa caro.'],
  [/^Lavar o dinheiro/,'Lavar o dinheiro?','Se a operação cair, perco tudo e vou preso.'],
  [/^Dar um ultimato/,'Dar um ultimato?','Pode começar uma guerra.'],
  [/^Ir para a frente de batalha/,'Ir para a frente de batalha?','Posso não voltar.'],
];
function comConfirmacao(r){
  if(!r||!Array.isArray(r.items)) return r;
  for(const it of r.items){
    if(!it||!it.l||!it.on||it.confirmado) continue;
    const c=CRITICAS.find(([re])=>re.test(it.l)); if(!c) continue;
    const on=it.on; it.confirmado=1; it.on=()=>confirmBox(c[1],c[2],'Confirmar',on);
  }
  return r;
}
for(const k of Object.keys(V)){ const f=V[k]; if(typeof f==='function') V[k]=function(){ return comConfirmacao(f.apply(this,arguments)); }; }

// ---------- golpe de Estado: a noite do golpe em três decisões ----------
// Cada escolha mexe na chance; o resultado muda o país, a família e abre o primeiro decreto.
const GOLPE_ETAPAS=[
  {t:'🌑 Madrugada, 3h da manhã',x:'Os carros estão prontos. Qual é o primeiro alvo?',ch:[
    ['📺 Tomar a TV estatal',r=>r.apoio/400,'Às 4h, a TV estatal tocava o hino do movimento em vez da novela.'],
    ['🏛️ Cercar o palácio',r=>r.mil/300+r.armas/400,'Os tanques fecharam a esplanada antes do sol nascer.'],
    ['📡 Cortar internet e telefones',()=>.05+S.me.smarts/2000,'O país acordou mudo. Ninguém sabia o que estava acontecendo.']]},
  {t:'🚁 O presidente',x:'Ele ainda está no palácio. O que fazer com ele?',ch:[
    ['Deixar fugir de helicóptero',()=>.05,'O helicóptero sumiu no horizonte. Menos resistência.'],
    ['Prender o presidente',r=>r.armas>=30?.09:-.06,'A guarda dele resistiu antes de se render.'],
    ['Obrigar a renunciar ao vivo',()=>S.me.fame>=40?.08:.01,'Ele leu a carta de renúncia tremendo, em rede nacional.']]},
  {t:'🎖️ Os quartéis',x:'Alguns comandantes ainda não decidiram de que lado estão.',ch:[
    ['💰 Pagar os comandantes ($100.000)',()=>S.me.money>=100000?.1:-.03,'Envelopes grossos fizeram os quartéis ficarem em silêncio.',()=>{ if(S.me.money>=100000) S.me.money-=100000; }],
    ['📢 Discursar para os soldados',()=>(S.me.smarts-50)/600+(S.me.fame/800),'Falei de pátria e futuro. Alguns bateram continência.'],
    ['⚔️ Atacar quem resistir',()=>.07,'Houve tiros na madrugada. O país não vai esquecer.',()=>{ S.me.karma=clamp(S.me.karma-12); }]]},
];
function golpeNoite(){
  const r=rev(); if(!r) return; let bonus=0; const relato=[];
  const etapa=i=>{
    if(i>=GOLPE_ETAPAS.length){ act(()=>golpeFim(bonus,relato),'Golpe de Estado'); return; }
    const e=GOLPE_ETAPAS[i];
    modal({k:'Golpe de Estado',t:e.t,x:`${e.x}\n\nChance agora: ${Math.round(Math.max(.03,Math.min(.95,revChance(r)+bonus))*100)}%`,ch:e.ch.map(([l,f,txt,efeito])=>({l,fn:()=>{ bonus+=f(r); if(efeito) efeito(); relato.push(txt); etapa(i+1); }}))});
  };
  UI.close(); etapa(0);
}
function golpeFim(bonus,relato){
  const m=S.me, r=rev(); if(!r) return '';
  const p=Math.max(.03,Math.min(.95,revChance(r)+bonus)); m.c.golpe=(m.c.golpe||0)+1;
  if(!R.chance(p)) return revFalhou();
  const pais=countryOf(m.country).n, mov=r.n, antes=m.money;
  if(m.job) endJob(); m.office={id:'pres',yrs:0,appr:R.int(30,60),dit:1}; m.c.golpeOk=1; cnt('office_pres'); cnt('pres');
  m.fame=clamp(m.fame+80); m.rev=null; st('happy',20);
  // o país sente: moeda despenca, o mundo condena, a família reage
  m.c.golpeAno=S.year; m.money=Math.round(m.money*.85);
  log(`🔥 GOLPE DE ESTADO: o ${mov} tomou o poder. Agora sou ${m.gender==='F'?'a líder suprema':'o líder supremo'} de ${pais}.`,'big');
  log(`O mundo inteiro noticiou. A ONU convocou uma reunião de emergência e a moeda de ${pais} despencou${antes>0?`: minhas economias perderam ${fmt(antes-m.money)}`:''}.`,'warn');
  for(const q of parents()){ if(R.chance(.5)){ q.bond=clamp(q.bond-25); log(`${relLabel(q)} ${q.first} parou de falar comigo depois do golpe.`,'bad'); } else { q.bond=clamp(q.bond+10); log(`${relLabel(q)} ${q.first} chorou de orgulho na frente da TV.`); } }
  queue('golpe_decreto',{});
  return `${relato.join(' ')}\n\nÀs 6h da manhã, falei em rede nacional: ${pais} agora é meu. Nas ruas, metade comemorava e metade chorava.`;
}
function revFalhou(){ const m=S.me, n=R.f(); m.rev=null; m.karma=clamp(m.karma-5);
  if(n<.2){ die('fuzilad'+oa()+' depois de um golpe de Estado fracassado'); return 'O golpe fracassou. O tribunal militar foi rápido.'; }
  if(n<.35&&m.money>10000){ m.money=Math.round(m.money*.3); m.c.fugitive=1; return 'O golpe fracassou. Fugi pela fronteira de madrugada, com o que deu para carregar.'; }
  arrest('tentativa de golpe de Estado',10,30); return 'O golpe fracassou. Os quartéis não se moveram. A polícia me achou no porão.'; }
EVENTS.golpe_decreto={show:()=>({k:'Política',t:'📜 O primeiro decreto',x:'O país inteiro espera o primeiro anúncio do novo governo. O que vem primeiro?',ch:[
  ['Anistia geral e eleições em dois anos','a'],['Fechar o Congresso e governar por decreto','c'],['Prender os líderes da oposição','p'],['Distribuir comida e dinheiro nas periferias','d']]}),
  pick:k=>{ const m=S.me, o=m.office; if(!o) return '';
    if(k==='a'){ o.appr=clamp(o.appr+20); m.karma=clamp(m.karma+10); o.anistia=1; return 'Abri as prisões políticas e marquei eleições. O mundo respirou aliviado, e os generais desconfiaram.'; }
    if(k==='c'){ o.appr=clamp(o.appr-10); m.fame=clamp(m.fame+10); m.karma=clamp(m.karma-10); return 'Tanques na porta do Congresso. Agora as leis saem da minha caneta.'; }
    if(k==='p'){ o.appr=clamp(o.appr-15); m.karma=clamp(m.karma-20); o.expurgo=1; return 'Os opositores sumiram das ruas numa noite só. O medo virou silêncio.'; }
    const c=Math.min(m.money,200000); m.money-=c; o.appr=clamp(o.appr+15); return `Caminhões de comida e ${fmt(c)} em dinheiro rodaram as periferias. O povo gritou meu nome.`; }};
// "Dar o golpe" agora passa pela noite do golpe
V.rev=(o=>function(){ const r=o.apply(this,arguments); if(r&&r.items) for(const it of r.items) if(it&&it.l==='Dar o golpe') it.on=()=>confirmBox('Dar o golpe?','Se der errado: prisão, exílio ou fuzilamento. Se der certo, o país nunca mais será o mesmo.','Começar',golpeNoite); return r; })(V.rev);

// ---------- assassinato: esconder o corpo (minijogo) ----------
const CORPO_LUGARES=[
  {ic:'🌲',l:'Enterrar na mata',q:.3,risco:'Um cachorro de caçador começou a farejar perto.'},
  {ic:'🌊',l:'Jogar no rio com pesos',q:.25,risco:'Um pescador passou de barco bem na hora.'},
  {ic:'🧱',l:'Concretar no porão',q:.35,risco:'O cheiro de cimento fresco chamou a atenção do vizinho.'},
  {ic:'🚗',l:'Encenar um acidente',q:.2,risco:'O perito estranhou as marcas de freada.'},
];
const CORPO_PISTAS=['🩸','👣','🧤','📱','🔪'], CORPO_COISAS=['🪑','🛋️','📚','🪴','🖼️','🧺','🕯️'];
// matar em duas partes: a tentativa e, se der certo, o que acontece com as provas (q: 0 a 1)
function murderKill(p){
  const m=S.me; m.karma=clamp(m.karma-40); cnt('crimes'); m.rec.crimes++;
  const nm=fullName(p), how=R.pick(['envenenamento','um empurrão da escada','um "acidente" de carro','sufocamento','um "assalto" encenado','remédios trocados']);
  const fam=['mae','pai','conjuge','filho','irmao','avo','adot','neto','namoro','noivo'].includes(p.rel);
  if(!R.chance(.5)){ p.bond=0; if(p.rel!=='pet') p.rel='inimigo'; arrest('tentativa de homicídio',6,20); S.pending[S.pending.length-1].d.evid=1; return {ok:false,t:`Tentei matar ${nm}, mas ${p.gender==='F'?'ela':'ele'} sobreviveu e chamou a polícia.`}; }
  p.alive=false; cnt('kills'); st('happy',-15); return {ok:true,nm,how,fam};
}
function murderResolve(p,k,q){
  const m=S.me, {nm,how,fam}=k;
  const caught=Math.min(.95,(.55+(m.c.kills-1)*.15+(fam?.2:0)-(m.smarts-50)/400)*(1-.65*q));
  if(R.chance(caught)){ arrest('homicídio',15,40); S.pending[S.pending.length-1].d.evid=1; return `Matei ${nm} por ${how}. ${R.pick(['A perícia achou minhas digitais.','Uma câmera de segurança gravou tudo.','Um vizinho me viu saindo de lá.','Meu álibi não se sustentou.'])}`; }
  m.c.unsolved=(m.c.unsolved||0)+1; m.c.coldCase=nm; m.c.coldQ=q;
  const fim=q>=.6?'Não sobrou nenhuma pista.':'Por enquanto ninguém desconfiou, mas a polícia abriu um inquérito.';
  if(p.money>0&&['mae','pai','avo','conjuge'].includes(p.rel)&&R.chance(.6)){ const v=Math.round(p.money*.5); m.money+=v; return `Matei ${nm} por ${how}. ${fim} E herdei ${fmt(v)}.`; }
  return `Matei ${nm} por ${how}. ${fim}`;
}
murder=p=>{ const k=murderKill(p); return k.ok?murderResolve(p,k,0):k.t; };
// a investigação de um crime bem escondido aparece menos
queue=(o=>function(id,d){ if(id==='investigacao'&&S&&S.me&&S.me.c.coldQ&&R.chance(S.me.c.coldQ*.6)) return; return o.apply(this,arguments); })(queue);

function mgCorpo(p){
  const k=murderKill(p); if(!k.ok){ act(()=>k.t,'Crime'); return; }
  const m=S.me, s={q:0,etapa:0,achadas:0,erros:0,tempo:9,tiles:[],relato:[]}; let timer=null;
  const fim=()=>{ if(timer) clearInterval(timer); const q=Math.max(0,Math.min(.95,s.q)); mgFinish(()=>`${s.relato.join(' ')}\n\n${murderResolve(p,k,q)}`); };
  const auto=()=>{ s.q=Math.min(.7,.15+m.smarts/300+R.f()*.2); s.relato.push('Fiz tudo no automático, do jeito que deu.'); fim(); };
  const draw=()=>{
    if(s.etapa===0){
      mgOpen(`<div class="kick">Crime</div><h2>Esconder o corpo</h2><p class="mgmsg">${esc(k.nm)} está morto. Alguém pode chegar a qualquer momento. Onde esconder o corpo?</p><div class="choices">${CORPO_LUGARES.map((c,i)=>`<button class="btn alt" data-l="${i}">${c.ic} ${esc(c.l)}</button>`).join('')}<button class="btn alt" id="mgAuto">⚡ Resolver pelo meu nível</button></div>`);
      $('#game').querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{ const c=CORPO_LUGARES[+b.dataset.l]; s.q+=c.q; if(R.chance(.2)){ s.q-=.12; s.relato.push(`${c.l}. ${c.risco}`); } else s.relato.push(`${c.l}, sem ninguém ver.`); s.etapa=1; s.tiles=R.shuffle(CORPO_PISTAS.concat(R.shuffle(CORPO_COISAS).slice(0,7))).map(t=>({t,ok:CORPO_PISTAS.includes(t),feito:false})); draw(); timer=setInterval(()=>{ s.tempo--; if(s.tempo<=0){ clearInterval(timer); timer=null; s.etapa=2; s.relato.push(`Limpei ${s.achadas} de ${CORPO_PISTAS.length} pistas antes de ouvir a sirene.`); draw(); } else { const el=document.getElementById('mgTempo'); if(el) el.textContent=s.tempo+'s'; } },1000); });
      $('#mgAuto').onclick=auto; return; }
    if(s.etapa===1){
      mgOpen(`<div class="kick">Crime</div><h2>Apagar as pistas</h2><p class="mgmsg">Toque nas pistas (🩸 sangue, 👣 pegadas, 🧤 luva, 📱 celular, 🔪 arma) antes do tempo acabar. Mexer no resto atrasa. <b id="mgTempo">${s.tempo}s</b></p><div class="cofre" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px">${s.tiles.map((x,i)=>`<button class="btn alt" data-t="${i}" style="font-size:28px;padding:12px 0;${x.feito?'opacity:.25':''}" ${x.feito?'disabled':''}>${x.t}</button>`).join('')}</div>`);
      $('#game').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ const x=s.tiles[+b.dataset.t]; if(x.feito) return; x.feito=true; if(x.ok){ s.achadas++; s.q+=.08; } else { s.erros++; s.q-=.03; s.tempo=Math.max(1,s.tempo-1); }
        if(s.achadas>=CORPO_PISTAS.length){ clearInterval(timer); timer=null; s.etapa=2; s.relato.push('Não deixei nenhuma pista para trás.'); } draw(); });
      return; }
    const amigo=people('amigo').filter(x=>x.bond>=60)[0];
    mgOpen(`<div class="kick">Crime</div><h2>O álibi</h2><p class="mgmsg">A polícia vai perguntar onde eu estava. O que dizer?</p><div class="choices">
      <button class="btn alt" data-a="c">🎬 Ingresso de cinema comprado antes</button><button class="btn alt" data-a="s">🏠 Estava em casa, sozinh${oa()}</button>${amigo?`<button class="btn alt" data-a="m">🤝 Pedir para ${esc(amigo.first)} mentir por mim</button>`:''}</div>`);
    $('#game').querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{ const a=b.dataset.a;
      if(a==='c'){ s.q+=.1; s.relato.push('Guardei o ingresso de cinema na carteira.'); }
      if(a==='s'){ s.relato.push('Disse que estava em casa. Ninguém para confirmar.'); }
      if(a==='m'){ s.q+=.15; amigo.bond=clamp(amigo.bond-10); m.c.alibiAmigo=amigo.id; s.relato.push(`${amigo.first} topou mentir por mim.`); }
      fim(); });
  };
  UI.close(); draw();
}
// "Assassinar" na tela da pessoa passa pelo minijogo
V.person=(o=>function(p){ const r=o.apply(this,arguments); if(r&&r.items) for(const it of r.items) if(it&&it.l==='Assassinar'){ it.s='Minijogo: esconder o corpo e as pistas'; it.on=()=>confirmBox('Tem certeza?',`Tentar matar ${fullName(p)}? Isso pode acabar com a minha vida também.`,'Fazer',()=>setTimeout(()=>mgCorpo(p),0)); } return r; })(V.person);

// ---------- ator: mais especializações ----------
const ESPEC_ATOR=['Drama','Ação','Comédia','Terror','Ficção científica','Novela','Dublagem'];
EVENTS.car_espec.show=(o=>function(){ const r=o.apply(this,arguments), j=S.me.job; if(j&&j.spc==='ator') r.ch=ESPEC_ATOR.map(e=>[e,e]).concat([['Continuar generalista por enquanto','nao']]); return r; })(EVENTS.car_espec.show);
const atorEsp=e=>m=>!!m.job&&m.job.spc==='ator'&&m.job.esp===e&&!m.prison;
pack({k:'Cinema',w:1.6,cd:5,min:16,when:atorEsp('Ação')},[
  ['Cena sem dublê','O diretor quer que eu faça a cena da explosão sem dublê.',['Fazer eu mesm{o}|?tal.athletic f+6 perf+8|Ficou incrível. O vídeo dos bastidores viralizou.|hl-15 perf-2|Me queimei de verdade. Semanas de hospital.','Chamar o dublê|perf-2|Ninguém percebeu a troca.']],
  ['Treino de luta','O filme novo tem uma luta de dez minutos sem cortes.',['Treinar seis meses|tal.athletic+5 hl+4 perf+6|Acertei cada golpe na primeira tomada.','Improvisar no set|?40 perf+4|Saiu bom.|perf-6|Precisaram de 40 tomadas.']],
  ['Franquia de ação','Um estúdio quer me contratar para uma trilogia de ação.',['Assinar os três filmes|$+v2 f+10 perf+6|Meu rosto vai estar em outdoors pelo mundo.','Só o primeiro|$+v f+4|Vamos ver como vai.']],
]);
pack({k:'Cinema',w:1.6,cd:5,min:16,when:atorEsp('Terror')},[
  ['Set assombrado','A equipe jura que o casarão do filme é assombrado de verdade.',['Gravar à noite mesmo assim|h-4 perf+6 f+3|Os gritos do filme saíram bem reais.','Pedir para trocar o local|perf-3|O diretor ficou irritado.']],
]);
pack({k:'Cinema',w:1.6,cd:5,min:16,when:atorEsp('Dublagem')},[
  ['Voz de animação','Um estúdio quer minha voz para o protagonista de uma animação famosa.',['Aceitar|$+v perf+6 f+4|As crianças reconhecem minha voz na rua.','Recusar|perf-1|Preferi esperar outro papel.']],
]);
pack({k:'Cinema',w:1.6,cd:5,min:16,when:atorEsp('Ficção científica')},[
  ['Fundo verde','O filme inteiro é gravado contra um fundo verde, sem cenário.',['Usar a imaginação|tal.acting+4 perf+5|Ninguém diz que eu estava contracenando com uma bola de tênis.','Reclamar com o diretor|perf-3|Fiquei com fama de difícil.']],
]);
pack({k:'Novela',w:1.6,cd:5,min:16,when:atorEsp('Novela')},[
  ['Vilã das oito','A emissora quer você como o grande vilão da novela das oito.',['Aceitar o papel|f+10 perf+6 k-1|Fui xingad{o} na padaria. Sinal de sucesso.','Recusar|perf-2|Ficou para outro ator.']],
]);
