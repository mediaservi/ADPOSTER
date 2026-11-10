#!/usr/bin/env python3
"""ADPOSTER · prepara las imágenes para pantallas FHD en vertical y regenera el índice.

  python3 tools/preparar.py                 → solo regenera assets/manifest.json
  python3 tools/preparar.py ORIGEN          → convierte a WebP cada subcarpeta de ORIGEN en assets/<subcarpeta>/ y regenera el índice
  python3 tools/preparar.py ORIGEN -f a,b   → solo esas subcarpetas

Cada imagen se reduce (nunca se amplía) para caber en 1080 × 1920 y se guarda en WebP de calidad alta: nítida en un display FHD
y con una fracción del peso original. Los fondos (carpeta «fondos») se guardan a 1080 × 1920 exactos.
Licencia GPL-3.0 · mediaservi.com
"""
import sys, os, re, json, hashlib, unicodedata
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); ASSETS = os.path.join(RAIZ, 'assets')
EXT = ('.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.bmp', '.tif', '.tiff')
NO = {'logos', 'fonts'}                                   # carpetas de assets que no son contenido

def nombre(f):
    s = unicodedata.normalize('NFKD', os.path.splitext(f)[0]).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-') or 'imagen'

def convierte(origen, solo=None):
    from PIL import Image, ImageOps
    hechos = fallos = 0
    for carpeta in sorted(os.listdir(origen)):
        d = os.path.join(origen, carpeta)
        if not os.path.isdir(d) or (solo and carpeta not in solo): continue
        archivos = [f for f in sorted(os.listdir(d)) if f.lower().endswith(EXT) and not f.startswith('.')]
        if not archivos: continue
        dest = os.path.join(ASSETS, carpeta); os.makedirs(dest, exist_ok=True); usados = set()
        for f in archivos:
            try:
                im = ImageOps.exif_transpose(Image.open(os.path.join(d, f))); im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') and 'transparency' in im.info or im.mode == 'RGBA' else 'RGB')
                if carpeta == 'fondos': im = im.resize((1080, 1920), Image.LANCZOS)
                else: im.thumbnail((1080, 1920), Image.LANCZOS)
                n = nombre(f); k = 2
                while n in usados: n = f'{nombre(f)}-{k}'; k += 1
                usados.add(n); im.save(os.path.join(dest, n + '.webp'), 'WEBP', quality=92 if carpeta == 'fondos' or carpeta.startswith('ads') else 88, method=6); hechos += 1
            except Exception as e:
                fallos += 1; print(f'  ✗ {carpeta}/{f}: {e}')
        print(f'  {carpeta}: {len(usados)} imágenes')
    print(f'Convertidas {hechos}; con error {fallos}')

def manifiesto():
    carpetas = {}
    for carpeta in sorted(os.listdir(ASSETS)):
        d = os.path.join(ASSETS, carpeta)
        if not os.path.isdir(d) or carpeta in NO: continue
        fs = [f for f in sorted(os.listdir(d)) if f.lower().endswith(EXT) and not f.startswith('.')]
        if fs: carpetas[carpeta] = fs
    cuerpo = json.dumps(carpetas, ensure_ascii=False, sort_keys=True)
    m = {'version': hashlib.sha1(cuerpo.encode()).hexdigest()[:10], 'carpetas': carpetas}
    json.dump(m, open(os.path.join(ASSETS, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0, separators=(',', ':'))
    print('manifest.json ·', m['version'], '·', {k: len(v) for k, v in carpetas.items()})

if __name__ == '__main__':
    a = [x for x in sys.argv[1:]]
    solo = None
    if '-f' in a: i = a.index('-f'); solo = set(a[i + 1].split(',')); del a[i:i + 2]
    if a: convierte(a[0], solo)
    manifiesto()
