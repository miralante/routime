/* ============================================================
   Datos: dichos populares (es) e idioms en inglés (en).
   Formato: { text: string, options: string[3], correct: indice }
   options[correct] es el significado correct del dicho; se reutiliza
   como text de la explicación al responder.
   Para ampliar: añadir objetos al array del idioma correspondiente.
   'correct' apunta a options. app.js usa DATA[App.i18n.locale()].
   ============================================================ */
const DATA = {
  es: [
    {
        text: "A quien madruga, Dios le ayuda",
        options: [
            "Quien se levanta temprano tiene más oportunidades",
            "Los madrugadores son favoritos de Dios",
            "Dormir tarde trae mala suerte"
        ],
        correct: 0
    },
    {
        text: "No por mucho madrugar amanece más temprano",
        options: [
            "Hay cosas que no dependen de nuestro esfuerzo",
            "El amanecer es siempre a la misma hora",
            "Los madrugadores no tienen ventaja"
        ],
        correct: 0
    },
    {
        text: "El que mucho abarca, poco aprieta",
        options: [
            "Quien quiere hacer demasiadas cosas, no hace ninguna bien",
            "Los ambiciosos nunca están satisfechos",
            "Es mejor ser modesto que presumir"
        ],
        correct: 0
    },
    {
        text: "A cada santo le llega su nochebuena",
        options: [
            "Todos reciben lo que merecen eventualmente",
            "La Navidad es para todos",
            "Los santos protegen en Nochebuena"
        ],
        correct: 0
    },
    {
        text: "Quien tiene un amigo, tiene un tesoro",
        options: [
            "La amistad es uno de los mayores bienes",
            "Los amigos valen más que el dinero",
            "Hay que cuidar a los amigos"
        ],
        correct: 0
    },
    {
        text: "Más vale tarde que nunca",
        options: [
            "Es mejor hacer algo tarde que no hacerlo nunca",
            "La puntualidad es importante",
            "Nunca es demasiado tarde para cambiar"
        ],
        correct: 0
    },
    {
        text: "A quien haga algo mal, échale la culpa",
        options: [
            "Es fácil culpar a otros de nuestros errores",
            "Los inocentes siempre pagan",
            "La justicia no existe"
        ],
        correct: 0
    },
    {
        text: "Quien bien quiere, bien castiga",
        options: [
            "El castigo de un ser querido es por su bien",
            "El amor puede ser duro",
            "Hay que ser firme con los que amamos"
        ],
        correct: 0
    },
    {
        text: "Casa de herrero, cuchillo de palo",
        options: [
            "Cada uno descuida su propio trabajo",
            "Los profesionales no aplican sus consejos",
            "Es difícil arreglar lo propio"
        ],
        correct: 0
    },
    {
        text: "Agua que no has de beber, aunque sea de oro, déjala correr",
        options: [
            "No te preocupes por lo que no puedes disfrutar",
            "El dinero no lo es todo",
            "Hay cosas más valiosas que el lujo"
        ],
        correct: 0
    },
    {
        text: "Al que madruga, le dan trabajo",
        options: [
            "El esfuerzo y la constancia tienen recompensa",
            "Los empleadores prefieren madrugadores",
            "El trabajo es para los activos"
        ],
        correct: 0
    },
    {
        text: "Ninguno se arrepiente de haber callado",
        options: [
            "Es mejor quedarse callado que decir algo malo",
            "El silencio es oro",
            "Las words pueden causar problemas"
        ],
        correct: 0
    },
    {
        text: "Quien calla, otorga",
        options: [
            "Si no te defiendes, se asume que estás de acuerdo",
            "El silencio puede interpretarse como consentimiento",
            "Hay que expresar siempre nuestra opinión"
        ],
        correct: 0
    },
    {
        text: "No todo el monte es orégano",
        options: [
            "No todo es tan fácil como parece",
            "La vida tiene sus dificultades",
            "Hay problemas que no se pueden evitar"
        ],
        correct: 0
    },
    {
        text: "A Dios rogando y con el mazo dando",
        options: [
            "Además de pedir ayuda, hay que actuar",
            "La fe sin obras es insuficiente",
            "Hay que luchar por lo que quieres"
        ],
        correct: 0
    },
    {
        text: "Por la boca muere el pez",
        options: [
            "Hablar demasiado puede causarte problemas",
            "Los secretos deben guardarse",
            "La imprudencia trae consecuencias"
        ],
        correct: 0
    },
    {
        text: "En casa del herrero, cuchillo de palo",
        options: [
            "Los profesionales descuidan su propia casa",
            "Nadie puede arreglar todo",
            "Es difícil verse uno mismo objetivamente"
        ],
        correct: 0
    },
    {
        text: "Quien tiene boca, se equivoca",
        options: [
            "Todos cometemos errores al hablar",
            "Ser humano implica equivocarse",
            "Hay que perdonar los errores"
        ],
        correct: 0
    },
    {
        text: "Dime con quién andas y te diré quién eres",
        options: [
            "Las personas se conocen por sus amistades",
            "El entorno influye en la personalidad",
            "Hay que elegir bien a los amigos"
        ],
        correct: 0
    },
    {
        text: "No hay mal que por bien no venga",
        options: [
            "De los problemas pueden salir cosas positivas",
            "Todo tiene una segunda oportunidad",
            "Después de la tormenta llega la calma"
        ],
        correct: 0
    },
    {
        text: "Quien tiene dinero, va al mercado y compra",
        options: [
            "Con dinero se puede conseguir casi todo",
            "El dinero facilita la vida",
            "El comercio existe por el dinero"
        ],
        correct: 0
    },
    {
        text: "Ladrón que roba a ladrón, tiene cien años de perdón",
        options: [
            "El que perjudica a otro malo merece clemencia",
            "Los criminales se protegen entre sí",
            "La justicia no aplica entre iguales"
        ],
        correct: 0
    },
    {
        text: "Quien mucho duerme, poco aprende",
        options: [
            "El exceso de descanso hace perezoso",
            "Hay que aprovechar el tiempo",
            "El sueño excesivo no es productivo"
        ],
        correct: 0
    },
    {
        text: "A falta de pan, buenas son las tortas",
        options: [
            "Cuando no tienes lo ideal, acepta lo disponible",
            "Hay que saber adaptarse",
            "Las alternativas son válidas"
        ],
        correct: 0
    },
    {
        text: "Quien no arriesga, no gana",
        options: [
            "Para lograr algo hay que atreverse",
            "El éxito requiere valentía",
            "La seguridad excesiva impide progresar"
        ],
        correct: 0
    },
    {
        text: "A buen entendedor, pocas words bastan",
        options: [
            "Las personas inteligentes comprenden rápido",
            "El entendimiento no requiere explicaciones",
            "Hay que saber captar las señales"
        ],
        correct: 0
    },
    {
        text: "Quien mucho habla, mucho yerra",
        options: [
            "Hablar demasiado aumenta los errores",
            "La verbosidad causa problemas",
            "Hay que moderar las palabras"
        ],
        correct: 0
    },
    {
        text: "Dime qué comes y te diré qué eres",
        options: [
            "La alimentación revela tu carácter",
            "La dieta dice mucho de ti",
            "Somos lo que comemos"
        ],
        correct: 0
    },
    {
        text: "A río revuelto, ganancia de pescadores",
        options: [
            "Aprovechar el caos para beneficio propio",
            "En el desorden hay oportunidades",
            "Los listos se aprovechan del desorden"
        ],
        correct: 0
    },
    {
        text: "Quien da primero, da dos veces",
        options: [
            "La iniciativa tiene recompensa",
            "Dar antes es más valioso",
            "La generosidad es estratégica"
        ],
        correct: 0
    },
    {
        text: "Amigos de mi bolsillo, ninguno me ha faltado",
        options: [
            "El dinero atrae falsas amistades",
            "Los amigos falsos aparecen con dinero",
            "El dinero revela a los verdaderos amigos"
        ],
        correct: 0
    },
    {
        text: "Quien come y hace bien, bien le está",
        options: [
            "El que trabaja y come, está en buena situación",
            "Disfruta mientras puedes",
            "El bienestar viene del esfuerzo"
        ],
        correct: 0
    },
    {
        text: "A quien se levante tarde, le costará el día",
        options: [
            "La falta de iniciativa trae consecuencias",
            "El que retrasa pierde oportunidades",
            "La pereza tiene un precio"
        ],
        correct: 0
    },
    {
        text: "Quien tiene salud, tiene esperanza",
        options: [
            "La salud es lo más valioso que tenemos",
            "Con salud todo es posible",
            "Hay que cuidar nuestro cuerpo"
        ],
        correct: 0
    },
    {
        text: "Amor de lejos, fortunón de locos",
        options: [
            "El amor a distancia es difícil e ilógico",
            "Las relaciones a distancia no funcionan",
            "El amor loco no es real"
        ],
        correct: 0
    },
    {
        text: "Quien no trabaja, no come",
        options: [
            "El esfuerzo es necesario para vivir",
            "La vagancia no tiene recompensa",
            "Hay que ganarse la vida"
        ],
        correct: 0
    },
    {
        text: "A la ocasión la pintan calva",
        options: [
            "Las oportunidades hay que aprovecharlas rápido",
            "El momento perfecto no existe",
            "Hay que estar preparado"
        ],
        correct: 0
    },
    {
        text: "Quien ríe último, ríe mejor",
        options: [
            "El que persiste al final tiene la victoria",
            "La paciencia es virtud",
            "Hay que esperar el momento oportuno"
        ],
        correct: 0
    },
    {
        text: "A quien algo quiere, algo le cuesta",
        options: [
            "Todo lo valioso requiere sacrificio",
            "El éxito tiene un precio",
            "Hay que esforzarse por lo que deseas"
        ],
        correct: 0
    },
    {
        text: "Quien hace la ley, hace la trampa",
        options: [
            "Los que hacen las reglas se aprovechan",
            "La ley siempre favorece a quien la crea",
            "Los poderosos se evaden de reglas"
        ],
        correct: 0
    },
    {
        text: "A rey muerto, rey puesto",
        options: [
            "Cuando uno se va, otro toma su lugar",
            "La vida sigue siempre",
            "Nadie es insustituible"
        ],
        correct: 0
    },
    {
        text: "Quien espera, desespera",
        options: [
            "La espera prolongada causa frustración",
            "La paciencia tiene límites",
            "Esperar demasiado puede ser dañino"
        ],
        correct: 0
    },
    {
        text: "Amigo de todos, amigo de nadie",
        options: [
            "Quien es amigo de todos, no es verdadero amigo",
            "Hay que ser selectivo con las amistades",
            "Las amistades falsas no son reales"
        ],
        correct: 0
    },
    {
        text: "Quien puede lo más, puede lo menos",
        options: [
            "Si puedes hacer lo difícil, lo fácil es fácil",
            "Los capaces pueden hacer todo",
            "El que puede mucho, puede poco también"
        ],
        correct: 0
    },
    {
        text: "A palabras necias, oídos sordos",
        options: [
            "Ignora los comentarios tontos",
            "No hagas caso a críticas vacías",
            "Las tonterías no merecen atención"
        ],
        correct: 0
    },
    {
        text: "Quien se fue a Sevilla, perdió su silla",
        options: [
            "Quien deja su lugar, lo pierde",
            "Los que se van, se quedan sin sitio",
            "Hay que cuidar lo que tenemos"
        ],
        correct: 0
    },
    {
        text: "Barriga vacía, corazón sin alegría",
        options: [
            "Sin necesidades básicas, falta la felicidad",
            "El hambre afecta el ánimo",
            "La pobreza causa tristeza"
        ],
        correct: 0
    },
    {
        text: "Quien te quiere te hace llorar",
        options: [
            "A veces el cariño se expresa con duras palabras",
            "El amor puede doler",
            "La verdad a veces hiere"
        ],
        correct: 0
    },
    {
        text: "A falta de contentar a todos, contentaré a nadie",
        options: [
            "Tratar de agradar a todos lleva al fracaso",
            "Es imposible satisfacer a todos",
            "Hay que priorizar"
        ],
        correct: 0
    },
    {
        text: "Quien no arriesga no bebe champán",
        options: [
            "El riesgo tiene recompensa",
            "Los audaces disfrutan más",
            "Sin aventura no hay lujo"
        ],
        correct: 0
    },
    {
        text: "A cada pájaro le gusta su nido",
        options: [
            "Cada uno valora su hogar",
            "Todos prefieren su lugar de siempre",
            "El hogar es lo más cómodo"
        ],
        correct: 0
    },
    {
        text: "Quien vive de ilusiones, muere de hambre",
        options: [
            "Las ilusiones sin acción no bastan",
            "Hay que ser realista",
            "Soñar no paga facturas"
        ],
        correct: 0
    },
    {
        text: "Abierto el libro de los muertos, todos los nombres en él",
        options: [
            "La muerte iguala a todos",
            "Todos somos mortales",
            "El final es igual para todos"
        ],
        correct: 0
    },
    {
        text: "Quien tiene tienda, tiene que estar en ella",
        options: [
            "Quien tiene responsabilidades debe atenderlas",
            "El trabajo requiere dedicación",
            "Hay que estar presente en lo suyo"
        ],
        correct: 0
    },
    {
        text: "A falta de muertos, lloran los vivos",
        options: [
            "Cuando falta algo, se exagera la falta",
            "Las excusas son infladas",
            "La gente se queja de más"
        ],
        correct: 0
    },
    {
        text: "Quien bien tiene y mal escoge, por mal que le venga no se enoje",
        options: [
            "Si tienes opciones buenas y eliges mal, no te quejes",
            "La culpa de los males propios es propia",
            "Hay que asumir las consecuencias"
        ],
        correct: 0
    },
    {
        text: "A mal tiempo, buena cara",
        options: [
            "Hay que ser positivo ante las dificultades",
            "Los problemas se afrontan con actitud",
            "La sonrisa ayuda en momentos duros"
        ],
        correct: 0
    },
    {
        text: "Quien sube alto, quiere subirse más",
        options: [
            "La ambición no tiene límites",
            "Quien tiene éxito quiere más",
            "Los ambiciosos no se conforman"
        ],
        correct: 0
    },
    {
        text: "A quien le caiga el muerto que se encargue",
        options: [
            "Que se haga cargo quien corresponda",
            "Las responsabilidades deben asumirse",
            "Cada uno debe cumplir su papel"
        ],
        correct: 0
    },
    {
        text: "Quien mucho duerme, la bolsa empobrece",
        options: [
            "El sueño excesivo desperdicia dinero",
            "El tiempo es dinero",
            "La pereza empobrece"
        ],
        correct: 0
    },
    {
        text: "A rey muerto, no hay que buscarle pelos en la lengua",
        options: [
            "No critiques a quien ya no puede defenderse",
            "Hay que tener respeto postumo",
            "Los difuntos merecen paz"
        ],
        correct: 0
    },
    {
        text: "Quien tiene oficio, tiene bollo",
        options: [
            "El que tiene trabajo tiene sustento",
            "El empleo da estabilidad",
            "Trabajar organiza la vida"
        ],
        correct: 0
    },
    {
        text: "A otro perro con ese hueso",
        options: [
            "No me engañes con esa historia",
            "No me tomes el pelo",
            "Busca a otro para engañar"
        ],
        correct: 0
    },
    {
        text: "Quien se ríe de un payaso, o es payaso o su padre",
        options: [
            "El que se burla de otro, se expone a lo mismo",
            "Hacer reír tiene riesgos",
            "Los chistes pueden volverse en tu contra"
        ],
        correct: 0
    },
    {
        text: "A otra cosa, mariposa",
        options: [
            "Cambio de tema brusco",
            "Pasemos a otra cosa",
            "No sigas por ahí"
        ],
        correct: 0
    },
    {
        text: "Quien más presume, llora más fuerte cuando se va",
        options: [
            "Quien más presume, más sufre al perder",
            "Los fanfarrones son los más frágiles",
            "La arrogancia esconde inseguridad"
        ],
        correct: 0
    },
    {
        text: "A cada cosa, su tiempo",
        options: [
            "Hay que hacer las cosas a su debido momento",
            "La paciencia es importante",
            "No todo es inmediato"
        ],
        correct: 0
    },
    {
        text: "Quien se pica una vez, paga para siempre",
        options: [
            "Una sola vez que te engañen, es suficiente",
            "Las malas experiencias enseñan",
            "Hay que estar alerta siempre"
        ],
        correct: 0
    },
    {
        text: "A la mujer del César, no basta con que sea honrada, sino que lo parezca",
        options: [
            "Además de ser honesto, hay que parecerlo",
            "La apariencia importa",
            "La reputación es importante"
        ],
        correct: 0
    },
    {
        text: "Quien anda con loco, sale igual",
        options: [
            "El trato con tontos te afecta",
            "El ambiente influye en ti",
            "La compañía determina tu nivel"
        ],
        correct: 0
    },
    {
        text: "Quien vive a cuchillo, a cuchillo muere",
        options: [
            "Quien usa la violencia, recibe violencia",
            "Todo vuelve",
            "Las acciones tienen consecuencias"
        ],
        correct: 0
    },
    {
        text: "A quien Dios quiere bien, le da compañía",
        options: [
            "Los verdaderos amigos llegan cuando encuentras estabilidad",
            "La soledad es temporal",
            "El bien organizado tiene todo"
        ],
        correct: 0
    },
    {
        text: "Quien es bonito, tiene la mitad del trabajo hecho",
        options: [
            "La apariencia facilita muchas cosas",
            "La imagen es importante",
            "Verse bien abre puertas"
        ],
        correct: 0
    },
    {
        text: "A quien se levanta tarde, ni el sol le sirve para nada",
        options: [
            "Quien desperdicia el día, pierde oportunidades",
            "El tiempo perdido no se recupera",
            "La tardanza tiene consecuencias"
        ],
        correct: 0
    },
    {
        text: "Quien tiene pan, quiere vino",
        options: [
            "Cuando tienes lo básico, quieres más",
            "Los deseos no tienen fin",
            "La ambición es humana"
        ],
        correct: 0
    },
    {
        text: "A quien no le gusta el vino, o es tonto o está mal",
        options: [
            "El que rechaza lo bueno no está bien",
            "Hay que saber apreciar las cosas",
            "Quien dice que no a algo bueno, está equivocado"
        ],
        correct: 0
    },
    {
        text: "Quien va despacio y da buen resultado, termina antes que el rápido",
        options: [
            "La calma y calidad superan a la prisa",
            "El que va lento llega lejos",
            "La paciencia da mejores resultados"
        ],
        correct: 0
    },
    {
        text: "A quien no quiere aprender, no hay maestro que le aproveche",
        options: [
            "Quien no quiere aprender, no aprenderá",
            "No se puede forzar a nadie",
            "La voluntad es personal"
        ],
        correct: 0
    },
    {
        text: "Quien trabaja para uno, no sirve para ninguno",
        options: [
            "El egoísta no tiene amigos",
            "El que solo piensa en sí mismo, aislado está",
            "El individualismo aísla"
        ],
        correct: 0
    },
    {
        text: "Quien es sinvergüenza, come donde encuentra",
        options: [
            "Los sinvergüenzas no tienen problema en aprovecharse",
            "La desfachatez tiene ventajas",
            "El sinvergüenza prospera"
        ],
        correct: 0
    },
    {
        text: "A lo done, pecho",
        options: [
            "Hay que asumir las consecuencias de tus actos",
            "Lo hecho está hecho, hay que aceptarlo",
            "Asume tu responsabilidad"
        ],
        correct: 0
    },
    {
        text: "Quien está en buena luna, está de buena luna",
        options: [
            "Estar de buen humor es como estar bajo la luna buena",
            "El estado de ánimo afecta todo",
            "La suerte viene por temporadas"
        ],
        correct: 0
    },
    {
        text: "A quien le dieron la carga, que se la salve",
        options: [
            "Quien tiene la responsabilidad, que la asuma",
            "Cada uno debe cumplir su deber",
            "El que recibe algo, que lo cuide"
        ],
        correct: 0
    },
    {
        text: "Quien hace deprisa y mal hecho, dos veces lo ha de hacer",
        options: [
            "Lo mal hecho hay que repetirlo",
            "La prisa causa errores",
            "Es mejor hacerlo bien a la primera"
        ],
        correct: 0
    },
    {
        text: "A buena hambre, no hay pan duro",
        options: [
            "Cuando tienes mucha necesidad, todo sirve",
            "La necesidad hace tolerable cualquier cosa",
            "El hambriento es menos exigente"
        ],
        correct: 0
    },
    {
        text: "Quien descuida de los suyos como de la dicha, se queda sin ellos y sin ella",
        options: [
            "Quien descuida lo suyo, lo pierde",
            "Hay que cuidar lo importante",
            "La familia y la suerte requieren atención"
        ],
        correct: 0
    },
    {
        text: "Quien pica y rema, sale de la nada",
        options: [
            "El que trabaja con esfuerzo sale adelante",
            "Con trabajo se logra todo",
            "El esfuerzo supera la adversidad"
        ],
        correct: 0
    },
    {
        text: "A buen hambre, no hay mal pan",
        options: [
            "Cuando tienes mucha hambre, comes cualquier cosa",
            "La necesidad no es exigente",
            "El hambre todo lo hace sabroso"
        ],
        correct: 0
    },
    {
        text: "Quien mucho viaja, mucho aprende",
        options: [
            "Los viajes dan experiencia y sabiduría",
            "Conocer mundo te hace más sabio",
            "La experiencia travel forma"
        ],
        correct: 0
    }
  ],
  en: [
    {
        text: "Break the ice",
        options: [
            "To help people feel comfortable in a new situation",
            "To break something made of ice",
            "To start an argument"
        ],
        correct: 0
    },
    {
        text: "Piece of cake",
        options: [
            "Something very easy to do",
            "A slice of dessert",
            "A difficult task"
        ],
        correct: 0
    },
    {
        text: "Under the weather",
        options: [
            "Feeling a little unwell",
            "Standing outside in the rain",
            "Very happy"
        ],
        correct: 0
    },
    {
        text: "Once in a blue moon",
        options: [
            "Something that happens very rarely",
            "Something that happens every night",
            "A type of full moon"
        ],
        correct: 0
    },
    {
        text: "Bite the bullet",
        options: [
            "To accept something difficult and just do it",
            "To eat something hard",
            "To get hurt in a fight"
        ],
        correct: 0
    },
    {
        text: "Let the cat out of the bag",
        options: [
            "To reveal a secret by accident",
            "To free a pet",
            "To make a loud noise"
        ],
        correct: 0
    },
    {
        text: "Hit the nail on the head",
        options: [
            "To describe exactly what is true",
            "To hurt your hand",
            "To finish a job quickly"
        ],
        correct: 0
    },
    {
        text: "Cost an arm and a leg",
        options: [
            "To be very expensive",
            "To cause an injury",
            "To be free of charge"
        ],
        correct: 0
    },
    {
        text: "The best of both worlds",
        options: [
            "To enjoy the advantages of two different things",
            "To travel to two countries",
            "To have two jobs"
        ],
        correct: 0
    },
    {
        text: "Speak of the devil",
        options: [
            "Said when someone you were just talking about appears",
            "Said when something bad happens",
            "Said to scare someone"
        ],
        correct: 0
    },
    {
        text: "See eye to eye",
        options: [
            "To agree with someone",
            "To look at someone closely",
            "To have good eyesight"
        ],
        correct: 0
    },
    {
        text: "A blessing in disguise",
        options: [
            "Something good that seemed bad at first",
            "A gift you don't like",
            "A costume for a party"
        ],
        correct: 0
    },
    {
        text: "Beat around the bush",
        options: [
            "To avoid saying what you really mean",
            "To walk through a garden",
            "To hit a plant"
        ],
        correct: 0
    },
    {
        text: "Better late than never",
        options: [
            "It is better to do something late than not at all",
            "It is always best to be on time",
            "Being late is never a problem"
        ],
        correct: 0
    },
    {
        text: "Actions speak louder than words",
        options: [
            "What people do matters more than what they say",
            "Loud noises are actions",
            "Words are more important than actions"
        ],
        correct: 0
    },
    {
        text: "Add insult to injury",
        options: [
            "To make a bad situation even worse",
            "To say sorry after hurting someone",
            "To help someone who is hurt"
        ],
        correct: 0
    },
    {
        text: "Barking up the wrong tree",
        options: [
            "To have the wrong idea about how to do something",
            "To shout very loudly",
            "To climb a tree"
        ],
        correct: 0
    },
    {
        text: "Call it a day",
        options: [
            "To decide to stop working on something",
            "To name a day of the week",
            "To plan a party"
        ],
        correct: 0
    },
    {
        text: "Cutting corners",
        options: [
            "To do something poorly to save time or money",
            "To cut paper into shapes",
            "To take a shortcut on a walk"
        ],
        correct: 0
    },
    {
        text: "Get out of hand",
        options: [
            "To become difficult to control",
            "To leave a place quickly",
            "To drop something"
        ],
        correct: 0
    },
    {
        text: "Hang in there",
        options: [
            "To stay strong during a difficult time",
            "To hang decorations",
            "To wait outside"
        ],
        correct: 0
    },
    {
        text: "In the heat of the moment",
        options: [
            "Said or done without thinking, because of strong feelings",
            "Said during summer",
            "Said when it is very hot"
        ],
        correct: 0
    },
    {
        text: "It's not rocket science",
        options: [
            "It is not difficult to understand",
            "It is about space travel",
            "It is very complicated"
        ],
        correct: 0
    },
    {
        text: "Kill two birds with one stone",
        options: [
            "To achieve two things with one action",
            "To hurt two animals",
            "To solve two problems separately"
        ],
        correct: 0
    },
    {
        text: "Miss the boat",
        options: [
            "To miss an opportunity",
            "To be late for a trip",
            "To lose something in the water"
        ],
        correct: 0
    },
    {
        text: "On the ball",
        options: [
            "Being alert and doing things well",
            "Playing a sport",
            "Standing on top of a ball"
        ],
        correct: 0
    },
    {
        text: "Pull yourself together",
        options: [
            "To calm down and behave normally",
            "To get dressed quickly",
            "To work as a team"
        ],
        correct: 0
    },
    {
        text: "Speak your mind",
        options: [
            "To say what you really think",
            "To think without speaking",
            "To keep a secret"
        ],
        correct: 0
    },
    {
        text: "Take it with a grain of salt",
        options: [
            "To not completely believe something",
            "To add salt to your food",
            "To be very serious about something"
        ],
        correct: 0
    },
    {
        text: "The ball is in your court",
        options: [
            "It is your turn to decide or act",
            "You are playing a sport",
            "You have lost the game"
        ],
        correct: 0
    },
    {
        text: "Time flies",
        options: [
            "Time passes very quickly",
            "Time can fly like a bird",
            "Clocks are broken"
        ],
        correct: 0
    },
    {
        text: "To be on the fence",
        options: [
            "To be undecided about something",
            "To stand outside",
            "To fix a fence"
        ],
        correct: 0
    },
    {
        text: "Get under my skin",
        options: [
            "Something that annoys you a lot",
            "Something under your clothes",
            "A type of illness"
        ],
        correct: 0
    },
    {
        text: "Wrap your head around something",
        options: [
            "To understand something difficult",
            "To wear a hat",
            "To get a headache"
        ],
        correct: 0
    },
    {
        text: "You can't judge a book by its cover",
        options: [
            "You shouldn't judge something by its appearance",
            "You should always read the whole book",
            "Covers are not important for books"
        ],
        correct: 0
    },
    {
        text: "A penny for your thoughts",
        options: [
            "Asking someone what they are thinking",
            "Asking for money",
            "Asking someone to be quiet"
        ],
        correct: 0
    },
    {
        text: "Cry over spilled milk",
        options: [
            "To be upset about something that already happened and can't be changed",
            "To be sad about milk",
            "To clean up a mess"
        ],
        correct: 0
    },
    {
        text: "Every cloud has a silver lining",
        options: [
            "There is something good in every bad situation",
            "Clouds are made of silver",
            "Bad weather always gets worse"
        ],
        correct: 0
    },
    {
        text: "Get a taste of your own medicine",
        options: [
            "To be treated the way you treat others",
            "To try new food",
            "To take real medicine"
        ],
        correct: 0
    },
    {
        text: "Give someone the cold shoulder",
        options: [
            "To ignore someone on purpose",
            "To give someone a coat",
            "To feel cold outside"
        ],
        correct: 0
    },
    {
        text: "Go the extra mile",
        options: [
            "To make more effort than expected",
            "To run a race",
            "To travel far away"
        ],
        correct: 0
    },
    {
        text: "Hit the sack",
        options: [
            "To go to bed",
            "To hit something with a bag",
            "To start working"
        ],
        correct: 0
    },
    {
        text: "It takes two to tango",
        options: [
            "Both people are responsible in a situation",
            "Dancing needs two people",
            "One person can do everything alone"
        ],
        correct: 0
    },
    {
        text: "Jump on the bandwagon",
        options: [
            "To join something because it has become popular",
            "To jump onto a vehicle",
            "To start a new trend"
        ],
        correct: 0
    },
    {
        text: "Keep an eye on",
        options: [
            "To watch or take care of something carefully",
            "To close your eyes",
            "To look away"
        ],
        correct: 0
    },
    {
        text: "Let sleeping dogs lie",
        options: [
            "To avoid bringing up old problems that could cause trouble",
            "To let dogs sleep outside",
            "To wake someone up gently"
        ],
        correct: 0
    },
    {
        text: "Make a long story short",
        options: [
            "To tell something quickly, without every detail",
            "To make a story longer",
            "To write a book"
        ],
        correct: 0
    },
    {
        text: "On thin ice",
        options: [
            "In a risky situation",
            "Walking on frozen water",
            "Very cold weather"
        ],
        correct: 0
    },
    {
        text: "A piece of the pie",
        options: [
            "A share of something, usually money or profit",
            "A slice of dessert",
            "A whole cake"
        ],
        correct: 0
    },
    {
        text: "Pull someone's leg",
        options: [
            "To joke with someone, to tease them",
            "To hurt someone's leg",
            "To help someone walk"
        ],
        correct: 0
    },
    {
        text: "Put all your eggs in one basket",
        options: [
            "To risk everything on a single plan",
            "To cook breakfast",
            "To carry things carefully"
        ],
        correct: 0
    },
    {
        text: "Rain on someone's parade",
        options: [
            "To spoil someone's plans or happiness",
            "To cause bad weather",
            "To celebrate with someone"
        ],
        correct: 0
    },
    {
        text: "Save for a rainy day",
        options: [
            "To save money for when you might need it later",
            "To save an umbrella",
            "To plan a trip"
        ],
        correct: 0
    },
    {
        text: "Sit on the fence",
        options: [
            "To avoid making a decision",
            "To sit outside",
            "To fall over"
        ],
        correct: 0
    },
    {
        text: "Spill the beans",
        options: [
            "To reveal a secret",
            "To drop food on the floor",
            "To cook a meal"
        ],
        correct: 0
    },
    {
        text: "Take a rain check",
        options: [
            "To postpone a plan to a later time",
            "To check the weather",
            "To cancel something forever"
        ],
        correct: 0
    },
    {
        text: "The last straw",
        options: [
            "The final problem that makes a situation unbearable",
            "A piece of drinking straw",
            "The first problem in a list"
        ],
        correct: 0
    },
    {
        text: "Through thick and thin",
        options: [
            "Supporting someone in good times and bad",
            "Walking through a thick forest",
            "Only being there in good times"
        ],
        correct: 0
    },
    {
        text: "Throw in the towel",
        options: [
            "To give up",
            "To clean up after a shower",
            "To start a fight"
        ],
        correct: 0
    },
    {
        text: "Tie the knot",
        options: [
            "To get married",
            "To tie your shoes",
            "To finish a task"
        ],
        correct: 0
    },
    {
        text: "Under the radar",
        options: [
            "Without being noticed",
            "Flying an airplane",
            "Being very famous"
        ],
        correct: 0
    },
    {
        text: "Up in the air",
        options: [
            "Undecided or uncertain",
            "Flying somewhere",
            "Very clear and certain"
        ],
        correct: 0
    },
    {
        text: "When pigs fly",
        options: [
            "Something that will never happen",
            "Something that happens often",
            "A type of farm animal"
        ],
        correct: 0
    },
    {
        text: "Bend over backwards",
        options: [
            "To try very hard to help someone",
            "To do exercise",
            "To refuse to help"
        ],
        correct: 0
    },
    {
        text: "Burn the midnight oil",
        options: [
            "To work late into the night",
            "To light candles for fun",
            "To go to bed early"
        ],
        correct: 0
    },
    {
        text: "Cut to the chase",
        options: [
            "To get to the important point without delay",
            "To start running",
            "To watch a movie"
        ],
        correct: 0
    },
    {
        text: "Get cold feet",
        options: [
            "To become nervous about doing something you planned",
            "To feel cold outside",
            "To buy new shoes"
        ],
        correct: 0
    },
    {
        text: "Give the benefit of the doubt",
        options: [
            "To trust someone even without proof",
            "To give someone money",
            "To doubt everyone"
        ],
        correct: 0
    },
    {
        text: "Head over heels",
        options: [
            "Completely in love, or very excited",
            "Falling down",
            "Walking normally"
        ],
        correct: 0
    },
    {
        text: "It's a small world",
        options: [
            "Said when you unexpectedly meet someone you know",
            "Said when the world is getting bigger",
            "Said about geography class"
        ],
        correct: 0
    },
    {
        text: "Know the ropes",
        options: [
            "To understand how to do something",
            "To tie a knot",
            "To be new at a job"
        ],
        correct: 0
    },
    {
        text: "Leave no stone unturned",
        options: [
            "To try every possible way to find or achieve something",
            "To lift heavy rocks",
            "To give up easily"
        ],
        correct: 0
    },
    {
        text: "Off the top of my head",
        options: [
            "Said without checking facts, from memory",
            "Said while touching your head",
            "Said after careful research"
        ],
        correct: 0
    },
    {
        text: "On the same page",
        options: [
            "To agree or understand something the same way",
            "To read the same book",
            "To disagree about something"
        ],
        correct: 0
    },
    {
        text: "Piece by piece",
        options: [
            "Doing something gradually, one part at a time",
            "Doing everything at once",
            "Eating dessert"
        ],
        correct: 0
    },
    {
        text: "Ring a bell",
        options: [
            "To sound familiar",
            "To make a loud noise",
            "To visit someone's house"
        ],
        correct: 0
    },
    {
        text: "Speak the same language",
        options: [
            "To understand each other well",
            "To know a foreign language",
            "To argue often"
        ],
        correct: 0
    },
    {
        text: "Steal someone's thunder",
        options: [
            "To take credit for something someone else did",
            "To cause a storm",
            "To help someone succeed"
        ],
        correct: 0
    },
    {
        text: "Take the bull by the horns",
        options: [
            "To deal with a difficult situation directly and bravely",
            "To work on a farm",
            "To avoid a problem"
        ],
        correct: 0
    },
    {
        text: "The tip of the iceberg",
        options: [
            "A small, visible part of a much bigger problem",
            "The coldest part of the sea",
            "The whole problem"
        ],
        correct: 0
    }
  ]
};
