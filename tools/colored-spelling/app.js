/* ============================================================
   Routime — Ortografía en Colores (lenguaje: ortografía)
   Datos en data.js (DATA.es/DATA.en, cada nivel con 6
   oraciones completas).
   Flujo por oración:
     1. Se pinta el pictograma, la pista (1ª letra de cada
        palabra visible) y se lee la oración correcta.
     2. La persona escribe en el input.
     3. Al pulsar Comprobar se comparan carácter a carácter
        contra la oración correcta:
        · verde  → letra escrita igual a la correcta.
        · rosa   → letra escrita que NO coincide con la
                   correcta (equivocación).
        · subrayado (gris) → letra de la oración correcta
                   que la persona no llegó a escribir
                   (letra que falta).
     4. Si todo es verde se celebra (acierto, +1 estrella) y
        se muestra "Siguiente". Si hay errores, se anima a
        corregir (animo) y se muestra la leyenda con el
        significado de cada color; el input queda libre para
        volver a escribir. Una misma oración puede intentarse
        veces sin penalización (SPEC §3.1).
     5. Tras {oraciones del nivel} correctas seguidas (o al
        pulsar Siguiente con todo verde) se pasa a la
        siguiente oración.
   Las MAYÚSCULAS y los espacios del input se normalizan al
   comparar para evitar frustración mecánica.
   Progresión automática: empieza con el nivel fácil y sube
   según el progress guardado, sin mostrar selección de nivel.
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'colored-spelling';
  var $ = App.utils.$;

  var startScreen = $('#startScreen');
  var quizScreen = $('#quizScreen');
  var endScreen = $('#endScreen');
  var starsEl = $('#stars');
  var levelEl = $('#dificultad');

  var sentencePicto = $('#sentencePicto');
  var hintLine = $('#hintLine');
  var inputEl = $('#sentenceInput');
  var feedbackEl = $('#feedback');
  var legendWrap = $('#legendWrap');
  var legendText = $('#legendText');
  var clearBtn = $('#clearBtn');
  var checkBtn = $('#checkBtn');
  var nextBtn = $('#nextBtn');
  var finalSummaryEl = $('#finalSummary');

  /* Persistent progress */
  var progress = App.storage.get(TOOL_ID);
  if (typeof progress.stars !== 'number') progress.stars = 0;
  if (typeof progress.roundsCompleted !== 'number') progress.roundsCompleted = 0;

  function save() { App.storage.set(TOOL_ID, progress); }
  function paintStars() { starsEl.textContent = '⭐ ' + progress.stars; }
  function t(key) { return App.i18n.t(key); }
  function bank() { return DATA[App.i18n.locale()] || DATA.es; }

  function show(screen) {
    [startScreen, quizScreen, endScreen].forEach(function (s) {
      s.classList.toggle('hidden', s !== screen);
    });
  }

  /* ---------- Normalización ---------- */
  function normalize(str) {
    // MAYÚSCULAS. Eliminar tildes comunes para que coincida con
    // lo escrito en pantalla (no mostramos acentos en
    // MAYÚSCULAS porque así se escribe en español estándar; la
    // pista TTS sí los pronuncia). Espacios múltiples a uno.
    var s = String(str).toUpperCase();
    s = s.replace(/[ÁÀÂÄ]/g, 'A')
         .replace(/[ÉÈÊË]/g, 'E')
         .replace(/[ÍÌÎÏ]/g, 'I')
         .replace(/[ÓÒÔÖ]/g, 'O')
         .replace(/[ÚÙÛÜ]/g, 'U')
         .replace(/Ñ/g, 'N')
         .replace(/\s+/g, ' ');
    return s;
  }

  /* La oración que se muestra como pista: primera letra de cada
     palabra visible, manteniendo espacios. Da una guía sin
     reveal la palabra completa. */
  function buildHint(correct) {
    return correct.split(' ').map(function (w) {
      if (!w) return '';
      return w.charAt(0) + '_'.repeat(Math.max(1, w.length - 1));
    }).join(' ');
  }

  /* ---------- Pinta los azulejos de colores tras Comprobar ----------
     Devuelve { allOk: boolean, htmlString }. Cada carácter del
     correct se compara con el carácter del input en la misma
     posición; el resto de estados cubre los huecos. */
  function paintDiff(correct, written) {
    var a = normalize(correct);
    var b = normalize(written);
    var html = '';
    var allOk = true;
    var max = Math.max(a.length, b.length);
    for (var i = 0; i < max; i++) {
      var ca = a.charAt(i) || '';
      var cb = b.charAt(i) || '';
      if (ca === '' && cb === '') continue;
      if (ca === cb && ca !== '') {
        html += '<span class="diff-tile diff-ok">' + escapeHtml(ca) + '</span>';
      } else if (ca !== '' && cb === '') {
        // letra que falta
        html += '<span class="diff-tile diff-missing">' + escapeHtml(ca) + '</span>';
        allOk = false;
      } else if (ca !== '' && cb !== '' && ca !== cb) {
        // letra incorrecta → mostramos lo escrito (lo que la persona puso)
        html += '<span class="diff-tile diff-bad">' + escapeHtml(cb) + '</span>';
        allOk = false;
      } else if (ca === '' && cb !== '') {
        // letra de más
        html += '<span class="diff-tile diff-bad">' + escapeHtml(cb) + '</span>';
        allOk = false;
      }
    }
    return { allOk: allOk, html: html };
  }

  function escapeHtml(ch) {
    return String(ch)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/ /g, '&nbsp;');
  }

  /* ---------- Nivel según progress ---------- */
  function levelBasedOnProgress() {
    var idx = Math.min(progress.roundsCompleted, bank().length - 1);
    return bank()[idx];
  }

  function renderLevel() {
    if (levelEl) {
      var count = currentLevel.sentences.length;
      levelEl.textContent = count + ' ' + (count === 1 ? t('oracion') : t('oraciones'));
    }
  }

  /* ---------- Pantalla inicial ---------- */
  function startGame() {
    currentLevel = levelBasedOnProgress();
    items = App.utils.shuffle(currentLevel.sentences);
    idx = 0;
    show(quizScreen);
    renderLevel();
    render();
  }

  /* ---------- Ronda ---------- */
  var currentLevel = null;
  var items = [];
  var idx = 0;

  function render() {
    var item = items[idx];
    sentencePicto.textContent = item.picto;
    hintLine.innerHTML = '';
    // pinta la pista letra a letra (puede incluir espacios)
    var hint = buildHint(item.correct);
    hint.split('').forEach(function (ch) {
      var span = document.createElement('span');
      span.className = 'hint-char';
      span.textContent = ch;
      hintLine.appendChild(span);
    });

    inputEl.value = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    legendWrap.classList.add('hidden');
    legendText.textContent = '';
    nextBtn.classList.add('hidden');
    checkBtn.classList.remove('hidden');
    clearBtn.classList.remove('hidden');

    paintStars();
    // reenfocar el input para teclado físico/móvil
    setTimeout(function () { inputEl.focus(); }, 50);
  }

  function check() {
    var written = inputEl.value;
    if (normalize(written) === '') {
      // input vacío no es un error, solo una invitación
      feedbackEl.textContent = t('wrongVisual');
      feedbackEl.className = 'feedback animo';
      return;
    }
    var item = items[idx];
    var res = paintDiff(item.correct, written);

    // pinta los azulejos sustituyendo la pista por el diff coloreado
    hintLine.innerHTML = res.html;

    if (res.allOk) {
      feedbackEl.textContent = t('correctFull');
      feedbackEl.className = 'feedback acierto';
      App.feedback.success(feedbackEl);
      progress.stars += 1;
      save();
      paintStars();
      legendWrap.classList.add('hidden');
      checkBtn.classList.add('hidden');
      nextBtn.classList.remove('hidden');
      nextBtn.focus();
    } else {
      feedbackEl.textContent = t('wrongVisual');
      feedbackEl.className = 'feedback animo';
      App.feedback.encourage(feedbackEl);
      legendText.textContent = t('wrongLegendPrefix');
      legendWrap.classList.remove('hidden');
      // permite reintentar sin presión (SPEC §3.1)
      inputEl.value = '';
      inputEl.focus();
    }
  }

  function clearInput() {
    inputEl.value = '';
    inputEl.focus();
    // restaura la pista original tras un intento fallido
    var item = items[idx];
    hintLine.innerHTML = '';
    var hint = buildHint(item.correct);
    hint.split('').forEach(function (ch) {
      var span = document.createElement('span');
      span.className = 'hint-char';
      span.textContent = ch;
      hintLine.appendChild(span);
    });
  }

  function next() {
    idx += 1;
    if (idx >= items.length) {
      finish();
    } else {
      render();
    }
  }

  function finish() {
    progress.roundsCompleted += 1;
    save();
    show(endScreen);
    finalSummaryEl.textContent = t('finalSummary')
      .replace('{total}', progress.stars);
    $('#resumenFinal').textContent = '';
    $('#resumenFinal').textContent += '\n' + App.i18n.t('proximoNivel')
      .replace('{n}', Math.min(progress.roundsCompleted + 1, bank().length));
    $('#transferencia').textContent = '';
    App.feedback.celebrate(App.i18n.t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */
  $('#btnPlay').addEventListener('click', startGame);
  clearBtn.addEventListener('click', clearInput);
  checkBtn.addEventListener('click', check);
  // Enter en el input = Comprobar
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!checkBtn.classList.contains('hidden')) check();
      else if (!nextBtn.classList.contains('hidden')) next();
    }
  });
  nextBtn.addEventListener('click', next);
  $('#btnRepeat').addEventListener('click', startGame);
  $('#btnMenu').addEventListener('click', function () {
    endScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    paintStars();
  });

  function init() {
    App.i18n.apply();
    paintStars();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
