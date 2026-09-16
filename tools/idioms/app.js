/* ============================================================
   Routime — Dichos de España (lógica)
   Datos en data.js (const DATA). Módulos compartidos en assets/js/.
   Mecánica: ronda de 10 preguntas con opción múltiple.
   El error nunca se castiga: se anima a reintentar.
   ============================================================ */
(function () {
  'use strict';

  var CONFIG = {
    toolId: 'dichos',
    porRonda: 10
  };

  var $ = App.utils.$;

  /* Elementos */
  var textEl = $('#textoPregunta');
  var optionsEl = $('#options');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnListen = $('#btnListen');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var resumenFinal = $('#resumenFinal');

  /* Progreso persistente (se conserva al cerrar el navegador) */
  var progress = App.storage.get(CONFIG.toolId);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.rounds !== 'number') progress.rounds = 0;

  /* Current round state */
  var items = [];
  var idx = 0;
  var roundHits = 0;
  var solved = false;
  var attempts = 0;

  function save() {
    App.storage.set(CONFIG.toolId, progress);
  }

  function renderStars() {
    starsEl.textContent = '⭐ ' + progress.stars;
  }

  function renderProgress() {
    progressFill.style.width = ((idx / CONFIG.porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function startRound() {
    var banco = DATA[App.i18n.locale()] || DATA.es;
    items = App.utils.shuffle(banco).slice(0, CONFIG.porRonda);
    idx = 0;
    roundHits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    render();
  }

  function render() {
    var item = items[idx];
    solved = false;
    attempts = 0;
    textEl.textContent = item.textContent;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';

    var options = App.utils.shuffle(item.options.map(function (opt, i) {
      return { text: opt, isCorrect: i === item.correct };
    }));

    options.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.textContent;
      btn.addEventListener('click', function () {
        answer(btn, op.isCorrect, item);
      });
      optionsEl.appendChild(btn);
    });

    renderProgress();
    renderStars();
  }

  function showExplanation(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correct] +
        App.i18n.t('explicacionIncorrectaB') + '.';
    explicacionEl.textContent = text;
    explicacionWrap.classList.remove('hidden');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is pointed back to the hint already on screen. Only
     on the second mistake is the correct answer explained
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
      App.utils.$('#options .btn-opcion').forEach(function (b) {
        b.disabled = true;
      });
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      save();
      renderStars();
      btnNext.classList.remove('hidden');
      btnNext.focus();
    } else {
      /* Encouragement, never punishment: can try again */
      attempts += 1;
      if (attempts === 1) {
        showHint(item);
      } else {
        showExplanation(isCorrect, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$('#options .btn-opcion'), explicacionWrap);
    }
  }

  function siguiente() {
    idx += 1;
    if (idx >= CONFIG.porRonda) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    progress.rounds += 1;
    save();
    renderProgress();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    resumenFinal.textContent = '';
$('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  btnListen.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].textContent);
  });
  btnNext.addEventListener('click', siguiente);
  $('#btnRepeat').addEventListener('click', startRound);
})();

