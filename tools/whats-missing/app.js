/* ============================================================
   Routime — ¿Qué falta? (memoria visual a corto plazo)
   Datos en data.js (DATA.pool, DATA.niveles). Módulos compartidos
   en assets/js/. Mecánica: memorizar unos objetos a su ritmo (sin
   cronómetro), luego decir cuál ha desaparecido. Ronda de 6 escenas.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'que-falta';
  var $ = App.utils.$;
  var bank = DATA[App.i18n.locale()] || DATA.es;

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var stageTextEl = $('#etapaTexto');
  var objetosEl = $('#objetos');
  var zonaBotonEl = $('#zonaBoton');
  var zoneQuestionEl = $('#zonaPregunta');
  var optionsEl = $('#options');
  var feedbackEl = $('#feedback');
  var explanationWrap = $('#explanationWrap');
  var explanationEl = $('#explanation');
  var btnReady = $('#btnListo');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelEl = $('#level');

  /* Persistent progress */
  var progress = App.storage.getWithStars(TOOL_ID);
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Round state */
  var currentLevel = null;
  var idx = 0;
  var roundHits = 0;
  var solved = false;
  var sceneCurrent = [];   /* objetos de la escena actual */
  var faltante = null;
  var attempts = 0;

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; },
    levels: function () { return bank.niveles; }
  });
  var save = glue.save;

  var renderStars = glue.paintStars, levelBasedOnProgress = glue.levelFromProgress;

  /* Determina el nivel según el progress: cada ronda completada,
     sube un nivel. */

  /* Muestra la dificultad actual (número de objetos a recordar). */
  function renderLevel() {
    if (levelEl) {
      var n = currentLevel.cantidad;
      levelEl.textContent = n + ' ' + App.i18n.t(n === 1 ? 'objeto' : 'objetos');
    }
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    idx = 0;
    roundHits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    render();
  }

  function renderProgress() {
    progressFill.style.width = ((idx / bank.porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function render() {
    solved = false;
    faltante = null;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
    btnNext.classList.add('hidden');
    btnReady.classList.remove('hidden');
    zoneQuestionEl.classList.add('hidden');
    zonaBotonEl.classList.remove('hidden');
    stageTextEl.textContent = App.i18n.t('etapaRecuerda');

    sceneCurrent = App.utils.shuffle(bank.pool).slice(0, currentLevel.cantidad);
    pintarObjetos(sceneCurrent);

    renderProgress();
    renderStars();
  }

  function pintarObjetos(list) {
    objetosEl.innerHTML = '';
    list.forEach(function (picto) {
      var div = document.createElement('div');
      div.className = 'objeto' + (picto ? '' : ' vacio');
      div.textContent = picto || '';
      objetosEl.appendChild(div);
    });
  }

  function ocultarUno() {
    attempts = 0;
    var i = Math.floor(Math.random() * sceneCurrent.length);
    faltante = sceneCurrent[i];
    var alongGap = sceneCurrent.slice();
    alongGap[i] = null;
    stageTextEl.textContent = App.i18n.t('pregunta');
    pintarObjetos(alongGap);
    btnReady.classList.add('hidden');
    zonaBotonEl.classList.add('hidden');
    zoneQuestionEl.classList.remove('hidden');

    var distractores = App.utils.shuffle(
      bank.pool.filter(function (p) { return sceneCurrent.indexOf(p) === -1; })
    ).slice(0, 2);
    var options = App.utils.shuffle(
      [faltante].concat(distractores).map(function (p) {
        return { picto: p, isCorrect: p === faltante };
      })
    );

    optionsEl.innerHTML = '';
    options.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion opcion-picto';
      btn.textContent = op.picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaObjeto'));
      btn.addEventListener('click', function () { answer(btn, op.isCorrect); });
      optionsEl.appendChild(btn);
    });
  }

  function showExplanation(isCorrect) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + faltante;
    explanationEl.textContent = text;
    explanationWrap.classList.remove('hidden');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is encouraged to think again. Only on the second
     mistake is what was missing stated (showExplanation). */
  function showHint() {
    explanationEl.textContent = App.i18n.t('pista');
    explanationWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(isCorrect);
      solved = true;
      btn.classList.add('correcta');
      App.utils.$$('#opciones .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      save();
      renderStars();
      btnNext.classList.remove('hidden');
      btnNext.focus();
    } else {
      attempts += 1;
      var answerAfterHint = attempts > 1;
      showHint();
      /* Reveal the explanation only after the hint is acknowledged. */
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('#options .btn-opcion'), explanationWrap, function () { if (answerAfterHint) showExplanation(isCorrect); });
    }
  }

  function next() {
    idx += 1;
    if (idx >= bank.porRonda) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    progress.roundsCompleted += 1;
    save();
    App.utils.showEnd(gameScreen, endScreen);
    $('#endSummary').textContent = '';
    $('#endSummary').textContent += '\n' + App.i18n.t('proximoNivel', { n: Math.min(progress.roundsCompleted + 1, bank.niveles.length) });
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  btnReady.addEventListener('click', ocultarUno);
  btnNext.addEventListener('click', next);
  $('#repeatBtn').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();

