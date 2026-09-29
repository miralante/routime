/* ============================================================
   Routime — Fix remaining 15 corrupted app.js files (v6)
   
   Strategy: For each tool, read the original file, apply a 
   targeted string replacement, validate, save.
   
   The corruption pattern for most files:
   - Orphan block between banco() and startGame()
   - startGame() missing its closing }
   - renderProgress() is INSIDE startGame() (at 0 spaces)
   - render() is INSIDE startGame() (at 2 spaces)
   - File-scope functions are intact
   
   Fix: Insert the missing } for startGame after its last statement,
   keeping ALL functions in place (they become file-scope by virtue
   of the added }).
   
   Simple approach: use regex to find the specific corrupted sections
   and insert the missing }.
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
function backup(orig) { var bak = orig + '.bak16'; if (!fs.existsSync(bak)) fs.copyFileSync(orig, bak); }
function validate(content, tool) {
  try { new Function(content); return true; }
  catch (e) { log('  [' + tool + '] STILL BROKEN: ' + e.message.split('\n')[0]); return false; }
}

// ─── Generic fixer: uses line-by-line to find and fix the corruption ─────
// Reads file, normalizes line endings, processes, validates, saves.
function genericFix(tool) {
  var appjs = path.join(TOOLS_DIR, tool, 'app.js');
  if (!fs.existsSync(appjs)) return false;
  
  var content = fs.readFileSync(appjs, 'utf8');
  var lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  
  // Step 1: Find and remove the orphaned block.
  // Pattern A: Orphan /* ---- Pantalla inicial ---- */ block (with string literal)
  // Pattern B: Orphan ); block
  // Pattern C: Orphan } + cont.appendChild junk
  // Pattern D: Orphan string literal starting with '
  
  var removedOrphan = false;
  for (var i = 1; i < lines.length - 1; i++) {
    var l = lines[i].trim();
    if (l === '' || l.startsWith('//')) continue;
    
    // Find previous non-empty line
    var prevNonEmpty = i - 1;
    while (prevNonEmpty >= 0 && lines[prevNonEmpty].trim() === '') prevNonEmpty--;
    if (prevNonEmpty < 0) continue;
    var prev = lines[prevNonEmpty].trim();
    if (!prev.endsWith('}')) continue;
    
    // Is this the start of an orphan block?
    var isOrphan = false;
    var end = i;
    
    // Case: block comment (start-screen header)
    if (/^\/\*\s*-{2,4}\s*(Pantalla[\s-][Ii]nicial|Pantalla|Inicio)\s*-{2,4}\s*\*\//.test(l)) {
      while (end < lines.length) {
        var t = lines[end].trim();
        if (t === '});' || t === '}') { end++; break; }
        end++;
      }
      // Also remove a trailing } if present (the closing brace of the removed function)
      if (end < lines.length && lines[end].trim() === '}') end++;
      isOrphan = true;
    }
    // Case: standalone ); at file scope
    else if (l === ');') {
      while (end < lines.length) {
        var t2 = lines[end].trim();
        if (t2 === '});' || t2 === '}') { end++; break; }
        end++;
      }
      // Also remove trailing } if present
      if (end < lines.length && lines[end].trim() === '}') end++;
      isOrphan = true;
    }
    // Case: orphaned } + cont.appendChild junk
    else if (l === '}') {
      var nextL = lines[i + 1] ? lines[i + 1].trim() : '';
      if (nextL !== '' && !nextL.startsWith('function ') && !nextL.startsWith('/*') && !nextL.startsWith('//') && nextL.includes('cont')) {
        var endJunk = i + 1;
        while (endJunk < lines.length) {
          var tj = lines[endJunk].trim();
          if (tj === '' || tj.startsWith('function ') || tj.startsWith('/*') || tj.startsWith('//')) break;
          endJunk++;
        }
        if (endJunk < lines.length && lines[endJunk].trim() === '}') endJunk++;
        end = endJunk;
        isOrphan = true;
      }
    }
    // Case: string literal fragment starting with '
    else if (l.charAt(0) === "'" || l.charAt(0) === '"' || l.charAt(0) === '`') {
      while (end < lines.length) {
        var t3 = lines[end].trim();
        if (t3 === '});' || t3 === '}') { end++; break; }
        end++;
      }
      // Also remove trailing } if present
      if (end < lines.length && lines[end].trim() === '}') end++;
      isOrphan = true;
    }
    
    if (isOrphan) {
      var snippet = lines.slice(i, Math.min(i + 2, end)).map(function(x){ return x.trim(); }).join(' | ');
      lines.splice(i, end - i);
      log('  [' + tool + '] Removed orphan block at lines ' + (i+1) + '–' + end + ': ' + snippet);
      removedOrphan = true;
      i--; // re-check
    }
  }
  
  // Step 2: Find startGame() and its indentation
  var sg = -1;
  for (var si = 0; si < lines.length; si++) {
    if (/^\s*function startGame\s*\(/.test(lines[si])) { sg = si; break; }
  }
  if (sg === -1) { log('  [' + tool + '] startGame() not found!'); return false; }
  
  var sgIndent = (lines[sg].match(/^(\s*)/) || ['',''])[1];
  
  // Step 3: Find the LAST line of startGame's body (last real statement before
  // the next file-scope function OR the first nested function that should be at file scope).
  // We look for the pattern: last actual statement of startGame followed by
  // a function declaration that SHOULD be at file scope.
  
  // Strategy: find the next function declaration (at file-scope indent = sgIndent level)
  // The last statement of startGame is the line just before that function.
  var nextFuncIdx = -1;
  for (var nfi = sg + 1; nfi < lines.length; nfi++) {
    var nft = lines[nfi].trim();
    if (/^function\s+\w+/.test(nft)) {
      // Check if this function is at file-scope indent (≤ sgIndent level + 1)
      var nfIndent = (lines[nfi].match(/^(\s*)/) || ['',''])[1].length;
      if (nfIndent <= sgIndent.length + 2) {
        nextFuncIdx = nfi;
        break;
      }
    }
  }
  
  // The closing } of startGame should go after the last REAL statement,
  // not after the last line of a nested function body.
  // If the next function is nested (higher indent), find the statement that
  // calls it.
  
  var insertAfter = sg + 1; // default: first line after function declaration
  
  // The key insight: in the corrupted files, startGame() is ALWAYS missing its closing }.
  // After removing the orphan, the next function (at any indent) is where startGame's
  // closing } should be inserted.
  // 
  // CORRECT approach: 
  // 1. Find the last STATEMENT line of startGame (not a function declaration or nested function body)
  // 2. Insert } after that line
  //
  // A function declaration INSIDE startGame has indent > sgIndent.
  // The first such function marks where to stop (it's the first thing AFTER startGame).
  //
  // Strategy: find the FIRST function declaration after sg whose indent > sgIndent.
  // The last REAL statement is the line just before that function.
  
  // First, find ALL function declarations after sg
  var funcDeclarations = [];
  for (var fdi = sg + 1; fdi < lines.length; fdi++) {
    var fdt = lines[fdi].trim();
    if (/^function\s+\w+/.test(fdt)) {
      var fdIndent = (lines[fdi].match(/^(\s*)/) || ['',''])[1].length;
      funcDeclarations.push({ line: fdi, name: fdt.match(/^function\s+(\w+)/)[1], indent: fdIndent });
    }
  }
  
  if (funcDeclarations.length === 0) {
    // No functions found after startGame. Just add } after last statement.
    for (var li = lines.length - 1; li > sg; li--) {
      var lt = lines[li].trim();
      if (lt !== '' && !lt.startsWith('//') && !(lt.startsWith('/*') && lt.endsWith('*/'))) {
        insertAfter = li; break;
      }
    }
  } else {
    // Find the FIRST function declaration that is MORE indented than sgIndent
    // (i.e., a function INSIDE startGame's body)
    var insideFunc = null;
    for (var af = 0; af < funcDeclarations.length; af++) {
      if (funcDeclarations[af].indent > sgIndent.length) {
        insideFunc = funcDeclarations[af];
        break;
      }
    }
    
    if (insideFunc !== null) {
      // There's a nested function inside startGame.
      // startGame is missing its closing }.
      // The last real statement is the line just before this nested function.
      insertAfter = insideFunc.line - 1;
      // Skip empty lines
      while (insertAfter > sg && lines[insertAfter].trim() === '') insertAfter--;
    } else {
      // All functions have ≤ sgIndent indent. startGame might be OK.
      // Check if there's a closing } between sg and the first function
      var hasClose = false;
      var firstFuncLine = funcDeclarations[0].line;
      for (var ci = sg; ci < firstFuncLine; ci++) {
        if (lines[ci].trim() === '}') { hasClose = true; break; }
      }
      if (!hasClose) {
        // startGame is missing its }
        insertAfter = firstFuncLine - 1;
        while (insertAfter > sg && lines[insertAfter].trim() === '') insertAfter--;
      } else {
        log('  [' + tool + '] startGame looks OK (found closing } before first function)');
        return lines.join('\n');
      }
    }
  }
  
  // Check if there's already a } at insertAfter + 1
  if (insertAfter + 1 < lines.length && lines[insertAfter + 1].trim() === '}') {
    log('  [' + tool + '] startGame already has closing } at line ' + (insertAfter + 2));
    return lines.join('\n');
  }
  
  log('  [' + tool + '] Inserting closing } after line ' + (insertAfter + 1) + ' (was: ' + JSON.stringify(lines[insertAfter].trim().substring(0, 50)) + ')');
  
  // Also: if the next line (after insertAfter) is a function at 0 spaces indent
  // (renderProgress nested inside startGame at 0 indent), that's OK - it becomes
  // file scope by virtue of the added }. But if it's at sgIndent indent (2 spaces),
  // it's also fine - it also becomes file scope.
  
  // Insert the closing }
  lines.splice(insertAfter + 1, 0, sgIndent + '}');
  
  return lines.join('\n');
}

// ─── Dispatch ──────────────────────────────────────────────────────────────
var ALL_TOOLS = [
  'categories', 'healthy-food', 'sentence', 'times-of-day',
  'doctor-visit', 'first-aid-kit', 'friends', 'post-or-not',
  'resilience', 'self-esteem', 'signs', 'situations', 'street', 'tracing',
  'ecos'
];

for (var t = 0; t < ALL_TOOLS.length; t++) {
  var tool = ALL_TOOLS[t];
  var appjs = path.join(TOOLS_DIR, tool, 'app.js');
  if (!fs.existsSync(appjs)) { FAILED.push(tool + ' (not found)'); continue; }
  
  log('Processing: ' + tool);
  backup(appjs);
  
  var fixed = genericFix(tool);
  if (fixed === false) { FAILED.push(tool + ' (genericFix returned false)'); continue; }
  
  // Debug: show first few lines of the fixed content
  {
    var debugLines = fixed.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    log('  [' + tool + '] DEBUG: fixed content has ' + debugLines.length + ' lines');
    var sgIdx = -1;
    for (var di = 0; di < debugLines.length; di++) {
      if (/^\s*function startGame\s*\(/.test(debugLines[di])) { sgIdx = di; break; }
    }
    if (sgIdx !== -1) {
      log('  [' + tool + '] DEBUG: startGame at line ' + (sgIdx+1));
      for (var dj = sgIdx; dj < Math.min(sgIdx + 10, debugLines.length); dj++) {
        log('    L' + (dj+1) + ': ' + JSON.stringify(debugLines[dj].substring(0,80)));
      }
    }
    // Also try to validate and get exact error
    try { new Function(debugLines.join('\n')); }
    catch(e) {
      log('  [' + tool + '] VALIDATION ERROR: ' + e.message.split('\n')[0]);
      // Find where the error is
      var match = e.message.match(/line (\d+)/i);
      if (match) {
        var errLine = parseInt(match[1]);
        log('  [' + tool + '] Error at line ' + errLine + ': ' + JSON.stringify(debugLines[errLine - 1] || 'OUT OF RANGE'));
        // Show context
        for (var cx = Math.max(0, errLine - 3); cx < Math.min(debugLines.length, errLine + 2); cx++) {
          log('    L' + (cx+1) + ': ' + JSON.stringify(debugLines[cx].substring(0,80)));
        }
      }
    }
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

console.log('\n=== SUMMARY ===');
log('\n=== SUMMARY ===');
log('Fixed: ' + FIXED.length + '/' + ALL_TOOLS.length);
if (FIXED.length) log('  ' + FIXED.join(', '));
if (FAILED.length) log('Failed (' + FAILED.length + '): ' + FAILED.join(', '));
