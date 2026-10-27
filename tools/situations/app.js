/* Routime — Situaciones: elegir una respuesta segura.
   Menú de subactividades (un grupo de situaciones de un nivel); cada una
   se juega en orden, sin barajar, y su progreso se guarda por separado. */
(function () {
  'use strict';

  var TOOL_ID = 'situaciones';
  var $ = App.utils.$;
  var menuScreen = $('#menuScreen');
  var menuNiveles = $('#menuNiveles');
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

  var current = null;
  var items = [];
  var index = 0;
  var hits = 0;
  var solved = false;
  var attempts = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function keyOf(level, grupo) { return level.id + ':' + grupo; }

  // Situaciones de una subactividad, en su orden didáctico. Cada entrada
  // guarda su nivel para mostrarlo en la cabecera del juego.
  function itemsOf(level, grupo) {
    var out = [];
    level.items.forEach(function (item) {
      if (item.grupo === grupo) out.push({ level: level, item: item });
    });
    return out;
  }

  function showScreen(screen) {
    [menuScreen, gameScreen, endScreen, listScreen].forEach(function (s) {
      s.classList.toggle('hidden', s !== screen);
    });
  }

  // Menú: una sección por nivel, con una tarjeta por subactividad.
  function renderMenu() {
    menuNiveles.innerHTML = '';
    bank().niveles.forEach(function (level) {
      var bloque = document.createElement('div');
      bloque.className = 'nivel-bloque';

      var heading = document.createElement('h2');
      heading.textContent = level.name + ' · ' + level.descripcion;
      bloque.appendChild(heading);

      var grid = document.createElement('div');
      grid.className = 'cards-grid';
      Object.keys(level.grupos).forEach(function (grupo) {
        var entries = itemsOf(level, grupo);
        var done = progress.completed[keyOf(level, grupo)] || 0;

        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'tarjeta-actividad';

        var picto = document.createElement('span');
        picto.className = 'picto';
        picto.setAttribute('aria-hidden', 'true');
        picto.textContent = entries[0].item.picto;

        var name = document.createElement('span');
        name.className = 'name';
        name.textContent = level.grupos[grupo];

        var detalle = document.createElement('span');
        detalle.className = 'detalle';
        detalle.textContent = App.i18n.t('numSituaciones').replace('{n}', entries.length);

        var marca = document.createElement('span');
        marca.className = 'marca';
        marca.textContent = done ? '✅ ' + done : '';

        card.appendChild(picto);
        card.appendChild(name);
        card.appendChild(detalle);
        card.appendChild(marca);
        card.addEventListener('click', function () { startGame(level, grupo); });
        grid.appendChild(card);
      });
      bloque.appendChild(grid);
      menuNiveles.appendChild(bloque);
    });
  }

  function showMenu() {
    renderMenu();
    showScreen(menuScreen);
    renderStars();
    window.scrollTo(0, 0);
  }

  function startGame(level, grupo) {
    current = { level: level, grupo: grupo, key: keyOf(level, grupo) };
    items = itemsOf(level, grupo);
    index = 0;
    hits = 0;
    showScreen(gameScreen);
    render();
  }

  function renderProgress() {
    var total = items.length;
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
    progress.completed[current.key] = (progress.completed[current.key] || 0) + 1;
    save();
    showScreen(endScreen);
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
    lastScreen = endScreen.classList.contains('hidden') ? gameScreen : endScreen;
    renderList();
    showScreen(listScreen);
    window.scrollTo(0, 0);
  }

  function hideList() {
    showScreen(lastScreen);
  }

  btnNext.addEventListener('click', next);
  $('#btnVerTodas').addEventListener('click', showList);
  $('#btnVerTodasFin').addEventListener('click', showList);
  $('#btnVolverJugar').addEventListener('click', hideList);
  $('#btnMenuJuego').addEventListener('click', showMenu);
  $('#btnMenuFin').addEventListener('click', showMenu);
  $('#repeatBtn').addEventListener('click', function () { startGame(current.level, current.grupo); });

  renderStars();
  showMenu();
})();
