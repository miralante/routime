#!/usr/bin/env node
/* ============================================================
   Routime — scripts/i18n-split-all.js
   Apply scripts/i18n-split.js to every tools/<slug>/data.js
   with the legacy form `const DATA = { es:..., en:... }`.
   Refuses to touch files whose es/en shapes differ.
   Exits 0 if all were split, 1 otherwise (and lists the
   leftovers).
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var RAIZ = path.resolve(__dirname, '..');

function listarMonoliticos() {
  var out = [];
  function walk(d) {
    fs.readdirSync(d, { withFileTypes: true }).forEach(function (e) {
      var p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'data.js') {
        var c = fs.readFileSync(p, 'utf8');
        if (/^const\s+DATA\s*=\s*\{/m.test(c)) {
          /* es/en check is done by i18n-split itself, but skip here if it
             clearly doesn't have the bilingual shape. */
          if (/^\s*es\s*:/m.test(c) && /^\s*en\s*:/m.test(c)) out.push(p);
        }
      }
    });
  }
  walk(path.join(RAIZ, 'tools'));
  return out;
}

var archivos = listarMonoliticos();
console.log('Encontrados ' + archivos.length + ' data.js monolíticos');
var splitScript = path.join(__dirname, 'i18n-split.js');
var ok = 0, fail = 0, fallos = [];
archivos.forEach(function (p) {
  try {
    cp.execFileSync(process.execPath, [splitScript, p], { stdio: 'pipe' });
    ok++;
  } catch (e) {
    fail++;
    var msg = (e.stderr ? e.stderr.toString() : e.message).trim().split('\n').slice(0, 3).join(' | ');
    fallos.push(p + ' — ' + msg);
  }
});
console.log('OK: ' + ok + ', fallos: ' + fail);
if (fallos.length) {
  console.log('\nFallos:');
  fallos.forEach(function (f) { console.log('  ' + f); });
  process.exit(1);
}
