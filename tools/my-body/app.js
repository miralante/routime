/* ============================================================
   Routime — My Body Tells Me (emotions: interoception)
   Data in data.js (DATA.niveles). Shared modules in assets/js/.
   Mechanics: read a body signal (hunger, thirst, sleep, pain,
   nerves…) and choose what to do, from 3 options. The correct
   option always takes care of the signal (eat, drink, rest, breathe,
   tell a trusted person), never ignore it. 8-item rounds. Errors
   are never punished.
   Un único recorrido por todas las señales: nivel 1, 2 y 3, cada uno
   en su orden. Las rondas continúan donde terminó la anterior.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'mi-cuerpo-avisa';
  var $ = App.utils.$;

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var listScreen = $('#listScreen');
  var listEl = $('#listaTodas');
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

  /* Round state: items son entradas { level, item } */
  var roundStart = 0;
  var items = [];
  var idx = 0;
  var roundHits = 0;
  var solved = false;
  var attempts = 0;
  var lastScreen = gameScreen;

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  /* Un solo recorrido: todos los niveles en orden, cada uno con su
     lista tal como está escrita en data.js. */
  function catalog() {
    var out = [];
    bank().niveles.forEach(function (level) {
      level.items.forEach(function (item) { out.push({ level: level, item: item }); });
    });
    return out;
  }

  /* Cada ronda toma los items seguidos desde donde quedó la anterior. */
  function roundEntries(all, start) {
    var out = [];
    for (var i = 0; i < bank().porRonda; i++) {
      out.push(all[(start + i) % all.length]);
    }
    return out;
  }

  function renderProgress() {
    var perRound = items.length || bank().porRonda;
    progressFill.style.width = ((idx / perRound) * 100) + '%';
    progressText.textContent = (idx + 1) + ' / ' + perRound;
  }

  function renderLevel(level) {
    if (levelEl) levelEl.textContent = level.name;
  }

  function renderLevels() {
    if (!levelsEl) return;
    levelsEl.innerHTML = '';
    bank().niveles.forEach(function (level) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      btn.innerHTML = '<strong>' + level.name + '</strong><br><small>' + level.descripcion + '</small>';
      btn.addEventListener('click', function () { startGame(); });
      levelsEl.appendChild(btn);
    });
  }

  function startGame() {
    var all = catalog();
    roundStart = (progress.position || 0) % all.length;
    items = roundEntries(all, roundStart);
    idx = 0;
    roundHits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    render();
  }

  function render() {
    var entry = items[idx];
    if (!entry) return endRound();
    var item = entry.item;
    solved = false;
    attempts = 0;
    questionTextEl.textContent = item.textContent || item.text;
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
      btn.textContent = op.text;
      btn.addEventListener('click', function () { answer(btn, op.isCorrect, item); });
      optionsEl.appendChild(btn);
    });

    renderProgress();
    renderLevel(entry.level);
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
    explanationEl.textContent = App.i18n.t('pista') + '"' + (item.textContent || item.text) + '"';
    explanationWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect, item) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(isCorrect, item);
      solved = true;
      btn.classList.add('correcta');
      App.utils.$$('#options .btn-opcion').forEach(function (b) { b.disabled = true; });
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
      var respuestaTrasPista = attempts > 1;
      showHint(item);
      /* Reveal the explanation only after the hint is acknowledged. */
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('#options .btn-opcion'), explanationWrap, function () { if (respuestaTrasPista) showExplanation(isCorrect, item); });
    }
  }

  function next() {
    idx += 1;
    if (idx >= items.length) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    var total = catalog().length;
    progress.position = (roundStart + items.length) % total;
    progress.roundsCompleted += 1;
    var levelId = items[0].level.id;
    progress.completed[levelId] = (progress.completed[levelId] || 0) + 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#endSummary').textContent = App.i18n.t('roundSummary')
      .replace('{hits}', roundHits).replace('{total}', items.length);
    App.i18n.applyTo('#transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Lista de solo lectura con todas las señales, agrupadas por nivel.
     No cambia el progreso. */
  function renderList() {
    listEl.innerHTML = '';
    bank().niveles.forEach(function (level) {
      var heading = document.createElement('h2');
      heading.textContent = level.name + ' · ' + level.descripcion;
      listEl.appendChild(heading);
      var ul = document.createElement('ul');
      ul.className = 'lista-situaciones';
      level.items.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item.textContent || item.text;
        ul.appendChild(li);
      });
      listEl.appendChild(ul);
    });
  }

  function showList() {
    lastScreen = gameScreen.classList.contains('hidden') ? endScreen : gameScreen;
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    renderList();
    listScreen.classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  function hideList() {
    listScreen.classList.add('hidden');
    lastScreen.classList.remove('hidden');
  }

  /* Events */
  if (btnListen) btnListen.addEventListener('click', function () {
    if (App.tts && App.tts.speak) App.tts.speak(items[idx].item.textContent);
  });
  btnNext.addEventListener('click', next);
  $('#btnVerTodas').addEventListener('click', showList);
  $('#btnVerTodasFin').addEventListener('click', showList);
  $('#btnVolverJugar').addEventListener('click', hideList);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnOtherLevel').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    renderLevels();
  });

  /* Init */
  renderStars();
  renderLevels();
  // Iniciar directamente la actividad
  startGame();
})();
