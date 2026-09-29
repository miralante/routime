/* ============================================================
   Datos: Teléfonos Importantes (memoria: un solo número, 112,
   sirve para policía, bomberos y emergencia médica).
   Formato:
   DATA.cards = [{ id, picto }] — name y situación de cada
     ficha viven en strings.<locale>.js (card.<id>.name/situation).
   DATA.number = '112' (compartido, no depende del idioma).
   DATA.porRonda = tamaño de cada ronda de test.
   DATA.quiz.es / DATA.quiz.en = [{ picto, situacion, options:
     string[3] (la primera es siempre '112'), correcta }].
   app.js usa DATA.quiz[App.i18n.locale()] || DATA.quiz.es.
   Todas las situaciones son casos reales de policía, bomberos o
   emergencia médica: no hay contraste "no es una emergencia" aquí
   (esa distinción ya la enseña la actividad Emergencias). El
   objetivo de esta actividad es memorizar que el número es
   siempre el mismo, 112, sea cual sea la situación.
   ============================================================ */
var DATA = {
  cards: [
    { id: 'police', picto: '👮' },
    { id: 'fire', picto: '🚒' },
    { id: 'medical', picto: '🚑' }
  ],
  number: '112',
  porRonda: 8,
  quiz: {
    es: [
      { picto: '🚪', situacion: 'Alguien ha entrado en tu casa sin permiso.', options: ['112', 'Esperar a que se vaya solo', 'Enfrentarte tú solo/a'], correcta: 0 },
      { picto: '🥊', situacion: 'Ves que dos personas se están pegando en la calle.', options: ['112', 'Grabarlo con el móvil y ya está', 'Meterte tú en medio'], correcta: 0 },
      { picto: '💰', situacion: 'Alguien te ha robado la cartera o el móvil.', options: ['112', 'No decírselo a nadie', 'Perseguir tú solo/a a la persona'], correcta: 0 },
      { picto: '😨', situacion: 'Un desconocido te sigue y te da miedo.', options: ['112', 'Seguir caminando sin avisar a nadie', 'Meterte en una calle vacía'], correcta: 0 },
      { picto: '🔫', situacion: 'Ves a alguien amenazando a otra persona.', options: ['112', 'Acercarte a mirar', 'Gritarle para que pare'], correcta: 0 },
      { picto: '🔥', situacion: 'Ves fuego de verdad en una casa o en un edificio.', options: ['112', 'Intentar apagarlo tú solo/a', 'Esperar a que se apague solo'], correcta: 0 },
      { picto: '💨', situacion: 'Huele muy fuerte a gas en casa.', options: ['112', 'Encender la luz para ver mejor', 'Abrir la ventana y ya está'], correcta: 0 },
      { picto: '🌲', situacion: 'Ves humo y fuego en el monte o en un descampado.', options: ['112', 'Acercarte a hacer fotos', 'Seguir caminando sin avisar'], correcta: 0 },
      { picto: '🚗', situacion: 'Un coche se ha incendiado en la calle.', options: ['112', 'Acercarte a apagarlo', 'Esperar a que se apague solo'], correcta: 0 },
      { picto: '🏢', situacion: 'Suena la alarma de incendios y hay humo de verdad.', options: ['112', 'Quedarte a ver qué pasa', 'Volver a por tus cosas'], correcta: 0 },
      { picto: '😮‍💨', situacion: 'Alguien no puede respirar bien y se pone de otro color.', options: ['112', 'Esperar a que se le pase', 'Darle algo de comer'], correcta: 0 },
      { picto: '😵', situacion: 'Una persona se ha desmayado y no responde cuando le hablas.', options: ['112', 'Dejarla dormir', 'Echarle agua en la cara'], correcta: 0 },
      { picto: '🩸', situacion: 'Alguien se ha hecho una herida muy grande y sangra mucho.', options: ['112', 'Ponerle solo una tirita', 'Esperar a ver si para solo'], correcta: 0 },
      { picto: '🤕', situacion: 'Alguien se ha caído desde muy alto y no puede moverse.', options: ['112', 'Moverlo tú para que se levante', 'Esperar a que se le pase solo'], correcta: 0 }
    ],
    en: [
      { picto: '🚪', situacion: 'Someone has entered your house without permission.', options: ['112', 'Wait for them to leave on their own', 'Face them by yourself'], correcta: 0 },
      { picto: '🥊', situacion: 'You see two people fighting in the street.', options: ['112', 'Just film it on your phone', 'Get in the middle yourself'], correcta: 0 },
      { picto: '💰', situacion: 'Someone has stolen your wallet or phone.', options: ['112', 'Not tell anyone', 'Chase the person yourself'], correcta: 0 },
      { picto: '😨', situacion: 'A stranger is following you and it scares you.', options: ['112', 'Keep walking without telling anyone', 'Go into an empty street'], correcta: 0 },
      { picto: '🔫', situacion: 'You see someone threatening another person.', options: ['112', 'Go closer to look', 'Shout at them to stop'], correcta: 0 },
      { picto: '🔥', situacion: 'You see real fire in a house or building.', options: ['112', 'Try to put it out yourself', 'Wait for it to go out on its own'], correcta: 0 },
      { picto: '💨', situacion: 'There is a very strong smell of gas at home.', options: ['112', 'Turn on the light to see better', 'Just open the window'], correcta: 0 },
      { picto: '🌲', situacion: 'You see smoke and fire in the countryside or an empty lot.', options: ['112', 'Get closer to take photos', 'Keep walking without telling anyone'], correcta: 0 },
      { picto: '🚗', situacion: 'A car has caught fire in the street.', options: ['112', 'Go put it out yourself', 'Wait for it to go out on its own'], correcta: 0 },
      { picto: '🏢', situacion: 'The fire alarm goes off and there is real smoke.', options: ['112', 'Stay to see what happens', 'Go back for your things'], correcta: 0 },
      { picto: '😮‍💨', situacion: 'Someone cannot breathe well and changes colour.', options: ['112', 'Wait for it to pass', 'Give them something to eat'], correcta: 0 },
      { picto: '😵', situacion: 'A person has fainted and does not respond when you talk to them.', options: ['112', 'Let them sleep', 'Throw water on their face'], correcta: 0 },
      { picto: '🩸', situacion: 'Someone has a very big wound and is bleeding a lot.', options: ['112', 'Just put a plaster on it', 'Wait to see if it stops on its own'], correcta: 0 },
      { picto: '🤕', situacion: 'Someone has fallen from a great height and cannot move.', options: ['112', 'Move them so they stand up', 'Wait for it to pass on its own'], correcta: 0 }
    ]
  }
};
