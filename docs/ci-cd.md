# CI/CD Pipeline

## 1. Purpose

This document describes how changes to `ryanvalera-com` move from local development to production, and how caching is governed across that path. It covers the current deployment workflow, the cache governance model that supports it, how to validate a healthy deployment, and the automation planned to replace the current manual steps.

---

## 2. Current Deployment Workflow (v1.1.0)

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

**Developer** — Changes are made locally in WebStorm, with all git operations run through PowerShell.

**Local Validation** — Changes are validated in-browser before committing.

**Git Commit** — Commits follow Conventional Commits format, batched logically by feature.

**GitHub Push** — Pushed to `main` on `github.com/valeratech/ryanvalera-com`.

**GitHub Pages Deployment** — GitHub Pages builds and serves the pushed content as the primary origin.

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

CSS and JS references use a version query string pattern:

```html
<link rel="stylesheet" href="assets/css/styles.css?v=<release-version>">
<script src="assets/js/landing.js?v=<release-version>"></script>
```

**Current implementation:** `?v=1.1.0`, applied consistently across `index.html`, `profile.html`, `projects.html`, and `contact.html`, along with every shared `variables.css` reference.

### Rationale

HTML is revalidated frequently to ensure visitors receive the latest document, while static assets are cached aggressively. Asset versioning guarantees that new releases generate unique asset URLs, allowing long-lived caches without serving stale resources.

---

## 4. Validation

A healthy deployment satisfies the following:

- HTML documents reference the current release's versioned asset URLs.
- Versioned asset URLs return HTTP 200.
- HTML is revalidated at the configured interval (`cf-cache-status` transitions from `MISS` to `HIT` within the Edge TTL window, then re-validates after it expires).
- Static assets are served from cache (`cf-cache-status: HIT`) after the initial request, with `cache-control` reflecting the 1-month/1-week policy.
- The deployed HTML body — not just asset endpoint headers — is checked directly, since a versioned asset URL can return 200 independent of whether any live page actually references it.

---

## 5. Future Automation (Phase 6E Completion)

The current workflow relies on manual version bumps and manual Cloudflare cache purges. The next phase of 6E automates this via GitHub Actions.

**Workflow:** `deploy-and-purge.yml`

```text
Push → main
    ↓
Checkout
    ↓
Update asset version
    ↓
Deploy
    ↓
Cloudflare API: purge changed files
    ↓
Deployment complete
```

**Cloudflare API Purge** — Purges the specific changed HTML and asset URLs after each deployment, rather than purging the entire zone.

**GitHub Secrets** — Required for the workflow to authenticate against the Cloudflare API. Naming is not yet finalized across project documentation and needs to be reconciled before this workflow is written.

**Automatic Version Bump (future)** — Once the manual `?v=<release-version>` pattern is proven (current state), the Action will perform the version substitution automatically as part of deployment, rather than requiring a manual find-and-replace across the four HTML files.

---

## 6. Related Documentation

- [`docs/cache-governance.md`](./cache-governance.md) — Full Cloudflare/GitHub Pages caching model, purge procedures, and TTL roadmap.
- [`docs/architecture.md`](./architecture.md) — Platform architecture overview.
- `docs/decisions/ADR-005.md` — Cloudflare R2 future phase (referenced for planned media layer, not part of CI/CD scope).
