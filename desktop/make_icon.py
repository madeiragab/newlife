"""Gera o .ico do app a partir do desenho do ícone (renderizado do jogo com #demo-icone)."""
import sys

from PIL import Image

src, out = sys.argv[1], sys.argv[2]
img = Image.open(src).convert("RGBA")
img.save(out, sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
