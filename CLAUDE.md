# CLAUDE.md — AI agent workflow

## About this project

Routime is a **web application for occupational-therapy activities** for people with intellectual disability, designed so the end user can practise daily living skills **autonomously** between sessions — without needing a professional present at all times. It is one of the seven siblings of the Apptonomia suite and follows its accessibility-first, no-pressure, easy-read design language.

## Other projects in the Apptonomia suite

This project is one of seven siblings. The rest of the suite:

- **Apptonomia** — the metaproject root and the public landing at https://apptonomia.uk/, linking out to each sibling app.
- **Calculia** — math and logical reasoning with short, visual activities.
- **Memofun** — study flashcards for autonomous review, one idea per card.
- **Okeymoney** — personal finance and everyday financial autonomy, with a personal-finance simulator.
- **Sinonimia** — easy-read dictionary of difficult words, with synonyms and ARASAAC pictograms.
- **Teclatlon** — touch typing on the physical computer keyboard, finger by finger.
- **Routime** *(this project)* — everyday activities to train mind and daily-life skills between sessions.

This file is the operational handbook for AI agents working in this
repository. It is intentionally short and stable; anything that grows
beyond a short rule belongs in the canonical sources listed in §A.1.

If two sections disagree, the more specific one wins: per-project
rules in Block A override the suite-wide rules in Block B for the
project at hand, and a rule about a specific topic wins over a
general one on the same block.

---

## Block A — Workflow

### A.1 Canonical sources

The canonical source for each topic prevails on that topic. If two
documents conflict, do not turn `CLAUDE.md` into a copy of both:
cross-check the code and fix the outdated doc in its canonical
location.

| Topic | Canonical source |
|---|---|
| Product, audience, accessibility rules, non-negotiable principles (Routime: didactic, gamification, persuasion, neuromarketing) | [`doc/en/SPEC.md`](doc/en/SPEC.md) ↔ [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Project roles (user, support, build) and who reads what first | [`doc/en/roles.md`](doc/en/roles.md) ↔ [`doc/es/roles.md`](doc/es/roles.md) |
| Architecture, structure, activity anatomy, APIs, contracts, tests, deploy | [`doc/en/technical.md`](doc/en/technical.md) ↔ [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Internationalization (App.i18n core, formatting, landing selector, recipe to add a locale) | [`doc/en/I18N.md`](doc/en/I18N.md) ↔ [`doc/es/I18N.md`](doc/es/I18N.md) |
| Activity catalog | [`doc/en/activities.md`](doc/en/activities.md) ↔ [`doc/es/actividades.md`](doc/es/actividades.md) |
| Activity creation guide (didactic, gamification, persuasion, neuromarketing) | [`doc/en/creating-activities-guide.md`](doc/en/creating-activities-guide.md) ↔ [`doc/es/guia-crear-actividades.md`](doc/es/guia-crear-actividades.md) |
| Coverage and therapeutic guidance | [`doc/en/team.md`](doc/en/team.md) ↔ [`doc/es/equipo.md`](doc/es/equipo.md) |
| Roadmap and closed product decisions | Git only: every PR leaves a message; reconstruct with `git log`. |
| Human contribution flow | [`CONTRIBUTING.md`](CONTRIBUTING.md) ↔ [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| AI agent operational flow | `CLAUDE.md` (this file) |
| Cloudflare deploy / cache contract (network-first vs cache-first SW) | [`CLOUDFLARE.md`](CLOUDFLARE.md) |
| Contents / TOC | [`doc/en/CONTENTS.md`](doc/en/CONTENTS.md) ↔ [`doc/es/CONTENIDOS.md`](doc/es/CONTENIDOS.md) |
| Doc index | [`doc/en/index.md`](doc/en/index.md) ↔ [`doc/es/indice.md`](doc/es/indice.md) |
| Quick guide | [`doc/en/quick-guide.md`](doc/en/quick-guide.md) ↔ [`doc/es/guia-rapida.md`](doc/es/guia-rapida.md) |

### A.2 Mandatory workflow

This repo may receive changes from the user and from several parallel
sessions. Read the affected source files before editing; never
overwrite in-flight work — re-read the file and reconcile if it
changed since your last read. Update the canonical source for the
topic, not a copy in `CLAUDE.md`. Keep `i18n` parity per the I18N
docs. For activity changes, follow `technical.md` §9 **and read
[`creating-activities-guide.md`](doc/en/creating-activities-guide.md)
first** (didactic, gamification, persuasion and neuromarketing
techniques for our audience); if a guide rule conflicts with `technical.md`,
`technical.md` wins. Update the catalogs and guides it names. Keep
changes minimal and on-target; do not bundle unrelated refactors.

#### A.2.1 Session start

Run before any modification:

```bash
git status --short
git log --oneline -3
node scripts/check.js
```

Keep uncommitted changes that are not yours (A.3 covers destructive
ops). If `check.js` already fails, find out whether the failure
belongs to the in-flight work before adding new changes.

#### A.2.2 Before editing

1. Classify the task with the canonical-sources table in §A.1.
2. Read the relevant sections and the affected code files.
3. For UI, content, or activities, always check `SPEC.md` §3–§4 and
   `technical.md` §5.
4. Closed project plan lives in `git log`. The canonical doc to use
   depends on the topic, not on an external roadmap.

#### A.2.3 Before finishing

1. Always run `node scripts/check.js`.
2. If this project ships a service worker (see §B.1): bump `VERSION`
   in `sw.js` whenever a cached file changes, and add any new file to
   `FILES`. Run `node scripts/check-version-bump.js` to verify the
   bump is consistent.
3. Run the relevant tests described in `technical.md` §12.
4. Check links if you modified documentation.
5. Report only verifications you actually ran; clearly flag any
   remaining manual tests.

### A.3 External and destructive operations

- A deploy (even to a temporary Cloudflare Pages preview) is a
  network operation: request explicit approval before running it.
  Commands are in `technical.md` §12.5.
- Never publish, push, or open/close external resources without an
  explicit request or authorization.
- Never delete or revert changes from the user or another session to
  simplify your task; integrate them or explain the conflict.

### A.4 Out of scope for this file

Do not add here: product principles, accessibility rules, project
structure, activity anatomy, APIs/recipes, taxonomy, roadmap or
changelogs. Those belong to the §A.1 sources. Detailed change
history lives in Git; `CLAUDE.md` must stay brief, operational,
and stable.

---

## Block B — Suite-wide policies

### B.1 Service worker cache

This project ships a service worker. **Behavior**: `sw.js` is
**cache-first** — every file in `FILES` (per-tool `ARCHIVOS` in
Calculia) is served from the cache; the network is only consulted
when the request is not in the cache.

**The cache is silent and persistent**. The developer sees a
change on a hard refresh, but users with the PWA installed keep
seeing the old version until either the SW itself is refreshed or
the cache is purged. The only reliable way to refresh the
deployed app after a new deploy is to bump `VERSION` in `sw.js`,
because the SW's `install` handler compares its `VERSION` against
the active cache name and only re-fetches + activates when they
differ.

**Rule — bump `VERSION` on every commit that touches any cached
file** (i.e. anything in `FILES` / `ARCHIVOS`, or a new file that
should be cached):

- Edit `sw.js` and increment the `VERSION` literal (e.g.
  `routime-v1` → `routime-v2`).
- Add any new file to `FILES` / `ARCHIVOS` at the same time.
- Run `node scripts/check-version-bump.js` to verify the bump is
  consistent with the changes (this is the same check that runs
  as the `cache-bump` job in CI — run it locally before pushing
  so the CI gate doesn't fail later).

The cost of bumping is one integer; the cost of not bumping is
"the deployed app keeps serving the old version after a deploy".
Bump liberally rather than conservatively. Full contract:
[`CLOUDFLARE.md`](CLOUDFLARE.md) § "Cache contract". This rule is
also the source of §A.2.3 step 2.

### B.2 Language policy

- **UI**: multilingual. Default locales: **Spanish (`es`)** and
  **English (`en`)**; `es` is the default and fallback when a key is
  missing or the detected locale is unsupported.
- **Technical code**: **always English** — variables, functions,
  identifiers, comments, and commit messages. UI text lives in
  `strings.<locale>.js`, but dictionary **keys** are code and must be
  English.
- **Product changes apply to all locales by default**: any change to
  product content (UI strings, labels, copy, dates, activities,
  catalog entries, documentation aimed at end users or support staff,
  etc.) **must be applied to every supported locale** — at minimum
  `es` and `en`. Spanish (`es`) is the source of truth when not
  dictated otherwise; English (`en`) must keep parity. If a new locale
  is added, the same change applies there too. Never ship a product
  change that exists only in one language.
- Full policy (App.i18n core, number/time formatting, landing
  selector, recipe to add a locale):
  [`doc/en/I18N.md`](doc/en/I18N.md) ↔
  [`doc/es/I18N.md`](doc/es/I18N.md) and
  [`doc/en/technical.md`](doc/en/technical.md) §6.

### B.3 UNE 153101 reference

All seven sibling projects follow **UNE 153101:2018 EX** (Spanish
easy-read standard) and Inclusion Europe's European easy-read
guidelines as the normative basis for the cognitive accessibility
principles that guide content and UI: short sentences, one idea per
sentence, everyday vocabulary, no clinical or technical jargon in
what the end user reads. This is the standard each `SPEC.md` cites
when it states the "easy read always" rule (see `doc/en/SPEC.md` §3.3
or its mirror in `doc/es/SPEC.md` §3.3). Adding a new language or a
new piece of UI copy means following UNE 153101 — not paraphrasing
it.

### B.4 WCAG AAA baseline

This project conforms to WCAG 2.1 at **AA minimum** and adopts the
**AAA criteria that apply to the suite's audience** whenever feasible.
Full conformance at AAA is not feasible for a whole web application
(the W3C itself states AAA is meant for specific contexts); the list
below enumerates the AAA criteria that ARE applicable and that this
project honours.

Adopted AAA criteria:

- **1.4.6 Contrast (Enhanced)** — text ≥ 7:1 (large text ≥ 4.5:1).
  WCAG AA is the floor; AAA is the design target.
- **3.1.5 Reading Level** — already covered by UNE 153101 (§B.3).
- **1.4.1 Use of Color** — color is never the only channel.
  `App.feedback.success/encourage/lockUntilAck` already combine
  shape, icon, text and sound.

The literal phrase **"WCAG AA minimum, AAA whenever possible"** lives
in `doc/en/SPEC.md` §3.6 / §5 (mirror in `doc/es/SPEC.md`). This
section mirrors the metaproject's `apptonomia/CLAUDE.md`.

### B.5 Public-facing wording: "persona tipo" euphemism

Applies to the whole Miralante suite and the `apptonomia.uk`
landing. The suite's real objective lives in internal docs; public
surfaces use **"persona tipo"** instead.

#### B.5.1 Where each term is allowed

- **"Discapacidad intelectual"** / **"intellectual disability"** —
  internal docs only (`CLAUDE.md`, `doc/<lang>/SPEC.md`,
  `technical.md` / `tecnico.md`, `roles.md`, `CONTRIBUTING.md`,
  `CONTRIBUTING.es.md`, `scripts/`). Forbidden in any public-facing
  surface, README, talk, press note or marketing material.
- **"Persona tipo"** — public surfaces only (`README.md`,
  `README.es.md`, talks, social copy, press notes, marketing,
  contributor-facing docs that double as public description, e.g.
  `CONTRIBUTING.md`).
- It does **not** apply to the UI of the app itself: each project's
  zero-mention rule (`doc/en/SPEC.md` §3.4 / `doc/es/SPEC.md` §3.4)
  forbids **any** mention — including "persona tipo" — in
  `index.html`, `app.js`, `strings.<locale>.js`, `js/i18n.js`,
  `about/privacidad.html`, etc.
- It does **not** apply to content that names a clinical concept
  by its real-world name (e.g. an activity case study): that is
  content, not audience labelling.

#### B.5.2 Rationale

Maintainer docs describe the project's real purpose so contributors
can serve it. Public surfaces describe the audience generically via
"persona tipo" without publicly naming a clinical group. This rule
is mirrored in `apptonomia/CLAUDE.md` and every sibling's
`CLAUDE.md` / `SPEC.md`.

### B.6 graphify

This project has a knowledge graph at `graphify-out/` with god nodes,
community structure, and cross-file relationships.

- For codebase questions, first run `graphify query "<question>"`
  when `graphify-out/graph.json` exists. Use `graphify path "<A>"
  "<B>"` for relationships and `graphify explain "<concept>"` for
  focused concepts. These return a scoped subgraph, usually much
  smaller than `GRAPH_REPORT.md` or raw grep output.
- If `graphify-out/wiki/index.md` exists, use it for broad
  navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture
  review or when `query`/`path`/`explain` do not surface enough
  context.
- After modifying code, run `graphify update .` to keep the graph
  current (AST-only, no API cost).