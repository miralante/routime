/* ============================================================
   Routime — Textos de la-casa (ES)
   Archivo específico del idioma. Se carga antes de data.js
   y app.js. Cada clave se mantiene en paralelo con strings.en.js
   (scripts/check.js comprueba la paridad es/en).
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "\ud83c\udfe0 La Casa",
    "instruccion": "Toca los steps en el orden correct, de primero a último.",
    "instruccionLista": "Elige las tareas que vas a hacer y ordénalas. Toca una tarea para ver sus steps.",
    "etiquetaOrden": "Tu orden",
    "etiquetaPasos": "Pasos",
    "tituloOrigen": "Tareas disponibles",
    "tituloDestino": "Mi orden",
    "destinoVacio": "Añade tareas desde la izquierda para empezar.",
    "anadir": "\u2795 Añadir tarea",
    "anadirTitulo": "Añadir una tarea",
    "anadirNombre": "Nombre de la tarea",
    "anadirIcono": "Icono",
    "anadirPasos": "Pasos (toca el emoji para cambiarlo)",
    "addStepTap": "Toca para cambiar el paso",
    "anadirCancelar": "\u2190 Volver",
    "anadirGuardar": "Guardar",
    "addErrorName": "Escribe un name para la tarea (al menos 2 letters).",
    "volverLista": "\u2190 Volver a la lista",
    "ariaOpenSteps": "Ver los steps de {name}",
    "ariaMoveRight": "Añadir {name} a mi orden",
    "ariaMoveLeft": "Quitar {name} de mi orden",
    "ariaMoveUp": "Subir",
    "ariaMoveDown": "Bajar",
    "ariaStep": "Paso",
    "resumenFinal": "Has ordenado {n} tareas. Ahora tienes {total} estrellas.",
    "transferencia": "Esto te servirá cuando hagas estas tareas en casa de verdad."
  }, 'es');
})();
