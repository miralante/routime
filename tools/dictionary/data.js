/* ============================================================
   Datos: Diccionario (lenguaje — palabras difíciles con
   significado sencillo, aprendizaje significativo).
   Cada palabra se enseña con una ficha que une tres cosas, para
   anclar la palabra nueva a algo que la persona ya conoce
   (aprendizaje significativo de Ausubel, no memorización suelta):
   la palabra, su significado en Lectura Fácil, y un ejemplo de
   la vida real donde se usa. Formato:
   DATA.es / DATA.en = [{ id, name, words: [{ word, definition,
     example }] }]
   'id' de cada grupo se mantiene igual en es/en para conservar
   el progreso al cambiar de idioma. Palabras y significados son
   contenido propio de cada idioma (no traducción literal, para
   que el registro y la dificultad sean equivalentes — I18N.md §3).
   DATA.porRonda = tamaño del test de cada grupo (coincide con las
   8 palabras del grupo: se preguntan todas).
   app.js usa DATA[App.i18n.locale()] || DATA.es. Las opciones
   incorrectas del test se generan tomando el significado de otras
   palabras del mismo grupo (nunca inventadas).
   Niveles 4-15 son una copia estática e histórica del banco
   `content/dictionary/{es,en}.json` (eliminado en 2026-08-30; el
   contenido de este archivo es la versión conservada para la
   actividad). 100 palabras/idioma: 3 grupos de 8 por cada uno de
   los 4 temas del banco original (día a día, emociones y
   personalidad, trabajo y sociedad, ciencia y el mundo). Quedan 4
   palabras sin usar por idioma para una futura ampliación.
   ============================================================ */
var DATA = {
  porRonda: 8,
  es: [
    {
      id: 'level1',
      name: 'Nivel 1 · Palabras del día a día',
      words: [
        { word: 'meticuloso', definition: 'Que hace las cosas con mucho cuidado, mirando cada detalle.', example: 'Ana es meticulosa: revisa dos veces cada tarea antes de entregarla.' },
        { word: 'eficaz', definition: 'Que consigue el resultado que se busca.', example: 'Este jabón es eficaz: quita las manchas a la primera.' },
        { word: 'ambiguo', definition: 'Que se puede entender de más de una manera, no está claro.', example: 'Su respuesta fue ambigua: no supimos si decía que sí o que no.' },
        { word: 'escaso', definition: 'Que hay muy poco de algo.', example: 'El agua es escasa en el desierto.' },
        { word: 'ocasional', definition: 'Que pasa de vez en cuando, no siempre.', example: 'Tiene dolores de cabeza ocasionales, no todos los días.' },
        { word: 'imprescindible', definition: 'Que hace mucha falta, no se puede vivir sin ello.', example: 'El agua es imprescindible para vivir.' },
        { word: 'cotidiano', definition: 'Que pasa todos los días, normal.', example: 'Lavarse los dientes es una tarea cotidiana.' },
        { word: 'considerable', definition: 'Que es bastante grande o importante.', example: 'Ganó una cantidad considerable de dinero en el sorteo.' }
      ]
    },
    {
      id: 'level2',
      name: 'Nivel 2 · Palabras de las emociones',
      words: [
        { word: 'perspicaz', definition: 'Que se da cuenta rápido de las cosas, muy observador.', example: 'El detective es perspicaz: encontró la pista que nadie vio.' },
        { word: 'reticente', definition: 'Que no quiere hacer algo o no está convencido.', example: 'Estaba reticente a probar la comida nueva.' },
        { word: 'empático', definition: 'Que entiende y comparte lo que siente otra persona.', example: 'Es muy empática: siempre sabe cómo te sientes.' },
        { word: 'huraño', definition: 'Que no le gusta estar con gente, prefiere estar solo.', example: 'El gato del vecino es huraño: se esconde cuando llegan visitas.' },
        { word: 'tenaz', definition: 'Que no se rinde, sigue intentándolo.', example: 'Fue tenaz y aprobó el examen después de tres intentos.' },
        { word: 'locuaz', definition: 'Que habla mucho y con facilidad.', example: 'Mi tío es muy locuaz: puede hablar horas sin parar.' },
        { word: 'sereno', definition: 'Que está tranquilo, sin nervios.', example: 'Se quedó sereno aunque hubo un problema grande.' },
        { word: 'indeciso', definition: 'Que le cuesta elegir entre varias opciones.', example: 'Es indeciso: tardó media hora en elegir el postre.' }
      ]
    },
    {
      id: 'level3',
      name: 'Nivel 3 · Palabras del mundo',
      words: [
        { word: 'efímero', definition: 'Que dura muy poco tiempo.', example: 'El arcoíris fue efímero: desapareció en un minuto.' },
        { word: 'escrutinio', definition: 'Mirar algo con mucha atención para revisarlo bien.', example: 'Los votos pasaron por un escrutinio antes de dar el resultado.' },
        { word: 'controversia', definition: 'Cuando la gente no está de acuerdo y discute sobre un tema.', example: 'La nueva ley causó controversia: unos a favor y otros en contra.' },
        { word: 'equitativo', definition: 'Que reparte las cosas de forma justa para todos.', example: 'El profesor repartió el trabajo de forma equitativa entre todos.' },
        { word: 'inequívoco', definition: 'Que solo se puede entender de una manera, muy claro.', example: 'Dio una respuesta inequívoca: un sí muy claro.' },
        { word: 'pragmático', definition: 'Que busca soluciones prácticas, sin complicarse.', example: 'Fue pragmático: eligió la solución más fácil y rápida.' },
        { word: 'divergente', definition: 'Que va en una dirección distinta a las demás.', example: 'Sus opiniones eran divergentes a las del resto del grupo.' },
        { word: 'inherente', definition: 'Que forma parte de algo desde siempre, no se puede separar.', example: 'La curiosidad es inherente a los niños pequeños.' }
      ]
    },
    {
      id: 'level4',
      name: 'Nivel 4 · Día a día (2)',
      words: [
        { word: 'asequible', definition: 'Que se puede comprar o conseguir sin gastar mucho dinero.', example: 'Este piso es asequible: cuesta menos que otros del barrio.' },
        { word: 'rutinario', definition: 'Que se repite siempre de la misma manera.', example: 'Guardar la compra es una tarea rutinaria en casa.' },
        { word: 'práctico', definition: 'Que sirve para algo útil, sin complicaciones.', example: 'Este bolso es práctico: cabe todo lo que necesito.' },
        { word: 'accesible', definition: 'Que es fácil de usar o de llegar hasta él.', example: 'La rampa hace que la entrada sea accesible en silla de ruedas.' },
        { word: 'puntual', definition: 'Que llega a la hora exacta, ni antes ni después.', example: 'Fue puntual: llegó justo a las nueve.' },
        { word: 'razonable', definition: 'Que tiene sentido y no es exagerado.', example: 'El precio del billete me pareció razonable.' },
        { word: 'suficiente', definition: 'Que hay la cantidad justa que hace falta.', example: 'Tenemos comida suficiente para toda la semana.' },
        { word: 'previsible', definition: 'Que se puede saber antes de que pase.', example: 'La lluvia era previsible: lo dijo el tiempo esta mañana.' }
      ]
    },
    {
      id: 'level5',
      name: 'Nivel 5 · Día a día (3)',
      words: [
        { word: 'duradero', definition: 'Que dura mucho tiempo sin romperse.', example: 'Estos zapatos son duraderos: los uso desde hace tres años.' },
        { word: 'sencillo', definition: 'Que no tiene complicaciones, es fácil de entender.', example: 'La receta es sencilla: solo tiene tres pasos.' },
        { word: 'habitual', definition: 'Que pasa casi siempre, es lo normal.', example: 'Tomar café por la mañana es habitual en mi casa.' },
        { word: 'urgente', definition: 'Que hay que hacerlo ya, no puede esperar.', example: 'La llamada era urgente: había un problema en el trabajo.' },
        { word: 'provisional', definition: 'Que dura poco tiempo, hasta que llegue algo definitivo.', example: 'Vivimos en un piso provisional mientras arreglan el nuestro.' },
        { word: 'voluntario', definition: 'Que se hace porque uno quiere, no porque lo obliguen.', example: 'Ayudar en el comedor social es un trabajo voluntario.' },
        { word: 'gradual', definition: 'Que pasa poco a poco, no de golpe.', example: 'El cambio de horario fue gradual, un poco cada semana.' },
        { word: 'notable', definition: 'Que se nota mucho, es fácil de ver.', example: 'Hizo una mejora notable en su forma de leer.' }
      ]
    },
    {
      id: 'level6',
      name: 'Nivel 6 · Día a día (4)',
      words: [
        { word: 'impecable', definition: 'Que está perfecto, sin ningún fallo.', example: 'Dejó la cocina impecable después de limpiar.' },
        { word: 'viable', definition: 'Que se puede hacer de verdad, es posible.', example: 'El plan es viable si empezamos esta semana.' },
        { word: 'cómodo', definition: 'Que hace sentir bien, sin molestias.', example: 'Este sillón es muy cómodo para ver la tele.' },
        { word: 'versátil', definition: 'Que sirve para muchas cosas distintas.', example: 'Esta herramienta es versátil: sirve para varios trabajos.' },
        { word: 'fiable', definition: 'Que se puede confiar en ello, no falla.', example: 'Este reloj es fiable: siempre da la hora bien.' },
        { word: 'moderado', definition: 'Que no es ni mucho ni poco, es equilibrado.', example: 'Hizo un gasto moderado en el viaje.' },
        { word: 'flexible', definition: 'Que se puede cambiar o adaptar con facilidad.', example: 'Mi horario de trabajo es flexible, puedo elegirlo.' },
        { word: 'eventual', definition: 'Que puede pasar, pero no es seguro.', example: 'Hay un eventual cambio de planes si llueve.' }
      ]
    },
    {
      id: 'level7',
      name: 'Nivel 7 · Emociones y personalidad (2)',
      words: [
        { word: 'optimista', definition: 'Que ve el lado bueno de las cosas.', example: 'Es optimista: cree que todo saldrá bien.' },
        { word: 'pesimista', definition: 'Que ve el lado malo de las cosas.', example: 'Es pesimista: piensa que algo saldrá mal.' },
        { word: 'generoso', definition: 'Que le gusta compartir lo que tiene con los demás.', example: 'Fue generoso: dio la mitad de su comida.' },
        { word: 'orgulloso', definition: 'Que se siente muy contento por algo que ha hecho.', example: 'Está orgulloso de haber aprobado el examen.' },
        { word: 'humilde', definition: 'Que no presume de lo que tiene o hace.', example: 'Es humilde: nunca habla de sus premios.' },
        { word: 'impulsivo', definition: 'Que actúa rápido, sin pensar antes.', example: 'Fue impulsivo: compró el coche sin mirar el precio.' },
        { word: 'prudente', definition: 'Que piensa bien antes de actuar, para evitar problemas.', example: 'Fue prudente: miró a los dos lados antes de cruzar.' },
        { word: 'curioso', definition: 'Que quiere saber cosas nuevas todo el rato.', example: 'Es curioso: siempre pregunta cómo funcionan las cosas.' }
      ]
    },
    {
      id: 'level8',
      name: 'Nivel 8 · Emociones y personalidad (3)',
      words: [
        { word: 'resiliente', definition: 'Que se recupera bien después de algo difícil.', example: 'Fue resiliente: volvió a intentarlo después del fracaso.' },
        { word: 'introvertido', definition: 'Que prefiere estar solo o con poca gente.', example: 'Es introvertido: le gusta quedarse en casa leyendo.' },
        { word: 'extrovertido', definition: 'Que le gusta estar rodeado de gente y hablar.', example: 'Es extrovertido: conoce a todo el mundo en la fiesta.' },
        { word: 'sensible', definition: 'Que se emociona con facilidad.', example: 'Es sensible: llora viendo películas tristes.' },
        { word: 'cauteloso', definition: 'Que tiene cuidado para no equivocarse.', example: 'Fue cauteloso: leyó el contrato dos veces antes de firmar.' },
        { word: 'compasivo', definition: 'Que siente pena por el dolor de otros y quiere ayudar.', example: 'Fue compasivo: ayudó al señor que se había caído.' },
        { word: 'rencoroso', definition: 'Que no olvida ni perdona cuando le hacen daño.', example: 'Es rencoroso: sigue enfadado por algo de hace un año.' },
        { word: 'afable', definition: 'Que trata bien a la gente, es amable al hablar.', example: 'El vecino es afable: siempre saluda con una sonrisa.' }
      ]
    },
    {
      id: 'level9',
      name: 'Nivel 9 · Emociones y personalidad (4)',
      words: [
        { word: 'altruista', definition: 'Que ayuda a los demás sin esperar nada a cambio.', example: 'Fue altruista: donó dinero sin decírselo a nadie.' },
        { word: 'desconfiado', definition: 'Que no cree fácilmente en lo que dicen los demás.', example: 'Es desconfiado: pregunta varias veces antes de creer algo.' },
        { word: 'entusiasta', definition: 'Que muestra mucha ilusión y ganas por algo.', example: 'Es entusiasta con el nuevo trabajo: llega feliz cada día.' },
        { word: 'obstinado', definition: 'Que no cambia de idea aunque le digan que se equivoca.', example: 'Fue obstinado: siguió con su plan aunque todos le avisaron.' },
        { word: 'servicial', definition: 'Que le gusta ayudar a los demás.', example: 'Es servicial: siempre ayuda a cargar las bolsas.' },
        { word: 'vulnerable', definition: 'Que puede sufrir daño con facilidad, necesita protección.', example: 'Las personas mayores son más vulnerables al frío.' },
        { word: 'asertivo', definition: 'Que dice lo que piensa con respeto, sin miedo.', example: 'Fue asertivo: dijo que no le gustaba el plan sin enfadarse.' },
        { word: 'melancólico', definition: 'Que siente una tristeza suave, como añoranza.', example: 'Se puso melancólico al ver fotos antiguas.' }
      ]
    },
    {
      id: 'level10',
      name: 'Nivel 10 · Trabajo y sociedad (1)',
      words: [
        { word: 'jornada', definition: 'El tiempo que se trabaja en un día.', example: 'Su jornada laboral empieza a las ocho.' },
        { word: 'contrato', definition: 'Un papel que dice las condiciones de un trabajo o acuerdo.', example: 'Firmó el contrato antes de empezar a trabajar.' },
        { word: 'sueldo', definition: 'El dinero que se recibe por trabajar.', example: 'Cobra el sueldo el último día del mes.' },
        { word: 'presupuesto', definition: 'El dinero que se puede gastar en algo, calculado antes.', example: 'Hicimos un presupuesto para las vacaciones.' },
        { word: 'impuesto', definition: 'Dinero que se paga al Estado por ley.', example: 'Los impuestos sirven para pagar hospitales y colegios.' },
        { word: 'normativa', definition: 'El conjunto de reglas que hay que cumplir.', example: 'La normativa dice que hay que llevar casco en bici.' },
        { word: 'trámite', definition: 'Un paso que hay que hacer para conseguir algo oficial.', example: 'Pedir el DNI es un trámite en la comisaría.' },
        { word: 'solicitud', definition: 'Un papel donde se pide algo de forma oficial.', example: 'Rellenó la solicitud para pedir la beca.' }
      ]
    },
    {
      id: 'level11',
      name: 'Nivel 11 · Trabajo y sociedad (2)',
      words: [
        { word: 'entidad', definition: 'Una organización, como una empresa o una asociación.', example: 'El banco es una entidad que guarda el dinero.' },
        { word: 'colectivo', definition: 'Un grupo de personas que comparten algo en común.', example: 'Ayuda a un colectivo de personas mayores.' },
        { word: 'inclusión', definition: 'Hacer que todas las personas puedan participar, sin dejar a nadie fuera.', example: 'La rampa mejora la inclusión de las personas en silla de ruedas.' },
        { word: 'discriminación', definition: 'Tratar peor a una persona por ser diferente.', example: 'La ley prohíbe la discriminación por el origen de la persona.' },
        { word: 'autonomía', definition: 'Poder hacer las cosas uno mismo, sin ayuda de otros.', example: 'Cocinar solo le da más autonomía.' },
        { word: 'institución', definition: 'Una organización grande, como el Ayuntamiento o un hospital.', example: 'El Ayuntamiento es una institución del pueblo.' },
        { word: 'comunidad', definition: 'Un grupo de personas que viven o comparten algo en el mismo lugar.', example: 'Toda la comunidad ayudó a limpiar el parque.' },
        { word: 'ciudadanía', definition: 'El derecho y el deber de vivir como parte de un país.', example: 'Votar es parte de la ciudadanía.' }
      ]
    },
    {
      id: 'level12',
      name: 'Nivel 12 · Trabajo y sociedad (3)',
      words: [
        { word: 'legislación', definition: 'El conjunto de leyes de un país.', example: 'La legislación protege los derechos de los trabajadores.' },
        { word: 'convocatoria', definition: 'Un aviso para que la gente vaya a un sitio o participe en algo.', example: 'Salió la convocatoria para el nuevo curso.' },
        { word: 'subvención', definition: 'Dinero que da el Estado para ayudar a hacer algo.', example: 'La asociación recibió una subvención para el taller.' },
        { word: 'gestión', definition: 'Organizar y llevar bien las tareas de algo.', example: 'La gestión del dinero de la casa la hace entre los dos.' },
        { word: 'infraestructura', definition: 'Las cosas construidas que hacen falta para vivir, como carreteras o el agua.', example: 'El pueblo mejoró su infraestructura con una carretera nueva.' },
        { word: 'sostenible', definition: 'Que se puede mantener en el tiempo sin dañar las cosas.', example: 'Usar la bici es un transporte sostenible.' },
        { word: 'colaborar', definition: 'Ayudar entre varias personas para conseguir algo juntos.', example: 'Todos colaboraron para organizar la fiesta.' },
        { word: 'representante', definition: 'La persona que habla en nombre de un grupo.', example: 'El representante de los vecinos habló en la reunión.' }
      ]
    },
    {
      id: 'level13',
      name: 'Nivel 13 · Ciencia y el mundo (2)',
      words: [
        { word: 'hipótesis', definition: 'Una idea que se piensa que puede ser verdad, pero aún no se sabe seguro.', example: 'El científico hizo una hipótesis antes del experimento.' },
        { word: 'teoría', definition: 'Una explicación de por qué pasan las cosas, basada en pruebas.', example: 'La teoría explica por qué llueve.' },
        { word: 'fenómeno', definition: 'Algo que pasa en la naturaleza y se puede observar.', example: 'El arcoíris es un fenómeno que pasa cuando llueve y hace sol.' },
        { word: 'ecosistema', definition: 'Todos los seres vivos y el lugar donde viven juntos.', example: 'El bosque es un ecosistema con árboles, animales e insectos.' },
        { word: 'biodiversidad', definition: 'La gran variedad de plantas y animales que hay en un lugar.', example: 'La selva tiene mucha biodiversidad: miles de especies diferentes.' },
        { word: 'clima', definition: 'El tiempo que suele hacer en un lugar durante mucho tiempo.', example: 'El clima de España es cálido en verano.' },
        { word: 'tecnología', definition: 'Las máquinas y herramientas que ayudan a hacer las cosas más fácil.', example: 'El móvil es un ejemplo de tecnología.' },
        { word: 'digital', definition: 'Que funciona con ordenadores o pantallas, no en papel.', example: 'Ahora muchos trámites se hacen de forma digital.' }
      ]
    },
    {
      id: 'level14',
      name: 'Nivel 14 · Ciencia y el mundo (3)',
      words: [
        { word: 'innovador', definition: 'Que trae algo nuevo que no existía antes.', example: 'Ese invento es innovador: nadie lo había hecho antes.' },
        { word: 'globalización', definition: 'Cuando países de todo el mundo están conectados y se parecen más.', example: 'La globalización hace que se pueda comprar de otros países fácilmente.' },
        { word: 'patrimonio', definition: 'Todo lo importante de un lugar que viene del pasado, como monumentos o costumbres.', example: 'La catedral es parte del patrimonio de la ciudad.' },
        { word: 'civilización', definition: 'Un grupo grande de personas que vive de forma organizada, con normas y cultura.', example: 'Los romanos fueron una gran civilización.' },
        { word: 'filosofía', definition: 'La forma de pensar sobre la vida y sus grandes preguntas.', example: 'La filosofía intenta responder qué es la felicidad.' },
        { word: 'ética', definition: 'Lo que se considera bueno o malo hacer.', example: 'Por ética, un médico debe decir la verdad sobre tu salud.' },
        { word: 'empírico', definition: 'Que se sabe porque se ha comprobado, no porque se imagina.', example: 'El resultado es empírico: se comprobó varias veces en el laboratorio.' },
        { word: 'objetivo', definition: 'Que se basa en hechos reales, no en lo que uno siente.', example: 'El árbitro debe ser objetivo y no favorecer a ningún equipo.' }
      ]
    },
    {
      id: 'level15',
      name: 'Nivel 15 · Ciencia y el mundo (4)',
      words: [
        { word: 'subjetivo', definition: 'Que depende de lo que piensa o siente cada persona.', example: 'Que una película sea buena es algo subjetivo.' },
        { word: 'abstracto', definition: 'Que no se puede tocar ni ver, es una idea.', example: 'La libertad es un concepto abstracto.' },
        { word: 'concreto', definition: 'Que es claro y real, no una idea vaga.', example: 'Dame un ejemplo concreto de lo que quieres decir.' },
        { word: 'paradoja', definition: 'Algo que parece imposible o contradictorio, pero puede ser cierto.', example: 'Es una paradoja: cuanto más rápido corres en la cinta, menos avanzas.' },
        { word: 'analogía', definition: 'Comparar dos cosas distintas porque se parecen en algo.', example: 'Explicó el corazón con una analogía: es como una bomba de agua.' },
        { word: 'hermético', definition: 'Que está cerrado del todo, no deja pasar nada.', example: 'El bote es hermético: no entra ni sale aire.' },
        { word: 'sofisticado', definition: 'Que es complicado y avanzado, hecho con mucho cuidado.', example: 'Ese aparato es sofisticado: tiene muchas funciones.' },
        { word: 'autóctono', definition: 'Que es originario del lugar donde vive, no viene de fuera.', example: 'El lince es un animal autóctono de España.' }
      ]
    }
  ],
  en: [
    {
      id: 'level1',
      name: 'Level 1 · Everyday words',
      words: [
        { word: 'meticulous', definition: 'Very careful about small details when doing something.', example: 'Ana is meticulous: she checks her homework twice before handing it in.' },
        { word: 'effective', definition: 'That gets the result you want.', example: 'This soap is effective: it removes stains the first time.' },
        { word: 'ambiguous', definition: 'That can be understood in more than one way, not clear.', example: "His answer was ambiguous: we couldn't tell if it was yes or no." },
        { word: 'scarce', definition: 'When there is very little of something.', example: 'Water is scarce in the desert.' },
        { word: 'occasional', definition: 'That happens sometimes, not every time.', example: 'She has occasional headaches, not every day.' },
        { word: 'essential', definition: "Something you really need, you can't live without it.", example: 'Water is essential for life.' },
        { word: 'everyday', definition: 'That happens every day, normal.', example: 'Brushing your teeth is an everyday task.' },
        { word: 'considerable', definition: 'Quite big or important.', example: 'He won a considerable amount of money in the raffle.' }
      ]
    },
    {
      id: 'level2',
      name: 'Level 2 · Feelings and people',
      words: [
        { word: 'perceptive', definition: 'Quick to notice things, very observant.', example: 'The detective is perceptive: he found the clue no one else saw.' },
        { word: 'reluctant', definition: 'Not wanting to do something, not convinced.', example: 'She was reluctant to try the new food.' },
        { word: 'empathetic', definition: 'That understands and shares what another person feels.', example: 'She is very empathetic: she always knows how you feel.' },
        { word: 'unsociable', definition: "Who doesn't like being around people, prefers to be alone.", example: "The neighbour's cat is unsociable: it hides when visitors come." },
        { word: 'persistent', definition: "That doesn't give up, keeps trying.", example: 'She was persistent and passed the exam on her third try.' },
        { word: 'talkative', definition: 'Who talks a lot and easily.', example: 'My uncle is very talkative: he can talk for hours.' },
        { word: 'calm', definition: 'Relaxed, without nerves.', example: 'He stayed calm even though there was a big problem.' },
        { word: 'indecisive', definition: 'Finds it hard to choose between several options.', example: 'He is indecisive: he took half an hour to choose dessert.' }
      ]
    },
    {
      id: 'level3',
      name: 'Level 3 · Words about the world',
      words: [
        { word: 'fleeting', definition: 'That lasts a very short time.', example: 'The rainbow was fleeting: it disappeared in a minute.' },
        { word: 'scrutiny', definition: 'Looking at something very carefully to check it.', example: 'The votes went through scrutiny before the result was announced.' },
        { word: 'controversy', definition: 'When people disagree and argue about a topic.', example: 'The new law caused controversy: some for it, some against.' },
        { word: 'fair', definition: 'That shares things in a way that is right for everyone.', example: 'The teacher shared out the work fairly among everyone.' },
        { word: 'unambiguous', definition: 'That can only be understood one way, very clear.', example: 'She gave an unambiguous answer: a very clear yes.' },
        { word: 'pragmatic', definition: 'Who looks for practical solutions, without overcomplicating things.', example: 'He was pragmatic: he chose the easiest, fastest solution.' },
        { word: 'divergent', definition: 'That goes in a different direction from the others.', example: 'Their opinions were divergent from the rest of the group.' },
        { word: 'inherent', definition: "That has always been part of something, can't be separated from it.", example: 'Curiosity is inherent in young children.' }
      ]
    },
    {
      id: 'level4',
      name: 'Level 4 · Everyday words (2)',
      words: [
        { word: 'affordable', definition: 'Costs an amount you can pay without trouble.', example: 'This flat is affordable: it costs less than others nearby.' },
        { word: 'convenient', definition: 'Easy to use, at a good time or place.', example: "The bus stop is convenient: it's right outside my house." },
        { word: 'reliable', definition: 'Something you can trust, it does not fail.', example: 'This watch is reliable: it always shows the right time.' },
        { word: 'flexible', definition: 'Can change easily to fit new needs.', example: 'My work schedule is flexible, I can choose my hours.' },
        { word: 'durable', definition: 'Lasts a long time without breaking.', example: "These boots are durable: I've worn them for three years." },
        { word: 'thorough', definition: 'Done carefully, checking every part.', example: 'She did a thorough check before signing the papers.' },
        { word: 'practical', definition: 'Useful and simple, without extra trouble.', example: 'This bag is practical: everything fits inside it.' },
        { word: 'accessible', definition: 'Easy to reach or use for everyone.', example: 'The ramp makes the entrance accessible for wheelchairs.' }
      ]
    },
    {
      id: 'level5',
      name: 'Level 5 · Everyday words (3)',
      words: [
        { word: 'sufficient', definition: 'Just the right amount, enough for what is needed.', example: 'We have sufficient food for the whole week.' },
        { word: 'temporary', definition: 'Lasts only for a short time.', example: "We're living in a temporary flat until ours is fixed." },
        { word: 'gradual', definition: 'Happens little by little, not all at once.', example: 'The change in schedule was gradual, a bit each week.' },
        { word: 'spontaneous', definition: 'Done suddenly, without planning ahead.', example: 'The trip was spontaneous: we decided that same morning.' },
        { word: 'versatile', definition: 'Useful for many different things.', example: 'This tool is versatile: it works for several jobs.' },
        { word: 'moderate', definition: 'Not too much and not too little, balanced.', example: 'He spent a moderate amount on the trip.' },
        { word: 'punctual', definition: 'Arrives at the exact time, not late or early.', example: 'She was punctual: she arrived right at nine.' },
        { word: 'feasible', definition: 'Can really be done, it is possible.', example: 'The plan is feasible if we start this week.' }
      ]
    },
    {
      id: 'level6',
      name: 'Level 6 · Everyday words (4)',
      words: [
        { word: 'genuine', definition: 'Real, not a copy or a fake.', example: 'That painting is a genuine Picasso.' },
        { word: 'tidy', definition: 'Clean and in order, everything in its place.', example: 'He kept his room tidy every day.' },
        { word: 'optional', definition: 'Not required, you can choose it or not.', example: "Dessert is optional; you don't have to have it." },
        { word: 'routine', definition: 'Something done the same way, again and again.', example: 'Putting away the shopping is a routine task at home.' },
        { word: 'reasonable', definition: 'Makes sense and is not too much.', example: 'The ticket price seemed reasonable to me.' },
        { word: 'predictable', definition: 'Can be known before it happens.', example: 'The rain was predictable: the forecast said so this morning.' },
        { word: 'comfortable', definition: 'Makes you feel good, without any trouble.', example: 'This armchair is very comfortable for watching TV.' },
        { word: 'urgent', definition: 'Needs to be done now, it cannot wait.', example: 'The call was urgent: there was a problem at work.' }
      ]
    },
    {
      id: 'level7',
      name: 'Level 7 · Feelings and personality (2)',
      words: [
        { word: 'optimistic', definition: 'Sees the good side of things.', example: "He's optimistic: he believes everything will turn out fine." },
        { word: 'pessimistic', definition: 'Sees the bad side of things.', example: "She's pessimistic: she thinks something will go wrong." },
        { word: 'generous', definition: 'Likes to share what they have with others.', example: 'He was generous: he gave away half of his lunch.' },
        { word: 'humble', definition: "Doesn't boast about what they have or do.", example: "She's humble: she never talks about her awards." },
        { word: 'impulsive', definition: 'Acts fast, without thinking first.', example: 'He was impulsive: he bought the car without checking the price.' },
        { word: 'cautious', definition: 'Thinks carefully before acting, to avoid problems.', example: 'She was cautious: she looked both ways before crossing.' },
        { word: 'curious', definition: 'Wants to learn new things all the time.', example: "He's curious: he always asks how things work." },
        { word: 'resilient', definition: 'Recovers well after something hard happens.', example: 'She was resilient: she tried again after the failure.' }
      ]
    },
    {
      id: 'level8',
      name: 'Level 8 · Feelings and personality (3)',
      words: [
        { word: 'introverted', definition: 'Prefers to be alone or with few people.', example: "He's introverted: he likes staying home reading." },
        { word: 'outgoing', definition: 'Enjoys being around people and talking a lot.', example: "She's outgoing: she knows everyone at the party." },
        { word: 'sensitive', definition: 'Feels emotions easily.', example: "He's sensitive: he cries watching sad films." },
        { word: 'compassionate', definition: "Feels sorry for others' pain and wants to help.", example: 'She was compassionate: she helped the man who had fallen.' },
        { word: 'resentful', definition: "Doesn't forget or forgive when they've been hurt.", example: "He's resentful: he's still angry about something from a year ago." },
        { word: 'affable', definition: 'Treats people well, friendly when talking.', example: 'The neighbour is affable: he always says hello with a smile.' },
        { word: 'selfless', definition: 'Helps others without expecting anything back.', example: 'She was selfless: she gave money without telling anyone.' },
        { word: 'distrustful', definition: "Doesn't easily believe what others say.", example: "He's distrustful: he asks several times before believing something." }
      ]
    },
    {
      id: 'level9',
      name: 'Level 9 · Feelings and personality (4)',
      words: [
        { word: 'enthusiastic', definition: 'Shows a lot of excitement about something.', example: "She's enthusiastic about the new job: she arrives happy every day." },
        { word: 'stubborn', definition: "Won't change their mind even when told they're wrong.", example: 'He was stubborn: he kept his plan even though everyone warned him.' },
        { word: 'helpful', definition: 'Likes to help other people.', example: "He's helpful: he always helps carry the bags." },
        { word: 'vulnerable', definition: 'Can be hurt easily, needs protection.', example: 'Older people are more vulnerable to the cold.' },
        { word: 'assertive', definition: 'Says what they think with respect, without fear.', example: "She was assertive: she said she didn't like the plan without getting angry." },
        { word: 'wistful', definition: 'Feels a soft, quiet sadness, like missing something.', example: 'He felt wistful looking at old photos.' },
        { word: 'cheerful', definition: 'Happy and in a good mood most of the time.', example: "Grandma is cheerful: she's always laughing and telling stories." },
        { word: 'anxious', definition: 'Feels worried or nervous about something that might happen.', example: 'She felt anxious before the job interview.' }
      ]
    },
    {
      id: 'level10',
      name: 'Level 10 · Work and society (1)',
      words: [
        { word: 'shift', definition: 'A block of time a person works.', example: 'Her shift starts at eight in the morning.' },
        { word: 'contract', definition: 'A paper that states the terms of a job or agreement.', example: 'He signed the contract before starting work.' },
        { word: 'wage', definition: 'The money someone earns for working.', example: 'She gets her wage on the last day of the month.' },
        { word: 'budget', definition: 'The money you plan to spend on something.', example: 'We made a budget for the holiday.' },
        { word: 'tax', definition: 'Money paid to the government by law.', example: 'Taxes help pay for hospitals and schools.' },
        { word: 'regulation', definition: 'A set of rules that must be followed.', example: 'The regulation says you must wear a helmet on a bike.' },
        { word: 'procedure', definition: 'A series of steps to get something done officially.', example: 'Getting an ID card is a procedure at the office.' },
        { word: 'application', definition: 'An official paper asking for something.', example: 'She filled in the application to ask for the grant.' }
      ]
    },
    {
      id: 'level11',
      name: 'Level 11 · Work and society (2)',
      words: [
        { word: 'organization', definition: 'A group set up to do something, like a company or charity.', example: 'The bank is an organization that keeps money safe.' },
        { word: 'community', definition: 'A group of people who live in, or share, the same place.', example: 'The whole community helped clean the park.' },
        { word: 'inclusion', definition: 'Making sure everyone can take part, leaving no one out.', example: 'The ramp improves inclusion for wheelchair users.' },
        { word: 'discrimination', definition: 'Treating a person worse because they are different.', example: 'The law forbids discrimination based on where a person is from.' },
        { word: 'independence', definition: "Being able to do things yourself, without others' help.", example: 'Cooking alone gives him more independence.' },
        { word: 'institution', definition: 'A large organization, like the town hall or a hospital.', example: 'The town hall is an institution in the town.' },
        { word: 'citizenship', definition: 'The right and duty to live as part of a country.', example: 'Voting is part of citizenship.' },
        { word: 'legislation', definition: 'The set of laws in a country.', example: "Legislation protects workers' rights." }
      ]
    },
    {
      id: 'level12',
      name: 'Level 12 · Work and society (3)',
      words: [
        { word: 'notice', definition: 'A message telling people about something coming up, like a course.', example: 'The notice for the new course was posted.' },
        { word: 'grant', definition: 'Money given by the government to help do something.', example: 'The group got a grant for the workshop.' },
        { word: 'management', definition: 'Organizing and running the tasks of something well.', example: 'They share the management of the household money.' },
        { word: 'infrastructure', definition: 'The built things a place needs to work, like roads or water.', example: 'The village improved its infrastructure with a new road.' },
        { word: 'sustainable', definition: 'Can be kept going over time without causing harm.', example: 'Riding a bike is sustainable transport.' },
        { word: 'cooperate', definition: 'Work together with others to get something done.', example: 'Everyone cooperated to organize the party.' },
        { word: 'representative', definition: 'The person who speaks for a group.', example: "The residents' representative spoke at the meeting." },
        { word: 'transparency', definition: 'Doing things in a clear way, without hiding anything.', example: 'The club explained with transparency where the money goes.' }
      ]
    },
    {
      id: 'level13',
      name: 'Level 13 · Science and the world (2)',
      words: [
        { word: 'hypothesis', definition: 'An idea thought to be true, but not yet proven.', example: 'The scientist made a hypothesis before the experiment.' },
        { word: 'theory', definition: 'An explanation for why things happen, based on evidence.', example: 'The theory explains why it rains.' },
        { word: 'phenomenon', definition: 'Something that happens in nature and can be observed.', example: 'A rainbow is a phenomenon that happens when it rains and the sun shines.' },
        { word: 'ecosystem', definition: 'All the living things and the place where they live together.', example: 'The forest is an ecosystem with trees, animals, and insects.' },
        { word: 'biodiversity', definition: 'The wide variety of plants and animals in a place.', example: 'The rainforest has great biodiversity: thousands of different species.' },
        { word: 'climate', definition: 'The kind of weather a place usually has over a long time.', example: "Spain's climate is warm in summer." },
        { word: 'technology', definition: 'Machines and tools that help make things easier to do.', example: 'A mobile phone is an example of technology.' },
        { word: 'digital', definition: 'Works with computers or screens, not on paper.', example: 'Now many procedures are done digitally.' }
      ]
    },
    {
      id: 'level14',
      name: 'Level 14 · Science and the world (3)',
      words: [
        { word: 'innovative', definition: "Brings something new that didn't exist before.", example: 'That invention is innovative: no one had made it before.' },
        { word: 'globalization', definition: 'When countries around the world become more connected and alike.', example: 'Globalization makes it easy to buy things from other countries.' },
        { word: 'heritage', definition: 'Everything important from the past that belongs to a place, like buildings or customs.', example: "The cathedral is part of the city's heritage." },
        { word: 'civilization', definition: 'A large group of people living in an organized way, with rules and culture.', example: 'The Romans were a great civilization.' },
        { word: 'philosophy', definition: 'A way of thinking about life and its big questions.', example: 'Philosophy tries to answer what happiness is.' },
        { word: 'ethics', definition: 'What is thought to be right or wrong to do.', example: 'For ethics, a doctor should tell the truth about your health.' },
        { word: 'empirical', definition: 'Known because it has been tested, not just imagined.', example: 'The result is empirical: it was checked several times in the lab.' },
        { word: 'objective', definition: 'Based on real facts, not on what someone feels.', example: 'The referee must be objective and not favour any team.' }
      ]
    },
    {
      id: 'level15',
      name: 'Level 15 · Science and the world (4)',
      words: [
        { word: 'subjective', definition: 'Depends on what each person thinks or feels.', example: 'Whether a film is good is subjective.' },
        { word: 'abstract', definition: 'Cannot be touched or seen, it is an idea.', example: 'Freedom is an abstract concept.' },
        { word: 'concrete', definition: 'Clear and real, not a vague idea.', example: 'Give me a concrete example of what you mean.' },
        { word: 'paradox', definition: 'Something that seems impossible or contradictory, but can be true.', example: "It's a paradox: the faster you run on the treadmill, the less you move forward." },
        { word: 'analogy', definition: 'Comparing two different things because they are alike in some way.', example: "He explained the heart with an analogy: it's like a water pump." },
        { word: 'airtight', definition: 'Closed completely, letting nothing in or out.', example: 'The jar is airtight: no air gets in or out.' },
        { word: 'sophisticated', definition: 'Complicated and advanced, made with great care.', example: 'That device is sophisticated: it has many functions.' },
        { word: 'native', definition: 'Originally from the place where it lives, not from elsewhere.', example: 'The lynx is a native animal of Spain.' }
      ]
    }
  ]
};
