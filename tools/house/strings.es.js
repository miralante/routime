/* ============================================================
   Routime — Textos de la-casa (ES)
   Archivo específico del idioma. Se carga antes de data.js
   y app.js. Cada clave se mantiene en paralelo con strings.en.js
   (scripts/check.js comprueba la paridad es/en).
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "title": "🏠 La Casa",
    "instruccion": "Toca los pasos en el orden correcto, de primero a último.",
    "instruccionLista": "Elige las tareas que vas a hacer y ordénalas. Toca una tarea para ver sus pasos.",
    "etiquetaOrden": "Tu orden",
    "etiquetaPasos": "Pasos",
    "tituloOrigen": "Tareas disponibles",
    "tituloDestino": "Mi orden",
    "destinoVacio": "Añade tareas desde la izquierda para empezar.",
    "anadir": "➕ Añadir tarea",
    "anadirTitulo": "Añadir una tarea",
    "anadirNombre": "Nombre de la tarea",
    "anadirIcono": "Icono",
    "anadirPasos": "Pasos (toca el emoji para cambiarlo)",
    "anadirPasoToca": "Toca para cambiar el paso",
    "anadirCancelar": "← Volver",
    "anadirGuardar": "Guardar",
    "anadirErrorNombre": "Escribe un nombre para la tarea (al menos 2 letras).",
    "volverLista": "← Volver a la lista",
    "ariaAbrirPasos": "Ver los pasos de {nombre}",
    "ariaMoverDerecha": "Añadir {nombre} a mi orden",
    "ariaMoverIzquierda": "Quitar {nombre} de mi orden",
    "ariaSubir": "Subir",
    "ariaBajar": "Bajar",
    "ariaPaso": "Paso",
    "resumenFinal": "Has ordenado {n} tareas. Ahora tienes {total} estrellas.",
    "transferencia": "Esto te servirá cuando hagas estas tareas en casa de verdad."
  }, 'es');
})();