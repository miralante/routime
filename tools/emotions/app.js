/* ============================================================
   Routime — ¿Cómo me siento? (gestión emocional)
   Identificar la emoción current → respuesta adaptada + registro.
   Todas las emociones son válidas: nunca se juzga.
   Registro diario en storage → vista "Mi semana" (7 días).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'emociones';
  var $ = App.utils.$;

  var selectionScreen = $('#selectionScreen');
  var responseScreen = $('#responseScreen');
  var breathingScreen = $('#breathingScreen');
  var weekScreen = $('#weekScreen');

  /* Progreso: historial de emociones [{fecha, id}] */
  var progress = App.storage.get(TOOL_ID);
  if (!Array.isArray(progress.historial)) progress.historial = [];

  var emocionActual = null;
  var respiracionTimer = null;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  function save() { App.storage.set(TOOL_ID, progress); }

  function showScreen(screen) {
    [selectionScreen, responseScreen, breathingScreen, weekScreen]
      .forEach(function (p) { p.classList.add('hidden'); });
    screen.classList.remove('hidden');
  }

  /* ---- Emotion selection ---- */
  function renderEmotions() {
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
        '<span class="name" style="color:' + emo.color + '">' + emo.name + '</span>';
      btn.addEventListener('click', function () { select(emo); });
      cont.appendChild(btn);
    });
  }

  function select(emo) {
    emocionActual = emo;

    /* Log it (one entry per day: the last one chosen) */
    var hoy = App.utils.hoy();
    progress.historial = progress.historial.filter(function (r) {
      return r.fecha !== hoy;
    });
    progress.historial.push({ fecha: hoy, id: emo.id });
    /* Keep only the last 30 days */
    if (progress.historial.length > 30) {
      progress.historial = progress.historial.slice(-30);
    }
    save();

    /* Paint the adapted response */
    $('#respuestaPicto').textContent = '';
    $('#respuestaMensaje').textContent = '';
    $('#respuestaMensaje').style.color = emo.color;
    $('#respuestaSugerencia').textContent = '';
    document.body.style.background = emo.colorSuave;

    var btnRespirar = $('#btnRespirar');
    if (emo.sugerencia.tipo === 'respiracion') {
      btnRespirar.classList.remove('hidden');
    } else {
      btnRespirar.classList.add('hidden');
    }

    showScreen(responseScreen);
    /* Audio only plays if the user taps the "Listen" button (btnOirRespuesta) */
  }

  /* ---- Breathing exercise (3 cycles) ---- */
  function respirar() {
    showScreen(breathingScreen);
    var circulo = $('#circuloRespiracion');
    var text = $('#textoRespiracion');
    var ciclosEl = $('#ciclosRespiracion');
    var ciclo = 0;
    var TOTAL = 3;

    /* Start small so the first "coge aire" truly animates from nothing */
    circulo.className = 'encoger';

    function paso(inhalar) {
      if (ciclo >= TOTAL) {
        text.textContent = App.i18n.t('respiracionFinal');
        ciclosEl.textContent = '';
        if (App.tts && App.tts.speak) App.tts.speak(App.i18n.t('respiracionFinal'));
        circulo.className = '';
        return;
      }
      ciclosEl.textContent = '';
      if (inhalar) {
        text.textContent = App.i18n.t('cogeAire');
        if (App.tts && App.tts.speak) App.tts.speak(App.i18n.t('cogeAire'));
        circulo.className = 'crecer';
      } else {
        text.textContent = App.i18n.t('sueltaAire');
        if (App.tts && App.tts.speak) App.tts.speak(App.i18n.t('sueltaAire'));
        circulo.className = 'encoger';
        ciclo += 1;
      }
      respiracionTimer = setTimeout(function () { paso(!inhalar); }, 4000);
    }

    paso(true);
  }

  function salirRespiracion() {
    clearTimeout(respiracionTimer);
    showScreen(responseScreen);
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
      for (var j = 0; j < progress.historial.length; j++) {
        if (progress.historial[j].fecha === clave) registro = progress.historial[j];
      }
      var emo = registro ? DATOS.emociones.filter(function (e) { return e.id === registro.id; })[0] : null;

      var row = document.createElement('div');
      row.className = 'dia-semana card';
      var nombreDia = (i === 0) ? App.i18n.t('hoy') : DATOS.dias[d.getDay()];
      row.innerHTML =
        '<span class="dia">' + nombreDia + '</span>' +
        '<span class="picto" aria-hidden="true">' + (emo ? emo.picto : '·') + '</span>' +
        '<span class="name">' + (emo ? emo.name : App.i18n.t('sinRegistro')) + '</span>';
      cont.appendChild(row);
    }
    showScreen(weekScreen);
  }

  function volverSeleccion() {
    document.body.style.background = '';
    showScreen(selectionScreen);
  }

  /* Events */
  $('#btnPregunta').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t('pregunta'));
  });
  $('#btnOirRespuesta').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(emocionActual.mensaje + ' ' + emocionActual.sugerencia.textContent);
  });
  $('#btnRespirar').addEventListener('click', respirar);
  $('#btnSalirRespiracion').addEventListener('click', salirRespiracion);
  $('#btnVolverSeleccion').addEventListener('click', volverSeleccion);
  $('#btnSemana').addEventListener('click', verSemana);
  $('#btnVolverDeSemana').addEventListener('click', volverSeleccion);

  renderEmotions();
})();
