/* Social Safety — preventive simulations about intimacy, manipulation and law.
   Un único recorrido por todos los casos: tema 1, tema 2 y tema 3, cada
   uno agrupado por subactividad. Las rondas continúan donde terminó la
   anterior y dan la vuelta al final. */
(function () {
  'use strict';

  var TOOL_ID = 'social-safety';
  var $ = App.utils.$;
  var bank = DATA[App.i18n.locale()] || DATA.es;
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;
  if (!progress.completed) progress.completed = {};

  var roundStart = 0;
  var cases = [];
  var index = 0;
  var solved = false;
  var attempts = 0;
  var lastScreen = 'caseScreen';

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { $('#stars').textContent = '⭐ ' + progress.stars; }

  function showScreen(id) {
    ['caseScreen', 'endScreen'].forEach(function (screenId) {
      $('#' + screenId).classList.toggle('hidden', screenId !== id);
    });
  }

  function catalog() {
    var out = [];
    bank.niveles.forEach(function (level) {
      level.casos.forEach(function (item) { out.push({ level: level, item: item }); });
    });
    return out;
  }

  // Cada ronda toma los casos seguidos desde donde quedó la anterior.
  function roundEntries(all, start) {
    var out = [];
    for (var i = 0; i < bank.porRonda; i++) {
      out.push(all[(start + i) % all.length]);
    }
    return out;
  }

  function startGame() {
    var all = catalog();
    roundStart = (progress.position || 0) % all.length;
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
      return { text: text, correct: optionIndex === item.correcta };
    })).forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-opcion';
      button.textContent = option.text;
      button.addEventListener('click', function () { answer(button, option.correct, item); });
      $('#options').appendChild(button);
    });
  }

  function showExplanation(text) {
    $('#explanation').textContent = text;
    $('#explanationWrap').classList.remove('hidden');
  }

  function answer(button, correct, item) {
    if (solved) return;
    if (!correct) {
      attempts += 1;
      var respuestaTrasPista = attempts > 1;
      button.classList.add('animo');
      button.disabled = true;
      App.feedback.encourage($('#feedback'));
      showExplanation(item.pista);
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
    // Cada tema da estrellas la primera vez que aparece en una ronda.
    var touched = {};
    cases.forEach(function (entry) {
      var id = entry.level.id;
      if (touched[id]) return;
      touched[id] = true;
      if (!progress.completed[id]) {
        progress.completed[id] = true;
        progress.stars += entry.level.estrellas || 1;
      }
    });
    var total = catalog().length;
    progress.position = (roundStart + cases.length) % total;
    progress.roundsCompleted += 1;
    save();
    paintStars();
    $('#endText').textContent = App.i18n.t('endText');
    $('#resumenFinal').textContent = App.i18n.t('siguienteRonda')
      .replace('{desde}', progress.position + 1)
      .replace('{hasta}', Math.min(progress.position + cases.length, total))
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
    lastScreen = $('#caseScreen').classList.contains('hidden') ? 'endScreen' : 'caseScreen';
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
  $('#btnRepeat').addEventListener('click', startGame);
  paintStars();
  // Iniciar directamente la actividad
  startGame();
})();
