/* ============================================================
   Routime — La Casa (autonomía: ordenar tareas del hogar).
   Datos en data.js (DATA.tareas). Módulos compartidos en assets/js/.
   Sin niveles: la persona entra y ordena las tareas del hogar
   directamente. Cada partida muestra 'porRonda' tareas elegidas
   al azar; en cada una se tocan los pasos en el orden correcto.
   Un toque fuera de orden no penaliza: solo anima a seguir
   intentando (regla socrática: nunca se castiga el error).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'la-casa';
  var $ = App.utils.$;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var tareaTituloEl = $('#tareaTitulo');
  var tareaPictoEl = $('#tareaPicto');
  var secuenciaEl = $('#secuencia');
  var disponiblesEl = $('#disponibles');
  var feedbackEl = $('#feedback');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.hechos) progreso.hechos = {};

  /* Round state */
  var tareas = [];
  var idx = 0;
  var aciertosRonda = 0;
  var siguienteEsperado = 0;
  var slots = [];

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function iniciarRonda() {
    tareas = App.utils.shuffle(DATOS.tareas).slice(0, DATOS.porRonda);
    idx = 0;
    aciertosRonda = 0;
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    render();
  }

  function pintarProgreso() {
    progressFill.style.width = ((idx / DATOS.porRonda) * 100) + '%';
    progressText.textContent = idx + ' / ' + DATOS.porRonda;
  }

  function render() {
    var tarea = tareas[idx];
    siguienteEsperado = 0;
    slots = new Array(tarea.pasos.length).fill(null);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnSiguiente.classList.add('oculto');
    tareaTituloEl.textContent = tarea.nombre;
    if (tareaPictoEl) tareaPictoEl.textContent = tarea.picto || '';

    pintarSlots();

    disponiblesEl.innerHTML = '';
    App.utils.shuffle(tarea.pasos.map(function (picto, orden) {
      return { picto: picto, orden: orden };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn paso';
      btn.textContent = p.picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaPaso'));
      btn.addEventListener('click', function () { tocar(p.orden, btn); });
      disponiblesEl.appendChild(btn);
    });

    pintarProgreso();
    pintarEstrellas();
  }

  function pintarSlots() {
    secuenciaEl.innerHTML = '';
    slots.forEach(function (picto) {
      var div = document.createElement('div');
      div.className = 'slot' + (picto ? ' lleno' : '');
      div.textContent = picto || '';
      secuenciaEl.appendChild(div);
    });
  }

  function tocar(orden, btn) {
    var tarea = tareas[idx];
    if (orden === siguienteEsperado) {
      slots[orden] = tarea.pasos[orden];
      pintarSlots();
      btn.disabled = true;
      btn.classList.add('colocada');
      App.feedback.success(feedbackEl);
      siguienteEsperado += 1;
      if (siguienteEsperado >= tarea.pasos.length) {
        terminarTarea();
      }
    } else {
      App.feedback.encourage(feedbackEl);
    }
  }

  function terminarTarea() {
    progreso.estrellas += 1;
    progreso.hechos[tareas[idx].id] = true;
    aciertosRonda += 1;
    guardar();
    pintarEstrellas();
    btnSiguiente.classList.remove('oculto');
    btnSiguiente.focus();
  }

  function siguiente() {
    idx += 1;
    App.tts.stop();
    if (idx >= DATOS.porRonda) {
      terminarRonda();
    } else {
      render();
    }
  }

  function terminarRonda() {
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda)
      .replace('{total}', progreso.estrellas);
    $('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', iniciarRonda);
  $('#btnVolverMenu').addEventListener('click', function () {
    window.location.href = '../../site/index.html';
  });

  pintarEstrellas();
  iniciarRonda();
})();
