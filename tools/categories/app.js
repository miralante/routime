/* ============================================================
   Routime — Categorías (lenguaje)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: aparece una palabra con picto y hay que tocar la caja
   del grupo al que pertenece. Ronda de 10 words por nivel.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página elige el nivel, dibuja la palabra y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var levelEl = $('#level');
  var itemEl = $('#categoriaPrompt');
  var boxesEl = $('#options');
  var currentLevel = null;

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  /* The level follows the rounds completed: each completed round moves up one level. */
  function levelFor(progress) {
    var levels = bank().niveles;
    return levels[Math.min(progress.roundsCompleted || 0, levels.length - 1)];
  }

  App.activityPlay({
    toolId: 'categorias',
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
      btnRepeat: '#repeatBtn'
    },
    items: function (progress) {
      if (!progress.completed) progress.completed = {};
      currentLevel = levelFor(progress);
      levelEl.textContent = currentLevel.name;
      return App.utils.shuffle(currentLevel.items).slice(0, bank().porRonda);
    },
    mount: function (item, play) {
      itemEl.textContent = item.picto + ' ' + item.palabra;
      boxesEl.innerHTML = '';
      var boxes = [];
      App.utils.shuffle(currentLevel.categorias).forEach(function (categoria) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-opcion caja';
        btn.textContent = categoria;
        btn.addEventListener('click', function () {
          play.attempt(categoria === item.categoria, {
            control: btn,
            hint: App.i18n.t('pista'),
            explanation: categoria === item.categoria
              ? App.i18n.t('explicacionCorrecta')
              : App.i18n.t('explicacionIncorrectaA') + item.categoria + '.'
          });
        });
        boxesEl.appendChild(btn);
        boxes.push(btn);
      });
      return boxes;
    },
    onEnd: function (play) {
      play.progress.completed[currentLevel.id] = (play.progress.completed[currentLevel.id] || 0) + 1;
      play.save();
      if ($('#transferencia')) $('#transferencia').textContent = '';
    }
  });

  $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../';
  });
})();
