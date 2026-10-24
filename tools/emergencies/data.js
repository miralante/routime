/* ============================================================
   Datos: Emergencias (autonomía — reconocer una emergencia de
   verdad y practicar cómo pedir ayuda).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda,
     reconocer: [{ picto, situacion, options: string[3], correcta }],
     llamadas: [{ name, items: [{ picto, text }] }],
     ascensor: { tituloEscenario, tituloLlamada,
                 escenario: { pasos, regla }, llamada: { pasos, regla } } }
   'reconocer' es un quiz de una sola ronda (sin niveles): mezcla
   emergencias de verdad (fuego, alguien herido que no responde, no
   puede respirar) con cosas que NO son una emergencia (no encuentra
   el mando, se le quema un poco la comida) para que el contraste
   enseñe a distinguir. La opción correcta en una emergencia real es
   siempre pedir ayuda YA; en lo que no lo es, siempre resolverlo con
   calma — nunca "no hacer nada" ni "llamar al 112 por cualquier cosa"
   (llamar sin necesidad también es un error que se enseña aquí).
   'llamadas' es la práctica de pedir ayuda: SIEMPRE el mismo orden
   de 3 steps (name → qué pasa → dónde estás), con el motor de
   ordenar de Lista de Tareas — solo cambia la emergencia descrita,
   para que se aprenda la estructura de la llamada, no un guion fijo.
   Sin niveles (regla 13 no aplica: cada ronda ya mezcla dificultad
   a propósito, como contraste didáctico, no como progresión).
   'ascensor' es la tercera subactividad: un escenario guiado de dos
   etapas (qué hacer y qué decir por el interfono) con el motor de
   pasos de este archivo. Ver el comentario del bloque para el formato.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    reconocer: [
      { picto: '🔥', situacion: 'Ves fuego de verdad en la cocina de tu casa.', options: ['Es una emergencia: pedir ayuda ya (llamar al 112 o avisar a una persona de confianza)', 'No es una emergencia: puede esperar', 'Apagarlo tú solo con agua'], correcta: 0 },
      { picto: '📺', situacion: 'No encuentras el mando de la tele.', options: ['No es una emergencia: buscarlo con calma o esperar', 'Es una emergencia: llamar al 112', 'Gritar muy fuerte pidiendo ayuda'], correcta: 0 },
      { picto: '🤕', situacion: 'Alguien se ha caído y no puede levantarse ni hablar bien.', options: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: esperar a que se le pase', 'Moverlo tú para que se levante'], correcta: 0 },
      { picto: '🍝', situacion: 'Se te ha quemado un poco la comida.', options: ['No es una emergencia: apagar el fuego y ventilar con calma', 'Es una emergencia: llamar al 112', 'Salir corriendo de casa'], correcta: 0 },
      { picto: '🩸', situacion: 'Alguien se ha hecho una herida muy grande y sangra mucho.', options: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: ponerle una tirita', 'Esperar a ver si se le pasa solo'], correcta: 0 },
      { picto: '🧦', situacion: 'No encuentras un calcetín.', options: ['No es una emergencia: seguir buscando con calma', 'Es una emergencia: llamar al 112', 'Ponerte a llorar sin buscar'], correcta: 0 },
      { picto: '😮‍💨', situacion: 'Alguien no puede respirar bien y se pone de otro color.', options: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: esperar un rato', 'Darle algo de comer'], correcta: 0 },
      { picto: '🎮', situacion: 'Se te ha quedado sin batería el videojuego.', options: ['No es una emergencia: cargarlo con calma', 'Es una emergencia: llamar al 112', 'Avisar a la policía'], correcta: 0 },
      { picto: '🚗', situacion: 'Ves un accidente de coche en la calle y alguien está herido.', options: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: seguir caminando', 'Acercarte a mover el coche'], correcta: 0 },
      { picto: '🌧️', situacion: 'Está lloviendo y se te ha olvidado el paraguas.', options: ['No es una emergencia: buscar cobijo o esperar con calma', 'Es una emergencia: llamar al 112', 'Correr por la calzada'], correcta: 0 },
      { picto: '😵', situacion: 'Una persona se ha desmayado y no responde cuando le hablas.', options: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: dejarla dormir', 'Echarle agua en la cara'], correcta: 0 },
      { picto: '🍪', situacion: 'Se han acabado tus galletas favoritas.', options: ['No es una emergencia: apuntarlas en la lista de la compra', 'Es una emergencia: llamar al 112', 'Enfadarte y tirar la caja'], correcta: 0 },
      { picto: '💨', situacion: 'Huele muy fuerte a gas en casa.', options: ['Es una emergencia: salir, avisar a una persona de confianza o llamar al 112', 'No es una emergencia: abrir la ventana y ya está', 'Encender la luz para ver mejor'], correcta: 0 },
      { picto: '📶', situacion: 'El wifi de casa no funciona.', options: ['No es una emergencia: avisar con calma a una persona de confianza', 'Es una emergencia: llamar al 112', 'Golpear el aparato del wifi'], correcta: 0 },
      { picto: '🐝', situacion: 'A una persona alérgica le ha picado una avispa y se le hincha mucho la cara.', options: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: ponerle barro en la picadura', 'Esperar a ver cómo sigue mañana'], correcta: 0 },
      { picto: '🚽', situacion: 'El baño se está inundando y el agua no para de salir.', options: ['Es urgente: avisar ya a una persona de confianza (no hace falta llamar al 112)', 'Es una emergencia: llamar al 112', 'No hacer nada y cerrar la puerta'], correcta: 0 },
      { picto: '🧃', situacion: 'Se te ha caído el zumo al suelo.', options: ['No es una emergencia: limpiarlo con calma', 'Es una emergencia: llamar al 112', 'Dejarlo ahí sin decir nada'], correcta: 0 },
      { picto: '💊', situacion: 'Un niño pequeño se ha tragado unas pastillas que no eran para él.', options: ['Es una emergencia: pedir ayuda ya', 'No es una emergencia: darle agua y esperar', 'Darle de comer para que se le pase'], correcta: 0 }
    ],
    llamadas: [
      { name: 'Hay fuego en la cocina', items: [
        { picto: '📛', text: 'Decir tu nombre' },
        { picto: '🔥', text: 'Decir qué está pasando: hay un fuego' },
        { picto: '📍', text: 'Decir dónde estás' }
      ] },
      { name: 'Alguien se ha caído y no se levanta', items: [
        { picto: '📛', text: 'Decir tu nombre' },
        { picto: '🤕', text: 'Decir qué está pasando: alguien se ha caído' },
        { picto: '📍', text: 'Decir dónde estás' }
      ] },
      { name: 'Ves un accidente de coche', items: [
        { picto: '📛', text: 'Decir tu nombre' },
        { picto: '🚗', text: 'Decir qué está pasando: hay un accidente' },
        { picto: '📍', text: 'Decir dónde estás' }
      ] },
      { name: 'Un familiar no puede respirar bien', items: [
        { picto: '📛', text: 'Decir tu nombre' },
        { picto: '😮‍💨', text: 'Decir qué está pasando: no puede respirar bien' },
        { picto: '📍', text: 'Decir dónde estás' }
      ] },
      { name: 'Una persona se ha desmayado y no responde', items: [
        { picto: '📛', text: 'Decir tu nombre' },
        { picto: '😵', text: 'Decir qué está pasando: alguien no responde' },
        { picto: '📍', text: 'Decir dónde estás' }
      ] },
      { name: 'Huele muy fuerte a gas en casa', items: [
        { picto: '📛', text: 'Decir tu nombre' },
        { picto: '💨', text: 'Decir qué está pasando: huele a gas' },
        { picto: '📍', text: 'Decir dónde estás' }
      ] },
      { name: 'Alguien sangra mucho por una herida grande', items: [
        { picto: '📛', text: 'Decir tu nombre' },
        { picto: '🩸', text: 'Decir qué está pasando: una herida sangra mucho' },
        { picto: '📍', text: 'Decir dónde estás' }
      ] },
      { name: 'Un niño se ha tragado unas pastillas', items: [
        { picto: '📛', text: 'Decir tu nombre' },
        { picto: '💊', text: 'Decir qué está pasando: se ha tragado unas pastillas' },
        { picto: '📍', text: 'Decir dónde estás' }
      ] }
    ],
    /* Subactividad: "Atrapado en el ascensor". Es una emergencia con
       reglas propias (dentro se espera, no se fuerza la puerta) y con
       información propia (el interfono es del edificio: hay que decir
       edificio y planta). Por eso va dentro de Emergencias y no como
       un ítem suelto en otro sitio.
       'escenario' = qué hacer (motor de pasos: narración + pregunta de
       3 opciones). 'llamada' = qué decir por el interfono (mismo
       motor, 3 preguntas). Cada paso:
       { tipo: 'narracion', picto, text } o
       { tipo: 'pregunta', text, opciones: [{ texto, correcta,
       explicacion, pista }] }.
       La opción correcta siempre lleva explicación; cada incorrecta
       lleva su pista (método socrático, regla 12). En segunda persona
       y sin género. */
    ascensor: {
      tituloEscenario: 'El ascensor se para',
      tituloLlamada: 'La llamada por el interfono',
      escenario: {
        pasos: [
          { tipo: 'narracion', picto: '🛗', text: 'Entras en el ascensor. Pulsas el botón de la planta. El ascensor arranca y se para. Las puertas no se abren.' },
          { tipo: 'pregunta', picto: '❓', text: '¿Qué haces primero?', opciones: [
            { texto: 'Pulsar el botón de alarma del ascensor', correcta: true, explicacion: 'El botón de alarma avisa al edificio. Es la forma más rápida de pedir ayuda.', pista: '' },
            { texto: 'Empujar la puerta para salir', correcta: false, explicacion: '', pista: 'Si empujas la puerta, puedes salir pero te puedes hacer mucho daño. Mira la cabina: hay un botón de alarma.' },
            { texto: 'Quedarte callado hasta que el ascensor se mueva solo', correcta: false, explicacion: '', pista: 'Tener calma está bien, pero solo no vas a salir. ¿Hay algún botón en la cabina para pedir ayuda?' }
          ] },
          { tipo: 'narracion', picto: '🔔', text: 'Suena la alarma. En la cabina hay un botón de alarma, un interfono y un teléfono.' },
          { tipo: 'pregunta', picto: '❓', text: 'El botón de alarma no suena. ¿Qué haces?', opciones: [
            { texto: 'Coger el teléfono de la cabina o llamar al 112 con tu móvil', correcta: true, explicacion: 'El 112 sirve para pedir ayuda en cualquier sitio. También puedes usar el teléfono de la cabina.', pista: '' },
            { texto: 'Esperar sin hacer nada', correcta: false, explicacion: '', pista: 'Esperar está bien cuando ya has pedido ayuda. Pero si la alarma no suena, tienes que pedirla por otro lado.' },
            { texto: 'Empujar la puerta para salir', correcta: false, explicacion: '', pista: 'Empujar la puerta es peligroso. Pide ayuda antes: por el interfono, por el teléfono o con el 112.' }
          ] },
          { tipo: 'narracion', picto: '📞', text: 'Coges el interfono. Una persona contesta: «Dime, ¿qué pasa?»' },
          { tipo: 'pregunta', picto: '❓', text: '¿Qué le dices?', opciones: [
            { texto: 'Tu nombre, que estás en el ascensor y que no puedes salir, y en qué edificio y planta estás', correcta: true, explicacion: 'Con tu nombre y el edificio y la planta te encuentran rápido. Por eso hay que decir las tres cosas.', pista: '' },
            { texto: 'Solo «Ayuda»', correcta: false, explicacion: '', pista: 'Te van a preguntar más. Dilo todo: tu nombre, qué pasa y dónde estás.' },
            { texto: 'Cuelgar el interfono', correcta: false, explicacion: '', pista: 'Si cuelgas no podrán ayudarte. Espera en línea y explica lo que pasa.' }
          ] },
          { tipo: 'narracion', picto: '👷', text: 'La persona del edificio te dice: «Ya aviso al técnico. Quédate dentro y no toques la puerta.»' },
          { tipo: 'pregunta', picto: '❓', text: '¿Qué haces mientras esperas?', opciones: [
            { texto: 'Quedarte dentro con calma, sin forzar la puerta, y seguir hablando con quien te ayuda', correcta: true, explicacion: 'El ascensor es un lugar seguro. Lo peligroso es forzar la puerta o salir sin ayuda.', pista: '' },
            { texto: 'Forzar las puertas para salir', correcta: false, explicacion: '', pista: 'Si el ascensor está parado, las puertas no se abren. Espera dentro y deja que te abran.' },
            { texto: 'Llorar y gritar', correcta: false, explicacion: '', pista: 'Los nervios pasan. Respira, siéntate y sigue hablando con quien te ayuda.' }
          ] }
        ],
        regla: '⭐ Para recordar: pide ayuda con la alarma, el interfono, el teléfono o el 112. Di tu nombre, qué pasa y en qué edificio y planta estás. Espera dentro, con calma y sin forzar la puerta.'
      },
      llamada: {
        pasos: [
          { tipo: 'narracion', picto: '📞', text: 'Suena el interfono del ascensor. Una persona dice: «¿Quién es?»' },
          { tipo: 'pregunta', picto: '❓', text: '¿Qué dices primero?', opciones: [
            { texto: 'Tu nombre', correcta: true, explicacion: 'Empieza por tu nombre. Así saben quién eres y pueden buscarte.', pista: '' },
            { texto: 'Solo «Ayuda»', correcta: false, explicacion: '', pista: 'Empieza por tu nombre. Después explicas qué pasa.' },
            { texto: 'No decir nada', correcta: false, explicacion: '', pista: 'Contestar es el primer paso. Di tu nombre.' }
          ] },
          { tipo: 'narracion', picto: '📞', text: 'La persona pregunta: «¿Qué ha pasado?»' },
          { tipo: 'pregunta', picto: '❓', text: '¿Qué dices?', opciones: [
            { texto: 'Que estás en el ascensor y que no puedes salir', correcta: true, explicacion: 'Así saben que necesitas ayuda ahora. Dilo claro y en una frase.', pista: '' },
            { texto: 'Que el ascensor está roto', correcta: false, explicacion: '', pista: 'Que está roto no dice que tú estás dentro. Dilo: «Estoy en el ascensor y no puedo salir».' },
            { texto: 'Cuelgar el interfono', correcta: false, explicacion: '', pista: 'Si cuelgas, la llamada se acaba. Espera y explica.' }
          ] },
          { tipo: 'narracion', picto: '📞', text: 'La persona pregunta: «¿Dónde estás?»' },
          { tipo: 'pregunta', picto: '❓', text: '¿Qué dices?', opciones: [
            { texto: 'El nombre del edificio y la planta', correcta: true, explicacion: 'El interfono es del edificio. Con el nombre del edificio y la planta te encuentran.', pista: '' },
            { texto: 'Solo «En un ascensor»', correcta: false, explicacion: '', pista: 'Hay muchos ascensores. Di el nombre del edificio y la planta.' },
            { texto: 'No saber el nombre del edificio ni la planta', correcta: false, explicacion: '', pista: 'Si no lo sabes, dilo. Ellos lo pueden buscar. Para saberlo, mira el cartel del portal antes de subir.' }
          ] }
        ],
        regla: '⭐ Para recordar: en la llamada dices tu nombre, qué pasa (estoy en el ascensor y no puedo salir) y dónde estás (edificio y planta).'
      }
    }
  },
  en: {
    porRonda: 8,
    reconocer: [
      { picto: '🔥', situacion: 'You see real fire in your kitchen.', options: ['It is an emergency: get help now (call 112 or tell a trusted person)', 'It is not an emergency: it can wait', 'Put it out yourself with water'], correcta: 0 },
      { picto: '📺', situacion: 'You cannot find the TV remote.', options: ['It is not an emergency: look for it calmly or wait', 'It is an emergency: call 112', 'Shout very loudly for help'], correcta: 0 },
      { picto: '🤕', situacion: 'Someone has fallen and cannot get up or speak properly.', options: ['It is an emergency: get help now', 'It is not an emergency: wait for it to pass', 'Move them yourself to make them stand up'], correcta: 0 },
      { picto: '🍝', situacion: 'Your food got a little burnt.', options: ['It is not an emergency: turn off the heat and air the room calmly', 'It is an emergency: call 112', 'Run out of the house'], correcta: 0 },
      { picto: '🩸', situacion: 'Someone has a very big wound and is bleeding a lot.', options: ['It is an emergency: get help now', 'It is not an emergency: put a plaster on it', 'Wait and see if it stops on its own'], correcta: 0 },
      { picto: '🧦', situacion: 'You cannot find a sock.', options: ['It is not an emergency: keep looking calmly', 'It is an emergency: call 112', 'Start crying without looking'], correcta: 0 },
      { picto: '😮‍💨', situacion: 'Someone cannot breathe well and changes colour.', options: ['It is an emergency: get help now', 'It is not an emergency: wait a while', 'Give them something to eat'], correcta: 0 },
      { picto: '🎮', situacion: 'Your video game ran out of battery.', options: ['It is not an emergency: charge it calmly', 'It is an emergency: call 112', 'Tell the police'], correcta: 0 },
      { picto: '🚗', situacion: 'You see a car accident on the street and someone is hurt.', options: ['It is an emergency: get help now', 'It is not an emergency: keep walking', 'Go move the car'], correcta: 0 },
      { picto: '🌧️', situacion: 'It is raining and you forgot your umbrella.', options: ['It is not an emergency: find shelter or wait calmly', 'It is an emergency: call 112', 'Run onto the road'], correcta: 0 },
      { picto: '😵', situacion: 'A person has fainted and does not respond when you talk to them.', options: ['It is an emergency: get help now', 'It is not an emergency: let them sleep', 'Throw water on their face'], correcta: 0 },
      { picto: '🍪', situacion: 'Your favourite biscuits have run out.', options: ['It is not an emergency: add them to the shopping list', 'It is an emergency: call 112', 'Get angry and throw the box'], correcta: 0 },
      { picto: '💨', situacion: 'There is a very strong smell of gas at home.', options: ['It is an emergency: leave, tell a trusted person or call 112', 'It is not an emergency: just open the window', 'Turn on the light to see better'], correcta: 0 },
      { picto: '📶', situacion: 'The home wifi is not working.', options: ['It is not an emergency: calmly tell a trusted person', 'It is an emergency: call 112', 'Hit the wifi router'], correcta: 0 },
      { picto: '🐝', situacion: 'A wasp stung someone with an allergy and their face is swelling a lot.', options: ['It is an emergency: get help now', 'It is not an emergency: put mud on the sting', 'Wait and see how they are tomorrow'], correcta: 0 },
      { picto: '🚽', situacion: 'The bathroom is flooding and the water will not stop.', options: ['It is urgent: tell a trusted person right away (no need to call 112)', 'It is an emergency: call 112', 'Do nothing and close the door'], correcta: 0 },
      { picto: '🧃', situacion: 'You spilled your juice on the floor.', options: ['It is not an emergency: clean it up calmly', 'It is an emergency: call 112', 'Leave it there and say nothing'], correcta: 0 },
      { picto: '💊', situacion: 'A small child swallowed pills that were not for them.', options: ['It is an emergency: get help now', 'It is not an emergency: give them water and wait', 'Give them food to make it pass'], correcta: 0 }
    ],
    llamadas: [
      { name: 'There is a fire in the kitchen', items: [
        { picto: '📛', text: 'Say your name' },
        { picto: '🔥', text: 'Say what is happening: there is a fire' },
        { picto: '📍', text: 'Say where you are' }
      ] },
      { name: 'Someone has fallen and cannot get up', items: [
        { picto: '📛', text: 'Say your name' },
        { picto: '🤕', text: 'Say what is happening: someone has fallen' },
        { picto: '📍', text: 'Say where you are' }
      ] },
      { name: 'You see a car accident', items: [
        { picto: '📛', text: 'Say your name' },
        { picto: '🚗', text: 'Say what is happening: there is an accident' },
        { picto: '📍', text: 'Say where you are' }
      ] },
      { name: 'A family member cannot breathe well', items: [
        { picto: '📛', text: 'Say your name' },
        { picto: '😮‍💨', text: 'Say what is happening: they cannot breathe well' },
        { picto: '📍', text: 'Say where you are' }
      ] },
      { name: 'A person has fainted and does not respond', items: [
        { picto: '📛', text: 'Say your name' },
        { picto: '😵', text: 'Say what is happening: someone does not respond' },
        { picto: '📍', text: 'Say where you are' }
      ] },
      { name: 'There is a strong smell of gas at home', items: [
        { picto: '📛', text: 'Say your name' },
        { picto: '💨', text: 'Say what is happening: it smells of gas' },
        { picto: '📍', text: 'Say where you are' }
      ] },
      { name: 'Someone is bleeding a lot from a big wound', items: [
        { picto: '📛', text: 'Say your name' },
        { picto: '🩸', text: 'Say what is happening: a wound is bleeding a lot' },
        { picto: '📍', text: 'Say where you are' }
      ] },
      { name: 'A child has swallowed some pills', items: [
        { picto: '📛', text: 'Say your name' },
        { picto: '💊', text: 'Say what is happening: they swallowed some pills' },
        { picto: '📍', text: 'Say where you are' }
      ] }
    ],
    ascensor: {
      tituloEscenario: 'The lift stops',
      tituloLlamada: 'The intercom call',
      escenario: {
        pasos: [
          { tipo: 'narracion', picto: '🛗', text: 'You get into the lift. You press the floor button. The lift starts and then stops. The doors do not open.' },
          { tipo: 'pregunta', picto: '❓', text: 'What do you do first?', opciones: [
            { texto: 'Press the alarm button in the lift', correcta: true, explicacion: 'The alarm button tells the building. It is the quickest way to get help.', pista: '' },
            { texto: 'Push the doors to get out', correcta: false, explicacion: '', pista: 'If you push the doors you may get out, but you can hurt yourself a lot. Look in the cabin: there is an alarm button.' },
            { texto: 'Stay quiet until the lift moves again on its own', correcta: false, explicacion: '', pista: 'Staying calm is good, but you will not get out on your own. Is there a button in the cabin to ask for help?' }
          ] },
          { tipo: 'narracion', picto: '🔔', text: 'The alarm rings. In the cabin there is an alarm button, an intercom and a phone.' },
          { tipo: 'pregunta', picto: '❓', text: 'The alarm button does not ring. What do you do?', opciones: [
            { texto: 'Use the phone in the cabin or call 112 on your mobile', correcta: true, explicacion: 'You can call 112 for help anywhere. You can also use the phone in the cabin.', pista: '' },
            { texto: 'Wait and do nothing', correcta: false, explicacion: '', pista: 'Waiting is fine when you have already asked for help. But if the alarm does not ring, ask another way.' },
            { texto: 'Push the doors to get out', correcta: false, explicacion: '', pista: 'Pushing the doors is dangerous. Ask for help first: intercom, phone or 112.' }
          ] },
          { tipo: 'narracion', picto: '📞', text: 'You pick up the intercom. A person answers: "Tell me, what happened?"' },
          { tipo: 'pregunta', picto: '❓', text: 'What do you say?', opciones: [
            { texto: 'Your name, that you are in the lift and cannot get out, and which building and floor you are on', correcta: true, explicacion: 'With your name and the building and the floor they find you fast. That is why you say all three.', pista: '' },
            { texto: 'Only "Help"', correcta: false, explicacion: '', pista: 'They will ask you more. Say it all: your name, what happened and where you are.' },
            { texto: 'Hang up the intercom', correcta: false, explicacion: '', pista: 'If you hang up they cannot help you. Stay on the line and explain.' }
          ] },
          { tipo: 'narracion', picto: '👷', text: 'The person from the building says: "I will call the technician. Stay inside and do not touch the door."' },
          { tipo: 'pregunta', picto: '❓', text: 'What do you do while you wait?', opciones: [
            { texto: 'Stay inside calmly, without forcing the doors, and keep talking to the person helping you', correcta: true, explicacion: 'The lift is a safe place. What is dangerous is forcing the doors or getting out without help.', pista: '' },
            { texto: 'Force the doors to get out', correcta: false, explicacion: '', pista: 'If the lift is stopped the doors will not open. Wait inside and let them open them for you.' },
            { texto: 'Cry and shout', correcta: false, explicacion: '', pista: 'The nerves pass. Breathe, sit down and keep talking to the person helping you.' }
          ] }
        ],
        regla: '⭐ To remember: ask for help with the alarm, the intercom, the phone or 112. Say your name, what happened and which building and floor you are on. Wait inside, calmly, without forcing the doors.'
      },
      llamada: {
        pasos: [
          { tipo: 'narracion', picto: '📞', text: 'The intercom in the lift rings. A person says: "Who is it?"' },
          { tipo: 'pregunta', picto: '❓', text: 'What do you say first?', opciones: [
            { texto: 'Your name', correcta: true, explicacion: 'Start with your name. Then they know who you are and they can look for you.', pista: '' },
            { texto: 'Only "Help"', correcta: false, explicacion: '', pista: 'Start with your name. Then explain what happened.' },
            { texto: 'Say nothing', correcta: false, explicacion: '', pista: 'Answering is the first step. Say your name.' }
          ] },
          { tipo: 'narracion', picto: '📞', text: 'The person asks: "What happened?"' },
          { tipo: 'pregunta', picto: '❓', text: 'What do you say?', opciones: [
            { texto: 'That you are in the lift and cannot get out', correcta: true, explicacion: 'Now they know you need help right now. Say it clearly, in one sentence.', pista: '' },
            { texto: 'That the lift is broken', correcta: false, explicacion: '', pista: '"The lift is broken" does not say that you are inside. Say it: "I am in the lift and I cannot get out".' },
            { texto: 'Hang up the intercom', correcta: false, explicacion: '', pista: 'If you hang up, the call ends. Wait and explain.' }
          ] },
          { tipo: 'narracion', picto: '📞', text: 'The person asks: "Where are you?"' },
          { tipo: 'pregunta', picto: '❓', text: 'What do you say?', opciones: [
            { texto: 'The name of the building and the floor', correcta: true, explicacion: 'The intercom belongs to the building. With the name of the building and the floor they find you.', pista: '' },
            { texto: 'Only "In a lift"', correcta: false, explicacion: '', pista: 'There are many lifts. Say the name of the building and the floor.' },
            { texto: 'Not knowing the name of the building or the floor', correcta: false, explicacion: '', pista: 'If you do not know it, say so. They can look it up. To know it, check the sign at the entrance before you go up.' }
          ] }
        ],
        regla: '⭐ To remember: in the call you say your name, what happened (I am in the lift and I cannot get out) and where you are (building and floor).'
      }
    }
  }
};
