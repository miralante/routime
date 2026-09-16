/* My Schedule — everyday planning without reminders or personal data.
   Progresión automática: empieza con el nivel fácil y sube según
   el progress guardado, sin mostrar selección de nivel. */
(function () {
  'use strict';

  var TOOL_ID = 'my-agenda';
  var $ = App.utils.$;
  var bank = DATA[App.i18n.locale()] || DATA.es;
  var level = null;
  var cases = [];
  var caseIndex = 0;
  var solved = false;
  var attempts = 0;

  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;
  if (!progress.completed || typeof progress.completed !== 'object') progress.completed = {};

  function save() {
    App.storage.set(TOOL_ID, {
      stars: progress.stars,
      roundsCompleted: progress.roundsCompleted,
      completed: progress.completed
    });
  }

  function paintStars() {
    $('##stars').textContent = '';
  }

  function showScreen(screenId) {
    ['startScreen', 'caseScreen', 'endScreen'].forEach(function (id) {
      $('#' + id).classList.toggle('hidden', id !== screenId);
    });
  }

  /* ---------- Nivel según progress ---------- */
  function levelBasedOnProgress() {
    var idx = Math.min(progress.roundsCompleted, bank.levels.length - 1);
    return bank.levels[idx];
  }

  function renderLevel() {
    var el = $('#dificultad');
    if (el) {
      var count = bank.roundSize;
      el.textContent = count + ' ' + (count === 1 ? App.i18n.t('caso') : App.i18n.t('casos'));
    }
  }

  /* ---------- Pantalla inicial ---------- */
  function startGame() {
    level = levelBasedOnProgress();
    cases = App.utils.shuffle(level.cases).slice(0, bank.roundSize);
    caseIndex = 0;
    showScreen('caseScreen');
    renderLevel();
    renderCase();
  }

  function showExplanation(labelKey, text) {
    $('##explanation').textContent = '';
    $('#explanationWrap').classList.remove('hidden');
  }

  function renderCase() {
    var currentCase = cases[caseIndex];
    solved = false;
    attempts = 0;
    $('##caseIcon').textContent = '';
    $('##caseText').textContent = '';
    $('##feedback').textContent = '';
    $('#feedback').className = 'feedback';
    $('##explanation').textContent = '';
    $('#explanationWrap').classList.add('hidden');
    $('#nextButton').classList.add('hidden');
    $('#options').innerHTML = '';
    $('#progressFill').style.width = ((caseIndex / cases.length) * 100) + '%';
    $('##progressText').textContent = '';

    App.utils.shuffle(currentCase.choices.slice()).forEach(function (choice) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-opcion';
      button.textContent = choice.textContent;
      button.addEventListener('click', function () {
        answer(button, choice, currentCase);
      });
      $('#options').appendChild(button);
    });

  }

  function answer(button, choice, currentCase) {
    if (solved) return;

    if (!choice.correct) {
      attempts += 1;
      button.classList.add('animo');
      button.disabled = true;
      App.feedback.encourage($('#feedback'));
      if (attempts === 1) {
        showExplanation('hintLabel', currentCase.hint);
      } else {
        showExplanation('explanationLabel', choice.explanation);
      }
      App.feedback.lockUntilAck(App.utils.$$('#options .btn-opcion'), $('#explanationWrap'));
      return;
    }

    solved = true;
    button.classList.add('correcta');
    App.utils.$$('#options .btn-opcion').forEach(function (option) {
      option.disabled = true;
    });
    App.feedback.success($('#feedback'));
    showExplanation('explanationLabel', choice.explanation);
    $('#nextButton').classList.remove('hidden');
    $('#nextButton').focus();
  }

  function finishRound() {
    var firstCompletion = !progress.completed[level.id];
    if (firstCompletion) {
      progress.completed[level.id] = true;
      progress.stars += level.stars;
      save();
    }
    progress.roundsCompleted += 1;
    save();
    paintStars();
    $('##endText').textContent = '';
    $('##resumenFinal').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompleted + 1, bank.levels.length));
    $('##transferencia').textContent = '';
    showScreen('endScreen');
    $('#endHeading').focus();
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  function nextCase() {
    caseIndex += 1;
    if (caseIndex < cases.length) {
      renderCase();
    } else {
      finishRound();
    }
  }

  $('#nextButton').addEventListener('click', nextCase);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnPlay').addEventListener('click', function () {
    startGame();
  });
  $('#btnMenu').addEventListener('click', function () {
    showScreen('startScreen');
    paintStars();
  });

  paintStars();
})();
