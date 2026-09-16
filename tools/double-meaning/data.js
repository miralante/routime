/* ============================================================
   Datos: Doble Sentido (lenguaje — detectar si una palabra de la
   frase puede significar una cosa o dos cosas distintas).
   Formato:
   DATA.es / DATA.en = [{ id, name, items: [{ sentence, hasDouble,
     meanings: string[1 o 2] }] }]
   - 'sentence' usa la palabra ambigua (o no) en un contexto neutro,
     sin dar pistas de cuál de los dos sentidos es.
   - 'hasDouble' es la respuesta correcta a "¿tiene doble sentido?".
   - 'meanings' tiene 2 entradas si hasDouble es true (los dos
     significados reales) o 1 si es false (el único significado).
   Cada grupo mezcla a propósito words con doble sentido y
   words normales de un solo significado (mitad y mitad), igual
   que Emergencias mezcla emergencias reales y falsas alarmas: el
   contraste es lo que enseña a distinguir, no una lista de solo
   "síes". 'id' de cada grupo se mantiene igual en es/en para
   conservar el progreso al cambiar de idioma. Las words no son
   traducción unas de otras: cada idioma tiene sus propias words
   con doble sentido real (I18N.md §3) — coinciden en concepto
   (banco/bank, capital/capital) solo cuando el español y el inglés
   comparten la misma ambigüedad por casualidad.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
var DATA = {
  es: [
    {
      id: 'level1',
      name: 'Nivel 1 · Palabras muy conocidas',
      items: [
        { sentence: 'Nos sentamos en el banco.', hasDouble: true, meanings: ['un banco para sentarse 🪑', 'un banco de dinero 🏦'] },
        { sentence: 'Necesito el gato.', hasDouble: true, meanings: ['un gato, el animal 🐱', 'un gato para cambiar la rueda del coche 🔧'] },
        { sentence: 'Enciende la vela.', hasDouble: true, meanings: ['una vela para dar luz 🕯️', 'una vela de barco ⛵'] },
        { sentence: 'Dame la llave.', hasDouble: true, meanings: ['una llave para abrir la puerta 🔑', 'una llave inglesa para arreglar tuberías 🔧'] },
        { sentence: 'El perro corre en el parque.', hasDouble: false, meanings: ['un perro, el animal 🐶'] },
        { sentence: 'Me até el zapato.', hasDouble: false, meanings: ['un zapato para los pies 👟'] },
        { sentence: 'Pon el plato en la mesa.', hasDouble: false, meanings: ['una mesa para comer 🍽️'] },
        { sentence: 'El coche está aparcado.', hasDouble: false, meanings: ['un coche para viajar 🚗'] }
      ]
    },
    {
      id: 'level2',
      name: 'Nivel 2 · Palabras menos evidentes',
      items: [
        { sentence: 'Me duele la muñeca.', hasDouble: true, meanings: ['la muñeca, parte del brazo 💪', 'una muñeca, el juguete 🪆'] },
        { sentence: 'Mira esa copa.', hasDouble: true, meanings: ['una copa para beber 🥂', 'la copa de un árbol 🌳'] },
        { sentence: 'Cuida la planta.', hasDouble: true, meanings: ['una planta, un ser vivo 🌱', 'la planta del pie 🦶'] },
        { sentence: 'Le duele el radio.', hasDouble: true, meanings: ['un aparato de radio 📻', 'el radio, un hueso del brazo 💪'] },
        { sentence: 'Bebo café en la taza.', hasDouble: false, meanings: ['una taza para beber ☕'] },
        { sentence: 'Abre la ventana.', hasDouble: false, meanings: ['una ventana de la casa 🪟'] },
        { sentence: 'Me pongo la camisa.', hasDouble: false, meanings: ['una camisa para vestir 👔'] },
        { sentence: 'Enciende la lámpara.', hasDouble: false, meanings: ['una lámpara para dar luz 💡'] }
      ]
    },
    {
      id: 'level3',
      name: 'Nivel 3 · Palabras más abstractas',
      items: [
        { sentence: 'Madrid es la capital.', hasDouble: true, meanings: ['la capital, la ciudad principal de un país 🏛️', 'el capital, el dinero que tienes ahorrado 💰'] },
        { sentence: 'El cura habló en la iglesia.', hasDouble: true, meanings: ['un cura, un sacerdote ⛪', 'la cura de una enfermedad 💊'] },
        { sentence: 'Cuidado con la corriente.', hasDouble: true, meanings: ['la corriente eléctrica ⚡', 'la corriente de un río 🌊'] },
        { sentence: 'Vamos a la sierra.', hasDouble: true, meanings: ['la sierra, un grupo de montañas ⛰️', 'una sierra para cortar madera 🪚'] },
        { sentence: 'Coge el paraguas, va a llover.', hasDouble: false, meanings: ['un paraguas para la lluvia ☂️'] },
        { sentence: 'Voy en bicicleta al colegio.', hasDouble: false, meanings: ['una bicicleta para montar 🚲'] },
        { sentence: 'Sube por la escalera.', hasDouble: false, meanings: ['una escalera para subir 🪜'] },
        { sentence: 'Lleva los libros en la mochila.', hasDouble: false, meanings: ['una mochila para llevar cosas 🎒'] }
      ]
    }
  ],
  en: [
    {
      id: 'level1',
      name: 'Level 1 · Well-known words',
      items: [
        { sentence: 'We sat by the bank.', hasDouble: true, meanings: ['a bank, where you keep money 🏦', 'a river bank 🌊'] },
        { sentence: 'Look at the bat.', hasDouble: true, meanings: ['a bat, the animal 🦇', 'a bat for playing baseball ⚾'] },
        { sentence: 'She has a ring.', hasDouble: true, meanings: ['a ring, jewellery for your finger 💍', 'a ring, the sound a bell makes 🔔'] },
        { sentence: 'Look at the star.', hasDouble: true, meanings: ['a star in the sky ⭐', 'a star, a famous actor or singer 🌟'] },
        { sentence: 'The dog runs in the park.', hasDouble: false, meanings: ['a dog, the animal 🐶'] },
        { sentence: 'I tied my shoe.', hasDouble: false, meanings: ['a shoe for your foot 👟'] },
        { sentence: 'Put the plate on the table.', hasDouble: false, meanings: ['a table for eating 🍽️'] },
        { sentence: 'The car is parked.', hasDouble: false, meanings: ['a car for travelling 🚗'] }
      ]
    },
    {
      id: 'level2',
      name: 'Level 2 · Less obvious words',
      items: [
        { sentence: 'Look at my palm.', hasDouble: true, meanings: ['the palm of your hand ✋', 'a palm tree 🌴'] },
        { sentence: 'Open the trunk.', hasDouble: true, meanings: ["an elephant's trunk 🐘", 'the trunk of a car 🚗'] },
        { sentence: 'Listen to the bark.', hasDouble: true, meanings: ["a dog's bark, the sound it makes 🐕", 'the bark of a tree, its skin 🌳'] },
        { sentence: 'It happens in spring.', hasDouble: true, meanings: ['spring, a season of the year 🌸', 'a spring, a metal coil that bounces ⚙️'] },
        { sentence: 'I drink from the cup.', hasDouble: false, meanings: ['a cup for drinking ☕'] },
        { sentence: 'Open the window.', hasDouble: false, meanings: ['a window in the house 🪟'] },
        { sentence: 'I put on my shirt.', hasDouble: false, meanings: ['a shirt to wear 👔'] },
        { sentence: 'Turn on the lamp.', hasDouble: false, meanings: ['a lamp to give light 💡'] }
      ]
    },
    {
      id: 'level3',
      name: 'Level 3 · More abstract words',
      items: [
        { sentence: 'Madrid is the capital.', hasDouble: true, meanings: ["the capital, a country's main city 🏛️", 'capital, money you have saved 💰'] },
        { sentence: 'Careful with the current.', hasDouble: true, meanings: ['electric current ⚡', 'the current of a river 🌊'] },
        { sentence: 'Look at the plane.', hasDouble: true, meanings: ['a plane, to fly in the sky ✈️', 'a plane, a tool to smooth wood 🪵'] },
        { sentence: 'There is a seal.', hasDouble: true, meanings: ['a seal, an animal that lives in the sea 🦭', 'a seal, to close something tightly 🔒'] },
        { sentence: 'Take the umbrella, it will rain.', hasDouble: false, meanings: ['an umbrella for the rain ☂️'] },
        { sentence: 'I ride my bicycle to school.', hasDouble: false, meanings: ['a bicycle to ride 🚲'] },
        { sentence: 'Climb up the ladder.', hasDouble: false, meanings: ['a ladder to climb 🪜'] },
        { sentence: 'Carry the books in your backpack.', hasDouble: false, meanings: ['a backpack to carry things 🎒'] }
      ]
    }
  ]
};
