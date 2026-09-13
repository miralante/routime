/* ============================================================
   Routime â€” SeÃ±ales (seÃ±ales de peligro, avisos, baÃ±o, etc.)
   Datos en data.js (DATA.niveles). MÃ³dulos compartidos en assets/js/.
   MecÃ¡nica: ver una seÃ±al y elegir quÃ© significa entre 4 opciones.
   Ronda de 8. El error nunca se castiga.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'senales';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var senalVisual = $('#senalVisual');
  var senalNombre = $('#senalNombre');
  var opcionesEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnEscuchar = $('#btnEscuchar');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};
  if (typeof progreso.rondasCompletadas !== 'number') progreso.rondasCompletadas = 0;

  /* Round state */
  var nivelActual = null;
  var items = [];
  var idx = 0;
  var aciertosRonda = 0;
  var resuelto = false;
  var intentos = 0;

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = 'â­ ' + progreso.estrellas; }

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  );
      cont.appendChild(btn);
    });
  }

    /* Determina el nivel segÃºn el progreso: cada ronda completada, sube un nivel. */
  function nivelSegunProgreso() {
    var idxN = Math.min(progreso.rondasCompletadas, banco().niveles.length - 1);
    return banco().niveles[idxN];
  }

  /* Muestra la dificultad actual (etiqueta del nivel). */
  function pintarDificultad() {
    if (dificultadEl) {
      dificultadEl.textContent = nivelActual.nombre;
    }
  }

  function iniciarJuego() {
    nivelActual = nivelSegunProgreso();
function pintarProgreso() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idx / porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function render() {
    var item = items[idx];
    resuelto = false;
    intentos = 0;
    senalVisual.textContent = item.senal;
    senalVisual.className = 'senal-visual ' + item.tipo;
    senalNombre.textContent = item.nombre;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');
    opcionesEl.innerHTML = '';

    var opciones = App.utils.shuffle(item.opciones.map(function (opt, i) {
      return { texto: opt, esCorrecta: i === item.correcta };
    }));

    opciones.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { responder(btn, op.esCorrecta, item); });
      opcionesEl.appendChild(btn);
    });

    pintarProgreso();
    pintarEstrellas();
  }

  function mostrarExplicacion(esCorrecta, item) {
    var texto = esCorrecta
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.opciones[item.correcta] + '.';
    explicacionEl.textContent = texto;
    explicacionWrap.classList.remove('oculto');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is pointed back to the situation already on screen.
     Only on the second mistake is the correct answer explained
     (mostrarExplicacion). */
  function mostrarPista(item) {
    explicacionEl.textContent = App.i18n.t('pista') + '"' + item.nombre + '"';
    explicacionWrap.classList.remove('oculto');
  }

  function responder(btn, esCorrecta, item) {
    if (resuelto) return;
    if (esCorrecta) {
      mostrarExplicacion(esCorrecta, item);
      resuelto = true;
      btn.classList.add('correcta');
      App.utils.$$('#opciones .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      aciertosRonda += 1;
      guardar();
      pintarEstrellas();
      btnSiguiente.classList.remove('oculto');
      btnSiguiente.focus();
    } else {
      intentos += 1;
      if (intentos === 1) {
        mostrarPista(item);
      } else {
        mostrarExplicacion(esCorrecta, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('#opciones .btn-opcion'), explicacionWrap);
    }
  }

  function siguiente() {
    idx += 1;
    if (idx >= banco().porRonda) {
      terminarRonda();
    } else {
      render();
    }
  }

  function terminarRonda() {
    progreso.completados[nivelActual.id] = (progreso.completados[nivelActual.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnEscuchar.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].nombre);
  });
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarJuego(); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });

  pintarEstrellas();
})();

