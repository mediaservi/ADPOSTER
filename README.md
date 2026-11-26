# ADPOSTER

**Cartelería digital sencilla pero potente, que arranca sola.** Pensada para autónomos y negocios muy pequeños que no tienen medios para un sistema de cartelería de pago. ADPOSTER convierte cualquier pantalla, en vertical o en horizontal, en un cartel digital: carteles que nunca se repiten, anuncios intercalados, vídeo, cinta de texto, códigos QR, horarios y un gestor desde el que se ven y se mandan todas las pantallas al momento, también desde el móvil. Es un apartado de [AVHUB](https://avhub.mediaservi.com/), *tools for AV people*, de [mediaservi.com](https://mediaservi.com).

Es software gratuito hecho por afición: sin cuentas, sin servidor propio, sin publicidad y sin cuotas.

**Versión actual: v1.46**


## Icono

Icono de pestaña y de app (noviembre 2026) en el estilo de placa de la familia AVHUB: placa con degradado negro a morado, filete negro y sombra verde, con el isotipo de la app. El logo de la cabecera no cambia.

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
| **LISTAS** (izquierda, abajo) | Las listas de reproducción: crear (vacía), duplicar, borrar y elegir la que se edita. Cada lista es de **carteles** (carpetas que rotan) o una **composición** de escenas. Desde aquí se abren la **biblioteca** y el **calendario**. |
| **LIENZO** (centro) | En una lista de carteles, la vista previa en vivo, con **zoom**, desplazamiento y **guías que se arrastran**, y debajo **la tira con todos los carteles** en el orden en que salen (desde v1.15). En una composición, el **editor**: cada pieza se selecciona, se mueve, se escala y se gira con el ratón o el dedo, con imán, deshacer y la tira de escenas debajo. |
| **Pestañas** (derecha) | **CONTENIDO** · **DISEÑO** · **TIEMPOS** · **DIRECTO** · **PUBLICAR**. En una composición, las dos primeras son **PIEZAS** (añadir, propiedades y capas) y **ESCENA** (fondo, duración, temporada y transición). Con botón de restablecer. |

En tablet y móvil se ve una ventana cada vez, con la barra de abajo **LISTAS · LIENZO · AJUSTES · MANDO** (v1.23). Arriba, el conmutador **SIMPLE · PRO** y la tecla roja **EMERGENCIA**.

## Funciones

**FOTO, el editor de imagen** (nuevo en v1.16; herramientas de retoque desde v1.17)

- **Dónde:** `adposter.mediaservi.com/foto/`, o desde el gestor: al ver un cartel en grande, «✎ Editar en FOTO» lo abre en otra pestaña. También se abre una imagen soltándola, pegándola o eligiéndola.
- **Capas** con visibilidad, opacidad y 16 modos de fusión; capa nueva, imagen como capa, duplicar, borrar, subir, bajar, combinar abajo y acoplar todo.
- **Historial** con deshacer y rehacer (Ctrl+Z / Ctrl+Y) y la lista de pasos para volver a cualquiera.
- **Recortar** con proporciones (libre, original, 9:16, 16:9, 2:3, 3:2, 1:1, 4:5) y **enderezar**; girar 90°, voltear y cambiar el tamaño.
- **Ajustes:** brillo y contraste (con exposición y gamma), niveles, curvas, tono y saturación (con vividez), equilibrio de color y blanco y negro con virado. **Filtros:** desenfocar, enfocar, ruido y viñeta. Todos con vista previa en vivo.
- **Botones mágicos de un toque**, cada uno con su intensidad: mejora automática, vividez, balance de blancos, quitar neblina, quitar ruido y enfocar.
- **Exportar** en WebP, JPG o PNG (con transparencia) a la medida de cada pantalla (FHD vertical u horizontal, póster 2:3, cuadrada, 4K) llenando o entera. **Guardar copia en ADPOSTER** la deja en «Mis imágenes»; el original no se toca nunca y la copia se llama `…-editada`.
- **Selecciones** (nuevo en v1.17): rectángulo o elipse (M), lazo (L), varita mágica con tolerancia, contigua o por color (W), con borde suave. Modo nuevo, añadir (Mayús), restar (Alt) o cruzar; invertir, todo y nada (Ctrl+A / Ctrl+D / Ctrl+Mayús+I), rellenar, vaciar (Supr) y pasar a capa nueva (Ctrl+J). **La selección limita** los ajustes, los filtros, los botones mágicos y los pinceles.
- **Máscaras de capa** (nuevo en v1.17): añadir (desde la selección, si la hay), pintar en la máscara con el pincel o el borrador, aplicar y quitar.
- **Pinceles** (nuevo en v1.17): pincel (B) y borrador (E) con tamaño, dureza y opacidad; **tampón de clonar** (S) y **pincel corrector** (J), que toma la textura del origen y el color del destino. El origen se marca con Alt + clic. `[` y `]` cambian el tamaño.
- **Texto** (nuevo en v1.17, T): capas de texto que se siguen editando, con los 19 tipos de letra de la marca, tamaño, grosor, interlineado, alineación, color, contorno y sombra; se mueven arrastrando.
- **Formas** (U: rectángulo, rectángulo redondeado, elipse, línea y flecha, con relleno y borde) y **degradados** (G: lineal o radial, de un color a otro o a transparente).
- **Transformar capa** (nuevo en v1.17, Q o Ctrl+T): mover, escalar desde las esquinas (Mayús: libre) y girar con el tirador de arriba; Intro aplica y Esc cancela.
- Con una herramienta elegida, sus opciones salen arriba del panel y la pestaña elegida (capas, historial…) debajo.
- Todo ocurre en el navegador: la imagen no sale del equipo.
- **Grupos de capas** (nuevo en v1.18): «Agrupar con la de abajo» junta capas en una carpeta con su ojo, su opacidad y su fusión; se abre y se cierra, y «Desagrupar» la deshace.
- **Con IA, en el navegador** (nuevo en v1.18), en la pestaña MAGIA:
  - **Quitar el fondo:** lo oculta con una máscara de capa (se retoca con el pincel o el borrador pintando en la máscara); el control «Borde» lo hace más suave o más duro.
  - **Borrar un objeto** (O): se pinta encima y «Borrar lo pintado» lo rellena con lo que tiene alrededor.
  - **Ampliar ×2 o ×4** sin perder detalle (con una limpieza suave del ruido), todas las capas a la vez y hasta 8192 px de lado.
  - **Reparar foto antigua:** quita arañazos y motas (respeta lo que no tiene forma de arañazo), el grano y aviva el color desvaído, cada cosa con su control. Si un arañazo cruza un texto, ese trozo de texto también puede irse: baja «Arañazos».
  - **Colorear** fotos en blanco y negro, con su intensidad.
  - Cada modelo se descarga solo la primera vez que se usa y queda guardado en el navegador; va con WebGPU si el navegador lo tiene y, si no, con el procesador (ampliar una foto grande puede tardar unos minutos).
- **PSD** (nuevo en v1.18): se abren con sus capas, máscaras, opacidades, fusiones y grupos (soltándolos, eligiéndolos o como capas encima de lo abierto), y se guardan igual desde EXPORTAR (formato «PSD (con capas)», a tamaño original).

**La lista de carteles a la vista** (nuevo en v1.15)

- **Toda la lista debajo del lienzo**: cada cartel con su número, su duración y su estado, en el orden en que sale, y al final los anuncios con su ritmo.
- **Tocar un cartel abre su ficha:** duración (− +), **fechas** (desde / hasta), dejarlo fuera, moverlo, verlo en grande y, si es suelto, quitarlo.
- **Arrastrar un cartel** lo cambia de sitio (la lista pasa a orden fijo).
- **Fechas por cartel:** el display solo lo enseña entre esas fechas (estreno y fin de cartelera); a medianoche entran y salen solos. En la tira, los caducados salen apagados (✕), los que están por llegar con ⏳ y los que tienen fecha con 📅.
- **Carteles sueltos:** con «+» se añaden carteles de cualquier carpeta o de «Mis imágenes» sin meter la carpeta entera. También se puede añadir la carpeta entera desde ahí.
- **Resumen:** cuántos carteles salen, cuánto dura una vuelta, el orden (al azar o fijo) y los avisos (caducados, por llegar, fuera y carpetas vacías).


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
- **Previa local** (desde v1.13): con la herramienta `previa.py` de la carpeta de originales, el gestor y las pantallas funcionan en tu ordenador leyendo de tu carpeta, sin publicar nada y sin internet; «Guardar en este ordenador» guarda las listas en esa carpeta. Las pantallas de la misma red pueden leer de ahí.
- **Imágenes preparadas solas:** lo que se sube a `entrada/` se convierte y se publica (ver [entrada/LEEME.md](entrada/LEEME.md)).
- Interfaz en español, inglés y catalán.

**Instalable y sin conexión** (nuevo en v1.2)

- **Botón «Instalar»** en la cabecera del gestor: instala ADPOSTER como una aplicación en el móvil, la tableta, el ordenador o la tele. Es el botón común a la familia AVHUB.
- **Los displays siguen mostrando sus carteles si se cae internet:** cada pantalla guarda una copia de la app, de sus listas y de **todas las imágenes de todas las listas** (también las de un origen privado). Al volver la conexión se pone al día sola.
- **Cada imagen se descarga una sola vez** (desde v1.13): el índice lleva la huella de cada archivo y el display enseña su copia guardada sin volver a pedirla; solo baja las nuevas o las cambiadas. Ahorra datos y peticiones a la web que aloja los carteles (en Netlify, créditos). El panel del display dice cuántas tiene guardadas.
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
| `pantallas.js` | SIMPLE / PRO, asistente por negocio, añadir pantalla (URL, QR y código), A PANTALLAS, EMERGENCIA, mando de turnos y pedidos, formato a medida, avisos de desconexión e informe de emisión (v1.23) |
| `lista.js` | La tira de carteles bajo el lienzo, la ficha de cada cartel y «+» para añadir carteles sueltos (v1.15) |
| `foto/` | FOTO, el editor de imagen (v1.16; guía en `foto/LEEME.md`): `index.html`, `foto.js` (capas, historial, herramientas y paneles), `px.js` (ajustes, filtros y botones mágicos) y `foto.css` |
| `escena.js`, `escena.css` | El motor que pinta las escenas; lo usan igual el editor y el reproductor |
| `plantillas.js` | Las plantillas de composición |
| `cine/`, `klub/`, `p/` | Las direcciones de reproducción (la URL que se da al kiosco) |
| `elige/` | La página del público (se llega por el QR) |
| `player.js`, `player.css` | El reproductor |
| `directo.js` | El canal en tiempo real (cliente MQTT mínimo, propio) |
| `instalar.js` | El botón «Instalar», común a la familia AVHUB |
| `manifest.json`, `sw.js` | Lo que hace la app instalable y guarda la copia para usarla sin conexión |
| `qr.js` | Generador de códigos QR (de terceros, licencia MIT: ver [assets/LICENCIAS-TERCEROS.md](assets/LICENCIAS-TERCEROS.md)) |
| `playlists.json` | Los ajustes de cada lista (también `sueltos` y, por cartel, `archivos` con `seg`, `off`, `desde` y `hasta`), sus escenas, el calendario (`agenda`) y las imágenes propias (`medios`) |
| `assets/<carpeta>/` | Las imágenes y vídeos. Las carpetas `ads-…` o con «anuncios» en el nombre son anuncios; `fondos`, los fondos |
| `assets/manifest.json` | El índice de archivos (se genera solo) |
| `entrada/` | Donde se suben las imágenes originales para que se preparen solas |
| `tools/preparar.py` | Convierte a WebP para FHD, copia los vídeos y regenera el índice (con la huella de cada archivo) |

Para publicar los ajustes de las listas: **Guardar playlists.json** y subir ese archivo a la raíz. Los displays lo recogen solos. Las órdenes del directo no necesitan publicar nada.

En tu propio dominio: copia el repositorio, publícalo (GitHub Pages, Netlify o cualquier alojamiento estático) y pon tus carpetas en `assets/`.

## Cambios de la versión actual (v1.46)
- **Arreglo:** de vez en cuando (más o menos 1 de cada 40 aperturas), el gestor en SIMPLE salía con algunos rótulos de PRO («Activar el directo», «Directo»…) hasta tocar algo. Ahora el modo SIMPLE se marca antes de pintar nada.
- Caché nueva de la app (`adposter-v41`).

## Cambios de la v1.45
- **Lo que sale ahora, en grande:** en «Ver todas», tocar la miniatura de una pantalla la abre en grande, con la escena o la foto que está enseñando en ese momento, su nombre, su lista y su estado. Tocar el nombre sigue sirviendo para mandarle avisos.
- Cada pantalla informa de la escena exacta que tiene puesta, así que la miniatura acierta aunque dos escenas se llamen igual (las pantallas con versiones anteriores siguen funcionando por el nombre).
- La guía (AYUDA) lo explica en el apartado Pantallas.
- Caché nueva de la app (`adposter-v40`).

## Cambios de la v1.44
- **Pieza Agenda:** enseña los próximos eventos con la fecha en un bloque del color de acento, el día («Hoy», «Mañana» o el día de la semana), la hora y el lugar. Los eventos pasados se quitan solos. Dos fuentes:
  - **Escritos aquí:** una línea por evento, por ejemplo `28/11 19:00-21:00;Concierto;Sala 2` o `24/12;Nochebuena` (sin hora, todo el día).
  - **Calendario (ICS):** la dirección pública de un calendario (en Google Calendar, «Dirección pública en formato iCal»). Entiende eventos que se repiten (cada día, cada semana con sus días, cada mes o cada año) y salta los cancelados. Solo funcionan los calendarios que se dejan leer desde otra web; sin red, la pantalla usa la última copia.
- Se elige cuántos eventos salen (1 a 8), los colores y la letra. La guía (AYUDA) la menciona.
- Caché nueva de la app (`adposter-v39`).

## Cambios de la v1.43
- **Modo operador para tu equipo:** en «📱 Mando en el móvil» hay dos códigos, **Completo** y **Solo operador**. El de operador abre el gestor unido a tus pantallas pero solo con lo del día a día: las pantallas, los turnos, los pedidos, los avisos y la emergencia; sin listas, editor, publicar ni SIMPLE/PRO. Para volver al gestor completo, «Salir del modo operador» (dos toques). Es para simplificar, no un candado: quien tiene el código del canal puede mandar a las pantallas.
- En el móvil apaisado, el QR del mando va a la izquierda y los textos a la derecha, para que quepa todo.
- La guía (AYUDA) explica el modo operador.
- Caché nueva de la app (`adposter-v38`).

## Cambios de la v1.42
- **AYUDA: guía de uso en español, inglés y catalán.** Botón «?» en la cabecera, en todos los formatos. Doce apartados cortos: qué es, empezar en 4 pasos, listas, editar una escena, pantallas, publicar, avisos y emergencia, horarios y calendario, turnos, pedidos y precios, pantallas táctiles, SIMPLE y PRO, y trucos. Algunos apartados llevan un botón que abre directamente esa parte de la app (asistente, añadir pantalla, aviso, calendario). En el móvil vertical, el «?» ocupa el sitio de la «i»: la información (versión, instalar, avisar de un fallo) se abre desde «Acerca de» dentro de la guía.
- **Tema de marca** (pestaña ESCENA): eliges un color de acento y una letra para los títulos, y se aplican a todas las escenas de la lista y a las plantillas que añadas después. El acento sustituye los colores vivos (no blancos, negros ni grises, ni los QR); si un texto queda del mismo color que lo que tiene debajo, pasa a blanco o negro. Se deshace con ↶.
- En el móvil vertical, los botones redondos de la cabecera ya no se encogen y el botón de aviso ajusta su letra para caber en los tres idiomas.
- Caché nueva de la app (`adposter-v37`).

## Cambios de la v1.41
- **Restaurante en el ASISTENTE:** crea tres listas de una vez, una por pantalla: **ENTRADA** (vertical: bienvenida, menú del día de 12:00 a 16:00, especialidad, horario y reseñas), **SALA** (horizontal: pizarra, carta, especialidad, redes y wifi) y **CARTA TÁCTIL** (una portada con el botón «Ver la carta» que se queda quieta hasta que alguien la toca). El último paso recuerda añadir una pantalla para cada lista.
- En pantallas bajas (móvil apaisado), los tipos de negocio del asistente van en tres columnas para que todo quepa sin desplazar.
- Caché nueva de la app (`adposter-v36`).

## Cambios de la v1.40
- **Pieza Botón (pantallas táctiles):** en PIEZAS, «Botón» añade un rótulo grande (por defecto «Ver más») que, al tocarlo en la pantalla, lleva a la escena que elijas en «Lleva a». Se eligen el texto, el color del botón, el color de la letra y el tipo de letra; el rótulo se ajusta solo a la caja y el botón se hunde un poco al tocarlo. Al añadir el primer botón, la lista pasa a pantalla táctil.
- **Quedarse en la portada:** en el botón (y en TIEMPOS › Modo táctil), con esta opción la pantalla no va pasando escenas sola: se queda en la primera hasta que alguien toca un botón, y a los segundos de «vuelta» sin tocar regresa a la primera.
- Caché nueva de la app (`adposter-v35`).

## Cambios de la v1.39
- **Etiquetas por pantalla:** al añadir una pantalla (en «Más opciones») puedes darle una o varias etiquetas separadas por comas, como «barra, terraza». Después, en A PANTALLAS y en las reglas del calendario, puedes mandar un aviso, una lista o un turno solo a las pantallas con esa etiqueta (por ejemplo, todas las de la barra aunque estén en grupos distintos). Hasta 8 etiquetas por pantalla.
- Si cambias las etiquetas de una pantalla, se vuelve a conectar sola para recibir las órdenes nuevas.
- Caché nueva de la app (`adposter-v34`).

## Cambios de la v1.38
- **Posición y tamaño en píxeles en los lienzos A MEDIDA (LED):** al elegir una pieza, X, Y, ancho y alto van en píxeles reales del controlador (por ejemplo, de 0 a 1500 × 0 a 1000), para cuadrar las piezas con los módulos. En los lienzos normales siguen en %.
- **Miniaturas más grandes** en la tira de carteles y de escenas, en SIMPLE y en pantallas de escritorio altas (sin desplazar la página).
- Caché nueva de la app (`adposter-v33`).

## Cambios de la v1.37
- **Fondo desenfocado:** si una foto no encaja con la forma de la pantalla (una vertical en una tele horizontal), sale entera y con ella misma ampliada y desenfocada detrás, en lugar de recortarla o dejar los lados en negro. Se activa en CONTENIDO («Fondo desenfocado»); las listas nuevas de SIMPLE lo traen puesto. Las fotos que casi encajan (un póster 2:3 en una tele vertical) siguen llenando la pantalla.
- **Deshacer en el mando de pedidos:** «↶ Deshacer» vuelve atrás el último toque (añadir, pasar a listo, retirar o limpiar), hasta 20 pasos.
- **«Hoy cerrado» dura todo el día:** en la tecla AVISO, ese texto preparado se queda hasta las 23:59.
- **Copiar una escena a otra lista:** en ESCENA, «Copiar a otra lista» la añade al final de la lista de composición que elijas, sin tocar esta.
- Caché nueva de la app (`adposter-v32`).

## Cambios de la v1.36
- **Subir fotos desde «Añadir carteles» las mete ya en la lista** (una o varias), sin pulsar «Añadir» otra vez; la ventana se cierra y el estado dice cuántas han entrado.
- **El asistente solo pide el nombre del negocio cuando lo va a usar** (en el rótulo de marca o bajo el QR); en la cafetería, por ejemplo, ya no lo pide.
- **El estado no se mete debajo de los botones:** un mensaje largo se corta con puntos suspensivos y se lee entero al pasar por encima.
- **La tira de escenas enseña su horario:** «1 · ⏰ 07:00–12:00» en lugar de solo la duración, cuando la escena tiene horas.
- **En el móvil, la tecla roja dice «SOS»** en lugar de ser un cuadrado sin texto.
- Caché nueva de la app (`adposter-v31`).

## Cambios de la v1.35
- **Rótulos que dicen sobre qué actúan:** «Duplicar lista / Borrar lista» en LISTAS, «Duplicar escena / Borrar escena» en ESCENA y «Duplicar pieza / Borrar pieza» en PIEZAS (antes, «Duplicar» y «Borrar» a secas en los tres sitios). Las flechas de la escena dicen **«◀ Mover antes»** y **«Mover después ▶»** (parecían «anterior / siguiente»).
- **Barra de abajo del móvil:** LISTAS · **EDITAR** · AJUSTES · **AVISOS** (antes LIENZO y MANDO).
- En LISTAS, los botones pasan a dos líneas si no caben (en tablet o en catalán), siempre entre palabras.
- Caché nueva de la app (`adposter-v30`).

## Cambios de la v1.34
- **Editor de textos más corto en SIMPLE:** seis tipos de letra recomendados (Inter, Montserrat, Bebas Neue, Playfair, Caveat y Archivo Black, más la que ya lleve la pieza) y **«Más letras…»** para ver las 19; la alineación, las mayúsculas, la cursiva, la sombra y los espaciados, plegados en **«Más: alineación, mayúsculas, sombra…»**. Así el panel cabe sin desplazarse. En PRO, todo a la vista como antes.
- **Las piezas nuevas buscan un hueco libre** (SIMPLE): en lugar de caer en el centro encima de lo que haya, se colocan donde menos tapen (las formas de fondo no cuentan), lo más cerca del centro; si a su tamaño no caben, prueban a tres cuartos y a la mitad. En PRO, la cascada de siempre.
- Caché nueva de la app (`adposter-v29`).

## Cambios de la v1.33
- **Tecla AVISO** en la cabecera, ámbar, junto a la roja de EMERGENCIA: abre una ventanita con textos preparados (**Cerramos antes hoy**, **Volvemos enseguida**, **Oferta del día**, **Hoy cerrado**) o libre, **cuánto dura** (30 s, 2 min, 10 min o hasta una hora), el **color** y **ENVIAR AVISO**. Es el mismo aviso de la pestaña AVISOS/DIRECTO, a un toque.
- La **EMERGENCIA** se queda para lo que es: evacuación, incendio, confinamiento o texto libre. «Cierre del local» sale de su lista (para eso está el AVISO).
- Caché nueva de la app (`adposter-v28`).

## Cambios de la v1.32
- **Dirección corta para la tele: `adposter.mediaservi.com/tv`**, fácil de teclear con el mando; abre la página de alta con código (lo mismo que `…/p/?alta`). «Añadir pantalla» la enseña en su lugar. Ojo: una lista que se llamara «tv» ya no tendría la dirección corta `/tv` (usa `…/p/?l=tv`).
- **«Añadir pantalla» en SIMPLE, en tres pasos y en una columna:** 1 · en la tele (qué abrir), 2 · cómo se llama y qué lista enseña, 3 · el código y EMPAREJAR. Grupo, sede, giro e idioma, plegados en **«Más opciones»**. En PRO, igual que antes.
- Los ejemplos de los campos de nombre, grupo y sede ya no se cortan en el móvil.
- Caché nueva de la app (`adposter-v27`), que guarda también `tv/` para usarla sin conexión.

## Cambios de la v1.31
- **Cartas con la pieza PRECIOS:** las plantillas **Cafetería**, **Pizarra** («Hoy recomendamos») y **Lista de precios** ya no llevan los productos y los precios en dos textos sueltos que había que cuadrar a mano: usan la pieza Precios, una línea por producto («Café con leche;1,60»), que alinea sola y une nombre y precio con una línea de puntos. El aspecto se mantiene (mismos tipos de letra, colores y sitio). Vale para las listas nuevas y para el asistente de cafetería; las listas ya hechas no cambian.
- La pieza Precios respeta el **grosor de letra** que traiga (`peso`); sin él, sigue en negrita como antes.
- Caché nueva de la app (`adposter-v26`).

## Cambios de la v1.30
- **«Qué sale y cuándo», en un solo sitio:** la vista **SEMANA** del calendario enseña, junto a las reglas, lo que de verdad sale en cada cuarto de hora: las horas en que la lista que manda está **cerrada** por su horario de encendido (rayado, «Cerrado») y, en una franja azul a la derecha, sus **escenas con hora** (por ejemplo, Cafetería de 7 a 12). Con «Ver» puesto en una pantalla, cuenta también su lista de siempre. Leyenda debajo. Los tres ajustes siguen donde estaban: ESCENA, TIEMPOS y las reglas del calendario.
- **«Ver en el calendario»** en la pestaña ESCENA (bajo «Días y horas») y en TIEMPOS (junto a «Horario de encendido»): abre el calendario en la vista SEMANA.
- Caché nueva de la app (`adposter-v25`).

## Cambios de la v1.29
- **«Mis fotos»** (SIMPLE): botón en LISTAS, junto a Calendario y ASISTENTE, que abre tus imágenes para subirlas, verlas y quitarlas, con su contador. Sin hablar de archivos: «Tus fotos viajan con tus listas a las pantallas».
- **Carpetas de ejemplo fuera de la vista** (SIMPLE): en CONTENIDO, cuando ya tienes fotos tuyas, las carpetas de muestra que no usa la lista dejan de salir, y la nota dice dónde añadir las tuyas.
- **LISTAS en tablet:** la fila Biblioteca / Mis fotos · Calendario · ASISTENTE pasa a dos líneas por debajo de 1180 px (antes se cortaban los rótulos).
- Caché nueva de la app (`adposter-v24`).

## Cambios de la v1.28
- **«+ Nueva» pregunta qué va en la lista:** «Fotos que van pasando» (carteles) o «Textos, precios y fotos» (composición, que abre la galería de plantillas). Antes, los botones «Carteles | Composición» de LISTAS parecían elegir el tipo de la lista nueva, pero cambiaban la abierta.
- En **SIMPLE**, «Carteles | Composición» ya no sale en LISTAS; en **PRO** sigue donde estaba, para cambiar el tipo de una lista ya hecha.
- Caché nueva de la app (`adposter-v23`).

## Cambios de la v1.27
- **Un solo botón PUBLICAR** bajo el lienzo (antes «✓ ENVIAR CAMBIOS» y «▶ A PANTALLAS» juntos): **✓ PUBLICAR** manda tus cambios a todas las pantallas y cada una sigue con su lista; la flechita **▾** de al lado abre «Poner otra lista un rato o desde una fecha» (lo que antes era A PANTALLAS, igual que siempre). Los textos que nombraban «✓ Enviar cambios» (asistente, calendario y la pantalla en espera) dicen ahora «✓ Publicar». En las pestañas AVISOS/DIRECTO y PUBLICAR, A PANTALLAS sigue como estaba.
- Caché nueva de la app (`adposter-v22`).

## Cambios de la v1.26
- **Bienvenida** (SIMPLE, solo la primera vez y sin listas propias): en lugar de abrir el editor de un ejemplo, tres caminos grandes: **Crear mis carteles** (abre el asistente), **Conectar mi tele** (abre «Añadir pantalla») y **Ver un ejemplo**. Sale una sola vez; en PRO o con listas propias no sale. En español, inglés y catalán.
- Caché nueva de la app (`adposter-v21`).

## Cambios de la v1.25
Más fácil para quien empieza, sin mover nada de sitio. Todo lo de la v1.24 sigue igual.

- **Restablecer pide un segundo toque**, como Borrar la lista: antes, en una composición, borraba todas las escenas de golpe.
- **El estado dice la verdad** (SIMPLE): «Sin enviar a las pantallas» en lugar de «Cambios sin guardar», porque lo hecho ya queda guardado en el aparato.
- **SIMPLE con palabras de tienda:** la pestaña DIRECTO se llama **AVISOS**; fuera «displays» en el calendario y en TIEMPOS; la emergencia sin pantallas dice «Sin pantallas conectadas: solo se ve aquí»; «Pantalla en negro» y «Quitar el negro»; «Hacer parpadear»; «Ya tengo pantallas en otro aparato».
- **Conectar la primera pantalla:** en SIMPLE, el botón amarillo es «+ Añadir pantalla» (emparejar ya conecta solo). La ventana dice con qué se abre la dirección en la tele (el navegador o la app Kiosk del stick); el campo del código ya no se corta y no queda un cuadro negro vacío debajo. Corregida la errata «Lista:» → «Listo:» al emparejar.
- **Tus fotos primero:** al añadir carteles, «Mis imágenes» es la primera carpeta y, en SIMPLE, la que se abre; si está vacía, dice qué pulsar.
- **Lista nueva a pantalla completa en SIMPLE:** la foto ya no sale encogida bajo una cabecera.
- **Una lista vacía dice qué hacer** («Esta lista aún no tiene carteles: añádelos desde el gestor»), también en la tele.
- **Asistente:** «Siguiente ▶» en lugar de solo «▶»; en cafetería, comida rápida y oficina propone la pantalla en horizontal; «Lista creada» en singular. «1 escena» y «1 pieza» en LISTAS.
- **A PANTALLAS** explica qué hace al pasar por encima, y la nota de «Que sea su lista de siempre» es más llana.
- **Avisos:** duran 30 s por defecto (antes 10) y el campo de hora lleva su rótulo, «o hasta las».
- **Horario de encendido:** «Usar horario» en lugar de «En horario», que parecía un estado.
- **Imagen:** «Llenar (recorta)» y «Entera» en lugar de «Cubrir» y «Contener». **Precios:** el campo vacío enseña un ejemplo, «Café con leche;1,60».
- Caché nueva de la app (`adposter-v20`); las imágenes guardadas se conservan.

## Cambios de la v1.24
- **Calendario: aviso al salir con reglas sin guardar.** Una regla nueva sigue naciendo en borrador y no se aplica hasta pulsar «Guardar la regla»; ahora, si cierras el calendario con reglas en borrador, un aviso te lo recuerda y deja elegir **Guardar y salir**, **Salir sin guardar** (se quedan en borrador) o **Seguir aquí**. En español, inglés y catalán.
- **Direcciones de carpeta sin la barra final (24-11-2026):** con la app ya visitada o instalada, abrir una dirección como `/p` daba «No se puede acceder a este sitio web» (ERR_FAILED), porque el service worker entregaba tal cual la respuesta redirigida por el servidor. Ahora devuelve una redirección limpia; caché renovada (`adposter-v18`).

## Cambios de la v1.23
Pensada para usos muy distintos, desde quien pone su primera pantalla hasta quien instala muchas. Todo lo de la v1.22 sigue igual.

**Dos modos: SIMPLE y PRO**
- **Conmutador SIMPLE · PRO** junto al logo, el mismo de SCREENS y SYSTEMS (en el móvil, una burbuja). Quien entra por primera vez empieza en SIMPLE; quien ya tenía listas, en PRO.
- **SIMPLE** esconde lo técnico (diseño de márgenes, guías, biblioteca, origen privado, canal, capas, caja y animaciones de las piezas) y deja el QR en CONTENIDO.
- **ASISTENTE por tipo de negocio** (SIMPLE): cafetería o bar, comida rápida, tienda, peluquería o estética, clínica o sala de espera, oficina, concesionario o LED. Tres pasos (negocio, pantalla y crear) y deja hechas las listas con sus plantillas; en la cafetería, cada escena con su franja horaria (desayuno, mediodía, tarde).

**Pantallas**
- **Añadir pantalla**: nombre, grupo, sede, lista, giro e idioma, y sale la URL del kiosco con su **código QR**.
- **Alta con código**: la pantalla nueva abre `…/p/?alta` y enseña un código de 6 caracteres (y un QR que abre el gestor ya con el código). Se escribe en «Añadir pantalla» → **Emparejar** y la pantalla se configura sola (canal, lista, nombre, grupo, sede, giro e idioma), sin teclear direcciones con el mando.
- **DISPLAYS**: contadores (en línea, fuera de horario, sin señal), **miniatura** de lo que sale en cada pantalla y **«visto hace…»**.
- **Aviso de desconexión**: si una pantalla que estaba en línea deja de hablar más de 2 minutos, el gestor abierto pita, parpadea y, con permiso, saca una **notificación del navegador** (campana 🔔 de DISPLAYS para activarlo o no).
- **Informe de emisión (CSV)** (PRO): cada display cuenta qué ha sacado y cuánto tiempo, por día (31 días); el gestor lo pide por el directo y lo descarga.
- **Lienzo A MEDIDA para pantallas LED** (ancho × alto en píxeles, o columnas × filas de cabinets): el reproductor toma la proporción exacta del controlador, sin franjas negras.

**Publicar: un solo botón A PANTALLAS**
- Siempre a la vista bajo el lienzo, y en DIRECTO y PUBLICAR. **Qué** lista, **dónde** (todas, un grupo, una sede o una pantalla) y **cuándo**: **ahora**, **durante N minutos** (luego la pantalla vuelve sola a lo suyo) o **desde una fecha y hora** (crea la regla del calendario).
- **Sin subir archivos**: con el directo activo, las listas, el calendario, los festivos y las imágenes propias que se usan viajan en un mensaje que el repetidor guarda («datos»). Cada display lo usa al momento y lo guarda para seguir sin conexión; manda el que sea más nuevo, este o el `playlists.json` publicado (que ahora lleva la fecha `publicado`). `playlists.json` sigue siendo la copia permanente: con acceso privado, panel ADMIN o previa local, A PANTALLAS también lo publica a la vez. Los repetidores son públicos y gratuitos, sin garantía de que guarden los mensajes para siempre: por eso conviene publicar también el archivo.

**Calendario y horarios**
- **Vista SEMANA** con franjas de color por lista (además de la de mes): tocar una franja libre crea una regla a esa hora; filtro **Ver** por grupo, sede o pantalla, y fila **POR DEFECTO** con la lista de casa.
- **Varios tramos por día** en cada regla (p. ej. 09:30–14:00 y 16:00–20:00), atajos **L-V**, **S-D** y **Todos**, y **festivos** (lista común; cada regla vale también en festivos, nunca en festivos o solo en festivos).
- **«PANTALLA EN NEGRO»** como destino de una regla: horario por pantalla, grupo o sede, y no solo por lista.
- **Horario de encendido** con varios tramos y **cerrado en festivos**. «Apagar» se rotula como **negro**: el navegador no puede apagar la tele.
- **Horas y días por cartel** (en su ficha de la tira, ⏰) **y por escena** (pestaña ESCENA), además de las fechas de siempre.
- **Fechas y horas con campos propios**, en el formato de la app (dd/mm/aaaa y 24 h) y no en el del navegador.

**Composiciones**
- **Anuncios entre escenas**: carpetas de anuncios y «uno cada mín–máx escenas», a pantalla completa.
- **Piezas nuevas**: **TURNOS** (número, puesto e historial; parpadea al llamar), **PEDIDOS LISTOS** (preparando / listos, que caducan solos) y **LISTA DE PRECIOS**, escrita a mano (`nombre;precio` por línea) o desde una **hoja de cálculo publicada como CSV** (se refresca sola y, sin red, sigue con la última copia).
- **Modo TÁCTIL** por lista (PRO): los toques no abren los ajustes del display (se abren manteniendo pulsado 3 s); cada pieza puede llevar, **al tocarla**, a una escena; sin tocar, vuelve sola a la primera.
- **Plantillas nuevas**: sala de espera con turnos, pedidos listos, carta con precios y servicios con precios (categoría nueva «Salud y atención»).
- **La cinta y el QR ya no tapan piezas**: en una composición van en su propia franja y la escena se aparta.

**Mando (también en el móvil)**
- **EMERGENCIA** en la cabecera, roja y **con tapa** (primero se levanta la tapa, luego se dispara): textos preparados (evacuación, incendio, confinamiento, cierre) o libre, destino, **sirena** y **voz**. Sale a pantalla completa, **hasta retirarla**, queda **guardada en el repetidor** (la ve también la pantalla que se enciende después) y en cada display. El gestor pasa a modo alarma con **RETIRAR** a la vista.
- **TURNOS**: ◀ ▶, puestos, **LLAMAR SIGUIENTE**, **REPETIR**, campana y **voz** del navegador del display.
- **PEDIDOS LISTOS**: teclado numérico; un toque pasa un número de «preparando» a «listo» (con campana) y otro lo retira.
- Los avisos, la cinta, el negro y la emergencia **se ven también encima del lienzo al componer** (antes no se veían en una composición).

**Interfaz**
- **«+ Nueva» crea una lista vacía**; **Duplicar** es una tecla aparte.
- Los rótulos **nunca se parten a media palabra**: si no caben, se encoge la letra. Los **días encendidos** se ven encendidos.
- **Móvil**: una ventana cada vez con la barra de abajo **LISTAS · LIENZO · AJUSTES · MANDO**, en lugar de una página de miles de píxeles.
- La **URL del kiosco lleva el idioma** de la app (`lang`), que el display guarda: la fecha y los textos salen en ese idioma.
- El **panel del display** y la página del público dicen la versión de la app (antes «v1.4» y «v1.3»).
- **Subir vídeos** (MP4 o WebM, hasta 50 MB) desde «Subir carteles» con el acceso privado; se suben tal cual.
- Copia nueva de la app en el service worker (`adposter-v17`); las imágenes guardadas se conservan.

**Segunda tanda de la v1.23: uso real en el día a día**
- **Emparejar deja la pantalla lista**: con el código viajan también las listas, así que la pantalla enseña lo suyo al momento. Si aún no tiene contenido, dice «Esperando el contenido del gestor…» (nunca «No existe la playlist»). Un código mal tecleado se avisa en segundos. Tras emparejar, el formulario conserva grupo, sede y lista para dar de alta la siguiente igual. La dirección de la pantalla lleva el canal, y sirve de página de inicio aunque se borre la memoria del aparato.
- **✓ ENVIAR CAMBIOS**, aparte de ▶ A PANTALLAS: manda listas, calendario y festivos a todas las pantallas y **cada una sigue con su lista**. El estado ya no dice «Cambios sin publicar» después de enviar: dice **«✓ En pantalla 3/3»** cuando las pantallas confirman que tienen el envío, «Llegando…» mientras tanto, o cuántas no lo han recibido o les faltan imágenes. En el móvil, los dos botones están a la vista en todas las ventanas.
- **A PANTALLAS seguro**: sin destino marcado por defecto, **confirmación** para «Todos», aviso si la orientación de la lista no casa con la de las pantallas, y el botón siempre visible con un resumen («CARTA → grupo menu (3) · ahora»). «Ahora» es un **cambio puntual**: la lista de siempre de cada pantalla no cambia salvo que se marque «Que sea su lista de siempre». La orden queda guardada en el repetidor: la recibe también la pantalla que estaba apagada.
- **Imágenes propias sin tope común**: cada imagen viaja en su propio mensaje y solo se reenvían las que cambian. Al subir se ajustan hasta 1920 px y, si hay que reducirlas, se avisa. Si a una pantalla le falta alguna, el estado lo dice.
- **Emergencia robusta**: si el repetidor está caído la banda dice «NO ENVIADA · reintentando» y sale sola al volver. **Cualquier gestor del canal** la ve y la retira, aunque su reloj vaya atrasado. La banda cuenta en cuántas pantallas está saliendo. Una pantalla que arranca con una emergencia que nadie confirma deja de sonar y lo indica, y el gestor la señala para retirarla. Durante la emergencia, los turnos y los pedidos no suenan. En el móvil apaisado, la tapa y DISPARAR quedan a la vista.
- **Turnos**: un **contador por canal** (dos recepciones nunca repiten números), **Empezar de 0**, REPETIR sin duplicar el historial, la voz dice «Turno A 5» (sin ceros) y la campana no vuelve a sonar al reiniciar la pantalla. Los puestos se renombran también en SIMPLE.
- **El público elige durante 5 minutos**: la pantalla vuelve sola a la lista de su dueño y nunca cambia su lista de siempre. La página del público enseña el nombre de la pantalla.
- **Grupo y sede a la vez** («menu en gracia») en reglas, A PANTALLAS y órdenes; «Ver» una pantalla en el calendario enseña todo lo que le toca.
- **Pantallas a escala**: DISPLAYS en una línea por pantalla (las caídas primero), filtros en chips con iconos (◫ grupo, ⌂ sede, ▭ pantalla) y la ventana **Todas las pantallas**, con la miniatura real de lo que sale, el estado y «visto hace…». Al abrir el gestor se avisa de las pantallas que ya estaban caídas. Si quien pierde la conexión es el propio gestor, no avisa de cada pantalla.
- **Mando en el móvil por QR**: un código lleva cualquier móvil a tus pantallas; se une y trae las listas e imágenes que tienen. El MANDO empieza por LLAMAR SIGUIENTE y pedidos (teclas grandes), y «Cambiar la lista» queda plegado al final, con un segundo toque si afecta a varias pantallas. También se puede unir pegando el enlace o el código.
- **Avisos «hasta las 14:00»** (siguen aunque la pantalla se reinicie) y **cinta «Solo hoy»**, que caduca al acabar el día.
- **QR sin saber de direcciones**: un teléfono se convierte en un enlace de WhatsApp, «@usuario» en Instagram y «midominio.com» se completa; si no es una dirección, se avisa.
- **Editor**: en el móvil, tocar un texto abre un cuadro para escribirlo. Un toque en el asa de una pieza que tapa a otra elige la otra. Las propiedades de la pieza elegida van antes que «Añadir pieza», las piezas nuevas caen en cascada y se avisa si una pieza se sale del lienzo. Los datos de ejemplo (precios, titulares, turnos, el tiempo, QR vacío) llevan la marca EJEMPLO. Una cinta de noticias sin canal no deja una banda negra en la pantalla.
- **Asistente**: el nombre del negocio solo va en el rótulo de marca (ya no pisa «HAPPY» ni «WiFi»). Las zonas con carteles de ejemplo pasan a ser una imagen vacía para la foto propia. Las tiendas empiezan sin carteles ni anuncios de muestra. Hay negocio nuevo, **Panadería o pastelería**. Al terminar, se va al lienzo con un mensaje claro. También está en PRO.
- **Listas de carteles**: subida de **varias imágenes a la vez, con su nombre**; **«A todos»** pone fechas, días y horas a todos los carteles; una imagen propia puede ser **anuncio**; el ciclo empieza por un cartel, no por un anuncio; Tab pasa de «Desde» a «Hasta».
- **Calendario**: una regla nueva nace en **borrador** y no se aplica hasta «Guardar la regla» (al cerrar se avisa de las pendientes). La vista Semana dibuja solo la regla que manda en cada franja, a todo lo ancho, e indica a cuáles tapa. «Ver» es un desplegable. Las fechas aceptan «25122026» sin barras.
- **Horario más simple**: el tramo nuevo copia los días del anterior y empieza después; un tramo sin días se avisa; «A todas las listas» copia el horario.
- **SIMPLE**: se recuerda desde la primera visita. Usa palabras de tienda (Pantallas, Conectar las pantallas, Guardar una copia…) y no muestra guías, Imán, Trama, Participación del público ni anuncios entre escenas. Las listas de ejemplo se esconden cuando hay una propia (tecla «Ejemplos»). La cabecera está más limpia y la tecla de emergencia es más discreta hasta que se usa. En el móvil, las teclas miden al menos 44 px.
- **LED**: modo **1:1 píxel** con desplazamiento X/Y para la tarjeta emisora (`…&px=1&ox=0&oy=0`, en «Añadir pantalla», PRO) y **cabinets rectangulares** (ancho y alto por cabinet).
- **FOTO** al día (v1.23): la copia editada **ocupa el sitio del original** en la lista.
- **Vídeo**: la pieza Vídeo tiene «Subir» con el acceso privado; sin él, se explica claramente por qué no puede viajar (pesa demasiado para el directo sin un sitio donde guardarlo) y cómo usar una dirección https.
- La página de alta de la pantalla cabe entera en 1920×1080. LISTAS cabe en pantallas bajas (960×540). El informe CSV lleva grupo, sede y lista, y una fila «sin datos» por cada pantalla que no responde.

### Siguiente fase (anotado, aún no hecho)
- **Vídeos subidos sin acceso privado**: no hay vía fiable sin un servidor de pago (los repetidores públicos no aguantan archivos de varios MB); se valorará guardarlos en el panel ADMIN o enviarlos de aparato a aparato.
- Anuncios entre escenas hechos con escenas propias.
- **Asistente «Restaurante»** con varias listas y pantallas de una vez; «Hoy cerrado» ya está en la tecla AVISO (v1.37).
- **Pieza «Botón»** con estilo listo y opción «quedarse en la portada hasta que toquen» para kioscos táctiles; «Al tocar» visible aunque el modo táctil esté apagado.
- Pieza **Agenda** que lea un calendario ICS publicado; necesita que el calendario deje leerse desde otra web o un pequeño intermediario.
- **Etiquetas** por pantalla (varias por display) además de grupo y sede.
- **Sincronía de vídeo** entre pantallas y muro de varios monitores con reloj común.
- **Canal de operador** limitado (solo turnos y avisos preparados) para recepción.
- **Tema de marca** aplicado a todas las plantillas; layouts de zonas con una lista dentro de una zona.
- Guardar también los vídeos para uso sin conexión.
- El editor de composiciones muestra la franja que reservan la cinta y el QR (hoy se ve al «Probar» y en el display).

### v1.22
- **Móvil vertical más limpio**, igual que SCREENS y SYSTEMS (pedido por Josep, 23-11-2026): cabecera en una sola fila (isotipo, botón de información, idioma y el logo de AVHUB, que lleva a todas las apps; fuera los logos de las otras apps) y pie en una sola fila («ADPOSTER v1.22», «Aviso legal» y candado). Instalar y avisar de un fallo pasan a la nueva ventana de información, que solo aparece en el móvil.

### v1.21
- **Sin caché** (pedido por Josep, 18-11-2026): las páginas llevan las etiquetas equivalentes a `Cache-Control: no-cache, no-store, must-revalidate` y el service worker pide siempre al servidor lo de la propia app, revalidando, sin pasar por la copia del navegador. Sin conexión sigue funcionando con la copia guardada (los carteles descargados en cada pantalla no cambian: siguen guardados).

### v1.20

Correcciones en el móvil en vertical:

- **Aviso legal:** se abre por el principio (antes salía desplazado hasta abajo).
- **Fila de la familia AVHUB** bajo la cabecera en el móvil (screens, systems, AVHUB, vjshow y msgame), centrada.
- **DISEÑO → EFECTOS:** «Movimiento» ya no se parte a media palabra.
- **TIEMPOS → «Un anuncio cada»** y **DIRECTO → «Aviso a toda pantalla»:** todos los mandos en una sola fila; ya no baja un «+» o un color solo a otra línea.
- **Borrar una lista** pide un segundo toque («¿Seguro?») antes de borrarla.

### v1.19

- **Guía de FOTO** en [`foto/LEEME.md`](foto/LEEME.md): cómo abrir, la pantalla, cada herramienta con su tecla, las pestañas, la IA, sin conexión y los archivos.
- **FOTO en el móvil apaisado:** las herramientas van en tres columnas. Con dos, girar y voltear quedaban por debajo de la pantalla.
- Revisión completa de FOTO (todas las pestañas, herramientas, ajustes, filtros, botones mágicos, IA, PSD y grupos) en TV, ordenador, tableta horizontal y vertical, y móvil vertical y apaisado, en español, inglés y catalán: nada cortado ni fuera de la pantalla.

### v1.18

- **FOTO, tercera tanda:** con IA en el navegador, quitar el fondo (como máscara de capa), borrar un objeto pintándolo, ampliar ×2 o ×4, reparar fotos antiguas (arañazos, motas, grano y color) y colorear; abrir y guardar PSD con capas y grupos; grupos de capas.
- Al deshacer un cambio de tamaño (ampliar, recortar), la imagen se vuelve a encajar en la vista.
- Los botones con textos largos (inglés y catalán) pasan a dos líneas en vez de cortarse.
- Modelos y librerías, todos de licencia libre para uso comercial: U²-Net (Apache-2.0), MI-GAN (MIT), waifu2x (MIT), DeOldify (MIT), onnxruntime-web (MIT) y ag-psd (MIT). El detalle está en `assets/ia/LEEME.md`.

### v1.17


- **FOTO, segunda tanda:** selecciones (rectángulo, elipse, lazo, varita y por color) que limitan ajustes, filtros, magia y pinceles; máscaras de capa; pincel, borrador, tampón de clonar y pincel corrector; texto con los tipos de letra de la marca; formas; degradados y transformar capa, con sus atajos de teclado.
- Las opciones de la herramienta y la pestaña elegida se ven a la vez en el panel de la derecha.
- La aplicación sin conexión guarda también las herramientas nuevas de FOTO.

### v1.16

- **FOTO, el editor de imagen propio (primera tanda):** capas con modos de fusión, historial, recortar y enderezar, girar y voltear, tamaño, ajustes, filtros y seis botones mágicos, con exportación a la medida de cada pantalla y copia en «Mis imágenes». Se abre desde el cartel en grande del gestor («✎ Editar en FOTO») o en `/foto/`.
- El gestor recibe la copia que guarda FOTO aunque esté en otra pestaña.
- La aplicación sin conexión guarda también FOTO y la tira de carteles.

### v1.15

- **Editor de listas de carteles mucho más directo:** debajo de la vista previa sale la tira con todos los carteles de la lista en su orden, con su duración y su estado, y los anuncios al final. Se ordena arrastrando y cada cartel tiene su ficha, sin abrir la biblioteca.
- **Fechas en cada cartel** (desde / hasta): el reproductor solo lo enseña entre esas fechas y rehace la lista a medianoche.
- **Carteles sueltos** de cualquier carpeta o de «Mis imágenes», con «+». El reproductor los suma a los de las carpetas, también en la copia sin conexión.
- **Resumen y avisos:** carteles que salen, duración de una vuelta y lo que no está listo.
- La biblioteca («Esta lista») y el contador de la ventana LISTAS cuentan también los sueltos.

### v1.14

- **Cabecera y pie como en SCREENS** (la regla común de la familia): en la cabecera, las apps alrededor de AVHUB en el centro y, a la derecha, el idioma como botón de icono con su código; en el pie, el crédito en el centro y, a la derecha, **instalar**, la **seta de fallos** y, el último, el candado del acceso privado.
- **Desde el panel AVHUB ADMIN:** dentro del panel (vista ADPOSTER), el gestor se abre ya sobre la web de carteles y **Publicar** y **Subir carteles** los hace el panel, con la llave de Netlify guardada solo en él: el gestor no pide llaves ni las ve. El panel publica en Netlify solo lo nuevo (el resto del sitio se reutiliza por su huella) y rehace el índice con las huellas.
- La variante de prueba de la plantilla de bloques ya no lleva su rótulo en la cabecera.

### v1.13 (beta)

- **Toda la variedad guardada en cada display.** El reproductor (v1.4) descarga una vez todas las imágenes de todas las listas, también desde un origen privado (antes, solo las de su lista y solo si eran de la misma web), y las enseña desde su copia sin volver a pedirlas. Después solo baja las nuevas o cambiadas: el índice `assets/manifest.json` lleva ahora la huella de cada archivo (`huellas`) y cada imagen se pide con ella (`?v=…`).
  - Las imágenes van a una caché propia que no se borra al actualizar la app; cuando ya está todo guardado, se quitan las versiones viejas y lo que ya no sale en ninguna lista.
  - Si la red falla a media descarga, sigue en la siguiente vuelta (cada 5 minutos).
  - El panel del display (OK del mando) dice cuántas imágenes tiene guardadas.
  - Las imágenes de otra web se guardan con CORS (la cabecera `Access-Control-Allow-Origin` que ya pide el origen privado).
- **Previa local:** si el gestor lo sirve la herramienta `previa.py` del ordenador, lee las carpetas y listas de la carpeta de la previa y el botón pasa a **Guardar en este ordenador**, que guarda `playlists.json` allí (con copia de la anterior).
- `tools/preparar.py` escribe también las huellas en el índice de las muestras.

### v1.12 (beta)

- Logo nuevo de MSGAME en la barra de apps: «MS» en dos fichas moradas con la misma letra que GAME y sombra verde.

### v1.11 (beta)

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

- Adaptar sola una composición al cambiar de vertical a horizontal.
- Conexión con nubes y discos del usuario.
- Repetidor propio para el directo.

## Licencia

[GPL-3.0](LICENSE)

---

*ADPOSTER v1.46 2026 es un proyecto hecho con ⚙ by [mediaservi.com](https://mediaservi.com)*

## Aviso

Software gratuito y de código abierto, hecho con pasión por un aficionado en su tiempo libre. No es un producto profesional. Se ofrece «tal cual», sin garantías de ningún tipo; los resultados son orientativos y hay que comprobarlos siempre; se usa bajo la responsabilidad de cada cual, hasta donde lo permita la ley aplicable. El aviso completo (es/en/ca) está en la propia app, en el enlace «Aviso legal» que acompaña a la línea de crédito. Licencia GPL-3.0.

Documentos legales del repositorio: [`LEGAL.md`](LEGAL.md) (aviso legal), [`DISCLAIMER.md`](DISCLAIMER.md) (garantías y responsabilidad), [`PRIVACY.md`](PRIVACY.md) (privacidad), [`COOKIES.md`](COOKIES.md) (cookies y almacenamiento local) y [`LICENSE`](LICENSE) (GPL-3.0). Sin publicidad, afiliación ni ingresos de ningún tipo.
