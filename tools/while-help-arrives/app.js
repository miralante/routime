/* ============================================================
   Routime — Mientras Llega la Ayuda (autonomía: qué hacer
   después de llamar al 112, mientras llega la ambulancia /
   bomberos / policía).
   Datos en data.js (DATA.queHago, DATA.pasos). Dos actividades
   elegibles desde un menú (regla 10: una acción principal por
   pantalla):
   - "¿Qué hago ahora?": quiz de 3 opciones (motor de Situations)
     sobre acciones seguras mientras se espera — la correcta
     siempre es lo que se enseña en primeros auxilios básicos
     (salir, no mover, presionar, posición lateral, no dar nada
     por boca, no provocar vómito). El error NUNCA se castiga.
   - "Ordena los pasos": motor de task-list con 3 acciones
     inmediatas para una emergencia concreta. La estructura cambia
     con cada emergencia para que se APRENDA a secuenciar, no un
     guion fijo.
   Sin niveles (regla 13 no aplica: cada ronda ya mezcla dificultad
   a propósito, como contraste didáctico, no como progresión).
   Pista socrática en el primer fallo (regla 12).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'while-help-arrives';
  var $ = App.utils.$;

  var pantallaMenu = $('#pantallaMenu');
  var pantallaQueHago = $('#pantallaQueHago');
  var pantallaOrdenar = $('#pantallaOrdenar');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completadoQueHago) progress.completadoQueHago = 0;
  if (!progress.completadoOrdenar) progress.completadoOrdenar = 0;

  var actividadActual = null; /* 'queHago' | 'ordenar' */

  function guardar() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function ocultarTodas() {
    [pantallaMenu, pantallaQueHago, pantallaOrdenar, endScreen].forEach(function (p) {
      p.classList.add('hidden');
    });
  }

  function irMenu() {
    ocultarTodas();
    pintarMenu();
    pantallaMenu.classList.remove('hidden');
  }

  function pintarMenu() {
    $('#marcaQueHago').textContent = '';
    $('#marcaOrdenar').textContent = '';
    renderStars();
  }

  /* ================= Actividad 1: ¿Qué hago ahora? ================= */
  var itemsQueHago = [];
  var idxQ = 0;
  var aciertosQ = 0;
  var resueltoQ = false;
  var intentosQ = 0;

  var situacionPictoEl = $('#situacionPicto');
  var situacionTextoEl = $('#situacionTexto');
  var opcionesQEl = $('#opcionesQueHago');
  var feedbackQEl = $('#feedbackQueHago');
  var explicacionQWrap = $('#explicacionQueHagoWrap');
  var explicacionQEl = $('#explicacionQueHago');
  var progressQFill = $('#progressQueHagoFill');
  var progressQText = $('#progressQueHagoText');
  var btnSiguienteQ = $('#btnSiguienteQueHago');

  function iniciarQueHago() {
    actividadActual = 'queHago';
    itemsQueHago = App.utils.shuffle(banco().queHago).slice(0, banco().porRonda);
    idxQ = 0;
    aciertosQ = 0;
    ocultarTodas();
    pantallaQueHago.classList.remove('hidden');
    renderQueHago();
  }

  function pintarProgresoQ() {
    var porRonda = banco().porRonda;
    progressQFill.style.width = ((idxQ / porRonda) * 100) + '%';
    progressQText.textContent = '';
  }

  function renderQueHago() {
    var item = itemsQueHago[idxQ];
    resueltoQ = false;
    intentosQ = 0;
    situacionPictoEl.textContent = item.picto;
    situacionTextoEl.textContent = item.situacion;
    feedbackQEl.textContent = '';
    feedbackQEl.className = 'feedback';
    explicacionQWrap.classList.add('hidden');
    explicacionQEl.textContent = '';
    btnSiguienteQ.classList.add('hidden');
    opcionesQEl.innerHTML = '';

    var opciones = App.utils.shuffle(item.opciones.map(function (opt, i) {
      return { texto: opt, isCorrect: i === item.correcta };
    }));
    opciones.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { responderQueHago(btn, op.isCorrect, item); });
      opcionesQEl.appendChild(btn);
    });

    pintarProgresoQ();
    renderStars();
  }

  function mostrarExplicacionQ(isCorrect, item) {
    var texto = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.opciones[item.correcta] + '.';
    explicacionQEl.textContent = texto;
    explicacionQWrap.classList.remove('hidden');
  }

  function responderQueHago(btn, isCorrect, item) {
    if (resueltoQ) return;
    if (isCorrect) {
      mostrarExplicacionQ(isCorrect, item);
      resueltoQ = true;
      btn.classList.add('correcta');
      App.utils.$('#opcionesQueHago .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackQEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      aciertosQ += 1;
      guardar();
      renderStars();
      btnSiguienteQ.classList.remove('hidden');
      btnSiguienteQ.focus();
    } else {
      intentosQ += 1;
      if (intentosQ === 1) {
        explicacionQEl.textContent = App.i18n.t('pista') + '"' + item.situacion + '"';
        explicacionQWrap.classList.remove('hidden');
      } else {
        mostrarExplicacionQ(isCorrect, item);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackQEl);
      App.feedback.lockUntilAck(App.utils.$('#opcionesQueHago .btn-opcion'), explicacionQWrap);
    }
  }

  function siguienteQueHago() {
    idxQ += 1;
    if (idxQ >= banco().porRonda) {
      terminarQueHago();
    } else {
      renderQueHago();
    }
  }

  function terminarQueHago() {
    progress.completadoQueHago += 1;
    guardar();
    ocultarTodas();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ================= Actividad 2: ordena los pasos ================= */
  var listasOrdenar = [];
  var idxO = 0;
  var aciertosO = 0;
  var siguienteEsperadoO = 0;
  var slotsO = [];

  var listaTituloEl = $('#listaTitulo');
  var secuenciaEl = $('#secuencia');
  var disponiblesEl = $('#disponibles');
  var feedbackOEl = $('#feedbackOrdenar');
  var progressOFill = $('#progressOrdenarFill');
  var progressOText = $('#progressOrdenarText');

  function iniciarOrdenar() {
    actividadActual = 'ordenar';
    listasOrdenar = App.utils.shuffle(banco().pasos);
    idxO = 0;
    aciertosO = 0;
    ocultarTodas();
    pantallaOrdenar.classList.remove('hidden');
    renderOrdenar();
  }

  function pintarProgresoO() {
    var total = listasOrdenar.length;
    progressOFill.style.width = ((idxO / total) * 100) + '%';
    progressOText.textContent = '';
  }

  function renderOrdenar() {
    var lista = listasOrdenar[idxO];
    siguienteEsperadoO = 0;
    slotsO = new Array(lista.items.length).fill(null);
    feedbackOEl.textContent = '';
    feedbackOEl.className = 'feedback';
    listaTituloEl.textContent = lista.nombre;

    pintarSlotsO();

    disponiblesEl.innerHTML = '';
    App.utils.shuffle(lista.items.map(function (item, orden) {
      return { item: item, orden: orden };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn tarea-btn';
      btn.innerHTML = '<span class="tarea-picto" aria-hidden="true">' + p.item.picto + '</span>' +
        '<span class="tarea-texto">' + p.item.texto + '</span>';
      btn.setAttribute('aria-label', App.i18n.t('ariaPaso') + ': ' + p.item.texto);
      btn.addEventListener('click', function () { tocarO(p.orden, btn); });
      disponiblesEl.appendChild(btn);
    });

    pintarProgresoO();
    renderStars();
  }

  function pintarSlotsO() {
    secuenciaEl.innerHTML = '';
    slotsO.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'slot' + (item ? ' lleno' : '');
      if (item) {
        div.innerHTML = '<span class="tarea-picto" aria-hidden="true">' + item.picto + '</span>' +
          '<span class="tarea-texto">' + item.texto + '</span>';
      } else {
        div.textContent = String(i + 1);
      }
      secuenciaEl.appendChild(div);
    });
  }

  function tocarO(orden, btn) {
    var lista = listasOrdenar[idxO];
    if (orden === siguienteEsperadoO) {
      slotsO[orden] = lista.items[orden];
      pintarSlotsO();
      btn.disabled = true;
      btn.classList.add('colocada');
      App.feedback.success(feedbackOEl);
      siguienteEsperadoO += 1;
      if (siguienteEsperadoO >= lista.items.length) {
        terminarTareaO();
      }
    } else {
      App.feedback.encourage(feedbackOEl);
    }
  }

  function terminarTareaO() {
    progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    aciertosO += 1;
    guardar();
    renderStars();
    idxO += 1;
    if (idxO >= listasOrdenar.length) {
      setTimeout(terminarOrdenar, 900);
    } else {
      setTimeout(renderOrdenar, 900);
    }
  }

  function terminarOrdenar() {
    progress.completadoOrdenar += 1;
    guardar();
    ocultarTodas();
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#tarjetaQueHago').addEventListener('click', iniciarQueHago);
  $('#tarjetaOrdenar').addEventListener('click', iniciarOrdenar);
  $('#btnVolverQueHago').addEventListener('click', irMenu);
  $('#btnVolverOrdenar').addEventListener('click', irMenu);
  btnSiguienteQ.addEventListener('click', siguienteQueHago);
  $('#btnEscucharExplicacionQueHago').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(explicacionQEl.textContent);
  });
  $('#btnEscucharQueHago').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(itemsQueHago[idxQ].situacion);
  });
  $('#btnRepeat').addEventListener('click', function () {
    if (actividadActual === 'queHago') iniciarQueHago();
    else iniciarOrdenar();
  });
  $('#btnVolverMenuFinal').addEventListener('click', irMenu);


  irMenu();
})();
