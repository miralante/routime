/* ============================================================
   Routime — Teléfonos Importantes (memoria: recordar que el
   112 sirve para policía, bomberos y emergencia médica)
   Datos en data.js (DATA.cards, DATA.number, DATA.quiz). Flujo
   lineal en 3 steps, tal y como se pidió la actividad:
   1) Fichas: una tarjeta por servicio (policía, bomberos,
      emergencia médica), siempre con el mismo número, 112.
   2) Resumen: una sola tarjeta que repasa las 3 fichas juntas,
      para remarcar que el número no cambia.
   3) Test: quiz de 3 options (motor de Señales/Emergencias)
      sobre situaciones variadas; la respuesta correcta es
      siempre 112. El error nunca se castiga (pista en el primer
      fallo, explicación en el segundo).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'phone-numbers';
  var $ = App.utils.$;

  var cardsScreen = $('#cardsScreen');
  var summaryScreen = $('#summaryScreen');
  var quizScreen = $('#quizScreen');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');

  var cardsProgressFill = $('#cardsProgressFill');
  var cardsProgressText = $('#cardsProgressText');
  var cardPicto = $('#cardPicto');
  var cardName = $('#cardName');
  var cardSituation = $('#cardSituation');
  var cardNumber = $('#cardNumber');
  var cardListenBtn = $('#cardListenBtn');
  var nextCardBtn = $('#nextCardBtn');

  var summaryCard = $('#summaryCard');
  var summaryListenBtn = $('#summaryListenBtn');
  var startQuizBtn = $('#startQuizBtn');

  var quizProgressFill = $('#quizProgressFill');
  var quizProgressText = $('#quizProgressText');
  var quizPicto = $('#quizPicto');
  var quizSituation = $('#quizSituation');
  var quizListenBtn = $('#quizListenBtn');
  var quizOptions = $('#quizOptions');
  var quizFeedback = $('#quizFeedback');
  var quizExplanationWrap = $('#quizExplanationWrap');
  var quizExplanation = $('#quizExplanation');
  var quizExplanationListenBtn = $('#quizExplanationListenBtn');
  var quizNextBtn = $('#quizNextBtn');

  /* Persistent progress */
  var progress = App.storage.getWithStars(TOOL_ID);
  if (!progress.completedRounds) progress.completedRounds = 0;

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; }
  });
  var save = glue.save;
  var paintStars = glue.paintStars;
  function t(key) { return App.i18n.t(key); }
  function quizBank() { return DATA.quiz[App.i18n.locale()] || DATA.quiz.es; }

  function show(screen) {
    [cardsScreen, summaryScreen, quizScreen, endScreen].forEach(function (s) {
      s.classList.toggle('hidden', s !== screen);
    });
  }

  /* ---------- Paso 1: fichas ---------- */
  var cardIdx = 0;

  function paintCardProgress() {
    var total = DATA.cards.length;
    cardsProgressFill.style.width = (((cardIdx + 1) / total) * 100) + '%';
    cardsProgressText.textContent = '';
  }

  function cardSpeech(card) {
    return t('card.' + card.id + '.name') + '. ' +
      t('card.' + card.id + '.situation') + ' ' +
      t('numberLabel') + ' ' + DATA.number;
  }

  function renderCard() {
    var card = DATA.cards[cardIdx];
    cardPicto.textContent = card.picto;
    cardName.textContent = t('card.' + card.id + '.name');
    cardSituation.textContent = t('card.' + card.id + '.situation');
    cardNumber.textContent = t('numberLabel') + ' ' + DATA.number;
    paintCardProgress();
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(cardSpeech(card));
  }

  function startCards() {
    cardIdx = 0;
    show(cardsScreen);
    renderCard();
  }

  function nextCard() {
    cardIdx += 1;
    if (cardIdx >= DATA.cards.length) {
      goSummary();
    } else {
      renderCard();
    }
  }

  /* ---------- Paso 2: resumen ---------- */

  function summarySpeech() {
    return t('summaryTitle') + '. ' + t('summaryText');
  }

  function goSummary() {
    summaryCard.innerHTML = '';
    DATA.cards.forEach(function (card) {
      var row = document.createElement('p');
      row.className = 'summary-row';
      row.textContent = card.picto + ' ' + t('card.' + card.id + '.name') + ' → ' + DATA.number;
      summaryCard.appendChild(row);
    });
    var text = document.createElement('p');
    text.className = 'summary-text';
    text.textContent = t('summaryText');
    summaryCard.appendChild(text);
    show(summaryScreen);
  }

  /* ---------- Paso 3: test ---------- */
  var quizItems = [];
  var quizIdx = 0;
  var quizCorrectCount = 0;
  var quizResolved = false;
  var quizAttempts = 0;

  function startQuiz() {
    quizItems = App.utils.shuffle(quizBank()).slice(0, DATA.porRonda);
    quizIdx = 0;
    quizCorrectCount = 0;
    show(quizScreen);
    renderQuiz();
  }

  function paintQuizProgress() {
    var total = DATA.porRonda;
    quizProgressFill.style.width = ((quizIdx / total) * 100) + '%';
    quizProgressText.textContent = '';
  }

  function renderQuiz() {
    var item = quizItems[quizIdx];
    quizResolved = false;
    quizAttempts = 0;
    quizPicto.textContent = item.picto;
    quizSituation.textContent = item.situacion;
    quizFeedback.textContent = '';
    quizFeedback.className = 'feedback';
    quizExplanationWrap.classList.add('hidden');
    quizExplanation.textContent = '';
    quizNextBtn.classList.add('hidden');
    quizOptions.innerHTML = '';

    /* The child writes the number with the keypad: the number is built, not picked. */
    quizTyped = '';
    quizFeedback.textContent = t('quizTypeNumber');
    buildKeypad();

    paintQuizProgress();
    paintStars();
  }

  /* ---------- Keypad: the digits typed, the keys 0–9, erase and check ---------- */

  var quizTyped = '';
  var quizDisplay = null;
  var quizKeys = [];
  var quizCheckKey = null;
  var KEYPAD_MAX_DIGITS = 3;

  function buildKeypad() {
    quizOptions.innerHTML = '';
    quizDisplay = document.createElement('p');
    quizDisplay.className = 'answer-display';
    quizDisplay.setAttribute('aria-live', 'polite');
    quizOptions.appendChild(quizDisplay);

    var pad = document.createElement('div');
    pad.className = 'answer-pad';
    quizKeys = [];
    function addKey(label, aria, action, extra) {
      var key = document.createElement('button');
      key.type = 'button';
      key.className = 'btn-opcion answer-key' + (extra ? ' ' + extra : '');
      key.textContent = label;
      if (aria) key.setAttribute('aria-label', aria);
      key.addEventListener('click', action);
      pad.appendChild(key);
      quizKeys.push(key);
      return key;
    }
    ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(function (d) {
      addKey(d, null, function () { press(d); });
    });
    addKey('⌫', t('eraseDigit'), erase, 'answer-key-erase');
    addKey('0', null, function () { press('0'); });
    quizCheckKey = addKey('✓', t('checkNumber'), checkTyped, 'answer-key-check');
    quizOptions.appendChild(pad);
    paintTyped();
  }

  function paintTyped() {
    if (quizDisplay) quizDisplay.textContent = quizTyped;
  }

  function press(digit) {
    if (quizResolved || quizTyped.length >= KEYPAD_MAX_DIGITS) return;
    quizTyped += digit;
    paintTyped();
  }

  function erase() {
    if (quizResolved) return;
    quizTyped = quizTyped.slice(0, -1);
    paintTyped();
  }

  /* Keyboard support: digits, Backspace to erase, Enter to check. */
  document.addEventListener('keydown', function (event) {
    if (quizResolved || quizScreen.classList.contains('hidden') || !quizDisplay) return;
    if (/^[0-9]$/.test(event.key)) { press(event.key); event.preventDefault(); }
    else if (event.key === 'Backspace') { erase(); event.preventDefault(); }
    else if (event.key === 'Enter') { checkTyped(); event.preventDefault(); }
  });

  function checkTyped() {
    if (quizResolved) return;
    if (quizTyped === '') {
      quizFeedback.className = 'feedback';
      quizFeedback.textContent = t('quizTypeNumber');
      return;
    }
    answerQuiz(quizTyped === CORRECT_NUMBER);
  }

  function showQuizExplanation() {
    quizExplanation.textContent = t('correctExplanation');
    quizExplanationWrap.classList.remove('hidden');
  }

  /* The emergency number in every country this app covers: always 112. */
  var CORRECT_NUMBER = '112';

  function answerQuiz(isCorrect) {
    var item = quizItems[quizIdx];
    if (isCorrect) {
      showQuizExplanation();
      quizResolved = true;
      quizDisplay.classList.add('correcta');
      quizCheckKey.classList.add('correcta');
      quizKeys.forEach(function (key) { key.disabled = true; });
      App.feedback.success(quizFeedback);
      progress.stars += 1;
      quizCorrectCount += 1;
      save();
      paintStars();
      quizNextBtn.classList.remove('hidden');
      quizNextBtn.focus();
    } else {
      quizAttempts += 1;
      if (quizAttempts === 1) {
        quizExplanation.textContent = t('hint') + '"' + item.situacion + '"';
        quizExplanationWrap.classList.remove('hidden');
      } else {
        showQuizExplanation();
      }
      quizTyped = '';
      paintTyped();
      App.feedback.encourage(quizFeedback);
      App.feedback.lockUntilAck(App.utils.$$('#quizOptions .btn-opcion'), quizExplanationWrap);
    }
  }

  function nextQuiz() {
    quizIdx += 1;
    if (quizIdx >= DATA.porRonda) {
      finishQuiz();
    } else {
      renderQuiz();
    }
  }

  function finishQuiz() {
    progress.completedRounds += 1;
    save();
    show(endScreen);
    $('#finalSummary').textContent = '';
$('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */
  nextCardBtn.addEventListener('click', nextCard);
  if (cardListenBtn) cardListenBtn.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(cardSpeech(DATA.cards[cardIdx]));
  });
  if (summaryListenBtn) summaryListenBtn.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(summarySpeech());
  });
  startQuizBtn.addEventListener('click', startQuiz);
  if (quizListenBtn) quizListenBtn.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(quizItems[quizIdx].situacion);
  });
  if (quizExplanationListenBtn) quizExplanationListenBtn.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(quizExplanation.textContent);
  });
  quizNextBtn.addEventListener('click', nextQuiz);

  $('#replayBtn').addEventListener('click', startCards);

  function init() {
    App.i18n.apply();
    paintStars();
    startCards();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
