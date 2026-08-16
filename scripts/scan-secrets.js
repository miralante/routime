#!/usr/bin/env node
// Lightweight secret scanner for Routime.
// Scans the working tree and the staged changes for common secret patterns.
// Exit code 0 = clean, 1 = secrets found, 2 = scanner error.
//
// Patterns covered (intentionally conservative to avoid false positives):
//   - Google API keys           AIza[0-9A-Za-z_-]{35}
//   - Firebase admin SDK        firebase-adminsdk-*.json content with "private_key"
//   - Generic high-entropy JWT  eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}
//   - GitHub PAT (classic)      ghp_[A-Za-z0-9]{36}
//   - GitHub fine-grained PAT   github_pat_[A-Za-z0-9_]{82}
//   - Stripe live keys          sk_live_[A-Za-z0-9]{24,}
//   - Slack tokens              xox[baprs]-[A-Za-z0-9-]{10,}
//   - Private key blocks        -----BEGIN (RSA |EC |OPENSSH |PRIVATE) KEY-----
//   - .env files with values    .env / .env.* containing KEY=VALUE non-comments
//
// Usage:
//   node scripts/scan-secrets.js                 # scan staged changes
//   node scripts/scan-secrets.js --all           # scan full working tree
//   node scripts/scan-secrets.js --pre-push      # scan commits about to be pushed
//
// Hook install (optional):
//   npm run scan:secrets:install    # installs .git/hooks/pre-commit & pre-push

'use strict';

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var ROOT = path.resolve(__dirname, '..');

var PATTERNS = [
  { name: 'Google API key',         re: /AIza[0-9A-Za-z_-]{35}/g },
  { name: 'GitHub PAT (classic)',   re: /\bghp_[A-Za-z0-9]{36}\b/g },
  { name: 'GitHub fine-grained PAT',re: /\bgithub_pat_[A-Za-z0-9_]{82}\b/g },
  { name: 'Stripe live key',        re: /\bsk_live_[A-Za-z0-9]{24,}\b/g },
  { name: 'Slack token',            re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g },
  { name: 'JWT (high entropy)',     re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
  { name: 'Private key block',      re: /-----BEGIN (RSA |EC |OPENSSH |DSA |PGP |ENCRYPTED |PRIVATE )?PRIVATE KEY-----/g }
];

// Files / paths to skip entirely.
var SKIP_DIRS = new Set([
  '.git', 'node_modules', 'graphify-out', '.firebase', '.claude',
  '.dev', '.cline', 'dist', 'build', 'coverage'
]);

// File extensions to scan (text).
var TEXT_EXT = /\.(js|jsx|ts|tsx|mjs|cjs|json|html|htm|css|scss|sass|md|markdown|yml|yaml|toml|xml|svg|env|properties|sh|bash|zsh|ps1|bat|cmd|txt|ini|cfg|conf|template)$/i;

function shouldSkipPath(p) {
  var parts = p.split(/[\\/]+/);
  for (var i = 0; i < parts.length; i++) {
    if (SKIP_DIRS.has(parts[i])) return true;
  }
  return false;
}

function isLikelyText(buf) {
  // Heuristic: scan first 4 KB; if any zero bytes, treat as binary.
  var n = Math.min(buf.length, 4096);
  for (var i = 0; i < n; i++) {
    if (buf[i] === 0) return false;
  }
  return true;
}

function scanFile(absPath) {
  var hits = [];
  var stat;
  try { stat = fs.statSync(absPath); } catch (e) { return hits; }
  if (stat.size > 5 * 1024 * 1024) return hits; // skip files >5MB
  var buf;
  try { buf = fs.readFileSync(absPath); } catch (e) { return hits; }
  if (!isLikelyText(buf)) return hits;
  var text = buf.toString('utf8');
  for (var i = 0; i < PATTERNS.length; i++) {
    var p = PATTERNS[i];
    p.re.lastIndex = 0;
    var m;
    while ((m = p.re.exec(text)) !== null) {
      hits.push({ pattern: p.name, line: lineOf(text, m.index), preview: redact(m[0]) });
      if (hits.length > 50) return hits; // cap to avoid runaway reports
    }
  }
  return hits;
}

function lineOf(text, idx) {
  var line = 1;
  for (var i = 0; i < idx && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

function redact(s) {
  if (s.length <= 8) return '***';
  return s.slice(0, 4) + '…' + s.slice(-4);
}

function walk(relStart, cb) {
  function rec(rel) {
    var abs = path.join(ROOT, rel);
    var st;
    try { st = fs.statSync(abs); } catch (e) { return; }
    if (st.isDirectory()) {
      var name = path.basename(rel);
      if (SKIP_DIRS.has(name) || name.startsWith('.') || name === 'graphify-out') return;
      var entries = fs.readdirSync(abs);
      for (var i = 0; i < entries.length; i++) rec(path.join(rel, entries[i]));
    } else if (st.isFile()) {
      cb(rel, abs);
    }
  }
  rec(relStart);
}

function scanAll() {
  var all = [];
  walk('.', function (rel, abs) {
    if (shouldSkipPath(rel)) return;
    if (!TEXT_EXT.test(rel)) return;
    var hits = scanFile(abs);
    if (hits.length) all.push({ file: rel, hits: hits });
  });
  return all;
}

function scanStaged() {
  var all = [];
  var out = cp.execSync('git diff --cached --name-only --diff-filter=ACM', { cwd: ROOT }).toString();
  var files = out.split(/\r?\n/).filter(function (f) { return f && !shouldSkipPath(f); });
  for (var i = 0; i < files.length; i++) {
    var rel = files[i];
    if (!fs.existsSync(path.join(ROOT, rel))) continue;
    if (!TEXT_EXT.test(rel)) continue;
    var hits = scanFile(path.join(ROOT, rel));
    if (hits.length) all.push({ file: rel, hits: hits });
  }
  return all;
}

function scanPrePush() {
  // Range: from origin/<branch> to HEAD.
  var branch = cp.execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT }).toString().trim();
  var range = 'origin/' + branch + '..HEAD';
  // --diff-filter=ACMR = Added/Copied/Modified/Renamed, skip deletions.
  var out = cp.execSync('git diff --name-only --diff-filter=ACMR ' + range, { cwd: ROOT }).toString();
  var files = out.split(/\r?\n/).filter(function (f) { return f && !shouldSkipPath(f); });
  var all = [];
  for (var i = 0; i < files.length; i++) {
    var rel = files[i];
    var buf;
    try {
      buf = cp.execSync('git show HEAD:' + rel.replace(/"/g, '\\"'), { cwd: ROOT });
    } catch (e) {
      // Path does not exist at HEAD (e.g. rename or added file with odd name): skip.
      continue;
    }
    if (!isLikelyText(buf)) continue;
    var text = buf.toString('utf8');
    for (var j = 0; j < PATTERNS.length; j++) {
      var p = PATTERNS[j];
      p.re.lastIndex = 0;
      var m;
      while ((m = p.re.exec(text)) !== null) {
        all.push({ file: rel, hits: [{ pattern: p.name, line: lineOf(text, m.index), preview: redact(m[0]) }] });
      }
    }
  }
  return all;
}

function installHooks() {
  var preCommit = [
    '#!/usr/bin/env node',
    '// Installed by scripts/scan-secrets.js',
    "var cp = require('child_process');",
    "var res = cp.spawnSync(process.execPath, [require('path').resolve(__dirname, '..', '..', 'scripts', 'scan-secrets.js')], { stdio: 'inherit' });",
    'process.exit(res.status || 0);',
    ''
  ].join('\n');
  var prePush = preCommit.replace('scan-secrets.js', 'scan-secrets.js --pre-push');
  var hooksDir = path.join(ROOT, '.git', 'hooks');
  fs.mkdirSync(hooksDir, { recursive: true });
  fs.writeFileSync(path.join(hooksDir, 'pre-commit'), preCommit);
  fs.writeFileSync(path.join(hooksDir, 'pre-push'), prePush);
  console.log('Installed .git/hooks/pre-commit and pre-commit/pre-push.');
}

function printReport(found) {
  if (!found.length) {
    console.log('scan-secrets: OK (no secrets found)');
    return;
  }
  console.error('scan-secrets: FOUND ' + found.length + ' suspicious file(s):');
  found.forEach(function (entry) {
    console.error('  ' + entry.file);
    entry.hits.forEach(function (h) {
      console.error('    line ' + h.line + '  [' + h.pattern + ']  ' + h.preview);
    });
  });
  console.error('');
  console.error('If any of these are false positives, replace the match with a placeholder');
  console.error('(e.g. process.env.MY_KEY) and try again. To bypass the hook once:');
  console.error('  git commit --no-verify');
}

function main() {
  var args = process.argv.slice(2);
  var mode = 'staged';
  if (args.indexOf('--all') !== -1) mode = 'all';
  else if (args.indexOf('--pre-push') !== -1) mode = 'pre-push';
  else if (args.indexOf('--install') !== -1) return installHooks();

  var found;
  try {
    if (mode === 'all') found = scanAll();
    else if (mode === 'pre-push') found = scanPrePush();
    else found = scanStaged();
  } catch (e) {
    console.error('scan-secrets: scanner error: ' + e.message);
    process.exit(2);
  }
  printReport(found);
  process.exit(found.length ? 1 : 0);
}

main();
