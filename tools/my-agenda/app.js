/* My Schedule — everyday planning without reminders or personal data.
   Progresión automática: empieza con el nivel fácil y sube según
   el progress guardado, sin mostrar selección de nivel. */
(function () {
  'use strict';
  var pair = App.utils.pairStart(document.getElementById('startScreen'), document.getElementById('caseScreen'), document.getElementById('btnPlay'));

  var TOOL_ID = 'my-agenda';
  var $ = App.utils.$;
  var bank = DATA[App.i18n.locale()] || DATA.es;
  var level = null;
  var cases = [];
  var caseIndex = 0;
  var solved = false;
  var attempts = 0;

  var progress = App.storage.getWithStars(TOOL_ID);
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
    $('#stars').textContent = '';
  }

  function showScreen(screenId) {
    App.utils.showOnly(['caseScreen', 'endScreen'], screenId);
  }

  /* ---------- Nivel según progress ---------- */
  var glue = App.activityGlue({
    progress: function () { return progress; },
    levels: function () { return bank.levels; }
  });
  var levelBasedOnProgress = glue.levelFromProgress;

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
    pair.enter();
    renderLevel();
    renderCase();
  }

  function showExplanation(labelKey, text) {
    $('#explanation').textContent = App.i18n.t(labelKey) + ' ' + text;
    $('#explanationWrap').classList.remove('hidden');
  }

  /* The steps of the plan are put in order: the tray holds them shuffled, the
     slots take them in the order they happen. Tapping the next step places it;
     tapping another step is a wrong try. */
  var steps = [];
  var nextStep = 0;

  function renderCase() {
    var currentCase = cases[caseIndex];
    solved = false;
    attempts = 0;
    nextStep = 0;
    steps = currentCase.steps.slice();

    $('#caseIcon').textContent = currentCase.icon;
    $('#caseText').textContent = currentCase.scenario;
    $('#feedback').textContent = App.i18n.t('orderIntro');
    $('#feedback').className = 'feedback';
    $('#explanation').textContent = '';
    $('#explanationWrap').classList.add('hidden');
    $('#nextButton').classList.add('hidden');
    $('#progressFill').style.width = ((caseIndex / cases.length) * 100) + '%';
    $('#progressText').textContent = '';

    var options = $('#options');
    options.innerHTML = '';

    var slots = document.createElement('div');
    slots.className = 'agenda-slots';
    steps.forEach(function (step, i) {
      var slot = document.createElement('div');
      slot.className = 'agenda-slot';
      slot.setAttribute('aria-label', App.i18n.t('slotLabel').replace('{n}', String(i + 1)));
      slot.textContent = String(i + 1) + '. ';
      slot.dataset.index = String(i);
      options.appendChild(slot);
      slots.appendChild(slot);
    });
    options.appendChild(slots);

    var tray = document.createElement('div');
    tray.className = 'agenda-tray';
    App.utils.shuffle(steps.map(function (step, i) { return { text: step, index: i }; })).forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-opcion agenda-step';
      button.textContent = item.text;
      button.dataset.index = String(item.index);
      button.addEventListener('click', function () { placeStep(button, item.index, currentCase); });
      tray.appendChild(button);
    });
    options.appendChild(tray);

    paintSlots();
  }

  function paintSlots() {
    var slots = App.utils.$$('#options .agenda-slot');
    slots.forEach(function (slot, i) {
      slot.textContent = String(i + 1) + '. ' + (i < nextStep ? steps[i] : '');
      slot.classList.toggle('is-filled', i < nextStep);
    });
  }

  function placeStep(button, index, currentCase) {
    if (solved || button.disabled) return;
    if (index !== nextStep) {
      /* The wrong step is not disabled: it stays in the tray, to be placed later. */
      attempts += 1;
      button.classList.add('animo');
      App.feedback.encourage($('#feedback'));
      if (attempts === 1) {
        showExplanation('hintLabel', currentCase.hint);
      } else {
        showExplanation('explanationLabel', App.i18n.t('nextStepLabel') + ' ' + steps[nextStep]);
      }
      App.feedback.lockUntilAck(App.utils.$$('#options .agenda-step'), $('#explanationWrap'));
      return;
    }
    button.classList.add('correcta');
    button.disabled = true;
    nextStep += 1;
    paintSlots();
    if (nextStep < steps.length) {
      $('#feedback').className = 'feedback';
      $('#feedback').textContent = App.i18n.t('orderNext');
      return;
    }
    solved = true;
    App.feedback.success($('#feedback'));
    $('#feedback').textContent = App.i18n.t('orderDone');
    showExplanation('explanationLabel', currentCase.explanation);
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
    $('#endText').textContent = '';
    $('#resumenFinal').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel', { n: Math.min(progress.roundsCompleted + 1, bank.levels.length) });
    $('#transferencia').textContent = '';
    pair.leave(false);
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

  paintStars();
  /* After DOMContentLoaded, so App.i18n has already translated the page (its own listener runs first). */
  $('#startScreen').classList.remove('hidden');
  $('#btnPlay').addEventListener('click', function () { startGame(); });
})();
