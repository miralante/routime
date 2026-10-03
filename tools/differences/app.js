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
  var escenaTituloEl = $('#escenaTitulo');
  var rejillaIzqEl = $('#rejillaIzquierda');
  var rejillaDerEl = $('#rejillaDerecha');
  var counterEl = $('#contador');
  var feedbackEl = $('#feedback');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.rounds !== 'number') progress.rounds = 0;

  /* Round state */
  var escenas = [];
  var escenaIdx = 0;
  var porRonda = 3;
  var diferenciasMapa = {};   /* celda -> pictoDerecha */
  var encontradas = {};       /* celda -> true */
  var totalDiferencias = 0;
  var fallosSeguidos = 0;
  var ayudaTimeout = null;
  var roundHits = 0;

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function startRound() {
    var banco = DATA[App.i18n.locale()] || DATA.es;
    escenas = App.utils.shuffle(banco.escenas).slice(0, banco.porRonda);
    porRonda = banco.porRonda;
    escenaIdx = 0;
    roundHits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    pintarEscena();
  }

  function pintarProgresoGlobal() {
    progressFill.style.width = ((escenaIdx / porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function crearRejilla(contenedor) {
    contenedor.innerHTML = '';
    var celdas = [];
    for (var i = 0; i < CELDAS; i++) {
      var div = document.createElement('div');
      div.className = 'celda';
      contenedor.appendChild(div);
      celdas.push(div);
    }
    return celdas;
  }

  function pintarEscena() {
    if (ayudaTimeout) { clearTimeout(ayudaTimeout); ayudaTimeout = null; }
    var escena = escenas[escenaIdx];
    escenaTituloEl.textContent = App.i18n.t(escena.nombreKey);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnNext.classList.add('hidden');
    fallosSeguidos = 0;
    encontradas = {};
    diferenciasMapa = {};
    escena.diferencias.forEach(function (d) { diferenciasMapa[d.celda] = d.pictoDerecha; });
    totalDiferencias = escena.diferencias.length;

    var celdasIzq = crearRejilla(rejillaIzqEl);
    var celdasDer = crearRejilla(rejillaDerEl);

    escena.objetos.forEach(function (obj) {
      celdasIzq[obj.celda].textContent = obj.picto;
      celdasIzq[obj.celda].setAttribute('aria-hidden', 'true');

      var picto = diferenciasMapa.hasOwnProperty(obj.celda) ? diferenciasMapa[obj.celda] : obj.picto;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'objeto-btn';
      btn.textContent = picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaDibujo'));
      btn.dataset.celda = obj.celda;
      btn.addEventListener('click', function () { tocar(obj.celda, btn); });
      celdasDer[obj.celda].appendChild(btn);
    });

    pintarProgresoGlobal();
    pintarContadorDiferencias();
    renderStars();
  }

  function pintarContadorDiferencias() {
    var n = Object.keys(encontradas).length;
    counterEl.textContent = '';
  }

  function tocar(celda, btn) {
    if (encontradas[celda]) return;

    if (diferenciasMapa.hasOwnProperty(celda)) {
      encontradas[celda] = true;
      btn.classList.add('encontrada');
      btn.disabled = true;
      fallosSeguidos = 0;
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      save();
      renderStars();
      pintarContadorDiferencias();
      if (Object.keys(encontradas).length >= totalDiferencias) {
        terminarEscena();
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
    var pendientes = Object.keys(diferenciasMapa).filter(function (celda) {
      return !encontradas[celda];
    });
    if (!pendientes.length) return;
    var celda = pendientes[Math.floor(Math.random() * pendientes.length)];
    var btn = rejillaDerEl.querySelector('[data-celda="' + celda + '"]');
    if (!btn) return;
    btn.classList.add('help');
    if (ayudaTimeout) clearTimeout(ayudaTimeout);
    ayudaTimeout = setTimeout(function () { btn.classList.remove('help'); }, 2500);
  }

  function terminarEscena() {
    btnNext.classList.remove('hidden');
    if (escenaIdx >= porRonda - 1) {
      btnNext.textContent = App.i18n.t('verResultado');
    } else {
      btnNext.textContent = App.i18n.t('siguienteEscena');
    }
    btnNext.focus();
  }

  function nextScene() {
    escenaIdx += 1;
    if (escenaIdx >= porRonda) {
      endRound();
    } else {
      pintarEscena();
    }
  }

  function endRound() {
    progress.rounds += 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#summary').textContent = App.i18n.t('summary', { n: roundHits, total: progress.stars });
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

