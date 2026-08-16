/* ============================================================
   Routime — Diccionario (lenguaje: palabras difíciles con
   significado sencillo, aprendizaje significativo)
   Datos en data.js (DATA.es/DATA.en, cada uno una lista de grupos
   de 8 palabras). Por cada grupo, flujo en 2 pasos:
   1) Fichas: una tarjeta por palabra que une palabra + significado
      + ejemplo real, para anclar la palabra nueva a algo conocido
      (aprendizaje significativo, no memorización suelta).
   2) Test: motor de quiz de 3 opciones (como Dichos/Señales):
      se ve la palabra, se elige su significado entre el correcto
      y el de otras dos palabras del mismo grupo. El error nunca
      se castiga: pista con el ejemplo en el primer fallo,
      explicación completa en el segundo.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'dictionary';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var cardsScreen = $('#cardsScreen');
  var quizScreen = $('#quizScreen');
  var endScreen = $('#endScreen');
  var levelsEl = $('#levels');
  var starsEl = $('#stars');

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
  if (typeof progress.estrellas !== 'number') progress.estrellas = 0;
  if (!progress.completed) progress.completed = {};

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { starsEl.textContent = '⭐ ' + progress.estrellas; }
  function t(key) { return App.i18n.t(key); }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function show(screen) {
    [startScreen, cardsScreen, quizScreen, endScreen].forEach(function (s) {
      s.classList.toggle('oculto', s !== screen);
    });
  }

  /* ---------- Pantalla inicial: elegir grupo ---------- */

  function paintLevels() {
    levelsEl.innerHTML = '';
    bank().forEach(function (level) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-level';
      var done = progress.completed[level.id] ? ' ' + t('done') : '';
      btn.innerHTML = level.name + done +
        '<span class="level-info">' + t('wordsCount') + '</span>';
      btn.addEventListener('click', function () { startLevel(level); });
      levelsEl.appendChild(btn);
    });
  }

  function goStart() {
    App.tts.stop();
    paintLevels();
    show(startScreen);
  }

  /* ---------- Paso 1: fichas ---------- */
  var currentLevel = null;
  var cardIdx = 0;

  function startLevel(level) {
    currentLevel = level;
    cardIdx = 0;
    App.tts.stop();
    show(cardsScreen);
    renderCard();
  }

  function paintCardProgress() {
    var total = currentLevel.words.length;
    cardsProgressFill.style.width = (((cardIdx + 1) / total) * 100) + '%';
    cardsProgressText.textContent = (cardIdx + 1) + ' / ' + total;
  }

  function cardSpeech(item) {
    return item.word + '. ' + t('definitionLabel') + ' ' + item.definition +
      ' ' + t('exampleLabel') + ' ' + item.example;
  }

  function renderCard() {
    var item = currentLevel.words[cardIdx];
    wordDisplay.textContent = item.word;
    definitionText.textContent = item.definition;
    exampleText.textContent = item.example;
    paintCardProgress();
  }

  function nextCard() {
    App.tts.stop();
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
    App.tts.stop();
    show(quizScreen);
    renderQuiz();
  }

  function paintQuizProgress() {
    var total = quizItems.length;
    quizProgressFill.style.width = ((quizIdx / total) * 100) + '%';
    quizProgressText.textContent = quizIdx + ' / ' + total;
  }

  function renderQuiz() {
    var item = quizItems[quizIdx];
    quizResolved = false;
    quizAttempts = 0;
    quizWordDisplay.textContent = item.word;
    quizFeedback.textContent = '';
    quizFeedback.className = 'feedback';
    quizExplanationWrap.classList.add('oculto');
    quizExplanation.textContent = '';
    quizNextBtn.classList.add('oculto');
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

  function answerQuiz(btn, esCorrecta, item) {
    if (quizResolved) return;
    if (esCorrecta) {
      quizExplanation.textContent = t('correctExplanation');
      quizExplanationWrap.classList.remove('oculto');
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
        quizExplanation.textContent = t('hint') + '"' + item.example + '"';
        quizExplanationWrap.classList.remove('oculto');
      } else {
        quizExplanation.textContent = t('wrongExplanationPrefix') + item.definition;
        quizExplanationWrap.classList.remove('oculto');
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(quizFeedback);
      App.feedback.lockUntilAck(App.utils.$$('#quizOptions .btn-opcion'), quizExplanationWrap);
    }
  }

  function nextQuiz() {
    quizIdx += 1;
    App.tts.stop();
    if (quizIdx >= quizItems.length) {
      finishQuiz();
    } else {
      renderQuiz();
    }
  }

  function finishQuiz() {
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    show(endScreen);
    $('#finalSummary').textContent = t('finalSummary')
      .replace('{n}', quizCorrectCount).replace('{total}', progress.estrellas);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */

  $('#backLevelsBtnCards').addEventListener('click', goStart);
  $('#backLevelsBtnQuiz').addEventListener('click', goStart);
  nextCardBtn.addEventListener('click', nextCard);
  cardListenBtn.addEventListener('click', function () {
    App.tts.speak(cardSpeech(currentLevel.words[cardIdx]));
  });
  quizListenBtn.addEventListener('click', function () {
    App.tts.speak(quizItems[quizIdx].word + '. ' + t('quizQuestion'));
  });
  quizExplanationListenBtn.addEventListener('click', function () {
    App.tts.speak(quizExplanation.textContent);
  });
  quizNextBtn.addEventListener('click', nextQuiz);
  $('#replayBtn').addEventListener('click', function () { startLevel(currentLevel); });
  $('#otherLevelBtn').addEventListener('click', goStart);

  function init() {
    App.i18n.apply();
    paintStars();
    paintLevels();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
