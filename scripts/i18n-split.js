#!/usr/bin/env node
/* ============================================================
   Routime — scripts/i18n-split.js
   Refactor helper: takes a tools/<slug>/data.js with the legacy
   form `const DATA = { es: {...}, en: {...} }` and rewrites it
   so that:
     - data.js keeps the structure (escenarios, variantes, pasos,
       opciones, normas) but with only non-translatable fields
       (id, tipo, segura, picto, contacto aliases that look like IDs).
     - strings.es.js and strings.en.js register the same structure
       with the translatable fields (titulo, texto, aviso,
       avisoSeguro, confirmacion, regla, normas[].texto).

   Both trees use the SAME id-path so app.js can read either one
   by key (DATA structure becomes locale-independent). app.js
   is then expected to read:
     var DATA_ESTRUCTURA = require-style global from data.js
     var DATA_TEXTOS = App.i18n.data('data')

   The tool is intentionally conservative: if the shape of the
   es/en blocks differs (different number of variantes, different
   ids, missing keys) it refuses to split and prints the diff.

   Usage:
     node scripts/i18n-split.js tools/bullying-chat
     node scripts/i18n-split.js tools/bullying-chat --dry-run
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RAIZ = path.resolve(__dirname, '..');

/* Fields kept in data.js (non-translatable, structure-only). */
var NEUTRAL_FIELDS = ['id', 'tipo', 'segura', 'picto'];
/* Fields moved into strings.<locale>.js (translatable text). */
var TEXT_FIELDS = ['titulo', 'texto', 'aviso', 'avisoSeguro', 'confirmacion', 'regla', 'relacion', 'contacto'];

function loadData(slugOrPath) {
  /* Accept either "<slug>" or "tools/<slug>" or absolute/relative path. */
  var file;
  if (slugOrPath.indexOf('data.js') !== -1) {
    file = path.resolve(RAIZ, slugOrPath);
  } else if (slugOrPath.indexOf('/') !== -1) {
    file = path.join(RAIZ, slugOrPath, 'data.js');
  } else {
    file = path.join(RAIZ, 'tools', slugOrPath, 'data.js');
  }
  var src = fs.readFileSync(file, 'utf8');
  var sandbox = { window: {}, console: console, __capture: {} };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  /* Append a tail line to read whatever landed on the global. We use
     `globalThis` (or `this`) to read top-level `const` declarations
     in non-module scripts: in vm.runInContext they bind at the
     script scope, but the trailing expression assignment copies
     them onto the sandbox. */
  var tail = '\n;this.__capture.DATA = (typeof DATA !== "undefined") ? DATA : undefined;';
  try {
    vm.runInContext(src + tail, sandbox, { filename: file });
  } catch (e) {
    throw new Error('no se pudo parsear ' + file + ': ' + e.message);
  }
  return sandbox.__capture.DATA;
}

function shape(obj) {
  /* Returns a structural fingerprint for diff: text strings normalised to <T>,
     structure (arrays/objects/numbers/booleans) preserved, key names preserved. */
  if (Array.isArray(obj)) {
    return obj.map(shape);
  }
  if (obj && typeof obj === 'object') {
    var out = {};
    Object.keys(obj).sort().forEach(function (k) {
      out[k] = shape(obj[k]);
    });
    return out;
  }
  if (typeof obj === 'string') return '<T>';
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
  return null;
}

function compareShapes(es, en) {
  /* Returns a list of differences; empty list = same shape.
     Primitive non-text values (numbers/booleans/null) are not flagged
     as mismatches even if they differ across locales — those are
     data (e.g. `correct: 2` vs `correct: 1` indexes an answer) and
     don't affect the structural split. */
  var diffs = [];
  function walk(a, b, path) {
    if (a === b) return;
    var ta = typeof a, tb = typeof b;
    /* Mismatched primitives that aren't strings are non-translatable,
       so the shape still splits correctly. Flag but as 'info'. */
    if (ta !== tb) {
      diffs.push(path + ': type ' + ta + ' vs ' + tb);
      return;
    }
    if (ta === 'string') {
      /* Both should be '<T>'. If they differ, something went wrong
         in shape normalisation. */
      if (a !== b) diffs.push(path + ': text mismatch');
      return;
    }
    if (ta === 'number' || ta === 'boolean') {
      /* Different numbers/booleans across locales are not a structural
         problem; the neutral tree keeps the es value and the merge
         doesn't touch primitives. */
      return;
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) { diffs.push(path + ': array vs non-array'); return; }
      if (a.length !== b.length) diffs.push(path + ': len ' + a.length + ' vs ' + b.length);
      for (var i = 0; i < Math.max(a.length, b.length); i++) {
        walk(a[i], b[i], path + '[' + i + ']');
      }
      return;
    }
    if (a && typeof a === 'object') {
      var keys = new Set(Object.keys(a).concat(Object.keys(b)));
      keys.forEach(function (k) {
        walk(a[k], b[k], path + '.' + k);
      });
      return;
    }
  }
  walk(es, en, '$');
  return diffs;
}

function splitNode(node) {
  /* Splits one node into { neutral, text }.
     Rules:
       - If the value is a string: place into text if the key is in
         TEXT_FIELDS, else keep in neutral.
       - If the value is a number/boolean: keep in neutral.
       - If the value is an array: recurse for each element; if
         children have a `text` side, the array goes into `text`;
         if they have a `neutral` side, the array goes into
         `neutral`. (Pure structure arrays without text end up
         only in neutral.)
       - If the value is an object: recurse; merge into both. */
  var neutral = {};
  var text = {};
  if (!node || typeof node !== 'object') return { neutral: node, text: node };
  Object.keys(node).forEach(function (k) {
    var v = node[k];
    if (typeof v === 'string') {
      if (TEXT_FIELDS.indexOf(k) !== -1) {
        text[k] = v;
      } else {
        neutral[k] = v;
      }
    } else if (typeof v === 'number' || typeof v === 'boolean' || v === null || v === undefined) {
      neutral[k] = v;
    } else if (Array.isArray(v)) {
      var nArr = [];
      var tArr = [];
      v.forEach(function (item) {
        var rec = splitNode(item);
        nArr.push(rec.neutral);
        tArr.push(rec.text);
      });
      neutral[k] = nArr;
      text[k] = tArr;
    } else if (typeof v === 'object') {
      var rec2 = splitNode(v);
      if (Object.keys(rec2.neutral).length) neutral[k] = rec2.neutral;
      if (Object.keys(rec2.text).length) text[k] = rec2.text;
    }
  });
  return { neutral: neutral, text: text };
}

function escString(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function indent(s, n) {
  var pad = ' '.repeat(n);
  return s.split('\n').map(function (l) { return pad + l; }).join('\n');
}

function renderNeutral(node, depth) {
  /* Render neutral tree as JS literal. */
  if (node === null || node === undefined) return 'null';
  if (typeof node === 'string') return "'" + escString(node) + "'";
  if (typeof node === 'number' || typeof node === 'boolean') return String(node);
  if (Array.isArray(node)) {
    if (node.length === 0) return '[]';
    var items = node.map(function (n) { return renderNeutral(n, depth + 2); });
    return '[\n' + indent(items.join(',\n'), depth + 2) + '\n' + ' '.repeat(depth) + ']';
  }
  if (typeof node === 'object') {
    var keys = Object.keys(node);
    if (keys.length === 0) return '{}';
    var parts = keys.map(function (k) {
      return "'" + escString(k) + "': " + renderNeutral(node[k], depth + 2);
    });
    return '{\n' + indent(parts.join(',\n'), depth + 2) + '\n' + ' '.repeat(depth) + '}';
  }
  return 'null';
}

function renderStrings(locale, root, uiKeys) {
  /* Render the strings file. The dict has two siblings:
       - data: <text tree>
       - <uiKey>: <ui text>
     The UI keys (title, instruccion, btnNormas, ...) live alongside
     the data tree so App.i18n.t('title') keeps working. */
  var body = renderNeutral(root, 0);
  var commentEs = locale === 'es' ? 'ES' : 'EN';
  var uiEntries = Object.keys(uiKeys || {})
    .sort()
    .map(function (k) {
      return '    "' + escString(k) + '": ' + JSON.stringify(uiKeys[k]) + ',';
    })
    .join('\n');
  var header = [
    '/* ============================================================',
    '   Routime — Texts (' + commentEs + ')',
    '   Per-language file. Conditionally loaded from index.html',
    '   according to App.i18n.locale().',
    '   Carries two kinds of texts:',
    '     - UI keys (title, instruccion, btnNormas, ...) for the',
    '       app shell. Resolved by App.i18n.t(\'title\') etc.',
    '     - data: <tree> — the translated text for the activity',
    '       data. Resolved by App.i18n.data(\'data\') and merged',
    '       with the structure from data.js by App.i18n.datos().',
    '   ============================================================ */',
    '(function () {',
    "  'use strict';",
    '',
    "  App.i18n.register({",
    '    data: ' + body + ',',
    uiEntries,
    "  }, '" + locale + "');",
    '',
    '})();',
    ''
  ];
  return header.join('\n');
}

/* Read the original strings.<locale>.js from HEAD (or current disk if
   HEAD doesn't have it) and extract the flat UI keys (top-level keys
   other than `data`). These are preserved through the split so that
   `App.i18n.t('title')` and similar UI calls keep resolving. */
function extractUiKeys(slug, locale) {
  var fsLocal = path.join(RAIZ, 'tools', slug, 'strings.' + locale + '.js');
  var src = null;
  /* Try git HEAD first: the original was overwritten by the bulk split. */
  try {
    var cp = require('child_process');
    var rel = path.relative(RAIZ, fsLocal).split(path.sep).join('/');
    var head = cp.execFileSync('git', ['show', 'HEAD:' + rel], { cwd: RAIZ, stdio: ['pipe', 'pipe', 'pipe'] });
    src = head.toString('utf8');
  } catch (e) {
    /* Fall back to current file if git is unavailable. */
    if (fs.existsSync(fsLocal)) src = fs.readFileSync(fsLocal, 'utf8');
  }
  if (!src) return {};
  /* Run the script in a sandbox that captures register()'s dict. */
  var captured = null;
  var out = {};
  var sandbox = {
    App: { i18n: { register: function (d, l) { if (l === locale) captured = d; } } },
    window: {},
    console: console
  };
  sandbox.window = sandbox;
  var vm = require('vm');
  vm.createContext(sandbox);
  try {
    vm.runInContext(src, sandbox, { filename: 'strings.' + locale + '.js' });
  } catch (e) {
    return out;
  }
  if (!captured || typeof captured !== 'object') return out;
  Object.keys(captured).forEach(function (k) {
    if (k === 'data') return;
    var v = captured[k];
    /* Only keep primitive (string/number/boolean) UI keys. */
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      out[k] = v;
    }
  });
  return out;
}

function refactor(slugOrPath, dryRun) {
  var slug = slugOrPath;
  /* Accept "tools/<slug>", "<slug>", "tools/<slug>/data.js", or abs path. */
  var m = slugOrPath.match(/(?:^|[\/\\])tools[\/\\]([^\\/]+?)(?:[\/\\]data\.js)?$/);
  if (m) slug = m[1];
  var data = loadData(slug);
  if (!data || !data.es || !data.en) {
    console.error('tools/' + slug + '/data.js: no tiene estructura {es, en}');
    return false;
  }
  /* Compare shapes between es and en. If they differ, refuse.
     Primitives (numbers/booleans/null) that differ across locales
     are NOT flagged — they're data (e.g. `correct: 2` vs `correct: 1`
     indexes an answer) and don't break the structural split.
     We compare shape-normalised trees so strings don't show up as
     "mismatches" (they always differ across locales). */
  var diffs = compareShapes(shape(data.es), shape(data.en));
  if (diffs.length) {
    console.error('tools/' + slug + '/data.js: formas es/en difieren:');
    diffs.slice(0, 20).forEach(function (d) { console.error('  ' + d); });
    if (diffs.length > 20) console.error('  ... ' + (diffs.length - 20) + ' más');
    return false;
  }
  /* Build neutral tree (from es, structure-only). */
  var neutralRoot = splitNode(data.es).neutral;
  var textRoot = splitNode(data.es).text;
  /* Render files. */
  var dataJs =
    '/* ============================================================\n' +
    '   Routime — Data: structure-only (no text).\n' +
    '   Locale-neutral data (ids, types, flags, pictograms) for the\n' +
    '   tool. The translated content lives in strings.es.js /\n' +
    '   strings.en.js, registered as { data: { ... } } per locale.\n' +
    '   For backward compatibility with the legacy app.js pattern\n' +
    '   `DATOS = DATA[App.i18n.locale()] || DATA.es`, the global\n' +
    '   DATA is re-bound at the end of this file to the legacy\n' +
    '   {es, en} shape via App.i18n.datos(). app.js does not need\n' +
    '   to change.\n' +
    '   ============================================================ */\n' +
    'var DATA = ' + renderNeutral(neutralRoot, 0) + ';\n' +
    '(function () {\n' +
    '  try {\n' +
    '    App.i18n.registerStructure(DATA);\n' +
    '    /* Rebuild the legacy {es, en} shape so app.js keeps working. */\n' +
    '    DATA = App.i18n.datos();\n' +
    '  } catch (e) { /* i18n not loaded yet; nothing to do */ }\n' +
    '})();\n';
  /* Preserve any UI keys that lived in the original strings.<locale>.js
     (title, instruccion, btnNormas, ...) so the app shell keeps working. */
  var uiKeysEs = extractUiKeys(slug, 'es');
  var uiKeysEn = extractUiKeys(slug, 'en');
  var stringsEs = renderStrings('es', textRoot, uiKeysEs);
  var stringsEn = renderStrings('en', textRoot, uiKeysEn);
  /* Write (unless --dry-run). */
  var baseDir = path.join(RAIZ, 'tools', slug);
  if (!fs.existsSync(path.dirname(baseDir))) {
    console.error('ruta inválida para tools/' + slug + ': ' + baseDir);
    return false;
  }
  if (dryRun) {
    console.log('--- tools/' + slug + '/data.js ---');
    console.log(dataJs);
    console.log('--- tools/' + slug + '/strings.es.js ---');
    console.log(stringsEs);
    console.log('--- tools/' + slug + '/strings.en.js ---');
    console.log(stringsEn);
    return true;
  }
  fs.writeFileSync(path.join(baseDir, 'data.js'), dataJs);
  fs.writeFileSync(path.join(baseDir, 'strings.es.js'), stringsEs);
  fs.writeFileSync(path.join(baseDir, 'strings.en.js'), stringsEn);
  console.log('OK tools/' + slug + ': data.js, strings.es.js, strings.en.js escritos');
  return true;
}

var args = process.argv.slice(2);
var dryRun = args.indexOf('--dry-run') !== -1;
var targets = args.filter(function (a) { return a !== '--dry-run'; });
if (targets.length === 0) {
  console.error('uso: node scripts/i18n-split.js <slug> [--dry-run]');
  process.exit(2);
}
var ok = true;
targets.forEach(function (slug) { if (!refactor(slug, dryRun)) ok = false; });
process.exit(ok ? 0 : 1);
