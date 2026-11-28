/* ADPOSTER · GUÍAS PASO A PASO (v1.52)
   Dos recorridos que iluminan cada botón y explican qué hacer: 1) crear una lista y dejarla funcionando en una pantalla;
   2) manejar a distancia una lista que ya está publicada. Al abrir el gestor sale una tarjeta para elegir (se apaga con «Mostrar al abrir»);
   también se lanzan desde la AYUDA («?»). No cambian nada de la app: solo señalan y, en el móvil, cambian a la vista donde está cada botón. */
(function () {
  'use strict';
  const G = window.ADG; if (!G) return;
  const ACC = G.ACC, html = document.documentElement, K = 'adposter:g-guias';
  const li = () => ({ es: 0, en: 1, ca: 2 })[G.lang] || 0, tx = a => (Array.isArray(a) ? a[li()] || a[0] : a);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const lee = () => { try { return JSON.parse(localStorage.getItem(K) || '{}') || {}; } catch (e) { return {}; } }, guarda = o => { try { localStorage.setItem(K, JSON.stringify(o)); } catch (e) {} };
  const movil = () => matchMedia('(max-width: 900px)').matches;
  const vm = v => () => { if (movil() && typeof ACC.vm === 'function') ACC.vm(v); };
  const tab = t => () => { if (typeof ACC.tab === 'function') ACC.tab(t); };
  const y = (...f) => () => f.forEach(x => x());

  /* cada paso: sel (uno o varios selectores; vale el primero que se vea), pre (lleva la app al sitio), tit y txt en es/en/ca */
  const GUIAS = {
    crear: { t: ['Crear una lista y ponerla en una pantalla', 'Create a list and put it on a screen', 'Crear una llista i posar-la en una pantalla'], pasos: [
      { sel: '#zona-listas', pre: vm('listas'), tit: ['1 · Tus listas', '1 · Your lists', '1 · Les teves llistes'],
        txt: ['Una <b>lista</b> es lo que sale en una pantalla. Aquí están todas; la que está encendida es la que editas.', 'A <b>list</b> is what a screen shows. They are all here; the lit one is the one you edit.', 'Una <b>llista</b> és el que surt en una pantalla. Aquí hi són totes; la que està encesa és la que edites.'] },
      { sel: '[data-a="asistente"]', pre: vm('listas'), tit: ['2 · Créala con el ASISTENTE', '2 · Create it with the WIZARD', '2 · Crea-la amb l’ASSISTENT'],
        txt: ['Lo más rápido: pulsa <b>ASISTENTE</b>, elige tu negocio y te crea la lista con plantillas hechas. Si prefieres empezar de cero, escribe un nombre y pulsa <b>+ Nueva</b>.', 'Quickest: press <b>WIZARD</b>, pick your business and it builds the list with ready-made templates. To start from scratch, type a name and press <b>+ New</b>.', 'El més ràpid: prem <b>ASSISTENT</b>, tria el teu negoci i et crea la llista amb plantilles fetes. Si prefereixes començar de zero, escriu un nom i prem <b>+ Nova</b>.'] },
      { sel: '#lienzo', pre: vm('lienzo'), tit: ['3 · Ponla a tu gusto', '3 · Make it yours', '3 · Posa-la al teu gust'],
        txt: ['En el lienzo ves lo que saldrá. Toca un texto para cambiarlo y arrástralo para moverlo. Abajo, en la tira, tienes las escenas: toca una para editarla.', 'The canvas shows what will appear. Tap a text to change it and drag it to move it. Below, the strip holds the scenes: tap one to edit it.', 'Al llenç veus el que sortirà. Toca un text per canviar-lo i arrossega’l per moure’l. A baix, a la tira, tens les escenes: toca’n una per editar-la.'] },
      { sel: ['[data-a="misFotos"]', '[data-a="biblio"]'], pre: vm('listas'), tit: ['4 · Tus fotos', '4 · Your photos', '4 · Les teves fotos'],
        txt: ['Con <b>Mis fotos</b> (en PRO, <b>Biblioteca</b>) subes tus imágenes y vídeos y los pones en la lista.', 'With <b>My photos</b> (in PRO, <b>Library</b>) you upload your images and videos and put them in the list.', 'Amb <b>Les meves fotos</b> (a PRO, <b>Biblioteca</b>) puges les teves imatges i vídeos i els poses a la llista.'] },
      { sel: '[data-a="probar"]', pre: vm('lienzo'), tit: ['5 · Pruébala', '5 · Try it', '5 · Prova-la'],
        txt: ['<b>▶ Probar</b> la reproduce aquí mismo, como saldrá en la pantalla. Vuelve a pulsar para parar.', '<b>▶ Play</b> runs it right here, as the screen will show it. Press again to stop.', '<b>▶ Prova</b> la reprodueix aquí mateix, com sortirà a la pantalla. Torna a prémer per parar.'] },
      { sel: null, tit: ['6 · En la tele', '6 · On the TV', '6 · A la tele'],
        txt: ['En la pantalla, abre ADPOSTER LINK (o la app de kiosco del stick, o el reproductor del display profesional) y entra en <b>adposter.mediaservi.com/tv</b>. Saldrá un <b>código de 6 caracteres</b>: déjala así y sigue en este aparato.', 'On the screen, open ADPOSTER LINK (or the stick’s kiosk app, or the professional display’s player) and go to <b>adposter.mediaservi.com/tv</b>. A <b>6-character code</b> appears: leave it there and carry on on this device.', 'A la pantalla, obre ADPOSTER LINK (o l’app de quiosc de l’stick, o el reproductor del display professional) i entra a <b>adposter.mediaservi.com/tv</b>. Sortirà un <b>codi de 6 caràcters</b>: deixa-la així i continua en aquest aparell.'] },
      { sel: '[data-a="altaPantalla"]', pre: vm('listas'), tit: ['7 · Añade la pantalla', '7 · Add the screen', '7 · Afegeix la pantalla'],
        txt: ['Pulsa <b>+ Añadir pantalla</b>, ponle un nombre, elige <b>esta lista</b> y escribe el código que sale en la tele. La pantalla se configura sola.', 'Press <b>+ Add screen</b>, give it a name, choose <b>this list</b> and type the code shown on the TV. The screen sets itself up.', 'Prem <b>+ Afegeix una pantalla</b>, posa-li un nom, tria <b>aquesta llista</b> i escriu el codi que surt a la tele. La pantalla es configura sola.'] },
      { sel: '.bt-env', pre: vm('lienzo'), tit: ['8 · Publica', '8 · Publish', '8 · Publica'],
        txt: ['Pulsa <b>✓ PUBLICAR</b>. Hasta que no publicas, las pantallas no reciben los cambios; después, la recogen solas.', 'Press <b>✓ PUBLISH</b>. Until you publish, screens do not get the changes; after that, they pick them up on their own.', 'Prem <b>✓ PUBLICA</b>. Fins que no publiques, les pantalles no reben els canvis; després, la recullen soles.'] },
      { sel: '#zona-disp', pre: vm('listas'), tit: ['9 · Funcionando', '9 · Up and running', '9 · Funcionant'],
        txt: ['Aquí ves tus pantallas. Si las conectas («Conectar las pantallas»), verás en directo cuál está encendida y qué enseña. Para manejarlas a distancia, tienes la otra guía.', 'Your screens are here. If you connect them (“Connect the screens”), you see live which one is on and what it shows. To run them remotely, see the other guide.', 'Aquí veus les teves pantalles. Si les connectes («Connecta les pantalles»), veuràs en directe quina està encesa i què ensenya. Per gestionar-les a distància, tens l’altra guia.'] }
    ] },
    remota: { t: ['Gestionar a distancia una lista publicada', 'Manage a published list remotely', 'Gestionar a distància una llista publicada'], pasos: [
      { sel: ['[data-a="canalNuevo"]', '[data-a="unirCanal"]', '#zona-disp'], pre: vm('listas'), tit: ['1 · Conecta este aparato', '1 · Connect this device', '1 · Connecta aquest aparell'],
        txt: ['Para manejar tus pantallas desde lejos, este aparato tiene que estar conectado a ellas: <b>Conectar las pantallas</b> la primera vez, o <b>Unirme a mis pantallas</b> desde otro ordenador o móvil.', 'To run your screens from afar, this device must be connected to them: <b>Connect the screens</b> the first time, or <b>Join my screens</b> from another computer or phone.', 'Per gestionar les teves pantalles des de lluny, aquest aparell hi ha d’estar connectat: <b>Connecta les pantalles</b> la primera vegada, o <b>Uneix-me a les meves pantalles</b> des d’un altre ordinador o mòbil.'] },
      { sel: '#zona-disp', pre: vm('listas'), tit: ['2 · Míralas en directo', '2 · See them live', '2 · Mira-les en directe'],
        txt: ['Cada pantalla dice qué lista enseña y si tiene señal. <b>Ver todas</b> enseña una miniatura de lo que sale en cada una; toca la miniatura para verla en grande.', 'Each screen shows which list it plays and whether it has signal. <b>See all</b> shows a thumbnail of what each one is playing; tap it to see it large.', 'Cada pantalla diu quina llista ensenya i si té senyal. <b>Mostra-les totes</b> ensenya una miniatura del que surt a cadascuna; toca-la per veure-la en gran.'] },
      { sel: '#lienzo', pre: vm('lienzo'), tit: ['3 · Cambia lo que sale', '3 · Change what plays', '3 · Canvia el que surt'],
        txt: ['Elige la lista y cámbiala aquí como siempre: textos, precios, fotos, escenas…', 'Pick the list and change it here as usual: texts, prices, photos, scenes…', 'Tria la llista i canvia-la aquí com sempre: textos, preus, fotos, escenes…'] },
      { sel: '.bt-env', pre: vm('lienzo'), tit: ['4 · Publica', '4 · Publish', '4 · Publica'],
        txt: ['Pulsa <b>✓ PUBLICAR</b>: las pantallas que enseñan esa lista se ponen al día solas, sin tocarlas.', 'Press <b>✓ PUBLISH</b>: the screens showing that list update on their own, without touching them.', 'Prem <b>✓ PUBLICA</b>: les pantalles que ensenyen aquesta llista es posen al dia soles, sense tocar-les.'] },
      { sel: '.bt-ap', pre: vm('lienzo'), tit: ['5 · Otra lista un rato', '5 · Another list for a while', '5 · Una altra llista una estona'],
        txt: ['La flecha <b>▾</b> pone <b>otra lista</b> en las pantallas que elijas durante un rato o desde una fecha, sin tocar la tuya.', 'The <b>▾</b> arrow shows <b>another list</b> on the screens you choose for a while or from a date, without touching yours.', 'La fletxa <b>▾</b> posa <b>una altra llista</b> a les pantalles que triïs durant una estona o des d’una data, sense tocar la teva.'] },
      { sel: '.aviso-bt', tit: ['6 · Un aviso al momento', '6 · An instant notice', '6 · Un avís a l’instant'],
        txt: ['<b>AVISO</b> pone un mensaje encima de lo que sale («Volvemos en 10 minutos», «Hoy cerrado»…), durante un rato o hasta una hora. Llega al instante, sin publicar.', '<b>NOTICE</b> puts a message over what is playing (“Back in 10 minutes”, “Closed today”…), for a while or until a time. It arrives instantly, without publishing.', '<b>AVÍS</b> posa un missatge a sobre del que surt («Tornem en 10 minuts», «Avui tancat»…), una estona o fins a una hora. Arriba a l’instant, sense publicar.'] },
      { sel: '.emer-bt', tit: ['7 · Emergencia', '7 · Emergency', '7 · Emergència'],
        txt: ['<b>EMERGENCIA</b> tapa todas las pantallas con un aviso grande (evacuación, incendio…) hasta que lo quitas.', '<b>EMERGENCY</b> covers every screen with a large warning (evacuation, fire…) until you remove it.', '<b>EMERGÈNCIA</b> tapa totes les pantalles amb un avís gran (evacuació, incendi…) fins que el treus.'] },
      { sel: '#zona-tabs', pre: y(tab('directo'), vm('mando')), tit: ['8 · Mando de las pantallas', '8 · Screen remote', '8 · Comandament de les pantalles'],
        txt: ['En la pestaña <b>AVISOS</b> (<b>DIRECTO</b> en PRO): encender, apagar o identificar pantallas, llamar turnos y marcar pedidos. En el panel de pantallas eliges a cuáles va (todas, un grupo, una etiqueta o una sola).', 'In the <b>ALERTS</b> tab (<b>LIVE</b> in PRO): switch screens on or off or identify them, call queue numbers and mark orders. In the screens panel you choose which ones (all, a group, a tag or just one).', 'A la pestanya <b>AVISOS</b> (<b>DIRECTE</b> a PRO): encendre, apagar o identificar pantalles, cridar torns i marcar comandes. Al panell de pantalles tries a quines va (totes, un grup, una etiqueta o una de sola).'] },
      { sel: '[data-a="agenda"]', pre: vm('listas'), tit: ['9 · Que cambie sola', '9 · Let it change on its own', '9 · Que canviï sola'],
        txt: ['En el <b>Calendario</b> decides qué lista sale cada día y a cada hora (por ejemplo, el menú de 12 a 16). Las pantallas cambian solas.', 'In the <b>Calendar</b> you decide which list plays each day and hour (the lunch menu from 12 to 4, say). Screens switch on their own.', 'Al <b>Calendari</b> decideixes quina llista surt cada dia i a cada hora (per exemple, el menú de 12 a 16). Les pantalles canvien soles.'] },
      { sel: '[data-a="mandoMovil"]', pre: y(tab('directo'), vm('mando')), tit: ['10 · En el bolsillo', '10 · In your pocket', '10 · A la butxaca'],
        txt: ['<b>📱 Mando en el móvil</b> te da un QR para llevar todo esto en el teléfono. Con <b>Solo operador</b>, tu equipo solo ve turnos, pedidos y avisos.', '<b>📱 Remote on your phone</b> gives you a QR to carry all this on your phone. With <b>Operator only</b>, your team sees just queue, orders and notices.', '<b>📱 Comandament al mòbil</b> et dona un QR per portar tot això al telèfon. Amb <b>Només operador</b>, el teu equip només veu torns, comandes i avisos.'] }
    ] }
  };

  /* ---------- el recorrido ---------- */
  let cur = null, n = 0, luz = null, card = null, raf = 0;
  const visible = e => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4 && getComputedStyle(e).visibility !== 'hidden'; };
  const fija = e => { for (let x = e; x && x !== document.body; x = x.parentElement) { const p = getComputedStyle(x).position; if (p === 'fixed' || p === 'sticky') return true; } return false; };   /* barras pegadas al borde (móvil) */
  const busca = s => { if (!s) return null; for (const q of [].concat(s)) { const e = [...document.querySelectorAll(q)].find(visible); if (e) return e; } return null; };
  function monta() { if (luz) return; luz = document.createElement('div'); luz.className = 'tr-luz'; card = document.createElement('div'); card.className = 'tr-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-live', 'polite'); document.body.append(luz, card); addEventListener('resize', situa); addEventListener('scroll', situa, true); document.addEventListener('keydown', tecla, true); }
  function quita() { if (!luz) return; luz.remove(); card.remove(); luz = card = null; cur = null; removeEventListener('resize', situa); removeEventListener('scroll', situa, true); document.removeEventListener('keydown', tecla, true); html.classList.remove('tr-on'); }
  function tecla(e) { if (!card) return; if (e.key === 'Escape') { e.preventDefault(); quita(); } else if (cur && e.key === 'ArrowRight') { e.preventDefault(); ve(n + 1); } else if (cur && e.key === 'ArrowLeft') { e.preventDefault(); ve(n - 1); } }
  function situa() { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (!card) return; const p = cur && cur.pasos[n], t = p && busca(p.sel), W = innerWidth, H = innerHeight, cw = card.offsetWidth, ch = card.offsetHeight, m = 12;
    if (!t) { luz.classList.add('tod'); luz.style.cssText = ''; card.style.left = Math.max(m, (W - cw) / 2) + 'px'; card.style.top = Math.max(m, (H - ch) / 2) + 'px'; return; }
    luz.classList.remove('tod'); const r = t.getBoundingClientRect(), pad = 6, x = Math.max(2, r.left - pad), yy = Math.max(2, r.top - pad), w = Math.min(W - 4, r.width + pad * 2), h = Math.min(H - 4, r.height + pad * 2);
    luz.style.cssText = `left:${x}px;top:${yy}px;width:${w}px;height:${h}px`;
    /* el sitio de la tarjeta que menos tapa lo iluminado: debajo, encima, a los lados y, si no cabe, la esquina que menos lo pise */
    const cl = (v, a, z) => Math.min(Math.max(v, a), z), cx = r.left + r.width / 2, X0 = m, X1 = W - cw - m, Y0 = m, Y1 = H - ch - m;
    const cand = [[cx - cw / 2, yy + h + m], [cx - cw / 2, yy - ch - m], [x + w + m, r.top], [x - cw - m, r.top], [X0, Y0], [X1, Y0], [X0, Y1], [X1, Y1]].map(([a, b]) => [cl(a, X0, Math.max(X0, X1)), cl(b, Y0, Math.max(Y0, Y1))]);
    const pisa = ([a, b]) => Math.max(0, Math.min(a + cw, x + w) - Math.max(a, x)) * Math.max(0, Math.min(b + ch, yy + h) - Math.max(b, yy));
    let best = cand[0], bp = Infinity; cand.forEach(c => { const p = pisa(c); if (p < bp - 1) { bp = p; best = c; } }); const left = best[0], top = best[1];
    card.style.left = left + 'px'; card.style.top = Math.max(m, top) + 'px'; }); }
  function ve(i) { if (!cur) return; if (i < 0) return; if (i >= cur.pasos.length) { quita(); return; } n = i; const p = cur.pasos[n];
    if (document.querySelector('#modal') && !document.querySelector('#modal').hidden && typeof ACC.modalCierra === 'function') ACC.modalCierra();
    try { p.pre && p.pre(); } catch (e) {}
    const t = busca(p.sel); if (t && t.scrollIntoView) { const r = t.getBoundingClientRect(); const H = innerHeight, lim = Math.min(H, ...[...document.querySelectorAll('#nav-m, #estado, .bots-env')].filter(e => visible(e) && fija(e)).map(e => e.getBoundingClientRect().top).filter(tp => tp > H * .5));
      if (H < 520 && r.height < H * .4) scrollBy(0, r.bottom - (lim - 8)); else if (r.top < 0 || r.bottom > lim) { t.scrollIntoView({ block: 'center' }); const r2 = t.getBoundingClientRect(); if (r2.bottom > lim) scrollBy(0, r2.bottom - lim + 8); } }   /* pantallas bajas: el botón abajo y la tarjeta arriba */
    const L = cur.pasos.length, k = li();
    card.innerHTML = `<div class="tr-cab"><span>${esc(tx(cur.t))}</span><b>${n + 1} / ${L}</b></div><h3>${esc(tx(p.tit))}</h3><p>${tx(p.txt)}</p>
      <div class="tr-bt"><button type="button" class="tecla" data-tr="sal">${['Salir', 'Exit', 'Surt'][k]}</button><span></span><button type="button" class="tecla" data-tr="ant"${n ? '' : ' disabled'}>◀</button><button type="button" class="tecla pri" data-tr="sig">${n < L - 1 ? ['Siguiente', 'Next', 'Següent'][k] + ' ▶' : ['Terminar', 'Finish', 'Acaba'][k] + ' ✓'}</button></div>`;
    situa(); setTimeout(situa, 350); const b = card.querySelector('[data-tr="sig"]'); b && b.focus({ preventScroll: true }); }
  function empieza(id) { const g = GUIAS[id]; if (!g) return; monta(); html.classList.add('tr-on'); cur = g; ve(0); }

  /* ---------- la tarjeta para elegir (al abrir y desde la AYUDA) ---------- */
  function elige() { monta(); html.classList.add('tr-on'); cur = null; luz.classList.add('tod'); luz.style.cssText = ''; const k = li(), on = !lee().off;
    card.innerHTML = `<div class="tr-cab"><span>ADPOSTER</span><b>?</b></div><h3>${['Guías paso a paso', 'Step-by-step guides', 'Guies pas a pas'][k]}</h3><p>${['Te acompaño botón a botón. ¿Qué quieres hacer?', 'I’ll walk you through it button by button. What do you want to do?', 'T’acompanyo botó a botó. Què vols fer?'][k]}</p>
      <div class="tr-op">${Object.keys(GUIAS).map((id, i) => `<button type="button" class="tecla pri" data-tr="g:${id}"><b>${i + 1}</b><span>${esc(tx(GUIAS[id].t))}</span></button>`).join('')}</div>
      <div class="tr-bt"><button type="button" class="tecla${on ? ' on' : ''}" data-tr="auto" aria-pressed="${on}"><i class="led"></i><span>${['Mostrar al abrir', 'Show on start', 'Mostra en obrir'][k]}</span></button><span></span><button type="button" class="tecla" data-tr="sal">${['Ahora no', 'Not now', 'Ara no'][k]}</button></div>`;
    situa(); const b = card.querySelector('[data-tr^="g:"]'); b && b.focus({ preventScroll: true }); }
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-tr]'); if (!b || !card || !card.contains(b)) return; const v = b.dataset.tr;
    if (v === 'sal') quita(); else if (v === 'sig') ve(n + 1); else if (v === 'ant') ve(n - 1);
    else if (v === 'auto') { const o = lee(); o.off = !o.off; guarda(o); b.classList.toggle('on', !o.off); b.setAttribute('aria-pressed', String(!o.off)); }
    else if (v.indexOf('g:') === 0) empieza(v.slice(2)); });
  Object.assign(ACC, { guias() { if (typeof ACC.modalCierra === 'function' && document.querySelector('#modal') && !document.querySelector('#modal').hidden) ACC.modalCierra(); setTimeout(elige, 80); }, guia(v) { if (!GUIAS[v]) return; if (typeof ACC.modalCierra === 'function') ACC.modalCierra(); setTimeout(() => empieza(v), 80); } });

  /* al abrir: si no está apagada, sale la tarjeta (cuando el gestor ya ha cargado y no hay otra ventana abierta) */
  const qs = new URLSearchParams(location.search);
  if (!lee().off && !qs.has('alta') && !qs.has('unir') && !html.classList.contains('md-op')) { let t = 0; const espera = setInterval(() => { t++; const m = document.querySelector('#modal');
    if (t > 240 || html.classList.contains('md-op')) { clearInterval(espera); return; } if (!G.B || (m && !m.hidden) || luz) return; clearInterval(espera); setTimeout(() => { if (!luz && !(m && !m.hidden)) elige(); }, 600); }, 500); }
  window.ADGUIAS = { GUIAS, empieza, elige, quita };
})();
