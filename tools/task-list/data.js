/* ============================================================
   Datos: Lista de Tareas (autonomía — organizar tareas mixtas:
   casa, trabajo y personales, en el orden lógico del día).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, name, descripcion, estrellas,
     listas: [{ name, items: [{ picto, text }] }] }] }
   'items' está en el orden correct (el primero se hace primero).
   A diferencia de La Casa (steps de UNA tarea del hogar), aquí cada
   'items' mezcla tareas independientes de distintos ámbitos del día
   (casa, trabajo, cuidado personal) que hay que ordenar por lógica
   o cronología, no solo steps de una sola actividad.
   Progresión (regla 13, un solo cambio por nivel, mismo patrón que
   La Casa): nivel 1 usa listas de 3 tareas; nivel 2 mantiene el
   mismo tipo de contenido y solo sube a 4 tareas por lista.
   Para ampliar: añadir listas al array del nivel correspondiente.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 5,
    niveles: [
      {
        id: 1,
        name: 'Nivel 1',
        descripcion: '3 tareas',
        estrellas: 1,
        listas: [
          { name: 'Tu mañana antes de salir', items: [
            { picto: '👕', text: 'Vestirte' },
            { picto: '🥐', text: 'Desayunar' },
            { picto: '🎒', text: 'Coger la mochila y salir' }
          ] },
          { name: 'Llegar al trabajo', items: [
            { picto: '🚌', text: 'Coger el autobús' },
            { picto: '🏢', text: 'Entrar al trabajo' },
            { picto: '🕐', text: 'Fichar la entrada' }
          ] },
          { name: 'Una tarea en el taller', items: [
            { picto: '📦', text: 'Coger las cajas' },
            { picto: '🏷️', text: 'Poner las etiquetas' },
            { picto: '📚', text: 'Apilarlas en su sitio' }
          ] },
          { name: 'Terminar la jornada', items: [
            { picto: '🧹', text: 'Recoger tu puesto' },
            { picto: '🕐', text: 'Fichar la salida' },
            { picto: '🚪', text: 'Salir del trabajo' }
          ] },
          { name: 'Volver a casa', items: [
            { picto: '🚌', text: 'Coger el autobús de vuelta' },
            { picto: '🔑', text: 'Abrir la puerta de casa' },
            { picto: '🛋️', text: 'Descansar un rato' }
          ] },
          { name: 'Antes de cenar', items: [
            { picto: '🧺', text: 'Dejar la ropa de trabajo' },
            { picto: '🧼', text: 'Lavarte las manos' },
            { picto: '🍲', text: 'Poner la mesa para cenar' }
          ] },
          { name: 'Tu noche', items: [
            { picto: '🍽️', text: 'Cenar' },
            { picto: '🪥', text: 'Lavarte los dientes' },
            { picto: '😴', text: 'Irte a dormir' }
          ] },
          { name: 'Preparar el día siguiente', items: [
            { picto: '⏰', text: 'Poner el despertador' },
            { picto: '🎒', text: 'Dejar la mochila preparada' },
            { picto: '🌙', text: 'Apagar la luz' }
          ] }
        ]
      },
      {
        id: 2,
        name: 'Nivel 2',
        descripcion: '4 tareas',
        estrellas: 2,
        listas: [
          { name: 'Antes de salir a trabajar', items: [
            { picto: '⏰', text: 'Despertarte con la alarma' },
            { picto: '🪥', text: 'Asearte' },
            { picto: '👕', text: 'Vestirte con la ropa de trabajo' },
            { picto: '🥐', text: 'Desayunar' }
          ] },
          { name: 'Llegar y prepararte en el trabajo', items: [
            { picto: '🚌', text: 'Coger el autobús' },
            { picto: '🕐', text: 'Fichar la entrada' },
            { picto: '🧤', text: 'Ponerte los guantes de trabajo' },
            { picto: '📋', text: 'Ver la lista de tareas del día' }
          ] },
          { name: 'Un encargo del taller', items: [
            { picto: '📋', text: 'Leer el encargo' },
            { picto: '📦', text: 'Preparar el material' },
            { picto: '🔧', text: 'Hacer el trabajo' },
            { picto: '✅', text: 'Revisar que está bien done' }
          ] },
          { name: 'Tu descanso en el trabajo', items: [
            { picto: '🕐', text: 'Esperar a que sea la hora' },
            { picto: '🥪', text: 'Sacar la comida' },
            { picto: '🍽️', text: 'Comer con calma' },
            { picto: '🔙', text: 'Volver a tu puesto' }
          ] },
          { name: 'Terminar y volver a casa', items: [
            { picto: '🧹', text: 'Recoger tu puesto de trabajo' },
            { picto: '🕐', text: 'Fichar la salida' },
            { picto: '🚌', text: 'Coger el autobús de vuelta' },
            { picto: '🔑', text: 'Llegar a casa' }
          ] },
          { name: 'Tu tarde en casa', items: [
            { picto: '🧺', text: 'Cambiarte de ropa' },
            { picto: '📺', text: 'Descansar un rato' },
            { picto: '🛒', text: 'Ir a comprar lo que falte' },
            { picto: '🍲', text: 'Preparar la cena' }
          ] },
          { name: 'Antes de dormir', items: [
            { picto: '🍽️', text: 'Cenar' },
            { picto: '🧴', text: 'Ducharte' },
            { picto: '🪥', text: 'Lavarte los dientes' },
            { picto: '😴', text: 'Meterte en la cama' }
          ] },
          { name: 'Dejar todo listo para mañana', items: [
            { picto: '👕', text: 'Preparar la ropa de trabajo' },
            { picto: '🎒', text: 'Dejar la mochila lista' },
            { picto: '⏰', text: 'Poner el despertador' },
            { picto: '🌙', text: 'Apagar la luz' }
          ] }
        ]      },
      {
        id: 3,
        name: 'Nivel 3',
        descripcion: 'Crea tu lista',
        estrellas: 1,
        listasLibres: true      }
    ]
  },
  en: {
    porRonda: 5,
    niveles: [
      {
        id: 1,
        name: 'Level 1',
        descripcion: '3 tasks',
        estrellas: 1,
        listas: [
          { name: 'Your morning before leaving', items: [
            { picto: '👕', text: 'Get dressed' },
            { picto: '🥐', text: 'Have breakfast' },
            { picto: '🎒', text: 'Grab your bag and go' }
          ] },
          { name: 'Getting to work', items: [
            { picto: '🚌', text: 'Catch the bus' },
            { picto: '🏢', text: 'Go into work' },
            { picto: '🕐', text: 'Clock in' }
          ] },
          { name: 'A task at the workshop', items: [
            { picto: '📦', text: 'Get the boxes' },
            { picto: '🏷️', text: 'Put on the labels' },
            { picto: '📚', text: 'Stack them in their place' }
          ] },
          { name: 'Finishing your shift', items: [
            { picto: '🧹', text: 'Tidy your workstation' },
            { picto: '🕐', text: 'Clock out' },
            { picto: '🚪', text: 'Leave work' }
          ] },
          { name: 'Getting back home', items: [
            { picto: '🚌', text: 'Catch the bus back' },
            { picto: '🔑', text: 'Open the front door' },
            { picto: '🛋️', text: 'Rest for a while' }
          ] },
          { name: 'Before dinner', items: [
            { picto: '🧺', text: 'Put away your work clothes' },
            { picto: '🧼', text: 'Wash your hands' },
            { picto: '🍲', text: 'Set the table for dinner' }
          ] },
          { name: 'Your evening', items: [
            { picto: '🍽️', text: 'Have dinner' },
            { picto: '🪥', text: 'Brush your teeth' },
            { picto: '😴', text: 'Go to sleep' }
          ] },
          { name: 'Getting ready for tomorrow', items: [
            { picto: '⏰', text: 'Set the alarm' },
            { picto: '🎒', text: 'Leave your bag ready' },
            { picto: '🌙', text: 'Turn off the light' }
          ] }
        ]
      },
      {
        id: 2,
        name: 'Level 2',
        descripcion: '4 tasks',
        estrellas: 2,
        listas: [
          { name: 'Before leaving for work', items: [
            { picto: '⏰', text: 'Wake up to the alarm' },
            { picto: '🪥', text: 'Wash and get ready' },
            { picto: '👕', text: 'Put on your work clothes' },
            { picto: '🥐', text: 'Have breakfast' }
          ] },
          { name: 'Arriving and getting ready at work', items: [
            { picto: '🚌', text: 'Catch the bus' },
            { picto: '🕐', text: 'Clock in' },
            { picto: '🧤', text: 'Put on your work gloves' },
            { picto: '📋', text: "Check the day's task list" }
          ] },
          { name: 'A workshop order', items: [
            { picto: '📋', text: 'Read the order' },
            { picto: '📦', text: 'Get the materials ready' },
            { picto: '🔧', text: 'Do the work' },
            { picto: '✅', text: 'Check it is done well' }
          ] },
          { name: 'Your break at work', items: [
            { picto: '🕐', text: 'Wait until it is time' },
            { picto: '🥪', text: 'Get out your food' },
            { picto: '🍽️', text: 'Eat calmly' },
            { picto: '🔙', text: 'Go back to your workstation' }
          ] },
          { name: 'Finishing and heading home', items: [
            { picto: '🧹', text: 'Tidy your workstation' },
            { picto: '🕐', text: 'Clock out' },
            { picto: '🚌', text: 'Catch the bus back' },
            { picto: '🔑', text: 'Arrive home' }
          ] },
          { name: 'Your afternoon at home', items: [
            { picto: '🧺', text: 'Change your clothes' },
            { picto: '📺', text: 'Rest for a while' },
            { picto: '🛒', text: 'Go buy what is missing' },
            { picto: '🍲', text: 'Get dinner ready' }
          ] },
          { name: 'Before bed', items: [
            { picto: '🍽️', text: 'Have dinner' },
            { picto: '🧴', text: 'Take a shower' },
            { picto: '🪥', text: 'Brush your teeth' },
            { picto: '😴', text: 'Get into bed' }
          ] },
          { name: 'Getting everything ready for tomorrow', items: [
            { picto: '👕', text: 'Get your work clothes ready' },
            { picto: '🎒', text: 'Leave your bag ready' },
            { picto: '⏰', text: 'Set the alarm' },
            { picto: '🌙', text: 'Turn off the light' }
          ] }
        ]
      },
      {
        id: 3,
        name: 'Level 3',
        descripcion: 'Create your list',
        estrellas: 1,
        listasLibres: true
      }
    ]
  }
};
