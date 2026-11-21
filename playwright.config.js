/*
 * playwright.config.js — the Playwright runner of Routime.
 *
 * The runner and the specs must share ONE copy of Playwright, so the config
 * loads the API through tests/playwright.js (the shim of the suite) instead of
 * requiring 'playwright/test' directly.
 *
 * The app is served by scripts/serve.js, the canonical static server of the
 * suite: it sends the CSP of _headers and answers unknown routes with
 * 404.html, exactly as Cloudflare does in production.
 */
'use strict';

const { defineConfig } = require('./tests/playwright.js');

/* Port 4178 is routime's own: every app of the suite has its own, so two
   apps can run their tests at the same time without fighting for a port. */
const PORT = Number(process.env.PORT || 4178);

module.exports = defineConfig({
  testDir: './tests',
  /* The app keeps its progress in localStorage and the specs share one
     browser: one worker at a time keeps the runs reproducible. */
  workers: 1,
  fullyParallel: false,
  reporter: 'line',
  /* The activities are slow to boot (they load their own data and the shared
     chrome), so a test may take a while before it says anything. */
  timeout: 120000,
  retries: 1,
  use: {
    baseURL: `http://127.0.0.1:${PORT}/`,
    headless: true,
  },
  webServer: {
    command: `node scripts/serve.js ${PORT}`,
    port: PORT,
    timeout: 30000,
    reuseExistingServer: false,
  },
});
