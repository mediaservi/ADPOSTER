/* ADPOSTER · plantillas de composición: puntos de partida ya maquetados, en vertical y en horizontal, que luego se retocan pieza a pieza.
   Todas son diseños propios hechos con las piezas del editor (textos, formas, zonas, reloj, el tiempo, noticias, QR): no llevan fotos ni marcas de nadie.
   window.ADPLANT = { CATS, lista, haz(id, hor, lang) → escena lista para añadir a una lista }
   Licencia GPL-3.0 · mediaservi.com */
(() => {
  'use strict';
  const CATS = [['hosteleria', ['Hostelería', 'Food & drink', 'Hostaleria']], ['comercio', ['Comercio', 'Retail', 'Comerç']], ['eventos', ['Eventos', 'Events', 'Esdeveniments']], ['empresa', ['Empresa', 'Workplace', 'Empresa']], ['info', ['Información', 'Information', 'Informació']], ['redes', ['QR y redes', 'QR & social', 'QR i xarxes']], ['medios', ['Fotos y carteles', 'Photos & posters', 'Fotos i cartells']]];
  let H = false, LG = 'es';
  const L = (es, en, ca) => LG === 'en' ? en : LG === 'ca' ? (ca == null ? es : ca) : es;
  const R = (h, v) => H ? h : v;                                            // [x, y, w, h] en horizontal o en vertical
  const pz = (t, r, o) => Object.assign({ t, x: r[0], y: r[1], w: r[2], h: r[3] }, o);
  const tx = (s, r, o) => pz('texto', r, Object.assign({ tx: s, fam: 'Inter', peso: 800, col: '#ffffff', ali: 'cen', val: 'cen', auto: true }, o));
  const tf = (s, r, tam, o) => tx(s, r, Object.assign({ auto: false, tam }, o));     // letra de tamaño fijo: para columnas que deben ir iguales
  const fo = (r, c, o) => pz('forma', r, Object.assign({ f: 'rect', col: c }, o));
  const ci = (r, c, o) => pz('forma', r, Object.assign({ f: 'elipse', col: c }, o));
  const zn = (r, o) => pz('zona', r, Object.assign({ carp: ['demo-carteles'], seg: 8, aj: 'contener' }, o));
  const rj = (r, o) => pz('reloj', r, Object.assign({ est: 'digital', fam: 'Inter', col: '#ffffff' }, o));
  const fe = (r, fmt, o) => pz('fecha', r, Object.assign({ fmt, fam: 'Inter', col: '#ffffff', may: true }, o));
  const ti = (r, o) => pz('tiempo', r, Object.assign({ lat: 41.39, lon: 2.17, lugar: 'Barcelona', dias: true, col: '#ffffff', fam: 'Inter' }, o));
  const rs = (r, o) => pz('rss', r, Object.assign({ url: '', modo: 'cinta', n: 4, fam: 'Inter', col: '#ffffff', tam: 3 }, o));
  const qr = (r, u, o) => pz('qr', r, Object.assign({ url: u || '', col: '#000000', cfondo: '#ffffff', radio: 1.5 }, o));
  /* un cuadrado centrado en (cx, cy) con lado «l» en centésimas del lado corto */
  const cu = (cx, cy, l) => H ? [cx - l * 9 / 32, cy - l / 2, l * 9 / 16, l] : [cx - l / 2, cy - l * 9 / 32, l, l * 9 / 16];

  const P = [
    /* ---------------- hostelería ---------------- */
    ['menu-dia', 'hosteleria', ['Menú del día', 'Menu of the day', 'Menú del dia'], () => ({ fondo: { t: 'malla', c: '#0f2a22', c2: '#1f5a43', c3: '#0b3a4a', tr: 'vineta' }, piezas: [
      fo(R([6, 8, .5, 84], [8, 5, 84, .28]), '#e9c46a'),
      tx(L('MENÚ\nDEL DÍA', 'MENU\nOF THE DAY', 'MENÚ\nDEL DIA'), R([9, 10, 34, 34], [10, 7, 80, 15]), { fam: 'Playfair Display', col: '#f6e7c1', ali: R('izq', 'cen'), lh: 1, an: 'sube' }),
      fe(R([9, 46, 34, 6], [20, 23, 60, 3]), 'larga', { fam: 'Montserrat', col: '#e9c46a', an: 'aparece', ret: .2 }),
      tf(L('PRIMEROS', 'STARTERS', 'PRIMERS') + '\n' + L('Ensalada templada de temporada\nCrema de calabaza asada', 'Warm seasonal salad\nRoast pumpkin soup', 'Amanida tèbia de temporada\nCrema de carbassa rostida') + '\n\n' + L('SEGUNDOS', 'MAINS', 'SEGONS') + '\n' + L('Arroz meloso de verduras\nMerluza a la plancha con limón', 'Creamy vegetable rice\nGrilled hake with lemon', 'Arròs melós de verdures\nLluç a la planxa amb llimona') + '\n\n' + L('POSTRES', 'DESSERTS', 'POSTRES') + '\n' + L('Tarta de queso casera\nFruta del día', 'Homemade cheesecake\nFruit of the day', 'Pastís de formatge casolà\nFruita del dia'),
        R([50, 10, 46, 80], [8, 29, 84, 44]), R(4.3, 4.3), { fam: 'Montserrat', peso: 400, col: '#f3f0e6', ali: R('izq', 'cen'), val: R('cen', 'arr'), lh: R(1.45, 1.6), an: 'aparece', ret: .4 }),
      ci(cu(R(22, 50), R(74, 86), R(34, 36)), '#e9c46a', { an: 'zoom', ret: .6 }),
      tx('12,90 €', R([14.5, 64, 15, 13], [36, 81.5, 28, 5.6]), { fam: 'Playfair Display', col: '#0f2a22', an: 'zoom', ret: .6 }),
      tx(L('PAN, BEBIDA\nY CAFÉ', 'BREAD, DRINK\n& COFFEE', 'PA, BEGUDA\nI CAFÈ'), R([15.5, 77, 13, 8], [38, 87.4, 24, 3.6]), { fam: 'Montserrat', col: '#0f2a22', an: 'zoom', ret: .6 }) ] })],

    ['pizarra', 'hosteleria', ['Pizarra', 'Chalkboard', 'Pissarra'], () => ({ fondo: { t: 'malla', c: '#1b1d1c', c2: '#2a302d', c3: '#232826', tr: 'vineta' }, piezas: [
      fo(R([3, 5, 94, 90], [5, 3, 90, 94]), '#00000000', { borde: .5, bcol: '#f4f1e8', radio: 2, o: .85 }),
      tx(L('Hoy recomendamos', 'Today we recommend', 'Avui recomanem'), R([10, 9, 80, 20], [10, 7, 80, 12]), { fam: 'Caveat', col: '#ffe9a8', r: -2, an: 'aparece' }),
      fo(R([30, 30, 40, .6], [25, 20.5, 50, .3]), '#ffe9a8', { r: -2 }),
      tf(L('Tostada de aguacate y huevo\nCroquetas caseras de jamón\nBurrata con tomate y albahaca\nTortilla de patatas recién hecha\nTarta de zanahoria', 'Avocado & egg toast\nHomemade ham croquettes\nBurrata with tomato & basil\nFreshly made potato omelette\nCarrot cake', 'Torrada d’alvocat i ou\nCroquetes casolanes de pernil\nBurrata amb tomàquet i alfàbrega\nTruita de patates acabada de fer\nPastís de pastanaga'), R([10, 36, 58, 52], [10, 26, 64, 56]), R(5.6, 5.8), { fam: 'Caveat', col: '#f4f1e8', ali: 'izq', val: 'arr', lh: R(1.5, 2.7), an: 'aparece', ret: .3 }),
      tf('6,50\n8,00\n9,50\n4,00\n4,50', R([70, 36, 20, 52], [72, 26, 18, 56]), R(5.6, 5.8), { fam: 'Caveat', col: '#ffe9a8', ali: 'der', val: 'arr', lh: R(1.5, 2.7), an: 'aparece', ret: .3 }),
      tx(L('¡Buen provecho!', 'Enjoy your meal!', 'Bon profit!'), R([56, 80, 36, 12], [30, 86, 60, 7]), { fam: 'Caveat', col: '#9fe0c0', r: -4, an: 'aparece', ret: .6 }) ] })],

    ['happy-hour', 'hosteleria', ['Happy hour', 'Happy hour', 'Happy hour'], () => ({ fondo: { t: 'deg', c: '#ff2d75', c2: '#ff9d2e', a: 150, tr: 'puntos' }, piezas: [
      ci(cu(R(82, 82), R(22, 12), R(60, 60)), '#ffffff', { o: .12 }), ci(cu(R(12, 10), R(88, 92), R(46, 46)), '#3a0ca3', { o: .25 }),
      tx('HAPPY', R([8, 8, 60, 34], [8, 12, 84, 17]), { fam: 'Anton', ali: 'izq', an: 'izquierda' }),
      tx('HOUR', R([8, 38, 60, 34], [8, 27, 84, 17]), { fam: 'Anton', col: '#2b0a3d', ali: 'izq', an: 'izquierda', ret: .15 }),
      fo(R([-4, 74, 108, 16], [-10, 50, 120, 9]), '#2b0a3d', { r: -4 }),
      tx(L('2 × 1 EN CÓCTELES', '2 FOR 1 ON COCKTAILS', '2 × 1 EN CÒCTELS'), R([4, 75.5, 92, 13], [2, 51.2, 96, 6.6]), { fam: 'Bebas Neue', col: '#ffe14d', r: -4, an: 'zoom', ret: .4 }),
      tx('18:00 – 20:00', R([62, 30, 34, 20], [14, 64, 72, 9]), { fam: 'Bebas Neue', an: 'aparece', ret: .5 }),
      tx(L('DE LUNES A JUEVES', 'MONDAY TO THURSDAY', 'DE DILLUNS A DIJOUS'), R([62, 50, 34, 7], [20, 74, 60, 3.4]), { fam: 'Montserrat', an: 'aparece', ret: .6 }) ] })],

    ['cafeteria', 'hosteleria', ['Cafetería', 'Coffee shop', 'Cafeteria'], () => ({ fondo: { t: 'color', c: '#efe3d0' }, piezas: [
      fo(R([0, 0, 38, 100], [0, 0, 100, 30]), '#3b2518'),
      tx(L('Café\n& desayunos', 'Coffee\n& breakfast', 'Cafè\n& esmorzars'), R([4, 22, 30, 36], [10, 6, 80, 16]), { fam: 'Abril Fatface', col: '#efe3d0', lh: 1.02, an: 'aparece' }),
      tx(L('HASTA LAS 12:00', 'UNTIL 12:00', 'FINS A LES 12:00'), R([8, 62, 22, 5], [28, 23.4, 44, 2.6]), { fam: 'Montserrat', col: '#d9a15b', esp: .18 }),
      tf(L('Espresso\nCortado\nCafé con leche\nCapuchino\nTé o infusión\nZumo natural\nTostada con tomate\nCruasán de mantequilla', 'Espresso\nCortado\nCaffè latte\nCappuccino\nTea or infusion\nFresh juice\nTomato toast\nButter croissant', 'Espresso\nTallat\nCafè amb llet\nCaputxino\nTe o infusió\nSuc natural\nTorrada amb tomàquet\nCroissant de mantega'), R([44, 12, 34, 76], [10, 34, 62, 60]), R(4.6, 4.3), { fam: 'Montserrat', peso: 400, col: '#3b2518', ali: 'izq', val: 'cen', lh: R(1.7, 2.8), an: 'aparece', ret: .2 }),
      tf('1,40\n1,50\n1,70\n2,20\n1,80\n3,00\n2,50\n1,90', R([78, 12, 16, 76], [72, 34, 18, 60]), R(4.6, 4.3), { fam: 'Montserrat', col: '#b0672a', ali: 'der', val: 'cen', lh: R(1.7, 2.8), an: 'aparece', ret: .2 }) ] })],

    ['especialidad', 'hosteleria', ['Especialidad de la casa', 'House speciality', 'Especialitat de la casa'], () => ({ fondo: { t: 'color', c: '#141414' }, piezas: [
      zn(R([0, 0, 56, 100], [0, 0, 100, 58]), { aj: 'cubrir' }),
      fo(R([54, 0, 2, 100], [0, 57, 100, 1.1]), '#e63946'),
      tx(L('ESPECIALIDAD\nDE LA CASA', 'HOUSE\nSPECIALITY', 'ESPECIALITAT\nDE LA CASA'), R([60, 12, 36, 28], [8, 62, 84, 12]), { fam: 'Oswald', ali: 'izq', lh: 1.05, an: 'derecha' }),
      tx(L('Hecho al momento, con producto de aquí y mucho mimo.', 'Made to order, with local produce and a lot of care.', 'Fet al moment, amb producte d’aquí i molta cura.'), R([60, 44, 34, 22], [8, 76, 84, 8]), { fam: 'Montserrat', peso: 400, col: '#d7d7d7', ali: 'izq', val: 'arr', an: 'aparece', ret: .3 }),
      tx('14,50 €', R([60, 70, 22, 16], [8, 86, 44, 8]), { fam: 'Oswald', col: '#e63946', ali: 'izq', an: 'zoom', ret: .5 }) ] })],

    /* ---------------- comercio ---------------- */
    ['oferta', 'comercio', ['Oferta', 'Special offer', 'Oferta'], () => ({ fondo: { t: 'deg', c: '#d00000', c2: '#7a0010', a: 160, tr: 'lineas' }, piezas: [
      tx(L('SOLO ESTA SEMANA', 'THIS WEEK ONLY', 'NOMÉS AQUESTA SETMANA'), R([8, 8, 60, 10], [10, 8, 80, 5]), { fam: 'Montserrat', ali: R('izq', 'cen'), esp: .12, an: 'aparece' }),
      tx('−30 %', R([5, 18, 60, 56], [6, 16, 88, 30]), { fam: 'Anton', col: '#ffe14d', stx: true, an: 'zoom', ret: .1 }),
      fo(R([-4, 76, 108, 15], [-10, 52, 120, 9]), '#ffe14d', { r: -3 }),
      tx(L('EN TODA LA TIENDA', 'STOREWIDE', 'A TOTA LA BOTIGA'), R([6, 77.5, 88, 12], [4, 53.2, 92, 6.6]), { fam: 'Bebas Neue', col: '#7a0010', r: -3, an: 'aparece', ret: .4 }),
      tx(L('Hasta agotar existencias.\nNo acumulable a otras promociones.', 'While stocks last.\nCannot be combined with other offers.', 'Fins a exhaurir existències.\nNo acumulable a altres promocions.'), R([69, 30, 27, 28], [16, 70, 68, 9]), { fam: 'Montserrat', peso: 400, an: 'aparece', ret: .6 }) ] })],

    ['rebajas', 'comercio', ['Rebajas', 'Sale', 'Rebaixes'], () => ({ fondo: { t: 'color', c: '#ffd60a' }, piezas: [
      fo(R([-10, 62, 120, 60], [-20, 58, 140, 60]), '#111111', { r: -8 }),
      tx(L('REBAJAS', 'SALE', 'REBAIXES'), R([4, 4, 92, 52], [4, 10, 92, 28]), { fam: 'League Gothic', col: '#111111', an: 'baja' }),
      tx(L('HASTA', 'UP TO', 'FINS AL'), R([10, 74, 16, 8], [12, 68, 30, 4]), { fam: 'Montserrat', col: '#ffd60a', ali: 'izq', r: -8, an: 'aparece', ret: .3 }),
      tx('50 %', R([28, 60, 40, 34], [14, 70, 72, 18]), { fam: 'League Gothic', col: '#ffffff', r: -8, an: 'zoom', ret: .3 }),
      tx(L('en artículos seleccionados', 'on selected items', 'en articles seleccionats'), R([62, 84, 34, 7], [20, 91, 70, 3.6]), { fam: 'Montserrat', peso: 400, col: '#ffd60a', ali: 'der', an: 'aparece', ret: .5 }) ] })],

    ['novedad', 'comercio', ['Novedad', 'New arrival', 'Novetat'], () => ({ fondo: { t: 'color', c: '#f4f4f1' }, piezas: [
      zn(R([6, 10, 44, 80], [10, 8, 80, 46]), { aj: 'contener', sombra: true, radio: 1.5 }),
      fo(R([56, 14, 16, 8], [10, 58, 30, 4.5]), '#111111', { radio: 5 }),
      tx(L('NUEVO', 'NEW', 'NOU'), R([57, 15.5, 14, 5], [12, 58.8, 26, 2.9]), { fam: 'Montserrat', esp: .2 }),
      tx(L('Nombre del producto', 'Product name', 'Nom del producte'), R([56, 26, 38, 22], [10, 64, 80, 10]), { fam: 'Playfair Display', col: '#111111', ali: 'izq', val: 'arr', an: 'sube' }),
      tx(L('Una frase corta que cuente por qué merece la pena.', 'One short line that tells why it is worth it.', 'Una frase curta que expliqui per què val la pena.'), R([56, 50, 36, 16], [10, 75, 80, 7]), { fam: 'Montserrat', peso: 400, col: '#555555', ali: 'izq', val: 'arr', an: 'aparece', ret: .2 }),
      tx('49,90 €', R([56, 70, 24, 14], [10, 84, 46, 8]), { fam: 'Montserrat', col: '#111111', ali: 'izq', an: 'aparece', ret: .4 }) ] })],

    ['horario', 'comercio', ['Horario', 'Opening hours', 'Horari'], () => ({ fondo: { t: 'malla', c: '#0b1b33', c2: '#16345f', c3: '#0e2a52' }, piezas: [
      tx(L('HORARIO', 'OPENING HOURS', 'HORARI'), R([6, 8, 40, 16], [10, 7, 80, 8]), { fam: 'Bebas Neue', ali: R('izq', 'cen'), esp: .06, an: 'aparece' }),
      fo(R([6, 25, 12, 1], [38, 16, 24, .45]), '#4cc9f0'),
      rj(R([6, 34, 38, 26], [20, 19, 60, 11]), { col: '#4cc9f0', fam: 'Bebas Neue' }),
      fe(R([6, 62, 38, 7], [16, 31, 68, 3.4]), 'larga', { fam: 'Montserrat', col: '#c9d6ea' }),
      fo(R([50, 10, 44, 80], [8, 38, 84, 52]), '#ffffff14', { radio: 2.5 }),
      tf(L('Lunes a viernes\nSábados\nDomingos y festivos', 'Monday to Friday\nSaturdays\nSundays & holidays', 'Dilluns a divendres\nDissabtes\nDiumenges i festius'), R([53, 14, 24, 72], [12, 41, 48, 46]), R(3.7, 3.9), { fam: 'Montserrat', peso: 400, ali: 'izq', lh: R(4.2, 5.2) }),
      tf(L('9:00 – 20:30\n10:00 – 14:00\nCerrado', '9:00 – 20:30\n10:00 – 14:00\nClosed', '9:00 – 20:30\n10:00 – 14:00\nTancat'), R([76, 14, 15.5, 72], [58, 41, 30, 46]), R(3.7, 3.9), { fam: 'Montserrat', col: '#4cc9f0', ali: 'der', lh: R(4.2, 5.2) }) ] })],

    ['abierto', 'comercio', ['Estamos abiertos', 'We are open', 'Som oberts'], () => ({ fondo: { t: 'malla', c: '#05130d', c2: '#0a3d24', c3: '#06281a', tr: 'rejilla' }, piezas: [
      fo(R([8, 12, 84, 62], [8, 16, 84, 44]), '#00000000', { borde: .6, bcol: '#39ff88', radio: 4, sombra: true }),
      tx(L('ESTAMOS', 'WE ARE', 'SOM'), R([14, 18, 72, 16], [14, 20, 72, 9]), { fam: 'Righteous', col: '#eafff2', stx: true, an: 'aparece' }),
      tx(L('ABIERTOS', 'OPEN', 'OBERTS'), R([12, 34, 76, 34], [12, 30, 76, 24]), { fam: 'Righteous', col: '#39ff88', stx: true, an: 'zoom', ret: .2 }),
      rj(R([12, 80, 30, 12], [20, 66, 60, 9]), { col: '#eafff2', fam: 'Share Tech Mono' }),
      fe(R([46, 82, 42, 8], [14, 77, 72, 4]), 'larga', { col: '#39ff88', fam: 'Montserrat' }) ] })],

    ['precios', 'comercio', ['Lista de precios', 'Price list', 'Llista de preus'], () => ({ fondo: { t: 'color', c: '#101014' }, piezas: [
      fo(R([0, 0, 100, 22], [0, 0, 100, 14]), '#ffb000'),
      tx(L('LISTA DE PRECIOS', 'PRICE LIST', 'LLISTA DE PREUS'), R([6, 4, 88, 14], [8, 3.5, 84, 7]), { fam: 'Archivo Black', col: '#101014', ali: 'izq' }),
      tf(L('Servicio básico\nServicio completo\nServicio exprés\nRevisión\nPresupuesto', 'Basic service\nFull service\nExpress service\nCheck-up\nQuote', 'Servei bàsic\nServei complet\nServei exprés\nRevisió\nPressupost'), R([6, 28, 60, 64], [8, 20, 60, 70]), R(6, 5.6), { fam: 'Montserrat', peso: 400, ali: 'izq', val: 'cen', lh: R(1.95, 3.6) }),
      tf(L('15 €\n29 €\n39 €\n10 €\nGratis', '€15\n€29\n€39\n€10\nFree', '15 €\n29 €\n39 €\n10 €\nGratis'), R([68, 28, 26, 64], [68, 20, 24, 70]), R(6, 5.6), { fam: 'Montserrat', col: '#ffb000', ali: 'der', val: 'cen', lh: R(1.95, 3.6) }) ] })],

    ['inmueble', 'comercio', ['Ficha de producto', 'Product card', 'Fitxa de producte'], () => ({ fondo: { t: 'color', c: '#ffffff' }, piezas: [
      zn(R([0, 0, 60, 100], [0, 0, 100, 50]), { aj: 'cubrir' }),
      fo(R([60, 0, 40, 100], [0, 50, 100, 50]), '#0d3b66'),
      fo(R([63, 10, 14, 7], [8, 54, 28, 4]), '#f4d35e', { radio: 1 }),
      tx(L('DESTACADO', 'FEATURED', 'DESTACAT'), R([64, 11.2, 12, 4.6], [10, 54.7, 24, 2.6]), { fam: 'Montserrat', col: '#0d3b66', esp: .12 }),
      tx(L('Título de la ficha', 'Card title', 'Títol de la fitxa'), R([63, 21, 33, 18], [8, 60, 84, 9]), { fam: 'Montserrat', ali: 'izq', val: 'arr', an: 'sube' }),
      tf(L('• Primera característica\n• Segunda característica\n• Tercera característica', '• First feature\n• Second feature\n• Third feature', '• Primera característica\n• Segona característica\n• Tercera característica'), R([63, 42, 33, 26], [8, 70, 84, 13]), R(3.6, 3.9), { fam: 'Montserrat', peso: 400, col: '#dbe7f3', ali: 'izq', val: 'arr', lh: 1.7 }),
      tx('249 €', R([63, 72, 24, 16], [8, 85, 50, 9]), { fam: 'Montserrat', col: '#f4d35e', ali: 'izq', an: 'aparece', ret: .4 }) ] })],

    /* ---------------- eventos ---------------- */
    ['concierto', 'eventos', ['Concierto', 'Live music', 'Concert'], () => ({ fondo: { t: 'malla', c: '#12002b', c2: '#7b2cbf', c3: '#e0218a' }, piezas: [
      fo(R([6, 10, 18, 8], [10, 8, 34, 4.4]), '#ffffff', { radio: .6 }),
      tx(L('EN DIRECTO', 'LIVE', 'EN DIRECTE'), R([7, 11.3, 16, 5.4], [12, 8.7, 30, 3]), { fam: 'Montserrat', col: '#12002b', esp: .1 }),
      tx(L('NOMBRE\nDEL ARTISTA', 'ARTIST\nNAME', 'NOM\nDE L’ARTISTA'), R([6, 22, 62, 46], [8, 16, 84, 30]), { fam: 'Bebas Neue', ali: 'izq', lh: .92, stx: true, an: 'izquierda' }),
      tx(L('SÁBADO 14 · 22:30', 'SATURDAY 14 · 22:30', 'DISSABTE 14 · 22:30'), R([6, 72, 50, 10], [8, 50, 84, 5.5]), { fam: 'Bebas Neue', col: '#ffe14d', ali: 'izq', an: 'aparece', ret: .3 }),
      tx(L('Entrada 10 € con consumición · Aforo limitado', 'Tickets €10 incl. one drink · Limited capacity', 'Entrada 10 € amb consumició · Aforament limitat'), R([6, 84, 54, 6], [8, 57, 84, 3.2]), { fam: 'Montserrat', peso: 400, ali: 'izq', an: 'aparece', ret: .4 }),
      qr(cu(R(84, 50), R(68, 78), R(34, 34)), '', { an: 'zoom', ret: .5 }),
      tx(L('ENTRADAS', 'TICKETS', 'ENTRADES'), R([74, 88, 20, 5], [30, 89.5, 40, 3]), { fam: 'Montserrat', esp: .2, an: 'aparece', ret: .5 }) ] })],

    ['fiesta', 'eventos', ['Fiesta', 'Party night', 'Festa'], () => ({ fondo: { t: 'deg', c: '#3a0ca3', c2: '#f72585', a: 200, tr: 'puntos' }, piezas: [
      ci(cu(R(20, 20), R(30, 18), R(70, 70)), '#4cc9f0', { o: .28 }), ci(cu(R(86, 84), R(78, 80), R(60, 60)), '#ffd60a', { o: .3 }),
      tx(L('ESTA NOCHE', 'TONIGHT', 'AQUESTA NIT'), R([10, 10, 80, 10], [10, 14, 80, 5]), { fam: 'Montserrat', esp: .3, an: 'aparece' }),
      tx(L('FIESTA', 'PARTY', 'FESTA'), R([6, 20, 88, 48], [6, 20, 88, 26]), { fam: 'Righteous', stx: true, an: 'zoom', ret: .15 }),
      fo(R([20, 70, 60, 12], [10, 50, 80, 7]), '#ffd60a', { radio: 6, r: -2 }),
      tx(L('DJ INVITADO · 23:00', 'GUEST DJ · 23:00', 'DJ CONVIDAT · 23:00'), R([22, 72, 56, 8], [12, 51.4, 76, 4.2]), { fam: 'Bebas Neue', col: '#3a0ca3', r: -2, an: 'aparece', ret: .35 }),
      tx(L('Entrada libre hasta completar aforo', 'Free entry until full', 'Entrada lliure fins a completar l’aforament'), R([20, 86, 60, 6], [12, 64, 76, 3.4]), { fam: 'Montserrat', peso: 400, an: 'aparece', ret: .5 }) ] })],

    ['agenda', 'eventos', ['Agenda de la semana', 'This week', 'Agenda de la setmana'], () => ({ fondo: { t: 'color', c: '#111318' }, piezas: [
      tx(L('ESTA SEMANA', 'THIS WEEK', 'AQUESTA SETMANA'), R([6, 7, 60, 16], [8, 5, 84, 8]), { fam: 'Archivo Black', ali: 'izq', an: 'aparece' }),
      fo(R([6, 25, 88, .6], [8, 14.5, 84, .3]), '#ff5d5d'),
      ...[[L('JUE', 'THU', 'DJ'), L('Noche de micro abierto', 'Open mic night', 'Nit de micro obert'), '21:00'], [L('VIE', 'FRI', 'DV'), L('Concierto acústico', 'Acoustic concert', 'Concert acústic'), '22:30'], [L('SÁB', 'SAT', 'DS'), L('Sesión DJ hasta el cierre', 'DJ session until closing', 'Sessió DJ fins al tancament'), '23:59'], [L('DOM', 'SUN', 'DG'), L('Vermut con música en directo', 'Vermouth with live music', 'Vermut amb música en directe'), '12:30']].flatMap((e, i) => { const y = R(30 + i * 16.5, 18 + i * 19.5), hh = R(13, 16); return [
        fo(R([6, y, 14, hh], [8, y, 22, hh * .55]), '#ff5d5d', { radio: 1.2, an: 'izquierda', ret: i * .12 }), tx(e[0], R([7, y + 2, 12, hh - 4], [10, y + 1.4, 18, hh * .55 - 2.8]), { fam: 'Bebas Neue', col: '#111318', an: 'izquierda', ret: i * .12 }),
        tf(e[1], R([23, y, 54, hh], [8, y + hh * .58, 62, hh * .36]), R(5.2, 4.6), { fam: 'Montserrat', ali: 'izq', an: 'aparece', ret: .1 + i * .12 }), tx(e[2], R([78, y, 16, hh], [72, y + hh * .58, 20, hh * .36]), { fam: 'Bebas Neue', col: '#ff5d5d', ali: 'der', an: 'aparece', ret: .1 + i * .12 }) ]; }) ] })],

    ['cartelera', 'eventos', ['Cartelera', 'Now showing', 'Cartellera'], () => ({ fondo: { t: 'malla', c: '#0b0b10', c2: '#2a0f14', c3: '#161025', tr: 'vineta' }, piezas: [
      tx(L('CARTELERA', 'NOW SHOWING', 'CARTELLERA'), R([4, 6, 34, 16], [8, 3.5, 56, 6.4]), { fam: 'Cinzel', col: '#e9c46a', ali: 'izq' }),
      rj(R([4, 26, 24, 14], [70, 4.4, 22, 4.6]), { col: '#ffffff', fam: 'Montserrat' }),
      fe(R([4, 42, 30, 6], [8, 10.6, 84, 2.4]), 'larga', { col: '#c9c9d4', fam: 'Montserrat', ali: 'izq' }),
      zn(R([42, 5, 54, 82], [6, 15, 88, 73]), { aj: 'contener', sombra: true }),
      tx(L('Consulta horarios y venta de entradas en taquilla.', 'Ask at the box office for times and tickets.', 'Consulta horaris i venda d’entrades a taquilla.'), R([4, 56, 32, 22], [8, 90, 84, 6]), { fam: 'Montserrat', peso: 400, col: '#c9c9d4', ali: R('izq', 'cen'), val: R('arr', 'cen') }) ] })],

    ['proximamente', 'eventos', ['Próximamente', 'Coming soon', 'Properament'], () => ({ fondo: { t: 'color', c: '#000000' }, piezas: [
      zn([0, 0, 100, 100], { aj: 'cubrir' }),
      fo(R([0, 62, 100, 38], [0, 68, 100, 32]), '#000000', { col2: '#00000000', ang: 0 }),
      tx(L('PRÓXIMAMENTE', 'COMING SOON', 'PROPERAMENT'), R([6, 72, 70, 16], [8, 80, 84, 8]), { fam: 'Bebas Neue', ali: 'izq', stx: true, an: 'sube' }),
      tx(L('Reserva ya tu entrada', 'Book your ticket now', 'Reserva ja la teva entrada'), R([6, 88, 50, 6], [8, 89, 84, 3.4]), { fam: 'Montserrat', peso: 400, col: '#ffe14d', ali: 'izq', stx: true, an: 'aparece', ret: .3 }) ] })],

    /* ---------------- empresa ---------------- */
    ['bienvenida', 'empresa', ['Bienvenida', 'Welcome', 'Benvinguda'], () => ({ fondo: { t: 'malla', c: '#0a1128', c2: '#1c3f77', c3: '#12305e', tr: 'vineta' }, piezas: [
      fo(R([46, 12, 8, .7], [38, 12, 24, .35]), '#d4af37'),
      tx(L('BIENVENIDOS', 'WELCOME', 'BENVINGUTS'), R([10, 18, 80, 26], [6, 16, 88, 12]), { fam: 'Cinzel', col: '#ffffff', an: 'aparece' }),
      tx(L('Nombre de la empresa', 'Company name', 'Nom de l’empresa'), R([20, 46, 60, 10], [10, 30, 80, 6]), { fam: 'Marcellus', col: '#d4af37', an: 'aparece', ret: .3 }),
      fo(R([46, 60, 8, .7], [38, 39, 24, .35]), '#d4af37'),
      rj(R([8, 70, 26, 18], [20, 46, 60, 12]), { fam: 'Marcellus', col: '#ffffff' }),
      fe(R([8, 88, 26, 5], [12, 59, 76, 3.4]), 'larga', { fam: 'Montserrat', col: '#b9c6de' }),
      ti(R([44, 68, 50, 24], [10, 70, 80, 18]), { col: '#ffffff', fam: 'Montserrat' }) ] })],

    ['sala', 'empresa', ['Sala de reuniones', 'Meeting room', 'Sala de reunions'], () => ({ fondo: { t: 'color', c: '#0e1116' }, piezas: [
      fo(R([0, 0, 3, 100], [0, 0, 100, 1.6]), '#2ecc71'),
      tx(L('SALA 1', 'ROOM 1', 'SALA 1'), R([8, 8, 40, 20], [8, 6, 84, 11]), { fam: 'Archivo Black', ali: 'izq' }),
      fo(R([70, 10, 24, 14], [8, 19, 40, 6]), '#2ecc71', { radio: 8 }),
      tx(L('LIBRE', 'FREE', 'LLIURE'), R([72, 12.5, 20, 9], [11, 20.2, 34, 3.6]), { fam: 'Montserrat', col: '#0e1116', esp: .12 }),
      tx(L('AHORA', 'NOW', 'ARA'), R([8, 36, 20, 6], [8, 32, 40, 3]), { fam: 'Montserrat', col: '#8d98a8', ali: 'izq', esp: .2 }),
      tx(L('Reunión de equipo', 'Team meeting', 'Reunió d’equip'), R([8, 43, 60, 16], [8, 36, 84, 8]), { fam: 'Montserrat', ali: 'izq', an: 'aparece' }),
      tx('10:00 – 11:30', R([8, 60, 40, 10], [8, 45, 60, 5]), { fam: 'Montserrat', peso: 400, col: '#2ecc71', ali: 'izq' }),
      fo(R([8, 75, 84, .4], [8, 56, 84, .2]), '#2a313c'),
      tx(L('DESPUÉS', 'NEXT', 'DESPRÉS'), R([8, 79, 20, 5], [8, 60, 40, 3]), { fam: 'Montserrat', col: '#8d98a8', ali: 'izq', esp: .2 }),
      tx(L('12:00  Presentación a cliente', '12:00  Client presentation', '12:00  Presentació a client'), R([8, 85, 60, 8], [8, 64, 84, 5]), { fam: 'Montserrat', peso: 400, col: '#c9d1dc', ali: 'izq' }),
      rj(R([72, 78, 22, 14], [24, 80, 52, 10]), { fam: 'Montserrat', col: '#ffffff' }) ] })],

    ['aviso', 'empresa', ['Aviso importante', 'Important notice', 'Avís important'], () => ({ fondo: { t: 'color', c: '#ffb703', tr: 'lineas' }, piezas: [
      fo(R([6, 10, 88, 80], [7, 8, 86, 84]), '#14110a', { radio: 3, sombra: true }),
      ci(cu(R(22, 50), R(50, 24), R(44, 40)), '#ffb703', { an: 'zoom' }),
      tx('!', cu(R(22, 50), R(50, 24), R(34, 30)), { fam: 'Archivo Black', col: '#14110a', an: 'zoom' }),
      tx(L('AVISO', 'NOTICE', 'AVÍS'), R([40, 18, 48, 22], [14, 40, 72, 11]), { fam: 'Archivo Black', col: '#ffb703', ali: R('izq', 'cen'), an: 'aparece', ret: .2 }),
      tx(L('Escribe aquí el mensaje que todo el mundo debe leer. Corto y claro.', 'Type here the message everyone must read. Short and clear.', 'Escriu aquí el missatge que tothom ha de llegir. Curt i clar.'), R([40, 42, 48, 36], [14, 54, 72, 28]), { fam: 'Montserrat', peso: 400, ali: R('izq', 'cen'), val: 'arr', an: 'aparece', ret: .35 }) ] })],

    ['cumple', 'empresa', ['Felicitación', 'Celebration', 'Felicitació'], () => ({ fondo: { t: 'deg', c: '#ff7eb3', c2: '#845ec2', a: 135 }, piezas: [
      ...[[12, 14, 9, '#ffd166'], [84, 20, 6, '#06d6a0'], [70, 8, 4, '#ffffff'], [24, 84, 7, '#4cc9f0'], [90, 78, 10, '#ffd166'], [8, 52, 4, '#ffffff'], [58, 90, 5, '#06d6a0'], [40, 8, 3, '#4cc9f0']].map((c, i) => ci(cu(c[0], c[1], c[2]), c[3], { o: .9, an: 'zoom', ret: i * .07 })),
      tx(L('¡Feliz\ncumpleaños!', 'Happy\nbirthday!', 'Per molts\nanys!'), R([14, 8, 72, 46], [8, 20, 84, 28]), { fam: 'Pacifico', stx: true, lh: 1.15, an: 'aparece', ret: .2 }),
      tx(L('NOMBRE', 'NAME', 'NOM'), R([20, 60, 60, 16], [12, 52, 76, 9]), { fam: 'Poppins', col: '#fff6c9', an: 'sube', ret: .5 }),
      tx(L('de parte de todo el equipo', 'from the whole team', 'de part de tot l’equip'), R([24, 81, 52, 7], [14, 63, 72, 3.6]), { fam: 'Montserrat', peso: 400, an: 'aparece', ret: .7 }) ] })],

    ['mensaje', 'empresa', ['Mensaje', 'Message', 'Missatge'], () => ({ fondo: { t: 'malla', c: '#0f172a', c2: '#0ea5e9', c3: '#6366f1' }, piezas: [
      tx(L('Tu mensaje aquí', 'Your message here', 'El teu missatge aquí'), R([10, 22, 80, 40], [8, 28, 84, 26]), { fam: 'Poppins', stx: true, an: 'sube' }),
      tx(L('Una segunda línea para completar la idea', 'A second line to round off the idea', 'Una segona línia per completar la idea'), R([18, 66, 64, 9], [10, 58, 80, 6]), { fam: 'Montserrat', peso: 400, an: 'aparece', ret: .3 }) ] })],

    /* ---------------- información ---------------- */
    ['panel', 'info', ['Hora y tiempo', 'Time & weather', 'Hora i temps'], () => ({ fondo: { t: 'malla', c: '#06121f', c2: '#0b4f6c', c3: '#145374', tr: 'rejilla' }, piezas: [
      rj(R([6, 12, 50, 40], [8, 10, 84, 20]), { fam: 'Bebas Neue', col: '#ffffff' }),
      fe(R([6, 54, 50, 9], [8, 31, 84, 4.6]), 'larga', { fam: 'Montserrat', col: '#7fdbff' }),
      fo(R([60, 12, .4, 76], [20, 40, 60, .25]), '#ffffff33'),
      ti(R([63, 16, 32, 68], [10, 46, 80, 32]), { dis: R('col', 'col'), fam: 'Montserrat' }),
      tx(L('Que tengas un buen día', 'Have a nice day', 'Que tinguis un bon dia'), R([6, 72, 50, 10], [10, 84, 80, 5]), { fam: 'Montserrat', peso: 400, col: '#c7e9f5', ali: R('izq', 'cen') }) ] })],

    ['noticias', 'info', ['Noticias', 'News', 'Notícies'], () => ({ fondo: { t: 'color', c: '#0d0f14' }, piezas: [
      fo(R([0, 0, 100, 18], [0, 0, 100, 11]), '#c1121f'),
      tx(L('NOTICIAS', 'NEWS', 'NOTÍCIES'), R([5, 3, 44, 12], [7, 2.4, 56, 6.2]), { fam: 'Archivo Black', ali: 'izq' }),
      rj(R([78, 3.5, 18, 11], [68, 2.8, 26, 5.4]), { fam: 'Montserrat' }),
      rs(R([6, 24, 88, 58], [7, 15, 86, 70]), { modo: 'lista', n: R(4, 6), tam: R(4.4, 4.6), fam: 'Montserrat' }),
      fo(R([0, 88, 100, 12], [0, 91, 100, 9]), '#ffffff14'),
      fe(R([5, 90.5, 50, 7], [7, 93, 86, 4.4]), 'larga', { fam: 'Montserrat', col: '#b8bfcc', ali: 'izq' }) ] })],

    ['cita', 'info', ['Frase del día', 'Quote of the day', 'Frase del dia'], () => ({ fondo: { t: 'color', c: '#f5efe6' }, piezas: [
      tx('“', R([6, 2, 22, 44], [8, 8, 34, 16]), { fam: 'Playfair Display', col: '#c8553d', ali: 'izq', val: 'arr' }),
      tx(L('La sencillez es la máxima sofisticación.', 'Simplicity is the ultimate sophistication.', 'La senzillesa és la màxima sofisticació.'), R([14, 26, 72, 42], [10, 26, 80, 36]), { fam: 'Playfair Display', cur: true, col: '#28231d', an: 'aparece' }),
      fo(R([44, 74, 12, .7], [40, 68, 20, .35]), '#c8553d'),
      tx(L('FRASE DEL DÍA', 'QUOTE OF THE DAY', 'FRASE DEL DIA'), R([30, 79, 40, 6], [20, 71, 60, 3.2]), { fam: 'Montserrat', col: '#7a6f62', esp: .25, an: 'aparece', ret: .4 }) ] })],

    ['clases', 'info', ['Clases de hoy', 'Today’s classes', 'Classes d’avui'], () => ({ fondo: { t: 'deg', c: '#111827', c2: '#1f2937', a: 180 }, piezas: [
      tx(L('CLASES DE HOY', 'TODAY’S CLASSES', 'CLASSES D’AVUI'), R([6, 6, 60, 16], [8, 5, 84, 8]), { fam: 'Oswald', col: '#a3e635', ali: 'izq' }),
      fe(R([68, 9, 26, 9], [8, 13.4, 84, 3]), 'larga', { fam: 'Montserrat', col: '#d1d5db', ali: R('der', 'izq') }),
      ...[['07:30', L('Yoga suave', 'Gentle yoga', 'Ioga suau'), L('Sala 2', 'Room 2', 'Sala 2')], ['10:00', L('Entrenamiento funcional', 'Functional training', 'Entrenament funcional'), L('Sala 1', 'Room 1', 'Sala 1')], ['18:30', L('Ciclo indoor', 'Indoor cycling', 'Cicle indoor'), L('Sala 3', 'Room 3', 'Sala 3')], ['20:00', L('Pilates', 'Pilates', 'Pilates'), L('Sala 2', 'Room 2', 'Sala 2')]].flatMap((e, i) => { const y = R(28 + i * 17, 20 + i * 19); return [
        fo(R([6, y, 88, 14], [8, y, 84, 16]), i % 2 ? '#ffffff0a' : '#ffffff14', { radio: 1.5, an: 'sube', ret: i * .1 }),
        tx(e[0], R([8, y + 2, 16, 10], [11, y + 2, 34, 6]), { fam: 'Oswald', col: '#a3e635', ali: 'izq', an: 'sube', ret: i * .1 }),
        tf(e[1], R([26, y + 2.5, 48, 9], [11, y + 8.2, 56, 6]), R(5.4, 4.6), { fam: 'Montserrat', ali: 'izq', an: 'sube', ret: i * .1 }),
        tx(e[2], R([76, y + 3.5, 16, 7], [66, y + 9.6, 23, 3.6]), { fam: 'Montserrat', peso: 400, col: '#d1d5db', ali: 'der', an: 'sube', ret: i * .1 }) ]; }) ] })],

    /* ---------------- QR y redes ---------------- */
    ['wifi', 'redes', ['WiFi gratis', 'Free WiFi', 'WiFi gratis'], () => ({ fondo: { t: 'malla', c: '#04293a', c2: '#0b7285', c3: '#064663' }, piezas: [
      tx(L('WiFi GRATIS', 'FREE WiFi', 'WiFi GRATIS'), R([6, 12, 54, 26], [8, 10, 84, 12]), { fam: 'Poppins', ali: R('izq', 'cen'), an: 'aparece' }),
      tf(L('Red', 'Network', 'Xarxa') + '\n' + L('Contraseña', 'Password', 'Contrasenya'), R([6, 46, 20, 30], [10, 26, 32, 14]), R(4.4, 4.8), { fam: 'Montserrat', peso: 400, col: '#a5d8e6', ali: 'izq', lh: 2.4 }),
      tf(L('NombreDeLaRed', 'NetworkName', 'NomDeLaXarxa') + '\n' + 'clave1234', R([26, 46, 36, 30], [42, 26, 50, 14]), R(4.4, 4.8), { fam: 'Courier Prime', col: '#ffffff', ali: 'izq', lh: 2.4 }),
      qr(cu(R(80, 50), R(48, 62), R(48, 46)), '', { an: 'zoom', ret: .3 }),
      tx(L('Escanea y conéctate', 'Scan and connect', 'Escaneja i connecta’t'), R([66, 80, 28, 7], [20, 79, 60, 3.6]), { fam: 'Montserrat', peso: 400, an: 'aparece', ret: .4 }) ] })],

    ['siguenos', 'redes', ['Síguenos', 'Follow us', 'Segueix-nos'], () => ({ fondo: { t: 'deg', c: '#f9c74f', c2: '#f3722c', a: 140 }, piezas: [
      ci(cu(R(86, 88), R(14, 8), R(50, 50)), '#ffffff', { o: .18 }),
      tx(L('SÍGUENOS', 'FOLLOW US', 'SEGUEIX-NOS'), R([6, 14, 56, 30], [8, 12, 84, 13]), { fam: 'Archivo Black', col: '#1d1d1b', ali: R('izq', 'cen'), an: 'izquierda' }),
      tx('@tunegocio', R([6, 46, 50, 16], [12, 27, 76, 8]), { fam: 'Pacifico', col: '#ffffff', ali: R('izq', 'cen'), stx: true, an: 'aparece', ret: .25 }),
      tx(L('Novedades, sorteos y ofertas solo para seguidores.', 'News, giveaways and offers just for followers.', 'Novetats, sortejos i ofertes només per a seguidors.'), R([6, 66, 46, 18], [14, 38.5, 72, 7]), { fam: 'Montserrat', peso: 400, col: '#1d1d1b', ali: R('izq', 'cen'), val: 'arr', an: 'aparece', ret: .4 }),
      qr(cu(R(80, 50), R(52, 66), R(52, 48)), '', { sombra: true, an: 'zoom', ret: .5 }) ] })],

    ['resena', 'redes', ['Déjanos tu reseña', 'Leave a review', 'Deixa’ns la teva ressenya'], () => ({ fondo: { t: 'color', c: '#12141a' }, piezas: [
      tx('★★★★★', R([8, 10, 54, 18], [12, 9, 76, 8]), { fam: 'Inter', col: '#ffd166', ali: R('izq', 'cen'), an: 'zoom' }),
      tx(L('¿Te ha gustado?', 'Did you enjoy it?', 'T’ha agradat?'), R([8, 32, 54, 22], [8, 20, 84, 10]), { fam: 'Poppins', ali: R('izq', 'cen'), an: 'aparece', ret: .2 }),
      tx(L('Déjanos tu reseña: nos ayuda muchísimo.', 'Leave us a review: it helps us a lot.', 'Deixa’ns la teva ressenya: ens ajuda moltíssim.'), R([8, 56, 50, 20], [12, 32, 76, 8]), { fam: 'Montserrat', peso: 400, col: '#c9ced8', ali: R('izq', 'cen'), val: 'arr', an: 'aparece', ret: .3 }),
      qr(cu(R(80, 50), R(50, 62), R(54, 50)), '', { an: 'zoom', ret: .45 }),
      tx(L('ESCANEA EL CÓDIGO', 'SCAN THE CODE', 'ESCANEJA EL CODI'), R([66, 84, 28, 5], [20, 80, 60, 3]), { fam: 'Montserrat', col: '#ffd166', esp: .16, an: 'aparece', ret: .5 }) ] })],

    ['pedido', 'redes', ['Pide desde tu mesa', 'Order from your table', 'Demana des de la taula'], () => ({ fondo: { t: 'malla', c: '#1b1030', c2: '#5a189a', c3: '#240046' }, piezas: [
      fo(cu(R(27, 50), R(50, 36), R(70, 62)), '#ffffff', { radio: 4, sombra: true, an: 'zoom' }),
      qr(cu(R(27, 50), R(50, 36), R(58, 52)), '', { radio: 0, an: 'zoom' }),
      tx(L('Pide desde\ntu mesa', 'Order from\nyour table', 'Demana des\nde la taula'), R([54, 16, 42, 40], [8, 60, 84, 16]), { fam: 'Fredoka', ali: R('izq', 'cen'), lh: 1.05, an: 'derecha', ret: .2 }),
      tx(L('Escanea el código, elige y paga cuando quieras.', 'Scan the code, choose and pay whenever you like.', 'Escaneja el codi, tria i paga quan vulguis.'), R([54, 60, 38, 20], [12, 78, 76, 8]), { fam: 'Montserrat', peso: 400, col: '#e0d4f7', ali: R('izq', 'cen'), val: 'arr', an: 'aparece', ret: .4 }) ] })],

    /* ---------------- fotos y carteles ---------------- */
    ['dos-zonas', 'medios', ['Carteles con panel', 'Posters with side panel', 'Cartells amb panell'], () => ({ fondo: { t: 'malla', c: '#0c0c12', c2: '#1d1b3a', c3: '#151a2e' }, piezas: [
      zn(R([3, 5, 58, 90], [5, 3, 90, 58]), { aj: 'contener', sombra: true }),
      fo(R([65, 5, 32, 90], [5, 64, 90, 33]), '#ffffff10', { radio: 2.5 }),
      rj(R([68, 9, 26, 16], [9, 66.5, 38, 8]), { fam: 'Bebas Neue' }),
      fe(R([68, 26, 26, 5], [9, 75.5, 38, 2.6]), 'larga', { fam: 'Montserrat', col: '#b9bfd0' }),
      ti(R([68, 36, 26, 22], [52, 66.5, 39, 12]), { dias: false, fam: 'Montserrat' }),
      tx(L('Tu texto aquí', 'Your text here', 'El teu text aquí'), R([68, 62, 26, 12], [9, 81, 56, 6]), { fam: 'Montserrat', ali: R('cen', 'izq') }),
      qr(cu(R(81, 80), R(85, 88), R(18, 22)), '') ] })],

    ['foto-pie', 'medios', ['Foto con pie', 'Photo with caption', 'Foto amb peu'], () => ({ fondo: { t: 'color', c: '#000000' }, piezas: [
      zn([0, 0, 100, 100], { aj: 'cubrir' }),
      fo(R([0, 78, 100, 22], [0, 84, 100, 16]), '#000000b8'),
      tx(L('Un titular para tus fotos', 'A headline for your photos', 'Un titular per a les teves fotos'), R([5, 80, 70, 10], [6, 86, 88, 6]), { fam: 'Montserrat', ali: 'izq', an: 'sube' }),
      tx(L('Y una línea más pequeña debajo', 'And a smaller line underneath', 'I una línia més petita a sota'), R([5, 90, 60, 6], [6, 92.5, 88, 3.4]), { fam: 'Montserrat', peso: 400, col: '#d7d7d7', ali: 'izq', an: 'aparece', ret: .2 }) ] })],

    ['marco-galeria', 'medios', ['Marco de galería', 'Gallery frame', 'Marc de galeria'], () => ({ fondo: { t: 'color', c: '#e9e4da', tr: 'vineta' }, piezas: [
      fo(R([24, 6, 52, 78], [9, 9, 82, 70]), '#ffffff', { sombra: true }),
      zn(R([26, 9, 48, 72], [12, 11, 76, 66]), { aj: 'contener' }),
      tx(L('TÍTULO DE LA OBRA', 'TITLE OF THE WORK', 'TÍTOL DE L’OBRA'), R([24, 87, 52, 5], [12, 83, 76, 3.2]), { fam: 'Marcellus', col: '#2b2a27', esp: .14 }),
      tx(L('Autor · año · técnica', 'Artist · year · medium', 'Autor · any · tècnica'), R([30, 92.5, 40, 4], [20, 87.4, 60, 2.4]), { fam: 'Montserrat', peso: 400, col: '#6f6a60' }) ] })],

    ['lienzo', 'medios', ['Lienzo en blanco', 'Blank canvas', 'Llenç en blanc'], () => ({ fondo: { t: 'color', c: '#15151b' }, piezas: [] })]
  ];

  function haz(id, hor, lang) { const p = P.find(x => x[0] === id); if (!p) return null; H = !!hor; LG = ['en', 'ca'].includes(lang) ? lang : 'es'; const e = p[3](), red = v => Math.round(v * 100) / 100;
    e.piezas.forEach(z => { z.id = window.ADESCENA.id(); ['x', 'y', 'w', 'h'].forEach(k => { z[k] = red(z[k]); }); if (!z.r) delete z.r; });
    return Object.assign({ id: 'e' + window.ADESCENA.id(), n: p[2][LG === 'en' ? 1 : LG === 'ca' ? 2 : 0], seg: 12 }, e); }
  window.ADPLANT = { CATS, lista: P.map(p => ({ id: p[0], cat: p[1], n: p[2] })), haz };
})();
