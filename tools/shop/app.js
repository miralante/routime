/* ============================================================
   Routime — La Tienda (autonomía: usar el dinero en la vida
   real). Datos en data.js. Dinero visual compartido en
   assets/js/dinero.js (App.dinero). Tres actividades:
   - Una compra: simulación guiada completa en 3 steps —
     ¿te llega? → paga (tu monedero es FINITO: cada ficha se usa
     una vez) → ¿está bien el cambio? Si no te llega y lo ves,
     eliges algo más barato; si el cambio está mal y lo ves, el
     dependiente lo corrige. Sin castigo nunca (regla 5).
   - ¿Qué me queda? y ¿Mucho o poco?: quiz de dinero sobre el
     runner genérico (mismo patrón que El Monedero): casos
     generados, pista socrática al primer fallo (regla 12) y
     explicación generada del propio caso (regla 11).
   Los gastos y referencias usan SIEMPRE el precio real del banco
   PRODUCTOS. Importes en céntimos (enteros).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'la-tienda';
  var $ = App.utils.$;

  var starsEl = $('#stars');

  var formatear = App.dinero.formatear;
  var hablado = App.dinero.hablado;
  var ariaDinero = App.dinero.aria;
  var crearFicha = App.dinero.crearFicha;
  var descomponer = App.dinero.descomponer;

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  ['completadosTienda', 'completadosQuedame', 'completadosMucho', 'completadosPaga', 'completadosFiar']
    .forEach(function (clave) { if (!progress[clave]) progress[clave] = {}; });

  function save() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function datos() { return DATA[App.i18n.locale()] || DATA.es; }
  function azar(lista) { return lista[Math.floor(Math.random() * lista.length)]; }
  function minuscula(name) { return name.charAt(0).toLowerCase() + name.slice(1); }

  /* ---- Pantallas ---- */
  var PANTALLAS = ['menuScreen', 'pantallaNiveles', 'pantallaJuegoQuiz',
    'pantallaJuegoTienda', 'endScreen'];
  function show(id) {
    PANTALLAS.forEach(function (p) { $('#' + p).classList.add('hidden'); });
    $('#' + id).classList.remove('hidden');
  }

  /* Distractores de importe: cercanos, distintos y positivos. */
  function distractoresDe(correct, paso) {
    var lista = [];
    App.utils.shuffle([paso, 100, paso * 2]).forEach(function (d) {
      [correct + d, correct - d].forEach(function (x) {
        if (x > 0 && x !== correct && lista.indexOf(x) === -1 && lista.length < 2) lista.push(x);
      });
    });
    while (lista.length < 2) lista.push(correct + (lista.length + 1) * paso);
    return lista;
  }

  /* ============================================================
     Runner genérico de quiz de dinero (patrón de El Monedero)
     ============================================================ */
  var enunciadoQuizEl = $('#enunciadoQuiz');
  var opcionesQuizEl = $('#opcionesQuiz');
  var feedbackQuizEl = $('#feedbackQuiz');
  var explicacionQuizWrap = $('#explicacionQuizWrap');
  var explicacionQuizEl = $('#explicacionQuiz');
  var btnNextQuiz = $('#btnSiguienteQuiz');

  var actividadActual = 'tienda';
  var nivelQ = null;
  var casoQ = null;
  var idxQ = 0;
  var aciertosQ = 0;
  var intentosQ = 0;
  var resueltoQ = false;
  var opcionBotones = [];

  function cfgActual() { return ACTIVIDADES[actividadActual]; }

  function mostrarTextoQuiz(text) {
    explicacionQuizEl.textContent = text;
    explicacionQuizWrap.classList.remove('hidden');
  }

  function pintarMesaQuiz(piezas) {
    var mesaEl = $('#mesaDinero');
    App.dinero.pintarFichas(mesaEl, piezas);
    mesaEl.classList.toggle('hidden', !piezas || !piezas.length);
  }

  function pintarProgresoQuiz() {
    var total = datos().porRonda;
    $('#progressQuizFill').style.width = (idxQ / total * 100) + '%';
    $('#progressQuizText').textContent = '';
  }

  function iniciarRondaQuiz(nivel) {
    nivelQ = nivel;
    idxQ = 0;
    aciertosQ = 0;
    if (cfgActual().alIniciar) cfgActual().alIniciar();
    show('pantallaJuegoQuiz');
    renderQuiz();
  }

  function renderQuiz() {
    var cfg = cfgActual();
    casoQ = cfg.generar(nivelQ);
    intentosQ = 0;
    resueltoQ = false;
    feedbackQuizEl.textContent = '';
    feedbackQuizEl.className = 'feedback';
    explicacionQuizWrap.classList.add('hidden');
    explicacionQuizEl.textContent = '';
    btnNextQuiz.classList.add('hidden');

    enunciadoQuizEl.textContent = cfg.enunciado(casoQ);
    pintarMesaQuiz(cfg.mesa ? cfg.mesa(casoQ) : null);

    opcionesQuizEl.innerHTML = '';
    opcionBotones = [];
    cfg.options(casoQ).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.textContent;
      btn.addEventListener('click', function () { responderQuiz(btn, op); });
      opcionesQuizEl.appendChild(btn);
      opcionBotones.push({ btn: btn, op: op });
    });

    pintarProgresoQuiz();
    renderStars();
  }

  function resolverQuiz(bien) {
    var cfg = cfgActual();
    resueltoQ = true;
    opcionBotones.forEach(function (par) {
      par.btn.disabled = true;
      if (par.op.correcta) par.btn.classList.add('correcta');
    });
    mostrarTextoQuiz(cfg.explicacion(casoQ, bien));
    btnNextQuiz.classList.remove('hidden');
    btnNextQuiz.focus();
  }

  function responderQuiz(btn, op) {
    if (resueltoQ) return;
    if (op.correcta) {
      if (intentosQ === 0) {
        aciertosQ += 1;
        progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
        save();
        renderStars();
      }
      App.feedback.success(feedbackQuizEl);
      resolverQuiz(true);
      return;
    }
    intentosQ += 1;
    btn.classList.add('animo');
    btn.disabled = true;
    App.feedback.encourage(feedbackQuizEl);
    if (intentosQ === 1) {
      mostrarTextoQuiz(cfgActual().pista(casoQ));
      App.feedback.lockUntilAck(opcionBotones.map(function (p) { return p.btn; }), explicacionQuizWrap);
    } else {
      resolverQuiz(false);
    }
  }

  function nextQuiz() {
    idxQ += 1;
    if (idxQ >= datos().porRonda) endRound(aciertosQ, nivelQ);
    else renderQuiz();
  }

  /* ============================================================
     Quiz activities configuration
     ============================================================ */
  var saldoQ = 0;      /* "What's left?": running balance of the sequence */
  var gastoIdxQ = 0;
  var semana = null;   /* Weekly allowance: {saldo, objetivo, dia} */

  var ACTIVIDADES = {

    /* --- "What's left?" — chained subtraction of real expenses --- */
    quedame: {
      esQuiz: true,
      instruccion: 'instruccionQuedame',
      progresoClave: 'completadosQuedame',
      resumen: 'resumenQuedame',
      niveles: function () { return datos().importe.niveles; },
      alIniciar: function () { saldoQ = 0; gastoIdxQ = 0; },
      generar: function (nivel) {
        /* Every 3 expenses a new sequence starts with a bill. */
        var candidatos = [];
        var filtrar = function () {
          return datos().productos.filter(function (p) {
            return p.bucket === nivel.id && p.precioCent < saldoQ;
          });
        };
        if (gastoIdxQ % 3 === 0) saldoQ = azar([1000, 2000]);
        candidatos = filtrar();
        if (!candidatos.length) {
          /* Less left than the cheapest product: new bill. */
          saldoQ = azar([1000, 2000]);
          candidatos = filtrar();
        }
        gastoIdxQ += 1;
        var producto = azar(candidatos);
        var queda = saldoQ - producto.precioCent;
        var caso = {
          saldo: saldoQ,
          picto: producto.picto,
          name: producto.name,
          gasto: producto.precioCent,
          queda: queda,
          importes: App.utils.shuffle([queda].concat(distractoresDe(queda, nivel.paso)))
        };
        saldoQ = queda;   /* el siguiente gasto parte de lo que queda */
        return caso;
      },
      enunciado: function (caso) {
        return caso.picto + ' ' + App.i18n.t('enunciadoQuedame')
          .replace('{saldo}', formatear(caso.saldo))
          .replace('{name}', minuscula(caso.name))
          .replace('{gasto}', formatear(caso.gasto));
      },
      mesa: function (caso) { return descomponer(caso.saldo); },
      options: function (caso) {
        return caso.importes.map(function (cent) {
          return { text: formatear(cent), correcta: cent === caso.queda };
        });
      },
      pista: function () { return App.i18n.t('pistaQuedame'); },
      explicacion: function (caso, bien) {
        return App.i18n.t(bien ? 'explicacionQuedameBien' : 'explicacionQuedameCasi')
          .replace('{saldo}', formatear(caso.saldo))
          .replace('{name}', caso.name)
          .replace('{gasto}', formatear(caso.gasto))
          .replace('{queda}', formatear(caso.queda));
      }
    },

    /* --- ¿Mucho o poco? — sentido del precio --- */
    mucho: {
      esQuiz: true,
      instruccion: 'instruccionMucho',
      progresoClave: 'completadosMucho',
      resumen: 'resumenMucho',
      niveles: function () { return datos().mucho.niveles; },
      generar: function (nivel) {
        var producto = azar(datos().productos);
        var esBien = Math.random() < 0.5;
        var mostrado = esBien ? producto.precioCent : producto.precioCent * nivel.mult;
        return {
          picto: producto.picto,
          name: producto.name,
          ref: producto.precioCent,
          mostrado: mostrado,
          esBien: esBien
        };
      },
      enunciado: function (caso) {
        return caso.picto + ' ' + App.i18n.t('enunciadoMucho')
          .replace('{name}', caso.name)
          .replace('{mostrado}', formatear(caso.mostrado));
      },
      mesa: function () { return null; },
      /* Two options in fixed order (rule 11: max 3). */
      options: function (caso) {
        return [
          { text: App.i18n.t('estaBien'), correcta: caso.esBien },
          { text: App.i18n.t('esDemasiado'), correcta: !caso.esBien }
        ];
      },
      pista: function (caso) {
        return App.i18n.t('pistaMucho').replace('{name}', minuscula(caso.name));
      },
      explicacion: function (caso) {
        return App.i18n.t(caso.esBien ? 'explicacionMuchoBien' : 'explicacionMuchoMal')
          .replace('{name}', minuscula(caso.name))
          .replace('{ref}', formatear(caso.ref))
          .replace('{mostrado}', formatear(caso.mostrado));
      }
    },

    /* --- Weekly allowance — budgeting with a goal --- */
    paga: {
      esQuiz: true,
      instruccion: 'instruccionPaga',
      progresoClave: 'completadosPaga',
      resumen: 'resumenPaga',
      niveles: function () { return datos().importe.niveles; },
      alIniciar: function () { semana = null; },
      generar: function (nivel) {
        if (!semana || semana.dia >= 6) {
          /* New week: 20 € allowance and Saturday's goal from the
             level's bucket (so the calculations respect rule 13). */
          var objetivos = datos().productos.filter(function (p) {
            return p.bucket === nivel.id && p.precioCent >= 300 && p.precioCent <= 1000;
          });
          semana = { saldo: 2000, objetivo: azar(objetivos), dia: 0 };
        }
        semana.dia += 1;
        var caso;
        if (semana.dia === 6) {
          /* Saturday: the reward. It always fits by construction
             (only bought if there's still enough for the goal). */
          caso = {
            dia: semana.dia,
            saldo: semana.saldo,
            picto: semana.objetivo.picto,
            name: semana.objetivo.name,
            precio: semana.objetivo.precioCent,
            objetivo: semana.objetivo,
            esSabado: true,
            sePuede: true,
            quedaria: semana.saldo - semana.objetivo.precioCent
          };
        } else {
          var tentaciones = datos().productos.filter(function (p) {
            return p.bucket === nivel.id && p.precioCent < semana.saldo && p !== semana.objetivo;
          });
          var producto = azar(tentaciones);
          var sePuede = (semana.saldo - producto.precioCent) >= semana.objetivo.precioCent;
          caso = {
            dia: semana.dia,
            saldo: semana.saldo,
            picto: producto.picto,
            name: producto.name,
            precio: producto.precioCent,
            objetivo: semana.objetivo,
            esSabado: false,
            sePuede: sePuede,
            quedaria: semana.saldo - producto.precioCent
          };
          /* The balance ALWAYS evolves based on the correct action:
             failing never ruins the week (rule 5). */
          if (sePuede) semana.saldo -= producto.precioCent;
        }
        return caso;
      },
      enunciado: function (caso) {
        var clave = caso.esSabado ? 'enunciadoPagaSabado' : 'enunciadoPagaDia';
        return caso.picto + ' ' + App.i18n.t(clave)
          .replace('{dia}', App.i18n.t('dia' + caso.dia))
          .replace('{saldo}', formatear(caso.saldo))
          .replace('{name}', minuscula(caso.name))
          .replace('{precio}', formatear(caso.precio));
      },
      mesa: function (caso) { return descomponer(caso.saldo); },
      options: function (caso) {
        return [
          { text: App.i18n.t('si'), correcta: caso.sePuede },
          { text: App.i18n.t('no'), correcta: !caso.sePuede }
        ];
      },
      pista: function (caso) {
        return App.i18n.t('pistaPaga').replace('{objetivo}', minuscula(caso.objetivo.name));
      },
      explicacion: function (caso) {
        if (caso.esSabado) {
          return App.i18n.t('explicacionPagaSabado')
            .replace('{saldo}', formatear(caso.saldo))
            .replace('{name}', minuscula(caso.name))
            .replace('{precio}', formatear(caso.precio))
            .replace('{queda}', formatear(caso.quedaria));
        }
        return App.i18n.t(caso.sePuede ? 'explicacionPagaSi' : 'explicacionPagaNo')
          .replace('{saldo}', formatear(caso.saldo))
          .replace('{name}', minuscula(caso.name))
          .replace('{precio}', formatear(caso.precio))
          .replace('{queda}', formatear(caso.quedaria))
          .replace('{objetivo}', minuscula(caso.objetivo.name))
          .replace('{precioObjetivo}', formatear(caso.objetivo.precioCent));
      }
    },

    /* --- ¿Es de fiar? — gangas sospechosas (antesala de estafas) --- */
    fiar: {
      esQuiz: true,
      instruccion: 'instruccionFiar',
      progresoClave: 'completadosFiar',
      resumen: 'resumenFiar',
      niveles: function () { return datos().fiar.niveles; },
      generar: function (nivel) {
        /* Solo productos con referencia alta: la ganga se tiene
           que VER (≥ 4,50 €). */
        var candidatos = datos().productos.filter(function (p) { return p.precioCent >= 450; });
        var producto = azar(candidatos);
        var esFiable = Math.random() < 0.5;
        var mostrado = producto.precioCent;
        if (!esFiable) {
          mostrado = Math.max(5, Math.round(producto.precioCent / nivel.div / 5) * 5);
        }
        return {
          picto: producto.picto,
          name: producto.name,
          ref: producto.precioCent,
          mostrado: mostrado,
          esFiable: esFiable,
          contexto: 1 + Math.floor(Math.random() * 3)
        };
      },
      enunciado: function (caso) {
        return caso.picto + ' ' + App.i18n.t('enunciadoFiar')
          .replace('{contexto}', App.i18n.t('contextoFiar' + caso.contexto))
          .replace('{name}', minuscula(caso.name))
          .replace('{precio}', formatear(caso.mostrado));
      },
      mesa: function () { return null; },
      options: function (caso) {
        return [
          { text: App.i18n.t('pareceFiar'), correcta: caso.esFiable },
          { text: App.i18n.t('sospechoso'), correcta: !caso.esFiable }
        ];
      },
      pista: function (caso) {
        return App.i18n.t('pistaFiar').replace('{name}', minuscula(caso.name));
      },
      explicacion: function (caso) {
        return App.i18n.t(caso.esFiable ? 'explicacionFiarBien' : 'explicacionFiarMal')
          .replace('{name}', caso.name)
          .replace('{ref}', formatear(caso.ref))
          .replace('{mostrado}', formatear(caso.mostrado));
      }
    },

    /* --- Una compra — motor propio de 3 steps --- */
    tienda: {
      esQuiz: false,
      instruccion: 'instruccionTienda',
      progresoClave: 'completadosTienda',
      resumen: 'resumenTienda',
      niveles: function () { return datos().importe.niveles; }
    }
  };

  /* ============================================================
     Menú, niveles y final (compartidos)
     ============================================================ */
  function abrirActividad(id) {
    actividadActual = id;
    var cfg = cfgActual();
    $('#instruccionActividad').textContent = '';
    renderLevels();
    show('pantallaNiveles');
  }

  function renderLevels() {
    var cfg = cfgActual();
    var cont = $('#niveles');
    cont.innerHTML = '';
    cfg.niveles().forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progress[cfg.progresoClave][n.id] || 0;
      btn.innerHTML = n.name + ' — ' + n.descripcion ;

      btn.addEventListener('click', function () {
        if (cfg.esQuiz) iniciarRondaQuiz(n);
        else iniciarRondaTienda(n);
      });
      cont.appendChild(btn);
    });
  }

  function endRound(aciertos, nivel) {
    var cfg = cfgActual();
    progress[cfg.progresoClave][nivel.id] = (progress[cfg.progresoClave][nivel.id] || 0) + 1;
    save();
    var total = cfg.esQuiz ? datos().porRonda : datos().porRondaTienda;
    $('#resumenFinal').textContent = '';
$('#transferencia').textContent = '';
    show('endScreen');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ============================================================
     Una compra — motor de 3 steps
     ============================================================ */
  var enunciadoTiendaEl = $('#enunciadoTienda');
  var mesaTiendaEl = $('#mesaTienda');
  var mostradorEl = $('#mostrador');
  var zonaPagoEl = $('#zonaPago');
  var accionesTiendaEl = $('#accionesTienda');
  var feedbackTiendaEl = $('#feedbackTienda');
  var explicacionTiendaWrap = $('#explicacionTiendaWrap');
  var explicacionTiendaEl = $('#explicacionTienda');
  var btnContinuarTienda = $('#btnContinuarTienda');

  var nivelT = null;
  var compraIdx = 0;
  var aciertosT = 0;
  var compra = null;         /* state of the purchase in progress */
  var intentosPaso = 0;
  var alContinuar = null;    /* what to do when Continue is tapped */

  function generarCompra(nivel) {
    var bucket = datos().productos.filter(function (p) { return p.bucket === nivel.id; });
    var llega = Math.random() < 0.5;
    var producto, alternativo, total;
    if (llega) {
      producto = azar(bucket);
      alternativo = null;
      total = producto.precioCent + azar([0, 100, 200, 500]);
    } else {
      /* The wallet isn't enough for 'producto', but is enough for a
         cheaper one (frustration-free resolution). */
      var ordenados = bucket.slice().sort(function (a, b) { return a.precioCent - b.precioCent; });
      producto = azar(ordenados.slice(1));
      var baratos = ordenados.filter(function (x) { return x.precioCent < producto.precioCent; });
      alternativo = azar(baratos);
      var hueco = producto.precioCent - alternativo.precioCent;
      /* Better with some leftover: this way the change step is
         also practiced in the "not enough" branch. */
      var extras = [nivel.paso, 100, 200].filter(function (e) { return e < hueco; });
      total = alternativo.precioCent + (extras.length ? azar(extras) : 0);
    }
    return {
      producto: producto,
      alternativo: alternativo,
      llega: llega,
      monedero: App.utils.shuffle(descomponer(total)),
      enMostrador: [],
      pagado: 0,
      cambioBueno: 0,
      cambioMostrado: [],
      cambioEsBien: true,
      fallo: false
    };
  }

  function totalMonedero() {
    return compra.monedero.reduce(function (s, c) { return s + c; }, 0);
  }
  function totalMostrador() {
    return compra.enMostrador.reduce(function (s, c) { return s + c; }, 0);
  }

  function pintarProgresoTienda() {
    var total = datos().porRondaTienda;
    $('#progressTiendaFill').style.width = (compraIdx / total * 100) + '%';
    $('#progressTiendaText').textContent = '';
  }

  function pintarCartel() {
    $('#productoTienda').textContent = '';
    $('#precioTienda').textContent = '';
    $('#cartelProducto').classList.remove('hidden');
  }

  function limpiarPasoTienda() {
    feedbackTiendaEl.textContent = '';
    feedbackTiendaEl.className = 'feedback';
    explicacionTiendaWrap.classList.add('hidden');
    explicacionTiendaEl.textContent = '';
    btnContinuarTienda.classList.add('hidden');
    accionesTiendaEl.innerHTML = '';
    intentosPaso = 0;
  }

  function mostrarTextoTienda(text) {
    explicacionTiendaEl.textContent = text;
    explicacionTiendaWrap.classList.remove('hidden');
  }

  function ofrecerContinuar(fn) {
    alContinuar = fn;
    accionesTiendaEl.innerHTML = '';
    btnContinuarTienda.classList.remove('hidden');
    btnContinuarTienda.focus();
  }

  function botonesSiNo(alResponder) {
    accionesTiendaEl.innerHTML = '';
    [{ clave: 'si', valor: true }, { clave: 'no', valor: false }].forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = App.i18n.t(op.clave);
      btn.addEventListener('click', function () { alResponder(btn, op.valor); });
      accionesTiendaEl.appendChild(btn);
    });
  }

  function iniciarRondaTienda(nivel) {
    nivelT = nivel;
    compraIdx = 0;
    aciertosT = 0;
    show('pantallaJuegoTienda');
    nuevaCompra();
  }

  function nuevaCompra() {
    compra = generarCompra(nivelT);
    pintarProgresoTienda();
    renderStars();
    montarPaso1();
  }

  /* ---- Paso 1: ¿te llega? ---- */
  function montarPaso1() {
    limpiarPasoTienda();
    pintarCartel();
    zonaPagoEl.classList.add('hidden');
    App.dinero.pintarFichas(mesaTiendaEl, compra.monedero);
    mesaTiendaEl.classList.remove('hidden');
    var text = App.i18n.t('paso1Enunciado')
      .replace('{name}', compra.producto.name)
      .replace('{precio}', formatear(compra.producto.precioCent));
    enunciadoTiendaEl.textContent = text;
    botonesSiNo(responderPaso1);
  }

  function resolverPaso1() {
    var clave = compra.llega ? 'explicaLlega' : 'explicaNoLlega';
    var text = App.i18n.t(clave)
      .replace('{total}', formatear(totalMonedero()))
      .replace('{precio}', formatear(compra.producto.precioCent));
    if (!compra.llega) {
      text += ' ' + App.i18n.t('resolucionNoLlega')
        .replace('{name}', minuscula(compra.alternativo.name))
        .replace('{precio}', formatear(compra.alternativo.precioCent));
    }
    mostrarTextoTienda(text);
    ofrecerContinuar(function () {
      if (!compra.llega) {
        compra.producto = compra.alternativo;   /* eliges lo barato */
      }
      montarPaso2();
    });
  }

  function responderPaso1(btn, dijoSi) {
    if (dijoSi === compra.llega) {
      App.feedback.success(feedbackTiendaEl);
      resolverPaso1();
      return;
    }
    intentosPaso += 1;
    compra.fallo = true;
    btn.classList.add('animo');
    btn.disabled = true;
    App.feedback.encourage(feedbackTiendaEl);
    if (intentosPaso === 1) {
      mostrarTextoTienda(App.i18n.t('pistaPaso1'));
      App.feedback.lockUntilAck(App.utils.$$('.btn-opcion', accionesTiendaEl), explicacionTiendaWrap);
    } else {
      resolverPaso1();
    }
  }

  /* ---- Paso 2: paga (monedero finito) ---- */
  function montarPaso2() {
    limpiarPasoTienda();
    pintarCartel();
    enunciadoTiendaEl.textContent = App.i18n.t('paso2Enunciado')
      .replace('{precio}', formatear(compra.producto.precioCent));
    zonaPagoEl.classList.remove('hidden');
    pintarPago();
    var btnPagar = document.createElement('button');
    btnPagar.type = 'button';
    btnPagar.className = 'btn';
    btnPagar.textContent = App.i18n.t('btnPagar');
    btnPagar.addEventListener('click', pagar);
    accionesTiendaEl.innerHTML = '';
    accionesTiendaEl.appendChild(btnPagar);
  }

  /* El monedero y el mostrador: tocar una ficha la mueve al otro
     lado. Cada ficha existe UNA vez, como en la vida real. */
  function pintarPago() {
    mesaTiendaEl.innerHTML = '';
    compra.monedero.forEach(function (cent, i) {
      var btn = crearFicha(cent, true);
      btn.setAttribute('aria-label', ariaDinero(cent));
      btn.addEventListener('click', function () {
        compra.monedero.splice(i, 1);
        compra.enMostrador.push(cent);
        pintarPago();
      });
      mesaTiendaEl.appendChild(btn);
    });
    mostradorEl.innerHTML = '';
    compra.enMostrador.forEach(function (cent, i) {
      var btn = crearFicha(cent, true);
      btn.setAttribute('aria-label', App.i18n.t('ariaQuitarDelMostrador').replace('{d}', ariaDinero(cent)));
      btn.addEventListener('click', function () {
        compra.enMostrador.splice(i, 1);
        compra.monedero.push(cent);
        pintarPago();
      });
      mostradorEl.appendChild(btn);
    });
    $('#totalMostrador').textContent = '';
  }

  function pagar() {
    var precio = compra.producto.precioCent;
    var puesto = totalMostrador();
    if (puesto < precio) {
      intentosPaso += 1;
      compra.fallo = true;
      App.feedback.encourage(feedbackTiendaEl);
      var text = intentosPaso === 1 ? App.i18n.t('faltaDinero1') :
        App.i18n.t('faltaDinero2').replace('{dif}', hablado(precio - puesto));
      mostrarTextoTienda(text);
      return;
    }
    compra.pagado = puesto;
    compra.cambioBueno = puesto - precio;
    App.feedback.success(feedbackTiendaEl);
    if (compra.cambioBueno === 0) {
      /* Pago justo: no hay cambio que revisar. */
      mostrarTextoTienda(App.i18n.t('pagoJusto'));
      ofrecerContinuar(terminarCompra);
      return;
    }
    montarPaso3();
  }

  /* ---- Step 3: is the change correct? ---- */
  function montarPaso3() {
    limpiarPasoTienda();
    $('#cartelProducto').classList.add('hidden');
    zonaPagoEl.classList.add('hidden');

    compra.cambioEsBien = Math.random() < 0.5;
    var mostrado = compra.cambioBueno;
    if (!compra.cambioEsBien) {
      var deltas = App.utils.shuffle([nivelT.paso, -nivelT.paso, 100, -100]);
      for (var k = 0; k < deltas.length; k++) {
        var m = compra.cambioBueno + deltas[k];
        if (m > 0 && m !== compra.cambioBueno) { mostrado = m; break; }
      }
      compra.cambioEsBien = mostrado === compra.cambioBueno;
    }
    compra.cambioMostrado = descomponer(mostrado);

    App.dinero.pintarFichas(mesaTiendaEl, compra.cambioMostrado);
    mesaTiendaEl.classList.remove('hidden');
    enunciadoTiendaEl.textContent = App.i18n.t('paso3Enunciado')
      .replace('{pagado}', formatear(compra.pagado))
      .replace('{precio}', formatear(compra.producto.precioCent));
    botonesSiNo(responderPaso3);
  }

  function resolverPaso3() {
    var mostrado = compra.cambioMostrado.reduce(function (s, c) { return s + c; }, 0);
    var text = App.i18n.t(compra.cambioEsBien ? 'explicaCambioBien' : 'explicaCambioMal')
      .replace('{bueno}', formatear(compra.cambioBueno))
      .replace('{mostrado}', formatear(mostrado));
    text += ' ' + App.i18n.t(compra.cambioEsBien ? 'resolucionCambioBien' : 'resolucionCambioMal');
    if (!compra.cambioEsBien) {
      /* El dependiente lo corrige a la vista. */
      App.dinero.pintarFichas(mesaTiendaEl, descomponer(compra.cambioBueno));
    }
    mostrarTextoTienda(text);
    ofrecerContinuar(terminarCompra);
  }

  function responderPaso3(btn, dijoSi) {
    if (dijoSi === compra.cambioEsBien) {
      App.feedback.success(feedbackTiendaEl);
      resolverPaso3();
      return;
    }
    intentosPaso += 1;
    compra.fallo = true;
    btn.classList.add('animo');
    btn.disabled = true;
    App.feedback.encourage(feedbackTiendaEl);
    if (intentosPaso === 1) {
      mostrarTextoTienda(App.i18n.t('pistaPaso3'));
      App.feedback.lockUntilAck(App.utils.$$('.btn-opcion', accionesTiendaEl), explicacionTiendaWrap);
    } else {
      resolverPaso3();
    }
  }

  function terminarCompra() {
    if (!compra.fallo) {
      aciertosT += 1;
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      renderStars();
    }
    compraIdx += 1;
    if (compraIdx >= datos().porRondaTienda) endRound(aciertosT, nivelT);
    else nuevaCompra();
  }

  /* ---- Eventos ---- */
  App.utils.$$('.tarjeta-actividad').forEach(function (btn) {
    btn.addEventListener('click', function () { abrirActividad(btn.getAttribute('data-actividad')); });
  });
  var btnVolverMenuNiveles = $('#btnVolverMenuNiveles');
  if (btnVolverMenuNiveles) btnVolverMenuNiveles.addEventListener('click', function () { show('menuScreen'); });
  var btnVolverMenuFinal = $('#btnVolverMenuFinal');
  if (btnVolverMenuFinal) btnVolverMenuFinal.addEventListener('click', function () { show('menuScreen'); });

  btnNextQuiz.addEventListener('click', nextQuiz);
  var btnEnunciadoQuiz = $('#btnEnunciadoQuiz');
  if (btnEnunciadoQuiz) btnEnunciadoQuiz.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(enunciadoQuizEl.textContent);
  });

  btnContinuarTienda.addEventListener('click', function () {
    var fn = alContinuar;
    alContinuar = null;
    if (fn) fn();
  });
  var btnEnunciadoTienda = $('#btnEnunciadoTienda');
  if (btnEnunciadoTienda) btnEnunciadoTienda.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(enunciadoTiendaEl.textContent);
  });

  $('#btnRepeat').addEventListener('click', function () {
    if (cfgActual().esQuiz) iniciarRondaQuiz(nivelQ);
    else iniciarRondaTienda(nivelT);
  });
  var btnOtroNivelFinal = $('#btnOtroNivelFinal');
  if (btnOtroNivelFinal) btnOtroNivelFinal.addEventListener('click', function () { abrirActividad(actividadActual); });

  renderStars();
})();

