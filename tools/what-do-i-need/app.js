/* ============================================================
   Routime — ¿Qué necesito? (autonomía: planificación)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: leer una tarea u objetivo y elegir qué hace falta
   preparar antes, entre 3 opciones. Ronda de 8. El error nunca se
   castiga.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página elige el nivel, dibuja la tarea y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var textQuestionEl = $('#questionText');
  var optionsEl = $('#options');
  var levelEl = $('#level');
  var currentLevel = null;

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  /* The level follows the rounds completed: each completed round moves up one level. */
  function levelFor(progress) {
    var levels = bank().niveles;
    return levels[Math.min(progress.roundsCompleted || 0, levels.length - 1)];
  }

  App.activityPlay({
    toolId: 'que-necesito',
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
      levelEl.textContent = currentLevel.nombre;
      return App.utils.shuffle(currentLevel.items).slice(0, bank().porRonda);
    },
    mount: function (item, play) {
      textQuestionEl.textContent = item.textContent;
      optionsEl.innerHTML = '';
      var buttons = [];
      App.utils.shuffle(item.options.map(function (opt, i) {
        return { texto: opt, isCorrect: i === item.correct };
      })).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.textContent = op.texto;
        btn.addEventListener('click', function () {
          /* The hint points back to the task already on screen. */
          play.attempt(op.isCorrect, {
            control: btn,
            hint: App.i18n.t('pista') + '"' + item.textContent + '"',
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
    onEnd: function (play) {
      play.progress.completed[currentLevel.id] = (play.progress.completed[currentLevel.id] || 0) + 1;
      play.save();
      $('#endSummary').textContent = '\n' + App.i18n.t('proximoNivel', { n: Math.min(play.progress.roundsCompleted + 1, bank().niveles.length) });
      var transferEl = $('#transferencia');
      if (transferEl) transferEl.textContent = '';
    }
  });

  $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });
})();
