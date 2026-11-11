/* ADPOSTER · reproductor de cartelería digital para displays FHD, en vertical o en horizontal
   Arranca solo: basta con dar la URL de la playlist (…/cine, …/klub, …/p/?l=nombre) como página de inicio del kiosco.
   Lee playlists.json (ajustes) y assets/manifest.json (qué hay en cada carpeta), baraja sin repetir, intercala anuncios,
   vuelve a mirar cada pocos minutos por si hay contenido nuevo y sigue funcionando si se cae la red.
   v1.0 · formato horizontal (póster y anuncio a la vez), vídeo, cinta de texto (fija o de un RSS), código QR y, si la instalación tiene
   un canal en directo (directo.js), obedece al gestor al momento: cambiar de lista, aviso, cinta, apagar, recargar e identificarse.
   v1.1 · composiciones: una lista puede ser una serie de ESCENAS (escena.js) con textos, imágenes, zonas, reloj, el tiempo, noticias y QR;
   calendario (qué lista toca según la fecha, el día y la hora), orden fijo y duración por archivo.
   v1.2 · sin conexión: registra el service worker (sw.js) y le pide guardar las imágenes de la lista; si se cae la red, el display sigue con la última copia.
   Licencia GPL-3.0 · mediaservi.com */
(() => {
  'use strict';
  const VERSION = '1.2';
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
  if (!PREV) ['nombre', 'grupo', 'sede', 'canal'].forEach(k => { const v = Q.get(k); if (v !== null) guardaG(k, k === 'canal' ? (/^[a-z0-9]{6,40}$/i.test(v) ? v : '') : v.trim().slice(0, 32)); });
  const DEF = { nombre: ID.toUpperCase(), fondo: '', cabecera: 18, pie: 4.5, lado: 5, alinea: 'abajo', contenido: [], anuncios: [], segundos: 8, segundosAnuncio: 8, anunciosCada: [4, 7],
    fundido: { tipo: 'fundido', segundos: 2.5 }, movimiento: true, llenar: false, brillo: true, horario: { activo: false, desde: '09:00', hasta: '23:00', dias: [1, 2, 3, 4, 5, 6, 7] }, redirige: '',
    formato: 'vertical', qr: { activo: false, modo: 'url', url: '', texto: '', pos: 'bd' }, cinta: { activo: false, texto: '', rss: '' }, publico: false, modo: 'carteles', escenas: [], orden: 'azar', secuencia: [], archivos: {} };
  const TIPOS = ['fundido', 'zoom', 'desliza', 'cortina', 'corte'];

  /* ---------- idioma (es · en · ca) ---------- */
  const LANG = (Q.get('lang') || navigator.language || 'es').slice(0, 2).toLowerCase();
  const TX = { 'Duración de cada póster': ['Time per poster', 'Durada de cada pòster'], 'Transición': ['Transition', 'Transició'], 'Carpetas de contenido': ['Content folders', 'Carpetes de contingut'], 'Carpetas de anuncios': ['Ad folders', "Carpetes d'anuncis"],
    'Aceptar y reproducir': ['Apply and play', 'Accepta i reprodueix'], 'Restablecer': ['Reset', 'Restableix'], 'Cerrar': ['Close', 'Tanca'], 'fundido': ['fade', 'fosa'], 'zoom': ['zoom', 'zoom'], 'desliza': ['slide', 'llisca'], 'cortina': ['wipe', 'cortina'], 'corte': ['cut', 'tall'],
    'Sin conexión: reintentando…': ['Offline: retrying…', 'Sense connexió: reintentant…'], 'Esta playlist no tiene imágenes todavía.': ['This playlist has no images yet.', 'Aquesta playlist encara no té imatges.'], 'No existe la playlist': ['Playlist not found', 'No existeix la playlist'],
    'es un proyecto hecho con': ['is a project made with', 'és un projecte fet amb'], 'imágenes': ['images', 'imatges'], 'Contenido privado de este display': ['Private content of this display', 'Contingut privat d’aquest display'], 'Estos ajustes se guardan solo en este display.': ['These settings are saved on this display only.', 'Aquests ajustos es desen només en aquest display.'],
    'Directo': ['Live', 'Directe'], 'conectado': ['connected', 'connectat'], 'sin conexión': ['offline', 'sense connexió'] };
  const T = s => { const t = TX[s]; return !t || LANG === 'es' ? s : (LANG === 'ca' ? t[1] : LANG === 'en' ? t[0] : s); };

  /* ---------- utilidades ---------- */
  const lee = k => { try { return JSON.parse(localStorage.getItem(K + k)); } catch (e) { return null; } };
  const guarda = (k, v) => { try { v === null ? localStorage.removeItem(K + k) : localStorage.setItem(K + k, JSON.stringify(v)); } catch (e) {} };
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const mezcla = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const entre = (a, b) => a + Math.floor(Math.random() * (Math.max(a, b) - a + 1));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const num = (v, d, a, b) => { v = +v; return isFinite(v) ? Math.min(b, Math.max(a, v)) : d; };
  async function json(ruta) { const r = await fetch(DATOS + ruta + (ruta.includes('?') ? '&' : '?') + 't=' + Math.floor(Date.now() / 60000), { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); return r.json(); }
  const url = f => DATOS + 'assets/' + f.split('/').map(encodeURIComponent).join('/');

  /* ---------- escenario ---------- */
  document.body.classList.add('ap'); const rot = +Q.get('rot') || 0; if (rot === 90 || rot === 270) document.body.classList.add('rot', 'rot-' + rot); else if (rot === 180) document.body.classList.add('rot-180');   // giro del display: ?rot=90 (derecha), 180 (boca abajo) o 270 (izquierda)
  const escena = el('div'); escena.id = 'escena';
  escena.innerHTML = '<div class="fondo"></div><div class="marco"><div class="capa"><div class="hoja"><img alt=""></div></div><div class="capa"><div class="hoja"><img alt=""></div></div></div><div class="anuncio"><img alt=""></div><div class="anuncio"><img alt=""></div><div class="esc-capa"></div><div class="esc-capa"></div><div class="qr"><div class="q-img"></div><div class="q-txt"></div></div><div class="cinta"><div class="c-in"><span></span></div></div><div class="apagado"></div><div class="alerta"><div class="a-in"></div></div><div class="aviso"></div><div class="panel"></div>';
  document.body.appendChild(escena);
  const $ = s => escena.querySelector(s), $$ = s => [...escena.querySelectorAll(s)];
  const CAPAS = { feed: $$('.capa'), ads: $$('.anuncio') }, turno = { feed: 0, ads: 0 };
  const aviso = t => { const a = $('.aviso'); a.textContent = t || ''; a.classList.toggle('on', !!t); };

  /* ---------- ajustes: playlists.json ← ajustes de este display ← vista previa ---------- */
  let MAN = null, LISTAS = null, cfg = null, previa = null, previaMedios = null, pool = { feed: [], ads: [] }, recarga = null, ultimo = Date.now(), gen = 0;
  function calcula() {
    const base = (LISTAS && LISTAS.playlists && LISTAS.playlists[ID]) || null, local = PREV ? null : lee('local');
    const c = Object.assign({}, DEF, base || {}, local || {}, previa || {}); c.existe = !!(base || previa);
    c.fundido = Object.assign({}, DEF.fundido, (base || {}).fundido, (local || {}).fundido, (previa || {}).fundido); c.horario = Object.assign({}, DEF.horario, (base || {}).horario, (previa || {}).horario); c.qr = Object.assign({}, DEF.qr, (base || {}).qr, (previa || {}).qr); c.cinta = Object.assign({}, DEF.cinta, (base || {}).cinta, (previa || {}).cinta); if (c.formato !== 'horizontal') c.formato = 'vertical';
    c.modo = c.modo === 'escenas' ? 'escenas' : 'carteles'; c.escenas = Array.isArray(c.escenas) ? c.escenas.filter(e => e && typeof e === 'object') : []; c.archivos = c.archivos && typeof c.archivos === 'object' ? c.archivos : {}; c.secuencia = Array.isArray(c.secuencia) ? c.secuencia : [];
    c.segundos = num(c.segundos, 8, 2, 600); c.segundosAnuncio = num(c.segundosAnuncio, c.segundos, 2, 600); c.fundido.segundos = num(c.fundido.segundos, 2.5, 0, 10); if (!TIPOS.includes(c.fundido.tipo)) c.fundido.tipo = 'fundido';
    const ac = Array.isArray(c.anunciosCada) ? c.anunciosCada : [4, 7]; c.anunciosCada = [num(ac[0], 4, 1, 99), num(ac[1], 7, 1, 99)].sort((a, b) => a - b);
    return c;
  }
  /* ---------- sin conexión: el service worker guarda la app y las imágenes de la lista; si cae la red, el display sigue con la última copia ---------- */
  const SW = !PREV && 'serviceWorker' in navigator && (location.protocol === 'https:' || /^(localhost|127\.)/.test(location.hostname)) && new URL(DATOS).origin === location.origin;
  if (SW) { try { navigator.serviceWorker.register(BASE + 'sw.js').catch(() => {}); } catch (e) {} }
  let copiado = '';
  function copia() { if (!SW || !MAN || !cfg) return; const car = MAN.carpetas || {}, de = c => (car[c] || []).map(f => c + '/' + f), fs = new Set(pool.feed.concat(pool.ads));
    if (cfg.fondo) (car.fondos || []).forEach(x => { if (x.replace(/\.[a-z0-9]+$/i, '') === cfg.fondo) fs.add('fondos/' + x); });
    cfg.escenas.forEach(e => { if (e.fondo && e.fondo.t === 'img' && /^[\w .()\-\/]+$/.test(e.fondo.src || '')) fs.add(e.fondo.src); (e.piezas || []).forEach(z => { if (z.t === 'zona') (z.carp || []).forEach(c => de(c).forEach(f => fs.add(f))); else if (z.t === 'imagen' && /^[\w .()\-\/]+$/.test(z.src || '')) fs.add(z.src); }); });
    const urls = [...fs].filter(f => !esVideo(f)).slice(0, 600).map(url).concat([location.href.split('#')[0]]), firma = urls.join('|'); if (firma === copiado) return; copiado = firma;
    navigator.serviceWorker.ready.then(r => { r.active && r.active.postMessage({ t: 'pre', urls }); }).catch(() => {}); }
  function aplica() {
    cfg = calcula(); const car = (MAN && MAN.carpetas) || {}, junta = l => (l || []).flatMap(c => (car[c] || []).map(f => c + '/' + f)).filter(f => !(cfg.archivos[f] && cfg.archivos[f].off));
    pool = { feed: junta(cfg.contenido), ads: junta(cfg.anuncios) };
    const st = escena.style, hor = HOR();
    st.setProperty('--t', (cfg.fundido.tipo === 'corte' ? 0 : cfg.fundido.segundos) + 's'); st.setProperty('--dur', (cfg.segundos + cfg.fundido.segundos) + 's');
    escena.className = 't-' + cfg.fundido.tipo + (cfg.movimiento ? ' mov' : '') + (cfg.llenar && !hor ? ' llena' : '') + (cfg.brillo ? ' brillo' : '') + (hor ? ' horizontal' : '') + (hor && pool.feed.length && pool.ads.length && !ESC() ? ' dos' : '') + (ESC() ? ' modo-esc' : ''); if (!ESC()) limpiaEsc(); CAPAS.feed.forEach(c => c.classList.toggle('centro', cfg.alinea === 'centro'));
    const f = $('.fondo'), fs = car.fondos || [], fa = cfg.fondo && fs.find(x => x.replace(/\.[a-z0-9]+$/i, '') === cfg.fondo);
    if (fa) { const u = url('fondos/' + fa); if (f.dataset.u !== u) { const i = new Image(); i.onload = () => { f.style.backgroundImage = 'url("' + u + '")'; f.dataset.u = u; f.classList.add('on'); }; i.src = u; } } else { f.classList.remove('on'); f.dataset.u = ''; }
    cinta(); margenes(); qr(); if ((cfg.cinta.activo ? cfg.cinta.rss || '' : '') !== rssU) rss(); enlaza(); menu();
    document.title = 'ADPOSTER · ' + cfg.nombre; gen++; copia();
  }
  const HOR = () => !!cfg && cfg.formato === 'horizontal';
  const ESC = () => !!cfg && cfg.modo === 'escenas' && cfg.escenas.length > 0 && !!window.ADESCENA;
  /* márgenes del póster. En horizontal el de arriba es igual al de abajo; con la cinta en marcha, el de abajo le deja sitio */
  function margenes() { const st = escena.style, hor = HOR(), con = escena.classList.contains('con-cinta'), pie = Math.max(num(cfg.pie, 4.5, 0, 40), con ? (hor ? 8 : 4.6) : 0);
    st.setProperty('--cab', (hor ? pie : num(cfg.cabecera, 18, 0, 60)) + '%'); st.setProperty('--pie', pie + '%'); st.setProperty('--lado', num(cfg.lado, 5, 0, 30) + '%'); requestAnimationFrame(() => CAPAS.feed.forEach(encaja)); }
  async function carga(primera) {
    try { const [m, l] = await Promise.all([json('assets/manifest.json'), json('playlists.json')]);
      const nuevo = !MAN || m.version !== MAN.version || JSON.stringify(l) !== JSON.stringify(LISTAS); if (recarga !== null && l.recarga !== recarga && !PREV) { location.reload(); return true; }
      recarga = l.recarga === undefined ? '' : l.recarga; if (nuevo) { MAN = m; LISTAS = l; guarda('man', m); guarda('listas', l); aplica(); } aviso(''); return true;
    } catch (e) { if (primera) { MAN = lee('man'); LISTAS = lee('listas'); if (MAN && LISTAS) { recarga = LISTAS.recarga === undefined ? '' : LISTAS.recarga; aplica(); return true; } } return false; }
  }

  /* ---------- horario ---------- */
  const mins = s => { const m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; };
  function enHorario() { const h = cfg.horario; if (!h || !h.activo) return true; const d = new Date(), ahora = d.getHours() * 60 + d.getMinutes(), a = mins(h.desde), b = mins(h.hasta), dia = d.getDay() || 7, ayer = dia === 1 ? 7 : dia - 1, dias = Array.isArray(h.dias) && h.dias.length ? h.dias : [1, 2, 3, 4, 5, 6, 7];
    if (a === null || b === null || a === b) return dias.includes(dia); if (a < b) return dias.includes(dia) && ahora >= a && ahora < b; return (dias.includes(dia) && ahora >= a) || (dias.includes(ayer) && ahora < b); }   // tramo que pasa de medianoche

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
    const f = saca(tipo); if (!f) return false; const u = url(f), pre = await precarga(u); if (!pre) { await espera(400); return false; } if (ESC()) return true;   // mientras cargaba, la lista ha pasado a ser una composición
    const g = gen, vid = pre.tagName === 'VIDEO', capas = CAPAS[tipo], n = turno[tipo] % 2, entra = capas[n], sale = capas[1 - n], caja = c => (tipo === 'feed' ? c.querySelector('.hoja') : c), cj = caja(entra), img = cj.querySelector('img'), viejo = cj.querySelector('video'); turno[tipo]++;
    if (viejo) { viejo.pause(); viejo.remove(); } if (vid) { img.style.display = 'none'; img.removeAttribute('src'); cj.appendChild(pre); const pl = pre.play(); pl && pl.catch && pl.catch(() => {}); } else { img.style.display = ''; img.src = u; }
    const w = vid ? pre.videoWidth : pre.naturalWidth, h = vid ? pre.videoHeight : pre.naturalHeight;
    if (tipo === 'feed' && w && h) { cj.dataset.r = w / h; encaja(entra); cj.classList.remove('anim'); void cj.offsetWidth; cj.classList.add('anim'); }   // el movimiento arranca con cada póster y se mantiene mientras se va
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    sale.classList.add('sale'); sale.classList.remove('on'); entra.classList.remove('sale'); entra.classList.add('on'); const tf = cfg.fundido.tipo === 'corte' ? 0 : cfg.fundido.segundos * 1000, vs = caja(sale).querySelector('video');
    if (tipo === 'feed' && !escena.classList.contains('dos')) { setTimeout(() => CAPAS.ads.forEach(c => c.classList.remove('on', 'sale')), tf ? 60 : 0); }
    setTimeout(() => { sale.classList.remove('sale'); if (vs && vs.parentNode && !sale.classList.contains('on')) { vs.pause(); vs.remove(); } }, tf + 80); ultimo = Date.now(); actual[tipo] = f; if (tipo === 'feed') actual.ads = '';
    const prop = cfg.archivos[f] && +cfg.archivos[f].seg ? num(cfg.archivos[f].seg, 0, 2, 600) : 0, base = (prop || (tipo === 'ads' ? cfg.segundosAnuncio : cfg.segundos)) * 1000, dur = (vid && isFinite(pre.duration) && pre.duration > 0 ? Math.min(600000, Math.max(2000, pre.duration * 1000 - tf)) : base) + tf, t0 = Date.now();   // un vídeo dura lo que dura
    while (Date.now() - t0 < dur && g === gen) { await espera(200); ultimo = Date.now(); } return true;
  }
  let offR = !PREV && leeG('off') === '1';                                   // apagado a distancia desde el gestor
  const activo = () => enHorario() && !offR;
  async function serie(tipo, g) { while (g === gen && activo() && pool[tipo].length) { if (!(await paso(tipo))) await espera(300); } }
  async function bucle() {
    for (;;) {
      ultimo = Date.now();
      if (!cfg.existe) { if (!PREV) aviso(T('No existe la playlist') + ' «' + ID + '»'); await espera(PREV ? 300 : 5000); continue; }
      if (!activo()) { $('.apagado').classList.add('on'); aviso(''); await espera(PREV ? 600 : offR ? 1500 : 20000); continue; } $('.apagado').classList.remove('on');
      if (ESC()) { aviso(''); await escenas(); continue; }
      if (!pool.feed.length && !pool.ads.length) { aviso(T('Esta playlist no tiene imágenes todavía.')); await espera(3000); continue; } aviso('');
      if (HOR() && pool.feed.length && pool.ads.length) { const g = gen; await Promise.all([serie('feed', g), serie('ads', g)]); continue; }   // en horizontal, póster y anuncio conviven: cada uno lleva su ritmo
      if (pool.ads.length) await paso('ads');
      if (!pool.feed.length || ESC()) continue;
      const n = entre(cfg.anunciosCada[0], cfg.anunciosCada[1]); for (let i = 0; i < n && pool.feed.length && activo() && !ESC(); i++) await paso('feed');   // si la lista pasa a ser una composición, se deja la tanda
    }
  }

  /* ---------- composiciones: la lista es una serie de escenas que se van relevando ---------- */
  const escM = [null, null]; let escN = 0, escI = 0;
  const medios = () => previaMedios || (LISTAS && LISTAS.medios) || {};
  /* dirección de un archivo de una pieza: «m:clave» es una imagen guardada dentro de playlists.json; https://… es de fuera; lo demás, de assets/ */
  const urlE = s => { s = String(s || ''); if (s.indexOf('m:') === 0) { const d = medios()[s.slice(2)]; return typeof d === 'string' && /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,[a-z0-9+/=]+$/i.test(d) ? d : ''; } if (/^https:\/\/[^\s"'<>]+$/i.test(s)) return s; return /^[\w .()\-\/]+$/.test(s) && s.indexOf('..') < 0 ? url(s) : ''; };
  const hoyISO = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const vale = e => { const h = hoyISO(); return !e.off && (!e.desde || h >= e.desde) && (!e.hasta || h <= e.hasta); };   // una escena puede ser solo de temporada
  function limpiaEsc() { escM.forEach((m, i) => { if (m) { m.destruye(); escM[i] = null; } }); $$('.esc-capa').forEach(c => c.classList.remove('on', 'sale')); }
  async function escenas() { const g = gen, capas = $$('.esc-capa');
    while (g === gen && activo() && ESC()) { const lista = cfg.escenas.filter(vale); if (!lista.length) { limpiaEsc(); await espera(2000); ultimo = Date.now(); continue; }
      const e = lista[escI % lista.length]; escI++; const n = escN % 2, entra = capas[n], sale = capas[1 - n]; escN++;
      if (escM[n]) escM[n].destruye(); entra.classList.remove('on', 'sale'); escM[n] = window.ADESCENA.monta(entra, e, { vivo: true, red: true, lang: LANG, url: urlE, man: MAN, entra: true, base: DATOS });
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      sale.classList.add('sale'); sale.classList.remove('on'); entra.classList.add('on'); const tf = cfg.fundido.tipo === 'corte' ? 0 : cfg.fundido.segundos * 1000, viejo = 1 - n;
      setTimeout(() => { sale.classList.remove('sale'); if (!sale.classList.contains('on') && escM[viejo]) { escM[viejo].destruye(); escM[viejo] = null; } }, tf + 120);
      actual.feed = String(e.n || ''); actual.ads = ''; ultimo = Date.now(); const dur = num(e.seg, 12, 3, 3600) * 1000 + tf, t0 = Date.now(), sola = lista.length < 2;
      while (g === gen && activo() && (sola || Date.now() - t0 < dur)) { await espera(250); ultimo = Date.now(); if (sola && cfg.escenas.filter(vale).length !== 1) break; } }
    if (!ESC() || !activo()) limpiaEsc(); }

  /* ---------- calendario: qué lista toca en este display según la fecha, el día de la semana y la hora ---------- */
  const CASA = (() => { if (PREV) return ID; if (Q.get('ag') === '1') return leeG('casa') || ID; guardaG('casa', ID); return ID; })();   // la lista «de casa» es la de la URL del kiosco
  function agendaToca() { const A = LISTAS && Array.isArray(LISTAS.agenda) ? LISTAS.agenda : [], pl = (LISTAS && LISTAS.playlists) || {}; if (!A.length) return null; const d = new Date(), hoy = hoyISO(), dia = d.getDay() || 7, ahora = d.getHours() * 60 + d.getMinutes(), y = yo();
    const ok = r => { if (!r || r.on === false || !pl[r.lista]) return false; if ((r.desde && hoy < r.desde) || (r.hasta && hoy > r.hasta)) return false; if (Array.isArray(r.dias) && r.dias.length && !r.dias.includes(dia)) return false;
      const a = mins(r.hIni), b = mins(r.hFin); if (a !== null && b !== null && a !== b && !(a < b ? (ahora >= a && ahora < b) : (ahora >= a || ahora < b))) return false;
      return !r.k || r.k === 'todos' || (r.k === 'g' && y.g && y.g === slug(r.v)) || (r.k === 's' && y.s && y.s === slug(r.v)) || (r.k === 'd' && String(r.v).toLowerCase() === DISP); };
    const m = A.filter(ok); return m.length ? m[m.length - 1].lista : ''; }                                       // si coinciden varias, manda la última de la lista
  function agenda() { if (PREV || !LISTAS) return; const q = agendaToca(); if (q === null) return; const quiero = q || CASA; if (quiero && quiero !== ID) ir(quiero, true); }

  /* ---------- cinta de texto, código QR y aviso ---------- */
  let cintaR = PREV ? '' : leeG('cinta'), rssT = '', rssU = '', tAl = 0;
  function cinta() { const c = $('.cinta'), sp = c.querySelector('span'), x = (cintaR || (cfg && cfg.cinta.activo ? (rssT || cfg.cinta.texto) : '') || '').replace(/\s+/g, ' ').trim().slice(0, 1500);
    if (sp.textContent !== x) { sp.textContent = x; c.style.setProperty('--ct', Math.max(14, Math.round(x.length * .22 + 10)) + 's'); sp.style.animation = 'none'; void sp.offsetWidth; sp.style.animation = ''; }
    c.classList.toggle('on', !!x); escena.classList.toggle('con-cinta', !!x); }
  /* RSS en vivo: titulares de un canal RSS o Atom. Vale una dirección https (si ese servidor deja leerla desde otra web) o un archivo del propio origen (noticias.xml) */
  async function rss() { const u = cfg && cfg.cinta.activo ? (cfg.cinta.rss || '').trim() : ''; rssU = u; let txt = '';
    if (u) { try { const d = new URL(u, DATOS); if (!/^https?:$/.test(d.protocol)) throw 0; const r = await fetch(d.href, { cache: 'no-store' }); if (!r.ok) throw 0;
      const x = new DOMParser().parseFromString(await r.text(), 'text/xml'); txt = [...x.querySelectorAll('item > title, entry > title')].map(t => (t.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 15).join('   •   '); } catch (e) { txt = rssT && rssU === u ? rssT : ''; } }
    if (rssU !== u) return; rssT = txt; cinta(); margenes(); }
  function qr() { const q = $('.qr'), c = cfg.qr || {}; let u = ''; escena.classList.remove('qr-d', 'qr-i'); if (c.activo) { if (c.modo === 'publico') u = canalP ? BASE + 'elige/?c=' + canalP + '&d=' + DISP : (PREV ? BASE + 'elige/' : ''); else if (/^https?:\/\/\S+$/i.test((c.url || '').trim())) u = c.url.trim(); }
    if (!u || !window.qrcode) { q.classList.remove('on'); return; }
    if (q.dataset.u !== u) { try { const g = window.qrcode(0, 'M'); g.addData(u); g.make(); q.querySelector('.q-img').innerHTML = g.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); q.dataset.u = u; } catch (e) { q.classList.remove('on'); return; } }
    const t = q.querySelector('.q-txt'); t.textContent = String(c.texto || '').slice(0, 60); t.style.display = t.textContent ? '' : 'none'; const pos = ['bi', 'bd', 'ai', 'ad'].includes(c.pos) ? c.pos : 'bd'; q.className = 'qr on p-' + pos; escena.classList.add(pos[1] === 'i' ? 'qr-i' : 'qr-d'); requestAnimationFrame(() => CAPAS.feed.forEach(encaja)); }
  function alerta(x, s, c) { const a = $('.alerta'), i = a.firstElementChild; clearTimeout(tAl); x = String(x || '').trim().slice(0, 280); if (!x) { a.classList.remove('on'); return; }
    i.textContent = x; i.className = 'a-in c-' + (['ambar', 'rojo', 'verde', 'azul'].includes(c) ? c : 'ambar') + (x.length > 90 ? ' xs' : x.length > 36 ? ' sm' : ''); a.classList.remove('on'); void a.offsetWidth; a.classList.add('on'); tAl = setTimeout(() => a.classList.remove('on'), num(s, 10, 2, 600) * 1000); }

  /* ---------- directo: el display obedece al gestor al momento y le cuenta cómo está ---------- */
  let dir = null, dirP = null, dirK = null, canalP = '', uPide = 0;
  const yo = () => ({ n: leeG('nombre') || 'DISPLAY ' + DISP.toUpperCase(), g: slug(leeG('grupo')), s: slug(leeG('sede')) });
  const canalAct = () => leeG('canal') || (LISTAS && typeof LISTAS.canal === 'string' ? LISTAS.canal : '');
  function estado() { if (!dir || !cfg) return; const y = yo(); dir.pub('estado/' + DISP, { n: y.n, g: y.g, s: y.s, l: ID, ln: cfg.nombre, f: cfg.formato, w: innerWidth, h: innerHeight, v: VERSION, off: offR ? 2 : enHorario() ? 0 : 1, i: actual.ads || actual.feed || '', p: ORIGEN ? 1 : 0, t: Date.now() }, true); }
  function menu() { if (!dirP || !LISTAS) return; const pl = LISTAS.playlists || {}; dirP.pub('menu/' + DISP, { n: yo().n, l: ID, listas: Object.keys(pl).filter(k => pl[k] && pl[k].publico).slice(0, 24).map(k => ({ id: k, n: String(pl[k].nombre || k.toUpperCase()).slice(0, 40) })), t: Date.now() }, true); }
  function ir(id, porAgenda) { id = String(id || '').toLowerCase().replace(/[^a-z0-9_-]/g, ''); if (PREV || !id || id === ID || !LISTAS || !LISTAS.playlists || !LISTAS.playlists[id]) return false;
    const q = new URLSearchParams(); q.set('l', id); if (porAgenda) q.set('ag', '1'); if (rot) q.set('rot', rot); if (Q.get('lang')) q.set('lang', Q.get('lang')); location.replace(BASE + 'p/?' + q); return true; }
  function orden(o) { if (!o || typeof o !== 'object') return;
    if (o.t === 'lista') ir(o.id);
    else if (o.t === 'aviso') alerta(o.x, o.s, o.c);
    else if (o.t === 'cinta') { cintaR = String(o.x || '').slice(0, 600); if (!PREV) guardaG('cinta', cintaR); cinta(); margenes(); }
    else if (o.t === 'apaga') { offR = !!o.v; if (!PREV) guardaG('off', offR ? '1' : ''); gen++; estado(); }
    else if (o.t === 'recarga') { if (!PREV) location.reload(); }
    else if (o.t === 'ident') { const y = yo(); alerta(y.n + '\n' + DISP.toUpperCase() + (y.g ? ' · ' + y.g : '') + (y.s ? ' · ' + y.s : ''), 8, 'azul'); }
    else if (o.t === 'pon' && !PREV) { [['n', 'nombre'], ['g', 'grupo'], ['s', 'sede']].forEach(([a, k]) => { if (typeof o[a] === 'string') guardaG(k, o[a].trim().slice(0, 32)); }); enlaza(); estado(); menu(); } }
  function enlaza() { if (PREV || !window.ADDIRECTO) return; const c = canalAct(), y = yo(), k = c + '|' + y.g + '|' + y.s; if (k === dirK) return; dirK = k;
    if (dir) { dir.cierra(); dir = null; } if (dirP) { dirP.cierra(); dirP = null; } canalP = ''; if (!window.ADDIRECTO.canalOk(c)) { if (cfg) qr(); return; }
    dir = window.ADDIRECTO.conecta(c, { temas: ['orden/todos', 'orden/d/' + DISP].concat(y.g ? ['orden/g/' + y.g] : [], y.s ? ['orden/s/' + y.s] : []), alMensaje: (t, d) => orden(d), alCambiar: v => { if (v) estado(); } });
    /* el público entra por un canal aparte, derivado del principal: solo puede pedir una de las listas marcadas como elegibles, y no más de una cada pocos segundos */
    window.ADDIRECTO.publico(c).then(p => { if (!p || dirK !== k) return; canalP = p;
      dirP = window.ADDIRECTO.conecta(p, { temas: ['pide/' + DISP], alMensaje: (t, d) => { const id = d && d.t === 'lista' ? String(d.id || '').toLowerCase().replace(/[^a-z0-9_-]/g, '') : '', pl = (LISTAS && LISTAS.playlists) || {}; if (id && pl[id] && pl[id].publico && Date.now() - uPide > 8000) { uPide = Date.now(); ir(id); } }, alCambiar: v => { if (v) menu(); } }); if (cfg) qr(); }); }

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
      <div class="firma">${T('Estos ajustes se guardan solo en este display.')}${ORIGEN ? '<br>🔒 ' + T('Contenido privado de este display') : ''}<br>${leeG('nombre') ? leeG('nombre').replace(/[<>&"]/g, '') + ' · ' : 'DISPLAY '}${DISP.toUpperCase()}${dir ? ' · ' + T('Directo') + ': ' + T(dir.up ? 'conectado' : 'sin conexión') : ''}<br>${window.AVCREDITO ? window.AVCREDITO.html('ADPOSTER', 'v' + VERSION, LANG, { sinEnlaces: true }) : 'ADPOSTER v' + VERSION + ' ' + new Date().getFullYear() + ' ' + T('es un proyecto hecho con') + ' by mediaservi.com'}</div>`; }
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
  escena.addEventListener('click', e => { if (!document.body.classList.contains('con-panel')) { abre(); return; } const t = e.target.closest('[data-a],[data-c]'); if (t) accion(t); });
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
    bucle();
    setInterval(async () => { await carga(false); if (!PREV && cfg.redirige && /^https?:\/\//i.test(cfg.redirige)) location.replace(cfg.redirige); }, PREV ? 3600000 : 300000);   // cada 5 minutos mira si hay contenido o ajustes nuevos
    if (!PREV) {
      setInterval(() => { if (document.body.classList.contains('con-panel') && Date.now() - tPanel > 90000) cierra();
        const lim = Math.max(180000, (cfg.segundos + cfg.segundosAnuncio + cfg.fundido.segundos) * 6000); if (Date.now() - ultimo > lim && navigator.onLine !== false) location.reload(); }, 15000);                 // si algo se atasca, se recupera solo
      setInterval(estado, 20000); agenda(); setInterval(agenda, 30000); setInterval(() => { if (cfg && cfg.cinta.activo && cfg.cinta.rss) rss(); }, 600000);
      const despierta = () => { try { navigator.wakeLock && navigator.wakeLock.request('screen').catch(() => {}); } catch (e) {} }; despierta(); document.addEventListener('visibilitychange', () => { if (!document.hidden) despierta(); });
    }
  })();
})();
