// scripts/_test-pistas.js — quick sanity test for pista heuristic.
'use strict';

var fs = require('fs');
var src = fs.readFileSync('scripts/_add-chat-pistas.js', 'utf8');
var m = src.match(/function generarPista\([\s\S]*?\n\}/);
if (!m) { console.error('no match'); process.exit(1); }
var fn = new Function('aviso', 'locale', m[0] + '\nreturn generarPista(aviso, locale);');

var muestras = [
  ['Devolver el insulto no hace que pare, y puede empeorar las cosas. Mejor cuéntaselo a una persona de confianza.', 'es'],
  ['Quedarte callado no hace que el acoso pare solo. Contarlo a alguien de confianza sí ayuda.', 'es'],
  ['Borrarlo no hace que pare. Es mejor guardarlo y contarlo, para que una persona de confianza pueda ayudar.', 'es'],
  ['Responder con otro mote alarga la pelea y no arregla nada. Mejor cuéntaselo a alguien de confianza.', 'es'],
  ['No hace falta fingir que no duele. Si te molesta, cuenta. Trabajar a tu ritmo no es motivo de burla.', 'es'],
  ['Dejar de mirar el grupo te aísla del trabajo, y la burla sigue. Contarlo puede pararla de verdad.', 'es'],
  ['Dejar de hablar por miedo a la burla te quita tu sitio. El problema es de quien se burla, no tuyo.', 'es'],
  ['Pasarle la burla a otra persona hace más daño. Mejor cuéntaselo a una persona de confianza.', 'es'],
  ['No tienes que pedir perdón por aprender a tu ritmo. Quien se burla es quien actúa mal.', 'es'],
  ['Devolver insultos convierte el juego en una pelea. Silenciar y contarlo funciona mejor.', 'es'],
  ['No tienes que renunciar a lo que te gusta. El que actúa mal es él, no tú.', 'es'],
  ['Si obedeces a una amenaza, vendrán más. Contarlo es lo que las corta.', 'es'],
  ['Excluir a otra persona no arregla que te hayan excluido a ti. Mejor cuéntaselo a una persona de confianza.', 'es'],
  ['Si te duele, sí importa. No hace falta que lo soportes solo o sola.', 'es'],
  ['No tienes que rogar para que te traten bien. Cuéntaselo a alguien de confianza.', 'es'],
  ['If you give them your password, they can read your messages.', 'en'],
  ['Saying nothing will not make the bullying stop on its own.', 'en'],
  ['Hitting back only makes the fight worse.', 'en'],
  ['It is better to tell a trusted person than to keep the secret.', 'en']
];

muestras.forEach(function (m) {
  var pista = fn(m[0], m[1]);
  console.log('[' + m[1].toUpperCase() + ']');
  console.log('  aviso:  ' + m[0]);
  console.log('  pista:  ' + pista);
  console.log();
});