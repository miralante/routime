# Guide to creating activities / tools

> **How to design and build a new activity in Routime, applying the
> product rules in [`SPEC.md`](SPEC.md) §3, the 13 accessibility rules
> in [`technical.md`](technical.md) §5, the technical recipe in §9,
> and a set of **didactic**, **gamification**, **persuasion** and
> **neuromarketing** techniques adapted for people with intellectual
> disability.
>
> This document **does not replace** [`technical.md`](technical.md): if
> a rule here clashes with the canonical technical source, the
> technical source wins. This guide adds the **pedagogical,
> communicative and emotional** layer that `technical.md` does not
> cover.

---

## 1. Principles that are never broken

Before you create anything, read and keep in mind:

| Document | What to remember |
|---|---|
| [`SPEC.md` §3.1](SPEC.md) | Mistakes never punish; a hint comes before the answer (Socratic method). |
| [`SPEC.md` §3.2](SPEC.md) | No visible timers, no time pressure. |
| [`SPEC.md` §3.3](SPEC.md) | Easy Reading always. |
| [`SPEC.md` §3.4](SPEC.md) | No personal data; progress only in `localStorage`. |
| [`SPEC.md` §3.5](SPEC.md) | Universal accessibility. |
| [`technical.md` §5](technical.md) | The **13 mandatory rules** (summarised in §3 of this guide). |
| [`technical.md` §9](technical.md) | Technical recipe for building the activity. |

---

## 2. How an activity should be

An Routime activity must be **autonomous** (usable without a
professional present), **emotionally safe**, **progressive** (one new
variable per level) and **meaningful** (what is practised connects to
daily life).

### 2.1 Mandatory traits

1. **Clear didactic goal**: each screen has **one idea** and one
   explicit goal in everyday language.
2. **Socratic**: the answer is never given directly. First mistake →
   `mostrarPista()`; second mistake → `mostrarExplicacion()` (see
   [`technical.md` §9 step 3](technical.md)).
3. **Gamified in moderation**: positive reinforcement, no punishments,
   no "game over", no subtracting points. Stars are added, never
   removed.
4. **Concrete**: the person knows what they did right without having
   to interpret abstract messages.
5. **Repeatable**: progress is saved in `localStorage` and the round
   is randomised so practice does not run out.
6. **Persistent and minimal**: only `estrellas` and `completados` are
   saved, plus — as a justified exception — a **short history without
   personal data** (≤ 30 days, e.g. `tools/emotions/` saves
   `[{fecha, idEmocion}]` to avoid repeating questions). Never save
   mistakes, times, attempts or identifiable data.

### 2.2 What the activity **must not** do

- Say **"incorrect"** or **"you got it wrong"** → use
  `App.feedback.encourage()`.
- Show **timers** on screen, nor visibly measure time.
- Ask for **personal data** or send anything to the internet.
- Use **clinical language** in the UI (see [`SPEC.md` §3.3](SPEC.md)).
- Saturate the screen: maximum 4–6 options (§5 rule 10) and 3 options
  in a quiz (rule 11).

### 2.3 The activity is a daily-life simulation whenever possible

Per [`SPEC.md` §3.6 and principle 11](SPEC.md), an Routime activity is
not an abstract drill: it is **training through simulation**. As far as
the therapeutic goal allows, every activity is built around a
recognisable scene in which the person makes a decision and sees its
consequence in the safe space of the app.

Simulation is the **vehicle**; the pedagogical principle that turns a
simulated round into something the person actually retains and uses
outside the app is **meaningful learning** (Ausubel–Novak), detailed in
§5.8 of this guide. Concretely, the simulation contract (context →
decision → consequence → socratic help → transfer) becomes meaningful
learning when the activity also obeys the four **meaningful-learning
anchors**: everyday vocabulary, stimuli connected to the person's life,
light personalisation when appropriate, and spaced practice via
`localStorage`. Those four anchors are spelled out in [`SPEC.md` §3.6](SPEC.md).

The **four** mechanical patterns the product recognises — and which any new
activity should pick from — are:

| Pattern | When to use it | Example in the catalogue |
|---|---|---|
| **Scene + decision** | The therapeutic goal is choosing well in a moment of daily life. | `situations`, `what-first`, `what-do-i-need`, `where-to-store`, `emergencies`, `street` |
| **Safe dialogue / chat** | The therapeutic goal is what to say or write in a social or digital context. | `safe-chat`, `post-or-not`, `bullying-chat` |
| **Step-by-step routine** | The therapeutic goal is the order of a real task (morning, kitchen, shopping, going out). | `routines`, `house`, `task-list`, `my-agenda` |
| **Pure-skill training** | The therapeutic goal **is** the skill (sequential memory, fine motor, logic, puzzles, perception). The stimulus is already the context: the piano, the grid, the pieces, the sequence. | `piano-keys`, `tracing`, `fit`, `visual-sudoku`, `tic-tac-toe`, `pairs`, `connect-dots` |

Simulation (the first three patterns) is the **preferred vehicle** when
the goal allows it. The fourth pattern — **pure-skill training** — is a
prioritised design decision of the product (see
[`SPEC.md` §3.6.b](SPEC.md)): it is not an exception to justify case by
case. Forcing a scene where the stimulus is already the context saturates
the screen and breaks accessibility rule 10 (maximum visible options).

Every round — whether simulation or pure skill — must honour, when they
add value, the 1-5 points of the anatomy below. The Case B contract only
relaxes `pista` and `explicacion` when the activity has no "correct
answer" to explain (e.g. `builders` or `piano-keys` in free mode).

Every round must follow this 5-step anatomy:

1. **Context** — a pictogram or background image + a short `instruccion`
   sentence that says where we are and connects with what the person
   already knows ("You are at the supermarket. Pick what you need
   first.").
2. **Decision** — 3–6 large options the person can act on (rule 10/11).
3. **Consequence with feedback** — `App.feedback.success()` on the good
   choice; `App.feedback.encourage()` on the bad one. Never score the
   bad choice as an error.
4. **Socratic help** — first mistake → `mostrarPista()`; second
   mistake → `mostrarExplicacion()` (rule 12).
5. **Transfer** — the round ends with a `transferencia` line that
   anchors what was practised to a moment of the day it will be useful
   in ("This will help you the next time you go shopping.").

Pure abstract drills (no scene, no `transferencia`, none of the four
anchors) are allowed only when the goal makes contextualisation
impossible or confusing. In that case the activity follows the
**pure-skill vehicle** declared in [`SPEC.md` §3.6.b](SPEC.md) and is
documented in `team/index.html` as a **prioritised design decision**, not
as an exception.

### 2.4 The activity communicates persuasively in service of learning

Beyond the simulation vehicle (§2.3) and the meaningful-learning anchors
(in [`SPEC.md` §3.6](SPEC.md) and §5.8 of this guide), every activity
must also communicate well. This is the third non-negotiable layer,
elevated to a product principle in [`SPEC.md` §3.7 and principle 12](SPEC.md).
The full operational details live in §5 and §6 of this guide
(didactic, art effects, storytelling, good copy, CTAs, gamification,
ethical neuromarketing). The summary that every activity must satisfy:

| Discipline | One-line rule | Guide section |
|---|---|---|
| Didactic | Visible goal + modelled example + permanent "see hint" button. | §5.1 |
| Art effects with care | Slow (≥ 300 ms), single-element, no flashing, respects `prefers-reduced-motion`. | §5.4 |
| Storytelling | Warm micro-narrative; closing line connects learning to a moment of the day. | §5.6 |
| Good copy | ≤ 12 words, active voice, second person, positive, TTS-friendly. | §5.5 |
| Clear CTA | One visible CTA per screen; closing CTAs invite to play again / back to menu, **never** share score or unlock the next. | §5.7 |
| Gamification in moderation | Progressive stars (1 → 2 → 3), added never subtracted, no leaderboards. | §5.3 |
| Ethical neuromarketing | The seven keys used to anchor attention and concepts, never to sell. | §6.1, §6.2 |

**Forbidden by [`SPEC.md` §3.7](SPEC.md)**: scarcity, false urgency,
social-proof pressure, sunk-cost / FOMO, manipulative reciprocity /
dark patterns, exploitative loss aversion. Pressure is not a
persuasion technique in Routime — engagement is.

---

## 3. Quick checklist of the 13 accessibility rules

Operational summary (full source: [`technical.md` §5](technical.md)):

| # | Rule | How to verify it |
|---|---|---|
| 1 | Easy Reading | Short sentences; one idea per sentence; no jargon. |
| 2 | Buttons ≥ 64×64 px, gap ≥ 16 px | Measure the `.btn` in the activity with DevTools. |
| 3 | High contrast WCAG AA | Check the module colour against `--color-superficie`. |
| 4 | Audio only when gamification or the activity design requires it | 🔊 button with `App.tts.speak()` **only** where the activity calls for it (e.g. hearing what is typed on the keyboard, listening to a sequence). Not applied to every `data-i18n`. |
| 5 | No pressure | Zero timers; zero "game over". |
| 6 | Positive reinforcement | `App.feedback.success()` on a correct answer. |
| 7 | `prefers-reduced-motion` | Animations are reduced or removed in that mode. |
| 8 | Full keyboard | `Tab` navigates, `Enter` activates, focus is visible. |
| 9 | ARIA | `aria-label` on icon buttons and `role`/`aria-live` on feedback. |
| 10 | Max 4–6 options | Count `<button>` per game screen. |
| 11 | Quiz: 3 options + explanation | Check the quiz `data.js`. |
| 12 | Socratic method | `intentos` counter → hint on 1, explanation on 2. |
| 13 | Gradual progression | Each level changes **one single variable**. |

> **Known and legitimate exceptions**: rule 12 admits a **third
> auto-resolution step** only in puzzles with direct physical
> manipulation (see `tools/fit/app.js:223-225`: "La pieza encaja así.
> Ya está colocada") to comply with rule 11 ("nobody gets stuck").
> This step documents the piece as already placed and is accepted as
> final help, not as silent correction.

---

## 4. Step-by-step design

Follow this order **before** touching code. Skipping steps usually
ends up refactoring later.

### Step 1 · Define the therapeutic goal

Answer in one sentence:

> *"With this activity the person will practise ______ in order to
> ______ in their daily life."*

Examples (real ones from the catalogue):

- "Practise **classifying words by semantic category** to handle
  everyday conversations better" (`tools/categories/`).
- "Practise **anticipating the other player's move** to play a fair
  turn-based game" (`tools/tic-tac-toe/`).
- "Practise **following a morning routine** to gain autonomy when
  getting ready alone" (`tools/routines/`).

If the goal cannot be stated like this, rethink it. An activity
without a clear goal becomes a game without learning.

### Step 2 · Pick the module and review coverage

Open [`team.md`](team.md) and check whether the area is already
covered and where. Do not duplicate: if a very similar activity
already exists, **improve it** instead of creating a new one.

### Step 3 · Write the mechanic in words

Before HTML, describe in 5–10 lines:

1. What does the person see on entry?
2. What do they have to do?
3. How do they know they got it right?
4. What happens if they fail?
5. When does the round end and what do they feel at the end?

If the mechanic cannot be understood in writing, it will not be
understood on screen.

### Step 4 · Design the progression (rule 13)

Each level **changes one single variable** from the previous one.
Pick the variable before touching `data.js`:

- **Quantity**: level 1 has 2 categories, level 2 has 3, level 3
  keeps 3 and tightens the semantic difficulty.
  (Example: [`tools/categories/data.js`](../../tools/categories/data.js).)
- **Size of the stimulus**: number of pieces, digits, word length.
- **Exposure time**: how many things are visible at once.
- **Type of distractors**: how "similar" the options are to each
  other.

Never change **two** variables at once: the person will not know
which one was harder, and they will get frustrated.

### Step 5 · Think about the data bank

- At least **25 cases** for simulations/training (see
  [`technical.md` §7](technical.md)).
- Data in `data.js` (`var DATA = { es: {...}, en: {...} }`),
  **never** UI text in `data.js`.
- Same pictograms in both languages; only the word changes.

### Step 6 · Write the texts (`strings.<locale>.js`)

- Sentences of **max 12 words** in `instruccion`.
- One idea per sentence in `pista` and `explicacion`.
- Warm tone, second person ("Tap", "Look", "Find").
- Avoid negative imperatives ("Don't tap here").
- Emojis only when they **accompany** text that also makes sense
  without them (not everyone distinguishes every emoji; some are
  read poorly by TTS).

### Step 7 · Implement the logic with the Socratic pattern

Copy the pattern from
[`tools/categories/app.js`](../../tools/categories/app.js) around
lines 120–160: an `intentos` counter, `mostrarPista()` on the first
mistake, `mostrarExplicacion()` on the second. **Never** give the
correct answer on the first mistake.

### Step 8 · Audio and feedback

- Use `App.tts.speak(...)` **only** when gamification or the
  activity design requires it (e.g. hearing what is typed on the
  keyboard, listening to a sequence). Do **not** add it to every
  screen by default.
  - **Use audio for** content the user can't otherwise perceive:
    new words the activity is teaching to pronounce
    (`vocabulary`, `dictionary`, `spelling`, `colored-spelling`),
    an audio prompt the user must act on (a sequence to
    remember, the case to decide on, what was just typed or
    played), and non-visible spoken cues (breathing rhythm in
    `calm` / `emotions`, an octave label in `piano-keys`).
  - **Don't auto-play audio for** text that is already visible on
    screen: success / encouragement feedback, the explanation
    shown after an exercise, the solution text of a routine,
    the on-screen game status. If the user wants that text read
    out, expose a 🔊 button next to the specific block — never
    trigger it by default, because simultaneous reading +
    listening tires the user and slows the activity down.
- `App.feedback.success(el)` on a correct answer.
- `App.feedback.encourage(el)` on a mistake (an **encouragement**
  message, not an error one).

> **Canonical exceptions** — activities whose design justifies a 🔊
> button on the instructions / cases screen. New activities should
> **not** add a generic "listen to instructions" 🔊; only join this
> list with a justified PR (open an issue with the `UX` label):
>
> - `piano-keys` — hears what the user plays
> - `my-agenda` — hears the planned tasks
> - `sexual-health` — hears the case to decide on
> - `social-safety` — hears the situation to decide on
> - `colored-spelling` — hears the word to spell
>
> `routines` does **not** have a 🔊 on the step screen (the step
> text on screen is enough) nor on the menu screen.

### Step 9 · Persistence and registration

- Save to `App.storage.get/set('<slug>')` only `estrellas` and
  `completados` (contract in [`technical.md` §7](technical.md)).
- Register the activity in the **6 canonical points** listed in
  [`technical.md` §9 step 8](technical.md).

### Step 10 · Verify

Run before closing the task:

```bash
node scripts/check.js
node scripts/smoke.js
```

If the activity has a simulation bank ≥ 25, also check the §7
contract.

---

## 5. Techniques to apply

### 5.1 Be very didactic

- **Visible goal**: the initial screen says what will be practised
  ("You are going to find the two matching cards").
- **Modelling**: before the first round, show a worked example in
  a slow step with audio.
- **Scaffolding**: offer a permanent "see hint" button, not only
  after a mistake.
- **Reverse scaffolding**: in the first rounds the practice is
  guided (valid options are highlighted, a pointing hand animates
  when `prefers-reduced-motion: no-preference`).
- **Transfer**: end each activity with a screen connecting what
  was practised to real life ("This will help you to…").

### 5.2 Socratic method (rule 12 + a bit more)

The Socratic method in Routime has three levels:

| Moment | What the app shows | Implicit message |
|---|---|---|
| First mistake | `pista` (a question that re-orients thinking) | "You can do it; think again". |
| Second mistake | `explicacion` with the answer and why | "Now you see it; next time you'll do it alone". |
| Correct answer | `explicacionCorrecta` celebrating | "You thought well; that is what matters". |

> Teaching tip: in `pista` **do not** use the word "no" or
> "incorrect". Phrase positively what the person has to look for
> ("Look at the picture; which group does it belong to?" instead
> of "That is not the right box").

> Mandatory mechanic: any mistake locks the remaining untried options with
> `App.feedback.lockUntilAck(buttons, zone)` until the person taps "Got it".
> This forces reading the hint or explanation before trying again — without
> limiting retries — and prevents guessing by elimination instead of thinking.

### 5.3 Gamification

- **Progressive stars**: 1 ⭐ easy → 2 ⭐ → 3 ⭐ by level. Never
  subtract.
- **Visual achievements**: at the end of a round, a final screen
  with the stars earned **and** the running total.
- **Micro-celebrations**: on each correct answer, a small animation
  (`App.feedback.success()` already covers this). Without invasive
  fireworks.
- **Optional challenge**: offer a "play again" button on the final
  screen to repeat with no pressure.
- **No leaderboards**: never compare with other people; it clashes
  with `SPEC.md` §1.1 and §3.4.

### 5.4 Art effects (animation and art with care)

Animations are there to **guide the gaze**, not to decorate. For
people with intellectual disability, badly measured effects
saturate and can distract or trigger sensory discomfort. Apply these
rules:

| ✅ Yes | ❌ No |
|---|---|
| Intentional and slow movement (≥ 300 ms) | Sudden movements or flashing |
| Only one element moves at a time | The whole screen changes at once |
| Animation disabled with `prefers-reduced-motion: reduce` | Animation mandatory to understand the task |
| Reinforcement on correct answer (short scale, soft glow) | Reinforcement every 2 seconds |
| Colours with meaning (correct = soft green, encourage = warm yellow) | Red for errors (the product does not use "incorrect") |

> When in doubt, **do not** animate it. A quiet, clear interface
> is more usable than a flashy one.

### 5.5 Good copy (UI text)

- **Length**: ≤ 12 words per sentence; ≤ 2 sentences per screen.
- **Voice**: active, close, second person. ("Tap the box" / not
  "The box should be tapped").
- **Concrete**: action verbs, not abstract ones.
  ✅ "Look at the word. Tap the box of the correct group."
  ❌ "Identify the corresponding semantic category."
- **Consistent**: if "pista" means X in one activity, it means X
  everywhere.
- **Positive**: whenever possible, say what the person **should**
  do, not what they should not.
- **No sarcasm, irony or double meanings**: `SPEC.md` §3.3
  implicitly forbids it (Easy Reading).
- **TTS-friendly**: avoid abbreviations, Roman numerals without
  context, lone symbols that the engine reads badly.

### 5.6 Storytelling (micro-narrative per activity)

Each activity can have a background mini-narrative without turning
it into a long story:

- **Everyday frame**: set the activity in a real-life scene
  (kitchen, shop, park).
- **Guide character**: if the activity has a mascot/guide, keep
  it stable across levels so the person recognises it.
- **Emotional close**: the final screen may include a sentence
  connecting what was learned to a moment of the day ("Today you
  already know how to classify words. Tomorrow you can help in
  the kitchen putting the shopping away").

> Storytelling **must not** add mandatory screens nor delay
> practice. If reaching the game requires two dialogue screens,
> it is too much.

### 5.7 Call to action (CTA)

In Routime the CTA **is** the action itself ("Tap", "Find",
"Listen"). On top of that:

- **Visible and unique CTA** per screen. If there is a primary
  button, the rest stay visually in the background.
- **Imperative verb**: "Start", "Play", "Again".
- **Celebratory final CTA**: the closing screen always invites
  "Choose another level" or "Back to menu", **never** "share
  score" or "unlock the next challenge".
- **No false urgency**: nothing like "Only 1 left!" or "Hurry".
  It clashes with `SPEC.md` §3.2.

### 5.8 Meaningful learning

This section is the **"how"** behind the simulation contract in §2.3
and [`SPEC.md` §3.6](SPEC.md). The simulation is the **vehicle**;
**meaningful learning** (Ausubel–Novak) is what makes a simulated
round actually stick and transfer to the person's daily life: the new
content is anchored on what the person already knows, and each round
ends with an explicit transfer to a moment of the day it will be
useful in. Without this layer, simulation is just decoration.

Ausubel and Novak talk about **anchoring the new on what the
person already knows**. In practice, every Routime activity should
honour these four **meaningful-learning anchors**:

- **Use everyday vocabulary** that the person already uses at home
  (dog, t-shirt, bread), not technical taxonomies (canine, garment,
  cereal). This also satisfies SPEC §3.3.
- **Connect with their life**: if the activity is about money, use
  real prices from a nearby supermarket; if it is about morning
  routine, use the steps the person actually follows.
- **Allow light personalisation**: letting the person write their
  name or pick a stable avatar increases **ownership** of what was
  learned (see `tools/piano-keys/`).
- **Space the practice**: in `localStorage` you can save the level
  reached; on the landing, suggest resuming that level rather than
  a random one.

---

## 6. Neuromarketing and ethical persuasion

> Neuromarketing is applied **in service of learning**, not to
> sell anything. There is no purchase, no data. The techniques
> here are to **hold attention, spark positive emotion and better
> anchor concepts**, always respecting `SPEC.md` §3 (no pressure,
> no punishment, no data).

### 6.1 The 7 neuromarketing keys applied to Routime

| Key | Concrete application |
|---|---|
| **1. Less is more** | One idea per screen; 3–6 options; one variable per level. |
| **2. Capture the gaze** | One element moving at a time; size/colour to set hierarchy. |
| **3. Touch to believe** | Big buttons, tactile feedback on press, immediate result on correct. |
| **4. Metaphors work** | Pictograms that connect to things the person already knows (a bread 🥖 for "shop", a bed 🛏️ for "rest"). |
| **5. Novelty attracts attention** | A new variant every 3–4 rounds (new pictogram, new colour, new category) **without** breaking rule 13 (one variable progression). |
| **6. Use the senses** | Audio (TTS) + visual (large pictograms) + haptic (big buttons) + emotional colour (soft green for correct, warm yellow for encourage). |
| **7. Relax and good humour** | Warm messages, calm audio, no punishments; celebrate the process, not only the result. |

### 6.2 Ethical persuasion (Cialdini adapted)

| Principle | How it is applied without manipulation |
|---|---|
| **Reciprocity** | The app "gives" encouragement and hints; the person feels accompanied, not pressured. |
| **Commitment** | The person picks a level → commits to their own choice → practises more. |
| **Liking** | Warm and personal messages ("You picked level 2. Let's go!"). |
| **Authority** | The app appears as the therapist's tool, not as a cold authority. |
| **Unity** | The mini-narrative and avatar unite the person with the activity, not with a brand. |

> Persuasion techniques are always used **in service of learning** and
> never to pressure, compare, exclude or create artificial urgency (see
> `SPEC.md` §3.2). Any addition that suggests "you are missing
> something", "you are behind" or "this is ending soon" is discarded.

### 6.3 Concept anchoring

- **Light spaced repetition**: an activity may offer "Review level
  1" as a button after finishing level 3.
- **Coherent multi-sensory stimuli**: if the concept is "apple", the
  pictogram 🍎 + the written word + the audio reading it appear
  **at the same time**. The brain anchors better when it receives
  the same information through several channels.
- **Personal-memory association**: if the person writes their name,
  the avatar or learned word is shown at the end ("Today you
  practised: 🐶 dog, 🐱 cat").
- **Measured contrast**: to teach the difference, one option must
  be clearly distinct and the other reasonably similar (example:
  "dog" vs "cat" is harder than "dog" vs "🍞").

### 6.4 Optimising retention and interest

- **Positive surprise, never negative**: introduce a new visual
  element on the final screen every few sessions (a cat that
  appears and says "Well done!" — not a failure that scares).
- **Variable reinforcement**: not always the same "Very well!"; use
  the `feedback.success` array of `App.i18n` to vary.
- **Invisible progression**: the person should not feel that level
  2 is "harder", but "more interesting".
- **Progress without marking regression**: never show "you lost what
  you had"; always "now you have X stars" without subtracting.

### 6.5 Calling the senses without saturating

| Sense | Stimulus | Limit |
|---|---|---|
| Sight | Pictogram + colour + text + large button | ≤ 6 visual elements per screen |
| Hearing | TTS audio + soft success sound | One sound at a time; respectful volume |
| Touch | Button ≥ 64 px + feedback on press | No intrusive vibration |
| Taste/smell | Not applicable | — |

> The cognitive and sensory limitation of the end user is the
> **raison d'être** of the product. Any design decision that
> increases sensory load without a clear learning gain goes
> against `SPEC.md`.

### 6.6 Appealing to emotions and desires

- **Target emotion**: pride, belonging, safety, curiosity.
  **Avoid**: shame, fear, rush.
- **Basic desires**: autonomy (doing it alone), competence (I am
  managing it), recognition ("today I got 3 ⭐").
- **Micro-emotions**: a happy face on correct answer, a thinking
  face with "🤔 Try again" on mistake. **Never** a sad face.

### 6.7 Being innovative

- Innovate **within** the 13 rules, not against them.
- Test new mechanics with an **MVP of one level** before extending.
- Ask families/therapists to test (see
  [`CONTRIBUTING.md`](../../CONTRIBUTING.md)) when the mechanic is
  non-standard.

---

## 7. Templates

### 7.1 `pista` template (1 positive sentence)

```
🤔 Look at the picture. Which group does {word} belong to?
```

### 7.2 `explicacionCorrecta` template

```
✅ Correct! {word} goes in that group.
```

### 7.3 `explicacionIncorrecta` template

```
❌ {word} goes in: {correctCategory}.
```

### 7.4 Final screen

Two optional paragraphs: the **achievement** and the **transfer**.

```html
<p id="resumenFinal"></p>
<p id="transferencia" class="transferencia" data-i18n="transferencia"></p>
```

```js
/* Achievement: how many stars were won. */
$('#resumenFinal').textContent =
  App.i18n.t('resumenFinal').replace('{n}', n).replace('{total}', total);

/* Transfer: anchor what was learned into daily life. */
$('#transferencia').textContent = App.i18n.t('transferencia');
```

**i18n keys** (same name in ES and EN):

```json
"resumenFinal": "You earned {n} stars. You now have {total} stars.",
"transferencia": "This will help you to {dailyLifeTransfer}."
```

Transfer sentences already used in the catalogue:

- `tools/routines/`: "Now you can do it on your own. It will help you today and tomorrow."
- Generic template: `"What you practised will help you with {dailyLifeTransfer}."`

### 7.5 Goal template in `instruccion`

```
{Imperative verb} {direct object}. {Short amplifying sentence}.
```

Good examples:

- 🃏 "Find the two matching cards."
- 🗂️ "Look at the word. Tap the box of the correct group."
- 🧮 "Add the numbers. Tap the result."

### 7.6 Daily-life simulation round template

Use this template whenever the activity is built as a daily-life
simulation (per [`SPEC.md` §3.6](SPEC.md) and §2.3 of this guide):

```js
// 1) Context (i18n keys: contexto, instruccion)
App.tts.speak(App.i18n.t('contexto') + ' ' + App.i18n.t('instruccion'));

// 2) Decision: 3–6 options rendered as .btn-opcion
opciones.forEach(function (op) { /* render button */ });

// 3) Consequence with feedback
boton.addEventListener('click', function () {
  if (correcto) {
    App.feedback.success(el);
  } else {
    intentos++;
    if (intentos === 1) mostrarPista();        // rule 12
    else if (intentos >= 2) mostrarExplicacion();
    App.feedback.lockUntilAck(opciones, explicacionWrap); // reading pause
  }
});

// 5) Transfer (closing screen, both locales)
$('#transferencia').textContent = App.i18n.t('transferencia');
```

Required i18n keys (one string per locale):

| Key | Purpose | Example (EN) |
|---|---|---|
| `contexto` | One sentence that places the person in the scene. | "You are at the supermarket." |
| `instruccion` | The action to take in that scene. | "Tap what you need first." |
| `transferencia` | Closing line that anchors practice to real life. | "This will help you the next time you go shopping." |

Good examples in the catalogue: `tools/situations/`, `tools/emergencies/`,
`tools/safe-chat/`, `tools/routines/`.

---

## 8. Frequent mistakes

| Mistake | Why it is a problem | Solution |
|---|---|---|
| Saying "incorrect" | Clashes with `SPEC.md` §3.1 | Use `App.feedback.encourage()`. |
| Giving the answer on the first mistake | Breaks rule 12 and the Socratic method | Show `pista` first. |
| Leaving the other options active after a mistake | Lets people guess by elimination instead of thinking | Call `App.feedback.lockUntilAck()` on every mistake. |
| Changing two variables between levels | Breaks rule 13 and frustrates | Change **only one**. |
| Condescending tone ("Great job, champ!") | Infantalises | Close but dignified tone: "You did very well!". |
| Saturating the screen | Visual fatigue, worse learning | 3–6 elements, one idea. |
| Visible timer | Breaks `SPEC.md` §3.2 | No clock on screen. |
| Clinical text in UI | Breaks `SPEC.md` §3.3 | Only in `team/` and in `doc/`. |
| Compromising `localStorage` with personal data | Breaks `SPEC.md` §3.4 | Only `estrellas` and `completados`. |
| Forgetting TTS on `instruccion` | Breaks rule 4 | `App.tts.speak()` on entry. |
| Forgetting `data-i18n` and hardcoding in HTML | Breaks language parity | Every string in `strings.<locale>.js`. |

---

## 9. Before committing

Final checklist (combines [`technical.md` §9](technical.md) with this
guide):

- [ ] The therapeutic goal is explained in one sentence (Step 1).
- [ ] The mechanic is understood in writing before seeing the screen
      (Step 3).
- [ ] Each level changes **one single** variable (rule 13).
- [ ] Data bank ≥ 25 cases if it is a simulation
      (`technical.md` §7).
- [ ] The activity is built as a daily-life simulation whenever the
      therapeutic goal allows it: a recognisable scene, a decision,
      immediate consequence with feedback, Socratic help and a
      `transferencia` closing line ([`SPEC.md` §3.6](SPEC.md), §2.3 of
      this guide). If the activity is a pure-skill activity (memory,
      fine motor, logic, puzzles, perception), it is documented in
      `team/index.html` as a **prioritised design decision** of the
      product, not as an exception ([`SPEC.md` §3.6.b](SPEC.md)).
- [ ] The activity also trains **meaningfully**: it uses everyday
      vocabulary from the person's environment, stimuli connected to
      their real life, light personalisation when appropriate (name,
      stable avatar) and spaced practice via `localStorage`
      ([`SPEC.md` §3.6](SPEC.md), §5.8 of this guide). The simulation
      vehicle without these anchors does not produce learning.
- [ ] The activity **communicates persuasively at the service of
      learning**: didactic goal, modelled example, permanent "see
      hint"; art effects with care (slow, single-element, no flashing,
      respects `prefers-reduced-motion`); warm micro-narrative; good
      copy; one clear CTA per screen; gamification in moderation
      ([`SPEC.md` §3.7](SPEC.md), §2.4 of this guide).
- [ ] **No forbidden marketing patterns** appear anywhere in the
      activity: no scarcity, no false urgency, no social-proof
      pressure, no FOMO / "don't lose your streak", no dark patterns,
      no exploitative loss aversion (forbidden list in
      [`SPEC.md` §3.7](SPEC.md)). Engagement comes from the design,
      not from pressure.
- [ ] `pista` and `explicacion` exist in `strings.es.js` **and**
      `strings.en.js`.
- [ ] `App.tts.speak()` is called when entering each game screen.
- [ ] `App.feedback.success()` and `App.feedback.encourage()` are
      wired.
- [ ] First mistake → `mostrarPista()`; second →
      `mostrarExplicacion()`.
- [ ] Every mistake calls `App.feedback.lockUntilAck()` (locks the
      untried options until "Got it" is tapped).
- [ ] Persistence: only `estrellas` and `completados` in
      `localStorage`.
- [ ] Buttons ≥ 64×64 px, gap ≥ 16 px (rule 2).
- [ ] ≤ 6 options per screen; ≤ 3 in quiz (rules 10–11).
- [ ] Animations respect `prefers-reduced-motion`.
- [ ] Activity registered in the 6 canonical points
      ([`technical.md` §9 step 8](technical.md)).
- [ ] `node scripts/check.js` passes without errors.
- [ ] `node scripts/smoke.js` passes without errors.
- [ ] Small commit, message in English.

---

## 10. Cross references

- Product and restrictions: [`SPEC.md`](SPEC.md)
- Technical recipe: [`technical.md` §9](technical.md)
- 13 accessibility rules: [`technical.md` §5](technical.md)
- Activity catalogue: [`activities.md`](activities.md)
- Therapeutic coverage: [`team.md`](team.md)
- Internationalisation: [`I18N.md`](I18N.md)
- Project roles: [`roles.md`](roles.md)
- Contributing (people): [`CONTRIBUTING.md`](../../CONTRIBUTING.md)