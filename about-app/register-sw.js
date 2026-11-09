/* Register the service worker from the about-app entry point, so it is active for
   later navigation (same as the tools and site/ pages). External file because
   the CSP is script-src 'self'. */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../sw.js').catch(function () {});
}
