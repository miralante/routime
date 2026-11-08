/* ============================================================
   Routime — Encaja la Pieza (tetris adaptado, viso-espacial)
   Datos en data.js (DATA.piezas con orientaciones, DATA.niveles).
   Mecánica: una pieza arriba del tablero se mueve (⬅️➡️), se gira
   (🔄) y se baja (⬇️) — también con las flechas del teclado. Abajo
   hay un hueco con la huella exacta de la pieza; el resto de esas
   filas está relleno. SIN caída automática ni tiempo (regla 5).
   Si al bajar no encaja, la pieza vuelve arriba sin castigo:
   1º fallo → pista socrática; 2º → se marca el hueco; 3º → se
   encaja sola con explicación (nadie se queda atascado).
   Ronda de 4 piezas; 1 estrella por pieza encajada.
   Cada tipo de pieza (clavePieza: duo/triI/triL/cuadrado/barra/te/
   ele) recibe una clase 't-<clave>' en las celdas .pieza/.encajada
   para pintarla de un color fijo tipo tetrominó clásico (ver
   styles.css) — mecánica intacta, solo aspecto más "gaming".
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'encajar';
  var $ = App.utils.$;

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var boardEl = $('#tablero');
  var estadoEl = $('#status');
  var feedbackEl = $('#feedback');
  var explanationWrap = $('#explanationWrap');
  var explanationEl = $('#explanation');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelEl = $('#level');

  /* Persistent progress */
  var progress = App.storage.getWithStars(TOOL_ID);
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Estado de la partida */
  var currentLevel = null;
  var idxPiece = 0;
  var roundHits = 0;
  var llenas = [];          /* filled row*columns+col indexes */
  var gap = [];           /* indexes the piece must occupy */
  var keyPiece = '';
  var orientacion = 0;
  var pieceX = 0;
  var attempts = 0;
  var insideGame = false;

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; },
    levels: function () { return bank().niveles; }
  });
  var save = glue.save, renderStars = glue.paintStars, levelBasedOnProgress = glue.levelFromProgress;
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }
  function cols() { return bank().columnas; }
  function fils() { return bank().filas; }
  function orientaciones() { return bank().piezas[keyPiece]; }
  function cellsPiece() { return orientaciones()[orientacion]; }

  function anchura(cells) {
    var max = 0;
    cells.forEach(function (c) { if (c[0] > max) max = c[0]; });
    return max + 1;
  }

  function altura(cells) {
    var max = 0;
    cells.forEach(function (c) { if (c[1] > max) max = c[1]; });
    return max + 1;
  }

  /* Determina el nivel según el progress: cada ronda completada,
     sube un nivel (regla 13: un solo cambio por nivel). */

  /* Muestra la dificultad current (número de piezas en el nivel). */
  function renderLevel() {
    if (levelEl) {
      var n = currentLevel.piezas.length;
      levelEl.textContent = n + ' ' + App.i18n.t(n === 1 ? 'pieza' : 'piezas');
    }
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    idxPiece = 0;
    roundHits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    newerPiece();
  }

  function renderProgress() {
    var perRound = bank().porRonda;
    progressFill.style.width = ((idxPiece / perRound) * 100) + '%';
    progressText.textContent = '';
  }

  /* ---- Generation: hueco = footprint of the piece resting on the floor ---- */
  function newerPiece() {
    keyPiece = App.utils.shuffle(currentLevel.piezas)[0];
    var ors = bank().piezas[keyPiece];
    var orFinal = Math.floor(Math.random() * ors.length);
    var cells = ors[orFinal];
    var xFinal = Math.floor(Math.random() * (cols() - anchura(cells) + 1));
    var offsetY = fils() - altura(cells);

    gap = cells.map(function (c) {
      return (offsetY + c[1]) * cols() + (xFinal + c[0]);
    });

    /* Fill in the rest of the rows the gap touches */
    llenas = [];
    var rowsGap = {};
    gap.forEach(function (i) { rowsGap[Math.floor(i / cols())] = true; });
    Object.keys(rowsGap).forEach(function (f) {
      for (var c = 0; c < cols(); c++) {
        var i = Number(f) * cols() + c;
        if (gap.indexOf(i) === -1) llenas.push(i);
      }
    });

    /* The piece appears at the top, in a random orientation (may
       need rotating) and a centered starting column */
    orientacion = Math.floor(Math.random() * ors.length);
    pieceX = Math.min(2, cols() - anchura(cellsPiece()));
    attempts = 0;
    insideGame = true;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
    btnNext.classList.add('hidden');
    estadoEl.textContent = App.i18n.t('enJuego');
    renderBoard();
    renderProgress();
    renderStars();
  }

  function indicesPieceUp() {
    return cellsPiece().map(function (c) {
      return c[1] * cols() + (pieceX + c[0]);
    });
  }

  function renderBoard(extra) {
    extra = extra || {};
    boardEl.style.gridTemplateColumns = 'repeat(' + cols() + ', 1fr)';
    boardEl.innerHTML = '';
    var up = insideGame ? indicesPieceUp() : [];
    var total = fils() * cols();
    for (var i = 0; i < total; i++) {
      var div = document.createElement('div');
      div.className = 'celda';
      if (llenas.indexOf(i) !== -1) div.classList.add('llena');
      if (up.indexOf(i) !== -1) { div.classList.add('pieza'); div.classList.add('t-' + keyPiece); }
      if (extra.marcarHueco && gap.indexOf(i) !== -1) div.classList.add('sugerida');
      if (extra.encajada && gap.indexOf(i) !== -1) { div.classList.add('encajada'); div.classList.add('t-' + keyPiece); }
      boardEl.appendChild(div);
    }
  }

  /* ---- Controles ---- */
  function move(dx) {
    if (!insideGame) return;
    var newer = pieceX + dx;
    if (newer < 0 || newer + anchura(cellsPiece()) > cols()) return;
    pieceX = newer;
    renderBoard(attempts >= 2 ? { marcarHueco: true } : {});
  }

  function girar() {
    if (!insideGame) return;
    orientacion = (orientacion + 1) % orientaciones().length;
    if (pieceX + anchura(cellsPiece()) > cols()) {
      pieceX = cols() - anchura(cellsPiece());
    }
    renderBoard(attempts >= 2 ? { marcarHueco: true } : {});
  }

  /* Deja caer la pieza: baja hasta chocar con relleno o suelo */
  function calcularAterrizaje() {
    var cells = cellsPiece();
    var offset = 0;
    function cabe(o) {
      for (var i = 0; i < cells.length; i++) {
        var f = o + cells[i][1];
        var c = pieceX + cells[i][0];
        if (f >= fils()) return false;
        if (llenas.indexOf(f * cols() + c) !== -1) return false;
      }
      return true;
    }
    while (cabe(offset + 1)) offset += 1;
    return cells.map(function (c) {
      return (offset + c[1]) * cols() + (pieceX + c[0]);
    });
  }

  function mismoConjunto(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) { if (b.indexOf(a[i]) === -1) return false; }
    return true;
  }

  function bajar() {
    if (!insideGame) return;
    var aterrizaje = calcularAterrizaje();
    if (mismoConjunto(aterrizaje, gap)) {
      encajar(false);
    } else {
      attempts += 1;
      App.feedback.encourage(feedbackEl);
      if (attempts === 1) {
        /* Rule 12: first mistake → hint, never the solution */
        explanationEl.textContent = App.i18n.t('pistaForma');
        explanationWrap.classList.remove('hidden');
        renderBoard();
      } else if (attempts === 2) {
        explanationEl.textContent = App.i18n.t('huecoMarcado');
        explanationWrap.classList.remove('hidden');
        renderBoard({ marcarHueco: true });
      } else {
        /* Tercer fallo → se encaja sola (nadie se queda atascado) */
        explanationEl.textContent = App.i18n.t('autoEncaje');
        explanationWrap.classList.remove('hidden');
        encajar(true);
      }
    }
  }

  function encajar(automatico) {
    insideGame = false;
    gap.forEach(function (i) { llenas.push(i); });
    renderBoard({ encajada: true });
    idxPiece += 1;
    roundHits += 1;
    progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    save();
    renderStars();
    renderProgress();
    estadoEl.textContent = App.i18n.t('encajada');
    if (!automatico) {
      feedbackEl.textContent = '';
      feedbackEl.className = 'feedback';
      explanationWrap.classList.add('hidden');
      App.feedback.success(feedbackEl);
    }
    App.feedback.celebrate(App.i18n.t('encajada'));
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function next() {
    if (idxPiece >= bank().porRonda) {
      endRound();
    } else {
      newerPiece();
    }
  }

  function endRound() {
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    progress.roundsCompleted += 1;
    save();
    App.utils.showEnd(gameScreen, endScreen);
    $('#endSummary').textContent = '';
    $('#endSummary').textContent += '\n' + App.i18n.t('proximoNivel', { n: Math.min(progress.roundsCompleted + 1, bank().niveles.length) });
if ($('#transferencia')) $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  $('#btnIzquierda').addEventListener('click', function () { move(-1); });
  $('#btnDerecha').addEventListener('click', function () { move(1); });
  $('#btnGirar').addEventListener('click', girar);
  $('#btnMoveDown').addEventListener('click', bajar);
  document.addEventListener('keydown', function (ev) {
    if (!insideGame || gameScreen.classList.contains('hidden')) return;
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); move(-1); }
    else if (ev.key === 'ArrowRight') { ev.preventDefault(); move(1); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); girar(); }
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); bajar(); }
  });
  btnNext.addEventListener('click', next);
  $('#repeatBtn').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();

