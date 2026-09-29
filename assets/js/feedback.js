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
    try {
      var guardado = JSON.parse(localStorage.getItem('miralante:sounds') || 'null');
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

  /**
   * Brief celebration screen (uses .celebration from components.css).
   * Creates the element if it doesn't exist. Hides itself after 2 s.
   * @param {string} mensaje - e.g. '¡Rutina completada!'
   * @param {function} [despues] - callback when it hides
   */
  function celebrate(mensaje, despues) {
    rondasSesion += 1;
    if (rondasSesion % 5 === 0) {
      var rest = window.App.i18n ? window.App.i18n.t('core.rest') : '';
      if (rest) mensaje = mensaje + ' ' + rest;
    }
    var capa = document.getElementById('app-celebration');
    if (!capa) {
      capa = document.createElement('div');
      capa.id = 'app-celebration';
      capa.className = 'celebration hidden';
      capa.setAttribute('role', 'status');
      capa.innerHTML =
        '<div class="emoji">🎉</div>' +
        '<div class="mensaje"></div>';
      document.body.appendChild(capa);
    }
    capa.querySelector('.mensaje').textContent = mensaje;
    capa.classList.remove('hidden');
    sonidoAcierto();

    var duracion = (window.App.utils && window.App.utils.reducedMotion()) ? 1200 : 2000;
    setTimeout(function () {
      capa.classList.add('hidden');
      if (despues) despues();
    }, duracion);
  }

  function textoEntendido() {
    return window.App.i18n ? App.i18n.t('core.understood') : 'Entendido';
  }

  /* Keep the reading pause in a stable place, before the option group.
     Activities use different wrappers around their options, so find the
     nearest ancestor that shares a parent with the help zone. */
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
   * Locks every not-yet-tried option button after a wrong answer (rule 12:
   * a reading pause, never a punishment). Buttons already disabled from an
   * earlier wrong try in this round are left as-is. Shows/reuses an
   * "Entendido" button inside `zona`, focuses it; clicking it re-enables
   * the buttons this call locked. Retries stay unlimited.
   * @param {Element[]|NodeList} buttons - option buttons of the current round
   * @param {Element} zona - wrap holding the pista/explanation (or consejo) text
   * @param {function} [alConfirmar] - called after the person taps Entendido
   */
  function lockUntilAck(buttons, zona, alConfirmar) {
    var pendientes = Array.prototype.filter.call(buttons || [], function (b) {
      return b && !b.disabled && b.getAttribute('aria-disabled') !== 'true';
    });
    /* `disabled` is enough for native buttons, but some activities use
       custom interactive elements and their click handlers can still run.
       Capture the events as well so no option can be answered while the
       reading pause is waiting for acknowledgement. */
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
    colocarZonaAntesDeOpciones(buttons, zona);
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
      boton.classList.add('hidden');
      zona.classList.add('hidden');
      if (alConfirmar) alConfirmar();
    };
    boton.focus();
  }

  window.App.feedback = {
    success: success,
    encourage: encourage,
    celebrate: celebrate,
    lockUntilAck: lockUntilAck,
    star: sonidoEstrella
  };
})();
