/* ============================================================
   Routime â€” Lista de Tareas (autonomÃ­a: organizar tareas mixtas
   de casa, trabajo y cuidado personal en el orden lÃ³gico del dÃ­a).
   Datos en data.js (DATA.niveles). MÃ³dulos compartidos en assets/js/.
   Tres niveles:
     - Niveles 1 y 2: ordenar tareas predefinidas (simulaciÃ³n).
       Tocar las tareas en el orden correcto. Un toque fuera de
       orden no penaliza: solo anima a seguir intentando.
     - Nivel 3: "Crea tu lista" â€” simulaciÃ³n y proceso de
       entrenamiento. La persona practica el flujo real de una
       lista: poner nombre, aÃ±adir elementos, reordenarlos con
       â†‘/â†“, marcarlos como "Hecho", borrar elementos, guardar la
       lista y volver a abrirla mÃ¡s tarde. Las listas se guardan
       en localStorage del dispositivo (no son datos personales,
       son listas de prÃ¡ctica).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'lista-tareas';
  var $ = App.utils.$;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  var pantallaInicio = $('#pantallaInicio');
  var pantallaJuego = $('#pantallaJuego');
  var pantallaCrear = $('#pantallaCrear');
  var pantallaFinal = $('#pantallaFinal');
  var listaTituloEl = $('#listaTitulo');
  var secuenciaEl = $('#secuencia');
  var disponiblesEl = $('#disponibles');
  var feedbackEl = $('#feedback');
  var feedbackCrearEl = $('#feedbackCrear');
  var btnSiguiente = $('#btnSiguiente');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  /* Persistent progress */
  var progreso = App.storage.get(TOOL_ID);
  if (typeof progreso.estrellas !== 'number') progreso.estrellas = 0;
  if (!progreso.completados) progreso.completados = {};
  if (typeof progreso.rondasCompletadas !== 'number') progreso.rondasCompletadas = 0;
  /* Listas de prÃ¡ctica del nivel "Crea tu lista". Se persisten en
     localStorage del dispositivo. VacÃ­o por defecto. */
  if (!Array.isArray(progreso.misListas)) progreso.misListas = [];

  /* Round state */
  var nivelActual = null;
  var listas = [];
  var idx = 0;
  var aciertosRonda = 0;
  var siguienteEsperado = 0;
  var slots = [];

  function guardar() { App.storage.set(TOOL_ID, progreso); }

  function pintarEstrellas() { starsEl.textContent = 'â­ ' + progreso.estrellas; }

  function mostrarPantalla(id) {
    [pantallaInicio, pantallaJuego, pantallaCrear, pantallaFinal].forEach(function (p) {
      if (p) p.classList.add('oculto');
    });
    var dest = $('#' + id);
    if (dest) dest.classList.remove('oculto');
  }

  /* Determina el nivel según el progreso: cada ronda completada, sube un nivel. */
  function nivelSegunProgreso() {
    var idxN = Math.min(progreso.rondasCompletadas, DATOS.niveles.length - 1);
    return DATOS.niveles[idxN];
  }

  /* Muestra la dificultad actual (etiqueta del nivel). */
  function pintarDificultad() {
    if (dificultadEl) {
      dificultadEl.textContent = nivelActual.nombre;
    }
  }

  function iniciarJuego() {
    nivelActual = nivelSegunProgreso();
    if (nivelActual.listasLibres) {
      abrirPantallaCrear();
      return;
    }
    listas = App.utils.shuffle(nivelActual.listas).slice(0, DATOS.porRonda);
    idx = 0;
    aciertosRonda = 0;
    mostrarPantalla('pantallaJuego');
    pintarDificultad();
    render();
  }
      cont.appendChild(btn);
    });
  }

  function iniciarNivel(n) {
    nivel = n;
    if (n.listasLibres) {
      abrirPantallaCrear();
      return;
    }
    listas = App.utils.shuffle(nivel.listas).slice(0, DATOS.porRonda);
    idx = 0;
    aciertosRonda = 0;
    mostrarPantalla('pantallaJuego');
    render();
  }

  function pintarProgreso() {
    progressFill.style.width = ((idx / DATOS.porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function render() {
    var lista = listas[idx];
    siguienteEsperado = 0;
    slots = new Array(lista.items.length).fill(null);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnSiguiente.classList.add('oculto');
    listaTituloEl.textContent = lista.nombre;

    pintarSlots();

    disponiblesEl.innerHTML = '';
    App.utils.shuffle(lista.items.map(function (item, orden) {
      return { item: item, orden: orden };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn tarea-btn';
      btn.innerHTML = '<span class="tarea-picto" aria-hidden="true">' + p.item.picto + '</span>' +
        '<span class="tarea-texto">' + p.item.texto + '</span>';
      btn.setAttribute('aria-label', App.i18n.t('ariaTarea') + ': ' + p.item.texto);
      btn.addEventListener('click', function () { tocar(p.orden, btn); });
      disponiblesEl.appendChild(btn);
    });

    pintarProgreso();
    pintarEstrellas();
  }

  function pintarSlots() {
    secuenciaEl.innerHTML = '';
    var lista = listas[idx];
    slots.forEach(function (item, i) {
      var div = document.createElement('div');
      div.className = 'slot' + (item ? ' lleno' : '');
      if (item) {
        div.innerHTML = '<span class="tarea-picto" aria-hidden="true">' + item.picto + '</span>' +
          '<span class="tarea-texto">' + item.texto + '</span>';
      } else {
        div.textContent = String(i + 1);
      }
      secuenciaEl.appendChild(div);
    });
  }

  function tocar(orden, btn) {
    var lista = listas[idx];
    if (orden === siguienteEsperado) {
      slots[orden] = lista.items[orden];
      pintarSlots();
      btn.disabled = true;
      btn.classList.add('colocada');
      App.feedback.success(feedbackEl);
      siguienteEsperado += 1;
      if (siguienteEsperado >= lista.items.length) {
        terminarTarea();
      }
    } else {
      App.feedback.encourage(feedbackEl);
    }
  }

  function terminarTarea() {
    progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
    aciertosRonda += 1;
    guardar();
    pintarEstrellas();
    btnSiguiente.classList.remove('oculto');
    btnSiguiente.focus();
  }

  function siguiente() {
    idx += 1;
    if (idx >= DATOS.porRonda) {
      terminarRonda();
    } else {
      render();
    }
  }

  function terminarRonda() {
    progreso.completados[nivelActual.id] = (progreso.completados[nivelActual.id] || 0) + 1;
    guardar();
    mostrarPantalla('pantallaFinal');
    $('#resumenFinal').textContent.textContent = '';
    $('#transferencia').textContent.textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ============================================================
     Pantalla "Crea tu lista" (Nivel 3).
     SimulaciÃ³n y proceso de entrenamiento del flujo real de una
     lista:
       1. Poner nombre a la lista (sin window.prompt: Lectura FÃ¡cil).
       2. AÃ±adir elementos uno a uno (Enter o botÃ³n).
       3. Reordenar con flechas â†‘/â†“ (seleccionar + mover).
       4. Marcar / desmarcar como "Hecho" (toggle por elemento).
       5. Quitar un elemento (botÃ³n âœ•) o vaciar toda la lista.
       6. Guardar la lista (gana 1â­ la primera vez).
       7. Volver a "Mis listas" (botÃ³n dentro del editor, sin salir
          del nivel) para crear otra lista, abrir una guardada o
          borrarla, y asÃ­ practicar a manejar varias listas.
     Antes de empezar se muestra un consejo breve (piensa, apunta,
     ordena, marca) para modelar el mÃ©todo antes de practicar.
     No hay pista/ExplicaciÃ³n SocrÃ¡tica: las decisiones son libres
     (mismo razonamiento que piano-keys en modo libre o
     tools/builders). Gana 1â­ solo al guardar una lista por
     primera vez (regla: solo se suma, nunca se resta).
     ============================================================ */
  var listaCrear = { nombre: '', items: [], seleccionado: -1 };

  function abrirPantallaCrear() {
    listaCrear = { nombre: '', items: [], seleccionado: -1 };
    mostrarPantalla('pantallaCrear');
    $('#panelNombre').classList.remove('oculto');
    $('#panelEditor').classList.add('oculto');
    var inputNombre = $('#inputNombreListaCrear');
    inputNombre.value = '';
    inputNombre.placeholder = App.i18n.t('promptNombreListaDefault');
    feedbackCrearEl.textContent = '';
    feedbackCrearEl.className = 'feedback';
    pintarListasGuardadas();
    pintarEstrellas();
    inputNombre.focus();
  }

  function confirmarNombreLista() {
    var inputNombre = $('#inputNombreListaCrear');
    var nombre = inputNombre.value.trim().slice(0, 30);
    if (!nombre) {
      feedbackCrearEl.textContent = App.i18n.t('nombreRequerido');
      feedbackCrearEl.className = 'feedback animo';
      App.feedback.encourage(feedbackCrearEl);
      inputNombre.focus();
      return;
    }
    listaCrear.nombre = nombre;
    $('#panelNombre').classList.add('oculto');
    $('#panelEditor').classList.remove('oculto');
    $('#tituloListaCrear').textContent.textContent = '';
    var inputItem = $('#inputNuevoItemCrear');
    inputItem.placeholder = App.i18n.t('placeholderInputItem');
    inputItem.setAttribute('aria-label', App.i18n.t('ariaInputItem'));
    pintarItemsCrear();
    feedbackCrearEl.textContent = '';
    feedbackCrearEl.className = 'feedback';
    inputItem.focus();
  }

  function pintarItemsCrear() {
    var el = $('#itemsListaCrear');
    el.innerHTML = '';
    if (listaCrear.items.length === 0) {
      var p = document.createElement('li');
      p.className = 'item-vacio';
      p.textContent = App.i18n.t('listaActualVacia');
      el.appendChild(p);
    } else {
      listaCrear.items.forEach(function (it, i) {
        var li = document.createElement('li');
        li.className = 'item-crear' +
          (it.hecho ? ' hecho' : '') +
          (i === listaCrear.seleccionado ? ' seleccionado' : '');

        var pos = document.createElement('span');
        pos.className = 'item-pos';
        pos.setAttribute('aria-hidden', 'true');
        pos.textContent = (i + 1);

        var check = document.createElement('button');
        check.type = 'button';
        check.className = 'item-check';
        check.setAttribute('aria-pressed', String(Boolean(it.hecho)));
        check.setAttribute(
          'aria-label',
          (it.hecho ? App.i18n.t('ariaItemHecho') : App.i18n.t('ariaItemPendiente'))
            .replace('{texto}', it.texto)
        );
        check.textContent = it.hecho ? 'âœ”' : 'â—‹';
        check.addEventListener('click', function (e) {
          e.stopPropagation();
          toggleHecho(i);
        });

        var texto = document.createElement('span');
        texto.className = 'item-texto';
        texto.textContent = it.texto;

        var sel = document.createElement('button');
        sel.type = 'button';
        sel.className = 'item-seleccionar';
        sel.setAttribute('aria-label',
          App.i18n.t('ariaSeleccionarItem').replace('{n}', i + 1).replace('{texto}', it.texto));
        sel.textContent = 'â†•';
        sel.addEventListener('click', function (e) {
          e.stopPropagation();
          seleccionarItem(i);
        });

        var quitar = document.createElement('button');
        quitar.type = 'button';
        quitar.className = 'item-quitar';
        quitar.textContent = 'âœ•';
        quitar.setAttribute('aria-label', App.i18n.t('ariaQuitarItem').replace('{texto}', it.texto));
        quitar.addEventListener('click', function (e) {
          e.stopPropagation();
          quitarItemCrear(i);
        });

        li.appendChild(pos);
        li.appendChild(check);
        li.appendChild(texto);
        li.appendChild(sel);
        li.appendChild(quitar);

        li.addEventListener('click', function () { seleccionarItem(i); });
        el.appendChild(li);
      });
    }

    var hechos = listaCrear.items.filter(function (x) { return x.hecho; }).length;
    var total = listaCrear.items.length;
    var progEl = $('#progresoListaCrear');
    if (total === 0) {
      progEl.textContent = '';
    } else if (hechos === total) {
      progEl.textContent = App.i18n.t('progresoCrearCompleta');
    } else {
      progEl.textContent = '';
    }

    $('#btnGuardarListaCrear').disabled = listaCrear.items.length === 0;

    var sel = listaCrear.seleccionado;
    var btnSubir = $('#btnSubirItemCrear');
    var btnBajar = $('#btnBajarItemCrear');
    btnSubir.disabled = !(sel > 0 && listaCrear.items.length > 0);
    btnBajar.disabled = !(sel >= 0 && sel < listaCrear.items.length - 1);
  }

  function seleccionarItem(i) {
    listaCrear.seleccionado = (listaCrear.seleccionado === i) ? -1 : i;
    pintarItemsCrear();
    if (listaCrear.seleccionado === -1) {
      feedbackCrearEl.textContent = App.i18n.t('selectorVacio');
      feedbackCrearEl.className = 'feedback';
    } else {
      feedbackCrearEl.textContent = App.i18n.t('seleccionaParaMover');
      feedbackCrearEl.className = 'feedback';
    }
  }

  function moverItemCrear(dir) {
    var sel = listaCrear.seleccionado;
    if (sel < 0) {
      feedbackCrearEl.textContent = App.i18n.t('selectorVacio');
      feedbackCrearEl.className = 'feedback';
      return;
    }
    var j = sel + dir;
    if (j < 0 || j >= listaCrear.items.length) return;
    var tmp = listaCrear.items[sel];
    listaCrear.items[sel] = listaCrear.items[j];
    listaCrear.items[j] = tmp;
    listaCrear.seleccionado = j;
    App.feedback.success(feedbackCrearEl);
    feedbackCrearEl.textContent = '';
    pintarItemsCrear();
  }

  function anadirItemCrear() {
    var input = $('#inputNuevoItemCrear');
    var texto = input.value.trim();
    if (!texto) return;
    listaCrear.items.push({ texto: texto.slice(0, 60), hecho: false });
    input.value = '';
    App.feedback.success(feedbackCrearEl);
    feedbackCrearEl.textContent = '';
    input.focus();
    pintarItemsCrear();
  }

  function quitarItemCrear(i) {
    var texto = listaCrear.items[i].texto;
    listaCrear.items.splice(i, 1);
    if (listaCrear.seleccionado === i) listaCrear.seleccionado = -1;
    else if (listaCrear.seleccionado > i) listaCrear.seleccionado -= 1;
    feedbackCrearEl.className = 'feedback';
    App.feedback.encourage(feedbackCrearEl);
    feedbackCrearEl.textContent = '';
    pintarItemsCrear();
  }

  function toggleHecho(i) {
    var it = listaCrear.items[i];
    it.hecho = !it.hecho;
    if (it.hecho) {
      App.feedback.success(feedbackCrearEl);
      feedbackCrearEl.textContent = '';
    } else {
      feedbackCrearEl.textContent = '';
    }
    pintarItemsCrear();
  }

  function vaciarListaCrear() {
    listaCrear.items = [];
    listaCrear.seleccionado = -1;
    feedbackCrearEl.textContent = App.i18n.t('listaBorradaFeedback');
    feedbackCrearEl.className = 'feedback';
    pintarItemsCrear();
  }

  function guardarListaCrear() {
    if (listaCrear.items.length === 0) return;
    var entradas = listaCrear.items.map(function (it) {
      return { texto: it.texto, hecho: Boolean(it.hecho) };
    });
    /* Si la lista ya existÃ­a (mismo nombre), actualizamos en vez de duplicar. */
    var idxExistente = -1;
    for (var i = 0; i < progreso.misListas.length; i++) {
      if (progreso.misListas[i].nombre === listaCrear.nombre) { idxExistente = i; break; }
    }
    var esNueva = idxExistente === -1;
    if (esNueva) {
      progreso.misListas.push({
        nombre: listaCrear.nombre,
        items: entradas,
        guardada: App.utils.hoy()
      });
      progreso.estrellas += 1;
      if (App.feedback && App.feedback.star) App.feedback.star(); /* Sumar estrella solo al guardar una lista nueva. */
    } else {
      progreso.misListas[idxExistente].items = entradas;
      progreso.misListas[idxExistente].guardada = App.utils.hoy();
    }
    guardar();
    pintarEstrellas();
    App.feedback.success(feedbackCrearEl);
    feedbackCrearEl.textContent = App.i18n.t('listaGuardadaFeedback');
    pintarListasGuardadas();
  }

  function pintarListasGuardadas() {
    var el = $('#listasGuardadas');
    if (!el) return;
    el.innerHTML = '';
    if (progreso.misListas.length === 0) return;

    var h3 = document.createElement('h3');
    h3.textContent = App.i18n.t('tusListas');
    el.appendChild(h3);

    progreso.misListas.forEach(function (lista, i) {
      var wrap = document.createElement('div');
      wrap.className = 'lista-guardada';

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
      cantidad.textContent = '';
      info.appendChild(nombre);
      info.appendChild(cantidad);

      var acciones = document.createElement('div');
      acciones.className = 'lista-guardada-acciones';

      var btnEscuchar = document.createElement('button');
      btnEscuchar.type = 'button';
      btnEscuchar.textContent = 'ðŸ”Š';
      btnEscuchar.setAttribute('aria-label', App.i18n.t('ariaEscucharLista').replace('{nombre}', lista.nombre));
      btnEscuchar.addEventListener('click', function (e) {
        e.stopPropagation();
        var hechos = lista.items.filter(function (x) { return x.hecho; }).length;
        if (false && App.tts && App.tts.speak) App.tts.speak(lista.nombre + '. ' + lista.items.length + ' ' +
          App.i18n.t('elementosCount').replace('{n}', lista.items.length) + '. ' +
          lista.items.map(function (x) { return x.texto; }).join(', '));
      });

      var btnAbrir = document.createElement('button');
      btnAbrir.type = 'button';
      btnAbrir.textContent = 'âœï¸';
      btnAbrir.setAttribute('aria-label', App.i18n.t('ariaAbrirLista').replace('{nombre}', lista.nombre));
      btnAbrir.addEventListener('click', function (e) {
        e.stopPropagation();
        abrirListaGuardada(i);
      });

      var btnBorrar = document.createElement('button');
      btnBorrar.type = 'button';
      btnBorrar.textContent = 'ðŸ—‘ï¸';
      btnBorrar.setAttribute('aria-label', App.i18n.t('ariaBorrarLista').replace('{nombre}', lista.nombre));
      btnBorrar.addEventListener('click', function (e) {
        e.stopPropagation();
        progreso.misListas.splice(i, 1);
        guardar();
        pintarListasGuardadas();
        feedbackCrearEl.className = 'feedback';
        feedbackCrearEl.textContent = App.i18n.t('listaBorradaFeedback');
      });

      acciones.appendChild(btnEscuchar);
      acciones.appendChild(btnAbrir);
      acciones.appendChild(btnBorrar);

      fila.appendChild(info);
      fila.appendChild(acciones);
      wrap.appendChild(fila);

      var itemsEl = document.createElement('ul');
      itemsEl.className = 'lista-guardada-items oculto';
      lista.items.forEach(function (it) {
        var li = document.createElement('li');
        li.className = it.hecho ? 'hecho' : '';
        li.textContent = (it.hecho ? 'âœ” ' : 'â—‹ ') + it.texto;
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

  /* Vuelve al panel de "Mis listas" sin salir del Nivel 3, para poder
     crear otra lista, abrir otra guardada o borrar alguna sin perder
     el sitio (los cambios sin guardar de la lista actual se pierden,
     igual que al pulsar "Volver": guardarListaCrear() es explÃ­cito). */
  function volverAMisListas() {
    $('#panelEditor').classList.add('oculto');
    $('#panelNombre').classList.remove('oculto');
    var inputNombre = $('#inputNombreListaCrear');
    inputNombre.value = '';
    inputNombre.placeholder = App.i18n.t('promptNombreListaDefault');
    feedbackCrearEl.textContent = '';
    feedbackCrearEl.className = 'feedback';
    pintarListasGuardadas();
    pintarEstrellas();
    inputNombre.focus();
  }

  function abrirListaGuardada(i) {
    var lista = progreso.misListas[i];
    if (!lista) return;
    listaCrear = {
      nombre: lista.nombre,
      items: lista.items.map(function (x) { return { texto: x.texto, hecho: Boolean(x.hecho) }; }),
      seleccionado: -1
    };
    $('#panelNombre').classList.add('oculto');
    $('#panelEditor').classList.remove('oculto');
    $('#tituloListaCrear').textContent.textContent = '';
    var inputItem = $('#inputNuevoItemCrear');
    inputItem.value = '';
    inputItem.placeholder = App.i18n.t('placeholderInputItem');
    inputItem.setAttribute('aria-label', App.i18n.t('ariaInputItem'));
    feedbackCrearEl.textContent = '';
    feedbackCrearEl.className = 'feedback';
    pintarItemsCrear();
    inputItem.focus();
  }

  /* Events */
  btnSiguiente.addEventListener('click', siguiente);
  $('#btnRepetir').addEventListener('click', function () { iniciarJuego(); });
  $('#btnMenu').addEventListener('click', function () {
    mostrarPantalla('pantallaInicio');
  });

  /* Eventos del Nivel 3 â€” "Crea tu lista". */
  $('#btnEmpezarCrear').addEventListener('click', confirmarNombreLista);
  $('#inputNombreListaCrear').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); confirmarNombreLista(); }
  });
  $('#btnAnadirItemCrear').addEventListener('click', anadirItemCrear);
  $('#inputNuevoItemCrear').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); anadirItemCrear(); }
  });
  $('#btnVaciarListaCrear').addEventListener('click', vaciarListaCrear);
  $('#btnGuardarListaCrear').addEventListener('click', guardarListaCrear);
  $('#btnSubirItemCrear').addEventListener('click', function () { moverItemCrear(-1); });
  $('#btnBajarItemCrear').addEventListener('click', function () { moverItemCrear(1); });
  $('#btnMisListas').addEventListener('click', volverAMisListas);

  /* "Volver" contextual: si la persona estÃ¡ en medio de "Crea tu
     lista", la primera pulsaciÃ³n la lleva al menÃº de niveles
     (no al sitio), igual que en routines (btnVolver). */
  $('#btnVolver').addEventListener('click', function (e) {
    if (!pantallaCrear.classList.contains('oculto')) {
      e.preventDefault();
      mostrarPantalla('pantallaInicio');
    }
  });

  pintarEstrellas();
})();

