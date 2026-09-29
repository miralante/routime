/* ============================================================
   Routime — Diccionario (lenguaje: words difíciles con
   significado sencillo, aprendizaje significativo)
   Datos en data.js (DATA.es/DATA.en, cada uno una lista de grupos
   de 8 words). Por cada grupo, flujo en 2 steps:
   1) Fichas: una tarjeta por palabra que une palabra + significado
      + ejemplo real, para anclar la palabra nueva a algo conocido
      (aprendizaje significativo, no memorización suelta).
   2) Test: motor de quiz de 3 options (como Dichos/Señales):
      se ve la palabra, se elige su significado entre el correct
      y el de otras dos words del mismo grupo. El error nunca
      se castiga: pista con el ejemplo en el primer fallo,
      explicación completa en el segundo.
   Progresión automática: empieza con el grupo fácil y sube según
   el progress guardado, sin mostrar selección de nivel.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'dictionary';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var cardsScreen = $('#cardsScreen');
  var quizScreen = $('#quizScreen');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');
  var levelEl = $('#dificultad');

  var cardsProgressFill = $('#cardsProgressFill');
  var cardsProgressText = $('#cardsProgressText');
  var wordDisplay = $('#wordDisplay');
  var definitionText = $('#definitionText');
  var exampleText = $('#exampleText');
  var cardListenBtn = $('#cardListenBtn');
  var nextCardBtn = $('#nextCardBtn');

  var quizProgressFill = $('#quizProgressFill');
  var quizProgressText = $('#quizProgressText');
  var quizWordDisplay = $('#quizWordDisplay');
  var quizListenBtn = $('#quizListenBtn');
  var quizOptions = $('#quizOptions');
  var quizFeedback = $('#quizFeedback');
  var quizExplanationWrap = $('#quizExplanationWrap');
  var quizExplanation = $('#quizExplanation');
  var quizExplanationListenBtn = $('#quizExplanationListenBtn');
  var quizNextBtn = $('#quizNextBtn');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function t(key) { return App.i18n.t(key); }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function show(screen) {
    [startScreen, cardsScreen, quizScreen, endScreen].forEach(function (s) {
      s.classList.toggle('hidden', s !== screen);
    });
  }

  /* ---------- Nivel según progress ---------- */
  function levelBasedOnProgress() {
    var idx = Math.min(progress.roundsCompleted, bank().length - 1);
    return bank()[idx];
  }

  function renderLevel() {
    if (levelEl) {
      var count = bank().porRonda;
      levelEl.textContent = count + ' ' + (count === 1 ? t('palabra') : t('palabras'));
    }
  }

  /* ---------- Pantalla inicial ---------- */
  function startGame() {
    currentLevel = levelBasedOnProgress();
    cardIdx = 0;
    show(cardsScreen);
    renderLevel();
    renderCard();
  }

  /* ---------- Paso 1: fichas ---------- */
  var currentLevel = null;
  var cardIdx = 0;

  function renderCard() {
    var item = currentLevel.words[cardIdx];
    wordDisplay.textContent = item.word;
    definitionText.textContent = item.definition;
    exampleText.textContent = item.example;
    var total = currentLevel.words.length;
    cardsProgressFill.style.width = (((cardIdx + 1) / total) * 100) + '%';
    cardsProgressText.textContent = '';
  }

  function cardSpeech(item) {
    return item.word + '. ' + t('definitionLabel') + ' ' + item.definition +
      ' ' + t('exampleLabel') + ' ' + item.example;
  }

  function nextCard() {
    cardIdx += 1;
    if (cardIdx >= currentLevel.words.length) {
      startQuiz();
    } else {
      renderCard();
    }
  }

  /* ---------- Paso 2: test ---------- */
  var quizItems = [];
  var quizIdx = 0;
  var quizCorrectCount = 0;
  var quizResolved = false;
  var quizAttempts = 0;

  function startQuiz() {
    quizItems = App.utils.shuffle(currentLevel.words);
    quizIdx = 0;
    quizCorrectCount = 0;
    show(quizScreen);
    renderQuiz();
  }

  function paintQuizProgress() {
    var total = quizItems.length;
    quizProgressFill.style.width = ((quizIdx / total) * 100) + '%';
    quizProgressText.textContent = '';
  }

  function renderQuiz() {
    var item = quizItems[quizIdx];
    quizResolved = false;
    quizAttempts = 0;
    quizWordDisplay.textContent = item.word;
    quizFeedback.textContent = '';
    quizFeedback.className = 'feedback';
    quizExplanationWrap.classList.add('hidden');
    quizExplanation.textContent = '';
    quizNextBtn.classList.add('hidden');
    quizOptions.innerHTML = '';

    var distractors = App.utils.shuffle(currentLevel.words.filter(function (w) {
      return w.word !== item.word;
    })).slice(0, 2).map(function (w) { return w.definition; });
    var values = App.utils.shuffle([item.definition].concat(distractors));

    values.forEach(function (definition) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = definition;
      btn.addEventListener('click', function () { answerQuiz(btn, definition === item.definition, item); });
      quizOptions.appendChild(btn);
    });

    paintQuizProgress();
    paintStars();
  }

  function answerQuiz(btn, isCorrect, item) {
    if (quizResolved) return;
    if (isCorrect) {
      quizExplanation.textContent = t('correctExplanation');
      quizExplanationWrap.classList.remove('hidden');
      quizResolved = true;
      btn.classList.add('correcta');
      App.utils.$$('#quizOptions .btn-opcion').forEach(function (b) { b.disabled = true; });
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
        quizExplanation.textContent = t('hint') + '"' + item.example + '"';
        quizExplanationWrap.classList.remove('hidden');
      } else {
        quizExplanation.textContent = t('wrongExplanationPrefix') + item.definition;
        quizExplanationWrap.classList.remove('hidden');
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(quizFeedback);
      App.feedback.lockUntilAck(App.utils.$$('#quizOptions .btn-opcion'), quizExplanationWrap);
    }
  }

  function nextQuiz() {
    quizIdx += 1;
    if (quizIdx >= quizItems.length) {
      finishQuiz();
    } else {
      renderQuiz();
    }
  }

  function finishQuiz() {
    progress.roundsCompleted += 1;
    save();
    show(endScreen);
    $('#finalSummary').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompleted + 1, bank().length));
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */

  $('#btnPlay').addEventListener('click', startGame);
  nextCardBtn.addEventListener('click', nextCard);
  if (cardListenBtn) cardListenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(cardSpeech(currentLevel.words[cardIdx]));
  });
  if (quizListenBtn) quizListenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(quizItems[quizIdx].word + '. ' + t('quizQuestion'));
  });
  if (quizExplanationListenBtn) quizExplanationListenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(quizExplanation.textContent);
  });
  quizNextBtn.addEventListener('click', nextQuiz);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  var btnMenu = $('#btnMenu');
  if (btnMenu) btnMenu.addEventListener('click', function () {
    endScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    cardsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    paintStars();
  });

  function init() {
    App.i18n.apply();
    paintStars();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
