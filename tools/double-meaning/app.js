/* ============================================================
   Routime — Doble Sentido (lenguaje: detectar si una palabra
   de la frase puede significar una cosa o dos)
   Datos en data.js (DATA.es/DATA.en, grupos de 8 frases cada uno,
   mezclando a propósito frases con doble sentido y frases con un
   solo significado). Pregunta binaria (Sí / No) por frase: el
   error nunca se castiga; pista en el primer fallo, y al acertar
   siempre se explican los significados reales, aunque la persona
   haya fallado antes.
   Progresión automática: empieza con el grupo fácil y sube según
   el progress guardado, sin mostrar selección de nivel.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'double-meaning';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var quizScreen = $('#quizScreen');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');
  var levelEl = $('#dificultad');

  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var sentenceText = $('#sentenceText');
  var listenBtn = $('#listenBtn');
  var optionsEl = $('#options');
  var feedbackEl = $('#feedback');
  var explanationWrap = $('#explanationWrap');
  var explanationEl = $('#explanation');
  var nextBtn = $('#nextBtn');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function t(key) { return App.i18n.t(key); }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function show(screen) {
    [startScreen, quizScreen, endScreen].forEach(function (s) {
      s.classList.toggle('hidden', s !== screen);
    });
  }

  function explanationFor(item) {
    if (item.hasDouble) {
      return t('doubleExplanation').replace('{m1}', item.meanings[0]).replace('{m2}', item.meanings[1]);
    }
    return t('singleExplanation').replace('{m1}', item.meanings[0]);
  }

  /* ---------- Nivel según progress ---------- */
  function levelBasedOnProgress() {
    var idx = Math.min(progress.roundsCompleted, bank().length - 1);
    return bank()[idx];
  }

  function renderLevel() {
    if (levelEl) {
      var count = currentLevel.items.length;
      levelEl.textContent = count + ' ' + (count === 1 ? t('frase') : t('frases'));
    }
  }

  /* ---------- Pantalla inicial ---------- */
  function startGame() {
    currentLevel = levelBasedOnProgress();
    items = App.utils.shuffle(currentLevel.items);
    idx = 0;
    correctCount = 0;
    show(quizScreen);
    renderLevel();
    render();
  }

  /* ---------- Ronda de quiz ---------- */
  var currentLevel = null;
  var items = [];
  var idx = 0;
  var correctCount = 0;
  var resolved = false;
  var attempts = 0;   /* Socratic counter per item (rule 12) */

  function paintProgress() {
    var total = items.length;
    progressFill.style.width = ((idx / total) * 100) + '%';
    progressText.textContent = '';
  }

  function render() {
    var item = items[idx];
    resolved = false;
    attempts = 0;
    sentenceText.textContent = item.sentence;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
    nextBtn.classList.add('hidden');
    optionsEl.innerHTML = '';

    [
      { label: t('optionYes'), value: true },
      { label: t('optionNo'), value: false }
    ].forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.label;
      btn.addEventListener('click', function () { answer(btn, op.value === item.hasDouble, item); });
      optionsEl.appendChild(btn);
    });

    paintProgress();
    paintStars();
  }

  function answer(btn, isCorrect, item) {
    if (resolved) return;
    if (isCorrect) {
      explanationEl.textContent = explanationFor(item);
      explanationWrap.classList.remove('hidden');
      resolved = true;
      btn.classList.add('correcta');
      App.utils.$('#options .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      correctCount += 1;
      save();
      paintStars();
      nextBtn.classList.remove('hidden');
      nextBtn.focus();
    } else {
      attempts += 1;
      if (attempts === 1) {
        explanationEl.textContent = t('hint');
      } else {
        explanationEl.textContent = explanationFor(item);
      }
      explanationWrap.classList.remove('hidden');
      if (false && App.tts && App.tts.speak) App.tts.speak(item.sentence);
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$('#options .btn-opcion'), explanationWrap);
    }
  }

  function next() {
    idx += 1;
    if (idx >= items.length) {
      finish();
    } else {
      render();
    }
  }

  function finish() {
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
  listenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].sentence);
  });
  $('#explanationListenBtn').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(explanationEl.textContent);
  });
  nextBtn.addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    paintStars();
  });

  function init() {
    App.i18n.apply();
    paintStars();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
