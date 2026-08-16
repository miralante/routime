#!/usr/bin/env node
/* ============================================================
   Routime — scripts/i18n-clean-trailing.js
   Removes trailing runtime/DOM code at the bottom of any
   tools/<slug>/data.js whose leading shape is a monolito {es, en}.
   The split only works on pure data trees, so any post-processing
   that used to live at the bottom of data.js (e.g. safe-chat's
   Object.defineProperty + document.querySelectorAll block) must
   be stripped before splitting.

   For safe-chat specifically the `regla += ' ...'` text was inlined
   into each regla by scripts/i18n-safe-chat-fix.js — that script
   must run AFTER this one.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');

var RAIZ = path.resolve(__dirname, '..');

function walk(d, out) {
  fs.readdirSync(d, { withFileTypes: true }).forEach(function (e) {
    var p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === 'data.js') out.push(p);
  });
}

var archivos = [];
walk(path.join(RAIZ, 'tools'), archivos);

var cleaned = 0;
archivos.forEach(function (p) {
  var c = fs.readFileSync(p, 'utf8');
  if (!/^const\s+DATA\s*=\s*\{/m.test(c)) return;
  /* Find the end of the DATA = { ... }; literal. Anything after
     (blank line aside) is trailing runtime code: strip it. */
  var m = c.match(/^const\s+DATA\s*=\s*\{[\s\S]*?\n\};\s*\n?/m);
  if (!m) return;
  var head = c.slice(0, m[0].length);
  /* Detect whether there is anything beyond the closing brace. */
  var tail = c.slice(m[0].length).trim();
  if (!tail) return; /* already clean */
  fs.writeFileSync(p, head);
  cleaned++;
});

console.log('Limpiados ' + cleaned + ' data.js con código trailing');
