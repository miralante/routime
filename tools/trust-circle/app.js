/* ============================================================
   Routime — Circle of Trust (amigo/compañero/conocido and
   recognizing manipulation, including money requests).
   Data in data.js (DATA.niveles). Shared modules in assets/js/.
   Mechanic: read a situation and choose the correct answer among
   3 options. Levels 1-2 classify the relationship; levels 3-4
   pick the healthy response to a manipulation attempt. Each item
   carries pistas, one hint per option (Socratic: the hint for the
   option chosen on the first mistake), and its own explicacion,
   shown on the second mistake, same as social-safety.
   Round of 8. No punishment for a wrong answer.
   Un único recorrido por todas las situaciones: nivel 1 a 5, cada uno
   en su orden. Las rondas continúan donde terminó la anterior.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página dibuja cada situación, guarda por dónde va el recorrido y
   muestra la lista de solo lectura.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var listScreen = $('#listScreen');
  var listEl = $('#listaTodas');
  var situationPictoEl = $('#situacionPicto');
  var situationTextEl = $('#situacionTexto');
  var optionsEl = $('#options');
  var levelEl = $('#level');
  var lastScreen = gameScreen;

  /* The round in play: where it starts in the run, how many items it has, its level. */
  var roundStart = 0;
  var roundSize = 0;
  var roundLevelId = null;

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

  function renderLevel(level) {
    if (levelEl) levelEl.textContent = level.nombre + ' · ' + level.descripcion;
  }

  App.activityPlay({
    toolId: 'trust-circle',
    roundsKey: 'roundsCompleted',
    autoStart: false,
    ui: {
      start: '#pantallaIntro',
      play: '#btnContinuarIntro',
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
      renderLevel(entry.level);
      situationPictoEl.textContent = item.picto;
      situationTextEl.textContent = item.situacion;
      optionsEl.innerHTML = '';
      var buttons = [];
      App.utils.shuffle(item.opciones.map(function (opt, i) {
        return { texto: opt, isCorrect: i === item.correcta, index: i };
      })).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.textContent = op.texto;
        btn.addEventListener('click', function () {
          /* The hint is specific to the option chosen; the explanation is the item's own. */
          play.attempt(op.isCorrect, {
            control: btn,
            hint: '🤔 ' + item.pistas[op.index],
            explanation: item.explicacion
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
      /* Esta herramienta ya no trae bloque de "transferencia". Se escribe
         solo si el elemento existe, como el resto de guardas de este fichero. */
      var transferEl = $('#transferencia');
      if (transferEl) transferEl.textContent = '';
    }
  });

  /* Lista de solo lectura con todas las situaciones, agrupadas por
     nivel. No cambia el progreso. */
  function renderList() {
    listEl.innerHTML = '';
    bank().niveles.forEach(function (level) {
      var heading = document.createElement('h2');
      heading.textContent = level.nombre + ' · ' + level.descripcion;
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

  $('#btnVerTodas').addEventListener('click', showList);
  $('#btnVerTodasFin').addEventListener('click', showList);
  $('#btnVolverJugar').addEventListener('click', hideList);
  $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });
})();
