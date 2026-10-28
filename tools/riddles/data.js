/* ============================================================
   Datos: adivinanzas (es) y riddles en inglés (en).
   Formato: DATA.es / DATA.en = [{ text, options: string[3], correct,
     pistas: string[3], explicacion }]
   - options[correct] es la respuesta. explicacion dice por qué lo es y
     se muestra al acertar y tras el segundo fallo.
   - pistas tiene una pista por cada opción, en su mismo orden. La de la
     opción correcta va vacía. La pista del primer fallo explica por qué
     esa opción no encaja con la adivinanza y apunta hacia la correcta,
     sin decirla.
   Cada idioma tiene sus propias adivinanzas: no son traducciones unas
   de otras (I18N.md §3). app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: [
    {
      text: "Tiene agujas y no cose. Tiene números y no cuenta.",
      options: ["El reloj", "La costurera", "El alfiler"],
      correct: 0,
      pistas: [
        "",
        "La costurera sí cose, y la adivinanza dice que esto no cose. ¿Qué tiene agujas sin coser?",
        "Un alfiler tiene punta, pero ¿tiene números? Piensa en lo que sí los tiene."
      ],
      explicacion: "✅ Es el reloj: tiene agujas y números, pero no cose ni cuenta."
    },
    {
      text: "Blanca por dentro y verde por fuera. Si quieres que te lo diga, espera.",
      options: ["El melón", "La sandía", "La pera"],
      correct: 2,
      pistas: [
        "¿El melón es blanco por dentro? Piensa en el color de su interior.",
        "¿La sandía es blanca por dentro? Mira bien el color de su interior.",
        ""
      ],
      explicacion: "✅ Es la pera: verde por fuera, blanca por dentro, y se madura si esperas."
    },
    {
      text: "Oro parece, plata no es. El que no lo adivine, bien tonto es.",
      options: ["La naranja", "El plátano", "El limón"],
      correct: 1,
      pistas: [
        "¿La naranja tiene el color de la plata por dentro? Piensa en lo que dice la adivinanza.",
        "",
        "¿El limón es plata por dentro? Piensa en el color de su pulpa."
      ],
      explicacion: "✅ Es el plátano: amarillo como el oro por fuera, y su pulpa es blanca como la plata."
    },
    {
      text: "Tiene cuello y no tiene cabeza.",
      options: ["La jirafa", "La botella", "La cebolla"],
      correct: 1,
      pistas: [
        "Una jirafa sí tiene cabeza. ¿Cumple la adivinanza?",
        "",
        "¿La cebolla tiene cuello? Piensa en un recipiente largo con cuello."
      ],
      explicacion: "✅ Es la botella: tiene cuello, pero no tiene cabeza."
    },
    {
      text: "Cuanto más le quitas, más grande se hace.",
      options: ["El agujero", "La sombra", "La deuda"],
      correct: 0,
      pistas: [
        "",
        "¿La sombra crece cuando le quitas algo? Piensa en lo que pasa con la luz.",
        "¿La deuda crece cuando quitas dinero? Piensa en lo que pasa al pagar."
      ],
      explicacion: "✅ Es el agujero: cuanta más tierra le quitas, más grande se hace."
    },
    {
      text: "Siempre anda y nunca llega.",
      options: ["El perro", "La lluvia", "El camino"],
      correct: 2,
      pistas: [
        "Un perro que anda sí llega a algún sitio. ¿Qué anda sin llegar nunca?",
        "La lluvia cae y llega al suelo. ¿Qué no llega nunca?",
        ""
      ],
      explicacion: "✅ Es el camino: siempre anda, pero nunca llega a ningún sitio."
    },
    {
      text: "Mientras más se seca, más mojada está.",
      options: ["La toalla", "El sol", "La lluvia"],
      correct: 0,
      pistas: [
        "",
        "El sol seca, pero ¿se moja al secar? Piensa en lo que se seca.",
        "La lluvia moja, pero ¿se seca cuando la usas? Piensa en lo que se seca."
      ],
      explicacion: "✅ Es la toalla: cuanto más te secas con ella, más mojada queda."
    },
    {
      text: "Vuela sin alas y llora sin ojos.",
      options: ["El pájaro", "La nube", "El viento"],
      correct: 1,
      pistas: [
        "El pájaro vuela con alas, y la adivinanza dice sin alas. ¿Qué vuela sin alas?",
        "",
        "El viento no llora. ¿Qué flota en el cielo y da agua?"
      ],
      explicacion: "✅ Es la nube: vuela por el cielo sin alas y llora lluvia."
    },
    {
      text: "Corre sin piernas y murmura sin boca.",
      options: ["El coche", "La televisión", "El río"],
      correct: 2,
      pistas: [
        "Un coche corre con ruedas, no con piernas. ¿Qué corre de verdad sin piernas?",
        "La televisión habla, pero no corre. ¿Qué corre por un cauce?",
        ""
      ],
      explicacion: "✅ Es el río: corre sin piernas y su murmullo suena sin boca."
    },
    {
      text: "Tiene corona y no es rey. Tiene escamas y no es pez.",
      options: ["La piña", "El pez", "La cebolla"],
      correct: 0,
      pistas: [
        "",
        "El pez tiene escamas, pero no tiene corona. ¿Qué tiene las dos cosas?",
        "La cebolla tiene capas, pero ¿tiene corona? Piensa en lo que sale arriba de la fruta."
      ],
      explicacion: "✅ Es la piña: tiene una corona de hojas arriba y una piel con escamas."
    },
    {
      text: "Tengo dientes y no muerdo. Tengo pelo y no soy animal.",
      options: ["El peine", "La sierra", "El cepillo"],
      correct: 0,
      pistas: [
        "",
        "La sierra tiene dientes, pero ¿tiene pelo? Piensa en lo que no tiene.",
        "El cepillo tiene cerdas, pero ¿tiene dientes para morder? Piensa en otro objeto para peinar."
      ],
      explicacion: "✅ Es el peine: tiene muchos dientes que no muerden y sirve para peinar el pelo."
    },
    {
      text: "Sube y baja, pero nunca se mueve.",
      options: ["El ascensor", "El columpio", "La escalera"],
      correct: 2,
      pistas: [
        "El ascensor sí se mueve de verdad. ¿Lo que sube y baja se mueve?",
        "El columpio se mueve siempre. Piensa en lo que nunca cambia de sitio.",
        ""
      ],
      explicacion: "✅ Es la escalera: se sube y se baja por ella, pero se queda quieta."
    },
    {
      text: "Tiene la cabeza bajo tierra y los pies al aire.",
      options: ["El árbol", "La zanahoria", "El perro"],
      correct: 1,
      pistas: [
        "El árbol tiene las raíces bajo tierra y las hojas al aire. ¿Cuál es su cabeza?",
        "",
        "El perro no tiene la cabeza bajo tierra. Piensa en lo que crece en el huerto."
      ],
      explicacion: "✅ Es la zanahoria: crece con la punta bajo tierra y las hojas al aire."
    },
    {
      text: "Tiene un solo ojo y no ve.",
      options: ["La aguja", "La cámara", "El pirata"],
      correct: 0,
      pistas: [
        "",
        "La cámara tiene un ojo y sí ve. ¿Qué tiene un ojo y no ve nada?",
        "El pirata tiene un ojo y sí ve. Piensa en lo que la adivinanza dice que no hace."
      ],
      explicacion: "✅ Es la aguja: tiene un ojo para el hilo, pero no ve nada."
    }
  ],
  en: [
    {
      text: "What has keys but can't open locks?",
      options: ["A car", "A piano", "A map"],
      correct: 1,
      pistas: [
        "A car has keys that open doors. Think about music.",
        "",
        "A map has no keys. Think about an instrument with black and white keys."
      ],
      explicacion: "✅ A piano: it has keys, but they don't open locks."
    },
    {
      text: "What has hands but can't clap?",
      options: ["A glove", "A monkey", "A clock"],
      correct: 2,
      pistas: [
        "A glove has the shape of a hand. Think about what has hands and cannot clap.",
        "A monkey claps its hands. Think about what the riddle says cannot clap.",
        ""
      ],
      explicacion: "✅ A clock: it has hands, but they cannot clap."
    },
    {
      text: "What gets wetter the more it dries?",
      options: ["A towel", "The sun", "Rain"],
      correct: 0,
      pistas: [
        "",
        "The sun dries things, but does it get wet? Think about what is drying.",
        "Rain makes things wet, but does rain dry? Think about what gets wetter."
      ],
      explicacion: "✅ A towel: the more you dry yourself with it, the wetter it gets."
    },
    {
      text: "What has a head and a tail but no body?",
      options: ["A snake", "A coin", "A bird"],
      correct: 1,
      pistas: [
        "A snake has a body. Think about what has a head and a tail but no body.",
        "",
        "A bird has a body. Think about something flat with two sides."
      ],
      explicacion: "✅ A coin: it has heads and tails, but no body."
    },
    {
      text: "What has to be broken before you can use it?",
      options: ["A window", "An egg", "A bottle"],
      correct: 1,
      pistas: [
        "You do not break a window to use it. Think about food.",
        "",
        "A bottle can be opened without breaking. Think about what you crack to cook."
      ],
      explicacion: "✅ An egg: you have to crack it open before you can cook with it."
    },
    {
      text: "What goes up but never comes down?",
      options: ["A kite", "A bird", "Your age"],
      correct: 2,
      pistas: [
        "A kite comes down when the wind stops. Think about time.",
        "A bird lands again. Think about something that only grows.",
        ""
      ],
      explicacion: "✅ Your age: it goes up every year, and it never comes down."
    },
    {
      text: "What has many teeth but can't bite?",
      options: ["A shark", "A comb", "A dog"],
      correct: 1,
      pistas: [
        "A shark's teeth can bite. Think about what the riddle says cannot bite.",
        "",
        "A dog's teeth can bite. Think about an object that has teeth."
      ],
      explicacion: "✅ A comb: it has many teeth, but it cannot bite."
    },
    {
      text: "What has one eye but cannot see?",
      options: ["A needle", "A camera", "A pirate"],
      correct: 0,
      pistas: [
        "",
        "A camera has a lens, like an eye, and it sees. Think about a tool for sewing.",
        "A pirate with one eye can see. Think about the word 'cannot'."
      ],
      explicacion: "✅ A needle: it has an eye, but it cannot see."
    },
    {
      text: "What begins with T, ends with T, and has T in it?",
      options: ["A tent", "A toast", "A teapot"],
      correct: 2,
      pistas: [
        "A tent starts and ends with T. Does it have a T inside it?",
        "A toast starts with T, but does it end with T? Look at the letters.",
        ""
      ],
      explicacion: "✅ A teapot: it begins and ends with T, and has tea (T) inside."
    },
    {
      text: "What is full of holes but still holds water?",
      options: ["A sponge", "A bucket", "A net"],
      correct: 0,
      pistas: [
        "",
        "A bucket has no holes. Think about something full of holes that can hold water.",
        "A net is full of holes, but it does not hold water. Think about what soaks water up."
      ],
      explicacion: "✅ A sponge: it is full of holes, and it soaks up and holds water."
    },
    {
      text: "What runs but never walks?",
      options: ["A dog", "Water", "A snail"],
      correct: 1,
      pistas: [
        "A dog walks. Think about what runs without legs.",
        "",
        "A snail moves slowly, but it walks. Think about the word 'runs'."
      ],
      explicacion: "✅ Water: it runs down rivers and never walks."
    },
    {
      text: "I am tall when I am young and short when I am old. What am I?",
      options: ["A tree", "A pencil", "A candle"],
      correct: 2,
      pistas: [
        "A tree grows taller as it gets older. Think about what gets burnt up.",
        "A pencil gets shorter as you use it. Think about what gives light.",
        ""
      ],
      explicacion: "✅ A candle: it burns down as it gets older."
    },
    {
      text: "What has a neck but no head?",
      options: ["A giraffe", "A bottle", "A horse"],
      correct: 1,
      pistas: [
        "A giraffe has a head. Think about what has a neck and no head.",
        "",
        "A horse has a head. Think about a container with a neck."
      ],
      explicacion: "✅ A bottle: it has a neck, but no head."
    },
    {
      text: "What has legs but cannot walk?",
      options: ["A table", "A dog", "A person"],
      correct: 0,
      pistas: [
        "",
        "A dog has legs and walks. Think about what stays still.",
        "A person has legs and walks. Think about furniture."
      ],
      explicacion: "✅ A table: it has four legs, but it stays where it is."
    }
  ]
};
