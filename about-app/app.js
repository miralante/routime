/* ============================================================
   Routime — About the app (about-app/)
   Linked from the main menu footer, right before "Settings".
   Shows the achievements unlocked on this device. The catalog,
   the unlock rules and the badge renderer live in
   ../assets/js/achievements.js; evaluate() runs here too so the
   grid is up to date even if the menu was not opened first.
   ============================================================ */
(function () {
  'use strict';

  function paintLanguageSelector() {
    var active = App.i18n.locale();
    App.utils.$$('.btn-lang').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.locale === active));
      btn.addEventListener('click', function () { App.i18n.setLocale(btn.dataset.locale); });
    });
  }

  function renderAchievements() {
    App.achievements.evaluate();
    App.achievements.render(document.getElementById('achievementsGrid'));
    var done = App.achievements.unlocked();
    var total = App.achievements.list.length;
    var count = App.achievements.list.filter(function (a) { return !!done[a.id]; }).length;
    document.getElementById('achievementsCount').textContent = App.i18n.t('achievementsCount')
      .replace('{n}', String(count))
      .replace('{total}', String(total));
  }

  paintLanguageSelector();
  renderAchievements();
})();
