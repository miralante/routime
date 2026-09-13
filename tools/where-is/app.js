/* ============================================================
   Routime — ¿Dónde está? (direccionamiento y localización)
   Datos en data.js (DATA.objetos, DATA.niveles). Los ítems se
   generan al vuelo: 3 objetos (referencia en el centro, objetivo a
   un lado, distractor al otro) colocados en fila o columna según el
   eje del nivel, y una consigna espacial ("Toca lo que está a la
   izquierda de la casa"). Primer fallo → pista socrática que enseña
   la estrategia (busca la referencia, luego mira hacia el lado);
   segundo fallo → se marca el objetivo y se explica (reglas 11/12).
   Ronda de 8. El error nunca se castiga.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'donde-esta';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var consignaEl = $('#consigna');
  var escenaEl = $('#escena');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var dificultadEl = $('#dificultad');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};
  if (typeof progreso.rondasCompletadas !== 'number') progreso.rondasCompletadas = 0;

  /* Round state */
  var nivelActual = null;
  var idx = 0;
  var aciertosRonda = 0;
  var resuelto = false;
  var intentos = 0;
  var item = null;          /* { rel, ref, objetivo, distractor, eje } */
  var botonObjetivo = null;

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* Determina el nivel según el progreso: cada ronda completada,
     sube un nivel. */
  function nivelSegunProgreso() {
    var idxN = Math.min(progreso.rondasCompletadas, banco().niveles.length - 1);
    return banco().niveles[idxN];
  }

  /* Muestra la dificultad actual (eje del nivel: horizontal/vertical). */
  function pintarDificultad() {
    if (dificultadEl) {
      dificultadEl.textContent = nivelActual.relaciones.length + ' ' +
        App.i18n.t(nivelActual.relaciones.length === 1 ? 'relacion' : 'relaciones');
    }
  }

  function iniciarJuego() {
    nivelActual = nivelSegunProgreso();
    idx = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    pintarDificultad();
    render();
  }

  function pintarProgreso() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idx / porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  /* Generates an item: the level's relation + 3 distinct objects.
     Placement: the reference is always in the center; the target on
     the side the relation says; the distractor on the opposite side. */
  function generarItem() {
    var rel = App.utils.shuffle(nivelActual.relaciones)[0];
    var eje = (rel === 'izq' || rel === 'der') ? 'fila' : 'columna';
    var tres = App.utils.shuffle(banco().objetos).slice(0, 3);
    return { rel: rel, eje: eje, ref: tres[0], objetivo: tres[1], distractor: tres[2] };
  }

  /* Orden visual: fila → izquierda-centro-derecha; columna → arriba-
     centro-abajo. 'izq' y 'enc' ponen el objetivo primero. */
  function ordenVisual() {
    var primero = (item.rel === 'izq' || item.rel === 'enc');
    return primero
      ? [item.objetivo, item.ref, item.distractor]
      : [item.distractor, item.ref, item.objetivo];
  }

  function render() {
    item = generarItem();
    resuelto = false;
    intentos = 0;
    botonObjetivo = null;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');

    var consigna = App.i18n.t('consigna')
      .replace('{rel}', App.i18n.t('rel_' + item.rel))
      .replace('{ref}', item.ref.del);
    consignaEl.textContent = consigna;

    escenaEl.className = 'escena ' + (item.eje === 'fila' ? 'en-fila' : 'en-columna');
    escenaEl.innerHTML = '';
    ordenVisual().forEach(function (obj) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'objeto';
      btn.textContent = obj.picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaObjeto').replace('{objeto}', obj.el));
      if (obj === item.objetivo) botonObjetivo = btn;
      btn.addEventListener('click', function () { responder(btn, obj === item.objetivo); });
      escenaEl.appendChild(btn);
    });

    pintarProgreso();
    pintarEstrellas();
  }

  function responder(btn, esCorrecta) {
    if (resuelto) return;
    if (esCorrecta) {
      resuelto = true;
      btn.classList.add('correcta');
      App.utils.$$('.objeto', escenaEl).forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      explicacionEl.textContent = App.i18n.t('okRelacion')
        .replace('{objeto}', cap(item.objetivo.el))
        .replace('{rel}', App.i18n.t('rel_' + item.rel))
        .replace('{ref}', item.ref.del);
      explicacionWrap.classList.remove('oculto');
      progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      aciertosRonda += 1;
      guardar();
      pintarEstrellas();
      btnSiguiente.classList.remove('oculto');
      btnSiguiente.focus();
    } else {
      intentos += 1;
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      if (intentos === 1) {
        /* Regla 12: primer fallo → estrategia, nunca la respuesta */
        explicacionEl.textContent = App.i18n.t('pista')
          .replace('{ref}', item.ref.el)
          .replace('{mira}', App.i18n.t('mira_' + item.rel));
      } else {
        /* Segundo fallo → se marca el objetivo y se explica */
        explicacionEl.textContent = App.i18n.t('malRelacion')
          .replace('{Rel}', cap(App.i18n.t('rel_' + item.rel)))
          .replace('{ref}', item.ref.del)
          .replace('{objeto}', item.objetivo.el);
        if (botonObjetivo) botonObjetivo.classList.add('sugerida');
      }
      explicacionWrap.classList.remove('oculto');
      App.feedback.lockUntilAck(App.utils.$$('.objeto', escenaEl), explicacionWrap);
    }
  }

  function siguiente() {
    idx += 1;
    if (idx >= banco().porRonda) {
      terminarRonda();
    } else {
      render();
    }
  }

  function terminarRonda() {
    progreso.completados[nivelActual.id] = (progreso.completados[nivelActual.id] || 0) + 1;
    progreso.rondasCompletadas += 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
    $('#resumenFinal').textContent += '\n' + App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progreso.rondasCompletadas + 1, banco().niveles.length));
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnJugar').addEventListener('click', function () { iniciarJuego(); });
  $('#btnRepetir').addEventListener('click', function () { iniciarJuego(); });
  $('#btnMenu').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.add('oculto');
    pantallaInicio.classList.remove('oculto');
    pintarEstrellas();
  });
  $('#btnConsigna').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(consignaEl.textContent);
  });

  pintarEstrellas();
})();

