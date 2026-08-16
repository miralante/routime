/* ============================================================
   Routime — ¿Dónde lo guardo? (autonomía: organización del hogar)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: aparece un objeto con picto y hay que tocar la caja
   del sitio de la casa donde se guarda. Ronda de 10 objetos por nivel.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'donde-lo-guardo';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var itemPictoEl = $('#itemPicto');
  var itemPalabraEl = $('#itemPalabra');
  var cajasEl = $('#cajas');
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
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');

    itemPictoEl.textContent = item.picto;
    itemPalabraEl.textContent = item.palabra;

    cajasEl.innerHTML = '';
    App.utils.shuffle(nivel.categorias).forEach(function (categoria) {
      var fila = document.createElement('div');
      fila.className = 'fila-caja';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn caja';
      btn.textContent = categoria;
      btn.addEventListener('click', function () { responder(btn, categoria === item.categoria, item); });

      var btnAudio = document.createElement('button');
      btnAudio.type = 'button';
      btnAudio.className = 'btn btn-audio';
      btnAudio.textContent = '🔊';
      btnAudio.setAttribute('aria-label', App.i18n.t('escucharCategoria').replace('{categoria}', categoria));
      btnAudio.addEventListener('click', function () { App.tts.speak(categoria); });

      fila.appendChild(btn);
      fila.appendChild(btnAudio);
      cajasEl.appendChild(fila);
    });

    pintarProgreso();
    pintarEstrellas();
  }

  function mostrarExplicacion(esCorrecta, item) {
    var texto = esCorrecta
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.categoria + '.';
    explicacionEl.textContent = texto;
    explicacionWrap.classList.remove('oculto');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is encouraged to think again. Only on the second
     mistake is the correct place stated (mostrarExplicacion). */
  function mostrarPista() {
    explicacionEl.textContent = App.i18n.t('pista');
    explicacionWrap.classList.remove('oculto');
  }

  function responder(btn, esCorrecta, item) {
    if (resuelto) return;
    if (esCorrecta) {
      mostrarExplicacion(esCorrecta, item);
      resuelto = true;
      btn.classList.add('correcta');
      App.utils.$$('.caja', cajasEl).forEach(function (b) { b.disabled = true; });
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
      App.feedback.lockUntilAck(App.utils.$$('.caja', cajasEl), explicacionWrap);
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
    App.tts.speak(items[idx].palabra);
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

