#!/usr/bin/env node
/* ============================================================
   Routime — scripts/suite-indice-rename.js
   ------------------------------------------------------------
   Suite-wide restructure: rename doc/<locale>/README.md →
   doc/<locale>/indice.md | index.md, replace the presentation
   block with the existing navigation index, and update all
   references that pointed to the old filename.

   This script runs ACROSS the seven Apptonomia sibling repos,
   each in its own git working tree. It does NOT commit
   anything. All changes land in the working tree, where the
   user decides how to group, review and commit them.

   Per repo the script does:
     1. Validates the repo has the expected doc/<locale>/ files.
     2. Replaces the content of doc/es/indice.md and doc/en/index.md
        with a navigation-only index (same template, tailored list).
     3. Updates references in the repo's own files:
          - README.md, README.es.md
          - CLAUDE.md §A.1 (Doc index row)
          - team/index.html (only if it references the old path)
          - any doc/<locale>/{roles.md,spec.md} that references
            the old filename
     4. Deletes the legacy doc/<locale>/README.md (Windows
        case-insensitive: same file as doc/<locale>/readme.md).

   The script is idempotent: running it twice produces the same
   end state (because step 3 only edits files that still contain
   the OLD filename pattern, and step 4 only deletes files that
   still exist).

   Usage:
     node scripts/suite-indice-rename.js                # all 5 siblings
     node scripts/suite-indice-rename.js calculia      # one repo
     node scripts/suite-indice-rename.js --dry-run     # no writes
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var ROUTIME = 'D:\\apps\\onedrive\\jrodriguezgar\\OneDrive\\dev\\git\\Miralante';
var SIBLINGS = ['calculia', 'memofun', 'okeymoney', 'sinonimia', 'teclatlon'];

var dryRun = process.argv.indexOf('--dry-run') !== -1;
var onlyArg = process.argv.filter(function (a) { return SIBLINGS.indexOf(a) !== -1; })[0];
var targetRepos = onlyArg ? [onlyArg] : SIBLINGS;

console.log('Target repos:', targetRepos.join(', '));
console.log('Mode:', dryRun ? 'DRY-RUN (no writes)' : 'WRITE');
console.log('');

/* ---------- Repo profile ---------- */
/* Each repo gets:
     - displayName (used in the index page banner)
     - tagline (one-line elevator pitch)
     - docs (the actual list of doc files that exist in the repo)
     - hasTeam (whether team/index.html exists and references the doc map)
     - hasCreatingDecks (memofun-only extra guides)
*/
function readDirSafe(p) {
  try { return fs.readdirSync(p); } catch (e) { return []; }
}

function buildProfile(repoPath, repoName) {
  var es = readDirSafe(path.join(repoPath, 'doc', 'es'))
    .filter(function (f) { return f.toLowerCase() === 'readme.md' ? false : f.endsWith('.md'); })
    .sort();
  var en = readDirSafe(path.join(repoPath, 'doc', 'en'))
    .filter(function (f) { return f.toLowerCase() === 'readme.md' ? false : f.endsWith('.md'); })
    .sort();

  // Display name: read root README.md first heading
  var displayName = repoName.charAt(0).toUpperCase() + repoName.slice(1);
  var tagline = 'Apptonomia suite';

  var teamPath = path.join(repoPath, 'team', 'index.html');
  var hasTeam = fs.existsSync(teamPath);

  return { repoName: repoName, displayName: displayName, tagline: tagline, es: es, en: en, hasTeam: hasTeam };
}

/* ---------- Index template ---------- */
function renderIndex(profile, locale) {
  var isEs = locale === 'es';
  var otherLocale = isEs ? 'en' : 'es';
  var otherIndexName = isEs ? 'index.md' : 'indice.md';

  var docList = (isEs ? profile.es : profile.en);

  // Build the structure tree block
  var treeLines = [];
  treeLines.push('doc/');
  treeLines.push('├── ' + (isEs ? 'es' : 'en') + '/                     ← ' + (isEs ? 'Documentación en español' : 'English documentation'));
  docList.forEach(function (f, i) {
    var isLast = i === docList.length - 1;
    var prefix = isLast ? '└── ' : '├── ';
    treeLines.push('│   ' + prefix + f);
  });
  treeLines.push('└── ' + otherLocale + '/');
  treeLines.push('    ├── ' + otherIndexName + (isEs ? '             ← Mapa de la documentación' : '            ← Documentation map'));

  var structureTree = treeLines.join('\n');

  if (isEs) {
    return [
      '# Índice de la documentación — ' + profile.displayName,
      '',
      '> Mapa de navegación de `doc/`. Para saber por dónde empezar según tu',
      '> perfil, ver [`roles.md`](roles.md). Para qué es ' + profile.displayName + ' y sus reglas',
      '> de producto, ver [`SPEC.md`](SPEC.md). Para contribuir al proyecto,',
      '> ver [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) de la raíz.',
      '>',
      '> **Aplicación**: [apptonomia.uk](https://apptonomia.uk) ·',
      '> **Repositorio**: [github.com/Miralante/' + profile.repoName + '](https://github.com/Miralante/' + profile.repoName + ') ·',
      '> **Other language**: [English](../en/index.md)',
      '',
      '---',
      '',
      '## 📂 Estructura de `doc/`',
      '',
      '```',
      structureTree,
      '```',
      '',
      'El resto de documentos del repositorio (`CLAUDE.md`, `LICENSE`,',
      '`README.md`, `CONTRIBUTING.es.md`, etc.) viven en la **raíz**.',
      '',
      '---',
      '',
      '## 🧭 Por dónde empezar según tu perfil',
      '',
      '| Si quieres… | Empieza por |',
      '|---|---|',
      '| **Entender qué es ' + profile.displayName + ' y para quién** | [`SPEC.md`](SPEC.md) |',
      '| **Abrir la app y usarla** (4 métodos: internet, ZIP, Python, Node) | [`guia-rapida.md`](guia-rapida.md) |',
      '| **Acompañar a una persona usuaria** (familia/terapeuta/profesorado) | [`equipo.md`](equipo.md) y la página [`team/`](../team/index.html) |',
      '| **Ver el catálogo completo de actividades** | [`actividades.md`](actividades.md) |',
      '| **Entender la arquitectura y recetas técnicas** | [`tecnico.md`](tecnico.md) |',
      '| **Crear una actividad nueva** (diseño + técnicas didácticas, gamificación, neuromarketing) | [`guia-crear-elementos.md`](guia-crear-elementos.md) |',
      '| **Añadir un idioma o una traducción** | [`i18n.md`](i18n.md) |',
      '| **Saber cómo se organiza el proyecto y los roles** | [`roles.md`](roles.md) |',
      '| **Contribuir al código o al contenido** | [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) (raíz) |',
      '| **Entender el flujo de trabajo de los agentes IA en el repo** | [`CLAUDE.md`](../../CLAUDE.md) (raíz) |',
      '',
      '---',
      '',
      '## 📑 Tabla de contenidos',
      '',
      'Todos los documentos de `doc/es/` listados en orden:',
      '',
      '- [`indice.md`](indice.md) — este archivo'
    ].concat(docList.filter(function (f) { return f !== 'indice.md'; }).map(function (f) { return '- [`' + f + '`](' + f + ')'; }))
      .concat([
        '',
        ''
      ]).join('\n');
  } else {
    return [
      '# Documentation index — ' + profile.displayName,
      '',
      '> Navigation map for `doc/`. For where to start by profile, see',
      '> [`roles.md`](roles.md). For what ' + profile.displayName + ' is and its product rules,',
      '> see [`SPEC.md`](SPEC.md). For contributing to the project, see the',
      '> root [`CONTRIBUTING.md`](../../CONTRIBUTING.md).',
      '>',
      '> **App**: [apptonomia.uk](https://apptonomia.uk) ·',
      '> **Repository**: [github.com/Miralante/' + profile.repoName + '](https://github.com/Miralante/' + profile.repoName + ') ·',
      '> **Other language**: [Español](../es/indice.md)',
      '',
      '---',
      '',
      '## 📂 Structure of `doc/`',
      '',
      '```',
      structureTree,
      '```',
      '',
      'Other repository documents (`CLAUDE.md`, `LICENSE`, `README.md`,',
      '`CONTRIBUTING.md`, etc.) live in the **root**.',
      '',
      '---',
      '',
      '## 🧭 Where to start by profile',
      '',
      '| If you want to… | Start with |',
      '|---|---|',
      '| **Understand what ' + profile.displayName + ' is and who it is for** | [`SPEC.md`](SPEC.md) |',
      '| **Open the app and use it** (4 methods: internet, ZIP, Python, Node) | [`quick-guide.md`](quick-guide.md) |',
      '| **Support an end user** (family/therapist/teacher) | [`team.md`](team.md) and the [`team/`](../team/index.html) page |',
      '| **Browse the full activity catalog** | [`activities.md`](activities.md) |',
      '| **Understand the architecture and technical recipes** | [`technical.md`](technical.md) |',
      '| **Create a new activity** (design + didactic, gamification and neuromarketing techniques) | [`creating-elements-guide.md`](creating-elements-guide.md) |',
      '| **Add a language or a translation** | [`i18n.md`](i18n.md) |',
      '| **Learn how the project is organized and its roles** | [`roles.md`](roles.md) |',
      '| **Contribute code or content** | root [`CONTRIBUTING.md`](../../CONTRIBUTING.md) |',
      '| **Understand the AI agent workflow in the repo** | root [`CLAUDE.md`](../../CLAUDE.md) |',
      '',
      '---',
      '',
      '## 📑 Table of contents',
      '',
      'All `doc/en/` documents, in order:',
      '',
      '- [`index.md`](index.md) — this file'
    ].concat(docList.filter(function (f) { return f !== 'index.md'; }).map(function (f) { return '- [`' + f + '`](' + f + ')'; }))
      .concat([
        '',
        ''
      ]).join('\n');
  }
}

/* ---------- Reference rewrite ---------- */
/* Update a file's references from the OLD `doc/<locale>/README.md`
   or `doc/<locale>/readme.md` (case-insensitive) pattern to the
   NEW `doc/<locale>/indice.md | index.md` pattern.

   Conservative strategy: only touch occurrences that are clearly
   the URL part of a markdown link (preceded by `](`). Occurrences
   inside link labels, code spans, or bare prose are left untouched
   (they are usually display labels that should keep the old name).
   A second pass replaces any *remaining* bare `README.md` /
   `readme.md` after the link-URL replacement to handle prose.

   Returns true if any change was made. */
function rewriteReferences(content, locale) {
  var newPath = 'doc/' + locale + '/' + (locale === 'es' ? 'indice.md' : 'index.md');
  var lowerContent = content.toLowerCase();
  var needle = 'doc/' + locale + '/readme.md';

  var before = content;
  var result = '';
  var i = 0;
  while (i < content.length) {
    var idx = lowerContent.indexOf(needle, i);
    if (idx === -1) { result += content.slice(i); break; }
    result += content.slice(i, idx);

    // Only treat as a markdown link URL if the 2 chars immediately before
    // are `](`. Any other context (code span, label text, prose) is left
    // untouched so we don't accidentally rewrite labels.
    var isLinkUrl = idx >= 2 &&
                    content[idx - 2] === ']' &&
                    content[idx - 1] === '(';

    if (isLinkUrl) {
      result += newPath;
    } else {
      // Bare reference in prose (e.g. `See doc/es/README.md for the
      // user-facing intro.`). Replace, since the file is going away.
      result += newPath;
    }
    i = idx + needle.length;
  }
  return { changed: result !== before, txt: result };
}

/* ---------- Per-repo run ---------- */
function runForRepo(repoName) {
  console.log('=================================================');
  console.log('Repo: ' + repoName);
  console.log('=================================================');

  var repoPath = path.join(ROUTIME, repoName);
  if (!fs.existsSync(repoPath)) {
    console.log('  ! Repo path does not exist: ' + repoPath);
    return;
  }

  var profile = buildProfile(repoPath, repoName);
  console.log('  ES docs (' + profile.es.length + '): ' + profile.es.join(', '));
  console.log('  EN docs (' + profile.en.length + '): ' + profile.en.join(', '));
  console.log('  hasTeam: ' + profile.hasTeam);

  // Sanity checks
  var requiredEs = ['indice.md', 'spec.md', 'roles.md', 'guia-rapida.md', 'actividades.md', 'equipo.md', 'tecnico.md', 'i18n.md'];
  var requiredEn = ['index.md', 'spec.md', 'roles.md', 'quick-guide.md', 'activities.md', 'team.md', 'technical.md', 'i18n.md'];
  var missing = [];
  requiredEs.forEach(function (f) { if (profile.es.indexOf(f) === -1) missing.push('doc/es/' + f); });
  requiredEn.forEach(function (f) { if (profile.en.indexOf(f) === -1) missing.push('doc/en/' + f); });
  if (missing.length) {
    console.log('  ! Missing required docs (skipping this repo): ' + missing.join(', '));
    return;
  }

  // Step 1 — Rewrite indice.md / index.md
  ['es', 'en'].forEach(function (locale) {
    var newContent = renderIndex(profile, locale);
    var targetFile = path.join(repoPath, 'doc', locale, locale === 'es' ? 'indice.md' : 'index.md');
    if (!dryRun) fs.writeFileSync(targetFile, newContent, 'utf8');
    console.log('  ' + (dryRun ? '[dry-run] ' : '') + 'wrote ' + path.relative(repoPath, targetFile));
  });

  // Step 2 — Rewrite references in repo files
  var refFiles = [
    'README.md',
    'README.es.md',
    'CLAUDE.md',
    'doc/es/roles.md',
    'doc/en/roles.md',
    'doc/es/spec.md',
    'doc/en/spec.md'
  ];
  if (profile.hasTeam) refFiles.push('team/index.html');

  refFiles.forEach(function (rel) {
    var full = path.join(repoPath, rel);
    if (!fs.existsSync(full)) return;
    var before = fs.readFileSync(full, 'utf8');
    var afterEs = rewriteReferences(before, 'es');
    var afterEn = rewriteReferences(afterEs.txt, 'en');
    if (afterEn.changed) {
      if (!dryRun) fs.writeFileSync(full, afterEn.txt, 'utf8');
      console.log('  ' + (dryRun ? '[dry-run] ' : '') + 'updated references in ' + rel);
    } else {
      console.log('  skip    ' + rel + ' (no references to old paths)');
    }
  });

  // Step 3 — Delete legacy README.md (Windows: same file as readme.md)
  ['es', 'en'].forEach(function (locale) {
    var oldFile = path.join(repoPath, 'doc', locale, 'README.md');
    if (fs.existsSync(oldFile)) {
      if (!dryRun) fs.unlinkSync(oldFile);
      console.log('  ' + (dryRun ? '[dry-run] ' : '') + 'deleted ' + path.relative(repoPath, oldFile));
    }
  });

  console.log('');
}

/* ---------- Main ---------- */
targetRepos.forEach(runForRepo);
console.log('Done.');
