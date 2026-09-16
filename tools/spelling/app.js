/* ============================================================
   Routime — Completa la Palabra (lenguaje: ortografía)
   Datos en data.js (DATA.es/DATA.en, grupos de 8 words cada
   uno). Por cada palabra se tapa una letra (DATA.<loc>[i].words[j]
   .blank) y se ofrecen 3 options (options[0] es siempre la
   correcta; se barajan al pintar). Motor de quiz igual al de
   Diccionario/Números Romanos: el error nunca se castiga, pista
   en el primer fallo (se oye la palabra completa), respuesta
   revelada en el segundo.
   Progresión automática: empieza con el grupo fácil y sube según
   el progress guardado, sin mostrar selección de nivel.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'spelling';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var quizScreen = $('#quizScreen');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');
  var levelEl = $('#dificultad');

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

  function maskedWord(item) {
    return item.word.split('').map(function (ch, i) {
      return i === item.blank ? '_' : ch;
    }).join('');
  }

  /* ---------- Nivel según progress ---------- */
  function levelBasedOnProgress() {
    var idx = Math.min(progress.roundsCompleted, bank().length - 1);
    return bank()[idx];
  }

  function renderLevel() {
    if (levelEl) {
      var count = currentLevel.words.length;
      levelEl.textContent = count + ' ' + (count === 1 ? t('palabra') : t('palabras'));
    }
  }

  /* ---------- Pantalla inicial ---------- */
  function startGame() {
    currentLevel = levelBasedOnProgress();
    items = App.utils.shuffle(currentLevel.words);
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
  var attempts = 0;

  function paintProgress() {
    var total = items.length;
    progressFill.style.width = ((idx / total) * 100) + '%';
    progressText.textContent = '';
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
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
    nextBtn.classList.add('hidden');
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

  function answer(btn, isCorrect, item, correctLetter) {
    if (resolved) return;
    if (isCorrect) {
      paintTiles(item, correctLetter);
      explanationEl.textContent = t('correctExplanation');
      explanationWrap.classList.remove('hidden');
      resolved = true;
      btn.classList.add('correcta');
      App.utils.$$('#options .btn-opcion').forEach(function (b) { b.disabled = true; });
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
        explanationEl.textContent = t('hint') + '"' + maskedWord(item) + '"';
        explanationWrap.classList.remove('hidden');
      } else {
        explanationEl.textContent = t('wrongExplanationPrefix') + item.word;
        explanationWrap.classList.remove('hidden');
      }
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
    progress.roundsCompleted += 1;
    save();
    show(endScreen);
    $('##finalSummary').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompleted + 1, bank().length));
    $('##transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */

  $('#btnPlay').addEventListener('click', startGame);
  listenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].word);
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
