/* ============================================================
   Data: This Is Me (self-esteem, self-acceptance, response to
   people who exclude, mock or compare).
   Format: DATA.es / DATA.en, each with:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ picto, situacion, opciones: string[3], correcta }] }] }
   Progression (rule 13, one change per level): the task never
   changes (choose the response that reflects healthy self-esteem);
   only the social difficulty of the situation escalates. Level 1
   is your own mistakes and strengths/weaknesses. Level 2 is a
   difference observed in someone else. Level 3 is an insensitive
   person who insults, mocks or excludes. Level 4 is subtler
   pressure: comparison and the wish for recognition.
   Per SPEC.md §3.3 the UI must never label the reader with clinical
   terms such as "disability". Level 2 and Level 3 situations are
   framed in everyday life so the reader can practise the same
   healthy self-esteem without being put in a clinical box.
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
        descripcion: 'Me acepto como soy',
        estrellas: 1,
        items: [
          { picto: '🎨', situacion: 'Dibujas fatal, pero cantas muy bien.', opciones: ['Cada persona es buena en cosas distintas', 'Eso significa que no sirves para nada', 'Dejas de intentar cosas nuevas'], correcta: 0 },
          { picto: '🧮', situacion: 'Te cuesta hacer cuentas, pero se te da genial ayudar a los demás.', opciones: ['Tienes tus propias fortalezas', 'Eres tonto/a por no saber cuentas', 'Te escondes para que nadie te vea'], correcta: 0 },
          { picto: '🏃', situacion: 'Corres más despacio que tus amigos en la carrera.', opciones: ['Vas a tu ritmo y eso está bien', 'Dejas de correr para siempre', 'Te enfadas con quien llega antes'], correcta: 0 },
          { picto: '👏', situacion: 'Un profesor te felicita por tu dibujo.', opciones: ['Le das las gracias y te alegras', 'Dices que seguro que está mal', 'Le dices que no te importa'], correcta: 0 },
          { picto: '✏️', situacion: 'Te equivocas al escribir una palabra difícil.', opciones: ['Piensas que equivocarse es parte de aprender', 'Piensas que eres tonto/a por fallar', 'Rompes el papel y lo dejas'], correcta: 0 },
          { picto: '🎵', situacion: 'No sabes tocar ningún instrumento, pero cocinas muy bien.', opciones: ['Cada persona destaca en algo distinto', 'Te sientes menos que los demás', 'Dices que la música no sirve para nada'], correcta: 0 },
          { picto: '🧩', situacion: 'Tardas más que otros en montar un puzle.', opciones: ['Terminarlo a tu ritmo también cuenta', 'Dejas el puzle a medias, enfadado/a', 'Piensas que nunca haces nada bien'], correcta: 0 },
          { picto: '🌟', situacion: 'Hoy no te ha salido bien algo que intentabas.', opciones: ['Recuerdas otras cosas que sí te salen bien', 'Piensas que no vales para nada', 'Decides no volver a intentarlo nunca'], correcta: 0 },
          { picto: '⚽', situacion: 'Se te da fatal el fútbol, pero bailas genial.', opciones: ['Cada persona tiene su punto fuerte', 'Piensas que no vales para el deporte', 'Dejas de jugar con tus amigos para siempre'], correcta: 0 },
          { picto: '🧵', situacion: 'No sabes coser un botón, pero se te da genial arreglar cosas con las manos.', opciones: ['Sabes que nadie es bueno en todo', 'Piensas que eres un desastre', 'Te enfadas contigo mismo/a'], correcta: 0 },
          { picto: '📐', situacion: 'Te cuesta mucho la geometría, pero escribes historias preciosas.', opciones: ['Valoras lo que sí se te da bien', 'Piensas que no sirves para estudiar', 'Dejas de intentarlo en todas las asignaturas'], correcta: 0 },
          { picto: '🎤', situacion: 'Cantas fatal, pero cuentas los mejores chistes de tu grupo.', opciones: ['Cada persona destaca en algo diferente', 'Dejas de hablar en el grupo por vergüenza', 'Piensas que no vales para hacer reír a nadie'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Cada persona es diferente',
        estrellas: 2,
        items: [
          { picto: '🦽', situacion: 'Un compañero del barrio se mueve en silla de ruedas y no puede subir unos escalones.', opciones: ['Buscáis juntos un camino sin escalones', 'Le dices que no puede venir con vosotros', 'Os reís de cómo se mueve'], correcta: 0 },
          { picto: '👂', situacion: 'Una amiga te pide que le hables más despacio para entenderte mejor.', opciones: ['Le hablas más despacio sin problema', 'Dejas de hablar con ella', 'Te enfadas porque tarda en entender'], correcta: 0 },
          { picto: '📖', situacion: 'A un compañero le cuesta leer y necesita más tiempo en el examen.', opciones: ['Es normal, cada persona aprende a su ritmo', 'Piensas que es menos inteligente', 'Le dices que se dé prisa'], correcta: 0 },
          { picto: '🗣️', situacion: 'Alguien habla de forma distinta y cuesta un poco entenderle al principio.', opciones: ['Escuchas con paciencia y le entiendes bien', 'Te ríes de cómo habla', 'Dejas de escucharle'], correcta: 0 },
          { picto: '🧠', situacion: 'Hay una tarea nueva que te cuesta mucho y necesitas que te la expliquen otra vez.', opciones: ['Pedir que te la expliquen otra vez está bien', 'Piensas que eso te hace menos que los demás', 'Te escondes para que nadie te vea'], correcta: 0 },
          { picto: '🚸', situacion: 'Un niño se queda mirando fijamente a un compañero que viste de forma muy distinta.', opciones: ['Le explicas con calma que todos somos distintos', 'Te ríes también del compañero', 'Apartas la mirada y no dices nada'], correcta: 0 },
          { picto: '🖊️', situacion: 'Necesitas gafas para leer la pizarra desde tu sitio.', opciones: ['Usar las gafas que necesitas está bien', 'Te avergüenzas de ponértelas', 'Finges que no las necesitas'], correcta: 0 },
          { picto: '🤝', situacion: 'Un compañero al que no conocéis bien quiere jugar con vosotros al mismo juego.', opciones: ['Le explicáis las reglas y jugáis juntos', 'Le decís que ese juego no es para él', 'Os vais a jugar a otro sitio'], correcta: 0 },
          { picto: '🍽️', situacion: 'Un compañero no puede comer algunos alimentos y pide un menú distinto.', opciones: ['Es normal, cada persona tiene sus necesidades', 'Te burlas de lo que come', 'Le dices que coma lo mismo que todos'], correcta: 0 },
          { picto: '🌍', situacion: 'Un compañero nuevo habla otro idioma y todavía no entiende bien el tuyo.', opciones: ['Le ayudas con paciencia a entenderte', 'Te ríes de cómo habla', 'Dejas de hablar con él'], correcta: 0 },
          { picto: '🎧', situacion: 'A un compañero le molestan mucho los ruidos fuertes y se tapa los oídos.', opciones: ['Respetas lo que necesita sin hacer burla', 'Le dices que exagera', 'Haces ruido a propósito para molestarle'], correcta: 0 },
          { picto: '🧑‍🦰', situacion: 'Un compañero tiene una manera de vestir muy distinta a la de los demás.', opciones: ['Piensas que cada persona puede vestir como quiera', 'Te ríes de su ropa', 'Le dices que se vista como los demás'], correcta: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Nivel 3',
        descripcion: 'Gente que no sabe aceptar a los demás',
        estrellas: 3,
        items: [
          { picto: '😠', situacion: "Un compañero te llama 'tonto/a' porque te has equivocado.", opciones: ['Sabes que equivocarte no te hace tonto/a', 'Piensas que tiene razón', 'Le insultas también más fuerte'], correcta: 0 },
          { picto: '🚫', situacion: 'Un grupo no te deja jugar porque haces las cosas de forma distinta.', opciones: ['Buscas otro grupo o se lo cuentas a una persona de confianza', 'Piensas que no vales para jugar con nadie', 'Te enfadas y empujas a alguien'], correcta: 0 },
          { picto: '😏', situacion: 'Alguien se ríe de ti porque necesitas ayuda para algo.', opciones: ['Sabes que pedir ayuda no es motivo de burla', 'Dejas de pedir ayuda aunque la necesites', 'Te ríes tú también de esa persona'], correcta: 0 },
          { picto: '🗯️', situacion: "Un compañero repite varias veces que 'no sirves para nada'.", opciones: ['Sabes que eso no es verdad y se lo cuentas a una persona de confianza', 'Empiezas a creer que es verdad', 'Le gritas delante de todos'], correcta: 0 },
          { picto: '🙅', situacion: 'Te excluyen de un grupo de trabajo porque dicen que eres muy diferente.', opciones: ['Pides ayuda a una persona de confianza', 'Piensas que es normal que te excluyan', 'Dejas de ir a clase'], correcta: 0 },
          { picto: '🤳', situacion: 'Alguien hace una broma sobre cómo hablas o te mueves.', opciones: ['Sabes que esa broma no dice nada de tu valor', 'Te sientes avergonzado/a para siempre', 'Le devuelves la broma con un insulto'], correcta: 0 },
          { picto: '📣', situacion: "Un compañero dice delante de todos que eres 'diferente' para burlarse.", opciones: ['Sabes que ser diferente no es malo', 'Te escondes en el recreo a partir de ahora', 'Le insultas para defenderte'], correcta: 0 },
          { picto: '🧍', situacion: 'Nadie te elige para el equipo por ser más lento/a.', opciones: ['Se lo cuentas a una persona de confianza y sigues participando', 'Piensas que nunca vas a valer para nada', 'Dejas de intentarlo en cualquier equipo'], correcta: 0 },
          { picto: '🚷', situacion: 'Un grupo se aleja de ti cada vez que te acercas, sin explicar por qué.', opciones: ['Se lo cuento a una persona de confianza y busco otro grupo', 'Pienso que hago algo mal siempre', 'Dejo de acercarme a nadie nunca más'], correcta: 0 },
          { picto: '📵', situacion: 'Alguien te pone motes feos delante de otras personas.', opciones: ['Sé que un mote feo no dice quién soy', 'Empiezo a creer que es verdad', 'Le pongo un mote feo también'], correcta: 0 },
          { picto: '🖍️', situacion: 'Se ríen de tu forma de dibujar o de hacer algo a tu manera.', opciones: ['Sé que hacerlo a mi manera también vale', 'Dejo de dibujar para siempre', 'Rompo el dibujo de quien se ríe'], correcta: 0 },
          { picto: '🎒', situacion: 'Un compañero esconde tus cosas para reírse de ti.', opciones: ['Se lo cuento a una persona de confianza', 'Pienso que me lo merezco', 'Escondo también las cosas de otros'], correcta: 0 }
        ]
      },
      {
        id: 4,
        nombre: 'Nivel 4',
        descripcion: 'Sigo mi propio camino',
        estrellas: 4,
        items: [
          { picto: '🏆', situacion: 'Terminas una tarea difícil pero nadie te felicita por ello.', opciones: ['Te sientes orgulloso/a de tu propio esfuerzo', 'Piensas que no ha servido de nada', 'Dejas de esforzarte la próxima vez'], correcta: 0 },
          { picto: '👀', situacion: 'Un familiar compara tus notas con las de otro niño.', opciones: ['Sabes que tu camino no tiene que ser igual al de otros', 'Piensas que vales menos que el otro niño', 'Te enfadas con el otro niño'], correcta: 0 },
          { picto: '🎯', situacion: 'Eliges una afición que a tu familia no le entusiasma.', opciones: ['Sigues con lo que a ti te gusta de verdad', 'Dejas esa afición para que estén contentos', 'Te escondes para practicarla a solas'], correcta: 0 },
          { picto: '📱', situacion: "En redes ves que otros reciben muchos más 'me gusta' que tú.", opciones: ['Sabes que tu valor no depende de eso', 'Piensas que eso significa que no vales', 'Dejas de publicar nada nunca más'], correcta: 0 },
          { picto: '🐢', situacion: 'Avanzas más despacio que otros en un curso o taller.', opciones: ['Sigues a tu ritmo, sin compararte', 'Piensas que deberías dejarlo por ir lento/a', 'Te enfadas con quien va más rápido'], correcta: 0 },
          { picto: '🎨', situacion: 'Haces algo de una forma distinta a como lo hacen los demás.', opciones: ['Tu forma también es una forma válida', 'Cambias todo para parecerte a los demás', 'Piensas que tu forma está mal'], correcta: 0 },
          { picto: '🌈', situacion: 'Nadie aplaude tu esfuerzo, pero tú sabes que lo has dado todo.', opciones: ['Eso ya es motivo suficiente para sentirte bien', 'Piensas que esforzarte no sirve de nada', 'Dejas de esforzarte si nadie lo ve'], correcta: 0 },
          { picto: '🧭', situacion: 'Tienes que decidir algo importante y no todos están de acuerdo contigo.', opciones: ['Confías en lo que tú sientes que es mejor', 'Cambias de idea solo para que te acepten', 'Te enfadas con quien no está de acuerdo'], correcta: 0 },
          { picto: '📚', situacion: 'Un familiar dice que deberías estudiar algo distinto a lo que te gusta.', opciones: ['Sigo lo que de verdad me interesa a mí', 'Cambio de idea solo para no discutir', 'Dejo de contar lo que me gusta a mi familia'], correcta: 0 },
          { picto: '🕺', situacion: 'Te apetece bailar de una forma diferente a como bailan los demás.', opciones: ['Bailo a mi manera y disfruto', 'Copio exactamente a los demás para encajar', 'Dejo de bailar para que no me miren'], correcta: 0 },
          { picto: '🥗', situacion: 'Eliges una afición o costumbre que a tus amigos les parece rara.', opciones: ['Sigo con lo que a mí me gusta de verdad', 'Lo dejo para que no piensen que soy raro/a', 'Me enfado con quien opina distinto'], correcta: 0 },
          { picto: '🏅', situacion: 'Consigues algo importante para ti, pero nadie más le da valor.', opciones: ['Yo sé el esfuerzo que me ha costado, y eso vale', 'Pienso que entonces no ha valido para nada', 'Dejo de esforzarme la próxima vez'], correcta: 0 }
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
        descripcion: 'I accept myself as I am',
        estrellas: 1,
        items: [
          { picto: '🎨', situacion: 'You draw badly, but you sing really well.', opciones: ['Everyone is good at different things', 'That means you are no good at all', 'You give up trying new things'], correcta: 0 },
          { picto: '🧮', situacion: 'Maths is hard for you, but you are great at helping others.', opciones: ['You have your own strengths', 'You are stupid for not knowing maths', 'You hide so nobody sees you'], correcta: 0 },
          { picto: '🏃', situacion: 'You run slower than your friends in the race.', opciones: ['You go at your own pace, and that is fine', 'You stop running forever', 'You get angry with whoever finishes first'], correcta: 0 },
          { picto: '👏', situacion: 'A teacher praises your drawing.', opciones: ['You say thank you and feel happy', 'You say it is probably wrong', 'You tell them you do not care'], correcta: 0 },
          { picto: '✏️', situacion: 'You misspell a difficult word.', opciones: ['You think making mistakes is part of learning', 'You think you are stupid for getting it wrong', 'You tear up the paper and give up'], correcta: 0 },
          { picto: '🎵', situacion: 'You cannot play any instrument, but you cook really well.', opciones: ['Everyone is good at different things', 'You feel less than everyone else', 'You say music is useless'], correcta: 0 },
          { picto: '🧩', situacion: 'You take longer than others to finish a puzzle.', opciones: ['Finishing at your own pace counts too', 'You leave the puzzle unfinished, upset', 'You think you never do anything right'], correcta: 0 },
          { picto: '🌟', situacion: 'Something you tried today did not work out.', opciones: ['You remember other things you are good at', 'You think you are worthless', 'You decide never to try again'], correcta: 0 },
          { picto: '⚽', situacion: 'You are terrible at football, but you dance great.', opciones: ['Everyone has their own strengths', 'You think you are no good at sports', 'You stop playing with your friends forever'], correcta: 0 },
          { picto: '🧵', situacion: 'You cannot sew a button, but you are great at fixing things with your hands.', opciones: ['You know nobody is good at everything', 'You think you are hopeless', 'You get angry at yourself'], correcta: 0 },
          { picto: '📐', situacion: 'Geometry is really hard for you, but you write beautiful stories.', opciones: ['You value what you are good at', 'You think you are no good at studying', 'You give up trying in every subject'], correcta: 0 },
          { picto: '🎤', situacion: 'You sing badly, but you tell the best jokes in your group.', opciones: ['Everyone stands out at something different', 'You stop talking in the group out of embarrassment', 'You think you cannot make anyone laugh'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Everyone is different',
        estrellas: 2,
        items: [
          { picto: '🦽', situacion: 'A neighbour moves in a wheelchair and cannot climb a few steps.', opciones: ['You look together for a path without steps', 'You tell them they cannot come with you', 'You laugh at how they move'], correcta: 0 },
          { picto: '👂', situacion: 'A friend asks you to speak more slowly to understand you better.', opciones: ['You speak more slowly, no problem', 'You stop talking to her', 'You get annoyed that she takes time to understand'], correcta: 0 },
          { picto: '📖', situacion: 'A classmate finds reading hard and needs more time in the exam.', opciones: ['That is normal, everyone learns at their own pace', 'You think they are less intelligent', 'You tell them to hurry up'], correcta: 0 },
          { picto: '🗣️', situacion: 'Someone speaks differently and it takes a moment to understand them.', opciones: ['You listen patiently and understand them well', 'You laugh at how they speak', 'You stop listening to them'], correcta: 0 },
          { picto: '🧠', situacion: 'There is a new task that is hard for you and you need it explained again.', opciones: ['Asking for an explanation again is fine', 'You think that makes you less than the others', 'You hide so nobody sees you'], correcta: 0 },
          { picto: '🚸', situacion: 'A child stares at a classmate who dresses in a very different way.', opciones: ['You calmly explain that everyone is different', 'You laugh at the classmate too', 'You look away and say nothing'], correcta: 0 },
          { picto: '🖊️', situacion: 'You need glasses to read the board from your seat.', opciones: ['Wearing the glasses you need is fine', 'You feel ashamed to wear them', 'You pretend you do not need them'], correcta: 0 },
          { picto: '🤝', situacion: 'A classmate you do not know well wants to play the same game with you.', opciones: ['You explain the rules and play together', 'You tell them that game is not for them', 'You go and play somewhere else'], correcta: 0 },
          { picto: '🍽️', situacion: 'A classmate cannot eat certain foods and asks for a different menu.', opciones: ["That is normal, everyone has their own needs", 'You make fun of what they eat', 'You tell them to eat the same as everyone'], correcta: 0 },
          { picto: '🌍', situacion: 'A new classmate speaks another language and does not understand yours well yet.', opciones: ['You patiently help them understand you', 'You laugh at how they speak', 'You stop talking to them'], correcta: 0 },
          { picto: '🎧', situacion: 'Loud noises really bother a classmate and they cover their ears.', opciones: ['You respect what they need without mocking them', 'You tell them they are overreacting', 'You make noise on purpose to bother them'], correcta: 0 },
          { picto: '🧑‍🦰', situacion: 'A classmate dresses very differently from everyone else.', opciones: ['You think everyone can dress how they want', 'You laugh at their clothes', 'You tell them to dress like everyone else'], correcta: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Level 3',
        descripcion: 'People who cannot accept others',
        estrellas: 3,
        items: [
          { picto: '😠', situacion: "A classmate calls you 'stupid' because you made a mistake.", opciones: ['You know a mistake does not make you stupid', 'You think they are right', 'You insult them back even harder'], correcta: 0 },
          { picto: '🚫', situacion: 'A group will not let you play because you do things differently.', opciones: ['You find another group or tell a trusted person', 'You think you are not fit to play with anyone', 'You get angry and push someone'], correcta: 0 },
          { picto: '😏', situacion: 'Someone laughs at you because you need help with something.', opciones: ['You know asking for help is not something to mock', 'You stop asking for help even when you need it', 'You laugh at that person too'], correcta: 0 },
          { picto: '🗯️', situacion: "A classmate keeps saying you are 'no good at anything'.", opciones: ['You know that is not true and tell a trusted person', 'You start believing it is true', 'You shout at them in front of everyone'], correcta: 0 },
          { picto: '🙅', situacion: 'You are left out of a group project because they say you are too different.', opciones: ['You ask a trusted person for help', 'You think it is normal to be left out', 'You stop going to class'], correcta: 0 },
          { picto: '🤳', situacion: 'Someone jokes about how you talk or move.', opciones: ['You know that joke says nothing about your worth', 'You feel ashamed forever', 'You mock them back with an insult'], correcta: 0 },
          { picto: '📣', situacion: "A classmate calls you 'different' in front of everyone to mock you.", opciones: ['You know being different is not a bad thing', 'You start hiding at break time from now on', 'You insult them to defend yourself'], correcta: 0 },
          { picto: '🧍', situacion: 'Nobody picks you for the team because you are slower.', opciones: ['You tell a trusted person and keep taking part', 'You think you will never be good enough', 'You stop trying in any team'], correcta: 0 },
          { picto: '🚷', situacion: 'A group moves away every time you come closer, without explaining why.', opciones: ['I tell a trusted person and look for another group', 'I think I always do something wrong', 'I stop approaching anyone ever again'], correcta: 0 },
          { picto: '📵', situacion: 'Someone calls you ugly nicknames in front of others.', opciones: ['I know an ugly nickname does not say who I am', 'I start believing it is true', 'I call them an ugly nickname too'], correcta: 0 },
          { picto: '🖍️', situacion: 'People laugh at your way of drawing or doing something your own way.', opciones: ['I know doing it my own way is fine too', 'I stop drawing forever', 'I tear up the drawing of whoever laughs'], correcta: 0 },
          { picto: '🎒', situacion: 'A classmate hides your things to laugh at you.', opciones: ['I tell a trusted person', 'I think I deserve it', "I hide other people's things too"], correcta: 0 }
        ]
      },
      {
        id: 4,
        nombre: 'Level 4',
        descripcion: 'I follow my own path',
        estrellas: 4,
        items: [
          { picto: '🏆', situacion: 'You finish a hard task but nobody congratulates you.', opciones: ['You feel proud of your own effort', 'You think it was pointless', 'You stop trying hard next time'], correcta: 0 },
          { picto: '👀', situacion: "A family member compares your grades to another child's.", opciones: ['You know your path does not have to match theirs', 'You think you are worth less than the other child', 'You get angry with the other child'], correcta: 0 },
          { picto: '🎯', situacion: 'You choose a hobby your family is not excited about.', opciones: ['You keep doing what you truly enjoy', 'You give up the hobby to keep them happy', 'You hide to practise it alone'], correcta: 0 },
          { picto: '📱', situacion: 'Online you see others get many more likes than you.', opciones: ['You know your worth does not depend on that', 'You think that means you are worthless', 'You stop posting anything ever again'], correcta: 0 },
          { picto: '🐢', situacion: 'You progress more slowly than others in a class or workshop.', opciones: ['You keep going at your own pace, without comparing', 'You think you should quit for being slow', 'You get angry with whoever is faster'], correcta: 0 },
          { picto: '🎨', situacion: 'You do something in a different way from everyone else.', opciones: ['Your way is a valid way too', 'You change everything to be like the others', 'You think your way is wrong'], correcta: 0 },
          { picto: '🌈', situacion: 'Nobody applauds your effort, but you know you gave it your all.', opciones: ['That is already reason enough to feel good', 'You think trying hard is pointless', 'You stop trying if nobody sees it'], correcta: 0 },
          { picto: '🧭', situacion: 'You have to decide something important and not everyone agrees with you.', opciones: ['You trust what you feel is best', 'You change your mind just to be accepted', 'You get angry with whoever disagrees'], correcta: 0 },
          { picto: '📚', situacion: 'A family member says you should study something different from what you like.', opciones: ['I follow what truly interests me', 'I change my mind just to avoid arguing', 'I stop telling my family what I like'], correcta: 0 },
          { picto: '🕺', situacion: 'You feel like dancing differently from how everyone else dances.', opciones: ['I dance my own way and enjoy it', 'I copy everyone else exactly to fit in', 'I stop dancing so nobody looks at me'], correcta: 0 },
          { picto: '🥗', situacion: 'You choose a hobby or habit your friends find strange.', opciones: ['I keep doing what I truly enjoy', 'I give it up so they do not think I am strange', 'I get angry with whoever disagrees'], correcta: 0 },
          { picto: '🏅', situacion: 'You achieve something important to you, but nobody else values it.', opciones: ['I know the effort it took me, and that counts', 'I think it was pointless then', 'I stop trying hard next time'], correcta: 0 }
        ]
      }
    ]
  }
};
