/* ============================================================
   Routime — Education Norms (good manners and civic education)
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
    currentLevel: 0,
    completedRounds: 0,
    accumulatedStars: 0,
    attempts: 0,
    currentSituation: null,
    showingFeedback: false
  };

  function init() {
    loadProgress();
    showLevelSelector();
  }

  function loadProgress() {
    var saved = App.storage.get(TOOL_ID);
    if (saved) {
      state.accumulatedStars = saved.stars || 0;
      state.completedRounds = saved.completed || {};
    }
  }

  function saveProgress() {
    var saved = {
      stars: state.accumulatedStars,
      completed: state.completedRounds
    };
    App.storage.set(TOOL_ID, saved);
  }

  function showLevelSelector() {
    var app = App.utils.$('#app');
    app.innerHTML = '';

    var heading = document.createElement('h2');
    heading.setAttribute('data-i18n', 'title');
    heading.textContent = App.i18n.t('title');
    app.appendChild(heading);

    var ctx = document.createElement('p');
    ctx.className = 'instruction';
    ctx.setAttribute('data-i18n', 'context');
    ctx.textContent = App.i18n.t('context');
    app.appendChild(ctx);

    var levelsContainer = document.createElement('div');
    levelsContainer.className = 'stack centered';

    var levels = DATA.niveles || DATA.levels || [];
    levels.forEach(function (lvl, idx) {
      var btn = document.createElement('button');
      btn.className = 'btn btn-level';
      btn.setAttribute('data-i18n', lvl.name);
      btn.textContent = App.i18n.t(lvl.name);
      btn.onclick = function () {
        state.currentLevel = idx;
        state.completedRounds = 0;
        startRound();
      };
      levelsContainer.appendChild(btn);
    });

    app.appendChild(levelsContainer);

    if (state.accumulatedStars > 0) {
      var starsEl = document.createElement('div');
      starsEl.className = 'stars';
      starsEl.setAttribute('aria-label', state.accumulatedStars + ' stars');
      starsEl.textContent = '\u2B50 ' + state.accumulatedStars;
      app.appendChild(starsEl);
    }

    App.i18n.apply(app);
  }

  function startRound() {
    state.attempts = 0;
    state.showingFeedback = false;

    var levels = DATA.niveles || DATA.levels || [];
    var lvl = levels[state.currentLevel];
    var situations = DATA.situaciones || DATA.situations || [];
    var situationsInLevel = situations.filter(function (s) {
      return (s.nivel || s.level) === (state.currentLevel + 1);
    });

    if (situationsInLevel.length === 0) {
      // Defensive: no cases for this level, skip to completion
      showCompletion();
      return;
    }

    situationsInLevel = App.utils.shuffle(situationsInLevel);
    state.currentSituation = situationsInLevel[0];

    showSituation();
  }

  function showSituation() {
    var app = App.utils.$('#app');
    app.innerHTML = '';

    var backLink = document.createElement('a');
    backLink.href = '../../site/index.html';
    backLink.className = 'back-link';
    backLink.setAttribute('data-i18n', 'core.back');
    backLink.textContent = '\u2190 ' + App.i18n.t('core.back');
    app.appendChild(backLink);

    var heading = document.createElement('h2');
    heading.className = 'tool-header';
    heading.setAttribute('data-i18n', 'title');
    heading.textContent = App.i18n.t('title');
    app.appendChild(heading);

    // Progress bar (rule 13: gradual progression)
    var levels = DATA.niveles || DATA.levels || [];
    var lvl = levels[state.currentLevel];
    var total = lvl.maxSituaciones || lvl.maxSituations;
    var progress = document.createElement('div');
    progress.className = 'progress-bar';
    var fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = (state.completedRounds / total * 100) + '%';
    progress.appendChild(fill);
    app.appendChild(progress);

    // Scenario card (context -> decision, SPEC §3.6)
    var scene = document.createElement('div');
    scene.className = 'scenario';

    var contextHeading = document.createElement('h3');
    contextHeading.className = 'context-title';
    contextHeading.setAttribute('data-i18n', state.currentSituation.context);
    contextHeading.textContent = App.i18n.t(state.currentSituation.context);
    scene.appendChild(contextHeading);

    var message = document.createElement('div');
    message.className = 'dialog-message';

    var characterLabel = App.i18n.t('character.' + state.currentSituation.character) || state.currentSituation.character;
    var pChar = document.createElement('p');
    pChar.className = 'character';
    pChar.textContent = characterLabel + ':';
    message.appendChild(pChar);

    var pMsg = document.createElement('p');
    pMsg.setAttribute('data-i18n', state.currentSituation.message);
    pMsg.textContent = App.i18n.t(state.currentSituation.message);
    message.appendChild(pMsg);

    // Audio button (rule 4: only where the design requires it; here the
    // user must hear what the other person is saying to choose well)
    var audioBtn = document.createElement('button');
    audioBtn.className = 'btn-audio';
    audioBtn.setAttribute('aria-label', App.i18n.t('core.listen'));
    audioBtn.textContent = '\uD83D\uDD0A ' + App.i18n.t('core.listen');
    audioBtn.onclick = function () {
      if (false && App.tts && App.tts.speak) App.tts.speak(App.i18n.t(state.currentSituation.message));
    };
    message.appendChild(audioBtn);

    scene.appendChild(message);
    app.appendChild(scene);

    // Decision prompt
    var questionEl = document.createElement('p');
    questionEl.className = 'question';
    questionEl.setAttribute('data-i18n', 'instruction');
    questionEl.textContent = App.i18n.t('instruction');
    app.appendChild(questionEl);

    // Options (rule 10: max 4-6 options; rule 11: 3 for quiz)
    var options = document.createElement('div');
    options.className = 'stack options-container';

    state.currentSituation.options.forEach(function (optionKey) {
      var btn = document.createElement('button');
      btn.className = 'btn btn-option';
      btn.setAttribute('data-i18n', optionKey);
      btn.textContent = App.i18n.t(optionKey);
      btn.onclick = function () {
        selectOption(optionKey, btn);
      };
      options.appendChild(btn);
    });

    app.appendChild(options);

    // Feedback zone (ARIA live for screen readers)
    var feedback = document.createElement('div');
    feedback.id = 'feedback';
    feedback.className = 'feedback';
    feedback.setAttribute('aria-live', 'polite');
    feedback.setAttribute('aria-atomic', 'true');
    app.appendChild(feedback);

    App.i18n.apply(app);
  }

  function selectOption(optionKey, btn) {
    if (state.showingFeedback) return;

    state.attempts++;
    state.showingFeedback = true;

    var feedbackZone = App.utils.$('#feedback');
    var optionBtns = App.utils.$$('.btn-option', App.utils.$('#app'));
    var isCorrect = optionKey === (state.currentSituation.correcta || state.currentSituation.correct);

    if (isCorrect) {
      // Correct answer -> celebrate, no punishment
      btn.classList.add('correct');
      App.feedback.success(feedbackZone);
      feedbackZone.textContent = App.i18n.t('feedback.correct');
      optionBtns.forEach(function (b) { b.disabled = true; });

      setTimeout(function () {
        state.completedRounds++;
        saveProgress();

        var levels = DATA.niveles || DATA.levels || [];
        var lvl = levels[state.currentLevel];
        if (state.completedRounds >= (lvl.maxSituaciones || lvl.maxSituations)) {
          showCompletion();
        } else {
          state.attempts = 0;
          state.showingFeedback = false;
          startRound();
        }
      }, 2000);
      return;
    }

    if (state.attempts === 1) {
      // First mistake: Socratic hint (rule 12)
      btn.classList.add('error');
      btn.disabled = true;
      App.feedback.encourage(feedbackZone);
      var hint = state.currentSituation.pista
        ? App.i18n.t(state.currentSituation.pista)
        : App.i18n.t('hint');
      feedbackZone.textContent = hint;
      App.feedback.lockUntilAck(optionBtns, feedbackZone, function () {
        state.showingFeedback = false;
      });
    } else {
      // Second mistake: show explanation and the correct answer
      btn.classList.add('error');
      App.feedback.encourage(feedbackZone);
      var explanation = App.i18n.t('feedback.explanation') + ' ' +
        App.i18n.t(state.currentSituation.correcta) + '.';
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
    heading.className = 'celebration-title';
    heading.setAttribute('data-i18n', 'roundEnd');
    heading.textContent = App.i18n.t('roundEnd');
    app.appendChild(heading);

    // Progressive stars: 1 / 2 / 3 by level (rule 5.3, never subtracted)
    var lvl = DATA.niveles[state.currentLevel];
    var starsEarned = 1 + state.currentLevel;
    state.accumulatedStars += starsEarned;

    var starsEl = document.createElement('div');
    starsEl.className = 'celebration-stars';
    starsEl.setAttribute('aria-label', starsEarned + ' stars');
    var starsTxt = '';
    for (var i = 0; i < starsEarned; i++) starsTxt += '\u2B50 ';
    starsEl.textContent = starsTxt;
    app.appendChild(starsEl);

    var totalStars = document.createElement('p');
    totalStars.className = 'total-stars';
    totalStars.textContent = '\u2B50 ' + state.accumulatedStars;
    app.appendChild(totalStars);

    // Transfer line (SPEC §3.6, mandatory in simulation rounds)
    var transfer = document.createElement('p');
    transfer.className = 'transfer';
    transfer.setAttribute('data-i18n', 'transfer');
    transfer.textContent = App.i18n.t('transfer');
    app.appendChild(transfer);

    var btns = document.createElement('div');
    btns.className = 'stack centered';

    var btnRepeat = document.createElement('button');
    btnRepeat.className = 'btn';
    btnRepeat.setAttribute('data-i18n', 'core.playAgain');
    btnRepeat.textContent = App.i18n.t('core.playAgain');
    btnRepeat.onclick = function () {
      state.completedRounds = 0;
      showLevelSelector();
    };
    btns.appendChild(btnRepeat);

    var btnMenu = document.createElement('button');
    btnMenu.className = 'btn btn-secondary';
    btnMenu.setAttribute('data-i18n', 'core.backToMenu');
    btnMenu.textContent = App.i18n.t('core.backToMenu');
    btnMenu.onclick = function () {
      window.location.href = '../../site/index.html';
    };
    btns.appendChild(btnMenu);

    app.appendChild(btns);

    saveProgress();
    App.feedback.celebrate(App.i18n.t('feedback.correct'));
    App.i18n.apply(app);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
