/* ============================================================
   Routime — Comida Sana (autonomía/hogar)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: aparece un alimento con picto y hay que tocar la caja
   "Cada día" o "De vez en cuando". Ronda de 10 alimentos por nivel.
   Enfoque de moderación (nunca "alimento malo"): la explicación de
   cada acierto añade una frase corta y positiva sobre cómo te sienta
   ese alimento en el cuerpo (item.consecuencia).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'comida-sana';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var itemPictoEl = $('#itemPicto');
  var itemPalabraEl = $('#itemPalabra');
  var cajasEl = $('#cajas');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnListen = $('#btnListen');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

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

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }


    /* Determina el nivel según el progress: cada ronda completada, sube un nivel. */
  function levelBasedOnProgress() {
    var idxN = Math.min(progress.roundsCompleted, banco().niveles.length - 1);
    return banco().niveles[idxN];
  }

  /* Muestra la dificultad current (etiqueta del nivel). */
  function renderLevel() {
    if (levelEl) {
      levelEl.textContent = currentLevel.name;
    }
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
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
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');

    itemPictoEl.textContent = item.picto;
    itemPalabraEl.textContent = item.palabra;

    cajasEl.innerHTML = '';
    App.utils.shuffle(currentLevel.categorias).forEach(function (categoria) {
      var row = document.createElement('div');
      row.className = 'row-caja';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn caja';
      btn.textContent = categoria;
      btn.addEventListener('click', function () { answer(btn, categoria === item.categoria, item); });

      var btnAudio = document.createElement('button');
      btnAudio.type = 'button';
      btnAudio.className = 'btn btn-audio';
      btnAudio.textContent = '🔊';
      btnAudio.setAttribute('aria-label', App.i18n.t('escucharCategoria').replace('{categoria}', categoria));
      btnAudio.addEventListener('click', function () { if (false && App.tts && App.tts.speak) App.tts.speak(categoria); });

      row.appendChild(btn);
      row.appendChild(btnAudio);
      cajasEl.appendChild(row);
    });

    renderProgress();
    renderStars();
  }

  function showExplanation(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('acierto') + ' ' + item.consecuencia
      : App.i18n.t('incorrectoA') + item.categoria + '. ' + item.consecuencia;
    explicacionEl.textContent = text;
    explicacionWrap.classList.remove('hidden');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is encouraged to think again. Only on the second
     mistake is the correct group stated (showExplanation). */
  function showHint() {
    explicacionEl.textContent = App.i18n.t('pista');
    explicacionWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect, item) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(isCorrect, item);
      solved = true;
      btn.classList.add('correcta');
      App.utils.$$('.caja', cajasEl).forEach(function (b) { b.disabled = true; });
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
      if (attempts === 1) {
        showHint();
      } else {
        showExplanation(isCorrect, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('.caja', cajasEl), explicacionWrap);
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
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnListen.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].palabra);
  });
  btnNext.addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnOtherLevel').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    renderLevels();
    startScreen.classList.remove('hidden');
  });

  renderStars();
})();
