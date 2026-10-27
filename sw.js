/* ============================================================
   Routime — Service Worker
   Network-first strategy with a cache fallback (works offline).
   The server copy wins whenever the device is online, so a deploy
   reaches installed PWAs without anyone bumping VERSION by hand.
   When adding new files: add them to ARCHIVOS and bump VERSION (the
   precache still needs the list for offline use).
   ============================================================ */
var VERSION = 'routime-v72';

var ARCHIVOS = [
  './',
  './manifest.json',
  './styles.css',
  './strings.es.js',
  './strings.en.js',
  './team/',
  './team/styles.css',
  './team/strings.es.js',
  './team/strings.en.js',
  './config/',
  './config/app.js',
  './config/styles.css',
  './config/strings.es.js',
  './config/strings.en.js',
  './about/',
  './about/styles.css',
  './about/strings.es.js',
  './about/strings.en.js',
  './legal/',
  './legal/styles.css',
  './legal/strings.es.js',
  './legal/strings.en.js',
  './assets/css/tokens.css',
  './assets/css/locale-picker.css',
  './assets/js/locale-picker.js',
  './assets/css/base.css',
  './assets/css/components.css',
  './assets/fonts/atkinson-hyperlegible-400.woff2',
  './assets/fonts/atkinson-hyperlegible-700.woff2',
  './assets/fonts/nunito-variable.woff2',
  './assets/js/utils.js',
  './assets/js/i18n.js',
  './assets/js/tts.js',
  './assets/js/storage.js',
  './assets/js/feedback.js',
  './assets/js/dinero.js',
  './assets/js/sw-update.js',
  './assets/img/icono.svg',
  './assets/img/icono-192.png',
  './assets/img/icono-512.png',
  './assets/img/pile-dust.svg',
  './tools/catch/',
  './tools/catch/app.js',
  './tools/catch/data.js',
  './tools/catch/strings.es.js',
  './tools/catch/strings.en.js',
  './tools/catch/styles.css',
  './tools/connect-dots/',
  './tools/connect-dots/app.js',
  './tools/connect-dots/data.js',
  './tools/connect-dots/strings.es.js',
  './tools/connect-dots/strings.en.js',
  './tools/connect-dots/styles.css',
  './tools/calm/',
  './tools/calm/app.js',
  './tools/calm/data.js',
  './tools/calm/strings.es.js',
  './tools/calm/strings.en.js',
  './tools/calm/styles.css',
  './tools/categories/',
  './tools/categories/app.js',
  './tools/categories/data.js',
  './tools/categories/strings.es.js',
  './tools/categories/strings.en.js',
  './tools/categories/styles.css',
  './tools/bullying-chat/',
  './tools/bullying-chat/app.js',
  './tools/bullying-chat/data.js',
  './tools/bullying-chat/strings.es.js',
  './tools/bullying-chat/strings.en.js',
  './tools/bullying-chat/styles.css',
  './tools/safe-chat/',
  './tools/safe-chat/app.js',
  './tools/safe-chat/data.js',
  './tools/safe-chat/strings.es.js',
  './tools/safe-chat/strings.en.js',
  './tools/safe-chat/styles.css',
  './tools/coloring/',
  './tools/coloring/app.js',
  './tools/coloring/data.js',
  './tools/coloring/strings.es.js',
  './tools/coloring/strings.en.js',
  './tools/coloring/styles.css',
  './tools/comedy-club/',
  './tools/comedy-club/app.js',
  './tools/comedy-club/data.js',
  './tools/comedy-club/strings.es.js',
  './tools/comedy-club/strings.en.js',
  './tools/comedy-club/styles.css',
  './tools/builders/',
  './tools/builders/app.js',
  './tools/builders/data.js',
  './tools/builders/strings.es.js',
  './tools/builders/strings.en.js',
  './tools/builders/styles.css',
  './tools/idioms/',
  './tools/idioms/app.js',
  './tools/idioms/data.js',
  './tools/idioms/strings.es.js',
  './tools/idioms/strings.en.js',
  './tools/idioms/styles.css',
  './tools/double-meaning/',
  './tools/double-meaning/app.js',
  './tools/double-meaning/data.js',
  './tools/double-meaning/strings.es.js',
  './tools/double-meaning/strings.en.js',
  './tools/double-meaning/styles.css',
  './tools/differences/',
  './tools/differences/app.js',
  './tools/differences/data.js',
  './tools/differences/strings.es.js',
  './tools/differences/strings.en.js',
  './tools/differences/styles.css',
  './tools/where-is/',
  './tools/where-is/app.js',
  './tools/where-is/data.js',
  './tools/where-is/strings.es.js',
  './tools/where-is/strings.en.js',
  './tools/where-is/styles.css',
  './tools/where-to-store/',
  './tools/where-to-store/app.js',
  './tools/where-to-store/data.js',
  './tools/where-to-store/strings.es.js',
  './tools/where-to-store/strings.en.js',
  './tools/where-to-store/styles.css',
  './tools/ecos/',
  './tools/ecos/app.js',
  './tools/ecos/data.js',
  './tools/ecos/strings.es.js',
  './tools/ecos/strings.en.js',
  './tools/ecos/styles.css',
  './tools/path/',
  './tools/path/app.js',
  './tools/path/data.js',
  './tools/path/strings.es.js',
  './tools/path/strings.en.js',
  './tools/path/styles.css',
  './tools/theatre/',
  './tools/theatre/app.js',
  './tools/theatre/data.js',
  './tools/theatre/strings.es.js',
  './tools/theatre/strings.en.js',
  './tools/theatre/styles.css',
  './tools/emotions/',
  './tools/emotions/app.js',
  './tools/emotions/data.js',
  './tools/emotions/strings.es.js',
  './tools/emotions/strings.en.js',
  './tools/emotions/styles.css',
  './tools/emergencies/',
  './tools/emergencies/app.js',
  './tools/emergencies/data.js',
  './tools/emergencies/strings.es.js',
  './tools/emergencies/strings.en.js',
  './tools/emergencies/styles.css',
  './tools/phone-numbers/',
  './tools/phone-numbers/app.js',
  './tools/phone-numbers/data.js',
  './tools/phone-numbers/strings.es.js',
  './tools/phone-numbers/strings.en.js',
  './tools/phone-numbers/styles.css',
  './tools/doctor-visit/',
  './tools/doctor-visit/app.js',
  './tools/doctor-visit/data.js',
  './tools/doctor-visit/strings.es.js',
  './tools/doctor-visit/strings.en.js',
  './tools/doctor-visit/styles.css',
  './tools/first-aid-kit/',
  './tools/first-aid-kit/app.js',
  './tools/first-aid-kit/data.js',
  './tools/first-aid-kit/strings.es.js',
  './tools/first-aid-kit/strings.en.js',
  './tools/first-aid-kit/styles.css',
  './tools/my-details/',
  './tools/my-details/app.js',
  './tools/my-details/data.js',
  './tools/my-details/strings.es.js',
  './tools/my-details/strings.en.js',
  './tools/my-details/styles.css',
  './tools/fit/',
  './tools/fit/app.js',
  './tools/fit/data.js',
  './tools/fit/strings.es.js',
  './tools/fit/strings.en.js',
  './tools/fit/styles.css',
  './tools/friends/',
  './tools/friends/app.js',
  './tools/friends/data.js',
  './tools/friends/strings.es.js',
  './tools/friends/strings.en.js',
  './tools/friends/styles.css',
  './tools/self-esteem/',
  './tools/self-esteem/app.js',
  './tools/self-esteem/data.js',
  './tools/self-esteem/strings.es.js',
  './tools/self-esteem/strings.en.js',
  './tools/self-esteem/styles.css',
  './tools/resilience/',
  './tools/resilience/app.js',
  './tools/resilience/data.js',
  './tools/resilience/strings.es.js',
  './tools/resilience/strings.en.js',
  './tools/resilience/styles.css',
  './tools/trust-circle/',
  './tools/trust-circle/app.js',
  './tools/trust-circle/data.js',
  './tools/trust-circle/strings.es.js',
  './tools/trust-circle/strings.en.js',
  './tools/trust-circle/styles.css',
  './tools/turns-mirrors/',
  './tools/turns-mirrors/app.js',
  './tools/turns-mirrors/data.js',
  './tools/turns-mirrors/strings.es.js',
  './tools/turns-mirrors/strings.en.js',
  './tools/turns-mirrors/styles.css',
  './tools/street/',
  './tools/street/app.js',
  './tools/street/data.js',
  './tools/street/strings.es.js',
  './tools/street/strings.en.js',
  './tools/street/styles.css',
  './tools/house/',
  './tools/house/app.js',
  './tools/house/data.js',
  './tools/house/strings.es.js',
  './tools/house/strings.en.js',
  './tools/house/styles.css',
  './tools/shopping/',
  './tools/shopping/app.js',
  './tools/shopping/data.js',
  './tools/shopping/strings.es.js',
  './tools/shopping/strings.en.js',
  './tools/shopping/styles.css',
  './tools/healthy-food/',
  './tools/healthy-food/app.js',
  './tools/healthy-food/data.js',
  './tools/healthy-food/strings.es.js',
  './tools/healthy-food/strings.en.js',
  './tools/healthy-food/styles.css',
  './tools/sentence/',
  './tools/sentence/app.js',
  './tools/sentence/data.js',
  './tools/sentence/strings.es.js',
  './tools/sentence/strings.en.js',
  './tools/sentence/styles.css',
  './tools/shop/',
  './tools/shop/app.js',
  './tools/shop/data.js',
  './tools/shop/strings.es.js',
  './tools/shop/strings.en.js',
  './tools/shop/styles.css',
  './tools/task-list/',
  './tools/task-list/app.js',
  './tools/task-list/data.js',
  './tools/task-list/strings.es.js',
  './tools/task-list/strings.en.js',
  './tools/task-list/styles.css',
  './tools/my-agenda/',
  './tools/my-agenda/app.js',
  './tools/my-agenda/data.js',
  './tools/my-agenda/strings.es.js',
  './tools/my-agenda/strings.en.js',
  './tools/my-agenda/styles.css',
  './tools/post-or-not/',
  './tools/post-or-not/app.js',
  './tools/post-or-not/data.js',
  './tools/post-or-not/strings.es.js',
  './tools/post-or-not/strings.en.js',
  './tools/post-or-not/styles.css',
  './tools/social-safety/',
  './tools/social-safety/app.js',
  './tools/social-safety/data.js',
  './tools/social-safety/strings.es.js',
  './tools/social-safety/strings.en.js',
  './tools/social-safety/styles.css',
  './tools/phishing-alert/',
  './tools/phishing-alert/app.js',
  './tools/phishing-alert/data.js',
  './tools/phishing-alert/strings.es.js',
  './tools/phishing-alert/strings.en.js',
  './tools/phishing-alert/styles.css',
  './tools/sexual-health/',
  './tools/sexual-health/app.js',
  './tools/sexual-health/data.js',
  './tools/sexual-health/strings.es.js',
  './tools/sexual-health/strings.en.js',
  './tools/sexual-health/styles.css',
  './tools/blocks/',
  './tools/blocks/app.js',
  './tools/blocks/data.js',
  './tools/blocks/strings.es.js',
  './tools/blocks/strings.en.js',
  './tools/blocks/styles.css',
  './tools/my-body/',
  './tools/my-body/app.js',
  './tools/my-body/data.js',
  './tools/my-body/strings.es.js',
  './tools/my-body/strings.en.js',
  './tools/my-body/styles.css',
  './tools/good-manners/',
  './tools/good-manners/app.js',
  './tools/good-manners/data.js',
  './tools/good-manners/strings.es.js',
  './tools/good-manners/strings.en.js',
  './tools/good-manners/styles.css',
  './tools/dictionary/',
  './tools/dictionary/app.js',
  './tools/dictionary/data.js',
  './tools/dictionary/strings.es.js',
  './tools/dictionary/strings.en.js',
  './tools/dictionary/styles.css',
  './tools/spelling/',
  './tools/spelling/app.js',
  './tools/spelling/data.js',
  './tools/spelling/strings.es.js',
  './tools/spelling/strings.en.js',
  './tools/spelling/styles.css',
  './tools/colored-spelling/',
  './tools/colored-spelling/app.js',
  './tools/colored-spelling/data.js',
  './tools/colored-spelling/strings.es.js',
  './tools/colored-spelling/strings.en.js',
  './tools/colored-spelling/styles.css',
  './tools/word-search/',
  './tools/word-search/app.js',
  './tools/word-search/data.js',
  './tools/word-search/strings.es.js',
  './tools/word-search/strings.en.js',
  './tools/word-search/styles.css',
  './tools/vocabulary/',
  './tools/vocabulary/app.js',
  './tools/vocabulary/data.js',
  './tools/vocabulary/strings.es.js',
  './tools/vocabulary/strings.en.js',
  './tools/vocabulary/styles.css',
  './tools/pairs/',
  './tools/pairs/app.js',
  './tools/pairs/data.js',
  './tools/pairs/strings.es.js',
  './tools/pairs/strings.en.js',
  './tools/pairs/styles.css',
  './tools/times-of-day/',
  './tools/times-of-day/app.js',
  './tools/times-of-day/data.js',
  './tools/times-of-day/strings.es.js',
  './tools/times-of-day/strings.en.js',
  './tools/times-of-day/styles.css',
  './tools/clock/',
  './tools/clock/app.js',
  './tools/clock/data.js',
  './tools/clock/strings.es.js',
  './tools/clock/strings.en.js',
  './tools/clock/styles.css',
  './tools/piano-keys/',
  './tools/piano-keys/app.js',
  './tools/piano-keys/data.js',
  './tools/piano-keys/strings.es.js',
  './tools/piano-keys/strings.en.js',
  './tools/piano-keys/styles.css',
  './tools/whats-missing/',
  './tools/whats-missing/app.js',
  './tools/whats-missing/data.js',
  './tools/whats-missing/strings.es.js',
  './tools/whats-missing/strings.en.js',
  './tools/whats-missing/styles.css',
  './tools/be-prepared/',
  './tools/be-prepared/app.js',
  './tools/be-prepared/data.js',
  './tools/be-prepared/strings.es.js',
  './tools/be-prepared/strings.en.js',
  './tools/be-prepared/styles.css',
  './tools/while-help-arrives/',
  './tools/while-help-arrives/app.js',
  './tools/while-help-arrives/data.js',
  './tools/while-help-arrives/strings.es.js',
  './tools/while-help-arrives/strings.en.js',
  './tools/while-help-arrives/styles.css',
  './tools/what-to-wear/',
  './tools/what-to-wear/app.js',
  './tools/what-to-wear/data.js',
  './tools/what-to-wear/strings.es.js',
  './tools/what-to-wear/strings.en.js',
  './tools/what-to-wear/styles.css',
  './tools/what-do-i-need/',
  './tools/what-do-i-need/app.js',
  './tools/what-do-i-need/data.js',
  './tools/what-do-i-need/strings.es.js',
  './tools/what-do-i-need/strings.en.js',
  './tools/what-do-i-need/styles.css',
  './tools/what-first/',
  './tools/what-first/app.js',
  './tools/what-first/data.js',
  './tools/what-first/strings.es.js',
  './tools/what-first/strings.en.js',
  './tools/what-first/styles.css',
  './tools/routines/',
  './tools/routines/app.js',
  './tools/routines/data.js',
  './tools/routines/strings.es.js',
  './tools/routines/strings.en.js',
  './tools/routines/styles.css',
  './tools/education-norms/',
  './tools/education-norms/app.js',
  './tools/education-norms/data.js',
  './tools/education-norms/strings.es.js',
  './tools/education-norms/strings.en.js',
  './tools/education-norms/styles.css',
  './tools/signs/',
  './tools/signs/app.js',
  './tools/signs/data.js',
  './tools/signs/strings.es.js',
  './tools/signs/strings.en.js',
  './tools/signs/styles.css',
  './tools/situations/',
  './tools/situations/app.js',
  './tools/situations/data.js',
  './tools/situations/strings.es.js',
  './tools/situations/strings.en.js',
  './tools/situations/styles.css',
  './tools/tracing/',
  './tools/tracing/app.js',
  './tools/tracing/data.js',
  './tools/tracing/strings.es.js',
  './tools/tracing/strings.en.js',
  './tools/tracing/styles.css',

];

/* Cloudflare answers EVERY "/x.html" URL with a 307 to its extensionless form
   (/index.html -> /, /404.html -> /404, /offline.html -> /offline). Following
   that redirect yields a response with `redirected === true`, and the Cache API
   PRESERVES that flag across a store/load round trip, so cache.addAll()
   silently poisons the entry under its original key. Chrome refuses to hand
   such a response to a top-level navigation ("Response served by service
   worker has redirections").

   Rebuilding the response produces a brand-new object whose flag is false while
   keeping body, status and headers. */
function deRedirect(res) {
  if (!res || !res.redirected) return res;
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers
  });
}

/* addAll() stores the followed response as-is, so precache entry by entry and
   sanitise. Not all-or-nothing: a listed file that is missing on the server
   must not fail install, because a failed install leaves every client on its
   old worker and no deploy would reach them. A file that cannot be fetched
   here is fetched on demand later. */
function precache(cache, files) {
  return Promise.all(files.map(function (file) {
    /* cache: 'reload' avoids stale copies from the browser HTTP cache */
    return fetch(new Request(file, { cache: 'reload' })).then(function (res) {
      if (!res || !res.ok) return;
      return cache.put(file, deRedirect(res));
    }).catch(function () {});
  }));
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      return precache(cache, ARCHIVOS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(
        claves.filter(function (c) { return c !== VERSION; })
          .map(function (c) { return caches.delete(c); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  /* Always ask the network for document navigations first. This prevents
     Safari from opening a stale cached landing/activity page while a new
     service-worker version is being installed; the cache remains the
     offline fallback. */
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(function (r) {
        if (r.status === 200) {
          caches.open(VERSION).then(function (cache) {
            cache.put(event.request, deRedirect(r.clone()));
          });
        }
        return deRedirect(r);
      }).catch(function () {
        return caches.match(event.request).then(function (respuesta) {
          return respuesta ? deRedirect(respuesta) : new Response('Sin conexión', { status: 503 });
        });
      })
    );
    return;
  }
  /* Network-first for everything else too (scripts, styles, fonts, decks).
     The cache answers only when the network is unreachable. */
  event.respondWith(
    fetch(event.request).then(function (r) {
      /* Cache new same-origin resources and fonts, but never a redirect.
         Following one still yields status 200 with redirected === true,
         which is exactly the poisoned entry the precache comment above
         describes. */
      if (r.status === 200) {
        caches.open(VERSION).then(function (cache) {
          cache.put(event.request, deRedirect(r.clone()));
        });
      }
      return deRedirect(r);
    }).catch(function () {
      return caches.match(event.request).then(function (respuesta) {
        if (respuesta) return deRedirect(respuesta);
        return null;
      }).then(function (cached) {
        if (cached) return cached;
        /* Offline / network failure. Don't serve the cached landing page
           here: this branch answers at whatever URL the user was already
           on (e.g. /tools/clock/), and Safari would either break the layout
           or refuse the response as a phantom redirect. Reply with a tiny
           inline HTML that stays at the current URL and offers a link to
           the landing. The href is absolute ("/") because a relative one
           would resolve against the failed page's own directory, not the
           site root. */
        return new Response(
          '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
          '<meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<title>Sin conexión</title><style>body{font-family:system-ui,sans-serif;' +
          'margin:2rem auto;max-width:32rem;padding:0 1rem;line-height:1.5}' +
          'a{color:#1d4ed8}</style></head><body>' +
          '<h1>Sin conexión</h1>' +
          '<p>No hemos podido cargar esta página. Comprueba tu conexión a ' +
          'Internet y vuelve a intentarlo.</p>' +
          '<p><a href="/">Volver a la portada</a></p>' +
          '</body></html>',
          { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      });
    })
  );
});
