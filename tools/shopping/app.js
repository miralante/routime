/* ============================================================
   Routime — La Compra (AVD instrumental: supermercado y lista
   de la compra)
   Dos actividades: secciones del súper y lista de la compra.
   Cada una tiene sus propios niveles internos que se auto-seleccionan
   según el progress guardado, sin mostrar selección de nivel.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'la-compra';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var screenGameSections = $('#pantallaJuegoSecciones');
  var screenGameList = $('#pantallaJuegoLista');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');

  /* Progreso persistente (un contador de estrellas compartido) */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.roundsCompletedSecciones) progress.roundsCompletedSecciones = 0;
  if (!progress.roundsCompletedLista) progress.roundsCompletedLista = 0;

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; }
  });
  var save = glue.save, renderStars = glue.paintStars;
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function hideAll() {
    [startScreen, gameScreen, screenGameSections, screenGameList, endScreen].forEach(function (p) {
      if (p) p.classList.add('hidden');
    });
  }

  /* ================= Activity 1: Which section? ================= */
  var levelS = null;
  var itemsS = [];
  var idxS = 0;
  var resueltoS = false;
  var attemptsS = 0;

  var itemPictoSEl = $('#itemPictoSecciones');
  var itemWordSEl = $('#itemPalabraSecciones');
  var boxesSEl = $('#cajasSecciones');
  var feedbackSEl = $('#feedbackSecciones');
  var explanationSWrap = $('#explanationSeccionesWrap');
  var explanationSEl = $('#explanationSecciones');
  var progressSFill = $('#progressSeccionesFill');
  var progressSText = $('#progressSeccionesText');
  var btnNextSections = $('#btnSiguienteSecciones');

  function nivelSegunProgresoS() {
    var levels = bank().secciones.niveles;
    var idx = Math.min(progress.roundsCompletedSecciones, levels.length - 1);
    return levels[idx];
  }

  function startSections() {
    levelS = nivelSegunProgresoS();
    itemsS = App.utils.shuffle(levelS.items).slice(0, bank().secciones.porRonda);
    idxS = 0;
    resueltoS = false;
    hideAll();
    gameScreen.classList.remove('hidden'); screenGameSections.classList.remove('hidden');
    renderSections();
  }

  function paintProgressS() {
    var perRound = bank().secciones.porRonda;
    progressSFill.style.width = ((idxS / perRound) * 100) + '%';
    progressSText.textContent = '';
  }

  function renderSections() {
    var item = itemsS[idxS];
    resueltoS = false;
    attemptsS = 0;
    feedbackSEl.textContent = '';
    feedbackSEl.className = 'feedback';
    explanationSWrap.classList.add('hidden');
    explanationSEl.textContent = '';
    if (btnNextSections) btnNextSections.classList.add('hidden');

    itemPictoSEl.textContent = item.picto;
    itemWordSEl.textContent = item.palabra;

    boxesSEl.innerHTML = '';
    App.utils.shuffle(levelS.categorias).forEach(function (categoria) {
      var row = document.createElement('div');
      row.className = 'row-caja';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn caja';
      btn.textContent = categoria;
      btn.addEventListener('click', function () { answerSections(btn, categoria === item.categoria, item); });

      var btnAudio = document.createElement('button');
      btnAudio.type = 'button';
      btnAudio.className = 'btn btn-audio';
      btnAudio.textContent = '🔊';
      btnAudio.setAttribute('aria-label', App.i18n.t('escucharCategoria').replace('{categoria}', categoria));
      btnAudio.addEventListener('click', function () { if (false && App.tts && App.tts.speak) App.tts.speak(categoria); });

      row.appendChild(btn);
      row.appendChild(btnAudio);
      boxesSEl.appendChild(row);
    });

    paintProgressS();
    renderStars();
  }

  function showExplanationS(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.categoria + '.';
    explanationSEl.textContent = text;
    explanationSWrap.classList.remove('hidden');
  }

  function answerSections(btn, isCorrect, item) {
    if (resueltoS) return;
    if (isCorrect) {
      showExplanationS(isCorrect, item);
      resueltoS = true;
      btn.classList.add('correcta');
      App.utils.$$('.caja', boxesSEl).forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackSEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      renderStars();
      if (btnNextSections) {
        btnNextSections.classList.remove('hidden');
        btnNextSections.focus();
      }
    } else {
      attemptsS += 1;
      var answerAfterHint = attemptsS > 1;
      explanationSEl.textContent = App.i18n.t('pista');
        explanationSWrap.classList.remove('hidden');
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackSEl);
      App.feedback.lockUntilAck(App.utils.$$('.caja', boxesSEl), explanationSWrap, function () { if (answerAfterHint) showExplanationS(isCorrect, item); });
    }
  }

  function nextSections() {
    idxS += 1;
    if (idxS >= bank().secciones.porRonda) {
      finishSections();
    } else {
      renderSections();
    }
  }

  function finishSections() {
    progress.roundsCompletedSecciones += 1;
    save();
    hideAll();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompletedSecciones + 1, bank().secciones.niveles.length));
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ================= Activity 2: mi lista de la compra ================= */
  var levelL = null;
  var itemsL = [];
  var idxL = 0;
  var resueltoL = false;
  var attemptsL = 0;
  var listsEl = {};

  var itemPictoLEl = $('#itemPictoLista');
  var itemWordLEl = $('#itemPalabraLista');
  var listsDayEl = $('#listasDia');
  var feedbackLEl = $('#feedbackLista');
  var explanationLWrap = $('#explanationListaWrap');
  var explanationLEl = $('#explanationLista');
  var progressLFill = $('#progressListaFill');
  var progressLText = $('#progressListaText');
  var btnNextList = $('#btnSiguienteLista');

  function nivelSegunProgresoL() {
    var levels = bank().lista.niveles;
    var idx = Math.min(progress.roundsCompletedLista, levels.length - 1);
    return levels[idx];
  }

  function paintColumnsEmpty() {
    listsDayEl.innerHTML = '';
    listsEl = {};
    bank().lista.momentos.forEach(function (timeOfDay) {
      var column = document.createElement('div');
      column.className = 'column-dia';

      var btnBox = document.createElement('button');
      btnBox.type = 'button';
      btnBox.className = 'btn caja';
      btnBox.textContent = timeOfDay;
      btnBox.addEventListener('click', function () {
        answerList(btnBox, timeOfDay === itemsL[idxL].timeOfDay, itemsL[idxL]);
      });

      var btnAudio = document.createElement('button');
      btnAudio.type = 'button';
      btnAudio.className = 'btn btn-audio';
      btnAudio.textContent = '🔊';
      btnAudio.setAttribute('aria-label', App.i18n.t('escucharMomento').replace('{timeOfDay}', timeOfDay));
      btnAudio.addEventListener('click', function () { if (false && App.tts && App.tts.speak) App.tts.speak(timeOfDay); });

      var row = document.createElement('div');
      row.className = 'row-caja';
      row.appendChild(btnBox);
      row.appendChild(btnAudio);

      var list = document.createElement('ul');
      list.className = 'tasks-list';

      column.appendChild(row);
      column.appendChild(list);
      listsDayEl.appendChild(column);
      listsEl[timeOfDay] = { lista: list, boton: btnBox };
    });
  }

  function startList() {
    levelL = nivelSegunProgresoL();
    itemsL = App.utils.shuffle(levelL.items).slice(0, bank().lista.porRonda);
    idxL = 0;
    resueltoL = false;
    hideAll();
    gameScreen.classList.remove('hidden'); screenGameList.classList.remove('hidden');
    paintColumnsEmpty();
    renderList();
  }

  function paintProgressL() {
    var perRound = bank().lista.porRonda;
    progressLFill.style.width = ((idxL / perRound) * 100) + '%';
    progressLText.textContent = '';
  }

  function renderList() {
    var item = itemsL[idxL];
    resueltoL = false;
    attemptsL = 0;
    feedbackLEl.textContent = '';
    feedbackLEl.className = 'feedback';
    explanationLWrap.classList.add('hidden');
    explanationLEl.textContent = '';
    if (btnNextList) btnNextList.classList.add('hidden');

    itemPictoLEl.textContent = item.picto;
    itemWordLEl.textContent = item.palabra;
    App.utils.$$('.btn.caja', listsDayEl).forEach(function (b) {
      b.disabled = false;
      b.classList.remove('animo', 'correcta');
    });

    if (false && App.tts && App.tts.speak) App.tts.speak(item.palabra);
    paintProgressL();
    renderStars();
  }

  function showExplanationL(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.timeOfDay + '.';
    explanationLEl.textContent = text;
    explanationLWrap.classList.remove('hidden');
  }

  function addAList(item) {
    var destino = listsEl[item.timeOfDay];
    var li = document.createElement('li');
    li.textContent = item.picto + ' ' + item.palabra;
    destino.lista.appendChild(li);
  }

  function answerList(btn, isCorrect, item) {
    if (resueltoL) return;
    if (isCorrect) {
      showExplanationL(isCorrect, item);
      resueltoL = true;
      addAList(item);
      App.utils.$$('.btn.caja', listsDayEl).forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackLEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      renderStars();
      if (btnNextList) {
        btnNextList.classList.remove('hidden');
        btnNextList.focus();
      }
    } else {
      attemptsL += 1;
      var answerAfterHint = attemptsL > 1;
      explanationLEl.textContent = App.i18n.t('pista');
        explanationLWrap.classList.remove('hidden');
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackLEl);
      App.feedback.lockUntilAck(App.utils.$$('.btn.caja', listsDayEl), explanationLWrap, function () { if (answerAfterHint) showExplanationL(isCorrect, item); });
    }
  }

  function nextList() {
    idxL += 1;
    if (idxL >= bank().lista.porRonda) {
      finishList();
    } else {
      renderList();
    }
  }

  function finishList() {
    progress.roundsCompletedLista += 1;
    save();
    hideAll();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompletedLista + 1, bank().lista.niveles.length));
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  // Start screen: two sub-activity cards
  $('#tarjetaSecciones').addEventListener('click', startSections);
  $('#tarjetaLista').addEventListener('click', startList);

  if (btnNextSections) btnNextSections.addEventListener('click', nextSections);
  if (btnNextList) btnNextList.addEventListener('click', nextList);

  $('#btnRepeat').addEventListener('click', function () {
    // repeats the last activity
    if (activityCurrent === 'secciones') startSections();
    else startList();
  });

  $('#btnMenu').addEventListener('click', function () {
    hideAll();
    startScreen.classList.remove('hidden');
    renderStars();
  });

  var activityCurrent = null;

  renderStars();
  startScreen.classList.remove('hidden');
})();
