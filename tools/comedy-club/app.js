/* ============================================================
   Routime — Chistes (lógica)
   Datos en data.js (const DATA). Módulos compartidos en assets/js/.
   Mecánica: ronda de 8 chistes con opción múltiple. La pista del
   primer fallo es la de la opción elegida (item.pistas[index]); la
   explicación solo aparece al acertar o tras el segundo fallo.
   El error nunca se castiga: se anima a reintentar.
   ============================================================ */
(function () {
  'use strict';

  var CONFIG = {
    toolId: 'comedy-club',
    porRonda: 8
  };

  var $ = App.utils.$;

  /* Elementos */
  var textEl = $('#textoPregunta');
  var optionsEl = $('#options');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
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

  /* Estado de la ronda actual */
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
    progressText.textContent = (idx + 1) + ' / ' + CONFIG.porRonda;
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
    textEl.textContent = item.text;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';

    var options = App.utils.shuffle(item.options.map(function (opt, i) {
      return { text: opt, isCorrect: i === item.correct, index: i };
    }));

    options.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.text;
      btn.addEventListener('click', function () {
        answer(btn, op.isCorrect, item, op.index);
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

  /* Método socrático: en el primer fallo no se da la respuesta. La pista
     es la de la opción elegida: por qué esa opción no hace gracia y una
     pista hacia la correcta. */
  function showHint(item, index) {
    explicacionEl.textContent = '🤔 ' + item.pistas[index];
    explicacionWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect, item, index) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(true, item);
      solved = true;
      btn.classList.add('correcta');
      App.utils.$$('#options .btn-opcion').forEach(function (b) {
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
      /* Ánimo, nunca castigo: se puede volver a intentar */
      attempts += 1;
      var respuestaTrasPista = attempts > 1;
      showHint(item, index);
      /* La explicación aparece solo después de leer la pista. */
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('#options .btn-opcion'), explicacionWrap, function () {
        if (respuestaTrasPista) showExplanation(false, item);
      });
    }
  }

  function next() {
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
    resumenFinal.textContent = App.i18n.t('resumenFinal')
      .replace('{n}', roundHits).replace('{total}', progress.stars);
    $('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Eventos */
  btnNext.addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', startRound);
  renderStars();
  startRound();
})();
