/* ==========================================================================
   Routime — service worker update.
   Loaded by every page that registers sw.js. The registration itself stays
   where each page already has it (inline, so no existing page changes its
   sw.js URL or scope); this file only adds the update behaviour:

   1. When a NEW worker takes control, reload the page once, so an open tab
      never keeps running the previous version. A first install claims the
      page without a reload (no worker controlled it before).
   2. When the tab comes back into view, ask the browser to check sw.js for a
      new version, so a deploy reaches a tab that was left open.

   External for the same CSP reason as the other suite projects: inline code
   is not needed here, and a plain file is cached and revalidated like the rest
   of the shell.
   ========================================================================== */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;

  var hadController = !!navigator.serviceWorker.controller;
  var reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!hadController || reloaded) return;
    reloaded = true;
    location.reload();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    navigator.serviceWorker.getRegistration().then(function (registration) {
      if (registration) registration.update();
    }).catch(function () {});
  });
})();
