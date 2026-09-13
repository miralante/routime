/* ============================================================
   Routime — La Casa (autonomía: tareas del hogar).

   Two screens, both fully usable independently:

   1. List screen (#pantallaLista) — the new entry point.
      Two columns side-by-side:
        - "Origen"  (left):  every available task (built-in from
          DATA + user-added ones), shown as an unordered list
          with picto + nombre.
        - "Destino" (right): the user's planned order, initially
          empty. The user moves tasks across with a single "→"
          button per row (or "←" to send them back), and reorders
          inside the destination with ▲ / ▼ buttons.
      Tapping the task name (not a control) opens the step
      ordering for that task.

   2. Step-ordering screen (#pantallaJuego) — kept from the
      original house mechanic: shuffled pictogram buttons, tap
      them in the correct order, success on first try of the
      next slot, encouragement otherwise (no punishment).

   User-added tasks live only in memory (not in localStorage) per
   the user's request. Reset on next page load.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'la-casa';
  var $ = App.utils.$;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  /* ---- DOM ---- */
  var pantallaLista    = $('#pantallaLista');
  var pantallaAnadir   = $('#pantallaAnadir');
  var pantallaJuego    = $('#pantallaJuego');
  var pantallaFinal    = $('#pantallaFinal');

  var listaOrigen      = $('#listaOrigen');
  var listaDestino     = $('#listaDestino');
  var mensajeVacio     = $('#mensajeVacio');
  var feedbackLista    = $('#feedbackLista');

  var btnAnadir        = $('#btnAnadir');
  var inputNombre      = $('#anadirNombre');
  var iconosGrid       = $('#iconosGrid');
  var pasosAnadir      = $('#pasosAnadir');
  var feedbackAnadir   = $('#feedbackAnadir');
  var btnAnadirGuardar = $('#btnAnadirGuardar');
  var btnAnadirCancelar= $('#btnAnadirCancelar');

  var btnVolverLista   = $('#btnVolverLista');
  var btnRepetir       = $('#btnRepetir');
  var btnVolverMenu    = $('#btnVolverMenu');

  var tareaTituloEl    = $('#tareaTitulo');
  var tareaPictoEl     = $('#tareaPicto');
  var secuenciaEl      = $('#secuencia');
  var disponiblesEl    = $('#disponibles');
  var feedbackEl       = $('#feedback');
  var btnSiguiente     = $('#btnSiguiente');
  var progressFill     = $('#progressFill');
  var progressText     = $('#progressText');
  var starsEl          = $('#stars');

  /* ---- Persistent progress (only stars + done flag, per activity contract) ---- */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.hechos) progreso.hechos = {};
  function guardar() { App.storage.set(TOOL_ID, progreso); }

  /* ---- Available-task bank: built-in + user-added (session only) ---- */
  /* Built-in tasks come from DATA.<locale>.tareas. They are immutable here. */
  var tareasCatalogo = DATOS.tareas.slice();

  /* Tasks the user adds during this session. Stored in memory only. */
  var tareasUsuario = [];

  /* Currently ordered list (the destination column). Each item is a
     reference to one of the tasks in tareasCatalogo or tareasUsuario.
     We store references (not copies) so the same task can be shown
     in both columns without duplicating data. */
  var orden = [];

  /* Step-ordering round state */
  var tareasRonda = [];
  var idxRonda = 0;
  var aciertosRonda = 0;
  var siguienteEsperado = 0;
  var slots = [];

  /* ---- Helpers ---- */
  function pintarEstrellas() {
    starsEl.textContent = '⭐ ' + progreso.estrellas;
  }

  function tareaById(id) {
    for (var i = 0; i < tareasCatalogo.length; i++) {
      if (tareasCatalogo[i].id === id) return tareasCatalogo[i];
    }
    for (var j = 0; j < tareasUsuario.length; j++) {
      if (tareasUsuario[j].id === id) return tareasUsuario[j];
    }
    return null;
  }

  function estaEnDestino(tarea) {
    for (var i = 0; i < orden.length; i++) {
      if (orden[i].id === tarea.id) return true;
    }
    return false;
  }

  function indiceEnDestino(tarea) {
    for (var i = 0; i < orden.length; i++) {
      if (orden[i].id === tarea.id) return i;
    }
    return -1;
  }

  /* ============================================================
     LIST SCREEN — render + interactions
     ============================================================ */

  function pintarListas() {
    /* Origen: every task NOT in 'orden', grouped to keep determinism
       but unordered inside. Tapping the row body opens the steps;
       the "→" button sends it to destino. */
    var todas = tareasCatalogo.concat(tareasUsuario);
    listaOrigen.innerHTML = '';
    var disponibles = [];
    for (var i = 0; i < todas.length; i++) {
      if (!estaEnDestino(todas[i])) disponibles.push(todas[i]);
    }
    disponibles.forEach(function (t) { listaOrigen.appendChild(crearFila(t, 'origen')); });

    /* Destino: the user's planned order, top to bottom. */
    listaDestino.innerHTML = '';
    orden.forEach(function (t, idx) {
      listaDestino.appendChild(crearFilaOrdenada(t, idx));
    });

    mensajeVacio.classList.toggle('oculto', orden.length > 0);

    feedbackLista.textContent = '';
    feedbackLista.className = 'feedback';
  }

  function crearFila(t, lado) {
    var li = document.createElement('li');
    li.className = 'fila-tarea';
    li.dataset.tareaId = t.id;

    var picto = document.createElement('span');
    picto.className = 'fila-picto';
    picto.setAttribute('aria-hidden', 'true');
    picto.textContent = t.picto || '⭐';
    li.appendChild(picto);

    var nombre = document.createElement('button');
    nombre.type = 'button';
    nombre.className = 'fila-nombre';
    nombre.textContent = t.nombre;
    nombre.setAttribute('aria-label',
      App.i18n.t('ariaAbrirPasos').replace('{nombre}', t.nombre));
    nombre.addEventListener('click', function () { abrirPasos(t); });
    li.appendChild(nombre);

    if (lado === 'origen') {
      var mover = document.createElement('button');
      mover.type = 'button';
      mover.className = 'btn-fila mover-derecha';
      mover.textContent = '→';
      mover.setAttribute('aria-label',
        App.i18n.t('ariaMoverDerecha').replace('{nombre}', t.nombre));
      mover.addEventListener('click', function () { pasarAOrden(t); });
      li.appendChild(mover);
    }

    return li;
  }

  function crearFilaOrdenada(t, idx) {
    var li = document.createElement('li');
    li.className = 'fila-tarea fila-ordenada';
    li.dataset.tareaId = t.id;

    var numero = document.createElement('span');
    numero.className = 'fila-numero';
    numero.textContent = (idx + 1) + '.';
    numero.setAttribute('aria-hidden', 'true');
    li.appendChild(numero);

    var picto = document.createElement('span');
    picto.className = 'fila-picto';
    picto.setAttribute('aria-hidden', 'true');
    picto.textContent = t.picto || '⭐';
    li.appendChild(picto);

    var nombre = document.createElement('button');
    nombre.type = 'button';
    nombre.className = 'fila-nombre';
    nombre.textContent = t.nombre;
    nombre.setAttribute('aria-label',
      App.i18n.t('ariaAbrirPasos').replace('{nombre}', t.nombre));
    nombre.addEventListener('click', function () { abrirPasos(t); });
    li.appendChild(nombre);

    var controles = document.createElement('span');
    controles.className = 'fila-controles';

    var subir = document.createElement('button');
    subir.type = 'button';
    subir.className = 'btn-fila btn-subir';
    subir.textContent = '▲';
    subir.disabled = (idx === 0);
    subir.setAttribute('aria-label', App.i18n.t('ariaSubir'));
    subir.addEventListener('click', function () { reordenar(idx, idx - 1); });
    controles.appendChild(subir);

    var bajar = document.createElement('button');
    bajar.type = 'button';
    bajar.className = 'btn-fila btn-bajar';
    bajar.textContent = '▼';
    bajar.disabled = (idx === orden.length - 1);
    bajar.setAttribute('aria-label', App.i18n.t('ariaBajar'));
    bajar.addEventListener('click', function () { reordenar(idx, idx + 1); });
    controles.appendChild(bajar);

    var devolver = document.createElement('button');
    devolver.type = 'button';
    devolver.className = 'btn-fila mover-izquierda';
    devolver.textContent = '←';
    devolver.setAttribute('aria-label',
      App.i18n.t('ariaMoverIzquierda').replace('{nombre}', t.nombre));
    devolver.addEventListener('click', function () { quitarDeOrden(t); });
    controles.appendChild(devolver);

    li.appendChild(controles);

    return li;
  }

  function pasarAOrden(t) {
    if (estaEnDestino(t)) return;
    orden.push(t);
    App.feedback.success(feedbackLista);
    pintarListas();
  }

  function quitarDeOrden(t) {
    var pos = indiceEnDestino(t);
    if (pos === -1) return;
    orden.splice(pos, 1);
    pintarListas();
  }

  function reordenar(desde, hasta) {
    if (desde < 0 || desde >= orden.length) return;
    if (hasta < 0 || hasta >= orden.length) return;
    if (desde === hasta) return;
    var item = orden.splice(desde, 1)[0];
    orden.splice(hasta, 0, item);
    pintarListas();
  }

  /* ============================================================
     ADD-NEW-TASK FORM (session-only tasks)
     ============================================================ */

  var ICONOS_DISPONIBLES = DATOS.iconos || [
    '🏠', '🛏️', '🍽️', '🧽', '🧺', '🪣', '🧹', '🚿', '🚮',
    '🪴', '🌱', '🐶', '🐱', '🐦', '🐠', '📚', '🎒', '✏️',
    '🛒', '🛍️', '💡', '🔑', '🚪', '📦', '🧴', '🪑', '🪟',
    '🧊', '🔥', '☀️', '🌙', '⏰', '📝', '☎️', '💊', '🩹'
  ];

  var ICONO_POR_DEFECTO = ICONOS_DISPONIBLES[0];
  var iconoElegido = ICONO_POR_DEFECTO;

  /* Default 5 placeholder steps. The user can tap each to cycle. */
  var PASOS_PLANTILLA = DATOS.pasosPlantilla || ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

  function pintarSelectorIconos() {
    iconosGrid.innerHTML = '';
    ICONOS_DISPONIBLES.forEach(function (emo) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'icono-opcion';
      b.textContent = emo;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', emo === iconoElegido ? 'true' : 'false');
      b.setAttribute('aria-label', emo);
      if (emo === iconoElegido) b.classList.add('seleccionado');
      b.addEventListener('click', function () {
        iconoElegido = emo;
        Array.prototype.forEach.call(iconosGrid.children, function (c) {
          c.classList.toggle('seleccionado', c.textContent === emo);
          c.setAttribute('aria-checked', c.textContent === emo ? 'true' : 'false');
        });
      });
      iconosGrid.appendChild(b);
    });
  }

  function pintarPasosPlantilla() {
    pasosAnadir.innerHTML = '';
    PASOS_PLANTILLA.forEach(function (p, i) {
      var li = document.createElement('li');
      li.className = 'paso-anadir';

      var num = document.createElement('span');
      num.className = 'paso-numero';
      num.textContent = (i + 1) + '.';
      num.setAttribute('aria-hidden', 'true');
      li.appendChild(num);

      var picto = document.createElement('button');
      picto.type = 'button';
      picto.className = 'paso-picto';
      picto.textContent = p;
      picto.setAttribute('aria-label', App.i18n.t('anadirPasoToca'));
      picto.addEventListener('click', function () {
        /* Cycle to next icon from the available pool — predictable. */
        var idx = ICONOS_DISPONIBLES.indexOf(p);
        var next = ICONOS_DISPONIBLES[(idx + 1) % ICONOS_DISPONIBLES.length];
        p = next;
        picto.textContent = p;
        PASOS_PLANTILLA[i] = p;
      });
      li.appendChild(picto);

      pasosAnadir.appendChild(li);
    });
  }

  function abrirFormularioAnadir() {
    /* Reset form state every time it opens. */
    iconoElegido = ICONO_POR_DEFECTO;
    PASOS_PLANTILLA = (DATOS.pasosPlantilla || ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']).slice();
    inputNombre.value = '';
    feedbackAnadir.textContent = '';
    feedbackAnadir.className = 'feedback';
    pintarSelectorIconos();
    pintarPasosPlantilla();

    pantallaLista.classList.add('oculto');
    pantallaAnadir.classList.remove('oculto');
    /* Focus the first field for keyboard users. */
    inputNombre.focus();
  }

  function cerrarFormularioAnadir() {
    pantallaAnadir.classList.add('oculto');
    pantallaLista.classList.remove('oculto');
  }

  function guardarNuevaTarea() {
    var nombre = (inputNombre.value || '').trim();
    if (nombre.length < 2) {
      feedbackAnadir.textContent = App.i18n.t('anadirErrorNombre');
      feedbackAnadir.className = 'feedback encourage';
      inputNombre.focus();
      return;
    }
    /* Build a unique id. Session-only, so we just need uniqueness in
       this tab; a timestamp + random suffix is plenty. */
    var id = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    var nueva = {
      id: id,
      nombre: nombre,
      picto: iconoElegido,
      pasos: PASOS_PLANTILLA.slice(),
      usuario: true
    };
    tareasUsuario.push(nueva);
    cerrarFormularioAnadir();
    pintarListas();
    App.feedback.success(feedbackLista);
  }

  /* ============================================================
     STEP-ORDERING SCREEN — kept from the original house activity.
     ============================================================ */

  function abrirPasos(tarea) {
    /* Round of step-ordering: a single task is enough; that's what
       the user tapped. We rebuild the round to use this task. */
    tareasRonda = [tarea];
    idxRonda = 0;
    aciertosRonda = 0;
    pantallaLista.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    renderRonda();
  }

  function volverALista() {
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaLista.classList.remove('oculto');
    pintarListas();
  }

  function pintarProgreso() {
    progressFill.style.width = ((idxRonda / tareasRonda.length) * 100) + '%';
    progressText.textContent = '';
  }

  function renderRonda() {
    var tarea = tareasRonda[idxRonda];
    siguienteEsperado = 0;
    slots = new Array(tarea.pasos.length).fill(null);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnSiguiente.classList.add('oculto');
    tareaTituloEl.textContent = tarea.nombre;
    if (tareaPictoEl) tareaPictoEl.textContent = tarea.picto || '';

    pintarSlots();

    disponiblesEl.innerHTML = '';
    App.utils.shuffle(tarea.pasos.map(function (picto, orden) {
      return { picto: picto, orden: orden };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn paso';
      btn.textContent = p.picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaPaso'));
      btn.addEventListener('click', function () { tocar(p.orden, btn); });
      disponiblesEl.appendChild(btn);
    });

    pintarProgreso();
    pintarEstrellas();
  }

  function pintarSlots() {
    secuenciaEl.innerHTML = '';
    slots.forEach(function (picto) {
      var div = document.createElement('div');
      div.className = 'slot' + (picto ? ' lleno' : '');
      div.textContent = picto || '';
      secuenciaEl.appendChild(div);
    });
  }

  function tocar(ordenTocado, btn) {
    var tarea = tareasRonda[idxRonda];
    if (ordenTocado === siguienteEsperado) {
      slots[ordenTocado] = tarea.pasos[ordenTocado];
      pintarSlots();
      btn.disabled = true;
      btn.classList.add('colocada');
      App.feedback.success(feedbackEl);
      siguienteEsperado += 1;
      if (siguienteEsperado >= tarea.pasos.length) {
        terminarTarea();
      }
    } else {
      App.feedback.encourage(feedbackEl);
    }
  }

  function terminarTarea() {
    progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    progreso.hechos[tareasRonda[idxRonda].id] = true;
    aciertosRonda += 1;
    guardar();
    pintarEstrellas();
    btnSiguiente.classList.remove('oculto');
    btnSiguiente.focus();
  }

  function siguiente() {
    idxRonda += 1;
    if (idxRonda >= tareasRonda.length) {
      terminarRonda();
    } else {
      renderRonda();
    }
  }

  function terminarRonda() {
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
    $('#transferencia').textContent.textContent = '';
    App.feedback.celebrar(App.i18n.t('core.roundComplete'));
  }

  /* ============================================================
     Events + boot
     ============================================================ */
  btnAnadir.addEventListener('click', abrirFormularioAnadir);
  btnAnadirGuardar.addEventListener('click', guardarNuevaTarea);
  btnAnadirCancelar.addEventListener('click', cerrarFormularioAnadir);
  btnVolverLista.addEventListener('click', volverALista);
  btnRepetir.addEventListener('click', function () {
    /* "Jugar otra vez" from the end screen re-runs the same task. */
    if (tareasRonda[idxRonda - 1]) abrirPasos(tareasRonda[idxRonda - 1]);
    else volverALista();
  });
  btnVolverMenu.addEventListener('click', volverALista);
  btnSiguiente.addEventListener('click', siguiente);

  /* Allow Enter in the task-name field to submit. */
  inputNombre.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      guardarNuevaTarea();
    }
  });

  pintarEstrellas();
  pintarListas();
})();