/* ============================================================
   Routime — House (autonomy: household tasks).

   Two screens, both fully usable independently:

   1. List screen (#listScreen) — the new entry point.
      Two columns side-by-side:
        - "Source" (left):  every available task (built-in from
          DATA + user-added ones), shown as an unordered list
          with picto + name.
        - "Destination" (right): the user's planned order, initially
          empty. The user moves tasks across with a single "→"
          button per row (or "←" to send them back), and reorders
          inside the destination with ▲ / ▼ buttons.
      Tapping the task name (not a control) opens the step
      ordering for that task.

   2. Step-ordering screen (#gameScreen) — kept from the
      original house mechanic: shuffled pictogram buttons, tap
      them in the correct order, success on first try of the
      next slot, encouragement otherwise (no punishment).

   User-added tasks live only in memory (not in localStorage) per
   the user's request. Reset on next page load.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'la-casa';
  var $ = App.utils.$;
  var DATOS = DATA[App.i18n.locale()] || DATA.es;

  /* ---- DOM ---- */
  var listScreen       = $('#listScreen');
  var addScreen        = $('#addScreen');
  var gameScreen       = $('#gameScreen');
  var endScreen        = $('#endScreen');

  var sourceList       = $('#sourceList');
  var destinationList  = $('#destinationList');
  var emptyMessage     = $('#emptyMessage');
  var listFeedback    = $('#listFeedback');

  var btnAdd           = $('#btnAdd');
  var inputName        = $('#addName');
  var iconsGrid        = $('#iconsGrid');
  var templateSteps    = $('#templateSteps');
  var addFeedback     = $('#addFeedback');
  var btnAddSave       = $('#btnAddSave');
  var btnAddCancel     = $('#btnAddCancel');

  var btnBackToList    = $('#btnBackToList');
  var btnRepeat        = $('#btnRepeat');
  var btnBackToMenu    = $('#btnBackToMenu');

  var taskTitleEl      = $('#taskTitle');
  var taskPictoEl      = $('#taskPicto');
  var sequenceEl       = $('#sequence');
  var availableEl      = $('#available');
  var feedbackEl       = $('#feedback');
  var btnNext          = $('#btnNext');
  var progressFill     = $('#progressFill');
  var progressText     = $('#progressText');
  var starsEl          = $('#stars');

  /* ---- Persistent progress (only stars + done flag, per activity contract) ---- */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (!progress.done || typeof progress.done !== 'object' || Array.isArray(progress.done)) {
    progress.done = {};
  }
  function save() { App.storage.set(TOOL_ID, progress); }

  /* ---- Available-task bank: built-in + user-added (session only) ---- */
  /* Built-in tasks come from DATA.<locale>.tareas. They are immutable here. */
  var catalogTasks = DATOS.tasks.slice();

  /* Tasks the user adds during this session. Stored in memory only. */
  var userTasks = [];

  /* Currently ordered list (the destination column). Each item is a
     reference to one of the tasks in catalogTasks or userTasks.
     We store references (not copies) so the same task can be shown
     in both columns without duplicating data. */
  var order = [];

  /* Step-ordering round state */
  var roundTasks = [];
  var roundIdx = 0;
  var roundHits = 0;
  var nextExpected = 0;
  var slots = [];

  /* ---- Helpers ---- */
  function renderStars() {
    starsEl.textContent = '\u2605 ' + progress.stars;
  }

  function taskById(id) {
    for (var i = 0; i < catalogTasks.length; i++) {
      if (catalogTasks[i].id === id) return catalogTasks[i];
    }
    for (var j = 0; j < userTasks.length; j++) {
      if (userTasks[j].id === id) return userTasks[j];
    }
    return null;
  }

  function isInDestination(task) {
    for (var i = 0; i < order.length; i++) {
      if (order[i].id === task.id) return true;
    }
    return false;
  }

  function indexInDestination(task) {
    for (var i = 0; i < order.length; i++) {
      if (order[i].id === task.id) return i;
    }
    return -1;
  }

  /* ============================================================
     LIST SCREEN — render + interactions
     ============================================================ */

  function renderLists() {
    /* Source: every task NOT in 'order', grouped to keep determinism
       but unordered inside. Tapping the row body opens the steps;
       the "→" button sends it to destination. */
    var all = catalogTasks.concat(userTasks);
    sourceList.innerHTML = '';
    var available = [];
    for (var i = 0; i < all.length; i++) {
      if (!isInDestination(all[i])) available.push(all[i]);
    }
    available.forEach(function (t) { sourceList.appendChild(createRow(t, 'source')); });

    /* Destination: the user's planned order, top to bottom. */
    destinationList.innerHTML = '';
    order.forEach(function (t, idx) {
      destinationList.appendChild(createOrderedRow(t, idx));
    });

    emptyMessage.classList.toggle('hidden', order.length > 0);

    listFeedback.textContent = '';
    listFeedback.className = 'feedback';
  }

  function createRow(t, side) {
    var li = document.createElement('li');
    li.className = 'task-row';
    li.dataset.taskId = t.id;

    var picto = document.createElement('span');
    picto.className = 'row-picto';
    picto.setAttribute('aria-hidden', 'true');
    picto.textContent = t.picto || '\u2605';
    li.appendChild(picto);

    var name = document.createElement('button');
    name.type = 'button';
    name.className = 'row-name';
    name.textContent = t.name;
    name.setAttribute('aria-label',
      App.i18n.t('ariaOpenSteps').replace('{name}', t.name));
    name.addEventListener('click', function () { openSteps(t); });
    li.appendChild(name);

    if (side === 'source') {
      var moveBtn = document.createElement('button');
      moveBtn.type = 'button';
      moveBtn.className = 'row-btn move-right';
      moveBtn.textContent = '\u2192';
      moveBtn.setAttribute('aria-label',
        App.i18n.t('ariaMoveRight').replace('{name}', t.name));
      moveBtn.addEventListener('click', function () { moveToOrder(t); });
      li.appendChild(moveBtn);
    }

    return li;
  }

  function createOrderedRow(t, idx) {
    var li = document.createElement('li');
    li.className = 'task-row ordered-row';
    li.dataset.taskId = t.id;

    var number = document.createElement('span');
    number.className = 'row-number';
    number.textContent = (idx + 1) + '.';
    number.setAttribute('aria-hidden', 'true');
    li.appendChild(number);

    var picto = document.createElement('span');
    picto.className = 'row-picto';
    picto.setAttribute('aria-hidden', 'true');
    picto.textContent = t.picto || '\u2605';
    li.appendChild(picto);

    var name = document.createElement('button');
    name.type = 'button';
    name.className = 'row-name';
    name.textContent = t.name;
    name.setAttribute('aria-label',
      App.i18n.t('ariaOpenSteps').replace('{name}', t.name));
    name.addEventListener('click', function () { openSteps(t); });
    li.appendChild(name);

    var controls = document.createElement('span');
    controls.className = 'row-controls';

    var moveUp = document.createElement('button');
    moveUp.type = 'button';
    moveUp.className = 'row-btn btn-up';
    moveUp.textContent = '\u25B2';
    moveUp.disabled = (idx === 0);
    moveUp.setAttribute('aria-label', App.i18n.t('ariaMoveUp'));
    moveUp.addEventListener('click', function () { reorder(idx, idx - 1); });
    controls.appendChild(moveUp);

    var moveDown = document.createElement('button');
    moveDown.type = 'button';
    moveDown.className = 'row-btn btn-down';
    moveDown.textContent = '\u25BC';
    moveDown.disabled = (idx === order.length - 1);
    moveDown.setAttribute('aria-label', App.i18n.t('ariaMoveDown'));
    moveDown.addEventListener('click', function () { reorder(idx, idx + 1); });
    controls.appendChild(moveDown);

    var returnBtn = document.createElement('button');
    returnBtn.type = 'button';
    returnBtn.className = 'row-btn move-left';
    returnBtn.textContent = '\u2190';
    returnBtn.setAttribute('aria-label',
      App.i18n.t('ariaMoveLeft').replace('{name}', t.name));
    returnBtn.addEventListener('click', function () { removeFromOrder(t); });
    controls.appendChild(returnBtn);

    li.appendChild(controls);

    return li;
  }

  function moveToOrder(t) {
    if (isInDestination(t)) return;
    order.push(t);
    App.feedback.success(listFeedback);
    renderLists();
  }

  function removeFromOrder(t) {
    var pos = indexInDestination(t);
    if (pos === -1) return;
    order.splice(pos, 1);
    renderLists();
  }

  function reorder(from, to) {
    if (from < 0 || from >= order.length) return;
    if (to < 0 || to >= order.length) return;
    if (from === to) return;
    var item = order.splice(from, 1)[0];
    order.splice(to, 0, item);
    renderLists();
  }

  /* ============================================================
     ADD-NEW-TASK FORM (session-only tasks)
     ============================================================ */

  var AVAILABLE_ICONS = DATOS.icons || [
    '\ud83c\udfe0', '\ud83d\udecf', '\ud83c\udf7d', '\ud83e\dede', '\ud83e\uddfa', '\ud83e\uded3', '\ud83e\uddf9', '\ud83e\ude7f', '\ud83d\udcee',
    '\ud83c\udf3f', '\ud83c\udf31', '\ud83d\udc36', '\ud83d\udc31', '\ud83d\udc26', '\ud83d\udc20', '\ud83d\udcda', '\ud83c\udf92', '\u270f',
    '\ud83d\uded2', '\ud83d\uded6', '\ud83d\udca1', '\ud83d\uddd1', '\ud83d\udeaa', '\ud83d\udce6', '\ud83e\uddf4', '\ud83e\uded1', '\ud83d\udcf9',
    '\ud83e\ude8a', '\ud83d\udd25', '\u2600\ufe0f', '\ud83c\udf19', '\u23f0', '\ud83d\udcdd', '\u260e\ufe0f', '\ud83d\udc8a', '\ud83e\uddf9'
  ];

  var DEFAULT_ICON = AVAILABLE_ICONS[0];
  var chosenIcon = DEFAULT_ICON;

  /* Default 5 template steps. The user can tap each to cycle. */
  var TEMPLATE_STEPS = DATOS.templateSteps || ['\u0031\u20e3', '\u0032\u20e3', '\u0033\u20e3', '\u0034\u20e3', '\u0035\u20e3'];

  function renderIconSelector() {
    iconsGrid.innerHTML = '';
    AVAILABLE_ICONS.forEach(function (emo) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'icon-option';
      b.textContent = emo;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', emo === chosenIcon ? 'true' : 'false');
      b.setAttribute('aria-label', emo);
      if (emo === chosenIcon) b.classList.add('selected');
      b.addEventListener('click', function () {
        chosenIcon = emo;
        Array.prototype.forEach.call(iconsGrid.children, function (c) {
          c.classList.toggle('selected', c.textContent === emo);
          c.setAttribute('aria-checked', c.textContent === emo ? 'true' : 'false');
        });
      });
      iconsGrid.appendChild(b);
    });
  }

  function renderTemplateSteps() {
    templateSteps.innerHTML = '';
    TEMPLATE_STEPS.forEach(function (p, i) {
      var li = document.createElement('li');
      li.className = 'step-add';

      var num = document.createElement('span');
      num.className = 'step-number';
      num.textContent = (i + 1) + '.';
      num.setAttribute('aria-hidden', 'true');
      li.appendChild(num);

      var picto = document.createElement('button');
      picto.type = 'button';
      picto.className = 'step-picto';
      picto.textContent = p;
      picto.setAttribute('aria-label', App.i18n.t('addStepTap'));
      picto.addEventListener('click', function () {
        /* Cycle to next icon from the available pool — predictable. */
        var idx = AVAILABLE_ICONS.indexOf(p);
        var next = AVAILABLE_ICONS[(idx + 1) % AVAILABLE_ICONS.length];
        p = next;
        picto.textContent = p;
        TEMPLATE_STEPS[i] = p;
      });
      li.appendChild(picto);

      templateSteps.appendChild(li);
    });
  }

  function openAddForm() {
    /* Reset form state every time it opens. */
    chosenIcon = DEFAULT_ICON;
    TEMPLATE_STEPS = (DATOS.templateSteps || ['\u0031\u20e3', '\u0032\u20e3', '\u0033\u20e3', '\u0034\u20e3', '\u0035\u20e3']).slice();
    inputName.value = '';
    addFeedback.textContent = '';
    addFeedback.className = 'feedback';
    renderIconSelector();
    renderTemplateSteps();

    listScreen.classList.add('hidden');
    addScreen.classList.remove('hidden');
    /* Focus the first field for keyboard users. */
    inputName.focus();
  }

  function closeAddForm() {
    addScreen.classList.add('hidden');
    listScreen.classList.remove('hidden');
  }

  function saveNewTask() {
    var name = (inputName.value || '').trim();
    if (name.length < 2) {
      addFeedback.textContent = App.i18n.t('addErrorName');
      addFeedback.className = 'feedback encourage';
      inputName.focus();
      return;
    }
    /* Build a unique id. Session-only, so we just need uniqueness in
       this tab; a timestamp + random suffix is plenty. */
    var id = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    var newTask = {
      id: id,
      name: name,
      picto: chosenIcon,
      steps: TEMPLATE_STEPS.slice(),
      user: true
    };
    userTasks.push(newTask);
    closeAddForm();
    renderLists();
    App.feedback.success(listFeedback);
  }

  /* ============================================================
     STEP-ORDERING SCREEN — kept from the original house activity.
     ============================================================ */

  function openSteps(task) {
    /* Round of step-ordering: a single task is enough; that's what
       the user tapped. We rebuild the round to use this task. */
    roundTasks = [task];
    roundIdx = 0;
    roundHits = 0;
    listScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderRound();
  }

  function backToList() {
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    listScreen.classList.remove('hidden');
    renderLists();
  }

  function renderProgress() {
    progressFill.style.width = ((roundIdx / roundTasks.length) * 100) + '%';
    progressText.textContent = '';
  }

  function renderRound() {
    var task = roundTasks[roundIdx];
    nextExpected = 0;
    slots = new Array(task.steps.length).fill(null);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    btnNext.classList.add('hidden');
    taskTitleEl.textContent = task.name;
    if (taskPictoEl) taskPictoEl.textContent = task.picto || '';

    renderSlots();

    availableEl.innerHTML = '';
    App.utils.shuffle(task.steps.map(function (picto, stepOrder) {
      return { picto: picto, order: stepOrder };
    })).forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn step';
      btn.textContent = p.picto;
      btn.setAttribute('aria-label', App.i18n.t('ariaStep'));
      btn.addEventListener('click', function () { tapStep(p.order, btn); });
      availableEl.appendChild(btn);
    });

    renderProgress();
    renderStars();
  }

  function renderSlots() {
    sequenceEl.innerHTML = '';
    slots.forEach(function (picto) {
      var div = document.createElement('div');
      div.className = 'slot' + (picto ? ' filled' : '');
      div.textContent = picto || '';
      sequenceEl.appendChild(div);
    });
  }

  function tapStep(orderTapped, btn) {
    var task = roundTasks[roundIdx];
    if (orderTapped === nextExpected) {
      slots[orderTapped] = task.steps[orderTapped];
      renderSlots();
      btn.disabled = true;
      btn.classList.add('placed');
      App.feedback.success(feedbackEl);
      nextExpected += 1;
      if (nextExpected >= task.steps.length) {
        completeTask();
      }
    } else {
      App.feedback.encourage(feedbackEl);
    }
  }

  function completeTask() {
    progress.stars += 1;
    if (App.feedback && App.feedback.star) App.feedback.star();
    progress.done[roundTasks[roundIdx].id] = true;
    roundHits += 1;
    save();
    renderStars();
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function next() {
    roundIdx += 1;
    if (roundIdx >= roundTasks.length) {
      endRound();
    } else {
      renderRound();
    }
  }

  function endRound() {
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    $('#resumenFinal').textContent = App.i18n.t('core.roundComplete');
    $('#transferencia').textContent = App.i18n.t('transferencia');
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ============================================================
     Events + boot
     ============================================================ */
  btnAdd.addEventListener('click', openAddForm);
  btnAddSave.addEventListener('click', saveNewTask);
  btnAddCancel.addEventListener('click', closeAddForm);
  btnBackToList.addEventListener('click', backToList);
  btnRepeat.addEventListener('click', function () {
    /* "Play again" from the end screen re-runs the same task. */
    if (roundTasks[roundIdx - 1]) openSteps(roundTasks[roundIdx - 1]);
    else backToList();
  });
  btnBackToMenu.addEventListener('click', backToList);
  btnNext.addEventListener('click', next);

  /* Allow Enter in the task-name field to submit. */
  inputName.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveNewTask();
    }
  });

  renderStars();
  renderLists();
})();
