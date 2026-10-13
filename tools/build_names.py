"""Gera src/names_data.js: nomes e sobrenomes por país e gênero, com peso por frequência.

Fontes:
- Brasil: API de nomes do Censo 2022 do IBGE (servicodados.ibge.gov.br), dados públicos.
- Outros países: popular-names-by-country-dataset (sigpwned, licença CC0) + listas do próprio jogo (src/names.js).
A API do IBGE devolve nomes sem acento; os acentos são restaurados por dicionário, e nomes de grafia duvidosa são descartados.
"""
import csv
import gzip
import json
import math
import os
import re
import sys
import time
import unicodedata
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = sys.argv[1]
COUNTRIES = ['BR', 'PT', 'US', 'AR', 'MX', 'JP', 'IT', 'FR', 'DE', 'GB', 'AO', 'CA', 'ES', 'KR', 'IN']
PAGES = {'M': 24, 'F': 24, 'L': 30}  # 30 itens por página


def strip(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').lower()


def fetch(url, path):
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=40) as r:
                raw = r.read()
                if raw[:2] == b'\x1f\x8b':
                    raw = gzip.decompress(raw)
                data = json.loads(raw.decode('utf-8'))
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f)
            time.sleep(0.25)
            return data
        except Exception as e:  # noqa: BLE001
            print('retry', url, e)
            time.sleep(2 + attempt * 2)
    raise SystemExit('falhou: ' + url)


# listas do jogo (com acentos) servem de dicionário
src = open(os.path.join(ROOT, 'src', 'names.js'), encoding='utf-8').read()
game = {}
for cid, body in re.findall(r'\n(\w\w):\{(.*?)\n?\}', src, re.S):
    game[cid] = {}
    for k in 'MFL':
        mm = re.search(k + r':`(.*?)`', body, re.S)
        game[cid][k] = [w.replace('_', ' ') for w in mm.group(1).split()] if mm else []

ACC = {}
for cid in ('BR', 'PT'):
    for k in 'MFL':
        for w in game[cid][k]:
            ACC.setdefault(strip(w), w)
EXTRA = json.load(open(os.path.join(ROOT, 'tools', 'accents.json'), encoding='utf-8'))
for w in EXTRA:
    ACC[strip(w)] = w
RISKY = re.compile(r'(ao|aos|oes|aes|cao|ia|io|ea|eo|ua|uo|ica|ico|ula|ulo|ola|olo|ida|ido|ima|imo|ega|ego|ecia|icio|ilia|ilio|amo|ama|ania|onio|ozio|atia|eia|elia|ario|aria|ucio|ucia|esio|asio|etia)$|cao|coes|^(jo|ju|li|lu|ma|mo|so|vi|va)$')


def fix(name):
    k = name.lower()
    if k in ACC:
        return ACC[k]
    if RISKY.search(k):
        return None
    return k[:1].upper() + k[1:]


out = {}
dropped = {}
for k, sexo in (('M', '&sexo=M'), ('F', '&sexo=F'), ('L', '')):
    kind = 'sobrenome' if k == 'L' else 'nome'
    items = []
    for p in range(1, PAGES[k] + 1):
        url = f'https://servicodados.ibge.gov.br/api/v3/nomes/2022/localidade/0/ranking/{kind}?page={p}{sexo}'
        items += fetch(url, os.path.join(CACHE, f'ibge-{k}-{p}.json'))['items']
    res, dr = [], []
    for it in items:
        n = fix(it['nome'])
        (res if n else dr).append((n or it['nome'], it['frequencia']))
    seen = set()
    lst = []
    for n, fr in res:
        if n in seen:
            continue
        seen.add(n)
        lst.append([n, max(1, round(math.sqrt(fr) / 10))])
    # nomes do jogo que o IBGE não trouxe entram com peso baixo
    for w in game['BR'][k]:
        if w not in seen:
            seen.add(w)
            lst.append([w, 3])
    out.setdefault('BR', {})[k] = lst
    dropped[k] = dr[:200]

# demais países
fore = list(csv.DictReader(open(os.path.join(CACHE, 'common-forenames-by-country.csv'), encoding='utf-8-sig')))
sur = list(csv.DictReader(open(os.path.join(CACHE, 'common-surnames-by-country.csv'), encoding='utf-8-sig')))
for cid in COUNTRIES:
    if cid == 'BR':
        continue
    d = {}
    for k in 'MF':
        names = [r['Romanized Name'].strip() for r in fore if r['Country'] == cid and r['Gender'] == k]
        d[k] = names
    d['L'] = [r['Romanized Name'].strip().title() if r['Romanized Name'].isupper() else r['Romanized Name'].strip() for r in sur if r['Country'] == cid]
    res = {}
    for k in 'MFL':
        seen, lst = set(), []
        for w in d[k] + game.get(cid, {}).get(k, []):
            w = w.strip()
            if not w or w in seen or len(w) > 18:
                continue
            seen.add(w)
            lst.append([w, 1])
        res[k] = lst
    out[cid] = res

js = '// Gerado por tools/build_names.py: IBGE (Censo 2022) para o Brasil; sigpwned/popular-names-by-country-dataset (CC0) + listas do jogo para os demais.\nconst NAME_DB=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
open(os.path.join(ROOT, 'src', 'names_data.js'), 'w', encoding='utf-8').write(js)
print({c: {k: len(v) for k, v in out[c].items()} for c in out})
print('descartados (sem acento confiável):')
for k in 'MFL':
    print(k, ', '.join(n for n, _ in dropped[k][:120]))
