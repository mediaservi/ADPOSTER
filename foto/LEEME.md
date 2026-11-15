# FOTO · el editor de imagen de ADPOSTER

FOTO es un editor de fotos con capas que funciona en el navegador, sin instalar nada. **La imagen no sale de tu equipo:** todo, también la IA, se hace en tu ordenador, tableta o móvil.

- **Dónde:** `adposter.mediaservi.com/foto/`, o desde el gestor de ADPOSTER: al ver un cartel en grande, «✎ Editar en FOTO».
- **Idiomas:** español, inglés y catalán (según el idioma del navegador).
- **El original nunca se toca.** Lo que haces se exporta como archivo nuevo o se guarda en ADPOSTER como copia `…-editada`.

## 1. Abrir una imagen

- **Suéltala** encima del lienzo, **pégala** (Ctrl+V) o pulsa **Abrir**.
- Formatos: JPG, PNG, WebP, AVIF, GIF, BMP y **PSD** (con sus capas, máscaras, opacidades, fusiones y grupos).
- **Imagen como capa:** abre otra imagen (o un PSD) encima de lo que ya tienes.

## 2. La pantalla

| Zona | Qué hay |
|---|---|
| Izquierda | Las herramientas (cada una con su tecla). |
| Centro | El lienzo, con la barra de zoom encima. |
| Derecha | Las opciones de la herramienta elegida y cinco pestañas: **CAPAS**, **AJUSTES**, **MAGIA**, **EXPORTAR** e **HISTORIAL**. |

En el móvil en vertical, el lienzo va arriba, las herramientas en una fila debajo y los paneles al final. En horizontal, cada cosa en su columna.

**Moverse por la imagen:** rueda o pellizco para el zoom, la herramienta Mano (H) o la barra espaciadora mantenida para desplazarte. Ctrl+0 la encaja en pantalla; Ctrl++ y Ctrl+− acercan y alejan.

## 3. Herramientas

| Tecla | Herramienta | Para qué |
|---|---|---|
| H | Mano | Desplazar la vista. |
| V | Mover | Mover la capa elegida. |
| C | Recortar | Recorte con proporciones (libre, original, 9:16, 16:9, 2:3, 3:2, 1:1, 4:5) y enderezar. Intro aplica, Esc cancela. |
| M | Marco | Selección rectangular o elíptica. |
| L | Lazo | Selección a mano alzada. |
| W | Varita | Selecciona por color, con tolerancia, contigua o en toda la imagen. |
| B / E | Pincel y borrador | Tamaño, dureza y opacidad. `[` y `]` cambian el tamaño. |
| S | Tampón de clonar | Copia de un sitio a otro. El origen se marca con Alt + clic. |
| J | Pincel corrector | Como el tampón, pero adapta el color al sitio donde pintas. |
| T | Texto | Capas de texto que se siguen pudiendo editar: los 19 tipos de letra de la marca, tamaño, grosor, interlineado, alineación, color, contorno y sombra. |
| U | Formas | Rectángulo, rectángulo redondeado, elipse, línea y flecha, con relleno y borde. |
| G | Degradado | Lineal o radial, de un color a otro o a transparente. |
| Q | Transformar | Mover, escalar desde las esquinas (con Mayús, sin mantener la proporción) y girar. Intro aplica, Esc cancela. También con Ctrl+T. |
| O | Borrar objeto | Con IA: pinta encima de lo que sobra y pulsa «Borrar lo pintado». |

**Selecciones:** nueva, añadir (Mayús), restar (Alt) o cruzar, con borde suave. Ctrl+A selecciona todo, Ctrl+D quita la selección y Ctrl+Mayús+I la invierte. Supr vacía lo seleccionado y Ctrl+J lo pasa a una capa nueva. **Lo seleccionado limita** los ajustes, los filtros, los botones mágicos y los pinceles.

## 4. Pestañas

**CAPAS**
- Capa nueva, imagen como capa, duplicar, borrar, subir, bajar, combinar con la de abajo y acoplar todo.
- Cada capa tiene su ojo, su opacidad y uno de 16 modos de fusión.
- **Máscara de capa:** se añade (desde la selección, si la hay) y se pinta con el pincel o el borrador; luego se aplica o se quita.
- **Grupos:** «Agrupar con la de abajo» junta capas en una carpeta con su propio ojo, opacidad y fusión. La carpeta se abre y se cierra, y «Desagrupar» la deshace.

**AJUSTES**
- Brillo y contraste (con exposición y gamma), niveles, curvas, tono y saturación (con vividez), equilibrio de color, y blanco y negro con virado.
- Filtros: desenfocar, enfocar, ruido y viñeta.
- Todo con vista previa en vivo.

**MAGIA**
- **Botones de un toque**, cada uno con su intensidad: mejora automática, vividez, balance de blancos, quitar neblina, quitar ruido y enfocar.
- **Con IA**, en el navegador:
  - **Quitar el fondo:** lo oculta con una máscara de capa, que puedes retocar pintando. El control «Borde» lo hace más suave o más duro.
  - **Borrar un objeto** (herramienta O).
  - **Ampliar ×2 o ×4** sin perder detalle: todas las capas a la vez, hasta 8192 px de lado.
  - **Reparar foto antigua:** quita arañazos y motas, el grano y el color desvaído, cada cosa con su control. Si un arañazo cruza un texto, ese trozo de texto también puede irse: entonces baja «Arañazos».
  - **Colorear** fotos en blanco y negro, con su intensidad.

**EXPORTAR**
- Formatos: WebP, JPG, PNG (con transparencia) o **PSD (con capas)**.
- Medidas: la original o la de cada pantalla (FHD vertical u horizontal, póster 2:3, cuadrada, 4K), llenando la pantalla o con la imagen entera.
- **Guardar copia en ADPOSTER** la deja en «Mis imágenes» del gestor (aunque esté abierto en otra pestaña).

**HISTORIAL**
- Todos los pasos, para volver a cualquiera.
- Ctrl+Z deshace; Ctrl+Y o Ctrl+Mayús+Z rehacen.

## 5. La IA: qué conviene saber

- Cada modelo **se descarga solo la primera vez** que lo usas (de 4 a 64 MB) y queda guardado en el navegador. Las siguientes veces va al momento, incluso sin conexión.
- Va con **WebGPU** si el navegador lo tiene (Chrome o Edge recientes) y, si no, con el procesador. Sin WebGPU, ampliar ×4 una foto grande puede tardar unos minutos: FOTO lo avisa y muestra el avance.
- Todo lo que hace la IA queda en el historial, así que se puede deshacer.
- Los modelos y sus licencias (todas libres: MIT o Apache-2.0) están en [`assets/ia/LEEME.md`](../assets/ia/LEEME.md).

## 6. Sin conexión

Instalada como aplicación (o tras abrirla una vez), FOTO funciona sin internet, con todas sus herramientas. La IA también, una vez descargado cada modelo.

## 7. Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La página de FOTO. |
| `foto.js` | Capas, grupos, historial, paneles, abrir y exportar. |
| `herr.js` | Herramientas de selección, pinceles, texto, formas, degradado y transformar. |
| `px.js` | Ajustes, filtros y botones mágicos. |
| `ia.js` | La IA (fondo, borrar, ampliar, reparar y colorear) y los PSD. |
| `foto.css` | El aspecto, en el estilo RACK DIGITAL de AVHUB. |
| `ort/` | onnxruntime-web 1.31.1 (MIT), el motor que ejecuta los modelos. |
| `ag-psd.js` | ag-psd 34.2.0 (MIT), para leer y escribir PSD. Su licencia está en `ag-psd-LICENSE.txt`. |

FOTO forma parte de ADPOSTER (GPL-3.0) · mediaservi.com
