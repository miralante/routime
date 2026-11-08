/* ============================================================
   Routime — Emergencias (autonomía: reconocer una emergencia
   de verdad y practicar cómo pedir help)
   Datos en data.js (DATA.reconocer, DATA.llamadas, DATA.ascensor).
   Tres actividades elegibles desde un menú (regla 10: una acción
   principal por pantalla):
   - "¿Es una emergencia?": quiz de 3 options (motor de Situaciones)
     que mezcla emergencias reales con cosas que no lo son, para que
     el contraste enseñe a distinguir. Sin niveles: la mezcla de
     dificultad es a propósito (contraste didáctico), no progresión.
   - "Practica la llamada": ordenar 3 steps (motor de Lista de
     Tareas) siempre en el mismo orden — name, qué pasa, dónde
     estás — cambiando solo la emergencia descrita, para aprender la
     estructura y no un guion fijo.
   - "Atrapado en el ascensor": subactividad con escenario guiado de
     dos etapas (qué hacer y qué decir por el interfono). Es una
     emergencia con reglas propias, por eso vive aquí y no suelta
     en otra actividad.
   El error nunca se castiga (regla 5); pista socrática en el primer
   fallo (regla 12).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'emergencias';
  var $ = App.utils.$;

  var menuScreen = $('#menuScreen');
  var screenRecognize = $('#pantallaReconocer');
  var screenCall = $('#pantallaLlamada');
  var screenElevator = $('#pantallaAscensor');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completadoReconocer) progress.completadoReconocer = 0;
  if (!progress.completadoLlamada) progress.completadoLlamada = 0;
  if (!progress.completadoAscensor) progress.completadoAscensor = 0;

  var activityCurrent = null; /* 'reconocer' | 'llamada' | 'ascensor' */

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; }
  });
  var save = glue.save, renderStars = glue.paintStars;
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function hideAll() {
    [menuScreen, screenRecognize, screenCall, screenElevator, endScreen].forEach(function (p) {
      p.classList.add('hidden');
    });
  }

  function irMenu() {
    hideAll();
    renderMenu();
    menuScreen.classList.remove('hidden');
  }

  function renderMenu() {
    $('#marcaReconocer').textContent = '';
    $('#marcaLlamada').textContent = '';
    $('#marcaAscensor').textContent = '';
    renderStars();
  }

  /* ================= Actividad 1: ¿Es una emergencia? ================= */
  var itemsRecognize = [];
  var idxR = 0;
  var hitsR = 0;
  var resueltoR = false;
  var attemptsR = 0;

  var situationPictoEl = $('#situacionPicto');
  var situationTextEl = $('#situacionTexto');
  var optionsREl = $('#opcionesReconocer');
  var feedbackREl = $('#feedbackReconocer');
  var explanationRWrap = $('#explicacionReconocerWrap');
  var explanationREl = $('#explicacionReconocer');
  var progressRFill = $('#progressReconocerFill');
  var progressRText = $('#progressReconocerText');
  var btnNextRecognize = $('#btnSiguienteReconocer');

  function startRecognize() {
    activityCurrent = 'reconocer';
    itemsRecognize = App.utils.shuffle(bank().reconocer).slice(0, bank().porRonda);
    idxR = 0;
    hitsR = 0;
    hideAll();
    screenRecognize.classList.remove('hidden');
    renderRecognize();
  }

  function paintProgressR() {
    var perRound = bank().porRonda;
    progressRFill.style.width = ((idxR / perRound) * 100) + '%';
    progressRText.textContent = '';
  }

  function renderRecognize() {
    var item = itemsRecognize[idxR];
    resueltoR = false;
    attemptsR = 0;
    situationPictoEl.textContent = item.picto;
    situationTextEl.textContent = item.situacion;
    feedbackREl.textContent = '';
    feedbackREl.className = 'feedback';
    explanationRWrap.classList.add('hidden');
    explanationREl.textContent = '';
    btnNextRecognize.classList.add('hidden');
    optionsREl.innerHTML = '';

    var options = App.utils.shuffle(item.options.map(function (opt, i) {
      return { text: opt, isCorrect: i === item.correcta };
    }));
    options.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.text;
      btn.addEventListener('click', function () { answerRecognize(btn, op.isCorrect, item); });
      optionsREl.appendChild(btn);
    });

    paintProgressR();
    renderStars();
  }

  function showExplanationR(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.';
    explanationREl.textContent = text;
    explanationRWrap.classList.remove('hidden');
  }

  function answerRecognize(btn, isCorrect, item) {
    if (resueltoR) return;
    if (isCorrect) {
      showExplanationR(isCorrect, item);
      resueltoR = true;
      btn.classList.add('correcta');
      App.utils.$$('#opcionesReconocer .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackREl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      hitsR += 1;
      save();
      renderStars();
      btnNextRecognize.classList.remove('hidden');
      btnNextRecognize.focus();
    } else {
      attemptsR += 1;
      var answerAfterHint = attemptsR > 1;
      explanationREl.textContent = App.i18n.t('pista') + '"' + item.situacion + '"';
        explanationRWrap.classList.remove('hidden');
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackREl);
      App.feedback.lockUntilAck(App.utils.$$('#opcionesReconocer .btn-opcion'), explanationRWrap, function () { if (answerAfterHint) showExplanationR(isCorrect, item); });
    }
  }

  function nextRecognize() {
    idxR += 1;
    if (idxR >= bank().porRonda) {
      finishRecognize();
    } else {
      renderRecognize();
    }
  }

  function finishRecognize() {
    progress.completadoReconocer += 1;
    save();
    hideAll();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
$('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ================= Actividad 2: practica la llamada ================= */
  var listsCall = [];
  var idxL = 0;
  var hitsL = 0;
  var nextExpectedL = 0;
  var slotsL = [];

  var listTitleEl = $('#listaTitulo');
  var sequenceEl = $('#secuencia');
  var disponiblesEl = $('#disponibles');
  var feedbackLEl = $('#feedbackLlamada');
  var progressLFill = $('#progressLlamadaFill');
  var progressLText = $('#progressLlamadaText');

  function startCall() {
    activityCurrent = 'llamada';
    listsCall = App.utils.shuffle(bank().llamadas);
    idxL = 0;
    hitsL = 0;
    hideAll();
    screenCall.classList.remove('hidden');
    renderCall();
  }

  function paintProgressL() {
    var total = listsCall.length;
    progressLFill.style.width = ((idxL / total) * 100) + '%';
    progressLText.textContent = '';
  }

  function renderCall() {
    var list = listsCall[idxL];
    nextExpectedL = 0;
    slotsL = new Array(list.items.length).fill(null);
    feedbackLEl.textContent = '';
    feedbackLEl.className = 'feedback';
    listTitleEl.textContent = list.name;

    paintSlotsL();

    disponiblesEl.innerHTML = '';
    App.utils.shuffle(list.items.map(function (item, order) {
      return { item: item, orden: order };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn tarea-btn';
      btn.innerHTML = '<span class="task-picto" aria-hidden="true">' + p.item.picto + '</span>' +
        '<span class="tarea-text">' + p.item.text + '</span>';
      btn.setAttribute('aria-label', App.i18n.t('ariaPaso') + ': ' + p.item.text);
      btn.addEventListener('click', function () { tapL(p.orden, btn); });
      disponiblesEl.appendChild(btn);
    });

    paintProgressL();
    renderStars();
  }

  function paintSlotsL() {
    sequenceEl.innerHTML = '';
    slotsL.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'slot' + (item ? ' filled' : '');
      if (item) {
        div.innerHTML = '<span class="task-picto" aria-hidden="true">' + item.picto + '</span>' +
          '<span class="tarea-text">' + item.text + '</span>';
      } else {
        div.textContent = String(i + 1);
      }
      sequenceEl.appendChild(div);
    });
  }

  function tapL(order, btn) {
    var list = listsCall[idxL];
    if (order === nextExpectedL) {
      slotsL[order] = list.items[order];
      paintSlotsL();
      btn.disabled = true;
      btn.classList.add('colocada');
      App.feedback.success(feedbackLEl);
      nextExpectedL += 1;
      if (nextExpectedL >= list.items.length) {
        finishTaskL();
      }
    } else {
      App.feedback.encourage(feedbackLEl);
    }
  }

  function finishTaskL() {
    progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    hitsL += 1;
    save();
    renderStars();
    idxL += 1;
    if (idxL >= listsCall.length) {
      setTimeout(finishCall, 900);
    } else {
      setTimeout(renderCall, 900);
    }
  }

  function finishCall() {
    progress.completadoLlamada += 1;
    save();
    hideAll();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ============== Subactividad 3: Atrapado en el ascensor ==============
     Escenario guiado de dos etapas: "qué hago" (pedir ayuda, decir
     dónde, esperar sin forzar la puerta) y "qué digo" (la llamada por
     el interfono). Motor de pasos: narración y preguntas de 3
     opciones. La opción correcta muestra su explicación y un botón
     "Continuar"; la incorrecta se desactiva, muestra su pista y
     espera a "Entendido" (App.feedback.lockUntilAck) antes de
     dejar volver a intentar. */
  var stepsElevator = [];
  var idxA = 0;
  var DELAY_A = App.utils.reducedMotion() ? 0 : 800;

  var elevatorTitleEl = $('#ascensorTitulo');
  var ascHistoriaEl = $('#ascensorHistoria');
  var elevatorFeedbackEl = $('#ascensorFeedback');
  var elevatorTipEl = $('#ascensorConsejo');
  var elevatorTipTextEl = $('#ascensorConsejoTexto');
  var elevatorQuestionEl = $('#ascensorPregunta');
  var elevatorOptionsEl = $('#ascensorOpciones');
  var elevatorExplanationWrap = $('#ascensorExplicacionWrap');
  var elevatorExplanationEl = $('#ascensorExplicacion');
  var btnNextElevator = $('#btnSiguienteAscensor');
  var elevatorRuleEl = $('#ascensorRegla');
  var elevatorRuleTextEl = $('#ascensorReglaTexto');

  function startElevator() {
    activityCurrent = 'ascensor';
    var datos = bank().ascensor;
    stepsElevator = datos.escenario.pasos.concat(datos.llamada.pasos);
    idxA = 0;
    elevatorTitleEl.textContent = datos.tituloEscenario;
    ascHistoriaEl.innerHTML = '';
    elevatorRuleEl.classList.add('hidden');
    elevatorRuleTextEl.textContent = datos.escenario.regla + ' ' + datos.llamada.regla;
    hideAll();
    screenElevator.classList.remove('hidden');
    nextStepA();
  }

  function clearZoneA() {
    elevatorOptionsEl.innerHTML = '';
    elevatorQuestionEl.classList.add('hidden');
    elevatorTipEl.classList.add('hidden');
    elevatorExplanationWrap.classList.add('hidden');
    btnNextElevator.classList.add('hidden');
    elevatorFeedbackEl.textContent = '';
    elevatorFeedbackEl.className = 'feedback';
  }

  function narracionA(step) {
    var row = document.createElement('div');
    row.className = 'asc-linea';
    var picto = document.createElement('span');
    picto.className = 'asc-picto';
    picto.setAttribute('aria-hidden', 'true');
    picto.textContent = step.picto || '';
    var texto = document.createElement('span');
    texto.className = 'asc-texto';
    texto.textContent = step.text;
    row.appendChild(picto);
    row.appendChild(texto);
    ascHistoriaEl.appendChild(row);
    ascHistoriaEl.scrollTop = ascHistoriaEl.scrollHeight;
  }

  function nextStepA() {
    if (!stepsElevator.length) return;
    if (idxA >= stepsElevator.length) {
      finishElevator();
      return;
    }
    var datos = bank().ascensor;
    /* Al empezar la segunda etapa cambia el título de la pantalla. */
    if (idxA === datos.escenario.pasos.length) {
      elevatorTitleEl.textContent = datos.tituloLlamada;
    }
    var step = stepsElevator[idxA];
    idxA += 1;
    if (step.tipo === 'narracion') {
      narracionA(step);
      setTimeout(function () {
        if (activityCurrent === 'ascensor') nextStepA();
      }, DELAY_A);
    } else {
      paintQuestionA(step);
    }
  }

  function paintQuestionA(step) {
    clearZoneA();
    elevatorQuestionEl.textContent = step.text;
    elevatorQuestionEl.classList.remove('hidden');
    App.utils.shuffle(step.opciones).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { answerA(btn, op); });
      elevatorOptionsEl.appendChild(btn);
    });
  }

  function answerA(btn, op) {
    if (op.correcta) {
      Array.prototype.forEach.call(elevatorOptionsEl.querySelectorAll('.btn-opcion'), function (b) {
        b.disabled = true;
      });
      btn.classList.add('correcta');
      App.feedback.success(elevatorFeedbackEl);
      elevatorExplanationEl.textContent = op.explicacion;
      elevatorExplanationWrap.classList.remove('hidden');
      btnNextElevator.classList.remove('hidden');
      btnNextElevator.focus();
    } else {
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(elevatorFeedbackEl);
      elevatorTipTextEl.textContent = op.pista || App.i18n.t('ascensorPista');
      elevatorTipEl.classList.remove('hidden');
      App.feedback.lockUntilAck(elevatorOptionsEl.querySelectorAll('.btn-opcion'), elevatorTipEl);
    }
  }

  function finishElevator() {
    progress.stars += 1;
    progress.completadoAscensor += 1;
    save();
    renderStars();
    if (App.feedback && App.feedback.star) App.feedback.star();
    elevatorRuleEl.classList.remove('hidden');
    App.feedback.celebrate(App.i18n.t('ascensorSuperado'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaReconocer').addEventListener('click', startRecognize);
  $('#tarjetaLlamada').addEventListener('click', startCall);
  $('#tarjetaAscensor').addEventListener('click', startElevator);
  $('#btnVolverReconocer').addEventListener('click', irMenu);
  $('#btnVolverLlamada').addEventListener('click', irMenu);
  $('#btnVolverAscensor').addEventListener('click', irMenu);
  var btnRepeatElevator = $('#btnRepetirAscensor');
  if (btnRepeatElevator) btnRepeatElevator.addEventListener('click', startElevator);
  var btnMenuElevator = $('#btnMenuAscensor');
  if (btnMenuElevator) btnMenuElevator.addEventListener('click', irMenu);
  btnNextRecognize.addEventListener('click', nextRecognize);
  btnNextElevator.addEventListener('click', function () {
    clearZoneA();
    nextStepA();
  });
  var btnListenRecognize = $('#btnEscucharReconocer');
  if (btnListenRecognize) btnListenRecognize.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(itemsRecognize[idxR].situacion);
  });
  $('#btnRepeat').addEventListener('click', function () {
    if (activityCurrent === 'reconocer') startRecognize();
    else if (activityCurrent === 'ascensor') startElevator();
    else startCall();
  });
  $('#btnVolverMenuFinal').addEventListener('click', irMenu);


  irMenu();
})();

