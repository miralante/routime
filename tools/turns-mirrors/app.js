/* ============================================================
   Routime — Giros y Espejos (percepción viso-espacial)
   Datos en data.js (DATA.niveles, con tipo giro/espejo/letras).
   Mecánica: se muestra un modelo y 3 opciones (regla 11); hay que
   tocar la opción correcta según el tipo del nivel:
   - giro: el mismo dibujo girado (las otras son dibujos distintos).
   - espejo: el reflejo horizontal (las otras: sin reflejar y
     reflejado en vertical).
   - letras: la letra idéntica entre sus letras espejo (b/d/p/q…).
   Primer fallo → pista socrática (regla 12); segundo fallo → se
   marca la correcta y se explica (regla 11). Ronda de 8.
   Las transformaciones se aplican con CSS (clases t-*) sobre un
   span interior, nunca sobre el botón (no rotar bordes ni foco).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'giros-espejos';
  var $ = App.utils.$;
  var GIROS = ['t-rot90', 't-rot180', 't-rot270'];

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var modeloEl = $('#modeloFigura');
  var preguntaEl = $('#pregunta');
  var opcionesEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
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
  var botonCorrecto = null;
  var itemActual = null;

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

  /* Builds the item's 3 options based on the level's type.
     Each option: { contenido, clase, esCorrecta, esLetra } */
  function construirOpciones(item) {
    if (nivel.tipo === 'giro') {
      return App.utils.shuffle([
        { contenido: item.picto, clase: App.utils.shuffle(GIROS)[0], esCorrecta: true },
        { contenido: item.distractores[0], clase: App.utils.shuffle(GIROS)[0], esCorrecta: false },
        { contenido: item.distractores[1], clase: App.utils.shuffle(GIROS)[0], esCorrecta: false }
      ]);
    }
    if (nivel.tipo === 'espejo') {
      return App.utils.shuffle([
        { contenido: item.picto, clase: 't-espejoH', esCorrecta: true },
        { contenido: item.picto, clase: '', esCorrecta: false },
        { contenido: item.picto, clase: 't-espejoV', esCorrecta: false }
      ]);
    }
    /* letras */
    return App.utils.shuffle(item.opciones.map(function (letra, i) {
      return { contenido: letra, clase: '', esCorrecta: i === item.correcta, esLetra: true };
    }));
  }

  function render() {
    var item = items[idx];
    itemActual = item;
    resuelto = false;
    intentos = 0;
    botonCorrecto = null;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');

    var esLetras = nivel.tipo === 'letras';
    modeloEl.textContent = esLetras ? item.modelo : item.picto;
    modeloEl.classList.toggle('letra', esLetras);
    var tipoCap = nivel.tipo.charAt(0).toUpperCase() + nivel.tipo.slice(1);
    preguntaEl.textContent = App.i18n.t('pregunta' + tipoCap);

    opcionesEl.innerHTML = '';
    construirOpciones(item).forEach(function (op, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opcion-figura';
      btn.setAttribute('aria-label', App.i18n.t('ariaOpcion').replace('{n}', i + 1));
      var span = document.createElement('span');
      span.className = 'figura ' + op.clase + (op.esLetra ? ' letra' : '');
      span.textContent = op.contenido;
      btn.appendChild(span);
      if (op.esCorrecta) botonCorrecto = btn;
      btn.addEventListener('click', function () { responder(btn, op.esCorrecta); });
      opcionesEl.appendChild(btn);
    });

    pintarProgreso();
    pintarEstrellas();
  }

  function claveTipo(prefijo) {
    var tipoCap = nivel.tipo.charAt(0).toUpperCase() + nivel.tipo.slice(1);
    return prefijo + tipoCap;
  }

  function responder(btn, esCorrecta) {
    if (resuelto) return;
    if (esCorrecta) {
      resuelto = true;
      btn.classList.add('correcta');
      App.utils.$$('#opciones .opcion-figura').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      explicacionEl.textContent = App.i18n.t(claveTipo('ok'));
      explicacionWrap.classList.remove('oculto');
      progreso.estrellas += 1;
      aciertosRonda += 1;
      guardar();
      pintarEstrellas();
      btnSiguiente.classList.remove('oculto');
      btnSiguiente.focus();
    } else {
      intentos += 1;
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      if (intentos === 1) {
        /* Regla 12: primer fallo → pista, nunca la respuesta */
        explicacionEl.textContent = App.i18n.t(claveTipo('pista'));
      } else {
        /* Segundo fallo → se marca la correcta y se explica */
        var texto = App.i18n.t(claveTipo('mal'));
        if (nivel.tipo === 'letras') texto = texto.replace('{letra}', itemActual.opciones[itemActual.correcta]);
        explicacionEl.textContent = texto;
        if (botonCorrecto) botonCorrecto.classList.add('sugerida');
      }
      explicacionWrap.classList.remove('oculto');
      App.feedback.lockUntilAck(App.utils.$$('#opciones .opcion-figura'), explicacionWrap);
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
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarRonda(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });
  $('#btnPregunta').addEventListener('click', function () {
    App.tts.speak(preguntaEl.textContent);
  });

  pintarNiveles();
  pintarEstrellas();
})();

