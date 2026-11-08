/* ============================================================
   Routime — Lista de Tareas (autonomía: organizar tareas mixtas
   de casa, trabajo y cuidado personal en el orden lógico del día).
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Tres niveles:
     - Niveles 1 y 2: ordenar tareas predefinidas (simulación).
       Tocar las tareas en el orden correct. Un toque fuera de
       orden no penaliza: solo anima a seguir intentando.
     - Nivel 3: "Crea tu lista" — simulación y proceso de
       entrenamiento. La persona practica el flujo real de una
       lista: poner name, añadir elementos, reordenarlos con
       ↑/↓, marcarlos como "Hecho", borrar elementos, save la
       lista y volver a abrirla más tarde. Las listas se guardan
       en localStorage del dispositivo (no son datos personales,
       son listas de práctica).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'tasks-list';
  var $ = App.utils.$;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  var gameScreen = $('#gameScreen');
  var screenCreate = $('#createScreen');
  var endScreen = $('#endScreen');
  var listTitleEl = $('#listaTitulo');
  var sequenceEl = $('#secuencia');
  var disponiblesEl = $('#disponibles');
  var feedbackEl = $('#feedback');
  var feedbackCreateEl = $('#feedbackCrear');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelEl = $('#level');

  /* Persistent progress */
  var progress = App.storage.getWithStars(TOOL_ID);
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;
  /* Listas de práctica del nivel "Crea tu lista". Se persisten en
     localStorage del dispositivo. Vacío por defecto. */
  if (!Array.isArray(progress.myLists)) progress.myLists = [];

  /* Round state */
  var currentLevel = null;
  var lists = [];
  var idx = 0;
  var roundHits = 0;
  var nextExpected = 0;
  var slots = [];

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; },
    levels: function () { return DATOS.niveles; }
  });
  var save = glue.save, renderStars = glue.paintStars, levelBasedOnProgress = glue.levelFromProgress;
  function itemText(item) { return item && (item.textContent || item.text) || ''; }


  function showScreen(id) {
    [gameScreen, screenCreate, endScreen].forEach(function (p) {
      if (p) p.classList.add('hidden');
    });
    var dest = $('#' + id);
    if (dest) dest.classList.remove('hidden');
  }

  /* Determina el nivel según el progress: cada ronda completada, sube un nivel. */

  /* Muestra la dificultad current (etiqueta del nivel). */
  function renderLevel() {
    if (levelEl && currentLevel) levelEl.textContent = currentLevel.name;
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    if (currentLevel.listasLibres) {
      abrirPantallaCrear();
      return;
    }
    lists = App.utils.shuffle(currentLevel.listas).slice(0, DATOS.porRonda);
    idx = 0;
    roundHits = 0;
    showScreen('gameScreen');
    renderLevel();
    render();
  }

  function startLevel(n) {
    currentLevel = n;
    if (n.listasLibres) {
      abrirPantallaCrear();
      return;
    }
    lists = App.utils.shuffle(currentLevel.listas).slice(0, DATOS.porRonda);
    idx = 0;
    roundHits = 0;
    showScreen('gameScreen');
    render();
  }

  function renderProgress() {
    progressFill.style.width = ((idx / DATOS.porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function render() {
    var list = lists[idx];
    nextExpected = 0;
    slots = new Array(list.items.length).fill(null);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnNext.classList.add('hidden');
    listTitleEl.textContent = list.name;

    paintSlots();

    disponiblesEl.innerHTML = '';
    App.utils.shuffle(list.items.map(function (item, order) {
      return { item: item, orden: order };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn tarea-btn';
      btn.innerHTML = '<span class="task-picto" aria-hidden="true">' + p.item.picto + '</span>' +
        '<span class="tarea-text">' + itemText(p.item) + '</span>';
      btn.setAttribute('aria-label', App.i18n.t('ariaTarea') + ': ' + itemText(p.item));
      btn.addEventListener('click', function () { tap(p.orden, btn); });
      disponiblesEl.appendChild(btn);
    });

    renderProgress();
    renderStars();
  }

  function paintSlots() {
    sequenceEl.innerHTML = '';
    var list = lists[idx];
    slots.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'slot' + (item ? ' filled' : '');
      if (item) {
        div.innerHTML = '<span class="task-picto" aria-hidden="true">' + item.picto + '</span>' +
            '<span class="tarea-text">' + itemText(item) + '</span>';
      } else {
        div.textContent = String(i + 1);
      }
      sequenceEl.appendChild(div);
    });
  }

  function tap(order, btn) {
    var list = lists[idx];
    if (order === nextExpected) {
      slots[order] = list.items[order];
      paintSlots();
      btn.disabled = true;
      btn.classList.add('colocada');
      App.feedback.success(feedbackEl);
      nextExpected += 1;
      if (nextExpected >= list.items.length) {
        finishTask();
      }
    } else {
      App.feedback.encourage(feedbackEl);
    }
  }

  function finishTask() {
    progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    roundHits += 1;
    save();
    renderStars();
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function next() {
    idx += 1;
    if (idx >= DATOS.porRonda) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    showScreen('endScreen');
    $('#endSummary').textContent = '';
    if ($('#transferencia')) $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ============================================================
     Pantalla "Crea tu lista" (Nivel 3).
     Simulación y proceso de entrenamiento del flujo real de una
     lista:
       1. Poner name a la lista (sin window.prompt: Lectura Fácil).
       2. Añadir elementos uno a uno (Enter o botón).
       3. Reordenar con flechas ↑/↓ (seleccionar + mover).
       4. Marcar / desmarcar como "Hecho" (toggle por elemento).
       5. Quitar un elemento (botón ✕) o vaciar toda la lista.
       6. Guardar la lista (gana 1⭐ la primera vez).
       7. Volver a "Mis listas" (botón dentro del editor, sin salir
          del nivel) para crear otra lista, abrir una guardada o
          borrarla, y así practicar a manejar varias listas.
     Antes de start se muestra un consejo breve (piensa, apunta,
     ordena, marca) para modelar el método antes de practicar.
     No hay pista/Explicación Socrática: las decisiones son libres
     (mismo razonamiento que piano-keys en modo libre o
     tools/builders). Gana 1⭐ solo al save una lista por
     primera vez (regla: solo se suma, nunca se resta).
     ============================================================ */
  var listCreate = { name: '', items: [], selected: -1 };

  function abrirPantallaCrear() {
    listCreate = { name: '', items: [], selected: -1 };
    showScreen('pantallaCrear');
    $('#panelNombre').classList.remove('hidden');
    $('#panelEditor').classList.add('hidden');
    var inputName = $('#inputNombreListaCrear');
    inputName.value = '';
    inputName.placeholder = App.i18n.t('promptListNameDefault');
    feedbackCreateEl.textContent = '';
    feedbackCreateEl.className = 'feedback';
    renderSavedLists();
    renderStars();
    inputName.focus();
  }

  function confirmarNombreLista() {
    var inputName = $('#inputNombreListaCrear');
    var name = inputName.value.trim().slice(0, 30);
    if (!name) {
      feedbackCreateEl.textContent = App.i18n.t('nombreRequerido');
      feedbackCreateEl.className = 'feedback animo';
      App.feedback.encourage(feedbackCreateEl);
      inputName.focus();
      return;
    }
    listCreate.name = name;
    $('#panelNombre').classList.add('hidden');
    $('#panelEditor').classList.remove('hidden');
    if ($('#tituloListaCrear')) $('#tituloListaCrear').textContent = '';
    var inputItem = $('#inputNuevoItemCrear');
    inputItem.placeholder = App.i18n.t('placeholderInputItem');
    inputItem.setAttribute('aria-label', App.i18n.t('ariaInputItem'));
    paintItemsCreate();
    feedbackCreateEl.textContent = '';
    feedbackCreateEl.className = 'feedback';
    inputItem.focus();
  }

  function paintItemsCreate() {
    var el = $('#itemsListaCrear');
    el.innerHTML = '';
    if (listCreate.items.length === 0) {
      var p = document.createElement('li');
      p.className = 'item-vacio';
      p.textContent = App.i18n.t('currentListEmpty');
      el.appendChild(p);
    } else {
      listCreate.items.forEach(function (it, i) {
        var li = document.createElement('li');
        li.className = 'item-crear' +
          (it.done ? ' done' : '') +
          (i === listCreate.selected ? ' selected' : '');

        var pos = document.createElement('span');
        pos.className = 'item-pos';
        pos.setAttribute('aria-hidden', 'true');
        pos.textContent = (i + 1);

        var check = document.createElement('button');
        check.type = 'button';
        check.className = 'item-check';
        check.setAttribute('aria-pressed', String(Boolean(it.done)));
        check.setAttribute(
          'aria-label',
          (it.done ? App.i18n.t('ariaItemHecho') : App.i18n.t('ariaItemPendiente'))
            .replace('{text}', itemText(it))
        );
        check.textContent = it.done ? '✔' : '○';
        check.addEventListener('click', function (e) {
          e.stopPropagation();
          toggleHecho(i);
        });

        var text = document.createElement('span');
        text.className = 'item-text';
        text.textContent = itemText(it);

        var sel = document.createElement('button');
        sel.type = 'button';
        sel.className = 'item-seleccionar';
        sel.setAttribute('aria-label',
          App.i18n.t('ariaSeleccionarItem').replace('{n}', i + 1).replace('{text}', itemText(it)));
        sel.textContent = '↕';
        sel.addEventListener('click', function (e) {
          e.stopPropagation();
          selectItem(i);
        });

        var quitar = document.createElement('button');
        quitar.type = 'button';
        quitar.className = 'item-quitar';
        quitar.textContent = '✕';
        quitar.setAttribute('aria-label', App.i18n.t('ariaRemoveItem').replace('{text}', itemText(it)));
        quitar.addEventListener('click', function (e) {
          e.stopPropagation();
          removeItemCreate(i);
        });

        li.appendChild(pos);
        li.appendChild(check);
        li.appendChild(text);
        li.appendChild(sel);
        li.appendChild(quitar);

        li.addEventListener('click', function () { selectItem(i); });
        el.appendChild(li);
      });
    }

    var done = listCreate.items.filter(function (x) { return x.done; }).length;
    var total = listCreate.items.length;
    var progEl = $('#progresoListaCrear');
    if (total === 0) {
      progEl.textContent = '';
    } else if (done === total) {
      progEl.textContent = App.i18n.t('progresoCrearCompleta');
    } else {
      progEl.textContent = '';
    }

    $('#btnGuardarListaCrear').disabled = listCreate.items.length === 0;

    var sel = listCreate.selected;
    var btnMoveUp = $('#btnSubirItemCrear');
    var btnMoveDown = $('#btnBajarItemCrear');
    btnMoveUp.disabled = !(sel > 0 && listCreate.items.length > 0);
    btnMoveDown.disabled = !(sel >= 0 && sel < listCreate.items.length - 1);
  }

  function selectItem(i) {
    listCreate.selected = (listCreate.selected === i) ? -1 : i;
    paintItemsCreate();
    if (listCreate.selected === -1) {
      feedbackCreateEl.textContent = App.i18n.t('selectorVacio');
      feedbackCreateEl.className = 'feedback';
    } else {
      feedbackCreateEl.textContent = App.i18n.t('seleccionaParaMover');
      feedbackCreateEl.className = 'feedback';
    }
  }

  function moveItemCreate(dir) {
    var sel = listCreate.selected;
    if (sel < 0) {
      feedbackCreateEl.textContent = App.i18n.t('selectorVacio');
      feedbackCreateEl.className = 'feedback';
      return;
    }
    var j = sel + dir;
    if (j < 0 || j >= listCreate.items.length) return;
    var tmp = listCreate.items[sel];
    listCreate.items[sel] = listCreate.items[j];
    listCreate.items[j] = tmp;
    listCreate.selected = j;
    App.feedback.success(feedbackCreateEl);
    feedbackCreateEl.textContent = '';
    paintItemsCreate();
  }

  function addItemCreate() {
    var input = $('#inputNuevoItemCrear');
    var text = input.value.trim();
    if (!text) return;
    listCreate.items.push({ text: text.slice(0, 60), done: false });
    input.value = '';
    App.feedback.success(feedbackCreateEl);
    feedbackCreateEl.textContent = '';
    input.focus();
    paintItemsCreate();
  }

  function removeItemCreate(i) {
    var text = listCreate.items[i].textContent;
    listCreate.items.splice(i, 1);
    if (listCreate.selected === i) listCreate.selected = -1;
    else if (listCreate.selected > i) listCreate.selected -= 1;
    feedbackCreateEl.className = 'feedback';
    App.feedback.encourage(feedbackCreateEl);
    feedbackCreateEl.textContent = '';
    paintItemsCreate();
  }

  function toggleHecho(i) {
    var it = listCreate.items[i];
    it.done = !it.done;
    if (it.done) {
      App.feedback.success(feedbackCreateEl);
      feedbackCreateEl.textContent = '';
    } else {
      feedbackCreateEl.textContent = '';
    }
    paintItemsCreate();
  }

  function emptyListCreate() {
    listCreate.items = [];
    listCreate.selected = -1;
    feedbackCreateEl.textContent = App.i18n.t('listDeletedFeedback');
    feedbackCreateEl.className = 'feedback';
    paintItemsCreate();
  }

  function saveListCreate() {
    if (listCreate.items.length === 0) return;
    var entradas = listCreate.items.map(function (it) {
      return { text: itemText(it), done: Boolean(it.done) };
    });
    /* Si la lista ya existía (mismo name), actualizamos en vez de duplicar. */
    var idxExistente = -1;
    for (var i = 0; i < progress.myLists.length; i++) {
      if (progress.myLists[i].name === listCreate.name) { idxExistente = i; break; }
    }
    var esNueva = idxExistente === -1;
    if (esNueva) {
      progress.myLists.push({
        name: listCreate.name,
        items: entradas,
        guardada: App.utils.hoy()
      });
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star(); /* Sumar estrella solo al save una lista nueva. */
    } else {
      progress.myLists[idxExistente].items = entradas;
      progress.myLists[idxExistente].guardada = App.utils.hoy();
    }
    save();
    renderStars();
    App.feedback.success(feedbackCreateEl);
    feedbackCreateEl.textContent = App.i18n.t('listSavedFeedback');
    renderSavedLists();
  }

  function renderSavedLists() {
    var el = $('#savedLists');
    if (!el) return;
    el.innerHTML = '';
    if (progress.myLists.length === 0) return;

    var h3 = document.createElement('h3');
    h3.textContent = App.i18n.t('yourLists');
    el.appendChild(h3);

    progress.myLists.forEach(function (list, i) {
      var wrap = document.createElement('div');
      wrap.className = 'saved-list';

      var row = document.createElement('div');
      row.className = 'saved-list-row';

      var info = document.createElement('button');
      info.type = 'button';
      info.className = 'saved-list-info';
      info.setAttribute('aria-expanded', 'false');
      info.setAttribute('aria-label', App.i18n.t('ariaViewList').replace('{name}', list.name));
      var name = document.createElement('span');
      name.className = 'name';
      name.textContent = list.name;
      var count = document.createElement('span');
      count.className = 'count';
      count.textContent = '';
      info.appendChild(name);
      info.appendChild(count);

      var acciones = document.createElement('div');
      acciones.className = 'saved-list-acciones';

      var btnListen = document.createElement('button');
      btnListen.type = 'button';
      btnListen.textContent = '🔊';
      btnListen.setAttribute('aria-label', App.i18n.t('ariaListenList').replace('{name}', list.name));
      btnListen.addEventListener('click', function (e) {
        e.stopPropagation();
        var done = list.items.filter(function (x) { return x.done; }).length;
        if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(list.name + '. ' + list.items.length + ' ' +
          App.i18n.t('elementosCount').replace('{n}', list.items.length) + '. ' +
          list.items.map(itemText).join(', '));
      });

      var btnAbrir = document.createElement('button');
      btnAbrir.type = 'button';
      btnAbrir.textContent = '✏️';
      btnAbrir.setAttribute('aria-label', App.i18n.t('ariaAbrirLista').replace('{name}', list.name));
      btnAbrir.addEventListener('click', function (e) {
        e.stopPropagation();
        abrirListaGuardada(i);
      });

      var btnErase = document.createElement('button');
      btnErase.type = 'button';
      btnErase.textContent = '🗑️';
      btnErase.setAttribute('aria-label', App.i18n.t('ariaDeleteList').replace('{name}', list.name));
      btnErase.addEventListener('click', function (e) {
        e.stopPropagation();
        progress.myLists.splice(i, 1);
        save();
        renderSavedLists();
        feedbackCreateEl.className = 'feedback';
        feedbackCreateEl.textContent = App.i18n.t('listDeletedFeedback');
      });

      acciones.appendChild(btnListen);
      acciones.appendChild(btnAbrir);
      acciones.appendChild(btnErase);

      row.appendChild(info);
      row.appendChild(acciones);
      wrap.appendChild(row);

      var itemsEl = document.createElement('ul');
      itemsEl.className = 'saved-list-items hidden';
      list.items.forEach(function (it) {
        var li = document.createElement('li');
        li.className = it.done ? 'done' : '';
        li.textContent = (it.done ? '✔ ' : '○ ') + itemText(it);
        itemsEl.appendChild(li);
      });
      wrap.appendChild(itemsEl);

      info.addEventListener('click', function () {
        var visible = !itemsEl.classList.contains('hidden');
        itemsEl.classList.toggle('hidden', visible);
        info.setAttribute('aria-expanded', String(!visible));
      });

      el.appendChild(wrap);
    });
  }

  /* Vuelve al panel de "Mis listas" sin salir del Nivel 3, para poder
     crear otra lista, abrir otra guardada o borrar alguna sin perder
     el sitio (los cambios sin save de la lista current se pierden,
     igual que al pulsar "Volver": guardarListaCrear() es explícito). */
  function volverAMisListas() {
    $('#panelEditor').classList.add('hidden');
    $('#panelNombre').classList.remove('hidden');
    var inputName = $('#inputNombreListaCrear');
    inputName.value = '';
    inputName.placeholder = App.i18n.t('promptListNameDefault');
    feedbackCreateEl.textContent = '';
    feedbackCreateEl.className = 'feedback';
    renderSavedLists();
    renderStars();
    inputName.focus();
  }

  function abrirListaGuardada(i) {
    var list = progress.myLists[i];
    if (!list) return;
    listCreate = {
      name: list.name,
      items: list.items.map(function (x) { return { text: itemText(x), done: Boolean(x.done) }; }),
      selected: -1
    };
    $('#panelNombre').classList.add('hidden');
    $('#panelEditor').classList.remove('hidden');
    if ($('#tituloListaCrear')) $('#tituloListaCrear').textContent = '';
    var inputItem = $('#inputNuevoItemCrear');
    inputItem.value = '';
    inputItem.placeholder = App.i18n.t('placeholderInputItem');
    inputItem.setAttribute('aria-label', App.i18n.t('ariaInputItem'));
    feedbackCreateEl.textContent = '';
    feedbackCreateEl.className = 'feedback';
    paintItemsCreate();
    inputItem.focus();
  }

  /* Events */
  btnNext.addEventListener('click', next);
  if ($('#repeatBtn')) $('#repeatBtn').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    App.utils.goMenu();
  });

  /* Eventos del Nivel 3 — "Crea tu lista". */
  var btnStartCreate = $('#btnEmpezarCrear');
  if (btnStartCreate) btnStartCreate.addEventListener('click', confirmarNombreLista);
  var inputNameListCreate = $('#inputNombreListaCrear');
  if (inputNameListCreate) inputNameListCreate.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); confirmarNombreLista(); }
  });
  var btnAddItemCreate = $('#btnAnadirItemCrear');
  if (btnAddItemCreate) btnAddItemCreate.addEventListener('click', addItemCreate);
  var inputNuevoItemCrear = $('#inputNuevoItemCrear');
  if (inputNuevoItemCrear) inputNuevoItemCrear.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); addItemCreate(); }
  });
  var btnEmptyListCreate = $('#btnVaciarListaCrear');
  if (btnEmptyListCreate) btnEmptyListCreate.addEventListener('click', emptyListCreate);
  if ($('#btnGuardarListaCrear')) $('#btnGuardarListaCrear').addEventListener('click', saveListCreate);
  if ($('#btnSubirItemCrear')) $('#btnSubirItemCrear').addEventListener('click', function () { moveItemCreate(-1); });
  if ($('#btnBajarItemCrear')) $('#btnBajarItemCrear').addEventListener('click', function () { moveItemCreate(1); });
  if ($('#btnMisListas')) $('#btnMisListas').addEventListener('click', volverAMisListas);

  /* "Volver" contextual: si la persona está en medio de "Crea tu
     lista", la primera pulsación la lleva al menú de niveles
     (no al sitio), igual que en routines (btnBack). */
  if ($('#btnBack')) $('#btnBack').addEventListener('click', function (e) {
    if (!screenCreate.classList.contains('hidden')) {
      e.preventDefault();
      App.utils.goMenu();
    }
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();
