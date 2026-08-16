# CLAUDE.md — AI agent workflow

## Service worker cache (read this before touching any cached file)

`sw.js` is cache-first for the app shell — every HTML/CSS/JS file listed
in `ARCHIVOS` is served from the cache. **Any change to a cached file
without bumping `VERSION` is invisible to users with the PWA installed.**
The bug is silent: the developer sees the change on a hard refresh,
but the user sees the old version until they manually unregister the SW
or the cache expires.

**Rule**: when you edit any file listed in `ARCHIVOS` (or any new file
that should be cached), bump `VERSION` in `sw.js` (e.g. `apptonomia-v120`
→ `apptonomia-v121`). The `install` handler will re-fetch every file into
the new cache and the `activate` handler will delete the old one. This
is also called out in `doc/en/technical.md` §4.

This applies to every CSS tweak, every string fix, every JS refactor in
`tools/`, every colour value tweak. The cache is silent: the developer
sees the new code on a Ctrl+Shift+R reload, but the user sees the old
one until the SW is manually unregistered. The cost of bumping is one
integer; the cost of not bumping is "the user thinks the fix didn't
land". Bump liberally rather than conservatively.

## Language policy

- **UI**: multilingual. Default locales: **Spanish (`es`)** and **English (`en`)**; `es` is the default and fallback when a key is missing or the detected locale is unsupported.
- **Technical code**: **always English** — variables, functions, identifiers, comments, and commit messages. UI text lives in `strings.<locale>.js`, but dictionary **keys** are code and must be English.
- **Product changes apply to all locales by default**: any change to product content (UI strings, labels, copy, dates, activities, catalog entries, documentation aimed at end users or support staff, etc.) **must be applied to every supported locale** — at minimum `es` and `en`. Spanish (`es`) is the source of truth when not dictated otherwise; English (`en`) must keep parity. If a new locale is added, the same change applies there too. Never ship a product change that exists only in one language.
- Full policy (App.i18n core, number/time formatting, landing selector, recipe to add a locale): [`doc/en/I18N.md`](doc/en/I18N.md) · [`doc/es/I18N.md`](doc/es/I18N.md) and [`doc/en/technical.md`](doc/en/technical.md) §1.

## 1. Canonical sources

The canonical source for each topic prevails on that topic. If two documents conflict, do not turn `CLAUDE.md` into a copy of both: cross-check the code and fix the outdated doc in its canonical location.

| Topic | Canonical source |
|---|---|
| Product, audience, non-negotiable principles | [`doc/en/SPEC.md`](doc/en/SPEC.md) · [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Project roles (user, support, build) and who reads what first | [`doc/en/roles.md`](doc/en/roles.md) · [`doc/es/roles.md`](doc/es/roles.md) |
| Architecture, structure, activity anatomy, APIs, contracts, tests, deploy | [`doc/en/technical.md`](doc/en/technical.md) · [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Internationalization | [`doc/en/I18N.md`](doc/en/I18N.md) · [`doc/es/I18N.md`](doc/es/I18N.md) |
| Activity catalog | [`doc/en/activities.md`](doc/en/activities.md) · [`doc/es/actividades.md`](doc/es/actividades.md) |
| Activity creation guide (didactic, gamification, persuasion, neuromarketing) | [`doc/en/creating-activities-guide.md`](doc/en/creating-activities-guide.md) · [`doc/es/guia-crear-actividades.md`](doc/es/guia-crear-actividades.md) |
| Coverage and therapeutic guidance | [`doc/en/team.md`](doc/en/team.md) · [`doc/es/equipo.md`](doc/es/equipo.md) |
| Roadmap and closed product decisions | Git only: every PR leaves a message; reconstruct with `git log`. |
| Human contribution flow | [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| AI agent operational flow | `CLAUDE.md` (this file) |

## 2. Mandatory workflow

This repo may receive changes from the user and from several parallel sessions. Read the affected source files before editing; never overwrite in-flight work — re-read the file and reconcile if it changed since your last read. Update the canonical source for the topic, not a copy in `CLAUDE.md`. Keep `i18n` parity per the I18N docs. For activity changes, follow `technical.md` §9 **and read [`creating-activities-guide.md`](doc/en/creating-activities-guide.md) first** (didactic, gamification, persuasion and neuromarketing techniques for our audience); if a guide rule conflicts with `technical.md`, `technical.md` wins. Update the catalogs and guides it names. Keep changes minimal and on-target; do not bundle unrelated refactors.

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
3. For UI, content, or activities, always check `SPEC.md` §3–§4 and `technical.md` §5.
4. Closed project plan lives in `git log`. The canonical doc to use depends on the topic, not on an external roadmap.

### 2.3 Before finishing

1. Always run `node scripts/check.js`.
2. Run the relevant tests described in `technical.md` §12.
3. Check links if you modified documentation.
4. Report only verifications you actually ran; clearly flag any remaining manual tests.

## 3. External and destructive operations

- A deploy — even to a temporary Firebase channel — is a network operation: request explicit approval before running it. Commands are in `technical.md` §12.5.
- Never publish, push, or open/close external resources without an explicit request or authorization.
- Never delete or revert changes from the user or another session to simplify your task; integrate them or explain the conflict.

## 4. Out of scope for this file

Do not add here: product principles, accessibility rules, project structure or activity anatomy, APIs/recipes, catalog or therapeutic taxonomy, roadmaps/phases/backlog, or chronicles of resolved bugs/implementations. Those belong to the §1 sources. Detailed change history lives in Git; `CLAUDE.md` must stay brief, operational, and stable.

## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when `query`/`path`/`explain` do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).