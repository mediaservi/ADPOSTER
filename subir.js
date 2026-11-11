/* ADPOSTER · subir.js · consola de subida de carteles (solo con el acceso privado abierto y con llave)
   Sueltas, pegas o eliges imágenes de cualquier formato y tamaño; cada una se convierte en este navegador a póster vertical 2:3 (9:16 en las carpetas de anuncios)
   en WebP, al tamaño justo para un display FHD (nunca se amplía). Si la proporción se parece a la del póster se recorta un poco;
   si es muy distinta se coloca entera sobre un fondo desenfocado de la propia imagen. Se elige la carpeta de destino y todo sube
   al repositorio de la web privada en UNA sola confirmación (imágenes + índice), para que se publique una vez.
   Licencia GPL-3.0 · mediaservi.com */
(() => {
  'use strict';
  const G = window.ADG; if (!G) return;
  const PW = 1080, MARGEN = .2, CAL = .86, MAXN = 40; let PH = 1620, RAT = PW / PH;   /* póster 2:3; las carpetas de anuncios (ads-…) van a pantalla completa, 9:16 */
  const TX = { 'Subir carteles': ['Upload posters', 'Puja cartells'], 'Suelta aquí las imágenes, pégalas (Ctrl+V) o': ['Drop images here, paste them (Ctrl+V) or', 'Deixa anar aquí les imatges, enganxa-les (Ctrl+V) o'], 'elige archivos': ['choose files', 'tria arxius'],
    'Carpeta de destino': ['Target folder', 'Carpeta de destí'], 'carpeta nueva': ['new folder', 'carpeta nova'], 'Subir': ['Upload', 'Puja'], 'Cerrar': ['Close', 'Tanca'], 'Vaciar': ['Clear', 'Buida'], 'Recortar': ['Crop', 'Retalla'], 'Entera': ['Whole', 'Sencera'], 'Quitar': ['Remove', 'Treu'],
    'Elige una carpeta.': ['Pick a folder.', 'Tria una carpeta.'], 'Añade alguna imagen.': ['Add some image.', 'Afegeix alguna imatge.'], 'Preparando…': ['Preparing…', 'Preparant…'], 'Subiendo': ['Uploading', 'Pujant'], 'Publicando…': ['Publishing…', 'Publicant…'],
    'Subido. Tu web lo publica en uno o dos minutos y los displays lo recogen solos.': ['Uploaded. Your site publishes it in a minute or two and displays pick it up on their own.', 'Pujat. La teva web ho publica en un o dos minuts i els displays ho recullen sols.'],
    'No se ha podido subir': ['Could not upload', "No s'ha pogut pujar"], 'La llave no vale o no tiene permiso en ese repositorio.': ['The key is not valid or has no permission on that repository.', 'La clau no val o no té permís en aquest repositori.'], 'Esa imagen no se puede leer.': ['That image cannot be read.', 'Aquesta imatge no es pot llegir.'],
    'Cada imagen se convierte a póster vertical 2:3 en WebP, al tamaño justo para FHD.': ['Each image becomes a 2:3 vertical poster in WebP, at the right size for FHD.', 'Cada imatge es converteix en pòster vertical 2:3 en WebP, a la mida justa per a FHD.'], 'imágenes': ['images', 'imatges'] };
  const T = s => { const t = TX[s], l = G.lang; return !t || l === 'es' ? s : t[l === 'en' ? 0 : 1]; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = (s, r) => (r || document).querySelector(s);
  const nombre = f => (String(f).replace(/\.[^.]*$/, '').normalize('NFKD').replace(/[^\x00-\x7f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'imagen').slice(0, 60);
  let items = [], dest = '', ocupado = false, D = null, uid = 0;

  /* ---------- conversión ---------- */
  const abre = async f => { try { return await createImageBitmap(f, { imageOrientation: 'from-image' }); } catch (e) { return await new Promise((ok, no) => { const i = new Image(), u = URL.createObjectURL(f); i.onload = () => { URL.revokeObjectURL(u); ok(i); }; i.onerror = () => { URL.revokeObjectURL(u); no(e); }; i.src = u; }); } };
  const modoAuto = (w, h) => Math.abs(w / h / RAT - 1) <= MARGEN ? 'recorta' : 'entera';
  /* pinta el póster en un lienzo: «recorta» llena el 2:3 quitando lo que sobra por los bordes; «entera» la pone completa sobre su propio fondo desenfocado. Nunca amplía */
  function pinta(img, modo) { const w = img.width, h = img.height, c = document.createElement('canvas'), x = c.getContext('2d');
    if (modo === 'recorta') { const cw = Math.min(w, h * RAT), ch = cw / RAT, ow = Math.min(PW, Math.round(cw)); c.width = ow; c.height = Math.round(ow / RAT); x.imageSmoothingQuality = 'high'; x.drawImage(img, (w - cw) / 2, (h - ch) / 2, cw, ch, 0, 0, c.width, c.height); return c; }
    const k = Math.min(PW / w, PH / h, 1), dw = w * k, dh = h * k, ow = Math.min(PW, Math.max(Math.round(dw), Math.round(dh * RAT))); c.width = ow; c.height = Math.round(ow / RAT); x.imageSmoothingQuality = 'high';
    const kc = Math.max(c.width / w, c.height / h) * 1.12, bw = w * kc, bh = h * kc; x.filter = `blur(${Math.round(c.width / 28)}px) brightness(.55) saturate(1.15)`; x.drawImage(img, (c.width - bw) / 2, (c.height - bh) / 2, bw, bh); x.filter = 'none';
    const e = Math.min(c.width / w, c.height / h, 1), fw = w * e, fh = h * e; x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = c.width / 36; x.drawImage(img, (c.width - fw) / 2, (c.height - fh) / 2, fw, fh); return c; }
  const aBlob = c => new Promise(ok => c.toBlob(b => ok(b), 'image/webp', CAL));
  const b64 = async b => { const u = new Uint8Array(await b.arrayBuffer()); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  async function prepara(it) { const c = pinta(it.img, it.modo); it.blob = await aBlob(c); it.w = c.width; it.h = c.height; if (it.url) URL.revokeObjectURL(it.url); it.url = URL.createObjectURL(it.blob); }
  async function anade(files) { const fs = [...files].filter(f => f && (/^image\//.test(f.type) || /\.(jpe?g|png|webp|avif|gif|bmp|tiff?)$/i.test(f.name || ''))).slice(0, MAXN - items.length); if (!fs.length) return; msg(T('Preparando…'));
    for (const f of fs) { try { const img = await abre(f); if (!img.width || !img.height) throw 0; const it = { id: ++uid, n: nombre(f.name && !/^image\.\w+$/i.test(f.name) ? f.name : 'cartel-' + new Date().toISOString().slice(0, 19).replace(/\D/g, '')), img, modo: modoAuto(img.width, img.height) }; await prepara(it); items.push(it); } catch (e) { msg(T('Esa imagen no se puede leer.')); } }
    lista(); if (!/leer|read|llegir/.test($('#sb-msg', D).textContent)) msg(''); }

  /* al elegir destino se ajusta el formato y se rehacen las que ya estaban puestas (el modo automático se recalcula; el elegido a mano se respeta) */
  async function formato(carpeta) { const ph = /^ads(-|$)/.test(carpeta) ? 1920 : 1620; if (ph === PH) return; PH = ph; RAT = PW / PH; for (const it of items) { if (!it.mano) it.modo = modoAuto(it.img.width, it.img.height); await prepara(it); } lista(); }
  /* ---------- ventana ---------- */
  const carpetas = () => Object.keys((G.MAN && G.MAN.carpetas) || {}).filter(k => k !== 'fondos').sort();
  const msg = (t, mal) => { const m = $('#sb-msg', D); if (m) { m.textContent = t || T('Cada imagen se convierte a póster vertical 2:3 en WebP, al tamaño justo para FHD.'); m.classList.toggle('mal', !!mal); } };
  function lista() { const l = $('#sb-lista', D); if (!l) return; l.innerHTML = items.map(it => `<div class="sb-it" data-id="${it.id}"><img src="${it.url}" alt=""><div class="sb-d"><b>${esc(it.n)}.webp</b><small>${it.w} × ${it.h} · ${Math.max(1, Math.round(it.blob.size / 1024))} KB</small><div class="fila"><button type="button" class="tecla${it.modo === 'recorta' ? ' on' : ''}" data-sb="modo" data-v="recorta" aria-pressed="${it.modo === 'recorta'}"><i class="led"></i><span>${T('Recortar')}</span></button><button type="button" class="tecla${it.modo === 'entera' ? ' on' : ''}" data-sb="modo" data-v="entera" aria-pressed="${it.modo === 'entera'}"><i class="led"></i><span>${T('Entera')}</span></button><button type="button" class="tecla rd" data-sb="quita" aria-label="${T('Quitar')}" title="${T('Quitar')}">✕</button></div></div></div>`).join('');
    $('#sb-n', D).textContent = items.length ? items.length + ' ' + T('imágenes') : ''; $('[data-sb=sube]', D).disabled = ocupado; }
  function destinos() { const d = $('#sb-dest', D); d.innerHTML = carpetas().map(k => `<button type="button" class="tecla${dest === k ? ' on' : ''}" data-sb="dest" data-v="${esc(k)}" aria-pressed="${dest === k}"><i class="led"></i><span>${esc(k)}</span><small>${G.MAN.carpetas[k].length}</small></button>`).join(''); }
  function abreVentana() { if (!G.puede || !G.puede()) return; if (!D) { D = document.createElement('dialog'); D.id = 'sb'; D.className = 'adm sb'; document.body.appendChild(D);
      D.addEventListener('click', e => { if (e.target === D) { D.close(); return; } const t = e.target.closest('[data-sb]'); if (!t || t.disabled) return; const a = t.dataset.sb, it = items.find(i => i.id === +((t.closest('.sb-it') || {}).dataset || {}).id);
        if (a === 'dest') { dest = t.dataset.v; $('#sb-nueva', D).value = ''; destinos(); formato(dest); } else if (a === 'elige') $('#sb-arch', D).click(); else if (a === 'vacia') { items = []; lista(); msg(''); } else if (a === 'sube') sube();
        else if (a === 'quita' && it) { items = items.filter(i => i !== it); lista(); } else if (a === 'modo' && it && it.modo !== t.dataset.v) { it.modo = t.dataset.v; it.mano = 1; prepara(it).then(lista); } });
      D.addEventListener('dragover', e => { e.preventDefault(); $('#sb-zona', D).classList.add('sobre'); }); D.addEventListener('dragleave', () => $('#sb-zona', D).classList.remove('sobre'));
      D.addEventListener('drop', e => { e.preventDefault(); $('#sb-zona', D).classList.remove('sobre'); if (!ocupado) anade(e.dataTransfer.files); });
      D.addEventListener('paste', e => { const fs = [...(e.clipboardData || {}).items || []].filter(i => i.kind === 'file').map(i => i.getAsFile()); if (fs.length && !ocupado) { e.preventDefault(); anade(fs); } });
      D.addEventListener('change', e => { if (e.target.id === 'sb-arch') { anade(e.target.files); e.target.value = ''; } }); D.addEventListener('input', e => { if (e.target.id === 'sb-nueva' && e.target.value.trim()) { dest = ''; destinos(); formato(nombre(e.target.value)); } }); }
    D.innerHTML = `<form method="dialog" class="adm-c"><h2>${T('Subir carteles')} <small id="sb-n"></small></h2>
      <div class="sb-zona" id="sb-zona" tabindex="0">${T('Suelta aquí las imágenes, pégalas (Ctrl+V) o')} <button type="button" class="tecla" data-sb="elige">${T('elige archivos')}</button><input type="file" id="sb-arch" accept="image/*" multiple hidden></div>
      <div class="sb-lista" id="sb-lista"></div>
      <h2>${T('Carpeta de destino')}</h2><div class="sb-dest" id="sb-dest"></div><input class="campo" id="sb-nueva" placeholder="${T('carpeta nueva')}" aria-label="${T('carpeta nueva')}" maxlength="40" autocomplete="off" spellcheck="false">
      <div class="nota" id="sb-msg" role="status"></div>
      <div class="fila"><button type="button" class="tecla pri" data-sb="sube">${T('Subir')}</button><button type="button" class="tecla reset" data-sb="vacia">${T('Vaciar')}</button><button type="submit" class="tecla">${T('Cerrar')}</button></div></form>`;
    destinos(); lista(); msg(''); D.showModal ? D.showModal() : D.setAttribute('open', ''); $('#sb-zona', D).focus(); }

  /* ---------- subida: una sola confirmación con todas las imágenes y el índice ---------- */
  async function sube() { if (ocupado) return; const A = G.adm, nueva = nombre($('#sb-nueva', D).value.trim() || ''), carpeta = dest || ($('#sb-nueva', D).value.trim() ? nueva : '');
    if (!items.length) return msg(T('Añade alguna imagen.'), 1); if (!carpeta || carpeta === 'fondos') return msg(T('Elige una carpeta.'), 1);
    ocupado = true; lista(); const api = 'https://api.github.com/repos/' + A.repo + '/', cab = { Authorization: 'Bearer ' + A.token, Accept: 'application/vnd.github+json' };
    const pide = async (m, u, cuerpo) => { const r = await fetch(api + u, { method: m, headers: cab, cache: 'no-store', body: cuerpo ? JSON.stringify(cuerpo) : undefined }); if (!r.ok) throw r.status; return r.json(); };
    try { msg(T('Preparando…')); const rama = A.rama || (await pide('GET', '')).default_branch, ref = await pide('GET', 'git/ref/heads/' + encodeURIComponent(rama)), base = await pide('GET', 'git/commits/' + ref.object.sha);
      /* el índice se lee del repositorio (no de la web publicada), para no pisar lo que aún se esté publicando */
      let man; try { const j = await pide('GET', 'contents/assets/manifest.json?ref=' + encodeURIComponent(rama)); man = JSON.parse(decodeURIComponent(escape(atob(String(j.content).replace(/\s/g, ''))))); } catch (e) { if (e !== 404) throw e; man = { carpetas: {} }; }
      man.carpetas = man.carpetas || {}; const ya = new Set(man.carpetas[carpeta] || []), arbol = []; let i = 0;
      for (const it of items) { msg(`${T('Subiendo')} ${++i} / ${items.length}…`); let n = it.n, k = 1; while (ya.has(n + '.webp')) n = it.n + '-' + (++k); ya.add(n + '.webp'); const b = await pide('POST', 'git/blobs', { content: await b64(it.blob), encoding: 'base64' }); arbol.push({ path: 'assets/' + carpeta + '/' + n + '.webp', mode: '100644', type: 'blob', sha: b.sha }); }
      man.carpetas[carpeta] = [...ya].sort(); const orden = {}; Object.keys(man.carpetas).sort().forEach(k2 => { orden[k2] = man.carpetas[k2]; }); man.carpetas = orden;
      const h = new Uint8Array(await crypto.subtle.digest('SHA-1', new TextEncoder().encode(JSON.stringify(orden)))); man.version = [...h].map(v => v.toString(16).padStart(2, '0')).join('').slice(0, 10);
      arbol.push({ path: 'assets/manifest.json', mode: '100644', type: 'blob', content: JSON.stringify({ version: man.version, carpetas: orden }) + '\n' });
      msg(T('Publicando…')); const t = await pide('POST', 'git/trees', { base_tree: base.tree.sha, tree: arbol }), c = await pide('POST', 'git/commits', { message: `ADPOSTER · ${items.length} en ${carpeta}`, tree: t.sha, parents: [ref.object.sha] }); await pide('PATCH', 'git/refs/heads/' + encodeURIComponent(rama), { sha: c.sha });
      if (G.MAN) { G.MAN.carpetas = orden; G.MAN.version = man.version; } items.forEach(it => it.url && URL.revokeObjectURL(it.url)); items = []; dest = carpeta; $('#sb-nueva', D).value = ''; ocupado = false; destinos(); lista(); G.repinta && G.repinta();
      msg(T('Subido. Tu web lo publica en uno o dos minutos y los displays lo recogen solos.')); }
    catch (e) { ocupado = false; lista(); msg(T('No se ha podido subir') + (e === 401 || e === 403 || e === 404 ? ' · ' + T('La llave no vale o no tiene permiso en ese repositorio.') : typeof e === 'number' ? ' · ' + e : ''), 1); } }

  window.ADSUBIR = { abre: abreVentana, _pinta: pinta, _modo: modoAuto };
})();
