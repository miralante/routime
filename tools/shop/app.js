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
  var ariaMoney = App.dinero.aria;
  var createCard = App.dinero.crearFicha;
  var descomponer = App.dinero.descomponer;

  /* Persistent progress */
  var progress = App.storage.getWithStars(TOOL_ID);
  ['completadosTienda', 'completadosQuedame', 'completadosMucho', 'completadosPaga', 'completadosFiar']
    .forEach(function (key) { if (!progress[key]) progress[key] = {}; });

  var glue = App.activityGlue({
    toolId: TOOL_ID,
    progress: function () { return progress; },
    starsEl: function () { return starsEl; }
  });
  var save = glue.save, renderStars = glue.paintStars;
  function datos() { return DATA[App.i18n.locale()] || DATA.es; }
  function azar(list) { return list[Math.floor(Math.random() * list.length)]; }
  function minuscula(name) { return name.charAt(0).toLowerCase() + name.slice(1); }

  /* ---- Pantallas ---- */
  var SCREENS = ['menuScreen', 'pantallaNiveles', 'pantallaJuegoQuiz',
    'pantallaJuegoTienda', 'endScreen'];
  function show(id) {
    SCREENS.forEach(function (p) { $('#' + p).classList.add('hidden'); });
    $('#' + id).classList.remove('hidden');
  }

  /* Distractores de importe: cercanos, distintos y positivos. */
  function distractoresDe(correct, step) {
    var list = [];
    App.utils.shuffle([step, 100, step * 2]).forEach(function (d) {
      [correct + d, correct - d].forEach(function (x) {
        if (x > 0 && x !== correct && list.indexOf(x) === -1 && list.length < 2) list.push(x);
      });
    });
    while (list.length < 2) list.push(correct + (list.length + 1) * step);
    return list;
  }

  /* ============================================================
     Runner genérico de quiz de dinero (patrón de El Monedero)
     ============================================================ */
  var enunciadoQuizEl = $('#enunciadoQuiz');
  var optionsQuizEl = $('#optionsQuiz');
  var feedbackQuizEl = $('#feedbackQuiz');
  var explanationQuizWrap = $('#explanationQuizWrap');
  var explanationQuizEl = $('#explanationQuiz');
  var btnNextQuiz = $('#btnNextQuiz');

  var activityCurrent = 'tienda';
  var levelQ = null;
  var instanceQ = null;
  var idxQ = 0;
  var hitsQ = 0;
  var attemptsQ = 0;
  var resueltoQ = false;
  var opcionBotones = [];

  function cfgCurrent() { return ACTIVIDADES[activityCurrent]; }

  function showTextQuiz(text) {
    explanationQuizEl.textContent = text;
    explanationQuizWrap.classList.remove('hidden');
  }

  function paintTableQuiz(pieces) {
    var tableEl = $('#mesaDinero');
    App.dinero.pintarFichas(tableEl, pieces);
    tableEl.classList.toggle('hidden', !pieces || !pieces.length);
  }

  function paintProgressQuiz() {
    var total = datos().porRonda;
    $('#progressQuizFill').style.width = (idxQ / total * 100) + '%';
    $('#progressQuizText').textContent = '';
  }

  function startRoundQuiz(level) {
    levelQ = level;
    idxQ = 0;
    hitsQ = 0;
    if (cfgCurrent().alIniciar) cfgCurrent().alIniciar();
    show('pantallaJuegoQuiz');
    renderQuiz();
  }

  function renderQuiz() {
    var cfg = cfgCurrent();
    instanceQ = cfg.generar(levelQ);
    attemptsQ = 0;
    resueltoQ = false;
    feedbackQuizEl.textContent = '';
    feedbackQuizEl.className = 'feedback';
    explanationQuizWrap.classList.add('hidden');
    explanationQuizEl.textContent = '';
    btnNextQuiz.classList.add('hidden');

    enunciadoQuizEl.textContent = cfg.enunciado(instanceQ);
    paintTableQuiz(cfg.mesa ? cfg.mesa(instanceQ) : null);

    optionsQuizEl.innerHTML = '';
    opcionBotones = [];
    cfg.options(instanceQ).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.text;
      btn.addEventListener('click', function () { answerQuiz(btn, op); });
      optionsQuizEl.appendChild(btn);
      opcionBotones.push({ btn: btn, op: op });
    });

    paintProgressQuiz();
    renderStars();
  }

  function solveQuiz(bien) {
    var cfg = cfgCurrent();
    resueltoQ = true;
    opcionBotones.forEach(function (par) {
      par.btn.disabled = true;
      if (par.op.correcta) par.btn.classList.add('correcta');
    });
    showTextQuiz(cfg.explicacion(instanceQ, bien));
    btnNextQuiz.classList.remove('hidden');
    btnNextQuiz.focus();
  }

  function answerQuiz(btn, op) {
    if (resueltoQ) return;
    if (op.correcta) {
      if (attemptsQ === 0) {
        hitsQ += 1;
        progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
        save();
        renderStars();
      }
      App.feedback.success(feedbackQuizEl);
      solveQuiz(true);
      return;
    }
    attemptsQ += 1;
    btn.classList.add('animo');
    btn.disabled = true;
    App.feedback.encourage(feedbackQuizEl);
    if (attemptsQ === 1) {
      showTextQuiz(cfgCurrent().pista(instanceQ));
      App.feedback.lockUntilAck(opcionBotones.map(function (p) { return p.btn; }), explanationQuizWrap);
    } else {
      solveQuiz(false);
    }
  }

  function nextQuiz() {
    idxQ += 1;
    if (idxQ >= datos().porRonda) endRound(hitsQ, levelQ);
    else renderQuiz();
  }

  /* ============================================================
     Quiz activities configuration
     ============================================================ */
  var balanceQ = 0;      /* "What's left?": running balance of the sequence */
  var gastoIdxQ = 0;
  var week = null;   /* Weekly allowance: {saldo, objetivo, dia} */

  var ACTIVIDADES = {

    /* --- "What's left?" — chained subtraction of real expenses --- */
    quedame: {
      esQuiz: true,
      instruccion: 'instruccionQuedame',
      progresoClave: 'completadosQuedame',
      resumen: 'resumenQuedame',
      niveles: function () { return datos().importe.niveles; },
      alIniciar: function () { balanceQ = 0; gastoIdxQ = 0; },
      generar: function (level) {
        /* Every 3 expenses a new sequence starts with a bill. */
        var candidatos = [];
        var filtrar = function () {
          return datos().productos.filter(function (p) {
            return p.bucket === level.id && p.precioCent < balanceQ;
          });
        };
        if (gastoIdxQ % 3 === 0) balanceQ = azar([1000, 2000]);
        candidatos = filtrar();
        if (!candidatos.length) {
          /* Less left than the cheapest product: new bill. */
          balanceQ = azar([1000, 2000]);
          candidatos = filtrar();
        }
        gastoIdxQ += 1;
        var product = azar(candidatos);
        var queda = balanceQ - product.precioCent;
        var instance = {
          saldo: balanceQ,
          picto: product.picto,
          name: product.name,
          gasto: product.precioCent,
          queda: queda,
          importes: App.utils.shuffle([queda].concat(distractoresDe(queda, level.paso)))
        };
        balanceQ = queda;   /* el siguiente gasto parte de lo que queda */
        return instance;
      },
      enunciado: function (instance) {
        return instance.picto + ' ' + App.i18n.t('enunciadoQuedame')
          .replace('{saldo}', formatear(instance.saldo))
          .replace('{name}', minuscula(instance.name))
          .replace('{gasto}', formatear(instance.gasto));
      },
      mesa: function (instance) { return descomponer(instance.saldo); },
      options: function (instance) {
        return instance.importes.map(function (cent) {
          return { text: formatear(cent), correcta: cent === instance.queda };
        });
      },
      pista: function () { return App.i18n.t('pistaQuedame'); },
      explicacion: function (instance, bien) {
        return App.i18n.t(bien ? 'explicacionQuedameBien' : 'explicacionQuedameCasi')
          .replace('{saldo}', formatear(instance.saldo))
          .replace('{name}', instance.name)
          .replace('{gasto}', formatear(instance.gasto))
          .replace('{queda}', formatear(instance.queda));
      }
    },

    /* --- ¿Mucho o poco? — sentido del precio --- */
    mucho: {
      esQuiz: true,
      instruccion: 'instruccionMucho',
      progresoClave: 'completadosMucho',
      resumen: 'resumenMucho',
      niveles: function () { return datos().mucho.niveles; },
      generar: function (level) {
        var product = azar(datos().productos);
        var esBien = Math.random() < 0.5;
        var shown = esBien ? product.precioCent : product.precioCent * level.mult;
        return {
          picto: product.picto,
          name: product.name,
          ref: product.precioCent,
          mostrado: shown,
          esBien: esBien
        };
      },
      enunciado: function (instance) {
        return instance.picto + ' ' + App.i18n.t('enunciadoMucho')
          .replace('{name}', instance.name)
          .replace('{mostrado}', formatear(instance.mostrado));
      },
      mesa: function () { return null; },
      /* Two options in fixed order (rule 11: max 3). */
      options: function (instance) {
        return [
          { text: App.i18n.t('estaBien'), correcta: instance.esBien },
          { text: App.i18n.t('esDemasiado'), correcta: !instance.esBien }
        ];
      },
      pista: function (instance) {
        return App.i18n.t('pistaMucho').replace('{name}', minuscula(instance.name));
      },
      explicacion: function (instance) {
        return App.i18n.t(instance.esBien ? 'explicacionMuchoBien' : 'explicacionMuchoMal')
          .replace('{name}', minuscula(instance.name))
          .replace('{ref}', formatear(instance.ref))
          .replace('{mostrado}', formatear(instance.mostrado));
      }
    },

    /* --- Weekly allowance — budgeting with a goal --- */
    paga: {
      esQuiz: true,
      instruccion: 'instruccionPaga',
      progresoClave: 'completadosPaga',
      resumen: 'resumenPaga',
      niveles: function () { return datos().importe.niveles; },
      alIniciar: function () { week = null; },
      generar: function (level) {
        if (!week || week.dia >= 6) {
          /* New week: 20 € allowance and Saturday's goal from the
             level's bucket (so the calculations respect rule 13). */
          var objetivos = datos().productos.filter(function (p) {
            return p.bucket === level.id && p.precioCent >= 300 && p.precioCent <= 1000;
          });
          week = { saldo: 2000, objetivo: azar(objetivos), dia: 0 };
        }
        week.dia += 1;
        var instance;
        if (week.dia === 6) {
          /* Saturday: the reward. It always fits by construction
             (only bought if there's still enough for the goal). */
          instance = {
            dia: week.dia,
            saldo: week.saldo,
            picto: week.objetivo.picto,
            name: week.objetivo.name,
            precio: week.objetivo.precioCent,
            objetivo: week.objetivo,
            esSabado: true,
            sePuede: true,
            quedaria: week.saldo - week.objetivo.precioCent
          };
        } else {
          var tentaciones = datos().productos.filter(function (p) {
            return p.bucket === level.id && p.precioCent < week.saldo && p !== week.objetivo;
          });
          var product = azar(tentaciones);
          var sePuede = (week.saldo - product.precioCent) >= week.objetivo.precioCent;
          instance = {
            dia: week.dia,
            saldo: week.saldo,
            picto: product.picto,
            name: product.name,
            precio: product.precioCent,
            objetivo: week.objetivo,
            esSabado: false,
            sePuede: sePuede,
            quedaria: week.saldo - product.precioCent
          };
          /* The balance ALWAYS evolves based on the correct action:
             failing never ruins the week (rule 5). */
          if (sePuede) week.saldo -= product.precioCent;
        }
        return instance;
      },
      enunciado: function (instance) {
        var key = instance.esSabado ? 'enunciadoPagaSabado' : 'enunciadoPagaDia';
        return instance.picto + ' ' + App.i18n.t(key)
          .replace('{dia}', App.i18n.t('dia' + instance.dia))
          .replace('{saldo}', formatear(instance.saldo))
          .replace('{name}', minuscula(instance.name))
          .replace('{precio}', formatear(instance.precio));
      },
      mesa: function (instance) { return descomponer(instance.saldo); },
      options: function (instance) {
        return [
          { text: App.i18n.t('si'), correcta: instance.sePuede },
          { text: App.i18n.t('no'), correcta: !instance.sePuede }
        ];
      },
      pista: function (instance) {
        return App.i18n.t('pistaPaga').replace('{objetivo}', minuscula(instance.objetivo.name));
      },
      explicacion: function (instance) {
        if (instance.esSabado) {
          return App.i18n.t('explicacionPagaSabado')
            .replace('{saldo}', formatear(instance.saldo))
            .replace('{name}', minuscula(instance.name))
            .replace('{precio}', formatear(instance.precio))
            .replace('{queda}', formatear(instance.quedaria));
        }
        return App.i18n.t(instance.sePuede ? 'explicacionPagaSi' : 'explicacionPagaNo')
          .replace('{saldo}', formatear(instance.saldo))
          .replace('{name}', minuscula(instance.name))
          .replace('{precio}', formatear(instance.precio))
          .replace('{queda}', formatear(instance.quedaria))
          .replace('{objetivo}', minuscula(instance.objetivo.name))
          .replace('{precioObjetivo}', formatear(instance.objetivo.precioCent));
      }
    },

    /* --- ¿Es de fiar? — gangas sospechosas (antesala de estafas) --- */
    fiar: {
      esQuiz: true,
      instruccion: 'instruccionFiar',
      progresoClave: 'completadosFiar',
      resumen: 'resumenFiar',
      niveles: function () { return datos().fiar.niveles; },
      generar: function (level) {
        /* Solo productos con referencia alta: la ganga se tiene
           que VER (≥ 4,50 €). */
        var candidatos = datos().productos.filter(function (p) { return p.precioCent >= 450; });
        var product = azar(candidatos);
        var esFiable = Math.random() < 0.5;
        var shown = product.precioCent;
        if (!esFiable) {
          shown = Math.max(5, Math.round(product.precioCent / level.div / 5) * 5);
        }
        return {
          picto: product.picto,
          name: product.name,
          ref: product.precioCent,
          mostrado: shown,
          esFiable: esFiable,
          contexto: 1 + Math.floor(Math.random() * 3)
        };
      },
      enunciado: function (instance) {
        return instance.picto + ' ' + App.i18n.t('enunciadoFiar')
          .replace('{contexto}', App.i18n.t('contextoFiar' + instance.contexto))
          .replace('{name}', minuscula(instance.name))
          .replace('{precio}', formatear(instance.mostrado));
      },
      mesa: function () { return null; },
      options: function (instance) {
        return [
          { text: App.i18n.t('pareceFiar'), correcta: instance.esFiable },
          { text: App.i18n.t('sospechoso'), correcta: !instance.esFiable }
        ];
      },
      pista: function (instance) {
        return App.i18n.t('pistaFiar').replace('{name}', minuscula(instance.name));
      },
      explicacion: function (instance) {
        return App.i18n.t(instance.esFiable ? 'explicacionFiarBien' : 'explicacionFiarMal')
          .replace('{name}', instance.name)
          .replace('{ref}', formatear(instance.ref))
          .replace('{mostrado}', formatear(instance.mostrado));
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
    activityCurrent = id;
    var cfg = cfgCurrent();
    $('#instruccionActividad').textContent = '';
    renderLevels();
    show('pantallaNiveles');
  }

  function renderLevels() {
    var cfg = cfgCurrent();
    var cont = $('#niveles');
    cont.innerHTML = '';
    cfg.niveles().forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progress[cfg.progresoClave][n.id] || 0;
      btn.innerHTML = n.name + ' — ' + n.descripcion ;

      btn.addEventListener('click', function () {
        if (cfg.esQuiz) startRoundQuiz(n);
        else startRoundShop(n);
      });
      cont.appendChild(btn);
    });
  }

  function endRound(hits, level) {
    var cfg = cfgCurrent();
    progress[cfg.progresoClave][level.id] = (progress[cfg.progresoClave][level.id] || 0) + 1;
    save();
    var total = cfg.esQuiz ? datos().porRonda : datos().porRondaTienda;
    $('#endSummary').textContent = App.i18n.t('roundSummary').replace('{hits}', hits).replace('{total}', total);
if ($('#transferencia')) $('#transferencia').textContent = '';
    show('endScreen');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ============================================================
     Una compra — motor de 3 steps
     ============================================================ */
  var enunciadoTiendaEl = $('#enunciadoTienda');
  var tableShopEl = $('#mesaTienda');
  var mostradorEl = $('#mostrador');
  var zonePayEl = $('#zonaPago');
  var accionesTiendaEl = $('#accionesTienda');
  var feedbackShopEl = $('#feedbackTienda');
  var explanationShopWrap = $('#explanationTiendaWrap');
  var explanationShopEl = $('#explanationTienda');
  var btnContinuarTienda = $('#btnContinuarTienda');

  var levelT = null;
  var purchaseIdx = 0;
  var hitsT = 0;
  var purchase = null;         /* state of the purchase in progress */
  var attemptsStep = 0;
  var alContinuar = null;    /* what to do when Continue is tapped */

  function generarCompra(level) {
    var bucket = datos().productos.filter(function (p) { return p.bucket === level.id; });
    var llega = Math.random() < 0.5;
    var product, alternativo, total;
    if (llega) {
      product = azar(bucket);
      alternativo = null;
      total = product.precioCent + azar([0, 100, 200, 500]);
    } else {
      /* The wallet isn't enough for 'producto', but is enough for a
         cheaper one (frustration-free resolution). */
      var ordenados = bucket.slice().sort(function (a, b) { return a.precioCent - b.precioCent; });
      product = azar(ordenados.slice(1));
      var baratos = ordenados.filter(function (x) { return x.precioCent < product.precioCent; });
      alternativo = azar(baratos);
      var gap = product.precioCent - alternativo.precioCent;
      /* Better with some leftover: this way the change step is
         also practiced in the "not enough" branch. */
      var extras = [level.paso, 100, 200].filter(function (e) { return e < gap; });
      total = alternativo.precioCent + (extras.length ? azar(extras) : 0);
    }
    return {
      producto: product,
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
    return purchase.monedero.reduce(function (s, c) { return s + c; }, 0);
  }
  function totalMostrador() {
    return purchase.enMostrador.reduce(function (s, c) { return s + c; }, 0);
  }

  function paintProgressShop() {
    var total = datos().porRondaTienda;
    $('#progressTiendaFill').style.width = (purchaseIdx / total * 100) + '%';
    $('#progressTiendaText').textContent = '';
  }

  /* The sign shows the product being bought: its picture, and its name and price. */
  function paintSign() {
    $('#productoTienda').textContent = purchase.producto.picto;
    $('#precioTienda').textContent = purchase.producto.name + ' · ' + formatear(purchase.producto.precioCent);
    $('#cartelProducto').classList.remove('hidden');
  }

  function clearStepShop() {
    feedbackShopEl.textContent = '';
    feedbackShopEl.className = 'feedback';
    explanationShopWrap.classList.add('hidden');
    explanationShopEl.textContent = '';
    btnContinuarTienda.classList.add('hidden');
    accionesTiendaEl.innerHTML = '';
    attemptsStep = 0;
  }

  function showTextShop(text) {
    explanationShopEl.textContent = text;
    explanationShopWrap.classList.remove('hidden');
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

  function startRoundShop(level) {
    levelT = level;
    purchaseIdx = 0;
    hitsT = 0;
    show('pantallaJuegoTienda');
    newerPurchase();
  }

  function newerPurchase() {
    purchase = generarCompra(levelT);
    paintProgressShop();
    renderStars();
    montarPaso1();
  }

  /* ---- Paso 1: ¿te llega? ---- */
  function montarPaso1() {
    clearStepShop();
    paintSign();
    zonePayEl.classList.add('hidden');
    App.dinero.pintarFichas(tableShopEl, purchase.monedero);
    tableShopEl.classList.remove('hidden');
    var text = App.i18n.t('paso1Enunciado')
      .replace('{name}', purchase.producto.name)
      .replace('{precio}', formatear(purchase.producto.precioCent));
    enunciadoTiendaEl.textContent = text;
    botonesSiNo(responderPaso1);
  }

  function resolverPaso1() {
    var key = purchase.llega ? 'explicaLlega' : 'explicaNoLlega';
    var text = App.i18n.t(key)
      .replace('{total}', formatear(totalMonedero()))
      .replace('{precio}', formatear(purchase.producto.precioCent));
    if (!purchase.llega) {
      text += ' ' + App.i18n.t('resolucionNoLlega')
        .replace('{name}', minuscula(purchase.alternativo.name))
        .replace('{precio}', formatear(purchase.alternativo.precioCent));
    }
    showTextShop(text);
    ofrecerContinuar(function () {
      if (!purchase.llega) {
        purchase.producto = purchase.alternativo;   /* eliges lo barato */
      }
      montarPaso2();
    });
  }

  function responderPaso1(btn, dijoSi) {
    if (dijoSi === purchase.llega) {
      App.feedback.success(feedbackShopEl);
      resolverPaso1();
      return;
    }
    attemptsStep += 1;
    purchase.fallo = true;
    btn.classList.add('animo');
    btn.disabled = true;
    App.feedback.encourage(feedbackShopEl);
    if (attemptsStep === 1) {
      showTextShop(App.i18n.t('pistaPaso1'));
      App.feedback.lockUntilAck(App.utils.$$('.btn-opcion', accionesTiendaEl), explanationShopWrap);
    } else {
      resolverPaso1();
    }
  }

  /* ---- Paso 2: paga (monedero finito) ---- */
  function montarPaso2() {
    clearStepShop();
    paintSign();
    enunciadoTiendaEl.textContent = App.i18n.t('paso2Enunciado')
      .replace('{precio}', formatear(purchase.producto.precioCent));
    zonePayEl.classList.remove('hidden');
    paintPay();
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
  function paintPay() {
    tableShopEl.innerHTML = '';
    purchase.monedero.forEach(function (cent, i) {
      var btn = createCard(cent, true);
      btn.setAttribute('aria-label', ariaMoney(cent));
      btn.addEventListener('click', function () {
        purchase.monedero.splice(i, 1);
        purchase.enMostrador.push(cent);
        paintPay();
      });
      tableShopEl.appendChild(btn);
    });
    mostradorEl.innerHTML = '';
    purchase.enMostrador.forEach(function (cent, i) {
      var btn = createCard(cent, true);
      btn.setAttribute('aria-label', App.i18n.t('ariaQuitarDelMostrador').replace('{d}', ariaMoney(cent)));
      btn.addEventListener('click', function () {
        purchase.enMostrador.splice(i, 1);
        purchase.monedero.push(cent);
        paintPay();
      });
      mostradorEl.appendChild(btn);
    });
    $('#totalMostrador').textContent = '';
  }

  function pagar() {
    var price = purchase.producto.precioCent;
    var puesto = totalMostrador();
    if (puesto < price) {
      attemptsStep += 1;
      purchase.fallo = true;
      App.feedback.encourage(feedbackShopEl);
      var text = attemptsStep === 1 ? App.i18n.t('faltaDinero1') :
        App.i18n.t('faltaDinero2').replace('{dif}', hablado(price - puesto));
      showTextShop(text);
      return;
    }
    purchase.pagado = puesto;
    purchase.cambioBueno = puesto - price;
    App.feedback.success(feedbackShopEl);
    if (purchase.cambioBueno === 0) {
      /* Pago justo: no hay cambio que revisar. */
      showTextShop(App.i18n.t('pagoJusto'));
      ofrecerContinuar(finishPurchase);
      return;
    }
    montarPaso3();
  }

  /* ---- Step 3: is the change correct? ---- */
  function montarPaso3() {
    clearStepShop();
    $('#cartelProducto').classList.add('hidden');
    zonePayEl.classList.add('hidden');

    purchase.cambioEsBien = Math.random() < 0.5;
    var shown = purchase.cambioBueno;
    if (!purchase.cambioEsBien) {
      var deltas = App.utils.shuffle([levelT.paso, -levelT.paso, 100, -100]);
      for (var k = 0; k < deltas.length; k++) {
        var m = purchase.cambioBueno + deltas[k];
        if (m > 0 && m !== purchase.cambioBueno) { shown = m; break; }
      }
      purchase.cambioEsBien = shown === purchase.cambioBueno;
    }
    purchase.cambioMostrado = descomponer(shown);

    App.dinero.pintarFichas(tableShopEl, purchase.cambioMostrado);
    tableShopEl.classList.remove('hidden');
    enunciadoTiendaEl.textContent = App.i18n.t('paso3Enunciado')
      .replace('{pagado}', formatear(purchase.pagado))
      .replace('{precio}', formatear(purchase.producto.precioCent));
    botonesSiNo(responderPaso3);
  }

  function resolverPaso3() {
    var shown = purchase.cambioMostrado.reduce(function (s, c) { return s + c; }, 0);
    var text = App.i18n.t(purchase.cambioEsBien ? 'explicaCambioBien' : 'explicaCambioMal')
      .replace('{bueno}', formatear(purchase.cambioBueno))
      .replace('{mostrado}', formatear(shown));
    text += ' ' + App.i18n.t(purchase.cambioEsBien ? 'resolucionCambioBien' : 'resolucionCambioMal');
    if (!purchase.cambioEsBien) {
      /* El dependiente lo corrige a la vista. */
      App.dinero.pintarFichas(tableShopEl, descomponer(purchase.cambioBueno));
    }
    showTextShop(text);
    ofrecerContinuar(finishPurchase);
  }

  function responderPaso3(btn, dijoSi) {
    if (dijoSi === purchase.cambioEsBien) {
      App.feedback.success(feedbackShopEl);
      resolverPaso3();
      return;
    }
    attemptsStep += 1;
    purchase.fallo = true;
    btn.classList.add('animo');
    btn.disabled = true;
    App.feedback.encourage(feedbackShopEl);
    if (attemptsStep === 1) {
      showTextShop(App.i18n.t('pistaPaso3'));
      App.feedback.lockUntilAck(App.utils.$$('.btn-opcion', accionesTiendaEl), explanationShopWrap);
    } else {
      resolverPaso3();
    }
  }

  function finishPurchase() {
    if (!purchase.fallo) {
      hitsT += 1;
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      renderStars();
    }
    purchaseIdx += 1;
    if (purchaseIdx >= datos().porRondaTienda) endRound(hitsT, levelT);
    else newerPurchase();
  }

  /* ---- Eventos ---- */
  App.utils.$$('.tarjeta-actividad').forEach(function (btn) {
    btn.addEventListener('click', function () { abrirActividad(btn.getAttribute('data-actividad')); });
  });
  var btnBackMenuLevels = $('#btnVolverMenuNiveles');
  if (btnBackMenuLevels) btnBackMenuLevels.addEventListener('click', function () { show('menuScreen'); });
  var btnBackMenuFinal = $('#btnVolverMenuFinal');
  if (btnBackMenuFinal) btnBackMenuFinal.addEventListener('click', function () { show('menuScreen'); });

  btnNextQuiz.addEventListener('click', nextQuiz);
  var btnEnunciadoQuiz = $('#btnEnunciadoQuiz');
  if (btnEnunciadoQuiz) btnEnunciadoQuiz.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(enunciadoQuizEl.textContent);
  });

  btnContinuarTienda.addEventListener('click', function () {
    var fn = alContinuar;
    alContinuar = null;
    if (fn) fn();
  });
  var btnEnunciadoTienda = $('#btnEnunciadoTienda');
  if (btnEnunciadoTienda) btnEnunciadoTienda.addEventListener('click', function () {
    if (App.tts && App.tts.enabled && App.tts.speak) App.tts.speak(enunciadoTiendaEl.textContent);
  });

  $('#repeatBtn').addEventListener('click', function () {
    if (cfgCurrent().esQuiz) startRoundQuiz(levelQ);
    else startRoundShop(levelT);
  });
  var btnOtherLevelFinal = $('#btnOtroNivelFinal');
  if (btnOtherLevelFinal) btnOtherLevelFinal.addEventListener('click', function () { abrirActividad(activityCurrent); });

  renderStars();
})();

