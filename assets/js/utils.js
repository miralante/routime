/* ==========================================================================
   Routime — Shared utilities
   Exposes window.App.utils
   Load with: <script src="../../assets/js/utils.js"></script>
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  /**
   * Shuffles a copy of the array (Fisher-Yates).
   * Never use sort(() => Math.random() - 0.5).
   */
  function shuffle(array) {
    var copy = array.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  /* During the identifier migration, a few activity pages still contain the
     previous Spanish DOM id while their app.js already uses the English id.
     Resolve those aliases at the shared boundary so both versions remain
     usable while the individual pages are repaired. */
  var DOM_ALIASES = {
    startScreen: ['pantallaInicio'], pantallaInicio: ['startScreen'],
    menuScreen: ['pantallaMenu'], pantallaMenu: ['menuScreen'],
    createScreen: ['pantallaCrear'], pantallaCrear: ['createScreen'],
    gameScreen: ['pantallaJuego'], pantallaJuego: ['gameScreen'],
    endScreen: ['pantallaFinal'], pantallaFinal: ['endScreen'],
    selectionScreen: ['pantallaSeleccion'], pantallaSeleccion: ['selectionScreen'],
    responseScreen: ['pantallaRespuesta'], pantallaRespuesta: ['responseScreen'],
    breathingScreen: ['pantallaRespiracion'], pantallaRespiracion: ['breathingScreen'],
    sessionScreen: ['gameScreen', 'pantallaJuego'],
    weekScreen: ['pantallaSemana'], modelGrid: ['gridModelo'], gridModelo: ['modelGrid'],
    userGrid: ['gridTuyo'], gridTuyo: ['userGrid'], palette: ['paleta'], paleta: ['palette'],
    levels: ['niveles'], niveles: ['levels'], level: ['dificultad'], dificultad: ['level'],
    btnNext: ['btnSiguiente'], btnSiguiente: ['btnNext'],
    btnRepeat: ['repeatBtn', 'btnRepetir'], btnOtherLevel: ['btnOtroNivel', 'btnMenu'],
    btnPlay: ['btnJugar'], btnJugar: ['btnPlay'], btnStart: ['btnEmpezar'],
    btnEmpezar: ['btnStart'], btnFinish: ['btnTerminar'], btnCheck: ['btnComprobar'],
    btnReady: ['btnListo'], btnBack: ['btnVolver'], btnListen: ['listenBtn'],
    listenBtn: ['btnListen'], questionText: ['textoPregunta'], textoPregunta: ['questionText'],
    explanationWrap: ['explicacionWrap'], explicacionWrap: ['explanationWrap'],
    explanation: ['explicacion'], explicacion: ['explanation'],
    finalSummary: ['resumenFinal', 'endSummary'], resumenFinal: ['finalSummary', 'endSummary'],
    transfer: ['transferencia'], transferencia: ['transfer'], options: ['opciones'],
    opciones: ['options'], option: ['opcion'], summary: ['resumenFinal'],
    topicTitle: ['tituloTema'], levelsScreen: ['pantallaNiveles'],
    board: ['pathGrid'], pathGrid: ['board'], status: ['promptText'], promptText: ['status'],
    lienzo: ['canvas'], canvas: ['lienzo'], btnComprobar: ['btnCheck'],
    btnBorrar: ['btnErase'], btnErase: ['btnBorrar'],
    pantallaNiveles: ['levelsScreen'],
  };

  function selectorCandidates(selector) {
    var candidates = [selector];
    if (typeof selector !== 'string') return candidates;
    Object.keys(DOM_ALIASES).forEach(function (id) {
      if (selector.indexOf('#' + id) === -1) return;
      DOM_ALIASES[id].forEach(function (alias) {
        var replacement = selector.replace('#' + id, '#' + alias);
        if (candidates.indexOf(replacement) === -1) candidates.push(replacement);
      });
    });
    return candidates;
  }

  /** Shortcut for querySelector with migration aliases. */
  function $(selector) {
    var candidates = selectorCandidates(selector);
    for (var i = 0; i < candidates.length; i++) {
      var found = document.querySelector(candidates[i]);
      if (found) return found;
    }
    return null;
  }

  /** Shortcut for querySelectorAll (returns an Array). */
  function $$(selector, root) {
    root = root || document;
    var candidates = selectorCandidates(selector);
    for (var i = 0; i < candidates.length; i++) {
      var found = root.querySelectorAll(candidates[i]);
      if (found.length) return Array.prototype.slice.call(found);
    }
    return [];
  }

  /** Today's date as 'YYYY-MM-DD' (for daily routines). */
  function hoy() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  /** true if the user prefers less animation. */
  function reducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* Keep the screen awake during the activity (Screen Wake Lock).
     Progressive enhancement: if the browser doesn't support it, nothing
     happens. Requires a user gesture, so it's requested on the first
     tap/click; it's requested again on regaining visibility (the lock
     is released automatically when the tab is hidden). */
  if ('wakeLock' in navigator) {
    var wakeLockSentinel = null;
    var pedirWakeLock = function () {
      navigator.wakeLock.request('screen').then(function (sentinel) {
        wakeLockSentinel = sentinel;
      }).catch(function () { /* denied or unavailable: keep going without the lock */ });
    };
    document.addEventListener('pointerdown', function primeraVez() {
      pedirWakeLock();
      document.removeEventListener('pointerdown', primeraVez);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && wakeLockSentinel) {
        pedirWakeLock();
      }
    });
  }

  /* Shared end-of-round switch: hides the game screen and shows the end screen.
     Each activity still fills its own summary and celebrates with its own key. */
  function showEnd(gameEl, endEl) {
    gameEl.classList.add('hidden');
    endEl.classList.remove('hidden');
  }

  /* Shows the screen whose id is activeId and hides the other ids in the list. */
  function showOnly(ids, activeId) {
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', id !== activeId);
    });
  }

  /* Back to the activities menu. Every activity lives two levels below the root. */
  function goMenu() {
    window.location.href = '../../';
  }

  window.App.utils = {
    shuffle: shuffle,
    $: $,
    $$: $$,
    hoy: hoy,
    reducedMotion: reducedMotion,
    showEnd: showEnd,
    showOnly: showOnly,
    goMenu: goMenu
  };
})();
