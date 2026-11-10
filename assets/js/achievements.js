/* ==========================================================================
   Routime — achievements catalogue ("logros").

   The policy is the suite's (apptonomia/doc/es/spec.md §2.6): milestones
   computed from saved progress, no streaks, no timers, no losses. A new one is
   announced once, neutrally, when the activity that earns it is finished. The
   mechanism lives in ./achievements-engine.js (identical in every app); this file
   holds Routime's rules and texts. The About page shows none of them.

   Storage: 'routime:achievements' -> { <id>: <timestamp of first unlock> }.
   Rules read only each activity's saved stars ('routime:<toolId>').

   Public API (window.App.achievements):
     list                    the catalogue
     unlocked()              { id: timestamp }
     sync()                  check every rule against the saved progress; saves the
                             new ones silently and returns their ids
     onActivityFinished()    sync() and announce the new ids in #achievement-notice
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  App.i18n.register({
    achievementNew: 'Nuevo logro: {name}',
    achievementFirstStar: 'Primera estrella',
    achievementFirstStarDesc: 'Consigue tu primera estrella.',
    achievementTenStars: 'Diez estrellas',
    achievementTenStarsDesc: 'Consigue diez estrellas en total.',
    achievementTenActivities: 'Diez actividades',
    achievementTenActivitiesDesc: 'Consigue alguna estrella en diez actividades distintas.',
    achievementAllModules: 'Todos los módulos',
    achievementAllModulesDesc: 'Haz al menos una actividad de cada módulo del menú.',
    achievementRoutineStar: 'Mi rutina',
    achievementRoutineStarDesc: 'Consigue una estrella en la actividad de rutinas.',
    achievementLocked: 'Pendiente',
    achievementUnlockedAt: 'Conseguido el {date}'
  }, 'es');

  App.i18n.register({
    achievementNew: 'New achievement: {name}',
    achievementFirstStar: 'First star',
    achievementFirstStarDesc: 'Get your first star.',
    achievementTenStars: 'Ten stars',
    achievementTenStarsDesc: 'Get ten stars in total.',
    achievementTenActivities: 'Ten activities',
    achievementTenActivitiesDesc: 'Get a star in ten different activities.',
    achievementAllModules: 'All modules',
    achievementAllModulesDesc: 'Do at least one activity from every module on the menu.',
    achievementRoutineStar: 'My routine',
    achievementRoutineStarDesc: 'Get a star in the routines activity.',
    achievementLocked: 'Not yet',
    achievementUnlockedAt: 'Earned on {date}'
  }, 'en');

  /* Main menu modules (dev/index.html sections) -> activity storage ids
     (the TOOL_ID each tools/<slug>/app.js saves under). Keep in sync when an
     activity is added. "Body and relationships" is left out on purpose. */
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

  var CATALOG = [
    { id: 'firstStar', icon: '⭐', nameKey: 'achievementFirstStar', descKey: 'achievementFirstStarDesc',
      test: function (p) { return p.totalStars >= 1; } },
    { id: 'tenStars', icon: '🌟', nameKey: 'achievementTenStars', descKey: 'achievementTenStarsDesc',
      test: function (p) { return p.totalStars >= 10; } },
    { id: 'tenActivities', icon: '🧩', nameKey: 'achievementTenActivities', descKey: 'achievementTenActivitiesDesc',
      test: function (p) { return p.toolsWithStars.length >= 10; } },
    { id: 'allModules', icon: '🎓', nameKey: 'achievementAllModules', descKey: 'achievementAllModulesDesc',
      test: function (p) {
        return Object.keys(MODULES).every(function (mod) {
          return MODULES[mod].some(function (id) { return p.toolsWithStars.indexOf(id) !== -1; });
        });
      } },
    { id: 'routineStar', icon: '🌅', nameKey: 'achievementRoutineStar', descKey: 'achievementRoutineStarDesc',
      test: function (p) { return p.toolsWithStars.indexOf(ROUTINES_ID) !== -1; } }
  ];

  var board = window.ApptonomiaAchievements.create({
    storageKey: 'routime:achievements',
    catalog: CATALOG,
    t: function (key) { return App.i18n.t(key); }
  });

  /** Snapshot of the saved progress: total stars and activities with a star. */
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

  function sync() {
    return board.evaluate(snapshot());
  }

  /** Neutral notice. The element is created on first use. */
  function announce(ids) {
    if (!ids || !ids.length) return;
    var el = document.getElementById('achievement-notice');
    if (!el) {
      el = document.createElement('p');
      el.id = 'achievement-notice';
      el.className = 'achievement-notice';
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    board.notify(el, ids);
  }

  window.App.achievements = {
    list: CATALOG,
    unlocked: board.unlocked,
    sync: sync,
    onActivityFinished: function () { announce(sync()); }
  };

  /* Retroactive credit from progress saved before this page loaded: silent. */
  try { announce(sync()); } catch (err) { /* never block the page over a badge */ }
})();
