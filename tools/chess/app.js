/* ============================================================
   Routime — El Ajedrez (razonamiento: planificación y
   anticipación). Datos en data.js. Módulos compartidos en assets/js/.
   Dos actividades desde un menú (patrón La Compra):
   - Las piezas: puzzles de recoger estrellas ⭐ en tablero 5×5 para
     aprender el movimiento de cada pieza (un nivel por pieza, regla
     13). El tablero se genera al vuelo con un paseo aleatorio de
     movimientos legales (patrón El Camino): las estrellas quedan en
     casillas visitadas, así SIEMPRE hay solución. Sin rival y sin
     fallo posible: solo se pueden tocar casillas legales.
   - Mini partida: duelo 5×5 (torre, caballo, rey, alfil, dama; sin
     peones, sin jaque). Se gana capturando el rey del rival. El
     rival juega según la habilidad del nivel (azar / captura /
     protege — regla 13). Perder no se castiga (regla 5).
   Ambas con botón 💡 de ayuda socrática en dos pasos.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'ajedrez';
  var $ = App.utils.$;
  var N = 5;                       /* tablero 5×5 */
  var JUGADOR = 'J';
  var RIVAL = 'R';
  var GLIFO = {
    J: { torre: '♖', caballo: '♘', alfil: '♗', dama: '♕', rey: '♔' },
    R: { torre: '♜', caballo: '♞', alfil: '♝', dama: '♛', rey: '♚' }
  };
  /* Starting setup (same column on both sides). The order matters:
     the rook and queen share a column with the opponent's, so they
     can capture each other on the first turn — with the king next
     to it (column 1), those captures ALWAYS get answered (a fair
     piece-for-piece trade, never a free piece that unbalances the
     game on turn 1). */
  var ORDEN_FILA = ['torre', 'rey', 'dama', 'alfil', 'caballo'];
  var DELAY = App.utils.reducedMotion() ? 0 : 800;

  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.rondasPiezas) progreso.rondasPiezas = {};
  if (!progreso.victorias) progreso.victorias = {};

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function fila(i) { return Math.floor(i / N); }
  function col(i) { return i % N; }
  function dentro(f, c) { return f >= 0 && f < N && c >= 0 && c < N; }

  /* ---- Pantallas ---- */
  var PANTALLAS = ['pantallaMenu', 'pantallaNivelesPiezas', 'pantallaJuegoPiezas',
    'pantallaNivelesPartida', 'pantallaJuegoPartida', 'pantallaFinal'];
  function mostrar(id) {
    PANTALLAS.forEach(function (p) { $('#' + p).classList.add('oculto'); });
    $('#' + id).classList.remove('oculto');
  }

  /* ============================================================
     Movimiento de piezas (compartido por las dos actividades).
     tab: array de 25 con null | { bando: 'J'|'R', tipo: 'torre'|… }
     Devuelve [{ de, a }]; una jugada captura si tab[a] es contraria.
     ============================================================ */
  var RECTAS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  var DIAGONALES = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  var SALTOS_L = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

  function movimientosDePieza(tab, i) {
    var p = tab[i];
    if (!p) return [];
    var f = fila(i); var c = col(i);
    var movs = [];
    function intenta(f1, c1) {
      if (!dentro(f1, c1)) return 'fuera';
      var j = f1 * N + c1;
      if (!tab[j]) { movs.push({ de: i, a: j }); return 'sigue'; }
      if (tab[j].bando !== p.bando) movs.push({ de: i, a: j });
      return 'para';
    }
    if (p.tipo === 'caballo') {
      SALTOS_L.forEach(function (d) { intenta(f + d[0], c + d[1]); });
    } else if (p.tipo === 'rey') {
      RECTAS.concat(DIAGONALES).forEach(function (d) { intenta(f + d[0], c + d[1]); });
    } else {
      var dirs = p.tipo === 'torre' ? RECTAS :
        p.tipo === 'alfil' ? DIAGONALES : RECTAS.concat(DIAGONALES);
      dirs.forEach(function (d) {
        for (var k = 1; k < N; k++) {
          if (intenta(f + d[0] * k, c + d[1] * k) !== 'sigue') break;
        }
      });
    }
    return movs;
  }

  function movimientosBando(tab, bando) {
    var movs = [];
    for (var i = 0; i < N * N; i++) {
      if (tab[i] && tab[i].bando === bando) movs = movs.concat(movimientosDePieza(tab, i));
    }
    return movs;
  }

  function simular(tab, mov) {
    var copia = tab.map(function (p) { return p ? { bando: p.bando, tipo: p.tipo } : null; });
    copia[mov.a] = copia[mov.de];
    copia[mov.de] = null;
    return copia;
  }

  function contarPiezas(tab, bando) {
    return tab.filter(function (p) { return p && p.bando === bando; }).length;
  }

  /* ¿Puede 'bando' capturar el rey contrario en 'tab'? Devuelve la
     jugada que lo hace, o null. */
  function capturaDeRey(tab, bando) {
    var movs = movimientosBando(tab, bando);
    for (var k = 0; k < movs.length; k++) {
      var obj = tab[movs[k].a];
      if (obj && obj.tipo === 'rey') return movs[k];
    }
    return null;
  }

  /* Nombre hablado/aria de una pieza ("Tu torre" / "Dama del rival"). */
  function nombrePieza(p) {
    var n = App.i18n.t('pieza' + cap(p.tipo));
    var plantilla = App.i18n.t(p.bando === JUGADOR ? 'tuPieza' : 'piezaDelRival');
    return plantilla.replace('{p}', n);
  }

  function posTexto(i) {
    return App.i18n.t('fila').replace('{f}', fila(i) + 1).replace('{c}', col(i) + 1);
  }

  /* Crea los 25 botones de un tablero y devuelve el array. */
  function crearTablero(contenedor, alTocar) {
    contenedor.innerHTML = '';
    var botones = [];
    for (var i = 0; i < N * N; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'celda' + (i % 2 === 1 ? ' oscura' : '');
      (function (idx, b) {
        b.addEventListener('click', function () { alTocar(idx); });
      })(i, btn);
      contenedor.appendChild(btn);
      botones.push(btn);
    }
    return botones;
  }

  /* ============================================================
     Actividad 1 — Las piezas (puzzles de estrellas)
     ============================================================ */
  var tableroPiezasEl = $('#tableroPiezas');
  var estadoPiezasEl = $('#estadoPiezas');
  var feedbackPiezasEl = $('#feedbackPiezas');
  var ayudaPiezasWrap = $('#ayudaPiezasWrap');
  var ayudaPiezasTextoEl = $('#ayudaPiezasTexto');

  var nivelPiezas = null;
  var botonesP = [];
  var posPieza = -1;
  var estrellas = [];      /* casillas con estrella pendientes */
  var resueltos = 0;
  var ayudaPasoP = 0;

  function pintarNivelesPiezas() {
    var cont = $('#nivelesPiezas');
    cont.innerHTML = '';
    banco().piezas.niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.rondasPiezas[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + veces + ' ' + App.i18n.t('rondas') + ')</span>';
      btn.addEventListener('click', function () { iniciarRondaPiezas(n); });
      cont.appendChild(btn);
    });
  }

  /* Genera un puzzle siempre resoluble: paseo aleatorio de la pieza
     por un tablero vacío; las estrellas se dejan en casillas
     visitadas y la pieza empieza donde acabó el paseo (todos los
     movimientos de estas piezas son reversibles). */
  function generarPuzzle(tipo) {
    for (var intento = 0; intento < 30; intento++) {
      var pos = Math.floor(Math.random() * N * N);
      var tab = new Array(N * N).fill(null);
      tab[pos] = { bando: JUGADOR, tipo: tipo };
      var visitadas = [];
      for (var k = 0; k < 6; k++) {
        var movs = movimientosDePieza(tab, pos);
        var mov = App.utils.shuffle(movs)[0];
        tab[pos] = null;
        pos = mov.a;
        tab[pos] = { bando: JUGADOR, tipo: tipo };
        visitadas.push(pos);
      }
      var candidatas = [];
      visitadas.forEach(function (v) {
        if (v !== pos && candidatas.indexOf(v) === -1) candidatas.push(v);
      });
      if (candidatas.length >= 2) {
        var cuantas = Math.min(candidatas.length, 2 + Math.floor(Math.random() * 2));
        return { pos: pos, estrellas: App.utils.shuffle(candidatas).slice(0, cuantas) };
      }
    }
    /* Should never reach here; minimal emergency puzzle. */
    return { pos: 0, estrellas: [tipo === 'alfil' ? 12 : 2] };
  }

  function nuevoPuzzle() {
    var puzzle = generarPuzzle(nivelPiezas.pieza);
    posPieza = puzzle.pos;
    estrellas = puzzle.estrellas;
    limpiarAyudaPiezas();
    var texto = App.i18n.t('movimiento' + cap(nivelPiezas.pieza)) + ' ' + App.i18n.t('puzzleEstado');
    estadoPiezasEl.textContent = texto;
    pintarPiezas();
  }

  function destinosPuzzle() {
    var tab = new Array(N * N).fill(null);
    tab[posPieza] = { bando: JUGADOR, tipo: nivelPiezas.pieza };
    return movimientosDePieza(tab, posPieza);
  }

  function pintarPiezas() {
    var destinos = destinosPuzzle();
    botonesP.forEach(function (btn, i) {
      var esDestino = destinos.some(function (m) { return m.a === i; });
      var contenido = '';
      var etiqueta = App.i18n.t('casillaVacia');
      if (i === posPieza) {
        contenido = '<span class="pieza tuya-pieza">' + GLIFO.J[nivelPiezas.pieza] + '</span>';
        etiqueta = nombrePieza({ bando: JUGADOR, tipo: nivelPiezas.pieza });
      } else if (estrellas.indexOf(i) !== -1) {
        contenido = '<span class="pieza">⭐</span>';
        etiqueta = App.i18n.t('casillaEstrella');
      }
      btn.innerHTML = contenido;
      btn.disabled = !esDestino;
      if (esDestino) etiqueta = App.i18n.t('casillaDestino') + ', ' + etiqueta;
      btn.setAttribute('aria-label', etiqueta + ', ' + posTexto(i));
      btn.classList.toggle('destino', esDestino);
    });
  }

  function pintarProgresoPiezas() {
    var total = banco().piezas.porRonda;
    $('#progressPiezasFill').style.width = (resueltos / total * 100) + '%';
    $('#progressPiezasText').textContent = resueltos + ' / ' + total;
  }

  function iniciarRondaPiezas(n) {
    nivelPiezas = n;
    resueltos = 0;
    feedbackPiezasEl.textContent = '';
    feedbackPiezasEl.className = 'feedback';
    botonesP = crearTablero(tableroPiezasEl, tocarPiezas);
    pintarProgresoPiezas();
    mostrar('pantallaJuegoPiezas');
    nuevoPuzzle();
    App.tts.speak(App.i18n.t('movimiento' + cap(n.pieza)));
  }

  function tocarPiezas(i) {
    var destinos = destinosPuzzle();
    if (!destinos.some(function (m) { return m.a === i; })) return;
    limpiarAyudaPiezas();
    posPieza = i;
    var idx = estrellas.indexOf(i);
    if (idx !== -1) {
      estrellas.splice(idx, 1);
      estadoPiezasEl.textContent = App.i18n.t(estrellas.length ? 'estrellaRecogida' : 'puzzleCompletado');
      App.feedback.success(feedbackPiezasEl);
    }
    pintarPiezas();
    if (estrellas.length === 0) {
      resueltos += 1;
      pintarProgresoPiezas();
      if (resueltos >= banco().piezas.porRonda) {
        setTimeout(finRondaPiezas, DELAY);
      } else {
        setTimeout(nuevoPuzzle, DELAY * 2);
      }
    }
  }

  function finRondaPiezas() {
    progreso.estrellas += 1;
    progreso.rondasPiezas[nivelPiezas.id] = (progreso.rondasPiezas[nivelPiezas.id] || 0) + 1;
    guardar();
    pintarEstrellas();
    $('#resumenFinal').textContent = App.i18n.t('resumenPiezas').replace('{n}', resueltos);
$('#transferencia').textContent = App.i18n.t('transferencia');
    mostrar('pantallaFinal');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Puzzle hint: 1st tap asks; 2nd marks the square that picks up a
     star or, if none is reachable, the one that gets closest. */
  function limpiarAyudaPiezas() {
    ayudaPasoP = 0;
    ayudaPiezasWrap.classList.add('oculto');
    ayudaPiezasTextoEl.textContent = '';
    botonesP.forEach(function (b) { b.classList.remove('sugerida'); });
  }

  function mejorDestinoPuzzle() {
    var destinos = destinosPuzzle();
    var directo = destinos.filter(function (m) { return estrellas.indexOf(m.a) !== -1; });
    if (directo.length) return App.utils.shuffle(directo)[0].a;
    var mejor = destinos[0].a;
    var mejorDist = Infinity;
    destinos.forEach(function (m) {
      estrellas.forEach(function (e) {
        var d = Math.abs(fila(m.a) - fila(e)) + Math.abs(col(m.a) - col(e));
        if (d < mejorDist) { mejorDist = d; mejor = m.a; }
      });
    });
    return mejor;
  }

  function pedirAyudaPiezas() {
    ayudaPasoP = ayudaPasoP >= 2 ? 2 : ayudaPasoP + 1;
    var texto = App.i18n.t('ayudaPuzzle' + ayudaPasoP);
    ayudaPiezasTextoEl.textContent = texto;
    ayudaPiezasWrap.classList.remove('oculto');
    App.tts.speak(texto);
  }

  /* ============================================================
     Actividad 2 — Mini partida
     ============================================================ */
  var tableroPartidaEl = $('#tableroPartida');
  var estadoPartidaEl = $('#estadoPartida');
  var feedbackPartidaEl = $('#feedbackPartida');
  var ayudaPartidaWrap = $('#ayudaPartidaWrap');
  var ayudaPartidaTextoEl = $('#ayudaPartidaTexto');
  var btnOtraPartida = $('#btnOtraPartida');

  var nivelPartida = null;
  var botonesM = [];
  var tabM = [];
  var turnoJugador = true;
  var partidaTerminada = false;
  var seleccion = -1;
  var ayudaPasoM = 0;

  function pintarNivelesPartida() {
    var cont = $('#nivelesPartida');
    cont.innerHTML = '';
    banco().partida.niveles.forEach(function (n) {
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

  function iniciarPartida(n) {
    nivelPartida = n;
    tabM = new Array(N * N).fill(null);
    ORDEN_FILA.forEach(function (tipo, c) {
      tabM[c] = { bando: RIVAL, tipo: tipo };
      tabM[(N - 1) * N + c] = { bando: JUGADOR, tipo: tipo };
    });
    seleccion = -1;
    turnoJugador = true;
    partidaTerminada = false;
    feedbackPartidaEl.textContent = '';
    feedbackPartidaEl.className = 'feedback';
    btnOtraPartida.classList.add('oculto');
    estadoPartidaEl.textContent = App.i18n.t('teToca');
    botonesM = crearTablero(tableroPartidaEl, tocarPartida);
    limpiarAyudaPartida();
    mostrar('pantallaJuegoPartida');
    pintarPartida();
    pintarEstrellas();
  }

  function destinosDeSeleccion() {
    return seleccion === -1 ? [] : movimientosDePieza(tabM, seleccion);
  }

  function pintarPartida() {
    var destinos = destinosDeSeleccion();
    var movibles = {};
    if (turnoJugador && !partidaTerminada) {
      movimientosBando(tabM, JUGADOR).forEach(function (m) { movibles[m.de] = true; });
    }
    botonesM.forEach(function (btn, i) {
      var p = tabM[i];
      btn.innerHTML = p ? '<span class="pieza' + (p.bando === JUGADOR ? ' tuya-pieza' : '') + '">' +
        GLIFO[p.bando][p.tipo] + '</span>' : '';
      var esDestino = destinos.some(function (m) { return m.a === i; });
      btn.disabled = partidaTerminada || !turnoJugador || !(movibles[i] || esDestino || i === seleccion);
      var etiqueta = p ? nombrePieza(p) : App.i18n.t('casillaVacia');
      if (esDestino) etiqueta = App.i18n.t('casillaDestino') + ', ' + etiqueta;
      btn.setAttribute('aria-label', etiqueta + ', ' + posTexto(i));
      btn.classList.toggle('tuya', !!p && p.bando === JUGADOR);
      btn.classList.toggle('rival', !!p && p.bando === RIVAL);
      btn.classList.toggle('elegida', i === seleccion);
      btn.classList.toggle('destino', esDestino);
    });
  }

  function tocarPartida(i) {
    if (partidaTerminada || !turnoJugador) return;
    var p = tabM[i];
    if (p && p.bando === JUGADOR) {
      seleccion = (seleccion === i) ? -1 : i;
      estadoPartidaEl.textContent = App.i18n.t(seleccion === -1 ? 'teToca' : 'eligeDestino');
      pintarPartida();
      return;
    }
    var mov = null;
    destinosDeSeleccion().forEach(function (m) { if (m.a === i) mov = m; });
    if (mov) moverJugador(mov);
  }

  function moverJugador(mov) {
    limpiarAyudaPartida();
    var capturada = tabM[mov.a];
    tabM = simular(tabM, mov);
    seleccion = -1;
    turnoJugador = false;
    if (capturada && capturada.tipo === 'rey') {
      pintarPartida();
      terminar('ganas');
      return;
    }
    if (capturada) {
      estadoPartidaEl.textContent = App.i18n.t('hasCapturado');
      App.tts.speak(App.i18n.t('hasCapturado'));
    }
    pintarPartida();
    setTimeout(turnoRival, capturada ? DELAY * 2 : DELAY);
  }

  /* The opponent plays according to the level's skill (see data.js):
     'azar' random; 'captura' also captures when possible and finishes
     the king; 'protege' also avoids leaving its king or the moved
     piece exposed. Each level adds ONE skill (rule 13). */
  function eligeMovimientoRival(movs) {
    var hab = nivelPartida.habilidad;
    if (hab === 'captura' || hab === 'protege') {
      var mate = null;
      movs.forEach(function (m) {
        if (tabM[m.a] && tabM[m.a].tipo === 'rey') mate = m;
      });
      if (mate) return mate;
    }
    var base = movs;
    if (hab === 'protege') {
      /* Primero, no dejar su rey a tiro del jugador. */
      var aSalvo = movs.filter(function (m) {
        return !capturaDeRey(simular(tabM, m), JUGADOR);
      });
      if (aSalvo.length) base = aSalvo;
    }
    if (hab === 'captura' || hab === 'protege') {
      var capturas = base.filter(function (m) { return !!tabM[m.a]; });
      if (hab === 'protege') {
        var capSeguras = capturas.filter(function (m) {
          var despues = simular(tabM, m);
          return !movimientosBando(despues, JUGADOR).some(function (r) { return r.a === m.a; });
        });
        if (capSeguras.length) return App.utils.shuffle(capSeguras)[0];
        var movSeguras = base.filter(function (m) {
          if (tabM[m.a]) return false;
          var despues = simular(tabM, m);
          return !movimientosBando(despues, JUGADOR).some(function (r) { return r.a === m.a; });
        });
        if (movSeguras.length) return App.utils.shuffle(movSeguras)[0];
      }
      if (capturas.length) return App.utils.shuffle(capturas)[0];
    }
    return App.utils.shuffle(base)[0];
  }

  function turnoRival() {
    if (partidaTerminada) return;
    estadoPartidaEl.textContent = App.i18n.t('piensaRival');
    pintarPartida();
    setTimeout(function () {
      if (partidaTerminada) return;
      var movs = movimientosBando(tabM, RIVAL);
      if (movs.length === 0) {
        estadoPartidaEl.textContent = App.i18n.t('rivalBloqueado');
        terminar('ganas');
        return;
      }
      var mov = eligeMovimientoRival(movs);
      var capturada = tabM[mov.a];
      tabM = simular(tabM, mov);
      if (capturada && capturada.tipo === 'rey') {
        pintarPartida();
        terminar('rival');
        return;
      }
      estadoPartidaEl.textContent = App.i18n.t(capturada ? 'rivalCome' : 'rivalMueve');
      pintarPartida();
      setTimeout(empiezaTurnoJugador, DELAY);
    }, DELAY);
  }

  function empiezaTurnoJugador() {
    if (partidaTerminada) return;
    if (movimientosBando(tabM, JUGADOR).length === 0) {
      var mias = contarPiezas(tabM, JUGADOR);
      var suyas = contarPiezas(tabM, RIVAL);
      if (mias > suyas) terminar('cerradoGanas');
      else if (mias === suyas) terminar('cerradoEmpate');
      else terminar('cerradoRival');
      return;
    }
    turnoJugador = true;
    seleccion = -1;
    estadoPartidaEl.textContent = App.i18n.t('teToca');
    pintarPartida();
  }

  /* ---- Game hint (two-step Socratic method) ----
     Priority: capture the king > save your king > safe capture >
     safe move > any move. */
  function limpiarAyudaPartida() {
    ayudaPasoM = 0;
    ayudaPartidaWrap.classList.add('oculto');
    ayudaPartidaTextoEl.textContent = '';
    botonesM.forEach(function (b) { b.classList.remove('sugerida'); });
  }

  function recomendar() {
    var movs = movimientosBando(tabM, JUGADOR);
    var mate = null;
    movs.forEach(function (m) { if (tabM[m.a] && tabM[m.a].tipo === 'rey') mate = m; });
    if (mate) return { mov: mate, tipo: 'ReyRival' };

    var reyAmenazado = !!capturaDeRey(tabM, RIVAL);
    var salvan = movs.filter(function (m) {
      return !capturaDeRey(simular(tabM, m), RIVAL);
    });
    if (reyAmenazado && salvan.length) {
      return { mov: App.utils.shuffle(salvan)[0], tipo: 'Salva' };
    }
    var base = salvan.length ? salvan : movs;
    function esSegura(m) {
      var despues = simular(tabM, m);
      return !movimientosBando(despues, RIVAL).some(function (r) { return r.a === m.a; });
    }
    var capSeguras = base.filter(function (m) { return !!tabM[m.a] && esSegura(m); });
    if (capSeguras.length) return { mov: App.utils.shuffle(capSeguras)[0], tipo: 'Come' };
    var seguras = base.filter(function (m) { return !tabM[m.a] && esSegura(m); });
    if (seguras.length) return { mov: App.utils.shuffle(seguras)[0], tipo: 'Segura' };
    return { mov: App.utils.shuffle(base)[0], tipo: 'Libre' };
  }

  function pedirAyudaPartida() {
    if (partidaTerminada || !turnoJugador) return;
    var rec = recomendar();
    ayudaPasoM = ayudaPasoM >= 2 ? 2 : ayudaPasoM + 1;
    var texto = App.i18n.t('ayuda' + rec.tipo + ayudaPasoM);
    ayudaPartidaTextoEl.textContent = texto;
    ayudaPartidaWrap.classList.remove('oculto');
    if (ayudaPasoM === 2) {
      botonesM[rec.mov.de].classList.add('sugerida');
      botonesM[rec.mov.a].classList.add('sugerida');
    }
    App.tts.speak(texto);
  }

  /* ---- Final de partida (regla 5: nunca castigo) ---- */
  function terminar(tipo) {
    partidaTerminada = true;
    turnoJugador = false;
    seleccion = -1;
    pintarPartida();

    var ganas = (tipo === 'ganas' || tipo === 'cerradoGanas');
    var clave = tipo === 'ganas' ? 'hasGanado' :
      tipo === 'rival' ? 'haGanadoRival' : tipo;
    estadoPartidaEl.textContent = App.i18n.t(clave);
    if (ganas) {
      progreso.estrellas += 1;
      progreso.victorias[nivelPartida.id] = (progreso.victorias[nivelPartida.id] || 0) + 1;
      guardar();
      pintarEstrellas();
      App.feedback.celebrate(App.i18n.t(clave));
    } else if (tipo === 'cerradoEmpate') {
      App.feedback.success(feedbackPartidaEl);
    } else {
      App.feedback.encourage(feedbackPartidaEl);
    }
    btnOtraPartida.classList.remove('oculto');
    btnOtraPartida.focus();
  }

  /* ---- Eventos ---- */
  $('#tarjetaPiezas').addEventListener('click', function () {
    pintarNivelesPiezas();
    mostrar('pantallaNivelesPiezas');
  });
  $('#tarjetaPartida').addEventListener('click', function () {
    pintarNivelesPartida();
    mostrar('pantallaNivelesPartida');
  });
  $('#btnVolverMenuPiezas').addEventListener('click', function () { App.tts.stop(); mostrar('pantallaMenu'); });
  $('#btnVolverMenuPartida').addEventListener('click', function () { App.tts.stop(); mostrar('pantallaMenu'); });
  $('#btnVolverMenuFinal').addEventListener('click', function () { App.tts.stop(); mostrar('pantallaMenu'); });

  $('#btnAyudaPiezas').addEventListener('click', pedirAyudaPiezas);
  $('#btnEscucharAyudaPiezas').addEventListener('click', function () {
    App.tts.speak(ayudaPiezasTextoEl.textContent);
  });
  $('#btnAyudaPartida').addEventListener('click', pedirAyudaPartida);
  $('#btnEscucharAyudaPartida').addEventListener('click', function () {
    App.tts.speak(ayudaPartidaTextoEl.textContent);
  });

  $('#btnRepetir').addEventListener('click', function () { iniciarRondaPiezas(nivelPiezas); });
  $('#btnOtroNivelFinal').addEventListener('click', function () {
    pintarNivelesPiezas();
    mostrar('pantallaNivelesPiezas');
  });

  btnOtraPartida.addEventListener('click', function () { iniciarPartida(nivelPartida); });
  $('#btnSalirPartida').addEventListener('click', function () {
    App.tts.stop();
    partidaTerminada = true;
    pintarNivelesPartida();
    mostrar('pantallaNivelesPartida');
  });


  pintarEstrellas();
})();

