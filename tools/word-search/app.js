/* ============================================================
   Routime — Word Search (language: word recognition)
   Data in data.js (DATA.levels + DATA[loc].topics). Shared modules in assets/js/.
   Mechanic: choose a topic and a level; a board is generated with
   hidden words. A word is marked by tapping its first and last letter.
   Socratic hints: each tap paints one more letter of the word that
   is still pending. No timer; a mistake never punishes.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'word-search';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var levelsScreen = $('#levelsScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var topicsEl = $('#topics');
  var levelsEl = $('#levels');
  var topicTitleEl = $('#topicTitle');
  var boardEl = $('#board');
  var wordListEl = $('#wordList');
  var feedbackEl = $('#feedback');
  var hintBtn = $('#hintBtn');
  var starsEl = $('#stars');
  var finalSummaryEl = $('#finalSummary');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.estrellas !== 'number') progress.estrellas = 0;
  if (!progress.completed) progress.completed = {};

  /* Game state */
  var topic = null;
  var level = null;
  var words = [];        // [{ text, norm, found, cells: [idx] }]
  var letters = [];      // board letters, indexed by row*size+col
  var firstSel = -1;     // index of the first letter tapped
  var hintWord = -1;     // target word of the current hint
  var hintLetters = 0;   // letters already painted for that word

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { starsEl.textContent = '⭐ ' + progress.estrellas; }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }
  function t(key) { return App.i18n.t(key); }

  /* Uppercase without accents (Ñ is kept) for the board. */
  var PLAIN = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ü': 'U' };
  function normalize(text) {
    return text.toUpperCase().split('').map(function (ch) {
      return PLAIN[ch] || ch;
    }).join('');
  }

  function show(screen) {
    [startScreen, levelsScreen, gameScreen, endScreen].forEach(function (s) {
      s.classList.toggle('oculto', s !== screen);
    });
  }

  /* ---------- Topic screen ---------- */

  function paintTopics() {
    topicsEl.innerHTML = '';
    bank().topics.forEach(function (tp) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-topic';
      btn.innerHTML = '<span aria-hidden="true">' + tp.picto + '</span> ' + tp.name;
      btn.addEventListener('click', function () {
        topic = tp;
        if (false && App.tts && App.tts.speak) App.tts.speak(tp.name);
        paintLevels();
        show(levelsScreen);
      });
      topicsEl.appendChild(btn);
    });
  }

  /* ---------- Level screen ---------- */

  function paintLevels() {
    topicTitleEl.textContent = topic.picto + ' ' + topic.name;
    levelsEl.innerHTML = '';
    DATA.levels.forEach(function (lv) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-level';
      var done = progress.completed[topic.id + ':' + lv.id] ? ' ' + t('done') : '';
      btn.innerHTML = t(lv.id) + done +
        '<span class="level-info">' + t(lv.id + 'Info') + '</span>';
      btn.addEventListener('click', function () { start(lv); });
      levelsEl.appendChild(btn);
    });
  }

  /* ---------- Board generation ---------- */

  function pickWords() {
    var fitting = topic.words.filter(function (w) {
      return normalize(w).length <= level.size;
    });
    return App.utils.shuffle(fitting).slice(0, level.numWords);
  }

  function place(grid, norm, size, directions) {
    for (var attempt = 0; attempt < 200; attempt++) {
      var dir = directions[Math.floor(Math.random() * directions.length)];
      var row, col, step;
      if (dir === 'H') {
        row = Math.floor(Math.random() * size);
        col = Math.floor(Math.random() * (size - norm.length + 1));
        step = 1;
      } else {
        row = Math.floor(Math.random() * (size - norm.length + 1));
        col = Math.floor(Math.random() * size);
        step = size;
      }
      var origin = row * size + col;
      var cells = [];
      var fits = true;
      for (var i = 0; i < norm.length; i++) {
        var idx = origin + i * step;
        if (grid[idx] && grid[idx] !== norm[i]) { fits = false; break; }
        cells.push(idx);
      }
      if (!fits) continue;
      cells.forEach(function (idx, j) { grid[idx] = norm[j]; });
      return cells;
    }
    return null;
  }

  function generateBoard() {
    for (var attempt = 0; attempt < 30; attempt++) {
      var size = level.size;
      var grid = new Array(size * size).fill('');
      var chosen = pickWords();
      /* Longest words first: they are harder to fit. */
      chosen.sort(function (a, b) { return b.length - a.length; });
      var list = [];
      var ok = true;
      for (var i = 0; i < chosen.length; i++) {
        var norm = normalize(chosen[i]);
        var cells = place(grid, norm, size, level.directions);
        if (!cells) { ok = false; break; }
        list.push({ text: chosen[i], norm: norm, found: false, cells: cells });
      }
      if (!ok) continue;
      /* Fill with letters from the words themselves: coherent look. */
      var pool = list.map(function (w) { return w.norm; }).join('');
      for (var j = 0; j < grid.length; j++) {
        if (!grid[j]) grid[j] = pool[Math.floor(Math.random() * pool.length)];
      }
      words = App.utils.shuffle(list);
      letters = grid;
      return true;
    }
    return false;
  }

  /* ---------- Game screen ---------- */

  function start(lv) {
    level = lv;
    if (!generateBoard()) return; /* should not happen with the current data */
    firstSel = -1;
    hintWord = -1;
    hintLetters = 0;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    paintWords();
    paintBoard();
    show(gameScreen);
  }

  function paintWords() {
    wordListEl.innerHTML = '';
    words.forEach(function (w) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip' + (w.found ? ' found' : '');
      chip.textContent = w.text;
      chip.setAttribute('aria-label', t('listenWord').replace('{word}', w.text));
      chip.addEventListener('click', function () { if (false && App.tts && App.tts.speak) App.tts.speak(w.text); });
      wordListEl.appendChild(chip);
    });
  }

  function paintBoard() {
    var size = level.size;
    boardEl.innerHTML = '';
    boardEl.style.setProperty('--n', size);
    for (var r = 0; r < size; r++) {
      var rowEl = document.createElement('div');
      rowEl.setAttribute('role', 'row');
      rowEl.className = 'board-row';
      for (var c = 0; c < size; c++) {
        var idx = r * size + c;
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cell';
        cell.setAttribute('role', 'gridcell');
        cell.dataset.idx = idx;
        cell.textContent = letters[idx];
        cell.setAttribute('aria-label', t('letterAria')
          .replace('{letter}', letters[idx])
          .replace('{row}', r + 1)
          .replace('{column}', c + 1));
        cell.tabIndex = idx === 0 ? 0 : -1;
        cell.addEventListener('click', onCellTap);
        rowEl.appendChild(cell);
      }
      boardEl.appendChild(rowEl);
    }
  }

  function cellEl(idx) {
    return boardEl.querySelector('[data-idx="' + idx + '"]');
  }

  function onCellTap(e) {
    var idx = Number(e.currentTarget.dataset.idx);
    if (firstSel === -1) {
      firstSel = idx;
      e.currentTarget.classList.add('sel');
      return;
    }
    if (firstSel === idx) { /* tapping the same letter releases it */
      e.currentTarget.classList.remove('sel');
      firstSel = -1;
      return;
    }
    check(firstSel, idx);
  }

  function clearSelection() {
    var sel = boardEl.querySelector('.sel');
    if (sel) sel.classList.remove('sel');
    firstSel = -1;
  }

  /* Cells between two indexes if aligned (H or V); null otherwise. */
  function line(a, b) {
    var size = level.size;
    var ra = Math.floor(a / size), ca = a % size;
    var rb = Math.floor(b / size), cb = b % size;
    var cells = [];
    var i;
    if (ra === rb) {
      var c0 = Math.min(ca, cb), c1 = Math.max(ca, cb);
      for (i = c0; i <= c1; i++) cells.push(ra * size + i);
    } else if (ca === cb) {
      var r0 = Math.min(ra, rb), r1 = Math.max(ra, rb);
      for (i = r0; i <= r1; i++) cells.push(i * size + ca);
    } else {
      return null;
    }
    if (a > b) cells.reverse();
    return cells;
  }

  function check(a, b) {
    var cells = line(a, b);
    if (!cells) {
      feedbackEl.textContent = t('notAligned');
      feedbackEl.className = 'feedback encourage';
      clearSelection();
      return;
    }
    var text = cells.map(function (i) { return letters[i]; }).join('');
    var reversed = text.split('').reverse().join('');
    var match = null;
    words.forEach(function (w) {
      if (!match && !w.found && (w.norm === text || w.norm === reversed)) match = w;
    });
    clearSelection();
    if (!match) {
      App.feedback.encourage(feedbackEl);
      return;
    }
    match.found = true;
    cells.forEach(function (i) { cellEl(i).classList.add('found'); });
    if (hintWord !== -1 && words[hintWord] === match) {
      hintWord = -1;
      hintLetters = 0;
    }
    paintWords();
    App.feedback.success(feedbackEl);
    var pending = words.some(function (w) { return !w.found; });
    if (!pending) finish();
  }

  /* ---------- Hints: paint letters of the pending word ---------- */

  function giveHint() {
    var target = -1;
    if (hintWord !== -1 && !words[hintWord].found) {
      target = hintWord;
    } else {
      words.forEach(function (w, i) {
        if (target === -1 && !w.found) target = i;
      });
      hintWord = target;
      hintLetters = 0;
    }
    if (target === -1) return;
    var w = words[target];
    var isFirst = hintLetters === 0;
    if (hintLetters < w.cells.length) {
      cellEl(w.cells[hintLetters]).classList.add('hint');
      hintLetters += 1;
    }
    var msg = t(isFirst ? 'hintMessage' : 'hintAnotherLetter').replace('{word}', w.text);
    feedbackEl.textContent = msg;
    feedbackEl.className = 'feedback';
  }

  /* ---------- Keyboard navigation on the board ---------- */

  function onBoardKeydown(e) {
    var cell = e.target.closest('.cell');
    if (!cell) return;
    var size = level.size;
    var idx = Number(cell.dataset.idx);
    var next = -1;
    if (e.key === 'ArrowRight') next = idx % size < size - 1 ? idx + 1 : -1;
    else if (e.key === 'ArrowLeft') next = idx % size > 0 ? idx - 1 : -1;
    else if (e.key === 'ArrowDown') next = idx + size < size * size ? idx + size : -1;
    else if (e.key === 'ArrowUp') next = idx - size >= 0 ? idx - size : -1;
    if (next === -1) return;
    e.preventDefault();
    cell.tabIndex = -1;
    var el = cellEl(next);
    el.tabIndex = 0;
    el.focus();
  }

  /* ---------- End of the game ---------- */

  function finish() {
    var key = topic.id + ':' + level.id;
    var earned = 0;
    if (!progress.completed[key]) {
      progress.completed[key] = true;
      earned = level.stars;
      progress.estrellas += earned;
      save();
      paintStars();
    }
    var summary = earned
      ? t('finalSummary').replace('{n}', earned).replace('{total}', progress.estrellas)
      : t('repeatedSummary');
    finalSummaryEl.textContent = summary;
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.pick('feedback.success'), function () {
      show(endScreen);
    });
  }

  /* ---------- Startup ---------- */

  function init() {
    App.i18n.apply();
    paintStars();
    paintTopics();


    hintBtn.addEventListener('click', giveHint);
    boardEl.addEventListener('keydown', onBoardKeydown);
    $('#backTopicsBtn').addEventListener('click', function () { show(startScreen); });
    $('#replayBtn').addEventListener('click', function () { start(level); });
    $('#otherLevelBtn').addEventListener('click', function () {
      paintLevels();
      show(levelsScreen);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
