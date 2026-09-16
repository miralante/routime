/* ============================================================
   Routime — Calm (guided breathing and relaxation)
   Data in data.js (DATA.niveles). Shared modules in assets/js/.
   Mechanic: a circle grows and shrinks marking the breathing
   rhythm, with text and voice. No visible timer and no way to
   fail: every finished session earns a star.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'calma';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var sessionScreen = $('#sessionScreen');
  var endScreen = $('#endScreen');
  var circle = $('#breathingCircle');
  var textEl = $('#breathingText');
  var cyclesEl = $('#breathingCycles');
  var starsEl = $('#stars');
  var levelsEl = $('#levels');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  var currentLevel = null;
  var timer = null;

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  /* Renders the level selection buttons. */
  function renderLevels() {
    levelsEl.innerHTML = '';
    bank().niveles.forEach(function (level) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      btn.innerHTML = '<strong>' + level.name + '</strong><br><small>' + level.descripcion + '</small>';
      btn.addEventListener('click', function () { startSession(level); });
      levelsEl.appendChild(btn);
    });
  }

  function startSession(level) {
    currentLevel = level;
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    sessionScreen.classList.remove('hidden');
    var cycle = 0;
    renderStars();

    function step(inhale) {
      if (cycle >= level.ciclos) {
        endSession();
        return;
      }
      cyclesEl.textContent = '';
      if (inhale) {
        textEl.textContent = App.i18n.t('cogeAire');
        if (App.tts && App.tts.speak) App.tts.speak(App.i18n.t('cogeAire'));
        circle.className = 'crecer';
      } else {
        textEl.textContent = App.i18n.t('sueltaAire');
        if (App.tts && App.tts.speak) App.tts.speak(App.i18n.t('sueltaAire'));
        circle.className = 'encoger';
        cycle += 1;
      }
      timer = setTimeout(function () { step(!inhale); }, 4000);
    }

    /* Start small so the first "breathe in" truly animates from nothing */
    circle.className = 'encoger';
    step(true);
  }

  function stop() {
    if (timer) clearTimeout(timer);
  }

  function endSession() {
    stop();
    progress.stars += 1;
    if (App.feedback && App.feedback.star) App.feedback.star();
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    renderStars();
    sessionScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal', {
      n: progress.stars,
      palabra: progress.stars === 1 ? App.i18n.t('estrellaSingular') : App.i18n.t('estrellaPlural')
    });
    App.i18n.applyTo('#transferencia');
    App.feedback.celebrate(App.i18n.t('celebrarMsg'));
  }

  function stopEarly() {
    stop();
    sessionScreen.classList.add('hidden');
    renderLevels();
    startScreen.classList.remove('hidden');
  }

  /* Events */
  $('#btnEndSession').addEventListener('click', stopEarly);
  $('#btnRepeat').addEventListener('click', function () { startSession(currentLevel); });
  $('#btnOtherLevel').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    renderLevels();
    startScreen.classList.remove('hidden');
  });

  /* Init */
  renderStars();
  renderLevels();
})();
