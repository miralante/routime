/* ==========================================================================
   Piano Teclas — Lógica
   Un piano virtual que se toca con el teclado del ordenador o tocando
   las teclas en pantalla (son botones reales, no decorativos).
   Usa Web Audio API para generar sonidos de piano.
   Datos musicales en data.js, textos en strings.js.
   ========================================================================== */
(function () {
  'use strict';

  var $ = App.utils.$;
  var $$ = App.utils.$$;
  var SLUG = 'piano-teclas';

  /* Maps the id of each melody/song in data.js to its text key
     in strings.js (the names don't live in data.js: they're language content). */
  var MELODIA_KEYS = {
    ascendente: 'melodiaAscendente', descendente: 'melodiaDescendente',
    doremi: 'melodiaDoReMi', arcoiris: 'melodiaArcoiris', ondina: 'melodiaOndina'
  };
  var CANCION_KEYS = {
    cumpleanos: 'cancionCumpleanos', estrellita: 'cancionEstrellita',
    himnoalegria: 'cancionHimnoalegria', verde: 'cancionVerde'
  };
  var DIFICULTAD_KEYS = { facil: 'dificultadFacil', media: 'dificultadMedia' };

  /* ---------- State and persistence ---------- */
  var state = App.storage.get(SLUG);
  state.nombre = typeof state.nombre === 'string' ? state.nombre : '';
  state.estrellas = state.estrellas || 0;
  state.completado = state.completado || {};
  state.canciones = state.canciones || [];
  state.grabacion = state.grabacion || [];
  state.grabando = false;
  state.octava = typeof state.octava === 'number' ? state.octava : 0; /* -1..1 */

  function guardar() { App.storage.set(SLUG, state); }

  /* ---------- Audio: Web Audio API ---------- */
  var audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Notas musicales con frecuencias en Hz (octava central)
  var NOTAS = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
    'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
  };

  // Mapeo de teclas del teclado a notas
  var TECLAS_NOTAS = {
    'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
    'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
    'u': 'A#', 'j': 'B'
  };

  function frecuenciaDe(nota) {
    var freq = NOTAS[nota];
    if (!freq) return null;
    return freq * Math.pow(2, state.octava);
  }

  function tocarNota(nota, duracion) {
    initAudio();
    var freq = frecuenciaDe(nota);
    if (!freq) return;

    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    var now = audioCtx.currentTime;

    // Piano sound: combination of waves
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Envolvente ADSR simplificada
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.02); // Attack
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.1); // Decay
    gain.gain.exponentialRampToValueAtTime(0.001, now + (duracion || 0.5)); // Release

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + (duracion || 0.5));
  }

  function reproducirMelodia(secuencia, callback) {
    var i = 0;
    function siguiente() {
      if (i >= secuencia.length) {
        if (callback) callback();
        return;
      }
      var item = secuencia[i];
      tocarNota(item.nota, item.duracion || 0.4);
      iluminarTecla(item.nota, 300);
      i++;
      setTimeout(siguiente, 500);
    }
    siguiente();
  }

  function iluminarTecla(nota, duracion) {
    $$('[data-note="' + nota + '"]').forEach(function (el) {
      el.classList.add('active');
      setTimeout(function () { el.classList.remove('active'); }, duracion || 400);
    });
  }

  /* ---------- Visual feedback ---------- */
  /* Pre-existing bug: received the id without '#' and $(id) (querySelector)
     never found the element, silently throwing an exception every time
     it was called (recording, Simon, follow melody, songs, composer
     never showed their feedback message). Found by testing the
     real tool with Playwright, not by reading the code. */
  function mostrarFeedback(id, texto, tipo) {
    var el = $('#' + id);
    el.textContent = texto;
    el.className = 'feedback ' + (tipo || '');
  }

  function crearParticulas() {
    var container = $('#particles');
    var colores = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#2ecc71'];
    for (var i = 0; i < 30; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.background = colores[Math.floor(Math.random() * colores.length)];
      p.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(p);
    }
    setTimeout(function () { container.innerHTML = ''; }, 4000);
  }

  /* ---------- Pantallas ---------- */
  var PANTALLAS = ['pantallaNombre', 'pantallaMenu', 'pantallaLibre',
                   'pantallaSeguir', 'pantallaSimon', 'pantallaCanciones',
                   'pantallaCompositor'];

  function mostrarPantalla(id) {
    PANTALLAS.forEach(function (p) {
      document.getElementById(p).classList.toggle('oculto', p !== id);
    });
  }

  function irMenu() {
    pintarMenu();
    mostrarPantalla('pantallaMenu');
  }

  function irNombre() {
    $('#inputNombre').value = state.nombre;
    $('#avisoNombre').textContent.textContent = '';
    mostrarPantalla('pantallaNombre');
    $('#inputNombre').focus();
  }

  function bonito(nombre) {
    return nombre ? nombre.charAt(0).toUpperCase() + nombre.slice(1) : '';
  }

  function pintarMenu() {
    $('#saludo').textContent.textContent = '';
    $$('.tarjeta-modo').forEach(function (t) {
      var m = t.dataset.modo;
      var badge = t.querySelector('.hecho');
      badge.textContent = state.completado[m] ? '⭐' : '';
    });
    actualizarEstrellas();
  }

  function premiar(clave) {
    if (!state.completado[clave]) {
      state.completado[clave] = true;
      state.estrellas += 1;
      guardar();
      actualizarEstrellas();
      crearParticulas();
    }
  }

  function actualizarEstrellas() {
    $('#stars').textContent.textContent = '';
  }

  /* ---------- Modo libre ---------- */
  function irLibre() {
    mostrarPantalla('pantallaLibre');
    $('#btnSalirLibre').onclick = irMenu;
    $('#instruccionLibre').textContent.textContent = '';
    state.secuenciaActual = [];
    actualizarSecuenciaLibre();
    actualizarBotonGrabacion();
  }

  function actualizarSecuenciaLibre() {
    var el = $('#notaActual');
    if (state.secuenciaActual && state.secuenciaActual.length > 0) {
      var ult = state.secuenciaActual[state.secuenciaActual.length - 1];
      el.textContent = ult.nota;
    } else {
      el.textContent = '🎹';
    }
  }

  function notaTecla(key) {
    var nota = TECLAS_NOTAS[key.toLowerCase()];
    if (nota) {
      tocarNota(nota, 0.5);
      iluminarTecla(nota);

      if (state.grabando) {
        state.grabacion.push({ nota: nota, tecla: key });
      }

      // Solo en modo libre mostramos la nota
      if (!document.getElementById('pantallaLibre').classList.contains('oculto')) {
        state.secuenciaActual = state.secuenciaActual || [];
        state.secuenciaActual.push({ nota: nota });
        actualizarSecuenciaLibre();
      }
    }
  }

  /* ---------- Octava ---------- */
  $('#btnOctavaMas').addEventListener('click', function () {
    if (state.octava >= 1) {
      if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t('octavaMaxima'));
      return;
    }
    state.octava += 1;
    guardar();
    if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t('octavaMasTTS'));
  });

  $('#btnOctavaMenos').addEventListener('click', function () {
    if (state.octava <= -1) {
      if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t('octavaMinima'));
      return;
    }
    state.octava -= 1;
    guardar();
    if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t('octavaMenosTTS'));
  });

  /* ---------- Recording ---------- */
  function actualizarBotonGrabacion() {
    var btnReproducirGrabacion = $('#btnReproducirGrabacion');
    btnReproducirGrabacion.classList.toggle('oculto', state.grabacion.length === 0 || state.grabando);
  }

  $('#btnGrabando').addEventListener('click', function () {
    state.grabando = !state.grabando;
    this.classList.toggle('grabando', state.grabando);
    this.textContent = App.i18n.t(state.grabando ? 'parar' : 'grabando');
    if (state.grabando) {
      state.grabacion = [];
      $('#btnReproducirGrabacion').classList.add('oculto');
      mostrarFeedback('feedbackLibre', App.i18n.t('grabandoAviso'), 'acierto');
    } else {
      mostrarFeedback('feedbackLibre',
        state.grabacion.length > 0
          ? App.i18n.t('grabadoAviso').replace('{n}', state.grabacion.length)
          : App.i18n.t('noTocado'), '');
      actualizarBotonGrabacion();
    }
  });

  $('#btnReproducirGrabacion').addEventListener('click', function () {
    var seq = state.grabacion.map(function (n) { return { nota: n.nota, duracion: 0.4 }; });
    reproducirMelodia(seq);
  });

  $('#btnExplicarLibre').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t('explicarLibreTTS'));
  });

  /* ---------- Simon says ---------- */
  var simon = { secuencia: [], nivel: 1, puntos: 0, turnoJugador: false, idxJugador: 0 };

  function irSimon() {
    mostrarPantalla('pantallaSimon');
    simon.secuencia = [];
    simon.nivel = 1;
    simon.puntos = 0;
    actualizarSimonUI();
    setTimeout(iniciarSimon, 1000);
  }

  function actualizarSimonUI() {
    $('#nivelSimon').textContent.textContent = '';
    $('#puntosSimon').textContent.textContent = '';
  }

  function iniciarSimon() {
    var notas = ['C', 'E', 'G', 'B'];
    simon.secuencia.push(notas[Math.floor(Math.random() * notas.length)]);
    mostrarFeedback('feedbackSimon', App.i18n.t('observaSecuencia'), '');
    reproducirSimon();
  }

  function reproducirSimon() {
    var i = 0;
    function siguiente() {
      if (i >= simon.secuencia.length) {
        simon.turnoJugador = false;
        simon.idxJugador = 0;
        mostrarFeedback('feedbackSimon', App.i18n.t('tuTurno'), '');
        simon.turnoJugador = true;
        return;
      }
      var nota = simon.secuencia[i];
      tocarNota(nota, 0.3);
      var el = document.querySelector('.simon-key[data-note="' + nota + '"]');
      if (el) {
        el.classList.add('lit');
        setTimeout(function () { el.classList.remove('lit'); }, 400);
      }
      i++;
      setTimeout(siguiente, 600);
    }
    setTimeout(siguiente, 500);
  }

  function clickSimon(nota) {
    if (!simon.turnoJugador) return;

    tocarNota(nota, 0.3);
    var el = document.querySelector('.simon-key[data-note="' + nota + '"]');
    if (el) {
      el.classList.add('lit');
      setTimeout(function () { el.classList.remove('lit'); }, 300);
    }

    if (nota === simon.secuencia[simon.idxJugador]) {
      simon.idxJugador++;
      simon.puntos += 10;
      actualizarSimonUI();

      if (simon.idxJugador >= simon.secuencia.length) {
        simon.turnoJugador = false;
        simon.nivel++;
        mostrarFeedback('feedbackSimon', App.i18n.t('correcto'), 'acierto');
        crearParticulas();

        setTimeout(function () {
          simon.secuencia.push(['C', 'E', 'G', 'B'][Math.floor(Math.random() * 4)]);
          mostrarFeedback('feedbackSimon', App.i18n.t('observaSiguiente'), '');
          reproducirSimon();
          actualizarSimonUI();
        }, 1500);
      }
    } else {
      simon.turnoJugador = false;
      mostrarFeedback('feedbackSimon', App.i18n.t('finJuego').replace('{n}', simon.puntos), 'animo');
      if (window.App && App.feedback && App.feedback.encourage) {
        App.feedback.encourage(document.getElementById('feedbackSimon'));
      }

      if (simon.nivel > 1) {
        premiar('simon');
      }
    }
  }

  $('#simonBoard').addEventListener('click', function (e) {
    var key = e.target.closest('.simon-key');
    if (key) {
      clickSimon(key.dataset.note);
    }
  });

  $('#btnSalirSimon').addEventListener('click', irMenu);

  /* ---------- Follow the melody ---------- */
  var seguir = { melodia: null, idx: 0, esperando: true };

  function irSeguir() {
    mostrarPantalla('pantallaSeguir');
    var lista = DATA.melodiasSeguir;
    seguir.melodia = lista[Math.floor(Math.random() * lista.length)];
    seguir.idx = 0;
    seguir.esperando = true;
    var nombreMelodia = App.i18n.t(MELODIA_KEYS[seguir.melodia.id]);
    $('#instruccionSeguir').textContent.textContent = '';
    mostrarFeedback('feedbackSeguir', '', '');
    renderProgresoSeguir();
  }

  function renderProgresoSeguir() {
    var el = $('#progresoJuego');
    el.innerHTML = '';
    seguir.melodia.secuencia.forEach(function (_, i) {
      var dot = document.createElement('div');
      dot.className = 'progreso-dot' + (i < seguir.idx ? ' hecho' : (i === seguir.idx && seguir.esperando ? ' actual' : ''));
      el.appendChild(dot);
    });
  }

  $('#btnReproducir').addEventListener('click', function () {
    var seq = seguir.melodia.secuencia.map(function (n) { return { nota: n, duracion: 0.4 }; });
    reproducirMelodia(seq, function () {
      mostrarFeedback('feedbackSeguir', App.i18n.t('ahoraRepitela'), '');
      seguir.esperando = true;
    });
  });

  $('#btnSalirSeguir').addEventListener('click', irMenu);

  /* ---------- Canciones ---------- */
  function irCanciones() {
    mostrarPantalla('pantallaCanciones');
    var cont = $('#listaCanciones');
    cont.innerHTML = '';
    DATA.canciones.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-cancion';
      var icono = document.createElement('span');
      icono.className = 'icono';
      icono.setAttribute('aria-hidden', 'true');
      icono.textContent = state.completado[c.id] ? '✅' : '🎹';
      var titulo = document.createElement('span');
      titulo.className = 'titulo';
      titulo.textContent = App.i18n.t(CANCION_KEYS[c.id]);
      var dificultad = document.createElement('span');
      dificultad.className = 'dificultad';
      dificultad.textContent = App.i18n.t(DIFICULTAD_KEYS[c.dificultad]);
      btn.appendChild(icono);
      btn.appendChild(titulo);
      btn.appendChild(dificultad);
      btn.addEventListener('click', function () { jugarCancion(c); });
      cont.appendChild(btn);
    });
  }

  function jugarCancion(cancion) {
    mostrarPantalla('pantallaLibre');
    $('#btnSalirLibre').onclick = irCanciones;
    var nombreCancion = App.i18n.t(CANCION_KEYS[cancion.id]);
    $('#instruccionLibre').textContent.textContent = '';

    // Play the song
    var seq = cancion.secuencia.map(function (n) { return { nota: n, duracion: 0.35 }; });
    mostrarFeedback('feedbackLibre', App.i18n.t('escuchando'), '');
    reproducirMelodia(seq, function () {
      mostrarFeedback('feedbackLibre', App.i18n.t('ahoraTuRepite'), 'acierto');
      premiar(cancion.id);
    });
  }

  $('#btnSalirCanciones').addEventListener('click', irMenu);

  /* ---------- Compositor ---------- */
  var compositor = { secuencia: [] };

  function irCompositor() {
    mostrarPantalla('pantallaCompositor');
    compositor.secuencia = [];
    $('#nombrarCancion').classList.add('oculto');
    renderCompositor();
    renderCancionesGuardadas();
  }

  function renderCompositor() {
    var el = $('#secuenciaCompositor');
    el.innerHTML = '';
    if (compositor.secuencia.length === 0) {
      var p = document.createElement('p');
      p.className = 'placeholder';
      p.textContent = App.i18n.t('placeholderVacio');
      el.appendChild(p);
    } else {
      compositor.secuencia.forEach(function (item) {
        var div = document.createElement('div');
        div.className = 'nota-sec';
        var nombre = document.createElement('span');
        nombre.className = 'nombre';
        nombre.textContent = item.nota;
        var tecla = document.createElement('span');
        tecla.className = 'tecla';
        tecla.textContent = item.tecla;
        div.appendChild(nombre);
        div.appendChild(tecla);
        el.appendChild(div);
      });
    }
  }

  function renderCancionesGuardadas() {
    var el = $('#cancionesGuardadas');
    el.innerHTML = '';
    if (state.canciones.length === 0) return;

    var h3 = document.createElement('h3');
    h3.textContent = App.i18n.t('tusCanciones');
    el.appendChild(h3);

    state.canciones.forEach(function (c, i) {
      var div = document.createElement('div');
      div.className = 'cancion-guardada';

      var nombre = document.createElement('span');
      nombre.className = 'nombre';
      nombre.textContent = c.nombre + ' ' + App.i18n.t('notasCount').replace('{n}', c.notas.length);

      var acciones = document.createElement('div');
      acciones.className = 'acciones';
      var btnPlay = document.createElement('button');
      btnPlay.type = 'button';
      btnPlay.textContent = '▶️';
      btnPlay.dataset.accion = 'reproducir';
      btnPlay.dataset.idx = String(i);
      btnPlay.setAttribute('aria-label', App.i18n.t('reproducirCompBtn'));
      var btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.textContent = '🗑️';
      btnDel.dataset.accion = 'borrar';
      btnDel.dataset.idx = String(i);
      btnDel.setAttribute('aria-label', App.i18n.t('borrarCompBtn'));

      acciones.appendChild(btnPlay);
      acciones.appendChild(btnDel);
      div.appendChild(nombre);
      div.appendChild(acciones);
      el.appendChild(div);
    });
  }

  $('#cancionesGuardadas').addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-accion]');
    if (!btn) return;
    var idx = Number(btn.dataset.idx);
    var c = state.canciones[idx];
    if (!c) return;
    if (btn.dataset.accion === 'reproducir') {
      var seq = c.notas.map(function (n) { return { nota: n, duracion: 0.35 }; });
      reproducirMelodia(seq);
    } else if (btn.dataset.accion === 'borrar') {
      state.canciones.splice(idx, 1);
      guardar();
      renderCancionesGuardadas();
      mostrarFeedback('feedbackComp', App.i18n.t('cancionBorrada'), '');
    }
  });

  $('#btnReproducirComp').addEventListener('click', function () {
    if (compositor.secuencia.length === 0) {
      mostrarFeedback('feedbackComp', App.i18n.t('tocaNotasPrimero'), 'animo');
      return;
    }
    var seq = compositor.secuencia.map(function (n) { return { nota: n.nota, duracion: 0.35 }; });
    reproducirMelodia(seq, function () {
      mostrarFeedback('feedbackComp', App.i18n.t('bonitaMelodia'), 'acierto');
    });
  });

  $('#btnBorrarComp').addEventListener('click', function () {
    compositor.secuencia = [];
    renderCompositor();
    mostrarFeedback('feedbackComp', App.i18n.t('borrado'), '');
  });

  /* Save song: own on-screen input instead of native prompt()
     (no audio, no Easy Read, breaks the app's whole style). */
  $('#btnGuardarComp').addEventListener('click', function () {
    if (compositor.secuencia.length === 0) {
      mostrarFeedback('feedbackComp', App.i18n.t('tocaNotasPrimero'), 'animo');
      return;
    }
    var input = $('#inputNombreCancion');
    input.value = App.i18n.t('promptNombreDefault');
    $('#nombrarCancion').classList.remove('oculto');
    input.focus();
    input.select();
  });

  $('#btnConfirmarGuardar').addEventListener('click', function () {
    var nombre = $('#inputNombreCancion').value.trim().slice(0, 30) || App.i18n.t('promptNombreDefault');
    state.canciones.push({
      nombre: nombre,
      notas: compositor.secuencia.map(function (n) { return n.nota; })
    });
    guardar();
    compositor.secuencia = [];
    $('#nombrarCancion').classList.add('oculto');
    renderCompositor();
    renderCancionesGuardadas();
    mostrarFeedback('feedbackComp', App.i18n.t('cancionGuardada'), 'acierto');
    crearParticulas();
  });

  $('#btnCancelarGuardar').addEventListener('click', function () {
    $('#nombrarCancion').classList.add('oculto');
  });

  $('#inputNombreCancion').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); $('#btnConfirmarGuardar').click(); }
    else if (e.key === 'Escape') { $('#btnCancelarGuardar').click(); }
  });

  $('#btnSalirCompositor').addEventListener('click', irMenu);

  /* ---------- Physical keyboard ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.repeat) return;

    initAudio();
    var key = e.key.toLowerCase();

    // If we're in the composer, add a note
    if (!document.getElementById('pantallaCompositor').classList.contains('oculto')) {
      var nota = TECLAS_NOTAS[key];
      if (nota) {
        tocarNota(nota, 0.5);
        compositor.secuencia.push({ nota: nota, tecla: key.toUpperCase() });
        renderCompositor();
        return;
      }
    }

    // Simon - using the ASDF keys
    if (!document.getElementById('pantallaSimon').classList.contains('oculto')) {
      var mapaSimon = { 'a': 'C', 's': 'E', 'd': 'G', 'f': 'B' };
      if (mapaSimon[key]) {
        clickSimon(mapaSimon[key]);
        return;
      }
    }

    // Follow the melody
    if (!document.getElementById('pantallaSeguir').classList.contains('oculto') && !seguir.esperando) {
      var notaSeguir = TECLAS_NOTAS[key];
      if (notaSeguir) {
        if (notaSeguir === seguir.melodia.secuencia[seguir.idx]) {
          seguir.idx++;
          renderProgresoSeguir();
          if (seguir.idx >= seguir.melodia.secuencia.length) {
            seguir.esperando = true;
            mostrarFeedback('feedbackSeguir', App.i18n.t('perfecto'), 'acierto');
            premiar('seguir');
            crearParticulas();
          }
        } else {
          mostrarFeedback('feedbackSeguir', App.i18n.t('casiIntentalo'), 'animo');
          seguir.idx = 0;
          renderProgresoSeguir();
        }
        return;
      }
    }

    // Modo libre y otros
    notaTecla(key);
  });

  /* ---------- Click/toque en piano visual (botones reales) ---------- */
  document.addEventListener('click', function (e) {
    var key = e.target.closest('.piano-visual [data-key]');
    if (!key) return;
    initAudio();
    var nota = key.dataset.note;
    if (!nota) return;
    tocarNota(nota, 0.5);
    iluminarTecla(nota);

    if (state.grabando) {
      state.grabacion.push({ nota: nota, tecla: key.dataset.key });
    }

    // Compositor
    if (!document.getElementById('pantallaCompositor').classList.contains('oculto')) {
      compositor.secuencia.push({ nota: nota, tecla: key.dataset.key.toUpperCase() });
      renderCompositor();
    } else if (!document.getElementById('pantallaLibre').classList.contains('oculto')) {
      state.secuenciaActual = state.secuenciaActual || [];
      state.secuenciaActual.push({ nota: nota });
      actualizarSecuenciaLibre();
    }
  });

  /* ---------- Nombre ---------- */
  function guardarNombre() {
    var v = $('#inputNombre').value.trim().slice(0, 15);
    state.nombre = v;
    guardar();
    /* Audio only plays if the user taps the "Listen" button (btnLeerNombre) */
    irMenu();
  }

  $('#btnGuardarNombre').addEventListener('click', guardarNombre);
  $('#inputNombre').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') guardarNombre();
  });

  $('#btnLeerNombre').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t('escribeNombreTTS'));
  });

  /* ---------- Menu ---------- */
  $('#menuJuegos').addEventListener('click', function (e) {
    var t = e.target.closest('.tarjeta-modo');
    if (!t) return;
    var m = t.dataset.modo;

    initAudio(); // Activar audio al primer click

    if (m === 'libre') irLibre();
    else if (m === 'seguir') irSeguir();
    else if (m === 'simon') irSimon();
    else if (m === 'canciones') irCanciones();
    else if (m === 'compositor') irCompositor();
  });

  $('#btnLeerSaludo').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak($('#saludo').textContent + App.i18n.t('elegirModoTTS'));
  });

  $('#btnCambiarNombre').addEventListener('click', irNombre);

  /* ---------- Arranque ---------- */
  if (state.nombre) irMenu();
  else irNombre();
  actualizarEstrellas();

})();
