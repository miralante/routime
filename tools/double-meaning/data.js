/* ============================================================
   Datos: Doble Sentido (lenguaje — detectar si una palabra de la
   frase puede significar una cosa o dos cosas distintas).
   Formato:
   DATA.es / DATA.en = [{ id, name, items: [{ sentence, hasDouble,
     meanings: string[1 o 2] }] }]
   - 'sentence' es algo que se diría en la vida cotidiana (un mensaje,
     una petición en casa, una frase en la calle). La palabra ambigua
     aparece sin aclarar cuál de los dos sentidos es.
   - 'hasDouble' es la respuesta correcta a "¿tiene doble sentido?".
   - 'meanings' tiene 2 entradas si hasDouble es true (los dos
     significados reales) o 1 si es false (el único significado).
   Cada grupo mezcla a propósito frases con doble sentido y frases de
   un solo significado (mitad y mitad), igual que Emergencias mezcla
   emergencias reales y falsas alarmas: el contraste es lo que enseña
   a distinguir, no una lista de solo "síes". 'id' de cada grupo se
   mantiene igual en es/en para conservar el progreso al cambiar de
   idioma. Las frases no son traducción unas de otras: cada idioma tiene
   sus propias palabras con doble sentido real (I18N.md §3).
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
var DATA = {
  es: [
    {
      id: 'level1',
      name: 'Nivel 1 · Palabras muy conocidas',
      items: [
        { sentence: 'Quedamos mañana en el banco, después de la compra.', hasDouble: true, meanings: ['un banco para sentarse 🪑', 'un banco de dinero 🏦'] },
        { sentence: 'Papá, ¿dónde está el gato?', hasDouble: true, meanings: ['un gato, el animal 🐱', 'un gato para cambiar la rueda del coche 🔧'] },
        { sentence: 'Mamá, ¿has visto la vela?', hasDouble: true, meanings: ['una vela para dar luz 🕯️', 'una vela de barco ⛵'] },
        { sentence: 'Oye, ¿tienes la llave?', hasDouble: true, meanings: ['una llave para abrir la puerta 🔑', 'una llave inglesa para arreglar tuberías 🔧'] },
        { sentence: 'Mi perro corre por el parque cada tarde.', hasDouble: false, meanings: ['un perro, el animal 🐶'] },
        { sentence: 'Espera un momento, que me ato el zapato.', hasDouble: false, meanings: ['un zapato para los pies 👟'] },
        { sentence: 'Pon el plato en la mesa, por favor.', hasDouble: false, meanings: ['una mesa para comer 🍽️'] },
        { sentence: 'El coche ya está aparcado en la calle.', hasDouble: false, meanings: ['un coche para viajar 🚗'] }
      ]
    },
    {
      id: 'level2',
      name: 'Nivel 2 · Palabras menos evidentes',
      items: [
        { sentence: 'Me duele la muñeca desde ayer.', hasDouble: true, meanings: ['la muñeca, parte del brazo 💪', 'una muñeca, el juguete 🪆'] },
        { sentence: 'Mira qué copa tan alta.', hasDouble: true, meanings: ['una copa para beber 🥂', 'la copa de un árbol 🌳'] },
        { sentence: 'Cuida la planta del salón, que se seca.', hasDouble: true, meanings: ['una planta, un ser vivo 🌱', 'la planta del pie 🦶'] },
        { sentence: 'Ayer se cayó y le duele el radio.', hasDouble: true, meanings: ['un aparato de radio 📻', 'el radio, un hueso del brazo 💪'] },
        { sentence: 'Tomo el café en la taza de siempre.', hasDouble: false, meanings: ['una taza para beber ☕'] },
        { sentence: 'Abre la ventana, que hace calor.', hasDouble: false, meanings: ['una ventana de la casa 🪟'] },
        { sentence: 'Hoy me pongo la camisa azul.', hasDouble: false, meanings: ['una camisa para vestir 👔'] },
        { sentence: 'Enciende la lámpara, que ya es de noche.', hasDouble: false, meanings: ['una lámpara para dar luz 💡'] }
      ]
    },
    {
      id: 'level3',
      name: 'Nivel 3 · Palabras más abstractas',
      items: [
        { sentence: 'En clase aprendimos que Madrid es la capital.', hasDouble: true, meanings: ['la capital, la ciudad principal de un país 🏛️', 'el capital, el dinero que tienes ahorrado 💰'] },
        { sentence: 'Mi abuela dice que el cura tiene la cura.', hasDouble: true, meanings: ['un cura, un sacerdote ⛪', 'la cura de una enfermedad 💊'] },
        { sentence: 'Cuidado con la corriente, que está fuerte.', hasDouble: true, meanings: ['la corriente eléctrica ⚡', 'la corriente de un río 🌊'] },
        { sentence: 'El sábado vamos a la sierra.', hasDouble: true, meanings: ['la sierra, un grupo de montañas ⛰️', 'una sierra para cortar madera 🪚'] },
        { sentence: 'Coge el paraguas, que va a llover.', hasDouble: false, meanings: ['un paraguas para la lluvia ☂️'] },
        { sentence: 'Voy en bicicleta al colegio.', hasDouble: false, meanings: ['una bicicleta para montar 🚲'] },
        { sentence: 'Sube por la escalera con cuidado.', hasDouble: false, meanings: ['una escalera para subir 🪜'] },
        { sentence: 'Lleva los libros en la mochila.', hasDouble: false, meanings: ['una mochila para llevar cosas 🎒'] }
      ]
    }
  ],
  en: [
    {
      id: 'level1',
      name: 'Level 1 · Well-known words',
      items: [
        { sentence: "Let's meet at the bank after school.", hasDouble: true, meanings: ['a bank, where you keep money 🏦', 'a river bank 🌊'] },
        { sentence: 'Can you bring the bat to the park?', hasDouble: true, meanings: ['a bat, the animal 🦇', 'a bat for playing baseball ⚾'] },
        { sentence: 'She showed me her new ring.', hasDouble: true, meanings: ['a ring, jewellery for your finger 💍', 'a ring, the sound a bell makes 🔔'] },
        { sentence: 'My sister wants to be a star.', hasDouble: true, meanings: ['a star in the sky ⭐', 'a star, a famous actor or singer 🌟'] },
        { sentence: 'My dog runs in the park every day.', hasDouble: false, meanings: ['a dog, the animal 🐶'] },
        { sentence: 'Wait, I need to tie my shoe.', hasDouble: false, meanings: ['a shoe for your foot 👟'] },
        { sentence: 'Please put the plate on the table.', hasDouble: false, meanings: ['a table for eating 🍽️'] },
        { sentence: 'The car is parked outside the house.', hasDouble: false, meanings: ['a car for travelling 🚗'] }
      ]
    },
    {
      id: 'level2',
      name: 'Level 2 · Less obvious words',
      items: [
        { sentence: 'Look at my palm.', hasDouble: true, meanings: ['the palm of your hand ✋', 'a palm tree 🌴'] },
        { sentence: 'Can you open the trunk? My bag is in it.', hasDouble: true, meanings: ["an elephant's trunk 🐘", 'the trunk of a car 🚗'] },
        { sentence: 'Listen to the bark outside!', hasDouble: true, meanings: ["a dog's bark, the sound it makes 🐕", 'the bark of a tree, its skin 🌳'] },
        { sentence: 'It happens in spring.', hasDouble: true, meanings: ['spring, a season of the year 🌸', 'a spring, a metal coil that bounces ⚙️'] },
        { sentence: 'I always drink my tea from the blue cup.', hasDouble: false, meanings: ['a cup for drinking ☕'] },
        { sentence: 'Please open the window, it is hot.', hasDouble: false, meanings: ['a window in the house 🪟'] },
        { sentence: 'I put on my shirt before school.', hasDouble: false, meanings: ['a shirt to wear 👔'] },
        { sentence: 'Please turn on the lamp, it is dark.', hasDouble: false, meanings: ['a lamp to give light 💡'] }
      ]
    },
    {
      id: 'level3',
      name: 'Level 3 · More abstract words',
      items: [
        { sentence: 'Our teacher said Madrid is the capital.', hasDouble: true, meanings: ["the capital, a country's main city 🏛️", 'capital, money you have saved 💰'] },
        { sentence: 'Be careful with the current near the bridge.', hasDouble: true, meanings: ['electric current ⚡', 'the current of a river 🌊'] },
        { sentence: 'We need a plane to fix this door.', hasDouble: true, meanings: ['a plane, to fly in the sky ✈️', 'a plane, a tool to smooth wood 🪵'] },
        { sentence: 'Please check the seal on the jar.', hasDouble: true, meanings: ['a seal, an animal that lives in the sea 🦭', 'a seal, to close something tightly 🔒'] },
        { sentence: 'Take an umbrella, it will rain later.', hasDouble: false, meanings: ['an umbrella for the rain ☂️'] },
        { sentence: 'I ride my bicycle to school.', hasDouble: false, meanings: ['a bicycle to ride 🚲'] },
        { sentence: 'Please climb up the ladder carefully.', hasDouble: false, meanings: ['a ladder to climb 🪜'] },
        { sentence: 'Carry the books in your backpack today.', hasDouble: false, meanings: ['a backpack to carry things 🎒'] }
      ]
    }
  ]
};
