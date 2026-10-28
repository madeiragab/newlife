import io,re,glob,sys
exec(open('tools/audit_events.py',encoding='utf-8').read().split("out = {")[0])
ITEM = re.compile(r"\b(ganhei|ganhamos|me deu|me deram|nos deu|nos deram|deram|deixou|de presente|achei|achamos|encontrei|encontramos|peguei|pegamos|comprei|recebi|recebemos|trouxe|trouxeram|trouxemos|voltei com|voltamos com|saí com|saímos com|carregad|agora tenho|agora temos|caixa|presente|levamos|conseguimos)\b", re.I)
NEG = re.compile(r"\b(nada|ninguém|nenhum|nenhuma|não achei|não achamos|vazi|só lixo|de mãos vazias)\b", re.I)
NOUN = re.compile(r"(munição|balas?|remédio|kit|comida|enlatad|lata|água|gasolina|galão|galões|combustível|pistola|espingarda|rifle|arma|faca|facão|machado|mapa|rádio|poção|poções|espada|gema|cristal|livro|grimório|mel|ovo|peixe|carne|pão|moedas|ouro|dinheiro|chocolate|roupa|casaco|colete|semente|biscoito|doce|sardinha|arroz|ração|vacina|antibiótico|sinalizador|corda|lona|isqueiro|lanterna|ferramenta|sucata|peças|bateria|pilha|carro|picape|moto|caminhão|tesouro|joia|baú|suprimento|mantimento|presente|carga)", re.I)
GAIN = re.compile(r"(^|\s)(it:|ouro\+|\$\+|zcom\+|zagua\+|zmat\+|vcom\+|vrou\+|vman\+|spell|crew|veh\+|zarm\+|item:|sc\.\w+\+|o2\+|gas\+|pet\b|bebe|fome-|sede-)")
res=[]
for f in sorted(glob.glob('src/ev_*.js')):
    for ln in io.open(f,encoding='utf-8'):
        if not re.match(r"^\s+\['", ln): continue
        ss=strings(ln)
        if len(ss)<3: continue
        for c in ss[2:]:
            if '|' not in c: continue
            p=c.split('|'); toks=(p[1] if len(p)>1 else '').split()
            qi=next((i for i,t in enumerate(toks) if t.startswith('?')),-1)
            base=' '.join(toks[:qi]) if qi>=0 else ''; succ=' '.join(toks[qi+1:]) if qi>=0 else ' '.join(toks)
            pairs=[(base+' '+succ,p[2] if len(p)>2 else '')]
            if len(p)>3: pairs.append((base+' '+p[3],p[4] if len(p)>4 else ''))
            for fx,txt in pairs:
                if ITEM.search(txt) and NOUN.search(txt) and not NEG.search(txt) and not GAIN.search(fx):
                    res.append(' | '.join([f[4:],ss[0],p[0],txt,fx.strip()]))
print(len(res)); print('\n'.join(res))
