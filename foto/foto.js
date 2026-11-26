/* ADPOSTER · FOTO, el editor de imagen (v1.17: núcleo de la tanda 1 y herramientas de la tanda 2) · GPL-3.0 · mediaservi.com
   · Abre una imagen (desde la biblioteca de ADPOSTER con ?src=…&n=…, soltándola, pegándola o eligiéndola).
   · Capas con visibilidad, opacidad y modo de fusión; añadir, duplicar, borrar, ordenar, combinar y acoplar.
   · Historial con deshacer y rehacer (las capas que no cambian se comparten entre pasos: ocupa poco).
   · Recortar con proporciones y enderezar; girar 90°, voltear y cambiar el tamaño.
   · Ajustes y filtros con vista previa en vivo; botones mágicos de un toque con su intensidad.
   · Exportar en JPG, PNG o WebP a la medida de cada pantalla y guardar una copia en «Mis imágenes» de ADPOSTER
     (el original no se toca nunca). Todo ocurre en el navegador: la imagen no sale del equipo. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s), PX = window.ADPX, VERSION = '1.34';
  const lee = k => { try { return JSON.parse(localStorage.getItem('adposter:' + k)); } catch (e) { return null; } }, guarda = (k, v) => { try { localStorage.setItem('adposter:' + k, JSON.stringify(v)); } catch (e) {} };
  const IDI = ['es', 'en', 'ca']; let lang = lee('lang') || (IDI.includes((navigator.language || '').slice(0, 2)) ? navigator.language.slice(0, 2) : 'es');
  /* textos: español de base y [inglés, catalán] */
  const TX = {
    'Capas': ['Layers', 'Capes'], 'Ajustes': ['Adjust', 'Ajustos'], 'Magia': ['Magic', 'Màgia'], 'Exportar': ['Export', 'Exportar'], 'Historial': ['History', 'Historial'],
    'Abrir': ['Open', 'Obre'], 'Deshacer': ['Undo', 'Desfés'], 'Rehacer': ['Redo', 'Refés'], 'Ajustar': ['Fit', 'Ajusta'], 'Mano': ['Hand', 'Mà'], 'Mover capa': ['Move layer', 'Mou la capa'], 'Recortar': ['Crop', 'Retalla'],
    'Girar a la izquierda': ['Rotate left', 'Gira a l’esquerra'], 'Girar a la derecha': ['Rotate right', 'Gira a la dreta'], 'Voltear en horizontal': ['Flip horizontal', 'Gira en horitzontal'], 'Voltear en vertical': ['Flip vertical', 'Gira en vertical'],
    'Suelta aquí una imagen': ['Drop an image here', 'Deixa anar aquí una imatge'], 'o pégala, o elígela:': ['or paste it, or choose it:', 'o enganxa-la, o tria-la:'], 'Elegir imagen': ['Choose image', 'Tria una imatge'],
    'Todo ocurre en tu navegador: la imagen no sale de tu equipo y el original no se toca.': ['Everything happens in your browser: the image never leaves your device and the original is never changed.', 'Tot passa al navegador: la imatge no surt del teu equip i l’original no es toca.'],
    'Capa nueva': ['New layer', 'Capa nova'], 'Imagen como capa': ['Image as layer', 'Imatge com a capa'], 'Duplicar': ['Duplicate', 'Duplica'], 'Borrar': ['Delete', 'Esborra'], 'Subir': ['Up', 'Puja'], 'Bajar': ['Down', 'Baixa'],
    'Combinar abajo': ['Merge down', 'Combina avall'], 'Acoplar todo': ['Flatten', 'Aplana-ho tot'], 'Opacidad': ['Opacity', 'Opacitat'], 'Modo': ['Blend', 'Mode'], 'Fondo': ['Background', 'Fons'], 'Capa': ['Layer', 'Capa'],
    'Brillo y contraste': ['Brightness & contrast', 'Brillantor i contrast'], 'Niveles': ['Levels', 'Nivells'], 'Curvas': ['Curves', 'Corbes'], 'Tono y saturación': ['Hue & saturation', 'To i saturació'], 'Equilibrio de color': ['Color balance', 'Equilibri de color'],
    'Blanco y negro': ['Black & white', 'Blanc i negre'], 'Desenfocar': ['Blur', 'Desenfoca'], 'Enfocar': ['Sharpen', 'Enfoca'], 'Ruido': ['Noise', 'Soroll'], 'Viñeta': ['Vignette', 'Vinyeta'], 'Filtros': ['Filters', 'Filtres'], 'Imagen': ['Image', 'Imatge'],
    'Brillo': ['Brightness', 'Brillantor'], 'Contraste': ['Contrast', 'Contrast'], 'Exposición': ['Exposure', 'Exposició'], 'Gamma': ['Gamma', 'Gamma'], 'Tono': ['Hue', 'To'], 'Saturación': ['Saturation', 'Saturació'], 'Luminosidad': ['Lightness', 'Lluminositat'], 'Vividez': ['Vibrance', 'Vivesa'],
    'Negro': ['Black', 'Negre'], 'Blanco': ['White', 'Blanc'], 'Medios': ['Midtones', 'Mitjos'], 'Salida negro': ['Output black', 'Sortida negre'], 'Salida blanco': ['Output white', 'Sortida blanc'], 'Canal': ['Channel', 'Canal'], 'Todos': ['All', 'Tots'],
    'Sombras': ['Shadows', 'Ombres'], 'Luces': ['Highlights', 'Llums'], 'Cian ↔ rojo': ['Cyan ↔ red', 'Cian ↔ vermell'], 'Magenta ↔ verde': ['Magenta ↔ green', 'Magenta ↔ verd'], 'Amarillo ↔ azul': ['Yellow ↔ blue', 'Groc ↔ blau'], 'Tonos': ['Tones', 'Tons'],
    'Rojos': ['Reds', 'Vermells'], 'Verdes': ['Greens', 'Verds'], 'Azules': ['Blues', 'Blaus'], 'Virado': ['Tint', 'Virat'], 'Radio': ['Radius', 'Radi'], 'Cantidad': ['Amount', 'Quantitat'], 'Umbral': ['Threshold', 'Llindar'], 'Tamaño': ['Size', 'Mida'], 'Suavidad': ['Softness', 'Suavitat'],
    'Monocromo': ['Monochrome', 'Monocrom'], 'Aplicar': ['Apply', 'Aplica'], 'Cancelar': ['Cancel', 'Cancel·la'], 'Intensidad': ['Strength', 'Intensitat'], 'Detalle': ['Detail', 'Detall'],
    'Mejora automática': ['Auto enhance', 'Millora automàtica'], 'Balance de blancos': ['White balance', 'Balanç de blancs'], 'Quitar neblina': ['Dehaze', 'Treu la boira'], 'Quitar ruido': ['Denoise', 'Treu el soroll'],
    'Un toque y listo: ajusta la intensidad si quieres y aplica.': ['One tap: adjust the strength if you like and apply.', 'Un toc i llest: ajusta la intensitat si vols i aplica.'],
    'Llegan en la próxima tanda: quitar el fondo, borrar un objeto, ampliar ×2 o ×4, reparar foto antigua y colorear.': ['Coming in the next batch: remove background, erase an object, upscale ×2 or ×4, restore old photo and colorize.', 'Arriben a la propera tanda: treure el fons, esborrar un objecte, ampliar ×2 o ×4, reparar foto antiga i acolorir.'],
    'Formato': ['Format', 'Format'], 'Calidad': ['Quality', 'Qualitat'], 'Medida': ['Size', 'Mida'], 'Original': ['Original', 'Original'], 'Encaje': ['Fit', 'Encaix'], 'Llenar (recorta)': ['Fill (crops)', 'Omple (retalla)'], 'Entera (con bandas)': ['Whole (letterbox)', 'Sencera (amb bandes)'],
    'Descargar': ['Download', 'Descarrega'], 'Guardar copia en ADPOSTER': ['Save copy to ADPOSTER', 'Desa una còpia a ADPOSTER'], 'Proporción': ['Ratio', 'Proporció'], 'Libre': ['Free', 'Lliure'], 'Enderezar': ['Straighten', 'Redreça'],
    'Tamaño de la imagen': ['Image size', 'Mida de la imatge'], 'Ancho': ['Width', 'Amplada'], 'Alto': ['Height', 'Alçada'], 'Cambiar tamaño': ['Resize', 'Canvia la mida'], 'Restablecer': ['Reset', 'Restableix'],
    'Procesando…': ['Processing…', 'Processant…'], 'Abierta': ['Opened', 'Oberta'], 'Guardada en Mis imágenes de ADPOSTER': ['Saved to My images in ADPOSTER', 'Desada a Les meves imatges d’ADPOSTER'],
    'Abre FOTO desde el gestor de ADPOSTER para guardar ahí: ahora se descarga': ['Open FOTO from the ADPOSTER manager to save there: downloading instead', 'Obre FOTO des del gestor d’ADPOSTER per desar-hi: ara es descarrega'],
    'No he podido abrir esa imagen.': ['I could not open that image.', 'No he pogut obrir aquesta imatge.'], 'Abrir imagen': ['Open image', 'Obre una imatge'], 'Nueva capa': ['New layer', 'Capa nova'], 'Recorte': ['Crop', 'Retall'], 'Girar': ['Rotate', 'Gira'], 'Voltear': ['Flip', 'Gira'],
    'Mover': ['Move', 'Mou'], 'Combinar': ['Merge', 'Combina'], 'Acoplar': ['Flatten', 'Aplana'], 'Cambio de capa': ['Layer change', 'Canvi de capa'], 'Pegada': ['Pasted', 'Enganxada'], 'el original no se toca': ['the original is untouched', 'l’original no es toca'],
    'Pantalla vertical FHD': ['Vertical FHD screen', 'Pantalla vertical FHD'], 'Pantalla horizontal FHD': ['Horizontal FHD screen', 'Pantalla horitzontal FHD'], 'Póster 2:3': ['2:3 poster', 'Pòster 2:3'], 'Cuadrada': ['Square', 'Quadrada'], 'Vertical 4K': ['Vertical 4K', 'Vertical 4K'], 'Horizontal 4K': ['Horizontal 4K', 'Horitzontal 4K'],
    'Transparente si el formato lo permite (PNG y WebP).': ['Transparent if the format allows it (PNG and WebP).', 'Transparent si el format ho permet (PNG i WebP).'], 'Sin imagen': ['No image', 'Sense imatge'], 'Hecho': ['Done', 'Fet'], 'Zoom': ['Zoom', 'Zoom'],
    'Fusión': ['Blend', 'Fusió'], 'Normal': ['Normal', 'Normal'], 'Multiplicar': ['Multiply', 'Multiplica'], 'Trama': ['Screen', 'Trama'], 'Superponer': ['Overlay', 'Superposa'], 'Luz suave': ['Soft light', 'Llum suau'], 'Luz fuerte': ['Hard light', 'Llum forta'],
    'Oscurecer': ['Darken', 'Enfosqueix'], 'Aclarar': ['Lighten', 'Aclareix'], 'Sobreexponer color': ['Color dodge', 'Sobreexposa el color'], 'Subexponer color': ['Color burn', 'Subexposa el color'], 'Diferencia': ['Difference', 'Diferència'], 'Exclusión': ['Exclusion', 'Exclusió'], 'Color': ['Color', 'Color'],
    'Opacidad del grupo': ['Group opacity', 'Opacitat del grup'], 'Fusión del grupo': ['Group blend', 'Fusió del grup'], 'Meter la de abajo': ['Add the one below', 'Fica-hi la de sota'], 'Agrupar con la de abajo': ['Group with the one below', 'Agrupa amb la de sota'],
    'Desagrupar': ['Ungroup', 'Desagrupa'], 'Grupo': ['Group', 'Grup'], 'Abrir el grupo': ['Expand group', 'Obre el grup'], 'Cerrar el grupo': ['Collapse group', 'Tanca el grup'], 'Agrupar': ['Group', 'Agrupa'], 'PSD (con capas)': ['PSD (with layers)', 'PSD (amb capes)'],
    'Con capas y grupos, a tamaño original.': ['With layers and groups, at original size.', 'Amb capes i grups, a mida original.']
  };
  const T = s => { const t = TX[s]; return !t || lang === 'es' ? s : t[lang === 'en' ? 0 : 1]; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };
  const ctx = c => c.getContext('2d', { willReadFrequently: true });
  const MODOS = [['source-over', 'Normal'], ['multiply', 'Multiplicar'], ['screen', 'Trama'], ['overlay', 'Superponer'], ['soft-light', 'Luz suave'], ['hard-light', 'Luz fuerte'], ['darken', 'Oscurecer'], ['lighten', 'Aclarar'], ['color-dodge', 'Sobreexponer color'], ['color-burn', 'Subexponer color'], ['difference', 'Diferencia'], ['exclusion', 'Exclusión'], ['hue', 'Tono'], ['saturation', 'Saturación'], ['color', 'Color'], ['luminosity', 'Luminosidad']];
  const TOPE = 8192;   // lado máximo que se edita (los navegadores no dan lienzos más grandes de forma fiable)
  /* v1.17 · las herramientas de la tanda 2 (herr.js) se enchufan aquí: EXT.herr[nombre] = { ic, n, tecla, down, move, up, panel, pinta } */
  const EXT = { herr: {}, orden: [], tmp: null, sel: null };   // tmp: { i, cv, m } vista previa de un trazo; sel: máscara de selección (lienzo con alfa)
  /* ---------- documento: capas e historial ---------- */
  let D = null, act = 0, nId = 1, H = [], hi = -1, nombre = 'imagen', herr = 'mano', tab = 'capas', ses = null, rec = null;
  const V = { z: 1, x: 0, y: 0 };   // zoom y desplazamiento de la vista (en píxeles de pantalla)
  const capa = (cv, n) => ({ id: nId++, n: n || T('Capa') + ' ' + nId, cv, vis: true, op: 1, modo: 'source-over' });
  const foto = () => ({ w: D.w, h: D.h, act, capas: D.capas.map(c => Object.assign({}, c)), gr: Object.assign({}, D.gr || {}) });   /* v1.18 · gr: los grupos de capas { id: { n, vis, op, modo, ab } } */
  function paso(etq) { H = H.slice(0, hi + 1); H.push({ etq, s: foto() }); hi = H.length - 1; let px = 0; const vistos = new Set(); for (let i = H.length - 1; i >= 0; i--) { H[i].s.capas.forEach(c => { if (!vistos.has(c.cv)) { vistos.add(c.cv); px += c.cv.width * c.cv.height; } }); if (px > 1.6e8 && i < H.length - 2) { H = H.slice(i + 1); hi = H.length - 1; break; } } pintaHist(); }
  function vuelve(i) { if (i < 0 || i >= H.length) return; hi = i; const s = H[i].s, otro = !D || D.w !== s.w || D.h !== s.h; D = { w: s.w, h: s.h, capas: s.capas.map(c => Object.assign({}, c)), gr: Object.assign({}, s.gr || {}) }; act = Math.min(s.act, D.capas.length - 1); cierraSes(); compone(); if (otro) encaja(); pinta(); pintaTab(); }   /* v1.18 · si cambia el tamaño (ampliar, recortar), la vista se vuelve a encajar */
  /* cada cambio deja la capa vieja intacta (la usa el historial) y trabaja sobre un lienzo nuevo */
  function cambiaCapa(i, cv, etq) { D.capas[i] = Object.assign({}, D.capas[i], { cv }); compone(); paso(etq); pinta(); pintaTab(); }
  function abreDoc(img, n) { const k = Math.min(1, TOPE / Math.max(img.width || img.naturalWidth, img.height || img.naturalHeight)), w = Math.round((img.width || img.naturalWidth) * k), h = Math.round((img.height || img.naturalHeight) * k), c = lienzo(w, h); c.getContext('2d').drawImage(img, 0, 0, w, h);
    nombre = (n || 'imagen').replace(/\.[a-z0-9]+$/i, ''); EXT.sel = null; EXT.tmp = null; D = { w, h, capas: [capa(c, T('Fondo'))], gr: {} }; act = 0; H = []; hi = -1; paso(T('Abrir imagen')); cierraSes(); encaja(); compone(); pinta(); pintaTab(); $('#fo-vacio').hidden = true; estado(T('Abierta') + ' · ' + nombre + ' · ' + w + '×' + h); }
  /* v1.18 · un documento ya montado (un PSD con sus capas y grupos) */
  function cargaDoc(d, n) { nombre = (n || 'imagen').replace(/\.[a-z0-9]+$/i, ''); EXT.sel = null; EXT.tmp = null; D = d; D.gr = D.gr || {}; act = D.capas.length - 1; H = []; hi = -1; paso(T('Abrir imagen')); cierraSes(); encaja(); compone(); pinta(); pintaTab(); $('#fo-vacio').hidden = true; estado(T('Abierta') + ' · ' + nombre + ' · ' + D.w + '×' + D.h); }
  /* ---------- composición y vista ---------- */
  let comp = null, vista = $('#fo-vista'), vx = vista.getContext('2d'), dam = null;
  function compone() { if (!D) return; if (!comp || comp.width !== D.w || comp.height !== D.h) comp = lienzo(D.w, D.h); const x = comp.getContext('2d'); x.clearRect(0, 0, D.w, D.h);
    const L = D.capas, G = D.gr || {}; let i = 0;   /* v1.18 · las capas seguidas de un mismo grupo se juntan antes y el grupo pone su visibilidad, opacidad y fusión */
    while (i < L.length) { const c = L[i], g = c.gr && G[c.gr]; if (!g) { if (c.vis) dibujaCapa(x, c, i); i++; continue; } let j = i; while (j < L.length && L[j].gr === c.gr) j++;
      if (g.vis) { if (!grL || grL.width !== D.w || grL.height !== D.h) grL = lienzo(D.w, D.h); const q = grL.getContext('2d'); q.globalAlpha = 1; q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, D.w, D.h); for (let k = i; k < j; k++) if (L[k].vis) dibujaCapa(q, L[k], k);
        q.globalAlpha = 1; q.globalCompositeOperation = 'source-over'; x.globalAlpha = g.op; x.globalCompositeOperation = g.modo || 'source-over'; x.drawImage(grL, 0, 0); } i = j; }
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; }
  let grL = null;
  let tmpM = null; function dibujaCapa(x, c, i) { const T2 = EXT.tmp && EXT.tmp.i === i ? EXT.tmp : null, src = T2 && T2.cv ? T2.cv : ses && ses.pv && i === act ? ses.pv : c.cv, m = T2 && T2.m ? T2.m : c.mask;
    x.globalAlpha = c.op; x.globalCompositeOperation = c.modo; if (!m) { x.drawImage(src, 0, 0, D.w, D.h); return; }
    if (!tmpM || tmpM.width !== D.w || tmpM.height !== D.h) tmpM = lienzo(D.w, D.h); const q = tmpM.getContext('2d'); q.globalCompositeOperation = 'copy'; q.drawImage(src, 0, 0, D.w, D.h); q.globalCompositeOperation = 'destination-in'; q.drawImage(m, 0, 0); q.globalCompositeOperation = 'source-over'; x.drawImage(tmpM, 0, 0); }
  function damero() { if (dam) return dam; dam = vx.createPattern((() => { const c = lienzo(16, 16), q = c.getContext('2d'); q.fillStyle = '#3a3a3e'; q.fillRect(0, 0, 16, 16); q.fillStyle = '#2a2a2d'; q.fillRect(0, 0, 8, 8); q.fillRect(8, 8, 8, 8); return c; })(), 'repeat'); return dam; }
  function tamVista() { const r = $('#fo-lienzo').getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1), w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr)); if (vista.width !== w || vista.height !== h) { vista.width = w; vista.height = h; } return { w: r.width, h: r.height, dpr }; }
  function encaja() { if (!D) return; const t = tamVista(), m = 24; V.z = Math.min((t.w - m * 2) / D.w, (t.h - m * 2) / D.h, 4); V.x = (t.w - D.w * V.z) / 2; V.y = (t.h - D.h * V.z) / 2; pinta(); }
  function pinta() { const t = tamVista(); vx.setTransform(1, 0, 0, 1, 0, 0); vx.clearRect(0, 0, vista.width, vista.height); if (!D || !comp) return; vx.setTransform(t.dpr, 0, 0, t.dpr, 0, 0);
    vx.save(); vx.translate(V.x, V.y); vx.fillStyle = damero(); vx.fillRect(0, 0, D.w * V.z, D.h * V.z); vx.restore(); vx.imageSmoothingEnabled = V.z < 2; vx.imageSmoothingQuality = 'high';
    const mv = herr === 'mover' && arr && arr.tipo === 'mover' ? arr : null; if (mv) { vx.drawImage(compSin(), V.x, V.y, D.w * V.z, D.h * V.z); const c = D.capas[act]; vx.globalAlpha = c.op; vx.globalCompositeOperation = c.modo; vx.drawImage(c.cv, V.x + mv.dx * V.z, V.y + mv.dy * V.z, D.w * V.z, D.h * V.z); vx.globalAlpha = 1; vx.globalCompositeOperation = 'source-over'; }
    else vx.drawImage(comp, V.x, V.y, D.w * V.z, D.h * V.z);
    vx.strokeStyle = 'rgba(0,0,0,.6)'; vx.lineWidth = 1; vx.strokeRect(V.x - .5, V.y - .5, D.w * V.z + 1, D.h * V.z + 1); EXT.orden.forEach(k => { const h = EXT.herr[k]; if (h.siempre || k === herr) { try { h.pinta && h.pinta(vx, V); } catch (e) { console.warn(e); } } }); pintaRec(); const zb = $('#fo-zoom'); if (zb) zb.textContent = Math.round(V.z * 100) + ' %'; }
  let compSinCache = null; function compSin() { if (compSinCache) return compSinCache; const c = lienzo(D.w, D.h), x = c.getContext('2d'); D.capas.forEach((k, i) => { if (!k.vis || i === act) return; dibujaCapa(x, k, i); }); return (compSinCache = c); }
  const aDoc = (cx, cy) => [(cx - V.x) / V.z, (cy - V.y) / V.z];
  function zoomEn(f, cx, cy) { const t = tamVista(); cx = cx == null ? t.w / 2 : cx; cy = cy == null ? t.h / 2 : cy; const [dx, dy] = aDoc(cx, cy); V.z = Math.min(32, Math.max(.02, V.z * f)); V.x = cx - dx * V.z; V.y = cy - dy * V.z; pinta(); }
  /* ---------- ratón, dedo y teclado sobre el lienzo ---------- */
  let arr = null; const lz = $('#fo-lienzo'), punteros = new Map();
  lz.addEventListener('pointerdown', e => { if (!D) return; lz.setPointerCapture(e.pointerId); punteros.set(e.pointerId, [e.clientX, e.clientY]); const r = lz.getBoundingClientRect(), cx = e.clientX - r.left, cy = e.clientY - r.top;
    if (punteros.size === 2) { const [a, b] = [...punteros.values()]; arr = { tipo: 'pinza', d0: Math.hypot(a[0] - b[0], a[1] - b[1]), z0: V.z, x0: V.x, y0: V.y, m: [(a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top] }; return; }
    if (EXT.herr[herr] && EXT.herr[herr].down && !(e.button === 1 || espacio)) { const [x, y] = aDoc(cx, cy); arr = { tipo: 'ext', h: EXT.herr[herr] }; arr.h.down(x, y, e); return; }
    if (herr === 'mano' || e.button === 1 || espacio) { arr = { tipo: 'mano', x: e.clientX, y: e.clientY, vx: V.x, vy: V.y }; lz.classList.add('arrastra'); }
    else if (herr === 'mover') { compSinCache = null; arr = { tipo: 'mover', x: e.clientX, y: e.clientY, dx: 0, dy: 0 }; }
    else if (herr === 'recortar' && rec) { const [x, y] = aDoc(cx, cy), h = asa(cx, cy); arr = { tipo: 'rec', h, x0: x, y0: y, r0: Object.assign({}, rec) }; if (!h && !(x > rec.x && x < rec.x + rec.w && y > rec.y && y < rec.y + rec.h)) { arr.h = 'nuevo'; rec.x = x; rec.y = y; rec.w = 1; rec.h = 1; arr.r0 = Object.assign({}, rec); } } });
  lz.addEventListener('pointermove', e => { if (EXT.herr[herr] && EXT.herr[herr].hover && D) { const r = lz.getBoundingClientRect(), [x, y] = aDoc(e.clientX - r.left, e.clientY - r.top); EXT.herr[herr].hover(x, y); }
    if (!punteros.has(e.pointerId)) return; punteros.set(e.pointerId, [e.clientX, e.clientY]); if (!arr) return; const r = lz.getBoundingClientRect();
    if (arr.tipo === 'pinza' && punteros.size >= 2) { const [a, b] = [...punteros.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), k = Math.min(32, Math.max(.02, arr.z0 * d / Math.max(1, arr.d0))), m = [(a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top]; V.x = m[0] - (arr.m[0] - arr.x0) * k / arr.z0; V.y = m[1] - (arr.m[1] - arr.y0) * k / arr.z0; V.z = k; pinta(); }
    else if (arr.tipo === 'ext') { const [x, y] = aDoc(e.clientX - r.left, e.clientY - r.top); arr.h.move && arr.h.move(x, y, e); }
    else if (arr.tipo === 'mano') { V.x = arr.vx + e.clientX - arr.x; V.y = arr.vy + e.clientY - arr.y; pinta(); }
    else if (arr.tipo === 'mover') { arr.dx = Math.round((e.clientX - arr.x) / V.z); arr.dy = Math.round((e.clientY - arr.y) / V.z); pinta(); }
    else if (arr.tipo === 'rec') { const [x, y] = aDoc(e.clientX - r.left, e.clientY - r.top); mueveRec(arr, x, y); pinta(); } });
  const suelta = e => { punteros.delete(e.pointerId); if (!arr) return; const a = arr; if (punteros.size && a.tipo === 'pinza') return; arr = null; lz.classList.remove('arrastra');
    if (a.tipo === 'ext') { const r = lz.getBoundingClientRect(), [x, y] = aDoc(e.clientX - r.left, e.clientY - r.top); a.h.up && a.h.up(x, y, e); return; }
    if (a.tipo === 'mover' && (a.dx || a.dy)) { const c = D.capas[act], n = lienzo(D.w, D.h); n.getContext('2d').drawImage(c.cv, a.dx, a.dy); compSinCache = null; cambiaCapa(act, n, T('Mover')); } else pinta(); };
  lz.addEventListener('pointerup', suelta); lz.addEventListener('pointercancel', suelta);
  lz.addEventListener('wheel', e => { if (!D) return; e.preventDefault(); const r = lz.getBoundingClientRect(); if (e.ctrlKey || e.metaKey || !e.deltaX) zoomEn(Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0018)), e.clientX - r.left, e.clientY - r.top); else { V.x -= e.deltaX; V.y -= e.deltaY; pinta(); } }, { passive: false });
  let espacio = false;
  addEventListener('keydown', e => { const enCampo = /INPUT|SELECT|TEXTAREA/.test((document.activeElement || {}).tagName || ''); if (e.code === 'Space' && !enCampo) { espacio = true; lz.classList.add('mano'); e.preventDefault(); }
    if (enCampo) return; const m = e.ctrlKey || e.metaKey;
    if (D && EXT.tecla && EXT.tecla(e)) { e.preventDefault(); return; }
    if (D && !m && !e.altKey && e.key.length === 1) { const k = e.key.toLowerCase(), t = { h: 'mano', v: 'mover', c: 'recortar' }[k] || EXT.orden.find(n => EXT.herr[n].tecla === k); if (t) { ponHerr(t); return; } }
    if (m && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? rehaz() : deshaz(); } else if (m && e.key.toLowerCase() === 'y') { e.preventDefault(); rehaz(); }
    else if (m && (e.key === '0')) { e.preventDefault(); encaja(); } else if (m && (e.key === '+' || e.key === '=')) { e.preventDefault(); zoomEn(1.25); } else if (m && e.key === '-') { e.preventDefault(); zoomEn(.8); }
    else if (e.key === 'Enter' && (ses || rec)) { e.preventDefault(); ses ? aplicaSes() : aplicaRec(); } else if (e.key === 'Escape' && (ses || rec)) { e.preventDefault(); cierraSes(); quitaRec(); pintaTab(); } });
  addEventListener('keyup', e => { if (e.code === 'Space') { espacio = false; lz.classList.toggle('mano', herr === 'mano'); } });
  addEventListener('resize', () => { if (D) pinta(); });
  const deshaz = () => { if (hi > 0) vuelve(hi - 1); }, rehaz = () => { if (hi < H.length - 1) vuelve(hi + 1); };
  function ponHerr(v) { const ant = EXT.herr[herr]; if (ant && ant.sale) ant.sale(); herr = v; cierraSes(); if (v === 'recortar' && D) abreRec(); else quitaRec(); const nu = EXT.herr[v]; if (nu && nu.entra) nu.entra(); pintaTab(); pinta(); }
  /* ---------- recortar y enderezar ---------- */
  const PROP = [['libre', 'Libre', 0], ['orig', 'Original', -1], ['916', '9:16', 9 / 16], ['169', '16:9', 16 / 9], ['23', '2:3', 2 / 3], ['32', '3:2', 3 / 2], ['11', '1:1', 1], ['45', '4:5', 4 / 5]];
  function abreRec() { rec = { x: 0, y: 0, w: D.w, h: D.h, p: 'libre', ang: 0 }; pinta(); }
  function quitaRec() { rec = null; $('#fo-capa').innerHTML = ''; }
  const proporcion = () => { const p = PROP.find(q => q[0] === rec.p); return !p || !p[2] ? 0 : p[2] < 0 ? D.w / D.h : p[2]; };
  function fijaProp(k) { rec.p = k; const pr = proporcion(); if (pr) { let w = D.w, h = w / pr; if (h > D.h) { h = D.h; w = h * pr; } rec.w = w; rec.h = h; rec.x = (D.w - w) / 2; rec.y = (D.h - h) / 2; } pinta(); }
  function asa(cx, cy) { if (!rec) return null; const P = puntosRec(); for (const k in P) if (Math.hypot(P[k][0] - cx, P[k][1] - cy) < 16) return k; return null; }
  function puntosRec() { const x0 = V.x + rec.x * V.z, y0 = V.y + rec.y * V.z, x1 = x0 + rec.w * V.z, y1 = y0 + rec.h * V.z; return { nw: [x0, y0], ne: [x1, y0], sw: [x0, y1], se: [x1, y1], n: [(x0 + x1) / 2, y0], s: [(x0 + x1) / 2, y1], w: [x0, (y0 + y1) / 2], e: [x1, (y0 + y1) / 2] }; }
  function mueveRec(a, x, y) { const r0 = a.r0, pr = proporcion(), dx = x - a.x0, dy = y - a.y0, h = a.h; let { x: X, y: Y, w: W, h: Hh } = r0;
    if (!h) { X = Math.min(D.w - W, Math.max(0, r0.x + dx)); Y = Math.min(D.h - Hh, Math.max(0, r0.y + dy)); }
    else if (h === 'nuevo') { X = Math.min(r0.x, x); Y = Math.min(r0.y, y); W = Math.abs(x - r0.x); Hh = pr ? W / pr : Math.abs(y - r0.y); if (pr && y < r0.y) Y = r0.y - Hh; }
    else { if (h.includes('w')) { X = Math.min(r0.x + r0.w - 8, r0.x + dx); W = r0.x + r0.w - X; } if (h.includes('e')) W = Math.max(8, r0.w + dx); if (h.includes('n')) { Y = Math.min(r0.y + r0.h - 8, r0.y + dy); Hh = r0.y + r0.h - Y; } if (h.includes('s')) Hh = Math.max(8, r0.h + dy);
      if (pr) { if (h === 'n' || h === 's') W = Hh * pr; else Hh = W / pr; if (h.includes('n')) Y = r0.y + r0.h - Hh; if (h.includes('w')) X = r0.x + r0.w - W; } }
    X = Math.max(0, X); Y = Math.max(0, Y); W = Math.min(D.w - X, Math.max(1, W)); Hh = Math.min(D.h - Y, Math.max(1, Hh)); if (pr) { if (W / Hh > pr) W = Hh * pr; else Hh = W / pr; } Object.assign(rec, { x: X, y: Y, w: W, h: Hh }); }
  function pintaRec() { const L = $('#fo-capa'); if (!rec || herr !== 'recortar') { if (L.firstChild) L.innerHTML = ''; return; } const P = puntosRec(); L.innerHTML = '<div class="rec" style="left:' + P.nw[0] + 'px;top:' + P.nw[1] + 'px;width:' + (P.se[0] - P.nw[0]) + 'px;height:' + (P.se[1] - P.nw[1]) + 'px"><span class="ter"></span>' + ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'].map(k => '<i style="left:' + (P[k][0] - P.nw[0]) + 'px;top:' + (P[k][1] - P.nw[1]) + 'px"></i>').join('') + '</div>'; }
  function aplicaRec() { if (!rec) return; const a = (rec.ang || 0) * Math.PI / 180, x = Math.round(rec.x), y = Math.round(rec.y), w = Math.max(1, Math.round(rec.w)), h = Math.max(1, Math.round(rec.h));
    D = { w, h, capas: D.capas.map(c => { const n = lienzo(w, h), q = n.getContext('2d'); q.imageSmoothingQuality = 'high'; q.translate(-x, -y); if (a) { q.translate(D.w / 2, D.h / 2); q.rotate(a); q.scale(escAng(a), escAng(a)); q.translate(-D.w / 2, -D.h / 2); } q.drawImage(c.cv, 0, 0); return Object.assign({}, c, { cv: n }); }) };
    quitaRec(); compone(); paso(T('Recorte')); herr = 'mano'; pintaHerr(); encaja(); pintaTab(); }
  /* al enderezar, se amplía lo justo para que no asomen esquinas vacías */
  const escAng = a => { const c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a)), W = D.w, Hh = D.h; return Math.max((W * c + Hh * s) / W, (W * s + Hh * c) / Hh); };
  function giraDoc(sentido) { const w = D.h, h = D.w; D = { w, h, capas: D.capas.map(c => { const n = lienzo(w, h), q = n.getContext('2d'); q.translate(w / 2, h / 2); q.rotate(sentido * Math.PI / 2); q.drawImage(c.cv, -c.cv.width / 2, -c.cv.height / 2); return Object.assign({}, c, { cv: n }); }) }; compone(); paso(T('Girar')); encaja(); pintaTab(); }
  function volteaDoc(hz) { D = { w: D.w, h: D.h, capas: D.capas.map(c => { const n = lienzo(D.w, D.h), q = n.getContext('2d'); q.translate(hz ? D.w : 0, hz ? 0 : D.h); q.scale(hz ? -1 : 1, hz ? 1 : -1); q.drawImage(c.cv, 0, 0); return Object.assign({}, c, { cv: n }); }) }; compone(); paso(T('Voltear')); pinta(); pintaTab(); }
  function tamDoc(w, h) { w = Math.max(1, Math.min(TOPE, Math.round(w))); h = Math.max(1, Math.min(TOPE, Math.round(h))); D = { w, h, capas: D.capas.map(c => Object.assign({}, c, { cv: PX.escala(c.cv, w, h) })) }; compone(); paso(T('Cambiar tamaño')); encaja(); pintaTab(); }
  /* ---------- ajustes, filtros y magia: sesión con vista previa ---------- */
  const OPS = {
    bc: { n: 'Brillo y contraste', f: PX.bc, p: [['brillo', 'Brillo', -100, 100, 0], ['contraste', 'Contraste', -100, 100, 0], ['exposicion', 'Exposición', -3, 3, 0, .05], ['gamma', 'Gamma', .2, 3, 1, .01]] },
    niveles: { n: 'Niveles', f: PX.niveles, p: [['canal', 'Canal', [['', 'Todos'], ['r', 'Rojos'], ['g', 'Verdes'], ['b', 'Azules']], ''], ['inN', 'Negro', 0, 254, 0], ['inB', 'Blanco', 1, 255, 255], ['gamma', 'Medios', .1, 4, 1, .01], ['outN', 'Salida negro', 0, 255, 0], ['outB', 'Salida blanco', 0, 255, 255]] },
    curvas: { n: 'Curvas', f: (im, p) => PX.curvas(im, { rgb: [[0, p.n0], [64, 64 + p.s], [128, 128 + p.m], [192, 192 + p.l], [255, p.b0]] }), p: [['n0', 'Negro', 0, 128, 0], ['s', 'Sombras', -64, 64, 0], ['m', 'Medios', -64, 64, 0], ['l', 'Luces', -64, 63, 0], ['b0', 'Blanco', 128, 255, 255]] },
    hsl: { n: 'Tono y saturación', f: PX.hsl, p: [['tono', 'Tono', -180, 180, 0], ['saturacion', 'Saturación', -100, 100, 0], ['luminosidad', 'Luminosidad', -100, 100, 0], ['vividez', 'Vividez', -100, 100, 0]] },
    equilibrio: { n: 'Equilibrio de color', f: (im, p) => { const z = [p.cr, p.mg, p.ab]; return PX.equilibrio(im, { [p.zona]: z }); }, p: [['zona', 'Tonos', [['m', 'Medios'], ['s', 'Sombras'], ['l', 'Luces']], 'm'], ['cr', 'Cian ↔ rojo', -100, 100, 0], ['mg', 'Magenta ↔ verde', -100, 100, 0], ['ab', 'Amarillo ↔ azul', -100, 100, 0]] },
    bn: { n: 'Blanco y negro', f: PX.bn, p: [['r', 'Rojos', -50, 150, 40], ['g', 'Verdes', -50, 150, 40], ['b', 'Azules', -50, 150, 20], ['virado', 'Virado', 0, 100, 0]] },
    desenfoca: { n: 'Desenfocar', f: PX.desenfoca, p: [['radio', 'Radio', 1, 80, 6]], esc: ['radio'] },
    enfoca: { n: 'Enfocar', f: PX.enfoca, p: [['cantidad', 'Cantidad', 0, 300, 80], ['radio', 'Radio', .5, 8, 1.2, .1], ['umbral', 'Umbral', 0, 40, 0]], esc: ['radio'] },
    ruido: { n: 'Ruido', f: PX.ruido, p: [['cantidad', 'Cantidad', 0, 100, 12], ['mono', 'Monocromo', [[1, 'Monocromo'], [0, 'Color']], 1]] },
    vineta: { n: 'Viñeta', f: PX.vineta, p: [['cantidad', 'Cantidad', -100, 100, 50], ['tamano', 'Tamaño', 0, 100, 50], ['suavidad', 'Suavidad', 0, 100, 60]] },
    auto: { n: 'Mejora automática', ic: '✨', f: PX.automatica, p: [['fuerza', 'Intensidad', 0, 100, 70]] },
    vividez: { n: 'Vividez', ic: '🌈', f: (im, p) => PX.hsl(im, { vividez: p.fuerza * .7 }), p: [['fuerza', 'Intensidad', 0, 100, 55]] },
    blancos: { n: 'Balance de blancos', ic: '⚪', f: PX.blancos, p: [['fuerza', 'Intensidad', 0, 100, 85]] },
    neblina: { n: 'Quitar neblina', ic: '🌫️', f: PX.neblina, p: [['fuerza', 'Intensidad', 0, 100, 60]] },
    limpia: { n: 'Quitar ruido', ic: '🧼', f: PX.limpia, p: [['fuerza', 'Intensidad', 0, 100, 55], ['detalle', 'Detalle', 0, 100, 25]] },
    magenfoca: { n: 'Enfocar', ic: '🔍', f: (im, p) => PX.enfoca(im, { cantidad: p.fuerza * 1.6, radio: 1 + Math.min(im.width, im.height) / 1800 }), p: [['fuerza', 'Intensidad', 0, 100, 50]] }
  };
  const PREV = 1400;   // lado de la vista previa (rápida); al aplicar se calcula a tamaño completo
  function abreSes(k) { if (!D) return; cierraSes(); quitaRec(); const o = OPS[k], c = D.capas[act].cv, kk = Math.min(1, PREV / Math.max(c.width, c.height)), pc = kk < 1 ? PX.escala(c, Math.round(c.width * kk), Math.round(c.height * kk)) : c;
    ses = { k, o, p: Object.fromEntries(o.p.map(q => [q[0], q[q.length === 4 ? 3 : 4]])), src: ctx(pc).getImageData(0, 0, pc.width, pc.height), kk, pv: null }; previa(); pintaTab(); }
    /* mezcla el resultado con el original según la selección (con su borde suave) */
  function conSel(orig, res) { if (!EXT.sel) return res; const w = res.width, h = res.height, m = lienzo(w, h), q = ctx(m); q.drawImage(EXT.sel, 0, 0, w, h); const a = q.getImageData(0, 0, w, h).data, o = orig.data, d = res.data;
    for (let i = 0; i < d.length; i += 4) { const k = a[i + 3] / 255; if (k >= 1) continue; d[i] = o[i] + (d[i] - o[i]) * k; d[i + 1] = o[i + 1] + (d[i + 1] - o[i + 1]) * k; d[i + 2] = o[i + 2] + (d[i + 2] - o[i + 2]) * k; d[i + 3] = o[i + 3] + (d[i + 3] - o[i + 3]) * k; } return res; }
  let prT = 0; function previa() { clearTimeout(prT); prT = setTimeout(() => { if (!ses) return; const p = escalaP(ses.p, ses.kk), im = conSel(ses.src, ses.o.f(ses.src, p)), c = lienzo(im.width, im.height); c.getContext('2d').putImageData(im, 0, 0); ses.pv = c; compone(); pinta(); }, 40); }
  const escalaP = (p, k) => { const q = Object.assign({}, p); ((ses && ses.o.esc) || []).forEach(n => { q[n] = p[n] * k; }); if ('mono' in q) q.mono = !!+q.mono; return q; };
  function cierraSes() { if (!ses) return; ses = null; compone(); pinta(); }
  function aplicaSes() { if (!ses) return; const s = ses; espera(true); setTimeout(() => { try { const c = D.capas[act].cv, im0 = ctx(c).getImageData(0, 0, c.width, c.height), im = conSel(im0, s.o.f(im0, s.p.mono != null ? Object.assign({}, s.p, { mono: !!+s.p.mono }) : s.p)), n = lienzo(im.width, im.height); n.getContext('2d').putImageData(im, 0, 0); ses = null; cambiaCapa(act, n, T(s.o.n)); estado(T(s.o.n) + ' · ' + T('Hecho')); } catch (e) { console.warn(e); estado(String(e.message || e)); } espera(false); }, 30); }
  /* ---------- capas ---------- */
  function nuevaCapa(cv, n) { const c = capa(cv || lienzo(D.w, D.h), n || T('Capa') + ' ' + (D.capas.length + 1)); D.capas.splice(act + 1, 0, c); act++; compone(); paso(T('Nueva capa')); pinta(); pintaTab(); }
  function capaImagen(img, n) { const c = lienzo(D.w, D.h), k = Math.min(1, D.w / img.width, D.h / img.height), w = img.width * k, h = img.height * k; c.getContext('2d').drawImage(img, (D.w - w) / 2, (D.h - h) / 2, w, h); nuevaCapa(c, (n || T('Imagen')).replace(/\.[a-z0-9]+$/i, '')); }
  function cambiaProp(i, k, v, etq) { D.capas[i] = Object.assign({}, D.capas[i], { [k]: v }); compone(); pinta(); clearTimeout(cambiaProp.t); cambiaProp.t = setTimeout(() => { paso(etq || T('Cambio de capa')); pintaCapas(); }, 350); }
  function combina(i) { if (i <= 0) return; const a = D.capas[i - 1], b = D.capas[i], n = lienzo(D.w, D.h), q = n.getContext('2d'); if (a.vis) { q.globalAlpha = a.op; q.drawImage(a.cv, 0, 0); } if (b.vis) { q.globalAlpha = b.op; q.globalCompositeOperation = b.modo; q.drawImage(b.cv, 0, 0); }
    D.capas.splice(i - 1, 2, Object.assign({}, a, { cv: n, op: 1, vis: true })); act = i - 1; compone(); paso(T('Combinar')); pinta(); pintaTab(); }
  function acopla() { compone(); const n = lienzo(D.w, D.h); n.getContext('2d').drawImage(comp, 0, 0); D.capas = [capa(n, T('Fondo'))]; D.gr = {}; act = 0; compone(); paso(T('Acoplar')); pinta(); pintaTab(); }
  /* ---------- exportar y guardar copia ---------- */
  const MEDIDAS = [['orig', 'Original', 0, 0], ['v', 'Pantalla vertical FHD', 1080, 1920], ['h', 'Pantalla horizontal FHD', 1920, 1080], ['p', 'Póster 2:3', 1080, 1620], ['c', 'Cuadrada', 1080, 1080], ['v4', 'Vertical 4K', 2160, 3840], ['h4', 'Horizontal 4K', 3840, 2160]];
  const EX = Object.assign({ f: 'image/webp', q: 90, m: 'orig', enc: 'cubre' }, lee('foto-ex') || {});
  function salida() { compone(); const m = MEDIDAS.find(q => q[0] === EX.m) || MEDIDAS[0]; if (!m[2]) { const c = lienzo(D.w, D.h); c.getContext('2d').drawImage(comp, 0, 0); return c; }
    const c = lienzo(m[2], m[3]), q = c.getContext('2d'), k = EX.enc === 'cubre' ? Math.max(m[2] / D.w, m[3] / D.h) : Math.min(m[2] / D.w, m[3] / D.h), w = Math.round(D.w * k), h = Math.round(D.h * k); if (EX.f === 'image/jpeg' && EX.enc !== 'cubre') { q.fillStyle = '#000'; q.fillRect(0, 0, c.width, c.height); }
    q.drawImage(PX.escala(comp, w, h), Math.round((m[2] - w) / 2), Math.round((m[3] - h) / 2)); return c; }
  const ext = f => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', psd: 'psd' }[f || EX.f]);
  function blob(fmt) { if ((fmt || EX.f) === 'psd') return EXT.psdBlob ? EXT.psdBlob() : Promise.resolve(null); const F0 = EX.f; EX.f = fmt || EX.f; const P = blob0(); EX.f = F0; return P; }
  function blob0() { return new Promise(res => { const c = salida(); if (EX.f === 'image/jpeg') { const f = lienzo(c.width, c.height), q = f.getContext('2d'); q.fillStyle = '#fff'; q.fillRect(0, 0, f.width, f.height); q.drawImage(c, 0, 0); f.toBlob(res, EX.f, EX.q / 100); } else c.toBlob(res, EX.f, EX.q / 100); }); }
  const nomSalida = f => nombre + '-editada.' + ext(f);   // nunca el nombre del original: lo editado va al lado como copia
  async function descarga() { if (!D) return; espera(true); const b = await blob(); espera(false); if (!b) return; const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nomSalida(); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); estado(T('Descargar') + ' · ' + nomSalida()); }
  async function guardaCopia() { if (!D) return; const fm = EX.f === 'psd' ? 'image/webp' : EX.f; espera(true); const b = await blob(fm); espera(false); if (!b) return; const f = new File([b], nomSalida(fm), { type: fm }); let ok = false;   /* en ADPOSTER se guarda como imagen (el PSD, solo al descargar) */
    try { if (window.opener && !window.opener.closed && window.opener.ADGEST) { const k = await window.opener.ADGEST.sube(f); ok = !!k; } } catch (e) {}
    if (!ok) { try { const bc = new BroadcastChannel('adposter-foto'); const r = await new Promise(res => { const t = setTimeout(() => res(null), 1500); bc.onmessage = e => { if (e.data && e.data.t === 'ok') { clearTimeout(t); res(e.data.k); } }; bc.postMessage({ t: 'guarda', archivo: f, de: new URLSearchParams(location.search).get('de') || '' }); }); bc.close(); ok = !!r; } catch (e) {} }
    if (ok) estado(T('Guardada en Mis imágenes de ADPOSTER')); else { estado(T('Abre FOTO desde el gestor de ADPOSTER para guardar ahí: ahora se descarga')); descarga(); } }
  /* ---------- abrir ---------- */
  function abreArchivo(f, comoCapa) { if (f && (/\.psd$/i.test(f.name || '') || f.type === 'image/vnd.adobe.photoshop') && EXT.psdAbre) { EXT.psdAbre(f, comoCapa && !!D); return; }   /* v1.18 · los PSD, con sus capas */
    if (!f || !/^image\//.test(f.type)) return; const u = URL.createObjectURL(f), i = new Image(); i.onload = () => { comoCapa && D ? capaImagen(i, f.name) : abreDoc(i, f.name); URL.revokeObjectURL(u); }; i.onerror = () => estado(T('No he podido abrir esa imagen.')); i.src = u; }
  function abreUrl(u, n) { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => abreDoc(i, n || decodeURIComponent(u.split('/').pop().split('?')[0])); i.onerror = () => { estado(T('No he podido abrir esa imagen.')); vacio(); }; i.src = u; }
  $('#fo-abre').addEventListener('change', e => { abreArchivo(e.target.files && e.target.files[0]); e.target.value = ''; });
  $('#fo-capa-img').addEventListener('change', e => { abreArchivo(e.target.files && e.target.files[0], true); e.target.value = ''; });
  lz.addEventListener('dragover', e => { e.preventDefault(); lz.classList.add('sobre'); }); lz.addEventListener('dragleave', () => lz.classList.remove('sobre'));
  lz.addEventListener('drop', e => { e.preventDefault(); lz.classList.remove('sobre'); const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; abreArchivo(f, !!D && e.shiftKey); });
  addEventListener('paste', e => { const it = [...((e.clipboardData || {}).items || [])].find(x => /^image\//.test(x.type)); if (!it) return; const f = it.getAsFile(); if (f) { abreArchivo(f, !!D); estado(T('Pegada')); } });
  /* ---------- interfaz ---------- */
  function estado(t) { const s = $('#fo-estado span'); if (s) s.textContent = t || ''; }
  function espera(on) { let e = $('#fo-espera'); if (!e) { e = document.createElement('div'); e.id = 'fo-espera'; e.className = 'fo-espera'; lz.appendChild(e); } e.textContent = T('Procesando…'); e.hidden = !on; }
  const tecla = (a, txt, x) => '<button type="button" class="tecla' + (x && x.cls ? ' ' + x.cls : '') + '" data-a="' + a + '"' + (x && x.v != null ? ' data-v="' + esc(x.v) + '"' : '') + (x && x.dis ? ' disabled' : '') + (x && x.t ? ' title="' + esc(x.t) + '" aria-label="' + esc(x.t) + '"' : '') + '>' + txt + '</button>';
  function pintaHerr() { const H2 = [['mano', '✋', 'Mano'], ['mover', '✥', 'Mover capa'], ['recortar', '⛶', 'Recortar']].concat(EXT.orden.filter(k => EXT.herr[k].ic).map(k => [k, EXT.herr[k].ic, EXT.herr[k].n]));
    $('#fo-herr').innerHTML = H2.map(h => tecla('herr', h[1], { v: h[0], t: T(h[2]) + (EXT.herr[h[0]] && EXT.herr[h[0]].tecla ? ' (' + EXT.herr[h[0]].tecla.toUpperCase() + ')' : ''), cls: herr === h[0] ? 'on' : '' })).join('') + '<hr>' + tecla('gira', '↺', { v: -1, t: T('Girar a la izquierda'), dis: !D }) + tecla('gira', '↻', { v: 1, t: T('Girar a la derecha'), dis: !D }) + tecla('voltea', '⇋', { v: 1, t: T('Voltear en horizontal'), dis: !D }) + tecla('voltea', '⇵', { v: 0, t: T('Voltear en vertical'), dis: !D });
    lz.classList.toggle('mano', herr === 'mano'); lz.classList.toggle('mover', herr === 'mover'); lz.classList.toggle('recorta', herr === 'recortar'); lz.classList.toggle('pinta', !!(EXT.herr[herr] && EXT.herr[herr].cursor)); }
  function pintaBarra() { $('#fo-barra').innerHTML = '<div class="fila">' + tecla('abre', '📂 ' + T('Abrir')) + tecla('deshaz', '↶', { t: T('Deshacer'), dis: hi <= 0 }) + tecla('rehaz', '↷', { t: T('Rehacer'), dis: hi >= H.length - 1 }) + '</div><div class="fila" style="justify-content:flex-end">' + tecla('zoom', '−', { v: .8, t: T('Zoom') + ' −' }) + '<span class="tecla zoom" id="fo-zoom">' + Math.round(V.z * 100) + ' %</span>' + tecla('zoom', '+', { v: 1.25, t: T('Zoom') + ' +' }) + tecla('encaja', T('Ajustar')) + '</div>'; }
  const TABS = [['capas', 'Capas'], ['ajustes', 'Ajustes'], ['magia', 'Magia'], ['exportar', 'Exportar'], ['hist', 'Historial']];
  function pintaTab() { pintaBarra(); pintaHerr(); $('#fo-tabs').innerHTML = TABS.map(t => '<button type="button" class="tab' + (tab === t[0] ? ' on' : '') + '" role="tab" aria-selected="' + (tab === t[0]) + '" data-a="tab" data-v="' + t[0] + '">' + T(t[1]) + '</button>').join('');
    const C = $('#fo-cuerpo'); if (!D) { C.innerHTML = '<div class="fo-sec"><p class="fo-nota">' + T('Todo ocurre en tu navegador: la imagen no sale de tu equipo y el original no se toca.') + '</p></div>'; return; }
    if (herr === 'recortar' && rec) { C.innerHTML = panelRec(); return; }
    const ex = EXT.herr[herr] && EXT.herr[herr].panel && !ses ? EXT.herr[herr].panel() : '';   /* las opciones de la herramienta arriba y la pestaña elegida debajo */
    if (ses) { C.innerHTML = panelSes(); return; }
    C.innerHTML = ex + (tab === 'capas' ? panelCapas() : tab === 'ajustes' ? panelAjustes() : tab === 'magia' ? panelMagia() : tab === 'exportar' ? panelExp() : panelHist()); if (tab === 'capas') miniaturas(); }
  const desl = (id, et, mn, mx, v, st) => '<div class="desl"><label for="' + id + '">' + T(et) + '</label><input type="range" id="' + id + '" min="' + mn + '" max="' + mx + '" step="' + (st || 1) + '" value="' + v + '"><output for="' + id + '">' + (+v).toFixed(st && st < 1 ? (st < .1 ? 2 : 1) : 0) + '</output></div>';
  const selec = (id, et, ops, v) => '<div class="desl"><label for="' + id + '">' + T(et) + '</label><select class="fo-sel" id="' + id + '" style="grid-column:2/-1">' + ops.map(o => '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(v) ? ' selected' : '') + '>' + esc(T(o[1])) + '</option>').join('') + '</select></div>';
  function panelSes() { const o = ses.o; return '<div class="fo-sec"><h3>' + esc((o.ic ? o.ic + ' ' : '') + T(o.n)) + '</h3>' + o.p.map(q => Array.isArray(q[2]) ? selec('ps-' + q[0], q[1], q[2], ses.p[q[0]]) : desl('ps-' + q[0], q[1], q[2], q[3], ses.p[q[0]], q[5])).join('') +
    '<div class="fo-acc">' + tecla('ses-cancela', T('Cancelar')) + tecla('ses-aplica', T('Aplicar'), { cls: 'pri' }) + '</div>' + tecla('ses-reset', T('Restablecer'), { cls: 'reset' }) + '</div>'; }
  function panelRec() { return '<div class="fo-sec"><h3>' + T('Recortar') + '</h3>' + selec('rc-p', 'Proporción', PROP.map(p => [p[0], p[1]]), rec.p) + desl('rc-a', 'Enderezar', -45, 45, rec.ang || 0, .5) + '<div class="fo-acc">' + tecla('rec-cancela', T('Cancelar')) + tecla('rec-aplica', T('Aplicar'), { cls: 'pri' }) + '</div></div>'; }
  function panelCapas() { const L = D.capas.map((c, i) => ({ c, i })).reverse(); return '<div class="fo-sec fo-sec-capas"><h3>' + T('Capas') + '<span>' + D.w + '×' + D.h + '</span></h3><div class="fo-capas">' + L.map(({ c, i }, n) => { const G = D.gr || {}, g = c.gr && G[c.gr], cab = g && (n === 0 || L[n - 1].c.gr !== c.gr) ? filaGrupo(c.gr, g) : ''; if (g && g.ab === false && i !== act) return cab;
      return cab + '<div class="fo-cp' + (i === act ? ' on' : '') + (g ? ' en-gr' : '') + '" data-a="capa" data-v="' + i + '">' + tecla('ojo', c.vis ? '👁' : '◌', { v: i, cls: 'ojo' + (c.vis ? '' : ' off'), t: c.n }) + '<canvas data-mini="' + i + '" width="92" height="68"></canvas><span class="nom">' + esc(c.n) + '<small>' + Math.round(c.op * 100) + ' % · ' + esc(T((MODOS.find(m => m[0] === c.modo) || MODOS[0])[1])) + '</small></span></div>'; }).join('') + '</div>' +
    desl('cp-op', 'Opacidad', 0, 100, Math.round(D.capas[act].op * 100)) + selec('cp-modo', 'Fusión', MODOS, D.capas[act].modo) +
    (grAct() ? desl('gr-op', 'Opacidad del grupo', 0, 100, Math.round(grAct().op * 100)) + selec('gr-modo', 'Fusión del grupo', MODOS, grAct().modo || 'source-over') : '') +
    '<div class="fo-rej">' + tecla('cp-nueva', '＋ ' + T('Capa nueva')) + tecla('cp-img', '🖼 ' + T('Imagen como capa')) + tecla('cp-dup', '⧉ ' + T('Duplicar')) + tecla('cp-borra', '🗑 ' + T('Borrar'), { dis: D.capas.length < 2 }) + tecla('cp-sube', '▲ ' + T('Subir'), { dis: act >= D.capas.length - 1 }) + tecla('cp-baja', '▼ ' + T('Bajar'), { dis: act <= 0 }) + tecla('cp-comb', '⤓ ' + T('Combinar abajo'), { dis: act <= 0 }) + tecla('cp-acopla', '▤ ' + T('Acoplar todo'), { dis: D.capas.length < 2 }) + tecla('cp-agrupa', '📁 ' + T(grAct() ? 'Meter la de abajo' : 'Agrupar con la de abajo'), { dis: act <= 0 || !!(grAct() && D.capas[act - 1].gr === D.capas[act].gr) }) + tecla('cp-desagrupa', '📂 ' + T('Desagrupar'), { dis: !grAct() }) + '</div>' + (EXT.capasExtra ? EXT.capasExtra() : '') + '</div>'; }
  /* v1.18 · grupos de capas: la cabecera (ojo, abrir o cerrar, nombre) y las acciones */
  const grAct = () => { const c = D && D.capas[act]; return c && c.gr && D.gr && D.gr[c.gr] ? D.gr[c.gr] : null; };
  function filaGrupo(id, g) { return '<div class="fo-gr" data-a="gr-sel" data-v="' + id + '">' + tecla('gr-ojo', g.vis ? '👁' : '◌', { v: id, cls: 'ojo' + (g.vis ? '' : ' off'), t: g.n }) + tecla('gr-ab', g.ab === false ? '▸' : '▾', { v: id, cls: 'ojo', t: T(g.ab === false ? 'Abrir el grupo' : 'Cerrar el grupo') }) + '<span class="nom">📁 ' + esc(g.n) + '<small>' + Math.round(g.op * 100) + ' % · ' + esc(T((MODOS.find(m => m[0] === (g.modo || 'source-over')) || MODOS[0])[1])) + '</small></span></div>'; }
  function cambiaGr(id, o, etq, ya) { D.gr = Object.assign({}, D.gr, { [id]: Object.assign({}, D.gr[id], o) }); compone(); pinta(); if (ya) { paso(etq); pintaCapas(); return; } clearTimeout(cambiaGr.t); cambiaGr.t = setTimeout(() => { paso(etq); pintaCapas(); }, 350); }
  function agrupa() { if (act <= 0) return; const c = D.capas[act], b = D.capas[act - 1]; D.gr = Object.assign({}, D.gr || {}); let id = c.gr && D.gr[c.gr] ? c.gr : b.gr && D.gr[b.gr] ? b.gr : 0;
    if (!id) { id = 'g' + nId++; D.gr[id] = { n: T('Grupo') + ' ' + (Object.keys(D.gr).length + 1), vis: true, op: 1, modo: 'source-over', ab: true }; } D.capas[act] = Object.assign({}, c, { gr: id }); D.capas[act - 1] = Object.assign({}, b, { gr: id }); compone(); paso(T('Agrupar')); pinta(); pintaTab(); }
  function desagrupa() { const c = D.capas[act]; if (!c || !c.gr) return; const id = c.gr; D.capas = D.capas.map(q => q.gr === id ? Object.assign({}, q, { gr: null }) : q); D.gr = Object.assign({}, D.gr); delete D.gr[id]; compone(); paso(T('Desagrupar')); pinta(); pintaTab(); }
  function miniaturas() { document.querySelectorAll('canvas[data-mini]').forEach(m => { const c = D.capas[+m.dataset.mini].cv, q = m.getContext('2d'), k = Math.min(m.width / c.width, m.height / c.height); q.clearRect(0, 0, m.width, m.height); q.drawImage(c, (m.width - c.width * k) / 2, (m.height - c.height * k) / 2, c.width * k, c.height * k); }); }
  function pintaCapas() { if (tab !== 'capas' || ses || rec) return; const C = $('#fo-cuerpo'); if (EXT.herr[herr] && EXT.herr[herr].panel) { const s = C.querySelector('.fo-sec-capas'); if (s) { s.outerHTML = panelCapas(); miniaturas(); } return; } C.innerHTML = panelCapas(); miniaturas(); }
  function panelAjustes() { return '<div class="fo-sec"><h3>' + T('Ajustes') + '</h3><div class="fo-rej">' + ['bc', 'niveles', 'curvas', 'hsl', 'equilibrio', 'bn'].map(k => tecla('ses', T(OPS[k].n), { v: k })).join('') + '</div></div>' +
    '<div class="fo-sec"><h3>' + T('Filtros') + '</h3><div class="fo-rej">' + ['desenfoca', 'enfoca', 'ruido', 'vineta'].map(k => tecla('ses', T(OPS[k].n), { v: k })).join('') + '</div></div>' +
    '<div class="fo-sec"><h3>' + T('Tamaño de la imagen') + '</h3><div class="fo-acc"><label class="desl" style="grid-template-columns:auto 1fr"><span>' + T('Ancho') + '</span><input class="campo" id="tm-w" type="number" min="1" max="' + TOPE + '" value="' + D.w + '"></label><label class="desl" style="grid-template-columns:auto 1fr"><span>' + T('Alto') + '</span><input class="campo" id="tm-h" type="number" min="1" max="' + TOPE + '" value="' + D.h + '"></label></div>' + tecla('tam', T('Cambiar tamaño')) + '</div>'; }
  function panelMagia() { return '<div class="fo-sec fo-magia"><h3>' + T('Magia') + '</h3><p class="fo-nota">' + T('Un toque y listo: ajusta la intensidad si quieres y aplica.') + '</p><div class="fo-rej">' + ['auto', 'vividez', 'blancos', 'neblina', 'limpia', 'magenfoca'].map(k => tecla('ses', '<span>' + OPS[k].ic + '</span> ' + T(OPS[k].n), { v: k })).join('') + '</div></div>' + (EXT.magiaExtra ? EXT.magiaExtra() : ''); }
  function panelExp() { return '<div class="fo-sec"><h3>' + T('Exportar') + '</h3>' + selec('ex-f', 'Formato', [['image/webp', 'WebP'], ['image/jpeg', 'JPG'], ['image/png', 'PNG']].concat(EXT.psdBlob ? [['psd', T('PSD (con capas)')]] : []), EX.f) + (EX.f === 'psd' ? '<p class="fo-nota">' + T('Con capas y grupos, a tamaño original.') + '</p>' : (EX.f === 'image/png' ? '' : desl('ex-q', 'Calidad', 40, 100, EX.q)) + selec('ex-m', 'Medida', MEDIDAS.map(m => [m[0], T(m[1]) + (m[2] ? ' · ' + m[2] + '×' + m[3] : ' · ' + D.w + '×' + D.h)]), EX.m) + (EX.m === 'orig' ? '' : selec('ex-enc', 'Encaje', [['cubre', 'Llenar (recorta)'], ['entera', 'Entera (con bandas)']], EX.enc))) +
    '<p class="fo-nota">' + (EX.f === 'psd' ? '' : T('Transparente si el formato lo permite (PNG y WebP).') + ' ') + esc(nomSalida()) + ' · ' + T('el original no se toca') + '</p><div class="fo-acc">' + tecla('ex-baja', '⭳ ' + T('Descargar')) + tecla('ex-guarda', '💾 ' + T('Guardar copia en ADPOSTER'), { cls: 'pri' }) + '</div></div>'; }
  function panelHist() { return '<div class="fo-sec"><h3>' + T('Historial') + '<span>' + (hi + 1) + '/' + H.length + '</span></h3><div class="fo-hist">' + H.map((h, i) => tecla('hist', esc(h.etq), { v: i, cls: i === hi ? 'act' : i > hi ? 'fut' : '' })).join('') + '</div></div>'; }
  function pintaHist() { if (tab === 'hist' && !ses && !rec && D) $('#fo-cuerpo').innerHTML = panelHist(); pintaBarra(); }
  function vacio() { const v = $('#fo-vacio'); v.hidden = !!D; if (!D) v.innerHTML = '<div><b>' + T('Suelta aquí una imagen') + '</b><span>' + T('o pégala, o elígela:') + '</span>' + tecla('abre', '📂 ' + T('Elegir imagen'), { cls: 'pri' }) + '<span class="fo-nota">' + T('Todo ocurre en tu navegador: la imagen no sale de tu equipo y el original no se toca.') + '</span></div>'; }
  function pintaFijo() { document.documentElement.lang = lang; const bi = $('#fo-idioma .cod'); if (bi) bi.textContent = lang.toUpperCase(); $('#pie-c').innerHTML = window.AVCREDITO ? window.AVCREDITO.html('ADPOSTER', 'v' + VERSION, lang) : 'ADPOSTER v' + VERSION + ' ' + new Date().getFullYear() + ' · mediaservi.com'; }
  /* clics y cambios */
  document.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b || b.disabled) return; const a = b.dataset.a, v = b.dataset.v;
    if (a === 'tab') { tab = v; cierraSes(); pintaTab(); }
    else if (a === 'abre') $('#fo-abre').click();
    else if (a === 'deshaz') deshaz(); else if (a === 'rehaz') rehaz(); else if (a === 'encaja') encaja(); else if (a === 'zoom') zoomEn(+v);
    else if (a === 'herr') { ponHerr(v); return; }
    else if (a === 'herr-viejo') { herr = v; cierraSes(); if (v === 'recortar' && D) abreRec(); else quitaRec(); pintaTab(); pinta(); }
    else if (a === 'gira' && D) giraDoc(+v); else if (a === 'voltea' && D) volteaDoc(v === '1');
    else if (a === 'ses') abreSes(v); else if (a === 'ses-cancela') { cierraSes(); pintaTab(); } else if (a === 'ses-aplica') aplicaSes();
    else if (a === 'ses-reset' && ses) { ses.p = Object.fromEntries(ses.o.p.map(q => [q[0], q[q.length === 4 ? 3 : 4]])); previa(); pintaTab(); }
    else if (a === 'rec-cancela') { quitaRec(); herr = 'mano'; pintaTab(); pinta(); } else if (a === 'rec-aplica') aplicaRec();
    else if (a === 'capa') { if (e.target.closest('[data-a="ojo"]')) return; act = +v; pintaCapas(); }
    else if (a === 'ojo') { const i = +v; cambiaProp(i, 'vis', !D.capas[i].vis); pintaCapas(); }
    else if (a === 'cp-nueva') nuevaCapa(); else if (a === 'cp-img') $('#fo-capa-img').click();
    else if (a === 'cp-dup') { const c = D.capas[act], n = lienzo(D.w, D.h); n.getContext('2d').drawImage(c.cv, 0, 0); const d = Object.assign({}, c, { id: nId++, cv: n, n: c.n + ' 2' }); D.capas.splice(act + 1, 0, d); act++; compone(); paso(T('Duplicar')); pinta(); pintaTab(); }
    else if (a === 'cp-borra' && D.capas.length > 1) { D.capas.splice(act, 1); act = Math.max(0, act - 1); compone(); paso(T('Borrar')); pinta(); pintaTab(); }
    else if (a === 'cp-sube' || a === 'cp-baja') { const j = act + (a === 'cp-sube' ? 1 : -1); if (j < 0 || j >= D.capas.length) return; const t = D.capas[act]; D.capas[act] = D.capas[j]; D.capas[j] = t; act = j; compone(); paso(T(a === 'cp-sube' ? 'Subir' : 'Bajar')); pinta(); pintaTab(); }
    else if (a === 'cp-comb') combina(act); else if (a === 'cp-acopla') acopla();
    else if (a === 'cp-agrupa') agrupa(); else if (a === 'cp-desagrupa') desagrupa();
    else if (a === 'gr-ojo') cambiaGr(v, { vis: !D.gr[v].vis }, T('Grupo'), true); else if (a === 'gr-ab') { D.gr = Object.assign({}, D.gr, { [v]: Object.assign({}, D.gr[v], { ab: D.gr[v].ab === false }) }); pintaCapas(); }
    else if (a === 'gr-sel') { if (e.target.closest('[data-a="gr-ojo"],[data-a="gr-ab"]')) return; const j = D.capas.map(q => q.gr).lastIndexOf(v); if (j >= 0) { act = j; pintaTab(); } }
    else if (a === 'tam') tamDoc(+$('#tm-w').value || D.w, +$('#tm-h').value || D.h);
    else if (a === 'ex-baja') descarga(); else if (a === 'ex-guarda') guardaCopia();
    else if (a === 'hist') vuelve(+v); });
  document.addEventListener('input', e => { const t = e.target, id = t.id || ''; const out = t.parentNode && t.parentNode.querySelector('output'); if (out && t.type === 'range') out.textContent = (+t.value).toFixed(+t.step < 1 ? (+t.step < .1 ? 2 : 1) : 0);
    if (id.indexOf('ps-') === 0 && ses) { const k = id.slice(3), q = ses.o.p.find(p => p[0] === k); ses.p[k] = Array.isArray(q[2]) ? t.value : +t.value; previa(); }
    else if (id === 'cp-op') cambiaProp(act, 'op', +t.value / 100, T('Opacidad'));
    else if (id === 'gr-op' && grAct()) cambiaGr(D.capas[act].gr, { op: +t.value / 100 }, T('Opacidad del grupo'));
    else if (id === 'rc-a' && rec) { rec.ang = +t.value; recRot(); }
    else if (id === 'ex-q') { EX.q = +t.value; guarda('foto-ex', EX); }
    else if (id === 'tm-w' && D && document.activeElement === t) { $('#tm-h').value = Math.round(+t.value * D.h / D.w) || ''; } else if (id === 'tm-h' && D && document.activeElement === t) { $('#tm-w').value = Math.round(+t.value * D.w / D.h) || ''; } });
  document.addEventListener('change', e => { const t = e.target, id = t.id || '';
    if (id === 'cp-modo') { cambiaProp(act, 'modo', t.value, T('Fusión')); pintaCapas(); }
    else if (id === 'gr-modo' && grAct()) cambiaGr(D.capas[act].gr, { modo: t.value }, T('Fusión del grupo'), true);
    else if (id === 'rc-p' && rec) fijaProp(t.value);
    else if (id === 'ex-f' || id === 'ex-m' || id === 'ex-enc') { EX[id.slice(3)] = t.value; guarda('foto-ex', EX); pintaTab(); } });
  /* la vista previa del enderezado: la imagen girada debajo del marco de recorte */
  function recRot() { if (!rec) return; const a = rec.ang * Math.PI / 180, k = escAng(a); compone(); const c = lienzo(D.w, D.h), q = c.getContext('2d'); q.translate(D.w / 2, D.h / 2); q.rotate(a); q.scale(k, k); q.translate(-D.w / 2, -D.h / 2); q.drawImage(comp, 0, 0); comp = c; pinta(); }
  $('#fo-idioma').addEventListener('click', () => { lang = IDI[(IDI.indexOf(lang) + 1) % IDI.length]; guarda('lang', lang); pintaFijo(); pintaTab(); vacio(); });
  if (window.AVCREDITO && window.AVCREDITO.alCambiar) window.AVCREDITO.alCambiar(pintaFijo);
  /* la seta roja de fallos, como en el resto de ADPOSTER */
  try { if (window.AVFALLO) { const fb = window.AVFALLO.boton({ app: 'ADPOSTER FOTO', version: 'v' + VERSION, idioma: () => lang }); if (fb) $('.cab .der').prepend(fb); } } catch (e) {}
  pintaFijo(); pintaTab(); vacio();
  /* abrir lo que llega en la dirección: ?src=… (de la biblioteca de ADPOSTER) y ?n=nombre */
  { const q = new URLSearchParams(location.search), s = q.get('src'), mk = q.get('m'); if (mk) { try { const d = window.opener && window.opener.ADG && window.opener.ADG.B.medios[mk]; if (d) abreUrl(d, q.get('n') || 'imagen'); } catch (e) {} } else if (s) { try { const u = new URL(s, location.href); if (u.origin === location.origin || /^(data|blob|https):$/.test(u.protocol)) abreUrl(u.href, q.get('n')); } catch (e) {} } }
  window.ADFOTO_ = { EXT, T, TX, esc, tecla, desl, selec, lienzo, ctx, $, PX, pinta, compone, paso, cambiaCapa, nuevaCapa, pintaTab, pintaCapas, estado, espera, aDoc, capa, guarda, lee, get D() { return D; }, set D(v) { D = v; }, get act() { return act; }, set act(v) { act = v; }, get herr() { return herr; }, get V() { return V; }, get lang() { return lang; }, pon: ponHerr, cargaDoc, encaja, MODOS, get nombre() { return nombre; }, get comp() { compone(); return comp; }, get nId() { return nId++; } };
  window.ADFOTO = { get doc() { return D; }, get act() { return act; }, abreDoc, abreSes, aplicaSes, deshaz, rehaz, get hist() { return H.length; }, salida, VERSION };
})();
