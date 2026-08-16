/* ============================================================
   Routime — Settings (hidden route)
   View/reset what's saved in localStorage. Two actions:
   - "Reset the person's data": deletes language + name
     (Piano is the only tool with a name).
     Progress in every activity is kept.
   - "Reset the whole app": deletes everything under
     'routime:*' (equivalent to opening the app for the first time).
   Two-step confirmation (same pattern as piano-keys's
   "Delete my progress"): one tap asks to confirm, the second deletes.
   ============================================================ */
(function () {
  'use strict';

  var $ = App.utils.$;

  /* Tools that store a first name (see equipo/index.html
     §Progress and privacy). Keep this list up to date if a
     new tool asks for a name. */
  var TOOLS_WITH_NAME = ['piano-keys'];

  /* 'my-details' stores address/phone fields for the "Mis Datos"
     activity, same personal-data-by-exception status as a first
     name. Keep this in sync if another tool starts asking for
     comparable personal data. */
  var MY_DETAILS_TOOL_ID = 'my-details';
  var MAX_FAMILY_CONTACTS = 4;

  var PREFIX = 'routime:';

  /* --- Backup of my progress (F1): export/import every
     'routime:*' key exactly as it is in localStorage (some are
     JSON, 'locale' is a plain string) — this way there's no need to
     know each tool's internal format. --- */
  function exportProgress() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf(PREFIX) === 0) {
        data[key] = localStorage.getItem(key);
      }
    }
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Routime-progress.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    var f = $('#feedbackExportar');
    f.textContent = App.i18n.t('feedbackExportDone');
    f.className = 'feedback acierto';
  }

  var importFile = null;

  function validateBackup(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    var keys = Object.keys(data);
    if (!keys.length) return false;
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf(PREFIX) !== 0) return false;
      if (typeof data[keys[i]] !== 'string') return false;
    }
    return true;
  }

  function importProgress() {
    var f = $('#feedbackImportar');
    if (!importFile) return;
    try {
      var data = JSON.parse(importFile);
    } catch (e) {
      f.textContent = App.i18n.t('feedbackInvalidFile');
      f.className = 'feedback animo';
      return;
    }
    if (!validateBackup(data)) {
      f.textContent = App.i18n.t('feedbackInvalidBackup');
      f.className = 'feedback animo';
      return;
    }
    for (var key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        try { localStorage.setItem(key, data[key]); } catch (e) { /* ignore */ }
      }
    }
    f.textContent = App.i18n.t('feedbackImportDone');
    f.className = 'feedback acierto';
    renderState();
    renderActivityProgress();
  }

  function renderState() {
    var ids = App.storage.listaToolIds();
    var stars = App.storage.estrellasTotales();
    var languageName = App.i18n.t(App.i18n.locale() === 'en' ? 'languageNameEn' : 'languageNameEs');
    var list = $('#listaEstado');
    list.innerHTML = '';

    var items = [
      App.i18n.t('currentLanguage').replace('{lang}', languageName),
      App.i18n.t('activitiesWithProgress').replace('{n}', ids.length),
      App.i18n.t('totalStars').replace('{n}', stars)
    ];
    items.forEach(function (text) {
      var li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
  }

  /* --- Caregiver mode: read-only progress per activity.
     Each progress cell already exists in the HTML with
     data-tool="<slug>"; this only fills in the text, without
     generating the catalog via JS (same approach as
     equipo/index.html: static rows, a source of truth readable
     without running anything). --- */
  function renderActivityProgress() {
    App.utils.$$('#progreso-actividades [data-tool]').forEach(function (cell) {
      var data = App.storage.get(cell.dataset.tool);
      var stars = typeof data.estrellas === 'number' ? data.estrellas : 0;
      cell.textContent = stars > 0 ? '⭐ ' + stars : App.i18n.t('notStarted');
    });
  }

  /* --- Preferences: font size and sounds.
     Saved together under 'routime:prefs' (a single JSON object,
     not one key per preference) so as not to clutter
     listaToolIds()/estrellasTotales() with more keys to exclude —
     storage.js already excludes the whole 'prefs' key. */
  function renderPreferences() {
    var prefs = App.storage.get('prefs');
    var size = prefs.tamanoLetra || 'normal';
    var sounds = prefs.sonidos !== false ? 'on' : 'off';
    App.utils.$$('#selectorTamano .btn-pref').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.valor === size ? 'true' : 'false');
    });
    App.utils.$$('#selectorSonidos .btn-pref').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.valor === sounds ? 'true' : 'false');
    });
  }

  function savePreference(key, value) {
    var prefs = App.storage.get('prefs');
    prefs[key] = value;
    App.storage.set('prefs', prefs);
    if (key === 'tamanoLetra') {
      var SCALE = { normal: 1, grande: 1.15, muygrande: 1.3 };
      document.documentElement.style.setProperty('--escala-texto', SCALE[value] || 1);
    }
    renderPreferences();
  }

  App.utils.$$('#selectorTamano .btn-pref').forEach(function (b) {
    b.addEventListener('click', function () { savePreference('tamanoLetra', b.dataset.valor); });
  });
  App.utils.$$('#selectorSonidos .btn-pref').forEach(function (b) {
    b.addEventListener('click', function () { savePreference('sonidos', b.dataset.valor === 'on'); });
  });
  renderPreferences();

  /* --- Mis Datos: address/phone config for the "my-details"
     activity. Read-modify-write so estrellas/completedRounds
     (owned by the activity itself) are never touched here. --- */
  function renderMyDetails() {
    var data = App.storage.get(MY_DETAILS_TOOL_ID);
    $('#inputOwnAddress').value = data.ownAddress || '';
    $('#inputFamilyAddress').value = data.familyAddress || '';
    $('#inputOwnPhone').value = data.ownPhone || '';
    var contacts = Array.isArray(data.familyContacts) ? data.familyContacts : [];
    for (var i = 0; i < MAX_FAMILY_CONTACTS; i++) {
      var contact = contacts[i] || {};
      $('#inputContact' + (i + 1) + 'Label').value = contact.label || '';
      $('#inputContact' + (i + 1) + 'Phone').value = contact.phone || '';
    }
  }

  function saveMyDetails() {
    var data = App.storage.get(MY_DETAILS_TOOL_ID);
    data.ownAddress = $('#inputOwnAddress').value.trim();
    data.familyAddress = $('#inputFamilyAddress').value.trim();
    data.ownPhone = $('#inputOwnPhone').value.trim();
    var contacts = [];
    for (var i = 0; i < MAX_FAMILY_CONTACTS; i++) {
      var label = $('#inputContact' + (i + 1) + 'Label').value.trim();
      var phone = $('#inputContact' + (i + 1) + 'Phone').value.trim();
      if (phone) contacts.push({ label: label, phone: phone });
    }
    data.familyContacts = contacts;
    App.storage.set(MY_DETAILS_TOOL_ID, data);
    var f = $('#feedbackMyDetails');
    f.textContent = App.i18n.t('feedbackMyDetailsSaved');
    f.className = 'feedback acierto';
  }

  $('#btnSaveMyDetails').addEventListener('click', saveMyDetails);
  renderMyDetails();

  /* Two-step confirmation on the same button. */
  function confirmTwice(btn, normalKey, confirmKey, onConfirm) {
    var confirming = false;
    var timeoutId = null;
    btn.textContent = App.i18n.t(normalKey);
    btn.addEventListener('click', function () {
      if (!confirming) {
        confirming = true;
        btn.textContent = App.i18n.t(confirmKey);
        timeoutId = setTimeout(function () {
          confirming = false;
          btn.textContent = App.i18n.t(normalKey);
        }, 5000);
        return;
      }
      clearTimeout(timeoutId);
      confirming = false;
      btn.textContent = App.i18n.t(normalKey);
      onConfirm();
    });
  }

  function resetPerson() {
    TOOLS_WITH_NAME.forEach(function (id) {
      var state = App.storage.get(id);
      if (typeof state.nombre === 'string' && state.nombre) {
        state.nombre = '';
        App.storage.set(id, state);
      }
    });
    var myDetails = App.storage.get(MY_DETAILS_TOOL_ID);
    myDetails.ownAddress = '';
    myDetails.familyAddress = '';
    myDetails.ownPhone = '';
    myDetails.familyContacts = [];
    App.storage.set(MY_DETAILS_TOOL_ID, myDetails);
    renderMyDetails();
    var f = $('#feedbackPersona');
    f.textContent = App.i18n.t('feedbackResetPersonDone');
    f.className = 'feedback acierto';
    renderState();
    renderActivityProgress();
    /* Deleting the language preference comes last: renderState() above
       still needs the locale that is currently loaded on this page to
       resolve text correctly (the new detected/default locale only takes
       effect on the next page load). */
    App.storage.remove('locale');
  }

  function resetApp() {
    App.storage.listaToolIds().forEach(function (id) {
      App.storage.remove(id);
    });
    App.storage.remove('prefs');
    var f = $('#feedbackApp');
    f.textContent = App.i18n.t('feedbackResetAppDone');
    f.className = 'feedback acierto';
    renderState();
    renderActivityProgress();
    App.storage.remove('locale');
  }

  confirmTwice($('#btnResetPersona'), 'btnResetPerson', 'confirmResetPerson', resetPerson);
  confirmTwice($('#btnResetApp'), 'btnResetApp', 'confirmResetApp', resetApp);

  $('#btnExportar').addEventListener('click', exportProgress);

  $('#inputImportar').addEventListener('change', function (ev) {
    var file = ev.target.files && ev.target.files[0];
    var importBtn = $('#btnImportar');
    var f = $('#feedbackImportar');
    importFile = null;
    importBtn.disabled = true;
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      importFile = reader.result;
      importBtn.disabled = false;
      f.textContent = '';
      f.className = 'feedback';
    };
    reader.onerror = function () {
      f.textContent = App.i18n.t('feedbackReadError');
      f.className = 'feedback animo';
    };
    reader.readAsText(file);
  });

  confirmTwice($('#btnImportar'), 'btnImport', 'confirmImport', importProgress);

  renderState();
  renderActivityProgress();
})();
