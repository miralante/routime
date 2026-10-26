/* ============================================================
   Routime — When It's Hard (frustration tolerance and
   vulnerability: asking for help, showing real feelings)
   Data in data.js (DATA.niveles). Shared modules in assets/js/.
   Mechanic: read a situation about frustration or vulnerability
   and choose the response that reflects a healthy reaction, among
   3 options. Round of 6. No punishment for a wrong answer.
   Un único recorrido por todas las situaciones: nivel 1, 2, 3 y 4,
   cada uno en su orden. Las rondas continúan donde terminó la anterior.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'resilience';
  var $ = App.utils.$;

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var listScreen = $('#listScreen');
  var listEl = $('#listaTodas');
  var levelEl = $('#level');
  var situacionPictoEl = $('#situacionPicto');
  var situacionTextoEl = $('#situacionTexto');
  var optionsEl = $('#options');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnEscucharExplicacion = $('#btnEscucharExplicacion');
  var btnListen = $('#btnListen');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

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

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  /* Un solo recorrido: todos los niveles en orden, cada uno con su
     lista tal como está escrita en data.js. */
  function catalog() {
    var out = [];
    banco().niveles.forEach(function (level) {
      level.items.forEach(function (item) { out.push({ level: level, item: item }); });
    });
    return out;
  }

  /* Cada ronda toma los items seguidos desde donde quedó la anterior. */
  function roundEntries(all, start) {
    var out = [];
    for (var i = 0; i < banco().porRonda; i++) {
      out.push(all[(start + i) % all.length]);
    }
    return out;
  }

  function renderLevel(level) {
    if (levelEl) levelEl.textContent = level.name + ' · ' + level.descripcion;
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

  function renderProgress() {
    progressFill.style.width = ((idx / items.length) * 100) + '%';
    progressText.textContent = (idx + 1) + ' / ' + items.length;
  }

  function render() {
    var entry = items[idx];
    if (!entry) return endRound();
    var item = entry.item;
    renderLevel(entry.level);
    solved = false;
    attempts = 0;
    situacionPictoEl.textContent = item.picto;
    situacionTextoEl.textContent = item.situacion;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';

    var options = App.utils.shuffle(item.options.map(function (opt, i) {
      return { text: opt, isCorrect: i === item.correcta };
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
    renderStars();
  }

  function showExplanation(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.';
    explicacionEl.textContent = text;
    explicacionWrap.classList.remove('hidden');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is pointed back to the situation already on screen.
     Only on the second mistake is the correct answer explained
     (showExplanation). */
  function showHint(item) {
    explicacionEl.textContent = App.i18n.t('pista') + '"' + item.situacion + '"';
    explicacionWrap.classList.remove('hidden');
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
      App.feedback.lockUntilAck(App.utils.$$('#options .btn-opcion'), explicacionWrap, function () { if (respuestaTrasPista) showExplanation(isCorrect, item); });
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
    if ($('#transferencia')) $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Lista de solo lectura con todas las situaciones, agrupadas por
     nivel. No cambia el progreso. */
  function renderList() {
    listEl.innerHTML = '';
    banco().niveles.forEach(function (level) {
      var heading = document.createElement('h2');
      heading.textContent = level.name + ' · ' + level.descripcion;
      listEl.appendChild(heading);
      var ul = document.createElement('ul');
      ul.className = 'lista-situaciones';
      level.items.forEach(function (item) {
        var li = document.createElement('li');
        var picto = document.createElement('span');
        picto.className = 'lista-picto';
        picto.setAttribute('aria-hidden', 'true');
        picto.textContent = item.picto;
        li.appendChild(picto);
        li.appendChild(document.createTextNode(item.situacion));
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
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].item.situacion);
  });
  btnNext.addEventListener('click', next);
  if (btnEscucharExplicacion) btnEscucharExplicacion.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(explicacionEl.textContent);
  });
  $('#btnVerTodas').addEventListener('click', showList);
  $('#btnVerTodasFin').addEventListener('click', showList);
  $('#btnVolverJugar').addEventListener('click', hideList);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnOtherLevel').addEventListener('click', function () {
    window.location.href = '../../';
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();
