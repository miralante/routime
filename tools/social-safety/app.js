/* Social Safety — preventive simulations about intimacy, manipulation and law.
   Cada tema (nivel) es una subactividad con su propio recorrido: se elige
   desde el menú de temas y sus rondas continúan donde terminó la anterior
   de ese mismo tema, dando la vuelta al final. */
(function () {
  'use strict';

  var TOOL_ID = 'social-safety';
  var $ = App.utils.$;
  var bank = DATA[App.i18n.locale()] || DATA.es;
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;
  if (!progress.completed) progress.completed = {};
  if (!progress.positions) progress.positions = {};

  var topic = null;
  var roundStart = 0;
  var cases = [];
  var index = 0;
  var solved = false;
  var attempts = 0;
  var visibleScreen = 'menuScreen';
  var lastScreen = 'menuScreen';

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { $('#stars').textContent = '⭐ ' + progress.stars; }

  function showScreen(id) {
    if (id) visibleScreen = id;
    ['menuScreen', 'caseScreen', 'endScreen'].forEach(function (screenId) {
      $('#' + screenId).classList.toggle('hidden', screenId !== id);
    });
  }

  function topicCatalog(level) {
    return level.casos.map(function (item) { return { level: level, item: item }; });
  }

  // Cada ronda toma los casos seguidos desde donde quedó la anterior del tema.
  function roundEntries(all, start) {
    var out = [];
    for (var i = 0; i < bank.porRonda; i++) {
      out.push(all[(start + i) % all.length]);
    }
    return out;
  }

  /* ---------- Menu de temas ---------- */
  function renderMenu() {
    var cont = $('#listaTemas');
    cont.innerHTML = '';
    bank.niveles.forEach(function (level) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-nivel';
      var done = progress.completed[level.id] ? ' ⭐' : '';
      b.textContent = level.name + ' · ' + level.descripcion + done;
      b.addEventListener('click', function () { startTopic(level); });
      cont.appendChild(b);
    });
    paintStars();
  }

  function goToMenu() {
    renderMenu();
    showScreen('menuScreen');
  }

  function startTopic(level) {
    topic = level;
    var all = topicCatalog(level);
    roundStart = (progress.positions[level.id] || 0) % all.length;
    cases = roundEntries(all, roundStart);
    index = 0;
    showScreen('caseScreen');
    renderCase();
  }

  function renderCase() {
    var entry = cases[index];
    var item = entry.item;
    solved = false;
    attempts = 0;
    $('#grupoCaso').textContent = entry.level.name + ' · ' + entry.level.grupos[item.grupo];
    $('#caseIcon').textContent = item.picto;
    $('#caseText').textContent = item.situacion;
    $('#feedback').textContent = '';
    $('#feedback').className = 'feedback';
    $('#explanationWrap').classList.add('hidden');
    $('#nextButton').classList.add('hidden');
    $('#options').innerHTML = '';
    $('#progressFill').style.width = ((index / cases.length) * 100) + '%';
    $('#progressText').textContent = (index + 1) + ' / ' + cases.length;

    App.utils.shuffle(item.options.map(function (text, optionIndex) {
      return { text: text, correct: optionIndex === item.correcta, index: optionIndex };
    })).forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-opcion';
      button.textContent = option.text;
      button.addEventListener('click', function () { answer(button, option.correct, item, option.index); });
      $('#options').appendChild(button);
    });
  }

  function showExplanation(text) {
    $('#explanation').textContent = text;
    $('#explanationWrap').classList.remove('hidden');
  }

  // Socratic hint for the option chosen (item.pistas[index]): why it does
  // not fit this case, with a clue toward the right one.
  function answer(button, correct, item, index) {
    if (solved) return;
    if (!correct) {
      attempts += 1;
      var respuestaTrasPista = attempts > 1;
      button.classList.add('animo');
      button.disabled = true;
      App.feedback.encourage($('#feedback'));
      showExplanation('🤔 ' + item.pistas[index]);
      App.feedback.lockUntilAck(App.utils.$$('#options .btn-opcion'), $('#explanationWrap'), function () {
        if (respuestaTrasPista) showExplanation(item.explicacion);
      });
      return;
    }

    solved = true;
    button.classList.add('correcta');
    App.utils.$$('#options .btn-opcion').forEach(function (option) { option.disabled = true; });
    App.feedback.success($('#feedback'));
    showExplanation(item.explicacion);
    $('#nextButton').classList.remove('hidden');
    $('#nextButton').focus();
  }

  function next() {
    index += 1;
    if (index < cases.length) {
      renderCase();
      return;
    }
    endRound();
  }

  function endRound() {
    // El tema da estrellas la primera vez que se practica.
    if (!progress.completed[topic.id]) {
      progress.completed[topic.id] = true;
      progress.stars += topic.estrellas || 1;
    }
    var total = topic.casos.length;
    var position = (roundStart + cases.length) % total;
    progress.positions[topic.id] = position;
    progress.roundsCompleted += 1;
    save();
    paintStars();
    $('#endText').textContent = App.i18n.t('endText');
    $('#resumenFinal').textContent = App.i18n.t('siguienteRonda')
      .replace('{desde}', position + 1)
      .replace('{hasta}', Math.min(position + cases.length, total))
      .replace('{total}', total);
    $('#transferencia').textContent = App.i18n.t('transferencia');
    showScreen('endScreen');
    App.feedback.celebrate(App.i18n.t('roundComplete'));
  }

  // Lista de solo lectura con todos los casos, agrupados por tema y
  // subactividad. No cambia el progreso.
  function renderList() {
    var listEl = $('#listaTodas');
    listEl.innerHTML = '';
    bank.niveles.forEach(function (level) {
      var heading = document.createElement('h2');
      heading.textContent = level.name + ' · ' + level.descripcion;
      listEl.appendChild(heading);
      Object.keys(level.grupos).forEach(function (grupo) {
        var subheading = document.createElement('h3');
        subheading.textContent = level.grupos[grupo];
        var ul = document.createElement('ul');
        ul.className = 'lista-casos';
        level.casos.filter(function (item) { return item.grupo === grupo; }).forEach(function (item) {
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
    lastScreen = visibleScreen;
    showScreen('');
    renderList();
    $('#listScreen').classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  function hideList() {
    $('#listScreen').classList.add('hidden');
    showScreen(lastScreen);
  }

  $('#nextButton').addEventListener('click', next);
  $('#btnVerTodas').addEventListener('click', showList);
  $('#btnVerTodasFin').addEventListener('click', showList);
  $('#btnVolverJugar').addEventListener('click', hideList);
  $('#btnRepeat').addEventListener('click', function () { startTopic(topic); });
  $('#btnOtroTemaCaso').addEventListener('click', goToMenu);
  $('#btnOtroTemaFin').addEventListener('click', goToMenu);
  goToMenu();
})();
