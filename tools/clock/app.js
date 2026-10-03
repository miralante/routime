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
  var pantallaNiveles = $('#pantallaNiveles');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var zonaPreguntaEl = $('#zonaPregunta');
  var textoPreguntaEl = $('#questionText');
  var optionsEl = $('#options');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explanationWrap');
  var explicacionEl = $('#explanation');
  var btnListen = $('#listenBtn');
  var btnNext = $('#btnNext');
  var progresoRelleno = $('#progresoRelleno');
  var progresoTexto = $('#progresoTexto');
  var estrellasEl = $('#estrellas');

  /* Progreso persistente */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;

  /* Estado de la ronda */
  var modo = null;
  var lvl = null;
  var preguntas = [];
  var idx = 0;
  var roundHits = 0;
  var enRefuerzo = false;
  var refuerzoLista = [];
  var solved = false;
  var attempts = 0;
  /* Estado de borrador (modo "poner"). */
  var borradorHora = null;
  var borradorMinuto = null;

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function save() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { estrellasEl.textContent = '⭐ ' + progress.stars; }

  /* ---- Helpers de hora ---- */
  function hora12(h24) {
    var h = h24 % 12;
    return h === 0 ? 12 : h;
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function textoHora(h, minuto) {
    if (minuto === 0)  return App.i18n.t('enPunto').replace('{h}', h);
    if (minuto === 15) return App.i18n.t('yCuarto').replace('{h}', h);
    if (minuto === 30) return App.i18n.t('yMedia').replace('{h}', h);
    var next = h === 12 ? 1 : h + 1;
    return App.i18n.t('menosCuarto').replace('{h}', next);
  }

  function horaDigital(h, m) { return pad2(h) + ':' + pad2(m); }

  function svgReloj(h, minuto) {
    var anguloHora = ((h % 12) + minuto / 60) * 30;
    var anguloMinuto = minuto * 6;
    var numeros = [
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
      numeros +
      '<line x1="50" y1="50" x2="50" y2="28" stroke="var(--color-text)" stroke-width="5" ' +
      'stroke-linecap="round" transform="rotate(' + anguloHora + ' 50 50)"/>' +
      '<line x1="50" y1="50" x2="50" y2="18" stroke="var(--color-text)" stroke-width="3.5" ' +
      'stroke-linecap="round" transform="rotate(' + anguloMinuto + ' 50 50)"/>' +
      '<circle cx="50" cy="50" r="3" fill="var(--color-text)"/>' +
      '</svg>';
  }

  function horaAleatoria() { return 1 + Math.floor(Math.random() * 12); }

  function minutoAleatorio() {
    var opts = lvl.minutos;
    return opts[Math.floor(Math.random() * opts.length)];
  }

  function combinacionDistinta(excluir) {
    var h, m, attempts = 0;
    do {
      h = horaAleatoria();
      m = minutoAleatorio();
      attempts++;
    } while (excluir.some(function (e) { return e.h === h && e.m === m; }) && attempts < 30);
    return { h: h, m: m };
  }

  /* ---- Constructores de pregunta (uno por mecánica) ---- */
  function preguntaLeer() {
    var h = horaAleatoria();
    var m = minutoAleatorio();
    var usados = [{ h: h, m: m }];
    var options = [{ text: textoHora(h, m), isCorrect: true }];
    while (options.length < 3) {
      var d = combinacionDistinta(usados);
      usados.push(d);
      var text = textoHora(d.h, d.m);
      if (options.some(function (o) { return o.text === text; })) continue;
      options.push({ text: text, isCorrect: false });
    }
    return { tipo: 'leer', hora: h, minuto: m, options: options };
  }

  function preguntaPoner() {
    return {
      tipo: 'poner',
      hora: horaAleatoria(),
      minuto: minutoAleatorio()
    };
  }

  function preguntaConvertir() {
    var h = horaAleatoria();
    var m = minutoAleatorio();
    var usados = [{ h: h, m: m }];
    var options = [{ h: h, m: m, isCorrect: true }];
    while (options.length < 3) {
      var d = combinacionDistinta(usados);
      usados.push(d);
      options.push({ h: d.h, m: d.m, isCorrect: false });
    }
    return { tipo: 'convertir', hora: h, minuto: m, options: options };
  }

  function preguntaSituacion() {
    var momentos = banco().momentos;
    var timeOfDay = momentos[Math.floor(Math.random() * momentos.length)];
    var h = hora12(timeOfDay.hora);
    var m = minutoAleatorio();
    var usados = [{ h: h, m: m }];
    var options = [{ h: h, m: m, isCorrect: true }];
    while (options.length < 3) {
      var d = combinacionDistinta(usados);
      usados.push(d);
      options.push({ h: d.h, m: d.m, isCorrect: false });
    }
    return { tipo: 'situaciones', timeOfDay: timeOfDay, options: options };
  }

  /* ---- Pantallas de inicio (modo → nivel → juego) ---- */
  function pintarModos() {
    var cont = $('#modos');
    if (!cont) return;
    cont.innerHTML = '';
    banco().modos.forEach(function (m) {
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
      btn.addEventListener('click', function () { elegirModo(m); });
      cont.appendChild(btn);
    });
  }

  function elegirModo(m) {
    modo = m;
    if (startScreen) startScreen.classList.add('hidden');
    pantallaNiveles.classList.remove('hidden');
    renderLevels();
  }

  function renderLevels() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    banco().niveles.forEach(function (n) {
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
      leer: preguntaLeer,
      poner: preguntaPoner,
      convertir: preguntaConvertir,
      situaciones: preguntaSituacion
    };
    preguntas = [];
    for (var i = 0; i < banco().porRonda; i++) {
      var q = constructores[modo.id]();
      if (modo.id === 'convertir') {
        q.direccion = (i % 2 === 0) ? 'a2d' : 'd2a';
      }
      preguntas.push(q);
    }
    idx = 0;
    roundHits = 0;
    enRefuerzo = false;
    refuerzoLista = [];
    pantallaNiveles.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    render();
  }

  function renderProgress() {
    var total = banco().porRonda;
    progresoRelleno.style.width = ((idx / total) * 100) + '%';
    progresoTexto.textContent = '';
  }

  /* ---- Render ---- */
  function render() {
    var p = preguntas[idx];
    solved = false;
    attempts = 0;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';
    optionsEl.className = 'pila';
    var live = zonaPreguntaEl.querySelector('.digital-live');
    if (live) detenerDigital(live);
    zonaPreguntaEl.innerHTML = '';
    borradorHora = null;
    borradorMinuto = null;
    textoPreguntaEl.textContent = '';
    if (btnListen) btnListen.classList.add('hidden');

    if (!p) return;
    if (p.tipo === 'leer')            renderLeer(p);
    else if (p.tipo === 'poner')      renderPoner(p);
    else if (p.tipo === 'convertir')  renderConvertir(p);
    else if (p.tipo === 'situaciones') renderSituacion(p);

    renderProgress();
    renderStars();
  }

  function renderLeer(p) {
    zonaPreguntaEl.innerHTML = svgReloj(p.hora, p.minuto);
    textoPreguntaEl.textContent = App.i18n.t('queHora');
    App.utils.shuffle(p.options).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.textContent;
      btn.addEventListener('click', function () { answer(btn, op.isCorrect, p); });
      optionsEl.appendChild(btn);
    });
  }

  function renderPoner(p) {
    var inicioH = ((p.hora % 12) + 11) % 12 + 1;
    if (inicioH === p.hora) inicioH = ((p.hora % 12) + 6) % 12 + 1;
    var inicioM = lvl.minutos[0];
    borradorHora = inicioH;
    borradorMinuto = inicioM;

    zonaPreguntaEl.innerHTML =
      '<div class="objetivo-poner">' +
        '<span class="objetivo-etiqueta">' + App.i18n.t('etiquetaPoner') + '</span>' +
        '<span class="objetivo-hora">' + textoHora(p.hora, p.minuto) + '</span>' +
      '</div>' +
      svgReloj(borradorHora, borradorMinuto);

    textoPreguntaEl.textContent = App.i18n.t('modo.poner.pregunta');

    optionsEl.className = 'pila options-steppers';
    optionsEl.innerHTML =
      htmlStepper('hora', App.i18n.t('ponerHora'), inicioH, 1, 12) +
      htmlStepper('minuto', App.i18n.t('ponerMinuto'), inicioM, 0, 59) +
      '<button type="button" class="btn btn-confirmar" id="btnConfirmarPoner">' +
        App.i18n.t('ponerConfirmar') + '</button>';

    enlazarStepper('hora', 1, 12);
    enlazarStepper('minuto', 0, 59);

    $('#btnConfirmarPoner').addEventListener('click', function () {
      answer($('#btnConfirmarPoner'),
        borradorHora === p.hora && borradorMinuto === p.minuto,
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
      if (tipo === 'hora') borradorHora = v;
      else borradorMinuto = v;
      var svgHost = zonaPreguntaEl.querySelector('svg');
      if (svgHost) {
        var tmp = document.createElement('div');
        tmp.innerHTML = svgReloj(borradorHora, borradorMinuto);
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

  function renderConvertir(p) {
    if (p.direccion === 'a2d') {
      zonaPreguntaEl.innerHTML = svgReloj(p.hora, p.minuto);
      textoPreguntaEl.textContent = App.i18n.t('convertirAnalogicoDigital');
      App.utils.shuffle(p.options).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.innerHTML = '<span class="dig-pair">' + horaDigital(op.h, op.m) + '</span>';
        btn.setAttribute('aria-label', App.i18n.t('ariaReloj').replace('{text}', horaDigital(op.h, op.m)));
        btn.addEventListener('click', function () { answer(btn, op.isCorrect, p); });
        optionsEl.appendChild(btn);
      });
    } else {
      zonaPreguntaEl.innerHTML = '<div class="digital-face">' +
        '<span class="dig-pair">' + horaDigital(p.hora, p.minuto) + '</span></div>';
      textoPreguntaEl.textContent = App.i18n.t('convertirDigitalAnalogico');
      optionsEl.className = 'pila options-reloj';
      App.utils.shuffle(p.options).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion opcion-reloj';
        btn.innerHTML = svgReloj(op.h, op.m);
        btn.setAttribute('aria-label', App.i18n.t('ariaReloj').replace('{text}', textoHora(op.h, op.m)));
        btn.addEventListener('click', function () { answer(btn, op.isCorrect, p); });
        optionsEl.appendChild(btn);
      });
    }
  }

  function renderSituacion(p) {
    zonaPreguntaEl.innerHTML = '<div class="timeOfDay-picto" aria-hidden="true">' +
      p.timeOfDay.picto + '</div>';
    textoPreguntaEl.textContent = App.i18n.t('timeOfDay.' + p.timeOfDay.id + '.pregunta');
    optionsEl.className = 'pila options-reloj';
    App.utils.shuffle(p.options).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion opcion-reloj';
      btn.innerHTML = svgReloj(op.h, op.m);
      btn.setAttribute('aria-label', App.i18n.t('ariaReloj').replace('{text}', textoHora(op.h, op.m)));
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
    if (p.tipo === 'poner') return textoHora(p.hora, p.minuto);
    if (p.tipo === 'convertir') {
      var c1 = p.options.filter(function (o) { return o.isCorrect; })[0];
      return p.direccion === 'a2d'
        ? horaDigital(c1.h, c1.m)
        : textoHora(c1.h, c1.m);
    }
    if (p.tipo === 'situaciones') {
      var c2 = p.options.filter(function (o) { return o.isCorrect; })[0];
      return textoHora(c2.h, c2.m);
    }
    return '';
  }

  function showExplanation(isCorrect, p) {
    var prefijo = isCorrect ? App.i18n.t('explicacionCorrecta')
                             : App.i18n.t('explicacionIncorrectaA');
    explicacionEl.textContent = prefijo + correctText(p) + '.';
    explicacionWrap.classList.remove('hidden');
  }

  /* Método socrático: en el primer fallo no se da la respuesta —
     se anima a mirar de nuevo. Solo en el segundo fallo se explica
     la hora correcta (showExplanation). */
  function showHint(p) {
    var clave;
    if (p.tipo === 'leer') clave = 'pistaLeer';
    else if (p.tipo === 'situaciones') clave = 'pistaAsociar';
    else if (p.tipo === 'poner') clave = 'pistaPoner';
    else clave = 'pistaConvertir';
    explicacionEl.textContent = App.i18n.t(clave);
    explicacionWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect, p) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(isCorrect, p);
      solved = true;
      btn.classList.add('correcta');
      App.utils.$$('#options .btn-opcion, #options .btn-step, #btnConfirmarPoner')
        .forEach(function (b) { b.disabled = true; });
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
      if (attempts === 1 && !enRefuerzo) refuerzoLista.push(p);
      if (attempts === 1) {
        showHint(p);
      } else {
        showExplanation(isCorrect, p);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(
        App.utils.$$('#options .btn-opcion, #options .btn-step, #btnConfirmarPoner'),
        explicacionWrap);
    }
  }

  function next() {
    idx += 1;
    optionsEl.className = 'pila';
    if (idx >= preguntas.length) {
      if (!enRefuerzo && refuerzoLista.length) {
        preguntas = refuerzoLista.slice();
        idx = 0;
        enRefuerzo = true;
        render();
        return;
      }
      enRefuerzo = false;
      endRound();
      return;
    }
    render();
  }

  function endRound() {
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#endSummary').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#btnNext').addEventListener('click', next);
  $('#repeatBtn').addEventListener('click', function () { startRound(lvl); });
  var btnMenu = $('#btnMenu');
  if (btnMenu) btnMenu.addEventListener('click', function () {
    window.location.href = '../../site/index.html';
  });
  function volverAModos() {
    endScreen.classList.add('hidden');
    if (pantallaNiveles) pantallaNiveles.classList.add('hidden');
    if (startScreen) startScreen.classList.remove('hidden');
  }
  var btnOtroModo = $('#btnOtroModo');
  var btnOtroModoFinal = $('#btnOtroModoFinal');
  if (btnOtroModo) btnOtroModo.addEventListener('click', volverAModos);
  if (btnOtroModoFinal) btnOtroModoFinal.addEventListener('click', volverAModos);
  if (btnListen) {
    btnListen.addEventListener('click', function () {
      var t = textoPreguntaEl.textContent || '';
      if (t) if (false && App.tts && App.tts.speak) App.tts.speak(t);
    });
  }

  pintarModos();
  renderStars();
  if (startScreen) startScreen.classList.remove('hidden');
})();
