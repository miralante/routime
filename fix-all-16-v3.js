/* ============================================================
   Routime — Fix remaining 16 corrupted app.js files
   Pattern A: Invalid regex — orphaned comment + template literal + missing }
   Pattern B: Unexpected token ')' — orphaned ); + } + missing }
   Pattern C: Unexpected token 'function' — orphaned } + junk + missing }
   ecos:    Pattern A variant with different string literal
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');

var TOOLS_DIR = path.join(__dirname, 'tools');
var LOG = [];
var FIXED = [];
var FAILED = [];

// ─── helpers ────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(msg);
  LOG.push(msg);
}

function backup(orig) {
  var bak = orig + '.bak16';
  if (!fs.existsSync(bak)) fs.copyFileSync(orig, bak);
}

function lineAfter(content, afterLine) {
  var lines = content.split('\n');
  var start = afterLine; // 0-based
  for (var i = start; i < lines.length; i++) {
    var t = lines[i].trim();
    if (t !== '') return { line: i + 1, text: lines[i], trimmed: t };
  }
  return null;
}

function lineEnding(content) {
  return content.includes('\r\n') ? '\r\n' : '\n';
}

// ─── Pattern A fixer ─────────────────────────────────────────────────────────
// Tools: categories, healthy-food, sentence, times-of-day
// plus ecos (slightly different string)
function fixPatternA(content, tool) {
  var NL = lineEnding(content);
  var lines = content.split(NL === '\r\n' ? /\r?\n/ : '\n');

  // Find the orphaned /* ---- Pantalla inicial ---- */ block
  // It starts with a comment line followed by a string literal fragment
  var removed = false;
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    // Match the orphaned start-screen comment (not inside a function body)
    // These are at file scope between function declarations
    if (/^\s*\/\*\s*-\{2,3}\s*Pantalla inicial\s*-\{2,3}\s*\*\//.test(l) ||
        /^\s*\/\*\s*----\s*P[aá]gina inicial\s*----\s*\*\//.test(l) ||
        /^\s*\/\*\s*----\s*Inicio\s*----\s*\*\//.test(l) ||
        l.trim() === "'" || l.trim() === '"' || l.trim() === '`') {
      // Check if this is truly orphaned (check surrounding context)
      var prevLine = i > 0 ? lines[i - 1].trim() : '';
      var nextLine = i + 1 < lines.length ? lines[i + 1] : '';
      // It's orphaned if the previous line is a function closing brace
      // or the next line starts with a string literal
      if (prevLine === '}' || nextLine.trim().startsWith("'") || nextLine.trim().startsWith('"') || nextLine.trim().startsWith('`')) {
        // Count how many lines to remove: the comment + all string literal lines + orphaned });
        var end = i;
        while (end < lines.length) {
          var t = lines[end].trim();
          if (t === '});' || t === '}' || (t === '' && end > i + 2)) break;
          end++;
        }
        // Include the }); or standalone }
        if (end < lines.length) {
          var te = lines[end].trim();
          if (te === '});' || te === '}') end++;
        }
        var removedLines = lines.splice(i, end - i);
        log('  [' + tool + '] Pattern A: removed lines ' + (i + 1) + '–' + (end) + ': ' + JSON.stringify(removedLines[0]));
        removed = true;
        break;
      }
    }
  }
  if (!removed) {
    log('  [' + tool + '] Pattern A: no orphaned comment block found');
    return null;
  }

  // Rebuild content
  content = lines.join('\n');

  // Now find startGame() and add missing closing brace
  var result = fixStartGameClosing(content, tool);
  return result;
}

// ─── Pattern B fixer ─────────────────────────────────────────────────────────
// Tools: doctor-visit, first-aid-kit, friends, post-or-not, resilience,
//         self-esteem, signs, situations, street, tracing
// Pattern: standalone "  );" at file scope followed by "  }"
function fixPatternB(content, tool) {
  var NL = lineEnding(content);
  var lines = content.split(NL === '\r\n' ? /\r?\n/ : '\n');

  var removed = false;
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i].trim();
    // Orphaned ); at file scope
    if (l === ');') {
      var prev = i > 0 ? lines[i - 1].trim() : '';
      // It should follow a forEach or similar block
      if (prev !== '}' && !prev.startsWith('//') && !prev.startsWith('/*')) {
        // Check if next line is orphaned }
        if (i + 1 < lines.length && lines[i + 1].trim() === '}') {
          var prev2 = i > 1 ? lines[i - 2].trim() : '';
          // Verify prev2 is a closing of a forEach block
          if (prev2.endsWith('()') || prev2.endsWith('}')) {
            var removedLines = lines.splice(i, 2); // remove ); and }
            log('  [' + tool + '] Pattern B: removed lines ' + (i + 1) + '–' + (i + 2) + ': ' + JSON.stringify(removedLines.join(' | ')));
            removed = true;
            break;
          }
        }
      }
    }
  }
  if (!removed) {
    log('  [' + tool + '] Pattern B: no orphaned ); found');
    return null;
  }

  content = lines.join('\n');
  var result = fixStartGameClosing(content, tool);
  return result;
}

// ─── Pattern C fixer ─────────────────────────────────────────────────────────
// Tools: task-list
// Pattern: orphaned "  }" + "      cont.appendChild..." + "    });" + "  }"
function fixPatternC(content, tool) {
  var NL = lineEnding(content);
  var lines = content.split(NL === '\r\n' ? /\r?\n/ : '\n');

  var removed = false;
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    // Orphaned closing brace followed by indented "cont.appendChild" junk
    if (l.trim() === '}' && i + 1 < lines.length) {
      var next = lines[i + 1];
      if (next.includes('cont.appendChild') || next.includes('cont.')) {
        // Remove this } and the following junk lines until we hit another function
        var end = i + 1;
        while (end < lines.length) {
          var t = lines[end].trim();
          if (t === '' || t.startsWith('function ') || t.startsWith('/*') || t.startsWith('//')) break;
          end++;
        }
        // Also remove the trailing } if present
        if (end < lines.length && lines[end].trim() === '}') end++;
        var removedLines = lines.splice(i, end - i);
        log('  [' + tool + '] Pattern C: removed lines ' + (i + 1) + '–' + (end) + ': ' + JSON.stringify(removedLines[0]));
        removed = true;
        break;
      }
    }
  }
  if (!removed) {
    log('  [' + tool + '] Pattern C: no orphaned } junk found');
    return null;
  }

  content = lines.join('\n');
  var result = fixStartGameClosing(content, tool);
  return result;
}

// ─── Fix startGame() closing ─────────────────────────────────────────────────
function fixStartGameClosing(content, tool) {
  var NL = lineEnding(content);
  var lines = content.split(NL === '\r\n' ? /\r?\n/ : '\n');

  // Find the startGame() function
  var startGameLine = -1;
  for (var i = 0; i < lines.length; i++) {
    if (/^function startGame\s*\(/.test(lines[i])) {
      startGameLine = i;
      break;
    }
  }
  if (startGameLine === -1) {
    log('  [' + tool + '] startGame() not found!');
    return null;
  }

  // Find where startGame() actually closes using brace counting
  var open = 0;
  var closeLine = -1;
  for (var j = startGameLine; j < lines.length; j++) {
    for (var k = 0; k < lines[j].length; k++) {
      var ch = lines[j][k];
      if (ch === '{') open++;
      else if (ch === '}') {
        open--;
        if (open === 0) { closeLine = j; break; }
      }
    }
    if (closeLine !== -1) break;
  }

  if (closeLine === -1) {
    log('  [' + tool + '] could not find closing } of startGame()!');
    return null;
  }

  // Check the line after the closing }
  var after = lineAfter(content, closeLine);
  if (!after) {
    log('  [' + tool + '] nothing after startGame() closing — already valid?');
    return content; // nothing more to do
  }

  // If next line starts with "function renderProgress() {" (no indentation),
  // we need to add a closing } before it
  if (/^function renderProgress\s*\(/.test(after.trimmed)) {
    log('  [' + tool + '] startGame() missing closing }, adding at line ' + (closeLine + 1));
    // The closing } is already at closeLine. We just need to add one more }
    lines.splice(closeLine + 1, 0, '');
    content = lines.join('\n');
    return content;
  }

  // If next line is "function renderLevels() {" or "function iniciarNivel" etc.
  // The closing brace is missing
  if (/^function \w+/.test(after.trimmed) || after.trimmed === '') {
    // Check if the line at closeLine already has extra content (merged line)
    // e.g., "  }function renderProgress() {" — need to split
    if (closeLine + 1 < lines.length && /\}\s*function/.test(lines[closeLine])) {
      log('  [' + tool + '] merged closing } + function, splitting');
      lines[closeLine] = lines[closeLine].replace(/\}\s*(function\s+\w+)/, '}\n' + spaces(lines[closeLine].match(/^(\s*)/)[1]) + '$1');
      content = lines.join('\n');
      return content;
    }
    log('  [' + tool + '] startGame() missing closing }, adding at line ' + (closeLine + 1));
    lines.splice(closeLine + 1, 0, '');
    content = lines.join('\n');
    return content;
  }

  return content;
}

function spaces(n) {
  return new Array(n + 1).join(' ');
}

// ─── ecos fixer (variant of Pattern A) ──────────────────────────────────────
// ecos has "  ', veces);" etc. at file scope
function fixEcos(content, tool) {
  var NL = lineEnding(content);
  var lines = content.split(NL === '\r\n' ? /\r?\n/ : '\n');

  // Find the orphaned string literal fragment for ecos
  // It starts with "  ', veces);" or similar at file scope
  var removed = false;
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i].trim();
    // Orphaned string literal starting with ' at file scope
    if ((l === "'" || l === '"' || l === '`') && i > 0) {
      var prev = lines[i - 1].trim();
      // Should follow a } at file scope
      if (prev === '}') {
        // Find end of this fragment block
        var end = i;
        while (end < lines.length) {
          var t = lines[end].trim();
          if (t === '});' || t === '}') break;
          end++;
        }
        if (end < lines.length) {
          var te = lines[end].trim();
          if (te === '});' || te === '}') end++;
        }
        var removedLines = lines.splice(i, end - i);
        log('  [ecos] Pattern A (ecos variant): removed lines ' + (i + 1) + '–' + (end));
        removed = true;
        break;
      }
    }
    // Also handle lines that start with string content at file scope
    if ((l.startsWith("'") || l.startsWith('"')) && i > 0) {
      var prev2 = lines[i - 1].trim();
      if (prev2 === '}') {
        var end2 = i;
        while (end2 < lines.length) {
          var t2 = lines[end2].trim();
          if (t2 === '});' || t2 === '}') break;
          end2++;
        }
        if (end2 < lines.length) {
          var te2 = lines[end2].trim();
          if (te2 === '});' || te2 === '}') end2++;
        }
        var removedLines2 = lines.splice(i, end2 - i);
        log('  [ecos] Pattern A (ecos variant, direct): removed lines ' + (i + 1) + '–' + (end2));
        removed = true;
        break;
      }
    }
  }
  if (!removed) {
    log('  [ecos] Pattern A: no orphaned string literal found');
    return null;
  }

  content = lines.join('\n');
  var result = fixStartGameClosing(content, tool);
  return result;
}

// ─── Validate ────────────────────────────────────────────────────────────────
function validate(content, tool) {
  try {
    new Function(content);
    return true;
  } catch (e) {
    log('  [' + tool + '] STILL BROKEN: ' + e.message.split('\n')[0]);
    return false;
  }
}

// ─── Per-tool fixer dispatch ─────────────────────────────────────────────────
var PATTERN_A = ['categories', 'healthy-food', 'sentence', 'times-of-day'];
var PATTERN_B = ['doctor-visit', 'first-aid-kit', 'friends', 'post-or-not', 'resilience', 'self-esteem', 'signs', 'situations', 'street', 'tracing'];
var PATTERN_C = ['task-list'];
var ECOS = ['ecos'];

var ALL = PATTERN_A.concat(PATTERN_B).concat(PATTERN_C).concat(ECOS);

for (var t = 0; t < ALL.length; t++) {
  var tool = ALL[t];
  var appjs = path.join(TOOLS_DIR, tool, 'app.js');
  if (!fs.existsSync(appjs)) {
    log('  [' + tool + '] app.js not found, skipping');
    continue;
  }

  log('Processing: ' + tool);
  var orig = fs.readFileSync(appjs, 'utf8');
  backup(appjs);

  var fixed = null;
  if (PATTERN_A.indexOf(tool) !== -1) {
    fixed = fixPatternA(orig, tool);
  } else if (PATTERN_B.indexOf(tool) !== -1) {
    fixed = fixPatternB(orig, tool);
  } else if (PATTERN_C.indexOf(tool) !== -1) {
    fixed = fixPatternC(orig, tool);
  } else if (ECOS.indexOf(tool) !== -1) {
    fixed = fixEcos(orig, tool);
  }

  if (fixed === null) {
    log('  [' + tool + '] Could not find corruption pattern, trying brute-force startGame fix');
    fixed = fixStartGameClosing(orig, tool);
    if (fixed === null) {
      FAILED.push(tool + ' (no pattern found)');
      continue;
    }
  }

  if (validate(fixed, tool)) {
    fs.writeFileSync(appjs, fixed, 'utf8');
    FIXED.push(tool);
    log('  [' + tool + '] ✓ FIXED and saved');
  } else {
    // Restore original
    log('  [' + tool + '] ✗ Validation failed, rolling back');
    FAILED.push(tool);
  }
}

// ─── Summary ────────────────────────────────────────────────────────────────
console.log('\n=== SUMMARY ===');
log('\n=== SUMMARY ===');
log('Fixed: ' + FIXED.length + '/' + ALL.length);
if (FIXED.length) log('  ' + FIXED.join(', '));
if (FAILED.length) {
  log('Failed: ' + FAILED.length);
  FAILED.forEach(function(f) { log('  ' + f); });
}
