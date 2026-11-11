# ADPOSTER

**Cartelería digital sencilla pero potente, que arranca sola.** Pensada para autónomos y negocios muy pequeños que no tienen medios para un sistema de cartelería de pago. ADPOSTER convierte cualquier pantalla, en vertical o en horizontal, en un cartel digital: carteles que nunca se repiten, anuncios intercalados, vídeo, cinta de texto, códigos QR, horarios y un gestor desde el que se ven y se mandan todas las pantallas al momento, también desde el móvil. Es un apartado de [AVHUB](https://avhub.mediaservi.com/), *tools for AV people*, de [mediaservi.com](https://mediaservi.com).

Es software gratuito hecho por afición: sin cuentas, sin servidor propio, sin publicidad y sin cuotas.

**Versión actual: v1.0**

## Cómo funciona

1. Cada **lista** tiene su dirección: `adposter.mediaservi.com/cine`, `adposter.mediaservi.com/klub` o `adposter.mediaservi.com/p/?l=nombre`.
2. Esa dirección se pone como **página de inicio del kiosco** (por ejemplo, la app Kiosk en un stick de TV conectado al HDMI del display).
3. Al dar corriente al display, **arranca solo** en unos segundos y no hay que tocar nada más.

Si el display está girado, se añade el giro a la dirección: `…/cine/?rot=90` (derecha), `?rot=180` (boca abajo) o `?rot=270` (izquierda). También valen las direcciones cortas de siempre: `…/cine/v`, `…/cine/i` y `…/cine/V`. Y cualquier lista nueva tiene la suya: `adposter.mediaservi.com/mi-bar`.

El gestor (la página principal) prepara esa dirección con todo lo que es de cada aparato: giro, canal del directo y origen privado.

## El gestor: cuatro ventanas

| Ventana | Para qué |
|---|---|
| **DISPLAYS** (izquierda, arriba) | El estado de cada pantalla **en directo**: encendida, apagada, fuera de horario o sin señal; qué lista tiene, en qué formato, y su grupo y sede. Aquí se elige el destino de las órdenes: todas, un grupo, una sede o una sola. |
| **LISTAS** (izquierda, abajo) | Las listas de reproducción: crear, borrar y elegir la que se edita. Cuenta de carpetas y archivos. |
| **LIENZO** (centro) | La vista previa en vivo de la lista, en vertical u horizontal, con **zoom** y desplazamiento y **guías que se arrastran** para colocar la cabecera, el pie y los lados. |
| **Pestañas** (derecha) | **CONTENIDO** · **DISEÑO** · **TIEMPOS** · **DIRECTO** · **PUBLICAR**, cada una con su botón de restablecer. |

En tablet y móvil las ventanas se apilan, con el lienzo arriba; en móvil apaisado el lienzo se queda a la izquierda.

## Funciones

**Reproducción**

- **Vertical (9:16) u horizontal (16:9).** En horizontal, el cartel y el anuncio se ven a la vez, uno a cada lado, cada uno a su ritmo.
- **Imágenes y vídeo.** Las imágenes se preparan solas en WebP para FHD; los vídeos (`.mp4`, `.webm`) se reproducen enteros, sin sonido.
- **Nunca repite.** Baraja cada carpeta y no vuelve a enseñar un cartel hasta agotar el mazo, ni siquiera después de apagar y encender.
- **Anuncios intercalados**, uno cada tantos carteles (entre un mínimo y un máximo, al azar).
- **Transiciones:** fundido, zoom, desliza, cortina o corte, con duración ajustable. Acercamiento lento, destello al entrar y zoom hasta llenar, opcionales.
- **Plantillas de diseño:** cartelera, pantalla completa, marco centrado y apaisado, como punto de partida que luego se retoca arrastrando las guías.
- **Cinta de texto** al pie: un texto fijo, los titulares de un **RSS en vivo** o un mensaje enviado al momento.
- **Código QR en pantalla**, en la esquina que se elija, con su texto: lleva a cualquier enlace o a la página de participación del público.
- **Horario de encendido:** la lista se enciende y se apaga sola por horas y días de la semana, también en tramos que pasan de medianoche.
- **Redirección:** una lista puede enviar el display a cualquier otra URL.
- **Contenido nuevo sin tocar el display:** cada cinco minutos mira si hay archivos o ajustes nuevos y los aplica.
- **Aguanta cortes:** si se cae la red sigue con lo que tiene; si algo se atasca, se recupera solo. Mantiene la pantalla despierta.
- **Panel en el propio display:** con el OK del mando, un toque o un clic se abren los ajustes rápidos, que se guardan solo en ese display.

**Directo** (opcional: se activa con un toque y no necesita publicar nada)

- **Panel de displays en tiempo real:** de una pantalla a las que hagan falta, agrupadas por **grupo** y por **sede**.
- **Disparadores de un toque**, también desde el móvil: lanzar una lista en una pantalla, un grupo, una sede o todas. O arrastrando la lista sobre el display.
- **Avisos a toda pantalla** con texto, color y duración.
- **Mensaje al momento** en la cinta de texto.
- **Encender, apagar, recargar e identificar** cada pantalla a distancia; cambiarle el nombre, el grupo y la sede.
- **Participación del público:** quien escanea el QR de un display llega a una página donde elige entre las listas que el dueño haya marcado como elegibles. No puede hacer nada más.

**Contenido propio**

- **Arrastrar y soltar:** una carpeta sobre el lienzo la añade a la lista; una lista sobre un display la lanza.
- **Origen privado:** un display (y el gestor) puede leer sus listas e imágenes de otra web con la misma estructura, que solo conoce él (`?origen=https://…`).
- **Imágenes preparadas solas:** lo que se sube a `entrada/` se convierte y se publica (ver [entrada/LEEME.md](entrada/LEEME.md)).
- Interfaz en español, inglés y catalán.

### Cómo funciona el directo, y qué conviene saber

No hay servidor propio. El gestor, los displays y la página del público se hablan a través de repetidores MQTT públicos y gratuitos, dentro de un **canal** con un código al azar que se crea en el gestor y viaja en la URL del kiosco (`?canal=…`).

- **El canal es la llave:** quien lo tenga puede mandar a tus displays. No lo publiques. Se puede guardar dentro de `playlists.json` solo si esa web es privada.
- **El público no recibe el canal.** El QR lleva otro código, derivado del canal con una huella de un solo sentido, que solo sirve para pedir una lista marcada como elegible, y no más de una vez cada pocos segundos.
- Los repetidores son de terceros, abiertos y sin garantías: pueden fallar o cambiar. Si no hay conexión, los displays siguen reproduciendo su lista con normalidad. **No envíes datos personales** en avisos ni mensajes.
- El RSS se lee desde el propio display: funciona con canales que permiten la lectura desde otra web, o con un archivo (`noticias.xml`) puesto junto a tus listas.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html`, `gestor.js`, `gestor.css` | El gestor |
| `cine/`, `klub/`, `p/` | Las direcciones de reproducción (la URL que se da al kiosco) |
| `elige/` | La página del público (se llega por el QR) |
| `player.js`, `player.css` | El reproductor |
| `directo.js` | El canal en tiempo real (cliente MQTT mínimo, propio) |
| `qr.js` | Generador de códigos QR (de terceros, licencia MIT: ver [assets/LICENCIAS-TERCEROS.md](assets/LICENCIAS-TERCEROS.md)) |
| `playlists.json` | Los ajustes de cada lista |
| `assets/<carpeta>/` | Las imágenes y vídeos. Las carpetas `ads-…` o con «anuncios» en el nombre son anuncios; `fondos`, los fondos |
| `assets/manifest.json` | El índice de archivos (se genera solo) |
| `entrada/` | Donde se suben las imágenes originales para que se preparen solas |
| `tools/preparar.py` | Convierte a WebP para FHD, copia los vídeos y regenera el índice |

Para publicar los ajustes de las listas: **Guardar playlists.json** y subir ese archivo a la raíz. Los displays lo recogen solos. Las órdenes del directo no necesitan publicar nada.

En tu propio dominio: copia el repositorio, publícalo (GitHub Pages, Netlify o cualquier alojamiento estático) y pon tus carpetas en `assets/`.

## Cambios de la versión actual (v1.0)

- **Gestor nuevo de cuatro ventanas:** DISPLAYS y LISTAS fijas a la izquierda, el lienzo en el centro con zoom, desplazamiento y guías que se arrastran, y cinco pestañas a la derecha (contenido, diseño, tiempos, directo y publicar), cada una con su restablecer.
- **Directo:** panel de displays en tiempo real, lanzar listas con un toque, avisos a toda pantalla, mensaje en la cinta, encender, apagar, recargar e identificar; grupos y sedes.
- **Participación del público por QR** con la página `elige/`.
- **Formato horizontal**, con cartel y anuncio a la vez.
- **Vídeo**, **cinta de texto** (fija o de un RSS en vivo) y **código QR** en pantalla.
- **Plantillas** de diseño y **arrastrar y soltar** (carpetas al lienzo, listas a los displays).
- El origen privado pasa a ser del aparato, no de cada lista: se conserva al cambiar de lista.
- La política de privacidad recoge los repetidores del directo y el RSS.

Sigue de la v0.9:

- **Aviso legal:** se añade que es un proyecto personal del autor, ajeno a su empleador, que no lo encarga, financia ni respalda.

Sigue de la v0.8:

- **Solo carteles de muestra propios.** El repositorio público ya no contiene carteles de películas, música ni videojuegos de terceros. Las listas de demostración usan diez carteles y dos anuncios dibujados por código (`tools/muestras.py`), con títulos inventados.
- **Origen privado.** Un display puede leer sus listas e imágenes de **otra web con la misma estructura** (`playlists.json` + `assets/`), que solo conoce él: se le da una vez con `?origen=https://…` y lo recuerda; `?origen=no` vuelve a las muestras. El gestor también se abre sobre un origen privado con `?origen=…`. Así cada cual mantiene su contenido en su propia nube o repositorio privado y el público solo ve las muestras.

Sigue de la v0.7:

- **Documentación legal completa:** `LEGAL.md`, `DISCLAIMER.md`, `PRIVACY.md` y `COOKIES.md` en el repositorio, enlazados desde el «Aviso legal» de la app. El aviso de la app añade que no es un proyecto técnico ni asesoramiento profesional, que la limitación de responsabilidad no alcanza a lo que la ley no permite excluir, y un apartado de privacidad y contacto.

Sigue de la v0.6:

- **Aviso legal** enlazado detrás de la línea de crédito: software gratuito hecho por afición, sin garantías y de uso bajo la responsabilidad de cada cual (es/en/ca).
- **Descripción nueva:** cartelería digital sencilla pero potente para autónomos y negocios muy pequeños; no se presenta como una solución profesional.

Sigue de la v0.5:

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
- Varias zonas a medida en una misma pantalla y editor de carteles con texto propio.
- Conexión con nubes y discos del usuario.
- Repetidor propio para el directo.

## Licencia

[GPL-3.0](LICENSE)

---

*ADPOSTER v1.0 2026 es un proyecto hecho con ⚙ by [mediaservi.com](https://mediaservi.com)*

## Aviso

Software gratuito y de código abierto, hecho con pasión por un aficionado en su tiempo libre. No es un producto profesional. Se ofrece «tal cual», sin garantías de ningún tipo; los resultados son orientativos y hay que comprobarlos siempre; se usa bajo la responsabilidad de cada cual, hasta donde lo permita la ley aplicable. El aviso completo (es/en/ca) está en la propia app, en el enlace «Aviso legal» que acompaña a la línea de crédito. Licencia GPL-3.0.

Documentos legales del repositorio: [`LEGAL.md`](LEGAL.md) (aviso legal), [`DISCLAIMER.md`](DISCLAIMER.md) (garantías y responsabilidad), [`PRIVACY.md`](PRIVACY.md) (privacidad), [`COOKIES.md`](COOKIES.md) (cookies y almacenamiento local) y [`LICENSE`](LICENSE) (GPL-3.0). Sin publicidad, afiliación ni ingresos de ningún tipo.
