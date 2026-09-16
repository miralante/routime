/* ============================================================
   Routime — My Body Tells Me (emotions: interoception)
   Data in data.js (DATA.niveles). Shared modules in assets/js/.
   Mechanics: read a body signal (hunger, thirst, sleep, pain,
   nerves…) and choose what to do, from 3 options. The correct
   option always takes care of the signal (eat, drink, rest, breathe,
   tell a trusted person), never ignore it. 8-item rounds. Errors
   are never punished.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'mi-cuerpo-avisa';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var questionTextEl = $('#questionText');
  var optionsEl = $('#options');
  var feedbackEl = $('#feedback');
  var explanationWrap = $('#explanationWrap');
  var explanationEl = $('#explanation');
  var btnListen = $('#btnListen');
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
  var items = [];
  var idx = 0;
  var roundHits = 0;
  var solved = false;
  var attempts = 0;

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

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
    progressFill.style.width = ((idx / perRound) * 100) + '%';
    progressText.textContent = (idx + 1) + ' / ' + perRound;
  }

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
    items = level.items.slice();
    idx = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    render();
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    items = currentLevel.items.slice();
    idx = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    render();
  }

  function render() {
    var item = items[idx];
    solved = false;
    attempts = 0;
    questionTextEl.textContent = item.textContent;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';

    var options = App.utils.shuffle(item.options.map(function (opt, i) {
      return { text: opt, isCorrect: i === item.correct };
    }));

    options.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.textContent;
      btn.addEventListener('click', function () { answer(btn, op.isCorrect, item); });
      optionsEl.appendChild(btn);
    });

    renderProgress();
    renderLevel();
    renderStars();
  }

  function showExplanation(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correct] + '.';
    explanationEl.textContent = text;
    explanationWrap.classList.remove('hidden');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is pointed back to the signal already on screen. Only
     on the second mistake is what was needed explained
     (showExplanation). */
  function showHint(item) {
    explanationEl.textContent = App.i18n.t('pista') + '"' + item.textContent + '"';
    explanationWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect, item) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(isCorrect, item);
      solved = true;
      btn.classList.add('correcta');
      App.utils.$('#options .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      save();
      renderStars();
      btnNext.classList.remove('hidden');
      btnNext.focus();
    } else {
      attempts += 1;
      if (attempts === 1) {
        showHint(item);
      } else {
        showExplanation(isCorrect, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$('#options .btn-opcion'), explanationWrap);
    }
  }

  function next() {
    idx += 1;
    if (idx >= bank().porRonda) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    progress.roundsCompleted += 1;
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal', {
      n: roundHits,
      total: progress.stars
    });
    App.i18n.applyTo('#transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnListen.addEventListener('click', function () {
    if (App.tts && App.tts.speak) App.tts.speak(items[idx].textContent);
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
