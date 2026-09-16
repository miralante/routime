/* ============================================================
   Datos: Piano (notas musicales, independientes del idioma).
   Formato:
   - DATA.melodiasSeguir = [{ id, secuencia: string[] }] — modo
     "Sigue la melodía". El name NO está aquí: es text y vive en
     strings.js. app.js lo busca con MELODIA_KEYS[id] (ver app.js).
   - DATA.canciones = [{ id, dificultad: 'facil'|'media', secuencia }]
     — modo "Canciones". El name tampoco está aquí, mismo patrón
     con CANCION_KEYS (ver app.js). 'dificultad' se traduce con
     App.i18n.t('dificultad' + Facil/Media).
   Las notas son do-re-mi-... en notación anglosajona (C D E F G A B,
   sostenidos con #): son un dato musical, no cambian con el idioma.
   Para ampliar: añadir una melodía o canción nueva con un id, su
   secuencia, y su name en strings.js (es y en).
   ============================================================ */
const DATA = {
  melodiasSeguir: [
    { id: 'ascendente', secuencia: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'] },
    { id: 'descendente', secuencia: ['C', 'B', 'A', 'G', 'F', 'E', 'D', 'C'] },
    { id: 'doremi', secuencia: ['C', 'D', 'E', 'C', 'E', 'D', 'C'] },
    { id: 'arcoiris', secuencia: ['C', 'E', 'G', 'C', 'G', 'E', 'C'] },
    { id: 'ondina', secuencia: ['E', 'F', 'G', 'A', 'G', 'F', 'E', 'D', 'C'] }
  ],

  canciones: [
    {
      id: 'cumpleanos', dificultad: 'facil',
      secuencia: ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F', 'C', 'C', 'C', 'A', 'F', 'E', 'D', 'B', 'B', 'A', 'F', 'G', 'F']
    },
    {
      id: 'estrellita', dificultad: 'facil',
      secuencia: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C']
    },
    {
      /* "Himno de la alegría" (Beethoven) / "Ode to Joy": there used
         to be a second entry here ("Twinkle") with the SAME sequence
         as "estrellita" — they're the same melody in two languages,
         not two different songs. Replaced with a genuinely different
         song so content isn't repeated. */
      id: 'himnoalegria', dificultad: 'media',
      secuencia: ['E', 'E', 'F', 'G', 'G', 'F', 'E', 'D', 'C', 'C', 'D', 'E', 'D', 'C']
    },
    {
      id: 'verde', dificultad: 'media',
      secuencia: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'G', 'C', 'D', 'E', 'F', 'F', 'F', 'F', 'F', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'D', 'D', 'E', 'D', 'G']
    }
  ]
};
