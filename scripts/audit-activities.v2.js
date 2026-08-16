#!/usr/bin/env node
/* v2 audit: extracts i18n keys with Function(), evaluates DATA with
   a fresh VM sandbox. Doesn't modify the repo. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RAIZ = path.join(__dirname, '..');
var TOOLS = path.join(RAIZ, 'tools');

function rel(p) { return path.relative(RAIZ, p).split(path.sep).join('/'); }
function read(p) { try { return fs.readFileSync(p, 'utf8'); } catch (e) { return ''; } }

function i18nKeys(code) {
  // Find "App.i18n.register({...}, 'es')" -> object literal as text.
  // The non-greedy regex breaks on nested objects (e.g. nivelDescripcion: {...}).
  // We slice from "App.i18n.register(" up to the LAST "}, '" matching the locale
  // closer (e.g. "}, 'es');" / "}, 'en');"). That's the close of the outer object.
  var start = code.indexOf('App.i18n.register(');
  if (start === -1) return { loc: null, keys: [] };
  var openParen = start + 'App.i18n.register('.length;
  // Find matching close paren by tracking brace depth from the first '{' after openParen.
  var i = openParen;
  while (i < code.length && /\s/.test(code[i])) i++;
  if (code[i] !== '{') return { loc: null, keys: [] };
  var depth = 0, inStr = null, esc = false, objStart = i, objEnd = -1;
  for (; i < code.length; i++) {
    var ch = code[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (ch === '\\') { esc = true; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { objEnd = i; break; } }
  }
  if (objEnd === -1) return { loc: null, keys: [] };
  var body = code.slice(objStart, objEnd + 1);
  // Find the locale argument after the closing brace.
  var tail = code.slice(objEnd + 1);
  var lm = tail.match(/^\s*,\s*['"](\w+)['"]/);
  var loc = lm ? lm[1] : null;
  // Parse the object literal via Function
  var keys = [];
  try {
    var obj = (new Function('return (' + body + ');'))();
    Object.keys(obj).forEach(function (k) { keys.push(k); });
  } catch (e) { return { loc: loc, keys: [], err: e.message }; }
  return { loc: loc, keys: keys };
}

function evalDATA(code) {
  // Run the full data.js inside an isolated VM context with a window global
  var sandbox = { window: {}, console: console };
  sandbox.self = sandbox.window;
  sandbox.global = sandbox.window;
  try {
    vm.runInNewContext(code, sandbox, { timeout: 200 });
    // Try common variable names
    var candNames = ['DATA', 'data', 'BANK', 'BANCO', 'banco', 'NIVELES', 'niveles', 'CASOS', 'casos'];
    for (var i = 0; i < candNames.length; i++) {
      var v = sandbox.window[candNames[i]] || sandbox[candNames[i]];
      if (v !== undefined) return v;
    }
    // If code defines "var DATA = {...}" without var on window
    if (sandbox.DATA !== undefined) return sandbox.DATA;
    if (sandbox.data !== undefined) return sandbox.data;
    return null;
  } catch (e) { return { __err: e.message }; }
}

function countBanco(D) {
  if (!D || typeof D !== 'object' || D.__err) return 0;
  var count = 0;
  function visit(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) {
      // If array of items (not numeric indexes of an object), count them
      if (o.length && typeof o[0] === 'object') { count = Math.max(count, o.length); return; }
      if (typeof o[0] !== 'object') count = Math.max(count, o.length);
    }
    Object.keys(o).forEach(function (k) { visit(o[k]); });
  }
  visit(D);
  return count;
}

var slugs = fs.readdirSync(TOOLS).filter(function (name) {
  var full = path.join(TOOLS, name);
  try { return fs.statSync(full).isDirectory(); } catch (e) { return false; }
}).sort();

var results = [];
slugs.forEach(function (slug) {
  var dir = path.join(TOOLS, slug);
  var idx = read(path.join(dir, 'index.html'));
  var app = read(path.join(dir, 'app.js'));
  var data = read(path.join(dir, 'data.js'));
  var strEs = read(path.join(dir, 'strings.es.js'));
  var strEn = read(path.join(dir, 'strings.en.js'));
  var css = read(path.join(dir, 'styles.css'));

  if (!idx) { results.push({ slug: slug, error: 'no index.html' }); return; }

  var keysEs = i18nKeys(strEs).keys;
  var keysEn = i18nKeys(strEn).keys;
  var allKeys = Array.from(new Set([].concat(keysEs, keysEn)));
  var has = function (k) { return allKeys.indexOf(k) !== -1; };

  var D = evalDATA(data);
  var banco = countBanco(D);

  results.push({
    slug: slug,
    keys: {
      instruccion: has('instruccion'),
      contexto: has('contexto'),
      transferencia: has('transferencia'),
      pista: has('pista'),
      explicacion: has('explicacion') || has('explicacionCorrecta') || has('explicacionIncorrecta')
    },
    app: {
      feedback_success: app.indexOf('feedback.success') >= 0 || app.indexOf('feedback.acierto') >= 0,
      feedback_encourage: app.indexOf('feedback.encourage') >= 0 || app.indexOf('feedback.animo') >= 0,
      mostrarPista: app.indexOf('mostrarPista') >= 0,
      mostrarExplicacion: app.indexOf('mostrarExplicacion') >= 0,
      tts_speak: app.indexOf('tts.speak') >= 0,
      prefers_reduced_motion: idx.indexOf('prefers-reduced-motion') >= 0 || css.indexOf('prefers-reduced-motion') >= 0
    },
    banco: banco
  });
});

function pct(n, d) { return d ? Math.round(100 * n / d) : 0; }

// Print summary
console.log('# Routime activity audit (v2)');
console.log('# Total slugs: ' + results.length);
console.log('');
console.log('## Columns:');
console.log('- i.instruccion / i.contexto / i.transferencia / i.pista / i.explicacion: i18n keys present in strings.es.js OR strings.en.js');
console.log('- a.success / a.encourage: App.feedback.success / encourage called in app.js');
console.log('- a.pista / a.explicacion: mostrarPista / mostrarExplicacion called in app.js');
console.log('- a.tts: App.tts.speak called in app.js');
console.log('- a.rmotion: prefers-reduced-motion present in HTML or CSS');
console.log('- banco: items counted in data.js');
console.log('');

// CSV header
var cols = ['slug',
  'i.instruccion', 'i.contexto', 'i.transferencia', 'i.pista', 'i.explicacion',
  'a.success', 'a.encourage', 'a.pista', 'a.explicacion', 'a.tts', 'a.rmotion',
  'banco'];
console.log(cols.join(','));

results.forEach(function (r) {
  if (r.error) { console.log(r.slug + ',ERROR'); return; }
  var row = [r.slug,
    +r.keys.instruccion, +r.keys.contexto, +r.keys.transferencia, +r.keys.pista, +r.keys.explicacion,
    +r.app.feedback_success, +r.app.feedback_encourage, +r.app.mostrarPista, +r.app.mostrarExplicacion, +r.app.tts_speak, +r.app.prefers_reduced_motion,
    r.banco
  ];
  console.log(row.join(','));
});

// High priority: missing ALL of contexto + pista + explicacion i18n OR feedback scaffolding
console.log('\n## ALTO — actividades sin simulación ni socrático completas');
var altoMissing = results.filter(function (r) {
  if (r.error) return false;
  return !r.keys.contexto && !r.keys.transferencia && !r.app.mostrarPista && !r.app.mostrarExplicacion;
});
console.log('count: ' + altoMissing.length);
altoMissing.forEach(function (r) { console.log('  ' + r.slug + ' (banco=' + r.banco + ')'); });

console.log('\n## MEDIO — sin transferencia (todo lo demás OK)');
var medioMissing = results.filter(function (r) {
  if (r.error) return false;
  return !r.keys.transferencia && (r.app.mostrarPista || r.keys.contexto);
});
console.log('count: ' + medioMissing.length);
medioMissing.forEach(function (r) { console.log('  ' + r.slug + ' (contexto=' + (+r.keys.contexto) + ', pista=' + (+r.app.mostrarPista) + ')'); });

console.log('\n## BAJO — feedback success/encourage ausentes (sin refuerzo socrático completo)');
var bajoMissing = results.filter(function (r) {
  if (r.error) return false;
  return !r.app.feedback_success || !r.app.feedback_encourage;
});
console.log('count: ' + bajoMissing.length);
bajoMissing.forEach(function (r) { console.log('  ' + r.slug + ' (success=' + (+r.app.feedback_success) + ', encourage=' + (+r.app.feedback_encourage) + ')'); });

console.log('\n## Banco < 25');
results.filter(function (r) { return !r.error && r.banco < 25; }).forEach(function (r) {
  console.log('  ' + r.slug + ' (banco=' + r.banco + ')');
});

console.log('\n## r-motion < 8 (>=9: prefer-reduced-motion presente; resto: asumido por base.css global)');
console.log('OK siempre que venga heredado de base.css a nivel global.');
