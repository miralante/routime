/* ============================================================
   Routime — Coloring (creativity and fine motor skills)
   Data in data.js (DATA.drawings, DATA.colors). Shared modules
   in assets/js/. Mechanic: choose a color and touch a zone of
   the drawing to paint it. Free activity, no right or wrong:
   each finished drawing earns a star.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'colorear';
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var drawingTitleEl = $('#drawingTitle');
  var canvas = $('#canvas');
  var colorsEl = $('#colors');
  var feedbackEl = $('#feedback');
  var btnDone = $('#btnDone');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.drawingsPainted !== 'number') progress.drawingsPainted = 0;

  var currentDrawing = null;
  var currentColor = DATA.colors[0];

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function renderDrawingCards() {
    var container = $('#drawings');
    container.innerHTML = '';
    DATA.drawings.forEach(function (d) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tarjeta tarjeta-dibujo';
      btn.innerHTML =
        '<span class="picto" aria-hidden="true">' + d.picto + '</span>' +
        '<span class="name">' + App.i18n.t('dibujo.' + d.id) + '</span>';
      btn.addEventListener('click', function () { start(d); });
      container.appendChild(btn);
    });
  }

  function renderColors() {
    colorsEl.innerHTML = '';
    DATA.colors.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-btn' + (c.id === currentColor.id ? ' selected' : '');
      btn.style.background = c.value;
      btn.setAttribute('aria-label', App.i18n.t('color.' + c.id));
      btn.setAttribute('aria-pressed', c.id === currentColor.id ? 'true' : 'false');
      btn.addEventListener('click', function () {
        currentColor = c;
        renderColors();
      });
      colorsEl.appendChild(btn);
    });
  }

  function start(drawing) {
    currentDrawing = drawing;
    drawingTitleEl.textContent = App.i18n.t('dibujo.' + drawing.id);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    canvas.innerHTML = '';
    drawing.zones.forEach(function (zone) {
      var el = document.createElementNS(SVG_NS, zone.tag);
      Object.keys(zone.attrs).forEach(function (attr) {
        el.setAttribute(attr, zone.attrs[attr]);
      });
      el.setAttribute('class', 'zona');
      el.setAttribute('fill', '#FFFFFF');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', App.i18n.t('zonaAria').replace('{name}', App.i18n.t('zona.' + zone.id)));
      el.addEventListener('click', function () { paintZone(el); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); paintZone(el); }
      });
      canvas.appendChild(el);
    });

    renderColors();
    renderStars();
  }

  function paintZone(el) {
    el.setAttribute('fill', currentColor.value);
  }

  function finish() {
    progress.stars += 1;
    if (App.feedback && App.feedback.star) App.feedback.star();
    progress.drawingsPainted += 1;
    save();
    renderStars();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    var paintedPart = progress.drawingsPainted === 1
      ? App.i18n.t('dibujosPintadosUno')
      : App.i18n.t('dibujosPintadosVarios').replace('{n}', progress.drawingsPainted);
    $('#summary').textContent = paintedPart;
    App.i18n.applyTo('#transferencia');
    App.feedback.celebrate(App.i18n.t('finalTitulo'));
  }

  /* Events */
  btnDone.addEventListener('click', finish);
  $('#btnAnotherDrawing').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  });

  renderDrawingCards();
  renderStars();
})();
