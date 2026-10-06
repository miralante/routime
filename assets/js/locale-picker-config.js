/* ==========================================================================
   Routime — Locale picker configuration.
   Must be an external file, not an inline <script>. Every other project in
   the suite externalized this block for the same reason: the CSP in
   `_headers` is `script-src 'self'` with no `unsafe-inline`, so an inline
   block is not executed and window.LocalePickerConfig never arrives. When
   that happens the component falls back to ITS OWN defaults — `js/strings`
   (probed with two HEAD requests on every load, both 404) and the shared
   `apptonomia:locale` key — so the language chosen in the dropdown is not
   the language assets/js/i18n.js reads back.
   Routime's _headers happens to carry no Content-Security-Policy today,
   which is why the inline block appeared to work; it was the only project
   relying on that, and it is one added header away from breaking in
   production only. Load this file BEFORE assets/js/locale-picker.js.
   ========================================================================== */
window.LocalePickerConfig = {
  /* El selector de idioma va DENTRO del cajón del ⚙️, como primera
     fila, y el ⚙️ se queda solo en la cabecera. Antes vivía al lado
     del ⚙️ en la fila de controles y eran dos sitios donde cambiar
     preferencias. Coste: un clic más para llegar al idioma. */
  languageInDrawer: true,
  storageKey: 'routime:locale',
  /* Routime stores site strings under /site/strings.<locale>.js and only
     ships Spanish and English, so discovery is skipped: no HEAD probes,
     and requiredLocales names the two locales actually present. */
  path: null,
  requiredLocales: ['es', 'en'],
  defaultLocale: 'en',
  /* The /config/ route already owns the success/encouragement switch, so
     the shared drawer drops its two sound rows instead of showing a second
     control for the same preference. */
  soundSettings: false
};
