/* ADPOSTER · reproductor de cartelería digital para displays FHD en vertical
   Arranca solo: basta con dar la URL de la playlist (…/cine, …/klub, …/p/?l=nombre) como página de inicio del kiosco.
   Lee playlists.json (ajustes) y assets/manifest.json (qué hay en cada carpeta), baraja sin repetir, intercala anuncios,
   vuelve a mirar cada pocos minutos por si hay contenido nuevo y sigue funcionando si se cae la red.
   Licencia GPL-3.0 · mediaservi.com */
(() => {
  'use strict';
  const VERSION = '0.6';
  const SC = document.currentScript, Q = new URLSearchParams(location.search);
  const BASE = new URL(SC.dataset.base || '../', location.href).href;
  const ID = (SC.dataset.playlist || Q.get('l') || 'demo').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const PREV = Q.has('prev');                                              // vista previa dentro del gestor
  const K = 'adposter:' + ID + ':';
  const DEF = { nombre: ID.toUpperCase(), fondo: '', cabecera: 18, pie: 4.5, lado: 5, alinea: 'abajo', contenido: [], anuncios: [], segundos: 8, segundosAnuncio: 8, anunciosCada: [4, 7],
    fundido: { tipo: 'fundido', segundos: 2.5 }, movimiento: true, llenar: false, brillo: true, horario: { activo: false, desde: '09:00', hasta: '23:00', dias: [1, 2, 3, 4, 5, 6, 7] }, redirige: '' };
  const TIPOS = ['fundido', 'zoom', 'desliza', 'cortina', 'corte'];

  /* ---------- idioma (es · en · ca) ---------- */
  const LANG = (Q.get('lang') || navigator.language || 'es').slice(0, 2).toLowerCase();
  const TX = { 'Duración de cada póster': ['Time per poster', 'Durada de cada pòster'], 'Transición': ['Transition', 'Transició'], 'Carpetas de contenido': ['Content folders', 'Carpetes de contingut'], 'Carpetas de anuncios': ['Ad folders', "Carpetes d'anuncis"],
    'Aceptar y reproducir': ['Apply and play', 'Accepta i reprodueix'], 'Restablecer': ['Reset', 'Restableix'], 'Cerrar': ['Close', 'Tanca'], 'fundido': ['fade', 'fosa'], 'zoom': ['zoom', 'zoom'], 'desliza': ['slide', 'llisca'], 'cortina': ['wipe', 'cortina'], 'corte': ['cut', 'tall'],
    'Sin conexión: reintentando…': ['Offline: retrying…', 'Sense connexió: reintentant…'], 'Esta playlist no tiene imágenes todavía.': ['This playlist has no images yet.', 'Aquesta playlist encara no té imatges.'], 'No existe la playlist': ['Playlist not found', 'No existeix la playlist'],
    'es un proyecto hecho con': ['is a project made with', 'és un projecte fet amb'], 'imágenes': ['images', 'imatges'], 'Estos ajustes se guardan solo en este display.': ['These settings are saved on this display only.', 'Aquests ajustos es desen només en aquest display.'] };
  const T = s => { const t = TX[s]; return !t || LANG === 'es' ? s : (LANG === 'ca' ? t[1] : LANG === 'en' ? t[0] : s); };

  /* ---------- utilidades ---------- */
  const lee = k => { try { return JSON.parse(localStorage.getItem(K + k)); } catch (e) { return null; } };
  const guarda = (k, v) => { try { v === null ? localStorage.removeItem(K + k) : localStorage.setItem(K + k, JSON.stringify(v)); } catch (e) {} };
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const mezcla = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const entre = (a, b) => a + Math.floor(Math.random() * (Math.max(a, b) - a + 1));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const num = (v, d, a, b) => { v = +v; return isFinite(v) ? Math.min(b, Math.max(a, v)) : d; };
  async function json(ruta) { const r = await fetch(BASE + ruta + (ruta.includes('?') ? '&' : '?') + 't=' + Math.floor(Date.now() / 60000), { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); return r.json(); }
  const url = f => BASE + 'assets/' + f.split('/').map(encodeURIComponent).join('/');

  /* ---------- escenario ---------- */
  document.body.classList.add('ap'); const rot = +Q.get('rot') || 0; if (rot === 90 || rot === 270) document.body.classList.add('rot', 'rot-' + rot); else if (rot === 180) document.body.classList.add('rot-180');   // giro del display: ?rot=90 (derecha), 180 (boca abajo) o 270 (izquierda)
  const escena = el('div'); escena.id = 'escena';
  escena.innerHTML = '<div class="fondo"></div><div class="marco"><div class="capa"><div class="hoja"><img alt=""></div></div><div class="capa"><div class="hoja"><img alt=""></div></div></div><div class="anuncio"><img alt=""></div><div class="anuncio"><img alt=""></div><div class="apagado"></div><div class="aviso"></div><div class="panel"></div>';
  document.body.appendChild(escena);
  const $ = s => escena.querySelector(s), $$ = s => [...escena.querySelectorAll(s)];
  const CAPAS = { feed: $$('.capa'), ads: $$('.anuncio') }, turno = { feed: 0, ads: 0 };
  const aviso = t => { const a = $('.aviso'); a.textContent = t || ''; a.classList.toggle('on', !!t); };

  /* ---------- ajustes: playlists.json ← ajustes de este display ← vista previa ---------- */
  let MAN = null, LISTAS = null, cfg = null, previa = null, pool = { feed: [], ads: [] }, recarga = null, ultimo = Date.now(), cambio = false;
  function calcula() {
    const base = (LISTAS && LISTAS.playlists && LISTAS.playlists[ID]) || null, local = PREV ? null : lee('local');
    const c = Object.assign({}, DEF, base || {}, local || {}, previa || {}); c.existe = !!(base || previa);
    c.fundido = Object.assign({}, DEF.fundido, (base || {}).fundido, (local || {}).fundido, (previa || {}).fundido); c.horario = Object.assign({}, DEF.horario, (base || {}).horario, (previa || {}).horario);
    c.segundos = num(c.segundos, 8, 2, 600); c.segundosAnuncio = num(c.segundosAnuncio, c.segundos, 2, 600); c.fundido.segundos = num(c.fundido.segundos, 2.5, 0, 10); if (!TIPOS.includes(c.fundido.tipo)) c.fundido.tipo = 'fundido';
    const ac = Array.isArray(c.anunciosCada) ? c.anunciosCada : [4, 7]; c.anunciosCada = [num(ac[0], 4, 1, 99), num(ac[1], 7, 1, 99)].sort((a, b) => a - b);
    return c;
  }
  function aplica() {
    cfg = calcula(); const car = (MAN && MAN.carpetas) || {}, junta = l => (l || []).flatMap(c => (car[c] || []).map(f => c + '/' + f));
    pool = { feed: junta(cfg.contenido), ads: junta(cfg.anuncios) };
    const st = escena.style; st.setProperty('--cab', num(cfg.cabecera, 18, 0, 60) + '%'); st.setProperty('--pie', num(cfg.pie, 4.5, 0, 40) + '%'); st.setProperty('--lado', num(cfg.lado, 5, 0, 30) + '%');
    st.setProperty('--t', (cfg.fundido.tipo === 'corte' ? 0 : cfg.fundido.segundos) + 's'); st.setProperty('--dur', (cfg.segundos + cfg.fundido.segundos) + 's');
    escena.className = 't-' + cfg.fundido.tipo + (cfg.movimiento ? ' mov' : '') + (cfg.llenar ? ' llena' : '') + (cfg.brillo ? ' brillo' : ''); CAPAS.feed.forEach(c => c.classList.toggle('centro', cfg.alinea === 'centro'));
    const f = $('.fondo'), fs = car.fondos || [], fa = cfg.fondo && fs.find(x => x.replace(/\.[a-z0-9]+$/i, '') === cfg.fondo);
    if (fa) { const u = url('fondos/' + fa); if (f.dataset.u !== u) { const i = new Image(); i.onload = () => { f.style.backgroundImage = 'url("' + u + '")'; f.dataset.u = u; f.classList.add('on'); }; i.src = u; } } else { f.classList.remove('on'); f.dataset.u = ''; }
    document.title = 'ADPOSTER · ' + cfg.nombre; cambio = true;
  }
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
  function saca(tipo) { const todo = pool[tipo]; if (!todo.length) return null; const hay = new Set(todo); let m = PREV ? (saca['m' + tipo] || []) : (lee('mazo-' + tipo) || []); m = m.filter(f => hay.has(f));
    if (!m.length) { m = mezcla(todo.slice()); const ult = saca['u' + tipo]; if (m.length > 1 && m[m.length - 1] === ult) [m[0], m[m.length - 1]] = [m[m.length - 1], m[0]]; }
    const f = m.pop(); saca['u' + tipo] = f; if (PREV) saca['m' + tipo] = m; else guarda('mazo-' + tipo, m); return f; }
  function precarga(u) { return new Promise(res => { const i = new Image(); let fin = false; const ok = v => { if (!fin) { fin = true; res(v); } }; const t = setTimeout(() => ok(false), 12000);
    i.onload = () => { clearTimeout(t); (i.decode ? i.decode().catch(() => {}) : Promise.resolve()).then(() => ok(i)); }; i.onerror = () => { clearTimeout(t); ok(false); }; i.src = u; }); }
  /* cada póster ocupa todo lo que cabe en su marco, sea cual sea su tamaño original */
  function encaja(capa) { const h = capa.querySelector('.hoja'); if (!h || !h.dataset.r) return; const m = $('.marco'), r = +h.dataset.r, w = Math.min(m.clientWidth, m.clientHeight * r); h.style.width = w + 'px'; h.style.height = w / r + 'px'; h.style.setProperty('--k', (Math.max(m.clientWidth / w, m.clientHeight / (w / r)) * 1.015).toFixed(4)); }
  addEventListener('resize', () => CAPAS.feed.forEach(encaja));
  async function paso(tipo) {
    const f = saca(tipo); if (!f) return false; const u = url(f), pre = await precarga(u); if (!pre) { await espera(400); return false; }
    const capas = CAPAS[tipo], n = turno[tipo] % 2, entra = capas[n], sale = capas[1 - n], img = entra.querySelector('img'); img.src = u; turno[tipo]++; if (tipo === 'feed' && pre.naturalWidth) { const hj = entra.querySelector('.hoja'); hj.dataset.r = pre.naturalWidth / pre.naturalHeight; encaja(entra); hj.classList.remove('anim'); void hj.offsetWidth; hj.classList.add('anim'); }   // el movimiento arranca con cada póster y se mantiene mientras se va
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    sale.classList.add('sale'); sale.classList.remove('on'); entra.classList.remove('sale'); entra.classList.add('on'); const tf = cfg.fundido.tipo === 'corte' ? 0 : cfg.fundido.segundos * 1000;
    if (tipo === 'feed') { setTimeout(() => CAPAS.ads.forEach(c => c.classList.remove('on', 'sale')), tf ? 60 : 0); }
    setTimeout(() => sale.classList.remove('sale'), tf + 80); ultimo = Date.now(); cambio = false;
    const dur = (tipo === 'ads' ? cfg.segundosAnuncio : cfg.segundos) * 1000 + tf, t0 = Date.now(); while (Date.now() - t0 < dur && !cambio) await espera(200); return true;
  }
  async function bucle() {
    for (;;) {
      ultimo = Date.now();
      if (!cfg.existe) { if (!PREV) aviso(T('No existe la playlist') + ' «' + ID + '»'); await espera(PREV ? 300 : 5000); continue; }
      if (!enHorario()) { $('.apagado').classList.add('on'); aviso(''); await espera(PREV ? 1000 : 20000); continue; } $('.apagado').classList.remove('on');
      if (!pool.feed.length && !pool.ads.length) { aviso(T('Esta playlist no tiene imágenes todavía.')); await espera(3000); continue; } aviso('');
      if (pool.ads.length) await paso('ads');
      if (!pool.feed.length) continue;
      const n = entre(cfg.anunciosCada[0], cfg.anunciosCada[1]); for (let i = 0; i < n && pool.feed.length && enHorario(); i++) await paso('feed');
    }
  }

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
      <div class="firma">${T('Estos ajustes se guardan solo en este display.')}<br>${window.AVCREDITO ? window.AVCREDITO.html('ADPOSTER', 'v' + VERSION, LANG, { sinEnlaces: true }) : 'ADPOSTER v' + VERSION + ' ' + new Date().getFullYear() + ' ' + T('es un proyecto hecho con') + ' by mediaservi.com'}</div>`; }
  function abre() { if (PREV || !cfg) return; borr = { segundos: cfg.segundos, fundido: { tipo: cfg.fundido.tipo, segundos: cfg.fundido.segundos }, contenido: cfg.contenido.slice(), anuncios: cfg.anuncios.slice() }; pinta(); document.body.classList.add('con-panel'); tPanel = Date.now(); const b = $('.panel .pri'); b && b.focus(); }
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
  if (PREV) addEventListener('message', e => { const d = e.data; if (d && d.adposter === 'cfg' && d.id === ID) { previa = d.cfg || null; if (MAN) aplica(); } });

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
      const despierta = () => { try { navigator.wakeLock && navigator.wakeLock.request('screen').catch(() => {}); } catch (e) {} }; despierta(); document.addEventListener('visibilitychange', () => { if (!document.hidden) despierta(); });
    }
  })();
})();
