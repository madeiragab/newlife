// 4.0: consequências vinculadas às pessoas, escolhas e etapas reais da partida.
function h40() {
  const m = S.me;
  if (!m.historia40 || m.historia40.dono !== m.id)
    m.historia40 = { dono: m.id, seq: 0, agenda: [], passado: [] };
  return m.historia40;
}
function h40Agendar(tipo, d = {}, anos = 2) {
  const h = h40();
  if (h.agenda.filter((e) => !e.fim).length >= 12) return null;
  const igual = h.agenda.find(
    (e) =>
      !e.fim &&
      e.tipo === tipo &&
      e.pid === d.pid &&
      e.co === d.co &&
      e.chave === d.chave,
  );
  if (igual) return igual;
  const e = {
    ...d,
    id: "h40_" + ++h.seq,
    tipo,
    origem: S.year,
    idade: S.me.age,
    devido: S.year + anos,
    dono: S.me.id,
  };
  h.agenda.push(e);
  return e;
}
function h40Fechar(e, texto, estado = "concluido") {
  if (!e || e.fim) return;
  e.fim = estado;
  const h = h40();
  h.passado.push({
    id: e.id,
    ano: S.year,
    origem: e.origem,
    tipo: e.tipo,
    texto,
  });
  if (h.passado.length > 30) h.passado.shift();
  h.agenda = h.agenda.filter((x) => !x.fim);
}
function h40Valido(e) {
  if (!e || e.dono !== S.me.id || e.fim) return false;
  const p = e.pid != null ? P(e.pid) : null;
  if (e.pid != null && (!p?.alive || p.rel === "pet")) return false;
  if (["promessa", "familia"].includes(e.tipo) && !kids().includes(p))
    return false;
  if (e.tipo === "continuidade")
    return (
      "Em " +
      e.origem +
      " concluí uma história de " +
      (CHAINS[e.chave]?.o.k || "vida") +
      ". Agora há " +
      h40Continuacoes(e).length +
      " continuação(ões) compatíveis com minha idade, relações e situação. Retomar significa começar uma nova história, não ganhar uma recompensa automática."
    );
  if (e.tipo === "projeto" && !HOBBIES[e.chave]) return false;
  if (e.tipo === "continuidade" && !CHAINS[e.chave]) return false;
  if (e.tipo === "mentoria" && p.age < 18) return false;
  if (e.tipo === "netos" && (!people("neto").includes(p) || p.age < 6))
    return false;
  if (e.tipo === "carreira")
    return !!(
      S.me.job &&
      !S.me.job.spc &&
      S.me.job.id === e.emprego &&
      S.me.job.co === e.co
    );
  if (["mentoria", "netos", "projeto"].includes(e.tipo) && S.me.age < 60)
    return false;
  return true;
}
function h40Exp(d) {
  const m = S.me,
    fk = CAR_JOB_FAM[d.id],
    hist = (m.hist || []).reduce((n, x) => {
      let id = x.id;
      if (!id) {
        const l = JOBS.filter((j) =>
          j.l.some((t) => t.split("|").includes(x.t)),
        );
        if (l.length === 1) id = l[0].id;
      }
      return (
        n +
        (id && (id === d.id || (fk && CAR_JOB_FAM[id] === fk))
          ? Math.max(0, Number(x.yrs) || 0)
          : 0)
      );
    }, 0),
    atual =
      m.job &&
      !m.job.spc &&
      (m.job.id === d.id || (fk && CAR_JOB_FAM[m.job.id] === fk))
        ? Math.max(0, m.job.yrs || 0)
        : 0;
  return Math.max(hist + atual, fk ? carExp(m, fk) : 0);
}
function h40Curriculo(d) {
  const m = S.me,
    anos = h40Exp(d),
    certs = CAR_JOB_FAM[d.id] ? certsArea(m, CAR_JOB_FAM[d.id]) : 0,
    formado = !!d.edu && eduOk(d.edu),
    bonus =
      Math.min(0.18, anos * 0.018) +
      Math.min(0.06, certs * 0.02) +
      (formado ? 0.04 : 0);
  return { anos, certs, formado, bonus, faltas: jobReqs(d) };
}
hireChance = ((o) =>
  function (d) {
    const c = h40Curriculo(d);
    if (c.faltas.length) return 0;
    return Math.max(0.05, Math.min(0.95, o(d) + c.bonus));
  })(hireChance);
interviewChance = ((o) =>
  function (d, a) {
    return jobReqs(d).length ? 0 : o(d, a);
  })(interviewChance);
function h40TextoCurriculo(d) {
  const c = h40Curriculo(d);
  return c.faltas.length
    ? "Ainda preciso atender: " + c.faltas.join(", ") + "."
    : `${c.anos.toFixed(0)} ano(s) de experiência relacionada · ${c.certs} certificação(ões) da área${c.formado ? " · formação exigida atendida" : ""}. Experiência e preparação aumentam minhas chances, sem garantir a contratação.`;
}
takeJob = ((o) =>
  function (of) {
    const antes = S.me.job,
      r = o.apply(this, arguments),
      j = S.me.job;
    if (j && j !== antes && !j.spc)
      h40Agendar(
        "carreira",
        { emprego: j.id, co: j.co, cargo: jobTitle(j) },
        2,
      );
    return r;
  })(takeJob);
Object.assign(REL_MEM_NOME, {
  promessa_cumprida: "uma promessa que cumpri",
  promessa_quebrada: "uma promessa que não cumpri",
  mentoria: "o tempo que dedicamos a aprender juntos",
  legado: "uma história que compartilhei com a família",
});
for (const k of ["promessa_cumprida", "mentoria", "legado"])
  REL_MEM_POSITIVA.add(k);
function h40Presenca(p) {
  for (const e of h40().agenda)
    if (
      !e.fim &&
      e.pid === p.id &&
      S.year <= e.devido &&
      ["promessa", "mentoria", "netos"].includes(e.tipo)
    )
      e.presencas = Math.min(12, (e.presencas || 0) + 1);
}
interact = ((o) =>
  function (p, k) {
    const n = p?.yr?.[k] || 0,
      r = o.apply(this, arguments);
    if (
      p?.alive &&
      ["tempo", "conversa", "abraco", "passear", "ler", "visitar"].includes(
        k,
      ) &&
      p.yr?.[k] > n &&
      p.yr[k] <= 2
    )
      h40Presenca(p);
    return r;
  })(interact);
familiaEducar = ((o) =>
  function (p, k) {
    const ano = p?.criacao?.ano,
      r = o.apply(this, arguments);
    if (p?.alive && ano !== S.year && p.criacao?.ano === S.year) {
      h40Presenca(p);
      h40Agendar("familia", { pid: p.id, escolha: k }, 3);
    }
    return r;
  })(familiaEducar);
function h40Prometer(p) {
  if (
    !p?.alive ||
    !kids().includes(p) ||
    p.age < 6 ||
    S.me.age < 16 ||
    S.scen ||
    S.me.prison
  )
    return "Essa promessa não está disponível agora.";
  const e = h40Agendar("promessa", { pid: p.id, presencas: 0 }, 1);
  return e
    ? "Prometi a " +
        p.first +
        " reservar dois momentos de convivência antes do próximo aniversário. Conversar, visitar ou passar tempo juntos conta; presentes não substituem a presença."
    : "Já tenho compromissos demais. Preciso concluir algum antes.";
}
function h40Projeto(tipo, chave, pid) {
  const m = S.me,
    p = pid != null ? P(pid) : null;
  if (m.age < 60 || !m.alive || S.scen || m.prison)
    return "Preciso ter 60 anos e estar livre para iniciar esse projeto.";
  if (!["projeto", "mentoria", "netos"].includes(tipo))
    return "Projeto desconhecido.";
  if (tipo === "projeto" && !HOBBIES[chave])
    return "Escolha um interesse disponível.";
  if (
    tipo !== "projeto" &&
    (!p?.alive ||
      p.age < (tipo === "mentoria" ? 18 : 6) ||
      (tipo === "netos" && !people("neto").includes(p)))
  )
    return "Essa pessoa já não pode participar desse projeto.";
  const atual =
    m.job && !m.job.spc
      ? m.job.id
      : (m.hist || [])
          .slice()
          .reverse()
          .find((x) => x.id)?.id;
  const e = h40Agendar(
    tipo,
    { chave, pid, presencas: 0, praticas: 0, area: atual || null },
    2,
  );
  return e
    ? "Comecei um projeto de " +
        (tipo === "projeto"
          ? HOBBIES[chave][1].toLowerCase()
          : tipo === "mentoria"
            ? "mentoria com " + p.first
            : "memórias com " + p.first) +
        ". Preciso dedicar " +
        (tipo === "projeto"
          ? "três práticas ao interesse"
          : "dois momentos de convivência") +
        " nos próximos dois anos."
    : "Preciso concluir um projeto antes de assumir outro.";
}
hobbyPraticar = ((o) =>
  function (k) {
    const n = S.me.hobbies?.[k] || 0,
      r = o.apply(this, arguments);
    if ((S.me.hobbies?.[k] || 0) > n)
      for (const e of h40().agenda)
        if (e.tipo === "projeto" && e.chave === k && S.year <= e.devido)
          e.praticas = Math.min(12, (e.praticas || 0) + 1);
    return r;
  })(hobbyPraticar);
function h40Titulo(e) {
  const p = e.pid != null ? P(e.pid) : null;
  return e.tipo === "continuidade"
    ? "O que veio depois daquela escolha"
    : e.tipo === "carreira"
      ? "O que construí na " + e.co
      : e.tipo === "promessa"
        ? "Uma promessa para " + (p?.first || "meu filho")
        : e.tipo === "familia"
          ? "Os anos da nossa convivência"
          : e.tipo === "projeto"
            ? "Meu projeto de " + (HOBBIES[e.chave]?.[1] || "aprendizado")
            : e.tipo === "mentoria"
              ? "O que deixei para " + (p?.first || "essa pessoa")
              : "Memórias entre gerações";
}
function h40Situacao(e) {
  const p = e.pid != null ? P(e.pid) : null;
  if (e.tipo === "carreira")
    return (
      "Há " +
      (S.year - e.origem) +
      " anos comecei como " +
      e.cargo +
      " na " +
      e.co +
      ". Meu desempenho atual é " +
      Math.round(S.me.job?.perf || 0) +
      "%. Posso assumir responsabilidades ou pedir orientação."
    );
  if (e.tipo === "familia") {
    const c = familiaCriacao(p),
      tempo = c.presenca != null && c.presenca >= S.year - 1;
    return (
      p.first +
      " lembra da época em que " +
      ({
        ouvir: "reservei tempo para ouvir",
        apoiar: "apoiei seus interesses",
        cobrar: "cobrei resultados com rigidez",
      }[e.escolha] || "conversamos sobre a criação") +
      ". Hoje há " +
      (tempo ? "presença recente" : "distância") +
      ", afeto " +
      c.afeto +
      " e pressão " +
      c.pressao +
      ". O que fiz desde então também conta."
    );
  }
  return (
    "Este compromisso começou em " +
    e.origem +
    ". " +
    (e.tipo === "projeto"
      ? (e.praticas || 0) + " de 3 práticas registradas."
      : (e.presencas || 0) + " de 2 momentos de convivência registrados.") +
    " Posso reconhecer o resultado ou renegociar o próximo passo."
  );
}
EVENTS.historia40 = {
  show: (d) => {
    const e = h40().agenda.find((x) => x.id === d.id);
    if (!e || !h40Valido(e))
      return {
        k: "Minha história",
        t: "A vida mudou",
        x: "Esse compromisso já não corresponde à minha situação atual.",
        ch: [
          ["Registrar a mudança", "fechar"],
          ["Voltar à minha vida", "fechar"],
        ],
      };
    return {
      k: "Minha história",
      t: h40Titulo(e),
      x: h40Situacao(e),
      ch:
        e.tipo === "continuidade"
          ? [
              ["Buscar um próximo passo compatível", "retomar"],
              ["Deixar essa história no passado", "fechar"],
            ]
          : e.tipo === "carreira"
            ? [
                ["Assumir uma responsabilidade compatível", "assumir"],
                ["Pedir orientação e desenvolvimento", "orientacao"],
                ["Manter a rotina por enquanto", "fechar"],
              ]
            : e.tipo === "familia"
              ? [
                  ["Ouvir como essa pessoa viveu aqueles anos", "ouvir"],
                  ["Rever minha forma de cobrar", "rever"],
                  ["Encerrar a conversa", "fechar"],
                ]
              : [
                  ["Reconhecer o que consegui cumprir", "resultado"],
                  ["Combinar mais um período de dedicação", "renegociar"],
                  ["Encerrar este compromisso", "fechar"],
                ],
    };
  },
  pick: (k, d) => h40Resolver(k, d),
};
function h40Resolver(k, d) {
  const e = h40().agenda.find((x) => x.id === d.id);
  if (!e) return "Esse capítulo já foi registrado.";
  if (!h40Valido(e)) {
    h40Fechar(e, "A situação mudou antes da conclusão.", "cancelado");
    return "A vida mudou; registrei o encerramento sem aplicar consequências a outra pessoa ou emprego.";
  }
  if (S.year < e.devido) return "Ainda há tempo para cumprir esse compromisso.";
  const p = e.pid != null ? P(e.pid) : null;
  if (!EVENTS.historia40.show(d).ch.some((c) => c[1] === k))
    return "Essa escolha não está disponível.";
  if (k === "renegociar") {
    if ((e.adiamentos || 0) >= 1)
      return "Já renegociei esse prazo. Preciso reconhecer o resultado antes de assumir outro compromisso.";
    e.adiamentos = 1;
    e.devido = S.year + 1;
    e.fila = null;
    if (p) relMemoria(p, "decisao_conjunta");
    return "Combinei um ano a mais. A dedicação já registrada continua, mas isso não conta como uma promessa cumprida.";
  }
  let t = "Encerrei esse capítulo sem assumir novos compromissos.";
  if (e.tipo === "continuidade" && k === "retomar") {
    const id = h40Continuacoes(e)[0];
    t =
      id && encadear(id, 1)
        ? "Uma nova história nasceu das escolhas de " +
          e.origem +
          ". Sua sequência ainda depende do que eu fizer daqui em diante."
        : "A minha situação já mudou; não iniciei uma história incompatível.";
  } else if (e.tipo === "carreira" && k !== "fechar") {
    const j = S.me.job;
    if (k === "assumir") {
      if (j.perf >= 65) {
        j.perf = clamp(j.perf + 3);
        st("happy", 3);
        t =
          "Minha experiência na " +
          e.co +
          " abriu espaço para uma responsabilidade compatível. Ainda preciso cumprir os requisitos para uma promoção.";
      } else {
        j.perf = clamp(j.perf + 1);
        t =
          "A avaliação mostrou que preciso melhorar minha consistência antes de assumir mais responsabilidades.";
      }
    } else {
      j.perf = clamp(j.perf + 2);
      t =
        "Pedi orientação na " +
        e.co +
        " e combinei objetivos de desenvolvimento.";
    }
  } else if (e.tipo === "familia" && k !== "fechar") {
    const c = familiaCriacao(p),
      presente = c.presenca != null && c.presenca >= S.year - 1;
    if (k === "rever") {
      c.pressao = clamp(c.pressao - 5);
      t =
        "Reconheci que preciso mudar a forma de cobrar " +
        p.first +
        ". A confiança depende do que eu fizer depois desta conversa.";
      h40Agendar("promessa", { pid: p.id, presencas: 0 }, 1);
    } else {
      p.bond = clamp(p.bond + (presente && c.afeto >= 50 ? 5 : 1));
      relMemoria(p, presente ? "apoio" : "ausencia");
      t =
        p.first +
        (presente
          ? " reconheceu o tempo em que estive presente."
          : " disse que sentiu minha ausência. Ouvir foi um começo, não apagou aqueles anos.");
    }
  } else if (["promessa", "mentoria", "netos", "projeto"].includes(e.tipo)) {
    const cumpriu =
      e.tipo === "projeto" ? (e.praticas || 0) >= 3 : (e.presencas || 0) >= 2;
    if (cumpriu) {
      st("happy", 4);
      if (p) {
        p.bond = clamp(p.bond + 5);
        relMemoria(
          p,
          e.tipo === "promessa"
            ? "promessa_cumprida"
            : e.tipo === "netos"
              ? "legado"
              : "mentoria",
        );
        if (e.tipo === "mentoria")
          p.mentoria40 = { ano: S.year, area: e.area, mentor: S.me.id };
      } else {
        S.me.legado40 = S.me.legado40 || [];
        S.me.legado40.push({ ano: S.year, interesse: e.chave });
        if (S.me.legado40.length > 12) S.me.legado40.shift();
      }
      t =
        "Concluí " +
        h40Titulo(e).toLowerCase() +
        ". O resultado veio da dedicação registrada desde " +
        e.origem +
        ".";
    } else if (e.tipo === "promessa" && !cumpriu) {
      p.bond = clamp(p.bond - 5);
      relMemoria(p, "promessa_quebrada");
      t =
        p.first +
        " percebeu que não cumpri a presença combinada. Posso reconstruir a confiança com atitudes nos próximos anos.";
    } else
      t =
        "Reconheci que este projeto ficou incompleto. A história ficou registrada, sem receber os benefícios de uma conclusão.";
  }
  h40Fechar(e, t);
  return t;
}
function h40Ano() {
  const m = S.me;
  if (!m.alive || S.scen) return;
  const h = h40();
  for (const e of h.agenda.slice())
    if (!h40Valido(e) || S.year - e.devido > 6)
      h40Fechar(
        e,
        !h40Valido(e)
          ? "A pessoa ou a situação mudou."
          : "O compromisso ficou para trás.",
        "cancelado",
      );
  if (
    m.prison ||
    h.ultimo === S.year ||
    S.pending.some((e) => e.id === "historia40")
  )
    return;
  const e = h.agenda
    .filter((e) => e.devido <= S.year && e.fila !== S.year)
    .sort((a, b) => a.devido - b.devido)[0];
  if (e) {
    h.ultimo = S.year;
    e.fila = S.year;
    queue("historia40", { id: e.id });
  }
}
yearPeople = ((o) =>
  function () {
    const r = o.apply(this, arguments);
    h40Ano();
    return r;
  })(yearPeople);
npcChanceEmprego = ((o) =>
  function (p) {
    return Math.min(
      0.7,
      o(p) + (p.mentoria40 && S.year - p.mentoria40.ano <= 4 ? 0.04 : 0),
    );
  })(npcChanceEmprego);
V.person = ((o) =>
  function (p) {
    const r = o.apply(this, arguments);
    if (r && S.me.alive && p?.alive && !S.scen && !S.me.prison) {
      if (kids().includes(p) && p.age >= 6 && S.me.age >= 16)
        r.items.push({
          l: "Combinar presença de verdade",
          s: "Prometer dois momentos de convivência antes do próximo aniversário",
          on: () => act(() => h40Prometer(p), "Promessa"),
        });
      if (S.me.age >= 60 && p.age >= 18)
        r.items.push({
          l: "Oferecer mentoria",
          s: "Dois encontros nos próximos dois anos; não concede diploma ou emprego",
          on: () => act(() => h40Projeto("mentoria", null, p.id), "Mentoria"),
        });
      if (S.me.age >= 60 && p.age >= 6 && people("neto").includes(p))
        r.items.push({
          l: "Compartilhar memórias com " + p.first,
          s: "Construir uma lembrança entre gerações",
          on: () => act(() => h40Projeto("netos", null, p.id), "Legado"),
        });
    }
    return r;
  })(V.person);
V.projetos40 = () => ({
  title: "Projetos e legado",
  items: [
    {
      html: '<div class="card"><p>A velhice também pode ter projetos próprios. Os resultados dependem de praticar e manter a convivência; não concedem saúde, diplomas ou heranças automaticamente.</p></div>',
    },
    ...Object.entries(HOBBIES).map(([k, v]) => ({
      l: "Projeto de " + v[1],
      s: "Três práticas em dois anos",
      on: () => act(() => h40Projeto("projeto", k), "Projeto pessoal"),
    })),
    {
      l: "Mentoria e memórias da família",
      s: "Escolha uma pessoa nas relações para iniciar um projeto conjunto",
      on: () => UI.push(V.relations),
    },
    {
      l: "Planejar minha herança",
      s: "Usar o testamento e as doações que já existem no jogo",
      on: () => UI.push(V.assets),
    },
  ],
});
V.historia40 = () => {
  const h = h40();
  return {
    title: "Minha história em andamento",
    items: [
      {
        html: '<div class="card"><p>Compromissos e consequências ligados ao que fiz nesta partida. Uma mudança de pessoa, emprego ou etapa da vida pode encerrar um capítulo sem aplicar efeitos fora de contexto.</p></div>',
      },
      ...h.agenda.map((e) => ({
        l: h40Titulo(e),
        s:
          "Desde " +
          e.origem +
          " · retorno a partir de " +
          e.devido +
          (e.pid != null
            ? " · convivências " + (e.presencas || 0)
            : e.tipo === "projeto"
              ? " · práticas " + (e.praticas || 0)
              : ""),
      })),
      { sec: "Capítulos registrados" },
      ...h.passado
        .slice()
        .reverse()
        .map((e) => ({ l: String(e.ano), s: e.texto })),
      ...(S.me.age >= 60
        ? [{ l: "Projetos e legado", on: () => UI.push(V.projetos40) }]
        : []),
    ],
  };
};
V.menu = ((o) =>
  function () {
    const r = o.apply(this, arguments);
    if (S?.me)
      r.items.push({
        l: "Minha história em andamento",
        s: "Promessas, projetos e consequências das escolhas",
        on: () => UI.push(V.historia40),
      });
    return r;
  })(V.menu);
V.career = ((o) =>
  function () {
    const r = o.apply(this, arguments);
    if (r && S.me.age >= 16 && !S.scen)
      r.items.push({
        l: "Meu currículo e experiência",
        on: () =>
          UI.push(() => ({
            title: "Meu currículo",
            items: JOBS.filter((d) => h40Exp(d) > 0)
              .map((d) => ({
                l: g(d.l[0], S.me.gender),
                s: h40TextoCurriculo(d),
              }))
              .concat([
                {
                  html: "<p>Sem experiência relacionada, ainda posso disputar vagas de entrada quando atendo aos requisitos. O histórico melhora as chances, mas não substitui formação obrigatória.</p>",
                },
              ]),
          })),
      });
    return r;
  })(V.career);

function h40Continuacoes(e) {
  return (CAD_LIGACOES[e.chave] || []).filter((id) => cadCan(id, S.me));
}
cadLigar = ((o) =>
  function (id) {
    const r = o.apply(this, arguments);
    if (
      !S.scen &&
      S.me.alive &&
      (cadState().done[id] || 0) > 0 &&
      (CAD_LIGACOES[id] || []).length
    )
      h40Agendar("continuidade", { chave: id }, 2 + (h40().seq % 3));
    return r;
  })(cadLigar);
