/* ============================================================
   Routime — Connect the Dots (eye-hand coordination)
   Data in data.js (SHAPES, dots as {x, y} percentages of the
   play area). Each round picks a random dot count between 5 and
   10, then a random shape with that count — no level selection.
   Numbered dots are always visible; tapping them in order draws
   a line to the previous one and, after the last dot, closes the
   outline back to the first. A mistake is never punished: a hint
   comes on the first wrong tap, the correct dot is highlighted on
   the second — the person still has to tap it themselves to keep
   going.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'connect-dots';
  var MIN_DOTS = 5;
  var MAX_DOTS = 10;
  var $ = App.utils.$;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var playScreen = $('#playScreen');
  var finishScreen = $('#finishScreen');
  var starsEl = $('#stars');

  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var playArea = $('#playArea');
  var linesSvg = $('#linesSvg');
  var feedbackEl = $('#feedback');
  var finishText = $('#finishText');
  var finishEmoji = $('#finishEmoji');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.estrellas !== 'number') progress.estrellas = 0;
  if (typeof progress.rondas !== 'number') progress.rondas = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { starsEl.textContent = '⭐ ' + progress.estrellas; }
  function t(key) { return App.i18n.t(key); }

  function fill(key, values) {
    var text = t(key);
    Object.keys(values || {}).forEach(function (name) {
      text = text.split('{' + name + '}').join(values[name]);
    });
    return text;
  }

  function show(screen) {
    [playScreen, finishScreen].forEach(function (s) {
      s.classList.toggle('oculto', s !== screen);
    });
  }

  /* ---------- Round state ---------- */
  var currentShape = null;
  var dots = [];
  var nextNumber = 1;
  var mistakes = 0;
  var hintShown = false;

  function pickShape() {
    var count = MIN_DOTS + Math.floor(Math.random() * (MAX_DOTS - MIN_DOTS + 1));
    var candidates = SHAPES.filter(function (s) { return s.dots.length === count; });
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function startRound() {
    currentShape = pickShape();
    nextNumber = 1;
    mistakes = 0;
    hintShown = false;
    show(playScreen);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    render();
  }

  function paintProgress() {
    var total = currentShape.dots.length;
    progressFill.style.width = (((nextNumber - 1) / total) * 100) + '%';
    progressText.textContent = (nextNumber - 1) + ' / ' + total;
  }

  function svgPoint(dot) { return dot.x + ',' + dot.y; }

  function drawSegment(fromDot, toDot) {
    var line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', fromDot.x);
    line.setAttribute('y1', fromDot.y);
    line.setAttribute('x2', toDot.x);
    line.setAttribute('y2', toDot.y);
    line.setAttribute('class', 'dot-line');
    linesSvg.appendChild(line);
  }

  function fillShape() {
    var poly = document.createElementNS(SVG_NS, 'polygon');
    poly.setAttribute('points', currentShape.dots.map(svgPoint).join(' '));
    poly.setAttribute('class', 'dot-fill');
    linesSvg.insertBefore(poly, linesSvg.firstChild);
  }

  function render() {
    playArea.querySelectorAll('.dot').forEach(function (el) { el.remove(); });
    linesSvg.innerHTML = '';
    dots = currentShape.dots.map(function (point, i) {
      return { x: point.x, y: point.y, number: i + 1, done: false, el: null };
    });

    dots.forEach(function (dot) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dot';
      btn.style.left = dot.x + '%';
      btn.style.top = dot.y + '%';
      btn.textContent = dot.number;
      btn.setAttribute('aria-label', fill('dotAria', { n: dot.number }));
      btn.addEventListener('click', function () { onTap(dot); });
      playArea.appendChild(btn);
      dot.el = btn;
    });

    paintProgress();
    paintStars();
  }

  function clearHint() {
    dots.forEach(function (d) { d.el.classList.remove('dot-hint'); });
  }

  function onTap(dot) {
    if (dot.done) return;
    if (dot.number === nextNumber) onCorrectTap(dot);
    else onWrongTap();
  }

  function onCorrectTap(dot) {
    clearHint();
    mistakes = 0;
    hintShown = false;
    dot.done = true;
    dot.el.disabled = true;
    dot.el.classList.add('dot-done');
    if (nextNumber > 1) drawSegment(dots[nextNumber - 2], dot);
    App.feedback.success(feedbackEl);
    progress.estrellas += 1;
    save();
    paintStars();
    nextNumber += 1;
    paintProgress();
    if (nextNumber > currentShape.dots.length) {
      drawSegment(dots[dots.length - 1], dots[0]);
      fillShape();
      finish();
    }
  }

  function onWrongTap() {
    mistakes += 1;
    App.feedback.encourage(feedbackEl);
    if (mistakes === 1) {
      feedbackEl.textContent += ' ' + fill('hint', { n: nextNumber });
    } else if (!hintShown) {
      hintShown = true;
      feedbackEl.textContent += ' ' + fill('explanation', { n: nextNumber });
      var correctDot = dots.filter(function (d) { return d.number === nextNumber; })[0];
      if (correctDot) correctDot.el.classList.add('dot-hint');
    }
  }

  function finish() {
    progress.rondas += 1;
    save();
    show(finishScreen);
    finishEmoji.textContent = currentShape.emoji;
    finishText.textContent = fill('finishText', { shape: t('shape_' + currentShape.id) });
    $('#transfer').textContent = t('transfer');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Events ---------- */

  $('#playAgainBtn').addEventListener('click', startRound);

  function init() {
    App.i18n.apply();
    paintStars();
    startRound();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
