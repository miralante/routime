# Cloudflare Workers (static assets) — Routime

> **Production branch & automatic deploy.** Routime deploys
> **automatically on every push to `master`** via the **Cloudflare
> Git connector** configured in the Cloudflare dashboard. The CI
> workflow (`.github/workflows/ci.yml`) runs structural, i18n and
> secrets checks on every push and PR but does **not** deploy. An
> **optional** deploy workflow (`.github/workflows/pages-deploy.yml`)
> exists as a self-hosted fallback: it only runs if the
> `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` GitHub secrets
> are set; otherwise it is a no-op. The recommended path is the
> Cloudflare Git connector, which needs no GitHub secrets.
>
> **This project is deployed as a Cloudflare Worker (static assets),
> not classic Cloudflare Pages**, despite this file's history and
> title below. Confirmed by direct testing: `routime.pages.dev`
> (the URL this file used to call "canonical") does not resolve at
> all, while `https://routime.miralante.workers.dev` returns 200
> with real Cloudflare headers. See the Teclatlon and Sinonimia apps
> of the suite's `CLOUDFLARE.md` for the same correction and how it
> was diagnosed.
>
> **`routime.apptonomia.uk`** is the canonical custom domain and is
> served by this Cloudflare Workers deployment (Firebase Hosting was
> decommissioned; see "Custom domain" below for the history).
>
> **Part of the Miralante suite.** Routime is one of **six apps**
> (Calculia, Memofun, Okeymoney, Routime, Sinonimia, Teclatlon) that
> share the same author and the same Cloudflare deploy story.
> **Apptonomia is the landing portal of the suite, not a runtime
> app**; this repo just happens to also ship that landing under
> `site/`. The canonical group-wide guide lives in
> [Apptonomia's `CLOUDFLARE.md`](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).

**Live URL:** <https://routime.miralante.workers.dev>

Routime is deployed as a **Cloudflare Worker (static assets)**
project, using the Cloudflare Git connector. There is no custom
GitHub Actions workflow that deploys. A `wrangler.toml` is committed
in the repo (name + `[assets]` binding + `not_found_handling =
"404-page"`, see that file for the rationale); the Cloudflare
dashboard owns the build and deploy, the file is kept for parity
with the other apps of the suite and so a local `wrangler deploy`
does the same thing Cloudflare's CI does.

## How it works

1. The repo `miralante/routime` is connected to a Cloudflare
   Workers project named `Routime`.
2. Every push to `master` triggers a build in Cloudflare's
   infrastructure via Workers Builds.
3. The build is a no-op: no `build command`, no `output directory` other
   than `.`, so the static files are served as-is.
4. The `ci.yml` GitHub Action still runs on every push and PR to gate
   structural, i18n and secrets checks, but it does not deploy.

The `Routime.<account-subdomain>.workers.dev` address is assigned
by Cloudflare from the project name `Routime` declared in the
Cloudflare dashboard. The project name is also pinned in
`wrangler.toml` so a local `wrangler deploy` (or a manual CLI
debugging session) sees the same project. The file is the
**Workers + static assets** shape (`[assets] directory = "."`, no
`main`), which is what Cloudflare's current docs recommend for
static sites and what the dashboard project is already configured
as.

## Files in this repository

| File | Purpose |
|---|---|
| `_headers` | Cache and security headers, replaces the old `firebase.json` `headers` |
| `wrangler.toml` | Pins the project name + the `[assets]` binding + `not_found_handling = "404-page"` |
| `.github/workflows/ci.yml` | `node scripts/check.js`, i18n smoke and secrets scan on every push/PR (does **not** deploy) |

No `_redirects`, no `functions/`, no `_routes.json`, no Cloudflare
service-account keys. The dashboard is the source of truth for project
settings; the repo holds the static assets and the CI that gates them.

## Why no `_redirects`?

Cloudflare serves every static file in the repo automatically,
including the implicit `index.html` lookup for any directory: visiting
`/tools/pairs/` resolves to `tools/pairs/index.html`, `/team/` to
`team/index.html`, and so on, without any rewrite rule. Every section
of Routime (`site/`, `tools/<slug>/` for all 68 activities,
`team/`, `about/`, `config/`, `legal/`) ships its own real
`index.html`, so a catch-all rewrite is unnecessary and would in fact
break: the previous version had `/* /index.html 200` (Firebase-era
SPA rewrite) and Cloudflare rejected it with *"Infinite loop detected
in this rule"* because `/index.html` itself matches `/*` and would
re-trigger the rule indefinitely.

The root `/index.html` keeps its `<meta http-equiv="refresh">` to
`site/index.html` as a client-side entry pointer, the same way it did
under Firebase Hosting — that has nothing to do with the server-side
routing and does not cause a loop.

## Why a `wrangler.toml` now?

The project previously did NOT commit a `wrangler.toml` — the rationale
was a real failure mode observed in this repo: a `wrangler.toml`
containing `name = "routime"` (capitalised as `"Routime"` was
rejected at deploy time with *Expected "name" to be of type string,
alphanumeric and lowercase with dashes only but got "Routime"*) and
a Pages-style `pages_build_output_dir
= "."` setting caused the Cloudflare Git connector to mis-detect the
project type as a hand-authored Worker, which then failed with
*"Missing entry-point to Worker script or to assets directory"*
because the file declared neither a `main` entry-point nor an
`[assets]` binding. Removing `wrangler.toml` sidestepped the issue.

That escape hatch stopped being necessary once Cloudflare's current
shape for static sites became the well-supported **Workers + static
assets** model (`[assets]` table, no `main`), which is the shape
`teclatlon`, `sinonimia`, `calculia` and `okeymoney` already use.
Routime adopted the same shape on 2026-08-21 because the project now
ships a `404.html` and needs `not_found_handling = "404-page"` to
make Cloudflare serve it on an unmatched path (without it, every
unmatched URL — stale bookmark, typo, link shared before a rename —
returns a bare empty 404 instead of the localised fallback). The
file is intentionally minimal: `name = "routime"`, `[assets]
directory = "."`, `not_found_handling = "404-page"`, no `main`, no
`compatibility_flags`. Same name and binding Cloudflare's dashboard
already has, so the Git connector detects the project as a Worker
with static assets rather than mis-falling back to hand-authored
deploy.

If the project ever needs a manual CLI deploy (for example, to attach
preview channels during a local debugging session), the same file
works out of the box: `npx wrangler deploy` from the repo root,
picking up `wrangler.toml` automatically.

## Configuration in Cloudflare

When the project is set up in the Cloudflare dashboard:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `.` |
| Production branch | `master` |
| Root directory | *(empty — repo root)* |

No environment variables are required: the app makes no server-side calls.

## Required Cloudflare headers

The site uses a `_headers` file at the repo root to set cache and
security headers. Cloudflare reads it on every deploy and applies the
rules automatically — no dashboard configuration needed.

## One-time setup

In the Cloudflare dashboard, **Workers & Pages → Create application →
Connect to Git**:

1. Select the Routime repository.
2. Set the **production branch** to `master`.
3. Leave **build command** empty — the repository root already is the
   build output. (Workers Builds may show this as "deploy command"
   instead of "build output directory"; leave that at its default too
   since there's no `wrangler.toml` telling it otherwise.)
4. (Optional) In **Settings → Build**, confirm the framework preset is
   "None".

If a project named `Routime` already exists from a previous
attempt in the wrong shape, delete it before creating this one —
that was the source of the deploy failure described in "Why still no
`wrangler.toml`?" the one time it happened here.

Cloudflare then builds and deploys every push to `master` (production)
and every pull request (preview channel, URL posted on the PR). No
GitHub secret is required, no `wrangler login` is needed locally.

The production URL is **https://routime.miralante.workers.dev** —
it follows the pattern `<project-name>.<account-subdomain>.workers.dev`
for the project named `Routime` in the dashboard, connected to the
`master` branch. (Not `routime.pages.dev` — see the note at the top
of this file.)

## Day-to-day deploys

Pushes to `master` and pull requests are picked up automatically by the
Cloudflare Git connector. The CI workflow (`.github/workflows/ci.yml`)
runs the structural, i18n and secrets checks on every PR but does **not**
deploy.

For a one-off preview outside the Git connector (e.g. to test a dirty
worktree without pushing), Wrangler can be invoked directly without any
project-side configuration file:

```bash
npx wrangler deploy --name routime --assets .
```

## Rollback

Cloudflare dashboard → Workers & Pages → `Routime` → **Deployments**.
Each successful build is listed with a timestamp. Click any of them
and select **"Retry deployment"** or **"Rollback to this deployment"**.

## Custom domain

`routime.apptonomia.uk` is served by this Cloudflare Workers
deployment. Firebase Hosting was decommissioned; the domain now
points to Cloudflare only.

**History (kept for context, no action needed).** The original
plan was the three-step migration below. It predates the correction
at the top of this file (Cloudflare ended up serving from a
`workers.dev` address, not `routime.pages.dev` as step 1 assumed),
and at one point Firebase was still live with no `_headers`
protection, so this section doubled as a real-gap warning. After
the rename to Routime and the domain switch to
`routime.apptonomia.uk`, the custom domain is correctly served by
Cloudflare and Firebase has been removed.

1. Add the domain to the Cloudflare project.
2. Update DNS at the registrar to the Cloudflare nameservers.
3. Remove the Firebase Hosting custom domain mapping **only after** the
   Cloudflare deployment is verified end-to-end (do not run the two at
   the same time).

## Compatibility notes

- `manifest.json` and `sw.js` use relative paths, so they work on any host
  without changes.
- Deep links such as `https://routime.miralante.workers.dev/tools/pairs/`
  resolve to the real `tools/pairs/index.html` automatically
  (Cloudflare's implicit `index.html` lookup per directory), so no
  rewrite rule is needed for them.
- Long-lived cache for fingerprinted JS/CSS/images is safe; the HTML
  entry points and `sw.js` are forced to `must-revalidate` so the PWA
  shell can update.
