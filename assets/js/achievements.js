/* ==========================================================================
   Routime — Achievements catalog, unlock logic and badge grid
   Exposes window.App.achievements.list / .unlocked() / .achieve(id) /
   .evaluate() / .render(container).

   Achievements are derived from progress the app already saves
   (each activity's 'stars' under 'routime:<toolId>'),
   so people who already played get their badges the first time the
   menu (site/) or the "About the app" page (about/) loads.
   Unlocked badges are stored as { id: timestamp } under
   'routime:achievements'. The settings page (config/) deletes both
   keys when the whole app is reset.

   Texts come from App.i18n (keys achievement<Name>, achievement<Name>Desc,
   achievementLocked, achievementUnlockedAt), registered by the page
   that renders the grid (about/strings.<locale>.js).
   Requires utils.js, i18n.js and storage.js.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var KEY = 'achievements';

  /* Main menu modules (dev/index.html sections) -> activity storage ids
     (the TOOL_ID each tools/<slug>/app.js saves under, which is not
     always the folder name). Keep in sync when an activity is added.
     The "Body and relationships" module (cuerpo-relaciones) is left out on
     purpose: "Every group" must not require that activity. */
  var MODULES = {
    secuencia: ['rutinas', 'la-casa', 'situaciones', 'chat-seguro', 'chat-acoso',
      'lo-publico', 'social-safety', 'senales', 'partes-del-dia', 'clock',
      'que-primero', 'que-necesito', 'donde-lo-guardo', 'tasks-list', 'my-agenda',
      'que-me-pongo', 'la-calle', 'emergencias', 'while-help-arrives', 'be-prepared',
      'phone-numbers', 'cuenta-al-medico', 'my-details', 'la-compra', 'la-tienda',
      'comida-sana', 'mi-botiquin'],
    emocional: ['emociones', 'calma', 'entre-amigos', 'mi-cuerpo-avisa', 'good-manners',
      'education-norms', 'self-esteem', 'resilience', 'trust-circle'],
    lenguaje: ['comedy-club', 'dichos', 'double-meaning', 'categorias', 'la-frase',
      'dictionary', 'vocabulary', 'spelling', 'colored-spelling', 'word-search'],
    memoria: ['parejas', 'diferencias', 'que-falta', 'ecos', 'giros-espejos',
      'los-bloques', 'donde-esta', 'el-camino', 'encajar', 'el-teatro'],
    coordinacion: ['atrapa', 'connect-dots', 'piano-teclas', 'trazos', 'colorear',
      'constructores']
  };

  var ROUTINES_ID = 'rutinas';

  /* Each check receives the snapshot built by snapshot(). */
  var LIST = [
    { id: 'firstStar', icon: '⭐', key: 'achievementFirstStar',
      check: function (s) { return s.totalStars >= 1; } },
    { id: 'tenStars', icon: '🌟', key: 'achievementTenStars',
      check: function (s) { return s.totalStars >= 10; } },
    { id: 'tenActivities', icon: '🧩', key: 'achievementTenActivities',
      check: function (s) { return s.toolsWithStars.length >= 10; } },
    { id: 'allModules', icon: '🎓', key: 'achievementAllModules',
      check: function (s) {
        return Object.keys(MODULES).every(function (mod) {
          return MODULES[mod].some(function (id) { return s.toolsWithStars.indexOf(id) !== -1; });
        });
      } },
    { id: 'routineStar', icon: '🌅', key: 'achievementRoutineStar',
      check: function (s) { return s.toolsWithStars.indexOf(ROUTINES_ID) !== -1; } }
  ];

  /** Unlocked achievements as { id: timestamp }. */
  function unlocked() {
    var data = App.storage.get(KEY);
    return (data && typeof data === 'object' && !Array.isArray(data)) ? data : {};
  }

  /** Unlocks one achievement. Idempotent: keeps the first unlock date. */
  function achieve(id) {
    var done = unlocked();
    if (done[id]) return false;
    done[id] = Date.now();
    App.storage.set(KEY, done);
    return true;
  }

  /* Reads the saved progress once: total stars and activities with at
     least one star. */
  function snapshot() {
    var toolsWithStars = [];
    App.storage.listaToolIds().forEach(function (id) {
      var data = App.storage.get(id);
      if (data && typeof data.stars === 'number' && data.stars > 0) toolsWithStars.push(id);
    });
    return {
      totalStars: App.storage.totalStars(),
      toolsWithStars: toolsWithStars
    };
  }

  /** Unlocks every achievement whose condition is met. Returns the new ids. */
  function evaluate() {
    var s = snapshot();
    var fresh = [];
    LIST.forEach(function (a) {
      if (a.check(s) && achieve(a.id)) fresh.push(a.id);
    });
    return fresh;
  }

  /* The badge grid is the suite's shared one (achievements-engine.js):
     this app only passes its catalogue and texts. Styles live once in
     assets/css/components.css (.achievements-grid / .achievement-badge*). */
  function render(container) {
    if (!container || !window.MiralanteAchievements) return;
    var board = window.MiralanteAchievements.create({
      storageKey: 'routime:' + KEY,
      catalog: LIST.map(function (a) {
        return {
          id: a.id,
          icon: a.icon,
          nameKey: a.key,
          descKey: a.key + 'Desc',
          test: function (progress) { return a.check(progress); }
        };
      }),
      t: App.i18n.t,
      locale: App.i18n.lang()
    });
    board.render(container);
  }

  window.App.achievements = {
    list: LIST,
    modules: MODULES,
    unlocked: unlocked,
    achieve: achieve,
    evaluate: evaluate,
    render: render
  };
})();
