/* ============================================================
   Routime — ¿Qué necesito? (autonomía: planificación)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: leer una tarea u objetivo y select qué hace falta
   preparar antes, entre 3 opciones. Ronda de 8. El error nunca se
   castiga.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'que-necesito';
  var $ = App.utils.$;

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var textoPreguntaEl = $('#textoPregunta');
  var optionsEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnListen = $('#btnListen');
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
  var items = [];
  var idx = 0;
  var roundHits = 0;
  var solved = false;
  var attempts = 0;

  function guardar() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  /* Determina el nivel según el progress: cada ronda completada,
     sube un nivel. */
  function levelBasedOnProgress() {
    var idxN = Math.min(progress.roundsCompleted, banco().niveles.length - 1);
    return banco().niveles[idxN];
  }

  /* Muestra la dificultad actual (etiqueta del nivel). */
  function renderLevel() {
    if (levelEl) {
      levelEl.textContent = currentLevel.nombre;
    }
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    items = App.utils.shuffle(currentLevel.items).slice(0, banco().porRonda);
    idx = 0;
    roundHits = 0;
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

  function render() {
    var item = items[idx];
    solved = false;
    attempts = 0;
    textoPreguntaEl.textContent = item.textContent;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';

    var opciones = App.utils.shuffle(item.options.map(function (opt, i) {
      return { texto: opt, isCorrect: i === item.correct };
    }));

    opciones.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { answer(btn, op.isCorrect, item); });
      optionsEl.appendChild(btn);
    });

    renderProgress();
    renderStars();
  }

  function showExplanation(isCorrect, item) {
    var texto = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correct] + '.';
    explicacionEl.textContent = texto;
    explicacionWrap.classList.remove('hidden');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is pointed back to the task already on screen. Only
     on the second mistake is what was needed explained
     (showExplanation). */
  function showHint(item) {
    explicacionEl.textContent = App.i18n.t('pista') + '"' + item.textContent + '"';
    explicacionWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect, item) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(isCorrect, item);
      solved = true;
      btn.classList.add('correcta');
      App.utils.$$('#opciones .btn-opcion').forEach(function (b) { b.disabled = true; });
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
        showHint(item);
      } else {
        showExplanation(isCorrect, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('#opciones .btn-opcion'), explicacionWrap);
    }
  }

  function next() {
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
  btnListen.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].textContent);
  });
  btnNext.addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../site/index.html';
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();

