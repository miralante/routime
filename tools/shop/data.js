/* ============================================================
   Datos: La Tienda (autonomía — usar el dinero en la vida real).
   Tres actividades desde un menú (regla 10):

   - 'Una compra' (tienda): simulación guiada de una compra completa
     en 3 steps (¿te llega? → paga → ¿está bien el cambio?). Los
     casos se GENERAN al vuelo con el banco PRODUCTOS y la escalera
     NIVELES_IMPORTE. Regla 13: única variable = la finura de los
     importes (enteros → con ,50 → con décimos).

   - '¿Qué me queda?' (quedame): control del gasto con resta
     encadenada (empiezas con un billete y vas comprando). Los
     gastos son SIEMPRE el precio real del producto del banco, para
     no contradecir los precios de referencia de '¿Mucho o poco?'.
     Misma escalera NIVELES_IMPORTE (regla 13).

   - '¿Mucho o poco?' (mucho): sentido del precio. El precio del
     banco es la REFERENCIA de lo que algo cuesta normalmente; se
     muestra o el precio real ("está bien") o uno inflado
     ("es demasiado"). Regla 13: única variable = lo evidente del
     exceso (multiplicador ×10 → ×5 → ×3), ver MUCHO_BASE.

   ▶ PARA AÑADIR UN PRODUCTO: una línea en PRODUCTOS con
     { picto, clave, precio (euros, múltiplo de 0.05, REALISTA:
     es el precio de referencia) } + el name en NOMBRES.es/en.
     El nivel se deduce solo del precio (nivelDePrecio) y el
     producto alimenta las tres actividades a la vez.

   El dinero visual vive en assets/js/dinero.js (App.dinero).
   Importes en céntimos (enteros). app.js usa
   DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */

/* Shared amounts ladder (rule 13: the only variable is the
   granularity; 'paso' is the multiple in cents, in bucket). */
const NIVELES_IMPORTE = [
  { id: 1, paso: 100 },
  { id: 2, paso: 50 },
  { id: 3, paso: 10 }
];

/* Escalera de '¿Mucho o poco?': lo evidente del exceso. */
const MUCHO_BASE = [
  { id: 1, mult: 10 },
  { id: 2, mult: 5 },
  { id: 3, mult: 3 }
];

/* Escalera de '¿Es de fiar?': lo evidente de la ganga sospechosa
   (regla 13: única variable = el divisor del precio). */
const FIAR_BASE = [
  { id: 1, div: 10 },
  { id: 2, div: 5 },
  { id: 3, div: 3 }
];

/* El nivel de un producto se deduce SOLO de su precio. */
function nivelDePrecio(cent) {
  if (cent % 100 === 0) return 1;   /* whole euros */
  if (cent % 50 === 0) return 2;    /* ends in ,50 */
  return 3;                         /* tenths (,10 … ,90) */
}

/* ▶ Banco de productos con precios de referencia REALISTAS. */
const PRODUCTOS = [
  /* Nivel 1 — precios enteros */
  { picto: '🥛', clave: 'leche', precio: 1 },
  { picto: '📓', clave: 'cuaderno', precio: 2 },
  { picto: '🧢', clave: 'gorra', precio: 6 },
  { picto: '⚽', clave: 'balon', precio: 8 },
  { picto: '📕', clave: 'libro', precio: 10 },
  { picto: '🎒', clave: 'mochila', precio: 15 },
  { picto: '🎮', clave: 'videojuego', precio: 25 },
  { picto: '👟', clave: 'zapatillas', precio: 35 },
  /* Nivel 2 — precios con ,50 */
  { picto: '🍪', clave: 'galletas', precio: 1.50 },
  { picto: '🧃', clave: 'zumo', precio: 2.50 },
  { picto: '🍦', clave: 'helado', precio: 2.50 },
  { picto: '🥪', clave: 'bocadillo', precio: 3.50 },
  { picto: '🧴', clave: 'gel', precio: 4.50 },
  { picto: '☕', clave: 'taza', precio: 5.50 },
  { picto: '🧸', clave: 'peluche', precio: 7.50 },
  /* Level 3 — prices with tenths */
  { picto: '✏️', clave: 'sacapuntas', precio: 0.60 },
  { picto: '🍬', clave: 'caramelos', precio: 0.70 },
  { picto: '🍎', clave: 'manzana', precio: 0.90 },
  { picto: '🥐', clave: 'cruasan', precio: 1.10 },
  { picto: '🥖', clave: 'barraPan', precio: 1.20 },
  { picto: '🍫', clave: 'chocolatina', precio: 1.80 },
  { picto: '🔋', clave: 'pilas', precio: 2.60 },
  { picto: '🧴', clave: 'champu', precio: 3.90 },
  { picto: '🧣', clave: 'bufanda', precio: 6.90 }
];

/* Nombre de cada producto, por idioma (clave -> name). */
const NOMBRES = {
  es: {
    leche: 'La leche', cuaderno: 'El cuaderno', gorra: 'La gorra', balon: 'El balón',
    libro: 'El libro', mochila: 'La mochila', videojuego: 'El videojuego', zapatillas: 'Las zapatillas',
    galletas: 'Las galletas', zumo: 'El zumo', helado: 'El helado', bocadillo: 'El bocadillo',
    gel: 'El gel de ducha', taza: 'La taza', peluche: 'El peluche',
    sacapuntas: 'El sacapuntas', caramelos: 'Los caramelos', manzana: 'La manzana',
    cruasan: 'El cruasán', barraPan: 'La barra de pan', chocolatina: 'La chocolatina',
    pilas: 'Las pilas', champu: 'El champú', bufanda: 'La bufanda'
  },
  en: {
    leche: 'The milk', cuaderno: 'The notebook', gorra: 'The cap', balon: 'The ball',
    libro: 'The book', mochila: 'The backpack', videojuego: 'The video game', zapatillas: 'The trainers',
    galletas: 'The biscuits', zumo: 'The juice', helado: 'The ice cream', bocadillo: 'The sandwich',
    gel: 'The shower gel', taza: 'The mug', peluche: 'The teddy bear',
    sacapuntas: 'The pencil sharpener', caramelos: 'The sweets', manzana: 'The apple',
    cruasan: 'The croissant', barraPan: 'The loaf of bread', chocolatina: 'The chocolate bar',
    pilas: 'The batteries', champu: 'The shampoo', bufanda: 'The scarf'
  }
};

/* Name and description of each level, per language. */
const NIVELES_TXT = {
  es: {
    importe: { 1: 'Importes enteros', 2: 'Con 50 céntimos', 3: 'Con 10 y 20 céntimos' },
    mucho: { 1: 'Diferencias enormes', 2: 'Diferencias grandes', 3: 'Diferencias claras' },
    fiar: { 1: 'Gangas imposibles', 2: 'Gangas enormes', 3: 'Gangas claras' }
  },
  en: {
    importe: { 1: 'Whole amounts', 2: 'With 50 cents', 3: 'With 10 and 20 cents' },
    mucho: { 1: 'Huge differences', 2: 'Big differences', 3: 'Clear differences' },
    fiar: { 1: 'Impossible bargains', 2: 'Huge bargains', 3: 'Clear bargains' }
  }
};

function construirTienda(loc) {
  var txt = NIVELES_TXT[loc] || NIVELES_TXT.es;
  var nombres = NOMBRES[loc] || NOMBRES.es;
  var prefijo = loc === 'en' ? 'Level ' : 'Nivel ';

  var productos = PRODUCTOS.map(function (p) {
    var cent = Math.round(p.precio * 100);
    return { picto: p.picto, name: nombres[p.clave] || p.clave, precioCent: cent, bucket: nivelDePrecio(cent) };
  });

  var importe = NIVELES_IMPORTE.map(function (n) {
    return { id: n.id, name: prefijo + n.id, descripcion: txt.importe[n.id], paso: n.paso };
  });

  var mucho = MUCHO_BASE.map(function (n) {
    return { id: n.id, name: prefijo + n.id, descripcion: txt.mucho[n.id], mult: n.mult };
  });

  var fiar = FIAR_BASE.map(function (n) {
    return { id: n.id, name: prefijo + n.id, descripcion: txt.fiar[n.id], div: n.div };
  });

  return {
    porRonda: 6,
    porRondaTienda: 3,
    productos: productos,
    importe: { niveles: importe },
    mucho: { niveles: mucho },
    fiar: { niveles: fiar }
  };
}

const DATA = {
  es: construirTienda('es'),
  en: construirTienda('en')
};
