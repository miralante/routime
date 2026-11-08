/* ============================================================
   Routime — ¿Dónde está? (direccionamiento y localización)
   Datos en data.js (DATA.objetos, DATA.niveles). Los ítems se
   generan al vuelo: 3 objetos (referencia en el centro, objetivo a
   un lado, distractor al otro) colocados en fila o columna según el
   eje del nivel, y una consigna espacial ("Toca lo que está a la
   izquierda de la casa"). Primer fallo → pista socrática que enseña
   la estrategia (busca la referencia, luego mira hacia el lado);
   segundo fallo → se marca el objetivo y se explica (reglas 11/12).
   Ronda de 8. El error nunca se castiga.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página genera cada escena y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var consignaEl = $('#prompt');
  var sceneEl = $('#escena');
  var levelEl = $('#level');
  var currentLevel = null;
  var botonObjetivo = null;

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* The level follows the rounds completed: each completed round moves up one level. */
  function levelFor(progress) {
    var levels = bank().niveles;
    return levels[Math.min(progress.roundsCompleted || 0, levels.length - 1)];
  }

  /* Generates an item: the level's relation + 3 distinct objects.
     Placement: the reference is always in the center; the target on
     the side the relation says; the distractor on the opposite side. */
  function generarItem() {
    var rel = App.utils.shuffle(currentLevel.relaciones)[0];
    var eje = (rel === 'izq' || rel === 'der') ? 'fila' : 'columna';
    var tres = App.utils.shuffle(bank().objetos).slice(0, 3);
    return { rel: rel, eje: eje, ref: tres[0], objetivo: tres[1], distractor: tres[2] };
  }

  /* Visual order: row → left-center-right; column → top-center-bottom.
     'izq' and 'enc' put the target first. */
  function orderVisual(item) {
    var first = (item.rel === 'izq' || item.rel === 'enc');
    return first
      ? [item.objetivo, item.ref, item.distractor]
      : [item.distractor, item.ref, item.objetivo];
  }

  App.activityPlay({
    toolId: 'donde-esta',
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
      levelEl.textContent = currentLevel.relaciones.length + ' ' +
        App.i18n.t(currentLevel.relaciones.length === 1 ? 'relacion' : 'relaciones');
      var out = [];
      for (var i = 0; i < bank().porRonda; i++) out.push(generarItem());
      return out;
    },
    mount: function (item, play) {
      var tries = 0;
      botonObjetivo = null;
      consignaEl.textContent = App.i18n.t('consigna')
        .replace('{rel}', App.i18n.t('rel_' + item.rel))
        .replace('{ref}', item.ref.del);
      sceneEl.className = 'escena ' + (item.eje === 'fila' ? 'en-fila' : 'en-columna');
      sceneEl.innerHTML = '';
      var buttons = [];
      orderVisual(item).forEach(function (obj) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'objeto';
        btn.textContent = obj.picto;
        btn.setAttribute('aria-label', App.i18n.t('ariaObjeto').replace('{objeto}', obj.el));
        if (obj === item.objetivo) botonObjetivo = btn;
        btn.addEventListener('click', function () {
          var isCorrect = obj === item.objetivo;
          if (!isCorrect) {
            tries += 1;
            /* Second miss: the target is marked, as before. */
            if (tries >= 2 && botonObjetivo) botonObjetivo.classList.add('sugerida');
          }
          play.attempt(isCorrect, {
            control: btn,
            /* The first miss gives the strategy, never the answer. */
            hint: App.i18n.t('pista')
              .replace('{ref}', item.ref.el)
              .replace('{mira}', App.i18n.t('mira_' + item.rel)),
            explanation: isCorrect
              ? App.i18n.t('okRelacion')
                  .replace('{objeto}', cap(item.objetivo.el))
                  .replace('{rel}', App.i18n.t('rel_' + item.rel))
                  .replace('{ref}', item.ref.del)
              : App.i18n.t('malRelacion')
                  .replace('{Rel}', cap(App.i18n.t('rel_' + item.rel)))
                  .replace('{ref}', item.ref.del)
                  .replace('{objeto}', item.objetivo.el)
          });
        });
        sceneEl.appendChild(btn);
        buttons.push(btn);
      });
      return buttons;
    },
    onEnd: function (play) {
      play.progress.completed[currentLevel.id] = (play.progress.completed[currentLevel.id] || 0) + 1;
      play.save();
      $('#endSummary').textContent = '\n' + App.i18n.t('proximoNivel')
        .replace('{n}', Math.min(play.progress.roundsCompleted + 1, bank().niveles.length));
    }
  });

  $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../';
  });
  $('#btnConsigna').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(consignaEl.textContent);
  });
})();
