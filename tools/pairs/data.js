/* ============================================================
   Datos: Parejas — símbolos y niveles.
   simbolos: emojis cotidianos (se eligen al azar en cada partida).
   Son iguales en es/en: no son text, son pictogramas.
   niveles: { id, nombreKey, parejas, estrellas, columnas }
   nombreKey apunta a un text registrado en strings.js (App.i18n.t).
   Progresión (regla 13, un solo cambio por nivel): 'columnas' se
   mantiene fija en 4 en los tres niveles; la única variable de
   dificultad es 'parejas' (3→4→6).
   Para ampliar: añadir emojis a simbolos o niveles nuevos.
   app.js usa DATA[App.i18n.locale()].
   ============================================================ */
const SIMBOLOS = [
  '🐶', '🐱', '🐰', '🐟', '🐥', '🦋',
  '🍎', '🍌', '🍓', '🥕', '🍞', '🧀',
  '🏠', '🚗', '⚽', '🌞', '🌈', '⭐',
  '👕', '🔑', '📱', '🪥', '🥄', '🎈'
];

const NIVELES = [
  { id: 'facil', nombreKey: 'nivelFacil', parejas: 3, estrellas: 1, columnas: 4 },
  { id: 'medio', nombreKey: 'nivelMedio', parejas: 4, estrellas: 2, columnas: 4 },
  { id: 'dificil', nombreKey: 'nivelDificil', parejas: 6, estrellas: 3, columnas: 4 }
];

const DATA = {
  es: { simbolos: SIMBOLOS, niveles: NIVELES },
  en: { simbolos: SIMBOLOS, niveles: NIVELES }
};
