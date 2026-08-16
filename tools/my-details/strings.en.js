/* ============================================================
   Routime — My Details texts (EN)
   Language-specific file. Same keys as strings.es.js.
   Conditionally loaded from index.html based on App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    title: '🏠 My Details',

    emptyTitle: 'No details yet',
    emptyText: 'Ask the person who helps you to write your address and phone number in Settings. Once they are there, you can review them here.',

    instruction: 'Review your address and phone, and your family\'s.',
    privacyNote: '🔒 This information is only saved on this device. It is never sent to the internet.',

    card: {
      ownAddress: { label: 'Your address' },
      familyAddress: { label: 'Your family\'s address' },
      ownPhone: { label: 'Your phone' },
      contact: { defaultLabel: 'Family member' }
    },

    startTest: 'Take the test',

    choiceInstruction: 'Choose the correct answer.',

    q: {
      ownAddress: 'What is your address?',
      familyAddress: 'What is your family\'s address?',
      ownPhone: 'What is your phone number?',
      familyPhone: 'What is one of your family\'s phone numbers?'
    },

    hint: {
      ownAddress: '🤔 Think about the street and number where you live.',
      familyAddress: '🤔 Think about the street and number where your family lives.',
      ownPhone: '🤔 Think about the numbers in your phone.',
      familyPhone: '🤔 Think about the phone number of someone in your family.'
    },

    correctExplanation: '✅ Correct!',
    wrongExplanationPrefix: '❌ Not that one. It is: ',
    wrongExplanationPrefixMulti: '❌ Not those. It could be: ',
    multiJoin: ' or ',

    typedInstruction: 'Now write it yourself, with no hints on screen.',
    typedInputLabel: 'Write your answer',
    typedCheck: 'Check',

    finalSummary: 'You earned {n} stars. You now have {total} stars.',
    transferencia: 'This will help you if you ever get lost or need to say where you live or call your family.'
  }, 'en');
})();
