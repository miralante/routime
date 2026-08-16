# Routime

> 🌐 **Other languages:** [Español](README.es.md)

Multi-language web application for occupational therapy activities for people with
intellectual disability. Designed to be used autonomously, in the browser,
free of charge and without personal data.

- 🌐 **App**: [routime.apptonomia.uk](https://routime.apptonomia.uk)
- 📦 **Repository**: [github.com/miralante/routime](https://github.com/miralante/routime)
- 💻 **Run locally**: see [`doc/en/quick-guide.md`](doc/en/quick-guide.md) §1 — download the ZIP and double-click `site/index.html`, or use `python -m http.server 8080` for the full PWA experience.

---

## 👥 Roles in the project

Routime has three differentiated roles — end user, support, and
construction — each with its own space and its own entry point. See
[`doc/en/roles.md`](doc/en/roles.md) for who they are, how they participate,
and where each one should look first.

Routime is the PWA shell that wraps several sibling experiences.
The site you land on (`site/index.html`) is itself the **Apptonomia
landing** — one more project in the sibling group, presented here
because Apptonomia was the original product this repo grew out of.

---

## 📚 Documentation

All project documentation lives in the `doc/` folder:

| Language | Entry point |
|---|---|
| 🇪🇸 Español | [`doc/es/indice.md`](doc/es/indice.md) |
| 🇬🇧 English (this file) | [`doc/en/index.md`](doc/en/index.md) |

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
| **Routime** *(this repo — PWA shell + Apptonomia landing)* | Occupational therapy shell and landing; 7 modules, 68 activities | [github.com/miralante/routime](https://github.com/miralante/routime) |
| **Apptonomia landing** *(ships inside this repo under `site/`)* | The original OT landing page — the entry experience for end users | [github.com/miralante/routime/tree/master/site](https://github.com/miralante/routime/tree/master/site) |
| Calculia | Math and logical reasoning: 12 activities | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| Memofun | Flashcards built around meaningful learning | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| Okeymoney | Personal finance and everyday autonomy | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| Sinonimia | Plain-language dictionary (easy-read) | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| Teclatlon | Touch-typing with a physical keyboard | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

This repo's [`CLOUDFLARE.md`](CLOUDFLARE.md) is the canonical deploy
guide for the whole group; each sibling repo has its own
project-specific doc that links back here.

