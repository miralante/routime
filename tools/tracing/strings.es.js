/* ============================================================
   Routime — Textos de trazos (ES)
   Archivo específico del idioma. Se carga condicionalmente
   desde index.html según App.i18n.locale().

   El sistema tiene 5 niveles guiados y un modo libre donde el
   usuario elige letras del abecedario (mayúsculas y/o
   minúsculas). Los nombres de los niveles vienen de data.js.
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "Trazos",
    "instruccion": "Repasa la línea de puntos con el dedo o el ratón.",
    "instruccionCompleta": "Repasa la línea de puntos con el dedo o el ratón. Primero elige el nivel o las letras que quieras practicar.",
    "elegirNivel": "Elige el nivel",
    "borrar": "🗑 Borrar",
    "comprobar": "Comprobar",
    "finalTitulo": "¡Ronda completada!",
    "otroNivel": "Elegir otro nivel",
    "veces": "veces",
    "resumenFinal": "Has repasado {n} formas. Ahora tienes {total} estrellas.",
    "modoLibre": "🔤 Practicar con el abecedario",
    "seleccionTitulo": "Elige las letras a practicar",
    "mayusculas": "Mayúsculas",
    "minusculas": "Minúsculas",
    "seleccionarMayus": "Mayúsculas",
    "seleccionarMinus": "Minúsculas",
    "seleccionarTodo": "Todas",
    "seleccionarNada": "Ninguna",
    "iniciarPractica": "Practicar →",
    "seleccionResumen": "Has elegido {n} letras. Toca una para quitarla.",
    "ariaNoSeleccionada": "Toca para elegirla."
  ,
  "transferencia": "Esto te ayuda a escribir mejor en tu cuaderno."
}, 'es');
})();