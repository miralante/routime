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
   Cada tipo de pieza (clavePieza: domino/triI/triL/cuadrado/barra/te/
   ele) recibe una clase 't-<clave>' en las celdas .pieza/.encajada
   para pintarla de un color fijo tipo tetrominó clásico (ver
   styles.css) — mecánica intacta, solo aspecto más "gaming".
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'encajar';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var tableroEl = $('#tablero');
  var estadoEl = $('#estado');
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

  /* Estado de la partida */
  var nivel = null;
  var idxPieza = 0;
  var aciertosRonda = 0;
  var llenas = [];          /* filled row*columns+col indexes */
  var hueco = [];           /* indexes the piece must occupy */
  var clavePieza = '';
  var orientacion = 0;
  var piezaX = 0;
  var intentos = 0;
  var enJuego = false;

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
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

  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    banco().niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completados[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + veces + ' ' + App.i18n.t('veces') + ')</span>';
      btn.addEventListener('click', function () { iniciarRonda(n); });
      cont.appendChild(btn);
    });
  }

  function iniciarRonda(n) {
    nivel = n;
    idxPieza = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    nuevaPieza();
  }

  function pintarProgreso() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idxPieza / porRonda) * 100) + '%';
    progressText.textContent = idxPieza + ' / ' + porRonda;
  }

  /* ---- Generation: hueco = footprint of the piece resting on the floor ---- */
  function nuevaPieza() {
    clavePieza = App.utils.shuffle(nivel.piezas)[0];
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
    intentos = 0;
    enJuego = true;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');
    estadoEl.textContent = App.i18n.t('enJuego');
    pintarTablero();
    pintarProgreso();
    pintarEstrellas();
  }

  function indicesPiezaArriba() {
    return celdasPieza().map(function (c) {
      return c[1] * cols() + (piezaX + c[0]);
    });
  }

  function pintarTablero(extra) {
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
    pintarTablero(intentos >= 2 ? { marcarHueco: true } : {});
  }

  function girar() {
    if (!enJuego) return;
    orientacion = (orientacion + 1) % orientaciones().length;
    if (piezaX + anchura(celdasPieza()) > cols()) {
      piezaX = cols() - anchura(celdasPieza());
    }
    pintarTablero(intentos >= 2 ? { marcarHueco: true } : {});
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
      intentos += 1;
      App.feedback.encourage(feedbackEl);
      if (intentos === 1) {
        /* Rule 12: first mistake → hint, never the solution */
        explicacionEl.textContent = App.i18n.t('pistaForma');
        explicacionWrap.classList.remove('oculto');
        pintarTablero();
      } else if (intentos === 2) {
        explicacionEl.textContent = App.i18n.t('huecoMarcado');
        explicacionWrap.classList.remove('oculto');
        pintarTablero({ marcarHueco: true });
      } else {
        /* Tercer fallo → se encaja sola (nadie se queda atascado) */
        explicacionEl.textContent = App.i18n.t('autoEncaje');
        explicacionWrap.classList.remove('oculto');
        encajar(true);
      }
    }
  }

  function encajar(automatico) {
    enJuego = false;
    hueco.forEach(function (i) { llenas.push(i); });
    pintarTablero({ encajada: true });
    idxPieza += 1;
    aciertosRonda += 1;
    progreso.estrellas += 1;
    guardar();
    pintarEstrellas();
    pintarProgreso();
    estadoEl.textContent = App.i18n.t('encajada');
    if (!automatico) {
      feedbackEl.textContent = '';
      feedbackEl.className = 'feedback';
      explicacionWrap.classList.add('oculto');
      App.feedback.success(feedbackEl);
    }
    App.feedback.celebrate(App.i18n.t('encajada'));
    btnSiguiente.classList.remove('oculto');
    btnSiguiente.focus();
  }

  function siguiente() {
    App.tts.stop();
    if (idxPieza >= banco().porRonda) {
      terminarRonda();
    } else {
      nuevaPieza();
    }
  }

  function terminarRonda() {
    progreso.completados[nivel.id] = (progreso.completados[nivel.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda).replace('{total}', progreso.estrellas);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  $('#btnIzquierda').addEventListener('click', function () { mover(-1); });
  $('#btnDerecha').addEventListener('click', function () { mover(1); });
  $('#btnGirar').addEventListener('click', girar);
  $('#btnBajar').addEventListener('click', bajar);
  document.addEventListener('keydown', function (ev) {
    if (!enJuego || pantallaJuego.classList.contains('oculto')) return;
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); mover(-1); }
    else if (ev.key === 'ArrowRight') { ev.preventDefault(); mover(1); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); girar(); }
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); bajar(); }
  });
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

