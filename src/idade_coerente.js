// ===== Coerência por idade em todos os eventos, inclusive os que entram na fila sem condição própria:
// cada tema tem uma idade mínima (namoro, trabalho, direção, dinheiro, vícios, sexo). Bebês só veem coisas de bebê. =====
const IDADE_TEMAS=[
  ['romance',12,/(^|[^a-zà-ú])(namor\w*|me beijou|beij(ar|o|ou|amos)|paquer\w*|crush|encontro romântico|pedir em namoro|ficar com (ele|ela)|apaixonad\w*|declarou para (mim|você))(?![a-zà-ú])/i],
  ['sexo',16,/(^|[^a-zà-ú])(sexo|transar|transamos|motel|camisinha|noite de amor|na cama com)(?![a-zà-ú])/i],
  ['trabalho',14,/(^|[^a-zà-ú])(meu chefe|minha chefe|meu salário|meu emprego|no meu trabalho|fui demitid\w*|fui contratad\w*|currículo|entrevista de emprego|minha empresa|hora extra|expediente)(?![a-zà-ú])/i,m=>!!m.job||!!m.biz],
  ['direcao',16,/(^|[^a-zà-ú])(dirigir|dirigindo|volante|carteira de motorista|blitz|meu carro)(?![a-zà-ú])/i,m=>!!m.lic],
  ['dinheiro',16,/(^|[^a-zà-ú])(meu empréstimo|financiamento|cartão de crédito|investir|boleto|aluguel|imposto de renda|minha dívida|fatura do cartão)(?![a-zà-ú])/i],
  ['vicio',12,/(^|[^a-zà-ú])(cigarro|vape|maconha|cocaína|baseado|crack)(?![a-zà-ú])/i]];
// bebês e crianças muito pequenas: só o que faz sentido para quem ainda nem fala direito
const IDADE_KINDS_BEBE=new Set(['Família','Saúde','Infância','Bebê','Casa','Sorte','Perigo','Vizinhança','Escola','Natureza','Mundo']);
function idadeMinTexto(txt,m){ let min=0; for(const [,idade,re,isento] of IDADE_TEMAS) if(re.test(txt)&&!(isento&&isento(m))) min=Math.max(min,idade); return min; }
function idadeEventoOk(e,m){ const ev=EVENTS[e.id]; if(!ev) return true; const d=e.d||{};
  if(e.id==='npc_conversa'){ if(m.age<6) return false; if(['apoio','oportunidade','retorno'].includes(d.tipo)&&m.age<16) return false; }
  if(ev._idadeMin&&m.age<ev._idadeMin) return false;
  let sh; try{ sh=ev.show(d); }catch(err){ return true; } if(!sh) return true;
  if(m.age<3&&sh.k&&!IDADE_KINDS_BEBE.has(sh.k)) return false;
  const min=idadeMinTexto(String(sh.t||'')+' '+String(sh.x||''),m); if(min>m.age){ if(!String(e.id).startsWith('cad_')&&!d.pid) ev._idadeMin=Math.max(ev._idadeMin||0,min); return false; }
  return true; }
evValid=(o=>function(e){ const ok=o.apply(this,arguments); if(!ok) return false; const m=S.me; if(!m||m.age>=18) return ok; try{ return idadeEventoOk(e,m); }catch(err){ return ok; } })(evValid);
// escolhas fora da idade somem (quando sobram pelo menos duas)
for(const ev of Object.values(EVENTS)){ const sh0=ev.show, w0=ev.when; if(!sh0||ev._idadeTema) continue; ev._idadeTema=1;
  if(w0) ev.when=m=>!(ev._idadeMin&&m.age<ev._idadeMin)&&w0(m);
  ev.show=function(d){ const r=sh0.apply(this,arguments); try{ const m=S.me; if(!r||!r.ch||!m||m.age>=18) return r; const ok=r.ch.filter(c=>idadeMinTexto(String(c[0]),m)<=m.age); if(ok.length>=2&&ok.length<r.ch.length) r.ch=ok; }catch(e){} return r; }; }
