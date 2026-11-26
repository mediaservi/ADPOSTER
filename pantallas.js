/* ADPOSTER · pantallas y mando (v1.23). Se apoya en el gestor (window.ADG) y en las ventanas flotantes del editor.
   Lo nuevo de la v1.23, sin cuentas ni servidor:
   · SIMPLE / PRO: el mismo conmutador que SCREENS y SYSTEMS. SIMPLE esconde lo técnico y ofrece el ASISTENTE por tipo de negocio.
   · AÑADIR PANTALLA: nombre, grupo, sede, lista, giro e idioma → la URL del kiosco con su QR; o, sin teclear nada en la tele, un CÓDIGO de 6
     caracteres que enseña el display abierto en …/p/?alta (el gestor le manda la configuración por el repetidor).
   · A PANTALLAS: un solo botón para ahora, durante N minutos o desde una fecha, a todas, a un grupo, a una sede o a una pantalla.
     Sin servidor de pago: las listas viajan por el directo (mensaje retenido «datos» en el repetidor) y el display las usa al momento;
     playlists.json sigue siendo la copia permanente (y se publica a la vez si hay acceso privado, panel ADMIN o previa local).
   · EMERGENCIA con tapa: pantalla completa, hasta retirarla, retenida en el repetidor (la ve también la pantalla que se enciende después) y con sonido.
   · MANDO de TURNOS (número, puesto, historial, campana y voz) y de PEDIDOS LISTOS (preparando / listos, con caducidad), desde el móvil.
   · Formato A MEDIDA para LED (ancho × alto o cabinets), aviso de desconexión con notificación del navegador e informe de emisión en CSV.
   · Móvil: una barra abajo (LISTAS · LIENZO · AJUSTES · MANDO) en lugar de una página de miles de píxeles.
   · ✓ ENVIAR CAMBIOS (cada pantalla sigue con su lista) y «✓ En pantalla 3/3» cuando las pantallas confirman que lo tienen; emparejar manda ya las listas;
     MANDO EN EL MÓVIL por QR (une el móvil a las pantallas y trae sus listas); ventana con TODAS LAS PANTALLAS; turnos compartidos por canal.
   Licencia GPL-3.0 · mediaservi.com */
(() => {
  'use strict';
  const G = window.ADG; if (!G || !G.ext.abreModal) return;
  const { T, TX, $, esc, tecla, campo, lim, copia } = G, X = G.ext, ACC = G.ACC, html = document.documentElement;
  Object.assign(TX, { 'Sale en el rótulo de marca y bajo el QR.': ['It goes on the brand sign and under the QR.', 'Surt al rètol de marca i sota el QR.'] });
  Object.assign(TX, { 'Editar': ['Edit', 'Edita'], 'Avisos': ['Alerts', 'Avisos'] });
  Object.assign(TX, { 'Ámbar': ['Amber', 'Ambre'], 'Rojo': ['Red', 'Vermell'], 'Verde': ['Green', 'Verd'], 'Azul': ['Blue', 'Blau'], 'Aviso': ['Notice', 'Avís'], 'Mandar un aviso a las pantallas': ['Send a notice to the screens', 'Envia un avís a les pantalles'], 'Cuánto dura': ['How long', 'Quant dura'], 'Color': ['Colour', 'Color'], 'Enviar aviso': ['Send notice', 'Envia l’avís'], 'Aviso enviado': ['Notice sent', 'Avís enviat'],
    'Sale encima de lo que esté saliendo en todas las pantallas y luego desaparece solo.': ['It shows on top of whatever is playing on every screen and then goes away by itself.', 'Surt a sobre del que estigui sortint a totes les pantalles i després desapareix sol.'],
    'Cerramos antes hoy': ['Closing early today', 'Avui tanquem abans'], 'Hoy cerramos antes. ¡Gracias por su visita!': ['We close early today. Thanks for your visit!', 'Avui tanquem abans. Gràcies per la visita!'],
    'Volvemos enseguida': ['Back soon', 'Tornem de seguida'], 'Volvemos en 10 minutos.': ['Back in 10 minutes.', 'Tornem en 10 minuts.'],
    'Oferta del día': ['Deal of the day', 'Oferta del dia'], 'Oferta del día: pregunte en el mostrador.': ['Deal of the day: ask at the counter.', 'Oferta del dia: pregunteu al taulell.'],
    'Hoy cerrado': ['Closed today', 'Avui tancat'], 'Hoy permanecemos cerrados. Disculpen las molestias.': ['We are closed today. Sorry for the inconvenience.', 'Avui romanem tancats. Disculpeu les molèsties.'] });
  Object.assign(TX, { 'En la tele': ['On the TV', 'A la tele'], 'Cómo se llama y qué enseña': ['Its name and what it shows', 'Com es diu i què ensenya'], 'Más opciones': ['More options', 'Més opcions'], 'grupo, sede, giro, idioma': ['group, site, tags, rotation, language', 'grup, seu, etiquetes, gir, idioma'], 'etiquetas, separadas por comas (p. ej. barra, terraza)': ['tags, comma-separated (e.g. bar, terrace)', 'etiquetes, separades per comes (p. ex. barra, terrassa)'], 'Escribe el código de la tele': ['Type the code shown on the TV', 'Escriu el codi de la tele'] });
  Object.assign(TX, { 'Poner otra lista un rato o desde una fecha': ['Show another list for a while or from a date', 'Posa una altra llista una estona o des d’una data'], 'Siguiente': ['Next', 'Següent'], 'código': ['code', 'codi'], 'Lista creada: toca un texto del lienzo para cambiarlo y, cuando esté, «✓ Publicar».': ['List created: tap a text on the canvas to change it and, when ready, “✓ Publish”.', 'Llista creada: toca un text del llenç per canviar-lo i, quan estigui, «✓ Publica».'],
    'Pon otra lista en algunas pantallas: ahora, un rato o desde una fecha.': ['Put another list on some screens: now, for a while or from a date.', 'Posa una altra llista en algunes pantalles: ara, una estona o des d’una data.'],
    'Si no lo marcas, es solo por un rato: luego cada pantalla vuelve a su lista.': ['If unticked, it’s only for a while: each screen then goes back to its list.', 'Si no ho marques, és només una estona: després cada pantalla torna a la seva llista.'],
    'En la tele, abre el navegador (o la app Kiosk del stick) y entra en {u}. Saldrá un código de 6 caracteres: escríbelo aquí y la pantalla se configura sola.': ['On the TV, open the browser (or the stick’s Kiosk app) and go to {u}. A 6-character code appears: type it here and the screen sets itself up.', 'A la tele, obre el navegador (o l’app Kiosk de l’stick) i entra a {u}. Sortirà un codi de 6 caràcters: escriu-lo aquí i la pantalla es configura sola.'] });
  Object.assign(TX, {
    'Crea una lista vacía con este nombre': ['Creates an empty list with this name', 'Crea una llista buida amb aquest nom'], 'Copia la lista elegida': ['Copies the selected list', 'Copia la llista triada'], 'Duplicar': ['Duplicate', 'Duplica'], 'Asistente': ['Wizard', 'Assistent'],
    'A medida': ['Custom', 'A mida'], 'Lienzo a medida para pantallas LED': ['Custom canvas for LED screens', 'Llenç a mida per a pantalles LED'], 'Anuncios entre escenas': ['Ads between scenes', 'Anuncis entre escenes'], 'No hay carpetas de anuncios (las que empiezan por «ads-»).': ['There are no ad folders (those starting with “ads-”).', 'No hi ha carpetes d’anuncis (les que comencen per «ads-»).'],
    'Un anuncio a pantalla completa cada tantas escenas (al azar entre mínimo y máximo).': ['One full-screen ad every so many scenes (random between minimum and maximum).', 'Un anunci a pantalla completa cada tantes escenes (a l’atzar entre mínim i màxim).'], 'Modo táctil': ['Touch mode', 'Mode tàctil'], 'Pantalla táctil': ['Touch screen', 'Pantalla tàctil'], 'vuelta': ['return', 'tornada'],
    'Los toques no abren los ajustes del display (mantén pulsado 3 s en una esquina). En cada pieza, «Al tocar» lleva a una escena; sin tocar, vuelve sola a la primera.': ['Taps do not open the display settings (hold 3 s on a corner). On each piece, “On tap” goes to a scene; untouched, it returns to the first one.', 'Els tocs no obren els ajustos del display (mantén premut 3 s en una cantonada). A cada peça, «En tocar» porta a una escena; sense tocar, torna sola a la primera.'],
    'Para kioscos táctiles: botones que llevan a escenas y vuelven solos.': ['For touch kiosks: buttons that lead to scenes and come back on their own.', 'Per a quioscos tàctils: botons que porten a escenes i tornen sols.'], 'Cerrado en festivos': ['Closed on holidays', 'Tancat els festius'], 'desde': ['from', 'des de'], 'hasta': ['until', 'fins a'], 'L-V': ['M-F', 'Dl-Dv'], 'S-D': ['Sa-Su', 'Ds-Dg'], 'Tramo': ['Time slot', 'Tram'],
    'Fuera de estos tramos la pantalla queda en negro (el navegador no puede apagar la tele: usa su temporizador para ahorrar).': ['Outside these slots the screen goes black (a browser cannot switch the TV off: use its timer to save power).', 'Fora d’aquests trams la pantalla queda en negre (el navegador no pot apagar la tele: fes servir el seu temporitzador per estalviar).'],
    'Durante… / desde…': ['For… / from…', 'Durant… / des de…'], 'La pantalla queda en negro': ['The screen goes black', 'La pantalla queda en negre'], 'negro': ['black', 'negre'], 'A pantallas': ['To screens', 'A pantalles'], 'Pantallas': ['Screens', 'Pantalles'], 'Añadir pantalla': ['Add screen', 'Afegeix una pantalla'],
    'Un solo botón: ahora, durante unos minutos o desde una fecha, en todas las pantallas, un grupo o una sola. Con el directo, los cambios llegan al momento sin subir archivos.': ['One button: now, for a few minutes or from a date, on every screen, a group or just one. With live control, changes arrive instantly with no file upload.', 'Un sol botó: ara, durant uns minuts o des d’una data, a totes les pantalles, un grup o una sola. Amb el directe, els canvis arriben a l’instant sense pujar arxius.'],
    'dd/mm/aaaa': ['dd/mm/yyyy', 'dd/mm/aaaa'], 'nunca': ['never', 'mai'], 'hace': ['', 'fa'], 'Avisar si una pantalla se desconecta': ['Warn me if a screen disconnects', 'Avisa’m si una pantalla es desconnecta'], 'EMERGENCIA': ['EMERGENCY', 'EMERGÈNCIA'], 'Emergencia': ['Emergency', 'Emergència'], 'Informe CSV': ['CSV report', 'Informe CSV'], 'Pantalla desconectada': ['Screen disconnected', 'Pantalla desconnectada'],
    'Biblioteca': ['Library', 'Biblioteca'], 'Calendario': ['Calendar', 'Calendari'],
    /* SIMPLE / PRO y navegación del móvil */
    'Modo SIMPLE o PRO': ['SIMPLE or PRO mode', 'Mode SIMPLE o PRO'], 'Lienzo': ['Canvas', 'Llenç'], 'Ajustes': ['Settings', 'Ajustos'], 'Mando': ['Remote', 'Comandament'],
    /* emergencia */
    'Evacuación': ['Evacuation', 'Evacuació'], 'Incendio': ['Fire', 'Incendi'], 'Confinamiento': ['Lockdown', 'Confinament'], 'Cierre del local': ['Closing the premises', 'Tancament del local'], 'Texto libre': ['Free text', 'Text lliure'],
    'EVACUACIÓN: salgan con calma por la salida más cercana y sigan las indicaciones del personal.': ['EVACUATION: leave calmly by the nearest exit and follow staff instructions.', 'EVACUACIÓ: surtin amb calma per la sortida més propera i segueixin les indicacions del personal.'],
    'INCENDIO: no usen los ascensores. Salgan por la escalera de emergencia.': ['FIRE: do not use the lifts. Leave by the emergency stairs.', 'INCENDI: no facin servir els ascensors. Surtin per l’escala d’emergència.'],
    'CONFINAMIENTO: permanezcan dentro, lejos de puertas y ventanas, hasta nuevo aviso.': ['LOCKDOWN: stay inside, away from doors and windows, until further notice.', 'CONFINAMENT: quedin-se a dins, lluny de portes i finestres, fins a nou avís.'],
    'Cerramos en unos minutos. Gracias por su visita.': ['We are closing in a few minutes. Thank you for your visit.', 'Tanquem d’aquí a uns minuts. Gràcies per la visita.'],
    'Sonido': ['Sound', 'So'], 'Voz': ['Voice', 'Veu'], 'Levantar la tapa': ['Lift the cover', 'Aixeca la tapa'], 'DISPARAR': ['FIRE ALERT', 'DISPARA'], 'Retirar': ['Withdraw', 'Retira'], 'EMERGENCIA EN CURSO': ['EMERGENCY IN PROGRESS', 'EMERGÈNCIA EN CURS'],
    'Sale a pantalla completa en todas las pantallas del destino, con sonido, y se queda hasta que la retires. Queda guardada en el repetidor: la ve también la pantalla que se enciende después.': ['It goes full screen on every target screen, with sound, and stays until you withdraw it. It is kept on the relay: a screen switched on later sees it too.', 'Surt a pantalla completa a totes les pantalles del destí, amb so, i s’hi queda fins que la retiris. Queda desada al repetidor: també la veu la pantalla que s’encén després.'],
    'Los repetidores son públicos y sin garantía: esto no sustituye a la alarma oficial del edificio.': ['Relays are public and carry no guarantee: this does not replace the building’s official alarm.', 'Els repetidors són públics i sense garantia: això no substitueix l’alarma oficial de l’edifici.'],
    'Sin directo: la emergencia solo se ve en el lienzo. Activa el directo para mandarla a las pantallas.': ['No live control: the emergency is only shown on the canvas. Turn live control on to send it to the screens.', 'Sense directe: l’emergència només es veu al llenç. Activa el directe per enviar-la a les pantalles.'], 'Emergencia retirada': ['Emergency withdrawn', 'Emergència retirada'],
    /* a pantallas */
    'Qué': ['What', 'Què'], 'Dónde': ['Where', 'On'], 'Cuándo': ['When', 'Quan'], 'Ahora': ['Now', 'Ara'], 'Durante': ['For', 'Durant'], 'Desde': ['From', 'Des de'], 'Todos': ['All', 'Tots'], 'min': ['min', 'min'],
    'Las listas viajan por el directo al momento (sin subir archivos) y quedan guardadas en el repetidor. playlists.json sigue siendo la copia permanente: publícala también cuando puedas.': ['Lists travel instantly over live control (no file upload) and are kept on the relay. playlists.json is still the permanent copy: publish it too when you can.', 'Les llistes viatgen pel directe a l’instant (sense pujar arxius) i queden desades al repetidor. playlists.json continua sent la còpia permanent: publica-la també quan puguis.'],
    'Sin directo, las pantallas solo cambian al publicar playlists.json. Activa el directo y llegará todo al momento.': ['Without live control, screens only change when playlists.json is published. Turn live control on and everything arrives instantly.', 'Sense directe, les pantalles només canvien en publicar playlists.json. Activa el directe i arribarà tot a l’instant.'],
    'Enviado': ['Sent', 'Enviat'], 'Programado': ['Scheduled', 'Programat'], 'Las listas son demasiado grandes para el directo: publica playlists.json.': ['The lists are too large for live control: publish playlists.json.', 'Les llistes són massa grans per al directe: publica playlists.json.'], 'Activar el directo': ['Turn live control on', 'Activa el directe'], 'hora': ['time', 'hora'],
    /* añadir pantalla */
    'Nombre de la pantalla': ['Screen name', 'Nom de la pantalla'], 'grupo (p. ej. menu)': ['group (e.g. menu)', 'grup (p. ex. menu)'], 'sede (p. ej. centro)': ['site (e.g. centre)', 'seu (p. ex. centre)'], 'Lista': ['List', 'Llista'], 'Giro': ['Rotation', 'Gir'], 'Idioma': ['Language', 'Idioma'],
    'Abre esta dirección en la pantalla (o escanea el QR con el aparato) y ponla como página de inicio del kiosco.': ['Open this address on the screen (or scan the QR with the device) and set it as the kiosk start page.', 'Obre aquesta adreça a la pantalla (o escaneja el QR amb l’aparell) i posa-la com a pàgina d’inici del quiosc.'],
    'Con código, sin teclear la dirección': ['With a code, no typing', 'Amb codi, sense teclejar l’adreça'], 'código de la pantalla': ['screen code', 'codi de la pantalla'], 'Emparejar': ['Pair', 'Aparella'],
    'En la tele, abre el navegador (o la app Kiosk del stick) y entra en {u}. Saldrá un código de 6 caracteres: escríbelo aquí y la pantalla se configura sola.': ['On the TV, open the browser (or the stick’s Kiosk app) and go to {u}. A 6-character code appears: type it here and the screen sets itself up.', 'A la tele, obre el navegador (o l’app Kiosk de l’stick) i entra a {u}. Sortirà un codi de 6 caràcters: escriu-lo aquí i la pantalla es configura sola.'],
    'Esperando a la pantalla…': ['Waiting for the screen…', 'Esperant la pantalla…'], 'Pantalla emparejada': ['Screen paired', 'Pantalla aparellada'], 'La pantalla no responde: comprueba el código y que esté abierta en …/p/?alta.': ['The screen does not answer: check the code and that it is open on …/p/?alta.', 'La pantalla no respon: comprova el codi i que estigui oberta a …/p/?alta.'], 'El código tiene 6 letras o números.': ['The code has 6 letters or digits.', 'El codi té 6 lletres o números.'],
    /* asistente */
    '¿Qué negocio tienes?': ['What kind of business?', 'Quin negoci tens?'], 'Cafetería o bar': ['Café or bar', 'Cafeteria o bar'], 'Comida rápida': ['Fast food', 'Menjar ràpid'], 'Tienda': ['Shop', 'Botiga'], 'Peluquería o estética': ['Hair or beauty salon', 'Perruqueria o estètica'], 'Clínica o sala de espera': ['Clinic or waiting room', 'Clínica o sala d’espera'], 'Oficina': ['Office', 'Oficina'], 'Concesionario o LED': ['Car dealer or LED', 'Concessionari o LED'],
    '¿Cómo es la pantalla?': ['What is the screen like?', 'Com és la pantalla?'], 'Nombre del negocio': ['Business name', 'Nom del negoci'], 'Crear': ['Create', 'Crea'], 'Atrás': ['Back', 'Enrere'], 'Se crearán': ['This will create', 'Es crearan'], 'regla del calendario': ['calendar rule', 'regla del calendari'],
    'Listo. Ahora añade tus textos y fotos tocando las piezas, y conecta la pantalla con «Añadir pantalla».': ['Done. Now add your texts and photos by tapping the pieces, and connect the screen with “Add screen”.', 'Fet. Ara afegeix els teus textos i fotos tocant les peces, i connecta la pantalla amb «Afegeix una pantalla».'], 'LED a medida': ['Custom LED', 'LED a mida'],
    'Tres pasos: el negocio, la pantalla y crear. Después se cambia todo tocando las piezas.': ['Three steps: business, screen and create. Then you change anything by tapping the pieces.', 'Tres passos: el negoci, la pantalla i crear. Després es canvia tot tocant les peces.'],
    /* turnos y pedidos */
    'Turnos': ['Queue numbers', 'Torns'], 'Llamar siguiente': ['Call next', 'Crida el següent'], 'Repetir': ['Repeat', 'Repeteix'], 'serie': ['series', 'sèrie'], 'puestos, separados por comas': ['desks, comma separated', 'llocs, separats per comes'], 'Pedidos listos': ['Orders ready', 'Comandes a punt'], 'Preparando': ['Preparing', 'Preparant'], 'Listo': ['Ready', 'A punt'], 'Limpiar': ['Clear', 'Neteja'],
    'Toca un número de «Preparando» para pasarlo a «Listo», y uno de «Listo» para retirarlo. Los listos se van solos a los {n} min.': ['Tap a “Preparing” number to move it to “Ready”, and a “Ready” one to remove it. Ready numbers leave on their own after {n} min.', 'Toca un número de «Preparant» per passar-lo a «A punt», i un d’«A punt» per retirar-lo. Els que estan a punt marxen sols als {n} min.'],
    'Sin directo: el turno solo se ve en el lienzo.': ['No live control: the number only shows on the canvas.', 'Sense directe: el torn només es veu al llenç.'],
    /* formato a medida */
    'Formato a medida': ['Custom format', 'Format a mida'], 'ancho': ['width', 'amplada'], 'alto': ['height', 'alçada'], 'Cabinets': ['Cabinets', 'Cabinets'], 'columnas': ['columns', 'columnes'], 'filas': ['rows', 'files'], 'px por cabinet': ['px per cabinet', 'px per cabinet'], 'Aplicar': ['Apply', 'Aplica'], 'Quitar': ['Remove', 'Treu'],
    'Para pantallas LED: el lienzo toma la resolución exacta del controlador (sin franjas negras). Las piezas se recolocan en proporción.': ['For LED screens: the canvas takes the controller’s exact resolution (no black bars). Pieces are repositioned in proportion.', 'Per a pantalles LED: el llenç pren la resolució exacta del controlador (sense franges negres). Les peces es recol·loquen en proporció.'],
    /* avisos e informe */
    'Avisos de desconexión activados': ['Disconnection alerts on', 'Avisos de desconnexió activats'], 'Avisos de desconexión desactivados': ['Disconnection alerts off', 'Avisos de desconnexió desactivats'], 'Pidiendo el informe a las pantallas…': ['Asking the screens for the report…', 'Demanant l’informe a les pantalles…'], 'Ninguna pantalla ha respondido.': ['No screen answered.', 'Cap pantalla no ha respost.'], 'Informe de {n} pantallas descargado': ['Report from {n} screens downloaded', 'Informe de {n} pantalles descarregat']
  });
  Object.assign(TX, {
    /* v1.23 · envío de cambios, A PANTALLAS seguro, mando enlazado, emergencia, turnos y pantallas */
    'Enviar cambios': ['Send changes', 'Envia els canvis'], 'Manda tus cambios a todas las pantallas; cada una sigue con su lista.': ['Sends your changes to every screen; each keeps its own list.', 'Envia els canvis a totes les pantalles; cadascuna continua amb la seva llista.'],
    'Primero conecta una pantalla con «+ Añadir pantalla».': ['First connect a screen with “+ Add screen”.', 'Primer connecta una pantalla amb «+ Afegeix una pantalla».'], 'Sin conexión: se enviará al volver.': ['Offline: it will be sent when back.', 'Sense connexió: s’enviarà en tornar.'],
    'Elige a qué pantallas.': ['Choose which screens.', 'Tria a quines pantalles.'], 'Que sea su lista de siempre': ['Make it their usual list', 'Que sigui la seva llista de sempre'], '¿Seguro? Cambiar las {n} pantallas': ['Sure? Change all {n} screens', 'Segur? Canviar les {n} pantalles'],
    '{n} pantallas son verticales y la lista es horizontal.': ['{n} screens are portrait and the list is landscape.', '{n} pantalles són verticals i la llista és horitzontal.'], '{n} pantallas son horizontales y la lista es vertical.': ['{n} screens are landscape and the list is portrait.', '{n} pantalles són horitzontals i la llista és vertical.'],
    'Si no lo marcas, es solo por un rato: luego cada pantalla vuelve a su lista.': ['If unticked, it’s only for a while: each screen then goes back to its list.', 'Si no ho marques, és només una estona: després cada pantalla torna a la seva llista.'],
    'Las imágenes no caben: quita alguna o usa fotos más ligeras.': ['The images do not fit: remove some or use lighter photos.', 'Les imatges no hi caben: treu-ne alguna o fes servir fotos més lleugeres.'],
    'Pantalla encontrada: emparejando…': ['Screen found: pairing…', 'Pantalla trobada: aparellant…'], 'No encuentro una pantalla con ese código: revisa las 6 letras y que la pantalla tenga internet.': ['No screen with that code: check the 6 characters and that the screen is online.', 'No trobo cap pantalla amb aquest codi: revisa els 6 caràcters i que la pantalla tingui internet.'],
    'Listo: puedes añadir otra igual (mismo grupo, sede y lista).': ['Done: you can add another one alike (same group, site and list).', 'Fet: pots afegir-ne una altra d’igual (mateix grup, seu i llista).'], '1:1 píxel (LED)': ['1:1 pixel (LED)', '1:1 píxel (LED)'], 'desplazamiento': ['offset', 'desplaçament'],
    'NO ENVIADA · reintentando': ['NOT SENT · retrying', 'NO ENVIADA · reintentant'], 'en {n}/{m} pantallas': ['on {n}/{m} screens', 'a {n}/{m} pantalles'], 'Una pantalla muestra una emergencia antigua': ['A screen is showing an old emergency', 'Una pantalla mostra una emergència antiga'], 'Turnos en silencio durante la emergencia': ['Queue calls muted during the emergency', 'Torns en silenci durant l’emergència'],
    'Empezar de 0': ['Start from 0', 'Comença de 0'], '¿Seguro? A cero': ['Sure? Reset', 'Segur? A zero'], 'Turnos a cero': ['Queue reset', 'Torns a zero'],
    'Mando en el móvil': ['Remote on your phone', 'Comandament al mòbil'], 'Escanea este código con el móvil: se abre el mando unido a tus pantallas, con tus listas, turnos, pedidos y avisos.': ['Scan this code with your phone: it opens the remote linked to your screens, with your lists, queue, orders and alerts.', 'Escaneja aquest codi amb el mòbil: s’obre el comandament unit a les teves pantalles, amb les llistes, torns, comandes i avisos.'],
    'Quien tenga este código puede mandar a tus pantallas: compártelo solo con tu equipo.': ['Whoever has this code can control your screens: share it with your team only.', 'Qui tingui aquest codi pot manar a les teves pantalles: comparteix-lo només amb el teu equip.'],
    'Unir este aparato a mis pantallas': ['Join this device to my screens', 'Uneix aquest aparell a les meves pantalles'], 'Este aparato se unirá a tus pantallas y traerá las listas que tienen ahora (las de este aparato se sustituyen).': ['This device will join your screens and bring the lists they have now (this device’s lists are replaced).', 'Aquest aparell s’unirà a les teves pantalles i portarà les llistes que tenen ara (les d’aquest aparell se substitueixen).'],
    'Pega aquí el enlace del mando o el código del canal': ['Paste the remote link or the channel code here', 'Enganxa aquí l’enllaç del comandament o el codi del canal'], 'Ese enlace o código no vale.': ['That link or code is not valid.', 'Aquest enllaç o codi no val.'], 'Listas traídas de tus pantallas': ['Lists brought from your screens', 'Llistes portades de les pantalles'],
    'Todas las pantallas': ['All screens', 'Totes les pantalles'], 'sin datos': ['no data', 'sense dades'], 'px ancho': ['px wide', 'px ample'], 'px alto': ['px high', 'px alt'],
    'Panadería o pastelería': ['Bakery or pastry shop', 'Forn o pastisseria'], 'PAN DEL DÍA': ['BREAD OF THE DAY', 'PA DEL DIA'],
    'Toca un texto del lienzo para escribir el tuyo.': ['Tap a text on the canvas to type yours.', 'Toca un text del llenç per escriure el teu.'], 'Creadas {n} listas: toca un texto del lienzo para cambiarlo y, cuando esté, «✓ Publicar».': ['{n} lists created: tap a text on the canvas to change it and, when ready, “✓ Publish”.', 'Creades {n} llistes: toca un text del llenç per canviar-lo i, quan estigui, «✓ Publica».']
  });
  const lee = G.lee, guarda = G.guarda, el = (t, c) => { const e = document.createElement(t); if (c) e.className = c; return e; };
  const qrSvg = u => { try { const g = window.qrcode(0, 'M'); g.addData(u); g.make(); return g.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); } catch (e) { return ''; } };
  const nombreL = id => esc((G.B.playlists[id] && G.B.playlists[id].nombre) || id.toUpperCase());
  /* publica en el canal; si el repetidor está caído, el mensaje queda en cola (se manda solo al volver) y se devuelve 'red' */
  const publica = (tema, datos, ret) => { const d = G.dir; if (!G.canal) return 'sin'; if (!d || !d.valido) return 'red'; d.pub(tema, datos, ret); return d.up ? 'ok' : 'red'; };
  const temaDe = (k, v) => !k || k === 'todos' ? 'orden/todos' : 'orden/' + k + '/' + v;
  /* qué pantallas son de un destino (todas, grupo, sede, grupo y sede o una) */
  const deDest = (k, v) => { const D = G.DSP; return Object.keys(D).filter(i => !k || k === 'todos' || (k === 'd' ? i === v : k === 'gs' ? D[i].g + '@' + D[i].s === v : k === 'et' ? (D[i].et || []).includes(v) : D[i][k] === v)); };
  const nomDest = (k, v) => !k || k === 'todos' ? T('Todos') : k === 'd' ? (G.DSP[v] ? G.DSP[v].n : v) : k === 'gs' ? v.replace('@', ' · ') : k === 'et' ? '#' + v : v;
  /* aviso si la orientación de la lista no casa con la de las pantallas */
  function avisoOri(lista, ids) { const p = G.B.playlists[lista]; if (!p || p.medida) return ''; const hor = p.formato === 'horizontal', n = ids.filter(i => G.horD(G.DSP[i]) !== hor).length; return n ? `<div class="nota mal">⚠ ${esc(T(hor ? '{n} pantallas son verticales y la lista es horizontal.' : '{n} pantallas son horizontales y la lista es vertical.').replace('{n}', n))}</div>` : ''; }
  /* las teclas de destino: Todos, grupos (◫), sedes (⌂), grupo y sede (◫⌂) y pantallas (▭) */
  function teclasDest(a, k, v, conCombos) { const D = G.DSP, ids = Object.keys(D), ag = G.B.agenda || [], gs = [...new Set(ids.map(i => D[i].g).concat(ag.filter(r => r.k === 'g').map(r => G.slug(r.v))).filter(Boolean))].sort(), ss = [...new Set(ids.map(i => D[i].s).concat(ag.filter(r => r.k === 's').map(r => G.slug(r.v))).filter(Boolean))].sort(),
      cs = conCombos ? [...new Set(ids.filter(i => D[i].g && D[i].s).map(i => D[i].g + '@' + D[i].s))].sort() : [], es = [...new Set(ids.flatMap(i => D[i].et || []).concat(ag.filter(r => r.k === 'et').map(r => G.slug(r.v))).filter(Boolean))].sort();
    return tecla(a, 'todos:', T('Todos'), k === 'todos', `<small>${ids.length}</small>`) + gs.map(g => tecla(a, 'g:' + g, esc(g), k === 'g' && v === g, G.icD('g'))).join('') + ss.map(x => tecla(a, 's:' + x, esc(x), k === 's' && v === x, G.icD('s'))).join('')
      + (cs.length > 1 ? cs.map(x => tecla(a, 'gs:' + x, esc(x.replace('@', ' · ')), k === 'gs' && v === x, G.icD('gs'))).join('') : '') + es.map(x => tecla(a, 'et:' + x, esc(x), k === 'et' && v === x, G.icD('et'))).join('') + ids.sort((x, y) => D[x].n.localeCompare(D[y].n)).map(i => tecla(a, 'd:' + i, esc(D[i].n), k === 'd' && v === i, G.icD('d'))).join(''); }

  /* ================= SIMPLE / PRO ================= */
  /* v1.23 · la vista se guarda desde la primera visita: quien empieza en SIMPLE sigue en SIMPLE al volver (antes, al recargar, pasaba a PRO) */
  const vistaIni = (() => { const v = lee('g-vista'); if (v === 'simple' || v === 'pro') return v; let viejo = false; try { viejo = !!(localStorage.getItem('adposter:gestor') || localStorage.getItem('adposter:g-ver')); } catch (e) {} const r = viejo ? 'pro' : 'simple'; guarda('g-vista', r); return r; })();
  html.classList.toggle('md-simple', vistaIni === 'simple');
  function sw() { const pro = !G.SIMPLE(); return `<button type="button" class="ss-bur${pro ? ' pro' : ''}" data-a="vista" data-v="${pro ? 'simple' : 'pro'}" aria-label="${T('Modo SIMPLE o PRO')}" title="${T('Modo SIMPLE o PRO')}"><i></i>${pro ? 'PRO' : 'SIMPLE'}</button><div class="ss-sw" role="group" aria-label="${T('Modo SIMPLE o PRO')}" title="${T('Modo SIMPLE o PRO')}"><button type="button" class="ss-sw-e${pro ? '' : ' on'}" data-a="vista" data-v="simple" aria-pressed="${!pro}">SIMPLE</button><label class="ss-sw-t"><input type="checkbox" id="ss-swc" aria-label="PRO"${pro ? ' checked' : ''}><span class="ss-sw-p"><span class="ss-sw-b"></span></span></label><button type="button" class="ss-sw-e${pro ? ' on' : ''}" data-a="vista" data-v="pro" aria-pressed="${pro}">PRO</button></div>`; }
  const cabSw = el('div', 'cab-sw'); $('.cab .marca').after(cabSw);
  const pintaSw = () => { cabSw.innerHTML = sw(); };
  document.addEventListener('change', e => { if (e.target.id === 'ss-swc') ACC.vista(e.target.checked ? 'pro' : 'simple'); });

  /* ================= EMERGENCIA: tecla roja en la cabecera, con tapa ================= */
  const bEm = el('button', 'tecla emer-bt'); bEm.type = 'button'; bEm.dataset.a = 'emergencia'; $('.cab .der').prepend(bEm);
  /* v1.33 · AVISO de un toque, junto a la EMERGENCIA: textos preparados o libre, cuánto dura y ENVIAR (lo mismo que la pestaña AVISOS) */
  const bAv = el('button', 'tecla aviso-bt'); bAv.type = 'button'; bAv.dataset.a = 'avisoRapido'; $('.cab .der').prepend(bAv);
  const AVP = [['Cerramos antes hoy', 'Hoy cerramos antes. ¡Gracias por su visita!'], ['Volvemos enseguida', 'Volvemos en 10 minutos.'], ['Oferta del día', 'Oferta del día: pregunte en el mostrador.'], ['Hoy cerrado', 'Hoy permanecemos cerrados. Disculpen las molestias.']];
  let av = null;
  function avPinta() { if (!av) return; const D = G.D;
    G.pon('#modal .m-caja', X.cabModal(T('Aviso')) + `<div class="av"><div class="rej dos">${AVP.map(([n, x], i) => tecla('avTxt', i, T(n), D.aviso === T(x))).join('')}</div>
      ${campo('av-x', D.aviso, T('texto del aviso'), ' maxlength="200" data-d="aviso"')}
      <h2>${T('Cuánto dura')}</h2><div class="fila">${[[30, '30 s'], [120, '2 min'], [600, '10 min']].map(([v, t]) => tecla('avSeg', v, t, !D.hasta && D.seg === v)).join('')}<small class="o-hasta">${T('o hasta las')}</small>${G.campoHora('av-hasta', D.hasta, ' data-dh="1" aria-label="' + T('hasta las') + '"')}</div>
      <h2>${T('Color')}</h2><div class="fila">${[['ambar', 'Ámbar'], ['rojo', 'Rojo'], ['verde', 'Verde'], ['azul', 'Azul']].map(([c, n]) => tecla('avCol', c, T(n), D.color === c)).join('')}</div>
      <div class="nota">${G.canal ? T('Sale encima de lo que esté saliendo en todas las pantallas y luego desaparece solo.') : T('Sin pantallas conectadas: solo se ve aquí. Añade una pantalla para mandarla.')}</div>
      <div class="fila"><button type="button" class="tecla pri" data-a="avEnvia"${D.aviso.trim() ? '' : ' disabled'}>${T('Enviar aviso')}</button></div></div>`); }
  document.addEventListener('input', e => { if (av && e.target.id === 'av-x') { const b = $('#modal [data-a="avEnvia"]'); if (b) b.disabled = !G.D.aviso.trim(); } });
  document.addEventListener('change', e => { if (av && e.target.id === 'av-hasta') setTimeout(avPinta, 0); });
  const banda = el('div'); banda.id = 'alarma'; banda.hidden = true; document.body.insertBefore(banda, $('main'));
  /* v1.23 · la emergencia lleva un id: cualquier gestor del canal la ve (escucha el tema «emergencia») y la retira; si el repetidor está caído se dice
     («NO ENVIADA · reintentando») y se manda sola al volver; la banda cuenta en cuántas pantallas está saliendo. Si una pantalla enseña una emergencia
     que ya nadie tiene en curso (porque estaba apagada cuando se retiró), la banda lo dice y deja retirarla */
  let EM = lee('g-emer') || null, EMRET = lee('g-emret') || null;
  function pintaEm() { bEm.innerHTML = `<i class="sir" aria-hidden="true"></i><span>${T('EMERGENCIA')}</span><b class="sos">SOS</b>`; bEm.setAttribute('aria-label', T('Emergencia')); bEm.title = T('Emergencia');
    const D = G.DSP || {}, L = Object.keys(D), on = !!(EM && EM.on), vieja = !on && L.some(i => +D[i].e && Date.now() - D[i].visto < 50000); html.classList.toggle('alarma', on);
    banda.hidden = !on && !vieja; if (banda.hidden) { banda.innerHTML = ''; return; }
    if (!on) { banda.className = 'vieja'; banda.innerHTML = `<i class="sir" aria-hidden="true"></i><b>${T('Una pantalla muestra una emergencia antigua')}</b><span></span><button type="button" class="tecla" data-a="emRetira">${T('Retirar')}</button>`; return; }
    const lin = L.filter(i => Date.now() - D[i].visto < 50000), n = lin.filter(i => +D[i].e && (!D[i].ei || D[i].ei === EM.id)).length, est = EM.pend ? T('NO ENVIADA · reintentando') : lin.length ? T('en {n}/{m} pantallas').replace('{n}', n).replace('{m}', lin.length) : '';
    banda.className = EM.pend ? 'pend' : ''; banda.innerHTML = `<i class="sir" aria-hidden="true"></i><b>${T('EMERGENCIA EN CURSO')}</b><span>${esc(EM.x)}</span><small>${esc((EM.dn || '') + (est ? ' · ' + est : ''))}</small><button type="button" class="tecla" data-a="emRetira">${T('Retirar')}</button>`; }
  setInterval(pintaEm, 3000);
  const PRESET = [['evac', 'Evacuación', 'EVACUACIÓN: salgan con calma por la salida más cercana y sigan las indicaciones del personal.'], ['fuego', 'Incendio', 'INCENDIO: no usen los ascensores. Salgan por la escalera de emergencia.'], ['conf', 'Confinamiento', 'CONFINAMIENTO: permanezcan dentro, lejos de puertas y ventanas, hasta nuevo aviso.'], ['libre', 'Texto libre', '']];
  let em = null;
  /* la tapa y DISPARAR van arriba: en el móvil apaisado se ven sin desplazar */
  function emPinta() { const m = $('#modal .m-caja'); if (!m || !em) return; const D = G.DSP, ids = Object.keys(D), gs = [...new Set(ids.map(i => D[i].g).filter(Boolean))], ss = [...new Set(ids.map(i => D[i].s).filter(Boolean))];
    G.pon('#modal .m-caja', X.cabModal('⚠ ' + T('EMERGENCIA')) + `<div class="em">
      <div class="tapa${em.tapa ? ' abierta' : ''}"><button type="button" class="tecla emer-go" data-a="emDispara"${em.tapa ? '' : ' disabled'}>⚠ ${T('DISPARAR')}</button><button type="button" class="tapa-c" data-a="emTapa" aria-pressed="${em.tapa}">${T('Levantar la tapa')}</button></div>
      <div class="rej dos">${PRESET.map(p => tecla('emPre', p[0], T(p[1]), em.pre === p[0])).join('')}</div>
      <textarea class="campo area" id="em-x" rows="3" maxlength="240" aria-label="${T('Texto libre')}">${esc(em.x)}</textarea>
      <h2>${T('Dónde')}</h2><div class="rej env">${tecla('emDest', 'todos:', T('Todos'), em.k === 'todos')}${gs.map(g => tecla('emDest', 'g:' + g, esc(g), em.k === 'g' && em.v === g, G.icD('g'))).join('')}${ss.map(s => tecla('emDest', 's:' + s, esc(s), em.k === 's' && em.v === s, G.icD('s'))).join('')}</div>
      <div class="fila">${tecla('emSon', '', T('Sonido'), em.son)}${tecla('emVoz', '', T('Voz'), em.voz)}</div>
      <div class="nota">${T('Sale a pantalla completa en todas las pantallas del destino, con sonido, y se queda hasta que la retires. Queda guardada en el repetidor: la ve también la pantalla que se enciende después.')} <b>${T('Los repetidores son públicos y sin garantía: esto no sustituye a la alarma oficial del edificio.')}</b></div>
      ${G.canal ? '' : `<div class="nota mal">${T('Sin directo: la emergencia solo se ve en el lienzo. Activa el directo para mandarla a las pantallas.')}</div>`}</div>`); }

  /* ================= ENVIAR CAMBIOS y A PANTALLAS ================= */
  /* v1.23 · «✓ Publicar» manda las listas, el calendario y los festivos a todas las pantallas: cada una sigue con su lista.
     Las imágenes propias van cada una en su propio mensaje retenido (m/<clave>), solo las que han cambiado (o todas, si alguna pantalla dice que le faltan) */
  const huella = d => String(d).length.toString(36) + String(d).slice(-10);
  function datosVivo() { const B = G.B, usados = JSON.stringify(B.playlists), mk = {}; Object.keys(B.medios || {}).forEach(k => { if (usados.indexOf('"m:' + k + '"') >= 0) mk[k] = huella(B.medios[k]); }); return { t: Date.now(), playlists: B.playlists, agenda: B.agenda || [], festivos: B.festivos || [], mk }; }
  let pendDatos = false;
  function mandaDatos() { if (!G.canal) return 'sin'; const o = datosVivo(); if (JSON.stringify(o).length > 700000) { G.estado(T('Las listas son demasiado grandes para el directo: publica playlists.json.')); return 'grande'; }
    if (!G.dir || !G.dir.up) { pendDatos = true; return 'red'; }
    const r = publica('datos', o, true); if (r !== 'ok') { pendDatos = true; return r; } pendDatos = false;
    const env = lee('g-menv') || {}, todo = Object.keys(G.DSP).some(i => +G.DSP[i].mf) || !env._t || Date.now() - env._t > 600000;
    Object.keys(o.mk).forEach(k => { if (todo || env[k] !== o.mk[k]) { G.dir.pub('m/' + k, { k, d: G.B.medios[k], h: o.mk[k] }, true); env[k] = o.mk[k]; } });
    Object.keys(env).forEach(k => { if (k !== '_t' && !o.mk[k]) { G.dir.borra('m/' + k); delete env[k]; } }); if (todo) env._t = Date.now(); guarda('g-menv', env);
    G.enviado(o.t); return 'ok'; }
  let ap = null;
  function apPinta() { const m = $('#modal .m-caja'); if (!m || !ap) return; const ids = ap.k ? deDest(ap.k, ap.v) : [], n = ids.length, listo = !!ap.k && !!G.B.playlists[ap.l], seguro = ap.k === 'todos' && n > 1;
    const res = listo ? `${nombreL(ap.l)} → ${esc(nomDest(ap.k, ap.v))} (${n}) · ${T(ap.c === 'ahora' ? 'Ahora' : ap.c === 'durante' ? 'Durante' : 'Desde')}${ap.c === 'durante' ? ' ' + ap.min + ' min' : ''}` : T('Elige a qué pantallas.');
    G.pon('#modal .m-caja', X.cabModal(T('A pantallas')) + `<div class="ap"><div class="ap-cue">
      <h2>${T('Qué')}</h2><div class="rej env">${G.listasVis().map(id => tecla('apL', id, nombreL(id), ap.l === id)).join('')}</div>
      <h2>${T('Dónde')}</h2><div class="rej env">${teclasDest('apD', ap.k, ap.v, true)}</div>${listo ? avisoOri(ap.l, ids) : ''}
      <h2>${T('Cuándo')}</h2><div class="rej tres">${tecla('apC', 'ahora', T('Ahora'), ap.c === 'ahora')}${tecla('apC', 'durante', T('Durante'), ap.c === 'durante')}${tecla('apC', 'desde', T('Desde'), ap.c === 'desde')}</div>
      ${ap.c === 'durante' ? G.paso('apMin', ap.min + ' <small>' + T('min') + '</small>') : ''}${ap.c === 'desde' ? `<div class="fila fechas">${G.campoFecha('ap-f', ap.f, ' aria-label="' + T('Desde') + '"')}${G.campoHora('ap-h', ap.h, ' aria-label="' + T('hora') + '"')}</div>` : ''}
      ${ap.c === 'ahora' ? `<div class="fila">${tecla('apCasa', '', T('Que sea su lista de siempre'), ap.casa)}</div><div class="nota">${T('Si no lo marcas, es solo por un rato: luego cada pantalla vuelve a su lista.')}</div>` : ''}
      ${G.canal ? '' : `<div class="nota mal">${T('Sin directo, las pantallas solo cambian al publicar playlists.json. Activa el directo y llegará todo al momento.')}</div><div class="fila"><button type="button" class="tecla" data-a="apCanal">${T('Activar el directo')}</button></div>`}</div>
      <div class="ap-pie"><div class="lcd url" id="ap-res">${res}</div><div class="fila"><button type="button" class="tecla pri grande${ap.seguro ? ' seguro' : ''}" data-a="apVa"${listo ? '' : ' disabled'}>${ap.seguro ? '⚠ ' + esc(T('¿Seguro? Cambiar las {n} pantallas').replace('{n}', n)) : '▶ ' + T('A pantallas')}</button></div><div class="lcd url" id="ap-msg"></div></div></div>`);
    if (seguro && !ap.avisado) ap.avisado = true; }

  /* ================= AÑADIR PANTALLA ================= */
  let al = null;
  function alPinta() { const m = $('#modal .m-caja'); if (!m || !al) return; const pl = G.B.playlists, med = pl[al.l] && pl[al.l].medida, o = { rot: al.rot, lang: al.lang, nombre: al.n, grupo: al.g, sede: al.s, etiq: al.et }; if (med && al.px) Object.assign(o, { px: 1, ox: al.ox, oy: al.oy }); const u = G.urlKiosco(al.l, o), alta = new URL('tv', G.urlKiosco(al.l).split('p/?')[0]).href;   /* v1.32 · dirección corta: …/tv abre lo mismo que …/p/?alta */
    const nota = `<div class="nota">${esc(T('En la tele, abre el navegador (o la app Kiosk del stick) y entra en {u}. Saldrá un código de 6 caracteres: escríbelo aquí y la pantalla se configura sola.').replace('{u}', alta))}</div>`,
      codigo = `<div class="fila">${campo('al-cod', al.cod, T('código'), ' maxlength="6" autocapitalize="characters" data-al="cod" style="text-transform:uppercase;letter-spacing:.3em;text-align:center"')}<button type="button" class="tecla pri" data-a="alEmpareja">${T('Emparejar')}</button></div><div class="lcd url${al.ok ? ' ok' : ''}" id="al-msg">${esc(al.msg || '')}</div>`,
      listas = `<div class="rej env">${G.listasVis().map(id => tecla('alL', id, nombreL(id), al.l === id)).join('')}</div>`,
      gs = `<div class="fila">${campo('al-g', al.g, T('grupo (p. ej. menu)'), ' maxlength="24" data-al="g"')}${campo('al-s', al.s, T('sede (p. ej. centro)'), ' maxlength="24" data-al="s"')}</div>${campo('al-et', al.et, T('etiquetas, separadas por comas (p. ej. barra, terraza)'), ' maxlength="120" data-al="et"')}`,
      giro = `<h2>${T('Giro')}</h2><div class="fila giro">${[0, 90, 180, 270].map(g => tecla('alRot', g, g + '°', al.rot === g)).join('')}</div>`,
      idi = `<h2>${T('Idioma')}</h2><div class="fila">${['es', 'en', 'ca'].map(l => tecla('alLang', l, l.toUpperCase(), al.lang === l)).join('')}</div>`;
    /* v1.32 · SIMPLE: en tres pasos y en una columna; grupo, sede, giro e idioma, plegados en «Más opciones» */
    if (G.SIMPLE()) { G.pon('#modal .m-caja', X.cabModal('+ ' + T('Añadir pantalla')) + `<div class="alta alta-s">
      <h2>1 · ${T('En la tele')}</h2>${nota}
      <h2>2 · ${T('Cómo se llama y qué enseña')}</h2>${campo('al-n', al.n, T('Nombre de la pantalla'), ' maxlength="32" data-al="n"')}${listas}
      <div class="fila"><button type="button" class="tecla al-mas" data-a="alMas" aria-expanded="${!!al.mas}">${al.mas ? '▾' : '▸'} ${T('Más opciones')} <small>${T('grupo, sede, giro, idioma')}</small></button></div>${al.mas ? gs + giro + idi : ''}
      <h2>3 · ${T('Escribe el código de la tele')}</h2>${codigo}</div>`); return; }
    G.pon('#modal .m-caja', X.cabModal('+ ' + T('Añadir pantalla')) + `<div class="alta"><div class="alta-izq">
      ${campo('al-n', al.n, T('Nombre de la pantalla'), ' maxlength="32" data-al="n"')}<div class="fila">${campo('al-g', al.g, T('grupo (p. ej. menu)'), ' maxlength="24" data-al="g"')}${campo('al-s', al.s, T('sede (p. ej. centro)'), ' maxlength="24" data-al="s"')}</div>${campo('al-et', al.et, T('etiquetas, separadas por comas (p. ej. barra, terraza)'), ' maxlength="120" data-al="et"')}
      <h2>${T('Lista')}</h2><div class="rej env">${G.listasVis().map(id => tecla('alL', id, nombreL(id), al.l === id)).join('')}</div>
      <h2>${T('Giro')}</h2><div class="fila giro">${[0, 90, 180, 270].map(g => tecla('alRot', g, g + '°', al.rot === g)).join('')}</div>
      <h2>${T('Idioma')}</h2><div class="fila">${['es', 'en', 'ca'].map(l => tecla('alLang', l, l.toUpperCase(), al.lang === l)).join('')}</div>
      ${med ? `<div class="solo-pro"><h2>LED · ${med.w}×${med.h}</h2><div class="fila">${tecla('alPx', '', T('1:1 píxel (LED)'), al.px)}${al.px ? `<label class="fm-l">X<input type="number" class="campo" value="${al.ox}" min="0" max="16000" data-al="ox"></label><label class="fm-l">Y<input type="number" class="campo" value="${al.oy}" min="0" max="16000" data-al="oy"></label>` : ''}</div></div>` : ''}</div>
      <div class="alta-der"><h2>${T('Con código, sin teclear la dirección')}</h2><div class="nota">${esc(T('En la tele, abre el navegador (o la app Kiosk del stick) y entra en {u}. Saldrá un código de 6 caracteres: escríbelo aquí y la pantalla se configura sola.').replace('{u}', alta))}</div>
      <div class="fila">${campo('al-cod', al.cod, T('código'), ' maxlength="6" autocapitalize="characters" data-al="cod" style="text-transform:uppercase;letter-spacing:.3em;text-align:center"')}<button type="button" class="tecla pri" data-a="alEmpareja">${T('Emparejar')}</button></div><div class="lcd url${al.ok ? ' ok' : ''}" id="al-msg">${esc(al.msg || '')}</div>
      <div class="solo-pro alta-url"><div class="alta-qr">${qrSvg(u)}</div><div class="lcd url" id="al-url">${esc(u)}</div><div class="fila"><button type="button" class="tecla" data-a="alCopia">${T('Copiar')}</button><a class="tecla" href="${esc(u)}" target="_blank" rel="noopener">${T('Abrir')}</a></div>
      <div class="nota">${T('Abre esta dirección en la pantalla (o escanea el QR con el aparato) y ponla como página de inicio del kiosco.')}</div></div></div></div>`); }
  let alCon = null, alT = 0, alT2 = 0;
  /* v1.23 · el emparejado manda también las listas (la pantalla enseña lo suyo al momento), avisa en segundos si el código no existe
     y deja el formulario listo para la siguiente pantalla igual (mismo grupo, sede y lista) */
  function empareja() { const c = String(al.cod || '').toLowerCase().replace(/[^a-z0-9]/g, ''); const msg = (t, ok) => { al.msg = t; al.ok = !!ok; const e = $('#al-msg'); if (e) { e.textContent = t; e.classList.toggle('ok', !!ok); } };
    if (c.length !== 6) { msg(T('El código tiene 6 letras o números.')); return; } if (!G.canal) ACC.canalNuevo();
    if (alCon) alCon.cierra(); clearTimeout(alT); clearTimeout(alT2); msg(T('Esperando a la pantalla…'));
    const cfg = { canal: G.canal, l: al.l, n: al.n.trim(), g: al.g.trim(), s: al.s.trim(), et: String(al.et || '').trim(), rot: al.rot, lang: al.lang, origen: G.ORIG || '', t: Date.now(), datos: datosVivo() }; if (JSON.stringify(cfg).length > 700000) delete cfg.datos;
    let visto = false; const nom = cfg.n || c.toUpperCase();
    alCon = window.ADDIRECTO.conecta('alta' + c, { temas: ['ok', 'hola'], alMensaje: (t, d) => { if (t === 'hola') { if (!visto) { visto = true; msg(T('Pantalla encontrada: emparejando…')); } return; } if (t !== 'ok' || !d) return;
      alCon.borra('cfg'); setTimeout(() => { alCon && alCon.cierra(); alCon = null; }, 800); clearTimeout(alT); clearTimeout(alT2); mandaDatos();
      if (al) { al.n = ''; al.cod = ''; alPinta(); } msg('✓ ' + T('Pantalla emparejada') + ' · ' + nom + ' — ' + T('Listo: puedes añadir otra igual (mismo grupo, sede y lista).'), true); G.estado(T('Pantalla emparejada') + ' · ' + nom); const i = $('#al-n'); i && i.focus(); } });
    alCon.pub('cfg', cfg, true); alT2 = setTimeout(() => { if (!visto && alCon) msg(T('No encuentro una pantalla con ese código: revisa las 6 letras y que la pantalla tenga internet.')); }, 9000);
    alT = setTimeout(() => { if (alCon) { alCon.borra('cfg'); alCon.cierra(); alCon = null; } msg(T('La pantalla no responde: comprueba el código y que esté abierta en …/p/?alta.')); }, 60000); }

  /* ================= ASISTENTE por tipo de negocio ================= */
  /* cada negocio: las listas que crea (composición con plantillas o carteles), con horas por escena cuando tiene sentido.
     v1.23 · el nombre del negocio solo va donde la plantilla tiene un rótulo de marca (nunca pisa «HAPPY», «WiFi»…); las zonas de carteles de ejemplo
     pasan a ser una imagen vacía para poner la foto propia; las tiendas empiezan sin carteles ni anuncios de muestra; «t»: textos propios del negocio */
  const NEG = {
    cafe: { n: 'Cafetería o bar', l: [{ id: 'carta', n: 'CARTA', esc: [['cafeteria', { hIni: '07:00', hFin: '12:00' }], ['carta-precios'], ['menu-dia', { hIni: '12:00', hFin: '16:00' }], ['happy-hour', { hIni: '17:00', hFin: '21:00' }], ['wifi']] }] },
    pan: { n: 'Panadería o pastelería', l: [{ id: 'escaparate', n: 'ESCAPARATE', esc: [['carta-precios', { hIni: '07:00', hFin: '14:00' }, ['PAN DEL DÍA']], ['oferta'], ['horario'], ['siguenos']] }] },
    rapida: { n: 'Comida rápida', l: [{ id: 'menu', n: 'MENÚ', hor: true, esc: [['carta-precios'], ['oferta']] }, { id: 'pedidos', n: 'PEDIDOS', hor: false, esc: [['pedidos-listos']] }] },
    tienda: { n: 'Tienda', l: [{ id: 'escaparate', n: 'ESCAPARATE', carteles: true }, { id: 'caja', n: 'CAJA', esc: [['oferta'], ['rebajas'], ['resena']] }] },
    pelu: { n: 'Peluquería o estética', l: [{ id: 'salon', n: 'SALÓN', esc: [['bienvenida'], ['servicios-precios'], ['siguenos'], ['resena']] }] },
    clinica: { n: 'Clínica o sala de espera', l: [{ id: 'sala-espera', n: 'SALA DE ESPERA', hor: true, esc: [['turnos'], ['aviso']] }, { id: 'recepcion', n: 'RECEPCIÓN', hor: false, esc: [['horario'], ['wifi']] }] },
    oficina: { n: 'Oficina', l: [{ id: 'comunicacion', n: 'COMUNICACIÓN', hor: true, esc: [['bienvenida'], ['mensaje'], ['cumple'], ['panel']] }, { id: 'sala', n: 'SALA', hor: true, esc: [['sala']] }] },
    led: { n: 'Concesionario o LED', l: [{ id: 'muro', n: 'MURO LED', medida: { w: 1500, h: 1000 }, esc: [['novedad'], ['oferta']] }, { id: 'salon', n: 'SALÓN', hor: false, esc: [['inmueble'], ['precios']] }] } };
  const MARCA = /^(CENTRO MÉDICO|MEDICAL CENTRE|CENTRE MÈDIC|TU NEGOCIO|YOUR BUSINESS|EL TEU NEGOCI)$/i;
  let as = null;
  function asPinta() { const m = $('#modal .m-caja'); if (!m || !as) return; let h;
    if (as.paso === 1) h = `<h2>1 · ${T('¿Qué negocio tienes?')}</h2><div class="rej dos neg">${Object.keys(NEG).map(k => tecla('asNeg', k, T(NEG[k].n), as.neg === k)).join('')}</div><div class="nota">${T('Tres pasos: el negocio, la pantalla y crear. Después se cambia todo tocando las piezas.')}</div>`;
    else if (as.paso === 2) h = `<h2>2 · ${T('¿Cómo es la pantalla?')}</h2><div class="rej tres">${tecla('asFor', 'vertical', T('Vertical'), as.f === 'vertical')}${tecla('asFor', 'horizontal', T('Horizontal'), as.f === 'horizontal')}${tecla('asFor', 'led', T('LED a medida'), as.f === 'led')}</div>${usaNombre() ? campo('as-n', as.nom, T('Nombre del negocio'), ' maxlength="40" data-as="nom"') + `<div class="nota">${T('Sale en el rótulo de marca y bajo el QR.')}</div>` : ''}`;
    else { const N = NEG[as.neg]; h = `<h2>3 · ${T('Se crearán')}</h2><div class="as-res">${N.l.map(l => `<div class="lcd res">${esc(l.n)} <small>${l.carteles ? T('Carteles') : (l.esc || []).length + ' ' + T('escenas')}</small></div>`).join('')}</div>`; }
    G.pon('#modal .m-caja', X.cabModal(T('Asistente')) + `<div class="as"><div class="as-pasos">${[1, 2, 3].map(i => `<i class="${i <= as.paso ? 'on' : ''}">${i}</i>`).join('')}</div>${h}<div class="fila">${as.paso > 1 ? `<button type="button" class="tecla" data-a="asPaso" data-v="-1">◀ ${T('Atrás')}</button>` : ''}<button type="button" class="tecla pri" data-a="${as.paso < 3 ? 'asPaso' : 'asCrea'}" data-v="1"${as.paso === 1 && !as.neg ? ' disabled' : ''}>${as.paso < 3 ? T('Siguiente') + ' ▶' : T('Crear')}</button></div></div>`); }
  /* v1.36 · ¿alguna plantilla del negocio lleva un rótulo de marca o un QR con texto? Si no, el nombre no se pide */
  function usaNombre() { const N = NEG[as && as.neg], PL = window.ADPLANT; if (!N || !PL) return true; return N.l.some(l => l.carteles || (l.esc || []).some(([pid]) => { const e = PL.haz(pid, as.f !== 'vertical', G.lang); return !!e && e.piezas.some(z => z.t === 'texto' && MARCA.test(String(z.tx || '').trim())); })); }
  function asCrea() { const N = NEG[as.neg], PL = window.ADPLANT, B = G.B, hechas = []; let primera = '';
    N.l.forEach(l => { let id = l.id, k = 2; while (B.playlists[id]) id = l.id.slice(0, 21) + '-' + k++; const medida = as.f === 'led' ? { w: 1500, h: 1000 } : l.medida || null, hor = medida ? medida.w >= medida.h : l.hor != null && as.f !== 'led' && N.l.length > 1 ? l.hor : as.f !== 'vertical';
      let nom = l.n, j = 2; while (Object.keys(B.playlists).some(x => (B.playlists[x].nombre || '') === nom)) nom = l.n + ' ' + j++;   // dos «PEDIDOS» no: el segundo es «PEDIDOS 2»
      const p = G.completa({ nombre: nom, formato: hor ? 'horizontal' : 'vertical' }); if (medida) p.medida = medida;
      if (l.carteles) { p.contenido = []; p.anuncios = []; p.qr = Object.assign(p.qr, { activo: false, url: '', texto: as.nom || '' }); }
      else { p.modo = 'escenas'; p.escenas = l.esc.map(([pid, extra, txs]) => { const e = PL.haz(pid, hor, G.lang); if (!e) return null; if (extra) Object.assign(e, extra);
        const ts = e.piezas.filter(z => z.t === 'texto'); (txs || []).forEach((x, i) => { if (ts[i] && x) ts[i].tx = T(x); });
        if (as.nom) ts.forEach(t => { if (MARCA.test(String(t.tx || '').trim())) t.tx = as.nom; });
        e.piezas = e.piezas.map(z => z.t === 'zona' ? { id: z.id, t: 'imagen', x: z.x, y: z.y, w: z.w, h: z.h, r: z.r || 0, o: z.o == null ? 1 : z.o, radio: z.radio || 0, src: '', aj: 'cubrir' } : z); return e; }).filter(Boolean); }
      B.playlists[id] = p; hechas.push(id); primera = primera || id; });
    G.guarda(G.KB, B); X.cierraModal ? X.cierraModal() : ACC.modalCierra(); ACC.sel(primera); if (innerWidth <= 900) ponVm('lienzo');
    G.estado(T(hechas.length === 1 ? 'Lista creada: toca un texto del lienzo para cambiarlo y, cuando esté, «✓ Publicar».' : 'Creadas {n} listas: toca un texto del lienzo para cambiarlo y, cuando esté, «✓ Publicar».').replace('{n}', hechas.length)); }

  /* ================= MANDO: turnos y pedidos ================= */
  /* v1.23 · el contador de turnos es uno por canal: cada gestor escucha el último turno del repetidor y sigue desde ahí (dos recepciones no repiten números) */
  const TU = Object.assign({ serie: 'A', num: 0, puestos: 'CONSULTA 1, CONSULTA 2, CONSULTA 3', p: 0, hist: [], voz: true, t: 0 }, lee('g-turno') || {});
  const PE = Object.assign({ lcd: '', prep: [], listos: [], cad: 10 }, lee('g-pedidos') || {});
  const hay = t => Object.keys(G.B.playlists).some(k => (G.B.playlists[k].escenas || []).some(e => (e.piezas || []).some(z => z.t === t)));
  const numT = n => (TU.serie ? TU.serie + '-' : '') + String(n).padStart(3, '0'), puestos = () => TU.puestos.split(',').map(x => x.trim()).filter(Boolean).slice(0, 8);
  const vivos = () => { const lim0 = Date.now() - PE.cad * 60000; PE.listos = PE.listos.filter(x => x[1] > lim0); return PE.listos; };
  function directoMas() { let h = ''; const pu = puestos();
    if (hay('turno')) h += `<h2>${T('Turnos')}</h2><button type="button" class="tecla pri llama" data-a="tuLlama">${T('Llamar siguiente')} ▶</button><div class="fila"><button type="button" class="tecla rd" data-a="tuPaso" data-v="-1" aria-label="−">◀</button><div class="lcd grande" id="tu-lcd">${esc(numT(TU.num))}</div><button type="button" class="tecla rd" data-a="tuPaso" data-v="1" aria-label="+">▶</button></div>
      <div class="rej tres">${pu.map((p, i) => tecla('tuPuesto', i, esc(p), TU.p === i)).join('')}</div><div class="fila"><button type="button" class="tecla" data-a="tuRepite">${T('Repetir')}</button>${tecla('tuVoz', '', T('Voz'), TU.voz)}<button type="button" class="tecla reset" data-a="tuCero">${T('Empezar de 0')}</button></div>
      <div class="fila">${campo('tu-serie', TU.serie, T('serie'), ' maxlength="2" data-tu="serie" style="flex:0 0 4em;text-align:center"')}${campo('tu-puestos', TU.puestos, T('puestos, separados por comas'), ' maxlength="120" data-tu="puestos"')}</div>${EM && EM.on ? `<div class="nota mal">${T('Turnos en silencio durante la emergencia')}</div>` : ''}`;
    if (hay('pedidos')) { vivos(); h += `<h2>${T('Pedidos listos')}</h2><div class="pe"><div class="pe-tec"><div class="lcd grande" id="pe-lcd">${esc(PE.lcd || '—')}</div><div class="pe-num">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map(k => `<button type="button" class="tecla" data-a="peTecla" data-v="${k}">${k}</button>`).join('')}</div></div>
      <div class="pe-col"><b>${T('Preparando')}</b><div class="pe-ch">${PE.prep.map(n => `<button type="button" class="tecla ch" data-a="peListo" data-v="${esc(n)}">${esc(n)}</button>`).join('')}</div><b class="v">${T('Listo')}</b><div class="pe-ch">${PE.listos.map(x => `<button type="button" class="tecla ch v" data-a="peQuita" data-v="${esc(x[0])}">${esc(x[0])}</button>`).join('')}</div></div></div>
      <div class="fila"><button type="button" class="tecla" data-a="peDeshaz"${PEH.length ? '' : ' disabled'}>↶ ${T('Deshacer')}</button><button type="button" class="tecla" data-a="peLimpia">${T('Limpiar')}</button></div><div class="fila">${G.medio('peCad', PE.cad + ' <small>min</small>')}</div><div class="nota">${esc(T('Toca un número de «Preparando» para pasarlo a «Listo», y uno de «Listo» para retirarlo. Los listos se van solos a los {n} min.').replace('{n}', PE.cad))}</div>`; }
    return h; }
  function mandaTurno(repite) { const pu = puestos(), n = numT(TU.num), p = pu[TU.p] || '';
    if (!repite || !TU.hist[0] || TU.hist[0].n !== n) { TU.hist.unshift({ n, p }); TU.hist = TU.hist.slice(0, 8); }   // REPETIR no duplica el historial
    const m = { n, p, h: TU.hist.slice(1, 7), t: Date.now(), voz: !!TU.voz, rep: repite ? 1 : 0, k: TU.num, s: TU.serie }; TU.t = m.t; guarda('g-turno', TU);
    window.ADVIVO && window.ADVIVO.pon('turno', m); const r = publica('turno', m, true); G.estado(EM && EM.on ? T('Turnos en silencio durante la emergencia') : r === 'ok' ? T('Enviado') + ' · ' + m.n + ' → ' + m.p : r === 'red' ? T('Sin conexión: se enviará al volver.') : T('Sin directo: el turno solo se ve en el lienzo.')); G.pintaT(); }
  /* v1.37 · deshacer en el mando de pedidos: guarda cómo estaba antes de cada toque (hasta 20) */
  const PEH = []; const peGuarda = () => { PEH.push(JSON.stringify({ prep: PE.prep, listos: PE.listos })); if (PEH.length > 20) PEH.shift(); };
  function mandaPedidos() { vivos(); const m = { prep: PE.prep.slice(0, 24), listos: PE.listos.slice(0, 24), cad: PE.cad, t: Date.now() }; guarda('g-pedidos', PE); window.ADVIVO && window.ADVIVO.pon('pedidos', m); publica('pedidos', m, true); G.pintaT(); }

  /* ================= formato a medida (LED) ================= */
  /* v1.23 · cabinets rectangulares: ancho y alto de cada cabinet por separado (p. ej. 128 × 256 px) */
  let fm = null;
  function fmPinta() { const m = $('#modal .m-caja'); if (!m || !fm) return; const PRE = [[1500, 1000], [1920, 1080], [1080, 1920], [2000, 500], [768, 768], [3840, 1080]];
    G.pon('#modal .m-caja', X.cabModal(T('Formato a medida')) + `<div class="fm"><div class="fila"><label class="fm-l">${T('ancho')}<input type="number" class="campo" id="fm-w" value="${fm.w}" min="64" max="8192" data-fm="w"></label><b>×</b><label class="fm-l">${T('alto')}<input type="number" class="campo" id="fm-h" value="${fm.h}" min="64" max="8192" data-fm="h"></label><span class="lcd">px</span></div>
      <div class="rej tres">${PRE.map(([w, h]) => tecla('fmPre', w + 'x' + h, w + '×' + h, fm.w === w && fm.h === h)).join('')}</div>
      <h2>${T('Cabinets')}</h2><div class="fila geo"><label><span>${T('columnas')}</span><input type="number" class="campo" value="${fm.c}" min="1" max="40" data-fm="c"></label><label><span>${T('filas')}</span><input type="number" class="campo" value="${fm.f}" min="1" max="40" data-fm="f"></label><label><span>${T('px ancho')}</span><input type="number" class="campo" value="${fm.pw}" min="16" max="2048" data-fm="pw"></label><label><span>${T('px alto')}</span><input type="number" class="campo" value="${fm.ph}" min="16" max="2048" data-fm="ph"></label></div>
      <div class="nota">${T('Para pantallas LED: el lienzo toma la resolución exacta del controlador (sin franjas negras). Las piezas se recolocan en proporción.')}</div>
      <div class="fila"><button type="button" class="tecla pri" data-a="fmPon">${T('Aplicar')}</button><button type="button" class="tecla reset" data-a="fmQuita"${G.P().medida ? '' : ' disabled'}>${T('Quitar')}</button></div></div>`); }
  document.addEventListener('input', e => { const t = e.target, d = t.dataset || {};
    if (d.fm && fm) { const v = Math.round(+t.value || 0); fm[d.fm] = v; if (['c', 'f', 'pw', 'ph'].includes(d.fm) && fm.c > 0 && fm.f > 0 && fm.pw > 0 && fm.ph > 0) { fm.w = fm.c * fm.pw; fm.h = fm.f * fm.ph; const a = $('#fm-w'), b = $('#fm-h'); if (a) a.value = fm.w; if (b) b.value = fm.h; } }
    else if (d.al && al) { al[d.al] = ['ox', 'oy'].includes(d.al) ? Math.max(0, Math.round(+t.value || 0)) : t.value; if (d.al !== 'cod') { const pl = G.B.playlists, o = { rot: al.rot, lang: al.lang, nombre: al.n, grupo: al.g, sede: al.s, etiq: al.et }; if (pl[al.l] && pl[al.l].medida && al.px) Object.assign(o, { px: 1, ox: al.ox, oy: al.oy }); const u = G.urlKiosco(al.l, o), q = $('.alta-qr'), l = $('#al-url'); if (q) q.innerHTML = qrSvg(u); if (l) l.textContent = u; const a = $('.alta-url a.tecla'); if (a) a.href = u; } }
    else if (d.as && as) as[d.as] = t.value;
    else if (d.tu) { TU[d.tu] = d.tu === 'serie' ? t.value.toUpperCase().replace(/[^A-Z0-9]/g, '') : t.value; guarda('g-turno', TU); const l = $('#tu-lcd'); if (l) l.textContent = numT(TU.num); }
    else if (t.id === 'em-x' && em) { em.x = t.value; }
    else if (t.id === 'un-c' && un) un.c = t.value; });
  document.addEventListener('change', e => { const t = e.target; if (!ap) return; if (t.id === 'ap-f' || t.id === 'ap-h') { const v = G.valor(t); if (v !== null) ap[t.id === 'ap-f' ? 'f' : 'h'] = v; } });

  /* ================= MANDO EN EL MÓVIL y UNIRSE a las pantallas ================= */
  /* v1.23 · un QR lleva a cualquier móvil al canal de las pantallas: se une y trae las listas e imágenes que tienen (por el directo, sin archivos) */
  const urlUnir = () => new URL('./', location.href).href.split('?')[0] + '?unir=' + G.canal;
  let un = null;
  const sacaCanal = v => { v = String(v || '').trim(); const m = /[?&]unir=([a-z0-9]{6,40})/i.exec(v); if (m) return m[1]; return window.ADDIRECTO && window.ADDIRECTO.canalOk(v) ? v : ''; };
  function unPinta() { const m = $('#modal .m-caja'); if (!m || !un) return; G.pon('#modal .m-caja', X.cabModal(T('Unir este aparato a mis pantallas')) + `<div class="un"><div class="nota">${T('Este aparato se unirá a tus pantallas y traerá las listas que tienen ahora (las de este aparato se sustituyen).')}</div>
      ${un.fijo ? `<div class="lcd url">${esc(un.c)}</div>` : campo('un-c', un.c, T('Pega aquí el enlace del mando o el código del canal'), ' maxlength="300"')}<div class="lcd url" id="un-msg">${esc(un.msg || '')}</div><div class="fila"><button type="button" class="tecla pri" data-a="unVa">${T('Unirme')}</button></div></div>`); }
  function adopta(x) { if (!x || !x.playlists || typeof x.playlists !== 'object') return; const B = G.B; B.playlists = {}; Object.keys(x.playlists).forEach(k => { B.playlists[k] = G.completa(x.playlists[k]); }); B.agenda = Array.isArray(x.agenda) ? x.agenda : []; B.festivos = Array.isArray(x.festivos) ? x.festivos : [];
    G.guarda(G.KB, B); guarda('g-trae', null); if (!B.playlists[G.sel]) ACC.sel(Object.keys(B.playlists)[0]); G.repinta(); G.enviado(+x.t || Date.now()); G.estado(T('Listas traídas de tus pantallas')); }
  /* lo que llega del canal además del estado de las pantallas */
  X.alVivo = (t, x, ret) => { if (!x || typeof x !== 'object') return;
    if (t === 'emergencia') { if (x.on) { EM = Object.assign({}, x, { dn: x.k === 'todos' || !x.k ? T('Todos') : String(x.v || '').replace('@', ' · '), pend: false }); guarda('g-emer', EM); } else if (EM && (!x.id || x.id === '*' || x.id === EM.id || !EM.id)) { EM = null; guarda('g-emer', null); } pintaEm(); if (G.tab === 'directo') G.pintaT(); }
    else if (t === 'turno') { if (+x.t <= (+TU.t || 0)) return; TU.t = +x.t; if (x.reset) { TU.num = 0; TU.hist = []; } else { const k = +x.k || +String(x.n || '').replace(/^.*-/, '') || 0; TU.num = k; TU.hist = [{ n: x.n, p: x.p }].concat(Array.isArray(x.h) ? x.h : []).slice(0, 8); } guarda('g-turno', TU); window.ADVIVO && window.ADVIVO.pon('turno', x.reset ? { n: '', p: '', h: [], t: x.t } : x); const l = $('#tu-lcd'); if (l) l.textContent = numT(TU.num); }
    else if (t === 'datos' && lee('g-trae')) adopta(x);
    else if (t.indexOf('m/') === 0 && lee('g-trae') !== false && typeof x.d === 'string' && /^data:image\//.test(x.d)) { const k = t.slice(2); if (G.B.medios[k] !== x.d) { G.B.medios[k] = x.d; G.toca(); } } };
  /* al volver la conexión: lo que quedó pendiente (emergencia, retirada, listas) sale solo */
  X.alConecta = up => { if (!up) return; if (EM && EM.on && EM.pend) { const o = Object.assign({}, EM); delete o.dn; delete o.pend; if (publica('emergencia', o, true) === 'ok') { EM.pend = false; guarda('g-emer', EM); G.estado('⚠ ' + T('EMERGENCIA EN CURSO')); } }
    if (EMRET && publica('emergencia', EMRET, true) === 'ok') { EMRET = null; guarda('g-emret', null); } if (pendDatos) setTimeout(() => { if (pendDatos) mandaDatos(); }, 500); pintaEm(); };
  X.mandoBoton = () => `<div class="fila"><button type="button" class="tecla" data-a="mandoMovil">📱 ${T('Mando en el móvil')}</button></div>`;

  /* ================= TODAS LAS PANTALLAS ================= */
  /* v1.23 · una ventana con todas las pantallas (12, 30…): miniatura real de lo que sale, estado, «visto hace», lista, grupo y sede; las caídas primero */
  let vp = null, vpM = [];
  function vpPinta() { const m = $('#modal .m-caja'); if (!m || !vp) return; vpM.forEach(x => x.destruye()); vpM = []; const D = G.DSP, L = Object.keys(D).filter(i => !vp.f || (vp.f.k === 'g' ? D[i].g === vp.f.v : D[i].s === vp.f.v)), on = i => Date.now() - D[i].visto < 50000;
    L.sort((a, b) => (on(a) ? 1 : 0) - (on(b) ? 1 : 0) || D[a].n.localeCompare(D[b].n)); const gs = [...new Set(Object.keys(D).map(i => D[i].g).filter(Boolean))].sort(), ss = [...new Set(Object.keys(D).map(i => D[i].s).filter(Boolean))].sort();
    const est = d => T(!on(d.id) ? 'sin señal' : d.e ? 'EMERGENCIA' : d.off === 2 ? 'apagado' : d.off === 1 ? 'fuera de horario' : 'encendido'), cl = d => !on(d.id) ? 'no' : d.e ? 'emer' : d.off ? 'off' : 'si';
    G.pon('#modal .m-caja', X.cabModal(T('Todas las pantallas') + ' · ' + L.filter(on).length + '/' + L.length + ' ' + T('en línea')) + `<div class="vp"><div class="dchips">${tecla('vpF', '', T('Todos'), !vp.f, `<small>${Object.keys(D).length}</small>`)}${gs.map(g => tecla('vpF', 'g:' + g, esc(g), vp.f && vp.f.k === 'g' && vp.f.v === g, G.icD('g'))).join('')}${ss.map(x => tecla('vpF', 's:' + x, esc(x), vp.f && vp.f.k === 's' && vp.f.v === x, G.icD('s'))).join('')}</div>
      <div class="vp-rej">${L.map(i => { const d = Object.assign({ id: i }, D[i]); return `<button type="button" class="vp-c e-${cl(d)}" data-a="vpSel" data-v="${i}"><span class="vp-m${d.f === 'horizontal' ? ' hor' : ''}" data-i="${i}"></span><b>${esc(d.n)}</b><span class="vp-e"><i></i>${est(d)} · ${G.hace(d.visto)}</span><small>${esc((d.ln || d.l) + (d.g ? ' · ◫ ' + d.g : '') + (d.s ? ' · ⌂ ' + d.s : ''))}</small></button>`; }).join('')}</div></div>`);
    /* la miniatura: la escena que está saliendo (o la imagen), montada en pequeño */
    m.querySelectorAll('.vp-m').forEach(c => { const d = D[c.dataset.i], p = G.B.playlists[d.l], i = String(d.i || ''); if (/\.(webp|jpe?g|png|gif|avif)$/i.test(i)) { c.innerHTML = `<img src="${esc(G.urlAsset(i))}" alt="" loading="lazy">`; return; }
      const e = p && (p.escenas || []).find(x => String(x.n || '') === i || 'escena · ' + (x.n || x.id) === i) || (p && p.escenas && p.escenas[0]); if (e && window.ADESCENA && X.ctx) { const s = el('span'); c.appendChild(s); try { vpM.push(window.ADESCENA.monta(s, e, X.ctx({ red: false, mini: true }))); } catch (x) {} } else c.textContent = i.slice(0, 24) || '—'; }); }

  /* ================= informe de emisión (CSV) ================= */
  let inf = null;
  X.alInforme = (id, d) => { if (!inf || !d || typeof d !== 'object') return; inf.r[id] = d; };

  /* ================= acciones ================= */
  Object.assign(ACC, {
    vista(v) { const s = v === 'simple'; html.classList.toggle('md-simple', s); guarda('g-vista', s ? 'simple' : 'pro'); pintaSw(); G.repinta(); X.alLista && X.alLista(); },
    avisoRapido() { av = {}; X.abreModal('', 'm-av', () => { av = null; }); avPinta(); const i = $('#av-x'); i && i.focus(); },
    avTxt(v) { const p = AVP[+v]; if (p) { G.D.aviso = T(p[1]); if (+v === 3) G.D.hasta = '23:59'; avPinta(); } },   /* v1.37 · «Hoy cerrado» dura hasta el final del día */ avSeg(v) { G.D.seg = +v; G.D.hasta = ''; avPinta(); }, avCol(v) { G.D.color = v; avPinta(); },
    avEnvia() { if (!G.D.aviso.trim()) return; ACC.aviso(); X.cierraModal ? X.cierraModal() : ACC.modalCierra(); G.estado('✓ ' + T('Aviso enviado')); },   /* v1.33 */
    alMas() { if (al) { al.mas = !al.mas; alPinta(); } },   /* v1.32 */
    bvVe(v) { guarda('g-bv', 1); X.cierraModal ? X.cierraModal() : ACC.modalCierra(); if (v === 'as') ACC.asistente(); else if (v === 'tv') ACC.altaPantalla(); },   /* v1.25 · bienvenida */
    asistente() { as = { paso: 1, neg: '', f: 'vertical', nom: '' }; X.abreModal('', 'm-as', () => { as = null; }); asPinta(); },
    asNeg(v) { as.neg = v; as.f = ['cafe', 'rapida', 'oficina'].includes(v) ? 'horizontal' : 'vertical'; asPinta(); }, asFor(v) { as.f = v; asPinta(); }, asPaso(v) { as.paso = lim(as.paso + +v, 1, 3); asPinta(); }, asCrea() { asCrea(); },
    emergencia() { em = { pre: 'evac', x: T(PRESET[0][2]), k: 'todos', v: '', son: true, voz: true, tapa: false }; X.abreModal('', 'm-em', () => { em = null; }); emPinta(); },
    emPre(v) { const p = PRESET.find(x => x[0] === v); if (!p) return; em.pre = v; em.x = p[2] ? T(p[2]) : ''; emPinta(); const t = $('#em-x'); if (t && !p[2]) t.focus(); },
    emDest(v) { const i = v.indexOf(':'); em.k = v.slice(0, i); em.v = v.slice(i + 1); emPinta(); }, emSon() { em.son = !em.son; emPinta(); }, emVoz() { em.voz = !em.voz; emPinta(); },
    emTapa() { em.tapa = !em.tapa; emPinta(); const b = $('.emer-go'); b && !b.disabled && b.focus(); },
    emDispara() { if (!em || !em.tapa) return; const x = String(em.x || '').trim(); if (!x) { const t = $('#em-x'); t && t.focus(); return; }
      const o = { on: 1, id: 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), x: x.slice(0, 240), t: Date.now(), k: em.k, v: em.v, son: em.son ? 1 : 0, voz: em.voz ? 1 : 0, lang: G.lang }, r = publica('emergencia', o, true);
      EM = Object.assign({ dn: em.k === 'todos' ? T('Todos') : em.v, pend: r !== 'ok' && r !== 'sin' }, o); guarda('g-emer', EM); EMRET = null; guarda('g-emret', null);
      G.prevOrden(Object.assign({ t: 'emergencia' }, o)); ACC.modalCierra(); pintaEm(); G.estado(r === 'ok' ? '⚠ ' + T('EMERGENCIA EN CURSO') : r === 'red' ? '⚠ ' + T('NO ENVIADA · reintentando') : T('Sin directo: la emergencia solo se ve en el lienzo. Activa el directo para mandarla a las pantallas.')); },
    emRetira() { const o = { on: 0, t: Date.now(), id: EM && EM.id ? EM.id : '*' }, r = publica('emergencia', o, true); if (r === 'red') { EMRET = o; guarda('g-emret', o); } G.prevOrden({ t: 'emergencia', on: 0 }); EM = null; guarda('g-emer', null); pintaEm(); G.estado(T('Emergencia retirada') + (r === 'red' ? ' · ' + T('Sin conexión: se enviará al volver.') : '')); },
    /* ✓ ENVIAR CAMBIOS: cada pantalla sigue con su lista */
    enviar() { if (!G.canal) { G.estado(T('Primero conecta una pantalla con «+ Añadir pantalla».')); ACC.altaPantalla(); return; } const r = mandaDatos(); if (G.puedePublicar) ACC.guarda(); G.estado(r === 'ok' ? T('Enviado') : r === 'red' ? T('Sin conexión: se enviará al volver.') : r === 'grande' ? T('Las listas son demasiado grandes para el directo: publica playlists.json.') : ''); },
    aPantallas() { const h = new Date(); ap = { l: G.listasVis().includes(G.sel) ? G.sel : G.listasVis()[0], k: G.dest.k === 'todos' ? '' : G.dest.k, v: G.dest.v, c: 'ahora', min: 30, casa: false, seguro: false, f: h.getFullYear() + '-' + String(h.getMonth() + 1).padStart(2, '0') + '-' + String(h.getDate()).padStart(2, '0'), h: String(h.getHours() + 1 > 23 ? 23 : h.getHours() + 1).padStart(2, '0') + ':00' }; X.abreModal('', 'm-ap', () => { ap = null; }); apPinta(); },
    apL(v) { ap.l = v; ap.seguro = false; apPinta(); }, apD(v) { const i = v.indexOf(':'); ap.k = v.slice(0, i); ap.v = v.slice(i + 1); ap.seguro = false; apPinta(); }, apC(v) { ap.c = v; apPinta(); }, apMin(v) { ap.min = lim(ap.min + v * (ap.min >= 60 ? 15 : 5), 5, 720); apPinta(); }, apCasa() { ap.casa = !ap.casa; apPinta(); },
    apCanal() { ACC.canalNuevo(); apPinta(); },
    apVa() { if (!ap || !G.B.playlists[ap.l] || !ap.k) return; const n = deDest(ap.k, ap.v).length; if (ap.k === 'todos' && n > 1 && ap.c !== 'desde' && !ap.seguro) { ap.seguro = true; apPinta(); return; }
      const msg = t => { const e = $('#ap-msg'); if (e) e.textContent = t; G.estado(t); }; let txt = '';
      if (ap.c === 'desde') { const r = { id: 'r' + Date.now().toString(36), lista: ap.l, desde: ap.f || '', hasta: '', dias: [1, 2, 3, 4, 5, 6, 7], hIni: '', hFin: '', ini: (ap.f || '') + 'T' + (ap.h || '00:00'), k: ap.k, v: ap.v }; G.B.agenda.push(r); G.toca(); G.pintaL(); txt = T('Programado') + ' · ' + nombreL(ap.l) + ' · ' + G.fechaTxt(ap.f) + ' ' + (ap.h || ''); }
      if (G.canal) { const rd = mandaDatos(); if (ap.c !== 'desde') { const o = { t: 'lista', id: ap.l, ot: Date.now() }; if (ap.c === 'durante') o.hasta = Date.now() + ap.min * 60000; else if (ap.casa) o.casa = 1; const r = publica(temaDe(ap.k, ap.v), o, true); G.prevOrden(o);
        txt = (r === 'ok' ? T('Enviado') : T('Sin conexión: se enviará al volver.')) + ' · ' + nombreL(ap.l) + ' → ' + nomDest(ap.k, ap.v) + ' (' + n + ')' + (ap.c === 'durante' ? ' · ' + ap.min + ' min' : ''); } else if (rd !== 'ok') txt += ' · ' + T('Sin conexión: se enviará al volver.'); }
      else if (ap.c !== 'desde') txt = T('Sin directo, las pantallas solo cambian al publicar playlists.json. Activa el directo y llegará todo al momento.');
      if (G.puedePublicar) ACC.guarda(); ap.seguro = false; apPinta(); msg(txt || ''); },
    altaPantalla(cod) { const ant = lee('g-alta') || {}; al = { n: '', g: ant.g || '', s: ant.s || '', et: ant.et || '', l: G.listasVis().includes(G.sel) ? G.sel : G.listasVis()[0], rot: G.giro || 0, lang: G.lang, cod: typeof cod === 'string' ? cod : '', msg: '', px: false, ox: 0, oy: 0 }; X.abreModal('', 'm-alta', () => { if (al) guarda('g-alta', { g: al.g, s: al.s, et: al.et }); al = null; }); alPinta(); },
    alL(v) { al.l = v; alPinta(); }, alRot(v) { al.rot = +v; alPinta(); }, alLang(v) { al.lang = v; alPinta(); }, alEmpareja() { empareja(); }, alPx() { al.px = !al.px; alPinta(); },
    alCopia() { const u = $('#al-url').textContent; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => G.estado(T('Copiada')), () => {}); },
    tuPaso(v) { TU.num = Math.max(0, TU.num + +v); guarda('g-turno', TU); const l = $('#tu-lcd'); if (l) l.textContent = numT(TU.num); },
    tuPuesto(v) { TU.p = +v; guarda('g-turno', TU); G.pintaT(); }, tuVoz() { TU.voz = !TU.voz; guarda('g-turno', TU); G.pintaT(); },
    tuLlama() { TU.num++; mandaTurno(false); }, tuRepite() { mandaTurno(true); },
    tuCero() { const b = $('[data-a="tuCero"]'); if (b && !b.dataset.seguro) { b.dataset.seguro = '1'; b.textContent = T('¿Seguro? A cero'); setTimeout(() => { if (b.isConnected) { delete b.dataset.seguro; b.textContent = T('Empezar de 0'); } }, 3000); return; }
      TU.num = 0; TU.hist = []; TU.t = Date.now(); guarda('g-turno', TU); const m = { reset: 1, n: '', p: '', h: [], k: 0, t: TU.t }; window.ADVIVO && window.ADVIVO.pon('turno', { n: '', p: '', h: [], t: TU.t }); publica('turno', m, true); G.estado(T('Turnos a cero')); G.pintaT(); },
    peTecla(v) { if (v === '⌫') PE.lcd = PE.lcd.slice(0, -1); else if (v === '✓') { const n = PE.lcd.trim(); if (n && !PE.prep.includes(n)) { peGuarda(); PE.prep.push(n); } PE.lcd = ''; mandaPedidos(); return; } else if (PE.lcd.length < 4) PE.lcd += v; const l = $('#pe-lcd'); if (l) l.textContent = PE.lcd || '—'; },
    peListo(v) { peGuarda(); PE.prep = PE.prep.filter(n => n !== v); PE.listos = PE.listos.filter(x => x[0] !== v); PE.listos.unshift([v, Date.now()]); mandaPedidos(); },
    peDeshaz() { const u = PEH.pop(); if (!u) return; const o = JSON.parse(u); PE.prep = o.prep; PE.listos = o.listos; mandaPedidos(); },
    peQuita(v) { peGuarda(); PE.listos = PE.listos.filter(x => x[0] !== v); mandaPedidos(); }, peLimpia() { peGuarda(); PE.prep = []; PE.listos = []; PE.lcd = ''; mandaPedidos(); }, peCad(v) { PE.cad = lim(PE.cad + +v, 1, 60); mandaPedidos(); },
    fmPre(v) { const [w, h] = v.split('x').map(Number); fm.w = w; fm.h = h; fmPinta(); },
    fmPon() { const w = lim(Math.round(fm.w), 64, 8192), h = lim(Math.round(fm.h), 64, 8192); X.antes && X.antes(); G.cambia(p => { p.medida = { w, h }; p.formato = w >= h ? 'horizontal' : 'vertical'; }); ACC.modalCierra(); X.alLista && X.alLista(); },
    fmQuita() { G.cambia(p => { delete p.medida; }); ACC.modalCierra(); X.alLista && X.alLista(); },
    avisos() { const on = !(G.lee('g-avisos') !== false); guarda('g-avisos', on); if (on && window.Notification && Notification.permission === 'default') try { Notification.requestPermission(); } catch (e) {} G.estado(T(on ? 'Avisos de desconexión activados' : 'Avisos de desconexión desactivados')); G.pintaD(); },
    /* informe CSV: con grupo, sede y lista, y una fila «sin datos» por cada pantalla que no ha respondido */
    informe() { if (!G.canal || !G.dir || !G.dir.up) { G.estado(T('Sin directo: se ve solo en el lienzo')); return; } inf = { r: {} }; G.dir.pub('orden/todos', { t: 'informe' }); G.estado(T('Pidiendo el informe a las pantallas…'));
      setTimeout(() => { const R = inf.r, ids = Object.keys(R); inf = null; if (!ids.length) { G.estado(T('Ninguna pantalla ha respondido.')); return; } const f = [['display', 'nombre', 'grupo', 'sede', 'lista', 'fecha', 'elemento', 'veces', 'segundos']];
        ids.forEach(i => { const d = R[i], x = G.DSP[i] || {}; Object.keys(d).sort().forEach(dia => Object.keys(d[dia] || {}).forEach(k => { const v = d[dia][k]; f.push([i, x.n || i, x.g || '', x.s || '', x.l || '', dia, k, v[0] || 0, Math.round(v[1] || 0)]); })); });
        Object.keys(G.DSP).filter(i => !R[i]).forEach(i => { const x = G.DSP[i]; f.push([i, x.n || i, x.g || '', x.s || '', x.l || '', '', T('sin datos'), '', '']); });
        const csv = f.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(';')).join('\r\n'), a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })); a.download = 'adposter-emision.csv'; document.body.appendChild(a); a.click(); a.remove(); G.estado(T('Informe de {n} pantallas descargado').replace('{n}', ids.length)); }, 6000); },
    mandoMovil() { if (!G.canal) return; const u = urlUnir(); X.abreModal(X.cabModal('📱 ' + T('Mando en el móvil')) + `<div class="mm-qr"><div class="alta-qr">${qrSvg(u)}</div><div class="nota">${T('Escanea este código con el móvil: se abre el mando unido a tus pantallas, con tus listas, turnos, pedidos y avisos.')}</div><div class="lcd url" id="mm-url">${esc(u)}</div><div class="fila"><button type="button" class="tecla" data-a="mmCopia">${T('Copiar')}</button></div><div class="nota mal">${T('Quien tenga este código puede mandar a tus pantallas: compártelo solo con tu equipo.')}</div></div>`, 'm-mm'); },
    mmCopia() { const u = urlUnir(); (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => G.estado(T('Copiada')), () => {}); },
    unirCanal(c) { un = { c: typeof c === 'string' ? c : '', fijo: typeof c === 'string' && !!c, msg: '' }; X.abreModal('', 'm-un', () => { un = null; }); unPinta(); },
    unVa() { const c = sacaCanal(un && un.c); if (!c) { un.msg = T('Ese enlace o código no vale.'); unPinta(); return; } guarda('g-canal', c); guarda('g-enarchivo', null); guarda('g-trae', true); guarda('g-vm', 'mando'); const u = new URL(location.href); u.searchParams.delete('unir'); location.replace(u.href); },
    pantallas() { vp = { f: null }; X.abreModal('', 'm-vp', () => { vpM.forEach(x => x.destruye()); vpM = []; vp = null; }); vpPinta(); },
    vpF(v) { if (!vp) return; const i = v.indexOf(':'); vp.f = v ? { k: v.slice(0, i), v: v.slice(i + 1) } : null; vpPinta(); },
    vpSel(i) { ACC.modalCierra(); G.fijaDest('d', i); if (innerWidth <= 900) ponVm('mando'); else ACC.tab('directo'); },
    vm(v) { ponVm(v); }
  });
  X.directoMas = directoMas;
  X.formatoMedida = () => { const p = G.P(), m = p.medida || { w: 1500, h: 1000 }; fm = { w: m.w, h: m.h, c: 3, f: 2, pw: 500, ph: 500 }; X.abreModal('', 'm-fm', () => { fm = null; }); fmPinta(); };
  /* la ventana de todas las pantallas se refresca sola mientras está abierta */
  setInterval(() => { if (vp && !$('#modal').hidden) vpPinta(); }, 10000);

  /* ================= móvil: una sola ventana cada vez, con la barra de abajo ================= */
  const nav = el('nav'); nav.id = 'nav-m'; nav.setAttribute('aria-label', 'ADPOSTER'); document.body.appendChild(nav);
  let vm = lee('g-vm') || 'listas';
  function ponVm(v) { vm = ['listas', 'lienzo', 'ajustes', 'mando'].includes(v) ? v : 'listas'; guarda('g-vm', vm); html.dataset.vm = vm; if (vm === 'mando' && G.tab !== 'directo') ACC.tab('directo'); pintaNav(); scrollTo(0, 0); G.ajusta(); }
  function pintaNav() { nav.innerHTML = [['listas', 'Listas', '☰'], ['lienzo', 'Editar', '▣'], ['ajustes', 'Ajustes', '⚙'], ['mando', 'Avisos', '◉']].map(([k, t, i]) => `<button type="button" class="nv${vm === k ? ' on' : ''}" data-a="vm" data-v="${k}" aria-pressed="${vm === k}"><b>${i}</b><span>${T(t)}</span></button>`).join(''); }
  html.dataset.vm = vm;
  /* al tocar una lista en el móvil se pasa al lienzo para verla (no al crear una nueva) */
  let tocaLista = false; document.addEventListener('click', e => { tocaLista = !!(e.target.closest && e.target.closest('#zona-listas [data-a="sel"]')); }, true);
  const selV = ACC.sel; ACC.sel = v => { selV(v); if (innerWidth <= 900 && vm === 'listas' && tocaLista) { tocaLista = false; ponVm('lienzo'); } };

  /* ✓ ENVIAR CAMBIOS y ▶ A PANTALLAS, siempre a la vista bajo el lienzo (en el móvil, encima de la barra de abajo en todas las vistas) */
  const bEnv = el('button', 'tecla pri bt-env'); bEnv.type = 'button'; bEnv.dataset.a = 'enviar'; bEnv.title = T('Manda tus cambios a todas las pantallas; cada una sigue con su lista.');
  const bAp = el('button', 'tecla bt-ap'); bAp.type = 'button'; bAp.dataset.a = 'aPantallas'; const bots = el('div', 'bots-env'); bots.append(bEnv, bAp); $('#estado').prepend(bots);
  /* en el móvil la barra de envío vive fuera del lienzo (así se ve en LISTAS, AJUSTES y MANDO); en escritorio vuelve bajo el lienzo */
  const mq = matchMedia('(max-width: 900px)'), colocaEst = () => { const e = $('#estado'), z = $('.lienzo-zona'); if (!e || !z) return; if (mq.matches) { if (e.parentNode !== document.body) document.body.appendChild(e); } else if (e.parentNode !== z) z.appendChild(e); };
  try { mq.addEventListener('change', colocaEst); } catch (e) { mq.addListener(colocaEst); } colocaEst();
  /* ================= arranque y repintados ================= */
  const pinta = () => { pintaSw(); pintaEm(); pintaNav(); bAv.innerHTML = `<span>${T('Aviso')}</span>`; bAv.title = T('Mandar un aviso a las pantallas'); bAv.setAttribute('aria-label', bAv.title); bEnv.textContent = '✓ ' + T('Publicar'); bEnv.title = T('Manda tus cambios a todas las pantallas; cada una sigue con su lista.'); bAp.textContent = '▾'; bAp.title = T('Poner otra lista un rato o desde una fecha'); bAp.setAttribute('aria-label', bAp.title); };   /* v1.27 · un solo botón PUBLICAR y, al lado, ▾ para lo demás */
  if (window.AVCREDITO) window.AVCREDITO.alCambiar(pinta);
  const idV = ACC.idioma; ACC.idioma = () => { idV(); pinta(); };
  const vistaV = ACC.vista; ACC.vista = v => { vistaV(v); pinta(); };
  pinta();
  { const t = setInterval(() => { if (G.B) { clearInterval(t); if (vm === 'mando' && G.tab !== 'directo') ACC.tab('directo'); } }, 200); }
  /* ?alta=CÓDIGO (lo abre el QR que enseña una pantalla nueva): se abre «Añadir pantalla» con el código puesto. ?unir=CANAL (el QR del mando): unirse a las pantallas */
  const qs = new URLSearchParams(location.search), cod = qs.get('alta'), uni = qs.get('unir');
  if (cod && /^[a-z0-9]{6}$/i.test(cod)) { const t = setInterval(() => { if (G.B) { clearInterval(t); ACC.altaPantalla(cod.toUpperCase()); } }, 300); }
  else if (uni && window.ADDIRECTO && window.ADDIRECTO.canalOk(uni)) { const t = setInterval(() => { if (G.B) { clearInterval(t); if (G.canal === uni) { const u = new URL(location.href); u.searchParams.delete('unir'); history.replaceState(null, '', u.href); ponVm('mando'); } else ACC.unirCanal(uni); } }, 300); }
  /* v1.25 · BIENVENIDA: en SIMPLE, la primera vez y sin listas propias, tres caminos claros en lugar de abrir el editor de un ejemplo */
  function bienvenida() {
    const c = (v, t, d) => `<button type="button" class="tecla bv-t" data-a="bvVe" data-v="${v}"><b>${T(t)}</b><small>${T(d)}</small></button>`;
    X.abreModal('', 'm-bv', () => guarda('g-bv', 1));
    G.pon('#modal .m-caja', X.cabModal(T('Te damos la bienvenida a ADPOSTER')) + `<div class="bv"><p class="nota">${T('Convierte cualquier tele en un cartel digital. ¿Por dónde empezamos?')}</p><div class="bv-rej">`
      + c('as', 'Crear mis carteles', 'Eliges tu negocio y te dejo la pantalla hecha: solo cambias textos y fotos.')
      + c('tv', 'Conectar mi tele', 'Abres una dirección en la tele, sale un código y lo escribes aquí.')
      + c('ej', 'Ver un ejemplo', 'Mira las listas de muestra y prueba sin miedo: no salen en ninguna pantalla.')
      + `</div><p class="nota">${T('Lo tienes siempre a mano: ASISTENTE en LISTAS y «+ Añadir pantalla» en PANTALLAS.')}</p></div>`); }
  Object.assign(TX, { 'Te damos la bienvenida a ADPOSTER': ['Welcome to ADPOSTER', 'Et donem la benvinguda a ADPOSTER'], 'Convierte cualquier tele en un cartel digital. ¿Por dónde empezamos?': ['Turn any TV into a digital sign. Where shall we start?', 'Converteix qualsevol tele en un cartell digital. Per on comencem?'],
    'Crear mis carteles': ['Create my signs', 'Crea els meus cartells'], 'Eliges tu negocio y te dejo la pantalla hecha: solo cambias textos y fotos.': ['Pick your business and I leave the screen ready: you just change texts and photos.', 'Tries el teu negoci i et deixo la pantalla feta: només canvies textos i fotos.'],
    'Conectar mi tele': ['Connect my TV', 'Connecta la meva tele'], 'Abres una dirección en la tele, sale un código y lo escribes aquí.': ['Open an address on the TV, a code shows up and you type it here.', 'Obres una adreça a la tele, surt un codi i l’escrius aquí.'],
    'Ver un ejemplo': ['See an example', 'Mira un exemple'], 'Mira las listas de muestra y prueba sin miedo: no salen en ninguna pantalla.': ['Look at the sample lists and try things freely: they don’t show on any screen.', 'Mira les llistes de mostra i prova sense por: no surten a cap pantalla.'],
    'Lo tienes siempre a mano: ASISTENTE en LISTAS y «+ Añadir pantalla» en PANTALLAS.': ['Always at hand: WIZARD in LISTS and “+ Add screen” in SCREENS.', 'Sempre a mà: ASSISTENT a LLISTES i «+ Afegeix una pantalla» a PANTALLES.'] });
  if (vistaIni === 'simple' && !lee('g-bv') && !cod && !uni) { const t = setInterval(() => { if (!G.B) return; clearInterval(t); if (Object.keys(G.B.playlists).every(G.esDemo) && !document.querySelector('#modal.abierto, #modal:not([hidden]) .m-caja:not(:empty)')) bienvenida(); else guarda('g-bv', 1); }, 300); }
  window.ADPANT = { mandaDatos, datosVivo, TU, PE, get EM() { return EM; } };
})();
