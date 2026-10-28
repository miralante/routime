/* ============================================================
   Datos: dichos populares españoles (es) e idioms en inglés (en).
   Formato: DATA.es / DATA.en = [{ text, options: string[3], correct,
     pistas: string[3] }]
   - text es el dicho o la expresión tal como se dice.
   - options[correct] es su significado. Se muestra al acertar y tras el
     segundo fallo.
   - pistas tiene una pista por cada opción, en su mismo orden. La de la
     opción correcta va vacía. La pista del primer fallo explica por qué
     esa opción no es el significado y apunta hacia el correcto, sin
     decirlo.
   Cada idioma tiene sus propias expresiones: no son traducciones unas
   de otras (I18N.md §3). app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: [
    {
      text: "A quien madruga, Dios le ayuda",
      options: [
        "Quien se levanta temprano tiene más oportunidades",
        "Los madrugadores son los favoritos de Dios",
        "Dormir tarde trae mala suerte"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Dios elige a unos por encima de otros? Piensa en lo que hace quien se levanta pronto.",
        "¿Dormir tarde trae mala suerte? Piensa en lo que gana quien madruga."
      ]
    },
    {
      text: "No por mucho madrugar amanece más temprano",
      options: [
        "Madrugar cambia la hora a la que sale el sol",
        "Hay cosas que no dependen de nuestro esfuerzo",
        "Hay que dormir más para que amanezca antes"
      ],
      correct: 1,
      pistas: [
        "¿Puede el esfuerzo mover el sol? Piensa en lo que el dicho dice de madrugar.",
        "",
        "¿Dormir más adelanta el amanecer? Fíjate en la palabra 'mucho' del dicho."
      ]
    },
    {
      text: "El que mucho abarca, poco aprieta",
      options: [
        "Quien quiere hacer demasiadas cosas, no hace ninguna bien",
        "Los ambiciosos nunca están satisfechos",
        "Es mejor ser modesto que presumir"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Los ambiciosos nunca se conforman? Piensa en qué pasa cuando alguien quiere abarcarlo todo.",
        "¿Presumir es malo? Piensa en lo que pasa con quien intenta muchas cosas a la vez."
      ]
    },
    {
      text: "A cada cerdo le llega su San Martín",
      options: [
        "Los cerdos celebran la fiesta de San Martín",
        "Tarde o temprano, todos reciben su merecido",
        "Los animales de granja tienen santos protectores"
      ],
      correct: 1,
      pistas: [
        "¿Los cerdos celebran San Martín? Piensa en qué significa 'San Martín' en el dicho.",
        "",
        "¿Tienen santos los animales? Piensa en lo que se dice de quien hace algo malo."
      ]
    },
    {
      text: "Más vale pájaro en mano que ciento volando",
      options: [
        "Hay que cazar muchos pájaros antes de comer",
        "Los pájaros en la mano son más bonitos",
        "Más vale lo seguro que lo que aún no tienes"
      ],
      correct: 2,
      pistas: [
        "¿Hay que cazar muchos pájaros? Piensa en qué significa 'en mano' en el dicho.",
        "¿Los pájaros de la mano son más bonitos? Piensa en lo seguro frente a lo que no se tiene.",
        ""
      ]
    },
    {
      text: "Mucho ruido y pocas nueces",
      options: [
        "Se arma mucho escándalo y el resultado es poco",
        "Hay que cascar nueces con mucho ruido",
        "Las nueces hacen mucho ruido al caer"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Hay que cascar nueces con ruido? Piensa en lo que el dicho dice del resultado.",
        "¿Las nueces hacen ruido al caer? Piensa en lo que se compara: ruido frente a algo pequeño."
      ]
    },
    {
      text: "En boca cerrada no entran moscas",
      options: [
        "Hay que comer con la boca cerrada",
        "Callar evita problemas y malentendidos",
        "Las moscas no quieren entrar en casa"
      ],
      correct: 1,
      pistas: [
        "¿Hay que comer con la boca cerrada? Piensa en lo que quiere decir el dicho, no en la mesa.",
        "",
        "¿Las moscas evitan las casas? Piensa en lo que puede pasar cuando alguien habla de más."
      ]
    },
    {
      text: "Camarón que se duerme, se lo lleva la corriente",
      options: [
        "Quien no está atento pierde lo que tiene",
        "Los camarones deben dormir en el agua",
        "Hay que nadar contra la corriente"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Los camarones duermen en el agua? Piensa en lo que le pasa a quien se distrae.",
        "¿Hay que nadar contra la corriente? Piensa en lo que pasa a quien se duerme."
      ]
    },
    {
      text: "Dime con quién andas y te diré quién eres",
      options: [
        "Las personas tienen todas la misma personalidad",
        "Hay que andar solo para ser libre",
        "Las personas se conocen por sus amistades"
      ],
      correct: 2,
      pistas: [
        "¿Todas las personas son iguales? Piensa en lo que dice el dicho sobre los amigos.",
        "¿Es mejor andar solo? Piensa en quién acompaña a alguien.",
        ""
      ]
    },
    {
      text: "Más vale tarde que nunca",
      options: [
        "La puntualidad es lo más importante de todo",
        "Es mejor hacer algo tarde que no hacerlo nunca",
        "Llegar tarde siempre es lo mejor"
      ],
      correct: 1,
      pistas: [
        "¿La puntualidad es lo más importante? Piensa en lo que dice el dicho sobre llegar tarde.",
        "",
        "¿Llegar tarde siempre es lo mejor? Piensa en lo que se gana al hacer algo, aunque sea tarde."
      ]
    },
    {
      text: "No hay mal que por bien no venga",
      options: [
        "Los problemas siempre traen algo malo",
        "Hay que evitar todos los problemas",
        "De un problema puede salir algo bueno"
      ],
      correct: 2,
      pistas: [
        "¿Los problemas siempre traen algo malo? Piensa en la palabra 'bien' del dicho.",
        "¿Hay que evitar todos los problemas? Piensa en lo que se gana después de un mal momento.",
        ""
      ]
    },
    {
      text: "A río revuelto, ganancia de pescadores",
      options: [
        "Hay que pescar con cuidado en el río",
        "Aprovecharse del desorden para sacar ventaja",
        "Los pescadores prefieren el río sucio"
      ],
      correct: 1,
      pistas: [
        "¿Hay que pescar con cuidado? Piensa en lo que pasa cuando el agua se mueve.",
        "",
        "¿Prefieren los pescadores el río sucio? Piensa en quién se aprovecha de un desorden."
      ]
    },
    {
      text: "Quien tiene boca, se equivoca",
      options: [
        "Todos nos equivocamos alguna vez, sobre todo al hablar",
        "Quien tiene boca tiene más hambre",
        "Solo se equivocan los que hablan en público"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Tener boca da más hambre? Piensa en lo que dice la palabra 'boca' en el dicho.",
        "¿Solo se equivocan en público? Piensa en quién puede equivocarse."
      ]
    },
    {
      text: "Quien no arriesga, no gana",
      options: [
        "Para conseguir algo hay que atreverse",
        "Hay que apostar siempre todo el dinero",
        "Es mejor no ganar que arriesgar"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Hay que apostar siempre todo? Piensa en lo que dice el dicho sobre el riesgo.",
        "¿Es mejor no ganar? Piensa en quién se queda sin ganar."
      ]
    },
    {
      text: "A buen entendedor, pocas palabras bastan",
      options: [
        "Quien habla poco es más inteligente",
        "Hay que hablar mucho para que te entiendan",
        "Quien entiende bien no necesita muchas explicaciones"
      ],
      correct: 2,
      pistas: [
        "¿Hablar poco es señal de inteligencia? Piensa en lo que hace falta para entender algo.",
        "¿Hay que hablar mucho? Piensa en lo que dice el dicho sobre entender.",
        ""
      ]
    },
    {
      text: "Ojos que no ven, corazón que no siente",
      options: [
        "Hay que cerrar los ojos al dolor",
        "Lo que no vemos no nos afecta tanto",
        "El corazón siente lo que los ojos ven"
      ],
      correct: 1,
      pistas: [
        "¿Hay que cerrar los ojos al dolor? Piensa en lo que dice el dicho sobre el corazón.",
        "",
        "¿Sentimos solo lo que vemos? Piensa en lo que el dicho dice que no se siente."
      ]
    },
    {
      text: "Del dicho al hecho hay gran trecho",
      options: [
        "Decir algo es fácil; hacerlo, mucho más",
        "Lo que se dice siempre se hace",
        "Hay que hablar mucho para hacer algo"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Lo que se dice siempre se hace? Piensa en la distancia que hay entre dos cosas.",
        "¿Hay que hablar mucho para actuar? Piensa en lo que separa el dicho del hecho."
      ]
    },
    {
      text: "A caballo regalado no se le mira el diente",
      options: [
        "Hay que mirar bien los dientes de un caballo",
        "Los regalos siempre tienen un precio",
        "No se debe criticar lo que nos regalan"
      ],
      correct: 2,
      pistas: [
        "¿Hay que revisar los dientes? Piensa en lo que se hace con un regalo.",
        "¿Los regalos tienen precio? Piensa en lo que pasa con un caballo que te regalan.",
        ""
      ]
    },
    {
      text: "Más sabe el diablo por viejo que por diablo",
      options: [
        "El diablo es muy viejo",
        "La experiencia enseña más que la maldad",
        "Los diablos no envejecen"
      ],
      correct: 1,
      pistas: [
        "¿El diablo es viejo? Piensa en la palabra 'viejo' del dicho.",
        "",
        "¿Envejecen los diablos? Piensa en lo que el dicho dice de la experiencia."
      ]
    },
    {
      text: "Ande yo caliente y ríase la gente",
      options: [
        "No importa lo que digan los demás",
        "Hay que tener calor para reír",
        "La gente siempre se ríe de los demás"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Hay que tener calor para reír? Piensa en lo que el dicho dice de los demás.",
        "¿Se ríe siempre la gente de los demás? Piensa en qué actitud expresa el dicho."
      ]
    },
    {
      text: "El hábito no hace al monje",
      options: [
        "Los monjes deben vestir siempre igual",
        "Un hábito siempre enseña quién eres",
        "La apariencia no dice quién es una persona"
      ],
      correct: 2,
      pistas: [
        "¿Los monjes visten igual siempre? Piensa en qué significa 'hábito'.",
        "¿Un hábito dice quién eres? Piensa en la palabra 'hábito' como ropa.",
        ""
      ]
    },
    {
      text: "Hay que coger el toro por los cuernos",
      options: [
        "Hay que evitar a los toros",
        "Enfrentar un problema de frente",
        "Los toros tienen cuernos muy grandes"
      ],
      correct: 1,
      pistas: [
        "¿Hay que evitar los toros? Piensa en lo que el dicho recomienda hacer.",
        "",
        "¿Tienen cuernos grandes los toros? Piensa en el significado del dicho, no en el animal."
      ]
    },
    {
      text: "Quien da pronto, da dos veces",
      options: [
        "Ayudar pronto vale más que ayudar tarde",
        "Hay que dar dos veces lo mismo",
        "Dar siempre cuesta mucho"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Hay que dar dos veces lo mismo? Piensa en la palabra 'pronto' del dicho.",
        "¿Dar cuesta siempre mucho? Piensa en lo que se gana al ayudar a tiempo."
      ]
    },
    {
      text: "Más vale maña que fuerza",
      options: [
        "Hay que tener fuerza para todo",
        "Con habilidad se consigue más que con fuerza bruta",
        "Las mañas son malas"
      ],
      correct: 1,
      pistas: [
        "¿La fuerza siempre basta? Piensa en lo que significa 'maña' en el dicho.",
        "",
        "¿Las mañas son siempre malas? Piensa en qué quiere decir la palabra 'maña' aquí."
      ]
    },
    {
      text: "Al pan, pan, y al vino, vino",
      options: [
        "Hay que llamar a las cosas por su nombre",
        "Hay que comer pan con vino",
        "El pan y el vino son lo mismo"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Hay que comer pan con vino? Piensa en lo que el dicho dice sobre las palabras.",
        "¿Son lo mismo el pan y el vino? Piensa en lo que el dicho distingue."
      ]
    },
    {
      text: "Ojo por ojo y diente por diente",
      options: [
        "Pagar el mal con el mismo mal",
        "Mirar con atención para no perder nada",
        "Ir al dentista cada año"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Hay que mirar con atención? Piensa en lo que el dicho habla de devolver.",
        "¿Es un consejo sobre el dentista? Piensa en lo que devuelve el dicho."
      ]
    },
    {
      text: "Cuando el río suena, agua lleva",
      options: [
        "Los ríos suenan cuando llevan agua",
        "Cuando hay rumores, algo de verdad suele haber",
        "El agua de los ríos siempre suena"
      ],
      correct: 1,
      pistas: [
        "¿Es lo que dice el dicho? Piensa en lo que se oye antes de confirmar algo.",
        "",
        "¿El agua suena siempre? Piensa en el sentido de 'suena' en el dicho."
      ]
    },
    {
      text: "Más vale prevenir que curar",
      options: [
        "Es mejor evitar un problema que arreglarlo después",
        "Curar es más barato que prevenir",
        "Hay que curarse antes de enfermar"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Curar es más barato? Piensa en lo que vale evitar algo antes de que pase.",
        "¿Hay que curarse antes de enfermar? Piensa en lo que se gana si el problema no llega."
      ]
    },
    {
      text: "Hablando del rey de Roma, por la puerta asoma",
      options: [
        "Los reyes siempre entran por la puerta",
        "Justo al hablar de alguien, aparece",
        "Hay que hablar de los reyes con respeto"
      ],
      correct: 1,
      pistas: [
        "¿Los reyes entran siempre por la puerta? Piensa en lo que pasa cuando hablas de alguien.",
        "",
        "¿Hay que hablar con respeto de los reyes? Piensa en qué pasa justo cuando se nombra a alguien."
      ]
    },
    {
      text: "Donde menos se piensa, salta la liebre",
      options: [
        "Las liebres saltan en el campo",
        "Hay que pensar mucho antes de actuar",
        "Lo inesperado aparece cuando menos lo esperas"
      ],
      correct: 2,
      pistas: [
        "¿Las liebres saltan en el campo? Piensa en lo que el dicho dice de la sorpresa.",
        "¿Hay que pensar mucho antes de actuar? Piensa en cuándo aparece la liebre.",
        ""
      ]
    },
    {
      text: "Estar en las nubes",
      options: [
        "Viajar en avión",
        "Estar distraído y soñando despierto",
        "Tener mucho dinero"
      ],
      correct: 1,
      pistas: [
        "¿Es viajar en avión? Piensa en quien mira al cielo sin ver lo que tiene delante.",
        "",
        "¿Es tener dinero? Piensa en lo que hace alguien que está distraído."
      ]
    },
    {
      text: "Tener mano izquierda",
      options: [
        "Escribir con la mano izquierda",
        "Saber tratar a la gente con habilidad y tacto",
        "Tener muy mala suerte"
      ],
      correct: 1,
      pistas: [
        "¿Es escribir con la izquierda? Piensa en lo que se necesita para tratar bien a la gente.",
        "",
        "¿Es mala suerte? Piensa en lo que se usa al tratar con personas."
      ]
    },
    {
      text: "Dar en el clavo",
      options: [
        "Clavar algo con un martillo",
        "Acertar de lleno",
        "Hacer daño a alguien"
      ],
      correct: 1,
      pistas: [
        "¿Es clavar con un martillo? Piensa en lo que se acierta al decir algo.",
        "",
        "¿Es hacer daño? Piensa en lo que pasa cuando la respuesta es exacta."
      ]
    },
    {
      text: "Tirar la casa por la ventana",
      options: [
        "Gastar mucho dinero sin pensarlo",
        "Abrir todas las ventanas de casa",
        "Cambiar de casa cada año"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Es abrir las ventanas? Piensa en lo que se gasta sin medida.",
        "¿Es cambiar de casa? Piensa en el dinero que se gasta sin control."
      ]
    },
    {
      text: "Hacer de tripas corazón",
      options: [
        "Cocinar con tripas",
        "Armarse de valor para algo difícil",
        "Llorar con el corazón en la mano"
      ],
      correct: 1,
      pistas: [
        "¿Es cocinar? Piensa en lo que hay que reunir para algo que cuesta.",
        "",
        "¿Es llorar? Piensa en lo que se hace cuando algo da miedo o asco."
      ]
    },
    {
      text: "A buen árbol se arrima, buena sombra le cobija",
      options: [
        "Quien se junta con buenas personas se beneficia",
        "Hay que sentarse a la sombra de los árboles",
        "Los árboles dan buena sombra siempre"
      ],
      correct: 0,
      pistas: [
        "",
        "¿Es sentarse a la sombra? Piensa en quién recibe la protección.",
        "¿Dan siempre buena sombra los árboles? Piensa en lo que se arrima."
      ]
    },
    {
      text: "Cría cuervos y te sacarán los ojos",
      options: [
        "Criar animales es peligroso",
        "Quien ayuda a un ingrato acaba mal",
        "Los cuervos son muy listos"
      ],
      correct: 1,
      pistas: [
        "¿Es peligroso criar animales? Piensa en quién te paga con daño lo que haces por él.",
        "",
        "¿Son listos los cuervos? Piensa en lo que hace el ingrato."
      ]
    },
    {
      text: "Nunca es tarde si la dicha es buena",
      options: [
        "Nunca es tarde para algo bueno",
        "La suerte siempre llega tarde",
        "Hay que tener suerte para ser feliz"
      ],
      correct: 0,
      pistas: [
        "",
        "¿La suerte siempre llega tarde? Piensa en lo que el dicho dice de lo bueno.",
        "¿Hay que tener suerte para ser feliz? Piensa en la palabra 'dicha'."
      ]
    },
    {
      text: "Perro que ladra no muerde",
      options: [
        "Los perros que ladran son peligrosos",
        "Quien amenaza mucho suele hacer poco",
        "Hay que tener cuidado con los perros"
      ],
      correct: 1,
      pistas: [
        "¿Son peligrosos los perros que ladran? Piensa en lo que dice el dicho del que ladra.",
        "",
        "¿Hay que tener cuidado con los perros? Piensa en lo que hace quien ladra mucho."
      ]
    },
    {
      text: "En todas partes cuecen habas",
      options: [
        "En todas las cocinas se cocinan habas",
        "Los problemas ocurren en todas partes",
        "Las habas son comida de todos los lugares"
      ],
      correct: 1,
      pistas: [
        "¿Se cocinan habas en todas las cocinas? Piensa en lo que el dicho quiere decir de los problemas.",
        "",
        "¿Son las habas comida de todos los sitios? Piensa en lo que se repite en todas partes."
      ]
    }
  ],
  en: [
    {
      text: "Break a leg",
      options: [
        "Good luck",
        "Hurt yourself on purpose",
        "Leave a place quickly"
      ],
      correct: 0,
      pistas: [
        "",
        "Do people hurt themselves on purpose? Think about what the phrase wishes someone before a show.",
        "Is it about leaving quickly? Think about how a performer is encouraged."
      ]
    },
    {
      text: "Piece of cake",
      options: [
        "A dessert with many layers",
        "Something very easy to do",
        "A party with lots of food"
      ],
      correct: 1,
      pistas: [
        "Is it a dessert? Think about what the phrase describes, not food.",
        "",
        "Is it about a party? Think about how the task feels."
      ]
    },
    {
      text: "Under the weather",
      options: [
        "Outside in the rain",
        "Very happy and relaxed",
        "Feeling a bit ill"
      ],
      correct: 2,
      pistas: [
        "Is someone outside in the rain? Think about how the person feels.",
        "Is someone happy? Think about the word 'under'.",
        ""
      ]
    },
    {
      text: "Spill the beans",
      options: [
        "Reveal a secret",
        "Make a mess in the kitchen",
        "Cook beans for dinner"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about the kitchen? Think about what gets revealed when it 'spills'.",
        "Is it about cooking? Think about what a secret does when it comes out."
      ]
    },
    {
      text: "Once in a blue moon",
      options: [
        "Something that happens every night",
        "Something that happens very rarely",
        "A sky that is blue at night"
      ],
      correct: 1,
      pistas: [
        "Does it happen every night? Think about the word 'once'.",
        "",
        "Is it about the sky? Think about how often a blue moon really happens."
      ]
    },
    {
      text: "Hit the sack",
      options: [
        "Go to bed",
        "Hit someone with a bag",
        "Start a fight"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about hitting someone? Think about what 'sack' means here.",
        "Is it a fight? Think about how someone feels at the end of the day."
      ]
    },
    {
      text: "Cost an arm and a leg",
      options: [
        "Be hurt in an accident",
        "Be easy to lift",
        "Be very expensive"
      ],
      correct: 2,
      pistas: [
        "Does it mean an injury? Think about what the phrase is about.",
        "Is it easy to lift? Think about the word 'cost'.",
        ""
      ]
    },
    {
      text: "Call it a day",
      options: [
        "Stop working for today",
        "Plan a special day",
        "Say the day is ugly"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about planning? Think about what happens after the work is done.",
        "Is it about the weather? Think about what 'call' means here."
      ]
    },
    {
      text: "The ball is in your court",
      options: [
        "You have dropped the ball",
        "It is now your turn to decide",
        "You play tennis well"
      ],
      correct: 1,
      pistas: [
        "Did you drop the ball? Think about who has to act now.",
        "",
        "Do you play tennis? Think about a decision, not a game."
      ]
    },
    {
      text: "Beat around the bush",
      options: [
        "Hunt animals in the bush",
        "Work hard in the garden",
        "Avoid talking directly about something"
      ],
      correct: 2,
      pistas: [
        "Is it about hunting? Think about how someone talks in a conversation.",
        "Is it about a garden? Think about how someone talks when they are nervous.",
        ""
      ]
    },
    {
      text: "Bite the bullet",
      options: [
        "Face something hard and do it",
        "Eat something hard",
        "Get hurt by a gun"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about eating? Think about how someone faces a hard task.",
        "Is it about a weapon? Think about what the phrase encourages."
      ]
    },
    {
      text: "Hit the road",
      options: [
        "Crash your car",
        "Leave and start a journey",
        "Build a new road"
      ],
      correct: 1,
      pistas: [
        "Does it mean a car crash? Think about what a traveller does.",
        "",
        "Is it about building? Think about the idea of setting off."
      ]
    },
    {
      text: "Pull someone's leg",
      options: [
        "Hurt someone in a sport",
        "Help someone stand up",
        "Tease someone as a joke"
      ],
      correct: 2,
      pistas: [
        "Is it about sport? Think about what a friend does when joking.",
        "Is it about helping? Think about how the joke is meant.",
        ""
      ]
    },
    {
      text: "Kill two birds with one stone",
      options: [
        "Solve two problems with one action",
        "Hurt animals in the park",
        "Throw stones at two people"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about animals? Think about what the phrase says about doing things efficiently.",
        "Is it about violence? Think about what the phrase praises."
      ]
    },
    {
      text: "Break the ice",
      options: [
        "Drop something cold",
        "Start a conversation with people who do not know each other",
        "Go skating on a frozen lake"
      ],
      correct: 1,
      pistas: [
        "Is it about cold drinks? Think about what makes people feel awkward.",
        "",
        "Is it about skating? Think about what happens at the start of a meeting."
      ]
    },
    {
      text: "Get cold feet",
      options: [
        "Need socks in winter",
        "Feel hot and happy",
        "Become too scared to do something you planned"
      ],
      correct: 2,
      pistas: [
        "Is it about socks and winter? Think about how someone feels before doing something big.",
        "Is it about happiness? Think about the word 'cold'.",
        ""
      ]
    },
    {
      text: "The last straw",
      options: [
        "The final problem that makes you lose patience",
        "A drinking straw that is last in the box",
        "The best part of a story"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about drinking? Think about what makes someone finally give up.",
        "Is it a story? Think about the word 'last' in the phrase."
      ]
    },
    {
      text: "Jump the gun",
      options: [
        "Jump over a fence",
        "Start too early",
        "Win a race"
      ],
      correct: 1,
      pistas: [
        "Is it about jumping? Think about what happens when someone starts before the signal.",
        "",
        "Is it about winning? Think about the race and the timing."
      ]
    },
    {
      text: "Burn the midnight oil",
      options: [
        "Heat oil in a pan at night",
        "Sleep very early",
        "Work or study late at night"
      ],
      correct: 2,
      pistas: [
        "Is it about cooking? Think about what 'burn' means for a person.",
        "Is it about sleep? Think about the time the phrase mentions.",
        ""
      ]
    },
    {
      text: "In hot water",
      options: [
        "In trouble",
        "In a bath with warm water",
        "Very hot and tired"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about a bath? Think about how the person feels in the situation.",
        "Is it about tiredness? Think about the situation, not the temperature."
      ]
    },
    {
      text: "Bite off more than you can chew",
      options: [
        "Eat a very big meal",
        "Take on more than you can manage",
        "Chew your food slowly"
      ],
      correct: 1,
      pistas: [
        "Is it about a big meal? Think about what the phrase warns about.",
        "",
        "Is it about slow eating? Think about what happens when you have too many tasks."
      ]
    },
    {
      text: "Barking up the wrong tree",
      options: [
        "Training a dog",
        "Walking in a forest",
        "Looking in the wrong place or asking the wrong person"
      ],
      correct: 2,
      pistas: [
        "Is it about dogs? Think about what the phrase means for someone who is searching.",
        "Is it about forests? Think about the mistake someone makes.",
        ""
      ]
    },
    {
      text: "Sit on the fence",
      options: [
        "Not take a side",
        "Sit in a garden chair",
        "Climb a fence to see better"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about a chair? Think about someone who avoids deciding.",
        "Is it about climbing? Think about the choice the phrase describes."
      ]
    },
    {
      text: "Speak of the devil",
      options: [
        "Talk about someone who is very bad",
        "The person we were talking about has just arrived",
        "Speak with a loud voice"
      ],
      correct: 1,
      pistas: [
        "Is it about someone very bad? Think about the joke in the phrase.",
        "",
        "Is it about volume? Think about what happens right after the talk."
      ]
    },
    {
      text: "Hit the nail on the head",
      options: [
        "Be exactly right about something",
        "Hammer a nail into wood",
        "Hurt someone by accident"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about carpentry? Think about what a precise answer does.",
        "Is it about hurting someone? Think about what it means to be right."
      ]
    },
    {
      text: "Let sleeping dogs lie",
      options: [
        "Put a dog to sleep",
        "Leave a situation alone so it stays calm",
        "Feed the dog before bed"
      ],
      correct: 1,
      pistas: [
        "Is it about putting a dog to sleep? Think about what 'let lie' means.",
        "",
        "Is it about feeding a dog? Think about the calm the phrase protects."
      ]
    },
    {
      text: "Hit the books",
      options: [
        "Throw books at someone",
        "Read in a library every day",
        "Start studying seriously"
      ],
      correct: 2,
      pistas: [
        "Is it about throwing books? Think about what 'hit' means when studying.",
        "Reading in a library is only part of it. Think about the effort the phrase means.",
        ""
      ]
    },
    {
      text: "Chip on your shoulder",
      options: [
        "Be angry or resentful about something from the past",
        "Carry something heavy on your shoulder",
        "Be proud of your achievements"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about carrying something? Think about the feeling the phrase describes.",
        "Is it about pride? Think about how a grudge feels."
      ]
    },
    {
      text: "A dime a dozen",
      options: [
        "Very expensive and rare",
        "Very common and easy to find",
        "Sold only in shops that use dimes"
      ],
      correct: 1,
      pistas: [
        "Is it expensive? Think about the word 'dime', which is a small coin.",
        "",
        "Is it about shops and coins? Think about what 'a dozen' means."
      ]
    },
    {
      text: "Cut to the chase",
      options: [
        "Run after someone quickly",
        "Start a car race",
        "Get straight to the main point"
      ],
      correct: 2,
      pistas: [
        "Is it about running? Think about a conversation that skips the details.",
        "Is it about cars? Think about how the phrase moves forward.",
        ""
      ]
    },
    {
      text: "Under the table",
      options: [
        "Done secretly or illegally",
        "Lying on the floor",
        "Hidden in a drawer"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about the floor? Think about where money is passed in secret.",
        "Is it about a drawer? Think about what is hidden but not against the law."
      ]
    },
    {
      text: "Bite the hand that feeds you",
      options: [
        "Eat with your hands",
        "Harm the person who helps you",
        "Be hungry all day"
      ],
      correct: 1,
      pistas: [
        "Is it about eating with your hands? Think about who helps you.",
        "",
        "Is it about hunger? Think about how someone repays help."
      ]
    },
    {
      text: "Rain cats and dogs",
      options: [
        "Rain very heavily",
        "Have pets in the rain",
        "Be afraid of storms"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about pets? Think about the image of the phrase, not real animals.",
        "Is it about fear? Think about how much water falls."
      ]
    },
    {
      text: "Once bitten, twice shy",
      options: [
        "Dogs that bite are dangerous",
        "Do not trust bites",
        "After a bad experience you become more careful"
      ],
      correct: 2,
      pistas: [
        "Are dogs dangerous? Think about the person, not the dog.",
        "Is it about bites? Think about the word 'shy'.",
        ""
      ]
    },
    {
      text: "Go the extra mile",
      options: [
        "Walk a long distance",
        "Make extra effort to help or succeed",
        "Travel by car every day"
      ],
      correct: 1,
      pistas: [
        "Is it about a long walk? Think about the effort the phrase praises.",
        "",
        "Is it about travelling? Think about what the word 'extra' adds."
      ]
    },
    {
      text: "Pay through the nose",
      options: [
        "Pay far too much money",
        "Pay with your nose",
        "Pay for medicine"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about the nose? Think about how much money it costs.",
        "Is it about medicine? Think about what the phrase means: paying a lot."
      ]
    },
    {
      text: "Smell a rat",
      options: [
        "Catch a rat at home",
        "Find a bad smell",
        "Suspect that something is wrong"
      ],
      correct: 2,
      pistas: [
        "Is it about a rat at home? Think about the word 'smell'.",
        "Is it about a bad smell? Think about what the phrase describes: a feeling.",
        ""
      ]
    },
    {
      text: "Spill your guts",
      options: [
        "Get hurt badly",
        "Tell everything, especially secrets or feelings",
        "Eat too much food"
      ],
      correct: 1,
      pistas: [
        "Is it about an injury? Think about what the phrase says about talking.",
        "",
        "Is it about food? Think about speaking openly."
      ]
    },
    {
      text: "On cloud nine",
      options: [
        "Be extremely happy",
        "Be sitting high in the clouds",
        "Be very tired"
      ],
      correct: 0,
      pistas: [
        "",
        "Is it about being high up? Think about the feeling of being happy.",
        "Is it about tiredness? Think about the joy in the phrase."
      ]
    },
    {
      text: "Speak your mind",
      options: [
        "Read someone's thoughts",
        "Say honestly what you think",
        "Talk quietly to yourself"
      ],
      correct: 1,
      pistas: [
        "Is it about reading minds? Think about who is speaking.",
        "",
        "Is it about talking quietly? Think about the word 'mind'."
      ]
    }
  ]
};
