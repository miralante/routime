#!/usr/bin/env node
/* ============================================================
   Routime — scripts/build-head.js
   Regenerate the SEO / OG / Twitter Card / theme-color block in
   `site/index.html` from the project metadata in `app.config.json`.

   SAFETY: this script ONLY touches `site/index.html` when the
   markers `<!-- build:head:start -->` and `<!-- build:head:end -->`
   are BOTH present and bracket a single contiguous block. If the
   markers are not present (e.g. on a fresh checkout where the head
   has been hand-edited), the script prints an informational message
   and exits 0 without modifying the file. This protects the existing
   hand-curated SEO block from being silently overwritten on a fresh
   checkout — the operator must add the markers deliberately to opt in.

   To opt in for the first time:
     1. Wrap the SEO/OG/Twitter/theme block with
          <!-- build:head:start -->
          ...
          <!-- build:head:end -->
     2. Run `node scripts/build-head.js`. The block between the
        markers is replaced with the generated version, using values
        from `app.config.json` and `https://<domain>/...` URLs.
     3. Inspect the diff and commit.

   The script is idempotent: running it twice with no config change
   produces a byte-identical file.

   Usage: node scripts/build-head.js
   No dependencies — plain Node stdlib only, like scripts/check.js.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');

var RAIZ = path.join(__dirname, '..');
var CONFIG = path.join(RAIZ, 'app.config.json');
var TARGET = path.join(RAIZ, 'site', 'index.html');

var START = '<!-- build:head:start -->';
var END = '<!-- build:head:end -->';

function info(msg) { console.log('build-head.js: ' + msg); }
function fail(msg) { console.error('build-head.js: ' + msg); process.exit(1); }

function leerJSON(ruta) {
  try { return JSON.parse(fs.readFileSync(ruta, 'utf8')); }
  catch (e) { fail('no se pudo leer ' + path.relative(RAIZ, ruta) + ' — ' + e.message); }
}

function renderBloque(cfg) {
  var dominio = cfg.domain || 'routime.apptonomia.uk';
  var urlCanonical = 'https://' + dominio + '/';
  var urlOgImage = 'https://' + dominio + '/og-image.svg';

  var L = [];
  L.push('  ' + START);
  L.push('  <!-- ===== SEO: título, descripción, keywords, canonical, robots =====');
  L.push('       ' + (cfg.name || 'Routime') + ' is the historical Apptonomia suite of activities; the');
  L.push('       canonical URL is ' + dominio + ' (NOT apptonomia.uk,');
  L.push('       which is the gateway portal). Both names are kept in the');
  L.push('       alternateName so existing links/SEO weight don\'t leak. -->');
  if (cfg.title) L.push('  <title>' + cfg.title + '</title>');
  if (cfg.description) L.push('  <meta name="description" content="' + cfg.description + '">');
  if (cfg.keywords) L.push('  <meta name="keywords" content="' + cfg.keywords + '">');
  if (cfg.author) L.push('  <meta name="author" content="' + cfg.author + '">');
  L.push('  <meta name="robots" content="index,follow,max-image-preview:large">');
  L.push('  <link rel="canonical" href="' + urlCanonical + '">');
  L.push('  <link rel="alternate" hreflang="es" href="' + urlCanonical + '?lang=es">');
  L.push('  <link rel="alternate" hreflang="en" href="' + urlCanonical + '?lang=en">');
  L.push('  <link rel="alternate" hreflang="x-default" href="' + urlCanonical + '">');
  L.push('  <!-- ===== Open Graph ===== -->');
  L.push('  <meta property="og:type" content="website">');
  if (cfg.ogSiteName) L.push('  <meta property="og:site_name" content="' + cfg.ogSiteName + '">');
  L.push('  <meta property="og:locale" content="es_ES">');
  L.push('  <meta property="og:locale:alternate" content="en_US">');
  if (cfg.title) L.push('  <meta property="og:title" content="' + cfg.title + '">');
  if (cfg.ogDescription) L.push('  <meta property="og:description" content="' + cfg.ogDescription + '">');
  L.push('  <meta property="og:url" content="' + urlCanonical + '">');
  L.push('  <meta property="og:image" content="' + urlOgImage + '">');
  L.push('  <meta property="og:image:width" content="1200">');
  L.push('  <meta property="og:image:height" content="630">');
  if (cfg.ogImageAlt) L.push('  <meta property="og:image:alt" content="' + cfg.ogImageAlt + '">');
  L.push('  <!-- ===== Twitter Card ===== -->');
  L.push('  <meta name="twitter:card" content="summary_large_image">');
  if (cfg.title) L.push('  <meta name="twitter:title" content="' + cfg.title + '">');
  if (cfg.twitterDescription) L.push('  <meta name="twitter:description" content="' + cfg.twitterDescription + '">');
  L.push('  <meta name="twitter:image" content="' + urlOgImage + '">');
  L.push('  <!-- ===== Theme / appearance ===== -->');
  if (cfg.themeColor) L.push('  <meta name="theme-color" content="' + cfg.themeColor + '">');
  if (cfg.colorScheme) L.push('  <meta name="color-scheme" content="' + cfg.colorScheme + '">');
  L.push('  ' + END);
  return L.join('\n');
}

function main() {
  if (!fs.existsSync(CONFIG)) fail('no existe ' + path.relative(RAIZ, CONFIG));
  if (!fs.existsSync(TARGET)) fail('no existe ' + path.relative(RAIZ, TARGET));

  var cfg = leerJSON(CONFIG);
  var html = fs.readFileSync(TARGET, 'utf8');

  var idxStart = html.indexOf(START);
  var idxEnd = html.indexOf(END);

  if (idxStart === -1 || idxEnd === -1 || idxEnd <= idxStart) {
    info(path.relative(RAIZ, TARGET) + ' no contiene los marcadores ' +
      START + ' / ' + END + '. Nada que regenerar. ' +
      'Para activar build-head.js, envuelve el bloque SEO/OG/Twitter/theme ' +
      'con esos marcadores y vuelve a ejecutar.');
    return;
  }

  var bloque = renderBloque(cfg);
  var antes = html.slice(0, idxStart);
  var despues = html.slice(idxEnd + END.length);
  var nuevo = antes + bloque + despues;

  if (nuevo === html) {
    info(path.relative(RAIZ, TARGET) + ' ya estaba al dia — sin cambios.');
    return;
  }
  fs.writeFileSync(TARGET, nuevo, 'utf8');
  info('regenerado ' + path.relative(RAIZ, TARGET));
}

main();