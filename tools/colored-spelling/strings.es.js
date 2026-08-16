/* ============================================================
   Routime — Textos de Ortografía en Colores (ES)
   Archivo específico del idioma. Mismas claves que strings.en.js.
   Se carga condicionalmente desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "🖍️ Ortografía en Colores",
    "instruction": "Escribe la oración como la ves. Cada letra cambia de color para ayudarte.",
    "chooseLevel": "Elige un nivel",
    "wordsCount": "6 oraciones",
    "done": "✔ Hecho",
    "chooseAnotherLevel": "Elegir otro nivel",
    "listenHint": "Escuchar la oración",
    "check": "Comprobar",
    "clear": "Borrar",
    "space": "espacio",
    "correctFull": "✅ ¡Perfecto! Todas las letras están en su sitio.",
    "transferencia": "Ahora escribirás con más atención a cada letra. Te servirá para deletrear, escribir mensajes y no equivocarte.",
    "wrongVisual": "👀 Mira los colores. Cada letra tiene un color.",
    "colorOk": "verde",
    "colorBad": "rosa",
    "colorMissing": "subrayado",
    "wrongLegendPrefix": "🔎 Verde = letra correcta · Rosa = letra a corregir · Subrayado = letra que falta.",
    "finalSummary": "Has terminado el nivel. Ahora tienes {total} estrellas.",
    "inputAriaLabel": "Escribe aquí la oración"
  }, 'es');
})();
