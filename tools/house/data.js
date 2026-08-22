/* ============================================================
   Datos: La Casa (autonomía — tareas del hogar).

   Forma:
     DATA.<locale> = {
       iconos:         string[]      // pool de emojis para añadir tareas
       pasosPlantilla: string[]      // 5 pictogramas por defecto
       tareas: [{
         id, nombre, picto, pasos: string[]
       }]
     }

   - 'pasos' se conserva en el orden correcto (el primero se hace
     primero). No cambian entre idiomas.
   - 'nombre' se traduce; 'pasos' son pictogramas y se mantienen.
   - 'iconos' y 'pasosPlantilla' se comparten entre idiomas (los
     emojis no se traducen).
   - 'tareas.usuario' se reserva para las tareas añadidas en
     sesión por la persona (no se persisten).

   app.js lee:  DATA[App.i18n.locale()] || DATA.es
   ============================================================ */
var DATA = {
  es: {
    iconos: [
      '🏠', '🛏️', '🍽️', '🥣', '🥛', '🍞', '🥪', '🥕', '🍳',
      '🧽', '🧺', '🪣', '🧹', '🚿', '🚮', '🪴', '🌱', '🌸',
      '🐶', '🐱', '🐦', '🐠', '🦜', '🐢', '🐰',
      '📚', '🎒', '✏️', '📝', '🖍️',
      '🛒', '🛍️', '💳', '💵', '🪙',
      '💡', '🔑', '🚪', '🪟', '🧱', '📦', '🧴',
      '🪑', '🛋️', '🛌', '🛁', '🚽', '🪥', '🧴',
      '🧊', '🔥', '☀️', '🌙', '⏰', '📅',
      '☎️', '📱', '💊', '🩹', '🩺', '💉',
      '👕', '👖', '👗', '🧦', '🧣', '🧤', '🧢', '👟', '🥾',
      '🪥', '🧼', '🧻', '🧺', '🪣', '🧯',
      '🪞', '💇', '💆', '✂️',
      '🎂', '🎁', '🎈', '🎉', '🪅',
      '🚗', '🚲', '🚌', '🚶', '🏃'
    ],
    pasosPlantilla: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'],

    tareas: [
      /* --- Mesa y comida --- */
      { id: 'mesa',         nombre: 'Poner la mesa',                  picto: '🍽️', pasos: ['🍽️', '🍴', '🥄', '🥤', '🪑'] },
      { id: 'recoger',      nombre: 'Recoger la mesa',                picto: '🧽', pasos: ['🍽️', '🍴', '🥄', '🧽', '✨'] },
      { id: 'merienda',     nombre: 'Preparar la merienda',           picto: '🥪', pasos: ['🍞', '🧈', '🔪', '🍽️', '😋'] },
      { id: 'desayuno',     nombre: 'Preparar el desayuno',           picto: '🥣', pasos: ['🥣', '🥛', '🍞', '🥄', '😋'] },
      { id: 'cena',         nombre: 'Preparar la cena',               picto: '🌙', pasos: ['🥣', '🍞', '🥄', '🥛', '😋'] },

      /* --- Platos y cocina --- */
      { id: 'platos',       nombre: 'Fregar los platos',              picto: '🧽', pasos: ['🍽️', '🧽', '🧴', '🚿', '✨'] },
      { id: 'cocinar',      nombre: 'Cocinar una comida',             picto: '🍳', pasos: ['🥕', '🔪', '🍳', '🍽️', '🧽'] },
      { id: 'receta',       nombre: 'Seguir una receta',              picto: '📝', pasos: ['📖', '📝', '🥕', '🍳', '😋'] },
      { id: 'lavavajillas', nombre: 'Cargar el lavavajillas',         picto: '🍽️', pasos: ['🍽️', '🧴', '🚪', '▶️', '✨'] },

      /* --- Ropa y lavadora --- */
      { id: 'doblar',       nombre: 'Doblar la ropa',                 picto: '👕', pasos: ['🧺', '👕', '👖', '🧦', '🗄️'] },
      { id: 'lavar',        nombre: 'Poner la lavadora',              picto: '🌀', pasos: ['🧺', '🧴', '🌀', '👕', '🚪'] },
      { id: 'tender',       nombre: 'Tender la ropa',                 picto: '☀️', pasos: ['🧺', '🪝', '👕', '💧', '☀️'] },
      { id: 'recogerRopa',  nombre: 'Recoger la ropa tendida',        picto: '🧺', pasos: ['🧺', '👕', '🪝', '🗄️', '✨'] },
      { id: 'plancha',      nombre: 'Planchar la ropa',               picto: '🔥', pasos: ['🪑', '👕', '🔥', '👕', '🗄️'] },
      { id: 'armario',      nombre: 'Guardar la ropa en el armario',  picto: '🚪', pasos: ['🗄️', '👕', '👖', '🚪', '✨'] },

      /* --- Hacer la cama --- */
      { id: 'cama',         nombre: 'Hacer la cama',                  picto: '🛏️', pasos: ['🛏️', '🧴', '🛌', '🪟', '✨'] },
      { id: 'cambiarRopaCama',nombre:'Cambiar las sábanas',           picto: '🛌', pasos: ['🛌', '🧺', '🛏️', '🛌', '✨'] },

      /* --- Limpieza general --- */
      { id: 'barrer',       nombre: 'Barrer el suelo',                picto: '🧹', pasos: ['🧹', '🗑️', '🚪', '🧺', '✨'] },
      { id: 'fregar',       nombre: 'Fregar el suelo',                picto: '🪣', pasos: ['🪣', '🧴', '🧹', '🚪', '✨'] },
      { id: 'polvo',        nombre: 'Limpiar el polvo',               picto: '🪑', pasos: ['🪑', '🧴', '🧽', '🗑️', '✨'] },
      { id: 'habitacion',   nombre: 'Ordenar mi habitación',          picto: '🛏️', pasos: ['🛏️', '👕', '🧸', '📦', '✨'] },
      { id: 'cocinaLimpia', nombre: 'Limpiar la cocina',              picto: '🍳', pasos: ['🍽️', '🧽', '🧴', '🧹', '✨'] },
      { id: 'bano',         nombre: 'Limpiar el baño',                picto: '🛁', pasos: ['🧴', '🧽', '🚿', '🪥', '✨'] },
      { id: 'ventanas',     nombre: 'Limpiar las ventanas',           picto: '🪟', pasos: ['🧴', '🧽', '🪟', '☀️', '✨'] },
      { id: 'aspirar',      nombre: 'Pasar la aspiradora',            picto: '🧹', pasos: ['🔌', '🧹', '🚪', '🧺', '✨'] },

      /* --- Basura y reciclaje --- */
      { id: 'basura',       nombre: 'Sacar la basura',                picto: '🚮', pasos: ['🗑️', '🪢', '🚪', '🚮', '✨'] },
      { id: 'reciclar',     nombre: 'Separar el reciclaje',           picto: '♻️', pasos: ['🗑️', '♻️', '📦', '🚮', '✨'] },

      /* --- Plantas y jardín --- */
      { id: 'plantas',      nombre: 'Regar las plantas',              picto: '🪴', pasos: ['🪴', '🚰', '💧', '☀️', '✨'] },
      { id: 'jardin',       nombre: 'Regar el jardín',                picto: '🌱', pasos: ['🚿', '🌱', '💧', '🌸', '☀️'] },
      { id: 'semilla',      nombre: 'Plantar una semilla',            picto: '🌰', pasos: ['🌰', '🕳️', '🌱', '🚰', '☀️'] },

      /* --- Mascotas --- */
      { id: 'pasear',       nombre: 'Pasear al perro',                picto: '🐶', pasos: ['🐶', '🦮', '🚪', '🌳', '🏠'] },
      { id: 'banarPerro',   nombre: 'Bañar al perro',                 picto: '🛁', pasos: ['🐶', '🛁', '🧼', '💧', '🐩'] },
      { id: 'comidaPerro',  nombre: 'Dar de comer al perro',          picto: '🦴', pasos: ['🥣', '🥄', '🦴', '🐶', '✨'] },
      { id: 'comidaGato',   nombre: 'Dar de comer al gato',           picto: '🐱', pasos: ['🥣', '🥫', '🥄', '🐱', '✨'] },
      { id: 'arenero',      nombre: 'Limpiar el arenero del gato',    picto: '🐈', pasos: ['🧹', '🪣', '🐈', '🧴', '✨'] },
      { id: 'comidaPajaro', nombre: 'Dar de comer al pájaro',         picto: '🐦', pasos: ['🐦', '🌾', '🚰', '🪺', '✨'] },
      { id: 'limpiarPecera',nombre: 'Limpiar la pecera',              picto: '🐠', pasos: ['🐠', '🪣', '💧', '🐠', '✨'] },

      /* --- Compra y comida fuera --- */
      { id: 'compra',       nombre: 'Hacer la compra semanal',        picto: '🛒', pasos: ['📝', '🛒', '💳', '🛍️', '🏠'] },
      { id: 'fruta',        nombre: 'Lavar la fruta',                 picto: '🍎', pasos: ['🍎', '🚿', '💧', '🍽️', '😋'] },
      { id: 'nevera',       nombre: 'Guardar la comida en la nevera', picto: '🧊', pasos: ['🛍️', '🧴', '🧊', '🚪', '✨'] },

      /* --- Preparar el cole --- */
      { id: 'mochila',      nombre: 'Preparar la mochila del cole',   picto: '🎒', pasos: ['🎒', '📚', '✏️', '🍎', '🚪'] },
      { id: 'uniforme',     nombre: 'Preparar el uniforme del cole',  picto: '👕', pasos: ['👕', '👖', '👟', '🎒', '🚪'] },

      /* --- Fiesta en casa --- */
      { id: 'fiesta',       nombre: 'Preparar una fiesta en casa',    picto: '🎉', pasos: ['📝', '🛒', '🎈', '🎂', '🎉'] },
      { id: 'invitados',    nombre: 'Preparar la mesa para invitados',picto: '🍽️', pasos: ['🧽', '🍽️', '🍴', '🥤', '🪑'] },

      /* --- Higiene personal --- */
      { id: 'ducha',        nombre: 'Ducharme',                       picto: '🚿', pasos: ['🚿', '🧼', '💧', '🧴', '😌'] },
      { id: 'dientes',      nombre: 'Lavarme los dientes',            picto: '🪥', pasos: ['🪥', '🧴', '💧', '🪞', '✨'] },
      { id: 'manos',        nombre: 'Lavarme las manos',              picto: '🧼', pasos: ['🚰', '🧼', '💧', '🧻', '✨'] },

      /* --- Ropa y aspecto --- */
      { id: 'vestirme',     nombre: 'Vestirme',                       picto: '👕', pasos: ['👕', '👖', '👟', '🪞', '✨'] },
      { id: 'peinarme',     nombre: 'Peinarme',                       picto: '💇', pasos: ['🪞', '💇', '💆', '🪞', '✨'] },

      /* --- Salir y volver a casa --- */
      { id: 'salirCasa',    nombre: 'Salir de casa',                  picto: '🚪', pasos: ['🪥', '👟', '🔑', '🚪', '🏃'] },
      { id: 'volverCasa',   nombre: 'Volver a casa',                  picto: '🏠', pasos: ['🔑', '🚪', '👟', '🛋️', '😌'] },

      /* --- Nuevas tareas útiles --- */
      { id: 'airear',       nombre: 'Airear la habitación',           picto: '🪟', pasos: ['🛏️', '🪟', '🌬️', '⏰', '🪟'] },
      { id: 'tirarColchon', nombre: 'Tender y doblar la ropa de la cama', picto: '🛏️', pasos: ['🛌', '☀️', '🧺', '🗄️', '✨'] },
      { id: 'cargarMovil',  nombre: 'Cargar el móvil',                picto: '🔌', pasos: ['📱', '🔌', '⏰', '🔋', '✨'] },
      { id: 'medicamento',  nombre: 'Tomar la medicina',              picto: '💊', pasos: ['💊', '🥛', '⏰', '🩺', '✨'] },
      { id: 'curita',       nombre: 'Poner una tirita',               picto: '🩹', pasos: ['🩹', '🧼', '🩹', '💧', '✨'] },
      { id: 'cumple',       nombre: 'Preparar un cumpleaños',         picto: '🎂', pasos: ['📝', '🛒', '🎈', '🎂', '🎉'] },
      { id: 'invierno',     nombre: 'Preparar la casa para el frío',  picto: '🔥', pasos: ['🔥', '🧣', '🧤', '🚪', '🛋️'] },
      { id: 'verano',       nombre: 'Preparar la casa para el calor', picto: '🌬️', pasos: ['🪟', '🌬️', '💧', '🧊', '🛋️'] },
      { id: 'botiquin',     nombre: 'Revisar el botiquín',            picto: '💊', pasos: ['💊', '📅', '🩹', '🩺', '✅'] },
      { id: 'llaves',       nombre: 'Dejar las llaves en su sitio',   picto: '🔑', pasos: ['🔑', '🚪', '🪝', '✅', '🏠'] },
      { id: 'basuraReciclar',nombre:'Bajar los contenedores',         picto: '🚮', pasos: ['♻️', '🚪', '🚮', '🪢', '✨'] },
      { id: 'cambiarBombilla',nombre:'Cambiar una bombilla',          picto: '💡', pasos: ['💡', '🪑', '🔌', '💡', '✨'] },
      { id: 'cerrarCasa',   nombre: 'Cerrar la casa para salir',      picto: '🚪', pasos: ['🪟', '🔥', '🔑', '🚪', '✅'] }
    ]
  },

  en: {
    iconos: [
      '🏠', '🛏️', '🍽️', '🥣', '🥛', '🍞', '🥪', '🥕', '🍳',
      '🧽', '🧺', '🪣', '🧹', '🚿', '🚮', '🪴', '🌱', '🌸',
      '🐶', '🐱', '🐦', '🐠', '🦜', '🐢', '🐰',
      '📚', '🎒', '✏️', '📝', '🖍️',
      '🛒', '🛍️', '💳', '💵', '🪙',
      '💡', '🔑', '🚪', '🪟', '🧱', '📦', '🧴',
      '🪑', '🛋️', '🛌', '🛁', '🚽', '🪥', '🧴',
      '🧊', '🔥', '☀️', '🌙', '⏰', '📅',
      '☎️', '📱', '💊', '🩹', '🩺', '💉',
      '👕', '👖', '👗', '🧦', '🧣', '🧤', '🧢', '👟', '🥾',
      '🪥', '🧼', '🧻', '🧺', '🪣', '🧯',
      '🪞', '💇', '💆', '✂️',
      '🎂', '🎁', '🎈', '🎉', '🪅',
      '🚗', '🚲', '🚌', '🚶', '🏃'
    ],
    pasosPlantilla: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'],

    tareas: [
      /* --- Table and food --- */
      { id: 'mesa',         nombre: 'Set the table',                  picto: '🍽️', pasos: ['🍽️', '🍴', '🥄', '🥤', '🪑'] },
      { id: 'recoger',      nombre: 'Clear the table',                picto: '🧽', pasos: ['🍽️', '🍴', '🥄', '🧽', '✨'] },
      { id: 'merienda',     nombre: 'Make a snack',                   picto: '🥪', pasos: ['🍞', '🧈', '🔪', '🍽️', '😋'] },
      { id: 'desayuno',     nombre: 'Make breakfast',                 picto: '🥣', pasos: ['🥣', '🥛', '🍞', '🥄', '😋'] },
      { id: 'cena',         nombre: 'Make dinner',                    picto: '🌙', pasos: ['🥣', '🍞', '🥄', '🥛', '😋'] },

      /* --- Dishes and cooking --- */
      { id: 'platos',       nombre: 'Wash the dishes',                picto: '🧽', pasos: ['🍽️', '🧽', '🧴', '🚿', '✨'] },
      { id: 'cocinar',      nombre: 'Cook a meal',                    picto: '🍳', pasos: ['🥕', '🔪', '🍳', '🍽️', '🧽'] },
      { id: 'receta',       nombre: 'Follow a recipe',                picto: '📝', pasos: ['📖', '📝', '🥕', '🍳', '😋'] },
      { id: 'lavavajillas', nombre: 'Load the dishwasher',            picto: '🍽️', pasos: ['🍽️', '🧴', '🚪', '▶️', '✨'] },

      /* --- Laundry --- */
      { id: 'doblar',       nombre: 'Fold the clothes',               picto: '👕', pasos: ['🧺', '👕', '👖', '🧦', '🗄️'] },
      { id: 'lavar',        nombre: 'Do the laundry',                 picto: '🌀', pasos: ['🧺', '🧴', '🌀', '👕', '🚪'] },
      { id: 'tender',       nombre: 'Hang out the laundry',           picto: '☀️', pasos: ['🧺', '🪝', '👕', '💧', '☀️'] },
      { id: 'recogerRopa',  nombre: 'Bring in the laundry',           picto: '🧺', pasos: ['🧺', '👕', '🪝', '🗄️', '✨'] },
      { id: 'plancha',      nombre: 'Iron the clothes',               picto: '🔥', pasos: ['🪑', '👕', '🔥', '👕', '🗄️'] },
      { id: 'armario',      nombre: 'Put away the clothes',           picto: '🚪', pasos: ['🗄️', '👕', '👖', '🚪', '✨'] },

      /* --- Make the bed --- */
      { id: 'cama',         nombre: 'Make the bed',                   picto: '🛏️', pasos: ['🛏️', '🧴', '🛌', '🪟', '✨'] },
      { id: 'cambiarRopaCama',nombre:'Change the sheets',             picto: '🛌', pasos: ['🛌', '🧺', '🛏️', '🛌', '✨'] },

      /* --- General cleaning --- */
      { id: 'barrer',       nombre: 'Sweep the floor',                picto: '🧹', pasos: ['🧹', '🗑️', '🚪', '🧺', '✨'] },
      { id: 'fregar',       nombre: 'Mop the floor',                  picto: '🪣', pasos: ['🪣', '🧴', '🧹', '🚪', '✨'] },
      { id: 'polvo',        nombre: 'Dust the furniture',             picto: '🪑', pasos: ['🪑', '🧴', '🧽', '🗑️', '✨'] },
      { id: 'habitacion',   nombre: 'Tidy up my bedroom',             picto: '🛏️', pasos: ['🛏️', '👕', '🧸', '📦', '✨'] },
      { id: 'cocinaLimpia', nombre: 'Clean the kitchen',              picto: '🍳', pasos: ['🍽️', '🧽', '🧴', '🧹', '✨'] },
      { id: 'bano',         nombre: 'Clean the bathroom',             picto: '🛁', pasos: ['🧴', '🧽', '🚿', '🪥', '✨'] },
      { id: 'ventanas',     nombre: 'Clean the windows',              picto: '🪟', pasos: ['🧴', '🧽', '🪟', '☀️', '✨'] },
      { id: 'aspirar',      nombre: 'Vacuum the floor',               picto: '🧹', pasos: ['🔌', '🧹', '🚪', '🧺', '✨'] },

      /* --- Trash --- */
      { id: 'basura',       nombre: 'Take out the trash',             picto: '🚮', pasos: ['🗑️', '🪢', '🚪', '🚮', '✨'] },
      { id: 'reciclar',     nombre: 'Sort the recycling',             picto: '♻️', pasos: ['🗑️', '♻️', '📦', '🚮', '✨'] },

      /* --- Plants and garden --- */
      { id: 'plantas',      nombre: 'Water the plants',               picto: '🪴', pasos: ['🪴', '🚰', '💧', '☀️', '✨'] },
      { id: 'jardin',       nombre: 'Water the garden',               picto: '🌱', pasos: ['🚿', '🌱', '💧', '🌸', '☀️'] },
      { id: 'semilla',      nombre: 'Plant a seed',                   picto: '🌰', pasos: ['🌰', '🕳️', '🌱', '🚰', '☀️'] },

      /* --- Pets --- */
      { id: 'pasear',       nombre: 'Walk the dog',                   picto: '🐶', pasos: ['🐶', '🦮', '🚪', '🌳', '🏠'] },
      { id: 'banarPerro',   nombre: 'Bathe the dog',                  picto: '🛁', pasos: ['🐶', '🛁', '🧼', '💧', '🐩'] },
      { id: 'comidaPerro',  nombre: 'Feed the dog',                   picto: '🦴', pasos: ['🥣', '🥄', '🦴', '🐶', '✨'] },
      { id: 'comidaGato',   nombre: 'Feed the cat',                   picto: '🐱', pasos: ['🥣', '🥫', '🥄', '🐱', '✨'] },
      { id: 'arenero',      nombre: 'Clean the cat litter',           picto: '🐈', pasos: ['🧹', '🪣', '🐈', '🧴', '✨'] },
      { id: 'comidaPajaro', nombre: 'Feed the bird',                  picto: '🐦', pasos: ['🐦', '🌾', '🚰', '🪺', '✨'] },
      { id: 'limpiarPecera',nombre: 'Clean the fish tank',            picto: '🐠', pasos: ['🐠', '🪣', '💧', '🐠', '✨'] },

      /* --- Shopping --- */
      { id: 'compra',       nombre: 'Do the weekly shopping',         picto: '🛒', pasos: ['📝', '🛒', '💳', '🛍️', '🏠'] },
      { id: 'fruta',        nombre: 'Wash the fruit',                 picto: '🍎', pasos: ['🍎', '🚿', '💧', '🍽️', '😋'] },
      { id: 'nevera',       nombre: 'Put the food in the fridge',     picto: '🧊', pasos: ['🛍️', '🧴', '🧊', '🚪', '✨'] },

      /* --- School bag --- */
      { id: 'mochila',      nombre: 'Pack the school bag',            picto: '🎒', pasos: ['🎒', '📚', '✏️', '🍎', '🚪'] },
      { id: 'uniforme',     nombre: 'Get the school uniform ready',   picto: '👕', pasos: ['👕', '👖', '👟', '🎒', '🚪'] },

      /* --- Party at home --- */
      { id: 'fiesta',       nombre: 'Set up a party at home',         picto: '🎉', pasos: ['📝', '🛒', '🎈', '🎂', '🎉'] },
      { id: 'invitados',    nombre: 'Set the table for guests',       picto: '🍽️', pasos: ['🧽', '🍽️', '🍴', '🥤', '🪑'] },

      /* --- Personal hygiene --- */
      { id: 'ducha',        nombre: 'Take a shower',                  picto: '🚿', pasos: ['🚿', '🧼', '💧', '🧴', '😌'] },
      { id: 'dientes',      nombre: 'Brush my teeth',                 picto: '🪥', pasos: ['🪥', '🧴', '💧', '🪞', '✨'] },
      { id: 'manos',        nombre: 'Wash my hands',                  picto: '🧼', pasos: ['🚰', '🧼', '💧', '🧻', '✨'] },

      /* --- Clothing --- */
      { id: 'vestirme',     nombre: 'Get dressed',                    picto: '👕', pasos: ['👕', '👖', '👟', '🪞', '✨'] },
      { id: 'peinarme',     nombre: 'Comb my hair',                   picto: '💇', pasos: ['🪞', '💇', '💆', '🪞', '✨'] },

      /* --- Leaving and coming back home --- */
      { id: 'salirCasa',    nombre: 'Leave the house',                picto: '🚪', pasos: ['🪥', '👟', '🔑', '🚪', '🏃'] },
      { id: 'volverCasa',   nombre: 'Come back home',                 picto: '🏠', pasos: ['🔑', '🚪', '👟', '🛋️', '😌'] },

      /* --- New useful tasks --- */
      { id: 'airear',       nombre: 'Air out the room',               picto: '🪟', pasos: ['🛏️', '🪟', '🌬️', '⏰', '🪟'] },
      { id: 'tirarColchon', nombre: 'Make the bed and air it',        picto: '🛏️', pasos: ['🛌', '☀️', '🧺', '🗄️', '✨'] },
      { id: 'cargarMovil',  nombre: 'Charge the phone',               picto: '🔌', pasos: ['📱', '🔌', '⏰', '🔋', '✨'] },
      { id: 'medicamento',  nombre: 'Take the medicine',              picto: '💊', pasos: ['💊', '🥛', '⏰', '🩺', '✨'] },
      { id: 'curita',       nombre: 'Put on a plaster',               picto: '🩹', pasos: ['🩹', '🧼', '🩹', '💧', '✨'] },
      { id: 'cumple',       nombre: 'Prepare a birthday',             picto: '🎂', pasos: ['📝', '🛒', '🎈', '🎂', '🎉'] },
      { id: 'invierno',     nombre: 'Get the house ready for cold',   picto: '🔥', pasos: ['🔥', '🧣', '🧤', '🚪', '🛋️'] },
      { id: 'verano',       nombre: 'Get the house ready for heat',   picto: '🌬️', pasos: ['🪟', '🌬️', '💧', '🧊', '🛋️'] },
      { id: 'botiquin',     nombre: 'Check the first-aid kit',        picto: '💊', pasos: ['💊', '📅', '🩹', '🩺', '✅'] },
      { id: 'llaves',       nombre: 'Put the keys back in their place', picto: '🔑', pasos: ['🔑', '🚪', '🪝', '✅', '🏠'] },
      { id: 'basuraReciclar',nombre:'Take down the bins',             picto: '🚮', pasos: ['♻️', '🚪', '🚮', '🪢', '✨'] },
      { id: 'cambiarBombilla',nombre:'Change a lightbulb',            picto: '💡', pasos: ['💡', '🪑', '🔌', '💡', '✨'] },
      { id: 'cerrarCasa',   nombre: 'Lock up the house before leaving', picto: '🚪', pasos: ['🪟', '🔥', '🔑', '🚪', '✅'] }
    ]
  }
};