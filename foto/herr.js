/* ADPOSTER · FOTO · herramientas (v1.17, tanda 2) · GPL-3.0 · mediaservi.com
   Selecciones (rectángulo, elipse, lazo, varita y por color) con borde suave, que limitan ajustes, filtros, magia y pinceles;
   máscaras de capa; pincel, borrador, tampón de clonar y pincel corrector; texto con las fuentes de la marca; formas; degradados;
   y transformar la capa (mover, escalar y girar). Se enchufa en foto.js a través de window.ADFOTO_. */
(function () {
  'use strict';
  const F = window.ADFOTO_; if (!F) return;
  const { EXT, T, TX, lienzo, ctx, $, esc, tecla, desl, selec, PX } = F;
  Object.assign(TX, {
    'Selección': ['Selection', 'Selecció'], 'Selección rectangular o elíptica': ['Rectangle or ellipse selection', 'Selecció rectangular o el·líptica'], 'Lazo': ['Lasso', 'Llaç'], 'Varita mágica': ['Magic wand', 'Vareta màgica'],
    'Pincel': ['Brush', 'Pinzell'], 'Borrador': ['Eraser', 'Esborrador'], 'Tampón de clonar': ['Clone stamp', 'Tampó de clonar'], 'Pincel corrector': ['Healing brush', 'Pinzell corrector'], 'Texto': ['Text', 'Text'], 'Formas': ['Shapes', 'Formes'],
    'Degradado': ['Gradient', 'Degradat'], 'Transformar': ['Transform', 'Transforma'], 'Forma': ['Shape', 'Forma'], 'Rectángulo': ['Rectangle', 'Rectangle'], 'Elipse': ['Ellipse', 'El·lipse'], 'Redondeado': ['Rounded', 'Arrodonit'], 'Línea': ['Line', 'Línia'], 'Flecha': ['Arrow', 'Fletxa'],
    'Nueva': ['New', 'Nova'], 'Añadir': ['Add', 'Afegeix'], 'Restar': ['Subtract', 'Resta'], 'Cruzar': ['Intersect', 'Creua'], 'Tolerancia': ['Tolerance', 'Tolerància'], 'Contigua': ['Contiguous', 'Contigua'], 'En toda la imagen (por color)': ['Whole image (by color)', 'A tota la imatge (per color)'],
    'Borde suave': ['Feather', 'Vora suau'], 'Todo': ['All', 'Tot'], 'Nada': ['None', 'Res'], 'Invertir': ['Invert', 'Inverteix'], 'Rellenar': ['Fill', 'Omple'], 'Vaciar': ['Clear', 'Buida'], 'A capa nueva': ['To new layer', 'A capa nova'],
    'Tamaño del pincel': ['Brush size', 'Mida del pinzell'], 'Dureza': ['Hardness', 'Duresa'], 'Color 2': ['Color 2', 'Color 2'], 'Alt + clic (o toque largo) para tomar el origen.': ['Alt + click (or long press) to set the source.', 'Alt + clic (o toc llarg) per triar l’origen.'],
    'Origen tomado': ['Source set', 'Origen agafat'], 'Primero toma el origen.': ['Set the source first.', 'Primer tria l’origen.'], 'Pintar en la máscara': ['Paint on the mask', 'Pinta a la màscara'], 'Máscara': ['Mask', 'Màscara'], 'Añadir máscara': ['Add mask', 'Afegeix màscara'],
    'Aplicar máscara': ['Apply mask', 'Aplica la màscara'], 'Quitar máscara': ['Remove mask', 'Treu la màscara'], 'Pinta en blanco para mostrar y en negro para ocultar.': ['Paint white to reveal and black to hide.', 'Pinta en blanc per mostrar i en negre per amagar.'],
    'Fuente': ['Font', 'Font'], 'Alineación': ['Alignment', 'Alineació'], 'Izquierda': ['Left', 'Esquerra'], 'Centro': ['Center', 'Centre'], 'Derecha': ['Right', 'Dreta'], 'Contorno': ['Outline', 'Contorn'], 'Sombra': ['Shadow', 'Ombra'], 'Interlineado': ['Line height', 'Interlineat'],
    'Toca la imagen para escribir; arrastra el texto para moverlo.': ['Tap the image to type; drag the text to move it.', 'Toca la imatge per escriure; arrossega el text per moure’l.'], 'Escribe aquí': ['Type here', 'Escriu aquí'],
    'Relleno': ['Fill', 'Farciment'], 'Borde': ['Stroke', 'Vora'], 'Grosor': ['Width', 'Gruix'], 'Esquinas': ['Corners', 'Cantonades'], 'Arrastra sobre la imagen para dibujarla.': ['Drag on the image to draw it.', 'Arrossega sobre la imatge per dibuixar-la.'],
    'Tipo': ['Type', 'Tipus'], 'Lineal': ['Linear', 'Lineal'], 'Radial': ['Radial', 'Radial'], 'Hasta': ['To', 'Fins a'], 'Color 2 a transparente': ['To transparent', 'A transparent'], 'Arrastra para trazar el degradado.': ['Drag to draw the gradient.', 'Arrossega per traçar el degradat.'],
    'Arrastra para mover; las esquinas escalan (Mayús: libre) y el tirador de arriba gira.': ['Drag to move; corners scale (Shift: free) and the top handle rotates.', 'Arrossega per moure; les cantonades escalen (Maj.: lliure) i el tirador de dalt gira.'],
    'Escala': ['Scale', 'Escala'], 'Giro': ['Rotation', 'Gir'], 'La capa está vacía.': ['The layer is empty.', 'La capa és buida.'], 'Capa de texto': ['Text layer', 'Capa de text'], 'Opacidad del trazo': ['Stroke opacity', 'Opacitat del traç'],
    'Pinceles': ['Brushes', 'Pinzells'], 'Selecciona': ['Select', 'Selecciona'], 'Herramienta': ['Tool', 'Eina']
  });
  const O = Object.assign({ color: '#ffb000', color2: '#1a1a1a', tam: 40, dureza: 70, opac: 100, tol: 32, cont: 1, suave: 0, modoSel: 'nueva', forma: 'rect', selForma: 'rect', borde: 0, radio: 24, grad: 'lineal', gradT: 0,
    fuente: 'Inter', peso: 800, tamT: 96, interl: 1.15, alin: 'center', contorno: 0, sombra: 1, enMasc: 0 }, F.lee('foto-herr') || {});
  const guardaO = () => F.guarda('foto-herr', O);
  const D = () => F.D, A = () => F.D.capas[F.act];
  const lz = $('#fo-lienzo');
  const nuevaSel = () => lienzo(D().w, D().h);
  /* ---------- selección ---------- */
  let hormigas = null, horT = 0, horF = 0;
  function fijaSel(m, modo) { const d = D(); modo = modo || O.modoSel; if (O.suave > 0 && m) m = suaviza(m, O.suave);
    if (!m) { EXT.sel = null; } else if (modo === 'nueva' || !EXT.sel) EXT.sel = m; else { const r = lienzo(d.w, d.h), q = r.getContext('2d'); q.drawImage(EXT.sel, 0, 0); q.globalCompositeOperation = modo === 'anadir' ? 'source-over' : modo === 'restar' ? 'destination-out' : 'destination-in'; q.drawImage(m, 0, 0); EXT.sel = r; }
    bordes(); F.pinta(); pintaPanel(); }
  function suaviza(m, r) { const c = lienzo(m.width, m.height), q = c.getContext('2d'); if ('filter' in q) { q.filter = 'blur(' + r + 'px)'; q.drawImage(m, 0, 0); q.filter = 'none'; return c; } const im = ctx(m).getImageData(0, 0, m.width, m.height), o = PX.desenfoca(im, { radio: r * 2 }); q.putImageData(o, 0, 0); return c; }
  function selTodo() { const m = nuevaSel(), q = m.getContext('2d'); q.fillStyle = '#fff'; q.fillRect(0, 0, m.width, m.height); fijaSel(m, 'nueva'); }
  function selInvierte() { if (!EXT.sel) return selTodo(); const m = nuevaSel(), q = m.getContext('2d'); q.fillStyle = '#fff'; q.fillRect(0, 0, m.width, m.height); q.globalCompositeOperation = 'destination-out'; q.drawImage(EXT.sel, 0, 0); EXT.sel = m; bordes(); F.pinta(); }
  /* hormigas: el contorno de la selección, calculado una vez a escala de pantalla y animado */
  function bordes() { hormigas = null; if (!EXT.sel) { clearInterval(horT); horT = 0; return; } const d = D(), k = Math.min(1, 1600 / Math.max(d.w, d.h)), w = Math.max(1, Math.round(d.w * k)), h = Math.max(1, Math.round(d.h * k)), c = lienzo(w, h), q = ctx(c); q.drawImage(EXT.sel, 0, 0, w, h);
    const a = q.getImageData(0, 0, w, h), s = a.data, o1 = q.createImageData(w, h), o2 = q.createImageData(w, h), t1 = o1.data, t2 = o2.data, on = (x, y) => x >= 0 && y >= 0 && x < w && y < h && s[(y * w + x) * 4 + 3] >= 128;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (!on(x, y)) continue; if (on(x - 1, y) && on(x + 1, y) && on(x, y - 1) && on(x, y + 1)) continue; const i = (y * w + x) * 4, b = ((x + y) >> 2) & 1 ? 255 : 0; t1[i] = t1[i + 1] = t1[i + 2] = b; t2[i] = t2[i + 1] = t2[i + 2] = 255 - b; t1[i + 3] = t2[i + 3] = 255; }
    const c1 = lienzo(w, h), c2 = lienzo(w, h); c1.getContext('2d').putImageData(o1, 0, 0); c2.getContext('2d').putImageData(o2, 0, 0);
    hormigas = [c1, c2]; if (!horT) horT = setInterval(() => { if (!EXT.sel) { clearInterval(horT); horT = 0; return; } horF ^= 1; F.pinta(); }, 420); }
  EXT.orden.push('_sel'); EXT.herr._sel = { siempre: true, pinta(x, V) { const d = D(); if (EXT.sel && (EXT.sel.width !== d.w || EXT.sel.height !== d.h)) { EXT.sel = null; bordes(); } if (!hormigas) return; x.save(); x.imageSmoothingEnabled = false; x.drawImage(hormigas[horF], V.x, V.y, d.w * V.z, d.h * V.z); x.restore(); } };
  /* selección rectangular o elíptica */
  let arrS = null, lazoP = null;
  const modoDe = e => e.shiftKey && e.altKey ? 'cruzar' : e.shiftKey ? 'anadir' : e.altKey ? 'restar' : O.modoSel;
  herr('selrect', { ic: '⬚', n: 'Selección rectangular o elíptica', tecla: 'm', cursor: 1,
    down(x, y, e) { arrS = { x0: x, y0: y, x, y, modo: modoDe(e) }; }, move(x, y, e) { if (!arrS) return; if (e.shiftKey && O.selForma) { const s = Math.max(Math.abs(x - arrS.x0), Math.abs(y - arrS.y0)); x = arrS.x0 + Math.sign(x - arrS.x0) * s; y = arrS.y0 + Math.sign(y - arrS.y0) * s; } arrS.x = x; arrS.y = y; F.pinta(); },
    up() { if (!arrS) return; const a = arrS; arrS = null; const x0 = Math.min(a.x0, a.x), y0 = Math.min(a.y0, a.y), w = Math.abs(a.x - a.x0), h = Math.abs(a.y - a.y0); if (w < 2 || h < 2) { if (a.modo === 'nueva') fijaSel(null); F.pinta(); return; }
      const m = nuevaSel(), q = m.getContext('2d'); q.fillStyle = '#fff'; if (O.selForma === 'elipse') { q.beginPath(); q.ellipse(x0 + w / 2, y0 + h / 2, w / 2, h / 2, 0, 0, 6.2832); q.fill(); } else q.fillRect(Math.round(x0), Math.round(y0), Math.round(w), Math.round(h)); fijaSel(m, a.modo); },
    pinta(x, V) { if (!arrS) return; const x0 = V.x + Math.min(arrS.x0, arrS.x) * V.z, y0 = V.y + Math.min(arrS.y0, arrS.y) * V.z, w = Math.abs(arrS.x - arrS.x0) * V.z, h = Math.abs(arrS.y - arrS.y0) * V.z; x.save(); x.setLineDash([5, 4]); x.strokeStyle = '#fff'; x.lineWidth = 1; x.beginPath(); if (O.selForma === 'elipse') x.ellipse(x0 + w / 2, y0 + h / 2, w / 2, h / 2, 0, 0, 6.2832); else x.rect(x0, y0, w, h); x.stroke(); x.lineDashOffset = 4.5; x.strokeStyle = '#000'; x.stroke(); x.restore(); },
    panel: () => panelSel(selec('h-selforma', 'Forma', [['rect', 'Rectángulo'], ['elipse', 'Elipse']], O.selForma)) });
  herr('lazo', { ic: '∾', n: 'Lazo', tecla: 'l', cursor: 1,
    down(x, y, e) { lazoP = { p: [[x, y]], modo: modoDe(e) }; }, move(x, y) { if (!lazoP) return; const l = lazoP.p[lazoP.p.length - 1]; if (Math.hypot(x - l[0], y - l[1]) * F.V.z > 2) { lazoP.p.push([x, y]); F.pinta(); } },
    up() { if (!lazoP) return; const L = lazoP; lazoP = null; if (L.p.length < 3) { F.pinta(); return; } const m = nuevaSel(), q = m.getContext('2d'); q.fillStyle = '#fff'; q.beginPath(); L.p.forEach((p, i) => i ? q.lineTo(p[0], p[1]) : q.moveTo(p[0], p[1])); q.closePath(); q.fill(); fijaSel(m, L.modo); },
    pinta(x, V) { if (!lazoP) return; x.save(); x.setLineDash([5, 4]); x.strokeStyle = '#fff'; x.beginPath(); lazoP.p.forEach((p, i) => { const X = V.x + p[0] * V.z, Y = V.y + p[1] * V.z; i ? x.lineTo(X, Y) : x.moveTo(X, Y); }); x.stroke(); x.restore(); },
    panel: () => panelSel('') });
  /* varita mágica: contigua (relleno por inundación) o por color en toda la imagen */
  herr('varita', { ic: '🪄', n: 'Varita mágica', tecla: 'w', cursor: 1,
    down(x, y, e) { const d = D(); x = Math.floor(x); y = Math.floor(y); if (x < 0 || y < 0 || x >= d.w || y >= d.h) return; F.espera(true); const modo = modoDe(e); setTimeout(() => { try { fijaSel(varita(x, y), modo); } finally { F.espera(false); } }, 20); },
    panel: () => panelSel(desl('h-tol', 'Tolerancia', 0, 255, O.tol) + selec('h-cont', 'Selecciona', [[1, 'Contigua'], [0, 'En toda la imagen (por color)']], O.cont)) });
  function varita(x0, y0) { const d = D(), c = A().cv, w = c.width, h = c.height, s = ctx(c).getImageData(0, 0, w, h).data, i0 = (y0 * w + x0) * 4, r = s[i0], g = s[i0 + 1], b = s[i0 + 2], a = s[i0 + 3], tol = O.tol, m = nuevaSel(), q = ctx(m), o = q.createImageData(w, h), t = o.data;
    const igual = i => Math.max(Math.abs(s[i] - r), Math.abs(s[i + 1] - g), Math.abs(s[i + 2] - b), Math.abs(s[i + 3] - a)) <= tol;
    if (+O.cont) { const vis = new Uint8Array(w * h), pila = [y0 * w + x0]; vis[pila[0]] = 1; while (pila.length) { const p = pila.pop(), i = p * 4; if (!igual(i)) continue; t[i + 3] = 255; const px = p % w, py = (p / w) | 0;
        if (px > 0 && !vis[p - 1]) { vis[p - 1] = 1; pila.push(p - 1); } if (px < w - 1 && !vis[p + 1]) { vis[p + 1] = 1; pila.push(p + 1); } if (py > 0 && !vis[p - w]) { vis[p - w] = 1; pila.push(p - w); } if (py < h - 1 && !vis[p + w]) { vis[p + w] = 1; pila.push(p + w); } } }
    else for (let i = 0; i < t.length; i += 4) if (igual(i)) t[i + 3] = 255;
    for (let i = 0; i < t.length; i += 4) t[i] = t[i + 1] = t[i + 2] = 255; q.putImageData(o, 0, 0); return m; }
  function panelSel(extra) { return '<div class="fo-sec"><h3>' + T('Selección') + '</h3>' + selec('h-modosel', 'Modo', [['nueva', 'Nueva'], ['anadir', 'Añadir'], ['restar', 'Restar'], ['cruzar', 'Cruzar']], O.modoSel) + extra + desl('h-suave', 'Borde suave', 0, 60, O.suave) +
    '<div class="fo-rej fo-rej3">' + tecla('h-todo', T('Todo')) + tecla('h-nada', T('Nada'), { dis: !EXT.sel }) + tecla('h-inv', T('Invertir')) + tecla('h-rellena', T('Rellenar'), { dis: !EXT.sel }) + tecla('h-vacia', T('Vaciar'), { dis: !EXT.sel }) + tecla('h-acapa', T('A capa nueva'), { dis: !EXT.sel }) + '</div>' + colorFila() + '</div>'; }
  /* con la selección: rellenar, vaciar y llevar a capa nueva (lo de fuera no se toca) */
  function recortaSel(c) { const r = lienzo(c.width, c.height), q = r.getContext('2d'); q.drawImage(c, 0, 0); if (EXT.sel) { q.globalCompositeOperation = 'destination-in'; q.drawImage(EXT.sel, 0, 0); } return r; }
  function rellenaSel(col) { const c = A().cv, n = lienzo(c.width, c.height), q = n.getContext('2d'); q.drawImage(c, 0, 0); const f = lienzo(c.width, c.height), fq = f.getContext('2d'); fq.fillStyle = col; fq.fillRect(0, 0, f.width, f.height); q.globalAlpha = O.opac / 100; q.drawImage(recortaSel(f), 0, 0); F.cambiaCapa(F.act, n, T('Rellenar')); }
  function vaciaSel() { if (!EXT.sel) return; const c = A().cv, n = lienzo(c.width, c.height), q = n.getContext('2d'); q.drawImage(c, 0, 0); q.globalCompositeOperation = 'destination-out'; q.drawImage(EXT.sel, 0, 0); F.cambiaCapa(F.act, n, T('Vaciar')); }
  function aCapa() { if (!EXT.sel) return; F.nuevaCapa(recortaSel(A().cv), T('Selección')); }
  /* ---------- pinceles: pincel, borrador, tampón y corrector ---------- */
  let tr = null, origen = null, cursorP = null, rafP = 0;
  function dab(q, x, y, r) { const g = q.createRadialGradient(x, y, 0, x, y, r), h = Math.min(.99, O.dureza / 100); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(h, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); q.fillStyle = g; q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill(); }
  function trazo(x, y) { const r = O.tam / 2, q = tr.buf.getContext('2d'), l = tr.l, dx = x - l[0], dy = y - l[1], d = Math.hypot(dx, dy), paso = Math.max(1, r * .22); if (d < 1e-6) return; let t = paso - tr.resto;   /* tr.resto: lo recorrido desde el último toque */
    while (t <= d) { dab(q, l[0] + dx * t / d, l[1] + dy * t / d, r); t += paso; } tr.resto = d - (t - paso); tr.l = [x, y]; }
  function enMascara() { const c = A(); return !!(+O.enMasc && c.mask); }
  /* el resultado del trazo sobre la capa (o su máscara) */
  function resultado(final) { const c = A(), base = tr.base, w = base.width, h = base.height, m = lienzo(w, h), mq = m.getContext('2d'); mq.drawImage(tr.buf, 0, 0); if (EXT.sel) { mq.globalCompositeOperation = 'destination-in'; mq.drawImage(EXT.sel, 0, 0); }
    const o = lienzo(w, h), q = o.getContext('2d'); q.drawImage(base, 0, 0); const k = tr.k, al = O.opac / 100;
    if (k === 'borrador' || (k === 'pincel' && tr.masc && claro(O.color) < .5)) { q.globalAlpha = al; q.globalCompositeOperation = 'destination-out'; q.drawImage(m, 0, 0); }
    else if (k === 'pincel') { const f = lienzo(w, h), fq = f.getContext('2d'); fq.fillStyle = tr.masc ? '#fff' : O.color; fq.fillRect(0, 0, w, h); fq.globalCompositeOperation = 'destination-in'; fq.drawImage(m, 0, 0); q.globalAlpha = al; q.drawImage(f, 0, 0); }
    else { let pz = lienzo(w, h); pz.getContext('2d').drawImage(tr.src, tr.off[0], tr.off[1]); if (k === 'corrector' && final) pz = cura(pz, base, m); const zq = pz.getContext('2d'); zq.globalCompositeOperation = 'destination-in'; zq.drawImage(m, 0, 0); q.globalAlpha = al; q.drawImage(pz, 0, 0); }
    return o; }
  const claro = h => { const m = /^#?([\da-f]{6})$/i.exec(h || ''), n = m ? parseInt(m[1], 16) : 0; return (.299 * (n >> 16 & 255) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255; };
  /* pincel corrector: la textura del origen con el color y la luz del destino (alta frecuencia del origen + baja del destino), solo en la zona del trazo */
  function cura(pz, base, m) { const b = caja(m); if (!b) return pz; const [x0, y0, w, h] = b, rad = Math.max(3, O.tam * .45), S = ctx(pz).getImageData(x0, y0, w, h), Dd = ctx(base).getImageData(x0, y0, w, h), bs = PX.desenfoca(S, { radio: rad }), bd = PX.desenfoca(Dd, { radio: rad }), s = S.data;
    for (let i = 0; i < s.length; i += 4) for (let k = 0; k < 3; k++) s[i + k] = s[i + k] - bs.data[i + k] + bd.data[i + k]; const o = lienzo(pz.width, pz.height); o.getContext('2d').drawImage(pz, 0, 0); o.getContext('2d').putImageData(S, x0, y0); return o; }
  function caja(m) { const w = m.width, h = m.height, k = Math.min(1, 800 / Math.max(w, h)), sw = Math.max(1, Math.round(w * k)), sh = Math.max(1, Math.round(h * k)), c = lienzo(sw, sh), q = ctx(c); q.drawImage(m, 0, 0, sw, sh); const a = q.getImageData(0, 0, sw, sh).data; let x0 = sw, y0 = sh, x1 = -1, y1 = -1;
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) if (a[(y * sw + x) * 4 + 3] > 2) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } if (x1 < 0) return null;
    const pad = Math.ceil(O.tam), X = Math.max(0, Math.floor(x0 / k) - pad), Y = Math.max(0, Math.floor(y0 / k) - pad); return [X, Y, Math.min(w, Math.ceil((x1 + 1) / k) + pad) - X, Math.min(h, Math.ceil((y1 + 1) / k) + pad) - Y]; }
  function pincel(k, ic, n, tec) { herr(k, { ic, n, tecla: tec, cursor: 1,
    down(x, y, e) { const c = A(); if (!c) return; if ((k === 'tampon' || k === 'corrector') && (e.altKey || e.pointerType === 'touch' && largo(e, x, y))) { origen = [x, y]; F.estado(T('Origen tomado')); return; }
      if ((k === 'tampon' || k === 'corrector') && !origen) { F.estado(T('Primero toma el origen.')); return; } const masc = k !== 'tampon' && k !== 'corrector' && enMascara();
      tr = { k, masc, base: masc ? c.mask : c.cv, buf: lienzo(D().w, D().h), l: [x, y], resto: 0 }; if (k === 'tampon' || k === 'corrector') { tr.src = c.cv; tr.off = tr.off0 = [x - origen[0], y - origen[1]]; } dab(tr.buf.getContext('2d'), x, y, O.tam / 2); vivo(); },
    move(x, y) { cursorP = [x, y]; if (!tr) { F.pinta(); return; } trazo(x, y); vivo(); },
    up() { if (!tr) return; cancelAnimationFrame(rafP); const t = tr, o = resultado(true); tr = null; EXT.tmp = null; if (t.masc) { const c = A(); F.D.capas[F.act] = Object.assign({}, c, { mask: o }); F.compone(); F.paso(T(n)); F.pinta(); F.pintaCapas(); } else F.cambiaCapa(F.act, o, T(n));
      if (k === 'tampon' || k === 'corrector') origen = [origen[0], origen[1]]; },
    hover(x, y) { cursorP = [x, y]; F.pinta(); },
    pinta(x, V) { if (!cursorP) return; const r = O.tam / 2 * V.z; x.save(); x.strokeStyle = '#000'; x.lineWidth = 2; x.beginPath(); x.arc(V.x + cursorP[0] * V.z, V.y + cursorP[1] * V.z, Math.max(2, r), 0, 6.2832); x.stroke(); x.strokeStyle = '#fff'; x.lineWidth = 1; x.stroke();
      if (origen && (k === 'tampon' || k === 'corrector')) { const o = tr ? [cursorP[0] - tr.off[0], cursorP[1] - tr.off[1]] : origen, X = V.x + o[0] * V.z, Y = V.y + o[1] * V.z; x.beginPath(); x.moveTo(X - 7, Y); x.lineTo(X + 7, Y); x.moveTo(X, Y - 7); x.lineTo(X, Y + 7); x.stroke(); } x.restore(); },
    sale() { cursorP = null; }, panel: () => panelPincel(k) }); }
  function vivo() { cancelAnimationFrame(rafP); rafP = requestAnimationFrame(() => { if (!tr) return; const o = resultado(false); EXT.tmp = tr.masc ? { i: F.act, m: o } : { i: F.act, cv: o }; F.compone(); F.pinta(); }); }
  /* toque largo (medio segundo quieto) para tomar el origen en pantallas táctiles */
  let largoT = null; function largo(e) { return e && e.__largo; }
  lz.addEventListener('pointerdown', e => { if (e.pointerType !== 'touch' || (F.herr !== 'tampon' && F.herr !== 'corrector')) return; const r = lz.getBoundingClientRect(), p = F.aDoc(e.clientX - r.left, e.clientY - r.top); clearTimeout(largoT); largoT = setTimeout(() => { if (tr) { tr = null; EXT.tmp = null; F.compone(); } origen = p; F.estado(T('Origen tomado')); F.pinta(); }, 550); }, true);
  ['pointermove', 'pointerup', 'pointercancel'].forEach(ev => lz.addEventListener(ev, e => { if (ev !== 'pointermove' || (e.movementX || 0) ** 2 + (e.movementY || 0) ** 2 > 9) clearTimeout(largoT); }, true));
  function panelPincel(k) { const c = A(); return '<div class="fo-sec"><h3>' + T({ pincel: 'Pincel', borrador: 'Borrador', tampon: 'Tampón de clonar', corrector: 'Pincel corrector' }[k]) + '</h3>' + desl('h-tam', 'Tamaño del pincel', 1, 400, O.tam) + desl('h-dureza', 'Dureza', 0, 100, O.dureza) + desl('h-opac', 'Opacidad del trazo', 1, 100, O.opac) +
    (k === 'pincel' ? colorFila(true) : '') + (k === 'tampon' || k === 'corrector' ? '<p class="fo-nota">' + T('Alt + clic (o toque largo) para tomar el origen.') + '</p>' : '') +
    (c && c.mask && (k === 'pincel' || k === 'borrador') ? selec('h-enmasc', 'Pintar en la máscara', [[0, 'Capa'], [1, 'Máscara']], O.enMasc) + '<p class="fo-nota">' + T('Pinta en blanco para mostrar y en negro para ocultar.') + '</p>' : '') + '</div>'; }
  const colorFila = solo => '<div class="desl"><label for="h-color">' + T('Color') + '</label><input type="color" id="h-color" value="' + O.color + '" class="fo-color">' + (solo ? '<span></span>' : '<input type="color" id="h-color2" value="' + O.color2 + '" class="fo-color" aria-label="' + T('Color 2') + '">') + '</div>';
  pincel('pincel', '🖌', 'Pincel', 'b'); pincel('borrador', '🧽', 'Borrador', 'e'); pincel('tampon', '⧉', 'Tampón de clonar', 's'); pincel('corrector', '🩹', 'Pincel corrector', 'j');
  /* ---------- máscaras de capa (en el panel de capas) ---------- */
  EXT.capasExtra = () => { const c = A(); return '<h3 style="margin-top:6px">' + T('Máscara') + '</h3><div class="fo-rej">' + (c.mask ? tecla('h-maplica', T('Aplicar máscara')) + tecla('h-mquita', T('Quitar máscara')) : tecla('h-mnueva', '◑ ' + T('Añadir máscara'))) + '</div>' + (c.mask ? '<p class="fo-nota">' + T('Pinta en blanco para mostrar y en negro para ocultar.') + '</p>' : ''); };
  function mascNueva() { const c = A(), d = D(), m = lienzo(d.w, d.h), q = m.getContext('2d'); if (EXT.sel) q.drawImage(EXT.sel, 0, 0); else { q.fillStyle = '#fff'; q.fillRect(0, 0, d.w, d.h); } F.D.capas[F.act] = Object.assign({}, c, { mask: m }); O.enMasc = 1; guardaO(); F.compone(); F.paso(T('Añadir máscara')); F.pinta(); F.pintaTab(); }
  function mascAplica() { const c = A(); if (!c.mask) return; const n = lienzo(c.cv.width, c.cv.height), q = n.getContext('2d'); q.drawImage(c.cv, 0, 0); q.globalCompositeOperation = 'destination-in'; q.drawImage(c.mask, 0, 0); F.D.capas[F.act] = Object.assign({}, c, { cv: n, mask: null }); F.compone(); F.paso(T('Aplicar máscara')); F.pinta(); F.pintaTab(); }
  function mascQuita() { const c = A(); F.D.capas[F.act] = Object.assign({}, c, { mask: null }); F.compone(); F.paso(T('Quitar máscara')); F.pinta(); F.pintaTab(); }
  /* ---------- texto ---------- */
  const FUENTES = ['Inter', 'Montserrat', 'Poppins', 'Bebas Neue', 'Anton', 'Oswald', 'League Gothic', 'Archivo Black', 'Playfair Display', 'Abril Fatface', 'Cinzel', 'Marcellus', 'Alfa Slab One', 'Fredoka', 'Righteous', 'Pacifico', 'Caveat', 'Courier Prime', 'Share Tech Mono'];
  let arrT = null;
  function pintaTexto(t, w, h) { const c = lienzo(w, h), q = c.getContext('2d'), L = String(t.txt || '').split('\n'), lh = t.tam * t.interl; q.font = t.peso + ' ' + t.tam + 'px "' + t.fuente + '"'; q.textAlign = t.alin; q.textBaseline = 'top'; q.lineJoin = 'round';
    let mw = 0; L.forEach(l => { mw = Math.max(mw, q.measureText(l).width); }); const hT = lh * L.length, x0 = t.alin === 'left' ? t.x : t.alin === 'right' ? t.x : t.x; t.bbox = [t.alin === 'left' ? t.x : t.alin === 'right' ? t.x - mw : t.x - mw / 2, t.y, mw, hT];
    if (t.sombra) { q.shadowColor = 'rgba(0,0,0,.55)'; q.shadowBlur = t.tam * .12; q.shadowOffsetY = t.tam * .05; }
    L.forEach((l, i) => { const y = t.y + i * lh + (lh - t.tam) / 2; if (t.contorno > 0) { q.lineWidth = t.contorno * 2; q.strokeStyle = t.color2; q.strokeText(l, x0, y); if (t.sombra) { q.shadowColor = 'transparent'; } } q.fillStyle = t.color; q.fillText(l, x0, y); if (t.sombra && t.contorno > 0) q.shadowColor = 'rgba(0,0,0,.55)'; }); return c; }
  async function rehaceTexto(i, paso) { const c = F.D.capas[i]; if (!c || !c.txt) return; try { await document.fonts.load(c.txt.peso + ' ' + c.txt.tam + 'px "' + c.txt.fuente + '"'); } catch (e) {} const t = Object.assign({}, c.txt), cv = pintaTexto(t, D().w, D().h);
    F.D.capas[i] = Object.assign({}, c, { cv, txt: t, n: (t.txt || T('Texto')).split('\n')[0].slice(0, 24) }); F.compone(); F.pinta(); if (paso) { clearTimeout(rehaceTexto.t); rehaceTexto.t = setTimeout(() => { F.paso(T('Texto')); F.pintaCapas(); }, 400); } }
  function textoNuevo(x, y) { const d = D(), t = { txt: T('Escribe aquí'), fuente: O.fuente, peso: O.peso, tam: Math.round(O.tamT * Math.max(.4, Math.min(d.w, d.h) / 1080)), interl: O.interl, alin: O.alin, color: O.color, color2: O.color2, contorno: O.contorno, sombra: O.sombra, x, y };
    const c = F.capa(pintaTexto(t, d.w, d.h), T('Texto')); c.txt = t; F.D.capas.splice(F.act + 1, 0, c); F.act = F.act + 1; rehaceTexto(F.act, false).then(() => { F.paso(T('Capa de texto')); F.pintaTab(); const ta = $('#h-txt'); if (ta) { ta.focus(); ta.select(); } }); }
  herr('texto', { ic: '𝐓', n: 'Texto', tecla: 't', cursor: 1,
    down(x, y) { const c = A(); if (c && c.txt && c.txt.bbox) { const b = c.txt.bbox, m = 12 / F.V.z; if (x > b[0] - m && x < b[0] + b[2] + m && y > b[1] - m && y < b[1] + b[3] + m) { arrT = { x0: x, y0: y, tx: c.txt.x, ty: c.txt.y }; return; } }
      const j = F.D.capas.map((k, i) => i).reverse().find(i => { const k = F.D.capas[i]; if (!k.txt || !k.txt.bbox || !k.vis) return false; const b = k.txt.bbox; return x > b[0] && x < b[0] + b[2] && y > b[1] && y < b[1] + b[3]; });
      if (j != null) { F.act = j; F.pintaTab(); F.pinta(); const k = A(); arrT = { x0: x, y0: y, tx: k.txt.x, ty: k.txt.y }; return; } textoNuevo(x, y - O.tamT * .5); },
    move(x, y) { if (!arrT) return; const c = A(); if (!c.txt) return; c.txt.x = arrT.tx + x - arrT.x0; c.txt.y = arrT.ty + y - arrT.y0; rehaceTexto(F.act, false); },
    up() { if (arrT) { arrT = null; F.paso(T('Mover')); } },
    pinta(x, V) { const c = A(); if (!c || !c.txt || !c.txt.bbox) return; const b = c.txt.bbox; x.save(); x.setLineDash([4, 3]); x.strokeStyle = '#ffb000'; x.strokeRect(V.x + b[0] * V.z - 4, V.y + b[1] * V.z - 4, b[2] * V.z + 8, b[3] * V.z + 8); x.restore(); },
    panel() { const c = A(), t = c && c.txt ? c.txt : O; return '<div class="fo-sec"><h3>' + T('Texto') + '</h3>' + (c && c.txt ? '<textarea class="campo area" id="h-txt" rows="3" aria-label="' + T('Texto') + '">' + esc(c.txt.txt) + '</textarea>' : '<p class="fo-nota">' + T('Toca la imagen para escribir; arrastra el texto para moverlo.') + '</p>') +
      selec('h-fuente', 'Fuente', FUENTES.map(f => [f, f]), t.fuente) + desl('h-tamT', 'Tamaño', 8, 600, c && c.txt ? c.txt.tam : O.tamT) + selec('h-peso', 'Grosor', [[400, '400'], [700, '700'], [800, '800'], [900, '900']], t.peso) + desl('h-interl', 'Interlineado', .7, 2, t.interl, .05) +
      selec('h-alin', 'Alineación', [['left', 'Izquierda'], ['center', 'Centro'], ['right', 'Derecha']], t.alin) + '<div class="desl"><label for="h-tcolor">' + T('Color') + '</label><input type="color" id="h-tcolor" value="' + t.color + '" class="fo-color"><input type="color" id="h-tcolor2" value="' + t.color2 + '" class="fo-color" aria-label="' + T('Contorno') + '"></div>' +
      desl('h-contorno', 'Contorno', 0, 40, t.contorno) + selec('h-sombra', 'Sombra', [[1, 'Sombra'], [0, 'Nada']], t.sombra) + '</div>'; } });
  /* ---------- formas ---------- */
  let arrF = null;
  herr('forma', { ic: '◼', n: 'Formas', tecla: 'u', cursor: 1,
    down(x, y) { arrF = { x0: x, y0: y, x, y }; }, move(x, y, e) { if (!arrF) return; if (e.shiftKey) { const s = Math.max(Math.abs(x - arrF.x0), Math.abs(y - arrF.y0)); x = arrF.x0 + Math.sign(x - arrF.x0 || 1) * s; y = arrF.y0 + Math.sign(y - arrF.y0 || 1) * s; } arrF.x = x; arrF.y = y; F.pinta(); },
    up() { if (!arrF) return; const a = arrF; arrF = null; if (Math.hypot(a.x - a.x0, a.y - a.y0) < 3) { F.pinta(); return; } const d = D(), c = lienzo(d.w, d.h); dibujaForma(c.getContext('2d'), a, 1); F.nuevaCapa(c, T('Forma')); },
    pinta(x, V) { if (!arrF) return; x.save(); x.translate(V.x, V.y); x.scale(V.z, V.z); x.globalAlpha = .85; dibujaForma(x, arrF, 1 / V.z); x.restore(); },
    panel: () => '<div class="fo-sec"><h3>' + T('Formas') + '</h3>' + selec('h-forma', 'Forma', [['rect', 'Rectángulo'], ['redondo', 'Redondeado'], ['elipse', 'Elipse'], ['linea', 'Línea'], ['flecha', 'Flecha']], O.forma) +
      '<div class="desl"><label for="h-color">' + T('Relleno') + '</label><input type="color" id="h-color" value="' + O.color + '" class="fo-color"><input type="color" id="h-color2" value="' + O.color2 + '" class="fo-color" aria-label="' + T('Borde') + '"></div>' + desl('h-borde', 'Borde', 0, 80, O.borde) + (O.forma === 'redondo' ? desl('h-radio', 'Esquinas', 0, 300, O.radio) : '') + desl('h-opac', 'Opacidad', 1, 100, O.opac) + '<p class="fo-nota">' + T('Arrastra sobre la imagen para dibujarla.') + '</p></div>' });
  function dibujaForma(q, a, k) { const x0 = Math.min(a.x0, a.x), y0 = Math.min(a.y0, a.y), w = Math.abs(a.x - a.x0), h = Math.abs(a.y - a.y0); q.save(); q.globalAlpha *= O.opac / 100; q.fillStyle = O.color; q.strokeStyle = O.borde ? O.color2 : O.color; q.lineWidth = Math.max(O.borde, O.forma === 'linea' || O.forma === 'flecha' ? Math.max(4, O.borde || 8) : 0); q.lineJoin = 'round'; q.lineCap = 'round'; q.beginPath();
    if (O.forma === 'rect') q.rect(x0, y0, w, h); else if (O.forma === 'redondo') { const r = Math.min(O.radio, w / 2, h / 2); q.moveTo(x0 + r, y0); q.arcTo(x0 + w, y0, x0 + w, y0 + h, r); q.arcTo(x0 + w, y0 + h, x0, y0 + h, r); q.arcTo(x0, y0 + h, x0, y0, r); q.arcTo(x0, y0, x0 + w, y0, r); q.closePath(); }
    else if (O.forma === 'elipse') q.ellipse(x0 + w / 2, y0 + h / 2, w / 2, h / 2, 0, 0, 6.2832);
    else { q.strokeStyle = O.color; q.moveTo(a.x0, a.y0); q.lineTo(a.x, a.y); if (O.forma === 'flecha') { const an = Math.atan2(a.y - a.y0, a.x - a.x0), L = Math.max(18, q.lineWidth * 3.2); q.moveTo(a.x, a.y); q.lineTo(a.x - L * Math.cos(an - .45), a.y - L * Math.sin(an - .45)); q.moveTo(a.x, a.y); q.lineTo(a.x - L * Math.cos(an + .45), a.y - L * Math.sin(an + .45)); } q.stroke(); q.restore(); return; }
    q.fill(); if (O.borde) q.stroke(); q.restore(); }
  /* ---------- degradado ---------- */
  let arrG = null;
  herr('degradado', { ic: '◩', n: 'Degradado', tecla: 'g', cursor: 1,
    down(x, y) { arrG = { x0: x, y0: y, x, y }; }, move(x, y) { if (!arrG) return; arrG.x = x; arrG.y = y; F.pinta(); },
    up() { if (!arrG) return; const a = arrG; arrG = null; if (Math.hypot(a.x - a.x0, a.y - a.y0) < 2) { F.pinta(); return; } const c = A().cv, w = c.width, h = c.height, f = lienzo(w, h), fq = f.getContext('2d');
      const g = O.grad === 'radial' ? fq.createRadialGradient(a.x0, a.y0, 0, a.x0, a.y0, Math.hypot(a.x - a.x0, a.y - a.y0)) : fq.createLinearGradient(a.x0, a.y0, a.x, a.y); g.addColorStop(0, O.color); g.addColorStop(1, +O.gradT ? O.color + '00' : O.color2); fq.fillStyle = g; fq.fillRect(0, 0, w, h);
      const n = lienzo(w, h), q = n.getContext('2d'); q.drawImage(c, 0, 0); q.globalAlpha = O.opac / 100; q.drawImage(recortaSel(f), 0, 0); F.cambiaCapa(F.act, n, T('Degradado')); },
    pinta(x, V) { if (!arrG) return; x.save(); x.strokeStyle = '#fff'; x.lineWidth = 2; x.setLineDash([6, 4]); x.beginPath(); x.moveTo(V.x + arrG.x0 * V.z, V.y + arrG.y0 * V.z); x.lineTo(V.x + arrG.x * V.z, V.y + arrG.y * V.z); x.stroke(); x.restore(); },
    panel: () => '<div class="fo-sec"><h3>' + T('Degradado') + '</h3>' + selec('h-grad', 'Tipo', [['lineal', 'Lineal'], ['radial', 'Radial']], O.grad) + colorFila() + selec('h-gradT', 'Hasta', [[0, 'Color 2'], [1, 'Color 2 a transparente']], O.gradT) + desl('h-opac', 'Opacidad', 1, 100, O.opac) + '<p class="fo-nota">' + T('Arrastra para trazar el degradado.') + '</p></div>' });
  /* ---------- transformar la capa: mover, escalar y girar ---------- */
  let TF = null, arrX = null;
  function contenido(c) { const w = c.width, h = c.height, k = Math.min(1, 600 / Math.max(w, h)), sw = Math.max(1, Math.round(w * k)), sh = Math.max(1, Math.round(h * k)), t = lienzo(sw, sh), q = ctx(t); q.drawImage(c, 0, 0, sw, sh); const a = q.getImageData(0, 0, sw, sh).data; let x0 = sw, y0 = sh, x1 = -1, y1 = -1;
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) if (a[(y * sw + x) * 4 + 3] > 0) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } if (x1 < 0) return null; const X = Math.max(0, Math.floor(x0 / k) - 1), Y = Math.max(0, Math.floor(y0 / k) - 1); return [X, Y, Math.min(w, Math.ceil((x1 + 1) / k) + 1) - X, Math.min(h, Math.ceil((y1 + 1) / k) + 1) - Y]; }
  function tfEmpieza() { const c = A(); if (!c) return; const b = contenido(c.cv); if (!b) { TF = null; F.estado(T('La capa está vacía.')); return; } const pz = lienzo(b[2], b[3]); pz.getContext('2d').drawImage(c.cv, -b[0], -b[1]); TF = { i: F.act, pz, cx: b[0] + b[2] / 2, cy: b[1] + b[3] / 2, w: b[2], h: b[3], sx: 1, sy: 1, ang: 0 }; tfVivo(); }
  function tfLienzo() { const d = D(), c = A(), o = lienzo(d.w, d.h), q = o.getContext('2d'); q.imageSmoothingQuality = 'high'; q.translate(TF.cx, TF.cy); q.rotate(TF.ang); q.scale(TF.sx, TF.sy); q.drawImage(TF.pz, -TF.w / 2, -TF.h / 2); const b = contenido(c.cv), r = lienzo(d.w, d.h), rq = r.getContext('2d'); rq.drawImage(c.cv, 0, 0); if (b) rq.clearRect(b[0], b[1], b[2], b[3]); rq.drawImage(o, 0, 0); return r; }
  function tfVivo() { if (!TF) return; EXT.tmp = { i: TF.i, cv: tfLienzo() }; F.compone(); F.pinta(); }
  const tfEsq = () => { const hw = TF.w * TF.sx / 2, hh = TF.h * TF.sy / 2, c = Math.cos(TF.ang), s = Math.sin(TF.ang), P = (x, y) => [TF.cx + x * c - y * s, TF.cy + x * s + y * c]; return { nw: P(-hw, -hh), ne: P(hw, -hh), se: P(hw, hh), sw: P(-hw, hh), rot: P(0, -hh - 36 / F.V.z) }; };
  function tfAplica() { if (!TF) return; const o = tfLienzo(), i = TF.i; TF = null; EXT.tmp = null; F.act = i; F.cambiaCapa(i, o, T('Transformar')); tfEmpieza(); }
  function tfCancela() { TF = null; EXT.tmp = null; F.compone(); F.pinta(); }
  herr('transformar', { ic: '⤡', n: 'Transformar', tecla: 'q', cursor: 1,
    entra() { tfEmpieza(); }, sale() { tfCancela(); },
    down(x, y, e) { if (!TF || TF.i !== F.act) tfEmpieza(); if (!TF) return; const E = tfEsq(), m = 14 / F.V.z; let h = null; for (const k in E) if (Math.hypot(E[k][0] - x, E[k][1] - y) < m) h = k; arrX = { h, x0: x, y0: y, t0: Object.assign({}, TF) }; },
    move(x, y, e) { if (!arrX || !TF) return; const t = arrX.t0;
      if (!arrX.h) { TF.cx = t.cx + x - arrX.x0; TF.cy = t.cy + y - arrX.y0; }
      else if (arrX.h === 'rot') { TF.ang = Math.atan2(y - t.cy, x - t.cx) + Math.PI / 2; if (e.shiftKey) TF.ang = Math.round(TF.ang / (Math.PI / 12)) * Math.PI / 12; }
      else { const c = Math.cos(-t.ang), s = Math.sin(-t.ang), lx = (x - t.cx) * c - (y - t.cy) * s, ly = (x - t.cx) * s + (y - t.cy) * c, kx = Math.abs(lx) / (t.w / 2), ky = Math.abs(ly) / (t.h / 2); if (e.shiftKey) { TF.sx = Math.max(.01, kx); TF.sy = Math.max(.01, ky); } else { const k = Math.max(.01, Math.max(kx, ky)); TF.sx = TF.sy = k; } }
      tfVivo(); pintaPanel(); },
    up() { arrX = null; },
    pinta(x, V) { if (!TF) return; const E = tfEsq(), p = k => [V.x + E[k][0] * V.z, V.y + E[k][1] * V.z]; x.save(); x.strokeStyle = '#ffb000'; x.lineWidth = 1.5; x.beginPath(); ['nw', 'ne', 'se', 'sw'].forEach((k, i) => i ? x.lineTo(...p(k)) : x.moveTo(...p(k))); x.closePath(); x.stroke();
      const n = p('nw'), ne = p('ne'), r = p('rot'); x.beginPath(); x.moveTo((n[0] + ne[0]) / 2, (n[1] + ne[1]) / 2); x.lineTo(r[0], r[1]); x.stroke(); x.fillStyle = '#ffb000'; x.strokeStyle = '#000'; ['nw', 'ne', 'se', 'sw', 'rot'].forEach(k => { const q = p(k); x.beginPath(); k === 'rot' ? x.arc(q[0], q[1], 7, 0, 6.2832) : x.rect(q[0] - 6, q[1] - 6, 12, 12); x.fill(); x.stroke(); }); x.restore(); },
    panel: () => '<div class="fo-sec"><h3>' + T('Transformar') + '</h3><p class="fo-nota">' + T('Arrastra para mover; las esquinas escalan (Mayús: libre) y el tirador de arriba gira.') + '</p>' + (TF ? '<p class="fo-nota">' + T('Escala') + ' ' + Math.round(TF.sx * 100) + ' % × ' + Math.round(TF.sy * 100) + ' % · ' + T('Giro') + ' ' + Math.round(TF.ang * 180 / Math.PI) + '°</p>' : '') + '<div class="fo-acc">' + tecla('h-tfno', T('Cancelar')) + tecla('h-tfsi', T('Aplicar'), { cls: 'pri' }) + '</div></div>' });
  /* ---------- registro, paneles, clics y teclado ---------- */
  function herr(k, h) { EXT.herr[k] = h; EXT.orden.push(k); }
  function pintaPanel() { const h = EXT.herr[F.herr]; if (h && h.panel) { const a = document.activeElement, id = a && a.id; F.pintaTab(); if (id) { const n = document.getElementById(id); if (n && n !== a) { n.focus(); if (n.setSelectionRange && a.selectionStart != null) try { n.setSelectionRange(a.selectionStart, a.selectionEnd); } catch (e) {} } } } }
  document.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b || b.disabled || !F.D) return; const a = b.dataset.a;
    if (a === 'h-todo') selTodo(); else if (a === 'h-nada') fijaSel(null); else if (a === 'h-inv') { selInvierte(); pintaPanel(); } else if (a === 'h-rellena') rellenaSel(O.color); else if (a === 'h-vacia') vaciaSel(); else if (a === 'h-acapa') aCapa();
    else if (a === 'h-mnueva') mascNueva(); else if (a === 'h-maplica') mascAplica(); else if (a === 'h-mquita') mascQuita(); else if (a === 'h-tfsi') tfAplica(); else if (a === 'h-tfno') { tfCancela(); F.pon('mano'); } });
  const NUM = ['tam', 'dureza', 'opac', 'tol', 'suave', 'borde', 'radio', 'contorno', 'tamT', 'interl'];
  function campo(t, fin) { const id = (t.id || '').replace(/^h-/, ''); if (!t.id || t.id.indexOf('h-') !== 0) return; const v = NUM.includes(id) ? +t.value : t.value, c = F.D && A();
    const TXT = { txt: 'txt', fuente: 'fuente', tamT: 'tam', peso: 'peso', interl: 'interl', alin: 'alin', tcolor: 'color', tcolor2: 'color2', contorno: 'contorno', sombra: 'sombra' };
    if (c && c.txt && id in TXT && F.herr === 'texto') { c.txt[TXT[id]] = id === 'peso' || id === 'sombra' ? +v : v; if (id !== 'txt') { O[id === 'tamT' ? 'tamT' : id === 'tcolor' ? 'color' : id === 'tcolor2' ? 'color2' : id] = c.txt[TXT[id]]; guardaO(); } rehaceTexto(F.act, true); return; }
    const k = { modosel: 'modoSel', selforma: 'selForma', cont: 'cont', enmasc: 'enMasc', tcolor: 'color', tcolor2: 'color2' }[id] || id; O[k] = v; guardaO(); if (fin && ['forma', 'grad', 'enmasc'].includes(id)) pintaPanel(); if (['tam'].includes(id)) F.pinta(); }
  document.addEventListener('input', e => { if (e.target.type === 'range' || e.target.tagName === 'TEXTAREA' || e.target.type === 'color') campo(e.target, false); });
  document.addEventListener('change', e => campo(e.target, true));
  EXT.tecla = e => { const m = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (m && k === 'a') { selTodo(); return true; } if (m && k === 'd') { fijaSel(null); return true; } if (m && e.shiftKey && k === 'i') { selInvierte(); return true; } if (m && k === 'j') { if (EXT.sel) aCapa(); return true; } if (m && k === 't') { F.pon('transformar'); return true; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && EXT.sel) { vaciaSel(); return true; }
    if (F.herr === 'transformar' && TF) { if (e.key === 'Enter') { tfAplica(); return true; } if (e.key === 'Escape') { tfCancela(); F.pon('mano'); return true; } }
    if (!m && (e.key === '[' || e.key === ']') && ['pincel', 'borrador', 'tampon', 'corrector'].includes(F.herr)) { O.tam = Math.max(1, Math.min(400, Math.round(O.tam * (e.key === ']' ? 1.2 : 1 / 1.2)))); guardaO(); pintaPanel(); F.pinta(); return true; }
    if (e.key === 'Escape' && EXT.sel && !TF) { fijaSel(null); return true; } return false; };
  F.pintaTab();
  window.ADFOTO.herr = { O, fijaSel, selTodo, selInvierte, varita: (x, y) => fijaSel(varita(x, y)), rellenaSel, vaciaSel, aCapa, mascNueva, mascAplica, textoNuevo, tfEmpieza, tfAplica, get TF() { return TF; } };
})();
