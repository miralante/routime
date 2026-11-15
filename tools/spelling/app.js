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
  var pair = App.utils.pairStart(document.getElementById('startScreen'), document.getElementById('quizScreen'), document.getElementById('btnPlay'));

  var TOOL_ID = 'spelling';
  var $ = App.utils.$;

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
    [quizScreen, endScreen].forEach(function (s) {
      s.classList.toggle('hidden', s !== screen);
    });
  }

  function maskedWord(item) {
    return item.word.split('').map(function (ch, i) {
      return i === item.blank ? '_' : ch;
    }).join('');
  }

  /* ---------- Nivel según progress ---------- */

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
    pair.enter();
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

  /* The gap: the blank tile is a target. Tapping it (or Enter/Space on it) puts the
     letter chosen in the bank into the gap. */
  function paintTiles(item, revealedLetter) {
    wordTiles.innerHTML = '';
    item.word.split('').forEach(function (ch, i) {
      var tile = document.createElement('span');
      tile.className = 'tile';
      if (i === item.blank) {
        tile.className += ' blank';
        tile.textContent = revealedLetter || '?';
        if (revealedLetter) {
          tile.className += ' correcta';
        } else {
          tile.setAttribute('role', 'button');
          tile.setAttribute('tabindex', '0');
          tile.setAttribute('aria-label', t('gapAria'));
          tile.addEventListener('click', placeSelected);
          tile.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              placeSelected();
            }
          });
        }
      } else {
        tile.textContent = ch;
      }
      wordTiles.appendChild(tile);
    });
  }

  /* The letter chosen from the bank, waiting for the gap. */
  var selected = null;

  function render() {
    var item = items[idx];
    resolved = false;
    attempts = 0;
    selected = null;
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
      btn.setAttribute('aria-pressed', 'false');
      if (opt === '—') btn.setAttribute('aria-label', t('noLetter'));
      btn.addEventListener('click', function () {
        pickLetter(btn, opt === correctLetter, item, correctLetter);
      });
      optionsEl.appendChild(btn);
    });

    paintProgress();
    paintStars();
  }

  /* Step 1: choose a letter from the bank. Only the gap places it. */
  function pickLetter(btn, isCorrect, item, correctLetter) {
    if (resolved || btn.disabled) return;
    optionsEl.querySelectorAll('.letter-opcion').forEach(function (b) {
      b.classList.remove('is-selected');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('is-selected');
    btn.setAttribute('aria-pressed', 'true');
    selected = { btn: btn, isCorrect: isCorrect, item: item, correctLetter: correctLetter };
    feedbackEl.className = 'feedback';
    feedbackEl.textContent = t('placeHint');
  }

  /* Step 2: the gap receives the chosen letter. */
  function placeSelected() {
    if (resolved) return;
    if (!selected) {
      feedbackEl.className = 'feedback';
      feedbackEl.textContent = t('pickLetterFirst');
      return;
    }
    var s = selected;
    selected = null;
    s.btn.classList.remove('is-selected');
    s.btn.setAttribute('aria-pressed', 'false');
    answer(s.btn, s.isCorrect, s.item, s.correctLetter);
  }

  function answer(btn, isCorrect, item, correctLetter) {
    if (resolved) return;
    if (isCorrect) {
      paintTiles(item, correctLetter);
      explanationEl.textContent = t('correctExplanation');
      explanationWrap.classList.remove('hidden');
      resolved = true;
      btn.classList.add('correcta');
      App.feedback.markCorrect(btn, App.utils.$$('#options .btn-opcion'));
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      correctCount += 1;
      save();
      paintStars();
      nextBtn.classList.remove('hidden');
      nextBtn.focus();
    } else {
      attempts += 1;
      var answerAfterHint = attempts > 1;
      explanationEl.textContent = t('hint') + '"' + maskedWord(item) + '"';
      explanationWrap.classList.remove('hidden');
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('#options .btn-opcion'), explanationWrap, function () {
        if (answerAfterHint) {
          explanationEl.textContent = t('wrongExplanationPrefix') + item.word;
          explanationWrap.classList.remove('hidden');
        }
      });
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
    pair.leave(false);
    show(endScreen);
    $('#finalSummary').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel', { n: Math.min(progress.roundsCompleted + 1, bank().length) });
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */

  if (listenBtn) listenBtn.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(items[idx].word);
  });
  var explanationListenBtn = $('#explanationListenBtn');
  if (explanationListenBtn) explanationListenBtn.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(explanationEl.textContent);
  });
  nextBtn.addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });

  function init() {
    App.i18n.apply();
    paintStars();
    // The start screen (the explanation) first; «play» starts the round.
    $('#startScreen').classList.remove('hidden');
    $('#btnPlay').addEventListener('click', function () { startGame(); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
