// Debug the exact regex in the fix script
var re = /^\/\*\s*-{2,4}\s*(Pantalla|[Pp]age? ?[Ii]nicial|[Ii]nicio)\s*-{2,4}\s*\*\//;
console.log('Regex source:', re.source);
console.log('');

// Test each branch
var s = '/* ---- Pantalla inicial ---- */';
console.log('Testing:', s);

// Try each branch separately
console.log('Branch 1 (Pantalla):', /^Pantalla$/.test('Pantalla inicial'.replace(/^.*?(\S+).*$/, '$1')));

var reBranch2 = /^[Pp]age? ?[Ii]nicial$/;
console.log('Branch 2 (Page inicial):', reBranch2.test('Pantalla inicial'.replace(/^.*?(\S+).*$/, '$1')));

// Full test
console.log('Full regex:', re.test(s));

// What's the actual capture group content?
var reMatch = s.match(re);
if (reMatch) {
  console.log('Match found! Group 1:', JSON.stringify(reMatch[1]));
} else {
  console.log('NO MATCH');
}

// Try to understand: what does 'Pantalla inicial' match in the alternation?
var reAlt = /(Pantalla|[Pp]age? ?[Ii]nicial|[Ii]nicio)/;
console.log('\nAlternation test:', reAlt.test('Pantalla inicial'));
console.log('Alternation match:', 'Pantalla inicial'.match(reAlt));

// Try: does 'Pantalla' match 'Pantalla' in the alternation?
console.log('\nPantalla alone:', reAlt.test('Pantalla'));
console.log('Page alone:', reAlt.test('Page'));
console.log('Page inicial:', reAlt.test('Page inicial'));
