/* ============================================================
   Routime — Teléfonos Importantes (memoria: recordar que el
   112 sirve para policía, bomberos y emergencia médica)
   Datos en data.js (DATA.cards, DATA.number, DATA.quiz). Flujo
   lineal en 3 pasos, tal y como se pidió la actividad:
   1) Fichas: una tarjeta por servicio (policía, bomberos,
      emergencia médica), siempre con el mismo número, 112.
   2) Resumen: una sola tarjeta que repasa las 3 fichas juntas,
      para remarcar que el número no cambia.
   3) Test: quiz de 3 opciones (motor de Señales/Emergencias)
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
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.estrellas !== 'number') progress.estrellas = 0;
  if (!progress.completedRounds) progress.completedRounds = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { starsEl.textContent = '⭐ ' + progress.estrellas; }
  function t(key) { return App.i18n.t(key); }
  function quizBank() { return DATA.quiz[App.i18n.locale()] || DATA.quiz.es; }

  function show(screen) {
    [cardsScreen, summaryScreen, quizScreen, endScreen].forEach(function (s) {
      s.classList.toggle('oculto', s !== screen);
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
    if (false && App.tts && App.tts.speak) App.tts.speak(cardSpeech(card));
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
    quizExplanationWrap.classList.add('oculto');
    quizExplanation.textContent = '';
    quizNextBtn.classList.add('oculto');
    quizOptions.innerHTML = '';

    var opciones = App.utils.shuffle(item.opciones.map(function (opt, i) {
      return { texto: opt, esCorrecta: i === item.correcta };
    }));
    opciones.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { answerQuiz(btn, op.esCorrecta, item); });
      quizOptions.appendChild(btn);
    });

    paintQuizProgress();
    paintStars();
  }

  function showQuizExplanation(item) {
    quizExplanation.textContent = t('correctExplanation');
    quizExplanationWrap.classList.remove('oculto');
  }

  function answerQuiz(btn, esCorrecta, item) {
    if (quizResolved) return;
    if (esCorrecta) {
      showQuizExplanation(item);
      quizResolved = true;
      btn.classList.add('correcta');
      App.utils.$$('#quizOptions .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(quizFeedback);
      progress.estrellas += 1;
      quizCorrectCount += 1;
      save();
      paintStars();
      quizNextBtn.classList.remove('oculto');
      quizNextBtn.focus();
    } else {
      quizAttempts += 1;
      if (quizAttempts === 1) {
        quizExplanation.textContent = t('hint') + '"' + item.situacion + '"';
        quizExplanationWrap.classList.remove('oculto');
      } else {
        showQuizExplanation(item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
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
    $('#finalSummary').textContent.textContent = '';
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */
  nextCardBtn.addEventListener('click', nextCard);
  cardListenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(cardSpeech(DATA.cards[cardIdx]));
  });
  summaryListenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(summarySpeech());
  });
  startQuizBtn.addEventListener('click', startQuiz);
  quizListenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(quizItems[quizIdx].situacion);
  });
  quizExplanationListenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(quizExplanation.textContent);
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
