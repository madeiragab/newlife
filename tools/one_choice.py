import re, sys
# lista eventos de pack com só uma escolha
for f in sys.argv[1:]:
    for n, line in enumerate(open(f, encoding='utf-8'), 1):
        m = re.match(r"\s+\['((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)',\[(.*)$", line)
        if not m: continue
        rest = m.group(3)
        depth, i, items, cur, q = 0, 0, [], '', False
        while i < len(rest):
            c = rest[i]
            if c == '\\': cur += rest[i:i+2]; i += 2; continue
            if c == "'": q = not q
            if not q and c == ']': break
            if not q and c == ',': items.append(cur); cur = ''
            else: cur += c
            i += 1
        items.append(cur)
        if len([x for x in items if '|' in x]) < 2: print(f'{f}:{n} {m.group(1)}')
