/* ============================================================
   Routime — Constructores (datos)
   Bloques disponibles, tamaños de mundo y plantillas (modelos).

   - tamanos: los 3 tamaños de lienzo del modo libre. No son niveles
     de dificultad (no hay acierto/fallo en modo libre), solo cuánto
     espacio quiere la persona — por eso la paleta de bloques es
     SIEMPRE la misma (los 8 bloques) en cualquier tamaño.
   - plantillas: cada una lleva su propio gridSize (el lienzo se
     adapta al modelo elegido) y una matriz de ids de bloque
     (null = casilla libre). Ordenadas de más simple a más compleja.
   Los nombres visibles están en strings.js (claves plantilla<Nombre>,
   bloque<Id> — sin puntos: App.i18n.t() interpreta el punto como
   clave anidada y una clave plana 'plantilla.casita' NUNCA resuelve);
   aquí solo ids ASCII (sin acentos: 'cesped', no 'césped', porque el
   id se usa como clase CSS y como parte de clave i18n).
   ============================================================ */

var DATA = {};

/* Free-mode world sizes */
DATA.tamanos = [
  { id: 'pequeno', cols: 6, rows: 4 },
  { id: 'mediano', cols: 8, rows: 5 },
  { id: 'grande', cols: 10, rows: 6 }
];

/* Los 8 bloques, siempre todos disponibles. Se identifican por su
   textura CSS (clase bloque-<id>) y su aria-label (clave bloque<Id>
   en strings.js); no llevan pictograma. */
DATA.bloques = [
  { id: 'tierra' },
  { id: 'cesped' },
  { id: 'piedra' },
  { id: 'madera' },
  { id: 'agua' },
  { id: 'techo' },
  { id: 'ladrillo' },
  { id: 'arena' }
];

/* Templates (models to copy), from simplest to most complex */
DATA.plantillas = [
  {
    id: 'casita',
    gridSize: { cols: 6, rows: 4 },
    nombre: 'plantillaCasita',
    matriz: [
      [null, null, 'techo', 'techo', null, null],
      [null, 'madera', 'madera', 'madera', 'madera', null],
      [null, 'madera', 'madera', 'agua', 'madera', null],
      ['cesped', 'cesped', 'tierra', 'tierra', 'cesped', 'cesped']
    ]
  },
  {
    id: 'castillo',
    gridSize: { cols: 6, rows: 4 },
    nombre: 'plantillaCastillo',
    matriz: [
      ['piedra', 'piedra', 'piedra', 'piedra', 'piedra', 'piedra'],
      ['piedra', null, null, null, null, 'piedra'],
      ['piedra', 'piedra', 'piedra', 'piedra', 'piedra', 'piedra'],
      ['tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra']
    ]
  },
  {
    id: 'piscina',
    gridSize: { cols: 8, rows: 5 },
    nombre: 'plantillaPiscina',
    matriz: [
      ['cesped', 'cesped', 'cesped', 'cesped', 'cesped', 'cesped', 'cesped', 'cesped'],
      ['cesped', 'piedra', 'piedra', 'piedra', 'piedra', 'piedra', 'piedra', 'cesped'],
      ['cesped', 'piedra', 'agua', 'agua', 'agua', 'agua', 'piedra', 'cesped'],
      ['cesped', 'piedra', 'agua', 'agua', 'agua', 'agua', 'piedra', 'cesped'],
      ['cesped', 'cesped', 'piedra', 'piedra', 'piedra', 'piedra', 'cesped', 'cesped']
    ]
  },
  {
    id: 'puente',
    gridSize: { cols: 8, rows: 5 },
    nombre: 'plantillaPuente',
    matriz: [
      [null, null, null, null, null, null, null, null],
      [null, null, 'madera', 'madera', 'madera', 'madera', null, null],
      ['agua', 'agua', 'madera', 'madera', 'agua', 'agua', 'agua', 'agua'],
      ['agua', 'agua', 'agua', 'agua', 'agua', 'agua', 'agua', 'agua'],
      ['arena', 'arena', 'arena', 'arena', 'arena', 'arena', 'arena', 'arena']
    ]
  },
  {
    id: 'ciudad',
    gridSize: { cols: 10, rows: 6 },
    nombre: 'plantillaCiudad',
    matriz: [
      [null, null, null, null, null, null, null, null, null, null],
      ['piedra', 'techo', 'piedra', null, 'ladrillo', 'techo', 'ladrillo', null, 'madera', 'techo'],
      ['piedra', 'piedra', 'piedra', null, 'ladrillo', 'ladrillo', 'ladrillo', null, 'madera', 'madera'],
      ['tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra', 'tierra'],
      ['cesped', 'cesped', 'cesped', 'cesped', 'cesped', 'cesped', 'cesped', 'cesped', 'cesped', 'cesped'],
      [null, null, null, null, null, null, null, null, null, null]
    ]
  },
  {
    id: 'rio',
    gridSize: { cols: 10, rows: 6 },
    nombre: 'plantillaRio',
    matriz: [
      ['cesped', 'cesped', 'cesped', 'agua', 'agua', 'agua', 'agua', 'cesped', 'cesped', 'cesped'],
      ['cesped', 'madera', 'madera', 'agua', 'agua', 'agua', 'agua', 'piedra', 'piedra', 'piedra'],
      ['tierra', 'tierra', 'tierra', 'agua', 'agua', 'agua', 'agua', 'tierra', 'tierra', 'tierra'],
      ['tierra', null, null, 'agua', 'agua', 'agua', 'agua', null, null, 'tierra'],
      ['piedra', null, null, 'agua', 'agua', 'agua', 'agua', null, null, 'madera'],
      ['piedra', 'piedra', 'piedra', 'agua', 'agua', 'agua', 'agua', 'madera', 'madera', 'madera']
    ]
  }
];
