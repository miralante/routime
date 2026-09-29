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

// Find the REAL closing brace of the first startGame().
// Two strategies:
// 1. If there are ≥2 startGame() occurrences, use brace-counting from first to find
//    where its body ends (depth returns to 1 after being >1), then look for
//    the first } at depth 1 after the last real statement.
// 2. If only 1 startGame(), look for the } just before the next function declaration
//    (or before the end of the file).
function findFirstStartGameClose(lines, startLine) {
  // First, find the next function declaration after startGame
  var nextFuncLine = -1;
  for (var f = startLine + 1; f < lines.length; f++) {
    var tf = lines[f].trim();
    if (/^function\s+\w+/.test(tf)) { nextFuncLine = f; break; }
  }

  // Find the last real statement of startGame
  var lastStmt = startLine + 1;
  var depth = 0;
  for (var j = startLine; j < lines.length; j++) {
    var l = lines[j];
    for (var k = 0; k < l.length; k++) {
      var ch = l[k];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (j === startLine) continue; // skip the opening {
    if (depth >= 1) {
      var t = l.trim();
      if (t !== '' && !t.startsWith('//') && !(t.startsWith('/*') && t.endsWith('*/'))) {
        lastStmt = j;
      }
    }
    // If we've closed startGame's own block (depth back to 1 after being >1), stop
    if (depth === 1 && j > startLine) break;
  }

  // Search from lastStmt+1 for the first standalone }
  for (var m = lastStmt + 1; m < lines.length; m++) {
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

    if (!prev.endsWith('}')) continue;

    // Check if this line is the start of the orphaned block
    var isOrphanStart = false;
    var end = i;

    // Case: line is a block comment (start-screen header)
    // Use [\s-] before the closing dashes so "Pantalla inicial ---- */" matches
    var reComment = /^\/\*\s*-{2,4}\s*(Pantalla[\s-][Ii]nicial|Pantalla|Inicio)\s*-{2,4}\s*\*\//;
    if (reComment.test(l)) {
      while (end < lines.length) {
        var t = lines[end].trim();
        if (t === '});' || t === '}') { end++; break; }
        end++;
      }
      isOrphanStart = true;
    }
    // Case: line starts with a string delimiter at file scope (orphaned string fragment)
    else if (l.charAt(0) === "'" || l.charAt(0) === '"' || l.charAt(0) === '`') {
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

  // Pattern 2: Orphaned "  );" at file scope (followed by indented junk, ending with }); or })
  for (var j = 1; j < lines.length - 1; j++) {
    var lj = lines[j].trim();
    if (lj === ');') {
      // Find previous non-empty line
      var prevNonEmpty = j - 1;
      while (prevNonEmpty >= 0 && lines[prevNonEmpty].trim() === '') prevNonEmpty--;
      var prev2 = prevNonEmpty >= 0 ? lines[prevNonEmpty].trim() : '';
      var next2 = lines[j + 1] ? lines[j + 1].trim() : '';
      // Orphan if prev ends with } and next is NOT a } (junk follows)
      if (prev2.endsWith('}') && next2 !== '}') {
        // Find the end of the orphan block (ends at }); or standalone })
        var end = j + 1;
        while (end < lines.length) {
          var t = lines[end].trim();
          if (t === '});' || t === '}') { end++; break; }
          end++;
        }
        var removedLines = lines.splice(j, end - j);
        log('  [' + tool + '] Removed orphaned ); block at lines ' + (j + 1) + '–' + (end) + ': ' + removedLines[0].trim());
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
    // Single occurrence but startGame might still be missing its closing }
    // Check: is there a renderProgress() declaration INSIDE startGame's body?
    var sg = allSG[0];
    var close = findFirstStartGameClose(lines, sg);
    if (close === -1) {
      log('  [' + tool + '] ERROR: could not find closing brace!');
      return null;
    }

    // Check if there's a renderProgress INSIDE startGame (indent < indent of startGame body)
    // This means startGame is missing its closing }
    var sgIndent = (lines[sg].match(/^(\s*)/) || ['',''])[1];
    var bodyIndent = sgIndent + '  '; // function body is 2 more spaces

    // Find all function declarations between sg and close
    var insideFuncs = [];
    for (var fi = sg + 1; fi < close; fi++) {
      var ft = lines[fi].trim();
      if (/^function\s+\w+/.test(ft)) {
        insideFuncs.push({ line: fi, name: ft.match(/^function\s+(\w+)/)[1] });
      }
    }

    // Also find all function declarations at file scope (indent = 0 or sgIndent level) after close
    var afterClose = [];
    for (var af = close + 1; af < lines.length; af++) {
      var aft = lines[af].trim();
      if (/^function\s+\w+/.test(aft)) {
        afterClose.push({ line: af, name: aft.match(/^function\s+(\w+)/)[1] });
        break; // only need the first one
      }
    }

    if (insideFuncs.length > 0) {
      // startGame is missing its closing }
      // Add closing } with proper indentation (same as startGame's indent)
      var lastStmt = findLastStmtLine(lines, sg, close);
      var sgIndent = (lines[sg].match(/^(\s*)/) || ['',''])[1];
      var insertLine = lastStmt + 1;
      var closingBrace = sgIndent + '}';
      log('  [' + tool + '] Missing } for startGame, inserting after line ' + (insertLine) + ' (inside funcs: ' + insideFuncs.map(function(f){return f.name;}).join(',') + ')');
      lines.splice(insertLine, 0, closingBrace);

      // The CORRECT fix: MOVE the inside-startGame functions to file scope.
      // Find all functions inside startGame (depth>=2 when declared).
      // For each such function, if there's also a file-scope version (indent<=2), 
      // REMOVE the file-scope version and KEEP the inside-startGame version 
      // (we'll move it to file scope later by inserting a closing } for startGame
      // and keeping the function bodies in place).
      
      // Find all file-scope functions (indent <= 2) after startGame closes
      var fileScopeFuncs = {};
      for (var fsf = close + 1; fsf < lines.length; fsf++) {
        var fsft = lines[fsf].trim();
        if (/^function\s+\w+/.test(fsft)) {
          var fname = fsft.match(/^function\s+(\w+)/)[1];
          fileScopeFuncs[fname] = fsf;
          break; // only first file-scope func
        }
      }
      
      // insideFuncs has functions declared INSIDE startGame (depth>=2 when their { is found)
      var insideNames = insideFuncs.map(function(f){ return f.name; });
      log('  [' + tool + '] File-scope funcs: ' + JSON.stringify(fileScopeFuncs) + ', inside funcs: ' + insideNames.join(','));
      
      // Strategy: 
      // 1. If there's a file-scope function that matches an inside func, 
      //    REMOVE the file-scope version.
      // 2. The inside-startGame functions will remain in place (they're currently
      //    inside startGame), but by adding the closing } for startGame, they 
      //    become file-scope.
      var removedAny = false;
      for (var rm = close + 1; rm < lines.length; ) {
        var rmt = lines[rm].trim();
        var rmMatch = rmt.match(/^function\s+(\w+)/);
        if (rmMatch && insideNames.indexOf(rmMatch[1]) !== -1) {
          // Check if this is a file-scope function (indent <= 2)
          var rmIndent = (lines[rm].match(/^(\s*)/) || ['',''])[1].length;
          if (rmIndent <= 2) {
            // Remove this file-scope duplicate
            var rmFuncStart = rm;
            var rmDepth = 0;
            var rmClose = -1;
            for (var rc = rm; rc < lines.length; rc++) {
              for (var rk = 0; rk < lines[rc].length; rk++) {
                if (lines[rc][rk] === '{') rmDepth++;
                else if (lines[rc][rk] === '}') { rmDepth--; if (rmDepth === 0) { rmClose = rc; break; } }
              }
              if (rmClose !== -1) break;
            }
            if (rmClose !== -1) {
              lines.splice(rmFuncStart, rmClose - rmFuncStart + 1);
              log('  [' + tool + '] Removed file-scope duplicate ' + rmMatch[1] + '() (lines ' + (rmFuncStart+1) + '–' + (rmClose+1) + ')');
              removedAny = true;
              continue; // don't increment rm
            }
          }
        }
        rm++;
      }
      
      // After removing file-scope duplicates, the inside-startGame functions remain in place.
      // By adding the closing } for startGame, they will "spill out" to file scope.
    } else {
      // Check for merged closing brace
      var after = close + 1 < lines.length ? lines[close + 1].trim() : '';
      if (/^function\s+\w+/.test(after)) {
        var sgIndent2 = (lines[sg].match(/^(\s*)/) || ['',''])[1];
        log('  [' + tool + '] Missing closing } before next function "' + after + '", inserting');
        lines.splice(close + 1, 0, sgIndent2 + '}');
      } else if (fixMergedClosing(lines, close)) {
        log('  [' + tool + '] Split merged closing brace');
      } else {
        log('  [' + tool + '] Single startGame, closing looks OK');
      }
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
