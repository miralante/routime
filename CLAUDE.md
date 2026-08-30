# CLAUDE.md � AI agent workflow

## Service worker cache (read this before touching any cached file)

`sw.js` is cache-first for the app shell � every HTML/CSS/JS file listed
in `ARCHIVOS` is served from the cache. **Any change to a cached file
without bumping `VERSION` is invisible to users with the PWA installed.**
The bug is silent: the developer sees the change on a hard refresh,
but the user sees the old version until they manually unregister the SW
or the cache expires.

**Rule**: when you edit any file listed in `ARCHIVOS` (or any new file
that should be cached), bump `VERSION` in `sw.js` (e.g. `routime-v1`
→ `routime-v2`). The `install` handler will re-fetch every file into
the new cache and the `activate` handler will delete the old one. This
is also called out in `doc/en/technical.md` �4.

This applies to every CSS tweak, every string fix, every JS refactor in
`tools/`, every colour value tweak. The cache is silent: the developer
sees the new code on a Ctrl+Shift+R reload, but the user sees the old
one until the SW is manually unregistered. The cost of bumping is one
integer; the cost of not bumping is "the user thinks the fix didn't
land". Bump liberally rather than conservatively.

## Language policy

- **UI**: multilingual. Default locales: **Spanish (`es`)** and **English (`en`)**; `es` is the default and fallback when a key is missing or the detected locale is unsupported.
- **Technical code**: **always English** � variables, functions, identifiers, comments, and commit messages. UI text lives in `strings.<locale>.js`, but dictionary **keys** are code and must be English.
- **Product changes apply to all locales by default**: any change to product content (UI strings, labels, copy, dates, activities, catalog entries, documentation aimed at end users or support staff, etc.) **must be applied to every supported locale** � at minimum `es` and `en`. Spanish (`es`) is the source of truth when not dictated otherwise; English (`en`) must keep parity. If a new locale is added, the same change applies there too. Never ship a product change that exists only in one language.
- Full policy (App.i18n core, number/time formatting, landing selector, recipe to add a locale): [`doc/en/I18N.md`](doc/en/I18N.md) � [`doc/es/I18N.md`](doc/es/I18N.md) and [`doc/en/technical.md`](doc/en/technical.md) �1.

## 1. Canonical sources

The canonical source for each topic prevails on that topic. If two documents conflict, do not turn `CLAUDE.md` into a copy of both: cross-check the code and fix the outdated doc in its canonical location.

| Topic | Canonical source |
|---|---|
| Product, audience, non-negotiable principles | [`doc/en/SPEC.md`](doc/en/SPEC.md) � [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Project roles (user, support, build) and who reads what first | [`doc/en/roles.md`](doc/en/roles.md) � [`doc/es/roles.md`](doc/es/roles.md) |
| Architecture, structure, activity anatomy, APIs, contracts, tests, deploy | [`doc/en/technical.md`](doc/en/technical.md) � [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Internationalization | [`doc/en/I18N.md`](doc/en/I18N.md) � [`doc/es/I18N.md`](doc/es/I18N.md) |
| Activity catalog | [`doc/en/activities.md`](doc/en/activities.md) � [`doc/es/actividades.md`](doc/es/actividades.md) |
| Activity creation guide (didactic, gamification, persuasion, neuromarketing) | [`doc/en/creating-activities-guide.md`](doc/en/creating-activities-guide.md) � [`doc/es/guia-crear-actividades.md`](doc/es/guia-crear-actividades.md) |
| Coverage and therapeutic guidance | [`doc/en/team.md`](doc/en/team.md) � [`doc/es/equipo.md`](doc/es/equipo.md) |
| Roadmap and closed product decisions | Git only: every PR leaves a message; reconstruct with `git log`. |
| Human contribution flow | [`CONTRIBUTING.md`](CONTRIBUTING.md) � [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| AI agent operational flow | `CLAUDE.md` (this file) |

## 2. Mandatory workflow

This repo may receive changes from the user and from several parallel sessions. Read the affected source files before editing; never overwrite in-flight work � re-read the file and reconcile if it changed since your last read. Update the canonical source for the topic, not a copy in `CLAUDE.md`. Keep `i18n` parity per the I18N docs. For activity changes, follow `technical.md` �9 **and read [`creating-activities-guide.md`](doc/en/creating-activities-guide.md) first** (didactic, gamification, persuasion and neuromarketing techniques for our audience); if a guide rule conflicts with `technical.md`, `technical.md` wins. Update the catalogs and guides it names. Keep changes minimal and on-target; do not bundle unrelated refactors.

### 2.1 Session start

Run before any modification:

```bash
git status --short
git log --oneline -3
node scripts/check.js
```

Keep uncommitted changes that are not yours. Never use `git reset --hard`, `git clean`, `git checkout -- <file>`, or any other operation that discards work to "fix" the initial state. If `check.js` already fails, find out whether the failure belongs to the in-flight work before adding new changes.

### 2.2 Before editing

1. Classify the task with the canonical-sources table above.
2. Read the relevant sections and the affected code files.
3. For UI, content, or activities, always check `SPEC.md` �3��4 and `technical.md` �5.
4. Closed project plan lives in `git log`. The canonical doc to use depends on the topic, not on an external roadmap.

### 2.3 Before finishing

1. Always run `node scripts/check.js`.
2. Run the relevant tests described in `technical.md` �12.
3. Check links if you modified documentation.
4. Report only verifications you actually ran; clearly flag any remaining manual tests.

## 3. External and destructive operations

- A deploy � even to a temporary Firebase channel � is a network operation: request explicit approval before running it. Commands are in `technical.md` �12.5.
- Never publish, push, or open/close external resources without an explicit request or authorization.
- Never delete or revert changes from the user or another session to simplify your task; integrate them or explain the conflict.

## 4. Out of scope for this file

Do not add here: product principles, accessibility rules, project structure or activity anatomy, APIs/recipes, catalog or therapeutic taxonomy, roadmaps/phases/backlog, or chronicles of resolved bugs/implementations. Those belong to the �1 sources. Detailed change history lives in Git; `CLAUDE.md` must stay brief, operational, and stable.
## UNE 153101 reference (suite-wide)

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

## WCAG AAA baseline (suite-wide)

This project conforms to WCAG 2.1 at **AA minimum** and adopts the
**AAA criteria that apply to the suite's audience** whenever feasible.
Full conformance at AAA is not feasible for a whole web application
(the W3C itself states AAA is meant for specific contexts); the rule
below lists the AAA criteria that ARE applicable and that this project
honours.

Adopted AAA criteria:

- **1.4.6 Contrast (Enhanced)** — text contrast ≥ 7:1 (large text
  ≥ 4.5:1). WCAG AA (4.5:1) is the legal floor; AAA is the design
  target. Verified pairs in Okeymoney (`#F2F4F8` on `#161A21` = 14.6:1,
  `#B7BDC9` on `#161A21` = 8.4:1) already meet AAA; this project aims
  at the same ratio when its token palette is next touched.
- **3.1.5 Reading Level** — content for the general public does not
  require advanced reading ability. Already complied with through
  UNE 153101 (see the section above) and Inclusion Europe's easy-read
  guidelines.
- **1.4.1 Use of Color** — color is never the only means of conveying
  information. Every feedback state (success / hint / error / lock)
  also uses shape, icon, text or sound, so users with color-vision
  deficiencies are not excluded. (`App.feedback.success()` /
  `App.feedback.encourage()` / `App.feedback.lockUntilAck()` already
  encode this.)

The product-facing wording in `doc/en/SPEC.md` §3.5 / §5 (and the
Spanish mirror in `doc/es/SPEC.md`) already uses the literal phrase
**"WCAG AA minimum, AAA whenever possible"**; this section mirrors the
suite-wide rule in the metaproject's `apptonomia/CLAUDE.md`.

## Public-facing wording: "usuario/a tipo" euphemism

This directive applies across the entire Miralante suite (Apptonomia,
Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon, Routime) and the
metaproject landing at `apptonomia.uk`. The suite's real objective is
occupational-therapy support for people with intellectual disability, but
**that framing is not used in public surfaces** — only in internal
documentation.

### Where each term is allowed

- **"Discapacidad intelectual" / "intellectual disability"** is the
  canonical term and **may only appear in internal documentation**
  (`CLAUDE.md`, `doc/<lang>/SPEC.md`, `technical.md` / `tecnico.md`,
  `roles.md`, `CONTRIBUTING.md`, `CONTRIBUTING.es.md`, tooling files
  in `scripts/`). It is explicitly **forbidden** in public-facing
  surfaces, READMEs that anyone can read without authentication, public
  talks, social media copy, press notes, and marketing material.
- **"Usuario/a tipo"** (plural "usuarios/as tipo") is the accepted
  euphemism for the audience in public-facing surfaces. It is used as
  a generic profile marker, not as a label for any real person.
  - It applies to `README.md` / `README.es.md`, public talks, social
    media copy, press notes, marketing material, and any
    contributor-facing document that also doubles as a public
    description of the project (e.g. `CONTRIBUTING.md`).
  - It does **not** apply to the UI of the app itself: each project's
    own "Mandatory rule: zero mentions in the user-facing product" (see
    `doc/en/SPEC.md` §4 / `doc/es/SPEC.md` §4) continues to forbid
    **any** mention, including "usuario/a tipo", in `index.html`,
    `app.js`, `strings.<locale>.js`, `js/i18n.js`, `about/privacidad.html`
    and any other user-facing surface. The euphemism is for the outside
    world, not for what the visitor reads on the site.
  - It does **not** apply to project content that names a clinical
    concept by its real-world name (e.g. an activity case study about a
    real bureaucratic procedure): that is content, not labelling of an
    audience.

### Rationale

Presenting the project's real objective in maintainer docs is useful
and necessary for whoever maintains and contributes to the suite.
Presenting it in marketing or landing surfaces is neither necessary nor
respectful of the audience — "usuario/a tipo" lets public material
describe what the apps are for (who the typical profile is) without
publicly naming a clinical group. This rule is mirrored in the
metaproject's `apptonomia/CLAUDE.md` and in every sibling's own
`CLAUDE.md` and `SPEC.md` so it survives a single project's docs going
out of sync.
## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when `query`/`path`/`explain` do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).