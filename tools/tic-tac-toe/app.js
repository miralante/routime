/* ============================================================
   Routime — Tres en Raya (razonamiento: lógica y anticipación)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: la persona es ❌ y siempre empieza; el rival es ⭕ y
   juega según la habilidad del nivel (azar / remata su línea /
   también bloquea). Ganar da 1 estrella; el empate se celebra sin
   estrella; perder no se castiga (regla 5): mensaje de ánimo con un
   consejo y botón de jugar otra vez.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'tres-en-raya';
  var $ = App.utils.$;
  var JUGADOR = 'X';
  var RIVAL = 'O';
  var FICHA = { X: '❌', O: '⭕' };
  var LINEAS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],   /* filas */
    [0, 3, 6], [1, 4, 7], [2, 5, 8],   /* columnas */
    [0, 4, 8], [2, 4, 6]               /* diagonales */
  ];
  var DELAY = App.utils.reducedMotion() ? 0 : 700;

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

  /* Estado de la partida */
  var nivel = null;
  var celdas = [];        /* 'X' | 'O' | null, indices 0-8 */
  var botones = [];
  var turnoJugador = true;
  var partidaTerminada = false;
  var ayudaPaso = 0;      /* Socratic method: 1st tap asks, 2nd tap marks the cell */

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

  /* ---- Tablero ---- */
  function ariaCelda(i) {
    var f = Math.floor(i / 3) + 1;
    var c = (i % 3) + 1;
    var pos = App.i18n.t('fila').replace('{f}', f).replace('{c}', c);
    var estado = App.i18n.t('casillaVacia');
    if (celdas[i] === JUGADOR) estado = App.i18n.t('casillaTuya');
    if (celdas[i] === RIVAL) estado = App.i18n.t('casillaRival');
    return estado + ', ' + pos;
  }

  function pintarTablero() {
    botones.forEach(function (btn, i) {
      btn.textContent = celdas[i] ? FICHA[celdas[i]] : '';
      btn.disabled = partidaTerminada || !!celdas[i] || !turnoJugador;
      btn.setAttribute('aria-label', ariaCelda(i));
      btn.classList.toggle('tuya', celdas[i] === JUGADOR);
      btn.classList.toggle('rival', celdas[i] === RIVAL);
    });
  }

  function crearTablero() {
    tableroEl.innerHTML = '';
    botones = [];
    for (var i = 0; i < 9; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'celda';
      (function (idx, b) {
        b.addEventListener('click', function () { jugarTurno(idx); });
      })(i, btn);
      tableroEl.appendChild(btn);
      botones.push(btn);
    }
  }

  function iniciarPartida(n) {
    nivel = n;
    celdas = [null, null, null, null, null, null, null, null, null];
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

  /* ---- Logic ---- */
  function lineaGanadora(quien) {
    for (var i = 0; i < LINEAS.length; i++) {
      var l = LINEAS[i];
      if (celdas[l[0]] === quien && celdas[l[1]] === quien && celdas[l[2]] === quien) return l;
    }
    return null;
  }

  function casillasLibres() {
    var libres = [];
    celdas.forEach(function (v, i) { if (!v) libres.push(i); });
    return libres;
  }

  /* Returns the cell that completes a line for 'quien', or -1. */
  function casillaQueCompleta(quien) {
    for (var i = 0; i < LINEAS.length; i++) {
      var l = LINEAS[i];
      var valores = [celdas[l[0]], celdas[l[1]], celdas[l[2]]];
      var mias = 0; var libre = -1;
      for (var j = 0; j < 3; j++) {
        if (valores[j] === quien) mias += 1;
        else if (!valores[j]) libre = l[j];
      }
      if (mias === 2 && libre !== -1) return libre;
    }
    return -1;
  }

  /* The opponent plays based on the level's skill (see data.js):
     'azar' picks at random; 'gana' finishes its line if it can; 'bloquea'
     also blocks the player's line. Each level adds ONE skill. */
  function eligeCasillaRival() {
    var hab = nivel.habilidad;
    if (hab === 'gana' || hab === 'bloquea') {
      var remate = casillaQueCompleta(RIVAL);
      if (remate !== -1) return remate;
    }
    if (hab === 'bloquea') {
      var tapar = casillaQueCompleta(JUGADOR);
      if (tapar !== -1) return tapar;
    }
    var libres = casillasLibres();
    return App.utils.shuffle(libres)[0];
  }

  function marcarLinea(linea) {
    linea.forEach(function (i) { botones[i].classList.add('ganadora'); });
  }

  /* ---- On-demand hint (two-step Socratic method) ----
     1st tap: question that directs attention to the key fact,
     without naming the cell. 2nd tap: marks the specific cell
     and explains why. Resets when a piece is moved. */
  function limpiarAyuda() {
    ayudaPaso = 0;
    ayudaWrap.classList.add('oculto');
    ayudaTextoEl.textContent = '';
    botones.forEach(function (b) { b.classList.remove('sugerida'); });
  }

  /* Recomienda la mejor jugada del jugador: ganar > tapar > centro >
     esquina > cualquier casilla libre. */
  function recomendar() {
    var ganar = casillaQueCompleta(JUGADOR);
    if (ganar !== -1) return { idx: ganar, tipo: 'Ganas' };
    var tapar = casillaQueCompleta(RIVAL);
    if (tapar !== -1) return { idx: tapar, tipo: 'Tapa' };
    if (!celdas[4]) return { idx: 4, tipo: 'Centro' };
    var esquinas = [0, 2, 6, 8].filter(function (i) { return !celdas[i]; });
    if (esquinas.length) return { idx: App.utils.shuffle(esquinas)[0], tipo: 'Esquina' };
    return { idx: casillasLibres()[0], tipo: 'Libre' };
  }

  function pedirAyuda() {
    if (partidaTerminada || !turnoJugador) return;
    var rec = recomendar();
    ayudaPaso = ayudaPaso >= 2 ? 2 : ayudaPaso + 1;
    var texto = App.i18n.t('ayuda' + rec.tipo + ayudaPaso);
    ayudaTextoEl.textContent = texto;
    ayudaWrap.classList.remove('oculto');
    if (ayudaPaso === 2) botones[rec.idx].classList.add('sugerida');
    App.tts.speak(texto);
  }

  function jugarTurno(idx) {
    if (partidaTerminada || !turnoJugador || celdas[idx]) return;
    limpiarAyuda();
    celdas[idx] = JUGADOR;
    turnoJugador = false;
    pintarTablero();

    var lineaJugador = lineaGanadora(JUGADOR);
    if (lineaJugador) { terminar('jugador', lineaJugador); return; }
    if (casillasLibres().length === 0) { terminar('empate', null); return; }

    estadoEl.textContent = App.i18n.t('piensaRival');
    setTimeout(function () {
      if (partidaTerminada) return;
      var idxRival = eligeCasillaRival();
      celdas[idxRival] = RIVAL;
      var lineaRival = lineaGanadora(RIVAL);
      if (lineaRival) { terminar('rival', lineaRival); return; }
      if (casillasLibres().length === 0) { terminar('empate', null); return; }
      turnoJugador = true;
      estadoEl.textContent = App.i18n.t('teToca');
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
    pantallaJuego.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });

  pintarNiveles();
  pintarEstrellas();
})();

