/* ============================================================
   Datos: chistes (es) y jokes en inglés (en) para comprensión del humor.
   Formato: { text: string, options: string[3], correct: indice }
   options[correct] es la explicación correcta de por qué el chiste es
   gracioso; se reutiliza como text de la explicación al responder.
   Para ampliar: añadir objetos al array del idioma correspondiente.
   'correct' apunta a options. app.js usa DATA[App.i18n.locale()].
   ============================================================ */
const DATA = {
  es: [
    {
        text: "¿Qué le dice un jaguar a otro jaguar? Jaguar que te pillo.",
        options: [
            "Juego de words entre 'jaguar' y 'cazar'",
            "Los jaguares se persiguen entre sí",
            "Es una expresión de cariño entre animales"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace una abeja en el gimnasio? Zumba-bzzz... ¡Zumba-bzzz!",
        options: [
            "La abeja zumba cuando hace ejercicio",
            "La abeja está aprendiendo a hablar",
            "Las words con 'bz' son graciosas"
        ],
        correct: 0
    },
    {
        text: "¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas.",
        options: [
            "Doble sentido entre problemas matemáticos y emocionales",
            "Los libros también sienten",
            "Las matemáticas son aburridas"
        ],
        correct: 0
    },
    {
        text: "-Camarero, este bistec tiene un nervio muy grande. -No se preocupe, es de la res que corrió la maratón.",
        options: [
            "Juego con 'nervio' (valor) y 'corrió' (escapó)",
            "Los camareros son mentirosos",
            "Los animales hacen deporte"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace una pared junto a otra pared? Le hace la paré.",
        options: [
            "Juego de words entre 'pared' y 'parecer'",
            "Las paredes se hablan entre sí",
            "Es un chiste sobre arquitectura"
        ],
        correct: 0
    },
    {
        text: "-Papá, me pueden suspender por ir a clase de baile. -¿Qué tienes? -Metástasis.",
        options: [
            "Doble sentido de 'metástasis' como movimiento de baile y enfermedad",
            "Los padres no entienden a sus hijos",
            "El baile es peligroso"
        ],
        correct: 0
    },
    {
        text: "¿Qué es un terapeuta? Seiscientos cuarenta y ocho euros.",
        options: [
            "Seiscientos cuarenta y ocho euros es el precio de muchas sesiones",
            "Los terapeutas cobran demasiado",
            "Un terapeuta tiene muchas monedas"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un techo a otro techo? Techo de menos.",
        options: [
            "Juego con 'techo' y 'tengo' (techo/techo de menos)",
            "Los techos se comunican entre sí",
            "Los techos tienen sentimientos"
        ],
        correct: 0
    },
    {
        text: "¿Por qué los pájaros no van al bar? Porque ya tienen su propio trino-bar.",
        options: [
            "Juego de words: 'trino' (canto del pájaro) y 'bar'",
            "Los pájaros son más modernos",
            "El bar es para humanos"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace una araña en el mercado? Compra una telaraña.",
        options: [
            "Juego de words: 'tela' y 'araña' forman 'telaraña' (telaraña)",
            "Las arañas van de compras",
            "Los mercados venden cosas de arañas"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace una abeja en la lavadora? ¡Zum-bailando!",
        options: [
            "Juego de words: 'zumbido' + 'bailando'",
            "Las abejas pueden sobrevivir a todo",
            "Los españoles les gustan las abejitas"
        ],
        correct: 0
    },
    {
        text: "-Doctor, doctor, me duele aquí. -No es nada, es el codo. -¡Vaya, creía que era el pie!",
        options: [
            "Confusión humorística entre partes del cuerpo mencionadas",
            "Los doctores exageran sus respuestas",
            "Los doctores no escuchan"
        ],
        correct: 0
    },
    {
        text: "¿Por qué el padre del niño listo lo llevó al oftalmólogo? Porque era muy listo, pero no veía bien.",
        options: [
            "Doble sentido: ser listo (inteligente) y ver bien (con buena vista)",
            "Los niños listos tienen mala vista",
            "La inteligencia afecta la visión"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un lama cuando está contento? Dice: ¡Qué lama-ravilla!",
        options: [
            "Juego con 'lama' (monje budista) y 'maravilla'",
            "Los monjes hacen ejercicio",
            "Los lamas son masajistas"
        ],
        correct: 0
    },
    {
        text: "¿Qué le dice un gusano a otro gusano? Voy a ir a dar una vuelta a la manzana.",
        options: [
            "Doble sentido: 'dar una vuelta a la manzana' (pasear/cuerpo de gusano)",
            "Los gusanos son activos",
            "Los gusanos van al parque"
        ],
        correct: 0
    },
    {
        text: "-¿Por qué eres tan pequeño? -Porque soy astronauta. -¿Y eso qué tiene que ver? -Nada, siempre lo digo.",
        options: [
            "Humor absurdo: la explicación no tiene relación con la pregunta",
            "Los astronautas son bajos",
            "Algunas personas dicen tonterías"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace una jirafa en un ascensor? Estirar las piernas.",
        options: [
            "Doble sentido: 'estirar las piernas' (caminar/estirar el cuello)",
            "Las jirafas usan ascensores",
            "Los animales altos tienen que agacharse"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un jaguar a otro jaguar? -Jaguar te sientes bien.",
        options: [
            "Juego de words: 'jaguar' + canción famosa española",
            "Los jaguares son positivos",
            "Los felinos se animan entre sí"
        ],
        correct: 0
    },
    {
        text: "¿Por qué los pájaros no van al médico? Porque ya tienen el curandero.",
        options: [
            "Juego de words: 'curandero' suena como el pájaro",
            "Los pájaros son más tradicionales",
            "El médico es para humanos"
        ],
        correct: 0
    },
    {
        text: "-Doctor, doctor, ¿puedo operarme yo mismo? -¡Ni se le ocurra! -¿Por qué? -Porque me quedaré sin trabajo.",
        options: [
            "Humor negro: el doctor prioriza su trabajo",
            "Los doctores son egoístas",
            "Los doctores exageran"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un pez en el Sahara? Nadar.",
        options: [
            "Humor absurdo: los peces siempre nadan aunque estén en el desierto",
            "Los peces pueden vivir en cualquier sitio",
            "El Sahara tiene agua"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un payaso en el dentista? Sentarse en la butaca, ¿y usted?",
        options: [
            "Confusión humorística con la pregunta del dentista",
            "Los payasos tienen miedo al dentista",
            "Los payasos van al médico"
        ],
        correct: 0
    },
    {
        text: "¿Por qué los cerdos no van al mercado? Porque ya tienen su propia charcutería.",
        options: [
            "Juego de words: 'cerdo' y 'charcutería'",
            "Los cerdos son privados",
            "El mercado es para humanos"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un techo a un suelo? Techo, mírame.",
        options: [
            "Juego de words: 'techo' y 'te echo de menos'",
            "Los techos y suelos se comunican",
            "Los techos miran hacia abajo"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un lama con un cortaúñas? Se da un lamazo.",
        options: [
            "Juego con 'lama' (monje) y 'lamazo' (corte/drama)",
            "Los lamas se cuidan las uñas",
            "Los monjes budistas usan herramientas"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace una rata en una verbena? Se pone a bailar el tang-rat-tán.",
        options: [
            "Juego de words: 'tango' y 'rata'",
            "Las ratas van a fiestas",
            "Los roedores son bailarines"
        ],
        correct: 0
    },
    {
        text: "¿Por qué el tomate enrojeció? Porque vio la ensalada sin ropa.",
        options: [
            "Humor absurdo e infantil sobre verduras",
            "Los tomates son tímidos",
            "Las ensaladas están desnudas"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un día a otro? Buenos días.",
        options: [
            "Juego de words: 'Buenos días' y la forma de saludar",
            "Los días hablan entre sí",
            "Los días son bilingües"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un camello en el Polo Norte? Soportar el frío camellón.",
        options: [
            "Juego con 'camello' y 'camellón' (joroba + conducción)",
            "Los camellos son resistentes",
            "El Polo Norte es frío"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace una vela en el dentista? Arder de miedo.",
        options: [
            "Juego con 'arder' (arder de miedo/tener miedo intenso) y 'vela' (cera)",
            "Las velas tienen miedo al dentista",
            "Los dentistas usan velas"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un lama con una calculadora? Cuenta los lamas.",
        options: [
            "Juego con 'lama' (monje) y 'lama' (animal sudamericano)",
            "Los lamas hacen matemáticas",
            "Los monjes cuentan sus posesiones"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un calamar a otro calamar? Vamos a secarnos.",
        options: [
            "Juego con 'secarse' (morir) y el calamar",
            "Los calamares hablan",
            "Los calamares se animan"
        ],
        correct: 0
    },
    {
        text: "¿Por qué el pescado no fue a la fiesta? Porque era tímido y quería pasar desapercibido, no quería que lo pescaran.",
        options: [
            "Doble sentido: 'pescado' (animal) y 'pescar' (cazar)",
            "Los peces son introvertidos",
            "Las fiestas son peligrosas"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace una abuela en el dentista? Abrir la boca y decir: ¡Ay, ay, ay!",
        options: [
            "Humor sobre las abuelas quejumbrosas",
            "Las abuelas van mucho al médico",
            "Los dentistas dan miedo"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un lama en la playa? Busca el lama-nte perfecto.",
        options: [
            "Juego con 'lama' y 'amante' (persona a la que se ama)",
            "Los lamas buscan la perfección",
            "Los monjes van a playas"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un sombrero a otro? Quédate en tu sitio, que yo voy a otro lado.",
        options: [
            "Juego con 'sitio' y 'sombrero'",
            "Los sombreros viajan mucho",
            "Los accesorios se despiden"
        ],
        correct: 0
    },
    {
        text: "¿Por qué las focas miran al cielo? Porque quieren ver las estrellas del mar.",
        options: [
            "Juego de words: 'estrellas de mar' y 'estrellas del mar'",
            "Las focas son curiosas",
            "Los animales miran el cielo"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un 7 a un 8? Bonito cinturón.",
        options: [
            "Humor con la forma de los números y la frase 'bonito cinturón'",
            "Los números tienen modales",
            "Los números se complimentan"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace una hormiga en un templo budista? Una hormi-ga-zén.",
        options: [
            "Juego con 'hormiga', 'ga' y 'zen' (meditación budista)",
            "Las hormigas meditan",
            "Los templos atraen insectos"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama al nadar en el mar? Practica su lama-riposa.",
        options: [
            "Juego con 'lama' y 'mariposa' (estilo de natación)",
            "Los lamas nadan muy rápido",
            "Los monjes practican deporte"
        ],
        correct: 0
    },
    {
        text: "¿Por qué el libro de historia estaba siempre triste? Porque siempre hablaba del pasado.",
        options: [
            "Doble sentido: 'pasado' (tiempo histórico/dolor emocional)",
            "La historia es aburrida",
            "Los libros tienen sentimientos"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un pez muerto en el váter? Nada, está flotando.",
        options: [
            "Humor con 'nadar' y 'flotar' para un pez muerto",
            "Los peces muertos flotan",
            "Los peces no pueden escapar"
        ],
        correct: 0
    },
    {
        text: "¿Qué le dice un gato de un ojo a un gato tuerto? Ojos que ves, amigo que tienes.",
        options: [
            "Refrán adaptado: 'ojos que no ves, corazón que no sientes'",
            "Los gatos se hacen amigos",
            "Los gatos tuerto son sociables"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama con un plátano? Se lo come con lama-ña.",
        options: [
            "Juego con 'lama' (monje) y 'maña' (habilidad)",
            "Los lamas comen plátanos",
            "Los monjes son creativos"
        ],
        correct: 0
    },
    {
        text: "¿Por qué los Simpson no van al médico? Porque ya tienen al doctor Hibbert.",
        options: [
            "Referencia humorística a los personajes de los Simpson",
            "Los Simpson se curan solos",
            "Los Simpson odian a los médicos"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un muro a otro muro? Nos vemos en la esqui-na.",
        options: [
            "Juego con 'muro', 'esquina' y 'arena'",
            "Los muros se encuentran",
            "Los muros son sociales"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace una gallina en un minigolf? Pone un hoyo en uno.",
        options: [
            "Doble sentido: 'hueco' (golf) y 'huevo' (gallina)",
            "Las gallinas juegan al golf",
            "Los animales van al minigolf"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un payaso a otro payaso? Estamos a tangos.",
        options: [
            "Juego con 'tangos' (baile argentino) y una expresión española",
            "Los payasos hablan de danza",
            "Los payasos son argentinos"
        ],
        correct: 0
    },
    {
        text: "¿Por qué los pájaros no van al bar de copas? Porque ya tienen su propio pío-bar.",
        options: [
            "Juego con 'pío' (sonido de pájaro) y un bar",
            "Los pájaros son tecnológicos",
            "Los pájaros tienen locales propios"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en un ascensor? Presiona el botón de la lama-da.",
        options: [
            "Juego con 'lama' (monje) y 'llamada' (botón de llamada)",
            "Los lamas usan tecnología",
            "Los monjes son modernos"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace una araña con un coche? Teje una tela de araña.",
        options: [
            "Doble sentido con 'tela' (tejido) y 'tela de araña' (web)",
            "Las arañas conducen",
            "Los animales usan vehículos"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un vaso a otro vaso? Yo tengo sed, ¿y tú?",
        options: [
            "Humor absurdo: los vasos hablan y tienen sed",
            "Los vasos se comunican",
            "Los vasos son perezosos"
        ],
        correct: 0
    },
    {
        text: "¿Por qué el ordenador fue al médico? Porque tenía un virus.",
        options: [
            "Doble sentido: virus informáticos y virus biológicos",
            "Los ordenadores enferman",
            "La tecnología necesita doctores"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama con un espejo? Se mira y dice: lama-g-nífico.",
        options: [
            "Juego con 'lama' y 'magnífico'",
            "Los lamas son vanidosos",
            "Los monjes se cuidan"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace una persona tímida en el supermercado? Comprar el paquete de ositos.",
        options: [
            "Juego con 'tímido' y 'tacos' (comida)",
            "Los tímidos comen en público",
            "Las personas tímidas evitan la atención"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un calamar a otro calamar? Vamos a jugar con tinta.",
        options: [
            "Juego con 'tinta' (del calamar) y 'tinta' (explosivo)",
            "Los calamares juegan",
            "Los calamares son juguetones"
        ],
        correct: 0
    },
    {
        text: "¿Por qué los cerdos no van al instituto? Porque ya tienen su propio cochin-clase.",
        options: [
            "Juego con 'cochino' (cerdo) y 'instituto'",
            "Los cerdos son tecnológicos",
            "Los cerdos son listos"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en una biblioteca? Lee libros de autoayuda.",
        options: [
            "Humor sobre los monjes y su búsqueda de sabiduría",
            "Los lamas leen mucho",
            "Los monjes buscan mejorarse"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un pez en una maratón? Nada hasta la meta.",
        options: [
            "Humor con la expresión 'nadar' y la maratón",
            "Los peces participan en carreras",
            "Los peces son rápidos"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un día lluvioso a otro día lluvioso? Estamos en la misma situación.",
        options: [
            "Humor absurdo: los días tienen conversaciones",
            "El tiempo es predecible",
            "Los días son repetitivos"
        ],
        correct: 0
    },
    {
        text: "¿Por qué el tomate enrojeció? Porque se puso celoso de la mahonesa.",
        options: [
            "Humor sobre la relación tomate-salsa",
            "Los tomates son celosos",
            "Las salsas son populares"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en un concurso de belleza? Se presenta como 'lama-dmirable'.",
        options: [
            "Juego con 'lama' y 'admirable'",
            "Los lamas participan en certámenes",
            "Los monjes son competitivos"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un murciélago en un banco? Saca sangre de su cuenta.",
        options: [
            "Doble sentido: 'sangre' (del murciélago) y 'sacar dinero'",
            "Los murciélagos van a bancos",
            "Los animales usan servicios financieros"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un techo a una pared? Te echo de menos.",
        options: [
            "Juego con 'techo' y 'te echo de menos'",
            "Los edificios tienen sentimientos",
            "Los techos y paredes se separan"
        ],
        correct: 0
    },
    {
        text: "¿Por qué la gallina cruzó la carretera? Para demostrar que no era cobarde, aunque tampoco era valiente, simplemente tenía que llegar al otro lado.",
        options: [
            "Humor con la respuesta clásica simplificada con ironía",
            "Las gallinas son valientes",
            "Las gallinas tienen personalidad"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama con un telescopio? Mira el cielo y dice: lama-ginación.",
        options: [
            "Juego con 'lama' e 'imaginación'",
            "Los lamas astronomía",
            "Los monjes buscan el cosmos"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace una rana en un taller mecánico? Sale croac-tivado.",
        options: [
            "Juego con 'croac' (sonido de rana) y 'desactivado'",
            "Las ranas trabajan en mecánica",
            "Los animales van a talleres"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un libro de matemáticas a un libro de historia? Respóndeme, no me vengas con historias.",
        options: [
            "Juego con 'historia' y la frase 'vienes con historias'",
            "Los libros discuten entre sí",
            "Los libros tienen personalidad"
        ],
        correct: 0
    },
    {
        text: "¿Por qué los vampiros no pueden ir al médico? Porque les chupa mucha sangre.",
        options: [
            "Juego con 'chupar' (médico/involucrarse) y 'sangre' (vampiros)",
            "Los vampiros son adictos",
            "Los médicos son peligrosos para vampiros"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en una fiesta de cumpleaños? Sopla las velas y pide un deseo lama-ravilloso.",
        options: [
            "Juego con 'lama' y 'maravilloso'",
            "Los lamas celebran cumpleaños",
            "Los monjes van a fiestas"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace una araña con ocho patas? Tic-tic-tic-tic-tic-tic-tic-tic.",
        options: [
            "Humor con el sonido de las patas de araña",
            "Las arañas hacen ruido",
            "Las arañas son ruidosas"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un pez a otro pez? Nada, simplemente te electrocuto.",
        options: [
            "Humor con 'nada' (verbo/ninguna cosa) y 'nadar'",
            "Los peces eléctricos son agresivos",
            "Los peces dan descargas"
        ],
        correct: 0
    },
    {
        text: "¿Por qué los pingüinos no vuelan? Porque ya tienen bastante con caminar.",
        options: [
            "Humor con la justificación absurda",
            "Los pingüinos son perezosos",
            "Los pingüinos son realistas"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en un barco? Navega por la lama-r.",
        options: [
            "Juego con 'lama' y 'la mar' (el mar)",
            "Los lamas son capitanes",
            "Los monjes navegan"
        ],
        correct: 0
    },
    {
        text: "¿Qué le dice un gato a otro gato? ¡Miau-presentes!",
        options: [
            "Juego con 'mis presentes' y el sonido 'miau' (suena a 'miau-presentes')",
            "Los gatos se llaman por su name",
            "Los gatos van al colegio"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un robot a otro robot? No me anualices, tengo sentimientos.",
        options: [
            "Juego con 'anualizar' y 'lloriqueos' (lamentos)",
            "Los robots tienen sentimientos",
            "Los robots son sensibles"
        ],
        correct: 0
    },
    {
        text: "¿Por qué los mapaches siempre llevan máscara? Porque son aseados pero no lavados.",
        options: [
            "Humor con 'lavados' (agua) y 'enmascarados' (máscara)",
            "Los mapaches son misteriosos",
            "Los mapaches se disfrazan"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en un cine? Ve lama-películas.",
        options: [
            "Juego con 'lama', 'películas' y 'llamas'",
            "Los lamas van al cine",
            "Los monjes son cinéfilos"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un koala en una oficina? Cuelga de la rama mientras otros trabajan.",
        options: [
            "Humor con la vida perezosa del koala",
            "Los koalas trabajan",
            "Los koalas son perezosos"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un ninja a otro ninja? No me toques, tengo shuriken.",
        options: [
            "Juego con 'tocar' y 'shuriken' (estrella ninja)",
            "Los ninjas se protegen",
            "Los ninjas son territoriales"
        ],
        correct: 0
    },
    {
        text: "¿Por qué los zombis nunca ganan en los deportes? Porque siempre están muertos de cansancio.",
        options: [
            "Doble sentido: 'muerto de cansancio' (literal/figurativo)",
            "Los zombis son perezosos",
            "Los zombis no pueden competir"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en la playa? Busca lama-sombra.",
        options: [
            "Juego con 'lama' y 'sombra'",
            "Los lamas buscan sombra",
            "Los monjes van a playas"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un lama en un concierto? Oye lama-sónica.",
        options: [
            "Juego con 'lama' y 'sónica'",
            "Los lamas disfrutan música",
            "Los monjes van a conciertos"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en la oficina de empleo? Busca lama-trabajo.",
        options: [
            "Juego con 'lama' y 'trabajo'",
            "Los lamas buscan empleo",
            "Los monjes trabajan"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un lama con un ordenador? Navega por lama-red.",
        options: [
            "Juego con 'lama' e 'internet'",
            "Los lamas usan tecnología",
            "Los monjes navegan"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en la cola del autobús? Espera lama-turno.",
        options: [
            "Juego con 'lama' y 'turno'",
            "Los lamas esperan transporte",
            "Los monjes usan autobús"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un lama en la panadería? Compra lama-pan.",
        options: [
            "Juego con 'lama' y 'pan'",
            "Los lamas comen pan",
            "Los monjes van a la panadería"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en el dentista? Abre la boca y dice: Lama-ay.",
        options: [
            "Juego con 'lama' y 'ay' (dolor)",
            "Los lamas van al dentista",
            "Los monjes sienten dolor"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un lama cuando hace frío? Se pone lama-abrigo.",
        options: [
            "Juego con 'lama' y 'abrigo'",
            "Los lamas se abrigan",
            "Los monjes sienten frío"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en el mercado? Busca lama-ofertas.",
        options: [
            "Juego con 'lama' y 'ofertas'",
            "Los lamas buscan gangas",
            "Los monjes van de compras"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace un lama cuando llueve? Busca lama-refugio.",
        options: [
            "Juego con 'lama' y 'refugio'",
            "Los lamas buscan cobijo",
            "Los monjes protegen del agua"
        ],
        correct: 0
    },
    {
        text: "-¿Qué le dice un lama a una llama? ¡Lama, soy tu primo!",
        options: [
            "Juego con 'lama' (monje) y 'llama' (animal)",
            "Los lamas y las llamas son primos",
            "Los monjes reconocen animales"
        ],
        correct: 0
    },
    {
        text: "¿Qué hace una hormiga en un templo? Ora-lama-ga-zén.",
        options: [
            "Juego con 'hormiga', 'oración' y 'zen'",
            "Las hormigas rezan",
            "Los templos atraen hormigas"
        ],
        correct: 0
    },
    {
        text: "-¿Qué hace un lama en un supermercado? Compra lama-súper.",
        options: [
            "Juego con 'lama' (monje) y 'supermercado'",
            "Los lamas van de compras",
            "Los monjes son modernos"
        ],
        correct: 0
    }
  ],
  en: [
    {
        text: "Why did the bicycle fall over? Because it was two-tired.",
        options: [
            "Play on words between 'two-tired' and 'too tired'",
            "Bicycles cannot stand up by themselves",
            "The wheels were broken"
        ],
        correct: 0
    },
    {
        text: "What do you call a fish with no eyes? A fsh.",
        options: [
            "Play on words: remove the letter 'i' (eye) from 'fish'",
            "Fish without eyes cannot see",
            "It is a rare kind of fish"
        ],
        correct: 0
    },
    {
        text: "Why did the scarecrow win an award? Because he was outstanding in his field.",
        options: [
            "Play on words: 'outstanding in his field' means great, and also standing in a farm field",
            "Scarecrows are good at sports",
            "The field gave out awards"
        ],
        correct: 0
    },
    {
        text: "Knock knock. Who's there? Lettuce. Lettuce who? Lettuce in, it's cold out here!",
        options: [
            "Play on words between 'lettuce' and 'let us'",
            "Vegetables like to visit houses",
            "Lettuce is a common name"
        ],
        correct: 0
    },
    {
        text: "Why can't you give Elsa a balloon? Because she will let it go.",
        options: [
            "Reference to the song 'Let It Go' from the movie Frozen",
            "Elsa does not like balloons",
            "Balloons float away in the cold"
        ],
        correct: 0
    },
    {
        text: "What do you call a bear with no teeth? A gummy bear.",
        options: [
            "Play on words: 'gummy' (no teeth) and 'gummy bear' (the candy)",
            "Bears without teeth eat gum",
            "Old bears lose their teeth"
        ],
        correct: 0
    },
    {
        text: "Why did the math book look so sad? Because it had too many problems.",
        options: [
            "Double meaning of 'problems': maths exercises and personal troubles",
            "Books can feel emotions",
            "Maths is boring"
        ],
        correct: 0
    },
    {
        text: "What do you call cheese that isn't yours? Nacho cheese.",
        options: [
            "Play on words between 'not yours' and 'nacho'",
            "Nacho cheese belongs to everyone",
            "Cheese can have owners"
        ],
        correct: 0
    },
    {
        text: "Why did the golfer bring two pairs of trousers? In case he got a hole in one.",
        options: [
            "Double meaning of 'hole in one': a golf shot and a hole in his trousers",
            "Golfers always carry spare clothes",
            "The golfer was clumsy"
        ],
        correct: 0
    },
    {
        text: "What did the ocean say to the beach? Nothing, it just waved.",
        options: [
            "Play on words: 'wave' as a greeting and as the movement of the sea",
            "The ocean and the beach are friends",
            "Beaches always answer the ocean"
        ],
        correct: 0
    },
    {
        text: "Why did the cookie go to the doctor? Because it felt crummy.",
        options: [
            "Play on words: 'crummy' (feeling unwell) and 'crumbs' (bits of cookie)",
            "Cookies get sick often",
            "Doctors treat cookies too"
        ],
        correct: 0
    },
    {
        text: "Knock knock. Who's there? Boo. Boo who? Don't cry, it's just a joke!",
        options: [
            "Play on words between 'boo hoo' (crying sound) and the name 'Boo'",
            "Ghosts say 'boo' to scare people",
            "The joke is about Halloween"
        ],
        correct: 0
    },
    {
        text: "What do you call a dinosaur that crashes his car? Tyrannosaurus wrecks.",
        options: [
            "Play on words between 'Tyrannosaurus rex' and 'wrecks'",
            "Dinosaurs cannot drive cars",
            "Old dinosaurs have bad eyesight"
        ],
        correct: 0
    },
    {
        text: "Why don't eggs tell jokes? Because they might crack up.",
        options: [
            "Double meaning of 'crack up': to laugh a lot and to break an eggshell",
            "Eggs cannot speak",
            "Eggs are fragile"
        ],
        correct: 0
    },
    {
        text: "What do you call a sleeping dinosaur? A dino-snore.",
        options: [
            "Play on words between 'dinosaur' and 'snore'",
            "Dinosaurs sleep a lot",
            "Sleeping animals make noise"
        ],
        correct: 0
    },
    {
        text: "Why did the tomato turn red? Because it saw the salad dressing.",
        options: [
            "Play on words: 'dressing' means getting dressed and also salad sauce",
            "Tomatoes are shy",
            "Salad makes vegetables blush"
        ],
        correct: 0
    },
    {
        text: "What did one wall say to the other wall? I'll meet you at the corner.",
        options: [
            "Absurd humour: walls having a normal conversation",
            "Walls can move around a building",
            "Corners are meeting points for walls"
        ],
        correct: 0
    },
    {
        text: "Why did the student eat his homework? Because the teacher said it was a piece of cake.",
        options: [
            "Play on words: 'a piece of cake' means very easy, and also a real food",
            "The homework was made of cake",
            "Hungry students eat anything"
        ],
        correct: 0
    },
    {
        text: "What do you call a can opener that doesn't work? A can't opener.",
        options: [
            "Play on words between 'can' and 'can't'",
            "Broken tools have funny names",
            "The can opener is very old"
        ],
        correct: 0
    },
    {
        text: "Why did the picture go to jail? Because it was framed.",
        options: [
            "Double meaning of 'framed': put in a picture frame, and blamed for a crime",
            "Pictures can be criminals",
            "Jails have many pictures"
        ],
        correct: 0
    },
    {
        text: "What do you call a fake noodle? An impasta.",
        options: [
            "Play on words between 'impostor' and 'pasta'",
            "Fake food tastes like noodles",
            "Noodles can pretend to be other food"
        ],
        correct: 0
    },
    {
        text: "Why did the banana go to the doctor? Because it wasn't peeling well.",
        options: [
            "Play on words between 'peeling' (banana skin) and 'feeling'",
            "Bananas get sick in autumn",
            "Doctors treat fruit too"
        ],
        correct: 0
    },
    {
        text: "What do you call a bear with no ears? B.",
        options: [
            "Play on words: remove 'ear' from 'bear' and you get 'B'",
            "Bears without ears cannot hear",
            "B is a nickname for bears"
        ],
        correct: 0
    },
    {
        text: "Why did the coffee file a police report? It got mugged.",
        options: [
            "Play on words between 'mugged' (robbed) and 'mug' (coffee cup)",
            "Coffee shops have many robberies",
            "Coffee cups can be stolen"
        ],
        correct: 0
    },
    {
        text: "Knock knock. Who's there? Owl. Owl who? Owl always love you.",
        options: [
            "Play on words between 'owl' and 'I'll'",
            "Owls say 'who' at night",
            "It is a joke about birds in love"
        ],
        correct: 0
    },
    {
        text: "What did the janitor say when he jumped out of the closet? Supplies!",
        options: [
            "Play on words between 'supplies' (cleaning items) and 'surprise'",
            "Janitors like to scare people",
            "Closets are full of surprises"
        ],
        correct: 0
    },
    {
        text: "Why did the computer go to the doctor? Because it had a virus.",
        options: [
            "Double meaning of 'virus': computer problem and illness",
            "Computers can catch colds",
            "Doctors fix electronics too"
        ],
        correct: 0
    },
    {
        text: "What do you call a pig that does karate? A pork chop.",
        options: [
            "Play on words between 'chop' (karate move) and 'pork chop' (food)",
            "Pigs are good at martial arts",
            "Karate is a popular sport for animals"
        ],
        correct: 0
    },
    {
        text: "Why did the belt get arrested? Because it held up a pair of trousers.",
        options: [
            "Play on words: 'held up' means to rob, and also to hold something in place",
            "Belts can be criminals",
            "Trousers need police protection"
        ],
        correct: 0
    },
    {
        text: "What do you call a group of musical whales? An orca-stra.",
        options: [
            "Play on words between 'orca' and 'orchestra'",
            "Whales like to make music together",
            "Orchestras are found in the ocean"
        ],
        correct: 0
    },
    {
        text: "Why did the frog take the bus to work? His car got toad away.",
        options: [
            "Play on words between 'toad' and 'towed'",
            "Frogs do not know how to drive",
            "Buses are cheaper than cars for frogs"
        ],
        correct: 0
    },
    {
        text: "What is a vampire's favourite fruit? A blood orange.",
        options: [
            "Play on words between 'blood orange' (a real fruit) and vampires drinking blood",
            "Vampires only eat oranges",
            "Blood oranges are scary fruit"
        ],
        correct: 0
    },
    {
        text: "Why couldn't the leopard play hide and seek? Because he was always spotted.",
        options: [
            "Play on words between 'spotted' (has spots) and 'spotted' (found)",
            "Leopards are bad at games",
            "Spots make animals slow"
        ],
        correct: 0
    },
    {
        text: "What do you call a dog that can do magic tricks? A labracadabrador.",
        options: [
            "Play on words between 'Labrador' and 'abracadabra'",
            "Dogs love magic shows",
            "Magicians train dogs to help them"
        ],
        correct: 0
    },
    {
        text: "Why did the astronaut break up with his girlfriend? He needed space.",
        options: [
            "Double meaning of 'space': outer space and personal space",
            "Astronauts cannot have relationships",
            "Space is very far from Earth"
        ],
        correct: 0
    },
    {
        text: "What do you call cheese that is sad? Blue cheese.",
        options: [
            "Play on words between 'blue' (a colour and cheese type) and feeling sad",
            "Sad cheese turns blue",
            "Blue is the colour of every cheese"
        ],
        correct: 0
    },
    {
        text: "Why did the skeleton not go to the party? Because he had no body to go with.",
        options: [
            "Play on words between 'no body' and 'nobody'",
            "Skeletons do not like parties",
            "Parties need many guests"
        ],
        correct: 0
    },
    {
        text: "What do you call a factory that makes okay products? A satisfactory.",
        options: [
            "Play on words between 'satisfactory' and 'satisfy a factory'",
            "Factories make only okay things",
            "Products need approval"
        ],
        correct: 0
    },
    {
        text: "Why did the cow win an award? Because she was outstanding in her field.",
        options: [
            "Play on words: 'outstanding in her field' means excellent, and also standing in a farm field",
            "Cows love awards",
            "Fields give prizes to animals"
        ],
        correct: 0
    },
    {
        text: "What did one plate say to the other plate? Dinner is on me!",
        options: [
            "Play on words between 'dinner is on me' (I'll pay) and food literally on a plate",
            "Plates like to talk during meals",
            "Plates are generous with money"
        ],
        correct: 0
    },
    {
        text: "Why don't scientists trust atoms? Because they make up everything.",
        options: [
            "Play on words: 'make up everything' means to lie, and atoms form all matter",
            "Atoms are dishonest",
            "Scientists dislike small things"
        ],
        correct: 0
    },
    {
        text: "What do you call an alligator in a vest? An investigator.",
        options: [
            "Play on words between 'in vest' and 'investigator'",
            "Alligators like to wear clothes",
            "Detectives often dress as alligators"
        ],
        correct: 0
    },
    {
        text: "Why did the bicycle need a doctor? It kept spinning out of control.",
        options: [
            "Play on words: 'spinning out of control' describes wheels and also feeling dizzy",
            "Bicycles need medical checkups",
            "Doctors fix broken wheels"
        ],
        correct: 0
    },
    {
        text: "What do you call an elephant that never washes? A smelly-fant.",
        options: [
            "Play on words between 'smelly' and 'elephant'",
            "Elephants never take baths",
            "Big animals always smell bad"
        ],
        correct: 0
    },
    {
        text: "Why did the cookie cry? Because its mum was a wafer so long.",
        options: [
            "Play on words between 'a wafer so long' and 'away for so long'",
            "Cookies miss their families",
            "Wafers make cookies sad"
        ],
        correct: 0
    },
    {
        text: "What do you call a snowman in the summer? A puddle.",
        options: [
            "Logical joke: heat melts a snowman into water",
            "Snowmen turn into animals",
            "Summer is dangerous for everyone"
        ],
        correct: 0
    },
    {
        text: "Why did the teddy bear say no to dessert? Because she was already stuffed.",
        options: [
            "Play on words: 'stuffed' means full of food, and teddy bears are stuffed with cotton",
            "Teddy bears cannot eat dessert",
            "Bears prefer savoury food"
        ],
        correct: 0
    },
    {
        text: "What do you call a fish wearing a crown? A king fish.",
        options: [
            "Play on words between 'kingfish' (a real fish) and a fish wearing a crown",
            "Fish like to wear jewellery",
            "Crowns float in water"
        ],
        correct: 0
    },
    {
        text: "Why is it hard to explain puns to a kleptomaniac? Because they always take things literally.",
        options: [
            "Play on words: 'take things literally' means to misunderstand, and also to steal",
            "Kleptomaniacs love wordplay",
            "Puns are always about stealing"
        ],
        correct: 0
    },
    {
        text: "What do you call a very small witch? A witch-let.",
        options: [
            "Play on words with the diminutive suffix '-let' meaning small",
            "Small witches have less magic",
            "Witches shrink over time"
        ],
        correct: 0
    },
    {
        text: "Why don't oysters share their pearls? Because they are shellfish.",
        options: [
            "Play on words between 'shellfish' and 'selfish'",
            "Oysters do not like sharing food",
            "Pearls are too valuable to share"
        ],
        correct: 0
    },
    {
        text: "What do you call a boomerang that doesn't come back? A stick.",
        options: [
            "Logical joke: a boomerang that doesn't return is just an ordinary stick",
            "Boomerangs are made of stone",
            "Sticks always come back"
        ],
        correct: 0
    },
    {
        text: "Why did the stadium get hot after the game? Because all the fans left.",
        options: [
            "Play on words between 'fans' (supporters) and 'fans' (machines that cool the air)",
            "Games always make stadiums hot",
            "Football fans dislike heat"
        ],
        correct: 0
    },
    {
        text: "What do you call a can of soup that doesn't work? Broken broth.",
        options: [
            "Alliteration joke: 'broken broth' sounds funny together",
            "Soup cans have machine parts",
            "Broth spoils quickly"
        ],
        correct: 0
    },
    {
        text: "Why did the golfer bring an extra sock? In case he got a hole in one.",
        options: [
            "Double meaning of 'hole in one': a golf shot and a hole in his sock",
            "Golfers always pack spare clothes",
            "Socks rip easily on a golf course"
        ],
        correct: 0
    },
    {
        text: "What do you call a very happy cowboy? A jolly rancher.",
        options: [
            "Play on words between 'jolly rancher' (a happy farmer, and also a candy brand)",
            "Cowboys are always cheerful",
            "Ranchers like sweets"
        ],
        correct: 0
    },
    {
        text: "Why did the orange stop rolling down the hill? Because it ran out of juice.",
        options: [
            "Play on words: 'run out of juice' means to lose energy, and oranges have juice inside",
            "Oranges only roll when full",
            "Hills stop fruit from moving"
        ],
        correct: 0
    },
    {
        text: "What do you call a pile of cats? A meow-ntain.",
        options: [
            "Play on words between 'meow' and 'mountain'",
            "Cats like to climb high places",
            "Mountains are full of cats"
        ],
        correct: 0
    },
    {
        text: "Why did the calendar feel nervous? Because its days were numbered.",
        options: [
            "Play on words: 'days are numbered' means limited time, and calendars have numbered days",
            "Calendars can feel worried",
            "Every calendar has only a few days"
        ],
        correct: 0
    },
    {
        text: "What do you call a droid that takes the long way round? R2 detour.",
        options: [
            "Play on words between 'R2-D2' and 'detour'",
            "Robots always take the fastest way",
            "Droids get lost easily"
        ],
        correct: 0
    },
    {
        text: "Why did the smartphone need glasses? It lost all its contacts.",
        options: [
            "Play on words: 'contacts' means phone numbers, and also lenses for the eyes",
            "Phones can see with a screen",
            "Old phones need repairs"
        ],
        correct: 0
    },
    {
        text: "What do you call a sad strawberry? A blueberry.",
        options: [
            "Play on words: sad makes you 'blue', and blueberries are a different fruit",
            "Strawberries turn blue when sad",
            "All red fruit becomes blue eventually"
        ],
        correct: 0
    },
    {
        text: "Why did the volcano go to school? Because it wanted to be a little more erupt.",
        options: [
            "Play on words between 'erupt' and 'abrupt'",
            "Volcanoes go to school to learn manners",
            "Schools teach volcanoes to explode"
        ],
        correct: 0
    },
    {
        text: "What do you call two birds in love? Tweethearts.",
        options: [
            "Play on words between 'tweet' (bird sound) and 'sweethearts'",
            "Birds get married in nests",
            "Love makes birds sing more"
        ],
        correct: 0
    },
    {
        text: "Why did the clock in the cafeteria run slow? It always went back four seconds.",
        options: [
            "Play on words between 'four seconds' and 'for seconds' (a second helping of food)",
            "Cafeteria clocks are always broken",
            "Slow clocks help you eat more"
        ],
        correct: 0
    },
    {
        text: "What do you call a laughing motorcycle? A Yamaha-ha-ha.",
        options: [
            "Play on words between the brand 'Yamaha' and the sound 'ha-ha'",
            "Motorcycles make funny noises",
            "Yamaha only builds happy vehicles"
        ],
        correct: 0
    },
    {
        text: "Why did the gym close down? It just didn't work out.",
        options: [
            "Play on words: 'work out' means exercise, and also to succeed as a business",
            "Gyms need lots of equipment",
            "Exercise is unpopular now"
        ],
        correct: 0
    },
    {
        text: "What do you call a nosy pepper? Jalapeño business.",
        options: [
            "Play on words between 'jalapeño' and 'none of your business'",
            "Peppers like to gossip",
            "Spicy food makes you curious"
        ],
        correct: 0
    },
    {
        text: "Why did the music teacher need a ladder? To reach the high notes.",
        options: [
            "Double meaning of 'high notes': musical pitch and physical height",
            "Music teachers are usually short",
            "Notes are written high on a wall"
        ],
        correct: 0
    },
    {
        text: "What do you call a dog magician? A labracadabrador.",
        options: [
            "Play on words between 'Labrador' and 'abracadabra'",
            "Dogs can perform real magic",
            "Magicians always own dogs"
        ],
        correct: 0
    },
    {
        text: "Why did the tree go to the dentist? Because it needed a root canal.",
        options: [
            "Play on words: 'root canal' is dental work, and trees have roots",
            "Trees have teeth hidden underground",
            "Dentists also treat plants"
        ],
        correct: 0
    },
    {
        text: "What do you call a fish that needs help with music? Auto-tuna.",
        options: [
            "Play on words between 'tuna' and 'auto-tune'",
            "Fish cannot sing well",
            "Music studios use fish sounds"
        ],
        correct: 0
    },
    {
        text: "Why did the football coach go to the bank? To get his quarterback.",
        options: [
            "Play on words between 'quarterback' (a player position) and 'quarter back' (getting change)",
            "Coaches always need money",
            "Banks train football players"
        ],
        correct: 0
    },
    {
        text: "What do you call a dinosaur with a large vocabulary? A thesaurus.",
        options: [
            "Play on words between 'thesaurus' (a word book) and dinosaur names",
            "Dinosaurs invented language",
            "Big animals know more words"
        ],
        correct: 0
    },
    {
        text: "Why did the baker stop making doughnuts? He got tired of the hole business.",
        options: [
            "Play on words between 'hole' (doughnut hole) and 'whole' (entire business)",
            "Bakers dislike doughnuts",
            "Doughnut shops always close"
        ],
        correct: 0
    },
    {
        text: "What do you call an ant that fights crime? A vigilANT.",
        options: [
            "Play on words: the word 'vigilant' contains 'ant'",
            "Ants are natural crime fighters",
            "Insects can wear capes"
        ],
        correct: 0
    },
    {
        text: "Why did the light bulb fail its test? It wasn't very bright that day.",
        options: [
            "Play on words: 'bright' means intelligent, and also a lot of light",
            "Light bulbs go to school",
            "Bulbs get tired during exams"
        ],
        correct: 0
    },
    {
        text: "What do you call a very polite iceberg? A cool customer.",
        options: [
            "Play on words: 'cool customer' means calm and polite, and icebergs are literally cool",
            "Icebergs like good manners",
            "Cold weather makes people polite"
        ],
        correct: 0
    },
    {
        text: "Why did the melon jump into the lake? It wanted to be a watermelon.",
        options: [
            "Play on words: 'water' plus 'melon' equals 'watermelon'",
            "Melons like swimming",
            "Fruit changes type in water"
        ],
        correct: 0
    },
    {
        text: "What do you call an octopus that makes you laugh? A comedi-an with eight arms.",
        options: [
            "Play on words between 'comedian' and having eight arms",
            "Octopuses are natural comedians",
            "Sea animals love jokes"
        ],
        correct: 0
    },
    {
        text: "Why did the shoe stay home? Because it lost its sole.",
        options: [
            "Play on words between 'sole' (bottom of a shoe) and 'soul'",
            "Shoes need rest sometimes",
            "Old shoes cannot walk far"
        ],
        correct: 0
    },
    {
        text: "What do you call a lazy kangaroo? A pouch potato.",
        options: [
            "Play on words between 'couch potato' and a kangaroo's 'pouch'",
            "Kangaroos are always tired",
            "Potatoes grow inside pouches"
        ],
        correct: 0
    },
    {
        text: "Why did the burglar hang up his coat? Because he wanted to make a clean getaway.",
        options: [
            "Play on words: 'clean getaway' means a neat escape, and also being tidy",
            "Burglars care about their clothes",
            "Coats help you run faster"
        ],
        correct: 0
    },
    {
        text: "What do you call a very tired kangaroo? Out of hop-tions.",
        options: [
            "Play on words between 'hop' (how kangaroos move) and 'options'",
            "Kangaroos never get tired",
            "There are no more kangaroos left"
        ],
        correct: 0
    },
    {
        text: "Why did the man put his money in the freezer? He wanted cold, hard cash.",
        options: [
            "Play on words between 'cold, hard cash' (a saying for real money) and something literally frozen",
            "Freezers are the safest place for money",
            "Cold money is worth more"
        ],
        correct: 0
    },
    {
        text: "What do you call a very small violin playing sad music? The world's smallest violin.",
        options: [
            "Common expression used to make fun of a tiny complaint",
            "Small violins sound sadder",
            "Every orchestra has one tiny violin"
        ],
        correct: 0
    },
    {
        text: "Why did the barber win the race? Because he knew all the shortcuts.",
        options: [
            "Play on words: 'shortcuts' means quick routes, and also short haircuts",
            "Barbers are fast runners",
            "Hair grows faster after a race"
        ],
        correct: 0
    },
    {
        text: "What do you call a fly without wings? A walk.",
        options: [
            "Logical joke: a fly that cannot fly can only walk",
            "Flies without wings are rare",
            "Insects walk faster than they fly"
        ],
        correct: 0
    },
    {
        text: "Why was the broom late? It overswept.",
        options: [
            "Play on words between 'overswept' and 'overslept'",
            "Brooms need to rest at night",
            "Sweeping takes a long time"
        ],
        correct: 0
    },
    {
        text: "What do you call a very organised owl? A wise guy with a to-do list.",
        options: [
            "Owls are seen as wise in stories, so this jokes plays with the idea of an owl planning its day",
            "Owls really do write lists",
            "Wise animals never forget anything"
        ],
        correct: 0
    },
    {
        text: "Why did the tomato blush? Because it saw the ketchup coming.",
        options: [
            "Play on words: blushing (turning red) and tomatoes already being red like ketchup",
            "Ketchup is embarrassing for tomatoes",
            "Vegetables turn red when scared"
        ],
        correct: 0
    },
    {
        text: "What do you call a rabbit that tells good jokes? A funny bunny.",
        options: [
            "Rhyming play on words between 'funny' and 'bunny'",
            "Rabbits love telling stories",
            "Bunnies are naturally comedians"
        ],
        correct: 0
    },
    {
        text: "Why did the baseball player bring string to the game? To tie the score.",
        options: [
            "Play on words between 'tie the score' (equal points) and tying a knot with string",
            "String helps players run faster",
            "Baseball games always end in a tie"
        ],
        correct: 0
    },
    {
        text: "What do you call a snail on a ship? A snailor.",
        options: [
            "Play on words between 'snail' and 'sailor'",
            "Snails love the sea",
            "Ships are full of snails"
        ],
        correct: 0
    },
    {
        text: "Why did the students eat their homework? The teacher said it was a piece of cake.",
        options: [
            "Play on words: 'a piece of cake' means very easy, and also real food",
            "Homework tastes like cake",
            "Hungry students always eat paper"
        ],
        correct: 0
    },
    {
        text: "What did the calculator say to the student? You can count on me.",
        options: [
            "Play on words between 'count on me' (to trust someone) and counting numbers",
            "Calculators like to talk",
            "Maths class is always fun"
        ],
        correct: 0
    },
    {
        text: "Why did the ghost go into the bakery? For the boo-berry muffins.",
        options: [
            "Play on words between 'boo' (ghost sound) and 'blueberry'",
            "Ghosts love muffins more than any other food",
            "Bakeries are always haunted"
        ],
        correct: 0
    }
  ]
};
