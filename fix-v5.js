/* ============================================================
   Routime — Targeted fix for the remaining 16 corrupted files (v5)
   
   Pattern for categories/healthy-food/sentence/times-of-day:
     - Orphan block before startGame()
     - startGame() contains renderProgress() and render() (nested)
     - No file-scope renderProgress (only nested one)
     - Need to: remove orphan, add } after startGame's last stmt, 
       ensure renderProgress at file scope (fix indentation)
   
   Pattern for doctor-visit/etc. (same structure):
     - Orphan ); block before startGame()
     - startGame() contains renderProgress() and render()
     - Same fix needed
   
   Pattern for tracing:
     - Orphan ); block before startGame()
     - startGame() contains iniciarPracticaLibre() + renderProgress() + other funcs
     - renderProgress() also exists at file scope
     - Need to: remove orphan, remove iniciarPracticaLibre from inside startGame,
       keep file-scope renderProgress, add } for startGame
   
   Pattern for task-list:
     - Orphan } + junk between startGame() and iniciarNivel()
     - Need to: remove junk, add } after startGame
   
   Pattern for ecos:
     - Orphan string block before startGame()
     - startGame() contains renderProgress()
     - Need to: remove orphan, add } for startGame
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');

var TOOLS_DIR = path.join(__dirname, 'tools');
var LOG = [];
var FIXED = [];
var FAILED = [];

// ─── Helpers ────────────────────────────────────────────────────────────────
function log(msg) { console.log(msg); LOG.push(msg); }
function backup(orig) {
  var bak = orig + '.bak16';
  if (!fs.existsSync(bak)) fs.copyFileSync(orig, bak);
}
function toLines(content) { return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n'); }
function validate(content, tool) {
  try { new Function(content); return true; }
  catch (e) { log('  [' + tool + '] STILL BROKEN: ' + e.message.split('\n')[0]); return false; }
}

// ─── Fix categories/healthy-food/sentence/times-of-day ──────────────────────
// These have: orphan block → startGame() containing renderProgress() + render()
// No file-scope renderProgress exists. Fix: orphan removal + add } for startGame.
function fixCategoriesFamily(content, tool) {
  var lines = toLines(content);
  var NL = '\n';
  
  // Step 1: Remove orphaned start-screen comment + string literal
  for (var i = 1; i < lines.length - 1; i++) {
    var l = lines[i].trim();
    if (l === '' || l.startsWith('//')) continue;
    var prevNonEmpty = i - 1;
    while (prevNonEmpty >= 0 && lines[prevNonEmpty].trim() === '') prevNonEmpty--;
    var prev = prevNonEmpty >= 0 ? lines[prevNonEmpty].trim() : '';
    if (!prev.endsWith('}')) continue;
    
    var isOrphan = false;
    var end = i;
    
    // Case: block comment
    if (/^\/\*\s*-{2,4}\s*(Pantalla[\s-][Ii]nicial|Pantalla|Inicio)\s*-{2,4}\s*\*\//.test(l)) {
      while (end < lines.length) {
        var t = lines[end].trim();
        if (t === '});' || t === '}') { end++; break; }
        end++;
      }
      isOrphan = true;
    }
    // Case: string literal fragment
    else if (l.charAt(0) === "'" || l.charAt(0) === '"') {
      while (end < lines.length) {
        var t2 = lines[end].trim();
        if (t2 === '});' || t2 === '}') { end++; break; }
        end++;
      }
      isOrphan = true;
    }
    
    if (isOrphan) {
      lines.splice(i, end - i);
      log('  [' + tool + '] Removed orphan block (lines ' + (i+1) + '–' + end + ')');
      i--;
    }
  }
  
  // Step 2: Find startGame and its indentation
  var sg = -1;
  for (var j = 0; j < lines.length; j++) {
    if (/^\s*function startGame\s*\(/.test(lines[j])) { sg = j; break; }
  }
  if (sg === -1) { log('  [' + tool + '] startGame not found!'); return null; }
  
  // Find the next function after startGame
  var nextFuncLine = -1;
  for (var nf = sg + 1; nf < lines.length; nf++) {
    if (/^function\s+\w+/.test(lines[nf].trim())) { nextFuncLine = nf; break; }
  }
  
  // Find last statement of startGame (the line before nextFuncLine minus 1)
  var lastStmtLine = nextFuncLine !== -1 ? nextFuncLine - 1 : sg + 1;
  // But we want the last NON-EMPTY line before nextFuncLine
  while (lastStmtLine > sg && lines[lastStmtLine].trim() === '') lastStmtLine--;
  // Also skip lines that are just }
  while (lastStmtLine > sg && lines[lastStmtLine].trim() === '}') lastStmtLine--;
  
  // Get startGame's indentation
  var sgIndent = (lines[sg].match(/^(\s*)/) || ['',''])[1];
  
  // Check what's at the last statement line
  var lastStmt = lines[lastStmtLine].trim();
  
  // Find renderProgress inside startGame (first function declaration after sg+1)
  var rpInsideLine = -1;
  for (var rp = sg + 1; rp < lines.length; rp++) {
    var rpt = lines[rp].trim();
    if (/^function\s+renderProgress\s*\(/.test(rpt)) { rpInsideLine = rp; break; }
    // Stop if we hit next function
    if (/^function\s+\w+/.test(rpt) && !/^function\s+renderProgress/.test(rpt)) break;
  }
  
  // Check if renderProgress exists at file scope (indent = sgIndent level)
  var rpFileLine = -1;
  if (nextFuncLine !== -1) {
    for (var rpf = nextFuncLine; rpf < lines.length; rpf++) {
      var rpft = lines[rpf].trim();
      var rpfindent = (lines[rpf].match(/^(\s*)/) || ['',''])[1].length;
      if (/^function\s+renderProgress\s*\(/.test(rpft) && rpfindent <= sgIndent.length + 1) {
        rpFileLine = rpf; break;
      }
    }
  }
  
  // If NO file-scope renderProgress: we need to keep the inside one and move it out
  // Add } after lastStmtLine, and fix renderProgress indentation
  if (rpFileLine === -1 && rpInsideLine !== -1) {
    // Fix renderProgress indentation (it's at 0 spaces, should be sgIndent level)
    var rpContent = [];
    var rpEnd = -1;
    var rpDepth = 0;
    for (var rpe = rpInsideLine; rpe < lines.length; rpe++) {
      for (var rpk = 0; rpk < lines[rpe].length; rpk++) {
        if (lines[rpe][rpk] === '{') rpDepth++;
        else if (lines[rpe][rpk] === '}') { rpDepth--; if (rpDepth === 0) { rpEnd = rpe; break; } }
      }
      if (rpEnd !== -1) break;
    }
    
    if (rpEnd !== -1) {
      // Fix indentation of renderProgress (add sgIndent spaces to each line)
      for (var fix = rpInsideLine; fix <= rpEnd; fix++) {
        lines[fix] = sgIndent + lines[fix].trim();
      }
      log('  [' + tool + '] Fixed renderProgress indentation (was 0 spaces, now ' + sgIndent.length + ')');
    }
    
    // Now add } after lastStmtLine
    lines.splice(lastStmtLine + 1, 0, sgIndent + '}');
    log('  [' + tool + '] Added closing } for startGame after line ' + (lastStmtLine + 1));
  }
  // If file-scope renderProgress EXISTS: remove the inside one
  else if (rpFileLine !== -1 && rpInsideLine !== -1) {
    // Remove inside renderProgress
    var remStart = rpInsideLine;
    var remEnd = -1;
    var remDepth = 0;
    for (var re = rpInsideLine; re < lines.length; re++) {
      for (var rk = 0; rk < lines[re].length; rk++) {
        if (lines[re][rk] === '{') remDepth++;
        else if (lines[re][rk] === '}') { remDepth--; if (remDepth === 0) { remEnd = re; break; } }
      }
      if (remEnd !== -1) break;
    }
    if (remEnd !== -1) {
      lines.splice(remStart, remEnd - remStart + 1);
      log('  [' + tool + '] Removed inside-startGame renderProgress (kept file-scope one)');
    }
    // Add } after lastStmtLine
    lines.splice(lastStmtLine + 1, 0, sgIndent + '}');
    log('  [' + tool + '] Added closing } for startGame after line ' + (lastStmtLine + 1));
  }
  // If NO inside renderProgress either: just add } for startGame
  else {
    lines.splice(lastStmtLine + 1, 0, sgIndent + '}');
    log('  [' + tool + '] Added closing } for startGame after line ' + (lastStmtLine + 1));
  }
  
  return lines.join('\n');
}

// ─── Fix doctor-visit family ─────────────────────────────────────────────────
// Same as categories family but Pattern B orphan ();)
function fixDoctorFamily(content, tool) {
  var lines = toLines(content);
  
  // Remove orphan ); block
  for (var i = 1; i < lines.length - 1; i++) {
    var l = lines[i].trim();
    if (l === ');') {
      var prevNonEmpty = i - 1;
      while (prevNonEmpty >= 0 && lines[prevNonEmpty].trim() === '') prevNonEmpty--;
      var prev = prevNonEmpty >= 0 ? lines[prevNonEmpty].trim() : '';
      var next = lines[i + 1] ? lines[i + 1].trim() : '';
      if (prev.endsWith('}') && next !== '}') {
        var end = i + 1;
        while (end < lines.length) {
          var t = lines[end].trim();
          if (t === '});' || t === '}') { end++; break; }
          end++;
        }
        lines.splice(i, end - i);
        log('  [' + tool + '] Removed orphan ); block at lines ' + (i+1) + '–' + end);
        i--;
      }
    }
  }
  
  // Now apply the categories fix logic
  return fixCategoriesFamily(lines.join('\n'), tool);
}

// ─── Fix tracing ─────────────────────────────────────────────────────────────
function fixTracing(content, tool) {
  var lines = toLines(content);
  
  // Remove orphan ); block
  for (var i = 1; i < lines.length - 1; i++) {
    var l = lines[i].trim();
    if (l === ');') {
      var prevNonEmpty = i - 1;
      while (prevNonEmpty >= 0 && lines[prevNonEmpty].trim() === '') prevNonEmpty--;
      var prev = prevNonEmpty >= 0 ? lines[prevNonEmpty].trim() : '';
      var next = lines[i + 1] ? lines[i + 1].trim() : '';
      if (prev.endsWith('}') && next !== '}') {
        var end = i + 1;
        while (end < lines.length) {
          var t = lines[end].trim();
          if (t === '});' || t === '}') { end++; break; }
          end++;
        }
        lines.splice(i, end - i);
        log('  [' + tool + '] Removed orphan ); block');
        i--;
      }
    }
  }
  
  // Find startGame and add } after its last statement
  var sg = -1;
  for (var j = 0; j < lines.length; j++) {
    if (/^\s*function startGame\s*\(/.test(lines[j])) { sg = j; break; }
  }
  if (sg === -1) return null;
  
  // Find next function after startGame
  var nextFuncLine = -1;
  for (var nf = sg + 1; nf < lines.length; nf++) {
    if (/^function\s+\w+/.test(lines[nf].trim())) { nextFuncLine = nf; break; }
  }
  
  // Last real statement before next function
  var lastStmtLine = nextFuncLine !== -1 ? nextFuncLine - 1 : sg + 1;
  while (lastStmtLine > sg && (lines[lastStmtLine].trim() === '' || lines[lastStmtLine].trim() === '}')) lastStmtLine--;
  
  var sgIndent = (lines[sg].match(/^(\s*)/) || ['',''])[1];
  lines.splice(lastStmtLine + 1, 0, sgIndent + '}');
  log('  [' + tool + '] Added closing } for startGame after line ' + (lastStmtLine + 1));
  
  return lines.join('\n');
}

// ─── Fix task-list ──────────────────────────────────────────────────────────
function fixTaskList(content, tool) {
  var lines = toLines(content);
  
  // Remove orphaned } + cont.appendChild junk
  for (var k = 1; k < lines.length - 1; k++) {
    var lk = lines[k].trim();
    if (lk === '}') {
      var nextK = lines[k + 1] || '';
      var nextKtrim = nextK.trim();
      if (nextKtrim === '' || nextKtrim.startsWith('function ') || nextKtrim.startsWith('/*')) continue;
      if (nextK.includes && nextK.includes('cont.appendChild')) {
        var endK = k + 1;
        while (endK < lines.length) {
          var tK = lines[endK].trim();
          if (tK === '' || tK.startsWith('function ') || tK.startsWith('/*') || tK.startsWith('//')) break;
          endK++;
        }
        if (endK < lines.length && lines[endK].trim() === '}') endK++;
        lines.splice(k, endK - k);
        log('  [' + tool + '] Removed orphaned } + junk at lines ' + (k+1) + '–' + endK);
        k--;
      }
    }
  }
  
  // Find startGame
  var sg = -1;
  for (var j = 0; j < lines.length; j++) {
    if (/^\s*function startGame\s*\(/.test(lines[j])) { sg = j; break; }
  }
  if (sg === -1) return null;
  
  // Find next function after startGame
  var nextFuncLine = -1;
  for (var nf = sg + 1; nf < lines.length; nf++) {
    if (/^function\s+\w+/.test(lines[nf].trim())) { nextFuncLine = nf; break; }
  }
  
  // Last real statement
  var lastStmtLine = nextFuncLine !== -1 ? nextFuncLine - 1 : sg + 1;
  while (lastStmtLine > sg && (lines[lastStmtLine].trim() === '' || lines[lastStmtLine].trim() === '}')) lastStmtLine--;
  
  var sgIndent = (lines[sg].match(/^(\s*)/) || ['',''])[1];
  // Check if there's already a } on the next line
  if (lines[lastStmtLine + 1].trim() !== '}') {
    lines.splice(lastStmtLine + 1, 0, sgIndent + '}');
    log('  [' + tool + '] Added closing } for startGame');
  } else {
    log('  [' + tool + '] startGame already has closing }');
  }
  
  return lines.join('\n');
}

// ─── Fix ecos ──────────────────────────────────────────────────────────────
function fixEcos(content, tool) {
  var lines = toLines(content);
  
  // Remove orphan string literal block
  for (var i = 1; i < lines.length - 1; i++) {
    var l = lines[i].trim();
    if (l === '' || l.startsWith('//')) continue;
    var prevNonEmpty = i - 1;
    while (prevNonEmpty >= 0 && lines[prevNonEmpty].trim() === '') prevNonEmpty--;
    var prev = prevNonEmpty >= 0 ? lines[prevNonEmpty].trim() : '';
    if (!prev.endsWith('}')) continue;
    
    var isOrphan = false;
    var end = i;
    
    if (l.charAt(0) === "'" || l.charAt(0) === '"' || l.charAt(0) === '`') {
      while (end < lines.length) {
        var t2 = lines[end].trim();
        if (t2 === '});' || t2 === '}') { end++; break; }
        end++;
      }
      isOrphan = true;
    }
    
    if (isOrphan) {
      lines.splice(i, end - i);
      log('  [' + tool + '] Removed orphan string block at lines ' + (i+1) + '–' + end);
      i--;
    }
  }
  
  // Find startGame
  var sg = -1;
  for (var j = 0; j < lines.length; j++) {
    if (/^\s*function startGame\s*\(/.test(lines[j])) { sg = j; break; }
  }
  if (sg === -1) return null;
  
  var nextFuncLine = -1;
  for (var nf = sg + 1; nf < lines.length; nf++) {
    if (/^function\s+\w+/.test(lines[nf].trim())) { nextFuncLine = nf; break; }
  }
  
  var lastStmtLine = nextFuncLine !== -1 ? nextFuncLine - 1 : sg + 1;
  while (lastStmtLine > sg && (lines[lastStmtLine].trim() === '' || lines[lastStmtLine].trim() === '}')) lastStmtLine--;
  
  var sgIndent = (lines[sg].match(/^(\s*)/) || ['',''])[1];
  
  // Check if renderProgress is inside startGame at 0 indentation (needs fixing)
  var rpInsideLine = -1;
  for (var rp = sg + 1; rp < (nextFuncLine !== -1 ? nextFuncLine : lines.length); rp++) {
    if (/^function\s+renderProgress\s*\(/.test(lines[rp].trim())) { rpInsideLine = rp; break; }
  }
  
  if (rpInsideLine !== -1) {
    var rpIndent = (lines[rpInsideLine].match(/^(\s*)/) || ['',''])[1];
    if (rpIndent.length === 0) {
      // Fix indentation
      var rpEnd = -1;
      var rpDepth = 0;
      for (var rpe = rpInsideLine; rpe < lines.length; rpe++) {
        for (var rpk = 0; rpk < lines[rpe].length; rpk++) {
          if (lines[rpe][rpk] === '{') rpDepth++;
          else if (lines[rpe][rpk] === '}') { rpDepth--; if (rpDepth === 0) { rpEnd = rpe; break; } }
        }
        if (rpEnd !== -1) break;
      }
      if (rpEnd !== -1) {
        for (var fix = rpInsideLine; fix <= rpEnd; fix++) {
          lines[fix] = sgIndent + lines[fix].trim();
        }
        log('  [' + tool + '] Fixed renderProgress indentation');
      }
    }
  }
  
  if (lines[lastStmtLine + 1].trim() !== '}') {
    lines.splice(lastStmtLine + 1, 0, sgIndent + '}');
    log('  [' + tool + '] Added closing } for startGame');
  }
  
  return lines.join('\n');
}

// ─── Dispatch ──────────────────────────────────────────────────────────────
var PATTERN_A = ['categories', 'healthy-food', 'sentence', 'times-of-day'];
var PATTERN_B = ['doctor-visit', 'first-aid-kit', 'friends', 'post-or-not', 'resilience', 'self-esteem', 'signs', 'situations', 'street', 'tracing'];
var PATTERN_C = ['task-list'];
var ECOS = ['ecos'];
var ALL = PATTERN_A.concat(PATTERN_B).concat(PATTERN_C).concat(ECOS);

for (var t = 0; t < ALL.length; t++) {
  var tool = ALL[t];
  var appjs = path.join(TOOLS_DIR, tool, 'app.js');
  if (!fs.existsSync(appjs)) { FAILED.push(tool + ' (not found)'); continue; }
  
  log('Processing: ' + tool);
  var orig = fs.readFileSync(appjs, 'utf8');
  backup(appjs);
  
  var fixed = null;
  if (PATTERN_A.indexOf(tool) !== -1) fixed = fixCategoriesFamily(orig, tool);
  else if (PATTERN_B.indexOf(tool) !== -1) fixed = fixDoctorFamily(orig, tool);
  else if (PATTERN_C.indexOf(tool) !== -1) fixed = fixTaskList(orig, tool);
  else if (ECOS.indexOf(tool) !== -1) fixed = fixEcos(orig, tool);
  
  if (fixed === null) { FAILED.push(tool + ' (fix returned null)'); continue; }
  
  if (validate(fixed, tool)) {
    fs.writeFileSync(appjs, fixed, 'utf8');
    FIXED.push(tool);
    log('  [' + tool + '] ✓ FIXED and saved');
  } else {
    log('  [' + tool + '] ✗ Validation failed, NOT saved');
    FAILED.push(tool);
  }
}

console.log('\n=== SUMMARY ===');
log('\n=== SUMMARY ===');
log('Fixed: ' + FIXED.length + '/' + ALL.length);
if (FIXED.length) log('  ' + FIXED.join(', '));
if (FAILED.length) log('Failed (' + FAILED.length + '): ' + FAILED.join(', '));
