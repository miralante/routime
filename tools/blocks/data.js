/* ============================================================
   Data: Blocks (memory/attention — visual-spatial construction,
   tetris/blocks style: copy a model onto a grid).
   Format: DATA.es / DATA.en, each with:
   { porRonda, colores: { R, B, Y } (spoken name of each color),
     niveles: [{ id, name, descripcion, modelos: string[] }] }
   Each model is a 16-character string (4×4 grid, row by row):
   '.' = empty cell, 'R' = red, 'B' = blue, 'Y' = yellow.
   Progression (rule 13, one change per level): the only variable is
   the number of colored blocks in the model (4 → 6 → 8). The grid
   (4×4) and the palette (3 colors) never change.
   Models are the same in both languages; only the texts are
   translated. app.js uses DATA[App.i18n.locale()] || DATA.es.
   To extend: add 16-character strings with the level's exact
   number of blocks.
   ============================================================ */
(function () {
  'use strict';

  /* 4 blocks */
  var MODELOS_1 = [
    'RRRR............',
    'B...B...B...B...',
    'YY..YY..........',
    '....RR....RR....',
    '.B...B...B...B..',
    'Y..Y........Y..Y'
  ];

  /* 6 blocks */
  var MODELOS_2 = [
    'R...R...R...RRR.',
    'BBBB.B...B......',
    '.YY.YYYY........',
    'RR...RR...RR....',
    'BB..B.B.BB......',
    '.Y..YYY..Y...Y..'
  ];

  /* 8 blocks */
  var MODELOS_3 = [
    'RRRRRRRR........',
    'BBBBB..BB..B....',
    'Y.Y..Y.YY.Y..Y.Y',
    'R..RRRRRR..R....',
    'YY...YY...YY..YY',
    'RRBBRRBB........'
  ];

  window.DATA = {
    es: {
      porRonda: 3,
      colores: { R: 'rojo', B: 'azul', Y: 'amarillo' },
      niveles: [
        { id: 1, name: 'Nivel 1', descripcion: '4 bloques', modelos: MODELOS_1 },
        { id: 2, name: 'Nivel 2', descripcion: '6 bloques', modelos: MODELOS_2 },
        { id: 3, name: 'Nivel 3', descripcion: '8 bloques', modelos: MODELOS_3 }
      ]
    },
    en: {
      porRonda: 3,
      colores: { R: 'red', B: 'blue', Y: 'yellow' },
      niveles: [
        { id: 1, name: 'Level 1', descripcion: '4 blocks', modelos: MODELOS_1 },
        { id: 2, name: 'Level 2', descripcion: '6 blocks', modelos: MODELOS_2 },
        { id: 3, name: 'Level 3', descripcion: '8 blocks', modelos: MODELOS_3 }
      ]
    }
  };
})();
