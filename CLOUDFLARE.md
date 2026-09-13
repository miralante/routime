# Cloudflare Workers (static assets) — Routime

> **Production branch & automatic deploy.** Routime deploys
> **automatically on every push to `master`** via the **Cloudflare
> Git connector**. The GitHub Actions workflow
> [`.github/workflows/validate.yml`](.github/workflows/validate.yml)
> runs `node scripts/check.js` on every push and PR but does **not**
> deploy. An optional self-hosted fallback
> [`.github/workflows/pages-deploy.yml`](.github/workflows/pages-deploy.yml)
> only runs if `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
> are set in GitHub secrets; otherwise it is a no-op. The Cloudflare
> dashboard is the source of truth for project settings.
>
> **This project is deployed as a Cloudflare Worker (static assets),
> not classic Cloudflare Pages.** Live at
> <https://routime.miralante.workers.dev>; the historical
> `routime.pages.dev` URL does not resolve. Same correction applies
> to the `teclatlon` and `sinonimia` apps of the suite.
> **`routime.apptonomia.uk`** is the canonical custom domain served
> by this deployment (Firebase Hosting was decommissioned).
>
> **Part of the Miralante suite.** Routime is one of the six
> runtime apps (Calculia, Memofun, Okeymoney, Routime, Sinonimia,
> Teclatlon) that share the same author, the same accessibility-first
> / no-backend philosophy, and the same Cloudflare deploy story.
> The canonical group-wide guide lives in
> [Apptonomia's `CLOUDFLARE.md`](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md);
> this document is the Routime-specific runbook on top of it.

## How it works

1. The repo is connected to a Cloudflare Workers project named
   `routime` (Workers & Pages → Connect to Git).
2. Every push to `master` triggers a build in Cloudflare's
   infrastructure via Workers Builds, which reads `wrangler.toml` to
   deploy the repo root as a static-assets Worker (no `main`
   script).
3. The build is a no-op: no `build command`, no `output directory`
   other than `.`, so the static files are served as-is.
4. The `validate.yml` GitHub Action still runs on every push and PR
   to gate content, but it does not deploy.

[`wrangler.toml`](wrangler.toml) is the actual deploy configuration
Workers Builds reads, not just a convenience for local CLI use: it
pins the project name (`name = "routime"`), the `[assets] directory
= "."` binding, and `not_found_handling = "404-page"` so Cloudflare
serves this repo's own `404.html` for an unmatched path instead of a
bare empty 404 (verified live). The file was re-added on 2026-08-21
specifically to enable the 404 fallback — keep it.

> **Do not "fix" by deleting `wrangler.toml`** or by switching to the
> legacy `pages_build_output_dir` Pages shape. Routime's Cloudflare
> dashboard project is already a Worker with "Workers Builds", and
> Cloudflare's current guidance is to prefer Workers + static assets
> over classic Pages for new static sites. The previous failure mode
> documented in git history (a `wrangler.toml` with a capitalised
> `name` and a `pages_build_output_dir` line, which made the Git
> connector mis-detect the project type) no longer applies because
> the current file uses only the `[assets]` table and no `main`.

## Files in this repository

| File | Purpose |
|---|---|
| `_headers` | Cache and security headers, replaces the old `firebase.json` `headers` |
| `wrangler.toml` | Pins the project name + the `[assets]` binding + `not_found_handling = "404-page"` |
| `.github/workflows/validate.yml` | `node scripts/check.js`, i18n smoke and secrets scan on every push/PR (does **not** deploy) |
| `.github/workflows/pages-deploy.yml` | Optional self-hosted fallback via Wrangler Action; no-op unless the two `CLOUDFLARE_*` secrets are set |

No `_redirects`, no `functions/`, no Cloudflare service-account
keys. Every section of the site (`site/`, `tools/<slug>/` for all
activities, `team/`, `about/`, `config/`, `legal/`) ships its own
real `index.html`, so Cloudflare's implicit per-directory
`index.html` lookup handles deep links (`/tools/pairs/` →
`tools/pairs/index.html`) without any rewrite rule. A catch-all
rewrite would in fact loop: `/index.html` itself matches `/*` and
would re-trigger the rule indefinitely.

The root `/index.html` keeps its `<meta http-equiv="refresh">` to
`site/index.html` as a client-side entry pointer — that has nothing
to do with server-side routing and does not cause a loop.

## Configuration in Cloudflare

When the project is set up in the Cloudflare dashboard:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `.` |
| Production branch | `master` |
| Root directory | *(empty — repo root)* |

No environment variables are required: the app makes no server-side
calls, and all assets (fonts, icons, activity data) are bundled in
the repo.

## Required Cloudflare headers

The site uses a [`_headers`](_headers) file at the repo root to set
security headers (CSP, X-Frame-Options, Referrer-Policy) and a
cache policy: HTML entry points, `404.html`, the manifest and
`sw.js` are forced to `must-revalidate` so the PWA shell can
update; fingerprinted JS/CSS/images get a 1-year immutable cache.
Cloudflare reads this file on every deploy and applies the rules
automatically — no dashboard configuration needed.

## How to redeploy

Nothing to do. Push to `master` and Cloudflare rebuilds.

For a manual rebuild (e.g. after Cloudflare itself had an
incident), go to the Cloudflare dashboard → Workers & Pages →
`routime` → **Create deployment** → choose a branch or upload a
directory.

For a one-off preview outside the Git connector (e.g. to test a
dirty worktree without pushing), Wrangler can be invoked directly
and picks up `wrangler.toml` automatically:

```bash
npx wrangler deploy
```

## How to roll back

Cloudflare dashboard → Workers & Pages → `routime` →
**Deployments**. Each successful build is listed with a timestamp.
Click any of them and select **"Retry deployment"** or **"Rollback
to this deployment"**.

## How to add a custom domain

Cloudflare dashboard → Workers & Pages → `routime` → **Custom
domains** → **Set up a custom domain** → follow the wizard. DNS is
configured automatically if the domain is already on Cloudflare, or
by CNAME if it is on another provider.

## Rotating credentials

There are no API tokens or secrets to rotate. The GitHub
integration is a one-time OAuth authorisation; revoking it is a
matter of removing the app's access on
[github.com/settings/applications](https://github.com/settings/applications).

## Compatibility notes

- `manifest.json` and `sw.js` use relative paths, so they work on
  any host without changes.
- Deep links such as
  `https://routime.miralante.workers.dev/tools/pairs/` resolve to
  the real `tools/pairs/index.html` automatically — no rewrite
  rule needed.
- Long-lived cache for fingerprinted JS/CSS/images is safe; the
  HTML entry points, `404.html`, `manifest.json` and `sw.js` are
  forced to `must-revalidate` so the PWA shell and the 404 page
  can update on the next visit.
