# Routime 🌱

> 🌐 **Other languages:** [Español](README.es.md)
>
> 🚀 **Try it live:** [routime.apptonomia.uk](https://routime.apptonomia.uk)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![No dependencies](https://img.shields.io/badge/dependencies-none-success.svg)](#-features)
[![Static site](https://img.shields.io/badge/build-none-informational.svg)](#-quick-start)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-documentation)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fcheck.js-blue.svg)](.github/workflows/validate.yml)

Multi-language web application for occupational therapy activities designed
for our typical user profile. Designed to be used autonomously, in the
browser, free of charge and without personal data.

- 🌐 **App**: [routime.apptonomia.uk](https://routime.apptonomia.uk)
- 📦 **Repository**: [github.com/miralante/routime](https://github.com/miralante/routime)
- 💻 **Run locally**: see [`doc/en/quick-guide.md`](doc/en/quick-guide.md) §1 — download the ZIP and double-click `site/index.html`, or use `python -m http.server 8080` for the full PWA experience.

---

## 🚀 Try it live

Routime is deployed at **[routime.apptonomia.uk](https://routime.apptonomia.uk)**
— open it in a browser, install it to the home screen for offline use,
and pick a module. The site you land on (`site/index.html`) is itself
the **Apptonomia landing**, so a single install covers both Routime's
activities and the catalogue of all siblings.

---

## ✨ Features

Routime is a **multi-activity catalogue** built on the same three-
level architecture as Apptonomia (shared core in `assets/js/`, one
folder per activity in `tools/<slug>/`, a landing in `site/`), plus
a settings page for progress visibility.

- 🎯 **6 therapeutic modules** — Aiming & Hands, My Daily Routine,
  Memory & Attention, Thinking & Counting, Emotions, and Reading
  (numbers and clocks).
- 🧩 **Dozens of activities** — short, visual, self-paced.
- 🌐 **Bilingual** — Spanish (default) and English.
- 🪶 **Zero runtime dependencies** — pure HTML/CSS/JS, no build.
- 🔒 **Privacy by default** — no accounts, no cookies, no analytics:
  progress is saved only in `localStorage` on the user's device.
- 📦 **Offline-capable PWA** — installable, works without internet.
- 🖐️ **Accessibility** — large hit areas, high contrast, plain
  language, full keyboard navigation, `prefers-reduced-motion`.
- ⭐ **Progressive stars** — only ever added, never subtracted.
- 🪞 **Settings page** — progress view and the two reset actions.

---

## 👥 Roles in the project

| Role | Who they are | How they participate | Where they look first |
|---|---|---|---|
| 👤 **End user** (typical user profile) | Practices activities in the app | Opens the app in a browser; doesn't read or write code | The app |
| ❤️ **Support** (family, therapist, teacher, caregiver) | Person close to the end user | Accompanies, supervises, contributes content (what activities are missing, wording clarity, difficulty) | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| 💻 **Construction** (developer) | Programs the application | Implements code, maintains architecture, reviews PRs, deploys | [`technical.md`](doc/en/technical.md) |

See [`doc/en/roles.md`](doc/en/roles.md) for the full role description
and the trio-vs-pair-vs-sole patterns across the sibling suite.

---

## 📚 Project documentation (bilingual)

All project documentation lives in the `doc/` folder:

| Language | Entry point |
|---|---|
| 🇬🇧 English (this file) | [`doc/en/index.md`](doc/en/index.md) |
| 🇪🇸 Español | [`doc/es/indice.md`](doc/es/indice.md) |

By role and profile, the most relevant docs are:

| I am… | Start here |
|---|---|
| 👤 End user or family member | [`doc/en/README.md`](doc/en/README.md) |
| ❤️ Therapist, family, or support professional | [`doc/en/team.md`](doc/en/team.md) |
| 🤔 I want to understand what Routime is and why | [`doc/en/SPEC.md`](doc/en/SPEC.md) |
| 💻 Developer | [`doc/en/technical.md`](doc/en/technical.md) |

### 📄 Other repo documents

| Document | Audience |
|---|---|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Anyone who wants to contribute (family, therapists, devs) |
| `CLAUDE.md` | AI agents: operational workflow, coordination and approvals |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Canonical Cloudflare Workers deploy guide for the sibling group (Routime + Apptonomia landing + Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon) |
| Project history | Lives in `git log`; no external roadmap is maintained |
| `doc/es/I18N.md` / `doc/en/I18N.md` | Details of the ES/EN multilanguage system |

---

## 🛠️ Preparing / Expanding content

Routime grows by adding **activities** under `tools/<slug>/`. Each
activity ships the six canonical files (`index.html`, `app.js`,
`data.js`, `strings.es.js`, `strings.en.js`, `styles.css`); every
change must respect the catalog parity lock (the same set of slugs
must appear in `tools/` on disk, in `site/index.html`'s cards, in
`settings/index.html`'s progress rows, and in `sw.js`'s `ARCHIVOS`).

To add a new activity:

1. Create `tools/<slug>/` with the six canonical files (use an
   existing activity as a template).
2. Register the activity: add its card to `site/index.html` (+ both
   `site/strings.<locale>.js` keys), its progress row to
   `settings/index.html` (+ both `settings/strings.<locale>.js` keys),
   and its six files to `sw.js`'s `ARCHIVOS`.
3. Bump `VERSION` in `sw.js` (e.g. `routime-vN` → `routime-vN+1`).
4. Read `doc/en/creating-activities-guide.md` first — didactic,
   gamification, persuasion and neuromarketing techniques for our
   audience; if a guide rule conflicts with `technical.md`,
   `technical.md` wins.

To expand the **content** of an existing activity, edit its
`data.js` (plus locale-split if any) — `node scripts/check.js`
enforces key parity between `strings.es.js` and `strings.en.js`.

---

## ✅ Validating changes

```bash
node scripts/check.js
```

No `npm install` needed — the script only uses Node's standard library.
It checks JS syntax across `tools/`, `site/` and `assets/js/`,
canonical file anatomy per activity folder, `sw.js` ↔ disk parity,
es/en key parity, and the catalog-parity lock (the same set of slugs
must appear in `tools/` on disk, in `site/index.html`'s cards, in
`settings/index.html`'s progress rows, and in `sw.js`'s `ARCHIVOS`).

---

## ☁️ Deploying

Routime is a fully static site (HTML/CSS/JS, no build step), so it
ships directly to **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
through its built-in GitHub integration. The HTTP security headers
live in [`_headers`](_headers), and the project metadata in
[`wrangler.toml`](wrangler.toml). See [`CLOUDFLARE.md`](CLOUDFLARE.md)
for the full runbook (rebuild, rollback, custom domain, credential
rotation).

Pull requests automatically get a preview URL on
`routime-<branch>.<account-subdomain>.workers.dev` — no extra
workflow is needed.

---

## 🛡️ Security

Routime is a fully client-side static site: no backend, no database,
no telemetry, no third-party runtime. The threat model is essentially
"what a hostile offline page could do to the same origin", which the
browser already sandboxes. See [`SECURITY.md`](SECURITY.md) (or
[`SECURITY.es.md`](SECURITY.es.md)) for how to report a suspected
issue privately.

---

## 📄 License

MIT — see [`LICENSE`](LICENSE).

---

## 🤝 Contributing

Issues and pull requests are welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md)
for the workflow (and [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) for the
Spanish version). All participants are expected to follow
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

---

## 🧹 Housekeeping

There is no `node_modules` and no build artifacts in this repo. To
clean the local PWA cache during development, unregister the service
worker from DevTools (`Application → Service workers → Unregister`)
and clear site data. The whole suite is dependency-free, plain
Node.js + vanilla JS.

The `content/` directory holds author-time artefacts (courseware,
curated word lists, etc.) that are never shipped to the user-facing
app. Adding or editing files there does not need a `VERSION` bump.

---

## 🙏 Credits

Routime is the PWA shell that wraps several sibling experiences
(Apptonomia's catalogue, plus the siblings Apptonomia, Calculia,
Memofun, Okeymoney, Sinonimia, Teclatlon) on the same accessibility-
first / no-backend philosophy. The site you land on
(`site/index.html`) is the Apptonomia landing, kept here for
historical reasons — Apptonomia was the original product this group
grew out of.

Activity design follows the patterns documented in
[`doc/en/creating-activities-guide.md`](doc/en/creating-activities-guide.md)
(didactic, gamification, persuasion, neuromarketing), with
`technical.md` as the source of truth when the two guides conflict.

---

## 🧩 Sibling projects

Routime is one of a small group of sibling projects that share the
same author, the same accessibility-first / no-backend philosophy
and the same deploy story. None of them is the "main" one — they are
peers; this repo just happens to also ship the **Apptonomia landing**
(the original product this group grew out of) under its `site/`
folder so a single install covers the whole catalogue for users who
want it.

| Project | What it is | Repository |
|---|---|---|
| **Apptonomia** *(main)* | Activities for routines and daily-life skills (designed for our typical user profile) | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| Calculia | Math and logical reasoning | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| Memofun | Flashcards built around meaningful learning | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| Okeymoney | Personal finance and everyday autonomy | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| Routime | Activities for routines and daily-life skills | [github.com/miralante/routime](https://github.com/miralante/routime) |
| Sinonimia | Easy-read dictionary | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| Teclatlon | Touch-typing with a physical keyboard | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

This repo's [`CLOUDFLARE.md`](CLOUDFLARE.md) is the canonical deploy
guide for the whole group; each sibling repo has its own
project-specific doc that links back here.

