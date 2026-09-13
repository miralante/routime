(function () {
  'use strict';

  var state = {
    nivelActual: 0,
    rondasCompletas: 0,
    estrellasAcumuladas: 0,
    intentos: 0,
    situacionActual: null,
    respuestaSeleccionada: null,
    mostrandoFeedback: false
  };

  function init() {
    cargarProgreso();
    mostrarSelectorNiveles();
  }

  function cargarProgreso() {
    var datos = App.storage.get('good-manners');
    if (datos) {
      state.estrellasAcumuladas = datos.estrellas || 0;
      state.rondasCompletas = datos.completados || {};
    }
  }

  function mostrarSelectorNiveles() {
    var app = App.utils.$('#app');
    app.innerHTML = '';

    var titulo = document.createElement('h2');
    titulo.textContent = App.i18n.t('title');
    app.appendChild(titulo);

    var instruccion = document.createElement('p');
    instruccion.className = 'instruccion';
    instruccion.textContent = App.i18n.t('instruction');
    instruccion.setAttribute('data-i18n', 'instruction');
    app.appendChild(instruccion);

    var containerNiveles = document.createElement('div');
    containerNiveles.className = 'pila centrado';

    DATA.niveles.forEach(function (nivel, idx) {
      var boton = document.createElement('button');
      boton.className = 'btn btn-nivel';
      boton.setAttribute('data-i18n', nivel.nombre);
      boton.textContent = App.i18n.t(nivel.nombre);
      boton.onclick = function () {
        state.nivelActual = idx;
        empezarRonda();
      };
      containerNiveles.appendChild(boton);
    });

    app.appendChild(containerNiveles);

    // Show accumulated stars
    if (state.estrellasAcumuladas > 0) {
      var estrellas = document.createElement('div');
      estrellas.className = 'estrellas centrado';
      estrellas.innerHTML = '⭐ ' + state.estrellasAcumuladas;
      app.appendChild(estrellas);
    }

    App.i18n.apply(app);
  }

  function empezarRonda() {
    state.intentos = 0;
    state.respuestaSeleccionada = null;
    state.mostrandoFeedback = false;

    // Get scenarios for this level
    var nivel = DATA.niveles[state.nivelActual];
    var situacionesDelNivel = DATA.situaciones.filter(function (s) {
      return s.nivel === (state.nivelActual + 1);
    });

    // Shuffle and pick one
    situacionesDelNivel = App.utils.shuffle(situacionesDelNivel);
    state.situacionActual = situacionesDelNivel[0];

    mostrarSituacion();
  }

  function mostrarSituacion() {
    var app = App.utils.$('#app');
    app.innerHTML = '';

    var backLink = document.createElement('a');
    backLink.href = '../../site/index.html';
    backLink.className = 'back-link';
    backLink.setAttribute('data-i18n', 'core.back');
    backLink.textContent = '← ' + App.i18n.t('core.back');
    app.appendChild(backLink);

    var titulo = document.createElement('h2');
    titulo.className = 'tool-header';
    titulo.setAttribute('data-i18n', 'title');
    titulo.textContent = App.i18n.t('title');
    app.appendChild(titulo);

    // Progress
    var progreso = document.createElement('div');
    progreso.className = 'progress-bar';
    var fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = (state.rondasCompletas * 20) + '%';
    progreso.appendChild(fill);
    app.appendChild(progreso);

    // Context and situation
    var contexto = document.createElement('div');
    contexto.className = 'escenario';
    
    var titulo_contexto = document.createElement('h3');
    titulo_contexto.className = 'contexto-titulo';
    titulo_contexto.setAttribute('data-i18n', 'situacion.' + state.situacionActual.contexto.split('.')[1]);
    titulo_contexto.textContent = App.i18n.t(state.situacionActual.contexto);
    contexto.appendChild(titulo_contexto);

    var mensaje = document.createElement('div');
    mensaje.className = 'mensaje-dialogos';
    var mensajeTexto = document.createElement('p');
    mensajeTexto.setAttribute('data-i18n', state.situacionActual.mensaje);
    mensajeTexto.textContent = App.i18n.t(state.situacionActual.mensaje);
    mensaje.appendChild(mensajeTexto);

    var botonAudio = document.createElement('button');
    botonAudio.className = 'btn-audio';
    botonAudio.setAttribute('aria-label', App.i18n.t('core.listen'));
    botonAudio.textContent = '🔊 ' + App.i18n.t('core.listen');
    botonAudio.onclick = function () {
      if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t(state.situacionActual.mensaje));
    };
    mensaje.appendChild(botonAudio);

    contexto.appendChild(mensaje);
    app.appendChild(contexto);

    // Question
    var pregunta = document.createElement('div');
    pregunta.className = 'pregunta';
    var p = document.createElement('p');
    p.textContent = '¿Qué dices?';
    p.setAttribute('data-i18n', 'instruction');
    pregunta.appendChild(p);
    app.appendChild(pregunta);

    // Options
    var opciones = document.createElement('div');
    opciones.className = 'pila opciones-contenedor';

    var opcionesTexto = state.situacionActual.opciones;
    opcionesTexto.forEach(function (opcionKey) {
      var boton = document.createElement('button');
      boton.className = 'btn btn-opcion';
      boton.setAttribute('data-i18n', opcionKey);
      boton.textContent = App.i18n.t(opcionKey);
      boton.onclick = function () {
        seleccionarOpcion(opcionKey, boton);
      };
      opciones.appendChild(boton);
    });

    app.appendChild(opciones);

    // Feedback zone
    var feedback = document.createElement('div');
    feedback.id = 'feedback';
    feedback.className = 'feedback';
    feedback.setAttribute('aria-live', 'polite');
    feedback.setAttribute('aria-atomic', 'true');
    app.appendChild(feedback);

    App.i18n.apply(app);
  }

  function seleccionarOpcion(opcionKey, boton) {
    if (state.mostrandoFeedback) return;

    state.intentos++;
    state.respuestaSeleccionada = opcionKey;
    state.mostrandoFeedback = true;

    var feedbackZone = App.utils.$('#feedback');
    var opcionesBtns = App.utils.$$('.opcion-btn', App.utils.$('#app'));
    var esCorrecta = opcionKey === state.situacionActual.correcta;

    if (esCorrecta) {
      // Correct answer
      boton.classList.add('correcta');
      App.feedback.success(feedbackZone);
      opcionesBtns.forEach(function (b) { b.disabled = true; });

      setTimeout(function () {
        state.rondasCompletas++;
        guardarProgreso();

        var nivel = DATA.niveles[state.nivelActual];
        if (state.rondasCompletas >= nivel.maxSituaciones) {
          mostrarComplecion();
        } else {
          state.mostrandoFeedback = false;
          empezarRonda();
        }
      }, 2000);
    } else if (state.intentos === 1) {
      // First attempt: show hint (Socratic rule 12)
      boton.classList.add('error');
      boton.disabled = true;
      App.feedback.encourage(feedbackZone);
      feedbackZone.textContent = App.i18n.t('pista');
      App.feedback.lockUntilAck(opcionesBtns, feedbackZone, function () {
        state.mostrandoFeedback = false;
      });
    } else {
      // Second attempt: show explanation and correct answer
      boton.classList.add('error');
      App.feedback.encourage(feedbackZone);
      var explicacion = 'La respuesta correcta es: ' + App.i18n.t(state.situacionActual.correcta);
      feedbackZone.textContent = explicacion;
      opcionesBtns.forEach(function (b) { b.disabled = true; });
      App.feedback.lockUntilAck(opcionesBtns, feedbackZone, function () {
        state.rondasCompletas++;
        guardarProgreso();

        var nivel = DATA.niveles[state.nivelActual];
        if (state.rondasCompletas >= nivel.maxSituaciones) {
          mostrarComplecion();
        } else {
          state.intentos = 0;
          state.respuestaSeleccionada = null;
          state.mostrandoFeedback = false;
          empezarRonda();
        }
      });
    }
  }

  function mostrarComplecion() {
    var app = App.utils.$('#app');
    app.innerHTML = '';

    var titulo = document.createElement('h1');
    titulo.className = 'titulo-celebracion';
    titulo.textContent = '¡Ronda terminada!';
    app.appendChild(titulo);

    var estrellas = document.createElement('div');
    estrellas.className = 'estrellas-celebracion';
    var nivel = DATA.niveles[state.nivelActual];
    var estrellasGanadas = 1 + state.nivelActual; // Level 1 = 1 star, Level 2 = 2 stars, Level 3 = 3 stars
    state.estrellasAcumuladas += estrellasGanadas;

    for (var i = 0; i < estrellasGanadas; i++) {
      estrellas.innerHTML += '⭐ ';
    }
    app.appendChild(estrellas);

    var texto = document.createElement('p');
    texto.textContent = 'Total: ' + state.estrellasAcumuladas + ' estrellas';
    app.appendChild(texto);

    var botones = document.createElement('div');
    botones.className = 'pila centrado';

    var botonRepetir = document.createElement('button');
    botonRepetir.className = 'btn';
    botonRepetir.textContent = 'Jugar otra vez';
    botonRepetir.onclick = function () {
      state.rondasCompletas = 0;
      mostrarSelectorNiveles();
    };
    botones.appendChild(botonRepetir);

    var botonMenu = document.createElement('button');
    botonMenu.className = 'btn btn-secundario';
    botonMenu.textContent = 'Volver al menú';
    botonMenu.onclick = function () {
      window.location.href = '../../site/index.html';
    };
    botones.appendChild(botonMenu);

    app.appendChild(botones);

    guardarProgreso();
    App.feedback.celebrar('¡Excelente!');
  }

  function guardarProgreso() {
    var datos = {
      estrellas: state.estrellasAcumuladas,
      completados: state.rondasCompletas
    };
    App.storage.set('good-manners', datos);
  }

  // Start when DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
