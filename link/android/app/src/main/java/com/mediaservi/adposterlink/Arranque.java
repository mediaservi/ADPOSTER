package com.mediaservi.adposterlink;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/* ADPOSTER LINK · al encenderse el aparato (o al actualizarse la app) abre la pantalla de reproducción sin tocar nada.
   En Android 10 o posterior hace falta el permiso «Mostrar sobre otras apps» (la app lo pide la primera vez). GPL-3.0 · mediaservi.com */
public class Arranque extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent i) {
        if (c.getSharedPreferences(MainActivity.PREF, Context.MODE_PRIVATE).getBoolean("sinArranque", false)) return;
        Intent a = new Intent(c, MainActivity.class);
        a.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        a.putExtra("arranque", true);
        try { c.startActivity(a); } catch (Exception e) { /* sin permiso: se abre al pulsarla en el menú */ }
    }
}
