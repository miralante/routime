/*
 * Content bank for My Schedule.
 * Format: DATA.<locale> = { roundSize, levels[] }.
 * Each level has { id, name, description, stars, cases[] }.
 * Each case has { icon, scenario, hint, choices[3] } and every choice has
 * { text, explanation, correct }. The first failed attempt shows only hint.
 * Progression changes one planning variable at a time: order, preparation, time.
 */
var DATA = {
  es: {
    roundSize: 5,
    levels: [
      {
        id: 'order',
        name: 'Nivel 1',
        description: 'Ordena el plan',
        stars: 1,
        cases: [
          {
            icon: '🏥',
            scenario: 'Centro de salud. Tienes una cita a las 10:00. El trayecto dura 20 minutos.',
            hint: '¿Qué necesitas saber y preparar antes de salir?',
            choices: [
              { text: 'Reviso la hora, preparo la tarjeta de la cita y salgo a las 9:30.', explanation: 'Preparar primero y salir con margen ayuda a llegar con calma.', correct: true },
              { text: 'Salgo a las 10:00 y busco la tarjeta después.', explanation: 'A las 10:00 ya empieza la cita. La tarjeta se prepara antes de salir.', correct: false },
              { text: 'Voy sin mirar la hora y preparo la tarjeta al volver.', explanation: 'Mirar la hora y preparar lo necesario son pasos anteriores a salir.', correct: false }
            ]
          },
          {
            icon: '📚',
            scenario: 'Biblioteca. Debes devolver un libro antes de las 18:00.',
            hint: '¿Qué objeto tienes que llevar?',
            choices: [
              { text: 'Guardo el libro en la mochila, miro cómo llegar y salgo con tiempo.', explanation: 'Primero preparas el libro. Después compruebas el camino y sales.', correct: true },
              { text: 'Miro el camino, salgo y dejo el libro en casa.', explanation: 'Sin el libro no puedes hacer la devolución.', correct: false },
              { text: 'Salgo, vuelvo a por el libro y después miro el camino.', explanation: 'Volver a casa añade pasos. Es mejor preparar el libro antes.', correct: false }
            ]
          },
          {
            icon: '🎓',
            scenario: 'Clase. La clase empieza a las 9:00.',
            hint: 'Piensa qué va en la mochila antes de salir.',
            choices: [
              { text: 'Preparo el cuaderno, desayuno y salgo antes de las 9:00.', explanation: 'Preparar el material antes evita olvidos.', correct: true },
              { text: 'Salgo sin cuaderno, desayuno después y vuelvo a buscarlo.', explanation: 'Volver a por el cuaderno puede hacerte llegar tarde.', correct: false },
              { text: 'Espero a las 9:00, preparo el cuaderno y luego desayuno.', explanation: 'A las 9:00 la clase ya empieza.', correct: false }
            ]
          },
          {
            icon: '🚆',
            scenario: 'Tren. El tren sale a las 11:30.',
            hint: '¿Qué debes comprobar antes de subir?',
            choices: [
              { text: 'Preparo el billete, compruebo el andén y llego antes de las 11:30.', explanation: 'El billete y el andén se comprueban antes de subir.', correct: true },
              { text: 'Llego a las 11:30, busco el billete y luego miro el andén.', explanation: 'Buscar todo a la hora de salida puede hacerte perder el tren.', correct: false },
              { text: 'Subo a cualquier tren y después miro el billete.', explanation: 'El billete indica qué tren debes tomar.', correct: false }
            ]
          },
          {
            icon: '💼',
            scenario: 'Trabajo. Tu turno empieza a las 15:00.',
            hint: '¿Qué dos cosas dejas listas antes de salir?',
            choices: [
              { text: 'Preparo la ropa de trabajo, guardo la comida y salgo con tiempo.', explanation: 'Dejar todo listo ayuda a llegar preparado.', correct: true },
              { text: 'Salgo, preparo la comida en el trabajo y vuelvo a por la ropa.', explanation: 'La ropa y la comida se preparan antes de salir.', correct: false },
              { text: 'Espero a las 15:00 para buscar la ropa y después salgo.', explanation: 'A las 15:00 el turno ya ha empezado.', correct: false }
            ]
          },
          {
            icon: '🏃',
            scenario: 'Deporte. La actividad empieza a las 18:00.',
            hint: '¿Qué llevas en la bolsa?',
            choices: [
              { text: 'Preparo ropa y agua, me cambio y salgo con tiempo.', explanation: 'Primero reúnes lo necesario. Después te cambias y sales.', correct: true },
              { text: 'Me cambio, salgo y dejo el agua y la ropa en casa.', explanation: 'Necesitas llevar el material preparado.', correct: false },
              { text: 'Espero a las 18:00, preparo todo y después salgo.', explanation: 'A las 18:00 la actividad ya empieza.', correct: false }
            ]
          },
          {
            icon: '💻',
            scenario: 'Videollamada. La llamada empieza a las 19:00.',
            hint: '¿Qué necesita el dispositivo antes de la llamada?',
            choices: [
              { text: 'Cargo el dispositivo, busco un lugar tranquilo y entro a las 19:00.', explanation: 'Cargar y preparar el lugar son pasos anteriores a entrar.', correct: true },
              { text: 'Entro sin batería, busco el cargador y después elijo un lugar.', explanation: 'La llamada puede cortarse si no preparas el dispositivo.', correct: false },
              { text: 'Busco un lugar después de terminar la llamada y cargo el dispositivo mañana.', explanation: 'Esos preparativos sirven antes de la llamada.', correct: false }
            ]
          },
          {
            icon: '✂️',
            scenario: 'Peluquería. Tienes cita a las 17:00.',
            hint: '¿Qué dos datos compruebas antes de salir?',
            choices: [
              { text: 'Compruebo la dirección, preparo cómo pagar y salgo con tiempo.', explanation: 'Saber dónde ir y llevar el pago ayuda a completar la cita.', correct: true },
              { text: 'Salgo sin dirección, llego a las 17:00 y entonces busco cómo pagar.', explanation: 'La dirección y el pago se preparan antes.', correct: false },
              { text: 'Pago primero desde casa, busco otra peluquería y no miro la cita.', explanation: 'Debes seguir los datos de la cita que ya tienes.', correct: false }
            ]
          },
          {
            icon: '🐾',
            scenario: 'Veterinario. Tu mascota tiene cita a las 16:30.',
            hint: '¿Cómo viaja la mascota de forma segura?',
            choices: [
              { text: 'Preparo el transportín, guardo la información de la cita y salgo con tiempo.', explanation: 'La mascota y la información deben estar listas antes de salir.', correct: true },
              { text: 'Salgo con la mascota suelta y busco la información al llegar.', explanation: 'El transportín ayuda a viajar con seguridad.', correct: false },
              { text: 'Espero a las 16:30, busco el transportín y después miro la dirección.', explanation: 'Los preparativos se hacen antes de la hora de la cita.', correct: false }
            ]
          }
        ]
      },
      {
        id: 'prepare',
        name: 'Nivel 2',
        description: 'Prepara lo necesario',
        stars: 1,
        cases: [
          {
            icon: '🏊',
            scenario: 'Piscina. Vas a nadar a las 12:00.',
            hint: 'Piensa qué usas dentro y después de la piscina.',
            choices: [
              { text: 'Preparo bañador, toalla y agua antes de salir.', explanation: 'Son objetos útiles para nadar y cambiarte después.', correct: true },
              { text: 'Preparo un paraguas, un libro grande y una manta.', explanation: 'Esos objetos no sustituyen el bañador ni la toalla.', correct: false },
              { text: 'Salgo sin bolsa y decido comprar todo al llegar.', explanation: 'Preparar en casa evita depender de una compra.', correct: false }
            ]
          },
          {
            icon: '📦',
            scenario: 'Correos. Vas a enviar un paquete.',
            hint: '¿Qué necesita saber la persona que entrega el paquete?',
            choices: [
              { text: 'Cierro el paquete, llevo la dirección y preparo cómo pagar.', explanation: 'El paquete necesita destino y debe estar listo para entregar.', correct: true },
              { text: 'Llevo el objeto suelto y dejo la dirección en casa.', explanation: 'Sin paquete cerrado ni dirección no se puede enviar bien.', correct: false },
              { text: 'Solo llevo una bolsa vacía y una revista.', explanation: 'Falta el paquete que quieres enviar y sus datos.', correct: false }
            ]
          },
          {
            icon: '🛒',
            scenario: 'Supermercado. Vas a hacer una compra pequeña.',
            hint: '¿Qué te ayuda a recordar lo que vas a comprar?',
            choices: [
              { text: 'Llevo la lista, una bolsa y una forma de pago.', explanation: 'La lista ayuda a recordar. La bolsa y el pago completan la compra.', correct: true },
              { text: 'Llevo un juguete, una almohada y nada para pagar.', explanation: 'Esos objetos no ayudan a hacer la compra.', correct: false },
              { text: 'Voy sin lista ni pago y confío en recordarlo todo.', explanation: 'Preparar reduce olvidos y permite pagar.', correct: false }
            ]
          },
          {
            icon: '🍳',
            scenario: 'Taller de cocina. Vas a aprender una receta.',
            hint: 'Piensa en proteger la ropa y apuntar la receta.',
            choices: [
              { text: 'Preparo delantal, cuaderno y bolígrafo.', explanation: 'El delantal protege la ropa. El cuaderno permite anotar.', correct: true },
              { text: 'Preparo bañador, gafas de sol y una pelota.', explanation: 'Son objetos para otra actividad.', correct: false },
              { text: 'Solo llevo el móvil sin batería.', explanation: 'Falta material sencillo para cocinar y anotar.', correct: false }
            ]
          },
          {
            icon: '🦷',
            scenario: 'Dentista. Tienes una revisión.',
            hint: '¿Qué información confirma dónde y cuándo es la revisión?',
            choices: [
              { text: 'Llevo los datos de la cita y la tarjeta que use el centro.', explanation: 'La información ayuda a identificar la cita al llegar.', correct: true },
              { text: 'Llevo una entrada de cine y una receta de cocina.', explanation: 'Esos papeles no corresponden a la cita.', correct: false },
              { text: 'No llevo nada y tampoco miro dónde está la clínica.', explanation: 'Comprobar los datos antes evita confusiones.', correct: false }
            ]
          },
          {
            icon: '🎒',
            scenario: 'Excursión de un día. Pasarás varias horas fuera.',
            hint: '¿Qué necesitas para viajar y pasar unas horas fuera?',
            choices: [
              { text: 'Preparo el billete, agua y una prenda ligera.', explanation: 'El billete permite viajar. El agua y la prenda ayudan durante el día.', correct: true },
              { text: 'Preparo solo ropa de dormir para una semana.', explanation: 'Es demasiado para una salida de un día y falta el billete.', correct: false },
              { text: 'Salgo sin agua ni billete porque puedo improvisar.', explanation: 'Los elementos básicos se preparan antes.', correct: false }
            ]
          },
          {
            icon: '🤝',
            scenario: 'Entrevista de trabajo. Te esperan en una dirección nueva.',
            hint: '¿Qué debes saber para llegar al lugar correcto?',
            choices: [
              { text: 'Compruebo la dirección y llevo el documento que me pidieron.', explanation: 'Saber dónde ir y llevar lo solicitado permite acudir preparado.', correct: true },
              { text: 'Llevo material de piscina y no miro la dirección.', explanation: 'Ese material no sirve para la entrevista.', correct: false },
              { text: 'Espero a estar allí para preguntar qué ciudad es.', explanation: 'La dirección se comprueba antes de salir.', correct: false }
            ]
          },
          {
            icon: '🎨',
            scenario: 'Taller de pintura. Te piden llevar material básico.',
            hint: '¿Con qué aplicas la pintura?',
            choices: [
              { text: 'Preparo una bata, pinceles y el papel indicado.', explanation: 'Son los materiales que pide el taller.', correct: true },
              { text: 'Preparo cubiertos, una sartén y una toalla de playa.', explanation: 'Son objetos de otras tareas.', correct: false },
              { text: 'Llevo solo pintura y dejo los pinceles en casa.', explanation: 'Sin pinceles falta una herramienta principal.', correct: false }
            ]
          }
        ]
      },
      {
        id: 'time',
        name: 'Nivel 3',
        description: 'Elige cuándo',
        stars: 1,
        cases: [
          {
            icon: '🏥',
            scenario: 'Cita del martes. Es a las 10:00 y tardas 20 minutos en llegar.',
            hint: 'Busca una hora que deje 20 minutos de trayecto y un poco de margen.',
            choices: [
              { text: 'Preparo lo necesario el lunes por la tarde y salgo el martes a las 9:30.', explanation: 'Preparar antes y añadir diez minutos de margen ayuda a llegar a tiempo.', correct: true },
              { text: 'Empiezo a preparar el martes a las 10:00 y salgo después.', explanation: 'La cita ya habrá empezado.', correct: false },
              { text: 'Salgo el lunes por la noche y espero allí hasta el martes.', explanation: 'Es mucho antes de lo necesario.', correct: false }
            ]
          },
          {
            icon: '🚆',
            scenario: 'Tren del sábado. Sale a las 11:30.',
            hint: '¿Qué momento es anterior, pero cercano, a las 11:30 del sábado?',
            choices: [
              { text: 'Hago la bolsa el viernes y llego a la estación a las 11:10.', explanation: 'La bolsa queda lista y llegas antes de la salida.', correct: true },
              { text: 'Hago la bolsa el sábado a las 11:30 y llego después.', explanation: 'El tren puede haberse ido.', correct: false },
              { text: 'Llego el viernes a las 11:10 y paso allí un día.', explanation: 'Llegar un día antes no es necesario.', correct: false }
            ]
          },
          {
            icon: '📚',
            scenario: 'Biblioteca. Cierra hoy a las 18:00 y tardas 15 minutos.',
            hint: 'Necesitas llegar antes de las 18:00 de hoy.',
            choices: [
              { text: 'Salgo a las 17:30 para devolver el libro antes del cierre.', explanation: 'Hay tiempo para el trayecto y para entregar el libro.', correct: true },
              { text: 'Salgo a las 18:00.', explanation: 'La biblioteca ya está cerrando.', correct: false },
              { text: 'Salgo mañana a las 17:30.', explanation: 'El cierre que importa es el de hoy.', correct: false }
            ]
          },
          {
            icon: '💻',
            scenario: 'Videollamada del miércoles. Empieza a las 19:00.',
            hint: '¿Qué puedes preparar unas horas antes?',
            choices: [
              { text: 'Cargo el dispositivo por la tarde y entro a las 19:00.', explanation: 'La batería queda lista antes de la llamada.', correct: true },
              { text: 'Empiezo a cargarlo al terminar la llamada.', explanation: 'La carga ya no ayuda durante la llamada.', correct: false },
              { text: 'Entro el martes a las 19:00.', explanation: 'La llamada es el miércoles.', correct: false }
            ]
          },
          {
            icon: '💼',
            scenario: 'Turno de trabajo. Empieza a las 15:00 y tardas 30 minutos.',
            hint: 'Cuenta 30 minutos de trayecto y añade un poco de margen.',
            choices: [
              { text: 'Preparo la ropa por la mañana y salgo a las 14:20.', explanation: 'Tienes 30 minutos de trayecto y diez de margen.', correct: true },
              { text: 'Busco la ropa a las 15:00 y salgo después.', explanation: 'El turno ya ha empezado.', correct: false },
              { text: 'Salgo a las 12:00 sin preparar nada.', explanation: 'Es demasiado pronto y aún falta lo necesario.', correct: false }
            ]
          },
          {
            icon: '🏃',
            scenario: 'Actividad deportiva. Empieza a las 18:00 y tardas 20 minutos.',
            hint: '¿Qué hora está 30 minutos antes de las 18:00?',
            choices: [
              { text: 'Preparo la bolsa por la tarde y salgo a las 17:30.', explanation: 'Llegas con diez minutos de margen.', correct: true },
              { text: 'Preparo la bolsa a las 18:00 y salgo a las 18:10.', explanation: 'Llegarías después del inicio.', correct: false },
              { text: 'Salgo por la mañana y espero todo el día.', explanation: 'No hace falta salir tantas horas antes.', correct: false }
            ]
          },
          {
            icon: '🎓',
            scenario: 'Clase del lunes. Empieza a las 9:00 y tardas 20 minutos.',
            hint: 'Puedes preparar la mochila la tarde anterior.',
            choices: [
              { text: 'Preparo la mochila el domingo y salgo el lunes a las 8:30.', explanation: 'La mochila queda lista y llegas con margen.', correct: true },
              { text: 'Preparo la mochila el lunes a las 9:00.', explanation: 'La clase ya está empezando.', correct: false },
              { text: 'Voy el domingo a las 8:30.', explanation: 'La clase es el lunes.', correct: false }
            ]
          },
          {
            icon: '🎭',
            scenario: 'Teatro. La función empieza a las 20:00 y tardas 20 minutos.',
            hint: 'Elige una llegada poco antes de las 20:00.',
            choices: [
              { text: 'Compruebo la ruta por la tarde y llego al teatro a las 19:40.', explanation: 'Llegas antes de que empiece la función.', correct: true },
              { text: 'Miro la ruta a las 20:00 y salgo después.', explanation: 'La función ya ha empezado.', correct: false },
              { text: 'Llego a las 17:00 y espero tres horas.', explanation: 'Es mucho antes de lo necesario.', correct: false }
            ]
          }
        ]
      }
    ]
  },
  en: {
    roundSize: 5,
    levels: [
      {
        id: 'order',
        name: 'Level 1',
        description: 'Put the plan in order',
        stars: 1,
        cases: [
          {
            icon: '🏥',
            scenario: "Doctor's office. You have an appointment at 10:00 a.m. The trip takes 20 minutes.",
            hint: 'What do you need to check and prepare before leaving?',
            choices: [
              { text: 'Check the time, prepare the appointment card and leave at 9:30 a.m.', explanation: 'Preparing first and leaving extra time helps you arrive calmly.', correct: true },
              { text: 'Leave at 10:00 a.m. and look for the card later.', explanation: 'The appointment starts at 10:00 a.m. Prepare the card before leaving.', correct: false },
              { text: 'Go without checking the time and prepare the card after coming home.', explanation: 'Checking the time and preparing what you need come before leaving.', correct: false }
            ]
          },
          {
            icon: '📚',
            scenario: 'Library. You must return a book before 6:00 p.m.',
            hint: 'Which item must you take?',
            choices: [
              { text: 'Put the book in your bag, check the route and leave early.', explanation: 'Prepare the book first. Then check the route and leave.', correct: true },
              { text: 'Check the route, leave and keep the book at home.', explanation: 'You cannot return the book without taking it.', correct: false },
              { text: 'Leave, go back for the book and then check the route.', explanation: 'Going back adds steps. Prepare the book first.', correct: false }
            ]
          },
          {
            icon: '🎓',
            scenario: 'Class. Class starts at 9:00 a.m.',
            hint: 'Think about what goes in your bag before you leave.',
            choices: [
              { text: 'Pack the notebook, eat breakfast and leave before 9:00 a.m.', explanation: 'Packing the materials first helps prevent forgetting them.', correct: true },
              { text: 'Leave without the notebook, eat later and go back for it.', explanation: 'Going back may make you late.', correct: false },
              { text: 'Wait until 9:00 a.m., pack the notebook and then eat breakfast.', explanation: 'Class already starts at 9:00 a.m.', correct: false }
            ]
          },
          {
            icon: '🚆',
            scenario: 'Train. The train leaves at 11:30 a.m.',
            hint: 'What should you check before boarding?',
            choices: [
              { text: 'Prepare the ticket, check the platform and arrive before 11:30 a.m.', explanation: 'Check the ticket and platform before boarding.', correct: true },
              { text: 'Arrive at 11:30 a.m., look for the ticket and then check the platform.', explanation: 'Looking for everything at departure time may make you miss the train.', correct: false },
              { text: 'Board any train and check the ticket afterward.', explanation: 'The ticket tells you which train to take.', correct: false }
            ]
          },
          {
            icon: '💼',
            scenario: 'Work. Your shift starts at 3:00 p.m.',
            hint: 'Which two things should be ready before leaving?',
            choices: [
              { text: 'Prepare your work clothes, pack your meal and leave early.', explanation: 'Having everything ready helps you arrive prepared.', correct: true },
              { text: 'Leave, prepare the meal at work and go home for the clothes.', explanation: 'Prepare the clothes and meal before leaving.', correct: false },
              { text: 'Wait until 3:00 p.m. to find the clothes and then leave.', explanation: 'The shift has already started at 3:00 p.m.', correct: false }
            ]
          },
          {
            icon: '🏃',
            scenario: 'Sports. The activity starts at 6:00 p.m.',
            hint: 'What goes in your sports bag?',
            choices: [
              { text: 'Pack clothes and water, get changed and leave early.', explanation: 'Gather what you need first. Then get changed and leave.', correct: true },
              { text: 'Get changed, leave and keep the water and clothes at home.', explanation: 'You need to take the packed equipment.', correct: false },
              { text: 'Wait until 6:00 p.m., pack everything and then leave.', explanation: 'The activity already starts at 6:00 p.m.', correct: false }
            ]
          },
          {
            icon: '💻',
            scenario: 'Video call. The call starts at 7:00 p.m.',
            hint: 'What does the device need before the call?',
            choices: [
              { text: 'Charge the device, find a quiet place and join at 7:00 p.m.', explanation: 'Charging and preparing the place come before joining.', correct: true },
              { text: 'Join with no battery, look for the charger and then choose a place.', explanation: 'The call may stop if the device is not prepared.', correct: false },
              { text: 'Find a place after the call and charge the device tomorrow.', explanation: 'Those preparations are useful before the call.', correct: false }
            ]
          },
          {
            icon: '✂️',
            scenario: 'Hair appointment. Your appointment is at 5:00 p.m.',
            hint: 'Which two details should you check before leaving?',
            choices: [
              { text: 'Check the address, prepare how to pay and leave early.', explanation: 'Knowing where to go and having payment ready helps complete the appointment.', correct: true },
              { text: 'Leave without the address, arrive at 5:00 p.m. and then work out how to pay.', explanation: 'Check the address and payment before leaving.', correct: false },
              { text: 'Pay from home first, find another place and ignore the appointment.', explanation: 'Follow the details of the appointment you already have.', correct: false }
            ]
          },
          {
            icon: '🐾',
            scenario: 'Veterinarian. Your pet has an appointment at 4:30 p.m.',
            hint: 'How can your pet travel safely?',
            choices: [
              { text: 'Prepare the carrier, pack the appointment details and leave early.', explanation: 'Your pet and the information should be ready before leaving.', correct: true },
              { text: 'Leave with the pet loose and find the details after arriving.', explanation: 'A carrier helps your pet travel safely.', correct: false },
              { text: 'Wait until 4:30 p.m., find the carrier and then check the address.', explanation: 'Prepare before the appointment time.', correct: false }
            ]
          }
        ]
      },
      {
        id: 'prepare',
        name: 'Level 2',
        description: 'Prepare what you need',
        stars: 1,
        cases: [
          {
            icon: '🏊',
            scenario: 'Pool. You are going swimming at noon.',
            hint: 'Think about what you use in the pool and afterward.',
            choices: [
              { text: 'Pack a swimsuit, towel and water before leaving.', explanation: 'These are useful for swimming and changing afterward.', correct: true },
              { text: 'Pack an umbrella, a large book and a blanket.', explanation: 'These do not replace a swimsuit and towel.', correct: false },
              { text: 'Leave with no bag and buy everything there.', explanation: 'Preparing at home avoids depending on a shop.', correct: false }
            ]
          },
          {
            icon: '📦',
            scenario: 'Post office. You are sending a parcel.',
            hint: 'What does the delivery worker need to know?',
            choices: [
              { text: 'Close the parcel, take the address and prepare payment.', explanation: 'The parcel needs a destination and must be ready to hand over.', correct: true },
              { text: 'Take the loose item and keep the address at home.', explanation: 'It cannot be sent properly without packing and an address.', correct: false },
              { text: 'Take only an empty bag and a magazine.', explanation: 'The parcel and its details are missing.', correct: false }
            ]
          },
          {
            icon: '🛒',
            scenario: 'Grocery store. You are doing a small shop.',
            hint: 'What helps you remember what to buy?',
            choices: [
              { text: 'Take the list, a bag and a way to pay.', explanation: 'The list helps you remember. The bag and payment complete the shop.', correct: true },
              { text: 'Take a toy, a pillow and no payment.', explanation: 'These items do not help with shopping.', correct: false },
              { text: 'Go with no list or payment and trust your memory.', explanation: 'Preparing helps prevent forgetting and lets you pay.', correct: false }
            ]
          },
          {
            icon: '🍳',
            scenario: 'Cooking workshop. You are learning a recipe.',
            hint: 'Think about protecting clothes and writing down the recipe.',
            choices: [
              { text: 'Pack an apron, notebook and pen.', explanation: 'The apron protects clothes. The notebook lets you take notes.', correct: true },
              { text: 'Pack a swimsuit, sunglasses and a ball.', explanation: 'Those belong to another activity.', correct: false },
              { text: 'Take only a phone with no battery.', explanation: 'Simple cooking and note-taking items are missing.', correct: false }
            ]
          },
          {
            icon: '🦷',
            scenario: 'Dentist. You have a checkup.',
            hint: 'Which information confirms where and when the checkup is?',
            choices: [
              { text: 'Take the appointment details and the card used by the office.', explanation: 'The information helps the office find your appointment.', correct: true },
              { text: 'Take a movie ticket and a cooking recipe.', explanation: 'Those papers do not belong to this appointment.', correct: false },
              { text: 'Take nothing and do not check where the office is.', explanation: 'Checking details first helps prevent confusion.', correct: false }
            ]
          },
          {
            icon: '🎒',
            scenario: 'Day trip. You will be out for several hours.',
            hint: 'What do you need to travel and spend a few hours away?',
            choices: [
              { text: 'Pack the ticket, water and a light layer.', explanation: 'The ticket lets you travel. Water and a layer help during the day.', correct: true },
              { text: 'Pack only enough sleepwear for a week.', explanation: 'That is too much for one day, and the ticket is missing.', correct: false },
              { text: 'Leave without water or a ticket and improvise.', explanation: 'Prepare the basic items first.', correct: false }
            ]
          },
          {
            icon: '🤝',
            scenario: 'Job interview. You are expected at a new address.',
            hint: 'What do you need to know to reach the right place?',
            choices: [
              { text: 'Check the address and take the requested document.', explanation: 'Knowing where to go and bringing what was requested helps you arrive prepared.', correct: true },
              { text: 'Take pool equipment and do not check the address.', explanation: 'That equipment does not help at the interview.', correct: false },
              { text: 'Wait until you arrive to ask which city it is in.', explanation: 'Check the address before leaving.', correct: false }
            ]
          },
          {
            icon: '🎨',
            scenario: 'Painting workshop. You are asked to bring basic materials.',
            hint: 'What do you use to apply paint?',
            choices: [
              { text: 'Pack a smock, brushes and the requested paper.', explanation: 'These are the materials requested by the workshop.', correct: true },
              { text: 'Pack cutlery, a frying pan and a beach towel.', explanation: 'Those are for other tasks.', correct: false },
              { text: 'Take only paint and leave the brushes at home.', explanation: 'A main painting tool is missing.', correct: false }
            ]
          }
        ]
      },
      {
        id: 'time',
        name: 'Level 3',
        description: 'Choose when',
        stars: 1,
        cases: [
          {
            icon: '🏥',
            scenario: 'Tuesday appointment. It is at 10:00 a.m. and the trip takes 20 minutes.',
            hint: 'Find a time that allows 20 minutes plus a little extra.',
            choices: [
              { text: 'Prepare on Monday evening and leave Tuesday at 9:30 a.m.', explanation: 'Preparing early and adding ten minutes gives enough travel time.', correct: true },
              { text: 'Start preparing Tuesday at 10:00 a.m. and leave later.', explanation: 'The appointment has already started.', correct: false },
              { text: 'Leave Monday night and wait there until Tuesday.', explanation: 'That is much earlier than needed.', correct: false }
            ]
          },
          {
            icon: '🚆',
            scenario: 'Saturday train. It leaves at 11:30 a.m.',
            hint: 'Which time is before, but close to, 11:30 a.m. on Saturday?',
            choices: [
              { text: 'Pack on Friday and arrive at the station at 11:10 a.m.', explanation: 'Your bag is ready and you arrive before departure.', correct: true },
              { text: 'Pack Saturday at 11:30 a.m. and arrive later.', explanation: 'The train may have left.', correct: false },
              { text: 'Arrive Friday at 11:10 a.m. and stay for a day.', explanation: 'Arriving one day early is not needed.', correct: false }
            ]
          },
          {
            icon: '📚',
            scenario: 'Library. It closes today at 6:00 p.m. and the trip takes 15 minutes.',
            hint: 'You need to arrive before 6:00 p.m. today.',
            choices: [
              { text: 'Leave at 5:30 p.m. to return the book before closing.', explanation: 'There is time to travel and return the book.', correct: true },
              { text: 'Leave at 6:00 p.m.', explanation: 'The library is already closing.', correct: false },
              { text: 'Leave tomorrow at 5:30 p.m.', explanation: "Today's closing time is the one that matters.", correct: false }
            ]
          },
          {
            icon: '💻',
            scenario: 'Wednesday video call. It starts at 7:00 p.m.',
            hint: 'What can you prepare a few hours earlier?',
            choices: [
              { text: 'Charge the device in the afternoon and join at 7:00 p.m.', explanation: 'The battery is ready before the call.', correct: true },
              { text: 'Start charging after the call.', explanation: 'Charging then does not help during the call.', correct: false },
              { text: 'Join Tuesday at 7:00 p.m.', explanation: 'The call is on Wednesday.', correct: false }
            ]
          },
          {
            icon: '💼',
            scenario: 'Work shift. It starts at 3:00 p.m. and the trip takes 30 minutes.',
            hint: 'Count 30 minutes of travel and add a little extra.',
            choices: [
              { text: 'Prepare clothes in the morning and leave at 2:20 p.m.', explanation: 'You have 30 minutes to travel and ten extra minutes.', correct: true },
              { text: 'Find the clothes at 3:00 p.m. and leave later.', explanation: 'The shift has already started.', correct: false },
              { text: 'Leave at noon without preparing anything.', explanation: 'That is too early and needed items are missing.', correct: false }
            ]
          },
          {
            icon: '🏃',
            scenario: 'Sports activity. It starts at 6:00 p.m. and the trip takes 20 minutes.',
            hint: 'Which time is 30 minutes before 6:00 p.m.?',
            choices: [
              { text: 'Pack in the afternoon and leave at 5:30 p.m.', explanation: 'You arrive with ten minutes to spare.', correct: true },
              { text: 'Pack at 6:00 p.m. and leave at 6:10 p.m.', explanation: 'You would arrive after the start.', correct: false },
              { text: 'Leave in the morning and wait all day.', explanation: 'There is no need to leave hours early.', correct: false }
            ]
          },
          {
            icon: '🎓',
            scenario: 'Monday class. It starts at 9:00 a.m. and the trip takes 20 minutes.',
            hint: 'You can pack on the previous evening.',
            choices: [
              { text: 'Pack on Sunday and leave Monday at 8:30 a.m.', explanation: 'Your bag is ready and you arrive early.', correct: true },
              { text: 'Pack Monday at 9:00 a.m.', explanation: 'Class is already starting.', correct: false },
              { text: 'Go Sunday at 8:30 a.m.', explanation: 'Class is on Monday.', correct: false }
            ]
          },
          {
            icon: '🎭',
            scenario: 'Theater. The show starts at 8:00 p.m. and the trip takes 20 minutes.',
            hint: 'Choose an arrival shortly before 8:00 p.m.',
            choices: [
              { text: 'Check the route in the afternoon and arrive at 7:40 p.m.', explanation: 'You arrive before the show starts.', correct: true },
              { text: 'Check the route at 8:00 p.m. and leave later.', explanation: 'The show has already started.', correct: false },
              { text: 'Arrive at 5:00 p.m. and wait three hours.', explanation: 'That is much earlier than needed.', correct: false }
            ]
          }
        ]
      }
    ]
  }
};
