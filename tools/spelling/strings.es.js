/* ============================================================
   Routime — Textos de Completa la Palabra (ES)
   Archivo específico del idioma. Mismas claves que strings.en.js.
   Se carga condicionalmente desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "🔡 Completa la Palabra",
    "instruction": "Mira la palabra y elige la letra que falta para escribirla bien.",
    "chooseLevel": "Elige un grupo de palabras",
    "wordsCount": "8 palabras",
    "done": "✔ Hecho",
    "chooseAnotherLevel": "Elegir otro grupo",
    "noLetter": "sin letra",
    "correctExplanation": "✅ ¡Correcto!",
    "wrongExplanationPrefix": "❌ Esa letra no es. Se escribe así: ",
    "hint": "🤔 Prueba otra vez. Piensa en cómo suena: ",
    "finalSummary": "Has ganado {n} estrellas. Ahora tienes {total} estrellas.",
  "contexto": "Estás escribiendo una palabra con una letra tapada. Tienes que fijarte en cómo suena y qué letra va ahí.",
  "pista": "🤔 Pronuncia la palabra en voz alta. ¿Qué sonido oyes al final?",
  "explicacion": "✅ Así se escribe bien. Fíjate siempre en cómo suena la palabra para elegir la letra.",
  "transferencia": "Esto te servirá para escribir mejor mensajes, notas o listas, y para que los demás te entiendan a la primera.",
  }, 'es');
})();
