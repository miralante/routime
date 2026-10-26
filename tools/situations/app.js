/* Routime — Situaciones: elegir una respuesta segura. */
(function () {
  'use strict';

  var TOOL_ID = 'situaciones';
  var $ = App.utils.$;
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var levelEl = $('#level');
  var situationIcon = $('#situacionPicto');
  var situationText = $('#situacionTexto');
  var optionsEl = $('#options');
  var feedbackEl = $('#feedback');
  var explanationWrap = $('#explanationWrap');
  var explanationEl = $('#explanation');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var listScreen = $('#listScreen');
  var listEl = $('#listaTodas');
  var lastScreen = gameScreen;

  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;
  var roundStart = 0;
  var items = [];
  var index = 0;
  var hits = 0;
  var solved = false;
  var attempts = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  // Un único recorrido por todas las situaciones: nivel 1, nivel 2 y
  // nivel 3, cada uno en su orden por subactividad. Cada entrada guarda
  // su nivel para mostrarlo al pasar de un nivel a otro dentro de la ronda.
  function catalog() {
    var out = [];
    bank().niveles.forEach(function (level) {
      level.items.forEach(function (item) { out.push({ level: level, item: item }); });
    });
    return out;
  }

  // Cada ronda continúa donde terminó la anterior y da la vuelta al final.
  function roundEntries(all, start) {
    var out = [];
    for (var i = 0; i < bank().porRonda; i++) {
      out.push(all[(start + i) % all.length]);
    }
    return out;
  }

  function startGame() {
    var all = catalog();
    roundStart = (progress.position || 0) % all.length;
    items = roundEntries(all, roundStart);
    index = 0;
    hits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    render();
  }

  function renderProgress() {
    var total = items.length || bank().porRonda;
    progressFill.style.width = ((index / total) * 100) + '%';
    progressText.textContent = (index + 1) + ' / ' + total;
  }

  function render() {
    var entry = items[index];
    if (!entry) return endRound();
    var item = entry.item;
    solved = false;
    attempts = 0;
    levelEl.textContent = entry.level.name + ' · ' + entry.level.descripcion + ' · ' + entry.level.grupos[item.grupo];
    situationIcon.textContent = item.picto;
    situationText.textContent = item.situacion;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';

    App.utils.shuffle(item.options.map(function (text, i) {
      return { text: text, correct: i === item.correcta };
    })).forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-opcion';
      button.textContent = option.text;
      button.addEventListener('click', function () { answer(button, option.correct, item); });
      optionsEl.appendChild(button);
    });
    renderProgress();
    renderStars();
  }

  function showExplanation(correct, item) {
    explanationEl.textContent = correct
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.';
    explanationWrap.classList.remove('hidden');
  }

  function answer(button, correct, item) {
    if (solved) return;
    if (!correct) {
      attempts += 1;
      var respuestaTrasPista = attempts > 1;
      button.classList.add('animo');
      button.disabled = true;
      App.feedback.encourage(feedbackEl);
      explanationEl.textContent = App.i18n.t('pista') + ' "' + item.situacion + '"';
      explanationWrap.classList.remove('hidden');
      App.feedback.lockUntilAck(optionsEl.querySelectorAll('.btn-opcion'), explanationWrap, function () {
        if (respuestaTrasPista) {
          explanationEl.textContent = App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.';
          explanationWrap.classList.remove('hidden');
        }
      });
      return;
    }

    solved = true;
    button.classList.add('correcta');
    Array.prototype.forEach.call(optionsEl.querySelectorAll('.btn-opcion'), function (option) { option.disabled = true; });
    App.feedback.success(feedbackEl);
    showExplanation(true, item);
    progress.stars += 1;
    hits += 1;
    if (App.feedback && App.feedback.star) App.feedback.star();
    save();
    renderStars();
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function next() {
    index += 1;
    if (index >= items.length) endRound();
    else render();
  }

  function endRound() {
    progress.roundsCompleted += 1;
    progress.position = (roundStart + items.length) % catalog().length;
    var levelId = items[0].level.id;
    progress.completed[levelId] = (progress.completed[levelId] || 0) + 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#endSummary').textContent = App.i18n.t('roundSummary')
      .replace('{hits}', hits).replace('{total}', items.length);
    App.feedback.celebrate(App.i18n.t('roundComplete'));
    renderStars();
  }

  // Lista de solo lectura con todas las situaciones, agrupadas por
  // nivel y subactividad. No cambia el progreso.
  function renderList() {
    listEl.innerHTML = '';
    bank().niveles.forEach(function (level) {
      var heading = document.createElement('h2');
      heading.textContent = level.name + ' · ' + level.descripcion;
      listEl.appendChild(heading);
      Object.keys(level.grupos).forEach(function (grupo) {
        var subheading = document.createElement('h3');
        subheading.textContent = level.grupos[grupo];
        var ul = document.createElement('ul');
        ul.className = 'lista-situaciones';
        level.items.filter(function (item) { return item.grupo === grupo; }).forEach(function (item) {
          var li = document.createElement('li');
          var picto = document.createElement('span');
          picto.className = 'lista-picto';
          picto.setAttribute('aria-hidden', 'true');
          picto.textContent = item.picto;
          li.appendChild(picto);
          li.appendChild(document.createTextNode(item.situacion));
          ul.appendChild(li);
        });
        listEl.appendChild(subheading);
        listEl.appendChild(ul);
      });
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

  btnNext.addEventListener('click', next);
  $('#btnVerTodas').addEventListener('click', showList);
  $('#btnVerTodasFin').addEventListener('click', showList);
  $('#btnVolverJugar').addEventListener('click', hideList);
  $('#repeatBtn').addEventListener('click', startGame);
  $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../';
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();
