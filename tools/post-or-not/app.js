/* ============================================================
   Routime — ¿Lo publico? (autonomía: privacidad en redes)
   Mecánica: leer una situación de redes y elegir entre 3 opciones
   lo que hay que hacer. Ronda de 8 por nivel; el error nunca se castiga.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página elige el nivel, dibuja la situación y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var levelEl = $('#level');
  var situationPictoEl = $('#situacionPicto');
  var situationTextEl = $('#situacionTexto');
  var optionsEl = $('#options');
  var currentLevel = null;
  var roundSize = 0;

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  /* The level follows the rounds completed: each completed round moves up one level. */
  function levelFor(progress) {
    var levels = bank().niveles;
    return levels[Math.min(progress.roundsCompleted || 0, levels.length - 1)];
  }

  App.activityPlay({
    toolId: 'lo-publico',
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
      currentLevel = levelFor(progress);
      levelEl.textContent = currentLevel.name + ' · ' + currentLevel.descripcion;
      var entries = App.utils.shuffle(currentLevel.items).slice(0, bank().porRonda);
      roundSize = entries.length;
      return entries;
    },
    mount: function (item, play) {
      situationPictoEl.textContent = item.picto;
      situationTextEl.textContent = item.situacion;
      optionsEl.innerHTML = '';
      var buttons = [];
      App.utils.shuffle(item.options.map(function (text, i) {
        return { text: text, isCorrect: i === item.correcta, index: i };
      })).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.textContent = op.text;
        btn.addEventListener('click', function () {
          /* Socratic hint for the option chosen: why it is not right and a clue toward the right one. */
          var hint = item.pistas[op.index];
          play.attempt(op.isCorrect, {
            control: btn,
            hint: hint ? '🤔 ' + hint : App.i18n.t('pista'),
            explanation: op.isCorrect
              ? App.i18n.t('explicacionCorrecta')
              : App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.'
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
      play.progress.completed[currentLevel.id] = (play.progress.completed[currentLevel.id] || 0) + 1;
      play.save();
    }
  });

  $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });
})();
