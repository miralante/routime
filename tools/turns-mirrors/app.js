/* ============================================================
   Routime — Giros y Espejos (percepción viso-espacial)
   Datos en data.js (DATA.niveles, con tipo giro/espejo/letras).
   Mecánica: se muestra un modelo y 3 opciones (regla 11); hay que
   tocar la opción correcta según el tipo del nivel:
   - giro: el mismo dibujo girado (las otras son dibujos distintos).
   - espejo: el reflejo horizontal (las otras: sin reflejar y
     reflejado en vertical).
   - letras: la letra idéntica entre sus letras espejo (b/d/p/q…).
   Primer fallo → pista socrática (regla 12); segundo fallo → se
   marca la correcta y se explica (regla 11). Ronda de 8.
   Las transformaciones se aplican con CSS (clases t-*) sobre un
   span interior, nunca sobre el botón (no rotar bordes ni foco).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'giros-espejos';
  var $ = App.utils.$;
  var GIROS = ['t-rot90', 't-rot180', 't-rot270'];

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var modeloEl = $('#modeloFigura');
  var questionEl = $('#question');
  var optionsEl = $('#opciones');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');
  var levelEl = $('#dificultad');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  /* Round state */
  var currentLevel = null;
  var items = [];
  var idx = 0;
  var roundHits = 0;
  var solved = false;
  var attempts = 0;
  var botonCorrecto = null;
  var itemActual = null;

  function guardar() { App.storage.set(TOOL_ID, progress); }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  /* Determina el nivel según el progress: cada ronda completada, sube un nivel. */
  function levelBasedOnProgress() {
    var idxN = Math.min(progress.roundsCompleted, banco().niveles.length - 1);
    return banco().niveles[idxN];
  }

  /* Muestra la dificultad actual (etiqueta del nivel). */
  function renderLevel() {
    if (levelEl) {
      levelEl.textContent = currentLevel.nombre;
    }
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    items = App.utils.shuffle(currentLevel.items).slice(0, banco().porRonda);
    idx = 0;
    roundHits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    render();
  }

  function renderProgress() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idx / porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  /* Builds the item's 3 options based on the level's type.
     Each option: { contenido, clase, isCorrect, esLetra } */
  function construirOpciones(item) {
    if (currentLevel.tipo === 'giro') {
      return App.utils.shuffle([
        { contenido: item.picto, clase: App.utils.shuffle(GIROS)[0], isCorrect: true },
        { contenido: item.distractores[0], clase: App.utils.shuffle(GIROS)[0], isCorrect: false },
        { contenido: item.distractores[1], clase: App.utils.shuffle(GIROS)[0], isCorrect: false }
      ]);
    }
    if (currentLevel.tipo === 'espejo') {
      return App.utils.shuffle([
        { contenido: item.picto, clase: 't-espejoH', isCorrect: true },
        { contenido: item.picto, clase: '', isCorrect: false },
        { contenido: item.picto, clase: 't-espejoV', isCorrect: false }
      ]);
    }
    /* letras */
    return App.utils.shuffle(item.opciones.map(function (letra, i) {
      return { contenido: letra, clase: '', isCorrect: i === item.correcta, esLetra: true };
    }));
  }

  function render() {
    var item = items[idx];
    itemActual = item;
    solved = false;
    attempts = 0;
    botonCorrecto = null;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');

    var esLetras = currentLevel.tipo === 'letras';
    modeloEl.textContent = esLetras ? item.modelo : item.picto;
    modeloEl.classList.toggle('letra', esLetras);
    var tipoCap = currentLevel.tipo.charAt(0).toUpperCase() + currentLevel.tipo.slice(1);
    questionEl.textContent = App.i18n.t('pregunta' + tipoCap);

    optionsEl.innerHTML = '';
    construirOpciones(item).forEach(function (op, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opcion-figura';
      btn.setAttribute('aria-label', App.i18n.t('ariaOpcion').replace('{n}', i + 1));
      var span = document.createElement('span');
      span.className = 'figura ' + op.clase + (op.esLetra ? ' letra' : '');
      span.textContent = op.contenido;
      btn.appendChild(span);
      if (op.isCorrect) botonCorrecto = btn;
      btn.addEventListener('click', function () { answer(btn, op.isCorrect); });
      optionsEl.appendChild(btn);
    });

    renderProgress();
    renderStars();
  }

  function claveTipo(prefijo) {
    var tipoCap = currentLevel.tipo.charAt(0).toUpperCase() + currentLevel.tipo.slice(1);
    return prefijo + tipoCap;
  }

  function answer(btn, isCorrect) {
    if (solved) return;
    if (isCorrect) {
      solved = true;
      btn.classList.add('correcta');
      App.utils.$$('#opciones .opcion-figura').forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      explicacionEl.textContent = App.i18n.t(claveTipo('ok'));
      explicacionWrap.classList.remove('hidden');
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      guardar();
      renderStars();
      btnNext.classList.remove('hidden');
      btnNext.focus();
    } else {
      attempts += 1;
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      if (attempts === 1) {
        /* Regla 12: primer fallo → pista, nunca la respuesta */
        explicacionEl.textContent = App.i18n.t(claveTipo('pista'));
      } else {
        /* Segundo fallo → se marca la correcta y se explica */
        var texto = App.i18n.t(claveTipo('mal'));
        if (currentLevel.tipo === 'letras') texto = texto.replace('{letra}', itemActual.opciones[itemActual.correcta]);
        explicacionEl.textContent = texto;
        if (botonCorrecto) botonCorrecto.classList.add('sugerida');
      }
      explicacionWrap.classList.remove('hidden');
      App.feedback.lockUntilAck(App.utils.$$('#opciones .opcion-figura'), explicacionWrap);
    }
  }

  function next() {
    idx += 1;
    if (idx >= banco().porRonda) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    progress.roundsCompleted += 1;
    guardar();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = '';
    $('#resumenFinal').textContent += '\n' + App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompleted + 1, banco().niveles.length));
$('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Events */
  btnNext.addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../site/index.html';
  });
  $('#btnPregunta').addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(questionEl.textContent);
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();

