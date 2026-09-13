/* ============================================================
   Routime — La Tienda (autonomía: usar el dinero en la vida
   real). Datos en data.js. Dinero visual compartido en
   assets/js/dinero.js (App.dinero). Tres actividades:
   - Una compra: simulación guiada completa en 3 pasos —
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
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  ['completadosTienda', 'completadosQuedame', 'completadosMucho', 'completadosPaga', 'completadosFiar']
    .forEach(function (clave) { if (!progreso[clave]) progreso[clave] = {}; });

  function guardar() { App.storage.set(TOOL_ID, progreso); }
  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }
  function datos() { return DATA[App.i18n.locale()] || DATA.es; }
  function azar(lista) { return lista[Math.floor(Math.random() * lista.length)]; }
  function minuscula(nombre) { return nombre.charAt(0).toLowerCase() + nombre.slice(1); }

  /* ---- Pantallas ---- */
  var PANTALLAS = ['pantallaMenu', 'pantallaNiveles', 'pantallaJuegoQuiz',
    'pantallaJuegoTienda', 'pantallaFinal'];
  function mostrar(id) {
    PANTALLAS.forEach(function (p) { $('#' + p).classList.add('oculto'); });
    $('#' + id).classList.remove('oculto');
  }

  /* Distractores de importe: cercanos, distintos y positivos. */
  function distractoresDe(correcto, paso) {
    var lista = [];
    App.utils.shuffle([paso, 100, paso * 2]).forEach(function (d) {
      [correcto + d, correcto - d].forEach(function (x) {
        if (x > 0 && x !== correcto && lista.indexOf(x) === -1 && lista.length < 2) lista.push(x);
      });
    });
    while (lista.length < 2) lista.push(correcto + (lista.length + 1) * paso);
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
  var btnSiguienteQuiz = $('#btnSiguienteQuiz');

  var actividadActual = 'tienda';
  var nivelQ = null;
  var casoQ = null;
  var idxQ = 0;
  var aciertosQ = 0;
  var intentosQ = 0;
  var resueltoQ = false;
  var opcionBotones = [];

  function cfgActual() { return ACTIVIDADES[actividadActual]; }

  function mostrarTextoQuiz(texto) {
    explicacionQuizEl.textContent = texto;
    explicacionQuizWrap.classList.remove('oculto');
  }

  function pintarMesaQuiz(piezas) {
    var mesaEl = $('#mesaDinero');
    App.dinero.pintarFichas(mesaEl, piezas);
    mesaEl.classList.toggle('oculto', !piezas || !piezas.length);
  }

  function pintarProgresoQuiz() {
    var total = datos().porRonda;
    $('#progressQuizFill').style.width = (idxQ / total * 100) + '%';
    $('#progressQuizText').textContent.textContent = '';
  }

  function iniciarRondaQuiz(nivel) {
    nivelQ = nivel;
    idxQ = 0;
    aciertosQ = 0;
    if (cfgActual().alIniciar) cfgActual().alIniciar();
    mostrar('pantallaJuegoQuiz');
    renderQuiz();
  }

  function renderQuiz() {
    var cfg = cfgActual();
    casoQ = cfg.generar(nivelQ);
    intentosQ = 0;
    resueltoQ = false;
    feedbackQuizEl.textContent = '';
    feedbackQuizEl.className = 'feedback';
    explicacionQuizWrap.classList.add('oculto');
    explicacionQuizEl.textContent = '';
    btnSiguienteQuiz.classList.add('oculto');

    enunciadoQuizEl.textContent = cfg.enunciado(casoQ);
    pintarMesaQuiz(cfg.mesa ? cfg.mesa(casoQ) : null);

    opcionesQuizEl.innerHTML = '';
    opcionBotones = [];
    cfg.opciones(casoQ).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { responderQuiz(btn, op); });
      opcionesQuizEl.appendChild(btn);
      opcionBotones.push({ btn: btn, op: op });
    });

    pintarProgresoQuiz();
    pintarEstrellas();
  }

  function resolverQuiz(bien) {
    var cfg = cfgActual();
    resueltoQ = true;
    opcionBotones.forEach(function (par) {
      par.btn.disabled = true;
      if (par.op.correcta) par.btn.classList.add('correcta');
    });
    mostrarTextoQuiz(cfg.explicacion(casoQ, bien));
    btnSiguienteQuiz.classList.remove('oculto');
    btnSiguienteQuiz.focus();
  }

  function responderQuiz(btn, op) {
    if (resueltoQ) return;
    if (op.correcta) {
      if (intentosQ === 0) {
        aciertosQ += 1;
        progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
        guardar();
        pintarEstrellas();
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

  function siguienteQuiz() {
    idxQ += 1;
    if (idxQ >= datos().porRonda) terminarRonda(aciertosQ, nivelQ);
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
          nombre: producto.nombre,
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
          .replace('{nombre}', minuscula(caso.nombre))
          .replace('{gasto}', formatear(caso.gasto));
      },
      mesa: function (caso) { return descomponer(caso.saldo); },
      opciones: function (caso) {
        return caso.importes.map(function (cent) {
          return { texto: formatear(cent), correcta: cent === caso.queda };
        });
      },
      pista: function () { return App.i18n.t('pistaQuedame'); },
      explicacion: function (caso, bien) {
        return App.i18n.t(bien ? 'explicacionQuedameBien' : 'explicacionQuedameCasi')
          .replace('{saldo}', formatear(caso.saldo))
          .replace('{nombre}', caso.nombre)
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
          nombre: producto.nombre,
          ref: producto.precioCent,
          mostrado: mostrado,
          esBien: esBien
        };
      },
      enunciado: function (caso) {
        return caso.picto + ' ' + App.i18n.t('enunciadoMucho')
          .replace('{nombre}', caso.nombre)
          .replace('{mostrado}', formatear(caso.mostrado));
      },
      mesa: function () { return null; },
      /* Two options in fixed order (rule 11: max 3). */
      opciones: function (caso) {
        return [
          { texto: App.i18n.t('estaBien'), correcta: caso.esBien },
          { texto: App.i18n.t('esDemasiado'), correcta: !caso.esBien }
        ];
      },
      pista: function (caso) {
        return App.i18n.t('pistaMucho').replace('{nombre}', minuscula(caso.nombre));
      },
      explicacion: function (caso) {
        return App.i18n.t(caso.esBien ? 'explicacionMuchoBien' : 'explicacionMuchoMal')
          .replace('{nombre}', minuscula(caso.nombre))
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
            nombre: semana.objetivo.nombre,
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
            nombre: producto.nombre,
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
          .replace('{nombre}', minuscula(caso.nombre))
          .replace('{precio}', formatear(caso.precio));
      },
      mesa: function (caso) { return descomponer(caso.saldo); },
      opciones: function (caso) {
        return [
          { texto: App.i18n.t('si'), correcta: caso.sePuede },
          { texto: App.i18n.t('no'), correcta: !caso.sePuede }
        ];
      },
      pista: function (caso) {
        return App.i18n.t('pistaPaga').replace('{objetivo}', minuscula(caso.objetivo.nombre));
      },
      explicacion: function (caso) {
        if (caso.esSabado) {
          return App.i18n.t('explicacionPagaSabado')
            .replace('{saldo}', formatear(caso.saldo))
            .replace('{nombre}', minuscula(caso.nombre))
            .replace('{precio}', formatear(caso.precio))
            .replace('{queda}', formatear(caso.quedaria));
        }
        return App.i18n.t(caso.sePuede ? 'explicacionPagaSi' : 'explicacionPagaNo')
          .replace('{saldo}', formatear(caso.saldo))
          .replace('{nombre}', minuscula(caso.nombre))
          .replace('{precio}', formatear(caso.precio))
          .replace('{queda}', formatear(caso.quedaria))
          .replace('{objetivo}', minuscula(caso.objetivo.nombre))
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
          nombre: producto.nombre,
          ref: producto.precioCent,
          mostrado: mostrado,
          esFiable: esFiable,
          contexto: 1 + Math.floor(Math.random() * 3)
        };
      },
      enunciado: function (caso) {
        return caso.picto + ' ' + App.i18n.t('enunciadoFiar')
          .replace('{contexto}', App.i18n.t('contextoFiar' + caso.contexto))
          .replace('{nombre}', minuscula(caso.nombre))
          .replace('{precio}', formatear(caso.mostrado));
      },
      mesa: function () { return null; },
      opciones: function (caso) {
        return [
          { texto: App.i18n.t('pareceFiar'), correcta: caso.esFiable },
          { texto: App.i18n.t('sospechoso'), correcta: !caso.esFiable }
        ];
      },
      pista: function (caso) {
        return App.i18n.t('pistaFiar').replace('{nombre}', minuscula(caso.nombre));
      },
      explicacion: function (caso) {
        return App.i18n.t(caso.esFiable ? 'explicacionFiarBien' : 'explicacionFiarMal')
          .replace('{nombre}', caso.nombre)
          .replace('{ref}', formatear(caso.ref))
          .replace('{mostrado}', formatear(caso.mostrado));
      }
    },

    /* --- Una compra — motor propio de 3 pasos --- */
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
    $('#instruccionActividad').textContent.textContent = '';
    pintarNiveles();
    mostrar('pantallaNiveles');
  }

  function pintarNiveles() {
    var cfg = cfgActual();
    var cont = $('#niveles');
    cont.innerHTML = '';
    cfg.niveles().forEach(function (n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-nivel';
      var veces = progreso[cfg.progresoClave][n.id] || 0;
      btn.innerHTML = n.nombre + ' — ' + n.descripcion ;

      btn.addEventListener('click', function () {
        if (cfg.esQuiz) iniciarRondaQuiz(n);
        else iniciarRondaTienda(n);
      });
      cont.appendChild(btn);
    });
  }

  function terminarRonda(aciertos, nivel) {
    var cfg = cfgActual();
    progreso[cfg.progresoClave][nivel.id] = (progreso[cfg.progresoClave][nivel.id] || 0) + 1;
    guardar();
    var total = cfg.esQuiz ? datos().porRonda : datos().porRondaTienda;
    $('#resumenFinal').textContent.textContent = '';
$('#transferencia').textContent.textContent = '';
    mostrar('pantallaFinal');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ============================================================
     Una compra — motor de 3 pasos
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
    $('#progressTiendaText').textContent.textContent = '';
  }

  function pintarCartel() {
    $('#productoTienda').textContent.textContent = '';
    $('#precioTienda').textContent.textContent = '';
    $('#cartelProducto').classList.remove('oculto');
  }

  function limpiarPasoTienda() {
    feedbackTiendaEl.textContent = '';
    feedbackTiendaEl.className = 'feedback';
    explicacionTiendaWrap.classList.add('oculto');
    explicacionTiendaEl.textContent = '';
    btnContinuarTienda.classList.add('oculto');
    accionesTiendaEl.innerHTML = '';
    intentosPaso = 0;
  }

  function mostrarTextoTienda(texto) {
    explicacionTiendaEl.textContent = texto;
    explicacionTiendaWrap.classList.remove('oculto');
  }

  function ofrecerContinuar(fn) {
    alContinuar = fn;
    accionesTiendaEl.innerHTML = '';
    btnContinuarTienda.classList.remove('oculto');
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
    mostrar('pantallaJuegoTienda');
    nuevaCompra();
  }

  function nuevaCompra() {
    compra = generarCompra(nivelT);
    pintarProgresoTienda();
    pintarEstrellas();
    montarPaso1();
  }

  /* ---- Paso 1: ¿te llega? ---- */
  function montarPaso1() {
    limpiarPasoTienda();
    pintarCartel();
    zonaPagoEl.classList.add('oculto');
    App.dinero.pintarFichas(mesaTiendaEl, compra.monedero);
    mesaTiendaEl.classList.remove('oculto');
    var texto = App.i18n.t('paso1Enunciado')
      .replace('{nombre}', compra.producto.nombre)
      .replace('{precio}', formatear(compra.producto.precioCent));
    enunciadoTiendaEl.textContent = texto;
    botonesSiNo(responderPaso1);
  }

  function resolverPaso1() {
    var clave = compra.llega ? 'explicaLlega' : 'explicaNoLlega';
    var texto = App.i18n.t(clave)
      .replace('{total}', formatear(totalMonedero()))
      .replace('{precio}', formatear(compra.producto.precioCent));
    if (!compra.llega) {
      texto += ' ' + App.i18n.t('resolucionNoLlega')
        .replace('{nombre}', minuscula(compra.alternativo.nombre))
        .replace('{precio}', formatear(compra.alternativo.precioCent));
    }
    mostrarTextoTienda(texto);
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
    zonaPagoEl.classList.remove('oculto');
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
    $('#totalMostrador').textContent.textContent = '';
  }

  function pagar() {
    var precio = compra.producto.precioCent;
    var puesto = totalMostrador();
    if (puesto < precio) {
      intentosPaso += 1;
      compra.fallo = true;
      App.feedback.encourage(feedbackTiendaEl);
      var texto = intentosPaso === 1 ? App.i18n.t('faltaDinero1') :
        App.i18n.t('faltaDinero2').replace('{dif}', hablado(precio - puesto));
      mostrarTextoTienda(texto);
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
    $('#cartelProducto').classList.add('oculto');
    zonaPagoEl.classList.add('oculto');

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
    mesaTiendaEl.classList.remove('oculto');
    enunciadoTiendaEl.textContent = App.i18n.t('paso3Enunciado')
      .replace('{pagado}', formatear(compra.pagado))
      .replace('{precio}', formatear(compra.producto.precioCent));
    botonesSiNo(responderPaso3);
  }

  function resolverPaso3() {
    var mostrado = compra.cambioMostrado.reduce(function (s, c) { return s + c; }, 0);
    var texto = App.i18n.t(compra.cambioEsBien ? 'explicaCambioBien' : 'explicaCambioMal')
      .replace('{bueno}', formatear(compra.cambioBueno))
      .replace('{mostrado}', formatear(mostrado));
    texto += ' ' + App.i18n.t(compra.cambioEsBien ? 'resolucionCambioBien' : 'resolucionCambioMal');
    if (!compra.cambioEsBien) {
      /* El dependiente lo corrige a la vista. */
      App.dinero.pintarFichas(mesaTiendaEl, descomponer(compra.cambioBueno));
    }
    mostrarTextoTienda(texto);
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
      progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      guardar();
      pintarEstrellas();
    }
    compraIdx += 1;
    if (compraIdx >= datos().porRondaTienda) terminarRonda(aciertosT, nivelT);
    else nuevaCompra();
  }

  /* ---- Eventos ---- */
  App.utils.$$('.tarjeta-actividad').forEach(function (btn) {
    btn.addEventListener('click', function () { abrirActividad(btn.getAttribute('data-actividad')); });
  });
  $('#btnVolverMenuNiveles').addEventListener('click', function () { mostrar('pantallaMenu'); });
  $('#btnVolverMenuFinal').addEventListener('click', function () { mostrar('pantallaMenu'); });

  btnSiguienteQuiz.addEventListener('click', siguienteQuiz);
  $('#btnEnunciadoQuiz').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(enunciadoQuizEl.textContent);
  });

  btnContinuarTienda.addEventListener('click', function () {
    var fn = alContinuar;
    alContinuar = null;
    if (fn) fn();
  });
  $('#btnEnunciadoTienda').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(enunciadoTiendaEl.textContent);
  });

  $('#btnRepetir').addEventListener('click', function () {
    if (cfgActual().esQuiz) iniciarRondaQuiz(nivelQ);
    else iniciarRondaTienda(nivelT);
  });
  $('#btnOtroNivelFinal').addEventListener('click', function () { abrirActividad(actividadActual); });

  pintarEstrellas();
})();

