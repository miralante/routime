/* ============================================================
   Routime — Doble Sentido (lenguaje: detectar si una palabra
   de la frase puede significar una cosa o dos)
   Datos en data.js (DATA.es/DATA.en, grupos de 8 frases cada uno,
   mezclando a propósito frases con doble sentido y frases con un
   solo significado). Pregunta binaria (Sí / No) por frase: el
   error nunca se castiga; pista en el primer fallo, y al acertar
   siempre se explican los significados reales, aunque la persona
   haya fallado antes.
   Progresión automática: empieza con el grupo fácil y sube según
   el progress guardado, sin mostrar selección de nivel.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página elige el grupo, dibuja la frase y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var levelEl = $('#dificultad');
  var sentenceText = $('#sentenceText');
  var optionsEl = $('#options');
  var currentLevel = null;

  function t(key) { return App.i18n.t(key); }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  /* The group follows the rounds completed: each completed round moves up one group. */
  function levelFor(progress) {
    var levels = bank();
    return levels[Math.min(progress.roundsCompleted || 0, levels.length - 1)];
  }

  function explanationFor(item) {
    if (item.hasDouble) {
      return t('doubleExplanation').replace('{m1}', item.meanings[0]).replace('{m2}', item.meanings[1]);
    }
    return t('singleExplanation').replace('{m1}', item.meanings[0]);
  }

  App.activityPlay({
    toolId: 'double-meaning',
    roundsKey: 'roundsCompleted',
    ui: {
      game: '#quizScreen',
      end: '#endScreen',
      feedback: '#feedback',
      explanationWrap: '#explanationWrap',
      explanation: '#explanation',
      btnNext: '#nextBtn',
      progressFill: '#progressFill',
      progressText: '#progressText',
      stars: '#stars',
      btnRepeat: '#btnRepeat'
    },
    items: function (progress) {
      currentLevel = levelFor(progress);
      var count = currentLevel.items.length;
      levelEl.textContent = count + ' ' + (count === 1 ? t('frase') : t('frases'));
      return App.utils.shuffle(currentLevel.items);
    },
    mount: function (item, play) {
      sentenceText.textContent = item.sentence;
      optionsEl.innerHTML = '';
      var buttons = [];
      [
        { label: t('optionYes'), value: true, index: 0 },
        { label: t('optionNo'), value: false, index: 1 }
      ].forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.textContent = op.label;
        btn.addEventListener('click', function () {
          play.attempt(op.value === item.hasDouble, {
            control: btn,
            hint: '🤔 ' + item.pistas[op.index],
            explanation: explanationFor(item)
          });
        });
        optionsEl.appendChild(btn);
        buttons.push(btn);
      });
      return buttons;
    },
    onEnd: function (play) {
      $('#resumenFinal').textContent = t('proximoNivel')
        .replace('{n}', Math.min(play.progress.roundsCompleted + 1, bank().length));
      var transferEl = $('#transferencia');
      if (transferEl) transferEl.textContent = t('transferencia');
    }
  });
})();
