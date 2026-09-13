/* ============================================================
   Routime — Parejas (memoria y funciones ejecutivas)
   Emparejar cartas idénticas. Sin límite de tiempo ni intentos.
   Si no coinciden: mensaje de ánimo y se tapan tras 1,5 s.
   Progresión automática: empieza con 3 parejas y aumenta según
   el progreso guardado, sin mostrar selección de nivel al usuario.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'parejas';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var tableroEl = $('#tablero');
  var contadorEl = $('#contador');
  var dificultadEl = $('#dificultad');
  var feedbackEl = $('#feedback');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (typeof progreso.rondasCompletadas !== 'number') progreso.rondasCompletadas = 0;

  /* Estado de la partida */
  var nivelActual = null;
  var encontradas = 0;
  var primera = null;      /* primera carta destapada */
  var bloqueado = false;   /* mientras se muestran 2 cartas */

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function pintarContador() {
    contadorEl.textContent = '';
  }

  /* Determina el nivel según el progreso: cada partida completada,
     sube un nivel (0→facil con 3, 1→medio con 4, 2→dificil con 6) */
  function nivelSegunProgreso() {
    var idx = Math.min(progreso.rondasCompletadas, banco().niveles.length - 1);
    return banco().niveles[idx];
  }

  /* Muestra la dificultad actual (número de parejas) */
  function pintarDificultad() {
    if (dificultadEl) {
      dificultadEl.textContent = nivelActual.parejas + ' ' + App.i18n.t('parejas');
    }
  }

  function empezarJuego() {
    nivelActual = nivelSegunProgreso();
    encontradas = 0;
    primera = null;
    bloqueado = false;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';

    /* Pick random symbols and duplicate them (pictograms, language-agnostic) */
    var simbolos = App.utils.shuffle(banco().simbolos).slice(0, nivelActual.parejas);
    var cartas = App.utils.shuffle(simbolos.concat(simbolos));

    tableroEl.style.gridTemplateColumns = 'repeat(' + nivelActual.columnas + ', 1fr)';
    tableroEl.innerHTML = '';
    cartas.forEach(function (simbolo) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carta';
      btn.setAttribute('aria-label', App.i18n.t('cartaTapada'));
      btn.dataset.simbolo = simbolo;
      btn.textContent = '❓';
      btn.addEventListener('click', function () { destapar(btn); });
      tableroEl.appendChild(btn);
    });
    pintarContador();
    pintarDificultad();
    pintarEstrellas();
  }

  function destapar(carta) {
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
      pintarContador();
      App.feedback.success(feedbackEl);
      if (encontradas === nivelActual.parejas) terminar();
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

  function terminar() {
    progreso.estrellas += nivelActual.estrellas;
    progreso.rondasCompletadas += 1;
    guardar();
    pintarEstrellas();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
    $('#resumenFinal').textContent += '\n' + App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progreso.rondasCompletadas + 1, banco().niveles.length));
    $('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('celebrarTexto'));
  }

  /* Events */
  $('#btnJugar').addEventListener('click', function () { empezarJuego(); });
  $('#btnRepetir').addEventListener('click', function () { empezarJuego(); });
  $('#btnMenu').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.add('oculto');
    pantallaInicio.classList.remove('oculto');
    pintarEstrellas();
  });

  pintarEstrellas();
})();

