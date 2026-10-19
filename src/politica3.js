// ===== Política suja e crises de Estado: propina, desvio, lavagem de dinheiro, acordos com facções, operações da polícia,
// escândalos econômicos e disputas com outros países que podem terminar em guerra =====
const pol3=m=>{ const p=polDe(m); p.sujo=p.sujo||0; p.tens=p.tens||{}; return p; };
const POL_VIZINHOS={BR:['AR','PT','AO','US'],AR:['BR','GB','MX','ES'],US:['MX','CA','KR','IN'],MX:['US','ES','AR'],CA:['US','GB','FR'],PT:['ES','BR','AO','FR'],ES:['PT','FR','MX','GB'],FR:['DE','GB','ES','IT'],DE:['FR','IT','GB'],IT:['FR','DE','ES'],GB:['FR','AR','DE','US'],JP:['KR','US','IN'],KR:['JP','US','IN'],IN:['KR','JP','GB','US'],AO:['PT','BR','FR']};
const polVizinho=m=>R.pick((POL_VIZINHOS[m.country]||COUNTRIES.map(c=>c.id)).filter(c=>c!==m.country));
const nomePais=id=>countryOf(id).n;
// ---------- esquemas: o dinheiro sujo precisa ser lavado, e quanto mais sujo, mais perto da polícia ----------
function polEsquema(k){ const m=S.me, of=m.office, pol=pol3(m); if(!of) return ''; if(use('esq_'+k)>1) return 'Fazer isso de novo este ano seria pedir para ser pego.'; const sal=OFFICES.find(x=>x.id===of.id).sal; let t='';
  if(k==='propina'){ const v=Math.round(sal*R.int(2,10)); m.money+=v; pol.sujo+=v; pol.esc=clamp(pol.esc+12); m.karma=clamp(m.karma-12); t=`Uma empreiteira me pagou ${fmt(v)} para vencer a licitação da ${R.pick(['ponte','escola','avenida','hospital'])}. Em espécie, numa mala.`; }
  else if(k==='faccao'){ const v=Math.round(sal*R.int(1,5)); m.money+=v; pol.sujo+=v; pol.faccao=1; pol.esc=clamp(pol.esc+18); m.karma=clamp(m.karma-20); pol.coal=clamp(pol.coal+5); t=`Fechei um acordo com uma facção: dinheiro (${fmt(v)}) e votos nos bairros que eles controlam, em troca de "vista grossa".`; }
  else if(k==='lavar'){ if(pol.sujo<=0) return 'Não tenho dinheiro sujo para lavar.'; const v=pol.sujo, custo=Math.round(v*.2); m.money-=Math.min(Math.max(0,m.money),custo); pol.sujo=0; pol.esc=clamp(pol.esc+(R.chance(.25)?15:2));
    t=R.pick([`Comprei obras de arte superfaturadas e revendi. ${fmt(v)} limpos, ${fmt(custo)} de "taxa".`,`Passei ${fmt(v)} por uma rede de postos de gasolina de um amigo. Limpo, menos ${fmt(custo)}.`,`Um doleiro mandou ${fmt(v)} para uma conta no exterior e trouxe de volta como "consultoria". Ficou ${fmt(custo)} com ele.`]); }
  if(R.chance(pol.esc/400)) queue('pol_operacao',{}); return t; }
EVENTS.pol_operacao={when:m=>!m.prison,show:()=>{ const m=S.me, pol=pol3(m); return {k:'Polícia Federal',t:'🚔 Operação policial',x:`Seis da manhã: a polícia bate na minha porta com um mandado. A operação investiga ${[pol.sujo>0?'lavagem de dinheiro':null,pol.faccao?'associação com facção criminosa':null,'desvio de dinheiro público'].filter(Boolean).join(', ')}.`,ch:[['Fazer delação premiada e entregar os aliados','delacao'],['Negar tudo com os melhores advogados ('+fmt(500000)+')','advogados'],[m.office?'Usar o foro privilegiado para ganhar tempo':'Ficar em silêncio','foro'],['Fugir do país','fuga']]}; },
  pick:k=>{ const m=S.me, pol=pol3(m), crimes='corrupção, lavagem de dinheiro'+(pol.faccao?' e associação com facção criminosa':''), perde=()=>{ if(m.office){ m.office=null; m.c.inelegivel=S.year+8; } };
    if(k==='delacao'){ pol.coal=clamp(pol.coal-40); pol.esc=clamp(pol.esc-20); m.money=Math.round(m.money*.5); pol.sujo=0; perde(); arrest(crimes,0,3); log('Fiz delação premiada.','warn'); return 'Contei tudo. Metade do meu dinheiro foi confiscada e a pena caiu muito. Meus antigos aliados me odeiam.'; }
    if(k==='advogados'){ m.money-=Math.min(Math.max(0,m.money),500000); if(R.chance(.45-pol.esc/400)){ pol.esc=clamp(pol.esc-10); return 'Os advogados acharam falhas na investigação. O caso foi anulado.'; } perde(); arrest(crimes,4,14); return 'Nem os melhores advogados deram conta. Fui condenad'+oa()+'.'; }
    if(k==='foro'){ if(m.office&&R.chance(.6)){ m.office.appr=clamp(m.office.appr-10); pol.esc=clamp(pol.esc+10); return 'Com o foro privilegiado, o caso subiu para o tribunal superior e vai demorar anos. A população não gostou.'; } perde(); arrest(crimes,3,12); return 'O foro não segurou. Fui pres'+oa()+'.'; }
    if(R.chance(.4)&&m.money>100000){ m.money=Math.round(m.money*.6); m.office=null; m.c.fugitive=1; m.c.inelegivel=S.year+20; log('Fugi do país durante uma operação policial.','bad'); return 'Peguei um jatinho de madrugada. Agora sou foragid'+oa()+' da justiça, com nome na lista internacional.'; }
    perde(); arrest(crimes+' e tentativa de fuga',5,16); return 'Me pegaram no aeroporto, de passaporte na mão.'; }};
// ---------- escândalos econômicos ----------
const POL_ECO=[['Contas maquiadas','O tribunal de contas descobriu que o governo maquiou o rombo nas contas públicas.',[['Assumir e corrigir as contas','assume',2,-5],['Culpar a equipe econômica','culpa',-4,5],['Dizer que é perseguição','nega',-6,10]]],
  ['Banco quebrando','Um grande banco do país está à beira da falência e pede socorro ao governo.',[['Socorrer com dinheiro público','socorre',-3,8],['Deixar quebrar','deixa',-6,0],['Intervir e trocar a diretoria','intervem',3,0]]],
  ['Privatização suspeita','Uma estatal foi vendida por um preço muito abaixo do mercado, para um amigo do governo.',[['Cancelar a venda','cancela',4,-5],['Defender o negócio','defende',-6,15],['Abrir uma investigação independente','investiga',3,-3]]],
  ['Calote na dívida','O país não tem dinheiro para pagar os credores internacionais este ano.',[['Negociar com os credores','negocia',0,0],['Dar o calote','calote',-8,5],['Cortar gastos sociais para pagar','corta',-5,0]]],
  ['Inflação disparada','Os preços dispararam e o povo foi às ruas.',[['Subir os juros','juros',-2,0],['Congelar os preços','congela',3,0],['Imprimir mais dinheiro','imprime',2,3]]]];
EVENTS.pol_eco={when:m=>!!m.office&&['gov','pres'].includes(m.office.id)&&!m.prison,prep:()=>({i:R.int(0,POL_ECO.length-1)}),show:d=>{ const E=POL_ECO[d.i]; return {k:'Economia',t:'📉 '+E[0],x:E[1],ch:E[2].map(c=>[c[0],c[1]])}; },
  pick:(k,d)=>{ const m=S.me, of=m.office, pol=pol3(m); if(!of) return ''; const c=POL_ECO[d.i][2].find(x=>x[1]===k); of.appr=clamp(of.appr+c[2]+R.int(-2,2)); pol.esc=clamp(pol.esc+c[3]);
    if(k==='imprime'){ queue('pol_eco',{i:4}); return 'O povo gostou no começo. No ano que vem a inflação volta, maior.'; } if(k==='congela') return 'Congelei os preços. Funcionou por uns meses; logo vão faltar produtos.';
    return c[2]>=2?'Agi com responsabilidade, e a maioria reconheceu.':c[2]>=0?'Passou, com arranhões.':'A decisão pegou muito mal.'; }};
// ---------- disputas internacionais e guerra ----------
const POL_DISPUTAS=[['fronteira','Tropas de {p} foram vistas perto da fronteira.'],['comercio','{p} aumentou as tarifas sobre os nossos produtos.'],['espionagem','Um espião de {p} foi preso em nosso território.'],['cidadao','Um cidadão nosso foi preso em {p} acusado de espionagem.'],['aguas','Barcos de pesca de {p} invadiram as nossas águas.']];
EVENTS.pol_disputa={when:m=>!!m.office&&m.office.id==='pres'&&!m.prison,prep:m=>({p:polVizinho(m),t:R.int(0,POL_DISPUTAS.length-1)}),
  show:d=>{ const pol=pol3(S.me), tv=pol.tens[d.p]||0; return {k:'Diplomacia',t:'🌐 Crise com '+nomePais(d.p),x:POL_DISPUTAS[d.t][1].replace('{p}',nomePais(d.p))+` Tensão com ${nomePais(d.p)}: ${tv}%.`,ch:[['Negociar pela diplomacia','diplomacia'],['Aplicar sanções econômicas','sancoes'],['Mobilizar as tropas','tropas'],['Ignorar o caso','ignora']]}; },
  pick:(k,d)=>{ const m=S.me, of=m.office, pol=pol3(m); if(!of) return ''; const t0=pol.tens[d.p]||0; let dt=0, t='';
    if(k==='diplomacia'){ if(R.chance(.55+m.smarts/250)){ dt=-20; of.appr=clamp(of.appr+3); t='Meu chanceler resolveu tudo numa reunião discreta. Crise encerrada.'; } else { dt=5; t='As conversas não andaram.'; } }
    else if(k==='sancoes'){ dt=15; of.appr=clamp(of.appr+R.int(-2,4)); t=`Sanções aplicadas. ${nomePais(d.p)} prometeu retaliar.`; }
    else if(k==='tropas'){ dt=30; of.appr=clamp(of.appr+4); t='Tropas na fronteira. A população se uniu em volta da bandeira, por enquanto.'; }
    else { dt=8; of.appr=clamp(of.appr-2); t='Ignorei. A oposição me chamou de fraco.'; }
    pol.tens[d.p]=clamp(t0+dt); if(pol.tens[d.p]>=70&&!pol.guerra) queue('pol_ultimato',{p:d.p}); return t+` Tensão agora: ${pol.tens[d.p]}%.`; }};
EVENTS.pol_ultimato={when:m=>!!m.office&&m.office.id==='pres'&&!m.prison,prep:m=>({p:polVizinho(m)}),show:d=>({k:'Diplomacia',t:'⚠️ À beira da guerra',x:`${nomePais(d.p)} deu um ultimato. Os generais pedem uma decisão. O mundo inteiro está olhando.`,ch:[['Negociar a paz de última hora','paz'],['Pedir mediação internacional','mediacao'],['Declarar guerra','guerra']]}),
  pick:(k,d)=>{ const m=S.me, of=m.office, pol=pol3(m); if(!of) return '';
    if(k==='paz'){ if(R.chance(.45+m.smarts/250+pol.coal/400)){ pol.tens[d.p]=30; of.appr=clamp(of.appr+8); m.fame=clamp(m.fame+5); log(`Evitei uma guerra com ${nomePais(d.p)}.`,'good'); return 'Uma noite inteira de telefonemas e um acordo no amanhecer. A guerra foi evitada.'; } pol.tens[d.p]=clamp((pol.tens[d.p]||0)+10); queue('pol_ultimato',d); return 'A negociação fracassou. O ultimato continua.'; }
    if(k==='mediacao'){ pol.tens[d.p]=45; of.appr=clamp(of.appr-2); return 'A mediação internacional esfriou a crise. A oposição diz que eu terceirizei a soberania.'; }
    pol.guerra={p:d.p,anos:0,frente:50}; of.appr=clamp(of.appr+10); m.c.guerra=1; log(`Declarei guerra contra ${nomePais(d.p)}.`,'bad'); if(typeof noticia==='function') noticia(`${nomePais(m.country)} declara guerra contra ${nomePais(d.p)}`,'O conflito começou após meses de tensão.','mundo','guerra:'+S.year+':'+d.p);
    return `Assinei a declaração de guerra contra ${nomePais(d.p)}. O país inteiro prendeu a respiração.`; }};
EVENTS.pol_guerra={when:m=>!!m.office&&m.office.id==='pres'&&!!polDe(m).guerra&&!m.prison,show:()=>{ const G=pol3(S.me).guerra; return {k:'Guerra',t:`⚔️ Guerra contra ${nomePais(G.p)} · ano ${G.anos+1}`,x:`A frente de batalha está ${G.frente>=60?'a nosso favor':G.frente<=40?'contra nós':'equilibrada'} (${G.frente}%). O que eu ordeno?`,ch:[['Lançar uma grande ofensiva','ofensiva'],['Defender as posições','defesa'],['Propor um armistício','armisticio']]}; },
  pick:k=>{ const m=S.me, of=m.office, pol=pol3(m), G=pol.guerra; if(!of||!G) return ''; G.anos++; let t='';
    if(k==='armisticio'){ if(R.chance(.35+(G.frente-50)/150+m.smarts/400)){ pol.guerra=null; pol.tens[G.p]=40; of.appr=clamp(of.appr+(G.frente>=50?5:-5)); log(`Assinei um armistício com ${nomePais(G.p)}.`,'warn'); return 'Armistício assinado. Os soldados voltam para casa.'; } t='O inimigo recusou o armistício. '; }
    const d=k==='ofensiva'?R.int(-18,22):R.int(-8,10); G.frente=clamp(G.frente+d); of.appr=clamp(of.appr-(G.anos>1?R.int(3,8):0)+(d>0?3:-3)); t+=d>0?'Avançamos e tomamos posições importantes.':'Perdemos terreno. Os mortos se contam aos milhares.';
    if(G.frente>=85){ pol.guerra=null; pol.tens[G.p]=20; of.appr=clamp(of.appr+15); m.fame=clamp(m.fame+15); log(`Vencemos a guerra contra ${nomePais(G.p)}.`,'good'); return t+' O inimigo se rendeu. Vencemos a guerra.'; }
    if(G.frente<=15){ pol.guerra=null; pol.tens[G.p]=50; of.appr=clamp(of.appr-25); pol.esc=clamp(pol.esc+30); log(`Perdemos a guerra contra ${nomePais(G.p)}.`,'bad'); if(of.appr<25) queue('pol_impeachment',{}); return t+' Tivemos que assinar uma rendição humilhante.'; }
    return t; }};
// ---------- telas e ciclo anual ----------
V.career=(o=>function(){ const r=o.apply(this,arguments), m=S.me, of=m.office; if(!of||!r||!r.items||m.prison||of.dit) return r; const pol=pol3(m); const i=r.items.findIndex(x=>x.l==='Negociar com os partidos'); if(i<0) return r;
  const add=[];
  if(pol.guerra) add.push({html:`<div class="card" style="border-color:#E5484D"><p><b>⚔️ Em guerra contra ${esc(nomePais(pol.guerra.p))}</b></p>${bar('Frente de batalha',pol.guerra.frente)}</div>`});
  const tens=Object.entries(pol.tens).filter(([,v])=>v>=30); if(tens.length) add.push({html:`<div class="card">${tens.map(([p,v])=>bar('Tensão com '+nomePais(p),v)).join('')}</div>`});
  add.push({sec:'Do lado escuro'},{ic:'💼',l:'Cobrar propina de uma empreiteira',s:'Muito dinheiro · escândalo',tone:'bad',on:()=>act(()=>polEsquema('propina'),'Propina')},{ic:'🏴',l:'Fazer acordo com uma facção',s:'Dinheiro e votos · crime organizado',tone:'bad',on:()=>act(()=>polEsquema('faccao'),'Facção')},
    {ic:'🧺',l:'Lavar o dinheiro sujo',s:pol.sujo?`${fmt(pol.sujo)} sujos · custa 20%`:'Nada para lavar',tone:'bad',on:()=>act(()=>polEsquema('lavar'),'Lavagem')});
  r.items.splice(i+1,0,...add); return r; })(V.career);
officeAct=(o=>function(k){ const m=S.me, d0=m.money; const r=o.apply(this,arguments); if(k==='desvio'&&m.money>d0) pol3(m).sujo+=m.money-d0; return r; })(officeAct);
NL_GANCHOS_ANO.push(()=>{ const m=S.me; if(!m||!m.alive||m.prison||S.scen) return; const pol=m.pol; if(!pol) return; pol3(m);
  if(!m.office&&!pol.sujo) return;
  if(pol.sujo>0&&R.chance(Math.min(.35,.05+pol.sujo/5e6+pol.esc/400))) queue('pol_operacao',{});
  if(!m.office) return; const of=m.office;
  if(['gov','pres'].includes(of.id)&&R.chance(.3)) queue('pol_eco',{i:R.int(0,POL_ECO.length-1)});
  if(of.id==='pres'&&!of.dit){ if(pol.guerra) queue('pol_guerra',{}); else if(R.chance(.3)) queue('pol_disputa',EVENTS.pol_disputa.prep(m)); for(const p of Object.keys(pol.tens)) pol.tens[p]=Math.max(0,pol.tens[p]-5); } });
function politica3SelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,erros=[];window.NO_SAVE=true;window.NO_NEWS=true; const ok=(c,t)=>{ if(!c) erros.push(t); }, BAD=/\{\w+\}|undefined|NaN|\[object|\bnull\b/;
  let x=1964; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; }; let m;
  const todas=(id,d)=>{ const snap=JSON.stringify(S); const sh=EVENTS[id].show(JSON.parse(JSON.stringify(d))); [sh.t,sh.x,...sh.ch.map(c=>c[0])].forEach(v=>ok(!BAD.test(String(v)),id+' texto: '+v));
    sh.ch.forEach(([l,k])=>{ S=JSON.parse(snap); m=S.me; try{ const r=EVENTS[id].pick(k,JSON.parse(JSON.stringify(d))); ok(!BAD.test(String(r??'')),id+'#'+k+': '+r); ok(Number.isFinite(S.me.money),id+'#'+k+' dinheiro'); }catch(e){ erros.push(id+'#'+k+': '+e.message); } }); S=JSON.parse(snap); m=S.me; };
  try{ newLife({country:'BR'}); m=S.me; m.age=50; m.born=S.year-50; m.money=2e6; m.prison=null; polFiliar('np'); m.office={id:'pres',yrs:1,appr:50,mand:1}; S.pending=[];
    for(const k of ['propina','faccao']){ m.yr={}; ok(!BAD.test(polEsquema(k)),'esquema '+k); } ok(pol3(m).sujo>0,'dinheiro sujo não registrado'); m.yr={}; polEsquema('lavar'); ok(pol3(m).sujo===0,'lavagem não limpou');
    pol3(m).sujo=100000; pol3(m).faccao=1; todas('pol_operacao',{}); m.office=null; todas('pol_operacao',{}); m.office={id:'pres',yrs:1,appr:50,mand:1};
    for(let i=0;i<POL_ECO.length;i++) todas('pol_eco',{i}); todas('pol_disputa',{p:'AR',t:0}); pol3(m).tens.AR=80; todas('pol_ultimato',{p:'AR'});
    S.pending=[]; m.office={id:'pres',yrs:1,appr:50,mand:1}; S.guerra=null; pol3(m).tens.AR=60; EVENTS.pol_disputa.pick('tropas',{p:'AR',t:0}); ok(S.pending.some(e=>e.id==='pol_ultimato'),'tensão alta sem ultimato');
    V.career().items.forEach(it=>ok(!BAD.test(String(it.l||'')+String(it.s||'')+String(it.html||'')),'tela: '+(it.l||''))); ok(V.career().items.some(it=>it.l==='Lavar o dinheiro sujo'),'sem esquemas na tela');
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; }
  if(erros.length) throw Error('Política 3 · '+erros.slice(0,8).join(' | ')); return {ok:true}; }
