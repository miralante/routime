/* ============================================================
   Datos: Doble Sentido (lenguaje — detectar si una palabra de la
   frase puede significar una cosa o dos cosas distintas).
   Formato:
   DATA.es / DATA.en = [{ id, name, items: [{ sentence, hasDouble,
     meanings: string[1 o 2], pistas: string[2] }] }]
   - 'sentence' es algo que se diría en la vida cotidiana (un mensaje,
     una petición en casa, una frase en la calle). La palabra ambigua
     aparece sin aclarar cuál de los dos sentidos es.
   - 'hasDouble' es la respuesta correcta a "¿tiene doble sentido?".
   - 'meanings' tiene 2 entradas si hasDouble es true (los dos
     significados reales) o 1 si es false (el único significado).
   - 'pistas' tiene una pista por botón, en el orden Sí, No. La del
     botón correcto va vacía. La pista del primer fallo señala la
     palabra clave sin decir la respuesta.
   Cada grupo mezcla a propósito frases con doble sentido y frases de
   un solo significado (mitad y mitad): el contraste es lo que enseña
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
        { sentence: 'Quedamos mañana en el banco, después de la compra.', hasDouble: true, meanings: ['un banco para sentarse 🪑', 'un banco de dinero 🏦'], pistas: ['', '¿La palabra "banco" puede ser un asiento y también un lugar para guardar dinero?'] },
        { sentence: 'Papá, ¿dónde está el gato?', hasDouble: true, meanings: ['un gato, el animal 🐱', 'un gato para cambiar la rueda del coche 🔧'], pistas: ['', '¿Piensa en la palabra "gato": puede ser un animal y también una herramienta del coche?'] },
        { sentence: 'Mamá, ¿has visto la vela?', hasDouble: true, meanings: ['una vela para dar luz 🕯️', 'una vela de barco ⛵'], pistas: ['', '¿La palabra "vela" puede dar luz y también estar en un barco?'] },
        { sentence: 'Oye, ¿tienes la llave?', hasDouble: true, meanings: ['una llave para abrir la puerta 🔑', 'una llave inglesa para arreglar tuberías 🔧'], pistas: ['', '¿La palabra "llave" sirve para abrir puertas y también para arreglar tuberías?'] },
        { sentence: 'Mi perro corre por el parque cada tarde.', hasDouble: false, meanings: ['un perro, el animal 🐶'], pistas: ['Revisa cada palabra: ¿"corre" o "parque" pueden significar otra cosa aquí?', ''] },
        { sentence: 'Espera un momento, que me ato el zapato.', hasDouble: false, meanings: ['un zapato para los pies 👟'], pistas: ['¿"ato" o "zapato" pueden significar otra cosa en esta frase?', ''] },
        { sentence: 'Pon el plato en la mesa, por favor.', hasDouble: false, meanings: ['una mesa para comer 🍽️'], pistas: ['¿"plato" o "mesa" tienen aquí un segundo significado?', ''] },
        { sentence: 'El coche ya está aparcado en la calle.', hasDouble: false, meanings: ['un coche para viajar 🚗'], pistas: ['¿"aparcado" o "calle" pueden significar otra cosa en la frase?', ''] }
      ]
    },
    {
      id: 'level2',
      name: 'Nivel 2 · Palabras menos evidentes',
      items: [
        { sentence: 'Me duele la muñeca desde ayer.', hasDouble: true, meanings: ['la muñeca, parte del brazo 💪', 'una muñeca, el juguete 🪆'], pistas: ['', '¿"Muñeca" puede ser parte del cuerpo y también un juguete?'] },
        { sentence: 'Mira qué copa tan alta.', hasDouble: true, meanings: ['una copa para beber 🥂', 'la copa de un árbol 🌳'], pistas: ['', '¿"Copa" puede ser un vaso y también la parte de arriba de un árbol?'] },
        { sentence: 'Cuida la planta del salón, que se seca.', hasDouble: true, meanings: ['una planta, un ser vivo 🌱', 'la planta del pie 🦶'], pistas: ['', '¿"Planta" puede ser una maceta con vida y también una parte del cuerpo?'] },
        { sentence: 'Ayer se cayó y le duele el radio.', hasDouble: true, meanings: ['un aparato de radio 📻', 'el radio, un hueso del brazo 💪'], pistas: ['', '¿"Radio" puede ser un aparato y también un hueso del brazo?'] },
        { sentence: 'Tomo el café en la taza de siempre.', hasDouble: false, meanings: ['una taza para beber ☕'], pistas: ['¿"Taza" o "café" pueden significar otra cosa aquí?', ''] },
        { sentence: 'Abre la ventana, que hace calor.', hasDouble: false, meanings: ['una ventana de la casa 🪟'], pistas: ['¿"Ventana" o "calor" tienen aquí un segundo significado?', ''] },
        { sentence: 'Hoy me pongo la camisa azul.', hasDouble: false, meanings: ['una camisa para vestir 👔'], pistas: ['¿"Camisa" o "azul" pueden significar otra cosa en la frase?', ''] },
        { sentence: 'Enciende la lámpara, que ya es de noche.', hasDouble: false, meanings: ['una lámpara para dar luz 💡'], pistas: ['¿"Lámpara" o "noche" pueden significar otra cosa aquí?', ''] }
      ]
    },
    {
      id: 'level3',
      name: 'Nivel 3 · Palabras más abstractas',
      items: [
        { sentence: 'En clase aprendimos que Madrid es la capital.', hasDouble: true, meanings: ['la capital, la ciudad principal de un país 🏛️', 'el capital, el dinero que tienes ahorrado 💰'], pistas: ['', '¿"Capital" puede ser una ciudad importante y también dinero ahorrado?'] },
        { sentence: 'Mi abuela dice que el cura tiene la cura.', hasDouble: true, meanings: ['un cura, un sacerdote ⛪', 'la cura de una enfermedad 💊'], pistas: ['', '¿"Cura" puede ser un sacerdote y también un tratamiento para una enfermedad?'] },
        { sentence: 'Cuidado con la corriente, que está fuerte.', hasDouble: true, meanings: ['la corriente eléctrica ⚡', 'la corriente de un río 🌊'], pistas: ['', '¿"Corriente" puede ser electricidad y también el agua de un río?'] },
        { sentence: 'El sábado vamos a la sierra.', hasDouble: true, meanings: ['la sierra, un grupo de montañas ⛰️', 'una sierra para cortar madera 🪚'], pistas: ['', '¿"Sierra" puede ser un conjunto de montañas y también una herramienta?'] },
        { sentence: 'Coge el paraguas, que va a llover.', hasDouble: false, meanings: ['un paraguas para la lluvia ☂️'], pistas: ['¿"Paraguas" o "llover" tienen aquí otro significado?', ''] },
        { sentence: 'Voy en bicicleta al colegio.', hasDouble: false, meanings: ['una bicicleta para montar 🚲'], pistas: ['¿"Bicicleta" o "colegio" pueden significar otra cosa en la frase?', ''] },
        { sentence: 'Sube por la escalera con cuidado.', hasDouble: false, meanings: ['una escalera para subir 🪜'], pistas: ['¿"Escalera" o "subir" tienen aquí un segundo significado?', ''] },
        { sentence: 'Lleva los libros en la mochila.', hasDouble: false, meanings: ['una mochila para llevar cosas 🎒'], pistas: ['¿"Mochila" o "libros" pueden significar otra cosa aquí?', ''] }
      ]
    }
  ],
  en: [
    {
      id: 'level1',
      name: 'Level 1 · Well-known words',
      items: [
        { sentence: "Let's meet at the bank after school.", hasDouble: true, meanings: ['a bank, where you keep money 🏦', 'a river bank 🌊'], pistas: ['', 'Can "bank" be a place for money and also the side of a river?'] },
        { sentence: 'Can you bring the bat to the park?', hasDouble: true, meanings: ['a bat, the animal 🦇', 'a bat for playing baseball ⚾'], pistas: ['', 'Can "bat" be an animal and also a sports tool?'] },
        { sentence: 'She showed me her new ring.', hasDouble: true, meanings: ['a ring, jewellery for your finger 💍', 'a ring, the sound a bell makes 🔔'], pistas: ['', 'Can "ring" be jewellery and also a sound?'] },
        { sentence: 'My sister wants to be a star.', hasDouble: true, meanings: ['a star in the sky ⭐', 'a star, a famous actor or singer 🌟'], pistas: ['', 'Can "star" be something in the sky and also a famous person?'] },
        { sentence: 'My dog runs in the park every day.', hasDouble: false, meanings: ['a dog, the animal 🐶'], pistas: ['Check each word: can "runs" or "park" mean something else here?', ''] },
        { sentence: 'Wait, I need to tie my shoe.', hasDouble: false, meanings: ['a shoe for your foot 👟'], pistas: ['Can "tie" or "shoe" mean something else in this sentence?', ''] },
        { sentence: 'Please put the plate on the table.', hasDouble: false, meanings: ['a table for eating 🍽️'], pistas: ['Do "plate" or "table" have a second meaning here?', ''] },
        { sentence: 'The car is parked outside the house.', hasDouble: false, meanings: ['a car for travelling 🚗'], pistas: ['Can "parked" or "outside" mean something else in the sentence?', ''] }
      ]
    },
    {
      id: 'level2',
      name: 'Level 2 · Less obvious words',
      items: [
        { sentence: 'Look at my palm.', hasDouble: true, meanings: ['the palm of your hand ✋', 'a palm tree 🌴'], pistas: ['', 'Can "palm" be part of your hand and also a tree?'] },
        { sentence: 'Can you open the trunk? My bag is in it.', hasDouble: true, meanings: ["an elephant's trunk 🐘", 'the trunk of a car 🚗'], pistas: ['', 'Can "trunk" be part of a car and also an elephant\'s nose?'] },
        { sentence: 'Listen to the bark outside!', hasDouble: true, meanings: ["a dog's bark, the sound it makes 🐕", 'the bark of a tree, its skin 🌳'], pistas: ['', 'Can "bark" be a dog\'s sound and also a tree\'s covering?'] },
        { sentence: 'It happens in spring.', hasDouble: true, meanings: ['spring, a season of the year 🌸', 'a spring, a metal coil that bounces ⚙️'], pistas: ['', 'Can "spring" be a season and also a metal coil?'] },
        { sentence: 'I always drink my tea from the blue cup.', hasDouble: false, meanings: ['a cup for drinking ☕'], pistas: ['Can "cup" or "tea" mean something else here?', ''] },
        { sentence: 'Please open the window, it is hot.', hasDouble: false, meanings: ['a window in the house 🪟'], pistas: ['Do "window" or "hot" have a second meaning here?', ''] },
        { sentence: 'I put on my shirt before school.', hasDouble: false, meanings: ['a shirt to wear 👔'], pistas: ['Can "shirt" or "school" mean something else in the sentence?', ''] },
        { sentence: 'Please turn on the lamp, it is dark.', hasDouble: false, meanings: ['a lamp to give light 💡'], pistas: ['Can "lamp" or "dark" mean something else here?', ''] }
      ]
    },
    {
      id: 'level3',
      name: 'Level 3 · More abstract words',
      items: [
        { sentence: 'Our teacher said Madrid is the capital.', hasDouble: true, meanings: ["the capital, a country's main city 🏛️", 'capital, money you have saved 💰'], pistas: ['', 'Can "capital" be a main city and also money?'] },
        { sentence: 'Be careful with the current near the bridge.', hasDouble: true, meanings: ['electric current ⚡', 'the current of a river 🌊'], pistas: ['', 'Can "current" be electricity and also water moving in a river?'] },
        { sentence: 'We need a plane to fix this door.', hasDouble: true, meanings: ['a plane, to fly in the sky ✈️', 'a plane, a tool to smooth wood 🪵'], pistas: ['', 'Can "plane" fly and also smooth wood?'] },
        { sentence: 'Please check the seal on the jar.', hasDouble: true, meanings: ['a seal, an animal that lives in the sea 🦭', 'a seal, to close something tightly 🔒'], pistas: ['', 'Can "seal" be an animal and also something that closes?'] },
        { sentence: 'Take an umbrella, it will rain later.', hasDouble: false, meanings: ['an umbrella for the rain ☂️'], pistas: ['Do "umbrella" or "rain" mean something else in the sentence?', ''] },
        { sentence: 'I ride my bicycle to school.', hasDouble: false, meanings: ['a bicycle to ride 🚲'], pistas: ['Can "bicycle" or "school" mean something else here?', ''] },
        { sentence: 'Please climb up the ladder carefully.', hasDouble: false, meanings: ['a ladder to climb 🪜'], pistas: ['Do "ladder" or "climb" have a second meaning here?', ''] },
        { sentence: 'Carry the books in your backpack today.', hasDouble: false, meanings: ['a backpack to carry things 🎒'], pistas: ['Can "backpack" or "books" mean something else in the sentence?', ''] }
      ]
    }
  ]
};
