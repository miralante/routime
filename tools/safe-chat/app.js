/* ============================================================
   Routime — Chat Seguro (autonomía: seguridad en internet)
   Simulador de chats para practicar cómo answer a personas
   que intentan engañar (fotos, datos, contraseñas, secretos…).
   El error nunca se castiga: se explica el peligro con un consejo
   y se vuelve a select. Cada chat termina bloqueando al contacto.
   Datos en data.js. Módulos compartidos en assets/js/.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'chat-seguro';
  var $ = App.utils.$;
  var $$ = App.utils.$$;
  var PANTALLAS = ['menuScreen', 'pantallaNormas', 'pantallaChat'];
  var DELAY = App.utils.reducedMotion() ? 0 : 700;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};

  /* Chat en curso */
  var escenario = null;
  var idx = 0;
  var attempts = 0;   /* Socratic counter per option (rule 12) */

  function save() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { $('#stars').textContent = '⭐ ' + progress.stars; }

  function showScreen(id) {
    PANTALLAS.forEach(function (p) {
      document.getElementById(p).classList.toggle('hidden', p !== id);
    });
  }

  /* ---------- Menu ---------- */
  function renderMenu() {
    var cont = $('#listaChats');
    cont.innerHTML = '';
    DATOS.escenarios.forEach(function (esc) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tarjeta-chat';
      var done = progress.completed[esc.id] ? '⭐' : '';
      b.innerHTML =
        '<span class="picto" aria-hidden="true">' + esc.picto + '</span>' +
        '<span class="name">' + esc.titulo + '</span>' +
        '<span class="done">' + done + '</span>';
      b.addEventListener('click', function () { abrirChat(esc); });
      cont.appendChild(b);
    });
    renderStars();
  }

  function irMenu() {
    escenario = null;
    renderMenu();
    showScreen('menuScreen');
  }

  /* ---------- Normas ---------- */
  function pintarNormas() {
    var cont = $('#listaNormas');
    cont.innerHTML = '';
    DATOS.normas.forEach(function (n) {
      var row = document.createElement('div');
      row.className = 'norma';
      var text = document.createElement('p');
      text.textContent = n.picto + ' ' + n.text;
      row.appendChild(text);
      cont.appendChild(row);
    });
  }

  /* ---------- Chat: burbujas ---------- */
  function burbuja(quien, text) {
    var row = document.createElement('div');
    row.className = 'burbuja-row ' + quien;
    var b = document.createElement('div');
    b.className = 'burbuja ' + quien;
    b.textContent = text;
    row.appendChild(b);
    $('#chatMensajes').appendChild(row);
    row.scrollIntoView({ block: 'nearest' });
  }

  function limpiarZonaRespuesta() {
    $('#chatOpciones').innerHTML = '';
    $('#chatPregunta').classList.add('hidden');
    $('#consejo').classList.add('hidden');
    $('#consejoSeguro').classList.add('hidden');
    var f = $('#feedback');
    f.textContent = '';
    f.className = 'feedback';
  }

  /* ---------- Chat: motor de steps ---------- */
  function abrirChat(esc) {
    /* Each menu card is a topic group with several variants
       (cases); ONE is played at random so the script isn't memorized.
       The star (progress.completed) is still tracked per group. */
    var v = esc.variantes[Math.floor(Math.random() * esc.variantes.length)];
    escenario = { id: esc.id, contacto: v.contacto, steps: v.steps, regla: v.regla };
    idx = 0;
    $('#chatAlias').textContent = v.contacto;
    $('#chatMensajes').innerHTML = '';
    $('#reglaFinal').classList.add('hidden');
    limpiarZonaRespuesta();
    showScreen('pantallaChat');
    nextStep();
  }

  function nextStep() {
    if (!escenario) return;
    if (idx >= escenario.steps.length) {
      terminarChat();
      return;
    }
    var paso = escenario.steps[idx];
    idx += 1;
    if (paso.tipo === 'msg') {
      setTimeout(function () {
        if (!escenario) return;
        burbuja('ellos', paso.text);
        nextStep();
      }, DELAY);
    } else if (paso.tipo === 'eleccion') {
      pintarEleccion(paso);
    } else if (paso.tipo === 'accion') {
      pintarAccion(paso);
    }
  }

  function pintarEleccion(paso) {
    limpiarZonaRespuesta();
    attempts = 0;
    $('#chatPregunta').classList.remove('hidden');
    var cont = $('#chatOpciones');
    App.utils.shuffle(paso.options).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.text;
      btn.addEventListener('click', function () { answer(btn, op); });
      cont.appendChild(btn);
    });
  }

  function answer(btn, op) {
    if (op.segura) {
      $$('#chatOpciones .btn-opcion').forEach(function (b) { b.disabled = true; });
      btn.classList.add('correcta');
      App.feedback.success($('#feedback'));
      burbuja('yo', op.text);
      if (op.avisoSeguro) {
        $('#consejoSeguroTexto').textContent = op.avisoSeguro;
        $('#consejoSeguro').classList.remove('hidden');
      }
      setTimeout(function () {
        limpiarZonaRespuesta();
        nextStep();
      }, DELAY + 2600);
    } else {
      attempts += 1;
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage($('#feedback'));
      $('#consejoTexto').textContent = op.pista || op.aviso || App.i18n.t('pista');
      $('#consejo').classList.remove('hidden');
      App.feedback.lockUntilAck($('#chatOpciones .btn-opcion'), $('#consejo'));
    }
  }

  function pintarAccion(paso) {
    limpiarZonaRespuesta();
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-block';
    btn.textContent = paso.text;
    btn.addEventListener('click', function () {
      btn.disabled = true;
      burbuja('sistema', paso.confirmacion);
      App.feedback.success($('#feedback'));
      setTimeout(function () {
        limpiarZonaRespuesta();
        nextStep();
      }, DELAY + 500);
    });
    $('#chatOpciones').appendChild(btn);
    btn.focus();
  }

  function terminarChat() {
    var esc = escenario;
    if (!progress.completed[esc.id]) {
      progress.completed[esc.id] = true;
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      renderStars();
    }
    $('#reglaTexto').textContent = esc.regla;
    $('#reglaFinal').classList.remove('hidden');
    App.feedback.celebrate(App.i18n.t('chatSuperado'));
  }

  /* ---------- Eventos ---------- */
  var btnNormas = $('#btnNormas');
  if (btnNormas) btnNormas.addEventListener('click', function () {
    pintarNormas();
    showScreen('pantallaNormas');
  });
  var btnVolverDeNormas = $('#btnVolverDeNormas');
  if (btnVolverDeNormas) btnVolverDeNormas.addEventListener('click', irMenu);
  var btnSalirChat = $('#btnSalirChat');
  if (btnSalirChat) btnSalirChat.addEventListener('click', irMenu);
  var btnBackToMenu = $('#btnBackToMenu');
  if (btnBackToMenu) btnBackToMenu.addEventListener('click', irMenu);
  /* ---------- Arranque ---------- */
  renderMenu();
})();

