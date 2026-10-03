/* ============================================================
   Routime — El Teatro (construcción de escenas con profundidad)
   Datos en data.js (DATA.referencias, DATA.personajes, DATA.niveles).
   Mecánica: escenario de 2 filas × 4 columnas — arriba el FONDO
   (se ve más pequeño), abajo DELANTE (más grande, más cerca).
   Cada column tiene una referencia del decorado; las órdenes van
   de una en una ("Pon el perro delante del árbol") y el sitio
   correct es la otra row de la column de la referencia nombrada.
   Primer fallo → pista que enseña qué row es delante/detrás
   (regla 12); segundo fallo → se marca el sitio (regla 11).
   Ronda de 3 escenas; 1 estrella por escena completada.
   Progresión automática: empieza con 2 personajes y aumenta según
   el progress guardado, sin mostrar selección de nivel al usuario.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'el-teatro';
  var $ = App.utils.$;
  var COLS = 4;

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var consignaEl = $('#consigna');
  var personajeEl = $('#personajeActual');
  var escenarioEl = $('#escenario');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelEl = $('#dificultad');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Round state */
  var currentLevel = null;  /* nivel selected según progress */
  var idxEscena = 0;
  var roundHits = 0;
  var slots = [];           /* 8 posiciones (row*COLS+col): {picto, name} | null */
  var ordenes = [];         /* [{ personaje, ref, refCol, rel }] */
  var idxOrden = 0;
  var attempts = 0;
  var enEscena = false;

  function save() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* Determina el nivel según el progress: cada 3 rondas completadas,
     sube un nivel (0=nivel1 con 2, 1=nivel2 con 3, 2=nivel3 con 4) */
  function levelBasedOnProgress() {
    var idx = Math.min(progress.roundsCompleted, banco().niveles.length - 1);
    return banco().niveles[idx];
  }

  /* Muestra la dificultad current (número de personajes) */
  function renderLevel() {
    if (levelEl) {
      levelEl.textContent = currentLevel.ordenes + ' ' +
        (currentLevel.ordenes === 1 ? App.i18n.t('personaje') : App.i18n.t('personajes'));
    }
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    idxEscena = 0;
    roundHits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    nuevaEscena();
  }

  function renderProgress() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idxEscena / porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  /* ---- Montar la escena: 1 referencia por column, row al azar;
     las órdenes usan columnas distintas ---- */
  function nuevaEscena() {
    var refs = App.utils.shuffle(banco().referencias).slice(0, COLS);
    var personajes = App.utils.shuffle(banco().personajes).slice(0, currentLevel.ordenes);
    var columnasOrden = App.utils.shuffle([0, 1, 2, 3]).slice(0, currentLevel.ordenes);

    slots = new Array(2 * COLS).fill(null);
    ordenes = [];
    refs.forEach(function (ref, col) {
      var row = Math.random() < 0.5 ? 0 : 1;
      slots[row * COLS + col] = { picto: ref.picto, name: ref.el, ref: ref, row: row };
    });
    columnasOrden.forEach(function (col, i) {
      var refSlot = slots[col] ? slots[col] : slots[COLS + col];
      /* If the reference is in the back (row 0), the character goes
         in front; if it's in front (row 1), it goes behind. */
      var rel = refSlot.row === 0 ? 'delante' : 'detras';
      ordenes.push({ personaje: personajes[i], ref: refSlot.ref, refCol: col, rel: rel });
    });

    idxOrden = 0;
    attempts = 0;
    enEscena = true;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');
    pintarEscenario();
    pintarOrden();
    renderProgress();
    renderStars();
  }

  function slotObjetivo() {
    var o = ordenes[idxOrden];
    var filaObjetivo = o.rel === 'delante' ? 1 : 0;
    return filaObjetivo * COLS + o.refCol;
  }

  function ariaSlot(i) {
    var row = Math.floor(i / COLS);
    var col = (i % COLS) + 1;
    if (slots[i]) {
      return App.i18n.t('ariaOcupado').replace('{name}', slots[i].name).replace('{c}', col);
    }
    return App.i18n.t(row === 0 ? 'ariaSitioFondo' : 'ariaSitioDelante').replace('{c}', col);
  }

  function pintarEscenario(marcarObjetivo) {
    escenarioEl.innerHTML = '';
    for (var row = 0; row < 2; row++) {
      var banda = document.createElement('div');
      banda.className = row === 0 ? 'banda fondo' : 'banda delante';
      for (var col = 0; col < COLS; col++) {
        var i = row * COLS + col;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sitio' + (slots[i] ? ' ocupado' : '');
        btn.textContent = slots[i] ? slots[i].picto : '';
        btn.disabled = !enEscena || slots[i] !== null;
        btn.setAttribute('aria-label', ariaSlot(i));
        if (marcarObjetivo && i === slotObjetivo()) btn.classList.add('sugerida');
        (function (idx, b) {
          b.addEventListener('click', function () { tocarSitio(idx); });
        })(i, btn);
        banda.appendChild(btn);
      }
      escenarioEl.appendChild(banda);
    }
  }

  function textoConsigna() {
    var o = ordenes[idxOrden];
    return App.i18n.t('consigna')
      .replace('{pers}', o.personaje.el)
      .replace('{rel}', App.i18n.t('rel_' + o.rel))
      .replace('{ref}', o.ref.del);
  }

  function pintarOrden() {
    attempts = 0;
    var o = ordenes[idxOrden];
    personajeEl.textContent = o.personaje.picto;
    consignaEl.textContent = textoConsigna();
  }

  function tocarSitio(i) {
    if (!enEscena || slots[i] !== null) return;
    var o = ordenes[idxOrden];
    if (i === slotObjetivo()) {
      slots[i] = { picto: o.personaje.picto, name: o.personaje.el };
      App.feedback.success(feedbackEl);
      explicacionEl.textContent = App.i18n.t('okSitio')
        .replace('{pers}', cap(o.personaje.el))
        .replace('{rel}', App.i18n.t('rel_' + o.rel))
        .replace('{ref}', o.ref.del);
      explicacionWrap.classList.remove('hidden');
      idxOrden += 1;
      if (idxOrden >= ordenes.length) {
        completarEscena();
      } else {
        pintarEscenario();
        pintarOrden();
      }
    } else {
      attempts += 1;
      App.feedback.encourage(feedbackEl);
      if (attempts === 1) {
        /* Rule 12: first failure → shows which row is front/back */
        explicacionEl.textContent = App.i18n
          .t(o.rel === 'delante' ? 'pistaDelante' : 'pistaDetras')
          .replace('{ref}', o.ref.el);
        pintarEscenario();
      } else {
        /* Segundo fallo → se marca el sitio correct */
        explicacionEl.textContent = App.i18n.t('malSitio')
          .replace('{rel}', App.i18n.t('rel_' + o.rel))
          .replace('{ref}', o.ref.del);
        pintarEscenario(true);
      }
      explicacionWrap.classList.remove('hidden');
    }
  }

  function completarEscena() {
    enEscena = false;
    idxEscena += 1;
    roundHits += 1;
    progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    save();
    renderStars();
    renderProgress();
    pintarEscenario();
    personajeEl.textContent = '';
    consignaEl.textContent = App.i18n.t('escenaCompletada');
    App.feedback.celebrate(App.i18n.t('escenaCompletada'));
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function next() {
    if (idxEscena >= banco().porRonda) {
      endRound();
    } else {
      nuevaEscena();
    }
  }

  function endRound() {
    progress.roundsCompleted += 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#resumenFinal').textContent += '\n' + App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompleted + 1, banco().niveles.length));
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnNext.addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../site/index.html';
  });
  $('#btnConsigna').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(consignaEl.textContent);
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();

