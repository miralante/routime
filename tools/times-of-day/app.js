/* ============================================================
   Apptonomia — Partes del Día (autonomía: organizar tareas diarias)
   Datos en data.js (DATA.niveles, DATA.momentos). Módulos
   compartidos en assets/js/. Mecánica: aparece una tarea con picto
   y hay que tocar la caja del momento del día al que pertenece
   (Mañana, Tarde, Noche). Cada acierto se añade a la lista visual
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

  /* Round state */
  var nivel = null;
  var items = [];
  var idx = 0;
  var aciertosRonda = 0;
  var resuelto = false;
  var intentos = 0;
  var listasEl = {}; /* momento -> <ul> donde se acumulan los aciertos */

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  /* ---- Pantalla inicial ---- */
  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    banco().niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completados[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">' + App.i18n.t('veces').replace('{n}', veces) + '</span>';
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

  function iniciarRonda(n) {
    nivel = n;
    items = App.utils.shuffle(nivel.items).slice(0, banco().porRonda);
    idx = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    pintarColumnasVacias();
    render();
  }

  function pintarProgreso() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idx / porRonda) * 100) + '%';
    progressText.textContent = idx + ' / ' + porRonda;
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
    App.tts.stop();
    if (idx >= banco().porRonda) {
      terminarRonda();
    } else {
      render();
    }
  }

  function terminarRonda() {
    progreso.completados[nivel.id] = (progreso.completados[nivel.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda).replace('{total}', progreso.estrellas);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnEscuchar.addEventListener('click', function () {
    App.tts.speak(items[idx].tarea);
  });
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarRonda(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });

  pintarNiveles();
  pintarEstrellas();
})();

