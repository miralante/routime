/* ============================================================
   Routime — Mis Datos (memoria: dirección y teléfono propios
   y de la familia, para saber decirlos si hace falta).
   Los datos reales (dirección, teléfonos) los escribe quien
   gestiona el dispositivo en /settings/ y viven solo en
   App.storage('my-details'); esta pantalla nunca los pide ni los
   modifica, solo los repasa. Si no hay nada configurado se
   muestra un aviso en vez de un test roto (#emptyScreen).
   Flujo lineal en 3 pasos:
   1) Fichas: una tarjeta por dato configurado (dirección propia,
      dirección familiar si es distinta, teléfono propio, cada
      familiar con teléfono).
   2) Test de opciones: 3 botones (motor Socrático estándar:
      pista en el primer fallo, respuesta en el segundo). Los
      señuelos se generan en el momento (nunca se guardan ni se
      envían a ningún sitio) desplazando un número de la dirección
      o cambiando dígitos del teléfono real — ver
      buildAddressDecoys/buildPhoneDecoys. Para "teléfono de
      familia" puede haber más de una opción correcta a la vez
      (hasta 2 de las 3 casillas): cualquier teléfono real
      configurado cuenta como acierto, igual que en la vida real
      hay más de un teléfono válido de la familia.
   3) Test escrito: mismas preguntas, pero tecleadas con el
      teclado físico y comparadas con normalize() (dirección) o
      solo dígitos (teléfono). Si en el segundo intento sigue
      sin acertar, se revela la respuesta y se avanza sin estrella
      (para que nadie se quede atascado, mismo criterio que el
      resto de la app).
   ============================================================ */
(function () {
  'use strict';

  var TOOL_ID = 'my-details';
  var $ = App.utils.$;

  var starsEl = $('#stars');
  var emptyScreen = $('#emptyScreen');
  var cardsScreen = $('#cardsScreen');
  var choiceScreen = $('#choiceScreen');
  var typedScreen = $('#typedScreen');
  var endScreen = $('#endScreen');

  var cardsProgressFill = $('#cardsProgressFill');
  var cardsProgressText = $('#cardsProgressText');
  var cardPicto = $('#cardPicto');
  var cardLabel = $('#cardLabel');
  var cardValue = $('#cardValue');
  var cardListenBtn = $('#cardListenBtn');
  var nextCardBtn = $('#nextCardBtn');

  var choiceProgressFill = $('#choiceProgressFill');
  var choiceProgressText = $('#choiceProgressText');
  var choicePicto = $('#choicePicto');
  var choiceQuestion = $('#choiceQuestion');
  var choiceListenBtn = $('#choiceListenBtn');
  var choiceOptions = $('#choiceOptions');
  var choiceFeedback = $('#choiceFeedback');
  var choiceExplanationWrap = $('#choiceExplanationWrap');
  var choiceExplanation = $('#choiceExplanation');
  var choiceExplanationListenBtn = $('#choiceExplanationListenBtn');
  var choiceNextBtn = $('#choiceNextBtn');

  var typedProgressFill = $('#typedProgressFill');
  var typedProgressText = $('#typedProgressText');
  var typedPicto = $('#typedPicto');
  var typedQuestion = $('#typedQuestion');
  var typedListenBtn = $('#typedListenBtn');
  var typedInput = $('#typedInput');
  var typedCheckBtn = $('#typedCheckBtn');
  var typedFeedback = $('#typedFeedback');
  var typedExplanationWrap = $('#typedExplanationWrap');
  var typedExplanation = $('#typedExplanation');
  var typedExplanationListenBtn = $('#typedExplanationListenBtn');
  var typedNextBtn = $('#typedNextBtn');

  /* Persistent progress. ownAddress/familyAddress/ownPhone/
     familyContacts are written only by settings/app.js; this
     tool only reads them and writes estrellas/completedRounds. */
  var state = App.storage.get(TOOL_ID);
  if (typeof state.estrellas !== 'number') state.estrellas = 0;
  if (typeof state.completedRounds !== 'number') state.completedRounds = 0;
  if (typeof state.ownAddress !== 'string') state.ownAddress = '';
  if (typeof state.familyAddress !== 'string') state.familyAddress = '';
  if (typeof state.ownPhone !== 'string') state.ownPhone = '';
  if (!Array.isArray(state.familyContacts)) state.familyContacts = [];

  function save() { App.storage.set(TOOL_ID, state); }
  function paintStars() { starsEl.textContent = '⭐ ' + state.estrellas; }
  function t(key) { return App.i18n.t(key); }

  function show(screen) {
    [emptyScreen, cardsScreen, choiceScreen, typedScreen, endScreen].forEach(function (s) {
      s.classList.toggle('oculto', s !== screen);
    });
  }

  function pictoFor(id) {
    if (id === 'ownAddress') return '🏠';
    if (id === 'familyAddress') return '👪';
    if (id === 'ownPhone' || id === 'familyPhone') return '📱';
    return '❓';
  }

  /* ---------- Normalización para comparar texto/teléfono ---------- */
  function normalize(str) {
    var s = String(str).toUpperCase();
    s = s.replace(/[ÁÀÂÄ]/g, 'A')
         .replace(/[ÉÈÊË]/g, 'E')
         .replace(/[ÍÌÎÏ]/g, 'I')
         .replace(/[ÓÒÔÖ]/g, 'O')
         .replace(/[ÚÙÛÜ]/g, 'U')
         .replace(/Ñ/g, 'N')
         .replace(/\s+/g, ' ')
         .replace(/^\s+|\s+$/g, '');
    return s;
  }

  function onlyDigits(str) { return String(str).replace(/\D/g, ''); }

  function padZeros(numStr, len) {
    while (numStr.length < len) numStr = '0' + numStr;
    return numStr;
  }

  /* Desplaza el primer número que encuentra en la cadena por
     'delta', manteniendo la misma cantidad de dígitos (para que
     el señuelo tenga la misma pinta que el dato real). Devuelve
     null si no hay ningún número que desplazar. */
  function numberOffsetVariant(str, delta) {
    var matched = false;
    var result = String(str).replace(/\d+/, function (match) {
      matched = true;
      var max = Math.pow(10, match.length);
      var n = ((parseInt(match, 10) + delta) % max + max) % max;
      return padZeros(String(n), match.length);
    });
    return matched ? result : null;
  }

  /* ---------- Señuelos generados en el momento (nunca guardados) ---------- */
  function buildAddressDecoys(real, count, locale) {
    var deltas = [3, -2, 5, -4, 7, -6];
    var decoys = [];
    for (var i = 0; i < deltas.length && decoys.length < count; i++) {
      var candidate = numberOffsetVariant(real, deltas[i]);
      if (candidate && normalize(candidate) !== normalize(real) && decoys.indexOf(candidate) === -1) {
        decoys.push(candidate);
      }
    }
    if (decoys.length < count) {
      var pool = App.utils.shuffle((DATA.decoyStreets[locale] || DATA.decoyStreets.es).slice());
      for (var j = 0; j < pool.length && decoys.length < count; j++) {
        if (normalize(pool[j]) !== normalize(real) && decoys.indexOf(pool[j]) === -1) {
          decoys.push(pool[j]);
        }
      }
    }
    return decoys;
  }

  function buildPhoneDecoys(real, others, count) {
    var digits = onlyDigits(real);
    var otherDigits = others.map(onlyDigits);
    var deltas = [37, -52, 19, -8, 64, -23, 11, -45];
    var decoys = [];
    for (var i = 0; i < deltas.length && decoys.length < count; i++) {
      var candidate = numberOffsetVariant(digits, deltas[i]);
      if (candidate && candidate !== digits && otherDigits.indexOf(candidate) === -1 && decoys.indexOf(candidate) === -1) {
        decoys.push(candidate);
      }
    }
    return decoys;
  }

  /* ---------- Datos configurados: fichas y preguntas ---------- */
  function buildCards() {
    var cards = [];
    if (state.ownAddress) {
      cards.push({ picto: pictoFor('ownAddress'), label: t('card.ownAddress.label'), value: state.ownAddress });
    }
    if (state.familyAddress) {
      cards.push({ picto: pictoFor('familyAddress'), label: t('card.familyAddress.label'), value: state.familyAddress });
    }
    if (state.ownPhone) {
      cards.push({ picto: pictoFor('ownPhone'), label: t('card.ownPhone.label'), value: state.ownPhone });
    }
    state.familyContacts.forEach(function (c) {
      if (c && c.phone) {
        cards.push({ picto: '👤', label: c.label ? c.label : t('card.contact.defaultLabel'), value: c.phone });
      }
    });
    return cards;
  }

  function buildQuizItems() {
    var items = [];
    if (state.ownAddress) {
      items.push({ id: 'ownAddress', kind: 'single', isPhone: false, questionKey: 'q.ownAddress', hintKey: 'hint.ownAddress', answer: state.ownAddress });
    }
    if (state.familyAddress) {
      items.push({ id: 'familyAddress', kind: 'single', isPhone: false, questionKey: 'q.familyAddress', hintKey: 'hint.familyAddress', answer: state.familyAddress });
    }
    if (state.ownPhone) {
      items.push({ id: 'ownPhone', kind: 'single', isPhone: true, questionKey: 'q.ownPhone', hintKey: 'hint.ownPhone', answer: state.ownPhone });
    }
    var contactPhones = state.familyContacts.filter(function (c) { return c && c.phone; }).map(function (c) { return c.phone; });
    if (contactPhones.length) {
      items.push({ id: 'familyPhone', kind: 'multi', isPhone: true, questionKey: 'q.familyPhone', hintKey: 'hint.familyPhone', answers: contactPhones });
    }
    return items;
  }

  /* 3 opciones en total; para 'multi' se muestran hasta 2 teléfonos
     reales a la vez (varias respuestas válidas a la misma
     pregunta, p. ej. el de mamá o el de papá), con el resto de
     señuelos hasta completar 3. */
  function buildChoiceOptions(item, locale) {
    var reals;
    if (item.kind === 'multi') {
      reals = App.utils.shuffle(item.answers.slice()).slice(0, Math.min(2, item.answers.length));
    } else {
      reals = [item.answer];
    }
    var decoyCount = 3 - reals.length;
    var decoys = item.isPhone
      ? buildPhoneDecoys(reals[0], reals, decoyCount)
      : buildAddressDecoys(reals[0], decoyCount, locale);
    var options = reals.map(function (v) { return { texto: v, esCorrecta: true }; })
      .concat(decoys.map(function (v) { return { texto: v, esCorrecta: false }; }));
    return App.utils.shuffle(options);
  }

  /* ---------- Pantalla 1: fichas ---------- */
  var cards = [];
  var cardIdx = 0;

  function paintCardProgress() {
    var total = cards.length;
    cardsProgressFill.style.width = (((cardIdx + 1) / total) * 100) + '%';
    cardsProgressText.textContent = (cardIdx + 1) + ' / ' + total;
  }

  function renderCard() {
    var card = cards[cardIdx];
    cardPicto.textContent = card.picto;
    cardLabel.textContent = card.label;
    cardValue.textContent = card.value;
    paintCardProgress();
    nextCardBtn.textContent = (cardIdx === cards.length - 1) ? t('startTest') : t('core.next');
  }

  function startCards() {
    cards = buildCards();
    cardIdx = 0;
    App.tts.stop();
    show(cardsScreen);
    renderCard();
  }

  /* ---------- Pantalla 2: test de opciones ---------- */
  var choiceItems = [];
  var choiceIdx = 0;
  var choiceCorrectCount = 0;
  var choiceAttempts = 0;
  var choiceResolved = false;
  var currentChoiceOptions = [];

  function startChoice() {
    choiceItems = App.utils.shuffle(buildQuizItems());
    choiceIdx = 0;
    choiceCorrectCount = 0;
    App.tts.stop();
    show(choiceScreen);
    renderChoice();
  }

  function paintChoiceProgress() {
    var total = choiceItems.length;
    choiceProgressFill.style.width = ((choiceIdx / total) * 100) + '%';
    choiceProgressText.textContent = choiceIdx + ' / ' + total;
  }

  function renderChoice() {
    var item = choiceItems[choiceIdx];
    choiceResolved = false;
    choiceAttempts = 0;
    currentChoiceOptions = buildChoiceOptions(item, App.i18n.locale());
    choicePicto.textContent = pictoFor(item.id);
    choiceQuestion.textContent = t(item.questionKey);
    choiceFeedback.textContent = '';
    choiceFeedback.className = 'feedback';
    choiceExplanationWrap.classList.add('oculto');
    choiceExplanation.textContent = '';
    choiceNextBtn.classList.add('oculto');
    choiceOptions.innerHTML = '';

    currentChoiceOptions.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-opcion';
      btn.textContent = op.texto;
      btn.addEventListener('click', function () { answerChoice(btn, op.esCorrecta); });
      choiceOptions.appendChild(btn);
    });

    paintChoiceProgress();
    paintStars();
  }

  function answerChoice(btn, esCorrecta) {
    if (choiceResolved) return;
    if (esCorrecta) {
      choiceExplanation.textContent = t('correctExplanation');
      choiceExplanationWrap.classList.remove('oculto');
      choiceResolved = true;
      btn.classList.add('correcta');
      App.utils.$$('#choiceOptions .btn-opcion').forEach(function (b) { b.disabled = true; });
      App.feedback.success(choiceFeedback);
      state.estrellas += 1;
      choiceCorrectCount += 1;
      save();
      paintStars();
      choiceNextBtn.classList.remove('oculto');
      choiceNextBtn.focus();
    } else {
      choiceAttempts += 1;
      var item = choiceItems[choiceIdx];
      if (choiceAttempts === 1) {
        choiceExplanation.textContent = t(item.hintKey);
        choiceExplanationWrap.classList.remove('oculto');
      } else {
        var correctTexts = currentChoiceOptions.filter(function (o) { return o.esCorrecta; }).map(function (o) { return o.texto; });
        var prefixKey = correctTexts.length > 1 ? 'wrongExplanationPrefixMulti' : 'wrongExplanationPrefix';
        choiceExplanation.textContent = t(prefixKey) + correctTexts.join(t('multiJoin'));
        choiceExplanationWrap.classList.remove('oculto');
      }
      btn.classList.add('animo');
      btn.disabled = true;
      App.feedback.encourage(choiceFeedback);
      App.feedback.lockUntilAck(App.utils.$$('#choiceOptions .btn-opcion'), choiceExplanationWrap);
    }
  }

  function nextChoice() {
    choiceIdx += 1;
    App.tts.stop();
    if (choiceIdx >= choiceItems.length) {
      startTyped();
    } else {
      renderChoice();
    }
  }

  /* ---------- Pantalla 3: test escrito ---------- */
  var typedItems = [];
  var typedIdx = 0;
  var typedCorrectCount = 0;
  var typedAttempts = 0;
  var typedResolved = false;

  function startTyped() {
    typedItems = App.utils.shuffle(buildQuizItems());
    typedIdx = 0;
    typedCorrectCount = 0;
    App.tts.stop();
    show(typedScreen);
    renderTyped();
  }

  function paintTypedProgress() {
    var total = typedItems.length;
    typedProgressFill.style.width = ((typedIdx / total) * 100) + '%';
    typedProgressText.textContent = typedIdx + ' / ' + total;
  }

  function renderTyped() {
    var item = typedItems[typedIdx];
    typedResolved = false;
    typedAttempts = 0;
    typedPicto.textContent = pictoFor(item.id);
    typedQuestion.textContent = t(item.questionKey);
    typedInput.value = '';
    typedInput.disabled = false;
    typedFeedback.textContent = '';
    typedFeedback.className = 'feedback';
    typedExplanationWrap.classList.add('oculto');
    typedExplanation.textContent = '';
    typedNextBtn.classList.add('oculto');
    typedCheckBtn.classList.remove('oculto');

    App.tts.speak(t(item.questionKey));
    paintStars();
    setTimeout(function () { typedInput.focus(); }, 50);
  }

  function matchesItem(item, input) {
    if (item.isPhone) {
      var digits = onlyDigits(input);
      if (!digits) return false;
      var phones = item.kind === 'multi' ? item.answers : [item.answer];
      return phones.some(function (p) { return onlyDigits(p) === digits; });
    }
    var n = normalize(input);
    if (!n) return false;
    var texts = item.kind === 'multi' ? item.answers : [item.answer];
    return texts.some(function (v) { return normalize(v) === n; });
  }

  function checkTyped() {
    if (typedResolved) return;
    var value = typedInput.value;
    if (!value || !value.trim()) return;
    var item = typedItems[typedIdx];
    if (matchesItem(item, value)) {
      typedExplanation.textContent = t('correctExplanation');
      typedExplanationWrap.classList.remove('oculto');
      typedResolved = true;
      typedInput.disabled = true;
      typedCheckBtn.classList.add('oculto');
      App.feedback.success(typedFeedback);
      state.estrellas += 1;
      typedCorrectCount += 1;
      save();
      paintStars();
      typedNextBtn.classList.remove('oculto');
      typedNextBtn.focus();
    } else {
      typedAttempts += 1;
      if (typedAttempts === 1) {
        typedExplanation.textContent = t(item.hintKey);
        typedExplanationWrap.classList.remove('oculto');
        App.feedback.encourage(typedFeedback);
        typedInput.value = '';
        typedInput.focus();
      } else {
        /* Segundo fallo: se revela la respuesta y se avanza sin
           estrella para no dejar a nadie atascado escribiendo un
           dato que no recuerda (mismo criterio que el resto de
           la app: nunca se castiga, pero tampoco se bloquea). */
        var answers = item.kind === 'multi' ? item.answers : [item.answer];
        var prefixKey = answers.length > 1 ? 'wrongExplanationPrefixMulti' : 'wrongExplanationPrefix';
        typedExplanation.textContent = t(prefixKey) + answers.join(t('multiJoin'));
        typedExplanationWrap.classList.remove('oculto');
        App.feedback.encourage(typedFeedback);
        typedResolved = true;
        typedInput.disabled = true;
        typedCheckBtn.classList.add('oculto');
        typedNextBtn.classList.remove('oculto');
        typedNextBtn.focus();
      }
    }
  }

  function nextTyped() {
    typedIdx += 1;
    App.tts.stop();
    if (typedIdx >= typedItems.length) {
      finish();
    } else {
      renderTyped();
    }
  }

  /* ---------- Final ---------- */
  function finish() {
    state.completedRounds += 1;
    save();
    show(endScreen);
    $('#finalSummary').textContent = t('finalSummary')
      .replace('{n}', choiceCorrectCount + typedCorrectCount).replace('{total}', state.estrellas);
    $('#transferencia').textContent = t('transferencia');
    App.feedback.celebrate(t('core.roundComplete'));
  }

  /* ---------- Eventos ---------- */
  nextCardBtn.addEventListener('click', function () {
    App.tts.stop();
    if (cardIdx >= cards.length - 1) {
      startChoice();
    } else {
      cardIdx += 1;
      renderCard();
    }
  });
  cardListenBtn.addEventListener('click', function () {
    var card = cards[cardIdx];
    App.tts.speak(card.label + '. ' + card.value);
  });

  choiceListenBtn.addEventListener('click', function () {
    App.tts.speak(t(choiceItems[choiceIdx].questionKey));
  });
  choiceExplanationListenBtn.addEventListener('click', function () {
    App.tts.speak(choiceExplanation.textContent);
  });
  choiceNextBtn.addEventListener('click', nextChoice);

  typedListenBtn.addEventListener('click', function () {
    App.tts.speak(t(typedItems[typedIdx].questionKey));
  });
  typedExplanationListenBtn.addEventListener('click', function () {
    App.tts.speak(typedExplanation.textContent);
  });
  typedCheckBtn.addEventListener('click', checkTyped);
  typedInput.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      checkTyped();
    }
  });
  typedNextBtn.addEventListener('click', nextTyped);

  $('#replayBtn').addEventListener('click', startCards);

  $('#emptyListenBtn').addEventListener('click', function () {
    App.tts.speak(t('emptyTitle') + '. ' + t('emptyText'));
  });

  function init() {
    App.i18n.apply();
    paintStars();
    if (!state.ownAddress && !state.ownPhone) {
      show(emptyScreen);
      App.tts.speak(t('emptyTitle') + '. ' + t('emptyText'));
      return;
    }artCards();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
