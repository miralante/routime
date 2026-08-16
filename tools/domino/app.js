/* ============================================================
   Routime — Dominó (razonamiento: juego de mesa real adaptado)
   Datos en data.js (DATA.niveles con maxPips). Reescritura completa:
   la versión anterior era un solitario donde había que GIRAR la
   ficha a mano antes de colocarla (mucha fricción). Ahora es el
   juego de mesa de verdad, simplificado:
   - Mano de 4 fichas, rival tranquilo y montón para robar.
   - Tocas una ficha que encaja y SE ORIENTA SOLA al colocarse;
     solo se pregunta el lado si encaja en los dos extremos.
   - Ficha que no encaja: pista socrática (regla 12) y, al segundo
     fallo, se marcan las fichas jugables. Sin castigos (regla 5).
   - Si no puedes poner, robas del montón; si está vacío, pasas.
     Dos pases seguidos cierran la partida (gana quien tiene menos).
   Ganar da 1 estrella; perder solo da ánimo y otra partida.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'domino';
  var $ = App.utils.$;
  var DELAY = App.utils.reducedMotion() ? 0 : 800;

  /* Posiciones de los puntos (0-8 en una rejilla 3×3) por valor */
  var PIPS = {
    0: [], 1: [4], 2: [0, 8], 3: [0, 4, 8],
    4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]
  };

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var estadoEl = $('#estado');
  var cadenaEl = $('#cadena');
  var manoEl = $('#mano');
  var montonBtn = $('#monton');
  var rivalInfoEl = $('#rivalInfo');
  var ladosEl = $('#lados');
  var feedbackEl = $('#feedback');
  var btnOtraPartida = $('#btnOtraPartida');
  var btnSalir = $('#btnSalir');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.victorias) progreso.victorias = {};

  /* Estado de la partida */
  var nivel = null;
  var manoJugador = [];
  var manoRival = [];
  var monton = [];
  var cadena = [];          /* fichas colocadas, ya orientadas: [izq, der] */
  var turnoJugador = true;
  var partidaTerminada = false;
  var fichaPendiente = -1;  /* hand index waiting to choose a side */
  var fallosSeguidos = 0;
  var pasesSeguidos = 0;

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }
  function t(clave) { return App.i18n.t(clave); }

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
        ' <span class="nivel-info">(' + veces + ' ' + t('veces') + ')</span>';
      btn.addEventListener('click', function () { iniciarPartida(n); });
      cont.appendChild(btn);
    });
  }

  /* ---- Reparto ---- */
  function generarFichas(maxPips) {
    var fichas = [];
    for (var a = 0; a <= maxPips; a++) {
      for (var b = a; b <= maxPips; b++) fichas.push([a, b]);
    }
    return App.utils.shuffle(fichas);
  }

  function iniciarPartida(n) {
    nivel = n;
    var mazo = generarFichas(n.maxPips);
    var mano = banco().manoInicial;
    manoJugador = mazo.slice(0, mano);
    manoRival = mazo.slice(mano, mano * 2);
    monton = mazo.slice(mano * 2);
    cadena = [];
    turnoJugador = true;
    partidaTerminada = false;
    fichaPendiente = -1;
    fallosSeguidos = 0;
    pasesSeguidos = 0;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnOtraPartida.classList.add('oculto');
    ladosEl.classList.add('oculto');
    pantallaInicio.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    anunciarTurno();
    pintarTodo();
  }

  /* ---- Utilidades del juego ---- */
  function extremoIzq() { return cadena.length ? cadena[0][0] : null; }
  function extremoDer() { return cadena.length ? cadena[cadena.length - 1][1] : null; }

  /* Returns where a tile fits: 'izq' | 'der' | 'ambos' | null.
     With an empty chain any tile fits ('der'). */
  function dondeEncaja(ficha) {
    if (!cadena.length) return 'der';
    var izq = ficha[0] === extremoIzq() || ficha[1] === extremoIzq();
    var der = ficha[0] === extremoDer() || ficha[1] === extremoDer();
    if (izq && der) return 'ambos';
    if (izq) return 'izq';
    if (der) return 'der';
    return null;
  }

  function jugables(mano) {
    var res = [];
    mano.forEach(function (f, i) { if (dondeEncaja(f)) res.push(i); });
    return res;
  }

  /* ---- Render ---- */
  function pintarFicha(contenedor, ficha) {
    [0, 1].forEach(function (lado) {
      var mitad = document.createElement('span');
      mitad.className = 'mitad';
      PIPS[ficha[lado]].forEach(function (pos) {
        var pip = document.createElement('span');
        pip.className = 'pip pos' + pos;
        mitad.appendChild(pip);
      });
      contenedor.appendChild(mitad);
    });
  }

  function pintarCadena() {
    cadenaEl.innerHTML = '';
    cadena.forEach(function (f) {
      var el = document.createElement('div');
      el.className = 'ficha colocada';
      el.setAttribute('aria-label', t('fichaAria').replace('{a}', f[0]).replace('{b}', f[1]));
      pintarFicha(el, f);
      cadenaEl.appendChild(el);
    });
  }

  function pintarMano(marcarJugables) {
    manoEl.innerHTML = '';
    manoJugador.forEach(function (f, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ficha jugable';
      if (marcarJugables && dondeEncaja(f)) btn.classList.add('sugerida');
      if (i === fichaPendiente) btn.classList.add('pendiente');
      btn.setAttribute('aria-label', t('fichaAria').replace('{a}', f[0]).replace('{b}', f[1]));
      btn.disabled = !turnoJugador || partidaTerminada;
      pintarFicha(btn, f);
      btn.addEventListener('click', function () { tocarFicha(i); });
      manoEl.appendChild(btn);
    });
  }

  function pintarMonton() {
    var n = monton.length;
    montonBtn.textContent = '🂠 ' + n;
    montonBtn.disabled = !turnoJugador || partidaTerminada || n === 0;
    montonBtn.setAttribute('aria-label',
      n === 0 ? t('montonVacio') : t('montonAria').replace('{n}', n));
  }

  function pintarTodo(marcarJugables) {
    pintarCadena();
    pintarMano(marcarJugables);
    pintarMonton();
    rivalInfoEl.textContent = t('fichasRival').replace('{n}', manoRival.length);
    pintarEstrellas();
    /* The last tile placed stays in view */
    if (cadenaEl.lastChild) {
      cadenaEl.lastChild.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  function anunciarTurno() {
    if (!cadena.length) {
      estadoEl.textContent = t('primeraFicha');
    } else {
      estadoEl.textContent = t('teToca')
        .replace('{a}', extremoIzq()).replace('{b}', extremoDer());
    }
  }

  /* ---- Turno de la persona ---- */
  function tocarFicha(i) {
    if (!turnoJugador || partidaTerminada) return;
    var encaje = dondeEncaja(manoJugador[i]);
    if (!encaje) {
      fallosSeguidos += 1;
      App.feedback.encourage(feedbackEl);
      if (fallosSeguidos === 1) {
        /* Regla 12: primero una pista que dirige la mirada */
        estadoEl.textContent = t('pistaNoEncaja')
          .replace('{a}', extremoIzq()).replace('{b}', extremoDer());
      } else if (jugables(manoJugador).length) {
        estadoEl.textContent = t('pistaMarcadas');
        pintarTodo(true);
      } else {
        estadoEl.textContent = t('pistaRobar');
      }
      return;
    }
    if (encaje === 'ambos') {
      fichaPendiente = i;
      ladosEl.classList.remove('oculto');
      estadoEl.textContent = t('eligeLado');
      pintarTodo();
      return;
    }
    colocar(i, encaje);
  }

  /* Orients the tile on its own based on the end, and places it */
  function colocar(i, lado) {
    var f = manoJugador[i].slice();
    if (cadena.length) {
      if (lado === 'izq') {
        if (f[0] === extremoIzq()) f = [f[1], f[0]];
        cadena.unshift(f);
      } else {
        if (f[1] === extremoDer()) f = [f[1], f[0]];
        cadena.push(f);
      }
    } else {
      cadena.push(f);
    }
    manoJugador.splice(i, 1);
    fichaPendiente = -1;
    fallosSeguidos = 0;
    pasesSeguidos = 0;
    ladosEl.classList.add('oculto');
    App.feedback.success(feedbackEl);
    pintarTodo();
    if (!manoJugador.length) { terminar('ganas'); return; }
    turnoRival();
  }

  function robar() {
    if (!turnoJugador || partidaTerminada) return;
    if (jugables(manoJugador).length) {
      App.feedback.encourage(feedbackEl);
      estadoEl.textContent = t('pistaMarcadas');
      pintarTodo(true);
      return;
    }
    if (!monton.length) { pasarJugador(); return; }
    manoJugador.push(monton.pop());
    estadoEl.textContent = t('hasRobado');
    pintarTodo();
  }

  function pasarJugador() {
    pasesSeguidos += 1;
    estadoEl.textContent = t('tuPasas');
    if (pasesSeguidos >= 2) { cerrarPartida(); return; }
    setTimeout(turnoRival, DELAY);
  }

  /* Devuelve el turno a la persona; si no puede jugar ni robar
     (montón vacío), pasa sola — sin dejarla atrapada. */
  function empiezaTurnoJugador() {
    if (partidaTerminada) return;
    turnoJugador = true;
    if (!jugables(manoJugador).length && !monton.length) {
      turnoJugador = false;
      pintarTodo();
      pasarJugador();
      return;
    }
    anunciarTurno();
    pintarTodo();
  }

  /* ---- Turno del rival (visible y con calma) ---- */
  function turnoRival() {
    turnoJugador = false;
    pintarTodo();
    estadoEl.textContent = t('piensaRival');
    setTimeout(pasoRival, DELAY);
  }

  function pasoRival() {
    if (partidaTerminada) return;
    var opciones = jugables(manoRival);
    if (opciones.length) {
      var i = App.utils.shuffle(opciones)[0];
      var encaje = dondeEncaja(manoRival[i]);
      var lado = encaje === 'ambos' ? App.utils.shuffle(['izq', 'der'])[0] : encaje;
      var f = manoRival[i].slice();
      if (cadena.length) {
        if (lado === 'izq') {
          if (f[0] === extremoIzq()) f = [f[1], f[0]];
          cadena.unshift(f);
        } else {
          if (f[1] === extremoDer()) f = [f[1], f[0]];
          cadena.push(f);
        }
      } else {
        cadena.push(f);
      }
      manoRival.splice(i, 1);
      pasesSeguidos = 0;
      estadoEl.textContent = t('rivalPone');
      pintarTodo();
      if (!manoRival.length) { terminar('rival'); return; }
      setTimeout(empiezaTurnoJugador, DELAY);
      return;
    }
    if (monton.length) {
      manoRival.push(monton.pop());
      estadoEl.textContent = t('rivalRoba');
      pintarTodo();
      setTimeout(pasoRival, DELAY);
      return;
    }
    pasesSeguidos += 1;
    estadoEl.textContent = t('rivalPasa');
    if (pasesSeguidos >= 2) { cerrarPartida(); return; }
    setTimeout(empiezaTurnoJugador, DELAY);
  }

  /* ---- Finales (nunca punitivos, regla 5) ---- */
  function cerrarPartida() {
    if (manoJugador.length < manoRival.length) terminar('cerradoGanas');
    else if (manoJugador.length === manoRival.length) terminar('cerradoEmpate');
    else terminar('cerradoRival');
  }

  function terminar(tipo) {
    partidaTerminada = true;
    turnoJugador = false;
    var clave = tipo === 'ganas' ? 'hasGanado'
      : tipo === 'rival' ? 'ganaRival' : tipo;
    estadoEl.textContent = t(clave);
    if (tipo === 'ganas' || tipo === 'cerradoGanas') {
      progreso.estrellas += 1;
      progreso.victorias[nivel.id] = (progreso.victorias[nivel.id] || 0) + 1;
      guardar();
      App.feedback.celebrate(t(clave));
$('#transferencia').textContent = App.i18n.t('transferencia');
    } else if (tipo === 'cerradoEmpate') {
      App.feedback.success(feedbackEl);
    } else {
      App.feedback.encourage(feedbackEl);
    }
    pintarTodo();
    btnOtraPartida.classList.remove('oculto');
    btnOtraPartida.focus();
  }

  /* ---- Eventos ---- */
  montonBtn.addEventListener('click', robar);
  $('#btnLadoIzq').addEventListener('click', function () {
    if (fichaPendiente !== -1) colocar(fichaPendiente, 'izq');
  });
  $('#btnLadoDer').addEventListener('click', function () {
    if (fichaPendiente !== -1) colocar(fichaPendiente, 'der');
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

