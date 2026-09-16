/* ============================================================
   Routime — Circle of Trust (amigo/compañero/conocido and
   recognizing manipulation, including money requests).
   Data in data.js (DATA.niveles). Shared modules in assets/js/.
   Mechanic: read a situation and choose the correct answer among
   3 options. Levels 1-2 classify the relationship; levels 3-4
   pick the healthy response to a manipulation attempt. Each item
   carries its own pista/explicacion (Socratic: hint on the first
   mistake, explanation on the second, same as social-safety).
   Round of 8. No punishment for a wrong answer.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'trust-circle';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var pantallaIntro = $('#pantallaIntro');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var situacionPictoEl = $('#situacionPicto');
  var situacionTextoEl = $('#situacionTexto');
  var optionsEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnEscucharExplicacion = $('#btnEscucharExplicacion');
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

  /* Determina el nivel según el progress: cada ronda completada, sube un nivel. */
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
    startScreen.classList.add('hidden');
    pantallaIntro.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    render();
  }

  function renderProgress() {
    progressFill.style.width = ((idx / banco().porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function render() {
    var item = items[idx];
    solved = false;
    attempts = 0;
    situacionPictoEl.textContent = item.picto;
    situacionTextoEl.textContent = item.situacion;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';

    var opciones = App.utils.shuffle(item.opciones.map(function (opt, i) {
      return { texto: opt, isCorrect: i === item.correcta };
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

  /* Each item carries its own pista/explicacion (unlike a generic
     reused string): the hint and explanation are specific to the
     relationship or manipulation case being shown. */
  function showHint(item) {
    explicacionEl.textContent = item.pista;
    explicacionWrap.classList.remove('hidden');
  }

  function showExplanation(item) {
    explicacionEl.textContent = item.explicacion;
    explicacionWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect, item) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(item);
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
        showHint(item);
      } else {
        showExplanation(item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$('#opciones .btn-opcion'), explicacionWrap);
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
  btnListen.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].situacion);
  });
  btnNext.addEventListener('click', siguiente);
  btnEscucharExplicacion.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(explicacionEl.textContent);
  });
  $('#btnPlay').addEventListener('click', function () {
    startScreen.classList.add('hidden');
    pantallaIntro.classList.remove('hidden');
  });
  $('#btnContinuarIntro').addEventListener('click', function () { startGame(); });
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    pantallaIntro.classList.add('hidden');
    startScreen.classList.remove('hidden');
    renderStars();
  });

  renderStars();
})();
