/* ============================================================
   Data: When It's Hard (tolerating frustration, asking for help,
   showing vulnerability).
   Format: DATA.es / DATA.en, each with:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ picto, situacion, opciones: string[3], correcta }] }] }
   Progression (rule 13, one change per level): levels 1-2 keep the
   same task (cope with frustration) and only the trigger gets
   bigger/subtler (losing a game vs. repeated failure, unfairness,
   a broken plan). Levels 3-4 switch task (show vulnerability /
   ask for help) and again escalate from easy asks (not understanding
   a word) to harder ones (crying, fear, trusting again).
   To extend: add items to the matching level's array, in both
   languages. app.js uses DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 6,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Cuando algo no me sale',
        estrellas: 1,
        items: [
          { picto: '🎮', situacion: 'Pierdes una partida de un juego.', opciones: ['Respiras y piensas en intentarlo otra vez', 'Tiras el mando al suelo', 'Dejas de jugar para siempre'], correcta: 0 },
          { picto: '🧱', situacion: 'Se te cae la torre de bloques que estabas montando.', opciones: ['Vuelves a montarla con calma', 'Pateas los bloques', 'Te enfadas con quien esté cerca'], correcta: 0 },
          { picto: '✏️', situacion: 'Te equivocas varias veces en el mismo ejercicio.', opciones: ['Piensas que equivocarse es parte de aprender', 'Rompes la hoja', 'Dices que nunca vas a saber hacerlo'], correcta: 0 },
          { picto: '🚪', situacion: 'Tienes que esperar tu turno en una cola.', opciones: ['Esperas tranquilo/a, aunque cueste un poco', 'Empujas para pasar antes', 'Te enfadas con la gente de la cola'], correcta: 0 },
          { picto: '🧦', situacion: 'No encuentras algo que necesitas y llevas un rato buscando.', opciones: ['Sigues buscando con calma o pides ayuda', 'Tiras las cosas por el suelo', 'Gritas a quien esté cerca'], correcta: 0 },
          { picto: '🖍️', situacion: 'Un dibujo no te sale como querías.', opciones: ['Piensas que puedes intentarlo de otra forma', 'Rompes el dibujo', 'Dices que se te da mal dibujar para siempre'], correcta: 0 },
          { picto: '🍽️', situacion: 'La comida no está como a ti te gusta.', opciones: ['Lo dices con calma o pruebas igualmente', 'Apartas el plato de un golpe', 'Gritas que no vas a comer nunca'], correcta: 0 },
          { picto: '🚲', situacion: 'Te cuesta aprender a hacer algo nuevo, como montar en bici.', opciones: ['Sabes que aprender lleva tiempo', 'Dejas de intentarlo a la primera', 'Te enfadas con la bici'], correcta: 0 },
          { picto: '🏃', situacion: 'Pierdes una carrera contra un amigo.', opciones: ['Le felicitas y sigues jugando', 'Dices que la carrera no vale', 'Te niegas a seguir jugando'], correcta: 0 },
          { picto: '🎲', situacion: 'Sacas mal número en un juego de mesa y pierdes tu turno.', opciones: ['Aceptas que a veces toca perder', 'Tiras los dados lejos', 'Dices que el juego es tonto'], correcta: 0 },
          { picto: '🚌', situacion: 'Pierdes el autobús por unos segundos.', opciones: ['Respiras y esperas el siguiente con calma', 'Pateas la parada', 'Gritas al conductor'], correcta: 0 },
          { picto: '🌱', situacion: 'Tu planta no crece tan rápido como querías.', opciones: ['Sabes que las plantas necesitan tiempo', 'Arrancas la planta enfadado/a', 'Dices que nunca sabrás cuidar plantas'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Cuando la frustración es más grande',
        estrellas: 2,
        items: [
          { picto: '📱', situacion: 'La tablet se queda colgada justo cuando ibas a terminar algo.', opciones: ['Respiras hondo y lo vuelves a intentar', 'Golpeas la pantalla', 'Tiras la tablet'], correcta: 0 },
          { picto: '🔁', situacion: 'Llevas varios días practicando algo y sigue sin salirte.', opciones: ['Sigues practicando a tu ritmo, sin rendirte', 'Piensas que nunca lo vas a conseguir', 'Dejas de intentarlo del todo'], correcta: 0 },
          { picto: '⚖️', situacion: 'Algo te parece injusto, como que otro tenga más tiempo que tú.', opciones: ['Lo dices con calma a una persona de confianza', 'Gritas que no es justo sin parar', 'Rompes algo para desahogarte'], correcta: 0 },
          { picto: '⏳', situacion: 'Tienes que esperar mucho tiempo para algo importante para ti.', opciones: ['Buscas algo tranquilo que hacer mientras esperas', 'Te pones a gritar', 'Molestas a los demás para distraerte'], correcta: 0 },
          { picto: '🧩', situacion: 'Un puzle o un juego es mucho más difícil de lo que pensabas.', opciones: ['Lo dejas a un lado y lo intentas más tarde', 'Lo tiras al suelo enfadado/a', 'Dices que eres tonto/a por no saber hacerlo'], correcta: 0 },
          { picto: '🚗', situacion: 'Un plan que esperabas con ganas se cancela.', opciones: ['Aceptas que a veces los planes cambian', 'Gritas y pataleas', 'Te enfadas con quien te lo dice'], correcta: 0 },
          { picto: '🎯', situacion: 'Fallas varias veces seguidas en algo que se te suele dar bien.', opciones: ['Piensas que hoy no es tu mejor día, y está bien', 'Piensas que ya no vales para eso', 'Culpas a los demás de tu fallo'], correcta: 0 },
          { picto: '🔧', situacion: 'Algo se rompe justo cuando más lo necesitabas.', opciones: ['Buscas ayuda para arreglarlo o buscar otra forma', 'Lo tiras con rabia', 'Gritas que todo te sale mal siempre'], correcta: 0 },
          { picto: '📶', situacion: 'Se corta internet justo cuando estabas jugando online con amigos.', opciones: ['Avisas a tus amigos y esperas con calma', 'Golpeas el router', 'Gritas que internet es una porquería'], correcta: 0 },
          { picto: '🏆', situacion: 'No ganas un premio que esperabas mucho.', opciones: ['Piensas que puedes intentarlo la próxima vez', 'Dices que el concurso es una trampa', 'Te enfadas con quien sí ganó'], correcta: 0 },
          { picto: '🚦', situacion: 'Llegas tarde a algo importante por un atasco o retraso.', opciones: ['Aceptas que hay cosas que no puedes controlar', 'Gritas dentro del coche o autobús', 'Culpas a la persona que conduce'], correcta: 0 },
          { picto: '📅', situacion: 'Cambian de fecha un evento que tenías muchas ganas de ver.', opciones: ['Buscas otra cosa que hacer mientras tanto', 'Te enfadas con quien organiza el evento', 'Dices que ya no te importa nada'], correcta: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Nivel 3',
        descripcion: 'Pedir ayuda está bien',
        estrellas: 3,
        items: [
          { picto: '📖', situacion: 'No entiendes una palabra en un texto que estás leyendo.', opciones: ['Preguntas qué significa esa palabra', 'Sigues leyendo sin entender nada', 'Dices que no te gusta leer nunca'], correcta: 0 },
          { picto: '🧮', situacion: 'No sabes cómo hacer un ejercicio de clase.', opciones: ['Pides ayuda a una persona de confianza o compañero', 'Te quedas callado/a y no entregas nada', 'Dices que no lo vas a hacer nunca'], correcta: 0 },
          { picto: '🥾', situacion: 'Te cuesta atarte los cordones tú solo/a.', opciones: ['Pides ayuda sin que te dé vergüenza', 'Te escondes para que nadie lo vea', 'Dices que no te importan los zapatos'], correcta: 0 },
          { picto: '🧭', situacion: 'Te has perdido y no sabes por dónde ir.', opciones: ['Pides ayuda a una persona de confianza', 'Sigues caminando sin decir nada', 'Te enfadas contigo mismo/a'], correcta: 0 },
          { picto: '🗣️', situacion: 'No entiendes lo que alguien te está explicando.', opciones: ['Pides que te lo expliquen otra vez', 'Dices que sí lo entiendes aunque no sea verdad', 'Te callas y te vas frustrado/a'], correcta: 0 },
          { picto: '🧴', situacion: 'No sabes usar algo nuevo, como una herramienta o un aparato.', opciones: ['Preguntas cómo se usa', 'Lo intentas a lo loco sin preguntar', 'Dices que no sirves para nada nuevo'], correcta: 0 },
          { picto: '🎒', situacion: 'Se te olvida algo importante y no sabes qué hacer.', opciones: ['Se lo cuentas a una persona de confianza', 'Lo escondes para que nadie lo note', 'Te enfadas contigo mismo/a en silencio'], correcta: 0 },
          { picto: '🏫', situacion: 'El primer día en un sitio nuevo no sabes qué hacer.', opciones: ['Preguntas a alguien qué toca hacer', 'Te quedas parado/a sin decir nada', 'Finges que ya sabías todo'], correcta: 0 },
          { picto: '💻', situacion: 'No sabes cómo abrir un archivo o programa en el ordenador.', opciones: ['Preguntas a alguien cómo se hace', 'Aprietas botones al azar y te frustras', 'Dices que la tecnología no es para ti'], correcta: 0 },
          { picto: '🍳', situacion: 'No sabes cómo seguir una receta para cocinar algo.', opciones: ['Pides que te expliquen el paso que no entiendes', 'Improvisas sin preguntar y sale mal', 'Dices que nunca vas a saber cocinar'], correcta: 0 },
          { picto: '🩹', situacion: 'Te haces daño y no sabes qué hacer.', opciones: ['Buscas a una persona de confianza para que te ayude', 'Te aguantas el dolor en silencio', 'Dices que no ha pasado nada aunque duela'], correcta: 0 },
          { picto: '📝', situacion: 'No entiendes las instrucciones de un examen o ejercicio.', opciones: ['Levantas la mano y preguntas', 'Dejas el ejercicio en blanco sin decir nada', 'Copias a otro compañero sin entender'], correcta: 0 }
        ]
      },
      {
        id: 4,
        nombre: 'Nivel 4',
        descripcion: 'Mostrar cómo me siento de verdad',
        estrellas: 4,
        items: [
          { picto: '😢', situacion: 'Tienes ganas de llorar delante de otras personas.', opciones: ['Sabes que llorar está bien, no es debilidad', 'Te escondes para que nadie te vea nunca', 'Finges que no pasa nada aunque te sientas mal'], correcta: 0 },
          { picto: '😨', situacion: 'Tienes miedo de algo y no sabes cómo decirlo.', opciones: ['Le cuentas a alguien de confianza que tienes miedo', 'Finges que no tienes miedo de nada', 'Te lo guardas y te sientes cada vez peor'], correcta: 0 },
          { picto: '🤝', situacion: 'Alguien te hizo daño antes y ahora te cuesta confiar.', opciones: ['Vas confiando poco a poco, a tu ritmo', 'Decides no confiar en nadie nunca más', 'Te enfadas con todo el mundo por lo que pasó'], correcta: 0 },
          { picto: '🙅', situacion: 'Te piden hacer algo que sabes que no puedes hacer todavía.', opciones: ['Dices con calma que todavía no puedes', 'Lo intentas y finges que te sale bien', 'Te enfadas y dices que no quieres hacer nada'], correcta: 0 },
          { picto: '💬', situacion: 'Necesitas contarle a alguien que lo estás pasando mal.', opciones: ['Buscas el momento y se lo cuentas a alguien de confianza', 'Te lo callas para no molestar a nadie', 'Finges que todo va perfecto siempre'], correcta: 0 },
          { picto: '🫂', situacion: 'Alguien te ofrece ayuda cuando estás pasándolo mal.', opciones: ['Aceptas la ayuda, eso también es de valientes', 'Dices que no necesitas nada aunque sí lo necesites', 'Te alejas de esa persona'], correcta: 0 },
          { picto: '🎭', situacion: 'Sientes que tienes que aparentar que todo va bien siempre.', opciones: ['Sabes que puedes mostrar cómo te sientes de verdad', 'Sigues aparentando aunque te canses', 'Te enfadas contigo mismo/a por sentirte así'], correcta: 0 },
          { picto: '🌧️', situacion: 'Tienes un mal día y no te apetece hacer nada.', opciones: ['Está bien tener días así, y lo dices sin esconderlo', 'Finges estar bien para que nadie pregunte', 'Te enfadas contigo mismo/a por sentirte así'], correcta: 0 },
          { picto: '😔', situacion: 'Te sientes triste sin saber muy bien por qué.', opciones: ['Le pones nombre a lo que sientes y lo compartes', 'Te aíslas sin contarle a nadie', 'Dices que estás bien aunque no lo estés'], correcta: 0 },
          { picto: '😡', situacion: 'Sientes mucha rabia y quieres gritar o pegar algo.', opciones: ['Buscas una forma segura de calmarte, como respirar', 'Golpeas lo primero que tienes cerca', 'Te guardas la rabia hasta explotar más tarde'], correcta: 0 },
          { picto: '🥺', situacion: 'Necesitas un abrazo pero te da vergüenza pedirlo.', opciones: ['Se lo pides a alguien de confianza', 'Te quedas con las ganas y te sientes peor', 'Finges que no necesitas cariño nunca'], correcta: 0 },
          { picto: '🫥', situacion: 'Te sientes diferente a los demás y eso te preocupa.', opciones: ['Hablas de ello con alguien que te escuche', 'Te escondes para que nadie lo note', 'Finges ser alguien que no eres'], correcta: 0 }
        ]
      }
    ]
  },
  en: {
    porRonda: 6,
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: "When something doesn't work out",
        estrellas: 1,
        items: [
          { picto: '🎮', situacion: 'You lose a round of a game.', opciones: ['You breathe and think about trying again', 'You throw the controller on the floor', 'You stop playing forever'], correcta: 0 },
          { picto: '🧱', situacion: 'The block tower you were building falls down.', opciones: ['You calmly build it again', 'You kick the blocks', 'You get angry at whoever is nearby'], correcta: 0 },
          { picto: '✏️', situacion: 'You get the same exercise wrong several times.', opciones: ['You think making mistakes is part of learning', 'You tear up the page', 'You say you will never know how to do it'], correcta: 0 },
          { picto: '🚪', situacion: 'You have to wait your turn in a line.', opciones: ['You wait calmly, even if it is a bit hard', 'You push to go first', 'You get angry at the people in line'], correcta: 0 },
          { picto: '🧦', situacion: 'You cannot find something you need and have been looking for a while.', opciones: ['You keep looking calmly or ask for help', 'You throw things on the floor', 'You shout at whoever is nearby'], correcta: 0 },
          { picto: '🖍️', situacion: 'A drawing does not come out the way you wanted.', opciones: ['You think you can try it a different way', 'You tear up the drawing', 'You say you will always be bad at drawing'], correcta: 0 },
          { picto: '🍽️', situacion: 'The food is not the way you like it.', opciones: ['You say so calmly or eat it anyway', 'You push the plate away roughly', 'You shout that you will never eat'], correcta: 0 },
          { picto: '🚲', situacion: 'Learning something new, like riding a bike, is hard for you.', opciones: ['You know learning takes time', 'You give up after the first try', 'You get angry at the bike'], correcta: 0 },
          { picto: '🏃', situacion: 'You lose a race against a friend.', opciones: ['You congratulate them and keep playing', 'You say the race did not count', 'You refuse to keep playing'], correcta: 0 },
          { picto: '🎲', situacion: 'You roll badly in a board game and lose your turn.', opciones: ['You accept that sometimes you lose', 'You throw the dice away', 'You say the game is silly'], correcta: 0 },
          { picto: '🚌', situacion: 'You miss the bus by a few seconds.', opciones: ['You breathe and calmly wait for the next one', 'You kick the bus stop', 'You shout at the driver'], correcta: 0 },
          { picto: '🌱', situacion: 'Your plant is not growing as fast as you wanted.', opciones: ['You know plants need time', 'You pull out the plant, angry', 'You say you will never know how to care for plants'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'When frustration gets bigger',
        estrellas: 2,
        items: [
          { picto: '📱', situacion: 'The tablet freezes right when you were about to finish something.', opciones: ['You take a deep breath and try again', 'You hit the screen', 'You throw the tablet'], correcta: 0 },
          { picto: '🔁', situacion: 'You have been practising something for days and it still is not working.', opciones: ['You keep practising at your own pace, without giving up', 'You think you will never manage it', 'You stop trying completely'], correcta: 0 },
          { picto: '⚖️', situacion: 'Something feels unfair, like someone else getting more time than you.', opciones: ['You calmly tell a trusted person', 'You keep shouting that it is not fair', 'You break something to let it out'], correcta: 0 },
          { picto: '⏳', situacion: 'You have to wait a long time for something important to you.', opciones: ['You find something calm to do while you wait', 'You start shouting', 'You bother others to distract yourself'], correcta: 0 },
          { picto: '🧩', situacion: 'A puzzle or game is much harder than you thought.', opciones: ['You set it aside and try again later', 'You throw it on the floor, angry', 'You say you are stupid for not knowing how to do it'], correcta: 0 },
          { picto: '🚗', situacion: 'A plan you were looking forward to gets cancelled.', opciones: ['You accept that plans sometimes change', 'You shout and stomp your feet', 'You get angry at whoever tells you'], correcta: 0 },
          { picto: '🎯', situacion: 'You miss several times in a row at something you are usually good at.', opciones: ['You think today is not your best day, and that is fine', 'You think you are no good at it anymore', 'You blame others for your mistake'], correcta: 0 },
          { picto: '🔧', situacion: 'Something breaks right when you needed it most.', opciones: ['You look for help fixing it or another way to do it', 'You throw it down in anger', 'You shout that everything always goes wrong for you'], correcta: 0 },
          { picto: '📶', situacion: 'The internet cuts out right when you were playing online with friends.', opciones: ['You let your friends know and wait calmly', 'You hit the router', 'You shout that the internet is useless'], correcta: 0 },
          { picto: '🏆', situacion: 'You do not win a prize you were hoping for.', opciones: ['You think you can try again next time', 'You say the contest was rigged', 'You get angry at whoever won'], correcta: 0 },
          { picto: '🚦', situacion: 'You are late for something important because of traffic or a delay.', opciones: ['You accept that some things are out of your control', 'You shout inside the car or bus', 'You blame the driver'], correcta: 0 },
          { picto: '📅', situacion: 'An event you were really looking forward to gets rescheduled.', opciones: ['You find something else to do meanwhile', 'You get angry at the organisers', 'You say you no longer care about anything'], correcta: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Level 3',
        descripcion: 'Asking for help is okay',
        estrellas: 3,
        items: [
          { picto: '📖', situacion: 'You do not understand a word in something you are reading.', opciones: ['You ask what that word means', 'You keep reading without understanding anything', 'You say you will never like reading'], correcta: 0 },
          { picto: '🧮', situacion: 'You do not know how to do a class exercise.', opciones: ['You ask a trusted person or classmate for help', 'You stay quiet and hand in nothing', 'You say you will never do it'], correcta: 0 },
          { picto: '🥾', situacion: 'Tying your own shoelaces is hard for you.', opciones: ['You ask for help without feeling ashamed', 'You hide so nobody sees', 'You say you do not care about shoes'], correcta: 0 },
          { picto: '🧭', situacion: 'You are lost and do not know which way to go.', opciones: ['You ask a trusted person for help', 'You keep walking without saying anything', 'You get angry with yourself'], correcta: 0 },
          { picto: '🗣️', situacion: 'You do not understand what someone is explaining to you.', opciones: ['You ask them to explain it again', "You say you understand even though you don't", 'You go quiet and walk away, frustrated'], correcta: 0 },
          { picto: '🧴', situacion: 'You do not know how to use something new, like a tool or a device.', opciones: ['You ask how it works', 'You try it randomly without asking', 'You say you are no good at anything new'], correcta: 0 },
          { picto: '🎒', situacion: 'You forget something important and do not know what to do.', opciones: ['You tell a trusted person about it', 'You hide it so nobody notices', 'You get angry with yourself in silence'], correcta: 0 },
          { picto: '🏫', situacion: 'On your first day somewhere new, you do not know what to do.', opciones: ['You ask someone what you are supposed to do', 'You freeze and say nothing', 'You pretend you already knew everything'], correcta: 0 },
          { picto: '💻', situacion: 'You do not know how to open a file or program on the computer.', opciones: ['You ask someone how to do it', 'You press buttons at random and get frustrated', 'You say technology is not for you'], correcta: 0 },
          { picto: '🍳', situacion: 'You do not know how to follow a recipe to cook something.', opciones: ['You ask about the step you do not understand', 'You improvise without asking and it goes wrong', 'You say you will never know how to cook'], correcta: 0 },
          { picto: '🩹', situacion: 'You hurt yourself and do not know what to do.', opciones: ['You find a trusted person to help you', 'You bear the pain in silence', 'You say nothing happened even though it hurts'], correcta: 0 },
          { picto: '📝', situacion: 'You do not understand the instructions for a test or exercise.', opciones: ['You raise your hand and ask', 'You leave the exercise blank without saying anything', 'You copy a classmate without understanding'], correcta: 0 }
        ]
      },
      {
        id: 4,
        nombre: 'Level 4',
        descripcion: 'Showing how I truly feel',
        estrellas: 4,
        items: [
          { picto: '😢', situacion: 'You feel like crying in front of other people.', opciones: ['You know crying is okay, it is not weakness', 'You hide so nobody ever sees you', 'You pretend nothing is wrong even though you feel bad'], correcta: 0 },
          { picto: '😨', situacion: 'You are scared of something and do not know how to say it.', opciones: ['You tell someone you trust that you are scared', 'You pretend you are not scared of anything', 'You keep it to yourself and feel worse and worse'], correcta: 0 },
          { picto: '🤝', situacion: 'Someone hurt you before and now it is hard to trust.', opciones: ['You trust little by little, at your own pace', 'You decide never to trust anyone again', 'You get angry at everyone because of what happened'], correcta: 0 },
          { picto: '🙅', situacion: 'Someone asks you to do something you know you cannot do yet.', opciones: ['You calmly say you cannot do it yet', 'You try it and pretend it is going well', "You get angry and say you don't want to do anything"], correcta: 0 },
          { picto: '💬', situacion: 'You need to tell someone you are having a hard time.', opciones: ['You find the moment and tell someone you trust', 'You keep it to yourself so as not to bother anyone', 'You pretend everything is always perfect'], correcta: 0 },
          { picto: '🫂', situacion: 'Someone offers to help you when you are struggling.', opciones: ['You accept the help, that takes courage too', 'You say you need nothing even though you do', 'You pull away from that person'], correcta: 0 },
          { picto: '🎭', situacion: 'You feel like you have to pretend everything is fine all the time.', opciones: ['You know you can show how you truly feel', 'You keep pretending even though it tires you', 'You get angry with yourself for feeling this way'], correcta: 0 },
          { picto: '🌧️', situacion: 'You are having a bad day and do not feel like doing anything.', opciones: ['It is okay to have days like this, and you say so without hiding it', 'You pretend to be fine so nobody asks', 'You get angry with yourself for feeling this way'], correcta: 0 },
          { picto: '😔', situacion: 'You feel sad without really knowing why.', opciones: ['You name what you feel and share it', 'You isolate yourself without telling anyone', 'You say you are fine even though you are not'], correcta: 0 },
          { picto: '😡', situacion: 'You feel a lot of anger and want to shout or hit something.', opciones: ['You look for a safe way to calm down, like breathing', 'You hit whatever is nearby', 'You keep the anger in until you explode later'], correcta: 0 },
          { picto: '🥺', situacion: 'You need a hug but feel too embarrassed to ask.', opciones: ['You ask someone you trust for one', 'You keep the feeling inside and feel worse', 'You pretend you never need affection'], correcta: 0 },
          { picto: '🫥', situacion: 'You feel different from everyone else and it worries you.', opciones: ['You talk about it with someone who will listen', 'You hide so nobody notices', 'You pretend to be someone you are not'], correcta: 0 }
        ]
      }
    ]
  }
};
