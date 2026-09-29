/* Sexual Health — preventive simulations about body, consent, relationships
   and sexual/reproductive health. Real-life counterpart to social-safety
   (which covers digital/online risks).
   Progresión automática: empieza con el nivel fácil y sube según
   el progress guardado, sin mostrar selección de nivel. */
(function () {
  'use strict';

  var TOOL_ID = 'cuerpo-relaciones';
  var $ = App.utils.$;
  var bank = DATA[App.i18n.locale()] || DATA.es;
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;
  if (!progress.completed) progress.completed = {};

  var level = null;
  var cases = [];
  var index = 0;
  var solved = false;
  var attempts = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { $('#stars').textContent = ''; }

  function showScreen(id) {
    ['startScreen', 'caseScreen', 'endScreen'].forEach(function (screenId) {
      $('#' + screenId).classList.toggle('hidden', screenId !== id);
    });
  }

  /* ---------- Nivel según progress ---------- */
  function levelBasedOnProgress() {
    var idx = Math.min(progress.roundsCompleted, bank.niveles.length - 1);
    return bank.niveles[idx];
  }

  function renderLevel() {
    var el = $('#dificultad');
    if (el) {
      el.textContent = bank.porRonda + ' ' + (bank.porRonda === 1 ? App.i18n.t('caso') : App.i18n.t('casos'));
    }
  }

  /* ---------- Pantalla inicial ---------- */
  function startGame() {
    level = levelBasedOnProgress();
    cases = App.utils.shuffle(level.casos).slice(0, bank.porRonda);
    index = 0;
    showScreen('caseScreen');
    renderLevel();
    renderCase();
  }

  function renderCase() {
    var item = cases[index];
    solved = false;
    attempts = 0;
    $('#caseIcon').textContent = '';
    $('#caseText').textContent = '';
    $('#feedback').textContent = '';
    $('#feedback').className = 'feedback';
    $('#explanationWrap').classList.add('hidden');
    $('#nextButton').classList.add('hidden');
    $('#options').innerHTML = '';
    $('#progressFill').style.width = ((index / bank.porRonda) * 100) + '%';
    $('#progressText').textContent = '';

    App.utils.shuffle(item.options.map(function (text, optionIndex) {
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
    $('#explanation').textContent = '';
    $('#explanationWrap').classList.remove('hidden');
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
    $('#nextButton').classList.remove('hidden');
    $('#nextButton').focus();
  }

  function next() {
    index += 1;
    if (index < cases.length) {
      renderCase();
      return;
    }
    if (!progress.completed[level.id]) {
      progress.completed[level.id] = true;
      progress.stars += level.stars;
      save();
    }
    progress.roundsCompleted += 1;
    save();
    paintStars();
    $('#endText').textContent = '';
    $('#resumenFinal').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompleted + 1, bank.niveles.length));
    $('#transferencia').textContent = '';
    showScreen('endScreen');
    App.feedback.celebrate(App.i18n.t('roundComplete'));
  }

  $('#nextButton').addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnPlay').addEventListener('click', function () { startGame(); });
  var btnMenu = $('#btnMenu');
  if (btnMenu) btnMenu.addEventListener('click', function () {
    showScreen('startScreen');
    paintStars();
  });

  paintStars();
})();
