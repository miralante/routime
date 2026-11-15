/* ============================================================
   Routime — ¿Qué hago primero? (autonomía: priorización)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: leer una situación con tres cosas posibles que hacer y
   ponerlas en orden tocándolas: primero lo más urgente, después lo
   que sigue, y por último lo que queda. Cada toque que va en su
   sitio entra en una cola numerada (1., 2., 3.). Un toque que no
   toca en ese paso se responde con la pista, y las opciones vuelven
   a estar libres después de confirmar. Ronda de 8. El error nunca se
   castiga.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página elige el nivel, dibuja la situación y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var situationPictoEl = $('#situacionPicto');
  var situationTextEl = $('#situacionTexto');
  var optionsEl = $('#options');
  var queueEl = $('#cola');
  var phaseEl = $('#fase');
  var levelEl = $('#level');
  var currentLevel = null;

  /* The line above the cards for each step of the order. */
  var PHASES = ['fasePrimero', 'faseDespues', 'faseUltimo'];

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  /* The line above the cards: what the person has to do now. */
  function setPhase(key) {
    phaseEl.textContent = key ? App.i18n.t(key) : '';
  }

  /* One more task in the queue, numbered, so the order is not only shown by position. */
  function addToQueue(text) {
    var li = document.createElement('li');
    var n = queueEl.querySelectorAll('li').length + 1;
    li.textContent = App.i18n.t('colaItem').replace('{n}', n).replace('{texto}', text);
    queueEl.appendChild(li);
  }

  /* The whole order of the situation, numbered, for the explanation at the end. */
  function orderText(item) {
    return item.orden.map(function (k, n) { return (n + 1) + '. ' + item.opciones[k]; }).join('  ·  ');
  }

  /* The level follows the rounds completed: each completed round moves up one level. */
  function levelFor(progress) {
    var levels = bank().niveles;
    return levels[Math.min(progress.roundsCompleted || 0, levels.length - 1)];
  }

  App.activityPlay({
    toolId: 'que-primero',
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
      situationPictoEl.textContent = item.picto;
      situationTextEl.textContent = item.situacion;
      optionsEl.innerHTML = '';
      queueEl.innerHTML = '';
      /* The round of this situation: the step the person is on, and the tasks placed so far. */
      var step = 0;
      var placed = [];
      var buttons = [];
      setPhase(PHASES[0]);
      App.utils.shuffle(item.opciones.map(function (opt, i) {
        return { texto: opt, index: i };
      })).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.textContent = op.texto;
        btn.addEventListener('click', function () {
          if (btn.disabled || step >= item.orden.length) return;
          /* A task that is not the one for this step: the hint, as before, and the others wait for «Entendido». */
          if (op.index !== item.orden[step]) {
            play.attempt(false, {
              control: btn,
              hint: App.i18n.t('pista') + '"' + item.situacion + '"',
              explanation: App.i18n.t(step === 0 ? 'explicacionIncorrectaA' : 'explicacionIncorrectaPaso') +
                item.opciones[item.orden[step]] + '.'
            });
            return;
          }
          /* The right task for this step goes to the queue. */
          btn.disabled = true;
          placed.push(btn);
          addToQueue(op.texto);
          step += 1;
          /* The tasks missed before are free again: each step needs the ones still missing. */
          buttons.forEach(function (other) {
            if (placed.indexOf(other) === -1) { other.disabled = false; other.classList.remove('animo'); }
          });
          if (step < item.orden.length) {
            setPhase(PHASES[step]);
            return;
          }
          /* The order is complete: the round counts, and the explanation shows the whole order. */
          setPhase('');
          play.attempt(true, { control: placed[0], explanation: App.i18n.t('explicacionOrden').replace('{orden}', orderText(item)) });
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
