/* ============================================================
   Routime — Vocabulario por tema (lenguaje: palabras complejas
   con significado sencillo, aprendizaje significativo)
   Datos en data.js (DATA.bloques con rondas de 8 palabras). Por
   cada ronda, flujo en 3 pasos:
   1) Selección: bloque (A-D) + tier (1-4) + ronda.
   2) Fichas: una tarjeta por palabra (palabra + significado +
      ejemplo real) + categoría visible para situar el aprendizaje
      (aprendizaje significativo de Ausubel, no memorización suelta).
   3) Test: motor de quiz de 3 opciones. Se ve la palabra y se
      elige su significado entre el correcto y el de otras dos
      palabras del mismo bloque. El error nunca se castiga: pista
      con el ejemplo en el primer fallo, explicación completa en
      el segundo (mismo patrón que tools/dictionary y tools/dichos).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'vocabulary';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var cardsScreen = $('#cardsScreen');
  var quizScreen = $('#quizScreen');
  var endScreen = $('#endScreen');
  var bloquesEl = $('#bloques');
  var tiersEl = $('#tiers');
  var roundsTitle = $('#roundsTitle');
  var roundsEl = $('#rounds');
  var starsEl = $('#stars');
  var finalSummary = $('#finalSummary');

  var cardsProgressFill = $('#cardsProgressFill');
  var cardsProgressText = $('#cardsProgressText');
  var wordDisplay = $('#wordDisplay');
  var definitionText = $('#definitionText');
  var exampleText = $('#exampleText');
  var categoryDisplay = $('#categoryDisplay');
  var tierDisplay = $('#tierDisplay');
  var cardListenBtn = $('#cardListenBtn');
  var nextCardBtn = $('#nextCardBtn');

  var quizProgressFill = $('#quizProgressFill');
  var quizProgressText = $('#quizProgressText');
  var quizWordDisplay = $('#quizWordDisplay');
  var quizListenBtn = $('#quizListenBtn');
  var quizOptions = $('#quizOptions');
  var quizFeedback = $('#quizFeedback');
  var quizExplanationWrap = $('#quizExplanationWrap');
  var quizExplanation = $('#quizExplanation');
  var quizExplanationListenBtn = $('#quizExplanationListenBtn');
  var quizNextBtn = $('#quizNextBtn');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function t(key) { return App.i18n.t(key); }
  function bank() { return DATA; }
  function locale() { return App.i18n.locale() || 'es'; }
  function roundsOf(block) { return block.rounds || block.rondas || []; }

  function show(screen) {
    [startScreen, cardsScreen, quizScreen, endScreen].forEach(function (s) {
      s.classList.toggle('hidden', s !== screen);
    });
  }

  function showScreen(name) {
    var map = {
      start: startScreen, cards: cardsScreen, quiz: quizScreen, end: endScreen
    };
    show(map[name]);
  }

  function nameInLocale(o) {
    return (o && o[locale()]) || (o && o.es) || '';
  }

  /* ---------- Pantalla inicial: bloque + tier + ronda ---------- */

  var selectedBlockId = null;
  var selectedTier = null;

  function tierLabel(tier) {
    var labels = { 1: 'Tier 1', 2: 'Tier 2', 3: 'Tier 3', 4: 'Tier 4' };
    return labels[tier] || ('Tier ' + tier);
  }

  function roundTier(round) {
    if (typeof round.tier === 'number') return round.tier;
    var max = 0;
    round.words.forEach(function (w) { if (w.tier > max) max = w.tier; });
    return max;
  }

  function paintBlocks() {
    bloquesEl.innerHTML = '';
    bank().bloques.forEach(function (bloque) {
      var countRondas = roundsOf(bloque).length;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-block' + (selectedBlockId === bloque.id ? ' selected' : '');
      btn.setAttribute('aria-pressed', selectedBlockId === bloque.id ? 'true' : 'false');
      btn.innerHTML =
        '<span class="bloque-id">' + bloque.id + '</span> ' +
        '<span class="bloque-nombre">' + nameInLocale(bloque.nombre) + '</span>' +
        '<span class="bloque-meta">' + countRondas + ' ' + t('roundsCount') + '</span>';
      btn.addEventListener('click', function () {
        selectedBlockId = bloque.id;
        selectedTier = null;
        paintBlocks();
        paintTiers();
        paintRounds();
      });
      bloquesEl.appendChild(btn);
    });
  }

  function tiersInBloque(bloqueId) {
    var bloque = bank().bloques.filter(function (b) { return b.id === bloqueId; })[0];
    if (!bloque) return [];
    var set = {};
     roundsOf(bloque).forEach(function (r) { set[roundTier(r)] = true; });
    return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
  }

  function paintTiers() {
    tiersEl.innerHTML = '';
    if (!selectedBlockId) return;
    tiersInBloque(selectedBlockId).forEach(function (tier) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-tier' + (selectedTier === tier ? ' selected' : '');
      btn.setAttribute('aria-pressed', selectedTier === tier ? 'true' : 'false');
      btn.textContent = tierLabel(tier);
      btn.addEventListener('click', function () {
        selectedTier = tier;
        paintTiers();
        paintRounds();
      });
      tiersEl.appendChild(btn);
    });
  }

  function roundsFiltered() {
    if (!selectedBlockId) return [];
    var bloque = bank().bloques.filter(function (b) { return b.id === selectedBlockId; })[0];
    if (!bloque) return [];
    if (selectedTier == null) return roundsOf(bloque);
    return roundsOf(bloque).filter(function (r) { return roundTier(r) === selectedTier; });
  }

  function paintRounds() {
    roundsEl.innerHTML = '';
    var rounds = roundsFiltered();
    if (selectedBlockId && rounds.length === 0) {
      var msg = document.createElement('p');
      msg.className = 'instruction';
      msg.textContent = t('noRondasForTier');
      roundsEl.appendChild(msg);
      roundsTitle.classList.add('hidden');
      return;
    }
    if (!selectedBlockId || selectedTier == null) {
      roundsTitle.classList.add('hidden');
      return;
    }
    roundsTitle.classList.remove('hidden');
    rounds.forEach(function (round) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-level';
      var done = progress.completed[round.id] ? ' ' + t('done') : '';
      btn.innerHTML =
        (round.chunkCount > 1
          ? t('part') + ' ' + (round.chunkIndex + 1) + ' / ' + round.chunkCount + ' · '
          : '') +
        round.category +
        ' (' + round.words.length + ' ' + t('wordsCount') + ')' +
        done +
        '<span class="level-info">' + tierLabel(roundTier(round)) + '</span>';
      btn.addEventListener('click', function () { startRound(round); });
      roundsEl.appendChild(btn);
    });
  }

  /* ---------- Ronda: fichas + test ---------- */

  var currentRound = null;
  var poolRound = null;
  var items = [];
  var idx = 0;
  var roundHits = 0;
  var attempts = 0;
  var solved = false;

  function startRound(ronda) {
    currentRound = ronda;
    /* El pool de distractores para el test es el bloque entero
       (todas las palabras del bloque, en el idioma activo). Esto da
       siempre 3 opciones plausibles y "nunca inventadas", como en
       tools/dictionary. */
    var bloque = bank().bloques.filter(function (b) { return b.id === selectedBlockId; })[0];
    var pool = [];
    roundsOf(bloque).forEach(function (r) {
      r.words.forEach(function (w) { pool.push(w); });
    });
    poolRound = pool;
    items = App.utils.shuffle(ronda.words).slice(0, bank().porRonda);
    idx = 0;
    roundHits = 0;
    showScreen('cards');
    renderCard();
  }

  function paintCardProgress() {
    var total = items.length;
    cardsProgressFill.style.width = ((idx / total) * 100) + '%';
    cardsProgressText.textContent = '';
  }

  function renderCard() {
    var w = items[idx];
    solved = false;
    attempts = 0;
    wordDisplay.textContent = w.word;
    definitionText.textContent = w.definition;
    exampleText.textContent = w.example;
    categoryDisplay.textContent = currentRound.category;
    tierDisplay.textContent = tierLabel(w.tier || currentRound.tier || 2);
    quizFeedback.textContent = '';
    quizFeedback.className = 'feedback';
    quizExplanationWrap.classList.add('hidden');
    quizExplanation.textContent = '';
    nextCardBtn.classList.remove('hidden');
    paintCardProgress();
    paintStars();
  }

  function nextCard() {
    idx += 1;
    if (idx >= items.length) {
      startQuiz();
    } else {
      renderCard();
    }
  }

  /* ---------- Test ---------- */

  function paintQuizProgress() {
    var total = items.length;
    quizProgressFill.style.width = ((idx / total) * 100) + '%';
    quizProgressText.textContent = '';
  }

  function distractorsFor(item, n) {
    var others = poolRound.filter(function (w) {
      return w.word.toLowerCase() !== item.word.toLowerCase();
    });
    return App.utils.shuffle(others).slice(0, n);
  }

  function renderQuiz() {
    var item = items[idx];
    solved = false;
    attempts = 0;
    quizWordDisplay.textContent = item.word;
    quizFeedback.textContent = '';
    quizFeedback.className = 'feedback';
    quizExplanationWrap.classList.add('hidden');
    quizExplanation.textContent = '';
    quizNextBtn.classList.add('hidden');
    quizOptions.innerHTML = '';

    var options = App.utils.shuffle(
      [{ word: item.word, definition: item.definition, correct: true }].concat(
        distractorsFor(item, 2).map(function (d) {
          return { word: d.word, definition: d.definition, correct: false };
        })
      )
    );

    options.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.definition;
      btn.addEventListener('click', function () { respond(btn, op, item); });
      quizOptions.appendChild(btn);
    });

    paintQuizProgress();
    paintStars();
  }

  function showExplanation(item, wasCorrect) {
    if (wasCorrect) {
      quizExplanation.textContent = t('correctFull');
    } else {
      quizExplanation.textContent =
        t('wrongExplanationPrefix') + ' ' + item.definition + '.';
    }
    quizExplanationWrap.classList.remove('hidden');
  }

  function showHint(item) {
    quizExplanation.textContent = t('hint') + ' ' + item.example;
    quizExplanationWrap.classList.remove('hidden');
  }

  function respond(btn, op, item) {
    if (solved) return;
    if (op.correct) {
      solved = true;
      btn.classList.add('correcta');
      App.utils.$$('#quizOptions .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(quizFeedback);
      showExplanation(item, true);
      progress.stars += 1;
      roundHits += 1;
      save();
      paintStars();
      quizNextBtn.classList.remove('hidden');
      quizNextBtn.focus();
    } else {
      attempts += 1;
      if (attempts === 1) {
        showHint(item);
      } else {
        showExplanation(item, false);
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(quizFeedback);
      App.feedback.lockUntilAck(App.utils.$$('#quizOptions .btn-opcion'), quizExplanationWrap);
    }
  }

  function nextQuiz() {
    idx += 1;
    if (idx >= items.length) {
      finishRound();
    } else {
      renderQuiz();
    }
  }

  function startQuiz() {
    idx = 0;
    showScreen('quiz');
    renderQuiz();
  }

  function finishRound() {
    progress.completed[currentRound.id] = (progress.completed[currentRound.id] || 0) + 1;
    save();
    showScreen('end');
    finalSummary.textContent = t('finalSummary')
      .replace('{n}', roundHits)
      .replace('{total}', progress.stars);
    $('#transferencia').textContent = '';
    App.feedback.celebrar(t('core.roundComplete'));
  }

  function goStart() {
    showScreen('start');
    selectedBlockId = null;
    selectedTier = null;
    paintBlocks();
    paintTiers();
    paintRounds();
    paintStars();
  }

  /* ---------- Wire events ---------- */

  if (cardListenBtn) cardListenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].word + '. ' + items[idx].definition);
  });
  nextCardBtn.addEventListener('click', nextCard);
  if (quizListenBtn) quizListenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(items[idx].word);
  });
  quizNextBtn.addEventListener('click', nextQuiz);
  if (quizExplanationListenBtn) quizExplanationListenBtn.addEventListener('click', function () {
    if (false && App.tts && App.tts.speak) App.tts.speak(quizExplanation.textContent);
  });
  $('#replayBtn').addEventListener('click', function () {
    if (currentRound) startRound(currentRound);
  });
  $('#otherBlockBtn').addEventListener('click', goStart);
  $('#backLevelsBtnCards').addEventListener('click', goStart);
  $('#backLevelsBtnQuiz').addEventListener('click', goStart);


  /* Inicial */
  paintStars();
  paintBlocks();
  paintTiers();
  paintRounds();
})();
