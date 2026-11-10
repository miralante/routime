/* ============================================================
   Routime — Play loop: the round that the activities of play share.

   An activity of play gives the person a mechanic and a round of items. This
   file runs the round: the items in order, the progress bar, the feedback after
   each try, the replay of the misses (App.reinforce), the stars, the saved
   progress and the closing screen. The activity draws each item and reports
   each try. It never counts stars or saves progress itself.

   Use it with App.activityPlay(config). config:
     toolId        storage key (the progress is kept there)
     roundsKey     progress field that counts the rounds (default 'roundsCompleted')
     items(progress)  the items of a round, already shuffled and cut to the round size; the progress lets the activity pick its level
     mount(item, play, info)
                   draws one item and returns the controls to lock while a hint
                   is read (an array of elements). info: { replay, index, total }.
                   Each try calls play.attempt(...), see below.
     reinforce     true: the items missed in a round come back in a mini-round
     secondMissAt  the try number from which the explanation is shown (default 2)
     summary(n, stars)  closing text (optional; default ui.roundDone)     onEnd(play)   hook after the closing screen is shown (optional)
     autoStart     false: the page's start screen (ui.start) shows first and
                   ui.play begins the round (default true: the round starts now)
     ui            selectors (ids with #) of the page elements:
                   game, end, feedback, explanationWrap, explanation, btnNext,
                   progressFill, progressText, stars, summary, btnRepeat

   play.attempt(correct, info):
     info.control      the element that was pressed (marked right or wrong)
     info.hint         the hint for a wrong try (shown at once)
     info.explanation  the explanation of the item (shown on a right try, or
                       after the second wrong one, once the hint is acknowledged)

   Rules that the loop keeps (SPEC, no punishment): a wrong try is never
   punished; the hint comes first; a right try counts a star; the round ends
   with one button.

   Requires feedback.js (App.feedback, App.reinforce) and storage.js.
   ============================================================ */
(function () {
  'use strict';

  window.App = window.App || {};

  App.activityPlay = function (config) {
    var $ = App.utils.$;
    var toolId = config.toolId;
    var roundsKey = config.roundsKey || 'roundsCompleted';
    var secondMissAt = config.secondMissAt || 2;
    var ui = config.ui || {};
    var el = {};
    Object.keys(ui).forEach(function (name) { el[name] = $(ui[name]); });

    var progress = App.storage.get(toolId);
    if (typeof progress.stars !== 'number') progress.stars = 0;
    if (typeof progress[roundsKey] !== 'number') progress[roundsKey] = 0;

    var items = [];
    var idx = 0;
    var roundHits = 0;
    var replaying = false;
    var solved = false;
    var attempts = 0;
    var controls = [];
    var current = null;

    function save() { App.storage.set(toolId, progress); }

    function paintStars() {
      if (!el.stars) return;
      el.stars.textContent = '⭐ ' + progress.stars;
    }

    /* "Ya tienes X estrellas · A por las Y estrellas" (stars-engine.js), added to the
       star message on screen when a star is earned, not to the header. */
    function paintStarLine(zone) {
      var old = zone.querySelector('.stars-goal');
      if (old) old.remove();
      var span = document.createElement('span');
      span.className = 'stars-goal';
      span.textContent = window.MiralanteStars.line(progress.stars, {
        reached: App.i18n.t('starsReached'),
        goal: App.i18n.t('starsGoal')
      });
      zone.appendChild(span);
    }

    function paintProgress() {
      var total = items.length;
      if (el.progressFill) el.progressFill.style.width = ((idx / total) * 100) + '%';
      if (el.progressText) el.progressText.textContent = (idx + 1) + ' / ' + total;
    }

    function showGame() {
      if (el.end) el.end.classList.add('hidden');
      if (el.game) el.game.classList.remove('hidden');
    }

    function showEnd() {
      if (el.game) el.game.classList.add('hidden');
      if (el.end) el.end.classList.remove('hidden');
    }

    /* A new round: the items, the replay list emptied, the first item drawn. */
    function start() {
      items = config.items(progress);
      idx = 0;
      roundHits = 0;
      replaying = false;
      App.reinforce.start();
      showGame();
      render();
    }

    /* Draws the item at idx and resets the try state. */
    function render() {
      current = items[idx];
      solved = false;
      attempts = 0;
      if (el.feedback) { el.feedback.textContent = ''; el.feedback.className = 'feedback'; }
      if (el.explanationWrap) el.explanationWrap.classList.add('hidden');
      if (el.explanation) el.explanation.textContent = '';
      if (el.btnNext) el.btnNext.classList.add('hidden');
      controls = config.mount(current, api, { replay: replaying, index: idx, total: items.length }) || [];
      paintProgress();
      paintStars();
    }

    function showExplanation(text) {
      if (!el.explanation) return;
      el.explanation.textContent = text;
      if (el.explanationWrap) el.explanationWrap.classList.remove('hidden');
    }

    function attempt(correct, info) {
      info = info || {};
      if (solved) return;
      if (correct) {
        solved = true;
        if (info.control) info.control.classList.add('correcta');
        if (info.control) App.feedback.markCorrect(info.control, controls);
        else controls.forEach(function (c) { c.disabled = true; });
        if (el.feedback) App.feedback.success(el.feedback);
        if (App.feedback.star) App.feedback.star();
        progress.stars += 1;
        roundHits += 1;
        save();
        paintStars();
        if (el.feedback) paintStarLine(el.feedback);
        showExplanation(info.explanation || '');
        if (el.btnNext) { el.btnNext.classList.remove('hidden'); el.btnNext.focus(); }
        return;
      }
      /* A wrong try: encouragement, the hint, and the other answers wait for «Understood». */
      attempts += 1;
      if (!replaying) App.reinforce.add('q' + idx, current);
      if (info.control) {
        info.control.classList.add('animo');
        info.control.disabled = true;
      }
      if (el.feedback) App.feedback.encourage(el.feedback);
      var explainAfterHint = attempts >= secondMissAt;
      if (info.hint) showExplanation(info.hint);
      App.feedback.lockUntilAck(controls, el.explanationWrap || null, function () {
        if (explainAfterHint && info.explanation) showExplanation(info.explanation);
      });
    }

    function next() {
      idx += 1;
      if (idx < items.length) { render(); return; }
      finish();
    }

    /* The end of the round: the misses come back first, then the closing screen. */
    function finish() {
      if (config.reinforce && !replaying) {
        var misses = App.reinforce.consume();
        if (misses.length) {
          items = misses.map(function (entry) { return entry.payload; });
          idx = 0;
          replaying = true;
          render();
          return;
        }
      }
      App.reinforce.clear();
      replaying = false;
      progress[roundsKey] += 1;
      save();
      paintProgress();
      showEnd();
      if (el.summary) {
        el.summary.textContent = config.summary
          ? config.summary(roundHits, progress.stars)
          : App.i18n.t('ui.roundDone').replace('{n}', roundHits).replace('{stars}', progress.stars);
        App.feedback.paintReward(el.summary, progress.stars, summaryText);
      }
      App.feedback.celebrate(App.i18n.t('core.roundComplete'));
      if (config.onEnd) config.onEnd(api);
    }

    var api = { attempt: attempt, showExplanation: showExplanation, save: save, progress: progress };

    if (el.btnNext) el.btnNext.addEventListener('click', next);
    if (el.btnRepeat) el.btnRepeat.addEventListener('click', start);
    /* With autoStart false the page shows its own start screen first; «play» begins the round. */
    if (config.autoStart === false) {
      if (el.start) el.start.classList.remove('hidden');
      if (el.play) el.play.addEventListener('click', function () {
        if (el.start) el.start.classList.add('hidden');
        start();
      });
    } else {
      /* After DOMContentLoaded, so App.i18n has already translated the page (its own listener runs first). */
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
      else start();
    }
    return api;
  };
})();
