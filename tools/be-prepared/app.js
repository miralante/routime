/* ============================================================
   Routime — Antes de la Emergencia (autonomía: lo que se
   puede tener en casa con la familia, antes de que pase algo).
   Datos en data.js (DATA.saber, DATA.checklist). Dos actividades
   elegibles desde un menú (regla 10: una acción principal por
   pantalla):
   - "¿Lo tengo ya?": quiz de 3 options (motor de Situations) que
     trabaja cosas de prevención (112 escrito, dirección visible,
     detector de humo, llaves de luz/gas, pastillas fuera de
     alcance, puerta que se abre desde dentro). La opción
     correcta es la que se enseña en prevención; las otras son
     options reales pero menos seguras.
   - "Mi lista en casa": checklist tipo task-list con 8 cosas;
     no hay aciertos/fallos — la actividad es de REVISIÓN
     familiar, no de examen. Al final se listan las marcadas y
     las que faltan, para hacerlo con la familia en casa.
   Sin niveles (regla 13 no aplica: cada ronda ya mezcla
   dificultad a propósito, como contraste didáctico, no como
   progresión).
   Pista socrática en el primer fallo (regla 12).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'be-prepared';
  var $ = App.utils.$;

  var menuScreen = $('#menuScreen');
  var screenKnowledge = $('#pantallaSaber');
  var screenChecklist = $('#pantallaChecklist');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completadoSaber) progress.completadoSaber = 0;
  if (!progress.completadoChecklist) progress.completadoChecklist = 0;
  if (!progress.checklistMarcado) progress.checklistMarcado = {};

  var activityCurrent = null; /* 'saber' | 'checklist' */

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; }
  });
  var save = glue.save, renderStars = glue.paintStars;
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function hideAll() {
    [menuScreen, screenKnowledge, screenChecklist, endScreen].forEach(function (p) {
      p.classList.add('hidden');
    });
  }

  function irMenu() {
    hideAll();
    renderMenu();
    menuScreen.classList.remove('hidden');
  }

  function renderMenu() {
    $('#marcaSaber').textContent = '';
    $('#marcaChecklist').textContent = '';
    renderStars();
  }

  /* ================= Actividad 1: ¿Lo tengo ya? ================= */
  var itemsKnowledge = [];
  var idxS = 0;
  var hitsS = 0;
  var resueltoS = false;
  var attemptsS = 0;

  var knowledgePictoEl = $('#saberPicto');
  var knowledgeTextEl = $('#saberTexto');
  var optionsSEl = $('#opcionesSaber');
  var feedbackSEl = $('#feedbackSaber');
  var explanationSWrap = $('#explicacionSaberWrap');
  var explanationSEl = $('#explicacionSaber');
  var progressSFill = $('#progressSaberFill');
  var progressSText = $('#progressSaberText');
  var btnNextKnow = $('#btnSiguienteSaber');

  function startKnowledge() {
    activityCurrent = 'saber';
    itemsKnowledge = App.utils.shuffle(bank().saber).slice(0, bank().porRonda);
    idxS = 0;
    hitsS = 0;
    hideAll();
    screenKnowledge.classList.remove('hidden');
    renderKnowledge();
  }

  function paintProgressS() {
    var perRound = bank().porRonda;
    progressSFill.style.width = ((idxS / perRound) * 100) + '%';
    progressSText.textContent = '';
  }

  function renderKnowledge() {
    var item = itemsKnowledge[idxS];
    resueltoS = false;
    attemptsS = 0;
    knowledgePictoEl.textContent = item.picto;
    knowledgeTextEl.textContent = item.pregunta;
    feedbackSEl.textContent = '';
    feedbackSEl.className = 'feedback';
    explanationSWrap.classList.add('hidden');
    explanationSEl.textContent = '';
    btnNextKnow.classList.add('hidden');
    optionsSEl.innerHTML = '';

    var options = App.utils.shuffle(item.options.map(function (opt, i) {
      return { text: opt, isCorrect: i === item.correcta };
    }));
    options.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.text;
      btn.addEventListener('click', function () { answerKnowledge(btn, op.isCorrect, item); });
      optionsSEl.appendChild(btn);
    });

    paintProgressS();
    renderStars();
  }

  function showExplanationS(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.';
    explanationSEl.textContent = text;
    explanationSWrap.classList.remove('hidden');
  }

  function answerKnowledge(btn, isCorrect, item) {
    if (resueltoS) return;
    if (isCorrect) {
      showExplanationS(isCorrect, item);
      resueltoS = true;
      btn.classList.add('correcta');
      App.utils.$$('#opcionesSaber .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackSEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      hitsS += 1;
      save();
      renderStars();
      btnNextKnow.classList.remove('hidden');
      btnNextKnow.focus();
    } else {
      attemptsS += 1;
      var answerAfterHint = attemptsS > 1;
      explanationSEl.textContent = App.i18n.t('pista') + '"' + item.pregunta + '"';
        explanationSWrap.classList.remove('hidden');
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackSEl);
      App.feedback.lockUntilAck(App.utils.$$('#opcionesSaber .btn-opcion'), explanationSWrap, function () { if (answerAfterHint) showExplanationS(isCorrect, item); });
    }
  }

  function nextKnow() {
    idxS += 1;
    if (idxS >= bank().porRonda) {
      finishKnowledge();
    } else {
      renderKnowledge();
    }
  }

  function finishKnowledge() {
    progress.completadoSaber += 1;
    save();
    hideAll();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ================= Actividad 2: mi lista en casa (checklist) ================= */
  var itemsChecklist = [];
  var idxC = 0;
  var hitsC = 0;
  var checklistEl = $('#checklist');
  var feedbackCEl = $('#feedbackChecklist');
  var progressCFill = $('#progressChecklistFill');
  var progressCText = $('#progressChecklistText');
  var checklistTitleEl = $('#checklistTitulo');

  function startChecklist() {
    activityCurrent = 'checklist';
    /* Deep-clone so we don't mutate the catalogue */
    itemsChecklist = bank().checklist.map(function (it) {
      return { id: it.id, picto: it.picto, name: it.name, marcado: !!progress.checklistMarcado[it.id] };
    });
    idxC = 0;
    hitsC = 0;
    hideAll();
    screenChecklist.classList.remove('hidden');
    renderChecklist();
  }

  function paintProgressC() {
    var total = itemsChecklist.length;
    progressCFill.style.width = ((idxC / total) * 100) + '%';
    progressCText.textContent = '';
  }

  function renderChecklist() {
    feedbackCEl.textContent = '';
    feedbackCEl.className = 'feedback';
    checklistTitleEl.textContent = App.i18n.t('checklistTitulo');

    checklistEl.innerHTML = '';
    itemsChecklist.forEach(function (it) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'checklist-item' + (it.marcado ? ' marcado' : '');
      btn.innerHTML = '<span class="check-picto" aria-hidden="true">' +
        (it.marcado ? '✅' : '⬜') + '</span>' +
        '<span class="check-name">' + it.name + '</span>';
      btn.setAttribute('aria-pressed', it.marcado ? 'true' : 'false');
      btn.addEventListener('click', function () { toggleChecklist(it, btn); });
      checklistEl.appendChild(btn);
    });

    paintProgressC();
    renderStars();
  }

  function toggleChecklist(item, btn) {
    item.marcado = !item.marcado;
    progress.checklistMarcado[item.id] = item.marcado;
    if (item.marcado) {
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      hitsC += 1;
      App.feedback.success(feedbackCEl);
    } else {
      /* No se resta, pero sí se actualiza el contador de progress */
    }
    save();
    /* Re-paint the single item without resetting scroll */
    btn.classList.toggle('marcado', item.marcado);
    btn.innerHTML = '<span class="check-picto" aria-hidden="true">' +
      (item.marcado ? '✅' : '⬜') + '</span>' +
      '<span class="check-name">' + item.name + '</span>';
    btn.setAttribute('aria-pressed', item.marcado ? 'true' : 'false');
    /* Count "checked" items as completed rounds */
    var marcados = itemsChecklist.filter(function (x) { return x.marcado; }).length;
    idxC = Math.min(marcados, itemsChecklist.length);
    paintProgressC();
    renderStars();
    if (marcados >= itemsChecklist.length) {
      setTimeout(finishChecklist, 700);
    }
  }

  function finishChecklist() {
    progress.completadoChecklist += 1;
    save();
    hideAll();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaSaber').addEventListener('click', startKnowledge);
  $('#tarjetaChecklist').addEventListener('click', startChecklist);
  $('#btnVolverSaber').addEventListener('click', irMenu);
  $('#btnVolverChecklist').addEventListener('click', irMenu);
  btnNextKnow.addEventListener('click', nextKnow);
  var btnListenExplanationKnowledge = $('#btnEscucharExplicacionSaber');
  if (btnListenExplanationKnowledge) btnListenExplanationKnowledge.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(explanationSEl.textContent);
  });
  var btnListenKnowledge = $('#btnEscucharSaber');
  if (btnListenKnowledge) btnListenKnowledge.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(itemsKnowledge[idxS].pregunta);
  });
  $('#btnRepeat').addEventListener('click', function () {
    if (activityCurrent === 'saber') startKnowledge();
    else startChecklist();
  });
  $('#btnVolverMenuFinal').addEventListener('click', irMenu);


  irMenu();
})();
