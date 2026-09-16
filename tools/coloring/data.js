/* ============================================================
   Datos: Colorear (creatividad, motricidad fina y precisión del
   agarre — pintar dibujos por zonas).
   Formato: DATA.dibujos = [{ id, picto, zonas: [{ id,
     tag ('path'|'circle'|'rect'|'polygon'|'ellipse'), attrs }] }]
   'attrs' son los atributos SVG del elemento (d, cx/cy/r, etc.).
   DATA.colores: paleta fija de la actividad.
   Los nombres (color, dibujo, zona) NO están aquí: son text y
   viven en strings.js, indexados por 'id'. app.js los busca con
   App.i18n.t('color.'+id), App.i18n.t('dibujo.'+id), App.i18n.t('zona.'+id).
   Los dibujos van de zonas grandes a zonas pequeñas y precisas
   (asa de la taza, cordones del zapato, cerdas del cepillo): el
   catálogo progresa hacia un agarre más fino sin usar niveles.
   Objetos de la vida diaria (taza, camiseta, reloj, cepillo de
   dientes, zapato) para reforzar rutinas de autonomía además de
   la motricidad fina.
   Para ampliar: añadir un dibujo nuevo al array y sus nombres a strings.js (es y en).
   ============================================================ */
const DATA = {
  colores: [
    { id: 'rojo', valor: '#E53935' },
    { id: 'azul', valor: '#1E88E5' },
    { id: 'verde', valor: '#43A047' },
    { id: 'amarillo', valor: '#FDD835' },
    { id: 'morado', valor: '#8E24AA' },
    { id: 'naranja', valor: '#FB8C00' }
  ],
  dibujos: [
    {
      id: 'casa',
      picto: '🏠',
      zonas: [
        { id: 'techo', tag: 'polygon', attrs: { points: '20,50 50,15 80,50' } },
        { id: 'pared', tag: 'rect', attrs: { x: 25, y: 50, width: 50, height: 40 } },
        { id: 'puerta', tag: 'rect', attrs: { x: 45, y: 65, width: 10, height: 25 } },
        { id: 'ventana', tag: 'rect', attrs: { x: 30, y: 58, width: 12, height: 12 } },
        { id: 'sol', tag: 'circle', attrs: { cx: 85, cy: 20, r: 10 } }
      ]
    },
    {
      id: 'flor',
      picto: '🌸',
      zonas: [
        { id: 'petalos', tag: 'path', attrs: { d: 'M 37 29 A 13 13 0 1 1 63 29 A 13 13 0 1 1 37 29 M 52.2 40.1 A 13 13 0 1 1 78.2 40.1 A 13 13 0 1 1 52.2 40.1 M 46.4 57.9 A 13 13 0 1 1 72.4 57.9 A 13 13 0 1 1 46.4 57.9 M 27.6 57.9 A 13 13 0 1 1 53.6 57.9 A 13 13 0 1 1 27.6 57.9 M 21.8 40.1 A 13 13 0 1 1 47.8 40.1 A 13 13 0 1 1 21.8 40.1' } },
        { id: 'centro', tag: 'circle', attrs: { cx: 50, cy: 45, r: 9 } },
        { id: 'tallo', tag: 'rect', attrs: { x: 47, y: 60, width: 6, height: 30 } },
        { id: 'hoja', tag: 'polygon', attrs: { points: '50,75 68,72 58,88' } }
      ]
    },
    {
      id: 'pez',
      picto: '🐟',
      zonas: [
        { id: 'cuerpo', tag: 'ellipse', attrs: { cx: 45, cy: 50, rx: 30, ry: 18 } },
        { id: 'cola', tag: 'polygon', attrs: { points: '75,50 95,35 95,65' } },
        { id: 'aleta', tag: 'polygon', attrs: { points: '45,60 55,75 35,72' } },
        { id: 'ojo', tag: 'circle', attrs: { cx: 30, cy: 45, r: 4 } }
      ]
    },
    {
      id: 'coche',
      picto: '🚗',
      zonas: [
        { id: 'cuerpo', tag: 'rect', attrs: { x: 15, y: 55, width: 70, height: 20, rx: 4 } },
        { id: 'cabina', tag: 'polygon', attrs: { points: '30,55 40,35 65,35 75,55' } },
        { id: 'ventana', tag: 'polygon', attrs: { points: '42,52 42,38 62,38 62,52' } },
        { id: 'rueda1', tag: 'circle', attrs: { cx: 35, cy: 78, r: 10 } },
        { id: 'rueda2', tag: 'circle', attrs: { cx: 75, cy: 78, r: 10 } }
      ]
    },
    {
      id: 'taza',
      picto: '☕',
      zonas: [
        { id: 'cuerpo', tag: 'rect', attrs: { x: 20, y: 35, width: 50, height: 40, rx: 4 } },
        { id: 'cafe', tag: 'ellipse', attrs: { cx: 45, cy: 35, rx: 22, ry: 5 } },
        { id: 'asa', tag: 'path', attrs: { d: 'M 70 45 C 85 45 85 65 70 65 L 70 59 C 78 59 78 51 70 51 Z' } },
        { id: 'platillo', tag: 'ellipse', attrs: { cx: 45, cy: 80, rx: 32, ry: 6 } }
      ]
    },
    {
      id: 'camiseta',
      picto: '👕',
      zonas: [
        { id: 'cuerpo', tag: 'rect', attrs: { x: 35, y: 20, width: 30, height: 65 } },
        { id: 'mangaIzquierda', tag: 'polygon', attrs: { points: '35,20 20,30 25,48 35,38' } },
        { id: 'mangaDerecha', tag: 'polygon', attrs: { points: '65,20 80,30 75,48 65,38' } },
        { id: 'cuello', tag: 'ellipse', attrs: { cx: 50, cy: 18, rx: 10, ry: 5 } }
      ]
    },
    {
      id: 'reloj',
      picto: '🕐',
      zonas: [
        { id: 'esfera', tag: 'circle', attrs: { cx: 50, cy: 50, r: 35 } },
        { id: 'manecillaHora', tag: 'rect', attrs: { x: 48, y: 30, width: 4, height: 20, rx: 2 } },
        { id: 'manecillaMinuto', tag: 'rect', attrs: { x: 50, y: 48, width: 30, height: 3, rx: 1.5 } },
        { id: 'centro', tag: 'circle', attrs: { cx: 50, cy: 50, r: 3 } }
      ]
    },
    {
      id: 'cepillo',
      picto: '🪥',
      zonas: [
        { id: 'mango', tag: 'rect', attrs: { x: 40, y: 40, width: 12, height: 50, rx: 4 } },
        { id: 'cabezal', tag: 'rect', attrs: { x: 35, y: 18, width: 22, height: 18, rx: 6 } },
        { id: 'cerdas', tag: 'rect', attrs: { x: 37, y: 12, width: 18, height: 6, rx: 2 } }
      ]
    },
    {
      id: 'paraguas',
      picto: '☂️',
      zonas: [
        { id: 'tela', tag: 'path', attrs: { d: 'M 15 55 A 35 35 0 0 1 85 55 Z' } },
        { id: 'mango', tag: 'rect', attrs: { x: 47, y: 55, width: 6, height: 35, rx: 3 } },
        { id: 'puntera', tag: 'rect', attrs: { x: 48, y: 15, width: 4, height: 15 } }
      ]
    },
    {
      id: 'zapato',
      picto: '👟',
      zonas: [
        { id: 'cuerpo', tag: 'polygon', attrs: { points: '15,70 15,55 25,45 45,40 70,45 85,55 85,70' } },
        { id: 'cordones', tag: 'rect', attrs: { x: 35, y: 48, width: 20, height: 14, rx: 2 } },
        { id: 'suela', tag: 'rect', attrs: { x: 12, y: 68, width: 76, height: 12, rx: 6 } }
      ]
    }
  ]
};
