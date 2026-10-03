/* ==========================================================================
   Routime — Achievements catalog, unlock logic and badge grid
   Exposes window.App.achievements.list / .unlocked() / .achieve(id) /
   .evaluate() / .render(container).

   Achievements are derived from progress the app already saves
   (each activity's 'stars' under 'routime:<toolId>', plus the days with
   a new star that storage.js records under 'routime:activity-days'),
   so people who already played get their badges the first time the
   menu (site/) or the "About the app" page (about-app/) loads.
   Unlocked badges are stored as { id: timestamp } under
   'routime:achievements'. The settings page (config/) deletes both
   keys when the whole app is reset.

   Texts come from App.i18n (keys achievement<Name>, achievement<Name>Desc,
   achievementLocked, achievementUnlockedAt), registered by the page
   that renders the grid (about-app/strings.<locale>.js).
   Requires utils.js, i18n.js and storage.js.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  var KEY = 'achievements';
  var DAYS_KEY = 'activity-days';

  /* Main menu modules (site/index.html sections) -> activity storage ids
     (the TOOL_ID each tools/<slug>/app.js saves under, which is not
     always the folder name). Keep in sync when an activity is added. */
  var MODULES = {
    secuencia: ['rutinas', 'la-casa', 'situaciones', 'chat-seguro', 'chat-acoso',
      'lo-publico', 'social-safety', 'senales', 'partes-del-dia', 'clock',
      'que-primero', 'que-necesito', 'donde-lo-guardo', 'tasks-list', 'my-agenda',
      'que-me-pongo', 'la-calle', 'emergencias', 'while-help-arrives', 'be-prepared',
      'phone-numbers', 'cuenta-al-medico', 'my-details', 'la-compra', 'la-tienda',
      'comida-sana', 'mi-botiquin'],
    emocional: ['emociones', 'calma', 'entre-amigos', 'mi-cuerpo-avisa', 'good-manners',
      'education-norms', 'self-esteem', 'resilience', 'trust-circle'],
    cuerpo: ['cuerpo-relaciones'],
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
    { id: 'streak3', icon: '🔥', key: 'achievementStreak3',
      check: function (s) { return longestStreak(s.days) >= 3; } },
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

  /* Longest run of consecutive calendar days in a list of 'YYYY-MM-DD'. */
  function longestStreak(days) {
    var sorted = days.slice().sort();
    var best = 0;
    var run = 0;
    var prev = null;
    sorted.forEach(function (day) {
      var time = Date.parse(day + 'T12:00:00');
      if (isNaN(time)) return;
      run = (prev !== null && Math.round((time - prev) / 86400000) === 1) ? run + 1 : 1;
      if (run > best) best = run;
      prev = time;
    });
    return best;
  }

  /* Reads the saved progress once: total stars, activities with at
     least one star, and days with a new star. */
  function snapshot() {
    var toolsWithStars = [];
    App.storage.listaToolIds().forEach(function (id) {
      var data = App.storage.get(id);
      if (data && typeof data.stars === 'number' && data.stars > 0) toolsWithStars.push(id);
    });
    var days = [];
    try {
      var raw = localStorage.getItem('routime:' + DAYS_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) days = parsed;
    } catch (e) { /* no streak data yet */ }
    return {
      totalStars: App.storage.totalStars(),
      toolsWithStars: toolsWithStars,
      days: days
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

  /** Draws one badge per achievement inside `container`. */
  function render(container) {
    if (!container) return;
    var t = App.i18n.t;
    var done = unlocked();
    container.innerHTML = '';
    LIST.forEach(function (a) {
      var isUnlocked = !!done[a.id];
      var item = document.createElement('li');
      item.className = 'achievement-badge' + (isUnlocked ? ' unlocked' : ' locked');
      var icon = document.createElement('span');
      icon.className = 'achievement-badge-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = a.icon;
      var name = document.createElement('span');
      name.className = 'achievement-badge-name';
      name.textContent = t(a.key);
      var desc = document.createElement('span');
      desc.className = 'achievement-badge-desc';
      desc.textContent = t(a.key + 'Desc');
      var status = document.createElement('span');
      status.className = 'achievement-badge-status';
      status.textContent = isUnlocked
        ? t('achievementUnlockedAt').replace('{date}', new Date(done[a.id]).toLocaleDateString(App.i18n.lang()))
        : t('achievementLocked');
      item.appendChild(icon);
      item.appendChild(name);
      item.appendChild(desc);
      item.appendChild(status);
      container.appendChild(item);
    });
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
