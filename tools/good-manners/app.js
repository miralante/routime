(function () {
  'use strict';

  var state = {
    currentLevel: 0,
    completedRounds: 0,
    accumulatedStars: 0,
    attempts: 0,
    currentSituation: null,
    selectedAnswer: null,
    showingFeedback: false
  };

  function init() {
    loadProgress();
    showLevelSelector();
  }

  function loadProgress() {
    var datos = App.storage.get('good-manners');
    if (datos) {
      state.accumulatedStars = datos.stars || 0;
      state.completedRounds = datos.completed || {};
    }
  }

  function showLevelSelector() {
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

    var levelsContainer = document.createElement('div');
    levelsContainer.className = 'pila centered';

    DATA.niveles.forEach(function (nivel, idx) {
      var boton = document.createElement('button');
      boton.className = 'btn btn-nivel';
      boton.setAttribute('data-i18n', nivel.name);
      boton.textContent = App.i18n.t(nivel.name);
      boton.onclick = function () {
        state.currentLevel = idx;
        startRound();
      };
      levelsContainer.appendChild(boton);
    });

    app.appendChild(levelsContainer);

    // Show accumulated stars
    if (state.accumulatedStars > 0) {
      var estrellas = document.createElement('div');
      estrellas.className = 'estrellas centered';
      estrellas.innerHTML = '⭐ ' + state.accumulatedStars;
      app.appendChild(estrellas);
    }

    App.i18n.apply(app);
  }

  function startRound() {
    state.attempts = 0;
    state.selectedAnswer = null;
    state.showingFeedback = false;

    // Get scenarios for this level
    var nivel = DATA.niveles[state.currentLevel];
    var situacionesDelNivel = DATA.situaciones.filter(function (s) {
      return s.nivel === (state.currentLevel + 1);
    });

    // Shuffle and pick one
    situacionesDelNivel = App.utils.shuffle(situacionesDelNivel);
    state.currentSituation = situacionesDelNivel[0];

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
    var progress = document.createElement('div');
    progress.className = 'progress-bar';
    var fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = (state.completedRounds * 20) + '%';
    progress.appendChild(fill);
    app.appendChild(progress);

    // Context and situation
    var contexto = document.createElement('div');
    contexto.className = 'escenario';
    
    var titulo_contexto = document.createElement('h3');
    titulo_contexto.className = 'contexto-titulo';
    titulo_contexto.setAttribute('data-i18n', 'situacion.' + state.currentSituation.contexto.split('.')[1]);
    titulo_contexto.textContent = App.i18n.t(state.currentSituation.contexto);
    contexto.appendChild(titulo_contexto);

    var mensaje = document.createElement('div');
    mensaje.className = 'mensaje-dialogos';
    var mensajeTexto = document.createElement('p');
    mensajeTexto.setAttribute('data-i18n', state.currentSituation.mensaje);
    mensajeTexto.textContent = App.i18n.t(state.currentSituation.mensaje);
    mensaje.appendChild(mensajeTexto);

    var botonAudio = document.createElement('button');
    botonAudio.className = 'btn-audio';
    botonAudio.setAttribute('aria-label', App.i18n.t('core.listen'));
    botonAudio.textContent = '🔊 ' + App.i18n.t('core.listen');
    botonAudio.onclick = function () {
      if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t(state.currentSituation.mensaje));
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
    var options = document.createElement('div');
    options.className = 'pila options-contenedor';

    var opcionesTexto = state.currentSituation.options;
    opcionesTexto.forEach(function (opcionKey) {
      var boton = document.createElement('button');
      boton.className = 'btn btn-opcion';
      boton.setAttribute('data-i18n', opcionKey);
      boton.textContent = App.i18n.t(opcionKey);
      boton.onclick = function () {
        selectOption(opcionKey, boton);
      };
      options.appendChild(boton);
    });

    app.appendChild(options);

    // Feedback zone
    var feedback = document.createElement('div');
    feedback.id = 'feedback';
    feedback.className = 'feedback';
    feedback.setAttribute('aria-live', 'polite');
    feedback.setAttribute('aria-atomic', 'true');
    app.appendChild(feedback);

    App.i18n.apply(app);
  }

  function selectOption(opcionKey, boton) {
    if (state.showingFeedback) return;

    state.attempts++;
    state.selectedAnswer = opcionKey;
    state.showingFeedback = true;

    var feedbackZone = App.utils.$('#feedback');
    var opcionesBtns = App.utils.$$('.opcion-btn', App.utils.$('#app'));
    var isCorrect = opcionKey === state.currentSituation.correcta;

    if (isCorrect) {
      // Correct answer
      boton.classList.add('correcta');
      App.feedback.success(feedbackZone);
      opcionesBtns.forEach(function (b) { b.disabled = true; });

      setTimeout(function () {
        state.completedRounds++;
        saveProgress();

        var nivel = DATA.niveles[state.currentLevel];
        if (state.completedRounds >= nivel.maxSituaciones) {
          mostrarComplecion();
        } else {
          state.showingFeedback = false;
          startRound();
        }
      }, 2000);
    } else if (state.attempts === 1) {
      // First attempt: show hint (Socratic rule 12)
      boton.classList.add('error');
      boton.disabled = true;
      App.feedback.encourage(feedbackZone);
      feedbackZone.textContent = App.i18n.t('pista');
      App.feedback.lockUntilAck(opcionesBtns, feedbackZone, function () {
        state.showingFeedback = false;
      });
    } else {
      // Second attempt: show explanation and correct answer
      boton.classList.add('error');
      App.feedback.encourage(feedbackZone);
      var explicacion = 'La respuesta correcta es: ' + App.i18n.t(state.currentSituation.correcta);
      feedbackZone.textContent = explicacion;
      opcionesBtns.forEach(function (b) { b.disabled = true; });
      App.feedback.lockUntilAck(opcionesBtns, feedbackZone, function () {
        state.completedRounds++;
        saveProgress();

        var nivel = DATA.niveles[state.currentLevel];
        if (state.completedRounds >= nivel.maxSituaciones) {
          mostrarComplecion();
        } else {
          state.attempts = 0;
          state.selectedAnswer = null;
          state.showingFeedback = false;
          startRound();
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
    var nivel = DATA.niveles[state.currentLevel];
    var estrellasGanadas = 1 + state.currentLevel; // Level 1 = 1 star, Level 2 = 2 stars, Level 3 = 3 stars
    state.accumulatedStars += estrellasGanadas;

    for (var i = 0; i < estrellasGanadas; i++) {
      estrellas.innerHTML += '⭐ ';
    }
    app.appendChild(estrellas);

    var text = document.createElement('p');
    text.textContent = 'Total: ' + state.accumulatedStars + ' estrellas';
    app.appendChild(text);

    var botones = document.createElement('div');
    botones.className = 'pila centered';

    var botonRepetir = document.createElement('button');
    botonRepetir.className = 'btn';
    botonRepetir.textContent = 'Jugar otra vez';
    botonRepetir.onclick = function () {
      state.completedRounds = 0;
      showLevelSelector();
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

    saveProgress();
    App.feedback.celebrar('¡Excelente!');
  }

  function saveProgress() {
    var datos = {
      estrellas: state.accumulatedStars,
      completados: state.completedRounds
    };
    App.storage.set('good-manners', datos);
  }

  // Start when DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
