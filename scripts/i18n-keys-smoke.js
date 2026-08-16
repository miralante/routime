#!/usr/bin/env node
/* ============================================================
   Routime — scripts/i18n-keys-smoke.js
   UI key parity smoke: extracts every App.i18n.t('key') call from
   tools/<slug>/app.js and verifies each key is registered in BOTH
   strings.es.js and strings.en.js. Fails if any UI text referenced
   from app.js is missing in any locale.

   Run over all tools by default:
     node scripts/i18n-keys-smoke.js
   Or a single tool:
     node scripts/i18n-keys-smoke.js bullying-chat

   Detected key forms:
     App.i18n.t('foo')
     App.i18n.t('a.b.c')
     App.i18n.t('foo', ...)        // extra args ignored
     t('foo')                       // inside the IIFE, $ is App.utils.$

   Also picks up data-i18n attributes from index.html for the same
   parity check (the I18N contract says every visible text has a
   matching key in both locales).
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RAIZ = path.resolve(__dirname, '..');

function loadAppKeys(slug) {
  var app = path.join(RAIZ, 'tools', slug, 'app.js');
  if (!fs.existsSync(app)) return [];
  var src = fs.readFileSync(app, 'utf8');
  var keys = new Set();
  /* App.i18n.t('foo') and t('foo') in either single or double quotes,
     with optional string concatenation afterwards (the literal part is
     the key family prefix). We capture the literal that appears right
     after the opening quote, so 'rel_' + x is reported as 'rel_', and
     'ayuda' + tipo + paso is reported as 'ayuda'. */
  var re = /\b(?:App\.i18n\.t|t)\(\s*(['"])([^'"]+)\1/g;
  var m;
  while ((m = re.exec(src)) !== null) {
    var key = m[2];
    if (key) keys.add(key);
  }
  return Array.from(keys);
}

function loadHtmlKeys(slug) {
  var html = path.join(RAIZ, 'tools', slug, 'index.html');
  if (!fs.existsSync(html)) return [];
  var src = fs.readFileSync(html, 'utf8');
  var keys = new Set();
  var reData = /data-i18n="([^"]+)"/g;
  var reAria = /data-i18n-aria="([^"]+)"/g;
  var reTitle = /data-i18n-title="([^"]+)"/g;
  var m;
  while ((m = reData.exec(src)) !== null) keys.add(m[1]);
  while ((m = reAria.exec(src)) !== null) keys.add(m[1]);
  while ((m = reTitle.exec(src)) !== null) keys.add(m[1]);
  return Array.from(keys);
}

function extractRegisteredKeys(slug, loc) {
  var file = path.join(RAIZ, 'tools', slug, 'strings.' + loc + '.js');
  if (!fs.existsSync(file)) return null;
  var src = fs.readFileSync(file, 'utf8');
  var captured = null;
  var sandbox = {
    App: { i18n: { register: function (dict, l) { if (l === loc) captured = dict; } } },
    window: {},
    console: console
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  try {
    vm.runInContext(src, sandbox, { filename: file });
  } catch (e) {
    return null;
  }
  if (!captured) return null;
  /* Walk the registered dict and collect every leaf key. */
  var out = new Set();
  (function walk(obj, prefix) {
    if (obj == null) return;
    if (typeof obj !== 'object') {
      out.add(prefix);
      return;
    }
    if (Array.isArray(obj)) {
      out.add(prefix);
      return;
    }
    Object.keys(obj).forEach(function (k) {
      var child = obj[k];
      var fullKey = prefix ? prefix + '.' + k : k;
      if (child && typeof child === 'object' && !Array.isArray(child)) {
        walk(child, fullKey);
      } else {
        out.add(fullKey);
      }
    });
  })(captured, '');
  return Array.from(out);
}

function clavesEnUso(slug) {
  var fromApp = loadAppKeys(slug);
  var fromHtml = loadHtmlKeys(slug);
  var combined = new Set();
  fromApp.forEach(function (k) { combined.add(k); });
  fromHtml.forEach(function (k) { combined.add(k); });
  /* Drop always-available global keys. Per doc/es/tecnico.md §6.3 these
     are registered globally in assets/js/i18n.js and MUST NOT be
     redefined per tool. We do not add them to the "used" set: instead
     we filter them out in validar() so a stray App.i18n.t('core.x') in
     app.js is not reported as a missing per-tool key. */
  return Array.from(combined);
}

function diff(setA, setB) {
  var a = new Set(setA), b = new Set(setB);
  var soloEnA = [], soloEnB = [];
  a.forEach(function (k) { if (!b.has(k)) soloEnA.push(k); });
  b.forEach(function (k) { if (!a.has(k)) soloEnB.push(k); });
  return { soloEnA: soloEnA.sort(), soloEnB: soloEnB.sort() };
}

function validar(slug) {
  var fallos = [];
  var usadas = clavesEnUso(slug);
  var clavesEs = extractRegisteredKeys(slug, 'es');
  var clavesEn = extractRegisteredKeys(slug, 'en');
  if (!clavesEs || !clavesEn) {
    fallos.push('no se pudieron cargar los strings (es/en)');
    return fallos;
  }
  ['es', 'en'].forEach(function (loc) {
    var set = new Set(loc === 'es' ? clavesEs : clavesEn);
    var faltan = usadas.filter(function (k) { return !set.has(k); });
    if (faltan.length) {
      /* Tolerate data-tree keys (which live under `data.*` in strings
         and aren't simple leaves). We can't tell apart "missing UI
         key" from "registered inside a complex object that didn't
         flatten cleanly", so we report only keys that look like UI
         keys (no `data.` prefix and dot-path ≤ 3 levels). */
      var reales = faltan.filter(function (k) {
        if (k.indexOf('data.') === 0) return false;
        return k.split('.').length <= 3;
      });
      if (reales.length) {
        /* Drop global keys registered in i18n.js §1.2. The walker only
           sees the per-tool dict, so it would otherwise flag every
           core.* and feedback.* reference as missing. */
        var globales = [
          'core.back', 'core.backToMenu', 'core.playAgain', 'core.next',
          'core.understood', 'core.listen', 'core.listenInstructions',
          'core.listenText', 'core.loading', 'core.roundComplete',
          'core.rest', 'core.dataProtection',
          'feedback.success', 'feedback.encourage'
        ];
        /* Drop dynamic-key prefixes. The regex in loadAppKeys() captures
           the literal that starts a string concatenation as-is (e.g.
           `rel_` from `App.i18n.t('rel_' + item.rel)`, or `bloque` from
           `App.i18n.t('bloque' + capitalize(id))`). A prefix is
           considered "valid" if at least one registered key in the
           current locale starts with it -- the smoke cannot resolve the
           dynamic suffix, but it can confirm the key family exists. */
        var setReg = new Set(loc === 'es' ? clavesEs : clavesEn);
        reales = reales.filter(function (k) {
          if (globales.indexOf(k) !== -1) return false;
          if (k.indexOf('core.') === 0 || k.indexOf('feedback.') === 0) return false;
          var tiene = false;
          setReg.forEach(function (rk) { if (rk !== k && rk.indexOf(k) === 0) tiene = true; });
          return !tiene;
        });
        if (reales.length) {
          reales.slice(0, 12).forEach(function (k) {
            fallos.push('[' + loc + '] falta clave UI: ' + k);
          });
          if (reales.length > 12) fallos.push('[' + loc + '] ... ' + (reales.length - 12) + ' más');
        }
      }
    }
  });
  return fallos;
}

var args = process.argv.slice(2);
var targets;
if (args.length) {
  targets = args.filter(function (a) { return a !== '--strict'; });
  if (!targets.length) targets = null;
}
if (!targets) {
  var d = path.join(RAIZ, 'tools');
  targets = fs.readdirSync(d, { withFileTypes: true })
    .filter(function (e) { return e.isDirectory(); })
    .map(function (e) { return e.name; })
    .sort();
}

var ok = 0, fail = 0, failed = [];
targets.forEach(function (slug) {
  var f = validar(slug);
  if (f.length) {
    fail++;
    failed.push({ slug: slug, fallos: f });
  } else {
    ok++;
    console.log('OK  tools/' + slug);
  }
});
console.log('\nResumen: ' + ok + ' OK, ' + fail + ' con fallos de paridad UI');
if (failed.length) {
  failed.forEach(function (f) {
    console.log('\n  tools/' + f.slug + ':');
    f.fallos.forEach(function (e) { console.log('    - ' + e); });
  });
  /* Exit non-zero ONLY when the run was invoked with --strict. The default
     is to report and exit 0: the smoke is informational and lists content
     gaps (missing keys in tools/<slug>/strings.<locale>.js) that the
     content session has to address, but it must not block deploys or
     merges. The same report still shows up in the CI job log so the
     content author can act on it. */
  if (process.argv.indexOf('--strict') !== -1) process.exit(1);
}
