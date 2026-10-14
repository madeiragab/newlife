// ===== Extensões da linguagem de eventos (cada sistema da vida normal pendura os seus tokens aqui) =====
var extTok=(tok,d,out)=>false, extChance=key=>null, extVar=k=>null;
// ===== Seita ou grupo religioso =====
const SEITA_TIPOS={igreja:['Igreja','⛪','Uma igreja de bairro que cresce com cultos animados e muita doação.'],apoc:['Seita apocalíptica','☄️','O fim está próximo, e só os seus seguidores vão se salvar.'],
  natureza:['Culto à natureza','🌿','Rituais na lua cheia, chás de ervas e abraços em árvores.'],guru:['Movimento espiritual','🧘','Autoajuda, retiros caros e você no papel de guru iluminado.']};
const SEITA_NOMES=['Igreja da Luz Eterna','Templo do Sétimo Selo','Comunidade do Novo Amanhecer','Ordem da Estrela Azul','Irmandade da Colheita','Caminho da Paz Interior','Ministério Fogo Vivo','Filhos da Última Aurora'];
const seita=()=>S.me.seita||null;
function seitaFix(s){ s.fieis=Math.max(0,Math.round(s.fieis)); ['devo','susp','fama'].forEach(k=>s[k]=clamp(s[k])); s.caixa=Math.max(0,Math.round(s.caixa)); return s; }
function seitaFundar(tipo,nome){ const m=S.me; if(m.seita) return 'Já lidero um grupo.'; const t=SEITA_TIPOS[tipo];
  m.seita={n:nome,tipo,fieis:R.int(3,9),devo:R.int(55,75),caixa:0,susp:5,fama:2,anos:0,templo:0,regras:{}}; m.c.seita=1;
  log(`${t[1]} Fundei ${nome}, ${t[0].toLowerCase()}. Os primeiros fiéis já me chamam de ${m.gender==='F'?'mestra':'mestre'}.`,'good'); st('happy',6);
  return `Fundei ${nome}! Começamos com ${m.seita.fieis} fiéis numa sala alugada.`; }
function seitaAcao(k){ const m=S.me, s=seita(); if(!s) return ''; const n=use('seita_'+k); if(n>2) return 'Já fiz muito disso este ano. Os fiéis precisam respirar.';
  const tipo=SEITA_TIPOS[s.tipo][0].toLowerCase(); let t='';
  switch(k){
    case 'pregar': { const g=Math.round(R.int(2,8)+m.looks/25+m.smarts/40+s.fama/10); s.fieis+=g; s.fama+=1; t=R.pick([`Preguei na praça debaixo de sol. ${g} pessoas novas pediram para entrar.`,`Fiz um discurso tão forte que um senhor chorou. Ele e mais ${g-1} entraram.`,`Distribuí panfletos na saída do metrô. ${g} novos fiéis.`]); break; }
    case 'culto': { s.devo+=R.int(6,12); st('happy',4); t=R.pick(['Culto lotado, cantoria até a meia-noite. A fé do grupo está nas alturas.','Fiz todo mundo dar as mãos e repetir um mantra por uma hora. Saíram em transe.','Retiro de fim de semana no sítio. Voltaram me olhando como se eu brilhasse.']); break; }
    case 'dizimo': { const v=Math.round(s.fieis*R.int(80,260)*(.5+s.devo/100)); s.caixa+=v; s.devo-=R.int(4,9); t=`Passei a sacolinha. Arrecadamos ${fmt(v)} para o caixa do grupo.`; break; }
    case 'sacar': { if(s.caixa<1000) return 'O caixa está quase vazio.'; const v=Math.round(s.caixa*R.int(30,70)/100); s.caixa-=v; m.money+=v; s.susp+=R.int(6,14); m.karma=clamp(m.karma-6); t=`Transferi ${fmt(v)} do caixa para a minha conta. "Despesas do ministério."`; break; }
    case 'templo': { const c=60000*(s.templo+1); if(s.caixa+m.money<c) return `Um templo novo custa ${fmt(c)}.`; const dc=Math.min(s.caixa,c); s.caixa-=dc; m.money-=c-dc; s.templo++; s.fama+=6; s.fieis+=R.int(10,30); t=`Inauguramos o templo número ${s.templo}. Fila na porta no primeiro dia.`; break; }
    case 'tv': { const c=25000; if(s.caixa+m.money<c) return `O horário na TV custa ${fmt(c)}.`; const dc=Math.min(s.caixa,c); s.caixa-=dc; m.money-=c-dc; const g=R.int(15,60); s.fieis+=g; s.fama+=8; m.fame=clamp(m.fame+3); s.susp+=3; t=`Comprei um horário de madrugada na TV. ${g} pessoas ligaram querendo entrar.`; break; }
    case 'profecia': { s.devo+=R.int(15,25); s.fama+=10; s.susp+=8; s.profecia=S.year+R.int(1,3); t=`Anunciei o fim do mundo para ${s.profecia}. Os fiéis venderam as casas. A imprensa adorou.`; break; }
    case 'ritual': { s.devo+=R.int(10,18); s.susp+=R.int(8,16); m.karma=clamp(m.karma-3); t=R.pick(['Ritual à luz de velas com túnicas brancas. Alguém desmaiou. Disseram que foi o espírito.','Fizemos um ritual secreto no meio da mata. Ninguém pode contar. Ninguém vai contar.']); break; }
    case 'comunidade': { s.devo+=R.int(12,20); s.susp+=R.int(12,20); s.regras.comunidade=1; t='Os fiéis agora moram todos juntos num sítio, longe das famílias. A devoção disparou. As famílias deles, não gostaram nada.'; break; }
    case 'caridade': { const c=Math.min(s.caixa,Math.max(2000,Math.round(s.caixa*.3))); s.caixa-=c; s.fama+=5; s.susp-=R.int(8,15); m.karma=clamp(m.karma+6); t=`Doamos ${fmt(c)} para um abrigo. Saiu no jornal do bairro, do jeito bom.`; break; }
  }
  seitaFix(s); return t; }
function seitaFim(why){ const m=S.me, s=seita(); if(!s) return ''; m.seita=null; log(`${s.n} chegou ao fim. ${why}`,'warn'); return `${s.n} chegou ao fim.`; }
// todo ano: o grupo cresce ou encolhe, o dízimo cai e a polícia observa
function seitaAno(){ const m=S.me, s=seita(); if(!s||!m.alive) return; s.anos++;
  const g=Math.round(s.fieis*((s.devo-45)/250+s.fama/400)+R.int(-2,4)); s.fieis+=g; s.devo+=R.int(-6,2); s.susp+=s.regras.comunidade?4:-4; s.fama+=s.fieis>200?1:0;
  const v=Math.round(s.fieis*R.int(20,70)*(.4+s.devo/100)); s.caixa+=v;
  if(m.prison){ s.devo-=10; s.fieis=Math.round(s.fieis*.8); }
  seitaFix(s); if(s.fieis<=0) return seitaFim('Não sobrou ninguém.');
  if(s.profecia&&S.year>=s.profecia){ s.profecia=0; queue('seita_profecia',{}); }
  if(!s.membro&&s.susp>=70&&R.chance((s.susp-55)/80)) queue('seita_policia',{}); }
yearMoney=(o=>function(){ const r=o.apply(this,arguments); try{ seitaAno(); }catch(e){} return r; })(yearMoney);
V.seita=()=>{ const m=S.me, s=seita(), it=[];
  if(!s){ it.push({html:'<div class="card"><p>Crie o seu próprio grupo religioso: escolha o tipo, dê um nome e conquiste fiéis. Dinheiro, poder e fé cega, até a polícia bater na porta.</p></div>'},{sec:'Fundar'});
    Object.entries(SEITA_TIPOS).forEach(([k,t])=>it.push({ic:t[1],l:t[0],s:t[2],on:()=>modal({t:'Nome do grupo',html:`<input class="in" id="seitaNome" style="margin-top:8px" maxlength="40" placeholder="${esc(R.pick(SEITA_NOMES))}" autocomplete="off">`,ch:[{l:'Fundar',fn:()=>{ const el=document.getElementById('seitaNome'); const v=((el&&el.value)||'').trim()||(el&&el.placeholder)||R.pick(SEITA_NOMES); const r=seitaFundar(k,v); MQ.unshift({t:t[0],x:r}); UI.close(); }},{l:'Cancelar',cls:'alt'}]})}));
    return {title:'Religião',items:it}; }
  const t=SEITA_TIPOS[s.tipo];
  it.push({html:`<div class="card"><p><b>${t[1]} ${esc(s.n)}</b></p><p style="color:var(--muted);font-size:13px">${esc(t[0])} · ${s.anos} ano(s) · ${s.templo} templo(s)</p>${kv('Fiéis',s.fieis.toLocaleString('pt-BR'))}${kv('Caixa do grupo',fmt(s.caixa))}${bar('Devoção',s.devo)}${bar('Fama',s.fama)}${bar('Suspeita da polícia',s.susp)}</div>`},{sec:'Liderar'});
  const A=(k,ic,l,sub,tone)=>it.push({ic,l,s:sub,tone,on:()=>act(()=>seitaAcao(k),l)});
  A('pregar','📣','Pregar na rua','Mais fiéis'); A('culto','🕯️','Fazer um culto ou retiro','Mais devoção'); A('dizimo','🧺','Pedir o dízimo','Dinheiro para o caixa · cansa os fiéis');
  A('tv','📺','Programa na TV',`${fmt(25000)} · fama e fiéis`); A('templo','🏛️','Construir um templo',`${fmt(60000*(s.templo+1))} · muitos fiéis`); A('caridade','🤲','Fazer caridade','Fama boa · menos suspeita');
  it.push({sec:'Do lado escuro'}); A('sacar','💰','Desviar dinheiro do caixa','Para a minha conta · suspeita','bad'); A('ritual','🔥','Ritual secreto','Devoção · suspeita','bad');
  if(!s.regras.comunidade) A('comunidade','🏚️','Mandar os fiéis morarem juntos','Devoção enorme · famílias revoltadas','bad');
  if(!s.profecia) A('profecia','☄️','Profetizar o fim do mundo','Devoção e fama agora · e quando não acontecer?','bad');
  it.push({ic:'🚪',l:'Dissolver o grupo',tone:'bad',on:()=>confirmBox('Dissolver?',`${s.n} deixa de existir. O caixa (${fmt(s.caixa)}) é doado.`,'Dissolver',()=>act(()=>seitaFim('Dissolvi o grupo e doei o caixa.'),'Religião'))});
  return {title:s.n,items:it}; };
V.activities=(o=>()=>{ const r=o(); const m=S.me; if(m.prison||!r||!r.items) return r; const s=seita(); r.items.push(Object.assign({ic:'🛐',l:'Religião e seitas',s:s?`${s.n} · ${s.fieis} fiéis`:'Fundar o seu próprio grupo religioso',on:()=>UI.push(V.seita)},ageGate(18))); return r; })(V.activities);
// eventos especiais
EVENTS.seita_profecia={show:()=>({k:'Religião',t:'O dia do fim do mundo',x:`Chegou o dia da profecia. Os fiéis de ${seita()?seita().n:'o grupo'} estão reunidos, de túnica, olhando para o céu. Nada acontece.`,ch:[['Dizer que a fé deles adiou o fim','a'],['Marcar uma nova data','n'],['Confessar que errei','c']]}),
  pick:k=>{ const s=seita(); if(!s) return ''; if(k==='a'){ if(R.chance(.55+S.me.smarts/300)){ s.devo+=15; seitaFix(s); return 'Acreditaram. Choraram de alegria. Dizem que eu salvei o mundo.'; } s.fieis=Math.round(s.fieis*.6); s.devo-=15; seitaFix(s); return 'Metade foi embora xingando. A outra metade ficou ainda mais fanática.'; }
    if(k==='n'){ s.profecia=S.year+R.int(1,3); s.fieis=Math.round(s.fieis*.8); s.fama+=5; seitaFix(s); return `Nova data: ${s.profecia}. Alguns saíram. Os que ficaram, ficaram mais fiéis.`; }
    s.fieis=Math.round(s.fieis*.4); s.devo-=20; S.me.karma=clamp(S.me.karma+8); seitaFix(s); return 'Pedi desculpas. Os que ficaram me respeitaram mais. Os outros querem o dinheiro de volta.'; }};
EVENTS.seita_policia={show:()=>({k:'Religião',t:'Polícia no templo',x:`A Polícia Federal chegou com mandado de busca em ${seita()?seita().n:'o grupo'}. Ex-fiéis denunciaram estelionato e lavagem de dinheiro.`,ch:[['Colaborar','c'],['Destruir os documentos','d'],['Fugir do país','f']]}),
  pick:k=>{ const m=S.me, s=seita(); if(!s) return '';
    if(k==='f'){ if(R.chance(.5)&&m.money>20000){ m.money=Math.round(m.money*.6); seitaFim('Fugi do país e deixei os fiéis para trás.'); m.c.fugitive=1; return 'Fugi de madrugada num jatinho. Virei manchete internacional.'; } arrest('estelionato religioso',2,8); seitaFim('A liderança foi presa.'); return 'Me pegaram no aeroporto.'; }
    if(k==='d'){ if(R.chance(.45)){ s.susp=30; seitaFix(s); return 'Picotei tudo antes de eles subirem. Não acharam nada.'; } arrest('estelionato e obstrução de justiça',3,10); seitaFim('A liderança foi presa.'); return 'Me pegaram com a mão no picotador.'; }
    if(R.chance(.4+(m.karma-50)/150)){ s.susp=20; s.caixa=Math.round(s.caixa*.5); seitaFix(s); return 'Abri os livros. Pagamos multa, mas o grupo continua.'; }
    arrest('estelionato religioso',1,6); s.fieis=Math.round(s.fieis*.5); seitaFix(s); return 'Mesmo colaborando, o promotor me denunciou.'; }};
extTok=(o=>function(tok,d,out){ const s=S.me&&S.me.seita; let mm; if(mm=tok.match(/^(fieis|devo|susp|sfama|caixa)([+-]\d+)$/)){ if(s){ const k=mm[1]==='sfama'?'fama':mm[1]; s[k]=(s[k]||0)+ +mm[2]; seitaFix(s); } return true; }
  if(tok==='seitafim'){ if(s) out.push(seitaFim('')); return true; } return o(tok,d,out); })(extTok);
extChance=(o=>function(key){ const s=S.me&&S.me.seita; if(key==='devo') return s?s.devo:30; if(key==='susp') return s?s.susp:10; return o(key); })(extChance);
const SEW=f=>m=>!!m.seita&&!m.seita.membro&&!m.prison&&f(m.seita,m);
pack({k:'Religião',w:1.4,cd:6,min:18,when:SEW(()=>true)},[
  ['Fiel milionário','Uma viúva rica quer deixar toda a herança para {seita}.',['Aceitar|caixa+300000 susp+8 k-4|A família dela vai me processar, mas o dinheiro já caiu.','Recusar e mandar falar com a família|k+6 sfama+4 devo+4|Os fiéis acharam lindo.']],
  ['Ex-fiel no jornal','Um ex-fiel deu entrevista dizendo que {seita} é uma fraude.',['Processar|$-8000 ?50 sfama+3|Ganhei. Ele se retratou.|susp+10|Perdi, e o caso ganhou mais destaque.','Ignorar|fieis-5 susp+5|Alguns fiéis ficaram com dúvidas.','Convidar para voltar|?55 devo+6 fieis+1|Ele voltou, chorando.|susp+6|Ele gravou a conversa.']],
  ['Milagre?','Uma fiel diz que foi curada de uma doença depois de um culto seu.',['Divulgar o milagre|fieis+25 sfama+8 susp+6|A fila do culto dobrou.','Pedir cautela|k+4 devo+3|Os fiéis me acharam humilde.']],
  ['Vice ambicioso','Seu braço direito quer dividir a liderança de {seita}.',['Aceitar|devo-6 susp-5|Dividir o poder acalmou as coisas.','Expulsar|?55 devo+6|Ele saiu sozinho.|fieis-20|Ele saiu e levou um monte de gente para um grupo rival.']],
  ['Político pede apoio','Um candidato quer o apoio de {seita} na eleição, em troca de favores.',['Apoiar|$+20000 sfama+5 susp+4|Os fiéis votaram em peso. Ganhei um amigo poderoso.','Manter o grupo fora da política|devo+4 k+2|Neutralidade.']],
  ['Família desesperada','Os pais de um jovem fiel acusam você de ter roubado o filho deles.',['Deixar o jovem decidir|?devo devo+4|Ele escolheu ficar.|fieis-1 k+2|Ele voltou para casa.','Proibir o contato com a família|devo+6 susp+12 k-8|A família foi à polícia.']],
  ['Documentário','Uma plataforma de streaming quer fazer um documentário sobre {seita}.',['Aceitar|sfama+15 fieis+30 susp+10 f+6|Viralizou. Amado e odiado na mesma medida.','Recusar|susp+3|Fizeram mesmo assim, só com ex-fiéis.']],
  ['Declaração depois do culto','{n}, que nunca falta a um culto, se declarou para você.',['Corresponder|devo-4 susp+6 meet:namoro|Começamos a namorar. Os outros fiéis cochicham.','Recusar com bondade|devo+3 k+2|{n} chorou, mas continuou fiel.']],
  ['Templo pegou fogo','Um incêndio destruiu parte do templo durante a noite.',['Usar o caixa para reconstruir|caixa-40000 devo+8|Mais bonito que antes.','Pedir doação extra aos fiéis|caixa+10000 devo-6|Reclamaram, mas doaram.','Dizer que foi um sinal|?55 devo+10|Os fiéis acreditaram.|fieis-10|Alguns acharam que era castigo.']],
  ['Celebridade quer entrar','Um ator famoso quer entrar para {seita}.',['Receber com festa|sfama+12 fieis+40 f+3|A imprensa enlouqueceu.','Tratar como qualquer fiel|devo+4 sfama+4|Ele adorou ser tratado como gente comum.']],
  ['Fiscalização da Receita','A Receita Federal quer ver as contas de {seita}.',['Mostrar tudo|?60 susp-10|Estava tudo certo. Mais ou menos.|caixa-30000 susp+10|Multa pesada.','Contratar um contador criativo|$-15000 ?55 susp-5|Passou.|susp+20|O contador era criativo demais.']],
  ['Seita rival','Um grupo rival está roubando seus fiéis com promessas melhores.',['Fazer um culto maior|devo+8 caixa-5000|Os fiéis ficaram.','Espalhar boatos sobre eles|k-6 ?55 fieis+15|Eles perderam gente para nós.|susp+8|Descobriram quem espalhou.']],
  ['Fiel doente','Um fiel grave recusou o hospital porque "a fé vai curar".',['Mandar para o hospital|k+8 devo-4|Ele se salvou. Alguns acharam que eu perdi a fé.','Rezar com ele|?40 devo+10|Ele melhorou, sem explicação.|susp+25 k-15|Ele morreu. A polícia quer falar comigo.']],
  ['Livro sagrado','Os fiéis pedem um livro com os seus ensinamentos.',['Escrever|?sm caixa+20000 sfama+6 tal.writing+3|Virou best-seller entre os fiéis.|h-2|Ninguém entendeu nada.','Contratar um escritor-fantasma|$-6000 caixa+15000|Ficou bom. Ninguém sabe.']],
  ['Jornalista infiltrado','Desconfiam que um novo fiel é jornalista disfarçado.',['Expulsar|susp-2 fieis-1|Era mesmo.','Tratar normalmente|?50 sfama+4|Ele saiu encantado e escreveu bem.|susp+15|A matéria foi devastadora.']],
  ['Uniforme','Os fiéis querem um uniforme oficial de {seita}.',['Túnica branca|devo+5 caixa-3000|Lindo. E meio assustador.','Camiseta com logotipo|caixa+4000 sfama+2|Vendemos na porta do templo.']],
  ['Casamento coletivo','Trinta casais de {seita} querem casar no mesmo dia.',['Celebrar|devo+10 sfama+6|Foi emocionante. E barulhento.','Cobrar uma taxa|caixa+15000 devo-4|Lucro abençoado.']],
  ['Fiel ameaça se matar','Um fiel diz que vai se matar se você não der atenção só para ele.',['Encaminhar para um psicólogo|k+8 devo-2|Ele está em tratamento.','Ignorar|susp+10 k-6|Ele acabou internado. A família culpa você.']],
  ['Reportagem de TV','Um programa policial fez uma reportagem sobre {seita}.',['Ir ao programa se defender|?sm sfama+8 susp-6|Saí do estúdio aplaudido.|susp+10|O apresentador me destruiu ao vivo.','Ficar em silêncio|susp+6|Silêncio soa como culpa.']],
]);
extVar=(o=>k=>k==='seita'?(S.me&&S.me.seita?S.me.seita.n:'o grupo'):o(k))(extVar);
