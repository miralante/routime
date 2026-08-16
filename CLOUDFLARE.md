# Cloudflare Workers (static assets) — Apptonomia

> **Production branch & automatic deploy.** Apptonomia deploys
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
> title below. Confirmed by direct testing: `apptonomia.pages.dev`
> (the URL this file used to call "canonical") does not resolve at
> all, while `https://apptonomia.miralante.workers.dev` returns 200
> with real Cloudflare headers. See the sibling `teclatlon` and
> `sinonimia` repos' `CLOUDFLARE.md` for the same correction and how
> it was diagnosed.
>
> **`apptonomia.web.app` (Firebase Hosting) is still live and is what
> this repo's own README links to as "the App"** — it predates the
> Cloudflare migration described below in "Custom domain", which
> looks incomplete: that section says the Firebase mapping should be
> removed only after Cloudflare is verified end-to-end, but
> `apptonomia.web.app` still serves the site with **no `_headers`
> protection at all** (no CSP, no security headers — Firebase Hosting
> doesn't read that file). This needs a human decision (finish the
> DNS/custom-domain migration, or update the README link to point at
> the Workers URL) — not something to silently change here.

**Live URL:** <https://apptonomia.miralante.workers.dev>

Apptonomia is deployed as a **Cloudflare Worker (static assets)**
project, using the Cloudflare Git connector. There is no custom
GitHub Actions workflow that deploys, and — deliberately, see "Why
still no `wrangler.toml`?" below — no `wrangler.toml` in the repo;
the Cloudflare dashboard owns the build and deploy, and project
configuration lives entirely there.

## How it works

1. The repo `miralante/apptonomia` is connected to a Cloudflare
   Workers project named `apptonomia`.
2. Every push to `master` triggers a build in Cloudflare's
   infrastructure via Workers Builds.
3. The build is a no-op: no `build command`, no `output directory` other
   than `.`, so the static files are served as-is.
4. The `ci.yml` GitHub Action still runs on every push and PR to gate
   structural, i18n and secrets checks, but it does not deploy.

The `apptonomia.<account-subdomain>.workers.dev` address is assigned
by Cloudflare from the project name `apptonomia` declared in the
Cloudflare dashboard. The project name is **not** declared in the
repo — that avoids the "project type misdetected as Worker" failure
mode that a Pages-style `wrangler.toml` introduced here in the past
(see "Why still no `wrangler.toml`?" below).

## Files in this repository

| File | Purpose |
|---|---|
| `_headers` | Cache and security headers, replaces the old `firebase.json` `headers` |
| `.github/workflows/ci.yml` | `node scripts/check.js`, i18n smoke and secrets scan on every push/PR (does **not** deploy) |

No deploy-side configuration is committed: no `wrangler.toml`, no
`_redirects`, no `functions/`, no `_routes.json`, no Cloudflare
service-account keys. The dashboard is the source of truth for project
settings; the repo holds the static assets and the CI that gates them.

## Why no `_redirects`?

Cloudflare serves every static file in the repo automatically,
including the implicit `index.html` lookup for any directory: visiting
`/tools/pairs/` resolves to `tools/pairs/index.html`, `/team/` to
`team/index.html`, and so on, without any rewrite rule. Every section
of Apptonomia (`site/`, `tools/<slug>/` for all 68 activities,
`team/`, `about/`, `settings/`, `legal/`) ships its own real
`index.html`, so a catch-all rewrite is unnecessary and would in fact
break: the previous version had `/* /index.html 200` (Firebase-era
SPA rewrite) and Cloudflare rejected it with *"Infinite loop detected
in this rule"* because `/index.html` itself matches `/*` and would
re-trigger the rule indefinitely.

The root `/index.html` keeps its `<meta http-equiv="refresh">` to
`site/index.html` as a client-side entry pointer, the same way it did
under Firebase Hosting — that has nothing to do with the server-side
routing and does not cause a loop.

## Why still no `wrangler.toml`?

A `wrangler.toml` containing `name = "apptonomia"` and a Pages-style
`pages_build_output_dir = "."` setting looked correct, but in
practice the Cloudflare Git connector mis-detected the project type
when that file was present: it fell back to `wrangler deploy`
expecting a hand-authored Worker, which then failed with *"Missing
entry-point to Worker script or to assets directory"* because the
file declared neither a `main` entry-point nor an `[assets]` binding.
Removing `wrangler.toml` sidestepped the issue.

The sibling `teclatlon`, `sinonimia`, `calculia` and `okeymoney`
projects have since added back a `wrangler.toml` each — with the
correct shape (`[assets] directory = "."`, no `main`) — because it's
Cloudflare's currently recommended path and, for the ones with a
`404.html`, because `not_found_handling = "404-page"` is the only way
to make Cloudflare serve it (without it, an unmatched path gets a
bare empty 404). Apptonomia doesn't have a `404.html` to protect and
is the project every other sibling's deploy guide points to as
canonical, so — until there's a concrete reason to add one —
`wrangler.toml` stays out here on purpose, favouring the
lowest-risk path for the main project over strict consistency with
the siblings.

If the project ever needs a manual CLI deploy (for example, to attach
preview channels during a local debugging session), Wrangler can be
installed transiently via `npx wrangler deploy --name apptonomia
--assets .` from the repo root, without committing a `wrangler.toml`
or a `wrangler` devDependency.

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

1. Select the Apptonomia repository.
2. Set the **production branch** to `master`.
3. Leave **build command** empty — the repository root already is the
   build output. (Workers Builds may show this as "deploy command"
   instead of "build output directory"; leave that at its default too
   since there's no `wrangler.toml` telling it otherwise.)
4. (Optional) In **Settings → Build**, confirm the framework preset is
   "None".

If a project named `apptonomia` already exists from a previous
attempt in the wrong shape, delete it before creating this one —
that was the source of the deploy failure described in "Why still no
`wrangler.toml`?" the one time it happened here.

Cloudflare then builds and deploys every push to `master` (production)
and every pull request (preview channel, URL posted on the PR). No
GitHub secret is required, no `wrangler login` is needed locally.

The production URL is **https://apptonomia.miralante.workers.dev** —
it follows the pattern `<project-name>.<account-subdomain>.workers.dev`
for the project named `apptonomia` in the dashboard, connected to the
`master` branch. (Not `apptonomia.pages.dev` — see the note at the top
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
npx wrangler deploy --name apptonomia --assets .
```

## Rollback

Cloudflare dashboard → Workers & Pages → `apptonomia` → **Deployments**.
Each successful build is listed with a timestamp. Click any of them
and select **"Retry deployment"** or **"Rollback to this deployment"**.

## Custom domain

**Status as of this writing: this migration looks unfinished.** The
plan below predates the correction at the top of this file (Cloudflare
ended up serving from a `workers.dev` address, not `apptonomia.pages.dev`
as step 1 assumed), and `apptonomia.web.app` — the pre-migration
Firebase Hosting URL, still linked from this repo's own README — is
still live and still serving traffic with none of the `_headers`
protections. That's a real gap: verify with whoever owns the
Cloudflare/DNS/Firebase consoles whether the custom domain move ever
happened, and either finish it or decommission `apptonomia.web.app`
and repoint the README. Not something to change from a repo edit.

Original plan:

1. Add the domain to the Cloudflare project.
2. Update DNS at the registrar to the Cloudflare nameservers.
3. Remove the Firebase Hosting custom domain mapping **only after** the
   Cloudflare deployment is verified end-to-end (do not run the two at
   the same time).

## Compatibility notes

- `manifest.json` and `sw.js` use relative paths, so they work on any host
  without changes.
- Deep links such as `https://apptonomia.miralante.workers.dev/tools/pairs/`
  resolve to the real `tools/pairs/index.html` automatically
  (Cloudflare's implicit `index.html` lookup per directory), so no
  rewrite rule is needed for them.
- Long-lived cache for fingerprinted JS/CSS/images is safe; the HTML
  entry points and `sw.js` are forced to `must-revalidate` so the PWA
  shell can update.
