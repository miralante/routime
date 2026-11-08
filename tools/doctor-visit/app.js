/* ============================================================
   Routime — Se lo Cuento al Médico (Mi día a día)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: leer una escena con un síntoma corporal (dolor, picor,
   mareo, fiebre…) y elegir, entre 3 opciones, la frase que mejor
   se lo describe a un médico. La opción correcta siempre nombra
   bien la parte del cuerpo y el síntoma; las otras son un síntoma
   distinto o una frase que no dice nada útil. Ronda de 8. El error
   nunca se castiga.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página elige el nivel, dibuja la escena y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var textQuestionEl = $('#situacionTexto');
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
    toolId: 'cuenta-al-medico',
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
      textQuestionEl.textContent = item.text;
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
          /* The hint points back to the scene already on screen; the explanation names the right phrase. */
          play.attempt(op.isCorrect, {
            control: btn,
            hint: App.i18n.t('pista') + '"' + item.text + '"',
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
      var transferEl = $('#transferencia');
      if (transferEl) transferEl.textContent = '';
    }
  });

  $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });
})();
