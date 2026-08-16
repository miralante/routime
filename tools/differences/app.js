/* ============================================================
   Routime — Diferencias (memoria y atención / percepción)
   Datos en data.js (DATA.escenas). Módulos compartidos en assets/js/.
   Mecánica: dos rejillas iguales salvo unas pocas celdas.
   Tocar en la rejilla derecha lo que es distinto. Sin límite de
   tiempo ni de intentos. Tras 3 toques fallidos, ayuda visual.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'diferencias';
  var CELDAS = 16;
  var FALLOS_PARA_AYUDA = 3;
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var escenaTituloEl = $('#escenaTitulo');
  var rejillaIzqEl = $('#rejillaIzquierda');
  var rejillaDerEl = $('#rejillaDerecha');
  var contadorEl = $('#contador');
  var feedbackEl = $('#feedback');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (typeof progreso.rondas !== 'number') progreso.rondas = 0;

  /* Round state */
  var escenas = [];
  var escenaIdx = 0;
  var porRonda = 3;
  var diferenciasMapa = {};   /* celda -> pictoDerecha */
  var encontradas = {};       /* celda -> true */
  var totalDiferencias = 0;
  var fallosSeguidos = 0;
  var ayudaTimeout = null;
  var aciertosRonda = 0;

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function empezarRonda() {
    var banco = DATA[App.i18n.locale()] || DATA.es;
    escenas = App.utils.shuffle(banco.escenas).slice(0, banco.porRonda);
    porRonda = banco.porRonda;
    escenaIdx = 0;
    aciertosRonda = 0;
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    pintarEscena();
  }

  function pintarProgresoGlobal() {
    progressFill.style.width = ((escenaIdx / porRonda) * 100) + '%';
    progressText.textContent = App.i18n.t('progresoEscena')
      .replace('{n}', escenaIdx + 1).replace('{total}', porRonda);
  }

  function crearRejilla(contenedor) {
    contenedor.innerHTML = '';
    var celdas = [];
    for (var i = 0; i < CELDAS; i++) {
      var div = document.createElement('div');
      div.className = 'celda';
      contenedor.appendChild(div);
      celdas.push(div);
    }
    return celdas;
  }

  function pintarEscena() {
    if (ayudaTimeout) { clearTimeout(ayudaTimeout); ayudaTimeout = null; }
    var escena = escenas[escenaIdx];
    escenaTituloEl.textContent = App.i18n.t(escena.nombreKey);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnSiguiente.classList.add('oculto');
    fallosSeguidos = 0;
    encontradas = {};
    diferenciasMapa = {};
    escena.diferencias.forEach(function (d) { diferenciasMapa[d.celda] = d.pictoDerecha; });
    totalDiferencias = escena.diferencias.length;

    var celdasIzq = crearRejilla(rejillaIzqEl);
    var celdasDer = crearRejilla(rejillaDerEl);

    escena.objetos.forEach(function (obj) {
      celdasIzq[obj.celda].textContent = obj.picto;
      celdasIzq[obj.celda].setAttribute('aria-hidden', 'true');

      var picto = diferenciasMapa.hasOwnProperty(obj.celda) ? diferenciasMapa[obj.celda] : obj.picto;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'objeto-btn';
      btn.textContent = picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaDibujo'));
      btn.dataset.celda = obj.celda;
      btn.addEventListener('click', function () { tocar(obj.celda, btn); });
      celdasDer[obj.celda].appendChild(btn);
    });

    pintarProgresoGlobal();
    pintarContadorDiferencias();
    pintarEstrellas();
  }

  function pintarContadorDiferencias() {
    var n = Object.keys(encontradas).length;
    contadorEl.textContent = App.i18n.t('contador')
      .replace('{n}', n).replace('{total}', totalDiferencias);
  }

  function tocar(celda, btn) {
    if (encontradas[celda]) return;

    if (diferenciasMapa.hasOwnProperty(celda)) {
      encontradas[celda] = true;
      btn.classList.add('encontrada');
      btn.disabled = true;
      fallosSeguidos = 0;
      App.feedback.success(feedbackEl);
      progreso.estrellas += 1;
      aciertosRonda += 1;
      guardar();
      pintarEstrellas();
      pintarContadorDiferencias();
      if (Object.keys(encontradas).length >= totalDiferencias) {
        terminarEscena();
      }
    } else {
      fallosSeguidos += 1;
      App.feedback.encourage(feedbackEl);
      if (fallosSeguidos >= FALLOS_PARA_AYUDA) {
        mostrarAyuda();
        fallosSeguidos = 0;
      }
    }
  }

  /* Ayuda sin castigo: parpadeo suave en una diferencia sin encontrar */
  function mostrarAyuda() {
    var pendientes = Object.keys(diferenciasMapa).filter(function (celda) {
      return !encontradas[celda];
    });
    if (!pendientes.length) return;
    var celda = pendientes[Math.floor(Math.random() * pendientes.length)];
    var btn = rejillaDerEl.querySelector('[data-celda="' + celda + '"]');
    if (!btn) return;
    btn.classList.add('ayuda');
    if (ayudaTimeout) clearTimeout(ayudaTimeout);
    ayudaTimeout = setTimeout(function () { btn.classList.remove('ayuda'); }, 2500);
  }

  function terminarEscena() {
    btnSiguiente.classList.remove('oculto');
    if (escenaIdx >= porRonda - 1) {
      btnSiguiente.textContent = App.i18n.t('verResultado');
    } else {
      btnSiguiente.textContent = App.i18n.t('siguienteEscena');
    }
    btnSiguiente.focus();
  }

  function siguienteEscena() {
    escenaIdx += 1;
    if (escenaIdx >= porRonda) {
      terminarRonda();
    } else {
      pintarEscena();
    }
  }

  function terminarRonda() {
    progreso.rondas += 1;
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda).replace('{total}', progreso.estrellas);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('rondaCompletadaTitulo'));
  }

  /* Events */
  btnSiguiente.addEventListener('click', siguienteEscena);
  $('#btnEmpezar').addEventListener('click', empezarRonda);
  $('#btnRepetir').addEventListener('click', empezarRonda);

  pintarEstrellas();
})();

