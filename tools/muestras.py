#!/usr/bin/env python3
"""ADPOSTER · genera los carteles de muestra (assets/demo-carteles y assets/demo-anuncios).
Son dibujos propios hechos por código, con títulos inventados: no usan imágenes ni marcas de terceros.
  python3 tools/muestras.py     (después: python3 tools/preparar.py para regenerar el índice)
Licencia GPL-3.0 · mediaservi.com"""
import os, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); W, H = 1080, 1920
def F(n, s):
    for p in ('/usr/share/fonts/truetype/dejavu/', '/usr/share/fonts/dejavu/', ''):
        try: return ImageFont.truetype(p + n, s)
        except Exception: pass
    return ImageFont.load_default()
B = lambda s: F('DejaVuSansCondensed-Bold.ttf', s); R = lambda s: F('DejaVuSans.ttf', s)
def degr(c1, c2, ang=0):
    im = Image.new('RGB', (W, H)); px = im.load(); ca, sa = math.cos(ang), math.sin(ang)
    for y in range(H):
        for x in range(0, W, 4):
            t = max(0, min(1, ((x / W - .5) * sa + (y / H - .5) * ca) + .5)); c = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
            for k in range(4): px[x + k, y] = c
    return im
def texto(d, t, y, f, col, sombra=(0, 0, 0), esp=0):
    lin = t.split('\n')
    for l in lin:
        w = d.textlength(l, font=f) + esp * (len(l) - 1); x = (W - w) / 2
        for i, ch in enumerate(l):
            cw = d.textlength(ch, font=f)
            if sombra: d.text((x + 5, y + 6), ch, font=f, fill=sombra)
            d.text((x, y), ch, font=f, fill=col); x += cw + esp
        y += f.size * 1.02
    return y
def cabe(d, t, fn, s, esp, ancho=W - 150):   # el mayor tamaño (hasta s) con el que la línea más larga cabe, contando el espaciado: nunca se corta un texto
    while s > 20:
        f = fn(s)
        if max(d.textlength(l, font=f) + esp * (len(l) - 1) for l in t.split('\n')) <= ancho: return f
        s -= 4
    return fn(20)
def sol(d, cx, cy, r, c1, c2):
    for i in range(r, 0, -6): t = i / r; d.ellipse((cx - i, cy - i, cx + i, cy + i), fill=tuple(int(c1[k] * t + c2[k] * (1 - t)) for k in range(3)))
def rayas(d, y0, n, col, alto=18, paso=46):
    for i in range(n): d.rectangle((0, y0 + i * paso, W, y0 + i * paso + alto + i * 3), fill=col)
def rejilla(d, y0, col):
    for i in range(-12, 13): d.line((W / 2 + i * 40, y0, W / 2 + i * 260, H), fill=col, width=3)
    y, k = y0, 12
    while y < H: d.line((0, y, W, y), fill=col, width=3); y += k; k *= 1.28
def puntos(d, rnd, n, col, rmax=14):
    for _ in range(n): x, y, r = rnd.randrange(W), rnd.randrange(H), rnd.randrange(2, rmax); d.ellipse((x - r, y - r, x + r, y + r), fill=col)
def montes(d, y0, col, rnd, amp=220):
    p = [(0, H)]; x = 0
    while x <= W + 80: p.append((x, y0 - rnd.randrange(0, amp))); x += rnd.randrange(70, 190)
    p.append((W, H)); d.polygon(p, fill=col)
def ondas(d, y0, col, n=9):
    for i in range(n):
        p = [(x, y0 + i * 70 + math.sin(x / 90 + i) * 26) for x in range(0, W + 20, 20)]; d.line(p, fill=col, width=10)
CARTELES = [
 ('noche-de-neon',   'NOCHE\nDE NEÓN',   'una ciudad que no duerme',        ((20, 6, 60), (230, 30, 140)),  'rejilla'),
 ('la-gran-ola',     'LA GRAN\nOLA',     'verano · mar · amigos',           ((5, 60, 110), (60, 210, 220)), 'ondas'),
 ('orbita-9',        'ÓRBITA 9',         'el viaje empieza aquí',           ((6, 8, 30), (70, 40, 150)),    'espacio'),
 ('cafe-luna',       'CAFÉ\nLUNA',       'música en directo cada viernes',  ((60, 24, 10), (240, 170, 60)), 'sol'),
 ('cumbres',         'CUMBRES',          'la montaña te llama',             ((20, 40, 70), (250, 190, 150)),'montes'),
 ('ritmo-total',     'RITMO\nTOTAL',     'sesión retro de los 80 y 90',     ((250, 220, 40), (240, 80, 30)), 'rayas'),
 ('jardin-secreto',  'JARDÍN\nSECRETO',  'cuentos para una tarde de lluvia',((10, 60, 40), (150, 220, 120)),'puntos'),
 ('ultima-fila',     'ÚLTIMA\nFILA',     'ciclo de cine de barrio',         ((30, 6, 10), (200, 30, 40)),   'foco'),
 ('robot-amigo',     'ROBOT\nAMIGO',     'una aventura de hojalata',        ((30, 40, 50), (120, 200, 230)),'robot'),
 ('mercado-nocturno','MERCADO\nNOCTURNO','artesanía, comida y farolillos',  ((40, 10, 50), (255, 150, 60)), 'faroles'),
]
def cartel(slug, tit, sub, cols, motivo, i):
    rnd = random.Random(slug); c1, c2 = cols; im = degr(c1, c2, .15 * (i % 3 - 1)); d = ImageDraw.Draw(im, 'RGBA'); cla = tuple(min(255, c + 70) for c in c2); osc = tuple(c // 2 for c in c1)
    if motivo == 'rejilla': sol(d, W // 2, 1050, 330, (255, 220, 80), (255, 60, 150)); rayas(d, 1010, 8, c1 + (255,), 10, 40); rejilla(d, 1240, (60, 230, 255, 255))
    elif motivo == 'ondas': sol(d, 780, 520, 190, (255, 250, 200), (255, 200, 90)); ondas(d, 1150, (255, 255, 255, 150)); ondas(d, 1185, osc + (160,))
    elif motivo == 'espacio': puntos(d, rnd, 260, (255, 255, 255, 220), 5); sol(d, W // 2, 1120, 300, (120, 90, 220), (240, 160, 255)); d.ellipse((120, 1040, 960, 1200), outline=(255, 220, 140, 255), width=14)
    elif motivo == 'sol': sol(d, W // 2, 1080, 380, (255, 240, 200), (255, 190, 70)); d.ellipse((330, 880, 830, 1380), fill=c1 + (255,)); d.ellipse((230, 800, 730, 1300), fill=(255, 240, 200, 255))
    elif motivo == 'montes': sol(d, 300, 760, 150, (255, 250, 220), (255, 220, 160)); montes(d, 1250, (70, 90, 130, 255), rnd); montes(d, 1450, (40, 55, 90, 255), rnd, 260); montes(d, 1650, (18, 28, 50, 255), rnd, 200)
    elif motivo == 'rayas':
        for k in range(14): d.polygon([(k * 160 - 400, H), (k * 160 - 320, H), (k * 160 + 500, 900), (k * 160 + 420, 900)], fill=(255, 255, 255, 60 if k % 2 else 110))
        sol(d, W // 2, 1250, 260, (40, 20, 80), (250, 60, 120))
    elif motivo == 'puntos':
        for _ in range(46): x, y, r = rnd.randrange(W), rnd.randrange(820, H), rnd.randrange(30, 120); d.ellipse((x - r, y - r, x + r, y + r), fill=(rnd.randrange(20, 90), rnd.randrange(120, 230), rnd.randrange(60, 140), 200))
        puntos(d, rnd, 90, (255, 240, 150, 230), 9)
    elif motivo == 'foco': d.polygon([(W // 2 - 60, 0), (W // 2 + 60, 0), (W + 200, H), (-200, H)], fill=(255, 230, 200, 46)); d.ellipse((140, 1500, 940, 1800), fill=(255, 220, 190, 70)); [d.rectangle((90 + k * 150, 1180, 190 + k * 150, 1420), fill=osc + (255,)) for k in range(6)]
    elif motivo == 'robot':
        d.rounded_rectangle((300, 900, 780, 1300), 60, fill=(210, 220, 228, 255)); d.rounded_rectangle((380, 1320, 700, 1640), 40, fill=(180, 192, 204, 255)); d.ellipse((380, 1010, 500, 1130), fill=(40, 200, 255, 255)); d.ellipse((580, 1010, 700, 1130), fill=(40, 200, 255, 255)); d.rounded_rectangle((430, 1200, 650, 1236), 16, fill=(60, 70, 84, 255)); d.line((540, 900, 540, 800), fill=(210, 220, 228, 255), width=16); d.ellipse((510, 750, 570, 810), fill=(255, 90, 90, 255))
    elif motivo == 'faroles':
        for k in range(7): x = 110 + k * 145; y = 960 + int(math.sin(k * 1.3) * 60); d.line((x, 820, x, y), fill=(255, 220, 160, 200), width=4); sol(d, x, y + 70, 78, (255, 120, 40), (255, 230, 150))
        d.line((0, 820, W, 860), fill=(255, 220, 160, 220), width=6); montes(d, 1700, osc + (255,), rnd, 120)
    im = im.filter(ImageFilter.GaussianBlur(.6)); d = ImageDraw.Draw(im, 'RGBA')
    d.rectangle((0, 0, W, 760), fill=osc + (70,)); f = cabe(d, tit, B, 250, 4)
    y = texto(d, tit, 150 if '\n' in tit else 260, f, (255, 255, 255), osc, 4); texto(d, sub.upper(), y + 40, cabe(d, sub.upper(), B, 46, 6), cla, None, 6)
    d.rectangle((0, H - 120, W, H), fill=(0, 0, 0, 150)); texto(d, 'CARTEL DE MUESTRA · ADPOSTER', H - 86, R(34), (235, 235, 235), None, 5)
    return im
def anuncio(slug, l1, l2, col):
    im = degr((14, 14, 20), col, 0); d = ImageDraw.Draw(im, 'RGBA'); d.rounded_rectangle((70, 70, W - 70, H - 70), 60, outline=(255, 255, 255, 230), width=10)
    for k in range(9): d.line((70, 500 + k * 120, W - 70, 380 + k * 120), fill=(255, 255, 255, 26), width=30)
    y = texto(d, l1, 560, cabe(d, l1, B, 190, 4, W - 260), (255, 255, 255), (0, 0, 0), 4); texto(d, l2.upper(), y + 60, cabe(d, l2.upper(), B, 54, 6, W - 260), (255, 235, 150), None, 6); texto(d, 'ANUNCIO DE MUESTRA · ADPOSTER', H - 190, R(34), (235, 235, 235), None, 5); return im
if __name__ == '__main__':
    for carpeta in ('demo-carteles', 'demo-anuncios'): os.makedirs(os.path.join(RAIZ, 'assets', carpeta), exist_ok=True)
    for i, c in enumerate(CARTELES): cartel(*c, i).save(os.path.join(RAIZ, 'assets', 'demo-carteles', c[0] + '.webp'), 'WEBP', quality=88, method=6)
    anuncio('tu-anuncio', 'TU\nANUNCIO\nAQUÍ', 'cada pocos carteles, uno tuyo', (230, 120, 20)).save(os.path.join(RAIZ, 'assets', 'demo-anuncios', 'tu-anuncio.webp'), 'WEBP', quality=88, method=6)
    anuncio('hoy-oferta', 'HOY\n2×1', 'cámbialo desde el gestor en un minuto', (30, 150, 120)).save(os.path.join(RAIZ, 'assets', 'demo-anuncios', 'hoy-oferta.webp'), 'WEBP', quality=88, method=6)
    print('muestras generadas:', len(CARTELES), 'carteles y 2 anuncios')
