/* ============================================================
   Routime — Antes de la Emergencia (autonomía: lo que se
   puede tener en casa con la familia, antes de que pase algo).
   Datos en data.js (DATA.saber, DATA.checklist). Dos actividades
   elegibles desde un menú (regla 10: una acción principal por
   pantalla):
   - "¿Lo tengo ya?": quiz de 3 options (motor de Situations) que
     trabaja cosas de prevención (112 escrito, dirección visible,
     detector de humo, llaves de luz/gas, pastillas fuera de
     alcance, puerta que se abre desde dentro). La opción
     correcta es la que se enseña en prevención; las otras son
     options reales pero menos seguras.
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

  var menuScreen = $('#menuScreen');
  var pantallaSaber = $('#pantallaSaber');
  var pantallaChecklist = $('#pantallaChecklist');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completadoSaber) progress.completadoSaber = 0;
  if (!progress.completadoChecklist) progress.completadoChecklist = 0;
  if (!progress.checklistMarcado) progress.checklistMarcado = {};

  var actividadActual = null; /* 'saber' | 'checklist' */

  function save() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function ocultarTodas() {
    [menuScreen, pantallaSaber, pantallaChecklist, endScreen].forEach(function (p) {
      p.classList.add('hidden');
    });
  }

  function irMenu() {
    ocultarTodas();
    renderMenu();
    menuScreen.classList.remove('hidden');
  }

  function renderMenu() {
    $('#marcaSaber').textContent = '';
    $('#marcaChecklist').textContent = '';
    renderStars();
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
    pantallaSaber.classList.remove('hidden');
    renderSaber();
  }

  function pintarProgresoS() {
    var porRonda = banco().porRonda;
    progressSFill.style.width = ((idxS / porRonda) * 100) + '%';
    progressSText.textContent = '';
  }

  function renderSaber() {
    var item = itemsSaber[idxS];
    resueltoS = false;
    intentosS = 0;
    saberPictoEl.textContent = item.picto;
    saberTextoEl.textContent = item.pregunta;
    feedbackSEl.textContent = '';
    feedbackSEl.className = 'feedback';
    explicacionSWrap.classList.add('hidden');
    explicacionSEl.textContent = '';
    btnSiguienteS.classList.add('hidden');
    opcionesSEl.innerHTML = '';

    var options = App.utils.shuffle(item.options.map(function (opt, i) {
      return { text: opt, isCorrect: i === item.correcta };
    }));
    options.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.textContent;
      btn.addEventListener('click', function () { responderSaber(btn, op.isCorrect, item); });
      opcionesSEl.appendChild(btn);
    });

    pintarProgresoS();
    renderStars();
  }

  function mostrarExplicacionS(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.';
    explicacionSEl.textContent = text;
    explicacionSWrap.classList.remove('hidden');
  }

  function responderSaber(btn, isCorrect, item) {
    if (resueltoS) return;
    if (isCorrect) {
      mostrarExplicacionS(isCorrect, item);
      resueltoS = true;
      btn.classList.add('correcta');
      App.utils.$('#opcionesSaber .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackSEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      aciertosS += 1;
      save();
      renderStars();
      btnSiguienteS.classList.remove('hidden');
      btnSiguienteS.focus();
    } else {
      intentosS += 1;
      if (intentosS === 1) {
        explicacionSEl.textContent = App.i18n.t('pista') + '"' + item.pregunta + '"';
        explicacionSWrap.classList.remove('hidden');
      } else {
        mostrarExplicacionS(isCorrect, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackSEl);
      App.feedback.lockUntilAck(App.utils.$('#opcionesSaber .btn-opcion'), explicacionSWrap);
    }
  }

  function siguienteSaber() {
    idxS += 1;
    if (idxS >= banco().porRonda) {
      terminarSaber();
    } else {
      renderSaber();
    }
  }

  function terminarSaber() {
    progress.completadoSaber += 1;
    save();
    ocultarTodas();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#transferencia').textContent = '';
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
      return { id: it.id, picto: it.picto, name: it.name, marcado: !!progress.checklistMarcado[it.id] };
    });
    idxC = 0;
    aciertosC = 0;
    ocultarTodas();
    pantallaChecklist.classList.remove('hidden');
    renderChecklist();
  }

  function pintarProgresoC() {
    var total = itemsChecklist.length;
    progressCFill.style.width = ((idxC / total) * 100) + '%';
    progressCText.textContent = '';
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
        '<span class="check-name">' + it.name + '</span>';
      btn.setAttribute('aria-pressed', it.marcado ? 'true' : 'false');
      btn.addEventListener('click', function () { toggleChecklist(it, btn); });
      checklistEl.appendChild(btn);
    });

    pintarProgresoC();
    renderStars();
  }

  function toggleChecklist(item, btn) {
    item.marcado = !item.marcado;
    progress.checklistMarcado[item.id] = item.marcado;
    if (item.marcado) {
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      aciertosC += 1;
      App.feedback.success(feedbackCEl);
    } else {
      /* No se resta, pero sí se actualiza el contador de progress */
    }
    save();
    /* Re-paint the single item without resetting scroll */
    btn.classList.toggle('marcado', item.marcado);
    btn.innerHTML = '<span class="check-picto" aria-hidden="true">' +
      (item.marcado ? '✅' : '⬜') + '</span>' +
      '<span class="check-name">' + item.name + '</span>';
    btn.setAttribute('aria-pressed', item.marcado ? 'true' : 'false');
    /* Count "checked" items as completed rounds */
    var marcados = itemsChecklist.filter(function (x) { return x.marcado; }).length;
    idxC = Math.min(marcados, itemsChecklist.length);
    pintarProgresoC();
    renderStars();
    if (marcados >= itemsChecklist.length) {
      setTimeout(terminarChecklist, 700);
    }
  }

  function terminarChecklist() {
    progress.completadoChecklist += 1;
    save();
    ocultarTodas();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaSaber').addEventListener('click', iniciarSaber);
  $('#tarjetaChecklist').addEventListener('click', iniciarChecklist);
  $('#btnVolverSaber').addEventListener('click', irMenu);
  $('#btnVolverChecklist').addEventListener('click', irMenu);
  btnSiguienteS.addEventListener('click', siguienteSaber);
  $('#btnEscucharExplicacionSaber').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(explicacionSEl.textContent);
  });
  $('#btnEscucharSaber').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(itemsSaber[idxS].pregunta);
  });
  $('#btnRepeat').addEventListener('click', function () {
    if (actividadActual === 'saber') iniciarSaber();
    else iniciarChecklist();
  });
  $('#btnVolverMenuFinal').addEventListener('click', irMenu);


  irMenu();
})();
