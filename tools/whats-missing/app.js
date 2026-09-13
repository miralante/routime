/* ============================================================
   Routime — ¿Qué falta? (memoria visual a corto plazo)
   Datos en data.js (DATA.pool, DATA.niveles). Módulos compartidos
   en assets/js/. Mecánica: memorizar unos objetos a su ritmo (sin
   cronómetro), luego decir cuál ha desaparecido. Ronda de 6 escenas.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'que-falta';
  var $ = App.utils.$;
  var banco = DATA[App.i18n.locale()] || DATA.es;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var etapaTextoEl = $('#etapaTexto');
  var objetosEl = $('#objetos');
  var zonaBotonEl = $('#zonaBoton');
  var zonaPreguntaEl = $('#zonaPregunta');
  var opcionesEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnListo = $('#btnListo');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var dificultadEl = $('#dificultad');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};
  if (typeof progreso.rondasCompletadas !== 'number') progreso.rondasCompletadas = 0;

  /* Round state */
  var nivelActual = null;
  var idx = 0;
  var aciertosRonda = 0;
  var resuelto = false;
  var escenaActual = [];   /* objetos de la escena actual */
  var faltante = null;
  var intentos = 0;

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  /* Determina el nivel según el progreso: cada ronda completada,
     sube un nivel. */
  function nivelSegunProgreso() {
    var idxN = Math.min(progreso.rondasCompletadas, banco.niveles.length - 1);
    return banco.niveles[idxN];
  }

  /* Muestra la dificultad actual (número de objetos a recordar). */
  function pintarDificultad() {
    if (dificultadEl) {
      var n = nivelActual.cantidad;
      dificultadEl.textContent = n + ' ' + App.i18n.t(n === 1 ? 'objeto' : 'objetos');
    }
  }

  function iniciarJuego() {
    nivelActual = nivelSegunProgreso();
    idx = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    pintarDificultad();
    render();
  }

  function pintarProgreso() {
    progressFill.style.width = ((idx / banco.porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function render() {
    resuelto = false;
    faltante = null;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');
    zonaPreguntaEl.classList.add('oculto');
    zonaBotonEl.classList.remove('oculto');
    etapaTextoEl.textContent = App.i18n.t('etapaRecuerda');

    escenaActual = App.utils.shuffle(banco.pool).slice(0, nivelActual.cantidad);
    pintarObjetos(escenaActual);

    pintarProgreso();
    pintarEstrellas();
  }

  function pintarObjetos(lista) {
    objetosEl.innerHTML = '';
    lista.forEach(function (picto) {
      var div = document.createElement('div');
      div.className = 'objeto' + (picto ? '' : ' vacio');
      div.textContent = picto || '';
      objetosEl.appendChild(div);
    });
  }

  function ocultarUno() {
    intentos = 0;
    var i = Math.floor(Math.random() * escenaActual.length);
    faltante = escenaActual[i];
    var conHueco = escenaActual.slice();
    conHueco[i] = null;
    etapaTextoEl.textContent = App.i18n.t('pregunta');
    pintarObjetos(conHueco);
    zonaBotonEl.classList.add('oculto');
    zonaPreguntaEl.classList.remove('oculto');

    var distractores = App.utils.shuffle(
      banco.pool.filter(function (p) { return escenaActual.indexOf(p) === -1; })
    ).slice(0, 2);
    var opciones = App.utils.shuffle(
      [faltante].concat(distractores).map(function (p) {
        return { picto: p, esCorrecta: p === faltante };
      })
    );

    opcionesEl.innerHTML = '';
    opciones.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion opcion-picto';
      btn.textContent = op.picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaObjeto'));
      btn.addEventListener('click', function () { responder(btn, op.esCorrecta); });
      opcionesEl.appendChild(btn);
    });
  }

  function mostrarExplicacion(esCorrecta) {
    var texto = esCorrecta
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + faltante;
    explicacionEl.textContent = texto;
    explicacionWrap.classList.remove('oculto');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is encouraged to think again. Only on the second
     mistake is what was missing stated (mostrarExplicacion). */
  function mostrarPista() {
    explicacionEl.textContent = App.i18n.t('pista');
    explicacionWrap.classList.remove('oculto');
  }

  function responder(btn, esCorrecta) {
    if (resuelto) return;
    if (esCorrecta) {
      mostrarExplicacion(esCorrecta);
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
        mostrarPista();
      } else {
        mostrarExplicacion(esCorrecta);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('#opciones .btn-opcion'), explicacionWrap);
    }
  }

  function siguiente() {
    idx += 1;
    if (idx >= banco.porRonda) {
      terminarRonda();
    } else {
      render();
    }
  }

  function terminarRonda() {
    progreso.completados[nivelActual.id] = (progreso.completados[nivelActual.id] || 0) + 1;
    progreso.rondasCompletadas += 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
    $('#resumenFinal').textContent += '\n' + App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progreso.rondasCompletadas + 1, banco.niveles.length));
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  btnListo.addEventListener('click', ocultarUno);
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnJugar').addEventListener('click', function () { iniciarJuego(); });
  $('#btnRepetir').addEventListener('click', function () { iniciarJuego(); });
  $('#btnMenu').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.add('oculto');
    pantallaInicio.classList.remove('oculto');
    pintarEstrellas();
  });

  pintarEstrellas();
})();

