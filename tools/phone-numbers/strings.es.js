/* ============================================================
   Routime — Textos de Teléfonos Importantes (ES)
   Archivo específico del idioma. Mismas claves que strings.en.js.
   Se carga condicionalmente desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "📞 Teléfonos Importantes",
    "instruction": "Aprende qué número marcar. Primero mira las fichas, luego el resumen y después haz el test.",
    "card": {
      "police": { "name": "Policía", "situation": "Si ves algo peligroso, como un robo o alguien que quiere hacerte daño." },
      "fire": { "name": "Bomberos", "situation": "Si hay fuego de verdad o huele muy fuerte a gas." },
      "medical": { "name": "Emergencia médica", "situation": "Si alguien está muy grave, no respira o no responde." }
    },
    "numberLabel": "El número es:",
    "summaryTitle": "Un solo número para todo",
    "summaryText": "Para la policía, los bomberos o una emergencia médica, el número siempre es el mismo: el 112.",
    "startQuiz": "Hacer el test",
    "quizQuestion": "¿A qué número llamas?",
    "correctExplanation": "✅ ¡Correcto! El número es el 112.",
    "wrongExplanationPrefix": "❌ Eso no es lo correcto. Lo correcto es: ",
    "hint": "🤔 Prueba otra vez. Piensa en la situación: ",
    "finalSummary": "Has ganado {n} estrellas. Ahora tienes {total} estrellas.",
  "contexto": "Estás en una situación en la que necesitas ayuda. Tienes que saber a qué número llamar y qué decir.",
  "pista": "🤔 Piensa: ¿es un policía, un bombero o una emergencia médica?",
  "explicacion": "✅ El 112 sirve para cualquier emergencia real. Saberlo de memoria puede ayudarte mucho.",
  "transferencia": "Esto te servirá para pedir ayuda rápido si pasa algo en casa, en la calle o con alguien que está mal.",
  }, 'es');
})();
