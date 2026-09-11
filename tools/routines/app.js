/* ============================================================
   Routime — Mis Rutinas (secuenciación y autonomía)
   Rutinas diarias paso a paso. Cada paso se marca como "Hecho".
   El estado se reinicia automáticamente cada día.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'rutinas';
  var $ = App.utils.$;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  var pantallaMenu = $('#pantallaMenu');
  var pantallaRutina = $('#pantallaRutina');
  var pantallaFinal = $('#pantallaFinal');
  var pantallaOrdenar = $('#pantallaOrdenar');
  var pantallaListaLibre = $('#pantallaListaLibre');
  var listaRutinas = $('#listaRutinas');
  var listaPasos = $('#listaPasos');
  var listaOrdenar = $('#listaOrdenar');
  var tituloRutina = $('#tituloRutina');
  var tituloOrdenar = $('#tituloOrdenar');
  var progressFill = $('#progressFill');
  var feedbackEl = $('#feedback');
  var feedbackOrdenar = $('#feedbackOrdenar');
  var starsEl = $('#stars');
  var tabPredefinidas = $('#tabPredefinidas');
  var tabPropias = $('#tabPropias');
  var arrastreOrden = null;
  var suprimirClickArrastre = false;

  /* Progreso persistente. Si la fecha guardada no es hoy, se reinicia. */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (progreso.fecha !== App.utils.hoy() || !progreso.hechos) {
    progreso.fecha = App.utils.hoy();
    progreso.hechos = {}; /* { idRutina: [true, false, ...] } */
  }
  /* Estado de la pantalla "Ordena la rutina". No se reinicia cada día:
     el progreso de ordenación es aprendizaje a largo plazo. */
  if (!progreso.orden || typeof progreso.orden !== 'object') progreso.orden = {};
  /* intentos: { idRutina: number } - contador Socrático (1ª pista, 2ª solución). */

  /* Listas libres creadas por la persona. Contenido propio, no del
     catálogo: tampoco se reinicia cada día (igual que "orden"). */
  if (!Array.isArray(progreso.misListas)) progreso.misListas = [];

  var rutinaActual = null;

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = '⭐ ' + progreso.estrellas; }

  function hechosDe(rutina) {
    if (!progreso.hechos[rutina.id]) {
      progreso.hechos[rutina.id] = rutina.pasos.map(function () { return false; });
    }
    return progreso.hechos[rutina.id];
  }

  function contarHechos(rutina) {
    return hechosDe(rutina).filter(Boolean).length;
  }

  /* ---- Routine menu ----
     Organised by time-of-day sections (manana, comida, noche, salida).
     Each routine is a single card with one primary action and a small
     "Order the routine" link underneath. Cards collapse into sections
     so the user sees the day at a glance instead of a flat list. */
  var SECCIONES = [
    { id: 'manana',   key: 'seccionManana' },
    { id: 'comida',   key: 'seccionComida' },
    { id: 'limpieza', key: 'seccionLimpieza' },
    { id: 'personal', key: 'seccionPersonal' },
    { id: 'mascotas', key: 'seccionMascotas' },
    { id: 'tarde',    key: 'seccionTarde' },
    { id: 'salida',   key: 'seccionSalida' },
    { id: 'noche',    key: 'seccionNoche' }
  ];

  function rutinasDe(momentoId) {
    return DATOS.filter(function (r) { return r.momento === momentoId; });
  }

  function pintarMenu() {
    pantallaRutina.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaOrdenar.classList.add('oculto');
    pantallaListaLibre.classList.add('oculto');
    pantallaMenu.classList.remove('oculto');
    listaRutinas.innerHTML = '';

    /* Subsecciones por momento: "Pasos" (marcar paso a paso) y "Ordenar"
       (secuenciar la rutina). Cada momento tiene su propia lista de
       rutinas en cada subsección; así separamos "hacer la tarea" de
       "ordenar la tarea" sin mezclarlas en la misma tarjeta. */
    function crearTarjeta(rutina, modo) {
      var hechos = contarHechos(rutina);
      var total = rutina.pasos.length;
      var completada = hechos === total;

      var card = document.createElement('article');
      card.className = 'card tarjeta-rutina' +
        (completada ? ' tarjeta-completada' : '') +
        (modo === 'ordenar' ? ' tarjeta-rutina-ordenar' : '');

      var media = document.createElement('div');
      media.className = 'tarjeta-rutina-media';
      var picto = document.createElement('span');
      picto.className = 'picto';
      picto.setAttribute('aria-hidden', 'true');
      picto.textContent = rutina.picto;
      media.appendChild(picto);

      var cuerpo = document.createElement('div');
      cuerpo.className = 'tarjeta-rutina-cuerpo';

      var nombre = document.createElement('span');
      nombre.className = 'nombre';
      nombre.textContent = rutina.nombre;
      cuerpo.appendChild(nombre);

      /* En la subsección "Pasos" mostramos barra + estado de avance.
         En "Ordenar" no aplica el contador de pasos hechos; dejamos
         solo el botón para entrar al puzzle de secuenciación. */
      if (modo === 'pasos') {
        var progreso = document.createElement('div');
        progreso.className = 'tarjeta-rutina-progreso';
        var barra = document.createElement('div');
        barra.className = 'tarjeta-rutina-barra';
        var barraFill = document.createElement('span');
        barraFill.className = 'tarjeta-rutina-barra-fill';
        barraFill.style.width = ((hechos / total) * 100) + '%';
        barra.appendChild(barraFill);
        var estado = document.createElement('span');
        estado.className = 'estado';
        /* Sin contador numérico "X de Y pasos" en las tarjetas del menú:
           la barra visual ya muestra el avance y se evita la presión. */
        estado.textContent = completada ? App.i18n.t('completadaHoy') : '';
        if (estado.textContent) progreso.appendChild(estado);
        cuerpo.appendChild(progreso);
      }

      var acciones = document.createElement('div');
      acciones.className = 'tarjeta-rutina-acciones';

      var btnAccion = document.createElement('button');
      btnAccion.type = 'button';
      if (modo === 'pasos') {
        btnAccion.className = 'btn btn-empezar';
        btnAccion.textContent = App.i18n.t(completada ? 'btnRepetir' : 'btnEmpezar');
        btnAccion.setAttribute('aria-label',
          (completada ? App.i18n.t('btnRepetir') : App.i18n.t('btnEmpezar'))
          + ': ' + rutina.nombre);
        btnAccion.addEventListener('click', function () { abrirRutina(rutina); });
      } else {
        btnAccion.className = 'btn-ordenar-rutina';
        btnAccion.textContent = App.i18n.t('btnOrdenar');
        btnAccion.setAttribute('aria-label', App.i18n.t('btnOrdenar') + ': ' + rutina.nombre);
        btnAccion.addEventListener('click', function () { abrirOrdenar(rutina); });
      }
      acciones.appendChild(btnAccion);

      cuerpo.appendChild(acciones);
      card.appendChild(media);
      card.appendChild(cuerpo);
      return card;
    }

    function crearSubseccion(tituloKey, nivel) {
      var sub = document.createElement('div');
      sub.className = 'subseccion-rutinas';
      var h = document.createElement('h3');
      h.className = 'subseccion-rutinas-titulo';
      h.textContent = App.i18n.t(tituloKey);
      sub.appendChild(h);
      if (nivel === 1) {
        var grid = document.createElement('div');
        grid.className = 'grid-tarjetas';
        sub.appendChild(grid);
        return { sub: sub, grid: grid };
      }
      return { sub: sub, grid: null };
    }

    SECCIONES.forEach(function (sec) {
      var rutinas = rutinasDe(sec.id);
      if (rutinas.length === 0) return;

      var section = document.createElement('section');
      section.className = 'seccion-rutinas';
      section.setAttribute('aria-labelledby', 'sec-' + sec.id);

      var titulo = document.createElement('h2');
      titulo.id = 'sec-' + sec.id;
      titulo.className = 'seccion-rutinas-titulo';
      titulo.textContent = App.i18n.t(sec.key);
      section.appendChild(titulo);

      var subPasos = crearSubseccion('subseccionPasos', 1);
      var subOrdenar = crearSubseccion('subseccionOrdenar', 1);

      rutinas.forEach(function (rutina) {
        subPasos.grid.appendChild(crearTarjeta(rutina, 'pasos'));
        subOrdenar.grid.appendChild(crearTarjeta(rutina, 'ordenar'));
      });

      section.appendChild(subPasos.sub);
      section.appendChild(subOrdenar.sub);
      listaRutinas.appendChild(section);
    });

    pintarEstrellas();
  }

  function mostrarTab(tab) {
    var propias = tab === 'propias';
    pantallaRutina.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaOrdenar.classList.add('oculto');
    pantallaMenu.classList.toggle('oculto', propias);
    pantallaListaLibre.classList.toggle('oculto', !propias);
    tabPredefinidas.classList.toggle('activa', !propias);
    tabPropias.classList.toggle('activa', propias);
    tabPredefinidas.setAttribute('aria-selected', String(!propias));
    tabPropias.setAttribute('aria-selected', String(propias));
    if (propias) {
      pintarListaActual();
      pintarListasGuardadas();
    }
  }

  /* Tarjeta de entrada a "Crea tu lista": no viene del catálogo DATA,
     así que se construye aparte, con el mismo estilo visual de tarjeta. */
  function crearSeccionListasLibres() {
    var section = document.createElement('section');
    section.className = 'seccion-rutinas';
    section.setAttribute('aria-labelledby', 'sec-listas-libres');

    var titulo = document.createElement('h2');
    titulo.id = 'sec-listas-libres';
    titulo.className = 'seccion-rutinas-titulo';
    titulo.textContent = App.i18n.t('seccionListasLibres');
    section.appendChild(titulo);

    var descripcion = document.createElement('p');
    descripcion.className = 'instruccion';
    descripcion.textContent = App.i18n.t('listasLibresDescripcion');
    section.appendChild(descripcion);

    var grid = document.createElement('div');
    grid.className = 'grid-tarjetas';

    var card = document.createElement('article');
    card.className = 'card tarjeta-rutina';

    var media = document.createElement('div');
    media.className = 'tarjeta-rutina-media';
    var picto = document.createElement('span');
    picto.className = 'picto';
    picto.setAttribute('aria-hidden', 'true');
    picto.textContent = '📝';
    media.appendChild(picto);

    var cuerpo = document.createElement('div');
    cuerpo.className = 'tarjeta-rutina-cuerpo';
    var nombre = document.createElement('span');
    nombre.className = 'nombre';
    nombre.textContent = App.i18n.t('tarjetaListasLibresNombre');
    var descripcionTarjeta = document.createElement('span');
    descripcionTarjeta.className = 'estado';
    descripcionTarjeta.textContent = App.i18n.t('tarjetaListasLibresDescripcion');
    cuerpo.appendChild(nombre);
    cuerpo.appendChild(descripcionTarjeta);

    var acciones = document.createElement('div');
    acciones.className = 'tarjeta-rutina-acciones';
    var btnAccion = document.createElement('button');
    btnAccion.type = 'button';
    btnAccion.className = 'btn btn-empezar';
    btnAccion.textContent = App.i18n.t('btnEmpezar');
    btnAccion.setAttribute('aria-label', App.i18n.t('btnEmpezar') + ': ' + App.i18n.t('tarjetaListasLibresNombre'));
    btnAccion.addEventListener('click', abrirListaLibre);
    acciones.appendChild(btnAccion);
    cuerpo.appendChild(acciones);

    card.appendChild(media);
    card.appendChild(cuerpo);
    grid.appendChild(card);
    section.appendChild(grid);
    return section;
  }

  /* ---- Vista de una rutina ---- */
  function abrirRutina(rutina) {
    rutinaActual = rutina;
    pantallaMenu.classList.add('oculto');
    pantallaRutina.classList.remove('oculto');
    tituloRutina.textContent = rutina.picto + ' ' + rutina.nombre;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    pintarPasos();
  }

  function pintarPasos() {
    var hechos = hechosDe(rutinaActual);
    var actual = hechos.indexOf(false); /* primer paso pendiente */
    listaPasos.innerHTML = '';

    rutinaActual.pasos.forEach(function (paso, i) {
      var li = document.createElement('li');
      li.className = 'paso' +
        (hechos[i] ? ' hecho' : '') +
        (i === actual ? ' actual' : '');

      var picto = (typeof paso.picto === 'string' && /^\.{1,2}\//.test(paso.picto))
        ? '<img class="picto" src="' + paso.picto + '" alt="" aria-hidden="true" loading="lazy" decoding="async">'
        : '<span class="picto" aria-hidden="true">' + paso.picto + '</span>';
      var texto = '<span class="texto">' + paso.texto + '</span>';
      var hechoBtn = '<button type="button" class="btn btn-hecho"' +
        (i === actual ? '' : ' disabled') + '>' +
        App.i18n.t('btnHecho') + '</button>';

      li.innerHTML = picto + texto + (hechos[i] ? '<span class="check" aria-label="' + App.i18n.t('ariaPasoHecho') + '">✔</span>' : hechoBtn);

      var btnHecho = li.querySelector('.btn-hecho');
      if (btnHecho) {
        btnHecho.addEventListener('click', function () { marcarHecho(i); });
      }
      listaPasos.appendChild(li);
    });

    var n = contarHechos(rutinaActual);
    var total = rutinaActual.pasos.length;
    progressFill.style.width = ((n / total) * 100) + '%';
  }

  function marcarHecho(i) {
    var hechos = hechosDe(rutinaActual);
    hechos[i] = true;
    guardar();
    App.feedback.success(feedbackEl);

    if (contarHechos(rutinaActual) === rutinaActual.pasos.length) {
      progreso.estrellas += 1;
      guardar();
      terminarRutina();
    } else {
      pintarPasos();
    }
  }

  function terminarRutina() {
    pintarPasos();
    pantallaRutina.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    $('#resumenFinal').textContent = App.i18n.t('resumenFinal').replace('{nombre}', rutinaActual.nombre);
$('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('rutinaCompletadaTitulo'));
    pintarEstrellas();
  }

  /* ---- Pantalla "Ordena la rutina" ----
     Patrón "La Casa": dos columnas. Izquierda = "Tu orden" (slots
     numerados 1..N que la persona va rellenando). Derecha = "Pasos"
     disponibles (los pictogramas mezclados que toca para colocar).
     Tocar un slot ocupado devuelve su paso a la columna derecha.
     Una pareja de flechas ↑/↓ permite mover el slot seleccionado
     a una posición contigua sin tener que devolver y recolocar.
     Patrón Socrático: 1.er error → pista (primer paso correcto);
                        2.º error → "Ver solución".
     Reglas: nunca castigo (App.feedback.encourage), +1⭐ al acertar,
     progreso persistente de orden (no se reinicia cada día). */
  var ordenActual = null;
  /* {
       rutina, intentos,
       slots: (number|null)[]   — índice de paso o null si está vacío
       disponibles: number[]    — índices aún sin colocar
       seleccionadoSlot: number|null
     } */

  function barajar(arr) {
    /* Fisher-Yates, sin mutar el original. */
    var copia = arr.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copia[i]; copia[i] = copia[j]; copia[j] = tmp;
    }
    return copia;
  }

  function abrirOrdenar(rutina) {
    var ids = rutina.pasos.map(function (_, i) { return i; });
    ordenActual = {
      rutina: rutina,
      intentos: 0,
      pistaUsada: false,
      resuelto: false,
      pistaSlot: -1,
      slots: new Array(rutina.pasos.length).fill(null),
      disponibles: barajar(ids),
      seleccionadoSlot: null
    };
    pantallaMenu.classList.add('oculto');
    pantallaRutina.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaOrdenar.classList.remove('oculto');
    tituloOrdenar.textContent = App.i18n.t('ordenTitulo').replace('{nombre}', rutina.nombre);
    feedbackOrdenar.textContent = '';
    feedbackOrdenar.className = 'feedback';
    pintarOrdenar();
  }

  function pintarOrdenar() {
    var rutina = ordenActual.rutina;
    var sel = ordenActual.seleccionadoSlot;
    var slotsEl = $('#listaSlots');
    var dispEl = $('#listaPasosDisponibles');
    slotsEl.innerHTML = '';
    dispEl.innerHTML = '';

    ordenActual.slots.forEach(function (idPaso, i) {
      var li = document.createElement('li');
      var lleno = idPaso !== null;
      li.className = 'slot-orden' + (lleno ? ' lleno' : '') + (i === sel ? ' seleccionado' : '') +
        (ordenActual.pistaSlot === i ? ' pista' : '');
      li.dataset.slotIndex = i;
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');

      var pos = document.createElement('span');
      pos.className = 'slot-posicion';
      pos.setAttribute('aria-hidden', 'true');
      pos.textContent = (i + 1);
      li.appendChild(pos);

      if (lleno) {
        var paso = rutina.pasos[idPaso];
        li.setAttribute(
          'aria-label',
          App.i18n.t('ariaSlotLleno').replace('{n}', i + 1).replace('{texto}', paso.texto)
        );
        var picto = document.createElement('span');
        picto.className = 'slot-picto';
        picto.setAttribute('aria-hidden', 'true');
        picto.textContent = paso.picto;
        li.appendChild(picto);
        var texto = document.createElement('span');
        texto.className = 'slot-texto';
        texto.textContent = paso.texto;
        li.appendChild(texto);
      } else {
        li.setAttribute(
          'aria-label', App.i18n.t('ariaSlotVacio').replace('{n}', i + 1)
        );
        var hint = document.createElement('span');
        hint.className = 'slot-vacio-hint';
        hint.setAttribute('aria-hidden', 'true');
        hint.textContent = '?';
        li.appendChild(hint);
      }

      li.addEventListener('click', function () {
        if (suprimirClickArrastre) return;
        tocarSlot(i);
      });
      hacerArrastrableOrden(li, { tipo: 'slot', indice: i });
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tocarSlot(i);
        }
      });
      slotsEl.appendChild(li);
    });

    ordenActual.disponibles.forEach(function (idPaso) {
      var paso = rutina.pasos[idPaso];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'paso-disponible';
      btn.dataset.pasoId = idPaso;
      btn.setAttribute(
        'aria-label',
        App.i18n.t('ariaPasoDisponible').replace('{texto}', paso.texto)
      );
      var p = document.createElement('span');
      p.className = 'paso-disponible-picto';
      p.setAttribute('aria-hidden', 'true');
      p.textContent = paso.picto;
      btn.appendChild(p);
      var t = document.createElement('span');
      t.className = 'paso-disponible-texto';
      t.textContent = paso.texto;
      btn.appendChild(t);
      btn.addEventListener('click', function () {
        if (suprimirClickArrastre) return;
        colocarDesdeDisponible(idPaso);
      });
      hacerArrastrableOrden(btn, { tipo: 'disponible', pasoId: idPaso });
      dispEl.appendChild(btn);
    });

    actualizarBarraMover();
    actualizarBotonesSocraticos();
  }

  /* Arrastre unificado para ratón, dedo y lápiz. El clic sigue siendo la
     alternativa para teclado y para dispositivos que no soporten Pointer
     Events. */
  function hacerArrastrableOrden(el, origen) {
    if (!window.PointerEvent) return;
    el.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      arrastreOrden = { origen: origen, inicioX: e.clientX, inicioY: e.clientY,
        activo: false, elemento: el, pointerId: e.pointerId };
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', function (e) {
      if (!arrastreOrden || arrastreOrden.pointerId !== e.pointerId) return;
      var dx = e.clientX - arrastreOrden.inicioX;
      var dy = e.clientY - arrastreOrden.inicioY;
      if (!arrastreOrden.activo && Math.sqrt(dx * dx + dy * dy) < 8) return;
      arrastreOrden.activo = true;
      el.classList.add('arrastrando');
      e.preventDefault();
    });
    el.addEventListener('pointerup', function (e) {
      if (!arrastreOrden || arrastreOrden.pointerId !== e.pointerId) return;
      var datos = arrastreOrden;
      arrastreOrden = null;
      el.classList.remove('arrastrando');
      if (!datos.activo) return;
      suprimirClickArrastre = true;
      var destino = document.elementFromPoint(e.clientX, e.clientY);
      var slot = destino && destino.closest ? destino.closest('.slot-orden') : null;
      if (slot) soltarPasoEnSlot(datos.origen, Number(slot.dataset.slotIndex));
      setTimeout(function () { suprimirClickArrastre = false; }, 0);
    });
    el.addEventListener('pointercancel', function () {
      arrastreOrden = null;
      el.classList.remove('arrastrando');
    });
  }

  function soltarPasoEnSlot(origen, destino) {
    if (!ordenActual || destino < 0 || destino >= ordenActual.slots.length) return;
    if (origen.tipo === 'disponible') {
      var anterior = ordenActual.slots[destino];
      ordenActual.slots[destino] = origen.pasoId;
      ordenActual.disponibles = ordenActual.disponibles.filter(function (x) { return x !== origen.pasoId; });
      if (anterior !== null) ordenActual.disponibles.push(anterior);
    } else if (origen.indice !== destino) {
      var paso = ordenActual.slots[origen.indice];
      ordenActual.slots[origen.indice] = ordenActual.slots[destino];
      ordenActual.slots[destino] = paso;
    }
    ordenActual.seleccionadoSlot = destino;
    ordenActual.pistaSlot = -1;
    pintarOrdenar();
  }

  function actualizarBotonesSocraticos() {
    var btnPista = $('#btnPistaOrdenar');
    var btnResolver = $('#btnResolverOrdenar');
    var btnComprobar = $('#btnComprobar');
    if (!btnPista || !btnResolver || !btnComprobar) return;
    /* Progresión Socrática:
         0 errores → pista y resolver deshabilitados.
         1 error  → pista habilitada (un solo uso), resolver deshabilitado.
         2+ error → pista agotada, resolver habilitado. */
    btnPista.disabled = !(ordenActual.intentos >= 1 && !ordenActual.pistaUsada);
    btnResolver.disabled = !(ordenActual.intentos >= 2);
    /* Si se ha usado "Ver solución", el comprobar no concede estrella. */
    btnComprobar.disabled = ordenActual.resuelto;
  }

  function colocarDesdeDisponible(idPaso) {
    /* Busca el primer slot vacío y coloca ahí el paso. */
    var idx = ordenActual.slots.indexOf(null);
    if (idx === -1) return; /* No debería pasar: si no hay slots libres el paso está colocado. */
    ordenActual.slots[idx] = idPaso;
    ordenActual.disponibles = ordenActual.disponibles.filter(function (x) { return x !== idPaso; });
    ordenActual.seleccionadoSlot = idx;
    ordenActual.pistaSlot = -1;
    pintarOrdenar();
  }

  function tocarSlot(i) {
    var idPaso = ordenActual.slots[i];
    if (idPaso === null) return; /* Slot vacío: no hace nada (los pasos van por la columna derecha). */
    /* Slot ocupado: devuelve el paso a la columna de disponibles. */
    ordenActual.slots[i] = null;
    ordenActual.disponibles.push(idPaso);
    ordenActual.seleccionadoSlot = null;
    ordenActual.pistaSlot = -1;
    pintarOrdenar();
  }

  function actualizarBarraMover() {
    var sel = ordenActual.seleccionadoSlot;
    var total = ordenActual.slots.length;
    var btnSubir = $('#btnSubirPaso');
    var btnBajar = $('#btnBajarPaso');
    btnSubir.disabled = !(sel !== null && sel > 0 && ordenActual.slots[sel] !== null);
    btnBajar.disabled = !(sel !== null && sel < total - 1 && ordenActual.slots[sel] !== null);
  }

  function moverSlot(dir) {
    var sel = ordenActual.seleccionadoSlot;
    if (sel === null) return;
    var j = sel + dir;
    if (j < 0 || j >= ordenActual.slots.length) return;
    var a = ordenActual.slots[sel];
    var b = ordenActual.slots[j];
    ordenActual.slots[sel] = b;
    ordenActual.slots[j] = a;
    ordenActual.seleccionadoSlot = j;
    ordenActual.pistaSlot = -1;
    pintarOrdenar();
  }

  function contarBienColocados() {
    var n = 0;
    ordenActual.slots.forEach(function (idPaso, i) {
      if (idPaso === i) n++;
    });
    return n;
  }

  function comprobarOrden() {
    /* Si el usuario ha pedido ver la solución, comprobar no concede
       estrella (es solo una revisión, no un logro propio). */
    if (ordenActual.resuelto) {
      feedbackOrdenar.textContent = App.i18n.t('resolverOrdenar');
      return;
    }
    /* Solo se puede comprobar cuando todos los slots están llenos. */
    var vacios = ordenActual.slots.filter(function (s) { return s === null; }).length;
    if (vacios > 0) {
      App.feedback.encourage(feedbackOrdenar);
      feedbackOrdenar.textContent = App.i18n.t('ordenIncompleto');
      return;
    }
    var total = ordenActual.slots.length;
    var bien = contarBienColocados();
    var todoBien = bien === total;
    if (todoBien) {
      progreso.estrellas += 1;
      guardar();
      App.feedback.success(feedbackOrdenar);
      feedbackOrdenar.textContent = App.i18n.t('ordenCorrecto');
      App.feedback.celebrate(App.i18n.t('ordenCorrecto'));
      pintarEstrellas();
    } else {
      ordenActual.intentos++;
      /* Si ya consumió la pista, se resetea para el próximo ciclo de ayuda. */
      ordenActual.pistaUsada = false;
      guardar();
      App.feedback.encourage(feedbackOrdenar);
      /* Sin contador "X de Y pasos en su sitio": feedback cualitativo. */
      feedbackOrdenar.textContent = App.i18n.t('ordenIncorrecto');
      actualizarBotonesSocraticos();
    }
  }

  function pistaOrdenar() {
    /* Busca el primer slot mal colocado y lo marca visualmente.
       Si el slot 0 ya está bien, busca el primer índice cuyo paso
       correcto NO esté ya en su sitio. Eso da una pista útil y
       evita decir "pon primero X" cuando X ya está bien colocado. */
    var pasos = ordenActual.rutina.pasos;
    var slotAMarcar = -1;
    for (var i = 0; i < ordenActual.slots.length; i++) {
      if (ordenActual.slots[i] !== i) { slotAMarcar = i; break; }
    }
    if (slotAMarcar === -1) {
      /* Todo está bien colocado: pista trivial, no se muestra. */
      feedbackOrdenar.textContent = '';
      return;
    }
    ordenActual.pistaSlot = slotAMarcar;
    ordenActual.pistaUsada = true;
    feedbackOrdenar.textContent = App.i18n.t('pistaOrdenar')
      .replace('{primero}', pasos[slotAMarcar].texto)
      .replace('{posicion}', slotAMarcar + 1);
    pintarOrdenar();
    /* Quita el resaltado tras unos segundos para no condicionar el siguiente intento. */
    setTimeout(function () {
      if (ordenActual && ordenActual.pistaSlot === slotAMarcar) {
        ordenActual.pistaSlot = -1;
        pintarOrdenar();
      }
    }, 3500);
  }

  function resolverOrdenar() {
    ordenActual.slots = ordenActual.rutina.pasos.map(function (_, i) { return i; });
    ordenActual.disponibles = [];
    ordenActual.seleccionadoSlot = null;
    ordenActual.resuelto = true;
    pintarOrdenar();
    feedbackOrdenar.textContent = App.i18n.t('resolverOrdenar');
  }

  /* ---- Pantalla "Crea tu lista" ----
     Patrón "Compositor" de piano-keys: la persona escribe elementos
     libres, forma un borrador, le pone nombre en un panel propio
     (nunca window.prompt: rompe Lectura Fácil/TTS) y lo guarda.
     Sin Socrático (pista/explicación): no hay "respuesta correcta"
     que explicar, igual que el modo libre de piano-keys o builders.
     Gana 1⭐ cada lista guardada (regla: solo se suma, nunca se resta). */
  /* editando: referencia directa al objeto dentro de progreso.misListas
     que se está modificando (null = creando una lista nueva). Guardar la
     referencia, no el índice, evita desincronizarse si otra lista se
     borra mientras se edita esta. */
  var listaLibre = { items: [], editando: null, nombreOriginal: null };

  function abrirListaLibre() {
    listaLibre.items = [];
    listaLibre.editando = null;
    listaLibre.nombreOriginal = null;
    pantallaMenu.classList.add('oculto');
    pantallaListaLibre.classList.remove('oculto');
    $('#nombrarLista').classList.add('oculto');
    $('#feedbackListaLibre').textContent = '';
    $('#inputNuevoItem').placeholder = App.i18n.t('placeholderInputItem');
    $('#inputNuevoItem').setAttribute('aria-label', App.i18n.t('ariaInputItem'));
    $('#inputNuevoItem').value = '';
    pintarListaActual();
    pintarListasGuardadas();
  }

  function pintarListaActual() {
    var el = $('#itemsListaActual');
    el.innerHTML = '';
    if (listaLibre.items.length === 0) {
      var p = document.createElement('p');
      p.className = 'placeholder';
      p.textContent = App.i18n.t('listaActualVacia');
      el.appendChild(p);
    } else {
      listaLibre.items.forEach(function (texto, i) {
        var li = document.createElement('li');
        li.className = 'item-lista-actual';

        var flechas = document.createElement('div');
        flechas.className = 'item-lista-flechas';
        var btnSubir = document.createElement('button');
        btnSubir.type = 'button';
        btnSubir.className = 'btn-flecha-item';
        btnSubir.textContent = '↑';
        btnSubir.disabled = i === 0;
        btnSubir.setAttribute('aria-label', App.i18n.t('ariaSubirItem').replace('{texto}', texto));
        btnSubir.addEventListener('click', function () { moverItem(i, -1); });
        var btnBajar = document.createElement('button');
        btnBajar.type = 'button';
        btnBajar.className = 'btn-flecha-item';
        btnBajar.textContent = '↓';
        btnBajar.disabled = i === listaLibre.items.length - 1;
        btnBajar.setAttribute('aria-label', App.i18n.t('ariaBajarItem').replace('{texto}', texto));
        btnBajar.addEventListener('click', function () { moverItem(i, 1); });
        flechas.appendChild(btnSubir);
        flechas.appendChild(btnBajar);

        var span = document.createElement('span');
        span.className = 'texto';
        span.textContent = texto;
        var btnQuitar = document.createElement('button');
        btnQuitar.type = 'button';
        btnQuitar.className = 'btn-quitar-item';
        btnQuitar.textContent = '✕';
        btnQuitar.setAttribute('aria-label', App.i18n.t('ariaQuitarItem').replace('{texto}', texto));
        btnQuitar.addEventListener('click', function () { quitarItem(i); });
        li.appendChild(span);
        li.appendChild(flechas);
        li.appendChild(btnQuitar);
        el.appendChild(li);
      });
    }
    $('#btnGuardarLista').disabled = listaLibre.items.length === 0;
    actualizarAvisoEdicion();
  }

  function anadirItem() {
    var input = $('#inputNuevoItem');
    var texto = input.value.trim();
    if (!texto) return;
    listaLibre.items.push(texto);
    input.value = '';
    input.focus();
    pintarListaActual();
  }

  function quitarItem(i) {
    listaLibre.items.splice(i, 1);
    pintarListaActual();
  }

  function moverItem(i, dir) {
    var j = i + dir;
    if (j < 0 || j >= listaLibre.items.length) return;
    var tmp = listaLibre.items[i];
    listaLibre.items[i] = listaLibre.items[j];
    listaLibre.items[j] = tmp;
    pintarListaActual();
  }

  function vaciarListaActual() {
    listaLibre.items = [];
    pintarListaActual();
  }

  /* ---- Editar una lista guardada ----
     Carga sus elementos en el mismo editor que "Crea tu lista": añadir,
     quitar y reordenar funcionan igual. Al guardar se actualiza la lista
     en lugar de crear una nueva y no se concede estrella extra (evita
     "cultivar" estrellas editando una y otra vez). */
  function editarLista(lista) {
    listaLibre.items = lista.items.slice();
    listaLibre.editando = lista;
    listaLibre.nombreOriginal = lista.nombre;
    $('#nombrarLista').classList.add('oculto');
    pintarListaActual();
    pintarListasGuardadas();
    $('#inputNuevoItem').focus();
  }

  function cancelarEdicion() {
    listaLibre.items = [];
    listaLibre.editando = null;
    listaLibre.nombreOriginal = null;
    $('#nombrarLista').classList.add('oculto');
    pintarListaActual();
    pintarListasGuardadas();
  }

  function actualizarAvisoEdicion() {
    var editando = listaLibre.editando !== null;
    $('#editandoAviso').classList.toggle('oculto', !editando);
    if (editando) {
      $('#editandoAvisoTexto').textContent = App.i18n.t('editandoListaAviso').replace('{nombre}', listaLibre.nombreOriginal);
    }
    $('#btnGuardarLista').textContent = App.i18n.t(editando ? 'btnGuardarCambios' : 'btnGuardarLista');
  }

  function mostrarNombrarLista() {
    if (listaLibre.items.length === 0) return;
    var input = $('#inputNombreLista');
    input.value = listaLibre.editando !== null ? listaLibre.nombreOriginal : App.i18n.t('promptNombreListaDefault');
    $('#nombrarLista').classList.remove('oculto');
    input.focus();
    input.select();
  }

  function confirmarGuardarLista() {
    var nombre = $('#inputNombreLista').value.trim().slice(0, 30) || App.i18n.t('promptNombreListaDefault');
    var editando = listaLibre.editando;
    if (editando) {
      editando.nombre = nombre;
      editando.items = listaLibre.items.slice();
    } else {
      progreso.misListas.push({ nombre: nombre, items: listaLibre.items.slice() });
      progreso.estrellas += 1;
    }
    guardar();
    listaLibre.items = [];
    listaLibre.editando = null;
    listaLibre.nombreOriginal = null;
    $('#nombrarLista').classList.add('oculto');
    pintarListaActual();
    pintarListasGuardadas();
    pintarEstrellas();
    var feedbackEl = $('#feedbackListaLibre');
    App.feedback.success(feedbackEl);
    feedbackEl.textContent = App.i18n.t(editando ? 'listaActualizadaFeedback' : 'listaGuardadaFeedback');
  }

  function pintarListasGuardadas() {
    var el = $('#listasGuardadas');
    el.innerHTML = '';
    if (progreso.misListas.length === 0) return;

    var h3 = document.createElement('h3');
    h3.textContent = App.i18n.t('tusListas');
    el.appendChild(h3);

    progreso.misListas.forEach(function (lista, i) {
      var editandoEsta = listaLibre.editando === lista;

      var wrap = document.createElement('div');
      wrap.className = 'lista-guardada' + (editandoEsta ? ' lista-guardada-editando' : '');

      var fila = document.createElement('div');
      fila.className = 'lista-guardada-fila';

      var info = document.createElement('button');
      info.type = 'button';
      info.className = 'lista-guardada-info';
      info.setAttribute('aria-expanded', 'false');
      info.setAttribute('aria-label', App.i18n.t('ariaVerLista').replace('{nombre}', lista.nombre));
      var nombre = document.createElement('span');
      nombre.className = 'nombre';
      nombre.textContent = lista.nombre;
      var cantidad = document.createElement('span');
      cantidad.className = 'cantidad';
      cantidad.textContent = App.i18n.t('elementosCount').replace('{n}', lista.items.length);
      info.appendChild(nombre);
      info.appendChild(cantidad);

      var acciones = document.createElement('div');
      acciones.className = 'lista-guardada-acciones';
      var btnPracticar = document.createElement('button');
      btnPracticar.type = 'button';
      btnPracticar.className = 'btn btn-empezar';
      btnPracticar.textContent = App.i18n.t('btnPracticarLista');
      btnPracticar.setAttribute('aria-label', App.i18n.t('btnPracticarLista') + ': ' + lista.nombre);
      btnPracticar.addEventListener('click', function () {
        abrirRutina({
          id: 'lista-' + i,
          nombre: lista.nombre,
          picto: '📝',
          pasos: lista.items.map(function (texto) {
            return { picto: '✅', texto: texto };
          })
        });
      });
      var btnEditar = document.createElement('button');
      btnEditar.type = 'button';
      btnEditar.textContent = '✏️';
      btnEditar.disabled = editandoEsta;
      btnEditar.setAttribute('aria-label', App.i18n.t('ariaEditarLista').replace('{nombre}', lista.nombre));
      btnEditar.addEventListener('click', function () { editarLista(lista); });
      var btnEscuchar = document.createElement('button');
      btnEscuchar.type = 'button';
      btnEscuchar.textContent = '🔊';
      btnEscuchar.setAttribute('aria-label', App.i18n.t('ariaEscucharLista').replace('{nombre}', lista.nombre));
      btnEscuchar.addEventListener('click', function () {
        App.tts.speak(lista.nombre + '. ' + lista.items.join(', '));
      });
      var btnBorrar = document.createElement('button');
      btnBorrar.type = 'button';
      btnBorrar.textContent = '🗑️';
      btnBorrar.disabled = editandoEsta;
      btnBorrar.setAttribute('aria-label', App.i18n.t('ariaBorrarLista').replace('{nombre}', lista.nombre));
      btnBorrar.addEventListener('click', function () {
        progreso.misListas.splice(i, 1);
        guardar();
        pintarListasGuardadas();
        var feedbackEl = $('#feedbackListaLibre');
        feedbackEl.className = 'feedback';
        feedbackEl.textContent = App.i18n.t('listaBorradaFeedback');
      });
      acciones.appendChild(btnPracticar);
      acciones.appendChild(btnEditar);
      acciones.appendChild(btnEscuchar);
      acciones.appendChild(btnBorrar);

      fila.appendChild(info);
      fila.appendChild(acciones);
      wrap.appendChild(fila);

      var itemsEl = document.createElement('ul');
      itemsEl.className = 'lista-guardada-items oculto';
      lista.items.forEach(function (texto) {
        var li = document.createElement('li');
        li.textContent = texto;
        itemsEl.appendChild(li);
      });
      wrap.appendChild(itemsEl);

      info.addEventListener('click', function () {
        var visible = !itemsEl.classList.contains('oculto');
        itemsEl.classList.toggle('oculto', visible);
        info.setAttribute('aria-expanded', String(!visible));
      });

      el.appendChild(wrap);
    });
  }

  /* Events */
  $('#btnOtraRutina').addEventListener('click', pintarMenu);
  tabPredefinidas.addEventListener('click', function () { pintarMenu(); });
  tabPropias.addEventListener('click', function () { mostrarTab('propias'); });
  $('#btnComprobar').addEventListener('click', comprobarOrden);
  $('#btnPistaOrdenar').addEventListener('click', pistaOrdenar);
  $('#btnSubirPaso').addEventListener('click', function () { moverSlot(-1); });
  $('#btnBajarPaso').addEventListener('click', function () { moverSlot(1); });
  $('#btnResolverOrdenar').addEventListener('click', resolverOrdenar);

  $('#btnAnadirItem').addEventListener('click', anadirItem);
  $('#inputNuevoItem').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); anadirItem(); }
  });
  $('#btnVaciarLista').addEventListener('click', vaciarListaActual);
  $('#btnCancelarEdicion').addEventListener('click', cancelarEdicion);
  $('#btnGuardarLista').addEventListener('click', mostrarNombrarLista);
  $('#btnConfirmarGuardarLista').addEventListener('click', confirmarGuardarLista);
  $('#inputNombreLista').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); confirmarGuardarLista(); }
  });

  $('#btnVolver').addEventListener('click', function (e) {
    /* If we're inside a routine, go back to the routine menu */
    if (!pantallaRutina.classList.contains('oculto') ||
        !pantallaOrdenar.classList.contains('oculto') ||
        !pantallaListaLibre.classList.contains('oculto')) {
      e.preventDefault();
      App.tts.stop();
      pintarMenu();
    }
  });

  pintarMenu();
})();
