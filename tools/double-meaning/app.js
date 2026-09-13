/* ============================================================
   Routime — Doble Sentido (lenguaje: detectar si una palabra
   de la frase puede significar una cosa o dos)
   Datos en data.js (DATA.es/DATA.en, grupos de 8 frases cada uno,
   mezclando a propósito frases con doble sentido y frases con un
   solo significado). Pregunta binaria (Sí / No) por frase: el
   error nunca se castiga; pista en el primer fallo, y al acertar
   siempre se explican los significados reales, aunque la persona
   haya fallado antes.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'double-meaning';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var quizScreen = $('#quizScreen');
  var endScreen = $('#endScreen');
  var levelsEl = $('#levels');
  var starsEl = $('#stars');

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
  if (typeof progress.estrellas !== 'number') progress.estrellas = 0;
  if (!progress.completed) progress.completed = {};

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { starsEl.textContent = '⭐ ' + progress.estrellas; }
  function t(key) { return App.i18n.t(key); }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function show(screen) {
    [startScreen, quizScreen, endScreen].forEach(function (s) {
      s.classList.toggle('oculto', s !== screen);
    });
  }

  function explanationFor(item) {
    if (item.hasDouble) {
      return t('doubleExplanation').replace('{m1}', item.meanings[0]).replace('{m2}', item.meanings[1]);
    }
    return t('singleExplanation').replace('{m1}', item.meanings[0]);
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
        '<span class="level-info">' + t('itemsCount') + '</span>';
      btn.addEventListener('click', function () { startLevel(level); });
      levelsEl.appendChild(btn);
    });
  }

  function goStart() {
    paintLevels();
    show(startScreen);
  }

  /* ---------- Ronda de quiz ---------- */
  var currentLevel = null;
  var items = [];
  var idx = 0;
  var correctCount = 0;
  var resolved = false;
  var attempts = 0;   /* Socratic counter per item (rule 12) */

  function startLevel(level) {
    currentLevel = level;
    items = App.utils.shuffle(level.items);
    idx = 0;
    correctCount = 0;
    show(quizScreen);
    render();
  }

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
    explanationWrap.classList.add('oculto');
    explanationEl.textContent = '';
    nextBtn.classList.add('oculto');
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

  function answer(btn, esCorrecta, item) {
    if (resolved) return;
    if (esCorrecta) {
      explanationEl.textContent = explanationFor(item);
      explanationWrap.classList.remove('oculto');
      resolved = true;
      btn.classList.add('correcta');
      App.utils.$$('#options .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      progress.estrellas += 1;
      correctCount += 1;
      save();
      paintStars();
      nextBtn.classList.remove('oculto');
      nextBtn.focus();
    } else {
      attempts += 1;
      if (attempts === 1) {
        explanationEl.textContent = t('hint');
      } else {
        explanationEl.textContent = explanationFor(item);
      }
      explanationWrap.classList.remove('oculto');
      if (false && App.tts && App.tts.speak) App.tts.speak(item.sentence);
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('#options .btn-opcion'), explanationWrap);
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
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    show(endScreen);
    $('#finalSummary').textContent.textContent = '';
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */

  $('#backLevelsBtn').addEventListener('click', goStart);
  listenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].sentence);
  });
  $('#explanationListenBtn').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(explanationEl.textContent);
  });
  nextBtn.addEventListener('click', next);
  $('#replayBtn').addEventListener('click', function () { startLevel(currentLevel); });
  $('#otherLevelBtn').addEventListener('click', goStart);

  function init() {
    App.i18n.apply();
    paintStars();
    paintLevels();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
