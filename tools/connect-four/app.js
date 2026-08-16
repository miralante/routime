/* ============================================================
   Routime — Cuatro en Raya (razonamiento: lógica y anticipación)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: Conecta 4 adaptado en tablero de 6 columnas × 5 filas.
   Cada COLUMNA es un único botón grande: al tocarla, la ficha cae
   sola hasta el hueco más bajo (sin caída automática ni cronómetro).
   La persona es 🟡 y siempre empieza; el rival es 🔵 y juega según
   la habilidad del nivel (azar / remata su línea / también bloquea),
   igual que en Tres en Raya. Ganar da 1 estrella; el empate se
   celebra sin estrella; perder no se castiga (regla 5): mensaje de
   ánimo con un consejo y botón de jugar otra vez.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'cuatro-en-raya';
  var $ = App.utils.$;
  var COLS = 6;
  var FILAS = 5;
  var JUGADOR = 'J';
  var RIVAL = 'R';
  var FICHA = { J: '🟡', R: '🔵' };
  var DELAY = App.utils.reducedMotion() ? 0 : 700;

  /* Every 4-square line (horizontal, vertical and diagonal),
     precomputed once as row*COLS+col indexes. */
  var LINEAS = (function () {
    var lineas = [];
    var f, c, k;
    for (f = 0; f < FILAS; f++) {
      for (c = 0; c + 3 < COLS; c++) {
        var h = []; for (k = 0; k < 4; k++) h.push(f * COLS + c + k);
        lineas.push(h);
      }
    }
    for (c = 0; c < COLS; c++) {
      for (f = 0; f + 3 < FILAS; f++) {
        var v = []; for (k = 0; k < 4; k++) v.push((f + k) * COLS + c);
        lineas.push(v);
      }
    }
    for (f = 0; f + 3 < FILAS; f++) {
      for (c = 0; c + 3 < COLS; c++) {
        var d1 = []; var d2 = [];
        for (k = 0; k < 4; k++) {
          d1.push((f + k) * COLS + c + k);
          d2.push((f + k) * COLS + c + 3 - k);
        }
        lineas.push(d1); lineas.push(d2);
      }
    }
    return lineas;
  })();

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var tableroEl = $('#tablero');
  var estadoEl = $('#estado');
  var feedbackEl = $('#feedback');
  var btnOtraPartida = $('#btnOtraPartida');
  var btnSalir = $('#btnSalir');
  var btnAyuda = $('#btnAyuda');
  var ayudaWrap = $('#ayudaWrap');
  var ayudaTextoEl = $('#ayudaTexto');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.victorias) progreso.victorias = {};

  /* Game state */
  var nivel = null;
  var celdas = [];        /* 'J' | 'R' | null, indexes 0-29 (row 0 at top) */
  var columnasEl = [];    /* button per column */
  var huecosEl = [];      /* span per cell */
  var turnoJugador = true;
  var partidaTerminada = false;
  var ayudaPaso = 0;      /* Socratic method: 1st tap asks, 2nd marks the column */

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
      var veces = progreso.victorias[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + veces + ' ' + App.i18n.t('veces') + ')</span>';
      btn.addEventListener('click', function () { iniciarPartida(n); });
      cont.appendChild(btn);
    });
  }

  /* ---- Board ---- */
  /* Row where the piece would land in column c, or -1 if it's full. */
  function filaLibre(tab, c) {
    for (var f = FILAS - 1; f >= 0; f--) {
      if (!tab[f * COLS + c]) return f;
    }
    return -1;
  }

  function columnasLibres(tab) {
    var libres = [];
    for (var c = 0; c < COLS; c++) { if (filaLibre(tab, c) !== -1) libres.push(c); }
    return libres;
  }

  function lineaGanadora(tab, quien) {
    for (var i = 0; i < LINEAS.length; i++) {
      var l = LINEAS[i];
      if (tab[l[0]] === quien && tab[l[1]] === quien && tab[l[2]] === quien && tab[l[3]] === quien) return l;
    }
    return null;
  }

  /* Column where 'quien' would complete their line of four, or -1. */
  function columnaQueCompleta(quien) {
    var libres = columnasLibres(celdas);
    for (var k = 0; k < libres.length; k++) {
      var c = libres[k];
      var f = filaLibre(celdas, c);
      celdas[f * COLS + c] = quien;
      var gana = !!lineaGanadora(celdas, quien);
      celdas[f * COLS + c] = null;
      if (gana) return c;
    }
    return -1;
  }

  function ariaColumna(c) {
    var fichas = 0;
    for (var f = 0; f < FILAS; f++) { if (celdas[f * COLS + c]) fichas += 1; }
    var clave = fichas === FILAS ? 'ariaColumnaLlena' : 'ariaColumna';
    return App.i18n.t(clave).replace('{c}', c + 1).replace('{n}', fichas);
  }

  function pintarTablero() {
    for (var c = 0; c < COLS; c++) {
      columnasEl[c].disabled = partidaTerminada || !turnoJugador || filaLibre(celdas, c) === -1;
      columnasEl[c].setAttribute('aria-label', ariaColumna(c));
    }
    huecosEl.forEach(function (span, i) {
      span.textContent = celdas[i] ? FICHA[celdas[i]] : '';
      span.classList.toggle('tuya', celdas[i] === JUGADOR);
      span.classList.toggle('rival', celdas[i] === RIVAL);
    });
  }

  function crearTablero() {
    tableroEl.innerHTML = '';
    columnasEl = [];
    huecosEl = new Array(COLS * FILAS);
    for (var c = 0; c < COLS; c++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'columna';
      for (var f = 0; f < FILAS; f++) {
        var span = document.createElement('span');
        span.className = 'hueco';
        span.setAttribute('aria-hidden', 'true');
        btn.appendChild(span);
        huecosEl[f * COLS + c] = span;
      }
      (function (col, b) {
        b.addEventListener('click', function () { jugarTurno(col); });
      })(c, btn);
      tableroEl.appendChild(btn);
      columnasEl.push(btn);
    }
  }

  function iniciarPartida(n) {
    nivel = n;
    celdas = new Array(COLS * FILAS).fill(null);
    turnoJugador = true;
    partidaTerminada = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnOtraPartida.classList.add('oculto');
    estadoEl.textContent = App.i18n.t('teToca');
    pantallaInicio.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    crearTablero();
    limpiarAyuda();
    pintarTablero();
    pintarEstrellas();
  }

  /* Places the piece with a small drop animation (CSS respects
     prefers-reduced-motion). */
  function soltarFicha(c, quien) {
    var f = filaLibre(celdas, c);
    celdas[f * COLS + c] = quien;
    pintarTablero();
    var span = huecosEl[f * COLS + c];
    span.style.setProperty('--desde', (-(f + 1) * 108) + '%');
    span.classList.remove('cae');
    void span.offsetWidth;   /* restarts the animation */
    span.classList.add('cae');
    return f;
  }

  /* The opponent plays according to the level's skill (see data.js):
     'azar' picks a random column; 'gana' finishes its line if it
     can; 'bloquea' also blocks you. Each level adds ONE skill. */
  function eligeColumnaRival() {
    var hab = nivel.habilidad;
    if (hab === 'gana' || hab === 'bloquea') {
      var remate = columnaQueCompleta(RIVAL);
      if (remate !== -1) return remate;
    }
    if (hab === 'bloquea') {
      var tapar = columnaQueCompleta(JUGADOR);
      if (tapar !== -1) return tapar;
    }
    return App.utils.shuffle(columnasLibres(celdas))[0];
  }

  function marcarLinea(linea) {
    linea.forEach(function (i) { huecosEl[i].classList.add('ganadora'); });
  }

  /* ---- Hint on demand (two-step Socratic method) ----
     1st tap: a question that directs attention to the key detail.
     2nd tap: marks the exact column and explains why. */
  function limpiarAyuda() {
    ayudaPaso = 0;
    ayudaWrap.classList.add('oculto');
    ayudaTextoEl.textContent = '';
    columnasEl.forEach(function (b) { b.classList.remove('sugerida'); });
  }

  /* Recomienda la mejor columna: ganar > tapar > centro > cualquiera. */
  function recomendar() {
    var ganar = columnaQueCompleta(JUGADOR);
    if (ganar !== -1) return { col: ganar, tipo: 'Ganas' };
    var tapar = columnaQueCompleta(RIVAL);
    if (tapar !== -1) return { col: tapar, tipo: 'Tapa' };
    var centro = [2, 3].filter(function (c) { return filaLibre(celdas, c) !== -1; });
    if (centro.length) return { col: App.utils.shuffle(centro)[0], tipo: 'Centro' };
    return { col: App.utils.shuffle(columnasLibres(celdas))[0], tipo: 'Libre' };
  }

  function pedirAyuda() {
    if (partidaTerminada || !turnoJugador) return;
    var rec = recomendar();
    ayudaPaso = ayudaPaso >= 2 ? 2 : ayudaPaso + 1;
    var texto = App.i18n.t('ayuda' + rec.tipo + ayudaPaso);
    ayudaTextoEl.textContent = texto;
    ayudaWrap.classList.remove('oculto');
    if (ayudaPaso === 2) columnasEl[rec.col].classList.add('sugerida');
    App.tts.speak(texto);
  }

  function jugarTurno(c) {
    if (partidaTerminada || !turnoJugador || filaLibre(celdas, c) === -1) return;
    limpiarAyuda();
    turnoJugador = false;
    soltarFicha(c, JUGADOR);

    var lineaJugador = lineaGanadora(celdas, JUGADOR);
    if (lineaJugador) { terminar('jugador', lineaJugador); return; }
    if (columnasLibres(celdas).length === 0) { terminar('empate', null); return; }

    estadoEl.textContent = App.i18n.t('piensaRival');
    pintarTablero();
    setTimeout(function () {
      if (partidaTerminada) return;
      var colRival = eligeColumnaRival();
      soltarFicha(colRival, RIVAL);
      var lineaRival = lineaGanadora(celdas, RIVAL);
      if (lineaRival) { terminar('rival', lineaRival); return; }
      if (columnasLibres(celdas).length === 0) { terminar('empate', null); return; }
      turnoJugador = true;
      estadoEl.textContent = App.i18n.t('rivalPone').replace('{c}', colRival + 1) +
        ' ' + App.i18n.t('teToca');
      pintarTablero();
    }, DELAY);
  }

  function terminar(resultado, linea) {
    partidaTerminada = true;
    turnoJugador = false;
    pintarTablero();
    if (linea) marcarLinea(linea);

    if (resultado === 'jugador') {
      estadoEl.textContent = App.i18n.t('hasGanado');
      progreso.estrellas += 1;
      progreso.victorias[nivel.id] = (progreso.victorias[nivel.id] || 0) + 1;
      guardar();
      pintarEstrellas();
      App.feedback.celebrate(App.i18n.t('hasGanado'));
$('#transferencia').textContent = App.i18n.t('transferencia');
    } else if (resultado === 'empate') {
      estadoEl.textContent = App.i18n.t('empate');
      App.feedback.success(feedbackEl);
    } else {
      /* Losing: never punished (rule 5) — encouragement and a concrete tip. */
      estadoEl.textContent = App.i18n.t('haGanadoRival');
      App.feedback.encourage(feedbackEl);
      
    }
    btnOtraPartida.classList.remove('oculto');
    btnOtraPartida.focus();
  }

  /* ---- Eventos ---- */
  btnAyuda.addEventListener('click', pedirAyuda);
  $('#btnEscucharAyuda').addEventListener('click', function () {
    App.tts.speak(ayudaTextoEl.textContent);
  });
  btnOtraPartida.addEventListener('click', function () { iniciarPartida(nivel); });
  btnSalir.addEventListener('click', function () {
    App.tts.stop();
    partidaTerminada = true;
    pantallaJuego.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });

  pintarNiveles();
  pintarEstrellas();
})();

