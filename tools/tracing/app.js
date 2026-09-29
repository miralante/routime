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

  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var selectionScreen = $('#selectionScreen');
  var formaTituloEl = $('#formaTitulo');
  var lienzo = $('#lienzo');
  var guiaPath = $('#guia');
  var trazoPath = $('#trazoUsuario');
  var feedbackEl = $('#feedback');
  var btnErase = $('#btnErase');
  var btnCheck = $('#btnCheck');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var rejillaMayus = $('#rejillaMayus');
  var rejillaMinus = $('#rejillaMinus');
  var seleccionResumen = $('#seleccionResumen');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Round state */
  var currentLevel = null;
  var modo = 'guiado';      /* 'guiado' (niveles 1-5) o 'libre' (abecedario) */
  var formas = [];
  var idx = 0;
  var roundHits = 0;
  var totalRonda = 0;       /* dinámico: porRonda o porRondaLibre */
  var solved = false;
  var trazos = [];       /* array de trazos; cada uno, array de [x,y] */
  var dibujando = false;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  /* Letras elegidas en modo libre. Cada entrada es { id, ref }. */
  var letrasSeleccionadas = [];

  /* Resuelve la geometría (puntos) de una forma: admite tanto
     el nuevo formato { ref } como el antiguo { puntos } directo,
     para que scripts anteriores o ampliaciones no rompan. */
  function puntosDeForma(forma) {
    if (Array.isArray(forma.puntos)) return forma.puntos;
    if (forma.ref && FORMAS_COMUNES && FORMAS_COMUNES[forma.ref]) {
      return FORMAS_COMUNES[forma.ref].puntos;
    }
    return [];
  }

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  /* ---- Modo libre: selección de letters ---- */

  /* Pinta las dos rejillas (mayúsculas y minúsculas). Cada letra
     es un botón con status presionado/no-presionado. La etiqueta
     accesible anuncia el name de la letra y si está elegida. */
  function pintarRejillaLetras() {
    rejillaMayus.innerHTML = '';
    rejillaMinus.innerHTML = '';
    pintarGrupoLetras(rejillaMayus, DATOS.alfabeto.mayusculas, 'Mayúscula');
    pintarGrupoLetras(rejillaMinus, DATOS.alfabeto.minusculas, 'Minúscula');
    /* Restaura selección visual al volver a abrir la pantalla. */
    marcarSeleccionActual();
  }

  function pintarGrupoLetras(contenedor, grupo, etiquetaGrupo) {
    grupo.forEach(function (letra) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-letra';
      btn.textContent = letra.id;
      btn.dataset.id = letra.id;
      btn.dataset.ref = letra.ref;
      btn.dataset.grupo = etiquetaGrupo;
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label',
        etiquetaGrupo + ' ' + letra.id +
        '. ' + (App.i18n.t('ariaNoSeleccionada') || ''));
      btn.addEventListener('click', function () { toggleLetra(letra, btn); });
      contenedor.appendChild(btn);
    });
  }

  function toggleLetra(letra, btn) {
    var i = letrasSeleccionadas.findIndex(function (l) {
      return l.id === letra.id && l.ref === letra.ref;
    });
    if (i === -1) {
      letrasSeleccionadas.push(letra);
      btn.classList.add('seleccionada');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      letrasSeleccionadas.splice(i, 1);
      btn.classList.remove('seleccionada');
      btn.setAttribute('aria-pressed', 'false');
    }
    pintarResumenSeleccion();
  }

  function seleccionarGrupo(grupo, valor) {
    var cont = grupo === 'mayusculas' ? rejillaMayus : rejillaMinus;
    var items = grupo === 'mayusculas'
      ? DATOS.alfabeto.mayusculas
      : DATOS.alfabeto.minusculas;
    items.forEach(function (letra) {
      var idx2 = letrasSeleccionadas.findIndex(function (l) {
        return l.id === letra.id && l.ref === letra.ref;
      });
      if (valor && idx2 === -1) letrasSeleccionadas.push(letra);
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

  function marcarSeleccionActual() {
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

  function pintarResumenSeleccion() {
    var n = letrasSeleccionadas.length;
    var plantilla = App.i18n.t('seleccionResumen') || '{n} letters';
    seleccionResumen.textContent = plantilla.replace('{n}', n);
  }

  /* Determina el nivel según el progreso y prepara una ronda guiada. */
  function levelBasedOnProgress() {
    var idxN = Math.min(progress.roundsCompleted, DATOS.niveles.length - 1);
    return DATOS.niveles[idxN];
  }

  function renderLevel() {
    var levelEl = $('#level');
    if (levelEl && currentLevel) levelEl.textContent = currentLevel.nombre;
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    modo = 'guiado';
    formas = App.utils.shuffle(currentLevel.formas).slice(0, DATOS.porRonda);
    totalRonda = formas.length;
    idx = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    selectionScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    render();
  }

  function iniciarPracticaLibre(seleccion) {
    if (!seleccion || !seleccion.length) return;
    currentLevel = null;
    modo = 'libre';
    /* Construimos formas a partir de las letters elegidas. Como
       pueden repetirse entre ronda y ronda, las barajamos y nos
       quedamos con porRondaLibre (o menos si hay pocas letters). */
    var tam = Math.min(DATOS.porRondaLibre, seleccion.length);
    formas = App.utils.shuffle(seleccion).slice(0, tam).map(function (it) {
      return { name: it.id, ref: it.ref };
    });
    totalRonda = formas.length;
    idx = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    selectionScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    render();
  }

  function renderProgress() {
    progressFill.style.width = ((idx / totalRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function cadenaDesdePuntos(puntos) {
    return 'M ' + puntos.map(function (p) { return p[0] + ',' + p[1]; }).join(' L ');
  }

  function render() {
    var forma = formas[idx];
    solved = false;
    trazos = [];
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnNext.classList.add('hidden');
    formaTituloEl.textContent = forma.name;
    guiaPath.setAttribute('d', cadenaDesdePuntos(puntosDeForma(forma)));
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

  function iniciarTrazo(evt) {
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

  function terminarTrazo() {
    dibujando = false;
  }

  /* ---- Coverage check ---- */
  function puntosFinos(puntos, steps) {
    var finos = [];
    for (var i = 0; i < puntos.length - 1; i++) {
      var a = puntos[i], b = puntos[i + 1];
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

  function comprobar() {
    if (solved) return;
    var forma = formas[idx];
    var objetivo = puntosFinos(puntosDeForma(forma), 6);
    var dibujados = trazos.reduce(function (acc, t) { return acc.concat(t); }, []);

    if (!dibujados.length) {
      App.feedback.encourage(feedbackEl);
      return;
    }

    var cubiertos = objetivo.filter(function (obj) {
      return dibujados.some(function (d) { return distancia(obj, d) <= DATOS.tolerancia; });
    }).length;
    var porcentaje = cubiertos / objetivo.length;

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

  function borrar() {
    if (solved) return;
    trazos = [];
    trazoPath.setAttribute('d', '');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
  }

  function next() {
    idx += 1;
    if (idx >= totalRonda) {
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
    var plantilla = App.i18n.t('resumenFinal');
    $('#resumenFinal').textContent = '';
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('finalTitulo'));
  }

  /* Events */
  lienzo.addEventListener('pointerdown', iniciarTrazo);
  lienzo.addEventListener('pointermove', continuarTrazo);
  lienzo.addEventListener('pointerup', terminarTrazo);
  lienzo.addEventListener('pointercancel', terminarTrazo);
  btnErase.addEventListener('click', borrar);
  btnCheck.addEventListener('click', comprobar);
  if (btnNext) btnNext.addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', function () {
    if (modo === 'libre') {
      iniciarPracticaLibre(letrasSeleccionadas);
    } else if (currentLevel) {
      startGame();
    }
  });
  if ($('#btnPlay')) $('#btnPlay').addEventListener('click', startGame);
  if ($('#btnOtherLevel')) $('#btnOtherLevel').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    renderLevels();
    startScreen.classList.remove('hidden');
  });
  $('#btnModoLibre').addEventListener('click', function () {
    startScreen.classList.add('hidden');
    pintarRejillaLetras();
    pintarResumenSeleccion();
    selectionScreen.classList.remove('hidden');
  });
  if ($('#btnVolverInicio')) $('#btnVolverInicio').addEventListener('click', function () {
    selectionScreen.classList.add('hidden');
    renderLevels();
    startScreen.classList.remove('hidden');
  });
  $('#btnSeleccionarMayus').addEventListener('click', function () {
    seleccionarGrupo('mayusculas', true);
    pintarResumenSeleccion();
  });
  $('#btnSeleccionarMinus').addEventListener('click', function () {
    seleccionarGrupo('minusculas', true);
    pintarResumenSeleccion();
  });
  $('#btnSeleccionarTodo').addEventListener('click', function () {
    seleccionarGrupo('mayusculas', true);
    seleccionarGrupo('minusculas', true);
    pintarResumenSeleccion();
  });
  $('#btnSeleccionarNada').addEventListener('click', function () {
    seleccionarGrupo('mayusculas', false);
    seleccionarGrupo('minusculas', false);
    pintarResumenSeleccion();
  });
  $('#btnIniciarPractica').addEventListener('click', function () {
    var seleccion = letrasSeleccionadas.filter(function (l) {
      return FORMAS_COMUNES && FORMAS_COMUNES[l.ref];
    });
    if (!seleccion.length) {
      App.feedback.encourage(feedbackEl);
      return;
    }
    iniciarPracticaLibre(seleccion);
  });

  renderStars();
})();
