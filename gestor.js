/* ADPOSTER · gestor de playlists. Edita los ajustes de cada playlist con vista previa en vivo y guarda playlists.json.
   Los cambios se quedan en este navegador como borrador hasta que se publican (subiendo playlists.json a la web).
   Licencia GPL-3.0 · mediaservi.com */
(() => {
  'use strict';
  const VERSION = '0.2', TIPOS = ['fundido', 'zoom', 'desliza', 'cortina', 'corte'], CON_CARPETA = ['cine', 'klub'];
  const DEF = { nombre: '', fondo: '', cabecera: 18, pie: 4.5, lado: 5, alinea: 'abajo', contenido: [], anuncios: [], segundos: 8, segundosAnuncio: 8, anunciosCada: [4, 7], fundido: { tipo: 'fundido', segundos: 2.5 }, movimiento: true, llenar: false, brillo: true,
    horario: { activo: false, desde: '09:00', hasta: '23:00', dias: [1, 2, 3, 4, 5, 6, 7] }, redirige: '' };
  const $ = s => document.querySelector(s), copia = o => JSON.parse(JSON.stringify(o));
  const lee = k => { try { return JSON.parse(localStorage.getItem('adposter:' + k)); } catch (e) { return null; } }, guarda = (k, v) => { try { localStorage.setItem('adposter:' + k, JSON.stringify(v)); } catch (e) {} };

  /* ---------- idioma ---------- */
  const IDI = ['es', 'en', 'ca']; let lang = lee('lang') || (IDI.includes((navigator.language || '').slice(0, 2)) ? navigator.language.slice(0, 2) : 'es');
  const TX = { 'Playlist': ['Playlist', 'Playlist'], 'Nueva': ['New', 'Nova'], 'nombre de la nueva': ['name of the new one', 'nom de la nova'], 'Borrar': ['Delete', 'Esborra'], 'Fondo': ['Background', 'Fons'], 'sin fondo': ['no background', 'sense fons'],
    'Carpetas de contenido': ['Content folders', 'Carpetes de contingut'], 'Carpetas de anuncios': ['Ad folders', "Carpetes d'anuncis"], 'URL para el kiosco': ['URL for the kiosk', 'URL per al quiosc'], 'Copiar': ['Copy', 'Copia'], 'Copiada': ['Copied', 'Copiada'], 'Abrir': ['Open', 'Obre'],
    'Duración': ['Duration', 'Durada'], 'póster': ['poster', 'pòster'], 'anuncio': ['ad', 'anunci'], 'Transición': ['Transition', 'Transició'], 'fundido': ['fade', 'fosa'], 'zoom': ['zoom', 'zoom'], 'desliza': ['slide', 'llisca'], 'cortina': ['wipe', 'cortina'], 'corte': ['cut', 'tall'],
    'Un anuncio cada': ['One ad every', 'Un anunci cada'], 'mín': ['min', 'mín'], 'máx': ['max', 'màx'], 'pósteres': ['posters', 'pòsters'], 'Efectos y encaje': ['Effects and fit', 'Efectes i encaix'], 'Movimiento': ['Motion', 'Moviment'], 'Llenar': ['Fill', 'Omple'], 'Brillo': ['Shine', 'Brillantor'], 'Abajo': ['Bottom', 'A baix'], 'Centro': ['Centre', 'Centre'],
    'cabecera': ['header', 'capçalera'], 'Horario': ['Schedule', 'Horari'], 'En horario': ['Scheduled', 'En horari'], 'Redirección': ['Redirect', 'Redirecció'], 'https://… (vacío: reproduce la playlist)': ['https://… (empty: plays the playlist)', 'https://… (buit: reprodueix la playlist)'],
    'Guardar playlists.json': ['Save playlists.json', 'Desa playlists.json'], 'Importar': ['Import', 'Importa'], 'Restablecer': ['Reset', 'Restableix'],
    'Para publicar: guarda el archivo y súbelo a la raíz de la web. Los displays lo recogen solos en menos de 5 minutos.': ['To publish: save the file and upload it to the site root. Displays pick it up on their own within 5 minutes.', "Per publicar: desa l'arxiu i puja'l a l'arrel del web. Els displays el recullen sols en menys de 5 minuts."],
    'Publicado': ['Published', 'Publicat'], 'Cambios sin publicar': ['Unpublished changes', 'Canvis sense publicar'], 'imágenes': ['images', 'imatges'], 'es un proyecto hecho con': ['is a project made with', 'és un projecte fet amb'], 'Contenido': ['Content', 'Contingut'], 'Reproducción': ['Playback', 'Reproducció'],
    'L': ['M', 'Dl'], 'M': ['T', 'Dt'], 'X': ['W', 'Dc'], 'J': ['T', 'Dj'], 'V': ['F', 'Dv'], 'S': ['S', 'Ds'], 'D': ['S', 'Dg'] };
  const T = s => { const t = TX[s]; return !t || lang === 'es' ? s : t[lang === 'en' ? 0 : 1]; };

  /* ---------- datos ---------- */
  let MAN = { carpetas: {} }, PUB = { recarga: 1, playlists: {} }, B = null, sel = '', listo = false;
  const P = () => B.playlists[sel], carpetas = () => Object.keys(MAN.carpetas).filter(c => c !== 'fondos'), esAds = c => /^ads?[-_]/i.test(c);
  const completa = p => { const c = Object.assign({}, copia(DEF), p || {}); c.fundido = Object.assign({}, DEF.fundido, (p || {}).fundido); c.horario = Object.assign({}, copia(DEF.horario), (p || {}).horario); return c; };
  const sucio = () => JSON.stringify(B.playlists) !== JSON.stringify(PUB.playlists);
  function base() { const d = new URL('./', location.href).href; return /githack|localhost|127\.0\.0\.1/.test(location.host) ? 'https://adposter.mediaservi.com/' : d; }
  const urlKiosco = id => base() + (CON_CARPETA.includes(id) ? id : 'p/?l=' + id);
  function cambia(f) { f(P()); guarda('gestor', B); envia(); pintaB(); pintaA(); estado(); }
  function envia() { const fr = $('#previa'); if (listo && fr.contentWindow) fr.contentWindow.postMessage({ adposter: 'cfg', id: sel, cfg: P() }, '*'); }
  function previa() { listo = false; $('#previa').src = 'p/?l=' + encodeURIComponent(sel) + '&prev=1&lang=' + lang; }
  function estado() { const e = $('#estado'), s = sucio(); e.classList.toggle('sucio', s); e.lastElementChild.textContent = T(s ? 'Cambios sin publicar' : 'Publicado'); }

  /* ---------- zonas ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tecla = (a, v, txt, on, extra) => `<button type="button" class="tecla${on ? ' on' : ''}" data-a="${a}" data-v="${esc(v)}" aria-pressed="${!!on}"><i class="led"></i><span>${txt}</span>${extra || ''}</button>`;
  const paso = (a, txt) => `<div class="fila"><button type="button" class="tecla rd" data-a="${a}" data-v="-1" aria-label="−">−</button><div class="lcd">${txt}</div><button type="button" class="tecla rd" data-a="${a}" data-v="1" aria-label="+">+</button></div>`;
  function pintaA() { const p = P(), fs = (MAN.carpetas.fondos || []).map(f => f.replace(/\.[a-z0-9]+$/i, '')), cs = carpetas(), n = c => `<small>${MAN.carpetas[c].length}</small>`, foco = document.activeElement && document.activeElement.dataset ? [document.activeElement.dataset.a, document.activeElement.dataset.v] : null;
    $('#zona-a').innerHTML = `<h2>${T('Playlist')}</h2><div class="rej">${Object.keys(B.playlists).map(id => tecla('sel', id, esc(B.playlists[id].nombre || id.toUpperCase()), id === sel)).join('')}</div>
      <div class="fila"><input class="campo" id="nueva" maxlength="24" placeholder="${T('nombre de la nueva')}" aria-label="${T('nombre de la nueva')}"><button type="button" class="tecla" data-a="nueva" style="flex:none">+ ${T('Nueva')}</button><button type="button" class="tecla reset" data-a="borra" style="flex:none"${Object.keys(B.playlists).length < 2 ? ' disabled' : ''}>${T('Borrar')}</button></div>
      <h2>${T('Fondo')}</h2><div class="rej media">${fs.map(f => tecla('fondo', f, f, p.fondo === f)).join('')}${tecla('fondo', '', T('sin fondo'), !p.fondo)}</div>
      <h2>${T('Carpetas de contenido')}</h2><div class="rej ancha">${cs.filter(c => !esAds(c)).map(c => tecla('contenido', c, c, p.contenido.includes(c), n(c))).join('')}</div>
      <h2>${T('Carpetas de anuncios')}</h2><div class="rej ancha">${cs.filter(esAds).map(c => tecla('anuncios', c, c, p.anuncios.includes(c), n(c))).join('')}</div>
      <h2 style="margin-top:auto">${T('URL para el kiosco')}</h2><div class="lcd url" id="url">${esc(urlKiosco(sel))}</div><div class="fila"><button type="button" class="tecla" data-a="copia">${T('Copiar')}</button><a class="tecla" href="${CON_CARPETA.includes(sel) ? sel + '/' : 'p/?l=' + sel}" target="_blank" rel="noopener">${T('Abrir')}</a></div>`;
    if (foco && foco[0]) { const e = [...document.querySelectorAll('#zona-a [data-a="' + foco[0] + '"]')].find(x => (x.dataset.v || '') === (foco[1] || '')); e && e.focus(); } }
  function pintaB() { const p = P(), h = p.horario, D = ['L', 'M', 'X', 'J', 'V', 'S', 'D'], foco = document.activeElement && document.activeElement.dataset ? [document.activeElement.dataset.a, document.activeElement.dataset.v, document.activeElement.id] : null;
    $('#zona-b').innerHTML = `<h2>${T('Duración')}</h2>${paso('segundos', `${p.segundos} s <small>${T('póster')}</small>`)}${paso('segundosAnuncio', `${p.segundosAnuncio} s <small>${T('anuncio')}</small>`)}
      <h2>${T('Transición')}</h2><div class="rej" style="grid-template-columns:repeat(auto-fit,minmax(94px,1fr))">${TIPOS.map(t => tecla('tipo', t, T(t), p.fundido.tipo === t)).join('')}</div>${paso('fseg', `${p.fundido.segundos.toFixed(1)} s`)}
      <h2>${T('Un anuncio cada')}</h2><div class="fila"><button type="button" class="tecla rd" data-a="amin" data-v="-1">−</button><div class="lcd">${p.anunciosCada[0]} <small>${T('mín')}</small></div><button type="button" class="tecla rd" data-a="amin" data-v="1">+</button><button type="button" class="tecla rd" data-a="amax" data-v="-1">−</button><div class="lcd">${p.anunciosCada[1]} <small>${T('máx')}</small></div><button type="button" class="tecla rd" data-a="amax" data-v="1">+</button></div>
      <h2>${T('Efectos y encaje')}</h2><div class="fila">${tecla('movimiento', '', T('Movimiento'), p.movimiento)}${tecla('llenar', '', T('Llenar'), p.llenar)}${tecla('brillo', '', T('Brillo'), p.brillo)}</div><div class="fila"><button type="button" class="tecla rd" data-a="cabecera" data-v="-1" aria-label="−">−</button><div class="lcd">${p.cabecera} % <small>${T('cabecera')}</small></div><button type="button" class="tecla rd" data-a="cabecera" data-v="1" aria-label="+">+</button><button type="button" class="tecla on" data-a="alinea" style="flex:none"><i class="led"></i><span>${T(p.alinea === 'centro' ? 'Centro' : 'Abajo')}</span></button></div>
      <h2>${T('Horario')}</h2><div class="fila">${tecla('hact', '', T('En horario'), h.activo)}<input type="time" class="campo" id="hdesde" value="${esc(h.desde)}" aria-label="desde"><input type="time" class="campo" id="hhasta" value="${esc(h.hasta)}" aria-label="hasta"></div>
      <div class="fila dias">${D.map((d, i) => `<button type="button" class="tecla${h.dias.includes(i + 1) ? ' on' : ''}" data-a="dia" data-v="${i + 1}" aria-pressed="${h.dias.includes(i + 1)}">${T(d)}</button>`).join('')}</div>
      <h2>${T('Redirección')}</h2><input class="campo" id="redirige" type="url" inputmode="url" value="${esc(p.redirige || '')}" placeholder="${T('https://… (vacío: reproduce la playlist)')}" aria-label="${T('Redirección')}" style="flex:none">
      <div class="pie-zona"><button type="button" class="tecla pri" data-a="guarda">${T('Guardar playlists.json')}</button><button type="button" class="tecla" data-a="importa">${T('Importar')}</button><button type="button" class="tecla reset" data-a="reset">${T('Restablecer')}</button></div>
      <div class="nota">${T('Para publicar: guarda el archivo y súbelo a la raíz de la web. Los displays lo recogen solos en menos de 5 minutos.')}</div>`;
    if (foco) { const e = foco[2] ? document.getElementById(foco[2]) : [...document.querySelectorAll('#zona-b [data-a="' + foco[0] + '"]')].find(x => (x.dataset.v || '') === (foco[1] || '')); e && e.focus(); } }
  function pintaFijo() { document.documentElement.lang = lang; $('#btn-idioma').textContent = lang.toUpperCase(); $('#zona-a').setAttribute('aria-label', T('Contenido')); $('#zona-b').setAttribute('aria-label', T('Reproducción'));
    $('#pie').innerHTML = `ADPOSTER v${VERSION} ${new Date().getFullYear()} ${T('es un proyecto hecho con')} <i class="ic-footer" aria-hidden="true"></i> by <a href="https://mediaservi.com" target="_blank" rel="noopener">mediaservi.com</a>`; }

  /* ---------- acciones ---------- */
  const lim = (v, a, b) => Math.min(b, Math.max(a, v)), alterna = (l, v) => { const i = l.indexOf(v); i < 0 ? l.push(v) : l.splice(i, 1); };
  const ACC = {
    sel(v) { sel = v; guarda('sel', sel); pintaA(); pintaB(); previa(); },
    nueva() { const n = ($('#nueva').value || '').trim(); const id = n.normalize('NFKD').replace(/[^\w\s-]/g, '').trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 24); if (!id) { $('#nueva').focus(); return; } if (!B.playlists[id]) { B.playlists[id] = completa(copia(P())); B.playlists[id].nombre = n.toUpperCase(); } ACC.sel(id); guarda('gestor', B); estado(); },
    borra() { if (Object.keys(B.playlists).length < 2) return; delete B.playlists[sel]; guarda('gestor', B); ACC.sel(Object.keys(B.playlists)[0]); estado(); },
    fondo(v) { cambia(p => { p.fondo = v; }); }, contenido(v) { cambia(p => alterna(p.contenido, v)); }, anuncios(v) { cambia(p => alterna(p.anuncios, v)); },
    segundos(v) { cambia(p => { p.segundos = lim(p.segundos + +v, 2, 120); }); }, segundosAnuncio(v) { cambia(p => { p.segundosAnuncio = lim(p.segundosAnuncio + +v, 2, 120); }); },
    tipo(v) { cambia(p => { p.fundido.tipo = v; }); }, fseg(v) { cambia(p => { p.fundido.segundos = Math.round(lim(p.fundido.segundos + v * .5, 0, 8) * 10) / 10; }); },
    amin(v) { cambia(p => { p.anunciosCada[0] = lim(p.anunciosCada[0] + +v, 1, 30); if (p.anunciosCada[1] < p.anunciosCada[0]) p.anunciosCada[1] = p.anunciosCada[0]; }); }, amax(v) { cambia(p => { p.anunciosCada[1] = lim(p.anunciosCada[1] + +v, 1, 30); if (p.anunciosCada[0] > p.anunciosCada[1]) p.anunciosCada[0] = p.anunciosCada[1]; }); },
    movimiento() { cambia(p => { p.movimiento = !p.movimiento; }); }, llenar() { cambia(p => { p.llenar = !p.llenar; }); }, brillo() { cambia(p => { p.brillo = !p.brillo; }); }, alinea() { cambia(p => { p.alinea = p.alinea === 'centro' ? 'abajo' : 'centro'; }); }, cabecera(v) { cambia(p => { p.cabecera = lim(p.cabecera + +v, 0, 50); }); },
    hact() { cambia(p => { p.horario.activo = !p.horario.activo; }); }, dia(v) { cambia(p => { alterna(p.horario.dias, +v); p.horario.dias.sort(); }); },
    copia() { const u = urlKiosco(sel), b = document.querySelector('[data-a="copia"]'), ok = () => { b.textContent = T('Copiada'); setTimeout(() => { b.textContent = T('Copiar'); }, 1500); }; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(ok, () => { const r = document.createRange(); r.selectNodeContents($('#url')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); try { document.execCommand('copy'); ok(); } catch (e) {} }); },
    guarda() { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ recarga: PUB.recarga === undefined ? 1 : PUB.recarga, playlists: B.playlists }, null, 2) + '\n'], { type: 'application/json' })); a.download = 'playlists.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); },
    importa() { $('#archivo').click(); },
    reset() { B.playlists[sel] = PUB.playlists[sel] ? completa(copia(PUB.playlists[sel])) : Object.assign(completa(), { nombre: P().nombre }); guarda('gestor', B); envia(); pintaA(); pintaB(); estado(); },
    idioma() { lang = IDI[(IDI.indexOf(lang) + 1) % IDI.length]; guarda('lang', lang); pintaFijo(); pintaA(); pintaB(); estado(); previa(); }
  };
  document.addEventListener('click', e => { const t = e.target.closest('[data-a]'); if (t && ACC[t.dataset.a] && !t.disabled) ACC[t.dataset.a](t.dataset.v); });
  document.addEventListener('change', e => { const t = e.target; if (t.id === 'hdesde' || t.id === 'hhasta') { P().horario[t.id === 'hdesde' ? 'desde' : 'hasta'] = t.value; guarda('gestor', B); envia(); estado(); }
    else if (t.id === 'redirige') { P().redirige = t.value.trim(); guarda('gestor', B); estado(); }
    else if (t.id === 'archivo' && t.files[0]) { t.files[0].text().then(tx => { const j = JSON.parse(tx); if (!j || !j.playlists) throw 0; B = { playlists: {} }; Object.keys(j.playlists).forEach(k => { B.playlists[k] = completa(j.playlists[k]); }); guarda('gestor', B); ACC.sel(B.playlists[sel] ? sel : Object.keys(B.playlists)[0]); estado(); }).catch(() => {}); t.value = ''; } });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'nueva') ACC.nueva(); });
  addEventListener('message', e => { const d = e.data; if (d && d.adposter === 'listo' && d.id === sel) { listo = true; envia(); } });

  /* ---------- arranque ---------- */
  const trae = u => fetch(u + '?t=' + Date.now(), { cache: 'no-store' }).then(r => { if (!r.ok) throw r.status; return r.json(); });
  Promise.all([trae('assets/manifest.json').catch(() => ({ carpetas: {} })), trae('playlists.json').catch(() => ({ recarga: 1, playlists: {} }))]).then(([m, l]) => {
    MAN = m; PUB = { recarga: l.recarga, playlists: {} }; Object.keys(l.playlists || {}).forEach(k => { PUB.playlists[k] = completa(l.playlists[k]); });
    const b = lee('gestor'); B = b && b.playlists && Object.keys(b.playlists).length ? { playlists: {} } : copia({ playlists: PUB.playlists }); if (b && b.playlists) Object.keys(b.playlists).forEach(k => { B.playlists[k] = completa(b.playlists[k]); });
    if (!Object.keys(B.playlists).length) B.playlists.demo = Object.assign(completa(), { nombre: 'DEMO' });
    sel = lee('sel'); if (!B.playlists[sel]) sel = Object.keys(B.playlists)[0];
    pintaFijo(); pintaA(); pintaB(); estado(); previa();
  });
})();
