/* ============================================================
   Datos: Partes del Día (autonomía — organizar tareas diarias por
   timeOfDay del día).
   Formato: DATA[locale] = { porRonda, momentos: string[3] (Mañana,
     Tarde, Noche — compartidos por todos los niveles), niveles: [{
     id, name, descripcion, estrellas,
     items: [{ picto, tarea, timeOfDay }] }] }
   'timeOfDay' de cada item debe coincidir con uno de los valores de
   'momentos'. Al colocar bien una tarea, se añade a la lista visual
   de esa caja (no desaparece: la ronda construye 3 listas completas).
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   tareas con un timeOfDay del día muy obvio (desayunar, dormir…);
   nivel 2 mantiene 3 cajas y solo cambia a tareas menos evidentes
   (peinarse antes de salir, dejar la ropa preparada…), sin añadir
   ni quitar cajas.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 9,
    momentos: ['Mañana', 'Tarde', 'Noche'],
    niveles: [
      {
        id: 1,
        name: 'Nivel 1',
        descripcion: 'Momentos muy claros',
        estrellas: 1,
        items: [
          { picto: '🥐', tarea: 'Desayunar', timeOfDay: 'Mañana' },
          { picto: '🛏️', tarea: 'Levantarte de la cama', timeOfDay: 'Mañana' },
          { picto: '🎒', tarea: 'Ir al colegio', timeOfDay: 'Mañana' },
          { picto: '🪥', tarea: 'Lavarte los dientes al despertar', timeOfDay: 'Mañana' },
          { picto: '🍽️', tarea: 'Comer', timeOfDay: 'Tarde' },
          { picto: '📚', tarea: 'Hacer los deberes', timeOfDay: 'Tarde' },
          { picto: '🍎', tarea: 'Merendar', timeOfDay: 'Tarde' },
          { picto: '⚽', tarea: 'Jugar en el parque', timeOfDay: 'Tarde' },
          { picto: '🍲', tarea: 'Cenar', timeOfDay: 'Noche' },
          { picto: '🌙', tarea: 'Ponerte el pijama', timeOfDay: 'Noche' },
          { picto: '🛁', tarea: 'Bañarte antes de dormir', timeOfDay: 'Noche' },
          { picto: '😴', tarea: 'Dormir', timeOfDay: 'Noche' },
          { picto: '👋', tarea: 'Decir buenos días', timeOfDay: 'Mañana' },
          { picto: '🌆', tarea: 'Volver a casa del colegio', timeOfDay: 'Tarde' }
        ]
      },
      {
        id: 2,
        name: 'Nivel 2',
        descripcion: 'Momentos menos claros',
        estrellas: 2,
        items: [
          { picto: '☀️', tarea: 'Abrir las cortinas al levantarte', timeOfDay: 'Mañana' },
          { picto: '🧴', tarea: 'Peinarte antes de ir al cole', timeOfDay: 'Mañana' },
          { picto: '🚌', tarea: 'Coger el autobús del colegio', timeOfDay: 'Mañana' },
          { picto: '🧦', tarea: 'Ponerte los calcetines antes de salir de casa', timeOfDay: 'Mañana' },
          { picto: '📖', tarea: 'Leer un rato después de comer', timeOfDay: 'Tarde' },
          { picto: '🎨', tarea: 'Hacer una manualidad después del cole', timeOfDay: 'Tarde' },
          { picto: '🐕', tarea: 'Sacar a pasear al perro', timeOfDay: 'Tarde' },
          { picto: '🧃', tarea: 'Merendar un zumo', timeOfDay: 'Tarde' },
          { picto: '🔦', tarea: 'Apagar la luz para dormir', timeOfDay: 'Noche' },
          { picto: '📱', tarea: 'Dejar el móvil cargando', timeOfDay: 'Noche' },
          { picto: '🧸', tarea: 'Coger el peluche para dormir', timeOfDay: 'Noche' },
          { picto: '👖', tarea: 'Dejar la ropa preparada para mañana', timeOfDay: 'Noche' },
          { picto: '🛒', tarea: 'Ayudar a save la compra de la tarde', timeOfDay: 'Tarde' },
          { picto: '🦷', tarea: 'Lavarte los dientes antes de acostarte', timeOfDay: 'Noche' }
        ]
      }
    ]
  },
  en: {
    porRonda: 9,
    momentos: ['Morning', 'Afternoon', 'Night'],
    niveles: [
      {
        id: 1,
        name: 'Level 1',
        descripcion: 'Very clear times of day',
        estrellas: 1,
        items: [
          { picto: '🥐', tarea: 'Have breakfast', timeOfDay: 'Morning' },
          { picto: '🛏️', tarea: 'Get out of bed', timeOfDay: 'Morning' },
          { picto: '🎒', tarea: 'Go to school', timeOfDay: 'Morning' },
          { picto: '🪥', tarea: 'Brush your teeth when you wake up', timeOfDay: 'Morning' },
          { picto: '🍽️', tarea: 'Have lunch', timeOfDay: 'Afternoon' },
          { picto: '📚', tarea: 'Do your homework', timeOfDay: 'Afternoon' },
          { picto: '🍎', tarea: 'Have a snack', timeOfDay: 'Afternoon' },
          { picto: '⚽', tarea: 'Play at the park', timeOfDay: 'Afternoon' },
          { picto: '🍲', tarea: 'Have dinner', timeOfDay: 'Night' },
          { picto: '🌙', tarea: 'Put on your pyjamas', timeOfDay: 'Night' },
          { picto: '🛁', tarea: 'Take a bath before bed', timeOfDay: 'Night' },
          { picto: '😴', tarea: 'Sleep', timeOfDay: 'Night' },
          { picto: '👋', tarea: 'Say good morning', timeOfDay: 'Morning' },
          { picto: '🌆', tarea: 'Come home from school', timeOfDay: 'Afternoon' }
        ]
      },
      {
        id: 2,
        name: 'Level 2',
        descripcion: 'Less obvious times of day',
        estrellas: 2,
        items: [
          { picto: '☀️', tarea: 'Open the curtains when you get up', timeOfDay: 'Morning' },
          { picto: '🧴', tarea: 'Comb your hair before school', timeOfDay: 'Morning' },
          { picto: '🚌', tarea: 'Catch the school bus', timeOfDay: 'Morning' },
          { picto: '🧦', tarea: 'Put your socks on before leaving home', timeOfDay: 'Morning' },
          { picto: '📖', tarea: 'Read for a while after lunch', timeOfDay: 'Afternoon' },
          { picto: '🎨', tarea: 'Do a craft after school', timeOfDay: 'Afternoon' },
          { picto: '🐕', tarea: 'Take the dog for a walk', timeOfDay: 'Afternoon' },
          { picto: '🧃', tarea: 'Have a juice for your snack', timeOfDay: 'Afternoon' },
          { picto: '🔦', tarea: 'Turn off the light to sleep', timeOfDay: 'Night' },
          { picto: '📱', tarea: 'Leave your phone charging', timeOfDay: 'Night' },
          { picto: '🧸', tarea: 'Get your teddy bear for bed', timeOfDay: 'Night' },
          { picto: '👖', tarea: "Lay out tomorrow's clothes", timeOfDay: 'Night' },
          { picto: '🛒', tarea: 'Help put away the afternoon shopping', timeOfDay: 'Afternoon' },
          { picto: '🦷', tarea: 'Brush your teeth before bed', timeOfDay: 'Night' }
        ]
      }
    ]
  }
};
