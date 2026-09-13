/* Social Safety — preventive simulations about intimacy, manipulation and law. */
(function () {
  'use strict';

  var TOOL_ID = 'social-safety';
  var $ = App.utils.$;
  var bank = DATA[App.i18n.locale()] || DATA.es;
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.estrellas !== 'number') progress.estrellas = 0;
  if (!progress.completado) progress.completado = {};

  var level = null;
  var cases = [];
  var index = 0;
  var solved = false;
  var attempts = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { $('#stars').textContent.textContent = ''; }

  function showScreen(id) {
    ['startScreen', 'caseScreen', 'endScreen'].forEach(function (screenId) {
      $('#' + screenId).classList.toggle('oculto', screenId !== id);
    });
  }

  function paintLevels() {
    var container = $('#levels');
    container.innerHTML = '';
    bank.niveles.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-nivel';
      button.textContent = item.nombre + ' — ' + item.descripcion;
      button.addEventListener('click', function () { startLevel(item); });
      container.appendChild(button);
    });
  }

  function startLevel(selected) {
    level = selected;
    cases = App.utils.shuffle(level.casos).slice(0, bank.porRonda);
    index = 0;
    showScreen('caseScreen');
    renderCase();
  }

  function renderCase() {
    var item = cases[index];
    solved = false;
    attempts = 0;
    $('#caseIcon').textContent.textContent = '';
    $('#caseText').textContent.textContent = '';
    $('#feedback').textContent.textContent = '';
    $('#feedback').className = 'feedback';
    $('#explanationWrap').classList.add('oculto');
    $('#nextButton').classList.add('oculto');
    $('#options').innerHTML = '';
    $('#progressFill').style.width = ((index / bank.porRonda) * 100) + '%';
    $('#progressText').textContent.textContent = '';

    App.utils.shuffle(item.opciones.map(function (text, optionIndex) {
      return { text: text, correct: optionIndex === item.correcta };
    })).forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-opcion';
      button.textContent = option.text;
      button.addEventListener('click', function () { answer(button, option.correct, item); });
      $('#options').appendChild(button);
    });
  }

  function showExplanation(text) {
    $('#explanation').textContent.textContent = '';
    $('#explanationWrap').classList.remove('oculto');
  }

  function answer(button, correct, item) {
    if (solved) return;
    if (!correct) {
      attempts += 1;
      button.classList.add('animo');
      button.disabled = true;
      App.feedback.encourage($('#feedback'));
      showExplanation(attempts === 1 ? item.pista : item.explicacion);
      App.feedback.lockUntilAck(App.utils.$$('#options .btn-opcion'), $('#explanationWrap'));
      return;
    }

    solved = true;
    button.classList.add('correcta');
    App.utils.$$('#options .btn-opcion').forEach(function (option) { option.disabled = true; });
    App.feedback.success($('#feedback'));
    showExplanation(item.explicacion);
    $('#nextButton').classList.remove('oculto');
    $('#nextButton').focus();
  }

  function next() {
    index += 1;
    if (index < cases.length) {
      renderCase();
      return;
    }
    if (!progress.completado[level.id]) {
      progress.completado[level.id] = true;
      progress.estrellas += level.estrellas;
      save();
    }
    paintStars();
    $('#endText').textContent.textContent = '';
    showScreen('endScreen');
    App.feedback.celebrate(App.i18n.t('roundComplete'));
  }

  $('#nextButton').addEventListener('click', next);
  $('#repeatButton').addEventListener('click', function () { startLevel(level); });
  $('#levelsButton').addEventListener('click', function () { paintLevels(); showScreen('startScreen'); });

  paintLevels();
  paintStars();
})();
