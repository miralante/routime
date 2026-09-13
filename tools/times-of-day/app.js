/* ============================================================
   Routime â€” Partes del DÃ­a (autonomÃ­a: organizar tareas diarias)
   Datos en data.js (DATA.niveles, DATA.momentos). MÃ³dulos
   compartidos en assets/js/. MecÃ¡nica: aparece una tarea con picto
   y hay que tocar la caja del momento del dÃ­a al que pertenece
   (MaÃ±ana, Tarde, Noche). Cada acierto se aÃ±ade a la lista visual
   de esa caja, que se va construyendo durante toda la ronda.
   Ronda de 9 tareas por nivel. El error nunca se castiga.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'partes-del-dia';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var itemPictoEl = $('#itemPicto');
  var itemTareaEl = $('#itemTarea');
  var listasDiaEl = $('#listasDia');
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
  var listasEl = {}; /* momento -> <ul> donde se acumulan los aciertos */

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = 'â­ ' + progreso.estrellas; }

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  /* ---- Pantalla inicial ---- */
  ', veces) + '</span>';
      btn.addEventListener('click', function () { iniciarRonda(n); });
      cont.appendChild(btn);
    });
  }

  /* Builds the 3 empty columns (header + list) once per
     round; they fill in with each correct answer, without resetting
     between tasks (unlike the rest of the game screen). */
  function pintarColumnasVacias() {
    listasDiaEl.innerHTML = '';
    listasEl = {};
    banco().momentos.forEach(function (momento) {
      var columna = document.createElement('div');
      columna.className = 'columna-dia';

      var btnCaja = document.createElement('button');
      btnCaja.type = 'button';
      btnCaja.className = 'btn caja';
      btnCaja.textContent = momento;
      btnCaja.addEventListener('click', function () {
        responder(btnCaja, momento === items[idx].momento, items[idx], momento);
      });

      var lista = document.createElement('ul');
      lista.className = 'lista-tareas';

      columna.appendChild(btnCaja);
      columna.appendChild(lista);
      listasDiaEl.appendChild(columna);
      listasEl[momento] = { lista: lista, boton: btnCaja };
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
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');

    itemPictoEl.textContent = item.picto;
    itemTareaEl.textContent = item.tarea;
    App.utils.$$('.btn.caja', listasDiaEl).forEach(function (b) {
      b.disabled = false;
      b.classList.remove('animo', 'correcta');
    });

    pintarProgreso();
    pintarEstrellas();
  }

  function mostrarExplicacion(esCorrecta, item) {
    var texto = esCorrecta
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.momento + '.';
    explicacionEl.textContent = texto;
    explicacionWrap.classList.remove('oculto');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is encouraged to think again. Only on the second
     mistake is the correct time of day stated (mostrarExplicacion). */
  function mostrarPista() {
    explicacionEl.textContent = App.i18n.t('pista');
    explicacionWrap.classList.remove('oculto');
  }

  function anadirALista(item) {
    var destino = listasEl[item.momento];
    var li = document.createElement('li');
    li.textContent = item.picto + ' ' + item.tarea;
    destino.lista.appendChild(li);
  }

  function responder(btn, esCorrecta, item, momentoElegido) {
    if (resuelto) return;
    if (esCorrecta) {
      mostrarExplicacion(esCorrecta, item);
      resuelto = true;
      anadirALista(item);
      App.utils.$$('.btn.caja', listasDiaEl).forEach(function (b) { b.disabled = true; });
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
        mostrarPista();
      } else {
        mostrarExplicacion(esCorrecta, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('.btn.caja', listasDiaEl), explicacionWrap);
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
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].tarea);
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

