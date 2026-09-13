# SPEC.md — Product definition

> **This document defines WHAT Routime is, WHO it's for, and why.**
>
> To know HOW the application is built (architecture, APIs, recipes),
> see [`technical.md`](technical.md).

This document defines only the product, audience, objectives and experience
rules. Implementation decisions must be documented in [`technical.md`](technical.md),
not here.

---

## 1. Product

Routime is a **web application for occupational therapy activities** for
people with intellectual disability. It's designed so the end user can practice
daily living skills **autonomously**, without needing a professional present at
all times.

### 1.1 What it is and what it isn't

**It is:**
- A tool for autonomous practice and reinforcement between sessions
- A complement to professional intervention (family, therapist, teacher)
- An application usable without technical knowledge
- A PWA installable on the user's device

**It isn't:**
- A substitute for the occupational therapy professional
- A standardized clinical assessment tool
- A record of personal data (doesn't save personally identifiable information)
- A social network nor a system that requires an internet connection

### 1.2 Target audience

**End user (person with intellectual disability):**
- Practices activities autonomously or with point support
- Needs an accessible, clear, pressure-free interface

**Families:**
- Find a tool to work on at home
- Accompany and supervise daily use
- Observe progress through stars ⭐

**Occupational therapists and teachers:**
- Select activities that fit specific therapeutic objectives
- Use the application as a complement between sessions
- Can view the usage guide at `team/`

---

## 2. Product goals

### 2.1 Therapeutic objectives

Routime works on **6 therapeutic areas** (modules):

| Module | Area | Main objective |
|--------|------|----------------|
| 🎯 Aiming and hands | Coordination and motor skills | Precise hand and finger movements, eye-hand coordination |
| 📋 My daily routine | Autonomy and home | Independent daily living skills |
| 🧠 Memory and attention | Memory and attention | Visual and auditory memory, attention and concentration |
| 🔢 Thinking and counting | Reasoning and math | Logic, math and strategies |
| 💬 Language and comprehension | Language and communication | Vocabulary, comprehension, expression |
| 💜 Emotions | Emotions and relationships | Emotional recognition and regulation, social skills |

The complete catalog, area by area and activity by activity, is in
[`activities.md`](activities.md). The specific therapeutic purpose of each
activity is in `team/index.html`.

### 2.2 UX goals

- **Real autonomy**: the user can use the app without needing another person by their side
- **Universal accessibility**: usable by people with different abilities (easy reading, large buttons, high contrast, audio)
- **No pressure**: no visible timers, no negative scores, no "game over"
- **Continuous positive reinforcement**: celebrate attempts, not just correct answers
- **Low emotional risk**: never show explicit errors nor subtract score
- **Train through simulation whenever possible**: each activity is, as far as the therapeutic goal allows, a **daily-life simulation** — a recognisable scene (kitchen, shop, street, chat, routine) where the person makes a decision and sees its consequence in the safe space of the app. Drills that don't connect to a real-life context are the exception, not the default.

---

## 3. Non-negotiable constraints (product)

These constraints come from the **product**, not technical. They are the "laws"
that are never broken, because they define what kind of experience we offer.

### 3.1 Error never punishes

- No stars or progress are subtracted for failing
- Failure produces an **encouragement** message (`animo()`), never an "incorrect"
- It can be retried without limit
- Hints are used (Socratic method) before showing the answer

### 3.2 No time pressure

- **No visible timers** in the interface
- The time the person takes isn't measured (internally it can be, but it's not shown)
- The rhythm is set by the user

### 3.3 Easy reading always

Cognitive accessibility is a guiding principle: every piece of content
follows **easy-read** guidelines and the **UNE 153101:2018 EX**
(Spanish easy-read standard), aligned with Inclusion Europe's European
guidelines. Comprehension outweighs technical accuracy expressed with
difficulty.

- Short sentences, one idea per sentence
- Everyday vocabulary (no technical jargon)
- No clinical language in the interface ("patient", "therapy", "disability")
- Clinical language is only allowed in `team/` and in repo documentation
- **The end user must never read anything in the app that labels them
  as "disabled", "with a disability" or similar.** The therapeutic
  goal (e.g. self-acceptance, responding to exclusion) is trained
  through everyday-life situations **without putting that label on
  the reader**. The same applies to a classmate or third party
  mentioned in a situation. Activities may speak about differences
  (in pace, in taste, in language, etc.) and about everyday
  supports without using the clinical term.

### 3.4 Public-facing wording: "persona tipo" euphemism

When presenting Routime to **the general public** (press, talks, public
READMEs that anyone can read, the metaproject landing at `apptonomia.uk`,
social media copy, marketing material), the term **"intellectual
disability" / "discapacidad intelectual"** must not be used as a way
to describe the audience of the app — even when the surrounding text
would otherwise be public. The accepted euphemism for that audience in
those surfaces is **"persona tipo"** (plural "personas tipo"),
used as a generic profile marker, not as a label for any real person.

Where the euphemism applies and where it doesn't:

- **Applies** to any text that anyone outside the project can read
  without authentication: `README.md`, `README.es.md`, the portal at
  `apptonomia.uk`, public talks, social media copy, press notes,
  marketing material. In these surfaces, refer to the audience as
  "la persona tipo" or "las personas tipo" of the app.
- **Does NOT apply** to this repo's internal documentation
  (`CLAUDE.md`, `doc/en/spec.md`, `doc/es/spec.md`, `technical.md`,
  `roles.md`, `CONTRIBUTING.md`, `CONTRIBUTING.es.md`) — those files
  are read by maintainers and contributors, and "intellectual
  disability" / "discapacidad intelectual" remains the canonical term
  there, because the project needs an explicit, unambiguous
  explanation of its real objective for whoever maintains it.
- **Does NOT apply** to project content that names a clinical concept
  by its real-world name (e.g. an activity that simulates a real
  bureaucratic procedure related to disability): that is content,
  not labelling of an audience.
- **Does NOT apply** to the UI of the app itself: the rule in §3.3
  above continues to forbid **any** mention, including "usuario/a
  tipo", in `index.html`, `app.js`, `strings.<locale>.js`,
  `js/i18n.js`, `about/privacidad.html`, and any other user-facing
  surface. The euphemism is for the outside world, not for what the
  visitor reads on the site.

Rationale: presenting the project's real objective in maintainer docs
is useful and necessary; presenting it in marketing or landing
surfaces is neither necessary nor respectful of the audience —
"persona tipo" lets public material describe what the app is for
(who the typical profile is) without publicly naming a clinical
group.

### 3.5 Privacy by default

- **No registration**: email, real name or password aren't requested
- **No cookies or analytics**: no tracking
- **No personal data**: progress is saved on the device (`localStorage`)
- The application works without an internet connection
- **Local progress contract**: `localStorage` storage is limited to
  `estrellas` (an integer) and `completado` (which levels are done), plus the
  few optional items each activity may ask for explicitly (for example, the
  name typed into Keyboard or Piano, which the user can erase at any time).
  We **never** store: failures, time taken, attempt counts, comparisons with
  other people, detailed usage histories, or identifying profiles. Progress
  never leaves the device; the local backup is the responsibility of whoever
  manages the device (see `/settings/`). Progress is not synced to the cloud
  nor cross-referenced between devices.

### 3.6 Universal accessibility

- Buttons ≥ 64×64 px, spacing ≥ 16 px
- WCAG AA contrast minimum
- Audio **only when gamification or the activity design requires it** (e.g. hearing what is typed on the keyboard, listening to a sequence). Not a blanket rule.
- Complete keyboard navigation
- Respects `prefers-reduced-motion`
- Maximum 4–6 options per screen
- Compatible with screen readers (ARIA)

### 3.7 Train through daily-life simulation whenever possible

Activities are **training tools**, not exercises isolated from real life. As
far as the therapeutic goal allows, each activity is built as a **daily-life
simulation**: a recognisable scene (kitchen, shop, street, a chat, a morning
routine, an emergency) in which the person makes a **decision** and sees its
**immediate consequence** in the safe space of the app. Simulation is the
**vehicle**; the underlying pedagogical principle is **meaningful learning**
(in the Ausubel–Novak sense): practice is anchored in what the person
already knows and is closed with an explicit transfer to their daily life,
so what is trained is actually retained and used outside the app.

This applies to all forms the catalogue already uses:

- **Scene + decision** (e.g. `situations`, `what-first`, `what-do-i-need`,
  `where-to-store`, `emergencies`, `street`).
- **Safe dialogue / chat** (e.g. `safe-chat`, `post-or-not`, `bullying-chat`).
- **Step-by-step routine** (e.g. `routines`, `house`, `task-list`, `my-agenda`).

The mandatory anatomy of a simulation round is:

1. **Context**: a recognisable scene (image + short sentence in
   `instruccion`) anchors the practice in daily life and in the prior
   knowledge the person already has at home.
2. **Decision**: 3–6 large options the person can act on.
3. **Consequence with feedback**: `App.feedback.success()` celebrates the
   good choice; `App.feedback.encourage()` accompanies the wrong one
   without scoring it as an error.
4. **Socratic help**: first mistake → `mostrarPista()`; second mistake →
   `mostrarExplicacion()` (rule 12 of [`technical.md`](technical.md) §5).
5. **Transfer**: a closing line connects what was practised to the
   moment of the day it will be useful in (the `transferencia` string)
   — this is what turns a simulated round into meaningful learning.

In addition, every activity must obey the four **meaningful-learning
anchors** when designing its content:

- **Everyday vocabulary**: words and pictograms the person already uses
  at home (bread, t-shirt, dog) — never clinical or taxonomic
  vocabulary in the UI.
- **Connected to their life**: stimuli drawn from the person's actual
  environment (a nearby shop, a real morning routine), not abstract
  examples.
- **Light personalisation where appropriate**: a stable avatar or a
  name field increases ownership of what was learned
  (see `tools/piano-keys/`).
- **Spaced practice**: `localStorage` saves the level reached; the
  landing suggests resuming that level rather than a random one.

Pure drills (no scene, no transfer, no anchors) are allowed only when the
therapeutic goal makes the contextualisation impossible or confusing, and
that exception must be justified in `team/index.html`.

#### 3.7.b Design decision: pure-skill training

The product **explicitly** recognises a second vehicle alongside
simulation: **pure-skill training** (sequential memory, fine motor
skills, logic, puzzles, spatial perception). It is a **prioritised
design decision**, not an exception to justify case by case.

Operational difference between the two vehicles:

| | Simulation (3.7) | Pure skill (3.7.b) |
|---|---|---|
| Preferred vehicle | Yes — the product prefers simulation whenever the therapeutic goal allows it | Valid, not equivalent; occupies a justified second plane |
| Stimulus that **is** the context | A recognisable scene | The stimulus itself (piano, grid, pieces, sequence) **is** the context |
| When prioritised | When there is a daily-life decision worth training | When the goal **is** the skill (memory, motor, logic) without a plausible daily-life decision |
| Contract | Complete: `contexto` + `instruccion` + `pista` + `explicacion` + `transferencia` + feedback + Socratic wiring | Relaxed: `contexto` and `transferencia` when they add value; `pista` and `explicacion` when they add value; **feedback** (`success` + `encourage`) **always**; documented as a prioritised decision in `team/index.html` |
| Documented as | Default coverage | Prioritised design decision (not "exception") |

Activities in the catalogue that use this vehicle: `blocks`, `builders`,
`catch`, `coloring`, `connect-dots`, `differences`, `ecos`, `emotions`, `fit`,
`pairs`, `path`, `piano-keys`,
`tracing`, `turns-mirrors`, `where-is`.

> Forcing a scene where the stimulus is already the context saturates
> the screen and breaks accessibility rule 10 (maximum visible options).
> The product **rejects** forced simulations: adding a decoration to a
> pure-skill activity to "comply with the contract" is an antipattern.
> See §6, row "Does not design activities as forced simulations".

### 3.8 Persuasive communication in service of learning

Beyond the simulation vehicle and the meaningful-learning anchors, every
activity must communicate **in service of the person, never in service of
pressure**. Concretely, every activity must apply the eight
communication disciplines listed below. The full operational guidance
lives in [`creating-elements-guide.md` §5 and §6](creating-elements-guide.md);
this section just elevates them to a non-negotiable product layer.

1. **Didactic and explicit** — the goal of each screen is announced in
   one short sentence in `instruccion`; an example / modelled step is
   shown before the first round; a permanent "see hint" button is
   available (`creating-elements-guide.md` §5.1).
2. **Art effects with care** — animation is used to **guide the gaze**,
   not to decorate: intentional and slow (≥ 300 ms), only one element
   moves at a time, disabled with `prefers-reduced-motion`, soft
   reinforcement on success, **no flashing, no invasive fireworks**
   (§5.4).
3. **Warm micro-narrative (storytelling)** — each activity sits in a
   real-life scene (kitchen, shop, park); the closing screen
   optionally adds one sentence connecting what was learned to a
   moment of the day (§5.6). The story **must not** add mandatory
   screens nor delay practice.
4. **Good copy** — short sentences (≤ 12 words), active voice, second
   person, positive imperatives, no sarcasm, no double meanings,
   TTS-friendly (§5.5).
5. **Clear call to action** — one visible CTA per screen, imperative
   verb, celebratory closing CTAs that **invite to play again or go
   back to the menu**, never to "share score" or "unlock the next
   challenge" (§5.7).
6. **Gamification in moderation** — progressive stars (1 → 2 → 3 ⭐ by
   level, never subtracted), visual achievements, micro-celebrations
   via `App.feedback.success()`, **no leaderboards** (§5.3, `SPEC §3.1`).
7. **Ethical neuromarketing** — the seven keys in §6.1 of the guide
   (less is more, capture the gaze, touch to believe, metaphors work,
   novelty attracts attention, use the senses, relax and good humour)
   used to **hold attention and anchor concepts**, never to sell.
8. **Explicitly forbidden marketing patterns** — the following
   patterns are part of the "pressure" we ban and **must not** appear
   anywhere in the app:
   - **Scarcity**: "Only 1 left!", "Last chance", "Hurry", countdowns,
     disappearing rewards.
   - **False urgency**: timers, racing, "ends soon", punisher for
     being slow (clashes with `§3.2`).
   - **Social proof turned into pressure**: leaderboards, ranks,
     comparisons with other people, "others already did it" social
     pressure (clashes with `§3.1`, `§6`).
   - **Sunk-cost / FOMO**: "you'll lose your progress if you stop",
     "don't miss the streak", forced retention messaging
     (clashes with `§3.2`).
   - **Manipulative reciprocity / dark patterns**: forced signups,
     pre-checked boxes, hidden costs, fake alerts.
   - **Exploitative loss aversion**: "you had 5 ⭐, you lost 2".
     Stars are only ever added (`§3.1`).

The default in Routime is the **calm, autotelic** posture described
in `creating-elements-guide.md` §6.7 — the user practices because
the activity is engaging, not because they are being pushed.
---

## 4. Design principles

These principles **rule over any other decision**. If a task conflicts with them,
the principles win. They are the product's compass.

1. **Easy reading**: short sentences, one idea per sentence, everyday vocabulary, no metaphors.
2. **One action per screen**: the user should never have to choose between more than 4–6 visible options at once.
3. **Large touch targets**: buttons minimum **64×64 px**, minimum spacing 16 px.
4. **Large typography**: 20 px base, 28–36 px titles, legible font (Atkinson Hyperlegible or Nunito).
5. **Light theme by default** with high contrast (WCAG AA minimum, AAA whenever possible).
6. **Audio only when it serves a purpose**: audio (🔊 button, Web Speech API, es-ES / en-US, speed 0.9) is used only for gamification or when the activity design requires it (e.g. hearing what is typed on the keyboard, listening to a sequence). It is not applied by default to every important text.
   - **Yes, when the audio adds something the user can't get otherwise**:
     a new word or expression the user is learning to pronounce
     (vocabulary, spelling, dictionary, word of the day); an audio prompt
     the user has to act on (a sequence to remember, what they just typed
     or played, the operation to compute, the case to decide on); a
     non-visible spoken cue (breathing rhythm in a calm exercise, an
     octave label while exploring a piano).
   - **No, when the audio just repeats text already on screen**: do not
     auto-play feedback messages, "well done / try again" lines, the
     visible explanation after an exercise, the routine's solution text,
     or the on-screen status of a game. If a user wants the audio, they
     can use a 🔊 button next to that specific text — but never by
     default, because it forces the user to read **and** listen at the
     same time, which is tiring and slows down the activity.
7. **No pressure**: no visible timers, no negative scoring, no "game over".
8. **Immediate positive reinforcement**: visual + sound celebration on correct answer (≤ 2 s).
9. **`prefers-reduced-motion`**: all animations are disabled if the system requests it.
10. **Autonomy**: works offline (PWA), no login, no cost, no personal data.
11. **Train through daily-life simulation**: every activity that can be contextualised is built as a recognisable scene (kitchen, shop, street, chat, routine, emergency) in which the person makes a decision and sees its consequence in the safe space of the app. Practice always closes with a **transfer** sentence that anchors what was trained to a moment of the day. When the therapeutic goal is to train a pure skill (memory, fine motor, logic, puzzles, perception), the product uses the **pure-skill** vehicle declared in §3.7.b as a prioritised design decision — **not** as an exception.
12. **Persuasive communication in service of learning**: every activity is highly didactic (visible goal, modelled example, scaffolding), applies art effects with care (slow, single-element, respects `prefers-reduced-motion`, no flashing), uses a warm micro-narrative, clear copy, a clear call to action and gamification in moderation — and **never** uses scarcity, false urgency, social-proof pressure, FOMO, dark patterns or loss aversion. The full list of forbidden patterns lives in `§3.8`. The user practices because the activity is engaging, not because they are being pushed.

---

## 5. Success criteria

A change in Routime is considered successful when:

1. **Maintains autonomy**: the user can continue using the app without external help for that activity
2. **Is accessible**: complies with WCAG AA and the 13 rules in `technical.md` §5
3. **Doesn't introduce pressure**: no new counters or punishments
4. **Works offline**: the app keeps being usable without connection
5. **Respects privacy**: no new personal data is collected
6. **Maintains ES/EN parity**: any new text appears in both languages
7. **Doesn't break existing activities**: existing activities keep working the same
8. **Trains through simulation or pure skill, depending on the goal**: new activities (or major redesigns) pick between the simulation vehicle (§3.7, preferred when applicable) and the pure-skill vehicle (§3.7.b, prioritised design decision). In both cases the content must respect the meaningful-learning anchors (§3.7) and close the round with a `transferencia` line when it adds value.
9. **Communicates persuasively at the service of learning**: every activity is highly didactic, uses art effects with care, warm micro-narrative, good copy, a clear call to action and gamification in moderation — and avoids the forbidden marketing patterns of `§3.8` (scarcity, false urgency, social-proof pressure, FOMO, dark patterns, exploitative loss aversion).

---

## 6. What Routime does NOT do

Explicit decisions that may surprise — they're here so they aren't "suggested"
in the future:

| Doesn't | Why |
|--------|-----|
| Has user accounts | Privacy and simplicity |
| Stores data in the cloud | Privacy and offline-first |
| Has rankings or comparisons | No pressure, no frustration |
| Uses push notifications | Doesn't introduce pressure or external dependencies |
| Has in-app purchases | It's free and will remain so |
| Shows advertising | Public funding / non-profit |
| Collects analytics | Privacy |
| Has chatbot or generative AI | Determinism, accessibility, predictability |
| Uses social networks | Privacy and focus |
| Works on gross motor skills or postural coordination | Requires physical space and in-person support |
| Offers real-time teamwork | The application is individual and does not connect multiple people |
| Automatically assesses oral expression | Speech recognition is not reliable enough for assessment |
| Designs activities as isolated drills without real-life context | The product trains through daily-life simulations (§3.7, principle 11) or through pure-skill training declared as a prioritised design decision (§3.7.b). Neither vehicle is an "exception" |
| Designs activities as forced simulations when the therapeutic goal is to train a pure skill | Forcing a scene where the stimulus is already the context saturates the screen and breaks accessibility rule 10; the product rejects the antipattern (see §3.7.b) |
| Uses scarcity, false urgency or FOMO messaging ("only 1 left", "hurry", "don't lose your streak") | Pressure; clashes with `§3.1`, `§3.2` and principle 12 (forbidden patterns in `§3.8`) |
| Uses social-proof pressure (leaderboards, ranks, "others already did it") | Pressure and discouragement; clashes with `§3.1` and `§6` |
| Uses dark patterns (forced signups, pre-checked boxes, hidden costs, fake alerts) | Trust and accessibility; clashes with `§3.4` and principle 12 |
| Subtracts stars or progress as punishment | The product only adds, never subtracts (`§3.1`, principle 7) |

---

## 7. How this document is organized

This SPEC.md is the **product definition**: WHAT, FOR WHOM and WHY.
The rest of the documentation covers the HOW:

Further information, see map of all documentation | [`index.md`](index.md) |
