/* ============================================================
   Datos: Entre Amigos (emociones en otros y conflictos sencillos).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ picto, situacion, opciones: string[3], correcta }] }] }
   Progresión (regla 13, un solo cambio por nivel): nivel 1→2 se
   mantiene en "identificar emoción" y solo introduce emociones menos
   comunes (sorprendido/avergonzado/aburrido) además de las básicas.
   Nivel 2→3 cambia de tarea (identificar → elegir la mejor
   respuesta ante un conflicto), empezando por los conflictos más
   simples y concretos — la única novedad real es la tarea, no
   también la dificultad dentro de ella. Nivel 3→4 se mantiene en
   "conflictos" y solo sube la sutileza emocional. Nivel 4→5 vuelve
   a cambiar de tarea (conflictos entre iguales → reconocer cuando
   un "amigo" manipula: secretismo, chantaje emocional, aislamiento,
   comparación). Complementa a tools/trust-circle (que además cubre
   amigo/compañero/conocido y la petición de dinero) y a
   tools/safe-chat (manipulación online).
   Para ampliar: añadir items al array del nivel correspondiente, en
   los dos idiomas. app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: '¿Cómo se siente?',
        estrellas: 1,
        items: [
          { picto: '😊', situacion: 'Tu amigo ha ganado un premio y sonríe mucho.', opciones: ['Contento', 'Triste', 'Enfadado'], correcta: 0 },
          { picto: '😢', situacion: 'A tu amiga se le ha roto su juguete favorito y llora.', opciones: ['Triste', 'Contento', 'Tranquilo'], correcta: 0 },
          { picto: '😠', situacion: 'Tu amigo grita porque alguien le ha quitado su sitio.', opciones: ['Enfadado', 'Cansado', 'Contento'], correcta: 0 },
          { picto: '😨', situacion: 'Tu amiga se esconde detrás de la puerta porque hay una tormenta.', opciones: ['Asustado', 'Contento', 'Tranquilo'], correcta: 0 },
          { picto: '😴', situacion: 'Tu amigo bosteza mucho después de correr todo el día.', opciones: ['Cansado', 'Enfadado', 'Asustado'], correcta: 0 },
          { picto: '😌', situacion: 'Tu amiga respira despacio y sonríe suavemente en el parque.', opciones: ['Tranquilo', 'Triste', 'Enfadado'], correcta: 0 },
          { picto: '😊', situacion: 'Tu amigo salta y aplaude porque es su cumpleaños.', opciones: ['Contento', 'Asustado', 'Cansado'], correcta: 0 },
          { picto: '😢', situacion: 'A tu amiga se le ha perdido su mochila y agacha la cabeza.', opciones: ['Triste', 'Tranquilo', 'Contento'], correcta: 0 },
          { picto: '😠', situacion: 'Tu amigo aprieta los puños porque perdió el juego.', opciones: ['Enfadado', 'Cansado', 'Tranquilo'], correcta: 0 },
          { picto: '😨', situacion: 'Tu amiga se tapa los ojos al ver una película de miedo.', opciones: ['Asustado', 'Contento', 'Cansado'], correcta: 0 },
          { picto: '😴', situacion: 'Tu amigo se queda dormido en el sofá por la tarde.', opciones: ['Cansado', 'Enfadado', 'Triste'], correcta: 0 },
          { picto: '😌', situacion: 'Tu amiga cierra los ojos y descansa tranquila en el jardín.', opciones: ['Tranquilo', 'Asustado', 'Enfadado'], correcta: 0 },
          { picto: '😊', situacion: 'Tu amigo se ríe mucho jugando con sus amigos.', opciones: ['Contento', 'Triste', 'Cansado'], correcta: 0 },
          { picto: '😢', situacion: 'Tu amiga tiene los ojos llorosos porque extraña a su familia.', opciones: ['Triste', 'Enfadado', 'Tranquilo'], correcta: 0 },
          { picto: '😠', situacion: 'Tu amigo golpea la mesa porque algo no le sale bien.', opciones: ['Enfadado', 'Asustado', 'Contento'], correcta: 0 },
          { picto: '😊', situacion: 'Tu amigo consigue por fin algo que llevaba tiempo intentando y da saltos de alegría.', opciones: ['Contento', 'Triste', 'Enfadado'], correcta: 0 },
          { picto: '😢', situacion: 'A tu amiga se le ha mojado el dibujo que había hecho con tanto cariño.', opciones: ['Triste', 'Contento', 'Enfadado'], correcta: 0 },
          { picto: '😠', situacion: 'Tu amigo cierra los puños porque le han interrumpido mientras hablaba.', opciones: ['Enfadado', 'Tranquilo', 'Cansado'], correcta: 0 },
          { picto: '😴', situacion: 'Tu amiga apenas puede mantener los ojos abiertos después de un día muy largo.', opciones: ['Cansado', 'Sorprendido', 'Enfadado'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Emociones menos comunes',
        estrellas: 2,
        items: [
          { picto: '😲', situacion: 'Tu amigo abre un regalo que no esperaba y se queda con la boca abierta.', opciones: ['Sorprendido', 'Triste', 'Cansado'], correcta: 0 },
          { picto: '😳', situacion: 'Tu amiga se cae delante de toda la clase y se pone roja.', opciones: ['Avergonzado', 'Contento', 'Enfadado'], correcta: 0 },
          { picto: '🥱', situacion: 'Tu amigo lleva media hora esperando y empieza a bostezar sin parar.', opciones: ['Aburrido', 'Asustado', 'Sorprendido'], correcta: 0 },
          { picto: '😲', situacion: 'Tu amiga ve a un mago sacar un conejo de la chistera y abre mucho los ojos.', opciones: ['Sorprendido', 'Tranquilo', 'Aburrido'], correcta: 0 },
          { picto: '😳', situacion: 'Tu amigo se equivoca al decir su nombre en público y se tapa la cara.', opciones: ['Avergonzado', 'Contento', 'Cansado'], correcta: 0 },
          { picto: '🥱', situacion: 'Tu amiga mira el reloj una y otra vez durante una clase muy larga.', opciones: ['Aburrido', 'Enfadado', 'Sorprendido'], correcta: 0 },
          { picto: '😲', situacion: 'Tu amigo llega a casa y ve que todos sus amigos le esperan para una fiesta sorpresa.', opciones: ['Sorprendido', 'Triste', 'Aburrido'], correcta: 0 },
          { picto: '😳', situacion: 'Tu amiga derrama el zumo encima de la mesa y todos la miran.', opciones: ['Avergonzado', 'Tranquilo', 'Sorprendido'], correcta: 0 },
          { picto: '🥱', situacion: 'Tu amigo ha visto la misma película tres veces y ya no le hace gracia.', opciones: ['Aburrido', 'Asustado', 'Contento'], correcta: 0 },
          { picto: '😲', situacion: 'Tu amiga abre la puerta y ve nieve por primera vez en su vida.', opciones: ['Sorprendido', 'Cansado', 'Avergonzado'], correcta: 0 },
          { picto: '😳', situacion: 'A tu amigo se le rompen los pantalones en el recreo y todos se ríen.', opciones: ['Avergonzado', 'Sorprendido', 'Tranquilo'], correcta: 0 },
          { picto: '🥱', situacion: 'Tu amiga no tiene nada que hacer en casa toda la tarde.', opciones: ['Aburrido', 'Enfadado', 'Avergonzado'], correcta: 0 },
          { picto: '😲', situacion: 'Tu amigo gana un premio con el que ni siquiera soñaba.', opciones: ['Sorprendido', 'Triste', 'Aburrido'], correcta: 0 },
          { picto: '😳', situacion: 'Tu amiga olvida las palabras de una canción delante de todos.', opciones: ['Avergonzado', 'Contento', 'Sorprendido'], correcta: 0 },
          { picto: '🥱', situacion: 'Tu amigo repite el mismo juego una y otra vez y ya no le divierte.', opciones: ['Aburrido', 'Asustado', 'Tranquilo'], correcta: 0 },
          { picto: '😲', situacion: 'Tu amigo ve que su equipo ha ganado el partido en el último segundo.', opciones: ['Sorprendido', 'Aburrido', 'Triste'], correcta: 0 },
          { picto: '😳', situacion: 'A tu amiga se le nota la comida en la cara y nadie se lo dice hasta el final.', opciones: ['Avergonzado', 'Sorprendido', 'Contento'], correcta: 0 },
          { picto: '🥱', situacion: 'Tu amigo lleva toda la tarde sin nada que hacer y mira el techo.', opciones: ['Aburrido', 'Sorprendido', 'Avergonzado'], correcta: 0 },
          { picto: '😳', situacion: 'Tu amiga tropieza al subir al escenario delante de todo el público.', opciones: ['Avergonzado', 'Tranquilo', 'Cansado'], correcta: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Nivel 3',
        descripcion: 'Pequeños conflictos',
        estrellas: 3,
        items: [
          { picto: '🤝', situacion: 'Dos amigos quieren el mismo columpio.', opciones: ['Se turnan para usarlo', 'Se pelean por él', 'Uno se va enfadado'], correcta: 0 },
          { picto: '🎨', situacion: 'Un amigo rompe sin querer el dibujo de otro.', opciones: ['Pide perdón y ayuda a repararlo', 'Se ríe y se va', 'Dice que no ha sido él'], correcta: 0 },
          { picto: '🎲', situacion: 'Dos amigos no se ponen de acuerdo en qué juego jugar.', opciones: ['Prueban un juego cada uno, por turnos', 'Cada uno juega solo, enfadado', 'Se gritan'], correcta: 0 },
          { picto: '😏', situacion: 'Un amigo se ríe de otro por equivocarse.', opciones: ['Le dice que no pasa nada, todos nos equivocamos', 'Se ríe también más fuerte', 'No dice nada y sigue riéndose'], correcta: 0 },
          { picto: '🚗', situacion: 'Dos hermanos quieren sentarse en el mismo sitio del coche.', opciones: ['Deciden turnarse cada viaje', 'Se empujan', 'Uno se enfada todo el viaje'], correcta: 0 },
          { picto: '✏️', situacion: 'Un amigo no quiere prestar su lápiz de color.', opciones: ['Se respeta su decisión y se busca otro color', 'Se lo quita a la fuerza', 'Se enfada y le insulta'], correcta: 0 },
          { picto: '😕', situacion: 'Dos amigas discuten porque una llegó tarde.', opciones: ['Hablan con calma de lo que ha pasado', 'Dejan de hablarse para siempre', 'Se gritan delante de todos'], correcta: 0 },
          { picto: '😡', situacion: 'Un amigo se enfada porque perdió en un juego de mesa.', opciones: ['Respira, se calma y felicita al otro', 'Tira el tablero', 'Deja de jugar, enfadado con todos'], correcta: 0 },
          { picto: '🚶', situacion: 'Dos amigos quieren ser los primeros en la fila.', opciones: ['Deciden quién va primero por turnos', 'Se empujan para pasar primero', 'Uno aparta al otro'], correcta: 0 },
          { picto: '🤫', situacion: 'Un amigo cuenta un secreto que le pidieron guardar.', opciones: ['Se disculpa y promete no volver a hacerlo', 'Dice que no importa', 'Cuenta otro secreto para no sentirse mal'], correcta: 0 },
          { picto: '⚽', situacion: 'Dos compañeros de equipo no se ponen de acuerdo en la estrategia.', opciones: ['Escuchan las dos ideas y eligen juntos', 'Cada uno juega a su manera sin hablar', 'Discuten delante de todo el equipo'], correcta: 0 },
          { picto: '😔', situacion: 'Un amigo se queda solo en el recreo.', opciones: ['Otro amigo le invita a jugar con el grupo', 'Nadie le dice nada', 'Se ríen de que esté solo'], correcta: 0 },
          { picto: '🎭', situacion: 'Dos amigas quieren el mismo disfraz para la fiesta.', opciones: ['Buscan otra opción entre las dos, juntas', 'Se pelean por el disfraz', 'Una se lo queda sin decir nada'], correcta: 0 },
          { picto: '🚶‍♂️', situacion: 'Un amigo empuja sin querer a otro sin darse cuenta.', opciones: ['Se disculpa enseguida', 'Sigue caminando sin decir nada', 'Se ríe de lo que pasó'], correcta: 0 },
          { picto: '📖', situacion: 'Dos amigos no están de acuerdo con el final de una historia que inventan juntos.', opciones: ['Juntan las dos ideas en una nueva', 'Cada uno cuenta su versión, enfadado', 'Uno decide todo sin preguntar al otro'], correcta: 0 },
          { picto: '🧩', situacion: 'Dos amigos quieren montar el mismo puzle a la vez.', opciones: ['Se turnan para poner las piezas', 'Se pelean por las piezas', 'Uno se lleva el puzle entero'], correcta: 0 },
          { picto: '🎧', situacion: 'Un amigo pone la música muy alta y molesta a otro que quiere leer.', opciones: ['Baja el volumen cuando se lo piden', 'Sube el volumen todavía más', 'Se enfada por que le digan algo'], correcta: 0 },
          { picto: '🍕', situacion: 'Dos amigos quieren el último trozo de pizza.', opciones: ['Lo comparten a partes iguales', 'Se pelean por él', 'Uno lo coge sin decir nada'], correcta: 0 },
          { picto: '📱', situacion: 'Un amigo usa el móvil de otro sin pedirlo primero.', opciones: ['Pide perdón y pregunta la próxima vez', 'Dice que no pasa nada por hacerlo', 'Se enfada porque le llaman la atención'], correcta: 0 }
        ]
      },
      {
        id: 4,
        nombre: 'Nivel 4',
        descripcion: 'Emociones y conflictos más difíciles',
        estrellas: 4,
        items: [
          { picto: '🥹', situacion: 'Tu amigo gana el juego pero ve que tú estás triste por perder.', opciones: ['Te anima y dice que la próxima vez lo harás mejor', 'Se burla de que hayas perdido', 'Deja de jugar contigo para siempre'], correcta: 0 },
          { picto: '🙏', situacion: 'Estás enfadado con un amigo, pero él te pide perdón de verdad.', opciones: ['Aceptas sus disculpas y habláis con calma', 'Sigues enfadado aunque se haya disculpado', 'Le devuelves el enfado con más fuerza'], correcta: 0 },
          { picto: '📦', situacion: 'Un amigo está triste porque se mudó de casa un compañero.', opciones: ['Le ayudas a mantener el contacto', 'Le dices que no le dé importancia', 'Te ríes de que esté triste'], correcta: 0 },
          { picto: '😟', situacion: 'Dos amigos tuyos están enfadados entre ellos y tú estás en medio.', opciones: ['Les ayudas a hablar y escucharse', 'Te pones del lado de uno para enfadar al otro', 'Te vas y dejas que se peleen'], correcta: 0 },
          { picto: '🎤', situacion: 'Un amigo se pone nervioso antes de hablar en público.', opciones: ['Le animas y le dices que lo hará bien', 'Te ríes de que esté nervioso', 'Le dices que no hable nunca en público'], correcta: 0 },
          { picto: '😒', situacion: 'Sientes celos porque tu amigo tiene un nuevo amigo.', opciones: ['Hablas de cómo te sientes en vez de guardarlo', 'Dejas de hablarle sin explicar por qué', 'Le dices cosas feas al nuevo amigo'], correcta: 0 },
          { picto: '😞', situacion: 'Un amigo comete un error que te afecta a ti.', opciones: ['Hablas con él con calma sobre lo ocurrido', 'Le gritas delante de todos', 'Dejas de confiar en él para siempre'], correcta: 0 },
          { picto: '😊', situacion: 'Tu amiga está feliz por algo, pero tú tuviste un mal día.', opciones: ['Te alegras por ella aunque estés cansado', 'Le pides que deje de estar contenta', 'Finges estar bien aunque no quieras hablar'], correcta: 0 },
          { picto: '🏆', situacion: 'Dos amigos compiten mucho y eso genera tensión entre ellos.', opciones: ['Recuerdan que jugar juntos importa más que ganar', 'Dejan de hablarse por la competición', 'Uno hace trampas para ganar siempre'], correcta: 0 },
          { picto: '😤', situacion: 'Un amigo te copia mucho y eso te molesta un poco.', opciones: ['Le explicas con calma cómo te sientes', 'Te enfadas y le apartas del grupo', 'Le copias tú también para molestarle'], correcta: 0 },
          { picto: '🤗', situacion: 'Tu amiga necesita espacio y tú quieres estar con ella todo el rato.', opciones: ['Respetas su espacio y confías en volver a estar juntas', 'Te enfadas porque no quiere estar contigo', 'La sigues aunque te pida estar sola'], correcta: 0 },
          { picto: '📝', situacion: 'Un compañero se equivoca en un trabajo en grupo y los demás se enfadan.', opciones: ['El grupo le ayuda a corregirlo entre todos', 'Le culpan delante de todos', 'Le excluyen del trabajo'], correcta: 0 },
          { picto: '🤝', situacion: 'Tienes un conflicto con un amigo y no sabéis cómo resolverlo solos.', opciones: ['Pedís ayuda a una persona de confianza', 'Seguís enfadados sin hablar nunca más', 'Dejáis que el problema crezca sin decir nada'], correcta: 0 },
          { picto: '😟', situacion: 'Un amigo está muy nervioso porque sus padres discuten en casa.', opciones: ['Le escuchas y le acompañas sin juzgar', 'Le dices que no es tu problema', 'Se lo cuentas a otros sin que él lo sepa'], correcta: 0 },
          { picto: '🤗', situacion: 'Dos amigos se disculpan después de una pelea y quieren seguir siendo amigos.', opciones: ['Os dais una segunda oportunidad y seguís jugando juntos', 'Decides que ya no puede ser tu amigo nunca más', 'Sigues recordándole la pelea todo el tiempo'], correcta: 0 },
          { picto: '🥲', situacion: 'Un amigo se entera de que tú también querías el mismo premio que ha ganado él.', opciones: ['Te pregunta cómo te sientes y te anima', 'No dice nada de lo que has sentido', 'Presume más todavía delante de ti'], correcta: 0 },
          { picto: '😣', situacion: 'Un amigo tuyo está nervioso porque tiene una prueba importante mañana.', opciones: ['Le ayudas a repasar y le animas', 'Le dices que seguro que le va mal', 'Le metes más presión hablando del tema'], correcta: 0 },
          { picto: '🫤', situacion: 'Sientes que un amigo siempre decide el plan y tú nunca opinas.', opciones: ['Le dices con calma que te gustaría decidir a veces', 'Aceptas siempre sin decir nada', 'Dejas de quedar con él sin explicar por qué'], correcta: 0 },
          { picto: '🤔', situacion: 'Un amigo te pide perdón pero tú no sabes si perdonarle todavía.', opciones: ['Le dices que necesitas un poco más de tiempo', 'Le perdonas aunque no lo sientas de verdad', 'Le dices que nunca le vas a perdonar'], correcta: 0 }
        ]
      },
      {
        id: 5,
        nombre: 'Nivel 5',
        descripcion: 'Amistad y manipulación',
        estrellas: 5,
        items: [
          { picto: '🤫', situacion: 'Un amigo te pide que le guardes un secreto que te hace sentir mal.', opciones: ['Le digo que ese secreto me preocupa y busco ayuda', 'Lo guardo aunque me sienta mal', 'Se lo cuento a todo el mundo para no cargar yo solo'], correcta: 0 },
          { picto: '😢', situacion: 'Un amigo dice que estará triste para siempre si no haces lo que él quiere.', opciones: ['Le digo que sus sentimientos no dependen solo de mí', 'Hago lo que quiere para que no esté triste', 'Le digo que deje de estar triste'], correcta: 0 },
          { picto: '🎭', situacion: 'Delante de otros te trata genial, pero cuando estáis solos te insulta.', opciones: ['Le digo que esa forma de tratarme no está bien', 'Pienso que en el fondo es buena persona y lo dejo pasar', 'Le insulto también cuando estamos solos'], correcta: 0 },
          { picto: '🎁', situacion: 'Un compañero te regala cosas caras y después te pide que le des tu paga cada semana.', opciones: ['Le digo que no acepto ese trato', 'Le doy la paga porque me hizo regalos primero', 'Le doy solo la mitad de la paga'], correcta: 0 },
          { picto: '👥', situacion: 'Un grupo de compañeros solo te invita cuando necesitan que hagas sus tareas.', opciones: ['Me doy cuenta y busco amistades donde también me valoren a mí', 'Sigo haciendo sus tareas para que me sigan invitando', 'Dejo de hacer sus tareas sin decir nada y me voy sin explicar'], correcta: 0 },
          { picto: '😠', situacion: 'Un amigo se enfada mucho si hablas con otras personas y te pide que dejes de hacerlo.', opciones: ['Le digo que puedo tener más de un amigo', 'Dejo de hablar con otras personas', 'Hablo con otras personas a escondidas'], correcta: 0 },
          { picto: '🙄', situacion: 'Cada vez que consigues algo bueno, un compañero le quita importancia o dice que él lo hace mejor.', opciones: ['Sigo alegrándome de mis logros aunque él los reste importancia', 'Dejo de contarle las cosas buenas que me pasan', 'Le quito importancia a sus logros también'], correcta: 0 },
          { picto: '🕵️', situacion: 'Un amigo lee tus mensajes sin permiso porque dice que “los amigos no tienen secretos”.', opciones: ['Le digo que mis mensajes son privados, sea quien sea', 'Le dejo leerlos para que no se enfade', 'Le leo los suyos también sin pedirle permiso'], correcta: 0 },
          { picto: '📵', situacion: 'Un amigo te dice que si tuvieras un móvil de verdad se lo dejarías cuando te lo pide.', opciones: ['Le digo que un móvil se puede prestar o no, según yo decida', 'Se lo dejo para que no piense que soy tacaño/a', 'Le presto el móvil solo si me presta algo suyo'], correcta: 0 },
          { picto: '😞', situacion: 'Un compañero te dice que sin él no tendrías ningún otro amigo.', opciones: ['Sé que puedo tener otras amistades, eso no depende de él', 'Le creo y me alejo de otras personas', 'Le digo lo mismo para que no se sienta mejor que yo'], correcta: 0 },
          { picto: '🎯', situacion: 'Un amigo te compara todo el rato con otras personas para que te sientas peor.', opciones: ['Le digo que no me gusta que me compare así', 'Me esfuerzo por ser como él quiere', 'Comparo yo también a otras personas'], correcta: 0 },
          { picto: '🤐', situacion: 'Un compañero amenaza con dejar de ser tu amigo si cuentas a tu familia lo que hacéis juntos.', opciones: ['Se lo cuento a mi familia de todas formas', 'No lo cuento por miedo a perder su amistad', 'Se lo cuento a otra persona pero no a mi familia'], correcta: 0 },
          { picto: '🧩', situacion: 'Un amigo solo quiere hacer siempre lo que él decide y nunca lo que tú propones.', opciones: ['Le digo que a veces me gustaría decidir yo también', 'Acepto siempre lo que él decide para no discutir', 'Dejo de proponer nada, aunque me moleste'], correcta: 0 },
          { picto: '💭', situacion: 'Un compañero te hace sentir culpable por pasar tiempo con tu familia en vez de con él.', opciones: ['Le digo que puedo estar con mi familia y seguir siendo su amigo', 'Dejo de ver a mi familia para no sentirme culpable', 'Le hago sentir culpable a él también'], correcta: 0 },
          { picto: '🌱', situacion: 'No sabes si un compañero es un verdadero amigo o solo se aprovecha de ti, y te preocupa.', opciones: ['Hablo con una persona de confianza para verlo con más claridad', 'Decido cortar la amistad sin hablarlo con nadie', 'Sigo igual, esperando que la situación mejore sola'], correcta: 0 },
          { picto: '📌', situacion: 'Un compañero te dice que si cambias de opinión sobre algo, dejará de contar contigo para todo.', opciones: ['Le digo que puedo cambiar de opinión si quiero', 'No cambio nunca de opinión por miedo a perderle', 'Cambio de opinión aunque no quiera'], correcta: 0 },
          { picto: '🗝️', situacion: 'Un amigo quiere saber la contraseña de tus redes sociales "para demostrar confianza".', opciones: ['Le digo que mi contraseña es solo mía', 'Se la doy para que confíe en mí', 'Le doy una contraseña falsa sin decir nada'], correcta: 0 },
          { picto: '📉', situacion: 'Cada vez que cuentas algo bueno que te ha pasado, un compañero cambia de tema enseguida.', opciones: ['Sigo contando las cosas buenas a otras personas que sí me escuchan', 'Dejo de contar cosas buenas para siempre', 'Le hago lo mismo cuando cuenta algo suyo'], correcta: 0 },
          { picto: '🔁', situacion: 'Un amigo repite que le debes una disculpa por algo que en realidad no hiciste.', opciones: ['Le digo con calma que no tengo que disculparme por algo que no hice', 'Me disculpo para que deje de insistir', 'Le grito para que pare de decirlo'], correcta: 0 }
        ]
      }
    ]
  },
  en: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: 'How does he feel?',
        estrellas: 1,
        items: [
          { picto: '😊', situacion: 'Your friend won a prize and is smiling a lot.', opciones: ['Happy', 'Sad', 'Angry'], correcta: 0 },
          { picto: '😢', situacion: "Your friend's favorite toy broke and she is crying.", opciones: ['Sad', 'Happy', 'Calm'], correcta: 0 },
          { picto: '😠', situacion: 'Your friend shouts because someone took his seat.', opciones: ['Angry', 'Tired', 'Happy'], correcta: 0 },
          { picto: '😨', situacion: 'Your friend hides behind the door because there is a storm.', opciones: ['Scared', 'Happy', 'Calm'], correcta: 0 },
          { picto: '😴', situacion: 'Your friend yawns a lot after running all day.', opciones: ['Tired', 'Angry', 'Scared'], correcta: 0 },
          { picto: '😌', situacion: 'Your friend breathes slowly and smiles gently in the park.', opciones: ['Calm', 'Sad', 'Angry'], correcta: 0 },
          { picto: '😊', situacion: 'Your friend jumps and claps because it is his birthday.', opciones: ['Happy', 'Scared', 'Tired'], correcta: 0 },
          { picto: '😢', situacion: 'Your friend lost her backpack and hangs her head.', opciones: ['Sad', 'Calm', 'Happy'], correcta: 0 },
          { picto: '😠', situacion: 'Your friend clenches his fists because he lost the game.', opciones: ['Angry', 'Tired', 'Calm'], correcta: 0 },
          { picto: '😨', situacion: 'Your friend covers her eyes watching a scary movie.', opciones: ['Scared', 'Happy', 'Tired'], correcta: 0 },
          { picto: '😴', situacion: 'Your friend falls asleep on the couch in the afternoon.', opciones: ['Tired', 'Angry', 'Sad'], correcta: 0 },
          { picto: '😌', situacion: 'Your friend closes her eyes and rests calmly in the garden.', opciones: ['Calm', 'Scared', 'Angry'], correcta: 0 },
          { picto: '😊', situacion: 'Your friend laughs a lot playing with his friends.', opciones: ['Happy', 'Sad', 'Tired'], correcta: 0 },
          { picto: '😢', situacion: "Your friend's eyes are teary because she misses her family.", opciones: ['Sad', 'Angry', 'Calm'], correcta: 0 },
          { picto: '😠', situacion: 'Your friend hits the table because something is not going well.', opciones: ['Angry', 'Scared', 'Happy'], correcta: 0 },
          { picto: '😊', situacion: 'Your friend finally achieves something he had been trying for a long time and jumps for joy.', opciones: ['Happy', 'Sad', 'Angry'], correcta: 0 },
          { picto: '😢', situacion: "Your friend's drawing, made with so much care, got wet.", opciones: ['Sad', 'Happy', 'Angry'], correcta: 0 },
          { picto: '😠', situacion: 'Your friend clenches his fists because he was interrupted while talking.', opciones: ['Angry', 'Calm', 'Tired'], correcta: 0 },
          { picto: '😴', situacion: 'Your friend can barely keep her eyes open after a very long day.', opciones: ['Tired', 'Surprised', 'Angry'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Less common feelings',
        estrellas: 2,
        items: [
          { picto: '😲', situacion: "Your friend opens a gift he wasn't expecting and his mouth drops open.", opciones: ['Surprised', 'Sad', 'Tired'], correcta: 0 },
          { picto: '😳', situacion: 'Your friend falls over in front of the whole class and turns red.', opciones: ['Embarrassed', 'Happy', 'Angry'], correcta: 0 },
          { picto: '🥱', situacion: 'Your friend has been waiting for half an hour and starts yawning non-stop.', opciones: ['Bored', 'Scared', 'Surprised'], correcta: 0 },
          { picto: '😲', situacion: 'Your friend watches a magician pull a rabbit out of a hat and her eyes go wide.', opciones: ['Surprised', 'Calm', 'Bored'], correcta: 0 },
          { picto: '😳', situacion: 'Your friend gets his own name wrong in public and covers his face.', opciones: ['Embarrassed', 'Happy', 'Tired'], correcta: 0 },
          { picto: '🥱', situacion: 'Your friend keeps checking the clock during a very long class.', opciones: ['Bored', 'Angry', 'Surprised'], correcta: 0 },
          { picto: '😲', situacion: 'Your friend comes home and finds all his friends waiting for a surprise party.', opciones: ['Surprised', 'Sad', 'Bored'], correcta: 0 },
          { picto: '😳', situacion: 'Your friend spills juice all over the table and everyone looks at her.', opciones: ['Embarrassed', 'Calm', 'Surprised'], correcta: 0 },
          { picto: '🥱', situacion: "Your friend has seen the same film three times and it's not funny anymore.", opciones: ['Bored', 'Scared', 'Happy'], correcta: 0 },
          { picto: '😲', situacion: 'Your friend opens the door and sees snow for the first time in her life.', opciones: ['Surprised', 'Tired', 'Embarrassed'], correcta: 0 },
          { picto: '😳', situacion: "Your friend's trousers rip at break time and everyone laughs.", opciones: ['Embarrassed', 'Surprised', 'Calm'], correcta: 0 },
          { picto: '🥱', situacion: 'Your friend has nothing to do at home all afternoon.', opciones: ['Bored', 'Angry', 'Embarrassed'], correcta: 0 },
          { picto: '😲', situacion: 'Your friend wins a prize he never even dreamed of.', opciones: ['Surprised', 'Sad', 'Bored'], correcta: 0 },
          { picto: '😳', situacion: 'Your friend forgets the words of a song in front of everyone.', opciones: ['Embarrassed', 'Happy', 'Surprised'], correcta: 0 },
          { picto: '🥱', situacion: "Your friend plays the same game over and over and it's not fun anymore.", opciones: ['Bored', 'Scared', 'Calm'], correcta: 0 },
          { picto: '😲', situacion: 'Your friend sees his team win the match in the last second.', opciones: ['Surprised', 'Bored', 'Sad'], correcta: 0 },
          { picto: '😳', situacion: 'Your friend has food on her face and nobody tells her until the end.', opciones: ['Embarrassed', 'Surprised', 'Happy'], correcta: 0 },
          { picto: '🥱', situacion: 'Your friend has had nothing to do all afternoon and stares at the ceiling.', opciones: ['Bored', 'Surprised', 'Embarrassed'], correcta: 0 },
          { picto: '😳', situacion: 'Your friend trips walking onto the stage in front of the whole audience.', opciones: ['Embarrassed', 'Calm', 'Tired'], correcta: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Level 3',
        descripcion: 'Small conflicts',
        estrellas: 3,
        items: [
          { picto: '🤝', situacion: 'Two friends want the same swing.', opciones: ['They take turns using it', 'They fight over it', 'One walks away angry'], correcta: 0 },
          { picto: '🎨', situacion: "A friend accidentally rips another friend's drawing.", opciones: ['He apologizes and helps fix it', 'He laughs and walks away', "He says it wasn't him"], correcta: 0 },
          { picto: '🎲', situacion: 'Two friends cannot agree on which game to play.', opciones: ['They try one game each, taking turns', 'Each plays alone, upset', 'They shout at each other'], correcta: 0 },
          { picto: '😏', situacion: 'A friend laughs at another for making a mistake.', opciones: ["He says it's okay, everyone makes mistakes", 'He laughs even louder too', 'He says nothing and keeps laughing'], correcta: 0 },
          { picto: '🚗', situacion: 'Two siblings want to sit in the same car seat.', opciones: ['They decide to take turns each trip', 'They push each other', 'One is upset for the whole trip'], correcta: 0 },
          { picto: '✏️', situacion: 'A friend does not want to lend his colored pencil.', opciones: ['His decision is respected and another color is found', 'It is taken from him by force', 'He gets angry and insults him'], correcta: 0 },
          { picto: '😕', situacion: 'Two friends argue because one arrived late.', opciones: ['They talk calmly about what happened', 'They stop talking to each other forever', 'They shout at each other in front of everyone'], correcta: 0 },
          { picto: '😡', situacion: 'A friend gets angry because he lost a board game.', opciones: ['He breathes, calms down and congratulates the other', 'He throws the board', 'He stops playing, angry with everyone'], correcta: 0 },
          { picto: '🚶', situacion: 'Two friends want to be first in line.', opciones: ['They decide who goes first, taking turns', 'They push to go first', 'One shoves the other aside'], correcta: 0 },
          { picto: '🤫', situacion: 'A friend tells a secret he was asked to keep.', opciones: ['He apologizes and promises not to do it again', 'He says it does not matter', 'He tells another secret to feel better'], correcta: 0 },
          { picto: '⚽', situacion: 'Two teammates cannot agree on the strategy.', opciones: ['They listen to both ideas and choose together', 'Each plays their own way without talking', 'They argue in front of the whole team'], correcta: 0 },
          { picto: '😔', situacion: 'A friend is left alone at recess.', opciones: ['Another friend invites him to play with the group', 'Nobody says anything', 'They laugh that he is alone'], correcta: 0 },
          { picto: '🎭', situacion: 'Two friends want the same costume for the party.', opciones: ['They look for another option together', 'They fight over the costume', 'One keeps it without saying anything'], correcta: 0 },
          { picto: '🚶‍♂️', situacion: 'A friend accidentally bumps into another without noticing.', opciones: ['He apologizes right away', 'He keeps walking without saying anything', 'He laughs about what happened'], correcta: 0 },
          { picto: '📖', situacion: 'Two friends disagree about the ending of a story they are making up together.', opciones: ['They combine both ideas into a new one', 'Each tells their own version, upset', 'One decides everything without asking the other'], correcta: 0 },
          { picto: '🧩', situacion: 'Two friends want to put together the same puzzle at the same time.', opciones: ['They take turns placing the pieces', 'They fight over the pieces', 'One takes the whole puzzle'], correcta: 0 },
          { picto: '🎧', situacion: 'A friend plays music very loud and bothers another who wants to read.', opciones: ['He turns it down when asked', 'He turns it up even more', 'He gets angry at being told something'], correcta: 0 },
          { picto: '🍕', situacion: 'Two friends want the last slice of pizza.', opciones: ['They share it equally', 'They fight over it', 'One takes it without saying anything'], correcta: 0 },
          { picto: '📱', situacion: "A friend uses another's phone without asking first.", opciones: ['He apologizes and asks next time', 'He says it is fine to do that', 'He gets angry at being called out'], correcta: 0 }
        ]
      },
      {
        id: 4,
        nombre: 'Level 4',
        descripcion: 'Harder emotions and conflicts',
        estrellas: 4,
        items: [
          { picto: '🥹', situacion: 'Your friend wins the game but sees that you are sad about losing.', opciones: ["He encourages you and says you'll do better next time", 'He makes fun of you for losing', 'He stops playing with you forever'], correcta: 0 },
          { picto: '🙏', situacion: 'You are angry with a friend, but he truly apologizes.', opciones: ['You accept his apology and talk calmly', 'You stay angry even though he apologized', 'You give the anger back even stronger'], correcta: 0 },
          { picto: '📦', situacion: 'A friend is sad because a classmate moved away.', opciones: ['You help him stay in touch', 'You tell him not to worry about it', 'You laugh that he is sad'], correcta: 0 },
          { picto: '😟', situacion: 'Two of your friends are angry with each other and you are caught in the middle.', opciones: ['You help them talk and listen to each other', 'You take one side to upset the other', 'You leave and let them fight'], correcta: 0 },
          { picto: '🎤', situacion: 'A friend gets nervous before speaking in public.', opciones: ['You encourage him and say he will do well', 'You laugh that he is nervous', 'You tell him to never speak in public'], correcta: 0 },
          { picto: '😒', situacion: 'You feel jealous because your friend has a new friend.', opciones: ['You talk about how you feel instead of keeping it inside', 'You stop talking to him without explaining why', 'You say mean things to the new friend'], correcta: 0 },
          { picto: '😞', situacion: 'A friend makes a mistake that affects you.', opciones: ['You talk to him calmly about what happened', 'You shout at him in front of everyone', 'You stop trusting him forever'], correcta: 0 },
          { picto: '😊', situacion: 'Your friend is happy about something, but you had a bad day.', opciones: ['You are happy for her even though you are tired', 'You ask her to stop being happy', "You pretend to be fine even though you don't want to talk"], correcta: 0 },
          { picto: '🏆', situacion: 'Two friends compete a lot and that creates tension between them.', opciones: ['They remember that playing together matters more than winning', 'They stop talking because of the competition', 'One cheats to always win'], correcta: 0 },
          { picto: '😤', situacion: 'A friend copies you a lot and it bothers you a little.', opciones: ['You calmly explain how you feel', 'You get angry and push him out of the group', 'You copy him too to bother him back'], correcta: 0 },
          { picto: '🤗', situacion: 'Your friend needs space and you want to be with her all the time.', opciones: ["You respect her space and trust you'll be together again", "You get angry because she doesn't want to be with you", 'You follow her even though she asked to be alone'], correcta: 0 },
          { picto: '📝', situacion: 'A classmate makes a mistake in group work and the others get angry.', opciones: ['The group helps him fix it together', 'They blame him in front of everyone', 'They exclude him from the work'], correcta: 0 },
          { picto: '🤝', situacion: "You have a conflict with a friend and neither of you knows how to solve it alone.", opciones: ['You ask a trusted person for help', 'You stay angry and never talk about it again', 'You let the problem grow without saying anything'], correcta: 0 },
          { picto: '😟', situacion: 'A friend is very nervous because his parents argue at home.', opciones: ['You listen to him and stay by his side without judging', 'You tell him it is not your problem', 'You tell others without him knowing'], correcta: 0 },
          { picto: '🤗', situacion: 'Two friends apologize after a fight and want to stay friends.', opciones: ['You give each other a second chance and keep playing together', 'You decide he can never be your friend again', 'You keep bringing up the fight all the time'], correcta: 0 },
          { picto: '🥲', situacion: 'A friend finds out you also wanted the same prize he won.', opciones: ['He asks how you feel and encourages you', 'He says nothing about how you felt', 'He shows off even more in front of you'], correcta: 0 },
          { picto: '😣', situacion: 'A friend of yours is nervous because he has an important test tomorrow.', opciones: ['You help him review and encourage him', 'You tell him it will surely go badly', 'You add more pressure by talking about it'], correcta: 0 },
          { picto: '🫤', situacion: 'You feel like a friend always decides the plan and you never get a say.', opciones: ['You calmly tell him you would like to decide sometimes', 'You always agree without saying anything', 'You stop hanging out with him without explaining why'], correcta: 0 },
          { picto: '🤔', situacion: 'A friend apologizes but you are not sure yet if you want to forgive him.', opciones: ['You tell him you need a bit more time', 'You forgive him even though you do not really mean it', 'You tell him you will never forgive him'], correcta: 0 }
        ]
      },
      {
        id: 5,
        nombre: 'Level 5',
        descripcion: 'Friendship and manipulation',
        estrellas: 5,
        items: [
          { picto: '🤫', situacion: 'A friend asks you to keep a secret that makes you feel bad.', opciones: ['I tell them the secret worries me and I look for help', 'I keep it even though it makes me feel bad', 'I tell everyone so I do not carry it alone'], correcta: 0 },
          { picto: '😢', situacion: 'A friend says he will be sad forever if you do not do what he wants.', opciones: ['I tell him his feelings do not depend only on me', 'I do what he wants so he is not sad', 'I tell him to stop being sad'], correcta: 0 },
          { picto: '🎭', situacion: 'In front of others they treat you great, but when you are alone they insult you.', opciones: ['I tell them that way of treating me is not okay', 'I think deep down they are a good person and let it go', 'I insult them too when we are alone'], correcta: 0 },
          { picto: '🎁', situacion: 'A companion gives you expensive gifts and then asks you to give them your allowance every week.', opciones: ["I tell them I don't accept that deal", 'I give them my allowance because they gave me gifts first', 'I give half of my allowance'], correcta: 0 },
          { picto: '👥', situacion: 'A group of classmates only invites you when they need you to do their homework.', opciones: ['I notice it and look for friendships where I am valued too', 'I keep doing their homework so they keep inviting me', 'I stop doing their homework without saying anything and leave without explaining'], correcta: 0 },
          { picto: '😠', situacion: 'A friend gets very angry if you talk to other people and asks you to stop.', opciones: ['I tell them I can have more than one friend', 'I stop talking to other people', 'I talk to other people in secret'], correcta: 0 },
          { picto: '🙄', situacion: 'Every time you achieve something good, a companion downplays it or says they do it better.', opciones: ['I keep enjoying my achievements even if they downplay them', 'I stop telling them the good things that happen to me', 'I downplay their achievements too'], correcta: 0 },
          { picto: '🕵️', situacion: 'A friend reads your messages without permission because "friends have no secrets."', opciones: ['I tell them my messages are private, no matter who it is', 'I let them read them so they do not get angry', 'I read theirs too without asking permission'], correcta: 0 },
          { picto: '📵', situacion: 'A friend tells you that if you had a real phone you would lend it to them whenever they ask.', opciones: ['I tell them a phone can be lent or not, it is my choice', 'I lend it so they do not think I am stingy', 'I only lend the phone if they lend me something of theirs'], correcta: 0 },
          { picto: '😞', situacion: 'A companion tells you that without him you would have no other friends.', opciones: ['I know I can have other friendships, that does not depend on him', 'I believe him and stay away from other people', 'I tell him the same thing so he does not feel better than me'], correcta: 0 },
          { picto: '🎯', situacion: 'A friend keeps comparing you to other people to make you feel worse.', opciones: ['I tell them I do not like being compared like that', 'I try hard to be how they want', 'I compare other people too'], correcta: 0 },
          { picto: '🤐', situacion: 'A companion threatens to stop being your friend if you tell your family what you do together.', opciones: ['I tell my family anyway', 'I do not tell them, afraid of losing the friendship', 'I tell someone else, but not my family'], correcta: 0 },
          { picto: '🧩', situacion: 'A friend only ever wants to do what he decides and never what you suggest.', opciones: ['I tell him I would sometimes like to decide too', 'I always go along with what he decides to avoid arguing', 'I stop suggesting anything, even though it bothers me'], correcta: 0 },
          { picto: '💭', situacion: 'A companion makes you feel guilty for spending time with your family instead of with them.', opciones: ['I tell them I can be with my family and still be their friend', 'I stop seeing my family so I do not feel guilty', 'I make them feel guilty too'], correcta: 0 },
          { picto: '🌱', situacion: 'You are not sure if a companion is a true friend or is just taking advantage of you, and it worries you.', opciones: ['I talk to someone I trust to see it more clearly', 'I decide to end the friendship without talking to anyone about it', 'I keep going as usual, hoping the situation improves on its own'], correcta: 0 },
          { picto: '📌', situacion: 'A companion tells you that if you change your mind about something, he will stop counting on you for anything.', opciones: ['I tell him I can change my mind if I want to', 'I never change my mind out of fear of losing him', 'I change my mind even though I do not want to'], correcta: 0 },
          { picto: '🗝️', situacion: 'A friend wants to know your social media password "to show trust."', opciones: ['I tell him my password is mine alone', 'I give it to him so he trusts me', 'I give him a fake password without saying anything'], correcta: 0 },
          { picto: '📉', situacion: 'Every time you share something good that happened to you, a companion quickly changes the subject.', opciones: ['I keep sharing good news with people who do listen', 'I stop sharing good news forever', 'I do the same to him when he shares something'], correcta: 0 },
          { picto: '🔁', situacion: 'A friend keeps saying you owe him an apology for something you did not actually do.', opciones: ['I calmly tell him I do not have to apologize for something I did not do', 'I apologize so he stops insisting', 'I shout at him to make him stop saying it'], correcta: 0 }
        ]
      }
    ]
  }
};
