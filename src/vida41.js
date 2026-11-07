let bem41Ano = null;

function bem41Medir(nome, agir) {
  const a = bem41Ano;
  if (!a || S.me !== a.m) return agir();
  const { health, happy } = a.m;
  const anteriores = a.registrado.slice();
  const r = agir();
  const dh = a.m.health - health - (a.registrado[0] - anteriores[0]);
  const df = a.m.happy - happy - (a.registrado[1] - anteriores[1]);
  if (Math.abs(dh) > 0.001 || Math.abs(df) > 0.001) {
    a.itens.push({ nome, dh, df });
    a.registrado[0] += dh;
    a.registrado[1] += df;
  }
  return r;
}

function bem41Humor(m) {
  const apoio = apoioSocial();
  const contato = S.people.some(
    (p) =>
      p.alive &&
      p.rel !== "inimigo" &&
      p.bond >= 35 &&
      p.vida?.contato >= S.year - 1,
  );
  const rotina = m.rotinaBem?.ano === S.year ? m.rotinaBem.felicidade : 0;
  const fatores = [
    ["Estabilidade financeira", m.money > 1e5 ? 6 : m.money < 0 ? -12 : 0],
    ["Relacionamento", partners().length ? 6 : 0],
    [
      "Trabalho, estudos ou aposentadoria",
      m.job || m.edu.cur || m.ret ? 4 : m.age >= 18 ? -6 : 0,
    ],
    ["Tempo na prisão", m.prison ? -28 : 0],
    ["Condições de saúde", -m.dis.reduce((n, d) => n + (d.ctrl ? 1 : 3), 0)],
    [
      contato ? "Convivência recente" : "Falta de contato recente",
      contato ? 3 + apoio : m.age >= 18 && !m.prison ? -7 : 0,
    ],
    ["Rotina de descanso e lazer", rotina * 2],
  ];
  const base = 61 + (m.karma - 50) / 10;
  const alvo = clamp(base + fatores.reduce((n, [, v]) => n + v, 0));
  const taxa = m.happy > alvo && (rotina || contato) ? 0.1 : 0.2;
  bem41Medir("Oscilações do bem-estar", () => {
    m.happy = clamp(m.happy + (alvo - m.happy) * taxa + R.int(-3, 3));
  });
  if (bem41Ano?.m === m)
    bem41Ano.fatores = fatores
      .filter(([, v]) => v)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
}

for (const [nome, obter, atribuir] of [
  [
    "Envelhecimento e hábitos",
    () => yearStats,
    (f) => {
      yearStats = f;
    },
  ],
  [
    "Doenças e cuidados",
    () => yearHealth,
    (f) => {
      yearHealth = f;
    },
  ],
  [
    "Mudanças na família e relações",
    () => yearPeople,
    (f) => {
      yearPeople = f;
    },
  ],
  [
    "Cansaço e sobrecarga",
    () => applyLoad,
    (f) => {
      applyLoad = f;
    },
  ],
]) {
  const original = obter();
  atribuir(function () {
    return bem41Medir(nome, () => original.apply(this, arguments));
  });
}

yearHealth = ((original) =>
  function () {
    const r = original.apply(this, arguments),
      m = S.me;
    if (!m.alive || S.scen) return r;
    const controladas = m.dis.some((d) => d.ctrl && DISEASES[d.id]?.ctrl);
    if (controladas || (m.recuperacao41 ?? -1) >= S.year) {
      const ganho = Math.min(
        controladas ? 2 : 3,
        Math.max(0, saudeAlvoDe(m) + 4 - m.health),
      );
      bem41Medir("Recuperação após tratamento", () => st("health", ganho));
    }
    return r;
  })(yearHealth);

function ano41Destaques(a) {
  const m = a.m,
    linhas = [];
  if (
    m.job &&
    a.job?.id === m.job.id &&
    a.job.co === m.job.co &&
    m.job.yrs > a.job.yrs
  )
    linhas.push(
      "Ganhei experiência como " + jobTitle(m.job).toLowerCase() + ".",
    );
  else if (a.job && !m.job) linhas.push("Meu emprego terminou.");
  else if (m.job && (!a.job || a.job.id !== m.job.id || a.job.co !== m.job.co))
    linhas.push(
      "Minha situação no trabalho mudou. Agora trabalho como " +
        jobTitle(m.job).toLowerCase() +
        ".",
    );
  const promessa = m.historia40?.agenda?.find(
    (e) =>
      e.tipo === "promessa" &&
      e.devido <= S.year &&
      h40Valido(e) &&
      (e.presencas || 0) < 2,
  );
  if (promessa)
    linhas.push(
      "Tenho uma promessa com " + P(promessa.pid).first + " para revisar.",
    );
  const contato = S.pending.find((e) => e.id === "filho41");
  if (contato && P(contato.d.pid)?.alive)
    linhas.push(P(contato.d.pid).first + " entrou em contato.");
  if (m.edu.deg.length > a.diplomas) linhas.push("Concluí uma formação.");
  return linhas.slice(0, 3);
}

const pontos41 = (n) => {
  const v = Math.round(n * 10) / 10;
  return (v > 0 ? "+" : "") + String(v).replace(".", ",");
};
function ano41Dicas(r) {
  const m = S.me,
    dicas = [];
  if (
    m.dis.some((d) => !d.ctrl && (DISEASES[d.id]?.dmg || DISEASES[d.id]?.hap))
  )
    dicas.push(
      "Abra Saúde para investigar sintomas ou tratar condições ativas.",
    );
  if (r.fatores.some(([n]) => n === "Falta de contato recente"))
    dicas.push(
      "Em Relações, procure alguém próximo e passe um tempo com essa pessoa.",
    );
  if (r.dh < 0 && m.age >= 30)
    dicas.push(
      "Uma rotina de atividades físicas pode reduzir a perda de saúde no próximo ano.",
    );
  if (r.df < 0)
    dicas.push("Reserve tempo para descanso ou lazer ao longo do ano.");
  return dicas;
}

ageUp = ((original) =>
  function () {
    const m = S?.me;
    if (!m?.alive || S.scen || S.pending.length)
      return original.apply(this, arguments);
    const ano = S.year,
      anterior = bem41Ano;
    const a = {
      m,
      health: m.health,
      anterior: m.resumo41?.ano === ano ? m.resumo41.fechamento : null,
      happy: m.happy,
      job: m.job && { ...m.job },
      diplomas: m.edu.deg.length,
      registrado: [0, 0],
      itens: [],
      fatores: [],
    };
    bem41Ano = a;
    try {
      const r = bem41Medir("Outros acontecimentos da virada", () =>
        original.apply(this, arguments),
      );
      if (S.me === m && S.year > ano) {
        const dh = m.health - a.health,
          df = m.happy - a.happy;
        m.resumo41 = {
          ano: S.year,
          dh,
          df,
          fechamento: { health: m.health, happy: m.happy },
          saldo: a.anterior
            ? {
                dh: m.health - a.anterior.health,
                df: m.happy - a.anterior.happy,
              }
            : null,
          itens: a.itens,
          fatores: a.fatores,
          destaques: ano41Destaques(a),
        };
        const texto =
          "Resumo do ano · Saúde " +
          pontos41(m.resumo41.saldo?.dh ?? dh) +
          " · Felicidade " +
          pontos41(m.resumo41.saldo?.df ?? df) +
          ".";
        log([texto, ...m.resumo41.destaques].join(" "));
      }
      return r;
    } finally {
      bem41Ano = anterior;
    }
  })(ageUp);

V.ano41 = () => {
  const r = S.me.resumo41;
  if (!r)
    return {
      title: "Resumo do ano",
      items: [{ l: "O primeiro resumo aparece quando você envelhecer." }],
    };
  const items = [
    {
      l: String(r.ano),
      s: r.saldo
        ? "Desde o último aniversário"
        : "Primeiro registro, feito na virada do ano",
    },
    {
      l: "Saúde",
      r: pontos41(r.saldo?.dh ?? r.dh),
      tone: r.dh < 0 ? "bad" : "good",
    },
    {
      l: "Felicidade",
      r: pontos41(r.saldo?.df ?? r.df),
      tone: r.df < 0 ? "bad" : "good",
    },
    ...r.destaques.map((l) => ({ l })),
    { sec: "O que mudou seus indicadores na virada" },
    ...(r.saldo
      ? [
          {
            l: "Antes da virada",
            s:
              "Ações e acontecimentos ao longo do ano · Saúde " +
              pontos41(r.saldo.dh - r.dh) +
              " · Felicidade " +
              pontos41(r.saldo.df - r.df),
          },
        ]
      : []),
    ...r.itens
      .slice()
      .sort(
        (a, b) =>
          Math.abs(b.dh) + Math.abs(b.df) - Math.abs(a.dh) - Math.abs(a.df),
      )
      .map((e) => ({
        l: e.nome,
        s: [
          e.dh ? "Saúde " + pontos41(e.dh) : "",
          e.df ? "Felicidade " + pontos41(e.df) : "",
        ]
          .filter(Boolean)
          .join(" · "),
      })),
    { sec: "O que influenciou seu bem-estar" },
    ...r.fatores.map(([n, v]) => ({
      l: n,
      s: v < 0 ? "Pressão sobre a felicidade" : "Ajuda a manter a felicidade",
    })),
    ...ano41Dicas(r).map((l) => ({ l })),
    { l: "Abrir Saúde", on: () => UI.push(V.health) },
    { l: "Abrir Relações", on: () => UI.push(V.relations) },
  ];
  return { title: "Resumo do ano", items };
};
for (const nome of ["menu", "me", "health"]) {
  const original = V[nome];
  V[nome] = function () {
    const r = original.apply(this, arguments);
    if (r && S?.me && !S.scen)
      r.items.unshift({
        l: "Resumo do ano",
        s: "Saúde, felicidade e mudanças recentes",
        on: () => UI.push(V.ano41),
      });
    return r;
  };
}

function filho41Tipo(p) {
  const v = p.vida,
    distancia = S.year - (v?.contato ?? v?.inicio ?? S.year);
  if (p.bond < 55 && distancia >= 2) return "retomar";
  if (p.bond >= 60 && v?.semEmprego >= 1 && !p.job) return "conselho";
  if (p.bond >= 68 && p.country === S.me.country) return "visita";
  return "ligacao";
}

npcIniciativa = ((original) =>
  function () {
    const m = S.me;
    if (
      !m.alive ||
      S.scen ||
      m.prison ||
      m.filho41Ano === S.year ||
      S.pending.some((e) =>
        ["npc_convite", "npc_conversa", "filho41"].includes(e.id),
      )
    )
      return original();
    const opcoes = kids().filter(
      (p) =>
        p.alive &&
        p.age >= 18 &&
        p.bond >= 15 &&
        S.year - (p.vida?.ultimoPedido ?? -999) >= (p.bond >= 65 ? 2 : 4),
    );
    if (
      !opcoes.length ||
      !R.chance(0.28 + Math.min(0.22, opcoes.length * 0.04))
    )
      return original();
    const p = R.wpick(opcoes.map((p) => [p, 1 + p.bond / 35]));
    m.filho41Ano = S.year;
    npcVida(p).ultimoPedido = S.year;
    queue("filho41", { pid: p.id, ano: S.year, tipo: filho41Tipo(p) });
  })(npcIniciativa);

const FILHO41 = {
  visita: [
    "Um convite para visitar",
    "me convidou para passar um tempo em sua casa.",
    "Aceitar a visita",
  ],
  conselho: [
    "Um pedido de conselho",
    "está procurando trabalho e pediu minha opinião sobre os próximos passos.",
    "Ouvir e aconselhar",
  ],
  ligacao: [
    "Uma ligação inesperada",
    "ligou para saber de mim e contar como anda sua vida.",
    "Conversar com calma",
  ],
  retomar: [
    "Podemos voltar a nos falar?",
    "disse que sentiu nossa distância e quer tentar conversar de novo.",
    "Dar espaço para conversar",
  ],
};
EVENTS.filho41 = {
  show: (d) => {
    const p = P(d.pid),
      [t, x, l] = FILHO41[d.tipo];
    return {
      k: "Família",
      t,
      x: (p?.first || "Um filho") + " " + x,
      ch: [
        [l, "ouvir"],
        ["Responder com carinho e deixar para depois", "adiar"],
        ["Ignorar", "ignorar"],
      ],
    };
  },
  pick: (k, d) => {
    const p = P(d.pid);
    if (!p?.alive || !kids().includes(p) || S.year !== d.ano)
      return "Esse contato já passou.";
    const v = npcVida(p);
    if (v.respostaAno === d.ano) return "Já respondi a esse contato.";
    if (!["ouvir", "adiar", "ignorar"].includes(k))
      return "Escolha uma resposta disponível.";
    const antes = p.bond;
    const r = npcConversaResolver(k, {
      ...d,
      tipo: d.tipo === "conselho" ? "apoio" : d.tipo,
    });
    if (k !== "ouvir") return r;
    if (d.tipo === "retomar") {
      p.bond = clamp(antes + 4);
      relMemoria(p, "reconciliacao");
      return "Conversamos sobre o afastamento. Foi um primeiro passo para recuperar a confiança.";
    }
    if (d.tipo === "visita") {
      h40Presenca(p);
      relMemoria(p, "apoio");
      return "Aceitei a visita de " + p.first + " e passamos um tempo juntos.";
    }
    return r;
  },
};

const Z41_ETAPAS = [
  {
    nome: "Primeiros abrigos",
    escassez: 0,
    grupo: "Vizinhos em fuga",
    item: "agua",
    abrigo: "Uma escola virou ponto de encontro.",
  },
  {
    nome: "Rotas disputadas",
    escassez: 1,
    grupo: "Caravana da Estrada",
    item: "lata",
    abrigo: "A caravana abriu um ponto de troca num galpão.",
  },
  {
    nome: "Comunidades sob pressão",
    escassez: 2,
    grupo: "Rede de Enfermarias",
    item: "curativo",
    abrigo: "O posto de saúde abandonado voltou a receber pessoas.",
  },
  {
    nome: "Sobrevivência prolongada",
    escassez: 2,
    grupo: "Cooperativa do Vale",
    item: "agua",
    abrigo: "Um antigo armazém virou depósito comunitário.",
  },
];
function z41Etapa(dia) {
  return Z41_ETAPAS[Math.min(3, Math.floor(Math.max(0, dia - 1) / 30))];
}
function z41Suprimentos(sc, tipo) {
  const etapa = z41Etapa(sc.dia),
    estacao = zSeason(sc);
  const clima =
    (estacao === 0 && tipo === "agua") || (estacao === 2 && tipo === "comida")
      ? 0.1
      : 0;
  return Math.max(0.34, 0.7 - etapa.escassez * 0.11 - clima);
}
function z41Estado(sc) {
  return sc.z41 || (sc.z41 = { marcos: [], reputacao: {} });
}
function z41Marco(sc, texto) {
  const marcos = z41Estado(sc).marcos;
  marcos.push({ dia: sc.dia, texto });
  if (marcos.length > 10) marcos.shift();
}
function z41Texto(z) {
  return [
    z.dias +
      " dias sobrevividos · recorde de " +
      Math.max(z.dias, META.zrec || 0) +
      " dias",
    z.fase,
    "Causa registrada: " + z.motivo,
    ...(z.marcos || []).slice(-6).map((m) => "Dia " + m.dia + " · " + m.texto),
  ].join("\n");
}
SCEN.zumbi.upkeep = ((original) =>
  function (sc) {
    const r = original.apply(this, arguments);
    if (S.scen !== sc || sc.hl <= 0) return r;
    const z = z41Estado(sc),
      etapa = z41Etapa(sc.dia),
      ciclo = Math.floor((sc.dia - 1) / 15);
    if (
      ciclo > 0 &&
      z.ciclo !== ciclo &&
      !S.pending.some((e) => e.id === "z_grupo41")
    ) {
      z.ciclo = ciclo;
      scLog(etapa.abrigo);
      queue("z_grupo41", { dia: sc.dia, grupo: Z41_ETAPAS.indexOf(etapa) });
    }
    return r;
  })(SCEN.zumbi.upkeep);
EVENTS.z_grupo41 = {
  scen: "zumbi",
  show: (d) => {
    const e = Z41_ETAPAS[d.grupo];
    return {
      k: e.grupo,
      t: "Um abrigo na rota",
      x:
        e.abrigo +
        " O grupo oferece suprimentos por uma porção de comida ou propõe compartilhar notícias das rotas.",
      ch: [
        ["Trocar comida por suprimentos", "troca"],
        ["Compartilhar notícias", "noticias"],
        ["Seguir viagem", "seguir"],
      ],
    };
  },
  pick: (k, d) => {
    const sc = S.scen;
    if (sc?.id !== "zumbi" || sc.dia !== d.dia) return "A oportunidade passou.";
    const z = z41Estado(sc),
      e = Z41_ETAPAS[d.grupo];
    if (z.resolvido === d.dia) return "Já conversamos com o grupo hoje.";
    if (!["troca", "noticias", "seguir"].includes(k))
      return "Escolha uma ação disponível.";
    z.resolvido = d.dia;
    if (k === "troca") {
      if (!takeItem("@comida")) return "Não tínhamos comida para trocar.";
      addItem(e.item);
      z.reputacao[e.grupo] = Math.min(5, (z.reputacao[e.grupo] || 0) + 1);
      z41Marco(sc, "Trocamos suprimentos com " + e.grupo);
      return "A troca foi concluída. O grupo vai lembrar do acordo.";
    }
    if (k === "noticias") {
      const rep = z.reputacao[e.grupo] || 0;
      z.reputacao[e.grupo] = Math.min(5, rep + 1);
      scStat("san", rep >= 2 ? 5 : 2);
      z41Marco(sc, "Compartilhamos notícias com " + e.grupo);
      return rep >= 2
        ? "Já nos conheciam e indicaram uma rota de descanso."
        : "Trocamos notícias e descansamos um pouco no abrigo.";
    }
    z41Marco(sc, "Seguimos viagem sem parar em " + e.grupo);
    return "Seguimos viagem.";
  },
};
const Z41_ESCOLHAS = {
  z_rotina39: {
    preparar: "Preparamos as defesas da semana",
    explorar: "Procuramos uma rota de suprimentos",
    grupo: "Cuidamos do grupo e descansamos",
  },
  z_horda: {
    d: "Decidimos enfrentar a grande horda",
    f: "Fugimos da grande horda",
    s: "Nos escondemos da grande horda",
  },
};
for (const [id, escolhas] of Object.entries(Z41_ESCOLHAS)) {
  const original = EVENTS[id].pick;
  EVENTS[id].pick = function (k, d) {
    const sc = S.scen,
      anterior = sc?.z39?.resolvido;
    const r = original.apply(this, arguments);
    if (
      sc?.id === "zumbi" &&
      escolhas[k] &&
      (id !== "z_rotina39" || anterior !== sc.z39?.resolvido)
    )
      z41Marco(sc, escolhas[k]);
    return r;
  };
}
scCheck = ((original) =>
  function () {
    const sc = S.scen,
      m = S.me;
    const r = original.apply(this, arguments);
    if (
      sc?.id === "zumbi" &&
      m.alive === false &&
      m.zResumo39 &&
      !m.zResumo41Mostrado
    ) {
      m.zResumo41Mostrado = true;
      log(
        "Fim da sobrevivência zumbi · " +
          sc.dia +
          " dias · recorde de " +
          META.zrec +
          " dias.",
        "warn",
      );
      save();
      modal({ t: "Fim da sobrevivência", x: z41Texto(m.zResumo39) });
    }
    return r;
  })(scCheck);

V.zMe = ((original) =>
  function () {
    const r = original.apply(this, arguments),
      sc = S.scen;
    if (r && sc?.id === "zumbi") {
      const etapa = z41Etapa(sc.dia);
      r.items.splice(1, 0, {
        l: "Abastecimento da região",
        s:
          etapa.escassez === 0
            ? "Estoques iniciais"
            : etapa.escassez === 1
              ? "Suprimentos disputados"
              : "Estoques escassos",
      });
      if (sc.z41?.marcos.length)
        r.items.push(
          { sec: "Decisões da partida" },
          ...sc.z41.marcos
            .slice(-6)
            .reverse()
            .map((m) => ({ l: "Dia " + m.dia, s: m.texto })),
        );
    }
    return r;
  })(V.zMe);
