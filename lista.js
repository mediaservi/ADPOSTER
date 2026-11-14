/* ADPOSTER · v1.15 · la lista de carteles a la vista, como en los gestores de cartelería profesionales (VXT, CleverLive).
   Debajo del lienzo, la tira con todos los carteles en el orden en que salen, con su duración y sus fechas, y los anuncios al final con su ritmo.
   · Tocar un cartel lo elige: encima de la tira salen su duración (− +), sus fechas (desde y hasta), dejarlo fuera, moverlo, verlo en grande y quitarlo.
   · Arrastrar un cartel lo cambia de sitio (la lista pasa a orden fijo). «+» añade carteles sueltos de cualquier carpeta o de «Mis imágenes».
   · Sin nada elegido, el resumen dice cuántos salen, cuánto dura una vuelta y qué no está listo: carteles caducados, por llegar o fuera, carpetas vacías.
   Datos de cada lista: p.sueltos (carteles sueltos: «carpeta/archivo» o «m:clave») y p.archivos[f] = { seg, off, desde, hasta } (fechas AAAA-MM-DD).
   El reproductor (player.js) solo enseña cada cartel entre sus fechas. Licencia GPL-3.0 · mediaservi.com */
(() => {
  'use strict';
  const G = window.ADG; if (!G || !G.ext || !G.ext.abreModal) return;
  const { T, TX, $, esc, tecla, lim } = G, P = () => G.P(), X = G.ext;
  Object.assign(TX, {
    'Añadir carteles': ['Add posters', 'Afegeix cartells'], 'Añadir': ['Add', 'Afegeix'], 'Toda la carpeta': ['Whole folder', 'Tota la carpeta'], 'ya está en la lista': ['already in the list', 'ja és a la llista'],
    'Elige los carteles que quieras y pulsa «Añadir». Con «Toda la carpeta» entra la carpeta entera, también lo que le añadas más adelante.': ['Pick the posters you want and press “Add”. “Whole folder” brings in the whole folder, including anything you add to it later.', 'Tria els cartells que vulguis i prem «Afegeix». Amb «Tota la carpeta» hi entra la carpeta sencera, també el que hi afegeixis més endavant.'],
    'Desde': ['From', 'Des de'], 'Hasta': ['Until', 'Fins a'], 'Duración': ['Duration', 'Durada'], 'Fuera': ['Out', 'Fora'], 'Ver': ['View', 'Mostra'], 'Cerrar la ficha': ['Close', 'Tanca la fitxa'],
    'caducado': ['expired', 'caducat'], 'caducados': ['expired', 'caducats'], 'aún no': ['not yet', 'encara no'], 'por llegar': ['upcoming', 'per arribar'], 'fuera': ['left out', 'fora'],
    'sin anuncios': ['no ads', 'sense anuncis'], 'cada': ['every', 'cada'], 'vídeos': ['videos', 'vídeos'], 'vídeo': ['video', 'vídeo'], 'carpeta vacía': ['empty folder', 'carpeta buida'], 'Imagen propia': ['Own image', 'Imatge pròpia'],
    'Suelto': ['Single', 'Solt'], 'De la carpeta': ['From folder', 'De la carpeta'], 'Esta lista aún no tiene carteles: añádelos con «+».': ['This list has no posters yet: add them with “+”.', 'Aquesta llista encara no té cartells: afegeix-los amb «+».'],
    'Toca un cartel para cambiar su duración o sus fechas, o dejarlo fuera; arrástralo para ordenar.': ['Tap a poster to change its duration or dates, or to leave it out; drag it to reorder.', 'Toca un cartell per canviar-ne la durada o les dates, o deixar-lo fora; arrossega’l per ordenar.'],
    'carteles añadidos': ['posters added', 'cartells afegits'], 'Carpeta añadida': ['Folder added', 'Carpeta afegida'], 'Quitar de la lista': ['Remove from the list', 'Treu de la llista'],
    'Lo pone la carpeta: para que no salga, déjalo fuera.': ['It comes from the folder: to stop it showing, leave it out.', 'Ve de la carpeta: perquè no surti, deixa’l fora.'], 'Subir imagen': ['Upload image', 'Puja una imatge'], 'Mis imágenes': ['My images', 'Les meves imatges'],
    'Anuncios': ['Ads', 'Anuncis'], 'Sale hasta el': ['Shows until', 'Surt fins al'], 'Sale desde el': ['Shows from', 'Surt des del'], 'Caducó el': ['Expired on', 'Va caducar el']
  });
  const el = (t, c) => { const e = document.createElement(t); if (c) e.className = c; return e; };
  const hoy = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const loc = () => G.lang === 'en' ? 'en-GB' : G.lang === 'ca' ? 'ca-ES' : 'es-ES';
  const fecha = s => { const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return d ? new Date(+d[1], +d[2] - 1, +d[3]).toLocaleDateString(loc(), { day: 'numeric', month: 'short' }) : ''; };
  const esVideo = f => /\.(mp4|webm|m4v|mov)(\?|$)/i.test(f || ''), propia = f => String(f).indexOf('m:') === 0;
  const urlDe = f => propia(f) ? (G.B.medios[f.slice(2)] || '') : G.urlAsset(f);
  const existe = f => { if (propia(f)) return !!G.B.medios[f.slice(2)]; const i = f.indexOf('/'); return i > 0 && (G.MAN.carpetas[f.slice(0, i)] || []).includes(f.slice(i + 1)); };
  const nombre = f => propia(f) ? T('Imagen propia') : f.replace(/^.*\//, '').replace(/\.[a-z0-9]+$/i, '');
  const deCarpetas = p => (p.contenido || []).flatMap(c => (G.MAN.carpetas[c] || []).map(f => c + '/' + f));
  /* la lista entera, en el orden en que sale: la secuencia fijada y, detrás, lo demás (carpetas y sueltos) */
  const todos = p => { const u = [...new Set(deCarpetas(p).concat((p.sueltos || []).filter(existe)))], hay = new Set(u), sq = (p.secuencia || []).filter(f => hay.has(f)), ya = new Set(sq); return sq.concat(u.filter(f => !ya.has(f))); };
  const estadoDe = (p, f) => { const a = p.archivos[f] || {}, h = hoy(); return a.off ? 'off' : a.hasta && h > a.hasta ? 'caduca' : a.desde && h < a.desde ? 'pronto' : 'si'; };
  const segDe = (p, f) => (p.archivos[f] && +p.archivos[f].seg) || 0;
  const mm = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const mini = (f, u) => esVideo(f) ? `<video src="${esc(u)}#t=0.5" preload="metadata" muted playsinline></video>` : `<img src="${esc(u)}" alt="" loading="lazy" decoding="async">`;
  let elegido = '';

  /* ---------- la tira y, encima, el resumen o la ficha del cartel elegido ---------- */
  function pinta() { const t = $('#tirac'); if (!t) return; const p = P(); if (!p || G.ESCM(p)) { t.hidden = true; t.textContent = ''; return; }
    t.hidden = false; const L = todos(p), car = G.MAN.carpetas || {}; if (elegido && !L.includes(elegido)) elegido = '';
    const ae = document.activeElement, foco = ae && t.contains(ae) ? (ae.dataset.a || '') + '|' + (ae.dataset.v || '') + '|' + (ae.dataset.cf || '') : '', sl = (t.querySelector('.tira') || {}).scrollLeft || 0;
    let cab;
    if (elegido) { const f = elegido, a = p.archivos[f] || {}, s = segDe(p, f), i = L.indexOf(f), suelto = (p.sueltos || []).includes(f) && !deCarpetas(p).includes(f), ori = propia(f) ? T('Mis imágenes') : f.slice(0, f.indexOf('/'));
      cab = `<div class="tc-ficha" role="group" aria-label="${esc(nombre(f))}">
        <button type="button" class="tc-m" data-a="carVer" data-v="${esc(f)}" aria-label="${T('Ver')}" title="${T('Ver')}">${mini(f, urlDe(f))}</button>
        <div class="tc-n"><b>${esc(nombre(f))}</b><small>${esc(suelto ? T('Suelto') + ' · ' + ori : T('De la carpeta') + ' ' + ori)}</small></div>
        <div class="tc-g"><span class="tc-l">${T('Duración')}</span><button type="button" class="tecla rd" data-a="carSeg" data-v="-1" aria-label="−">−</button><span class="lcd">${esVideo(f) ? T('vídeo') : (s || p.segundos) + ' s'}</span><button type="button" class="tecla rd" data-a="carSeg" data-v="1" aria-label="+"${esVideo(f) ? ' disabled' : ''}>+</button></div>
        <div class="tc-g"><label class="tc-l" for="tc-desde">${T('Desde')}</label><input type="date" class="campo tc-f" id="tc-desde" data-cf="desde" value="${esc(a.desde || '')}"><label class="tc-l" for="tc-hasta">${T('Hasta')}</label><input type="date" class="campo tc-f" id="tc-hasta" data-cf="hasta" value="${esc(a.hasta || '')}"${a.desde ? ` min="${esc(a.desde)}"` : ''}></div>
        <div class="tc-g">${tecla('carOff', f, T('Fuera'), !!a.off)}<button type="button" class="tecla rd" data-a="carMueve" data-v="-1" aria-label="${T('Mover antes')}" title="${T('Mover antes')}"${i > 0 ? '' : ' disabled'}>◀</button><button type="button" class="tecla rd" data-a="carMueve" data-v="1" aria-label="${T('Mover después')}" title="${T('Mover después')}"${i < L.length - 1 ? '' : ' disabled'}>▶</button>
          <button type="button" class="tecla reset" data-a="carQuita" data-v="${esc(f)}"${suelto ? '' : ` disabled title="${T('Lo pone la carpeta: para que no salga, déjalo fuera.')}"`}>${T('Quitar')}</button><button type="button" class="tecla rd" data-a="carCierra" aria-label="${T('Cerrar la ficha')}" title="${T('Cerrar la ficha')}">✕</button></div></div>`; }
    else { const est = L.map(f => estadoDe(p, f)), salen = L.filter((f, k) => est[k] === 'si'), vids = salen.filter(esVideo).length, ciclo = salen.filter(f => !esVideo(f)).reduce((n, f) => n + (segDe(p, f) || p.segundos), 0);
      const cuenta = k => est.filter(e => e === k).length, vacias = (p.contenido || []).filter(c => !(car[c] || []).length), avisos = [];
      if (cuenta('caduca')) avisos.push(['mal', cuenta('caduca') + ' ' + T(cuenta('caduca') > 1 ? 'caducados' : 'caducado')]); if (cuenta('pronto')) avisos.push(['ojo', cuenta('pronto') + ' ' + T('por llegar')]); if (cuenta('off')) avisos.push(['gris', cuenta('off') + ' ' + T('fuera')]);
      vacias.forEach(c => avisos.push(['mal', T('carpeta vacía') + ' · ' + c]));
      cab = `<div class="tc-res"><div class="lcd">${salen.length} <small>${T('carteles')}</small> ${mm(ciclo)}${vids ? ' + ' + vids + ' <small>' + T(vids > 1 ? 'vídeos' : 'vídeo') + '</small>' : ''} <small>${T('un ciclo')}</small></div>${tecla('carOrden', 'azar', T('Al azar'), p.orden !== 'fijo')}${tecla('carOrden', 'fijo', T('Fijo'), p.orden === 'fijo')}
        ${avisos.map(([c, x]) => `<span class="tc-aviso ${c}">${esc(x)}</span>`).join('')}<span class="nota">${L.length ? T('Toca un cartel para cambiar su duración o sus fechas, o dejarlo fuera; arrástralo para ordenar.') : T('Esta lista aún no tiene carteles: añádelos con «+».')}</span></div>`; }
    const ads = (p.anuncios || []).flatMap(c => (car[c] || []).map(f => c + '/' + f)).filter(f => estadoDe(p, f) === 'si').length, cada = (p.anunciosCada || [4, 7]).join('–');
    t.innerHTML = cab + `<div class="tira" role="list">${L.map((f, i) => { const e = estadoDe(p, f), a = p.archivos[f] || {}, s = segDe(p, f), marca = e === 'off' ? '◌' : e === 'caduca' ? '✕' : e === 'pronto' ? '⏳' : a.desde || a.hasta ? '📅' : '';
        const tit = nombre(f) + (e === 'caduca' ? ' · ' + T('Caducó el') + ' ' + fecha(a.hasta) : e === 'pronto' ? ' · ' + T('Sale desde el') + ' ' + fecha(a.desde) : a.hasta ? ' · ' + T('Sale hasta el') + ' ' + fecha(a.hasta) : '');
        return `<button type="button" role="listitem" class="mini car${e !== 'si' ? ' ' + e : ''}${f === elegido ? ' on' : ''}" data-a="carSel" data-v="${esc(f)}" draggable="true" title="${esc(tit)}" aria-pressed="${f === elegido}"><span class="mm">${mini(f, urlDe(f))}${marca ? `<i class="cm">${marca}</i>` : ''}</span><span class="mn">${i + 1} · ${esVideo(f) ? '▶' : (s || p.segundos) + ' s'}</span></button>`; }).join('')}
      <button type="button" class="mini mas car" data-a="carMas" title="${T('Añadir carteles')}" aria-label="${T('Añadir carteles')}"><span class="mm">+</span><span class="mn">${T('Añadir')}</span></button>
      <button type="button" class="mini ads${ads ? '' : ' vacio'}" data-a="tab" data-v="tiempos" title="${T('Anuncios')}"><span class="mm">AD<small>${ads}</small></span><span class="mn">${ads ? T('cada') + ' ' + cada : T('sin anuncios')}</span></button></div>`;
    const tr = t.querySelector('.tira'); tr.scrollLeft = sl; const on = tr.querySelector('.mini.on'); if (on && elegido !== pinta.vista) { pinta.vista = elegido; const r = on.getBoundingClientRect(), q = tr.getBoundingClientRect(); if (r.left < q.left || r.right > q.right) tr.scrollLeft += r.left - q.left - 30; }
    if (foco) { const [fa, fv, fc] = foco.split('|'), b = fc ? t.querySelector(`[data-cf="${fc}"]`) : [...t.querySelectorAll('[data-a]')].find(x => x.dataset.a === fa && (x.dataset.v || '') === fv); if (b && !b.disabled) b.focus({ preventScroll: true }); } }

  /* ---------- arrastrar para ordenar (la lista pasa a orden fijo) ---------- */
  let arr = '';
  const t0 = $('#tirac');
  const mueve = (f, antesDe) => G.cambia(p => { const L = todos(p), i = L.indexOf(f); if (i < 0) return; L.splice(i, 1); const j = antesDe ? L.indexOf(antesDe) : L.length; L.splice(j < 0 ? L.length : j, 0, f); p.secuencia = L; p.orden = 'fijo'; });
  if (t0) {
    t0.addEventListener('dragstart', e => { const c = e.target.closest && e.target.closest('.mini.car[draggable]'); if (!c) return; arr = c.dataset.v; try { e.dataTransfer.setData('text/plain', arr); e.dataTransfer.effectAllowed = 'move'; } catch (x) {} c.classList.add('arr'); });
    t0.addEventListener('dragend', () => { arr = ''; t0.querySelectorAll('.arr, .sobre').forEach(x => x.classList.remove('arr', 'sobre')); });
    t0.addEventListener('dragover', e => { if (!arr) return; const c = e.target.closest && e.target.closest('.mini.car[draggable]'); t0.querySelectorAll('.mini.sobre').forEach(x => { if (x !== c) x.classList.remove('sobre'); }); if (c && c.dataset.v !== arr) { e.preventDefault(); c.classList.add('sobre'); } });
    t0.addEventListener('drop', e => { if (!arr) return; const c = e.target.closest && e.target.closest('.mini.car[draggable]'); if (!c || c.dataset.v === arr) return; e.preventDefault(); const L = todos(P()), a = L.indexOf(arr), b = L.indexOf(c.dataset.v), f = arr; arr = ''; mueve(f, a < b ? L[b + 1] || '' : c.dataset.v); });
    /* las fechas: al elegirlas se guardan; «hasta» nunca antes que «desde» */
    t0.addEventListener('change', e => { const i = e.target; if (!i.dataset || !i.dataset.cf || !elegido) return; const f = elegido, k = i.dataset.cf, v = /^\d{4}-\d{2}-\d{2}$/.test(i.value) ? i.value : '';
      G.cambia(p => { const a = p.archivos[f] || (p.archivos[f] = {}); if (v) a[k] = v; else delete a[k]; if (a.desde && a.hasta && a.hasta < a.desde) { if (k === 'desde') a.hasta = a.desde; else a.desde = a.hasta; } if (!Object.keys(a).length) delete p.archivos[f]; }); });
  }

  /* ---------- «+»: carteles sueltos de cualquier carpeta o de «Mis imágenes» ---------- */
  let pk = null;
  function anade() { const cs = Object.keys(G.MAN.carpetas || {}).filter(c => c !== 'fondos'), p = P(), libre = cs.find(c => !(p.contenido || []).includes(c) && !G.esAds(c) && (G.MAN.carpetas[c] || []).length);
    pk = { carp: libre || cs.find(c => !G.esAds(c)) || cs[0] || '@mias', sel: new Set() }; X.abreModal('', 'm-bib m-anade', () => { pk = null; }); pkPinta(); }
  function pkPinta() { const m = $('#modal .m-caja'); if (!m || !pk) return; const p = P(), car = G.MAN.carpetas || {}, cs = Object.keys(car).filter(c => c !== 'fondos'), ya = new Set(todos(p)), st = m.querySelector('.bib-der') ? m.querySelector('.bib-der').scrollTop : 0;
    const fs = pk.carp === '@mias' ? Object.keys(G.B.medios).map(k => 'm:' + k) : (car[pk.carp] || []).map(f => pk.carp + '/' + f), entera = pk.carp !== '@mias' && (p.contenido || []).includes(pk.carp);
    const der = `<div class="fila">${pk.carp === '@mias' ? `<button type="button" class="tecla" data-a="pkSube">${T('Subir imagen')}</button>` : `<button type="button" class="tecla" data-a="pkCarpeta"${entera || !fs.length ? ' disabled' : ''}>${T('Toda la carpeta')}</button>`}<button type="button" class="tecla pri" data-a="pkAnade"${pk.sel.size ? '' : ' disabled'}>${T('Añadir')}${pk.sel.size ? ' (' + pk.sel.size + ')' : ''}</button></div>
      <div class="nota">${T('Elige los carteles que quieras y pulsa «Añadir». Con «Toda la carpeta» entra la carpeta entera, también lo que le añadas más adelante.')}</div>
      ${fs.length ? `<div class="bib-rej">${fs.map(f => { const dentro = ya.has(f), on = pk.sel.has(f); return `<button type="button" class="bf pk${on ? ' on' : ''}${dentro ? ' ya' : ''}" data-a="pkTog" data-v="${esc(f)}" aria-pressed="${on}"${dentro ? ' disabled' : ''}><span class="bf-m">${mini(f, urlDe(f))}${on ? '<b>✓</b>' : ''}</span><span class="bf-n">${esc(dentro ? T('ya está en la lista') : nombre(f))}</span></button>`; }).join('')}</div>` : `<div class="nota">${T(pk.carp === '@mias' ? 'Aún no has subido ninguna imagen.' : 'Esta carpeta no tiene archivos de ese tipo.')}</div>`}`;
    G.pon('#modal .m-caja', X.cabModal(T('Añadir carteles')) + `<div class="bib"><div class="bib-izq">${cs.map(c => tecla('pkCarp', c, esc(c), pk.carp === c, `<small>${(car[c] || []).length}</small>`)).join('')}${tecla('pkCarp', '@mias', T('Mis imágenes'), pk.carp === '@mias', `<small>${Object.keys(G.B.medios).length}</small>`)}</div><div class="bib-der">${der}</div></div>`);
    const d = m.querySelector('.bib-der'); d.scrollTop = st; }

  /* ---------- ver un cartel en grande ---------- */
  function ver(f) { X.abreModal(X.cabModal(esc(nombre(f))) + `<div class="tc-grande">${esVideo(f) ? `<video src="${esc(urlDe(f))}" autoplay muted loop playsinline></video>` : `<img src="${esc(urlDe(f))}" alt="${esc(nombre(f))}">`}</div>`, 'm-ver'); }

  Object.assign(G.ACC, {
    carSel(f) { elegido = elegido === f ? '' : f; pinta(); },
    carCierra() { elegido = ''; pinta(); const b = $('#tirac .mini.car'); b && b.focus({ preventScroll: true }); },
    carOrden(v) { G.cambia(p => { p.orden = v === 'fijo' ? 'fijo' : 'azar'; if (p.orden === 'fijo' && !p.secuencia.length) p.secuencia = todos(p); }); },
    carSeg(d) { const f = elegido; if (!f || esVideo(f)) return; G.cambia(p => { const a = p.archivos[f] || (p.archivos[f] = {}), act = +a.seg || 0, n = act ? act + +d : (+d > 0 ? p.segundos + 1 : p.segundos - 1); if (n < 2 || n === p.segundos) delete a.seg; else a.seg = lim(n, 2, 600); if (!Object.keys(a).length) delete p.archivos[f]; }); },
    carOff(f) { G.cambia(p => { const a = p.archivos[f] || (p.archivos[f] = {}); if (a.off) delete a.off; else a.off = true; if (!Object.keys(a).length) delete p.archivos[f]; }); },
    carMueve(d) { const f = elegido, L = todos(P()), i = L.indexOf(f), j = i + +d; if (i < 0 || j < 0 || j >= L.length) return; mueve(f, +d < 0 ? L[j] : L[j + 1] || ''); },
    carQuita(f) { if (!(P().sueltos || []).includes(f)) return; elegido = ''; G.cambia(p => { p.sueltos = p.sueltos.filter(x => x !== f); p.secuencia = (p.secuencia || []).filter(x => x !== f); delete p.archivos[f]; }); },
    carVer(f) { ver(f); },
    carMas() { anade(); },
    pkCarp(c) { if (!pk) return; pk.carp = c; pkPinta(); },
    pkTog(f) { if (!pk) return; pk.sel.has(f) ? pk.sel.delete(f) : pk.sel.add(f); pkPinta(); },
    pkSube() { if (!window.ADGEST) return; window.ADGEST.pide(k => { if (k && pk) { pk.sel.add('m:' + k); pkPinta(); } }); },
    pkAnade() { if (!pk || !pk.sel.size) return; const nuevos = [...pk.sel]; let n = 0; G.cambia(p => { const ya = new Set(todos(p)); p.sueltos = (p.sueltos || []).concat(nuevos.filter(f => !ya.has(f) && (n += 1))); }); X.cierraModal(); G.estado(n + ' ' + T('carteles añadidos')); },
    pkCarpeta() { if (!pk || pk.carp === '@mias') return; const c = pk.carp; G.cambia(p => { if (!p.contenido.includes(c)) p.contenido.push(c); p.sueltos = (p.sueltos || []).filter(f => f.indexOf(c + '/') !== 0); }); X.cierraModal(); G.estado(T('Carpeta añadida') + ' · ' + c); }
  });
  /* en el móvil apaisado el lienzo ocupa toda la altura a la izquierda: la tira pasa arriba de la columna de la derecha, para no comerse el lienzo */
  const apaisado = matchMedia('(max-width: 900px) and (orientation: landscape)');
  const coloca = () => { const t = $('#tirac'), c = document.querySelector('.consola'), z = document.querySelector('.lienzo-zona'); if (!t || !c || !z) return; t.classList.toggle('zona', apaisado.matches); if (apaisado.matches) { if (t.parentNode !== c) c.insertBefore(t, document.querySelector('.consola > .izq')); } else if (t.parentNode !== z) z.insertBefore(t, $('#estado')); };
  try { apaisado.addEventListener('change', coloca); } catch (e) { apaisado.addListener(coloca); } coloca();
  /* el gestor avisa de cada cambio y de cada lista nueva: se repinta la tira */
  const antesC = X.alCambiar, antesL = X.alLista;
  X.alCambiar = function () { if (antesC) antesC.apply(this, arguments); pinta(); };
  X.alLista = function () { if (antesL) antesL.apply(this, arguments); pinta(); };
  G.ext.listaCarteles = todos;
})();
