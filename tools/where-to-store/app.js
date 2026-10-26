/* ============================================================
   Routime — ¿Dónde lo guardo? (autonomía: organización del hogar)
   Datos en data.js (DATA.niveles). Módulos compartidos en assets/js/.
   Mecánica: aparece un objeto con picto y hay que tocar la caja
   del sitio de la casa donde se guarda. Ronda de 10 objetos por nivel.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'donde-lo-guardo';
  var $ = App.utils.$;

  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var itemPictoEl = $('#itemPicto');
  var itemPalabraEl = $('#itemPalabra');
  var cajasEl = $('#cajas');
  var feedbackEl = $('#feedback');
  var explicacionWrap = $('#explicacionWrap');
  var explicacionEl = $('#explicacion');
  var btnListen = $('#btnListen');
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
  var roundStart = 0;
  var solved = false;
  var attempts = 0;

  function guardar() { App.storage.set(TOOL_ID, progress); }

  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function banco() { return DATA[App.i18n.locale()] || DATA.es; }

  /* ---- Pantalla inicial ---- */
  /* Determina el nivel según el progress: cada ronda completada,
     sube un nivel. */
  function levelBasedOnProgress() {
    var idxN = Math.min(progress.roundsCompleted, banco().niveles.length - 1);
    return banco().niveles[idxN];
  }

  /* Muestra la dificultad actual (número de cajas / sitios). */
  function renderLevel() {
    if (levelEl) {
      var n = currentLevel.categorias.length;
      levelEl.textContent = n + ' ' + App.i18n.t(n === 1 ? 'sitio' : 'sitios');
    }
  }

  /* Un único recorrido: nivel 1 y nivel 2, cada uno agrupado por sitio. */
  function catalog() {
    var out = [];
    banco().niveles.forEach(function (level) {
      level.items.forEach(function (item) { out.push({ level: level, item: item }); });
    });
    return out;
  }

  /* Cada ronda continúa donde terminó la anterior y da la vuelta al final. */
  function roundEntries(all, start) {
    var out = [];
    for (var i = 0; i < banco().porRonda; i++) {
      out.push(all[(start + i) % all.length]);
    }
    return out;
  }

  function startGame() {
    var all = catalog();
    roundStart = (progress.position || 0) % all.length;
    items = roundEntries(all, roundStart);
    idx = 0;
    roundHits = 0;
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    render();
  }

  function renderProgress() {
    var porRonda = banco().porRonda;
    progressFill.style.width = ((idx / porRonda) * 100) + '%';
    progressText.textContent = '';
  }

  function render() {
    var entry = items[idx];
    if (!entry) return endRound();
    currentLevel = entry.level;
    var item = entry.item;
    renderLevel();
    solved = false;
    attempts = 0;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explicacionWrap.classList.add('hidden');
    explicacionEl.textContent = '';
    btnNext.classList.add('hidden');

    itemPictoEl.textContent = item.picto;
    itemPalabraEl.textContent = item.palabra;

    cajasEl.innerHTML = '';
    App.utils.shuffle(currentLevel.categorias).forEach(function (categoria) {
      var fila = document.createElement('div');
      fila.className = 'fila-caja';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn caja';
      btn.textContent = categoria;
      btn.addEventListener('click', function () { answer(btn, categoria === item.categoria, item); });

      var btnAudio = document.createElement('button');
      btnAudio.type = 'button';
      btnAudio.className = 'btn btn-audio';
      btnAudio.textContent = '🔊';
      btnAudio.setAttribute('aria-label', App.i18n.t('escucharCategoria').replace('{categoria}', categoria));
      btnAudio.addEventListener('click', function () { if (false && App.tts && App.tts.speak) App.tts.speak(categoria); });

      fila.appendChild(btn);
      fila.appendChild(btnAudio);
      cajasEl.appendChild(fila);
    });

    renderProgress();
    renderStars();
  }

  function showExplanation(isCorrect, item) {
    var texto = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.categoria + '.';
    explicacionEl.textContent = texto;
    explicacionWrap.classList.remove('hidden');
  }

  /* Socratic method: on the first mistake the answer isn't given,
     the person is encouraged to think again. Only on the second
     mistake is the correct place stated (showExplanation). */
  function showHint() {
    explicacionEl.textContent = App.i18n.t('pista');
    explicacionWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect, item) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(isCorrect, item);
      solved = true;
      btn.classList.add('correcta');
      App.utils.$$('.caja', cajasEl).forEach(function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      roundHits += 1;
      guardar();
      renderStars();
      btnNext.classList.remove('hidden');
      btnNext.focus();
    } else {
      attempts += 1;
      var respuestaTrasPista = attempts > 1;
      showHint();
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(feedbackEl);
      App.feedback.lockUntilAck(App.utils.$$('.caja', cajasEl), explicacionWrap, function () { if (respuestaTrasPista) showExplanation(isCorrect, item); });
    }
  }

  function next() {
    idx += 1;
    if (idx >= items.length) {
      endRound();
    } else {
      render();
    }
  }

  function endRound() {
    var total = catalog().length;
    progress.position = (roundStart + items.length) % total;
    progress.roundsCompleted += 1;
    var levelId = items[0].level.id;
    progress.completed[levelId] = (progress.completed[levelId] || 0) + 1;
    guardar();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#endSummary').textContent = App.i18n.t('roundSummary')
      .replace('{hits}', roundHits).replace('{total}', items.length);
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* Lista de solo lectura con todos los objetos, agrupados por nivel y
     por sitio. No cambia el progreso. */
  var lastScreen = gameScreen;
  function renderAll() {
    var cont = $('#allList');
    cont.innerHTML = '';
    banco().niveles.forEach(function (level) {
      var h2 = document.createElement('h2');
      h2.textContent = level.nombre + ' · ' + level.descripcion;
      cont.appendChild(h2);
      level.categorias.forEach(function (categoria) {
        var tareas = level.items.filter(function (it) { return it.categoria === categoria; });
        var h3 = document.createElement('h3');
        h3.textContent = categoria;
        cont.appendChild(h3);
        var ul = document.createElement('ul');
        ul.className = 'lista-objetos';
        tareas.forEach(function (it) {
          var li = document.createElement('li');
          var picto = document.createElement('span');
          picto.className = 'lista-picto';
          picto.setAttribute('aria-hidden', 'true');
          picto.textContent = it.picto;
          li.appendChild(picto);
          li.appendChild(document.createTextNode(it.palabra));
          ul.appendChild(li);
        });
        cont.appendChild(ul);
      });
    });
  }

  function showAll() {
    lastScreen = gameScreen.classList.contains('hidden') ? endScreen : gameScreen;
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    renderAll();
    $('#allScreen').classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  function hideAll() {
    $('#allScreen').classList.add('hidden');
    lastScreen.classList.remove('hidden');
  }

  /* Events */
  btnListen.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].item.palabra);
  });
  btnNext.addEventListener('click', next);
  $('#btnVerTodas').addEventListener('click', showAll);
  $('#btnVerTodasFin').addEventListener('click', showAll);
  $('#btnVolverTodas').addEventListener('click', hideAll);
  $('#btnRepeat').addEventListener('click', function () { startGame(); });
  $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../';
  });

  renderStars();
  // Iniciar directamente la actividad
  startGame();
})();

