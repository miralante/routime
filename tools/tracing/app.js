/* ============================================================
   Routime — Trazos (motricidad fina)
   Datos en data.js (DATA.niveles + FORMAS_COMUNES). Módulos
   compartidos en assets/js/. Mecánica: repasar con el dedo o el
   ratón una guía de puntos. Se comprueba cuánta guía se ha
   cubierto (sin exigir perfección). Sin límite de attempts:
   "Borrar" permite volver a start.

   Cada forma se compone por referencia ('ref') al catálogo
   FORMAS_COMUNES. Esto evita duplicar geometría entre ES y EN y
   mantiene una sola fuente de verdad para cada letra.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'trazos';
  var $ = App.utils.$;

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var selectionScreen = $('#selectionScreen');
  var shapeTitleEl = $('#formaTitulo');
  var lienzo = $('#canvas');
  var guiaPath = $('#guia');
  var trazoPath = $('#trazoUsuario');
  var feedbackEl = $('#feedback');
  var btnErase = $('#btnErase');
  var btnCheck = $('#btnComprobar');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var rejillaMayus = $('#rejillaMayus');
  var rejillaMinus = $('#rejillaMinus');
  var selectionSummary = $('#seleccionResumen');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Round state */
  var currentLevel = null;
  var mode = 'guiado';      /* 'guiado' (niveles 1-5) o 'libre' (abecedario) */
  var shapes = [];
  var idx = 0;
  var roundHits = 0;
  var totalRound = 0;       /* dinámico: porRonda o porRondaLibre */
  var solved = false;
  var trazos = [];       /* array de trazos; cada uno, array de [x,y] */
  var dibujando = false;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  /* Letras elegidas en modo libre. Cada entrada es { id, ref }. */
  var letrasSeleccionadas = [];

  /* Resuelve la geometría (puntos) de una forma: admite tanto
     el nuevo formato { ref } como el antiguo { puntos } directo,
     para que scripts anteriores o ampliaciones no rompan. */
  function pointsOfShape(shape) {
    if (Array.isArray(shape.puntos)) return shape.puntos;
    if (shape.ref && FORMAS_COMUNES && FORMAS_COMUNES[shape.ref]) {
      return FORMAS_COMUNES[shape.ref].puntos;
    }
    return [];
  }

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; },
    levels: function () { return DATOS.niveles; }
  });
  var save = glue.save, renderStars = glue.paintStars, levelBasedOnProgress = glue.levelFromProgress;


  /* ---- Modo libre: selección de letters ---- */

  /* Pinta las dos rejillas (mayúsculas y minúsculas). Cada letra
     es un botón con status presionado/no-presionado. La etiqueta
     accesible anuncia el name de la letra y si está elegida. */
  function paintGridLetters() {
    rejillaMayus.innerHTML = '';
    rejillaMinus.innerHTML = '';
    paintGroupLetters(rejillaMayus, DATOS.alfabeto.mayusculas, 'Mayúscula');
    paintGroupLetters(rejillaMinus, DATOS.alfabeto.minusculas, 'Minúscula');
    /* Restaura selección visual al volver a abrir la pantalla. */
    markSelectionCurrent();
  }

  function paintGroupLetters(container, group, etiquetaGrupo) {
    group.forEach(function (letter) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-letra';
      btn.textContent = letter.id;
      btn.dataset.id = letter.id;
      btn.dataset.ref = letter.ref;
      btn.dataset.grupo = etiquetaGrupo;
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label',
        etiquetaGrupo + ' ' + letter.id +
        '. ' + (App.i18n.t('ariaNoSeleccionada') || ''));
      btn.addEventListener('click', function () { toggleLetter(letter, btn); });
      container.appendChild(btn);
    });
  }

  function toggleLetter(letter, btn) {
    var i = letrasSeleccionadas.findIndex(function (l) {
      return l.id === letter.id && l.ref === letter.ref;
    });
    if (i === -1) {
      letrasSeleccionadas.push(letter);
      btn.classList.add('seleccionada');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      letrasSeleccionadas.splice(i, 1);
      btn.classList.remove('seleccionada');
      btn.setAttribute('aria-pressed', 'false');
    }
    paintSummarySelection();
  }

  function selectGroup(group, valor) {
    var cont = group === 'mayusculas' ? rejillaMayus : rejillaMinus;
    var items = group === 'mayusculas'
      ? DATOS.alfabeto.mayusculas
      : DATOS.alfabeto.minusculas;
    items.forEach(function (letter) {
      var idx2 = letrasSeleccionadas.findIndex(function (l) {
        return l.id === letter.id && l.ref === letter.ref;
      });
      if (valor && idx2 === -1) letrasSeleccionadas.push(letter);
      if (!valor && idx2 !== -1) letrasSeleccionadas.splice(idx2, 1);
    });
    /* Refresca marcas visuales */
    Array.prototype.forEach.call(cont.children, function (btn) {
      var on = letrasSeleccionadas.some(function (l) {
        return l.id === btn.dataset.id && l.ref === btn.dataset.ref;
      });
      btn.classList.toggle('seleccionada', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function markSelectionCurrent() {
    [['mayusculas', rejillaMayus], ['minusculas', rejillaMinus]].forEach(
      function (par) {
        Array.prototype.forEach.call(par[1].children, function (btn) {
          var on = letrasSeleccionadas.some(function (l) {
            return l.id === btn.dataset.id && l.ref === btn.dataset.ref;
          });
          btn.classList.toggle('seleccionada', on);
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      }
    );
  }

  function paintSummarySelection() {
    var n = letrasSeleccionadas.length;
    var template = App.i18n.t('seleccionResumen') || '{n} letters';
    selectionSummary.textContent = template.replace('{n}', n);
  }

  /* Determina el nivel según el progreso y prepara una ronda guiada. */

  function renderLevel() {
    var levelEl = $('#level');
    if (levelEl && currentLevel) levelEl.textContent = currentLevel.nombre;
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    mode = 'guiado';
    shapes = App.utils.shuffle(currentLevel.formas).slice(0, DATOS.porRonda);
    totalRound = shapes.length;
    idx = 0;
    roundHits = 0;
    selectionScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    render();
  }

  function startPracticeFree(selection) {
    if (!selection || !selection.length) return;
    currentLevel = null;
    mode = 'libre';
    /* Construimos formas a partir de las letters elegidas. Como
       pueden repetirse entre ronda y ronda, las barajamos y nos
       quedamos con porRondaLibre (o menos si hay pocas letters). */
    var tam = Math.min(DATOS.porRondaLibre, selection.length);
    shapes = App.utils.shuffle(selection).slice(0, tam).map(function (it) {
      return { name: it.id, ref: it.ref };
    });
    totalRound = shapes.length;
    idx = 0;
    roundHits = 0;
    selectionScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    render();
  }

  function renderProgress() {
    progressFill.style.width = ((idx / totalRound) * 100) + '%';
    progressText.textContent = '';
  }

  function cadenaDesdePuntos(points) {
    return 'M ' + points.map(function (p) { return p[0] + ',' + p[1]; }).join(' L ');
  }

  function render() {
    var shape = shapes[idx];
    solved = false;
    trazos = [];
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnNext.classList.add('hidden');
    shapeTitleEl.textContent = shape.name;
    guiaPath.setAttribute('d', cadenaDesdePuntos(pointsOfShape(shape)));
    trazoPath.setAttribute('d', '');

    renderProgress();
    renderStars();
  }

  /* ---- Drawing with pointer (mouse, finger, or pen) ---- */
  function coordenadas(evt) {
    var rect = lienzo.getBoundingClientRect();
    var x = ((evt.clientX - rect.left) / rect.width) * 100;
    var y = ((evt.clientY - rect.top) / rect.height) * 100;
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  }

  function pintarTrazoUsuario() {
    var d = trazos
      .filter(function (t) { return t.length > 0; })
      .map(cadenaDesdePuntos)
      .join(' ');
    trazoPath.setAttribute('d', d);
  }

  function startStroke(evt) {
    if (solved) return;
    evt.preventDefault();
    dibujando = true;
    try { lienzo.setPointerCapture(evt.pointerId); } catch (e) { /* ignorar */ }
    trazos.push([coordenadas(evt)]);
  }

  function continuarTrazo(evt) {
    if (!dibujando || solved) return;
    evt.preventDefault();
    trazos[trazos.length - 1].push(coordenadas(evt));
    pintarTrazoUsuario();
  }

  function finishStroke() {
    dibujando = false;
  }

  /* ---- Coverage check ---- */
  function puntosFinos(points, steps) {
    var finos = [];
    for (var i = 0; i < points.length - 1; i++) {
      var a = points[i], b = points[i + 1];
      for (var j = 0; j <= steps; j++) {
        finos.push([
          a[0] + ((b[0] - a[0]) * j) / steps,
          a[1] + ((b[1] - a[1]) * j) / steps
        ]);
      }
    }
    return finos;
  }

  function distancia(p1, p2) {
    return Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
  }

  function check() {
    if (solved) return;
    var shape = shapes[idx];
    var goal = puntosFinos(pointsOfShape(shape), 6);
    var dibujados = trazos.reduce(function (acc, t) { return acc.concat(t); }, []);

    if (!dibujados.length) {
      App.feedback.encourage(feedbackEl);
      return;
    }

    var cubiertos = goal.filter(function (obj) {
      return dibujados.some(function (d) { return distancia(obj, d) <= DATOS.tolerancia; });
    }).length;
    var porcentaje = cubiertos / goal.length;

    if (porcentaje >= 0.75) {
      solved = true;
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      save();
      renderStars();
      btnNext.classList.remove('hidden');
      btnNext.focus();
    } else {
      App.feedback.encourage(feedbackEl);
    }
  }

  function erase() {
    if (solved) return;
    trazos = [];
    trazoPath.setAttribute('d', '');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
  }

  function next() {
    idx += 1;
    if (idx >= totalRound) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    if (currentLevel && currentLevel.id) {
      progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    }
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    var template = App.i18n.t('resumenFinal');
    $('#endSummary').textContent = '';
    if ($('#transferencia')) $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('finalTitulo'));
  }

  /* Events */
  lienzo.addEventListener('pointerdown', startStroke);
  lienzo.addEventListener('pointermove', continuarTrazo);
  lienzo.addEventListener('pointerup', finishStroke);
  lienzo.addEventListener('pointercancel', finishStroke);
  btnErase.addEventListener('click', erase);
  btnCheck.addEventListener('click', check);
  if (btnNext) btnNext.addEventListener('click', next);
  $('#repeatBtn').addEventListener('click', function () {
    if (mode === 'libre') {
      startPracticeFree(letrasSeleccionadas);
    } else if (currentLevel) {
      startGame();
    }
  });
  if ($('#btnOtherLevel')) $('#btnOtherLevel').addEventListener('click', function () {
    window.location.href = '../../';
  });
  $('#btnModoLibre').addEventListener('click', function () {
    paintGridLetters();
    paintSummarySelection();
    selectionScreen.classList.remove('hidden');
  });
  if ($('#btnVolverInicio')) $('#btnVolverInicio').addEventListener('click', function () {
    window.location.href = '../../';
  });
  $('#btnSeleccionarMayus').addEventListener('click', function () {
    selectGroup('mayusculas', true);
    paintSummarySelection();
  });
  $('#btnSeleccionarMinus').addEventListener('click', function () {
    selectGroup('minusculas', true);
    paintSummarySelection();
  });
  $('#btnSeleccionarTodo').addEventListener('click', function () {
    selectGroup('mayusculas', true);
    selectGroup('minusculas', true);
    paintSummarySelection();
  });
  $('#btnSeleccionarNada').addEventListener('click', function () {
    selectGroup('mayusculas', false);
    selectGroup('minusculas', false);
    paintSummarySelection();
  });
  $('#btnIniciarPractica').addEventListener('click', function () {
    var selection = letrasSeleccionadas.filter(function (l) {
      return FORMAS_COMUNES && FORMAS_COMUNES[l.ref];
    });
    if (!selection.length) {
      App.feedback.encourage(feedbackEl);
      return;
    }
    startPracticeFree(selection);
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
  if ($('#btnMenu')) $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../';
  });
})();
