"""Lista eventos (pacotes do DSL) que têm só uma escolha."""
import re, sys, os
root = sys.argv[1] if len(sys.argv) > 1 else '.'
STR = r"'(?:[^'\\]|\\.)*'"
tot = 0; one = []
pat = re.compile(r"\[\s*(" + STR + r")\s*,\s*(?:" + STR + r"|\[[^\]]*\])\s*,\s*\[((?:\s*" + STR + r"\s*,?)+)\]")
for f in ['ev_jobs.js', 'ev_life.js', 'ev_world.js', 'ev_more.js', 'ev_pets.js']:
    s = open(os.path.join(root, 'src', f), encoding='utf-8').read()
    for m in pat.finditer(s):
        tot += 1
        ch = re.findall(STR, m.group(2))
        if len(ch) < 2: one.append((f, m.group(1), ch[0][:100]))
print('pack events', tot, 'single-choice', len(one))
by = {}
for f, t, c in one: by[f] = by.get(f, 0) + 1
print(by)
for o in one: print(o[0], '|', o[1], '|', o[2])
