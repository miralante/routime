/* ============================================================
   Routime — Calm (guided breathing and relaxation)
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

  var nivel = null;
  var timer = null;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    DATOS.niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completados[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + veces + ' ' + App.i18n.t('veces') + ')</span>';
      btn.addEventListener('click', function () { iniciarSesion(n); });
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
      ciclosEl.textContent = App.i18n.t('cicloContador').replace('{n}', ciclo + 1).replace('{total}', nivel.ciclos);
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
      timer = setTimeout(function () { paso(!inhalar); }, 4000);
    }

    circulo.className = '';
    paso(true);
  }

  function detener() {
    if (timer) clearTimeout(timer);
    App.tts.stop();
  }

  function terminarSesion() {
    detener();
    progreso.estrellas += 1;
    progreso.completados[nivel.id] = (progreso.completados[nivel.id] || 0) + 1;
    guardar();
    pintarEstrellas();
    pantallaSesion.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    var palabra = progreso.estrellas === 1 ? App.i18n.t('estrellaSingular') : App.i18n.t('estrellaPlural');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', progreso.estrellas)
      .replace('{palabra}', palabra);
$('#transferencia').textContent = App.i18n.t('transferencia');
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

  pintarNiveles();
  pintarEstrellas();
})();

