package com.mediaservi.adposterlink;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/* ADPOSTER LINK v1.0 · GPL-3.0 · mediaservi.com
   Abre el reproductor de ADPOSTER a pantalla completa, sin menús ni barras, y lo deja reproduciendo.
   · La primera vez abre adposter.mediaservi.com/tv: sale el código de 6 caracteres para dar de alta la pantalla desde el gestor.
   · Recuerda la dirección de su lista: al volver la luz arranca sola y sigue donde estaba (giro, idioma y canal incluidos).
   · Sin conexión: el reproductor sigue con lo que tiene guardado; si no hay nada, reintenta cada 15 segundos.
   · Menú de la app: tecla MENÚ del mando, mantener ATRÁS o pulsar ATRÁS tres veces seguidas. */
public class MainActivity extends Activity {
    static final String PREF = "adposterlink", HOST = "adposter.mediaservi.com", ALTA = "https://adposter.mediaservi.com/tv/";
    private WebView web;
    private SharedPreferences pref;
    private final Handler h = new Handler(Looper.getMainLooper());
    private boolean sinRed = false;
    private long[] atras = new long[3];
    private final Runnable reintenta = new Runnable() { public void run() { if (sinRed && web != null) { sinRed = false; web.loadUrl(destino()); } } };

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        pref = getSharedPreferences(PREF, MODE_PRIVATE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON | WindowManager.LayoutParams.FLAG_FULLSCREEN
                | WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        web = new WebView(this);
        web.setBackgroundColor(Color.BLACK);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setUserAgentString(s.getUserAgentString() + " ADPOSTERLINK/1.0");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new Cliente());
        setContentView(web);
        pantallaCompleta();
        web.loadUrl(destino());
        h.postDelayed(new Runnable() { public void run() { avisoPermiso(); } }, 4000);
    }

    /* la dirección de su lista si ya está dada de alta; si no, la página de alta con código */
    private String destino() { String u = pref.getString("url", null); return u != null ? u : ALTA; }

    private class Cliente extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView v, String url) { return !nuestra(Uri.parse(url)); }
        @Override
        public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) { return !nuestra(r.getUrl()); }
        @Override
        public void onPageFinished(WebView v, String url) {
            if (sinRed) return;
            Uri u = Uri.parse(url);
            if (!nuestra(u) || u.getPath() == null) return;
            /* se recuerda la dirección de reproducción (…/p/?l=lista&rot=…&canal=…), nunca la del alta ni la vista previa */
            boolean reproductor = u.getPath().startsWith("/p/") && u.getQueryParameter("l") != null && u.getQueryParameter("alta") == null && u.getQueryParameter("prev") == null;
            if (reproductor && !url.equals(pref.getString("url", null))) pref.edit().putString("url", url).apply();
        }
        @Override
        public void onReceivedError(WebView v, WebResourceRequest r, WebResourceError e) {
            if (Build.VERSION.SDK_INT >= 21 && r.isForMainFrame()) sinConexion();
        }
        @SuppressWarnings("deprecation")
        @Override
        public void onReceivedError(WebView v, int code, String desc, String url) { sinConexion(); }
        @Override
        public boolean onRenderProcessGone(WebView v, RenderProcessGoneDetail d) {
            /* si el motor del navegador se cae, la app se rehace sola y vuelve a reproducir */
            if (web != null) { ((android.view.ViewGroup) web.getParent()).removeView(web); web.destroy(); web = null; }
            recreate();
            return true;
        }
    }

    private static boolean nuestra(Uri u) { return u != null && "https".equals(u.getScheme()) && HOST.equals(u.getHost()); }

    private void sinConexion() {
        if (sinRed || web == null) return;
        sinRed = true;
        String html = "<html><body style='margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#000;color:#ffb000;font:400 4vh sans-serif;text-align:center'>"
                + "<div>ADPOSTER LINK<br><span style='color:#9aa0aa;font-size:3vh'>" + getString(R.string.sin_red) + "</span></div></body></html>";
        web.loadDataWithBaseURL(null, html, "text/html", "utf-8", null);
        h.removeCallbacks(reintenta);
        h.postDelayed(reintenta, 15000);
    }

    private void pantallaCompleta() {
        View d = getWindow().getDecorView();
        d.setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }

    @Override
    public void onWindowFocusChanged(boolean f) { super.onWindowFocusChanged(f); if (f) pantallaCompleta(); }

    @Override
    protected void onResume() { super.onResume(); if (web != null) web.onResume(); pantallaCompleta(); }

    @Override
    protected void onPause() { super.onPause(); /* la reproducción no se para: es un cartel, sigue aunque algo se ponga delante */ }

    @Override
    protected void onDestroy() { h.removeCallbacksAndMessages(null); if (web != null) web.destroy(); super.onDestroy(); }

    /* ---------- mando: ATRÁS no sale de la app (es un cartel); MENÚ, ATRÁS mantenido o tres veces ATRÁS abren el menú ---------- */
    @Override
    public boolean onKeyDown(int k, KeyEvent e) {
        if (k == KeyEvent.KEYCODE_MENU || k == KeyEvent.KEYCODE_SETTINGS) { menu(); return true; }
        if (k == KeyEvent.KEYCODE_BACK) { e.startTracking(); return true; }
        return super.onKeyDown(k, e);
    }

    @Override
    public boolean onKeyLongPress(int k, KeyEvent e) {
        if (k == KeyEvent.KEYCODE_BACK) { menu(); return true; }
        return super.onKeyLongPress(k, e);
    }

    @Override
    public boolean onKeyUp(int k, KeyEvent e) {
        if (k == KeyEvent.KEYCODE_BACK) {
            if (e.isCanceled()) return true;
            long t = System.currentTimeMillis();
            atras[0] = atras[1]; atras[1] = atras[2]; atras[2] = t;
            if (t - atras[0] < 3000) { atras = new long[3]; menu(); return true; }
            /* un ATRÁS suelto cierra el panel del reproductor si está abierto */
            if (web != null) web.evaluateJavascript("document.body&&document.body.classList.remove('con-panel')", null);
            return true;
        }
        return super.onKeyUp(k, e);
    }

    @Override
    public void onBackPressed() { /* no se sale con ATRÁS */ }

    /* ---------- menú de la app ---------- */
    private void menu() {
        final boolean arranca = !pref.getBoolean("sinArranque", false), kiosco = kioscoTotal();
        String[] op = {
                getString(R.string.recargar),
                getString(R.string.nueva_alta),
                getString(R.string.arranque) + ": " + getString(arranca ? R.string.si : R.string.no),
                getString(R.string.permiso) + (puedeArrancar() ? " ✓" : ""),
                getString(R.string.kiosco) + ": " + getString(kiosco ? R.string.si : R.string.no),
                getString(R.string.ajustes_aparato),
                getString(R.string.salir)
        };
        String sub = pref.getString("url", null);
        new AlertDialog.Builder(this)
                .setTitle("ADPOSTER LINK v1.0" + (sub != null ? "\n" + sub.replace("https://", "") : ""))
                .setItems(op, (d, i) -> {
                    switch (i) {
                        case 0: if (web != null) web.reload(); break;
                        case 1: confirmaAlta(); break;
                        case 2: pref.edit().putBoolean("sinArranque", arranca).apply(); if (!arranca) avisoPermisoForzado(); break;   // arranca = estaba activado: se desactiva; si estaba desactivado se activa y se comprueba el permiso
                        case 3: abrePermiso(); break;
                        case 4: ponKiosco(!kiosco); break;
                        case 5: try { startActivity(new Intent(Settings.ACTION_SETTINGS)); } catch (Exception x) { } break;
                        case 6: finishAffinity(); break;
                    }
                })
                .show();
    }

    private void confirmaAlta() {
        new AlertDialog.Builder(this).setMessage(R.string.nueva_alta_txt)
                .setPositiveButton(R.string.si, (d, i) -> { pref.edit().remove("url").apply(); if (web != null) web.loadUrl(ALTA); })
                .setNegativeButton(R.string.no, null).show();
    }

    /* ---------- arrancar sola al encender: en Android 10+ necesita «Mostrar sobre otras apps» ---------- */
    private boolean puedeArrancar() { return Build.VERSION.SDK_INT < 29 || Settings.canDrawOverlays(this) || kioscoTotal(); }

    private void avisoPermiso() { if (!puedeArrancar() && !pref.getBoolean("avisoVisto", false) && !isFinishing()) avisoPermisoForzado(); }

    private void avisoPermisoForzado() {
        if (puedeArrancar() || isFinishing()) return;
        new AlertDialog.Builder(this).setTitle(R.string.permiso).setMessage(R.string.permiso_txt)
                .setPositiveButton(R.string.dar_permiso, (d, i) -> { pref.edit().putBoolean("avisoVisto", true).apply(); abrePermiso(); })
                .setNegativeButton(R.string.ahora_no, (d, i) -> pref.edit().putBoolean("avisoVisto", true).apply())
                .show();
    }

    private void abrePermiso() {
        if (Build.VERSION.SDK_INT < 23) return;
        Intent[] prueba = {
                new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + getPackageName())),
                new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION),
                new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getPackageName()))
        };
        for (Intent i : prueba) { try { startActivity(i); return; } catch (Exception e) { } }
        new AlertDialog.Builder(this).setMessage(R.string.permiso_adb).setPositiveButton("OK", null).show();
    }

    /* ---------- modo kiosco total: ADPOSTER LINK como pantalla de inicio del aparato ---------- */
    private ComponentName alias() { return new ComponentName(this, getPackageName() + ".Inicio"); }

    private boolean kioscoTotal() { return getPackageManager().getComponentEnabledSetting(alias()) == PackageManager.COMPONENT_ENABLED_STATE_ENABLED; }

    private void ponKiosco(boolean on) {
        getPackageManager().setComponentEnabledSetting(alias(), on ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
        new AlertDialog.Builder(this).setMessage(on ? R.string.kiosco_on : R.string.kiosco_off)
                .setPositiveButton("OK", (d, i) -> { if (on) { Intent h = new Intent(Intent.ACTION_MAIN); h.addCategory(Intent.CATEGORY_HOME); h.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); try { startActivity(h); } catch (Exception e) { } } })
                .show();
    }

    @Override
    protected void onNewIntent(Intent i) { super.onNewIntent(i); pantallaCompleta(); }

    static boolean esAndroidTV(Context c) { return c.getPackageManager().hasSystemFeature("android.software.leanback"); }
}
