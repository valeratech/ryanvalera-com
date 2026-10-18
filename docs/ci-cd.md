# CI/CD Pipeline

## 1. Purpose

This document describes how changes to `ryanvalera-com` move from local development to production, and how caching is governed across that path. It covers the current deployment workflow (automated by the `pages-website-only` workflow and the Cloudflare Pages build), the cache governance model that supports it, how to validate a healthy deployment, and the step that stays manual: asset version bumps. No purge runs on deployment; the purge workflow was removed on 2026-10-10.

---

## 2. Current Deployment Workflow (current `main`; not a tagged release)

```text
Developer
    ↓
Local Validation
    ↓
Git Commit
    ↓
GitHub Push
    ↓
GitHub Pages Deployment
    ↓
Cloudflare Edge
    ↓
Validation
```

**Developer** — Changes are made locally in WebStorm.

**Local Validation** — Changes are validated in-browser before committing.

**Git Commit** — Commits follow Conventional Commits format, batched logically by feature.

**GitHub Push** — Pushed to `main` on `github.com/valeratech/ryanvalera-com`.

**GitHub Pages Deployment** — The `pages-website-only` workflow (`.github/workflows/pages.yml`) checks out the commit, runs `bash scripts/build-cloudflare-pages.sh`, uploads the resulting 36-file website artifact and deploys it to GitHub Pages, the primary origin. Its actions are pinned by commit SHA and it runs on `ubuntu-24.04`. Cloudflare Pages builds the same allowlist in parallel for the secondary origin, and both build logs print the content manifest.

**Cloudflare Edge** — Cloudflare sits in front of GitHub Pages (and Cloudflare Pages as secondary origin), applying DNS, SSL/TLS, WAF, Load Balancing, and the Cache Rules described below.

**Validation** — Deployment is confirmed healthy per the criteria in Section 4.

---

## 3. Cache Governance

### HTML Cache Policy

**Rule:** HTML Revalidation
**Match:** URI Path ends with `.html`, or URI Path equals `/`
**Edge TTL:** 10 minutes (explicit override)
**Browser TTL:** 10 minutes (explicit override)

### Static Asset Cache Policy

**Rule:** Static Assets Cache
**Match:** URI Path contains `/assets/`
**Edge TTL:** 1 month
**Browser TTL:** 1 week

### Asset Versioning

CSS, JS and image references carry a per-asset version query string:

```html
<link rel="stylesheet" href="assets/css/styles.css?v=<asset-version>">
<script src="assets/js/landing.js?v=<asset-version>"></script>
```

**Current implementation:** each asset carries its own version, from `?v=1.0.0` to `?v=1.7.7` as of October 2026 — CSS, JS and image references alike, in the pages (including `media.html`). Versions are bumped by hand.

### Rationale

HTML is revalidated frequently to ensure visitors receive the latest document, while static assets are cached aggressively. Asset versioning guarantees that new releases generate unique asset URLs, allowing long-lived caches without serving stale resources.

---

## 4. Validation

A healthy deployment satisfies the following:

- HTML documents reference the current versioned asset URLs (each asset's own `?v=` version).
- Versioned asset URLs return HTTP 200.
- Rule-covered HTML (`/` and `.html`), as observed on 2026-10-11: `REVALIDATED`, then `HIT` with `max-age=600`, and `HIT` again at ages 397 and 396 seconds, inside the 10-minute edge TTL. Revalidation after the edge TTL expires was not measured, and this is not a freshness guarantee. The extensionless page URLs are outside the rule and were answered `DYNAMIC`.
- Static assets are served from cache (`cf-cache-status: HIT`) after the initial request, with `cache-control` reflecting the 1-month/1-week policy.
- The deployed HTML body — not just asset endpoint headers — is checked directly, since a versioned asset URL can return 200 independent of whether any live page actually references it.

---

## 5. Future Automation



**Automatic Version Bump (future)** — not implemented. Asset versions are per asset and bumped by hand, and no deployment workflow substitutes them; automating the bump remains a deferred enhancement.

---

## 6. Security Gates

`.github/workflows/security-gates.yml` runs on **every push and pull request**. It is
**not a required status check**: `main` has no branch protection or rulesets (verified
October 2026), so a failing run reports the problem but does not block the push or merge.
It is independent of the deployment workflow: nothing about a successful Pages build
implies these checks passed.

| Step | What it enforces |
|---|---|
| Checkout | `fetch-depth: 0` — the full history, not the working tree |
| gitleaks | Pinned to the version that validated history clean; runs in Git-history mode over the full fetched history against `.gitleaks.toml` |
| Image metadata | Fails on GPS, camera, software, or artist tags anywhere in `assets/images` |
| Environment files | Fails if `.env`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `credentials.json`, or `.npmrc` are tracked |
| Success marker | Prints `SECURITY GATES PASSED` |

### Why full history rather than the working tree

Local pre-commit hooks are bypassable with `--no-verify`, and a secret introduced in an
earlier commit and "removed" later leaves a clean tree with a dirty history. Scanning
the full history on the server side does not depend on local hooks. It is still not an
enforcement point: a commit message containing `[skip ci]` skips push-triggered
workflows, and without a required status check a failure is reported after the fact.

### `.gitleaks.toml` philosophy

The allowlist permits specific **values**, never paths. A path exemption would create
precisely the blind spot the scan exists to close. `commits = []` is deliberate — a
finding is never silenced by SHA.

Validated before the gate was enabled: the full history was scanned locally and
returned zero leaks, *then* the workflow was set to fail the run on any finding.

### Verification is not complete until this is green

The cache-busted content checks used after a deploy confirm that bytes reached the
edge. They say nothing about whether the security gate passed. Both need checking.

---

## 7. Related Documentation

- [`docs/cache-governance.md`](./cache-governance.md) — Caching model, manual purge procedures, the retired purge workflow's history, and the TTL roadmap (future work).
- [`docs/architecture.md`](./architecture.md) — Platform architecture overview.
- `docs/decisions/ADR-005.md` — Cloudflare R2 future phase (referenced for planned media layer, not part of CI/CD scope).
- [`docs/media-preview.md`](./media-preview.md) — Media runtime standards, including the Evidence Tier that governs representative previews.
