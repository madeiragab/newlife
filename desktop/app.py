"""NewLife para Windows: abre o jogo numa janela própria (WebView2).

O progresso é gravado em arquivos em %LOCALAPPDATA%\\OutraVida\\saves (com cópia .bak do salvamento anterior),
além do armazenamento interno do navegador.

Sempre que abre, o app confere no site se existe uma versão mais nova do jogo. Se existir, baixa para
%LOCALAPPDATA%\\OutraVida\\jogo e recarrega a janela; sem internet, usa a versão mais nova que já tiver.
"""
import hashlib
import shutil
import json
import os
import re
import sys
import time
import urllib.request

import webview

SITE = "https://madeiragab.github.io/newlife/"


def resource(name):
    base = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base, name)


def html_version(path):
    """Lê o carimbo NL_VER do começo do arquivo (aaMMddHHmm)."""
    try:
        with open(path, encoding="utf-8") as f:
            head = f.read(6000)
        m = re.search(r"NL_VER='(\d+)'", head)
        return m.group(1) if m else ""
    except OSError:
        return ""


def valid_game(path):
    try:
        data = open(path, 'rb').read()
        if len(data) < 100000 or not html_version(path):
            return False
        digest_path = path + '.sha256'
        return not os.path.exists(digest_path) or hashlib.sha256(data).hexdigest() == open(digest_path).read().strip()
    except (OSError, ValueError):
        return False


def page_url(path):
    return "file:///" + path.replace("\\", "/")


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
        """Lê os saves; se um arquivo estiver estragado, usa a cópia .bak do salvamento anterior."""
        out = {}
        for name in os.listdir(self.folder):
            if name.endswith(".json"):
                path = os.path.join(self.folder, name)
                for cand in (path, path + ".bak"):
                    try:
                        with open(cand, encoding="utf-8") as f:
                            data = f.read()
                        json.loads(data)
                        out[name[:-5]] = data
                        break
                    except (OSError, ValueError):
                        continue
        return out


def fetch(url, timeout):
    req = urllib.request.Request(url, headers={"Cache-Control": "no-cache", "User-Agent": "NewLife"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def check_update(window, game_file, current):
    """Roda em segundo plano depois que a janela abre: baixa a versão nova e recarrega."""
    # espera a página do jogo carregar, senão a rodinha de progresso não tem onde aparecer
    try:
        window.events.loaded.wait(15)
    except Exception:
        time.sleep(3)
    t_start = time.time()
    try:
        info = json.loads(fetch(SITE + "version.json?t=%d" % time.time(), 8).decode("utf-8"))
        remote = str(info.get("v", ""))
        if not remote or remote <= current:
            return
        size = int(info.get("size") or 2500000)
        js = lambda p: window.evaluate_js("window.nlUpdVer='%s';window.nlUpd&&nlUpd(%.3f)" % (remote, p))
        js(0)
        req = urllib.request.Request(SITE + "app.html?t=%d" % time.time(), headers={"Cache-Control": "no-cache", "User-Agent": "NewLife"})
        parts, got, last = [], 0, 0
        with urllib.request.urlopen(req, timeout=60) as r:
            while True:
                chunk = r.read(32768)
                if not chunk:
                    break
                parts.append(chunk)
                got += len(chunk)
                if got - last > size / 40:
                    last = got
                    js(min(0.99, got / size))
        js(1)
        data = b"".join(parts)
        if len(data) != size or not re.fullmatch(r"[0-9a-f]{64}", str(info.get('sha256', ''))) or hashlib.sha256(data).hexdigest() != info['sha256']:
            raise ValueError('Integridade da atualização inválida')
        html = data.decode("utf-8")
        if len(html) < 100000 or ("NL_VER='%s'" % remote) not in html:
            return
        os.makedirs(os.path.dirname(game_file), exist_ok=True)
        tmp = game_file + ".tmp"
        with open(tmp, "wb") as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        if valid_game(game_file):
            shutil.copy2(game_file, game_file + '.bak')
            with open(game_file + '.bak.sha256', 'w') as f:
                f.write(hashlib.sha256(open(game_file, 'rb').read()).hexdigest())
        with open(game_file + '.sha256', 'w') as f:
            f.write(info['sha256'])
        os.replace(tmp, game_file)
        try:
            window.evaluate_js("try{save()}catch(e){}")
        except Exception:
            pass
        time.sleep(max(1.2, 2.5 - (time.time() - t_start)))  # a rodinha aparece girando pelo menos uma volta
        window.load_url(page_url(game_file))
    except Exception:
        try:
            window.evaluate_js("typeof UPD!=='undefined'&&UPD&&UPD.close('Atualização não instalada. Continuando com a versão atual.')")
        except Exception:
            pass


def main():
    # deixa a música da tela de atualização tocar sem precisar de um clique antes
    os.environ.setdefault("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--autoplay-policy=no-user-gesture-required")
    profile = "OutraVida-teste" if "--perfil-teste" in sys.argv else "OutraVida"
    data_dir = os.path.join(os.environ.get("LOCALAPPDATA", os.path.expanduser("~")), profile)
    os.makedirs(data_dir, exist_ok=True)
    bundled = resource("outra-vida.html")
    game_file = os.path.join(data_dir, "jogo", "outra-vida.html")
    if not valid_game(game_file) and valid_game(game_file + '.bak'):
        shutil.copy2(game_file + '.bak', game_file)
        with open(game_file + '.sha256', 'w') as f:
            f.write(hashlib.sha256(open(game_file, 'rb').read()).hexdigest())
    flags = [f for f in ("--teste", "--demo", "--autoano") if f in sys.argv]
    # usa a versão mais nova que existir no computador (a baixada do site ou a que veio no .exe)
    use_downloaded = not flags and valid_game(game_file) and html_version(game_file) > html_version(bundled)
    path = game_file if use_downloaded else bundled
    current = html_version(path)
    page = page_url(path)
    for flag in flags:
        page += "#" + flag[2:]
    window = webview.create_window(
        "NewLife",
        url=page,
        width=500,
        height=880,
        min_size=(380, 600),
        background_color="#22305E",
        text_select=False,
        js_api=Api(os.path.join(data_dir, "saves")),
    )
    if flags:
        webview.start(gui="edgechromium", private_mode=False, storage_path=data_dir)
    else:
        webview.start(check_update, (window, game_file, current), gui="edgechromium", private_mode=False, storage_path=data_dir)


if __name__ == "__main__":
    main()
