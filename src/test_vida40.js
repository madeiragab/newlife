function vida40SelfTest() {
  const s0 = S,
    meta = JSON.stringify(META),
    rf = R.f,
    ns = window.NO_SAVE,
    snaps = SNAPS,
    md = modal;
  const ok = (v, t) => {
    if (!v) throw Error(t);
  };
  try {
    window.NO_SAVE = true;
    R.f = () => 0.5;
    modal = () => {};
    newLife({ country: "BR" });
    S.me.age = 30;
    S.me.edu.cur = null;
    S.me.edu.deg = ["medio"];
    S.me.smarts = 60;
    S.me.looks = 50;
    S.me.fame = 0;
    S.me.rec.conv = 0;
    S.me.add.alcool = 0;
    const job = JOBS.find((d) => d.id === "aux");
    const base = hireChance(job);
    S.me.hist = [
      { id: "aux", t: g(job.l[0], S.me.gender), co: "Antiga", yrs: 8 },
    ];
    ok(hireChance(job) > base, "experiência relacionada não conta");
    S.me.carExp = {};
    S.me.hist = [{ t: g(job.l[0], S.me.gender), yrs: 8 }];
    ok(h40Exp(job) >= 8, "save antigo perdeu experiência reconhecível");
    S.me.hist = [];
    S.me.edu.deg = [];
    ok(
      interviewChance(job, 0) === 0,
      "entrevista dispensou formação obrigatória",
    );
    S.me.edu.deg = ["medio"];
    takeJob({ id: "aux", co: "Empresa teste", size: "média", mul: 1 });
    endJob();
    ok(S.me.hist.at(-1).id === "aux", "histórico não guardou profissão");
    const filho = mkPerson({ rel: "filho", age: 10, bond: 70 });
    S.people.push(filho);
    h40Prometer(filho);
    let e = h40().agenda.find((x) => x.tipo === "promessa");
    ok(e, "promessa não registrada");
    interact(filho, "conversa");
    interact(filho, "tempo");
    ok(e.presencas === 2, "convivência não conta para promessa");
    S = JSON.parse(JSON.stringify(S));
    e = h40().agenda.find((x) => x.id === e.id);
    S.year = e.devido;
    const p = P(filho.id),
      b = p.bond;
    ok(
      h40Resolver("resultado", { id: e.id }).includes("Concluí"),
      "promessa cumprida não reconhecida",
    );
    ok(
      p.bond > b && p.relMemorias.some((m) => m.tipo === "promessa_cumprida"),
      "promessa sem consequência",
    );
    const feliz = S.me.happy,
      historico = h40().passado.length;
    h40Resolver("resultado", { id: e.id });
    ok(
      S.me.happy === feliz && h40().passado.length === historico,
      "recompensa duplicada",
    );
    h40Prometer(p);
    e = h40().agenda.find((x) => x.tipo === "promessa");
    S.year = e.devido;
    const b0 = p.bond;
    h40Resolver("resultado", { id: e.id });
    ok(
      p.bond < b0 && p.relMemorias.some((m) => m.tipo === "promessa_quebrada"),
      "ausência não afetou confiança",
    );
    h40Prometer(p);
    e = h40().agenda.find((x) => x.tipo === "promessa");
    p.alive = false;
    S.year = e.devido;
    const morto = p.bond;
    h40Resolver("resultado", { id: e.id });
    ok(p.bond === morto, "consequência aplicada a pessoa falecida");
    p.alive = true;
    S.me.age = 65;
    const inicio = S.me.smarts;
    h40Projeto("projeto", "jardinagem");
    e = h40().agenda.find((x) => x.tipo === "projeto");
    hobbyPraticar("jardinagem");
    hobbyPraticar("jardinagem");
    hobbyPraticar("jardinagem");
    S.year = e.devido;
    ok(
      h40Resolver("resultado", { id: e.id }).includes("Concluí"),
      "projeto não reconheceu práticas",
    );
    ok(
      S.me.legado40.some((x) => x.interesse === "jardinagem"),
      "legado não registrado",
    );
    ok(S.me.smarts === inicio, "jardinagem deu diploma/inteligência indevida");
    p.age = 25;
    h40Projeto("mentoria", null, p.id);
    e = h40().agenda.find((x) => x.tipo === "mentoria");
    p.yr = {};
    interact(p, "conversa");
    interact(p, "tempo");
    S.year = e.devido;
    h40Resolver("resultado", { id: e.id });
    ok(p.mentoria40?.mentor === S.me.id, "mentoria não persistiu");
    takeJob({ id: "aux", co: "Empresa A", size: "média", mul: 1 });
    e = h40().agenda.find((x) => x.tipo === "carreira" && x.co === "Empresa A");
    takeJob({ id: "aux", co: "Empresa B", size: "média", mul: 1 });
    S.year = e.devido;
    const perf = S.me.job.perf;
    h40Resolver("assumir", { id: e.id });
    ok(
      S.me.job.perf === perf,
      "evento de empresa antiga beneficiou novo emprego",
    );
    h40().agenda = [];
    e = h40Agendar("promessa", { pid: p.id, presencas: 0 }, 1);
    S.year = e.devido;
    h40Ano();
    h40Ano();
    ok(
      S.pending.filter((x) => x.id === "historia40" && x.d.id === e.id)
        .length === 1,
      "fila anual duplicada",
    );
    h40().agenda = [];
    cadState().done.primeiro_amor = 1;
    cadLigar("primeiro_amor");
    e = h40().agenda.find((x) => x.tipo === "continuidade");
    ok(
      e && e.chave === "primeiro_amor",
      "história concluída não deixou continuação",
    );
    S.year = e.devido;
    const before = Object.keys(cadState().on).length;
    h40Resolver("retomar", { id: e.id });
    ok(
      Object.keys(cadState().on).length >= before,
      "continuação corrompeu histórias",
    );
    h40().agenda = [];
    for (let i = 0; i < 30; i++)
      h40Agendar("projeto", { chave: "jardinagem", pid: 9000 + i }, 2);
    ok(h40().agenda.length <= 12, "agenda ilimitada");
    S = JSON.parse(JSON.stringify(S));
    ok(h40().passado.length > 0, "save apagou consequências");
    ok(V.historia40().items.length > 0, "história não renderiza");
    return {
      carreira: true,
      promessas: true,
      projetos: true,
      contexto: true,
      save: true,
      continuidade: true,
    };
  } finally {
    S = s0;
    META = JSON.parse(meta);
    R.f = rf;
    window.NO_SAVE = ns;
    SNAPS = snaps;
    modal = md;
  }
}
