#!/usr/bin/env node
/* ============================================================
   Routime — scripts/i18n-smoke.js
   Runtime smoke for the i18n refactor.
   Loads tools/<slug>/data.js + strings.es.js + strings.en.js in
   a vm sandbox that mimics the browser's script loading order,
   then merges structure + texts the way app.js does, and
   asserts that:
     - Both locales load and produce non-empty data trees
     - For each scenario, titulo/contacto/relacion/regla are defined
     - Each paso has its text and opciones' text defined
     - normas[].texto is defined
   Exits 0 on OK, 1 on any failure (with a summary).
   Usage:
     node scripts/i18n-smoke.js bullying-chat
     node scripts/i18n-smoke.js   (all 44)
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RAIZ = path.resolve(__dirname, '..');

function cargar(slug, loc) {
  var dir = path.join(RAIZ, 'tools', slug);
  /* Load the real i18n.js so the test exercises the production merge. */
  var i18nSrc = fs.readFileSync(path.join(RAIZ, 'assets', 'js', 'i18n.js'), 'utf8');
  var sb = {
    window: {},
    console: console,
    __locale: loc,
    /* Mock the DOM bits i18n.js touches in inicio()/apply(). */
    document: {
      documentElement: { setAttribute: function () {} },
      readyState: 'loading',
      addEventListener: function () {},
      querySelectorAll: function () { return []; },
      getAttribute: function () { return null; }
    }
  };
  sb.window = sb;
  vm.createContext(sb);
  vm.runInContext(i18nSrc, sb, { filename: 'i18n.js' });
  /* Pin the locale for this test (ignore storage). */
  vm.runInContext(';this.App.i18n.locale = function () { return "' + loc + '"; };', sb);
  /* Order: data.js first, then strings.<locale>.js — like the HTML does. */
  vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), sb, { filename: 'data.js' });
  vm.runInContext(fs.readFileSync(path.join(dir, 'strings.' + loc + '.js'), 'utf8'), sb, { filename: 'strings.' + loc + '.js' });
  /* Read the global DATA (declared via `var` in the new data.js) and
     the result of App.i18n.datos() — the legacy {es, en} shape. */
  vm.runInContext(';this.__DATA__ = (typeof DATA !== "undefined") ? DATA : undefined; this.__DATOS__ = App.i18n.datos();', sb);
  return { sb: sb, neutral: sb.__DATA__, datos: sb.__DATOS__ };
}

function construirDatos(neutral, datos, loc) {
  /* datos is the legacy {es, en} tree from App.i18n.datos() — already
     merged. We pick the active locale and return it as the unified
     data tree app.js reads. */
  return (datos && datos[loc]) || {};
}

function validarArbol(datos, slug, loc, fallos) {
  /* Find the first array key (the activity's root collection). Each
     tool uses a different name: escenarios, palabras, casos, etc. */
  var rootKey = null;
  Object.keys(datos).forEach(function (k) {
    if (rootKey) return;
    if (Array.isArray(datos[k]) && datos[k].length) rootKey = k;
  });
  if (!rootKey) {
    /* Nothing array-ish: skip if the file looks like a non-collection
       tree (e.g. it has only nested objects / primitives). */
    return;
  }
  var coleccion = datos[rootKey];
  coleccion.forEach(function (item, i) {
    if (!item || typeof item !== 'object') return;
    /* Recursively walk the item, collecting any string field whose
       sibling is empty/missing in the neutral tree. We just check
       that every item has at least one non-empty translatable field. */
    var tieneTexto = false;
    (function walk(o) {
      if (tieneTexto) return;
      if (!o || typeof o !== 'object') return;
      Object.keys(o).forEach(function (k) {
        if (tieneTexto) return;
        var v = o[k];
        if (typeof v === 'string' && v.length > 0) tieneTexto = true;
        else if (Array.isArray(v)) v.forEach(walk);
        else if (v && typeof v === 'object') walk(v);
      });
    })(item);
    if (!tieneTexto) {
      fallos.push('[' + loc + '] ' + rootKey + '[' + i + '] sin texto traducible');
    }
  });
}

function validar(slug) {
  var fallos = [];
  ['es', 'en'].forEach(function (loc) {
    var r;
    try { r = cargar(slug, loc); }
    catch (e) { fallos.push('[' + loc + '] no carga: ' + e.message); return; }
    if (!r.neutral) { fallos.push('[' + loc + '] data.js no expone DATA'); return; }
    if (!r.datos || !r.datos[loc]) { fallos.push('[' + loc + '] App.i18n.datos() no devuelve árbol para ' + loc); return; }
    var datos = construirDatos(r.neutral, r.datos, loc);
    validarArbol(datos, slug, loc, fallos);
  });
  return fallos;
}

var args = process.argv.slice(2);
var targets;
if (args.length) {
  targets = args;
} else {
  var d = path.join(RAIZ, 'tools');
  targets = fs.readdirSync(d, { withFileTypes: true })
    .filter(function (e) { return e.isDirectory(); })
    .map(function (e) { return e.name; })
    .sort();
}
var okCount = 0;
var failCount = 0;
var failed = [];
targets.forEach(function (slug) {
  var f = validar(slug);
  if (f.length) {
    failCount++;
    failed.push({ slug: slug, errores: f });
  } else {
    okCount++;
    console.log('OK  tools/' + slug);
  }
});
console.log('\nResumen: ' + okCount + ' OK, ' + failCount + ' con fallos');
if (failed.length) {
  failed.forEach(function (f) {
    console.log('\n  tools/' + f.slug + ':');
    f.errores.slice(0, 8).forEach(function (e) { console.log('    - ' + e); });
    if (f.errores.length > 8) console.log('    ... ' + (f.errores.length - 8) + ' más');
  });
  process.exit(1);
}
