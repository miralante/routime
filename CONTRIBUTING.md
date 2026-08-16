# Contributing to Routime

> 🌐 **Other languages:** [Español](CONTRIBUTING.es.md)

Routime has **three differentiated roles** in its community:

1. 👤 **People with intellectual disability** → are the **end users** of the app
2. ❤️ **Family and therapists** → are the **support people** who accompany them
3. 💻 **Developers** → are the **people who build** the software

This guide is for roles **2 and 3** (support and construction), who are the
ones participating on GitHub. **End users don't read or write code**, and
that's precisely the goal: the tool is for them.

---

## 👥 The three project roles

| # | Role | Who they are | Participate on GitHub |
|---|---|---|---|
| 1 | 👤 **End user** (person with intellectual disability) | Practices activities in the app | No. Uses the app autonomously. Their experience is at the center of the product, but they don't read this documentation. |
| 2 | ❤️ **Support person** (family, therapist, caregiver, teacher) | Person close to the end user | **Yes**, with content: proposes activities, reviews content PRs, reports from real use. |
| 3 | 💻 **Construction person** (developer, UX designer, translator) | Programs or designs the software | **Yes**, with code: implements, reviews, deploys. |

> ⚠️ Purely technical decisions (GitHub, code architecture, infrastructure)
> are made by people in roles 2 and 3, **not because the end user is ignored,
> but because that is each role's domain**. Product, content, language and
> UI design decisions **are tested and validated with them** whenever
> possible, and their feedback is the primary source for improvement.

See [`doc/en/roles.md`](doc/en/roles.md) for where each role should look first
(README, quick-guide, team.md, technical.md, …).

---

## 🔀 GitHub workflow

This is the flow we use to integrate contributions in an orderly way.

### For any participating profile

```
1. 🔍 Search or create an issue (in Spanish or English)
2. 💬 Comment and agree on scope
3. 🌿 Create a branch (fork if you don't have push access)
4. ✏️  Make changes following our guides
5. 📤 Open a Pull Request (PR) referencing the issue
6. 👀 Wait for review (at least 1 from the corresponding profile)
7. ✅ Merge when approved
```

**Issue labels** (we use them to classify):

| Label | Meaning |
|---|---|
| `therapeutic` | Proposal or change related to clinical content/activities |
| `UX` | Usability or experience improvement |
| `content` | Texts, translations, Easy Reading |
| `bug` | Reproducible error in behavior |
| `tech` | Technical implementation, refactor, technical debt |
| `docs` | Documentation changes |
| `good first issue` | Suitable for a first contribution |
| `needs-therapist` | Awaits therapist review before merge |
| `needs-dev` | Awaits developer review before merge |

### Branch conventions

- `feat/<slug>` — new features
- `fix/<slug>` — bug fixes
- `docs/<slug>` — documentation-only changes
- `therapy/<slug>` — therapeutic content changes (activity texts, sheets)
- `i18n/<code>` — translation to a language (e.g. `i18n/ca`, `i18n/gl`)

Examples:
- `therapy/new-activity-signs`
- `i18n/ca-catalan`
- `fix/audio-not-playing-on-mobile`

### Commits

- Message in **English** (repo convention), summary in imperative
- One thing per commit — large commits can be asked to be split
- If you close an issue, include `Closes #123` at the end

---

## ❤️ Guide for support people (family, therapist, caregiver, teacher)

### What you can contribute

- **Propose a new activity** with its sheet (objective, levels, messages, data)
- **Review the wording** of existing activities (style, Easy Reading, tone)
- **Correct clinical or home autonomy content**
- **Identify uncovered therapeutic areas**
- **Suggest adaptations** for specific user profiles
- **Report from real use** (what works, what frustrates, what's missing)

### How to start

1. Read [`doc/en/SPEC.md`](doc/en/SPEC.md) — you'll understand WHAT Routime is and WHY it exists
2. Read [`doc/en/team.md`](doc/en/team.md) — clinical view of the activities
3. Examine [`doc/en/activities.md`](doc/en/activities.md) — what's there and what's missing
4. Read SPEC §3: the **non-negotiable constraints** are what your content must never break

### How to propose content

Open an **issue** with the `therapeutic` label and fill in:

```markdown
## Proposed activity: <Name>

### Therapeutic objective
- Area: (coordination / autonomy / memory / reasoning / language / emotions)
- Specific skill: <what is worked on>
- Target population: <age range or level>

### Brief description
<what the activity does in 2-3 sentences>

### Planned levels
- Level 1 (Easy): <how one single variable changes>
- Level 2 (Medium): <how one single variable changes>
- Level 3 (Hard): <how one single variable changes>

### Success / encouragement messages (EN)
- Success: "..."
- Encouragement: "..."

### On-screen text (EN)
- Title: "..."
- Instruction: "..."

### On-screen text (ES) — optional but very welcome
- Título: "..."
- Instrucción: "..."

### Reference or inspiration
<book, article, website, common practice, etc.>
```

Afterwards, a developer will implement it in `tools/<slug>/` following the
recipe in [`doc/en/technical.md`](doc/en/technical.md) §9.

### How to review an activity

When a PR adds an activity, your review as support person is what validates:

- Texts are in Easy Reading
- The therapeutic objective matches the mechanics
- Options and hints are adequate
- There's no clinical language in the UI

---

## 💻 Guide for construction people (developers)

### What you can contribute

- Implement new activities from `therapeutic` issues
- Fix bugs and improve performance
- Refactor shared code (`assets/`)
- Improve accessibility, PWA, responsive
- Keep `technical.md` up to date

### How to start

1. Read [`doc/en/SPEC.md`](doc/en/SPEC.md) §3–§4 — product constraints and principles
2. Read [`doc/en/technical.md`](doc/en/technical.md) entirely — you'll
   understand the architecture, the core API and the recipes
3. Run `node scripts/check.js` — verifies your environment is good

### Quick recipes

- **New activity** → [`doc/en/technical.md`](doc/en/technical.md) §9
- **New module** → [`doc/en/technical.md`](doc/en/technical.md) §10
- **New language** → [`doc/en/I18N.md`](doc/en/I18N.md) §5

### Checklist before opening a PR

- `node scripts/check.js` passes without errors
- `node scripts/smoke.js` passes without errors (Chromium ES+EN, all activities)
- `node scripts/cross-browser.js` passes without errors (Chrome + Firefox + Safari, desktop + iPhone + Pixel 5)
- Tested on mobile (responsive 360 px)
- No console errors
- If you changed cached files, you bumped `VERSION` in `sw.js`
- If you added an activity, it's in `team/index.html` and `site/index.html`

---

## 🌐 Guide for translators

- All UI lives in `strings.<locale>.js` files inside each activity
- To add a new language, see [`doc/en/I18N.md`](doc/en/I18N.md) §5
- Maintain the **Easy Reading** style also in the translation
- Be careful with numbers and money (separators and scale): see note in
  [`doc/en/technical.md`](doc/en/technical.md) §3.3

---

## 🚫 What this repo does NOT accept

(They're here so they don't get suggested and we all save time)

- **Changes that break autonomy, accessibility or privacy** — they are the
  non-negotiable product constraints ([SPEC §3](doc/en/SPEC.md))
- **New dependencies** (npm, CDNs) — vanilla JS only, see [`doc/en/technical.md`](doc/en/technical.md) §1
- **Features that add pressure** to the end user (visible timers, rankings,
  comparisons, "game over")
- **Clinical language in the UI** — only allowed in `team/` and in
  internal documentation
- **Personal data** of any kind — the app runs on `localStorage` only
- **Imposing technical decisions on the end user** — their experience is
  always cared for from design; they aren't consulted about GitHub

---

## 📞 Communication

- **Issues** → main channel for proposals, bugs, questions
- **Discussions** (if enabled) → for open debate, general questions, help
- **Pull Request reviews** → for review of specific changes

> 💡 **Tip**: if your contribution crosses boundaries (e.g. an activity that
> needs a support person + a developer), open **two related issues** or one
> issue with both labels (`needs-therapist`, `needs-dev`). That way both
> know they need to step in.

---

## 📜 Code of conduct

This project follows [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
Participating means accepting it.

---

## 🙏 Thanks

Thanks for devoting time to a tool that helps people with intellectual
disability be a little more autonomous every day.
