/* ============================================================
   Routime — Text of la-casa (EN)
   Language-specific file. Loaded before data.js and app.js.
   Every key is mirrored in strings.es.js (scripts/check.js
   enforces the es/en parity).
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "\ud83c\udfe0 The House",
    "instruccion": "Tap the steps in the right order, from first to last.",
    "instruccionLista": "Pick the tasks you will do and put them in order. Tap a task to see its steps.",
    "etiquetaOrden": "Your order",
    "etiquetaPasos": "Steps",
    "tituloOrigen": "Available tasks",
    "tituloDestino": "My order",
    "destinoVacio": "Add tasks from the left to start.",
    "anadir": "\u2795 Add task",
    "anadirTitulo": "Add a task",
    "anadirNombre": "Task name",
    "anadirIcono": "Icon",
    "anadirPasos": "Steps (tap the emoji to change it)",
    "addStepTap": "Tap to change the step",
    "anadirCancelar": "\u2190 Back",
    "anadirGuardar": "Save",
    "addErrorName": "Type a name for the task (at least 2 letters).",
    "volverLista": "\u2190 Back to the list",
    "ariaOpenSteps": "See the steps of {name}",
    "ariaMoveRight": "Add {name} to my order",
    "ariaMoveLeft": "Remove {name} from my order",
    "ariaMoveUp": "Move up",
    "ariaMoveDown": "Move down",
    "ariaStep": "Step",
    "resumenFinal": "You ordered {n} tasks. You now have {total} stars.",
    "transferencia": "This will help you when you do these tasks at home for real."
  }, 'en');
})();
