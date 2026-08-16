/* ============================================================
   Routime — Textos de Doble Sentido (ES)
   Archivo específico del idioma. Mismas claves que strings.en.js.
   Se carga condicionalmente desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "👀 Doble Sentido",
    "instruction": "Algunas palabras pueden significar dos cosas distintas. Escucha la frase y decide si tiene un significado o dos.",
    "chooseLevel": "Elige un grupo de frases",
    "itemsCount": "8 frases",
    "done": "✔ Hecho",
    "chooseAnotherLevel": "Elegir otro grupo",
    "question": "¿Esta frase tiene doble sentido?",
    "optionYes": "Sí, puede significar dos cosas",
    "optionNo": "No, solo significa una cosa",
    "doubleExplanation": "✅ ¡Correcto! Puede ser: {m1}, o puede ser: {m2}.",
    "singleExplanation": "✅ ¡Correcto! Solo significa: {m1}.",
    "hint": "🤔 Prueba otra vez. Escucha bien la frase.",
    "finalSummary": "Has ganado {n} estrellas. Ahora tienes {total} estrellas.",
  "contexto": "Estás escuchando una frase. Algunas palabras tienen dos significados: tienes que fijarte en el resto de la frase para saber cuál es.",
  "pista": "🤔 Lee la frase entera. ¿Qué sentido tiene la palabra aquí?",
  "explicacion": "✅ Esa palabra tiene dos significados: ahora ya sabes los dos y cuándo usar cada uno.",
  "transferencia": "Esto te servirá para entender mejor los chistes, las conversaciones y para no liarte con palabras que suenan igual.",
  }, 'es');
})();
