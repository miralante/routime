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
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'donde-esta';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var consignaEl = $('#consigna');
  var escenaEl = $('#escena');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelEl = $('#dificultad');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Round state */
  var currentLevel = null;
  var idx = 0;
  var roundHits = 0;
  var solved = false;
  var attempts = 0;
  var item = null;          /* { rel, ref, objetivo, distractor, eje } */
  var botonObjetivo = null;

  function guardar() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* Determina el nivel según el progress: cada ronda completada,
     sube un nivel. */
  function levelBasedOnProgress() {
    var idxN = Math.min(progress.roundsCompleted, banco().niveles.length - 1);
    return banco().niveles[idxN];
  }

  /* Muestra la dificultad actual (eje del nivel: horizontal/vertical). */
  function renderLevel() {
    if (levelEl) {
      levelEl.textContent = currentLevel.relaciones.length + ' ' +
        App.i18n.t(currentLevel.relaciones.length === 1 ? 'relacion' : 'relaciones');
    }
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    idx = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    render();
  }

  function renderProgress() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idx / porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  /* Generates an item: the level's relation + 3 distinct objects.
     Placement: the reference is always in the center; the target on
     the side the relation says; the distractor on the opposite side. */
  function generarItem() {
    var rel = App.utils.shuffle(currentLevel.relaciones)[0];
    var eje = (rel === 'izq' || rel === 'der') ? 'fila' : 'columna';
    var tres = App.utils.shuffle(banco().objetos).slice(0, 3);
    return { rel: rel, eje: eje, ref: tres[0], objetivo: tres[1], distractor: tres[2] };
  }

  /* Orden visual: fila → izquierda-centro-derecha; columna → arriba-
     centro-abajo. 'izq' y 'enc' ponen el objetivo primero. */
  function ordenVisual() {
    var primero = (item.rel === 'izq' || item.rel === 'enc');
    return primero
      ? [item.objetivo, item.ref, item.distractor]
      : [item.distractor, item.ref, item.objetivo];
  }

  function render() {
    item = generarItem();
    solved = false;
    attempts = 0;
    botonObjetivo = null;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');

    var consigna = App.i18n.t('consigna')
      .replace('{rel}', App.i18n.t('rel_' + item.rel))
      .replace('{ref}', item.ref.del);
    consignaEl.textContent = consigna;

    escenaEl.className = 'escena ' + (item.eje === 'fila' ? 'en-fila' : 'en-columna');
    escenaEl.innerHTML = '';
    ordenVisual().forEach(function (obj) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'objeto';
      btn.textContent = obj.picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaObjeto').replace('{objeto}', obj.el));
      if (obj === item.objetivo) botonObjetivo = btn;
      btn.addEventListener('click', function () { answer(btn, obj === item.objetivo); });
      escenaEl.appendChild(btn);
    });

    renderProgress();
    renderStars();
  }

  function answer(btn, isCorrect) {
    if (solved) return;
    if (isCorrect) {
      solved = true;
      btn.classList.add('correcta');
      App.utils.$$('.objeto', escenaEl).forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      explicacionEl.textContent = App.i18n.t('okRelacion')
        .replace('{objeto}', cap(item.objetivo.el))
        .replace('{rel}', App.i18n.t('rel_' + item.rel))
        .replace('{ref}', item.ref.del);
      explicacionWrap.classList.remove('hidden');
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      guardar();
      renderStars();
      btnNext.classList.remove('hidden');
      btnNext.focus();
    } else {
      attempts += 1;
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      if (attempts === 1) {
        /* Regla 12: primer fallo → estrategia, nunca la respuesta */
        explicacionEl.textContent = App.i18n.t('pista')
          .replace('{ref}', item.ref.el)
          .replace('{mira}', App.i18n.t('mira_' + item.rel));
      } else {
        /* Segundo fallo → se marca el objetivo y se explica */
        explicacionEl.textContent = App.i18n.t('malRelacion')
          .replace('{Rel}', cap(App.i18n.t('rel_' + item.rel)))
          .replace('{ref}', item.ref.del)
          .replace('{objeto}', item.objetivo.el);
        if (botonObjetivo) botonObjetivo.classList.add('sugerida');
      }
      explicacionWrap.classList.remove('hidden');
      App.feedback.lockUntilAck(App.utils.$$('.objeto', escenaEl), explicacionWrap);
    }
  }

  function siguiente() {
    idx += 1;
    if (idx >= banco().porRonda) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    progress.roundsCompleted += 1;
    guardar();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#resumenFinal').textContent += '\n' + App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompleted + 1, banco().niveles.length));
$('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnNext.addEventListener('click', siguiente);
  $('#btnPlay').addEventListener('click', function () { startGame(); });
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    renderStars();
  });
  $('#btnConsigna').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(consignaEl.textContent);
  });

  renderStars();
})();

