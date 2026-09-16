/* ============================================================
   Datos: Completa la Palabra (lenguaje — ortografía).
   Cada palabra se ve con una letra tapada; hay que elegir la
   letra correcta entre 3 options para completarla bien escrita.
   Formato:
   DATA.es / DATA.en = [{ id, name, words: [{ picto, word, blank,
     options: string[3] }] }]
   - 'word' es la palabra completa, correctamente escrita, en
     mayúsculas.
   - 'blank' es el índice (0 = primera letra) de la letra que se
     tapa. app.js la sustituye por un hueco y reconstruye la
     palabra completa al acertar.
   - 'options' son las 3 letters que se ofrecen; options[0] es
     siempre la correcta (app.js las baraja al pintar).
   - '—' en las options representa "ninguna letra" (para enseñar
     que una letra muda, como la H, no se puede omitir aunque no
     suene).
   'id' de cada grupo se mantiene igual en es/en para conservar el
   progreso al cambiar de idioma. Los grupos no son una traducción
   entre sí: cada idioma tiene sus propias dificultades reales de
   ortografía (I18N.md §3) — en español, letters que se confunden
   por sonar igual (b/v, c/z, g/j, ll/y) y la h muda; en inglés,
   pares de letters que suenan igual (c/k, soft c/s, soft g/j, la
   grafía "ph") y letters mudas o dobles.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
var DATA = {
  es: [
    {
      id: 'level1',
      name: 'Nivel 1 · Vocales',
      words: [
        { picto: '🏠', word: 'CASA', blank: 1, options: ['A', 'E', 'O'] },
        { picto: '🐶', word: 'PERRO', blank: 1, options: ['E', 'A', 'O'] },
        { picto: '☀️', word: 'SOL', blank: 1, options: ['O', 'A', 'U'] },
        { picto: '🌙', word: 'LUNA', blank: 1, options: ['U', 'A', 'O'] },
        { picto: '🪑', word: 'MESA', blank: 1, options: ['E', 'A', 'I'] },
        { picto: '📖', word: 'LIBRO', blank: 1, options: ['I', 'E', 'A'] },
        { picto: '🌸', word: 'FLOR', blank: 2, options: ['O', 'A', 'E'] },
        { picto: '👟', word: 'ZAPATO', blank: 1, options: ['A', 'E', 'O'] }
      ]
    },
    {
      id: 'level2',
      name: 'Nivel 2 · Letras que se confunden',
      words: [
        { picto: '🐄', word: 'VACA', blank: 0, options: ['V', 'B', 'F'] },
        { picto: '🌳', word: 'ÁRBOL', blank: 2, options: ['B', 'V', 'D'] },
        { picto: '☁️', word: 'CIELO', blank: 0, options: ['C', 'S', 'Z'] },
        { picto: '☕', word: 'TAZA', blank: 2, options: ['Z', 'C', 'S'] },
        { picto: '🦒', word: 'JIRAFA', blank: 0, options: ['J', 'G', 'H'] },
        { picto: '🧑‍🤝‍🧑', word: 'GENTE', blank: 0, options: ['G', 'J', 'H'] },
        { picto: '🔑', word: 'LLAVE', blank: 1, options: ['L', 'Y', 'R'] },
        { picto: '🥛', word: 'YOGUR', blank: 0, options: ['Y', 'LL', 'I'] }
      ]
    },
    {
      id: 'level3',
      name: 'Nivel 3 · H y letters dobles',
      words: [
        { picto: '🏨', word: 'HOTEL', blank: 0, options: ['H', '—', 'J'] },
        { picto: '🥚', word: 'HUEVO', blank: 0, options: ['H', '—', 'G'] },
        { picto: '🕐', word: 'AHORA', blank: 1, options: ['H', '—', 'J'] },
        { picto: '🦉', word: 'BÚHO', blank: 2, options: ['H', '—', 'J'] },
        { picto: '🚗', word: 'CARRO', blank: 3, options: ['R', 'D', 'L'] },
        { picto: '🧢', word: 'GORRA', blank: 3, options: ['R', 'D', 'L'] },
        { picto: '🗼', word: 'TORRE', blank: 3, options: ['R', 'D', 'L'] },
        { picto: '🏘️', word: 'BARRIO', blank: 3, options: ['R', 'D', 'L'] }
      ]
    }
  ],
  en: [
    {
      id: 'level1',
      name: 'Level 1 · Vowels',
      words: [
        { picto: '🐱', word: 'CAT', blank: 1, options: ['A', 'E', 'O'] },
        { picto: '🐶', word: 'DOG', blank: 1, options: ['O', 'A', 'E'] },
        { picto: '☀️', word: 'SUN', blank: 1, options: ['U', 'A', 'O'] },
        { picto: '🛏️', word: 'BED', blank: 1, options: ['E', 'A', 'I'] },
        { picto: '📖', word: 'BOOK', blank: 1, options: ['O', 'A', 'E'] },
        { picto: '🐟', word: 'FISH', blank: 1, options: ['I', 'E', 'A'] },
        { picto: '🌙', word: 'MOON', blank: 1, options: ['O', 'A', 'E'] },
        { picto: '👟', word: 'SHOE', blank: 2, options: ['O', 'A', 'E'] }
      ]
    },
    {
      id: 'level2',
      name: 'Level 2 · Tricky letter pairs',
      words: [
        { picto: '🪁', word: 'KITE', blank: 0, options: ['K', 'C', 'Q'] },
        { picto: '🕯️', word: 'CANDLE', blank: 0, options: ['C', 'K', 'S'] },
        { picto: '🏙️', word: 'CITY', blank: 0, options: ['C', 'S', 'K'] },
        { picto: '🐍', word: 'SNAKE', blank: 0, options: ['S', 'C', 'Z'] },
        { picto: '🧌', word: 'GIANT', blank: 0, options: ['G', 'J', 'D'] },
        { picto: '🧃', word: 'JUICE', blank: 0, options: ['J', 'G', 'D'] },
        { picto: '📱', word: 'PHONE', blank: 0, options: ['P', 'F', 'B'] },
        { picto: '🐘', word: 'ELEPHANT', blank: 3, options: ['P', 'F', 'B'] }
      ]
    },
    {
      id: 'level3',
      name: 'Level 3 · Silent letters and doubles',
      words: [
        { picto: '🔪', word: 'KNIFE', blank: 0, options: ['K', '—', 'C'] },
        { picto: '👍', word: 'THUMB', blank: 4, options: ['B', '—', 'P'] },
        { picto: '⏰', word: 'HOUR', blank: 0, options: ['H', '—', 'W'] },
        { picto: '🏝️', word: 'ISLAND', blank: 1, options: ['S', '—', 'Z'] },
        { picto: '🐰', word: 'RABBIT', blank: 3, options: ['B', 'P', 'D'] },
        { picto: '🪜', word: 'LADDER', blank: 3, options: ['D', 'T', 'B'] },
        { picto: '🐱', word: 'KITTEN', blank: 3, options: ['T', 'D', 'P'] },
        { picto: '☀️', word: 'SUMMER', blank: 3, options: ['M', 'N', 'B'] }
      ]
    }
  ]
};
