"""NewLife para Windows: abre o jogo numa janela própria (WebView2).

O progresso é gravado em arquivos em %LOCALAPPDATA%\\OutraVida\\saves (com cópia .bak do salvamento anterior),
além do armazenamento interno do navegador.
"""
import os
import re
import sys

import webview


def resource(name):
    base = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base, name)


class Api:
    def __init__(self, folder):
        self.folder = folder
        os.makedirs(folder, exist_ok=True)

    def _path(self, key):
        return os.path.join(self.folder, re.sub(r"[^A-Za-z0-9._-]", "_", key) + ".json")

    def save(self, key, data):
        path = self._path(key)
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        if os.path.exists(path):
            os.replace(path, path + ".bak")
        os.replace(tmp, path)
        return True

    def load_all(self):
        out = {}
        for name in os.listdir(self.folder):
            if name.endswith(".json"):
                try:
                    with open(os.path.join(self.folder, name), encoding="utf-8") as f:
                        out[name[:-5]] = f.read()
                except OSError:
                    pass
        return out


def main():
    profile = "OutraVida-teste" if "--perfil-teste" in sys.argv else "OutraVida"
    data_dir = os.path.join(os.environ.get("LOCALAPPDATA", os.path.expanduser("~")), profile)
    os.makedirs(data_dir, exist_ok=True)
    page = "file:///" + resource("outra-vida.html").replace("\\", "/")
    for flag in ("--teste", "--demo", "--autoano"):
        if flag in sys.argv:
            page += "#" + flag[2:]
    webview.create_window(
        "NewLife",
        url=page,
        width=500,
        height=880,
        min_size=(380, 600),
        background_color="#22305E",
        text_select=False,
        js_api=Api(os.path.join(data_dir, "saves")),
    )
    webview.start(gui="edgechromium", private_mode=False, storage_path=data_dir)


if __name__ == "__main__":
    main()
