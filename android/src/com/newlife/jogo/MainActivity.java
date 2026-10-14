package com.newlife.jogo;

import android.app.Activity;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Window;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * NewLife para Android: o jogo inteiro roda numa WebView e funciona offline.
 * Sempre que o app abre, ele confere no site se existe uma versão mais nova do jogo; se existir,
 * baixa, guarda no armazenamento do app e recarrega. O progresso não muda de lugar: a página é
 * sempre aberta com o mesmo endereço base, então o armazenamento local continua o mesmo.
 */
public class MainActivity extends Activity {
    private static final String SITE = "https://madeiragab.github.io/newlife/";
    private static final String BASE_URL = "file:///android_asset/index.html";
    private WebView web;
    private String loadedVer = "";
    private boolean checked = false;
    private long startedAt = 0;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        Window w = getWindow();
        w.setStatusBarColor(Color.parseColor("#2E6BFF"));
        w.setNavigationBarColor(Color.BLACK);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#2E6BFF"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setTextZoom(100);
        s.setMediaPlaybackRequiresUserGesture(false); // a música da tela de atualização toca sozinha
        web.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView v, String url) {
                // só procura atualização depois que o jogo carregou: assim a rodinha de progresso aparece
                if (!checked) { checked = true; checkUpdate(); }
            }
        });
        web.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        setContentView(web);
        loadGame();
    }

    // ---------- versão ----------
    private File gameFile() { return new File(getFilesDir(), "game.html"); }
    private SharedPreferences prefs() { return getSharedPreferences("newlife", MODE_PRIVATE); }

    private String bundledVer() {
        try {
            return new String(readAll(getAssets().open("version.txt")), "UTF-8").trim();
        } catch (Exception e) { return ""; }
    }

    private String downloadedVer() { return gameFile().exists() ? prefs().getString("ver", "") : ""; }

    /** Abre a versão mais nova que existir no aparelho: a baixada do site ou a que veio no app. */
    private void loadGame() {
        String b = bundledVer(), d = downloadedVer();
        if (d.length() > 0 && d.compareTo(b) > 0) {
            try {
                String html = new String(readAll(new FileInputStream(gameFile())), "UTF-8");
                loadedVer = d;
                web.loadDataWithBaseURL(BASE_URL, html, "text/html", "UTF-8", null);
                return;
            } catch (Exception e) { /* arquivo estragado: usa a versão do app */ }
        }
        loadedVer = b;
        web.loadUrl(BASE_URL);
    }

    // ---------- atualização automática ----------
    private void checkUpdate() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String json = new String(get(SITE + "version.json?t=" + System.currentTimeMillis(), 8000), "UTF-8");
                    Matcher mv = Pattern.compile("\"v\"\\s*:\\s*\"(\\d+)\"").matcher(json);
                    if (!mv.find()) return;
                    final String remote = mv.group(1);
                    if (remote.compareTo(loadedVer) <= 0) return;
                    Matcher ms = Pattern.compile("\"size\"\\s*:\\s*(\\d+)").matcher(json);
                    final long size = ms.find() ? Long.parseLong(ms.group(1)) : 2500000L;
                    startedAt = System.currentTimeMillis();
                    progress(remote, 0);
                    String html = new String(download(SITE + "app.html?t=" + System.currentTimeMillis(), remote, size), "UTF-8");
                    if (html.length() < 100000 || !html.contains("NL_VER='" + remote + "'")) return;
                    html = html.replace("<script>window.DESKTOP=1</script>", "");
                    File tmp = new File(getFilesDir(), "game.tmp");
                    FileOutputStream out = new FileOutputStream(tmp);
                    out.write(html.getBytes("UTF-8"));
                    out.close();
                    if (!tmp.renameTo(gameFile())) { gameFile().delete(); if (!tmp.renameTo(gameFile())) return; }
                    prefs().edit().putString("ver", remote).apply();
                    // a rodinha aparece girando pelo menos uma volta, mesmo com download rápido
                    long wait = Math.max(1200, 2500 - (System.currentTimeMillis() - startedAt));
                    try { Thread.sleep(wait); } catch (InterruptedException ie) { }
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            // salva o jogo atual e abre a versão nova
                            web.evaluateJavascript("try{save()}catch(e){}", new ValueCallback<String>() {
                                @Override
                                public void onReceiveValue(String v) { loadGame(); }
                            });
                        }
                    });
                } catch (Exception e) { /* sem internet: segue com a versão que já tem */ }
            }
        }).start();
    }

    /** Avisa a tela de atualização do jogo (anel de progresso) em que ponto está o download. */
    private void progress(final String ver, final double p) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() { web.evaluateJavascript("window.nlUpdVer='" + ver + "';window.nlUpd&&nlUpd(" + p + ")", null); }
        });
    }

    private byte[] download(String url, String ver, long size) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(15000);
        c.setReadTimeout(60000);
        c.setUseCaches(false);
        try {
            if (c.getResponseCode() != 200) throw new Exception("http " + c.getResponseCode());
            InputStream in = c.getInputStream();
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            byte[] buf = new byte[16384];
            int n; long got = 0; long last = 0;
            while ((n = in.read(buf)) > 0) {
                b.write(buf, 0, n); got += n;
                if (got - last > size / 40) { last = got; progress(ver, Math.min(0.99, (double) got / size)); }
            }
            in.close();
            progress(ver, 1);
            return b.toByteArray();
        } finally { c.disconnect(); }
    }

    private static byte[] get(String url, int timeout) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(timeout);
        c.setReadTimeout(timeout);
        c.setUseCaches(false);
        c.setRequestProperty("Cache-Control", "no-cache");
        try {
            if (c.getResponseCode() != 200) throw new Exception("http " + c.getResponseCode());
            return readAll(c.getInputStream());
        } finally { c.disconnect(); }
    }

    private static byte[] readAll(InputStream in) throws Exception {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        byte[] buf = new byte[16384];
        int n;
        while ((n = in.read(buf)) > 0) b.write(buf, 0, n);
        in.close();
        return b.toByteArray();
    }

    // ---------- ciclo de vida ----------
    @Override
    protected void onPause() {
        super.onPause();
        // garante que o último ano jogado foi gravado antes do app ir para o fundo
        web.evaluateJavascript("try{save()}catch(e){}", null);
        web.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        web.evaluateJavascript("(window.androidBack&&window.androidBack())?'1':'0'", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String v) {
                if (v == null || !v.contains("1")) MainActivity.super.onBackPressed();
            }
        });
    }
}
