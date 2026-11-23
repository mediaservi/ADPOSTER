/* ADPOSTER · FOTO · inteligencia artificial y PSD (v1.18, tanda 3) · GPL-3.0 · mediaservi.com
   Quitar el fondo (U²-Net, Apache-2.0), borrar un objeto pintándolo (MI-GAN, MIT), ampliar ×2 o ×4 (waifu2x foto, MIT),
   reparar una foto antigua (arañazos con MI-GAN, grano con waifu2x y color desvaído) y colorear (DeOldify, MIT).
   Todo en el navegador con onnxruntime-web (MIT): con WebGPU si lo hay y, si no, en la CPU. Los modelos se descargan una vez
   (solo cuando se usan) y quedan guardados en el navegador. Abrir y guardar PSD con capas y grupos (ag-psd, MIT). */
(function () {
  'use strict';
  const F = window.ADFOTO_; if (!F) return;
  const { EXT, T, TX, esc, tecla, desl, lienzo, ctx, PX } = F;
  Object.assign(TX, {
    'Con IA': ['With AI', 'Amb IA'], 'Quitar el fondo': ['Remove background', 'Treu el fons'], 'Borrar un objeto': ['Erase an object', 'Esborra un objecte'], 'Ampliar ×2': ['Upscale ×2', 'Amplia ×2'], 'Ampliar ×4': ['Upscale ×4', 'Amplia ×4'],
    'Reparar foto antigua': ['Restore old photo', 'Repara una foto antiga'], 'Colorear': ['Colorize', 'Acoloreix'], 'Borrar lo pintado': ['Erase what you painted', 'Esborra el que has pintat'], 'Limpiar': ['Clear', 'Neteja'],
    'Pinta encima de lo que quieras quitar y pulsa «Borrar lo pintado».': ['Paint over what you want to remove and press «Erase what you painted».', 'Pinta damunt del que vulguis treure i prem «Esborra el que has pintat».'],
    'Tamaño del pincel': ['Brush size', 'Mida del pinzell'], 'descargando el modelo (solo la primera vez)': ['downloading the model (first time only)', 'baixant el model (només la primera vegada)'], 'preparando…': ['getting ready…', 'preparant…'],
    'Todo en tu navegador. Cada modelo se descarga solo la primera vez que lo usas.': ['All in your browser. Each model downloads only the first time you use it.', 'Tot al teu navegador. Cada model es baixa només la primera vegada que el fas servir.'],
    'El fondo se oculta con una máscara de capa: retócala con el pincel o el borrador (pintando en la máscara).': ['The background is hidden with a layer mask: touch it up with the brush or eraser (painting on the mask).', 'El fons s’amaga amb una màscara de capa: retoca-la amb el pinzell o la goma (pintant a la màscara).'],
    'Borde': ['Edge', 'Vora'], 'Arañazos': ['Scratches', 'Ratllades'], 'Quitar grano': ['Remove grain', 'Treu el gra'], 'Color desvaído': ['Faded colour', 'Color esvaït'], 'Reparar': ['Restore', 'Repara'],
    'Pinta antes lo que quieras borrar.': ['Paint first what you want to erase.', 'Pinta primer el que vulguis esborrar.'], 'La imagen ampliada sería demasiado grande (máximo 8192 px de lado).': ['The upscaled image would be too large (8192 px per side at most).', 'La imatge ampliada seria massa gran (màxim 8192 px de costat).'],
    'Puede tardar unos minutos.': ['It may take a few minutes.', 'Pot trigar uns minuts.'], 'No se ha podido: ': ['It did not work: ', 'No s’ha pogut: '], 'Hecho': ['Done', 'Fet'], 'Cancelar': ['Cancel', 'Cancel·la'], 'Abriendo el PSD…': ['Opening the PSD…', 'Obrint el PSD…'],
    'Ampliando': ['Upscaling', 'Ampliant'], 'Coloreando': ['Colorizing', 'Acolorint'], 'Reparando': ['Restoring', 'Reparant'], 'Quitando el fondo': ['Removing the background', 'Traient el fons'], 'Borrando': ['Erasing', 'Esborrant'],
    'Intensidad del color': ['Colour strength', 'Intensitat del color'], 'Funciona mejor con fotos en blanco y negro.': ['Works best on black and white photos.', 'Funciona millor amb fotos en blanc i negre.'],
    'Sin arañazos a la vista: he quitado el grano y avivado el color.': ['No visible scratches: grain removed and colour revived.', 'Sense ratllades a la vista: he tret el gra i avivat el color.']
  });
  const A = () => F.D && F.D.capas[F.act], esperar = () => new Promise(r => setTimeout(r, 0));
  const BASE = new URL('../assets/ia/', location.href).href, ORT = new URL('ort/', location.href).href, CACHE = 'ia-adposter-v1';
  const MOD = { fondo: ['fondo-u2netp.onnx', 4.6], borrar: ['borrar-migan.onnx', 28], ampliar: ['ampliar-waifu2x.onnx', 2.2], ruido: ['ruido-waifu2x.onnx', 1.2], colorear: ['colorear-deoldify.onnx', 64] };
  const carga = u => new Promise((ok, ko) => { if (document.querySelector('script[src="' + u + '"]')) return ok(); const s = document.createElement('script'); s.src = u; s.onload = ok; s.onerror = () => ko(new Error(u)); document.head.appendChild(s); });
  let ortP = null; const ortL = () => ortP || (ortP = carga(ORT + 'ort.webgpu.min.js?v=1.18').then(() => { const o = window.ort; o.env.wasm.wasmPaths = ORT; o.env.wasm.numThreads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 2) : 1; o.env.logLevel = 'error'; return o; }));
  /* el aviso de lo que está haciendo (encima de la imagen y abajo, en el estado) */
  function aviso(t) { F.estado(t); const e = document.getElementById('fo-espera'); if (e) e.textContent = t; }
  async function bytes(k, msg) { const u = BASE + MOD[k][0]; let c = null; try { c = await caches.open(CACHE); const r = await c.match(u); if (r) return new Uint8Array(await r.arrayBuffer()); } catch (e) {}
    const r = await fetch(u); if (!r.ok) throw new Error(MOD[k][0]); const tot = +r.headers.get('content-length') || MOD[k][1] * 1048576; const rd = r.body.getReader(), P = []; let n = 0, t0 = 0;
    for (;;) { const { done, value } = await rd.read(); if (done) break; P.push(value); n += value.length; if (performance.now() - t0 > 150) { t0 = performance.now(); aviso(msg + ' · ' + T('descargando el modelo (solo la primera vez)') + ' ' + Math.min(99, Math.round(n / tot * 100)) + ' %'); } }
    const b = new Uint8Array(n); let o = 0; P.forEach(p => { b.set(p, o); o += p.length; }); try { if (c) await c.put(u, new Response(b, { headers: { 'content-type': 'application/octet-stream' } })); } catch (e) {} return b; }
  const SES = {};
  async function sesion(k, msg, cpu) { const key = k + (cpu ? ':cpu' : ''); if (SES[key]) return SES[key]; const o = await ortL(), b = await bytes(k, msg); aviso(msg + ' · ' + T('preparando…')); await esperar();
    const eps = !cpu && navigator.gpu ? ['webgpu', 'wasm'] : ['wasm']; try { SES[key] = await o.InferenceSession.create(b, { executionProviders: eps, graphOptimizationLevel: 'all', logSeverityLevel: 3 }); } catch (e) { if (cpu) throw e; return sesion(k, msg, true); } return SES[key]; }
  async function corre(k, feeds, msg) { let s = SES[k + ':cpu'] || await sesion(k, msg); try { const r = await s.run(feeds); return r[s.outputNames[0]]; } catch (e) { if (SES[k + ':cpu'] === s) throw e; s = await sesion(k, msg, true); const r = await s.run(feeds); return r[s.outputNames[0]]; } }
  /* una tarea de IA: la espera, los avisos y el fallo */
  let ocupado = false;
  async function tarea(msg, fn) { if (ocupado || !F.D) return; ocupado = true; F.espera(true); aviso(msg + '…'); await esperar(); try { await fn(); F.estado(T('Hecho') + ' · ' + msg); } catch (e) { console.warn(e); F.estado(T('No se ha podido: ') + msg + ' (' + (e && e.message || e) + ')'); } finally { F.espera(false); ocupado = false; } }
  /* de un lienzo a tensores y vuelta */
  function chw(c, w, h, f) { const t = lienzo(w, h), q = ctx(t); q.drawImage(c, 0, 0, w, h); const d = q.getImageData(0, 0, w, h).data, n = w * h, o = new Float32Array(3 * n); for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) o[k * n + i] = f(d[i * 4 + k], k); return o; }
  function aLienzo(arr, w, h, f) { const c = lienzo(w, h), q = ctx(c), im = q.createImageData(w, h), d = im.data, n = w * h; for (let i = 0; i < n; i++) { for (let k = 0; k < 3; k++) d[i * 4 + k] = f(arr[k * n + i]); d[i * 4 + 3] = 255; } q.putImageData(im, 0, 0); return c; }
  /* ---------- quitar el fondo: máscara de capa con U²-Net ---------- */
  const OI = Object.assign({ borde: 50, tam: 60, ara: 50, grano: 1, color: 40, col: 100 }, F.lee('foto-ia') || {}); const guardaO = () => F.guarda('foto-ia', OI);
  async function quitaFondo() { await tarea(T('Quitando el fondo'), async () => { const o = await ortL(), c = A(), S = 320, d0 = chw(c.cv, S, S, v => v), M = [.485, .456, .406], SD = [.229, .224, .225]; let mx = 1; for (let i = 0; i < d0.length; i++) if (d0[i] > mx) mx = d0[i];
      const n = S * S, x = new Float32Array(3 * n); for (let k = 0; k < 3; k++) for (let i = 0; i < n; i++) x[k * n + i] = (d0[k * n + i] / mx - M[k]) / SD[k];
      const y = (await corre('fondo', { 'input.1': new o.Tensor('float32', x, [1, 3, S, S]) }, T('Quitando el fondo'))).data; let lo = 1e9, hi = -1e9; for (let i = 0; i < n; i++) { if (y[i] < lo) lo = y[i]; if (y[i] > hi) hi = y[i]; }
      const b = OI.borde / 100, a0 = .5 - .45 * (1 - b), a1 = .5 + .45 * (1 - b), m0 = lienzo(S, S), q0 = ctx(m0), im = q0.createImageData(S, S);   /* borde: 0 suave … 100 duro */
      for (let i = 0; i < n; i++) { const v = (y[i] - lo) / Math.max(1e-6, hi - lo), a = Math.max(0, Math.min(1, (v - a0) / Math.max(.02, a1 - a0))); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = 255; im.data[i * 4 + 3] = Math.round(a * 255); } q0.putImageData(im, 0, 0);
      const D = F.D, m = lienzo(D.w, D.h), q = m.getContext('2d'); q.imageSmoothingQuality = 'high'; q.drawImage(m0, 0, 0, D.w, D.h); if (c.mask) { q.globalCompositeOperation = 'destination-in'; q.drawImage(c.mask, 0, 0); }
      D.capas[F.act] = Object.assign({}, c, { mask: m }); F.compone(); F.paso(T('Quitar el fondo')); F.pinta(); F.pintaTab(); }); }
  /* ---------- ampliar ×2 (waifu2x foto con quitar ruido suave), por teselas ---------- */
  async function waifu(k, cv, msg, esc2, pr) { const o = await ortL(), W = cv.width, H = cv.height, P = 7, TS = 160, out = lienzo(W * esc2, H * esc2), oq = ctx(out);
    const pad = lienzo(W + 2 * P, H + 2 * P), pq = pad.getContext('2d'); pq.drawImage(cv, P, P); pq.drawImage(cv, 0, 0, 1, H, 0, P, P, H); pq.drawImage(cv, W - 1, 0, 1, H, W + P, P, P, H); pq.drawImage(pad, 0, P, W + 2 * P, 1, 0, 0, W + 2 * P, P); pq.drawImage(pad, 0, H + P - 1, W + 2 * P, 1, 0, H + P, W + 2 * P, P);
    const nt = Math.ceil(W / TS) * Math.ceil(H / TS); let hecho = 0;
    for (let ty = 0; ty < H; ty += TS) for (let tx = 0; tx < W; tx += TS) { const w = Math.min(TS, W - tx), h = Math.min(TS, H - ty), iw = w + 2 * P, ih = h + 2 * P, t = lienzo(iw, ih); t.getContext('2d').drawImage(pad, tx, ty, iw, ih, 0, 0, iw, ih);
      const y = await corre(k, { entrada: new o.Tensor('float32', chw(t, iw, ih, v => v / 255), [1, 3, ih, iw]) }, msg), [, , oh, ow] = y.dims; oq.drawImage(aLienzo(y.data, ow, oh, v => Math.max(0, Math.min(255, Math.round(v * 255)))), tx * esc2, ty * esc2);
      hecho++; if (pr) pr(hecho / nt); }
    /* la transparencia se amplía aparte (la red solo ve el color) */
    const ad = ctx(cv).getImageData(0, 0, W, H).data; let trans = false; for (let i = 3; i < ad.length; i += 4 * 7) if (ad[i] < 255) { trans = true; break; }
    if (trans) { const al = lienzo(W * esc2, H * esc2), aq = al.getContext('2d'); aq.imageSmoothingQuality = 'high'; aq.drawImage(cv, 0, 0, W * esc2, H * esc2); oq.globalCompositeOperation = 'destination-in'; oq.drawImage(al, 0, 0); oq.globalCompositeOperation = 'source-over'; }
    return out; }
  async function amplia(f) { const D = F.D; if (D.w * f > 8192 || D.h * f > 8192) { F.estado(T('La imagen ampliada sería demasiado grande (máximo 8192 px de lado).')); return; }
    const msg = T(f === 2 ? 'Ampliar ×2' : 'Ampliar ×4'); await tarea(msg, async () => { let cur = D.capas.map(c => Object.assign({}, c)), w = D.w, h = D.h; const pasadas = f === 4 ? 2 : 1, total = cur.length * pasadas; let j = 0;
      for (let p = 0; p < pasadas; p++) { for (let i = 0; i < cur.length; i++) { const c = cur[i], base = j / total; cur[i] = Object.assign({}, c, { cv: await waifu('ampliar', c.cv, msg, 2, r => aviso(msg + ' · ' + Math.round((base + r / total) * 100) + ' %' + (f === 4 || D.w * D.h > 1e6 ? ' · ' + T('Puede tardar unos minutos.') : ''))) }); j++;
          if (c.mask) { const m = lienzo(w * 2, h * 2), q = m.getContext('2d'); q.imageSmoothingQuality = 'high'; q.drawImage(c.mask, 0, 0, w * 2, h * 2); cur[i].mask = m; }
          if (c.txt) cur[i].txt = Object.assign({}, c.txt, { tam: c.txt.tam * 2, x: c.txt.x * 2, y: c.txt.y * 2, contorno: (c.txt.contorno || 0) * 2 }); }
        w *= 2; h *= 2; }
      D.capas = cur; D.w = w; D.h = h; EXT.sel = null; F.compone(); F.paso(msg); F.encaja(); F.pintaTab(); }); }
  /* ---------- borrar un objeto: se pinta encima y MI-GAN rellena ---------- */
  let MB = null, trB = null; const mb = () => { const D = F.D; if (!MB || MB.width !== D.w || MB.height !== D.h) MB = lienzo(D.w, D.h); return MB; };
  function cajaM(m, pad) { const w = m.width, h = m.height, k = Math.min(1, 600 / Math.max(w, h)), sw = Math.max(1, Math.round(w * k)), sh = Math.max(1, Math.round(h * k)), c = lienzo(sw, sh), q = ctx(c); q.drawImage(m, 0, 0, sw, sh); const a = q.getImageData(0, 0, sw, sh).data; let x0 = sw, y0 = sh, x1 = -1, y1 = -1;
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) if (a[(y * sw + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } if (x1 < 0) return null;
    const X = Math.max(0, Math.floor(x0 / k) - pad), Y = Math.max(0, Math.floor(y0 / k) - pad); return [X, Y, Math.min(w, Math.ceil((x1 + 1) / k) + pad) - X, Math.min(h, Math.ceil((y1 + 1) / k) + pad) - Y]; }
  /* MI-GAN: la imagen (uint8) y la máscara (255 = se conserva, 0 = se rellena); en un recorte alrededor de lo pintado, a ≤ 1024 px */
  async function rellena(src, mask, msg) { const o = await ortL(), W = src.width, H = src.height, b = cajaM(mask, Math.round(Math.max(W, H) * .04) + 24); if (!b) return null; let [X, Y, w, h] = b;
    const ex = Math.round(Math.max(w, h) * .6); X = Math.max(0, X - ex); Y = Math.max(0, Y - ex); w = Math.min(W - X, w + 2 * ex); h = Math.min(H - Y, h + 2 * ex);
    const k = Math.min(1, 1024 / Math.max(w, h)), sw = Math.max(8, Math.round(w * k)), sh = Math.max(8, Math.round(h * k)), n = sw * sh;
    const ci = lienzo(sw, sh), cq = ctx(ci); cq.drawImage(src, X, Y, w, h, 0, 0, sw, sh); const id = cq.getImageData(0, 0, sw, sh).data, im = new Uint8Array(3 * n); for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) im[c * n + i] = id[i * 4 + c];
    const cm = lienzo(sw, sh), mq = ctx(cm); mq.filter = 'blur(' + Math.max(1, Math.round(3 * k)) + 'px)'; mq.drawImage(mask, X, Y, w, h, 0, 0, sw, sh); mq.filter = 'none'; const md = mq.getImageData(0, 0, sw, sh).data, mk = new Uint8Array(n); for (let i = 0; i < n; i++) mk[i] = md[i * 4 + 3] > 10 ? 0 : 255;
    const y = await corre('borrar', { image: new o.Tensor('uint8', im, [1, 3, sh, sw]), mask: new o.Tensor('uint8', mk, [1, 1, sh, sw]) }, msg), [, , oh, ow] = y.dims, r = aLienzo(y.data, ow, oh, v => v);
    /* se pega solo lo pintado (con el borde suave), a su tamaño real */
    const pz = lienzo(w, h), pq = pz.getContext('2d'); pq.imageSmoothingQuality = 'high'; pq.drawImage(r, 0, 0, w, h); const mm = lienzo(w, h), m2 = mm.getContext('2d'); m2.filter = 'blur(2px)'; m2.drawImage(mask, X, Y, w, h, 0, 0, w, h); m2.filter = 'none'; m2.globalCompositeOperation = 'source-in'; m2.fillStyle = '#000'; m2.fillRect(0, 0, w, h);
    const ma = lienzo(w, h), aq = ma.getContext('2d'); aq.filter = 'blur(' + Math.max(1, Math.round(2 / k)) + 'px)'; for (let i = 0; i < 2; i++) aq.drawImage(mm, 0, 0); aq.filter = 'none'; pq.globalCompositeOperation = 'destination-in'; pq.drawImage(ma, 0, 0);
    const out = lienzo(W, H), oq = out.getContext('2d'); oq.drawImage(src, 0, 0); oq.drawImage(pz, X, Y); return out; }
  async function borraObjeto() { if (!MB || !cajaM(MB, 0)) { F.estado(T('Pinta antes lo que quieras borrar.')); return; } await tarea(T('Borrando'), async () => { const c = A(), r = await rellena(c.cv, MB, T('Borrando')); if (!r) return; const D = F.D;
      D.capas[F.act] = Object.assign({}, c, { cv: r }); MB = null; F.compone(); F.paso(T('Borrar un objeto')); F.pinta(); F.pintaTab(); }); }
  function trazoB(x, y) { const q = mb().getContext('2d'), r = OI.tam / 2; q.fillStyle = '#fff'; q.lineCap = 'round'; q.lineWidth = OI.tam; q.strokeStyle = '#fff'; q.beginPath(); q.moveTo(trB[0], trB[1]); q.lineTo(x, y); q.stroke(); q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill(); trB = [x, y]; F.pinta(); }
  let rojo = null; EXT.herr.quitaobj = { ic: '⊘', n: 'Borrar un objeto', tecla: 'o', cursor: 1,
    down(x, y) { if (!F.D) return; trB = [x, y]; trazoB(x, y); }, move(x, y) { if (trB) trazoB(x, y); }, up() { trB = null; },
    pinta(vx, V) { if (!MB || !F.D) return; if (!rojo || rojo.width !== MB.width || rojo.height !== MB.height) rojo = lienzo(MB.width, MB.height); const q = rojo.getContext('2d'); q.globalCompositeOperation = 'copy'; q.drawImage(MB, 0, 0); q.globalCompositeOperation = 'source-in'; q.fillStyle = 'rgba(255,40,80,.5)'; q.fillRect(0, 0, rojo.width, rojo.height); q.globalCompositeOperation = 'source-over';
      vx.drawImage(rojo, V.x, V.y, F.D.w * V.z, F.D.h * V.z); },
    panel: () => '<div class="fo-sec"><h3>' + T('Borrar un objeto') + '</h3><p class="fo-nota">' + T('Pinta encima de lo que quieras quitar y pulsa «Borrar lo pintado».') + '</p>' + desl('ia-tam', 'Tamaño del pincel', 4, 300, OI.tam) +
      '<div class="fo-acc">' + tecla('ia-limpia', T('Limpiar')) + tecla('ia-borra', '⊘ ' + T('Borrar lo pintado'), { cls: 'pri' }) + '</div></div>' };
  EXT.orden.push('quitaobj');
  /* ---------- reparar foto antigua: arañazos y motas (MI-GAN), grano (waifu2x) y color desvaído ---------- */
  function mascaraArañazos(cv, sens) { const k = Math.min(1, 1024 / Math.max(cv.width, cv.height)), w = Math.max(8, Math.round(cv.width * k)), h = Math.max(8, Math.round(cv.height * k)), c = lienzo(w, h), q = ctx(c); q.drawImage(cv, 0, 0, w, h); const d = q.getImageData(0, 0, w, h).data, n = w * h, L = new Float32Array(n);
    for (let i = 0; i < n; i++) L[i] = .299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2];
    const filtro = (src, r, fmax) => { const t = new Float32Array(n), o = new Float32Array(n); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let v = fmax ? -1e9 : 1e9; for (let j = -r; j <= r; j++) { const xx = Math.min(w - 1, Math.max(0, x + j)), s = src[y * w + xx]; v = fmax ? Math.max(v, s) : Math.min(v, s); } t[y * w + x] = v; }
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let v = fmax ? -1e9 : 1e9; for (let j = -r; j <= r; j++) { const yy = Math.min(h - 1, Math.max(0, y + j)), s = t[yy * w + x]; v = fmax ? Math.max(v, s) : Math.min(v, s); } o[y * w + x] = v; } return o; };
    const r = 3, ab = filtro(filtro(L, r, false), r, true), ci = filtro(filtro(L, r, true), r, false), S = new Float32Array(n); for (let i = 0; i < n; i++) S[i] = Math.max(L[i] - ab[i], ci[i] - L[i]);   /* lo fino y claro (arañazos) o fino y oscuro (motas) */
    let th = 60 - sens * .42; const tope = n * .05; for (let it = 0; it < 12; it++) { let cnt = 0; for (let i = 0; i < n; i++) if (S[i] > th) cnt++; if (cnt <= tope) break; th *= 1.18; }
    /* solo lo que tiene forma de arañazo (largo y fino) o de mota (muy pequeño): las letras y los bordes de las cosas se quedan */
    const B = new Uint8Array(n); for (let i = 0; i < n; i++) B[i] = S[i] > th ? 1 : 0; const vis = new Int32Array(n), keep = new Uint8Array(n), pila = new Int32Array(n); let hay = 0;
    for (let s0 = 0; s0 < n; s0++) { if (!B[s0] || vis[s0]) continue; let sp = 0, area = 0, x0 = w, y0 = h, x1 = 0, y1 = 0; pila[sp++] = s0; vis[s0] = 1; const comp = [];
      while (sp) { const p = pila[--sp], px = p % w, py = (p / w) | 0; comp.push(p); area++; if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const qx = px + dx, qy = py + dy; if (qx < 0 || qy < 0 || qx >= w || qy >= h) continue; const q = qy * w + qx; if (B[q] && !vis[q]) { vis[q] = 1; pila[sp++] = q; } } }
      const bw = x1 - x0 + 1, bh = y1 - y0 + 1, largo = Math.max(bw, bh), lleno = area / (bw * bh);
      if (area <= 12 || (largo >= Math.max(24, Math.min(w, h) * .05) && lleno < .3)) { comp.forEach(p => { keep[p] = 1; }); hay += area; } }
    if (!hay) return null; const m = lienzo(w, h), mq = m.getContext('2d'), im = mq.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let v = 0; for (let dy = -2; dy <= 2 && !v; dy++) for (let dx = -2; dx <= 2; dx++) { const qx = x + dx, qy = y + dy; if (qx >= 0 && qy >= 0 && qx < w && qy < h && keep[qy * w + qx]) { v = 1; break; } } if (v) { const i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = im.data[i + 3] = 255; } }   /* dos píxeles más de margen: que no quede ni el halo del arañazo */
    mq.putImageData(im, 0, 0); const big = lienzo(cv.width, cv.height), bq = big.getContext('2d'); bq.imageSmoothingEnabled = false; bq.drawImage(m, 0, 0, cv.width, cv.height); return big; }
  async function reparar() { await tarea(T('Reparando'), async () => { const c = A(); let cv = c.cv, ara = false;
      if (OI.ara > 0) { aviso(T('Reparando') + ' · ' + T('Arañazos')); await esperar(); const m = mascaraArañazos(cv, OI.ara); if (m) { const r = await rellenaTodo(cv, m); if (r) { cv = r; ara = true; } } }
      if (+OI.grano) cv = await waifu('ruido', cv, T('Reparando'), 1, p => aviso(T('Reparando') + ' · ' + T('Quitar grano') + ' ' + Math.round(p * 100) + ' %'));
      if (OI.color > 0) { const q = ctx(cv), im = q.getImageData(0, 0, cv.width, cv.height), o = PX.automatica(im, { fuerza: OI.color }), out = lienzo(cv.width, cv.height); out.getContext('2d').putImageData(o, 0, 0); cv = out; }
      const D = F.D; D.capas[F.act] = Object.assign({}, c, { cv }); F.compone(); F.paso(T('Reparar foto antigua')); F.pinta(); F.pintaTab(); if (!ara && OI.ara > 0) F.estado(T('Sin arañazos a la vista: he quitado el grano y avivado el color.')); }); }
  /* para los arañazos la máscara cubre toda la foto: MI-GAN la ve entera (a ≤ 1024 px) y se pega solo lo arañado */
  async function rellenaTodo(src, mask) { const o = await ortL(), W = src.width, H = src.height, k = Math.min(1, 1024 / Math.max(W, H)), sw = Math.max(8, Math.round(W * k)), sh = Math.max(8, Math.round(H * k)), n = sw * sh;
    const ci = lienzo(sw, sh), cq = ctx(ci); cq.drawImage(src, 0, 0, sw, sh); const id = cq.getImageData(0, 0, sw, sh).data, im = new Uint8Array(3 * n); for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) im[c * n + i] = id[i * 4 + c];
    const cm = lienzo(sw, sh), mq = ctx(cm); mq.drawImage(mask, 0, 0, sw, sh); const md = mq.getImageData(0, 0, sw, sh).data, mk = new Uint8Array(n); for (let i = 0; i < n; i++) mk[i] = md[i * 4 + 3] > 20 ? 0 : 255;
    const y = await corre('borrar', { image: new o.Tensor('uint8', im, [1, 3, sh, sw]), mask: new o.Tensor('uint8', mk, [1, 1, sh, sw]) }, T('Reparando')), [, , oh, ow] = y.dims, r = aLienzo(y.data, ow, oh, v => v);
    const pz = lienzo(W, H), pq = pz.getContext('2d'); pq.imageSmoothingQuality = 'high'; pq.drawImage(r, 0, 0, W, H); const ms = lienzo(W, H), sq = ms.getContext('2d'); sq.filter = 'blur(1px)'; sq.drawImage(mask, 0, 0); sq.filter = 'none'; pq.globalCompositeOperation = 'destination-in'; pq.drawImage(ms, 0, 0);
    const out = lienzo(W, H), oq = out.getContext('2d'); oq.drawImage(src, 0, 0); oq.drawImage(pz, 0, 0); return out; }
  /* ---------- colorear: DeOldify da el color a 256 px y la luz es la de la foto ---------- */
  async function colorea() { await tarea(T('Coloreando'), async () => { const o = await ortL(), c = A(), S = 256, g = chw(c.cv, S, S, v => v), n = S * S, x = new Float32Array(3 * n);
      for (let i = 0; i < n; i++) { const l = .299 * g[i] + .587 * g[n + i] + .114 * g[2 * n + i]; x[i] = x[n + i] = x[2 * n + i] = l; }
      const y = await corre('colorear', { input: new o.Tensor('float32', x, [1, 3, S, S]) }, T('Coloreando')), col = aLienzo(y.data, S, S, v => Math.max(0, Math.min(255, Math.round(v))));
      const W = c.cv.width, H = c.cv.height, big = lienzo(W, H), bq = ctx(big); bq.imageSmoothingQuality = 'high'; bq.filter = 'blur(' + Math.max(1, Math.round(Math.max(W, H) / 400)) + 'px)'; bq.drawImage(col, 0, 0, W, H); bq.filter = 'none';
      const cd = bq.getImageData(0, 0, W, H).data, q = ctx(c.cv), im = q.getImageData(0, 0, W, H), d = im.data, s = OI.col / 100;
      for (let i = 0; i < d.length; i += 4) { const Y = .299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2], r = cd[i], gg = cd[i + 1], b = cd[i + 2], cb = (-.168736 * r - .331264 * gg + .5 * b) * s, cr = (.5 * r - .418688 * gg - .081312 * b) * s;
        d[i] = Y + 1.402 * cr; d[i + 1] = Y - .344136 * cb - .714136 * cr; d[i + 2] = Y + 1.772 * cb; }
      const out = lienzo(W, H); out.getContext('2d').putImageData(im, 0, 0); const D = F.D; D.capas[F.act] = Object.assign({}, c, { cv: out }); F.compone(); F.paso(T('Colorear')); F.pinta(); F.pintaTab(); }); }
  /* ---------- el panel de MAGIA: la parte con IA ---------- */
  EXT.magiaExtra = () => '<div class="fo-sec fo-magia"><h3>' + T('Con IA') + '</h3><p class="fo-nota">' + T('Todo en tu navegador. Cada modelo se descarga solo la primera vez que lo usas.') + '</p><div class="fo-rej">' +
    tecla('ia-fondo', '<span>✂</span> ' + T('Quitar el fondo')) + tecla('ia-objeto', '<span>⊘</span> ' + T('Borrar un objeto')) + tecla('ia-x2', '<span>⤢</span> ' + T('Ampliar ×2')) + tecla('ia-x4', '<span>⤢</span> ' + T('Ampliar ×4')) + '</div>' +
    desl('ia-borde', 'Borde', 0, 100, OI.borde) + '<p class="fo-nota">' + T('El fondo se oculta con una máscara de capa: retócala con el pincel o el borrador (pintando en la máscara).') + '</p></div>' +
    '<div class="fo-sec fo-magia"><h3>' + T('Reparar foto antigua') + '</h3>' + desl('ia-ara', 'Arañazos', 0, 100, OI.ara) + desl('ia-color', 'Color desvaído', 0, 100, OI.color) + '<label class="fo-chk"><input type="checkbox" id="ia-grano"' + (+OI.grano ? ' checked' : '') + '> ' + T('Quitar grano') + '</label>' +
    '<div class="fo-acc">' + tecla('ia-repara', '<span>🩹</span> ' + T('Reparar'), { cls: 'pri' }) + '</div></div>' +
    '<div class="fo-sec fo-magia"><h3>' + T('Colorear') + '</h3><p class="fo-nota">' + T('Funciona mejor con fotos en blanco y negro.') + '</p>' + desl('ia-col', 'Intensidad del color', 0, 150, OI.col) + '<div class="fo-acc">' + tecla('ia-colorea', '<span>🎨</span> ' + T('Colorear'), { cls: 'pri' }) + '</div></div>';
  document.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b || b.disabled || !F.D) return; const a = b.dataset.a;
    if (a === 'ia-fondo') quitaFondo(); else if (a === 'ia-x2') amplia(2); else if (a === 'ia-x4') amplia(4); else if (a === 'ia-objeto') F.pon('quitaobj');
    else if (a === 'ia-borra') borraObjeto(); else if (a === 'ia-limpia') { MB = null; F.pinta(); } else if (a === 'ia-repara') reparar(); else if (a === 'ia-colorea') colorea(); });
  document.addEventListener('input', e => { const t = e.target, id = t.id || ''; if (id.indexOf('ia-') !== 0) return; const k = id.slice(3); if (k in OI) { OI[k] = t.type === 'checkbox' ? (t.checked ? 1 : 0) : +t.value; guardaO(); } });
  document.addEventListener('change', e => { const t = e.target; if (t.id === 'ia-grano') { OI.grano = t.checked ? 1 : 0; guardaO(); } });
  /* ---------- PSD: abrir con sus capas y grupos, y guardar igual ---------- */
  const MP = [['source-over', 'normal'], ['multiply', 'multiply'], ['screen', 'screen'], ['overlay', 'overlay'], ['soft-light', 'soft light'], ['hard-light', 'hard light'], ['darken', 'darken'], ['lighten', 'lighten'], ['color-dodge', 'color dodge'], ['color-burn', 'color burn'], ['difference', 'difference'], ['exclusion', 'exclusion'], ['hue', 'hue'], ['saturation', 'saturation'], ['color', 'color'], ['luminosity', 'luminosity']];
  const aPsd = m => (MP.find(q => q[0] === m) || MP[0])[1], dePsd = m => (MP.find(q => q[1] === m) || MP[0])[0];
  let agP = null; const ag = () => agP || (agP = carga(new URL('ag-psd.js?v=1.18', location.href).href).then(() => window.agPsd));
  EXT.psdAbre = async (f, comoCapas) => { F.espera(true); aviso(T('Abriendo el PSD…')); await esperar(); try { const P = await ag(), psd = P.readPsd(await f.arrayBuffer(), { skipThumbnail: true }), W = psd.width, H = psd.height, capas = [], gr = {};
      const plano = (l, g) => { const cv = lienzo(W, H); if (l.canvas) cv.getContext('2d').drawImage(l.canvas, l.left || 0, l.top || 0); const c = { id: F.nId, n: l.name || T('Capa'), cv, vis: !l.hidden, op: l.opacity == null ? 1 : l.opacity, modo: dePsd(l.blendMode), gr: g || null };
        if (l.mask && l.mask.canvas) { const m = lienzo(W, H), q = m.getContext('2d'); q.fillStyle = l.mask.defaultColor ? '#fff' : 'rgba(0,0,0,0)'; q.fillRect(0, 0, W, H); const mc = lienzo(l.mask.canvas.width, l.mask.canvas.height), mq = mc.getContext('2d'); mq.drawImage(l.mask.canvas, 0, 0); const id = mq.getImageData(0, 0, mc.width, mc.height); for (let i = 0; i < id.data.length; i += 4) { id.data[i + 3] = id.data[i]; id.data[i] = id.data[i + 1] = id.data[i + 2] = 255; } mq.putImageData(id, 0, 0); q.globalCompositeOperation = 'copy'; q.drawImage(mc, l.mask.left || 0, l.mask.top || 0); q.globalCompositeOperation = 'source-over'; c.mask = m; }
        capas.push(c); };
      const recorre = (L, g) => (L || []).forEach(l => { if (l.children) { const id = 'g' + F.nId; gr[id] = { n: l.name || T('Grupo'), vis: !l.hidden, op: l.opacity == null ? 1 : l.opacity, modo: dePsd(l.blendMode === 'pass through' ? 'normal' : l.blendMode), ab: true }; recorre(l.children, g || id); } else plano(l, g); });
      recorre(psd.children); if (!capas.length && psd.canvas) plano({ canvas: psd.canvas, name: T('Fondo') });
      if (!capas.length) throw new Error('PSD'); if (comoCapas && F.D) { const D = F.D; capas.forEach(c => { const cv = lienzo(D.w, D.h); cv.getContext('2d').drawImage(c.cv, 0, 0, D.w, D.h); c.cv = cv; if (c.mask) { const m = lienzo(D.w, D.h); m.getContext('2d').drawImage(c.mask, 0, 0, D.w, D.h); c.mask = m; } }); D.capas.splice(F.act + 1, 0, ...capas); D.gr = Object.assign({}, D.gr, gr); F.act = F.act + capas.length; F.compone(); F.paso(T('Imagen como capa')); F.pinta(); F.pintaTab(); }
      else F.cargaDoc({ w: W, h: H, capas, gr }, f.name); } catch (e) { console.warn(e); F.estado(T('No se ha podido: ') + 'PSD (' + (e && e.message || e) + ')'); } finally { F.espera(false); } };
  EXT.psdBlob = async () => { const P = await ag(), D = F.D, hijos = [], L = D.capas, G = D.gr || {}; let i = 0;
    const capaP = c => { const o = { name: c.n, canvas: c.cv, left: 0, top: 0, opacity: c.op, blendMode: aPsd(c.modo), hidden: !c.vis };
      if (c.mask) { const w = c.mask.width, h = c.mask.height, m = lienzo(w, h), q = m.getContext('2d'); q.fillStyle = '#000'; q.fillRect(0, 0, w, h); q.drawImage(c.mask, 0, 0); const id = q.getImageData(0, 0, w, h); for (let k = 0; k < id.data.length; k += 4) { id.data[k + 1] = id.data[k + 2] = id.data[k]; id.data[k + 3] = 255; }   /* la máscara de FOTO es transparencia: en el PSD, gris (blanco se ve, negro se oculta) */ q.putImageData(id, 0, 0); o.mask = { canvas: m, left: 0, top: 0, defaultColor: 0 }; }
      return o; };
    while (i < L.length) { const c = L[i], g = c.gr && G[c.gr]; if (!g) { hijos.push(capaP(c)); i++; continue; } const sub = []; while (i < L.length && L[i].gr === c.gr) { sub.push(capaP(L[i])); i++; } hijos.push({ name: g.n, opacity: g.op, blendMode: aPsd(g.modo), hidden: !g.vis, opened: g.ab !== false, children: sub }); }
    const comp = lienzo(D.w, D.h); comp.getContext('2d').drawImage(F.comp, 0, 0);
    const buf = P.writePsd({ width: D.w, height: D.h, canvas: comp, children: hijos }, { generateThumbnail: true }); return new Blob([buf], { type: 'image/vnd.adobe.photoshop' }); };
  EXT.iaDbg = { mascaraArañazos, rellenaTodo };
  F.pintaTab();
})();
