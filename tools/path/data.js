/* ============================================================
   Datos: El Camino (memoria/atención — orientación espacial y
   planificación de rutas, estilo robot de suelo/Bee-Bot).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, filas, columnas,
     niveles: [{ id, name, descripcion, obstaculos }] }
   Cada camino se GENERA en app.js: se colocan salida (🐢) y meta
   (⭐) con distancia mínima, y 'obstaculos' árboles (🌳) al azar;
   se comprueba con una búsqueda en anchura (BFS) que siempre exista
   un camino, y si no, se vuelve a generar.
   Progresión (regla 13, un solo cambio por nivel): la única variable
   es el número de obstáculos (0 → 3 → 5). El tablero (4×4) y los
   controles no cambian nunca.
   Chocar con un árbol o con el borde no es un error castigado:
   solo se avisa con calma y se sigue probando (regla 5).
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 3,
    filas: 4,
    columnas: 4,
    niveles: [
      { id: 1, name: 'Nivel 1', descripcion: 'Camino libre', obstaculos: 0 },
      { id: 2, name: 'Nivel 2', descripcion: 'Con 3 árboles', obstaculos: 3 },
      { id: 3, name: 'Nivel 3', descripcion: 'Con 5 árboles', obstaculos: 5 }
    ]
  },
  en: {
    porRonda: 3,
    filas: 4,
    columnas: 4,
    niveles: [
      { id: 1, name: 'Level 1', descripcion: 'Open path', obstaculos: 0 },
      { id: 2, name: 'Level 2', descripcion: 'With 3 trees', obstaculos: 3 },
      { id: 3, name: 'Level 3', descripcion: 'With 5 trees', obstaculos: 5 }
    ]
  }
};
