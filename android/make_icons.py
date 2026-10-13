"""Gera os ícones do Android (mipmap) a partir do desenho do ícone do jogo."""
import os, sys

from PIL import Image

src, res = sys.argv[1], sys.argv[2]
img = Image.open(src).convert("RGBA")
for name, px in [("mdpi", 48), ("hdpi", 72), ("xhdpi", 96), ("xxhdpi", 144), ("xxxhdpi", 192)]:
    d = os.path.join(res, "mipmap-" + name)
    os.makedirs(d, exist_ok=True)
    img.resize((px, px), Image.LANCZOS).save(os.path.join(d, "ic_launcher.png"))
print("ok")
