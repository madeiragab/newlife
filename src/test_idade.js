// Teste: nenhum evento mostra namoro, trabalho, direção, dinheiro, vício ou sexo antes da idade; bebês só veem coisas de bebê
function idadeCoerenteSelfTest(){ const s0=S,rf=R.f,ns=window.NO_SAVE,nn=window.NO_NEWS,meta=JSON.stringify(META),snaps=SNAPS,erros=[],info={vistos:0};window.NO_SAVE=true;window.NO_NEWS=true;
  let x=4040; R.f=()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; };
  try{
    for(const idade of [1,2,3,5,8,11,13,15]){ newLife({country:'BR'}); const m=S.me; m.age=idade; m.born=S.year-idade; m.prison=null; if(idade>=6) startSchool(idade<15?'fund':'medio');
      const amigo=mkPerson({rel:'amigo',age:Math.max(1,idade),bond:60}); S.people.push(amigo);
      // conversa puxada por pessoas próximas
      ok1(idade>=6||!evValid({id:'npc_conversa',d:{pid:amigo.id,tipo:'convite',ano:S.year}}),'"Vamos nos encontrar?" aos '+idade);
      ok1(idade>=16||!evValid({id:'npc_conversa',d:{pid:amigo.id,tipo:'oportunidade',ano:S.year}}),'indicação de emprego aos '+idade);
      for(const [id,ev] of Object.entries(EVENTS)){ if(ev.scen||id.startsWith('cad_')) continue; if(!ev.w&&!ev.prep) continue; let pode=false; try{ pode=!ev.when||ev.when(m); }catch(e){} if(!pode||!!ev.jail!==!!m.prison) continue;
        let d,sh; try{ d=ev.prep?ev.prep(m):{}; if(d==null) continue; if(!evValid({id,d})) continue; sh=ev.show(d); }catch(e){ continue; } if(!sh||!sh.ch) continue; info.vistos++;
        const txt=String(sh.t||'')+' '+String(sh.x||''); const min=idadeMinTexto(txt,m); ok1(min<=idade,`aos ${idade}: "${sh.t}" (${id}) fala de tema para ${min}+`);
        sh.ch.forEach(c=>ok1(idadeMinTexto(String(c[0]),m)<=idade||sh.ch.filter(q=>idadeMinTexto(String(q[0]),m)<=idade).length<2,`aos ${idade}: escolha "${c[0]}" em "${sh.t}"`));
        if(idade<3) ok1(!sh.k||IDADE_KINDS_BEBE.has(sh.k),`bebê de ${idade} vendo "${sh.t}" (${sh.k})`); } }
  }catch(e){ erros.push('erro: '+e.message+' '+(e.stack||'').split('\n')[1]); }
  finally{ S=s0; R.f=rf; window.NO_SAVE=ns; window.NO_NEWS=nn; META=JSON.parse(meta); SNAPS=snaps; }
  function ok1(c,t){ if(!c&&erros.length<40) erros.push(t); }
  if(erros.length) throw Error('Idade · '+erros.slice(0,10).join(' | ')); return info; }
