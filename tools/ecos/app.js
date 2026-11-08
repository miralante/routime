/* ============================================================
   Routime — Ecos (memoria auditiva y ritmo)
   Datos en data.js (DATA.colores, DATA.niveles). Módulos
   compartidos en assets/js/. Mecánica tipo "Simon": se reproduce
   una secuencia de colores con sonido y hay que repetirla tocando
   los paneles en el mismo orden. Un fallo no penaliza: se repite
   la secuencia desde el principio y se puede volver a intentar.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'ecos';
  var $ = App.utils.$;
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var stageTextEl = $('#promptText');
  var padsEl = $('#options');
  var feedbackEl = $('#feedback');
  var btnRepeatSequence = $('#listenBtn');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelEl = $('#level');

  /* Persistent progress */
  var progress = App.storage.getWithStars(TOOL_ID);
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Round state */
  var currentLevel = null;
  var idx = 0;
  var roundHits = 0;
  var sequence = [];
  var posicionEsperada = 0;
  var reproduciendo = false;

  /* Sonido: un tono por color, Web Audio. Falla en silencio. */
  var audioCtx = null;
  function tone(frecuencia, duracion) {
    try {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frecuencia;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracion);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duracion);
    } catch (e) { /* silencio */ }
  }

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; },
    levels: function () { return bank().niveles; }
  });
  var save = glue.save, renderStars = glue.paintStars, levelBasedOnProgress = glue.levelFromProgress;



    /* Determina el nivel según el progress: cada ronda completada, sube un nivel. */

  /* Muestra la dificultad current (etiqueta del nivel). */
  function renderLevel() {
    if (levelEl) {
      levelEl.textContent = currentLevel.name;
    }
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    idx = 0;
    roundHits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    paintPads();
    renderLevel();
    render();
  }

  function renderProgress() {
    progressFill.style.width = ((idx / bank().porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function paintPads() {
    padsEl.innerHTML = '';
    padsEl.className = 'options stack rejilla-pads';
    bank().colores.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pad pad-' + c.id;
      btn.textContent = App.i18n.t(c.nombreKey);
      btn.dataset.id = c.id;
      btn.addEventListener('click', function () { tapPad(c.id, btn); });
      padsEl.appendChild(btn);
    });
  }

  function newerSequence() {
    sequence = [];
    for (var i = 0; i < currentLevel.longitud; i++) {
      sequence.push(bank().colores[Math.floor(Math.random() * bank().colores.length)].id);
    }
  }

  function render() {
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnNext.classList.add('hidden');
    newerSequence();
    posicionEsperada = 0;
    renderProgress();
    renderStars();
    playSequence();
  }

    function playSequence() {
      if (reproduciendo) return;
      reproduciendo = true;
      stageTextEl.textContent = App.i18n.t('etapaMiraEscucha');
      App.utils.$$('.pad').forEach(function (p) { p.disabled = true; });

      var i = 0;
      function step() {
        if (i >= sequence.length) {
          reproduciendo = false;
          stageTextEl.textContent = App.i18n.t('etapaTuTurno');
          App.utils.$$('.pad').forEach(function (p) { p.disabled = false; });
          return;
        }
        var color = sequence[i];
        var pad = padsEl.querySelector('[data-id="' + color + '"]');
        var frecuencia = bank().colores.filter(function (c) { return c.id === color; })[0].frecuencia;
        pad.classList.add('activo');
        tone(frecuencia, 0.35);
        setTimeout(function () {
          pad.classList.remove('activo');
          i += 1;
          setTimeout(step, 200);
        }, 450);
      }
      step();
    }

  function tapPad(color, btn) {
    if (reproduciendo) return;
    var frecuencia = bank().colores.filter(function (c) { return c.id === color; })[0].frecuencia;
    tone(frecuencia, 0.2);
    btn.classList.add('activo');
    setTimeout(function () { btn.classList.remove('activo'); }, 200);

    if (color === sequence[posicionEsperada]) {
      posicionEsperada += 1;
      if (posicionEsperada >= sequence.length) {
        finishSequence();
      }
    } else {
      App.feedback.encourage(feedbackEl);
      posicionEsperada = 0;
      stageTextEl.textContent = App.i18n.t('etapaCasi');
      setTimeout(playSequence, 700);
    }
  }

  function finishSequence() {
    App.feedback.success(feedbackEl);
    progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    roundHits += 1;
    save();
    renderStars();
    stageTextEl.textContent = App.i18n.t('etapaCompleta');
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function next() {
    idx += 1;
    if (idx >= bank().porRonda) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    App.utils.showEnd(gameScreen, endScreen);
    $('#endSummary').textContent = '';
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  if (btnRepeatSequence) btnRepeatSequence.addEventListener('click', playSequence);
  if (btnNext) btnNext.addEventListener('click', next);
  if ($('#repeatBtn')) $('#repeatBtn').addEventListener('click', function () { startGame(); });
  if ($('#btnOtherLevel')) $('#btnOtherLevel').addEventListener('click', function () {
    App.utils.goMenu();
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
  if ($('#btnMenu')) $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });
})();
