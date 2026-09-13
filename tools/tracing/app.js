/* ============================================================
   Routime â€” Trazos (motricidad fina)
   Datos en data.js (DATA.niveles + FORMAS_COMUNES). MÃ³dulos
   compartidos en assets/js/. MecÃ¡nica: repasar con el dedo o el
   ratÃ³n una guÃ­a de puntos. Se comprueba cuÃ¡nta guÃ­a se ha
   cubierto (sin exigir perfecciÃ³n). Sin lÃ­mite de intentos:
   "Borrar" permite volver a empezar.

   Cada forma se compone por referencia ('ref') al catÃ¡logo
   FORMAS_COMUNES. Esto evita duplicar geometrÃ­a entre ES y EN y
   mantiene una sola fuente de verdad para cada letra.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'trazos';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var pantallaSeleccion = $('#pantallaSeleccion');
  var formaTituloEl = $('#formaTitulo');
  var lienzo = $('#lienzo');
  var guiaPath = $('#guia');
  var trazoPath = $('#trazoUsuario');
  var feedbackEl = $('#feedback');
  var btnBorrar = $('#btnBorrar');
  var btnComprobar = $('#btnComprobar');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var rejillaMayus = $('#rejillaMayus');
  var rejillaMinus = $('#rejillaMinus');
  var seleccionResumen = $('#seleccionResumen');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};
  if (typeof progreso.rondasCompletadas !== 'number') progreso.rondasCompletadas = 0;

  /* Round state */
  var nivelActual = null;
  var modo = 'guiado';      /* 'guiado' (niveles 1-5) o 'libre' (abecedario) */
  var formas = [];
  var idx = 0;
  var aciertosRonda = 0;
  var totalRonda = 0;       /* dinÃ¡mico: porRonda o porRondaLibre */
  var resuelto = false;
  var trazos = [];       /* array de trazos; cada uno, array de [x,y] */
  var dibujando = false;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  /* Letras elegidas en modo libre. Cada entrada es { id, ref }. */
  var letrasSeleccionadas = [];

  /* Resuelve la geometrÃ­a (puntos) de una forma: admite tanto
     el nuevo formato { ref } como el antiguo { puntos } directo,
     para que scripts anteriores o ampliaciones no rompan. */
  function puntosDeForma(forma) {
    if (Array.isArray(forma.puntos)) return forma.puntos;
    if (forma.ref && FORMAS_COMUNES && FORMAS_COMUNES[forma.ref]) {
      return FORMAS_COMUNES[forma.ref].puntos;
    }
    return [];
  }

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = 'â­ ' + progreso.estrellas; }

  /* ---- Modo libre: selecciÃ³n de letras ---- */

  /* Pinta las dos rejillas (mayÃºsculas y minÃºsculas). Cada letra
     es un botÃ³n con estado presionado/no-presionado. La etiqueta
     accesible anuncia el nombre de la letra y si estÃ¡ elegida. */
  function pintarRejillaLetras() {
    rejillaMayus.innerHTML = '';
    rejillaMinus.innerHTML = '';
    pintarGrupoLetras(rejillaMayus, DATOS.alfabeto.mayusculas, 'MayÃºscula');
    pintarGrupoLetras(rejillaMinus, DATOS.alfabeto.minusculas, 'MinÃºscula');
    /* Restaura selecciÃ³n visual al volver a abrir la pantalla. */
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
    var plantilla = App.i18n.t('seleccionResumen') || '{n} letras';
    seleccionResumen.textContent = plantilla.replace('{n}', n);
  }

  );
      cont.appendChild(btn);
    });
  }

    /* Determina el nivel segÃºn el progreso: cada ronda completada, sube un nivel. */
  function nivelSegunProgreso() {
    var idxN = Math.min(progreso.rondasCompletadas, banco().niveles.length - 1);
    return banco().niveles[idxN];
  }

  /* Muestra la dificultad actual (etiqueta del nivel). */
  function pintarDificultad() {
    if (dificultadEl) {
      dificultadEl.textContent = nivelActual.nombre;
    }
  }

  function iniciarJuego() {
    nivelActual = nivelSegunProgreso();
function iniciarPracticaLibre(seleccion) {
    if (!seleccion || !seleccion.length) return;
    nivel = null;
    modo = 'libre';
    /* Construimos formas a partir de las letras elegidas. Como
       pueden repetirse entre ronda y ronda, las barajamos y nos
       quedamos con porRondaLibre (o menos si hay pocas letras). */
    var tam = Math.min(DATOS.porRondaLibre, seleccion.length);
    formas = App.utils.shuffle(seleccion).slice(0, tam).map(function (it) {
      return { nombre: it.id, ref: it.ref };
    });
    totalRonda = formas.length;
    idx = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaSeleccion.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    render();
  }

  function pintarProgreso() {
    progressFill.style.width = ((idx / totalRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function cadenaDesdePuntos(puntos) {
    return 'M ' + puntos.map(function (p) { return p[0] + ',' + p[1]; }).join(' L ');
  }

  function render() {
    var forma = formas[idx];
    resuelto = false;
    trazos = [];
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnSiguiente.classList.add('oculto');
    formaTituloEl.textContent = forma.nombre;
    guiaPath.setAttribute('d', cadenaDesdePuntos(puntosDeForma(forma)));
    trazoPath.setAttribute('d', '');

    pintarProgreso();
    pintarEstrellas();
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
    if (resuelto) return;
    evt.preventDefault();
    dibujando = true;
    try { lienzo.setPointerCapture(evt.pointerId); } catch (e) { /* ignorar */ }
    trazos.push([coordenadas(evt)]);
  }

  function continuarTrazo(evt) {
    if (!dibujando || resuelto) return;
    evt.preventDefault();
    trazos[trazos.length - 1].push(coordenadas(evt));
    pintarTrazoUsuario();
  }

  function terminarTrazo() {
    dibujando = false;
  }

  /* ---- Coverage check ---- */
  function puntosFinos(puntos, pasos) {
    var finos = [];
    for (var i = 0; i < puntos.length - 1; i++) {
      var a = puntos[i], b = puntos[i + 1];
      for (var j = 0; j <= pasos; j++) {
        finos.push([
          a[0] + ((b[0] - a[0]) * j) / pasos,
          a[1] + ((b[1] - a[1]) * j) / pasos
        ]);
      }
    }
    return finos;
  }

  function distancia(p1, p2) {
    return Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
  }

  function comprobar() {
    if (resuelto) return;
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
      resuelto = true;
      App.feedback.success(feedbackEl);
      progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      aciertosRonda += 1;
      guardar();
      pintarEstrellas();
      btnSiguiente.classList.remove('oculto');
      btnSiguiente.focus();
    } else {
      App.feedback.encourage(feedbackEl);
    }
  }

  function borrar() {
    if (resuelto) return;
    trazos = [];
    trazoPath.setAttribute('d', '');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
  }

  function siguiente() {
    idx += 1;
    if (idx >= totalRonda) {
      terminarRonda();
    } else {
      render();
    }
  }

  function terminarRonda() {
    if (nivel && nivelActual.id) {
      progreso.completados[nivelActual.id] = (progreso.completados[nivelActual.id] || 0) + 1;
    }
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    var plantilla = App.i18n.t('resumenFinal');
    $('#resumenFinal').textContent.textContent = '';
    $('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('finalTitulo'));
  }

  /* Events */
  lienzo.addEventListener('pointerdown', iniciarTrazo);
  lienzo.addEventListener('pointermove', continuarTrazo);
  lienzo.addEventListener('pointerup', terminarTrazo);
  lienzo.addEventListener('pointercancel', terminarTrazo);
  btnBorrar.addEventListener('click', borrar);
  btnComprobar.addEventListener('click', comprobar);
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () {
    if (modo === 'libre') {
      iniciarPracticaLibre(letrasSeleccionadas);
    } else if (nivel) {
      iniciarJuego();
    }
  });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });
  $('#btnModoLibre').addEventListener('click', function () {
    pantallaInicio.classList.add('oculto');
    pintarRejillaLetras();
    pintarResumenSeleccion();
    pantallaSeleccion.classList.remove('oculto');
  });
  $('#btnVolverInicio').addEventListener('click', function () {
    pantallaSeleccion.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
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

  pintarEstrellas();
})();
