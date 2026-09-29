const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'tools');
const dirs = fs.readdirSync(toolsDir).filter(f => {
  return fs.statSync(path.join(toolsDir, f)).isDirectory();
});

let valid = 0, broken = 0;
dirs.forEach(name => {
  const src = path.join(toolsDir, name, 'app.js');
  if (!fs.existsSync(src)) { console.log(name + ': NO FILE'); broken++; return; }
  const src2 = fs.readFileSync(src, 'utf8');
  try {
    new Function(src2);
    console.log(name + ': VALID');
    valid++;
  } catch (e) {
    console.log(name + ': BROKEN - ' + e.message);
    broken++;
  }
});
console.log('\n' + valid + ' VALID, ' + broken + ' BROKEN');
