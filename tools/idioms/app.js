/* ============================================================
   Routime — Dichos (lógica)
   Datos en data.js (const DATA). Módulos compartidos en assets/js/.
   Mecánica: ronda de 8 dichos con opción múltiple. La pista del
   primer fallo es la de la opción elegida (item.pistas[index]); la
   explicación solo aparece al acertar o tras el segundo fallo.
   El error nunca se castiga: se anima a reintentar.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página dibuja cada dicho y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var textEl = $('#textoPregunta');
  var optionsEl = $('#options');

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  App.activityPlay({
    toolId: 'dichos',
    roundsKey: 'rounds',
    ui: {
      game: '#gameScreen',
      end: '#endScreen',
      feedback: '#feedback',
      explanationWrap: '#explicacionWrap',
      explanation: '#explicacion',
      btnNext: '#btnNext',
      progressFill: '#progressFill',
      progressText: '#progressText',
      stars: '#stars',
      summary: '#resumenFinal',
      btnRepeat: '#btnRepeat'
    },
    items: function () {
      return App.utils.shuffle(bank()).slice(0, 8);
    },
    mount: function (item, play) {
      textEl.textContent = item.text;
      optionsEl.innerHTML = '';
      var buttons = [];
      App.utils.shuffle(item.options.map(function (opt, i) {
        return { text: opt, isCorrect: i === item.correct, index: i };
      })).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.textContent = op.text;
        btn.addEventListener('click', function () {
          /* The hint is the chosen option's own; the explanation names the right meaning. */
          play.attempt(op.isCorrect, {
            control: btn,
            hint: '🤔 ' + item.pistas[op.index],
            explanation: op.isCorrect
              ? App.i18n.t('explicacionCorrecta')
              : App.i18n.t('explicacionIncorrectaA') + item.options[item.correct] + App.i18n.t('explicacionIncorrectaB') + '.'
          });
        });
        optionsEl.appendChild(btn);
        buttons.push(btn);
      });
      return buttons;
    },
    summary: function (hits, stars) {
      return App.i18n.t('resumenFinal').replace('{n}', hits).replace('{total}', stars);
    },
    onEnd: function () {
      var transferEl = $('#transferencia');
      if (transferEl) transferEl.textContent = App.i18n.t('transferencia');
    }
  });
})();
