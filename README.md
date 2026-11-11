# ADPOSTER

**Cartelería digital profesional, fácil y que arranca sola.** ADPOSTER convierte cualquier pantalla en vertical en un cartel digital: pósteres que nunca se repiten, anuncios intercalados, fundidos, horarios y un gestor con vista previa en vivo. Es un apartado de [AVHUB](https://avhub.mediaservi.com/), *tools for AV people*, de [mediaservi.com](https://mediaservi.com).

**Versión actual: v0.5** (beta, en pruebas)

## Cómo funciona

1. Cada **playlist** tiene su dirección: `adposter.mediaservi.com/cine`, `adposter.mediaservi.com/klub` o `adposter.mediaservi.com/p/?l=nombre`.
2. Esa dirección se pone como **página de inicio del kiosco** (por ejemplo, la app Kiosk en un Xiaomi Smart TV Stick 4K conectado al HDMI del display).
3. Al dar corriente al display, **arranca solo** en unos segundos y no hay que tocar nada más.

Si el display está girado, se añade el giro a la dirección: `…/cine/?rot=90` (derecha), `?rot=180` (boca abajo) o `?rot=270` (izquierda). También valen las direcciones cortas de siempre: `…/cine/v`, `…/cine/i` y `…/cine/V`. Y cualquier playlist nueva tiene la suya: `adposter.mediaservi.com/mi-bar`.

## Funciones

- **Reproductor para FHD en vertical (9:16).** Fondo propio por playlist y pósteres encajados en su marco, grandes y nítidos sea cual sea su tamaño original.
- **Nunca repite.** Baraja cada carpeta y no vuelve a enseñar un póster hasta agotar el mazo, ni siquiera después de apagar y encender.
- **Anuncios intercalados** a pantalla completa, uno cada tantos pósteres (entre un mínimo y un máximo, al azar).
- **Transiciones:** fundido, zoom, desliza, cortina o corte, con duración ajustable. Acercamiento lento y destello al entrar, opcionales.
- **Zoom hasta llenar:** cada póster empieza encajado y va creciendo hasta rebosar justo su marco.
- **Horarios:** la playlist se enciende y se apaga sola por horas y días de la semana, también en tramos que pasan de medianoche.
- **Redirección:** una playlist puede enviar el display a cualquier otra URL.
- **Contenido nuevo sin tocar el display:** cada cinco minutos mira si hay imágenes o ajustes nuevos y los aplica.
- **Aguanta cortes:** si se cae la red sigue con lo que tiene; si algo se atasca, se recupera solo. Mantiene la pantalla despierta.
- **Panel en el propio display:** con el OK del mando, un toque o un clic se abren los ajustes rápidos (duración, transición y carpetas), que se guardan solo en ese display.
- **Gestor** (la página principal): playlists, fondo, carpetas, duraciones, transición, frecuencia de anuncios, horario y redirección, con la vista previa en vivo y la URL para el kiosco lista para copiar.
- **Imágenes preparadas solas:** lo que se sube a `entrada/` se convierte a WebP de calidad alta para FHD y se publica (ver [entrada/LEEME.md](entrada/LEEME.md)).
- Interfaz en español, inglés y catalán.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html`, `gestor.js`, `gestor.css` | El gestor de playlists |
| `cine/`, `klub/`, `p/` | Las direcciones de reproducción (la URL que se da al kiosco) |
| `player.js`, `player.css` | El reproductor |
| `playlists.json` | Los ajustes de cada playlist |
| `assets/<carpeta>/` | Las imágenes, ya en WebP. Las carpetas `ads-…` son anuncios; `fondos`, los fondos |
| `assets/manifest.json` | El índice de imágenes (se genera solo) |
| `entrada/` | Donde se suben las imágenes originales para que se preparen solas |
| `tools/preparar.py` | Convierte a WebP para FHD y regenera el índice |

Para publicar los ajustes del gestor: **Guardar playlists.json** y subir ese archivo a la raíz. Los displays lo recogen solos.

En tu propio dominio: copia el repositorio, publícalo (GitHub Pages, Netlify o cualquier alojamiento estático) y pon tus carpetas en `assets/`.

## Cambios de la versión actual (v0.5)

- **Seta roja de aviso de fallos** en la barra del gestor, del mismo tamaño que la tecla de idioma. Al pasar el cursor explica para qué es; al pulsarla se abre una ventana para contar el fallo y adjuntar hasta tres capturas. Los displays no cambian.

Sigue de la v0.4:

- **Línea de crédito común.** El pie del gestor y el del panel del display llevan la misma línea que el resto de apps de AVHUB, con el icono nuevo; se cambia desde AVHUB ADMIN.

Sigue de la v0.3:

- **CINE con su cartelera de verdad:** 264 pósteres de cine en `msp-pelis`, ya en WebP para FHD, con los ajustes de la versión anterior (12 segundos por póster y un anuncio cada 4 a 6).
- **KLUB al día:** se añaden las 48 imágenes que faltaban respecto a la versión anterior (3 anuncios y 45 pósteres de gaming, música y colección), con sus mismas carpetas y ajustes.
- **Giro del display:** además de 90° y 270°, ahora también 180°. El gestor lo añade a la URL del kiosco con un toque.
- **Direcciones cortas:** `…/cine/v`, `/i` y `/V` siguen girando el display como antes, y `…/nombre` abre la playlist con ese nombre.

Sigue de la v0.2:

- **Zoom hasta llenar.** Efecto nuevo: al entrar cada póster, se amplía poco a poco desde su tamaño encajado hasta rebosar justo el marco. Se activa con la tecla «Llenar» del gestor y viene encendido en CINE y KLUB.
- El movimiento de cada póster arranca con él y se mantiene mientras se funde con el siguiente, sin saltos.

Sigue de la v0.1:

- Primera versión: reproductor, las playlists de demostración CINE y KLUB, gestor con vista previa en vivo y preparación automática de imágenes.
- Sustituye, mejorado, al reproductor de pósteres anterior: ya no necesita funciones de servidor, así que funciona en cualquier alojamiento estático.

## Próximos pasos

- Publicar desde el gestor sin subir archivos a mano, y subir imágenes arrastrándolas.
- Conexión con nubes y discos del usuario.
- Copia espejo automática.

## Licencia

[GPL-3.0](LICENSE)

---

*ADPOSTER v0.5 2026 es un proyecto hecho con ⚙ by [mediaservi.com](https://mediaservi.com)*
