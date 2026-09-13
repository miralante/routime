/* ============================================================
   Routime â€” Blocks (visual-spatial construction)
   Data in data.js (DATA.niveles with 16-cell models).
   Mechanic: a 4Ã—4 model with colored blocks is shown; next to it,
   an empty grid and a palette of 3 colors. Pick a color and tap
   cells to copy it. Kind, immediate validation: correct paint â†’
   success; first mistake on a cell â†’ Socratic hint (rule 12);
   second mistake â†’ it's explained and self-corrected (rule 11),
   nobody gets stuck. Round of 3 models; 1 star per completed build.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'los-bloques';
  var $ = App.utils.$;
  var CLAVES = ['R', 'B', 'Y'];

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var modeloEl = $('#gridModelo');
  var tableroEl = $('#gridTuyo');
  var paletaEl = $('#paleta');
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
  if (typeof progreso.rondasCompletadas !== 'number') progreso.rondasCompletadas = 0;

  /* Round state */
  var nivelActual = null;
  var idxModelo = 0;
  var aciertosRonda = 0;
  var modelo = [];          /* 'R'|'B'|'Y'|null Ã—16 */
  var pintado = [];         /* same shape, what the person has painted so far */
  var botonesCelda = [];
  var colorSel = 'R';
  var intentosCelda = {};   /* idx -> number of mistakes (rule 12) */
  var completado = false;

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = 'â­ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }
  function nombreColor(c) { return banco().colores[c]; }

  );
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
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idxModelo / porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function nuevoModelo() {
    var str = App.utils.shuffle(nivel.modelos)[0];
    modelo = str.split('').map(function (ch) { return ch === '.' ? null : ch; });
    pintado = new Array(16).fill(null);
    intentosCelda = {};
    completado = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');

    pintarModelo();
    pintarTablero();
    pintarPaleta();
    pintarProgreso();
    pintarEstrellas();
  }

  function pintarModelo() {
    modeloEl.innerHTML = '';
    modelo.forEach(function (c) {
      var div = document.createElement('div');
      div.className = 'celda-modelo' + (c ? ' c-' + c : '');
      modeloEl.appendChild(div);
    });
  }

  function ariaCelda(i) {
    var f = Math.floor(i / 4) + 1;
    var c = (i % 4) + 1;
    var clave = pintado[i] ? 'ariaCeldaPintada' : 'ariaCeldaVacia';
    return App.i18n.t(clave)
      .replace('{color}', pintado[i] ? nombreColor(pintado[i]) : '')
      .replace('{f}', f).replace('{c}', c);
  }

  function pintarTablero() {
    tableroEl.innerHTML = '';
    botonesCelda = [];
    for (var i = 0; i < 16; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'celda-tuya' + (pintado[i] ? ' c-' + pintado[i] : '');
      btn.disabled = pintado[i] !== null || completado;
      btn.setAttribute('aria-label', ariaCelda(i));
      (function (idx, b) {
        b.addEventListener('click', function () { tocarCelda(idx); });
      })(i, btn);
      tableroEl.appendChild(btn);
      botonesCelda.push(btn);
    }
  }

  function pintarPaleta() {
    paletaEl.innerHTML = '';
    CLAVES.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-color c-' + c;
      btn.setAttribute('aria-label', App.i18n.t('ariaColor').replace('{color}', nombreColor(c)));
      btn.setAttribute('aria-pressed', c === colorSel ? 'true' : 'false');
      btn.addEventListener('click', function () {
        colorSel = c;
        App.utils.$$('.btn-color', paletaEl).forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t('eligeColor').replace('{color}', nombreColor(c)));
      });
      paletaEl.appendChild(btn);
    });
  }

  function limpiarAviso() {
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
  }

  function mostrarAviso(texto) {
    explicacionEl.textContent = texto;
    explicacionWrap.classList.remove('oculto');
  }

  function pintarCelda(i, color) {
    pintado[i] = color;
    var btn = botonesCelda[i];
    btn.classList.add('c-' + color, 'recien');
    btn.disabled = true;
    btn.setAttribute('aria-label', ariaCelda(i));
  }

  function tocarCelda(i) {
    if (completado || pintado[i] !== null) return;
    limpiarAviso();
    if (modelo[i] === colorSel) {
      pintarCelda(i, colorSel);
      App.feedback.success(feedbackEl);
      comprobarCompletado();
    } else {
      intentosCelda[i] = (intentosCelda[i] || 0) + 1;
      App.feedback.encourage(feedbackEl);
      if (intentosCelda[i] === 1) {
        /* Rule 12: first mistake â†’ hint, never the answer */
        mostrarAviso(App.i18n.t(modelo[i] === null ? 'pistaVacia' : 'pistaColor'));
      } else if (modelo[i] === null) {
        /* Empty cell in the model: it's explained, nothing to correct */
        mostrarAviso(App.i18n.t('malVacia'));
      } else {
        /* Second mistake with a color: it's explained and self-corrected */
        mostrarAviso(App.i18n.t('malColor').replace('{color}', nombreColor(modelo[i])));
        pintarCelda(i, modelo[i]);
        comprobarCompletado();
      }
    }
  }

  function quedanBloques() {
    for (var i = 0; i < 16; i++) {
      if (modelo[i] !== null && pintado[i] === null) return true;
    }
    return false;
  }

  function comprobarCompletado() {
    if (quedanBloques()) return;
    completado = true;
    idxModelo += 1;
    aciertosRonda += 1;
    progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    guardar();
    pintarEstrellas();
    pintarProgreso();
    botonesCelda.forEach(function (b) { b.disabled = true; });
    App.feedback.celebrate(App.i18n.t('construccionCompletada'));
    btnSiguiente.classList.remove('oculto');
    btnSiguiente.focus();
  }

  function siguiente() {
    if (idxModelo >= banco().porRonda) {
      terminarRonda();
    } else {
      nuevoModelo();
    }
  }

  function terminarRonda() {
    progreso.completados[nivelActual.id] = (progreso.completados[nivelActual.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarJuego(); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });

  pintarEstrellas();
})();

