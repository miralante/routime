/* ============================================================
   Routime — Textos de Mis Datos (ES)
   Archivo específico del idioma. Mismas claves que strings.en.js.
   Se carga condicionalmente desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    title: '🏠 Mis Datos',

    emptyTitle: 'Todavía no hay datos',
    emptyText: 'Pide a la persona que te ayuda que escriba tu dirección y tu teléfono en Ajustes. Cuando estén, podrás repasarlos aquí.',

    instruction: 'Repasa tu dirección y tu teléfono, y los de tu familia.',
    privacyNote: '🔒 Estos datos solo se guardan en este dispositivo. No se envían a internet.',

    card: {
      ownAddress: { label: 'Tu dirección' },
      familyAddress: { label: 'La dirección de tu familia' },
      ownPhone: { label: 'Tu teléfono' },
      contact: { defaultLabel: 'Familiar' }
    },

    startTest: 'Hacer el test',

    choiceInstruction: 'Elige la respuesta correcta.',

    q: {
      ownAddress: '¿Cuál es tu dirección?',
      familyAddress: '¿Cuál es la dirección de tu familia?',
      ownPhone: '¿Cuál es tu teléfono?',
      familyPhone: '¿Cuál es un teléfono de tu familia?'
    },

    hint: {
      ownAddress: '🤔 Piensa en la calle y el número donde vives.',
      familyAddress: '🤔 Piensa en la calle y el número donde vive tu familia.',
      ownPhone: '🤔 Piensa en los números de tu teléfono.',
      familyPhone: '🤔 Piensa en el teléfono de alguien de tu familia.'
    },

    correctExplanation: '✅ ¡Correcto!',
    wrongExplanationPrefix: '❌ Esa no es. Es: ',
    wrongExplanationPrefixMulti: '❌ Esas no son. Puede ser: ',
    multiJoin: ' o ',

    typedInstruction: 'Ahora escríbelo tú, sin pistas en la pantalla.',
    typedInputLabel: 'Escribe tu respuesta',
    typedCheck: 'Comprobar',

    finalSummary: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
    transferencia: 'Esto te ayudará si algún día te pierdes o necesitas decir dónde vives o llamar a tu familia.'
  }, 'es');
})();
