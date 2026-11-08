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
     modelo tienen su bloque correct, se celebra sola (no hace
     falta pulsar nada). Poner un bloque "equivocado" nunca castiga:
     se queda puesto como decoración y se puede borrar. Si pulsa
     "¡Listo!" antes de finish: 1º una pista hablada/escrita, 2º
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

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var grid = $('#cuadricula');
  var blocksEl = $('#bloques');
  var feedbackEl = $('#feedback');
  var starsEl = $('#stars');
  var counterBlocks = $('#contadorBloques');
  var buildTitle = $('#construccionTitulo');
  var selectorTemplate = $('#selectorPlantilla');
  var selectorSize = $('#selectorTamano');
  var viewThumb = $('#vistaMiniatura');
  var btnLimpiarTodo = $('#btnLimpiarTodo');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.construcciones !== 'number') progress.construcciones = 0;

  /* Estado del juego */
  var modeCurrent = 'libre';        /* 'libre' o 'plantilla' */
  var templateCurrent = null;
  var sizeCurrent = DATA.tamanos[0];
  var blockSelected = null;
  var modeErase = false;
  var cells = [];                 /* elementos .celda en orden row*cols+col */
  var gridState = [];              /* matriz de null | id de bloque */
  var enPartida = false;
  var pistasListo = 0;             /* pulsaciones de ¡Listo! con modelo incompleto */
  var timeoutLimpiar = null;
  var confirmandoLimpiar = false;

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; }
  });
  var save = glue.save, renderStars = glue.paintStars;
  function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
  function nameBlock(id) { return App.i18n.t('bloque' + capitalize(id)); }

  function cols() { return templateCurrent ? templateCurrent.gridSize.cols : sizeCurrent.cols; }
  function rows() { return templateCurrent ? templateCurrent.gridSize.rows : sizeCurrent.rows; }

  /* ------------------------------------------------------------
     PANTALLA DE INICIO: modo → tamaño (libre) o modelo (plantilla)
     ------------------------------------------------------------ */
  function showSelectorSize() {
    selectorTemplate.classList.add('hidden');
    selectorSize.classList.remove('hidden');
    var cont = $('#tamanos');
    cont.innerHTML = '';
    DATA.tamanos.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-modo';
      btn.textContent = App.i18n.t('tam' + capitalize(t.id)) + ' · ' + t.cols + '×' + t.rows;
      btn.addEventListener('click', function () {
        sizeCurrent = t;
        startGameFree();
      });
      cont.appendChild(btn);
    });
  }

  function showSelectorTemplate() {
    selectorSize.classList.add('hidden');
    selectorTemplate.classList.remove('hidden');
    var cont = $('#plantillas');
    cont.innerHTML = '';

    DATA.plantillas.forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tarjeta-plantilla';
      btn.setAttribute('aria-label', App.i18n.t(p.name));

      /* Vista previa: SIEMPRE la matriz completa (antes se truncaba a
         6×4 y las plantillas grandes salían descolocadas) */
      var preview = document.createElement('div');
      preview.className = 'preview-plantilla';
      preview.style.gridTemplateColumns = 'repeat(' + p.gridSize.cols + ', 1fr)';
      preview.style.width = '96px';
      preview.style.height = Math.round(96 * p.gridSize.rows / p.gridSize.cols) + 'px';
      for (var i = 0; i < p.gridSize.rows; i++) {
        for (var j = 0; j < p.gridSize.cols; j++) {
          var cell = document.createElement('div');
          cell.className = 'celda';
          if (p.matriz[i] && p.matriz[i][j]) cell.classList.add('bloque-' + p.matriz[i][j]);
          preview.appendChild(cell);
        }
      }

      var name = document.createElement('span');
      name.className = 'name-plantilla';
      name.textContent = App.i18n.t(p.name);

      btn.appendChild(preview);
      btn.appendChild(name);
      btn.addEventListener('click', function () { startGameAlongTemplate(p); });
      cont.appendChild(btn);
    });
  }

  $('#btnModoLibre').addEventListener('click', showSelectorSize);
  $('#btnModoPlantilla').addEventListener('click', showSelectorTemplate);

  /* ------------------------------------------------------------
     CUADRÍCULA
     ------------------------------------------------------------ */
  function createGrid() {
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = 'repeat(' + cols() + ', 1fr)';

    cells = [];
    gridState = [];

    for (var i = 0; i < rows(); i++) {
      gridState[i] = [];
      for (var j = 0; j < cols(); j++) {
        var cell = document.createElement('div');
        cell.className = 'celda sin-bloque';
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('tabindex', '0');
        cell.dataset.row = i;
        cell.dataset.col = j;

        if (templateCurrent && templateCurrent.matriz[i] && templateCurrent.matriz[i][j]) {
          cell.dataset.bloquePlantilla = templateCurrent.matriz[i][j];
        }

        cell.addEventListener('click', makeClickCell);
        cell.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            makeClickCell.call(this, e);
          }
        });

        cells.push(cell);
        gridState[i][j] = null;
        grid.appendChild(cell);
        updateCellVisual(cell, null);
      }
    }
  }

  function makeClickCell(e) {
    var cell = e.currentTarget || e.target;
    var row = parseInt(cell.dataset.row, 10);
    var col = parseInt(cell.dataset.col, 10);

    if (modeErase) {
      if (gridState[row][col]) {
        gridState[row][col] = null;
        updateCellVisual(cell, null);
        despuesDeCambiar();
      }
    } else if (blockSelected) {
      gridState[row][col] = blockSelected.id;
      updateCellVisual(cell, blockSelected.id);
      cell.style.transform = 'scale(1.15)';
      setTimeout(function () { cell.style.transform = ''; }, 100);
      despuesDeCambiar();
    }
  }

  function updateCellVisual(cell, blockId) {
    cell.className = 'celda';
    if (blockId) {
      cell.classList.add('con-bloque', 'bloque-' + blockId);
      cell.setAttribute('aria-label',
        App.i18n.t('celdaConBloque').replace('{bloque}', nameBlock(blockId)));
    } else if (cell.dataset.bloquePlantilla) {
      /* Ghost: the target block dimmed, to show which one goes here */
      cell.classList.add('fantasma', 'bloque-' + cell.dataset.bloquePlantilla);
      cell.setAttribute('aria-label',
        App.i18n.t('celdaFantasma').replace('{bloque}', nameBlock(cell.dataset.bloquePlantilla)));
    } else {
      cell.classList.add('sin-bloque');
      cell.setAttribute('aria-label', App.i18n.t('celdaVacia'));
    }
  }

  function despuesDeCambiar() {
    updateCounter();
    if (modeCurrent === 'plantilla') checkTemplate();
  }

  function updateCounter() {
    var count = 0;
    for (var i = 0; i < gridState.length; i++) {
      for (var j = 0; j < gridState[i].length; j++) {
        if (gridState[i][j]) count++;
      }
    }
    counterBlocks.textContent = count;
  }

  /* ------------------------------------------------------------
     MODO PLANTILLA: fantasmas y compleción automática
     ------------------------------------------------------------ */
  function casillasQueFaltan() {
    var faltan = [];
    for (var i = 0; i < rows(); i++) {
      for (var j = 0; j < cols(); j++) {
        var goal = templateCurrent.matriz[i] && templateCurrent.matriz[i][j];
        if (goal && gridState[i][j] !== goal) {
          faltan.push(cells[i * cols() + j]);
        }
      }
    }
    return faltan;
  }

  function checkTemplate() {
    if (!enPartida) return;
    if (casillasQueFaltan().length === 0) {
      enPartida = false;
      /* Short pause so the last placed block can be seen */
      setTimeout(function () { finishBuild(); }, 600);
    }
  }

  /* ------------------------------------------------------------
     PALETA DE BLOQUES (siempre los 8)
     ------------------------------------------------------------ */
  function createPaletteBlocks() {
    blocksEl.innerHTML = '';
    DATA.bloques.forEach(function (block) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bloque-btn bloque-' + block.id;
      btn.dataset.bloqueId = block.id;
      btn.setAttribute('aria-label', nameBlock(block.id));
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.addEventListener('click', function () { selectBlock(block, btn); });
      blocksEl.appendChild(btn);
    });
    selectBlock(DATA.bloques[0], blocksEl.querySelector('.bloque-btn'));
  }

  function selectBlock(block, btn) {
    blockSelected = block;
    modeErase = false;
    $('#btnErase').classList.remove('modo-borrar-activo');
    var botones = blocksEl.querySelectorAll('.bloque-btn');
    botones.forEach(function (b) {
      b.classList.remove('selected');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('selected');
    btn.setAttribute('aria-checked', 'true');
  }

  /* ------------------------------------------------------------
     HERRAMIENTAS
     ------------------------------------------------------------ */
  $('#btnErase').addEventListener('click', function () {
    modeErase = !modeErase;
    if (modeErase) {
      blockSelected = null;
      $('#btnErase').classList.add('modo-borrar-activo');
      var botones = blocksEl.querySelectorAll('.bloque-btn');
      botones.forEach(function (b) {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      });
    } else {
      $('#btnErase').classList.remove('modo-borrar-activo');
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
    clearGrid();
  });

  function clearGrid() {
    for (var i = 0; i < rows(); i++) {
      for (var j = 0; j < cols(); j++) {
        gridState[i][j] = null;
        updateCellVisual(cells[i * cols() + j], null);
      }
    }
    updateCounter();
  }

  /* ------------------------------------------------------------
     INICIO DEL JUEGO
     ------------------------------------------------------------ */
  function startGameFree() {
    modeCurrent = 'libre';
    templateCurrent = null;
    buildTitle.textContent = App.i18n.t('construccionLibre');
    startGame();
  }

  function startGameAlongTemplate(template) {
    modeCurrent = 'plantilla';
    templateCurrent = template;
    buildTitle.textContent =
      App.i18n.t('plantillaActiva').replace('{name}', App.i18n.t(template.name));
    startGame();
  }

  function startGame() {
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    pistasListo = 0;
    enPartida = true;
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    selectorTemplate.classList.add('hidden');
    selectorSize.classList.add('hidden');

    createGrid();
    createPaletteBlocks();
    updateCounter();
  }

  /* ------------------------------------------------------------
     FINALIZAR Y CELEBRAR
     ------------------------------------------------------------ */
  $('#btnTerminado').addEventListener('click', function () {
    var numBlocks = parseInt(counterBlocks.textContent, 10);

    /* La rama "no has puesto nada" es solo del modo libre: en modo
       modelo la pista de la plantilla (más abajo) es más útil que la
       instrucción genérica, aunque haya 0 bloques. */
    if (numBlocks === 0 && modeCurrent !== 'plantilla') {
      App.feedback.encourage(feedbackEl);
      return;
    }

    if (modeCurrent === 'plantilla') {
      var faltan = casillasQueFaltan();
      if (faltan.length > 0) {
        /* Modelo sin finish: pista, nunca reproche. 1ª vez text;
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

    finishBuild();
  });

  function finishBuild() {
    var numBlocks = parseInt(counterBlocks.textContent, 10);

    progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    progress.construcciones += 1;
    save();
    renderStars();

    createViewThumb();

    var summary = modeCurrent === 'plantilla'
      ? App.i18n.t('resumenPlantilla').replace('{n}', numBlocks)
      : App.i18n.t('resumenLibre').replace('{n}', numBlocks);
    $('#resumenFinal').textContent = '';
$('#transferencia').textContent = '';

    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');

    App.feedback.success(feedbackEl);
    App.feedback.celebrate(App.i18n.t('finalTitulo'));
  }

  function createViewThumb() {
    viewThumb.innerHTML = '';
    viewThumb.style.gridTemplateColumns = 'repeat(' + cols() + ', 1fr)';
    viewThumb.style.width = '160px';
    viewThumb.style.height = Math.round(160 * rows() / cols()) + 'px';
    for (var i = 0; i < rows(); i++) {
      for (var j = 0; j < cols(); j++) {
        var miniCell = document.createElement('div');
        miniCell.className = 'celda';
        if (gridState[i][j]) {
          miniCell.classList.add('bloque-' + gridState[i][j]);
        } else {
          miniCell.classList.add('sin-bloque');
        }
        viewThumb.appendChild(miniCell);
      }
    }
  }

  /* ------------------------------------------------------------
     NAVEGACIÓN DESDE LA PANTALLA FINAL
     ------------------------------------------------------------ */
  $('#btnSeguirCreando').addEventListener('click', function () {
    if (modeCurrent === 'plantilla' && templateCurrent) {
      startGameAlongTemplate(templateCurrent);
    } else {
      startGameFree();
    }
  });

  $('#btnCambiarPlantilla').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    showSelectorTemplate();
  });

  /* ------------------------------------------------------------
     INSTRUCCIONES CON AUDIO
     ------------------------------------------------------------ */

  /* ------------------------------------------------------------
     INICIALIZACIÓN
     ------------------------------------------------------------ */
  renderStars();
  App.i18n.apply();
})();

