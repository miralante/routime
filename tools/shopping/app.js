/* ============================================================
   Routime — La Compra (AVD instrumental: supermercado y lista
   de la compra)
   Dos actividades: secciones del súper y lista de la compra.
   Cada una tiene sus propios niveles internos que se auto-seleccionan
   según el progress guardado, sin mostrar selección de nivel.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'la-compra';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var pantallaJuegoSecciones = $('#pantallaJuegoSecciones');
  var pantallaJuegoLista = $('#pantallaJuegoLista');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');

  /* Progreso persistente (un contador de estrellas compartido) */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.roundsCompletedSecciones) progress.roundsCompletedSecciones = 0;
  if (!progress.roundsCompletedLista) progress.roundsCompletedLista = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function ocultarTodas() {
    [startScreen, pantallaJuegoSecciones, pantallaJuegoLista, endScreen].forEach(function (p) {
      if (p) p.classList.add('hidden');
    });
  }

  /* ================= Activity 1: Which section? ================= */
  var nivelS = null;
  var itemsS = [];
  var idxS = 0;
  var resueltoS = false;
  var intentosS = 0;

  var itemPictoSEl = $('#itemPictoSecciones');
  var itemPalabraSEl = $('#itemPalabraSecciones');
  var cajasSEl = $('#cajasSecciones');
  var feedbackSEl = $('#feedbackSecciones');
  var explicacionSWrap = $('#explanationSeccionesWrap');
  var explicacionSEl = $('#explanationSecciones');
  var progressSFill = $('#progressSeccionesFill');
  var progressSText = $('#progressSeccionesText');
  var btnSiguienteS = $('#btnSiguienteSecciones');

  function nivelSegunProgresoS() {
    var niveles = banco().secciones.niveles;
    var idx = Math.min(progress.roundsCompletedSecciones, niveles.length - 1);
    return niveles[idx];
  }

  function iniciarSecciones() {
    nivelS = nivelSegunProgresoS();
    itemsS = App.utils.shuffle(nivelS.items).slice(0, banco().secciones.porRonda);
    idxS = 0;
    resueltoS = false;
    ocultarTodas();
    pantallaJuegoSecciones.classList.remove('hidden');
    renderSecciones();
  }

  function pintarProgresoS() {
    var porRonda = banco().secciones.porRonda;
    progressSFill.style.width = ((idxS / porRonda) * 100) + '%';
    progressSText.textContent = '';
  }

  function renderSecciones() {
    var item = itemsS[idxS];
    resueltoS = false;
    intentosS = 0;
    feedbackSEl.textContent = '';
    feedbackSEl.className = 'feedback';
    explicacionSWrap.classList.add('hidden');
    explicacionSEl.textContent = '';
    if (btnSiguienteS) btnSiguienteS.classList.add('hidden');

    itemPictoSEl.textContent = item.picto;
    itemPalabraSEl.textContent = item.palabra;

    cajasSEl.innerHTML = '';
    App.utils.shuffle(nivelS.categorias).forEach(function (categoria) {
      var row = document.createElement('div');
      row.className = 'row-caja';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn caja';
      btn.textContent = categoria;
      btn.addEventListener('click', function () { responderSecciones(btn, categoria === item.categoria, item); });

      var btnAudio = document.createElement('button');
      btnAudio.type = 'button';
      btnAudio.className = 'btn btn-audio';
      btnAudio.textContent = '🔊';
      btnAudio.setAttribute('aria-label', App.i18n.t('escucharCategoria').replace('{categoria}', categoria));
      btnAudio.addEventListener('click', function () { if (false && App.tts && App.tts.speak) App.tts.speak(categoria); });

      row.appendChild(btn);
      row.appendChild(btnAudio);
      cajasSEl.appendChild(row);
    });

    pintarProgresoS();
    renderStars();
  }

  function mostrarExplicacionS(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.categoria + '.';
    explicacionSEl.textContent = text;
    explicacionSWrap.classList.remove('hidden');
  }

  function responderSecciones(btn, isCorrect, item) {
    if (resueltoS) return;
    if (isCorrect) {
      mostrarExplicacionS(isCorrect, item);
      resueltoS = true;
      btn.classList.add('correcta');
      App.utils.$$('.caja', cajasSEl).forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackSEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      renderStars();
      if (btnSiguienteS) {
        btnSiguienteS.classList.remove('hidden');
        btnSiguienteS.focus();
      }
    } else {
      intentosS += 1;
      if (intentosS === 1) {
        explicacionSEl.textContent = App.i18n.t('pista');
        explicacionSWrap.classList.remove('hidden');
      } else {
        mostrarExplicacionS(isCorrect, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackSEl);
      App.feedback.lockUntilAck(App.utils.$$('.caja', cajasSEl), explicacionSWrap);
    }
  }

  function siguienteSecciones() {
    idxS += 1;
    if (idxS >= banco().secciones.porRonda) {
      terminarSecciones();
    } else {
      renderSecciones();
    }
  }

  function terminarSecciones() {
    progress.roundsCompletedSecciones += 1;
    save();
    ocultarTodas();
    endScreen.classList.remove('hidden');
    $('##resumenFinal').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompletedSecciones + 1, banco().secciones.niveles.length));
    $('##transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ================= Activity 2: mi lista de la compra ================= */
  var nivelL = null;
  var itemsL = [];
  var idxL = 0;
  var resueltoL = false;
  var intentosL = 0;
  var listasEl = {};

  var itemPictoLEl = $('#itemPictoLista');
  var itemPalabraLEl = $('#itemPalabraLista');
  var listasDiaEl = $('#listasDia');
  var feedbackLEl = $('#feedbackLista');
  var explicacionLWrap = $('#explanationListaWrap');
  var explicacionLEl = $('#explanationLista');
  var progressLFill = $('#progressListaFill');
  var progressLText = $('#progressListaText');
  var btnSiguienteL = $('#btnSiguienteLista');

  function nivelSegunProgresoL() {
    var niveles = banco().lista.niveles;
    var idx = Math.min(progress.roundsCompletedLista, niveles.length - 1);
    return niveles[idx];
  }

  function pintarColumnasVacias() {
    listasDiaEl.innerHTML = '';
    listasEl = {};
    banco().lista.momentos.forEach(function (timeOfDay) {
      var column = document.createElement('div');
      column.className = 'column-dia';

      var btnCaja = document.createElement('button');
      btnCaja.type = 'button';
      btnCaja.className = 'btn caja';
      btnCaja.textContent = timeOfDay;
      btnCaja.addEventListener('click', function () {
        responderLista(btnCaja, timeOfDay === itemsL[idxL].timeOfDay, itemsL[idxL]);
      });

      var btnAudio = document.createElement('button');
      btnAudio.type = 'button';
      btnAudio.className = 'btn btn-audio';
      btnAudio.textContent = '🔊';
      btnAudio.setAttribute('aria-label', App.i18n.t('escucharMomento').replace('{timeOfDay}', timeOfDay));
      btnAudio.addEventListener('click', function () { if (false && App.tts && App.tts.speak) App.tts.speak(timeOfDay); });

      var row = document.createElement('div');
      row.className = 'row-caja';
      row.appendChild(btnCaja);
      row.appendChild(btnAudio);

      var lista = document.createElement('ul');
      lista.className = 'tasks-list';

      column.appendChild(row);
      column.appendChild(lista);
      listasDiaEl.appendChild(column);
      listasEl[timeOfDay] = { lista: lista, boton: btnCaja };
    });
  }

  function iniciarLista() {
    nivelL = nivelSegunProgresoL();
    itemsL = App.utils.shuffle(nivelL.items).slice(0, banco().lista.porRonda);
    idxL = 0;
    resueltoL = false;
    ocultarTodas();
    pantallaJuegoLista.classList.remove('hidden');
    pintarColumnasVacias();
    renderLista();
  }

  function pintarProgresoL() {
    var porRonda = banco().lista.porRonda;
    progressLFill.style.width = ((idxL / porRonda) * 100) + '%';
    progressLText.textContent = '';
  }

  function renderLista() {
    var item = itemsL[idxL];
    resueltoL = false;
    intentosL = 0;
    feedbackLEl.textContent = '';
    feedbackLEl.className = 'feedback';
    explicacionLWrap.classList.add('hidden');
    explicacionLEl.textContent = '';
    if (btnSiguienteL) btnSiguienteL.classList.add('hidden');

    itemPictoLEl.textContent = item.picto;
    itemPalabraLEl.textContent = item.palabra;
    App.utils.$$('.btn.caja', listasDiaEl).forEach(function (b) {
      b.disabled = false;
      b.classList.remove('animo', 'correcta');
    });

    if (false && App.tts && App.tts.speak) App.tts.speak(item.palabra);
    pintarProgresoL();
    renderStars();
  }

  function mostrarExplicacionL(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.timeOfDay + '.';
    explicacionLEl.textContent = text;
    explicacionLWrap.classList.remove('hidden');
  }

  function anadirALista(item) {
    var destino = listasEl[item.timeOfDay];
    var li = document.createElement('li');
    li.textContent = item.picto + ' ' + item.palabra;
    destino.lista.appendChild(li);
  }

  function responderLista(btn, isCorrect, item) {
    if (resueltoL) return;
    if (isCorrect) {
      mostrarExplicacionL(isCorrect, item);
      resueltoL = true;
      anadirALista(item);
      App.utils.$$('.btn.caja', listasDiaEl).forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackLEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      renderStars();
      if (btnSiguienteL) {
        btnSiguienteL.classList.remove('hidden');
        btnSiguienteL.focus();
      }
    } else {
      intentosL += 1;
      if (intentosL === 1) {
        explicacionLEl.textContent = App.i18n.t('pista');
        explicacionLWrap.classList.remove('hidden');
      } else {
        mostrarExplicacionL(isCorrect, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackLEl);
      App.feedback.lockUntilAck(App.utils.$$('.btn.caja', listasDiaEl), explicacionLWrap);
    }
  }

  function siguienteLista() {
    idxL += 1;
    if (idxL >= banco().lista.porRonda) {
      terminarLista();
    } else {
      renderLista();
    }
  }

  function terminarLista() {
    progress.roundsCompletedLista += 1;
    save();
    ocultarTodas();
    endScreen.classList.remove('hidden');
    $('##resumenFinal').textContent = '';
    $('#resumenFinal').textContent = App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompletedLista + 1, banco().lista.niveles.length));
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  // Start screen: two sub-activity cards
  $('#tarjetaSecciones').addEventListener('click', iniciarSecciones);
  $('#tarjetaLista').addEventListener('click', iniciarLista);

  if (btnSiguienteS) btnSiguienteS.addEventListener('click', siguienteSecciones);
  if (btnSiguienteL) btnSiguienteL.addEventListener('click', siguienteLista);

  $('#btnRepeat').addEventListener('click', function () {
    // repeats the last activity
    if (actividadActual === 'secciones') iniciarSecciones();
    else iniciarLista();
  });

  $('#btnMenu').addEventListener('click', function () {
    ocultarTodas();
    startScreen.classList.remove('hidden');
    renderStars();
  });

  var actividadActual = null;

  renderStars();
  startScreen.classList.remove('hidden');
})();
