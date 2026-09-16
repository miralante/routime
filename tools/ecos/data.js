/* ============================================================
   Datos: Ecos (memoria auditiva y ritmo — repetir secuencias).
   Formato: colores = [{ id, nombreKey, frecuencia }] (los 4
   paneles fijos del juego) y niveles = [{ id, nombreKey,
   descripcionKey, estrellas, longitud (steps por secuencia) }].
   nombreKey/descripcionKey apuntan a textos registrados en
   strings.js (App.i18n.t). Las frecuencias no dependen del idioma.
   Para ampliar: añadir niveles con otra longitud.
   app.js usa DATA[App.i18n.locale()].
   ============================================================ */
const COLORES = [
  { id: 'rojo', nombreKey: 'colorRojo', frecuencia: 261.63 },
  { id: 'azul', nombreKey: 'colorAzul', frecuencia: 329.63 },
  { id: 'verde', nombreKey: 'colorVerde', frecuencia: 392.0 },
  { id: 'amarillo', nombreKey: 'colorAmarillo', frecuencia: 523.25 }
];

const NIVELES = [
  { id: 1, nombreKey: 'nivel1', descripcionKey: 'descripcion3', estrellas: 1, longitud: 3 },
  { id: 2, nombreKey: 'nivel2', descripcionKey: 'descripcion4', estrellas: 2, longitud: 4 },
  { id: 3, nombreKey: 'nivel3', descripcionKey: 'descripcion5', estrellas: 3, longitud: 5 }
];

const DATA = {
  es: { porRonda: 5, colores: COLORES, niveles: NIVELES },
  en: { porRonda: 5, colores: COLORES, niveles: NIVELES }
};
