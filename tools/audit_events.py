# Procura eventos (formato pack) cujo texto promete algo que os efeitos não fazem:
# nascimento sem bebê, morte sem ninguém morrer, item ganho sem item.
# uso: python -I tools/audit_events.py [categoria]  -> imprime arquivo|título|rótulo|texto|efeitos
import io, re, glob, sys, json
BIRTH = re.compile(r'\b(nasceu|nasceram|deu à luz|bebê saudável|primeiro bebê|um bebê nascido|nasceu um)\b', re.I)
DEATH = re.compile(r"(morreu|morreram|perdemos (alguém|um morador|moradores|\{c\}|gente)|não resistiu|não sobreviveu|não voltou|virou zumbi|virou de madrugada|foi devorad|não conseguimos salvá|uma vítima|perdemos [0-9]|morreu de|ninguém voltou|quem foi não voltou|não voltaram)", re.I)
ITEM = re.compile(r"\b(ganhei|me deu|me deram|nos deu|nos deram|deixou (um|uma|munição|comida)|de presente|achei (um|uma|munição|comida|remédio|gasolina|armas?|duas|dois|três)|achamos (um|uma|munição|comida|caixas|armas|remédio)|peguei (um|uma|dois|duas)|comprei|recebi|trouxe (um|uma)|voltei carregad|saímos carregad|caixa de|mandaram (kits?|munição|comida|um)|pagou com|pagaram com)\b", re.I)
GAIN = re.compile(r"(^|\s)(it:|ouro\+|\$\+|zcom\+|zagua\+|zmat\+|vcom\+|vrou\+|vman\+|spell|crew|veh\+|zarm\+|item:|sc\.\w+\+|o2\+|gas\+|pet\b|bebe)")
KILLT = re.compile(r"(^|\s)(cdie|rdie|zpop-|vpop-|kill|petdie|chp-[3-9]\d|morte)")
BIRTHT = re.compile(r"(^|\s)(bebe|zpop\+|vpop\+|crew|filho|kid)")
def strings(line):
    return re.findall(r"'((?:[^'\\]|\\.)*)'", line)
out = {'nasc': [], 'morte': [], 'item': []}
files = sorted(glob.glob('src/ev_*.js'))
for f in files:
    for ln in io.open(f, encoding='utf-8'):
        if not re.match(r"^\s+\['", ln):
            continue
        ss = strings(ln)
        if len(ss) < 3:
            continue
        title = ss[0]
        for c in ss[2:]:
            if '|' not in c:
                continue
            p = c.split('|')
            lab, fx1 = p[0], (p[1] if len(p) > 1 else '')
            toks = fx1.split()
            qi = next((i for i, t in enumerate(toks) if t.startswith('?')), -1)
            base = ' '.join(toks[:qi]) if qi >= 0 else ''
            succ = ' '.join(toks[qi + 1:]) if qi >= 0 else fx1
            pairs = [(base + ' ' + succ, p[2] if len(p) > 2 else '')]
            if len(p) > 3:
                pairs.append((base + ' ' + p[3], p[4] if len(p) > 4 else ''))
            for fx, txt in pairs:
                if BIRTH.search(txt) and not BIRTHT.search(fx):
                    out['nasc'].append([f, title, lab, txt, fx])
                if DEATH.search(txt) and not KILLT.search(fx):
                    out['morte'].append([f, title, lab, txt, fx])
                if ITEM.search(txt) and not GAIN.search(fx):
                    out['item'].append([f, title, lab, txt, fx])
cat = sys.argv[1] if len(sys.argv) > 1 else None
for k, v in out.items():
    if cat and k != cat:
        continue
    print(f'== {k}: {len(v)}')
    for r in v:
        print(' | '.join(r))
