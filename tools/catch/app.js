/* ============================================================
   Routime — Catch (eye-hand coordination)
   The target appears at random positions. Tapping it triggers
   positive reinforcement and it moves again (at least 30% away).
   10 taps = round completed. No visible timer, no size choice —
   a single, small target keeps every round meaningful.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'atrapa';
  var $ = App.utils.$;

  var areaEl = $('#gameArea');
  var targetEl = $('#target');
  var feedbackEl = $('#feedback');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var endScreen = $('#endScreen');
  var summaryEl = $('#summary');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.rounds !== 'number') progress.rounds = 0;

  /* State */
  var taps = 0;
  var prevPos = { x: 0.5, y: 0.5 };

  function save() { App.storage.set(TOOL_ID, progress); }
  var tapsPerRound = DATA.tapsPerRound || DATA.toquesPorRonda;
  var targetSize = DATA.size || DATA.tamano;
  var targets = DATA.targets || DATA.objetivos || [];

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function renderProgress() {
    progressFill.style.width = ((taps / tapsPerRound) * 100) + '%';
    progressText.textContent = '';
  }

  function start() {
    taps = 0;
    endScreen.classList.add('hidden');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    targetEl.style.width = targetSize + 'px';
    targetEl.style.height = targetSize + 'px';
    targetEl.style.fontSize = Math.round(targetSize * 0.55) + 'px';
    renderProgress();
    moveTarget();
  }

  /* New random position, at least 30% away from the previous one */
  function moveTarget() {
    var x, y, dist, attempts = 0;
    do {
      x = 0.05 + Math.random() * 0.9;
      y = 0.05 + Math.random() * 0.9;
      dist = Math.hypot(x - prevPos.x, y - prevPos.y);
      attempts++;
    } while (dist < 0.3 && attempts < 20);
    prevPos = { x: x, y: y };

    var maxX = areaEl.clientWidth - targetSize;
    var maxY = areaEl.clientHeight - targetSize;
    targetEl.style.left = Math.round(x * maxX) + 'px';
    targetEl.style.top = Math.round(y * maxY) + 'px';
    targetEl.textContent =
      targets[Math.floor(Math.random() * targets.length)];
  }

  function hit() {
    taps += 1;
    progress.stars += 1;
    if (App.feedback && App.feedback.star) App.feedback.star();
    save();
    renderStars();
    renderProgress();
    App.feedback.success(feedbackEl);
    if (taps >= tapsPerRound) {
      endRound();
    } else {
      moveTarget();
    }
  }

  function endRound() {
    progress.rounds += 1;
    save();
    endScreen.classList.remove('hidden');
    summaryEl.textContent = '';
    App.i18n.applyTo('#transferencia');
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  targetEl.addEventListener('click', hit);
  $('#btnRepeat').addEventListener('click', start);

  /* Reposition the target if the window size changes */
  window.addEventListener('resize', function () {
    if (!endScreen.classList.contains('hidden')) return;
    moveTarget();
  });

  renderStars();
  start();
})();
