/* My Schedule — everyday planning without reminders or personal data. */
(function () {
  'use strict';

  var TOOL_ID = 'my-agenda';
  var $ = App.utils.$;
  var bank = DATA[App.i18n.locale()] || DATA.es;
  var progress = App.storage.get(TOOL_ID);
  var level = null;
  var cases = [];
  var caseIndex = 0;
  var solved = false;
  var attempts = 0;

  if (typeof progress.estrellas !== 'number') progress.estrellas = 0;
  if (!progress.completado || typeof progress.completado !== 'object') progress.completado = {};

  function save() {
    App.storage.set(TOOL_ID, {
      estrellas: progress.estrellas,
      completado: progress.completado
    });
  }

  function paintStars() {
    $('#stars').textContent.textContent = '';
  }

  function showScreen(screenId) {
    ['startScreen', 'caseScreen', 'endScreen'].forEach(function (id) {
      $('#' + id).classList.toggle('oculto', id !== screenId);
    });
  }

  function paintLevels() {
    var container = $('#levels');
    container.innerHTML = '';
    bank.levels.forEach(function (item) {
      var button = document.createElement('button');
      var label = item.name + ' — ' + item.description;
      button.type = 'button';
      button.className = 'btn level-button';
      if (progress.completado[item.id]) label += ' · ' + App.i18n.t('completed');
      button.textContent = label;
      button.addEventListener('click', function () { startLevel(item); });
      container.appendChild(button);
    });
  }

  function startLevel(selectedLevel) {
    level = selectedLevel;
    cases = App.utils.shuffle(level.cases).slice(0, bank.roundSize);
    caseIndex = 0;
    showScreen('caseScreen');
    renderCase();
  }

  function showExplanation(labelKey, text) {
    $('#explanation').textContent.textContent = '';
    $('#explanationWrap').classList.remove('oculto');
  }

  function renderCase() {
    var currentCase = cases[caseIndex];
    solved = false;
    attempts = 0;
    $('#caseIcon').textContent.textContent = '';
    $('#caseText').textContent.textContent = '';
    $('#feedback').textContent.textContent = '';
    $('#feedback').className = 'feedback';
    $('#explanation').textContent.textContent = '';
    $('#explanationWrap').classList.add('oculto');
    $('#nextButton').classList.add('oculto');
    $('#options').innerHTML = '';
    $('#progressFill').style.width = ((caseIndex / cases.length) * 100) + '%';
    $('#progressText').textContent.textContent = '';

    App.utils.shuffle(currentCase.choices.slice()).forEach(function (choice) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-opcion';
      button.textContent = choice.text;
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
    $('#nextButton').classList.remove('oculto');
    $('#nextButton').focus();
  }

  function finishRound() {
    var firstCompletion = !progress.completado[level.id];
    if (firstCompletion) {
      progress.completado[level.id] = true;
      progress.estrellas += level.stars;
      save();
    }
    paintStars();
    $('#endText').textContent.textContent = '';
    showScreen('endScreen');
    $('#endHeading').focus();
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
$('#transferencia').textContent.textContent = '';
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
  $('#repeatButton').addEventListener('click', function () { startLevel(level); });
  $('#levelsButton').addEventListener('click', function () {
    paintLevels();
    showScreen('startScreen');
    $('#levelHeading').focus();
  });

  paintLevels();
  paintStars();
})();
