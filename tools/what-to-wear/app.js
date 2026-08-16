/* ============================================================
   Routime — ¿Qué me pongo? (autonomía: vestirse según el tiempo)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: leer qué tiempo hace (mucho calor, mucho frío, lluvia)
   y elegir la prenda adecuada para una parte del cuerpo entre 3
   opciones. Ronda de 8. El error nunca se castiga.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'que-me-pongo';
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
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idx / porRonda) * 100) + '%';
    progressText.textContent = idx + ' / ' + porRonda;
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
    explicacionEl.textContent = App.i18n.t('pista') + '"' + item.situacion + '"';
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
    App.tts.speak(items[idx].situacion);
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

