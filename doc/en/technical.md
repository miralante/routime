# Technical information

> Documentation for developers who want to understand, maintain or extend Routime.
>
> Repository documentation map:

Product scope, audience and product rules live in [`SPEC.md`](SPEC.md). This
document is the canonical source for technical and implementation decisions.

| Document | What it contains | When to read it |
|---|---|---|
| `CLAUDE.md` | Operational workflow and coordination for AI agents | Only when an AI agent performs the change |
| `doc/<en\|es>/technical.md` (this) | Architecture, core APIs, contracts and development recipes | When developing or modifying modules |
| Project history | Lives in Git (`git log`); no external roadmap is maintained. |
| `README.md` | Brief intro, how to run and deploy | First contact with the repo |
| `team/index.html` | Guide for families/professionals (hidden route, see §8) | When adding activities: keep it up to date |
| `agent.md` | Compatibility pointer to `CLAUDE.md` | Don't use as source |

Each subject has one canonical source: product in `SPEC.md`, technical matters
in this document, i18n in `I18N.md`. The closed project roadmap lives in
`git log`. `CLAUDE.md` only defines the workflow for AI agents and does not
redefine these rules.

---

## 1. Product and constraints

Web application for occupational therapy for people with intellectual disability,
usable **autonomously** (without a professional next to them). Interface in Spain's
Spanish, in Easy Reading format.

### Non-negotiable technical constraints

- **HTML5 + CSS3 + Vanilla JavaScript.** No frameworks, no bundlers, no build step,
  no backend, no npm dependencies at all. There is no `package.json`
  in the repo (the Sinonimia app of the suite established this
  pattern), so Cloudflare Pages does not run `npm install` during the
  build and there is nothing to bundle. Local cross-browser tests
  install `playwright` ad-hoc; CI does not need it.
- **Classic scripts**, not ES modules (compatibility with `file://` and old browsers).
  All shared code is exposed on `window.App.*`.
- **No JS CDNs.** Only external exception: Google Fonts (Atkinson Hyperlegible and Nunito).
- **Persistence only in `localStorage`.** No login, no cookies, no personal data,
  no analytics.
- **Offline-first PWA**: `manifest.json` + `sw.js` (cache-first of the app shell).
- **Code style**: ES5-style JS in tools (`var`, classic functions,
  IIFE with `'use strict'`); variable/function names and identifiers always in
  English whenever a file is touched — code belongs to the technology domain.
  Comments in English too. Exception: the UI text itself (`strings.es.js`,
  `data.js` content such as words or sentences) stays in the language it
  represents. Existing Spanish-named files (identifiers or comments) are
  migrated when touched, not all at once.

### 1.1 Hosting and deployment

The app is served as a static site on **Cloudflare Pages** via the
Git connector (`miralante/Routime` → `Routime` → branch
`master`). Canonical URL: **https://Routime.pages.dev**. Operational
details — dashboard configuration, why there is no `wrangler.toml` or
`_redirects`, naming requirements, rollback, custom domain setup, and
the SW note — live in [`CLOUDFLARE.md`](../../CLOUDFLARE.md). Five
things suffice here:

- **No build step.** The repo root *is* the build output. No
  `npm install`, no bundler, no transformer.
- **No `_redirects`, no `wrangler.toml`, no `functions/`.** Cloudflare
  Pages already provides implicit `index.html` lookup per directory,
  so each section (`site/`, `tools/<slug>/`, `team/`, `settings/`,
  `about/`, `legal/`) ships its own real `index.html` and Cloudflare
  resolves `/tools/pairs/` to `tools/pairs/index.html` automatically.
- **Cache headers live in `_headers`** at the repo root. Cloudflare
  reads it on every deploy. HTML entry points and `sw.js` are forced
  to `must-revalidate`; fingerprinted JS/CSS/images get a 1-year
  immutable cache. When you change cache policy, edit `_headers`,
  not the dashboard.
- **`manifest.json` and `sw.js` must use relative paths** (start `./`)
  so the app works on any host without changes.
- **One-time setup lives in the dashboard**, not in the repo: project
  name `Routime`, framework preset `None`, build output `.`,
  production branch `master`.

The service worker **never caches or serves redirects.** The `fetch`
handler in `sw.js` only caches responses with `status === 200` and
returns a small inline "Sin conexión" HTML (no `Location` header) as
its offline fallback. This is deliberate: Safari rejects a top-level
navigation served by a SW that carries a redirect ("Response served by
service worker has redirections") and Cloudflare never returns a
redirect for our static files anyway, so caching them would only risk
breaking the offline path.

### 1.2 Cross-browser support — Apple Safari is a first-class target

The intended audience uses **iPhones and iPads** as their primary device.
This means **Safari (WebKit) is a first-class target**, not a
best-effort fallback. Every change must be verified on WebKit before
landing, not just on Chromium.

Practical rules that follow from that:

- **Stay on classic scripts and ES5-style code.** No ES modules, no
  `import`/`export`, no top-level `let`/`const`, no arrow functions in
  `tools/`. Everything goes on `window.App.*`. This is also the rule
  that keeps the app working from `file://` for offline use.
- **Use `var`, classic function expressions, and IIFE-with-`'use strict'`.**
- **No modern Web APIs without a feature-check.** Prefer the smallest
  subset that works on the current Safari shipped with the oldest
  iOS version we still support. If you need a newer API, gate it
  with `'apiName' in navigator` (or the equivalent) and provide a
  graceful fallback.
- **Register the service worker from every entry point**, not only
  from `site/index.html`. The root `index.html`, `about/`, `settings/`,
  `team/`, `legal/` and every `tools/<slug>/index.html` must call
  `navigator.serviceWorker.register(...)` with the correct relative
  path. Rationale: if a user lands on a page directly (bookmark, home
  screen icon, external link, refresh) and the SW has not been
  registered in that session, Safari can fail the next navigation
  with the generic "Safari cannot open the page" error.
- **No JavaScript CDNs.** External scripts blocked by Safari's
  cross-origin policies are a frequent source of "works on Chrome,
  broken on Safari" reports. All shared code is committed in
  `assets/js/` and loaded with relative paths.
- **Cross-browser verification is mandatory**. The repo provides
  `scripts/cross-browser.js`, which launches every activity in
  Chromium + Firefox + WebKit, on desktop + iPhone 12 + Pixel 5, in
  ES (and EN with `--lang en`). New activities or any change that
  touches navigation, the service worker, or layout must run
  `node scripts/cross-browser.js <slug>` before the PR is merged.
  CI does not run it (no `playwright` in CI), so the developer is
  the last line of defence for Safari.

---

## 2. Architecture and modular design

The project has **three levels of modularity**:

```
Routime/
├── index.html             # Level 0: redirect to site/index.html
├── site/index.html        # Level 0: landing = activity menu (7 modules)
├── assets/                # Level 1: SHARED CORE
│   ├── css/tokens.css     #   design variables (colors, typography, touch)
│   ├── css/base.css       #   reset, visible focus, prefers-reduced-motion
│   ├── css/components.css #   reusable components (.btn, .card, …)
│   ├── js/utils.js        #   window.App.utils
│   ├── js/i18n.js         #   window.App.i18n
│   ├── js/tts.js          #   window.App.tts
│   ├── js/storage.js      #   window.App.storage
│   ├── js/feedback.js     #   window.App.feedback
│   ├── js/dinero.js       #   window.App.dinero (euro activities)
│   └── img/               #   SVG pictograms and PWA icons; the UI uses system icons and emojis first for simple graphical elements; if more is needed, use free images downloaded locally from CC0/public-domain sources
├── tools/<slug>/          # Level 2: one folder per ACTIVITY (69 current)
│   ├── index.html         #   structure and asset loading
│   ├── app.js             #   logic only
│   ├── data.js            #   data only
│   ├── strings.es.js      #   Spanish text
│   ├── strings.en.js      #   English text
│   └── styles.css         #   specific styles only (< 150 lines)
├── equipo/                # Hidden route: guide for the support team (§8)
├── ajustes/               # Hidden route: view/delete localStorage (§8.2)
├── presentacion/          # Hidden route: public project presentation (§8.3)
├── manifest.json          # PWA
├── sw.js                  # Service worker: cache list + VERSION (§11)
└── _headers               # Cloudflare Pages cache and security headers
```

### 2.1 Level 1 — Shared core (`assets/`)

A change here affects **all** activities. `i18n.js` must load after `utils.js` and
before `tts.js`/`feedback.js`, because both read the active language. After the
core, load **only** `strings.<locale>.js`, followed by `data.js` and `app.js`.
The exact conditional loader is documented in §6.2 and is part of the standard
anatomy in §4.

### 2.2 Level 2 — Therapeutic modules (landing grouping)

Activities are grouped in **7 modules** (therapeutic areas). Each module is just
a `<section class="modulo">` in `site/index.html` with two CSS accent variables —
no code per module:

| Module | Area | Color token | Activities |
|---|---|---|---|
| 🎯 Aiming and hands | Coordination and motor skills | `--mod-coordinacion` (blue) | catch, connect-dots, tracing, coloring, piano-keys, builders |
| 📋 My daily routine | Autonomy and home | `--mod-secuencia` (green) | routines, house, situations, safe-chat, bullying-chat, post-or-not, social-safety, signs, times-of-day, what-first, what-do-i-need, where-to-store, task-list, my-agenda, what-to-wear, street, emergencies, phone-numbers, my-details, shopping, shop, healthy-food |
| 🧠 Memory and attention | Memory and attention | `--mod-memoria` (orange) | pairs, differences, whats-missing, ecos, turns-mirrors, blocks, where-is, path, fit, theatre |
| 💬 Language and comprehension | Language and communication | `--mod-lenguaje` (raspberry) | comedy-club, idioms, double-meaning, categories, sentence, words, vocabulary, dictionary, spelling, colored-spelling, word-search |
| 💜 Emotions | Emotions and relationships | `--mod-emocional` (purple) | emotions, calm, friends, my-body, good-manners, education-norms, self-esteem, resilience, trust-circle |
| 💗 Body and relationships | Affective-sexual education | `--mod-cuerpo` (terracotta) | sexual-health |

> **Multi-area note**: an activity may work on more than one therapeutic
> area (for example, an activity can train coordination as well as
> language and writing). In the landing it appears **once**, under its
> **main module**: the one that best represents its primary goal. The
> therapeutic modules exist for navigation; cross-area work is reflected
> in the description of each activity in `team/index.html`. The global
> catalog is rebuilt from the actual slugs in `tools/` (checked by
> `scripts/check.js`).

Each token has its soft pair: `--mod-<x>` and `--mod-<x>-suave` (backgrounds).
The functional catalog is in [`activities.md`](activities.md), and therapeutic
purpose is in [`team.md`](team.md) and `team/index.html`.

### 2.3 Level 3 — Activities (`tools/<slug>/`)

Each activity is **autonomous and isolated**:

- It doesn't share state with other activities (each reads/writes only its own storage key).
- It doesn't import anything from another `tools/` folder.
- It works if you open its `index.html` directly.
- Strict separation: data in `data.js` (format documented in a header comment),
  logic in `app.js`, one text file per language (`strings.es.js` /
  `strings.en.js`), and own styles in `styles.css` (< 150 lines, using core tokens).

### 2.4 Public landing (`site/`)

`site/` is the **public face** of the project: a static, SEO-friendly landing
page that markets the app and links into it. It is **not** the application
itself — the PWA entry point is the root `index.html`, which redirects to
`site/index.html` for the activity menu.

The folder ships exactly four files (the `calculia/site/` variant may also
include `app.js` if the landing needs its own interactivity):

```
site/
├── index.html        # landing markup, SEO meta, JSON-LD, language selector
├── styles.css        # landing-only styles (anclas, .tarjeta-cta, .pasos)
├── strings.es.js     # Spanish copy, registered via App.i18n.register
└── strings.en.js     # English copy (parity mandatory)
```

**Why it lives next to the app, not inside `assets/`**: the landing needs its
own SEO meta tags (canonical, Open Graph, Twitter Card, JSON-LD) that would
pollute the activity shell. Keeping `site/` separate means each section ships
its own real `index.html` and Cloudflare resolves `/site/` automatically
(see §1.1).

**When you add a new file under `site/`** (for example, a new section,
illustration or copy variation), add it to the `FILES` array in `sw.js` and
bump `VERSION`. Without the bump, users with the PWA installed keep seeing
the old shell. This is the same rule documented in `CLAUDE.md` and applies
to every cached file.

**Suite projects that ship a `site/` landing today** (only these four follow
the canonical pattern; other apps of the suite either host their
activities elsewhere or are the metaproject landing itself — see
`apptonomia.uk`):

| Project | `site/` | `tools/` | Notes |
|---|:---:|:---:|---|
| `routime` | ✅ | ✅ (69) | Canonical reference; landing doubles as the activity menu. |
| `calculia` | ✅ | ✅ (15) | Canonical reference; landing is a didactic catalog. |
| `memofun` | ✅ | ✅ (1) | Flashcards; deck catalogue lives in `decks/concepts/`. |
| `okeymoney` | ✅ | ✅ (8) | Finance app; landing has a CTA to the root `index.html`. |

`apptonomia`, `sinonimia` and `teclatlon` do not ship a `site/` folder: the
first is the metaproject landing (`apptonomia.uk`), the second has no
`tools/<slug>/` catalogue, and the third is a typing app without a per-activity
landing.

---

## 3. Shared core API (reference)

### 3.1 `window.App.utils` (`utils.js`)

| Function | Signature | Description |
|---|---|---|
| `shuffle` | `(array) → array` | Shuffled copy (Fisher-Yates). **Never** `sort(() => Math.random()-0.5)` |
| `$` | `(selector) → Element` | Shortcut for `querySelector` |
| `$$` | `(selector) → Array<Element>` | Shortcut for `querySelectorAll` (returns real Array) |
| `hoy` | `() → 'YYYY-MM-DD'` | Today's local date (for daily routines) |
| `reducedMotion` | `() → boolean` | true if the system requests less animation |

### 3.2 `window.App.tts` (`tts.js`)

| Function | Signature | Description |
|---|---|---|
| `speak` | `(text, [onEnd])` | Reads in the active language (`App.i18n.lang()`: es-ES or en-US) at speed 0.9. Cancels previous reading. If synthesis isn't available, calls `onEnd` anyway |
| `stop` | `()` | Stops reading |
| `disponible` | `boolean` | Whether the browser supports speechSynthesis |

### 3.3 `window.App.i18n` (`i18n.js`)

ES/EN system. Active language: `localStorage['routime:locale']`, or detected
from `navigator.language` if nothing is saved. Changing language reloads the page.
**Complete architecture reference and recipe for adding a new language: `doc/en/I18N.md`.**

| Function | Signature | Description |
|---|---|---|
| `locale` | `() → 'es'\|'en'` | Active language |
| `setLocale` | `(loc)` | Saves the language and reloads the page |
| `lang` | `() → 'es-ES'\|'en-US'` | BCP-47 code for `App.tts.speak` |
| `register` | `(dict, locale)` | Registers one language dictionary from `strings.<locale>.js`. The old `({es:{…}, en:{…}})` signature remains for compatibility |
| `t` | `(key) → string` | Looks up `key` (with dots, e.g. `'core.back'` or `'nivel.c1'`) in the active language; falls back to Spanish; returns the key if not found |
| `pick` | `(key) → string` | Like `t`, but if the value is an array (e.g. `feedback.success`) returns a random element |
| `apply` | `([root])` | Applies `data-i18n` (textContent) and `data-i18n-aria` (aria-label) to all DOM under `root` (default, `document`) |

Common keys already registered in `core.*` (do not redefine them in activity
files): `back`, `backToMenu`, `playAgain`, `next`, `listen`,
`listenInstructions`, `listenText`, `loading`, `roundComplete`, `rest`.

Each `strings.<locale>.js` registers `{ title, instruccion, … }` with its locale,
and `strings.es.js` / `strings.en.js` must keep exactly the same keys.
`scripts/check.js` checks that parity. Brace placeholders (`'{n} times'`) are
substituted in `app.js` with `.replace('{n}', value)`. Translatable data patterns
and rules for numbers and dates are documented in [`doc/en/I18N.md`](I18N.md).

### 3.4 `window.App.storage` (`storage.js`)

Internal key: `routime:<toolId>`. All functions are failure-tolerant
(private mode, full storage): they never throw.

**Legacy-key auto-migration.** Until the rename to `Routime`, the prefix
was `apptonomia:` and existing users accumulated progress under that
prefix. The first time the new code reads a key, a one-shot migration
copies `apptonomia:<id>` → `routime:<id>` (only if the new key is
absent) and removes the legacy one, so existing users keep their
progress without any manual step. The migration is tracked per-id in
an in-memory flag to avoid re-scanning on every call; it is also
fault-tolerant (private mode, quota errors): any failure leaves the
legacy key readable and returns an empty progress object. `remove()`
cleans both prefixes. `listaToolIds()` sweeps both prefixes so
`settings/` reports legacy keys as "saved" until the next `get()` on
each one migrates it.

| Function | Signature | Description |
|---|---|---|
| `get` | `(toolId) → object` | Saved progress, or `{}` if nothing or error. Migrates `apptonomia:<toolId>` → `routime:<toolId>` on first read |
| `set` | `(toolId, data) → boolean` | Saves JSON. `false` if failed |
| `remove` | `(toolId) → boolean` | Deletes the tool's progress under both prefixes |
| `estrellasTotales` | `() → number` | Sums `datos.estrellas` of all `routime:*` keys (used by landing) |
| `listaToolIds` | `() → string[]` | Ids of tools with something saved under either prefix (without `'locale'`/`'prefs'`); used by `settings/` |

**Progress contract**: the saved object should include `estrellas` (number) if the
activity gives stars — that's what the landing sums. The rest of the object is free
per activity. Typical example: `{ estrellas: 3, completado: { nivel1: true }, opciones: {...} }`.

### 3.5 `window.App.feedback` (`feedback.js`)

| Function | Signature | Description |
|---|---|---|
| `acierto` | `([zone]) → string` | Random positive message + soft sound. Writes to `zone` (element with `aria-live="polite"`) and adds `.acierto` class |
| `animo` | `([zone]) → string` | Encouragement message after failure (never punitive) + neutral tone. Class `.animo` |
| `celebrar` | `(message, [after])` | Fullscreen celebration layer ≤ 2s (1.2s with reduced motion); calls `after` when hidden |
| `lockUntilAck` | `(buttons, zone, [onConfirm])` | After a wrong answer, locks the round's not-yet-tried option buttons and shows a "Got it" button (auto-focused) inside `zone` that re-enables them when tapped — a Socratic reading pause (rule 12), never a retry cap |

Sounds: generated with Web Audio (no files), fail silently.

### 3.6 `window.App.dinero` (`dinero.js`)

Shared module for representing and explaining euros in The Purse and The Store.
All amounts are expressed as **integer cents**, never floating-point decimals.
Activities that use it load `dinero.js` after `feedback.js` and before
`strings.<locale>.js`. Visual styles live in `components.css`.

| Member | Description |
|---|---|
| `CATALOGO` | Available denominations from 5 cents to 50 euros |
| `info(cent)` | Returns the type and CSS class for a denomination |
| `etiqueta(cent)` | Short label printed on the item (`2 €`, `50 cts`) |
| `formatear(cent)` | Localized amount (`1,50 €` / `1.50 €`) |
| `hablado(cent)` | Written amount for TTS and explanations |
| `aria(cent)` | Accessible name for a coin or banknote |
| `crearFicha(cent, interactiva)` | Creates a decorative element or button |
| `descomponer(cent)` | Breaks an amount into items, largest first |
| `desglose(piezas)` | Verbally explains a collection of items |
| `pintarFichas(contenedor, piezas)` | Renders decorative items with ARIA |

### 3.7 CSS Components (`components.css`)

Available classes — **don't duplicate them** in local `styles.css`:

- Structure: `.container` (max 900px), `.pila` (column with gap), `.fila`
  (row with wrap), `.centrado`, `.oculto` (display none !important).
- Buttons: `.btn` (primary, ≥ 64px), `.btn-secundario`, `.btn-acierto`, `.btn-audio`
  (🔊 button; state `.hablando` or `aria-pressed="true"`), `.btn-opcion`
  (multiple choice answer; states `.correcta` / `.animo`), `.back-link`.
- Game: `.card`, `.progress-bar` + `.progress-fill` + `.progress-text`, `.stars`,
  `.feedback` (aria-live zone; states `.acierto` / `.animo`), `.celebration`
  (created by feedback.js), `.tool-header`, `.grid-tarjetas`.

**Main tokens** (`tokens.css`): base colors (`--color-fondo/superficie/texto/
texto-suave/borde`), 6 module pairs (`--mod-*` / `--mod-*-suave`), feedback
(`--color-acierto`, `--color-animo` — orange, never aggressive red —, `--color-estrella`),
typography (`--texto-base` 20px, `--texto-pequeno` 17px, `--texto-grande`, `--texto-titulo`),
touch (`--boton-min` 64px, `--espacio` 16px, `--radio`, `--sombra`).

---

## 4. Activity anatomy

Each activity in `tools/<slug>/` follows this pattern:

### 4.1 `index.html`

```html
<!DOCTYPE html>
<html lang="es" data-i18n-title="title">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Routime</title>
    <link rel="stylesheet" href="../../assets/css/tokens.css">
    <link rel="stylesheet" href="../../assets/css/base.css">
    <link rel="stylesheet" href="../../assets/css/components.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <a href="../../site/index.html" class="back-link" data-i18n="core.back">← Back</a>
    <h1 data-i18n="title">Pairs</h1>
    <div id="app"></div>
    <script src="../../assets/js/utils.js"></script>
    <script src="../../assets/js/i18n.js"></script>
    <script src="../../assets/js/tts.js"></script>
    <script src="../../assets/js/storage.js"></script>
    <script src="../../assets/js/feedback.js"></script>
    <script src="strings.es.js"></script>
    <script src="strings.en.js"></script>
    <script src="data.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

### 4.2 `data.js`

```javascript
// Activity data goes here.
// NO logic or UI text here.
// Format: documented in header comment per activity.

var DATA = {
    // Difficulty levels
    niveles: [
        { nombre: 'nivel.nivel1', pares: 3 },
        { nombre: 'nivel.nivel2', pares: 4 },
        { nombre: 'nivel.nivel3', pares: 6 }
    ]
};
```

### 4.3 `strings.es.js` and `strings.en.js`

Each file contains one language, and both keep the same keys:

```javascript
// strings.es.js
(function () {
    'use strict';
    App.i18n.register({
        title: 'Parejas',
        instruction: 'Toca las cartas para encontrar las que son iguales.',
        nivel1: 'Fácil',
        nivel2: 'Medio',
        nivel3: 'Difícil'
    }, 'es');
})();
```

```javascript
// strings.en.js
(function () {
    'use strict';
    App.i18n.register({
        title: 'Pairs',
        instruction: 'Tap the cards to find the matching ones.',
        nivel1: 'Easy',
        nivel2: 'Medium',
        nivel3: 'Hard'
    }, 'en');
})();
```

### 4.4 `app.js`

```javascript
// Activity logic
(function() {
    'use strict';

    // Read saved progress
    var saved = App.storage.get('pairs') || {};

    function init() {
        // Apply translations
        App.i18n.apply();

        // Generate dynamic content
        var instruction = App.i18n.t('instruction');
        // ... rest of the logic
    }

    // Start when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})();
```

### 4.5 `styles.css`

```css
/* Activity-specific styles */
/* Use CSS tokens available in tokens.css */

.actividad {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--espacio);
}
```

---

## 5. Accessibility rules

When creating new activities, follow these **13 mandatory rules**:

1. **Easy Reading**: short sentences, one idea per sentence
2. **Buttons ≥ 64×64 px**, spacing ≥ 16 px
3. **High contrast** (WCAG AA minimum)
4. **Audio only when gamification or the activity design requires it** (e.g. hearing what is typed on the keyboard, listening to a sequence): use the 🔊 button with `App.tts.speak()` only where the activity calls for it. It is not a blanket rule for every important text.
5. **No pressure**: no timers, negative scoring or "game over"
6. **Positive reinforcement** when correct: `App.feedback.acierto()`
7. **Respect `prefers-reduced-motion`**
8. **Complete keyboard navigation**
9. **ARIA** on icon buttons and feedback zones
10. **Maximum 4-6 options** per screen
11. **Quiz-type questions**: maximum 3 options, always with explanation
12. **Socratic method** when failing: hint before giving the answer
13. **Gradual progression**: each level changes only one variable

---

## 6. Internationalization

### 6.1 Multi-file system per language

Texts for each activity/landing live in **separate files per language** (not in a
single monolithic file). This way the client only downloads the active language and
maintenance is independent per language.

```
site/strings.es.js    ← Spanish only (registers in locale 'es')
site/strings.en.js    ← English only (registers in locale 'en')

tools/pairs/strings.es.js    ← Spanish only
tools/pairs/strings.en.js    ← English only
... (same pattern for all 68 activities)
```

Each file follows this pattern:

```js
(function () {
  'use strict';
  App.i18n.register({
    title: '🃏 Pairs',
    instruction: 'Find the two matching cards.',
    // ... rest of keys in this language
  }, 'en');  // or 'es', 'fr', ...
})();
```

`register(dict, locale)` (with second argument) registers texts only in that
locale. The complete API is in `assets/js/i18n.js` (also has a legacy
`register({es:..., en:...})` signature for backward compatibility).

### 6.2 Conditional loading in `index.html`

`assets/js/i18n.js` must load **before** `tts.js`/`feedback.js`, which read the
active language. The texts file is injected synchronously per locale:

```html
<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/i18n.js"></script>
<script src="../../assets/js/tts.js"></script>
<script src="../../assets/js/storage.js"></script>
<script src="../../assets/js/feedback.js"></script>
<script src="strings.es.js"></script>
<script src="strings.en.js"></script>
<script src="data.js"></script>
<script src="app.js"></script>
```

Both locale files load synchronously (no `document.write`), so `App.i18n.register`
runs before `data.js` and `app.js`. **Do not** use `document.write` to inject the
texts file: Chrome and Firefox process `document.write`-injected scripts
asynchronously, so the texts end up loading **after** `data.js`/`app.js`. As a
result, `App.i18n.t()` returns literal keys during the initial render and the
DOM keeps them (header `title`, button labels, section titles, etc.). The old
`document.write` pattern was a regression: the inline script ran, the parser
continued, and `data.js`/`app.js` reached `App.i18n.t()` before the injected
`<script>` had executed.

### 6.3 Common keys (`core.*`, `feedback.*`)

Already defined in `assets/js/i18n.js` (don't redefine in `strings.<locale>.js`):

| Key | ES | EN |
|-----|----|----|
| `core.back` | ← Volver | ← Back |
| `core.backToMenu` | Volver al menú | Back to menu |
| `core.playAgain` | Jugar otra vez | Play again |
| `core.next` | Siguiente → | Next → |
| `core.understood` | Entendido | Got it |
| `core.listen` | 🔊 Escuchar | 🔊 Listen |
| `feedback.success` | [array] | [array] |
| `feedback.encourage` | [array] | [array] |

### 6.4 Adding a new language (steps)

1. Add the code to `SOPORTADOS` in `assets/js/i18n.js`
2. Add core and feedback texts in `i18n.js` §1.2
3. Add a button to the selector in `site/index.html`
4. Create `site/strings.<locale>.js`
5. Create `tools/<slug>/strings.<locale>.js` for each activity (same keys)
6. Bump `VERSION` in `sw.js` and add the new files to `ARCHIVOS`
7. Add `'<locale>'` to `STRING_LOCALES` in `scripts/check.js`
8. Run `node scripts/check.js` (validates key parity)
9. Run `node scripts/smoke.js --lang <locale>` (validates loading in browsers)

Detailed recipe and considerations (numbers, hours, cultural content) in
`doc/en/I18N.md` §5.

---

## 7. Cross-cutting contracts

- **Isolation**: an activity never reads another activity's storage key. The only
  allowed coupling is `estrellasTotales()` from the landing.
- **Error never punishes**: don't subtract stars or progress; failure produces
  `animo()` and can be retried without limit.
- **Reading pause after a mistake**: in every multiple-choice activity, a wrong
  answer must lock the remaining untried options for that round with
  `App.feedback.lockUntilAck()` until the person taps "Got it"; already-tried
  options stay disabled as today. Retries remain unlimited — this is a Socratic
  reading pause (rule 12), never a punishment or a progress block. Documented
  exception: `safe-chat` and `bullying-chat` apply the lock but don't yet have a
  two-stage hint/explanation (only a single warning) — a content gap, not a gap
  in this contract.
- **No visible timers**: measuring times internally is allowed (data in storage),
  showing them as pressure isn't.
- **UI texts**: Spain's Spanish and English, Easy Reading in both, no clinical
  language ("patient", "therapy", "disability"). Clinical language is only
  allowed in `team/` and in repo documentation. All text lives in
  `strings.<locale>.js` (never hardcoded in `app.js` nor as sole content of an HTML node
  without `data-i18n`).
- **No labels on the end user**: the person must never read anything in the app
  that labels them as "disabled", "with a disability" or similar. The
  therapeutic goal is trained through everyday-life situations without putting
  that label on the reader. The same applies to a classmate or third party
  mentioned in a situation. Activities may speak about differences and everyday
  supports without using the clinical term (see [`SPEC.md` §3.3](SPEC.md)).
- **Case bank for simulations**: a simulation or training activity must provide
  at least **25 cases** so rounds cannot simply be memorized. Chats may use
  variants of thematic cards, while still respecting §5's maximum visible options.
- **Daily-life simulation contract**: any activity whose therapeutic goal can
  be contextualised must be built as a daily-life simulation (per
  [`SPEC.md` §3.6](SPEC.md) and principle 11): a recognisable scene, a
  decision, immediate consequence with feedback, Socratic help and a
  `transferencia` closing line. Mechanically the activity **must** expose the
  i18n keys `contexto`, `instruccion` (already in the standard anatomy) and
  `transferencia` on the closing screen, and **must** keep the Socratic
  pattern (`mostrarPista()` on first mistake, `mostrarExplicacion()` on
  second). When the therapeutic goal is to train a pure skill (memory, fine
  motor, logic, puzzles, perception) the activity follows the
  **pure-skill vehicle** (per [`SPEC.md` §3.6.b](SPEC.md)): `contexto` and
  `transferencia` are required when they add value, `pista` / `explicacion`
  are required when they add value, `App.feedback.success` and
  `App.feedback.encourage` are **always** required, and the decision is
  documented in `team/index.html` as a **prioritised design decision**, not
  as an exception. The four mechanical patterns the contract recognises
  today are: **scene + decision**, **safe dialogue / chat**, **step-by-step
  routine** (see [`creating-activities-guide.md` §2.3](creating-activities-guide.md)),
  and **pure-skill training** (see §3.6.b).
- **Meaningful-learning anchors contract**: simulation is the preferred vehicle;
  meaningful learning (Ausubel–Novak) is what makes a round — simulated or
  pure-skill — actually stick. In addition to the simulation contract above
  (or to the pure-skill vehicle, see §3.6.b), each activity's content **must**
  honour the four meaningful-learning anchors defined in [`SPEC.md` §3.6](SPEC.md)
  and [`creating-activities-guide.md` §5.8](creating-activities-guide.md):
  **(a)** everyday vocabulary the person already uses at home, never clinical
  or taxonomic terms; **(b)** stimuli drawn from the person's own environment
  (nearby shop, real morning routine, not abstract examples); **(c)** light
  personalisation where appropriate (stable avatar, name field — see
  `tools/piano-keys/`); **(d)** spaced practice via
  `localStorage` (saved level) so the landing can resume the person at the
  level reached, not at a random one. Activities that satisfy the simulation
  contract but skip these anchors are considered "simulation only" and the
  omission is documented in `team/index.html` as a prioritised design
  decision, not as an exception.
- **Persuasive-communication contract**: every activity must communicate well,
  in service of learning, as elevated to a product principle in
  [`SPEC.md` §3.7 and principle 12](SPEC.md). Concretely, each activity **must**
  be didactic (visible goal + modelled example + permanent hint), apply art
  effects with care (slow ≥ 300 ms, single-element, no flashing, respects
  `prefers-reduced-motion`), use a warm micro-narrative and good copy,
  offer one clear CTA per screen, and use gamification in moderation
  (progressive stars added, never subtracted, no leaderboards). The full
  operational details live in [`creating-activities-guide.md` §5 and §6](creating-activities-guide.md).
  Equally important, the activity **must not** ship any of the forbidden
  marketing patterns listed in `SPEC.md §3.7`: scarcity ("only 1 left"),
  false urgency ("hurry", countdowns), social-proof pressure (ranks,
  "others already did it"), sunk-cost / FOMO ("don't lose your streak"),
  manipulative reciprocity / dark patterns (forced signups, pre-checked
  boxes, hidden costs, fake alerts), or exploitative loss aversion
  ("you had 5 ⭐, you lost 2"). Pressure is not a persuasion technique in
  Routime.
---

## 8. Hidden routes

Pages for adults (family/teachers/AI agent) who manage the device, not for the
end user. Common rules to all: **never link them** from `site/index.html` or
from activities (access only by known URL), they carry
`<meta name="robots" content="noindex, nofollow">`, they're the only product
pages where clinical or device-administration language is allowed, and they
follow the same multi-language pattern as the rest of the site
(`strings.es.js` / `strings.en.js`, `data-i18n`, language selector) — checked
by `scripts/check.js` the same way as `tools/`.

### 8.1 `/team/`

Guide for families, therapists and teachers + technical note for AI agents
about the project, design and activity catalog. Keep it up to date, in both
languages, when adding activities or modules.

### 8.2 `/settings/`

View and delete what's saved in this browser's `localStorage`. Two actions,
each with two-step confirmation (one click asks for confirmation, the second
deletes):

- **Reset person data**: `App.storage.remove('locale')` +
  empty the `nombre` field of tools that ask for it (currently
  `piano-keys` — keep this list in
  `config/app.js` if a new tool requires a name).
- **Reset entire application**: deletes all `routime:*` keys
  (`App.storage.listaToolIds()` + `remove('locale')`). Equivalent to a first use.

### 8.3 `/about/`

Public-facing presentation of the project, aimed at journalists, funders, new
contributors and anyone arriving from the repository or the site who wants to
understand what Routime is without opening the source code.

Seven sections: the project's origin, the six non-negotiable principles
(autonomy, no pressure, privacy, Easy Reading, accessibility, sober
technology), how the application is built (static PWA, no backend, single
`localStorage`, MIT, only external assets are the fontother apps of
the suite (Calculia, Okeymoney, Sinonimia, Teclatlon — same team and
philosophy, independent services with an external link to their own
domain), authorship, and five ways to help (testing, proposing,
reviewing, contributing code, spreading the word). The footer links to
the activity menu and to the team guide, but no public link points at
it: it is only reached by typing the URL.

Keep it up to date, in both languages, when modules are added or when the
total activity count changes. Do not add text aimed at the end user here:
that page is not for them.

Keep the other-apps-of-the-suite
Keep the other-apps-of-the-suite list and URLs in sync with `README.md`/
`README.es.md` and with the equivalent section in `site/index.html` if
any project in the group changes.

### 8.4 `/legal/`

Data protection page: what Routime stores (`localStorage` only — see
§3.4/SPEC.md), where, why, how to see or delete it (link to `/settings/`),
and how to raise a question (the public GitHub repository). It is the one
exception to the "hidden route" rules above: it **is** linked from every
other page's footer (`site/`, `settings/`, `team/`, `about/` and all
`tools/<slug>/`, via the shared `core.dataProtection` i18n key in
`assets/js/i18n.js` and the `.pie-app`/`.enlace-legal` styles in
`assets/css/components.css`), it carries no `noindex` meta, and its
language stays plain and accessible rather than clinical, since anyone —
including the end user — may land on it. Still follows the
`strings.es.js`/`strings.en.js` pattern checked by `scripts/check.js`.

Keep it up to date, in both languages, whenever what the app stores
locally changes (new tool asking for a name/personal data, new `settings/`
reset action, etc.).

---

## 9. Recipe: developing a new activity

1. **Choose a module and therapeutic objective.** Check coverage in
   [`team.md`](team.md). Any open priorities live as GitHub issues; the
   closed project roadmap can be reconstructed with `git log`.
2. **Create `tools/<slug>/`** with the 6 files from §4: `index.html`, `app.js`,
   `data.js`, `strings.es.js`, `strings.en.js` and `styles.css`. Copy the HTML
   structure and script footer from an existing activity in the same module.
3. **`data.js`**: `var DATA = {...}` — data only, with its format documented in a
   header comment. No logic or UI text. A quiz has at most 3 options, one
   explanation per option and a first-failure hint. If there are levels, each
   changes only one difficulty variable (§5).
4. **`strings.es.js` and `strings.en.js`**: register one dictionary per file with
   `App.i18n.register(dict, 'es' | 'en')`. Both must have the same keys (§6).
5. **`app.js`**: use an IIFE with `'use strict'`. Read and save with
   `App.storage.get/set('<slug>')`; reuse `App.*` APIs before creating new shared logic.
6. **`styles.css`**: activity-specific styles only (< 150 lines), using tokens and
   the module accent color.
7. **Meet all 13 accessibility rules** (§5).
8. **Register the activity in every canonical location**:
   - Card in `site/index.html` and matching keys in
     `site/strings.es.js` / `site/strings.en.js`.
   - All 6 activity files in `sw.js`'s `ARCHIVOS`, and bump `VERSION` (§11).
   - Row in `team/index.html` and bilingual entry in `activities.md`.
9. **Verify** with §12 commands and criteria: structure, both languages,
   persistence, audio, keyboard, touch targets and responsive view.
10. **Create a small, coherent commit** with an English message.

---

## 10. Recipe: adding a new therapeutic module (area)

Only if the area does not fit the 7 existing modules (check coverage in
[`team.md`](team.md)):

1. Add the token pair in `assets/css/tokens.css`:
   `--mod-<name>: <AA color over white>;` and `--mod-<name>-suave: <light background>;`.
   Verify AA contrast of the color against `--color-superficie`.
2. Add the `<section class="modulo">` in `site/index.html` with
   `style="--acento: var(--mod-<name>); --acento-suave: var(--mod-<name>-suave);"`,
   an `<h2>` with emoji + name in Easy Reading, and its `grid-tarjetas`.
3. Document the module in `activities.md`, `team.md`, `team/index.html` and
   §2.2 of this document.
4. Create the first activity of the module (recipe §9).

---

## 11. PWA and service worker

- `sw.js` is **cache-first** for the app shell. Contract when touching files:
  1. New file → add it to the `ARCHIVOS` list.
  2. Any change to cached files → **bump `VERSION`** (`Routime-vNN`),
     otherwise users with the installed PWA won't receive the change.
- **Bump `VERSION` on every committed change to a cached file.** This
  is not just "add a new activity" — it applies to every CSS tweak,
  every string fix, every JS refactor in `tools/`, every classroom
  assignment of a colour value. The cache is silent: the developer
  sees the new code on a Ctrl+Shift+R reload, but the user sees the
  old one until the SW is manually unregistered. The cost of bumping
  is one integer; the cost of not bumping is "the user thinks the fix
  didn't land". Bump liberally rather than conservatively.
  The bug pattern in practice: developer edits a CSS class, expects
  to see the new colour in the running app, doesn't, "fixes" the
  source again, still doesn't — and the only thing missing was the
  integer bump. The fix is to bump `VERSION` first, then verify.
- The fetch handler also caches new same-origin resources on demand and
  falls back to `site/index.html` offline.
- No update notice: the SW does `skipWaiting()` + `clients.claim()` without
  asking, and new resources are served transparently on the next navigation,
  without interrupting the person with a dialog.
- `manifest.json`: `display: standalone`, `start_url` in `site/index.html`,
  192/512 icons in `assets/img/`.
- To check installability objectively: DevTools → Lighthouse → "PWA" category.

---

## 12. Execution, verification and deployment

### 12.1 Local server

```bash
# Option 1: Python
python -m http.server 8080          # → http://localhost:8080/site/index.html

# Option 2: npx serve
npx serve .                         # alternative if no Python
```

### 12.2 Syntax and structure checks

```bash
# Quick syntax check for a JS file
node --check tools/<slug>/app.js

# Complete structural check
node scripts/check.js
```

`scripts/check.js` checks, among other things:
- JavaScript syntax
- Activity folder structure
- Key parity between `strings.es.js` and `strings.en.js`
- Service worker cache

### 12.3 Smoke test

```bash
node scripts/smoke.js
```

Opens all 68 activities in Chromium (ES and EN) and verifies there are no console errors.

### 12.4 Cross-browser and cross-device test

```bash
# Default test (3 browsers × 3 devices × 1 language = 9 tests per activity)
node scripts/cross-browser.js

# Test in both languages too (× 2 languages = 18 tests per activity)
node scripts/cross-browser.js --all-langs

# Test a single activity
node scripts/cross-browser.js pairs

# Via npm scripts (not available — there is no package.json)
# npm run test:cross
# npm test          # check + smoke + cross-browser
```

The project has no `package.json`, so there are no `npm run` aliases:
each script is invoked directly with `node scripts/<name>.js`. CI
(`.github/workflows/ci.yml`) does the same.

`scripts/cross-browser.js` opens each activity in **Chromium (Chrome/Edge),
Firefox and WebKit (Safari)**, on **desktop, iPhone 12 and Pixel 5**, and
verifies:

- No console or page errors
- "Back" button visible
- Audio button (`.btn-audio`) present
- All `.btn` are ≥ 64×64 px (accessibility rule 2)
- ES → EN language change works (if selector is in the activity)
- On mobile: no horizontal scroll (responsive 360 px)

Requirements (one-time, local dev only — not needed in CI):

```bash
npm install --no-save playwright
npx playwright install chromium firefox webkit
```

The `--no-save` flag avoids creating a `package.json` in the repo.
Cross-browser tests are **not** part of the CI pipeline (CI runs the
zero-dependency `scripts/check.js`, `scripts/i18n-keys-smoke.js` and
`scripts/scan-secrets.js`).

### 12.5 Deployment

The site is deployed on **Cloudflare Pages** (project `Routime`). The
repository root is the build output — there is no bundler or build step.
Cloudflare picks up `_headers` automatically. See `CLOUDFLARE.md` at
the repository root for the full setup.

There is no custom GitHub Actions workflow and no CLI deploy script: pushes
to `master` trigger the build through the Cloudflare Git connector, and pull
requests get an automatic preview channel (`https://<hash>.Routime.pages.dev`).
A redeploy is just a push, and a rollback is done from the Cloudflare
dashboard (Workers & Pages → `Routime` → Deployments).

The only "deploy" command relevant to maintenance is opening a PR — the
preview channel replaces local browser checks for **remote-control** sessions,
per `CLAUDE.md` §A.3 (preview URLs are still a network operation, so notify the
user before pushing).

The scripts above (`check`, `smoke`, `test:cross`) automate structure and
basic loading checks. Complete functional walkthroughs, content quality and
accessibility review still require manual testing.

---

## 13. License

This project is open source under MIT license. See the repository for more details.

## Compact application header

The main header follows Memofun: a 44px app icon (32px below 650px),
a Nunito brand title at 28px (22px on mobile), suite attribution and aligned
utility controls. It uses an 8px vertical inset and a 6px row gap. Supporting
copy uses regular weight; any star counter stays compact. Header language buttons, where present,
show full names on desktop and ES/EN on mobile, with full accessible names.
Teclatlon keeps its keyboard controls and settings; Enroca keeps its navigation
and settings. These header styles do not change activity controls.
