/* ============================================================
   Routime — Emergencias (autonomía: reconocer una emergencia
   de verdad y practicar cómo pedir help)
   Datos en data.js (DATA.reconocer, DATA.llamadas). Dos actividades
   elegibles desde un menú (regla 10: una acción principal por
   pantalla):
   - "¿Es una emergencia?": quiz de 3 options (motor de Situaciones)
     que mezcla emergencias reales con cosas que no lo son, para que
     el contraste enseñe a distinguir. Sin niveles: la mezcla de
     dificultad es a propósito (contraste didáctico), no progresión.
   - "Practica la llamada": ordenar 3 steps (motor de Lista de
     Tareas) siempre en el mismo orden — name, qué pasa, dónde
     estás — cambiando solo la emergencia descrita, para aprender la
     estructura y no un guion fijo.
   El error nunca se castiga (regla 5); pista socrática en el primer
   fallo (regla 12).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'emergencias';
  var $ = App.utils.$;

  var menuScreen = $('#menuScreen');
  var pantallaReconocer = $('#pantallaReconocer');
  var pantallaLlamada = $('#pantallaLlamada');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completadoReconocer) progress.completadoReconocer = 0;
  if (!progress.completadoLlamada) progress.completadoLlamada = 0;

  var actividadActual = null; /* 'reconocer' | 'llamada' */

  function save() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function ocultarTodas() {
    [menuScreen, pantallaReconocer, pantallaLlamada, endScreen].forEach(function (p) {
      p.classList.add('hidden');
    });
  }

  function irMenu() {
    ocultarTodas();
    renderMenu();
    menuScreen.classList.remove('hidden');
  }

  function renderMenu() {
    $('#marcaReconocer').textContent = '';
    $('#marcaLlamada').textContent = '';
    renderStars();
  }

  /* ================= Actividad 1: ¿Es una emergencia? ================= */
  var itemsReconocer = [];
  var idxR = 0;
  var aciertosR = 0;
  var resueltoR = false;
  var intentosR = 0;

  var situacionPictoEl = $('#situacionPicto');
  var situacionTextoEl = $('#situacionTexto');
  var opcionesREl = $('#opcionesReconocer');
  var feedbackREl = $('#feedbackReconocer');
  var explicacionRWrap = $('#explicacionReconocerWrap');
  var explicacionREl = $('#explicacionReconocer');
  var progressRFill = $('#progressReconocerFill');
  var progressRText = $('#progressReconocerText');
  var btnNextRecognize = $('#btnSiguienteReconocer');

  function iniciarReconocer() {
    actividadActual = 'reconocer';
    itemsReconocer = App.utils.shuffle(banco().reconocer).slice(0, banco().porRonda);
    idxR = 0;
    aciertosR = 0;
    ocultarTodas();
    pantallaReconocer.classList.remove('hidden');
    renderReconocer();
  }

  function pintarProgresoR() {
    var porRonda = banco().porRonda;
    progressRFill.style.width = ((idxR / porRonda) * 100) + '%';
    progressRText.textContent = '';
  }

  function renderReconocer() {
    var item = itemsReconocer[idxR];
    resueltoR = false;
    intentosR = 0;
    situacionPictoEl.textContent = item.picto;
    situacionTextoEl.textContent = item.situacion;
    feedbackREl.textContent = '';
    feedbackREl.className = 'feedback';
    explicacionRWrap.classList.add('hidden');
    explicacionREl.textContent = '';
    btnNextRecognize.classList.add('hidden');
    opcionesREl.innerHTML = '';

    var options = App.utils.shuffle(item.options.map(function (opt, i) {
      return { text: opt, isCorrect: i === item.correcta };
    }));
    options.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.textContent;
      btn.addEventListener('click', function () { responderReconocer(btn, op.isCorrect, item); });
      opcionesREl.appendChild(btn);
    });

    pintarProgresoR();
    renderStars();
  }

  function mostrarExplicacionR(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.';
    explicacionREl.textContent = text;
    explicacionRWrap.classList.remove('hidden');
  }

  function responderReconocer(btn, isCorrect, item) {
    if (resueltoR) return;
    if (isCorrect) {
      mostrarExplicacionR(isCorrect, item);
      resueltoR = true;
      btn.classList.add('correcta');
      App.utils.$$('#opcionesReconocer .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackREl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      aciertosR += 1;
      save();
      renderStars();
      btnNextRecognize.classList.remove('hidden');
      btnNextRecognize.focus();
    } else {
      intentosR += 1;
      if (intentosR === 1) {
        explicacionREl.textContent = App.i18n.t('pista') + '"' + item.situacion + '"';
        explicacionRWrap.classList.remove('hidden');
      } else {
        mostrarExplicacionR(isCorrect, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackREl);
      App.feedback.lockUntilAck(App.utils.$$('#opcionesReconocer .btn-opcion'), explicacionRWrap);
    }
  }

  function nextRecognize() {
    idxR += 1;
    if (idxR >= banco().porRonda) {
      terminarReconocer();
    } else {
      renderReconocer();
    }
  }

  function terminarReconocer() {
    progress.completadoReconocer += 1;
    save();
    ocultarTodas();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
$('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ================= Actividad 2: practica la llamada ================= */
  var listasLlamada = [];
  var idxL = 0;
  var aciertosL = 0;
  var nextExpectedL = 0;
  var slotsL = [];

  var listaTituloEl = $('#listaTitulo');
  var secuenciaEl = $('#secuencia');
  var disponiblesEl = $('#disponibles');
  var feedbackLEl = $('#feedbackLlamada');
  var progressLFill = $('#progressLlamadaFill');
  var progressLText = $('#progressLlamadaText');

  function iniciarLlamada() {
    actividadActual = 'llamada';
    listasLlamada = App.utils.shuffle(banco().llamadas);
    idxL = 0;
    aciertosL = 0;
    ocultarTodas();
    pantallaLlamada.classList.remove('hidden');
    renderLlamada();
  }

  function pintarProgresoL() {
    var total = listasLlamada.length;
    progressLFill.style.width = ((idxL / total) * 100) + '%';
    progressLText.textContent = '';
  }

  function renderLlamada() {
    var lista = listasLlamada[idxL];
    nextExpectedL = 0;
    slotsL = new Array(lista.items.length).fill(null);
    feedbackLEl.textContent = '';
    feedbackLEl.className = 'feedback';
    listaTituloEl.textContent = lista.name;

    pintarSlotsL();

    disponiblesEl.innerHTML = '';
    App.utils.shuffle(lista.items.map(function (item, orden) {
      return { item: item, orden: orden };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn tarea-btn';
      btn.innerHTML = '<span class="task-picto" aria-hidden="true">' + p.item.picto + '</span>' +
        '<span class="tarea-text">' + p.item.textContent + '</span>';
      btn.setAttribute('aria-label', App.i18n.t('ariaPaso') + ': ' + p.item.textContent);
      btn.addEventListener('click', function () { tocarL(p.orden, btn); });
      disponiblesEl.appendChild(btn);
    });

    pintarProgresoL();
    renderStars();
  }

  function pintarSlotsL() {
    secuenciaEl.innerHTML = '';
    slotsL.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'slot' + (item ? ' filled' : '');
      if (item) {
        div.innerHTML = '<span class="task-picto" aria-hidden="true">' + item.picto + '</span>' +
          '<span class="tarea-text">' + item.textContent + '</span>';
      } else {
        div.textContent = String(i + 1);
      }
      secuenciaEl.appendChild(div);
    });
  }

  function tocarL(orden, btn) {
    var lista = listasLlamada[idxL];
    if (orden === nextExpectedL) {
      slotsL[orden] = lista.items[orden];
      pintarSlotsL();
      btn.disabled = true;
      btn.classList.add('colocada');
      App.feedback.success(feedbackLEl);
      nextExpectedL += 1;
      if (nextExpectedL >= lista.items.length) {
        terminarTareaL();
      }
    } else {
      App.feedback.encourage(feedbackLEl);
    }
  }

  function terminarTareaL() {
    progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    aciertosL += 1;
    save();
    renderStars();
    idxL += 1;
    if (idxL >= listasLlamada.length) {
      setTimeout(terminarLlamada, 900);
    } else {
      setTimeout(renderLlamada, 900);
    }
  }

  function terminarLlamada() {
    progress.completadoLlamada += 1;
    save();
    ocultarTodas();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaReconocer').addEventListener('click', iniciarReconocer);
  $('#tarjetaLlamada').addEventListener('click', iniciarLlamada);
  $('#btnVolverReconocer').addEventListener('click', irMenu);
  $('#btnVolverLlamada').addEventListener('click', irMenu);
  btnNextRecognize.addEventListener('click', nextRecognize);
  var btnEscucharReconocer = $('#btnEscucharReconocer');
  if (btnEscucharReconocer) btnEscucharReconocer.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(itemsReconocer[idxR].situacion);
  });
  $('#btnRepeat').addEventListener('click', function () {
    if (actividadActual === 'reconocer') iniciarReconocer();
    else iniciarLlamada();
  });
  $('#btnVolverMenuFinal').addEventListener('click', irMenu);


  irMenu();
})();

