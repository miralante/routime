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

  var areaEl = $('#areaJuego');
  var objetivoEl = $('#objetivo');
  var feedbackEl = $('#feedback');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var pantallaFinal = $('#pantallaFinal');
  var resumenFinal = $('#resumenFinal');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (typeof progreso.rondas !== 'number') progreso.rondas = 0;

  /* State */
  var toques = 0;
  var posAnterior = { x: 0.5, y: 0.5 };

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function pintarProgreso() {
    progressFill.style.width = ((toques / DATA.toquesPorRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function empezar() {
    toques = 0;
    pantallaFinal.classList.add('oculto');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    objetivoEl.style.width = DATA.tamano + 'px';
    objetivoEl.style.height = DATA.tamano + 'px';
    objetivoEl.style.fontSize = Math.round(DATA.tamano * 0.55) + 'px';
    pintarProgreso();
    moverObjetivo();
  }

  /* New random position, at least 30% away from the previous one */
  function moverObjetivo() {
    var x, y, dist, intentos = 0;
    do {
      x = 0.05 + Math.random() * 0.9;
      y = 0.05 + Math.random() * 0.9;
      dist = Math.hypot(x - posAnterior.x, y - posAnterior.y);
      intentos++;
    } while (dist < 0.3 && intentos < 20);
    posAnterior = { x: x, y: y };

    var maxX = areaEl.clientWidth - DATA.tamano;
    var maxY = areaEl.clientHeight - DATA.tamano;
    objetivoEl.style.left = Math.round(x * maxX) + 'px';
    objetivoEl.style.top = Math.round(y * maxY) + 'px';
    objetivoEl.textContent =
      DATA.objetivos[Math.floor(Math.random() * DATA.objetivos.length)];
  }

  function acierto() {
    toques += 1;
    progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    guardar();
    pintarEstrellas();
    pintarProgreso();
    App.feedback.success(feedbackEl);
    if (toques >= DATA.toquesPorRonda) {
      terminarRonda();
    } else {
      moverObjetivo();
    }
  }

  function terminarRonda() {
    progreso.rondas += 1;
    guardar();
    pantallaFinal.classList.remove('oculto');
    resumenFinal.textContent = '';
    $('#transfer').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  objetivoEl.addEventListener('click', acierto);
  $('#btnRepetir').addEventListener('click', empezar);

  /* Reposition the target if the window size changes */
  window.addEventListener('resize', function () {
    if (!pantallaFinal.classList.contains('oculto')) return;
    moverObjetivo();
  });

  pintarEstrellas();
  empezar();
})();
