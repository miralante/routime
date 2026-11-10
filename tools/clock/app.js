/* ============================================================
   Routime — El Reloj (autonomía: leer la hora).
   Cuatro mecánicas elegidas en la pantalla de inicio:
     - leer        Ver el reloj analógico → select la hora escrita.
     - poner       Leer la hora escrita → ajustar las agujas.
     - convertir   Emparejar reloj analógico con su hora digital
                   (y la inversa en la misma ronda).
     - situaciones Ver un timeOfDay del día → select el reloj.

   Datos en data.js (DATA.modos, DATA.niveles, DATA.momentos).
   Módulos compartidos en assets/js/. Textos en strings.<locale>.js.
   El error nunca se castiga: 2 attempts, pista socrática,
   respuesta correcta al segundo fallo, y la pregunta se repite
   al final (App.reinforce). Las estrellas solo suman.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'clock';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var screenLevels = $('#pantallaNiveles');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var zoneQuestionEl = $('#zonaPregunta');
  var textQuestionEl = $('#questionText');
  var optionsEl = $('#options');
  var feedbackEl = $('#feedback');
  var explanationWrap = $('#explanationWrap');
  var explanationEl = $('#explanation');
  var btnListen = $('#listenBtn');
  var btnNext = $('#btnNext');
  var progressFill = $('#progresoRelleno');
  var progressText = $('#progresoTexto');
  var estrellasEl = $('#estrellas');

  /* Progreso persistente */
  var progress = App.storage.getWithStars(TOOL_ID);

  /* Estado de la ronda */
  var mode = null;
  var lvl = null;
  var questions = [];
  var idx = 0;
  var roundHits = 0;
  /* The misses of the round are kept by App.reinforce (assets/js/feedback.js). */
  var enRefuerzo = false;
  var solved = false;
  var attempts = 0;
  /* Estado de borrador (modo "poner"). */
  var draftHour = null;
  var draftMinute = null;

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return estrellasEl; }
  });
  var save = glue.save, renderStars = glue.paintStars;


  /* ---- Helpers de hora ---- */
  function hora12(h24) {
    var h = h24 % 12;
    return h === 0 ? 12 : h;
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function textHour(h, minute) {
    if (minute === 0)  return App.i18n.t('enPunto').replace('{h}', h);
    if (minute === 15) return App.i18n.t('yCuarto').replace('{h}', h);
    if (minute === 30) return App.i18n.t('yMedia').replace('{h}', h);
    var next = h === 12 ? 1 : h + 1;
    return App.i18n.t('menosCuarto').replace('{h}', next);
  }

  function hourDigital(h, m) { return pad2(h) + ':' + pad2(m); }

  function svgClock(h, minute) {
    var angleHour = ((h % 12) + minute / 60) * 30;
    var angleMinute = minute * 6;
    var numbers = [
      { n: 12, x: 50, y: 20 },
      { n: 3,  x: 80, y: 52 },
      { n: 6,  x: 50, y: 84 },
      { n: 9,  x: 20, y: 52 }
    ].map(function (p) {
      return '<text x="' + p.x + '" y="' + p.y + '" text-anchor="middle" ' +
        'font-size="12" font-weight="700" fill="var(--color-text)" ' +
        'style="font-family:var(--fuente)">' + p.n + '</text>';
    }).join('');
    return '<svg viewBox="0 0 100 100" width="120" height="120" role="img" aria-hidden="true">' +
      '<circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="var(--color-text)" stroke-width="4"/>' +
      numbers +
      '<line x1="50" y1="50" x2="50" y2="28" stroke="var(--color-text)" stroke-width="5" ' +
      'stroke-linecap="round" transform="rotate(' + angleHour + ' 50 50)"/>' +
      '<line x1="50" y1="50" x2="50" y2="18" stroke="var(--color-text)" stroke-width="3.5" ' +
      'stroke-linecap="round" transform="rotate(' + angleMinute + ' 50 50)"/>' +
      '<circle cx="50" cy="50" r="3" fill="var(--color-text)"/>' +
      '</svg>';
  }

  function hourRandom() { return 1 + Math.floor(Math.random() * 12); }

  function minuteRandom() {
    var opts = lvl.minutos;
    return opts[Math.floor(Math.random() * opts.length)];
  }

  function combinacionDistinta(excluir) {
    var h, m, attempts = 0;
    do {
      h = hourRandom();
      m = minuteRandom();
      attempts++;
    } while (excluir.some(function (e) { return e.h === h && e.m === m; }) && attempts < 30);
    return { h: h, m: m };
  }

  /* ---- Constructores de pregunta (uno por mecánica) ---- */
  function questionRead() {
    var h = hourRandom();
    var m = minuteRandom();
    var used = [{ h: h, m: m }];
    var options = [{ text: textHour(h, m), isCorrect: true }];
    while (options.length < 3) {
      var d = combinacionDistinta(used);
      used.push(d);
      var text = textHour(d.h, d.m);
      if (options.some(function (o) { return o.text === text; })) continue;
      options.push({ text: text, isCorrect: false });
    }
    return { tipo: 'leer', hora: h, minuto: m, options: options };
  }

  function questionPut() {
    return {
      tipo: 'poner',
      hora: hourRandom(),
      minuto: minuteRandom()
    };
  }

  function questionConvert() {
    var h = hourRandom();
    var m = minuteRandom();
    var used = [{ h: h, m: m }];
    var options = [{ h: h, m: m, isCorrect: true }];
    while (options.length < 3) {
      var d = combinacionDistinta(used);
      used.push(d);
      options.push({ h: d.h, m: d.m, isCorrect: false });
    }
    return { tipo: 'convertir', hora: h, minuto: m, options: options };
  }

  function questionSituation() {
    var momentos = bank().momentos;
    var timeOfDay = momentos[Math.floor(Math.random() * momentos.length)];
    var h = hora12(timeOfDay.hora);
    var m = minuteRandom();
    var used = [{ h: h, m: m }];
    var options = [{ h: h, m: m, isCorrect: true }];
    while (options.length < 3) {
      var d = combinacionDistinta(used);
      used.push(d);
      options.push({ h: d.h, m: d.m, isCorrect: false });
    }
    return { tipo: 'situaciones', timeOfDay: timeOfDay, options: options };
  }

  /* ---- Pantallas de inicio (modo → nivel → juego) ---- */
  function paintModes() {
    var cont = $('#modos');
    if (!cont) return;
    cont.innerHTML = '';
    bank().modos.forEach(function (m) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-modo';
      btn.innerHTML =
        '<strong data-i18n="modo.' + m.id + '.name">' +
          App.i18n.t('modo.' + m.id + '.name') +
        '</strong>' +
        '<span class="modo-desc" data-i18n="modo.' + m.id + '.descripcion">' +
          App.i18n.t('modo.' + m.id + '.descripcion') +
        '</span>';
      btn.addEventListener('click', function () { chooseMode(m); });
      cont.appendChild(btn);
    });
  }

  function chooseMode(m) {
    mode = m;
    if (startScreen) startScreen.classList.add('hidden');
    screenLevels.classList.remove('hidden');
    renderLevels();
  }

  function renderLevels() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    bank().niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      btn.innerHTML = n.name + ' — ' + n.descripcion;
      btn.addEventListener('click', function () { startRound(n); });
      cont.appendChild(btn);
    });
  }

  function startRound(n) {
    lvl = n;
    var constructores = {
      leer: questionRead,
      poner: questionPut,
      convertir: questionConvert,
      situaciones: questionSituation
    };
    questions = [];
    for (var i = 0; i < bank().porRonda; i++) {
      var q = constructores[mode.id]();
      if (mode.id === 'convertir') {
        q.direccion = (i % 2 === 0) ? 'a2d' : 'd2a';
      }
      questions.push(q);
    }
    idx = 0;
    roundHits = 0;
    enRefuerzo = false;
    App.reinforce.start();
    screenLevels.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    render();
  }

  function renderProgress() {
    var total = bank().porRonda;
    progressFill.style.width = ((idx / total) * 100) + '%';
    progressText.textContent = '';
  }

  /* ---- Render ---- */
  function render() {
    var p = questions[idx];
    solved = false;
    attempts = 0;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';
    optionsEl.className = 'pila';
    var live = zoneQuestionEl.querySelector('.digital-live');
    if (live) detenerDigital(live);
    zoneQuestionEl.innerHTML = '';
    draftHour = null;
    draftMinute = null;
    textQuestionEl.textContent = '';
    if (btnListen) btnListen.classList.add('hidden');

    if (!p) return;
    if (p.tipo === 'leer')            renderRead(p);
    else if (p.tipo === 'poner')      renderPut(p);
    else if (p.tipo === 'convertir')  renderConvert(p);
    else if (p.tipo === 'situaciones') renderSituation(p);

    renderProgress();
    renderStars();
  }

  function renderRead(p) {
    zoneQuestionEl.innerHTML = svgClock(p.hora, p.minuto);
    textQuestionEl.textContent = App.i18n.t('queHora');
    App.utils.shuffle(p.options).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.textContent;
      btn.addEventListener('click', function () { answer(btn, op.isCorrect, p); });
      optionsEl.appendChild(btn);
    });
  }

  function renderPut(p) {
    var startH = ((p.hora % 12) + 11) % 12 + 1;
    if (startH === p.hora) startH = ((p.hora % 12) + 6) % 12 + 1;
    var startM = lvl.minutos[0];
    draftHour = startH;
    draftMinute = startM;

    zoneQuestionEl.innerHTML =
      '<div class="objetivo-poner">' +
        '<span class="objetivo-etiqueta">' + App.i18n.t('etiquetaPoner') + '</span>' +
        '<span class="objetivo-hora">' + textHour(p.hora, p.minuto) + '</span>' +
      '</div>' +
      svgClock(draftHour, draftMinute);

    textQuestionEl.textContent = App.i18n.t('modo.poner.pregunta');

    optionsEl.className = 'pila options-steppers';
    optionsEl.innerHTML =
      htmlStepper('hora', App.i18n.t('ponerHora'), startH, 1, 12) +
      htmlStepper('minuto', App.i18n.t('ponerMinuto'), startM, 0, 59) +
      '<button type="button" class="btn btn-confirmar" id="btnConfirmarPoner">' +
        App.i18n.t('ponerConfirmar') + '</button>';

    enlazarStepper('hora', 1, 12);
    enlazarStepper('minuto', 0, 59);

    $('#btnConfirmarPoner').addEventListener('click', function () {
      answer($('#btnConfirmarPoner'),
        draftHour === p.hora && draftMinute === p.minuto,
        p);
    });
  }

  function htmlStepper(tipo, etiqueta, valor, min, max) {
    return '<div class="stepper" data-tipo="' + tipo + '">' +
      '<span class="stepper-etiqueta">' + etiqueta + '</span>' +
      '<button type="button" class="btn-step btn-step-down" aria-label="' +
        App.i18n.t('ponerDecrementar') + '">−</button>' +
      '<span class="stepper-valor" data-value="' + valor + '">' + valor + '</span>' +
      '<button type="button" class="btn-step btn-step-up" aria-label="' +
        App.i18n.t('ponerIncrementar') + '">+</button>' +
      '</div>';
  }

  function enlazarStepper(tipo, min, max) {
    var root = optionsEl.querySelector('.stepper[data-tipo="' + tipo + '"]');
    if (!root) return;
    var valEl = root.querySelector('.stepper-valor');
    function setVal(v) {
      if (v < min) v = max;
      if (v > max) v = min;
      valEl.setAttribute('data-value', String(v));
      valEl.textContent = String(v);
      if (tipo === 'hora') draftHour = v;
      else draftMinute = v;
      var svgHost = zoneQuestionEl.querySelector('svg');
      if (svgHost) {
        var tmp = document.createElement('div');
        tmp.innerHTML = svgClock(draftHour, draftMinute);
        svgHost.parentNode.replaceChild(tmp.firstChild, svgHost);
      }
    }
    root.querySelector('.btn-step-down').addEventListener('click', function () {
      setVal(parseInt(valEl.getAttribute('data-value'), 10) - 1);
    });
    root.querySelector('.btn-step-up').addEventListener('click', function () {
      setVal(parseInt(valEl.getAttribute('data-value'), 10) + 1);
    });
  }

  function detenerDigital(host) {
    if (!host || !host.dataset.tickId) return;
    clearInterval(parseInt(host.dataset.tickId, 10));
    delete host.dataset.tickId;
  }

  function renderConvert(p) {
    if (p.direccion === 'a2d') {
      zoneQuestionEl.innerHTML = svgClock(p.hora, p.minuto);
      textQuestionEl.textContent = App.i18n.t('convertirAnalogicoDigital');
      App.utils.shuffle(p.options).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.innerHTML = '<span class="dig-pair">' + hourDigital(op.h, op.m) + '</span>';
        btn.setAttribute('aria-label', App.i18n.t('ariaReloj').replace('{text}', hourDigital(op.h, op.m)));
        btn.addEventListener('click', function () { answer(btn, op.isCorrect, p); });
        optionsEl.appendChild(btn);
      });
    } else {
      zoneQuestionEl.innerHTML = '<div class="digital-face">' +
        '<span class="dig-pair">' + hourDigital(p.hora, p.minuto) + '</span></div>';
      textQuestionEl.textContent = App.i18n.t('convertirDigitalAnalogico');
      optionsEl.className = 'pila options-reloj';
      App.utils.shuffle(p.options).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion opcion-reloj';
        btn.innerHTML = svgClock(op.h, op.m);
        btn.setAttribute('aria-label', App.i18n.t('ariaReloj').replace('{text}', textHour(op.h, op.m)));
        btn.addEventListener('click', function () { answer(btn, op.isCorrect, p); });
        optionsEl.appendChild(btn);
      });
    }
  }

  function renderSituation(p) {
    zoneQuestionEl.innerHTML = '<div class="timeOfDay-picto" aria-hidden="true">' +
      p.timeOfDay.picto + '</div>';
    textQuestionEl.textContent = App.i18n.t('timeOfDay.' + p.timeOfDay.id + '.pregunta');
    optionsEl.className = 'pila options-reloj';
    App.utils.shuffle(p.options).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion opcion-reloj';
      btn.innerHTML = svgClock(op.h, op.m);
      btn.setAttribute('aria-label', App.i18n.t('ariaReloj').replace('{text}', textHour(op.h, op.m)));
      btn.addEventListener('click', function () { answer(btn, op.isCorrect, p); });
      optionsEl.appendChild(btn);
    });
  }

  /* ---- Evaluación (compartida por las 4 mecánicas) ---- */
  function correctText(p) {
    if (p.tipo === 'leer') {
      var c0 = p.options.filter(function (o) { return o.isCorrect; })[0];
      return c0 ? c0.textContent : '';
    }
    if (p.tipo === 'poner') return textHour(p.hora, p.minuto);
    if (p.tipo === 'convertir') {
      var c1 = p.options.filter(function (o) { return o.isCorrect; })[0];
      return p.direccion === 'a2d'
        ? hourDigital(c1.h, c1.m)
        : textHour(c1.h, c1.m);
    }
    if (p.tipo === 'situaciones') {
      var c2 = p.options.filter(function (o) { return o.isCorrect; })[0];
      return textHour(c2.h, c2.m);
    }
    return '';
  }

  function showExplanation(isCorrect, p) {
    var prefijo = isCorrect ? App.i18n.t('explicacionCorrecta')
                             : App.i18n.t('explicacionIncorrectaA');
    explanationEl.textContent = prefijo + correctText(p) + '.';
    explanationWrap.classList.remove('hidden');
  }

  /* Método socrático: en el primer fallo no se da la respuesta —
     se anima a mirar de nuevo. Solo en el segundo fallo se explica
     la hora correcta (showExplanation). */
  function showHint(p) {
    var key;
    if (p.tipo === 'leer') key = 'pistaLeer';
    else if (p.tipo === 'situaciones') key = 'pistaAsociar';
    else if (p.tipo === 'poner') key = 'pistaPoner';
    else key = 'pistaConvertir';
    explanationEl.textContent = App.i18n.t(key);
    explanationWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect, p) {
    if (solved) return;
    if (isCorrect) {
      if (enRefuerzo) {
        explanationEl.textContent = '';
        explanationWrap.classList.add('hidden');
      } else {
        showExplanation(isCorrect, p);
      }
      solved = true;
      App.feedback.markCorrect(btn, App.utils.$$('#options .btn-opcion, #options .btn-step'));
      App.utils.$$('#btnConfirmarPoner').forEach(function (b) { b.disabled = true; });
      btn.classList.add('correcta');
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      save();
      renderStars();
      btnNext.classList.remove('hidden');
      btnNext.focus();
    } else {
      attempts += 1;
      if (attempts === 1 && !enRefuerzo) App.reinforce.add('q' + idx, p);
      var answerAfterHint = attempts > 1;
      showHint(p);
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(
        App.utils.$$('#options .btn-opcion, #options .btn-step, #btnConfirmarPoner'),
        explanationWrap, function () { if (answerAfterHint) showExplanation(isCorrect, p); });
    }
  }

  function next() {
    idx += 1;
    optionsEl.className = 'pila';
    if (idx >= questions.length) {
      if (!enRefuerzo) {
        var replay = App.reinforce.consume();
        if (replay.length) {
          questions = replay.map(function (entry) { return entry.payload; });
          idx = 0;
          enRefuerzo = true;
          render();
          return;
        }
      }
      enRefuerzo = false;
      App.reinforce.clear();
      endRound();
      return;
    }
    render();
  }

  function endRound() {
    save();
    App.utils.showEnd(gameScreen, endScreen);
    $('#endSummary').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#btnNext').addEventListener('click', next);
  $('#repeatBtn').addEventListener('click', function () { startRound(lvl); });
  var btnMenu = $('#btnMenu');
  if (btnMenu) btnMenu.addEventListener('click', function () {
    App.utils.goMenu();
  });
  function backAModes() {
    endScreen.classList.add('hidden');
    if (screenLevels) screenLevels.classList.add('hidden');
    if (startScreen) startScreen.classList.remove('hidden');
  }
  var btnOtherMode = $('#btnOtroModo');
  var btnOtherModeFinal = $('#btnOtroModoFinal');
  if (btnOtherMode) btnOtherMode.addEventListener('click', backAModes);
  if (btnOtherModeFinal) btnOtherModeFinal.addEventListener('click', backAModes);
  if (btnListen) {
    btnListen.addEventListener('click', function () {
      var t = textQuestionEl.textContent || '';
      if (t) if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(t);
    });
  }

  paintModes();
  renderStars();
  if (startScreen) startScreen.classList.remove('hidden');
})();
