/* ============================================================
   Routime — Alerta Phishing (autonomía: seguridad digital)
   Simulador de correos y mensajes para practicar cómo
   detectar phishing, enlaces sospechosos y archivos adjuntos
   peligrosos.
   El error nunca se castiga: se explica el peligro con un consejo
   y se vuelve a seleccionar. Cada caso termina con una acción
   segura.
   Datos en data.js. Módulos compartidos en assets/js/.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'phishing-alert';
  var $ = App.utils.$;
  var $$ = App.utils.$$;
  var SCREENS = ['menuScreen', 'pantallaNormas', 'pantallaChat'];
  var DELAY = App.utils.reducedMotion() ? 0 : 700;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;
  /* Icono y etiqueta de cada tipo de conversación (la etiqueta va en strings). */
  var types = {
    correo: { icono: '📧', etiqueta: 'tipoCorreo' },
    mensaje: { icono: '💬', etiqueta: 'tipoMensaje' }
  };

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};

  /* Chat en curso */
  var scenario = null;
  var idx = 0;
  var attempts = 0;

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return $('#stars'); }
  });
  var save = glue.save, renderStars = glue.paintStars;

  function showScreen(id) {
    SCREENS.forEach(function (p) {
      document.getElementById(p).classList.toggle('hidden', p !== id);
    });
  }

  /* ---------- Menu ---------- */
  function renderMenu() {
    var cont = $('#listaChats');
    cont.innerHTML = '';
    /* "My rules" is the first card, in place of a button below the list */
    var rules = document.createElement('button');
    rules.type = 'button';
    rules.className = 'tarjeta-chat';
    rules.innerHTML =
      '<span class="picto" aria-hidden="true">📜</span>' +
      '<span class="name">' + App.i18n.t('normasTitulo') + '</span>' +
      '<span class="done"></span>';
    rules.addEventListener('click', function () {
      paintRules();
      showScreen('pantallaNormas');
    });
    cont.appendChild(rules);
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
    scenario = null;
    renderMenu();
    showScreen('menuScreen');
  }

  /* ---------- Normas ---------- */
  function paintRules() {
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

  function clearZoneAnswer() {
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
       (cases); ONE is played at random so the script is not memorized.
       The star (progress.completed) is still tracked per group. */
    var v = esc.variantes[Math.floor(Math.random() * esc.variantes.length)];
    scenario = { id: esc.id, contacto: v.contacto, tipo: v.tipo, steps: v.steps, regla: v.regla };
    idx = 0;
    $('#chatAlias').textContent = v.contacto;
    var tipo = types[v.tipo] || types.mensaje;
    $('#chatAvatar').textContent = tipo.icono;
    $('#chatTipo').textContent = tipo.icono + ' ' + App.i18n.t(tipo.etiqueta);
    $('#chatMensajes').innerHTML = '';
    $('#reglaFinal').classList.add('hidden');
    clearZoneAnswer();
    showScreen('pantallaChat');
    nextStep();
  }

  function nextStep() {
    if (!scenario) return;
    if (idx >= scenario.steps.length) {
      finishChat();
      return;
    }
    var step = scenario.steps[idx];
    idx += 1;
    if (step.tipo === 'msg') {
      setTimeout(function () {
        if (!scenario) return;
        burbuja('ellos', step.text);
        nextStep();
      }, DELAY);
    } else if (step.tipo === 'eleccion') {
      paintChoice(step);
    } else if (step.tipo === 'accion') {
      paintAction(step);
    }
  }

  function paintChoice(step) {
    clearZoneAnswer();
    attempts = 0;
    $('#chatPregunta').classList.remove('hidden');
    var cont = $('#chatOpciones');
    App.utils.shuffle(step.options).forEach(function (op) {
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
        clearZoneAnswer();
        nextStep();
      }, DELAY + 2600);
    } else {
      attempts += 1;
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage($('#feedback'));
      /* Socratic: the first mistake gets a hint; the second explains the danger. */
      $('#consejoTexto').textContent = attempts > 1
        ? (op.aviso || op.pista || App.i18n.t('pista'))
        : (op.pista || op.aviso || App.i18n.t('pista'));
      $('#consejo').classList.remove('hidden');
      App.feedback.lockUntilAck($$('#chatOpciones .btn-opcion'), $('#consejo'));
    }
  }

  function paintAction(step) {
    clearZoneAnswer();
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-block';
    btn.textContent = step.text;
    btn.addEventListener('click', function () {
      btn.disabled = true;
      burbuja('sistema', step.confirmacion);
      App.feedback.success($('#feedback'));
      setTimeout(function () {
        clearZoneAnswer();
        nextStep();
      }, DELAY + 500);
    });
    $('#chatOpciones').appendChild(btn);
    btn.focus();
  }

  function finishChat() {
    var esc = scenario;
    if (!progress.completed[esc.id]) {
      progress.completed[esc.id] = true;
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      renderStars();
    }
    $('#reglaTexto').textContent = esc.regla;
    $('#notaSegura').textContent = App.i18n.t('safetyNote');
    $('#reglaFinal').classList.remove('hidden');
    App.feedback.celebrate(App.i18n.t('chatSuperado'));
  }

  /* ---------- Eventos ---------- */
  var btnBackOfRules = $('#btnVolverDeNormas');
  if (btnBackOfRules) btnBackOfRules.addEventListener('click', irMenu);
  var btnSalirChat = $('#btnSalirChat');
  if (btnSalirChat) btnSalirChat.addEventListener('click', irMenu);
  var btnBackToMenu = $('#btnBackToMenu');
  if (btnBackToMenu) btnBackToMenu.addEventListener('click', irMenu);

  /* ---------- Arranque ---------- */
  renderMenu();
})();
