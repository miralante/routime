var fs = require('fs');
var content = fs.readFileSync('tools/categories/app.js', 'utf8');
var lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
console.log('Total lines:', lines.length);
console.log('Looking for orphan block...');
for (var i = 1; i < lines.length - 1; i++) {
  var l = lines[i].trim();
  if (l === '' || l.startsWith('//')) continue;
  // Find previous non-empty line
  var prevNonEmpty = i - 1;
  while (prevNonEmpty >= 0 && lines[prevNonEmpty].trim() === '') prevNonEmpty--;
  var prev = prevNonEmpty >= 0 ? lines[prevNonEmpty].trim() : '';
  if (prev.endsWith('}')) {
    var reComment = /^\/\*\s*-{2,4}\s*(Pantalla|Inicio|Pantalla inicial)/;
    var isComment = reComment.test(l);
    var isStrDelim = (l === "'" || l === '"');
    if (isComment || isStrDelim) {
      console.log('FOUND orphan at line', i+1, ':', JSON.stringify(l.substring(0,60)));
      console.log('  prev non-empty line', prevNonEmpty+1, ':', JSON.stringify(prev));
      console.log('  prev endsWith("}"):', prev.endsWith('}'));
      // Find end of orphan
      var end = i;
      while (end < lines.length) {
        var t = lines[end].trim();
        if (t === '});' || t === '}') { end++; break; }
        end++;
      }
      console.log('  would remove lines', i+1, 'to', end, '=', end-i, 'lines');
      break;
    }
  }
}
