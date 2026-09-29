const fs = require('fs');

function analyzeFile(name, src) {
  const lines = fs.readFileSync(src, 'utf8').split('\n');
  let depth = 0;
  let sgStart = -1;
  let lastDepth1Line = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // Count braces (but not in strings/comments)
    for (const c of l) {
      if (c === '{') depth++;
      else if (c === '}') depth--;
    }
    if (l.includes('function startGame')) {
      sgStart = i;
      console.log(name + ': startGame at line ' + (i+1) + ', opens depth=' + depth);
    }
    if (sgStart >= 0 && depth === 1) {
      lastDepth1Line = i;
    }
    if (sgStart >= 0 && depth === 0) {
      console.log(name + ': startGame closes at line ' + (i+1) + ' (depth dropped to 0)');
      console.log('  Last depth-1 line before close: ' + (lastDepth1Line+1));
      console.log('  Content at last depth-1: ' + (lines[lastDepth1Line]||'(none)').substring(0,80));
      sgStart = -1; // Stop tracking
    }
  }
  console.log(name + ': File ends at depth ' + depth);
}

analyzeFile('ecos', 'tools/ecos/app.js');
console.log('---');
analyzeFile('tracing', 'tools/tracing/app.js');
