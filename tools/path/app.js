/* ============================================================
   Routime â€” El Camino (orientaciÃ³n espacial y rutas)
   Datos en data.js (DATA.niveles con nÂº de obstÃ¡culos). Los caminos
   se generan al vuelo: salida y meta con distancia mÃ­nima, Ã¡rboles
   al azar, y una bÃºsqueda en anchura (BFS) garantiza que siempre
   hay camino. La tortuga se mueve con 4 botones de flecha (y con
   las flechas del teclado fÃ­sico). Chocar con Ã¡rbol o borde solo
   avisa con calma (regla 5). Llegar a la estrella da 1 estrella.
   Ronda de 3 caminos.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'el-camino';
  var $ = App.utils.$;
  var MOVIMIENTOS = {
    arriba: { df: -1, dc: 0 },
    abajo: { df: 1, dc: 0 },
    izquierda: { df: 0, dc: -1 },
    derecha: { df: 0, dc: 1 }
  };
  var TECLAS = {
    ArrowUp: 'arriba', ArrowDown: 'abajo',
    ArrowLeft: 'izquierda', ArrowRight: 'derecha'
  };

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var tableroEl = $('#tablero');
  var estadoEl = $('#estado');
  var feedbackEl = $('#feedback');
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
  var idxCamino = 0;
  var aciertosRonda = 0;
  var arboles = [];       /* row*columns+col indexes */
  var meta = -1;
  var tortuga = -1;
  var enJuego = false;

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = 'â­ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }
  function filas() { return banco().filas; }
  function columnas() { return banco().columnas; }

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
    progressFill.style.width = ((idxCamino / porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  /* ---- Generation with a guaranteed solution (BFS) ---- */
  function hayCamino(desde, hasta, bloqueadas) {
    var total = filas() * columnas();
    var visitadas = {};
    var cola = [desde];
    visitadas[desde] = true;
    while (cola.length) {
      var actual = cola.shift();
      if (actual === hasta) return true;
      var f = Math.floor(actual / columnas());
      var c = actual % columnas();
      [[f - 1, c], [f + 1, c], [f, c - 1], [f, c + 1]].forEach(function (v) {
        if (v[0] < 0 || v[0] >= filas() || v[1] < 0 || v[1] >= columnas()) return;
        var i = v[0] * columnas() + v[1];
        if (visitadas[i] || bloqueadas.indexOf(i) !== -1) return;
        visitadas[i] = true;
        cola.push(i);
      });
    }
    return false;
  }

  function distancia(a, b) {
    var fa = Math.floor(a / columnas()), ca = a % columnas();
    var fb = Math.floor(b / columnas()), cb = b % columnas();
    return Math.abs(fa - fb) + Math.abs(ca - cb);
  }

  function nuevoCamino() {
    var total = filas() * columnas();
    var todas = [];
    for (var i = 0; i < total; i++) todas.push(i);
    /* Reintentar hasta obtener un tablero resoluble */
    for (var intento = 0; intento < 50; intento++) {
      var mezcla = App.utils.shuffle(todas);
      var t = mezcla[0];
      var m = mezcla[1];
      if (distancia(t, m) < 3) continue;
      var arbs = mezcla.slice(2, 2 + nivel.obstaculos);
      if (hayCamino(t, m, arbs)) {
        tortuga = t;
        meta = m;
        arboles = arbs;
        break;
      }
    }
    enJuego = true;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnSiguiente.classList.add('oculto');
    estadoEl.textContent = App.i18n.t('enMarcha');
    pintarTablero();
    pintarProgreso();
    pintarEstrellas();
  }

  function pintarTablero() {
    tableroEl.style.gridTemplateColumns = 'repeat(' + columnas() + ', 1fr)';
    tableroEl.innerHTML = '';
    var total = filas() * columnas();
    for (var i = 0; i < total; i++) {
      var div = document.createElement('div');
      div.className = 'casilla';
      if (i === tortuga) { div.textContent = 'ðŸ¢'; div.classList.add('tortuga'); }
      else if (i === meta) { div.textContent = 'â­'; }
      else if (arboles.indexOf(i) !== -1) { div.textContent = 'ðŸŒ³'; }
      tableroEl.appendChild(div);
    }
  }

  function mover(direccion) {
    if (!enJuego) return;
    var mv = MOVIMIENTOS[direccion];
    var f = Math.floor(tortuga / columnas()) + mv.df;
    var c = (tortuga % columnas()) + mv.dc;
    if (f < 0 || f >= filas() || c < 0 || c >= columnas()) {
      estadoEl.textContent = App.i18n.t('choqueBorde');
      App.feedback.encourage(feedbackEl);
      return;
    }
    var destino = f * columnas() + c;
    if (arboles.indexOf(destino) !== -1) {
      estadoEl.textContent = App.i18n.t('choqueArbol');
      App.feedback.encourage(feedbackEl);
      return;
    }
    tortuga = destino;
    estadoEl.textContent = App.i18n.t('enMarcha');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    pintarTablero();
    if (tortuga === meta) llegar();
  }

  function llegar() {
    enJuego = false;
    idxCamino += 1;
    aciertosRonda += 1;
    progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    guardar();
    pintarEstrellas();
    pintarProgreso();
    estadoEl.textContent = App.i18n.t('llegada');
    App.feedback.celebrate(App.i18n.t('llegada'));
    btnSiguiente.classList.remove('oculto');
    btnSiguiente.focus();
  }

  function siguiente() {
    if (idxCamino >= banco().porRonda) {
      terminarRonda();
    } else {
      nuevoCamino();
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
  ['arriba', 'abajo', 'izquierda', 'derecha'].forEach(function (dir) {
    $('#btn' + dir.charAt(0).toUpperCase() + dir.slice(1))
      .addEventListener('click', function () { mover(dir); });
  });
  document.addEventListener('keydown', function (ev) {
    if (!enJuego || pantallaJuego.classList.contains('oculto')) return;
    var dir = TECLAS[ev.key];
    if (dir) { ev.preventDefault(); mover(dir); }
  });
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarJuego(); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });

  pintarEstrellas();
})();

