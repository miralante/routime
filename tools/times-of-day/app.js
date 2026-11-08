/* ============================================================
   Routime — Partes del Día (autonomía: organizar tareas diarias)
   Datos en data.js (DATA.niveles, DATA.momentos). Módulos
   compartidos en assets/js/. Mecánica: aparece una tarea con picto
   y hay que tocar la caja del momento del día al que pertenece
   (Mañana, Tarde, Noche). Cada acierto se añade a la lista visual
   de esa caja, que se va construyendo durante toda la ronda.
   Ronda de 9 tareas por nivel. El error nunca se castiga.
   La ronda la lleva App.activityPlay (assets/js/activity-play.js): esta
   página dibuja las tres columnas, la tarea y comunica cada intento.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;
  var levelEl = $('#level');
  var itemPictoEl = $('#itemPicto');
  var itemTaskEl = $('#itemTarea');
  var listsDayEl = $('#listasDia');
  var currentLevel = null;
  var currentItem = null;
  var playApi = null;
  var listsEl = {}; /* timeOfDay -> <ul> donde se acumulan los aciertos */

  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  /* The level follows the rounds completed: each completed round moves up one level. */
  function levelFor(progress) {
    var levels = bank().niveles;
    return levels[Math.min(progress.roundsCompleted || 0, levels.length - 1)];
  }

  /* Builds the 3 empty columns (header + list) once per round; they fill in with
     each correct answer, without resetting between tasks. */
  function paintColumnsEmpty() {
    listsDayEl.innerHTML = '';
    listsEl = {};
    bank().momentos.forEach(function (timeOfDay) {
      var column = document.createElement('div');
      column.className = 'column-dia';

      var btnBox = document.createElement('button');
      btnBox.type = 'button';
      btnBox.className = 'btn caja';
      btnBox.textContent = timeOfDay;
      btnBox.addEventListener('click', function () { answer(btnBox, timeOfDay); });

      var list = document.createElement('ul');
      list.className = 'tasks-list';

      column.appendChild(btnBox);
      column.appendChild(list);
      listsDayEl.appendChild(column);
      listsEl[timeOfDay] = { lista: list, boton: btnBox };
    });
  }

  function answer(btn, momentoElegido) {
    var item = currentItem;
    var isCorrect = momentoElegido === item.timeOfDay;
    if (isCorrect) addAList(item);
    playApi.attempt(isCorrect, {
      control: btn,
      hint: App.i18n.t('pista'),
      explanation: isCorrect
        ? App.i18n.t('explicacionCorrecta')
        : App.i18n.t('explicacionIncorrectaA') + item.timeOfDay + '.'
    });
  }

  function addAList(item) {
    var destino = listsEl[item.timeOfDay];
    var li = document.createElement('li');
    li.textContent = item.picto + ' ' + item.tarea;
    destino.lista.appendChild(li);
  }

  App.activityPlay({
    toolId: 'partes-del-dia',
    roundsKey: 'roundsCompleted',
    ui: {
      game: '#gameScreen',
      end: '#endScreen',
      feedback: '#feedback',
      explanationWrap: '#explanationWrap',
      explanation: '#explanation',
      btnNext: '#btnNext',
      progressFill: '#progressFill',
      progressText: '#progressText',
      stars: '#stars',
      btnRepeat: '#repeatBtn'
    },
    items: function (progress) {
      if (!progress.completed) progress.completed = {};
      currentLevel = levelFor(progress);
      levelEl.textContent = currentLevel.name;
      paintColumnsEmpty();
      return App.utils.shuffle(currentLevel.items).slice(0, bank().porRonda);
    },
    mount: function (item, play) {
      playApi = play;
      currentItem = item;
      itemPictoEl.textContent = item.picto;
      itemTaskEl.textContent = item.tarea;
      var boxes = App.utils.$$('.btn.caja', listsDayEl);
      boxes.forEach(function (b) {
        b.disabled = false;
        b.classList.remove('animo', 'correcta');
      });
      return boxes;
    },
    onEnd: function (play) {
      play.progress.completed[currentLevel.id] = (play.progress.completed[currentLevel.id] || 0) + 1;
      play.save();
      var transferEl = $('#transferencia');
      if (transferEl) transferEl.textContent = '';
    }
  });

  $('#btnMenu').addEventListener('click', function () {
    window.location.href = '../../';
  });
})();
