/* ============================================================
   Routime — Las Damas (razonamiento: lógica y anticipación)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: damas adaptadas en tablero 6×6 (solo casillas oscuras),
   6 fichas por bando. La persona es 🔴 y siempre empieza; el rival
   es 🔵 y juega según la habilidad del nivel (azar / come cuando
   puede / también se protege). Mover: tocar una ficha propia y
   después una casilla iluminada. Comer: saltar por encima (no es
   obligatorio, sin saltos múltiples). Llegar al final corona la
   ficha como dama 👑 (también va hacia atrás).
   Ganar da 1 estrella; perder no se castiga (regla 5): ánimo con un
   consejo. Si la persona no puede mover, cierre amable comparando
   fichas (como el bloqueo del Dominó); el empate se celebra.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'damas';
  var $ = App.utils.$;
  var N = 6;                       /* tablero 6×6 */
  var JUGADOR = 'J';
  var RIVAL = 'R';
  var FICHA = { J: '🔴', R: '🔵' };
  var DELAY = App.utils.reducedMotion() ? 0 : 800;

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
  var celdas = [];        /* null | { bando: 'J'|'R', dama: bool }, indices 0-35 */
  var botones = [];       /* button per dark square; null on light ones */
  var turnoJugador = true;
  var partidaTerminada = false;
  var seleccion = -1;     /* selected piece's square, or -1 */
  var ayudaPaso = 0;      /* Socratic method: 1st tap asks, 2nd marks the move */

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function fila(i) { return Math.floor(i / N); }
  function col(i) { return i % N; }
  function esOscura(i) { return (fila(i) + col(i)) % 2 === 1; }
  function dentro(f, c) { return f >= 0 && f < N && c >= 0 && c < N; }

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

  /* ---- Movimientos ----
     Devuelve las jugadas de la ficha en 'i' sobre 'tab':
     [{ de, a, come }] donde 'come' es la casilla comida o -1.
     Ficha normal: 1 paso en diagonal hacia delante (la persona sube,
     el rival baja); dama: en las cuatro diagonales. Comer: saltar
     por encima de una ficha contraria a una casilla vacía. */
  function movimientosDePieza(tab, i) {
    var pieza = tab[i];
    if (!pieza) return [];
    var dirs;
    if (pieza.dama) dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    else if (pieza.bando === JUGADOR) dirs = [[-1, -1], [-1, 1]];
    else dirs = [[1, -1], [1, 1]];
    var f = fila(i); var c = col(i);
    var movs = [];
    dirs.forEach(function (d) {
      var f1 = f + d[0]; var c1 = c + d[1];
      if (!dentro(f1, c1)) return;
      var i1 = f1 * N + c1;
      if (!tab[i1]) {
        movs.push({ de: i, a: i1, come: -1 });
      } else if (tab[i1].bando !== pieza.bando) {
        var f2 = f + d[0] * 2; var c2 = c + d[1] * 2;
        if (dentro(f2, c2) && !tab[f2 * N + c2]) {
          movs.push({ de: i, a: f2 * N + c2, come: i1 });
        }
      }
    });
    return movs;
  }

  function movimientosBando(tab, bando) {
    var movs = [];
    for (var i = 0; i < N * N; i++) {
      if (tab[i] && tab[i].bando === bando) movs = movs.concat(movimientosDePieza(tab, i));
    }
    return movs;
  }

  /* Aplica una jugada sobre una copia del tablero (para simular). */
  function simular(tab, mov) {
    var copia = tab.map(function (p) { return p ? { bando: p.bando, dama: p.dama } : null; });
    copia[mov.a] = copia[mov.de];
    copia[mov.de] = null;
    if (mov.come !== -1) copia[mov.come] = null;
    if (copia[mov.a].bando === JUGADOR && fila(mov.a) === 0) copia[mov.a].dama = true;
    if (copia[mov.a].bando === RIVAL && fila(mov.a) === N - 1) copia[mov.a].dama = true;
    return copia;
  }

  function contarFichas(tab, bando) {
    return tab.filter(function (p) { return p && p.bando === bando; }).length;
  }

  /* ---- Tablero ---- */
  function ariaCelda(i, destinos) {
    var pos = App.i18n.t('fila').replace('{f}', fila(i) + 1).replace('{c}', col(i) + 1);
    var pieza = celdas[i];
    var estado;
    if (!pieza) estado = App.i18n.t('casillaVacia');
    else if (pieza.bando === JUGADOR) estado = App.i18n.t(pieza.dama ? 'casillaDama' : 'casillaTuya');
    else estado = App.i18n.t(pieza.dama ? 'casillaDamaRival' : 'casillaRival');
    var esDestino = destinos.some(function (m) { return m.a === i; });
    if (esDestino) estado = App.i18n.t('casillaDestino') + ', ' + estado;
    return estado + ', ' + pos;
  }

  function destinosDeSeleccion() {
    return seleccion === -1 ? [] : movimientosDePieza(celdas, seleccion);
  }

  function pintarTablero() {
    var destinos = destinosDeSeleccion();
    var movibles = {};
    if (turnoJugador && !partidaTerminada) {
      movimientosBando(celdas, JUGADOR).forEach(function (m) { movibles[m.de] = true; });
    }
    botones.forEach(function (btn, i) {
      if (!btn) return;
      var pieza = celdas[i];
      var html = '';
      if (pieza) {
        html = '<span class="pieza">' + FICHA[pieza.bando] +
          (pieza.dama ? '<span class="corona" aria-hidden="true">👑</span>' : '') + '</span>';
      }
      btn.innerHTML = html;
      var esDestino = destinos.some(function (m) { return m.a === i; });
      btn.disabled = partidaTerminada || !turnoJugador || !(movibles[i] || esDestino || i === seleccion);
      btn.setAttribute('aria-label', ariaCelda(i, destinos));
      btn.classList.toggle('tuya', !!pieza && pieza.bando === JUGADOR);
      btn.classList.toggle('rival', !!pieza && pieza.bando === RIVAL);
      btn.classList.toggle('elegida', i === seleccion);
      btn.classList.toggle('destino', esDestino);
    });
  }

  function crearTablero() {
    tableroEl.innerHTML = '';
    botones = [];
    for (var i = 0; i < N * N; i++) {
      if (esOscura(i)) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'celda oscura';
        (function (idx, b) {
          b.addEventListener('click', function () { tocarCasilla(idx); });
        })(i, btn);
        tableroEl.appendChild(btn);
        botones.push(btn);
      } else {
        var span = document.createElement('span');
        span.className = 'celda clara';
        span.setAttribute('aria-hidden', 'true');
        tableroEl.appendChild(span);
        botones.push(null);
      }
    }
  }

  function iniciarPartida(n) {
    nivel = n;
    celdas = [];
    for (var i = 0; i < N * N; i++) {
      var pieza = null;
      if (esOscura(i)) {
        if (fila(i) < 2) pieza = { bando: RIVAL, dama: false };
        if (fila(i) >= N - 2) pieza = { bando: JUGADOR, dama: false };
      }
      celdas.push(pieza);
    }
    seleccion = -1;
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

  /* ---- Turno de la persona ---- */
  function tocarCasilla(i) {
    if (partidaTerminada || !turnoJugador) return;
    var pieza = celdas[i];
    if (pieza && pieza.bando === JUGADOR) {
      /* Elegir (o cambiar) la ficha; tocarla otra vez la suelta. */
      seleccion = (seleccion === i) ? -1 : i;
      estadoEl.textContent = App.i18n.t(seleccion === -1 ? 'teToca' : 'eligeDestino');
      pintarTablero();
      return;
    }
    var mov = null;
    destinosDeSeleccion().forEach(function (m) { if (m.a === i) mov = m; });
    if (mov) moverJugador(mov);
  }

  function moverJugador(mov) {
    limpiarAyuda();
    var eraDama = celdas[mov.de].dama;
    celdas = simular(celdas, mov);
    seleccion = -1;
    turnoJugador = false;

    var mensajes = [];
    if (mov.come !== -1) mensajes.push(App.i18n.t('hasComido'));
    if (!eraDama && celdas[mov.a].dama) mensajes.push(App.i18n.t('coronaTuya'));
    if (mensajes.length) {
      estadoEl.textContent = mensajes.join(' ');
    }
    pintarTablero();

    if (contarFichas(celdas, RIVAL) === 0) { terminar('ganas'); return; }
    setTimeout(turnoRival, mensajes.length ? DELAY * 2 : DELAY);
  }

  /* ---- Turno del rival ----
     Juega según la habilidad del nivel (ver data.js): 'azar' elige
     una jugada legal al azar; 'come' además come si puede; 'protege'
     además evita jugadas donde la persona podría comerle la ficha.
     Cada nivel añade UNA habilidad (regla 13). */
  function eligeMovimientoRival(movs) {
    var hab = nivel.habilidad;
    var candidatas = movs;
    if (hab === 'come' || hab === 'protege') {
      var comidas = movs.filter(function (m) { return m.come !== -1; });
      if (comidas.length) candidatas = comidas;
      else if (hab === 'protege') {
        var seguras = movs.filter(function (m) {
          var despues = simular(celdas, m);
          return !movimientosBando(despues, JUGADOR).some(function (r) { return r.come === m.a; });
        });
        if (seguras.length) candidatas = seguras;
      }
    }
    return App.utils.shuffle(candidatas)[0];
  }

  function turnoRival() {
    if (partidaTerminada) return;
    estadoEl.textContent = App.i18n.t('piensaRival');
    pintarTablero();
    setTimeout(function () {
      if (partidaTerminada) return;
      var movs = movimientosBando(celdas, RIVAL);
      if (movs.length === 0) {
        /* The opponent is blocked: the person wins. */
        estadoEl.textContent = App.i18n.t('rivalBloqueado');
        terminar('ganas');
        return;
      }
      var mov = eligeMovimientoRival(movs);
      var eraDama = celdas[mov.de].dama;
      celdas = simular(celdas, mov);

      var mensajes = [App.i18n.t(mov.come !== -1 ? 'rivalCome' : 'rivalMueve')];
      if (!eraDama && celdas[mov.a].dama) mensajes.push(App.i18n.t('coronaRival'));
      estadoEl.textContent = mensajes.join(' ');
      pintarTablero();

      if (contarFichas(celdas, JUGADOR) === 0) { terminar('rival'); return; }
      setTimeout(empiezaTurnoJugador, DELAY);
    }, DELAY);
  }

  function empiezaTurnoJugador() {
    if (partidaTerminada) return;
    if (movimientosBando(celdas, JUGADOR).length === 0) {
      /* La persona no puede mover: cierre amable comparando fichas. */
      var mias = contarFichas(celdas, JUGADOR);
      var suyas = contarFichas(celdas, RIVAL);
      if (mias > suyas) terminar('cerradoGanas');
      else if (mias === suyas) terminar('cerradoEmpate');
      else terminar('cerradoRival');
      return;
    }
    turnoJugador = true;
    seleccion = -1;
    estadoEl.textContent = App.i18n.t('teToca');
    pintarTablero();
  }

  /* ---- Hint on demand (two-step Socratic method) ----
     1st tap: a question that directs attention to the key detail,
     without stating the move. 2nd tap: marks the piece and the
     destination square and explains why. Resets on moving. */
  function limpiarAyuda() {
    ayudaPaso = 0;
    ayudaWrap.classList.add('oculto');
    ayudaTextoEl.textContent = '';
    botones.forEach(function (b) { if (b) b.classList.remove('sugerida'); });
  }

  /* Recomienda la mejor jugada: comer > mover a una casilla donde el
     rival no puede comerte > cualquier jugada legal. */
  function recomendar() {
    var movs = movimientosBando(celdas, JUGADOR);
    var comidas = movs.filter(function (m) { return m.come !== -1; });
    if (comidas.length) return { mov: App.utils.shuffle(comidas)[0], tipo: 'Come' };
    var seguras = movs.filter(function (m) {
      var despues = simular(celdas, m);
      return !movimientosBando(despues, RIVAL).some(function (r) { return r.come === m.a; });
    });
    if (seguras.length) return { mov: App.utils.shuffle(seguras)[0], tipo: 'Segura' };
    return { mov: App.utils.shuffle(movs)[0], tipo: 'Libre' };
  }

  function pedirAyuda() {
    if (partidaTerminada || !turnoJugador) return;
    var rec = recomendar();
    ayudaPaso = ayudaPaso >= 2 ? 2 : ayudaPaso + 1;
    var texto = App.i18n.t('ayuda' + rec.tipo + ayudaPaso);
    ayudaTextoEl.textContent = texto;
    ayudaWrap.classList.remove('oculto');
    if (ayudaPaso === 2) {
      botones[rec.mov.de].classList.add('sugerida');
      botones[rec.mov.a].classList.add('sugerida');
    }
    App.tts.speak(texto);
  }

  /* ---- Final de partida (regla 5: nunca castigo) ---- */
  function terminar(tipo) {
    partidaTerminada = true;
    turnoJugador = false;
    seleccion = -1;
    pintarTablero();

    var ganas = (tipo === 'ganas' || tipo === 'cerradoGanas');
    var clave = tipo === 'ganas' ? 'hasGanado' :
      tipo === 'rival' ? 'haGanadoRival' : tipo;
    if (ganas) {
      estadoEl.textContent = App.i18n.t(clave);
      progreso.estrellas += 1;
      progreso.victorias[nivel.id] = (progreso.victorias[nivel.id] || 0) + 1;
      guardar();
      pintarEstrellas();
      App.feedback.celebrate(App.i18n.t(clave));
$('#transferencia').textContent = App.i18n.t('transferencia');
    } else if (tipo === 'cerradoEmpate') {
      estadoEl.textContent = App.i18n.t(clave);
      App.feedback.success(feedbackEl);
    } else {
      estadoEl.textContent = App.i18n.t(clave);
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

