// ===== Idiomas: português e inglês =====
// O jogo é escrito em português. Em inglês, um tradutor troca na tela todo texto que tem tradução no
// dicionário (EN) ou num padrão (EN_RE); o que ainda não foi traduzido continua em português.
// A tradução cresce por lotes: telas e botões primeiro, depois os eventos.
// O idioma vem do aparelho na primeira vez e fica salvo (Menu → Idioma / Language).

let LANG=(()=>{ try{ if(/teste|aventura|demo|qualidade/.test(location.hash)) return 'pt'; }catch(e){}
  try{ const s=localStorage.getItem('nlLang'); if(s==='pt'||s==='en') return s; }catch(e){}
  try{ return /^pt/i.test(navigator.language||'pt')?'pt':'en'; }catch(e){ return 'pt'; } })();

const EN={
  // barra de baixo, topo e tela inicial
  'Carreira':'Career','Bens':'Assets','Relações':'Relationships','Atividades':'Activities','Menu':'Menu','Envelhecer':'Age up','Saldo':'Balance',
  'Sorteando uma nova vida…':'Rolling a new life…','Só disponíveis':'Available only','Buscar nesta tela':'Search this screen',
  'Felicidade':'Happiness','Saúde':'Health','Inteligência':'Smarts','Aparência':'Looks','Carma':'Karma','Fama':'Fame','Força de vontade':'Willpower','Luta':'Fighting',
  'Cada vida, uma nova história.':'Every life, a new story.','Nova vida':'New life','Continuar':'Continue','Novidades':'What\'s new','Voltar':'Back','Fechar':'Close','Cancelar':'Cancel',
  'Confirmar':'Confirm','OK':'OK','Sim':'Yes','Não':'No','Fazer':'Do it','Começar':'Start','Comprar':'Buy','Vender':'Sell','Pagar':'Pay','Aceitar':'Accept','Recusar':'Refuse',
  // menu
  'Desistir desta vida':'Give up this life','Encerra a vida atual agora':'Ends the current life now','Tela inicial':'Home screen','Continuar, criar uma vida ou ver novidades':'Continue, start a life or see what\'s new',
  'Cemitério':'Graveyard','Música':'Music','Efeitos sonoros':'Sound effects','Tema':'Theme','Claro':'Light','Escuro':'Dark','Ligada':'On','Desligada':'Off','Ligados':'On','Desligados':'Off',
  'Como jogar':'How to play','Desafios':'Challenges','Dificuldade':'Difficulty','Fácil':'Easy','Normal':'Normal','Difícil':'Hard','Meus selos':'My ribbons','Selos':'Ribbons',
  'Modo Deus':'God Mode','Editar atributos, talentos e genética':'Edit stats, talents and genetics','Máquina do tempo':'Time machine','Modos fictícios':'Fiction modes',
  'Zumbis, ilha deserta, isekai, superpoderes, Marte':'Zombies, desert island, isekai, superpowers, Mars','Resgatar código':'Redeem code','Zerar selos e cemitério':'Reset ribbons and graveyard',
  'Apaga o histórico de vidas anteriores':'Erases the history of past lives','Configurações':'Settings','Encerrar':'End','Extras':'Extras','Apoie o jogo':'Support the game','Idioma':'Language',
  // seções e telas
  'Abrir empresa':'Start a business','Amor':'Love','Assassino de aluguel':'Hitman','Atestado':'Sick note','Atributos':'Stats','Barbearia':'Barbershop','Bichos de estimação':'Pets',
  'Carreiras especiais':'Special careers','Cirurgia plástica':'Plastic surgery','Clubes e times':'Clubs and teams','Como vou pagar?':'How will I pay?','Comprar de criador':'Buy from a breeder',
  'Corte de cabelo':'Haircut','Crimes':'Crimes','Crimes avulsos':'Petty crimes','Cuidados':'Care','Currículo':'Résumé','Curso técnico':'Technical course','Dieta':'Diet','Diversão':'Fun',
  'Emigrar':'Emigrate','Emprego':'Job','Empréstimos':'Loans','Estudos':'Education','Eu':'Me','Faculdade':'College','Facção':'Gang','Genética':'Genetics','Guia de carreiras':'Career guide',
  'Imóveis à venda':'Real estate for sale','Investimentos':'Investments','Loja':'Shop','Mais':'More','Mais atividades':'More activities','Mandato':'Term','Mente e corpo':'Mind and body',
  'Meu emprego':'My job','Meus bens':'My assets','Meus problemas':'My problems','Minha empresa':'My business','Mundo e notícias':'World and news','Oportunidades':'Opportunities','Outros':'Other',
  'Países':'Countries','Pintar o cabelo':'Dye hair','Plano de carreira':'Career plan','Política':'Politics','Prisão':'Prison','Pós-graduação':'Graduate school','Realeza':'Royalty',
  'Redes sociais':'Social media','Ritmo de trabalho':'Work pace','Roupa nova':'New clothes','Roupas':'Clothes','Saudades':'Memories','Talentos':'Talents','Trabalho':'Work','Vagas':'Openings',
  'Veículos à venda':'Vehicles for sale','Viagens':'Trips','Vida pública':'Public life','Visual':'Appearance','Ótica':'Optician','Família':'Family','Amigos':'Friends','Filhos e netos':'Children and grandchildren',
  'Desafetos':'Enemies','Ex':'Exes','Amizades':'Friendships','Moradia':'Housing','Formação':'Education','Governo':'Government','Regime':'Regime','Revolução':'Revolution','Sucessão':'Succession',
  'Culto à personalidade':'Personality cult','Mão de ferro':'Iron fist','Dinheiro e poder':'Money and power','Refundar o país':'Refound the country','Por fora das urnas':'Outside the ballot box',
  // cartões (kv)
  'Altura adulta':'Adult height','Altura':'Height','Idade':'Age','Dinheiro':'Money','Patrimônio líquido':'Net worth','Patrimônio':'Net worth','País':'Country','Nascimento':'Born','Geração':'Generation',
  'Cabelo':'Hair','Olhos':'Eyes','Profissão':'Job','Salário':'Salary','Tempo de casa':'Time at company','Filhos':'Children','Casamentos':'Marriages','Viagens':'Trips','Dívidas':'Debts',
  'Ficha criminal':'Criminal record','Carteira de motorista':'Driver\'s license','Passaporte':'Passport','Seguidores':'Followers','Aposentadoria':'Pension','Instituição':'Institution',
  'Comportamento':'Behavior','Pena restante':'Remaining sentence','Anos de prisão':'Years in prison','Valor atual':'Current value','Preço de compra':'Purchase price','Custo anual':'Yearly cost',
  'Funcionários':'Employees','Valor de mercado':'Market value','Fertilidade':'Fertility','Minha nota':'My grade','Última profissão':'Last job','Onde':'Where','Ano':'Year','Duração':'Duration',
  'Regime':'Regime','Anos no poder':'Years in power','Estátuas minhas':'Statues of me','Aprovação do povo':'Public approval','Medo da população':'Public fear',
  'Lealdade dos militares':'Military loyalty','Pressão internacional':'International pressure','Membros':'Members','Apoio do povo':'Popular support',
  'Militares do nosso lado':'Military on our side','Suspeita da polícia política':'Secret police suspicion','Chance do golpe hoje':'Coup chance today',
  // relações
  'Mãe':'Mother','Pai':'Father','Irmão':'Brother','Irmã':'Sister','Avô':'Grandfather','Avó':'Grandmother','Filho':'Son','Filha':'Daughter','Neto':'Grandson','Neta':'Granddaughter',
  'Namorado':'Boyfriend','Namorada':'Girlfriend','Noivo':'Fiancé','Noiva':'Fiancée','Marido':'Husband','Esposa':'Wife','Amigo':'Friend','Amiga':'Friend','Inimigo':'Enemy','Inimiga':'Enemy',
  'Passar tempo juntos':'Spend time together','Melhora a relação':'Improves the relationship','Conversar':'Talk','Elogiar':'Compliment','Discutir':'Argue','Pedir dinheiro':'Ask for money',
  'Pedir em noivado':'Propose','Casar':'Marry','Terminar':'Break up','Pedir o divórcio':'Ask for a divorce','Assassinar':'Murder','Tem certeza?':'Are you sure?',
  // ocupações simples
  'Bebê':'Baby','Criança':'Child','Estudante':'Student','Desempregado':'Unemployed','Desempregada':'Unemployed','Aposentado':'Retired','Aposentada':'Retired',
  'Detento':'Inmate','Detenta':'Inmate','Universitário':'College student','Universitária':'College student',
  // lápide e fim
  'Descanse em paz':'Rest in peace','Continuar como filho':'Continue as a child','Começar outra vida':'Start another life',
};
// padrões com números e nomes
const EN_RE=[
  [/^(\d+) anos$/,'$1 years old'],[/^(\d+) ano$/,'$1 year old'],[/^(\d+) anos de idade$/,'$1 years old'],
  [/^Idade: (\d+)$/,'Age: $1'],[/^Disponível a partir dos (\d+) anos\.$/,'Available from age $1.'],
  [/^(\d+) vidas vividas$/,'$1 lives lived'],[/^NewLife · v(.+)$/,'NewLife · v$1'],
];
function tr(s){ if(LANG!=='en'||typeof s!=='string') return s; const k=s.trim(); if(!k) return s; let v=EN[k];
  if(v===undefined) for(const [re,rep] of EN_RE){ if(re.test(k)){ v=k.replace(re,rep); break; } }
  return v===undefined?s:s.replace(k,v); }

// tradutor da tela: troca textos e atributos conhecidos e guarda o original para voltar ao português
const I18N_ATTRS=['placeholder','aria-label','title'];
function i18nNode(n){
  if(n.nodeType===3){ const o=n.__pt??n.nodeValue; const v=LANG==='en'?tr(o):o; if(v!==n.nodeValue){ if(n.__pt===undefined) n.__pt=o; n.nodeValue=v; } return; }
  if(n.nodeType!==1||n.tagName==='SCRIPT'||n.tagName==='STYLE'||n.tagName==='TEXTAREA'||n.tagName==='INPUT'&&n.type!=='button') { if(n.nodeType===1&&n.placeholder!==undefined) i18nAttrs(n); return; }
  i18nAttrs(n); for(const c of n.childNodes) i18nNode(c); }
function i18nAttrs(el){ for(const a of I18N_ATTRS){ if(!el.hasAttribute||!el.hasAttribute(a)) continue; const k='__pt_'+a; const o=el[k]??el.getAttribute(a); const v=LANG==='en'?tr(o):o;
  if(v!==el.getAttribute(a)){ if(el[k]===undefined) el[k]=o; el.setAttribute(a,v); } } }
let i18nObs=null;
function i18nStart(){ if(typeof document==='undefined'||!document.body) return; document.documentElement.lang=LANG==='en'?'en':'pt-BR';
  i18nNode(document.body);
  if(!i18nObs&&typeof MutationObserver==='function'){ i18nObs=new MutationObserver(ms=>{ if(LANG!=='en'&&!i18nObs.voltar) return;
      for(const m of ms){ if(m.type==='characterData'){ const n=m.target; if(n.__pt!==undefined&&n.nodeValue!==tr(n.__pt)) n.__pt=undefined; i18nNode(n); } else for(const n of m.addedNodes) i18nNode(n); } });
    i18nObs.observe(document.body,{childList:true,subtree:true,characterData:true}); } }
function setLang(l){ LANG=l==='en'?'en':'pt'; try{ localStorage.setItem('nlLang',LANG); }catch(e){} i18nStart(); try{ render(); UI.refresh(); }catch(e){} }
if(typeof window!=='undefined') window.addEventListener('load',()=>setTimeout(i18nStart,0));

// seletor no Menu, junto do tema
V.menu=(o=>function(){ const r=o.apply(this,arguments); if(!r||!Array.isArray(r.items)) return r;
  const i=r.items.findIndex(x=>x&&x.l==='Tema'); const item={ic:'🌐',l:'Idioma',r:LANG==='en'?'English':'Português',on:()=>modal({t:'🌐 Idioma / Language',ch:[
    {l:'Português',fn:()=>setLang('pt')},{l:'English',fn:()=>setLang('en')},{l:LANG==='en'?'Cancel':'Cancelar',cls:'alt'}]})};
  r.items.splice(i>=0?i+1:r.items.length,0,item); return r; })(V.menu);
