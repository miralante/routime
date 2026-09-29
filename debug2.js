const fs = require('fs');

// Check ecos
const ecos = fs.readFileSync('tools/ecos/app.bak16', 'utf8');
const ecosLines = ecos.split('\n');
let inSG = false, sgLine = -1, depth = 0;
for (let i = 0; i < ecosLines.length; i++) {
  if (ecosLines[i].includes('function startGame')) {
    inSG = true; sgLine = i; depth = 1; continue;
  }
  if (!inSG) continue;
  for (let c of ecosLines[i]) { if (c === '{') depth++; else if (c === '}') depth--; }
  if (depth === 0) { console.log('ecos startGame ends at line', i+1); break; }
}
console.log('\n=== ECOS startGame region (lines ' + (sgLine+1) + ' onwards) ===');
for (let i = sgLine; i < sgLine + 60 && i < ecosLines.length; i++) {
  console.log(String(i+1).padStart(4) + '|' + ecosLines[i]);
}

// Check tracing - find renderProgress at col 0 after startGame
console.log('\n=== TRACING orphaned region (lines 145-175) ===');
const tracing = fs.readFileSync('tools/tracing/app.js', 'utf8');
const tLines = tracing.split('\n');
for (let i = 144; i < 175 && i < tLines.length; i++) {
  console.log(String(i+1).padStart(4) + '|' + tLines[i]);
}
