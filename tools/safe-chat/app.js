/* ============================================================
   Routime — Chat Seguro (autonomía: seguridad en internet)
   Simulador de chats para practicar cómo responder a personas
   que intentan engañar (fotos, datos, contraseñas, secretos…).
   El error nunca se castiga: se explica el peligro con un consejo
   y se vuelve a elegir. Cada chat termina bloqueando al contacto.
   Datos en data.js. Módulos compartidos en assets/js/.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'chat-seguro';
  var $ = App.utils.$;
  var $$ = App.utils.$$;
  var PANTALLAS = ['pantallaMenu', 'pantallaNormas', 'pantallaChat'];
  var DELAY = App.utils.reducedMotion() ? 0 : 700;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completado) progreso.completado = {};

  /* Chat en curso */
  var escenario = null;
  var idx = 0;
  var intentos = 0;   /* Socratic counter per option (rule 12) */

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { $('#stars').textContent = '⭐ ' + progreso.estrellas; }

  function mostrarPantalla(id) {
    PANTALLAS.forEach(function (p) {
      document.getElementById(p).classList.toggle('oculto', p !== id);
    });
  }

  /* ---------- Menu ---------- */
  function pintarMenu() {
    var cont = $('#listaChats');
    cont.innerHTML = '';
    DATOS.escenarios.forEach(function (esc) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tarjeta-chat';
      var hecho = progreso.completado[esc.id] ? '⭐' : '';
      b.innerHTML =
        '<span class="picto" aria-hidden="true">' + esc.picto + '</span>' +
        '<span class="nombre">' + esc.titulo + '</span>' +
        '<span class="hecho">' + hecho + '</span>';
      b.addEventListener('click', function () { abrirChat(esc); });
      cont.appendChild(b);
    });
    pintarEstrellas();
  }

  function irMenu() {
    App.tts.stop();
    escenario = null;
    pintarMenu();
    mostrarPantalla('pantallaMenu');
  }

  /* ---------- Normas ---------- */
  function pintarNormas() {
    var cont = $('#listaNormas');
    cont.innerHTML = '';
    DATOS.normas.forEach(function (n) {
      var fila = document.createElement('div');
      fila.className = 'norma';
      var texto = document.createElement('p');
      texto.textContent = n.picto + ' ' + n.texto;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-audio';
      btn.textContent = '🔊';
      btn.setAttribute('aria-label', App.i18n.t('ariaEscucharNorma'));
      btn.addEventListener('click', function () { App.tts.speak(n.texto); });
      fila.appendChild(texto);
      fila.appendChild(btn);
      cont.appendChild(fila);
    });
  }

  /* ---------- Chat: burbujas ---------- */
  function burbuja(quien, texto) {
    var fila = document.createElement('div');
    fila.className = 'burbuja-fila ' + quien;
    var b = document.createElement('div');
    b.className = 'burbuja ' + quien;
    b.textContent = texto;
    fila.appendChild(b);
    if (quien === 'ellos') {
      var audio = document.createElement('button');
      audio.type = 'button';
      audio.className = 'btn btn-audio btn-burbuja';
      audio.textContent = '🔊';
      audio.setAttribute('aria-label', App.i18n.t('ariaEscucharMensaje'));
      audio.addEventListener('click', function () { App.tts.speak(texto); });
      fila.appendChild(audio);
    }
    $('#chatMensajes').appendChild(fila);
    fila.scrollIntoView({ block: 'nearest' });
  }

  function limpiarZonaRespuesta() {
    $('#chatOpciones').innerHTML = '';
    $('#chatPregunta').classList.add('oculto');
    $('#consejo').classList.add('oculto');
    $('#consejoSeguro').classList.add('oculto');
    var f = $('#feedback');
    f.textContent = '';
    f.className = 'feedback';
  }

  /* ---------- Chat: motor de pasos ---------- */
  function abrirChat(esc) {
    /* Each menu card is a topic group with several variants
       (cases); ONE is played at random so the script isn't memorized.
       The star (progreso.completado) is still tracked per group. */
    var v = esc.variantes[Math.floor(Math.random() * esc.variantes.length)];
    escenario = { id: esc.id, contacto: v.contacto, pasos: v.pasos, regla: v.regla };
    idx = 0;
    $('#chatAlias').textContent = escenario.contacto;
    $('#chatMensajes').innerHTML = '';
    $('#reglaFinal').classList.add('oculto');
    limpiarZonaRespuesta();
    mostrarPantalla('pantallaChat');
    siguientePaso();
  }

  function siguientePaso() {
    if (!escenario) return;
    if (idx >= escenario.pasos.length) {
      terminarChat();
      return;
    }
    var paso = escenario.pasos[idx];
    idx += 1;
    if (paso.tipo === 'msg') {
      setTimeout(function () {
        if (!escenario) return;
        burbuja('ellos', paso.texto);
        siguientePaso();
      }, DELAY);
    } else if (paso.tipo === 'eleccion') {
      pintarEleccion(paso);
    } else if (paso.tipo === 'accion') {
      pintarAccion(paso);
    }
  }

  function pintarEleccion(paso) {
    limpiarZonaRespuesta();
    intentos = 0;
    $('#chatPregunta').classList.remove('oculto');
    var cont = $('#chatOpciones');
    App.utils.shuffle(paso.opciones).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { responder(btn, op); });
      cont.appendChild(btn);
    });
  }

  function responder(btn, op) {
    if (op.segura) {
      $$('#chatOpciones .btn-opcion').forEach(function (b) { b.disabled = true; });
      btn.classList.add('correcta');
      App.feedback.success($('#feedback'));
      burbuja('yo', op.texto);
      if (op.avisoSeguro) {
        $('#consejoSeguroTexto').textContent = op.avisoSeguro;
        $('#consejoSeguro').classList.remove('oculto');
      }
      setTimeout(function () {
        limpiarZonaRespuesta();
        siguientePaso();
      }, DELAY + 2600);
    } else {
      intentos += 1;
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage($('#feedback'));
      $('#consejoTexto').textContent = (intentos === 1 && op.pista) ? op.pista : op.aviso;
      $('#consejo').classList.remove('oculto');
      App.feedback.lockUntilAck($$('#chatOpciones .btn-opcion'), $('#consejo'));
    }
  }

  function pintarAccion(paso) {
    limpiarZonaRespuesta();
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-bloquear';
    btn.textContent = paso.texto;
    btn.addEventListener('click', function () {
      btn.disabled = true;
      burbuja('sistema', paso.confirmacion);
      App.feedback.success($('#feedback'));
      setTimeout(function () {
        limpiarZonaRespuesta();
        siguientePaso();
      }, DELAY + 500);
    });
    $('#chatOpciones').appendChild(btn);
    btn.focus();
  }

  function terminarChat() {
    var esc = escenario;
    if (!progreso.completado[esc.id]) {
      progreso.completado[esc.id] = true;
      progreso.estrellas += 1;
      guardar();
      pintarEstrellas();
    }
    $('#reglaTexto').textContent = esc.regla;
    $('#reglaFinal').classList.remove('oculto');
    App.feedback.celebrate(App.i18n.t('chatSuperado'));
$('#transferencia').textContent = App.i18n.t('transferencia');
  }

  /* ---------- Eventos ---------- */
  $('#btnNormas').addEventListener('click', function () {
    pintarNormas();
    mostrarPantalla('pantallaNormas');
  });
  $('#btnVolverDeNormas').addEventListener('click', irMenu);
  $('#btnSalirChat').addEventListener('click', irMenu);
  $('#btnVolverMenu').addEventListener('click', irMenu);
  $('#btnRegla').addEventListener('click', function () {
    App.tts.speak(App.i18n.t('paraRecordarHablado') + ' ' + $('#reglaTexto').textContent);
  });

  /* ---------- Arranque ---------- */
  pintarMenu();
})();

