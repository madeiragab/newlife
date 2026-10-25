// ===== 2.18: idade certa em tudo =====
// Revisão do que aparecia cedo demais: investigar o paranormal (16+), comprar ou herdar casa, apostas, casamento,
// abrir empresa, comprar arma (18+), votar e tatuagem (16+), carteira de motorista pela lei de cada país
// (16 nos EUA e no Canadá, 17 no Reino Unido e na Argentina, 18 no resto) e as ações de criatura.

IDADE_TEMAS.push(
  ['imovel',18,/(casa (à|a) venda|está à venda|à venda por|comprar (a|uma|essa) casa|comprar e investigar|herd\w+ (a|uma) casa|imóvel|imobiliária|escritura|apartamento próprio)/i,m=>(m.assets||[]).some(a=>a.k==='casa')],
  ['aposta',18,/(cassino|roleta|caça-níquel|apostar|apostei|casa de apostas|bingo)/i],
  ['casamento',18,/(me casar|nosso casamento|meu casamento|pedido de casamento|minha noiva|meu noivo|minha esposa|meu marido|lua de mel)/i,m=>partners().some(p=>['conjuge','noivo'].includes(p.rel))],
  ['negocio',18,/(abrir (uma|um|o meu|a minha) (empresa|negócio|loja|franquia)|meu sócio|minha sócia|investidores|ações da bolsa)/i,m=>!!m.biz],
  ['arma',18,/(comprar (uma )?(arma|pistola|revólver|espingarda)|porte de arma)/i],
  ['voto',16,/(votar|título de eleitor|urna eletrônica)/i],
  ['tatuagem',16,/(tatuagem|tatuar|tatuei)/i]);

// eventos do investigador paranormal só a partir dos 16 (antes eram 14)
for(const ev of Object.values(EVENTS)) if(typeof ev.cond==='string'&&/^Paranormal\b/.test(ev.cond)&&ev.when){ const w=ev.when; ev.when=m=>m.age>=16&&w(m); }

// carteira de motorista pela lei de cada país
const DIRECAO_IDADE={US:16,CA:16,GB:17,AR:17};
const idadeDirecao=m=>DIRECAO_IDADE[m.country]||18;
drivingTest=(o=>function(){ const m=S.me, lim=idadeDirecao(m); if(m.age>=lim&&m.age<18){ const a=m.age; m.age=18; try{ return o.apply(this,arguments); } finally{ m.age=a; } } return o.apply(this,arguments); })(drivingTest);
V.activities=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(!r||!r.items||m.prison) return r;
  for(const it of r.items){ if(!it) continue;
    if(it.l==='Investigar o paranormal'&&m.age<16) Object.assign(it,ageGate(16));
    if(it.l==='Autoescola'){ const lim=idadeDirecao(m); delete it.dis; delete it.why; delete it.r; Object.assign(it,ageGate(lim)); } }
  return r; })(V.activities);

// criatura: cada ação na idade em que faz sentido
const CRI_IDADE={clube:18,sumir:18,bando_entrar:16,bando_cacar:16,bando_territorio:16,bando_subir:16,hip_estranho:16,hip_policia:16,hip_chefe:16};
const CRI_IDADE_TELA=[[/^Lutar no /,18],[/^Mudar de cidade/,18],[/^Procurar (um clã|uma alcateia)/,16],[/^Hipnotizar (um estranho|a polícia|o chefe)/,16],[/^(Festa noturna|Caçar com a alcateia|Defender o território|Disputar o cargo)/,16],[/^Procurar uma cura/,16]];
criAcao=(o=>function(k){ const lim=CRI_IDADE[k]; if(lim&&S.me.age<lim) return `Ainda sou nov${oa()} demais para isso. Só a partir dos ${lim} anos.`; return o.apply(this,arguments); })(criAcao);
for(const nome of ['criatura','paranormal']) V[nome]=(o=>function(){ const r=o.apply(this,arguments), m=S.me; if(!r||!r.items||m.age>=18) return r;
  for(const it of r.items){ if(!it||!it.l) continue; const c=CRI_IDADE_TELA.find(([re])=>re.test(it.l)); if(c&&m.age<c[1]) Object.assign(it,ageGate(c[1])); }
  return r; })(V[nome]);

function idade2SelfTest(){ const s0=S,ns=window.NO_SAVE,meta=JSON.stringify(META); window.NO_SAVE=true; const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); };
  try{ newLife({country:'BR'}); let m=S.me; m.age=14;
    ok(idadeMinTexto('Uma casa "assombrada" está à venda por um preço ridículo.',m)>=18,'casa à venda liberada para menor');
    ok(idadeMinTexto('Você herda a casa de um tio-avô que ninguém conhecia.',m)>=18,'herança de casa liberada para menor');
    ok(idadeMinTexto('Fui ao cassino com os amigos.',m)>=18,'cassino liberado para menor');
    const pv=Object.values(EVENTS).filter(e=>typeof e.cond==='string'&&/^Paranormal\b/.test(e.cond)); m.para={prova:0,vistos:{},visitas:3}; ok(pv.length&&pv.every(e=>!e.when(m)),'evento paranormal para quem tem 14');
    let it=V.activities().items.find(x=>x.l==='Investigar o paranormal'); ok(it&&it.dis,'investigar o paranormal liberado aos 14');
    m.age=17; it=V.activities().items.find(x=>x.l==='Autoescola'); ok(it&&it.dis,'autoescola aos 17 no Brasil');
    newLife({country:'US'}); m=S.me; m.age=16; m.lic=false; it=V.activities().items.find(x=>x.l==='Autoescola'); ok(it&&!it.dis,'autoescola não abre aos 16 nos EUA');
    newLife({country:'BR'}); m=S.me; m.age=12; m.criatura='vampiro'; m.yr={}; ok(/nov/.test(criAcao('clube')),'clube de luta liberado para criança');
    const v=V.criatura(); ok(v.items.filter(x=>x.dis).length>=3,'tela de criatura sem trava de idade');
    const p=mkPerson({rel:'namoro',age:16,bond:90}); S.people.push(p); m.age=16; ok(!V.person(p).items.some(x=>x.l==='Pedir em casamento'),'pedido de casamento aos 16');
    ok(OFFICES.find(o=>o.id==='ver').age===18,'vereador não é 18');
  }catch(e){ erros.push('erro: '+e.message); } finally{ S=s0; window.NO_SAVE=ns; Object.assign(META,JSON.parse(meta)); }
  if(erros.length) throw Error('Idade 2.18 · '+erros.join(' | ')); return {ok:true}; }
