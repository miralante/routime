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
  var SCREENS = ['menuScreen', 'pantallaNormas', 'pantallaChat'];
  var DELAY = App.utils.reducedMotion() ? 0 : 700;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  /* Persistent progress */
  var progress = App.storage.getWithStars(TOOL_ID);
  if (!progress.completed) progress.completed = {};

  /* Chat en curso */
  var scenario = null;
  var idx = 0;
  var attempts = 0;   /* Socratic counter per option (rule 12) */

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return $('#stars'); }
  });
  var save = glue.save, renderStars = glue.paintStars;

  function showScreen(id) {
    App.utils.showOnly(SCREENS, id);
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
       (cases); ONE is played at random so the script isn't memorized.
       The star (progress.completed) is still tracked per group. */
    var v = esc.variantes[Math.floor(Math.random() * esc.variantes.length)];
    scenario = { id: esc.id, contacto: v.contacto, steps: v.steps, regla: v.regla };
    idx = 0;
    $('#chatAlias').textContent = v.contacto;
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
      App.feedback.markCorrect(btn, $$('#chatOpciones .btn-opcion'));
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
      $('#consejoTexto').textContent = op.pista || op.aviso || App.i18n.t('pista');
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
    $('#reglaFinal').classList.remove('hidden');
    App.feedback.celebrate(App.i18n.t('chatSuperado'));
  }

  /* ---------- Eventos ---------- */
  var btnRules = $('#btnNormas');
  if (btnRules) btnRules.addEventListener('click', function () {
    paintRules();
    showScreen('pantallaNormas');
  });
  var btnBackOfRules = $('#btnVolverDeNormas');
  if (btnBackOfRules) btnBackOfRules.addEventListener('click', irMenu);
  var btnSalirChat = $('#btnSalirChat');
  if (btnSalirChat) btnSalirChat.addEventListener('click', irMenu);
  var btnBackToMenu = $('#btnBackToMenu');
  if (btnBackToMenu) btnBackToMenu.addEventListener('click', irMenu);
  /* ---------- Arranque ---------- */
  renderMenu();
})();

