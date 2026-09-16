/* ============================================================
   Routime — Texts for The Clock (EN)
   Locale-specific file. Loaded conditionally from index.html
   according to App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    titulo: '🕐 The Clock',
    instruccion: 'Look at the clock. Choose the right time.',
    elegirModo: 'Choose an activity',
    elegirNivel: 'Choose a level',
    elegirOtroModo: 'Choose another mechanic',
    elegirOtroNivel: 'Choose another level',
    queHora: 'What time is it?',
    ariaReloj: 'Clock: {text}',
    resumenFinal: 'You won {n} stars. You now have {total} stars.',
    explicacionCorrecta: "✅ Correct! It's ",
    explicacionIncorrectaA: "❌ That is not the time. It's ",
    pistaLeer: '🤔 Try again. Look calmly at the clock.',
    pistaAsociar: '🤔 Try again. Think about that time of day.',
    pistaPoner: '🤔 Try again. Adjust the time with the buttons.',
    pistaConvertir: '🤔 Try again. Compare the clock face with the numbers.',
    convertirAnalogicoDigital: 'What time does this clock show?',
    convertirDigitalAnalogico: 'Tap the clock that matches this time.',
    etiquetaPoner: 'Set the clock to:',
    ponerHora: 'Hour',
    ponerMinuto: 'Minutes',
    ponerIncrementar: 'Increment',
    ponerDecrementar: 'Decrement',
    ponerConfirmar: 'Check',
    refuerzoTitulo: 'Reinforcement',
    refuerzoIntro: "Let's repeat the {n} questions you missed until you get them all right.",
    transferencia: 'This will help you read the time on the kitchen clock, at school or on your own watch, without having to keep asking.',
    enPunto: "{h} o'clock",
    yCuarto: 'quarter past {h}',
    yMedia: 'half past {h}',
    menosCuarto: 'quarter to {h}',
    modo: {
      leer: {
        name: 'Read the clock',
        descripcion: 'Look at the clock and pick the right time.',
        pregunta: 'What time is it?'
      },
      poner: {
        name: 'Set the clock',
        descripcion: 'Read the time and move the hands with the buttons.',
        pregunta: 'Move the hands to the right time.'
      },
      convertir: {
        name: 'Analog ↔ Digital',
        descripcion: 'Match the analog clock with its digital twin.',
        pregunta: 'Match the clock with its digital time.'
      },
      situaciones: {
        name: 'Moments of the day',
        descripcion: 'Pick the clock that matches each moment of the day.',
        pregunta: 'What time is this?'
      }
    },
    timeOfDay: {
      desayuno: { name: 'breakfast',   pregunta: 'What time is breakfast?' },
      colegio:  { name: 'going to school', pregunta: 'What time do you go to school?' },
      comida:   { name: 'lunch',       pregunta: 'What time is lunch?' },
      merienda: { name: 'snack time',  pregunta: 'What time is snack time?' },
      cena:     { name: 'dinner',      pregunta: 'What time is dinner?' },
      dormir:   { name: 'bedtime',     pregunta: 'What time do you go to bed?' }
    }
  }, 'en');
})();