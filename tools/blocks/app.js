/* ============================================================
   Routime — Blocks (visual-spatial construction)
   Data in data.js (DATA.niveles with 16-cell models).
   Mechanic: a 4x4 model with colored blocks is shown; next to it,
   an empty grid and a palette of 3 colors. Pick a color and tap
   cells to copy it. Kind, immediate validation: correct paint →
   success; first mistake on a cell → Socratic hint (rule 12);
   second mistake → it's explained and self-corrected (rule 11),
   nobody gets stuck. Round of 3 models; 1 star per completed build.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'los-bloques';
  var $ = App.utils.$;
  var KEYS = ['R', 'B', 'Y'];

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var modelEl = $('#modelGrid');
  var boardEl = $('#userGrid');
  var paletteEl = $('#palette');
  var feedbackEl = $('#feedback');
  var explanationWrap = $('#explanationWrap');
  var explanationEl = $('#explanation');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelsEl = $('#levels');
  var btnPlay = $('#btnPlay');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Round state */
  var currentLevel = null;
  var modelIdx = 0;
  var roundHits = 0;
  var model = [];          /* 'R'|'B'|'Y'|null x16 */
  var painted = [];         /* same shape, what the person has painted so far */
  var cellBtns = [];
  var selectedColor = 'R';
  var cellAttempts = {};   /* idx -> number of mistakes (rule 12) */
  var completed = false;

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function colorName(c) { return bank().colors[c]; }

  /* Renders the level selection buttons. */
  function renderLevels() {
    if (!levelsEl) return;
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

  /* Determines the level based on progress: each completed round raises one level. */
  function levelBasedOnProgress() {
    var idxN = Math.min(progress.roundsCompleted, bank().niveles.length - 1);
    return bank().niveles[idxN];
  }

  /* Shows the current difficulty (level label). */
  function renderLevel() {
    if (currentLevel) {
      $('#level').textContent = currentLevel.name;
    }
  }

  function renderProgress() {
    var perRound = bank().porRonda;
    progressFill.style.width = ((modelIdx / perRound) * 100) + '%';
    progressText.textContent = (modelIdx + 1) + ' / ' + perRound;
  }

  function selectLevel(level) {
    currentLevel = level;
    modelIdx = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    newModel();
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    modelIdx = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    newModel();
  }

  function newModel() {
    var str = App.utils.shuffle(currentLevel.modelos)[0];
    model = str.split('').map(function (ch) { return ch === '.' ? null : ch; });
    painted = new Array(16).fill(null);
    cellAttempts = {};
    completed = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
    btnNext.classList.add('hidden');

    renderModel();
    renderBoard();
    renderPalette();
    renderProgress();
    renderLevel();
    renderStars();
  }

  function renderModel() {
    modelEl.innerHTML = '';
    model.forEach(function (c) {
      var div = document.createElement('div');
      div.className = 'celda-modelo' + (c ? ' c-' + c : '');
      modelEl.appendChild(div);
    });
  }

  function ariaCell(i) {
    var f = Math.floor(i / 4) + 1;
    var c = (i % 4) + 1;
    var key = painted[i] ? 'ariaCellPainted' : 'ariaCellEmpty';
    return App.i18n.t(key)
      .replace('{color}', painted[i] ? colorName(painted[i]) : '')
      .replace('{f}', f).replace('{c}', c);
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    cellBtns = [];
    for (var i = 0; i < 16; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'celda-tuya' + (painted[i] ? ' c-' + painted[i] : '');
      btn.disabled = painted[i] !== null || completed;
      btn.setAttribute('aria-label', ariaCell(i));
      (function (idx, b) {
        b.addEventListener('click', function () { touchCell(idx); });
      })(i, btn);
      boardEl.appendChild(btn);
      cellBtns.push(btn);
    }
  }

  function renderPalette() {
    paletteEl.innerHTML = '';
    KEYS.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-color c-' + c;
      btn.setAttribute('aria-label', App.i18n.t('ariaColor').replace('{color}', colorName(c)));
      btn.setAttribute('aria-pressed', c === selectedColor ? 'true' : 'false');
      btn.addEventListener('click', function () {
        selectedColor = c;
        App.utils.$$('.btn-color', paletteEl).forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        if (App.tts && App.tts.speak) App.tts.speak(App.i18n.t('pickColor').replace('{color}', colorName(c)));
      });
      paletteEl.appendChild(btn);
    });
  }

  function clearNotice() {
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
  }

  function showNotice(text) {
    explanationEl.textContent = text;
    explanationWrap.classList.remove('hidden');
  }

  function paintCell(i, color) {
    painted[i] = color;
    var btn = cellBtns[i];
    btn.classList.add('c-' + color, 'recien');
    btn.disabled = true;
    btn.setAttribute('aria-label', ariaCell(i));
  }

  function touchCell(i) {
    if (completed || painted[i] !== null) return;
    clearNotice();
    if (model[i] === selectedColor) {
      paintCell(i, selectedColor);
      App.feedback.success(feedbackEl);
      checkCompleted();
    } else {
      cellAttempts[i] = (cellAttempts[i] || 0) + 1;
      App.feedback.encourage(feedbackEl);
      if (cellAttempts[i] === 1) {
        /* Rule 12: first mistake → hint, never the answer */
        showNotice(App.i18n.t(model[i] === null ? 'hintEmpty' : 'hintColor'));
      } else if (model[i] === null) {
        /* Empty cell in the model: it's explained, nothing to correct */
        showNotice(App.i18n.t('wrongEmpty'));
      } else {
        /* Second mistake with a color: it's explained and self-corrected */
        showNotice(App.i18n.t('wrongColor').replace('{color}', colorName(model[i])));
        paintCell(i, model[i]);
        checkCompleted();
      }
    }
  }

  function cellsRemaining() {
    for (var i = 0; i < 16; i++) {
      if (model[i] !== null && painted[i] === null) return true;
    }
    return false;
  }

  function checkCompleted() {
    if (cellsRemaining()) return;
    completed = true;
    modelIdx += 1;
    roundHits += 1;
    progress.stars += 1;
    if (App.feedback && App.feedback.star) App.feedback.star();
    save();
    renderStars();
    renderProgress();
    cellBtns.forEach(function (b) { b.disabled = true; });
    App.feedback.celebrate(App.i18n.t('buildComplete'));
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function next() {
    if (modelIdx >= bank().porRonda) {
      endRound();
    } else {
      newModel();
    }
  }

  function endRound() {
    progress.roundsCompleted += 1;
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#summary').textContent = App.i18n.t('summary', { n: roundHits, total: progress.stars });
    App.i18n.applyTo('#transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnNext.addEventListener('click', next);
  if (btnPlay) btnPlay.addEventListener('click', startGame);
  var btnRepeat = $('#btnRepeat');
  if (btnRepeat) btnRepeat.addEventListener('click', function () { startGame(); });
  var btnOtherLevel = $('#btnOtherLevel');
  if (btnOtherLevel) btnOtherLevel.addEventListener('click', function () {
    endScreen.classList.add('hidden');
    renderLevels();
    startScreen.classList.remove('hidden');
  });

  /* Init */
  renderStars();
  renderLevels();
})();
