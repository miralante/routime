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
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página dibuja cada señal, guarda por dónde va el recorrido, muestra la
   lista de solo lectura y el selector de nivel.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var listScreen = $('#listScreen');
  var listEl = $('#listaTodas');
  var questionTextEl = $('#questionText');
  var optionsEl = $('#options');
  var levelEl = $('#level');
  var btnListen = $('#listenBtn');
  var lastScreen = gameScreen;

  /* The round in play: where it starts in the run, how many items it has, its level. */
  var roundStart = 0;
  var roundSize = 0;
  var roundLevelId = null;
  var currentItem = null;

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

  function signalText(item) {
    return item.textContent || item.text;
  }

  App.activityPlay({
    toolId: 'mi-cuerpo-avisa',
    roundsKey: 'roundsCompleted',
    ui: {
      game: '#gameScreen',
      end: '#endScreen',
      feedback: '#feedback',
      explanationWrap: '#explanationWrap',
      explanation: '#explanation',
      btnNext: '#btnNext',
      progressFill: '#progressFill',
      progressText: '#progressText',
      stars: '#stars',
      summary: '#endSummary',
      btnRepeat: '#repeatBtn'
    },
    items: function (progress) {
      if (!progress.completed) progress.completed = {};
      var all = catalog();
      roundStart = (progress.position || 0) % all.length;
      var entries = roundEntries(all, roundStart);
      roundSize = entries.length;
      roundLevelId = entries[0].level.id;
      return entries;
    },
    mount: function (entry, play) {
      var item = entry.item;
      currentItem = item;
      levelEl.textContent = entry.level.name;
      questionTextEl.textContent = signalText(item);
      optionsEl.innerHTML = '';
      var buttons = [];
      App.utils.shuffle(item.options.map(function (opt, i) {
        return { text: opt, isCorrect: i === item.correct };
      })).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.textContent = op.text;
        btn.addEventListener('click', function () {
          /* The hint points back to the signal already on screen; the explanation names what was needed. */
          play.attempt(op.isCorrect, {
            control: btn,
            hint: App.i18n.t('pista') + '"' + signalText(item) + '"',
            explanation: op.isCorrect
              ? App.i18n.t('explicacionCorrecta')
              : App.i18n.t('explicacionIncorrectaA') + item.options[item.correct] + '.'
          });
        });
        optionsEl.appendChild(btn);
        buttons.push(btn);
      });
      return buttons;
    },
    summary: function (hits) {
      return App.i18n.t('roundSummary').replace('{hits}', hits).replace('{total}', roundSize);
    },
    onEnd: function (play) {
      play.progress.position = (roundStart + roundSize) % catalog().length;
      play.progress.completed[roundLevelId] = (play.progress.completed[roundLevelId] || 0) + 1;
      play.save();
      var transferEl = $('#transferencia');
      if (transferEl) App.i18n.applyTo(transferEl);
    }
  });

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
        li.textContent = signalText(item);
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
    if (App.tts && App.tts.speak && currentItem) App.tts.speak(signalText(currentItem));
  });
  $('#btnVerTodas').addEventListener('click', showList);
  $('#btnVerTodasFin').addEventListener('click', showList);
  $('#btnVolverJugar').addEventListener('click', hideList);
  $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../';
  });
})();
