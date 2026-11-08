/* ============================================================
   Routime — ¿Dónde lo guardo? (autonomía: organización del hogar)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: aparece un objeto con picto y hay que tocar la caja
   del sitio de la casa donde se guarda. Ronda de 10 objetos por nivel.
   Un único recorrido: nivel 1 y nivel 2, cada uno agrupado por sitio.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página dibuja cada objeto, guarda por dónde va el recorrido y muestra
   la lista de solo lectura.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var itemPictoEl = $('#itemPicto');
  var itemWordEl = $('#itemPalabra');
  var boxesEl = $('#cajas');
  var levelEl = $('#level');
  var lastScreen = gameScreen;

  /* The round in play: where it starts in the run, how many items it has, its level. */
  var roundStart = 0;
  var roundSize = 0;
  var roundLevelId = null;

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  /* Muestra la dificultad actual (número de cajas / sitios). */
  function renderLevel(level) {
    if (levelEl) {
      var n = level.categorias.length;
      levelEl.textContent = n + ' ' + App.i18n.t(n === 1 ? 'sitio' : 'sitios');
    }
  }

  /* Un único recorrido: nivel 1 y nivel 2, cada uno agrupado por sitio. */
  function catalog() {
    var out = [];
    bank().niveles.forEach(function (level) {
      level.items.forEach(function (item) { out.push({ level: level, item: item }); });
    });
    return out;
  }

  /* Cada ronda continúa donde terminó la anterior y da la vuelta al final. */
  function roundEntries(all, start) {
    var out = [];
    for (var i = 0; i < bank().porRonda; i++) {
      out.push(all[(start + i) % all.length]);
    }
    return out;
  }

  App.activityPlay({
    toolId: 'donde-lo-guardo',
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
      renderLevel(entry.level);
      itemPictoEl.textContent = item.picto;
      itemWordEl.textContent = item.palabra;
      boxesEl.innerHTML = '';
      var boxes = [];
      App.utils.shuffle(entry.level.categorias).forEach(function (categoria) {
        var row = document.createElement('div');
        row.className = 'fila-caja';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn caja';
        btn.textContent = categoria;
        btn.addEventListener('click', function () {
          /* The hint is the same for every place; the explanation names the right one. */
          play.attempt(categoria === item.categoria, {
            control: btn,
            hint: App.i18n.t('pista'),
            explanation: categoria === item.categoria
              ? App.i18n.t('explicacionCorrecta')
              : App.i18n.t('explicacionIncorrectaA') + item.categoria + '.'
          });
        });

        var btnAudio = document.createElement('button');
        btnAudio.type = 'button';
        btnAudio.className = 'btn btn-audio';
        btnAudio.textContent = '🔊';
        btnAudio.setAttribute('aria-label', App.i18n.t('escucharCategoria').replace('{categoria}', categoria));
        btnAudio.addEventListener('click', function () { if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(categoria); });

        row.appendChild(btn);
        row.appendChild(btnAudio);
        boxesEl.appendChild(row);
        boxes.push(btn);
      });
      return boxes;
    },
    summary: function (hits) {
      return App.i18n.t('roundSummary').replace('{hits}', hits).replace('{total}', roundSize);
    },
    onEnd: function (play) {
      play.progress.position = (roundStart + roundSize) % catalog().length;
      play.progress.completed[roundLevelId] = (play.progress.completed[roundLevelId] || 0) + 1;
      play.save();
    }
  });

  /* Lista de solo lectura con todos los objetos, agrupados por nivel y
     por sitio. No cambia el progreso. */
  function renderAll() {
    var cont = $('#allList');
    cont.innerHTML = '';
    bank().niveles.forEach(function (level) {
      var h2 = document.createElement('h2');
      h2.textContent = level.nombre + ' · ' + level.descripcion;
      cont.appendChild(h2);
      level.categorias.forEach(function (categoria) {
        var tasks = level.items.filter(function (it) { return it.categoria === categoria; });
        var h3 = document.createElement('h3');
        h3.textContent = categoria;
        cont.appendChild(h3);
        var ul = document.createElement('ul');
        ul.className = 'lista-objetos';
        tasks.forEach(function (it) {
          var li = document.createElement('li');
          var picto = document.createElement('span');
          picto.className = 'lista-picto';
          picto.setAttribute('aria-hidden', 'true');
          picto.textContent = it.picto;
          li.appendChild(picto);
          li.appendChild(document.createTextNode(it.palabra));
          ul.appendChild(li);
        });
        cont.appendChild(ul);
      });
    });
  }

  function showAll() {
    lastScreen = gameScreen.classList.contains('hidden') ? endScreen : gameScreen;
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    renderAll();
    $('#allScreen').classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  function hideAll() {
    $('#allScreen').classList.add('hidden');
    lastScreen.classList.remove('hidden');
  }

  $('#btnVerTodas').addEventListener('click', showAll);
  $('#btnVerTodasFin').addEventListener('click', showAll);
  $('#btnVolverTodas').addEventListener('click', hideAll);
  $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });
})();
