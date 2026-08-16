#!/usr/bin/env node
/* ============================================================
   Routime — scripts/rename-tool-slugs-docs.js
   Updates the tools/<slug>/ paths in the technical documentation
   to reflect the renamed neutral slugs.

   Same map as rename-tool-slugs.js (with ajedrez -> chess also
   included). Only touches paths, not descriptive text.

   Usage: node scripts/rename-tool-slugs-docs.js
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');

var RAIZ = path.join(__dirname, '..');

var RENAMES = {
  'adivinanzas': 'riddles',
  'ajedrez': 'chess',
  'atrapa': 'catch',
  'calma': 'calm',
  'categorias': 'categories',
  'chat-acoso': 'bullying-chat',
  'chat-seguro': 'safe-chat',
  'colorear': 'coloring',
  'constructores': 'builders',
  'cuatro-en-raya': 'connect-four',
  'damas': 'checkers',
  'dichos': 'idioms',
  'diferencias': 'differences',
  'donde-esta': 'where-is',
  'donde-lo-guardo': 'where-to-store',
  'el-camino': 'path',
  'el-teatro': 'theatre',
  'emergencias': 'emergencies',
  'emociones': 'emotions',
  'encajar': 'fit',
  'entre-amigos': 'friends',
  'giros-espejos': 'turns-mirrors',
  'historias': 'stories',
  'la-calle': 'street',
  'la-casa': 'house',
  'la-compra': 'shopping',
  'la-frase': 'sentence',
  'la-tienda': 'shop',
  'lista-tareas': 'task-list',
  'lo-publico': 'post-or-not',
  'los-bloques': 'blocks',
  'mi-cuerpo-avisa': 'my-body',
  'monedero': 'wallet',
  'numeros': 'numbers',
  'palabras': 'words',
  'parejas': 'pairs',
  'partes-del-dia': 'times-of-day',
  'patrones': 'patterns',
  'piano-teclas': 'piano-keys',
  'que-falta': 'whats-missing',
  'que-me-pongo': 'what-to-wear',
  'que-necesito': 'what-do-i-need',
  'que-no-encaja': 'odd-one-out',
  'que-primero': 'what-first',
  'reloj': 'clock',
  'rutinas': 'routines',
  'senales': 'signs',
  'situaciones': 'situations',
  'sudoku-visual': 'visual-sudoku',
  'trazos': 'tracing',
  'tres-en-raya': 'tic-tac-toe'
};

var pairs = Object.keys(RENAMES).map(function (k) { return [k, RENAMES[k]]; });
// Longest slug first to avoid clobbering common prefixes
pairs.sort(function (a, b) { return b[0].length - a[0].length; });

function replaceInText(txt, mapping) {
  var total = 0;
  mapping.forEach(function (p) {
    var oldSlug = p[0], newSlug = p[1];
    var pathOld = 'tools/' + oldSlug + '/';
    var pathNew = 'tools/' + newSlug + '/';
    if (txt.indexOf(pathOld) !== -1) {
      var c = txt.split(pathOld).length - 1;
      txt = txt.split(pathOld).join(pathNew);
      total += c;
    }
  });
  return { txt: txt, count: total };
}

var targets = [
  'doc/es/tecnico.md',
  'doc/en/technical.md',
  'doc/es/I18N.md',
  'doc/en/I18N.md',
  'CLAUDE.md',
  'agent.md',
  'README.md',
  'README.es.md',
  'CONTRIBUTING.md',
  'CONTRIBUTING.es.md',
  'doc/es/indice.md'
];
targets.forEach(function (rel) {
  var full = path.join(RAIZ, rel);
  if (!fs.existsSync(full)) return;
  var orig = fs.readFileSync(full, 'utf8');
  var r = replaceInText(orig, pairs);
  if (r.count > 0) {
    fs.writeFileSync(full, r.txt, 'utf8');
    console.log('UPDATED ' + rel + ' (' + r.count + ' reemplazos)');
  } else {
    console.log('skip    ' + rel + ' (sin cambios)');
  }
});

console.log('Listo.');
