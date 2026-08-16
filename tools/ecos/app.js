/* ============================================================
   Routime — Ecos (memoria auditiva y ritmo)
   Datos en data.js (DATA.colores, DATA.niveles). Módulos
   compartidos en assets/js/. Mecánica tipo "Simon": se reproduce
   una secuencia de colores con sonido y hay que repetirla tocando
   los paneles en el mismo orden. Un fallo no penaliza: se repite
   la secuencia desde el principio y se puede volver a intentar.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'ecos';
  var $ = App.utils.$;
  var banco = DATA[App.i18n.locale()] || DATA.es;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var etapaTextoEl = $('#etapaTexto');
  var padsEl = $('#pads');
  var feedbackEl = $('#feedback');
  var btnRepetirSecuencia = $('#btnRepetirSecuencia');
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
  var idx = 0;
  var aciertosRonda = 0;
  var secuencia = [];
  var posicionEsperada = 0;
  var reproduciendo = false;

  /* Sonido: un tono por color, Web Audio. Falla en silencio. */
  var audioCtx = null;
  function tono(frecuencia, duracion) {
    try {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frecuencia;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracion);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duracion);
    } catch (e) { /* silencio */ }
  }

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    banco.niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completados[n.id] || 0;
      var nombre = App.i18n.t(n.nombreKey);
      var descripcion = App.i18n.t(n.descripcionKey);
      var vecesTxt = App.i18n.t('veces').replace('{n}', veces);
      btn.innerHTML = nombre + ' — ' + descripcion +
        ' <span class="nivel-info">(' + vecesTxt + ')</span>';
      btn.addEventListener('click', function () { iniciarRonda(n); });
      cont.appendChild(btn);
    });
  }

  function iniciarRonda(n) {
    nivel = n;
    idx = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    pintarPads();
    render();
  }

  function pintarProgreso() {
    progressFill.style.width = ((idx / banco.porRonda) * 100) + '%';
    progressText.textContent = idx + ' / ' + banco.porRonda;
  }

  function pintarPads() {
    padsEl.innerHTML = '';
    banco.colores.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pad pad-' + c.id;
      btn.textContent = App.i18n.t(c.nombreKey);
      btn.dataset.id = c.id;
      btn.addEventListener('click', function () { tocarPad(c.id, btn); });
      padsEl.appendChild(btn);
    });
  }

  function nuevaSecuencia() {
    secuencia = [];
    for (var i = 0; i < nivel.longitud; i++) {
      secuencia.push(banco.colores[Math.floor(Math.random() * banco.colores.length)].id);
    }
  }

  function render() {
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnSiguiente.classList.add('oculto');
    nuevaSecuencia();
    posicionEsperada = 0;
    pintarProgreso();
    pintarEstrellas();
    reproducirSecuencia();
  }

  function reproducirSecuencia() {
    if (reproduciendo) return;
    reproduciendo = true;
    etapaTextoEl.textContent = App.i18n.t('etapaMiraEscucha');
    App.utils.$$('.pad').forEach(function (p) { p.disabled = true; });

    var i = 0;
    function paso() {
      if (i >= secuencia.length) {
        reproduciendo = false;
        etapaTextoEl.textContent = App.i18n.t('etapaTuTurno');
        App.utils.$$('.pad').forEach(function (p) { p.disabled = false; });
        return;
      }
      var color = secuencia[i];
      var pad = padsEl.querySelector('[data-id="' + color + '"]');
      var frecuencia = banco.colores.filter(function (c) { return c.id === color; })[0].frecuencia;
      pad.classList.add('activo');
      tono(frecuencia, 0.35);
      setTimeout(function () {
        pad.classList.remove('activo');
        i += 1;
        setTimeout(paso, 200);
      }, 450);
    }
    paso();
  }

  function tocarPad(color, btn) {
    if (reproduciendo) return;
    var frecuencia = banco.colores.filter(function (c) { return c.id === color; })[0].frecuencia;
    tono(frecuencia, 0.2);
    btn.classList.add('activo');
    setTimeout(function () { btn.classList.remove('activo'); }, 200);

    if (color === secuencia[posicionEsperada]) {
      posicionEsperada += 1;
      if (posicionEsperada >= secuencia.length) {
        terminarSecuencia();
      }
    } else {
      App.feedback.encourage(feedbackEl);
      posicionEsperada = 0;
      etapaTextoEl.textContent = App.i18n.t('etapaCasi');
      setTimeout(reproducirSecuencia, 700);
    }
  }

  function terminarSecuencia() {
    App.feedback.success(feedbackEl);
    progreso.estrellas += 1;
    aciertosRonda += 1;
    guardar();
    pintarEstrellas();
    etapaTextoEl.textContent = App.i18n.t('etapaCompleta');
    btnSiguiente.classList.remove('oculto');
    btnSiguiente.focus();
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
    progreso.completados[nivel.id] = (progreso.completados[nivel.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda)
      .replace('{total}', progreso.estrellas);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  btnRepetirSecuencia.addEventListener('click', reproducirSecuencia);
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

