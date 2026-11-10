/* ==========================================================================
   Routime — Positive reinforcement and encouragement messages
   Exposes window.App.feedback.success(zona) / .encourage(zona) / .celebrate(msg) /
   .lockUntilAck(buttons, zona, alConfirmar)
   Rules 5 and 6 of CLAUDE.md: mistakes are never punished; feedback <= 2 s.
   Messages follow the active language (App.i18n.pick). Requires utils.js and i18n.js.
   ========================================================================== */
(function () {
  'use strict';

  window.App = window.App || {};

  function alAzar(key) {
    if (window.App.i18n) return window.App.i18n.pick(key);
    return '';
  }

  /* Soft sound with Web Audio (no audio files). Fails silently.
     Honors the "Sounds" preference from /config/ (on by default:
     only muted if someone has explicitly turned it off). */
  var audioCtx = null;

  function sonidoCompartidoActivado(tipo) {
    if (window.LocalePickerConfig && window.LocalePickerConfig.soundSettings === false) return null;
    try {
      var guardado = JSON.parse(localStorage.getItem('apptonomia:sounds') || 'null');
      if (guardado && typeof guardado[tipo] === 'boolean') return guardado[tipo];
    } catch (e) { /* ignore */ }
    return null;
  }

  function sonidosActivados(tipo) {
    var compartido = sonidoCompartidoActivado(tipo);
    if (compartido !== null) return compartido;
    if (!window.App.storage) return tipo !== 'error';
    var prefs = App.storage.get('prefs');
    return tipo === 'error' ? prefs.sonidos === true : prefs.sonidos !== false;
  }

  function tono(frecuencia, duracion, tipo, clase) {
    if (!sonidosActivados(clase || 'success')) return;
    try {
      if (!audioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = tipo || 'sine';
      osc.frequency.value = frecuencia;
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracion);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duracion);
    } catch (e) { /* silent */ }
  }

  function sonidoAcierto() {
    tono(523.25, 0.15, 'sine', 'success');          /* C */
    setTimeout(function () { tono(659.25, 0.2, 'sine', 'success'); }, 120); /* E */
  }

  function sonidoAnimo() {
    /* Soft and neutral, never harsh (rule 5) */
    tono(180, 0.12, 'triangle', 'error');
  }

  /** Celebratory arpeggio for earning a star */
  function sonidoEstrella() {
    tono(523.25, 0.12, 'sine', 'success');           /* C5 */
    setTimeout(function () { tono(659.25, 0.12, 'sine', 'success'); }, 100);  /* E5 */
    setTimeout(function () { tono(783.99, 0.25, 'sine', 'success'); }, 200);  /* G5 */
  }

  /**
   * Positive reinforcement in a feedback zone (element with aria-live).
   * @param {Element} [zona] - element to write the message into
   * @returns {string} the message used
   */
  function success(zona) {
    var msg = alAzar('feedback.success');
    if (zona) {
      zona.textContent = '⭐ ' + msg;
      zona.classList.remove('encourage');
      zona.classList.add('success');
    }
    sonidoAcierto();
    return msg;
  }

  /**
   * Encouragement message after a mistake. Never punitive.
   * @param {Element} [zona]
   * @returns {string} the message used
   */
  function encourage(zona) {
    var msg = alAzar('feedback.encourage');
    if (zona) {
      zona.textContent = msg;
      zona.classList.remove('success');
      zona.classList.add('encourage');
    }
    sonidoAnimo();
    return msg;
  }

  /* Rounds completed in this page session (rule 5: never in
     localStorage, never pressure — just a kind phrase every 5 rounds). */
  var rondasSesion = 0;

  /* Keep the reading pause in a stable place, before the option group.
     Activities use different wrappers around their options, so find the
     nearest ancestor that shares a parent with the help zone. */
  /* Failure reinforcement at the end of the round. Shared pattern
     used by every activity that wants to replay, in a mini-round,
     the items the person failed in the normal round.

     Design:
       - start(onReinforce) — the activity calls this when starting
         the normal round. It receives a callback that is invoked
         when the mini-round needs to be launched, with the list of
         payloads of the failed items.
       - add(key, payload?) — the activity calls this when an item
         fails. The key must be stable across renders (the activity
         decides what counts as a "signature": idx+levelId,
         mode+roman, etc.). The optional payload is what the activity
         will need to render the item in the mini-round (question
         object, entry, etc.).
       - consume() — the activity calls this in its next(), right
         before finish(). If there are items, fires onReinforce(pay-
         loads) and returns the list. If not, returns [].
       - clear() — the activity calls this when closing the mini-
         round to reset the state.

     State lives only for the session (not in localStorage): like
     sessionRounds, this is a contextual learning aid, not a long-
     term marker.

     The mini-round itself is rendered by the activity (each has its
     own options structure, feedback and end-screen). The core only
     coordinates "what is reinforced" and "when the reinforcement
     starts and ends". */
  function makeReinforce() {
    var entries = [];
    var seen = new Set();
    var onReinforce = null;

    function start(callback) {
      entries = [];
      seen.clear();
      onReinforce = callback || null;
    }

    function add(key, payload) {
      if (seen.has(key)) return;
      seen.add(key);
      entries.push({ key: key, payload: payload });
    }

    function consume() {
      if (entries.length === 0) return [];
      var list = entries.slice();
      if (onReinforce) onReinforce(list);
      return list;
    }

    function clear() {
      entries = [];
      seen.clear();
    }

    return { start: start, add: add, consume: consume, clear: clear };
  }

  window.App.reinforce = makeReinforce();

  window.App.feedback = {
    success: success,
    encourage: encourage,
    star: sonidoEstrella
  };
  /* Closing celebration hooks (the celebrate block below calls them). */
  function playCelebrationSound() { sonidoAcierto(); }
  function restDue() { rondasSesion += 1; return rondasSesion % 5 === 0; }
  function restDone() {}

  /* suite:answer-round:begin
     Apptonomia answer round. ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/answer-round.js. The block between
     the begin/end markers is copied byte-for-byte into assets/js/feedback.js of
     each app by apptonomia/scripts/sync-answer-round.js. Never edit a copy by hand.

     Rules (the same in every app):
       - Right answer: the chosen answer stays, the other answers are hidden, and
         the app says it is correct (markCorrect + the app's own success message).
       - Wrong answer: the answers are hidden while the socratic hint is shown;
         «Entendido» brings the answers back. The wrong answer stays disabled.
       - Mistakes are never punished and retries are unlimited. */

  /* The label of the acknowledgement button, in the active language. */
  function textoEntendido() {
    return window.App.i18n ? App.i18n.t('core.understood') : 'Entendido';
  }

  /* Keeps the reading pause in a stable place, before the option group.
     Activities wrap their options differently, so find the nearest ancestor
     that shares a parent with the zone and put the zone in front of it. */
  function colocarZonaAntesDeOpciones(buttons, zona) {
    var primero = buttons && buttons.length ? buttons[0] : null;
    if (!primero || !zona || !zona.parentNode) return;

    var grupoOpciones = primero;
    while (grupoOpciones.parentNode && grupoOpciones.parentNode !== zona.parentNode) {
      grupoOpciones = grupoOpciones.parentNode;
    }
    if (grupoOpciones.parentNode === zona.parentNode) {
      zona.parentNode.insertBefore(zona, grupoOpciones);
    }
  }

  /**
   * Pauses the round after a wrong answer. While the hint shows, the round's
   * answers are hidden. Buttons already disabled from an earlier wrong try in
   * this round stay disabled. Shows/reuses an «Entendido» button inside `zona`
   * and focuses it; tapping it shows the answers again, hides the hint and
   * re-enables the buttons this call locked.
   * @param {Element|Element[]|NodeList} buttons - answers of the current round
   * @param {Element} zona - wrap holding the hint (or explanation) text
   * @param {function} [alConfirmar] - called after the person taps «Entendido»
   */
  function lockUntilAck(buttons, zona, alConfirmar) {
    var opciones = buttons && typeof buttons.length === 'number' ? buttons : (buttons ? [buttons] : []);
    var pendientes = Array.prototype.filter.call(opciones, function (b) {
      return b && !b.disabled && b.getAttribute('aria-disabled') !== 'true';
    });
    /* `disabled` is enough for native buttons, but some activities use custom
       interactive elements whose click handlers can still run. Capture the
       events as well so no answer can be picked while the pause waits. */
    function bloquearEvento(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    pendientes.forEach(function (b) {
      b.disabled = true;
      b.setAttribute('aria-disabled', 'true');
      b.classList.add('bloqueada');
      b.addEventListener('click', bloquearEvento, true);
      b.addEventListener('keydown', bloquearEvento, true);
    });
    if (!zona) return;
    colocarZonaAntesDeOpciones(opciones, zona);
    /* The answers are hidden while the hint shows, not only disabled. */
    var ocultas = Array.prototype.filter.call(opciones, function (b) {
      return b && !b.classList.contains('hidden');
    });
    ocultas.forEach(function (b) { b.classList.add('hidden'); });
    var boton = zona.querySelector('.btn-entendido');
    if (!boton) {
      boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'btn btn-entendido';
      zona.appendChild(boton);
    }
    boton.textContent = textoEntendido();
    boton.classList.remove('hidden');
    boton.onclick = function () {
      pendientes.forEach(function (b) {
        b.removeEventListener('click', bloquearEvento, true);
        b.removeEventListener('keydown', bloquearEvento, true);
        b.disabled = false;
        b.removeAttribute('aria-disabled');
        b.classList.remove('bloqueada');
      });
      ocultas.forEach(function (b) { b.classList.remove('hidden'); });
      boton.classList.add('hidden');
      zona.classList.add('hidden');
      if (alConfirmar) alConfirmar();
    };
    boton.focus();
  }

  /**
   * A right answer is final: the chosen answer stays as it is, the other answers
   * are hidden and none of them can be pressed. The caller marks the answer
   * and says it is correct.
   * @param {Element} control - the answer the person chose
   * @param {Element|Element[]|NodeList} buttons - all the answers of the round
   */
  function markCorrect(control, buttons) {
    var opciones = buttons && typeof buttons.length === 'number' ? buttons : (buttons ? [buttons] : []);
    Array.prototype.forEach.call(opciones, function (b) {
      if (!b || b === control) return;
      b.classList.add('hidden');
      b.disabled = true;
      b.setAttribute('aria-disabled', 'true');
    });
    if (control) {
      control.disabled = true;
      control.setAttribute('aria-disabled', 'true');
    }
  }

  window.App.feedback.lockUntilAck = lockUntilAck;
  window.App.feedback.markCorrect = markCorrect;
  /* suite:answer-round:end */

  /* suite:reward-screen:begin
     Apptonomia closing screen of an activity. ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/reward-screen.js. The block between
     the begin/end markers is copied byte for byte into assets/js/feedback.js of each
     app by apptonomia/scripts/sync-answer-round.js. Never edit a copy by hand.

     The reward is the stars won, with a short summary. Nothing else is shown here
     (no money, no points, no ranking). */

  /**
   * Writes the closing reward into `container`, replacing what it held.
   * @param {Element} container - element that holds the summary of the round
   * @param {number} stars - stars the person has
   * @param {string} summary - the summary sentence of the round
   */
  function paintReward(container, stars, summary) {
    if (!container) return;
    container.textContent = '';
    var estrellas = document.createElement('span');
    estrellas.className = 'reward-stars';
    estrellas.textContent = '⭐ ' + stars;
    var texto = document.createElement('span');
    texto.className = 'reward-summary';
    texto.textContent = summary || '';
    container.appendChild(estrellas);
    container.appendChild(texto);
  }

  window.App.feedback.paintReward = paintReward;
  /* suite:reward-screen:end */

  /* suite:celebrate:begin
     Apptonomia closing celebration. ONE definition for every suite app.
     Canonical source: apptonomia/scripts/suite/celebrate.js. The block between the
     begin/end markers is copied byte for byte into assets/js/feedback.js of each app
     (and into the new-app template) by apptonomia/scripts/sync-answer-round.js.
     Never edit a copy by hand.

     Each app supplies three small hooks OUTSIDE this block, in the same file:
       playCelebrationSound()  plays the app's success sound
       restDue()               true when this celebration carries the rest reminder
                               (counts the rounds, or the minutes, as the app decides)
       restDone()              resets the rest reminder after it was shown
     The overlay, its text and its timing are the same everywhere. */

  /**
   * Shows the closing overlay with `message` until the reading time has passed,
   * then hides it and calls `after`. The time is fixed by the length of the
   * message, so a long closing message (name, transfer line, progress) can be read.
   * @param {string} message - the closing text
   * @param {function} [after] - called when the overlay hides
   * @returns {number} how long the overlay stays up, in ms
   */
  function celebrate(message, after) {
    if (restDue()) {
      var rest = window.App.i18n ? window.App.i18n.t('core.rest') : '';
      if (rest) message = message + ' ' + rest;
      restDone();
    }
    var layer = document.getElementById('app-celebration');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'app-celebration';
      layer.className = 'celebration hidden';
      layer.setAttribute('role', 'status');
      layer.innerHTML = '<div class="emoji" aria-hidden="true">⭐</div><div class="message"></div>';
      document.body.appendChild(layer);
    }
    layer.querySelector('.message').textContent = message;
    layer.classList.remove('hidden');
    playCelebrationSound();

    var reduced = !!(window.App.utils && window.App.utils.reducedMotion());
    var duration = Math.min(10000, (reduced ? 2500 : 3000) + String(message).length * 60);
    setTimeout(function () {
      layer.classList.add('hidden');
      if (after) after();
    }, duration);
    return duration;
  }

  window.App.feedback.celebrate = celebrate;
  /* suite:celebrate:end */

})();
