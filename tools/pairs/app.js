/* ============================================================
   Routime — Parejas (memoria y funciones ejecutivas)
   Emparejar cartas idénticas. Sin límite de tiempo ni attempts.
   Si no coinciden: mensaje de ánimo y se tapan tras 1,5 s.
   Progresión automática: empieza con 3 parejas y aumenta según
   el progress guardado, sin mostrar selección de nivel al usuario.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'parejas';
  var $ = App.utils.$;

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var tableroEl = $('#tablero');
  var counterEl = $('#contador');
  var levelEl = $('#dificultad');
  var feedbackEl = $('#feedback');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Estado de la partida */
  var currentLevel = null;
  var encontradas = 0;
  var primera = null;      /* primera carta destapada */
  var bloqueado = false;   /* mientras se muestran 2 cartas */

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function renderCounter() {
    counterEl.textContent = '';
  }

  /* Determina el nivel según el progress: cada partida completada,
     sube un nivel (0→facil con 3, 1→medio con 4, 2→dificil con 6) */
  function levelBasedOnProgress() {
    var idx = Math.min(progress.roundsCompleted, banco().niveles.length - 1);
    return banco().niveles[idx];
  }

  /* Muestra la dificultad current (número de parejas) */
  function renderLevel() {
    if (levelEl) {
      levelEl.textContent = currentLevel.parejas + ' ' + App.i18n.t('parejas');
    }
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    encontradas = 0;
    primera = null;
    bloqueado = false;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';

    /* Pick random symbols and duplicate them (pictograms, language-agnostic) */
    var simbolos = App.utils.shuffle(banco().simbolos).slice(0, currentLevel.parejas);
    var cartas = App.utils.shuffle(simbolos.concat(simbolos));

    tableroEl.style.gridTemplateColumns = 'repeat(' + currentLevel.columnas + ', 1fr)';
    tableroEl.innerHTML = '';
    cartas.forEach(function (simbolo) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carta';
      btn.setAttribute('aria-label', App.i18n.t('cartaTapada'));
      btn.dataset.simbolo = simbolo;
      btn.textContent = '❓';
      btn.addEventListener('click', function () { reveal(btn); });
      tableroEl.appendChild(btn);
    });
    renderCounter();
    renderLevel();
    renderStars();
  }

  function reveal(carta) {
    if (bloqueado) return;
    if (carta.classList.contains('descubierta') || carta === primera) return;

    carta.textContent = carta.dataset.simbolo;
    carta.classList.add('vista');
    carta.setAttribute('aria-label', App.i18n.t('cartaConSimbolo').replace('{picto}', carta.dataset.simbolo));

    if (!primera) {
      primera = carta;
      return;
    }

    /* Segunda carta */
    if (primera.dataset.simbolo === carta.dataset.simbolo) {
      primera.classList.add('descubierta');
      carta.classList.add('descubierta');
      primera.disabled = true;
      carta.disabled = true;
      primera = null;
      encontradas += 1;
      renderCounter();
      App.feedback.success(feedbackEl);
      if (encontradas === currentLevel.parejas) finish();
    } else {
      bloqueado = true;
      App.feedback.encourage(feedbackEl);
      var p = primera;
      setTimeout(function () {
        p.textContent = '❓';
        carta.textContent = '❓';
        p.classList.remove('vista');
        carta.classList.remove('vista');
        p.setAttribute('aria-label', App.i18n.t('cartaTapada'));
        carta.setAttribute('aria-label', App.i18n.t('cartaTapada'));
        primera = null;
        bloqueado = false;
      }, 1500);
    }
  }

  function finish() {
    progress.stars += currentLevel.stars;
    progress.roundsCompleted += 1;
    save();
    renderStars();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#resumenFinal').textContent += '\n' + App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompleted + 1, banco().niveles.length));
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('celebrarTexto'));
  }

  /* Events */
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../site/index.html';
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();

