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
    var saved = App.storage.get('good-manners');
    if (saved) {
      state.accumulatedStars = saved.stars || 0;
      state.completedRounds = saved.completed || {};
    }
  }

  function showLevelSelector() {
    var app = App.utils.$('#app');
    app.innerHTML = '';

    var heading = document.createElement('h2');
    heading.textContent = App.i18n.t('title');
    app.appendChild(heading);

    var instruction = document.createElement('p');
    instruction.className = 'instruction';
    instruction.textContent = App.i18n.t('instruction');
    instruction.setAttribute('data-i18n', 'instruction');
    app.appendChild(instruction);

    var levelsContainer = document.createElement('div');
    levelsContainer.className = 'pila centered';

    DATA.niveles.forEach(function (lvl, idx) {
      var btnEl = document.createElement('button');
      btnEl.className = 'btn btn-nivel';
      btnEl.setAttribute('data-i18n', lvl.name);
      btnEl.textContent = App.i18n.t(lvl.name);
      btnEl.onclick = function () {
        state.currentLevel = idx;
        startRound();
      };
      levelsContainer.appendChild(btnEl);
    });

    app.appendChild(levelsContainer);

    // Show accumulated stars
    if (state.accumulatedStars > 0) {
      var starsEl = document.createElement('div');
      starsEl.className = 'estrellas centered';
      starsEl.innerHTML = '⭐ ' + state.accumulatedStars;
      app.appendChild(starsEl);
    }

    App.i18n.apply(app);
  }

  function startRound() {
    state.attempts = 0;
    state.selectedAnswer = null;
    state.showingFeedback = false;

    // Get scenarios for this level
    var lvl = DATA.niveles[state.currentLevel];
    var levelSituations = DATA.situaciones.filter(function (s) {
      return s.nivel === (state.currentLevel + 1);
    });

    // Shuffle and pick one
    levelSituations = App.utils.shuffle(levelSituations);
    state.currentSituation = levelSituations[0];

    showSituation();
  }

  function showSituation() {
    var app = App.utils.$('#app');
    app.innerHTML = '';

    var backLink = document.createElement('a');
    backLink.href = '../../site/index.html';
    backLink.className = 'back-link';
    backLink.setAttribute('data-i18n', 'core.back');
    backLink.textContent = '← ' + App.i18n.t('core.back');
    app.appendChild(backLink);

    var heading = document.createElement('h2');
    heading.className = 'tool-header';
    heading.setAttribute('data-i18n', 'title');
    heading.textContent = App.i18n.t('title');
    app.appendChild(heading);

    // Progress
    var progress = document.createElement('div');
    progress.className = 'progress-bar';
    var fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = (state.completedRounds * 20) + '%';
    progress.appendChild(fill);
    app.appendChild(progress);

    // Context and situation
    var ctx = document.createElement('div');
    ctx.className = 'escenario';

    var headingContext = document.createElement('h3');
    headingContext.className = 'contexto-titulo';
    headingContext.setAttribute('data-i18n', 'situacion.' + state.currentSituation.contexto.split('.')[1]);
    headingContext.textContent = App.i18n.t(state.currentSituation.contexto);
    ctx.appendChild(headingContext);

    var message = document.createElement('div');
    message.className = 'mensaje-dialogos';
    var messageText = document.createElement('p');
    messageText.setAttribute('data-i18n', state.currentSituation.mensaje);
    messageText.textContent = App.i18n.t(state.currentSituation.mensaje);
    message.appendChild(messageText);

    var audioBtn = document.createElement('button');
    audioBtn.className = 'btn-audio';
    audioBtn.setAttribute('aria-label', App.i18n.t('core.listen'));
    audioBtn.textContent = '🔊 ' + App.i18n.t('core.listen');
    audioBtn.onclick = function () {
      if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t(state.currentSituation.mensaje));
    };
    message.appendChild(audioBtn);

    ctx.appendChild(message);
    app.appendChild(ctx);

    // Question
    var questionEl = document.createElement('div');
    questionEl.className = 'pregunta';
    var p = document.createElement('p');
    p.textContent = '¿Qué dices?';
    p.setAttribute('data-i18n', 'instruction');
    questionEl.appendChild(p);
    app.appendChild(questionEl);

    // Options
    var options = document.createElement('div');
    options.className = 'pila options-contenedor';

    var optionsText = state.currentSituation.options;
    optionsText.forEach(function (optionKey) {
      var btnEl = document.createElement('button');
      btnEl.className = 'btn btn-opcion';
      btnEl.setAttribute('data-i18n', optionKey);
      btnEl.textContent = App.i18n.t(optionKey);
      btnEl.onclick = function () {
        selectOption(optionKey, btnEl);
      };
      options.appendChild(btnEl);
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

  function selectOption(optionKey, btnEl) {
    if (state.showingFeedback) return;

    state.attempts++;
    state.selectedAnswer = optionKey;
    state.showingFeedback = true;

    var feedbackZone = App.utils.$('#feedback');
    var optionBtns = App.utils.$$('.opcion-btn', App.utils.$('#app'));
    var isCorrect = optionKey === state.currentSituation.correcta;

    if (isCorrect) {
      // Correct answer
      btnEl.classList.add('correcta');
      App.feedback.success(feedbackZone);
      optionBtns.forEach(function (b) { b.disabled = true; });

      setTimeout(function () {
        state.completedRounds++;
        saveProgress();

        var lvl = DATA.niveles[state.currentLevel];
        if (state.completedRounds >= lvl.maxSituaciones) {
          showCompletion();
        } else {
          state.showingFeedback = false;
          startRound();
        }
      }, 2000);
    } else if (state.attempts === 1) {
      // First attempt: show hint (Socratic rule 12)
      btnEl.classList.add('error');
      btnEl.disabled = true;
      App.feedback.encourage(feedbackZone);
      feedbackZone.textContent = App.i18n.t('pista');
      App.feedback.lockUntilAck(optionBtns, feedbackZone, function () {
        state.showingFeedback = false;
      });
    } else {
      // Second attempt: show explanation and correct answer
      btnEl.classList.add('error');
      App.feedback.encourage(feedbackZone);
      var explanation = 'La respuesta correcta es: ' + App.i18n.t(state.currentSituation.correcta);
      feedbackZone.textContent = explanation;
      optionBtns.forEach(function (b) { b.disabled = true; });
      App.feedback.lockUntilAck(optionBtns, feedbackZone, function () {
        state.completedRounds++;
        saveProgress();

        var lvl = DATA.niveles[state.currentLevel];
        if (state.completedRounds >= lvl.maxSituaciones) {
          showCompletion();
        } else {
          state.attempts = 0;
          state.selectedAnswer = null;
          state.showingFeedback = false;
          startRound();
        }
      });
    }
  }

  function showCompletion() {
    var app = App.utils.$('#app');
    app.innerHTML = '';

    var heading = document.createElement('h1');
    heading.className = 'titulo-celebracion';
    heading.textContent = '¡Ronda terminada!';
    app.appendChild(heading);

    var starsEl = document.createElement('div');
    starsEl.className = 'estrellas-celebracion';
    var lvl = DATA.niveles[state.currentLevel];
    var starsEarned = 1 + state.currentLevel; // Level 1 = 1 star, Level 2 = 2 stars, Level 3 = 3 stars
    state.accumulatedStars += starsEarned;

    for (var i = 0; i < starsEarned; i++) {
      starsEl.innerHTML += '⭐ ';
    }
    app.appendChild(starsEl);

    var text = document.createElement('p');
    text.textContent = 'Total: ' + state.accumulatedStars + ' estrellas';
    app.appendChild(text);

    var btns = document.createElement('div');
    btns.className = 'pila centered';

    var btnRepeat = document.createElement('button');
    btnRepeat.className = 'btn';
    btnRepeat.textContent = 'Jugar otra vez';
    btnRepeat.onclick = function () {
      state.completedRounds = 0;
      showLevelSelector();
    };
    btns.appendChild(btnRepeat);

    var btnMenu = document.createElement('button');
    btnMenu.className = 'btn btn-secundario';
    btnMenu.textContent = 'Volver al menú';
    btnMenu.onclick = function () {
      window.location.href = '../../site/index.html';
    };
    btns.appendChild(btnMenu);

    app.appendChild(btns);

    saveProgress();
    App.feedback.celebrar('¡Excelente!');
  }

  function saveProgress() {
    var saved = {
      estrellas: state.accumulatedStars,
      completados: state.completedRounds
    };
    App.storage.set('good-manners', saved);
  }

  // Start when DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
