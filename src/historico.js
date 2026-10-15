// Histórico real do repositório; entradas anteriores ao changelog também são preservadas.
const NL_HISTORICO=[
  {
    "h": "8a6e4ea",
    "d": "2026-10-15",
    "t": "v1.18: quase 140 eventos em cadeia para lobisomens"
  },
  {
    "h": "870cc47",
    "d": "2026-10-15",
    "t": "v1.17: quase 150 eventos em cadeia para vampiros"
  },
  {
    "h": "4374cbc",
    "d": "2026-10-15",
    "t": "v1.16: quase 200 eventos paranormais em cadeia para qualquer pessoa"
  },
  {
    "h": "bc68b64",
    "d": "2026-10-15",
    "t": "v1.15.2: reações do grupo ao morrer ou desistir num mundo fictício"
  },
  {
    "h": "cde6dd9",
    "d": "2026-10-15",
    "t": "v1.15.1: opções da vida real não aparecem nos modos fictícios"
  },
  {
    "h": "ad8ce00",
    "d": "2026-10-15",
    "t": "v1.15: identidade e orientação, fertilidade, vários amores, tratamentos longos e empresas mais difíceis"
  },
  {
    "h": "323808f",
    "d": "2026-10-14",
    "t": "v1.14.1: economia mais equilibrada (custo de vida, cripto e ações)"
  },
  {
    "h": "eb0472d",
    "d": "2026-10-14",
    "t": "v1.14: traição, divórcio com guarda e pensão, sede e fome das criaturas"
  },
  {
    "h": "f5936b0",
    "d": "2026-10-14",
    "t": "v1.13: epidemia zumbi dinâmica e simulador de economia"
  },
  {
    "h": "a8b1aee",
    "d": "2026-10-14",
    "t": "v1.12.1: 800 etapas em 160 histórias em cadeia"
  },
  {
    "h": "3f91ac5",
    "d": "2026-10-14",
    "t": "v1.12: histórias em cadeia, saúde com sintomas e save mais seguro"
  },
  {
    "h": "a292379",
    "d": "2026-10-14",
    "t": "v1.11: IDs de eventos estáveis, teste que barra a publicação e rodinha de atualização"
  },
  {
    "h": "0543615",
    "d": "2026-10-14",
    "t": "Corrige o topo da tela inicial cortado em celulares de tela pequena"
  },
  {
    "h": "a4dd340",
    "d": "2026-10-14",
    "t": "v1.10: aventuras que chegam aos poucos e formação que vale"
  },
  {
    "h": "17dfa0d",
    "d": "2026-10-14",
    "t": "v1.9: empregos por faculdade, carro dos pais, comerciantes e consequências dos mundos"
  },
  {
    "h": "d2b4ea3",
    "d": "2026-10-14",
    "t": "v1.8: visual novo"
  },
  {
    "h": "75117ba",
    "d": "2026-10-14",
    "t": "v1.7: conquistas, selos novos e fazer amor"
  },
  {
    "h": "1d11ac8",
    "d": "2026-10-14",
    "t": "v1.6.2: tela de atualização com anel de progresso e música"
  },
  {
    "h": "4744a25",
    "d": "2026-10-14",
    "t": "v1.6.1: novidades depois de cada atualização"
  },
  {
    "h": "ac3cc8f",
    "d": "2026-10-14",
    "t": "v1.6: atualização automática nos apps"
  },
  {
    "h": "8f10a88",
    "d": "2026-10-14",
    "t": "v1.5.4: mais 300 eventos com os membros"
  },
  {
    "h": "fc3e391",
    "d": "2026-10-14",
    "t": "v1.5.3: eventos com os membros das equipes"
  },
  {
    "h": "f2ca833",
    "d": "2026-10-14",
    "t": "v1.5.2: membros aleatórios em tudo"
  },
  {
    "h": "acd506d",
    "d": "2026-10-13",
    "t": "v1.5.1: membros da equipe no trabalho"
  },
  {
    "h": "e124a6d",
    "d": "2026-10-13",
    "t": "v1.5: 200 eventos por sistema, seita com cargos e fé, equipes com membros"
  },
  {
    "h": "0d2e1c4",
    "d": "2026-10-13",
    "t": "v1.4: seita, polícia, golpe de Estado, paranormal e reações ao desistir"
  },
  {
    "h": "0afae67",
    "d": "2026-10-13",
    "t": "v1.3: romance nos modos, vida de herói por ano e rostos por gênero"
  },
  {
    "h": "cc81eee",
    "d": "2026-10-13",
    "t": "publish-web: acentos corretos no PowerShell 5"
  },
  {
    "h": "8160f74",
    "d": "2026-10-13",
    "t": "Pesadelo zumbi sem fim, morte real no isekai e eventos com efeito de verdade"
  },
  {
    "h": "0ae5a54",
    "d": "2026-10-13",
    "t": "publish-web: mensagem de commit com acentos corretos"
  },
  {
    "h": "981161c",
    "d": "2026-10-13",
    "t": "Ignora arquivos gerados pelo build"
  },
  {
    "h": "82a166a",
    "d": "2026-10-13",
    "t": "Modos fictícios refeitos como aventuras em dias"
  },
  {
    "h": "2cb96fa",
    "d": "2026-10-13",
    "t": "Links para jogar no navegador e baixar a release; script para publicar a versão web"
  },
  {
    "h": "de8e932",
    "d": "2026-10-13",
    "t": "NewLife: simulador de vida para Windows e Android"
  }
];

V.historico=(pagina=0)=>()=>{ const total=Math.ceil(NL_HISTORICO.length/12),p=Math.max(0,Math.min(total-1,pagina)); return {title:'Histórico desde o início',items:[{html:'Registros originais do desenvolvimento, do primeiro commit até a versão 1.18. As novidades da 1.19 estão na tela anterior. Datas e descrições preservadas do Git.'},{btns:[{l:'Mais recentes',dis:p===0,on:()=>{ UI.back(); UI.push(V.historico(p-1)); }},{l:'Desde o início',dis:p===total-1,on:()=>{ UI.back(); UI.push(V.historico(total-1)); }}]},...NL_HISTORICO.slice(p*12,p*12+12).map(e=>({html:'<div class="card"><p>'+esc(e.t)+'</p><small>'+esc(e.d)+' · '+esc(e.h)+'</small></div>'})),{html:'Página '+(p+1)+' de '+total},{btns:[{l:'Anteriores',dis:p===total-1,on:()=>{ UI.back(); UI.push(V.historico(p+1)); }},{l:'Posteriores',dis:p===0,on:()=>{ UI.back(); UI.push(V.historico(p-1)); }}]}]}; };
V.novidades=(o=>()=>{ const r=o(); r.items.unshift({ic:'📜',l:'Ver histórico desde o início',s:NL_HISTORICO.length+' registros, incluindo versões antigas e correções',on:()=>UI.push(V.historico())}); return r; })(V.novidades);
