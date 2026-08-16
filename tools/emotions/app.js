/* ============================================================
   Routime — ¿Cómo me siento? (gestión emocional)
   Identificar la emoción actual → respuesta adaptada + registro.
   Todas las emociones son válidas: nunca se juzga.
   Registro diario en storage → vista "Mi semana" (7 días).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'emociones';
  var $ = App.utils.$;

  var pantallaSeleccion = $('#pantallaSeleccion');
  var pantallaRespuesta = $('#pantallaRespuesta');
  var pantallaRespiracion = $('#pantallaRespiracion');
  var pantallaSemana = $('#pantallaSemana');

  /* Progreso: historial de emociones [{fecha, id}] */
  var progreso = App.storage.get(TOOL_ID);
  if (!Array.isArray(progreso.historial)) progreso.historial = [];

  var emocionActual = null;
  var respiracionTimer = null;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function mostrar(pantalla) {
    [pantallaSeleccion, pantallaRespuesta, pantallaRespiracion, pantallaSemana]
      .forEach(function (p) { p.classList.add('oculto'); });
    pantalla.classList.remove('oculto');
  }

  /* ---- Emotion selection ---- */
  function pintarEmociones() {
    var cont = $('#emociones');
    cont.innerHTML = '';
    DATOS.emociones.forEach(function (emo) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-emocion';
      btn.style.borderColor = emo.color;
      btn.style.background = emo.colorSuave;
      btn.innerHTML =
        '<span class="picto" aria-hidden="true">' + emo.picto + '</span>' +
        '<span class="nombre" style="color:' + emo.color + '">' + emo.nombre + '</span>';
      btn.addEventListener('click', function () { elegir(emo); });
      cont.appendChild(btn);
    });
  }

  function elegir(emo) {
    emocionActual = emo;

    /* Log it (one entry per day: the last one chosen) */
    var hoy = App.utils.hoy();
    progreso.historial = progreso.historial.filter(function (r) {
      return r.fecha !== hoy;
    });
    progreso.historial.push({ fecha: hoy, id: emo.id });
    /* Keep only the last 30 days */
    if (progreso.historial.length > 30) {
      progreso.historial = progreso.historial.slice(-30);
    }
    guardar();

    /* Paint the adapted response */
    $('#respuestaPicto').textContent = emo.picto;
    $('#respuestaMensaje').textContent = emo.mensaje;
    $('#respuestaMensaje').style.color = emo.color;
    $('#respuestaSugerencia').textContent = emo.sugerencia.texto;
    document.body.style.background = emo.colorSuave;

    var btnRespirar = $('#btnRespirar');
    if (emo.sugerencia.tipo === 'respiracion') {
      btnRespirar.classList.remove('oculto');
    } else {
      btnRespirar.classList.add('oculto');
    }

    mostrar(pantallaRespuesta);
    /* Audio only plays if the user taps the "Listen" button (btnOirRespuesta) */
  }

  /* ---- Breathing exercise (3 cycles) ---- */
  function respirar() {
    mostrar(pantallaRespiracion);
    var circulo = $('#circuloRespiracion');
    var texto = $('#textoRespiracion');
    var ciclosEl = $('#ciclosRespiracion');
    var ciclo = 0;
    var TOTAL = 3;

    function paso(inhalar) {
      if (ciclo >= TOTAL) {
        texto.textContent = App.i18n.t('respiracionFinal');
        ciclosEl.textContent = '';
        App.tts.speak(App.i18n.t('respiracionFinal'));
        circulo.className = '';
        return;
      }
      ciclosEl.textContent = App.i18n.t('cicloContador').replace('{n}', ciclo + 1).replace('{total}', TOTAL);
      if (inhalar) {
        texto.textContent = App.i18n.t('cogeAire');
        App.tts.speak(App.i18n.t('cogeAire'));
        circulo.className = 'crecer';
      } else {
        texto.textContent = App.i18n.t('sueltaAire');
        App.tts.speak(App.i18n.t('sueltaAire'));
        circulo.className = 'encoger';
        ciclo += 1;
      }
      respiracionTimer = setTimeout(function () { paso(!inhalar); }, 4000);
    }

    paso(true);
  }

  function salirRespiracion() {
    clearTimeout(respiracionTimer);
    App.tts.stop();
    mostrar(pantallaRespuesta);
  }

  /* ---- Mi semana ---- */
  function verSemana() {
    var cont = $('#listaSemana');
    cont.innerHTML = '';
    var hoyDate = new Date();

    for (var i = 6; i >= 0; i--) {
      var d = new Date(hoyDate);
      d.setDate(hoyDate.getDate() - i);
      var clave = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');

      var registro = null;
      for (var j = 0; j < progreso.historial.length; j++) {
        if (progreso.historial[j].fecha === clave) registro = progreso.historial[j];
      }
      var emo = registro ? DATOS.emociones.filter(function (e) { return e.id === registro.id; })[0] : null;

      var fila = document.createElement('div');
      fila.className = 'dia-semana card';
      var nombreDia = (i === 0) ? App.i18n.t('hoy') : DATOS.dias[d.getDay()];
      fila.innerHTML =
        '<span class="dia">' + nombreDia + '</span>' +
        '<span class="picto" aria-hidden="true">' + (emo ? emo.picto : '·') + '</span>' +
        '<span class="nombre">' + (emo ? emo.nombre : App.i18n.t('sinRegistro')) + '</span>';
      cont.appendChild(fila);
    }
    mostrar(pantallaSemana);
  }

  function volverSeleccion() {
    document.body.style.background = '';
    App.tts.stop();
    mostrar(pantallaSeleccion);
  }

  /* Events */
  $('#btnPregunta').addEventListener('click', function () {
    App.tts.speak(App.i18n.t('pregunta'));
  });
  $('#btnOirRespuesta').addEventListener('click', function () {
    App.tts.speak(emocionActual.mensaje + ' ' + emocionActual.sugerencia.texto);
  });
  $('#btnRespirar').addEventListener('click', respirar);
  $('#btnSalirRespiracion').addEventListener('click', salirRespiracion);
  $('#btnVolverSeleccion').addEventListener('click', volverSeleccion);
  $('#btnSemana').addEventListener('click', verSemana);
  $('#btnVolverDeSemana').addEventListener('click', volverSeleccion);

  pintarEmociones();
})();
