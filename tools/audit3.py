import io,re,glob
exec(open('tools/audit_events.py',encoding='utf-8').read().split("out = {")[0])
JOIN=re.compile(r"(se juntou|entrou no grupo|entrou para o grupo|veio com a gente|viaja com a gente|vem com a gente|veio junto|quis vir junto|decidiu viajar|agora viaja|agora mora|veio morar|vieram morar|quis entrar no grupo|juntou-se|jurou lealdade|agora trabalha comigo|virou meu aliado|entrou no meu grupo|virou parte)",re.I)
JOINT=re.compile(r"(^|\s)(crew|crew2|zpop\+|vpop\+|bebe|bicho)")
BITE=re.compile(r"(fui mordid|me mordeu|mordida no|levei uma mordida)",re.I)
for f in sorted(glob.glob('src/ev_*.js')):
    for ln in io.open(f,encoding='utf-8'):
        if not re.match(r"^\s+\['",ln): continue
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
                if JOIN.search(txt) and not JOINT.search(fx) and 'meet' not in fx: print('JUNTA |',f[4:],'|',ss[0],'|',p[0],'|',txt,'|',fx.strip())
                if BITE.search(txt) and 'bite' not in fx and 'scen' in open(f,encoding='utf-8').read(200) : print('MORDIDA |',f[4:],'|',ss[0],'|',p[0],'|',txt,'|',fx.strip())
