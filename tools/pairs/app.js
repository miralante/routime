/* ============================================================
   Routime — Parejas (memoria y funciones ejecutivas)
   Emparejar cartas idénticas. Sin límite de tiempo ni intentos.
   Si no coinciden: mensaje de ánimo y se tapan tras 1,5 s.
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
  var feedbackEl = $('#feedback');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};

  /* Estado de la partida */
  var nivel = null;
  var encontradas = 0;
  var primera = null;      /* primera carta destapada */
  var bloqueado = false;   /* mientras se muestran 2 cartas */

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function pintarContador() {
    contadorEl.textContent = App.i18n.t('contador')
      .replace('{n}', encontradas)
      .replace('{total}', nivel.parejas);
  }

  /* ---- Pantalla inicial ---- */
  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    var banco = DATA[App.i18n.locale()] || DATA.es;
    banco.niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completados[n.id] || 0;
      var nombre = App.i18n.t(n.nombreKey);
      var parejasTxt = App.i18n.t('nivelParejas').replace('{n}', n.parejas);
      var vecesTxt = App.i18n.t('veces').replace('{n}', veces);
      btn.innerHTML = nombre + ' — ' + parejasTxt +
        ' <span class="nivel-info">(' + vecesTxt + ')</span>';
      btn.addEventListener('click', function () { empezar(n); });
      cont.appendChild(btn);
    });
  }

  function empezar(n) {
    nivel = n;
    encontradas = 0;
    primera = null;
    bloqueado = false;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';

    /* Pick random symbols and duplicate them (pictograms, language-agnostic) */
    var banco = DATA[App.i18n.locale()] || DATA.es;
    var simbolos = App.utils.shuffle(banco.simbolos).slice(0, nivel.parejas);
    var cartas = App.utils.shuffle(simbolos.concat(simbolos));

    tableroEl.style.gridTemplateColumns = 'repeat(' + nivel.columnas + ', 1fr)';
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
      if (encontradas === nivel.parejas) terminar();
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
    progreso.estrellas += nivel.estrellas;
    progreso.completados[nivel.id] = (progreso.completados[nivel.id] || 0) + 1;
    guardar();
    pintarEstrellas();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = nivel.estrellas === 1
      ? App.i18n.t('resumenFinalUna')
      : App.i18n.t('resumenFinalVarias').replace('{n}', nivel.estrellas);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('celebrarTexto'));
  }

  /* Events */
  $('#btnRepetir').addEventListener('click', function () { empezar(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });

  pintarNiveles();
  pintarEstrellas();
})();

