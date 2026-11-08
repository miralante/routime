/* ============================================================
   Routime — Diferencias (memoria y atención / percepción)
   Datos en data.js (DATA.escenas). Módulos compartidos en assets/js/.
   Mecánica: dos rejillas iguales salvo unas pocas celdas.
   Tocar en la rejilla derecha lo que es distinto. Sin límite de
   tiempo ni de attempts. Tras 3 toques fallidos, help visual.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'diferencias';
  var CELDAS = 16;
  var FALLOS_PARA_AYUDA = 3;
  var $ = App.utils.$;

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var sceneTitleEl = $('#escenaTitulo');
  var gridLeftEl = $('#rejillaIzquierda');
  var gridRightEl = $('#rejillaDerecha');
  var counterEl = $('#contador');
  var feedbackEl = $('#feedback');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.getWithStars(TOOL_ID);
  if (typeof progress.rounds !== 'number') progress.rounds = 0;

  /* Round state */
  var escenas = [];
  var sceneIdx = 0;
  var perRound = 3;
  var differencesMap = {};   /* celda -> pictoDerecha */
  var encontradas = {};       /* celda -> true */
  var totalDifferences = 0;
  var fallosSeguidos = 0;
  var ayudaTimeout = null;
  var roundHits = 0;

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; }
  });
  var save = glue.save, renderStars = glue.paintStars;


  function startRound() {
    var bank = DATA[App.i18n.locale()] || DATA.es;
    escenas = App.utils.shuffle(bank.escenas).slice(0, bank.porRonda);
    perRound = bank.porRonda;
    sceneIdx = 0;
    roundHits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    paintScene();
  }

  function paintProgressGlobal() {
    progressFill.style.width = ((sceneIdx / perRound) * 100) + '%';
    progressText.textContent = '';
  }

  function createGrid(container) {
    container.innerHTML = '';
    var celdas = [];
    for (var i = 0; i < CELDAS; i++) {
      var div = document.createElement('div');
      div.className = 'celda';
      container.appendChild(div);
      celdas.push(div);
    }
    return celdas;
  }

  function paintScene() {
    if (ayudaTimeout) { clearTimeout(ayudaTimeout); ayudaTimeout = null; }
    var scene = escenas[sceneIdx];
    sceneTitleEl.textContent = App.i18n.t(scene.nombreKey);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnNext.classList.add('hidden');
    fallosSeguidos = 0;
    encontradas = {};
    differencesMap = {};
    scene.diferencias.forEach(function (d) { differencesMap[d.celda] = d.pictoDerecha; });
    totalDifferences = scene.diferencias.length;

    var cellsLeft = createGrid(gridLeftEl);
    var cellsRight = createGrid(gridRightEl);

    scene.objetos.forEach(function (obj) {
      cellsLeft[obj.celda].textContent = obj.picto;
      cellsLeft[obj.celda].setAttribute('aria-hidden', 'true');

      var picto = differencesMap.hasOwnProperty(obj.celda) ? differencesMap[obj.celda] : obj.picto;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'objeto-btn';
      btn.textContent = picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaDibujo'));
      btn.dataset.celda = obj.celda;
      btn.addEventListener('click', function () { tap(obj.celda, btn); });
      cellsRight[obj.celda].appendChild(btn);
    });

    paintProgressGlobal();
    paintCounterDifferences();
    renderStars();
  }

  function paintCounterDifferences() {
    var n = Object.keys(encontradas).length;
    counterEl.textContent = '';
  }

  function tap(cell, btn) {
    if (encontradas[cell]) return;

    if (differencesMap.hasOwnProperty(cell)) {
      encontradas[cell] = true;
      btn.classList.add('encontrada');
      btn.disabled = true;
      fallosSeguidos = 0;
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      save();
      renderStars();
      paintCounterDifferences();
      if (Object.keys(encontradas).length >= totalDifferences) {
        finishScene();
      }
    } else {
      fallosSeguidos += 1;
      App.feedback.encourage(feedbackEl);
      if (fallosSeguidos >= FALLOS_PARA_AYUDA) {
        showHelp();
        fallosSeguidos = 0;
      }
    }
  }

  /* Ayuda sin castigo: parpadeo suave en una diferencia sin encontrar */
  function showHelp() {
    var pendientes = Object.keys(differencesMap).filter(function (cell) {
      return !encontradas[cell];
    });
    if (!pendientes.length) return;
    var cell = pendientes[Math.floor(Math.random() * pendientes.length)];
    var btn = gridRightEl.querySelector('[data-celda="' + cell + '"]');
    if (!btn) return;
    btn.classList.add('help');
    if (ayudaTimeout) clearTimeout(ayudaTimeout);
    ayudaTimeout = setTimeout(function () { btn.classList.remove('help'); }, 2500);
  }

  function finishScene() {
    btnNext.classList.remove('hidden');
    if (sceneIdx >= perRound - 1) {
      btnNext.textContent = App.i18n.t('verResultado');
    } else {
      btnNext.textContent = App.i18n.t('siguienteEscena');
    }
    btnNext.focus();
  }

  function nextScene() {
    sceneIdx += 1;
    if (sceneIdx >= perRound) {
      endRound();
    } else {
      paintScene();
    }
  }

  function endRound() {
    progress.rounds += 1;
    save();
    App.utils.showEnd(gameScreen, endScreen);
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal', { n: roundHits, total: progress.stars });
    App.i18n.applyTo('#transferencia');
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  btnNext.addEventListener('click', nextScene);
  $('#btnRepeat').addEventListener('click', startRound);

  renderStars();
  // Iniciar directamente la actividad
  startRound();
})();

