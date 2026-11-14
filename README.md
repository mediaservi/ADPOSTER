# ADPOSTER

**Cartelería digital sencilla pero potente, que arranca sola.** Pensada para autónomos y negocios muy pequeños que no tienen medios para un sistema de cartelería de pago. ADPOSTER convierte cualquier pantalla, en vertical o en horizontal, en un cartel digital: carteles que nunca se repiten, anuncios intercalados, vídeo, cinta de texto, códigos QR, horarios y un gestor desde el que se ven y se mandan todas las pantallas al momento, también desde el móvil. Es un apartado de [AVHUB](https://avhub.mediaservi.com/), *tools for AV people*, de [mediaservi.com](https://mediaservi.com).

Es software gratuito hecho por afición: sin cuentas, sin servidor propio, sin publicidad y sin cuotas.

**Versión actual: v1.11**

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
| **LISTAS** (izquierda, abajo) | Las listas de reproducción: crear, borrar y elegir la que se edita. Cada lista es de **carteles** (carpetas que rotan) o una **composición** de escenas. Desde aquí se abren la **biblioteca** y el **calendario**. |
| **LIENZO** (centro) | En una lista de carteles, la vista previa en vivo, con **zoom**, desplazamiento y **guías que se arrastran**. En una composición, el **editor**: cada pieza se selecciona, se mueve, se escala y se gira con el ratón o el dedo, con imán, deshacer y la tira de escenas debajo. |
| **Pestañas** (derecha) | **CONTENIDO** · **DISEÑO** · **TIEMPOS** · **DIRECTO** · **PUBLICAR**. En una composición, las dos primeras son **PIEZAS** (añadir, propiedades y capas) y **ESCENA** (fondo, duración, temporada y transición). Con botón de restablecer. |

En tablet y móvil las ventanas se apilan, con el lienzo arriba; en móvil apaisado el lienzo se queda a la izquierda.

## Funciones

**Composición** (nuevo en v1.1)

- **Escenas compuestas pieza a pieza.** Una lista puede ser una serie de escenas, cada una un lienzo con piezas colocadas libremente: **texto** (19 tipos de letra, con ajuste automático a la caja para que nunca se corte), **imagen**, **vídeo**, **zona** (una carpeta que va pasando dentro de un recuadro), **forma**, **reloj** (digital o analógico), **fecha**, **el tiempo** (con previsión), **noticias** de un RSS (cinta, lista o de una en una), **código QR** y **página web**.
- **Editor en el lienzo:** mover, escalar y girar; imán a bordes, centros y otras piezas; capas con bloqueo y ocultar; duplicar, copiar y pegar; teclado (flechas, Supr, Ctrl+D, Ctrl+Z/Y); deshacer y rehacer; caja con fondo, esquinas, borde, sombra y opacidad; animación de entrada de cada pieza.
- **Selección múltiple, alinear y repartir** (nuevo en v1.3): varias piezas se eligen con Mayús o Ctrl + clic (en el lienzo o en la lista de capas), arrastrando un marco en un hueco del lienzo, con Ctrl+A o, en pantallas táctiles, con la tecla «Elegir varias». Las elegidas se mueven, duplican, copian, borran y ordenan juntas; se **alinean** entre sí por cualquiera de sus bordes o centros y se **reparten** con el mismo hueco (tres o más). Con una sola pieza elegida, los mismos botones la alinean en el lienzo.
- **Galería de plantillas:** 34 puntos de partida propios, cada uno en vertical y en horizontal, por categorías (hostelería, comercio, eventos, empresa, información, QR y redes, fotos y carteles). Se añaden como escena nueva o sustituyen la actual, y luego se retocan.
- **Fondos:** color, degradado, malla de color o imagen, con oscurecido y trama.
- **Escenas de temporada:** una escena puede salir solo entre dos fechas.
- **«Probar»** pone la composición en el reproductor de verdad, dentro del lienzo.
- **Biblioteca:** todas las carpetas con sus miniaturas. En una lista de carteles, **orden fijo arrastrando**, **duración propia de cada archivo** y dejar alguno fuera. **Mis imágenes:** las que se suben desde el gestor (o se sueltan sobre el lienzo) viajan dentro de `playlists.json`, sin tocar el repositorio: pensado para logos y fotos sueltas.
- **Calendario:** reglas «esta lista, estos días, a estas horas, en estos displays» (todos, un grupo, una sede o uno solo), vistas sobre el mes. Cada display vuelve a su lista de casa cuando ninguna regla coincide.

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

**Instalable y sin conexión** (nuevo en v1.2)

- **Botón «Instalar»** en la cabecera del gestor: instala ADPOSTER como una aplicación en el móvil, la tableta, el ordenador o la tele. Es el botón común a la familia AVHUB.
- **Los displays siguen mostrando sus carteles si se cae internet:** cada pantalla guarda una copia de la app, de sus listas y de las imágenes que le tocan. Al volver la conexión se pone al día sola.
- No se guardan los vídeos (pesan demasiado) ni lo que viene de fuera: el tiempo, las noticias, las webs incrustadas y el directo necesitan conexión.

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
| `editor.js` | El editor de composiciones en el lienzo, las pestañas PIEZAS y ESCENA y la galería de plantillas |
| `gestion.js` | La biblioteca de archivos y el calendario |
| `escena.js`, `escena.css` | El motor que pinta las escenas; lo usan igual el editor y el reproductor |
| `plantillas.js` | Las plantillas de composición |
| `cine/`, `klub/`, `p/` | Las direcciones de reproducción (la URL que se da al kiosco) |
| `elige/` | La página del público (se llega por el QR) |
| `player.js`, `player.css` | El reproductor |
| `directo.js` | El canal en tiempo real (cliente MQTT mínimo, propio) |
| `instalar.js` | El botón «Instalar», común a la familia AVHUB |
| `manifest.json`, `sw.js` | Lo que hace la app instalable y guarda la copia para usarla sin conexión |
| `qr.js` | Generador de códigos QR (de terceros, licencia MIT: ver [assets/LICENCIAS-TERCEROS.md](assets/LICENCIAS-TERCEROS.md)) |
| `playlists.json` | Los ajustes de cada lista, sus escenas, el calendario (`agenda`) y las imágenes propias (`medios`) |
| `assets/<carpeta>/` | Las imágenes y vídeos. Las carpetas `ads-…` o con «anuncios» en el nombre son anuncios; `fondos`, los fondos |
| `assets/manifest.json` | El índice de archivos (se genera solo) |
| `entrada/` | Donde se suben las imágenes originales para que se preparen solas |
| `tools/preparar.py` | Convierte a WebP para FHD, copia los vídeos y regenera el índice |

Para publicar los ajustes de las listas: **Guardar playlists.json** y subir ese archivo a la raíz. Los displays lo recogen solos. Las órdenes del directo no necesitan publicar nada.

En tu propio dominio: copia el repositorio, publícalo (GitHub Pages, Netlify o cualquier alojamiento estático) y pon tus carpetas en `assets/`.

## Cambios de la versión actual (v1.11, beta)

- Logo de MSGAME de la barra de apps con la calavera nueva: el ojo derecho es una cruceta de mando, como si guiñara.

### v1.10 (beta)

- **ADPOSTER en la plantilla de bloques de AVHUB (BLOCKS, beta 1), con `?blocks` en la dirección (o entrando por `blocks/`, que lleva allí):** el gestor es el de siempre (`gestor.js`, sin tocar: mismas funciones) con el reparto de bloques fijos que ya usan SCREENS y SYSTEMS. A la izquierda, DISPLAYS y LISTAS; en los dos bloques grandes, **dos vistas distintas**: el LIENZO (el más ancho, porque es donde se trabaja) y el panel de la pestaña elegida; abajo, las cinco pestañas como bloques grandes (CONTENIDO · DISEÑO · TIEMPOS · DIRECTO · PUBLICAR, o PIEZAS y ESCENA en una composición). Solo en escritorio y TV; en tablet y móvil se queda el gestor apilado. La portada sigue siendo el gestor clásico, que **no cambia** (sin `?blocks` no se carga nada nuevo); desde BLOCKS se vuelve a él pulsando el logo.
- Pie con el texto común nuevo de AVHUB («… forma parte del proyecto AVHUB ideado por el fundador de mediaservi.com · Aviso legal»).
- El número de versión del pie vuelve a coincidir con el de este documento (el gestor decía v1.8).
- Enlace de pruebas: `https://raw.githack.com/mediaservi/ADPOSTER/beta/index.html?blocks`.

### v1.9

- **Logo de MSGAME**: se sirve con una dirección nueva para que nadie siga viendo el antiguo desde la copia guardada en su dispositivo, y se renueva la caché sin conexión.

### v1.8

- **Logo definitivo de MSGAME** («MS» en 3D con filete verde y «GAME» en fichas) en la barra de apps y en los 19 carteles de la lista KLUB, regenerados.

### v1.7

- **Consola de subida de carteles** (solo con el acceso privado abierto y con llave; el público no la ve): botón **SUBIR CARTELES** en la ventana de listas. Se sueltan, se pegan (Ctrl+V) o se eligen imágenes de cualquier formato y tamaño, varias a la vez.
- **Ajuste automático a póster**: cada imagen se convierte en el navegador a vertical 2:3 en WebP, al tamaño justo para un display FHD (1080 × 1620 como máximo; en las carpetas de anuncios `ads-…`, pantalla completa 9:16, 1080 × 1920; nunca se amplía). Si su proporción se parece a la del póster se recorta un poco por los bordes; si es muy distinta se coloca entera sobre un fondo desenfocado de la propia imagen. En cada una se puede cambiar entre «Recortar» y «Entera» viendo el resultado y su peso.
- **Destino con botones**: un botón por cada carpeta de la web privada (o una carpeta nueva). Todo sube al repositorio en una sola confirmación, junto con el índice `assets/manifest.json`, para que la web se publique una vez; los displays lo recogen solos.
- **Logo nuevo de MSGAME** en la barra de apps y en los 19 carteles de la lista KLUB.

### v1.6

- Cartel de **LA FORTUNA** de la lista KLUB actualizado: rótulo en rojo terciopelo con bombillas amarillas más visibles.

### v1.5

- **KLUB con las carátulas de MSGAME**: la lista de muestra KLUB rota ahora las 19 carátulas de los juegos de MSGAME (carpeta `assets/msgame-caratulas/`, a tamaño de cartel FHD), en lugar de los carteles de demostración.
- **CINE** sigue con los carteles de demostración de ADPOSTER (`assets/demo-carteles/`).

## Versiones anteriores

### v1.4

- **Acceso privado (candado del pie)**: un candado discreto en el pie del gestor abre el acceso del propietario. Se le da una vez la dirección de la web privada (la que lleva sus carteles y sus listas) y el gestor trabaja ya siempre sobre ella en ese navegador, sin escribir `?origen=`. El candado se enciende mientras el acceso está abierto; «Salir» lo cierra y vuelve a las muestras públicas. `?origen=no` enseña las muestras sin cerrar el acceso.
- **Publicar desde el gestor**: con el repositorio de la web privada y una llave de GitHub (token con permiso de escritura solo en ese repositorio), el botón pasa a llamarse **PUBLICAR** y sube `playlists.json` directamente; los displays recogen los cambios solos. Si la subida falla, se descarga el archivo como siempre.
- Dirección, repositorio y llave se guardan solo en ese navegador; no viajan al ADPOSTER público ni a ningún otro sitio que no sea GitHub.
- El borrador de la web privada se guarda aparte del de las muestras: ya no se mezclan.
- La URL de kiosco de cada display incluye el origen privado, lista para pegar.

### v1.3

- **Selección múltiple** en el editor de composiciones: Mayús o Ctrl + clic añade o quita piezas (en el lienzo y en la lista de capas); arrastrar en un hueco del lienzo dibuja un marco que elige todo lo que toca; Ctrl+A las elige todas y Escape las suelta. En pantallas táctiles, la tecla «Elegir varias» hace lo mismo sin teclado.
- **En grupo:** las piezas elegidas se mueven juntas (arrastrando o con las flechas, con imán a los bordes del grupo), y se duplican, copian, pegan, borran y pasan al frente o al fondo a la vez. Las bloqueadas no se mueven.
- **Alinear:** borde izquierdo, centro horizontal, borde derecho, arriba, centro vertical y abajo. Con varias piezas, entre sí; con una sola, en el lienzo. Las piezas giradas se alinean por la caja que las envuelve.
- **Repartir** en horizontal o en vertical, con el mismo hueco entre todas (tres piezas o más): la primera y la última no se mueven.
- Todo entra en deshacer y rehacer. No cambia nada más del aspecto ni del funcionamiento.

### Sigue de la v1.2

- **Instalable:** botón «Instalar» en la cabecera del gestor, con su icono propio; ADPOSTER se abre como una aplicación más.
- **Sin conexión:** el gestor y los displays guardan una copia de la app, de las listas y de las imágenes de sus carpetas (hasta 600 por pantalla), y siguen funcionando con ella si no hay internet. Con conexión se carga siempre lo último.
- **Corregido:** en el móvil, al abrir el gestor la pantalla ya no salta sola al lienzo; solo baja hasta él cuando se elige una lista a mano.
- **Corregido:** en un display real, la pieza «El tiempo» sin datos ya no enseña el ejemplo del editor.
- No cambia nada más del aspecto ni del funcionamiento.

**Conviene saber:** la instalación directa depende del navegador; donde no la ofrece, el botón explica cómo hacerlo a mano. Los vídeos, el tiempo, las noticias, las webs y el directo no se guardan.

### v1.1

- **Composiciones:** una lista puede ser una serie de escenas que se editan en el lienzo, pieza a pieza (texto, imagen, vídeo, zona de carpeta, forma, reloj, fecha, el tiempo, noticias, QR y web).
- **Editor en el lienzo** con mover, escalar, girar, imán, capas, deshacer y teclado; pestañas PIEZAS y ESCENA.
- **Galería de 34 plantillas**, cada una en vertical y en horizontal.
- **Biblioteca** con miniaturas, orden fijo arrastrando, duración por archivo e imágenes propias dentro de `playlists.json`.
- **Calendario** de reglas por fechas, días, horas y displays.
- **Dos listas de muestra nuevas:** ESCAPARATE (vertical) y PANEL (horizontal).
- 19 tipos de letra propios para las composiciones (todos con licencia abierta, alojados en el repositorio).
- Los rótulos que no caben en un botón saltan de línea en vez de cortarse.
- Las listas de carteles siguen funcionando igual que en v1.0.

**Conviene saber:** el tiempo usa el servicio abierto Open-Meteo; las noticias solo funcionan con canales RSS que permiten leerse desde otra web; muchas webs no dejan mostrarse dentro de otra. Al cambiar una composición de vertical a horizontal las piezas conservan su posición relativa: es mejor partir de la plantilla en el formato que toca. Sigue sin haber cuentas de usuario ni almacenamiento propio.

### v1.0

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
- Selección de varias piezas a la vez, alinear y repartir; más plantillas.
- Adaptar sola una composición al cambiar de vertical a horizontal.
- Conexión con nubes y discos del usuario.
- Repetidor propio para el directo.

## Licencia

[GPL-3.0](LICENSE)

---

*ADPOSTER v1.8 2026 es un proyecto hecho con ⚙ by [mediaservi.com](https://mediaservi.com)*

## Aviso

Software gratuito y de código abierto, hecho con pasión por un aficionado en su tiempo libre. No es un producto profesional. Se ofrece «tal cual», sin garantías de ningún tipo; los resultados son orientativos y hay que comprobarlos siempre; se usa bajo la responsabilidad de cada cual, hasta donde lo permita la ley aplicable. El aviso completo (es/en/ca) está en la propia app, en el enlace «Aviso legal» que acompaña a la línea de crédito. Licencia GPL-3.0.

Documentos legales del repositorio: [`LEGAL.md`](LEGAL.md) (aviso legal), [`DISCLAIMER.md`](DISCLAIMER.md) (garantías y responsabilidad), [`PRIVACY.md`](PRIVACY.md) (privacidad), [`COOKIES.md`](COOKIES.md) (cookies y almacenamiento local) y [`LICENSE`](LICENSE) (GPL-3.0). Sin publicidad, afiliación ni ingresos de ningún tipo.
