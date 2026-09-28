/* Routime — Situaciones: elegir una respuesta segura. */
(function () {
  'use strict';

  var TOOL_ID = 'situaciones';
  var $ = App.utils.$;
  var startScreen = $('#startScreen');
  var gameScreen = $('#gameScreen');
  var endScreen = $('#endScreen');
  var levelEl = $('#level');
  var situationIcon = $('#situacionPicto');
  var situationText = $('#situacionTexto');
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
  var index = 0;
  var hits = 0;
  var solved = false;
  var attempts = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }
  function renderStars() { starsEl.textContent = '⭐ ' + progress.stars; }

  function levelForProgress() {
    return bank().niveles[Math.min(progress.roundsCompleted, bank().niveles.length - 1)];
  }

  function startGame() {
    currentLevel = levelForProgress();
    items = App.utils.shuffle(currentLevel.items).slice(0, bank().porRonda);
    index = 0;
    hits = 0;
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    levelEl.textContent = currentLevel.name + ' · ' + currentLevel.descripcion;
    render();
  }

  function renderProgress() {
    var total = items.length || bank().porRonda;
    progressFill.style.width = ((index / total) * 100) + '%';
    progressText.textContent = (index + 1) + ' / ' + total;
  }

  function render() {
    var item = items[index];
    if (!item) return endRound();
    solved = false;
    attempts = 0;
    situationIcon.textContent = item.picto;
    situationText.textContent = item.situacion;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    explanationWrap.classList.add('hidden');
    explanationEl.textContent = '';
    btnNext.classList.add('hidden');
    optionsEl.innerHTML = '';

    App.utils.shuffle(item.options.map(function (text, i) {
      return { text: text, correct: i === item.correcta };
    })).forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-opcion';
      button.textContent = option.text;
      button.addEventListener('click', function () { answer(button, option.correct, item); });
      optionsEl.appendChild(button);
    });
    renderProgress();
    renderStars();
  }

  function showExplanation(correct, item) {
    explanationEl.textContent = correct
      ? App.i18n.t('explicacionCorrecta')
      : App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.';
    explanationWrap.classList.remove('hidden');
  }

  function answer(button, correct, item) {
    if (solved) return;
    if (!correct) {
      attempts += 1;
      button.classList.add('animo');
      button.disabled = true;
      App.feedback.encourage(feedbackEl);
      explanationEl.textContent = attempts === 1
        ? App.i18n.t('pista') + ' "' + item.situacion + '"'
        : App.i18n.t('explicacionIncorrectaA') + item.options[item.correcta] + '.';
      explanationWrap.classList.remove('hidden');
      App.feedback.lockUntilAck(optionsEl.querySelectorAll('.btn-opcion'), explanationWrap);
      return;
    }

    solved = true;
    button.classList.add('correcta');
    Array.prototype.forEach.call(optionsEl.querySelectorAll('.btn-opcion'), function (option) { option.disabled = true; });
    App.feedback.success(feedbackEl);
    showExplanation(true, item);
    progress.stars += 1;
    hits += 1;
    if (App.feedback && App.feedback.star) App.feedback.star();
    save();
    renderStars();
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function next() {
    index += 1;
    if (index >= items.length) endRound();
    else render();
  }

  function endRound() {
    progress.roundsCompleted += 1;
    progress.completed[currentLevel.id] = (progress.completed[currentLevel.id] || 0) + 1;
    save();
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#endSummary').textContent = App.i18n.t('roundSummary')
      .replace('{hits}', hits).replace('{total}', items.length);
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
