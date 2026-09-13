/* ============================================================
   Datos: ¿Qué hago primero? (autonomía — priorización de tareas).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ picto, situacion, opciones: string[3], correcta }] }] }
   Cada situación presenta dos o más cosas que se podrían hacer; la
   opción correcta es siempre la más urgente o necesaria (seguridad,
   plazo, ayudar a alguien), nunca la más apetecible.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   contrastes de urgencia muy obvios (algo que no puede esperar frente
   a ocio); nivel 2 mantiene el mismo formato de 3 opciones y solo
   hace el contraste más sutil (dos tareas legítimas, pero una con
   un plazo real).
   Para ampliar: añadir items al array del nivel correspondiente.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Urgencias claras',
        estrellas: 1,
        items: [
          { picto: '📚', situacion: 'Tienes deberes para entregar mañana. También te apetece ver la tele.', opciones: ['Hacer los deberes', 'Ver la tele', 'Merendar'], correcta: 0 },
          { picto: '🦷', situacion: 'Se te ha acabado la pasta de dientes y tienes que lavarte los dientes. También quieres seguir jugando.', opciones: ['Decírselo a un adulto para comprar más', 'Seguir jugando', 'Esperar a mañana'], correcta: 0 },
          { picto: '🚌', situacion: 'El autobús del colegio llega en cinco minutos. Todavía no te has puesto los zapatos.', opciones: ['Ponerte los zapatos ya', 'Terminar de desayunar tranquilo', 'Buscar un juguete'], correcta: 0 },
          { picto: '🩹', situacion: 'Te has hecho una herida jugando. También quieres seguir jugando con tus amigos.', opciones: ['Decírselo a un adulto para curarte', 'Seguir jugando', 'Esperar a que deje de doler'], correcta: 0 },
          { picto: '🍲', situacion: 'La comida se está quemando en el fuego. Estás viendo tu programa favorito.', opciones: ['Avisar a un adulto de que se quema', 'Terminar de ver el programa', 'Cambiar de canal'], correcta: 0 },
          { picto: '⏰', situacion: 'Suena la alarma del colegio y llegas tarde. Quieres seguir en la cama un rato más.', opciones: ['Levantarte ya', 'Quedarte cinco minutos más', 'Apagar la alarma y dormir'], correcta: 0 },
          { picto: '🧸', situacion: 'Tu hermano pequeño se ha caído y llora. Estás jugando a un videojuego.', opciones: ['Ir a ver si está bien', 'Terminar la partida primero', 'Subir el volumen'], correcta: 0 },
          { picto: '🚿', situacion: 'Se ha caído agua en el suelo de la cocina y alguien puede resbalar. Quieres seguir merendando.', opciones: ['Limpiarlo o avisar a un adulto', 'Terminar de merendar', 'Dejarlo para luego'], correcta: 0 },
          { picto: '📱', situacion: 'Un familiar te llama porque necesita ayuda. Estás viendo un vídeo.', opciones: ['Contestar y ayudar', 'Terminar el vídeo primero', 'Llamar luego'], correcta: 0 },
          { picto: '🐶', situacion: 'Tu perro necesita salir a hacer sus necesidades. Quieres seguir dibujando.', opciones: ['Sacarlo ahora', 'Terminar el dibujo', 'Esperar a que aguante'], correcta: 0 },
          { picto: '🔔', situacion: 'Llaman al timbre de casa y hay alguien en casa. Estás jugando.', opciones: ['Miro con cuidado. No abro. Pido ayuda si hace falta.', 'Abro la puerta a cualquiera sin mirar', 'Seguir jugando sin hacer nada'], correcta: 0 },
          { picto: '🔥', situacion: 'Notas olor a quemado en casa. Estás a punto de empezar tu juego favorito.', opciones: ['Avisar enseguida a un adulto', 'Empezar el juego primero', 'Abrir la ventana y no decir nada'], correcta: 0 },
          { picto: '🧃', situacion: 'Se te ha caído zumo en el sofá. Quieres seguir viendo la película.', opciones: ['Limpiarlo o avisar ahora', 'Taparlo con un cojín', 'Seguir viendo la película'], correcta: 0 },
          { picto: '🚽', situacion: 'Tienes muchas ganas de ir al baño. Están a punto de dar tu dibujo favorito en la tele.', opciones: ['Ir al baño primero', 'Aguantar hasta que acabe', 'Cruzar las piernas y esperar'], correcta: 0 },
          { picto: '🩸', situacion: 'Tu hermana se ha hecho un corte y sangra un poco. Tú estás terminando un dibujo.', opciones: ['Ir a ayudarla ahora', 'Terminar el dibujo primero', 'Decirle que espere'], correcta: 0 },
          { picto: '🧯', situacion: 'Ves humo saliendo de un enchufe. Estás jugando con la consola.', opciones: ['Avisar a un adulto ya', 'Terminar la partida', 'Acercarte a mirar de cerca'], correcta: 0 },
          { picto: '🐾', situacion: 'Tu gato se ha quedado encerrado fuera y araña la puerta. Estás merendando.', opciones: ['Dejarlo entrar ahora', 'Terminar de merendar', 'Decir que entre solo'], correcta: 0 },
          { picto: '💧', situacion: 'Se está desbordando la bañera y tú estás viendo dibujos.', opciones: ['Cerrar el grifo ahora', 'Terminar los dibujos', 'Esperar a que se desborde del todo'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Urgencias menos claras',
        estrellas: 2,
        items: [
          { picto: '🎒', situacion: 'Tienes que preparar la mochila para una excursión de mañana temprano y hoy te queda poco tiempo libre. También te apetece leer un rato.', opciones: ['Preparar la mochila primero', 'Leer un rato primero', 'Dejarlo todo para mañana por la mañana'], correcta: 0 },
          { picto: '🧺', situacion: 'Es tu turno de poner la lavadora antes de las ocho para que esté seca a tiempo. Todavía te queda tiempo libre hoy.', opciones: ['Poner la lavadora ahora', 'Esperar a más tarde', 'Pedir a otro que la ponga'], correcta: 0 },
          { picto: '📅', situacion: 'Tienes una cita médica en media hora. Un amigo te invita a jugar ahora mismo.', opciones: ['Prepararte para la cita', 'Jugar un rato antes', 'Llegar tarde a la cita'], correcta: 0 },
          { picto: '🌱', situacion: 'Las plantas llevan varios días sin agua y hoy hace mucho calor. También quieres terminar un juego.', opciones: ['Regarlas ahora', 'Terminar el juego primero', 'Regarlas mañana'], correcta: 0 },
          { picto: '📖', situacion: 'Tienes un examen importante pasado mañana y aún no has empezado a estudiar. Hoy también podrías adelantar tu tiempo libre.', opciones: ['Empezar a estudiar hoy', 'Dejarlo todo para mañana', 'Ver la tele todo el día'], correcta: 0 },
          { picto: '🧹', situacion: 'Vienen visitas a casa en una hora y tu habitación está desordenada. Preferirías seguir jugando.', opciones: ['Ordenar la habitación ahora', 'Seguir jugando y ordenar luego', 'Dejarlo para otro día'], correcta: 0 },
          { picto: '💊', situacion: 'Tienes que tomar una medicina a una hora concreta y ya casi es la hora. Estás en medio de un juego.', opciones: ['Tomar la medicina a su hora', 'Terminar el juego primero', 'Tomarla más tarde si se te olvida'], correcta: 0 },
          { picto: '🚗', situacion: 'Salís de viaje en diez minutos y aún no has recogido tus cosas. Quieres terminar de dibujar.', opciones: ['Recoger tus cosas ya', 'Terminar el dibujo', 'Dejar tus cosas sin recoger'], correcta: 0 },
          { picto: '🥶', situacion: 'La ventana se ha quedado abierta y entra frío; tu abuela está sentada al lado. Estás entretenido con un puzle.', opciones: ['Cerrar la ventana primero', 'Terminar el puzle primero', 'Dejar la ventana abierta'], correcta: 0 },
          { picto: '📦', situacion: 'Esperas un paquete importante y el mensajero llama a la puerta. Estás merendando.', opciones: ['Atender al mensajero ahora', 'Terminar la merienda primero', 'Dejar que se vaya y ya volverá'], correcta: 0 },
          { picto: '🧊', situacion: 'La compra con congelados lleva un rato en la entrada. Quieres ver un capítulo de tu serie.', opciones: ['Guardar los congelados primero', 'Ver el capítulo primero', 'Dejar la compra para la noche'], correcta: 0 },
          { picto: '☔', situacion: 'Hay ropa tendida fuera y empieza a llover. Estabas descansando en el sofá.', opciones: ['Recoger la ropa ahora', 'Esperar a ver si para de llover', 'Dejar que se moje'], correcta: 0 },
          { picto: '📮', situacion: 'Tienes que echar una carta importante antes de que cierre correos, y también te apetece terminar un capítulo de tu libro.', opciones: ['Ir a echar la carta primero', 'Terminar el capítulo primero', 'Dejarlo para mañana'], correcta: 0 },
          { picto: '🔋', situacion: 'El móvil de un familiar se está quedando sin batería y lo necesita en media hora. Tú quieres terminar de jugar.', opciones: ['Ponerlo a cargar ahora', 'Terminar de jugar primero', 'Decir que ya se cargará solo'], correcta: 0 },
          { picto: '🧺', situacion: 'Tienes ropa tendida y ves nubes de tormenta acercándose. Querías seguir leyendo.', opciones: ['Recoger la ropa ahora', 'Seguir leyendo un rato más', 'Esperar a ver si escampa'], correcta: 0 },
          { picto: '📞', situacion: 'Tienes que llamar para confirmar una cita importante antes de que cierren, y también quieres terminar de ver un vídeo.', opciones: ['Llamar ahora', 'Terminar el vídeo primero', 'Llamar mañana'], correcta: 0 }
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
        descripcion: 'Clear urgencies',
        estrellas: 1,
        items: [
          { picto: '📚', situacion: 'You have homework due tomorrow. You also feel like watching TV.', opciones: ['Do your homework', 'Watch TV', 'Have a snack'], correcta: 0 },
          { picto: '🦷', situacion: 'You have run out of toothpaste and need to brush your teeth. You also want to keep playing.', opciones: ['Tell a trusted adult so they can buy more', 'Keep playing', 'Wait until tomorrow'], correcta: 0 },
          { picto: '🚌', situacion: "The school bus arrives in five minutes. You still haven't put your shoes on.", opciones: ['Put your shoes on now', 'Finish breakfast slowly', 'Look for a toy'], correcta: 0 },
          { picto: '🩹', situacion: 'You hurt yourself while playing. You also want to keep playing with your friends.', opciones: ['Tell a trusted adult so they can help you', 'Keep playing', 'Wait until it stops hurting'], correcta: 0 },
          { picto: '🍲', situacion: 'The food is burning on the stove. You are watching your favorite show.', opciones: ['Tell an adult it is burning', 'Finish watching the show', 'Change the channel'], correcta: 0 },
          { picto: '⏰', situacion: 'Your school alarm goes off and you are running late. You want to stay in bed a bit longer.', opciones: ['Get up now', 'Stay five more minutes', 'Turn off the alarm and sleep'], correcta: 0 },
          { picto: '🧸', situacion: 'Your little brother fell and is crying. You are playing a video game.', opciones: ['Go check if he is okay', 'Finish the round first', 'Turn up the volume'], correcta: 0 },
          { picto: '🚿', situacion: 'Water has spilled on the kitchen floor and someone could slip. You want to keep having your snack.', opciones: ['Clean it up or tell an adult', 'Finish your snack', 'Leave it for later'], correcta: 0 },
          { picto: '📱', situacion: 'A family member calls you because they need help. You are watching a video.', opciones: ['Answer and help', 'Finish the video first', 'Call back later'], correcta: 0 },
          { picto: '🐶', situacion: 'Your dog needs to go outside for the toilet. You want to keep drawing.', opciones: ['Take him out now', 'Finish the drawing', 'Wait until he can hold it'], correcta: 0 },
          { picto: '🔔', situacion: 'The doorbell rings and there is someone at home. You are playing.', opciones: ['I look carefully. I do not open. I ask for help if needed.', 'I open the door to anyone without looking', 'Keep playing and do nothing'], correcta: 0 },
          { picto: '🔥', situacion: 'You smell something burning at home. You are about to start your favorite game.', opciones: ['Tell an adult right away', 'Start the game first', 'Open the window and say nothing'], correcta: 0 },
          { picto: '🧃', situacion: 'You spilled juice on the sofa. You want to keep watching the movie.', opciones: ['Clean it up or tell someone now', 'Cover it with a cushion', 'Keep watching the movie'], correcta: 0 },
          { picto: '🚽', situacion: 'You really need the toilet. Your favorite cartoon is about to start on TV.', opciones: ['Go to the toilet first', 'Hold it until it ends', 'Cross your legs and wait'], correcta: 0 },
          { picto: '🩸', situacion: 'Your sister has a small cut and it is bleeding a little. You are finishing a drawing.', opciones: ['Go help her now', 'Finish the drawing first', 'Tell her to wait'], correcta: 0 },
          { picto: '🧯', situacion: 'You see smoke coming from a socket. You are playing a video game.', opciones: ['Tell an adult right away', 'Finish the round', 'Go closer to look'], correcta: 0 },
          { picto: '🐾', situacion: 'Your cat got locked outside and is scratching the door. You are having a snack.', opciones: ['Let it in now', 'Finish your snack', 'Say it can come in by itself'], correcta: 0 },
          { picto: '💧', situacion: 'The bathtub is overflowing and you are watching cartoons.', opciones: ['Turn off the tap now', 'Finish watching cartoons', 'Wait until it overflows completely'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Less clear urgencies',
        estrellas: 2,
        items: [
          { picto: '🎒', situacion: "You need to pack your bag for an early trip tomorrow and you don't have much free time today. You also feel like reading for a while.", opciones: ['Pack your bag first', 'Read for a while first', 'Leave it all for tomorrow morning'], correcta: 0 },
          { picto: '🧺', situacion: "It's your turn to put the washing machine on before eight so it dries in time. You still have free time today.", opciones: ['Put the washing machine on now', 'Wait until later', 'Ask someone else to do it'], correcta: 0 },
          { picto: '📅', situacion: "You have a doctor's appointment in half an hour. A friend invites you to play right now.", opciones: ['Get ready for the appointment', 'Play for a while first', 'Be late for the appointment'], correcta: 0 },
          { picto: '🌱', situacion: "The plants haven't been watered for days and it's very hot today. You also want to finish a game.", opciones: ['Water them now', 'Finish the game first', 'Water them tomorrow'], correcta: 0 },
          { picto: '📖', situacion: "You have an important exam the day after tomorrow and haven't started studying yet. Today you could also start your free time earlier.", opciones: ['Start studying today', 'Leave it all for tomorrow', 'Watch TV all day'], correcta: 0 },
          { picto: '🧹', situacion: 'Visitors are coming to your house in an hour and your room is messy. You would rather keep playing.', opciones: ['Tidy your room now', 'Keep playing and tidy later', 'Leave it for another day'], correcta: 0 },
          { picto: '💊', situacion: "You need to take medicine at a specific time and it's almost time. You are in the middle of a game.", opciones: ['Take the medicine on time', 'Finish the game first', 'Take it later if you remember'], correcta: 0 },
          { picto: '🚗', situacion: "You are leaving on a trip in ten minutes and haven't packed your things yet. You want to finish drawing.", opciones: ['Pack your things now', 'Finish the drawing', 'Leave your things unpacked'], correcta: 0 },
          { picto: '🥶', situacion: 'The window was left open and cold air is coming in; your grandma is sitting next to it. You are busy with a puzzle.', opciones: ['Close the window first', 'Finish the puzzle first', 'Leave the window open'], correcta: 0 },
          { picto: '📦', situacion: 'You are expecting an important parcel and the courier rings the bell. You are having a snack.', opciones: ['Answer the courier now', 'Finish your snack first', 'Let them leave and come back another day'], correcta: 0 },
          { picto: '🧊', situacion: 'The shopping with frozen food has been sitting by the door for a while. You want to watch an episode of your show.', opciones: ['Put the frozen food away first', 'Watch the episode first', 'Leave the shopping until tonight'], correcta: 0 },
          { picto: '☔', situacion: 'There are clothes drying outside and it starts to rain. You were resting on the sofa.', opciones: ['Bring the clothes in now', 'Wait to see if the rain stops', 'Let them get wet'], correcta: 0 },
          { picto: '📮', situacion: 'You need to post an important letter before the post office closes, and you also feel like finishing a chapter of your book.', opciones: ['Go post the letter first', 'Finish the chapter first', 'Leave it for tomorrow'], correcta: 0 },
          { picto: '🔋', situacion: "A family member's phone is running low on battery and they need it in half an hour. You want to keep playing.", opciones: ['Put it to charge now', 'Finish playing first', 'Say it will charge on its own'], correcta: 0 },
          { picto: '🧺', situacion: 'You have clothes drying outside and you see storm clouds approaching. You wanted to keep reading.', opciones: ['Bring the clothes in now', 'Keep reading a while longer', 'Wait to see if it clears up'], correcta: 0 },
          { picto: '📞', situacion: 'You need to call to confirm an important appointment before they close, and you also want to finish watching a video.', opciones: ['Call now', 'Finish the video first', 'Call tomorrow'], correcta: 0 }
        ]
      }
    ]
  }
};
