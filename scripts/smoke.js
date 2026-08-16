#!/usr/bin/env node
/* ============================================================
   Routime — scripts/smoke.js
   Dynamic smoke test of all activities with Playwright: opens
   every tools/<slug>/index.html in Spanish and English, clicks the
   first level if there is one, and fails if any console or page
   error shows up. Complements scripts/check.js (static): this
   catches the "loads fine but breaks when used" class of bug (the
   real la-frase/palabras crash only showed up when clicking "Next"
   after the last question, invisible to any static check).

   Usage: node scripts/smoke.js [slug1 slug2 ...]
   With no arguments, tests all of them. With arguments, only those
   slugs (handy for quickly debugging a single one).

   Requires `playwright` installed (npm install) and the Chromium
   browser downloaded (npx playwright install chromium if needed).
   Test devDependency, the same way firebase-tools is a deployment
   one — SPEC.md §1 already allows devDependencies that aren't part
   of the code served to the end user.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var http = require('http');

var RAIZ = path.join(__dirname, '..');
var PUERTO = 5183;
var TIMEOUT_NAV = 15000;
var ESPERA_ASENTAR = 350;

var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json'
};

/* ---- Minimal static server (no dependencies) ---- */
function crearServidor() {
  return http.createServer(function (req, res) {
    var urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath.endsWith('/')) urlPath += 'index.html';
    var full = path.join(RAIZ, urlPath);
    if (!full.startsWith(RAIZ)) { res.writeHead(403); res.end(); return; }
    fs.readFile(full, function (err, data) {
      if (err) {
        if (!path.extname(full)) {
          fs.readFile(full + '.html', function (err2, data2) {
            if (err2) { res.writeHead(404); res.end('No encontrado: ' + urlPath); return; }
            res.writeHead(200, { 'Content-Type': MIME['.html'] });
            res.end(data2);
          });
          return;
        }
        res.writeHead(404); res.end('No encontrado: ' + urlPath);
        return;
      }
      var ext = path.extname(full);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

function listarSlugs() {
  return fs.readdirSync(path.join(RAIZ, 'tools'), { withFileTypes: true })
    .filter(function (e) { return e.isDirectory(); })
    .map(function (e) { return e.name; })
    .sort();
}

function main() {
  var playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    console.error('Falta "playwright". Instálalo con: npm install');
    process.exitCode = 1;
    return;
  }

  var pedidos = process.argv.slice(2);
  var slugs = pedidos.length ? pedidos : listarSlugs();
  var todos = listarSlugs();
  var desconocidos = slugs.filter(function (s) { return todos.indexOf(s) === -1; });
  if (desconocidos.length) {
    console.error('No existen en tools/: ' + desconocidos.join(', '));
    process.exitCode = 1;
    return;
  }

  var server = crearServidor();
  server.listen(PUERTO, function () {
    ejecutar(playwright, slugs).then(function (huboFallos) {
      server.close();
      process.exitCode = huboFallos ? 1 : 0;
    }).catch(function (e) {
      server.close();
      console.error('Error inesperado del smoke test:', e);
      process.exitCode = 1;
    });
  });
}

function forzarIdioma(page, locale) {
  return page.addInitScript(function (loc) {
    try { window.localStorage.setItem('routime:locale', loc); } catch (e) {}
  }, locale);
}

function probarHerramienta(page, slug, locale) {
  return new Promise(function (resolve) {
    var errores = [];
    function onError(e) { errores.push(e.message || String(e)); }
    function onConsole(m) { if (m.type() === 'error') errores.push('[console] ' + m.text()); }
    page.on('pageerror', onError);
    page.on('console', onConsole);

    var url = 'http://localhost:' + PUERTO + '/tools/' + slug + '/index.html';
    page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT_NAV })
      .then(function () { return page.waitForTimeout(ESPERA_ASENTAR); })
      .then(function () { return page.locator('.btn-nivel').first(); })
      .then(function (primerNivel) {
        return primerNivel.isVisible({ timeout: 500 }).catch(function () { return false; });
      })
      .then(function (hayNivel) {
        if (!hayNivel) return;
        return page.locator('.btn-nivel').first().click({ timeout: 1000 }).catch(function () {});
      })
      .then(function () { return page.waitForTimeout(ESPERA_ASENTAR); })
      .catch(function (e) { errores.push('navegación: ' + e.message); })
      .then(function () {
        page.off('pageerror', onError);
        page.off('console', onConsole);
        resolve(errores);
      });
  });
}

function ejecutar(playwright, slugs) {
  var resultados = [];
  return playwright.chromium.launch().then(function (browser) {
    return browser.newContext().then(function (context) {
      return (function siguiente(i) {
        if (i >= slugs.length) return context.close().then(function () { return browser.close(); });
        var slug = slugs[i];
        return (function porIdioma(locales) {
          if (!locales.length) return siguiente(i + 1);
          var locale = locales[0];
          return context.newPage().then(function (page) {
            return forzarIdioma(page, locale).then(function () {
              return probarHerramienta(page, slug, locale);
            }).then(function (errores) {
              return page.close().then(function () {
                if (errores.length) resultados.push({ slug: slug, locale: locale, errores: errores });
                process.stdout.write(errores.length ? 'X' : '.');
                return porIdioma(locales.slice(1));
              });
            });
          });
        })(['es', 'en']);
      })(0);
    });
  }).then(function () {
    console.log('');
    if (resultados.length) {
      console.log('FALLOS (' + resultados.length + ' de ' + (slugs.length * 2) + ' pruebas):');
      resultados.forEach(function (r) {
        console.log('  - tools/' + r.slug + '/ (' + r.locale + '):');
        r.errores.forEach(function (e) { console.log('      ' + e); });
      });
      return true;
    }
    console.log('OK (' + (slugs.length * 2) + ' pruebas: ' + slugs.length + ' herramientas × es/en)');
    return false;
  });
}

main();
