/* ============================================================
   Datos: La Casa (autonomía — tareas del hogar).

   Forma:
     DATA.<locale> = {
       icons:         string[]      // pool de emojis para añadir tareas
       templateSteps: string[]      // 5 pictogramas por defecto
       tasks: [{
         id, name, picto, steps: string[]
       }]
     }

   - 'steps' se conserva en el orden correct (el primero se hace
     primero). No cambian entre idiomas.
   - 'name' se traduce; 'steps' son pictogramas y se mantienen.
   - 'icons' y 'templateSteps' se comparten entre idiomas (los
     emojis no se traducen).
   - 'tareas.usuario' se reserva para las tareas añadidas en
     sesión por la persona (no se persisten).

   app.js lee:  DATA[App.i18n.locale()] || DATA.es
   ============================================================ */
var DATA = {
  es: {
    icons: [
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
    templateSteps: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'],

    tasks: [
      /* --- Mesa y comida --- */
      { id: 'mesa',         name: 'Poner la mesa',                  picto: '🍽️', steps: ['🍽️', '🍴', '🥄', '🥤', '🪑'] },
      { id: 'recoger',      name: 'Recoger la mesa',                picto: '🧽', steps: ['🍽️', '🍴', '🥄', '🧽', '✨'] },
      { id: 'merienda',     name: 'Preparar la merienda',           picto: '🥪', steps: ['🍞', '🧈', '🔪', '🍽️', '😋'] },
      { id: 'desayuno',     name: 'Preparar el desayuno',           picto: '🥣', steps: ['🥣', '🥛', '🍞', '🥄', '😋'] },
      { id: 'cena',         name: 'Preparar la cena',               picto: '🌙', steps: ['🥣', '🍞', '🥄', '🥛', '😋'] },

      /* --- Platos y cocina --- */
      { id: 'platos',       name: 'Fregar los platos',              picto: '🧽', steps: ['🍽️', '🧽', '🧴', '🚿', '✨'] },
      { id: 'cocinar',      name: 'Cocinar una comida',             picto: '🍳', steps: ['🥕', '🔪', '🍳', '🍽️', '🧽'] },
      { id: 'receta',       name: 'Seguir una receta',              picto: '📝', steps: ['📖', '📝', '🥕', '🍳', '😋'] },
      { id: 'lavavajillas', name: 'Cargar el lavavajillas',         picto: '🍽️', steps: ['🍽️', '🧴', '🚪', '▶️', '✨'] },

      /* --- Ropa y lavadora --- */
      { id: 'doblar',       name: 'Doblar la ropa',                 picto: '👕', steps: ['🧺', '👕', '👖', '🧦', '🗄️'] },
      { id: 'lavar',        name: 'Poner la lavadora',              picto: '🌀', steps: ['🧺', '🧴', '🌀', '👕', '🚪'] },
      { id: 'tender',       name: 'Tender la ropa',                 picto: '☀️', steps: ['🧺', '🪝', '👕', '💧', '☀️'] },
      { id: 'recogerRopa',  name: 'Recoger la ropa tendida',        picto: '🧺', steps: ['🧺', '👕', '🪝', '🗄️', '✨'] },
      { id: 'plancha',      name: 'Planchar la ropa',               picto: '🔥', steps: ['🪑', '👕', '🔥', '👕', '🗄️'] },
      { id: 'armario',      name: 'Guardar la ropa en el armario',  picto: '🚪', steps: ['🗄️', '👕', '👖', '🚪', '✨'] },

      /* --- Hacer la cama --- */
      { id: 'cama',         name: 'Hacer la cama',                  picto: '🛏️', steps: ['🛏️', '🧴', '🛌', '🪟', '✨'] },
      { id: 'cambiarRopaCama',name:'Cambiar las sábanas',           picto: '🛌', steps: ['🛌', '🧺', '🛏️', '🛌', '✨'] },

      /* --- Limpieza general --- */
      { id: 'barrer',       name: 'Barrer el suelo',                picto: '🧹', steps: ['🧹', '🗑️', '🚪', '🧺', '✨'] },
      { id: 'fregar',       name: 'Fregar el suelo',                picto: '🪣', steps: ['🪣', '🧴', '🧹', '🚪', '✨'] },
      { id: 'polvo',        name: 'Limpiar el polvo',               picto: '🪑', steps: ['🪑', '🧴', '🧽', '🗑️', '✨'] },
      { id: 'habitacion',   name: 'Ordenar mi habitación',          picto: '🛏️', steps: ['🛏️', '👕', '🧸', '📦', '✨'] },
      { id: 'cocinaLimpia', name: 'Limpiar la cocina',              picto: '🍳', steps: ['🍽️', '🧽', '🧴', '🧹', '✨'] },
      { id: 'bano',         name: 'Limpiar el baño',                picto: '🛁', steps: ['🧴', '🧽', '🚿', '🪥', '✨'] },
      { id: 'ventanas',     name: 'Limpiar las ventanas',           picto: '🪟', steps: ['🧴', '🧽', '🪟', '☀️', '✨'] },
      { id: 'aspirar',      name: 'Pasar la aspiradora',            picto: '🧹', steps: ['🔌', '🧹', '🚪', '🧺', '✨'] },

      /* --- Basura y reciclaje --- */
      { id: 'basura',       name: 'Sacar la basura',                picto: '🚮', steps: ['🗑️', '🪢', '🚪', '🚮', '✨'] },
      { id: 'reciclar',     name: 'Separar el reciclaje',           picto: '♻️', steps: ['🗑️', '♻️', '📦', '🚮', '✨'] },

      /* --- Plantas y jardín --- */
      { id: 'plantas',      name: 'Regar las plantas',              picto: '🪴', steps: ['🪴', '🚰', '💧', '☀️', '✨'] },
      { id: 'jardin',       name: 'Regar el jardín',                picto: '🌱', steps: ['🚿', '🌱', '💧', '🌸', '☀️'] },
      { id: 'semilla',      name: 'Plantar una semilla',            picto: '🌰', steps: ['🌰', '🕳️', '🌱', '🚰', '☀️'] },

      /* --- Mascotas --- */
      { id: 'pasear',       name: 'Pasear al perro',                picto: '🐶', steps: ['🐶', '🦮', '🚪', '🌳', '🏠'] },
      { id: 'banarPerro',   name: 'Bañar al perro',                 picto: '🛁', steps: ['🐶', '🛁', '🧼', '💧', '🐩'] },
      { id: 'comidaPerro',  name: 'Dar de comer al perro',          picto: '🦴', steps: ['🥣', '🥄', '🦴', '🐶', '✨'] },
      { id: 'comidaGato',   name: 'Dar de comer al gato',           picto: '🐱', steps: ['🥣', '🥫', '🥄', '🐱', '✨'] },
      { id: 'arenero',      name: 'Limpiar el arenero del gato',    picto: '🐈', steps: ['🧹', '🪣', '🐈', '🧴', '✨'] },
      { id: 'comidaPajaro', name: 'Dar de comer al pájaro',         picto: '🐦', steps: ['🐦', '🌾', '🚰', '🪺', '✨'] },
      { id: 'limpiarPecera',name: 'Limpiar la pecera',              picto: '🐠', steps: ['🐠', '🪣', '💧', '🐠', '✨'] },

      /* --- Compra y comida fuera --- */
      { id: 'compra',       name: 'Hacer la compra semanal',        picto: '🛒', steps: ['📝', '🛒', '💳', '🛍️', '🏠'] },
      { id: 'fruta',        name: 'Lavar la fruta',                 picto: '🍎', steps: ['🍎', '🚿', '💧', '🍽️', '😋'] },
      { id: 'nevera',       name: 'Guardar la comida en la nevera', picto: '🧊', steps: ['🛍️', '🧴', '🧊', '🚪', '✨'] },

      /* --- Preparar el cole --- */
      { id: 'mochila',      name: 'Preparar la mochila del cole',   picto: '🎒', steps: ['🎒', '📚', '✏️', '🍎', '🚪'] },
      { id: 'uniforme',     name: 'Preparar el uniforme del cole',  picto: '👕', steps: ['👕', '👖', '👟', '🎒', '🚪'] },

      /* --- Fiesta en casa --- */
      { id: 'fiesta',       name: 'Preparar una fiesta en casa',    picto: '🎉', steps: ['📝', '🛒', '🎈', '🎂', '🎉'] },
      { id: 'invitados',    name: 'Preparar la mesa para invitados',picto: '🍽️', steps: ['🧽', '🍽️', '🍴', '🥤', '🪑'] },

      /* --- Higiene personal --- */
      { id: 'ducha',        name: 'Ducharme',                       picto: '🚿', steps: ['🚿', '🧼', '💧', '🧴', '😌'] },
      { id: 'dientes',      name: 'Lavarme los dientes',            picto: '🪥', steps: ['🪥', '🧴', '💧', '🪞', '✨'] },
      { id: 'manos',        name: 'Lavarme las manos',              picto: '🧼', steps: ['🚰', '🧼', '💧', '🧻', '✨'] },

      /* --- Ropa y aspecto --- */
      { id: 'vestirme',     name: 'Vestirme',                       picto: '👕', steps: ['👕', '👖', '👟', '🪞', '✨'] },
      { id: 'peinarme',     name: 'Peinarme',                       picto: '💇', steps: ['🪞', '💇', '💆', '🪞', '✨'] },

      /* --- Salir y volver a casa --- */
      { id: 'salirCasa',    name: 'Salir de casa',                  picto: '🚪', steps: ['🪥', '👟', '🔑', '🚪', '🏃'] },
      { id: 'volverCasa',   name: 'Volver a casa',                  picto: '🏠', steps: ['🔑', '🚪', '👟', '🛋️', '😌'] },

      /* --- Nuevas tareas útiles --- */
      { id: 'airear',       name: 'Airear la habitación',           picto: '🪟', steps: ['🛏️', '🪟', '🌬️', '⏰', '🪟'] },
      { id: 'tirarColchon', name: 'Tender y doblar la ropa de la cama', picto: '🛏️', steps: ['🛌', '☀️', '🧺', '🗄️', '✨'] },
      { id: 'cargarMovil',  name: 'Cargar el móvil',                picto: '🔌', steps: ['📱', '🔌', '⏰', '🔋', '✨'] },
      { id: 'medicamento',  name: 'Tomar la medicina',              picto: '💊', steps: ['💊', '🥛', '⏰', '🩺', '✨'] },
      { id: 'curita',       name: 'Poner una tirita',               picto: '🩹', steps: ['🩹', '🧼', '🩹', '💧', '✨'] },
      { id: 'cumple',       name: 'Preparar un cumpleaños',         picto: '🎂', steps: ['📝', '🛒', '🎈', '🎂', '🎉'] },
      { id: 'invierno',     name: 'Preparar la casa para el frío',  picto: '🔥', steps: ['🔥', '🧣', '🧤', '🚪', '🛋️'] },
      { id: 'verano',       name: 'Preparar la casa para el calor', picto: '🌬️', steps: ['🪟', '🌬️', '💧', '🧊', '🛋️'] },
      { id: 'botiquin',     name: 'Revisar el botiquín',            picto: '💊', steps: ['💊', '📅', '🩹', '🩺', '✅'] },
      { id: 'llaves',       name: 'Dejar las llaves en su sitio',   picto: '🔑', steps: ['🔑', '🚪', '🪝', '✅', '🏠'] },
      { id: 'basuraReciclar',name:'Bajar los contenedores',         picto: '🚮', steps: ['♻️', '🚪', '🚮', '🪢', '✨'] },
      { id: 'cambiarBombilla',name:'Cambiar una bombilla',          picto: '💡', steps: ['💡', '🪑', '🔌', '💡', '✨'] },
      { id: 'cerrarCasa',   name: 'Cerrar la casa para salir',      picto: '🚪', steps: ['🪟', '🔥', '🔑', '🚪', '✅'] }
    ]
  },

  en: {
    icons: [
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
    templateSteps: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'],

    tasks: [
      /* --- Table and food --- */
      { id: 'mesa',         name: 'Set the table',                  picto: '🍽️', steps: ['🍽️', '🍴', '🥄', '🥤', '🪑'] },
      { id: 'recoger',      name: 'Clear the table',                picto: '🧽', steps: ['🍽️', '🍴', '🥄', '🧽', '✨'] },
      { id: 'merienda',     name: 'Make a snack',                   picto: '🥪', steps: ['🍞', '🧈', '🔪', '🍽️', '😋'] },
      { id: 'desayuno',     name: 'Make breakfast',                 picto: '🥣', steps: ['🥣', '🥛', '🍞', '🥄', '😋'] },
      { id: 'cena',         name: 'Make dinner',                    picto: '🌙', steps: ['🥣', '🍞', '🥄', '🥛', '😋'] },

      /* --- Dishes and cooking --- */
      { id: 'platos',       name: 'Wash the dishes',                picto: '🧽', steps: ['🍽️', '🧽', '🧴', '🚿', '✨'] },
      { id: 'cocinar',      name: 'Cook a meal',                    picto: '🍳', steps: ['🥕', '🔪', '🍳', '🍽️', '🧽'] },
      { id: 'receta',       name: 'Follow a recipe',                picto: '📝', steps: ['📖', '📝', '🥕', '🍳', '😋'] },
      { id: 'lavavajillas', name: 'Load the dishwasher',            picto: '🍽️', steps: ['🍽️', '🧴', '🚪', '▶️', '✨'] },

      /* --- Laundry --- */
      { id: 'doblar',       name: 'Fold the clothes',               picto: '👕', steps: ['🧺', '👕', '👖', '🧦', '🗄️'] },
      { id: 'lavar',        name: 'Do the laundry',                 picto: '🌀', steps: ['🧺', '🧴', '🌀', '👕', '🚪'] },
      { id: 'tender',       name: 'Hang out the laundry',           picto: '☀️', steps: ['🧺', '🪝', '👕', '💧', '☀️'] },
      { id: 'recogerRopa',  name: 'Bring in the laundry',           picto: '🧺', steps: ['🧺', '👕', '🪝', '🗄️', '✨'] },
      { id: 'plancha',      name: 'Iron the clothes',               picto: '🔥', steps: ['🪑', '👕', '🔥', '👕', '🗄️'] },
      { id: 'armario',      name: 'Put away the clothes',           picto: '🚪', steps: ['🗄️', '👕', '👖', '🚪', '✨'] },

      /* --- Make the bed --- */
      { id: 'cama',         name: 'Make the bed',                   picto: '🛏️', steps: ['🛏️', '🧴', '🛌', '🪟', '✨'] },
      { id: 'cambiarRopaCama',name:'Change the sheets',             picto: '🛌', steps: ['🛌', '🧺', '🛏️', '🛌', '✨'] },

      /* --- General cleaning --- */
      { id: 'barrer',       name: 'Sweep the floor',                picto: '🧹', steps: ['🧹', '🗑️', '🚪', '🧺', '✨'] },
      { id: 'fregar',       name: 'Mop the floor',                  picto: '🪣', steps: ['🪣', '🧴', '🧹', '🚪', '✨'] },
      { id: 'polvo',        name: 'Dust the furniture',             picto: '🪑', steps: ['🪑', '🧴', '🧽', '🗑️', '✨'] },
      { id: 'habitacion',   name: 'Tidy up my bedroom',             picto: '🛏️', steps: ['🛏️', '👕', '🧸', '📦', '✨'] },
      { id: 'cocinaLimpia', name: 'Clean the kitchen',              picto: '🍳', steps: ['🍽️', '🧽', '🧴', '🧹', '✨'] },
      { id: 'bano',         name: 'Clean the bathroom',             picto: '🛁', steps: ['🧴', '🧽', '🚿', '🪥', '✨'] },
      { id: 'ventanas',     name: 'Clean the windows',              picto: '🪟', steps: ['🧴', '🧽', '🪟', '☀️', '✨'] },
      { id: 'aspirar',      name: 'Vacuum the floor',               picto: '🧹', steps: ['🔌', '🧹', '🚪', '🧺', '✨'] },

      /* --- Trash --- */
      { id: 'basura',       name: 'Take out the trash',             picto: '🚮', steps: ['🗑️', '🪢', '🚪', '🚮', '✨'] },
      { id: 'reciclar',     name: 'Sort the recycling',             picto: '♻️', steps: ['🗑️', '♻️', '📦', '🚮', '✨'] },

      /* --- Plants and garden --- */
      { id: 'plantas',      name: 'Water the plants',               picto: '🪴', steps: ['🪴', '🚰', '💧', '☀️', '✨'] },
      { id: 'jardin',       name: 'Water the garden',               picto: '🌱', steps: ['🚿', '🌱', '💧', '🌸', '☀️'] },
      { id: 'semilla',      name: 'Plant a seed',                   picto: '🌰', steps: ['🌰', '🕳️', '🌱', '🚰', '☀️'] },

      /* --- Pets --- */
      { id: 'pasear',       name: 'Walk the dog',                   picto: '🐶', steps: ['🐶', '🦮', '🚪', '🌳', '🏠'] },
      { id: 'banarPerro',   name: 'Bathe the dog',                  picto: '🛁', steps: ['🐶', '🛁', '🧼', '💧', '🐩'] },
      { id: 'comidaPerro',  name: 'Feed the dog',                   picto: '🦴', steps: ['🥣', '🥄', '🦴', '🐶', '✨'] },
      { id: 'comidaGato',   name: 'Feed the cat',                   picto: '🐱', steps: ['🥣', '🥫', '🥄', '🐱', '✨'] },
      { id: 'arenero',      name: 'Clean the cat litter',           picto: '🐈', steps: ['🧹', '🪣', '🐈', '🧴', '✨'] },
      { id: 'comidaPajaro', name: 'Feed the bird',                  picto: '🐦', steps: ['🐦', '🌾', '🚰', '🪺', '✨'] },
      { id: 'limpiarPecera',name: 'Clean the fish tank',            picto: '🐠', steps: ['🐠', '🪣', '💧', '🐠', '✨'] },

      /* --- Shopping --- */
      { id: 'compra',       name: 'Do the weekly shopping',         picto: '🛒', steps: ['📝', '🛒', '💳', '🛍️', '🏠'] },
      { id: 'fruta',        name: 'Wash the fruit',                 picto: '🍎', steps: ['🍎', '🚿', '💧', '🍽️', '😋'] },
      { id: 'nevera',       name: 'Put the food in the fridge',     picto: '🧊', steps: ['🛍️', '🧴', '🧊', '🚪', '✨'] },

      /* --- School bag --- */
      { id: 'mochila',      name: 'Pack the school bag',            picto: '🎒', steps: ['🎒', '📚', '✏️', '🍎', '🚪'] },
      { id: 'uniforme',     name: 'Get the school uniform ready',   picto: '👕', steps: ['👕', '👖', '👟', '🎒', '🚪'] },

      /* --- Party at home --- */
      { id: 'fiesta',       name: 'Set up a party at home',         picto: '🎉', steps: ['📝', '🛒', '🎈', '🎂', '🎉'] },
      { id: 'invitados',    name: 'Set the table for guests',       picto: '🍽️', steps: ['🧽', '🍽️', '🍴', '🥤', '🪑'] },

      /* --- Personal hygiene --- */
      { id: 'ducha',        name: 'Take a shower',                  picto: '🚿', steps: ['🚿', '🧼', '💧', '🧴', '😌'] },
      { id: 'dientes',      name: 'Brush my teeth',                 picto: '🪥', steps: ['🪥', '🧴', '💧', '🪞', '✨'] },
      { id: 'manos',        name: 'Wash my hands',                  picto: '🧼', steps: ['🚰', '🧼', '💧', '🧻', '✨'] },

      /* --- Clothing --- */
      { id: 'vestirme',     name: 'Get dressed',                    picto: '👕', steps: ['👕', '👖', '👟', '🪞', '✨'] },
      { id: 'peinarme',     name: 'Comb my hair',                   picto: '💇', steps: ['🪞', '💇', '💆', '🪞', '✨'] },

      /* --- Leaving and coming back home --- */
      { id: 'salirCasa',    name: 'Leave the house',                picto: '🚪', steps: ['🪥', '👟', '🔑', '🚪', '🏃'] },
      { id: 'volverCasa',   name: 'Come back home',                 picto: '🏠', steps: ['🔑', '🚪', '👟', '🛋️', '😌'] },

      /* --- New useful tasks --- */
      { id: 'airear',       name: 'Air out the room',               picto: '🪟', steps: ['🛏️', '🪟', '🌬️', '⏰', '🪟'] },
      { id: 'tirarColchon', name: 'Make the bed and air it',        picto: '🛏️', steps: ['🛌', '☀️', '🧺', '🗄️', '✨'] },
      { id: 'cargarMovil',  name: 'Charge the phone',               picto: '🔌', steps: ['📱', '🔌', '⏰', '🔋', '✨'] },
      { id: 'medicamento',  name: 'Take the medicine',              picto: '💊', steps: ['💊', '🥛', '⏰', '🩺', '✨'] },
      { id: 'curita',       name: 'Put on a plaster',               picto: '🩹', steps: ['🩹', '🧼', '🩹', '💧', '✨'] },
      { id: 'cumple',       name: 'Prepare a birthday',             picto: '🎂', steps: ['📝', '🛒', '🎈', '🎂', '🎉'] },
      { id: 'invierno',     name: 'Get the house ready for cold',   picto: '🔥', steps: ['🔥', '🧣', '🧤', '🚪', '🛋️'] },
      { id: 'verano',       name: 'Get the house ready for heat',   picto: '🌬️', steps: ['🪟', '🌬️', '💧', '🧊', '🛋️'] },
      { id: 'botiquin',     name: 'Check the first-aid kit',        picto: '💊', steps: ['💊', '📅', '🩹', '🩺', '✅'] },
      { id: 'llaves',       name: 'Put the keys back in their place', picto: '🔑', steps: ['🔑', '🚪', '🪝', '✅', '🏠'] },
      { id: 'basuraReciclar',name:'Take down the bins',             picto: '🚮', steps: ['♻️', '🚪', '🚮', '🪢', '✨'] },
      { id: 'cambiarBombilla',name:'Change a lightbulb',            picto: '💡', steps: ['💡', '🪑', '🔌', '💡', '✨'] },
      { id: 'cerrarCasa',   name: 'Lock up the house before leaving', picto: '🚪', steps: ['🪟', '🔥', '🔑', '🚪', '✅'] }
    ]
  }
};