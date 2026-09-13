/* ============================================================
   Routime — Emergencias (autonomía: reconocer una emergencia
   de verdad y practicar cómo pedir ayuda)
   Datos en data.js (DATA.reconocer, DATA.llamadas). Dos actividades
   elegibles desde un menú (regla 10: una acción principal por
   pantalla):
   - "¿Es una emergencia?": quiz de 3 opciones (motor de Situaciones)
     que mezcla emergencias reales con cosas que no lo son, para que
     el contraste enseñe a distinguir. Sin niveles: la mezcla de
     dificultad es a propósito (contraste didáctico), no progresión.
   - "Practica la llamada": ordenar 3 pasos (motor de Lista de
     Tareas) siempre en el mismo orden — nombre, qué pasa, dónde
     estás — cambiando solo la emergencia descrita, para aprender la
     estructura y no un guion fijo.
   El error nunca se castiga (regla 5); pista socrática en el primer
   fallo (regla 12).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'emergencias';
  var $ = App.utils.$;

  var pantallaMenu = $('#pantallaMenu');
  var pantallaReconocer = $('#pantallaReconocer');
  var pantallaLlamada = $('#pantallaLlamada');
  var pantallaFinal = $('#pantallaFinal');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completadoReconocer) progreso.completadoReconocer = 0;
  if (!progreso.completadoLlamada) progreso.completadoLlamada = 0;

  var actividadActual = null; /* 'reconocer' | 'llamada' */

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function ocultarTodas() {
    [pantallaMenu, pantallaReconocer, pantallaLlamada, pantallaFinal].forEach(function (p) {
      p.classList.add('oculto');
    });
  }

  function irMenu() {
    ocultarTodas();
    pintarMenu();
    pantallaMenu.classList.remove('oculto');
  }

  function pintarMenu() {
    $('#marcaReconocer').textContent.textContent = '';
    $('#marcaLlamada').textContent.textContent = '';
    pintarEstrellas();
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
  var btnSiguienteR = $('#btnSiguienteReconocer');

  function iniciarReconocer() {
    actividadActual = 'reconocer';
    itemsReconocer = App.utils.shuffle(banco().reconocer).slice(0, banco().porRonda);
    idxR = 0;
    aciertosR = 0;
    ocultarTodas();
    pantallaReconocer.classList.remove('oculto');
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
    explicacionRWrap.classList.add('oculto');
    explicacionREl.textContent = '';
    btnSiguienteR.classList.add('oculto');
    opcionesREl.innerHTML = '';

    var opciones = App.utils.shuffle(item.opciones.map(function (opt, i) {
      return { texto: opt, esCorrecta: i === item.correcta };
    }));
    opciones.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { responderReconocer(btn, op.esCorrecta, item); });
      opcionesREl.appendChild(btn);
    });

    pintarProgresoR();
    pintarEstrellas();
  }

  function mostrarExplicacionR(esCorrecta, item) {
    var texto = esCorrecta
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.opciones[item.correcta] + '.';
    explicacionREl.textContent = texto;
    explicacionRWrap.classList.remove('oculto');
  }

  function responderReconocer(btn, esCorrecta, item) {
    if (resueltoR) return;
    if (esCorrecta) {
      mostrarExplicacionR(esCorrecta, item);
      resueltoR = true;
      btn.classList.add('correcta');
      App.utils.$$('#opcionesReconocer .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackREl);
      progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      aciertosR += 1;
      guardar();
      pintarEstrellas();
      btnSiguienteR.classList.remove('oculto');
      btnSiguienteR.focus();
    } else {
      intentosR += 1;
      if (intentosR === 1) {
        explicacionREl.textContent = App.i18n.t('pista') + '"' + item.situacion + '"';
        explicacionRWrap.classList.remove('oculto');
      } else {
        mostrarExplicacionR(esCorrecta, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackREl);
      App.feedback.lockUntilAck(App.utils.$$('#opcionesReconocer .btn-opcion'), explicacionRWrap);
    }
  }

  function siguienteReconocer() {
    idxR += 1;
    if (idxR >= banco().porRonda) {
      terminarReconocer();
    } else {
      renderReconocer();
    }
  }

  function terminarReconocer() {
    progreso.completadoReconocer += 1;
    guardar();
    ocultarTodas();
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ================= Actividad 2: practica la llamada ================= */
  var listasLlamada = [];
  var idxL = 0;
  var aciertosL = 0;
  var siguienteEsperadoL = 0;
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
    pantallaLlamada.classList.remove('oculto');
    renderLlamada();
  }

  function pintarProgresoL() {
    var total = listasLlamada.length;
    progressLFill.style.width = ((idxL / total) * 100) + '%';
    progressLText.textContent = '';
  }

  function renderLlamada() {
    var lista = listasLlamada[idxL];
    siguienteEsperadoL = 0;
    slotsL = new Array(lista.items.length).fill(null);
    feedbackLEl.textContent = '';
    feedbackLEl.className = 'feedback';
    listaTituloEl.textContent = lista.nombre;

    pintarSlotsL();

    disponiblesEl.innerHTML = '';
    App.utils.shuffle(lista.items.map(function (item, orden) {
      return { item: item, orden: orden };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn tarea-btn';
      btn.innerHTML = '<span class="tarea-picto" aria-hidden="true">' + p.item.picto + '</span>' +
        '<span class="tarea-texto">' + p.item.texto + '</span>';
      btn.setAttribute('aria-label', App.i18n.t('ariaPaso') + ': ' + p.item.texto);
      btn.addEventListener('click', function () { tocarL(p.orden, btn); });
      disponiblesEl.appendChild(btn);
    });

    pintarProgresoL();
    pintarEstrellas();
  }

  function pintarSlotsL() {
    secuenciaEl.innerHTML = '';
    slotsL.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'slot' + (item ? ' lleno' : '');
      if (item) {
        div.innerHTML = '<span class="tarea-picto" aria-hidden="true">' + item.picto + '</span>' +
          '<span class="tarea-texto">' + item.texto + '</span>';
      } else {
        div.textContent = String(i + 1);
      }
      secuenciaEl.appendChild(div);
    });
  }

  function tocarL(orden, btn) {
    var lista = listasLlamada[idxL];
    if (orden === siguienteEsperadoL) {
      slotsL[orden] = lista.items[orden];
      pintarSlotsL();
      btn.disabled = true;
      btn.classList.add('colocada');
      App.feedback.success(feedbackLEl);
      siguienteEsperadoL += 1;
      if (siguienteEsperadoL >= lista.items.length) {
        terminarTareaL();
      }
    } else {
      App.feedback.encourage(feedbackLEl);
    }
  }

  function terminarTareaL() {
    progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    aciertosL += 1;
    guardar();
    pintarEstrellas();
    idxL += 1;
    if (idxL >= listasLlamada.length) {
      setTimeout(terminarLlamada, 900);
    } else {
      setTimeout(renderLlamada, 900);
    }
  }

  function terminarLlamada() {
    progreso.completadoLlamada += 1;
    guardar();
    ocultarTodas();
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaReconocer').addEventListener('click', iniciarReconocer);
  $('#tarjetaLlamada').addEventListener('click', iniciarLlamada);
  $('#btnVolverReconocer').addEventListener('click', irMenu);
  $('#btnVolverLlamada').addEventListener('click', irMenu);
  btnSiguienteR.addEventListener('click', siguienteReconocer);
  $('#btnEscucharReconocer').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(itemsReconocer[idxR].situacion);
  });
  $('#btnRepetir').addEventListener('click', function () {
    if (actividadActual === 'reconocer') iniciarReconocer();
    else iniciarLlamada();
  });
  $('#btnVolverMenuFinal').addEventListener('click', irMenu);


  irMenu();
})();

