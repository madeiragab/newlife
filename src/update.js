// ===== Versão, novidades e aviso de atualização =====
// Os apps (Android e Windows) procuram uma versão nova no site sempre que abrem e trocam o jogo sozinhos.
// Depois de cada atualização, o jogo mostra o que mudou num popup, uma vez só.
// Ao lançar uma versão nova: acrescente uma entrada NO TOPO de CHANGELOG.
const CHANGELOG=[
  {v:'1.6.2',d:'14/10/2026',t:'Tela de atualização',itens:['Quando o app se atualiza, aparece um anel de progresso colorido com a música do jogo, notinhas subindo e dicas.','Ao terminar, o jogo abre sozinho na versão nova.']},
  {v:'1.6.1',d:'14/10/2026',t:'Novidades na tela',itens:['Depois de cada atualização, este quadro mostra o que mudou (uma vez só).','Menu → Novidades mostra o histórico de versões quando você quiser.']},
  {v:'1.6',d:'14/10/2026',t:'Atualização automática',itens:['O app procura uma versão nova sempre que abre e se atualiza sozinho, sem reinstalar.','Sem internet, abre a última versão baixada. O progresso nunca se perde.','A versão atual aparece no fim do menu.']},
  {v:'1.5.4',d:'14/10/2026',t:'Mais 300 eventos com os membros',itens:['Time e turma da escola, professores, colegas de trabalho, chefe, fiéis, gabinete, funcionários e corte.','Equipe de heróis, moradores da base zumbi, da vila e da cidade do isekai, colonos de Marte e náufragos da ilha.']},
  {v:'1.5.2',d:'14/10/2026',t:'Membros em tudo',itens:['Gabinete, funcionários da empresa, corte da realeza e heróis da equipe com codinome e poder.','Moradores da base zumbi e da vila e da cidade no isekai: converse e chame para o grupo.']},
  {v:'1.5',d:'13/10/2026',t:'Seita, polícia, paranormal e golpe',itens:['Seita com cargos, fé dos seguidores, revolta, denúncias e domínio de bairro, cidade, estado e país.','Mais de 200 eventos para cada: seita, polícia, paranormal e golpe de Estado.','Morrer num mundo alternativo é morrer de verdade, e há confirmação antes de ir.','Membros das equipes e turma com professores dentro da escola.']},
  {v:'1.4',d:'13/10/2026',t:'Novas vidas possíveis',itens:['Fundar uma seita, virar policial e investigar crimes, derrubar o governo e investigar o paranormal.','Vampiros e lobisomens: a mordida é para sempre.','Ao desistir, você vê como cada pessoa próxima reage.']},
  {v:'1.3',d:'13/10/2026',t:'Romance e vida de herói',itens:['Romance em todos os modos fictícios, com casamento e filhos.','Super-herói ano a ano: equipe como emprego, Lei de Registro e a família na mira dos vilões.','Homens e mulheres com traços próprios no desenho.','Selo "Minha primeira vez".']},
];
const NLV=()=>String(window.NL_VER||'');
const nlVerTxt=v=>{ if(!v||v.length!==10) return 'desenvolvimento'; const d=new Date(Date.UTC(2000+ +v.slice(0,2),+v.slice(2,4)-1,+v.slice(4,6),+v.slice(6,8),+v.slice(8,10))); const z=n=>String(n).padStart(2,'0'); return `${z(d.getDate())}/${z(d.getMonth()+1)}/${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`; };
const verNum=s=>String(s).split('.').map(Number).reduce((a,n,i)=>a+n*Math.pow(1000,2-i),0);
const clHtml=list=>list.map(e=>`<div style="text-align:left;margin:10px 0 14px"><p style="margin:0 0 4px"><b>${esc(e.t)}</b> <span style="color:var(--muted);font-size:12px">v${esc(e.v)} · ${esc(e.d)}</span></p>${e.itens.map(i=>`<p style="margin:2px 0;font-size:13px">• ${esc(i)}</p>`).join('')}</div>`).join('');
function nlShowChangelog(list,title){ if(!list.length||typeof modal!=='function') return; modal({k:'NewLife',t:title||'O que há de novo',html:clHtml(list),ch:[{l:'Bora jogar'}]}); }
function nlCheckUpdated(){ const v=NLV(); if(!v) return; let oldV=null, seen=null;
  try{ oldV=localStorage.getItem('nlVer'); seen=localStorage.getItem('nlLog'); localStorage.setItem('nlVer',v); localStorage.setItem('nlLog',CHANGELOG[0].v); }catch(e){ return; }
  if(/teste|aventura|demo|qualidade/.test(location.hash)) return;
  if(!oldV||oldV===v) return;                       // primeira vez no app, ou nada mudou
  if(!seen) seen='1.6';                             // quem veio da 1.6 (antes de existir o changelog)
  const novos=CHANGELOG.filter(e=>verNum(e.v)>verNum(seen)).slice(0,4);
  nlShowChangelog(novos.length?novos:[CHANGELOG[0]],'Jogo atualizado!'); }
V.novidades=()=>({title:'Novidades',items:[{html:`<div class="card"><p style="color:var(--muted);font-size:13px">Versão instalada: ${esc(nlVerTxt(NLV()))}</p>${clHtml(CHANGELOG)}</div>`}]});
V.menu=(o=>()=>{ const r=o(); if(r&&r.items){ r.items.push({ic:'📰',l:'Novidades',s:'O que mudou em cada versão',on:()=>UI.push(V.novidades)},{html:`<div class="card"><p style="color:var(--muted);font-size:12px;text-align:center">Versão ${esc(nlVerTxt(NLV()))} · o app procura atualizações sozinho sempre que abre</p></div>`}); } return r; })(V.menu);
window.addEventListener('load',()=>setTimeout(()=>{ try{ nlCheckUpdated(); }catch(e){} },1800));
if(/demo-changelog/.test(location.hash)) window.addEventListener('load',()=>setTimeout(()=>{ try{ nlShowChangelog(CHANGELOG.slice(0,2),'Jogo atualizado!'); }catch(e){} },2500));
