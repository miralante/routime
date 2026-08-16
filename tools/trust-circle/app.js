/* ============================================================
   Routime — Circle of Trust (amigo/compañero/conocido and
   recognizing manipulation, including money requests).
   Data in data.js (DATA.niveles). Shared modules in assets/js/.
   Mechanic: read a situation and choose the correct answer among
   3 options. Levels 1-2 classify the relationship; levels 3-4
   pick the healthy response to a manipulation attempt. Each item
   carries its own pista/explicacion (Socratic: hint on the first
   mistake, explanation on the second, same as social-safety).
   Round of 8. No punishment for a wrong answer.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'trust-circle';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var situacionPictoEl = $('#situacionPicto');
  var situacionTextoEl = $('#situacionTexto');
  var opcionesEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnEscucharExplicacion = $('#btnEscucharExplicacion');
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

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    banco().niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completados[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + veces + ' ' + App.i18n.t('veces') + ')</span>';
      btn.addEventListener('click', function () { iniciarRonda(n); });
      cont.appendChild(btn);
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
    render();
  }

  function pintarProgreso() {
    progressFill.style.width = ((idx / banco().porRonda) * 100) + '%';
    progressText.textContent = idx + ' / ' + banco().porRonda;
  }

  function render() {
    var item = items[idx];
    resuelto = false;
    intentos = 0;
    situacionPictoEl.textContent = item.picto;
    situacionTextoEl.textContent = item.situacion;
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

  /* Each item carries its own pista/explicacion (unlike a generic
     reused string): the hint and explanation are specific to the
     relationship or manipulation case being shown. */
  function mostrarPista(item) {
    explicacionEl.textContent = item.pista;
    explicacionWrap.classList.remove('oculto');
  }

  function mostrarExplicacion(item) {
    explicacionEl.textContent = item.explicacion;
    explicacionWrap.classList.remove('oculto');
  }

  function responder(btn, esCorrecta, item) {
    if (resuelto) return;
    if (esCorrecta) {
      mostrarExplicacion(item);
      resuelto = true;
      btn.classList.add('correcta');
      App.utils.$$('#opciones .btn-opcion').forEach(function (b) { b.disabled = true; });
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
        mostrarPista(item);
      } else {
        mostrarExplicacion(item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('#opciones .btn-opcion'), explicacionWrap);
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
      .replace('{n}', aciertosRonda)
      .replace('{total}', progreso.estrellas);
    $('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnEscuchar.addEventListener('click', function () {
    App.tts.speak(items[idx].situacion);
  });
  btnSiguiente.addEventListener('click', siguiente);
  btnEscucharExplicacion.addEventListener('click', function () {
    App.tts.speak(explicacionEl.textContent);
  });
  $('#btnRepetir').addEventListener('click', function () { iniciarRonda(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });

  pintarNiveles();
  pintarEstrellas();
})();
