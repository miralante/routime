/* ============================================================
   Routime — Antes de la Emergencia (autonomía: lo que se
   puede tener en casa con la familia, antes de que pase algo).
   Datos en data.js (DATA.saber, DATA.checklist). Dos actividades
   elegibles desde un menú (regla 10: una acción principal por
   pantalla):
   - "¿Lo tengo ya?": quiz de 3 opciones (motor de Situations) que
     trabaja cosas de prevención (112 escrito, dirección visible,
     detector de humo, llaves de luz/gas, pastillas fuera de
     alcance, puerta que se abre desde dentro). La opción
     correcta es la que se enseña en prevención; las otras son
     opciones reales pero menos seguras.
   - "Mi lista en casa": checklist tipo task-list con 8 cosas;
     no hay aciertos/fallos — la actividad es de REVISIÓN
     familiar, no de examen. Al final se listan las marcadas y
     las que faltan, para hacerlo con la familia en casa.
   Sin niveles (regla 13 no aplica: cada ronda ya mezcla
   dificultad a propósito, como contraste didáctico, no como
   progresión).
   Pista socrática en el primer fallo (regla 12).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'be-prepared';
  var $ = App.utils.$;

  var pantallaMenu = $('#pantallaMenu');
  var pantallaSaber = $('#pantallaSaber');
  var pantallaChecklist = $('#pantallaChecklist');
  var pantallaFinal = $('#pantallaFinal');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completadoSaber) progreso.completadoSaber = 0;
  if (!progreso.completadoChecklist) progreso.completadoChecklist = 0;
  if (!progreso.checklistMarcado) progreso.checklistMarcado = {};

  var actividadActual = null; /* 'saber' | 'checklist' */

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function ocultarTodas() {
    [pantallaMenu, pantallaSaber, pantallaChecklist, pantallaFinal].forEach(function (p) {
      p.classList.add('oculto');
    });
  }

  function irMenu() {
    App.tts.stop();
    ocultarTodas();
    pintarMenu();
    pantallaMenu.classList.remove('oculto');
  }

  function pintarMenu() {
    $('#marcaSaber').textContent = progreso.completadoSaber > 0 ? '⭐' : '';
    $('#marcaChecklist').textContent = progreso.completadoChecklist > 0 ? '⭐' : '';
    pintarEstrellas();
  }

  /* ================= Actividad 1: ¿Lo tengo ya? ================= */
  var itemsSaber = [];
  var idxS = 0;
  var aciertosS = 0;
  var resueltoS = false;
  var intentosS = 0;

  var saberPictoEl = $('#saberPicto');
  var saberTextoEl = $('#saberTexto');
  var opcionesSEl = $('#opcionesSaber');
  var feedbackSEl = $('#feedbackSaber');
  var explicacionSWrap = $('#explicacionSaberWrap');
  var explicacionSEl = $('#explicacionSaber');
  var progressSFill = $('#progressSaberFill');
  var progressSText = $('#progressSaberText');
  var btnSiguienteS = $('#btnSiguienteSaber');

  function iniciarSaber() {
    actividadActual = 'saber';
    itemsSaber = App.utils.shuffle(banco().saber).slice(0, banco().porRonda);
    idxS = 0;
    aciertosS = 0;
    ocultarTodas();
    pantallaSaber.classList.remove('oculto');
    renderSaber();
  }

  function pintarProgresoS() {
    var porRonda = banco().porRonda;
    progressSFill.style.width = ((idxS / porRonda) * 100) + '%';
    progressSText.textContent = idxS + ' / ' + porRonda;
  }

  function renderSaber() {
    var item = itemsSaber[idxS];
    resueltoS = false;
    intentosS = 0;
    saberPictoEl.textContent = item.picto;
    saberTextoEl.textContent = item.pregunta;
    feedbackSEl.textContent = '';
    feedbackSEl.className = 'feedback';
    explicacionSWrap.classList.add('oculto');
    explicacionSEl.textContent = '';
    btnSiguienteS.classList.add('oculto');
    opcionesSEl.innerHTML = '';

    var opciones = App.utils.shuffle(item.opciones.map(function (opt, i) {
      return { texto: opt, esCorrecta: i === item.correcta };
    }));
    opciones.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { responderSaber(btn, op.esCorrecta, item); });
      opcionesSEl.appendChild(btn);
    });

    pintarProgresoS();
    pintarEstrellas();
  }

  function mostrarExplicacionS(esCorrecta, item) {
    var texto = esCorrecta
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.opciones[item.correcta] + '.';
    explicacionSEl.textContent = texto;
    explicacionSWrap.classList.remove('oculto');
  }

  function responderSaber(btn, esCorrecta, item) {
    if (resueltoS) return;
    if (esCorrecta) {
      mostrarExplicacionS(esCorrecta, item);
      resueltoS = true;
      btn.classList.add('correcta');
      App.utils.$$('#opcionesSaber .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackSEl);
      progreso.estrellas += 1;
      aciertosS += 1;
      guardar();
      pintarEstrellas();
      btnSiguienteS.classList.remove('oculto');
      btnSiguienteS.focus();
    } else {
      intentosS += 1;
      if (intentosS === 1) {
        explicacionSEl.textContent = App.i18n.t('pista') + '"' + item.pregunta + '"';
        explicacionSWrap.classList.remove('oculto');
      } else {
        mostrarExplicacionS(esCorrecta, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackSEl);
      App.feedback.lockUntilAck(App.utils.$$('#opcionesSaber .btn-opcion'), explicacionSWrap);
    }
  }

  function siguienteSaber() {
    idxS += 1;
    App.tts.stop();
    if (idxS >= banco().porRonda) {
      terminarSaber();
    } else {
      renderSaber();
    }
  }

  function terminarSaber() {
    progreso.completadoSaber += 1;
    guardar();
    ocultarTodas();
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosS).replace('{total}', progreso.estrellas);
    $('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ================= Actividad 2: mi lista en casa (checklist) ================= */
  var itemsChecklist = [];
  var idxC = 0;
  var aciertosC = 0;
  var checklistEl = $('#checklist');
  var feedbackCEl = $('#feedbackChecklist');
  var progressCFill = $('#progressChecklistFill');
  var progressCText = $('#progressChecklistText');
  var checklistTituloEl = $('#checklistTitulo');

  function iniciarChecklist() {
    actividadActual = 'checklist';
    /* Deep-clone so we don't mutate the catalogue */
    itemsChecklist = banco().checklist.map(function (it) {
      return { id: it.id, picto: it.picto, nombre: it.nombre, marcado: !!progreso.checklistMarcado[it.id] };
    });
    idxC = 0;
    aciertosC = 0;
    ocultarTodas();
    pantallaChecklist.classList.remove('oculto');
    renderChecklist();
  }

  function pintarProgresoC() {
    var total = itemsChecklist.length;
    progressCFill.style.width = ((idxC / total) * 100) + '%';
    progressCText.textContent = idxC + ' / ' + total;
  }

  function renderChecklist() {
    feedbackCEl.textContent = '';
    feedbackCEl.className = 'feedback';
    checklistTituloEl.textContent = App.i18n.t('checklistTitulo');

    checklistEl.innerHTML = '';
    itemsChecklist.forEach(function (it) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'checklist-item' + (it.marcado ? ' marcado' : '');
      btn.innerHTML = '<span class="check-picto" aria-hidden="true">' +
        (it.marcado ? '✅' : '⬜') + '</span>' +
        '<span class="check-nombre">' + it.nombre + '</span>';
      btn.setAttribute('aria-pressed', it.marcado ? 'true' : 'false');
      btn.addEventListener('click', function () { toggleChecklist(it, btn); });
      checklistEl.appendChild(btn);
    });

    pintarProgresoC();
    pintarEstrellas();
  }

  function toggleChecklist(item, btn) {
    item.marcado = !item.marcado;
    progreso.checklistMarcado[item.id] = item.marcado;
    if (item.marcado) {
      progreso.estrellas += 1;
      aciertosC += 1;
      App.feedback.success(feedbackCEl);
    } else {
      /* No se resta, pero sí se actualiza el contador de progreso */
    }
    guardar();
    /* Re-paint the single item without resetting scroll */
    btn.classList.toggle('marcado', item.marcado);
    btn.innerHTML = '<span class="check-picto" aria-hidden="true">' +
      (item.marcado ? '✅' : '⬜') + '</span>' +
      '<span class="check-nombre">' + item.nombre + '</span>';
    btn.setAttribute('aria-pressed', item.marcado ? 'true' : 'false');
    /* Count "checked" items as completed rounds */
    var marcados = itemsChecklist.filter(function (x) { return x.marcado; }).length;
    idxC = Math.min(marcados, itemsChecklist.length);
    pintarProgresoC();
    pintarEstrellas();
    if (marcados >= itemsChecklist.length) {
      setTimeout(terminarChecklist, 700);
    }
  }

  function terminarChecklist() {
    progreso.completadoChecklist += 1;
    guardar();
    ocultarTodas();
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinalChecklist')
      .replace('{n}', aciertosC).replace('{total}', itemsChecklist.length);
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaSaber').addEventListener('click', iniciarSaber);
  $('#tarjetaChecklist').addEventListener('click', iniciarChecklist);
  $('#btnVolverSaber').addEventListener('click', irMenu);
  $('#btnVolverChecklist').addEventListener('click', irMenu);
  btnSiguienteS.addEventListener('click', siguienteSaber);
  $('#btnEscucharExplicacionSaber').addEventListener('click', function () {
    App.tts.speak(explicacionSEl.textContent);
  });
  $('#btnEscucharSaber').addEventListener('click', function () {
    App.tts.speak(itemsSaber[idxS].pregunta);
  });
  $('#btnRepetir').addEventListener('click', function () {
    if (actividadActual === 'saber') iniciarSaber();
    else iniciarChecklist();
  });
  $('#btnVolverMenuFinal').addEventListener('click', irMenu);


  irMenu();
})();
