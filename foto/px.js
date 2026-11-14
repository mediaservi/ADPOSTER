/* ADPOSTER · FOTO · operaciones de píxel (v1.16) · GPL-3.0 · mediaservi.com
   Todo trabaja sobre ImageData (RGBA de 8 bits) y devuelve un ImageData nuevo: el original no se toca.
   Algoritmos propios y clásicos (LUT, conversión HSL, desenfoque por cajas, máscara de enfoque, filtro guiado,
   prioridad del canal oscuro para la neblina, mundo gris para el balance de blancos). Sin código de terceros. */
(function () {
  'use strict';
  const cl = v => v < 0 ? 0 : v > 255 ? 255 : v;
  const nuevo = (d, w, h) => new ImageData(new Uint8ClampedArray(d), w, h);
  const copia = im => nuevo(im.data, im.width, im.height);
  /* aplica una tabla por canal (r, g, b); alfa intacto */
  function lut(im, Lr, Lg, Lb) { const o = copia(im), d = o.data; Lg = Lg || Lr; Lb = Lb || Lr; for (let i = 0; i < d.length; i += 4) { d[i] = Lr[d[i]]; d[i + 1] = Lg[d[i + 1]]; d[i + 2] = Lb[d[i + 2]]; } return o; }
  const tabla = f => { const t = new Uint8ClampedArray(256); for (let i = 0; i < 256; i++) t[i] = cl(Math.round(f(i / 255) * 255)); return t; };
  /* brillo (−100…100), contraste (−100…100), exposición (−3…3 pasos), gamma (0,2…5) */
  function bc(im, p) { const b = (p.brillo || 0) / 100, c = (p.contraste || 0) / 100, ex = Math.pow(2, p.exposicion || 0), ga = p.gamma || 1, kc = c >= 0 ? 1 / Math.max(.02, 1 - c * .98) : 1 + c;
    return lut(im, tabla(x => { let v = x * ex; v = Math.pow(Math.max(0, v), 1 / ga); v = v + b * (b > 0 ? 1 - v : v); return (v - .5) * kc + .5; })); }
  /* niveles: negro, blanco y medios de entrada (0…255, gamma 0,1…9,99) y salida */
  function niveles(im, p) { const a = p.inN || 0, z = Math.max(a + 1, p.inB == null ? 255 : p.inB), g = p.gamma || 1, oa = p.outN || 0, oz = p.outB == null ? 255 : p.outB;
    const t = tabla(x => { const v = Math.min(1, Math.max(0, (x * 255 - a) / (z - a))); return (oa + Math.pow(v, 1 / g) * (oz - oa)) / 255; }); const L = p.canal; return L === 'r' ? lut(im, t, tabla(x => x), tabla(x => x)) : L === 'g' ? lut(im, tabla(x => x), t, tabla(x => x)) : L === 'b' ? lut(im, tabla(x => x), tabla(x => x), t) : lut(im, t); }
  /* curvas: puntos [[x, y], …] en 0…255; interpolación monótona (Fritsch–Carlson) para que no haga ondas */
  function curvaTabla(P) { P = P.slice().sort((a, b) => a[0] - b[0]); if (P[0][0] > 0) P.unshift([0, P[0][1]]); if (P[P.length - 1][0] < 255) P.push([255, P[P.length - 1][1]]); const n = P.length, X = P.map(p => p[0]), Y = P.map(p => p[1]), dx = [], m = [], s = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = Math.max(1e-6, X[i + 1] - X[i]); s[i] = (Y[i + 1] - Y[i]) / dx[i]; } m[0] = s[0]; m[n - 1] = s[n - 2]; for (let i = 1; i < n - 1; i++) m[i] = s[i - 1] * s[i] <= 0 ? 0 : (s[i - 1] + s[i]) / 2;
    for (let i = 0; i < n - 1; i++) { if (s[i] === 0) { m[i] = m[i + 1] = 0; continue; } const a = m[i] / s[i], b = m[i + 1] / s[i], h = a * a + b * b; if (h > 9) { const k = 3 / Math.sqrt(h); m[i] = k * a * s[i]; m[i + 1] = k * b * s[i]; } }
    const t = new Uint8ClampedArray(256); let j = 0; for (let x = 0; x < 256; x++) { while (j < n - 2 && x > X[j + 1]) j++; const h = dx[j], u = Math.min(1, Math.max(0, (x - X[j]) / h)), u2 = u * u, u3 = u2 * u; t[x] = cl(Math.round((2 * u3 - 3 * u2 + 1) * Y[j] + (u3 - 2 * u2 + u) * h * m[j] + (-2 * u3 + 3 * u2) * Y[j + 1] + (u3 - u2) * h * m[j + 1])); } return t; }
  function curvas(im, p) { const id = tabla(x => x), c = curvaTabla(p.rgb || [[0, 0], [255, 255]]), r = p.r ? curvaTabla(p.r) : id, g = p.g ? curvaTabla(p.g) : id, b = p.b ? curvaTabla(p.b) : id;
    const R = new Uint8ClampedArray(256), G = new Uint8ClampedArray(256), B = new Uint8ClampedArray(256); for (let i = 0; i < 256; i++) { R[i] = r[c[i]]; G[i] = g[c[i]]; B[i] = b[c[i]]; } return lut(im, R, G, B); }
  /* tono, saturación, luminosidad y vividez (la vividez satura más lo que está apagado y protege la piel) */
  function hsl(im, p) { const o = copia(im), d = o.data, dh = (p.tono || 0) / 360, ds = (p.saturacion || 0) / 100, dl = (p.luminosidad || 0) / 100, vv = (p.vividez || 0) / 100;
    for (let i = 0; i < d.length; i += 4) { let r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0, l = (mx + mn) / 2; const dd = mx - mn;
      if (dd > 1e-6) { s = l > .5 ? dd / (2 - mx - mn) : dd / (mx + mn); h = mx === r ? (g - b) / dd + (g < b ? 6 : 0) : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4; h /= 6; }
      h = (h + dh + 1) % 1; if (ds) s = ds > 0 ? s + (1 - s) * ds * (s > 0 ? 1 : 0) : s * (1 + ds);
      if (vv) { const piel = h > .02 && h < .12 ? .5 : 1; s = vv > 0 ? s + (1 - s) * vv * (1 - s) * piel : s * (1 + vv); }
      l = dl > 0 ? l + (1 - l) * dl : l * (1 + dl); s = Math.min(1, Math.max(0, s));
      if (s < 1e-6) { r = g = b = l; } else { const q = l < .5 ? l * (1 + s) : l + s - l * s, pp = 2 * l - q, f = t => { t = (t + 1) % 1; return t < 1 / 6 ? pp + (q - pp) * 6 * t : t < .5 ? q : t < 2 / 3 ? pp + (q - pp) * (2 / 3 - t) * 6 : pp; }; r = f(h + 1 / 3); g = f(h); b = f(h - 1 / 3); }
      d[i] = r * 255 + .5; d[i + 1] = g * 255 + .5; d[i + 2] = b * 255 + .5; } return o; }
  /* equilibrio de color por sombras, medios y luces: cada uno (−100…100) cian↔rojo, magenta↔verde, amarillo↔azul */
  function equilibrio(im, p) { const o = copia(im), d = o.data, Z = [p.s || [0, 0, 0], p.m || [0, 0, 0], p.l || [0, 0, 0]], keep = p.lum !== false;
    for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], b = d[i + 2], L = (.299 * r + .587 * g + .114 * b) / 255, w = [Math.max(0, 1 - L * 3.2) ** .7, Math.max(0, 1 - Math.abs(L - .5) * 3) ** .8, Math.max(0, L * 3.2 - 2.2) ** .7];
      let dr = 0, dg = 0, db = 0; for (let k = 0; k < 3; k++) { dr += Z[k][0] * w[k]; dg += Z[k][1] * w[k]; db += Z[k][2] * w[k]; }
      let nr = r + dr * .6, ng = g + dg * .6, nb = b + db * .6; if (keep) { const L2 = (.299 * nr + .587 * ng + .114 * nb) / 255, k = L2 > 0 ? L / L2 : 1; nr *= k; ng *= k; nb *= k; } d[i] = nr; d[i + 1] = ng; d[i + 2] = nb; } return o; }
  /* blanco y negro con mezcla de canales y virado opcional (color #rrggbb e intensidad 0…100) */
  function bn(im, p) { const o = copia(im), d = o.data, R = (p.r == null ? 40 : p.r) / 100, G = (p.g == null ? 40 : p.g) / 100, B = (p.b == null ? 20 : p.b) / 100, vk = (p.virado || 0) / 100, vc = hex(p.color || '#c08a4a');
    for (let i = 0; i < d.length; i += 4) { const y = cl(d[i] * R + d[i + 1] * G + d[i + 2] * B); if (vk) { const t = y / 255; d[i] = y + (vc[0] * t - y) * vk * (1 - Math.abs(t - .5)); d[i + 1] = y + (vc[1] * t - y) * vk * (1 - Math.abs(t - .5)); d[i + 2] = y + (vc[2] * t - y) * vk * (1 - Math.abs(t - .5)); } else d[i] = d[i + 1] = d[i + 2] = y; } return o; }
  const hex = h => { const m = /^#?([\da-f]{6})$/i.exec(h || ''), n = m ? parseInt(m[1], 16) : 0xffffff; return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  /* desenfoque por cajas separable (tres pasadas ≈ gaussiano) sobre un Float32Array de un canal */
  function cajas1(src, w, h, r) { if (r < 1) return Float32Array.from(src); const t = new Float32Array(src.length), o = new Float32Array(src.length), n = 2 * r + 1;
    for (let y = 0; y < h; y++) { const f = y * w; let s = src[f] * (r + 1); for (let x = 1; x <= r; x++) s += src[f + Math.min(w - 1, x)]; for (let x = 0; x < w; x++) { t[f + x] = s / n; s += src[f + Math.min(w - 1, x + r + 1)] - src[f + Math.max(0, x - r)]; } }
    for (let x = 0; x < w; x++) { let s = t[x] * (r + 1); for (let y = 1; y <= r; y++) s += t[Math.min(h - 1, y) * w + x]; for (let y = 0; y < h; y++) { o[y * w + x] = s / n; s += t[Math.min(h - 1, y + r + 1) * w + x] - t[Math.max(0, y - r) * w + x]; } } return o; }
  function gauss1(src, w, h, sig) { if (sig < .5) return Float32Array.from(src); const r = Math.max(1, Math.round(Math.sqrt(12 * sig * sig / 3 + 1) / 2 - .5)); return cajas1(cajas1(cajas1(src, w, h, r), w, h, r), w, h, r); }
  const canales = im => { const n = im.width * im.height, d = im.data, C = [new Float32Array(n), new Float32Array(n), new Float32Array(n), new Float32Array(n)]; for (let i = 0, j = 0; j < n; i += 4, j++) { C[0][j] = d[i]; C[1][j] = d[i + 1]; C[2][j] = d[i + 2]; C[3][j] = d[i + 3]; } return C; };
  const junta = (C, w, h) => { const o = new ImageData(w, h), d = o.data; for (let i = 0, j = 0; j < w * h; i += 4, j++) { d[i] = C[0][j]; d[i + 1] = C[1][j]; d[i + 2] = C[2][j]; d[i + 3] = C[3][j]; } return o; };
  /* desenfoque gaussiano (radio en píxeles); con alfa premultiplicado para que los bordes transparentes no se ensucien */
  function desenfoca(im, p) { const w = im.width, h = im.height, C = canales(im), s = Math.max(.5, (p.radio || 4) / 2); for (let k = 0; k < 3; k++) for (let j = 0; j < w * h; j++) C[k][j] *= C[3][j] / 255;
    const B = C.map(c => gauss1(c, w, h, s)); for (let j = 0; j < w * h; j++) { const a = B[3][j]; if (a > 0) for (let k = 0; k < 3; k++) B[k][j] = B[k][j] * 255 / a; } return junta(B, w, h); }
  /* enfocar (máscara de enfoque): cantidad 0…300 %, radio y umbral */
  function enfoca(im, p) { const w = im.width, h = im.height, C = canales(im), am = (p.cantidad == null ? 80 : p.cantidad) / 100, s = Math.max(.5, (p.radio || 1.2)), u = p.umbral || 0;
    for (let k = 0; k < 3; k++) { const b = gauss1(C[k], w, h, s); for (let j = 0; j < w * h; j++) { const df = C[k][j] - b[j]; if (Math.abs(df) >= u) C[k][j] = C[k][j] + df * am; } } return junta(C, w, h); }
  /* ruido: cantidad 0…100, monocromo o de color */
  function ruido(im, p) { const o = copia(im), d = o.data, a = (p.cantidad || 10) * 1.6, mono = p.mono !== false; let s = 1234567; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }, g = () => { let u = 0; for (let k = 0; k < 4; k++) u += rnd(); return (u - 2) * 1.73; };
    for (let i = 0; i < d.length; i += 4) { if (mono) { const n = g() * a; d[i] += n; d[i + 1] += n; d[i + 2] += n; } else { d[i] += g() * a; d[i + 1] += g() * a; d[i + 2] += g() * a; } } return o; }
  /* viñeta: cantidad (−100 aclara … 100 oscurece), tamaño y suavidad (0…100) */
  function vineta(im, p) { const o = copia(im), d = o.data, w = im.width, h = im.height, k = (p.cantidad == null ? 50 : p.cantidad) / 100, r0 = .25 + (p.tamano == null ? 50 : p.tamano) / 100 * .6, sv = .05 + (p.suavidad == null ? 60 : p.suavidad) / 100 * .9, cx = w / 2, cy = h / 2;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const t = Math.min(1, Math.max(0, (Math.hypot((x - cx) / cx, (y - cy) / cy) / Math.SQRT2 - r0) / sv)), f = t * t * (3 - 2 * t) * k, i = (y * w + x) * 4; if (f > 0) { d[i] *= 1 - f; d[i + 1] *= 1 - f; d[i + 2] *= 1 - f; } else { d[i] += (255 - d[i]) * -f; d[i + 1] += (255 - d[i + 1]) * -f; d[i + 2] += (255 - d[i + 2]) * -f; } } return o; }
  /* filtro guiado (He, Sun y Tang): suaviza sin cruzar bordes. I = guía (0…1), q = canal (0…1) */
  function guiado(I, q, w, h, r, eps) { const m = a => cajas1(a, w, h, r), n = w * h, II = new Float32Array(n), Ip = new Float32Array(n); for (let j = 0; j < n; j++) { II[j] = I[j] * I[j]; Ip[j] = I[j] * q[j]; }
    const mI = m(I), mp = m(q), mII = m(II), mIp = m(Ip), A = new Float32Array(n), B = new Float32Array(n); for (let j = 0; j < n; j++) { const v = mII[j] - mI[j] * mI[j], c = mIp[j] - mI[j] * mp[j]; A[j] = c / (v + eps); B[j] = mp[j] - A[j] * mI[j]; }
    const mA = m(A), mB = m(B), o = new Float32Array(n); for (let j = 0; j < n; j++) o[j] = mA[j] * I[j] + mB[j]; return o; }
  const luma = (C, n) => { const L = new Float32Array(n); for (let j = 0; j < n; j++) L[j] = (.299 * C[0][j] + .587 * C[1][j] + .114 * C[2][j]) / 255; return L; };
  /* quitar ruido: filtro guiado por la propia imagen; fuerza 0…100 */
  function limpia(im, p) { const w = im.width, h = im.height, n = w * h, C = canales(im), f = (p.fuerza == null ? 60 : p.fuerza) / 100, r = Math.max(1, Math.round(1 + f * 3 * Math.max(1, Math.min(w, h) / 1500))), eps = .0004 + f * f * .012, L = luma(C, n);
    for (let k = 0; k < 3; k++) { const q = new Float32Array(n); for (let j = 0; j < n; j++) q[j] = C[k][j] / 255; const g = guiado(L, q, w, h, r, eps), det = p.detalle == null ? .25 : p.detalle / 100; for (let j = 0; j < n; j++) C[k][j] = (g[j] + (q[j] - g[j]) * det * (1 - f)) * 255; } return junta(C, w, h); }
  /* percentil de un canal (histograma) */
  function pct(d, off, q) { const H = new Uint32Array(256); let n = 0; for (let i = off; i < d.length; i += 4) { if (d[i - off + 3] < 8) continue; H[d[i]]++; n++; } let a = 0; const t = n * q; for (let v = 0; v < 256; v++) { a += H[v]; if (a >= t) return v; } return 255; }
  /* balance de blancos automático (mundo gris en los tonos medios) o con un color neutro elegido */
  function blancos(im, p) { const d = im.data, f = (p.fuerza == null ? 100 : p.fuerza) / 100; let r = 0, g = 0, b = 0, n = 0;
    if (p.neutro) { [r, g, b] = p.neutro; n = 1; } else for (let i = 0; i < d.length; i += 16) { const L = .299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2]; if (d[i + 3] < 8 || L < 30 || L > 235) continue; r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    if (!n) return copia(im); r /= n; g /= n; b /= n; const m = (r + g + b) / 3, kr = 1 + (m / Math.max(1, r) - 1) * f, kg = 1 + (m / Math.max(1, g) - 1) * f, kb = 1 + (m / Math.max(1, b) - 1) * f; return lut(im, tabla(x => x * kr), tabla(x => x * kg), tabla(x => x * kb)); }
  /* quitar neblina: prioridad del canal oscuro, transmisión refinada con el filtro guiado */
  function neblina(im, p) { const w = im.width, h = im.height, n = w * h, C = canales(im), f = (p.fuerza == null ? 70 : p.fuerza) / 100, D = new Float32Array(n);
    for (let j = 0; j < n; j++) D[j] = Math.min(C[0][j], C[1][j], C[2][j]) / 255; const rr = Math.max(2, Math.round(Math.min(w, h) / 90)), Dm = minimo(D, w, h, rr);
    const idx = Array.from({ length: n }, (_, j) => j).filter(j => j % 7 === 0).sort((a, b) => Dm[b] - Dm[a]).slice(0, Math.max(10, Math.round(n / 7 * .001))); let A = [0, 0, 0]; idx.forEach(j => { for (let k = 0; k < 3; k++) A[k] += C[k][j] / 255; }); A = A.map(v => Math.max(.5, v / idx.length));
    const T = new Float32Array(n); for (let j = 0; j < n; j++) T[j] = 1 - .95 * f * Math.min(C[0][j] / 255 / A[0], C[1][j] / 255 / A[1], C[2][j] / 255 / A[2]); const Tm = guiado(luma(C, n), minimo(T, w, h, 0), w, h, rr * 2, .001);
    for (let j = 0; j < n; j++) { const t = Math.max(.12, Tm[j]); for (let k = 0; k < 3; k++) C[k][j] = ((C[k][j] / 255 - A[k]) / t + A[k]) * 255; } return junta(C, w, h); }
  function minimo(a, w, h, r) { if (r < 1) return a; const t = new Float32Array(a.length), o = new Float32Array(a.length);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let m = 1e9; for (let k = Math.max(0, x - r); k <= Math.min(w - 1, x + r); k += Math.max(1, r >> 2)) m = Math.min(m, a[y * w + k]); t[y * w + x] = m; }
    for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) { let m = 1e9; for (let k = Math.max(0, y - r); k <= Math.min(h - 1, y + r); k += Math.max(1, r >> 2)) m = Math.min(m, t[k * w + x]); o[y * w + x] = m; } return o; }
  /* mejora automática: estira la luz entre los percentiles 0,4 y 99,6, centra los medios, quita dominante, un poco de vividez y de enfoque */
  function automatica(im, p) { const f = (p.fuerza == null ? 70 : p.fuerza) / 100, d = im.data; let o = blancos(im, { fuerza: 45 * f });
    const lo = Math.min(pct(o.data, 0, .004), pct(o.data, 1, .004), pct(o.data, 2, .004)), hi = Math.max(pct(o.data, 0, .996), pct(o.data, 1, .996), pct(o.data, 2, .996)), a = lo * f, z = 255 - (255 - hi) * f;
    let s = 0, n = 0; for (let i = 0; i < d.length; i += 16) { s += (.299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2] - a) / Math.max(1, z - a); n++; } const mean = Math.min(.9, Math.max(.1, s / Math.max(1, n))), ga = 1 + (Math.log(.5) / Math.log(mean) - 1) * f * .6;
    o = lut(o, tabla(x => Math.pow(Math.min(1, Math.max(0, (x * 255 - a) / Math.max(1, z - a))), 1 / Math.max(.4, Math.min(2.5, 1 / ga))))); o = hsl(o, { vividez: 22 * f }); return enfoca(o, { cantidad: 40 * f, radio: 1 + Math.min(im.width, im.height) / 2000 }); }
  /* reescalado de calidad (área al reducir, bicúbico al ampliar) */
  function escala(src, w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    let s = src, sw = src.width, sh = src.height; while (sw / 2 > w && sh / 2 > h) { const t = document.createElement('canvas'); t.width = Math.round(sw / 2); t.height = Math.round(sh / 2); const tx = t.getContext('2d'); tx.imageSmoothingQuality = 'high'; tx.drawImage(s, 0, 0, t.width, t.height); s = t; sw = t.width; sh = t.height; }
    x.drawImage(s, 0, 0, w, h); return c; }
  window.ADPX = { bc, niveles, curvas, curvaTabla, hsl, equilibrio, bn, desenfoca, enfoca, ruido, vineta, limpia, blancos, neblina, automatica, escala, copia, pct };
})();
