// ===== Pacotes de eventos coerentes com a situação do personagem =====
// pack(grupo, [[título, texto|[variações], [escolhas], opções?], ...])
// escolha: 'Rótulo|efeitos|texto'  ou  'Rótulo|?chance efeitos|texto se der certo|efeitos se der errado|texto se der errado'
// chance: ?60 (60%), ?sm (inteligência), ?lk, ?hl, ?h, ?k, ?perf, ?grade, ?fight, ?appr, ?pop, ?tal.acting ... com ajuste opcional: ?sm+10
// efeitos: h hl sm lk k f perf grade bond appr pop behav (+n/-n) · biz+n raise+n (em %) · $+n $-n $v $-v · add.alcool+n · tal.art+n
//          meet (vira amigo: {n}) · meet2 ({n2}) · meet:namoro / meet:colegaT / meet:inimigo
//          fire promo free breakup kill jail+n follow+n dis:id c:contador arrest:crime_com_underline:min:max
const jobIn=(...ids)=>m=>m.job&&!m.job.spc&&ids.includes(m.job.id);
const spcIs=id=>m=>m.job&&m.job.spc===id;
const studying=(...types)=>m=>m.edu.cur&&types.includes(m.edu.cur.type);
const courseIn=(...ids)=>m=>m.edu.cur&&m.edu.cur.type==='uni'&&ids.includes(m.edu.cur.id);
const WHO={
  partner:()=>partner(), sib:()=>R.pick(people('irmao')), parent:()=>R.pick(parents()), friend:()=>R.pick(people('amigo')),
  boss:()=>people('chefe')[0], colega:()=>R.pick(people('colegaT')), classmate:()=>R.pick(people('colega')), grandkid:()=>R.pick(people('neto')), pet:()=>R.pick(people('pet')),
  kid:()=>R.pick(kids()), baby:()=>R.pick(kids().filter(k=>k.age<=2)), child:()=>R.pick(kids().filter(k=>k.age>=3&&k.age<=12)), teen:()=>R.pick(kids().filter(k=>k.age>=13&&k.age<=17)), adultkid:()=>R.pick(kids().filter(k=>k.age>=18)),
  ex:()=>R.pick(people('ex')), spouse:()=>people('conjuge')[0],
};
function dslChance(tok){
  const mm=tok.match(/^\?([a-z]+(?:\.[a-z]+)?|\d+)([+-]\d+)?$/i); if(!mm) return .5;
  const m=S.me, key=mm[1], mod=+(mm[2]||0);
  if(typeof extChance==='function'){ const xv=extChance(key); if(xv!=null) return Math.max(.03,Math.min(.97,(xv+mod)/100)); }
  if(S.scen&&typeof scChance==='function'){ const sv=scChance(key); if(sv!=null) return Math.max(.03,Math.min(.97,(sv+mod)/100)); }
  let v= /^\d+$/.test(key)?+key : key==='sm'?m.smarts : key==='lk'?m.looks : key==='hl'?m.health : key==='h'?m.happy : key==='k'?m.karma : key==='fight'?m.fight
    : key==='perf'?(m.job?m.job.perf:50) : key==='grade'?(m.edu.cur?m.edu.cur.grade:50) : key==='appr'?(m.office?m.office.appr:50) : key==='pop'?(m.royal?m.royal.pop:50)
    : key.startsWith('tal.')?(m.talent[key.slice(4)]||30) : 50;
  return Math.max(.03,Math.min(.97,(v+mod)/100));
}
function dslApply(s,d){
  const m=S.me, out=[];
  for(const tok of String(s||'').trim().split(/\s+/).filter(Boolean)){
    let mm;
    if(S.scen&&typeof scTok==='function'&&scTok(tok,d,out)) continue;
    if(typeof extTok==='function'&&extTok(tok,d,out)) continue;
    if(mm=tok.match(/^(h|hl|sm|lk|k|f|perf|grade|bond|appr|pop|behav|biz|raise|jail|follow)([+-]\d+)$/)){ const n=+mm[2];
      switch(mm[1]){
        case 'h': st('happy',n); break; case 'hl': st('health',n); break; case 'sm': st('smarts',n); break; case 'lk': st('looks',n); break;
        case 'k': m.karma=clamp(m.karma+n); break; case 'f': m.fame=clamp(m.fame+n); break;
        case 'perf': if(m.job) m.job.perf=clamp(m.job.perf+n); break; case 'grade': if(m.edu.cur) m.edu.cur.grade=clamp(m.edu.cur.grade+n); break;
        case 'bond': { const p=d.pid&&P(d.pid); if(p) p.bond=clamp(p.bond+n); break; }
        case 'appr': if(m.office) m.office.appr=clamp(m.office.appr+n); break; case 'pop': if(m.royal) m.royal.pop=clamp(m.royal.pop+n); break;
        case 'behav': if(m.prison) m.prison.behav=clamp(m.prison.behav+n); break;
        case 'biz': if(m.biz) m.biz.value=Math.max(0,Math.round(m.biz.value*(1+n/100))); break;
        case 'raise': if(m.job) m.job.mul=(m.job.mul||1)*(1+n/100); break;
        case 'jail': if(m.prison){ m.prison.left=Math.max(1,m.prison.left+n); m.prison.total+=Math.max(0,n); } break;
        case 'follow': if(!m.social) m.social={f:0,u:'@'+m.first.toLowerCase()+R.int(10,99)}; m.social.f=Math.max(0,m.social.f+n); break;
      } }
    else if(mm=tok.match(/^\$([+-]?)(\d+|v2|v)$/)){ const v=mm[2]==='v'?d.v:mm[2]==='v2'?d.v2:+mm[2]; m.money+=mm[1]==='-'?-v:v; }
    else if(mm=tok.match(/^(add|tal)\.(\w+)([+-]\d+)$/)){ if(mm[1]==='add') m.add[mm[2]]=clamp((m.add[mm[2]]||0)+ +mm[3]*(1.3-m.will/100)); else m.talent[mm[2]]=clamp((m.talent[mm[2]]||0)+ +mm[3]); }
    else if(tok==='fire'){ if(m.job){ log(`Perdi o emprego de ${jobTitle(m.job).toLowerCase()}.`,'bad'); endJob(); } }
    else if(tok==='promo'){ const j=m.job; if(j){ const max=j.spc?SPECIAL[j.spc].l.length-1:JOBS.find(x=>x.id===j.id).l.length-1; if(j.lvl<max){ if(j.spc){ j.lvl++; out.push(`Agora sou ${jobTitle(j).toLowerCase()}!`); } else out.push(promote(j,'evento')); } } }
    else if(tok==='free'){ if(m.prison){ m.prison=null; st('happy',15); out.push('Estou livre!'); } }
    else if(tok==='breakup'){ const p=d.pid&&P(d.pid); if(p&&['namoro','noivo'].includes(p.rel)) p.rel='ex'; else if(p&&p.rel==='conjuge') divorce(p,true); }
    else if(mm=tok.match(/^meet(2)?(?::(\w+))?$/)){ meetP(d,mm[2]||'amigo',mm[1]?'n2':'n'); }
    else if(mm=tok.match(/^sc\.(\w+)([+-]\d+)$/)){ if(S.scen){ const k=mm[1]; S.scen[k]=Math.max(0,(S.scen[k]||0)+ +mm[2]); if(['sup','def','cure','comida','agua','abrigo','sos','o2','moral','pw','sec'].includes(k)) S.scen[k]=Math.min(100,S.scen[k]); if(k==='xp'&&typeof lvlUp==='function') lvlUp(); } }
    else if(tok==='kill'){ cnt('kills'); }
    else if(mm=tok.match(/^item:([^:]+):(\d+)$/)){ const n=mm[1]==='coisa'&&d.coisa?d.coisa.replace(/^(um|uma|uns|umas) /,''):mm[1].replace(/_/g,' '); m.assets.push({id:newId(),k:'item',n:n[0].toUpperCase()+n.slice(1),value:+mm[2],buy:0,cond:100}); }
    else if(tok==='petdie'||tok==='petgone'){ const p=d.pid&&P(d.pid); if(p&&p.alive){ p.alive=false; st('happy',tok==='petdie'?-10:-5); } }
    else if(tok==='pet'){ const p=addPet(R.pick(['Cachorro','Cachorro','Gato','Gato','Coelho','Calopsita'])); out.push(`Chama-se ${p.first}.`); }
    else if(mm=tok.match(/^dis:(\w+)$/)) addDisease(mm[1]);
    else if(mm=tok.match(/^c:(\w+)$/)) cnt(mm[1]);
    else if(mm=tok.match(/^arrest:([^:]+):(\d+):(\d+)$/)) arrest(mm[1].replace(/_/g,' '),+mm[2],+mm[3]);
  }
  return out.join(' ');
}
function dslChoice(c,d){
  const parts=c.split('|'); const label=parts[0];
  let fx1=parts[1]||'', t1=parts[2]||'', fx2=parts[3], t2=parts[4];
  // efeitos antes do "?chance" valem sempre (ex.: o custo); os de depois só se der certo
  const toks=fx1.trim().split(/\s+/); let chance=null, base='';
  const qi=toks.findIndex(t=>t.startsWith('?'));
  if(qi>=0){ chance=dslChance(toks[qi]); base=toks.slice(0,qi).join(' '); fx1=toks.slice(qi+1).join(' '); }
  const b=base?dslApply(base,d):'';
  if(chance!=null&&!R.chance(chance)){ const x=dslApply(fx2||'',d); return [tp(t2||'Não deu certo.',d),b,x].filter(Boolean).join(' '); }
  const x=dslApply(fx1,d); return [tp(t1,d),b,x].filter(Boolean).join(' ');
}
let PACKN=0;
function pack(gr,list){
  for(const e of list){
    const [title,text,choices,op={}]=e; const id='p'+(++PACKN);
    const o=Object.assign({},gr,op);
    EVENTS[id]={title,scen:o.scen,w:o.w??1.2,cd:o.cd??12,jail:o.jail,onceLife:o.once,
      when:m=>(o.min==null||m.age>=o.min)&&(o.max==null||m.age<=o.max)&&(!gr.when||gr.when(m))&&(!op.when||op.when(m))&&(!o.who||!!WHO[o.who]()),
      prep:m=>{ const v=o.v||[100,2000]; const d=Object.assign(strangers(m,o),{v:amt(v[0],v[1]),v2:amt(v[0]*4,v[1]*4),xi:R.int(0,(Array.isArray(text)?text.length:1)-1),
          co:m.job?m.job.co:m.biz?m.biz.n:'empresa',lugar:R.pick(TRIPS),coisa:R.pick(['um tênis caro','fones novos','um videogame','roupas','um celular usado','ingressos de show']),prod:R.pick(['refrigerante','perfume','carro','banco digital','sabão em pó','aplicativo de comida']),palavra2:R.pick(['Bom dia!','Cadê o café?','Gostosa!','Olha o ladrão!','Vai, Corinthians!','Para de gritar!','Alô?']),dieta:R.pick(['ovo','jejum','abacate','suco verde','sopa']),bico:R.pick(['pintura de parede','mudança','garçom num casamento','jardinagem','entregas']),invest:R.pick(['fazendas de gado','criptomoedas','imóveis no exterior','uma startup de energia']),festa:R.pick(['procissões e fogos','um festival de comida de rua','um desfile de carros alegóricos','música e dança na praça','o dia do padroeiro']),objeto:R.pick(['o sofá novo','um par de sapatos','o controle remoto','as almofadas','o carregador do celular']),curso2:R.pick(['padaria','eletricista','informática','corte e costura','marcenaria']),sonho:R.pick(['fazer faculdade','trabalhar com música','abrir uma oficina','ser cozinheir'+oa(),'voltar a jogar futebol']),materia:R.pick(['matemática','física','química','biologia','história','português','geografia']),prof:R.pick(['astronauta','veterinári'+oa(),'advogad'+oa(),'chef de cozinha','engenheir'+oa(),'músico','psicólog'+oa(),'piloto']),palavra:R.pick(['mamã','papá','água','não','bola','au-au','tchau','biscoito']),assunto:R.pick(['trabalho','casamento','dinheiro','mudar de cidade','ter filhos','abrir um negócio']),hobby:R.pick(['culinária japonesa','fotografia','marcenaria','dança de salão','canto','pintura em aquarela','programação']),hobby2:R.pick(['fazer crochê','jogar tênis','cuidar de orquídeas','pescar','aprender piano','fazer trilhas']),comida:R.pick(['torresmo','feijoada','doce','sal','fritura','pão francês']),ocorrencia:R.pick(['incêndio num prédio','assalto a banco','acidente na rodovia','briga generalizada num estádio','pessoa presa num elevador']),job:m.job?jobTitle(m.job).toLowerCase():'',curso:m.edu.cur?m.edu.cur.n:'',city:m.city,pais:countryOf(m.country).n,biz:m.biz?m.biz.n:''});
        if(o.fant&&typeof fantNames==='function') Object.assign(d,fantNames());
        if(o.crew){ const all=typeof crew==='function'?crew():[], cs=o.crew==='par'?all.filter(c=>c.par):o.crew==='sol'?all.filter(c=>typeof romOK==='function'&&romOK(c)&&!c.par):all.filter(c=>!c.bebe&&!c.bicho); if(!cs.length) return null; const c=R.pick(cs); d.c=c.first; d.co=c.gender==='F'?'a':'o'; d.celn=c.gender==='F'?'ela':'ele'; d.cid=c.id; }
        if(o.who){ const p=WHO[o.who](); if(!p) return null; d.pid=p.id; d.p=p.first; d.ele=p.gender==='F'?'ela':'ele'; d.o2=p.gender==='F'?'a':'o'; d.idade=p.age; }
        return d; },
      show:d=>({k:o.k,t:tp(title,d),x:tp(Array.isArray(text)?text[d.xi]:text,d),ch:choices.map((c,i)=>[tp(c.split('|')[0],d),String(i)])}),
      pick:(key,d)=>dslChoice(choices[+key],d)};
  }
}
