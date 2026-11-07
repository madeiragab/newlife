function vida41SelfTest() {
  const s0 = S,
    rf = R.f,
    noSave = window.NO_SAVE,
    meta = JSON.stringify(META),
    snaps = SNAPS,
    modal0 = modal;
  const ok = (condition, message) => {
    if (!condition) throw Error(message);
  };
  try {
    window.NO_SAVE = true;
    modal = () => {};
    newLife({ country: "BR" });
    const m = S.me;
    m.age = 74;
    m.health = 55;
    m.happy = 35;
    m.dis = [];
    const base = JSON.stringify(S);
    const simular = (contato) => {
      S = JSON.parse(base);
      R.f = () => 0.5;
      const p = mkPerson({ rel: "filho", age: 40, bond: 42 });
      S.people = [p];
      if (contato) {
        npcContato(p);
        Object.assign(S.me.yr, { b_walk: 3, b_med: 3 });
      }
      ageUp();
      const r = S.me.resumo41;
      ok(r.ano === S.year, "resumo não fechou junto com o ano");
      ok(
        Math.abs(r.itens.reduce((n, e) => n + e.dh, 0) - r.dh) < 0.01,
        "saúde não fecha com as causas",
      );
      ok(
        Math.abs(r.itens.reduce((n, e) => n + e.df, 0) - r.df) < 0.01,
        "felicidade não fecha com as causas",
      );
      ok(
        r.fatores.some(
          ([n]) =>
            n ===
            (contato ? "Convivência recente" : "Falta de contato recente"),
        ),
        "contato não mudou os fatores",
      );
      return { h: S.me.health, f: S.me.happy };
    };
    const sem = simular(false),
      com = simular(true);
    ok(com.h > sem.h && com.f > sem.f, "cuidados não melhoraram a recuperação");
    S = JSON.parse(base);
    const p = mkPerson({ rel: "filho", age: 40, bond: 36, country: "BR" });
    S.people = [p];
    npcVida(p).contato = S.year - 4;
    R.f = () => 0.05;
    npcIniciativa();
    const e = S.pending.find((e) => e.id === "filho41");
    ok(
      e?.d.tipo === "retomar",
      "filho adulto distante não tentou retomar contato",
    );
    EVENTS.filho41.pick("ouvir", e.d);
    EVENTS.filho41.pick("ouvir", e.d);
    ok(
      p.bond === 40 && p.vida.contato === S.year,
      "resposta não recuperou confiança ou foi repetida",
    );
    ok(
      filho41Tipo({
        ...p,
        bond: 72,
        vida: { ...p.vida, semEmprego: 2 },
        job: null,
      }) === "conselho",
      "pedido de conselho não responde à situação de trabalho",
    );
    S.pending = [];
    scStart("zumbi");
    S.pending = [];
    const sc = S.scen;
    ok(
      z41Suprimentos({ dia: 61 }, "remedio") <
        z41Suprimentos({ dia: 1 }, "remedio"),
      "fases não afetam suprimentos",
    );
    sc.dia = 91;
    sc.winNow = 1;
    scCheck();
    ok(S.scen === sc && S.me.alive, "modo zumbi terminou sem morte");
    EVENTS.z_grupo41.pick("noticias", { dia: sc.dia, grupo: 3 });
    EVENTS.z_grupo41.pick("noticias", { dia: sc.dia, grupo: 3 });
    ok(sc.z41.marcos.length === 1, "encontro não registrou escolha única");
    S = JSON.parse(JSON.stringify(S));
    S.scen.hl = 0;
    scCheck();
    ok(
      !S.me.alive && S.me.zResumo39?.marcos.length === 1 && META.zrec >= 91,
      "fim da partida perdeu escolhas ou recorde",
    );
    return true;
  } finally {
    S = s0;
    R.f = rf;
    window.NO_SAVE = noSave;
    META = JSON.parse(meta);
    SNAPS = snaps;
    modal = modal0;
  }
}
