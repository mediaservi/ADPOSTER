/* ADPOSTER · editor de composiciones (v1.1). Se apoya en el gestor (window.ADG) y en el motor de escenas (window.ADESCENA).
   · Lienzo: cada pieza de la escena se selecciona, se mueve, se escala y se gira con el ratón o el dedo; imán a bordes, centros y otras piezas;
     teclado (flechas, Supr, Ctrl+D, Ctrl+C/V, Ctrl+Z/Y); deshacer y rehacer; «Probar» la pone en el reproductor de verdad.
   · Pestaña PIEZAS: añadir piezas, propiedades de la seleccionada y capas.   · Pestaña ESCENA: fondo, duración, temporada y transición.
   · Tira de escenas bajo el lienzo.   · Galería de plantillas (plantillas.js).
   La biblioteca de archivos y el calendario están en gestion.js.
   Licencia GPL-3.0 · mediaservi.com */
(() => {
  'use strict';
  const G = window.ADG, A = window.ADESCENA, PL = window.ADPLANT; if (!G || !A || !PL) return;
  const { T, TX, $, esc, tecla, campo, reset, lim, copia } = G, P = () => G.P();
  Object.assign(TX, { 'Carteles': ['Posters', 'Cartells'], 'Composición': ['Composition', 'Composició'], 'escenas': ['scenes', 'escenes'], 'piezas': ['pieces', 'peces'], 'Piezas': ['Pieces', 'Peces'], 'Escena': ['Scene', 'Escena'], 'Biblioteca': ['Library', 'Biblioteca'], 'Calendario': ['Calendar', 'Calendari'],
    'Programar por fechas': ['Schedule by date', 'Programa per dates'], 'Qué lista sale cada día y a cada hora, en todos los displays o solo en un grupo.': ['Which list plays each day and hour, on every display or just one group.', 'Quina llista surt cada dia i a cada hora, a tots els displays o només en un grup.'],
    'Imán': ['Snap', 'Imant'], 'Deshacer': ['Undo', 'Desfés'], 'Rehacer': ['Redo', 'Refés'], 'Probar': ['Play', 'Prova'], 'Editar': ['Edit', 'Edita'], 'Añadir pieza': ['Add a piece', 'Afegeix una peça'],
    'Texto': ['Text', 'Text'], 'Imagen': ['Image', 'Imatge'], 'Vídeo': ['Video', 'Vídeo'], 'Zona': ['Zone', 'Zona'], 'Forma': ['Shape', 'Forma'], 'Reloj': ['Clock', 'Rellotge'], 'Fecha': ['Date', 'Data'], 'El tiempo': ['Weather', 'El temps'], 'Noticias': ['News', 'Notícies'], 'QR': ['QR', 'QR'], 'Web': ['Web', 'Web'],
    'Toca una pieza en el lienzo para cambiarla, o añade una nueva.': ['Tap a piece on the canvas to change it, or add a new one.', 'Toca una peça al llenç per canviar-la, o afegeix-ne una de nova.'],
    'escribe el texto': ['type the text', 'escriu el text'], 'Tipo de letra': ['Typeface', 'Tipus de lletra'], 'Tamaño': ['Size', 'Mida'], 'Ajustar a la caja': ['Fit to box', 'Ajusta a la caixa'], 'Fina': ['Light', 'Fina'], 'Negrita': ['Bold', 'Negreta'], 'Negra': ['Black', 'Negra'],
    'Alineación': ['Alignment', 'Alineació'], 'Color': ['Colour', 'Color'], 'Mayúsculas': ['Uppercase', 'Majúscules'], 'Cursiva': ['Italic', 'Cursiva'], 'Sombra': ['Shadow', 'Ombra'], 'letras': ['spacing', 'lletres'], 'líneas': ['lines', 'línies'], 'relleno': ['padding', 'farcit'],
    'Caja': ['Box', 'Caixa'], 'Fondo de la caja': ['Box background', 'Fons de la caixa'], 'sin fondo': ['no background', 'sense fons'], 'esquinas': ['corners', 'cantonades'], 'borde': ['border', 'vora'], 'Borde': ['Border', 'Vora'], 'opacidad': ['opacity', 'opacitat'], 'giro': ['rotation', 'gir'],
    'Entrada': ['Entrance', 'Entrada'], 'ninguna': ['none', 'cap'], 'aparece': ['fade', 'apareix'], 'sube': ['up', 'puja'], 'baja': ['down', 'baixa'], 'izquierda': ['left', 'esquerra'], 'derecha': ['right', 'dreta'], 'retardo': ['delay', 'retard'],
    'Duplicar': ['Duplicate', 'Duplica'], 'Al frente': ['To front', 'Al davant'], 'Al fondo': ['To back', 'Al fons'], 'Capas': ['Layers', 'Capes'], 'Bloquear': ['Lock', 'Bloqueja'], 'Ocultar': ['Hide', 'Amaga'], 'Posición y tamaño': ['Position & size', 'Posició i mida'],
    'Elegir': ['Choose', 'Tria'], 'Subir': ['Upload', 'Puja'], 'o su dirección https://…': ['or its https://… address', 'o la seva adreça https://…'],
    'Cubrir': ['Cover', 'Cobreix'], 'Contener': ['Contain', 'Conté'], 'Filtro': ['Filter', 'Filtre'], 'gris': ['grey', 'gris'], 'sepia': ['sepia', 'sèpia'], 'oscuro': ['dark', 'fosc'], 'claro': ['bright', 'clar'], 'desenfoque': ['blur', 'desenfoc'],
    'Carpetas que pasan por la zona': ['Folders shown in the zone', 'Carpetes que passen per la zona'], 'cada': ['every', 'cada'], 'Rectángulo': ['Rectangle', 'Rectangle'], 'Elipse': ['Ellipse', 'El·lipse'], 'Degradado': ['Gradient', 'Degradat'], 'Segundo color': ['Second colour', 'Segon color'], 'ángulo': ['angle', 'angle'],
    'Digital': ['Digital', 'Digital'], 'Analógico': ['Analogue', 'Analògic'], 'Segundos': ['Seconds', 'Segons'], '12 h': ['12 h', '12 h'], 'Larga': ['Long', 'Llarga'], 'Corta': ['Short', 'Curta'], 'Día': ['Day', 'Dia'], 'Número': ['Number', 'Número'], 'Mes': ['Month', 'Mes'],
    'ciudad': ['city', 'ciutat'], 'Buscar': ['Search', 'Cerca'], 'Previsión': ['Forecast', 'Previsió'], 'En fila': ['In a row', 'En fila'], 'En columna': ['Stacked', 'En columna'], 'No encuentro esa ciudad': ['City not found', 'No trobo aquesta ciutat'], 'Datos del tiempo: Open-Meteo.': ['Weather data: Open-Meteo.', 'Dades del temps: Open-Meteo.'],
    'RSS: https://… o noticias.xml': ['RSS: https://… or news.xml', 'RSS: https://… o noticies.xml'], 'Lista': ['List', 'Llista'], 'De uno en uno': ['One by one', "D'un en un"], 'titulares': ['headlines', 'titulars'], 'Solo funcionan los canales que permiten leerse desde otra web.': ['Only feeds that allow being read from another site will work.', 'Només funcionen els canals que permeten llegir-se des d’un altre web.'],
    'https://… destino del QR': ['https://… QR target', 'https://… destí del QR'], 'Fondo del código': ['Code background', 'Fons del codi'], 'https://… página web': ['https://… web page', 'https://… pàgina web'], 'Muchas webs no dejan mostrarse dentro de otra: pruébala antes.': ['Many sites refuse to be shown inside another one: test it first.', 'Molts webs no es deixen mostrar dins d’un altre: prova-la abans.'],
    'nombre de la escena': ['scene name', "nom de l'escena"], 'Plantillas': ['Templates', 'Plantilles'], 'Fondo': ['Background', 'Fons'], 'Malla': ['Mesh', 'Malla'], 'Trama': ['Pattern', 'Trama'], 'puntos': ['dots', 'punts'], 'rejilla': ['grid', 'reixeta'], 'viñeta': ['vignette', 'vinyeta'], 'oscurecer': ['darken', 'enfosqueix'],
    'Temporada': ['Season', 'Temporada'], 'Solo sale entre estas fechas (vacío: siempre).': ['Shown only between these dates (empty: always).', 'Només surt entre aquestes dates (buit: sempre).'], 'desde': ['from', 'des de'], 'hasta': ['until', 'fins a'], 'Transición entre escenas': ['Transition between scenes', 'Transició entre escenes'],
    'Nueva escena': ['New scene', 'Nova escena'], 'Añadir como escena nueva': ['Add as a new scene', 'Afegeix com a escena nova'], 'Sustituir la escena actual': ['Replace the current scene', "Substitueix l'escena actual"], 'Todas': ['All', 'Totes'], 'Cerrar': ['Close', 'Tanca'], 'Elige una plantilla': ['Pick a template', 'Tria una plantilla'],
    'Suelta la imagen para añadirla': ['Drop the image to add it', 'Deixa la imatge per afegir-la'], 'Izquierda': ['Left', 'Esquerra'], 'Derecha': ['Right', 'Dreta'], 'Arriba': ['Top', 'A dalt'] });

  /* ---------- estado ---------- */
  let iE = 0, selId = '', mont = null, iman = G.lee('g-iman') !== false, probando = false, porta = null;
  const minis = { firma: '', m: [] }, HIST = {};
  const ES = () => P().escenas, E = () => ES()[iE], PZ = () => (E() ? E().piezas.find(z => z.id === selId) : null), hor = () => P().formato === 'horizontal';
  const urlDe = s => { s = String(s || ''); if (s.indexOf('m:') === 0) return G.B.medios[s.slice(2)] || ''; if (/^https:\/\//i.test(s)) return s; return G.urlAsset(s); };
  const ctx = o => Object.assign({ vivo: false, red: true, edita: true, lang: G.lang, man: G.MAN, url: urlDe }, o);
  const red = (v, n) => { const k = Math.pow(10, n == null ? 2 : n); return Math.round(v * k) / k; };
  const el = (t, c) => { const e = document.createElement(t); if (c) e.className = c; return e; };
  const NOM = { texto: 'Texto', imagen: 'Imagen', video: 'Vídeo', zona: 'Zona', forma: 'Forma', reloj: 'Reloj', fecha: 'Fecha', tiempo: 'El tiempo', rss: 'Noticias', qr: 'QR', web: 'Web' };
  const ICO = { texto: 'T', imagen: '▣', video: '▶', zona: '▤', forma: '■', reloj: '◷', fecha: '▦', tiempo: '☀', rss: '≋', qr: '▩', web: '◎' };
  const COL = ['#ffffff', '#000000', '#15151b', '#f6e7c1', '#ffb000', '#ffd60a', '#e63946', '#ff2d75', '#7b2cbf', '#3a0ca3', '#2f7de8', '#4cc9f0', '#06d6a0', '#39ff88'];
  const LIM = { x: [-100, 200], y: [-100, 200], w: [1, 300], h: [1, 300], r: [-180, 180], o: [.05, 1], tam: [.5, 80], esp: [-.1, 1], lh: [.7, 6], pad: [0, 12], radio: [0, 50], borde: [0, 10], seg: [2, 600], n: [1, 8], ret: [0, 10], ang: [0, 360], osc: [0, .9], a: [0, 360], lat: [-90, 90], lon: [-180, 180] };
  const DEFN = { o: 1, r: 0, tam: 7, esp: 0, lh: 1.08, pad: 0, radio: 0, borde: 0, seg: 8, n: 4, ret: 0, ang: 135, osc: 0, a: 160 };

  /* ---------- deshacer y rehacer (por lista) ---------- */
  const hist = () => HIST[G.sel] || (HIST[G.sel] = { u: [], r: [] });
  function antes() { if (!G.ESCM(P())) return; const h = hist(), j = JSON.stringify(ES()); if (h.u[h.u.length - 1] !== j) { h.u.push(j); if (h.u.length > 60) h.u.shift(); } h.r.length = 0; }
  function vuelve(de, a) { const h = hist(); if (!h[de].length) return; h[a].push(JSON.stringify(ES())); P().escenas = JSON.parse(h[de].pop()); if (!PZ()) selId = ''; todo(); }
  const todo = () => { asegura(); G.toca(); render(); tira(); G.pintaT(); G.pintaL(); G.pintaBarra(); };
  const hecho = (ligero) => { G.toca(); render(); tiraLuego(); if (!ligero) G.pintaT(); };

  /* ---------- el lienzo ---------- */
  function asegura() { const p = P(); if (!G.ESCM(p)) return; if (!Array.isArray(p.escenas)) p.escenas = []; if (!p.escenas.length) p.escenas.push(PL.haz('lienzo', hor(), G.lang)); iE = lim(iE, 0, p.escenas.length - 1); }
  function render() { const on = G.ESCM(P()), ed = $('#ed'), d = $('#display'); d.classList.toggle('probando', probando); document.body.classList.toggle('compone', on); ed.hidden = !on || probando; $('#tira').hidden = !on;
    if (!on) { if (mont) { mont.destruye(); mont = null; } return; } asegura(); if (probando) return;
    if (!mont) mont = A.monta($('#ed-esc'), E(), ctx()); else mont.pon(E()); capa(); }
  function remonta() { if (mont) { mont.destruye(); mont = null; } minis.firma = ''; render(); tira(); }
  /* la caja de selección, con sus ocho asas y la de girar */
  function capa(lineas) { const c = $('#ed-capa'), z = PZ(); let b = c.querySelector('.sel'); c.querySelectorAll('.guia').forEach(g => g.remove());
    if (!z || probando) { b && b.remove(); return; }
    if (!b) { b = el('div', 'sel'); b.innerHTML = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(h => '<i data-h="' + h + '"></i>').join('') + '<i data-h="rot"></i><b></b>'; c.appendChild(b); }
    const s = b.style; s.left = z.x + '%'; s.top = z.y + '%'; s.width = z.w + '%'; s.height = z.h + '%'; s.transform = z.r ? 'rotate(' + z.r + 'deg)' : ''; b.classList.toggle('bloq', !!z.bloq); b.lastChild.textContent = porta ? (porta.modo === 'rot' ? Math.round(z.r || 0) + '°' : porta.modo === 'mueve' ? red(z.x, 1) + ' · ' + red(z.y, 1) : red(z.w, 1) + ' × ' + red(z.h, 1)) : '';
    (lineas || []).forEach(l => { const g = el('div', 'guia ' + (l[0] === 'x' ? 'v' : 'h')); g.style[l[0] === 'x' ? 'left' : 'top'] = l[1] + '%'; c.appendChild(g); }); }
  function elige(id, sinTab) { selId = id || ''; capa(); if (id && G.tab !== 'piezas' && !sinTab) G.ACC.tab('piezas'); else if (G.tab === 'piezas') G.pintaT(); }

  /* ---------- arrastrar: mover, escalar y girar ---------- */
  const ed = $('#ed');
  ed.addEventListener('pointerdown', e => { if (probando || e.button || !G.ESCM(P())) return; const R = $('#ed-esc').getBoundingClientRect(), h = e.target.closest && e.target.closest('[data-h]'); let z = PZ(), modo = '';
    if (h && z && !z.bloq) modo = h.dataset.h;
    else { const bajo = document.elementsFromPoint(e.clientX, e.clientY).find(x => x.classList && x.classList.contains('pz') && $('#ed-esc').contains(x)), zz = bajo && E().piezas.find(q => q.id === bajo.dataset.id);
      if (!zz) { if (selId) elige(''); return; } if (zz.id !== selId) elige(zz.id); z = zz; if (z.bloq) return; modo = 'mueve'; }
    e.preventDefault(); try { ed.setPointerCapture(e.pointerId); } catch (x) {} porta = { modo, x0: e.clientX, y0: e.clientY, R, ini: copia(z), movido: false, id: e.pointerId }; });
  ed.addEventListener('pointermove', e => { if (!porta || e.pointerId !== porta.id) return; const z = PZ(); if (!z) return; const { R, ini, modo } = porta, dx = e.clientX - porta.x0, dy = e.clientY - porta.y0;
    if (!porta.movido) { if (Math.abs(dx) + Math.abs(dy) < 3) return; porta.movido = true; antes(); ed.classList.add('arrastra'); }
    let lineas = [];
    if (modo === 'mueve') { z.x = ini.x + dx / R.width * 100; z.y = ini.y + dy / R.height * 100; if (iman && !e.altKey) lineas = pega(z, R); z.x = red(z.x); z.y = red(z.y); }
    else if (modo === 'rot') { const cx = R.left + (ini.x + ini.w / 2) / 100 * R.width, cy = R.top + (ini.y + ini.h / 2) / 100 * R.height; let a = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI + 90; if (a > 180) a -= 360; if (iman || e.shiftKey) { const q = Math.round(a / 15) * 15; if (e.shiftKey || Math.abs(a - q) < 4) a = q; } z.r = Math.round(a) || 0; }
    else { const hx = modo.indexOf('e') >= 0 ? 1 : modo.indexOf('w') >= 0 ? -1 : 0, hy = modo.indexOf('s') >= 0 ? 1 : modo.indexOf('n') >= 0 ? -1 : 0, a = (ini.r || 0) * Math.PI / 180, co = Math.cos(a), si = Math.sin(a);
      const W = ini.w / 100 * R.width, H = ini.h / 100 * R.height, lx = dx * co + dy * si, ly = -dx * si + dy * co; let nw = Math.max(8, W + hx * lx), nh = Math.max(8, H + hy * ly);
      if (hx && hy && (e.shiftKey || ['imagen', 'video', 'qr'].includes(z.t) && !e.altKey && z.t === 'qr')) { const k = Math.max(nw / W, nh / H); nw = W * k; nh = H * k; }
      if (iman && !e.altKey && !ini.r) { const px = v => Math.round(v / R.width * 200) / 200 * R.width, py = v => Math.round(v / R.height * 200) / 200 * R.height; if (hx) nw = Math.max(8, px(nw)); if (hy) nh = Math.max(8, py(nh)); }
      const cx = (ini.x + ini.w / 2) / 100 * R.width + (hx * (nw - W) / 2) * co - (hy * (nh - H) / 2) * si, cy = (ini.y + ini.h / 2) / 100 * R.height + (hx * (nw - W) / 2) * si + (hy * (nh - H) / 2) * co;
      z.w = red(nw / R.width * 100); z.h = red(nh / R.height * 100); z.x = red((cx - nw / 2) / R.width * 100); z.y = red((cy - nh / 2) / R.height * 100); }
    mont && mont.pon(E()); capa(lineas); });
  const suelta = e => { if (!porta || (e && e.pointerId !== porta.id)) return; const m = porta.movido; porta = null; ed.classList.remove('arrastra'); capa(); if (m) hecho(); };
  ed.addEventListener('pointerup', suelta); ed.addEventListener('pointercancel', suelta);
  ed.addEventListener('dblclick', () => { const z = PZ(); if (z && z.t === 'texto') { const t = $('#pz-tx'); if (t) { t.focus(); t.select(); } } });
  /* imán: los bordes y el centro de la pieza se pegan a los del lienzo y a los de las demás piezas */
  function pega(z, R) { const ux = 6 / R.width * 100, uy = 6 / R.height * 100, otras = E().piezas.filter(o => o.id !== z.id && !o.oculta && !o.r), L = [];
    const eje = (k, t, u, d) => { const dian = [0, 50, 100].concat(otras.flatMap(o => [o[k], o[k] + o[t] / 2, o[k] + o[t]])), mios = [z[k], z[k] + z[t] / 2, z[k] + z[t]]; let mejor = null; mios.forEach(m => dian.forEach(c => { const dd = c - m; if (Math.abs(dd) <= u && (!mejor || Math.abs(dd) < Math.abs(mejor[0]))) mejor = [dd, c]; }));
      if (mejor) { z[k] += mejor[0]; L.push([d, mejor[1]]); } else z[k] = Math.round(z[k] * 2) / 2; };
    eje('x', 'w', ux, 'x'); eje('y', 'h', uy, 'y'); return L; }
  /* teclado */
  let porta2 = null;
  document.addEventListener('keydown', e => { if (!G.ESCM(P()) || probando || !$('#modal').hidden) return; const t = e.target, enCampo = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable), ctrl = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (ctrl && k === 'z' && !enCampo) { e.preventDefault(); e.shiftKey ? vuelve('r', 'u') : vuelve('u', 'r'); return; } if (ctrl && k === 'y' && !enCampo) { e.preventDefault(); vuelve('r', 'u'); return; }
    if (enCampo) return; const z = PZ();
    if (ctrl && k === 'v' && porta2) { e.preventDefault(); antes(); const n = copia(porta2); n.id = A.id(); n.x = red(n.x + 3); n.y = red(n.y + 3); porta2 = copia(n); E().piezas.push(n); selId = n.id; hecho(); return; }
    if (!z) return;
    if (k === 'escape') { elige(''); return; } if (ctrl && k === 'c') { porta2 = copia(z); return; } if (ctrl && k === 'd') { e.preventDefault(); ACC.pzDup(); return; }
    if (k === 'delete' || k === 'backspace') { e.preventDefault(); ACC.pzBorra(); return; }
    const F = { arrowleft: ['x', -1], arrowright: ['x', 1], arrowup: ['y', -1], arrowdown: ['y', 1] }[k]; if (F && !z.bloq) { e.preventDefault(); if (!e.repeat) antes(); z[F[0]] = red(z[F[0]] + F[1] * (e.shiftKey ? 2.5 : .5)); hecho(true); if (G.tab === 'piezas') geoPinta(); } });
  /* soltar una imagen del ordenador sobre el lienzo la añade como pieza */
  $('#lienzo').addEventListener('dragover', e => { if (G.ESCM(P()) && e.dataTransfer && [...e.dataTransfer.types].includes('Files')) { e.preventDefault(); $('#lienzo').classList.add('sobre-img'); } });
  $('#lienzo').addEventListener('dragleave', () => $('#lienzo').classList.remove('sobre-img'));
  $('#lienzo').addEventListener('drop', e => { $('#lienzo').classList.remove('sobre-img'); const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (!f || !G.ESCM(P()) || !/^image\//.test(f.type) || !window.ADGEST) return; e.preventDefault(); window.ADGEST.sube(f).then(k => { if (!k) return; antes(); const n = A.nueva('imagen', hor()); n.src = 'm:' + k; E().piezas.push(n); selId = n.id; hecho(); G.ACC.tab('piezas'); }); });

  /* ---------- tira de escenas ---------- */
  let tT = 0; const tiraLuego = () => { clearTimeout(tT); tT = setTimeout(tira, 350); };
  function tira() { const t = $('#tira'); if (!G.ESCM(P())) { minis.m.forEach(m => m.destruye()); minis.m = []; minis.firma = ''; t.textContent = ''; return; }
    const es = ES(), f = G.sel + '|' + G.lang + '|' + hor() + '|' + es.map(e => e.id).join(',');
    if (f !== minis.firma) { minis.m.forEach(m => m.destruye()); minis.m = []; minis.firma = f; t.textContent = '';
      es.forEach((e, i) => { const b = el('button', 'mini' + (hor() ? ' hor' : '')); b.type = 'button'; b.dataset.a = 'escSel'; b.dataset.v = i; const c = el('span', 'mm'), d = el('span'), n = el('span', 'mn'); c.appendChild(d); b.appendChild(c); b.appendChild(n); t.appendChild(b); minis.m.push(A.monta(d, e, ctx({ red: false, mini: true }))); });
      const mas = el('button', 'mini mas' + (hor() ? ' hor' : '')); mas.type = 'button'; mas.dataset.a = 'plant'; mas.title = T('Nueva escena'); mas.setAttribute('aria-label', T('Nueva escena')); mas.innerHTML = '<span class="mm">+</span><span class="mn">' + T('Plantillas') + '</span>'; t.appendChild(mas); }
    else if (minis.m[iE]) minis.m[iE].pon(E());
    [...t.querySelectorAll('.mini:not(.mas)')].forEach((b, i) => { b.classList.toggle('on', i === iE); b.setAttribute('aria-pressed', i === iE); b.lastChild.textContent = (i + 1) + ' · ' + (es[i].seg || 12) + ' s'; b.title = es[i].n || ''; }); const on = t.querySelector('.mini.on'); if (on && on.scrollIntoView) { const r = on.getBoundingClientRect(), q = t.getBoundingClientRect(); if (r.left < q.left || r.right > q.right) t.scrollLeft += r.left - q.left - 20; } }

  /* ---------- piezas de la interfaz ---------- */
  const st = (a, k, txt, d) => `<div class="fila"><button type="button" class="tecla rd" data-a="${a}" data-v="${k}:${-d}" aria-label="−">−</button><div class="lcd">${txt}</div><button type="button" class="tecla rd" data-a="${a}" data-v="${k}:${d}" aria-label="+">+</button></div>`;
  const st2 = (a, k, txt, d) => `<button type="button" class="tecla rd" data-a="${a}" data-v="${k}:${-d}" aria-label="−">−</button><div class="lcd">${txt}</div><button type="button" class="tecla rd" data-a="${a}" data-v="${k}:${d}" aria-label="+">+</button>`;
  const colores = (a, k, act, nada, dat) => `<div class="paleta">${nada ? `<button type="button" class="sw nada${!act ? ' on' : ''}" data-a="${a}" data-v="${k}:" aria-label="${T(nada)}" title="${T(nada)}" aria-pressed="${!act}"></button>` : ''}${COL.map(c => `<button type="button" class="sw${(act || '').toLowerCase() === c ? ' on' : ''}" data-a="${a}" data-v="${k}:${c}" style="--c:${c}" aria-label="${c}" aria-pressed="${(act || '').toLowerCase() === c}"></button>`).join('')}<input type="color" class="sw libre" ${dat}="${k}" value="${/^#[0-9a-f]{6}/i.test(act || '') ? act.slice(0, 7) : '#ffffff'}" aria-label="${T('Color')}"></div>`;
  const op = (a, k, v, txt, act, cls) => `<button type="button" class="tecla${act ? ' on' : ''}${cls ? ' ' + cls : ''}" data-a="${a}" data-v="${k}:${esc(v)}" aria-pressed="${!!act}"><i class="led"></i><span>${txt}</span></button>`;
  const alt = (k, txt, act) => `<button type="button" class="tecla${act ? ' on' : ''}" data-a="pzAlt" data-v="${k}" aria-pressed="${!!act}"><i class="led"></i><span>${txt}</span></button>`;
  const fuentes = z => `<div class="rej fuentes">${A.FUENTES.map(f => `<button type="button" class="tecla${(z.fam || 'Inter') === f[1] ? ' on' : ''}" data-a="pzT" data-v="fam:${esc(f[1])}" aria-pressed="${(z.fam || 'Inter') === f[1]}" style="font-family:'${f[1]}',Inter,sans-serif"><span>${f[0]}</span></button>`).join('')}</div>`;
  const nombrePz = z => { const s = z.t === 'texto' ? String(z.tx || '').replace(/\s+/g, ' ').slice(0, 26) : z.t === 'imagen' || z.t === 'video' ? String(z.src || '').replace(/^.*\//, '').replace(/^m:.*/, '').slice(0, 22) : z.t === 'zona' ? (z.carp || []).join(', ').slice(0, 22) : z.t === 'rss' || z.t === 'qr' || z.t === 'web' ? String(z.url || '').replace(/^https?:\/\//, '').slice(0, 22) : z.t === 'tiempo' ? String(z.lugar || '') : ''; return T(NOM[z.t]) + (s ? ' · ' + s : ''); };
  const geoHtml = z => `<div class="fila geo" id="pz-geo">${['x', 'y', 'w', 'h'].map(k => `<label><span>${k === 'w' ? '↔' : k === 'h' ? '↕' : k.toUpperCase()}</span><input type="number" class="campo" data-pz="${k}" value="${red(z[k], 1)}" step="0.5" aria-label="${k}"></label>`).join('')}</div>`;
  function geoPinta() { const z = PZ(), g = $('#pz-geo'); if (!z || !g) return; g.querySelectorAll('input').forEach(i => { if (i !== document.activeElement) i.value = red(z[i.dataset.pz], 1); }); }
  const PROPIO = {
    texto: z => `<textarea class="campo area" id="pz-tx" data-pz="tx" rows="3" placeholder="${T('escribe el texto')}" aria-label="${T('Texto')}" spellcheck="false">${esc(z.tx || '')}</textarea>
      <h2>${T('Tipo de letra')}</h2>${fuentes(z)}${['Inter', 'Montserrat'].includes(z.fam || 'Inter') ? `<div class="fila">${op('pzT', 'peso', 400, T('Fina'), +z.peso === 400)}${(z.fam || 'Inter') === 'Inter' ? op('pzT', 'peso', 700, T('Negrita'), +z.peso === 700) : ''}${op('pzT', 'peso', 800, T('Negra'), ![400, 700].includes(+z.peso) || ((z.fam || 'Inter') !== 'Inter' && +z.peso !== 400))}</div>` : ''}
      <h2>${T('Tamaño')}</h2><div class="fila">${alt('auto', T('Ajustar a la caja'), z.auto !== false)}${z.auto === false ? st2('pzPaso', 'tam', red(z.tam || 7, 1), .5) : ''}</div>
      <h2>${T('Alineación')}</h2><div class="fila ali">${[['izq', '⇤', 'Izquierda'], ['cen', '↔', 'Centro'], ['der', '⇥', 'Derecha']].map(a => `<button type="button" class="tecla${(z.ali || 'cen') === a[0] ? ' on' : ''}" data-a="pzT" data-v="ali:${a[0]}" aria-pressed="${(z.ali || 'cen') === a[0]}" aria-label="${T(a[2])}" title="${T(a[2])}">${a[1]}</button>`).join('')}<i class="sep"></i>${[['arr', '⤒', 'Arriba'], ['cen', '↕', 'Centro'], ['aba', '⤓', 'Abajo']].map(a => `<button type="button" class="tecla${(z.val || 'cen') === a[0] ? ' on' : ''}" data-a="pzT" data-v="val:${a[0]}" aria-pressed="${(z.val || 'cen') === a[0]}" aria-label="${T(a[2])}" title="${T(a[2])}">${a[1]}</button>`).join('')}</div>
      <h2>${T('Color')}</h2>${colores('pzT', 'col', z.col || '#ffffff', '', 'data-pz')}
      <div class="fila">${alt('may', T('Mayúsculas'), z.may)}${alt('cur', T('Cursiva'), z.cur)}${alt('stx', T('Sombra'), z.stx)}</div>
      <div class="fila">${st2('pzPaso', 'esp', red(z.esp || 0, 2) + ' <small>' + T('letras') + '</small>', .02)}</div><div class="fila">${st2('pzPaso', 'lh', red(z.lh || 1.08, 2) + ' <small>' + T('líneas') + '</small>', .05)}</div>`,
    imagen: z => `<div class="fila"><button type="button" class="tecla" data-a="pzElige" data-v="img">${T('Elegir')}</button><button type="button" class="tecla" data-a="pzSube">${T('Subir')}</button></div>${campo('pz-src', /^https:/i.test(z.src || '') ? z.src : '', T('o su dirección https://…'), ' maxlength="400" inputmode="url" data-pz="src"')}
      <div class="fila">${op('pzT', 'aj', 'cubrir', T('Cubrir'), z.aj !== 'contener')}${op('pzT', 'aj', 'contener', T('Contener'), z.aj === 'contener')}</div>
      <h2>${T('Filtro')}</h2><div class="rej tres">${['', 'gris', 'sepia', 'oscuro', 'claro', 'desenfoque'].map(f => op('pzT', 'fil', f, T(f || 'ninguna'), (z.fil || '') === f)).join('')}</div>`,
    video: z => `<div class="fila"><button type="button" class="tecla" data-a="pzElige" data-v="video">${T('Elegir')}</button></div>${campo('pz-src', /^https:/i.test(z.src || '') ? z.src : '', T('o su dirección https://…'), ' maxlength="400" inputmode="url" data-pz="src"')}
      <div class="fila">${op('pzT', 'aj', 'cubrir', T('Cubrir'), z.aj !== 'contener')}${op('pzT', 'aj', 'contener', T('Contener'), z.aj === 'contener')}</div>`,
    zona: z => `<h2>${T('Carpetas que pasan por la zona')}</h2><div class="rej ancha">${G.carpetas().map(c => tecla('pzCarp', c, esc(c), (z.carp || []).includes(c), `<small>${G.MAN.carpetas[c].length}</small>`)).join('')}</div>
      ${st('pzPaso', 'seg', (z.seg || 8) + ' s <small>' + T('cada') + '</small>', 1)}<div class="fila">${op('pzT', 'aj', 'cubrir', T('Cubrir'), z.aj === 'cubrir')}${op('pzT', 'aj', 'contener', T('Contener'), z.aj !== 'cubrir')}</div>`,
    forma: z => `<div class="fila">${op('pzT', 'f', 'rect', T('Rectángulo'), z.f !== 'elipse')}${op('pzT', 'f', 'elipse', T('Elipse'), z.f === 'elipse')}</div><h2>${T('Color')}</h2>${colores('pzT', 'col', z.col || '#ffb000', '', 'data-pz')}
      <h2>${T('Degradado')}</h2>${colores('pzT', 'col2', z.col2 || '', 'ninguna', 'data-pz')}${z.col2 ? st('pzPaso', 'ang', (z.ang == null ? 135 : z.ang) + '° <small>' + T('ángulo') + '</small>', 15) : ''}`,
    reloj: z => `<div class="fila">${op('pzT', 'est', 'digital', T('Digital'), z.est !== 'analogico')}${op('pzT', 'est', 'analogico', T('Analógico'), z.est === 'analogico')}</div><div class="fila">${alt('sg', T('Segundos'), z.sg)}${z.est === 'analogico' ? '' : alt('h12', T('12 h'), z.h12)}</div>${z.est === 'analogico' ? '' : `<h2>${T('Tipo de letra')}</h2>${fuentes(z)}`}<h2>${T('Color')}</h2>${colores('pzT', 'col', z.col || '#ffffff', '', 'data-pz')}`,
    fecha: z => `<div class="rej tres">${[['larga', 'Larga'], ['corta', 'Corta'], ['dia', 'Día'], ['num', 'Número'], ['mes', 'Mes']].map(f => op('pzT', 'fmt', f[0], T(f[1]), (z.fmt || 'larga') === f[0])).join('')}</div><div class="fila">${alt('may', T('Mayúsculas'), z.may !== false)}</div><h2>${T('Tipo de letra')}</h2>${fuentes(z)}<h2>${T('Color')}</h2>${colores('pzT', 'col', z.col || '#ffffff', '', 'data-pz')}`,
    tiempo: z => `<div class="fila">${campo('pz-lugar', z.lugar || '', T('ciudad'), ' maxlength="40" data-pz="lugar"')}<button type="button" class="tecla" data-a="pzCiudad" style="flex:none">${T('Buscar')}</button></div><div class="fila geo">${['lat', 'lon'].map(k => `<label><span>${k}</span><input type="number" class="campo" data-pz="${k}" value="${red(+z[k] || 0, 3)}" step="0.01" aria-label="${k}"></label>`).join('')}</div>
      <div class="fila">${alt('dias', T('Previsión'), z.dias !== false)}${op('pzT', 'dis', '', T('En fila'), z.dis !== 'col')}${op('pzT', 'dis', 'col', T('En columna'), z.dis === 'col')}</div><h2>${T('Tipo de letra')}</h2>${fuentes(z)}<h2>${T('Color')}</h2>${colores('pzT', 'col', z.col || '#ffffff', '', 'data-pz')}<div class="nota">${T('Datos del tiempo: Open-Meteo.')}</div>`,
    rss: z => `${campo('pz-url', z.url || '', T('RSS: https://… o noticias.xml'), ' maxlength="300" inputmode="url" data-pz="url"')}<div class="rej tres">${[['cinta', 'Cinta'], ['lista', 'Lista'], ['uno', 'De uno en uno']].map(f => op('pzT', 'modo', f[0], T(f[1]), (z.modo || 'cinta') === f[0])).join('')}</div>
      ${z.modo === 'lista' ? st('pzPaso', 'n', (z.n || 4) + ' <small>' + T('titulares') + '</small>', 1) : ''}${z.modo === 'lista' || z.modo === 'uno' ? st('pzPaso', 'tam', red(z.tam || 3, 1) + ' <small>' + T('Tamaño') + '</small>', .2) : ''}<h2>${T('Tipo de letra')}</h2>${fuentes(z)}<h2>${T('Color')}</h2>${colores('pzT', 'col', z.col || '#ffffff', '', 'data-pz')}<div class="nota">${T('Solo funcionan los canales que permiten leerse desde otra web.')}</div>`,
    qr: z => `${campo('pz-url', z.url || '', T('https://… destino del QR'), ' maxlength="300" inputmode="url" data-pz="url"')}<h2>${T('Color')}</h2>${colores('pzT', 'col', z.col || '#000000', '', 'data-pz')}<h2>${T('Fondo del código')}</h2>${colores('pzT', 'cfondo', z.cfondo || '#ffffff', '', 'data-pz')}`,
    web: z => `${campo('pz-url', z.url || '', T('https://… página web'), ' maxlength="300" inputmode="url" data-pz="url"')}<div class="nota">${T('Muchas webs no dejan mostrarse dentro de otra: pruébala antes.')}</div>`
  };
  G.PINTA.piezas = p => { asegura(); const z = PZ(), ps = E().piezas;
    let h = `<h2>${T('Añadir pieza')}</h2><div class="rej nuevas">${A.TIPOS.map(t => `<button type="button" class="tecla" data-a="pzNueva" data-v="${t}"><b class="ic">${ICO[t]}</b><span>${T(NOM[t])}</span></button>`).join('')}</div>`;
    if (z) h += `<h2>${T(NOM[z.t])}<b class="cuenta">${ps.indexOf(z) + 1}/${ps.length}</b></h2>${PROPIO[z.t](z)}
      <h2>${T('Caja')}</h2>${z.t === 'forma' || z.t === 'qr' ? '' : colores('pzT', 'fondo', z.fondo || '', 'sin fondo', 'data-pz')}<div class="fila">${st2('pzPaso', 'radio', red(z.radio || 0, 1) + ' <small>' + T('esquinas') + '</small>', .5)}</div><div class="fila">${st2('pzPaso', 'borde', red(z.borde || 0, 1) + ' <small>' + T('borde') + '</small>', .1)}${alt('sombra', T('Sombra'), z.sombra)}</div>${z.borde ? colores('pzT', 'bcol', z.bcol || '#ffffff', '', 'data-pz') : ''}
      <div class="fila">${st2('pzPaso', 'o', Math.round((z.o == null ? 1 : z.o) * 100) + ' % <small>' + T('opacidad') + '</small>', .05)}</div><div class="fila">${st2('pzPaso', 'r', (z.r || 0) + '° <small>' + T('giro') + '</small>', 5)}</div>
      <h2>${T('Posición y tamaño')}</h2>${geoHtml(z)}
      <h2>${T('Entrada')}</h2><div class="rej tres">${['', 'aparece', 'sube', 'baja', 'izquierda', 'derecha', 'zoom'].map(a => op('pzT', 'an', a, T(a || 'ninguna'), (z.an || '') === a)).join('')}</div>${z.an ? st('pzPaso', 'ret', red(z.ret || 0, 1) + ' s <small>' + T('retardo') + '</small>', .1) : ''}
      <div class="rej dos"><button type="button" class="tecla" data-a="pzDup">${T('Duplicar')}</button><button type="button" class="tecla reset" data-a="pzBorra">${T('Borrar')}</button><button type="button" class="tecla" data-a="pzOrden" data-v="1">${T('Al frente')}</button><button type="button" class="tecla" data-a="pzOrden" data-v="-1">${T('Al fondo')}</button></div>`;
    else h += `<div class="nota">${T('Toca una pieza en el lienzo para cambiarla, o añade una nueva.')}</div>`;
    h += `<h2>${T('Capas')}<b class="cuenta">${ps.length}</b></h2><div class="capas">${ps.slice().reverse().map(q => `<div class="capa-f${q.id === selId ? ' on' : ''}"><button type="button" class="tecla nom${q.id === selId ? ' on' : ''}" data-a="pzSel" data-v="${q.id}" aria-pressed="${q.id === selId}"><b class="ic">${ICO[q.t]}</b><span>${esc(nombrePz(q))}</span></button><button type="button" class="tecla rd${q.bloq ? ' on' : ''}" data-a="pzBloq" data-v="${q.id}" aria-pressed="${!!q.bloq}" aria-label="${T('Bloquear')}" title="${T('Bloquear')}">🔒</button><button type="button" class="tecla rd${q.oculta ? ' on' : ''}" data-a="pzOculta" data-v="${q.id}" aria-pressed="${!!q.oculta}" aria-label="${T('Ocultar')}" title="${T('Ocultar')}">◌</button></div>`).join('')}</div>${reset('piezas')}`;
    return h; };
  G.PINTA.escena = p => { asegura(); const e = E(), f = e.fondo || (e.fondo = { t: 'color', c: '#15151b' }), ft = ['deg', 'malla', 'img'].includes(f.t) ? f.t : 'color', TIP = ['fundido', 'zoom', 'desliza', 'cortina', 'corte'];
    return `<h2>${T('Escena')}<b class="cuenta">${iE + 1}/${ES().length}</b></h2>${campo('es-n', e.n || '', T('nombre de la escena'), ' maxlength="40" data-es="n"')}${st('escPaso', 'seg', (e.seg || 12) + ' s <small>' + T('Duración') + '</small>', 1)}
      <div class="rej dos"><button type="button" class="tecla pri" data-a="plant">${T('Plantillas')}</button><button type="button" class="tecla" data-a="escDup">${T('Duplicar')}</button><button type="button" class="tecla" data-a="escMueve" data-v="-1"${iE ? '' : ' disabled'}>◀</button><button type="button" class="tecla" data-a="escMueve" data-v="1"${iE < ES().length - 1 ? '' : ' disabled'}>▶</button><button type="button" class="tecla reset" data-a="escBorra"${ES().length > 1 ? '' : ' disabled'} style="grid-column:1/-1">${T('Borrar')}</button></div>
      <h2>${T('Fondo')}</h2><div class="rej dos">${[['color', 'Color'], ['deg', 'Degradado'], ['malla', 'Malla'], ['img', 'Imagen']].map(x => op('foT', 't', x[0], T(x[1]), ft === x[0])).join('')}</div>${colores('foT', 'c', f.c || '#15151b', '', 'data-fo')}
      ${ft === 'deg' || ft === 'malla' ? colores('foT', 'c2', f.c2 || '#3a1c71', '', 'data-fo') : ''}${ft === 'malla' ? colores('foT', 'c3', f.c3 || f.c2 || '#3a1c71', '', 'data-fo') : ''}${ft === 'deg' ? st('foPaso', 'a', (f.a == null ? 160 : f.a) + '° <small>' + T('ángulo') + '</small>', 15) : ''}
      ${ft === 'img' ? `<div class="fila"><button type="button" class="tecla" data-a="foElige">${T('Elegir')}</button><button type="button" class="tecla" data-a="foSube">${T('Subir')}</button></div>${st('foPaso', 'osc', Math.round((f.osc || 0) * 100) + ' % <small>' + T('oscurecer') + '</small>', .05)}` : ''}
      <h2>${T('Trama')}</h2><div class="rej tres">${['', 'puntos', 'lineas', 'rejilla', 'vineta'].map(x => op('foT', 'tr', x, T({ '': 'ninguna', lineas: 'líneas', vineta: 'viñeta' }[x] || x), (f.tr || '') === x)).join('')}</div>
      <h2>${T('Temporada')}</h2><div class="fila fechas"><input type="date" class="campo" data-es="desde" value="${esc(e.desde || '')}" aria-label="${T('desde')}"><input type="date" class="campo" data-es="hasta" value="${esc(e.hasta || '')}" aria-label="${T('hasta')}"></div><div class="nota">${T('Solo sale entre estas fechas (vacío: siempre).')}</div>
      <h2>${T('Transición entre escenas')}</h2><div class="rej tipos">${TIP.map(t => tecla('tipo', t, T(t), p.fundido.tipo === t)).join('')}</div>${G.paso('fseg', `${p.fundido.segundos.toFixed(1)} s`)}
      <h2>${T('Participación del público')}</h2><div class="fila">${tecla('publico', '', T('Lista elegible por el público'), p.publico)}</div>${reset('escena')}`; };

  /* ---------- acciones ---------- */
  const NUMK = Object.keys(LIM).concat(['peso']);
  const pone = (o, k, v) => { if (v === '' && ['fondo', 'col2', 'fil', 'an', 'dis', 'tr'].includes(k)) { delete o[k]; return; } o[k] = NUMK.includes(k) ? (k === 'peso' ? +v : lim(+v || 0, LIM[k][0], LIM[k][1])) : v; };
  const parte = v => { const i = String(v).indexOf(':'); return [v.slice(0, i), v.slice(i + 1)]; };
  const ACC = {
    modo(v) { const p = P(), a = v === 'escenas' ? 'escenas' : 'carteles'; if (p.modo === a) return; const vacia = a === 'escenas' && !(p.escenas || []).length; if (probando) ACC.probar(); G.cambia(q => { q.modo = a; }); iE = 0; selId = ''; remonta(); G.previa(); G.pintaT(); if (vacia) ACC.plant('sustituye'); },
    pzNueva(t) { if (!A.TIPOS.includes(t)) return; antes(); const n = A.nueva(t, hor()); if (t === 'zona') { const c = G.carpetas().filter(x => !G.esAds(x)); n.carp = c.length ? [c[0]] : []; } E().piezas.push(n); selId = n.id; hecho(); if (t === 'texto') setTimeout(() => { const x = $('#pz-tx'); if (x) { x.focus(); x.select(); } }, 30); },
    pzSel(id) { elige(id === selId ? '' : id); },
    pzBorra() { const z = PZ(); if (!z) return; antes(); E().piezas.splice(E().piezas.indexOf(z), 1); selId = ''; hecho(); G.pintaL(); },
    pzDup() { const z = PZ(); if (!z) return; antes(); const n = copia(z); n.id = A.id(); n.x = red(n.x + 3); n.y = red(n.y + 3); E().piezas.splice(E().piezas.indexOf(z) + 1, 0, n); selId = n.id; hecho(); G.pintaL(); },
    pzOrden(v) { const z = PZ(), ps = E().piezas; if (!z) return; antes(); ps.splice(ps.indexOf(z), 1); +v > 0 ? ps.push(z) : ps.unshift(z); hecho(); },
    pzBloq(id) { const z = E().piezas.find(q => q.id === id); if (!z) return; antes(); z.bloq ? delete z.bloq : z.bloq = true; hecho(); },
    pzOculta(id) { const z = E().piezas.find(q => q.id === id); if (!z) return; antes(); z.oculta ? delete z.oculta : z.oculta = true; hecho(); },
    pzT(v) { const z = PZ(); if (!z) return; const [k, x] = parte(v); antes(); pone(z, k, x); hecho(); },
    pzAlt(k) { const z = PZ(); if (!z) return; antes(); const act = k === 'auto' || k === 'dias' || (k === 'may' && z.t === 'fecha') ? z[k] !== false : !!z[k]; z[k] = !act; if (k === 'auto' && !z[k] && !z.tam) z.tam = 7; hecho(); },
    pzPaso(v) { const z = PZ(); if (!z) return; const [k, d] = parte(v); antes(); z[k] = red(lim((z[k] == null ? (DEFN[k] || 0) : +z[k]) + +d, LIM[k][0], LIM[k][1]), 2); hecho(); },
    pzCarp(c) { const z = PZ(); if (!z || z.t !== 'zona') return; antes(); const l = Array.isArray(z.carp) ? z.carp : (z.carp = []), i = l.indexOf(c); i < 0 ? l.push(c) : l.splice(i, 1); hecho(); },
    pzElige(v) { if (window.ADGEST) window.ADGEST.elige(v === 'video' ? 'video' : 'img', s => { const z = PZ(); if (!z) return; antes(); z.src = s; hecho(); }); },
    pzSube() { if (window.ADGEST) window.ADGEST.pide(k => { const z = PZ(); if (!z || !k) return; antes(); z.src = 'm:' + k; hecho(); }); },
    pzCiudad() { const z = PZ(), q = ($('#pz-lugar') || {}).value || ''; if (!z || !q.trim()) return; fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&language=' + G.lang + '&name=' + encodeURIComponent(q.trim())).then(r => r.json()).then(j => { const c = j && j.results && j.results[0]; if (!c) throw 0; antes(); z.lat = red(c.latitude, 3); z.lon = red(c.longitude, 3); z.lugar = String(c.name || q).slice(0, 40); hecho(); }).catch(() => G.estado(T('No encuentro esa ciudad'))); },
    escSel(i) { i = +i; if (!ES()[i] || i === iE) return; iE = i; selId = ''; render(); tira(); G.pintaT(); },
    escDup() { antes(); const n = copia(E()); n.id = 'e' + A.id(); n.piezas.forEach(z => { z.id = A.id(); }); ES().splice(iE + 1, 0, n); iE++; selId = ''; todo(); },
    escBorra() { if (ES().length < 2) return; antes(); ES().splice(iE, 1); iE = Math.max(0, iE - 1); selId = ''; todo(); },
    escMueve(v) { const j = iE + +v; if (j < 0 || j >= ES().length) return; antes(); const e = ES().splice(iE, 1)[0]; ES().splice(j, 0, e); iE = j; todo(); },
    escPaso(v) { const [k, d] = parte(v); antes(); E().seg = lim((E().seg || 12) + +d, 3, 3600); hecho(); },
    foT(v) { const [k, x] = parte(v), f = E().fondo || (E().fondo = {}); antes(); pone(f, k, x); hecho(); },
    foPaso(v) { const [k, d] = parte(v), f = E().fondo || (E().fondo = {}); antes(); f[k] = red(lim((f[k] == null ? (DEFN[k] || 0) : +f[k]) + +d, LIM[k][0], LIM[k][1]), 2); hecho(); },
    foElige() { if (window.ADGEST) window.ADGEST.elige('img', s => { antes(); const f = E().fondo || (E().fondo = {}); f.t = 'img'; f.src = s; hecho(); }); },
    foSube() { if (window.ADGEST) window.ADGEST.pide(k => { if (!k) return; antes(); const f = E().fondo || (E().fondo = {}); f.t = 'img'; f.src = 'm:' + k; hecho(); }); },
    deshace() { vuelve('u', 'r'); }, rehace() { vuelve('r', 'u'); },
    iman() { iman = !iman; G.guarda('g-iman', iman); G.pintaBarra(); },
    probar() { probando = !probando; selId = ''; G.pintaBarra(); render(); G.previa(); if (!probando) { remonta(); G.pintaT(); } },
    plant(v) { galeria(v === 'sustituye' ? 'sustituye' : 'nueva'); },
    plantPon(id) { const e = PL.haz(id, hor(), G.lang); if (!e) return; const car = G.MAN.carpetas || {}, otra = G.carpetas().filter(c => !G.esAds(c))[0]; e.piezas.forEach(z => { if (z.t === 'zona') z.carp = (z.carp || []).filter(c => car[c]); if (z.t === 'zona' && !z.carp.length && otra) z.carp = [otra]; });
      antes(); if (galModo === 'sustituye' && E()) { e.seg = E().seg || e.seg; ES()[iE] = e; } else { ES().splice(iE + 1, 0, e); iE = ES().length > 1 ? iE + 1 : 0; } selId = ''; cierraModal(); todo(); alLienzo(); },
    plantModo(v) { galModo = v === 'sustituye' ? 'sustituye' : 'nueva'; galPinta(); }, plantCat(v) { galCat = v; galPinta(); },
    modalCierra() { cierraModal(); }
  };
  Object.assign(G.ACC, ACC);
  /* en móvil las ventanas van apiladas: tras elegir plantilla, se vuelve al lienzo para ver el resultado */
  function alLienzo() { if (innerWidth <= 900) { const z = document.querySelector('.lienzo-zona'); z && z.scrollIntoView({ block: 'start', behavior: 'smooth' }); } }
  /* campos: cambian la pieza mientras se escribe, sin repintar la ventana (para no perder el cursor) */
  let tAnt = 0;
  document.addEventListener('input', e => { const t = e.target, d = t.dataset; if (!d || !(d.pz || d.fo || d.es) || !G.ESCM(P())) return; if (Date.now() - tAnt > 1500) antes(); tAnt = Date.now();
    if (d.pz) { const z = PZ(); if (!z) return; if (d.pz === 'src') { const v = t.value.trim(); if (v && !/^https:\/\/\S+$/i.test(v)) return; z.src = v; } else if (t.type === 'number') { if (t.value === '' || !isFinite(+t.value)) return; pone(z, d.pz, t.value); } else pone(z, d.pz, t.value); G.toca(); mont && mont.pon(E()); capa(); tiraLuego(); if (t.type === 'color') pintaLuego(); }
    else if (d.fo) { const f = E().fondo || (E().fondo = {}); pone(f, d.fo, t.value); G.toca(); mont && mont.pon(E()); tiraLuego(); if (t.type === 'color') pintaLuego(); }
    else { E()[d.es] = t.value; if (!t.value) delete E()[d.es]; G.toca(); tiraLuego(); } });
  let tP = 0; const pintaLuego = () => { clearTimeout(tP); tP = setTimeout(() => G.pintaT(), 500); };
  document.addEventListener('change', e => { const t = e.target; if (t.dataset && t.dataset.pz && t.type !== 'color' && G.ESCM(P())) { if (t.dataset.pz === 'src') G.pintaT(); } });

  /* ---------- ventana flotante y galería de plantillas ---------- */
  let galModo = 'nueva', galCat = '', galM = [], alCerrar = null;
  function abreModal(html, cls, cierra) { const m = $('#modal'); m.className = 'modal ' + (cls || ''); m.innerHTML = '<div class="m-caja" role="dialog" aria-modal="true">' + html + '</div>'; m.hidden = false; alCerrar = cierra || null; const f = m.querySelector('[data-foco]') || m.querySelector('button'); f && f.focus({ preventScroll: true }); }
  function cierraModal() { const m = $('#modal'); if (m.hidden) return; galM.forEach(x => x.destruye()); galM = []; m.hidden = true; m.textContent = ''; const f = alCerrar; alCerrar = null; f && f(); }
  $('#modal').addEventListener('pointerdown', e => { if (e.target === $('#modal')) cierraModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) { e.stopPropagation(); cierraModal(); } }, true);
  const cabModal = t => `<div class="m-cab"><h2>${t}</h2><button type="button" class="tecla rd" data-a="modalCierra" aria-label="${T('Cerrar')}" title="${T('Cerrar')}">✕</button></div>`;
  function galeria(modo) { galModo = modo; galCat = ''; abreModal('', 'm-gal'); galPinta(); }
  function galPinta() { const m = $('#modal .m-caja'); if (!m) return; galM.forEach(x => x.destruye()); galM = []; const li = G.lang === 'en' ? 1 : G.lang === 'ca' ? 2 : 0, L = PL.lista.filter(p => !galCat || p.cat === galCat);
    m.innerHTML = cabModal(T('Elige una plantilla')) + `<div class="fila m-op">${tecla('plantModo', 'nueva', T('Añadir como escena nueva'), galModo !== 'sustituye')}${tecla('plantModo', 'sustituye', T('Sustituir la escena actual'), galModo === 'sustituye')}</div>
      <div class="m-cats">${tecla('plantCat', '', T('Todas'), !galCat)}${PL.CATS.map(c => tecla('plantCat', c[0], c[1][li], galCat === c[0])).join('')}</div><div class="m-rej${hor() ? ' hor' : ''}">${L.map(p => `<button type="button" class="pl" data-a="plantPon" data-v="${p.id}"><span class="pl-m"><span></span></span><span class="pl-n">${esc(p.n[li])}</span></button>`).join('')}</div>`;
    const cs = [...m.querySelectorAll('.pl-m')], man = G.MAN; let i = 0; const lote = () => { if ($('#modal').hidden || !cs[i] || !cs[i].isConnected) return; for (let k = 0; k < 6 && i < cs.length; k++, i++) { const e = PL.haz(L[i].id, hor(), G.lang); e.piezas.forEach(z => { if (z.t === 'zona') { z.carp = (z.carp || []).filter(c => man.carpetas[c]); if (!z.carp.length) { const o = G.carpetas().filter(c => !G.esAds(c))[0]; if (o) z.carp = [o]; } } }); galM.push(A.monta(cs[i].firstChild, e, ctx({ red: false, mini: true }))); } if (i < cs.length) setTimeout(lote, 30); }; lote();
    const f = m.querySelector('.m-cats .on'); f && f.focus({ preventScroll: true }); }

  /* ---------- lo que el gestor pregunta a este módulo ---------- */
  Object.assign(G.ext, {
    barraZm: () => `<button type="button" class="tecla rd" data-a="deshace" aria-label="${T('Deshacer')}" title="${T('Deshacer')}"${hist().u.length ? '' : ' disabled'}>↶</button><button type="button" class="tecla rd" data-a="rehace" aria-label="${T('Rehacer')}" title="${T('Rehacer')}"${hist().r.length ? '' : ' disabled'}>↷</button>`,
    barra: () => `${tecla('iman', '', T('Imán'), iman)}<button type="button" class="tecla${probando ? ' on pri' : ''}" data-a="probar" aria-pressed="${probando}">${probando ? '■ ' + T('Editar') : '▶ ' + T('Probar')}</button>`,
    probando: () => probando, antes,
    alAjustar() { if (mont) { mont.ajusta(); capa(); } },
    alCambiar() { render(); tira(); },
    alLista() { if (probando && !G.ESCM(P())) probando = false; iE = 0; selId = ''; remonta(); },
    alSalir() { if (probando) { probando = false; } },
    abreModal, cierraModal, cabModal, urlDe, hor, ctx
  });
  const viejoToca = G.toca; G.toca = () => { viejoToca(); const b = $('#barra'); if (b && G.ESCM(P())) { const u = b.querySelector('[data-a="deshace"]'), r = b.querySelector('[data-a="rehace"]'); if (u) u.disabled = !hist().u.length; if (r) r.disabled = !hist().r.length; } };
})();
