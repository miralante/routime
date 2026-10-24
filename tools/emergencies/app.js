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
  var pantallaReconocer = $('#pantallaReconocer');
  var pantallaLlamada = $('#pantallaLlamada');
  var pantallaAscensor = $('#pantallaAscensor');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completadoReconocer) progress.completadoReconocer = 0;
  if (!progress.completadoLlamada) progress.completadoLlamada = 0;
  if (!progress.completadoAscensor) progress.completadoAscensor = 0;

  var actividadActual = null; /* 'reconocer' | 'llamada' | 'ascensor' */

  function save() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function ocultarTodas() {
    [menuScreen, pantallaReconocer, pantallaLlamada, pantallaAscensor, endScreen].forEach(function (p) {
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
    $('#marcaAscensor').textContent = '';
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
      btn.textContent = op.text;
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
      var respuestaTrasPista = intentosR > 1;
      explicacionREl.textContent = App.i18n.t('pista') + '"' + item.situacion + '"';
        explicacionRWrap.classList.remove('hidden');
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackREl);
      App.feedback.lockUntilAck(App.utils.$$('#opcionesReconocer .btn-opcion'), explicacionRWrap, function () { if (respuestaTrasPista) mostrarExplicacionR(isCorrect, item); });
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
        '<span class="tarea-text">' + p.item.text + '</span>';
      btn.setAttribute('aria-label', App.i18n.t('ariaPaso') + ': ' + p.item.text);
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
          '<span class="tarea-text">' + item.text + '</span>';
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

  /* ============== Subactividad 3: Atrapado en el ascensor ==============
     Escenario guiado de dos etapas: "qué hago" (pedir ayuda, decir
     dónde, esperar sin forzar la puerta) y "qué digo" (la llamada por
     el interfono). Motor de pasos: narración y preguntas de 3
     opciones. La opción correcta muestra su explicación y un botón
     "Continuar"; la incorrecta se desactiva, muestra su pista y
     espera a "Entendido" (App.feedback.lockUntilAck) antes de
     dejar volver a intentar. */
  var pasosAsc = [];
  var idxA = 0;
  var DELAY_A = App.utils.reducedMotion() ? 0 : 800;

  var ascTituloEl = $('#ascensorTitulo');
  var ascHistoriaEl = $('#ascensorHistoria');
  var ascFeedbackEl = $('#ascensorFeedback');
  var ascConsejoEl = $('#ascensorConsejo');
  var ascConsejoTextoEl = $('#ascensorConsejoTexto');
  var ascPreguntaEl = $('#ascensorPregunta');
  var ascOpcionesEl = $('#ascensorOpciones');
  var ascExplicacionWrap = $('#ascensorExplicacionWrap');
  var ascExplicacionEl = $('#ascensorExplicacion');
  var btnSiguienteAscensor = $('#btnSiguienteAscensor');
  var ascReglaEl = $('#ascensorRegla');
  var ascReglaTextoEl = $('#ascensorReglaTexto');

  function iniciarAscensor() {
    actividadActual = 'ascensor';
    var datos = banco().ascensor;
    pasosAsc = datos.escenario.pasos.concat(datos.llamada.pasos);
    idxA = 0;
    ascTituloEl.textContent = datos.tituloEscenario;
    ascHistoriaEl.innerHTML = '';
    ascReglaEl.classList.add('hidden');
    ascReglaTextoEl.textContent = datos.escenario.regla + ' ' + datos.llamada.regla;
    ocultarTodas();
    pantallaAscensor.classList.remove('hidden');
    siguientePasoA();
  }

  function limpiarZonaA() {
    ascOpcionesEl.innerHTML = '';
    ascPreguntaEl.classList.add('hidden');
    ascConsejoEl.classList.add('hidden');
    ascExplicacionWrap.classList.add('hidden');
    btnSiguienteAscensor.classList.add('hidden');
    ascFeedbackEl.textContent = '';
    ascFeedbackEl.className = 'feedback';
  }

  function narracionA(paso) {
    var fila = document.createElement('div');
    fila.className = 'asc-linea';
    var picto = document.createElement('span');
    picto.className = 'asc-picto';
    picto.setAttribute('aria-hidden', 'true');
    picto.textContent = paso.picto || '';
    var texto = document.createElement('span');
    texto.className = 'asc-texto';
    texto.textContent = paso.text;
    fila.appendChild(picto);
    fila.appendChild(texto);
    ascHistoriaEl.appendChild(fila);
    ascHistoriaEl.scrollTop = ascHistoriaEl.scrollHeight;
  }

  function siguientePasoA() {
    if (!pasosAsc.length) return;
    if (idxA >= pasosAsc.length) {
      terminarAscensor();
      return;
    }
    var datos = banco().ascensor;
    /* Al empezar la segunda etapa cambia el título de la pantalla. */
    if (idxA === datos.escenario.pasos.length) {
      ascTituloEl.textContent = datos.tituloLlamada;
    }
    var paso = pasosAsc[idxA];
    idxA += 1;
    if (paso.tipo === 'narracion') {
      narracionA(paso);
      setTimeout(function () {
        if (actividadActual === 'ascensor') siguientePasoA();
      }, DELAY_A);
    } else {
      pintarPreguntaA(paso);
    }
  }

  function pintarPreguntaA(paso) {
    limpiarZonaA();
    ascPreguntaEl.textContent = paso.text;
    ascPreguntaEl.classList.remove('hidden');
    App.utils.shuffle(paso.opciones).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { responderA(btn, op); });
      ascOpcionesEl.appendChild(btn);
    });
  }

  function responderA(btn, op) {
    if (op.correcta) {
      Array.prototype.forEach.call(ascOpcionesEl.querySelectorAll('.btn-opcion'), function (b) {
        b.disabled = true;
      });
      btn.classList.add('correcta');
      App.feedback.success(ascFeedbackEl);
      ascExplicacionEl.textContent = op.explicacion;
      ascExplicacionWrap.classList.remove('hidden');
      btnSiguienteAscensor.classList.remove('hidden');
      btnSiguienteAscensor.focus();
    } else {
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(ascFeedbackEl);
      ascConsejoTextoEl.textContent = op.pista || App.i18n.t('ascensorPista');
      ascConsejoEl.classList.remove('hidden');
      App.feedback.lockUntilAck(ascOpcionesEl.querySelectorAll('.btn-opcion'), ascConsejoEl);
    }
  }

  function terminarAscensor() {
    progress.stars += 1;
    progress.completadoAscensor += 1;
    save();
    renderStars();
    if (App.feedback && App.feedback.star) App.feedback.star();
    ascReglaEl.classList.remove('hidden');
    App.feedback.celebrate(App.i18n.t('ascensorSuperado'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaReconocer').addEventListener('click', iniciarReconocer);
  $('#tarjetaLlamada').addEventListener('click', iniciarLlamada);
  $('#tarjetaAscensor').addEventListener('click', iniciarAscensor);
  $('#btnVolverReconocer').addEventListener('click', irMenu);
  $('#btnVolverLlamada').addEventListener('click', irMenu);
  $('#btnVolverAscensor').addEventListener('click', irMenu);
  var btnRepetirAscensor = $('#btnRepetirAscensor');
  if (btnRepetirAscensor) btnRepetirAscensor.addEventListener('click', iniciarAscensor);
  var btnMenuAscensor = $('#btnMenuAscensor');
  if (btnMenuAscensor) btnMenuAscensor.addEventListener('click', irMenu);
  btnNextRecognize.addEventListener('click', nextRecognize);
  btnSiguienteAscensor.addEventListener('click', function () {
    limpiarZonaA();
    siguientePasoA();
  });
  var btnEscucharReconocer = $('#btnEscucharReconocer');
  if (btnEscucharReconocer) btnEscucharReconocer.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(itemsReconocer[idxR].situacion);
  });
  $('#btnRepeat').addEventListener('click', function () {
    if (actividadActual === 'reconocer') iniciarReconocer();
    else if (actividadActual === 'ascensor') iniciarAscensor();
    else iniciarLlamada();
  });
  $('#btnVolverMenuFinal').addEventListener('click', irMenu);


  irMenu();
})();

