// Activity data: "Good Manners"
// Behavioral norms and social courtesy training
// 
// Structure: { niveles, situaciones }
// - niveles: difficulty progression (changes one variable per level)
// - situaciones: 30+ training scenarios to avoid memorization
//
// NO UI logic or text here. Text goes in strings.es.js and strings.en.js

var DATA = {
  niveles: [
    { name: 'nivel.nivel1', maxSituaciones: 3 },  // Easy: 3 scenarios, all different contexts
    { name: 'nivel.nivel2', maxSituaciones: 4 },  // Medium: 4 scenarios, more options per scenario
    { name: 'nivel.nivel3', maxSituaciones: 5 }   // Hard: 5 scenarios, more complex contexts
  ],

  // 30+ diverse scenarios to practice behavioral norms
  // Each scenario has: context, speaker, message, correctAnswer, distractors
  // Progresses from isolated formulas to integrated social situations
  
  situaciones: [
    // NIVEL 1: Basic gratitude and politeness (alone, clear contexts)
    {
      contexto: 'situacion.dentista',          // At the dentist's office
      personaje: 'dentista',                    // The dentist character
      mensaje: 'mensaje.medicamento',          // "I'm giving you medicine for pain"
      options: ['opcion.gracias', 'opcion.hola', 'opcion.adios'],
      correcta: 'opcion.gracias',              // Thank you
      nivel: 1
    },
    {
      contexto: 'situacion.comida',            // At dinner table
      personaje: 'madre',                       // Mother
      mensaje: 'mensaje.comida',               // "Here's your food"
      options: ['opcion.gracias', 'opcion.buenos_dias', 'opcion.hasta_luego'],
      correcta: 'opcion.gracias',
      nivel: 1
    },
    {
      contexto: 'situacion.regalo',            // Receiving a gift
      personaje: 'abuela',                      // Grandmother
      mensaje: 'mensaje.regalo',               // "This is for you, a gift"
      options: ['opcion.gracias', 'opcion.ceder_paso', 'opcion.no_gracias'],
      correcta: 'opcion.gracias',
      nivel: 1
    },
    {
      contexto: 'situacion.tienda',            // In a shop
      personaje: 'vendedor',                    // Shop assistant
      mensaje: 'mensaje.ayuda_tienda',         // "Can I help you find something?"
      options: ['opcion.por_favor', 'opcion.gracias', 'opcion.silencio'],
      correcta: 'opcion.por_favor',            // Please
      nivel: 1
    },
    {
      contexto: 'situacion.puerta',            // Door passage
      personaje: 'companero',                   // Peer/classmate
      mensaje: 'mensaje.paso',                 // "I need to pass"
      options: ['opcion.por_favor', 'opcion.hola', 'opcion.buenos_dias'],
      correcta: 'opcion.por_favor',
      nivel: 1
    },
    {
      contexto: 'situacion.parada_bus',        // Bus stop
      personaje: 'persona_mayor',              // Elderly person
      mensaje: 'mensaje.acerca',               // "Excuse me, can I get by?"
      options: ['opcion.ceder_paso', 'opcion.gracias', 'opcion.no'],
      correcta: 'opcion.ceder_paso',          // Give way
      nivel: 1
    },

    // NIVEL 2: Greetings and goodbyes in context
    {
      contexto: 'situacion.manana_casa',       // Morning at home
      personaje: 'padre',                       // Father
      mensaje: 'mensaje.manana',               // "Good morning, it's time to get up"
      options: ['opcion.buenos_dias', 'opcion.buenas_noches', 'opcion.hasta_luego'],
      correcta: 'opcion.buenos_dias',         // Good morning
      nivel: 2
    },
    {
      contexto: 'situacion.colegio_llegada',   // School arrival
      personaje: 'profesor',                    // Teacher
      mensaje: 'mensaje.saludar',              // "Good morning, class!"
      options: ['opcion.buenos_dias', 'opcion.adios', 'opcion.gracias'],
      correcta: 'opcion.buenos_dias',
      nivel: 2
    },
    {
      contexto: 'situacion.tarde_jugando',     // Afternoon playing
      personaje: 'amigo',                       // Friend
      mensaje: 'mensaje.despedida_tarde',      // "I have to go home now"
      options: ['opcion.hasta_luego', 'opcion.buenos_dias', 'opcion.por_favor'],
      correcta: 'opcion.hasta_luego',         // See you later
      nivel: 2
    },
    {
      contexto: 'situacion.noche_dormir',      // Evening bedtime
      personaje: 'madre',                       // Mother
      mensaje: 'mensaje.dormir',               // "It's time to sleep"
      options: ['opcion.buenas_noches', 'opcion.buenos_dias', 'opcion.gracias'],
      correcta: 'opcion.buenas_noches',       // Good night
      nivel: 2
    },
    {
      contexto: 'situacion.visita',            // Someone visits
      personaje: 'tio',                         // Uncle
      mensaje: 'mensaje.llegada_visita',       // "I've come to visit!"
      options: ['opcion.hola', 'opcion.adios', 'opcion.gracias'],
      correcta: 'opcion.hola',                 // Hello
      nivel: 2
    },
    {
      contexto: 'situacion.despedida_viaje',   // Saying goodbye for a trip
      personaje: 'abuelo',                      // Grandfather
      mensaje: 'mensaje.viaje',                // "I'm going on a trip, goodbye!"
      options: ['opcion.adios', 'opcion.buenos_dias', 'opcion.por_favor'],
      correcta: 'opcion.adios',                // Goodbye
      nivel: 2
    },

    // NIVEL 3: Complex scenarios combining formulas and social awareness
    {
      contexto: 'situacion.cafe_ayuda',        // Café scenario
      personaje: 'camarero',                    // Waiter
      mensaje: 'mensaje.pedido',               // "What would you like to order?"
      options: ['opcion.por_favor', 'opcion.gracias', 'opcion.buenos_dias'],
      correcta: 'opcion.por_favor',            // Should use "please" for polite order
      nivel: 3
    },
    {
      contexto: 'situacion.ayuda_escaleras',   // Helping someone on stairs
      personaje: 'persona_mayor',              // Elderly person
      mensaje: 'mensaje.escaleras',            // "These stairs are difficult"
      options: ['opcion.ayuda', 'opcion.gracias', 'opcion.adios'],
      correcta: 'opcion.ayuda',                // Offer help
      nivel: 3
    },
    {
      contexto: 'situacion.biblioteca',        // Library scenario
      personaje: 'bibliotecaria',              // Librarian
      mensaje: 'mensaje.libro',                // "I can help you find a book"
      options: ['opcion.por_favor', 'opcion.gracias', 'opcion.buenos_dias'],
      correcta: 'opcion.por_favor',
      nivel: 3
    },
    {
      contexto: 'situacion.juego_grupo',       // Playing in a group
      personaje: 'amigos',                      // Friends
      mensaje: 'mensaje.juego',                // "We're playing together"
      options: ['opcion.puedo_jugar', 'opcion.gracias', 'opcion.adios'],
      correcta: 'opcion.puedo_jugar',         // Ask politely to join
      nivel: 3
    },
    {
      contexto: 'situacion.comida_familia',    // Family meal
      personaje: 'hermano',                     // Brother/sister
      mensaje: 'mensaje.pass',                 // "Can you pass me the bread?"
      options: ['opcion.por_favor', 'opcion.gracias', 'opcion.buenos_dias'],
      correcta: 'opcion.por_favor',
      nivel: 3
    },
    {
      contexto: 'situacion.parque_banco',      // Park bench
      personaje: 'abuelo',                      // Grandfather
      mensaje: 'mensaje.banco',                // "Can I sit here?"
      options: ['opcion.por_favor', 'opcion.gracias', 'opcion.hola'],
      correcta: 'opcion.por_favor',
      nivel: 3
    },
    {
      contexto: 'situacion.hospital',          // Hospital visit
      personaje: 'enfermero',                   // Nurse
      mensaje: 'mensaje.medicina',             // "Here's your medication"
      options: ['opcion.gracias', 'opcion.por_favor', 'opcion.buenos_dias'],
      correcta: 'opcion.gracias',
      nivel: 3
    },
    {
      contexto: 'situacion.supermercado',      // Supermarket
      personaje: 'reponedor',                   // Stock person
      mensaje: 'mensaje.producto',             // "I'm restocking shelves"
      options: ['opcion.disculpa', 'opcion.gracias', 'opcion.adios'],
      correcta: 'opcion.disculpa',             // Excuse me (polite interruption)
      nivel: 3
    },
    {
      contexto: 'situacion.teléfono',          // Phone conversation
      personaje: 'abuela',                      // Grandmother
      mensaje: 'mensaje.llamada',              // "I'm calling you!"
      options: ['opcion.hola', 'opcion.buenos_dias', 'opcion.gracias'],
      correcta: 'opcion.hola',
      nivel: 3
    },

    // Additional scenarios for variety (total > 25)
    {
      contexto: 'situacion.ropa_tienda',       // Clothing store
      personaje: 'vendedor',                    // Shop assistant
      mensaje: 'mensaje.talla',                // "What size do you need?"
      options: ['opcion.por_favor', 'opcion.gracias', 'opcion.hola'],
      correcta: 'opcion.por_favor',
      nivel: 1
    },
    {
      contexto: 'situacion.paseo_perro',       // Walking a dog
      personaje: 'nino',                        // Child
      mensaje: 'mensaje.perro',                // "Can I pet your dog?"
      options: ['opcion.por_favor', 'opcion.gracias', 'opcion.adios'],
      correcta: 'opcion.por_favor',
      nivel: 2
    },
    {
      contexto: 'situacion.ascensor',          // In an elevator
      personaje: 'persona',                     // Another person
      mensaje: 'mensaje.piso',                 // "What floor do you need?"
      options: ['opcion.por_favor', 'opcion.gracias', 'opcion.buenos_dias'],
      correcta: 'opcion.por_favor',
      nivel: 2
    },
    {
      contexto: 'situacion.fiesta',            // Birthday party
      personaje: 'anfitrion',                   // Host
      mensaje: 'mensaje.pastel',               // "Here's cake for everyone!"
      options: ['opcion.gracias', 'opcion.por_favor', 'opcion.adios'],
      correcta: 'opcion.gracias',
      nivel: 2
    },
    {
      contexto: 'situacion.escuela_despedida', // School dismissal
      personaje: 'profesor',                    // Teacher
      mensaje: 'mensaje.hasta_manana',         // "See you tomorrow!"
      options: ['opcion.hasta_luego', 'opcion.buenos_dias', 'opcion.por_favor'],
      correcta: 'opcion.hasta_luego',
      nivel: 2
    },
    {
      contexto: 'situacion.calle_parada',      // Street corner
      personaje: 'persona',                     // Another person
      mensaje: 'mensaje.paso_calle',           // "Excuse me, I need to pass"
      options: ['opcion.disculpa', 'opcion.ceder_paso', 'opcion.gracias'],
      correcta: 'opcion.ceder_paso',
      nivel: 3
    },
    {
      contexto: 'situacion.piscina',           // Swimming pool
      personaje: 'monitor',                     // Lifeguard/instructor
      mensaje: 'mensaje.turno',                // "Wait your turn, please"
      options: ['opcion.entendido', 'opcion.gracias', 'opcion.adios'],
      correcta: 'opcion.entendido',            // Understood / OK
      nivel: 3
    }
  ]
};
