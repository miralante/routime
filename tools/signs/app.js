/* ============================================================
   Routime — Señales (señales de peligro, avisos, baño, etc.)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: un tablero de cuatro señales y sus significados, mezclados.
   La persona toca una señal y después lo que significa. Un par que va
   junto queda marcado con ✓. Un par que no va recibe una pista, sin
   castigo, y se puede volver a intentar. Completar el tablero da una
   estrella. Una ronda son dos tableros.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página arma cada tablero, cuenta los pares y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var levelEl = $('#level');
  var signsEl = $('#senales');
  var meaningsEl = $('#significados');
  var instructionEl = $('#tableroInstruccion');
  var feedbackEl = $('#feedback');
  var explanationWrap = $('#explanationWrap');
  var explanationEl = $('#explanation');
  var currentLevel = null;
  var BOARD = 4;

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  /* The level follows the rounds completed: each completed round moves up one level. */
  function levelFor(progress) {
    var levels = bank().niveles;
    return levels[Math.min(progress.roundsCompleted || 0, levels.length - 1)];
  }

  /* The round is split in boards of four signs; each board is one item of the round. */
  function boardsOf(picks) {
    var boards = [];
    for (var i = 0; i < picks.length; i += BOARD) boards.push(picks.slice(i, i + BOARD));
    return boards;
  }

  function showHint(text) {
    explanationEl.textContent = text;
    explanationWrap.classList.remove('hidden');
  }

  App.activityPlay({
    toolId: 'senales',
    roundsKey: 'roundsCompleted',
    ui: {
      game: '#gameScreen',
      end: '#endScreen',
      feedback: '#feedback',
      explanationWrap: '#explanationWrap',
      explanation: '#explanation',
      btnNext: '#btnNext',
      progressFill: '#progressFill',
      progressText: '#progressText',
      stars: '#stars',
      btnRepeat: '#repeatBtn'
    },
    items: function (progress) {
      if (!progress.completed) progress.completed = {};
      currentLevel = levelFor(progress);
      levelEl.textContent = currentLevel.name;
      return boardsOf(App.utils.shuffle(currentLevel.items).slice(0, bank().porRonda));
    },
    mount: function (board, play) {
      signsEl.innerHTML = '';
      meaningsEl.innerHTML = '';
      explanationWrap.classList.add('hidden');
      explanationEl.textContent = '';
      feedbackEl.textContent = '';
      feedbackEl.className = 'feedback';
      instructionEl.textContent = App.i18n.t('tableroInstruccion');

      var pairs = board.map(function (item) { return { item: item, tile: null, button: null }; });
      var selected = null;   /* the pair whose sign is picked */
      var matched = 0;
      var misses = 0;
      var done = false;

      function chooseSign(pair) {
        if (selected) selected.tile.classList.remove('is-selected');
        selected = pair;
        pair.tile.classList.add('is-selected');
        instructionEl.textContent = App.i18n.t('tableroSignificado');
      }

      function chooseMeaning(pair) {
        if (!selected || done) return;
        var chosen = selected;
        selected = null;
        chosen.tile.classList.remove('is-selected');
        instructionEl.textContent = App.i18n.t('tableroInstruccion');
        if (chosen === pair) {
          pair.tile.classList.add('is-matched');
          pair.tile.disabled = true;
          pair.button.classList.add('correcta');
          pair.button.disabled = true;
          matched += 1;
          App.feedback.success(feedbackEl);
          if (matched === pairs.length) {
            done = true;
            instructionEl.textContent = '';
            play.attempt(true, { control: null, explanation: App.i18n.t('explicacionCorrecta') });
          }
          return;
        }
        /* A pair that does not go together: encouragement and the hint, no punishment. */
        misses += 1;
        pair.button.classList.add('animo');
        App.feedback.encourage(feedbackEl);
        showHint(misses > 1
          ? App.i18n.t('explicacionIncorrectaA') + chosen.item.options[chosen.item.correcta] + '.'
          : App.i18n.t('pista') + '"' + chosen.item.name + '"');
      }

      pairs.forEach(function (pair) {
        var tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'sign-tile ' + pair.item.tipo;
        tile.textContent = pair.item.senal;
        tile.setAttribute('aria-label', App.i18n.t('senalAria').replace('{name}', pair.item.name));
        tile.addEventListener('click', function () { if (!done && !tile.disabled) chooseSign(pair); });
        pair.tile = tile;
        signsEl.appendChild(tile);
      });

      /* The meanings are the right meanings of the four signs, in a new order each time. */
      App.utils.shuffle(pairs.slice()).forEach(function (pair) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.textContent = pair.item.options[pair.item.correcta];
        btn.addEventListener('click', function () { if (!btn.disabled) chooseMeaning(pair); });
        pair.button = btn;
        meaningsEl.appendChild(btn);
      });

      /* The board is played on the page, so the activity does not lock its controls: none is returned. */
      return [];
    },
    onEnd: function (play) {
      play.progress.completed[currentLevel.id] = (play.progress.completed[currentLevel.id] || 0) + 1;
      play.save();
      var transferEl = $('#transferencia');
      if (transferEl) transferEl.textContent = '';
    }
  });

  $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });
})();
