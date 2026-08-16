/* ============================================================
   Routime — Completa la Palabra (lenguaje: ortografía)
   Datos en data.js (DATA.es/DATA.en, grupos de 8 palabras cada
   uno). Por cada palabra se tapa una letra (DATA.<loc>[i].words[j]
   .blank) y se ofrecen 3 opciones (options[0] es siempre la
   correcta; se barajan al pintar). Motor de quiz igual al de
   Diccionario/Números Romanos: el error nunca se castiga, pista
   en el primer fallo (se oye la palabra completa), respuesta
   revelada en el segundo.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'spelling';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var quizScreen = $('#quizScreen');
  var endScreen = $('#endScreen');
  var levelsEl = $('#levels');
  var starsEl = $('#stars');

  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var wordPicto = $('#wordPicto');
  var wordTiles = $('#wordTiles');
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

  function maskedWord(item) {
    return item.word.split('').map(function (ch, i) {
      return i === item.blank ? '_' : ch;
    }).join('');
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

  /* ---------- Ronda de quiz ---------- */
  var currentLevel = null;
  var items = [];
  var idx = 0;
  var correctCount = 0;
  var resolved = false;
  var attempts = 0;

  function startLevel(level) {
    currentLevel = level;
    items = App.utils.shuffle(level.words);
    idx = 0;
    correctCount = 0;
    App.tts.stop();
    show(quizScreen);
    render();
  }

  function paintProgress() {
    var total = items.length;
    progressFill.style.width = ((idx / total) * 100) + '%';
    progressText.textContent = idx + ' / ' + total;
  }

  function paintTiles(item, revealedLetter) {
    wordTiles.innerHTML = '';
    item.word.split('').forEach(function (ch, i) {
      var tile = document.createElement('span');
      tile.className = 'tile';
      if (i === item.blank) {
        tile.className += ' blank';
        tile.textContent = revealedLetter || '?';
        if (revealedLetter) tile.className += ' correcta';
      } else {
        tile.textContent = ch;
      }
      wordTiles.appendChild(tile);
    });
  }

  function render() {
    var item = items[idx];
    resolved = false;
    attempts = 0;
    wordPicto.textContent = item.picto;
    paintTiles(item, null);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('oculto');
    explanationEl.textContent = '';
    nextBtn.classList.add('oculto');
    optionsEl.innerHTML = '';

    var correctLetter = item.options[0];
    App.utils.shuffle(item.options).forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion letter-opcion';
      btn.textContent = opt;
      if (opt === '—') btn.setAttribute('aria-label', t('noLetter'));
      btn.addEventListener('click', function () { answer(btn, opt === correctLetter, item, correctLetter); });
      optionsEl.appendChild(btn);
    });

    paintProgress();
    paintStars();
  }

  function answer(btn, esCorrecta, item, correctLetter) {
    if (resolved) return;
    if (esCorrecta) {
      paintTiles(item, correctLetter);
      explanationEl.textContent = t('correctExplanation');
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
        explanationEl.textContent = t('hint') + '"' + maskedWord(item) + '"';
        explanationWrap.classList.remove('oculto');
      } else {
        explanationEl.textContent = t('wrongExplanationPrefix') + item.word;
        explanationWrap.classList.remove('oculto');
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('#options .btn-opcion'), explanationWrap);
    }
  }

  function next() {
    idx += 1;
    App.tts.stop();
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
    $('#finalSummary').textContent = t('finalSummary')
      .replace('{n}', correctCount).replace('{total}', progress.estrellas);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */

  $('#backLevelsBtn').addEventListener('click', goStart);
  listenBtn.addEventListener('click', function () {
    App.tts.speak(items[idx].word);
  });
  $('#explanationListenBtn').addEventListener('click', function () {
    App.tts.speak(explanationEl.textContent);
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
