/* ============================================================
   Datos: chistes (es) y jokes (en) para entender el humor.
   Formato: DATA.es / DATA.en = [{ text, options: string[3], correct,
     pistas: string[3] }]
   - options[correct] es la explicación de por qué el chiste es gracioso.
     Se muestra al acertar y tras el segundo fallo.
   - pistas tiene una pista por cada opción, en su mismo orden. La de la
     opción correcta va vacía. La pista del primer fallo explica por qué
     esa opción no hace gracia y apunta hacia la correcta, sin decirla.
   Cada idioma tiene sus propios chistes: no son traducciones unos de
   otros (I18N.md §3). app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: [
    {
      text: "¿Cuál es el café más peligroso? El ex-preso.",
      options: [
        "Los cafés se escapan de la cafetera",
        "Juego de palabras: 'expreso' (café) suena como 'ex-preso' (alguien que estuvo en la cárcel)",
        "El café es peligroso porque tiene mucha cafeína"
      ],
      correct: 1,
      pistas: [
        "¿Puede un café escaparse de la cafetera? Piensa en el nombre de la bebida.",
        "",
        "¿Solo importa la cafeína? Fíjate en cómo suena el nombre del café."
      ]
    },
    {
      text: "¿Qué hace una abeja en el gimnasio? ¡Zumba!",
      options: [
        "Juego de palabras: 'zumba' es un baile de gimnasio y también el sonido de la abeja",
        "Las abejas hacen ejercicio para producir miel",
        "Las abejas no pueden entrar en el gimnasio"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Hace la abeja ejercicio para producir miel? Piensa en el sonido que hace al volar.",
        "¿Está prohibido que entren abejas? Fíjate en la palabra que dice la abeja."
      ]
    },
    {
      text: "¿Por qué el libro de historia estaba triste? Porque tenía demasiado pasado.",
      options: [
        "Los libros de historia son aburridos",
        "Doble sentido: 'pasado' como tiempo antiguo y como cosas dolorosas",
        "Los libros se entristecen cuando nadie los lee"
      ],
      correct: 1,
      pistas: [
        "¿La historia es aburrida, o hay una palabra con dos sentidos? Mira la palabra 'pasado'.",
        "",
        "¿Los libros sienten algo cuando nadie los lee? Fíjate en la palabra 'pasado'."
      ]
    },
    {
      text: "¿Qué le dijo el cero al ocho? Bonito cinturón.",
      options: [
        "Los números tienen buenos modales",
        "Los ceros se ponen cinturones",
        "Juego con la forma: el 8 tiene una parte estrecha en el medio, como un cinturón"
      ],
      correct: 2,
      pistas: [
        "¿Los números tienen modales? Piensa en lo que se dice de alguien bien vestido.",
        "¿Los ceros se ponen cinturón? Fíjate en la forma del cero, no en lo que lleva.",
        ""
      ]
    },
    {
      text: "¿Cuál es el colmo de un jardinero? Que su novia lo deje plantado.",
      options: [
        "Plantar flores es lo que más le gusta",
        "Doble sentido de 'plantado': plantar flores y dejar a alguien esperando",
        "Los jardineros se enfadan con sus plantas"
      ],
      correct: 1,
      pistas: [
        "¿Lo que más le gusta a un jardinero es plantar? Piensa en otra forma de usar 'plantado'.",
        "",
        "¿Se enfada el jardinero con sus plantas? Fíjate en la palabra 'plantado' de la frase."
      ]
    },
    {
      text: "¿Qué le dice un semáforo a otro? No me mires, que me estoy cambiando.",
      options: [
        "Los semáforos se cambian de ropa",
        "Los semáforos no quieren que los miren los coches",
        "Juego con 'cambiar': el semáforo cambia de color, y suena a cambiarse de ropa"
      ],
      correct: 2,
      pistas: [
        "¿Los semáforos llevan ropa? Piensa en lo que cambia un semáforo cuando funciona.",
        "¿Los coches miran a los semáforos? Piensa en la palabra 'cambiando'.",
        ""
      ]
    },
    {
      text: "Doctor, doctor, siempre me siento invisible. —Siguiente.",
      options: [
        "El médico no sabe escuchar bien",
        "Humor: el médico ni lo mira y dice 'siguiente' como si no existiera",
        "Los pacientes invisibles no pagan"
      ],
      correct: 1,
      pistas: [
        "¿Un buen médico escucha bien? Piensa en lo que hace el médico al final.",
        "",
        "¿Pagar o no pagar cambia algo? Fíjate en lo que dice el médico."
      ]
    },
    {
      text: "—¿Qué le dice una iguana a su hermana gemela? —Somos iguanas.",
      options: [
        "Las iguanas se parecen mucho",
        "Juego de palabras: 'iguanas' suena como 'iguales' (somos iguales)",
        "Las iguanas viven en el mismo sitio"
      ],
      correct: 1,
      pistas: [
        "¿Solo se parecen? Piensa en cómo suena la palabra 'iguanas'.",
        "",
        "¿Dónde viven las iguanas? Piensa en el sonido de la palabra, no en el lugar."
      ]
    },
    {
      text: "¿Qué le dice un techo a otro techo? Techo de menos.",
      options: [
        "Los techos se hablan entre sí",
        "Juego de palabras: 'techo de menos' suena como 'te echo de menos'",
        "Los techos son muy altos"
      ],
      correct: 1,
      pistas: [
        "¿Los techos hablan? Piensa en lo que se dice cuando alguien nos falta.",
        "",
        "¿Qué tiene de especial la altura? Escucha bien la frase: ¿suena igual a otra?"
      ]
    },
    {
      text: "¿Por qué el tomate se puso rojo? Porque vio la ensalada sin ropa.",
      options: [
        "El tomate tenía calor",
        "Humor absurdo: el tomate se pone rojo de vergüenza al ver la ensalada desnuda",
        "Las ensaladas se visten de rojo"
      ],
      correct: 1,
      pistas: [
        "¿Tiene calor un tomate? Piensa en por qué se pone rojo una persona.",
        "",
        "¿Se visten de rojo las ensaladas? Piensa en lo que sentimos al ver algo que no esperamos."
      ]
    },
    {
      text: "¿Cuál es el animal más antiguo? La cebra, porque está en blanco y negro.",
      options: [
        "Las cebras viven muchos años",
        "Juego: las fotos antiguas eran en blanco y negro, igual que la cebra",
        "La cebra es la más vieja de la sabana"
      ],
      correct: 1,
      pistas: [
        "¿Viven mucho las cebras? Piensa en qué significa 'antiguo' en la pregunta.",
        "",
        "¿Es la más vieja de la sabana? Fíjate en lo que dice la frase sobre los colores."
      ]
    },
    {
      text: "¿Por qué el pescado no fue a la fiesta? Porque era tímido y no quería que lo pescaran.",
      options: [
        "Los peces son muy tímidos",
        "Doble sentido: 'pescar' como sacar del agua y como atrapar a alguien",
        "Las fiestas son peligrosas para los peces"
      ],
      correct: 1,
      pistas: [
        "¿Los peces son tímidos de verdad? Piensa en la palabra 'pescar' de la frase.",
        "",
        "¿Es peligrosa la fiesta? Fíjate en la palabra 'pescaran' y en lo que quiere decir."
      ]
    },
    {
      text: "¿Por qué los huevos no cuentan chistes? Porque se pueden romper de risa.",
      options: [
        "Juego de palabras: 'romperse de risa' (reírse mucho) y romperse como un huevo",
        "A los huevos no les gusta reír",
        "Los chistes son peligrosos para los huevos"
      ],
      correct: 0,
      pistas: [
        "",
        "¿A los huevos les gusta reír? Piensa en la palabra 'romper'.",
        "¿Son peligrosos los chistes? Fíjate en lo que puede romperse en la frase."
      ]
    },
    {
      text: "¿Cuál es el colmo de un electricista? Que su mujer se llame Luz y lo deje a oscuras.",
      options: [
        "Los electricistas trabajan de noche",
        "Su mujer le da calor en casa",
        "Juego con 'Luz' (nombre y electricidad) y quedarse a oscuras"
      ],
      correct: 2,
      pistas: [
        "¿Trabajan de noche los electricistas? Piensa en qué significa el nombre de la mujer.",
        "¿Le da calor una mujer? Fíjate en lo que es la palabra 'Luz'.",
        ""
      ]
    },
    {
      text: "¿Cuál es el colmo de un panadero? Tener una masa de amigos.",
      options: [
        "Juego de palabras: 'masa' (pan) y 'masa' (mucha gente)",
        "Los panaderos tienen muchos amigos",
        "A los panaderos les gusta mucho el pan"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Tienen muchos amigos los panaderos? Piensa en otra forma de decir 'masa'.",
        "¿Les gusta el pan a los panaderos? Fíjate en la palabra 'masa'."
      ]
    },
    {
      text: "¿Qué le dice una impresora a otra? ¿Esa hoja es tuya o es impresión mía?",
      options: [
        "Las impresoras se enfadan cuando se atascan",
        "Juego de palabras: 'impresión' como papel impreso y como opinión",
        "Las impresoras hablan en voz alta"
      ],
      correct: 1,
      pistas: [
        "¿Se enfadan las impresoras? Piensa en la palabra 'impresión'.",
        "",
        "¿Hablan en voz alta? Mira qué significa 'impresión' en la frase."
      ]
    },
    {
      text: "¿Qué le dice el agua al hielo? Me das frío.",
      options: [
        "El agua y el hielo son amigos",
        "El hielo moja mucho",
        "Juego de palabras: 'dar frío' como incomodar, y el frío del hielo"
      ],
      correct: 2,
      pistas: [
        "¿Son amigos el agua y el hielo? Piensa en qué pasa cuando el agua se congela.",
        "¿El hielo moja? Piensa en lo que hace el hielo cuando se derrite.",
        ""
      ]
    },
    {
      text: "¿Qué le dice un jaguar a otro jaguar? Jaguar, ya te pillo.",
      options: [
        "Juego de palabras: 'jaguar' (animal y marca de coche) y 'ya te pillo'",
        "Los jaguares son muy rápidos",
        "Los jaguares juegan al escondite"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Son rápidos los jaguares? Piensa en la palabra 'jaguar' de la frase.",
        "¿Juegan al escondite? Fíjate en la frase 'ya te pillo'."
      ]
    },
    {
      text: "¿Qué le dice un gusano a otro? Nos vemos en la manzana.",
      options: [
        "Los gusanos viven en las manzanas",
        "Los gusanos son muy sociables",
        "Juego de palabras: 'manzana' (fruta) y 'manzana' (calle de la ciudad)"
      ],
      correct: 2,
      pistas: [
        "¿Viven los gusanos en las manzanas? Piensa en por qué se lo dice el gusano.",
        "¿Son sociables los gusanos? Fíjate en la palabra 'manzana' y lo que puede significar.",
        ""
      ]
    },
    {
      text: "¿Qué le dice un cero a otro cero? Nada.",
      options: [
        "Los ceros no valen nada",
        "Juego de palabras: 'nada' significa cero y también no decir nada",
        "Los ceros se llevan mal con los demás números"
      ],
      correct: 1,
      pistas: [
        "¿Valen algo los ceros? Piensa en lo que vale un número cero.",
        "",
        "¿Se llevan mal los números? Fíjate en la palabra 'nada' de la respuesta."
      ]
    },
    {
      text: "¿Cómo se despiden los químicos? Ácido un placer.",
      options: [
        "Juego de palabras: 'ácido' suena como 'a gusto' (encantado de conocerte)",
        "Los químicos siempre están de mal humor",
        "Los químicos usan ácidos para despedirse"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Están siempre de mal humor los químicos? Piensa en lo que dice la frase.",
        "¿Usan ácidos para despedirse? Fíjate en el sonido de la palabra 'ácido'."
      ]
    },
    {
      text: "¿Por qué los peces no usan el móvil? Porque tienen miedo a la red.",
      options: [
        "Los peces no saben usar el móvil",
        "Juego de palabras: 'red' es la de pescar y también la de internet",
        "Los peces prefieren el agua al aire"
      ],
      correct: 1,
      pistas: [
        "¿No saben los peces usar el móvil? Piensa en lo que de verdad temen.",
        "",
        "¿Prefieren el agua al aire? Piensa en la palabra 'red' de la frase."
      ]
    },
    {
      text: "Pepito pregunta: —Papá, ¿qué es la inflación? —Hijo, es cuando todo sube menos tu sueldo.",
      options: [
        "Es un globo que sube al cielo",
        "Humor de la vida real: los precios suben y el sueldo no",
        "Es el nombre de un banco"
      ],
      correct: 1,
      pistas: [
        "¿Tiene que ver un globo con los precios? Piensa en la palabra 'sube' de la respuesta.",
        "",
        "¿Qué banco tiene que ver con los precios? Piensa en lo que le pasa a tu sueldo."
      ]
    },
    {
      text: "¿Qué le dice el 3 al 30? Sin mí no vales nada.",
      options: [
        "Los números se pelean por el valor",
        "Juego con el cero: el cero da valor al 3 y lo convierte en 30",
        "El 3 es mejor número que el 30"
      ],
      correct: 1,
      pistas: [
        "¿Los números se pelean? Piensa en lo que hace el cero en el número 30.",
        "",
        "¿Es mejor el 3 que el 30? Piensa en lo que añade el cero."
      ]
    },
    {
      text: "¿Qué hace un libro cuando tiene hambre? Se come sus palabras.",
      options: [
        "Los libros comen papel",
        "Juego con 'comerse las palabras' (retractarse) y las palabras del libro",
        "Los libros tienen mucha hambre"
      ],
      correct: 1,
      pistas: [
        "¿Comen papel los libros? Piensa en lo que significa 'comerse' aquí.",
        "",
        "¿Tienen hambre los libros? Piensa en la expresión 'comerse las palabras'."
      ]
    },
    {
      text: "¿Qué le dice el ajo a la cebolla? Te quiero, pero me haces llorar.",
      options: [
        "Las verduras se quieren mucho",
        "Humor: la cebolla hace llorar al cortarla",
        "El ajo es un llorón"
      ],
      correct: 1,
      pistas: [
        "¿Se quieren mucho las verduras? Piensa en lo que pasa al cortar una de ellas.",
        "",
        "¿Llora el ajo? Piensa en quién hace llorar en la frase."
      ]
    }
  ],
  en: [
    {
      text: "Why don't skeletons fight each other? They don't have the guts.",
      options: [
        "Skeletons are too tired to fight",
        "Pun: 'guts' means both courage and insides, and skeletons have neither",
        "Skeletons are always friends"
      ],
      correct: 1,
      pistas: [
        "Are skeletons too tired to fight? Think about what the joke is playing with.",
        "",
        "Are skeletons always friends? Think about what a skeleton is made of."
      ]
    },
    {
      text: "What do you call cheese that isn't yours? Nacho cheese.",
      options: [
        "Cheese that tastes spicy",
        "Cheese that is too old",
        "Pun: 'nacho' sounds like 'not yo', which means 'not yours'"
      ],
      correct: 2,
      pistas: [
        "Does the cheese taste spicy? Think about what the joke does with the word 'nacho'.",
        "Is the cheese too old? Listen to the sounds in the question.",
        ""
      ]
    },
    {
      text: "Why was the scarecrow given an award? Because he was outstanding in his field.",
      options: [
        "Pun: 'outstanding in his field' means excellent, and he stands in a field",
        "Scarecrows never win prizes",
        "A scarecrow can talk to birds"
      ],
      correct: 0,
      pistas: [
        "",
        "Do scarecrows never win prizes? Think about what a scarecrow does all day.",
        "Can a scarecrow talk to birds? Think about the words 'outstanding in his field'."
      ]
    },
    {
      text: "What do you call a bear with no teeth? A gummy bear.",
      options: [
        "A bear that lost its teeth in a fight",
        "A bear that only eats honey",
        "Pun: a gummy bear is a sweet you can eat even without teeth"
      ],
      correct: 2,
      pistas: [
        "Does a bear lose its teeth in a fight? Think about what the joke means by 'no teeth'.",
        "Does a bear only eat honey? Think about the word 'gummy'.",
        ""
      ]
    },
    {
      text: "What do you call a sleeping dinosaur? A dino-snore.",
      options: [
        "A dinosaur that is very tired",
        "Pun: 'dino-snore' sounds like 'dinosaur', and a sleeping dinosaur snores",
        "A dinosaur that is afraid of the dark"
      ],
      correct: 1,
      pistas: [
        "Is a dinosaur tired? Think about what the joke is describing.",
        "",
        "Is a dinosaur afraid of the dark? Listen to the sounds in the name 'dino-snore'."
      ]
    },
    {
      text: "Why don't eggs tell jokes? They'd crack each other up.",
      options: [
        "Pun: 'crack up' means to laugh a lot, and eggs crack",
        "Eggs are too shy to speak",
        "Jokes are dangerous for eggs"
      ],
      correct: 0,
      pistas: [
        "",
        "Are eggs too shy to speak? Think about what happens to an egg when it breaks.",
        "Are jokes dangerous? Think about the words 'crack each other up'."
      ]
    },
    {
      text: "Why did the bicycle fall over? It was two tired.",
      options: [
        "Bicycles need rest every day",
        "Bicycles fall when the road is wet",
        "Pun: 'two tired' sounds like 'too tired', and a bicycle has two wheels"
      ],
      correct: 2,
      pistas: [
        "Do bicycles need rest? Listen to the words 'two tired' in the joke.",
        "Does a wet road make bicycles fall? Look at the word 'tired'.",
        ""
      ]
    },
    {
      text: "I used to be a banker, but I lost interest.",
      options: [
        "A banker can lose money",
        "Pun: 'lost interest' means stopped caring, and banks pay interest",
        "Bankers are always bored"
      ],
      correct: 1,
      pistas: [
        "Can a banker lose money? Think about what 'interest' means in a bank.",
        "",
        "Are bankers always bored? Think about the word 'interest' again."
      ]
    },
    {
      text: "Did you hear about the restaurant on the moon? Great food, no atmosphere.",
      options: [
        "The moon has many restaurants",
        "The food on the moon is cold",
        "Pun: 'atmosphere' means the air around a planet, and also the mood of a place"
      ],
      correct: 2,
      pistas: [
        "Are there many restaurants on the moon? Think about why the joke says 'no atmosphere'.",
        "Is the food cold on the moon? Think about what 'great food' is saying.",
        ""
      ]
    },
    {
      text: "How does a penguin build its house? Igloos it together.",
      options: [
        "Pun: 'igloo it together' sounds like 'glue it together', and penguins live in cold places",
        "Penguins build houses out of wood",
        "Penguins never build houses"
      ],
      correct: 0,
      pistas: [
        "",
        "Do penguins build houses out of wood? Think about where penguins live.",
        "Do penguins never build houses? Listen to the word 'igloos'."
      ]
    },
    {
      text: "I'm reading a book about anti-gravity. It's impossible to put down.",
      options: [
        "Anti-gravity books are very heavy",
        "Pun: 'impossible to put down' means it is so good you can't stop reading, and gravity pulls things down",
        "Books cannot be read upside down"
      ],
      correct: 1,
      pistas: [
        "Are anti-gravity books heavy? Think about what 'anti-gravity' means.",
        "",
        "Can books not be read upside down? Think about the phrase 'put down'."
      ]
    },
    {
      text: "Why did the math book look sad? Because it had too many problems.",
      options: [
        "Pun: 'problems' means maths exercises and also personal troubles",
        "Maths books are boring",
        "Books can feel sad"
      ],
      correct: 0,
      pistas: [
        "",
        "Are maths books boring? Think about the word 'problems' in the joke.",
        "Can books feel sad? Think about what the joke says about the book."
      ]
    },
    {
      text: "What do you call a fake noodle? An impasta.",
      options: [
        "A noodle that is very long",
        "A noodle from Italy",
        "Pun: 'impasta' sounds like 'impostor' (a fake), and pasta is a noodle"
      ],
      correct: 2,
      pistas: [
        "Is it long? Think about the word 'fake' in the question.",
        "Is it from Italy? Listen to the sounds in the answer.",
        ""
      ]
    },
    {
      text: "Why can't you trust atoms? They make up everything.",
      options: [
        "Atoms are so small that nobody can see them",
        "Pun: 'make up' means to invent a story, and also to form something",
        "Atoms are always lying"
      ],
      correct: 1,
      pistas: [
        "Are atoms too small to see? Think about the phrase 'make up'.",
        "",
        "Do atoms lie? Think about the phrase 'make up everything'."
      ]
    },
    {
      text: "What did the ocean say to the beach? Nothing, it just waved.",
      options: [
        "The ocean is very loud",
        "The beach cannot hear",
        "Pun: 'waved' means moved the water, and also said hello with a hand"
      ],
      correct: 2,
      pistas: [
        "Is the ocean loud? Think about what the ocean does to the beach.",
        "Can the beach hear? Think about the word 'waved'.",
        ""
      ]
    },
    {
      text: "Why did the tomato turn red? Because it saw the salad dressing.",
      options: [
        "Tomatoes turn red when they are hot",
        "Pun: the tomato blushed, like someone embarrassed, when it saw the salad dressing",
        "Salad dressing is red"
      ],
      correct: 1,
      pistas: [
        "Do tomatoes turn red when they are hot? Think about why a person turns red.",
        "",
        "Is salad dressing red? Think about what 'turn red' means in the joke."
      ]
    },
    {
      text: "What do you call a boomerang that doesn't come back? A stick.",
      options: [
        "Pun: a boomerang that does not return is just a stick",
        "A boomerang is always lost",
        "Sticks can fly"
      ],
      correct: 0,
      pistas: [
        "",
        "Is a boomerang always lost? Think about what a boomerang is supposed to do.",
        "Can sticks fly? Think about what the joke says the object is."
      ]
    },
    {
      text: "Why don't scientists trust stairs? Because they're always up to something.",
      options: [
        "Stairs are dangerous to climb",
        "Scientists are afraid of heights",
        "Pun: 'up to something' means plotting something, and stairs go up"
      ],
      correct: 2,
      pistas: [
        "Are stairs dangerous? Think about what 'up to something' means in English.",
        "Are scientists afraid of heights? Think about the word 'up' in the joke.",
        ""
      ]
    },
    {
      text: "I'm on a seafood diet. I see food and I eat it.",
      options: [
        "Pun: a seafood diet means eating anything you see, and seafood is food from the sea",
        "A seafood diet means eating only fish",
        "People on diets cannot see food"
      ],
      correct: 0,
      pistas: [
        "",
        "Does a seafood diet mean eating only fish? Think about what 'I eat it' means in the joke.",
        "Can people on diets not see food? Think about the phrase 'I see food'."
      ]
    },
    {
      text: "Why did the computer go to the doctor? It had a virus.",
      options: [
        "Computers get sick in winter",
        "Pun: a computer virus is a program that harms it, and a virus is also an illness",
        "Computers are afraid of doctors"
      ],
      correct: 1,
      pistas: [
        "Do computers get sick in winter? Think about what 'virus' means for a computer.",
        "",
        "Are computers afraid of doctors? Think about why the computer goes to the doctor."
      ]
    },
    {
      text: "Why did the coffee file a police report? It got mugged.",
      options: [
        "The coffee was too hot",
        "Pun: 'mugged' means robbed, and a mug is a coffee cup",
        "Coffee cannot write"
      ],
      correct: 1,
      pistas: [
        "Was the coffee too hot? Think about what 'filed a report' means.",
        "",
        "Can coffee not write? Think about what a police report needs."
      ]
    },
    {
      text: "What do you call a dog that does magic tricks? A labracadabrador.",
      options: [
        "A dog that sleeps all day",
        "A dog that loves to swim",
        "Pun: 'labracadabrador' mixes 'abracadabra' and 'labrador', a dog breed"
      ],
      correct: 2,
      pistas: [
        "Does the dog sleep all day? Think about what the word 'magic' points to.",
        "Does it love swimming? Listen to the start of the word.",
        ""
      ]
    },
    {
      text: "Why do cows wear bells? Because their horns don't work.",
      options: [
        "Cows like music",
        "Twist: the cows' horns 'don't work', so they wear bells instead",
        "Cows need to be warned about bees"
      ],
      correct: 1,
      pistas: [
        "Do cows like music? Think about what the bell is for.",
        "",
        "Do cows fear bees? Think about the word 'horns' in the joke."
      ]
    },
    {
      text: "How do you make a tissue dance? Put a little boogie in it.",
      options: [
        "Pun: 'boogie' means dancing, and 'boogers' are what tissues are for",
        "Tissues are very shy",
        "Dancing is bad for paper"
      ],
      correct: 0,
      pistas: [
        "",
        "Are tissues shy? Think about what a tissue is used for.",
        "Is dancing bad for paper? Think about the word 'boogie'."
      ]
    },
    {
      text: "Why was the broom late? It overswept.",
      options: [
        "Brooms are slow",
        "Brooms cannot tell the time",
        "Pun: 'overswept' sounds like 'overslept', and a broom sweeps"
      ],
      correct: 2,
      pistas: [
        "Are brooms slow? Think about the sound of the joke.",
        "Can brooms tell the time? Listen to the word 'overswept'.",
        ""
      ]
    },
    {
      text: "What do you call a belt made of watches? A waist of time.",
      options: [
        "Pun: 'waist' sounds like 'waste', and a belt goes round the waist",
        "Watches are very expensive",
        "Belts are for telling the time"
      ],
      correct: 0,
      pistas: [
        "",
        "Are watches expensive? Think about what the joke plays with: a belt and time.",
        "Do belts tell the time? Think about what a belt is made of."
      ]
    },
    {
      text: "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
      options: [
        "Golfers wear many trousers",
        "Pun: 'hole in one' is a golf term, and a hole can also appear in trousers",
        "Golf is cold in winter"
      ],
      correct: 1,
      pistas: [
        "Do golfers wear many trousers? Think about what the joke is about: a hole.",
        "",
        "Is golf cold? Think about why someone needs two pairs."
      ]
    },
    {
      text: "What do you call an alligator in a vest? An investigator.",
      options: [
        "A crocodile who loves clothes",
        "An alligator that works in a shop",
        "Pun: 'investigator' sounds like 'in a vest' plus 'alligator'"
      ],
      correct: 2,
      pistas: [
        "Does an alligator love clothes? Think about the word 'vest'.",
        "Does it work in a shop? Listen to the sounds in 'investigator'.",
        ""
      ]
    },
    {
      text: "What do you call a sleeping bull? A bulldozer.",
      options: [
        "Pun: 'bulldozer' sounds like 'bull that dozes', a sleeping bull",
        "A bull that is very tired",
        "A bull that can't wake up"
      ],
      correct: 0,
      pistas: [
        "",
        "Is a bull tired? Think about why the name sounds like a machine.",
        "Can a bull not wake up? Think about the name 'bulldozer'."
      ]
    },
    {
      text: "Why did the cookie go to the doctor? Because it felt crummy.",
      options: [
        "Cookies get sick easily",
        "Pun: 'crummy' means feeling ill, and cookies leave crumbs",
        "The doctor likes cookies"
      ],
      correct: 1,
      pistas: [
        "Do cookies get sick easily? Think about what 'felt' is saying.",
        "",
        "Does the doctor like cookies? Think about the word 'crummy'."
      ]
    },
    {
      text: "How do you organize a space party? You planet.",
      options: [
        "Parties are held in space",
        "Planets like to dance",
        "Pun: 'plan it' sounds like 'planet'"
      ],
      correct: 2,
      pistas: [
        "Are parties held in space? Think about the word 'organize'.",
        "Do planets dance? Think about the sound of the joke.",
        ""
      ]
    },
    {
      text: "What's orange and sounds like a parrot? A carrot.",
      options: [
        "Pun: 'carrot' sounds like 'parrot'",
        "An orange parrot",
        "A parrot that eats carrots"
      ],
      correct: 0,
      pistas: [
        "",
        "Is there an orange parrot? Think about what the riddle is asking.",
        "Do parrots eat carrots? Listen to the sound of the answer."
      ]
    },
    {
      text: "Why did the picture go to jail? Because it was framed.",
      options: [
        "Pictures commit crimes",
        "Pun: 'framed' means set up to look guilty, and a picture has a frame",
        "Jails are full of pictures"
      ],
      correct: 1,
      pistas: [
        "Do pictures commit crimes? Think about what 'framed' means.",
        "",
        "Are jails full of pictures? Think about the word 'framed'."
      ]
    },
    {
      text: "What's a tree's favourite drink? Root beer.",
      options: [
        "Trees drink water",
        "Trees like lemonade",
        "Pun: 'root beer' is a drink, and trees have roots"
      ],
      correct: 2,
      pistas: [
        "Do trees drink water? Think about what 'favourite' means for a drink.",
        "Do trees like lemonade? Think about the word 'root'.",
        ""
      ]
    },
    {
      text: "Why did the student eat his homework? Because the teacher said it was a piece of cake.",
      options: [
        "Pun: 'piece of cake' means easy, and the student took it literally",
        "Students like cake",
        "Homework is tasty"
      ],
      correct: 0,
      pistas: [
        "",
        "Do students like cake? Think about what the teacher meant by 'piece of cake'.",
        "Is homework tasty? Think about why he ate it."
      ]
    },
    {
      text: "What do you call a snake that works for the government? A civil serpent.",
      options: [
        "A snake that loves the government",
        "A snake with a uniform",
        "Pun: 'civil serpent' sounds like 'civil servant'"
      ],
      correct: 2,
      pistas: [
        "Does a snake love the government? Think about what a civil servant does.",
        "Does it wear a uniform? Listen to 'civil serpent'.",
        ""
      ]
    }
  ]
};
