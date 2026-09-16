/* ============================================================
   Datos: El Reloj (Routime — autonomía: leer la hora).
   Formato: DATA[locale] = {
     porRonda,             number of questions per round
     modos:    [{ id }]    four mechanics (leer, poner, convertir,
                           situaciones); app.js dispatcha por id.
     niveles:  [{ id, name, descripcion, estrellas,
                 minutos: number[] }]   minute values the round
                                        can show at that level.
     momentos: [{ id, picto, hora (0-23) }]   base 24h hour per
                                              moment of day.
   }

   Los textos viven en strings.<locale>.js:
     App.i18n.t('modo.' + id + '.name' | '.descripcion' | '.pregunta')
     App.i18n.t('nivel.' + id + '.name')
     App.i18n.t('timeOfDay.' + id + '.name' | '.pregunta')

   Para ampliar:
     - nuevo modo → añadir id aquí y su cuerpo en app.js bajo el
       mismo `runModo(modoId, ...)`.
     - nuevo nivel → añadir aquí + text en strings.<locale>.js.
     - nuevo timeOfDay → añadir aquí + text en ambos strings.

   app.js usa DATA[App.i18n.locale()] || DATA.es (ver banco()).
   ============================================================ */
var DATA = {
  es: {
    porRonda: 8,
    modos: [
      { id: 'leer' },
      { id: 'poner' },
      { id: 'convertir' },
      { id: 'situaciones' }
    ],
    niveles: [
      { id: 1, name: 'Nivel 1', descripcion: 'Horas en punto', estrellas: 1, minutos: [0] },
      { id: 2, name: 'Nivel 2', descripcion: 'Y media',        estrellas: 2, minutos: [0, 30] },
      { id: 3, name: 'Nivel 3', descripcion: 'Y cuarto, menos cuarto', estrellas: 3, minutos: [0, 15, 30, 45] }
    ],
    momentos: [
      { id: 'desayuno', picto: '🥐', hora: 8 },
      { id: 'colegio',  picto: '🏫', hora: 9 },
      { id: 'comida',   picto: '🍽️', hora: 14 },
      { id: 'merienda', picto: '🍪', hora: 17 },
      { id: 'cena',     picto: '🌙', hora: 21 },
      { id: 'dormir',   picto: '😴', hora: 22 }
    ]
  },
  en: {
    porRonda: 8,
    modos: [
      { id: 'leer' },
      { id: 'poner' },
      { id: 'convertir' },
      { id: 'situaciones' }
    ],
    niveles: [
      { id: 1, name: 'Level 1', descripcion: "O'clock",       estrellas: 1, minutos: [0] },
      { id: 2, name: 'Level 2', descripcion: 'Half past',     estrellas: 2, minutos: [0, 30] },
      { id: 3, name: 'Level 3', descripcion: 'Quarters past / to', estrellas: 3, minutos: [0, 15, 30, 45] }
    ],
    momentos: [
      { id: 'desayuno', picto: '🥐', hora: 8 },
      { id: 'colegio',  picto: '🏫', hora: 9 },
      { id: 'comida',   picto: '🍽️', hora: 14 },
      { id: 'merienda', picto: '🍪', hora: 17 },
      { id: 'cena',     picto: '🌙', hora: 21 },
      { id: 'dormir',   picto: '😴', hora: 22 }
    ]
  }
};