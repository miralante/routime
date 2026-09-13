/* ============================================================
   Datos: Encaja la Pieza (memoria/atención — tetris adaptado:
   mover, girar y bajar una pieza hasta su hueco, SIN caída
   automática ni cronómetro — regla 5).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, columnas, filas,
     piezas: { clave: [orientaciones] } (compartidas entre idiomas;
       cada orientación es una lista de celdas [x, y], y hacia abajo,
       normalizadas a origen 0,0),
     niveles: [{ id, nombre, descripcion, piezas: [claves] }] }
   El tablero se GENERA en app.js: se elige pieza, orientación final
   y columna al azar; el hueco es la huella exacta de la pieza
   apoyada en el suelo, y el resto de esas filas se rellena. Así la
   pieza correcta siempre cae limpia hasta su sitio.
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es el tamaño de la pieza (2 → 3 → 4 celdas). El tablero (6×5) y
   los controles no cambian nunca.
   Fallos: 1º pista socrática, 2º se marca el hueco, 3º se encaja
   sola con explicación (nadie se queda atascado).
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
(function () {
  'use strict';

  var PIEZAS = {
    /* duo: 2 cells */
    duo: [
      [[0, 0], [1, 0]],
      [[0, 0], [0, 1]]
    ],
    /* trominoes: 3 cells */
    triI: [
      [[0, 0], [1, 0], [2, 0]],
      [[0, 0], [0, 1], [0, 2]]
    ],
    triL: [
      [[0, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [0, 1]],
      [[0, 0], [1, 0], [1, 1]],
      [[1, 0], [0, 1], [1, 1]]
    ],
    /* tetrominoes: 4 cells */
    cuadrado: [
      [[0, 0], [1, 0], [0, 1], [1, 1]]
    ],
    barra: [
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[0, 0], [0, 1], [0, 2], [0, 3]]
    ],
    te: [
      [[0, 0], [1, 0], [2, 0], [1, 1]],
      [[0, 0], [0, 1], [0, 2], [1, 1]],
      [[1, 0], [0, 1], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [0, 1]]
    ],
    ele: [
      [[0, 0], [0, 1], [0, 2], [1, 2]],
      [[0, 0], [1, 0], [2, 0], [0, 1]],
      [[0, 0], [1, 0], [1, 1], [1, 2]],
      [[2, 0], [0, 1], [1, 1], [2, 1]]
    ]
  };

  window.DATA = {
    es: {
      porRonda: 4,
      columnas: 6,
      filas: 5,
      piezas: PIEZAS,
      niveles: [
        { id: 1, nombre: 'Nivel 1', descripcion: 'Piezas de 2', piezas: ['duo'] },
        { id: 2, nombre: 'Nivel 2', descripcion: 'Piezas de 3', piezas: ['triI', 'triL'] },
        { id: 3, nombre: 'Nivel 3', descripcion: 'Piezas de 4', piezas: ['cuadrado', 'barra', 'te', 'ele'] }
      ]
    },
    en: {
      porRonda: 4,
      columnas: 6,
      filas: 5,
      piezas: PIEZAS,
      niveles: [
        { id: 1, nombre: 'Level 1', descripcion: '2-cell pieces', piezas: ['duo'] },
        { id: 2, nombre: 'Level 2', descripcion: '3-cell pieces', piezas: ['triI', 'triL'] },
        { id: 3, nombre: 'Level 3', descripcion: '4-cell pieces', piezas: ['cuadrado', 'barra', 'te', 'ele'] }
      ]
    }
  };
})();
