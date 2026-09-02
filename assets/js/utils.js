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

  /** Shortcut for querySelector. */
  function $(selector) {
    return document.querySelector(selector);
  }

  /** Shortcut for querySelectorAll (returns an Array). */
  function $$(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
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

  /* ---------------------------------------------------------------
    * Shared footer injector.
    *
    * Marks any <footer data-pie-app>...</footer> in the page with the
    * canonical content, using App.i18n.t() for the text. Replaces the
    * 70+ hand-maintained copies that used to live in every
    * tools/<slug>/index.html, site/index.html, about/, config/, team/,
    * legal/ — see scripts/check.js for the lint that enforces the
    * canonical marker shape.
    *
    * Marker attributes:
    *   data-pie-base      base path for relative links, e.g. '../../'
    *                      (tools) or '../' (site, about, config, team)
    *                      or './' (legal, when its link points to the
    *                      same folder).
    *   data-pie-include-config  if 'true', prepends a 'Configuración'
    *                      link to '../config/' or '../../config/'
    *                      (only used by the landing right now).
    *   data-pie-class     extra class to add to the <footer> element
    *                      itself, to keep visual parity with each
    *                      project's existing footer variant
    *                      ('pie-app', 'pie-about', 'pie-legal', etc.).
    *
    * Safe to call repeatedly; a footer that already has children (i.e.
    * already injected) is left alone. Translations are applied to the
    * newly inserted children so data-i18n attributes resolve.
    * --------------------------------------------------------------- */
  function inyectarPie() {
    if (!window.App || !window.App.i18n) return;
    var pies = document.querySelectorAll('footer[data-pie-app]');
    for (var i = 0; i < pies.length; i++) {
      var pie = pies[i];
      /* Idempotency: skip if this footer was already filled in. */
      if (pie.childNodes && pie.childNodes.length > 0) continue;
      var base = pie.getAttribute('data-pie-base') || '../../';
      var includeConfig = pie.getAttribute('data-pie-include-config') === 'true';
      var extraClass = pie.getAttribute('data-pie-class');
      if (extraClass) pie.className = (pie.className ? pie.className + ' ' : '') + extraClass;
      var html = '';
      if (includeConfig) {
        html += '<a href="' + base + 'config/" class="enlace-legal" data-i18n="core.config"></a>';
      }
      html += '<a href="' + base + 'legal/index.html" class="enlace-legal" data-i18n="core.dataProtection"></a>';
      pie.innerHTML = html;
      /* Re-apply i18n bindings to the freshly inserted nodes only. */
      if (typeof window.App.i18n.apply === 'function') {
        window.App.i18n.apply(pie);
      }
    }
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

  window.App.utils = {
    shuffle: shuffle,
    $: $,
    $$: $$,
    hoy: hoy,
    reducedMotion: reducedMotion,
    inyectarPie: inyectarPie
  };
})();
