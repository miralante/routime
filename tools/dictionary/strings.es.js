/* ============================================================
   Routime — Textos de Diccionario (ES)
   Archivo específico del idioma. Mismas claves que strings.en.js.
   Se carga condicionalmente desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "📚 Diccionario",
    "instruction": "Aprende palabras difíciles con su significado sencillo y un ejemplo. Después, haz un test para comprobar qué recuerdas.",
    "btnJugar": "¡Jugar!",
    "palabra": "palabra",
    "palabras": "palabras",
    "proximoNivel": "Siguiente grupo con {n} palabras.",
    "definitionLabel": "Significa:",
    "exampleLabel": "Por ejemplo:",
    "startQuiz": "Hacer el test",
    "quizQuestion": "¿Qué significa esta palabra?",
    "correctExplanation": "✅ ¡Correcto!",
    "wrongExplanationPrefix": "❌ Eso no es. El significado es: ",
    "hint": "🤔 Prueba otra vez. Piensa en el ejemplo: ",
    "finalSummary": "Has ganado estrellas. Ahora tienes {total} estrellas.",
    "contexto": "Estás aprendiendo palabras nuevas. Primero las ves con su significado y un ejemplo, después las pones a prueba.",
    "pista": "🤔 Mira otra vez el ejemplo del significado. ¿Cuál encaja con la palabra?",
    "explicacion": "✅ Ahora ya sabes esa palabra para usarla en una conversación real.",
    "transferencia": "Esto te servirá para entender mejor las palabras nuevas que salen en conversaciones, en libros o en el cole.",
  }, 'es');
})();
