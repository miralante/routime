/* Routime — ¿Lo publico? */
(function () {
  'use strict';

  var TOOL_ID = 'lo-publico';
  var $ = App.utils.$;
  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var levelEl = $('#level');
  var situacionPictoEl = $('#situacionPicto');
  var situacionTextoEl = $('#situacionTexto');
  var optionsEl = $('#options');
  var feedbackEl = $('#feedback');
  var explanationWrap = $('#explanationWrap');
  var explanationEl = $('#explanation');
  var btnNext = $('#btnNext');
  var progressFill = $('#progressFill');
  var progressText = $('#progressText');
  var starsEl = $('#stars');

  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.completed) progress.completed = {};
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  var currentLevel = null;
  var items = [];
  var idx = 0;
  var roundHits = 0;
  var solved = false;
  var attempts = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function banco() { return DATA[App.i18n.locale()] || DATA.es; }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function levelBasedOnProgress() {
    var levelIndex = Math.min(progress.roundsCompleted, banco().niveles.length - 1);
    return banco().niveles[levelIndex];
  }

  function renderLevel() {
    levelEl.textContent = currentLevel.name + ' · ' + currentLevel.descripcion;
  }

  function renderProgress() {
    var total = items.length || banco().porRonda;
    progressFill.style.width = ((idx / total) * 100) + '%';
    progressText.textContent = (idx + 1) + ' / ' + total;
  }

  function startGame() {
    currentLevel = levelBasedOnProgress();
    items = App.utils.shuffle(currentLevel.items).slice(0, banco().porRonda);
    idx = 0;
    roundHits = 0;
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderLevel();
    render();
  }

  function render() {
    var item = items[idx];
    if (!item) return endRound();
    solved = false;
    attempts = 0;
    situacionPictoEl.textContent = item.picto;
    situacionTextoEl.textContent = item.situacion;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';

    App.utils.shuffle(item.options.map(function (text, i) {
      return { text: text, isCorrect: i === item.correcta };
    })).forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.text;
      btn.addEventListener('click', function () { answer(btn, op.isCorrect, item); });
      optionsEl.appendChild(btn);
    });
    renderProgress();
    renderStars();
  }

  function showExplanation(isCorrect, item) {
    var text = isCorrect
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.';
    explanationEl.textContent = text;
    explanationWrap.classList.remove('hidden');
  }

  function showHint(item) {
    explanationEl.textContent = App.i18n.t('pista') + ' "' + item.situacion + '"';
    explanationWrap.classList.remove('hidden');
  }

  function answer(btn, isCorrect, item) {
    if (solved) return;
    if (isCorrect) {
      showExplanation(true, item);
      solved = true;
      btn.classList.add('correcta');
      Array.prototype.forEach.call(optionsEl.querySelectorAll('.btn-opcion'), function (b) { b.disabled = true; });
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      roundHits += 1;
      if (App.feedback && App.feedback.star) App.feedback.star();
      save();
      renderStars();
      btnNext.classList.remove('hidden');
      btnNext.focus();
      return;
    }

    attempts += 1;
    if (attempts === 1) showHint(item);
    else showExplanation(false, item);
    btn.classList.add('animo');
    btn.disabled = true;
    App.feedback.encourage(feedbackEl);
    App.feedback.lockUntilAck(optionsEl.querySelectorAll('.btn-opcion'), explanationWrap);
  }

  function next() {
    idx += 1;
    if (idx >= items.length) endRound();
    else render();
  }

  function endRound() {
    progress.roundsCompleted += 1;
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#endSummary').textContent = App.i18n.t('roundSummary')
      .replace('{hits}', roundHits).replace('{total}', items.length);
    App.feedback.celebrate(App.i18n.t('roundComplete'));
    renderStars();
  }

  $('#btnPlay').addEventListener('click', startGame);
  btnNext.addEventListener('click', next);
  $('#repeatBtn').addEventListener('click', startGame);
  $('#btnMenu').addEventListener('click', function () {
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  });

  renderStars();
  startScreen.classList.remove('hidden');
})();
