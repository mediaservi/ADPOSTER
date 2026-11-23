/* ADPOSTER · directo: canal en tiempo real entre el gestor, los displays y la página del público.
   No hay servidor propio: los mensajes pasan por un repetidor público (MQTT 3.1.1 mínimo sobre WebSocket: conectar, suscribir,
   publicar sin acuse y latido). Todo cuelga de «adposter/<canal>/», donde <canal> es el código de la instalación (playlists.json → "canal").
     estado/<display>   lo publica cada display (retenido): quién es, qué lista y qué imagen muestra, si está apagado…
     orden/todos | orden/d/<display> | orden/g/<grupo> | orden/s/<sede>   lo publica el gestor: cambiar de lista, aviso, cinta, apagar…
   El público usa OTRO canal, derivado de este (ADDIRECTO.publico): menu/<display> (retenido, las listas elegibles) y pide/<display>.
   Uso: const d = ADDIRECTO.conecta(canal, { temas: ['estado/+'], alMensaje(tema, datos, retenido) {}, alCambiar(conectado) {} }); d.pub('orden/todos', {...});
   Licencia GPL-3.0 · mediaservi.com */
(function () {
  'use strict';
  if (window.ADDIRECTO) return;
  var URLS = window.ADDIRECTO_URLS || ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt', 'wss://test.mosquitto.org:8081/'];
  var canalOk = function (c) { return typeof c === 'string' && /^[a-z0-9]{6,40}$/i.test(c); };
  function conecta(canal, o) {
    o = o || {}; if (!canalOk(canal) || typeof WebSocket === 'undefined') return { pub: function () { return false; }, borra: function () { return false; }, canal: '', up: false, cierra: function () {}, valido: false };
    var raiz = 'adposter/' + canal + '/', te = new TextEncoder(), td = new TextDecoder(), ws = null, buf = new Uint8Array(0), up = false, ping = 0, n = 0, muerto = false, rt = 0, cola = [];
    var str = function (s) { var b = te.encode(s); return [b.length >> 8, b.length & 255].concat(Array.prototype.slice.call(b)); };
    var pkt = function (h, body) { var L = [], x = body.length; do { var d = x % 128; x = Math.floor(x / 128); if (x) d |= 128; L.push(d); } while (x); return new Uint8Array([h].concat(L, body)); };
    var avisa = function (v) { try { o.alCambiar && o.alCambiar(v); } catch (e) {} };
    function abre() {
      if (muerto) return; var w; try { w = ws = new WebSocket(URLS[n % URLS.length], 'mqtt'); } catch (e) { n++; rt = setTimeout(abre, 2000); return; } w.binaryType = 'arraybuffer'; buf = new Uint8Array(0);
      var to = setTimeout(function () { try { w.close(); } catch (e) {} }, 8000);
      w.onopen = function () { w.send(pkt(0x10, str('MQTT').concat([4, 2, 0, 30], str('adp' + Math.random().toString(36).slice(2, 12))))); };
      w.onmessage = function (e) {
        var a = new Uint8Array(e.data), b = new Uint8Array(buf.length + a.length); b.set(buf); b.set(a, buf.length); buf = b;
        for (;;) {
          if (buf.length < 2) return; var i = 1, len = 0, m = 1, d; do { if (i >= buf.length) return; d = buf[i++]; len += (d & 127) * m; m *= 128; } while (d & 128); if (buf.length < i + len) return;
          var h0 = buf[0], t = h0 >> 4, body = buf.slice(i, i + len); buf = buf.slice(i + len);
          if (t === 2) { if (body[1] !== 0) { try { w.close(); } catch (x) {} return; } clearTimeout(to); up = true; var k = 1; (o.temas || []).forEach(function (s) { w.send(pkt(0x82, [0, k++].concat(str(raiz + s), [0]))); });
            clearInterval(ping); ping = setInterval(function () { try { w.send(new Uint8Array([0xC0, 0])); } catch (x) {} }, 20000); var q = cola; cola = []; q.forEach(function (p) { pub(p[0], p[1], p[2]); }); avisa(true); }
          else if (t === 3) { var tl = body[0] << 8 | body[1], tema = td.decode(body.subarray(2, 2 + tl)), dat = null; try { dat = JSON.parse(td.decode(body.subarray(2 + tl))); } catch (x) {} if (tema.indexOf(raiz) === 0 && dat && o.alMensaje) { try { o.alMensaje(tema.slice(raiz.length), dat, !!(h0 & 1)); } catch (x) { console.warn(x); } } }
        }
      };
      w.onclose = function () { clearTimeout(to); if (ws !== w) return; clearInterval(ping); var era = up; up = false; if (era) avisa(false); else n++; if (!muerto) rt = setTimeout(abre, era ? 1500 : 2500); };
      w.onerror = function () {};
    }
    /* pub(tema, datos, retener): retener deja el último mensaje guardado en el repetidor para quien se conecte después (el estado de cada display) */
    function pub(tema, datos, retener) { if (!up) { if (cola.length < 20) cola.push([tema, datos, retener]); return false; } try { ws.send(pkt(retener ? 0x31 : 0x30, str(raiz + tema).concat(Array.prototype.slice.call(te.encode(JSON.stringify(datos)))))); return true; } catch (e) { return false; } }
    /* borra(tema): quita el mensaje retenido de ese tema (un retenido vacío lo elimina del repetidor) */
    function borra(tema) { if (!up) return false; try { ws.send(pkt(0x31, str(raiz + tema))); return true; } catch (e) { return false; } }
    abre();
    return { pub: pub, borra: borra, canal: canal, valido: true, get up() { return up; }, cierra: function () { muerto = true; clearTimeout(rt); clearInterval(ping); try { ws.close(); } catch (e) {} } };
  }
  /* canal del público: se deriva del canal de la instalación con una huella de un solo sentido. Quien escanea el QR recibe solo este código:
     con él puede pedir una de las listas marcadas como «elegible por el público», y nada más (ni avisos, ni apagar, ni el resto de órdenes). */
  function publico(canal) { if (!canalOk(canal) || !window.crypto || !crypto.subtle) return Promise.resolve('');
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode('adposter:publico:' + canal)).then(function (b) { return 'p' + Array.prototype.map.call(new Uint8Array(b).subarray(0, 12), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }, function () { return ''; }); }
  window.ADDIRECTO = { conecta: conecta, canalOk: canalOk, publico: publico, canalNuevo: function () { var s = ''; while (s.length < 16) s += Math.random().toString(36).slice(2); return s.slice(0, 16); } };
})();
