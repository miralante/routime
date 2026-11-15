/* ============================================================
   Routime — Diccionario (lenguaje: words difíciles con
   significado sencillo, aprendizaje significativo)
   Datos en data.js (DATA.es/DATA.en, cada uno una lista de grupos
   de 8 words). Por cada grupo, flujo en 2 steps:
   1) Fichas: una tarjeta por palabra que une palabra + significado
      + ejemplo real, para anclar la palabra nueva a algo conocido
      (aprendizaje significativo, no memorización suelta).
   2) Test: tablero de parejas de 4 palabras. Se toca una palabra
      y luego su significado: la pareja acertada queda marcada.
      El error nunca se castiga: pista con el ejemplo en el primer
      fallo, el significado completo en el segundo.
   Progresión automática: empieza con el grupo fácil y sube según
   el progress guardado, sin mostrar selección de nivel.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'dictionary';
  var $ = App.utils.$;

  var cardsScreen = $('#cardsScreen');
  var quizScreen = $('#quizScreen');
  var pair = App.utils.pairStart(cardsScreen, quizScreen, $('#nextCardBtn'));
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
  var progress = App.storage.getWithStars(TOOL_ID);
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    levels: function () { return bank(); },
    starsEl: function () { return starsEl; }
  });
  var save = glue.save, levelBasedOnProgress = glue.levelFromProgress;
  var paintStars = glue.paintStars;
  function t(key) { return App.i18n.t(key); }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function show(screen) {
    [cardsScreen, quizScreen, endScreen].forEach(function (s) {
      s.classList.toggle('hidden', s !== screen);
    });
  }

  /* ---------- Nivel según progress ---------- */

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

  /* ---------- Paso 2: test ----------
     The test is a board of four pairs: the word on one side, the meaning on
     the other. The child taps a word and then its meaning. A right pair stays
     marked; a wrong one only asks to read again (hint, then the meaning). */
  var BOARD_SIZE = 4;
  var quizBoards = [];
  var quizIdx = 0;
  var quizCorrectCount = 0;
  var quizResolved = false;
  var quizAttempts = 0;
  var quizSelectedWord = null;   /* { item, button } waiting for its meaning */
  var quizMatched = 0;
  var quizMissed = {};           /* word -> true once a pair of that word was missed */

  function startQuiz() {
    var words = App.utils.shuffle(currentLevel.words);
    quizBoards = [];
    for (var i = 0; i < words.length; i += BOARD_SIZE) quizBoards.push(words.slice(i, i + BOARD_SIZE));
    quizIdx = 0;
    quizCorrectCount = 0;
    show(quizScreen);
    pair.enter();
    renderQuiz();
  }

  function paintQuizProgress() {
    var total = quizBoards.length;
    quizProgressFill.style.width = ((quizIdx / total) * 100) + '%';
    quizProgressText.textContent = '';
  }

  function renderQuiz() {
    var board = quizBoards[quizIdx];
    quizResolved = false;
    quizAttempts = 0;
    quizMatched = 0;
    quizSelectedWord = null;
    quizMissed = {};
    quizWordDisplay.textContent = t('matchInstruction');
    quizFeedback.textContent = '';
    quizFeedback.className = 'feedback';
    quizExplanationWrap.classList.add('hidden');
    quizExplanation.textContent = '';
    quizNextBtn.classList.add('hidden');
    quizOptions.innerHTML = '';

    var wordsCol = document.createElement('div');
    wordsCol.className = 'pareja-columna pareja-palabras';
    var meaningsCol = document.createElement('div');
    meaningsCol.className = 'pareja-columna pareja-significados';

    board.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion pareja-palabra';
      btn.textContent = item.word;
      btn.addEventListener('click', function () { pickWord(item, btn); });
      wordsCol.appendChild(btn);
    });
    App.utils.shuffle(board.slice()).forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion pareja-significado';
      btn.textContent = item.definition;
      btn.addEventListener('click', function () { pickMeaning(item, btn); });
      meaningsCol.appendChild(btn);
    });
    quizOptions.appendChild(wordsCol);
    quizOptions.appendChild(meaningsCol);

    paintQuizProgress();
    paintStars();
  }

  /* Step 1: a word. */
  function pickWord(item, btn) {
    if (quizResolved || btn.disabled) return;
    clearSelectedWord();
    quizSelectedWord = { item: item, button: btn };
    btn.classList.add('is-selected');
    quizFeedback.className = 'feedback';
    quizFeedback.textContent = t('matchPickMeaning');
  }

  function clearSelectedWord() {
    if (quizSelectedWord) quizSelectedWord.button.classList.remove('is-selected');
    quizSelectedWord = null;
  }

  /* Step 2: its meaning. Right: the pair stays marked. Wrong: read again. */
  function pickMeaning(item, btn) {
    if (quizResolved || btn.disabled) return;
    if (!quizSelectedWord) {
      quizFeedback.className = 'feedback';
      quizFeedback.textContent = t('matchPickWordFirst');
      return;
    }
    var chosen = quizSelectedWord;
    var wordBtn = chosen.button;
    clearSelectedWord();
    if (chosen.item.word === item.word) {
      wordBtn.classList.add('correcta');
      btn.classList.add('correcta');
      wordBtn.disabled = true;
      btn.disabled = true;
      quizMatched += 1;
      if (!quizMissed[item.word]) {
        progress.stars += 1;
        save();
        paintStars();
      }
      App.feedback.success(quizFeedback);
      quizFeedback.textContent = t('matchRight');
      if (quizMatched === BOARD_SIZE) finishBoard();
      return;
    }
    answerWrong(wordBtn, btn, chosen.item);
  }

  function answerWrong(wordBtn, meaningBtn, item) {
    quizAttempts += 1;
    quizMissed[item.word] = true;
    wordBtn.classList.add('animo');
    meaningBtn.classList.add('animo');
    App.feedback.encourage(quizFeedback);
    quizExplanation.textContent = quizAttempts === 1
      ? t('hint') + '"' + item.example + '"'
      : t('wrongExplanationPrefix') + item.word + ': ' + item.definition;
    quizExplanationWrap.classList.remove('hidden');
    setTimeout(function () {
      wordBtn.classList.remove('animo');
      meaningBtn.classList.remove('animo');
    }, 900);
  }

  function finishBoard() {
    quizResolved = true;
    quizNextBtn.classList.remove('hidden');
    quizNextBtn.focus();
  }

  function nextQuiz() {
    quizIdx += 1;
    if (quizIdx >= quizBoards.length) {
      finishQuiz();
    } else {
      renderQuiz();
    }
  }

  function finishQuiz() {
    progress.roundsCompleted += 1;
    save();
    pair.leave(false);
    show(endScreen);
    $('#finalSummary').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel', { n: Math.min(progress.roundsCompleted + 1, bank().length) });
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */

  nextCardBtn.addEventListener('click', nextCard);
  if (cardListenBtn) cardListenBtn.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(cardSpeech(currentLevel.words[cardIdx]));
  });
  if (quizListenBtn) quizListenBtn.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(t('matchInstruction'));
  });
  if (quizExplanationListenBtn) quizExplanationListenBtn.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(quizExplanation.textContent);
  });
  quizNextBtn.addEventListener('click', nextQuiz);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  var btnMenu = $('#btnMenu');
  if (btnMenu) btnMenu.addEventListener('click', function () {
    App.utils.goMenu();
  });

  function init() {
    App.i18n.apply();
    paintStars();
    // Iniciar directamente la actividad
    startGame();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
