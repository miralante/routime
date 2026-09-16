#!/usr/bin/env python3
"""
Regenerate HTML files for worker-modified activities.
Each activity has its own structure; this script generates minimal but complete HTML
based on the app.js variable declarations.
"""
import os
import re

BASE = 'routime/tools'

# Activity-specific HTML structures
# These are hand-crafted for each activity based on its app.js
ACTIVITY_TEMPLATES = {

    'where-to-store': {
        'title': 'Donde lo guardo? | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <div class="item-row">
          <span id="itemPicto" class="picto-grande"></span>
          <span id="itemPalabra" class="palabra-item"></span>
        </div>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="boxes-grid" id="cajas"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'blocks': {
        'title': 'Bloques | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="bloques-container centered stack">
        <div class="grids-row">
          <div id="gridModelo" class="grid-4x4" aria-label="Modelo"></div>
          <div id="gridTuyo" class="grid-4x4" aria-label="Tu construccion"></div>
        </div>
        <div id="paleta" class="paleta"></div>
      </div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'where-is': {
        'title': 'Donde esta? | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <p class="prompt" id="prompt" aria-live="polite"></p>
        <button type="button" class="btn btn-audio" id="btnConsigna">&#128266;</button>
      </div>
      <div class="escena" id="escena"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'whats-missing': {
        'title': 'Que falta? | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <p class="etapa-texto" id="etapaTexto"></p>
      </div>
      <div class="objetos-row" id="objetos"></div>
      <div class="zona-pregunta" id="zonaPregunta"></div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnListo">Listo</button>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'clock': {
        'title': 'El Reloj | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progresoRelleno"></div>
        <span class="progress-text" id="progresoTexto"></span>
      </div>
      <div class="card centered stack" id="zonaPregunta">
        <p id="questionText" class="prompt" aria-live="polite"></p>
      </div>
      <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation oculto" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn oculto" id="btnNext">Siguiente &#8594;</button>''',
        'stars_id': 'estrellas',
    },

    'friends': {
        'title': 'Amigos y situaciones | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'healthy-food': {
        'title': 'Alimentacion saludable | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="itemPicto" class="picto-grande"></span>
        <span id="itemPalabra" class="palabra-item"></span>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="boxes-grid" id="cajas"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'my-body': {
        'title': 'Mi cuerpo | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <p id="questionText" class="prompt" aria-live="polite"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'post-or-not': {
        'title': 'Publicar o no publicar | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'self-esteem': {
        'title': 'Autoestima | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
        <button type="button" class="btn btn-secondary" id="btnEscucharExplicacion">Escuchar explicacion</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'sentence': {
        'title': 'Construye la frase | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <p id="fraseTexto" class="frase-texto"></p>
        <p id="preguntaTexto" class="pregunta-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'signs': {
        'title': 'Senales de trafico | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <div id="senalVisual" class="senal-display"></div>
        <p id="senalNombre" class="senal-nombre"></p>
      </div>
      <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'situations': {
        'title': 'Que harías tu? | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'street': {
        'title': 'En la calle | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'times-of-day': {
        'title': 'Momentos del dia | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="itemPicto" class="picto-grande"></span>
        <p id="itemTarea" class="item-tarea"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="listas-dia" id="listasDia"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'tracing': {
        'title': 'Traza | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="tracing-container">
        <div class="seleccion-screen" id="selectionScreen">
          <p id="formaTitulo" class="forma-titulo"></p>
          <div class="seleccion-botones">
            <button type="button" class="btn btn-secondary" id="btnSeleccionarMayus">Mayusculas</button>
            <button type="button" class="btn btn-secondary" id="btnSeleccionarMinus">Minusculas</button>
            <button type="button" class="btn btn-secondary" id="btnSeleccionarTodo">Todo</button>
            <button type="button" class="btn btn-secondary" id="btnSeleccionarNada">Quitar todo</button>
          </div>
          <p id="seleccionResumen" class="seleccion-resumen"></p>
          <button type="button" class="btn" id="btnIniciarPractica">Practicar</button>
          <button type="button" class="btn btn-secondary" id="btnModoLibre">Modo libre</button>
        </div>
        <div class="canvas-container">
          <div class="rejillas-container">
            <div id="rejillaMayus" class="rejilla-mayus"></div>
            <div id="rejillaMinus" class="rejilla-minus"></div>
          </div>
          <svg id="canvas" class="canvas-trazo" viewBox="0 0 400 400">
            <path id="guia" fill="none" stroke="#ccc" stroke-width="3"/>
            <path id="trazoUsuario" fill="none" stroke="var(--mod-lenguaje)" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="trazo-controles">
          <button type="button" class="btn btn-secondary" id="btnBorrar">Borrar</button>
          <button type="button" class="btn" id="btnComprobar">Comprobar</button>
        </div>
      </div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'trust-circle': {
        'title': 'Circulo de confianza | Routime',
        'game_content': '''
      <div class="intro-screen" id="pantallaIntro">
        <p class="instruccion">Aprende situaciones seguras y peligrosas con tus contactos de confianza.</p>
        <button type="button" class="btn" id="btnContinuarIntro">Continuar</button>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
        <button type="button" class="btn btn-secondary" id="btnEscucharExplicacion">Escuchar explicacion</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'turns-mirrors': {
        'title': 'Giros y simetrias | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <div id="modeloFigura" class="figura-modelo"></div>
        <p id="question" class="pregunta"></p>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>
      <button type="button" class="btn btn-secondary hidden" id="btnPregunta">Nueva pregunta</button>''',
    },

    'what-do-i-need': {
        'title': 'Que necesito? | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <p id="questionText" class="prompt" aria-live="polite"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'what-first': {
        'title': 'Que hago primero? | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'what-to-wear': {
        'title': 'Que me pongo? | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <span id="situacionPicto" class="picto-situacion"></span>
        <p id="situacionTexto" class="situacion-texto"></p>
        <button type="button" class="btn btn-audio" id="listenBtn">&#128266;</button>
      </div>
      <div class="options stack" id="options"></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="row explanation hidden" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'fit': {
        'title': 'Encaja la Pieza | Routime',
        'game_content': '''
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="fila centrado-fila">
        <p class="estado" id="estado" aria-live="polite"></p>
      </div>
      <div class="tablero-piezas" id="tablero" aria-label="Tablero de las piezas"></div>
      <div class="mando">
        <button type="button" class="btn btn-control" id="btnIzquierda">&#11013;</button>
        <button type="button" class="btn btn-control" id="btnGirar">&#128260;</button>
        <button type="button" class="btn btn-control" id="btnBajar">&#11014;</button>
        <button type="button" class="btn btn-control" id="btnDerecha">&#10145;</button>
      </div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="fila explicacion oculto" id="explanationWrap">
        <p id="explanation" aria-live="polite"></p>
      </div>
      <button type="button" class="btn oculto" id="btnNext">Siguiente &#8594;</button>''',
    },

    'task-list': {
        'title': 'Lista de tareas | Routime',
        'game_content': '''
      <div class="create-screen oculto" id="createScreen">
        <h3>Crear tu lista</h3>
        <input type="text" id="inputNombreListaCrear" placeholder="Nombre de la lista" />
        <button type="button" class="btn btn-secondary" id="btnAnadirItemCrear">Anadir</button>
        <input type="text" id="inputNuevoItemCrear" placeholder="Nuevo item" />
        <div id="itemsListaCrear" class="items-crear"></div>
        <p id="progresoListaCrear"></p>
        <button type="button" class="btn" id="btnGuardarListaCrear">Guardar</button>
        <button type="button" class="btn btn-secondary" id="btnVaciarListaCrear">Vaciar</button>
        <button type="button" class="btn btn-secondary" id="btnMisListas">Mis listas</button>
        <div id="listasGuardadas" class="listas-guardadas"></div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
        <span class="progress-text" id="progressText"></span>
        <span class="dificultad" id="level"></span>
      </div>
      <div class="card centered stack">
        <h3 id="listaTitulo" class="lista-titulo"></h3>
        <div id="secuencia" class="secuencia-row"></div>
        <div id="disponibles" class="disponibles-row"></div>
        <div class="crear-controles">
          <button type="button" class="btn btn-secondary" id="btnSubirItemCrear">Subir</button>
          <button type="button" class="btn btn-secondary" id="btnBajarItemCrear">Bajar</button>
        </div>
        <p id="feedbackCrear" class="feedback"></p>
      </div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <button type="button" class="btn hidden" id="btnNext">Siguiente &#8594;</button>''',
    },

    'shop': {
        'title': 'Tienda | Routime',
        'game_content': '''
      <!-- Quiz mode -->
      <div class="quiz-screen">
        <div class="card centered stack">
          <p id="enunciadoQuiz" class="prompt"></p>
        </div>
        <div class="options stack" id="optionsQuiz"></div>
        <div class="feedback" id="feedbackQuiz" aria-live="polite"></div>
        <div class="row explanation hidden" id="explanationQuizWrap">
          <p id="explanationQuiz"></p>
        </div>
        <button type="button" class="btn hidden" id="btnNextQuiz">Siguiente</button>
      </div>
      <!-- Shop mode -->
      <div class="shop-screen">
        <div class="mesa-dinero" id="mesaDinero"></div>
        <p id="enunciadoTienda" class="prompt"></p>
        <div class="mesa-tienda" id="mesaTienda"></div>
        <div class="mostrador" id="mostrador"></div>
        <div class="zona-pago" id="zonaPago"></div>
        <div class="acciones-tienda" id="accionesTienda"></div>
        <div class="feedback" id="feedbackTienda" aria-live="polite"></div>
        <div class="row explanation hidden" id="explanationTiendaWrap">
          <p id="explanationTienda"></p>
        </div>
        <button type="button" class="btn hidden" id="btnContinuarTienda">Continuar</button>
      </div>''',
    },

    'shopping': {
        'title': 'De compras | Routime',
        'game_content': '''
      <!-- Secciones mode -->
      <div class="secciones-screen" id="pantallaJuegoSecciones">
        <div class="progress-bar">
          <div class="progress-fill" id="progressSeccionesFill"></div>
          <span class="progress-text" id="progressSeccionesText"></span>
        </div>
        <div class="card centered stack">
          <span id="itemPictoSecciones" class="picto-grande"></span>
          <span id="itemPalabraSecciones" class="palabra-item"></span>
        </div>
        <div class="boxes-grid" id="cajasSecciones"></div>
        <div class="feedback" id="feedbackSecciones" aria-live="polite"></div>
        <div class="row explanation hidden" id="explanationSeccionesWrap">
          <p id="explanationSecciones"></p>
        </div>
        <button type="button" class="btn hidden" id="btnNextSecciones">Siguiente</button>
      </div>
      <!-- Lista mode -->
      <div class="lista-screen" id="pantallaJuegoLista">
        <div class="progress-bar">
          <div class="progress-fill" id="progressListaFill"></div>
          <span class="progress-text" id="progressListaText"></span>
        </div>
        <div class="card centered stack">
          <span id="itemPictoLista" class="picto-grande"></span>
          <span id="itemPalabraLista" class="palabra-item"></span>
        </div>
        <div class="listas-dia" id="listasDia"></div>
        <div class="feedback" id="feedbackLista" aria-live="polite"></div>
        <div class="row explanation hidden" id="explanationListaWrap">
          <p id="explanationLista"></p>
        </div>
        <button type="button" class="btn hidden" id="btnNextLista">Siguiente</button>
      </div>''',
    },
}

def make_html(activity, game_content, has_start_screen=True, has_end_screen=True, has_intro=False, intro_id=None):
    """Generate a complete HTML file for an activity."""

    intro_section = ''
    if has_intro and intro_id:
        intro_section = '''
      <section id="''' + intro_id + '''" class="oculto pila centrado">
        <p class="instruccion">Presiona Continuar para empezar.</p>
        <button type="button" class="btn" id="btnContinuarIntro">Continuar</button>
      </section>'''

    end_section = ''
    if has_end_screen:
        end_section = '''
      <section id="endScreen" class="oculto centrado pila" aria-live="polite">
        <div class="emoji-grande" aria-hidden="true">&#x1F38A;</div>
        <h2>Ronda completada!</h2>
        <p id="endSummary"></p>
        <p class="transferencia">Sigue praticando para aprender mas.</p>
        <button type="button" class="btn" id="repeatBtn">Jugar otra vez</button>
        <button type="button" class="btn btn-secundario" id="btnMenu">Volver al inicio</button>
        <a href="../../site/index.html" class="btn btn-secundario">Volver al menu</a>
      </section>'''

    title = activity.get('title', 'Routime')
    stars_id = activity.get('stars_id', 'stars')

    html = ('<!DOCTYPE html>\n'
            '<html lang="es">\n'
            '<head>\n'
            '  <meta charset="UTF-8">\n'
            '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
            '  <title>' + title + '</title>\n'
            '  <meta name="theme-color" content="#FAF7F2">\n'
            '  <link rel="stylesheet" href="../../assets/css/tokens.css">\n'
            '  <link rel="stylesheet" href="../../assets/css/base.css">\n'
            '  <link rel="stylesheet" href="../../assets/css/components.css">\n'
            '  <link rel="stylesheet" href="styles.css">\n'
            '</head>\n'
            '<body>\n'
            '  <div class="container">\n'
            '    <header class="tool-header">\n'
            '      <a href="../../site/index.html" class="back-link">&larr; Volver</a>\n'
            '      <h1>Routime</h1>\n'
            '      <span class="stars" id="' + stars_id + '">&starf; 0</span>\n'
            '    </header>\n'
            '\n'
            '    <section id="startScreen" class="oculto pila centrado">\n'
            '      <div class="fila centrado-fila">\n'
            '        <p class="instruccion" data-i18n="instruccion">Pulsa Jugar para empezar.</p>\n'
            '      </div>\n'
            '      <button type="button" class="btn btn-principal" id="btnJugar">\n'
            '        <span data-i18n="btnJugar">Jugar!</span>\n'
            '      </button>\n'
            '    </section>\n'
            + intro_section + '\n'
            '    <section id="gameScreen" class="oculto pila centrado">\n'
            + game_content + '\n'
            '    </section>\n'
            + end_section + '\n'
            '    <footer data-pie-app data-pie-base="../../" data-pie-class="pie-app"></footer>\n'
            '  </div>\n'
            '\n'
            '  <script src="../../assets/js/utils.js"></script>\n'
            '  <script src="../../assets/js/i18n.js"></script>\n'
            '  <script src="../../assets/js/storage.js"></script>\n'
            '  <script src="../../assets/js/feedback.js"></script>\n'
            '  <script src="strings.es.js"></script>\n'
            '  <script src="strings.en.js"></script>\n'
            '  <script src="data.js"></script>\n'
            '  <script src="app.js"></script>\n'
            '  <script>\n'
            "    if ('serviceWorker' in navigator) {\n"
            '      navigator.serviceWorker.register("../../sw.js").catch(function () {});\n'
            '    }\n'
            '  </script>\n'
            '</body>\n'
            '</html>\n')
    return html

def main():
    for name, activity in ACTIVITY_TEMPLATES.items():
        path = os.path.join(BASE, name, 'index.html')
        html = make_html(activity, activity.get('game_content', ''),
                       has_intro=('pantallaIntro' in activity.get('game_content', '')))
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Generated: {path}')

if __name__ == '__main__':
    main()
