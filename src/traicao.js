// ===== Traição, noites fora, divórcio com guarda e pensão =====
// Noite fora (boate, boate adulta, bar): diversão, gasto e, para quem tem par, risco de ciúme e de começar um caso.
function noiteFora(tipo){ const m=S.me, p=pickPartner();
  if(use('noite')>2) return 'Já saí demais este ano. Meu fígado e meu bolso pediram pausa.';
  const custo={boate:250,adulta:600,bar:120}[tipo]; m.money-=custo;
  if(tipo==='adulta'){ cnt('boateAdulta'); st('happy',R.int(3,8)); if(p){ m.susp=(m.susp||0)+R.int(15,30); if(R.chance(.25)) queue('par_descobre_boate',{pid:p.id}); }
    return R.pick(['Luzes vermelhas, música alta e uma conta que eu preferia não ter visto.','Fui com os amigos numa boate adulta. Ninguém conta o que acontece lá dentro, e eu também não.','A noite foi cara e esquisita. Saí antes de os amigos terminarem a terceira rodada.']); }
  st('happy',R.int(4,9)); if(tipo==='bar') add_bebida();
  if(p&&R.chance(.22)&&!m.caso&&!cadState().on.caso_extra){ cadStart('caso_extra',true); const c=cadState().on.caso_extra; if(c){ c.due=m.age; queue(cadEv('caso_extra','a'),EVENTS[cadEv('caso_extra','a')].prep(m)); } return 'Na pista, alguém não tirou os olhos de mim a noite inteira.'; }
  if(!p&&R.chance(.3)){ return R.pick(['Dancei até os pés doerem e troquei telefone com alguém interessante.','Conheci gente nova na fila do banheiro. A noite rendeu.']); }
  return R.pick(['Dancei como se ninguém estivesse olhando. Todo mundo estava olhando.','Voltei para casa com o sol nascendo e o sapato na mão.','Conversei com um estranho sobre a vida por duas horas. Nunca soube o nome dele.']); }
function add_bebida(){ const m=S.me; m.add.alcool=clamp((m.add.alcool||0)+2*(1.3-m.will/100)); }
V.activities=(o=>()=>{ const r=o(); const m=S.me; if(!r||!r.items||m.prison||m.age<16||S.scen) return r;
  r.items.push({ic:'🪩',l:'Noite fora',s:'Boate, bar' + (m.age>=18?' ou boate adulta':''),on:()=>UI.push(()=>({title:'Noite fora',items:[
    {html:`<div class="card"><p>Diversão garantida. ${partners().length?'Mas quem tem par em casa pode arrumar encrenca.':'Quem sabe você conhece alguém.'}</p></div>`},
    {ic:'🪩',l:'Boate',s:fmt(250),on:()=>act(()=>noiteFora('boate'),'Boate')},
    {ic:'🍻',l:'Bar com os amigos',s:fmt(120),on:()=>act(()=>noiteFora('bar'),'Bar')},
    Object.assign({ic:'💋',l:'Boate adulta',s:fmt(600)+' · só maiores de 18',on:()=>act(()=>noiteFora('adulta'),'Boate adulta')},m.age<18?{dis:true,why:'Só depois dos 18.'}:{})]}))});
  return r; })(V.activities);
EVENTS.par_descobre_boate={show:d=>({k:'Amor',t:'A fatura do cartão',x:`${P(d.pid).first} viu na fatura do cartão o nome de uma boate adulta.`,ch:[['Contar a verdade','v'],['Inventar que foi uma despedida de solteiro de um amigo','m'],['Dizer que foi clonagem do cartão','c']]}),
  pick:(k,d)=>{ const p=P(d.pid); if(!p) return ''; const m=S.me;
    if(k==='v'){ p.bond=clamp(p.bond-12); m.susp=Math.max(0,(m.susp||0)-10); return `${p.first} ficou chatead${p.gender==='F'?'a':'o'}, mas valorizou a sinceridade. Dormi no sofá.`; }
    if(R.chance(k==='m'?.55:.3)){ p.bond=clamp(p.bond-3); return 'Colou. Por enquanto.'; }
    p.bond=clamp(p.bond-25); m.susp=(m.susp||0)+20; if(p.bond<15&&R.chance(.5)){ if(p.rel==='conjuge') divorce(p,true); else p.rel='ex'; return `${p.first} descobriu a mentira e foi embora.`; } return 'A mentira não colou. A briga durou a semana inteira.'; }};
// caso secreto: quanto mais tempo, maior a chance de ser descoberto
yearMoney=(o=>function(){ const r=o.apply(this,arguments); const m=S.me; try{ if(m.alive&&!S.scen){
  const p=pickPartner();
  if(m.caso&&p){ m.susp=(m.susp||0)+R.int(10,25); if(R.chance(Math.min(.8,m.susp/120))&&!S.pending.some(e=>e.id==='caso_descoberto')) queue('caso_descoberto',{pid:p.id}); }
  else if(m.caso&&!p) m.caso=null;
  if(m.susp>0&&!m.caso) m.susp=Math.max(0,m.susp-8);
  // pensão dos filhos
  if(m.pensao){ const ks=m.pensao.kids.map(P).filter(k=>k&&k.alive&&k.age<18);
    if(!ks.length){ log('Meus filhos fizeram 18 anos. A pensão acabou.','good'); m.pensao=null; }
    else { const v=m.pensao.valor*ks.length; if(m.pensao.paga){ m.money-=v; if(R.chance(.3)) log(`Paguei ${fmt(v)} de pensão este ano.`); } else { m.money+=v; if(R.chance(.3)) log(`Recebi ${fmt(v)} de pensão para as crianças.`); }
      if(m.pensao.paga) ks.forEach(k=>k.bond=clamp(k.bond-R.int(0,4))); } }
  } }catch(e){ console.error(e); } return r; })(yearMoney);
EVENTS.caso_descoberto={show:d=>({k:'Amor',t:'Descobriu tudo',x:`${P(d.pid).first} achou as mensagens. Sabe de tudo sobre ${S.me.caso&&S.me.caso.n?S.me.caso.n:'o meu caso'}.`,ch:[['Pedir perdão de joelhos','p'],['Negar até o fim','n'],['Assumir e ir embora','a']]}),
  pick:(k,d)=>{ const m=S.me, p=P(d.pid); if(!p||!p.alive) return ''; cnt('traicoes'); m.susp=0;
    const sai=()=>{ if(p.rel==='conjuge') divorce(p,true); else { p.rel='ex'; st('happy',-15); } };
    if(k==='p'){ if(R.chance(p.bond/140)){ m.caso=null; p.bond=clamp(p.bond-30); st('happy',-6); return `${p.first} chorou muito, mas decidiu me dar mais uma chance. Terminei o caso no mesmo dia.`; } m.caso=null; sai(); return `${p.first} não perdoou. Colocou minhas coisas na calçada.`; }
    if(k==='n'){ if(R.chance(.2)){ p.bond=clamp(p.bond-15); return 'Neguei tudo com uma cara de pau que eu não sabia que tinha. Ficou a dúvida.'; } m.caso=null; sai(); m.karma=clamp(m.karma-5); return `As provas eram claras demais. ${p.first} foi embora e contou para a família inteira.`; }
    sai(); m.caso=null; return 'Assumi. Acabou ali, na cozinha, com uma frase.'; }};
// divórcio com filhos menores: briga pela guarda e pensão
divorce=(o=>function(p,theyAsked){ const r=o.apply(this,arguments); const m=S.me; try{
  const ks=kids().filter(k=>k.age<18&&k.alive&&(k.parentId===p.id||!k.parentId));
  if(ks.length&&!m.pensao) queue('guarda',{pid:p.id,kids:ks.map(k=>k.id)}); }catch(e){} return r; })(divorce);
EVENTS.guarda={show:d=>({k:'Família',t:'A guarda das crianças',x:`O divórcio com ${P(d.pid).first} foi parar na justiça. Quem fica com ${d.kids.length>1?'as crianças':'a criança'}?`,ch:[['Lutar pela guarda na justiça ($10.000 de advogado)','l'],['Propor guarda compartilhada','c'],['Deixar com '+P(d.pid).first+' e pagar pensão','e']]}),
  pick:(k,d)=>{ const m=S.me, p=P(d.pid), ks=d.kids.map(P).filter(Boolean); const sal=m.job?jobSalary(m.job):20000; const valor=Math.max(3000,Math.round(sal*.12));
    if(k==='l'){ m.money-=10000; const ch=.35+(m.karma-50)/200+(m.money>0?.1:-.1)+(m.caso||m.c.traicoes?-.15:0)+(m.add.alcool>50?-.2:0);
      if(R.chance(Math.max(.08,Math.min(.85,ch)))){ m.pensao={paga:false,valor,kids:ks.map(k=>k.id)}; ks.forEach(k=>k.bond=clamp(k.bond+8)); st('happy',8); return `Ganhei a guarda! ${p?p.first:'O outro lado'} vai pagar pensão.`; }
      m.pensao={paga:true,valor:Math.round(valor*1.2),kids:ks.map(k=>k.id)}; st('happy',-12); return `O juiz deu a guarda para ${p?p.first:'o outro lado'}. Vou pagar pensão e só vejo as crianças a cada quinze dias.`; }
    if(k==='c'){ m.pensao={paga:true,valor:Math.round(valor*.5),kids:ks.map(k=>k.id)}; ks.forEach(k=>k.bond=clamp(k.bond+3)); return 'Guarda compartilhada: uma semana comigo, outra lá. Pensão menor, ninguém sai perdendo tanto.'; }
    m.pensao={paga:true,valor,kids:ks.map(k=>k.id)}; ks.forEach(k=>k.bond=clamp(k.bond-10)); st('happy',-8); return `As crianças ficaram com ${p?p.first:'o outro lado'}. Pago pensão todo mês.`; }};
// histórias da traição (as duas mãos)
chain('caso_extra',{k:'Amor',min:18,max:70,npc:1,date:1,when:m=>!!partners().length&&!m.caso,w:.6,gap:[1,1]},{
 a:['Olhares','{p} começou a puxar conversa comigo sempre que pode. Eu sei onde isso pode dar.',['Cortar logo|k+4 pbond+3|Falei que tenho alguém em casa. {p} entendeu.','Deixar rolar|>b@0|Só uma conversa. Por enquanto.']],
 b:['O primeiro passo','Uma noite, depois de umas bebidas, {p} me beijou.',['Afastar e ir embora|k+2|Fui para casa com o coração disparado e a culpa no bolso.','Corresponder|k-8 caso+ h+6 >c|Comecei um caso.']],
 c:['A vida dupla','Mensagens apagadas, desculpas no trabalho, encontros escondidos.',['Terminar o caso|caso- k+3 h-4 >e|Disse para {p} que acabou. Doeu nos dois.','Continuar|h+4 k-4 >d|Mais um mês. Só mais um.']],
 d:['{p} quer mais','{p} quer que eu largue tudo para ficar com {ele}.',['Largar meu par e ficar com {p}|caso- separar vira:namoro h+4|Saí de casa com duas malas. Ninguém saiu inteiro dessa.','Terminar com {p}|caso- h-6 vira:inimigo >e|{p} ficou furios{o2} e ameaçou contar tudo.','Enrolar mais um pouco|k-3 >d@1|Promessas que eu não sei se vou cumprir.']],
 e:['O peso','O caso acabou, mas a culpa ficou.',['Confessar ao meu par|?bond k+5 pbond-25 h-6|Contei tudo. {p} não sabe, mas meu par me deu uma chance.|separar h-12|Contei tudo e fui deixad{o}.','Guardar para sempre|h-5|Algumas coisas a gente leva para o túmulo.']],
});
chain('traicao_parceiro',{k:'Amor',min:20,max:75,who:'partnerUnhappy',when:m=>{ const p=pickPartner(p=>p.bond<55); return !!p&&p.bond<55; },gap:[1,1]},{
 a:['Algo estranho','{p} anda escondendo o celular e chegando tarde com desculpas esquisitas.',['Perguntar diretamente|>b|{p} desconversou.','Investigar escondido|>c|Esperei {ele} dormir.','Confiar|pbond+3|Prefiro não pensar besteira.']],
 b:['A desconfiança','A desconfiança está me consumindo.',['Pedir para ver o celular|?50 >c|{p} entregou o celular tremendo.|pbond-8 >d|{p} se ofendeu e saiu batendo a porta.','Propor terapia de casal|$-1200 ?bond pbond+10|A terapia mostrou que era só uma fase ruim.|>c|Na terapia, a verdade apareceu.']],
 c:['A verdade','{p} estava tendo um caso.',['Terminar na hora|separar h-15 k+2|Peguei minhas coisas naquela noite.','Tentar perdoar|?bond pbond-15 h-8 >e|Decidimos tentar de novo. Vai levar tempo.|separar h-15|Tentamos, mas a confiança não voltou.','Dar o troco|k-8 >d|Se {ele} pode, eu também posso.']],
 d:['A guerra','O casamento virou uma guerra fria dentro de casa.',['Pedir o divórcio|separar h-10|Acabou. O advogado já está ligando.','Ficar pelas crianças|h-10 pbond-5 >e@2|Dois estranhos dividindo uma casa.']],
 e:['Reconstruir','Um ano depois, a gente ainda tenta.',['Seguir juntos|?bond pbond+15 h+8|Aos poucos, a gente voltou a rir junto.|separar h-8|Não deu. Pelo menos tentamos.','Desistir|separar h-6|Às vezes amar é saber a hora de ir.']],
});
