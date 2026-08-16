/* ============================================================
   Routime — El Teatro (construcción de escenas con profundidad)
   Datos en data.js (DATA.referencias, DATA.personajes, DATA.niveles).
   Mecánica: escenario de 2 filas × 4 columnas — arriba el FONDO
   (se ve más pequeño), abajo DELANTE (más grande, más cerca).
   Cada columna tiene una referencia del decorado; las órdenes van
   de una en una ("Pon el perro delante del árbol") y el sitio
   correcto es la otra fila de la columna de la referencia nombrada.
   Primer fallo → pista que enseña qué fila es delante/detrás
   (regla 12); segundo fallo → se marca el sitio (regla 11).
   Ronda de 3 escenas; 1 estrella por escena completada.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'el-teatro';
  var $ = App.utils.$;
  var COLS = 4;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var consignaEl = $('#consigna');
  var personajeEl = $('#personajeActual');
  var escenarioEl = $('#escenario');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};

  /* Round state */
  var nivel = null;
  var idxEscena = 0;
  var aciertosRonda = 0;
  var slots = [];           /* 8 posiciones (fila*COLS+col): {picto, nombre} | null */
  var ordenes = [];         /* [{ personaje, ref, refCol, rel }] */
  var idxOrden = 0;
  var intentos = 0;
  var enEscena = false;

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    banco().niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completados[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion +
        ' <span class="nivel-info">(' + veces + ' ' + App.i18n.t('veces') + ')</span>';
      btn.addEventListener('click', function () { iniciarRonda(n); });
      cont.appendChild(btn);
    });
  }

  function iniciarRonda(n) {
    nivel = n;
    idxEscena = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    nuevaEscena();
  }

  function pintarProgreso() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idxEscena / porRonda) * 100) + '%';
    progressText.textContent = idxEscena + ' / ' + porRonda;
  }

  /* ---- Montar la escena: 1 referencia por columna, fila al azar;
     las órdenes usan columnas distintas ---- */
  function nuevaEscena() {
    var refs = App.utils.shuffle(banco().referencias).slice(0, COLS);
    var personajes = App.utils.shuffle(banco().personajes).slice(0, nivel.ordenes);
    var columnasOrden = App.utils.shuffle([0, 1, 2, 3]).slice(0, nivel.ordenes);

    slots = new Array(2 * COLS).fill(null);
    ordenes = [];
    refs.forEach(function (ref, col) {
      var fila = Math.random() < 0.5 ? 0 : 1;
      slots[fila * COLS + col] = { picto: ref.picto, nombre: ref.el, ref: ref, fila: fila };
    });
    columnasOrden.forEach(function (col, i) {
      var refSlot = slots[col] ? slots[col] : slots[COLS + col];
      /* If the reference is in the back (row 0), the character goes
         in front; if it's in front (row 1), it goes behind. */
      var rel = refSlot.fila === 0 ? 'delante' : 'detras';
      ordenes.push({ personaje: personajes[i], ref: refSlot.ref, refCol: col, rel: rel });
    });

    idxOrden = 0;
    intentos = 0;
    enEscena = true;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');
    pintarEscenario();
    pintarOrden();
    pintarProgreso();
    pintarEstrellas();
  }

  function slotObjetivo() {
    var o = ordenes[idxOrden];
    var filaObjetivo = o.rel === 'delante' ? 1 : 0;
    return filaObjetivo * COLS + o.refCol;
  }

  function ariaSlot(i) {
    var fila = Math.floor(i / COLS);
    var col = (i % COLS) + 1;
    if (slots[i]) {
      return App.i18n.t('ariaOcupado').replace('{nombre}', slots[i].nombre).replace('{c}', col);
    }
    return App.i18n.t(fila === 0 ? 'ariaSitioFondo' : 'ariaSitioDelante').replace('{c}', col);
  }

  function pintarEscenario(marcarObjetivo) {
    escenarioEl.innerHTML = '';
    for (var fila = 0; fila < 2; fila++) {
      var banda = document.createElement('div');
      banda.className = fila === 0 ? 'banda fondo' : 'banda delante';
      for (var col = 0; col < COLS; col++) {
        var i = fila * COLS + col;
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
    intentos = 0;
    var o = ordenes[idxOrden];
    personajeEl.textContent = o.personaje.picto;
    consignaEl.textContent = textoConsigna();
  }

  function tocarSitio(i) {
    if (!enEscena || slots[i] !== null) return;
    var o = ordenes[idxOrden];
    if (i === slotObjetivo()) {
      slots[i] = { picto: o.personaje.picto, nombre: o.personaje.el };
      App.feedback.success(feedbackEl);
      explicacionEl.textContent = App.i18n.t('okSitio')
        .replace('{pers}', cap(o.personaje.el))
        .replace('{rel}', App.i18n.t('rel_' + o.rel))
        .replace('{ref}', o.ref.del);
      explicacionWrap.classList.remove('oculto');
      idxOrden += 1;
      if (idxOrden >= ordenes.length) {
        completarEscena();
      } else {
        pintarEscenario();
        pintarOrden();
      }
    } else {
      intentos += 1;
      App.feedback.encourage(feedbackEl);
      if (intentos === 1) {
        /* Rule 12: first failure → shows which row is front/back */
        explicacionEl.textContent = App.i18n
          .t(o.rel === 'delante' ? 'pistaDelante' : 'pistaDetras')
          .replace('{ref}', o.ref.el);
        pintarEscenario();
      } else {
        /* Segundo fallo → se marca el sitio correcto */
        explicacionEl.textContent = App.i18n.t('malSitio')
          .replace('{rel}', App.i18n.t('rel_' + o.rel))
          .replace('{ref}', o.ref.del);
        pintarEscenario(true);
      }
      explicacionWrap.classList.remove('oculto');
    }
  }

  function completarEscena() {
    enEscena = false;
    idxEscena += 1;
    aciertosRonda += 1;
    progreso.estrellas += 1;
    guardar();
    pintarEstrellas();
    pintarProgreso();
    pintarEscenario();
    personajeEl.textContent = '';
    consignaEl.textContent = App.i18n.t('escenaCompletada');
    App.feedback.celebrate(App.i18n.t('escenaCompletada'));
    btnSiguiente.classList.remove('oculto');
    btnSiguiente.focus();
  }

  function siguiente() {
    App.tts.stop();
    if (idxEscena >= banco().porRonda) {
      terminarRonda();
    } else {
      nuevaEscena();
    }
  }

  function terminarRonda() {
    progreso.completados[nivel.id] = (progreso.completados[nivel.id] || 0) + 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda).replace('{total}', progreso.estrellas);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarRonda(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pintarNiveles();
    pantallaInicio.classList.remove('oculto');
  });
  $('#btnConsigna').addEventListener('click', function () {
    App.tts.speak(consignaEl.textContent);
  });

  pintarNiveles();
  pintarEstrellas();
})();

