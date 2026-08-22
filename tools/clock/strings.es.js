/* ============================================================
   Routime — Textos de El Reloj (ES)
   Archivo específico del idioma. Se carga condicionalmente
   desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    titulo: '🕐 El Reloj',
    instruccion: 'Mira el reloj. Elige la hora correcta.',
    elegirModo: 'Elige una actividad',
    elegirNivel: 'Elige el nivel',
    elegirOtroModo: 'Elegir otro modo',
    elegirOtroNivel: 'Elegir otro nivel',
    queHora: '¿Qué hora es?',
    ariaReloj: 'Reloj: {texto}',
    resumenFinal: 'Has ganado {n} estrellas. Ahora tienes {total} estrellas.',
    explicacionCorrecta: '✅ ¡Correcto! Son las ',
    explicacionIncorrectaA: '❌ No es esa hora. Son las ',
    pistaLeer: '🤔 Prueba otra vez. Mira el reloj con calma.',
    pistaAsociar: '🤔 Prueba otra vez. Piensa en ese momento del día.',
    pistaPoner: '🤔 Prueba otra vez. Ajusta la hora con los botones.',
    pistaConvertir: '🤔 Prueba otra vez. Compara el reloj con los números.',
    convertirAnalogicoDigital: '¿Qué hora marca este reloj?',
    convertirDigitalAnalogico: 'Toca el reloj que marca esta hora.',
    etiquetaPoner: 'Pon el reloj en esta hora:',
    ponerHora: 'Hora',
    ponerMinuto: 'Minutos',
    ponerIncrementar: 'Subir',
    ponerDecrementar: 'Bajar',
    ponerConfirmar: 'Comprobar',
    refuerzoTitulo: 'Refuerzo',
    refuerzoIntro: 'Vamos a repetir las {n} preguntas que has fallado hasta acertarlas todas.',
    transferencia: 'Esto te servirá para leer la hora en el reloj de la cocina, en el del cole o en tu propia muñeca, sin tener que preguntar a cada momento.',
    enPunto: '{h} en punto',
    yCuarto: '{h} y cuarto',
    yMedia: '{h} y media',
    menosCuarto: '{h} menos cuarto',
    modo: {
      leer: {
        nombre: 'Leer el reloj',
        descripcion: 'Mira el reloj y elige la hora correcta.',
        pregunta: '¿Qué hora es?'
      },
      poner: {
        nombre: 'Poner el reloj',
        descripcion: 'Lee la hora y mueve las agujas con los botones.',
        pregunta: 'Pon las agujas en la hora indicada.'
      },
      convertir: {
        nombre: 'Analógico ↔ Digital',
        descripcion: 'Empareja el reloj de agujas con los números digitales.',
        pregunta: 'Empareja el reloj con su hora digital.'
      },
      situaciones: {
        nombre: 'Momentos del día',
        descripcion: 'Elige el reloj que corresponde a cada momento del día.',
        pregunta: '¿A qué hora pasa esto?'
      }
    },
    momento: {
      desayuno: { nombre: 'el desayuno', pregunta: '¿A qué hora es el desayuno?' },
      colegio:  { nombre: 'ir al colegio', pregunta: '¿A qué hora vas al colegio?' },
      comida:   { nombre: 'la comida',   pregunta: '¿A qué hora es la comida?' },
      merienda: { nombre: 'la merienda', pregunta: '¿A qué hora es la merienda?' },
      cena:     { nombre: 'la cena',     pregunta: '¿A qué hora es la cena?' },
      dormir:   { nombre: 'dormir',      pregunta: '¿A qué hora te vas a dormir?' }
    }
  }, 'es');
})();