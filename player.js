/* ADPOSTER · reproductor de cartelería digital para displays FHD, en vertical o en horizontal
   Arranca solo: basta con dar la URL de la playlist (…/cine, …/klub, …/p/?l=nombre) como página de inicio del kiosco.
   Lee playlists.json (ajustes) y assets/manifest.json (qué hay en cada carpeta), baraja sin repetir, intercala anuncios,
   vuelve a mirar cada pocos minutos por si hay contenido nuevo y sigue funcionando si se cae la red.
   v1.0 · formato horizontal (póster y anuncio a la vez), vídeo, cinta de texto (fija o de un RSS), código QR y, si la instalación tiene
   un canal en directo (directo.js), obedece al gestor al momento: cambiar de lista, aviso, cinta, apagar, recargar e identificarse.
   v1.1 · composiciones: una lista puede ser una serie de ESCENAS (escena.js) con textos, imágenes, zonas, reloj, el tiempo, noticias y QR;
   calendario (qué lista toca según la fecha, el día y la hora), orden fijo y duración por archivo.
   v1.2 · sin conexión: registra el service worker (sw.js) y le pide guardar las imágenes de la lista; si se cae la red, el display sigue con la última copia.
   v1.4 · toda la variedad guardada: el display descarga UNA vez todas las imágenes de todas las listas (también de un origen privado) y después
   las enseña desde su copia, sin volver a pedirlas; solo baja las nuevas o cambiadas (la «huella» de cada archivo en manifest.json).
   v1.23 · (versión de la app; antes el reproductor llevaba su propia numeración, «v1.4») alta con CÓDIGO (…/p/?alta), listas que llegan por el directo
   (mensaje retenido «datos»: sin subir archivos), A PANTALLAS durante N minutos, EMERGENCIA a pantalla completa hasta retirarla (retenida y con sonido),
   TURNOS y PEDIDOS LISTOS con campana y voz, lista TÁCTIL, horario con varios tramos y festivos, días y horas por cartel y por escena, anuncios entre
   escenas, lienzo A MEDIDA para LED, cinta y QR que no tapan la composición, idioma de la URL e informe de emisión.
   Licencia GPL-3.0 · mediaservi.com */
(() => {
  'use strict';
  const VERSION = '1.24';
  const SC = document.currentScript, Q = new URLSearchParams(location.search);
  const BASE = new URL(SC.dataset.base || '../', location.href).href;
  const ID = (SC.dataset.playlist || Q.get('l') || 'demo').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const PREV = Q.has('prev');                                              // vista previa dentro del gestor
  const K = 'adposter:' + ID + ':';
  /* lo que es del aparato y no de la lista (sobrevive al cambiar de lista): origen privado, canal en directo, identidad del display */
  const G = 'adposter:', leeG = k => { try { return localStorage.getItem(G + k) || ''; } catch (e) { return ''; } }, guardaG = (k, v) => { try { v ? localStorage.setItem(G + k, v) : localStorage.removeItem(G + k); } catch (e) {} };
  const URL_OK = /^(https:\/\/|http:\/\/(localhost|127\.0\.0\.1)[:\/])[^\s"'<>]+$/;
  /* origen privado: un display puede leer sus listas e imágenes de OTRA web con la misma estructura (playlists.json + assets/), que solo conoce él.
     Se le da una vez con ?origen=https://… (queda guardado en ese display; ?origen=no lo quita). Los demás usuarios siguen viendo las muestras públicas. */
  const ORIGEN = (() => { const p = Q.get('origen'), val = p && URL_OK.test(p) ? p.replace(/\/*$/, '/') : ''; if (PREV) return val;
    let viejo = ''; try { viejo = localStorage.getItem(K + 'origen') || ''; } catch (e) {}                                  // hasta v0.9 se guardaba por lista
    if (p === 'no') { guardaG('origen', ''); try { localStorage.removeItem(K + 'origen'); } catch (e) {} } else if (val) guardaG('origen', val); else if (viejo && !leeG('origen')) guardaG('origen', viejo);
    return leeG('origen'); })(), DATOS = ORIGEN || BASE;
  const slug = s => String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);
  /* identidad del display: un código propio y, si se quiere, nombre, grupo y sede (?nombre= ?grupo= ?sede=). ?canal=código lo une al directo (?canal=no lo quita) */
  const DISP = (() => { let d = leeG('disp'); if (!/^[a-z0-9]{6}$/.test(d)) { d = (Math.random().toString(36) + '000000').slice(2, 8); guardaG('disp', d); } return d; })();
  if (!PREV) ['nombre', 'grupo', 'sede', 'canal', 'lang'].forEach(k => { const v = Q.get(k); if (v !== null) guardaG(k, k === 'canal' ? (/^[a-z0-9]{6,40}$/i.test(v) ? v : '') : v.trim().slice(0, 32)); });
  const DEF = { nombre: ID.toUpperCase(), fondo: '', cabecera: 18, pie: 4.5, lado: 5, alinea: 'abajo', contenido: [], anuncios: [], segundos: 8, segundosAnuncio: 8, anunciosCada: [4, 7],
    fundido: { tipo: 'fundido', segundos: 2.5 }, movimiento: true, llenar: false, brillo: true, horario: { activo: false, desde: '09:00', hasta: '23:00', dias: [1, 2, 3, 4, 5, 6, 7] }, redirige: '',
    formato: 'vertical', qr: { activo: false, modo: 'url', url: '', texto: '', pos: 'bd' }, cinta: { activo: false, texto: '', rss: '' }, publico: false, modo: 'carteles', escenas: [], orden: 'azar', secuencia: [], archivos: {}, sueltos: [], adsS: [], tactil: { activo: false, vuelta: 30 } };
  const TIPOS = ['fundido', 'zoom', 'desliza', 'cortina', 'corte'];

  /* ---------- idioma (es · en · ca) ---------- */
  const LANG = (Q.get('lang') || (PREV ? '' : leeG('lang')) || navigator.language || 'es').slice(0, 2).toLowerCase();   // v1.23 · el idioma de la URL del kiosco se queda guardado en el display
  const TX = { 'Duración de cada póster': ['Time per poster', 'Durada de cada pòster'], 'Transición': ['Transition', 'Transició'], 'Carpetas de contenido': ['Content folders', 'Carpetes de contingut'], 'Carpetas de anuncios': ['Ad folders', "Carpetes d'anuncis"],
    'Aceptar y reproducir': ['Apply and play', 'Accepta i reprodueix'], 'Restablecer': ['Reset', 'Restableix'], 'Cerrar': ['Close', 'Tanca'], 'fundido': ['fade', 'fosa'], 'zoom': ['zoom', 'zoom'], 'desliza': ['slide', 'llisca'], 'cortina': ['wipe', 'cortina'], 'corte': ['cut', 'tall'],
    'Sin conexión: reintentando…': ['Offline: retrying…', 'Sense connexió: reintentant…'], 'Esta playlist no tiene imágenes todavía.': ['This playlist has no images yet.', 'Aquesta playlist encara no té imatges.'], 'No existe la playlist': ['Playlist not found', 'No existeix la playlist'],
    'es un proyecto hecho con': ['is a project made with', 'és un projecte fet amb'], 'imágenes': ['images', 'imatges'], 'Contenido privado de este display': ['Private content of this display', 'Contingut privat d’aquest display'], 'Estos ajustes se guardan solo en este display.': ['These settings are saved on this display only.', 'Aquests ajustos es desen només en aquest display.'],
    'Directo': ['Live', 'Directe'], 'conectado': ['connected', 'connectat'], 'sin conexión': ['offline', 'sense connexió'], 'imágenes guardadas en este display': ['images saved on this display', 'imatges desades en aquest display'], 'descargando': ['downloading', 'descarregant'],
    'EMERGENCIA': ['EMERGENCY', 'EMERGÈNCIA'], 'TURNO': ['NOW SERVING', 'TORN'], 'PANTALLA NUEVA': ['NEW SCREEN', 'PANTALLA NOVA'], 'Código de esta pantalla': ['This screen’s code', 'Codi d’aquesta pantalla'],
    'En el gestor: PUBLICAR → Añadir pantalla → escribe este código. O escanea el QR con el móvil.': ['In the manager: PUBLISH → Add screen → type this code. Or scan the QR with your phone.', 'Al gestor: PUBLICA → Afegeix una pantalla → escriu aquest codi. O escaneja el QR amb el mòbil.'],
    'Esperando…': ['Waiting…', 'Esperant…'], 'Sin conexión con el repetidor: reintentando…': ['No relay connection: retrying…', 'Sense connexió amb el repetidor: reintentant…'], '¡Emparejada!': ['Paired!', 'Aparellada!'], 'Turno': ['Number', 'Torn'], 'puesto': ['desk', 'lloc'],
    'Esperando el contenido del gestor…': ['Waiting for content from the manager…', 'Esperant el contingut del gestor…'], 'En el gestor, pulsa «✓ Enviar cambios».': ['In the manager, press “✓ Send changes”.', 'Al gestor, prem «✓ Envia els canvis».'],
    'En el gestor: Añadir pantalla → escribe este código. O escanea el QR con el móvil.': ['In the manager: Add screen → type this code. Or scan the QR with your phone.', 'Al gestor: Afegeix una pantalla → escriu aquest codi. O escaneja el QR amb el mòbil.'],
    'Sin confirmar: el gestor puede retirarla.': ['Unconfirmed: the manager can withdraw it.', 'Sense confirmar: el gestor la pot retirar.'] };
  const T = s => { const t = TX[s]; return !t || LANG === 'es' ? s : (LANG === 'ca' ? t[1] : LANG === 'en' ? t[0] : s); };

  /* ---------- v1.23 · alta con código: …/p/?alta enseña un código de 6 caracteres; el gestor le manda la configuración por el repetidor ---------- */
  if (Q.has('alta') && !PREV) { alta(); return; }
  function alta() { document.body.classList.add('ap', 'alta'); const u = BASE + '?alta=' + DISP, d = document.createElement('div'); d.id = 'alta'; let q = ''; try { const g = window.qrcode(0, 'M'); g.addData(u); g.make(); q = g.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); } catch (e) {}
    d.innerHTML = `<img src="${BASE}assets/logos/adposter-logo.svg" alt="ADPOSTER"><h1>${T('PANTALLA NUEVA')}</h1><p>${T('Código de esta pantalla')}</p><div class="cod">${DISP.toUpperCase()}</div><div class="qr-a">${q}</div><p class="ins">${T('En el gestor: Añadir pantalla → escribe este código. O escanea el QR con el móvil.')}</p><p class="est">${T('Esperando…')}</p>`; document.body.appendChild(d);
    if (!window.ADDIRECTO) return; let ok = false; const est = t => { d.querySelector('.est').textContent = t; };
    /* v1.23 · «hola» retenido: el gestor sabe al momento si el código existe (un código mal tecleado se avisa en segundos, no a los 90 s) */
    const c = window.ADDIRECTO.conecta('alta' + DISP, { temas: ['cfg'], alCambiar: v => { if (v && !ok) c.pub('hola', { d: DISP, t: Date.now() }, true); if (!ok) est(T(v ? 'Esperando…' : 'Sin conexión con el repetidor: reintentando…')); }, alMensaje: (t, x) => { if (t !== 'cfg' || ok || !x || !window.ADDIRECTO.canalOk(x.canal)) return; ok = true;
      guardaG('canal', x.canal); [['n', 'nombre'], ['g', 'grupo'], ['s', 'sede']].forEach(([a, k]) => guardaG(k, String(x[a] || '').trim().slice(0, 32))); if (/^(es|en|ca)$/.test(x.lang || '')) guardaG('lang', x.lang); if (x.origen && URL_OK.test(x.origen)) guardaG('origen', x.origen.replace(/\/*$/, '/'));
      /* v1.23 · las listas llegan con el emparejado: la pantalla enseña su lista al momento, sin esperar a que nadie pulse nada */
      if (x.datos && typeof x.datos === 'object' && x.datos.playlists) try { localStorage.setItem(G + 'vivo', JSON.stringify(x.datos)); } catch (e) {}
      c.borra('hola'); c.pub('ok', { d: DISP, t: Date.now() }); est('✓ ' + T('¡Emparejada!')); const p = new URLSearchParams(); p.set('l', String(x.l || 'demo').toLowerCase().replace(/[^a-z0-9_-]/g, '')); if (+x.rot) p.set('rot', +x.rot); if (x.lang) p.set('lang', String(x.lang).slice(0, 2)); p.set('canal', x.canal);   // el canal va también en la dirección: sirve de página de inicio del kiosco aunque se borre la memoria del aparato
      setTimeout(() => location.replace(BASE + 'p/?' + p), 1500); } }); }

  /* ---------- utilidades ---------- */
  const lee = k => { try { return JSON.parse(localStorage.getItem(K + k)); } catch (e) { return null; } };
  const guarda = (k, v) => { try { v === null ? localStorage.removeItem(K + k) : localStorage.setItem(K + k, JSON.stringify(v)); } catch (e) {} };
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const mezcla = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const entre = (a, b) => a + Math.floor(Math.random() * (Math.max(a, b) - a + 1));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const num = (v, d, a, b) => { v = +v; return isFinite(v) ? Math.min(b, Math.max(a, v)) : d; };
  async function json(ruta) { const r = await fetch(DATOS + ruta + (ruta.includes('?') ? '&' : '?') + 't=' + Math.floor(Date.now() / 60000), { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); return r.json(); }
  const url = f => DATOS + 'assets/' + f.split('/').map(encodeURIComponent).join('/') + (MAN && MAN.huellas && MAN.huellas[f] ? '?v=' + encodeURIComponent(MAN.huellas[f]) : '');   // con huella, la copia guardada vale para siempre

  /* ---------- escenario ---------- */
  document.body.classList.add('ap'); const rot = +Q.get('rot') || 0; if (rot === 90 || rot === 270) document.body.classList.add('rot', 'rot-' + rot); else if (rot === 180) document.body.classList.add('rot-180');   // giro del display: ?rot=90 (derecha), 180 (boca abajo) o 270 (izquierda)
  const escena = el('div'); escena.id = 'escena';
  escena.innerHTML = '<div class="fondo"></div><div class="marco"><div class="capa"><div class="hoja"><img alt=""></div></div><div class="capa"><div class="hoja"><img alt=""></div></div></div><div class="anuncio"><img alt=""></div><div class="anuncio"><img alt=""></div><div class="esc-capa"></div><div class="esc-capa"></div><div class="qr"><div class="q-img"></div><div class="q-txt"></div></div><div class="cinta"><div class="c-in"><span></span></div></div><div class="apagado"></div><div class="alerta"><div class="a-in"></div></div><div class="aviso"></div><div class="emer"><div class="em-t"></div><div class="em-x"></div></div><div class="panel"></div>';
  document.body.appendChild(escena);
  const $ = s => escena.querySelector(s), $$ = s => [...escena.querySelectorAll(s)];
  const CAPAS = { feed: $$('.capa'), ads: $$('.anuncio') }, turno = { feed: 0, ads: 0 };
  const aviso = t => { const a = $('.aviso'); a.textContent = t || ''; a.classList.toggle('on', !!t); };

  /* ---------- ajustes: playlists.json ← ajustes de este display ← vista previa ---------- */
  let MAN = null, LISTAS = null, cfg = null, previa = null, previaMedios = null, pool = { feed: [], ads: [] }, recarga = null, ultimo = Date.now(), gen = 0, diaA = '';
  /* v1.23 · A PANTALLAS sin subir archivos: las listas que manda el gestor por el directo (mensaje retenido «datos») valen mientras sean más nuevas que el playlists.json publicado */
  let LFILE = null, VIVOL = PREV ? null : (() => { try { return JSON.parse(localStorage.getItem(G + 'vivo') || 'null'); } catch (e) { return null; } })();
  const efectivo = l => { if (!l || PREV || !VIVOL || !VIVOL.playlists || +VIVOL.t <= (+l.publicado || 0)) return l; return Object.assign({}, l, { playlists: VIVOL.playlists, agenda: VIVOL.agenda || l.agenda, festivos: VIVOL.festivos || l.festivos, medios: VIVOL.sinMedios ? l.medios : Object.assign({}, l.medios, VIVOL.medios) }); };
  /* v1.23 · las imágenes propias viajan cada una en su propio mensaje retenido (m/<clave>): ya no hay un tope común de ~900 KB para todas.
     Se guardan en el aparato para seguir sin red; las que ya no usa ninguna lista se borran */
  const MED = {}; if (!PREV) try { JSON.parse(localStorage.getItem(G + 'mk') || '[]').forEach(k => { const d = localStorage.getItem(G + 'm:' + k); if (d) MED[k] = d; }); } catch (e) {}
  const faltan = () => { const mk = VIVOL && VIVOL.mk && typeof VIVOL.mk === 'object' ? Object.keys(VIVOL.mk) : [], fm = (LFILE && LFILE.medios) || {}; return mk.filter(k => !MED[k] && !fm[k]).length; };
  function calcula() {
    const base = (LISTAS && LISTAS.playlists && LISTAS.playlists[ID]) || null, local = PREV ? null : lee('local');
    const c = Object.assign({}, DEF, base || {}, local || {}, previa || {}); c.existe = !!(base || previa);
    c.fundido = Object.assign({}, DEF.fundido, (base || {}).fundido, (local || {}).fundido, (previa || {}).fundido); c.horario = Object.assign({}, DEF.horario, (base || {}).horario, (previa || {}).horario); c.tactil = Object.assign({}, DEF.tactil, (base || {}).tactil, (previa || {}).tactil); c.medida = c.medida && +c.medida.w > 0 && +c.medida.h > 0 ? c.medida : null; c.qr = Object.assign({}, DEF.qr, (base || {}).qr, (previa || {}).qr); c.cinta = Object.assign({}, DEF.cinta, (base || {}).cinta, (previa || {}).cinta); if (c.formato !== 'horizontal') c.formato = 'vertical';
    c.modo = c.modo === 'escenas' ? 'escenas' : 'carteles'; c.escenas = Array.isArray(c.escenas) ? c.escenas.filter(e => e && typeof e === 'object') : []; c.archivos = c.archivos && typeof c.archivos === 'object' ? c.archivos : {}; c.secuencia = Array.isArray(c.secuencia) ? c.secuencia : []; c.sueltos = Array.isArray(c.sueltos) ? c.sueltos.filter(x => typeof x === 'string') : []; c.adsS = Array.isArray(c.adsS) ? c.adsS.filter(x => typeof x === 'string') : [];   // v1.23 · imágenes propias marcadas como anuncio   // v1.15 · carteles sueltos de cualquier carpeta o «m:clave»
    c.segundos = num(c.segundos, 8, 2, 600); c.segundosAnuncio = num(c.segundosAnuncio, c.segundos, 2, 600); c.fundido.segundos = num(c.fundido.segundos, 2.5, 0, 10); if (!TIPOS.includes(c.fundido.tipo)) c.fundido.tipo = 'fundido';
    const ac = Array.isArray(c.anunciosCada) ? c.anunciosCada : [4, 7]; c.anunciosCada = [num(ac[0], 4, 1, 99), num(ac[1], 7, 1, 99)].sort((a, b) => a - b);
    return c;
  }
  /* ---------- sin conexión: el service worker guarda la app y las imágenes; si cae la red, el display sigue con la última copia ----------
     v1.4 · también con un origen privado (otra web): se guardan TODAS las imágenes de TODAS las listas, una sola vez; después se enseñan desde la copia
     sin volver a pedirlas (ahorra peticiones y datos a la web privada) y, si la red falla a medias, se sigue en la siguiente vuelta */
  const SW = !PREV && 'serviceWorker' in navigator && (location.protocol === 'https:' || /^(localhost|127\.)/.test(location.hostname));
  if (SW) { try { navigator.serviceWorker.register(BASE + 'sw.js').catch(() => {}); navigator.storage && navigator.storage.persist && navigator.storage.persist().catch(() => {}); } catch (e) {}
    try { navigator.serviceWorker.addEventListener('message', e => { const d = e.data || {}; if (d.t === 'pre-prog' && d.id === 'display') { PRE = d; if (document.body.classList.contains('con-panel') && borr) pinta(); } }); } catch (e) {} }
  let copiado = '', PRE = { ok: 0, mal: 0, total: 0, fin: false };
  function copia() { if (!SW || !MAN) return; const car = MAN.carpetas || {}, de = c => (car[c] || []).map(f => c + '/' + f), fs = new Set(), L = (LISTAS && LISTAS.playlists) || {}, ok = s => /^[\w .()\-\/]+$/.test(s || '') && String(s).indexOf('..') < 0;
    Object.keys(L).map(k => L[k]).concat(cfg ? [cfg] : []).forEach(p => { if (!p || typeof p !== 'object') return;
      [].concat(p.contenido || [], p.anuncios || []).forEach(c => de(c).forEach(f => fs.add(f))); (Array.isArray(p.sueltos) ? p.sueltos : []).forEach(f => { if (ok(f) && f.indexOf('/') > 0) fs.add(f); });
      if (p.fondo) (car.fondos || []).forEach(x => { if (x.replace(/\.[a-z0-9]+$/i, '') === p.fondo) fs.add('fondos/' + x); });
      (Array.isArray(p.escenas) ? p.escenas : []).forEach(e => { if (!e || typeof e !== 'object') return; if (e.fondo && e.fondo.t === 'img' && ok(e.fondo.src)) fs.add(e.fondo.src); (Array.isArray(e.piezas) ? e.piezas : []).forEach(z => { if (!z) return; if (z.t === 'zona') (z.carp || []).forEach(c => de(c).forEach(f => fs.add(f))); else if (z.t === 'imagen' && ok(z.src)) fs.add(z.src); }); }); });
    const urls = [...fs].filter(f => !esVideo(f)).slice(0, 3000).map(url).concat([location.href.split('#')[0]]), firma = urls.join('|'); if (firma === copiado) return; copiado = firma;
    navigator.serviceWorker.ready.then(r => { r.active && r.active.postMessage({ t: 'pre', id: 'display', urls, limpia: true }); }).catch(() => {}); }
  function aplica() {
    cfg = calcula(); diaA = hoyISO(); pool = calPool(); const car = (MAN && MAN.carpetas) || {};
    const st = escena.style, hor = HOR();
    st.setProperty('--t', (cfg.fundido.tipo === 'corte' ? 0 : cfg.fundido.segundos) + 's'); st.setProperty('--dur', (cfg.segundos + cfg.fundido.segundos) + 's');
    escena.className = 't-' + cfg.fundido.tipo + (cfg.movimiento ? ' mov' : '') + (cfg.llenar && !hor ? ' llena' : '') + (cfg.brillo ? ' brillo' : '') + (hor ? ' horizontal' : '') + (hor && pool.feed.length && pool.ads.length && !ESC() ? ' dos' : '') + (ESC() ? ' modo-esc' : '') + (ESC() && cfg.tactil.activo ? ' tactil' : ''); if (!ESC()) limpiaEsc(); tamEscena(); CAPAS.feed.forEach(c => c.classList.toggle('centro', cfg.alinea === 'centro'));
    const f = $('.fondo'), fs = car.fondos || [], fa = cfg.fondo && fs.find(x => x.replace(/\.[a-z0-9]+$/i, '') === cfg.fondo);
    if (fa) { const u = url('fondos/' + fa); if (f.dataset.u !== u) { const i = new Image(); i.onload = () => { f.style.backgroundImage = 'url("' + u + '")'; f.dataset.u = u; f.classList.add('on'); }; i.src = u; } } else { f.classList.remove('on'); f.dataset.u = ''; }
    cinta(); margenes(); qr(); if ((cfg.cinta.activo ? cfg.cinta.rss || '' : '') !== rssU) rss(); enlaza(); menu();
    document.title = 'ADPOSTER · ' + cfg.nombre; gen++; copia();
  }
  /* v1.15 · un cartel sale si no está fuera y si hoy está entre sus fechas; v1.23 · y si toca por día de la semana y por hora. Los sueltos se suman a los de las carpetas */
  function calPool() { const car = (MAN && MAN.carpetas) || {}, h = hoyISO(), d = new Date(), dia = d.getDay() || 7, ahora = d.getHours() * 60 + d.getMinutes();
    const sirve = f => { const a = cfg.archivos[f]; if (!a) return true; if (a.off || (a.desde && h < a.desde) || (a.hasta && h > a.hasta)) return false; if (Array.isArray(a.dias) && a.dias.length && !a.dias.includes(dia)) return false; return enHoras(a.hIni, a.hFin, ahora); }, existe = f => { if (f.indexOf('m:') === 0) return !!urlE(f); const i = f.indexOf('/'); return i > 0 && (car[f.slice(0, i)] || []).includes(f.slice(i + 1)); };
    const junta = (l, su) => [...new Set((l || []).flatMap(c => (car[c] || []).map(f => c + '/' + f)).concat((su || []).filter(existe)))].filter(sirve);
    return { feed: junta(cfg.contenido, cfg.sueltos), ads: junta(cfg.anuncios, cfg.adsS) }; }
  const enHoras = (i, f, ahora) => { const a = mins(i), b = mins(f); return a === null || b === null || a === b || (a < b ? ahora >= a && ahora < b : ahora >= a || ahora < b); };
  /* v1.23 · lienzo A MEDIDA (pantallas LED): el escenario toma la proporción exacta del controlador, sin franjas negras */
  /* v1.23 · modo LED 1:1 (…&px=1&ox=0&oy=0): el lienzo sale a su tamaño exacto en píxeles, sin escalar, desde la esquina que lee la tarjeta emisora */
  const PX1 = !PREV && Q.get('px') === '1', OX = Math.round(num(Q.get('ox'), 0, 0, 16000)), OY = Math.round(num(Q.get('oy'), 0, 0, 16000));
  if (PX1) document.body.classList.add('px1');
  function tamEscena() { const st = escena.style; if (cfg && cfg.medida && PX1) { const w = cfg.medida.w, h = cfg.medida.h; st.width = w + 'px'; st.height = h + 'px'; st.setProperty('--u0', (Math.min(w, h) / 100) + 'px'); st.aspectRatio = 'auto'; st.position = 'absolute'; st.left = OX + 'px'; st.top = OY + 'px'; }
    else if (cfg && cfg.medida) { const g = rot === 90 || rot === 270, W = g ? innerHeight : innerWidth, H = g ? innerWidth : innerHeight, ar = cfg.medida.w / cfg.medida.h, w = Math.min(W, H * ar), h = w / ar; st.width = w + 'px'; st.height = h + 'px'; st.setProperty('--u0', (Math.min(w, h) / 100) + 'px'); st.aspectRatio = 'auto'; st.position = ''; st.left = ''; st.top = ''; }
    else { st.width = ''; st.height = ''; st.removeProperty('--u0'); st.aspectRatio = ''; st.position = ''; st.left = ''; st.top = ''; } }
  addEventListener('resize', tamEscena);
  const HOR = () => !!cfg && cfg.formato === 'horizontal';
  const ESC = () => !!cfg && cfg.modo === 'escenas' && cfg.escenas.length > 0 && !!window.ADESCENA;
  /* márgenes del póster. En horizontal el de arriba es igual al de abajo; con la cinta en marcha, el de abajo le deja sitio */
  function margenes() { const st = escena.style, hor = HOR(), con = escena.classList.contains('con-cinta'), pie = Math.max(num(cfg.pie, 4.5, 0, 40), con ? (hor ? 8 : 4.6) : 0);
    st.setProperty('--cab', (hor ? pie : num(cfg.cabecera, 18, 0, 60)) + '%'); st.setProperty('--pie', pie + '%'); st.setProperty('--lado', num(cfg.lado, 5, 0, 30) + '%'); requestAnimationFrame(() => CAPAS.feed.forEach(encaja)); }
  async function carga(primera) {
    try { const [m, l] = await Promise.all([json('assets/manifest.json'), json('playlists.json')]); LFILE = l; const ef = efectivo(l);
      const nuevo = !MAN || m.version !== MAN.version || JSON.stringify(ef) !== JSON.stringify(LISTAS); if (recarga !== null && l.recarga !== recarga && !PREV) { location.reload(); return true; }
      recarga = l.recarga === undefined ? '' : l.recarga; if (nuevo) { MAN = m; LISTAS = ef; guarda('man', m); guarda('listas', l); aplica(); } aviso(''); return true;
    } catch (e) { if (primera) { MAN = lee('man'); LFILE = lee('listas'); LISTAS = efectivo(LFILE); if (MAN && LISTAS) { recarga = LFILE.recarga === undefined ? '' : LFILE.recarga; aplica(); return true; } } return false; }
  }

  /* ---------- horario ---------- */
  const mins = s => { const m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; };
  const festivo = () => !!LISTAS && Array.isArray(LISTAS.festivos) && LISTAS.festivos.includes(hoyISO());
  function enTramo(h, d) { const ahora = d.getHours() * 60 + d.getMinutes(), a = mins(h.desde), b = mins(h.hasta), dia = d.getDay() || 7, ayer = dia === 1 ? 7 : dia - 1, dias = Array.isArray(h.dias) ? h.dias : [1, 2, 3, 4, 5, 6, 7];   // v1.23 · un tramo sin días no se usa nunca
    if (a === null || b === null || a === b) return dias.includes(dia); if (a < b) return dias.includes(dia) && ahora >= a && ahora < b; return (dias.includes(dia) && ahora >= a) || (dias.includes(ayer) && ahora < b); }   // tramo que pasa de medianoche
  /* v1.23 · varios tramos (horario.tramos, además del de siempre) y «cerrado en festivos» */
  function enHorario() { const h = cfg.horario; if (!h || !h.activo) return true; if (h.festivos && festivo()) return false; const d = new Date(); return [h].concat(Array.isArray(h.tramos) ? h.tramos : []).some(t => t && enTramo(t, d)); }

  /* ---------- baraja: nunca repite hasta agotar el mazo, ni siquiera tras un reinicio ---------- */
  function saca(tipo) { const todo = pool[tipo]; if (!todo.length) return null; const hay = new Set(todo);
    if (cfg.orden === 'fijo' && tipo === 'feed') { const sq = cfg.secuencia.filter(f => hay.has(f)), ya = new Set(sq), ord = sq.concat(todo.filter(f => !ya.has(f))); let i = (PREV ? saca.pos : lee('pos')) || 0; if (i >= ord.length) i = 0; const f = ord[i]; i++; if (PREV) saca.pos = i; else guarda('pos', i); saca['u' + tipo] = f; return f; }   // orden fijo: el de la biblioteca
    let m = PREV ? (saca['m' + tipo] || []) : (lee('mazo-' + tipo) || []); m = m.filter(f => hay.has(f));
    if (!m.length) { m = mezcla(todo.slice()); const ult = saca['u' + tipo]; if (m.length > 1 && m[m.length - 1] === ult) [m[0], m[m.length - 1]] = [m[m.length - 1], m[0]]; }
    const f = m.pop(); saca['u' + tipo] = f; if (PREV) saca['m' + tipo] = m; else guarda('mazo-' + tipo, m); return f; }
  const esVideo = f => /\.(mp4|webm|m4v|mov)(\?|$)/i.test(f);
  function precarga(u) {
    if (esVideo(u)) return new Promise(res => { const v = document.createElement('video'); let fin = false; const ok = x => { if (!fin) { fin = true; clearTimeout(t); res(x); } }, t = setTimeout(() => ok(false), 20000);
      v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'auto'; v.onloadeddata = () => ok(v); v.onerror = () => ok(false); v.src = u; v.load(); });
    return new Promise(res => { const i = new Image(); let fin = false; const ok = v => { if (!fin) { fin = true; res(v); } }; const t = setTimeout(() => ok(false), 12000);
    i.onload = () => { clearTimeout(t); (i.decode ? i.decode().catch(() => {}) : Promise.resolve()).then(() => ok(i)); }; i.onerror = () => { clearTimeout(t); ok(false); }; i.src = u; }); }
  /* cada póster ocupa todo lo que cabe en su marco, sea cual sea su tamaño original */
  function encaja(capa) { const h = capa.querySelector('.hoja'); if (!h || !h.dataset.r) return; const m = $('.marco'), r = +h.dataset.r, w = Math.min(m.clientWidth, m.clientHeight * r); h.style.width = w + 'px'; h.style.height = w / r + 'px'; h.style.setProperty('--k', (Math.max(m.clientWidth / w, m.clientHeight / (w / r)) * 1.015).toFixed(4)); }
  addEventListener('resize', () => CAPAS.feed.forEach(encaja));
  const actual = { feed: '', ads: '' };
  async function paso(tipo) {
    const f = saca(tipo); if (!f) return false; const u = f.indexOf('m:') === 0 ? urlE(f) : url(f), pre = await precarga(u); if (!pre) { await espera(400); return false; } if (ESC()) return true;   // mientras cargaba, la lista ha pasado a ser una composición
    const g = gen, vid = pre.tagName === 'VIDEO', capas = CAPAS[tipo], n = turno[tipo] % 2, entra = capas[n], sale = capas[1 - n], caja = c => (tipo === 'feed' ? c.querySelector('.hoja') : c), cj = caja(entra), img = cj.querySelector('img'), viejo = cj.querySelector('video'); turno[tipo]++;
    if (viejo) { viejo.pause(); viejo.remove(); } if (vid) { img.style.display = 'none'; img.removeAttribute('src'); cj.appendChild(pre); const pl = pre.play(); pl && pl.catch && pl.catch(() => {}); } else { img.style.display = ''; img.src = u; }
    const w = vid ? pre.videoWidth : pre.naturalWidth, h = vid ? pre.videoHeight : pre.naturalHeight;
    if (tipo === 'feed' && w && h) { cj.dataset.r = w / h; encaja(entra); cj.classList.remove('anim'); void cj.offsetWidth; cj.classList.add('anim'); }   // el movimiento arranca con cada póster y se mantiene mientras se va
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    sale.classList.add('sale'); sale.classList.remove('on'); entra.classList.remove('sale'); entra.classList.add('on'); const tf = cfg.fundido.tipo === 'corte' ? 0 : cfg.fundido.segundos * 1000, vs = caja(sale).querySelector('video');
    if (tipo === 'feed' && !escena.classList.contains('dos')) { setTimeout(() => CAPAS.ads.forEach(c => c.classList.remove('on', 'sale')), tf ? 60 : 0); }
    setTimeout(() => { sale.classList.remove('sale'); if (vs && vs.parentNode && !sale.classList.contains('on')) { vs.pause(); vs.remove(); } }, tf + 80); ultimo = Date.now(); actual[tipo] = f; if (tipo === 'feed') actual.ads = '';
    const prop = cfg.archivos[f] && +cfg.archivos[f].seg ? num(cfg.archivos[f].seg, 0, 2, 600) : 0, base = (prop || (tipo === 'ads' ? cfg.segundosAnuncio : cfg.segundos)) * 1000, dur = (vid && isFinite(pre.duration) && pre.duration > 0 ? Math.min(600000, Math.max(2000, pre.duration * 1000 - tf)) : base) + tf, t0 = Date.now();   // un vídeo dura lo que dura
    while (Date.now() - t0 < dur && g === gen) { await espera(200); ultimo = Date.now(); } cuenta(f, (Date.now() - t0) / 1000); return true;
  }
  let offR = !PREV && leeG('off') === '1', offA = false;                     // apagado a distancia desde el gestor · v1.23: o por una regla «pantalla en negro» del calendario
  const activo = () => enHorario() && !offR && !offA;
  async function serie(tipo, g) { while (g === gen && activo() && pool[tipo].length) { if (!(await paso(tipo))) await espera(300); } }
  async function bucle() {
    for (;;) {
      ultimo = Date.now();
      if (!cfg.existe) { if (!PREV) aviso(T('Esperando el contenido del gestor…') + '\n' + T('En el gestor, pulsa «✓ Enviar cambios».')); await espera(PREV ? 300 : 1000); continue; }   // v1.23 · nunca «No existe la playlist»: la lista llega por el directo en cuanto el gestor la manda
      if (!activo()) { $('.apagado').classList.add('on'); aviso(''); await espera(PREV ? 600 : offR ? 1500 : 20000); continue; } $('.apagado').classList.remove('on');
      if (ESC()) { aviso(''); await escenas(); continue; }
      if (!pool.feed.length && !pool.ads.length) { aviso(T('Esta playlist no tiene imágenes todavía.')); await espera(PREV ? 500 : 3000); continue; } aviso('');
      if (HOR() && pool.feed.length && pool.ads.length) { const g = gen; await Promise.all([serie('feed', g), serie('ads', g)]); continue; }   // en horizontal, póster y anuncio conviven: cada uno lleva su ritmo
      /* v1.23 · primero una tanda de carteles y después el anuncio: la pantalla nunca arranca con un anuncio */
      if (pool.feed.length) { const n = entre(cfg.anunciosCada[0], cfg.anunciosCada[1]); for (let i = 0; i < n && pool.feed.length && activo() && !ESC(); i++) await paso('feed'); }   // si la lista pasa a ser una composición, se deja la tanda
      if (pool.ads.length && activo() && !ESC()) await paso('ads');
    }
  }

  /* ---------- composiciones: la lista es una serie de escenas que se van relevando ---------- */
  const escM = [null, null]; let escN = 0, escI = 0;
  let MEDT = null, MEDB = null; const medios = () => { if (previaMedios) return previaMedios; const b = (LISTAS && LISTAS.medios) || null; if (!MEDT || MEDB !== b) { MEDB = b; MEDT = Object.assign({}, b || {}, MED); } return MEDT; };
  /* dirección de un archivo de una pieza: «m:clave» es una imagen guardada dentro de playlists.json; https://… es de fuera; lo demás, de assets/ */
  const urlE = s => { s = String(s || ''); if (s.indexOf('m:') === 0) { const d = medios()[s.slice(2)]; return typeof d === 'string' && /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,[a-z0-9+/=]+$/i.test(d) ? d : ''; } if (/^https:\/\/[^\s"'<>]+$/i.test(s)) return s; return /^[\w .()\-\/]+$/.test(s) && s.indexOf('..') < 0 ? url(s) : ''; };
  const hoyISO = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const vale = e => { const h = hoyISO(), d = new Date(); if (e.off || (e.desde && h < e.desde) || (e.hasta && h > e.hasta)) return false;   // una escena puede ser solo de temporada
    if (Array.isArray(e.dias) && e.dias.length && !e.dias.includes(d.getDay() || 7)) return false; return enHoras(e.hIni, e.hFin, d.getHours() * 60 + d.getMinutes()); };   // v1.23 · y solo unos días y unas horas
  function limpiaEsc() { escM.forEach((m, i) => { if (m) { m.destruye(); escM[i] = null; } }); $$('.esc-capa').forEach(c => c.classList.remove('on', 'sale')); }
  /* v1.23 · ANUNCIOS entre escenas (uno cada mín–máx, a pantalla completa) y lista TÁCTIL (tocar una pieza con destino salta a esa escena; sin tocar, vuelve a la primera) */
  let salto = '', tToque = 0, enMano = false, escAct = null;
  const anuncioEsc = f => ({ id: 'ad', n: 'AD · ' + f, seg: cfg.segundosAnuncio, fondo: { t: 'color', c: '#000000' }, piezas: [{ id: 'ad' + Date.now().toString(36), t: esVideo(f) ? 'video' : 'imagen', x: 0, y: 0, w: 100, h: 100, src: f, aj: 'contener' }] });
  async function escenas() { const g = gen, capas = $$('.esc-capa'); let hechas = 0, toca = entre(cfg.anunciosCada[0], cfg.anunciosCada[1]);
    while (g === gen && activo() && ESC()) { const lista = cfg.escenas.filter(vale); if (!lista.length) { limpiaEsc(); await espera(2000); ultimo = Date.now(); continue; }
      let e, esAd = false, vuelta = num(cfg.tactil.vuelta, 30, 5, 300) * 1000;
      if (salto) { e = cfg.escenas.find(x => x.id === salto) || lista[0]; salto = ''; enMano = true; escI = lista.indexOf(e) + 1; }
      else if (enMano) { enMano = false; e = lista[0]; escI = 1; }
      else if (pool.ads.length && hechas >= toca && !cfg.tactil.activo) { const f = saca('ads'); if (f) { e = anuncioEsc(f); esAd = true; } hechas = 0; toca = entre(cfg.anunciosCada[0], cfg.anunciosCada[1]); }
      if (!e) { e = lista[escI % lista.length]; escI++; hechas++; }
      const n = escN % 2, entra = capas[n], sale = capas[1 - n]; escN++;
      if (escM[n]) escM[n].destruye(); entra.classList.remove('on', 'sale'); escM[n] = window.ADESCENA.monta(entra, e, { vivo: true, red: true, lang: LANG, url: urlE, man: MAN, entra: true, base: DATOS }); escAct = e;
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      sale.classList.add('sale'); sale.classList.remove('on'); entra.classList.add('on'); const tf = cfg.fundido.tipo === 'corte' ? 0 : cfg.fundido.segundos * 1000, viejo = 1 - n;
      setTimeout(() => { sale.classList.remove('sale'); if (!sale.classList.contains('on') && escM[viejo]) { escM[viejo].destruye(); escM[viejo] = null; } }, tf + 120);
      actual.feed = esAd ? e.piezas[0].src : String(e.n || ''); actual.ads = ''; ultimo = Date.now(); const dur = num(e.seg, 12, 3, 3600) * 1000 + tf, t0 = Date.now(), sola = lista.length < 2 && !esAd && !(pool.ads.length && !cfg.tactil.activo);
      while (g === gen && activo() && !salto && (enMano ? Date.now() - tToque < vuelta : (sola || Date.now() - t0 < dur))) { await espera(250); ultimo = Date.now(); if (!enMano && sola && cfg.escenas.filter(vale).length !== 1) break; }
      cuenta(esAd ? e.piezas[0].src : 'escena · ' + (e.n || e.id), (Date.now() - t0) / 1000); }
    if (!ESC() || !activo()) limpiaEsc(); }
  /* v1.23 · informe de emisión: cada display cuenta qué ha sacado y cuánto tiempo, por día (31 días); el gestor lo pide y lo baja en CSV */
  function cuenta(k, seg) { if (PREV || !k) return; let I = {}; try { I = JSON.parse(leeG('inf') || '{}') || {}; } catch (e) {} const d = hoyISO(), x = I[d] || (I[d] = {}), v = x[k] || (x[k] = [0, 0]); v[0]++; v[1] = Math.round(v[1] + (seg || 0));
    Object.keys(I).sort().slice(0, -31).forEach(f => delete I[f]); guardaG('inf', JSON.stringify(I)); }

  /* ---------- calendario: qué lista toca en este display según la fecha, el día de la semana y la hora ---------- */
  let CASA = (() => { if (PREV) return ID; if (Q.get('ag') === '1') return leeG('casa') || ID; guardaG('casa', ID); guardaG('punt', ''); return ID; })();   // la lista «de casa» es la de la URL del kiosco (al arrancar con ella se olvida el cambio puntual)
  /* v1.23 · reglas con varios tramos, festivos (también / no / solo), inicio a una hora concreta («ini», lo pone A PANTALLAS) y «_apaga» (pantalla en negro) */
  function agendaToca() { const A = LISTAS && Array.isArray(LISTAS.agenda) ? LISTAS.agenda : [], pl = (LISTAS && LISTAS.playlists) || {}; if (!A.length) return null; const d = new Date(), hoy = hoyISO(), dia = d.getDay() || 7, ahora = d.getHours() * 60 + d.getMinutes(), y = yo(), fe = festivo();
    const ok = r => { if (!r || r.on === false || !(pl[r.lista] || r.lista === '_apaga')) return false; if ((r.desde && hoy < r.desde) || (r.hasta && hoy > r.hasta)) return false; if (r.ini && Date.now() < Date.parse(r.ini)) return false; if (Array.isArray(r.dias) && r.dias.length && !r.dias.includes(dia)) return false;
      if (r.borr || (r.fest === 'solo' && !fe) || (r.fest === 'no' && fe)) return false;   // v1.23 · una regla en borrador no se aplica hasta guardarla
      const tr = [[r.hIni, r.hFin]].concat(Array.isArray(r.tramos) ? r.tramos : []).filter(t => Array.isArray(t) && mins(t[0]) !== null && mins(t[1]) !== null && t[0] !== t[1]); if (tr.length && !tr.some(t => enHoras(t[0], t[1], ahora))) return false;
      return paraMi(r.k, r.v, y); };
    const m = A.filter(ok); return m.length ? m[m.length - 1].lista : ''; }                                       // si coinciden varias, manda la última de la lista
  /* v1.23 · A PANTALLAS «durante N minutos»: la URL lleva tk (hasta cuándo); mientras dura no manda el calendario y luego se vuelve sola */
  /* v1.23 · destinos: todos, grupo (g), sede (s), grupo Y sede (gs: «grupo@sede») o una pantalla (d) */
  function paraMi(k, v, y) { y = y || yo(); v = String(v || ''); if (!k || k === 'todos') return true; if (k === 'g') return !!y.g && y.g === slug(v); if (k === 's') return !!y.s && y.s === slug(v); if (k === 'd') return v.toLowerCase() === DISP;
    if (k === 'gs') { const i = v.indexOf('@'); return i > 0 && !!y.g && !!y.s && y.g === slug(v.slice(0, i)) && y.s === slug(v.slice(i + 1)); } return false; }
  /* «durante N minutos» (tk) se recuerda en el aparato: si la pantalla se reinicia con su dirección de siempre, sigue con la orden hasta que caduque.
     Un cambio «puntual» (punt) no toca la lista de casa: se queda mientras el calendario no cambie de franja */
  let TK = PREV ? 0 : +Q.get('tk') || 0; if (TK && !PREV) guardaG('tk', JSON.stringify({ id: ID, h: TK }));
  const leeJ = k => { try { return JSON.parse(leeG(k) || 'null'); } catch (e) { return null; } };
  function agenda() { if (PREV || !LISTAS) return; const ahora = Date.now();
    if (!TK) { const k = leeJ('tk'); if (k && +k.h > ahora && k.id !== ID && LISTAS.playlists && LISTAS.playlists[k.id]) { ir(k.id, true, +k.h); return; } }
    if (TK && ahora < TK) return; const venc = !!TK; if (venc) { TK = 0; guardaG('tk', ''); }
    const q = agendaToca(), era = offA; offA = q === '_apaga'; if (era !== offA) estado(); if (offA) return;
    const pu = leeJ('punt'); if (pu && !venc) { if (pu.id === ID && pu.q === (q === null ? null : q)) return; guardaG('punt', ''); }
    if (q === null && !venc && !pu) return; const quiero = q || CASA; if (quiero && quiero !== ID) ir(quiero, true); }
  function puntual(id) { if (PREV || !LISTAS || !LISTAS.playlists || !LISTAS.playlists[id]) return; guardaG('punt', JSON.stringify({ id, q: agendaToca() })); guardaG('tk', ''); TK = 0; if (id !== ID) ir(id, true); }

  /* ---------- cinta de texto, código QR y aviso ---------- */
  let cintaR = PREV ? '' : leeG('cinta'), cintaH = PREV ? 0 : +leeG('cinta-h') || 0, rssT = '', rssU = '', tAl = 0;   // v1.23 · cintaH: la cinta del mando caduca sola (por defecto, al acabar el día)
  function cinta() { const c = $('.cinta'), sp = c.querySelector('span'), x = (cintaR || (cfg && cfg.cinta.activo ? (rssT || cfg.cinta.texto) : '') || '').replace(/\s+/g, ' ').trim().slice(0, 1500);
    if (sp.textContent !== x) { sp.textContent = x; c.style.setProperty('--ct', Math.max(14, Math.round(x.length * .22 + 10)) + 's'); sp.style.animation = 'none'; void sp.offsetWidth; sp.style.animation = ''; }
    c.classList.toggle('on', !!x); escena.classList.toggle('con-cinta', !!x); }
  /* RSS en vivo: titulares de un canal RSS o Atom. Vale una dirección https (si ese servidor deja leerla desde otra web) o un archivo del propio origen (noticias.xml) */
  async function rss() { const u = cfg && cfg.cinta.activo ? (cfg.cinta.rss || '').trim() : ''; rssU = u; let txt = '';
    if (u) { try { const d = new URL(u, DATOS); if (!/^https?:$/.test(d.protocol)) throw 0; const r = await fetch(d.href, { cache: 'no-store' }); if (!r.ok) throw 0;
      const x = new DOMParser().parseFromString(await r.text(), 'text/xml'); txt = [...x.querySelectorAll('item > title, entry > title')].map(t => (t.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 15).join('   •   '); } catch (e) { txt = rssT && rssU === u ? rssT : ''; } }
    if (rssU !== u) return; rssT = txt; cinta(); margenes(); }
  function qr() { const q = $('.qr'), c = cfg.qr || {}; let u = ''; escena.classList.remove('qr-d', 'qr-i', 'qr-a', 'qr-b', 'qr-tx'); if (c.activo) { if (c.modo === 'publico') u = canalP ? BASE + 'elige/?c=' + canalP + '&d=' + DISP : (PREV ? BASE + 'elige/' : ''); else if (/^https?:\/\/\S+$/i.test((c.url || '').trim())) u = c.url.trim(); }
    if (!u || !window.qrcode) { q.classList.remove('on'); return; }
    if (q.dataset.u !== u) { try { const g = window.qrcode(0, 'M'); g.addData(u); g.make(); q.querySelector('.q-img').innerHTML = g.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); q.dataset.u = u; } catch (e) { q.classList.remove('on'); return; } }
    const t = q.querySelector('.q-txt'); t.textContent = String(c.texto || '').slice(0, 60); t.style.display = t.textContent ? '' : 'none'; const pos = ['bi', 'bd', 'ai', 'ad'].includes(c.pos) ? c.pos : 'bd'; q.className = 'qr on p-' + pos; escena.classList.add(pos[1] === 'i' ? 'qr-i' : 'qr-d', pos[0] === 'a' ? 'qr-a' : 'qr-b'); if (t.textContent) escena.classList.add('qr-tx'); requestAnimationFrame(() => CAPAS.feed.forEach(encaja)); }   // v1.23 · en una composición, el QR y la cinta van en su franja y no tapan piezas
  function alerta(x, s, c) { const a = $('.alerta'), i = a.firstElementChild; clearTimeout(tAl); x = String(x || '').trim().slice(0, 280); if (!x) { a.classList.remove('on'); return; }
    i.textContent = x; i.className = 'a-in c-' + (['ambar', 'rojo', 'verde', 'azul'].includes(c) ? c : 'ambar') + (x.length > 90 ? ' xs' : x.length > 36 ? ' sm' : ''); a.classList.remove('on'); void a.offsetWidth; a.classList.add('on'); tAl = setTimeout(() => { a.classList.remove('on'); avisoFijo(); }, num(s, 10, 2, 43200) * 1000); }
  /* v1.23 · un aviso «hasta las 14:00» sigue en pantalla hasta esa hora, también si la pantalla se reinicia */
  function avisoFijo() { if (PREV) return; let v = null; try { v = JSON.parse(leeG('aviso') || 'null'); } catch (e) {} if (!v || +v.h <= Date.now()) { if (v) guardaG('aviso', ''); return; } alerta(v.x, (+v.h - Date.now()) / 1000, v.c); }

  /* ---------- directo: el display obedece al gestor al momento y le cuenta cómo está ---------- */
  let dir = null, dirP = null, dirK = null, canalP = '', uPide = 0;
  const yo = () => ({ n: leeG('nombre') || 'DISPLAY ' + DISP.toUpperCase(), g: slug(leeG('grupo')), s: slug(leeG('sede')) });
  const canalAct = () => leeG('canal') || (LISTAS && typeof LISTAS.canal === 'string' ? LISTAS.canal : '');
  const estadoDe = () => { const y = yo(); return { n: y.n, g: y.g, s: y.s, l: ID, ln: cfg.nombre, f: cfg.formato, md: cfg.medida ? cfg.medida.w + '×' + cfg.medida.h : '', w: innerWidth, h: innerHeight, v: VERSION, off: offR ? 2 : enHorario() && !offA ? 0 : 1, i: actual.ads || actual.feed || '', p: ORIGEN ? 1 : 0, c: CASA, e: EMR ? (EMR.sc ? 2 : 1) : 0, ei: EMR ? emId(EMR) : '', dv: VIVOL ? +VIVOL.t || 0 : 0, mf: faltan(), t: Date.now() }; };   // v1.23 · dv: qué envío de listas tiene; mf: imágenes que aún no le han llegado
  function estado() { if (!dir || !cfg) return; dir.pub('estado/' + DISP, estadoDe(), true); }
  function menu() { if (!dirP || !LISTAS) return; const pl = LISTAS.playlists || {}; dirP.pub('menu/' + DISP, { n: leeG('nombre') || cfg.nombre, l: ID, listas: Object.keys(pl).filter(k => pl[k] && pl[k].publico).slice(0, 24).map(k => ({ id: k, n: String(pl[k].nombre || k.toUpperCase()).slice(0, 40) })), t: Date.now() }, true); }
  function ir(id, porAgenda, hasta) { id = String(id || '').toLowerCase().replace(/[^a-z0-9_-]/g, ''); if (PREV || !id || !LISTAS || !LISTAS.playlists || !LISTAS.playlists[id]) return false; if (hasta) guardaG('tk', JSON.stringify({ id, h: hasta })); if (id === ID) { if (hasta) TK = hasta; return false; }
    const q = new URLSearchParams(); q.set('l', id); if (porAgenda || hasta) q.set('ag', '1'); if (hasta) q.set('tk', hasta); if (rot) q.set('rot', rot); if (Q.get('lang')) q.set('lang', Q.get('lang')); location.replace(BASE + 'p/?' + q); return true; }
  function orden(o, ret) { if (!o || typeof o !== 'object') return;
    if (o.t === 'lista') { if (o.ot && !PREV) { if (+o.ot <= (+leeG('ordt') || 0)) return; guardaG('ordt', String(o.ot)); } else if (ret) return;   // v1.23 · la orden de A PANTALLAS queda retenida: la recibe también la pantalla que estaba apagada
      const h = +o.hasta || 0; if (h && h <= Date.now()) return; if (o.casa) { guardaG('punt', ''); guardaG('tk', ''); TK = 0; if (o.id === ID) { CASA = ID; guardaG('casa', ID); } else ir(o.id, false); } else if (h) ir(o.id, true, h); else puntual(o.id); }
    else if (o.t === 'emergencia') emergencia(o);
    else if (o.t === 'informe' && !PREV && dir) { let I = {}; try { I = JSON.parse(leeG('inf') || '{}'); } catch (e) {} dir.pub('estado/' + DISP, Object.assign(estadoDe(), { inf: I }), false); }
    else if (o.t === 'aviso') { const h = +o.hasta || 0; if (h && h > Date.now()) { if (!PREV) guardaG('aviso', JSON.stringify({ x: String(o.x || '').slice(0, 280), c: o.c, h })); alerta(o.x, (h - Date.now()) / 1000, o.c); } else { if (!PREV) guardaG('aviso', ''); alerta(o.x, o.s, o.c); } }
    else if (o.t === 'cinta') { cintaR = String(o.x || '').slice(0, 600); cintaH = cintaR && +o.hasta > Date.now() ? +o.hasta : 0; if (!PREV) { guardaG('cinta', cintaR); guardaG('cinta-h', cintaH ? String(cintaH) : ''); } cinta(); margenes(); }
    else if (o.t === 'apaga') { offR = !!o.v; if (!PREV) guardaG('off', offR ? '1' : ''); gen++; estado(); }
    else if (o.t === 'recarga') { if (!PREV) location.reload(); }
    else if (o.t === 'ident') { const y = yo(); alerta(y.n + '\n' + DISP.toUpperCase() + (y.g ? ' · ' + y.g : '') + (y.s ? ' · ' + y.s : ''), 8, 'azul'); }
    else if (o.t === 'pon' && !PREV) { [['n', 'nombre'], ['g', 'grupo'], ['s', 'sede']].forEach(([a, k]) => { if (typeof o[a] === 'string') guardaG(k, o[a].trim().slice(0, 32)); }); enlaza(); estado(); menu(); } }
  function enlaza() { if (PREV || !window.ADDIRECTO) return; const c = canalAct(), y = yo(), k = c + '|' + y.g + '|' + y.s; if (k === dirK) return; dirK = k;
    if (dir) { dir.cierra(); dir = null; } if (dirP) { dirP.cierra(); dirP = null; } canalP = ''; if (!window.ADDIRECTO.canalOk(c)) { if (cfg) qr(); return; }
    dir = window.ADDIRECTO.conecta(c, { temas: ['orden/todos', 'orden/d/' + DISP, 'emergencia', 'turno', 'pedidos', 'datos', 'm/+'].concat(y.g ? ['orden/g/' + y.g] : [], y.s ? ['orden/s/' + y.s] : [], y.g && y.s ? ['orden/gs/' + y.g + '@' + y.s] : []), alMensaje: (t, d, ret) => { if (t === 'emergencia') emergencia(d); else if (t === 'turno') turnoLlega(d, ret); else if (t === 'pedidos') pedidosLlega(d, ret); else if (t === 'datos') datosLlega(d); else if (t.indexOf('m/') === 0) medioLlega(t.slice(2), d); else orden(d, ret); }, alCambiar: v => { if (v) { estado(); emVigila(); } } });
    /* el público entra por un canal aparte, derivado del principal: solo puede pedir una de las listas marcadas como elegibles, y no más de una cada pocos segundos */
    window.ADDIRECTO.publico(c).then(p => { if (!p || dirK !== k) return; canalP = p;
      dirP = window.ADDIRECTO.conecta(p, { temas: ['pide/' + DISP], alMensaje: (t, d) => { const id = d && d.t === 'lista' ? String(d.id || '').toLowerCase().replace(/[^a-z0-9_-]/g, '') : '', pl = (LISTAS && LISTAS.playlists) || {}; if (id && pl[id] && pl[id].publico && Date.now() - uPide > 8000) { uPide = Date.now(); ir(id, true, Date.now() + 5 * 60000); }   // v1.23 · lo que elige el público dura 5 minutos y la pantalla vuelve sola a la lista del dueño (nunca cambia la lista de casa)
       }, alCambiar: v => { if (v) menu(); } }); if (cfg) qr(); }); }

  /* ---------- v1.23 · EMERGENCIA, TURNOS, PEDIDOS y listas por el directo ---------- */
  let EMR = PREV ? null : (() => { try { return JSON.parse(leeG('emer') || 'null'); } catch (e) { return null; } })(), tSir = 0, emConf = !EMR, tConf = 0;
  const emId = o => String(o.id || o.t || '');
  /* v1.23 · la emergencia se identifica por su «id»: la retira cualquier gestor del canal aunque su reloj vaya atrasado («*» retira cualquiera).
     Si la pantalla arranca con una emergencia guardada y el repetidor no la confirma en 20 s, deja de sonar y lo indica (nunca se queda atascada con la sirena) */
  function emergencia(o) { if (!o || typeof o !== 'object') return; const y = yo();
    if (!o.on) { if (EMR && o.id && o.id !== '*' && emId(EMR) !== o.id && +o.t < +EMR.t) return; EMR = null; }
    else { const mia = paraMi(o.k, o.v, y), nueva = mia && (!EMR || emId(EMR) !== emId(o)); if (mia) { EMR = Object.assign({}, o); emConf = true; } else if (EMR && emId(EMR) === emId(o)) EMR = null; else return; if (!PREV) guardaG('emer', EMR ? JSON.stringify(EMR) : ''); pintaEmer(nueva); estado(); return; }
    emConf = true; if (!PREV) guardaG('emer', ''); pintaEmer(false); estado(); }
  function emVigila() { clearTimeout(tConf); if (!EMR || emConf || PREV) return; tConf = setTimeout(() => { if (EMR && !emConf) { EMR.sc = 1; pintaEmer(false); estado(); } }, 20000); }
  function pintaEmer(nueva) { const e = $('.emer'); clearInterval(tSir); if (!EMR) { e.classList.remove('on', 'sc'); return; } e.querySelector('.em-t').textContent = '⚠ ' + T('EMERGENCIA'); e.querySelector('.em-x').textContent = String(EMR.x || '').slice(0, 240) + (EMR.sc ? '\n' + T('Sin confirmar: el gestor puede retirarla.') : ''); e.classList.add('on'); e.classList.toggle('sc', !!EMR.sc);
    if (PREV || EMR.sc) return; if (window.speechSynthesis && (nueva || EMR.son)) try { speechSynthesis.cancel(); } catch (x) {} if (EMR.son) { let n = 0; sirena(); tSir = setInterval(() => { n++; if (n < 12 || n % 12 === 0) sirena(); }, 2500); } if (nueva && EMR.voz) habla(EMR.x, EMR.lang || LANG); }
  const audio = {}; const AC = () => { try { if (!audio.c) audio.c = new (window.AudioContext || window.webkitAudioContext)(); if (audio.c.state === 'suspended') audio.c.resume().catch(() => {}); return audio.c; } catch (e) { return null; } };
  ['pointerdown', 'keydown'].forEach(k => addEventListener(k, () => { if (audio.c && audio.c.state === 'suspended') audio.c.resume().catch(() => {}); }, true));   // el primer toque o tecla desbloquea el sonido si el navegador lo frena
  function tono(f, t0, dur, vol, tipo) { const a = AC(); if (!a) return; const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + t0; o.type = tipo || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol || .35, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + .05); }
  const sirena = () => { for (let i = 0; i < 4; i++) { tono(960, i * .4, .2, .3, 'square'); tono(770, i * .4 + .2, .2, .3, 'square'); } };
  const campana = () => { tono(880, 0, 1.1, .4); tono(660, .45, 1.4, .4); };
  function habla(x, l) { try { if (!window.speechSynthesis || !x) return; const u = new SpeechSynthesisUtterance(String(x).slice(0, 240)); u.lang = l === 'en' ? 'en-GB' : l === 'ca' ? 'ca-ES' : 'es-ES'; u.rate = .95; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} }
  const usa = t => ESC() && cfg.escenas.some(e => (e.piezas || []).some(z => z && z.t === t)), seVe = t => !!escAct && (escAct.piezas || []).some(z => z && z.t === t);
  /* el número dicho como se lee: «A-005» → «A 5», «005» → «5» */
  const dicho = n => String(n || '').replace(/^(?:([A-Z0-9]{1,3})-)?0*(\d+)$/i, (m, s, d) => (s ? s + ' ' : '') + d);
  /* v1.23 · la campana y la voz suenan una sola vez por llamada (nunca al reiniciar la pantalla con el último turno guardado) y callan durante una emergencia */
  function turnoLlega(o, ret) { if (!o || typeof o !== 'object' || !window.ADVIVO) return; const pv = window.ADVIVO.d.turno; if (pv && +o.t <= +pv.t) return; window.ADVIVO.pon('turno', o.reset ? { n: '', p: '', h: [], t: o.t } : o);
    if (PREV || o.reset || !o.n || ret || EMR || !usa('turno') || +o.t <= (+leeG('tu-t') || 0)) return; guardaG('tu-t', String(o.t));
    campana(); if (o.voz) setTimeout(() => { if (!EMR) habla(T('Turno') + ' ' + dicho(o.n) + (o.p ? ', ' + o.p : ''), LANG); }, 1300); if (!seVe('turno')) alerta(T('TURNO') + '\n' + o.n + (o.p ? '  →  ' + o.p : ''), 8, 'verde'); }
  function pedidosLlega(o, ret) { if (!o || !window.ADVIVO) return; const pv = window.ADVIVO.d.pedidos; if (pv && +o.t <= +pv.t) return; window.ADVIVO.pon('pedidos', o); const a = (o.listos || [])[0], b = pv && (pv.listos || [])[0];
    if (!PREV && !EMR && usa('pedidos') && a && (!b || a[0] !== b[0]) && !ret && +o.t > (+leeG('pe-t') || 0)) { guardaG('pe-t', String(o.t)); campana(); } }
  let tEst = 0; const estadoLuego = () => { clearTimeout(tEst); tEst = setTimeout(estado, 600); };
  function datosLlega(o) { if (PREV || !o || !o.playlists || typeof o.playlists !== 'object') return; if (VIVOL && +VIVOL.t >= +o.t) { estadoLuego(); return; } VIVOL = o; try { localStorage.setItem(G + 'vivo', JSON.stringify(o)); } catch (e) {}
    if (o.mk && typeof o.mk === 'object') { Object.keys(MED).forEach(k => { if (!o.mk[k]) { delete MED[k]; try { localStorage.removeItem(G + 'm:' + k); } catch (e) {} } }); try { localStorage.setItem(G + 'mk', JSON.stringify(Object.keys(MED))); } catch (e) {} MEDT = null; }
    estadoLuego(); if (!LFILE) return; const ef = efectivo(LFILE); if (JSON.stringify(ef) === JSON.stringify(LISTAS)) return; LISTAS = ef; aplica(); menu(); agenda(); }
  let tMed = 0;
  function medioLlega(k, o) { if (PREV || !o || typeof o.d !== 'string' || !/^[a-z0-9_-]{2,40}$/i.test(k) || !/^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,/i.test(o.d)) return; if (MED[k] === o.d) return; MED[k] = o.d; MEDT = null;
    try { localStorage.setItem(G + 'm:' + k, o.d); localStorage.setItem(G + 'mk', JSON.stringify(Object.keys(MED))); } catch (e) {}
    clearTimeout(tMed); tMed = setTimeout(() => { if (!cfg) return; const np = calPool(); if (JSON.stringify(np) !== JSON.stringify(pool)) { pool = np; if (!ESC()) gen++; } if (ESC() && JSON.stringify(cfg.escenas).indexOf('"m:' + k + '"') >= 0) gen++; }, 500); estadoLuego(); }

  /* ---------- panel del display (OK del mando, toque o clic) ---------- */
  let borr = null, tPanel = 0;
  function pinta() { const p = $('.panel'), car = (MAN && MAN.carpetas) || {}, nombres = Object.keys(car).filter(c => c !== 'fondos'), ads = nombres.filter(c => /^ads?[-_]/i.test(c) || borr.anuncios.includes(c) && !borr.contenido.includes(c)), con = nombres.filter(c => !ads.includes(c));
    const chk = (c, grupo) => `<label tabindex="0" class="${borr[grupo].includes(c) ? 'on' : ''}" data-g="${grupo}" data-c="${c}"><i></i>${c}<small>${car[c].length} ${T('imágenes')}</small></label>`;
    p.innerHTML = `<div class="p-cab"><img src="${BASE}assets/logos/adposter-logo.svg" alt="ADPOSTER"><b>${cfg.nombre}</b></div>
      <h3>${T('Duración de cada póster')}</h3><div class="fila"><button class="rd" data-a="menos">−</button><div class="lcd">${borr.segundos} s</div><button class="rd" data-a="mas">+</button></div>
      <h3>${T('Transición')}</h3><div class="fila"><button class="rd" data-a="tant">◀</button><div class="lcd">${T(borr.fundido.tipo)}</div><button class="rd" data-a="tsig">▶</button></div>
      <h3>${T('Carpetas de contenido')}</h3><div class="lista">${con.map(c => chk(c, 'contenido')).join('')}</div>
      <h3>${T('Carpetas de anuncios')}</h3><div class="lista">${ads.map(c => chk(c, 'anuncios')).join('')}</div>
      <div class="acc"><button class="pri" data-a="ok">${T('Aceptar y reproducir')}</button><button data-a="reset">${T('Restablecer')}</button><button data-a="cerrar">${T('Cerrar')}</button></div>
      <div class="firma">${T('Estos ajustes se guardan solo en este display.')}${ORIGEN ? '<br>🔒 ' + T('Contenido privado de este display') : ''}${PRE.total ? '<br>💾 ' + PRE.ok + ' / ' + PRE.total + ' ' + T('imágenes guardadas en este display') + (PRE.fin ? '' : ' (' + T('descargando') + '…)') : ''}<br>${leeG('nombre') ? leeG('nombre').replace(/[<>&"]/g, '') + ' · ' : 'DISPLAY '}${DISP.toUpperCase()}${dir ? ' · ' + T('Directo') + ': ' + T(dir.up ? 'conectado' : 'sin conexión') : ''}<br>${window.AVCREDITO ? window.AVCREDITO.html('ADPOSTER', 'v' + VERSION, LANG, { sinEnlaces: true }) : 'ADPOSTER v' + VERSION + ' ' + new Date().getFullYear() + ' ' + T('es un proyecto hecho con') + ' by mediaservi.com'}</div>`; }
  function abre() { if (PREV || !cfg) return; if (ESC()) { const p = $('.panel'); p.innerHTML = `<div class="p-cab"><img src="${BASE}assets/logos/adposter-logo.svg" alt="ADPOSTER"><b></b></div><div class="acc"><button class="pri" data-a="cerrar">${T('Cerrar')}</button></div><div class="firma">${leeG('nombre') ? leeG('nombre').replace(/[<>&"]/g, '') + ' · ' : 'DISPLAY '}${DISP.toUpperCase()}${dir ? ' · ' + T('Directo') + ': ' + T(dir.up ? 'conectado' : 'sin conexión') : ''}<br>${window.AVCREDITO ? window.AVCREDITO.html('ADPOSTER', 'v' + VERSION, LANG, { sinEnlaces: true }) : 'ADPOSTER v' + VERSION}</div>`; p.querySelector('.p-cab b').textContent = cfg.nombre; document.body.classList.add('con-panel'); tPanel = Date.now(); p.querySelector('.pri').focus(); return; }
    borr = { segundos: cfg.segundos, fundido: { tipo: cfg.fundido.tipo, segundos: cfg.fundido.segundos }, contenido: cfg.contenido.slice(), anuncios: cfg.anuncios.slice() }; pinta(); document.body.classList.add('con-panel'); tPanel = Date.now(); const b = $('.panel .pri'); b && b.focus(); }
  function cierra() { document.body.classList.remove('con-panel'); }
  function accion(t) { const a = t.dataset.a, foco = sel => { pinta(); const e = $(sel); e && e.focus(); }; tPanel = Date.now();
    if (t.dataset.c) { const l = borr[t.dataset.g], i = l.indexOf(t.dataset.c); i < 0 ? l.push(t.dataset.c) : l.splice(i, 1); foco(`.panel label[data-g="${t.dataset.g}"][data-c="${t.dataset.c}"]`); return; }
    if (a === 'menos' || a === 'mas') { borr.segundos = Math.min(120, Math.max(2, borr.segundos + (a === 'mas' ? 1 : -1))); foco(`.panel [data-a="${a}"]`); }
    else if (a === 'tant' || a === 'tsig') { const i = TIPOS.indexOf(borr.fundido.tipo); borr.fundido.tipo = TIPOS[(i + (a === 'tsig' ? 1 : TIPOS.length - 1)) % TIPOS.length]; foco(`.panel [data-a="${a}"]`); }
    else if (a === 'ok') { guarda('local', borr); cierra(); aplica(); }
    else if (a === 'reset') { guarda('local', null); cierra(); aplica(); }
    else if (a === 'cerrar') cierra(); }
  const tactil = () => !!cfg && ESC() && cfg.tactil && cfg.tactil.activo;
  escena.addEventListener('click', e => { if (!document.body.classList.contains('con-panel')) { if (tactil()) { const p = e.target.closest('.pz[data-ir]'); if (p) { salto = p.dataset.ir; tToque = Date.now(); } else if (enMano) tToque = Date.now(); return; } abre(); return; } const t = e.target.closest('[data-a],[data-c]'); if (t) accion(t); });
  let tLargo = 0; escena.addEventListener('pointerdown', () => { if (!tactil()) return; clearTimeout(tLargo); tLargo = setTimeout(abre, 3000); }); ['pointerup', 'pointercancel', 'pointerleave'].forEach(k => escena.addEventListener(k, () => clearTimeout(tLargo)));   // en una lista táctil, el panel se abre manteniendo pulsado 3 s
  addEventListener('keydown', e => { const abierto = document.body.classList.contains('con-panel');
    if (!abierto) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abre(); } return; } tPanel = Date.now();
    if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'GoBack') { e.preventDefault(); cierra(); return; }
    const fs = $$('.panel button, .panel label'), i = fs.indexOf(document.activeElement);
    if (e.key === 'Enter' || e.key === ' ') { if (i >= 0) { e.preventDefault(); accion(fs[i]); } }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); (fs[(i + 1) % fs.length] || fs[0]).focus(); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); (fs[(i - 1 + fs.length) % fs.length] || fs[0]).focus(); } });
  let tRaton = 0; addEventListener('mousemove', () => { document.body.classList.add('raton'); clearTimeout(tRaton); tRaton = setTimeout(() => document.body.classList.remove('raton'), 2500); });

  /* ---------- vista previa del gestor: recibe los ajustes en vivo ---------- */
  if (PREV) addEventListener('message', e => { const d = e.data; if (d && d.adposter === 'cfg' && d.id === ID) { previa = d.cfg || null; previaMedios = d.medios || null; if (MAN) aplica(); } else if (d && d.adposter === 'orden' && d.o && ['aviso', 'cinta', 'apaga', 'ident'].includes(d.o.t)) orden(d.o); });   // el gestor enseña aquí lo que manda a los displays

  /* ---------- arranque ---------- */
  (async () => {
    while (!(await carga(true))) { aviso(T('Sin conexión: reintentando…')); await espera(8000); }
    if (PREV && window.parent !== window) window.parent.postMessage({ adposter: 'listo', id: ID }, '*');
    if (!PREV && cfg.redirige && /^https?:\/\//i.test(cfg.redirige)) { location.replace(cfg.redirige); return; }
    tamEscena(); if (cintaH && Date.now() > cintaH) { cintaR = ''; cintaH = 0; guardaG('cinta', ''); guardaG('cinta-h', ''); cinta(); margenes(); } if (EMR) pintaEmer(false); avisoFijo();
    bucle();
    setInterval(async () => { await carga(false); if (!PREV && PRE.fin && PRE.ok < PRE.total) { copiado = ''; copia(); }   // si alguna imagen no se pudo guardar, se reintenta en la siguiente vuelta
      if (!PREV && cfg.redirige && /^https?:\/\//i.test(cfg.redirige)) location.replace(cfg.redirige); }, PREV ? 3600000 : 300000);   // cada 5 minutos mira si hay contenido o ajustes nuevos
    if (!PREV) {
      setInterval(() => { if (document.body.classList.contains('con-panel') && Date.now() - tPanel > 90000) cierra();
        const lim = Math.max(180000, (cfg.segundos + cfg.segundosAnuncio + cfg.fundido.segundos) * 6000); if (Date.now() - ultimo > lim && navigator.onLine !== false) location.reload(); }, 15000);                 // si algo se atasca, se recupera solo
      setInterval(estado, 20000); agenda(); setInterval(agenda, 30000); setInterval(() => { if (cintaH && Date.now() > cintaH) { cintaR = ''; cintaH = 0; guardaG('cinta', ''); guardaG('cinta-h', ''); cinta(); margenes(); } if (cfg && diaA && hoyISO() !== diaA) aplica(); else if (cfg) { const np = calPool(); if (JSON.stringify(np) !== JSON.stringify(pool)) pool = np; } }, 60000);   /* v1.23 · y cada minuto, los que tienen horas */ /* v1.15 · a medianoche entran y salen los carteles con fecha */ setInterval(() => { if (cfg && cfg.cinta.activo && cfg.cinta.rss) rss(); }, 600000);
      const despierta = () => { try { navigator.wakeLock && navigator.wakeLock.request('screen').catch(() => {}); } catch (e) {} }; despierta(); document.addEventListener('visibilitychange', () => { if (!document.hidden) despierta(); });
    }
  })();
})();
