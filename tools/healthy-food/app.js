/* ============================================================
   Routime — Comida Sana (autonomía/hogar)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: aparece un alimento con picto y hay que tocar la caja
   "Cada día" o "De vez en cuando". Ronda de 10 alimentos por nivel.
   Enfoque de moderación (nunca "alimento malo"): la explicación de
   cada acierto añade una frase corta y positiva sobre cómo te sienta
   ese alimento en el cuerpo (item.consecuencia).
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página elige el nivel, dibuja el alimento y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var levelEl = $('#level');
  var itemPictoEl = $('#itemPicto');
  var itemWordEl = $('#itemPalabra');
  var boxesEl = $('#cajas');
  var currentLevel = null;

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  /* The level follows the rounds completed: each completed round moves up one level. */
  function levelFor(progress) {
    var levels = bank().niveles;
    return levels[Math.min(progress.roundsCompleted || 0, levels.length - 1)];
  }

  App.activityPlay({
    toolId: 'comida-sana',
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
      itemPictoEl.textContent = item.picto;
      itemWordEl.textContent = item.palabra;
      boxesEl.innerHTML = '';
      var boxes = [];
      App.utils.shuffle(currentLevel.categorias).forEach(function (categoria) {
        var row = document.createElement('div');
        row.className = 'row-caja';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn caja';
        btn.textContent = categoria;
        btn.addEventListener('click', function () {
          /* The explanation of a right try adds the food's effect on the body. */
          var isCorrect = categoria === item.categoria;
          play.attempt(isCorrect, {
            control: btn,
            hint: App.i18n.t('pista'),
            explanation: isCorrect
              ? App.i18n.t('acierto') + ' ' + item.consecuencia
              : App.i18n.t('incorrectoA') + item.categoria + '. ' + item.consecuencia
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
    onEnd: function (play) {
      play.progress.completed[currentLevel.id] = (play.progress.completed[currentLevel.id] || 0) + 1;
      play.save();
      var transferEl = $('#transferencia');
      if (transferEl) transferEl.textContent = '';
    }
  });

  $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });
})();
