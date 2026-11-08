/* ============================================================
   Routime — Mientras Llega la Ayuda (autonomía: qué hacer
   después de llamar al 112, mientras llega la ambulancia /
   bomberos / policía).
   Datos en data.js (DATA.queHago, DATA.pasos). Dos actividades
   elegibles desde un menú (regla 10: una acción principal por
   pantalla):
   - "¿Qué hago ahora?": quiz de 3 opciones (motor de Situations)
     sobre acciones seguras mientras se espera — la correcta
     siempre es lo que se enseña en primeros auxilios básicos
     (salir, no mover, presionar, posición lateral, no dar nada
     por boca, no provocar vómito). El error NUNCA se castiga.
   - "Ordena los pasos": motor de task-list con 3 acciones
     inmediatas para una emergencia concreta. La estructura cambia
     con cada emergencia para que se APRENDA a secuenciar, no un
     guion fijo.
   Sin niveles (regla 13 no aplica: cada ronda ya mezcla dificultad
   a propósito, como contraste didáctico, no como progresión).
   Pista socrática en el primer fallo (regla 12).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'while-help-arrives';
  var $ = App.utils.$;

  var screenMenu = $('#menuScreen');
  var pantallaQueHago = $('#pantallaQueHago');
  var screenSort = $('#pantallaOrdenar');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completadoQueHago) progress.completadoQueHago = 0;
  if (!progress.completadoOrdenar) progress.completadoOrdenar = 0;

  var activityCurrent = null; /* 'queHago' | 'ordenar' */

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; }
  });
  var save = glue.save;
  var renderStars = glue.paintStars;
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function hideAll() {
    [screenMenu, pantallaQueHago, screenSort, endScreen].forEach(function (p) {
      p.classList.add('hidden');
    });
  }

  function irMenu() {
    hideAll();
    paintMenu();
    screenMenu.classList.remove('hidden');
  }

  function paintMenu() {
    $('#marcaQueHago').textContent = '';
    $('#marcaOrdenar').textContent = '';
    renderStars();
  }

  /* ================= Actividad 1: ¿Qué hago ahora? ================= */
  var itemsQueHago = [];
  var idxQ = 0;
  var hitsQ = 0;
  var resueltoQ = false;
  var attemptsQ = 0;

  var situationPictoEl = $('#situacionPicto');
  var situationTextEl = $('#situacionTexto');
  var optionsQEl = $('#opcionesQueHago');
  var feedbackQEl = $('#feedbackQueHago');
  var explanationQWrap = $('#explicacionQueHagoWrap');
  var explanationQEl = $('#explicacionQueHago');
  var progressQFill = $('#progressQueHagoFill');
  var progressQText = $('#progressQueHagoText');
  var btnNextWhatToDo = $('#btnSiguienteQueHago');

  function iniciarQueHago() {
    activityCurrent = 'queHago';
    itemsQueHago = App.utils.shuffle(bank().queHago).slice(0, bank().porRonda);
    idxQ = 0;
    hitsQ = 0;
    hideAll();
    pantallaQueHago.classList.remove('hidden');
    renderQueHago();
  }

  function paintProgressQ() {
    var perRound = bank().porRonda;
    progressQFill.style.width = ((idxQ / perRound) * 100) + '%';
    progressQText.textContent = '';
  }

  function renderQueHago() {
    var item = itemsQueHago[idxQ];
    resueltoQ = false;
    attemptsQ = 0;
    situationPictoEl.textContent = item.picto;
    situationTextEl.textContent = item.situacion;
    feedbackQEl.textContent = '';
    feedbackQEl.className = 'feedback';
    explanationQWrap.classList.add('hidden');
    explanationQEl.textContent = '';
    btnNextWhatToDo.classList.add('hidden');
    optionsQEl.innerHTML = '';

    var options = App.utils.shuffle(item.opciones.map(function (opt, i) {
      return { texto: opt, isCorrect: i === item.correcta };
    }));
    options.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { responderQueHago(btn, op.isCorrect, item); });
      optionsQEl.appendChild(btn);
    });

    paintProgressQ();
    renderStars();
  }

  function showExplanationQ(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.opciones[item.correcta] + '.';
    explanationQEl.textContent = text;
    explanationQWrap.classList.remove('hidden');
  }

  function responderQueHago(btn, isCorrect, item) {
    if (resueltoQ) return;
    if (isCorrect) {
      showExplanationQ(isCorrect, item);
      resueltoQ = true;
      btn.classList.add('correcta');
      App.utils.$$('#opcionesQueHago .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackQEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      hitsQ += 1;
      save();
      renderStars();
      btnNextWhatToDo.classList.remove('hidden');
      btnNextWhatToDo.focus();
    } else {
      attemptsQ += 1;
      var answerAfterHint = attemptsQ > 1;
      explanationQEl.textContent = App.i18n.t('pista') + '"' + item.situacion + '"';
        explanationQWrap.classList.remove('hidden');
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackQEl);
      App.feedback.lockUntilAck(App.utils.$$('#opcionesQueHago .btn-opcion'), explanationQWrap, function () { if (answerAfterHint) showExplanationQ(isCorrect, item); });
    }
  }

  function nextWhatToDo() {
    idxQ += 1;
    if (idxQ >= bank().porRonda) {
      terminarQueHago();
    } else {
      renderQueHago();
    }
  }

  function terminarQueHago() {
    progress.completadoQueHago += 1;
    save();
    hideAll();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ================= Actividad 2: ordena los pasos ================= */
  var listsSort = [];
  var idxO = 0;
  var hitsO = 0;
  var nextExpectedO = 0;
  var slotsO = [];

  var listTitleEl = $('#listaTitulo');
  var sequenceEl = $('#secuencia');
  var disponiblesEl = $('#disponibles');
  var feedbackOEl = $('#feedbackOrdenar');
  var progressOFill = $('#progressOrdenarFill');
  var progressOText = $('#progressOrdenarText');

  function startSort() {
    activityCurrent = 'ordenar';
    listsSort = App.utils.shuffle(bank().pasos);
    idxO = 0;
    hitsO = 0;
    hideAll();
    screenSort.classList.remove('hidden');
    renderSort();
  }

  function paintProgressO() {
    var total = listsSort.length;
    progressOFill.style.width = ((idxO / total) * 100) + '%';
    progressOText.textContent = '';
  }

  function renderSort() {
    var list = listsSort[idxO];
    nextExpectedO = 0;
    slotsO = new Array(list.items.length).fill(null);
    feedbackOEl.textContent = '';
    feedbackOEl.className = 'feedback';
    listTitleEl.textContent = list.nombre;

    paintSlotsO();

    disponiblesEl.innerHTML = '';
    App.utils.shuffle(list.items.map(function (item, order) {
      return { item: item, orden: order };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn tarea-btn';
      btn.innerHTML = '<span class="tarea-picto" aria-hidden="true">' + p.item.picto + '</span>' +
        '<span class="tarea-texto">' + p.item.texto + '</span>';
      btn.setAttribute('aria-label', App.i18n.t('ariaPaso') + ': ' + p.item.texto);
      btn.addEventListener('click', function () { tapO(p.orden, btn); });
      disponiblesEl.appendChild(btn);
    });

    paintProgressO();
    renderStars();
  }

  function paintSlotsO() {
    sequenceEl.innerHTML = '';
    slotsO.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'slot' + (item ? ' lleno' : '');
      if (item) {
        div.innerHTML = '<span class="tarea-picto" aria-hidden="true">' + item.picto + '</span>' +
          '<span class="tarea-texto">' + item.texto + '</span>';
      } else {
        div.textContent = String(i + 1);
      }
      sequenceEl.appendChild(div);
    });
  }

  function tapO(order, btn) {
    var list = listsSort[idxO];
    if (order === nextExpectedO) {
      slotsO[order] = list.items[order];
      paintSlotsO();
      btn.disabled = true;
      btn.classList.add('colocada');
      App.feedback.success(feedbackOEl);
      nextExpectedO += 1;
      if (nextExpectedO >= list.items.length) {
        finishTaskO();
      }
    } else {
      App.feedback.encourage(feedbackOEl);
    }
  }

  function finishTaskO() {
    progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    hitsO += 1;
    save();
    renderStars();
    idxO += 1;
    if (idxO >= listsSort.length) {
      setTimeout(finishSort, 900);
    } else {
      setTimeout(renderSort, 900);
    }
  }

  function finishSort() {
    progress.completadoOrdenar += 1;
    save();
    hideAll();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaQueHago').addEventListener('click', iniciarQueHago);
  $('#tarjetaOrdenar').addEventListener('click', startSort);
  $('#btnVolverQueHago').addEventListener('click', irMenu);
  $('#btnVolverOrdenar').addEventListener('click', irMenu);
  btnNextWhatToDo.addEventListener('click', nextWhatToDo);
  if ($('#btnEscucharExplicacionQueHago')) $('#btnEscucharExplicacionQueHago').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(explanationQEl.textContent);
  });
  if ($('#btnEscucharQueHago')) $('#btnEscucharQueHago').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(itemsQueHago[idxQ].situacion);
  });
  $('#btnRepeat').addEventListener('click', function () {
    if (activityCurrent === 'queHago') iniciarQueHago();
    else startSort();
  });
  $('#btnVolverMenuFinal').addEventListener('click', irMenu);


  irMenu();
})();
