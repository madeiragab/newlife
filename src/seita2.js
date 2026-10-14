// ===== Seita (parte 2): entrar num grupo e subir de cargo, conquistar seguidores, denúncias e dominar lugares =====
const SEITA_CARGOS=['Fiel','Obreiro|Obreira','Diácono|Diaconisa','Pastor|Pastora','Bispo|Bispa','Braço direito do líder'];
const SEITA_LIDERES=['Profeta Josué','Mãe Celestina','Apóstolo Valdomiro','Irmã Glória','Mestre Ravi','Pai Benedito','Guru Anand','Bispa Rosângela'];
const SEITA_DOM=[['o bairro',150,'🏘️'],['a cidade',800,'🏙️'],['o estado',4000,'🗺️'],['o país',20000,'🏛️']];
const sCargo=s=>g(SEITA_CARGOS[Math.min(s.cargo||0,SEITA_CARGOS.length-1)],S.me.gender);
const sLider=()=>{ const s=seita(); return !!s&&!s.membro; };
// quem funda começa praticamente sozinho
seitaFundar=(o=>function(tipo,nome){ const r=o(tipo,nome); const s=seita(); if(s&&!s.membro&&s.anos===0&&!s.ini){ s.ini=1; s.fieis=R.int(0,2); s.dom=[]; } return s?`Fundei ${s.n}! Por enquanto, ${s.fieis===0?'o único fiel sou eu':s.fieis===1?'tem só um fiel além de mim':'são só dois fiéis além de mim'}. Hora de conquistar seguidores.`:r; })(seitaFundar);
function seitaEntrar(){ const m=S.me; if(m.seita) return 'Já faço parte de um grupo.'; const tipo=R.pick(Object.keys(SEITA_TIPOS));
  m.seita={n:R.pick(SEITA_NOMES),tipo,membro:1,cargo:0,xp:0,lider:R.pick(SEITA_LIDERES),fieis:R.int(80,2500),devo:R.int(60,90),caixa:R.int(50000,900000),susp:R.int(5,40),fama:R.int(10,60),anos:0,templo:R.int(1,6),regras:{},dom:[],fe:R.int(50,70)};
  const s=m.seita; m.c.seita=1; log(`Entrei para ${s.n}, liderad${/^(Mãe|Irmã|Bispa)/.test(s.lider)?'a':'o'} por ${s.lider}.`,'warn');
  return `Entrei para ${s.n}. ${s.lider} me recebeu com um abraço longo demais e um formulário de dízimo.`; }
function seitaMembro(k){ const m=S.me, s=seita(); if(!s||!s.membro) return ''; if(use('sm_'+k)>2) return 'Já fiz muito disso este ano.'; let t='';
  switch(k){
    case 'culto': s.xp+=2; s.fe=clamp(s.fe+R.int(4,9)); st('happy',3); t=R.pick(['Fui a todos os cultos do mês. Sentei na primeira fila.','Cantei tão alto que me chamaram para o coral.','Chorei no culto. Não sei bem por quê. Me senti em casa.']); break;
    case 'oferta': { const v=Math.min(m.money,Math.max(200,Math.round(m.money*.1))); if(v<=0) return 'Não tenho dinheiro para ofertar.'; m.money-=v; s.caixa+=v; s.xp+=Math.round(1+v/5000); t=`Ofertei ${fmt(v)}. ${s.lider} citou meu nome no púlpito.`; break; }
    case 'recrutar': { const n=R.int(0,4)+Math.round(m.looks/40); s.fieis+=n; s.xp+=n+1; t=n?`Trouxe ${n} pessoa${n>1?'s':''} para o grupo. ${s.lider} anotou.`:'Bati de porta em porta. Fecharam todas na minha cara.'; break; }
    case 'servir': s.xp+=3; m.karma=clamp(m.karma-2); t=R.pick([`Fiz o trabalho sujo para ${s.lider}: cobrar fiéis atrasados no dízimo.`,`Dirigi o carro de ${s.lider} a semana inteira. Ouvi coisas que não devia.`,'Organizei o retiro do ano. Ninguém dormiu, ninguém reclamou.']); break;
    case 'cargo': { const need=((s.cargo||0)+1)*5; if(s.cargo>=SEITA_CARGOS.length-1) return 'Não tem cargo acima. Só o do líder.'; if(s.xp>=need&&R.chance(.45+s.fe/250+m.smarts/400)){ s.cargo++; s.xp=0; st('happy',8); log(`Subi na hierarquia de ${s.n}: agora sou ${sCargo(s).toLowerCase()}.`,'good'); return `${s.lider} me ungiu na frente de todos. Agora sou ${sCargo(s).toLowerCase()}.`; } s.xp=Math.max(0,s.xp-1); return s.xp<need?`Me disseram para servir mais antes de pedir cargo (${s.xp} de ${need}).`:`${s.lider} disse que ainda não é a minha hora.`; }
    case 'tomar': { if(s.cargo<SEITA_CARGOS.length-1) return 'Só o braço direito pode tentar tomar a liderança.'; if(R.chance(.35+m.smarts/300+s.fe/400)){ const old=s.lider; s.membro=0; s.cargo=0; s.lider=null; s.devo=clamp(s.devo-15); log(`Tomei a liderança de ${s.n}. ${old} saiu pela porta dos fundos.`,'good'); return `Juntei provas contra ${old} e convoquei uma assembleia. Agora ${s.n} é meu.`; } s.cargo=Math.max(0,s.cargo-3); s.xp=0; st('happy',-10); return `${s.lider} descobriu o plano. Fui rebaixad${oa()} na frente de todos.`; }
    case 'denunciar': { m.karma=clamp(m.karma+12); const n=s.n; m.seita=null; log(`Denunciei ${n} à polícia e saí do grupo.`,'warn'); if(R.chance(.5)) return `Entreguei tudo à polícia. ${n} foi fechad${R.chance(.5)?'o':'a'} e ${s.lider} foi pres${/^(Mãe|Irmã|Bispa)/.test(s.lider)?'a':'o'}. Os fiéis ainda me xingam na rua.`; return `Denunciei, mas o caso foi arquivado. Agora o grupo inteiro sabe quem foi.`; }
    case 'sair': { const n=s.n; m.seita=null; st('happy',R.chance(.5)?6:-6); return R.pick([`Saí de ${n}. Me ligam todo dia dizendo que vou para o inferno.`,`Saí de ${n} e recuperei minha vida. E meu dinheiro, não.`]); }
  }
  seitaFix(s); return t; }
// dominar lugares quando o grupo fica grande
function seitaDominar(){ const m=S.me, s=seita(); if(!s||s.membro) return ''; s.dom=s.dom||[]; const nx=SEITA_DOM[s.dom.length]; if(!nx) return 'Já domino o país inteiro.';
  if(s.fieis<nx[1]) return `Para dominar ${nx[0]} preciso de ${nx[1].toLocaleString('pt-BR')} fiéis.`; if(use('dominar')>1) return 'Uma tentativa por ano. O poder também cansa.';
  const c=[20000,150000,800000,4000000][s.dom.length]; if(s.caixa+m.money<c) return `Uma campanha para dominar ${nx[0]} custa ${fmt(c)}.`; const dc=Math.min(s.caixa,c); s.caixa-=dc; m.money-=c-dc;
  if(R.chance(.35+s.devo/300+s.fama/300-s.dom.length*.06)){ s.dom.push(nx[0]); s.fama+=12; s.susp+=8; s.fieis=Math.round(s.fieis*1.25); m.fame=clamp(m.fame+8+s.dom.length*6); seitaFix(s);
    log(`${nx[2]} ${s.n} passou a dominar ${nx[0]}.`,'good'); return {0:'Compramos a rádio do bairro, elegemos o presidente da associação e pintamos as praças com as nossas cores. O bairro é nosso.',1:'Vereadores ajoelham no nosso culto. O prefeito pede bênção antes de assinar leis. A cidade é nossa.',2:'Deputados da nossa bancada, governador na primeira fila do culto. O estado reza do nosso jeito.',3:'O presidente beijou minha mão em rede nacional. O país inteiro, agora, segue a nossa fé.'}[s.dom.length-1]; }
  s.susp+=15; s.fama-=5; s.fieis=Math.round(s.fieis*.9); seitaFix(s); return R.pick(['A campanha fracassou. A imprensa chamou de "tentativa de tomada religiosa".','Os políticos aceitaram nosso dinheiro e depois votaram contra. Fomos traídos.']); }
// denúncias aparecem quando o grupo cresce
seitaAno=(o=>function(){ const r=o.apply(this,arguments); const m=S.me, s=seita(); if(!s||!m.alive) return r;
  if(s.membro){ s.fe=clamp((s.fe||50)+R.int(-5,3)); s.xp+=1; if(R.chance(.12)) queue('seita_lider_pede',{}); return r; }
  if(s.dom&&s.dom.length){ const v=Math.round(s.fieis*s.dom.length*R.int(5,15)); s.caixa+=v; }
  if(s.fieis>=30&&R.chance(Math.min(.35,.06+s.fieis/4000+s.susp/300))) queue('seita_denuncia',{});
  return r; })(seitaAno);
V.seita=(o=>()=>{ const m=S.me, s=seita();
  if(!s){ const r=o(); r.items.splice(1,0,{sec:'Entrar num grupo'},{ic:'🙏',l:'Entrar numa igreja ou seita',s:'Começa como fiel e sobe de cargo',on:()=>act(seitaEntrar,'Religião')},{sec:'Ou fundar o seu'}); return r; }
  if(s.membro){ const t=SEITA_TIPOS[s.tipo], it=[{html:`<div class="card"><p><b>${t[1]} ${esc(s.n)}</b></p><p style="color:var(--muted);font-size:13px">${esc(t[0])} · líder: ${esc(s.lider)}</p>${kv('Meu cargo',sCargo(s))}${kv('Fiéis do grupo',s.fieis.toLocaleString('pt-BR'))}${bar('Minha fé',s.fe)}${kv('Serviço para o próximo cargo',`${s.xp} de ${((s.cargo||0)+1)*5}`)}</div>`},{sec:'Vida no grupo'}];
    const A=(k,ic,l,sub,tone)=>it.push({ic,l,s:sub,tone,on:()=>act(()=>seitaMembro(k),l)});
    A('culto','🕯️','Ir aos cultos','Fé e serviço'); A('oferta','💸','Fazer uma oferta','10% do que tenho'); A('recrutar','📣','Trazer gente nova','Serviço'); A('servir','🧹',`Servir ${s.lider}`,'Muito serviço · nem tudo é bonito');
    A('cargo','📈',s.cargo>=SEITA_CARGOS.length-1?'Já sou o braço direito':`Pedir o cargo de ${g(SEITA_CARGOS[s.cargo+1],m.gender).toLowerCase()}`,'Depende do serviço e da fé');
    if(s.cargo>=SEITA_CARGOS.length-1) A('tomar','👑','Tomar a liderança','Tudo ou nada','bad');
    it.push({sec:'Sair'}); A('denunciar','🚨','Denunciar o grupo à polícia','O certo, e perigoso','bad'); A('sair','🚪','Sair do grupo','','bad');
    return {title:s.n,items:it}; }
  const r=o(); s.dom=s.dom||[]; const nx=SEITA_DOM[s.dom.length]; const i=r.items.findIndex(x=>x.sec==='Do lado escuro');
  const add=[{sec:'Poder'},{html:`<div class="card">${kv('Domínio',s.dom.length?s.dom[s.dom.length-1][0].toUpperCase()+s.dom[s.dom.length-1].slice(1):'Nenhum lugar ainda')}</div>`}];
  if(nx) add.push({ic:nx[2],l:`Dominar ${nx[0]}`,s:`Precisa de ${nx[1].toLocaleString('pt-BR')} fiéis · ${fmt([20000,150000,800000,4000000][s.dom.length])}`,dis:s.fieis<nx[1],why:`Ainda faltam ${(nx[1]-s.fieis).toLocaleString('pt-BR')} fiéis.`,on:()=>act(seitaDominar,'Dominar')});
  r.items.splice(i>=0?i:r.items.length,0,...add); return r; })(V.seita);
V.activities=(o=>()=>{ const r=o(); const s=seita(); const it=r&&r.items&&r.items.find(x=>x.l==='Religião e seitas'); if(it) it.s=s?(s.membro?`${s.n} · ${sCargo(s)}`:`${s.n} · ${s.fieis} fiéis`):'Entrar num grupo ou fundar o seu'; return r; })(V.activities);
occupation=(o=>()=>{ const m=S.me, s=m&&m.seita; const r=o(); if(s&&!s.membro&&!m.job&&!m.office&&!m.prison&&m.alive&&!S.scen&&s.fieis>=50) return `Líder de ${s.n}`; return r; })(occupation);
EVENTS.seita_denuncia={show:()=>{ const s=seita(); return {k:'Religião',t:'Denúncia',x:`${R.pick(['Um ex-fiel','A mãe de uma fiel','Um vizinho do templo','Um jornalista','Um ex-tesoureiro'])} denunciou ${s?s.n:'o grupo'} ao Ministério Público por ${R.pick(['estelionato','charlatanismo','cárcere privado','lavagem de dinheiro','abuso psicológico'])}.`,ch:[['Contratar bons advogados','a'],['Negar tudo em público','n'],['Pressionar o denunciante','p'],['Fazer um acordo','c']]}; },
  pick:k=>{ const m=S.me, s=seita(); if(!s) return '';
    if(k==='a'){ const c=Math.min(s.caixa+m.money,60000), dc=Math.min(s.caixa,c); s.caixa-=dc; m.money-=c-dc; if(R.chance(.7)){ seitaFix(s); return 'Os advogados derrubaram a denúncia em três semanas.'; } s.susp+=15; seitaFix(s); return 'Nem os advogados conseguiram. O caso segue.'; }
    if(k==='n'){ if(R.chance(.45+s.devo/250)){ s.devo+=5; seitaFix(s); return 'Os fiéis acreditaram em mim e lotaram o culto em protesto.'; } s.susp+=12; s.fieis=Math.round(s.fieis*.9); seitaFix(s); return 'Ninguém fora do grupo acreditou.'; }
    if(k==='p'){ m.karma=clamp(m.karma-12); if(R.chance(.55)){ return 'O denunciante retirou a queixa. Não pergunte como.'; } s.susp+=25; seitaFix(s); arrest('coação no curso do processo',1,4); return 'A pressão virou outra denúncia, e essa colou.'; }
    s.caixa=Math.round(s.caixa*.6); s.susp=Math.max(0,s.susp-10); seitaFix(s); return 'Pagamos uma indenização. O caso foi encerrado sem barulho.'; }};
EVENTS.seita_lider_pede={show:()=>{ const s=seita(); return {k:'Religião',t:'Um pedido do líder',x:`${s?s.lider:'O líder'} chamou você em particular e pediu ${R.pick(['para assinar uma procuração "só por segurança"','que você vigie um fiel que anda questionando demais','que você doe o seu carro para o ministério','que você esconda umas caixas na sua casa'])}.`,ch:[['Obedecer','o'],['Recusar com jeito','r'],['Gravar a conversa','g']]}; },
  pick:k=>{ const m=S.me, s=seita(); if(!s||!s.membro) return '';
    if(k==='o'){ s.xp+=4; s.fe=clamp(s.fe+5); m.karma=clamp(m.karma-4); if(R.chance(.3)){ m.money=Math.round(m.money*.8); return 'Obedeci. Semanas depois, percebi que perdi uma boa parte do meu dinheiro.'; } return 'Obedeci sem perguntar. O líder me olhou com aprovação.'; }
    if(k==='r'){ s.xp=Math.max(0,s.xp-3); return 'Recusei com educação. O clima esfriou.'; }
    s.prova=1; return 'Gravei tudo. Agora tenho uma carta na manga.'; }};
extTok=(o=>function(tok,d,out){ const s=S.me&&S.me.seita; let mm;
  if(mm=tok.match(/^(sxp|fe)([+-]\d+)$/)){ if(s&&s.membro){ if(mm[1]==='sxp') s.xp=Math.max(0,(s.xp||0)+ +mm[2]); else s.fe=clamp((s.fe||50)+ +mm[2]); } return true; }
  if(tok==='scargo'){ if(s&&s.membro&&s.cargo<SEITA_CARGOS.length-1){ s.cargo++; s.xp=0; out.push(`Agora sou ${sCargo(s).toLowerCase()}.`); } return true; }
  if(tok==='srebaixa'){ if(s&&s.membro&&s.cargo>0){ s.cargo--; out.push(`Fui rebaixad${oa()} a ${sCargo(s).toLowerCase()}.`); } return true; }
  if(tok==='ssai'){ if(s){ S.me.seita=null; out.push(`Saí de ${s.n}.`); } return true; }
  if(tok==='denuncia'){ if(s&&!s.membro) queue('seita_denuncia',{}); return true; }
  return o(tok,d,out); })(extTok);
extVar=(o=>k=>{ const s=S.me&&S.me.seita; if(k==='lider') return s&&s.lider?s.lider:'o líder'; if(k==='cargo') return s?sCargo(s).toLowerCase():'fiel'; if(k==='dominio') return s&&s.dom&&s.dom.length?s.dom[s.dom.length-1]:'o bairro'; return o(k); })(extVar);
extChance=(o=>function(key){ const s=S.me&&S.me.seita; if(key==='fe') return s&&s.fe!=null?s.fe:50; return o(key); })(extChance);
// atalhos para os eventos
const SL=f=>m=>!!m.seita&&!m.seita.membro&&!m.prison&&f(m.seita,m), SM2=f=>m=>!!m.seita&&!!m.seita.membro&&!m.prison&&f(m.seita,m);
// ---------- fé dos seguidores: cultos, discursos, livros e milagres; fé baixa vira revolta (e pode matar) ----------
seitaAcao=(o=>function(k){ const m=S.me, s=seita(); if(!s||s.membro) return o(k); if(!['discurso','livro','milagre','festa'].includes(k)) return o(k);
  if(use('seita_'+k)>(k==='livro'?1:2)) return k==='livro'?'Um livro por ano já é muito.':'Já fiz muito disso este ano.'; let t='';
  if(k==='discurso'){ const v=Math.round(R.int(3,8)+m.smarts/25+m.looks/40+(m.talent.acting||0)/30); s.devo+=v; t=R.pick([`Falei por duas horas sem papel. No final, ninguém respirava. Fé +${v}.`,`Fiz um discurso sobre sacrifício e recompensa. Os fiéis saíram chorando. Fé +${v}.`,`Gaguejei no começo, mas terminei com todo mundo de pé. Fé +${v}.`]); }
  if(k==='livro'){ const q=(m.talent.writing||20)+m.smarts/2; const v=Math.round(8+q/8); s.devo+=v; const din=Math.round(s.fieis*R.int(10,40)); s.caixa+=din; s.livros=(s.livros||0)+1; m.talent.writing=clamp((m.talent.writing||0)+R.int(1,4)); t=`Escrevi "${R.pick(['O Caminho da Luz','Revelações da Última Hora','As Sete Verdades','Cartas aos Escolhidos','O Livro da Colheita','Sussurros do Além'])}"${s.livros>1?` (volume ${s.livros})`:''}. Os fiéis compraram e decoraram: fé +${v}, ${fmt(din)} para o caixa.`; }
  if(k==='milagre'){ if(R.chance(.7-s.susp/300)){ const v=R.int(15,25); s.devo+=v; s.fama+=6; s.fieis+=R.int(5,40); t=R.pick([`Uma "cadeirante" se levantou no meio do culto. Fé +${v}. A atriz custou caro.`,`A imagem do altar "chorou" óleo. Fé +${v}. Ninguém viu a seringa.`,`"Curei" um cego na frente de todos. Fé +${v}. Ele enxergava muito bem.`]); }
    else { s.devo-=15; s.susp+=20; s.fieis=Math.round(s.fieis*.85); m.karma=clamp(m.karma-8); t='O milagre foi desmascarado: alguém filmou a farsa e postou. Fé despencou.'; } }
  if(k==='festa'){ const c=Math.min(s.caixa,Math.max(3000,s.fieis*30)); s.caixa-=c; s.devo+=R.int(6,12); st('happy',4); t=`Festa da colheita com comida, música e testemunhos. Gastamos ${fmt(c)} do caixa. A fé subiu.`; }
  seitaFix(s); return t; })(seitaAcao);
seitaAno=(o=>function(){ const s=seita(); const r=o.apply(this,arguments); const s2=seita(); if(!s2||s2.membro||!S.me.alive) return r;
  s2.devo=clamp(s2.devo-R.int(1,4)-Math.round(s2.fieis/3000)); // grupo grande esfria mais rápido
  if(s2.devo<20&&s2.fieis>=5&&R.chance(.35+(20-s2.devo)/40)) queue('seita_revolta',{});
  return r; })(seitaAno);
V.seita=(o=>()=>{ const r=o(); const s=seita(); if(!s||s.membro) return r;
  const i=r.items.findIndex(x=>x.sec==='Liderar'); const add=[{sec:'Manter a fé'}];
  if(s.devo<30) add.push({html:`<div class="card" style="border-color:#E5484D"><p style="color:#E5484D"><b>A fé está baixa (${s.devo}%).</b> Fiéis sem fé se revoltam, e uma revolta pode terminar com você mort${oa()}.</p></div>`});
  const A=(k,ic,l,sub)=>add.push({ic,l,s:sub,on:()=>act(()=>seitaAcao(k),l)});
  A('discurso','🎤','Fazer um discurso inflamado','Fé · inteligência e carisma ajudam'); A('livro','📖','Escrever um livro sagrado','Muita fé e dinheiro · 1 por ano'); A('milagre','✨','Encenar um milagre','Fé enorme · pode ser desmascarado'); A('festa','🎉','Fazer uma festa para os fiéis','Fé · gasta o caixa');
  r.items.splice(i>=0?i:1,0,...add); return r; })(V.seita);
EVENTS.seita_revolta={show:()=>{ const s=seita(); return {k:'Religião',t:'Os fiéis se revoltaram',x:`A fé em ${s?s.n:'o grupo'} chegou ao fundo do poço. Uma multidão de fiéis furiosos cercou o templo gritando que você é uma fraude. Alguns têm paus e pedras. Outros, coisa pior.`,ch:[['Sair e falar com eles','f'],['Prometer um milagre para amanhã','m'],['Chamar os seguranças','s'],['Fugir pelos fundos','e']]}; },
  pick:k=>{ const m=S.me, s=seita(); if(!s) return ''; const morte=()=>{ seitaFim('Os fiéis se voltaram contra a liderança.'); die(`assassinad${oa()} pelos próprios seguidores`); return 'A multidão invadiu o templo.'; };
    if(k==='f'){ if(R.chance(.3+m.smarts/250+(m.talent.acting||0)/250)){ s.devo=45; seitaFix(s); return 'Subi no carro de som e falei como nunca. Aos poucos, as pedras caíram no chão. Alguns choraram e pediram perdão.'; } return R.chance(.5)?morte():(st('health',-R.int(25,45)),s.fieis=Math.round(s.fieis*.5),s.devo=25,seitaFix(s),'Me arrastaram pelos cabelos. Escapei por milagre, de verdade, com costelas quebradas.'); }
    if(k==='m'){ s.devo=35; s.profecia=S.year+1; seitaFix(s); return 'Prometi um milagre. Eles foram embora, mas voltam no ano que vem para cobrar.'; }
    if(k==='s'){ if(R.chance(.5)){ s.fieis=Math.round(s.fieis*.6); s.susp+=20; m.karma=clamp(m.karma-10); seitaFix(s); return 'Os seguranças dispersaram a multidão na base da porrada. O grupo encolheu, e a polícia quer saber o que houve.'; } return R.chance(.6)?morte():(st('health',-30),seitaFim('Os fiéis tomaram o templo.')); }
    if(R.chance(.7)){ const v=Math.round(s.caixa*.5); m.money+=v; seitaFim('Fugi com metade do caixa.'); return `Fugi pela janela do banheiro com ${fmt(v)} numa mochila. Nunca mais volto àquela cidade.`; } return morte(); }};
