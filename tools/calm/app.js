/* ============================================================
   Routime â€” Calm (guided breathing and relaxation)
   Data in data.js (DATA.niveles). Shared modules in assets/js/.
   Mechanic: a circle grows and shrinks marking the breathing
   rhythm, with text and voice. No visible timer and no way to
   fail: every finished session earns a star.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'calma';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaSesion = $('#pantallaSesion');
  var pantallaFinal = $('#pantallaFinal');
  var circulo = $('#circuloRespiracion');
  var texto = $('#textoRespiracion');
  var ciclosEl = $('#ciclosRespiracion');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};
  if (typeof progreso.rondasCompletadas !== 'number') progreso.rondasCompletadas = 0;

  var nivelActual = null;
  var timer = null;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = 'â­ ' + progreso.estrellas; }

  );
      cont.appendChild(btn);
    });
  }

  function iniciarSesion(n) {
    nivel = n;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaSesion.classList.remove('oculto');
    var ciclo = 0;

    function paso(inhalar) {
      if (ciclo >= nivel.ciclos) {
        terminarSesion();
        return;
      }
      ciclosEl.textContent = '';
      if (inhalar) {
        texto.textContent = App.i18n.t('cogeAire');
        if (App.tts && App.tts.speak) App.tts.speak(App.i18n.t('cogeAire'));
        circulo.className = 'crecer';
      } else {
        texto.textContent = App.i18n.t('sueltaAire');
        if (App.tts && App.tts.speak) App.tts.speak(App.i18n.t('sueltaAire'));
        circulo.className = 'encoger';
        ciclo += 1;
      }
      timer = setTimeout(function () { paso(!inhalar); }, 4000);
    }

    /* Start small so the first "coge aire" truly animates from nothing */
    circulo.className = 'encoger';
    paso(true);
  }

  function detener() {
    if (timer) clearTimeout(timer);
    }

  function terminarSesion() {
    detener();
    progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    progreso.completados[nivelActual.id] = (progreso.completados[nivelActual.id] || 0) + 1;
    guardar();
    pintarEstrellas();
    pantallaSesion.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    var palabra = progreso.estrellas === 1 ? App.i18n.t('estrellaSingular') : App.i18n.t('estrellaPlural');
    $('#resumenFinal').textContent.textContent = '';
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('celebrarMsg'));
  }

  function terminarAntes() {
    detener();
    pantallaSesion.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  }

  /* Events */
  $('#btnTerminarSesion').addEventListener('click', terminarAntes);
  $('#btnRepetir').addEventListener('click', function () { iniciarSesion(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });

  pintarEstrellas();
})();

