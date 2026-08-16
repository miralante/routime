/* ============================================================
   Routime — Textos de Vocabulario por tema (ES)
   Archivo específico del idioma. Mismas claves que strings.en.js.
   Se carga condicionalmente desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "📚 Vocabulario por tema",
    "instruction": "Elige un bloque y un nivel de dificultad. Cada ronda te enseña 8 palabras nuevas con su significado y un ejemplo.",
    "chooseBlock": "Elige un bloque",
    "chooseTier": "Elige un nivel (más bajo = más fácil)",
    "chooseLevel": "Elige una ronda",
    "roundsCount": "rondas",
    "wordsCount": "palabras",
    "part": "Parte",
    "noRondasForTier": "No hay rondas para este nivel en este bloque. Prueba otro nivel.",
    "done": "✔ Hecha",
    "definitionLabel": "Significa:",
    "exampleLabel": "Por ejemplo:",
    "categoryLabel": "Categoría:",
    "tierLabel": "Nivel:",
    "quizQuestion": "¿Qué significa esta palabra?",
    "correctFull": "✅ ¡Correcto!",
    "wrongExplanationPrefix": "❌ El significado es:",
    "hint": "🤔 Pista con el ejemplo:",
    "chooseAnotherBlock": "Elegir otro bloque",
    "finalSummary": "Has ganado {n} estrellas en esta ronda. Ahora tienes {total} estrellas en total.",
    "transferencia": "Ahora recordarás mejor las palabras por temas. Te servirá para hablar de cocina, ropa, familia y otros temas del día a día."
  }, 'es');
})();
