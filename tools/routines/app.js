/* ============================================================
   Routime — Mis Rutinas (secuenciación y autonomía)
   Rutinas diarias paso a paso. Cada paso se marca como "Hecho".
   El status se reinicia automáticamente cada día.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'rutinas';
  var $ = App.utils.$;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  var menuScreen = $('#menuScreen');
  var routineScreen = $('#routineScreen');
  var endScreen = $('#endScreen');
  var orderScreen = $('#orderScreen');
  var freeListScreen = $('#freeListScreen');
  var routinesList = $('#routinesList');
  var stepsList = $('#stepsList');
  var orderList = $('#orderList');
  var routineTitle = $('#routineTitle');
  var orderTitle = $('#orderTitle');
  var progressFill = $('#progressFill');
  var feedbackEl = $('#feedback');
  var orderFeedback = $('#orderFeedback');
  var starsEl = $('#stars');
  var predefinedTab = $('#predefinedTab');
  var ownTab = $('#ownTab');
  var orderDrag = null;
  var suppressDragClick = false;

  /* Progreso persistente. Si la fecha guardada no es hoy, se reinicia. */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (progress.fecha !== App.utils.hoy() || !progress.done) {
    progress.fecha = App.utils.hoy();
    progress.done = {}; /* { idRutina: [true, false, ...] } */
  }
  /* Estado de la pantalla "Ordena la rutina". No se reinicia cada día:
     el progress de ordenación es aprendizaje a largo plazo. */
  if (!progress.orden || typeof progress.orden !== 'object') progress.orden = {};
  /* attempts: { idRutina: number } - contador Socrático (1ª pista, 2ª solución). */

  /* Listas libres creadas por la persona. Contenido propio, no del
     catálogo: tampoco se reinicia cada día (igual que "orden"). */
  if (!Array.isArray(progress.myLists)) progress.myLists = [];

  var currentRoutine = null;

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function doneOf(rutina) {
    if (!progress.done[rutina.id]) {
      progress.done[rutina.id] = rutina.steps.map(function () { return false; });
    }
    return progress.done[rutina.id];
  }

  function countDone(rutina) {
    return doneOf(rutina).filter(Boolean).length;
  }

  /* ---- Routine menu ----
     Organised by time-of-day sections (manana, comida, noche, salida).
     Each routine is a single card with one primary action and a small
     "Order the routine" link underneath. Cards collapse into sections
     so the user sees the day at a glance instead of a flat list. */
  var SECTIONS = [
    { id: 'manana',   key: 'sectionMorning' },
    { id: 'comida',   key: 'sectionLunch' },
    { id: 'limpieza', key: 'sectionCleaning' },
    { id: 'personal', key: 'sectionPersonal' },
    { id: 'mascotas', key: 'sectionPets' },
    { id: 'tarde',    key: 'sectionAfternoon' },
    { id: 'salida',   key: 'sectionOuting' },
    { id: 'noche',    key: 'sectionNight' }
  ];

  function routinesOf(timeOfDayId) {
    return DATOS.filter(function (r) { return r.timeOfDay === timeOfDayId; });
  }

  function renderMenu() {
    routineScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    orderScreen.classList.add('hidden');
    freeListScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    routinesList.innerHTML = '';

    /* Subsecciones por timeOfDay: "Pasos" (marcar paso a paso) y "Ordenar"
       (secuenciar la rutina). Cada timeOfDay tiene su propia lista de
       rutinas en cada subsección; así separamos "hacer la tarea" de
       "ordenar la tarea" sin mezclarlas en la misma tarjeta. */
    function createCard(rutina, modo) {
      var done = countDone(rutina);
      var total = rutina.steps.length;
      var completada = done === total;

      var card = document.createElement('article');
      card.className = 'card routine-card' +
        (completada ? ' card-completed' : '') +
        (modo === 'ordenar' ? ' routine-card-ordenar' : '');

      var media = document.createElement('div');
      media.className = 'routine-card-media';
      var picto = document.createElement('span');
      picto.className = 'picto';
      picto.setAttribute('aria-hidden', 'true');
      picto.textContent = rutina.picto;
      media.appendChild(picto);

      var cuerpo = document.createElement('div');
      cuerpo.className = 'routine-card-cuerpo';

      var name = document.createElement('span');
      name.className = 'name';
      name.textContent = rutina.name;
      cuerpo.appendChild(name);

      /* En la subsección "Pasos" mostramos barra + status de avance.
         En "Ordenar" no aplica el contador de steps done; dejamos
         solo el botón para entrar al puzzle de secuenciación. */
      if (modo === 'steps') {
        var progress = document.createElement('div');
        progress.className = 'routine-card-progress';
        var barra = document.createElement('div');
        barra.className = 'routine-card-barra';
        var barraFill = document.createElement('span');
        barraFill.className = 'routine-card-barra-fill';
        barraFill.style.width = ((done / total) * 100) + '%';
        barra.appendChild(barraFill);
        var status = document.createElement('span');
        status.className = 'status';
        /* Sin contador numérico "X de Y steps" en las tarjetas del menú:
           la barra visual ya muestra el avance y se evita la presión. */
        status.textContent = completada ? App.i18n.t('completedToday') : '';
        if (status.textContent) progress.appendChild(status);
        cuerpo.appendChild(progress);
      }

      var acciones = document.createElement('div');
      acciones.className = 'routine-card-acciones';

      var btnAccion = document.createElement('button');
      btnAccion.type = 'button';
      if (modo === 'steps') {
        btnAccion.className = 'btn btn-start';
        btnAccion.textContent = App.i18n.t(completada ? 'btnRepeat' : 'btnStart');
        btnAccion.setAttribute('aria-label',
          (completada ? App.i18n.t('btnRepeat') : App.i18n.t('btnStart'))
          + ': ' + rutina.name);
        btnAccion.addEventListener('click', function () { openRoutine(rutina); });
      } else {
        btnAccion.className = 'btn-ordenar-rutina';
        btnAccion.textContent = App.i18n.t('btnOrder');
        btnAccion.setAttribute('aria-label', App.i18n.t('btnOrder') + ': ' + rutina.name);
        btnAccion.addEventListener('click', function () { openOrder(rutina); });
      }
      acciones.appendChild(btnAccion);

      cuerpo.appendChild(acciones);
      card.appendChild(media);
      card.appendChild(cuerpo);
      return card;
    }

    function crearSubseccion(headingKey, nivel) {
      var sub = document.createElement('div');
      sub.className = 'routines-subsection';
      var h = document.createElement('h3');
      h.className = 'routines-subsection-heading';
      h.textContent = App.i18n.t(headingKey);
      sub.appendChild(h);
      if (nivel === 1) {
        var grid = document.createElement('div');
        grid.className = 'cards-grid';
        sub.appendChild(grid);
        return { sub: sub, grid: grid };
      }
      return { sub: sub, grid: null };
    }

    SECTIONS.forEach(function (sec) {
      var rutinas = routinesOf(sec.id);
      if (rutinas.length === 0) return;

      var section = document.createElement('section');
      section.className = 'routines-section';
      section.setAttribute('aria-labelledby', 'sec-' + sec.id);

      var heading = document.createElement('h2');
      heading.id = 'sec-' + sec.id;
      heading.className = 'routines-section-heading';
      heading.textContent = App.i18n.t(sec.key);
      section.appendChild(heading);

      var subPasos = crearSubseccion('subsectionSteps', 1);
      var subOrdenar = crearSubseccion('subsectionOrder', 1);

      rutinas.forEach(function (rutina) {
        subPasos.grid.appendChild(createCard(rutina, 'steps'));
        subOrdenar.grid.appendChild(createCard(rutina, 'ordenar'));
      });

      section.appendChild(subPasos.sub);
      section.appendChild(subOrdenar.sub);
      routinesList.appendChild(section);
    });

    renderStars();
  }

  function showTab(tab) {
    var propias = tab === 'propias';
    routineScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    orderScreen.classList.add('hidden');
    menuScreen.classList.toggle('hidden', propias);
    freeListScreen.classList.toggle('hidden', !propias);
    predefinedTab.classList.toggle('activa', !propias);
    ownTab.classList.toggle('activa', propias);
    predefinedTab.setAttribute('aria-selected', String(!propias));
    ownTab.setAttribute('aria-selected', String(propias));
    if (propias) {
      renderCurrentList();
      renderSavedLists();
    }
  }

  /* Tarjeta de entrada a "Crea tu lista": no viene del catálogo DATA,
     así que se construye aparte, con el mismo estilo visual de tarjeta. */
  function crearSeccionListasLibres() {
    var section = document.createElement('section');
    section.className = 'routines-section';
    section.setAttribute('aria-labelledby', 'sec-listas-libres');

    var heading = document.createElement('h2');
    heading.id = 'sec-listas-libres';
    heading.className = 'routines-section-heading';
    heading.textContent = App.i18n.t('freeListsSection');
    section.appendChild(heading);

    var descripcion = document.createElement('p');
    descripcion.className = 'instruccion';
    descripcion.textContent = App.i18n.t('freeListsDescription');
    section.appendChild(descripcion);

    var grid = document.createElement('div');
    grid.className = 'cards-grid';

    var card = document.createElement('article');
    card.className = 'card routine-card';

    var media = document.createElement('div');
    media.className = 'routine-card-media';
    var picto = document.createElement('span');
    picto.className = 'picto';
    picto.setAttribute('aria-hidden', 'true');
    picto.textContent = '📝';
    media.appendChild(picto);

    var cuerpo = document.createElement('div');
    cuerpo.className = 'routine-card-cuerpo';
    var name = document.createElement('span');
    name.className = 'name';
    name.textContent = App.i18n.t('freeListCardName');
    var descripcionTarjeta = document.createElement('span');
    descripcionTarjeta.className = 'status';
    descripcionTarjeta.textContent = App.i18n.t('freeListCardDescription');
    cuerpo.appendChild(name);
    cuerpo.appendChild(descripcionTarjeta);

    var acciones = document.createElement('div');
    acciones.className = 'routine-card-acciones';
    var btnAccion = document.createElement('button');
    btnAccion.type = 'button';
    btnAccion.className = 'btn btn-start';
    btnAccion.textContent = App.i18n.t('btnStart');
    btnAccion.setAttribute('aria-label', App.i18n.t('btnStart') + ': ' + App.i18n.t('freeListCardName'));
    btnAccion.addEventListener('click', openFreeList);
    acciones.appendChild(btnAccion);
    cuerpo.appendChild(acciones);

    card.appendChild(media);
    card.appendChild(cuerpo);
    grid.appendChild(card);
    section.appendChild(grid);
    return section;
  }

  /* ---- Vista de una rutina ---- */
  function openRoutine(rutina) {
    currentRoutine = rutina;
    menuScreen.classList.add('hidden');
    routineScreen.classList.remove('hidden');
    routineTitle.textContent = rutina.picto + ' ' + rutina.name;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    renderSteps();
  }

  function renderSteps() {
    var done = doneOf(currentRoutine);
    var current = done.indexOf(false); /* primer paso pendiente */
    stepsList.innerHTML = '';

    currentRoutine.steps.forEach(function (paso, i) {
      var li = document.createElement('li');
      li.className = 'paso' +
        (done[i] ? ' done' : '') +
        (i === current ? ' current' : '');

      var picto = (typeof paso.picto === 'string' && /^\.{1,2}\//.test(paso.picto))
        ? '<img class="picto" src="' + paso.picto + '" alt="" aria-hidden="true" loading="lazy" decoding="async">'
        : '<span class="picto" aria-hidden="true">' + paso.picto + '</span>';
      var text = '<span class="text">' + paso.text + '</span>';
      var hechoBtn = '<button type="button" class="btn btn-done"' +
        (i === current ? '' : ' disabled') + '>' +
        App.i18n.t('btnDone') + '</button>';

      li.innerHTML = picto + text + (done[i] ? '<span class="check" aria-label="' + App.i18n.t('ariaStepDone') + '">✔</span>' : hechoBtn);

      var btnDone = li.querySelector('.btn-done');
      if (btnDone) {
        btnDone.addEventListener('click', function () { markDone(i); });
      }
      stepsList.appendChild(li);
    });

    var n = countDone(currentRoutine);
    var total = currentRoutine.steps.length;
    progressFill.style.width = ((n / total) * 100) + '%';
  }

  function markDone(i) {
    var done = doneOf(currentRoutine);
    done[i] = true;
    save();
    App.feedback.success(feedbackEl);

    if (countDone(currentRoutine) === currentRoutine.steps.length) {
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      endRoutine();
    } else {
      renderSteps();
    }
  }

  function endRoutine() {
    renderSteps();
    routineScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = App.i18n.t('routineCompletedTitle');
    $('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('routineCompletedTitle'));
    renderStars();
  }

  /* ---- Pantalla "Ordena la rutina" ----
     Patrón "La Casa": dos columnas. Izquierda = "Tu orden" (slots
     numerados 1..N que la persona va rellenando). Derecha = "Pasos"
     disponibles (los pictogramas mezclados que toca para colocar).
     Tocar un slot ocupado devuelve su paso a la column derecha.
     Una pareja de flechas ↑/↓ permite mover el slot selected
     a una posición contigua sin tener que devolver y recolocar.
     Patrón Socrático: 1.er error → pista (primer paso correct);
                        2.º error → "Ver solución".
     Reglas: nunca castigo (App.feedback.encourage), +1⭐ al acertar,
     progress persistente de orden (no se reinicia cada día). */
  var currentOrder = null;
  /* {
       rutina, attempts,
       slots: (number|null)[]   — índice de paso o null si está vacío
       disponibles: number[]    — índices aún sin colocar
       seleccionadoSlot: number|null
     } */

  function barajar(arr) {
    /* Fisher-Yates, sin mutar el original. */
    var copia = arr.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copia[i]; copia[i] = copia[j]; copia[j] = tmp;
    }
    return copia;
  }

  function openOrder(rutina) {
    var ids = rutina.steps.map(function (_, i) { return i; });
    currentOrder = {
      rutina: rutina,
      attempts: 0,
      hintUsed: false,
      solved: false,
      hintSlot: -1,
      slots: new Array(rutina.steps.length).fill(null),
      disponibles: barajar(ids),
      seleccionadoSlot: null
    };
    menuScreen.classList.add('hidden');
    routineScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    orderScreen.classList.remove('hidden');
    orderTitle.textContent = rutina.picto + ' ' + rutina.name;
    orderFeedback.textContent = '';
    orderFeedback.className = 'feedback';
    renderOrder();
  }

  function renderOrder() {
    var rutina = currentOrder.rutina;
    var sel = currentOrder.seleccionadoSlot;
    var slotsEl = $('#slotsList');
    var dispEl = $('#availableStepsList');
    slotsEl.innerHTML = '';
    dispEl.innerHTML = '';

    currentOrder.slots.forEach(function (idPaso, i) {
      var li = document.createElement('li');
      var filled = idPaso !== null;
      li.className = 'slot-orden' + (filled ? ' filled' : '') + (i === sel ? ' selected' : '') +
        (currentOrder.hintSlot === i ? ' pista' : '');
      li.dataset.slotIndex = i;
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');

      var pos = document.createElement('span');
      pos.className = 'slot-posicion';
      pos.setAttribute('aria-hidden', 'true');
      pos.textContent = (i + 1);
      li.appendChild(pos);

      if (filled) {
        var paso = rutina.steps[idPaso];
        li.setAttribute(
          'aria-label',
          App.i18n.t('ariaSlotFilled').replace('{n}', i + 1).replace('{text}', paso.text)
        );
        var picto = document.createElement('span');
        picto.className = 'slot-picto';
        picto.setAttribute('aria-hidden', 'true');
        picto.textContent = paso.picto;
        li.appendChild(picto);
        var text = document.createElement('span');
        text.className = 'slot-text';
        text.textContent = paso.text;
        li.appendChild(text);
      } else {
        li.setAttribute(
          'aria-label', App.i18n.t('ariaSlotEmpty').replace('{n}', i + 1)
        );
        var hint = document.createElement('span');
        hint.className = 'slot-vacio-hint';
        hint.setAttribute('aria-hidden', 'true');
        hint.textContent = '?';
        li.appendChild(hint);
      }

      li.addEventListener('click', function () {
        if (suppressDragClick) return;
        tapSlot(i);
      });
      hacerArrastrableOrden(li, { tipo: 'slot', indice: i });
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tapSlot(i);
        }
      });
      slotsEl.appendChild(li);
    });

    currentOrder.disponibles.forEach(function (idPaso) {
      var paso = rutina.steps[idPaso];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'paso-available';
      btn.dataset.pasoId = idPaso;
      btn.setAttribute(
        'aria-label',
        App.i18n.t('ariaStepAvailable').replace('{text}', paso.text)
      );
      var p = document.createElement('span');
      p.className = 'paso-available-picto';
      p.setAttribute('aria-hidden', 'true');
      p.textContent = paso.picto;
      btn.appendChild(p);
      var t = document.createElement('span');
      t.className = 'paso-available-text';
      t.textContent = paso.text;
      btn.appendChild(t);
      btn.addEventListener('click', function () {
        if (suppressDragClick) return;
        placeFromAvailable(idPaso);
      });
      hacerArrastrableOrden(btn, { tipo: 'available', pasoId: idPaso });
      dispEl.appendChild(btn);
    });

    updateMoveBar();
    updateSocraticButtons();
  }

  /* Arrastre unificado para ratón, dedo y lápiz. El clic sigue siendo la
     alternativa para teclado y para dispositivos que no soporten Pointer
     Events. */
  function hacerArrastrableOrden(el, origen) {
    if (!window.PointerEvent) return;
    el.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      orderDrag = { origen: origen, inicioX: e.clientX, inicioY: e.clientY,
        activo: false, elemento: el, pointerId: e.pointerId };
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', function (e) {
      if (!orderDrag || orderDrag.pointerId !== e.pointerId) return;
      var dx = e.clientX - orderDrag.inicioX;
      var dy = e.clientY - orderDrag.inicioY;
      if (!orderDrag.activo && Math.sqrt(dx * dx + dy * dy) < 8) return;
      orderDrag.activo = true;
      el.classList.add('dragging');
      e.preventDefault();
    });
    el.addEventListener('pointerup', function (e) {
      if (!orderDrag || orderDrag.pointerId !== e.pointerId) return;
      var datos = orderDrag;
      orderDrag = null;
      el.classList.remove('dragging');
      if (!datos.activo) return;
      suppressDragClick = true;
      var destino = document.elementFromPoint(e.clientX, e.clientY);
      var slot = destino && destino.closest ? destino.closest('.slot-orden') : null;
      if (slot) dropStepInSlot(datos.origen, Number(slot.dataset.slotIndex));
      setTimeout(function () { suppressDragClick = false; }, 0);
    });
    el.addEventListener('pointercancel', function () {
      orderDrag = null;
      el.classList.remove('dragging');
    });
  }

  function dropStepInSlot(origen, destino) {
    if (!currentOrder || destino < 0 || destino >= currentOrder.slots.length) return;
    if (origen.tipo === 'available') {
      var prev = currentOrder.slots[destino];
      currentOrder.slots[destino] = origen.pasoId;
      currentOrder.disponibles = currentOrder.disponibles.filter(function (x) { return x !== origen.pasoId; });
      if (prev !== null) currentOrder.disponibles.push(prev);
    } else if (origen.indice !== destino) {
      var paso = currentOrder.slots[origen.indice];
      currentOrder.slots[origen.indice] = currentOrder.slots[destino];
      currentOrder.slots[destino] = paso;
    }
    currentOrder.seleccionadoSlot = destino;
    currentOrder.hintSlot = -1;
    renderOrder();
  }

  function updateSocraticButtons() {
    var btnHint = $('#btnHintOrder');
    var btnResolve = $('#btnResolveOrder');
    var btnCheck = $('#btnCheck');
    if (!btnHint || !btnResolve || !btnCheck) return;
    /* Progresión Socrática:
         0 errores → pista y resolver deshabilitados.
         1 error  → pista habilitada (un solo uso), resolver deshabilitado.
         2+ error → pista agotada, resolver habilitado. */
    btnHint.disabled = !(currentOrder.attempts >= 1 && !currentOrder.hintUsed);
    btnResolve.disabled = !(currentOrder.attempts >= 2);
    /* Si se ha usado "Ver solución", el comprobar no concede estrella. */
    btnCheck.disabled = currentOrder.solved;
  }

  function placeFromAvailable(idPaso) {
    /* Busca el primer slot vacío y coloca ahí el paso. */
    var idx = currentOrder.slots.indexOf(null);
    if (idx === -1) return; /* No debería pasar: si no hay slots libres el paso está colocado. */
    currentOrder.slots[idx] = idPaso;
    currentOrder.disponibles = currentOrder.disponibles.filter(function (x) { return x !== idPaso; });
    currentOrder.seleccionadoSlot = idx;
    currentOrder.hintSlot = -1;
    renderOrder();
  }

  function tapSlot(i) {
    var idPaso = currentOrder.slots[i];
    if (idPaso === null) return; /* Slot vacío: no hace nada (los steps van por la column derecha). */
    /* Slot ocupado: devuelve el paso a la column de disponibles. */
    currentOrder.slots[i] = null;
    currentOrder.disponibles.push(idPaso);
    currentOrder.seleccionadoSlot = null;
    currentOrder.hintSlot = -1;
    renderOrder();
  }

  function updateMoveBar() {
    var sel = currentOrder.seleccionadoSlot;
    var total = currentOrder.slots.length;
    var btnMoveUp = $('#btnMoveStepUp');
    var btnMoveDown = $('#btnMoveStepDown');
    btnMoveUp.disabled = !(sel !== null && sel > 0 && currentOrder.slots[sel] !== null);
    btnMoveDown.disabled = !(sel !== null && sel < total - 1 && currentOrder.slots[sel] !== null);
  }

  function moverSlot(dir) {
    var sel = currentOrder.seleccionadoSlot;
    if (sel === null) return;
    var j = sel + dir;
    if (j < 0 || j >= currentOrder.slots.length) return;
    var a = currentOrder.slots[sel];
    var b = currentOrder.slots[j];
    currentOrder.slots[sel] = b;
    currentOrder.slots[j] = a;
    currentOrder.seleccionadoSlot = j;
    currentOrder.hintSlot = -1;
    renderOrder();
  }

  function countCorrectlyPlaced() {
    var n = 0;
    currentOrder.slots.forEach(function (idPaso, i) {
      if (idPaso === i) n++;
    });
    return n;
  }

  function checkOrder() {
    /* Si el usuario ha pedido ver la solución, comprobar no concede
       estrella (es solo una revisión, no un logro propio). */
    if (currentOrder.solved) {
      orderFeedback.textContent = App.i18n.t('resolveOrder');
      return;
    }
    /* Solo se puede comprobar cuando todos los slots están llenos. */
    var vacios = currentOrder.slots.filter(function (s) { return s === null; }).length;
    if (vacios > 0) {
      App.feedback.encourage(orderFeedback);
      orderFeedback.textContent = App.i18n.t('ordenIncompleto');
      return;
    }
    var total = currentOrder.slots.length;
    var bien = countCorrectlyPlaced();
    var todoBien = bien === total;
    if (todoBien) {
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      App.feedback.success(orderFeedback);
      orderFeedback.textContent = App.i18n.t('ordenCorrecto');
      App.feedback.celebrate(App.i18n.t('ordenCorrecto'));
      renderStars();
    } else {
      currentOrder.attempts++;
      /* Si ya consumió la pista, se resetea para el próximo ciclo de help. */
      currentOrder.hintUsed = false;
      save();
      App.feedback.encourage(orderFeedback);
      /* Sin contador "X de Y steps en su sitio": feedback cualitativo. */
      orderFeedback.textContent = App.i18n.t('ordenIncorrecto');
      updateSocraticButtons();
    }
  }

  function hintOrder() {
    /* Busca el primer slot mal colocado y lo marca visualmente.
       Si el slot 0 ya está bien, busca el primer índice cuyo paso
       correct NO esté ya en su sitio. Eso da una pista útil y
       evita decir "pon primero X" cuando X ya está bien colocado. */
    var steps = currentOrder.rutina.steps;
    var slotToMark = -1;
    for (var i = 0; i < currentOrder.slots.length; i++) {
      if (currentOrder.slots[i] !== i) { slotToMark = i; break; }
    }
    if (slotToMark === -1) {
      /* Todo está bien colocado: pista trivial, no se muestra. */
      orderFeedback.textContent = '';
      return;
    }
    currentOrder.hintSlot = slotToMark;
    currentOrder.hintUsed = true;
    orderFeedback.textContent = '';
    renderOrder();
    /* Quita el resaltado tras unos segundos para no condicionar el siguiente intento. */
    setTimeout(function () {
      if (currentOrder && currentOrder.hintSlot === slotToMark) {
        currentOrder.hintSlot = -1;
        renderOrder();
      }
    }, 3500);
  }

  function resolveOrder() {
    currentOrder.slots = currentOrder.rutina.steps.map(function (_, i) { return i; });
    currentOrder.disponibles = [];
    currentOrder.seleccionadoSlot = null;
    currentOrder.solved = true;
    renderOrder();
    orderFeedback.textContent = App.i18n.t('resolveOrder');
  }

  /* ---- Pantalla "Crea tu lista" ----
     Patrón "Compositor" de piano-keys: la persona escribe elementos
     libres, forma un borrador, le pone name en un panel propio
     (nunca window.prompt: rompe Lectura Fácil/TTS) y lo guarda.
     Sin Socrático (pista/explicación): no hay "respuesta correcta"
     que explicar, igual que el modo libre de piano-keys o builders.
     Gana 1⭐ cada lista guardada (regla: solo se suma, nunca se resta). */
  /* editando: referencia directa al objeto dentro de progress.myLists
     que se está modificando (null = creando una lista nueva). Guardar la
     referencia, no el índice, evita desincronizarse si otra lista se
     borra mientras se edita esta. */
  var freeList = { items: [], editando: null, originalName: null };

  function openFreeList() {
    freeList.items = [];
    freeList.editando = null;
    freeList.originalName = null;
    menuScreen.classList.add('hidden');
    freeListScreen.classList.remove('hidden');
    $('#nameList').classList.add('hidden');
    $('#freeListFeedback').textContent = '';
    $('#inputNewItem').placeholder = App.i18n.t('placeholderInputItem');
    $('#inputNewItem').setAttribute('aria-label', App.i18n.t('ariaInputItem'));
    $('#inputNewItem').value = '';
    renderCurrentList();
    renderSavedLists();
  }

  function renderCurrentList() {
    var el = $('#currentListItems');
    el.innerHTML = '';
    if (freeList.items.length === 0) {
      var p = document.createElement('p');
      p.className = 'placeholder-text';
      p.textContent = App.i18n.t('currentListEmpty');
      el.appendChild(p);
    } else {
      freeList.items.forEach(function (text, i) {
        var li = document.createElement('li');
        li.className = 'current-list-item';

        var flechas = document.createElement('div');
        flechas.className = 'list-item-arrows';
        var btnMoveUp = document.createElement('button');
        btnMoveUp.type = 'button';
        btnMoveUp.className = 'btn-arrow-item';
        btnMoveUp.textContent = '↑';
        btnMoveUp.disabled = i === 0;
        btnMoveUp.setAttribute('aria-label', App.i18n.t('ariaMoveUpItem').replace('{text}', text));
        btnMoveUp.addEventListener('click', function () { moveItem(i, -1); });
        var btnMoveDown = document.createElement('button');
        btnMoveDown.type = 'button';
        btnMoveDown.className = 'btn-arrow-item';
        btnMoveDown.textContent = '↓';
        btnMoveDown.disabled = i === freeList.items.length - 1;
        btnMoveDown.setAttribute('aria-label', App.i18n.t('ariaMoveDownItem').replace('{text}', text));
        btnMoveDown.addEventListener('click', function () { moveItem(i, 1); });
        flechas.appendChild(btnMoveUp);
        flechas.appendChild(btnMoveDown);

        var span = document.createElement('span');
        span.className = 'text';
        span.textContent = text;
        var btnQuitar = document.createElement('button');
        btnQuitar.type = 'button';
        btnQuitar.className = 'btn-remove-item';
        btnQuitar.textContent = '✕';
        btnQuitar.setAttribute('aria-label', App.i18n.t('ariaRemoveItem').replace('{text}', text));
        btnQuitar.addEventListener('click', function () { removeItem(i); });
        li.appendChild(span);
        li.appendChild(flechas);
        li.appendChild(btnQuitar);
        el.appendChild(li);
      });
    }
    $('#btnSaveList').disabled = freeList.items.length === 0;
    updateEditNotice();
  }

  function addItem() {
    var input = $('#inputNewItem');
    var text = input.value.trim();
    if (!text) return;
    freeList.items.push(text);
    input.value = '';
    input.focus();
    renderCurrentList();
  }

  function removeItem(i) {
    freeList.items.splice(i, 1);
    renderCurrentList();
  }

  function moveItem(i, dir) {
    var j = i + dir;
    if (j < 0 || j >= freeList.items.length) return;
    var tmp = freeList.items[i];
    freeList.items[i] = freeList.items[j];
    freeList.items[j] = tmp;
    renderCurrentList();
  }

  function clearCurrentList() {
    freeList.items = [];
    renderCurrentList();
  }

  /* ---- Editar una lista guardada ----
     Carga sus elementos en el mismo editor que "Crea tu lista": añadir,
     quitar y reordenar funcionan igual. Al save se actualiza la lista
     en lugar de crear una nueva y no se concede estrella extra (evita
     "cultivar" estrellas editando una y otra vez). */
  function editList(lista) {
    freeList.items = lista.items.slice();
    freeList.editando = lista;
    freeList.originalName = lista.name;
    $('#nameList').classList.add('hidden');
    renderCurrentList();
    renderSavedLists();
    $('#inputNewItem').focus();
  }

  function cancelEdit() {
    freeList.items = [];
    freeList.editando = null;
    freeList.originalName = null;
    $('#nameList').classList.add('hidden');
    renderCurrentList();
    renderSavedLists();
  }

  function updateEditNotice() {
    var editando = freeList.editando !== null;
    $('#editingNotice').classList.toggle('hidden', !editando);
    if (editando) {
      $('#editingNoticeText').textContent = App.i18n.t('editandoListaAviso').replace('{name}', freeList.originalName);
    }
    $('#btnSaveList').textContent = App.i18n.t(editando ? 'btnGuardarCambios' : 'btnSaveList');
  }

  function showNameList() {
    if (freeList.items.length === 0) return;
    var input = $('#inputListName');
    input.value = freeList.editando !== null ? freeList.originalName : App.i18n.t('promptListNameDefault');
    $('#nameList').classList.remove('hidden');
    input.focus();
    input.select();
  }

  function confirmSaveList() {
    var name = $('#inputListName').value.trim().slice(0, 30) || App.i18n.t('promptListNameDefault');
    var editando = freeList.editando;
    if (editando) {
      editando.name = name;
      editando.items = freeList.items.slice();
    } else {
      progress.myLists.push({ name: name, items: freeList.items.slice() });
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    }
    save();
    freeList.items = [];
    freeList.editando = null;
    freeList.originalName = null;
    $('#nameList').classList.add('hidden');
    renderCurrentList();
    renderSavedLists();
    renderStars();
    var feedbackEl = $('#freeListFeedback');
    App.feedback.success(feedbackEl);
    feedbackEl.textContent = App.i18n.t(editando ? 'listUpdatedFeedback' : 'listSavedFeedback');
  }

  function renderSavedLists() {
    var el = $('#savedLists');
    el.innerHTML = '';
    if (progress.myLists.length === 0) return;

    var h3 = document.createElement('h3');
    h3.textContent = App.i18n.t('yourLists');
    el.appendChild(h3);

    progress.myLists.forEach(function (lista, i) {
      var editandoEsta = freeList.editando === lista;

      var wrap = document.createElement('div');
      wrap.className = 'saved-list' + (editandoEsta ? ' saved-list-editando' : '');

      var row = document.createElement('div');
      row.className = 'saved-list-row';

      var info = document.createElement('button');
      info.type = 'button';
      info.className = 'saved-list-info';
      info.setAttribute('aria-expanded', 'false');
      info.setAttribute('aria-label', App.i18n.t('ariaViewList').replace('{name}', lista.name));
      var name = document.createElement('span');
      name.className = 'name';
      name.textContent = lista.name;
      var count = document.createElement('span');
      count.className = 'count';
      count.textContent = App.i18n.t('elementosCount').replace('{n}', lista.items.length);
      info.appendChild(name);
      info.appendChild(count);

      var acciones = document.createElement('div');
      acciones.className = 'saved-list-acciones';
      var btnPractice = document.createElement('button');
      btnPractice.type = 'button';
      btnPractice.className = 'btn btn-start';
      btnPractice.textContent = App.i18n.t('btnPracticarLista');
      btnPractice.setAttribute('aria-label', App.i18n.t('btnPracticarLista') + ': ' + lista.name);
      btnPractice.addEventListener('click', function () {
        openRoutine({
          id: 'lista-' + i,
          name: lista.name,
          picto: '📝',
          steps: lista.items.map(function (text) {
            return { picto: '✅', text: text };
          })
        });
      });
      var btnEdit = document.createElement('button');
      btnEdit.type = 'button';
      btnEdit.textContent = '✏️';
      btnEdit.disabled = editandoEsta;
      btnEdit.setAttribute('aria-label', App.i18n.t('ariaEditList').replace('{name}', lista.name));
      btnEdit.addEventListener('click', function () { editList(lista); });
      var btnErase = document.createElement('button');
      btnErase.type = 'button';
      btnErase.textContent = '🗑️';
      btnErase.disabled = editandoEsta;
      btnErase.setAttribute('aria-label', App.i18n.t('ariaDeleteList').replace('{name}', lista.name));
      btnErase.addEventListener('click', function () {
        progress.myLists.splice(i, 1);
        save();
        renderSavedLists();
        var feedbackEl = $('#freeListFeedback');
        feedbackEl.className = 'feedback';
        feedbackEl.textContent = App.i18n.t('listDeletedFeedback');
      });
      acciones.appendChild(btnPractice);
      acciones.appendChild(btnEdit);
      acciones.appendChild(btnErase);

      row.appendChild(info);
      row.appendChild(acciones);
      wrap.appendChild(row);

      var itemsEl = document.createElement('ul');
      itemsEl.className = 'saved-list-items hidden';
      lista.items.forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
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

  /* Events */
  $('#btnAnotherRoutine').addEventListener('click', renderMenu);
  predefinedTab.addEventListener('click', function () { renderMenu(); });
  ownTab.addEventListener('click', function () { showTab('propias'); });
  $('#btnCheck').addEventListener('click', checkOrder);
  $('#btnHintOrder').addEventListener('click', hintOrder);
  $('#btnMoveStepUp').addEventListener('click', function () { moverSlot(-1); });
  $('#btnMoveStepDown').addEventListener('click', function () { moverSlot(1); });
  $('#btnResolveOrder').addEventListener('click', resolveOrder);

  $('#btnAddItem').addEventListener('click', addItem);
  $('#inputNewItem').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); addItem(); }
  });
  $('#btnClearList').addEventListener('click', clearCurrentList);
  $('#btnCancelEdit').addEventListener('click', cancelEdit);
  $('#btnSaveList').addEventListener('click', showNameList);
  $('#btnConfirmSaveList').addEventListener('click', confirmSaveList);
  $('#inputListName').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); confirmSaveList(); }
  });

  $('#btnBack').addEventListener('click', function (e) {
    /* If we're inside a routine, go back to the routine menu */
    if (!routineScreen.classList.contains('hidden') ||
        !orderScreen.classList.contains('hidden') ||
        !freeListScreen.classList.contains('hidden')) {
      e.preventDefault();
      renderMenu();
    }
  });

  renderMenu();
})();
