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

Use when only specific assets changed in a deployment.

```text
Cloudflare Dashboard
→ ryanvalera.com
→ Caching
→ Configuration
→ Purge Cache
→ Custom Purge
→ Enter specific URLs
```

Example URLs to purge after a CSS update:

```text
https://ryanvalera.com/assets/css/styles.css
https://ryanvalera.com/assets/css/profile.css
https://ryanvalera.com/assets/css/variables.css
```

Or via API:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      "https://ryanvalera.com/assets/css/styles.css",
      "https://ryanvalera.com/assets/css/profile.css",
      "https://ryanvalera.com/assets/css/variables.css"
    ]
  }'
```

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
# .github/workflows/deploy.yml (future)
- name: Purge Cloudflare cache
  run: |
    curl -X POST \
      "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CF_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      -d '{
        "files": [
          "https://ryanvalera.com/assets/css/styles.css",
          "https://ryanvalera.com/assets/css/profile.css",
          "https://ryanvalera.com/assets/css/variables.css",
          "https://ryanvalera.com/assets/js/landing.js",
          "https://ryanvalera.com/index.html",
          "https://ryanvalera.com/profile.html"
        ]
      }'
```

**Option 2 — Purge everything on every deployment (simpler)**

```yaml
- name: Purge Cloudflare cache
  run: |
    curl -X POST \
      "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CF_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      -d '{"purge_everything": true}'
```

Option 1 is preferred for production environments with meaningful traffic. Option 2 is acceptable for this project given the low traffic volume.

### Required GitHub Secrets

```text
CF_ZONE_ID    → Found in Cloudflare dashboard → ryanvalera.com → Overview (right sidebar)
CF_API_TOKEN  → Cloudflare API token with Zone.Cache Purge permission
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