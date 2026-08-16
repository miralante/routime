/* ============================================================
   Routime — Constructores (lógica)
   Spatial-visual sandbox inspired by block-building games.
   Two modes:
   - Libre: la persona elige el tamaño del mundo (pequeño/mediano/
     grande, DATA.tamanos) y construye lo que quiera. Sin acierto/
     fallo; estrella al pulsar "¡Listo!" con al menos 1 bloque.
   - Modelo (plantilla): el lienzo se adapta al modelo elegido y
     cada casilla del modelo muestra un "fantasma" del bloque que
     va ahí (color real atenuado + borde de puntos), así la persona
     sabe QUÉ bloque poner y DÓNDE. Cuando todas las casillas del
     modelo tienen su bloque correcto, se celebra sola (no hace
     falta pulsar nada). Poner un bloque "equivocado" nunca castiga:
     se queda puesto como decoración y se puede borrar. Si pulsa
     "¡Listo!" antes de terminar: 1º una pista hablada/escrita, 2º
     además se marcan en amarillo las casillas que faltan (regla 12
     adaptada: el fantasma ya enseña la respuesta, aquí no hay
     "atascarse").
   La paleta lleva siempre los 8 bloques (no es una pregunta tipo
   quiz sino una caja de herramientas, como los colores de Colorear).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'constructores';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var cuadricula = $('#cuadricula');
  var bloquesEl = $('#bloques');
  var feedbackEl = $('#feedback');
  var starsEl = $('#stars');
  var contadorBloques = $('#contadorBloques');
  var construccionTitulo = $('#construccionTitulo');
  var selectorPlantilla = $('#selectorPlantilla');
  var selectorTamano = $('#selectorTamano');
  var vistaMiniatura = $('#vistaMiniatura');
  var btnLimpiarTodo = $('#btnLimpiarTodo');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (typeof progreso.construcciones !== 'number') progreso.construcciones = 0;

  /* Estado del juego */
  var modoActual = 'libre';        /* 'libre' o 'plantilla' */
  var plantillaActual = null;
  var tamanoActual = DATA.tamanos[0];
  var bloqueSeleccionado = null;
  var modoBorrar = false;
  var celdas = [];                 /* elementos .celda en orden fila*cols+col */
  var gridState = [];              /* matriz de null | id de bloque */
  var enPartida = false;
  var pistasListo = 0;             /* pulsaciones de ¡Listo! con modelo incompleto */
  var timeoutLimpiar = null;
  var confirmandoLimpiar = false;

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
  function nombreBloque(id) { return App.i18n.t('bloque' + capitalize(id)); }

  function cols() { return plantillaActual ? plantillaActual.gridSize.cols : tamanoActual.cols; }
  function rows() { return plantillaActual ? plantillaActual.gridSize.rows : tamanoActual.rows; }

  /* ------------------------------------------------------------
     PANTALLA DE INICIO: modo → tamaño (libre) o modelo (plantilla)
     ------------------------------------------------------------ */
  function mostrarSelectorTamano() {
    selectorPlantilla.classList.add('oculto');
    selectorTamano.classList.remove('oculto');
    var cont = $('#tamanos');
    cont.innerHTML = '';
    DATA.tamanos.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-modo';
      btn.textContent = App.i18n.t('tam' + capitalize(t.id)) + ' · ' + t.cols + '×' + t.rows;
      btn.addEventListener('click', function () {
        tamanoActual = t;
        empezarJuegoLibre();
      });
      cont.appendChild(btn);
    });
  }

  function mostrarSelectorPlantilla() {
    selectorTamano.classList.add('oculto');
    selectorPlantilla.classList.remove('oculto');
    var cont = $('#plantillas');
    cont.innerHTML = '';

    DATA.plantillas.forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tarjeta-plantilla';
      btn.setAttribute('aria-label', App.i18n.t(p.nombre));

      /* Vista previa: SIEMPRE la matriz completa (antes se truncaba a
         6×4 y las plantillas grandes salían descolocadas) */
      var preview = document.createElement('div');
      preview.className = 'preview-plantilla';
      preview.style.gridTemplateColumns = 'repeat(' + p.gridSize.cols + ', 1fr)';
      preview.style.width = '96px';
      preview.style.height = Math.round(96 * p.gridSize.rows / p.gridSize.cols) + 'px';
      for (var i = 0; i < p.gridSize.rows; i++) {
        for (var j = 0; j < p.gridSize.cols; j++) {
          var celda = document.createElement('div');
          celda.className = 'celda';
          if (p.matriz[i] && p.matriz[i][j]) celda.classList.add('bloque-' + p.matriz[i][j]);
          preview.appendChild(celda);
        }
      }

      var nombre = document.createElement('span');
      nombre.className = 'nombre-plantilla';
      nombre.textContent = App.i18n.t(p.nombre);

      btn.appendChild(preview);
      btn.appendChild(nombre);
      btn.addEventListener('click', function () { empezarJuegoConPlantilla(p); });
      cont.appendChild(btn);
    });
  }

  $('#btnModoLibre').addEventListener('click', mostrarSelectorTamano);
  $('#btnModoPlantilla').addEventListener('click', mostrarSelectorPlantilla);

  /* ------------------------------------------------------------
     CUADRÍCULA
     ------------------------------------------------------------ */
  function crearCuadricula() {
    cuadricula.innerHTML = '';
    cuadricula.style.gridTemplateColumns = 'repeat(' + cols() + ', 1fr)';

    celdas = [];
    gridState = [];

    for (var i = 0; i < rows(); i++) {
      gridState[i] = [];
      for (var j = 0; j < cols(); j++) {
        var celda = document.createElement('div');
        celda.className = 'celda sin-bloque';
        celda.setAttribute('role', 'gridcell');
        celda.setAttribute('tabindex', '0');
        celda.dataset.row = i;
        celda.dataset.col = j;

        if (plantillaActual && plantillaActual.matriz[i] && plantillaActual.matriz[i][j]) {
          celda.dataset.bloquePlantilla = plantillaActual.matriz[i][j];
        }

        celda.addEventListener('click', hacerClickCelda);
        celda.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hacerClickCelda.call(this, e);
          }
        });

        celdas.push(celda);
        gridState[i][j] = null;
        cuadricula.appendChild(celda);
        actualizarCeldaVisual(celda, null);
      }
    }
  }

  function hacerClickCelda(e) {
    var celda = e.currentTarget || e.target;
    var row = parseInt(celda.dataset.row, 10);
    var col = parseInt(celda.dataset.col, 10);

    if (modoBorrar) {
      if (gridState[row][col]) {
        gridState[row][col] = null;
        actualizarCeldaVisual(celda, null);
        despuesDeCambiar();
      }
    } else if (bloqueSeleccionado) {
      gridState[row][col] = bloqueSeleccionado.id;
      actualizarCeldaVisual(celda, bloqueSeleccionado.id);
      celda.style.transform = 'scale(1.15)';
      setTimeout(function () { celda.style.transform = ''; }, 100);
      despuesDeCambiar();
    }
  }

  function actualizarCeldaVisual(celda, bloqueId) {
    celda.className = 'celda';
    if (bloqueId) {
      celda.classList.add('con-bloque', 'bloque-' + bloqueId);
      celda.setAttribute('aria-label',
        App.i18n.t('celdaConBloque').replace('{bloque}', nombreBloque(bloqueId)));
    } else if (celda.dataset.bloquePlantilla) {
      /* Ghost: the target block dimmed, to show which one goes here */
      celda.classList.add('fantasma', 'bloque-' + celda.dataset.bloquePlantilla);
      celda.setAttribute('aria-label',
        App.i18n.t('celdaFantasma').replace('{bloque}', nombreBloque(celda.dataset.bloquePlantilla)));
    } else {
      celda.classList.add('sin-bloque');
      celda.setAttribute('aria-label', App.i18n.t('celdaVacia'));
    }
  }

  function despuesDeCambiar() {
    actualizarContador();
    if (modoActual === 'plantilla') comprobarPlantilla();
  }

  function actualizarContador() {
    var count = 0;
    for (var i = 0; i < gridState.length; i++) {
      for (var j = 0; j < gridState[i].length; j++) {
        if (gridState[i][j]) count++;
      }
    }
    contadorBloques.textContent = count;
  }

  /* ------------------------------------------------------------
     MODO PLANTILLA: fantasmas y compleción automática
     ------------------------------------------------------------ */
  function casillasQueFaltan() {
    var faltan = [];
    for (var i = 0; i < rows(); i++) {
      for (var j = 0; j < cols(); j++) {
        var objetivo = plantillaActual.matriz[i] && plantillaActual.matriz[i][j];
        if (objetivo && gridState[i][j] !== objetivo) {
          faltan.push(celdas[i * cols() + j]);
        }
      }
    }
    return faltan;
  }

  function comprobarPlantilla() {
    if (!enPartida) return;
    if (casillasQueFaltan().length === 0) {
      enPartida = false;
      /* Short pause so the last placed block can be seen */
      setTimeout(function () { terminarConstruccion(); }, 600);
    }
  }

  /* ------------------------------------------------------------
     PALETA DE BLOQUES (siempre los 8)
     ------------------------------------------------------------ */
  function crearPaletaBloques() {
    bloquesEl.innerHTML = '';
    DATA.bloques.forEach(function (bloque) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bloque-btn bloque-' + bloque.id;
      btn.dataset.bloqueId = bloque.id;
      btn.setAttribute('aria-label', nombreBloque(bloque.id));
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.addEventListener('click', function () { seleccionarBloque(bloque, btn); });
      bloquesEl.appendChild(btn);
    });
    seleccionarBloque(DATA.bloques[0], bloquesEl.querySelector('.bloque-btn'));
  }

  function seleccionarBloque(bloque, btn) {
    bloqueSeleccionado = bloque;
    modoBorrar = false;
    $('#btnBorrar').classList.remove('modo-borrar-activo');
    var botones = bloquesEl.querySelectorAll('.bloque-btn');
    botones.forEach(function (b) {
      b.classList.remove('seleccionado');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('seleccionado');
    btn.setAttribute('aria-checked', 'true');
  }

  /* ------------------------------------------------------------
     HERRAMIENTAS
     ------------------------------------------------------------ */
  $('#btnBorrar').addEventListener('click', function () {
    modoBorrar = !modoBorrar;
    if (modoBorrar) {
      bloqueSeleccionado = null;
      $('#btnBorrar').classList.add('modo-borrar-activo');
      var botones = bloquesEl.querySelectorAll('.bloque-btn');
      botones.forEach(function (b) {
        b.classList.remove('seleccionado');
        b.setAttribute('aria-checked', 'false');
      });
    } else {
      $('#btnBorrar').classList.remove('modo-borrar-activo');
    }
  });

  /* Two-step confirmation on the button itself (same pattern as
     /settings/), instead of the browser's native confirm() (not
     translated and outside the app's style). */
  btnLimpiarTodo.addEventListener('click', function () {
    if (!confirmandoLimpiar) {
      confirmandoLimpiar = true;
      btnLimpiarTodo.textContent = App.i18n.t('confirmLimpiar');
      timeoutLimpiar = setTimeout(function () {
        confirmandoLimpiar = false;
        btnLimpiarTodo.textContent = App.i18n.t('btnLimpiarTodo');
      }, 5000);
      return;
    }
    clearTimeout(timeoutLimpiar);
    confirmandoLimpiar = false;
    btnLimpiarTodo.textContent = App.i18n.t('btnLimpiarTodo');
    limpiarCuadricula();
  });

  function limpiarCuadricula() {
    for (var i = 0; i < rows(); i++) {
      for (var j = 0; j < cols(); j++) {
        gridState[i][j] = null;
        actualizarCeldaVisual(celdas[i * cols() + j], null);
      }
    }
    actualizarContador();
  }

  /* ------------------------------------------------------------
     INICIO DEL JUEGO
     ------------------------------------------------------------ */
  function empezarJuegoLibre() {
    modoActual = 'libre';
    plantillaActual = null;
    construccionTitulo.textContent = App.i18n.t('construccionLibre');
    iniciarJuego();
  }

  function empezarJuegoConPlantilla(plantilla) {
    modoActual = 'plantilla';
    plantillaActual = plantilla;
    construccionTitulo.textContent =
      App.i18n.t('plantillaActiva').replace('{nombre}', App.i18n.t(plantilla.nombre));
    iniciarJuego();
  }

  function iniciarJuego() {
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    pistasListo = 0;
    enPartida = true;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    selectorPlantilla.classList.add('oculto');
    selectorTamano.classList.add('oculto');

    crearCuadricula();
    crearPaletaBloques();
    actualizarContador();
  }

  /* ------------------------------------------------------------
     FINALIZAR Y CELEBRAR
     ------------------------------------------------------------ */
  $('#btnTerminado').addEventListener('click', function () {
    var numBloques = parseInt(contadorBloques.textContent, 10);

    /* La rama "no has puesto nada" es solo del modo libre: en modo
       modelo la pista de la plantilla (más abajo) es más útil que la
       instrucción genérica, aunque haya 0 bloques. */
    if (numBloques === 0 && modoActual !== 'plantilla') {
      App.feedback.encourage(feedbackEl);
      return;
    }

    if (modoActual === 'plantilla') {
      var faltan = casillasQueFaltan();
      if (faltan.length > 0) {
        /* Modelo sin terminar: pista, nunca reproche. 1ª vez texto;
           2ª además se marcan las casillas que faltan. */
        pistasListo += 1;
        App.feedback.encourage(feedbackEl);
        var clave = pistasListo === 1 ? 'pistaPlantilla1' : 'pistaPlantilla2';
        feedbackEl.textContent = App.i18n.t(clave);
        if (pistasListo >= 2) {
          faltan.forEach(function (c) { c.classList.add('atencion'); });
        }
        return;
      }
      /* Complete: comprobarPlantilla() should have already caught this,
         but just in case (e.g. they tap Done during the 600 ms pause) */
      if (!enPartida) return;
      enPartida = false;
    }

    terminarConstruccion();
  });

  function terminarConstruccion() {
    var numBloques = parseInt(contadorBloques.textContent, 10);

    progreso.estrellas += 1;
    progreso.construcciones += 1;
    guardar();
    pintarEstrellas();

    crearVistaMinatura();

    var resumen = modoActual === 'plantilla'
      ? App.i18n.t('resumenPlantilla').replace('{n}', numBloques)
      : App.i18n.t('resumenLibre').replace('{n}', numBloques);
    $('#resumenFinal').textContent = resumen;
$('#transferencia').textContent = App.i18n.t('transferencia');

    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');

    App.feedback.success(feedbackEl);
    App.feedback.celebrate(App.i18n.t('finalTitulo'));
  }

  function crearVistaMinatura() {
    vistaMiniatura.innerHTML = '';
    vistaMiniatura.style.gridTemplateColumns = 'repeat(' + cols() + ', 1fr)';
    vistaMiniatura.style.width = '160px';
    vistaMiniatura.style.height = Math.round(160 * rows() / cols()) + 'px';
    for (var i = 0; i < rows(); i++) {
      for (var j = 0; j < cols(); j++) {
        var miniCelda = document.createElement('div');
        miniCelda.className = 'celda';
        if (gridState[i][j]) {
          miniCelda.classList.add('bloque-' + gridState[i][j]);
        } else {
          miniCelda.classList.add('sin-bloque');
        }
        vistaMiniatura.appendChild(miniCelda);
      }
    }
  }

  /* ------------------------------------------------------------
     NAVEGACIÓN DESDE LA PANTALLA FINAL
     ------------------------------------------------------------ */
  $('#btnSeguirCreando').addEventListener('click', function () {
    if (modoActual === 'plantilla' && plantillaActual) {
      empezarJuegoConPlantilla(plantillaActual);
    } else {
      empezarJuegoLibre();
    }
  });

  $('#btnCambiarPlantilla').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pantallaInicio.classList.remove('oculto');
    mostrarSelectorPlantilla();
  });

  /* ------------------------------------------------------------
     INSTRUCCIONES CON AUDIO
     ------------------------------------------------------------ */

  /* ------------------------------------------------------------
     INICIALIZACIÓN
     ------------------------------------------------------------ */
  pintarEstrellas();
  App.i18n.apply();
})();

