/* ADPOSTER · composiciones: pinta una ESCENA (un lienzo con piezas colocadas libremente) dentro de un contenedor.
   Lo usan el reproductor (player.js) y el editor del gestor (editor.js) con el mismo código: lo que se compone es lo que sale.

   Escena: { id, n, seg, fondo: { t: 'color'|'deg'|'malla'|'img', c, c2, c3, a, src, osc, tr }, piezas: [ … ] }
   Pieza:  { id, t, x, y, w, h (en % del lienzo), r (giro en grados), o (opacidad), an (entrada), ret (retardo), oculta, bloq,
             fondo, radio, borde, bcol, sombra (la caja)  +  lo propio de cada tipo:
             texto · imagen · video · zona (una carpeta que va pasando) · reloj · fecha · tiempo · rss · qr · forma · web
             v1.23 · turno (número llamado, puesto e historial) · pedidos (preparando / listos) · precios (filas escritas o una hoja CSV publicada)
             y, en cualquier pieza, «ir» (id de escena): en una lista táctil, tocarla lleva a esa escena }
   Los datos en vivo (turno y pedidos) llegan por window.ADVIVO, que rellena el reproductor con lo que manda el gestor por el directo.
   Las medidas de letra, radios y bordes van en «u» = una centésima del lado corto del display.

   window.ADESCENA = { FUENTES, TIPOS, nueva(tipo, hor), monta(cont, escena, ctx) → { pon(escena), ajusta(), destruye() } }
   ctx = { vivo (anima y pasa las zonas), red (puede pedir el tiempo y las noticias), edita (enseña los marcadores de «falta elegir»), lang, url(src) → dirección de un archivo, man (índice de carpetas), entra (anima la entrada) }
   Licencia GPL-3.0 · mediaservi.com */
(() => {
  'use strict';
  const FUENTES = [['Inter', 'Inter'], ['Montserrat', 'Montserrat'], ['Poppins', 'Poppins'], ['Bebas Neue', 'Bebas Neue'], ['Anton', 'Anton'], ['Oswald', 'Oswald'], ['League Gothic', 'League Gothic'], ['Archivo Black', 'Archivo Black'],
    ['Playfair', 'Playfair Display'], ['Abril', 'Abril Fatface'], ['Cinzel', 'Cinzel'], ['Marcellus', 'Marcellus'], ['Alfa Slab', 'Alfa Slab One'], ['Fredoka', 'Fredoka'], ['Righteous', 'Righteous'], ['Pacifico', 'Pacifico'], ['Caveat', 'Caveat'], ['Courier', 'Courier Prime'], ['Mono', 'Share Tech Mono']];
  const TIPOS = ['texto', 'imagen', 'video', 'zona', 'forma', 'reloj', 'fecha', 'tiempo', 'rss', 'qr', 'web', 'turno', 'pedidos', 'precios'];
  const VIVO = window.ADVIVO || (window.ADVIVO = { d: {}, fs: new Set(), pon(k, v) { this.d[k] = v; this.fs.forEach(f => { try { f(k, v); } catch (e) {} }); }, oye(f) { this.fs.add(f); return () => this.fs.delete(f); } });
  const FAM = f => (FUENTES.find(x => x[1] === f) || FUENTES[0])[1];
  const col = (c, d) => typeof c === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(c) ? c : d;
  const num = (v, d, a, b) => { v = +v; return isFinite(v) ? Math.min(b, Math.max(a, v)) : d; };
  const el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
  const U = n => 'calc(var(--u) * ' + n + ')';
  const TXT = { es: { imagen: 'Imagen', video: 'Vídeo', zona: 'Zona de carpeta', web: 'Página web', rss: 'Noticias', sin: 'elige un archivo', sinc: 'elige una carpeta', sinu: 'escribe la dirección', tit: ['Titular de ejemplo de las noticias en directo', 'Segundo titular, tal como llegará del canal', 'Tercer titular de muestra'], lugar: 'Tu ciudad', turno: 'TURNO', prep: 'PREPARANDO', listos: 'LISTOS', precios: 'Café con leche;1,60 €\nCroissant;1,90 €\nTostada con tomate;2,40 €\nZumo natural;3,10 €', sinh: 'pega la dirección de la hoja (CSV)' },
    en: { imagen: 'Image', video: 'Video', zona: 'Folder zone', web: 'Web page', rss: 'News', sin: 'pick a file', sinc: 'pick a folder', sinu: 'type the address', tit: ['Sample headline from the live news feed', 'Second headline, as it will arrive from the feed', 'Third sample headline'], lugar: 'Your city', turno: 'NOW SERVING', prep: 'PREPARING', listos: 'READY', precios: 'Latte;1.60\nCroissant;1.90\nToast with tomato;2.40\nFresh juice;3.10', sinh: 'paste the sheet address (CSV)' },
    ca: { imagen: 'Imatge', video: 'Vídeo', zona: 'Zona de carpeta', web: 'Pàgina web', rss: 'Notícies', sin: 'tria un arxiu', sinc: 'tria una carpeta', sinu: "escriu l'adreça", tit: ['Titular d’exemple de les notícies en directe', 'Segon titular, tal com arribarà del canal', 'Tercer titular de mostra'], lugar: 'La teva ciutat', turno: 'TORN', prep: 'PREPARANT', listos: 'A PUNT', precios: 'Cafè amb llet;1,60 €\nCroissant;1,90 €\nTorrada amb tomàquet;2,40 €\nSuc natural;3,10 €', sinh: 'enganxa l’adreça del full (CSV)' } };
  const esVideo = f => /\.(mp4|webm|m4v|mov)(\?|$)/i.test(f || '');

  /* ---------- pieza nueva, con valores sensatos para cada tipo ---------- */
  let nId = 0; const id = () => 'p' + Date.now().toString(36) + (nId++).toString(36);
  function nueva(t, hor) { const b = { id: id(), t, x: 25, y: 40, w: 50, h: hor ? 22 : 12, r: 0, o: 1 }, cuad = (lado) => { const w = hor ? lado * 9 / 16 : lado, h = hor ? lado : lado * 9 / 16; return { w, h, x: 50 - w / 2, y: 50 - h / 2 }; };
    if (t === 'texto') return Object.assign(b, { x: 10, w: 80, tx: 'Texto', fam: 'Inter', peso: 800, tam: 7, auto: true, col: '#ffffff', ali: 'cen', val: 'cen' });
    if (t === 'imagen') return Object.assign(b, cuad(50), { src: '', aj: 'cubrir' });
    if (t === 'video') return Object.assign(b, cuad(60), { src: '', aj: 'cubrir' });
    if (t === 'zona') return Object.assign(b, hor ? { x: 5, y: 10, w: 40, h: 80 } : { x: 10, y: 20, w: 80, h: 55 }, { carp: [], seg: 8, aj: 'contener' });
    if (t === 'forma') return Object.assign(b, { f: 'rect', col: '#ffb000', x: 20, w: 60, y: 45, h: 10 });
    if (t === 'reloj') return Object.assign(b, { est: 'digital', sg: false, fam: 'Inter', col: '#ffffff', x: 25, w: 50, y: 6, h: hor ? 14 : 8 });
    if (t === 'fecha') return Object.assign(b, { fmt: 'larga', fam: 'Inter', col: '#ffffff', may: true, x: 15, w: 70, y: 16, h: hor ? 8 : 5 });
    if (t === 'tiempo') return Object.assign(b, { lat: 41.39, lon: 2.17, lugar: 'Barcelona', dias: true, col: '#ffffff', fam: 'Inter', x: 15, w: 70, y: 70, h: hor ? 22 : 12 });
    if (t === 'rss') return Object.assign(b, { url: '', modo: 'cinta', n: 4, fam: 'Inter', col: '#ffffff', tam: 3, fondo: '#000000b3', x: 0, w: 100, y: 92, h: hor ? 8 : 5 });
    if (t === 'qr') return Object.assign(b, cuad(26), { url: '', col: '#000000', cfondo: '#ffffff', radio: 1.2 });
    if (t === 'web') return Object.assign(b, { url: '', x: 10, y: 15, w: 80, h: 60 });
    if (t === 'turno') return Object.assign(b, { tit: '', nh: 3, col: '#ffffff', acento: '#ffb000', fam: 'Inter', fondo: '#000000a6', radio: 2, x: 8, w: 84, y: 18, h: hor ? 64 : 46 });
    if (t === 'pedidos') return Object.assign(b, { col: '#ffffff', fam: 'Inter', fondo: '#000000a6', radio: 2, x: 4, w: 92, y: 12, h: hor ? 80 : 76 });
    if (t === 'precios') return Object.assign(b, { src: 'texto', filas: '', url: '', cn: 1, cp: 2, cab: true, ref: 10, cols: 1, col: '#ffffff', acento: '#ffb000', fam: 'Inter', x: 8, w: 84, y: 20, h: hor ? 66 : 56 });
    return b; }

  /* ---------- iconos del tiempo (dibujos propios) ---------- */
  const SOL = '<circle cx="32" cy="32" r="12" fill="#ffc531"/><g stroke="#ffc531" stroke-width="4" stroke-linecap="round"><path d="M32 6v7M32 51v7M6 32h7M51 32h7M13.6 13.6l5 5M45.4 45.4l5 5M13.6 50.4l5-5M45.4 18.6l5-5"/></g>';
  const LUNA = '<path d="M41 10a22 22 0 1 0 13 30A18 18 0 0 1 41 10z" fill="#dfe6f5"/>';
  const NUBE = (x, y, c) => `<path transform="translate(${x} ${y})" d="M14 34a11 11 0 0 1 1.6-21.9A14 14 0 0 1 42.5 15 9.5 9.5 0 0 1 42 34z" fill="${c}"/>`;
  const GOTAS = c => `<g stroke="${c}" stroke-width="3.6" stroke-linecap="round"><path d="M22 46l-3 8M33 46l-3 8M44 46l-3 8"/></g>`;
  const ICO = { sol: SOL, luna: LUNA, parcial: '<g transform="translate(-6 -8) scale(.8)">' + SOL + '</g>' + NUBE(8, 16, '#eef2f8'), parcialn: '<g transform="translate(4 -4) scale(.7)">' + LUNA + '</g>' + NUBE(8, 16, '#cfd6e4'), nube: NUBE(2, 8, '#aab4c6') + NUBE(12, 16, '#eef2f8'),
    niebla: NUBE(8, 4, '#dbe1ec') + '<g stroke="#dbe1ec" stroke-width="3.6" stroke-linecap="round"><path d="M12 46h40M18 54h30"/></g>', lluvia: NUBE(8, 4, '#cfd6e4') + GOTAS('#58b7ff'), nieve: NUBE(8, 4, '#eef2f8') + '<g fill="#fff"><circle cx="22" cy="50" r="3"/><circle cx="33" cy="54" r="3"/><circle cx="44" cy="50" r="3"/></g>',
    tormenta: NUBE(8, 4, '#9aa5b8') + '<path d="M34 40l-9 12h7l-3 10 11-14h-7z" fill="#ffc531"/>' };
  const icono = (cod, dia) => { const k = cod === 0 ? (dia ? 'sol' : 'luna') : cod <= 2 ? (dia ? 'parcial' : 'parcialn') : cod === 3 ? 'nube' : cod <= 48 ? 'niebla' : cod <= 67 ? 'lluvia' : cod <= 77 ? 'nieve' : cod <= 82 ? 'lluvia' : cod <= 86 ? 'nieve' : 'tormenta'; return '<svg viewBox="0 0 64 64" aria-hidden="true">' + ICO[k] + '</svg>'; };

  /* ---------- datos de fuera: el tiempo (Open-Meteo) y las noticias (RSS). Se guardan un rato para no pedirlos de más ---------- */
  const mem = {}, lsLee = k => { try { return JSON.parse(localStorage.getItem('adposter:' + k)); } catch (e) { return null; } }, lsPon = (k, v) => { try { localStorage.setItem('adposter:' + k, JSON.stringify(v)); } catch (e) {} };
  async function trae(clave, minutos, pide) { const m = mem[clave] || lsLee(clave); if (m && Date.now() - m.t < minutos * 60000) return m.d; try { const d = await pide(); mem[clave] = { t: Date.now(), d }; lsPon(clave, mem[clave]); return d; } catch (e) { return m ? m.d : null; } }
  const tiempo = (lat, lon) => trae('tiempo:' + lat.toFixed(2) + ',' + lon.toFixed(2), 30, async () => { const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat.toFixed(3) + '&longitude=' + lon.toFixed(3) + '&current=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4'); if (!r.ok) throw 0; const j = await r.json();
    return { g: Math.round(j.current.temperature_2m), c: j.current.weather_code, d: j.current.is_day ? 1 : 0, dias: j.daily.time.slice(1, 4).map((f, i) => ({ f, c: j.daily.weather_code[i + 1], a: Math.round(j.daily.temperature_2m_max[i + 1]), b: Math.round(j.daily.temperature_2m_min[i + 1]) })) }; });
  const noticias = (u, base) => trae('rss:' + u, 10, async () => { const d = new URL(u, base || location.href); if (!/^https?:$/.test(d.protocol)) throw 0; const r = await fetch(d.href, { cache: 'no-store' }); if (!r.ok) throw 0;
    const x = new DOMParser().parseFromString(await r.text(), 'text/xml'), t = [...x.querySelectorAll('item > title, entry > title')].map(e => (e.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 20); if (!t.length) throw 0; return t; });

  /* v1.23 · fuente de datos «Hoja»: una hoja de cálculo publicada como CSV (Google Sheets → Archivo → Compartir → Publicar en la web → CSV) o un .csv propio.
     Se refresca cada pocos minutos y, sin red, se usa la última copia guardada en el display */
  function csv(t) { t = String(t || '').replace(/^\ufeff/, ''); const l1 = t.split(/\r?\n/)[0] || '', sep = (l1.match(/;/g) || []).length > (l1.match(/,/g) || []).length ? ';' : (l1.indexOf('\t') >= 0 ? '\t' : ','), F = []; let f = [], c = '', q = false;
    for (let i = 0; i < t.length; i++) { const ch = t[i]; if (q) { if (ch === '"') { if (t[i + 1] === '"') { c += '"'; i++; } else q = false; } else c += ch; } else if (ch === '"') q = true; else if (ch === sep) { f.push(c); c = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && t[i + 1] === '\n') i++; f.push(c); F.push(f); f = []; c = ''; } else c += ch; }
    if (c || f.length) { f.push(c); F.push(f); } return F.filter(r => r.some(x => String(x).trim())); }
  const hoja = (u, base, min) => trae('hoja:' + u, Math.max(1, min || 10), async () => { const d = new URL(u, base || location.href); if (!/^https?:$/.test(d.protocol)) throw 0; const r = await fetch(d.href, { cache: 'no-store' }); if (!r.ok) throw 0; const F = csv(await r.text()); if (!F.length) throw 0; return F; });

  /* ---------- el fondo de la escena ---------- */
  function fondo(cont, f, ctx) { f = f || {}; const c = col(f.c, '#101014'), c2 = col(f.c2, '#3a1c71'), c3 = col(f.c3, c2); let bg = c;
    if (f.t === 'deg') bg = 'linear-gradient(' + num(f.a, 160, 0, 360) + 'deg,' + c + ',' + c2 + ')';
    else if (f.t === 'malla') bg = 'radial-gradient(at 18% 12%,' + c2 + ' 0,transparent 58%),radial-gradient(at 88% 30%,' + c3 + ' 0,transparent 52%),radial-gradient(at 55% 105%,' + c2 + ' 0,transparent 62%),' + c;
    cont.style.background = bg; let im = cont.querySelector(':scope > .f-img'), os = cont.querySelector(':scope > .f-osc'), tr = cont.querySelector(':scope > .f-tr');
    const u = f.t === 'img' && f.src ? ctx.url(f.src) : '';
    if (u) { if (!im) { im = el('div', 'f-img'); cont.prepend(im); } if (im.dataset.u !== u) { im.style.backgroundImage = 'url("' + u.replace(/["\\\n]/g, '') + '")'; im.dataset.u = u; } if (!os) { os = el('div', 'f-osc'); im.after(os); } os.style.opacity = num(f.osc, 0, 0, .95); } else { im && im.remove(); os && os.remove(); }
    const T = { puntos: 'radial-gradient(rgba(255,255,255,.16) 12%,transparent 13%) 0 0/' + U(3) + ' ' + U(3), lineas: 'repeating-linear-gradient(135deg,rgba(255,255,255,.07) 0 ' + U(.5) + ',transparent ' + U(.5) + ' ' + U(3) + ')', rejilla: 'linear-gradient(rgba(255,255,255,.08) ' + U(.14) + ',transparent ' + U(.14) + ') 0 0/' + U(6) + ' ' + U(6) + ',linear-gradient(90deg,rgba(255,255,255,.08) ' + U(.14) + ',transparent ' + U(.14) + ') 0 0/' + U(6) + ' ' + U(6), vineta: 'radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.6) 100%)' }[f.tr];
    if (T) { if (!tr) { tr = el('div', 'f-tr'); (os || im || { after: x => cont.prepend(x) }).after(tr); } tr.style.background = T; } else tr && tr.remove(); }

  /* ---------- ajuste de la letra a su caja: nunca se corta ---------- */
  function mide(caja) { const cs = getComputedStyle(caja); return [caja.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), caja.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)]; }
  function encaja(caja, tx, envuelve, tope) { const [W, H] = mide(caja); if (W < 3 || H < 3) { tx.style.fontSize = Math.max(.3, Math.min(W, H) * .8) + 'px'; return; } let a = .5, b = Math.max(2, tope || H * 1.2);
    for (let i = 0; i < 10; i++) { const m = (a + b) / 2; tx.style.fontSize = m + 'px'; const ok = envuelve ? (tx.scrollWidth <= Math.ceil(W) + 1 && tx.offsetHeight <= H + 1) : (tx.offsetWidth <= W + 1 && tx.offsetHeight <= H + 1); if (ok) a = m; else b = m; } tx.style.fontSize = a + 'px'; }

  /* ---------- cada tipo de pieza: hace(pieza, caja, ctx) devuelve { ajusta?, tic?, fin? } ---------- */
  /* v1.23 · los datos de ejemplo del editor llevan la marca EJEMPLO: así nadie piensa que esos precios o titulares saldrán en la pantalla */
  const ej = (caja, ctx, si) => { if (!ctx || !ctx.edita || ctx.mini) return; caja.classList.toggle('ejemplo', !!si); caja.dataset.ej = ctx.lang === 'en' ? 'SAMPLE' : ctx.lang === 'ca' ? 'EXEMPLE' : 'EJEMPLO'; };
  const vacio = (caja, t, nota, ctx) => { if (!ctx || !ctx.edita) return; const v = el('div', 'vacio'); v.textContent = t; if (nota) { const s = el('small'); s.textContent = nota; v.appendChild(s); } caja.appendChild(v); };
  const letra = (e, p, peso) => { e.style.fontFamily = "'" + FAM(p.fam) + "',Inter,Arial,sans-serif"; e.style.fontWeight = peso || 800; e.style.color = col(p.col, '#ffffff'); };
  const HAZ = {
    texto(p, caja) { const tx = el('div', 'tx'); tx.textContent = String(p.tx == null ? '' : p.tx).slice(0, 2000); letra(tx, p, [400, 700, 800].includes(+p.peso) ? +p.peso : 800); caja.classList.add('v-' + (['arr', 'cen', 'aba'].includes(p.val) ? p.val : 'cen'));
      tx.style.textAlign = p.ali === 'izq' ? 'left' : p.ali === 'der' ? 'right' : 'center'; if (p.cur) tx.style.fontStyle = 'italic'; if (p.may) tx.style.textTransform = 'uppercase'; if (p.esp) tx.style.letterSpacing = num(p.esp, 0, -.1, 1) + 'em'; if (p.lh) tx.style.lineHeight = num(p.lh, 1.08, .7, 6); if (p.auto !== false) tx.style.overflowWrap = 'normal';   // al ajustar la letra a la caja, las palabras no se parten
      if (p.stx) tx.style.textShadow = '0 ' + U(.25) + ' ' + U(1.2) + ' rgba(0,0,0,.65)'; if (p.pad) caja.style.padding = U(num(p.pad, 0, 0, 12)); caja.appendChild(tx);
      return { ajusta() { if (p.auto === false) tx.style.fontSize = U(num(p.tam, 7, .5, 80)); else encaja(caja, tx, true); } }; },
    imagen(p, caja, ctx) { const u = p.src ? ctx.url(p.src) : ''; if (!u) { vacio(caja, T(ctx).imagen, T(ctx).sin, ctx); return {}; } if (p.aj === 'contener') caja.classList.add('contener'); const i = el('img'); i.alt = ''; i.decoding = 'async'; i.draggable = false; i.onerror = () => { i.remove(); vacio(caja, T(ctx).imagen, String(p.src).slice(0, 60), ctx); }; i.src = u;
      const F = { gris: 'grayscale(1)', sepia: 'sepia(.85)', oscuro: 'brightness(.55)', claro: 'brightness(1.25) contrast(1.05)', desenfoque: 'blur(' + U(.8) + ')' }[p.fil]; if (F) i.style.filter = F; caja.appendChild(i); return {}; },
    video(p, caja, ctx) { const u = p.src ? ctx.url(p.src) : ''; if (!u) { vacio(caja, T(ctx).video, T(ctx).sin, ctx); return {}; } if (p.aj === 'contener') caja.classList.add('contener'); const v = el('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.preload = ctx.vivo ? 'auto' : 'metadata'; v.src = u; caja.appendChild(v);
      if (ctx.vivo) { const pl = v.play(); pl && pl.catch && pl.catch(() => {}); } return { fin() { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {} } }; },
    zona(p, caja, ctx) { const car = (ctx.man && ctx.man.carpetas) || {}, lista = (Array.isArray(p.carp) ? p.carp : []).flatMap(c => (car[c] || []).map(f => c + '/' + f)); if (!lista.length) { vacio(caja, T(ctx).zona, (p.carp || []).join(' · ') || T(ctx).sinc, ctx); return {}; }
      if (p.aj !== 'cubrir') caja.classList.add('contener'); const z = [el('div', 'z'), el('div', 'z')]; z.forEach(x => caja.appendChild(x)); let n = 0, t = 0, vivo = true, mazo = [];
      const pon = () => { if (!vivo) return; if (!mazo.length) { mazo = lista.slice(); if (ctx.vivo) for (let i = mazo.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [mazo[i], mazo[j]] = [mazo[j], mazo[i]]; } } const f = mazo.shift(), u = ctx.url(f), entra = z[n % 2], sale = z[(n + 1) % 2]; n++;
        const listo = dur => { if (!vivo) return; entra.classList.add('on'); sale.classList.remove('on'); setTimeout(() => { if (vivo && !sale.classList.contains('on')) sale.textContent = ''; }, 1500); if (ctx.vivo && lista.length > 1) t = setTimeout(pon, dur); };
        entra.textContent = ''; if (esVideo(f)) { const v = el('video'); v.muted = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.src = u; entra.appendChild(v); if (ctx.vivo) { const pl = v.play(); pl && pl.catch && pl.catch(() => {}); } v.onloadeddata = () => listo(Math.min(600000, Math.max(2000, (v.duration || p.seg || 8) * 1000))); v.onerror = () => { if (vivo && ctx.vivo) t = setTimeout(pon, 600); }; }
        else { const i = el('img'); i.alt = ''; i.draggable = false; i.onload = () => listo(num(p.seg, 8, 2, 600) * 1000); i.onerror = () => { if (vivo && ctx.vivo) t = setTimeout(pon, 600); }; i.src = u; entra.appendChild(i); } };
      pon(); return { fin() { vivo = false; clearTimeout(t); caja.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (e) {} }); } }; },
    forma(p, caja) { const c = col(p.col, '#ffb000'); caja.style.background = p.col2 ? 'linear-gradient(' + num(p.ang, 135, 0, 360) + 'deg,' + c + ',' + col(p.col2, c) + ')' : c; if (p.f === 'elipse') caja.style.borderRadius = '50%'; return {}; },
    reloj(p, caja, ctx) { if (p.est === 'analogico') { const c = col(p.col, '#ffffff'); caja.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><circle cx="50" cy="50" r="46" fill="none" stroke="' + c + '" stroke-width="3"/>' + Array.from({ length: 12 }, (x, i) => '<line x1="50" y1="8" x2="50" y2="' + (i % 3 ? 12 : 16) + '" stroke="' + c + '" stroke-width="' + (i % 3 ? 1.6 : 3) + '" transform="rotate(' + i * 30 + ' 50 50)"/>').join('') +
        '<line class="h" x1="50" y1="52" x2="50" y2="26" stroke="' + c + '" stroke-width="4.5" stroke-linecap="round"/><line class="m" x1="50" y1="52" x2="50" y2="14" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>' + (p.sg ? '<line class="s" x1="50" y1="58" x2="50" y2="12" stroke="#ff4d4d" stroke-width="1.4" stroke-linecap="round"/>' : '') + '<circle cx="50" cy="50" r="3" fill="' + c + '"/></svg>';
        const g = s => caja.querySelector(s), tic = () => { const d = new Date(), s = d.getSeconds(), m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60; g('.h').setAttribute('transform', 'rotate(' + h * 30 + ' 50 50)'); g('.m').setAttribute('transform', 'rotate(' + m * 6 + ' 50 50)'); if (p.sg) g('.s').setAttribute('transform', 'rotate(' + s * 6 + ' 50 50)'); }; tic(); return { tic }; }
      const tx = el('div', 'tx'); letra(tx, p); caja.appendChild(tx); let ult = '';
      const tic = () => { const d = new Date(); let h = d.getHours(); const pm = h >= 12; if (p.h12) h = h % 12 || 12; const t = String(h).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + (p.sg ? ':' + String(d.getSeconds()).padStart(2, '0') : '') + (p.h12 ? (pm ? ' PM' : ' AM') : ''); if (t !== ult) { const lar = t.length !== ult.length; ult = t; tx.textContent = t; if (lar) encaja(caja, tx, false); } };
      tic(); return { tic, ajusta() { encaja(caja, tx, false); } }; },
    fecha(p, caja, ctx) { const tx = el('div', 'tx'); letra(tx, p); if (p.may !== false) tx.style.textTransform = 'uppercase'; caja.appendChild(tx); let ult = '';
      const L = ctx.lang === 'en' ? 'en-GB' : ctx.lang === 'ca' ? 'ca-ES' : 'es-ES', F = (o, d) => { try { return new Intl.DateTimeFormat(L, o).format(d); } catch (e) { return d.toLocaleDateString(); } };
      const tic = () => { const d = new Date(); const t = p.fmt === 'corta' ? F({ day: '2-digit', month: '2-digit', year: 'numeric' }, d) : p.fmt === 'dia' ? F({ weekday: 'long' }, d) : p.fmt === 'num' ? d.getDate() + '\n' + F({ month: 'short' }, d).replace('.', '') : p.fmt === 'mes' ? F({ month: 'long', year: 'numeric' }, d) : F({ weekday: 'long', day: 'numeric', month: 'long' }, d); if (t !== ult) { ult = t; tx.textContent = t; encaja(caja, tx, p.fmt === 'num' ? false : true); } };
      if (p.fmt !== 'num') tx.style.width = '100%'; tic(); return { tic, ajusta() { ult = ''; tic(); } }; },
    tiempo(p, caja, ctx, pz) { const w = el('div'); w.style.display = 'inline-flex'; w.style.alignItems = 'center'; w.style.gap = '.6em'; letra(w, p); caja.appendChild(w); let vivo = true, t = 0; if (p.dis === 'col') { pz.classList.add('col'); w.style.flexDirection = 'column'; w.style.gap = '.3em'; }
      const L = ctx.lang === 'en' ? 'en-GB' : ctx.lang === 'ca' ? 'ca-ES' : 'es-ES', pinta = d => { if (!vivo) return; const lugar = String(p.lugar || T(ctx).lugar).slice(0, 40); w.textContent = '';
        const a = el('div', 'ahora'), ic = el('div', 'ico'), g = el('div'), gr = el('div', 'gr'), lu = el('div', 'lug'), cr = el('div', 'cred'); ic.innerHTML = icono(d.c, d.d); gr.textContent = d.g + '°'; lu.textContent = lugar; cr.textContent = 'open-meteo.com'; g.appendChild(gr); g.appendChild(lu); g.appendChild(cr); a.appendChild(ic); a.appendChild(g); w.appendChild(a);
        if (p.dias !== false && d.dias && d.dias.length) { const ds = el('div', 'dias'); d.dias.forEach(x => { const c = el('div'), b = el('b'), i = el('div', 'ico'), s = el('span'); let n = ''; try { n = new Intl.DateTimeFormat(L, { weekday: 'short' }).format(new Date(x.f + 'T12:00:00')).replace('.', ''); } catch (e) {} b.textContent = n; i.innerHTML = icono(x.c, 1); s.textContent = x.a + '° ' + x.b + '°'; c.appendChild(b); c.appendChild(i); c.appendChild(s); ds.appendChild(c); }); w.appendChild(ds); }
        encaja(caja, w, false); };
      const muestra = { g: 21, c: 2, d: 1, dias: [{ f: '2026-01-05', c: 0, a: 23, b: 14 }, { f: '2026-01-06', c: 3, a: 20, b: 13 }, { f: '2026-01-07', c: 61, a: 18, b: 12 }] }; let ult = muestra; if (ctx.edita) { pinta(muestra); ej(caja, ctx, true); }   // los datos de ejemplo solo se ven al componer: en un display, nada hasta tener los de verdad
      const pide = () => { if (!ctx.red || !vivo) return; tiempo(num(p.lat, 41.39, -90, 90), num(p.lon, 2.17, -180, 180)).then(d => { if (d && vivo) { ult = d; pinta(d); ej(caja, ctx, false); } }); }; pide(); if (ctx.red && ctx.vivo) t = setInterval(pide, 1800000);
      return { ajusta() { encaja(caja, w, false); }, fin() { vivo = false; clearInterval(t); } }; },
    rss(p, caja, ctx, pz) { if (!ctx.edita && !String(p.url || '').trim()) { if (pz) pz.style.visibility = 'hidden'; return {}; }   // v1.23 · sin canal, en la pantalla no queda una banda negra vacía
      ej(caja, ctx, true); let vivo = true, t = 0, t2 = 0, tit = T(ctx).tit, i = 0; const modo = ['cinta', 'lista', 'uno'].includes(p.modo) ? p.modo : 'cinta'; letra(caja, p, 700); caja.style.padding = '0 ' + U(1.5);
      const pinta = () => { if (!vivo) return; clearInterval(t2); caja.textContent = '';
        if (modo === 'cinta') { const s = el('span', 'cinta'), x = tit.join('   •   '); s.textContent = x; caja.style.setProperty('--ct', Math.max(14, Math.round(x.length * .2 + 10)) + 's'); caja.appendChild(s); s.style.fontSize = Math.max(8, caja.clientHeight * .5) + 'px'; if (!ctx.vivo) { s.style.animation = 'none'; s.style.paddingLeft = '0'; } }
        else if (modo === 'lista') { const ul = el('ul'); tit.slice(0, num(p.n, 4, 1, 8)).forEach(x => { const li = el('li'); li.textContent = x; ul.appendChild(li); }); ul.style.fontSize = U(num(p.tam, 3, .8, 20)); caja.appendChild(ul); }
        else { const pon = () => { caja.textContent = ''; const d = el('div', 'uno'); d.textContent = tit[i % tit.length]; i++; d.style.fontSize = U(num(p.tam, 3, .8, 20)); caja.appendChild(d); }; pon(); if (ctx.vivo) t2 = setInterval(pon, 7000); } };
      pinta(); const pide = () => { const u = String(p.url || '').trim(); if (!u || !ctx.red || !vivo) return; noticias(u, ctx.base).then(d => { if (d && vivo && d.join('|') !== tit.join('|')) { tit = d; pinta(); ej(caja, ctx, false); } }); }; pide(); if (ctx.red && ctx.vivo) t = setInterval(pide, 600000);
      return { ajusta: modo === 'cinta' ? () => { const s = caja.querySelector('.cinta'); if (s) s.style.fontSize = Math.max(8, caja.clientHeight * .5) + 'px'; } : null, fin() { vivo = false; clearInterval(t); clearInterval(t2); } }; },
    qr(p, caja, ctx) { const u = String(p.url || '').trim(), bg = col(p.cfondo, '#ffffff'); if (!/^https?:\/\/\S+$/i.test(u) && !ctx.edita) return {};   // sin enlace, en un display no sale nada
      caja.style.background = bg; caja.style.padding = '6%'; ej(caja, ctx, !/^https?:\/\/\S+$/i.test(u));
      if (!window.qrcode) return {}; try { const g = window.qrcode(0, 'M'); g.addData(/^https?:\/\/\S+$/i.test(u) ? u : 'https://adposter.mediaservi.com/'); g.make(); caja.innerHTML = g.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); caja.querySelectorAll('[fill="black"],[fill="#000000"],path').forEach(e => { if (e.getAttribute('fill') !== 'white' && e.getAttribute('fill') !== '#ffffff') e.setAttribute('fill', col(p.col, '#000000')); }); caja.querySelectorAll('rect').forEach(e => e.setAttribute('fill', bg)); } catch (e) {}
      return {}; },
    web(p, caja, ctx) { const u = String(p.url || '').trim(); if (!ctx.vivo || !/^https:\/\/[^\s"'<>]+$/i.test(u)) { vacio(caja, T(ctx).web, u || T(ctx).sinu, ctx); return {}; } const f = el('iframe'); f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms'); f.setAttribute('referrerpolicy', 'no-referrer'); f.loading = 'eager'; f.src = u; caja.appendChild(f); return {}; },
    /* v1.23 · TURNOS: el número que se llama, el puesto y los anteriores. Parpadea al llamar (el sonido lo pone el reproductor) */
    turno(p, caja, ctx, pz) { const sb = cls => { const b = el('div', 'sb ' + cls), t = el('div', 'tx'); b.appendChild(t); caja.appendChild(b); return t; }, tc = sb('tu-t'), tn = sb('tu-n'), tp = sb('tu-p'), hs = el('div', 'tu-h'); caja.appendChild(hs);
      letra(caja, p, 800); tn.style.color = col(p.acento, '#ffb000'); const nh = num(p.nh, 3, 0, 6); caja.classList.add(nh ? 'con-h' : 'sin-h'); let ult = '', tF = 0;
      const pinta = () => { const d = VIVO.d.turno || (ctx.edita ? { n: 'A-042', p: 'CONSULTA 3', h: [{ n: 'A-041', p: 'CONSULTA 1' }, { n: 'A-040', p: 'CONSULTA 2' }, { n: 'A-039', p: 'CONSULTA 3' }], t: 0 } : null);
        tc.textContent = String(p.tit || T(ctx).turno).slice(0, 30); tn.textContent = d && d.n ? String(d.n).slice(0, 12) : '—'; ej(caja, ctx, !VIVO.d.turno); tp.textContent = d && d.p ? '→ ' + String(d.p).slice(0, 30) : '';
        hs.textContent = ''; (d && Array.isArray(d.h) ? d.h : []).slice(0, nh).forEach(x => { const r = el('div', 'tu-r'), a = el('b'), b = el('span'); a.textContent = String(x.n || '').slice(0, 12); b.textContent = String(x.p || '').slice(0, 30); r.appendChild(a); r.appendChild(b); hs.appendChild(r); });
        ajusta(); const k = d ? d.n + '|' + d.t : ''; if (ult && k !== ult && ctx.vivo) { pz.classList.remove('llama'); void pz.offsetWidth; pz.classList.add('llama'); clearTimeout(tF); tF = setTimeout(() => pz.classList.remove('llama'), 6500); } ult = k; };
      const ajusta = () => { [tc, tn, tp].forEach(t => encaja(t.parentNode, t, false)); hs.style.fontSize = Math.max(6, Math.min(hs.clientHeight / Math.max(3, nh) * .62, hs.clientWidth / 16)) + 'px'; };
      const quita = VIVO.oye(k => { if (k === 'turno') pinta(); }); pinta(); return { ajusta, fin() { quita(); clearTimeout(tF); } }; },
    /* v1.23 · PEDIDOS LISTOS: dos columnas, «preparando» y «listos»; los listos caducan solos */
    pedidos(p, caja, ctx, pz) { letra(caja, p, 800); const c1 = el('div', 'pe-c pe-p'), c2 = el('div', 'pe-c pe-l'); [c1, c2].forEach(c => { const h = el('div', 'pe-h'), b = el('div', 'pe-b'); c.appendChild(h); c.appendChild(b); caja.appendChild(c); }); let ult = '';
      const datos = () => { ej(caja, ctx, !VIVO.d.pedidos); return VIVO.d.pedidos || (ctx.edita ? { prep: ['105', '106', '107', '108'], listos: [['101', Date.now()], ['102', Date.now()], ['104', Date.now()]], cad: 10 } : { prep: [], listos: [] }); };
      const col = (c, L, nuevo) => { const b = c.lastChild, W = b.clientWidth, H = b.clientHeight, n = Math.max(1, L.length), nc = n <= 4 ? 1 : n <= 12 ? 2 : 3, nr = Math.ceil(n / nc), fs = Math.max(6, Math.min(W / nc / 3.3, H / nr * .62));
        b.textContent = ''; b.style.gridTemplateColumns = 'repeat(' + nc + ',1fr)'; b.style.fontSize = fs + 'px'; L.forEach(x => { const e = el('div', 'pe-n' + (nuevo && x === nuevo ? ' nuevo' : '')); e.textContent = String(x).slice(0, 5); b.appendChild(e); }); };
      const pinta = () => { const d = datos(), cad = num(d.cad, 10, 1, 120) * 60000, ahora = Date.now(), ls = (Array.isArray(d.listos) ? d.listos : []).filter(x => Array.isArray(x) && (ctx.edita || ahora - (+x[1] || 0) < cad)).map(x => String(x[0])), ps = (Array.isArray(d.prep) ? d.prep : []).map(String);
        c1.firstChild.textContent = T(ctx).prep; c2.firstChild.textContent = T(ctx).listos; [c1, c2].forEach(c => { c.firstChild.style.fontSize = Math.max(6, Math.min(c.clientWidth / 9, c.clientHeight * .07)) + 'px'; });
        const k = ls.join(','), nuevo = ult && ls[0] && ult.split(',').indexOf(ls[0]) < 0 ? ls[0] : ''; ult = k; col(c1, ps.slice(0, 24)); col(c2, ls.slice(0, 24), nuevo); };
      const quita = VIVO.oye(k => { if (k === 'pedidos') pinta(); }); pinta(); let n = 0; return { ajusta: pinta, tic() { if (++n % 15 === 0) pinta(); }, fin() { quita(); } }; },
    /* v1.23 · LISTA DE PRECIOS: filas escritas a mano («nombre;precio» por línea) o una hoja CSV publicada; se ajusta sola a la caja */
    precios(p, caja, ctx) { letra(caja, p, 700); const lis = el('div', 'pr'); caja.appendChild(lis); let filas = [], vivo = true, t = 0;
      const deTexto = () => { ej(caja, ctx, !p.filas && !(p.src === 'hoja' && p.url)); return String(p.filas || (ctx.edita ? T(ctx).precios : '')).split(/\r?\n/).map(l => l.split(/\s*[;|\t]\s*/)).filter(r => r[0] && r[0].trim()).map(r => [r[0].trim(), (r[1] || '').trim()]); };
      const deHoja = F => { const a = num(p.cn, 1, 1, 26) - 1, b = num(p.cp, 2, 1, 26) - 1; return F.slice(p.cab === false ? 0 : 1).map(r => [String(r[a] || '').trim(), String(r[b] || '').trim()]).filter(r => r[0]); };
      const pinta = () => { if (!vivo) return; lis.textContent = ''; const L = filas.slice(0, 40), nc = num(p.cols, 1, 1, 3); lis.style.gridTemplateColumns = 'repeat(' + nc + ',1fr)';
        if (!L.length) { vacio(caja, T(ctx).precios.split('\n')[0], T(ctx).sinh, ctx); return; } caja.querySelectorAll('.vacio').forEach(v => v.remove());
        L.forEach(([n, pr]) => { const r = el('div', 'pr-f'), a = el('span', 'pr-n'), d = el('i'), b = el('b', 'pr-p'); a.textContent = n.slice(0, 60); b.textContent = pr.slice(0, 16); b.style.color = col(p.acento, '#ffb000'); r.appendChild(a); r.appendChild(d); r.appendChild(b); lis.appendChild(r); }); ajusta(); };
      const ajusta = () => { const nr = Math.ceil(Math.min(40, filas.length || 1) / num(p.cols, 1, 1, 3)); let fs = Math.max(6, Math.min(lis.clientHeight / nr * .6, lis.clientWidth / 8)); lis.style.fontSize = fs + 'px';
        for (let i = 0; i < 10 && ([...lis.children].some(r => r.scrollWidth > r.clientWidth + 1) || lis.scrollHeight > lis.clientHeight + 1); i++) { fs *= .9; lis.style.fontSize = fs + 'px'; } };
      const pide = () => { const u = String(p.url || '').trim(); if (p.src !== 'hoja' || !u) return; if (!ctx.red) return; hoja(u, ctx.base, num(p.ref, 10, 1, 1440)).then(F => { if (F && vivo) { filas = deHoja(F); pinta(); } }); };
      filas = p.src === 'hoja' ? (ctx.edita && !p.url ? deTexto() : []) : deTexto(); pinta(); pide(); if (p.src === 'hoja' && ctx.vivo) t = setInterval(pide, num(p.ref, 10, 1, 1440) * 60000);
      return { ajusta, fin() { vivo = false; clearInterval(t); } }; }
  };
  const T = ctx => TXT[ctx.lang] || TXT.es;

  /* ---------- montar una escena ---------- */
  const GEO = ['x', 'y', 'w', 'h', 'r', 'o', 'oculta', 'bloq', 'n'];
  const firma = p => JSON.stringify(p, (k, v) => GEO.includes(k) ? undefined : v);
  function monta(cont, escena, ctx) {
    ctx = Object.assign({ vivo: true, red: true, edita: false, lang: 'es', url: s => s, man: null, entra: false, base: '' }, ctx || {});
    cont.classList.add('esc'); const vivas = new Map(); let muerto = false, tTic = 0, ro = null;
    const unidad = () => { const w = cont.clientWidth, h = cont.clientHeight; if (w && h) cont.style.setProperty('--u', Math.min(w, h) / 100 + 'px'); };
    function geo(v, p) { const s = v.el.style; s.left = num(p.x, 0, -200, 300) + '%'; s.top = num(p.y, 0, -200, 300) + '%'; s.width = num(p.w, 10, .2, 400) + '%'; s.height = num(p.h, 10, .2, 400) + '%'; s.transform = p.r ? 'rotate(' + num(p.r, 0, -360, 360) + 'deg)' : ''; s.opacity = p.o == null ? '' : num(p.o, 1, 0, 1); v.el.classList.toggle('oculta', !!p.oculta);
      const g = [p.w, p.h].join(); if (v.g !== g) { v.g = g; v.ctl.ajusta && v.ctl.ajusta(); } }
    function crea(p, i) { const pz = el('div', 'pz pz-' + p.t), caja = el('div', 'in'); pz.dataset.id = p.id; if (p.ir) pz.dataset.ir = String(p.ir);   // v1.23 · lista táctil: tocar la pieza lleva a otra escena if (p.an && ctx.entra) { pz.dataset.an = p.an; pz.style.setProperty('--ret', num(p.ret, 0, 0, 20) + 's'); }
      if (p.t !== 'forma' && p.t !== 'qr' && p.fondo) caja.style.background = col(p.fondo, 'transparent'); if (p.radio) caja.style.borderRadius = U(num(p.radio, 0, 0, 50)); if (p.borde) caja.style.border = U(num(p.borde, 0, 0, 10)) + ' solid ' + col(p.bcol, '#ffffff'); if (p.sombra) caja.style.boxShadow = '0 ' + U(.8) + ' ' + U(3) + ' rgba(0,0,0,.55)';
      pz.appendChild(caja); const v = { el: pz, f: firma(p), g: '', ctl: {} }; cont.appendChild(pz); geo(v, p); v.g = [p.w, p.h].join(); try { v.ctl = (HAZ[p.t] || (() => ({})))(p, caja, ctx, pz) || {}; } catch (e) { v.ctl = {}; } v.ctl.ajusta && v.ctl.ajusta(); return v; }
    function pon(e) { if (muerto) return; escena = e || {}; unidad(); fondo(cont, escena.fondo, ctx); const ps = Array.isArray(escena.piezas) ? escena.piezas.filter(p => p && TIPOS.includes(p.t) && p.id) : [], hay = new Set(ps.map(p => p.id));
      vivas.forEach((v, k) => { if (!hay.has(k)) { v.ctl.fin && v.ctl.fin(); v.el.remove(); vivas.delete(k); } });
      ps.forEach((p, i) => { let v = vivas.get(p.id); const f = firma(p); if (v && v.f !== f) { v.ctl.fin && v.ctl.fin(); v.el.remove(); v = null; } if (!v) { v = crea(p, i); vivas.set(p.id, v); } else geo(v, p); v.el.style.zIndex = i + 1; }); }
    const ajusta = () => { if (muerto) return; unidad(); vivas.forEach(v => v.ctl.ajusta && v.ctl.ajusta()); };
    pon(escena); if (ctx.entra) cont.classList.add('entra');
    if (ctx.vivo) tTic = setInterval(() => vivas.forEach(v => v.ctl.tic && v.ctl.tic()), 1000);
    if (window.ResizeObserver) { ro = new ResizeObserver(ajusta); ro.observe(cont); } if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajusta);
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', ajusta);
    return { pon, ajusta, el: id => (vivas.get(id) || {}).el || null, destruye() { muerto = true; clearInterval(tTic); ro && ro.disconnect(); if (document.fonts && document.fonts.removeEventListener) document.fonts.removeEventListener('loadingdone', ajusta); vivas.forEach(v => v.ctl.fin && v.ctl.fin()); vivas.clear(); cont.textContent = ''; cont.classList.remove('esc', 'entra'); cont.style.background = ''; } };
  }
  window.ADESCENA = { FUENTES, TIPOS, nueva, monta, id, col, csv, hoja };
})();
