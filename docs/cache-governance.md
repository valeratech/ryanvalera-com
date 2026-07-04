# Cache Governance

## Overview

This document explains how Cloudflare caching interacts with GitHub Pages deployments for this project, current cache configuration decisions, manual purge procedures, and the planned path toward automated cache invalidation.

---

## How Cloudflare Caching Works With GitHub Pages

Cloudflare does not automatically detect GitHub Pages deployments. There is no webhook, signal, or integration between GitHub Pages and Cloudflare's cache layer. When you push a commit to `main` and GitHub Pages deploys updated files, Cloudflare's edge nodes are not notified. Cached copies of your assets remain at the edge until one of the following occurs:

```text
1. TTL expires         → Cloudflare re-fetches from origin automatically
2. Manual purge        → You explicitly clear cached content via dashboard or API
3. Cache rule change   → New rule triggers re-evaluation of cached objects
4. New asset path      → Browser requests a URL Cloudflare has never cached
```

This means a visitor hitting `ryanvalera.com/assets/css/styles.css` immediately after a deployment may receive the previous version of the file until the edge TTL expires or a purge is triggered.

---

## Current Cache Configuration

### Phase: Active Development

During active development, cache durations are kept conservative to ensure updates are visible quickly without requiring manual purges after every commit.

| Asset Type | URI Pattern | Edge TTL | Browser TTL | Rationale |
|---|---|---|---|---|
| CSS / JS / Images | `/assets/*` | 1 month | 1 week | Static assets rarely change mid-session; long TTL reduces origin load |
| HTML | `/`, `/*.html` | GitHub default (10 min) | GitHub default | Conservative during active iteration |

**Current cache rule:**

```text
Rule name: Static Assets Cache
Match:     URI Path contains /assets/
Edge TTL:  1 month (2592000 seconds)
Browser TTL: 1 week (604800 seconds)
```

### Why HTML Is Left at GitHub's Default for Now

GitHub Pages sends `cache-control: max-age=600` (10 minutes) for HTML files. Cloudflare currently respects this without override. This is intentional during active development — 10-minute TTLs mean page content updates are visible within minutes without any manual intervention.

Once the site stabilizes and commits become less frequent, HTML TTLs can be extended.

---

## Cache Validation

After any deployment, confirm cache behavior with:

```bash
# Run each twice — first request may MISS, second should HIT
curl -I https://ryanvalera.com/assets/css/styles.css
curl -I https://ryanvalera.com/assets/css/profile.css
curl -I https://ryanvalera.com/assets/images/ryan-valera-profile.png
```

Expected progression:

```text
First request:  cf-cache-status: MISS  → fetched from GitHub Pages origin
Second request: cf-cache-status: HIT   → served from Cloudflare edge
```

If `cf-cache-status` remains `DYNAMIC`, the cache rule is not matching. Check:

```text
1. URI path pattern matches correctly (/assets/ vs /assets)
2. Cache eligibility is set to "Eligible for cache"
3. Edge TTL override is enabled
4. Allow a few minutes for rule propagation
```

---

## Manual Cache Purge Procedures

### Available Purge Methods (Plan Tier Reference)

Cloudflare's `purge_cache` API supports five purge modes: `purge_everything`, `files` (exact single-file/URL purge), `prefixes`, `hosts`, and `tags` (the last requires Cache-Tag response headers, not currently in use on this site). Only one mode may be used per API call — they cannot be combined in a single request.

**As of April 2025, all five purge modes are available on every Cloudflare plan tier, including Free.** Prior to that date, Purge by Prefix and Purge by Tag were Enterprise-only; this is no longer the case. ([Cloudflare changelog, April 1, 2025](https://developers.cloudflare.com/changelog/post/2025-04-01-purge-for-all/)) This matters directly for this project: `media.html`'s purge strategy (below) relies on Purge by Prefix, which would not have been usable on this zone's plan tier before that change.

---

### Purge Everything (Nuclear Option)

Use when a major deployment has changed multiple files and you need all cached content refreshed immediately.

```text
Cloudflare Dashboard
→ ryanvalera.com
→ Caching
→ Configuration
→ Purge Cache
→ Purge Everything
```

Or via API:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{"purge_everything": true}'
```

**Warning:** Purge Everything clears all cached assets across all Cloudflare edge nodes globally. The next requests for every asset will hit origin directly until the cache is rebuilt. On a low-traffic site this is fine. On a high-traffic site, this creates a temporary origin load spike.

---

### Purge Specific Files

Use after a deployment to ensure visitors immediately receive the current HTML, rather than waiting up to the 10-minute Edge TTL for natural revalidation.

```text
Cloudflare Dashboard
→ ryanvalera.com
→ Caching
→ Configuration
→ Purge Cache
→ Custom Purge
→ Enter specific URLs
```

Purge target — HTML documents only:

```text
https://ryanvalera.com/
https://ryanvalera.com/index.html
https://ryanvalera.com/profile.html
https://ryanvalera.com/projects.html
https://ryanvalera.com/contact.html
```

Plus a separate prefix purge for `media.html`, covering every `?project=` variant in one call:

```text
https://ryanvalera.com/media.html
```

**media.html note:** Cloudflare caches by full URL including the query string, so `media.html?project=aivp` is a distinct cache key from bare `media.html`. A prefix purge on `media.html` invalidates any URL starting with that string regardless of query string — covering all current and future `?project=` variants in a single call, with no per-project list to maintain. See "Available Purge Methods" above for plan-tier availability. This is a *separate API call* from the exact-file purge above — the Cloudflare API accepts one purge mode per request, not a mix.

Or via API — two calls, since `files` and `prefixes` can't be combined in one request:

```bash
# Exact-file purge for the five static documents
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      "https://ryanvalera.com/",
      "https://ryanvalera.com/index.html",
      "https://ryanvalera.com/profile.html",
      "https://ryanvalera.com/projects.html",
      "https://ryanvalera.com/contact.html"
    ]
  }'

# Prefix purge for media.html — catches every ?project= variant
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "prefixes": [
      "https://ryanvalera.com/media.html"
    ]
  }'
```

**Why CSS/JS assets are not purged under normal deployments:** Assets are referenced with a `?v=<release-version>` query string. Bumping that string produces a new URL, which is a new cache key — Cloudflare and browsers treat it as content they've never seen, regardless of what's cached under the old version string. The old cached copy simply becomes unreferenced and ages out on its own; purging it accomplishes nothing a version bump hasn't already accomplished.

**Exception — emergency asset purge:** If an asset needs to be corrected *without* a version bump (e.g., a rollback, or a same-version hotfix), purge that specific asset URL manually using the same Custom Purge flow above. This is a deliberate exception for out-of-band correction, not part of the standard deployment path.

---

## Future: CI/CD-Based Cache Invalidation

### The Problem This Solves

Manual purges are operationally fragile — they require a human to remember to purge after every deployment, and they're easy to forget. The correct long-term solution is automating cache invalidation as part of the GitHub Actions deployment pipeline.

### Planned Implementation

When the GitHub Actions CI/CD workflow is built (Milestone 6E), it will include a cache purge step that runs automatically after every successful deployment:

```text
git push → main
      ↓
GitHub Actions
      ↓
Deploy to GitHub Pages
      ↓
Sync to Cloudflare Pages (secondary origin)
      ↓
Cloudflare API: Purge changed files
      ↓
Deployment complete — cache is fresh
```

### Implementation Approach

Two options, in order of preference:

**Option 1 — Purge specific changed files (preferred)**

```yaml
# .github/workflows/deploy-and-purge.yml
- name: Purge static HTML documents
  run: |
    curl -X POST \
      "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      -d '{
        "files": [
          "https://ryanvalera.com/",
          "https://ryanvalera.com/index.html",
          "https://ryanvalera.com/profile.html",
          "https://ryanvalera.com/projects.html",
          "https://ryanvalera.com/contact.html"
        ]
      }'

- name: Purge media.html (prefix, covers all ?project= variants)
  run: |
    curl -X POST \
      "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      -d '{
        "prefixes": [
          "https://ryanvalera.com/media.html"
        ]
      }'
```

CSS/JS assets are intentionally excluded from both lists — see "Why CSS/JS assets are not purged under normal deployments" above. Only HTML documents need purging, since they're the only URLs that stay constant across deployments.

**Option 2 — Purge everything on every deployment (simpler)**

```yaml
- name: Purge Cloudflare cache
  run: |
    curl -X POST \
      "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      -d '{"purge_everything": true}'
```

Option 1 is preferred for production environments with meaningful traffic. Option 2 is acceptable for this project given the low traffic volume.

### Required GitHub Secrets

```text
CLOUDFLARE_API_TOKEN  → Cloudflare API token with Zone.Cache Purge permission
CLOUDFLARE_ZONE_ID    → Found in Cloudflare dashboard → ryanvalera.com → Overview (right sidebar)
SITE_URL               → https://ryanvalera.com (used for post-deploy validation requests)
```

---

## Cache TTL Roadmap

```text
Current (Active Development)
  HTML:   10 minutes (GitHub default)
  Assets: 1 month edge / 1 week browser

Phase: Site Stable, CI/CD Purge Active
  HTML:   1 hour edge / 30 minutes browser
  Assets: 1 month edge / 1 week browser
  Purge:  Automated via GitHub Actions on every deployment

Phase: Long-term Production
  HTML:   4 hours edge / 1 hour browser
  Assets: 1 year edge / 1 month browser (with versioned filenames)
  Purge:  Automated + versioned asset paths as cache-busting strategy
```

---

## Related Documentation

- `docs/architecture.md` — Full platform architecture
- `docs/cloudflare.md` — Cloudflare configuration reference
- `docs/decisions/ADR-004.md` — Why Cloudflare Load Balancing was implemented