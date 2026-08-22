/* ============================================================
   Routime — Text of la-casa (EN)
   Language-specific file. Loaded before data.js and app.js.
   Every key is mirrored in strings.es.js (scripts/check.js
   enforces the es/en parity).
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "🏠 The House",
    "instruccion": "Tap the steps in the right order, from first to last.",
    "instruccionLista": "Pick the tasks you will do and put them in order. Tap a task to see its steps.",
    "etiquetaOrden": "Your order",
    "etiquetaPasos": "Steps",
    "tituloOrigen": "Available tasks",
    "tituloDestino": "My order",
    "destinoVacio": "Add tasks from the left to start.",
    "anadir": "➕ Add task",
    "anadirTitulo": "Add a task",
    "anadirNombre": "Task name",
    "anadirIcono": "Icon",
    "anadirPasos": "Steps (tap the emoji to change it)",
    "anadirPasoToca": "Tap to change the step",
    "anadirCancelar": "← Back",
    "anadirGuardar": "Save",
    "anadirErrorNombre": "Type a name for the task (at least 2 letters).",
    "volverLista": "← Back to the list",
    "ariaAbrirPasos": "See the steps of {nombre}",
    "ariaMoverDerecha": "Add {nombre} to my order",
    "ariaMoverIzquierda": "Remove {nombre} from my order",
    "ariaSubir": "Move up",
    "ariaBajar": "Move down",
    "ariaPaso": "Step",
    "resumenFinal": "You ordered {n} tasks. You now have {total} stars.",
    "transferencia": "This will help you when you do these tasks at home for real."
  }, 'en');
})();