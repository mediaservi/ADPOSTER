/* ADPOSTER · service worker: instala la app y la deja lista para usarse sin conexión.
   · La app y sus datos (páginas, .js, .css, .json): primero la red, para tener siempre lo último; sin red —o si tarda—, la última copia guardada.
   · Imágenes, tipos de letra y demás archivos: la copia guardada al instante, y se renueva por detrás.
   · Lo que no es de este sitio (avisos, crédito, directo) y los vídeos y audios a trozos van siempre por la red.
   · v1.13 · Las imágenes de assets/ (también las de un origen privado, otra web) van a su propia caché, que no se borra al actualizar la app.
     Con huella (?v=…) no se vuelven a pedir nunca; sin huella, se renuevan por detrás como mucho una vez al día. El display pide guardarlas
     todas de una vez («pre») y, cuando lo tiene todo, se quitan las versiones viejas. Las listas y el índice de la otra web: primero la red y, sin red, la copia.
   Para forzar una copia nueva de la app en todos los dispositivos, sube el número de CACHE (las imágenes se conservan).
   Licencia GPL-3.0 · mediaservi.com */
const PREFIJO = 'adposter-', CACHE = PREFIJO + 'v10', CIMG = PREFIJO + 'imagenes';
const BASICO = ['./', 'index.html', 'p/', 'cine/', 'klub/', 'gestor.js', 'gestor.css', 'editor.js', 'gestion.js', 'subir.js', 'escena.js', 'escena.css', 'plantillas.js', 'player.js', 'player.css', 'directo.js', 'qr.js', 'credito.js', 'fallo.js', 'instalar.js', 'playlists.json', 'assets/manifest.json', 'manifest.json', 'assets/logos/adposter-logo.svg', 'assets/logos/adposter-icono.svg', 'assets/logos/adposter-192.png', 'assets/fonts/inter-latin-400-normal.woff2', 'assets/fonts/inter-latin-700-normal.woff2', 'assets/fonts/inter-latin-800-normal.woff2', 'assets/fonts/share-tech-mono-latin-400-normal.woff2'];   // lo mínimo para arrancar sin conexión desde la primera visita
const FRESCO = /(\/|\.html?|\.json|\.js|\.css|\.webmanifest)$/i, TOPE = 6000;
const clave = u => { const x = new URL(u, self.registration.scope); x.search = ''; x.hash = ''; return x.href; };
const vale = r => r && r.status === 200 && r.type !== 'opaque';
const IMG = /\/assets\/.+\.(webp|jpe?g|png|gif|avif)$/i, DATO = /\/(assets\/manifest|playlists)\.json$/i, DIA = 864e5;
const sirve = u => u.origin === self.location.origin || u.protocol === 'https:' || /^(localhost|127\.0\.0\.1)$/.test(u.hostname);

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => Promise.all(BASICO.map(u => fetch(new Request(u, { cache: 'reload' })).then(r => vale(r) ? c.put(clave(u), r) : 0).catch(() => 0))))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf(PREFIJO) === 0 && k !== CACHE && k !== CIMG).map(k => caches.delete(k)))).then(() => self.clients.claim())));

async function fresco(req) { const c = await caches.open(CACHE), k = clave(req.url), ya = await c.match(k);
  const red = fetch(req).then(r => { if (vale(r)) c.put(k, r.clone()).catch(() => {}); return r; });
  if (!ya) return red;                                                    // nunca se ha guardado: no queda otra que esperar a la red
  red.catch(() => {});
  return Promise.race([red, new Promise((_, no) => setTimeout(no, TOPE))]).catch(() => ya); }   // sin red o red lenta: la copia guardada
async function guardado(req) { const c = await caches.open(CACHE), ya = await c.match(req.url);
  const red = fetch(req).then(async r => { if (vale(r)) { const viejas = await c.keys(clave(req.url), { ignoreSearch: true }); await Promise.all(viejas.filter(q => q.url !== req.url && clave(q.url) === clave(req.url)).map(q => c.delete(q))); await c.put(req.url, r.clone()); } return r; });
  if (ya) { red.catch(() => {}); return ya; }
  return red.catch(async () => (await c.match(clave(req.url), { ignoreSearch: true })) || Response.error()); }

/* imágenes de assets/: se descargan con CORS si son de otra web (así se guarda la copia de verdad; una respuesta opaca no se puede comprobar y ocupa muchísimo) */
async function bajaImg(c, href) { const x = new URL(href), r = await fetch(new Request(href, x.origin === self.location.origin ? {} : { mode: 'cors', credentials: 'omit' }));
  if (!vale(r)) return r; const h = new Headers(r.headers); h.set('x-sw', String(Date.now())); const b = await r.blob();
  await c.put(href, new Response(b, { status: 200, statusText: 'OK', headers: h })); return new Response(b, { status: 200, statusText: 'OK', headers: h }); }
async function imagen(req) { const c = await caches.open(CIMG), u = new URL(req.url), ya = await c.match(req.url);
  if (ya) { if (!u.searchParams.has('v') && Date.now() - (+ya.headers.get('x-sw') || 0) > DIA) bajaImg(c, req.url).catch(() => {}); return ya; }   // con huella no caduca nunca
  try { const r = await bajaImg(c, req.url); if (r.ok) return r; } catch (x) {}
  const otra = await c.match(clave(req.url), { ignoreSearch: true }); if (otra) return otra;                                   // sin red: la versión anterior de esa imagen
  return fetch(req); }                                                                                                        // última opción: como la pide la página, sin guardarla

self.addEventListener('fetch', e => { const r = e.request; if (r.method !== 'GET' || r.headers.has('range')) return; const u = new URL(r.url);
  if (IMG.test(u.pathname) && sirve(u)) { e.respondWith(imagen(r)); return; }
  if (u.origin !== self.location.origin) { if (DATO.test(u.pathname) && sirve(u)) e.respondWith(fresco(r)); return; }       // listas e índice de un origen privado
  e.respondWith(r.mode === 'navigate' || FRESCO.test(u.pathname) ? fresco(r) : guardado(r)); });

/* la página pide guardar lo que ha cargado (y lo que vaya a necesitar) para tenerlo sin conexión */
self.addEventListener('message', e => { const d = e.data || {}, puerto = e.ports && e.ports[0], quien = e.source; if (d.t !== 'pre' || !Array.isArray(d.urls)) return;
  e.waitUntil((async () => { const c = await caches.open(CACHE), ci = await caches.open(CIMG);
    const urls = [...new Set(d.urls.map(u => { try { const x = new URL(u, self.registration.scope); return sirve(x) ? x.href : ''; } catch (y) { return ''; } }).filter(Boolean))];
    let ok = 0, mal = 0, n = 0; const avisa = fin => { try { quien && quien.postMessage({ t: 'pre-prog', id: d.id || '', ok, mal, total: urls.length, fin: !!fin }); } catch (y) {} };
    const una = async u => { const x = new URL(u); try {
        if (IMG.test(x.pathname)) { if (await ci.match(u)) { ok++; return; } const r = await bajaImg(ci, u); if (r.ok) ok++; else mal++; return; }
        if (x.origin !== self.location.origin) { mal++; return; }
        const k = FRESCO.test(x.pathname) ? clave(u) : u; if (await c.match(k)) { ok++; return; } const r = await fetch(u, { cache: 'no-cache' }); if (vale(r)) { await c.put(k, r); ok++; } else mal++;
      } catch (y) { mal++; } finally { if (++n % 20 === 0) avisa(false); } };
    avisa(false); for (let i = 0; i < urls.length; i += 4) await Promise.all(urls.slice(i, i + 4).map(una));
    if (d.limpia && !mal) { const quedan = new Set(urls); for (const q of await ci.keys()) if (!quedan.has(q.url)) await ci.delete(q); }   // con todo guardado, fuera versiones viejas y lo que ya no sale en ninguna lista
    avisa(true); if (puerto) puerto.postMessage({ t: 'fin', ok, total: (await c.keys()).length + (await ci.keys()).length }); })()); });
