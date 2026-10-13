# Junta um bloco de eventos (arquivo de texto) antes de um marcador num arquivo de eventos.
# uso: python -I tools/merge_events.py destino.js bloco.txt "marcador"   (marcador vazio = antes do último "]);")
import io, re, sys
dest, block = sys.argv[1], sys.argv[2]
mark = sys.argv[3] if len(sys.argv) > 3 else ''
s = io.open(dest, encoding='utf-8').read()
add = io.open(block, encoding='utf-8').read()
i = s.index(mark) if mark else s.rindex(']);')
s = s[:i] + add + s[i:]
io.open(dest, 'w', encoding='utf-8', newline='').write(s)
print(len(re.findall(r"^  \['", s, re.M)))
