/* ============================================================
   Routime — Shared strings for the stars goal line.
   Used by stars-engine.js (through activity-glue.js and
   activity-play.js) on every activity page. Loaded after i18n.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "starsReached": "Ya tienes {n} estrellas",
    "starsGoal": "A por las {n} estrellas"
  }, 'es');

  App.i18n.register({
    "starsReached": "You already have {n} stars",
    "starsGoal": "Go for {n} stars"
  }, 'en');
})();
