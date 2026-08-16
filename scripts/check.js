#!/usr/bin/env node
/* ============================================================
   Routime — scripts/check.js
   Structural check with no dependencies (plain Node only).
   Usage: node scripts/check.js
   Checks:
   1. That every .js file in tools/, site/ and assets/js/ parses
      (equivalent to `node --check`).
   2. That every tools/<slug>/ has the canonical files:
      index.html, app.js, data.js, strings.es.js, strings.en.js, styles.css.
   3. sw.js <-> disk parity: every ARCHIVOS path exists, and every
      tool file is listed in ARCHIVOS.
   4. es/en key parity between strings.es.js and strings.en.js.
   5. Catalog parity: every tools/<slug>/ has a card in
      site/index.html (href="../tools/<slug>/") and vice versa.
   6. Parity with team/: the cover name (site/index.html) of
      each activity also appears in team/index.html.
   7. Synced counts: the "## Activities (N)" number in
      README.md (ES) and the "(N activities)" comment in
      doc/es/tecnico.md match the real number of folders in tools/.
   8. Lint for the pattern that broke la-frase/palabras: if data.js
      splits { es, en } at the top level (without a top-level
      porRonda) and app.js uses the DATA.porRonda literal instead of
      banco().porRonda, it's almost certainly the same bug (comparing
      against undefined never ends the round).
   9. _headers: if a Content-Security-Policy line exists, every quoted
      source expression (e.g. 'self') has exactly one leading and one
      trailing quote — catches malformed quoting like ''self'' that
      browsers silently drop, turning a directive into "block
      everything" (this is why teclatlon's CSP was silently broken;
      see the sibling repo's CLOUDFLARE.md). Routime's _headers has
      no CSP line by design, so this check does not require one to
      exist — it only validates whatever is actually there.
   Output: list of failures with the exact file. Exit code 1 if there
   are any, "OK (N checks)" otherwise.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var execFileSync = require('child_process').execFileSync;

var RAIZ = path.join(__dirname, '..');
var fallos = [];
var checks = 0;

function rel(p) {
  return path.relative(RAIZ, p).split(path.sep).join('/');
}

function listarJs(dir) {
  var out = [];
  (function recorrer(actual) {
    var entradas = fs.readdirSync(actual, { withFileTypes: true });
    entradas.forEach(function (entrada) {
      var full = path.join(actual, entrada.name);
      if (entrada.isDirectory()) {
        recorrer(full);
      } else if (entrada.isFile() && entrada.name.endsWith('.js')) {
        out.push(full);
      }
    });
  })(dir);
  return out;
}

/* --- 1. node --check on tools/, site/, assets/js/ --- */
var archivosJs = []
  .concat(listarJs(path.join(RAIZ, 'tools')))
  .concat(listarJs(path.join(RAIZ, 'site')))
  .concat(listarJs(path.join(RAIZ, 'assets', 'js')))
  .concat(listarJs(path.join(RAIZ, 'settings')))
  .concat(listarJs(path.join(RAIZ, 'about')))
  .concat(listarJs(path.join(RAIZ, 'team')))
  .concat(listarJs(path.join(RAIZ, 'legal')));

archivosJs.forEach(function (archivo) {
  checks += 1;
  try {
    execFileSync(process.execPath, ['--check', archivo], { stdio: 'pipe' });
  } catch (e) {
    fallos.push(rel(archivo) + ': no parsea (node --check) — ' +
      (e.stderr ? e.stderr.toString().trim().split('\n')[0] : e.message));
  }
});

/* --- 2. Standard anatomy of tools/<slug>/ ---
   Strings are now split by language (strings.es.js + strings.en.js)
   instead of a single monolithic strings.js. */
var CANONICOS_BASE = ['index.html', 'app.js', 'data.js', 'styles.css'];
var STRING_LOCALES = ['es', 'en'];
var toolsDir = path.join(RAIZ, 'tools');
var slugs = fs.readdirSync(toolsDir, { withFileTypes: true })
  .filter(function (e) { return e.isDirectory(); })
  .map(function (e) { return e.name; })
  .sort();

slugs.forEach(function (slug) {
  checks += 1;
  var dir = path.join(toolsDir, slug);
  var archivos = fs.readdirSync(dir);
  var faltanBase = CANONICOS_BASE.filter(function (c) { return archivos.indexOf(c) === -1; });
  var faltanStrings = STRING_LOCALES
    .map(function (loc) { return 'strings.' + loc + '.js'; })
    .filter(function (f) { return archivos.indexOf(f) === -1; });
  var esperados = CANONICOS_BASE.concat(STRING_LOCALES.map(function (loc) { return 'strings.' + loc + '.js'; }));
  var sobran = archivos.filter(function (a) { return esperados.indexOf(a) === -1; });
  if (faltanBase.length || faltanStrings.length || sobran.length) {
    var detalle = [];
    if (faltanBase.length) detalle.push('faltan base: ' + faltanBase.join(', '));
    if (faltanStrings.length) detalle.push('faltan strings: ' + faltanStrings.join(', '));
    if (sobran.length) detalle.push('sobran: ' + sobran.join(', '));
    fallos.push('tools/' + slug + '/: ' + detalle.join('; '));
  }
});

/* --- 3. sw.js <-> disk parity ---
   sw.js must list both strings.es.js and strings.en.js per activity. */
checks += 1;
var swContenido = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
var matchArchivos = swContenido.match(/var ARCHIVOS = \[([\s\S]*?)\];/);
var rutasSw = [];
if (matchArchivos) {
  var re = /'([^']+)'/g;
  var m;
  while ((m = re.exec(matchArchivos[1])) !== null) {
    rutasSw.push(m[1]);
  }
} else {
  fallos.push('sw.js: no se ha encontrado el array ARCHIVOS');
}

rutasSw.forEach(function (ruta) {
  if (ruta === './') return;
  var full = path.join(RAIZ, ruta.replace(/^\.\//, ''));
  if (!fs.existsSync(full)) {
    fallos.push('sw.js: ARCHIVOS incluye ' + ruta + ' pero no existe en disco');
  }
});

slugs.forEach(function (slug) {
  CANONICOS_BASE.concat(STRING_LOCALES.map(function (loc) { return 'strings.' + loc + '.js'; }))
    .forEach(function (archivo) {
      var ruta = './tools/' + slug + '/' + archivo;
      if (rutasSw.indexOf(ruta) === -1) {
        fallos.push('sw.js: falta ' + ruta + ' en ARCHIVOS');
      }
    });
});

/* --- 4. es/en key parity between strings.es.js and strings.en.js --- */
function extraerDictDeStrings(archivo, locale) {
  // archivo = strings.es.js or strings.en.js; locale = 'es' or 'en' (the file's own)
  var capturado = null;
  var sandbox = {
    App: {
      i18n: {
        register: function (dict, loc) {
          // Accepts both signatures: legacy ({es:...,en:...}) and new (dict, locale)
          if (typeof loc === 'string') {
            capturado = dict;
          } else if (dict && dict.es) {
            capturado = dict.es; // legacy signature; only use one
            if (locale === 'en' && dict.en) capturado = dict.en;
          }
        }
      }
    },
    window: {}
  };
  sandbox.window = sandbox;
  try {
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(archivo, 'utf8'), sandbox, { filename: archivo });
  } catch (e) {
    return null;
  }
  return capturado;
}

function clavesPlanas(obj, prefijo) {
  var out = [];
  Object.keys(obj || {}).forEach(function (k) {
    var clave = prefijo ? prefijo + '.' + k : k;
    var valor = obj[k];
    if (valor && typeof valor === 'object' && !Array.isArray(valor)) {
      out = out.concat(clavesPlanas(valor, clave));
    } else {
      out.push(clave);
    }
  });
  return out;
}

slugs.forEach(function (slug) {
  var archivoEs = path.join(toolsDir, slug, 'strings.es.js');
  var archivoEn = path.join(toolsDir, slug, 'strings.en.js');
  if (!fs.existsSync(archivoEs) || !fs.existsSync(archivoEn)) return;
  checks += 1;
  var dictEs = extraerDictDeStrings(archivoEs, 'es');
  var dictEn = extraerDictDeStrings(archivoEn, 'en');
  if (!dictEs || !dictEn) {
    fallos.push('tools/' + slug + '/: no se han podido extraer los dicts es/en');
    return;
  }
  var clavesEs = clavesPlanas(dictEs, '').sort();
  var clavesEn = clavesPlanas(dictEn, '').sort();
  var soloEs = clavesEs.filter(function (c) { return clavesEn.indexOf(c) === -1; });
  var soloEn = clavesEn.filter(function (c) { return clavesEs.indexOf(c) === -1; });
  if (soloEs.length || soloEn.length) {
    var detalle = [];
    if (soloEs.length) detalle.push('solo en es: ' + soloEs.join(', '));
    if (soloEn.length) detalle.push('solo en en: ' + soloEn.join(', '));
    fallos.push('tools/' + slug + '/: ' + detalle.join('; '));
  }
});

/* --- 4b. es/en key parity for the hidden routes (settings/, about/,
   team/, legal/), which follow the same strings.<locale>.js pattern as tools/. --- */
['settings', 'about', 'team', 'legal'].forEach(function (ruta) {
  var archivoEs = path.join(RAIZ, ruta, 'strings.es.js');
  var archivoEn = path.join(RAIZ, ruta, 'strings.en.js');
  if (!fs.existsSync(archivoEs) || !fs.existsSync(archivoEn)) return;
  checks += 1;
  var dictEs = extraerDictDeStrings(archivoEs, 'es');
  var dictEn = extraerDictDeStrings(archivoEn, 'en');
  if (!dictEs || !dictEn) {
    fallos.push(ruta + '/: no se han podido extraer los dicts es/en');
    return;
  }
  var clavesEs = clavesPlanas(dictEs, '').sort();
  var clavesEn = clavesPlanas(dictEn, '').sort();
  var soloEs = clavesEs.filter(function (c) { return clavesEn.indexOf(c) === -1; });
  var soloEn = clavesEn.filter(function (c) { return clavesEs.indexOf(c) === -1; });
  if (soloEs.length || soloEn.length) {
    var detalle = [];
    if (soloEs.length) detalle.push('solo en es: ' + soloEs.join(', '));
    if (soloEn.length) detalle.push('solo en en: ' + soloEn.join(', '));
    fallos.push(ruta + '/: ' + detalle.join('; '));
  }
});

/* --- 5. Catalog parity with site/index.html --- */
checks += 1;
var siteHtml = fs.readFileSync(path.join(RAIZ, 'site', 'index.html'), 'utf8');
var slugsEnSite = [];
var reHref = /href="\.\.\/tools\/([^/]+)\/index\.html"/g;
var mh;
while ((mh = reHref.exec(siteHtml)) !== null) {
  slugsEnSite.push(mh[1]);
}

slugs.forEach(function (slug) {
  if (slugsEnSite.indexOf(slug) === -1) {
    fallos.push('site/index.html: falta la tarjeta de tools/' + slug + '/');
  }
});
slugsEnSite.forEach(function (slug) {
  if (slugs.indexOf(slug) === -1) {
    fallos.push('site/index.html: tiene tarjeta de tools/' + slug + '/ pero esa carpeta no existe');
  }
});

/* --- 6. Parity with team/: the cover name of each card
   from site/index.html must also appear in team/index.html. */
checks += 1;
var teamHtml = fs.readFileSync(path.join(RAIZ, 'team', 'index.html'), 'utf8');
var reTarjeta = /<a href="\.\.\/tools\/([^/]+)\/index\.html" class="tarjeta">[\s\S]*?<span class="nombre"[^>]*>([^<]+)<\/span>/g;
var mt;
while ((mt = reTarjeta.exec(siteHtml)) !== null) {
  var nombrePortada = mt[2].trim();
  if (teamHtml.indexOf(nombrePortada) === -1) {
    fallos.push('team/index.html: falta "' + nombrePortada + '" (tools/' + mt[1] + '), o el texto no coincide exactamente');
  }
}

/* --- 7. Synced counts: doc/es/tecnico.md and doc/en/technical.md
   must state the real number of folders in tools/ (via
   "(N actuales)" in their §2.2). --- */
['es', 'en'].forEach(function (loc) {
  checks += 1;
  var ruta = path.join(RAIZ, 'doc', loc, loc === 'es' ? 'tecnico.md' : 'technical.md');
  if (!fs.existsSync(ruta)) return;
  var txt = fs.readFileSync(ruta, 'utf8');
  // ES uses "(N actuales)", EN uses "(N current)" (same meaning, different word)
  var m = txt.match(/\((\d+) (?:actuales|current)\)/);
  if (!m) {
    fallos.push('doc/' + loc + '/' + (loc === 'es' ? 'tecnico' : 'technical') +
                '.md: no se encontró "(N actuales)" / "(N current)"');
  } else if (Number(m[1]) !== slugs.length) {
    fallos.push('doc/' + loc + '/' + (loc === 'es' ? 'tecnico' : 'technical') +
                '.md: dice ' + m[1] + ', pero tools/ tiene ' + slugs.length);
  }
});

/* --- 8. Lint for the pattern that broke la-frase/palabras: if data.js
   splits { es, en } at the top level (without a top-level porRonda) +
   app.js uses the DATA.porRonda literal instead of banco().porRonda. */
slugs.forEach(function (slug) {
  var dataFile = path.join(toolsDir, slug, 'data.js');
  var appFile = path.join(toolsDir, slug, 'app.js');
  if (!fs.existsSync(dataFile) || !fs.existsSync(appFile)) return;
  checks += 1;
  var appTxt = fs.readFileSync(appFile, 'utf8');
  if (!/\bDATA\.porRonda\b/.test(appTxt)) return;
  var sandboxD = { window: {} };
  sandboxD.window = sandboxD;
  var datos;
  try {
    vm.createContext(sandboxD);
    vm.runInContext(
      fs.readFileSync(dataFile, 'utf8') + '\nthis.__CHECK_DATA__ = (typeof DATA !== "undefined") ? DATA : undefined;',
      sandboxD, { filename: dataFile }
    );
    datos = sandboxD.__CHECK_DATA__;
  } catch (e) { return; }
  if (datos && datos.es && typeof datos.es === 'object' && typeof datos.porRonda === 'undefined') {
    fallos.push('tools/' + slug + '/app.js: usa DATA.porRonda pero data.js separa { es, en } sin porRonda de nivel superior — usar banco().porRonda (ver bug real en la-frase/palabras)');
  }
});

/* --- 9. Catalog parity lock.
   The set of activity slugs must match between:
     - tools/ folders on disk (source of truth)
     - the landing cards (<a href="../tools/...">) in site/index.html
     - the progress rows (data-tool="<slug>") in settings/index.html
     - the assets listed for tools in sw.js ARCHIVOS
   This guards against the historic drift (Spanish folder names left
   over, missing new activities, missing one in sw.js cache, etc.).
*/
checks += 1;
function setDiff(base, otros) {
  var resultado = {};
  Object.keys(otros).forEach(function (clave) {
    var solo = otros[clave].filter(function (s) { return base.indexOf(s) === -1; });
    resultado[clave] = solo.sort();
  });
  return resultado;
}
var slugsSet = new Set(slugs);
var siteSet = new Set(slugsEnSite);

function parsearSlugsDeSw() {
  var txt = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
  var matches = txt.match(/'\.\/tools\/([^/]+)\//g) || [];
  var set = new Set();
  matches.forEach(function (m) {
    var slug = m.replace(/'.\/tools\//, '').replace(/\//, '');
    set.add(slug);
  });
  return set;
}
function parsearDataToolInSettings() {
  var html = fs.readFileSync(path.join(RAIZ, 'settings', 'index.html'), 'utf8');
  var re = /data-tool="([^"]+)"/g;
  var set = new Set();
  var m;
  while ((m = re.exec(html)) !== null) set.add(m[1]);
  return set;
}
var swSet = parsearSlugsDeSw();
var settingsSet = parsearDataToolInSettings();
var destinos = { site: siteSet, settings: settingsSet, sw: swSet };
Object.keys(destinos).forEach(function (f) {
  var targetSet = destinos[f];
  var faltan = [];
  var sobran = [];
  slugs.forEach(function (slug) { if (!targetSet.has(slug)) faltan.push(slug); });
  targetSet.forEach(function (slug) {
    if (!slugsSet.has(slug)) sobran.push(slug);
  });
  if (faltan.length) {
    faltan.forEach(function (s) { fallos.push('catálogo: ' + f + ' no contiene el slug "' + s + '"'); });
  }
  if (sobran.length) {
    sobran.forEach(function (s) { fallos.push('catálogo: ' + f + ' contiene slug inexistente "' + s + '"'); });
  }
});
// siteSet queda como referencia del chequeo anterior; el de catálogo se
// resuelve en el bucle superior.

/* --- 9. _headers: comillado de las expresiones de origen del CSP --- */
checks += 1;
var contenidoHeaders = fs.readFileSync(path.join(RAIZ, '_headers'), 'utf8');
contenidoHeaders.split('\n').filter(function (linea) {
  return /^\s*Content-Security-Policy:/i.test(linea);
}).forEach(function (linea) {
  var valor = linea.replace(/^\s*Content-Security-Policy:/i, '');
  valor.split(';').forEach(function (directiva) {
    directiva.trim().split(/\s+/).filter(Boolean).forEach(function (token) {
      var numComillas = (token.match(/'/g) || []).length;
      if (numComillas === 0) return;
      var bienFormado = numComillas === 2 && token[0] === "'" && token[token.length - 1] === "'";
      if (!bienFormado) {
        fallos.push('_headers: expresión de origen CSP mal formada "' + token +
          '" — las comillas deben envolver la palabra clave una sola vez (p. ej. \'self\', no \'\'self\'\')');
      }
    });
  });
});

/* --- Result --- */
if (fallos.length) {
  console.log('FALLOS (' + fallos.length + '):');
  fallos.forEach(function (f) { console.log('  - ' + f); });
  process.exitCode = 1;
} else {
  console.log('OK (' + checks + ' checks)');
}
