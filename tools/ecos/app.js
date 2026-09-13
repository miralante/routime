/* ============================================================
   Routime â€” Ecos (memoria auditiva y ritmo)
   Datos en data.js (DATA.colores, DATA.niveles). MÃ³dulos
   compartidos en assets/js/. MecÃ¡nica tipo "Simon": se reproduce
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
  if (typeof progreso.rondasCompletadas !== 'number') progreso.rondasCompletadas = 0;

  /* Round state */
  var nivelActual = null;
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

  function pintarEstrellas() { starsEl.textContent = 'â­ ' + progreso.estrellas; }

  ', veces);
      btn.innerHTML = nombre + ' â€” ' + descripcion +
        ' <span class="nivel-info">(' + vecesTxt + ')</span>';
      btn.addEventListener('click', function () { iniciarRonda(n); });
      cont.appendChild(btn);
    });
  }

    /* Determina el nivel segÃºn el progreso: cada ronda completada, sube un nivel. */
  function nivelSegunProgreso() {
    var idxN = Math.min(progreso.rondasCompletadas, banco().niveles.length - 1);
    return banco().niveles[idxN];
  }

  /* Muestra la dificultad actual (etiqueta del nivel). */
  function pintarDificultad() {
    if (dificultadEl) {
      dificultadEl.textContent = nivelActual.nombre;
    }
  }

  function iniciarJuego() {
    nivelActual = nivelSegunProgreso();
function pintarProgreso() {
    progressFill.style.width = ((idx / banco.porRonda) * 100) + '%';
    progressText.textContent = '';
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
      if (App.feedback && App.feedback.star) App.feedback.star();
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
    progreso.completados[nivelActual.id] = (progreso.completados[nivelActual.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  btnRepetirSecuencia.addEventListener('click', reproducirSecuencia);
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarJuego(); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });

  pintarEstrellas();
})();

