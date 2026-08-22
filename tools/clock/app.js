/* ============================================================
   Routime — El Reloj (autonomía: leer la hora).
   Cuatro mecánicas elegidas en la pantalla de inicio:
     - leer        Ver el reloj analógico → elegir la hora escrita.
     - poner       Leer la hora escrita → ajustar las agujas.
     - convertir   Emparejar reloj analógico con su hora digital
                   (y la inversa en la misma ronda).
     - situaciones Ver un momento del día → elegir el reloj.

   Datos en data.js (DATA.modos, DATA.niveles, DATA.momentos).
   Módulos compartidos en assets/js/. Textos en strings.<locale>.js.
   El error nunca se castiga: 2 intentos, pista socrática,
   respuesta correcta al segundo fallo, y la pregunta se repite
   al final (App.reinforce). Las estrellas solo suman.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'clock';
  var $ = App.utils.$;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaNiveles = $('#pantallaNiveles');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaFinal = $('#pantallaFinal');
  var zonaPreguntaEl = $('#zonaPregunta');
  var textoPreguntaEl = $('#textoPregunta');
  var opcionesEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnEscuchar = $('#btnEscuchar');
  var btnSiguiente = $('#btnSiguiente');
  var progresoRelleno = $('#progresoRelleno');
  var progresoTexto = $('#progresoTexto');
  var estrellasEl = $('#estrellas');

  /* Progreso persistente */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;

  /* Estado de la ronda */
  var modo = null;
  var nivel = null;
  var preguntas = [];
  var idx = 0;
  var aciertosRonda = 0;
  var enRefuerzo = false;
  var refuerzoIdx = 0;
  var refuerzoLista = [];
  var refuerzoTotal = 0;
  var preguntaActual = null;
  var resuelto = false;
  var intentos = 0;
  /* Estado de borrador (modo "poner"). */
  var borradorHora = null;
  var borradorMinuto = null;

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { estrellasEl.textContent = '⭐ ' + progreso.estrellas; }

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
    var siguiente = h === 12 ? 1 : h + 1;
    return App.i18n.t('menosCuarto').replace('{h}', siguiente);
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
        'font-size="12" font-weight="700" fill="var(--color-texto)" ' +
        'style="font-family:var(--fuente)">' + p.n + '</text>';
    }).join('');
    return '<svg viewBox="0 0 100 100" width="120" height="120" role="img" aria-hidden="true">' +
      '<circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="var(--color-texto)" stroke-width="4"/>' +
      numeros +
      '<line x1="50" y1="50" x2="50" y2="28" stroke="var(--color-texto)" stroke-width="5" ' +
      'stroke-linecap="round" transform="rotate(' + anguloHora + ' 50 50)"/>' +
      '<line x1="50" y1="50" x2="50" y2="18" stroke="var(--color-texto)" stroke-width="3.5" ' +
      'stroke-linecap="round" transform="rotate(' + anguloMinuto + ' 50 50)"/>' +
      '<circle cx="50" cy="50" r="3" fill="var(--color-texto)"/>' +
      '</svg>';
  }

  function horaAleatoria() { return 1 + Math.floor(Math.random() * 12); }

  function minutoAleatorio() {
    var opts = nivel.minutos;
    return opts[Math.floor(Math.random() * opts.length)];
  }

  function combinacionDistinta(excluir) {
    var h, m, intentos = 0;
    do {
      h = horaAleatoria();
      m = minutoAleatorio();
      intentos++;
    } while (excluir.some(function (e) { return e.h === h && e.m === m; }) && intentos < 30);
    return { h: h, m: m };
  }

  /* ---- Constructores de pregunta (uno por mecánica) ---- */
  function preguntaLeer() {
    var h = horaAleatoria();
    var m = minutoAleatorio();
    var usados = [{ h: h, m: m }];
    var opciones = [{ texto: textoHora(h, m), esCorrecta: true }];
    while (opciones.length < 3) {
      var d = combinacionDistinta(usados);
      usados.push(d);
      var texto = textoHora(d.h, d.m);
      if (opciones.some(function (o) { return o.texto === texto; })) continue;
      opciones.push({ texto: texto, esCorrecta: false });
    }
    return { tipo: 'leer', hora: h, minuto: m, opciones: opciones };
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
    var opciones = [{ h: h, m: m, esCorrecta: true }];
    while (opciones.length < 3) {
      var d = combinacionDistinta(usados);
      usados.push(d);
      opciones.push({ h: d.h, m: d.m, esCorrecta: false });
    }
    return { tipo: 'convertir', hora: h, minuto: m, opciones: opciones };
  }

  function preguntaSituacion() {
    var momentos = banco().momentos;
    var momento = momentos[Math.floor(Math.random() * momentos.length)];
    var h = hora12(momento.hora);
    var m = minutoAleatorio();
    var usados = [{ h: h, m: m }];
    var opciones = [{ h: h, m: m, esCorrecta: true }];
    while (opciones.length < 3) {
      var d = combinacionDistinta(usados);
      usados.push(d);
      opciones.push({ h: d.h, m: d.m, esCorrecta: false });
    }
    return { tipo: 'situaciones', momento: momento, opciones: opciones };
  }

  /* ---- Pantallas de inicio (modo → nivel → juego) ---- */
  function pintarModos() {
    var cont = $('#modos');
    cont.innerHTML = '';
    banco().modos.forEach(function (m) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-modo';
      btn.innerHTML =
        '<strong data-i18n="modo.' + m.id + '.nombre">' +
          App.i18n.t('modo.' + m.id + '.nombre') +
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
    pantallaInicio.classList.add('oculto');
    pantallaNiveles.classList.remove('oculto');
    pintarNiveles();
  }

  function pintarNiveles() {
    var cont = $('#niveles');
    cont.innerHTML = '';
    banco().niveles.forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      btn.innerHTML = n.nombre + ' — ' + n.descripcion;
      btn.addEventListener('click', function () { iniciarRonda(n); });
      cont.appendChild(btn);
    });
  }

  function iniciarRonda(n) {
    nivel = n;
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
    aciertosRonda = 0;
    enRefuerzo = false;
    refuerzoIdx = 0;
    preguntaActual = null;
    App.reinforce.banner.hide();
    App.reinforce.start(function (fallos) { iniciarRefuerzo(fallos); });
    pantallaInicio.classList.add('oculto');
    pantallaNiveles.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    render();
  }

  function iniciarRefuerzo(fallos) {
    refuerzoLista = fallos.map(function (f) { return f.payload; });
    refuerzoTotal = refuerzoLista.length;
    refuerzoIdx = 0;
    enRefuerzo = true;
    App.reinforce.banner.set(
      App.i18n.t('refuerzoTitulo') + ' — ' +
      App.i18n.t('refuerzoIntro').replace('{n}', refuerzoTotal)
    );
    preguntaActual = refuerzoLista[0];
    pintarProgresoRefuerzo();
    render();
  }

  function pintarProgresoRefuerzo() {
    progresoRelleno.style.width = (((refuerzoIdx + 1) / refuerzoTotal) * 100) + '%';
    progresoTexto.textContent = (refuerzoIdx + 1) + ' / ' + refuerzoTotal;
  }

  function pintarProgreso() {
    var total = banco().porRonda;
    progresoRelleno.style.width = ((idx / total) * 100) + '%';
    progresoTexto.textContent = idx + ' / ' + total;
  }

  /* ---- Render ---- */
  function render() {
    var p = preguntas[idx];
    resuelto = false;
    intentos = 0;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('oculto');
    explicacionEl.textContent = '';
    btnSiguiente.classList.add('oculto');
    opcionesEl.innerHTML = '';
    opcionesEl.className = 'pila';
    var live = zonaPreguntaEl.querySelector('.digital-live');
    if (live) detenerDigital(live);
    zonaPreguntaEl.innerHTML = '';
    borradorHora = null;
    borradorMinuto = null;
    textoPreguntaEl.textContent = '';
    if (btnEscuchar) btnEscuchar.classList.add('oculto');

    if (!p) return;
    if (p.tipo === 'leer')            renderLeer(p);
    else if (p.tipo === 'poner')      renderPoner(p);
    else if (p.tipo === 'convertir')  renderConvertir(p);
    else if (p.tipo === 'situaciones') renderSituacion(p);

    pintarProgreso();
    pintarEstrellas();
  }

  function renderLeer(p) {
    zonaPreguntaEl.innerHTML = svgReloj(p.hora, p.minuto);
    textoPreguntaEl.textContent = App.i18n.t('queHora');
    App.utils.shuffle(p.opciones).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { responder(btn, op.esCorrecta, p); });
      opcionesEl.appendChild(btn);
    });
  }

  function renderPoner(p) {
    var inicioH = ((p.hora % 12) + 11) % 12 + 1;
    if (inicioH === p.hora) inicioH = ((p.hora % 12) + 6) % 12 + 1;
    var inicioM = nivel.minutos[0];
    borradorHora = inicioH;
    borradorMinuto = inicioM;

    zonaPreguntaEl.innerHTML =
      '<div class="objetivo-poner">' +
        '<span class="objetivo-etiqueta">' + App.i18n.t('etiquetaPoner') + '</span>' +
        '<span class="objetivo-hora">' + textoHora(p.hora, p.minuto) + '</span>' +
      '</div>' +
      svgReloj(borradorHora, borradorMinuto);

    textoPreguntaEl.textContent = App.i18n.t('modo.poner.pregunta');

    opcionesEl.className = 'pila opciones-steppers';
    opcionesEl.innerHTML =
      htmlStepper('hora', App.i18n.t('ponerHora'), inicioH, 1, 12) +
      htmlStepper('minuto', App.i18n.t('ponerMinuto'), inicioM, 0, 59) +
      '<button type="button" class="btn btn-confirmar" id="btnConfirmarPoner">' +
        App.i18n.t('ponerConfirmar') + '</button>';

    enlazarStepper('hora', 1, 12);
    enlazarStepper('minuto', 0, 59);

    $('#btnConfirmarPoner').addEventListener('click', function () {
      responder($('#btnConfirmarPoner'),
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
    var root = opcionesEl.querySelector('.stepper[data-tipo="' + tipo + '"]');
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
      App.utils.shuffle(p.opciones).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion';
        btn.innerHTML = '<span class="dig-pair">' + horaDigital(op.h, op.m) + '</span>';
        btn.setAttribute('aria-label', App.i18n.t('ariaReloj').replace('{texto}', horaDigital(op.h, op.m)));
        btn.addEventListener('click', function () { responder(btn, op.esCorrecta, p); });
        opcionesEl.appendChild(btn);
      });
    } else {
      zonaPreguntaEl.innerHTML = '<div class="digital-face">' +
        '<span class="dig-pair">' + horaDigital(p.hora, p.minuto) + '</span></div>';
      textoPreguntaEl.textContent = App.i18n.t('convertirDigitalAnalogico');
      opcionesEl.className = 'pila opciones-reloj';
      App.utils.shuffle(p.opciones).forEach(function (op) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-opcion opcion-reloj';
        btn.innerHTML = svgReloj(op.h, op.m);
        btn.setAttribute('aria-label', App.i18n.t('ariaReloj').replace('{texto}', textoHora(op.h, op.m)));
        btn.addEventListener('click', function () { responder(btn, op.esCorrecta, p); });
        opcionesEl.appendChild(btn);
      });
    }
  }

  function renderSituacion(p) {
    zonaPreguntaEl.innerHTML = '<div class="momento-picto" aria-hidden="true">' +
      p.momento.picto + '</div>';
    textoPreguntaEl.textContent = App.i18n.t('momento.' + p.momento.id + '.pregunta');
    opcionesEl.className = 'pila opciones-reloj';
    App.utils.shuffle(p.opciones).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion opcion-reloj';
      btn.innerHTML = svgReloj(op.h, op.m);
      btn.setAttribute('aria-label', App.i18n.t('ariaReloj').replace('{texto}', textoHora(op.h, op.m)));
      btn.addEventListener('click', function () { responder(btn, op.esCorrecta, p); });
      opcionesEl.appendChild(btn);
    });
  }

  /* ---- Evaluación (compartida por las 4 mecánicas) ---- */
  function textoCorrecto(p) {
    if (p.tipo === 'leer') {
      var c0 = p.opciones.filter(function (o) { return o.esCorrecta; })[0];
      return c0 ? c0.texto : '';
    }
    if (p.tipo === 'poner') return textoHora(p.hora, p.minuto);
    if (p.tipo === 'convertir') {
      var c1 = p.opciones.filter(function (o) { return o.esCorrecta; })[0];
      return p.direccion === 'a2d'
        ? horaDigital(c1.h, c1.m)
        : textoHora(c1.h, c1.m);
    }
    if (p.tipo === 'situaciones') {
      var c2 = p.opciones.filter(function (o) { return o.esCorrecta; })[0];
      return textoHora(c2.h, c2.m);
    }
    return '';
  }

  function mostrarExplicacion(esCorrecta, p) {
    var prefijo = esCorrecta ? App.i18n.t('explicacionCorrecta')
                             : App.i18n.t('explicacionIncorrectaA');
    explicacionEl.textContent = prefijo + textoCorrecto(p) + '.';
    explicacionWrap.classList.remove('oculto');
  }

  /* Método socrático: en el primer fallo no se da la respuesta —
     se anima a mirar de nuevo. Solo en el segundo fallo se explica
     la hora correcta (mostrarExplicacion). */
  function mostrarPista(p) {
    var clave;
    if (p.tipo === 'leer') clave = 'pistaLeer';
    else if (p.tipo === 'situaciones') clave = 'pistaAsociar';
    else if (p.tipo === 'poner') clave = 'pistaPoner';
    else clave = 'pistaConvertir';
    explicacionEl.textContent = App.i18n.t(clave);
    explicacionWrap.classList.remove('oculto');
  }

  function responder(btn, esCorrecta, p) {
    if (resuelto) return;
    if (esCorrecta) {
      mostrarExplicacion(esCorrecta, p);
      resuelto = true;
      btn.classList.add('correcta');
      App.utils.$$('#opciones .btn-opcion, #opciones .btn-step, #btnConfirmarPoner')
        .forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      progreso.estrellas += 1;
      aciertosRonda += 1;
      guardar();
      pintarEstrellas();
      btnSiguiente.classList.remove('oculto');
      btnSiguiente.focus();
    } else {
      intentos += 1;
      if (intentos === 1) App.reinforce.add(nivel.id + ':' + idx, p);
      if (intentos === 1) {
        mostrarPista(p);
      } else {
        mostrarExplicacion(esCorrecta, p);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(
        App.utils.$$('#opciones .btn-opcion, #opciones .btn-step, #btnConfirmarPoner'),
        explicacionWrap);
    }
  }

  function siguiente() {
    if (enRefuerzo) {
      refuerzoIdx += 1;
      if (refuerzoIdx >= refuerzoTotal) {
        enRefuerzo = false;
        preguntaActual = null;
        App.reinforce.clear();
        App.reinforce.banner.hide();
        terminarRonda();
        return;
      }
      preguntaActual = refuerzoLista[refuerzoIdx];
      pintarProgresoRefuerzo();
      opcionesEl.className = 'pila';
      render();
      return;
    }
    idx += 1;
    opcionesEl.className = 'pila';
    if (idx >= banco().porRonda) {
      var consume = App.reinforce.consume();
      if (consume.length === 0) terminarRonda();
      return;
    }
    preguntaActual = null;
    render();
  }

  function terminarRonda() {
    guardar();
    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal')
      .replace('{n}', aciertosRonda)
      .replace('{total}', progreso.estrellas);
    $('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---- Eventos ---- */
  $('#btnSiguiente').addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarRonda(nivel); });
  $('#btnOtroNivel').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pantallaNiveles.classList.remove('oculto');
  });
  $('#btnOtroModo').addEventListener('click', function () {
    pantallaFinal.classList.add('oculto');
    pantallaNiveles.classList.add('oculto');
    pantallaInicio.classList.remove('oculto');
  });
  if (btnEscuchar) {
    btnEscuchar.addEventListener('click', function () {
      var t = textoPreguntaEl.textContent || '';
      if (t) App.tts.speak(t);
    });
  }

  pintarModos();
  pintarEstrellas();
})();