/*
 * Content bank for My Schedule.
 * Format: DATA.<locale> = { roundSize, levels[] }.
 * Each level has { id, name, description, stars, cases[] }.
 * Each case has { icon, scenario, hint, steps[], explanation }: the steps of
 * the plan, in the order they must happen. The person puts them in order.
 * Progression changes one planning variable at a time: order, preparation, time.
 */
var DATA = {
  "es": {
    "roundSize": 5,
    "levels": [
      {
        "id": "order",
        "name": "Nivel 1",
        "description": "Ordena el plan",
        "stars": 1,
        "cases": [
          {
            "icon": "🏥",
            "scenario": "Centro de salud. Tienes una cita a las 10:00. El trayecto dura 20 minutos.",
            "hint": "¿Qué necesitas saber y preparar antes de salir?",
            "steps": [
              "Reviso la hora",
              "preparo la tarjeta de la cita",
              "salgo a las 9:30"
            ],
            "explanation": "Preparar primero y salir con margen ayuda a llegar con calma."
          },
          {
            "icon": "📚",
            "scenario": "Biblioteca. Debes devolver un libro antes de las 18:00.",
            "hint": "¿Qué objeto tienes que llevar?",
            "steps": [
              "Guardo el libro en la mochila",
              "miro cómo llegar",
              "salgo con tiempo"
            ],
            "explanation": "Primero preparas el libro. Después compruebas el camino y sales."
          },
          {
            "icon": "🎓",
            "scenario": "Clase. La clase empieza a las 9:00.",
            "hint": "Piensa qué va en la mochila antes de salir.",
            "steps": [
              "Preparo el cuaderno",
              "desayuno",
              "salgo antes de las 9:00"
            ],
            "explanation": "Preparar el material antes evita olvidos."
          },
          {
            "icon": "🚆",
            "scenario": "Tren. El tren sale a las 11:30.",
            "hint": "¿Qué debes comprobar antes de subir?",
            "steps": [
              "Preparo el billete",
              "compruebo el andén",
              "llego antes de las 11:30"
            ],
            "explanation": "El billete y el andén se comprueban antes de subir."
          },
          {
            "icon": "💼",
            "scenario": "Trabajo. Tu turno empieza a las 15:00.",
            "hint": "¿Qué dos cosas dejas listas antes de salir?",
            "steps": [
              "Preparo la ropa de trabajo",
              "guardo la comida",
              "salgo con tiempo"
            ],
            "explanation": "Dejar todo listo ayuda a llegar preparado."
          },
          {
            "icon": "🏃",
            "scenario": "Deporte. La actividad empieza a las 18:00.",
            "hint": "¿Qué llevas en la bolsa?",
            "steps": [
              "Preparo ropa",
              "agua",
              "me cambio",
              "salgo con tiempo"
            ],
            "explanation": "Primero reúnes lo necesario. Después te cambias y sales."
          },
          {
            "icon": "💻",
            "scenario": "Videollamada. La llamada empieza a las 19:00.",
            "hint": "¿Qué necesita el dispositivo antes de la llamada?",
            "steps": [
              "Cargo el dispositivo",
              "busco un lugar tranquilo",
              "entro a las 19:00"
            ],
            "explanation": "Cargar y preparar el lugar son pasos anteriores a entrar."
          },
          {
            "icon": "✂️",
            "scenario": "Peluquería. Tienes cita a las 17:00.",
            "hint": "¿Qué dos datos compruebas antes de salir?",
            "steps": [
              "Compruebo la dirección",
              "preparo cómo pagar",
              "salgo con tiempo"
            ],
            "explanation": "Saber dónde ir y llevar el pago ayuda a completar la cita."
          },
          {
            "icon": "🐾",
            "scenario": "Veterinario. Tu mascota tiene cita a las 16:30.",
            "hint": "¿Cómo viaja la mascota de forma segura?",
            "steps": [
              "Preparo el transportín",
              "guardo la información de la cita",
              "salgo con tiempo"
            ],
            "explanation": "La mascota y la información deben estar listas antes de salir."
          }
        ]
      },
      {
        "id": "prepare",
        "name": "Nivel 2",
        "description": "Prepara lo necesario",
        "stars": 1,
        "cases": [
          {
            "icon": "🏊",
            "scenario": "Piscina. Vas a nadar a las 12:00.",
            "hint": "Piensa qué usas dentro y después de la piscina.",
            "steps": [
              "Preparo bañador",
              "toalla",
              "agua antes de salir"
            ],
            "explanation": "Son objetos útiles para nadar y cambiarte después."
          },
          {
            "icon": "📦",
            "scenario": "Correos. Vas a enviar un paquete.",
            "hint": "¿Qué necesita saber la persona que entrega el paquete?",
            "steps": [
              "Cierro el paquete",
              "llevo la dirección",
              "preparo cómo pagar"
            ],
            "explanation": "El paquete necesita destino y debe estar listo para entregar."
          },
          {
            "icon": "🛒",
            "scenario": "Supermercado. Vas a hacer una compra pequeña.",
            "hint": "¿Qué te ayuda a recordar lo que vas a comprar?",
            "steps": [
              "Llevo la lista",
              "una bolsa",
              "una forma de pago"
            ],
            "explanation": "La lista ayuda a recordar. La bolsa y el pago completan la compra."
          },
          {
            "icon": "🍳",
            "scenario": "Taller de cocina. Vas a aprender una receta.",
            "hint": "Piensa en proteger la ropa y apuntar la receta.",
            "steps": [
              "Preparo delantal",
              "cuaderno",
              "bolígrafo"
            ],
            "explanation": "El delantal protege la ropa. El cuaderno permite anotar."
          },
          {
            "icon": "🦷",
            "scenario": "Dentista. Tienes una revisión.",
            "hint": "¿Qué información confirma dónde y cuándo es la revisión?",
            "steps": [
              "Llevo los datos de la cita",
              "la tarjeta que use el centro"
            ],
            "explanation": "La información ayuda a identificar la cita al llegar."
          },
          {
            "icon": "🎒",
            "scenario": "Excursión de un día. Pasarás varias horas fuera.",
            "hint": "¿Qué necesitas para viajar y pasar unas horas fuera?",
            "steps": [
              "Preparo el billete",
              "agua",
              "una prenda ligera"
            ],
            "explanation": "El billete permite viajar. El agua y la prenda ayudan durante el día."
          },
          {
            "icon": "🤝",
            "scenario": "Entrevista de trabajo. Te esperan en una dirección nueva.",
            "hint": "¿Qué debes saber para llegar al lugar correcto?",
            "steps": [
              "Compruebo la dirección",
              "llevo el documento que me pidieron"
            ],
            "explanation": "Saber dónde ir y llevar lo solicitado permite acudir preparado."
          },
          {
            "icon": "🎨",
            "scenario": "Taller de pintura. Te piden llevar material básico.",
            "hint": "¿Con qué aplicas la pintura?",
            "steps": [
              "Preparo una bata",
              "pinceles",
              "el papel indicado"
            ],
            "explanation": "Son los materiales que pide el taller."
          }
        ]
      },
      {
        "id": "time",
        "name": "Nivel 3",
        "description": "Elige cuándo",
        "stars": 1,
        "cases": [
          {
            "icon": "🏥",
            "scenario": "Cita del martes. Es a las 10:00 y tardas 20 minutos en llegar.",
            "hint": "Busca una hora que deje 20 minutos de trayecto y un poco de margen.",
            "steps": [
              "Preparo lo necesario el lunes por la tarde",
              "salgo el martes a las 9:30"
            ],
            "explanation": "Preparar antes y añadir diez minutos de margen ayuda a llegar a tiempo."
          },
          {
            "icon": "🚆",
            "scenario": "Tren del sábado. Sale a las 11:30.",
            "hint": "¿Qué momento es anterior, pero cercano, a las 11:30 del sábado?",
            "steps": [
              "Hago la bolsa el viernes",
              "llego a la estación a las 11:10"
            ],
            "explanation": "La bolsa queda lista y llegas antes de la salida."
          },
          {
            "icon": "📚",
            "scenario": "Biblioteca. Cierra hoy a las 18:00 y tardas 15 minutos.",
            "hint": "Necesitas llegar antes de las 18:00 de hoy.",
            "steps": [
              "Salgo a las 17:30",
              "devuelvo el libro antes del cierre"
            ],
            "explanation": "Hay tiempo para el trayecto y para entregar el libro."
          },
          {
            "icon": "💻",
            "scenario": "Videollamada del miércoles. Empieza a las 19:00.",
            "hint": "¿Qué puedes preparar unas horas antes?",
            "steps": [
              "Cargo el dispositivo por la tarde",
              "entro a las 19:00"
            ],
            "explanation": "La batería queda lista antes de la llamada."
          },
          {
            "icon": "💼",
            "scenario": "Turno de trabajo. Empieza a las 15:00 y tardas 30 minutos.",
            "hint": "Cuenta 30 minutos de trayecto y añade un poco de margen.",
            "steps": [
              "Preparo la ropa por la mañana",
              "salgo a las 14:20"
            ],
            "explanation": "Tienes 30 minutos de trayecto y diez de margen."
          },
          {
            "icon": "🏃",
            "scenario": "Actividad deportiva. Empieza a las 18:00 y tardas 20 minutos.",
            "hint": "¿Qué hora está 30 minutos antes de las 18:00?",
            "steps": [
              "Preparo la bolsa por la tarde",
              "salgo a las 17:30"
            ],
            "explanation": "Llegas con diez minutos de margen."
          },
          {
            "icon": "🎓",
            "scenario": "Clase del lunes. Empieza a las 9:00 y tardas 20 minutos.",
            "hint": "Puedes preparar la mochila la tarde anterior.",
            "steps": [
              "Preparo la mochila el domingo",
              "salgo el lunes a las 8:30"
            ],
            "explanation": "La mochila queda lista y llegas con margen."
          },
          {
            "icon": "🎭",
            "scenario": "Teatro. La función empieza a las 20:00 y tardas 20 minutos.",
            "hint": "Elige una llegada poco antes de las 20:00.",
            "steps": [
              "Compruebo la ruta por la tarde",
              "llego al teatro a las 19:40"
            ],
            "explanation": "Llegas antes de que empiece la función."
          }
        ]
      }
    ]
  },
  "en": {
    "roundSize": 5,
    "levels": [
      {
        "id": "order",
        "name": "Level 1",
        "description": "Put the plan in order",
        "stars": 1,
        "cases": [
          {
            "icon": "🏥",
            "scenario": "Doctor's office. You have an appointment at 10:00 a.m. The trip takes 20 minutes.",
            "hint": "What do you need to check and prepare before leaving?",
            "steps": [
              "Check the time",
              "prepare the appointment card",
              "leave at 9:30 a.m."
            ],
            "explanation": "Preparing first and leaving extra time helps you arrive calmly."
          },
          {
            "icon": "📚",
            "scenario": "Library. You must return a book before 6:00 p.m.",
            "hint": "Which item must you take?",
            "steps": [
              "Put the book in your bag",
              "check the route",
              "leave early"
            ],
            "explanation": "Prepare the book first. Then check the route and leave."
          },
          {
            "icon": "🎓",
            "scenario": "Class. Class starts at 9:00 a.m.",
            "hint": "Think about what goes in your bag before you leave.",
            "steps": [
              "Pack the notebook",
              "eat breakfast",
              "leave before 9:00 a.m."
            ],
            "explanation": "Packing the materials first helps prevent forgetting them."
          },
          {
            "icon": "🚆",
            "scenario": "Train. The train leaves at 11:30 a.m.",
            "hint": "What should you check before boarding?",
            "steps": [
              "Prepare the ticket",
              "check the platform",
              "arrive before 11:30 a.m."
            ],
            "explanation": "Check the ticket and platform before boarding."
          },
          {
            "icon": "💼",
            "scenario": "Work. Your shift starts at 3:00 p.m.",
            "hint": "Which two things should be ready before leaving?",
            "steps": [
              "Prepare your work clothes",
              "pack your meal",
              "leave early"
            ],
            "explanation": "Having everything ready helps you arrive prepared."
          },
          {
            "icon": "🏃",
            "scenario": "Sports. The activity starts at 6:00 p.m.",
            "hint": "What goes in your sports bag?",
            "steps": [
              "Pack clothes",
              "water",
              "get changed",
              "leave early"
            ],
            "explanation": "Gather what you need first. Then get changed and leave."
          },
          {
            "icon": "💻",
            "scenario": "Video call. The call starts at 7:00 p.m.",
            "hint": "What does the device need before the call?",
            "steps": [
              "Charge the device",
              "find a quiet place",
              "join at 7:00 p.m."
            ],
            "explanation": "Charging and preparing the place come before joining."
          },
          {
            "icon": "✂️",
            "scenario": "Hair appointment. Your appointment is at 5:00 p.m.",
            "hint": "Which two details should you check before leaving?",
            "steps": [
              "Check the address",
              "prepare how to pay",
              "leave early"
            ],
            "explanation": "Knowing where to go and having payment ready helps complete the appointment."
          },
          {
            "icon": "🐾",
            "scenario": "Veterinarian. Your pet has an appointment at 4:30 p.m.",
            "hint": "How can your pet travel safely?",
            "steps": [
              "Prepare the carrier",
              "pack the appointment details",
              "leave early"
            ],
            "explanation": "Your pet and the information should be ready before leaving."
          }
        ]
      },
      {
        "id": "prepare",
        "name": "Level 2",
        "description": "Prepare what you need",
        "stars": 1,
        "cases": [
          {
            "icon": "🏊",
            "scenario": "Pool. You are going swimming at noon.",
            "hint": "Think about what you use in the pool and afterward.",
            "steps": [
              "Pack a swimsuit",
              "towel",
              "water before leaving"
            ],
            "explanation": "These are useful for swimming and changing afterward."
          },
          {
            "icon": "📦",
            "scenario": "Post office. You are sending a parcel.",
            "hint": "What does the delivery worker need to know?",
            "steps": [
              "Close the parcel",
              "take the address",
              "prepare payment"
            ],
            "explanation": "The parcel needs a destination and must be ready to hand over."
          },
          {
            "icon": "🛒",
            "scenario": "Grocery store. You are doing a small shop.",
            "hint": "What helps you remember what to buy?",
            "steps": [
              "Take the list",
              "a bag",
              "a way to pay"
            ],
            "explanation": "The list helps you remember. The bag and payment complete the shop."
          },
          {
            "icon": "🍳",
            "scenario": "Cooking workshop. You are learning a recipe.",
            "hint": "Think about protecting clothes and writing down the recipe.",
            "steps": [
              "Pack an apron",
              "notebook",
              "pen"
            ],
            "explanation": "The apron protects clothes. The notebook lets you take notes."
          },
          {
            "icon": "🦷",
            "scenario": "Dentist. You have a checkup.",
            "hint": "Which information confirms where and when the checkup is?",
            "steps": [
              "Take the appointment details",
              "the card used by the office"
            ],
            "explanation": "The information helps the office find your appointment."
          },
          {
            "icon": "🎒",
            "scenario": "Day trip. You will be out for several hours.",
            "hint": "What do you need to travel and spend a few hours away?",
            "steps": [
              "Pack the ticket",
              "water",
              "a light layer"
            ],
            "explanation": "The ticket lets you travel. Water and a layer help during the day."
          },
          {
            "icon": "🤝",
            "scenario": "Job interview. You are expected at a new address.",
            "hint": "What do you need to know to reach the right place?",
            "steps": [
              "Check the address",
              "take the requested document"
            ],
            "explanation": "Knowing where to go and bringing what was requested helps you arrive prepared."
          },
          {
            "icon": "🎨",
            "scenario": "Painting workshop. You are asked to bring basic materials.",
            "hint": "What do you use to apply paint?",
            "steps": [
              "Pack a smock",
              "brushes",
              "the requested paper"
            ],
            "explanation": "These are the materials requested by the workshop."
          }
        ]
      },
      {
        "id": "time",
        "name": "Level 3",
        "description": "Choose when",
        "stars": 1,
        "cases": [
          {
            "icon": "🏥",
            "scenario": "Tuesday appointment. It is at 10:00 a.m. and the trip takes 20 minutes.",
            "hint": "Find a time that allows 20 minutes plus a little extra.",
            "steps": [
              "Prepare on Monday evening",
              "leave Tuesday at 9:30 a.m."
            ],
            "explanation": "Preparing early and adding ten minutes gives enough travel time."
          },
          {
            "icon": "🚆",
            "scenario": "Saturday train. It leaves at 11:30 a.m.",
            "hint": "Which time is before, but close to, 11:30 a.m. on Saturday?",
            "steps": [
              "Pack on Friday",
              "arrive at the station at 11:10 a.m."
            ],
            "explanation": "Your bag is ready and you arrive before departure."
          },
          {
            "icon": "📚",
            "scenario": "Library. It closes today at 6:00 p.m. and the trip takes 15 minutes.",
            "hint": "You need to arrive before 6:00 p.m. today.",
            "steps": [
              "Leave at 5:30 p.m.",
              "return the book before closing"
            ],
            "explanation": "There is time to travel and return the book."
          },
          {
            "icon": "💻",
            "scenario": "Wednesday video call. It starts at 7:00 p.m.",
            "hint": "What can you prepare a few hours earlier?",
            "steps": [
              "Charge the device in the afternoon",
              "join at 7:00 p.m."
            ],
            "explanation": "The battery is ready before the call."
          },
          {
            "icon": "💼",
            "scenario": "Work shift. It starts at 3:00 p.m. and the trip takes 30 minutes.",
            "hint": "Count 30 minutes of travel and add a little extra.",
            "steps": [
              "Prepare clothes in the morning",
              "leave at 2:20 p.m."
            ],
            "explanation": "You have 30 minutes to travel and ten extra minutes."
          },
          {
            "icon": "🏃",
            "scenario": "Sports activity. It starts at 6:00 p.m. and the trip takes 20 minutes.",
            "hint": "Which time is 30 minutes before 6:00 p.m.?",
            "steps": [
              "Pack in the afternoon",
              "leave at 5:30 p.m."
            ],
            "explanation": "You arrive with ten minutes to spare."
          },
          {
            "icon": "🎓",
            "scenario": "Monday class. It starts at 9:00 a.m. and the trip takes 20 minutes.",
            "hint": "You can pack on the previous evening.",
            "steps": [
              "Pack on Sunday",
              "leave Monday at 8:30 a.m."
            ],
            "explanation": "Your bag is ready and you arrive early."
          },
          {
            "icon": "🎭",
            "scenario": "Theater. The show starts at 8:00 p.m. and the trip takes 20 minutes.",
            "hint": "Choose an arrival shortly before 8:00 p.m.",
            "steps": [
              "Check the route in the afternoon",
              "arrive at 7:40 p.m."
            ],
            "explanation": "You arrive before the show starts."
          }
        ]
      }
    ]
  }
};
