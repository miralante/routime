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
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var etapaTextoEl = $('#promptText');
  var padsEl = $('#options');
  var feedbackEl = $('#feedback');
  var btnRepetirSecuencia = $('#listenBtn');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelEl = $('#level');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Round state */
  var currentLevel = null;
  var idx = 0;
  var roundHits = 0;
  var secuencia = [];
  var posicionEsperada = 0;
  var reproduciendo = false;

  /* Sonido: un tono por color, Web Audio. Falla en silencio. */
  var audioCtx = null;
  function tono(frecuencia, duracion) {
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

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }


    /* Determina el nivel según el progress: cada ronda completada, sube un nivel. */
  function levelBasedOnProgress() {
    var idxN = Math.min(progress.roundsCompleted, banco().niveles.length - 1);
    return banco().niveles[idxN];
  }

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
    pintarPads();
    renderLevel();
    render();
  }

  function renderProgress() {
    progressFill.style.width = ((idx / banco().porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function pintarPads() {
    padsEl.innerHTML = '';
    padsEl.className = 'options stack rejilla-pads';
    banco().colores.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pad pad-' + c.id;
      btn.textContent = App.i18n.t(c.nombreKey);
      btn.dataset.id = c.id;
      btn.addEventListener('click', function () { tocarPad(c.id, btn); });
      padsEl.appendChild(btn);
    });
  }

  function nuevaSecuencia() {
    secuencia = [];
    for (var i = 0; i < currentLevel.longitud; i++) {
      secuencia.push(banco().colores[Math.floor(Math.random() * banco().colores.length)].id);
    }
  }

  function render() {
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnNext.classList.add('hidden');
    nuevaSecuencia();
    posicionEsperada = 0;
    renderProgress();
    renderStars();
    reproducirSecuencia();
  }

    function reproducirSecuencia() {
      if (reproduciendo) return;
      reproduciendo = true;
      etapaTextoEl.textContent = App.i18n.t('etapaMiraEscucha');
      App.utils.$$('.pad').forEach(function (p) { p.disabled = true; });

      var i = 0;
      function paso() {
        if (i >= secuencia.length) {
          reproduciendo = false;
          etapaTextoEl.textContent = App.i18n.t('etapaTuTurno');
          App.utils.$$('.pad').forEach(function (p) { p.disabled = false; });
          return;
        }
        var color = secuencia[i];
        var pad = padsEl.querySelector('[data-id="' + color + '"]');
        var frecuencia = banco().colores.filter(function (c) { return c.id === color; })[0].frecuencia;
        pad.classList.add('activo');
        tono(frecuencia, 0.35);
        setTimeout(function () {
          pad.classList.remove('activo');
          i += 1;
          setTimeout(paso, 200);
        }, 450);
      }
      paso();
    }

  function tocarPad(color, btn) {
    if (reproduciendo) return;
    var frecuencia = banco().colores.filter(function (c) { return c.id === color; })[0].frecuencia;
    tono(frecuencia, 0.2);
    btn.classList.add('activo');
    setTimeout(function () { btn.classList.remove('activo'); }, 200);

    if (color === secuencia[posicionEsperada]) {
      posicionEsperada += 1;
      if (posicionEsperada >= secuencia.length) {
        terminarSecuencia();
      }
    } else {
      App.feedback.encourage(feedbackEl);
      posicionEsperada = 0;
      etapaTextoEl.textContent = App.i18n.t('etapaCasi');
      setTimeout(reproducirSecuencia, 700);
    }
  }

  function terminarSecuencia() {
    App.feedback.success(feedbackEl);
    progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    roundHits += 1;
    save();
    renderStars();
    etapaTextoEl.textContent = App.i18n.t('etapaCompleta');
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function next() {
    idx += 1;
    if (idx >= banco().porRonda) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#endSummary').textContent = '';
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  if (btnRepetirSecuencia) btnRepetirSecuencia.addEventListener('click', reproducirSecuencia);
  if (btnNext) btnNext.addEventListener('click', next);
  if ($('#repeatBtn')) $('#repeatBtn').addEventListener('click', function () { startGame(); });
  if ($('#btnOtherLevel')) $('#btnOtherLevel').addEventListener('click', function () {
    window.location.href = '../../site/index.html';
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();
