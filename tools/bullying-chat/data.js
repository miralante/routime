/* ============================================================
   Data: Bullying Chat (autonomy — recognizing peer bullying and
   knowing how to react).
   Chat simulator to practice how to respond when someone you know
   (classmates, class group, workshop) bullies over chat: insults,
   exclusion, rumors, photos to laugh at, threats, or pressure to
   join in on bothering someone else. The correct answer ALWAYS
   includes telling a trusted person — never fighting back, never
   just ignoring it, never keeping the secret if asked to.
   Format: DATA.es / DATA.en, each with:
   {
     escenarios: [{               → a thematic GROUP (one menu card)
       id, titulo, picto,
       variantes: [{              → a concrete CASE; opening the card
         contacto,                  plays ONE variant at random, so the
         relacion,                  script can't be memorized
         pasos: [
           { tipo: 'msg', texto }                  → message the user receives
           { tipo: 'eleccion', opciones: [         → the user picks a reply
               { texto, segura: true, avisoSeguro } → safe: explains why, the chat continues
               { texto, segura: false, aviso }     → risky: advice, then retry
             ] }
           { tipo: 'accion', texto, confirmacion } → final button (tell someone) + message
         ],
         regla: rule to remember at the end
       }]
     }],
     normas: summary of every rule (the "My rules" screen)
   }
   The menu stays with few cards (rule 10); the cases (≥25 total)
   live inside the variants. The star is earned per group. app.js
   uses DATA[App.i18n.locale()] || DATA.es.
   Tone: Easy Read, without scaring, never blaming whoever is
   suffering it.
   ============================================================ */
const DATA = {

  es: {
    escenarios: [
      {
        id: 'insultos',
        titulo: 'Me insultan en el chat',
        picto: '😞',
        variantes: [
          {
            contacto: 'Grupo 5ºB',
            relacion: 'Grupo de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Alguien del grupo escribe: "Eres tonto, no sabes hacer nada bien."' },
              { tipo: 'msg', texto: 'Otro compañero se ríe y escribe: "Jajaja, es verdad."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No contesto. Se lo voy a contar a una persona de confianza.', segura: true,
                  avisoSeguro: 'Contárselo a una persona de confianza es lo mejor. Los insultos repetidos son acoso, no es tu culpa.' },
                { texto: 'Les insulto también, para que vean lo que se siente.',
segura: false,
pista: '¿Devolver el insulto hará que pare, y puede empeorar las cosas?',
aviso: 'Devolver el insulto no hace que pare, y puede empeorar las cosas. Mejor cuéntaselo a una persona de confianza.' },
                { texto: 'No digo nada y dejo que sigan.',
segura: false,
pista: '¿Quedarte callado hará que el acoso pare solo?',
aviso: 'Quedarte callado no hace que el acoso pare solo. Contarlo a alguien de confianza sí ayuda.' }
              ] },
              { tipo: 'msg', texto: 'El grupo sigue escribiendo cosas feas sobre ti, día tras día.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Guardo los mensajes (una captura de pantalla) y se los enseño a una persona de confianza.', segura: true,
                  avisoSeguro: 'Guardar las pruebas ayuda a que la persona de confianza entienda lo que pasa y pueda ayudarte mejor.' },
                { texto: 'Borro el chat para no verlo más.',
segura: false,
pista: '¿Borrarlo hará que pare. Es mejor guardarlo y contarlo, para que una persona de confianza pueda ayudar?',
aviso: 'Borrarlo no hace que pare. Es mejor guardarlo y contarlo, para que una persona de confianza pueda ayudar.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Se lo has contado a una persona de confianza. Eso es lo correcto. Acosar no está bien y tú no tienes la culpa.' }
            ],
            regla: 'Si alguien te insulta muchas veces en un chat, no es una broma: es acoso. Cuéntaselo siempre a una persona de confianza. Nunca es tu culpa.'
          },
          {
            contacto: 'Compañeros del taller',
            relacion: 'Compañeros de tu taller',
            pasos: [
              { tipo: 'msg', texto: 'En el grupo del taller alguien escribe: "Ya llegó el lento. ¿Hoy también vas a tardar mil horas?"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No respondo al mote. Se lo voy a contar a una persona de confianza.', segura: true,
                  avisoSeguro: 'Un mote que hace daño y se repite no es una broma: es acoso. Contarlo es lo correcto.' },
                { texto: 'Le pongo yo un mote peor, a ver si le gusta.',
segura: false,
pista: '¿Responder con otro mote alarga la pelea y no arregla nada?',
aviso: 'Responder con otro mote alarga la pelea y no arregla nada. Mejor cuéntaselo a alguien de confianza.' },
                { texto: 'Me río yo también, para que no se note que me molesta.',
segura: false,
pista: '¿Hace falta fingir que no duele. Si te molesta, cuenta?',
aviso: 'No hace falta fingir que no duele. Si te molesta, cuenta. Trabajar a tu ritmo no es motivo de burla.' }
              ] },
              { tipo: 'msg', texto: 'Cada día te llaman por ese mote, aunque ya has pedido que paren.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Guardo los mensajes y se los enseño al encargado o a mi familia.', segura: true,
                  avisoSeguro: 'Cuando pides que paren y no paran, toca contarlo con pruebas. El encargado está para ayudarte.' },
                { texto: 'Dejo de mirar el grupo del taller para siempre.',
segura: false,
pista: '¿De verdad: dejar de mirar el grupo te aísla del trabajo, y la burla sigue?',
aviso: 'Dejar de mirar el grupo te aísla del trabajo, y la burla sigue. Contarlo puede pararla de verdad.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Muy bien. En el taller, el encargado y tu familia pueden hacer que esto pare.' }
            ],
            regla: 'Un mote que te hace daño y se repite es acoso, aunque digan que es broma. Pide que paren y cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Chat de clase',
            relacion: 'Compañeros de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Escribes un mensaje en el grupo y alguien contesta: "Jajaja mirad cómo escribe, no sabe ni hacer una frase."' },
              { tipo: 'msg', texto: 'Copian tu mensaje y lo repiten varias veces con risas.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No contesto a la burla y se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Reírse de cómo escribe alguien es acoso. Cada persona aprende a su ritmo, y eso está bien.' },
                { texto: 'No vuelvo a escribir nunca en el grupo.',
segura: false,
pista: '¿De verdad: dejar de hablar por miedo a la burla te quita tu sitio?',
aviso: 'Dejar de hablar por miedo a la burla te quita tu sitio. El problema es de quien se burla, no tuyo.' },
                { texto: 'Me burlo yo de cómo escribe otro.',
segura: false,
pista: '¿De verdad: pasarle la burla a otra persona hace más daño?',
aviso: 'Pasarle la burla a otra persona hace más daño. Mejor cuéntaselo a una persona de confianza.' }
              ] },
              { tipo: 'msg', texto: 'Al día siguiente siguen con lo mismo cada vez que escribes.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Escribo con calma que no está bien reírse, y lo cuento con capturas.', segura: true,
                  avisoSeguro: 'Decirlo con calma y contarlo con pruebas es la mejor combinación. No estás solo con esto.' },
                { texto: 'Les pido perdón por escribir mal.',
segura: false,
pista: '¿Realmente tienes que pedir perdón por aprender a tu ritmo?',
aviso: 'No tienes que pedir perdón por aprender a tu ritmo. Quien se burla es quien actúa mal.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Bien hecho. Escribir con faltas no es motivo de burla; burlarse sí es un problema.' }
            ],
            regla: 'Reírse de cómo habla o escribe una persona es acoso. Cada persona aprende a su ritmo, y eso está bien. Cuéntalo.'
          },
          {
            contacto: 'Iker_Clase',
            relacion: 'Un compañero de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Cada vez que jugáis online te escribe: "Eres malísimo. Vete del juego, nadie te quiere aquí."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Silencio su chat en el juego y se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Silenciar y contar es la jugada perfecta: dejas de leer los insultos y una persona de confianza puede pararlos.' },
                { texto: 'Le insulto yo cada vez que pierde.',
segura: false,
pista: '¿De verdad: devolver insultos convierte el juego en una pelea?',
aviso: 'Devolver insultos convierte el juego en una pelea. Silenciar y contarlo funciona mejor.' },
                { texto: 'Dejo de jugar al juego que me gusta.',
segura: false,
pista: '¿Realmente tienes que renunciar a lo que te gusta?',
aviso: 'No tienes que renunciar a lo que te gusta. El que actúa mal es él, no tú.' }
              ] },
              { tipo: 'msg', texto: 'Te escribe: "Si no te vas del juego, mañana se lo digo a todos en clase."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Guardo su mensaje y se lo enseño hoy a una persona de confianza.', segura: true,
                  avisoSeguro: 'Esa amenaza es la prueba perfecta para que una persona de confianza actúe. Contarlo hoy es lo mejor.' },
                { texto: 'Me voy del juego para que no diga nada.',
segura: false,
pista: 'Si obedeces, vendrán más. Contarlo es lo que las corta?',
aviso: 'Si obedeces a una amenaza, vendrán más. Contarlo es lo que las corta.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Muy bien. El acoso en los juegos online también es acoso, y también se puede parar.' }
            ],
            regla: 'El acoso en los juegos online también es acoso. Silencia el chat, guarda los mensajes y cuéntaselo a una persona de confianza.'
          }
        ]
      },

      {
        id: 'exclusion',
        titulo: 'Me echan del grupo',
        picto: '🚫',
        variantes: [
          {
            contacto: 'Amigos del cole',
            relacion: 'Amigos de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Ves un mensaje: "Hemos hecho un grupo nuevo sin ti, no le digáis nada."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Me siento mal. Se lo cuento a alguien de confianza.', segura: true,
                  avisoSeguro: 'Contarlo ayuda. Que te excluyan a propósito y a escondidas duele, y mereces que alguien te ayude.' },
                { texto: 'Hago yo también un grupo para dejar fuera a otro.',
segura: false,
pista: '¿Excluir a otra persona arregla que te hayan excluido a ti?',
aviso: 'Excluir a otra persona no arregla que te hayan excluido a ti. Mejor cuéntaselo a una persona de confianza.' },
                { texto: 'No le doy importancia, seguro que no es nada.',
segura: false,
pista: 'Si Si te duele, sí importa., ¿hace falta que lo soportes solo o sola?',
aviso: 'Si te duele, sí importa. No hace falta que lo soportes solo o sola.' }
              ] },
              { tipo: 'msg', texto: 'Un compañero te escribe directamente: "Nadie te quiere en el grupo, mejor no insistas."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Le respondo con calma que eso no está bien, y se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Puedes responder con calma y también contarlo. Las dos cosas ayudan a que la situación mejore.' },
                { texto: 'Le suplico que me dejen entrar en el grupo.',
segura: false,
pista: '¿Realmente tienes que rogar para que te traten bien?',
aviso: 'No tienes que rogar para que te traten bien. Cuéntaselo a alguien de confianza.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Muy bien. Una persona de confianza puede ayudarte a que la situación cambie.' }
            ],
            regla: 'Que te excluyan a propósito de un grupo también es una forma de acoso. Cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Grupo Cumple',
            relacion: 'Amigas de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'En el grupo hablan de un cumpleaños: "Vamos todas el sábado. Bueno, todas menos una… ya sabéis quién. 😏"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Me duele. Se lo voy a contar a una persona de confianza.', segura: true,
                  avisoSeguro: 'Dejarte fuera a propósito y con burla no es un despiste: es exclusión. Contarlo ayuda.' },
                { texto: 'Pregunto mil veces si puedo ir, porfa, porfa.',
segura: false,
pista: '¿Realmente tienes que suplicar para que te inviten?',
aviso: 'No tienes que suplicar para que te inviten. Mereces amigas que quieran que estés.' },
                { texto: 'Escribo algo feo del cumpleaños para vengarme.',
segura: false,
pista: '¿Vengarte te pone a su altura y empeora las cosas?',
aviso: 'Vengarte te pone a su altura y empeora las cosas. Mejor cuéntalo.' }
              ] },
              { tipo: 'msg', texto: 'El sábado suben fotos de la fiesta y te etiquetan: "¡Qué pena que no vinieras! 😂"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Guardo los mensajes y se los enseño a una persona de confianza.', segura: true,
                  avisoSeguro: 'Burlarse encima de la exclusión lo hace aún más claro. Con las pruebas, una persona de confianza puede actuar.' },
                { texto: 'Contesto que la fiesta seguro que fue aburridísima.',
segura: false,
pista: '¿Responder con desprecio alarga la pelea. Contarlo a una persona de confianza sí puede cambiarlo?',
aviso: 'Responder con desprecio alarga la pelea. Contarlo a una persona de confianza sí puede cambiarlo.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Bien hecho. Nadie merece que le dejen fuera para reírse. Una persona de confianza puede ayudar.' }
            ],
            regla: 'Dejar fuera a alguien a propósito y reírse encima es acoso. No supliques: cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Compañeros del taller',
            relacion: 'Compañeros de tu taller',
            pasos: [
              { tipo: 'msg', texto: 'Descubres que hay un grupo del taller donde avisan de los descansos y los planes… y nunca te han metido.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Pregunto con calma por qué no estoy, y se lo cuento al encargado.', segura: true,
                  avisoSeguro: 'Preguntar con calma está bien, y el encargado debe saber que te dejan fuera de los avisos del trabajo.' },
                { texto: 'No digo nada, será que no hay sitio en el grupo.',
segura: false,
pista: 'Si En los grupos siempre hay sitio. Dejarte fuera de los avisos del trabajo, ¿está bien?',
aviso: 'En los grupos siempre hay sitio. Dejarte fuera de los avisos del trabajo no está bien.' }
              ] },
              { tipo: 'msg', texto: 'Un compañero te dice: "Es que en ese grupo estamos los de siempre, tú no pintas nada."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Se lo cuento al encargado o a mi familia. Es mi trabajo también.', segura: true,
                  avisoSeguro: 'Los avisos del taller son de todos. Excluirte a propósito es un problema que el encargado debe arreglar.' },
                { texto: 'Le pido perdón por haber preguntado.',
segura: false,
pista: '¿De verdad: no has hecho nada malo al preguntar. Quien excluye es quien actúa mal?',
aviso: 'No has hecho nada malo al preguntar. Quien excluye es quien actúa mal.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo al encargado o a mi familia',
                confirmacion: 'Muy bien. Los avisos del trabajo son para todos, y tú formas parte del equipo.' }
            ],
            regla: 'Dejarte fuera de los grupos donde se avisan las cosas del trabajo o la clase también es exclusión. Cuéntalo.'
          },
          {
            contacto: 'Equipo del juego',
            relacion: 'Compañeros que conoces del cole',
            pasos: [
              { tipo: 'msg', texto: 'Cada vez que entras a jugar, te expulsan de la partida: "Uy, se ha vuelto a caer. 😂"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Capto que es a propósito. Se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Expulsarte siempre "de broma" es exclusión a propósito. Contarlo es lo correcto.' },
                { texto: 'Sigo entrando una y otra vez sin decir nada.',
segura: false,
pista: 'Si Si te echan a propósito, insistir en silencio, ¿lo arregla?',
aviso: 'Si te echan a propósito, insistir en silencio no lo arregla. Cuéntaselo a alguien.' },
                { texto: 'Intento expulsarles yo a ellos.',
segura: false,
pista: '¿De verdad: devolver la expulsión convierte el juego en una guerra?',
aviso: 'Devolver la expulsión convierte el juego en una guerra. Contarlo funciona mejor.' }
              ] },
              { tipo: 'msg', texto: 'En clase se ríen: "¿Qué pasa, que no sabes ni entrar a la partida?"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Respondo con calma que sé lo que hacen, y lo cuento.', segura: true,
                  avisoSeguro: 'Nombrar lo que hacen, con calma y sin pelear, les quita el juego. Y contarlo lo para.' },
                { texto: 'Me aguanto la rabia y no se lo digo a nadie.',
segura: false,
pista: '¿Aguantar en silencio hará que pare. Mereces jugar como todos los demás?',
aviso: 'Aguantar en silencio no hace que pare. Mereces jugar como todos los demás.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Bien hecho. Echarte del juego a propósito una y otra vez no es una broma.' }
            ],
            regla: 'Expulsarte siempre del juego "de broma" es exclusión a propósito. No es cosa tuya: cuéntaselo a una persona de confianza.'
          }
        ]
      },

      {
        id: 'rumores',
        titulo: 'Están contando mentiras de mí',
        picto: '🗯️',
        variantes: [
          {
            contacto: 'Grupo de clase',
            relacion: 'Compañeros de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Una compañera escribe: "He oído que hizo algo horrible, ¿os lo cuento?"' },
              { tipo: 'msg', texto: 'Varios compañeros responden: "¡Cuéntalo! ¡Cuéntalo!"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Escribo con calma que eso no es verdad, y se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Está bien aclarar la verdad con calma. Y contarlo a una persona de confianza ayuda a que pare.' },
                { texto: 'Empiezo a contar cosas falsas de ella también.',
segura: false,
pista: 'Si Contar mentiras de otra persona, ¿soluciona nada, y hace más daño?',
aviso: 'Contar mentiras de otra persona no soluciona nada, y hace más daño. Mejor cuéntaselo a una persona de confianza.' },
                { texto: 'No digo nada, aunque no sea verdad.',
segura: false,
pista: 'Si Puedes decir con calma que, ¿es verdad?',
aviso: 'Puedes decir con calma que no es verdad. Y sobre todo, contárselo a alguien de confianza.' }
              ] },
              { tipo: 'msg', texto: 'El rumor sigue circulando y algunos compañeros te miran raro.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Se lo cuento a una persona de confianza para que me ayude.', segura: true,
                  avisoSeguro: 'Un rumor que se extiende necesita la ayuda de una persona de confianza para pararlo bien.' },
                { texto: 'Dejo de ir a clase para no verlos.',
segura: false,
pista: 'Si Evitar ir a clase, ¿resuelve el problema?',
aviso: 'Evitar ir a clase no resuelve el problema. Una persona de confianza puede ayudar a que el rumor pare.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Bien hecho. Una persona de confianza puede ayudar a aclarar la verdad y a que paren los rumores.' }
            ],
            regla: 'Los rumores falsos también hacen daño. No es tu culpa que los cuenten. Cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Grupo de clase',
            relacion: 'Compañeros de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Alguien escribe en el grupo: "¿Sabéis a quién le gusta? ¡Voy a decirlo para que se ría todo el mundo!"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Escribo que eso es privado, y se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Tus sentimientos son tuyos. Airearlos para reírse es una forma de acoso.' },
                { texto: 'Digo que le gusta alguien a otra persona, para desviar la atención.',
segura: false,
pista: '¿De verdad: pasarle el foco a otro le hace a él el mismo daño?',
aviso: 'Pasarle el foco a otro le hace a él el mismo daño. Mejor contarlo a una persona de confianza.' },
                { texto: 'Niego todo gritando con enfado.',
segura: false,
pista: '¿De verdad: gritar les da justo la reacción que buscan?',
aviso: 'Gritar les da justo la reacción que buscan. Con calma y contándolo se para mejor.' }
              ] },
              { tipo: 'msg', texto: 'Empiezan a escribir tu nombre con corazones y risas por todo el grupo.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No respondo a las risas y lo cuento con capturas.', segura: true,
                  avisoSeguro: 'Sin tu reacción, la "gracia" se les acaba antes. Y las capturas ayudan a la persona de confianza a actuar.' },
                { texto: 'Salgo del grupo de clase para siempre sin contarlo.',
segura: false,
pista: '¿De verdad: salir sin contarlo te deja fuera de tu grupo y el problema sigue?',
aviso: 'Salir sin contarlo te deja fuera de tu grupo y el problema sigue. Contarlo puede pararlo.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Muy bien. Reírse de los sentimientos de alguien no está bien nunca.' }
            ],
            regla: 'Tus sentimientos son privados. Airearlos en un grupo para reírse es acoso. Cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Antiguo amigo',
            relacion: 'Un amigo de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Le contaste un secreto a un amigo. Hoy ves que lo ha contado en el grupo grande, con risas.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Le digo con calma que eso me ha dolido, y se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Decir cómo te sientes está bien, y una persona de confianza puede ayudar a que el secreto deje de circular.' },
                { texto: 'Cuento yo un secreto suyo aún peor.',
segura: false,
pista: '¿De verdad: traicionar su secreto te convierte en lo mismo que te ha dolido?',
aviso: 'Traicionar su secreto te convierte en lo mismo que te ha dolido. No entres en esa rueda.' },
                { texto: 'Hago como si no me importara.',
segura: false,
pista: 'Si Sí importa: era tu secreto., ¿tienes que fingir que no duele?',
aviso: 'Sí importa: era tu secreto. No tienes que fingir que no duele.' }
              ] },
              { tipo: 'msg', texto: 'Te escribe: "Era solo una broma, no te enfades. No se lo digas a nadie, ¿eh?"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Lo cuento igualmente. Pedir silencio después de hacer daño no vale.', segura: true,
                  avisoSeguro: 'Exacto: quien hace daño y pide silencio sabe que hizo mal. Contarlo es lo correcto.' },
                { texto: 'Vale, no se lo digo a nadie para que no se enfade él.',
segura: false,
pista: 'Si Proteger a quien te ha hecho daño, ¿te protege a ti?',
aviso: 'Proteger a quien te ha hecho daño no te protege a ti. Cuéntaselo a una persona de confianza.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Bien hecho. Contar un secreto ajeno para reírse no es una broma.' }
            ],
            regla: 'Contar el secreto de otra persona para reírse es una traición, no una broma. Si te lo hacen, cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Grupo 6ºA',
            relacion: 'Compañeros de otra clase',
            pasos: [
              { tipo: 'msg', texto: 'En un grupo escriben: "Fue él quien rompió la ventana del gimnasio. Mañana se lo decimos al profe."' },
              { tipo: 'msg', texto: 'Tú ni siquiera estabas allí ese día.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Me adelanto: se lo cuento yo primero a una persona de confianza, con la verdad.', segura: true,
                  avisoSeguro: 'Adelantarte a contar la verdad es la mejor defensa contra una acusación falsa.' },
                { texto: 'Espero a ver si se les olvida.',
segura: false,
pista: '¿De verdad: esperar deja que la mentira crezca. Contar la verdad tú primero te protege?',
aviso: 'Esperar deja que la mentira crezca. Contar la verdad tú primero te protege.' },
                { texto: 'Amenazo con acusarles yo de otra cosa.',
segura: false,
pista: '¿De verdad: responder con otra acusación te mete en el problema?',
aviso: 'Responder con otra acusación te mete en el problema. La verdad y una persona de confianza te sacan de él.' }
              ] },
              { tipo: 'msg', texto: 'Te escriben a ti: "Como digas que no fuiste tú, será peor."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Guardo ese mensaje: es la prueba de que me quieren culpar. Lo cuento ya.', segura: true,
                  avisoSeguro: 'Ese mensaje demuestra la trampa. Con él, la persona de confianza verá clarísimo lo que pasa.' },
                { texto: 'Me callo y acepto la culpa para que me dejen en paz.',
segura: false,
pista: 'Si Aceptar una culpa que, ¿es tuya no te dará paz: pedirán más?',
aviso: 'Aceptar una culpa que no es tuya no te dará paz: pedirán más. La verdad te protege.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contar la verdad a una persona de confianza ahora mismo',
                confirmacion: 'Muy bien. Contaste la verdad primero y el mensaje guardado lo demostró todo.' }
            ],
            regla: 'Si te acusan de algo que no has hecho, no esperes: cuenta tú primero la verdad a una persona de confianza y guarda los mensajes.'
          }
        ]
      },

      {
        id: 'foto',
        titulo: 'Se ríen de una foto mía',
        picto: '📸',
        variantes: [
          {
            contacto: 'Grupo de clase',
            relacion: 'Compañeros de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Alguien comparte una foto tuya en la que sales mal, y escribe: "Mirad qué cara jajaja."' },
              { tipo: 'msg', texto: 'Varios compañeros ponen emoticonos de risa.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Pido que la borren, y se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Puedes pedir que la borren y también contarlo a una persona de confianza. Reírse así de una foto tuya no está bien.' },
                { texto: 'Comparto una foto suya para reírme también.',
segura: false,
pista: 'Si Hacer lo mismo, ¿soluciona nada y hace más daño?',
aviso: 'Hacer lo mismo no soluciona nada y hace más daño. Mejor cuéntaselo a una persona de confianza.' },
                { texto: 'Me río también para que no se note que me duele.',
segura: false,
pista: '¿Hace falta fingir que no duele. Contarlo a una persona de confianza es lo que de verdad ayuda?',
aviso: 'No hace falta fingir que no duele. Contarlo a una persona de confianza es lo que de verdad ayuda.' }
              ] },
              { tipo: 'msg', texto: 'La foto se sigue compartiendo con más gente.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Guardo el mensaje y se lo enseño a una persona de confianza.', segura: true,
                  avisoSeguro: 'Guardar lo que ha pasado ayuda a que la persona de confianza pueda actuar mejor.' },
                { texto: 'Borro mi cuenta para que no me encuentren.',
segura: false,
pista: '¿Realmente tienes que desaparecer tú. Una persona de confianza puede ayudar a que quiten la foto y pare la burla?',
aviso: 'No tienes que desaparecer tú. Una persona de confianza puede ayudar a que quiten la foto y pare la burla.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Muy bien hecho. Una persona de confianza puede ayudar a que quiten la foto y a hablar con quien la compartió.' }
            ],
            regla: 'Compartir una foto tuya para reírse de ti no está bien, aunque digan que es broma. Cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Grupo del comedor',
            relacion: 'Compañeros de tu cole',
            pasos: [
              { tipo: 'msg', texto: 'Alguien te hizo una foto en el comedor sin que te dieras cuenta, comiendo con la boca llena.' },
              { tipo: 'msg', texto: 'La ha mandado al grupo: "Mirad el hambre que tenía. 😂"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Escribo que no di permiso para esa foto, y lo cuento.', segura: true,
                  avisoSeguro: 'Hacerte fotos sin permiso ya está mal; compartirlas para reírse, mucho más. Contarlo es lo correcto.' },
                { texto: 'Les hago yo fotos comiendo, a ver qué tal les sienta.',
segura: false,
pista: '¿De verdad: hacer lo mismo multiplica el problema. Mejor pedir que la borren y contarlo?',
aviso: 'Hacer lo mismo multiplica el problema. Mejor pedir que la borren y contarlo.' },
                { texto: 'Como en un rincón a partir de mañana para que no me hagan fotos.',
segura: false,
pista: 'Si Esconderte, ¿es la solución: tú no has hecho nada malo?',
aviso: 'Esconderte no es la solución: tú no has hecho nada malo. Contarlo puede pararlo.' }
              ] },
              { tipo: 'msg', texto: 'Alguien la convierte en un montaje y la vuelve a mandar.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Guardo el montaje como prueba y se lo enseño a una persona de confianza hoy.', segura: true,
                  avisoSeguro: 'Cada reenvío es una prueba más. Una persona de confianza puede pedir que se borre todo y hablar con quien lo hizo.' },
                { texto: 'Pido por privado a cada uno que la borre, sin contárselo a nadie más.',
segura: false,
pista: 'Si Pedirlo tú solo a cada uno es agotador y, ¿suele funcionar?',
aviso: 'Pedirlo tú solo a cada uno es agotador y no suele funcionar. Una persona de confianza tiene más fuerza para pararlo.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Bien hecho. Nadie puede hacerte fotos sin permiso y compartirlas para reírse.' }
            ],
            regla: 'Nadie puede hacerte fotos sin permiso ni compartirlas para reírse de ti. Guarda las pruebas y cuéntalo.'
          },
          {
            contacto: 'Grupo de clase',
            relacion: 'Compañeros de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Han hecho un sticker con tu cara y lo usan en el grupo para burlarse cada día.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Pido que dejen de usarlo, y se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Un montaje con tu cara para burlarse es acoso, aunque parezca "solo un sticker". Contarlo ayuda.' },
                { texto: 'Hago yo stickers de ellos para vengarme.',
segura: false,
pista: '¿Responder con más montajes alarga la burla para todos?',
aviso: 'Responder con más montajes alarga la burla para todos. Mejor cuéntaselo a una persona de confianza.' },
                { texto: 'Les sigo el juego usando mi propio sticker.',
segura: false,
pista: '¿Seguir la corriente hará que pare, aunque parezca que sí?',
aviso: 'Seguir la corriente no hace que pare, aunque parezca que sí. Si te duele, cuenta.' }
              ] },
              { tipo: 'msg', texto: 'Dicen: "Es un homenaje, ¿no te hace gracia? Qué poco humor tienes."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Digo con calma: si a mí no me hace gracia, no es una broma. Y lo cuento.', segura: true,
                  avisoSeguro: 'Exacto: las bromas hacen gracia a TODOS, incluido tú. Si no, es burla, y se cuenta.' },
                { texto: 'A lo mejor tienen razón y tengo poco humor…',
segura: false,
pista: 'Si No es falta de humor: es que se ríen DE ti,, ¿CONTIGO?',
aviso: 'No es falta de humor: es que se ríen DE ti, no CONTIGO. Esa diferencia lo es todo.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Muy bien. Una broma que no le hace gracia a todos no es una broma.' }
            ],
            regla: 'Si una "broma" con tu imagen no te hace gracia a ti, no es una broma: es burla. Cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Compañero de clase',
            relacion: 'Un compañero de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Te manda una foto vergonzosa de otra compañera: "Pásala al grupo grande, ¡es buenísima! 😂"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No la reenvío. Reenviar burlas también es acosar.', segura: true,
                  avisoSeguro: 'Exacto: quien reenvía una burla se convierte en parte del acoso. Cortarlo en tu mano protege a tu compañera.' },
                { texto: 'La reenvío, total, ya la tiene todo el mundo.',
segura: false,
pista: '¿De verdad: "Ya la tiene todo el mundo" es la excusa de siempre?',
aviso: '"Ya la tiene todo el mundo" es la excusa de siempre. Cada reenvío hace más daño.' },
                { texto: 'No la reenvío, pero me río con él por privado.',
segura: false,
pista: '¿De verdad: reírle la gracia también le anima a seguir?',
aviso: 'Reírle la gracia también le anima a seguir. Puedes hacer más: contarlo.' }
              ] },
              { tipo: 'msg', texto: 'Insiste: "¿La has pasado ya? No seas soso."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Le digo que no, aviso a la compañera y lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Avisar a la persona afectada y a una persona de confianza es proteger de verdad. "Soso" es un precio pequeñísimo.' },
                { texto: 'La paso para que deje de insistir.',
segura: false,
pista: '¿De verdad: ceder a la insistencia hace daño a otra persona?',
aviso: 'Ceder a la insistencia hace daño a otra persona. Decir que no ya es ayudarla.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Avisar a mi compañera y contarlo',
                confirmacion: 'Muy bien hecho. Has cortado la cadena y has protegido a tu compañera.' }
            ],
            regla: 'No reenvíes fotos que se burlan de alguien: reenviar también es acosar. Avisa a la persona y cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Grupo del cole',
            relacion: 'Compañeros de tu cole',
            pasos: [
              { tipo: 'msg', texto: '"Mándanos una foto tuya poniendo caras raras, es para un meme del grupo. Todos lo han hecho."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No mando fotos para memes. Luego no se pueden recuperar.', segura: true,
                  avisoSeguro: 'Una foto "graciosa" tuya puede acabar donde no imaginas. Una vez enviada, ya no la controlas tú.' },
                { texto: 'Si todos lo han hecho, la mando yo también.',
segura: false,
pista: '¿De verdad: "Todos lo han hecho" casi nunca es verdad, y aunque lo fuera: tu foto es tuya?',
aviso: '"Todos lo han hecho" casi nunca es verdad, y aunque lo fuera: tu foto es tuya. No la mandes.' }
              ] },
              { tipo: 'msg', texto: '"Venga, no seas aburrido. Es solo para reírnos un rato."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Que se rían con otra cosa. Mi cara no es un meme.', segura: true,
                  avisoSeguro: 'Muy bien dicho. Puedes reírte CON ellos sin regalar tu imagen para siempre.' },
                { texto: 'Bueno, una tonta y ya está.',
segura: false,
pista: '¿De verdad: esa "una tonta" puede reaparecer dentro de años?',
aviso: 'Esa "una tonta" puede reaparecer dentro de años. Las fotos enviadas no se pueden borrar de verdad.' }
              ] },
              { tipo: 'accion', texto: '🚫 No mandar la foto y contarlo si insisten',
                confirmacion: 'Bien hecho. Tu imagen es tuya, y no hace falta regalarla para caer bien.' }
            ],
            regla: 'No mandes fotos tuyas "para memes": una vez enviadas ya no las controlas. Si insisten, cuéntaselo a una persona de confianza.'
          }
        ]
      },

      {
        id: 'amenaza',
        titulo: 'Me amenazan en un chat',
        picto: '😨',
        variantes: [
          {
            contacto: 'Compañero de clase',
            relacion: 'Un compañero de tu clase',
            pasos: [
              { tipo: 'msg', texto: '"Mañana en el patio vas a ver lo que te espera."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Se lo cuento enseguida a una persona de confianza.', segura: true,
                  avisoSeguro: 'Una amenaza hay que contarla siempre y cuanto antes, a una persona de confianza.' },
                { texto: 'Le respondo con otra amenaza.',
segura: false,
pista: '¿De verdad: responder con otra amenaza puede empeorar las cosas?',
aviso: 'Responder con otra amenaza puede empeorar las cosas. Cuéntaselo a una persona de confianza ahora mismo.' },
                { texto: 'No voy a clase mañana para evitarlo.',
segura: false,
pista: 'Si Faltar a clase, ¿resuelve el problema real?',
aviso: 'Faltar a clase no resuelve el problema real. Cuéntaselo a una persona de confianza para que te proteja de verdad.' }
              ] },
              { tipo: 'msg', texto: '"Y no se te ocurra contarlo a nadie."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Se lo cuento a una persona de confianza de todas formas. Es lo más importante.', segura: true,
                  avisoSeguro: 'Que te pidan guardar el secreto es otra señal de que hay que contarlo. Una persona de confianza puede protegerte.' },
                { texto: 'No se lo cuento a nadie, como me dice.',
segura: false,
pista: '¿De verdad: cuando alguien te pide guardar en secreto algo que te asusta, siempre hay que contarlo a…',
aviso: 'Cuando alguien te pide guardar en secreto algo que te asusta, siempre hay que contarlo a una persona de confianza.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza ahora mismo',
                confirmacion: 'Muy bien. Ante una amenaza, contarlo enseguida a una persona de confianza es lo más importante y lo más valiente.' }
            ],
            regla: 'Si alguien te amenaza, cuéntaselo enseguida a una persona de confianza, aunque te pidan que no lo hagas. Si no tienes a quién contárselo, también puedes denunciarlo en tu centro o en la policía.'
          },
          {
            contacto: 'Compañero de clase',
            relacion: 'Un compañero de tu clase',
            pasos: [
              { tipo: 'msg', texto: '"Pásame los deberes hechos todos los días. Si no, ya sabes lo que te pasará."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No se los paso y lo cuento hoy a una persona de confianza.', segura: true,
                  avisoSeguro: 'Obligarte con amenazas a hacer su trabajo es abuso. Contarlo cuanto antes lo para.' },
                { texto: 'Se los paso, así me deja en paz.',
segura: false,
pista: '¿De verdad: si cedes hoy, mañana pedirá más. Las amenazas solo paran cuando las conoce una persona de confianza?',
aviso: 'Si cedes hoy, mañana pedirá más. Las amenazas solo paran cuando las conoce una persona de confianza.' },
                { texto: 'Le paso los deberes mal hechos a propósito.',
segura: false,
pista: '¿De verdad: los trucos alargan el problema y pueden volverse contra ti?',
aviso: 'Los trucos alargan el problema y pueden volverse contra ti. Contarlo es más seguro.' }
              ] },
              { tipo: 'msg', texto: '"Y rapidito, que los necesito antes de las seis."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Guardo sus mensajes como prueba y se los enseño a una persona de confianza.', segura: true,
                  avisoSeguro: 'Sus propios mensajes son la mejor prueba. Con ellas, la persona de confianza puede actuar enseguida.' },
                { texto: 'Los borro para olvidarme del tema.',
segura: false,
pista: '¿De verdad: si los borras, será tu palabra contra la suya?',
aviso: 'Si los borras, será tu palabra contra la suya. Guárdalos y cuéntalo.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Muy bien. Nadie puede obligarte a hacer su trabajo con amenazas.' }
            ],
            regla: 'Obligarte con amenazas a hacer los deberes de otro es abuso. No cedas: guarda los mensajes y cuéntalo hoy. Si no tienes a quién contárselo, también puedes denunciarlo en tu centro.'
          },
          {
            contacto: 'Chico de otra clase',
            relacion: 'Un chico de otra clase',
            pasos: [
              { tipo: 'msg', texto: '"Mañana me traes tu dinero del recreo. Si no, te espero a la salida."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No le doy nada y se lo cuento hoy mismo a una persona de confianza.', segura: true,
                  avisoSeguro: 'Pedir dinero con amenazas es muy grave. Contarlo hoy es la forma de estar protegido mañana.' },
                { texto: 'Le llevo el dinero para evitar problemas.',
segura: false,
pista: '¿De verdad: si pagas una vez, pedirá siempre. La protección de verdad es que lo sepa una persona de confianza?',
aviso: 'Si pagas una vez, pedirá siempre. La protección de verdad es que lo sepa una persona de confianza.' },
                { texto: 'Le digo que le espero yo a él.',
segura: false,
pista: 'Si Responder al desafío puede acabar muy mal. La fuerza aquí es contarlo,, ¿pelear?',
aviso: 'Responder al desafío puede acabar muy mal. La fuerza aquí es contarlo, no pelear.' }
              ] },
              { tipo: 'msg', texto: '"Ni se te ocurra decírselo a un profe. Te estaré vigilando."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Precisamente por eso se lo digo ya: a un profesor y a mi familia.', segura: true,
                  avisoSeguro: 'Cuanto más insiste en el silencio, más claro está que contarlo le detiene. Bien visto.' },
                { texto: 'Mejor me callo, no quiero que me vigile.',
segura: false,
pista: '¿De verdad: el silencio te deja solo con el miedo?',
aviso: 'El silencio te deja solo con el miedo. Contarlo pone a las personas de confianza de tu lado, que es donde deben estar.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contarlo hoy a un profesor y a mi familia',
                confirmacion: 'Muy bien. Pedir dinero con amenazas es de las cosas más importantes de contar enseguida.' }
            ],
            regla: 'Si alguien te pide dinero con amenazas, no pagues: cuéntaselo hoy mismo a un profesor y a tu familia.'
          },
          {
            contacto: 'Grupo de clase',
            relacion: 'Compañeros de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Viste cómo unos compañeros se metían con otro. Ahora te escriben: "Como cuentes lo que viste, serás el siguiente."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Lo cuento igualmente a una persona de confianza: por él y por mí.', segura: true,
                  avisoSeguro: 'Contarlo os protege a los dos. Las personas de confianza saben cómo hacerlo sin señalarte.' },
                { texto: 'Me callo, no quiero ser el siguiente.',
segura: false,
pista: '¿De verdad: el silencio es justo lo que necesitan para seguir?',
aviso: 'El silencio es justo lo que necesitan para seguir. Contarlo a una persona de confianza os protege a ti y al compañero.' },
                { texto: 'Les prometo silencio a cambio de que no me toquen.',
segura: false,
pista: 'Si Los tratos con quien amenaza, ¿se cumplen?',
aviso: 'Los tratos con quien amenaza no se cumplen. La protección de verdad viene de contarlo.' }
              ] },
              { tipo: 'msg', texto: '"¿Entendido? Ni una palabra."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Guardo el mensaje y voy a hablar con una persona de confianza ahora.', segura: true,
                  avisoSeguro: 'Esa amenaza escrita es la prueba que lo desmonta todo. Ahora es cosa de las personas de confianza, no tuya.' },
                { texto: 'Respondo "entendido" y trago con todo.',
segura: false,
pista: '¿Realmente tienes que tragar con nada. Hay personas cuyo trabajo es exactamente ayudar con esto?',
aviso: 'No tienes que tragar con nada. Hay personas cuyo trabajo es exactamente ayudar con esto.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contarlo todo a una persona de confianza',
                confirmacion: 'Muy valiente. Contar lo que viste protege a tu compañero y también a ti.' }
            ],
            regla: 'Si te amenazan para que calles lo que viste, cuéntalo igualmente: el silencio solo protege a quien acosa.'
          }
        ]
      },

      {
        id: 'testigo',
        titulo: 'Me piden que moleste a otro',
        picto: '👀',
        variantes: [
          {
            contacto: 'Grupo de clase',
            relacion: 'Compañeros de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Un compañero escribe en el grupo: "Vamos a meternos todos con él, escribidle algo feo."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No participo, y se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'No unirte y contarlo ayuda a proteger a tu compañero. Eso es ser un buen amigo.' },
                { texto: 'Escribo algo feo también, para no quedar mal con el grupo.',
segura: false,
pista: 'Si Unirte para, ¿quedar mal hace daño a otra persona?',
aviso: 'Unirte para no quedar mal hace daño a otra persona. Mejor no participar, y contarlo.' },
                { texto: 'No escribo nada, pero tampoco se lo digo a nadie.',
segura: false,
pista: '¿De verdad: no participar ya es un paso, pero contarlo a una persona de confianza ayuda mucho más a proteger…',
aviso: 'No participar ya es un paso, pero contarlo a una persona de confianza ayuda mucho más a proteger a tu compañero.' }
              ] },
              { tipo: 'msg', texto: 'Varios compañeros ya han escrito cosas feas y esperan que tú también lo hagas.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Le escribo en privado para decirle que no está solo, y se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Apoyar a quien lo está pasando mal, y contarlo a una persona de confianza, es la mejor forma de ayudar.' },
                { texto: 'Sigo la corriente del grupo para que no se metan conmigo.',
segura: false,
pista: '¿De verdad: seguir la corriente hace daño a otra persona?',
aviso: 'Seguir la corriente hace daño a otra persona. Puedes no participar y contarlo a una persona de confianza.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Contárselo a una persona de confianza',
                confirmacion: 'Muy bien hecho. Contarlo ayuda a proteger a tu compañero, y a ti también.' }
            ],
            regla: 'Si ves que están acosando a alguien, no participes. Contárselo a una persona de confianza ayuda a proteger a esa persona.'
          },
          {
            contacto: 'Grupo de clase',
            relacion: 'Compañeros de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'En el grupo se están riendo de una compañera con mensajes crueles. Te escriben: "Tú también, pon un emoji de risa por lo menos."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No pongo nada. Un emoji de risa también hace daño.', segura: true,
                  avisoSeguro: 'Exacto: cada emoji de risa le dice a ella que todos están en su contra. No participar ya la ayuda.' },
                { texto: 'Pongo el emoji, total, es solo un emoji.',
segura: false,
pista: '¿De verdad: para quien lo sufre, cada risa cuenta, aunque sea un emoji?',
aviso: 'Para quien lo sufre, cada risa cuenta, aunque sea un emoji. No hay burla "pequeña".' }
              ] },
              { tipo: 'msg', texto: 'La compañera se desconecta del grupo. Alguien escribe: "Ya se ha ido la llorona."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Le escribo a ella en privado para apoyarla, y lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Tu mensaje privado puede ser lo más importante que reciba hoy. Y contarlo hace que esto pare.' },
                { texto: 'No hago nada, ya se le pasará.',
segura: false,
pista: 'Si Puede que, ¿se le pase sola. Un mensaje tuyo y avisar a una persona de confianza cambian mucho las cosas?',
aviso: 'Puede que no se le pase sola. Un mensaje tuyo y avisar a una persona de confianza cambian mucho las cosas.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Apoyarla y contárselo a una persona de confianza',
                confirmacion: 'Muy bien. Apoyar a quien lo sufre y avisar a una persona de confianza es exactamente lo que hay que hacer.' }
            ],
            regla: 'Un emoji de risa en una burla también es participar. Apoya en privado a quien lo sufre y cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Tu mejor amigo',
            relacion: 'Tu mejor amigo',
            pasos: [
              { tipo: 'msg', texto: 'Tu mejor amigo te escribe: "Unos de clase se meten conmigo todos los días. No se lo digas a nadie, me da vergüenza."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Le digo que contarlo no es de débiles, y que le acompaño a hacerlo.', segura: true,
                  avisoSeguro: 'Acompañarle a contarlo es la mejor ayuda. El acoso no se arregla en secreto.' },
                { texto: 'Le prometo guardar el secreto para siempre.',
segura: false,
pista: '¿De verdad: este secreto le hace daño cada día. Ayudarle de verdad es que una persona de confianza lo sepa?',
aviso: 'Este secreto le hace daño cada día. Ayudarle de verdad es que una persona de confianza lo sepa.' },
                { texto: 'Voy yo a pelearme con los que se meten con él.',
segura: false,
pista: '¿Pelear lo empeora y te mete a ti en el problema?',
aviso: 'Pelear lo empeora y te mete a ti en el problema. Acompañarle a contarlo sí funciona.' }
              ] },
              { tipo: 'msg', texto: 'Te contesta: "¿Y si se enteran de que lo he contado y es peor?"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Le explico que las personas de confianza saben protegerle, y que no está solo.', segura: true,
                  avisoSeguro: 'Así es: las personas de confianza saben actuar sin señalarle. Y si él no puede, puedes contarlo tú por él.' },
                { texto: 'Le doy la razón y lo dejamos estar.',
segura: false,
pista: '¿De verdad: dejarlo estar significa que siga sufriendo cada día?',
aviso: 'Dejarlo estar significa que siga sufriendo cada día. Contarlo es la salida, no el peligro.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Acompañarle a contárselo a una persona de confianza',
                confirmacion: 'Eres un amigo de verdad. Contarlo juntos es mucho más fácil que sufrirlo solo.' }
            ],
            regla: 'Si un amigo te cuenta que le acosan y te pide secreto, ayudarle es acompañarle a contarlo. Ese secreto no se guarda.'
          },
          {
            contacto: 'Grupo de clase',
            relacion: 'Compañeros de tu clase',
            pasos: [
              { tipo: 'msg', texto: 'Llega una encuesta al grupo: "Vota: ¿quién es el más feo de la clase? 😂"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No voto y digo que esa encuesta no tiene gracia.', segura: true,
                  avisoSeguro: 'Esas encuestas siempre terminan con alguien pasándolo fatal. No votar y decirlo es pararlo a tiempo.' },
                { texto: 'Voto a alguien que me cae mal, es solo una encuesta.',
segura: false,
pista: '¿De verdad: no es "solo una encuesta": alguien va a leer que su clase le votó como el…',
aviso: 'No es "solo una encuesta": alguien va a leer que su clase le votó como el más feo. Eso deja marca.' },
                { texto: 'No voto, pero miro los resultados con curiosidad.',
segura: false,
pista: '¿De verdad: mirar sin frenar también mantiene el juego vivo?',
aviso: 'Mirar sin frenar también mantiene el juego vivo. Puedes hacer más: decir que no está bien.' }
              ] },
              { tipo: 'msg', texto: 'Los votos van subiendo y ya hay un "ganador" señalado.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Aviso a una persona de confianza antes de que el resultado haga más daño.', segura: true,
                  avisoSeguro: 'Avisar rápido puede cortar la encuesta antes de que el "ganador" la vea. Eso es proteger.' },
                { texto: 'Espero a ver en qué queda la cosa.',
segura: false,
pista: '¿De verdad: cada hora que pasa, más gente vota y más daño hace?',
aviso: 'Cada hora que pasa, más gente vota y más daño hace. Avisar pronto lo corta.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Avisar a una persona de confianza',
                confirmacion: 'Muy bien. Has cortado una burla colectiva antes de que hiciera más daño.' }
            ],
            regla: 'Las encuestas para burlarse ("el más feo", "el más tonto") son acoso en grupo. No votes y avisa a una persona de confianza.'
          }
        ]
      }
    ],

    normas: [
      { picto: '😞', texto: 'Si te insultan muchas veces en un chat, no es una broma: es acoso. Cuéntaselo a una persona de confianza.' },
      { picto: '🚫', texto: 'Que te excluyan a propósito de un grupo también es acoso. Cuéntaselo a una persona de confianza.' },
      { picto: '🗯️', texto: 'Los rumores falsos hacen daño. No es tu culpa. Cuéntaselo a una persona de confianza.' },
      { picto: '📸', texto: 'Compartir una foto tuya para reírse no está bien, aunque digan que es broma. Y reenviar burlas también es acosar.' },
      { picto: '😨', texto: 'Si alguien te amenaza, cuéntaselo enseguida a una persona de confianza, aunque te pidan que no lo hagas.' },
      { picto: '👀', texto: 'Si ves que acosan a alguien, no participes. Contarlo ayuda a proteger a esa persona.' },
      { picto: '🛡️', texto: 'Si un chat te hace sentir mal: para, guarda los mensajes y cuéntaselo a una persona de confianza. Pedir ayuda siempre está bien.' }
    ]
  },

  en: {
    escenarios: [
      {
        id: 'insultos',
        titulo: "I'm being insulted in the chat",
        picto: '😞',
        variantes: [
          {
            contacto: 'Class Group 5B',
            relacion: 'Your class group chat',
            pasos: [
              { tipo: 'msg', texto: 'Someone in the group writes: "You\'re stupid, you can\'t do anything right."' },
              { tipo: 'msg', texto: 'Another classmate laughs and writes: "Haha, it\'s true."' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't reply. I'm going to tell a trusted person.", segura: true,
                  avisoSeguro: "Telling a trusted person is the best thing to do. Being insulted again and again is bullying, and it is not your fault." },
                { texto: 'I insult them back, so they know how it feels.', segura: false,
                  aviso: "Insulting them back doesn't make it stop, and can make things worse. It's better to tell a trusted person." },
                { texto: "I say nothing and let it continue.", segura: false,
                  aviso: "Staying quiet doesn't make bullying stop on its own. Telling someone you trust really does help." }
              ] },
              { tipo: 'msg', texto: 'The group keeps writing mean things about you, day after day.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I save the messages (a screenshot) and show them to a trusted person.', segura: true,
                  avisoSeguro: 'Saving the evidence helps the trusted person understand what is happening and help you better.' },
                { texto: 'I delete the chat so I don\'t see it anymore.', segura: false,
                  aviso: "Deleting it doesn't make it stop. It's better to save it and tell someone, so a trusted person can help." }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: "You told a trusted person. That's the right thing to do. Bullying is not okay, and it is not your fault." }
            ],
            regla: "If someone insults you many times in a chat, it's not a joke: it's bullying. Always tell a trusted person. It is never your fault."
          },
          {
            contacto: 'Workshop mates',
            relacion: 'Colleagues from your workshop',
            pasos: [
              { tipo: 'msg', texto: 'In the workshop group someone writes: "Here comes the slow one. Going to take a thousand hours again today?"' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't answer the nickname. I'm going to tell someone I trust.", segura: true,
                  avisoSeguro: 'A nickname that hurts and gets repeated is not a joke: it is bullying. Telling someone is the right move.' },
                { texto: "I'll give him a worse nickname, see how he likes it.",
segura: false,
pista: '¿De verdad: answering with another nickname stretches the fight and fixes nothing?',
aviso: 'Answering with another nickname stretches the fight and fixes nothing. Better tell someone you trust.' },
                { texto: "I laugh along so it doesn't show that it bothers me.",
segura: false,
pista: '¿De verdad: you do not have to pretend it does not hurt?',
aviso: 'You do not have to pretend it does not hurt. Working at your own pace is nothing to mock.' }
              ] },
              { tipo: 'msg', texto: 'Every day they call you that nickname, even though you asked them to stop.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I save the messages and show them to the supervisor or my family.', segura: true,
                  avisoSeguro: 'When you ask them to stop and they do not, it is time to tell with proof. The supervisor is there to help you.' },
                { texto: 'I stop looking at the workshop group forever.',
segura: false,
pista: '¿De verdad: not looking at the group cuts you off from work, and the mocking continues?',
aviso: 'Not looking at the group cuts you off from work, and the mocking continues. Telling someone can really stop it.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell someone I trust',
                confirmacion: 'Well done. At the workshop, the supervisor and your family can make this stop.' }
            ],
            regla: 'A nickname that hurts you and gets repeated is bullying, even if they call it a joke. Ask them to stop and tell someone you trust.'
          },
          {
            contacto: 'Class chat',
            relacion: 'Classmates from your class',
            pasos: [
              { tipo: 'msg', texto: 'You write a message in the group and someone replies: "Haha look how he writes, he can\'t even make a sentence."' },
              { tipo: 'msg', texto: 'They copy your message and repeat it several times with laughter.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't answer the mocking and I tell a trusted person.", segura: true,
                  avisoSeguro: 'Laughing at how someone writes is bullying. Everyone learns at their own pace, and that is okay.' },
                { texto: 'I never write in the group again.',
segura: false,
pista: '¿De verdad: going quiet out of fear takes away your place?',
aviso: 'Going quiet out of fear takes away your place. The problem belongs to whoever mocks, not to you.' },
                { texto: 'I mock how someone else writes.',
segura: false,
pista: '¿De verdad: passing the mocking to someone else causes more harm?',
aviso: 'Passing the mocking to someone else causes more harm. Better tell a trusted person.' }
              ] },
              { tipo: 'msg', texto: 'The next day they do the same every time you write.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I calmly write that mocking is not okay, and I report it with screenshots.', segura: true,
                  avisoSeguro: 'Saying it calmly and reporting it with proof is the best combination. You are not alone with this.' },
                { texto: 'I apologise for writing badly.',
segura: false,
pista: '¿De verdad: you do not have to apologise for learning at your own pace?',
aviso: 'You do not have to apologise for learning at your own pace. Whoever mocks is the one acting wrong.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. Writing with mistakes is no reason for mockery; mocking is the real problem.' }
            ],
            regla: 'Laughing at how a person speaks or writes is bullying. Everyone learns at their own pace, and that is okay. Tell someone.'
          },
          {
            contacto: 'Iker_Class',
            relacion: 'A classmate of yours',
            pasos: [
              { tipo: 'msg', texto: 'Every time you play online he writes: "You\'re terrible. Leave the game, nobody wants you here."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I mute his chat in the game and tell a trusted person.', segura: true,
                  avisoSeguro: 'Muting and telling is the perfect play: you stop reading the insults and a trusted person can stop them.' },
                { texto: 'I insult him every time he loses.',
segura: false,
pista: '¿De verdad: trading insults turns the game into a fight?',
aviso: 'Trading insults turns the game into a fight. Muting and telling works better.' },
                { texto: 'I quit the game I love.',
segura: false,
pista: '¿De verdad: you do not have to give up what you love?',
aviso: 'You do not have to give up what you love. He is the one acting wrong, not you.' }
              ] },
              { tipo: 'msg', texto: 'He writes: "If you don\'t leave the game, tomorrow I\'ll tell everyone in class."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I save his message and show it to a trusted person today.', segura: true,
                  avisoSeguro: 'That threat is the perfect proof for a trusted person to act. Telling today is best.' },
                { texto: 'I leave the game so he says nothing.',
segura: false,
pista: '¿De verdad: if you obey a threat, more will come?',
aviso: 'If you obey a threat, more will come. Telling is what cuts them short.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. Bullying in online games is still bullying, and it can be stopped too.' }
            ],
            regla: 'Bullying in online games is still bullying. Mute the chat, save the messages and tell a trusted person.'
          }
        ]
      },

      {
        id: 'exclusion',
        titulo: "I'm being left out of the group",
        picto: '🚫',
        variantes: [
          {
            contacto: 'School friends',
            relacion: 'Friends from your class',
            pasos: [
              { tipo: 'msg', texto: 'You see a message: "We made a new group without you, don\'t tell them anything."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I feel bad. I tell someone I trust.', segura: true,
                  avisoSeguro: 'Telling someone helps. Being left out on purpose and secretly hurts, and you deserve help.' },
                { texto: 'I make a group too, to leave someone else out.', segura: false,
                  aviso: "Excluding someone else doesn't fix being excluded yourself. It's better to tell a trusted person." },
                { texto: "I don't make a big deal of it, it's probably nothing.",
segura: false,
pista: '¿De verdad: if it hurts, it does matter. You do not have to deal with it alone?',
aviso: 'If it hurts, it does matter. You do not have to deal with it alone.' }
              ] },
              { tipo: 'msg', texto: 'A classmate messages you directly: "Nobody wants you in the group, better stop trying."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I calmly reply that this is not okay, and I tell a trusted person.', segura: true,
                  avisoSeguro: 'You can reply calmly and also tell someone. Both things help the situation get better.' },
                { texto: 'I beg them to let me into the group.',
segura: false,
pista: '¿De verdad: you do not have to beg to be treated well?',
aviso: 'You do not have to beg to be treated well. Tell someone you trust.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. A trusted person can help the situation change.' }
            ],
            regla: 'Being deliberately left out of a group is also a form of bullying. Tell a trusted person.'
          },
          {
            contacto: 'Birthday Group',
            relacion: 'Girls from your class',
            pasos: [
              { tipo: 'msg', texto: 'In the group they discuss a birthday: "We\'re all going on Saturday. Well, all except one… you know who. 😏"' },
              { tipo: 'eleccion', opciones: [
                { texto: "It hurts. I'm going to tell someone I trust.", segura: true,
                  avisoSeguro: 'Leaving you out on purpose and mocking it is not an accident: it is exclusion. Telling helps.' },
                { texto: 'I ask a thousand times if I can come, please, please.',
segura: false,
pista: '¿De verdad: you do not have to beg to be invited?',
aviso: 'You do not have to beg to be invited. You deserve friends who want you there.' },
                { texto: 'I write something mean about the party to get back at them.',
segura: false,
pista: '¿De verdad: getting back at them puts you at their level and makes things worse?',
aviso: 'Getting back at them puts you at their level and makes things worse. Better tell someone.' }
              ] },
              { tipo: 'msg', texto: 'On Saturday they post photos of the party and tag you: "Shame you didn\'t come! 😂"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I save the messages and show them to a trusted person.', segura: true,
                  avisoSeguro: 'Mocking on top of excluding makes it even clearer. With proof, a trusted person can act.' },
                { texto: 'I reply that the party was surely super boring.',
segura: false,
pista: '¿De verdad: replying with scorn stretches the fight. Telling a trusted person can actually change things?',
aviso: 'Replying with scorn stretches the fight. Telling a trusted person can actually change things.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. Nobody deserves to be left out for laughs. A trusted person can help.' }
            ],
            regla: 'Leaving someone out on purpose and laughing about it is bullying. Do not beg: tell someone you trust.'
          },
          {
            contacto: 'Workshop mates',
            relacion: 'Colleagues from your workshop',
            pasos: [
              { tipo: 'msg', texto: 'You discover there is a workshop group where they announce breaks and plans… and you were never added.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I calmly ask why I am not in it, and I tell the supervisor.', segura: true,
                  avisoSeguro: 'Asking calmly is fine, and the supervisor should know you are being left out of work announcements.' },
                { texto: "I say nothing, maybe there is no room in the group.",
segura: false,
pista: '¿De verdad: there is always room in a group. Leaving you out of work announcements is not okay?',
aviso: 'There is always room in a group. Leaving you out of work announcements is not okay.' }
              ] },
              { tipo: 'msg', texto: 'A colleague says: "That group is just for the usual crowd, you don\'t belong there."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I tell the supervisor or my family. It is my work too.', segura: true,
                  avisoSeguro: 'Workshop announcements belong to everyone. Excluding you on purpose is a problem the supervisor must fix.' },
                { texto: 'I apologise for having asked.',
segura: false,
pista: '¿De verdad: you did nothing wrong by asking. Whoever excludes is the one acting wrong?',
aviso: 'You did nothing wrong by asking. Whoever excludes is the one acting wrong.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell the supervisor or my family',
                confirmacion: 'Well done. Work announcements are for everyone, and you are part of the team.' }
            ],
            regla: 'Being left out of the groups where class or work news is shared is also exclusion. Tell someone.'
          },
          {
            contacto: 'Game team',
            relacion: 'Schoolmates you know',
            pasos: [
              { tipo: 'msg', texto: 'Every time you join the game, they kick you out of the match: "Oops, he crashed again. 😂"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I realise it is on purpose. I tell a trusted person.', segura: true,
                  avisoSeguro: 'Kicking you out every time "as a joke" is exclusion on purpose. Telling is the right move.' },
                { texto: 'I keep joining over and over without saying anything.',
segura: false,
pista: '¿De verdad: if they kick you on purpose, insisting in silence does not fix it?',
aviso: 'If they kick you on purpose, insisting in silence does not fix it. Tell someone.' },
                { texto: 'I try to kick them out instead.',
segura: false,
pista: '¿De verdad: kicking back turns the game into a war?',
aviso: 'Kicking back turns the game into a war. Telling works better.' }
              ] },
              { tipo: 'msg', texto: 'In class they laugh: "What\'s wrong, can\'t even join a match?"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I calmly reply that I know what they are doing, and I tell someone.', segura: true,
                  avisoSeguro: 'Naming what they do, calmly and without fighting, takes their fun away. And telling stops it.' },
                { texto: 'I swallow my anger and tell nobody.',
segura: false,
pista: '¿De verdad: holding it in silence does not make it stop?',
aviso: 'Holding it in silence does not make it stop. You deserve to play like everyone else.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. Kicking you out of the game on purpose again and again is not a joke.' }
            ],
            regla: 'Always kicking you out of the game "as a joke" is exclusion on purpose. It is not on you: tell a trusted person.'
          }
        ]
      },

      {
        id: 'rumores',
        titulo: 'People are spreading lies about me',
        picto: '🗯️',
        variantes: [
          {
            contacto: 'Class group',
            relacion: 'Classmates from your class',
            pasos: [
              { tipo: 'msg', texto: 'A classmate writes: "I heard they did something awful, should I tell everyone?"' },
              { tipo: 'msg', texto: 'Several classmates reply: "Tell us! Tell us!"' },
              { tipo: 'eleccion', opciones: [
                { texto: "I calmly write that it isn't true, and I tell a trusted person.", segura: true,
                  avisoSeguro: "It's okay to calmly set the record straight. And telling a trusted person helps it stop." },
                { texto: 'I start spreading lies about her too.', segura: false,
                  aviso: "Spreading lies about someone else doesn't fix anything, and causes more harm. It's better to tell a trusted person." },
                { texto: "I say nothing, even though it isn't true.", segura: false,
                  aviso: "You can calmly say it isn't true. And most importantly, tell someone you trust." }
              ] },
              { tipo: 'msg', texto: 'The rumor keeps spreading and some classmates give you strange looks.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I tell a trusted person so they can help me.', segura: true,
                  avisoSeguro: 'A rumor that keeps spreading needs a trusted person\'s help to stop it properly.' },
                { texto: "I stop going to class so I don't see them.", segura: false,
                  aviso: "Avoiding class doesn't solve the real problem. A trusted person can help the rumor stop." }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. A trusted person can help set the record straight and stop the rumors.' }
            ],
            regla: 'False rumors hurt too. It is not your fault that people spread them. Tell a trusted person.'
          },
          {
            contacto: 'Class group',
            relacion: 'Classmates from your class',
            pasos: [
              { tipo: 'msg', texto: 'Someone writes in the group: "Do you know who they have a crush on? I\'ll say it so everyone can laugh!"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I write that this is private, and I tell a trusted person.', segura: true,
                  avisoSeguro: 'Your feelings are yours. Airing them for laughs is a form of bullying.' },
                { texto: "I say who someone else has a crush on, to move the spotlight.",
segura: false,
pista: '¿De verdad: moving the spotlight hurts that person the same way?',
aviso: 'Moving the spotlight hurts that person the same way. Better tell a trusted person.' },
                { texto: 'I deny everything, shouting angrily.',
segura: false,
pista: '¿De verdad: shouting gives them exactly the reaction they want?',
aviso: 'Shouting gives them exactly the reaction they want. Staying calm and telling stops it better.' }
              ] },
              { tipo: 'msg', texto: 'They start writing your name with hearts and laughter all over the group.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't react to the laughter and I report it with screenshots.", segura: true,
                  avisoSeguro: 'Without your reaction, the "fun" runs out sooner. And screenshots help the trusted person act.' },
                { texto: 'I leave the class group forever without telling anyone.',
segura: false,
pista: '¿De verdad: leaving without telling puts you out of your own group and the problem continues?',
aviso: 'Leaving without telling puts you out of your own group and the problem continues. Telling can stop it.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. Laughing at someone\'s feelings is never okay.' }
            ],
            regla: 'Your feelings are private. Airing them in a group for laughs is bullying. Tell a trusted person.'
          },
          {
            contacto: 'Former friend',
            relacion: 'A friend from your class',
            pasos: [
              { tipo: 'msg', texto: 'You told a friend a secret. Today you see he shared it in the big group, with laughter.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I calmly tell him that hurt me, and I tell a trusted person.', segura: true,
                  avisoSeguro: 'Saying how you feel is right, and a trusted person can help stop the secret from spreading.' },
                { texto: 'I share an even worse secret of his.',
segura: false,
pista: '¿De verdad: betraying his secret turns you into the very thing that hurt you?',
aviso: 'Betraying his secret turns you into the very thing that hurt you. Do not enter that wheel.' },
                { texto: "I act as if I don't care.",
segura: false,
pista: '¿De verdad: it does matter: it was your secret. You do not have to pretend it does not…',
aviso: 'It does matter: it was your secret. You do not have to pretend it does not hurt.' }
              ] },
              { tipo: 'msg', texto: 'He writes: "It was just a joke, don\'t be mad. Don\'t tell anyone, okay?"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I tell anyway. Asking for silence after causing harm does not count.', segura: true,
                  avisoSeguro: 'Exactly: whoever causes harm and asks for silence knows they did wrong. Telling is right.' },
                { texto: "Okay, I won't tell anyone so he doesn't get angry.",
segura: false,
pista: '¿De verdad: protecting the person who hurt you does not protect you?',
aviso: 'Protecting the person who hurt you does not protect you. Tell a trusted person.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: "Well done. Sharing someone's secret for laughs is not a joke." }
            ],
            regla: "Sharing another person's secret for laughs is a betrayal, not a joke. If it happens to you, tell a trusted person."
          },
          {
            contacto: 'Group 6A',
            relacion: 'Students from another class',
            pasos: [
              { tipo: 'msg', texto: 'In a group they write: "He\'s the one who broke the gym window. Tomorrow we\'re telling the teacher."' },
              { tipo: 'msg', texto: 'You were not even there that day.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I get ahead of it: I tell a trusted person first, with the truth.', segura: true,
                  avisoSeguro: 'Getting ahead with the truth is the best defence against a false accusation.' },
                { texto: 'I wait and hope they forget.',
segura: false,
pista: '¿De verdad: waiting lets the lie grow. Telling the truth first protects you?',
aviso: 'Waiting lets the lie grow. Telling the truth first protects you.' },
                { texto: 'I threaten to accuse them of something else.',
segura: false,
pista: '¿De verdad: answering with another accusation pulls you into the problem?',
aviso: 'Answering with another accusation pulls you into the problem. The truth and a trusted person pull you out.' }
              ] },
              { tipo: 'msg', texto: 'They message you: "If you say it wasn\'t you, it will be worse."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I save that message: it proves they want to frame me. Telling now.', segura: true,
                  avisoSeguro: 'That message exposes the trap. With it, the trusted person will see clearly what is going on.' },
                { texto: 'I stay quiet and accept the blame so they leave me alone.',
segura: false,
pista: '¿De verdad: accepting blame that is not yours will not bring peace: they will ask for more?',
aviso: 'Accepting blame that is not yours will not bring peace: they will ask for more. The truth protects you.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell the truth to a trusted person right now',
                confirmacion: 'Well done. You told the truth first and the saved message proved everything.' }
            ],
            regla: 'If you are accused of something you did not do, do not wait: tell a trusted person the truth first and save the messages.'
          }
        ]
      },

      {
        id: 'foto',
        titulo: "They're laughing at a photo of me",
        picto: '📸',
        variantes: [
          {
            contacto: 'Class group',
            relacion: 'Classmates from your class',
            pasos: [
              { tipo: 'msg', texto: 'Someone shares an unflattering photo of you and writes: "Look at this face, haha."' },
              { tipo: 'msg', texto: 'Several classmates add laughing emojis.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I ask them to delete it, and I tell a trusted person.', segura: true,
                  avisoSeguro: "You can ask them to delete it and also tell a trusted person. Laughing at a photo of you like that isn't okay." },
                { texto: 'I share a photo of them to laugh too.', segura: false,
                  aviso: "Doing the same thing doesn't fix anything and causes more harm. It's better to tell a trusted person." },
                { texto: "I laugh along so it doesn't show that it hurts.", segura: false,
                  aviso: "You don't have to pretend it doesn't hurt. Telling a trusted person is what really helps." }
              ] },
              { tipo: 'msg', texto: 'The photo keeps getting shared with more people.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I save the message and show it to a trusted person.', segura: true,
                  avisoSeguro: 'Saving what happened helps the trusted person act on it better.' },
                { texto: 'I delete my account so they can\'t find me.',
segura: false,
pista: '¿De verdad: you do not have to disappear. A trusted person can help get the photo taken down…',
aviso: 'You do not have to disappear. A trusted person can help get the photo taken down and stop the mocking.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. A trusted person can help get the photo removed and talk to whoever shared it.' }
            ],
            regla: "Sharing a photo of you to laugh at you is not okay, even if they call it a joke. Tell a trusted person."
          },
          {
            contacto: 'Lunchroom group',
            relacion: 'Schoolmates of yours',
            pasos: [
              { tipo: 'msg', texto: 'Someone took a photo of you in the lunchroom without you noticing, eating with your mouth full.' },
              { tipo: 'msg', texto: 'They sent it to the group: "Look how hungry he was. 😂"' },
              { tipo: 'eleccion', opciones: [
                { texto: "I write that I didn't give permission for that photo, and I tell someone.", segura: true,
                  avisoSeguro: 'Taking photos of you without permission is already wrong; sharing them for laughs, much worse. Telling is right.' },
                { texto: 'I take photos of them eating, see how they like it.',
segura: false,
pista: '¿De verdad: doing the same multiplies the problem. Better ask them to delete it and tell someone?',
aviso: 'Doing the same multiplies the problem. Better ask them to delete it and tell someone.' },
                { texto: "From tomorrow I'll eat in a corner so nobody photographs me.",
segura: false,
pista: '¿De verdad: hiding is not the answer: you did nothing wrong?',
aviso: 'Hiding is not the answer: you did nothing wrong. Telling someone can stop it.' }
              ] },
              { tipo: 'msg', texto: 'Someone turns it into a meme and sends it again.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I save the meme as proof and show a trusted person today.', segura: true,
                  avisoSeguro: 'Every re-send is one more proof. A trusted person can get it all deleted and talk to whoever did it.' },
                { texto: 'I privately ask each person to delete it, telling nobody else.',
segura: false,
pista: '¿De verdad: asking each one alone is exhausting and rarely works?',
aviso: 'Asking each one alone is exhausting and rarely works. A trusted person has more power to stop it.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. Nobody may photograph you without permission and share it for laughs.' }
            ],
            regla: 'Nobody may take photos of you without permission or share them to mock you. Save the proof and tell someone.'
          },
          {
            contacto: 'Class group',
            relacion: 'Classmates from your class',
            pasos: [
              { tipo: 'msg', texto: 'They made a sticker with your face and use it in the group to mock you every day.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I ask them to stop using it, and I tell a trusted person.', segura: true,
                  avisoSeguro: 'A montage of your face made for mocking is bullying, even if it seems like "just a sticker". Telling helps.' },
                { texto: 'I make stickers of them to get my own back.',
segura: false,
pista: '¿De verdad: answering with more montages stretches the mocking for everyone?',
aviso: 'Answering with more montages stretches the mocking for everyone. Better tell a trusted person.' },
                { texto: 'I play along using my own sticker.',
segura: false,
pista: '¿De verdad: playing along does not make it stop, even if it seems to?',
aviso: 'Playing along does not make it stop, even if it seems to. If it hurts, tell someone.' }
              ] },
              { tipo: 'msg', texto: 'They say: "It\'s a tribute, don\'t you find it funny? You have no sense of humour."' },
              { tipo: 'eleccion', opciones: [
                { texto: "I calmly say: if it isn't funny to me, it isn't a joke. And I tell someone.", segura: true,
                  avisoSeguro: 'Exactly: jokes are funny to EVERYONE, including you. Otherwise it is mockery, and you report it.' },
                { texto: 'Maybe they are right and I have no humour…',
segura: false,
pista: '¿De verdad: it is not a lack of humour: they laugh AT you, not WITH you?',
aviso: 'It is not a lack of humour: they laugh AT you, not WITH you. That difference is everything.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. A joke that is not funny to everyone is not a joke.' }
            ],
            regla: 'If a "joke" with your image is not funny to you, it is not a joke: it is mockery. Tell a trusted person.'
          },
          {
            contacto: 'Classmate',
            relacion: 'A classmate of yours',
            pasos: [
              { tipo: 'msg', texto: 'He sends you an embarrassing photo of another classmate: "Send it to the big group, it\'s brilliant! 😂"' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't forward it. Forwarding mockery is bullying too.", segura: true,
                  avisoSeguro: 'Exactly: whoever forwards mockery becomes part of the bullying. Stopping it in your hands protects her.' },
                { texto: 'I forward it, everyone has it already anyway.',
segura: false,
pista: '¿De verdad: "Everyone has it already" is the usual excuse?',
aviso: '"Everyone has it already" is the usual excuse. Every forward causes more harm.' },
                { texto: "I don't forward it, but I laugh with him in private.",
segura: false,
pista: '¿De verdad: laughing along also encourages him to continue. You can do more: tell someone?',
aviso: 'Laughing along also encourages him to continue. You can do more: tell someone.' }
              ] },
              { tipo: 'msg', texto: 'He insists: "Have you sent it yet? Don\'t be boring."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I say no, warn my classmate and tell a trusted person.', segura: true,
                  avisoSeguro: 'Warning the person affected and a trusted person is real protection. "Boring" is a tiny price.' },
                { texto: 'I send it so he stops insisting.',
segura: false,
pista: 'Si Giving in to insistence hurts another person. Saying, ¿already helps her?',
aviso: 'Giving in to insistence hurts another person. Saying no already helps her.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Warn my classmate and tell someone',
                confirmacion: 'Very well done. You cut the chain and protected your classmate.' }
            ],
            regla: 'Never forward photos that mock someone: forwarding is bullying too. Warn the person and tell a trusted person.'
          },
          {
            contacto: 'School group',
            relacion: 'Schoolmates of yours',
            pasos: [
              { tipo: 'msg', texto: '"Send us a photo of yourself making silly faces, it\'s for a group meme. Everyone has done it."' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't send photos for memes. You can never take them back.", segura: true,
                  avisoSeguro: 'A "funny" photo of you can end up where you least imagine. Once sent, you no longer control it.' },
                { texto: "If everyone has done it, I'll send one too.",
segura: false,
pista: '¿De verdad: "Everyone has done it" is almost never true, and even if it were: your photo is…',
aviso: '"Everyone has done it" is almost never true, and even if it were: your photo is yours. Do not send it.' }
              ] },
              { tipo: 'msg', texto: '"Come on, don\'t be boring. It\'s just for a laugh."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'They can laugh at something else. My face is not a meme.', segura: true,
                  avisoSeguro: 'Well said. You can laugh WITH them without giving away your image forever.' },
                { texto: 'Fine, one silly one and that is it.',
segura: false,
pista: '¿De verdad: that "one silly one" can reappear years later?',
aviso: 'That "one silly one" can reappear years later. Sent photos can never truly be deleted.' }
              ] },
              { tipo: 'accion', texto: '🚫 Not send the photo and tell someone if they insist',
                confirmacion: 'Well done. Your image is yours, and you do not have to give it away to be liked.' }
            ],
            regla: 'Do not send photos of yourself "for memes": once sent you no longer control them. If they insist, tell a trusted person.'
          }
        ]
      },

      {
        id: 'amenaza',
        titulo: "I'm being threatened in a chat",
        picto: '😨',
        variantes: [
          {
            contacto: 'Classmate',
            relacion: 'A classmate of yours',
            pasos: [
              { tipo: 'msg', texto: '"Tomorrow at break you\'ll see what\'s coming to you."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I tell a trusted person right away.', segura: true,
                  avisoSeguro: 'A threat should always be reported right away to a trusted person.' },
                { texto: 'I threaten them back.',
segura: false,
pista: '¿De verdad: threatening them back can make things worse. Tell a trusted person right now?',
aviso: 'Threatening them back can make things worse. Tell a trusted person right now.' },
                { texto: "I skip class tomorrow to avoid it.", segura: false,
                  aviso: "Missing class doesn't solve the real problem. Tell a trusted person so they can truly protect you." }
              ] },
              { tipo: 'msg', texto: '"And don\'t you dare tell anyone."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I tell a trusted person anyway. That is the most important thing.', segura: true,
                  avisoSeguro: 'Being asked to keep it secret is another sign you should tell someone. A trusted person can protect you.' },
                { texto: "I don't tell anyone, just like they said.", segura: false,
                  aviso: "When someone asks you to keep something scary secret, you should always tell a trusted person." }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person right now',
                confirmacion: 'Well done. Telling a trusted person right away about a threat is the most important and the bravest thing to do.' }
            ],
            regla: "If someone threatens you, tell a trusted person right away, even if they ask you not to. If you have no one to tell, you can also report it at school or to the police."
          },
          {
            contacto: 'Classmate',
            relacion: 'A classmate of yours',
            pasos: [
              { tipo: 'msg', texto: '"Send me your finished homework every day. If not, you know what will happen to you."' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't send it and I tell a trusted person today.", segura: true,
                  avisoSeguro: 'Forcing you with threats to do their work is abuse. Telling right away stops it.' },
                { texto: "I send it, so he leaves me alone.",
segura: false,
pista: '¿De verdad: if you give in today, tomorrow he will ask for more?',
aviso: 'If you give in today, tomorrow he will ask for more. Threats only stop when a trusted person knows.' },
                { texto: 'I send him homework done wrong on purpose.',
segura: false,
pista: '¿De verdad: tricks stretch out the problem and can backfire on you?',
aviso: 'Tricks stretch out the problem and can backfire on you. Telling is safer.' }
              ] },
              { tipo: 'msg', texto: '"And quick, I need it before six."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I save his messages as proof and show them to a trusted person.', segura: true,
                  avisoSeguro: 'His own messages are the best proof. With them, the trusted person can act right away.' },
                { texto: 'I delete them to forget about it.',
segura: false,
pista: '¿De verdad: if you delete them, it will be your word against his?',
aviso: 'If you delete them, it will be your word against his. Save them and tell someone.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. Nobody can force you to do their work with threats.' }
            ],
            regla: "Forcing you with threats to do someone else's homework is abuse. Don't give in: save the messages and tell today. If you have no one to tell, you can also report it at school."
          },
          {
            contacto: 'Boy from another class',
            relacion: 'A boy from another class',
            pasos: [
              { tipo: 'msg', texto: '"Tomorrow you bring me your break money. If not, I\'ll be waiting for you outside."' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't give him anything and I tell a trusted person today.", segura: true,
                  avisoSeguro: 'Demanding money with threats is very serious. Telling today is how you stay protected tomorrow.' },
                { texto: 'I bring him the money to avoid trouble.',
segura: false,
pista: '¿De verdad: if you pay once, he will ask forever?',
aviso: 'If you pay once, he will ask forever. Real protection is a trusted person knowing about it.' },
                { texto: "I tell him I'll be waiting for him instead.",
segura: false,
pista: '¿De verdad: rising to the challenge can end very badly?',
aviso: 'Rising to the challenge can end very badly. Strength here is telling, not fighting.' }
              ] },
              { tipo: 'msg', texto: '"Don\'t even think of telling a teacher. I\'ll be watching you."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'That is exactly why I am telling now: a teacher and my family.', segura: true,
                  avisoSeguro: 'The more he insists on silence, the clearer it is that telling stops him. Well spotted.' },
                { texto: "I'd better keep quiet, I don't want him watching me.",
segura: false,
pista: '¿De verdad: silence leaves you alone with the fear. Telling puts the trusted people on your side, which is…',
aviso: 'Silence leaves you alone with the fear. Telling puts the trusted people on your side, which is where they belong.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a teacher and my family today',
                confirmacion: 'Well done. Demanding money with threats is one of the most important things to report right away.' }
            ],
            regla: 'If someone demands money with threats, do not pay: tell a teacher and your family today.'
          },
          {
            contacto: 'Class group',
            relacion: 'Classmates from your class',
            pasos: [
              { tipo: 'msg', texto: 'You saw some classmates picking on another student. Now they message you: "If you tell what you saw, you\'ll be next."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I tell a trusted person anyway: for him and for me.', segura: true,
                  avisoSeguro: 'Telling protects you both. Trusted people know how to handle it without pointing at you.' },
                { texto: "I keep quiet, I don't want to be next.",
segura: false,
pista: '¿De verdad: silence is exactly what they need to continue?',
aviso: 'Silence is exactly what they need to continue. Telling a trusted person protects you and your classmate.' },
                { texto: 'I promise silence in exchange for being left alone.',
segura: false,
pista: '¿De verdad: deals with people who threaten are never kept?',
aviso: 'Deals with people who threaten are never kept. Real protection comes from telling.' }
              ] },
              { tipo: 'msg', texto: '"Understood? Not a word."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I save the message and go talk to a trusted person now.', segura: true,
                  avisoSeguro: 'That written threat is the proof that undoes everything. Now it is the trusted people\' job, not yours.' },
                { texto: 'I reply "understood" and swallow it all.',
segura: false,
pista: '¿De verdad: you do not have to swallow anything. There are trusted people whose exact job is to help…',
aviso: 'You do not have to swallow anything. There are trusted people whose exact job is to help with this.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person everything',
                confirmacion: 'Very brave. Telling what you saw protects your classmate and you too.' }
            ],
            regla: 'If you are threatened into silence about what you saw, tell anyway: silence only protects the bully.'
          }
        ]
      },

      {
        id: 'testigo',
        titulo: "I'm asked to pick on someone else",
        picto: '👀',
        variantes: [
          {
            contacto: 'Class group',
            relacion: 'Classmates from your class',
            pasos: [
              { tipo: 'msg', texto: 'A classmate writes in the group: "Let\'s all pick on him, write something mean."' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't join in, and I tell a trusted person.", segura: true,
                  avisoSeguro: 'Not joining in and telling someone helps protect your classmate. That is being a good friend.' },
                { texto: 'I write something mean too, so I don\'t look bad to the group.',
segura: false,
pista: '¿De verdad: joining in so you don\'t look bad still hurts another person?',
aviso: 'Joining in so you don\'t look bad still hurts another person. Better not to join in, and tell someone.' },
                { texto: "I don't write anything, but I don't tell anyone either.",
segura: false,
pista: '¿De verdad: not joining in is already a step, but telling a trusted person helps protect your classmate…',
aviso: 'Not joining in is already a step, but telling a trusted person helps protect your classmate much more.' }
              ] },
              { tipo: 'msg', texto: 'Several classmates have already written mean things and expect you to as well.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I message him privately to say he's not alone, and I tell a trusted person.", segura: true,
                  avisoSeguro: 'Supporting someone who is struggling, and telling a trusted person, is the best way to help.' },
                { texto: 'I go along with the group so they don\'t turn on me.',
segura: false,
pista: '¿De verdad: going along with it still hurts another person?',
aviso: 'Going along with it still hurts another person. You can choose not to join in, and tell a trusted person.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Tell a trusted person',
                confirmacion: 'Well done. Telling someone helps protect your classmate, and you too.' }
            ],
            regla: "If you see someone being bullied, don't join in. Telling a trusted person helps protect that person."
          },
          {
            contacto: 'Class group',
            relacion: 'Classmates from your class',
            pasos: [
              { tipo: 'msg', texto: 'The group is laughing at a girl with cruel messages. They write to you: "You too, at least add a laughing emoji."' },
              { tipo: 'eleccion', opciones: [
                { texto: "I add nothing. A laughing emoji hurts too.", segura: true,
                  avisoSeguro: 'Exactly: every laughing emoji tells her the whole group is against her. Not joining already helps her.' },
                { texto: "I add the emoji, it's only an emoji.",
segura: false,
pista: '¿De verdad: for the person suffering, every laugh counts, even an emoji?',
aviso: 'For the person suffering, every laugh counts, even an emoji. There is no "small" mockery.' }
              ] },
              { tipo: 'msg', texto: 'The girl leaves the group. Someone writes: "There goes the crybaby."' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I message her privately to support her, and I tell a trusted person.', segura: true,
                  avisoSeguro: 'Your private message may be the most important thing she receives today. And telling makes it stop.' },
                { texto: "I do nothing, she'll get over it.",
segura: false,
pista: '¿De verdad: she may not get over it alone. A message from you and an informed trusted person change…',
aviso: 'She may not get over it alone. A message from you and an informed trusted person change a lot.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Support her and tell a trusted person',
                confirmacion: 'Well done. Supporting the person suffering and alerting a trusted person is exactly right.' }
            ],
            regla: 'A laughing emoji on mockery is joining in too. Support the person privately and tell a trusted person.'
          },
          {
            contacto: 'Your best friend',
            relacion: 'Your best friend',
            pasos: [
              { tipo: 'msg', texto: 'Your best friend writes: "Some kids from class pick on me every day. Don\'t tell anyone, I\'m embarrassed."' },
              { tipo: 'eleccion', opciones: [
                { texto: "I tell him that reporting isn't weakness, and I'll go with him to do it.", segura: true,
                  avisoSeguro: 'Going with him to tell is the best help. Bullying is not fixed in secret.' },
                { texto: 'I promise to keep the secret forever.',
segura: false,
pista: '¿De verdad: this secret hurts him every single day. Really helping means a trusted person finding out?',
aviso: 'This secret hurts him every single day. Really helping means a trusted person finding out.' },
                { texto: "I'll go fight the kids who pick on him.",
segura: false,
pista: '¿De verdad: fighting makes it worse and pulls you into the problem?',
aviso: 'Fighting makes it worse and pulls you into the problem. Going with him to tell does work.' }
              ] },
              { tipo: 'msg', texto: 'He replies: "What if they find out I told and it gets worse?"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I explain that trusted people know how to protect him, and he is not alone.', segura: true,
                  avisoSeguro: 'That is right: trusted people know how to act without exposing him. And if he cannot, you can tell for him.' },
                { texto: 'I agree with him and we let it be.',
segura: false,
pista: '¿De verdad: letting it be means he keeps suffering every day?',
aviso: 'Letting it be means he keeps suffering every day. Telling is the way out, not the danger.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Go with him to tell a trusted person',
                confirmacion: 'You are a true friend. Telling together is much easier than suffering alone.' }
            ],
            regla: 'If a friend tells you they are being bullied and asks for secrecy, helping means going with them to tell. That secret must not be kept.'
          },
          {
            contacto: 'Class group',
            relacion: 'Classmates from your class',
            pasos: [
              { tipo: 'msg', texto: 'A poll arrives in the group: "Vote: who is the ugliest in class? 😂"' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't vote and I say that poll isn't funny.", segura: true,
                  avisoSeguro: 'Those polls always end with someone feeling awful. Not voting and saying so stops it in time.' },
                { texto: "I vote for someone I don't like, it's just a poll.",
segura: false,
pista: '¿De verdad: it is not "just a poll": someone will read that their class voted them the ugliest?',
aviso: 'It is not "just a poll": someone will read that their class voted them the ugliest. That leaves a mark.' },
                { texto: "I don't vote, but I check the results out of curiosity.",
segura: false,
pista: '¿De verdad: watching without stopping it also keeps the game alive?',
aviso: 'Watching without stopping it also keeps the game alive. You can do more: say it is not okay.' }
              ] },
              { tipo: 'msg', texto: 'The votes keep coming and there is already a "winner" being pointed at.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I alert a trusted person before the result causes more harm.', segura: true,
                  avisoSeguro: 'Alerting quickly can cut the poll before the "winner" sees it. That is protecting someone.' },
                { texto: 'I wait to see how it ends.',
segura: false,
pista: '¿De verdad: every hour that passes, more people vote and more harm is done?',
aviso: 'Every hour that passes, more people vote and more harm is done. Alerting early cuts it short.' }
              ] },
              { tipo: 'accion', texto: '🗣️ Alert a trusted person',
                confirmacion: 'Well done. You cut a group mockery short before it caused more harm.' }
            ],
            regla: 'Polls made to mock ("the ugliest", "the dumbest") are group bullying. Do not vote and alert a trusted person.'
          }
        ]
      }
    ],

    normas: [
      { picto: '😞', texto: "If someone insults you many times in a chat, it's not a joke: it's bullying. Tell a trusted person." },
      { picto: '🚫', texto: 'Being deliberately left out of a group is also bullying. Tell a trusted person.' },
      { picto: '🗯️', texto: 'False rumors hurt too. It is not your fault. Tell a trusted person.' },
      { picto: '📸', texto: "Sharing a photo of you to laugh at you is not okay, even if they call it a joke. Forwarding mockery is bullying too." },
      { picto: '😨', texto: 'If someone threatens you, tell a trusted person right away, even if they ask you not to.' },
      { picto: '👀', texto: "If you see someone being bullied, don't join in. Telling someone helps protect that person." },
      { picto: '🛡️', texto: 'If a chat makes you feel bad: stop, save the messages and tell a trusted person. Asking for help is always okay.' }
    ]
  }
};
