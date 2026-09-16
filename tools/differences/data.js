/* ============================================================
   Datos: escenas para el juego de las diferencias.
   Formato: ESCENAS = [{ id, nombreKey, objetos, diferencias }]
   - nombreKey apunta a un text registrado en strings.js (App.i18n.t).
   - objetos: [{ celda: 0-15, picto }] — posición en una rejilla 4x4.
     La escena izquierda se dibuja siempre igual a "objetos".
   - diferencias: [{ celda, pictoDerecha }] — en esas celdas, la
     escena derecha muestra "pictoDerecha" en vez del picto original.
     Ahí es donde debe tocar el usuario.
   Los pictos son emojis: iguales en es/en. Para ampliar: añadir
   escenas nuevas al array (mínimo 3-5 diferencias). app.js usa
   DATA[App.i18n.locale()].
   ============================================================ */
const ESCENAS = [
    {
      id: 'cocina',
      nombreKey: 'escenaCocina',
      objetos: [
        { celda: 0, picto: '🍎' },
        { celda: 1, picto: '🍌' },
        { celda: 2, picto: '🍇' },
        { celda: 4, picto: '🥕' },
        { celda: 5, picto: '🍞' },
        { celda: 7, picto: '🥛' },
        { celda: 9, picto: '☕' },
        { celda: 10, picto: '🍳' },
        { celda: 13, picto: '🍽️' },
        { celda: 14, picto: '🧂' }
      ],
      diferencias: [
        { celda: 0, pictoDerecha: '🍊' },
        { celda: 5, pictoDerecha: '🥐' },
        { celda: 9, pictoDerecha: '🍵' },
        { celda: 14, pictoDerecha: '🌶️' }
      ]
    },
    {
      id: 'parque',
      nombreKey: 'escenaParque',
      objetos: [
        { celda: 0, picto: '🌳' },
        { celda: 2, picto: '🌸' },
        { celda: 3, picto: '🐦' },
        { celda: 5, picto: '⚽' },
        { celda: 6, picto: '🎈' },
        { celda: 8, picto: '🐿️' },
        { celda: 10, picto: '🦋' },
        { celda: 12, picto: '🌻' },
        { celda: 13, picto: '🪑' },
        { celda: 15, picto: '☀️' }
      ],
      diferencias: [
        { celda: 0, pictoDerecha: '🌲' },
        { celda: 3, pictoDerecha: '🦆' },
        { celda: 10, pictoDerecha: '🐝' },
        { celda: 15, pictoDerecha: '🌤️' }
      ]
    },
    {
      id: 'dormitorio',
      nombreKey: 'escenaDormitorio',
      objetos: [
        { celda: 1, picto: '🛏️' },
        { celda: 2, picto: '🧸' },
        { celda: 4, picto: '📚' },
        { celda: 6, picto: '🪟' },
        { celda: 7, picto: '👕' },
        { celda: 9, picto: '🧦' },
        { celda: 11, picto: '⏰' },
        { celda: 12, picto: '🖼️' },
        { celda: 14, picto: '🪴' },
        { celda: 15, picto: '💡' }
      ],
      diferencias: [
        { celda: 2, pictoDerecha: '⚽' },
        { celda: 4, pictoDerecha: '✏️' },
        { celda: 6, pictoDerecha: '🚪' },
        { celda: 11, pictoDerecha: '📅' }
      ]
    }
];

const DATA = {
  es: { porRonda: 3, escenas: ESCENAS },
  en: { porRonda: 3, escenas: ESCENAS }
};
