// Cenários automatizados e controlados: não representam sessões humanas completas.
// A sobrevivência do herdeiro e o momento da morte são controlados para exercitar
// três sucessões em cada estilo; os orçamentos e trajetórias usam as regras reais.
function evolucaoGeracoesSelfTest(){
 const anterior=S,meta=JSON.stringify(META),snaps=SNAPS,nomes=USED_NAMES,rand=R.f,chance=R.chance,norm=R.norm,
  noSave=window.NO_SAVE,noNews=window.NO_NEWS,rows=[];
 window.NO_SAVE=true;window.NO_NEWS=true;
 let seed=0,contexto='',verificacoes=0;
 const ok=(v,t)=>{verificacoes++;if(!v)throw Error('Gerações '+contexto+' · '+t);};
 const clone=x=>JSON.parse(JSON.stringify(x));
 const salvar=()=>{S=clone(S);fixSave(S);const uma=JSON.stringify(S);fixSave(S);ok(JSON.stringify(S)===uma,'migração repetida alterou o save');npcAuditar(S);};
 try{
  for(const [estilo,semente] of [['comum',17401],['empresarial',17402],['familiar',17403],['criminosa',17404]]){
   seed=semente;R.f=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
   USED_NAMES=new Set();META.usedNames=[];
   contexto=estilo+' seed '+semente;newLife({country:'BR',year:2000});S.scen=null;
   S.me.age=30;S.me.born=S.year-30;S.me.money=2000000;
   const amigo=mkPerson({rel:'amigo',age:29,bond:85,money:30000});S.people.push(amigo);
   npcVida(amigo).apoio={ano:S.year,tipo:'escuta'};const amigoId=amigo.id;
   // Imóvel realmente comprado, com contrato real de financiamento.
   S.me.ret={pension:18000};const oferta=houseListings()[0];buy('casa',oferta,true);S.me.ret=null;
   ok(S.me.assets.length===1&&S.me.assets[0].loan>0,'compra financiada não aconteceu');
   const aid=S.me.assets[0].id,contrato=clone(S.me.assets[0]);
   S.me.loans=[{n:'Contrato familiar persistente',bal:12000,pay:1200}];
   if(estilo==='empresarial')openBiz(BIZ_SECTORS[0],'Família '+semente);
   let anos=0,arquivos=0,operacoes=0,empresasHerdadas=0;
   const mortos=new Map();
   for(let geracao=0;geracao<3;geracao++){
    contexto=estilo+' seed '+semente+' geração '+(geracao+1);
    const idPai=S.me.id;
    const conjuge=mkPerson({rel:'conjuge',age:S.me.age,bond:90,money:10000});
    const antigoNamoro=mkPerson({rel:'namoro',age:S.me.age+1,bond:60});
    const herdeiro=mkPerson({rel:'filho',age:3,bond:95,money:1000,parentId:conjuge.id});
    S.people.push(conjuge,antigoNamoro,herdeiro);geracaoNormalizar(S);
    const filhoId=herdeiro.id,conjugeId=conjuge.id,namoroId=antigoNamoro.id;
    const anosAteMorte=63-S.me.age;ok(anosAteMorte>=25,'intervalo parental implausível');
    for(let ano=0;ano<anosAteMorte;ano++){
     S.year++;S.me.age++;S.me.yr={};anos++;
     // A mortalidade não é sorteada aqui: o foco é continuidade com três sucessões garantidas.
     for(const p of S.people.slice()){
      if(!p.alive)continue;p.age++;
      if(p.age>105&&p.id!==filhoId){p.alive=false;mortos.set(p.id,p.age);continue;}
      if(p.id===filhoId||p.id===conjugeId||p.id===namoroId)continue;
      npcTrajetoria(p);npcNegocioAno(p);
      const caixa=p.money,jogador=S.me.money,vida=JSON.stringify(p.vida);
      npcTrajetoria(p);npcNegocioAno(p);
      ok(p.money===caixa&&S.me.money===jogador&&JSON.stringify(p.vida)===vida,'repetir ano duplicou orçamento ou trajetória NPC');
      const f=p.vida?.financas;
      if(f?.ano===S.year){
       ok(Math.abs(f.saldo-(f.renda-tax(f.renda)+(f.abatimento||0)+(f.liquidacao||0)+(f.encerrado||0)-f.despesa-f.juros))<=1,'orçamento NPC não fecha');
      }
     }
     if(S.me.biz){empresaAno();operacoes++;const uma=JSON.stringify(S.me.biz),caixa=S.me.money;
      empresaAno();ok(JSON.stringify(S.me.biz)===uma&&S.me.money===caixa,'empresa operou duas vezes no mesmo ano');
      if(S.me.biz)ok(Number.isFinite(S.me.biz.value)&&S.me.biz.capital>=0&&S.me.biz.caixa>=0,'empresa perdeu integridade financeira');
     }
     for(const [id,idade] of mortos){const p=P(id);if(p){const uma=JSON.stringify(p);npcTrajetoria(p);npcNegocioAno(p);ok(p.age===idade&&JSON.stringify(p)===uma,'NPC falecido continuou sua trajetória');}}
     if(ano%10===0){salvar();arquivos++;}
     S.pending=[];
    }
    let k=P(filhoId),par=P(conjugeId);ok(k.alive&&k.age>=28&&k.age<=36,'herdeiro não chegou à idade adulta esperada');
    // O herdeiro tem sua própria união e filho antes de assumir o protagonismo.
    const parHerdeiro=mkPerson({rel:'conhecido',age:k.age,bond:90,country:k.country});S.people.push(parHerdeiro);
    ok(npcUnir(k,parHerdeiro),'união do herdeiro não foi criada');const bebe=npcFilho(k,parHerdeiro);
    ok(bebe&&bebe.parentIds.includes(k.id),'filho do herdeiro perdeu filiação');
    let responsavelId=null;if(estilo==='familiar'){
     const outro=mkPerson({rel:'conjuge',age:S.me.age,bond:80});S.people.push(outro);
     par.polyCom=[outro.id];outro.polyCom=[par.id];outro.enteados=[k.id];responsavelId=outro.id;
    }
    if(geracao===1){S.me.passport='ok';const pais=S.me.country==='BR'?'PT':'BR',rc=R.chance;
     try{R.chance=()=>true;emigrate(countryOf(pais));}finally{R.chance=rc;}
     ok(S.me.country===pais,'emigração controlada falhou');
     const casa=S.me.assets.find(a=>a.id===aid);ok(casa.country===contrato.country&&casa.loanRate===contrato.loanRate&&casa.pay===contrato.pay,'emigração reescreveu contrato de origem');
    }
    // Saúde real é persistida antes da morte controlada, sem transmitir a doença ao herdeiro.
    const doenca=DISEASES.gripe?'gripe':Object.keys(DISEASES).find(id=>DISEASES[id].cure==='auto');
    if(doenca)addDisease(doenca);
    if(estilo==='criminosa'){S.me.prison={yrs:3};S.me.rec.conv=2;S.me.office={id:'pres',appr:20,yrs:1};}
    S.me.money=geracao===1?-5000:120000+geracao*1000;k.money=geracao===1?-2000:3000;
    // Garanta também ao menos uma sucessão empresarial: negócios podem falir
    // legitimamente durante as décadas anteriores e isso não é falha do teste.
    if(estilo==='empresarial'&&geracao===0&&!S.me.biz){openBiz(BIZ_SECTORS[0],'Nova operação familiar');empresaPreparar(S.me.biz);}
    const saldo=S.me.money,caixaFilho=k.money,emprestimos=clone(S.me.loans),assets=clone(S.me.assets),inv=clone(S.me.inv);
    const causa='no cenário controlado de três gerações';die(causa);ok(!S.me.alive,'morte não encerrou a vida');
    const biz=S.me.biz?{n:S.me.biz.n,country:S.me.biz.country,value:S.me.biz.value}:null;
    const ids=new Set(S.people.map(p=>p.id));continueAs(k);
    ok(S.me.id===filhoId&&S.me.alive&&S.gen===geracao+2,'identidade ou número da geração incorreto');
    ok(S.me.money===Math.max(0,Math.round(saldo*.85))+Math.max(0,caixaFilho),'herança criou dinheiro ou apagou patrimônio pessoal');
    ok(!S.me.prison&&!S.me.office&&!S.me.dis.length,'herdeiro recebeu pena, mandato ou doença do falecido');
    ok(P(idPai)&&!P(idPai).alive&&['mae','pai'].includes(P(idPai).rel),'progenitor falecido perdido');
    ok(['mae','pai'].includes(P(conjugeId).rel)&&P(namoroId).rel==='conhecido','namoro antigo virou parentesco');
    if(responsavelId)ok(P(responsavelId)?.rel==='padrasto','responsável de família com vários casamentos perdeu seu vínculo');
    ok(P(parHerdeiro.id)?.rel==='conjuge'&&P(bebe.id)?.rel==='filho','família própria do herdeiro desapareceu');
    ok(JSON.stringify(S.me.assets)===JSON.stringify(assets)&&JSON.stringify(S.me.inv)===JSON.stringify(inv),'bens ou investimentos mudaram durante sucessão');
    for(const l of emprestimos)ok(S.me.loans.some(x=>x.n===l.n&&x.bal===l.bal&&x.pay===l.pay),'contrato de dívida desapareceu');
    if(saldo<0)ok(S.me.loans.some(x=>x.n==='Dívida do espólio'&&x.bal===4250),'dívida do espólio foi apagada');
    if(caixaFilho<0)ok(S.me.loans.some(x=>x.n==='Dívida pessoal anterior'&&x.bal===2000),'dívida pessoal do herdeiro foi apagada');
    if(biz){ok(S.me.biz?.n===biz.n&&S.me.biz.country===biz.country&&S.me.biz.value===biz.value,'empresa mudou de proprietário sem preservar os ativos');empresasHerdadas++;}
    for(const id of ids)if(id!==filhoId)ok(!!P(id),'pessoa desapareceu na sucessão: '+id);
    ok(P(amigoId)?.vida?.apoio?.ano===2000,'memória do amigo antigo reiniciada');
    ok(S.memoriaGeracoes.length===geracao+1,'arquivo de ancestrais perdido');
    salvar();arquivos++;
    const igual=JSON.stringify(S);continueAs(null);ok(JSON.stringify(S)===igual,'sucessão inválida alterou o estado');
   }
   ok(P(S.memoriaGeracoes[0].id)?.rel==='bisavo','parentesco após três sucessões incorreto');
   if(estilo==='empresarial')ok(empresasHerdadas>0,'sucessão empresarial não foi exercitada');
   rows.push({estilo,semente,tipo:'automatizado/controlado',sucessoes:3,anos,operacoesEmpresariais:operacoes,empresasHerdadas,saves:arquivos,pessoas:S.people.length});
  }
  return {cenarios:rows,verificacoes};
 }finally{S=anterior;META=JSON.parse(meta);SNAPS=snaps;USED_NAMES=nomes;R.f=rand;R.chance=chance;R.norm=norm;window.NO_SAVE=noSave;window.NO_NEWS=noNews;}
}
