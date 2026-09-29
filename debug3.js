const fs = require('fs');
['ecos', 'tracing'].forEach(name => {
  const src = 'tools/' + name + '/app.js';
  try {
    new Function(fs.readFileSync(src, 'utf8'));
    console.log(name + ': VALID');
  } catch (e) {
    const m = e.message;
    // Try to find the line number from the error
    const lines = fs.readFileSync(src, 'utf8').split('\n');
    // Common patterns: "line X" or position
    let hint = m;
    // Try to parse position from "at position N"
    const posMatch = m.match(/position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1]);
      let cum = 0;
      for (let i = 0; i < lines.length; i++) {
        cum += lines[i].length + 1;
        if (cum > pos) {
          hint = 'around line ' + (i+1) + ': ' + lines[i].substring(0,80);
          break;
        }
      }
    }
    console.log(name + ': ' + m + ' | ' + hint);
  }
});
