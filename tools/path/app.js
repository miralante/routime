/* ============================================================
   Routime — The Path (spatial orientation and routes)
   Data in data.js (DATA.niveles with obstacle count). Paths are
   generated on the fly: start and goal with minimum distance,
   random trees, and a BFS guarantees a solvable board. The turtle
   moves with 4 arrow buttons (and physical keyboard arrows).
   Hitting a tree or border only gives a calm notice (rule 5).
   Reaching the star earns 1 star. 3-path rounds.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'el-camino';
  var $ = App.utils.$;
  var MOVES = {
    up: { dr: -1, dc: 0 },
    down: { dr: 1, dc: 0 },
    left: { dr: 0, dc: -1 },
    right: { dr: 0, dc: 1 }
  };
  var KEYS = {
    ArrowUp: 'up', ArrowDown: 'down',
    ArrowLeft: 'left', ArrowRight: 'right'
  };

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var boardEl = $('#board');
  var statusEl = $('#status');
  var feedbackEl = $('#feedback');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelEl = $('#level');
  var levelsEl = $('#levels');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Round state */
  var currentLevel = null;
  var pathIdx = 0;
  var roundHits = 0;
  var trees = [];       /* row*columns+col indexes */
  var goal = -1;
  var turtle = -1;
  var inGame = false;

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }
  function rows() { return bank().filas; }
  function cols() { return bank().columnas; }
  function save() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  /* Determines the level based on progress: each completed round raises one level. */
  function levelBasedOnProgress() {
    var idxN = Math.min(progress.roundsCompleted, bank().niveles.length - 1);
    return bank().niveles[idxN];
  }

  /* Shows the current difficulty (level label). */
  function renderLevel() {
    if (levelEl && currentLevel) {
      levelEl.textContent = currentLevel.name;
    }
  }

  function renderProgress() {
    var perRound = bank().porRonda;
    progressFill.style.width = ((pathIdx / perRound) * 100) + '%';
    progressText.textContent = (pathIdx + 1) + ' / ' + perRound;
  }

  /* Renders the level selection buttons. */
  function renderLevels() {
    levelsEl.innerHTML = '';
    bank().niveles.forEach(function (level) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      btn.innerHTML = '<strong>' + level.name + '</strong><br><small>' + level.descripcion + '</small>';
      btn.addEventListener('click', function () { selectLevel(level); });
      levelsEl.appendChild(btn);
    });
  }

  function selectLevel(level) {
    currentLevel = level;
    pathIdx = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    newPath();
  }

  /* ---- Generation with a guaranteed solution (BFS) ---- */
  function hasPath(from, to, blocked) {
    var total = rows() * cols();
    var visited = {};
    var queue = [from];
    visited[from] = true;
    while (queue.length) {
      var current = queue.shift();
      if (current === to) return true;
      var r = Math.floor(current / cols());
      var c = current % cols();
      [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(function (v) {
        if (v[0] < 0 || v[0] >= rows() || v[1] < 0 || v[1] >= cols()) return;
        var i = v[0] * cols() + v[1];
        if (visited[i] || blocked.indexOf(i) !== -1) return;
        visited[i] = true;
        queue.push(i);
      });
    }
    return false;
  }

  function distance(a, b) {
    var ra = Math.floor(a / cols()), ca = a % cols();
    var rb = Math.floor(b / cols()), cb = b % cols();
    return Math.abs(ra - rb) + Math.abs(ca - cb);
  }

  function newPath() {
    var total = rows() * cols();
    var all = [];
    for (var i = 0; i < total; i++) all.push(i);
    /* Retry until we get a solvable board */
    for (var attempt = 0; attempt < 50; attempt++) {
      var shuffled = App.utils.shuffle(all);
      var t = shuffled[0];
      var m = shuffled[1];
      if (distance(t, m) < 3) continue;
      var treeBlocks = shuffled.slice(2, 2 + currentLevel.obstaculos);
      if (hasPath(t, m, treeBlocks)) {
        turtle = t;
        goal = m;
        trees = treeBlocks;
        break;
      }
    }
    inGame = true;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnNext.classList.add('hidden');
    statusEl.textContent = App.i18n.t('enMarcha');
    renderBoard();
    renderProgress();
    renderLevel();
    renderStars();
  }

  function renderBoard() {
    boardEl.style.gridTemplateColumns = 'repeat(' + cols() + ', 1fr)';
    boardEl.innerHTML = '';
    var total = rows() * cols();
    for (var i = 0; i < total; i++) {
      var div = document.createElement('div');
      div.className = 'casilla';
      if (i === turtle) { div.textContent = '🐢'; div.classList.add('tortuga'); }
      else if (i === goal) { div.textContent = '⭐'; }
      else if (trees.indexOf(i) !== -1) { div.textContent = '🌳'; }
      boardEl.appendChild(div);
    }
  }

  function move(direction) {
    if (!inGame) return;
    var mv = MOVES[direction];
    var r = Math.floor(turtle / cols()) + mv.dr;
    var c = (turtle % cols()) + mv.dc;
    if (r < 0 || r >= rows() || c < 0 || c >= cols()) {
      statusEl.textContent = App.i18n.t('choqueBorde');
      App.feedback.encourage(feedbackEl);
      return;
    }
    var dest = r * cols() + c;
    if (trees.indexOf(dest) !== -1) {
      statusEl.textContent = App.i18n.t('choqueArbol');
      App.feedback.encourage(feedbackEl);
      return;
    }
    turtle = dest;
    statusEl.textContent = App.i18n.t('enMarcha');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    renderBoard();
    if (turtle === goal) reachGoal();
  }

  function reachGoal() {
    inGame = false;
    pathIdx += 1;
    roundHits += 1;
    progress.stars += 1;
    if (App.feedback && App.feedback.star) App.feedback.star();
    save();
    renderStars();
    renderProgress();
    statusEl.textContent = App.i18n.t('llegada');
    App.feedback.success(feedbackEl);
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function next() {
    if (pathIdx >= bank().porRonda) {
      endRound();
    } else {
      newPath();
    }
  }

  function endRound() {
    progress.roundsCompleted += 1;
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#summary').textContent = App.i18n.t('summary', {
      n: roundHits,
      total: progress.stars
    });
    App.i18n.applyTo('#transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    pathIdx = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    newPath();
  }

  /* Events */
  ['up', 'down', 'left', 'right'].forEach(function (dir) {
    $('#btn' + dir.charAt(0).toUpperCase() + dir.slice(1))
      .addEventListener('click', function () { move(dir); });
  });
  document.addEventListener('keydown', function (ev) {
    if (!inGame || gameScreen.classList.contains('hidden')) return;
    var dir = KEYS[ev.key];
    if (dir) { ev.preventDefault(); move(dir); }
  });
  btnNext.addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnOtherLevel').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    renderLevels();
    startScreen.classList.remove('hidden');
  });

  /* Init */
  renderStars();
  renderLevels();
})();
