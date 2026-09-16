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

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var tableroEl = $('#tablero');
  var estadoEl = $('#status');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelEl = $('#dificultad');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Estado de la partida */
  var currentLevel = null;
  var idxPieza = 0;
  var roundHits = 0;
  var llenas = [];          /* filled row*columns+col indexes */
  var hueco = [];           /* indexes the piece must occupy */
  var clavePieza = '';
  var orientacion = 0;
  var piezaX = 0;
  var attempts = 0;
  var enJuego = false;

  function save() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }
  function cols() { return banco().columnas; }
  function fils() { return banco().filas; }
  function orientaciones() { return banco().piezas[clavePieza]; }
  function celdasPieza() { return orientaciones()[orientacion]; }

  function anchura(celdas) {
    var max = 0;
    celdas.forEach(function (c) { if (c[0] > max) max = c[0]; });
    return max + 1;
  }

  function altura(celdas) {
    var max = 0;
    celdas.forEach(function (c) { if (c[1] > max) max = c[1]; });
    return max + 1;
  }

  /* Determina el nivel según el progress: cada ronda completada,
     sube un nivel (regla 13: un solo cambio por nivel). */
  function levelBasedOnProgress() {
    var idx = Math.min(progress.roundsCompleted, banco().niveles.length - 1);
    return banco().niveles[idx];
  }

  /* Muestra la dificultad current (número de piezas en el nivel). */
  function renderLevel() {
    if (levelEl) {
      var n = currentLevel.piezas.length;
      levelEl.textContent = n + ' ' + App.i18n.t(n === 1 ? 'pieza' : 'piezas');
    }
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    idxPieza = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    nuevaPieza();
  }

  function renderProgress() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idxPieza / porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  /* ---- Generation: hueco = footprint of the piece resting on the floor ---- */
  function nuevaPieza() {
    clavePieza = App.utils.shuffle(currentLevel.piezas)[0];
    var ors = banco().piezas[clavePieza];
    var orFinal = Math.floor(Math.random() * ors.length);
    var celdas = ors[orFinal];
    var xFinal = Math.floor(Math.random() * (cols() - anchura(celdas) + 1));
    var offsetY = fils() - altura(celdas);

    hueco = celdas.map(function (c) {
      return (offsetY + c[1]) * cols() + (xFinal + c[0]);
    });

    /* Fill in the rest of the rows the gap touches */
    llenas = [];
    var filasHueco = {};
    hueco.forEach(function (i) { filasHueco[Math.floor(i / cols())] = true; });
    Object.keys(filasHueco).forEach(function (f) {
      for (var c = 0; c < cols(); c++) {
        var i = Number(f) * cols() + c;
        if (hueco.indexOf(i) === -1) llenas.push(i);
      }
    });

    /* The piece appears at the top, in a random orientation (may
       need rotating) and a centered starting column */
    orientacion = Math.floor(Math.random() * ors.length);
    piezaX = Math.min(2, cols() - anchura(celdasPieza()));
    attempts = 0;
    enJuego = true;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');
    estadoEl.textContent = App.i18n.t('enJuego');
    renderBoard();
    renderProgress();
    renderStars();
  }

  function indicesPiezaArriba() {
    return celdasPieza().map(function (c) {
      return c[1] * cols() + (piezaX + c[0]);
    });
  }

  function renderBoard(extra) {
    extra = extra || {};
    tableroEl.style.gridTemplateColumns = 'repeat(' + cols() + ', 1fr)';
    tableroEl.innerHTML = '';
    var arriba = enJuego ? indicesPiezaArriba() : [];
    var total = fils() * cols();
    for (var i = 0; i < total; i++) {
      var div = document.createElement('div');
      div.className = 'celda';
      if (llenas.indexOf(i) !== -1) div.classList.add('llena');
      if (arriba.indexOf(i) !== -1) { div.classList.add('pieza'); div.classList.add('t-' + clavePieza); }
      if (extra.marcarHueco && hueco.indexOf(i) !== -1) div.classList.add('sugerida');
      if (extra.encajada && hueco.indexOf(i) !== -1) { div.classList.add('encajada'); div.classList.add('t-' + clavePieza); }
      tableroEl.appendChild(div);
    }
  }

  /* ---- Controles ---- */
  function mover(dx) {
    if (!enJuego) return;
    var nueva = piezaX + dx;
    if (nueva < 0 || nueva + anchura(celdasPieza()) > cols()) return;
    piezaX = nueva;
    renderBoard(attempts >= 2 ? { marcarHueco: true } : {});
  }

  function girar() {
    if (!enJuego) return;
    orientacion = (orientacion + 1) % orientaciones().length;
    if (piezaX + anchura(celdasPieza()) > cols()) {
      piezaX = cols() - anchura(celdasPieza());
    }
    renderBoard(attempts >= 2 ? { marcarHueco: true } : {});
  }

  /* Deja caer la pieza: baja hasta chocar con relleno o suelo */
  function calcularAterrizaje() {
    var celdas = celdasPieza();
    var offset = 0;
    function cabe(o) {
      for (var i = 0; i < celdas.length; i++) {
        var f = o + celdas[i][1];
        var c = piezaX + celdas[i][0];
        if (f >= fils()) return false;
        if (llenas.indexOf(f * cols() + c) !== -1) return false;
      }
      return true;
    }
    while (cabe(offset + 1)) offset += 1;
    return celdas.map(function (c) {
      return (offset + c[1]) * cols() + (piezaX + c[0]);
    });
  }

  function mismoConjunto(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) { if (b.indexOf(a[i]) === -1) return false; }
    return true;
  }

  function bajar() {
    if (!enJuego) return;
    var aterrizaje = calcularAterrizaje();
    if (mismoConjunto(aterrizaje, hueco)) {
      encajar(false);
    } else {
      attempts += 1;
      App.feedback.encourage(feedbackEl);
      if (attempts === 1) {
        /* Rule 12: first mistake → hint, never the solution */
        explicacionEl.textContent = App.i18n.t('pistaForma');
        explicacionWrap.classList.remove('hidden');
        renderBoard();
      } else if (attempts === 2) {
        explicacionEl.textContent = App.i18n.t('huecoMarcado');
        explicacionWrap.classList.remove('hidden');
        renderBoard({ marcarHueco: true });
      } else {
        /* Tercer fallo → se encaja sola (nadie se queda atascado) */
        explicacionEl.textContent = App.i18n.t('autoEncaje');
        explicacionWrap.classList.remove('hidden');
        encajar(true);
      }
    }
  }

  function encajar(automatico) {
    enJuego = false;
    hueco.forEach(function (i) { llenas.push(i); });
    renderBoard({ encajada: true });
    idxPieza += 1;
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
      explicacionWrap.classList.add('hidden');
      App.feedback.success(feedbackEl);
    }
    App.feedback.celebrate(App.i18n.t('encajada'));
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function siguiente() {
    if (idxPieza >= banco().porRonda) {
      endRound();
    } else {
      nuevaPieza();
    }
  }

  function endRound() {
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    progress.roundsCompleted += 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#resumenFinal').textContent += '\n' + App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompleted + 1, banco().niveles.length));
$('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  $('#btnIzquierda').addEventListener('click', function () { mover(-1); });
  $('#btnDerecha').addEventListener('click', function () { mover(1); });
  $('#btnGirar').addEventListener('click', girar);
  $('#btnMoveDown').addEventListener('click', bajar);
  document.addEventListener('keydown', function (ev) {
    if (!enJuego || gameScreen.classList.contains('hidden')) return;
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); mover(-1); }
    else if (ev.key === 'ArrowRight') { ev.preventDefault(); mover(1); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); girar(); }
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); bajar(); }
  });
  btnNext.addEventListener('click', siguiente);
  $('#btnPlay').addEventListener('click', function () { startGame(); });
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    renderStars();
  });

  renderStars();
})();

