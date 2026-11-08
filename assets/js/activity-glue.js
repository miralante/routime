/* ============================================================
   Routime — Activity glue: the progress helpers that the activities repeat.

   An activity asks for them with App.activityGlue(host) and keeps its own
   variables. The host gives getters, not values, because an activity may
   reassign its progress object. Provides:
     save()                  stores the activity's progress
     paintStars()            paints the star count
     levelFromProgress()     the level of the rounds completed so far

   host: {
     toolId:      the storage key (TOOL_ID),
     progress():  the activity's progress object,
     starsEl():   the element that shows the star count,
     levels():    the list of levels (only for levelFromProgress),
     roundsKey:   the progress field that counts the rounds (default 'roundsCompleted')
   }
   Requires storage.js (App.storage).
   ============================================================ */
(function () {
  'use strict';

  window.App = window.App || {};

  window.App.activityGlue = function (host) {
    var roundsKey = host.roundsKey || 'roundsCompleted';

    function save() {
      App.storage.set(host.toolId, host.progress());
    }

    function paintStars() {
      host.starsEl().textContent = '⭐ ' + host.progress().stars;
    }

    /* The level of the rounds completed so far, the last one once they run out. */
    function levelFromProgress() {
      var levels = host.levels();
      return levels[Math.min(host.progress()[roundsKey] || 0, levels.length - 1)];
    }

    return {
      save: save,
      paintStars: paintStars,
      levelFromProgress: levelFromProgress
    };
  };
})();
