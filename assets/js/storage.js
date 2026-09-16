/* ==========================================================================
   Routime — Progress in localStorage
   Exposes window.App.storage.get(toolId) / .set(toolId, data) / .remove(toolId)
   Internal key: 'routime:<toolId>'. No personal data.
   Auto-migrates legacy keys 'apptonomia:*' (pre-rename) to 'routime:*'
   on first read of each key, so existing users keep their progress.
   Always fault-tolerant (private mode can throw exceptions).
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var PREFIJO = 'routime:';
  var PREFIJO_LEGACY = 'apptonomia:';

  /* Keys under 'routime:*' that are NOT an activity's progress:
     'locale' (language) and 'prefs' (font size, sounds — see
     /config/). Excluded from totalStars() and listaToolIds(). */
  var CLAVES_NO_HERRAMIENTA = ['locale', 'prefs'];

  /* Lazy one-shot migration: copies 'apptonomia:<id>' to 'routime:<id>'
     the first time the new key is read. Subsequent reads use the new
     key directly. Removes the legacy key on success to keep storage
     tidy. Tracks per-id migration so we don't re-scan on every call.
     Tolerant of private mode / quota errors — failure leaves the
     legacy key in place and returns null, so the caller treats it as
     'no progress yet' without throwing. */
  var MIGRADOS = {};
  function migrar(id) {
    if (MIGRADOS[id]) return localStorage.getItem(PREFIJO + id);
    try {
      var legacyRaw = localStorage.getItem(PREFIJO_LEGACY + id);
      if (legacyRaw != null) {
        var newRaw = localStorage.getItem(PREFIJO + id);
        if (newRaw == null) {
          try { localStorage.setItem(PREFIJO + id, legacyRaw); }
          catch (e2) { /* keep legacy readable */ }
        }
        try { localStorage.removeItem(PREFIJO_LEGACY + id); }
        catch (e2) { /* tolerated */ }
      }
    } catch (e) { /* tolerated */ }
    MIGRADOS[id] = true;
    return localStorage.getItem(PREFIJO + id);
  }

  /* Applies right away the font-size preference saved in /config/
     (rule: only once in the shared core, never per tool — storage.js
     is loaded in site/ and in every activity before anything is
     painted). --escala-texto defaults to 1 (tokens.css), so anyone
     who hasn't touched the preference sees no change. */
  (function aplicarTamanoLetra() {
    try {
      var raw = migrar('prefs');
      var prefs = raw ? JSON.parse(raw) : {};
      var ESCALA = { normal: 1, grande: 1.15, muygrande: 1.3 };
      var escala = ESCALA[prefs.tamanoLetra] || 1;
      document.documentElement.style.setProperty('--escala-texto', escala);
    } catch (e) { /* silent: keeps the default size */ }
  })();

  /**
   * Reads a tool's saved progress.
   * @param {string} toolId - tool slug, e.g. 'parejas'
   * @returns {object} saved progress, or {} if there is none / on error
   */
  function get(toolId) {
    try {
      var raw = migrar(toolId);
      var data = raw ? JSON.parse(raw) : {};
      /* Migrate 'estrellas' → 'stars' (Apr 2025 rename). Read both keys so
         existing users keep their progress; prefer 'stars' if both are present. */
      if ('estrellas' in data && !('stars' in data)) {
        data.stars = data.estrellas;
        delete data.estrellas;
        try { localStorage.setItem(PREFIJO + toolId, JSON.stringify(data)); } catch (e2) { /* tolerated */ }
      }
      /* Migrate 'rondasCompletadas' → 'completedRounds' and 'completados' → 'completed'
         (Sep 2026 rename). Read old keys so existing users keep their progress;
         prefer English keys if both are present. */
      var migrated = false;
      if ('rondasCompletadas' in data && !('completedRounds' in data)) {
        data.completedRounds = data.rondasCompletadas;
        delete data.rondasCompletadas;
        migrated = true;
      }
      if ('completados' in data && !('completed' in data)) {
        data.completed = data.completados;
        delete data.completados;
        migrated = true;
      }
      if (migrated) {
        try { localStorage.setItem(PREFIJO + toolId, JSON.stringify(data)); } catch (e2) { /* tolerated */ }
      }
      return data;
    } catch (e) {
      return {};
    }
  }

  /**
   * Saves a tool's progress.
   * @param {string} toolId
   * @param {object} data - JSON-serializable object
   * @returns {boolean} true if it was saved
   */
  function set(toolId, data) {
    try {
      localStorage.setItem(PREFIJO + toolId, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Deletes a tool's progress. */
  function remove(toolId) {
    try {
      localStorage.removeItem(PREFIJO + toolId);
      try { localStorage.removeItem(PREFIJO_LEGACY + toolId); } catch (e2) { /* tolerated */ }
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Sum of stars across all tools (for the menu).
      Fixed bug: the try/catch used tr wrap the WHOLE loop, so a single
      non-JSON key in between (e.g. 'routime:locale', which stores a
      plain string like 'en', not JSON) cut the sum short for the rest
      of the tools that came later in localStorage's iteration order
      (not insertion order). Each key is now processed in its own
      try/catch. */
  function totalStars() {
    var total = 0;
    for (var i = 0; i < localStorage.length; i++) {
      try {
        var key = localStorage.key(i);
        if (!key || key.indexOf(PREFIJO) !== 0) continue;
        if (CLAVES_NO_HERRAMIENTA.indexOf(key.slice(PREFIJO.length)) !== -1) continue;
        var datos = JSON.parse(localStorage.getItem(key) || '{}');
        /* Accept both 'stars' (new, Apr 2025) and 'estrellas' (legacy) so the
           menu total is correct during the migration window. */
        if (datos && typeof datos.stars === 'number') {
          total += datos.stars;
        } else if (datos && typeof datos.estrellas === 'number') {
          total += datos.estrellas;
        }
      } catch (e) { /* individual key corrupt or non-JSON: keep going with the rest */ }
    }
    return total;
  }

  /**
   * Ids of every tool with something saved (without the prefix,
   * and without the CLAVES_NO_HERRAMIENTA keys). Used by ajustes/
   * to show status and for the full reset.
   * @returns {string[]}
   */
  function listaToolIds() {
    var out = [];
    try {
      /* Sweep both new and legacy prefixes so config/ shows legacy
         progress as 'saved' the first time it inspects storage. The
         migrar() helper called by get() will then copy the value into
         the new prefix on the next per-id read. */
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key) continue;
        var suf;
        if (key.indexOf(PREFIJO) === 0) suf = key.slice(PREFIJO.length);
        else if (key.indexOf(PREFIJO_LEGACY) === 0) suf = key.slice(PREFIJO_LEGACY.length);
        else continue;
        if (suf && CLAVES_NO_HERRAMIENTA.indexOf(suf) === -1 && out.indexOf(suf) === -1) out.push(suf);
      }
    } catch (e) { /* ignore */ }
    return out;
  }

  window.App.storage = {
    get: get,
    set: set,
    remove: remove,
    totalStars: totalStars,
    listaToolIds: listaToolIds
  };
})();
