/* ============================================================
   Routime — Normas de Educación (good manners and civic education)
   Data in data.js (DATA.niveles + DATA.situaciones).
   Shared core in assets/js/.
   Mechanic: read / hear a daily-life or social situation, choose the
   good-manners response that fits (3 options). Error never punishes:
   first mistake -> hint (Socratic), second -> explanation.
   Closes with a transferencia line that anchors practice to daily life.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'education-norms';

  var state = {
    nivelActual: 0,
    rondasCompletas: 0,
    estrellasAcumuladas: 0,
    intentos: 0,
    situacionActual: null,
    mostrandoFeedback: false
  };

  function init() {
    cargarProgreso();
    mostrarSelectorNiveles();
  }

  function cargarProgreso() {
    var datos = App.storage.get(TOOL_ID);
    if (datos) {
      state.estrellasAcumuladas = datos.estrellas || 0;
      state.rondasCompletas = datos.completados || {};
    }
  }

  function guardarProgreso() {
    var datos = {
      estrellas: state.estrellasAcumuladas,
      completados: state.rondasCompletas
    };
    App.storage.set(TOOL_ID, datos);
  }

  function mostrarSelectorNiveles() {
    var app = App.utils.$('#app');
    app.innerHTML = '';

    var titulo = document.createElement('h2');
    titulo.setAttribute('data-i18n', 'title');
    titulo.textContent = App.i18n.t('title');
    app.appendChild(titulo);

    var contexto = document.createElement('p');
    contexto.className = 'instruccion';
    contexto.setAttribute('data-i18n', 'contexto');
    contexto.textContent = App.i18n.t('contexto');
    app.appendChild(contexto);

    var containerNiveles = document.createElement('div');
    containerNiveles.className = 'pila centrado';

    DATA.niveles.forEach(function (nivel, idx) {
      var boton = document.createElement('button');
      boton.className = 'btn btn-nivel';
      boton.setAttribute('data-i18n', nivel.nombre);
      boton.textContent = App.i18n.t(nivel.nombre);
      boton.onclick = function () {
        state.nivelActual = idx;
        state.rondasCompletas = 0;
        empezarRonda();
      };
      containerNiveles.appendChild(boton);
    });

    app.appendChild(containerNiveles);

    if (state.estrellasAcumuladas > 0) {
      var estrellas = document.createElement('div');
      estrellas.className = 'estrellas centrado';
      estrellas.setAttribute('aria-label', state.estrellasAcumuladas + ' estrellas');
      estrellas.textContent = '\u2B50 ' + state.estrellasAcumuladas;
      app.appendChild(estrellas);
    }

    App.i18n.apply(app);
  }

  function empezarRonda() {
    state.intentos = 0;
    state.mostrandoFeedback = false;

    var nivel = DATA.niveles[state.nivelActual];
    var situacionesDelNivel = DATA.situaciones.filter(function (s) {
      return s.nivel === (state.nivelActual + 1);
    });

    if (situacionesDelNivel.length === 0) {
      // Defensive: no cases for this level, skip to completion
      mostrarComplecion();
      return;
    }

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
    backLink.textContent = '\u2190 ' + App.i18n.t('core.back');
    app.appendChild(backLink);

    var titulo = document.createElement('h2');
    titulo.className = 'tool-header';
    titulo.setAttribute('data-i18n', 'title');
    titulo.textContent = App.i18n.t('title');
    app.appendChild(titulo);

    // Progress bar (rule 13: gradual progression)
    var nivel = DATA.niveles[state.nivelActual];
    var total = nivel.maxSituaciones;
    var progreso = document.createElement('div');
    progreso.className = 'progress-bar';
    var fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = (state.rondasCompletas / total * 100) + '%';
    progreso.appendChild(fill);
    app.appendChild(progreso);

    // Scenario card (contexto -> decision, SPEC §3.6)
    var escenario = document.createElement('div');
    escenario.className = 'escenario';

    var tituloContexto = document.createElement('h3');
    tituloContexto.className = 'contexto-titulo';
    tituloContexto.setAttribute('data-i18n', state.situacionActual.contexto);
    tituloContexto.textContent = App.i18n.t(state.situacionActual.contexto);
    escenario.appendChild(tituloContexto);

    var mensaje = document.createElement('div');
    mensaje.className = 'mensaje-dialogos';

    var personajeLabel = App.i18n.t('personaje.' + state.situacionActual.personaje) || state.situacionActual.personaje;
    var pPersonaje = document.createElement('p');
    pPersonaje.className = 'personaje';
    pPersonaje.textContent = personajeLabel + ':';
    mensaje.appendChild(pPersonaje);

    var pMensaje = document.createElement('p');
    pMensaje.setAttribute('data-i18n', state.situacionActual.mensaje);
    pMensaje.textContent = App.i18n.t(state.situacionActual.mensaje);
    mensaje.appendChild(pMensaje);

    // Audio button (rule 4: only where the design requires it; here the
    // user must hear what the other person is saying to choose well)
    var botonAudio = document.createElement('button');
    botonAudio.className = 'btn-audio';
    botonAudio.setAttribute('aria-label', App.i18n.t('core.listen'));
    botonAudio.textContent = '\uD83D\uDD0A ' + App.i18n.t('core.listen');
    botonAudio.onclick = function () {
      if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t(state.situacionActual.mensaje));
    };
    mensaje.appendChild(botonAudio);

    escenario.appendChild(mensaje);
    app.appendChild(escenario);

    // Decision prompt
    var pregunta = document.createElement('p');
    pregunta.className = 'pregunta';
    pregunta.setAttribute('data-i18n', 'instruction');
    pregunta.textContent = App.i18n.t('instruction');
    app.appendChild(pregunta);

    // Options (rule 10: max 4-6 options; rule 11: 3 for quiz)
    var opciones = document.createElement('div');
    opciones.className = 'pila opciones-contenedor';

    state.situacionActual.opciones.forEach(function (opcionKey) {
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

    // Feedback zone (ARIA live for screen readers)
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
    state.mostrandoFeedback = true;

    var feedbackZone = App.utils.$('#feedback');
    var opcionesBtns = App.utils.$$('.btn-opcion', App.utils.$('#app'));
    var esCorrecta = opcionKey === state.situacionActual.correcta;

    if (esCorrecta) {
      // Correct answer -> celebrate, no punishment
      boton.classList.add('correcta');
      App.feedback.acierto(feedbackZone);
      feedbackZone.textContent = App.i18n.t('feedback.correcto');
      opcionesBtns.forEach(function (b) { b.disabled = true; });

      setTimeout(function () {
        state.rondasCompletas++;
        guardarProgreso();

        var nivel = DATA.niveles[state.nivelActual];
        if (state.rondasCompletas >= nivel.maxSituaciones) {
          mostrarComplecion();
        } else {
          state.intentos = 0;
          state.mostrandoFeedback = false;
          empezarRonda();
        }
      }, 2000);
      return;
    }

    if (state.intentos === 1) {
      // First mistake: Socratic hint (rule 12)
      boton.classList.add('error');
      boton.disabled = true;
      App.feedback.animo(feedbackZone);
      var pista = state.situacionActual.pista
        ? App.i18n.t(state.situacionActual.pista)
        : App.i18n.t('pista');
      feedbackZone.textContent = pista;
      App.feedback.lockUntilAck(opcionesBtns, feedbackZone, function () {
        state.mostrandoFeedback = false;
      });
    } else {
      // Second mistake: show explanation and the correct answer
      boton.classList.add('error');
      App.feedback.animo(feedbackZone);
      var explicacion = App.i18n.t('feedback.explicacion') + ' ' +
        App.i18n.t(state.situacionActual.correcta) + '.';
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
    titulo.setAttribute('data-i18n', 'fin_ronda');
    titulo.textContent = App.i18n.t('fin_ronda');
    app.appendChild(titulo);

    // Progressive stars: 1 / 2 / 3 by level (rule 5.3, never subtracted)
    var nivel = DATA.niveles[state.nivelActual];
    var estrellasGanadas = 1 + state.nivelActual;
    state.estrellasAcumuladas += estrellasGanadas;

    var estrellas = document.createElement('div');
    estrellas.className = 'estrellas-celebracion';
    estrellas.setAttribute('aria-label', estrellasGanadas + ' estrellas');
    var estrellasTxt = '';
    for (var i = 0; i < estrellasGanadas; i++) estrellasTxt += '\u2B50 ';
    estrellas.textContent = estrellasTxt;
    app.appendChild(estrellas);

    var totalEstrellas = document.createElement('p');
    totalEstrellas.className = 'total-estrellas';
    totalEstrellas.textContent = '\u2B50 ' + state.estrellasAcumuladas;
    app.appendChild(totalEstrellas);

    // Transfer line (SPEC §3.6, mandatory in simulation rounds)
    var transferencia = document.createElement('p');
    transferencia.className = 'transferencia';
    transferencia.setAttribute('data-i18n', 'transferencia');
    transferencia.textContent = App.i18n.t('transferencia');
    app.appendChild(transferencia);

    var botones = document.createElement('div');
    botones.className = 'pila centrado';

    var botonRepetir = document.createElement('button');
    botonRepetir.className = 'btn';
    botonRepetir.setAttribute('data-i18n', 'core.playAgain');
    botonRepetir.textContent = App.i18n.t('core.playAgain');
    botonRepetir.onclick = function () {
      state.rondasCompletas = 0;
      mostrarSelectorNiveles();
    };
    botones.appendChild(botonRepetir);

    var botonMenu = document.createElement('button');
    botonMenu.className = 'btn btn-secundario';
    botonMenu.setAttribute('data-i18n', 'core.backToMenu');
    botonMenu.textContent = App.i18n.t('core.backToMenu');
    botonMenu.onclick = function () {
      window.location.href = '../../site/index.html';
    };
    botones.appendChild(botonMenu);

    app.appendChild(botones);

    guardarProgreso();
    App.feedback.celebrar(App.i18n.t('feedback.correcto'));
    App.i18n.apply(app);
  }

  document.addEventListener('DOMContentLoaded', init);
})();