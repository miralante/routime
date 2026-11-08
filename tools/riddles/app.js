/* ============================================================
   Routime — Adivinanzas (lógica)
   Datos en data.js (const DATA). Módulos compartidos en assets/js/.
   Mecánica: ronda de 7 adivinanzas con opción múltiple. La pista del
   primer fallo es la de la opción elegida (item.pistas[index]); la
   explicación (item.explicacion) solo aparece al acertar o tras el
   segundo fallo. El error nunca se castiga: se anima a reintentar, y las
   preguntas falladas vuelven al final de la ronda (App.reinforce).
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página dibuja cada adivinanza y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var textEl = $('#textoPregunta');
  var optionsEl = $('#options');

  App.activityPlay({
    toolId: 'riddles',
    roundsKey: 'rounds',
    reinforce: true,
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
      var bank = DATA[App.i18n.locale()] || DATA.es;
      return App.utils.shuffle(bank).slice(0, 7);
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
    summary: function (hits, stars) {
      return App.i18n.t('resumenFinal').replace('{n}', hits).replace('{total}', stars);
    },
    onEnd: function () {
      $('#transferencia').textContent = App.i18n.t('transferencia');
    }
  });
})();
