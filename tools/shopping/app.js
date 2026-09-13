/* ============================================================
   Routime — La Compra (AVD instrumental: supermercado y lista
   de la compra)
   Datos en data.js (DATA.secciones, DATA.lista). Dos actividades
   elegibles desde un menú (regla 10: una acción principal por
   pantalla), cada una con sus propios niveles:
   - "¿En qué sección?": clon exacto del motor de ¿Dónde lo guardo?
     — producto → sección del súper (Frutería/Carnicería/Limpieza).
   - "Mi lista de la compra": clon exacto del motor de Partes del
     Día — producto → comida del día (Desayuno/Comida/Cena),
     acumulando una lista visual por caja durante toda la ronda.
   Cierra la cadena de AVD instrumental junto con El Monedero
   (pagar) y La Casa (cocinar/guardar). El error nunca se castiga.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'la-compra';
  var $ = App.utils.$;

  var pantallaMenu = $('#pantallaMenu');
  var pantallaNivelesSecciones = $('#pantallaNivelesSecciones');
  var pantallaJuegoSecciones = $('#pantallaJuegoSecciones');
  var pantallaNivelesLista = $('#pantallaNivelesLista');
  var pantallaJuegoLista = $('#pantallaJuegoLista');
  var pantallaFinal = $('#pantallaFinal');
  var starsEl = $('#stars');

  /* Progreso persistente (un contador de estrellas compartido; cada
     actividad guarda cuántas veces se ha completado cada nivel) */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completadosSecciones) progreso.completadosSecciones = {};
  if (!progreso.completadosLista) progreso.completadosLista = {};

  var actividadActual = null; /* 'secciones' | 'lista' */

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function ocultarTodas() {
    [pantallaMenu, pantallaNivelesSecciones, pantallaJuegoSecciones,
      pantallaNivelesLista, pantallaJuegoLista, pantallaFinal].forEach(function (p) {
      p.classList.add('oculto');
    });
  }

  function irMenu() {
    ocultarTodas();
    pintarEstrellas();
    pantallaMenu.classList.remove('oculto');
  }

  /* ================= Activity 1: Which section? ================= */
  var nivelS = null;
  var itemsS = [];
  var idxS = 0;
  var aciertosS = 0;
  var resueltoS = false;
  var intentosS = 0;

  var itemPictoSEl = $('#itemPictoSecciones');
  var itemPalabraSEl = $('#itemPalabraSecciones');
  var cajasSEl = $('#cajasSecciones');
  var feedbackSEl = $('#feedbackSecciones');
  var explicacionSWrap = $('#explicacionSeccionesWrap');
  var explicacionSEl = $('#explicacionSecciones');
  var progressSFill = $('#progressSeccionesFill');
  var progressSText = $('#progressSeccionesText');
  var btnSiguienteS = $('#btnSiguienteSecciones');

  function pintarNivelesSecciones() {
    var cont = $('#nivelesSecciones');
    cont.innerHTML = '';
    banco().secciones.niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completadosSecciones[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion ;

      btn.addEventListener('click', function () { iniciarSecciones(n); });
      cont.appendChild(btn);
    });
  }

  function irNivelesSecciones() {
    actividadActual = 'secciones';
    ocultarTodas();
    pintarNivelesSecciones();
    pantallaNivelesSecciones.classList.remove('oculto');
  }

  function iniciarSecciones(n) {
    nivelS = n;
    itemsS = App.utils.shuffle(nivelS.items).slice(0, banco().secciones.porRonda);
    idxS = 0;
    aciertosS = 0;
    ocultarTodas();
    pantallaJuegoSecciones.classList.remove('oculto');
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
    explicacionSWrap.classList.add('oculto');
    explicacionSEl.textContent = '';
    btnSiguienteS.classList.add('oculto');

    itemPictoSEl.textContent = item.picto;
    itemPalabraSEl.textContent = item.palabra;

    cajasSEl.innerHTML = '';
    App.utils.shuffle(nivelS.categorias).forEach(function (categoria) {
      var fila = document.createElement('div');
      fila.className = 'fila-caja';

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

      fila.appendChild(btn);
      fila.appendChild(btnAudio);
      cajasSEl.appendChild(fila);
    });


    pintarProgresoS();
    pintarEstrellas();
  }

  function mostrarExplicacionS(esCorrecta, item) {
    var texto = esCorrecta
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.categoria + '.';
    explicacionSEl.textContent = texto;
    explicacionSWrap.classList.remove('oculto');
  }

  function responderSecciones(btn, esCorrecta, item) {
    if (resueltoS) return;
    if (esCorrecta) {
      mostrarExplicacionS(esCorrecta, item);
      resueltoS = true;
      btn.classList.add('correcta');
      App.utils.$$('.caja', cajasSEl).forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackSEl);
      progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      aciertosS += 1;
      guardar();
      pintarEstrellas();
      btnSiguienteS.classList.remove('oculto');
      btnSiguienteS.focus();
    } else {
      intentosS += 1;
      if (intentosS === 1) {
        explicacionSEl.textContent = App.i18n.t('pista');
        explicacionSWrap.classList.remove('oculto');
      } else {
        mostrarExplicacionS(esCorrecta, item);
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
    progreso.completadosSecciones[nivelS.id] = (progreso.completadosSecciones[nivelS.id] || 0) + 1;
    guardar();
    ocultarTodas();
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
$('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ================= Actividad 2: mi lista de la compra ================= */
  var nivelL = null;
  var itemsL = [];
  var idxL = 0;
  var aciertosL = 0;
  var resueltoL = false;
  var intentosL = 0;
  var listasEl = {}; /* momento -> <ul> donde se acumulan los aciertos */

  var itemPictoLEl = $('#itemPictoLista');
  var itemPalabraLEl = $('#itemPalabraLista');
  var listasDiaEl = $('#listasDia');
  var feedbackLEl = $('#feedbackLista');
  var explicacionLWrap = $('#explicacionListaWrap');
  var explicacionLEl = $('#explicacionLista');
  var progressLFill = $('#progressListaFill');
  var progressLText = $('#progressListaText');
  var btnSiguienteL = $('#btnSiguienteLista');

  function pintarNivelesLista() {
    var cont = $('#nivelesLista');
    cont.innerHTML = '';
    banco().lista.niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso.completadosLista[n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion ;

      btn.addEventListener('click', function () { iniciarLista(n); });
      cont.appendChild(btn);
    });
  }

  function irNivelesLista() {
    actividadActual = 'lista';
    ocultarTodas();
    pintarNivelesLista();
    pantallaNivelesLista.classList.remove('oculto');
  }

  function pintarColumnasVacias() {
    listasDiaEl.innerHTML = '';
    listasEl = {};
    banco().lista.momentos.forEach(function (momento) {
      var columna = document.createElement('div');
      columna.className = 'columna-dia';

      var btnCaja = document.createElement('button');
      btnCaja.type = 'button';
      btnCaja.className = 'btn caja';
      btnCaja.textContent = momento;
      btnCaja.addEventListener('click', function () {
        responderLista(btnCaja, momento === itemsL[idxL].momento, itemsL[idxL]);
      });

      var btnAudio = document.createElement('button');
      btnAudio.type = 'button';
      btnAudio.className = 'btn btn-audio';
      btnAudio.textContent = '🔊';
      btnAudio.setAttribute('aria-label', App.i18n.t('escucharMomento').replace('{momento}', momento));
      btnAudio.addEventListener('click', function () { if (false && App.tts && App.tts.speak) App.tts.speak(momento); });

      var fila = document.createElement('div');
      fila.className = 'fila-caja';
      fila.appendChild(btnCaja);
      fila.appendChild(btnAudio);

      var lista = document.createElement('ul');
      lista.className = 'lista-tareas';

      columna.appendChild(fila);
      columna.appendChild(lista);
      listasDiaEl.appendChild(columna);
      listasEl[momento] = { lista: lista, boton: btnCaja };
    });
  }

  function iniciarLista(n) {
    nivelL = n;
    itemsL = App.utils.shuffle(nivelL.items).slice(0, banco().lista.porRonda);
    idxL = 0;
    aciertosL = 0;
    ocultarTodas();
    pantallaJuegoLista.classList.remove('oculto');
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
    explicacionLWrap.classList.add('oculto');
    explicacionLEl.textContent = '';
    btnSiguienteL.classList.add('oculto');

    itemPictoLEl.textContent = item.picto;
    itemPalabraLEl.textContent = item.palabra;
    App.utils.$$('.btn.caja', listasDiaEl).forEach(function (b) {
      b.disabled = false;
      b.classList.remove('animo', 'correcta');
    });

    if (false && App.tts && App.tts.speak) App.tts.speak(item.palabra);
    pintarProgresoL();
    pintarEstrellas();
  }

  function mostrarExplicacionL(esCorrecta, item) {
    var texto = esCorrecta
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.momento + '.';
    explicacionLEl.textContent = texto;
    explicacionLWrap.classList.remove('oculto');
  }

  function anadirALista(item) {
    var destino = listasEl[item.momento];
    var li = document.createElement('li');
    li.textContent = item.picto + ' ' + item.palabra;
    destino.lista.appendChild(li);
  }

  function responderLista(btn, esCorrecta, item) {
    if (resueltoL) return;
    if (esCorrecta) {
      mostrarExplicacionL(esCorrecta, item);
      resueltoL = true;
      anadirALista(item);
      App.utils.$$('.btn.caja', listasDiaEl).forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackLEl);
      progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      aciertosL += 1;
      guardar();
      pintarEstrellas();
      btnSiguienteL.classList.remove('oculto');
      btnSiguienteL.focus();
    } else {
      intentosL += 1;
      if (intentosL === 1) {
        explicacionLEl.textContent = App.i18n.t('pista');
        explicacionLWrap.classList.remove('oculto');
      } else {
        mostrarExplicacionL(esCorrecta, item);
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
    progreso.completadosLista[nivelL.id] = (progreso.completadosLista[nivelL.id] || 0) + 1;
    guardar();
    ocultarTodas();
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaSecciones').addEventListener('click', irNivelesSecciones);
  $('#tarjetaLista').addEventListener('click', irNivelesLista);
  $('#btnVolverMenuSecciones').addEventListener('click', irMenu);
  $('#btnVolverMenuLista').addEventListener('click', irMenu);
  btnSiguienteS.addEventListener('click', siguienteSecciones);
  btnSiguienteL.addEventListener('click', siguienteLista);
  $('#btnRepetir').addEventListener('click', function () {
    if (actividadActual === 'secciones') iniciarSecciones(nivelS);
    else iniciarLista(nivelL);
  });
  $('#btnOtroNivel').addEventListener('click', function () {
    if (actividadActual === 'secciones') irNivelesSecciones();
    else irNivelesLista();
  });
  $('#btnVolverMenuFinal').addEventListener('click', irMenu);

  irMenu();
})();

