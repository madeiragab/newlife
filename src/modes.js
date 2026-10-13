// ===== Modos: empresa, realeza, Modo Deus =====
function openBiz(sec,name){
  const m=S.me; if(m.biz) return 'Já tenho uma empresa.';
  if(!canPay(sec.cost)) return `Preciso de ${fmt(sec.cost)} para abrir.`;
  m.money-=sec.cost; m.biz={n:name,sector:sec.n,value:sec.cost,start:sec.cost,emp:R.int(1,5),yrs:0,mkt:0};
  log(`Abri minha empresa: ${name} (${sec.n.toLowerCase()}).`,'good'); st('happy',10);
  return `${name} está aberta!`;
}
function bizAct(k,v){
  const m=S.me,b=m.biz; if(!b) return;
  if(k==='invest'){ if(!canPay(v)) return 'Não tenho esse dinheiro.'; m.money-=v; b.value+=Math.round(v*(.8+R.f()*.5)); b.emp+=Math.max(1,Math.round(v/60000)); return `Investi ${fmt(v)} na ${b.n}.`; }
  if(k==='mkt'){ if(use('mkt')>1) return 'Já fiz campanha este ano.'; const c=Math.max(2000,Math.round(b.value*.05)); if(!canPay(c)) return `A campanha custa ${fmt(c)}.`; m.money-=c; b.mkt=R.chance(.7)?R.f()*.12:-.03; return b.mkt>0?'A campanha de marketing foi um sucesso.':'A campanha virou piada na internet.'; }
  if(k==='lucro'){ if(use('lucro')>1) return 'Já retirei lucros este ano.'; const v2=Math.round(b.value*.1); b.value-=v2; m.money+=v2; return `Retirei ${fmt(v2)} da empresa.`; }
  if(k==='vender'){ const v2=Math.round(b.value*(.75+R.f()*.5)); m.money+=v2; log(`Vendi a ${b.n} por ${fmt(v2)}.`,'good'); m.biz=null; st('happy',8); return `Vendi a ${b.n} por ${fmt(v2)}!`; }
  if(k==='ipo'){ if(b.value<5e7) return 'A empresa precisa valer pelo menos $50 milhões para abrir capital.'; if(b.pub) return 'A empresa já está na bolsa.'; b.pub=true; b.value=Math.round(b.value*(1.2+R.f()*.8)); m.fame=clamp(m.fame+10); log(`A ${b.n} estreou na bolsa de valores!`,'good'); return 'A empresa abriu capital na bolsa! As ações dispararam.'; }
  if(k==='fechar'){ log(`Fechei a ${b.n}.`); m.biz=null; return 'Fechei a empresa.'; }
}
const BIZ_NAMES=['Sabor & Cia','Nova Onda','Ponto Certo','Bem-Te-Vi','Estrela Guia','Raiz Forte','Maré Cheia','Vila Real','Céu Aberto','Pé de Moleque','Mandacaru','Tropicália','Faro Fino','Mão Amiga','Lua Nova','Pé na Estrada'];

function royalAct(k){
  const m=S.me,r=m.royal; if(use('royal')>4) return 'Já cumpri a agenda real deste ano.';
  if(k==='acenar'){ r.pop=clamp(r.pop+R.int(1,4)); return R.pick(['Acenei da sacada do palácio para a multidão.','Desfilei em carruagem aberta pela capital.','Inaugurei uma ponte e cortei a fita.']); }
  if(k==='caridade'){ m.money-=100000; r.pop=clamp(r.pop+R.int(4,10)); m.karma=clamp(m.karma+5); cnt('gifts',3); return `Patrocinei ${R.pick(['um hospital infantil','um abrigo de animais','bolsas de estudo','a reforma de escolas públicas'])}.`; }
  if(k==='viagem'){ r.pop=clamp(r.pop+R.int(-2,6)); st('happy',6); cnt('trips'); return `Fiz uma visita oficial a ${R.pick(TRIPS)}.`; }
  if(k==='entrevista'){ const d=R.int(-10,10); r.pop=clamp(r.pop+d); return d>=0?'Dei uma entrevista charmosa na TV.':'Falei uma bobagem na entrevista e virei meme.'; }
  if(k==='discurso'){ r.pop=clamp(r.pop+R.int(-3,8)); return 'Fiz um discurso à nação.'; }
  if(k==='feriado'){ r.pop=clamp(r.pop+R.int(5,12)); return `Decretei feriado nacional no dia do meu ${R.pick(['aniversário','cachorro','time do coração'])}.`; }
  if(k==='impostos'){ const v=R.int(2,20)*1e6; m.money+=v; r.pop=clamp(r.pop-R.int(8,18)); return `Aumentei os impostos reais e embolsei ${fmt(v)}. O povo não gostou.`; }
  if(k==='perdao'){ r.pop=clamp(r.pop+R.int(-6,6)); m.karma=clamp(m.karma+3); return 'Concedi perdão real a um prisioneiro.'; }
  if(k==='abdicar'){ r.abd=true; const was=r.reign; r.reign=false; log(was?'Abdiquei do trono.':'Renunciei aos meus títulos reais.','warn'); return was?'Abdiquei do trono.':'Renunciei aos títulos de nobreza.'; }
}

// Modo Deus: ajustar atributos e genética
const HAIR_COLORS=['preto','castanho-escuro','castanho','castanho-claro','loiro','ruivo','grisalho'];
const EYESL=['castanhos','castanho-escuros','pretos','verdes','azuis','cor de mel','acinzentados'];
function godSet(k,d){
  const m=S.me; cnt('god');
  if(['happy','health','smarts','looks','karma','fame','will','fert','fight'].includes(k)){ m[k]=clamp((m[k]||0)+d); return; }
  if(k.startsWith('t.')){ const t=k.slice(2); m.talent[t]=clamp((m.talent[t]||0)+d); return; }
  if(k==='hair'){ m.genes.hair=HAIR_COLORS[(HAIR_COLORS.indexOf(m.genes.hair)+1)%HAIR_COLORS.length]; m.genes.from.hair=null; return; }
  if(k==='eyes'){ m.genes.eyes=EYESL[(EYESL.indexOf(m.genes.eyes)+1)%EYESL.length]; m.genes.from.eyes=null; return; }
  if(k==='h'){ m.genes.h=Math.max(130,Math.min(220,m.genes.h+d)); return; }
  if(k==='cure'){ m.dis=[]; m.add={alcool:0,cigarro:0,jogo:0}; return; }
}
