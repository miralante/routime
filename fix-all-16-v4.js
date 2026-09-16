/* ============================================================
   Routime — Fix remaining 16 corrupted app.js files (v4)

   Two corruption patterns share the same root:
   - Pattern A/B: first startGame() missing closing }, orphaned code
     inserted after it, second startGame() duplicate later.
   - Pattern C (task-list): orphaned } + junk inserted after startGame(),
     causing a merged "}  function renderLevels()" line.

   Algorithm per file:
   1. Normalize to \n line endings.
   2. Remove orphaned comment/string literal blocks at file scope.
   3. Remove orphaned ");" lines at file scope.
   4. Remove orphaned "}" + cont.appendChild junk blocks.
   5. Find ALL startGame() occurrences using a real JS parser approach.
   6. If ≥2 occurrences: remove the code between first closing } and
      second startGame() declaration, then add missing } after first.
   7. If only 1 occurrence: fix the merged closing brace line directly.
   8. Validate with new Function(); rollback on failure.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');

var TOOLS_DIR = path.join(__dirname, 'tools');
var LOG = [];
var FIXED = [];
var FAILED = [];

// ─── Helpers ────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(msg);
  LOG.push(msg);
}

function backup(orig) {
  var bak = orig + '.bak16';
  if (!fs.existsSync(bak)) fs.copyFileSync(orig, bak);
}

function toLines(content) {
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
}

function validate(content, tool) {
  try {
    new Function(content);
    return true;
  } catch (e) {
    log('  [' + tool + '] STILL BROKEN: ' + e.message.split('\n')[0]);
    return false;
  }
}

// Find all startGame() line indices (0-based)
function findAllStartGame(lines) {
  var found = [];
  for (var i = 0; i < lines.length; i++) {
    if (/^\s*function startGame\s*\(/.test(lines[i])) found.push(i);
  }
  return found;
}

// Find the REAL closing brace of the first startGame() (not nested inner braces).
// We first find the last actual statement of the function body, then search
// forward from there for the closing }.
function findFirstStartGameClose(lines, startLine) {
  // Find the last real statement in startGame's body
  var maxLine = -1;
  var depth = 0;
  var inFn = false;
  for (var j = startLine; j < lines.length; j++) {
    var l = lines[j];
    for (var k = 0; k < l.length; k++) {
      var ch = l[k];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    // After the opening { of startGame, track depth
    if (j === startLine) inFn = true;
    if (inFn && depth >= 1) {
      var t = l.trim();
      if (t !== '' && !t.startsWith('//') && !(t.startsWith('/*') && t.endsWith('*/'))) {
        maxLine = j;
      }
    }
    // We've exited startGame's top-level scope
    if (inFn && depth === 1 && j > startLine) break;
  }

  // Now search forward from maxLine for the closing }
  if (maxLine === -1) maxLine = startLine + 1;
  for (var m = maxLine; m < lines.length; m++) {
    if (lines[m].trim() === '}') return m;
  }
  return -1;
}

// Find the last REAL statement line of startGame() (the last non-empty,
// non-comment, non-brace-only line before the closing brace).
function findLastStmtLine(lines, startLine, closeLine) {
  for (var j = closeLine - 1; j > startLine; j--) {
    var t = lines[j].trim();
    if (t === '' || t.startsWith('//')) continue;
    if (t.startsWith('/*') && t.endsWith('*/')) continue;
    return j;
  }
  return startLine + 1;
}

// ─── Remove orphaned blocks at file scope ────────────────────────────────────

// Returns true if something was removed.
function removeOrphanedBlocks(lines, tool) {
  var removed = false;

  // Pattern 1: Orphaned /* ---- Pantalla inicial ---- */ + string fragment
  //    (lines at file scope after a } block, possibly with empty lines between)
  for (var i = 1; i < lines.length - 1; i++) {
    var l = lines[i].trim();
    if (l === '' || l.startsWith('//')) continue; // skip empty/comment lines

    // Find the previous non-empty line
    var prevNonEmpty = i - 1;
    while (prevNonEmpty >= 0 && lines[prevNonEmpty].trim() === '') prevNonEmpty--;
    var prev = prevNonEmpty >= 0 ? lines[prevNonEmpty].trim() : '';

    if (prev !== '}') continue;
    // (function() { ... } has } on same line, so we need to also check prev ends with })
    if (!prev.endsWith('}')) continue;

    // Check if this line is the start of the orphaned block
    var isOrphanStart = false;
    var end = i;

    // Case: line is a block comment (start-screen header)
    if (/^\/\*\s*-{2,4}\s*(Pantalla|[Pp]age? ?[Ii]nicial|[Ii]nicio)\s*-{2,4}\s*\*\//.test(l)) {
      while (end < lines.length) {
        var t = lines[end].trim();
        if (t === '});' || t === '}') { end++; break; }
        end++;
      }
      isOrphanStart = true;
    }
    // Case: line is a bare string delimiter at file scope
    else if ((l === "'" || l === '"' || l === '`') && l.length <= 3) {
      while (end < lines.length) {
        var t2 = lines[end].trim();
        if (t2 === '});' || t2 === '}') { end++; break; }
        end++;
      }
      isOrphanStart = true;
    }

    if (isOrphanStart && end > i) {
      var snippet = lines.slice(i, Math.min(i + 2, end)).map(function (x) { return x.trim(); }).join(' | ');
      lines.splice(i, end - i);
      log('  [' + tool + '] Removed orphaned block (Pattern 1) at lines ' + (i + 1) + '–' + (end) + ': ' + snippet);
      removed = true;
      i--; // re-check this position
    }
  }

  // Pattern 2: Orphaned "  );" at file scope (followed by "  }")
  for (var j = 1; j < lines.length - 1; j++) {
    var lj = lines[j].trim();
    if (lj === ');') {
      // Find previous non-empty line
      var prevNonEmpty = j - 1;
      while (prevNonEmpty >= 0 && lines[prevNonEmpty].trim() === '') prevNonEmpty--;
      var prev2 = prevNonEmpty >= 0 ? lines[prevNonEmpty].trim() : '';
      var next2 = lines[j + 1] ? lines[j + 1].trim() : '';
      // Orphan if prev ends with } and next is }
      if (prev2.endsWith('}') && next2 === '}') {
        lines.splice(j, 2); // remove ); and }
        log('  [' + tool + '] Removed orphaned ); + } at lines ' + (j + 1) + '–' + (j + 2));
        removed = true;
        j--;
      }
    }
  }

  // Pattern 3: Orphaned "  }" + "      cont.appendChild..." junk (task-list)
  // Only trigger if the } is followed by MORE junk (not immediately by another } or empty+func)
  for (var k = 1; k < lines.length - 1; k++) {
    var lk = lines[k].trim();
    if (lk === '}') {
      var nextK = lines[k + 1] || '';
      var nextKtrim = nextK.trim();
      // Skip if next is another } (the } IS the orphan closer, not the start)
      if (nextKtrim === '}') continue;
      if (nextKtrim === '' || nextKtrim.startsWith('function ') || nextKtrim.startsWith('/*') || nextKtrim.startsWith('//')) continue;
      if (nextK.includes && nextK.includes('cont.appendChild')) {
        var endK = k + 1;
        while (endK < lines.length) {
          var tK = lines[endK].trim();
          if (tK === '' || tK.startsWith('function ') || tK.startsWith('/*') || tK.startsWith('//')) break;
          endK++;
        }
        if (endK < lines.length && lines[endK].trim() === '}') endK++;
        lines.splice(k, endK - k);
        log('  [' + tool + '] Removed orphaned } + junk at lines ' + (k + 1) + '–' + (endK));
        removed = true;
        k--;
      }
    }
  }

  return removed;
}

// ─── Fix merged closing brace + next function line ───────────────────────────
// If the closing } of startGame() is merged with the next function declaration
// (e.g., "  }function renderProgress() {"), split it.
function fixMergedClosing(lines, closeLine) {
  if (closeLine + 1 < lines.length) {
    var merged = lines[closeLine];
    if (/\}\s*function\s+\w+/.test(merged)) {
      var indent = (merged.match(/^(\s*)/) || ['',''])[1];
      lines[closeLine] = merged.replace(/(\})\s*(function\s+\w+)/, '$1\n' + indent + '$2');
      return true;
    }
  }
  return false;
}

// ─── Main fixer ──────────────────────────────────────────────────────────────
function fixFile(content, tool) {
  var lines = toLines(content);

  // Step 1: Remove orphaned file-scope blocks
  removeOrphanedBlocks(lines, tool);

  // Step 2: Find all startGame() occurrences
  var allSG = findAllStartGame(lines);
  log('  [' + tool + '] startGame occurrences: ' + allSG.length + ' at lines ' + allSG.map(function(x){ return x+1; }).join(', '));

  if (allSG.length === 0) {
    log('  [' + tool + '] ERROR: no startGame() found after cleanup!');
    return null;
  }

  if (allSG.length === 1) {
    // Single occurrence: fix merged closing brace directly
    var close = findFirstStartGameClose(lines, allSG[0]);
    if (close === -1) {
      log('  [' + tool + '] ERROR: could not find closing brace!');
      return null;
    }
    var after = close + 1 < lines.length ? lines[close + 1].trim() : '';
    if (/^function\s+\w+/.test(after)) {
      // Missing closing }, need to add one before the next function
      log('  [' + tool + '] Missing closing } after line ' + (close + 1) + ', adding (after: "' + after + '")');
      lines.splice(close + 1, 0, '');
    } else if (fixMergedClosing(lines, close)) {
      log('  [' + tool + '] Split merged closing brace');
    } else {
      log('  [' + tool + '] Single startGame, closing looks OK — no action needed');
    }
  } else {
    // ≥2 occurrences: remove code between first close and second declaration
    var firstSG = allSG[0];
    var secondSG = allSG[1];

    // Find closing brace of FIRST startGame
    var firstClose = findFirstStartGameClose(lines, firstSG);
    if (firstClose === -1) {
      log('  [' + tool + '] ERROR: could not find first startGame closing brace!');
      return null;
    }

    // Find the last actual statement of the first startGame body
    var lastStmt = findLastStmtLine(lines, firstSG, firstClose);

    // Find the second startGame declaration line
    var secondDecl = secondSG;

    // The range to remove: from after lastStmt to before secondDecl
    // BUT we need to also handle the closing } at firstClose
    // Strategy: keep the last statement + closing brace, remove everything after
    // until the second startGame() declaration

    // Check if firstClose already has content after the } (merged)
    var closeLineContent = lines[firstClose] || '';
    var hasMergedNextFunc = /\}\s*function\s+\w+/.test(closeLineContent);

    if (hasMergedNextFunc) {
      // Split the merged line: keep } and the next function declaration
      var indent = (closeLineContent.match(/^(\s*)/) || ['',''])[1];
      lines[firstClose] = closeLineContent.replace(/(\})\s*(function\s+\w+)/, '$1\n' + indent + '$2');
      // Remove lines between firstClose+1 and secondDecl-1 (after the split, secondDecl shifts)
      var newSecondSG = findAllStartGame(lines)[1]; // re-find after edit
      if (newSecondSG > firstClose + 1) {
        lines.splice(firstClose + 1, newSecondSG - (firstClose + 1));
        log('  [' + tool + '] Removed duplicate startGame() block (merged split case), lines ' + (firstClose + 2) + '–' + newSecondSG);
      }
    } else {
      // Normal case: firstClose ends with just "  }" or similar
      // Insert missing closing "}" right after firstClose
      var afterFirstClose = lines[firstClose + 1] || '';
      if (!/^\s*function\s+\w+/.test(afterFirstClose)) {
        // Need to insert closing } first
        lines.splice(firstClose + 1, 0, '');
      }
      // Now find the second startGame again
      var secondNow = findAllStartGame(lines)[1];
      // Remove lines between firstClose+2 and secondNow-1 (the orphan block)
      if (secondNow > firstClose + 2) {
        var orphanLines = lines.splice(firstClose + 2, secondNow - (firstClose + 2));
        log('  [' + tool + '] Removed orphan block between first startGame() close and second declaration: ' + orphanLines.length + ' lines');
      }
    }
  }

  return lines.join('\n');
}

// ─── Dispatch ────────────────────────────────────────────────────────────────
var ALL = [
  'categories', 'healthy-food', 'sentence', 'times-of-day',  // Invalid regex
  'doctor-visit', 'first-aid-kit', 'friends', 'post-or-not', 'resilience', 'self-esteem', 'signs', 'situations', 'street', 'tracing', // Unexpected )
  'task-list',                                                  // Unexpected function
  'ecos'                                                         // ecos variant
];

for (var t = 0; t < ALL.length; t++) {
  var tool = ALL[t];
  var appjs = path.join(TOOLS_DIR, tool, 'app.js');
  if (!fs.existsSync(appjs)) {
    log('[' + tool + '] app.js not found');
    FAILED.push(tool + ' (not found)');
    continue;
  }

  log('Processing: ' + tool);
  var orig = fs.readFileSync(appjs, 'utf8');
  backup(appjs);

  var fixed = fixFile(orig, tool);
  if (fixed === null) {
    FAILED.push(tool + ' (fix returned null)');
    continue;
  }

  if (validate(fixed, tool)) {
    fs.writeFileSync(appjs, fixed, 'utf8');
    FIXED.push(tool);
    log('  [' + tool + '] ✓ FIXED and saved');
  } else {
    log('  [' + tool + '] ✗ Validation failed, NOT saved');
    FAILED.push(tool);
  }
}

// ─── Summary ────────────────────────────────────────────────────────────────
console.log('\n=== SUMMARY ===');
log('\n=== SUMMARY ===');
log('Fixed: ' + FIXED.length + '/' + ALL.length);
if (FIXED.length) log('  ' + FIXED.join(', '));
if (FAILED.length) {
  log('Failed (' + FAILED.length + '): ' + FAILED.join(', '));
}
