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
  var banco = DATA[App.i18n.locale()] || DATA.es;

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var etapaTextoEl = $('#etapaTexto');
  var objetosEl = $('#objetos');
  var zonaBotonEl = $('#zonaBoton');
  var zonaPreguntaEl = $('#zonaPregunta');
  var optionsEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnReady = $('#btnReady');
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
  var escenaActual = [];   /* objetos de la escena actual */
  var faltante = null;
  var attempts = 0;

  function guardar() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  /* Determina el nivel según el progress: cada ronda completada,
     sube un nivel. */
  function levelBasedOnProgress() {
    var idxN = Math.min(progress.roundsCompleted, banco.niveles.length - 1);
    return banco.niveles[idxN];
  }

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
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    render();
  }

  function renderProgress() {
    progressFill.style.width = ((idx / banco.porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function render() {
    solved = false;
    faltante = null;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');
    zonaPreguntaEl.classList.add('hidden');
    zonaBotonEl.classList.remove('hidden');
    etapaTextoEl.textContent = App.i18n.t('etapaRecuerda');

    escenaActual = App.utils.shuffle(banco.pool).slice(0, currentLevel.cantidad);
    pintarObjetos(escenaActual);

    renderProgress();
    renderStars();
  }

  function pintarObjetos(lista) {
    objetosEl.innerHTML = '';
    lista.forEach(function (picto) {
      var div = document.createElement('div');
      div.className = 'objeto' + (picto ? '' : ' vacio');
      div.textContent = picto || '';
      objetosEl.appendChild(div);
    });
  }

  function ocultarUno() {
    attempts = 0;
    var i = Math.floor(Math.random() * escenaActual.length);
    faltante = escenaActual[i];
    var conHueco = escenaActual.slice();
    conHueco[i] = null;
    etapaTextoEl.textContent = App.i18n.t('pregunta');
    pintarObjetos(conHueco);
    zonaBotonEl.classList.add('hidden');
    zonaPreguntaEl.classList.remove('hidden');

    var distractores = App.utils.shuffle(
      banco.pool.filter(function (p) { return escenaActual.indexOf(p) === -1; })
    ).slice(0, 2);
    var opciones = App.utils.shuffle(
      [faltante].concat(distractores).map(function (p) {
        return { picto: p, isCorrect: p === faltante };
      })
    );

    optionsEl.innerHTML = '';
    opciones.forEach(function (op) {
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
    var texto = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + faltante;
    explicacionEl.textContent = texto;
    explicacionWrap.classList.remove('hidden');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is encouraged to think again. Only on the second
     mistake is what was missing stated (showExplanation). */
  function showHint() {
    explicacionEl.textContent = App.i18n.t('pista');
    explicacionWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(isCorrect);
      solved = true;
      btn.classList.add('correcta');
      App.utils.$('#opciones .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      guardar();
      renderStars();
      btnNext.classList.remove('hidden');
      btnNext.focus();
    } else {
      attempts += 1;
      if (attempts === 1) {
        showHint();
      } else {
        showExplanation(isCorrect);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$('#opciones .btn-opcion'), explicacionWrap);
    }
  }

  function siguiente() {
    idx += 1;
    if (idx >= banco.porRonda) {
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
      .replace('{n}', Math.min(progress.roundsCompleted + 1, banco.niveles.length));
$('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  btnReady.addEventListener('click', ocultarUno);
  btnNext.addEventListener('click', siguiente);
  $('#btnPlay').addEventListener('click', function () { startGame(); });
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    renderStars();
  });

  renderStars();
})();

