#!/usr/bin/env node
/* ============================================================
   Routime — scripts/i18n-safe-chat-fix.js
   Inlines the two `regla +=` post-processing blocks that used to
   live at the bottom of tools/safe-chat/data.js into each `regla`
   string inside DATA.es / DATA.en. After this, data.js is a pure
   data tree and the split can proceed normally.

   The DOM-side-effect getter that was in the same block (the
   `Object.defineProperty(opcion, 'segura', ...)` part) belongs to
   app.js and is added there separately.

   Idempotent: if a `regla` already ends with the suffix, it's
   skipped. Safe to run multiple times.

   Usage:
     node scripts/i18n-safe-chat-fix.js
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');

var RAIZ = path.resolve(__dirname, '..');
var DATA_FILE = path.join(RAIZ, 'tools', 'safe-chat', 'data.js');

var SUFIJOS = {
  es: ' Esta persona era peligrosa. Podía ser un hacker o un delincuente que quería engañarte o robar tus datos.',
  en: ' This person was dangerous. They could have been a hacker or a criminal trying to trick you or steal your information.'
};

function loadData(file) {
  var src = fs.readFileSync(file, 'utf8');
  var sandbox = { window: {}, console: console };
  sandbox.window = sandbox;
  var vm = require('vm');
  vm.createContext(sandbox);
  vm.runInContext(src + '\n;this.__DATA__ = (typeof DATA !== "undefined") ? DATA : undefined;', sandbox, { filename: file });
  return sandbox.__DATA__;
}

function applySufijos(DATA) {
  Object.keys(SUFIJOS).forEach(function (loc) {
    var sufijo = SUFIJOS[loc];
    DATA[loc].escenarios.forEach(function (esc) {
      esc.variantes.forEach(function (var_) {
        if (typeof var_.regla !== 'string') return;
        if (var_.regla.indexOf(sufijo) === -1) {
          var_.regla = var_.regla + sufijo;
        }
      });
    });
  });
  return DATA;
}

function renderData(DATA) {
  /* Render DATA as a JS literal using JSON.stringify with quotes and
     a top-level `const DATA = ` wrapper. JSON.stringify is locale-safe
     for our values (no NaN/undefined). */
  return 'const DATA = ' + JSON.stringify(DATA, null, 2) + ';\n';
}

function main() {
  var DATA = loadData(DATA_FILE);
  if (!DATA || !DATA.es || !DATA.en) {
    console.error('tools/safe-chat/data.js: no expone DATA con forma {es, en}');
    process.exit(1);
  }
  applySufijos(DATA);
  var out = '/* ============================================================\n' +
    '   Routime — Datos: Chat Seguro (autonomía — seguridad en internet).\n' +
    '   Chats simulados para practicar cómo responder a personas que\n' +
    '   intentan engañar (fotos, datos, contraseñas, secretos, dinero…).\n' +
    '   Formato: DATA.es / DATA.en, cada uno con:\n' +
    '   {\n' +
    '     escenarios: [{ id, titulo, picto, variantes: [{ contacto, pasos: [...] }] }],\n' +
    '     normas: [{ picto, texto }, ...]\n' +
    '   }\n' +
    '   app.js usa DATA[App.i18n.locale()] || DATA.es (forma legacy\n' +
    '   reconstruida por App.i18n.datos()).\n' +
    '   El getter sobre opciones seguras vive en app.js (side effect DOM).\n' +
    '   ============================================================ */\n' +
    renderData(DATA);
  fs.writeFileSync(DATA_FILE, out);
  console.log('OK tools/safe-chat/data.js: sufijos inline aplicados');
}

main();
