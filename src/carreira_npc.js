// Histórias profissionais alteram escolhas, sem transformar demissões em punição permanente.
function npcCarreira(p){const v=npcVida(p);if(!v.carreira){v.carreira={};for(const h of v.historico)npcCarreiraRegistrar(p,h);}return v.carreira;}
function npcCarreiraRegistrar(p,h){const v=npcVida(p),c=v.carreira||(v.carreira={});if(['demissao','falencia','diploma','emprego','mudanca_emprego'].includes(h.tipo))c[h.tipo]=Math.max(c[h.tipo]??-999,h.ano);}
function npcCarreiraRecente(p,tipo,anos=5){const ano=npcCarreira(p)[tipo];return Number.isFinite(ano)&&S.year-ano>=0&&S.year-ano<anos;}
function npcVagaPeso(p,j){const v=npcVida(p),c=npcCarreira(p);let peso=1;if(j.edu&&npcFormacaoOk(p,j.edu))peso+=/^(uni|post|tec)/.test(j.edu)?4:1;if(v.experiencia?.includes(j.id))peso+=2;if(npcCarreiraRecente(p,'demissao')||npcCarreiraRecente(p,'falencia'))peso+=['prof','poli','enfe','medi'].includes(j.id)?3:0;if(npcCarreiraRecente(p,'diploma',3)&&j.edu)peso+=3;return peso;}
function npcCarreiraBusca(p){const v=npcVida(p);return Math.min(.1,(v.experiencia?.length||0)*.01)+(npcCarreiraRecente(p,'diploma',3)?.06:0);}
function npcCarreiraNegocioPode(p){const v=npcVida(p);return !npcCarreiraRecente(p,'falencia',3)&&!(v.insolvencia?.ate>=S.year);}
function npcCarreiraDestinoPeso(p,pais){const w=mundo(pais),v=npcVida(p),j=JOBS.find(j=>j.id===v.emprego?.id)||JOBS.find(j=>npcRequisitos(p,j)&&j.edu),setor=w.mercados[setorTrabalho(j)];return Math.max(.05,.3+w.crescimento*4-w.desemprego+w.poderCompra*.1+(setor.demanda-setor.oferta)/150+(v.semEmprego>=3?.1:0));}
function npcCarreiraResumo(p){const c=npcCarreira(p),v=npcVida(p),a=[];if(npcCarreiraRecente(p,'demissao'))a.push('Busca mais estabilidade após o corte de vagas; experiência continua válida');if(npcCarreiraRecente(p,'falencia',3))a.push('Reconstrói reservas antes de abrir outro negócio');if(npcCarreiraRecente(p,'diploma',3))a.push('Procura vagas compatíveis com a formação recente');if(v.semEmprego>=3)a.push('Considera oportunidades em outros países');return a;}

function npcEscolherVaga(p){const op=JOBS.filter(j=>!j.pt&&!j.spc&&npcRequisitos(p,j));return op.length?R.wpick(op.map(j=>[j,npcVagaPeso(p,j)])):null;}
