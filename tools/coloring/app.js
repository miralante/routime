/* ============================================================
   Routime — Colorear (creatividad y motricidad fina)
   Datos en data.js (DATA.dibujos, DATA.colores). Módulos
   compartidos en assets/js/. Mecánica: elegir un color y tocar
   una zona del dibujo para pintarla. Actividad libre, sin
   aciertos ni fallos: cada dibujo terminado da una estrella.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'colorear';
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var dibujoTituloEl = $('#dibujoTitulo');
  var lienzo = $('#lienzo');
  var coloresEl = $('#colores');
  var feedbackEl = $('#feedback');
  var btnTerminado = $('#btnTerminado');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (typeof progreso.dibujosPintados !== 'number') progreso.dibujosPintados = 0;

  var dibujoActual = null;
  var colorActual = DATA.colores[0];

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function pintarTarjetasDibujos() {
    var cont = $('#dibujos');
    cont.innerHTML = '';
    DATA.dibujos.forEach(function (d) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tarjeta tarjeta-dibujo';
      btn.innerHTML =
        '<span class="picto" aria-hidden="true">' + d.picto + '</span>' +
        '<span class="nombre">' + App.i18n.t('dibujo.' + d.id) + '</span>';
      btn.addEventListener('click', function () { empezar(d); });
      cont.appendChild(btn);
    });
  }

  function pintarColores() {
    coloresEl.innerHTML = '';
    DATA.colores.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-btn' + (c.id === colorActual.id ? ' seleccionado' : '');
      btn.style.background = c.valor;
      btn.setAttribute('aria-label', App.i18n.t('color.' + c.id));
      btn.setAttribute('aria-pressed', c.id === colorActual.id ? 'true' : 'false');
      btn.addEventListener('click', function () {
        colorActual = c;
        pintarColores();
      });
      coloresEl.appendChild(btn);
    });
  }

  function empezar(dibujo) {
    dibujoActual = dibujo;
    dibujoTituloEl.textContent = App.i18n.t('dibujo.' + dibujo.id);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');

    lienzo.innerHTML = '';
    dibujo.zonas.forEach(function (zona) {
      var el = document.createElementNS(SVG_NS, zona.tag);
      Object.keys(zona.attrs).forEach(function (attr) {
        el.setAttribute(attr, zona.attrs[attr]);
      });
      el.setAttribute('class', 'zona');
      el.setAttribute('fill', '#FFFFFF');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', App.i18n.t('zonaAria').replace('{nombre}', App.i18n.t('zona.' + zona.id)));
      el.addEventListener('click', function () { pintarZona(el); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pintarZona(el); }
      });
      lienzo.appendChild(el);
    });

    pintarColores();
    pintarEstrellas();
  }

  function pintarZona(el) {
    el.setAttribute('fill', colorActual.valor);
  }

  function terminar() {
    progreso.estrellas += 1;
    progreso.dibujosPintados += 1;
    guardar();
    pintarEstrellas();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    var partePintados = progreso.dibujosPintados === 1
      ? App.i18n.t('dibujosPintadosUno')
      : App.i18n.t('dibujosPintadosVarios').replace('{n}', progreso.dibujosPintados);
    var parteEstrellas = progreso.estrellas === 1
      ? App.i18n.t('estrellasUna')
      : App.i18n.t('estrellasVarias').replace('{n}', progreso.estrellas);
    $('#resumenFinal').textContent = partePintados + parteEstrellas;
    $('#transfer').textContent = App.i18n.t('transfer');
    App.feedback.celebrate(App.i18n.t('finalTitulo'));
  }

  /* Events */
  btnTerminado.addEventListener('click', terminar);
  $('#btnOtroDibujo').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pantallaInicio.classList.remove('oculto');
  });

  pintarTarjetasDibujos();
  pintarEstrellas();
})();
